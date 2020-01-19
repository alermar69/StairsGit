// Вывод каркаса всей лестницы
function drawCarcasStock(par) {

	par.mesh = new THREE.Object3D();
	par.angles = new THREE.Object3D();

	par.stringerParams = [];

	// Каркас марша

	par.stringerParams[1] = drawMarshStringerStock(par, 1);
	par.mesh.add(par.stringerParams[1].mesh);
	par.angles.add(par.stringerParams[1].angles);


	//Каркас верхней площадки
	if (params.platformTop !== 'нет') {
		par.stringerParams["topPlt"] = drawTopPlatformStringersStock(par);

		var stringersTop = par.stringerParams["topPlt"].mesh;
		stringersTop.position.x = par.treadsObj.lastMarshEnd.x;
		stringersTop.position.y = par.treadsObj.lastMarshEnd.y;
		stringersTop.position.z = par.treadsObj.lastMarshEnd.z;
		par.mesh.add(stringersTop);
	}

	//добор верхней площадки
	if (params.pltExtenderSide && params.pltExtenderSide != "нет") {
		var marshId = 1;
		var marshParams = getMarshParams(marshId);

		var extenderParams = {
			width: params.pltExtenderWidth,
			length: params.platformLength_3,
			material: params.materials.metal,
			coverMaterial: params.materials.metal2,
			coverThk: 6,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: { x: 0, y: 0 },
		};

		//если есть ограждение на последнем марше, уменьшаем длину добора
		var isOffsetLen = false;
		if (params.pltExtenderSide == "слева" && marshParams.hasRailing.in) isOffsetLen = true;
		if (params.pltExtenderSide == "справа" && marshParams.hasRailing.out) isOffsetLen = true;
		if (isOffsetLen) extenderParams.length -= marshParams.b / 2 + 40 / 2 + 5; //40 - ширина стойки

		extenderParams = drawExtender(extenderParams);
		var extender = extenderParams.mesh;
		extender.position.x = par.treadsObj.lastMarshEnd.x - extenderParams.length;
		extender.position.y = par.treadsObj.lastMarshEnd.y;

		extender.position.z = 0;
		if (params.pltExtenderSide == "справа") extender.position.z = params.M / 2 + params.pltExtenderWidth;
		if (params.pltExtenderSide == "слева") extender.position.z = -params.M / 2;
	
		par.mesh.add(extender);
	};

	//верхние фланцы
	if (params.topFlan == "есть") {
		var flansPar = {
			dxfBasePoint: par.dxfBasePoint,
		}
		var flansGroup = drawTopFixFlans(flansPar).mesh;
		flansGroup.rotation.y = par.treadsObj.lastMarshEnd.rot + Math.PI / 2;
		flansGroup.position.x = par.treadsObj.lastMarshEnd.x - 5;
		flansGroup.position.y = par.treadsObj.lastMarshEnd.y;
		flansGroup.position.z = par.treadsObj.lastMarshEnd.z;
		par.angles.add(flansGroup);

	}

	return par;
} //end of drawCarcasStock

