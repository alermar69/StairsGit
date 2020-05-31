
/** функция отрисовывает прямую ферму из листа с отверстиями
	*@params: height,len,dxfBasePoint
*/
function drawStrightTruss(par){
	if(!par.dxfBasePoint) par.dxfBasePoint = {x:0, y:0};
	
	par.mesh = new THREE.Object3D();
	
	//внешний контур
	var p1 = {x: 0, y: 0}
	var p2 = {x: 0, y: par.height}
	var p3 = {x: par.len, y: par.height}
	var p4 = {x: par.len, y: 0}

	//создаем шейп
	var shapePar = {
		points: [p1,p2,p3,p4],
		dxfArr: par.dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		radOut:20,
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
			dxfArr: par.dxfPrimitivesArr,
			dxfBasePoint: par.dxfBasePoint,
			radOut:20,
		}

		var holeShape = drawShapeByPoints2(shapePar).shape;
		
		shape.holes.push(holeShape)
	}
	
	//отверстия для болтов
	var holeOffset = 20;
	var holeRad = 6.5;
	
	var boltCenters = [];
	
	var center = newPoint_xy(p1, holeOffset, holeOffset)
	boltCenters.push(center)
	var center = newPoint_xy(p2, holeOffset, -holeOffset)
	boltCenters.push(center)
	var center = newPoint_xy(p3, -holeOffset, -holeOffset)
	boltCenters.push(center)
	var center = newPoint_xy(p4, -holeOffset, holeOffset)
	boltCenters.push(center)
	
	boltCenters.forEach(function(center){
		addRoundHole(shape, par.dxfPrimitivesArr, center, holeRad, par.dxfBasePoint); 
	})
	
	var extrudeOptions = {
		amount: par.thk, 
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
		
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var truss = new THREE.Mesh(geom, params.materials.metal);
	par.mesh.add(truss);
	truss.setLayer('carcas');

	var flanPar = {
		rackSize: par.rackSize,
		height: par.height,
		thk: 8,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, -200, 0),
		dxfPrimitivesArr: par.dxfPrimitivesArr
	};

	var box3 = new THREE.Box3().setFromObject(truss);
	var s = ((box3.max.x - box3.min.x) / 1000) * ((box3.max.y - box3.min.y) / 1000);
	var partName = "trussSide";
	if (typeof specObj != 'undefined') {
		name = par.len;
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				name: "Ферма боковая",
				metalPaint: false,
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

	}
	truss.specId = partName + name;

	var startFlan = drawTrussFlan(flanPar);
	startFlan.position.x = -30 - 20;
	startFlan.position.z = flanPar.thk / 2;
	par.mesh.add(startFlan);

	var endFlan = drawTrussFlan(flanPar);
	endFlan.position.x = par.len + 30 + 20;
	endFlan.rotation.y = Math.PI;
	endFlan.position.z = flanPar.thk + par.thk;
	par.mesh.add(endFlan);

	return par;
}


