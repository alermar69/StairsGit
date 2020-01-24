/**функция отрисовывает прямые рамки марша по координтам отрверстий
*/

function drawFrames(par){
	var frames = new THREE.Object3D;
	// if(menu.simpleMode) return frames;

	var isFrameHole = function(hole){
		return (hole.hasAngle == undefined && hole.wndFrame == undefined);
	}

	var offsetHoleTopFlanDpk = 0; //на верхнем фланце отступ для первого отверстия крепления ступени дпк площадки (рассчитывается в функции drawTreadFrame2), чтобы отверстия в верхнем фланце рамки располагались по середине ступени дпк
	for(var i=0; i<par.holes.length-1; i++){
		if(isFrameHole(par.holes[i])){
			var holeDist = par.holes[i + 1].x - par.holes[i].x;			

			var framePar = {
				holeDist: holeDist,
				dxfBasePoint: par.dxfBasePoint,
				isPltFrame: par.holes[i].isPltFrame, //является ли рамкой площадки
				isPltPFrame: par.holes[i].isPltPFrame, //является ли рамкой промежуточной площадки П-образной с площадкой
				isLargePlt: par.holes[i].isLargePlt, //является ли каркасом увеличенной площадки
				isFlanFrame: par.holes[i].isMiddleFlanHole, //попадает ли на соеденительный фланец
				marshId: par.marshId,
				offsetHoleTopFlanDpk: offsetHoleTopFlanDpk,
				}
			//для лотков и рифленки рамка не накладывается на фланец
			//if(params.stairType == "лотки" || params.stairType == "рифленая сталь"){
			//	isFlanFrame = false;
			//}


			//для средней тетивы входной лестницы убираем болты
			if (params.calcType == "vhod" && params.M > 1100) {
				if (framePar.isPltPFrame) {
					framePar.isFrameSideNoBolts2 = true;
					framePar.isPltPFrame = false;
				}
				else {
					framePar.isFrameSideNoBolts1 = true;
				}
			}
			if (par.holes[i].noBoltsIn) {
				if(turnFactor == 1) framePar.isFrameSideNoBolts2 = true;
				if(turnFactor == -1) framePar.isFrameSideNoBolts1 = true;
			}
			if (par.holes[i].noBoltsOut) {
				if (turnFactor == 1) framePar.isFrameSideNoBolts1 = true;
				if (turnFactor == -1) framePar.isFrameSideNoBolts2 = true;
			}
			if (par.holes[i].noBolts) {
				framePar.isFrameSideNoBolts1 = true;
				framePar.isFrameSideNoBolts2 = true;
			}
			if (par.holes[i].noBoltsFrame) {
				framePar.isFrameSideNoBolts1 = true;
				framePar.isFrameSideNoBolts2 = true;
			}
			//if (params.stairModel == "П-образная с площадкой" && framePar.isPltPFrame) {
			//	framePar.isFrameSideNoBolts1 = true;
			//}
			
			var frame = drawTreadFrame2(framePar);
			par.length = framePar.length;
			frame.position.x = par.holes[i].x;
			frame.position.y = par.holes[i].y;
			frames.add(frame);

			//для лотков и рифленки вместо отрисовки ступени отрисовываем площадки для рамок
			if ((framePar.isPltPFrame || framePar.isPltFrame) && (params.stairType == "лотки" || params.stairType == "рифленая сталь")) {
				var pltPar = {
					len: framePar.width,
					width: framePar.length,
					dxfBasePoint: dxfBasePoint,
					botMarshId: par.marshId,
					marshId: par.marshId,
					isP: true,
				}
				if (params.stairType == "лотки") pltPar.len -= 4 * 2; // 4 - толщина переднего и заднего фланца лотка				
				pltPar = drawPlatform2(pltPar);
				var platform = pltPar.treads;
				platform.position.x = frame.position.x - framePar.sideHolePosX;
				if (params.stairType == "лотки") platform.position.x += 4;
				platform.position.y = frame.position.y - framePar.profHeight / 2 - 0.01;
				if (params.stairType == "рифленая сталь"){
					platform.position.y = frame.position.y + framePar.profHeight / 2 - 1 + 0.01;
					//platform.position.y = frame.position.y + framePar.profHeight / 2 - params.treadThickness - params.treadThickness / 2 + 0.01;
				}
				platform.position.z = frame.position.z;
				if (par.isBigPlt) {
					platform.position.z = -(framePar.length / 2 - params.M / 2 + params.stringerThickness) * turnFactor;
				};
				if (params.calcType == "vhod") {
					platform.position.z += (framePar.length / 2 + 3 + 1) * turnFactor; //Не понятно, подогнано
					if (params.M <= 1100) platform.position.z = frame.position.z//-3 * turnFactor; 
					if (par.isBigPlt) {
						platform.position.z = (params.M / 2 - framePar.length / 2 - params.stringerThickness - 3) * turnFactor;
					};
					platform.position.y = frame.position.y + framePar.profHeight / 2 - (5 - params.treadThickness);
				}
				frames.add(platform);
			}
			
			//рамки между маршами для П-образной с площадкой
			if (params.stairModel == "П-образная с площадкой" && framePar.marshId == 1 && framePar.isPltFrame) {
			//if (params.stairModel == "П-образная с площадкой" && framePar.marshId == 1 && framePar.isPltFrame && params.marshDist > 200) {
				framePar.isPltFrameMarshDist = true;

				var frame = drawTreadFrame2(framePar);
				par.length = framePar.length;
				frame.position.z = (params.M + params.marshDist) / 2 * turnFactor;
				frame.position.x = par.holes[i].x;
				frame.position.y = par.holes[i].y;
				frames.add(frame);

				//для лотков и рифленки вместо отрисовки ступени отрисовываем площадки для рамок
				if ((framePar.isPltPFrame || framePar.isPltFrame) && (params.stairType == "лотки" || params.stairType == "рифленая сталь")) {
					var pltPar = {
						len: framePar.width,
						width: framePar.length,
						dxfBasePoint: dxfBasePoint,
						botMarshId: par.marshId,
						marshId: par.marshId,
						isP: true,
					}
					if (params.stairType == "лотки") pltPar.len -= 4 * 2; // 4 - толщина переднего и заднего фланца лотка
					pltPar = drawPlatform2(pltPar);
					var platform = pltPar.treads;
					platform.position.x = frame.position.x - framePar.sideHolePosX;
					if (params.stairType == "лотки") platform.position.x += 4;
					platform.position.y = frame.position.y - framePar.profHeight / 2 - 0.01;
					if (params.stairType == "рифленая сталь")
						platform.position.y = frame.position.y + framePar.profHeight / 2 - 1 + 0.01;
					platform.position.z = (params.M - params.stringerThickness) * turnFactor;
					frames.add(platform);
				}
			}
			
			par.dxfBasePoint.x += 150;
			i++; //пропускаем следующее отверстие
		}
	}
	
	return frames;

}//end of drawFrames


/**функция строит блок забежных ступеней. Функция возвращает мэш, состоящий из трех рамок, и координаты отверстий
* во фланцах для построения отверстий в тетивах/косоурах. 
* координаты отверстий во фланцах считаются от следующих базовых точек:
* http://6692035.ru/drawings/wndFramesHoles/1.jpg - для первой рамки
* http://6692035.ru/drawings/wndFramesHoles/2.jpg - для второй рамки
* http://6692035.ru/drawings/wndFramesHoles/3.jpg - для третьей рамки
* для третьей рамки базовая точка это угол фланца, а не номинальный угол рамки

*@params treadsObj.wndPar // параметры забежного учатска

*@returns framesPar.mesh //блок рамок
*@returns framesPar.wndFramesHoles // отверстия для крепления рамок на тетивы/косоуры
*/

function drawWndFrames2(par){

	var obj = new THREE.Object3D();

	var botMarshId = 1;
	if (par.turnId == "turn2" && params.stairModel == "П-образная трехмаршевая") botMarshId = 2;
	//par.marshId = 1;
	//if (params.stairModel == "П-образная с забегом") {
	//	if (par.turnId == "turn1") par.marshId = 1;
	//	if (par.turnId == "turn2") par.marshId = 2;
	//}
	if (par.turnId == "turn1") par.marshId = 1;
	if (par.turnId == "turn2") par.marshId = 2;

	var turnParams = calcTurnParams(botMarshId);
	var marshParams = getMarshParams(botMarshId);
	var nextMarshPar = getMarshParams(marshParams.nextMarshId)
	
	var wndSteps = calcWndSteps(par.wndPar);
			
	var dxfBasePoint0 = copyPoint(par.dxfBasePoint);

	//массив с координатами отверстий блока рамок
	var wndFramesHoles = new WndFramesHoles();
	
	//первая рамка
		par.frameId = 1;
		var wndFrame1 = drawWndFrame(par);
		//wndFrame1.mesh.position.x = params.nose;
		if (params.model == "ко") wndFrame1.mesh.position.x = params.nose;
		if (params.model == "лт") wndFrame1.mesh.position.x += wndSteps.frameFrontOffset;

		if(params.stairModel == "П-образная с забегом" && par.turnId == "turn2") wndFrame1.mesh.position.x = 20;
		if(params.riserType == "есть") wndFrame1.mesh.position.x += params.riserThickness;
		if (params.stairType == "рифленая сталь" || params.stairType == "лотки") wndFrame1.mesh.position.x = 0;		
		
		wndFrame1.mesh.position.y = -par.frameParams.flanThk.top - params.treadThickness;
	wndFrame1.mesh.position.z = calcStringerMoove(par.marshId).stringerOutMoove / 2 * turnFactor;
		obj.add(wndFrame1.mesh);

	// добавляем координаты отверстий первой рамки в общий объект
	wndFramesHoles.addFrameHoles(wndFrame1.wndFramesHoles);

	//вторая рамка
		par.frameId = 2;
		par.dxfBasePoint = newPoint_xy(dxfBasePoint0, 2000, 0);
		
		var wndFrame2 = drawWndFrame2(par);
	var posX = turnParams.turnLengthTop - params.stringerThickness - (params.model == "ко" ? (params.sideOverHang + calcStringerMoove(par.marshId).stringerOutMooveNext) : 0) - wndFrame2.frameParams.treadWidthY;
		wndFrame2.mesh.position.y = -par.frameParams.flanThk.top - params.treadThickness + marshParams.h_topWnd;
		wndFrame2.mesh.position.x = posX;
		
		obj.add(wndFrame2.mesh);

	
	// добавляем координаты отверстий первой рамки в общий объект
	wndFramesHoles.addFrameHoles(wndFrame2.wndFramesHoles);
	
	//третья рамка
		par.frameId = 3;
		par.dxfBasePoint = newPoint_xy(dxfBasePoint0, 5000, 0);
		var wndFrame3 = drawWndFrame(par);
		wndFrame3.mesh.rotation.y = -Math.PI / 2 * turnFactor;
		wndFrame3.mesh.position.y = -par.frameParams.flanThk.top - params.treadThickness + marshParams.h_topWnd * 2;
		wndFrame3.mesh.position.x = posX;

		//устанавливаем зад рамки вровень с внутренней линией нижнего марша
		wndFrame3.mesh.position.z = params.M / 2 * turnFactor; 
			
		if(params.model == "лт"){
			//устанавливаем зад рамки вровень с задом третьей забежной ступени
			wndFrame3.mesh.position.z += (5 + par.wndPar.params[3].stepWidthLow) * turnFactor;
			
			//смещаем рамку таким образом, чтобы передний свес был равен wndSteps.frameFrontOffset
			
			var treadSideGap = 5;		// зазор между торцем ступени и тетивой для ЛТ
			if(params.stairType == "рифленая сталь" || params.stairType == "лотки") treadSideGap = 0;
			
			//расчет ширины рамки на уровне края ступени с учетом фланцев
			var frameWidthLow1 = wndFrame3.frameParams.stepWidthLow + treadSideGap * Math.tan(wndFrame3.frameParams.edgeAngle);

			var mooveZ = par.wndPar.params[3].stepWidthLow - frameWidthLow1 - wndSteps.frameFrontOffset / Math.cos(wndFrame3.frameParams.edgeAngle);
			wndFrame3.mesh.position.z -= mooveZ * turnFactor;
			}
		if(params.model == "ко"){
			//устанавливаем переднюю кромку бокового фланца вровень с внешней плоскостью косоура нижнего марша
			wndFrame3.mesh.position.z += (40 - params.sideOverHang + par.frameParams.flanThk.top) * turnFactor
			//устанавливаем рамку в проектное положение
			wndFrame3.mesh.position.z += (wndSteps[1].in.topMarsh + wndSteps[2].in.topMarsh) * turnFactor;
			if (par.turnId == "turn1" && (params.stairModel == "П-образная с забегом" || (params.stairModel == "П-образная трехмаршевая" && params.stairAmt2 == 0)))
				if (!(params.stairModel == "П-образная с забегом" && params.stairAmt3 == 0))
					wndFrame3.mesh.position.z += (params.marshDist - 57 - 20 + (params.nose - 20)) * turnFactor
			}
		
		obj.add(wndFrame3.mesh);
		
		// добавляем координаты отверстий третьей рамки в общий объект
		wndFramesHoles.addFrameHoles(wndFrame3.wndFramesHoles);
		//возвращаемые параметры
		
		par.mesh = obj;		
		par.wndFramesHoles = wndFramesHoles;
		
	// координаты отверстий третьей рамки

	return par; 
}