// Вывод каркаса одного марша
function drawMarshStringerStock(par, marshId) {

	var mesh = new THREE.Object3D();
	var angles = new THREE.Object3D();

	stringerParams = {
		marshId: marshId,
		dxfBasePoint: par.dxfBasePoint,
		treadsObj: par.treadsObj,
	};
	calcStringerParams(stringerParams);

	//позиция косоуров по Z
	var posZOut = (params.M / 2 - stringerParams.stringerSideOffset) * turnFactor;
	if (turnFactor == 1) posZOut -= params.stringerThickness;

	var posZIn = - (params.M / 2 - stringerParams.stringerSideOffset) * turnFactor;
	if (turnFactor == -1) posZIn -= params.stringerThickness - 0.01

	var sideOut = "right";
	var sideIn = "left";
	if (turnFactor == -1) {
		sideIn = "left";
		sideOut = "right";
	}


	//внутренний косоур/тетива-----------------------------------------------------------------
	stringerParams.key = "in";
	stringerParams.isMiddleStringer = false;
	var stringer1 = drawStringerStock(stringerParams).mesh;
	stringer1.position.x = -stringerParams.treadFrontOverHang;
	stringer1.position.z = posZIn;
	mesh.add(stringer1);

	//уголки на внутренней тетиве
	var anglesIn = drawCarcasAngles(stringerParams.carcasHoles, sideIn);
	anglesIn.position.x = stringer1.position.x;
	anglesIn.position.z = stringer1.position.z;
	if (sideIn == "left") anglesIn.position.z += params.stringerThickness;
	angles.add(anglesIn);


	// Соединительные фланцы на внутренней тетиве	
	var franPar = {
		carcasHoles: stringerParams.carcasHoles,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 100, 0),
		marshAng: stringerParams.marshAng,
		side: sideIn,
	}

	// Отрисовка фланцев 
	var flans = drawStringerFlans_all(franPar);
	flans.position.x = -5;
	flans.position.z = (params.M / 2 - stringerParams.stringerSideOffset - params.stringerThickness * 2)
	mesh.add(flans);



	//внешний косоур/тетива---------------------------------------------------------------------
	par.dxfBasePoint.x += stringerParams.lenX;
	stringerParams.dxfBasePoint = par.dxfBasePoint;
	stringerParams.key = "out";
	stringerParams.isMiddleStringer = false;
	var stringer2 = drawStringerStock(stringerParams).mesh;
	stringer2.position.x = -stringerParams.treadFrontOverHang;
	stringer2.position.z = posZOut;
	mesh.add(stringer2);

	//уголки на внешней тетиве
	var anglesOut = drawCarcasAngles(stringerParams.carcasHoles, sideOut);
	anglesOut.position.x = -stringerParams.treadFrontOverHang
	anglesOut.position.z = stringer2.position.z;
	if (sideOut == "left") anglesOut.position.z += params.stringerThickness;
	angles.add(anglesOut);


	// Соединительные фланцы на внешней тетиве

	var franPar = {
		carcasHoles: stringerParams.carcasHoles,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 100, 0),
		marshAng: stringerParams.marshAng,
		side: sideOut,

	}

	// Отрисовка фланцев 
	var flans = drawStringerFlans_all(franPar);
	flans.position.x = -5;
	flans.position.z = -(params.M / 2 - stringerParams.stringerSideOffset - params.stringerThickness)
	mesh.add(flans);

	par.dxfBasePoint.x += stringerParams.lenX;
	
	var framesAmt = [];
	for (var i = 0; i < params.frameAmt_600; i++) {
		framesAmt.push(600);
	}
	for (var i = 0; i < params.frameAmt_800; i++) {
		framesAmt.push(800);
	}
	for (var i = 0; i < params.frameAmt_1000; i++) {
		framesAmt.push(1000);
	}

	//рамки ступеней
	var dxfBasePointFrame = {x: 0, y: -1000}
	var framePar = {
		length: framesAmt[0],
		holes: stringerParams.carcasHoles,
		dxfBasePoint: dxfBasePointFrame,
	}
	var frames = drawFramesStock(framePar);
	frames.position.x = -stringerParams.treadFrontOverHang;
	frames.position.z = stringer2.position.z;
	if (turnFactor == -1) frames.position.z = stringer1.position.z;
	angles.add(frames)


	// промежуточные косоуры широкого марша------------------------------------------------------
	var posZMiddle = posZIn;
	if (turnFactor == -1) posZMiddle = posZOut;
	for (var i = 1; i < framesAmt.length; i++) {
		posZMiddle += framesAmt[i] + params.stringerThickness;
		stringerParams.key = "in";
		stringerParams.isMiddleStringer = true;
		var stringerMiddle = drawStringerStock(stringerParams).mesh;
		stringerMiddle.position.x = -stringerParams.treadFrontOverHang;
		stringerMiddle.position.z = posZMiddle;
		mesh.add(stringerMiddle);

		//уголки на внутренней тетиве
		var anglesIn = drawCarcasAngles(stringerParams.carcasHoles, sideIn);
		anglesIn.position.x = stringerMiddle.position.x;
		anglesIn.position.z = stringerMiddle.position.z;
		if (sideIn == "left") anglesIn.position.z += params.stringerThickness;
		angles.add(anglesIn);

		//рамки ступеней
		dxfBasePointFrame.x += 1000;
		var framePar = {
			length: framesAmt[i],
			holes: stringerParams.carcasHoles,
			dxfBasePoint: dxfBasePointFrame,
		}
		var frames = drawFramesStock(framePar);
		frames.position.x = -stringerParams.treadFrontOverHang;
		frames.position.z = stringerMiddle.position.z;
		angles.add(frames)

		// Соединительные фланцы на внутренней тетиве	
		var franPar = {
			carcasHoles: stringerParams.carcasHoles,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 100, 0),
			marshAng: stringerParams.marshAng,
			side: sideIn,
		}

		// Отрисовка фланцев 
		var flans = drawStringerFlans_all(franPar);
		flans.position.x = -5;
		flans.position.z = stringerMiddle.position.z - params.stringerThickness;
		mesh.add(flans);

		par.dxfBasePoint.x += stringerParams.lenX;
	}

	//колонны
	var columns = drawColumnsStock(stringerParams);
	mesh.add(columns);

	stringerParams.mesh = mesh;
	stringerParams.angles = angles;

	return stringerParams;
}