/** функция отрисовывает треугольную ферму из листа с отверстиями
	*@params: height,len,dxfBasePoint
	model: "сужающаяся", "постоянной ширины"
	holesModel: "вытянутые", "круги"
	
*/
function drawTriangleTruss(par){
	if(!par.dxfBasePoint) par.dxfBasePoint = {x:0, y:0};
	
	par.mesh = new THREE.Object3D();
	par.dxfArr = par.dxfPrimitivesArr || dxfPrimitivesArr;
	
	//параметры
	par.midHeight = 350; // высота фермы в середине
	par.endHeight = 100; // высота фермы на краю
	par.columnBase = 200;
	par.topAng = 20;
	par.flanThk = 8;
	
	if(par.len > 2500){
		par.midHeight = 500
		par.endHeight = 150;
	}
	
	//внешний контур
	var p0 = {x: 0, y: 0}
	
	//нижняя линия
	var botLine = {
		p1: newPoint_xy(p0, -par.columnBase / 2, 0),
		p2: newPoint_xy(p0, par.columnBase / 2, 0),
		p3: newPoint_xy(p0, par.columnBase / 2 + 20, 50), //точка перелома нижней линии
	}
	botLine.p1.filletRad = botLine.p2.filletRad = 20
	if(par.model == "постоянной ширины") botLine.p3 = botLine.p2
		
	//верхняя линия
	var topLine = {
		p1: newPoint_xy(botLine.p1, -50, par.endHeight),
	}
	topLine.p2 = polar(topLine.p1, par.topAng / 180 * Math.PI, 100); //временная точка
	
	//правая линия
	var rightLine = {
		p1: {x: par.len - par.flanThk, y: 0,}, //временная точка
		p2: {x: par.len - par.flanThk, y: 100,}, //временная точка
	}
	
	rightLine.p1 = itercectionLines(rightLine, topLine)
	rightLine.p2 = newPoint_xy(rightLine.p1, 0, -par.midHeight)
	
	if(par.model == "постоянной ширины"){
		rightLine.p2 = itercection(rightLine.p1, rightLine.p2, botLine.p2, polar(botLine.p2, par.topAng / 180 * Math.PI, 100))
	}
	

	
	var points = [botLine.p1, topLine.p1, rightLine.p1, rightLine.p2, botLine.p3, botLine.p2]
	if(par.model == "постоянной ширины"){
		points = [botLine.p1, topLine.p1, rightLine.p1, rightLine.p2, botLine.p2]
	}

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: par.dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		radOut: 0,
	}

	par.shape = drawShapeByPoints2(shapePar).shape;

	//большие отверстия
	var holeStep = 500;
	var sideWidth = 60;
	var bridgeWidth = 60;
	var holeCornerRad = 20
	
	var holeAmt = Math.floor(distance(topLine.p1, rightLine.p1) / holeStep)
	var holeStepX = par.len / holeAmt;


	//строим отверстия справа налево
	var holeLeftLine = rightLine;
	var holeBotLine = parallel(rightLine.p2, botLine.p3, bridgeWidth)
	var holeTopLine = parallel(topLine.p1, topLine.p2, -bridgeWidth)
	
	if(par.holesModel == "круги"){
		var maxHoleDiam = distance(rightLine.p1, rightLine.p2) - sideWidth * 2;
		holeAmt = Math.floor(par.len / (maxHoleDiam + bridgeWidth))
		holeStepX = par.len / holeAmt;
		if(par.model == "постоянной ширины"){
			holeStepX += bridgeWidth
			holeAmt -=1;
		}
		
	}

	par.progonAmt = Math.floor(distance(topLine.p1, rightLine.p1) / holeStep) + 2;

	for(var i=0; i<holeAmt; i++ ){
		var holeRightLine = parallel(holeLeftLine.p1, holeLeftLine.p2, bridgeWidth)
		holeLeftLine = parallel(holeLeftLine.p1, holeLeftLine.p2, (holeStepX - bridgeWidth))
		
		var ph1 = itercectionLines(holeLeftLine, holeBotLine) //левая нижняя
		var ph2 = itercectionLines(holeLeftLine, holeTopLine) //левая верхняя
		var ph3 = itercectionLines(holeRightLine, holeTopLine) //правая верхняя
		var ph4 = itercectionLines(holeRightLine, holeBotLine) //правая нижняя
		var holePoints = [ph1, ph2, ph3, ph4];
		
		//если для последнего отверстия меньшая высота меньше удвоенного радиуса, делаем треугольное отверстие
		if(par.model == "сужающаяся" && (ph2.y - ph1.y) < holeCornerRad * 2){
			ph1 = itercectionLines(holeTopLine, holeBotLine)
			holePoints = [ph1, ph3, ph4];
		}
		
		//создаем шейп отверстия
		var shapePar = {
			points: holePoints,
			dxfArr: par.dxfPrimitivesArr,
			dxfBasePoint: par.dxfBasePoint,
			radOut: holeCornerRad,
		}

		var holeShape = drawShapeByPoints2(shapePar).shape;
		
		if(par.holesModel == "круги"){
			var holeDiam = distance(ph3, ph4)
			var center = {
				x: (ph3.x + ph4.x) / 2,
				y: (ph3.y + ph4.y) / 2,
			}
			
			//корректируем позицию первого отверстия
			if(i==0 && rightLine.p1.x - center.x < bridgeWidth + holeDiam / 2) {
				holeRightLine = parallel(rightLine.p1, rightLine.p2, bridgeWidth + holeDiam / 2);
				holeLeftLine = parallel(holeRightLine.p1, holeRightLine.p2, (holeStepX - bridgeWidth * 2))
				
				ph3 = itercectionLines(holeRightLine, holeTopLine) //правая верхняя
				ph4 = itercectionLines(holeRightLine, holeBotLine) //правая нижняя
				holeDiam = distance(ph3, ph4)
				center = {
					x: (ph3.x + ph4.x) / 2,
					y: (ph3.y + ph4.y) / 2,
				}
			}

			addRoundHole(par.shape, par.dxfArr, center, holeDiam / 2, par.dxfBasePoint)
		}
		else{
			par.shape.holes.push(holeShape)
		}
		
	}
	
	//отверстия для болтов
	var holeOffset = 20;
	var holeRad = 6.5;

	var hole1YOffset = 70;
	if (par.len > 2500) hole1YOffset = 120;

	var betweenHolesYOffset = 40;
	
	var boltCenters = [];

	var rackBasePoint = newPoint_xy(p0, 0, 0);

	par.rackFlanHoles = [];
	
	var center = newPoint_xy(rackBasePoint, -par.rackSize / 2 - 30, holeOffset)
	boltCenters.push(center);
	par.rackFlanHoles.push(center);

	var center = newPoint_xy(center, 0, hole1YOffset)
	boltCenters.push(center);
	par.rackFlanHoles.push(center);
	
	var center = newPoint_xy(rackBasePoint, par.rackSize / 2 + 30 + 40, holeOffset + betweenHolesYOffset)
	boltCenters.push(center);
	par.rackFlanHoles.push(center);
	
	var center = newPoint_xy(center, 0, hole1YOffset)
	boltCenters.push(center);
	par.rackFlanHoles.push(center);
	
	boltCenters.forEach(function(center){
		addRoundHole(par.shape, dxfPrimitivesArr, center, holeRad, par.dxfBasePoint); 
	})
	
	var extrudeOptions = {
		amount: par.thk, 
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
	var stripeThk = par.stripeThk || 4;
	var stripeWidth = 60;

	var polePar = {
		poleProfileY: stripeThk,
		poleProfileZ: stripeWidth,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, topLine.p1.x, topLine.p1.y),
		length: distance(topLine.p1, rightLine.p1),
		poleAngle: angle(topLine.p1, rightLine.p1),
		material: params.materials.metal,
		dxfArr: [],
		type: 'rect',
		partName: 'carportRack'
	};

	var stripe = drawPole3D_4(polePar).mesh;
	stripe.position.x = topLine.p1.x
	stripe.position.y = topLine.p1.y
	stripe.position.z = -polePar.poleProfileZ / 2 + par.thk / 2;
	par.mesh.add(stripe);
	stripe.setLayer('carcas');
	
	//полоса снизу
	polePar.length = distance(botLine.p3, rightLine.p2);
	polePar.poleAngle = angle(botLine.p3, rightLine.p2);

	var basePoint = polar(botLine.p3, (polePar.poleAngle + Math.PI / 2), -polePar.poleProfileY)
	polePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, basePoint.x, basePoint.y);
	
	var stripe = drawPole3D_4(polePar).mesh;
	stripe.position.x = basePoint.x
	stripe.position.y = basePoint.y
	stripe.position.z = -polePar.poleProfileZ / 2 + par.thk / 2;
	par.mesh.add(stripe);
	stripe.setLayer('carcas');
	
	//соединительный фланец
	var flanHeight = distance(rightLine.p1, rightLine.p2)
	var flanPar = {
		height: flanHeight,
		width: stripeWidth,
		thk: par.flanThk,
		cornerRad: 0,
		holeRad: 7,
		noBolts: true,
		dxfPrimitivesArr: par.dxfPrimitivesArr,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, -300, 0),
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
	flan.position.x = rightLine.p2.x
	flan.position.y = rightLine.p2.y
	// flan.position.z = stripeWidth / 2;
	flan.position.z = stripeWidth / 2 + par.thk / 2;
	par.mesh.add(flan);
	flan.setLayer('carcas');

	par.centerY = rightLine.p1.y;
	par.centerYBot = rightLine.p2.y;
	
	var ang = angle(topLine.p1, rightLine.p1);
	par.basePoint = polar(rightLine.p1, ang + Math.PI / 2, stripeThk);
	par.basePoint = polar(par.basePoint, ang, par.flanThk / Math.cos(ang) + stripeThk * Math.tan(ang));
	// par.basePoint.x += par.flanThk;
	
	par.length = distance(polar(topLine.p1, angle(topLine.p1, rightLine.p1) + Math.PI / 2, stripeThk), par.basePoint);

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
				name: "Ферма поперечная",
				metalPaint: false,
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

	}
	truss.specId = partName + name;

	return par;
} //end of drawTriangleTruss