/**функция строит рамки первой и третьей ступеней. Возвращает мэш рамки, некторые размеры и координаты отверстий во фланцах
* для отрисовки отверстий в тетивах/косоурах. Эскизы расположения базовых точек для координат отверстий
* см. в описании drawWndFrames2

*@params frameId //номер рамки
*@params treadsObj.wndPar.params[] // массив с параметрами ступеней

*@returns par.mesh // рамка
*@returns par.frameParams // размеры рамки
*@returns par.wndFramesHolesParams // координаты отверстий во фланцах
*/

function drawWndFrame(par){

	par.mesh = new THREE.Object3D();

	var marshParams = getMarshParams(par.wndPar.botMarshId);
	var nextMarshParams = getMarshParams(marshParams.nextMarshId);

	var treadParams = par.wndPar.params[par.frameId]

	var thk = {
		side: 4, //толщина боковых фланцев
		top: 4,
		front: 4,
		}
	var screwHoleRad = 4;
	
	//массив с координатами отверстий рамки
	par.wndFramesHoles = new WndFramesHoles();
		
//внешний контур

	if(params.model == "лт"){
		//размер рамки в сборе с учетом фланцев
		var stepWidthLow = 60; //так исторически сложилось
		if (params.stairType == "рифленая сталь" || params.stairType == "лотки") {
			stepWidthLow = treadParams.stepWidthLow
			if (par.marshPar.lastMarsh && par.marshPar.stairAmt == 0 && par.frameId == 3)
				stepWidthLow = 86;
		}
			
		var pathPar = {
			treadWidth: params.M - params.stringerThickness * 2 - thk.side * 2,
			edgeAngle: treadParams.edgeAngle,
			stepWidthLow: stepWidthLow,
		}
		
		//учитываем толщину бокового фланца
		pathPar.stepWidthLow += thk.side * Math.tan(treadParams.edgeAngle);
		//учитываем толщину переднего и заднего фланца
		pathPar.stepWidthLow -= thk.front / Math.cos(treadParams.edgeAngle) + thk.front;
			
		}	
	if(params.model == "ко"){
		var stepWidthLow = 40; //так исторически сложилось
		var stringerOutMoove = 0;
		if (par.frameId == 1) stringerOutMoove = calcStringerMoove(par.marshId).stringerOutMoove;
		if (par.frameId == 3) stringerOutMoove = calcStringerMoove(par.marshId).stringerOutMooveNext;
		pathPar = {
			treadWidth: params.M - params.sideOverHang * 2 - params.stringerThickness * 2 - thk.side * 2 - stringerOutMoove,
			edgeAngle: treadParams.edgeAngle,
			stepWidthLow: stepWidthLow, 
		}

		//при маленьком марше и большом боковом свесе, изменяем ширину 1 и 3 забежной рамки, чтобы нормально отрисовывались внутреннее отверстия
		if (params.M < 800) {
			if (params.M >= 700 && params.sideOverHang > 150) {
				if (par.frameId == 1) pathPar.edgeAngle = treadParams.edgeAngle;
				var isSideOutOffset = true;
			}
			if (params.M < 700 && params.sideOverHang > 75) {
				if (par.frameId == 1) pathPar.edgeAngle = treadParams.edgeAngle;
				var isSideOutOffset = true;
			}
		}

		pathPar.frameId = par.frameId;
		}

//размеры рамки с учетом фланцев
par.frameParams = {
	treadWidth: pathPar.treadWidth + thk.side * 2,
	edgeAngle: pathPar.edgeAngle,
	stepWidthLow: stepWidthLow,
	flanThk: thk,
	};



	var outLine = calcWndTread1Points(pathPar); //точки наружного контура
	var pathOut = outLine.points;

	//смещаем точки так, чтобы базовая точка была в середине передней грани
	for(var i=0; i<outLine.points.length; i++){
		if (par.frameId == 1){
			outLine.points[i].x -= pathPar.treadWidth / 2 * turnFactor;
			outLine.points[i].y += thk.front;
		}
		if (par.frameId == 3){
			outLine.points[i].x -= (pathPar.treadWidth - thk.front) * turnFactor;
			outLine.points[i].y += thk.front;
		}
	}
	
	
	
	//переворачиваем массив чтобы точки шли по часовой стрелке и отверстие корректно отрисовалось
	if(turnFactor == 1 && par.frameId == 1) outLine.points = outLine.points.reverse();
	if(turnFactor == -1 && par.frameId == 3) outLine.points = outLine.points.reverse();

	// отзеркаливаем рамку (3)
	if (par.frameId == 3){
		for(var i=0; i<outLine.points.length; i++){
			outLine.points[i].y *= -1;
		}
	}
	if (par.frameId == 3 && par.marshPar.lastMarsh && params.stairAmt3 == 0 && params.model == "лт") {
		var dy = params.lastWinderTreadWidth - 86
		outLine.points[0].y += dy;
		outLine.points[3].y += dy;
		outLine.sideOut.len = distance(outLine.points[0], outLine.points[1]);
		outLine.sideIn.len = distance(outLine.points[2], outLine.points[3]);
	}
	
	//создаем шейп
	var shapePar = {
		points: outLine.points,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		markPoints: true, //пометить точки в dxf для отладки
		};
		
	//параметры для рабочего чертежа
	shapePar.drawing = {
		name: "Рамка " + par.frameId + " забежной ступени",
		group: "wndFrames",
		baseLine: {
			p1: shapePar.points[0], 
			p2: shapePar.points[3],
		},
	}
	
	if(par.frameId == 3) {
		shapePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, treadParams.stepWidthHi);
		shapePar.drawing.baseLine = {
			p1: shapePar.points[1], 
			p2: shapePar.points[2],
		};
	}

	if (params.stairType != "рифленая сталь" && params.stairType != "лотки")
		var shape = drawShapeByPoints2(shapePar).shape;
	

//внутренний контур

	linesPar = {
		lines: [outLine.front, outLine.rear, outLine.sideOut],
		dist: -40,
		}
	if(turnFactor == -1 && par.frameId == 3) linesPar.lines = linesPar.lines.reverse();
	
	//параметры, чтобы параллельные линии строились в нужную сторону
	outLine.front.offsetBack = true;
	if(turnFactor == -1) outLine.sideOut.offsetBack = true;
	
	if (par.frameId == 3){
		outLine.front.offsetBack = false;
		outLine.rear.offsetBack = true;
	}
	
	var pathIn = offsetLines(linesPar);

	
	if(turnFactor == 1 && par.frameId == 1) pathIn = pathIn.reverse(); //переворачиваем массив чтобы точки шли по часовой стрелке и отверстие корректно отрисовалось

	if (params.stairType != "рифленая сталь" && params.stairType != "лотки") {
		//добавляем центральное отверстие
		var hole = new THREE.Path();
		var filletParams = {
			vertexes: pathIn,
			cornerRad: 10,
			dxfBasePoint: shapePar.dxfBasePoint,
			dxfPrimitivesArr: dxfPrimitivesArr,
			type: "path",
		}

		hole = fiiletPathCorners(filletParams);
		shape.holes.push(hole);

//Отверстия для шурупов

		if (par.frameId == 1 && turnFactor > 0) outLine.sideIn.offsetBack = true;
		if (par.frameId == 3) outLine.sideIn.offsetBack = turnFactor > 0 ? true : false;

		var lines = [outLine.rear, outLine.sideIn, outLine.front, outLine.sideOut];

		linesPar = {
			lines: lines,
			dist: -20,
			frameId: par.frameId,
		}

		var screwHoles = offsetLines(linesPar);

		//сдвигаем и запоминаем отверстия по краям, чтобы гайка не мешала прикручивать саморезы
		var holesReplace = [];
		var ang = calcAngleX1(screwHoles[0], screwHoles[3]);
		holesReplace.push([screwHoles[0], polar(screwHoles[0], ang, 20)]);
		holesReplace.push([screwHoles[3], polar(screwHoles[3], ang, -20)]);

		var ang = calcAngleX1(screwHoles[1], screwHoles[2]);
		holesReplace.push([screwHoles[1], polar(screwHoles[1], ang, 20)]);
		holesReplace.push([screwHoles[2], polar(screwHoles[2], ang, -20)]);


		var screwHolesPar = {
			points: screwHoles,
			frameId: par.frameId
		}

		screwHoles = getScrewHoles(screwHolesPar);

		//меняем крайние отверстия, которые сдвинули
		for (var i = 0; i < screwHoles.length; i++) {
			for (var j = 0; j < holesReplace.length; j++) {
				if (screwHoles[i].x == holesReplace[j][0].x && screwHoles[i].y == holesReplace[j][0].y) {
					screwHoles[i] = holesReplace[j][1];
					break;
				}
			}
		}

		screwHoles.forEach(function(hole){
			var screwId = "screw_6x32";
			var screwPar = {
				id: screwId,
				description: "Крепление ступеней",
				group: "Ступени"
			}
			var screw = drawScrew(screwPar).mesh;
			screw.position.x = hole.y;
			screw.position.y = screwPar.len / 2;
			screw.position.z = hole.x;			
			par.mesh.add(screw);
		});

		var holesPar = {
			holeArr: screwHoles,
			dxfBasePoint: shapePar.dxfBasePoint,
			shape: shape,
			holeRad: screwHoleRad,
		}

		addHolesToShape(holesPar);

		var extrudeOptions = {
			amount: thk.top,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};

		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var mesh = new THREE.Mesh(geom, params.materials.metal);
		mesh.rotation.x = -Math.PI / 2;
		mesh.rotation.z = -Math.PI / 2;
		par.mesh.add(mesh);
	}

	//фланцы
	
	var flanDxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, -200);
	var flanDxfDist = 100;

	// развернём линии для нормального присоединения фланцев
	if (par.frameId == 3){
		// модифицируем линии
		if (turnFactor < 0){
			outLine.front = {
				p1: outLine.points[1],
				p2: outLine.points[2],
				len: distance(outLine.points[2], outLine.points[1]),
				};
			outLine.rear = {
				p1: outLine.points[3],
				p2: outLine.points[0],
				len: distance(outLine.points[0], outLine.points[3]),
				};
			outLine.sideIn = {
				p1: outLine.points[0],
				p2: outLine.points[1],
				len: distance(outLine.points[0], outLine.points[1]),
				};
			outLine.sideOut = {
				p1: outLine.points[2],
				p2: outLine.points[3],
				len: distance(outLine.points[2], outLine.points[3]),
				};
		}
	}
	
	
		
	//боковой на внутренней стороне марша

	flanDxfBasePoint.y -= flanDxfDist;
	
	var flanParams = {
		line: outLine.sideIn,
		type: "1_hole",
		frameId: par.frameId,
		dxfBasePoint: flanDxfBasePoint,
	}

	flanParams = drawWndTreadFlan(flanParams);
	var sideInFlan = flanParams.mesh;
		
	par.mesh.add(sideInFlan);
	