function drawStringerStock(par) {
	//рассчитываем параметры косоура по номеру марша
	calcStringerPar(par); //функция в этом файле ниже
	par.partsLen = []; //массив длин кусков косоура для спецификации

	par.marshParams = getMarshParams(1);

	//именованные ключевые точки
	if (!par.keyPoints) par.keyPoints = {};
	if (!par.keyPoints[par.key]) par.keyPoints[par.key] = {};
	par.keyPoints[par.key].zeroPoint = { x: 0, y: 0 };
	par.zeroPoint = { x: 0, y: 5 };

	par.pointsShape = [];
	par.pointsShapeTop = [];
	par.pointsHole = [];
	par.pointsHoleTop = [];
	par.railingHoles = [];
	par.railingHolesTop = [];


	//подпись под контуром
	var name = "Тетива";

	var text = name + " внутр.";
	if (par.key === 'out') text = name + " внешн.";
	par.marshHasRailing = par.marshParams.hasRailing[par.key];
	var isMirrow = false;
	if (turnFactor == 1 && par.key == "in") isMirrow = true;
	if (turnFactor == -1 && par.key == "out") isMirrow = true;
	if (isMirrow) text += " (зеркально)";
	var textHeight = 30;
	var textBasePoint = newPoint_xy(par.dxfBasePoint, 20, -150.0);
	addText(text, textHeight, dxfPrimitivesArr, textBasePoint);


	par.stringerShape = new THREE.Shape();
	par.stringerShapeTop = new THREE.Shape();

	// точки вставки уголков, рамок, перемычек
	if (!par.elmIns) par.elmIns = {};
	if(!par.isMiddleStringer) {
		par.elmIns[par.key] = {};
		par.elmIns[par.key].racks = [];
	}


	par.h = params.h1;
	par.a = params.a1;
	par.b = params.b1;
	par.stairAmt = params.stairAmt1;
	if (params.platformTop !== 'нет') par.stairAmt += 1;
	par.marshAng = Math.atan(par.h / par.b);
	par.stringerWidth = 150;
	par.holeFrameDist = 150;

	/*низ--------------------------------------------------------------------------*/
	var p0 = copyPoint(par.zeroPoint);
	var pt0 = newPoint_xy(p0, 0, 20);
	var p1 = newPoint_xy(p0, 0, par.h);
	var p2 = newPoint_xy(p1, par.b, 0);
	var ph = copyPoint(p1);

	// нижний край тетивы
	var p20 = newPoint_xy(p2, par.stringerWidth / Math.sin(par.marshAng), 0.0)// первая точка на нижней линии марша
	var p21 = polar(p20, par.marshAng, 100.0); // вторая точка на нижней линии
	var botLineP1 = itercection(pt0, polar(pt0, 0, 100), p20, p21); 

	// срез передней кромки
	var botLineP3 = newPoint_xy(p0, 0.0, 100.0);
	var botLineP2 = itercection(botLineP3, polar(botLineP3, Math.PI * (5 / 3), 100), pt0, polar(pt0, 0, 100));//точка пересечения переднего среза и нижней линии

	if (par.isMiddleStringer) {
		p1 = newPoint_xy(p1, 17.5, -25);
		p2 = newPoint_xy(p1, par.b + 27, 0);		
		botLineP3 = itercection(botLineP2, polar(botLineP2, Math.PI * (5 / 3), 100), p1, polar(p1, Math.PI / 2, 100))
		p1.filletRad = 0; //угол не скругляется
	}

	//сохраняем точку для расчета длины
	par.keyPoints.botPoint = copyPoint(botLineP3);

	//сохраняем точки контура
	par.pointsShape.push(botLineP1);
	par.pointsShape.push(botLineP2);
	par.pointsShape.push(botLineP3);
	par.pointsShape.push(p1);
	par.pointsShape.push(p2);

	// отверстия под нижний крепежный уголок
	var center1 = newPoint_xy(botLineP1, -80, 35);
	var center2 = newPoint_xy(center1, 60, 0.0);
	center1.hasAngle = center2.hasAngle = true;
	center1.pos = center2.pos = "botFloor";
	par.pointsHole.push(center1);
	par.pointsHole.push(center2);

	// отверстия под рамку ступени
	center1 = newPoint_xy(ph, 77.5, -45);
	center2 = newPoint_xy(center1, par.holeFrameDist, 0);
	center1.isFrame = center2.isFrame = true;
	if (par.isMiddleStringer) center1.noZenk = center2.noZenk = true;
	par.pointsHole.push(center1);
	par.pointsHole.push(center2);

	//Отверстия под ограждения
	if (!par.isMiddleStringer && par.marshHasRailing) {
		center1 = newPoint_xy(center1, 150 / 2, 0);
		par.railingHoles.push(center1);
	}


	/*средние ступени---------------------------------------------------------------*/
	if (par.stairAmt > 2) {
		for (var i = 0; i < par.stairAmt - 2; i++) {
			pt1 = newPoint_xy(p2, 0, par.h);
			pt2 = newPoint_xy(pt1, par.b, 0);
			var ph = copyPoint(pt1);

			if (par.isMiddleStringer) {
				pt1.x -= 27
				pt1.filletRad = pt2.filletRad = 0; //угол не скругляется

				var pv1 = newPoint_xy(p2, 0, 25);
				var pv2 = newPoint_xy(p2, -27, 135);
				pv1.filletRad = 0; //угол не скругляется

				par.pointsShape.push(pv1);
				par.pointsShape.push(pv2);
			}

			par.pointsShape.push(pt1);
			par.pointsShape.push(pt2);
			p2 = copyPoint(pt2);

			// отверстия под рамку ступени
			center1 = newPoint_xy(ph, 77.5, -45);
			if (par.isMiddleStringer) center1 = newPoint_xy(center1, -17.5 - 27, 25);
			center2 = newPoint_xy(center1, par.holeFrameDist, 0);
			center1.isFrame = center2.isFrame = true;
			if (par.isMiddleStringer) center1.noZenk = center2.noZenk = true;
			par.pointsHole.push(center1);
			par.pointsHole.push(center2);

			//Отверстия под ограждения
			if (!par.isMiddleStringer && par.marshHasRailing) {
				if ((i == 1 && par.stairAmt == 5) || (i == 2 && par.stairAmt == 6)) {
					center1 = newPoint_xy(center1, 150 / 2, 0);
					par.railingHoles.push(center1);
				}
			}
		}
	}


	/*вверх-------------------------------------------------------------------------*/
	var p3 = newPoint_xy(p2, 0, par.h);
	var topLineP1 = newPoint_xy(p3, par.a, 0.0);
	var topLineP2 = newPoint_xy(topLineP1, 0.0, -190);
	var topLineP3 = itercection(topLineP2, polar(topLineP2, 0, 100), p20, p21);
	topLineP1.filletRad = topLineP2.filletRad = 0; //угол не скругляется
	var ph = copyPoint(p3);

	if (par.isMiddleStringer) {
		p3.x -= 27;
		topLineP1.x -= 27 + 17.5;
		topLineP2.x -= 27 + 17.5;
		topLineP2.y += 25;
		topLineP3 = itercection(topLineP2, polar(topLineP2, 0, 100), p20, p21);
		var pt1 = newPoint_xy(p2, 0, 25);
		var pt2 = newPoint_xy(p2, -27, 135);
		p3.filletRad = pt1.filletRad = pt2.filletRad = 0; //угол не скругляется

		par.pointsShape.push(pt1);
		par.pointsShape.push(pt2);
	}

	//сохраняем точку для расчета длины
	par.keyPoints.topPoint = copyPoint(topLineP1);

	//сохраняем точки контура
	par.pointsShape.push(p3);
	par.pointsShape.push(topLineP1);
	par.pointsShape.push(topLineP2);
	par.pointsShape.push(topLineP3);

	if (params.platformTop == 'площадка') {
		var pt1 = copyPoint(topLineP1);
		var pt4 = copyPoint(topLineP2);
		var pt2 = newPoint_xy(pt1, params.topPltLength_stock - 300, 0);
		var pt3 = newPoint_xy(pt4, params.topPltLength_stock - 300, 0);

		pt1.filletRad = pt2.filletRad = pt3.filletRad = pt4.filletRad = 0; //угол не скругляется
		par.pointsShapeTop.push(pt4);
		par.pointsShapeTop.push(pt1);
		par.pointsShapeTop.push(pt2);
		par.pointsShapeTop.push(pt3);

		//сохраняем длину для спецификации
		par.partsLen.push(distance(pt1, pt2))
	}

	// отверстия под верхний крепежный уголок или под соединительный фланец
	center1 = newPoint_xy(topLineP2, -40, 23 + 60);
	center2 = newPoint_xy(center1, 0.0, -60);
	if (params.platformTop == 'нет') {
		center1.hasAngle = center2.hasAngle = true;
		center1.pos = center2.pos = "topFloor";
		if (params.topStepColumns == "есть") {
			center1.boltLen = center2.boltLen = 40;
			center1.noBoltsInSide2 = center2.noBoltsInSide2 = true;
			par.colPoint1 = copyPoint(center1);
		}
	}
	else {
		center1.isTopFlanHole = center2.isTopFlanHole = true;
		center1.pos = "topLeft";
		center2.pos = "botLeft";
	}
	par.pointsHole.push(center2);
	par.pointsHole.push(center1);

	
	if (params.platformTop !== 'нет') {	
		par.colPoint2 = copyPoint(center1);

		// отверстия под соединительный фланец
		center1 = newPoint_xy(topLineP2, 40, 23 + 60);
		center2 = newPoint_xy(center1, 0.0, -60);
		center1.isTopFlanHole = center2.isTopFlanHole = true;
		center1.pos = "topRight"; 
		center2.pos = "botRight";
		par.pointsHoleTop.push(center2);
		par.pointsHoleTop.push(center1);

		// отверстия по середине соединительного фланца для крепления колонны
		if (!par.isMiddleStringer) {
			if ((params.isColumnTop2 && par.key == 'out') || (params.isColumnTop4 && par.key == 'in')) {
				center3 = newPoint_xy(center1, -40, 0);
				center4 = newPoint_xy(center3, 0.0, -60);
				center3.isTopFlanHole = center4.isTopFlanHole = true;
				center3.noDraw = center4.noDraw = true;
				center3.dz = center4.dz = params.stringerThickness;
				center3.pos = "topMidle";
				center4.pos = "botMidle";
				par.pointsHoleTop.push(center3);
				par.pointsHoleTop.push(center4);
			}
		}

		// отверстия под рамку ступени		
		center1 = newPoint_xy(pt1, 72.5, -45);
		if (par.isMiddleStringer) center1.y += 25;
		center2 = newPoint_xy(center1, par.holeFrameDist, 0);
		center1.isFrame = center2.isFrame = true;
		if (par.isMiddleStringer) center1.noZenk = center2.noZenk = true;
		par.pointsHoleTop.push(center1);
		par.pointsHoleTop.push(center2);

		var countFrame = (params.topPltLength_stock - 300) / 300;
		for (var j = 1; j < countFrame; j++) {
			center1 = newPoint_xy(center2, par.holeFrameDist, 0);
			center2 = newPoint_xy(center1, par.holeFrameDist, 0);
			center1.isFrame = center2.isFrame = true;
			if (par.isMiddleStringer) center1.noZenk = center2.noZenk = true;
			par.pointsHoleTop.push(center1);
			par.pointsHoleTop.push(center2);
		}

		//Отверстия под ограждения
		if (par.hasPltRailing && !par.isMiddleStringer) {
			center1 = newPoint_xy(center1, 150 / 2, 0);
			par.railingHolesTop.push(center1);
		}

		// отверстия под верхний крепежный уголок
		center1 = newPoint_xy(pt3, -40, 23 + 60);
		center2 = newPoint_xy(center1, 0.0, -60);
		center1.hasAngle = center2.hasAngle = true;
		center1.pos = center2.pos = "topFloor";
		par.pointsHoleTop.push(center2);
		par.pointsHoleTop.push(center1);
		if (!par.isMiddleStringer) {
			if ((params.isColumnTop1 && par.key == 'in') || (params.isColumnTop3 && par.key == 'out')) {
				center1.boltLen = center2.boltLen = 40;
				// center1.noZenk = center2.noZenk = true;
				center1.noBoltsInSide2 = center2.noBoltsInSide2 = true;
			}
		}

		par.colPoint1 = copyPoint(center1);
	}

	// отверстия под рамку ступени
	center1 = newPoint_xy(ph, 77.5, -45);
	if (par.isMiddleStringer) center1 = newPoint_xy(center1, -17.5 - 27, 25);
	center2 = newPoint_xy(center1, par.holeFrameDist, 0);
	center1.isFrame = center2.isFrame = true;
	if (par.isMiddleStringer) center1.noZenk = center2.noZenk = true;
	par.pointsHole.push(center1);
	par.pointsHole.push(center2);

	//Отверстия под ограждения
	if (!par.isMiddleStringer) {
		center1 = newPoint_xy(center1, 150 / 2, 0);
		par.railingHoles.push(center1);
	}

	


	var radIn = 5;
	var radOut = 10;

	//создаем шейп
	var shapePar = {
		points: par.pointsShape,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		radIn: radIn, //Радиус скругления внутренних углов
		radOut: radOut, //радиус скругления внешних углов
		//markPoints: true,
	}

	par.stringerShape = drawShapeByPoints2(shapePar).shape;

	//рисуем отверстия
	drawStringerHoles(par);

	//добавляем отверстия под ограждения
	var railingHolesPar = {
		shape: par.stringerShape,
		holeCenters: par.railingHoles,
		dxfBasePoint: par.dxfBasePoint,
	}
	drawRailingHoles(railingHolesPar);


	if (par.pointsShapeTop.length > 0) {
		//создаем шейп
		var shapePar = {
			points: par.pointsShapeTop,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: par.dxfBasePoint,
			radIn: radIn, //Радиус скругления внутренних углов
			radOut: radOut, //радиус скругления внешних углов
			//markPoints: true,
		}

		//параметры для рабочего чертежа
		shapePar.drawing = {
			name: "Косоур верхний",
			group: "stringers",
		}

		par.stringerShapeTop = drawShapeByPoints2(shapePar).shape;

		//рисуем отверстия
		drawStringerHoles(par, "top");

		//добавляем отверстия под ограждения
		var railingHolesPar = {
			shape: par.stringerShapeTop,
			holeCenters: par.railingHolesTop,
			dxfBasePoint: par.dxfBasePoint,
		}
		drawRailingHoles(railingHolesPar);
	}


	par.mesh = new THREE.Object3D();

	var stringerExtrudeOptions = {
		amount: params.stringerThickness - 0.01,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	var geom = new THREE.ExtrudeGeometry(par.stringerShape, stringerExtrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.metal);
	par.mesh.add(mesh);

	//верхний доп. кусок
	if (par.pointsShapeTop.length > 0) {
		var geom = new THREE.ExtrudeGeometry(par.stringerShapeTop, stringerExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var meshTop = new THREE.Mesh(geom, params.materials.metal);
		par.mesh.add(meshTop);
	}


	//формируем единый массив центров отверстий косоура для вставки уголков, рамок, колонн и т.п.
	par.carcasHoles = [];
	par.carcasHoles.push(...par.pointsHole, ...par.pointsHoleTop);
	// console.log(par, stringerParams, par.isMiddleStringer)
	//формируем единый массив центров отверстий для ограждений
	if(!par.isMiddleStringer) stringerParams.elmIns[stringerParams.key].racks.push(...par.railingHoles, ...par.railingHolesTop)
	// console.log(stringerParams.elmIns[stringerParams.key])
	//рассчитываем размер косоура по X для расчета dxfBasePoint для следующего косоура
	par.lenX = par.b * par.stairAmt + 500;
	if (params.platformTop !== 'нет') par.lenX += pt2.x - pt1.x;

	//линия между верхней и нижней точками
	if (par.keyPoints.botPoint && par.keyPoints.topPoint) {
		var trashShape = new THREE.Shape();
		var layer = "comments";
		addLine(trashShape, dxfPrimitivesArr, par.keyPoints.botPoint, par.keyPoints.topPoint, par.dxfBasePoint, layer);
		par.partsLen.push(distance(par.keyPoints.botPoint, par.keyPoints.topPoint));
	}
	//сохраняем данные для спецификации
	if (!par.partsLen[0]) par.partsLen[0] = 0;

	//болты в отверстиях под рамки
	if (typeof anglesHasBolts != "undefined" && anglesHasBolts) { //anglesHasBolts - глобальная переменная
		var boltPar = {
			diam: boltDiam,
			len: boltLen,
		};
		for (var i = 0; i < par.carcasHoles.length; i++) {
			if (par.carcasHoles[i].isFrame || par.carcasHoles[i].noZenk || par.carcasHoles[i].boltLen) {
				if (par.carcasHoles[i].noZenk) {
					boltPar.len = 40;
					boltPar.headType = "шестигр.";
					if (par.isMiddleStringer)  boltPar.headShim = true;
				}
				else {
					boltPar.len = 30;
					boltPar.headType = "потай";
				}
				if (par.carcasHoles[i].boltLen)
					boltPar.len = par.carcasHoles[i].boltLen;

				var bolt = drawBolt(boltPar).mesh;
				bolt.rotation.x = Math.PI / 2;
				bolt.position.x = par.carcasHoles[i].x;
				bolt.position.y = par.carcasHoles[i].y;
				bolt.position.z = boltPar.len / 2;
				if (par.isMiddleStringer) bolt.position.z -= 10;
				if (par.key == 'out') {
					bolt.rotation.x = -Math.PI / 2;
					bolt.position.z = -boltPar.len / 2 + params.stringerThickness;
				}
				if (turnFactor == -1 && !par.isMiddleStringer) {
					bolt.rotation.x = -Math.PI / 2;
					bolt.position.z = -boltPar.len / 2 + params.stringerThickness;
					if (par.key == 'out') {
						bolt.rotation.x = Math.PI / 2;
						bolt.position.z = boltPar.len / 2;
					}
				}
				if(!testingMode) par.mesh.add(bolt);
			}
		}

	}


	var partName = "stringer";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Тетива",
				area: 0,
				paintedArea: 0,
				metalPaint: true,
				timberPaint: false,
				division: "stock_2",
				workUnitName: "area", //единица измерения
				group: "Каркас",
			}
		}

		var stairAmt = params.stairAmt1;
		if (params.platformTop !== 'нет') stairAmt += 1;
		if (par.key === 'out') {
			var name = "Т-180-" + stairAmt + " бок (комплект 2 шт)";	
			var area = 300 * par.partsLen[par.partsLen.length - 1] / 1000000;
			if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
			if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
			specObj[partName]["amt"] += 1;		
			specObj[partName]["area"] += area;
			specObj[partName]["paintedArea"] += area * 2;
		}		

		if (par.isMiddleStringer) {
			var name = "Т-180-" + stairAmt + " сред";
			var area = 300 * par.partsLen[par.partsLen.length - 1] / 1000000;
			if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
			if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
			specObj[partName]["amt"] += 1;
			specObj[partName]["area"] += area;
			specObj[partName]["paintedArea"] += area * 2;
		}		
	}
	par.mesh.specId = partName + name;

	var partName = "pltStringer";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Пластина",
				area: 0,
				paintedArea: 0,
				metalPaint: true,
				timberPaint: false,
				division: "stock_2",
				workUnitName: "area", //единица измерения
				group: "Каркас",
			}
		}

		if (par.key === 'out' && params.platformTop !== 'нет') {
			var name = "190х" + (params.topPltLength_stock - 300) + " краш. (комплект 2шт)";
			var area = (params.topPltLength_stock - 300) * 190 / 1000000;
			if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
			if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
			specObj[partName]["amt"] += 1;
			specObj[partName]["area"] += area;
			specObj[partName]["paintedArea"] += area * 2;
		}

		if (par.isMiddleStringer && params.platformTop !== 'нет') {
			var name = "165х" + (params.topPltLength_stock - 300) + " краш.";
			var area = (params.topPltLength_stock - 300) * 165 / 1000000;
			if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
			if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
			specObj[partName]["amt"] += 1;
			specObj[partName]["area"] += area;
			specObj[partName]["paintedArea"] += area * 2;
		}
	}
	if (meshTop) {
		meshTop.specId = partName + name;
	}

	return par;
} //end of drawStringerStock


