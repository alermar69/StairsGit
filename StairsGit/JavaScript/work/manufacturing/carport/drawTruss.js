
/** функция отрисовывает прямую ферму из листа с отверстиями
	*@params: height,len,dxfBasePoint
	colDist - расстояние между колоннами
	базовая точка по X - центр отверстия
*/
function drawStrightTruss(par){

	if(!par) par = {};
	if(!par.dxfBasePoint) par.dxfBasePoint = {x:0, y:0};
	if(!par.dxfArr) par.dxfArr = [];
	par.mesh = new THREE.Object3D();
	var stripeWidth = partPar.beam.profSize.x
	par.flanWidth = stripeWidth - partPar.truss.thk;
	par.height = partPar.beam.profSize.y
	par.stripeThk = 4;

	//внешний контур
	var p1 = {x: 0, y: 0}
	var p2 = {x: 0, y: par.height - par.stripeThk * 2}
	var p3 = {x: par.len, y: par.height - par.stripeThk * 2}
	var p4 = {x: par.len, y: 0}

	//создаем шейп
	var shapePar = {
		points: [p1,p2,p3,p4],
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		//radOut:20,
	}

	var shape = drawShapeByPoints2(shapePar).shape;
	
	//большие отверстия
	var holeStep = 500;
	var sideWidth = 100;
	var bridgeWidth = 60;
	
	var holeAmt = Math.floor((par.len - sideWidth * 2 + bridgeWidth) / holeStep)
	var holeStep = (par.len - sideWidth * 2 + bridgeWidth) / holeAmt;
	
	
	for(var i=0; i<holeAmt; i++ ){
		var ph1 = newPoint_xy(p1, sideWidth + holeStep * i, bridgeWidth)
		var ph2 = newPoint_xy(ph1, 0, par.height - bridgeWidth * 2)
		var ph3 = newPoint_xy(ph1, holeStep - bridgeWidth, par.height - bridgeWidth * 2)
		var ph4 = newPoint_xy(ph1, holeStep - bridgeWidth, 0)
		
		//создаем шейп отверстия
		var shapePar = {
			points: [ph1, ph2, ph3, ph4],
			dxfArr: par.dxfArr,
			dxfBasePoint: par.dxfBasePoint,
			radOut: 20,
		}

		var holeShape = drawShapeByPoints2(shapePar).shape;
		
		shape.holes.push(holeShape)
	}
	
	var extrudeOptions = {
		amount: partPar.truss.thk, 
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
		
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var truss = new THREE.Mesh(geom, params.materials.metal);
	truss.position.y = 4; //4 - толщина нижней полки швеллера
	truss.position.z = -par.flanWidth / 2 - partPar.truss.thk;
	if(par.isLeft) truss.position.z = par.flanWidth / 2
	truss.position.y = par.stripeThk;
	par.mesh.add(truss);
	truss.setLayer('carcas');
	
	//полки швеллера
	var posZ = truss.position.z
	if(par.isLeft) posZ -= stripeWidth - partPar.truss.thk

	var stripeParTop = {
		poleProfileY: par.stripeThk,
		poleProfileZ: stripeWidth,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, -100),
		length: par.len,
		poleAngle: 0,
		material: params.materials.metal,
		dxfArr: [],
		type: 'rect',
	};
	
	
	var stripe = drawPole3D_4(stripeParTop).mesh;
	stripe.position.x = 0
	stripe.position.y = 0
	stripe.position.z = posZ
	par.mesh.add(stripe);
	stripe.setLayer('carcas');
	
	var stripe = drawPole3D_4(stripeParTop).mesh;
	stripe.position.x = 0
	stripe.position.y = par.height - par.stripeThk;
	stripe.position.z = posZ
	par.mesh.add(stripe);
	stripe.setLayer('carcas');
	
	

//фланцы крепления к колоннам

	var columnFlanPar = calcColumnFlanPar();
	var holeOffset = (par.height - partPar.beam.holeDist) / 2 - par.stripeThk;

	var flanPar = {
		height: par.height - par.stripeThk * 2,
		width: par.flanWidth,
		thk: columnFlanPar.thk,
		//cornerRad: 20,
		holeRad: columnFlanPar.holeDiam / 2,
		noBolts: true,
		dxfArr: par.dxfArr,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, -500),
		roundHoleCenters: [
			//{ x: par.flanWidth / 2, y: holeOffset - stripeParTop.poleProfileY},
			{ x: par.flanWidth / 2, y: holeOffset },
			{ x: par.flanWidth / 2, y: holeOffset + partPar.beam.holeDist },
		],
	}

	var startFlan = drawRectFlan2(flanPar).mesh;
	startFlan.rotation.y = Math.PI / 2;
	startFlan.position.y = par.stripeThk;
	startFlan.position.z = flanPar.width / 2;
	startFlan.position.y = truss.position.y;
	par.mesh.add(startFlan);

	flanPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, par.len, -500);
	var endFlan = drawRectFlan2(flanPar).mesh;
	endFlan.rotation.y = Math.PI / 2;
	endFlan.position.x = par.len - flanPar.thk;
	endFlan.position.y = par.stripeThk;
	endFlan.position.z = flanPar.width / 2;
	endFlan.position.y = truss.position.y;
	par.mesh.add(endFlan);
	


	var box3 = new THREE.Box3().setFromObject(truss);
	var s = ((box3.max.x - box3.min.x) / 1000) * ((box3.max.y - box3.min.y) / 1000);
	var partName = "trussSide";
	if (typeof specObj != 'undefined') {
		name = par.len + "х" + par.height + "х" + partPar.truss.thk;
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				area: 0,
				name: "Ферма боковая",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "carcas",
			}
		}
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["sumLength"] += Math.round(par.len / 100) / 10;
		specObj[partName]["area"] += s;
		truss.specParams = {specObj: specObj, amt: 1, area: s, partName: partName, name: name}
	}
	truss.specId = partName + name;
	
	return par;
}


/** функция отрисовывает треугольную ферму из листа с отверстиями
	*@params: height,len,dxfBasePoint
	model: "сужающаяся", "постоянной ширины"
	holesModel: "вытянутые", "круги"
	обозначения размеров 6692035.ru/drawings/carport/triangleTruss.png
	
*/
function drawTriangleSheetTruss(par){
	if(!par) par = {};
	if(!par.dxfBasePoint) par.dxfBasePoint = {x:0, y:0};
	if(!par.dxfArr) par.dxfArr = [];
	par.mesh = new THREE.Object3D();
	
	par.len = params.width / 2;
	if(params.carportType == "односкатный") par.len = params.width
	if (params.carportType == "фронтальный") par.len = params.sectLen * params.sectAmt
	
	//параметры
	par.midHeight = partPar.truss.midHeight// высота фермы в середине по вертикали
	par.endHeight = partPar.truss.endHeight; 
	par.columnBase = 200;
	par.topAng = params.roofAng;
	par.flanThk = 8;


	//внешний контур
	var p0 = {x: 0, y: 0}
	var pt = newPoint_xy(p0, 0, partPar.truss.endHeight) //точка на верхней линии над осью колонны
	
	
	//нижняя линия
	var botLine = {
		p1: newPoint_xy(p0, -par.columnBase / 2, 0),
		p2: newPoint_xy(p0, 120, 0),
	}
		
	//верхняя линия
	var topLine = {
		p1: copyPoint(pt),
		p2: polar(pt, par.topAng / 180 * Math.PI, 100), //временная точка
	}
	
	
	var leftLine = {
		p1: newPoint_xy(p0, -partPar.column.profSize.y / 2 - params.sideOffset, 0)
	}
	//if (params.carportType == "фронтальный") leftLine.p1 = newPoint_xy(p0, -partPar.column.profSize.y / 2 - params.sideOffset, 0)
	leftLine.p2 = newPoint_xy(leftLine.p1, 0, 1)
	//крайняя точка фермы
	topLine.p1 = itercectionLines(topLine, leftLine)
	
	//пересчитываем точку нижней линии для большого свеса
	var temp = itercection(topLine.p1, polar(topLine.p1, (par.topAng - 90) / 180 * Math.PI, 1), botLine.p1, botLine.p2);
	//если высота фермы на краю получается меньше 70 - делаем 70
	if(distance(temp, topLine.p1) < 70) temp = polar(topLine.p1, (par.topAng - 90) / 180 * Math.PI, 70);
	if(temp.x < botLine.p1.x) botLine.p1 = temp;
	
	//добавляем еще одну точку если конец фермы ниже уровня верха колонны
	if(botLine.p1.y < botLine.p2.y) botLine.p21 = newPoint_xy(botLine.p2, -par.columnBase, 0)
	
	//правая линия
	var rightLine = {
		p1: {x: topLine.p1.x + par.len, y: 0,}, //временная точка
	}
	if (params.carportType == "фронтальный") rightLine.p1 = { x: par.len - partPar.column.profSize.x + params.sideOffset, y: 0 }
	if(params.carportType == "двухскатный") rightLine.p1.x -= par.flanThk / 2
		
	rightLine.p2 = newPoint_xy(rightLine.p1, 0, 100) //временная точка
	
	rightLine.p1 = itercectionLines(rightLine, topLine)
	rightLine.p2 = newPoint_xy(rightLine.p1, 0, -par.midHeight)
	
	if(params.beamModel == "постоянной ширины"){
		botLine.p2 = itercection(rightLine.p2, polar(rightLine.p2, par.topAng / 180 * Math.PI, 1), botLine.p2, newPoint_xy(botLine.p2, 1, 0))
	}

	//верхний свес и горизонтальная полка под колонну сверху на односкатном навесе
	//обозначение точек здесь https://6692035.ru/drawings/carport/trussTop.png
	if (params.carportType == "односкатный" || params.carportType == "фронтальный") {
		
		//корректируем правую точку, т.к. par.midHeight это высота над колонной, а не на краю
		topLine.p2 = newPoint_x(pt, partPar.main.colDist, par.topAng / 180 * Math.PI) //точка над центром верхней колонны на верхней линии
		if (params.carportType == "фронтальный") {
			topLine.p2 = newPoint_x(pt, par.len - partPar.column.profSize.x, par.topAng / 180 * Math.PI)
		}
			 //точка над центром верхней колонны на верхней линии
		botLine.p3 = newPoint_xy(topLine.p2, 0, -par.midHeight) //точка на нижней линии над центром колонны
		rightLine.p2 = itercection(botLine.p2, botLine.p3, rightLine.p1, rightLine.p2) //нижняя точка правой линии
		
		
		rightLine.p3 = newPoint_xy(botLine.p3, partPar.column.profSize.y / 2, 0)
		
		rightLine.p4 = newPoint_x(rightLine.p3, -partPar.column.profSize.y - 10, 0)
		rightLine.p5 = itercection(rightLine.p2, botLine.p2, rightLine.p4, newPoint_xy(rightLine.p4, 0, 1))
		
		rightLine.p21 = copyPoint(rightLine.p2)
		if ((params.carportType == "односкатный" && params.sideOffsetTop > 10) || (params.carportType == "фронтальный" && params.sideOffset > 10)) {
			rightLine.p21 = newPoint_xy(rightLine.p1, 0, -100) //уменьшаем высоту верхнего конца фермы
			rightLine.p3 = newPoint_xy(rightLine.p3, 10, 0) //увеличиваем опорную площадку
		};
	}

	//делаем ферму цельной если длина меньше 4000мм
	par.hasDivide = true;
	var points = [botLine.p1, topLine.p1, rightLine.p1];
	
	if(rightLine.p3) points.push(rightLine.p21, rightLine.p3, rightLine.p4, rightLine.p5)
	else points.push(rightLine.p2)

	points.push(botLine.p2)
	if (botLine.p21) points.push(botLine.p21)

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		radOut: 0,
	}
	

		
	par.shape = drawShapeByPoints2(shapePar).shape;

	//большие отверстия
	var holeCornerRad = 40
	if(partPar.truss.midHeight < 250) holeCornerRad = 30
	var holeAmt = partPar.purlin.amt * 2
	var holeStepX = partPar.purlin.holeStepX / 2
	if(params.carportType == "двухскатный") holeStepX *= 0.5
	if(params.roofMat == "металлочерепица") holeStepX *= 2

	//строим отверстия справа налево
	var holeLeftLine = rightLine;
	var holeBotLine = parallel(rightLine.p2, botLine.p2, partPar.truss.bridgeWidth)
	var holeTopLine = parallel(topLine.p1, topLine.p2, -partPar.truss.bridgeWidth)


	if(params.trussHolesType == "круги"){
		var maxHoleDiam = distance(rightLine.p1, rightLine.p2) * Math.cos(partPar.main.roofAng) - partPar.truss.sideWidth * 2;		
		holeStepX = maxHoleDiam + partPar.truss.bridgeWidth;
		holeAmt = Math.floor(params.width / holeStepX)
		if (params.carportType == "фронтальный") holeAmt = Math.floor(params.width * params.sectAmt / holeStepX)
		holeLeftLine = parallel(holeLeftLine.p1, holeLeftLine.p2, maxHoleDiam / 2 +  partPar.truss.bridgeWidth)
	}
	
	//смещаем крайнее отверстие чтобы было место для фланца крепления к колонне
	if (params.carportType == "односкатный" || params.carportType == "фронтальный") {
		//var offsetRight = holeStepX - partPar.truss.bridgeWidth / 2;
		var offsetRight = params.sideOffsetTop + 200; //200 - ширина фланца колонны
		if (params.carportType == "фронтальный") offsetRight = params.sideOffset + 200; //200 - ширина фланца колонны
		
		holeLeftLine = parallel(holeLeftLine.p1, holeLeftLine.p2, offsetRight)
		if(params.trussHolesType == "круги") holeLeftLine = parallel(holeLeftLine.p1, holeLeftLine.p2, maxHoleDiam / 2)
	//	holeAmt -= 2;
	}

	par.progonAmt = Math.floor(distance(topLine.p1, rightLine.p1) / params.progonMaxStep) + 2;
	
	var counter = 0
	while(holeLeftLine.p1.x > 150 + holeStepX + partPar.truss.bridgeWidth && counter < holeAmt){
		var holeRightLine = parallel(holeLeftLine.p1, holeLeftLine.p2, partPar.truss.bridgeWidth)		
		holeLeftLine = parallel(holeLeftLine.p1, holeLeftLine.p2, (holeStepX))

		
		//корректируем левую линию вытянутого отверстия, если она накладывается на левый фланец		
		if(params.trussHolesType != "круги" && holeLeftLine.p1.x < 120 + 5) {
			holeLeftLine.p1.x = holeLeftLine.p2.x = 125;
			if(params.trussHolesType == "круги") break;
		}
		
		var ph1 = itercectionLines(holeLeftLine, holeBotLine) //левая нижняя
		var ph2 = itercectionLines(holeLeftLine, holeTopLine) //левая верхняя
		var ph3 = itercectionLines(holeRightLine, holeTopLine) //правая верхняя
		var ph4 = itercectionLines(holeRightLine, holeBotLine) //правая нижняя
		var holePoints = [ph1, ph2, ph3, ph4];
		
		//если для последнего отверстия меньшая высота меньше удвоенного радиуса, делаем треугольное отверстие
		if(params.beamModel == "сужающаяся" && (ph2.y - ph1.y) < holeCornerRad * 2){
			ph1 = itercectionLines(holeTopLine, holeBotLine)
			ph1.filletRad = 10; //минимальный радиус
			
			if(ph3.y - ph4.y < holeCornerRad * 2){
				ph3.filletRad = ph4.filletRad = (ph3.y - ph4.y) * 0.4 //0.4 - подогнано
			}
				
			holePoints = [ph1, ph3, ph4];
			
		}
		
		if(params.trussHolesType != "круги"){
			//создаем шейп отверстия
			var shapePar = {
				points: holePoints,
				dxfArr: par.dxfArr,
				dxfBasePoint: par.dxfBasePoint,
				radOut: holeCornerRad,
			}

			var holeShape = drawShapeByPoints2(shapePar).shape;
			par.shape.holes.push(holeShape)
		}
		
		if(params.trussHolesType == "круги"){
			var holeDiam = distance(ph3, ph4)
			
			var center = {
				x: (ph3.x + ph4.x) / 2,
				y: (ph3.y + ph4.y) / 2,
			}
			
			//завершаем цикл, если отверстие накладывается на левый фланец		
			if(center.x - holeDiam / 2 < 120) break;
			
			addRoundHole(par.shape, par.dxfArr, center, holeDiam / 2, par.dxfBasePoint)
		}
		counter++;
	}
	
	//отверстия для болтов

	//отверстия под фланцы колонн
	if (params.trussType !== "балки") {
		var flanPar = calcColumnFlanPar();
		flanPar.holes.forEach(function (center) {
			addRoundHole(par.shape, par.dxfArr, center, flanPar.holeDiam / 2, par.dxfBasePoint);
			if (!par.hasDivide && params.carportType == "двухскатный") {
				var center1 = copyPoint(center);
				center1.x = center1.x * (-1) + rightLine.p2.x * 2;
				addRoundHole(par.shape, par.dxfArr, center1, flanPar.holeDiam / 2, par.dxfBasePoint);
			}
		})

		//отверстия под верхний фланец односкатного навеса	
		if (params.carportType == "односкатный" || params.carportType == "фронтальный") {
			var flanPar = calcColumnFlanPar({ isTop: true })
			flanPar.holes.forEach(function (center) {
				var center1 = copyPoint(center);
				center1.x = center1.x * (-1) + rightLine.p3.x - partPar.column.profSize.y / 2;
				center1.y = center1.y + rightLine.p3.y;

				addRoundHole(par.shape, par.dxfArr, center1, flanPar.holeDiam / 2, par.dxfBasePoint);
			})
		}
	}
	
	
	
	
	var extrudeOptions = {
		amount: partPar.truss.thk, 
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
		
	var geom = new THREE.ExtrudeGeometry(par.shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var truss = new THREE.Mesh(geom, params.materials.metal);
	if (params.carportType == "двухскатный") truss.position.x -= par.flanThk / 2
	par.mesh.add(truss);
	truss.setLayer('carcas');

	//полоса сверху
	var stripeWidth = 60;

	var stripeParTop = {
		poleProfileY: partPar.truss.stripeThk,
		poleProfileZ: stripeWidth,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, topLine.p1.x, topLine.p1.y),
		length: distance(topLine.p1, rightLine.p1),
		poleAngle: angle(topLine.p1, rightLine.p1),
		material: params.materials.metal,
		dxfArr: [],
		type: 'rect',
	};

	var stripe = drawPole3D_4(stripeParTop).mesh;
	stripe.position.x = topLine.p1.x
	if (params.carportType == "двухскатный") stripe.position.x -= par.flanThk / 2
	stripe.position.y = topLine.p1.y
	stripe.position.z = -stripeParTop.poleProfileZ / 2 + partPar.truss.thk / 2;
	par.mesh.add(stripe);
	stripe.setLayer('carcas');
	
	//полоса снизу
	var stripeParBot = {
		poleProfileY: partPar.truss.stripeThk,
		poleProfileZ: stripeWidth,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, topLine.p1.x, topLine.p1.y),
		length: distance(botLine.p2, rightLine.p2),
		poleAngle: angle(botLine.p2, rightLine.p2),
		material: params.materials.metal,
		dxfArr: [],
		type: 'rect',
	};
	
	if (params.carportType == "односкатный" || params.carportType == "фронтальный") {
		
		stripeParBot.length = distance(botLine.p2, rightLine.p3) - 200; //чтобы полоса сверху не пересекалась с фланцем колонны
	}
	
	var basePoint = polar(botLine.p2, (stripeParBot.poleAngle + Math.PI / 2), -stripeParBot.poleProfileY)
	stripeParBot.dxfBasePoint = newPoint_xy(par.dxfBasePoint, basePoint.x, basePoint.y);
	
	var stripe = drawPole3D_4(stripeParBot).mesh;
	stripe.position.x = basePoint.x
	if (params.carportType == "двухскатный") stripe.position.x -= par.flanThk / 2
	stripe.position.y = basePoint.y - 0.1
	stripe.position.z = -stripeParBot.poleProfileZ / 2 + partPar.truss.thk / 2;
	par.mesh.add(stripe);
	stripe.setLayer('carcas');

	//фланец крепления к колонне
	if (params.trussType !== "балки") {
		//левый

		var flanParams = {
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, -500),
			dxfPrimitivesArr: par.dxfArr,
		}

		var flan = drawColumnFlan(flanParams).mesh;
		flan.position.z = -flanParams.thk;
		if (params.carportType == "двухскатный") flan.position.x = -par.flanThk / 2
		par.mesh.add(flan);

		//правый фланец	
		if (params.carportType == "односкатный" || params.carportType == "фронтальный") flanParams.isTop = true;
		flanParams.dxfBasePoint = newPoint_xy(par.dxfBasePoint, params.width, -500);
		var flan = drawColumnFlan(flanParams).mesh;
		flan.rotation.y = Math.PI
		flan.position.x = rightLine.p2.x * 2
		if (params.carportType == "двухскатный") {
			flan.position.x += par.flanThk / 2
			//flan.position.z = -partPar.truss.thk;
		}
		if (params.carportType == "односкатный" || params.carportType == "фронтальный") {
			flan.position.x = rightLine.p3.x - partPar.column.profSize.y / 2
			flan.position.y = rightLine.p3.y
		}
		par.mesh.add(flan);
	}
	

	//узел стыковки фермы с балкой
	if (params.trussType == "балки") {

		var flanPar = {
			height: 100,
			thk: 4,
			thkTruss: 4,
			dxfArr: par.dxfArr,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, -500),
		}

		//левое соединение	
		var connect = drawConnectBalTruss(flanPar).mesh;
		par.mesh.add(connect);

		//правое соединение
		flanPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, -700);
		if (params.carportType == "односкатный" || params.carportType == "фронтальный") {
			flanPar.isTop = true;
			//flanPar.height = rightLine.p3.y - partPar.main.deltaHeight;
		}

		var connect = drawConnectBalTruss(flanPar).mesh;
		connect.rotation.y = Math.PI;
		connect.position.z = flanPar.thkTruss;
		connect.position.x = rightLine.p2.x * 2

		if (params.carportType == "односкатный" || params.carportType == "фронтальный") {
			connect.position.x = rightLine.p3.x - partPar.column.profSize.y / 2
			connect.position.y = rightLine.p3.y;
		}
		par.mesh.add(connect);
	}
	
	//соединительный фланец
	if(params.carportType == "двухскатный"){
		var flanHeight = distance(rightLine.p1, rightLine.p2)
		var flanPar = {
			height: flanHeight,
			width: stripeWidth,
			thk: par.flanThk,
			cornerRad: 0,
			holeRad: 7,
			noBolts: true,
			dxfPrimitivesArr: par.dxfPrimitivesArr,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, params.width / 2, -500),
			roundHoleCenters: [
				{x: 15, y: 15},
				{x: 15, y: 45},
				{x: 15, y: flanHeight - 15},
				{x: stripeWidth - 15, y: 15},
				{x: stripeWidth - 15, y: 45},
				{x: stripeWidth - 15, y: flanHeight - 15},
			],
		}
		
		var flan = drawRectFlan2(flanPar).mesh;
		flan.rotation.y = Math.PI / 2;
		flan.position.x = rightLine.p2.x - par.flanThk / 2
		flan.position.y = rightLine.p2.y
		// flan.position.z = stripeWidth / 2;
		flan.position.z = stripeWidth / 2 + partPar.truss.thk / 2;
		par.mesh.add(flan);
		flan.setLayer('flans');
	}
	
	//вторая половинка
	if(params.carportType == "двухскатный"){
		var truss2 = new THREE.Mesh(geom, params.materials.metal);
		truss2.rotation.y = Math.PI;
		truss2.position.x = rightLine.p1.x * 2 + par.flanThk / 2;
		truss2.position.z = partPar.truss.thk;
		par.mesh.add(truss2);
		truss2.setLayer('carcas');
		
		//полоса сверху
		var stripe = drawPole3D_4(stripeParTop).mesh;			
		stripe.rotation.y = Math.PI;
		stripe.position.x = -topLine.p1.x + rightLine.p1.x * 2 + par.flanThk / 2
		stripe.position.y = topLine.p1.y
		stripe.position.z = stripeParTop.poleProfileZ / 2 + partPar.truss.thk / 2;

		stripe.setLayer('carcas');
		par.mesh.add(stripe);

		//полоса снизу
		var stripe = drawPole3D_4(stripeParBot).mesh;
		stripe.rotation.y = Math.PI;
		stripe.position.x = -basePoint.x + rightLine.p1.x * 2 + par.flanThk / 2
		stripe.position.y = basePoint.y - 0.1
		stripe.position.z = stripeParBot.poleProfileZ / 2 + partPar.truss.thk / 2;
		par.mesh.add(stripe);
		stripe.setLayer('carcas');

	}

	par.centerY = rightLine.p1.y;
	par.centerYBot = rightLine.p2.y;
	
	//сохраняем точку конец фермы для отрисовки прогонов и кровли
	partPar.truss.endPoint = polar(topLine.p1, THREE.Math.degToRad(params.roofAng + 90), partPar.truss.stripeThk)
	if (params.carportType == "двухскатный") partPar.truss.endPoint.y += 0.5
	
	//расчет площади одной половинки
	var height_l = topLine.p1.y;
	var height_r = distance(rightLine.p1, rightLine.p2);
	if(params.beamModel == "постоянной ширины") height_l = height_r;
	var area = (height_l + height_r) / 2 * distance(topLine.p1, rightLine.p1) / 1000000;
	
	par.stripeLength = stripeParTop.length + stripeParBot.length

	var partName = "truss";
	if (typeof specObj != 'undefined') {
		name = par.len;
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				stripeLength: 0,
				name: "Ферма поперечная",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "carcas",
			}
		}
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		specObj[partName]["stripeLength"] += Math.round(par.stripeLength / 100) / 10;
		if (params.carportType == "двухскатный") {
			if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
			specObj[partName]["amt"] += 1;
			specObj[partName]["area"] += area;
			specObj[partName]["stripeLength"] += Math.round(par.stripeLength / 100) / 10;
		}
		truss.specParams = { specObj: specObj, amt: 1, area: area, partName: partName, name: name }
	}
	truss.specId = partName + name;

	return par;
} //end of drawTriangleSheetTruss