// смещаем координаты отверстий с учётом смещения базовой точки фланца от базовой точки рамки
	var holeMooveX = thk.front; //фланец смещен от передней кромки на толщину переднего фланца
	if(par.frameId == 3) holeMooveX = 0; // базовая точка рамки это угол фланца
		
	var holeMooveY = -flanParams.flanHeight // базовая точка фланца на нижней стороне, а рамки - на верхней

	if (par.frameId == 1){
		//эскиз расположения базовой точки см. в описании функции drawWndFrames2
		for (i=0; i<flanParams.roundHoleCenters.length; i++){
			flanParams.roundHoleCenters[i].x += holeMooveX;
			flanParams.roundHoleCenters[i].y += holeMooveY;		
			}
		par.wndFramesHoles.botMarsh.in[par.frameId].push(...flanParams.roundHoleCenters);
	}
	
	if (par.frameId == 3){
		//эскиз расположения базовой точки см. в описании функции drawWndFrames2
		for (i=0; i<flanParams.roundHoleCenters.length; i++){
			flanParams.roundHoleCenters[i].x += holeMooveX;
			flanParams.roundHoleCenters[i].y += holeMooveY;		
		}
		par.wndFramesHoles.topMarsh.in[par.frameId].push(...flanParams.roundHoleCenters);
	}

	
	//боковой на внешней стороне марша

	flanDxfBasePoint.y -= flanDxfDist;
	
	var flanParams = {
		line: outLine.sideOut,
		type: "2_holes",
		frameId: par.frameId,
		dxfBasePoint: flanDxfBasePoint,
	}


	flanParams = drawWndTreadFlan(flanParams);
	var sideOutFlan = flanParams.mesh;
	par.mesh.add(sideOutFlan);

	// смещаем координаты отверстий с учётом смещения базовой точки фланца от базовой точки рамки

	if (par.frameId == 1){
		//смещения отверстий точно такие же как на внутренней стороне
		//эскиз расположения базовой точки см. в описании функции drawWndFrames2
		for (i=0; i<flanParams.roundHoleCenters.length; i++){
			flanParams.roundHoleCenters[i].x += holeMooveX;
			flanParams.roundHoleCenters[i].y += holeMooveY;		
			}
		par.wndFramesHoles.botMarsh.out[par.frameId].push(...flanParams.roundHoleCenters);
	}
	if (par.frameId == 3){
		//эскиз расположения базовой точки см. в описании функции drawWndFrames2
		//размер holeMooveX http://6692035.ru/drawings/wndFramesHoles/3-3.jpg 
		holeMooveX = outLine.sideOut.p2.y - outLine.sideIn.p1.y;
		if (turnFactor == -1) holeMooveX = outLine.sideOut.p1.y - outLine.sideIn.p2.y;
		
		for (i=0; i<flanParams.roundHoleCenters.length; i++){
			flanParams.roundHoleCenters[i].x += holeMooveX;
			flanParams.roundHoleCenters[i].y += holeMooveY;	
			}
		par.wndFramesHoles.topMarsh.out[par.frameId].push(...flanParams.roundHoleCenters);
	}


	//передний

	flanDxfBasePoint.y -= flanDxfDist;

	if (par.frameId == 1) {
		outLine.front.len += thk.side * 2;
		outLine.front.p1.x += thk.side * turnFactor;
		outLine.front.p2.x -= thk.side * turnFactor;
	}

	var flanParams = {
		line: outLine.front,
		type: "riser_holes",
		frameId: par.frameId,
		dxfBasePoint: flanDxfBasePoint,
	}
	if (params.stairType == "рифленая сталь" || params.stairType == "лотки") flanParams.flanHeight = 50;
	if (par.frameId == 3 && turnFactor > 0) flanParams.line = outLine.rear;
	//if (par.frameId == 3) flanParams.line = outLine.rear;

	flanParams = drawWndTreadFlan(flanParams);
	var frontFlan = flanParams.mesh;
	//костыль чтобы не было пересечения из-за погрешности округления
	//if (par.frameId == 1) frontFlan.position.z -= thk.side; 
	if (par.frameId == 3) frontFlan.position.z += 0.01 * turnFactor;
	par.mesh.add(frontFlan);

	//задний

	flanDxfBasePoint.y -= flanDxfDist;

	if (params.model == "лт") {
		if (par.frameId == 3) {
			if (turnFactor == -1) {
				outLine.rear.len += thk.side * 2;
				outLine.rear.p1.x += thk.side;
				outLine.rear.p2.x -= thk.side;
			}
			if (turnFactor == 1) {
				outLine.front.len += thk.side * 2;
				outLine.front.p1.x += thk.side;
				outLine.front.p2.x -= thk.side;
			}
		}

		var flanParams = {
			line: outLine.rear,
			type: "no_holes",
			frameId: par.frameId,
			dxfBasePoint: flanDxfBasePoint,
		}
		if (params.stairType == "рифленая сталь" || params.stairType == "лотки") flanParams.flanHeight = 50;
		if (par.frameId == 3 && turnFactor > 0) flanParams.line = outLine.front;
		flanParams = drawWndTreadFlan(flanParams);
		var rearFlan = flanParams.mesh;
		//костыль чтобы не было пересечения из-за погрешности округления
		if (par.frameId == 1) rearFlan.position.x += 0.01;
		par.mesh.add(rearFlan);
	};
	
	//сохраняем данные для спецификации
	var partName = "wndFrame" + par.frameId;
	var turnName = "прав."
	if(turnFactor == -1) turnName = "лев."
	
	if(typeof specObj !='undefined'){
		if(!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				name: "Рамка забежной ступени №" + par.frameId + " " + turnName,
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
				}
			}
		var name = Math.round(outLine.front.len) + "x" + Math.round(outLine.sideOut.len);
		var area = outLine.front.len * outLine.sideOut.len / 1000000 
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
	}
	par.mesh.specId = partName + name;
	
	return par;

} //end of drawWndFrame

/**функция строит рамку второй ступени.
*@params treadsObj.wndPar.params[] // массив с параметрами ступеней

*@returns par.mesh // рамка
*@returns par.frameParams // размеры рамки
*@returns par.wndFramesHoles // координаты отверстий во фланцах
*/

