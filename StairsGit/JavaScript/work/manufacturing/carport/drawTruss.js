
/** функция отрисовывает прямую ферму из листа с отверстиями
	*@params: height,len,dxfBasePoint
	colDist - расстояние между колоннами
*/
function drawStrightTruss(par){
	if(!par) par = {};
	if(!par.dxfBasePoint) par.dxfBasePoint = {x:0, y:0};
	if(!par.dxfArr) par.dxfArr = [];
	par.mesh = new THREE.Object3D();
	
	if(par.colDist){
		par.len = par.colDist + partPar.column.profSize.y - 8 - 100;
	}
	
	//внешний контур
	var p1 = {x: 0, y: 0}
	var p2 = {x: 0, y: par.height}
	var p3 = {x: par.len, y: par.height}
	var p4 = {x: par.len, y: 0}

	//создаем шейп
	var shapePar = {
		points: [p1,p2,p3,p4],
		dxfArr: par.dxfArr,
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
			dxfArr: par.dxfArr,
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
		addRoundHole(shape, par.dxfArr, center, holeRad, par.dxfBasePoint); 
	})
	
	var extrudeOptions = {
		amount: partPar.truss.thk, 
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
		
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var truss = new THREE.Mesh(geom, params.materials.metal);
	par.mesh.add(truss);
	truss.setLayer('carcas');

//фланцы крепления к колоннам

	var flanPar = {
		rackSize: partPar.column.profSize.y,
		height: par.height,
		thk: 8,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, -200, 0),
		dxfPrimitivesArr: par.dxfArr
	};

	var startFlan = drawTrussFlan(flanPar);
	startFlan.position.x = -30 - 20;
	startFlan.position.z = flanPar.thk / 2;
	par.mesh.add(startFlan);

	var endFlan = drawTrussFlan(flanPar);
	endFlan.position.x = par.len + 30 + 20;
	endFlan.rotation.y = Math.PI;
	endFlan.position.z = flanPar.thk + par.thk;
	par.mesh.add(endFlan);


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
	
	//параметры
	par.midHeight = partPar.truss.midHeight; // высота фермы в середине
	par.endHeight = partPar.truss.endHeight; 
	par.columnBase = 200;
	par.topAng = params.roofAng;
	par.flanThk = 8;
	

	//внешний контур
	var p0 = {x: 0, y: 0}
	
	//нижняя линия
	var botLine = {
		p1: newPoint_xy(p0, -par.columnBase / 2, 0),
		p2: newPoint_xy(p0, par.columnBase / 2, 0),
		p3: newPoint_xy(p0, par.columnBase / 2 + 20, 50), //точка перелома нижней линии
	}
	botLine.p1.filletRad = botLine.p2.filletRad = 20
	if(params.beamModel == "постоянной ширины") botLine.p3 = botLine.p2
		
	//верхняя линия
	var topLine = {
		p1: newPoint_xy(botLine.p1, -50, par.endHeight),
	}
	topLine.p2 = polar(topLine.p1, par.topAng / 180 * Math.PI, 100); //временная точка
	
	//правая линия
	var rightLine = {
		p1: {x: topLine.p1.x + par.len- par.flanThk, y: 0,}, //временная точка
	}
	rightLine.p2 = newPoint_xy(rightLine.p1, 0, 100) //временная точка
	
	rightLine.p1 = itercectionLines(rightLine, topLine)
	rightLine.p2 = newPoint_xy(rightLine.p1, 0, -par.midHeight)
	
	if(params.beamModel == "постоянной ширины"){
		rightLine.p2 = itercection(rightLine.p1, rightLine.p2, botLine.p2, polar(botLine.p2, par.topAng / 180 * Math.PI, 100))
	}
	
	//делаем ферму цельной если длина меньше 4000мм
	par.hasDivide = true;

	
	var points = [botLine.p1, topLine.p1, rightLine.p1, rightLine.p2, botLine.p3, botLine.p2]
	if(params.beamModel == "постоянной ширины"){
		points = [botLine.p1, topLine.p1, rightLine.p1, rightLine.p2, botLine.p2]
	}


	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: par.dxfArr,
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
	
	if(params.trussHolesType == "круги"){
		var maxHoleDiam = distance(rightLine.p1, rightLine.p2) - sideWidth * 2;
		holeAmt = Math.floor(par.len / (maxHoleDiam + bridgeWidth))
		holeStepX = par.len / holeAmt;
		if(params.beamModel == "постоянной ширины"){
			holeStepX += bridgeWidth
			holeAmt -=1;
		}
		
	}

	par.progonAmt = Math.floor(distance(topLine.p1, rightLine.p1) / params.progonMaxStep) + 2;
	

	for(var i=0; i<holeAmt; i++ ){
		var holeRightLine = parallel(holeLeftLine.p1, holeLeftLine.p2, bridgeWidth)
		holeLeftLine = parallel(holeLeftLine.p1, holeLeftLine.p2, (holeStepX - bridgeWidth))
		
		var ph1 = itercectionLines(holeLeftLine, holeBotLine) //левая нижняя
		var ph2 = itercectionLines(holeLeftLine, holeTopLine) //левая верхняя
		var ph3 = itercectionLines(holeRightLine, holeTopLine) //правая верхняя
		var ph4 = itercectionLines(holeRightLine, holeBotLine) //правая нижняя
		var holePoints = [ph1, ph2, ph3, ph4];
		
		//если для последнего отверстия меньшая высота меньше удвоенного радиуса, делаем треугольное отверстие
		if(params.beamModel == "сужающаяся" && (ph2.y - ph1.y) < holeCornerRad * 2){
			ph1 = itercectionLines(holeTopLine, holeBotLine)
			holePoints = [ph1, ph3, ph4];
		}
		
		//создаем шейп отверстия
		var shapePar = {
			points: holePoints,
			dxfArr: par.dxfArr,
			dxfBasePoint: par.dxfBasePoint,
			radOut: holeCornerRad,
		}

		var holeShape = drawShapeByPoints2(shapePar).shape;
		
		if(params.trussHolesType == "круги"){
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
	
	var center = newPoint_xy(rackBasePoint, -partPar.column.profSize.y / 2 - 30, holeOffset)
	boltCenters.push(center);
	par.rackFlanHoles.push(center);

	var center = newPoint_xy(center, 0, hole1YOffset)
	boltCenters.push(center);
	par.rackFlanHoles.push(center);
	
	var center = newPoint_xy(rackBasePoint, partPar.column.profSize.y / 2 + 30 + 40, holeOffset + betweenHolesYOffset)
	boltCenters.push(center);
	par.rackFlanHoles.push(center);
	
	var center = newPoint_xy(center, 0, hole1YOffset)
	boltCenters.push(center);
	par.rackFlanHoles.push(center);
	
	boltCenters.forEach(function(center){
		addRoundHole(par.shape, par.dxfArr, center, holeRad, par.dxfBasePoint); 
	})
	
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
		partName: 'trussLine'
	};

	var stripe = drawPole3D_4(stripeParTop).mesh;
	stripe.position.x = topLine.p1.x
	stripe.position.y = topLine.p1.y
	stripe.position.z = -stripeParTop.poleProfileZ / 2 + partPar.truss.thk / 2;
	par.mesh.add(stripe);
	stripe.setLayer('carcas');
	
	//полоса снизу
	var stripeParBot = {
		poleProfileY: partPar.truss.stripeThk,
		poleProfileZ: stripeWidth,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, topLine.p1.x, topLine.p1.y),
		length: distance(botLine.p3, rightLine.p2),
		poleAngle: angle(botLine.p3, rightLine.p2),
		material: params.materials.metal,
		dxfArr: [],
		type: 'rect',
		partName: 'trussLine'
	};

	var basePoint = polar(botLine.p3, (stripeParBot.poleAngle + Math.PI / 2), -stripeParBot.poleProfileY)
	stripeParBot.dxfBasePoint = newPoint_xy(par.dxfBasePoint, basePoint.x, basePoint.y);
	
	var stripe = drawPole3D_4(stripeParBot).mesh;
	stripe.position.x = basePoint.x
	stripe.position.y = basePoint.y
	stripe.position.z = -stripeParBot.poleProfileZ / 2 + partPar.truss.thk / 2;
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
	flan.position.z = stripeWidth / 2 + partPar.truss.thk / 2;
	par.mesh.add(flan);
	flan.setLayer('carcas');
	
		//вторая половинка
	if(params.carportType == "двухскатный"){
		var truss2 = new THREE.Mesh(geom, params.materials.metal);
		truss2.rotation.y = Math.PI;
		truss2.position.x = rightLine.p1.x * 2;
		//truss2.position.z = partPar.truss.thk;
		par.mesh.add(truss2);
		truss2.setLayer('carcas');
		
		//полоса сверху
		var stripe = drawPole3D_4(stripeParTop).mesh;			
		stripe.rotation.y = Math.PI;
		stripe.position.x = -topLine.p1.x + rightLine.p1.x * 2
		stripe.position.y = topLine.p1.y
		stripe.position.z = stripeParTop.poleProfileZ / 2 + partPar.truss.thk / 2;

		stripe.setLayer('carcas');
		par.mesh.add(stripe);

		//полоса снизу
		var stripe = drawPole3D_4(stripeParBot).mesh;
		stripe.rotation.y = Math.PI;
		stripe.position.x = -basePoint.x + rightLine.p1.x * 2
		stripe.position.y = basePoint.y
		stripe.position.z = stripeParBot.poleProfileZ / 2 + partPar.truss.thk / 2;
		par.mesh.add(stripe);
		stripe.setLayer('carcas');

	}

	par.centerY = rightLine.p1.y;
	par.centerYBot = rightLine.p2.y;
	
	par.basePoint = copyPoint(topLine.p1)
	
	//расчет площади одной половинки
	var height_l = topLine.p1.y;
	var height_r = distance(rightLine.p1, rightLine.p2);
	if(params.beamModel == "постоянной ширины") height_l = height_r;
	var area = (height_l + height_r) / 2 * distance(topLine.p1, rightLine.p1) / 1000000;

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
		specObj[partName]["area"] += area;
		if(params.carportType == "двухскатный"){
			specObj[partName]["amt"] += 1;
			specObj[partName]["area"] += area;
		}
		truss.specParams = {specObj: specObj, amt: 1, area: area, partName: partName, name: name}
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
	if(rightLine.p1.x - botLine.p1.x <= 2000){
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
	addLine(par.shape, par.dxfArr, botLine.p2, botLine.p1, par.dxfBasePoint);	
	//верхняя дуга
	addArc2(par.shape, par.dxfArr, topArc.center, topArc.rad, topArc.startAngle, topArc.endAngle, true, par.dxfBasePoint)
	
	if(par.hasDivide){
		//правая линия
		addLine(par.shape, par.dxfArr, rightLine.p1, rightLine.p2, par.dxfBasePoint);
	}
	
	if(!par.hasDivide){
		addLine(par.shape, par.dxfArr, botLine2.p1, botLine2.p2, par.dxfBasePoint);
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
	par.progonAmt = Math.ceil(topArc.len / params.progonMaxStep);	
	if(!par.hasDivide) par.progonAmt *= 0.5; //кол-во прогонов на половину фермы
	
	var holePar = {
		sideWidth: 70, //ширина верхнего и нижнего поясов
		bridgeWidth: 100, //ширина перемычки по верхней дуге
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
	
	var center = newPoint_xy(rackBasePoint, -60, holeOffset)
	boltCenters.push(center);
	par.rackFlanHoles.push(center);

	var center = newPoint_xy(center, 0, hole1YOffset)
	boltCenters.push(center);
	par.rackFlanHoles.push(center);
	
	var center = newPoint_xy(rackBasePoint, 100, holeOffset + betweenHolesYOffset)
	boltCenters.push(center);
	par.rackFlanHoles.push(center);
	
	var center = newPoint_xy(center, 0, hole2YOffset)
	boltCenters.push(center);
	par.rackFlanHoles.push(center);
	
	// отверстия под соединительный фланец для ферм

	if(par.hasDivide){
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

		connectionFlanPar.holes.forEach(function(hole){
			// Смещаем относительно конца фермы
			boltCenters.push(newPoint_xy(rightLine.p2, hole.x, hole.y));
		})
		
		par.connectionFlanPar = connectionFlanPar;
	}	
	
	boltCenters.forEach(function(center){
		addRoundHole(par.shape, dxfPrimitivesArr, center, holeRad, par.dxfBasePoint); 
	})
	
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
	var stripeWidth = 60;
	var arcAngle = topArc.startAngle - topArc.endAngle;

	var stripePar = {
		rad: topArc.rad + partPar.truss.stripeThk / 2,
		height: stripeWidth,
		thk: partPar.truss.stripeThk,
		angle: arcAngle,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
		material: params.materials.metal,
		layer: "carcas", //слой для выгрузки в dxf
		partName: 'trussLine',
		dxfPrimitivesArr: []
	}	

	var stripe = drawArcPanel(stripePar).mesh;

	stripe.rotation.z = Math.PI / 2;
	if(!par.hasDivide) stripe.rotation.z = topArc.endAngle;
	stripe.position.z = -stripeWidth / 2 + partPar.truss.stripeThk / 2;
	stripe.position.x = topArc.center.x;
	stripe.position.y = -topArc.rad + rightLine.p1.y;
	stripe.setLayer('carcas');
	par.mesh.add(stripe);
	
	//левый фланец крепления к колонне
	
	var flanParams = {
		dxfBasePoint: par.dxfBasePoint,
		dxfPrimitivesArr: par.dxfArr,
		thk: 8,
		rackSize: partPar.column.profSize.y,
		isLarge: params.width > 5000,
		holes: par.rackFlanHoles,
		//flanTopAngle: par.a1,
	};
	
	var rackFlan = drawRackFlan(flanParams);
	rackFlan.position.z = -flanParams.thk;
	par.mesh.add(rackFlan);
	
	//правый фланец
	if(params.carportType == "двухскатный"){
		var rackFlan = drawRackFlan(flanParams);
		rackFlan.rotation.y = Math.PI
		rackFlan.position.x = topArc.center.x * 2
		if(params.carportType == "односкатный") rackFlan.position.x = topArc.center.x
		par.mesh.add(rackFlan);
	}
	
	//соединительный фланец
	if(par.hasDivide && params.carportType == "двухскатный"){

		par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, 400);
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
	

			

	// Выводим переменные для использования дальше
	par.topRad = topArc.rad;
	par.centerY = rightLine.p1.y;
	par.centerYBot = rightLine.p2.y;
	par.arcLength = topArc.rad * arcAngle;	
	par.topArc = topArc;
	par.topArc.rad += partPar.truss.stripeThk;
	
	//для двухскатных навесов далее используем полную верхнюю дугу
	if (params.carportType == 'двухскатный') {
		par.topArc.endAngle = Math.PI - topArc.startAngle;
		par.progonAmt *= 2;
	}
	
	var area = par.arcLength * distance(rightLine.p1, rightLine.p2) / 1000000; //упрощенная формула с учетом обрезков

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
		specObj[partName]["area"] += area;
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
		sideWidth: 60, //ширина верхнего и нижнего поясов
		bridgeWidth: 100, //ширина перемычки по верхней дуге
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
	par.mesh.add(truss);
	truss.setLayer('carcas');
	
	//вторая пластина
	var truss = new THREE.Mesh(geom, params.materials.metal);
	truss.position.z = partPar.column.profSize.y + partPar.truss.thk;
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
	
	var hidenHolesAmt = 1; //не отрисовываем крайние отверстия
	
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
	
	for(var i=0; i<holeAmt; i++ ){

		//правая линия
		var rightLineAng = startAngle + holeStepAng * i + bridgeWidthAng / 2;
		
		//левая линия
		var leftLineAng = startAngle + holeStepAng * (i + 1) - bridgeWidthAng / 2;
		
		//уменьшаем первое отверстие
		if(params.trussHolesType == "вытянутые" && i == 0){
			if(par.isHalf) rightLineAng += bridgeWidthAng * 0.2;
			//if(!par.isHalf) rightLineAng += holeStepAng / 2;
		}
		/*
		//уменьшаем крайнее отверстие		
		if(i == holeAmt-1 && params.carportType != "консольный" && params.carportType != "консольный двойной") leftLineAng -= holeStepAng / 2;
		*/
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
	m1 - расстояние от точки botLine.p2 до botLine.p1
*/
function calcRoofArcParams(par){
	
	//параметры опорного узла
	par.a3 = 58 / 180 * Math.PI//угол на точку p4
	par.m2 = 110 //расстояние до точки p4
	
	//нижняя линия
	var p0 = {x: 0, y: 0}
	par.botLine = {
		p2: newPoint_xy(p0, -par.sideOffset, 0),
	} 
	par.botLine.p1 = polar(par.botLine.p2, par.a1, par.m1)

	//вспомогательная линия через центр дуги
	var centerPosX = par.botLine.p1.x + params.width / 2;
	
	if(params.carportType == "односкатный" || params.carportType.indexOf("консольный") != -1) centerPosX += params.width / 2;
	if(params.carportType == "сдвижной") centerPosX = par.botLine.p1.x + par.width / 2;
	
	par.centerLine = {
		p1: {x: centerPosX, y: 0,}, //временная точка
		p2: {x: centerPosX, y: -100,}, //временная точка
	}
	
	//верхняя линия балки
	par.topArc = {
		center: itercection(par.botLine.p1, par.botLine.p2, par.centerLine.p1, par.centerLine.p2),
		startAngle: par.a1,
		endAngle: Math.PI - par.a1,			
	}
	par.topArc.rad = distance(par.botLine.p1, par.topArc.center);	

	//корректируем точки центральной линии
	par.centerLine.p1 = newPoint_xy(par.topArc.center, 0, par.topArc.rad)
	par.centerLine.p2 = newPoint_xy(par.centerLine.p1, 0, -par.trussWidth)
	
	//нижняя линия
	
	//точка на внутреннем краю колонны
	par.botLine.p3 = newPoint_xy(par.botLine.p1, params.sideOffset + par.columnProf.y, -par.botLine.p1.y);
	
	if(params.beamModel == "сужающаяся"){
	
		if(params.trussBotLedge){
			par.botLine.p31 = newPoint_xy(par.botLine.p3, 0, -params.trussBotLedge);
			par.botLine.p32 = newPoint_xy(par.botLine.p31, 50, 0);
		}
		else{
			par.botLine.p3 = newPoint_xy(p0, par.sideOffset, 0);
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
			rad: par.topArc.rad - par.trussWidth,			
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
	
	if(params.carportType == "односкатный" || params.carportType.indexOf("консольный") != -1){
		par.topArc.endAngle = Math.PI / 2;
	}
	
	return par;
		
} //end of calcRoofArcParams

function drawArcTubeTruss(par){
	if(!par) par = {};
	if(!par.dxfBasePoint) par.dxfBasePoint = {x: 0, y: 0};
	if(!par.len) par.len = params.width;
	par.mesh = new THREE.Object3D();
	
	var beamProfParams = getProfParams(params.beamProf)
	
	//нижний пояс

	var polePar = {
		poleProfileY: beamProfParams.sizeA,
		poleProfileZ: beamProfParams.sizeB,
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
		rad: arcPar.topArc.rad - beamProfParams.sizeA / 2,
	}

	var arcPanelPar = {
		rad: midArc.rad,
		height: beamProfParams.sizeB,
		thk: beamProfParams.sizeA,
		angle: midArc.startAngle - midArc.endAngle,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
		material: params.materials.metal,
		partName: 'carportBeam',
		dxfPrimitivesArr: []
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
		poleProfileY: 20,
		poleProfileZ: 20,
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
	console.log(par.progonAmt)
	return par;
	
}

function drawTriangleTubeTruss(par) {
	if (!par) par = {};
	if (!par.dxfBasePoint) par.dxfBasePoint = { x: 0, y: 0 };
	if (!par.len) par.len = params.width;
	par.mesh = new THREE.Object3D();
	var mesh = new THREE.Object3D();

	var beamProfParams = getProfParams(params.beamProf)

	//нижний пояс

	var polePar = {
		poleProfileY: beamProfParams.sizeA,
		poleProfileZ: beamProfParams.sizeB,
		dxfBasePoint: par.dxfBasePoint,
		length: par.len,
		poleAngle: 0,
		material: params.materials.metal,
		dxfArr: [],
		type: 'rect',
		partName: 'carportBeam',
	};
	polePar.length = par.len / Math.cos(partPar.main.roofAng)

	var extrudeOptions = {
		amount: beamProfParams.sizeB,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var ang = partPar.main.roofAng;
	var p0 = { x: 0, y: 0 };

	var sideOffset = params.sideOffset;
	var profBinding = 20;

	// вспомогательные прямые
	var pt1Bot = newPoint_x(p0, -params.width / 2, 0);
	var pt2Bot = newPoint_x(pt1Bot, sideOffset, 0);
	var pt3Bot = newPoint_x(pt2Bot, partPar.column.profSize.x, 0);
	var pt4Bot = newPoint_x(pt3Bot, profBinding, 0);
	var line1Bot = { p1: pt1Bot, p2: polar(pt1Bot, Math.PI / 2, 100)}
	var line2Bot = { p1: pt2Bot, p2: polar(pt2Bot, Math.PI / 2, 100)}
	var line3Bot = { p1: pt3Bot, p2: polar(pt3Bot, Math.PI / 2, 100)}
	var line4Bot = { p1: pt4Bot, p2: polar(pt4Bot, Math.PI / 2, 100)}

	var pt1Top = newPoint_x(p0, params.width / 2, 0);
	var pt2Top = newPoint_x(pt1Top, -sideOffset, 0);
	var pt3Top = newPoint_x(pt2Top, -partPar.column.profSize.x, 0);
	var pt4Top = newPoint_x(pt3Top, -profBinding, 0);
	var line1Top = { p1: pt1Top, p2: polar(pt1Top, Math.PI / 2, 100) }
	var line2Top = { p1: pt2Top, p2: polar(pt2Top, Math.PI / 2, 100) }
	var line3Top = { p1: pt3Top, p2: polar(pt3Top, Math.PI / 2, 100) }
	var line4Top = { p1: pt4Top, p2: polar(pt4Top, Math.PI / 2, 100) }

	//верхний пояс

	var line1 = {p1: copyPoint(p0), p2: polar(p0, ang, 100)}
	var line2 = parallel(line1.p1, line1.p2, beamProfParams.sizeA)

	var pt = itercectionLines(line1, line2Bot)
	var dy = -pt.y;

	var p2 = itercectionLines(line2, line1Bot)
	var p4 = itercectionLines(line1, line1Top)
	var p1 = itercection(line1.p1, line1.p2, p2, polar(p2, Math.PI / 2 + ang, 100))
	var p3 = itercection(line2.p1, line2.p2, p4, polar(p4, Math.PI / 2 + ang, 100))

	var points = [p1, p2, p3, p4];

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		radOut: 0, //радиус скругления внешних углов
	}

	var shape = drawShapeByPoints2(shapePar).shape;
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var beam = new THREE.Mesh(geom, params.materials.metal);
	mesh.add(beam)

	//нижний пояс
	var pt0 = newPoint_xy(p0, 0, -partPar.truss.width + beamProfParams.sizeA);

	var line3 = { p1: copyPoint(pt0), p2: polar(pt0, ang, 100) }
	var line4 = parallel(line3.p1, line3.p2, beamProfParams.sizeA)

	var p1 = itercectionLines(line3, line4Bot);
	var p2 = itercectionLines(line4, line4Bot);
	var p3 = itercectionLines(line4, line4Top);
	var p4 = itercectionLines(line3, line4Top);

	var points = [p1, p2, p3, p4];

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		radOut: 0, //радиус скругления внешних углов
	}

	var shape = drawShapeByPoints2(shapePar).shape;
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var beam = new THREE.Mesh(geom, params.materials.metal);
	mesh.add(beam)


	//крепление

	var p1 = itercectionLines(line1, line3Bot);
	var p2 = itercectionLines(line1, line4Bot);
	var p3 = newPoint_xy(p1, profBinding, -500)
	var p4 = newPoint_xy(p1, 0, -500)

	var points = [p1, p2, p3, p4];

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		radOut: 0, //радиус скругления внешних углов
	}

	var shape = drawShapeByPoints2(shapePar).shape;
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var beam = new THREE.Mesh(geom, params.materials.metal);
	mesh.add(beam)










	//plate.position.x = -plateDist / 2;
	//plate.position.y = cons.position.y + maxHeight + 0.01;
	//plate.position.z = -50;
	//flanFix.add(plate);

	//var beam = drawPole3D_4(polePar).mesh;
	//beam.position.x = -polePar.length / 2
	//beam.position.y = -partPar.truss.width + beamProfParams.sizeA
	//mesh.add(beam)

	////верхний пояс

	//var beam = drawPole3D_4(polePar).mesh;
	//beam.position.x = -polePar.length / 2
	//mesh.add(beam)

	//mesh.rotation.z = partPar.main.roofAng
	//mesh.position.y = (params.width / 2 - 100) * Math.tan(partPar.main.roofAng)
	mesh.position.y = dy
	par.mesh.add(mesh)


	if (false) {
		//раскосы
		var bracePar = {
			poleProfileY: 20,
			poleProfileZ: 20,
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
		var center = { x: 0, y: midArc.center.y }

		var botLine = {
			p1: { x: 0, y: polePar.poleProfileY / 2 },
			p2: { x: 100, y: polePar.poleProfileY / 2 },
		}
		for (var sideFactor = 1; sideFactor >= -1; sideFactor -= 2) {
			var lastPoint = newPoint_xy(center, 0, midArc.rad); //верхняя точка
			if (params.carportType == "односкатный") {
				lastPoint.x = par.len / 2
				center.x = par.len / 2
			}
			for (var i = 0; i < 10; i++) {

				var ang1 = Math.PI / 2 - braceAng * sideFactor;
				var p1 = polar(lastPoint, ang1, 100) //временная точка
				p1 = itercection(botLine.p1, botLine.p2, lastPoint, p1)

				bracePar.poleAngle = ang1 + Math.PI;
				bracePar.length = distance(lastPoint, p1);
				if (bracePar.length < 250) break

				var brace = drawPole3D_4(bracePar).mesh;
				brace.position.x = lastPoint.x
				brace.position.y = lastPoint.y
				par.mesh.add(brace)


				var ang2 = Math.PI / 2 + braceAng * sideFactor
				var p2 = polar(p1, ang2, 500) //временная точка
				p2 = itercectionLineCircle(p1, p2, center, midArc.rad)[0]

				bracePar.poleAngle = ang2 + Math.PI;
				bracePar.length = distance(p1, p2);
				if (bracePar.length < 250) break

				var brace = drawPole3D_4(bracePar).mesh;
				brace.position.x = p2.x
				brace.position.y = p2.y
				par.mesh.add(brace)

				lastPoint = copyPoint(p2)
			}
			if (params.carportType == "односкатный") break;
		}

		par.topArc.len = par.topArc.rad * (par.topArc.startAngle - par.topArc.endAngle)
		par.progonAmt = Math.ceil(par.topArc.len / params.progonMaxStep)
		console.log(par.progonAmt)
	}
	return par;

}