/** @description функция отрисовки рамок ступеней
 * @return mesh
 */
function drawFramesStock(par) {
	var frames = new THREE.Object3D;
	
	for (var i = 0; i < par.holes.length - 1; i++) {
		if (par.holes[i].isFrame) {
			var frame = drawTreadFrameStock(par);
			frame.position.x = par.holes[i].x;
			frame.position.y = par.holes[i].y;
			frames.add(frame);

			par.dxfBasePoint.x += 150;
			i++; //пропускаем следующее отверстие
		}
	}

	return frames;

}//end of drawFrames

function drawTreadFrameStock(par) {

	// создаем меш
	var mesh = new THREE.Object3D();

	par.width = 270;
	par.profWidth = 20;
	par.profHeight = 40;
	par.sideHolePosX = par.profWidth + 40;


	// создаем рамку
	var frame = new THREE.Object3D();

	// определяем параметры профиля
	var profPar = {
		partName: "frameProf",
		type: "rect",
		poleProfileY: par.profHeight,
		poleProfileZ: par.profWidth,
		length: par.length,
		poleAngle: 0,
		material: params.materials.metal,
		dxfBasePoint: { x: 0, y: 0 },
		dxfArr: [], //профиль не выводим в dxf
		sectText: "",
		handrailMatType: "metal"
	};

	// передний профиль рамки
	var pole = drawPole3D_4(profPar).mesh;
	pole.rotation.y = - Math.PI / 2;
	pole.position.x = par.profWidth;
	pole.position.y = - par.profHeight;
	pole.position.z = 0;
	frame.add(pole);

	// задний профиль рамки
	var pole = drawPole3D_4(profPar).mesh;
	pole.rotation.y = - Math.PI / 2;
	pole.position.x = par.width;
	pole.position.y = - par.profHeight;
	pole.position.z = 0;
	frame.add(pole);


	// определяем параметры бокового фланца
	var flanPar = {
		width: 40,
		height: par.width - 2 * par.profWidth,
		thk: 8,
		roundHoleCenters: [],
		holeRad: 6.5,
		noBolts: true,
		dxfBasePoint: par.dxfBasePoint,
	};

	var flanSideWidth = flanPar.width;

	// определяем параметры отверстия фланца
	var center1 = {x: flanPar.width / 2, y: 40};
	var center2 = newPoint_xy(center1, 0, 150);	
	var center3 = newPoint_xy(center1, 0, 150 / 2);	

	// добавляем параметры отверстий в свойства фланца
	flanPar.roundHoleCenters.push(center1, center2, center3);

	// создаем левый боковой фланец
	var sideFlan1 = drawRectFlan2(flanPar).mesh;
	sideFlan1.position.x = flanPar.height + par.profWidth;
	sideFlan1.position.y = - flanPar.width;
	sideFlan1.position.z = 0;
	sideFlan1.rotation.z = Math.PI / 2;
	frame.add(sideFlan1);

	// создаем правый боковой фланец
	flanPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, -flanPar.height - 50);
	
	var sideFlan2 = drawRectFlan2(flanPar).mesh;
	sideFlan2.rotation.z = Math.PI / 2;
	sideFlan2.position.x = sideFlan1.position.x
	sideFlan2.position.y = - flanPar.width;
	sideFlan2.position.z = par.length - flanPar.thk;
	frame.add(sideFlan2);

	
	// определяем параметры верхней перемычки
	var flanPar = {
		width: 25,
		height: par.width - 2 * par.profWidth,
		thk: 4,
		roundHoleCenters: [],
		holeRad: 4,
		noBolts: true,
		hasScrews: true,
		dxfBasePoint: par.dxfBasePoint,
	};
	if (params.stairType == "нет") flanPar.hasScrews = false;

	if (params.stairType == 'дпк' || params.stairType == 'лиственница тер.') {
		flanPar.hasScrews = false;
		flanPar.boltParams = {
			headType: "меб.",
			diam: 6,
			len: 35,
			offsetY: params.treadThickness,
			nutOffset: -10
		};
	}

	flanPar.dxfBasePoint = newPoint_xy(flanPar.dxfBasePoint, 0, flanPar.height + 150);

	// определяем параметры отверстия фланца
	var center1 = { x: flanPar.width / 2, y: 40 };
	var center2 = newPoint_xy(center1, 0, 150);

	// добавляем параметры отверстий в свойства фланца
	flanPar.roundHoleCenters.push(center1, center2);

	// левая верхняя перемычка
	var topFlan1 = drawRectFlan2(flanPar).mesh;
	topFlan1.position.x = flanPar.height + par.profWidth;
	topFlan1.position.y = 0;
	topFlan1.position.z = 40;
	topFlan1.rotation.x = Math.PI / 2;
	topFlan1.rotation.z = Math.PI / 2;
	frame.add(topFlan1);

	// левая верхняя перемычка
	var topFlan1 = drawRectFlan2(flanPar).mesh;
	topFlan1.position.x = flanPar.height + par.profWidth;
	topFlan1.position.y = 0;
	topFlan1.position.z = par.length - 40;
	topFlan1.rotation.x = Math.PI / 2;
	topFlan1.rotation.z = Math.PI / 2;
	frame.add(topFlan1);


	// средняя перемычка из профильной трубы
	var profPar = {
		partName: "frameProf",
		poleProfileY: 20,
		poleProfileZ: 20,
		length: par.width - par.profWidth * 2,
		poleAngle: 0,
		dxfBasePoint: { x: 0, y: 0 },
		dxfArr: [], //профиль не выводим в dxf
		sectText: "",
		handrailMatType: "metal"
	};

	var pole = drawPole3D_4(profPar).mesh;
	pole.position.x = par.profWidth;
	pole.position.y = -profPar.poleProfileY;
	pole.position.z = -profPar.poleProfileZ / 2 + par.length / 2;
	frame.add(pole);


	//сохраняем данные для спецификации
	var partName = "treadFrame";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Рамка под ДПК",
				metalPaint: true,
				timberPaint: false,
				division: "stock_2",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
			}
		}
		var name = par.length + "мм";
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}
	frame.specId = partName + name;

	// позиционируем рамку
	frame.position.x = - par.sideHolePosX;
	frame.position.y = flanSideWidth / 2;
	frame.position.z = -par.length;
	mesh.add(frame);

	return mesh;

} //end of drawTreadFrameStock