function drawWndFrame2(par){
	
	par.mesh = new THREE.Object3D();

	var marshParams = getMarshParams(par.wndPar.botMarshId);
	var nextMarshParams = getMarshParams(marshParams.nextMarshId);

	par.frameId = 2;
	var treadParams = par.wndPar.params[par.frameId]
	
	var thk = {
		side: 4, //толщина боковых фланцев
		top: 4,
		front: 4,
		}
	var screwHoleRad = 4;
	
	//массив с координатами отверстий рамки
	par.wndFramesHoles = new WndFramesHoles();

//внешний контур
	if(params.model == "лт"){
		var treadSideGap = 5;		// зазор между торцем ступени и тетивой для ЛТ
		if(params.stairType == "рифленая сталь" || params.stairType == "лотки") treadSideGap = 0;
		var pathPar = {
			angleX: treadParams.angleX,
			angleY: treadParams.angleY,
			treadWidthY: params.M - params.stringerThickness * 2 - thk.side * 2,
			treadWidthX: treadParams.treadWidthX + treadSideGap - thk.side * 2,
			innerOffsetY: 20, //константа
			innerOffsetX: 50, //константа
			}
		var deltaLenX = 0;
		if(params.stairType == "рифленая сталь" || params.stairType == "лотки"){
			//рассчет innerOffsetY
			pathPar.innerOffsetY = treadParams.innerOffsetY;
			//учитываем боковой фланец
			pathPar.innerOffsetY -= thk.side;
			//поправка чтобы задний фланец совпадал с задней линией ступени http://6692035.ru/drawings/wndFramesHoles/2-1.jpg
			var deltaLen = thk.side * Math.tan(treadParams.angleY / 2)
			pathPar.innerOffsetY -= deltaLen;
			
			//рассчет innerOffsetX
			pathPar.innerOffsetX = treadParams.innerOffsetX;
			//учитываем передний и задний фланец
			deltaLenX = thk.front / Math.sin(treadParams.angleX) + thk.front;
			//учитываем боковой фланец
			deltaLenX -= thk.side / Math.tan(treadParams.angleX);
			pathPar.innerOffsetX -= deltaLenX;

			}
		}
		
	if(params.model == "ко"){
		var pathPar = {
			angleX: treadParams.angleX,
			angleY: 30 / 180 * Math.PI, //константа
			treadWidthY: params.M - params.stringerThickness * 2 - thk.side * 2 - params.sideOverHang * 2 - calcStringerMoove(par.marshId).stringerOutMooveNext,
			treadWidthX: treadParams.treadWidthX, //пересчитывается ниже
			innerOffsetY: 0, //константа
		}
		//рассчитываем treadWidthX и innerOffsetX графическим методом
		//точки ступени - костыль, надо взять их из treadParams
		var p1 = {x: 0, y: -10}; //-10 подогнано
		var p2 = newPoint_xy(p1, treadParams.innerOffsetX - 15, 0); //-15 подогнано
		var p3 = polar(p1, Math.PI - treadParams.angleX, 100); //вспомогательная точка на передней линии
		var p4 = polar(p2, treadParams.angleY + Math.PI / 2, 100); //вспомогательная точка на задней линии
		//линия, параллельная передней линии
		var frontLineOffset = 40 + thk.front;
		var frontFrameLine = parallel(p1, p3, frontLineOffset);
		//вспомогательные точки на внутренней плоскости косоура
		var stringerP1 = { x: 0, y: params.sideOverHang + params.stringerThickness + thk.side };
		var stringerP2 = { x: 100, y: params.sideOverHang + params.stringerThickness + thk.side };
		//точки рамки
		var frameP1 = itercection(frontFrameLine.p1, frontFrameLine.p2, stringerP1, stringerP2);
		var frameP2 = itercection(p2, p4, stringerP1, stringerP2);
		//рассчет параметров рамки
		pathPar.treadWidthX = treadParams.treadWidthX - (p2.x - frameP2.x) - params.sideOverHang - params.stringerThickness - 4 - calcStringerMoove(par.marshId).stringerOutMoove;
		pathPar.innerOffsetX = frameP2.x - frameP1.x;
		if (params.riserType == "есть") {
			pathPar.treadWidthX += params.riserThickness;
			pathPar.innerOffsetX += params.riserThickness;
		}
	}
	par.frameParams = {
		treadWidthX: pathPar.treadWidthX,
		treadWidthY: pathPar.treadWidthY,
		angleX: pathPar.angleX,
		angleY: pathPar.angleY,
		innerOffsetX: pathPar.innerOffsetX,
		flanThk: thk,
	};
	
	var outLine = calcWndTread2Points(pathPar); //точки наружного контура
	var pathOut = outLine.points;

	if(params.model == "ко"){
		var flanLength = 80;
		// модфицируем массив точек
		outLine.points[4] = newPoint_xy(outLine.points[3], -flanLength * turnFactor, 0);
		outLine.points[5] = newPoint_xy(outLine.points[0], 0, flanLength);
		// модифицируем линии
		outLine.sideOut = {
			p1: outLine.points[0],
			p2: outLine.points[5],
			len: distance(outLine.points[0], outLine.points[5]),
			};
		outLine.sideOut2 = {
			p1: outLine.points[5],
			p2: outLine.points[4],
			len: distance(outLine.points[5], outLine.points[4]),
			};
		outLine.rear1 = {
			p1: outLine.points[4],
			p2: outLine.points[3],
			len: distance(outLine.points[3], outLine.points[4]),
			};
	}

	//смещаем точки так, чтобы базовая точка была в середине передней грани
	for(var i=0; i<outLine.points.length; i++){
		var offsetBaseX = params.M / 2 - (params.model == "ко" ? (params.sideOverHang + calcStringerMoove(par.marshId).stringerOutMoove) : 0) - params.stringerThickness - thk.side
		var offsetBaseY = pathPar.stepOffsetY - thk.side;

		outLine.points[i].x -= (offsetBaseX) * turnFactor;
		outLine.points[i].y += offsetBaseY;
		}
	//переворачиваем массив чтобы точки шли по часовой стрелке и отверстие корректно отрисовалось
	if(turnFactor == -1) outLine.points = outLine.points.reverse();
	
	//создаем шейп
	var shapePar = {
		points: outLine.points,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		//markPoints: true, //пометить точки в dxf для отладки
		};
		
	//параметры для рабочего чертежа
	shapePar.drawing = {
		name: "Рамка 2 забежной ступени",
		group: "wndFrames",
		baseLine: {
			p1: shapePar.points[0], 
			p2: shapePar.points[1],
		},
	}

	if (params.stairType != "рифленая сталь" && params.stairType != "лотки")
		var shape = drawShapeByPoints2(shapePar).shape;

	//внутренний контур
	var holeOffset = 40;

	var lines = [outLine.rear2, outLine.front2, outLine.sideOut];
	if(params.model == "ко") lines.push(outLine.sideOut2);
	lines.push(outLine.rear1);
	
	//параметры, чтобы параллельные линии строились в нужную сторону
	outLine.front2.offsetBack = true;
	if(turnFactor == -1) outLine.sideOut.offsetBack = true;
	
	linesPar = {
		lines: lines,
		dist: -40,
		isFrame2: true,
		}
	
	var pathIn = offsetLines(linesPar);
	
	if(turnFactor == -1) pathIn = pathIn.reverse(); //переворачиваем массив чтобы точки шли по часовой стрелке и отверстие корректно отрисовалось

	if (params.stairType != "рифленая сталь" && params.stairType != "лотки") {
		//добавляем центральное отверстие
		var hole = new THREE.Path();
		var filletParams = {
			vertexes: pathIn,
			cornerRad: 10,
			dxfBasePoint: par.dxfBasePoint,
			dxfPrimitivesArr: dxfPrimitivesArr,
			type: "path",
		}

		hole = fiiletPathCorners(filletParams);
		shape.holes.push(hole);

//Отверстия для шурупов

		outLine.front1.offsetBack = true;
		if (turnFactor == -1) outLine.front1.offsetBack = true;

		var lines = [outLine.rear2, outLine.front1, outLine.front2, outLine.sideOut];
		if (params.model == "ко") lines.push(outLine.sideOut2);
		lines.push(outLine.rear1);

		linesPar = {
			lines: lines,
			dist: -20,
			frameId: par.frameId,
		}

		var screwHoles = offsetLines(linesPar);

		//сдвигаем и запоминаем отверстия по краям, чтобы гайка не мешала прикручивать саморезы
		var holesReplace = [];
		var ang = calcAngleX1(screwHoles[0], screwHoles[3]);
		holesReplace.push([screwHoles[0], polar(screwHoles[0], ang, 20)]);
		holesReplace.push([screwHoles[4], polar(screwHoles[4], ang, -20)]);

		var ang = calcAngleX1(screwHoles[4], screwHoles[3]);
		holesReplace.push([screwHoles[3], polar(screwHoles[3], ang, -20)]);

		var ang = calcAngleX1(screwHoles[1], screwHoles[2]);
		holesReplace.push([screwHoles[1], polar(screwHoles[1], ang, 20)]);
		holesReplace.push([screwHoles[2], polar(screwHoles[2], ang, -20)]);

		var screwHolesPar = {
			points: screwHoles,
			frameId: par.frameId
		}

		screwHoles = getScrewHoles(screwHolesPar);

		//меняем крайние отверстия, которые сдвинули
		for (var i = 0; i < screwHoles.length; i++) {
			for (var j = 0; j < holesReplace.length; j++) {
				if (screwHoles[i].x == holesReplace[j][0].x && screwHoles[i].y == holesReplace[j][0].y) {
					screwHoles[i] = holesReplace[j][1];
					break;
				}
			}
		}

		screwHoles.forEach(function(hole){
			var screwId = "screw_6x32";
			var screwPar = {
				id: screwId,
				description: "Крепление ступеней",
				group: "Ступени"
			}
			var screw = drawScrew(screwPar).mesh;
			screw.position.x = hole.y;
			screw.position.y = screwPar.len / 2;
			screw.position.z = hole.x;
			par.mesh.add(screw);
		});

		var holesPar = {
			holeArr: screwHoles,
			dxfBasePoint: par.dxfBasePoint,
			shape: shape,
			holeRad: screwHoleRad,
		}

		addHolesToShape(holesPar);

		var extrudeOptions = {
			amount: thk.top,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};

		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var mesh = new THREE.Mesh(geom, params.materials.metal);
		mesh.rotation.x = -Math.PI / 2;
		mesh.rotation.z = -Math.PI / 2;
		par.mesh.add(mesh);
	}

	//фланцы

	var flanDxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, -200);
	var flanDxfDist = 100;
	
	
	//фланец крепления к внутреннему косоуру/тетиве

	var flanParams = {
		line: outLine.front1,
		type: "1_hole",
		frameId: 2,
		dxfBasePoint: flanDxfBasePoint,
		}
	flanParams = drawWndTreadFlan(flanParams);
	var frontFlan = flanParams.mesh;

	par.mesh.add(frontFlan);

// смещаем координаты отверстий с учётом позиции фланца в рамке

	var holeMooveX = pathPar.treadWidthX - flanParams.flanWidth + thk.side; // смещение фланца от внешней стороны рамки
	var holeMooveY = -flanParams.flanHeight // базовая точка фланца на нижней стороне, а рамки - на верхней отверстий точно такие же как на внутренней стороне
		//эскиз расположения базовой точки см. в описании функции drawWndFrames2
		for (i=0; i<flanParams.roundHoleCenters.length; i++){
			flanParams.roundHoleCenters[i].x += holeMooveX;
			flanParams.roundHoleCenters[i].y += holeMooveY;		
			}
		par.wndFramesHoles.topMarsh.in[2].push(...flanParams.roundHoleCenters);


	//передний

	flanDxfBasePoint.y -= flanDxfDist;
	
	var flanParams = {
		line: outLine.front2,
		type: "riser_holes",
		frameId: 2,
		dxfBasePoint: flanDxfBasePoint,
		}
	if(params.stairType == "рифленая сталь" || params.stairType == "лотки") flanParams.flanHeight = 50;
	flanParams = drawWndTreadFlan(flanParams);
	var frontFlan2 = flanParams.mesh;
	//костыль чтобы не было пересечения из-за погрешности округления
	frontFlan2.position.z -= 0.01 * turnFactor;
	
	par.mesh.add(frontFlan2);
	
	//фланец крепления к внешнему косоуру верхнего марша

	flanDxfBasePoint.y -= flanDxfDist;
	
	var flanParams = {
		line: outLine.rear1,
		type: params.model == "лт" ? "2_holes" : "1_hole",
		frameId: 2,
		dxfBasePoint: flanDxfBasePoint,
		}

	flanParams = drawWndTreadFlan(flanParams);
	var rearFlan = flanParams.mesh;

	par.mesh.add(rearFlan);
	
	// смещаем координаты отверстий с учётом позиции фланца в рамке
	var basePointStringer = itercection(outLine.rear1.p1, outLine.rear1.p2, outLine.sideOut.p1, outLine.sideOut.p2); // определяем координаты базовой точки на внешней стороне
	var distanceToBase = distance(basePointStringer, turnFactor > 0 ? outLine.rear1.p2 : outLine.rear1.p1);
	var holeMooveX = distanceToBase + thk.side; // смещение фланца от внешней стороны рамки
	var holeMooveY = -flanParams.flanHeight // базовая точка фланца на нижней стороне, а рамки - на верхней отверстий точно такие же как на внутренней стороне
		//эскиз расположения базовой точки см. в описании функции drawWndFrames2
		for (i=0; i<flanParams.roundHoleCenters.length; i++){
			flanParams.roundHoleCenters[i].x += holeMooveX;
			flanParams.roundHoleCenters[i].y += holeMooveY;		
			}
		par.wndFramesHoles.topMarsh.out[2].push(...flanParams.roundHoleCenters);
		
	
	//задний фланец

	flanDxfBasePoint.y -= flanDxfDist;
	
	var flanParams = {
		line: outLine.rear2,
		type: "no_holes",
		frameId: 2,
		dxfBasePoint: flanDxfBasePoint,
		}
	if(params.stairType == "рифленая сталь" || params.stairType == "лотки") flanParams.flanHeight = 50;
	
	flanParams = drawWndTreadFlan(flanParams);
	var rearFlan2 = flanParams.mesh;
	//костыль чтобы не было пересечения из-за погрешности округления
	rearFlan2.position.z += 0.01 * turnFactor;
	par.mesh.add(rearFlan2);
		
	//боковой маленький на задней стороне внутреннего угла рамки

	if(params.model == "лт"){
		flanDxfBasePoint.y -= flanDxfDist;

		outLine.sideIn.len += thk.side;
		if(turnFactor == 1) outLine.sideIn.p2.y -= thk.side;
		
		var flanParams = {
			line: outLine.sideIn,
			type: "no_holes",
			frameId: 2,
			dxfBasePoint: flanDxfBasePoint,
			}
		if(params.stairType == "рифленая сталь" || params.stairType == "лотки") flanParams.flanHeight = 50;
		
		flanParams = drawWndTreadFlan(flanParams);
		var sideInFlan = flanParams.mesh;

		par.mesh.add(sideInFlan);
	}
	
	//боковой 1 на внешней стороне марша

	flanDxfBasePoint.y -= flanDxfDist;
	
	var flanParams = {
		line: outLine.sideOut,
		type: params.model == "лт" ? "2_holes" : "1_hole",
		frameId: 2,
		dxfBasePoint: flanDxfBasePoint,
		}
	
	flanParams = drawWndTreadFlan(flanParams);
	var sideOutFlan1 = flanParams.mesh;

	par.mesh.add(sideOutFlan1);
	
	
	var distanceToBase = distance(basePointStringer, turnFactor > 0 ? outLine.sideOut.p1 : outLine.sideOut.p2);
	var holeMooveX = -(distanceToBase + thk.side + flanParams.flanWidth); // смещение фланца от внешней стороны рамки
	var holeMooveY = -flanParams.flanHeight // базовая точка фланца на нижней стороне, а рамки - на верхней отверстий точно такие же как на внутренней стороне
		//эскиз расположения базовой точки см. в описании функции drawWndFrames2
		for (i=0; i<flanParams.roundHoleCenters.length; i++){
			flanParams.roundHoleCenters[i].x += holeMooveX;
			flanParams.roundHoleCenters[i].y += holeMooveY;		
			}
		par.wndFramesHoles.botMarsh.out[2].push(...flanParams.roundHoleCenters);
		
	//сохраняем данные для спецификации
	var partName = "wndFrame2";
	var turnName = "прав."
	if(turnFactor == -1) turnName = "лев."
	if(typeof specObj !='undefined'){
		if(!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				name: "Рамка забежной ступени №2 " + turnName,
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
				}
			}
		var name = Math.round(outLine.front2.len) + "x" + Math.round(outLine.sideOut.len);
		var area = outLine.front2.len * outLine.sideOut.len / 1000000
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
	}
	par.mesh.specId = partName + name;
		
	return par;

} //end of drawWndFrame