/** функция отрисовывает арочную ферму из листа с отверстиями
	*@params: len,dxfBasePoint
	model: "сужающаяся", "постоянной ширины"
	holesModel: "вытянутые", "круги"
	обозначения размеров 6692035.ru/drawings/carport/arcTruss.png
*/
function drawArcSheetTruss(par){
	if(!par) par = {};
	if(!par.dxfBasePoint) par.dxfBasePoint = {x:0, y:0};
	if(!par.dxfArr) par.dxfArr = [];
	par.mesh = new THREE.Object3D();
	
	par.len = params.width;
	
	par.flanThk = 8;
	
	//внешний контур
	var p0 = {x: 0, y: 0}

	var arcPar = partPar.main.arcPar;
	
	var botLine = arcPar.botLine;
	var topArc = arcPar.topArc;
	var botArc = arcPar.botArc;
	var rightLine = arcPar.centerLine;
	var botLine = arcPar.botLine;
	
	topArc.endAngle = Math.PI / 2; //по умолчанию отрисовываем половину фермы

	//делаем ферму цельной если длина меньше 4000мм
	par.hasDivide = true;
	if(rightLine.p1.x - botLine.p1.x <= 2000 && params.carportType == "двухскатный"){
		par.hasDivide = false;
		var botLine2 = {};
		for(var pointName in botLine){
			botLine2[pointName] = copyPoint(botLine[pointName]);
			//зеркалим и сдвигаем вправо
			botLine2[pointName].x *= -1;
			botLine2[pointName].x += topArc.center.x * 2;			
		}
		//корректируем параметры верхней и ниней дуги
		topArc.endAngle = Math.PI - topArc.startAngle;
		botArc.endAngle = Math.PI - botArc.startAngle;
	}
	
	topArc.len = topArc.rad * (topArc.startAngle - topArc.endAngle)
	
	par.shape = new THREE.Shape();
	
	if(botLine.p4) {
		if(params.trussBotLedge) {			
			//скругление внутреннего угла нижней дуги
			var filletRad = params.trussBotLedge * 1.5 //1.5 - подогнано
	
			var filletPar = {
				line_p1: copyPoint(botLine.p32),
				line_p2: copyPoint(botLine.p4),
				arcCenter: copyPoint(botArc.center),
				arcRad: botArc.rad,
				filletRad: filletRad,
				topAngle: true, //верхний или нижний угол
				//rightAngle: true, //правый или левый угол
			}
			
			filletPar = calcArcFillet(filletPar).filletPar[0]
			
			botArc.startAngle = angle(botArc.center, filletPar.end) + Math.PI
			
			addArc2(par.shape, par.dxfArr, filletPar.center, filletRad, filletPar.angStart, filletPar.angEnd + Math.PI, false, par.dxfBasePoint)
			addLine(par.shape, par.dxfArr, filletPar.start, botLine.p32, par.dxfBasePoint);
			addLine(par.shape, par.dxfArr, botLine.p32, botLine.p31, par.dxfBasePoint);
			addLine(par.shape, par.dxfArr, botLine.p31, botLine.p3, par.dxfBasePoint);
		}
		else {
			addLine(par.shape, par.dxfArr, botLine.p4, botLine.p3, par.dxfBasePoint);
		}
	}
	addLine(par.shape, par.dxfArr, botLine.p3, botLine.p2, par.dxfBasePoint);
	if(botLine.p11) {
		addLine(par.shape, par.dxfArr, botLine.p2, botLine.p11, par.dxfBasePoint);
		addLine(par.shape, par.dxfArr, botLine.p11, botLine.p1, par.dxfBasePoint);
	}
	else addLine(par.shape, par.dxfArr, botLine.p2, botLine.p1, par.dxfBasePoint);	
	//верхняя дуга
	addArc2(par.shape, par.dxfArr, topArc.center, topArc.rad, topArc.startAngle, topArc.endAngle, true, par.dxfBasePoint)
	
	if(par.hasDivide){
		//правая линия
		addLine(par.shape, par.dxfArr, rightLine.p1, rightLine.p2, par.dxfBasePoint);
	}
	
	if(!par.hasDivide){
		if(botLine2.p11) {
			addLine(par.shape, par.dxfArr, botLine2.p1, botLine2.p11, par.dxfBasePoint);
			addLine(par.shape, par.dxfArr, botLine2.p11, botLine2.p2, par.dxfBasePoint);
		}
		else addLine(par.shape, par.dxfArr, botLine2.p1, botLine2.p2, par.dxfBasePoint);
	
		
		addLine(par.shape, par.dxfArr, botLine2.p2, botLine2.p3, par.dxfBasePoint);
		//if(botLine2.p4) addLine(par.shape, par.dxfArr, botLine2.p3, botLine2.p4, par.dxfBasePoint);
		if(botLine.p4) {
			if(params.trussBotLedge) {
				//скругление внутреннего угла нижней дуги
				filletPar.center.x = filletPar.center.x * (-1) + topArc.center.x * 2;
				filletPar.end.x = filletPar.end.x * (-1) + topArc.center.x * 2;
				filletPar.start.x = filletPar.start.x * (-1) + topArc.center.x * 2;
				
				filletPar.angStart = angle(filletPar.center, filletPar.start)
				filletPar.angEnd = angle(filletPar.center, filletPar.end)
			
				botArc.endAngle = angle(botArc.center, filletPar.end)
				
				addLine(par.shape, par.dxfArr, botLine2.p3, botLine2.p31, par.dxfBasePoint);
				addLine(par.shape, par.dxfArr, botLine2.p31, botLine2.p32, par.dxfBasePoint);
				addLine(par.shape, par.dxfArr, botLine2.p32, filletPar.start, par.dxfBasePoint);
				addArc2(par.shape, par.dxfArr, filletPar.center, filletRad, filletPar.angEnd, filletPar.angStart, false, par.dxfBasePoint)
			}
			else {
				addLine(par.shape, par.dxfArr, botLine2.p3, botLine2.p4, par.dxfBasePoint);
			}
		}
	}
	
	//нижняя дуга
	addArc2(par.shape, par.dxfArr, botArc.center, botArc.rad, botArc.startAngle, botArc.endAngle, false, par.dxfBasePoint)

	//большие отверстия
	//var len = topArc.len - params.sideOffset;
	//if (params.carportType == "двухскатный") len -= params.sideOffset;
	par.progonAmt = Math.ceil(topArc.len / params.progonMaxStep);	
	if(!par.hasDivide) par.progonAmt *= 0.5; //кол-во прогонов на половину фермы
	
	var holePar = {
		sideWidth: partPar.truss.sideWidth, //ширина верхнего и нижнего поясов
		bridgeWidth: partPar.truss.bridgeWidth, //ширина перемычки по верхней дуге
		topArc: topArc, //объект с параметрами верхней дуги фермы
		botArc: botArc, //объект с параметрами нижней дуги фермы		
		shape: par.shape,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		isHalf: par.hasDivide,
		progonAmt: par.progonAmt,
		trussHeight: distance(rightLine.p1, rightLine.p2),
	}
	holePar.maxHoleDiam = distance(rightLine.p1, rightLine.p2) - holePar.sideWidth * 2; //макс. диаметр для круглых отверстий
	
	
	addTrussHoles(holePar);

	

	//отверстия для болтов
	
	if(params.trussType != "балки"){
		//отверстия под фланцы колонн
		var flanPar = calcColumnFlanPar();
		flanPar.holes.forEach(function(center){
			addRoundHole(par.shape, dxfPrimitivesArr, center, flanPar.holeDiam / 2, par.dxfBasePoint);
			if(!par.hasDivide && params.carportType == "двухскатный"){
				var center1 = copyPoint(center);
				center1.x = center1.x * (-1) + topArc.center.x * 2;
				addRoundHole(par.shape, dxfPrimitivesArr, center1, flanPar.holeDiam / 2, par.dxfBasePoint);			
			}
		})
		
		//отверстия под верхний фланец односкатного навеса
		
		if(params.carportType == "односкатный") {
			var flanPar = calcColumnFlanPar({isTop: true})
			flanPar.holes.forEach(function(center){
				var center1 = copyPoint(center);
				center1.x = center1.x * (-1) + rightLine.p2.x - partPar.column.profSize.y / 2;
				center1.y = center1.y + rightLine.p2.y;
				
				addRoundHole(par.shape, dxfPrimitivesArr, center1, flanPar.holeDiam / 2, par.dxfBasePoint);
			})
		}
	}
	// отверстия под соединительный фланец для ферм
	
	if(par.hasDivide){
		var boltCenters = [];
		var connectionFlanPar = {
			a: 100 * 2,
			b: 100 * 2,
			h: (rightLine.p1.y - rightLine.p2.y) - 20,
			holes: [],
			notchRad: (rightLine.p1.y - rightLine.p2.y) / 2 - holePar.sideWidth,
		}

		par.connectionFlanHoles = [];

		var zeroPoint = {x:0,y:0};//Строим отверстия от 0 чтобы использовать во фланцах;

		var center = newPoint_xy(zeroPoint, -20, -20 + connectionFlanPar.h)
		connectionFlanPar.holes.push(center);

		var center = newPoint_xy(zeroPoint, -80, -20 + connectionFlanPar.h)
		connectionFlanPar.holes.push(center);

		var center = newPoint_xy(zeroPoint, -20, 40)
		connectionFlanPar.holes.push(center);

		var center = newPoint_xy(zeroPoint, -80, 40)
		connectionFlanPar.holes.push(center);
		
		par.connectionFlanPar = connectionFlanPar;
		boltCenters.forEach(function(center){
			addRoundHole(par.shape, dxfPrimitivesArr, center, flanPar.holeDiam / 2, par.dxfBasePoint); 
		})
	}	
	
	
	
	var extrudeOptions = {
		amount: partPar.truss.thk, 
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
		
	var geom = new THREE.ExtrudeGeometry(par.shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var truss = new THREE.Mesh(geom, params.materials.metal);
	par.mesh.add(truss);
	truss.setLayer('carcas');
	
	//полоса сверху
	var stripeWidth = partPar.truss.chord.profSize.y;
	var arcAngle = topArc.startAngle - topArc.endAngle;

	var stripePar = {
		rad: topArc.rad + partPar.truss.stripeThk / 2,
		height: stripeWidth,
		thk: partPar.truss.stripeThk,
		angle: arcAngle,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
		material: params.materials.metal,
		layer: "carcas", //слой для выгрузки в dxf
		dxfPrimitivesArr: []
	}	

	var stripe = drawArcPanel(stripePar).mesh;

	stripe.rotation.z = Math.PI / 2;
	if(!par.hasDivide) stripe.rotation.z = topArc.endAngle;
	stripe.position.z = -stripeWidth / 2 + partPar.truss.stripeThk / 2;
	stripe.position.x = topArc.center.x;
	stripe.position.y = -topArc.rad + rightLine.p1.y + 0.1;
	stripe.setLayer('carcas');
	par.mesh.add(stripe);
	
	//полоса снизу
	var arcAngle = botArc.startAngle - botArc.endAngle;

	var stripePar = {
		rad: botArc.rad - partPar.truss.stripeThk / 2,
		height: stripeWidth,
		thk: partPar.truss.stripeThk,
		angle: arcAngle,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
		material: params.materials.metal,
		layer: "carcas", //слой для выгрузки в dxf
		dxfPrimitivesArr: []
	}	
	if (params.carportType == "односкатный") stripePar.angle -= 0.02

	var stripe = drawArcPanel(stripePar).mesh;

	stripe.rotation.z = Math.PI / 2;
	if(!par.hasDivide) stripe.rotation.z = botArc.endAngle;
	stripe.position.z = -stripeWidth / 2 + partPar.truss.stripeThk / 2;
	stripe.position.x = botArc.center.x;
	stripe.position.y = -botArc.rad + rightLine.p2.y - 0.2;
	if (params.carportType == "односкатный") stripe.rotation.z += 0.02
	stripe.setLayer('carcas');
	par.mesh.add(stripe);
	
	//левый фланец крепления к колонне
	if(params.trussType != "балки")	{
		var flanParams = {
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, -500),
			dxfPrimitivesArr: par.dxfArr,
		}
		
		var flan = drawColumnFlan(flanParams).mesh;
		flan.position.z = -flanParams.thk;
		par.mesh.add(flan);
		
		//правый фланец	
		if(params.carportType == "односкатный") flanParams.isTop = true;
		
		flanParams.dxfBasePoint = newPoint_xy(par.dxfBasePoint, params.width, -500);
		var flan = drawColumnFlan(flanParams).mesh;
		flan.rotation.y = Math.PI
		flan.position.x = topArc.center.x * 2
		if(params.carportType == "односкатный") {
			flan.position.x = topArc.center.x - partPar.column.profSize.y / 2
			flan.position.y = rightLine.p2.y
		}
		par.mesh.add(flan);
	}
	
	//соединительный фланец
	if(par.hasDivide && params.carportType == "двухскатный"){

		par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, params.width / 2, -500);
		var flanParams = {
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 300,0),
			thk: 8,
			flanParams: connectionFlanPar,
			dxfPrimitivesArr: dxfPrimitivesArr,
		};
		var flan = drawArcTrussFlan(flanParams);
		flan.position.x = rightLine.p1.x;
		flan.position.y = rightLine.p1.y - 10 - connectionFlanPar.h;
		flan.position.z = -params.trussThk / 2 - flanParams.thk;
		par.mesh.add(flan);
			
	}
	
	//вторая половинка
	if(par.hasDivide && params.carportType == "двухскатный"){
		var truss2 = new THREE.Mesh(geom, params.materials.metal);
		truss2.rotation.y = Math.PI;
		truss2.position.x = topArc.center.x * 2;
		truss2.position.z = partPar.truss.thk;
		par.mesh.add(truss2);
		truss2.setLayer('carcas');
		
		var stripe = drawArcPanel(stripePar).mesh;

		stripe.rotation.z = Math.PI / 2 - stripePar.angle ;
		stripe.position.z = -stripeWidth / 2 + partPar.truss.stripeThk / 2;
		stripe.position.x = topArc.center.x;
		stripe.position.y = -topArc.rad + rightLine.p1.y;
		stripe.setLayer('carcas');
		par.mesh.add(stripe);
		
	}


	//узел стыковки фермы с балкой
	if (params.trussType == "балки") {
		var flanPar = {
			height: 100,
			thk: 4,
			thkTruss: 4,
			dxfArr: par.dxfArr,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, -500),
		}

		//левое соединение	
		var connect = drawConnectBalTruss(flanPar).mesh;
		par.mesh.add(connect);

		//правое соединение
		flanPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, -700);
		if (params.carportType == "односкатный") {
			flanPar.isTop = true;
			flanPar.height = rightLine.p1.y - partPar.main.deltaHeight;
		}

		var connect = drawConnectBalTruss(flanPar).mesh;
		connect.rotation.y = Math.PI;
		connect.position.x = topArc.center.x * 2
		connect.position.z = flanPar.thkTruss;

		if (params.carportType == "односкатный") {
			connect.position.x = topArc.center.x - partPar.column.profSize.y / 2
			connect.position.y = rightLine.p1.y - flanPar.height;
		}
		par.mesh.add(connect);
	}
	
			

	// Выводим переменные для использования дальше
	par.topRad = topArc.rad;
	par.centerY = rightLine.p1.y;
	par.centerYBot = rightLine.p2.y;
	par.arcLength = topArc.rad * (topArc.startAngle - topArc.endAngle);	
	par.topArc = topArc;
	par.stripeLength = topArc.rad * (topArc.startAngle - topArc.endAngle) + botArc.rad * (botArc.startAngle - botArc.endAngle)
	
	//для двухскатных навесов далее используем полную верхнюю дугу
	if (params.carportType == 'двухскатный') {
		par.topArc.endAngle = Math.PI - topArc.startAngle;
		par.progonAmt *= 2;
	}
	
	var area = par.arcLength * distance(rightLine.p1, rightLine.p2) / 1000000; //упрощенная формула с учетом обрезков

	var partName = "truss";
	if (typeof specObj != 'undefined') {
		name = par.len;
		if(par.hasDivide && params.carportType == "двухскатный") name = par.len / 2;
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				stripeLength: 0,
				name: "Ферма поперечная",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "carcas",
			}
		}
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		specObj[partName]["stripeLength"] += Math.round(par.stripeLength / 100) / 10;
		if(par.hasDivide && params.carportType == "двухскатный") {
			if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
			specObj[partName]["amt"] += 1;
			specObj[partName]["area"] += area;
			specObj[partName]["stripeLength"] += Math.round(par.stripeLength / 100) / 10;
		}
		truss.specParams = {specObj: specObj, amt: 1, area: area, partName: partName, name: name}
	}
	truss.specId = partName + name;

	return par;
	
} //end of drawArcSheetTruss