// функция отрисовки колонн
function drawColumnsStock(par) {

	var mesh = new THREE.Object3D();

	if (params.platformTop == 'нет' && params.topStepColumns == "есть") {
		var colParams = {
			key: 'in',
			length: par.colPoint1.y - 89, //переопределяется в цикле
			profWidth: 40,
			profHeight: 40,
			material: params.materials.metal,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: par.dxfBasePoint,
			text: "",
		}

		colParams = drawColumnStock(colParams);
		var col1 = colParams.mesh;
		col1.position.x = par.colPoint1.x - 5;
		col1.position.z = - params.M / 2 + params.stringerThickness + 8;
		mesh.add(col1);
		colParams.dxfBasePoint.x += 200;

		colParams = drawColumnStock(colParams);
		var col1 = colParams.mesh;
		col1.position.x = par.colPoint1.x - 5;
		col1.position.z = +params.M / 2 - params.stringerThickness - 8;
		col1.rotation.y = Math.PI;
		mesh.add(col1);
		colParams.dxfBasePoint.x += 200;
	}

	if (params.platformTop !== 'нет' && params.topPltColumns != "нет") {
		var colParams = {
			key: 'in',
			length: par.colPoint1.y - 89, //переопределяется в цикле
			profWidth: 40,
			profHeight: 40,
			material: params.materials.metal,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: par.dxfBasePoint,
			text: "",
		}

		if (params.isColumnTop1) {
			colParams = drawColumnStock(colParams);
			var col1 = colParams.mesh;
			col1.position.x = par.colPoint1.x - 5;
			col1.position.z = - params.M / 2 + params.stringerThickness + 8;
			mesh.add(col1);
			colParams.dxfBasePoint.x += 200;
		}
		if (params.isColumnTop2) {
			colParams = drawColumnStock(colParams);
			var col1 = colParams.mesh;
			col1.position.x = par.colPoint2.x - 5 + 40;
			col1.position.z = - params.M / 2 + params.stringerThickness + 8;
			mesh.add(col1);
			colParams.dxfBasePoint.x += 200;
		}
		if (params.isColumnTop3) {
			colParams = drawColumnStock(colParams);
			var col1 = colParams.mesh;
			col1.position.x = par.colPoint1.x - 5;
			col1.position.z = +params.M / 2 - params.stringerThickness - 8;
			col1.rotation.y = Math.PI;
			mesh.add(col1);
			colParams.dxfBasePoint.x += 200;
		}
		if (params.isColumnTop4) {
			colParams = drawColumnStock(colParams);
			var col1 = colParams.mesh;
			col1.position.x = par.colPoint2.x - 5 + 40;
			col1.position.z = +params.M / 2 - params.stringerThickness - 8;
			col1.rotation.y = Math.PI;
			mesh.add(col1);
			colParams.dxfBasePoint.x += 200;
		}		
	}

	return mesh;
}