/** функция отрисовывает арочную ферму из листа с отверстиями
	*@params: len,dxfBasePoint
	model: "сужающаяся", "постоянной ширины"
	holesModel: "вытянутые", "круги"
*/
function drawArcTruss2(par){
	if(!par.dxfBasePoint) par.dxfBasePoint = {x:0, y:0};
	
	par.mesh = new THREE.Object3D();
	par.dxfArr = par.dxfPrimitivesArr || dxfPrimitivesArr;
	
	//параметры
	par.topRad = par.len * 2
	//параметры опорного узла
	par.a1 = 122 / 180 * Math.PI //угол вектора на центр внешней дуги и точку p1
	par.a2 = 110 / 180 * Math.PI //угол вектора на центр внутренней дуги
	par.a3 = 58 / 180 * Math.PI//угол на точку p4
	par.m1 = 110 //расстояние до точки p1
	par.m2 = 110 //расстояние до точки p4

	par.flanThk = 8;
	
	if(par.len > 2500){
		par.m1 = 150 //расстояние до точки p1
	}
	
	//внешний контур
	var p0 = {x: 0, y: 0}
	
	//нижняя линия
	
	if(par.model == "сужающаяся"){		
		var botLine = {
			p2: newPoint_xy(p0, -80, 0),
			p3: newPoint_xy(p0, 80, 0),
		}
		botLine.p1 = polar(botLine.p2, par.a1, par.m1)
		botLine.p4 = polar(botLine.p3, par.a3, par.m2)
	}
	
	if(par.model == "постоянной ширины"){
		var botLine = {
			p2: newPoint_xy(p0, -80, 0),
			p3: newPoint_xy(p0, 120, 0),
		}
		botLine.p1 = polar(botLine.p2, par.a1, par.m1)
	}
	
	//правая линия
	var rightLine = {
		p1: {x: par.len, y: 0,}, //временная точка
		p2: {x: par.len, y: 100,}, //временная точка
	}
	
	//верхняя дуга
	var topArc = {
		center: itercection(botLine.p1, botLine.p2, rightLine.p1, rightLine.p2),
		endAngle: Math.PI / 2,
		startAngle: par.a1,
	}
	topArc.rad = distance(botLine.p1, topArc.center);
	topArc.len = topArc.rad * (topArc.startAngle - topArc.endAngle)

	//нижняя дуга
	
	if(par.model == "сужающаяся"){
		var botArc = {
			center: itercection(botLine.p4, polar(botLine.p4, par.a2, 100), rightLine.p1, rightLine.p2),
			startAngle: par.a2,
			endAngle: Math.PI / 2,
		}
		botArc.rad = distance(botLine.p4, botArc.center);
	}
	
	if(par.model == "постоянной ширины"){
		var botArc = {
			center: copyPoint(topArc.center),
			startAngle: angle(topArc.center, botLine.p3) + Math.PI,
			endAngle: Math.PI / 2,			
		}
		botArc.rad = distance(botLine.p3, botArc.center);
	}

	//корректируем точки правой линии
	rightLine.p1 = newPoint_xy(topArc.center, 0, topArc.rad)
	rightLine.p2 = newPoint_xy(botArc.center, 0, botArc.rad)

	par.shape = new THREE.Shape();
	
	if(botLine.p4) addLine(par.shape, par.dxfArr, botLine.p4, botLine.p3, par.dxfBasePoint);
	addLine(par.shape, par.dxfArr, botLine.p3, botLine.p2, par.dxfBasePoint);
	addLine(par.shape, par.dxfArr, botLine.p2, botLine.p1, par.dxfBasePoint);	
	//верхняя дуга
	addArc2(par.shape, par.dxfArr, topArc.center, topArc.rad, topArc.startAngle, topArc.endAngle, true, par.dxfBasePoint)
	//правая линия
	addLine(par.shape, par.dxfArr, rightLine.p1, rightLine.p2, par.dxfBasePoint);
	//нижняя дуга
	addArc2(par.shape, par.dxfArr, botArc.center, botArc.rad, botArc.startAngle, botArc.endAngle, false, par.dxfBasePoint)

	

	//большие отверстия
	var holePar = {
		holeStep: 650, //максимальный шаг прогонов
		sideWidth: 60, //ширина верхнего и нижнего поясов
		bridgeWidth: 100, //ширина перемычки по верхней дуге
		topArc: topArc, //объект с параметрами верхней дуги фермы
		botArc: botArc, //объект с параметрами нижней дуги фермы		
		shape: par.shape,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,		
	}
	holePar.maxHoleDiam = distance(rightLine.p1, rightLine.p2) - holePar.sideWidth * 2; //макс. диаметр для круглых отверстий
	
	addTrussHoles(holePar);
	
	par.progonAmt = Math.ceil(topArc.len / holePar.holeStep)

	//отверстия для болтов
	var holeOffset = 20;
	var holeRad = 6.5;

	var hole1YOffset = 70;
	if (par.len > 2500) hole1YOffset = 120;

	var hole2YOffset = 100;
	if (par.len > 2500) hole2YOffset = 150;

	var betweenHolesYOffset = 65;
	
	var boltCenters = [];

	var rackBasePoint = newPoint_xy(p0, 0, 0);

	par.rackFlanHoles = [];
	
	var center = newPoint_xy(rackBasePoint, -par.rackSize / 2 - 30, holeOffset)
	boltCenters.push(center);
	par.rackFlanHoles.push(center);

	var center = newPoint_xy(center, 0, hole1YOffset)
	boltCenters.push(center);
	par.rackFlanHoles.push(center);
	
	var center = newPoint_xy(rackBasePoint, par.rackSize / 2 + 30 + 40, holeOffset + betweenHolesYOffset)
	boltCenters.push(center);
	par.rackFlanHoles.push(center);
	
	var center = newPoint_xy(center, 0, hole2YOffset)
	boltCenters.push(center);
	par.rackFlanHoles.push(center);

	// отверстия под соединительный фланец для ферм

	var connectionFlanPar = {
		a: 100 * 2,
		b: 100 * 2,
		h: (rightLine.p1.y - rightLine.p2.y) - 20,
		holes: []
	}

	par.connectionFlanHoles = [];

	var zeroPoint = {x:0,y:0};//Строим отверстия от 0 чтобы использовать во фланцах;

	var center = newPoint_xy(zeroPoint, -20, -40 + connectionFlanPar.h)
	connectionFlanPar.holes.push(center);

	var center = newPoint_xy(zeroPoint, -80, -40 + connectionFlanPar.h)
	connectionFlanPar.holes.push(center);

	var center = newPoint_xy(zeroPoint, -20, 40)
	connectionFlanPar.holes.push(center);

	var center = newPoint_xy(zeroPoint, -80, 40)
	connectionFlanPar.holes.push(center);

	connectionFlanPar.holes.forEach(function(hole){
		// Смещаем относительно конца фермы
		boltCenters.push(newPoint_xy(rightLine.p2, hole.x, hole.y));
	})
	
	par.connectionFlanPar = connectionFlanPar;

	boltCenters.forEach(function(center){
		addRoundHole(par.shape, dxfPrimitivesArr, center, holeRad, par.dxfBasePoint); 
	})
	
	var extrudeOptions = {
		amount: par.thk, 
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
	var stripeThk = par.stripeThk || 4;
	var stripeWidth = 60;
	var arcAngle = topArc.startAngle - topArc.endAngle;

	var polePar = {
		rad: topArc.rad + stripeThk / 2,
		height: stripeWidth,
		thk: stripeThk,
		angle: arcAngle,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
		material: params.materials.metal,
		layer: "carcas", //слой для выгрузки в dxf
		partName: 'trussLine',
		dxfPrimitivesArr: []
	}	

	var stripe = drawArcPanel(polePar).mesh;

	stripe.rotation.z = Math.PI / 2;
	stripe.position.z = -stripeWidth / 2 + par.thk / 2;
	stripe.position.x = par.len;
	stripe.position.y = -topArc.rad + rightLine.p1.y;
	stripe.setLayer('carcas');
	par.mesh.add(stripe);

	// Выводим переменные для использования дальше
	par.topRad = topArc.rad;
	par.centerY = rightLine.p1.y;
	par.centerYBot = rightLine.p2.y;
	par.arcLength = (topArc.rad * Math.PI * THREE.Math.radToDeg(arcAngle)) / 180;
	
	/*
	var stripeThk = 4;
	var stripeWidth = 60;

	var polePar = {
		poleProfileY: stripeThk,
		poleProfileZ: stripeWidth,
		dxfBasePoint: {x:0,y:0},
		length: distance(topLine.p1, rightLine.p1),
		poleAngle: angle(topLine.p1, rightLine.p1),
		material: params.materials.metal,
		dxfArr: dxfPrimitivesArr,
		type: 'rect',
		partName: 'carportRack'
	};

	var stripe = drawPole3D_4(polePar).mesh;
	stripe.position.x = topLine.p1.x
	stripe.position.y = topLine.p1.y
	stripe.position.z = -polePar.poleProfileZ / 2;
	par.mesh.add(stripe);
	stripe.setLayer('carcas');
	
	//полоса снизу
	polePar.length = distance(botLine.p3, rightLine.p2);
	polePar.poleAngle = angle(botLine.p3, rightLine.p2);

	var stripe = drawPole3D_4(polePar).mesh;
	var basePoint = polar(botLine.p3, (polePar.poleAngle + Math.PI / 2), -polePar.poleProfileY)
	stripe.position.x = basePoint.x
	stripe.position.y = basePoint.y
	stripe.position.z = -polePar.poleProfileZ / 2;
	par.mesh.add(stripe);
	stripe.setLayer('carcas');
	
	//соединительный фланец
	var flanPar = {
		height: par.midHeight,
		width: stripeWidth,
		thk: par.flanThk,
		cornerRad: 0,
		holeRad: 7,
		noBolts: true,
		roundHoleCenters: [
			{x: 15, y: 15},
			{x: 15, y: 45},
			{x: 15, y: par.midHeight - 15},
			{x: stripeWidth - 15, y: 15},
			{x: stripeWidth - 15, y: 45},
			{x: stripeWidth - 15, y: par.midHeight - 15},
		],
	}
	
	
	var flan = drawRectFlan2(flanPar).mesh;
	flan.rotation.y = Math.PI / 2;
	flan.position.x = rightLine.p2.x
	flan.position.y = rightLine.p2.y
	flan.position.z = stripeWidth / 2;
	par.mesh.add(flan);
	flan.setLayer('carcas');
*/	
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
				name: "Ферма поперечная",
				metalPaint: false,
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

	}
	truss.specId = partName + name;

	return par;
} //end of drawArcTruss2