/** функция отрисовывает крыло консольного навеса
	*@params: len,dxfBasePoint
	model: "сужающаяся", "постоянной ширины"
	holesModel: "вытянутые", "круги"
	эскиз с параметрами: 6692035.ru/drawings/carport/consoleWing.png
*/
function drawArcSheetWing(par){
	if(!par) par = {};
	if(!par.dxfBasePoint) par.dxfBasePoint = {x:0, y:0};
	if(!par.dxfArr) par.dxfArr = [];
	par.mesh = new THREE.Object3D();
	
	//параметры

	par.a1 = -(90 - params.roofAng) / 180 * Math.PI //угол вектора на центр верхней дуги и точку p1
	par.endWidth = 150; //высота на краю без учета скругления
	par.botWidth = 200; //ширина внизу по горизонтали
	par.filletRad = 500; //радиус скругления внутреннего угла
	
	if(params.beamModel == "постоянной ширины"){
		par.endWidth = 200;
		par.filletRad = 700;
	}
	
	par.filletRadEnd = par.endWidth - 20; //радиус скругления на конце фермы
	
	//внешний контур
	var p0 = {x: 0, y: 0}
	
	//правая линия
	var rightLine = {
		p1: {x: par.len, y: 0,}, //временная точка
		p2: {x: par.len, y: 100,}, //временная точка
	}
	
	//нижняя линия
	var botLine = {
		p1: copyPoint(p0),
		p2: newPoint_xy(p0, 0, - 100), //временная точка
		p3: newPoint_xy(p0, par.botWidth, - 100), //временная точка
		p4: newPoint_xy(p0, par.botWidth, 0), //временная точка
	}

	//верхняя дуга
	var topArc = {
		center: itercection(p0, polar(p0, par.a1, 100) , rightLine.p1, rightLine.p2),		
		startAngle: par.a1 + Math.PI,
	}
	topArc.rad = distance(p0, topArc.center);



partPar.main.arcPar.topArc = topArc;

	
	rightLine.p1 = itercectionLineCircle(rightLine.p1, rightLine.p2, topArc.center, topArc.rad)[0]
	rightLine.p2 = newPoint_xy(rightLine.p1, 0, -par.endWidth)
	
	topArc.endAngle = angle(topArc.center, rightLine.p1)
	topArc.len = topArc.rad * (topArc.startAngle - topArc.endAngle)
	
	//нижняя дуга
	par.deltaRad = topArc.rad * 0.25 * 30 / params.roofAng; //формула подогнана
	if(params.beamModel == "постоянной ширины") par.deltaRad = par.endWidth;
	
	var botArc = {
		rad: topArc.rad - par.deltaRad,
		center: newPoint_xy(topArc.center, 0, par.deltaRad - par.endWidth),		
	}
	
	botLine.p4 = itercectionLineCircle(botLine.p3, botLine.p4, botArc.center, botArc.rad)[0];
	
	botArc.endAngle = angle(botArc.center, rightLine.p2)
	
	
	//скругление внутреннего угла нижней дуги
	
	var filletPar = {
		line_p1: copyPoint(botLine.p3),
		line_p2: copyPoint(botLine.p4),
		arcCenter: copyPoint(botArc.center),
		arcRad: botArc.rad,
		filletRad: par.filletRad,
		topAngle: true, //верхний или нижний угол
		//rightAngle: true, //правый или левый угол
	}
	
	filletPar = calcArcFillet(filletPar).filletPar[0]
	
	botArc.startAngle = angle(botArc.center, filletPar.end) + Math.PI
	
	botLine.p3 = copyPoint(filletPar.start);
	botLine.p2 = newPoint_xy(botLine.p3, -par.botWidth, 0);
	
	
	//скругление правого конца
	var filletParEnd = {
		line_p1: copyPoint(rightLine.p1),
		line_p2: copyPoint(rightLine.p2),
		arcCenter: copyPoint(botArc.center),
		arcRad: botArc.rad,
		filletRad: par.filletRadEnd,
		//topAngle: true, //верхний или нижний угол
		rightAngle: true, //правый или левый угол
	}
	
	filletParEnd = calcArcFillet(filletParEnd).filletPar[0]
	
	rightLine.p2 = filletParEnd.end;
	botArc.endAngle = angle(botArc.center, filletParEnd.start) + Math.PI
	
	
	
	//строим шейп 
	
	par.shape = new THREE.Shape();
	
	//addLine(par.shape, par.dxfArr, botLine.p4, botLine.p3, par.dxfBasePoint);
	addLine(par.shape, par.dxfArr, botLine.p3, botLine.p2, par.dxfBasePoint);
	addLine(par.shape, par.dxfArr, botLine.p2, botLine.p1, par.dxfBasePoint);	
	//верхняя дуга
	addArc2(par.shape, par.dxfArr, topArc.center, topArc.rad, topArc.startAngle, topArc.endAngle, true, par.dxfBasePoint)
	//правая линия
	addLine(par.shape, par.dxfArr, rightLine.p1, rightLine.p2, par.dxfBasePoint);
	//нижняя дуга
	addArc2(par.shape, par.dxfArr, filletParEnd.center, par.filletRadEnd, filletParEnd.angEnd, filletParEnd.angStart,  true, par.dxfBasePoint)
	addArc2(par.shape, par.dxfArr, botArc.center, botArc.rad, botArc.startAngle, botArc.endAngle, false, par.dxfBasePoint)
	addArc2(par.shape, par.dxfArr, filletPar.center, par.filletRad, filletPar.angStart, filletPar.angEnd + Math.PI, false, par.dxfBasePoint)
	
	//большие отверстия
	par.progonAmt = Math.ceil(topArc.len / params.progonMaxStep)
	var holePar = {
		sideWidth: partPar.truss.sideWidth, //ширина верхнего и нижнего поясов
		bridgeWidth: partPar.truss.bridgeWidth, //ширина перемычки по верхней дуге
		topArc: topArc, //объект с параметрами верхней дуги фермы
		botArc: botArc, //объект с параметрами нижней дуги фермы		
		shape: par.shape,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		progonAmt: par.progonAmt,
		isHalf: true,
	}
	holePar.maxHoleDiam = distance(botLine.p3, botLine.p4) - holePar.sideWidth * 2; //макс. диаметр для круглых отверстий
	
	addTrussHoles(holePar);

	// шпильки
	var holeOffset = 60;
	var holeRad = 13.5;
	var boltPar = {
		diam: 24,
		len: partPar.column.profSize.y + 42, //42 подогнано 
		headShim: true,
		headType: "шестигр.",
	}
	
	var boltCenters = [];
	
	var center = newPoint_xy(botLine.p2, partPar.column.profSize.x / 2, holeOffset)
	boltCenters.push(center)
	var center = newPoint_xy(botLine.p1, partPar.column.profSize.x / 2, -holeOffset)
	boltCenters.push(center)
	
	boltCenters.forEach(function(center){
		addRoundHole(par.shape, par.dxfArr, center, holeRad, par.dxfBasePoint);
		var bolt = drawBolt(boltPar).mesh;
		bolt.rotation.x = Math.PI / 2
		bolt.position.x = center.x
		bolt.position.y = center.y
		bolt.position.z = partPar.column.profSize.y / 2 + 11; //11 - подогнано
		par.mesh.add(bolt);
		bolt.setLayer('metiz');
	})


	var extrudeOptions = {
		amount: partPar.truss.thk, 
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	
	var geom = new THREE.ExtrudeGeometry(par.shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	
	//первая пластина
	var truss = new THREE.Mesh(geom, params.materials.metal);
	truss.position.z = 0//-partPar.column.profSize.y / 2;
	par.mesh.add(truss);
	truss.setLayer('carcas');
	
	//вторая пластина
	var truss = new THREE.Mesh(geom, params.materials.metal);
	truss.position.z = partPar.column.profSize.y + partPar.truss.thk//partPar.column.profSize.y / 2 + partPar.truss.thk;
	par.mesh.add(truss);
	truss.setLayer('carcas');
	
	
	var box3 = new THREE.Box3().setFromObject(truss);
	var s = ((box3.max.x - box3.min.x) / 1000) * ((box3.max.y - box3.min.y) / 1000);

	var partName = "truss";
	if (typeof specObj != 'undefined') {
		name = par.len;
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				stripeLength: 0,
				name: "Ферма поперечная",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "carcas",
			}
		}
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += s;
		truss.specParams = {specObj: specObj, amt: 1, area: s, partName: partName, name: name}
	}
	truss.specId = partName + name;
	
	// Выводим переменные для использования дальше
	par.topRad = topArc.rad;
	par.arcLength = topArc.len
	par.centerY = rightLine.p1.y;
	par.centerYBot = rightLine.p2.y;

	
	return par;
}