function getMiddlePoint(p1, p2){
	var point = {
		x: (p1.x + p2.x) / 2,
		y: (p1.y + p2.y) / 2,
		}
	return point;
}//end of holeOffset


/** Фуниция отрисовывает линии, параллельные исходным и возвращает точки пересечения параллельных линий
*@params lines, dist
*@returns newPoints {array} - массив точек пересечения построенных линий
*/

function offsetLines(par){
	var newLines = [];
	var newPoints = [];
	
	//линии, параллельные исходным
	for (var i = 0; i < par.lines.length; i++) {
		var line = parallel(par.lines[i].p1, par.lines[i].p2, par.dist);
		if (par.lines[i].offsetBack) line = parallel(par.lines[i].p1, par.lines[i].p2, -par.dist);
		newLines.push(line);		
		}
	
	// точки пересечения параллельных линий
	for(var i=0; i < newLines.length; i++){
		if(i == newLines.length - 1)
			var point = itercection(newLines[i].p1, newLines[i].p2, newLines[0].p1, newLines[0].p2);
		else
			var point = itercection(newLines[i].p1, newLines[i].p2, newLines[i+1].p1, newLines[i+1].p2);
		
		newPoints.push(point);		
	}

	//при маленьком марше и большом боковом свесе второй забежной рамки, добавляем точки с внутренней стороны, чтобы нормально отрисовывались внутреннее отверстие
	if (par.isFrame2) {
		if (newPoints[0].y - 20 < par.lines[0].p2.y) {
			var line = parallel(par.lines[0].p2, par.lines[1].p1, -par.dist);
			var point1 = itercection(newLines[0].p1, newLines[0].p2, line.p1, line.p2);
			var point2 = itercection(newLines[1].p1, newLines[1].p2, line.p1, line.p2);

			newPoints.shift();
			newPoints.push(point1);
			newPoints.push(point2);
		}
	}
		
	return newPoints;
} //end of offsetLines

/**функция строит фланец забежной рамки по двум точкам и типу фланца.
*Параметр type может принимать следующие значения: 1_hole || 2_holes || no_holes || riser_holes
*mesh возвращается сразу повернутым на нужный угол и позиционируется по первой точке из исходных данных
*@params line: {p1, p2}, type
*@returns par.mesh
*/

function drawWndTreadFlan(par){
	par.mesh = new THREE.Object3D();

	if (turnFactor > 0 && par.frameId != 3){
		var tempPoint = copyPoint(par.line.p1);
		par.line.p1 = copyPoint(par.line.p2);
		par.line.p2 = copyPoint(tempPoint);
	}
	
	var flanHeight = 40;
	if(par.flanHeight) flanHeight = par.flanHeight;
	
	var holeOffset = 25;
	var thkTop = 4;
	
	var flanPar = {
		height: flanHeight,
		width: par.line.len,
		thk: 4,
		roundHoleCenters: [],
		dxfBasePoint: par.dxfBasePoint,
		}
	par.flanWidth = flanPar.width;
	par.flanThickness = flanPar.thk;
	par.flanHeight = flanHeight;
	
	//Отверстия под шурупы крепления подступенка
	if (par.type == "riser_holes" && params.riserType == "есть"){
		var center1 = {
			x: flanPar.width / 2,
			y: flanPar.height / 2,
			};
		var center2 = newPoint_xy(center1, flanPar.width / 2 - 50, 0);
		var center3 = newPoint_xy(center1, -(flanPar.width / 2 - 50), 0);
		flanPar.roundHoleCenters.push(center1, center2, center3);
		flanPar.holeRad = 4;
		flanPar.noBolts = true;

		var screwPar = {
			id: "screw_4x19",
			description: "Крепление забежных подступенков",
			group: "Ступени"
		}
	
		var screw = drawScrew(screwPar).mesh;
		screw.position.x = center1.x;
		screw.position.y = flanHeight / 2;
		screw.position.z = center1.y - 20;
		screw.rotation.x = Math.PI / 2;
		par.mesh.add(screw);

		var screw = drawScrew(screwPar).mesh;
		screw.position.x = center2.x;
		screw.position.y = flanHeight / 2;
		screw.position.z = center2.y - 20;
		screw.rotation.x = Math.PI / 2;
		par.mesh.add(screw);

		var screw = drawScrew(screwPar).mesh;
		screw.position.x = center3.x;
		screw.position.y = flanHeight / 2;
		screw.position.z = center3.y - 20;
		screw.rotation.x = Math.PI / 2;
		par.mesh.add(screw);

	}
	
	// Отверстие для крепления к каркасу
	if (par.type == "1_hole"){
		var center1 = {
			x: flanPar.width / 2,
			y: flanPar.height / 2,
			}
		flanPar.roundHoleCenters.push(center1);
	}
	if (par.type == "2_holes"){
		var center1 = {
			x: holeOffset,
			y: flanPar.height / 2,
			}
		var center2 = newPoint_xy(center1, flanPar.width - holeOffset * 2, 0)
		flanPar.roundHoleCenters.push(center1, center2);
	}
	
	flanPar.mirrowBolts = true;

	//параметры для рабочего чертежа
	if (!par.drawing) {
		flanPar.drawing = {
			name: "Фланец",
			group: "Flans",
		}
	}

	var flan = drawRectFlan2(flanPar).mesh;
	
	par.roundHoleCenters = flanPar.roundHoleCenters;
	par.mesh.add(flan);
	par.mesh.rotation.y = - Math.PI / 2 + calcAngleX1(par.line.p1, par.line.p2);
	par.mesh.position.x = par.line.p1.y;
	par.mesh.position.z = par.line.p1.x;
	par.mesh.position.y = -flanPar.height + thkTop;
	
	
	//сохраняем данные для спецификации
	var frameName = "frame" + par.frameId + "Flans";
	staircasePartsParams[frameName].push(Math.round(par.flanWidth))

	
	return par;

}//end of drawWndTreadFlan;

/**функция дополняет массив точек средними точками, если расстояние между соседними меньше заданного.
*@params points[], frameId
*@returns par.points[]
*/

function getScrewHoles(par){
	var middlePoints = [];
	var dist = 500;
	var minDist = 50;
	for (i=1; i<par.points.length; i++){
		if (i == par.points.length-1){
			var center = getMiddlePoint(par.points[i], par.points[0]);
			if (distance(par.points[i], par.points[0]) > dist) middlePoints.push(center);
		}
		else {
			var center = getMiddlePoint(par.points[i], par.points[i+1]);
			if (distance(par.points[i], par.points[i+1]) > dist) middlePoints.push(center);
		}
	}

	if (distance(par.points[0], par.points[1]) < minDist) par.points.shift();
	par.points = par.points.concat(middlePoints);
	
	return par.points;
}

/** функция отрисовывает вертикальную рамку крепления к верхнему перекрытию
*/