// каркас верхней площадки
function drawTopPlatformStringersStock(par) {
	var mesh = new THREE.Object3D();
	var angles = new THREE.Object3D();

	var stringerParams = {
		marshId: 1,
		dxfBasePoint: par.dxfBasePoint,
		treadsObj: par.treadsObj,
	};


	//задняя тетива верхней площадки
	if ((params.platformTop == "площадка" || params.platformTop == "увеличенная") && params.platformRearStringer == "есть") {

		var rearStringer = drawTopPltStringerStock(stringerParams).mesh;
		rearStringer.position.x = 0;
		rearStringer.rotation.y = Math.PI / 2;
		if (params.platformTop == 'увеличенная') {
			rearStringer.position.z = -params.stringerThickness;
			if (turnFactor == -1) rearStringer.position.z = 0;

			if (turnFactor == 1) {
				rearStringer.position.z = (params.platformWidth_3 - params.M);
			}
		}		

		mesh.add(rearStringer);
	}

	//каркас увеличенной верхней площадки
	if (params.platformTop == 'увеличенная' && params.platformWidth_3 > params.M) {

	}

	stringerParams.mesh = mesh;
	stringerParams.angles = angles;

	return stringerParams;
}

/**
 * Задний косоур верхней площадки
 */
function drawTopPltStringerStock(par) {

	par.pointsShape = [];
	par.pointsHole = [];
	par.railingHoles = [];

	par.carcasHoles = [];
	par.key = "rear";

	if (!par.keyPoints) par.keyPoints = {};
	if (!par.keyPoints[par.key]) par.keyPoints[par.key] = {};

	par.dxfBasePoint.x += params.M / 2;

	var p0 = { x: -params.M / 2, y: -185 };
	var p1 = newPoint_xy(p0, 0, 190);
	var p2 = newPoint_xy(p1, params.M, 0);
	var p3 = newPoint_xy(p0, params.M, 0);
	p0.filletRad = p1.filletRad = p2.filletRad = p3.filletRad = 0; //угол не скругляется
	par.pointsShape = [p0, p1, p2, p3];

	// отверстия под крепежный уголок
	//левый
	center1 = newPoint_xy(p0, 58, 23 + 60);
	center2 = newPoint_xy(center1, 0.0, -60);
	par.pointsHole.push(center2);
	par.pointsHole.push(center1);

	//правый
	center1 = newPoint_xy(p3, -58, 23 + 60);
	center2 = newPoint_xy(center1, 0.0, -60);
	par.pointsHole.push(center2);
	par.pointsHole.push(center1);

	//средние
	var framesAmt = [];
	for (var i = 0; i < params.frameAmt_600; i++) {
		framesAmt.push(600);
	}
	for (var i = 0; i < params.frameAmt_800; i++) {
		framesAmt.push(800);
	}
	for (var i = 0; i < params.frameAmt_1000; i++) {
		framesAmt.push(1000);
	}

	var dx = 0;
	for (var i = 1; i < framesAmt.length; i++) {
		dx += framesAmt[i] + params.stringerThickness;
		center1 = newPoint_xy(p3, -58 - dx, 23 + 60);
		center2 = newPoint_xy(center1, 0.0, -60);
		par.pointsHole.push(center2);
		par.pointsHole.push(center1);
	}

	//отверстия под ограждения
	par.elmIns = {};
	par.elmIns[par.key] = {};
	par.elmIns[par.key].racks = [];

	//левая крайняя стойка
	center1 = newPoint_xy(p1, 160, -45);
	par.elmIns[par.key].racks.push(center1);

	//правая крайняя стойка
	center1 = newPoint_xy(p2, -160, -45);
	par.elmIns[par.key].racks.push(center1);



	//создаем шейп
	var shapePar = {
		points: par.pointsShape,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
	}

	par.stringerShape = drawShapeByPoints2(shapePar).shape;

	//рисуем отверстия
	drawStringerHoles(par);

	//добавляем отверстия под ограждения

	var railingHolesPar = {
		shape: par.stringerShape,
		holeCenters: par.elmIns[par.key].racks,
		dxfBasePoint: par.dxfBasePoint,
	}
	drawRailingHoles(railingHolesPar);

	var extrudeOptions = {
		amount: params.stringerThickness - 0.01,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	//косоур на марше
	var geom = new THREE.ExtrudeGeometry(par.stringerShape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	par.mesh = new THREE.Mesh(geom, params.materials.metal);
	par.mesh.position.x = 0.01;
	if (params.platformTop == "увеличенная" && turnFactor == 1) {
		par.mesh.position.z += params.platformWidth_3 - params.M;
	}
	

	//сохраняем данные для спецификации
	var partName = "rearStringer";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Задняя тетива площадки",
				area: 0,
				paintedArea: 0,
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "area", //единица измерения
				group: "Каркас",
				comment: "изготавливается на заказ",
			}
		}
		var name = 0;//params.M + "x" + 190;
		var area = params.M * 190 / 1000000;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		specObj[partName]["paintedArea"] += area * 2;
	}
	par.mesh.specId = partName;

	return par;
} //end of drawTopPltStringerStock