/** функция добавляет большие отверстия в радиусную ферму
progonAmt // кол-во прогонов на половину дуги
*/

function addTrussHoles(par){
	
	var bridgeWidthAng = par.bridgeWidth / par.topArc.rad; //угловая ширина перемычки

	var holeAmt = par.progonAmt * 2;
	if(params.progonMaxStep < 650) holeAmt = par.progonAmt;
	if(par.trussHeight > params.progonMaxStep / 2) holeAmt = par.progonAmt;
	if(!par.isHalf) holeAmt *= 2;
	
	var holeStepAng = (par.topArc.startAngle - par.topArc.endAngle) / holeAmt;
	
	var hidenHolesAmt = 0; 
	if(params.trussType != "балки") hidenHolesAmt = 1; //не отрисовываем крайние отверстия
	hidenHolesAmt += Math.floor(params.sideOffset / 300);
	
	if(params.trussHolesType == "круги"){
		var holeAmt = Math.ceil(par.topArc.len / (par.maxHoleDiam + par.bridgeWidth))
		var holeStepAng = (par.topArc.startAngle - par.topArc.endAngle) / holeAmt;
		bridgeWidthAng *= 2;
	}

	var startAngle = par.topArc.endAngle;
	
	//не отрисовываем крайние отверстия
	holeAmt -= hidenHolesAmt;
	
	if(!par.isHalf){
		holeAmt -= hidenHolesAmt;
		startAngle += holeStepAng * hidenHolesAmt
	}
	
	//строим отверстия от центра к краю
	var startIndex = 0;
	if(params.carportType == "односкатный") startIndex = 1; //пропускаем одно отверстие

	for(var i=startIndex; i<holeAmt; i++ ){

		//правая линия
		var rightLineAng = startAngle + holeStepAng * i + bridgeWidthAng / 2;
		
		//левая линия
		var leftLineAng = startAngle + holeStepAng * (i + 1) - bridgeWidthAng / 2;
		
		//уменьшаем первое отверстие
		if(params.trussHolesType == "вытянутые" && i == 0){
			if(par.isHalf) rightLineAng += bridgeWidthAng * 0.2;
			if(!par.isHalf && params.trussType == "балки") rightLineAng += holeStepAng / 3;
		}
		
		//уменьшаем крайнее отверстие
		if(params.trussHolesType == "вытянутые" && i == holeAmt-1){		
			if(params.trussType == "балки") leftLineAng -= holeStepAng / 3;
		}
		//точки без учета скругления
		var ph2 = polar(par.topArc.center, leftLineAng, par.topArc.rad - par.sideWidth) //левая верхняя
		var ph3 = polar(par.topArc.center, rightLineAng, par.topArc.rad - par.sideWidth) //правая верхняя
		var ph4 = itercectionLineCircle(par.topArc.center, ph3, par.botArc.center, par.botArc.rad + par.sideWidth)[0] //правая нижняя
		var ph1 = itercectionLineCircle(par.topArc.center, ph2, par.botArc.center, par.botArc.rad + par.sideWidth)[0] //левая нижняя
		
		//если отверстие получается вырожденным пропускаем шаг цикла
		if(params.trussHolesType == "вытянутые" && distance(ph4, ph1) < distance(ph2, ph1)){
			continue
		}
		
		//рассчитываем скругление справа
		fillPar = {
			center1: par.topArc.center, 
			center2: par.botArc.center,
			rad1: par.topArc.rad - par.sideWidth,
			rad2: par.botArc.rad + par.sideWidth,
			point: ph3, //предварительная точка
		}

		var rad = calcCirclesFillet(fillPar).rad
		//смещаем точку сопряжения на радиус дуги сопряжения
		var deltaAng = rad / par.topArc.rad;
		var ang = rightLineAng + deltaAng;
		fillPar.point = polar(par.topArc.center, ang, par.topArc.rad - par.sideWidth) //правая верхняя
		
		var filletParRight = calcCirclesFillet(fillPar)
		
		//рассчитываем скругление слева
		fillPar = {
			center1: par.topArc.center, 
			center2: par.botArc.center,
			rad1: par.topArc.rad - par.sideWidth,
			rad2: par.botArc.rad + par.sideWidth,
			point: ph2, //предварительная точка
		}
		
		
		var rad = calcCirclesFillet(fillPar).rad
		//смещаем точку сопряжения на радиус дуги сопряжения
		var deltaAng = rad / par.topArc.rad;
		var ang = leftLineAng - deltaAng;
		fillPar.point = polar(par.topArc.center, ang, par.topArc.rad - par.sideWidth) //правая верхняя
		
		var filletParLeft = calcCirclesFillet(fillPar)
		
		
		//верхняя дуга
		var holeTopArc = {
			center: par.topArc.center,
			rad: par.topArc.rad - par.sideWidth,
			startAngle: angleX(par.topArc.center, filletParLeft.point) + Math.PI,
			endAngle: angle(par.topArc.center, filletParRight.point)  + Math.PI,
		}
		
		//нижняя дуга
		var holeBotArc = {
			center: par.botArc.center,
			rad: par.botArc.rad + par.sideWidth,
			endAngle : angle(par.botArc.center, filletParRight.point2)  + Math.PI,		
			startAngle : angle(par.botArc.center, filletParLeft.point2)  + Math.PI, 
		}
		
		//левая дуга
		var holeLeftArc = {
			center: filletParLeft.center,
			rad: filletParLeft.rad,
			endAngle : angle(filletParLeft.center, filletParLeft.point) + Math.PI,		
			startAngle : angle(filletParLeft.point2, filletParLeft.center),
		}

		//правая дуга
		var holeRightArc = {
			center: filletParRight.center,
			rad: filletParRight.rad,
			endAngle : angle(filletParRight.center, filletParRight.point2) ,		
			startAngle : angle(filletParRight.center, filletParRight.point) + Math.PI,
		}
	
	if(rightLineAng < Math.PI / 2){
		holeTopArc.startAngle -= Math.PI
		holeTopArc.endAngle -= Math.PI
		
		holeBotArc.startAngle -= Math.PI
		holeBotArc.endAngle -= Math.PI
		
		holeLeftArc.startAngle -= Math.PI
		holeLeftArc.endAngle -= Math.PI
		
		holeRightArc.startAngle -= Math.PI
		holeRightArc.endAngle -= Math.PI
		
	}
		if(params.trussHolesType == "вытянутые"){
			var holeShape = new THREE.Shape();
			
			//левая линия
			addArc2(holeShape, par.dxfArr, holeLeftArc.center, holeLeftArc.rad, holeLeftArc.startAngle, holeLeftArc.endAngle, true, par.dxfBasePoint)
			//верхняя дуга
			addArc2(holeShape, par.dxfArr, holeTopArc.center, holeTopArc.rad, holeTopArc.startAngle, holeTopArc.endAngle, true, par.dxfBasePoint)
			//правая линия
			addArc2(holeShape, par.dxfArr, holeRightArc.center, holeRightArc.rad, holeRightArc.startAngle, holeRightArc.endAngle, true, par.dxfBasePoint)
			//нижняя дуга
			addArc2(holeShape, par.dxfArr, holeBotArc.center, holeBotArc.rad, holeBotArc.startAngle, holeBotArc.endAngle, false, par.dxfBasePoint)
			
			/*
			addLine(holeShape, par.dxfArr, ph1, ph2, par.dxfBasePoint);
			addLine(holeShape, par.dxfArr, ph2, ph3, par.dxfBasePoint);
			addLine(holeShape, par.dxfArr, ph3, ph4, par.dxfBasePoint);
			addLine(holeShape, par.dxfArr, ph4, ph1, par.dxfBasePoint);
			*/
			par.shape.holes.push(holeShape)
		}
		
		if(params.trussHolesType == "круги"){
			addRoundHole(par.shape, par.dxfArr, holeRightArc.center, holeRightArc.rad, par.dxfBasePoint)
		}
		
	}
}

/** функция рассчитывает параметры верхней дуги кровли арочного навеса
	a1 - //угол вектора на центр внешней дуги и точку p1
	sideOffset - расстояние от нулевой точки к точке botLine.p2
	endHeight - высота над центром колонны
	midHeight - высота на центральной линии фермы
*/
function calcRoofArcParams(par){

	//параметры опорного узла
	par.a3 = 58 / 180 * Math.PI//угол на точку p4
	par.m2 = 110 //расстояние до точки p4
	
	//нижняя линия
	var p0 = {x: 0, y: 0} //точка на оси колонны
	var pt = newPoint_xy(p0, 0, par.endHeight) //точка на верхней дуге над осью колонны
	
	//для проф. трубы базовая точка над краем колонны
	if(params.beamModel == "проф. труба" && params.carportType != "сдвижной") {
		pt = newPoint_xy(p0, - par.columnProf.y / 2 - params.sideOffset, 0) 
	}
	
	par.botLine = {
		p2: newPoint_xy(p0, -par.sideOffset, 0),
	} 


	//вспомогательная линия через центр дуги
	var centerPosX = p0.x - par.columnProf.y / 2 - params.sideOffset + params.width / 2;
	
	if(params.carportType == "односкатный" || params.carportType.indexOf("консольный") != -1) centerPosX += params.width / 2;
	if(params.carportType == "сдвижной") centerPosX = par.width / 2;
	
	par.centerLine = {
		p1: {x: centerPosX, y: 0,}, //временная точка
		p2: {x: centerPosX, y: -100,}, //временная точка
	}
	
	//верхняя линия балки
	par.topArc = {
		center: itercection(pt, polar(pt, par.a1, 100), par.centerLine.p1, par.centerLine.p2),
		startAngle: par.a1,
		endAngle: Math.PI - par.a1,			
	}
	par.topArc.rad = distance(pt, par.topArc.center);
	par.topArc.len = par.topArc.rad * (par.topArc.startAngle - par.topArc.endAngle)

	//корректируем точки центральной линии
	par.centerLine.p1 = newPoint_xy(par.topArc.center, 0, par.topArc.rad)
	par.centerLine.p2 = newPoint_xy(par.centerLine.p1, 0, -par.midHeight)

	par.topArc.height = par.centerLine.p1.y - p0.y;
	
	
	if(params.beamModel == "проф. труба") {
		if(params.carportType != "сдвижной"){
			//корректируем позицию центра по Y, чтобы нижняя дуга всегда лежала на балке
			var botArc = {
				center: par.topArc.center,
				startAngle: par.topArc.startAngle,
				endAngle: par.topArc.endAngle,
				rad: par.topArc.rad - par.beamHeight,
			}
			
			//Точка над краем колонны
			var pt2 = newPoint_xy(p0, -par.columnProf.y / 2, 0)
			pt2 = itercectionLineCircle(pt2, newPoint_xy(pt2, 0, 10), botArc.center, botArc.rad)[0]
			par.topArc.center.y -= pt2.y
		}
		
	}
	
	if(params.beamModel != "проф. труба") {
		//крайняя точка фермы
		par.botLine.p1 = newPoint_xy(p0, -par.columnProf.y / 2 - params.sideOffset, 1) //временная точка
		par.botLine.p1 = itercectionLineCircle(par.botLine.p1, newPoint_xy(par.botLine.p1, 0, 100), par.topArc.center, par.topArc.rad)[0]
		
		par.topArc.startAngle = angle(par.botLine.p1, par.topArc.center) + Math.PI;
			
		//дополнительная точка для большого свеса

		if(angle(par.botLine.p1, par.botLine.p2) > par.topArc.startAngle - Math.PI){
			par.botLine.p11 = polar(par.botLine.p1, par.topArc.startAngle, -50)
			if(par.botLine.p11.y > -20) par.botLine.p11 = itercection(par.botLine.p11, par.botLine.p1, par.botLine.p2, newPoint_xy(par.botLine.p2, 1,0))
		}
		
		
		//нижняя линия

		//точка на внутреннем краю колонны
		par.botLine.p3 = newPoint_xy(par.botLine.p1, params.sideOffset + par.columnProf.y, -par.botLine.p1.y);
		
		if(params.beamModel == "сужающаяся"){
		
			if(params.trussBotLedge){
				par.botLine.p31 = newPoint_xy(par.botLine.p3, 0, -params.trussBotLedge);
				par.botLine.p32 = newPoint_xy(par.botLine.p31, 50, 0);
			}
			else{
				par.botLine.p3 = newPoint_xy(par.botLine.p2, 200, 0);
			}
			
			par.botLine.p4 = polar(par.botLine.p3, par.a3, par.m2)
			
			//рассчитываем параметры сегмента
			var sWidth = (par.centerLine.p2.x - par.botLine.p4.x) * 2;
			var sHeight = par.centerLine.p2.y - par.botLine.p4.y;
			var sPar = calcSegmentPar(sWidth, sHeight)
			
			par.botArc = {
				center: newPoint_xy(par.centerLine.p2, 0, -sPar.rad),
				rad: sPar.rad,			
				endAngle: Math.PI / 2,
			}
			par.botArc.startAngle = angle(par.botArc.center, par.botLine.p4) + Math.PI;
			
			if(params.trussBotLedge){
				par.botLine.p4 = newPoint_xy(par.botLine.p32, 50, 200); //меняем точку для более красивого вида опуска
			}
			
		}
		
		if(params.beamModel == "постоянной ширины"){

			par.botArc = {
				center: copyPoint(par.topArc.center),
				rad: par.topArc.rad - par.midHeight,			
				endAngle: Math.PI / 2,			
			}
			par.botLine.p4 = itercectionLineCircle(par.botLine.p2, par.botLine.p3, par.botArc.center, par.botArc.rad)[1];
			
			if(params.trussBotLedge){
				par.botLine.p31 = newPoint_xy(par.botLine.p3, 0, -params.trussBotLedge);
				par.botLine.p32 = newPoint_xy(par.botLine.p31, 50, 0);
				par.botLine.p4 = newPoint_xy(par.botLine.p32, 50, 200); //меняем точку для более красивого вида опуска
			}
			
			par.botArc.startAngle = angle(par.botArc.center, par.botLine.p4) + Math.PI;
		}
		
		
		par.topArc.height = par.centerLine.p1.y - p0.y;
		
	}
	
	if(params.carportType == "односкатный" || params.carportType.indexOf("консольный") != -1){
		par.topArc.endAngle = Math.PI / 2;
	}

	return par;
		
} //end of calcRoofArcParams

/** старая функция - нигде не ипользуется
*/