function drawTopFixFrame2(par){

	par.mesh = new THREE.Object3D();

	var frameFlanThickness = 8;
	var width = params.M - params.stringerThickness * 2;
	if (params.model == "ко") {
		width -= 2 * params.sideOverHang;
		console.log(par)
		par.marshId = 3;
		if (params.stairModel == "Прямая") par.marshId = 1;
		par.stringerOutMoove = calcStringerMoove(par.marshId).stringerOutMoove;
		width -= par.stringerOutMoove;
	}
	
	var height = params.h3;
	if(params.stairModel == "Прямая") height = params.h1;
	var angleThickess = 4;
	var anglesize = 40;
	par.basepoint = {x:0, y:0, z: 0,}

	var firstPosition_x = - anglesize / 2;
	var firstPosition_y = par.basepoint.y - 50;
	var firstPosition_z = -params.M / 2;
	if (params.model == "ко") {
		
		firstPosition_z += params.sideOverHang
		if(turnFactor == 1) firstPosition_z += par.stringerOutMoove
	}


	var deltaY = params.treadThickness / 2; //непонятный параметр

	// верхняя горизонт. полка

	var dxfPrimitivesArr0 = [];
	var shape = new THREE.Shape();

	var extrudeOptions = {
		amount: angleThickess,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
		};


	var p0 = { x: 0, y: 0 };
	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p1, 0, anglesize);
	addLine(shape, dxfPrimitivesArr0, p1, p2, dxfBasePoint);
	p1 = copyPoint(p2);
	p2 = newPoint_xy(p1, width, 0);
	addLine(shape, dxfPrimitivesArr0, p1, p2, dxfBasePoint);
	p1 = copyPoint(p2);
	p2 = newPoint_xy(p1, 0, -anglesize);
	addLine(shape, dxfPrimitivesArr0, p1, p2, dxfBasePoint);
	p1 = copyPoint(p2);
	p2 = newPoint_xy(p1, -width, 0);
	addLine(shape, dxfPrimitivesArr0, p1, p2, dxfBasePoint);

	var hole1 = new THREE.Path();
	var hole2 = new THREE.Path();
	var hole3 = new THREE.Path();
	var hole4 = new THREE.Path();
	var center1 = newPoint_xy(p0, 30, anglesize * 0.5);
	var center2 = newPoint_xy(p0, width - 30, anglesize * 0.5);
	var center3 = newPoint_xy(p0, width / 3, anglesize * 0.5);
	var center4 = newPoint_xy(p0, width - width / 3, anglesize * 0.5);
	addCircle(hole1, dxfPrimitivesArr0, center1, 3.5, dxfBasePoint);
	addCircle(hole2, dxfPrimitivesArr0, center2, 3.5, dxfBasePoint);
	addCircle(hole3, dxfPrimitivesArr0, center3, 3.5, dxfBasePoint);
	addCircle(hole4, dxfPrimitivesArr0, center4, 3.5, dxfBasePoint);

	shape.holes.push(hole1);
	shape.holes.push(hole2);
	shape.holes.push(hole3);
	shape.holes.push(hole4);
	var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

	topFrameType4 = new THREE.Mesh(geometry, params.materials.metal);

	topFrameType4.position.x = firstPosition_x;
	topFrameType4.position.y = firstPosition_y - params.treadThickness / 2 + height - angleThickess + deltaY;
	topFrameType4.position.z = firstPosition_z + params.stringerThickness;

	topFrameType4.rotation.x = -Math.PI * 0.5;
	topFrameType4.rotation.z = -Math.PI * 0.5;
	par.mesh.add(topFrameType4);

	// верхняя вертик. полка

	geometry = new THREE.BoxGeometry(angleThickess, anglesize - angleThickess, width);
	topFrameType4 = new THREE.Mesh(geometry, params.materials.metal);
	topFrameType4.position.x = firstPosition_x + anglesize - angleThickess / 2;
	topFrameType4.position.y = firstPosition_y + height - (anglesize + angleThickess) / 2;
	topFrameType4.position.z = firstPosition_z + width / 2 + params.stringerThickness;
	par.mesh.add(topFrameType4);

	// нижняя горизонт. полка

	geometry = new THREE.BoxGeometry(anglesize - angleThickess, angleThickess, width);
	topFrameType4 = new THREE.Mesh(geometry, params.materials.metal);
	topFrameType4.position.x = firstPosition_x + (anglesize - angleThickess) / 2;
	topFrameType4.position.y = firstPosition_y + angleThickess / 2;
	topFrameType4.position.z = firstPosition_z + width / 2 + params.stringerThickness;
	par.mesh.add(topFrameType4);


	// нижняя вертик. полка

	var shape = new THREE.Shape();

	var extrudeOptions = {
		amount: angleThickess,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};


	var p0 = { x: 0, y: 0 };
	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p1, 0, anglesize);
	addLine(shape, dxfPrimitivesArr0, p1, p2, dxfBasePoint);
	p1 = copyPoint(p2);
	p2 = newPoint_xy(p1, width, 0);
	addLine(shape, dxfPrimitivesArr0, p1, p2, dxfBasePoint);
	p1 = copyPoint(p2);
	p2 = newPoint_xy(p1, 0, -anglesize);
	addLine(shape, dxfPrimitivesArr0, p1, p2, dxfBasePoint);
	p1 = copyPoint(p2);
	p2 = newPoint_xy(p1, -width, 0);
	addLine(shape, dxfPrimitivesArr0, p1, p2, dxfBasePoint);

	/*отверстия*/
	var hole1 = new THREE.Path();
	var hole2 = new THREE.Path();
	var hole3 = new THREE.Path();
	var hole4 = new THREE.Path();
	var center1 = newPoint_xy(p0, 30, anglesize * 0.5);
	var center2 = newPoint_xy(p0, width - 30, anglesize * 0.5);
	var center3 = newPoint_xy(p0, width / 3, anglesize * 0.5);
	var center4 = newPoint_xy(p0, width - width / 3, anglesize * 0.5);
	addCircle(hole1, dxfPrimitivesArr0, center1, 3.5, dxfBasePoint);
	addCircle(hole2, dxfPrimitivesArr0, center2, 3.5, dxfBasePoint);
	addCircle(hole3, dxfPrimitivesArr0, center3, 3.5, dxfBasePoint);
	addCircle(hole4, dxfPrimitivesArr0, center4, 3.5, dxfBasePoint);

	shape.holes.push(hole1);
	shape.holes.push(hole2);
	shape.holes.push(hole3);
	shape.holes.push(hole4);
	var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	topFrameType4 = new THREE.Mesh(geometry, params.materials.metal);
	topFrameType4.position.x = firstPosition_x + anglesize;
	topFrameType4.position.y = firstPosition_y - params.treadThickness / 2 + deltaY;
	topFrameType4.position.z = firstPosition_z + params.stringerThickness;
	topFrameType4.rotation.y = -Math.PI * 0.5;

	par.mesh.add(topFrameType4);

	// фланцы боковые
	var flanParams = {
		height: height,
		width: 40,
		thk: 8,
		notchLength: 40,
		notchWidth: 5,
		material: params.materials.metal,
		dxfBasePoint: par.dxfBasePoint,
		dxfArr: dxfPrimitivesArr,
		}



	// левый фланец
	flanParams.side = "left"
	flanParams = drawTopFrameFlan(flanParams);
	topLeftFrameFlan = flanParams.mesh;
	topLeftFrameFlan.position.x = firstPosition_x;
	topLeftFrameFlan.position.y = firstPosition_y - params.treadThickness / 2 + deltaY + flanParams.notchWidth;
	topLeftFrameFlan.position.z = firstPosition_z + params.stringerThickness;
	par.mesh.add(topLeftFrameFlan);

	// правый фланец
	flanParams.side = "right"
	flanParams.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 150, 0);
	flanParams.noText = true;
	flanParams = drawTopFrameFlan(flanParams);
	topRightFrameFlan = flanParams.mesh;
	topRightFrameFlan.position.x = firstPosition_x;
	topRightFrameFlan.position.y = firstPosition_y - params.treadThickness / 2 + deltaY + flanParams.notchWidth;
	topRightFrameFlan.position.z = firstPosition_z + width;
	par.mesh.add(topRightFrameFlan);

	// вертикальные бруски

	var balkWidth = 40;
	var balkHeight = height - angleThickess * 2;
	var balkThickess = 20;

	// левый брусок
	var shape = new THREE.Shape();

	var extrudeOptions = {
		amount: balkThickess,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};


	/*внешний контур*/
	var p0 = { x: 0, y: 0 };
	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p1, 0, balkHeight);
	addLine(shape, dxfPrimitivesArr0, p1, p2, dxfBasePoint);
	p1 = copyPoint(p2);
	p2 = newPoint_xy(p1, balkWidth, 0);
	addLine(shape, dxfPrimitivesArr0, p1, p2, dxfBasePoint);
	p1 = copyPoint(p2);
	p2 = newPoint_xy(p1, 0, -balkHeight);
	addLine(shape, dxfPrimitivesArr0, p1, p2, dxfBasePoint);
	p1 = copyPoint(p2);
	p2 = newPoint_xy(p1, -balkWidth, 0);
	addLine(shape, dxfPrimitivesArr0, p1, p2, dxfBasePoint);


	var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	topFrameLeftBalk = new THREE.Mesh(geometry, params.materials.metal);

	topFrameLeftBalk.position.x = firstPosition_x + balkThickess;
	topFrameLeftBalk.position.y = firstPosition_y + angleThickess;
	topFrameLeftBalk.position.z = firstPosition_z + params.stringerThickness + frameFlanThickness + 90;
	topFrameLeftBalk.rotation.y = -Math.PI * 0.5;

	par.mesh.add(topFrameLeftBalk);

	// правый брусок
	var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	topFrameRightBalk = new THREE.Mesh(geometry, params.materials.metal);

	topFrameRightBalk.position.x = firstPosition_x + balkThickess;
	topFrameRightBalk.position.y = firstPosition_y + angleThickess;
	topFrameRightBalk.position.z = firstPosition_z + width + params.stringerThickness + frameFlanThickness - (balkWidth + 90);
	topFrameRightBalk.rotation.y = -Math.PI * 0.5;

	par.mesh.add(topFrameRightBalk);

	// фланцы фронтальные

	var flanPar = {
		holesAmt: 3,
		height: height - 10 * 2,
		width: (90 - 40) * 2 + balkWidth,
		dxfBasePoint: par.dxfBasePoint,
		side: 'left'
}
	
	//левый фланец
	flanPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, -(flanPar.height + 200));
	var flan = drawTopFrameFrontFlan(flanPar).mesh;
	flan.position.x = firstPosition_x + anglesize - angleThickess;
	flan.position.y = firstPosition_y + 10;
	flan.position.z = firstPosition_z + params.stringerThickness + frameFlanThickness + 40;
	flan.rotation.y = -Math.PI * 0.5;
	par.mesh.add(flan);
	
	//правый фланец
	flanPar.noText = true; //не нужна подпись
	flanPar.side = 'right' //не нужна подпись
	flanPar.dxfBasePoint = newPoint_xy(flanPar.dxfBasePoint, 300, 0);
	var flan = drawTopFrameFrontFlan(flanPar).mesh;
	flan.position.x = firstPosition_x + anglesize - angleThickess;
	flan.position.y = firstPosition_y + 10;
	flan.position.z = firstPosition_z + params.stringerThickness + frameFlanThickness + width - (flanPar.width + 40);
	flan.rotation.y = -Math.PI * 0.5;
	par.mesh.add(flan);

	if (params.model == "ко" && params.riserType == "нет")
		par.mesh.position.x += params.riserThickness;
	if (params.stairAmt3 === 0){
		if (params.model == "ко") par.mesh.position.x += params.lastWinderTreadWidth - 55;
		if (params.model == "лт") par.mesh.position.x += params.lastWinderTreadWidth - 45;
	}

	//сохраняем данные для спецификации
	var partName = "vertFrame";
	if (typeof specObj != 'undefined'){
		if (!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Вертикальная рамка",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
			}
		}
		var name = Math.round(width) + "x" + Math.round(height);
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}
	par.mesh.specId = partName + name;

	// addSpecIdToChilds(par.mesh, partName + name);
	
	return par;

} //end of drawTopFixFrame2()


/** @description функция отрисовки рамок ступеней
 * @params dxfBasePoint, holeDist, isPltFrame
 * @return mesh
 */
 