/**
 * Колона под площадкой для входной лестницы с фланцем с овальными отверстиями
 * с фланцем
 var columnParams = {
			length: stairAmtP * h1,
			profWidth: profWdth,
			profHeight: profHeight,
			material: metalMaterial,
			flanMaterial: flanMaterial,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: {x:-200, y:0},
			dxfBasePointStep: dxfBasePointStep,
			dir: "left",
			}
 */
function drawColumnStock(par) {
	var flanThickness = 8.0;

	var shape = new THREE.Shape();

	// внешний контур
	var p0 = { x: 0, y: 0 };
	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p1, 0, par.length);
	var p3 = newPoint_xy(p1, par.profWidth, par.length);
	var p4 = newPoint_xy(p1, par.profWidth, 0);
	addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p4, p1, par.dxfBasePoint);

	var extrudeOptions = {
		amount: par.profHeight,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var col = new THREE.Mesh(geometry, params.materials.metal);

	//par.mesh = col;
	var grp = new THREE.Object3D();
	col.position.x = -par.profWidth / 2;
	col.position.z = flanThickness
	if (par.dir == "right") col.position.z = -par.profWidth - flanThickness;
	grp.add(col);

	// фланец
	var flan = drawColFlan(par);
	flan.position.x = -par.profHeight / 2;
	flan.position.y = par.length - 46.0;
	flan.position.z = 0//par.dir == "left" ? 0.0 : par.profHeight - flanThickness;
	if (par.dir == "right") flan.position.z = - flanThickness;
	flan.rotation.x = 0.0;
	flan.rotation.y = 0.0;
	flan.rotation.z = 0.0;
	grp.add(flan);

	var plugParams = {
		id: "plasticPlug_40_40",
		width: 40,
		height: 40,
		description: "Заглушка низа опоры",
		group: "Каркас"
	}
	var columnBotPlug = drawPlug(plugParams);
	columnBotPlug.position.z = flanThickness + par.profWidth / 2;
	if(!testingMode) grp.add(columnBotPlug);

	var columnBotPlug = drawPlug(plugParams);
	columnBotPlug.position.y = par.length;
	columnBotPlug.position.z = flanThickness + par.profWidth / 2;
	if(!testingMode) grp.add(columnBotPlug);

	par.mesh = grp;

	//сохраняем данные для спецификации
	var partName = "column";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				name: "Опора площадки ",
				metalPaint: true,
				timberPaint: false,
				division: "stock_2",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
				comment: "длина с запасом 100мм. Подрезать на монтаже по месту",
			}
		}
		var stairAmt = params.stairAmt1;
		if (params.platformTop == "площадка") stairAmt = params.stairAmt1 + 1;

		var name = "A=960 (6 ступ.)";
		if (stairAmt == 2) name = "A=240 (2 ступ.)";
		if (stairAmt == 3) name = "A=420 (3 ступ.)";
		if (stairAmt == 4) name = "A=600 (4 ступ.)";
		if (stairAmt == 5) name = "A=780 (5 ступ.)";
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}
	par.mesh.specId = partName + name;

	return par;
}//end of drawColumnStock