function drawArcTubeTruss1(par){
	if(!par) par = {};
	if(!par.dxfBasePoint) par.dxfBasePoint = {x: 0, y: 0};
	if(!par.len) par.len = params.width;
	par.mesh = new THREE.Object3D();
	
	//нижний пояс

	var polePar = {
		poleProfileY: partPar.truss.chord.profSize.y,
		poleProfileZ: partPar.truss.chord.profSize.x,
		dxfBasePoint: par.dxfBasePoint,
		length: par.len,
		poleAngle: 0,
		material: params.materials.metal,
		dxfArr: [],
		type: 'rect',
		partName: 'carportBeam',
	};
	
	var beam = drawPole3D_4(polePar).mesh;
	beam.position.x = -params.width / 2
	par.mesh.add(beam)

	//верхний пояс
	
	//верхняя дуга
	arcPar = partPar.main.arcPar;

	//средняя линия балки
	var midArc = {
		center: arcPar.topArc.center,
		startAngle: arcPar.topArc.startAngle,
		endAngle: arcPar.topArc.endAngle,
		rad: arcPar.topArc.rad - partPar.truss.chord.profSize.y / 2,
	}

	var arcPanelPar = {
		rad: midArc.rad,
		height: partPar.truss.chord.profSize.x,
		thk: partPar.truss.chord.profSize.y,
		angle: midArc.startAngle - midArc.endAngle,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
		material: params.materials.metal,
		partName: 'carportBeam',
		dxfPrimitivesArr: dxfPrimitivesArr
	}

	var beam = drawArcPanel(arcPanelPar).mesh;
	beam.rotation.z = midArc.endAngle;
	if (params.carportType == "односкатный") beam.position.x = params.width / 2
	beam.position.y = midArc.center.y
	par.mesh.add(beam)
	
	//параметры верхней дуги для дальнейшего использования
	par.topArc = arcPar.topArc;
	
	//раскосы
	var bracePar = {
		profY: partPar.truss.web.profSize.x,
		profZ: partPar.truss.web.profSize.y,
		dxfBasePoint: par.dxfBasePoint,
		length: 1000,
		poleAngle: 0,
		material: params.materials.metal,
		dxfArr: [],
		type: 'rect',
		partName: 'carportBeam',
	};
	
	var braceAng = Math.PI / 4;
	var lines = [];
	var center = {x: 0, y: midArc.center.y}
	
	var botLine = {
		p1: {x: 0, y: polePar.poleProfileY / 2},
		p2: {x: 100, y: polePar.poleProfileY / 2},
	}
	for(var sideFactor = 1; sideFactor >= -1; sideFactor -= 2){
		var lastPoint = newPoint_xy(center, 0, midArc.rad); //верхняя точка
		if(params.carportType == "односкатный") {
			lastPoint.x = par.len / 2
			center.x = par.len / 2
		}
		for(var i=0; i<10; i++){

			var ang1 = Math.PI / 2  - braceAng * sideFactor;
			var p1 = polar(lastPoint, ang1, 100) //временная точка
			p1 = itercection(botLine.p1, botLine.p2, lastPoint, p1)

			bracePar.poleAngle = ang1 + Math.PI;
			bracePar.length = distance(lastPoint, p1);
			if(bracePar.length < 250) break
			
			var brace = drawPole3D_4(bracePar).mesh;
			brace.position.x = lastPoint.x
			brace.position.y =  lastPoint.y
			par.mesh.add(brace)
			
			
			var ang2 = Math.PI / 2 + braceAng * sideFactor
			var p2 = polar(p1, ang2, 500) //временная точка
			p2 = itercectionLineCircle(p1, p2, center, midArc.rad)[0]
			
			bracePar.poleAngle = ang2  + Math.PI;
			bracePar.length = distance(p1, p2);
			if(bracePar.length < 250) break
			
			var brace = drawPole3D_4(bracePar).mesh;
			brace.position.x = p2.x
			brace.position.y = p2.y
			par.mesh.add(brace)
			
			lastPoint = copyPoint(p2)
		}
		if(params.carportType == "односкатный") break;
	}
	
	par.topArc.len = par.topArc.rad * (par.topArc.startAngle - par.topArc.endAngle)
	par.progonAmt = Math.ceil(par.topArc.len / params.progonMaxStep)

	return par;
	
}

/** функция отрисовывает арочную сварную ферму из проф. трубы
*/

function drawArcTubeTruss(par) {
	if (!par) par = {};
	if (!par.dxfBasePoint) par.dxfBasePoint = { x: 0, y: 0 };
	if (!par.len) par.len = params.width;
	par.mesh = new THREE.Object3D();
	var mesh = new THREE.Object3D();

	par.len = params.width;

	var ang = partPar.main.roofAng;
	var p0 = { x: 0, y: 0};

	var sideOffset = params.sideOffset;
	var profBinding = 20;
	var sideFactor = 1;


	var arcPar = partPar.main.arcPar;

	var botLine = arcPar.botLine;
	var topArc = arcPar.topArc;
	var botArc = arcPar.botArc;
	var rightLine = arcPar.centerLine;
	var botLine = arcPar.botLine;

	topArc.endAngle = Math.PI / 2; //по умолчанию отрисовываем половину фермы

	topArc.len = topArc.rad * (topArc.startAngle - topArc.endAngle)


	var extrudeOptions = {
		amount: partPar.truss.chord.profSize.x,
		bevelEnabled: false,
		curveSegments: 60,
		steps: 1
	};

	var shapeMeshPar = {
		points: [],
		holes: [],
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		extrudeOptions: extrudeOptions,
		material: params.materials.metal,
	}


	var bracePar = {//раскосы
		profY: partPar.truss.web.profSize.x,
		profZ: partPar.truss.web.profSize.y,
		stepBrace: 5, // расстояние между раскосами
		stepBraceDivide: 20,// расстояние между раскосами на разделение фермы
	};

	var bindingTrussPar = {//крепление фермы
		points: [],
		profBinding: profBinding,
		shapeMeshPar: shapeMeshPar,
		sideFactor: 1,
		ang: ang,
	};


	// вспомогательные прямые
	{
		var pt1Out = newPoint_xy(p0, -params.width / 2, 0);
		var pt2Out = newPoint_xy(pt1Out, sideOffset, 0);
		var pt3Out = newPoint_xy(pt2Out, partPar.column.profSize.x, 0);
		var pt4Out = newPoint_xy(pt3Out, profBinding, 0);
		var line1Out = { p1: pt1Out, p2: polar(pt1Out, Math.PI / 2, 100) }
		var line2Out = { p1: pt2Out, p2: polar(pt2Out, Math.PI / 2, 100) }
		var line3Out = { p1: pt3Out, p2: polar(pt3Out, Math.PI / 2, 100) }
		var line4Out = { p1: pt4Out, p2: polar(pt4Out, Math.PI / 2, 100) }

		var pt1In = newPoint_xy(p0, params.width / 2, 0);
		var pt2In = newPoint_xy(pt1In, -sideOffset, 0);
		if (params.carportType == 'односкатный') pt2In = newPoint_xy(pt1In, 0, 0);
		var pt3In = newPoint_xy(pt2In, -partPar.column.profSize.x, 0);
		var pt4In = newPoint_xy(pt3In, -profBinding, 0);
		var line1In = { p1: pt1In, p2: polar(pt1In, Math.PI / 2, 100) }
		var line2In = { p1: pt2In, p2: polar(pt2In, Math.PI / 2, 100) }
		var line3In = { p1: pt3In, p2: polar(pt3In, Math.PI / 2, 100) }
		var line4In = { p1: pt4In, p2: polar(pt4In, Math.PI / 2, 100) }
	}

	if (params.carportType == 'односкатный') {

		var rad = partPar.main.arcPar.topArc.rad;

		var pc = newPoint_xy(p0, pt1In.x, -rad);

		var rad1Top = rad - partPar.truss.chord.profSize.x / 2;
		var rad2Top = rad + partPar.truss.chord.profSize.x / 2;
		var rad1Bot = rad2Top - partPar.truss.endHeight;
		var rad2Bot = rad1Bot + partPar.truss.chord.profSize.x;

		//верхний пояс
		var shape = new THREE.Shape();
		var p2 = itercectionLineCircle1(line1Out, pc, rad2Top)[0]
		var p1 = itercectionLineCircle(p2, polar(p2, Math.PI / 2 + ang, 100), pc, rad1Top)[0]
		var p3 = itercectionLineCircle1(line1In, pc, rad2Top)[0]
		var p4 = itercectionLineCircle(p3, polar(p3, Math.PI / 2, 100), pc, rad1Top)[0]


		addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint, par.layer);
		addArc2(shape, par.dxfArr, pc, rad2Top, calcAngleX1(pc, p2), calcAngleX1(pc, p3), false, par.dxfBasePoint, par.layer);
		addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint, par.layer);
		addArc2(shape, par.dxfArr, pc, rad1Top, calcAngleX1(pc, p1), calcAngleX1(pc, p4), true, par.dxfBasePoint, par.layer);



		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		mesh1 = new THREE.Mesh(geom, params.materials.metal);
		mesh.add(mesh1)

		var angBrace = calcAngleX1(p1, itercectionLineCircle(p0, polar(p0, Math.PI / 2, 100), pc, rad1Top)[0])

		//нижний пояс
		var shape = new THREE.Shape();
		var p2 = itercectionLineCircle1(line4Out, pc, rad2Top)[0]
		var p1 = itercectionLineCircle(p2, polar(p2, Math.PI / 2 + ang, 100), pc, rad1Top)[0]
		var p3 = itercectionLineCircle1(line1In, pc, rad2Top)[0]
		var p4 = itercectionLineCircle(p3, polar(p3, Math.PI / 2, 100), pc, rad1Top)[0]

		var p1 = itercectionLineCircle1(line4Out, pc, rad1Bot)[0]
		var p2 = itercectionLineCircle1(line4Out, pc, rad2Bot)[0]
		var p3 = itercectionLineCircle1(line4In, pc, rad2Bot)[0]
		var p4 = itercectionLineCircle1(line4In, pc, rad1Bot)[0]


		addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint, par.layer);
		addArc2(shape, par.dxfArr, pc, rad2Bot, calcAngleX1(pc, p2), calcAngleX1(pc, p3), false, par.dxfBasePoint, par.layer);
		addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint, par.layer);
		addArc2(shape, par.dxfArr, pc, rad1Bot, calcAngleX1(pc, p1), calcAngleX1(pc, p4), true, par.dxfBasePoint, par.layer);

		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		mesh1 = new THREE.Mesh(geom, params.materials.metal);
		mesh.add(mesh1)

		//крепление
		var p1 = itercectionLineCircle1(line3Out, pc, rad1Top)[0]
		var p2 = itercectionLineCircle1(line4Out, pc, rad1Top)[0]
		var p3 = newPoint_xy(p1, profBinding, -550)
		var p4 = newPoint_xy(p1, 0, -550)

		var points = [p1, p2, p3, p4];

		bindingTrussPar.points = points;
		var bind = drawBindingTruss(bindingTrussPar);
		mesh.add(bind);

		var p1 = itercectionLineCircle1(line3In, pc, rad1Top)[0]
		var p2 = itercectionLineCircle1(line4In, pc, rad1Top)[0]
		var p3 = newPoint_xy(p1, -profBinding, -550)
		var p4 = newPoint_xy(p1, 0, -550)

		var points = [p1, p2, p3, p4];

		bindingTrussPar.points = points;
		bindingTrussPar.sideFactor = -1;
		var bind = drawBindingTruss(bindingTrussPar);
		mesh.add(bind);

		//Раскосы
		var angBrace = Math.PI / 4;
		var pLast = itercectionLineCircle1(line1In, pc, rad2Bot)[0];

		//определяем угол сдвига
		var pt = newPoint_xy(pLast, 0, rad1Top - rad2Bot)
		var pt1 = itercectionLineCircle(pLast, polar(pLast, angBrace, 100), pc, rad1Top)[0]
		var line = parallel(pLast, pt1, -bracePar.profY)
		var pt2 = itercectionLineCircle1(line, pc, rad1Top)[0];
		var ang1 = Math.abs(calcAngleX1(pt, pt2)) * 2;

		var pEndTop = itercectionLineCircle1(line4Out, pc, rad1Top)[0];
		var pEndBot = itercectionLineCircle1(line4Out, pc, rad2Bot)[0];

		// определяем угол поворота раскосов, так они начинаются не с середины
		var ptLast = itercectionLineCircle1(line4In, pc, rad2Bot)[0];
		var ang2 = calcAngleX1(pc, ptLast) - Math.PI / 2 

		var j = 0;
		while (true) {
			//первый раскос
			if (j % 2 == 0) {
				var points = [];
				var pb1 = copyPoint(pLast)
				var pb2 = itercectionLineCircle(pb1, polar(pb1, ((angBrace + j * ang1) + Math.PI / 2), 100), pc, rad1Top)[0]

				if (pb2.x < pEndTop.x) break;

				points.push(pb1)
				points.push(pb2)
				var line = parallel(pb1, pb2, -bracePar.profY)
				var pb3 = itercectionLineCircle1(line, pc, rad1Top)[0];

				if (pb3.x < pEndTop.x) break;

				var pb4 = itercectionLineCircle1(line, pc, rad2Bot)[0];
				points.push(pb3)
				points.push(pb4)

				points = rotatePoints(points, ang2, pc)
				shapeMeshPar.points =  points;
				shapeMeshPar.extrudeOptions.amount = bracePar.profZ;
				mesh.add(createShapeAndMesh(shapeMeshPar))

				var pLast = copyPoint(pb3)
			}
			//второй раскос (симметричный первому)------------------------------
			if (j % 2 !== 0) {
				var points = [];
				var pb1 = copyPoint(pLast)
				var pb2 = itercectionLineCircle(pb1, polar(pb1, (angBrace + (j + 1) * ang1) + Math.PI, 100), pc, rad2Bot)[1]

				if (pb2.x < pEndBot.x) break;

				points.push(pb1)
				points.push(pb2)
				var line = parallel(pb1, pb2, bracePar.profY)
				var pb3 = itercectionLineCircle1(line, pc, rad2Bot)[1];

				if (pb3.x < pEndBot.x) break;

				var pb4 = itercectionLineCircle1(line, pc, rad1Top)[1];
				points.push(pb3)
				points.push(pb4)

				points = rotatePoints(points, ang2, pc)
				shapeMeshPar.points = points;
				shapeMeshPar.extrudeOptions.amount = bracePar.profZ;
				mesh.add(createShapeAndMesh(shapeMeshPar))

				var pLast = copyPoint(pb3)
			}
			j++;
		}
	}

	if (params.carportType == 'двухскатный') {

		var rad = partPar.main.arcPar.topArc.rad;
	
		var pc = newPoint_xy(p0, 0, -rad);

		var rad1Top = rad - partPar.truss.chord.profSize.x
		var rad2Top = rad; //врехний радиус верхнего пояса
		var rad1Bot = rad2Top - partPar.truss.endHeight;
		var rad2Bot = rad1Bot + partPar.truss.chord.profSize.x;

		//верхний пояс---------------------------------------------------------------
		var shape = new THREE.Shape();
		var p2 = itercectionLineCircle1(line1Out, pc, rad2Top)[0]
		var p1 = itercectionLineCircle(p2, polar(p2, Math.PI / 2 + ang, 100), pc, rad1Top)[0]
		var p3 = itercectionLineCircle1(line1In, pc, rad2Top)[0]
		var p4 = itercectionLineCircle(p3, polar(p3, Math.PI / 2 - ang, 100), pc, rad1Top)[0]


		addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint, par.layer);
		addArc2(shape, par.dxfArr, pc, rad2Top, calcAngleX1(pc, p2), calcAngleX1(pc, p3), false, par.dxfBasePoint, par.layer);
		addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint, par.layer);
		addArc2(shape, par.dxfArr, pc, rad1Top, calcAngleX1(pc, p1), calcAngleX1(pc, p4), true, par.dxfBasePoint, par.layer);



		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		mesh1 = new THREE.Mesh(geom, params.materials.metal);
		mesh.add(mesh1)

		var angBrace = calcAngleX1(p1, itercectionLineCircle(p0, polar(p0, Math.PI / 2, 100), pc, rad1Top)[0])

		//нижний пояс---------------------------------------------------------------
		var shape = new THREE.Shape();
		var p1 = itercectionLineCircle1(line4Out, pc, rad1Bot)[0]
		var p2 = itercectionLineCircle1(line4Out, pc, rad2Bot)[0]
		var p3 = itercectionLineCircle1(line4In, pc, rad2Bot)[0]
		var p4 = itercectionLineCircle1(line4In, pc, rad1Bot)[0]


		addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint, par.layer);
		addArc2(shape, par.dxfArr, pc, rad2Bot, calcAngleX1(pc, p2), calcAngleX1(pc, p3), false, par.dxfBasePoint, par.layer);
		addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint, par.layer);
		addArc2(shape, par.dxfArr, pc, rad1Bot, calcAngleX1(pc, p1), calcAngleX1(pc, p4), true, par.dxfBasePoint, par.layer);



		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		mesh1 = new THREE.Mesh(geom, params.materials.metal);
		mesh.add(mesh1)

		//крепление--------------------------------------------------------------
		var p1 = itercectionLineCircle1(line3Out, pc, rad1Top)[0]
		var p2 = itercectionLineCircle1(line4Out, pc, rad1Top)[0]
		var p3 = newPoint_xy(p1, profBinding, -550)
		var p4 = newPoint_xy(p1, 0, -550)

		var points = [p1, p2, p3, p4];

		bindingTrussPar.points = points;
		var bind = drawBindingTruss(bindingTrussPar);
		mesh.add(bind);

		//----------------------------------------
		var p1 = itercectionLineCircle1(line3In, pc, rad1Top)[0]
		var p2 = itercectionLineCircle1(line4In, pc, rad1Top)[0]
		var p3 = newPoint_xy(p1, -profBinding, -550)
		var p4 = newPoint_xy(p1, 0, -550)

		var points = [p1, p2, p3, p4];

		bindingTrussPar.points = points;
		bindingTrussPar.sideFactor = -1;
		var bind = drawBindingTruss(bindingTrussPar);
		mesh.add(bind);

		//Раскосы---------------------------------------------
		var angBrace = Math.PI / 4;
		for (var i = 0; i < 2; i++) {
			shapeMeshPar.holes = [];
			var sideFactor = 1
			var lineAUX4 = line4Out;
			if (i == 1) {
				var sideFactor = -1
				var lineAUX4 = line4In;
			}

			var pLast = itercectionLineCircle(p0, polar(p0, Math.PI / 2, 100), pc, rad2Bot)[0]

			//определяем угол сдвига
			var pt = newPoint_xy(pLast, 0, rad1Top - rad2Bot)
			var pt1 = itercectionLineCircle(pLast, polar(pLast, angBrace, 100), pc, rad1Top)[0]
			var line = parallel(pLast, pt1, -bracePar.profY)
			var pt2 = itercectionLineCircle1(line, pc, rad1Top)[0];
			var ang1 = Math.abs(calcAngleX1(pt, pt2)) * 2;

			var pEndTop = itercectionLineCircle1(lineAUX4, pc, rad1Top)[0];
			var pEndBot = itercectionLineCircle1(lineAUX4, pc, rad2Bot)[0];
			if (i == 1) {
				var sideFactor = -1
				var lineAUX4 = line4In;
			}

			var j = 0;
			var isBreak = false;
			while (true) {
				//первый раскос
				if (j % 2 == 0) {
					var points = [];
					var pb1 = copyPoint(pLast)
					var pb2 = itercectionLineCircle(pb1, polar(pb1, ((angBrace + j * ang1)* sideFactor + Math.PI / 2) , 100), pc, rad1Top)[0]
					//if (Math.abs(pb2.x) > Math.abs(pEndTop.x)) {
					//	pb2 = itercection(pb1, polar(pb1, ((angBrace + j * ang1) * sideFactor + Math.PI / 2) , 100), lineAUX4.p1, lineAUX4.p2)
					//	isBreak = true;
					//}

					if (Math.abs(pb2.x) > Math.abs(pEndTop.x)) break;

					points.push(pb1)
					points.push(pb2)
					var line = parallel(pb1, pb2, -bracePar.profY)
					var pb3 = itercectionLineCircle1(line, pc, rad1Top)[0];
					//if (Math.abs(pb3.x) > Math.abs(pEndTop.x)) {
					//	pb3 = itercectionLines(line, lineAUX4)
					//	if (!isBreak) points.push(pEndTop)
					//	isBreak = true;
					//}

					if (Math.abs(pb3.x) > Math.abs(pEndTop.x)) break;

					var pb4 = itercectionLineCircle1(line, pc, rad2Bot)[0];
					points.push(pb3)
					points.push(pb4)

					shapeMeshPar.points = points;
					shapeMeshPar.extrudeOptions.amount = bracePar.profZ;
					mesh.add(createShapeAndMesh(shapeMeshPar))

					var pLast = copyPoint(pb3)

					if (isBreak) break;
				}
				//второй раскос (симметричный первому)------------------------------
				if (j % 2 !== 0) {
					var points = [];
					var pb1 = copyPoint(pLast)
					var pb2 = itercectionLineCircle(pb1, polar(pb1, ((angBrace + (j + 1) * ang1) + Math.PI / 2) * sideFactor + Math.PI / 2, 100), pc, rad2Bot)[1]
					//if (Math.abs(pb2.x) > Math.abs(pEndBot.x)) {
					//	pb2 = itercection(pb1, polar(pb1, ((angBrace + (j + 1) * ang1) + Math.PI / 2) * sideFactor + Math.PI / 2, 100), lineAUX4.p1, lineAUX4.p2)
					//	isBreak = true;
					//}

					if (Math.abs(pb2.x) > Math.abs(pEndBot.x)) break;

					points.push(pb1)
					points.push(pb2)
					var line = parallel(pb1, pb2, bracePar.profY)
					var pb3 = itercectionLineCircle1(line, pc, rad2Bot)[1];
					//if (Math.abs(pb3.x) > Math.abs(pEndBot.x)) {
					//	pb3 = itercectionLines(line, lineAUX4)
					//	if (!isBreak) points.push(pEndBot)
					//	isBreak = true;
					//}

					if (Math.abs(pb3.x) > Math.abs(pEndBot.x)) break;

					var pb4 = itercectionLineCircle1(line, pc, rad1Top)[1];
					points.push(pb3)
					points.push(pb4)


					shapeMeshPar.points = points;
					shapeMeshPar.extrudeOptions.amount = bracePar.profZ;
					mesh.add(createShapeAndMesh(shapeMeshPar))

					var pLast = copyPoint(pb3)

					if (isBreak) break;
				}
				j++;
			}

		}

	}