function drawTreadFrame2(par){
	
	
	// создаем меш
	var mesh = new THREE.Object3D();

	//задаем параметры в случае их отсутствия
	if(!par.dxfArr) par.dxfArr = dxfPrimitivesArr;
	if(!par.dxfBasePoint){
		par.dxfBasePoint = {x:0, y:0};
		dxfArr = [];
		}
		
	// рассчитываем параметры рамки
	calcFrameParams(par); //функция в файле drawFrames.js

	var marshParams = getMarshParams(par.marshId);

	/* данные из глобальных переменных
	params.materials.metal - материал
	*/

	/* данные, добавляемые в calcFrameParams()
	par.bridgeAmt - кол-во горизонтальных фланцев
	par.length - длина рамки
	par.framesAmt - количество рамок( для увеличенной площадки и широких маршей)
	par.overhang
	par.profHeight
	par.profWidth
	par.profile - профиль перемычек: 40x20, 40x40 или 60x30 (буква x английская)
	par.sideHolePosX
	par.width - ширина рамки
	*/

	//уменьшаем длину рамки, попадающую на соединительный фланец
	if (par.isFlanFrame) par.length -= params.stringerThickness * 2;

	//длина рамки между маршами для П-образной с площадкой
	if (par.isPltFrameMarshDist) par.length = params.marshDist;
	
	// создаем рамку
	var frame = new THREE.Object3D();

	if (params.stairType == "лотки") par.profHeight += params.treadThickness;
	
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

	if (params.stairType != "пресснастил" || par.isPltFrame) {		
		// ближний профиль рамки
		//для рифленки выводим в dxf контура пластин
		if (params.stairType == "лотки" || params.stairType == "рифленая сталь") {
			var dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, par.width - 2 * par.profWidth + 50);
			var p0 = { x: 0, y: 0 };
			var p1 = newPoint_xy(p0, 0, profPar.length);
			var p2 = newPoint_xy(p1, profPar.poleProfileY, 0);
			var p3 = newPoint_xy(p0, profPar.poleProfileY, 0);
			var shape = new THREE.Shape();
			addLine(shape, par.dxfArr, p0, p1, dxfBasePoint);
			addLine(shape, par.dxfArr, p1, p2, dxfBasePoint);
			addLine(shape, par.dxfArr, p2, p3, dxfBasePoint);
			addLine(shape, par.dxfArr, p3, p0, dxfBasePoint);
		}
		var pole = drawPole3D_4(profPar).mesh;
		pole.rotation.y = - toRadians(90);
		pole.position.x = par.profWidth;
		pole.position.y = - par.profHeight;
		pole.position.z = 0;
		frame.add(pole);

		// дальний профиль рамки
		//для рифленки выводим в dxf контура пластин
		if (params.stairType == "лотки" || params.stairType == "рифленая сталь") {
			dxfBasePoint = newPoint_xy(dxfBasePoint, 0, profPar.length + 50);
			var shape = new THREE.Shape();
			addLine(shape, par.dxfArr, p0, p1, dxfBasePoint);
			addLine(shape, par.dxfArr, p1, p2, dxfBasePoint);
			addLine(shape, par.dxfArr, p2, p3, dxfBasePoint);
			addLine(shape, par.dxfArr, p3, p0, dxfBasePoint);
		}
		var pole = drawPole3D_4(profPar).mesh;
		pole.rotation.y = - toRadians(90);
		pole.position.x = par.width;
		pole.position.y = - par.profHeight;
		pole.position.z = 0;
		frame.add(pole);
	}

	// определяем параметры бокового фланца
	var flanPar = {
		width: 40,
		height: par.width - 2 * par.profWidth,
		thk: 8,
		roundHoleCenters: [],
		holeOffset: 25,
		holeRad: 6.5,
		dxfBasePoint: par.dxfBasePoint,
	};
	
	if (params.stairType == "лотки") {
		par.profHeight -= params.treadThickness;
		flanPar.width = par.profHeight;
	}
	
	var flanSideWidth = flanPar.width;

	// определяем параметры первого отверстия фланца
	var hole1 = {
		x: flanPar.width / 2,
		y: flanPar.holeOffset
	};

	// определяем параметры второго отверстия фланца
	var hole2 = {
		x: flanPar.width / 2,
		y: flanPar.height - flanPar.holeOffset
	};

	if(params.stairType == "пресснастил" && !par.isPltFrame) {
		var marshPar = getMarshParams(par.marshId);
		flanPar.height = marshPar.a * 1.0;
		flanPar.thk = 3;
		par.holeDist = calcPresParams(marshPar.a).holeDist;
		hole1 = {
			x: 15,
			y: marshPar.a - 30,
		};
		
		hole2 = {
			x: 15,
			y: marshPar.a - (30 + par.holeDist),
		};
		flanPar.material = params.materials.inox;
		flanPar.cutAngle = true;
	}

	// добавляем параметры отверстий в свойства фланца
	flanPar.roundHoleCenters.push(hole1, hole2);	
	

	// создаем левый боковой фланец
	if (par.isPltPFrame && turnFactor == -1) flanPar.noBolts = true;
	if (par.isFrameSideNoBolts1) flanPar.noBolts = true;
	if (par.isPltFrameMarshDist) flanPar.noBolts = true;
	var sideFlan1 = drawRectFlan2(flanPar).mesh;
	sideFlan1.position.x = flanPar.height + par.profWidth;
	sideFlan1.position.y = - flanPar.width;
	if(params.stairType == "пресснастил" && !par.isPltFrame) sideFlan1.position.y += 5;
	sideFlan1.position.z = 0;
	sideFlan1.rotation.z = Math.PI / 2;
	frame.add(sideFlan1);

	// создаем правый боковой фланец
	flanPar.noBolts = false;
	if (par.isPltPFrame && turnFactor == 1) flanPar.noBolts = true;
	if (par.isFrameSideNoBolts2) flanPar.noBolts = true;
	if (par.isPltPFrame && turnFactor == -1 && !par.isPltFrameMarshDist) flanPar.noBolts = false;
	if (par.isPltFrameMarshDist) flanPar.noBolts = true;
	flanPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, -flanPar.height - 50);
	flanPar.mirrowBolts = true;
	
	var sideFlan2 = drawRectFlan2(flanPar).mesh;
	sideFlan2.rotation.z = Math.PI / 2;
	//переворачиваем фланец чтобы болты имели правильную ориентацию
	//sideFlan2.rotation.y = Math.PI;	
	//sideFlan2.position.x = par.profWidth;
	sideFlan2.position.x = sideFlan1.position.x
	sideFlan2.position.y = - flanPar.width;
	if(params.stairType == "пресснастил" && !par.isPltFrame) sideFlan2.position.y += 5;
	sideFlan2.position.z = par.length - flanPar.thk;
	
	frame.add(sideFlan2);

	// определяем параметры верхнего фланца
	var flanPar = {
		width: 25,
		height: par.width - 2 * par.profWidth,
		thk: 4,
		roundHoleCenters: [],
		holeOffset: 30,
		holeRad: 4,
		noBolts: true,
		dxfBasePoint: par.dxfBasePoint,
		hasScrews: true
	};
	if (params.stairType == 'дпк') {
		flanPar.hasScrews = false;
		flanPar.boltParams = {
			headType: "меб.",
			diam: 6,
			len: 35,
			offsetY: params.treadThickness,
			nutOffset: -10
		};
	}
	if(testingMode) {
		flanPar.hasScrews = false;
		flanPar.boltParams = null;
	}

	flanPar.dxfBasePoint = newPoint_xy(flanPar.dxfBasePoint, 0, flanPar.height + 150);

	if (!(params.stairType == "дпк" && par.isPltFrame)) {
		// определяем параметры первого отверстия фланца
		var hole1 = {
			x: flanPar.width / 2,
			y: flanPar.holeOffset,
		};

		// определяем параметры второго отверстия фланца
		var hole2 = {
			x: flanPar.width / 2,
			y: flanPar.height - flanPar.holeOffset,
		};

		// добавляем параметры отверстий в свойства фланца
		flanPar.roundHoleCenters.push(hole1, hole2);
	}

	//для дпк на площадке
	if (params.stairType == "дпк" && par.isPltFrame) {
		var holeOffset = flanPar.holeOffset;
		if (par.offsetHoleTopFlanDpk !== 0) holeOffset = par.offsetHoleTopFlanDpk;

		// определяем параметры первого отверстия фланца
		var hole = {
			x: flanPar.width / 2,
			y: flanPar.height - holeOffset,
		};
		// добавляем параметры отверстий в свойства фланца
		flanPar.roundHoleCenters.push(hole);


		//var threadStep = (marshParams.a - 5) / 2;
		var threadStep = 145 + 5; // 145 - ширина ступени дпк, 5 - зазор между ступенями
		var count = Math.floor((par.width - par.profWidth * 2 - holeOffset) / threadStep);
		for (var j = 0; j < count; j++) {
			hole = newPoint_xy(hole, 0, -threadStep);
			flanPar.roundHoleCenters.push(hole);
		}
		par.offsetHoleTopFlanDpk = threadStep - (par.width - holeOffset - threadStep * count + 5);
	}

	if(params.stairType == "пресснастил") par.bridgeAmt = 0;
	
	// создаем верхние фланцы
	if (par.bridgeAmt > 1){

		var bridgeSideOffset = 25;
		
		var topFlan1 = drawRectFlan2(flanPar).mesh;
		topFlan1.position.x = flanPar.height + par.profWidth;
		topFlan1.position.y = 0;
		topFlan1.position.z = bridgeSideOffset + flanPar.thk;
		topFlan1.rotation.x = toRadians(90);
		topFlan1.rotation.z = toRadians(90);
		frame.add(topFlan1);

		flanPar.dxfBasePoint = newPoint_xy(flanPar.dxfBasePoint, 0, flanPar.height + 50);
		var topFlan3 = drawRectFlan2(flanPar).mesh;
		topFlan3.position.x = flanPar.height + par.profWidth;
		topFlan3.position.y = 0;
		topFlan3.position.z = par.length - bridgeSideOffset - flanPar.thk - flanPar.width;
		topFlan3.rotation.x = toRadians(90);
		topFlan3.rotation.z = toRadians(90);
		frame.add(topFlan3);

		if (par.bridgeAmt > 2){
			var delta = (topFlan3.position.z - topFlan1.position.z) / (par.bridgeAmt - 1);
			for (var i = 2; i < par.bridgeAmt; i++){
				flanPar.dxfBasePoint = newPoint_xy(flanPar.dxfBasePoint, 0, flanPar.height + 50);
				var topFlan2 = drawRectFlan2(flanPar).mesh;
				topFlan2.position.x = flanPar.height + par.profWidth;
				topFlan2.position.y = 0;
				topFlan2.position.z = topFlan1.position.z + delta * (i - 1);
				topFlan2.rotation.x = Math.PI / 2;
				topFlan2.rotation.z = Math.PI / 2;
				frame.add(topFlan2);
				
			}//end of for
		}
	}
	if (par.bridgeAmt == 1){
		var topFlan1 = drawRectFlan2(flanPar).mesh;
		topFlan1.position.x = flanPar.height + par.profWidth;
		topFlan1.position.y = 0;
		topFlan1.position.z = par.length / 2 - flanPar.width / 2;
		topFlan1.rotation.x = toRadians(90);
		topFlan1.rotation.z = toRadians(90);
		frame.add(topFlan1);
	}
	
	//перемычки из профильной трубы
	if(par.profBridgeAmt) {
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

		if(par.width > 350) profPar.poleProfileY = 40;
		
		var profBridgeDist = par.length / (par.profBridgeAmt + 1);
		for(var i=0; i<par.profBridgeAmt; i++){
			var pole = drawPole3D_4(profPar).mesh;
			pole.rotation.x = 0//toRadians(90);
			pole.rotation.z = 0//toRadians(90);
			
			pole.position.x = par.profWidth;
			pole.position.y = -profPar.poleProfileY
			pole.position.z = -profPar.poleProfileZ / 2 + profBridgeDist * (i+1);
			frame.add(pole);
		}
		
		
	}
	

	//сохраняем данные для спецификации
	var partName = "treadFrame";
	if (typeof specObj != 'undefined' && params.stairType != "пресснастил" && params.stairType != "рифленая сталь" && params.stairType != "лотки" ){
		if (!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Рамка прямая",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
			}
		}
		var name = Math.round(par.length) + "x" + Math.round(par.width) + "x" + par.profHeight;
		if(par.profBridgeAmt > 0) name += " перемычки " + profPar.poleProfileY + "х" + profPar.poleProfileZ + " " + par.profBridgeAmt + " шт.";
		else name += " без перемычек";
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}

	// позиционируем рамку
	frame.position.x = - par.sideHolePosX;
	frame.position.y = flanSideWidth / 2;
	frame.position.z = -par.length / 2 + calcStringerMoove(par.marshId).stringerOutMoove / 2 * turnFactor;
	if (par.largePlt && par.isPltFrame){
		if (params.turnSide == 'левое'){
			frame.position.z -= par.deltaZ / 2;
		}else{
			frame.position.z += par.deltaZ / 2;
		}
	}
	
	mesh.add(frame);

	mesh.specId = partName + name;

	return mesh;

} //end of drawTreadFrame2

//боковой фланец вертикальной рамки крепленя к перекрытию

function drawTopFrameFlan(par){
	var shape = new THREE.Shape();
	var flanLength = par.height - par.notchWidth * 2;
	var flanWidth = par.width;
	var notchLength = par.notchLength;
	var notchWidth = par.notchWidth;
	var dxfBasePoint = par.dxfBasePoint;
	par.mesh = new THREE.Object3D();

	/*внешний контур*/

	var p1 = { x: 0, y: 0 }
	var p2 = newPoint_xy(p1, flanWidth - notchWidth, 0) // params basePoint, deltaX, deltaY
	var p3 = newPoint_xy(p2, 0, notchLength)
	var p4 = newPoint_xy(p3, notchWidth, 0)
	var p5 = newPoint_xy(p4, 0, flanLength - 2 * notchLength)
	var p6 = newPoint_xy(p5, -notchWidth, 0)
	var p7 = newPoint_xy(p6, 0, notchLength)
	var p8 = newPoint_xy(p1, 0, flanLength)

	addLine(shape, par.dxfArr, p1, p2, dxfBasePoint);
	addLine(shape, par.dxfArr, p2, p3, dxfBasePoint);
	addLine(shape, par.dxfArr, p3, p4, dxfBasePoint);
	addLine(shape, par.dxfArr, p4, p5, dxfBasePoint);
	addLine(shape, par.dxfArr, p5, p6, dxfBasePoint);
	addLine(shape, par.dxfArr, p6, p7, dxfBasePoint);
	addLine(shape, par.dxfArr, p7, p8, dxfBasePoint);
	addLine(shape, par.dxfArr, p8, p1, dxfBasePoint);

	var rad = 6.5;
	var clockwise = true;
	var offsetY = 30 - notchWidth;
	var distOval = 40;
	if (par.height < 160) distOval -= 10;//уменьшаем длину овального отверстия при малой высоте фланца, чтобы небыло пересечения отверстий		
	var center1 = { x: 20, y: offsetY + distOval / 2 };
	var center2 = { x: 20, y: flanLength - offsetY - distOval / 2 };

	//нижнее отверстие
	addOvalHoleY(shape, par.dxfArr, center1, rad, distOval, dxfBasePoint, clockwise)
	//верхнее отверстие
	addOvalHoleY(shape, par.dxfArr, center2, rad, distOval, dxfBasePoint, clockwise)
	
	if(!par.noText){
		var text = "Фланец верхней рамки"
		var textHeight = 30;
		var textBasePoint = newPoint_xy(dxfBasePoint, 20, -150.0);
		addText(text, textHeight, par.dxfArr, textBasePoint);
		}
		
	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1,
	}

	var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geometry, par.material);
	par.mesh.add(mesh)
	
	if(typeof anglesHasBolts != "undefined" && anglesHasBolts){ //глобальная переменная
		var boltPar = {
			diam: boltDiam,
			len: boltLen,
			}
		var bolt = drawBolt(boltPar).mesh;
		bolt.rotation.x = Math.PI / 2;
		if(par.side == "right") bolt.rotation.x = -Math.PI / 2;
		bolt.position.x = flanWidth / 2;
		bolt.position.y = 50 - 5;
		bolt.position.z = boltPar.len / 2 - boltBulge;
		if(par.side == "right") bolt.position.z = -boltPar.len / 2 + boltBulge + 8
		par.mesh.add(bolt)
		
		var bolt2 = drawBolt(boltPar).mesh;
		bolt2.rotation.x = bolt.rotation.x;
		bolt2.position.x = bolt.position.x;
		bolt2.position.y = flanLength - 50 + 5; 
		bolt2.position.z = bolt.position.z;
		par.mesh.add(bolt2)
			
		}
		
	return par;
}