/** функция отрисовывает крыло консольного навеса
	*@params: len,dxfBasePoint
	model: "сужающаяся", "постоянной ширины"
	holesModel: "вытянутые", "круги"
*/
function drawArcWing(par){
	console.log("drawArcWing")
	if(!par.dxfBasePoint) par.dxfBasePoint = {x:0, y:0};
	
	par.mesh = new THREE.Object3D();
	par.dxfArr = par.dxfPrimitivesArr || dxfPrimitivesArr;
	
	//параметры

	par.a1 = -66 / 180 * Math.PI //угол вектора на центр верхней дуги и точку p1
	par.endWidth = 150; //высота на краю без учета скругления
	par.deltaRad = 2000; //разница радиуса верхней и нижней дуги
	par.botWidth = 200; //ширина внизу по горизонтали
	par.filletRad = 500; //радиус скругления внутреннего угла
	
	if(par.model == "постоянной ширины"){
		par.endWidth = 200;
		par.deltaRad = par.endWidth;
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
	
	rightLine.p1 = itercectionLineCircle(rightLine.p1, rightLine.p2, topArc.center, topArc.rad)[0]
	rightLine.p2 = newPoint_xy(rightLine.p1, 0, -par.endWidth)
	
	topArc.endAngle = angle(topArc.center, rightLine.p1)
	topArc.len = topArc.rad * (topArc.startAngle - topArc.endAngle)
	
	
	//нижняя дуга
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
	
	console.log(filletParEnd)
	
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
	var holePar = {
		holeStep: 650, //максимальный шаг прогонов
		sideWidth: 60, //ширина верхнего и нижнего поясов
		bridgeWidth: 100, //ширина перемычки по верхней дуге
		topArc: topArc, //объект с параметрами верхней дуги фермы
		botArc: botArc, //объект с параметрами нижней дуги фермы		
		shape: par.shape,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,		
	}
	holePar.maxHoleDiam = distance(botLine.p3, botLine.p4) - holePar.sideWidth * 2; //макс. диаметр для круглых отверстий
	
	addTrussHoles(holePar);



	var extrudeOptions = {
		amount: par.thk, 
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	
	var geom = new THREE.ExtrudeGeometry(par.shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var truss = new THREE.Mesh(geom, params.materials.metal);
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
				name: "Ферма поперечная",
				metalPaint: false,
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

	}
	truss.specId = partName + name;
	
	// Выводим переменные для использования дальше
	par.topRad = topArc.rad;
	par.arcLength = topArc.rad * (topArc.startAngle - topArc.endAngle)
	par.progonAmt = Math.ceil(par.arcLength / holePar.holeStep)
	par.centerY = rightLine.p1.y;
	par.centerYBot = rightLine.p2.y;

	
	return par;
}

/** функция добавляет большие отверстия в радиусную ферму
*/

function addTrussHoles(par){
		
	var bridgeWidthAng = par.bridgeWidth / par.topArc.rad; //угловая ширина перемычки

	
	var holeAmt = Math.ceil(par.topArc.len / par.holeStep)
	var holeStepAng = (par.topArc.startAngle - par.topArc.endAngle) / holeAmt;
	
	
	if(params.trussHolesType == "круги"){
		var holeAmt = Math.ceil(par.topArc.len / (par.maxHoleDiam + par.bridgeWidth))
		var holeStepAng = (par.topArc.startAngle - par.topArc.endAngle) / holeAmt;
		holeAmt -= 2;
		bridgeWidthAng *= 2;
	}

	if(params.carportType == "консольный") holeAmt -= 1

	//строим отверстия справа налево
	
	for(var i=0; i<holeAmt; i++ ){

		//правая линия
		var rightLineAng = Math.PI / 2 + holeStepAng * i + bridgeWidthAng / 2;
		
		//левая линия
		var leftLineAng = Math.PI / 2 + holeStepAng * (i + 1) - bridgeWidthAng / 2;
		
		//уменьшаем первое и последнее отверстия		
		if(i == holeAmt-1 && params.carportType != "консольный") leftLineAng -= holeStepAng / 2;
		if(params.trussHolesType == "вытянутые" && i == 0) rightLineAng += bridgeWidthAng;
		
		//точки без учета скругления
		var ph2 = polar(par.topArc.center, leftLineAng, par.topArc.rad - par.sideWidth) //левая верхняя
		var ph3 = polar(par.topArc.center, rightLineAng, par.topArc.rad - par.sideWidth) //правая верхняя
		var ph4 = itercectionLineCircle(par.topArc.center, ph3, par.botArc.center, par.botArc.rad + par.sideWidth)[0] //правая нижняя
		var ph1 = itercectionLineCircle(par.topArc.center, ph2, par.botArc.center, par.botArc.rad + par.sideWidth)[0] //левая нижняя
		
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
			startAngle: angle(par.topArc.center, filletParLeft.point) + Math.PI,
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
			par.shape.holes.push(holeShape)
		}
		if(params.trussHolesType == "круги"){
			addRoundHole(par.shape, par.dxfArr, holeRightArc.center, holeRightArc.rad, par.dxfBasePoint)
		}
		
	}
}