/*
	//раскос крепления---------------------------------------------------------------
	var offset = 200
	var pEndBot = itercectionLineCircle1(line4Out, pc, rad1Bot)[0];
	var pb1 = newPoint_xy(pEndBot, 0, -offset)
	var pb2 = itercectionLineCircle(pb1, polar(pb1, Math.PI / 4, 100), pc, rad1Bot)[0]
	var line = parallel(pb1, pb2, -bracePar.profY)
	var pb3 = itercectionLineCircle1(line, pc, rad1Bot)[0]
	var pb4 = itercectionLines(line, line4Out)
	var points = [pb1, pb2, pb3, pb4];

	shapeMeshPar.points = points;
	shapeMeshPar.extrudeOptions.amount = bracePar.profZ;
	mesh.add(createShapeAndMesh(shapeMeshPar))

	//раскос крепления с другой стороны
	var pEndBot = itercectionLineCircle1(line4In, pc, rad1Bot)[0];
	var pb1 = newPoint_xy(pEndBot, 0, -offset)
	var pb2 = itercectionLineCircle(pb1, polar(pb1, -Math.PI / 4, 100), pc, rad1Bot)[1]
	var line = parallel(pb1, pb2, -bracePar.profY)
	var pb3 = itercectionLineCircle1(line, pc, rad1Bot)[0]
	var pb4 = itercectionLines(line, line4In)
	var points = [pb1, pb2, pb3, pb4];

	shapeMeshPar.points = points;
	shapeMeshPar.extrudeOptions.amount = bracePar.profZ;
	mesh.add(createShapeAndMesh(shapeMeshPar))
*/

	var pt = itercectionLineCircle1(line2Out, pc, rad1Top)[0]
	var pt1 = newPoint_xy(pt, partPar.column.profSize.x / 2, 0)
	var pt2 = itercectionLineCircle(pt1, newPoint_xy(pt1, Math.PI / 2, 100), pc, rad2Top)[0]
	var dy = -pt.y //+ (partPar.truss.endHeight - distance(pt1, pt2));


	mesh.position.y = dy + 100 // 100 - подогнано
	if (params.carportType == 'односкатный') mesh.position.x = params.width / 2 - partPar.column.profSize.x / 2 - params.sideOffset;
	par.mesh.add(mesh)
	


	// Выводим переменные для использования дальше
	var pt = itercectionLineCircle(pc, polar(pc, Math.PI / 2, 100), pc, rad2Top)[0]
	var pt1 = itercectionLineCircle(pc, polar(pc, Math.PI / 2, 100), pc, rad1Bot)[0]
	var arcAngle = topArc.startAngle - topArc.endAngle;
	par.topRad = topArc.rad;
	par.centerY = dy;
	par.centerYBot = dy;
	par.arcLength = topArc.rad * arcAngle;
	par.topArc = topArc;
	topArc.len = topArc.rad * (topArc.startAngle - topArc.endAngle)
	par.progonAmt = Math.ceil(topArc.len / params.progonMaxStep);

	//для двухскатных навесов далее используем полную верхнюю дугу
	if (params.carportType == 'двухскатный') {
		par.topArc.endAngle = Math.PI - topArc.startAngle;
		par.progonAmt *= 2;
	}


	//для двухскатных навесов далее используем полную верхнюю дугу
	if (params.carportType == 'двухскатный') {
		par.topArc.endAngle = Math.PI - topArc.startAngle;
		par.progonAmt *= 2;
	}
	
	//var box3 = new THREE.Box3().setFromObject(truss);
	//var s = ((box3.max.x - box3.min.x) / 1000) * ((box3.max.y - box3.min.y) / 1000);
	var s = 0
	var lenTruss = distance(pt3Out, pt3In)
	var partName = "truss";
	if (typeof specObj != 'undefined') {
		name = lenTruss;
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				stripeLength: 0,
				name: "Ферма поперечная",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "carcas",
			}
		}
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += s;
		par.mesh.specParams = { specObj: specObj, amt: 1, area: s, partName: partName, name: name }
	}
	par.mesh.specId = partName + name;

	return par;

}