// фронтальный фланец вертикальной рамки крепленя к перекрытию

function drawTopFrameFrontFlan(par) {

	par.mesh = new THREE.Object3D();
	
	var shape = new THREE.Shape();

	/*внешний контур*/

	var p0 = { x: 0, y: 0 };
	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p1, par.width, 0);
	addLine(shape, dxfPrimitivesArr, p1, p2, par.dxfBasePoint);
	p1 = copyPoint(p2);
	p2 = newPoint_xy(p1, 0, par.height);
	addLine(shape, dxfPrimitivesArr, p1, p2, par.dxfBasePoint);
	p1 = copyPoint(p2);
	p2 = newPoint_xy(p1, -par.width, 0);
	addLine(shape, dxfPrimitivesArr, p1, p2, par.dxfBasePoint);
	p1 = copyPoint(p2);
	p2 = newPoint_xy(p1, 0, -par.height);
	addLine(shape, dxfPrimitivesArr, p1, p2, par.dxfBasePoint);

	/*отверстия*/
	var fixPar = getFixPart(0, 'topFloor');
	var holeDist = (par.height - 40 * 2) / (par.holesAmt - 1);
	var holeRad = 7.5;
	var center = newPoint_xy(p0, 15, 40);

	for (i = 0; i < par.holesAmt; i++){
		var hole1 = new THREE.Path();
		addCircle(hole1, dxfPrimitivesArr, center, holeRad, par.dxfBasePoint);
		shape.holes.push(hole1);

		//болты крепления к верхнему перекрытию
		if (typeof isFixPats != "undefined" && isFixPats && par.side == 'left' && (i == 0 || i == par.holesAmt - 1)) { //глобальная переменная
			if (fixPar.fixPart !== 'нет' && !testingMode) {
				var fix = drawFixPart(fixPar).mesh;
				fix.position.x = center.x;
				fix.position.y = center.y;
				fix.position.z = 8 * (1 - turnFactor) * 0.5;
				fix.rotation.x = Math.PI / 2 * turnFactor;
				par.mesh.add(fix);
			}
		}

		center = newPoint_xy(center, 0, holeDist);
	}

	center = newPoint_xy(p0, par.width - 15, 40);
	for (i = 0; i < par.holesAmt; i++){
		var hole1 = new THREE.Path();
		addCircle(hole1, dxfPrimitivesArr, center, holeRad, par.dxfBasePoint);
		shape.holes.push(hole1);

		//болты крепления к верхнему перекрытию
		if (typeof isFixPats != "undefined" && isFixPats && par.side == 'right' && (i == 0 || i == par.holesAmt - 1)) { //глобальная переменная
			if (fixPar.fixPart !== 'нет' && !testingMode) {
				var fix = drawFixPart(fixPar).mesh;
				fix.position.x = center.x;
				fix.position.y = center.y;
				fix.position.z = 8 * (1 - turnFactor) * 0.5;
				fix.rotation.x = Math.PI / 2 * turnFactor;
				par.mesh.add(fix);
			}
		}

		center = newPoint_xy(center, 0, holeDist);
	}
	if(!par.noText){
		var text = "Фронтальный фланец верхней рамки"
		var textHeight = 30;
		var textBasePoint = newPoint_xy(par.dxfBasePoint, 20, -150.0);
		addText(text, textHeight, dxfPrimitivesArr, textBasePoint);
		}
		
	var extrudeOptions = {
		amount: 8,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
		};

	var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geometry, params.materials.metal);
	par.mesh.add(mesh);
	
	return par;
}

/** функция создаем пустой объект с координатами отверстий блока забежных рамок
*@constructor
*/

function WndFramesHoles(){

	this.botMarsh = {};
	this.topMarsh = {};
	
	
	//формируем внутреннюю структуру для верхнего и нижнего маршей
	for(var marshName in this){		
		this[marshName] = {
			in: {}, //отверстия на внутренней стороне
			out: {},
			};
		for(var side in this[marshName]){
			this[marshName][side] = {
				1: [], //отверстия первой рамки
				2: [],
				3: [],
				};
			};
		};
	
	//добавление отверстий рамки
	this.addFrameHoles = function(holes){
		for(var marshName in holes){
			for(var side in holes[marshName]){
				for(var frameId in holes[marshName][side]){
					for(var i=0; i < holes[marshName][side][frameId].length; i++){
						var pt = holes[marshName][side][frameId][i];
						this[marshName][side][frameId].push(pt);
						}					
					}
				}
			}
		}
}



function calcPresParams(width){
	var par = {};
	
	//расстояние между отверстиями
	par.holeDist = 120;
	if(width == 260) par.holeDist = 150;
	if(width == 270) par.holeDist = 150;
	if(width == 295) par.holeDist = 180;
	if(width == 305) par.holeDist = 180;
	
	return par;
}


/**
 * Устанавливает параметры для рамок под ступенями для отрисовки отверстий в тетивах/косоурах
 * а также для построения рамок
 * Рамки ступени 40х20 при ширине марша до 1050мм и 60х30 если больше 1050мм
 * Особенности конструктива лестниц с дпк:
 * кол-во перемычек рамок ступеней 3 шт если ширина марша до 1000мм и 4 шт если больше
 * @params: holeDist, isPltFrame,
 */

function calcFrameParams(par){
	/*параметры:
	holeDist либо width
	isPltFrame - является ли рамкой площадки
	marshId
	*/

	var marshParams = getMarshParams(par.marshId);

	//длина рамки
	par.length = params.M - params.stringerThickness * 2;
	
	if (params.calcType == 'vhod') {
		var stringerThickness = params.stringerThickness;
		var treadWidth = params.M - 2 * stringerThickness;
		var treadSideOffset = 0;
		var midStringerAmt = Math.floor(treadWidth / 1090);
		var midstringerBetweenLen = (treadWidth - stringerThickness * midStringerAmt) / (midStringerAmt + 1);
		if (midStringerAmt > 0) {
			par.length = midstringerBetweenLen;
			par.framesAmt = midStringerAmt + 1;
		}
	}
	
	if (par.isLargePlt && params.platformTop == 'увеличенная') {
		par.length = params.platformWidth_3 - params.M - params.stringerThickness;
		par.framesAmt = 0;
	}
	
	if (params.model == "ко") par.length -= params.sideOverHang * 2 + calcStringerMoove(par.marshId).stringerOutMoove;

	//профиль
	par.profWidth = 20;
	par.profHeight = 40;

	if(par.isPltFrame || par.length > 1020){
		par.profWidth = 30;
		par.profHeight = 60;
		}
	if(params.stairType == "рифленая сталь" || params.stairType == "лотки"){
		par.profWidth = params.treadThickness;
		par.profHeight = 50;
		if(par.length > 1020) par.profHeight = 60;
		};

	if(params.stairType == "пресснастил" && !par.isPltFrame) par.profWidth = 0;

	par.profile = par.profHeight + "x" + par.profWidth;
	
	//расстояние от центра отверстия до края рамки
	par.sideHolePosX = par.profWidth + 25; //25 - константа
	if(params.stairType == "пресснастил" && !par.isPltFrame) par.sideHolePosX = 30;
	
	//свес покрытия над рамкой
	if (params.model == "лт") {
		par.overhang = 20.0;
		//увеличиваем свес чтобы передний болт не пересекался с болтом уголка крепления верхнего марша
        if (par.isPltFrame && !marshParams.lastMarsh && par.marshId !== 0) par.overhang = 40;
		
		if(params.stairType == "дпк") par.overhang = 10;		
		if(params.stairType == "рифленая сталь" || params.stairType == "лотки" || params.stairType == "пресснастил") par.overhang = 0.0;
		if(params.stairType == "пресснастил" && par.isPltFrame) par.overhang = 20;
		}
	if (params.model == "ко") par.overhang = 0.0;
	
	//ширина рамки и расстояние между отверстиями
	
	//если задано расстояние между отверстиями - расчет при отрисовке рамок
	if(par.holeDist){
		par.width = par.holeDist + par.sideHolePosX * 2;
		}
	//eсли не задано расстояние между отверстиями - расчет для построения тетив/косоуров
	if(!par.holeDist){
		if (params.model == "лт") par.width = marshParams.a - par.overhang * 2;
		if (params.model == "ко") {
			par.width = marshParams.b;
			if(params.riserType == "есть") par.width -= params.riserThickness;
		}
		
		//округляем ширину рамок с заданной точностью. Для лотков и рифленки округляется сам размер ступени в функции calcTreadWidth
		if(params.stairType != "рифленая сталь" && params.stairType != "лотки"){
			var frameWidthStep = 20; //точность округления ширины рамок
			par.width = Math.floor(par.width / frameWidthStep) * frameWidthStep;
		}
		par.holeDist = par.width - par.sideHolePosX * 2;
	}
	
	//координаты отверстий
	if(params.model == "лт"){
		par.stepHoleX1 = par.sideHolePosX + 5.0 + par.overhang;
		par.stepHoleX2 = par.stepHoleX1 + par.width - par.sideHolePosX * 2;
	}
	
	if(params.model == "ко"){
		par.stepHoleX1 = par.sideHolePosX;
		par.stepHoleX2 = par.width - par.sideHolePosX;
	}

	//кол-во перемычек
	par.bridgeAmt = 2;	
	if (par.isPltFrameMarshDist && params.marshDist < 200) par.bridgeAmt = 0;

	par.profBridgeAmt = 0;	
	if (params.model == "лт" && params.M > 900) par.profBridgeAmt = 1;
	if (params.model == "ко" && (params.M - params.sideOverHang * 2) > 900) par.profBridgeAmt = 1;

	
	if(params.stairType == "дпк") {
		if (par.length < 150) par.bridgeAmt = 1;
		if (par.length > 500) par.bridgeAmt = 2;
		if (par.length > 1000.0) par.bridgeAmt = 3;
		//if (par.isPltFrame) par.bridgeAmt += 1;
		if (par.isPltFrameMarshDist) {
			par.bridgeAmt = 0;
			if(params.marshDist > 200) par.bridgeAmt = 2;
		}
		
		par.profBridgeAmt = 1;
		if (par.length > 1000.0) par.profBridgeAmt = 2;
		if (par.length < 500.0) par.profBridgeAmt = 0;
	}
	
	if(params.stairType == "рифленая сталь" || 
		params.stairType == "лотки" || 
		params.stairType == "стекло") par.bridgeAmt = 0;
		
	return par;
	
} //end of calcFrameParams