/** функция отрисовывает сварную ферму из проф. трубы для плоской кровли
*/
function drawTriangleTubeTruss(par) {
	if (!par) par = {};
	if (!par.dxfBasePoint) par.dxfBasePoint = { x: 0, y: 0 };
	if (!par.len) par.len = params.width;
	par.mesh = new THREE.Object3D();
	var mesh = new THREE.Object3D();

	var beamProfParams = getProfParams(params.chordProf)

	var ang = partPar.main.roofAng;

	par.len = params.width / 2;
	if (params.carportType == "односкатный") par.len = params.width
	

	var sideOffset = params.sideOffset;
	var profBinding = 20;
	var sideFactor = 1;

	var extrudeOptions = {
		amount: partPar.truss.chord.profSize.x,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var shapeMeshPar = {
		points: [],
		holes: [],
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		extrudeOptions: extrudeOptions,
		material: params.materials.metal,
	}

	
	var bracePar = {//раскосы
		profY: partPar.truss.web.profSize.x,
		profZ: partPar.truss.web.profSize.y,
		stepBrace: 5, // расстояние между раскосами
		stepBraceDivide: 20,// расстояние между раскосами на разделение фермы
	};

	var bindingTrussPar = {//крепление фермы
		points: [],
		profBinding: profBinding,
		shapeMeshPar: shapeMeshPar,
		sideFactor: 1,
		ang: ang,
	};

	var p0 = { x: 0, y: 0 };

	// вспомогательные прямые
	{
		var pt1Out = newPoint_xy(p0, -params.width / 2, 0);
		var pt2Out = newPoint_xy(pt1Out, sideOffset, 0);
		var pt3Out = newPoint_xy(pt2Out, partPar.column.profSize.x, 0);
		var pt4Out = newPoint_xy(pt3Out, profBinding, 0);
		var line1Out = { p1: pt1Out, p2: polar(pt1Out, Math.PI / 2, 100) }
		var line2Out = { p1: pt2Out, p2: polar(pt2Out, Math.PI / 2, 100) }
		var line3Out = { p1: pt3Out, p2: polar(pt3Out, Math.PI / 2, 100) }
		var line4Out = { p1: pt4Out, p2: polar(pt4Out, Math.PI / 2, 100) }

		var pt1In = newPoint_xy(p0, params.width / 2, 0);
		var pt2In = newPoint_xy(pt1In, -sideOffset, 0);
		if (params.carportType == 'односкатный') pt2In = newPoint_xy(pt1In, 0, 0);
		var pt3In = newPoint_xy(pt2In, -partPar.column.profSize.x, 0);
		var pt4In = newPoint_xy(pt3In, -profBinding, 0);
		var line1In = { p1: pt1In, p2: polar(pt1In, Math.PI / 2, 100) }
		var line2In = { p1: pt2In, p2: polar(pt2In, Math.PI / 2, 100) }
		var line3In = { p1: pt3In, p2: polar(pt3In, Math.PI / 2, 100) }
		var line4In = { p1: pt4In, p2: polar(pt4In, Math.PI / 2, 100) }
	}

	if (params.carportType == 'односкатный') {

		var line1Top = { p1: copyPoint(p0), p2: polar(p0, ang, 100) }
		var line2Top = parallel(line1Top.p1, line1Top.p2, partPar.truss.chord.profSize.y)

		var line1Bot = parallel(line1Top.p1, line1Top.p2, -(partPar.truss.endHeight - partPar.truss.chord.profSize.y))
		var line2Bot = parallel(line1Bot.p1, line1Bot.p2, partPar.truss.chord.profSize.y) 

		//Раскосы
		var pEndTop = itercectionLines(line1Top, line4Out);
		var pEndBot = itercectionLines(line2Bot, line4Out);
		var pc = itercectionLines(line2Bot, line4In)
		var angBrace = ang + Math.PI / 4;
		var j = 0;
		var isBreak = false;
		while (true) {
			//первый раскос
			if (j % 2 == 0) {
				var points = [];
				var pb1 = polar(pc, ang, - bracePar.stepBrace)
				var pb2 = itercection(pb1, polar(pb1, (angBrace + Math.PI / 2), 100), line1Top.p1, line1Top.p2)
				if (Math.abs(pb2.x) > Math.abs(pEndTop.x)) {
					pb2 = itercection(pb1, polar(pb1, (angBrace + Math.PI / 2), 100), line4Out.p1, line4Out.p2)
					isBreak = true;
				}
				points.push(pb1)
				points.push(pb2)
				var line = parallel(pb1, pb2, -bracePar.profY)
				var pb3 = itercectionLines(line, line1Top)
				if (Math.abs(pb3.x) > Math.abs(pEndTop.x)) {
					pb3 = itercectionLines(line, line4Out)
					if (!isBreak) points.push(pEndTop)
					isBreak = true;
				}
				var pb4 = itercectionLines(line, line2Bot)
				points.push(pb3)
				points.push(pb4)

				shapeMeshPar.points = points;
				shapeMeshPar.extrudeOptions.amount = bracePar.profZ;
				mesh.add(createShapeAndMesh(shapeMeshPar))

				var pc = copyPoint(pb3)

				if (isBreak) break;
			}
			//второй раскос (симметричный первому)------------------------------
			if (j % 2 !== 0) {
				var points = [];
				var pb1 = polar(pc, ang, - bracePar.stepBrace)
				var pb2 = itercection(pb1, polar(pb1, (angBrace + Math.PI), 100), line2Bot.p1, line2Bot.p2)
				if (Math.abs(pb2.x) > Math.abs(pEndBot.x)) {
					pb2 = itercection(pb1, polar(pb1, (angBrace + Math.PI) * sideFactor, 100), line4Out.p1, line4Out.p2)
					isBreak = true;
				}
				points.push(pb1)
				points.push(pb2)
				var line = parallel(pb1, pb2, bracePar.profY)
				var pb3 = itercectionLines(line, line2Bot)
				if (Math.abs(pb3.x) > Math.abs(pEndBot.x)) {
					pb3 = itercectionLines(line, line4Out)
					if (!isBreak) points.push(pEndBot)
					isBreak = true;
				}
				var pb4 = itercectionLines(line, line1Top)
				points.push(pb3)
				points.push(pb4)


				shapeMeshPar.points = points;
				shapeMeshPar.extrudeOptions.amount = bracePar.profZ;
				mesh.add(createShapeAndMesh(shapeMeshPar))

				var pc = copyPoint(pb3)

				if (isBreak) break;
			}
			j++;
		}

		//раскос крепления
		var offset = 200
		var pEndBot = itercectionLines(line1Bot, line4Out);
		var pb1 = newPoint_xy(pEndBot, 0, -offset)
		var pb2 = polar(pEndBot, ang, offset)
		var line = parallel(pb1, pb2, -bracePar.profY)
		var pb3 = itercectionLines(line, line1Bot)
		var pb4 = itercectionLines(line, line4Out)
		var points = [pb1, pb2, pb3, pb4];

		shapeMeshPar.points = points;
		shapeMeshPar.extrudeOptions.amount = bracePar.profZ;
		mesh.add(createShapeAndMesh(shapeMeshPar))

		//раскос крепления с другой стороны
		var pEndBot = itercectionLines(line1Bot, line4In);
		var pb1 = newPoint_xy(pEndBot, 0, -offset)
		var pb2 = polar(pEndBot, ang, -offset)
		var line = parallel(pb1, pb2, -bracePar.profY)
		var pb3 = itercectionLines(line, line1Bot)
		var pb4 = itercectionLines(line, line4In)
		var points = [pb1, pb2, pb3, pb4];

		shapeMeshPar.points = points;
		shapeMeshPar.extrudeOptions.amount = bracePar.profZ;
		mesh.add(createShapeAndMesh(shapeMeshPar))

		//верхний пояс---------------------------------------------------------------

		//var pt = itercectionLines(line1Top, line2Out)
		//var dy = -pt.y;
		var pt = itercectionLines(line1Top, line2Out)
		var pt1 = newPoint_xy(pt, partPar.column.profSize.x / 2, 0)
		var pt2 = itercection(pt1, newPoint_xy(pt1, 0, 100), line2Top.p1, line2Top.p2)
		var dy = -pt.y + (partPar.truss.endHeight - distance(pt1, pt2));

		var p2 = itercectionLines(line2Top, line1Out)
		var p1 = itercection(line1Top.p1, line1Top.p2, p2, polar(p2, Math.PI / 2 + ang, 100))
		var p4 = itercectionLines(line1Top, line1In)
		var p3 = itercection(line2Top.p1, line2Top.p2, p4, polar(p4, Math.PI / 2 + ang, 100))

		var points = [p1, p2, p3, p4];

		partPar.truss.endPoint = newPoint_xy(p2, 0, dy);
		par.centerY = p3.y + dy;

		shapeMeshPar.points = points;
		mesh.add(createShapeAndMesh(shapeMeshPar))

		//нижний пояс-------------------------------------------------------------

		var p1 = itercectionLines(line1Bot, line4Out);
		var p2 = itercectionLines(line2Bot, line4Out);
		var p3 = itercectionLines(line2Bot, line4In);
		var p4 = itercectionLines(line1Bot, line4In);

		var points = [p1, p2, p3, p4];

		par.centerYBot = p4.y + dy;

		shapeMeshPar.points = points;
		mesh.add(createShapeAndMesh(shapeMeshPar))

		//крепление--------------------------------------------------------------
		var p1 = itercectionLines(line1Top, line3Out);
		var p2 = itercectionLines(line1Top, line4Out);
		var p3 = newPoint_xy(p1, profBinding, -500)
		var p4 = newPoint_xy(p1, 0, -500)

		var points = [p1, p2, p3, p4];

		bindingTrussPar.points = points;
		var bind = drawBindingTruss(bindingTrussPar);
		mesh.add(bind);

		//----------------------------------------
		var p1 = itercectionLines(line1Top, line3In);
		var p2 = itercectionLines(line1Top, line4In);
		var p3 = newPoint_xy(p1, -profBinding, -500)
		var p4 = newPoint_xy(p1, 0, -500)

		var points = [p1, p2, p3, p4];

		bindingTrussPar.points = points;
		bindingTrussPar.sideFactor = -1;
		var bind = drawBindingTruss(bindingTrussPar);
		mesh.add(bind);
	}
	if (params.carportType == 'двухскатный') {
		for (var i = 0; i < 2; i++) {
			shapeMeshPar.holes = [];
			var sideFactor = 1
			var lineAUX1 = line1Out;
			var lineAUX2 = line2Out;
			var lineAUX3 = line3Out;
			var lineAUX4 = line4Out;
			if (i == 1) {
				var sideFactor = -1
				var lineAUX1 = line1In;
				var lineAUX2 = line2In;
				var lineAUX3 = line3In;
				var lineAUX4 = line4In;
			}

			var line1Top = { p1: copyPoint(p0), p2: polar(p0, ang * sideFactor, 100) }
			var line2Top = parallel(line1Top.p1, line1Top.p2, partPar.truss.chord.profSize.y)

			var line1Bot = parallel(line1Top.p1, line1Top.p2, -(partPar.truss.width - partPar.truss.chord.profSize.y))
			var line2Bot = parallel(line1Bot.p1, line1Bot.p2, partPar.truss.chord.profSize.y)
			var p0Bot = itercection(line1Bot.p1, line1Bot.p2, p0, polar(p0, Math.PI / 2, 100))

			var pc = itercection(line2Bot.p1, line2Bot.p2, p0Bot, polar(p0Bot, Math.PI / 2, 100))

			var pEndTop = itercectionLines(line1Top, lineAUX4);
			var pEndBot = itercectionLines(line2Bot, lineAUX4);

			var pDivide = copyPoint(p0Bot); // точка разделения фермы

			//Раскосы
			var distBrace = 0;
			var distBraceAll = distance(pc, pEndBot)
			var j = 0;
			while (true) {
				//первый раскос
				if (j % 2 == 0) {
					var flag = false;
					var points = [];
					var pb1 = polar(pc, ang * sideFactor, - bracePar.stepBrace * sideFactor)
					if (j == 4) pb1 = polar(pc, ang * sideFactor, - bracePar.stepBraceDivide * sideFactor)
					var pb2 = itercection(pb1, polar(pb1, (ang + Math.PI / 2 + Math.PI / 4) * sideFactor, 100), line1Top.p1, line1Top.p2)
					if (Math.abs(pb2.x) > Math.abs(pEndTop.x)) {
						pb2 = itercection(pb1, polar(pb1, (ang + Math.PI / 2 + Math.PI / 4) * sideFactor, 100), lineAUX4.p1, lineAUX4.p2)
						flag = true
					}
					points.push(pb1)
					points.push(pb2)
					var line = parallel(pb1, pb2, -bracePar.profY)
					var pb3 = itercectionLines(line, line1Top)
					if (Math.abs(pb3.x) > Math.abs(pEndTop.x)) {
						pb3 = itercectionLines(line, lineAUX4)
						if(!flag) points.push(pEndTop)
					}
					var pb4 = itercectionLines(line, line2Bot)
					points.push(pb3)
					points.push(pb4)

					shapeMeshPar.points = points;
					shapeMeshPar.extrudeOptions.amount = bracePar.profZ;
					mesh.add(createShapeAndMesh(shapeMeshPar))

					//определяем расстояние одного раскоса
					if (j == 0) {
						var pc1 = polar(pb3, ang * sideFactor, - bracePar.stepBrace * sideFactor)
						pc1 = itercection(pc1, polar(pc1, (ang + Math.PI / 2) * sideFactor, 100), line2Bot.p1, line2Bot.p2)
						distBrace = distance(pc, pc1)
					}

					var pc = copyPoint(pb3)

					if (distBrace * (j + 1) > distBraceAll) break;
				}
				//второй раскос (симметричный первому)------------------------------
				if (j % 2 !== 0) {
					var flag = false;
					var points = [];
					var pb1 = polar(pc, ang * sideFactor, - bracePar.stepBrace * sideFactor)
					var pb2 = itercection(pb1, polar(pb1, (ang + Math.PI / 8 * 10) * sideFactor, 100), line2Bot.p1, line2Bot.p2)
					if (Math.abs(pb2.x) > Math.abs(pEndBot.x)) {
						pb2 = itercection(pb1, polar(pb1, (ang + Math.PI / 2 + Math.PI / 4) * sideFactor, 100), lineAUX4.p1, lineAUX4.p2)
						flag = true
					}
					points.push(pb1)
					points.push(pb2)
					var line = parallel(pb1, pb2, bracePar.profY)
					var pb3 = itercectionLines(line, line2Bot)
					if (Math.abs(pb3.x) > Math.abs(pEndBot.x)) {
						pb3 = itercectionLines(line, lineAUX4)
						if (!flag) points.push(pEndBot)
					}
					var pb4 = itercectionLines(line, line1Top)
					points.push(pb3)
					points.push(pb4)


					shapeMeshPar.points = points;
					shapeMeshPar.extrudeOptions.amount = bracePar.profZ;
					mesh.add(createShapeAndMesh(shapeMeshPar))

					var pc = copyPoint(pb3)

					if (j == 3)
						pDivide = polar(pc, ang * sideFactor, -bracePar.stepBraceDivide / 2 * sideFactor)

					if (distBrace * (j + 1) > distBraceAll) break;
				}
				j++;
			}

			//раскос крепления
			var offset = 200
			var pEndBot = itercectionLines(line1Bot, lineAUX4);
			var pb1 = newPoint_xy(pEndBot, 0, -offset)
			var pb2 = polar(pEndBot, ang * sideFactor, offset * sideFactor)
			var line = parallel(pb1, pb2, -bracePar.profY)
			var pb3 = itercectionLines(line, line1Bot)
			var pb4 = itercectionLines(line, lineAUX4)
			var points = [pb1, pb2, pb3, pb4];

			shapeMeshPar.points = points;
			shapeMeshPar.extrudeOptions.amount = bracePar.profZ;
			mesh.add(createShapeAndMesh(shapeMeshPar))


			//верхний пояс-----------------------
			{
				if (i == 0) {
					var pt = itercectionLines(line1Top, lineAUX2)
					var pt1 = newPoint_xy(pt, partPar.column.profSize.x / 2, 0)
					var pt2 = itercection(pt1, newPoint_xy(pt1, 0, 100), line2Top.p1, line2Top.p2)
					var dy = -pt.y + (partPar.truss.endHeight - distance(pt1,pt2));
				}

				var p2 = itercectionLines(line2Top, lineAUX1)
				var p1 = itercection(line1Top.p1, line1Top.p2, p2, polar(p2, Math.PI / 2 + ang * sideFactor, 100))
				var p3 = itercection(line2Top.p1,
					line2Top.p2,
					pDivide,
					polar(pDivide, Math.PI / 2 + ang * sideFactor, 100))
				var p4 = itercection(line1Top.p1,
					line1Top.p2,
					pDivide,
					polar(pDivide, Math.PI / 2 + ang * sideFactor, 100))

				if (i == 0) {
					partPar.truss.endPoint = newPoint_xy(p2, 0, dy);
					par.centerY = p3.y + dy;
				}

				var points = [p1, p2, p3, p4];

				shapeMeshPar.points = points;
				shapeMeshPar.extrudeOptions.amount = partPar.truss.chord.profSize.x;
				mesh.add(createShapeAndMesh(shapeMeshPar))

				//-------------------------
				var p1 = copyPoint(p4);
				var p2 = copyPoint(p3);
				var p4 = copyPoint(p0)
				var p3 = itercection(line2Top.p1, line2Top.p2, p4, polar(p4, Math.PI / 2, 100))

				var points = [p1, p2, p3, p4];

				shapeMeshPar.points = points;
				shapeMeshPar.extrudeOptions.amount = partPar.truss.chord.profSize.x;
				mesh.add(createShapeAndMesh(shapeMeshPar))
			}

			//нижний пояс------------------------
			{
				var p1 = itercectionLines(line1Bot, lineAUX4);
				var p2 = itercectionLines(line2Bot, lineAUX4);
				var p3 = itercection(line2Bot.p1,
					line2Bot.p2,
					pDivide,
					polar(pDivide, Math.PI / 2 + ang * sideFactor, 100))
				var p4 = itercection(line1Bot.p1,
					line1Bot.p2,
					pDivide,
					polar(pDivide, Math.PI / 2 + ang * sideFactor, 100))

				var points = [p1, p2, p3, p4];

				if (i == 0) {
					par.centerYBot = p4.y + dy;
				}

				shapeMeshPar.points = points;
				mesh.add(createShapeAndMesh(shapeMeshPar))

				//-----------------------------------
				var p1 = copyPoint(p4);
				var p2 = copyPoint(p3);
				var p4 = copyPoint(p0Bot)
				var p3 = itercection(line2Bot.p1, line2Bot.p2, p4, polar(p4, Math.PI / 2, 100))

				var points = [p1, p2, p3, p4];

				shapeMeshPar.points = points;
				mesh.add(createShapeAndMesh(shapeMeshPar))
			}

			//крепление--------------------------
			{
				var p1 = itercectionLines(line1Top, lineAUX3);
				var p2 = itercectionLines(line1Top, lineAUX4);
				var p3 = newPoint_xy(p1, profBinding * sideFactor, -500)
				var p4 = newPoint_xy(p1, 0, -500)
				var points = [p1, p2, p3, p4];

				bindingTrussPar.points = points;
				bindingTrussPar.sideFactor = sideFactor;
				var bind = drawBindingTruss(bindingTrussPar);
				mesh.add(bind);
			}

			//Фланец соединения фермы------------
			{
				var width = partPar.truss.chord.profSize.y;
				var height = partPar.truss.width - partPar.truss.chord.profSize.x * 2;
				var thk = 4;

				var p1 = copyPoint(p0);
				var p2 = newPoint_xy(p1, 0, height)
				var p3 = newPoint_xy(p2, width, 0)
				var p4 = newPoint_xy(p1, width, 0)
				var points = [p1, p2, p3, p4];

				var holes = []
				var c1 = newPoint_xy(p1, width / 2, 20)
				var c2 = newPoint_xy(p1, width / 2, height - 20)
				c1.rad = c2.rad = 6;
				holes.push(c1, c2)

				shapeMeshPar.points = points;
				shapeMeshPar.extrudeOptions.amount = thk;
				shapeMeshPar.holes = holes;

				var meshFlan = new THREE.Object3D();
				flan = createShapeAndMesh(shapeMeshPar);
				flan.rotation.x = ang * sideFactor;

				// болты
				var boltPar = {
					diam: 10,
					len: 30,
					headShim: true,
					headType: "шестигр.",
				}

				holes.forEach(function(center) {
					var bolt = drawBolt(boltPar).mesh;
					bolt.rotation.x = Math.PI / 2
					bolt.position.x = center.x
					bolt.position.y = center.y
					//bolt.position.z = 4
					flan.add(bolt);
					bolt.setLayer('metiz');
				})

				meshFlan.add(flan)

				meshFlan.position.x = pDivide.x;
				meshFlan.position.y = pDivide.y;
				meshFlan.rotation.y = -Math.PI / 2;
				mesh.add(meshFlan)

				//второй фланец--------------------
				var meshFlan = new THREE.Object3D();
				flan = createShapeAndMesh(shapeMeshPar);
				flan.rotation.x = ang * sideFactor;
				meshFlan.add(flan)

				var pt = polar(pDivide, ang * sideFactor, thk)
				meshFlan.position.x = pt.x;
				meshFlan.position.y = pt.y;
				meshFlan.rotation.y = -Math.PI / 2;
				mesh.add(meshFlan)
			}
		}
	}

	//сохраняем точку конец фермы для отрисовки прогонов и кровли
	partPar.truss.endPoint.x += params.width / 2 - sideOffset - partPar.column.profSize.x / 2


	mesh.position.y = dy
	if (params.carportType == 'односкатный') mesh.position.x = params.width / 2 - partPar.column.profSize.x / 2 - params.sideOffset;
	par.mesh.add(mesh)

	//var box3 = new THREE.Box3().setFromObject(truss);
	//var s = ((box3.max.x - box3.min.x) / 1000) * ((box3.max.y - box3.min.y) / 1000);
	
	var s = 0
	var lenTruss = distance(pt3Out, pt3In)
	var partName = "truss";
	if (typeof specObj != 'undefined') {
		name = lenTruss;
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				stripeLength: 0,
				name: "Ферма поперечная",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "carcas",
			}
		}
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += s;
		par.mesh.specParams = { specObj: specObj, amt: 1, area: s, partName: partName, name: name }
	}
	par.mesh.specId = partName + name;

	return par;

}

/** функция создает shape и mesh
	*@params: len,dxfBasePoint
		points: точки shape
		holes: центры отверстий
*/
function createShapeAndMesh(par) {
	//создаем шейп
	var shapePar = {
		points: par.points,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
	}

	var shape = drawShapeByPoints2(shapePar).shape;

	if (par.holes) {
		for (var i = 0; i < par.holes.length; i++) {
			addRoundHole(shape, par.dxfArr, par.holes[i], par.holes[i].rad, par.dxfBasePoint);
		}
	}

	var geom = new THREE.ExtrudeGeometry(shape, par.extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, par.material);
	return mesh
}

/** функция отрисовывает крепление сварной фермы из проф. трубы
*/
function drawBindingTruss(par) {
	var holes = []
	var pt = newPoint_xy(par.points[0], 0, - partPar.column.profSize.x * Math.tan(par.ang))
	var c1 = newPoint_xy(pt, par.profBinding / 2 * par.sideFactor, -70)
	var c2 = newPoint_xy(pt, par.profBinding / 2 * par.sideFactor, -250)
	var c3 = newPoint_xy(pt, par.profBinding / 2 * par.sideFactor, -450)
	c1.rad = c2.rad = c3.rad = 6;
	holes.push(c1, c2, c3)

	par.shapeMeshPar.points = par.points;
	par.shapeMeshPar.holes = holes;
	par.shapeMeshPar.extrudeOptions.amount = par.profBinding;

	var bind = createShapeAndMesh(par.shapeMeshPar);

	// болты
	var boltPar = {
		diam: 10,
		len: partPar.column.profSize.x + par.profBinding + 20,
		headShim: true,
		headType: "шестигр.",
	}

	holes.forEach(function (center) {
		var bolt = drawBolt(boltPar).mesh;
		bolt.rotation.x = Math.PI / 2
		bolt.rotation.z = Math.PI / 2 * par.sideFactor
		bolt.position.x = center.x - (boltPar.len / 2 - par.profBinding / 2 - 5) * par.sideFactor
		if (params.carportType == 'односкатный' && par.sideFactor == -1) bolt.position.x = center.x + 20
		bolt.position.y = center.y
		bolt.position.z = par.profBinding / 2
		bind.add(bolt);
		bolt.setLayer('metiz');
	})

	par.shapeMeshPar.points = [];
	par.shapeMeshPar.holes = [];

	return bind;
}

/** функция отрисовывает подкосы для конструкции - балки
*/

function drawArcBrace(par) {
	if (!par) par = {};
	if (!par.dxfBasePoint) par.dxfBasePoint = { x: 0, y: 0 };
	if (!par.dxfArr) par.dxfArr = dxfPrimitivesArr;

	par.mesh = new THREE.Object3D();

	var extrudeOptions = {
		amount: 2,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var thk = 4;
	var offset = 100;
	var len = par.length - thk - offset;

	var p0 = { x: 0, y: 0 };

	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p0, 0, -len);
	var p3 = newPoint_xy(p0, len, -len);
	var p4 = newPoint_xy(p0, len, 0);

	var pt1 = newPoint_xy(p2, 0, -offset);
	var pt2 = newPoint_xy(p4, offset, 0);

	var pc1 = p3;
	var pc2 = newPoint_xy(p3, 350, -350);

	var rad1 = distance(pc1, p2);
	var rad2 = distance(pc2, pt1);

	var area = Math.abs(THREE.ShapeUtils.area([p2, pt1, pt2, p4]));

	var shape = new THREE.Shape();

	addLine(shape, par.dxfArr, pt1, p2, par.dxfBasePoint, par.layer);
	addArc2(shape, par.dxfArr, pc1, rad1, Math.PI, Math.PI / 2, true, par.dxfBasePoint, par.layer);
	addLine(shape, par.dxfArr, p4, pt2, par.dxfBasePoint, par.layer);
	addArc2(shape, par.dxfArr, pc2, rad2, calcAngleX1(pc2, pt1), calcAngleX1(pc2, pt2),false, par.dxfBasePoint, par.layer);


	//большие отверстия
	var topArc = {
		center: pc1,
		endAngle: Math.PI / 2 + 0.1,
		height: len,
		len: 0,
		rad: rad1,
		startAngle: Math.PI - 0.1,
	}
	topArc.len = topArc.rad * (topArc.startAngle - topArc.endAngle);

	var botArc = {
		center: pc2,
		endAngle: calcAngleX1(pc2, pt2),
		height: len,
		len: 0,
		rad: rad2,
		startAngle: calcAngleX1(pc2, pt1),
	}
	botArc.len = botArc.rad * (botArc.startAngle - botArc.endAngle);

	var progonAmt = Math.ceil(topArc.len / params.progonMaxStep);

	var holePar = {
		sideWidth: 25, //ширина верхнего и нижнего поясов
		bridgeWidth: 70, //ширина перемычки по верхней дуге
		topArc: topArc, //объект с параметрами верхней дуги фермы
		botArc: botArc, //объект с параметрами нижней дуги фермы		
		shape: shape,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		isHalf: true,
		progonAmt: progonAmt,
		trussHeight: 120,
	}
	holePar.maxHoleDiam = holePar.trussHeight - holePar.sideWidth * 2; //макс. диаметр для круглых отверстий


	addTrussHoles(holePar);

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh1 = new THREE.Mesh(geom, params.materials.metal);
	par.mesh.add(mesh1);

	//нижняя пластина
	var p1 = newPoint_xy(pt1, thk, 0);
	var p2 = newPoint_xy(p1, 0, -30);
	var p3 = newPoint_xy(pt1, 0, -30);
	var p4 = newPoint_xy(pt2, 0, -thk / Math.cos(calcAngleX1(pc2, pt2) - Math.PI / 2));

	var shape = new THREE.Shape();

	addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint, par.layer);
	addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint, par.layer);
	addLine(shape, par.dxfArr, p3, pt1, par.dxfBasePoint, par.layer);
	addArc2(shape, par.dxfArr, pc2, rad2, calcAngleX1(pc2, pt1), calcAngleX1(pc2, pt2), true, par.dxfBasePoint, par.layer);
	addLine(shape, par.dxfArr, pt2, p4, par.dxfBasePoint, par.layer);
	addArc2(shape, par.dxfArr, pc2, rad2 - thk, calcAngleX1(pc2, pt1), calcAngleX1(pc2, p4), false, par.dxfBasePoint, par.layer);

	extrudeOptions.amount = 25;
	extrudeOptions.curveSegments = 60;
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh1 = new THREE.Mesh(geom, params.materials.metal);
	mesh1.position.z = -extrudeOptions.amount / 2;
	par.mesh.add(mesh1);

	//Фланец торцевой

	var p1 = newPoint_xy(p0, 12, 76);
	var p2 = newPoint_xy(p0, 38, 66);
	var p3 = newPoint_xy(p0, 38, 50);
	var p4 = newPoint_xy(p0, 38, 10);
	var p5 = newPoint_xy(p0, 38, -45);
	var p6 = newPoint_xy(p0, 12, -45);
	var p7 = newPoint_xy(p0, 10, -70);
	var p8 = newPoint_xy(p0, -10, -70);
	var p9 = newPoint_xy(p0, -12, -45);
	var p10 = newPoint_xy(p0, -38, -45);
	var p11 = newPoint_xy(p0, -38, 10);
	var p12 = newPoint_xy(p0, -38, 50);
	var p13 = newPoint_xy(p0, -38, 66);
	var p14 = newPoint_xy(p0, -12, 76);

	p2.filletRad = 10;
	p5.filletRad = 10;
	p6.filletRad = 3;
	p13.filletRad = 10;
	p10.filletRad = 10;
	p9.filletRad = 3;

	p1.radCircle = 17;
	p3.radCircle = 36;
	p6.radCircle = 10;
	p13.radCircle = 17;
	p11.radCircle = 36;
	p8.radCircle = 10;

	p6.centerCircle = newPoint_xy(p7, 0, p6.radCircle);
	p8.centerCircle = newPoint_xy(p8, 0, p8.radCircle);

	var points = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14];

	var shapePar = {
		points: points,
		dxfArr: par.dxfArr,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, par.length + 50 , 0),
		clockwise: true,
	}
	var shape = drawShapeByPoints3(shapePar).shape;

	//крепежные отверстия
	var holes = [
		{ x: -17.5, y: -20 },
		{ x: 17.5, y: -20 },
	]
	holes.forEach(function (center) {
		addRoundHole(shape, par.dxfArr, center, 6.5, shapePar.dxfBasePoint);
	})

	extrudeOptions.amount = thk;
	extrudeOptions.curveSegments = 12;
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var flan = new THREE.Mesh(geom, params.materials.metal);
	flan.position.x = par.length;
	flan.rotation.y = Math.PI / 2;
	par.mesh.add(flan);
	flan.setLayer('flans');

	//метизы
	var boltsPar = {
		holes: holes,
		diam: 10,
		len: 30,
		isBolt: { headType: "шестигр.", },
		material: params.materials.inox,
		move: thk,
	}
	var bolts = drawBoltsHoles(boltsPar).mesh;
	flan.add(bolts);

	//фланец крепления подкоса к торцевому фланцу
	var p1 = newPoint_xy(p0, 27.5, 0);
	var p2 = newPoint_xy(p1, 0, -40);
	var p4 = newPoint_xy(p0, -27.5, 0);
	var p3 = newPoint_xy(p4, 0, -40);

	var points = [p1, p2, p3, p4];

	var shapePar = {
		points: points,
		dxfArr: par.dxfArr,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, par.length + 100, 0),
		radOut: 6,
		clockwise: true,
	}
	var shape = drawShapeByPoints3(shapePar).shape;

	//крепежные отверстия
	holes.forEach(function (center) {
		addRoundHole(shape, par.dxfArr, center, 6.5, shapePar.dxfBasePoint);
	})

	extrudeOptions.amount = thk;
	extrudeOptions.curveSegments = 12;
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var flan = new THREE.Mesh(geom, params.materials.metal);
	flan.position.x = par.length - thk;
	flan.rotation.y = Math.PI / 2;
	par.mesh.add(flan);
	flan.setLayer('flans');


	var partName = "brace";
	if (typeof specObj != 'undefined') {
		name = par.length;
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				stripeLength: 0,
				name: "Подпор",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "carcas",
			}
		}
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		par.mesh.specParams = { specObj: specObj, amt: 1, area: s, partName: partName, name: name }
	}
	par.mesh.specId = partName + name;

	return par;

}

/** функция отрисовывает боковую ферму для конструкции рамы
	базовая точка: X - середина расстояния между колоннами, Y - верх колонны
*/
function drawBeamTruss(par) {
	if (!par) par = {};
	if (!par.dxfBasePoint) par.dxfBasePoint = { x: 0, y: 0 };
	if (!par.dxfArr) par.dxfArr = dxfPrimitivesArr;

	par.mesh = new THREE.Object3D();

	var p0 = { x: 0, y: 0 };

	var thkFlan = 8;
	var heightFlanTop = 150;
	var heightFlanBot = 350;
	var heightFlan = heightFlanTop + heightFlanBot;
	var lenBridgeMiddle = 100;

	//верхняя балка
	var p1 = newPoint_xy(p0, -par.length / 2 + thkFlan, heightFlanTop - par.poleProfileY);
	var p2 = newPoint_xy(p1, 0, par.poleProfileY);
	var p3 = newPoint_xy(p0, par.length / 2 - thkFlan, heightFlanTop);
	var p4 = newPoint_xy(p3, 0, -par.poleProfileY);

	var meshPar = {
		points: [p1, p2, p3, p4],
		thk: par.poleProfileZ,
		material: params.materials.metal,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: { x: 0, y: -2000 },
	}

	var pole1 = drawMesh(meshPar).mesh;
	par.mesh.add(pole1);

	//нижняя дуговая балка
	var hord = par.length - thkFlan * 2;
	var heightSegm = heightFlan - par.poleProfileY - lenBridgeMiddle - par.poleProfileY;
	var radIn = (Math.pow(hord / 2, 2) + Math.pow(heightSegm, 2)) / 2 / heightSegm;
	var radOut = radIn + par.poleProfileY;
	var pc = newPoint_xy(p0, 0, heightFlanTop - par.poleProfileY - lenBridgeMiddle - par.poleProfileY - radIn);

	var extrudeOptions = {
		amount: par.poleProfileZ,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};


	var pb1 = newPoint_xy(p0, -par.length / 2 + thkFlan, heightFlanTop - heightFlan);
	var pb2 = itercectionLineCircle(pb1, newPoint_xy(pb1, 0, 100), pc, radOut)[0];
	var pb4 = newPoint_xy(p0, par.length / 2 - thkFlan, heightFlanTop - heightFlan);
	var pb3 = itercectionLineCircle(pb4, newPoint_xy(pb4, 0, 100), pc, radOut)[0];

	var shape = new THREE.Shape();
	addLine(shape, par.dxfArr, pb1, pb2, par.dxfBasePoint);
	addArc2(shape, par.dxfArr, pc, radOut, calcFullAngelX(pc, pb2), calcFullAngelX(pc, pb3), true, par.dxfBasePoint);
	addLine(shape, par.dxfArr, pb3, pb4, par.dxfBasePoint);
	addArc2(shape, par.dxfArr, pc, radIn, calcFullAngelX(pc, pb1), calcFullAngelX(pc, pb4), false, par.dxfBasePoint);

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var flan = new THREE.Mesh(geom, params.materials.metal);
	par.mesh.add(flan);

	//перемычки

	//центральная
	var pt1 = newPoint_xy(p0, -par.poleProfileY / 2, 0);
	var pt2 = newPoint_xy(p0, par.poleProfileY / 2, 0);

	var pm1 = itercectionLineCircle(pt1, newPoint_xy(pt1, 0, 100), pc, radOut)[0];
	var pm2 = itercection(pt1, newPoint_xy(pt1, 0, 100), p1, p4);
	var pm3 = itercection(pt2, newPoint_xy(pt2, 0, 100), p1, p4);
	var pm4 = itercectionLineCircle(pt2, newPoint_xy(pt2, 0, 100), pc, radOut)[0];

	meshPar.points = [pm1, pm2, pm3, pm4];
	var pole1 = drawMesh(meshPar).mesh;
	par.mesh.add(pole1);

	//боковые
	var offset = p4.x / 2;
	var pt1 = newPoint_xy(p0, offset - par.poleProfileY / 2, 0);
	var pt2 = newPoint_xy(p0, offset + par.poleProfileY / 2, 0);

	var pm1 = itercectionLineCircle(pt1, newPoint_xy(pt1, 0, 100), pc, radOut)[0];
	var pm2 = itercection(pt1, newPoint_xy(pt1, 0, 100), p1, p4);
	var pm3 = itercection(pt2, newPoint_xy(pt2, 0, 100), p1, p4);
	var pm4 = itercectionLineCircle(pt2, newPoint_xy(pt2, 0, 100), pc, radOut)[0];

	meshPar.points = [pm1, pm2, pm3, pm4];
	var pole1 = drawMesh(meshPar).mesh;
	par.mesh.add(pole1);

	//----
	var pt1 = newPoint_xy(p0, -offset - par.poleProfileY / 2, 0);
	var pt2 = newPoint_xy(p0, -offset + par.poleProfileY / 2, 0);

	var pm1 = itercectionLineCircle(pt1, newPoint_xy(pt1, 0, 100), pc, radOut)[0];
	var pm2 = itercection(pt1, newPoint_xy(pt1, 0, 100), p1, p4);
	var pm3 = itercection(pt2, newPoint_xy(pt2, 0, 100), p1, p4);
	var pm4 = itercectionLineCircle(pt2, newPoint_xy(pt2, 0, 100), pc, radOut)[0];

	meshPar.points = [pm1, pm2, pm3, pm4];
	var pole1 = drawMesh(meshPar).mesh;
	par.mesh.add(pole1);

	//фланцы
	var offsetY = par.poleProfileY + 30;
	var p1 = newPoint_xy(p0, -par.poleProfileZ / 2, 0);
	var p2 = newPoint_xy(p0, par.poleProfileZ / 2, 0);
	var p3 = newPoint_xy(p2, 0, -heightFlan);
	var p4 = newPoint_xy(p1, 0, -heightFlan);

	var pc1 = newPoint_xy(p0, 0, -offsetY);
	var pc2 = newPoint_xy(p0, 0, -heightFlan + offsetY);
	pc1.rad = pc2.rad = 7.5;

	meshPar.points = [p1, p2, p3, p4];
	meshPar.holes = [pc1, pc2];
	meshPar.thk = thkFlan;

	// фланец с левой стороны
	var flan = drawMesh(meshPar).mesh;
	flan.rotation.y = Math.PI / 2;
	flan.position.x = -par.length / 2;
	flan.position.y = heightFlanTop;
	flan.position.z = par.poleProfileZ / 2;
	par.mesh.add(flan);

	//метизы
	var thkIn = partPar.column.profSize.y / 2 + 8 / 2 + 4 / 2; // 8 - толщина фланца крепления фермы к колонне, 4 - толщина фермы
	var boltsPar = {
		holes: meshPar.holes,
		thkOut: thkFlan,
		thkIn: thkIn, 
		diam: 12,
		isStud: true,
		isNutOut: true,
		isNutIn: true,
		isShimOut: true,
		isShimIn: true,
		material: params.materials.inox,
		//isRotation: true,
	}
	if (par.longBolt1) boltsPar.thkIn = partPar.column.profSize.y + thkFlan;
	var bolts = drawBoltsHoles(boltsPar).mesh;
	flan.add(bolts);

	// фланец с правой стороны
	var flan = drawMesh(meshPar).mesh;
	flan.rotation.y = -Math.PI / 2;
	flan.position.x = par.length / 2;
	flan.position.y = heightFlanTop;
	flan.position.z = par.poleProfileZ / 2;
	par.mesh.add(flan);

	//метизы
	if (!par.noBolt2) {
		boltsPar.thkIn = thkIn;
		var bolts = drawBoltsHoles(boltsPar).mesh;
		flan.add(bolts);
	}

	//проставки
	var thk = partPar.column.profSize.y / 2 - 8 / 2 - 4 / 2; //8 - толщина фланца крепления фермы к колонне, 4 - толщина фермы
	var p1 = newPoint_xy(p0, -par.poleProfileZ / 2, 0);
	var p2 = newPoint_xy(p0, par.poleProfileZ / 2, 0);
	var p3 = newPoint_xy(p2, 0, -par.poleProfileZ);
	var p4 = newPoint_xy(p1, 0, -par.poleProfileZ);

	meshPar.points = [p1, p2, p3, p4];
	meshPar.holes = false;
	meshPar.thk = thk;

	var flan = drawMesh(meshPar).mesh;
	flan.rotation.y = Math.PI / 2;
	flan.position.x = -par.length / 2 - thk;
	flan.position.y = heightFlanTop / 2;
	flan.position.z = par.poleProfileZ / 2;
	par.mesh.add(flan);

	var flan = drawMesh(meshPar).mesh;
	flan.rotation.y = Math.PI / 2;
	flan.position.x = par.length / 2;
	flan.position.y = heightFlanTop / 2;
	flan.position.z = par.poleProfileZ / 2;
	par.mesh.add(flan);


	var box3 = new THREE.Box3().setFromObject(par.mesh);
	var s = ((box3.max.x - box3.min.x) / 1000) * ((box3.max.y - box3.min.y) / 1000);
	var partName = "trussSide";
	if (typeof specObj != 'undefined') {
		name = par.length + "х" + heightFlan + "х" + par.poleProfileZ;
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				area: 0,
				name: "Ферма боковая",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "carcas",
			}
		}
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["sumLength"] += Math.round(par.length / 100) / 10;
		specObj[partName]["area"] += s;
		par.mesh.specParams = { specObj: specObj, amt: 1, area: s, partName: partName, name: name }
	}
	par.mesh.specId = partName + name;
	return par;
}