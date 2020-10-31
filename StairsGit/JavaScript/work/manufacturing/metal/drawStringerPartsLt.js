/*** НИЖНИЕ УЗЛЫ ***/


/**
 * первый подъем если внизу перекрытие
 */

function drawBotStepLt_floor(par) {

	/*ТОЧКИ КОНТУРА*/

	var h_1 = calcFirstRise(); //подъем первой ступени
	var p0 = newPoint_xy(par.zeroPoint, 0, par.h - h_1 + par.stringerLedge);

	var p1 = newPoint_xy(p0, 0, h_1);
	if (params.calcType == 'console') p1.y += par.addStringerWidth;
	// проступь
	var p2 = newPoint_xy(p1, par.b, 0);
		
	if(par.stairAmt > 0){

		// срез передней кромки
		var p3 = newPoint_xy(p0, 0.0, 100.0);
		var p4 = itercection(p3, polar(p3, Math.PI * (5 / 3), 100), p0, polar(p0, 0, 100));//точка пересечения переднего среза и нижней линии

		// нижний край тетивы
		var p20 = newPoint_xy(p1, par.b + (par.stringerWidth / Math.sin(par.marshAng)), 0.0)// первая точка на нижней линии марша
		if (params.stringerType == "прямая") p20.x -= par.b;
		var p21 = polar(p20, par.marshAng, 100.0); // вторая точка на нижней линии

		var botLineP1 = itercection(p0, polar(p0, 0, 100), p20, p21);       // точка пересчечения нижнего края и нижней линии марша
		if (params.stringerType == "ломаная") {
			botLineP1 = newPoint_xy(p0, par.b + par.stringerWidth, 0.0);
			var botLineP2 = newPoint_xy(p2, par.stringerWidth, -par.stringerWidth + par.h);
			if(par.stairAmt > 1 || (par.stairAmt == 1 && par.key == "out")) par.pointsShape.push(botLineP2);
		}

		var isShortBotLine = false;
		if(botLineP1.x - p4.x < 100) {
			botLineP1.x = p4.x + 100;
			//дополнительная наклонная линия внизу
			//var botLineP00 = itercection(botLineP1, polar(botLineP1, Math.PI * 0.4, 100), p20, p21);
			//par.pointsShape.push(botLineP00);
			isShortBotLine = true;
			}

		//модифицируем точки для промежуточного косоура
		if(par.isMiddleStringer){
			p1 = newPoint_xy(p1, par.treadFrontOverhang, -params.treadThickness - par.stringerLedge);
			p1.filletRad = 0;
			p3 = newPoint_xy(p3, par.treadFrontOverhang, -params.treadThickness - par.stringerLedge);
			p4 = itercection(p3, polar(p3, Math.PI * (5 / 3), 100), p0, polar(p0, 0, 100));//точка пересечения переднего среза и нижней линии
			}
		//модифицируем точки если есть пригласительыне ступени
		if(params.startTreadAmt > 0){
			var frontOffset = params.nose + par.stringerLedge;
			p1 = newPoint_xy(p1, frontOffset, -params.treadThickness - par.stringerLedge);
			p1.filletRad = 0;
			p3.x += frontOffset;
			}
		
		//модифицируем точки для маленького подъема ступени
		if(params.h1 < 150) p3 = {x: p1.x, y: botLineP1.y}
		

		//сохраняем точки контура
		par.pointsShape.push(botLineP1);
		if(params.h1 >= 150) par.pointsShape.push(p4);
		par.pointsShape.push(p3);
		par.pointsShape.push(p1);
		
		//сохраняем точку для расчета длины
		par.keyPoints.botPoint = copyPoint(p3);
		if(params.h1 >= 150) par.keyPoints.botPoint = copyPoint(p4);

	}

	if(par.stairAmt == 0){
		var botLineP1 = newPoint_xy(p0, 200, 0)
		par.pointsShape.push(botLineP1);
		par.pointsShape.push(p0);
		par.pointsShape.push(p1);
		//сохраняем точку для расчета длины
		par.keyPoints.botPoint = copyPoint(p0);
		}

	
	/*ОТВЕРСТИЯ*/
	if (params.calcType !== 'console') {
		var parFrames = { marshId: par.marshId };
		calcFrameParams(parFrames); // рассчитываем параметры рамки

		// отверстия под нижний крепежный уголок
		center1 = newPoint_xy(botLineP1, -100, 35);
		if (params.stringerType == "ломаная") center1 = newPoint_xy(p0, 100, 35);
		if (par.h < 180 && params.stairFrame == "есть") {
			center1 = newPoint_xy(p0, parFrames.width / 2 + params.nose - 30, 35)
		}
		if (params.bottomAngleType === "регулируемая опора") {
			center1 = newPoint_xy(botLineP1, -100, 50);
			//если есть рамки под ступенями, тогда чтобы не было пересечения уголка с рамкой, уголок располагаем по середине рамки
			if (params.stairFrame == "есть" && params.botFloorType == "чистовой")
				center1 = newPoint_xy(p0,
					par.b / 2 - 30 + 20 - 10,
					50); //30-расстояние между отверстиями уголка, 20 - расстояние от края ступени до рамки
		}
		if (isShortBotLine) center1 = newPoint_xy(center1, 20, 0);

		//не допускаем пересечения уголка и рамки/уголка ступени
		var angleCorner = newPoint_xy(p2, 0, -params.treadThickness - par.stringerLedge)
		var nose1 = params.a1 -
			params.b1; //вместо params.nose чтобы учесть дпк и пресснастил, где params.nose отсутствует

		if (center1.x - angleCorner.x < nose1 + 20 && angleCorner.y - center1.y < (parFrames.profHeight + 30)
		) { // 30 - расстояние от отверстия в уголке до его торца
			center1.x = angleCorner.x + nose1 + 20 + 5;
		}

		center2 = newPoint_xy(center1, par.holeDistU4, 0.0);
		center1.hasAngle = center2.hasAngle = true;
		center1.pos = center2.pos = "botFloor";
		par.pointsHole.push(center1);
		par.pointsHole.push(center2);

		//увеличиваем нижнюю часть тетивы если уголки крепления к полу выступают за край тетивы
		if (params.stringerType == "пилообразная" && par.stairAmt > 0) {
			var pt = itercection(center2, polar(center2, Math.PI / 2 + par.marshAng, 100), p20, p21);
			if (center2.x + 20 > pt.x) {
				par.pointsShape.shift();
				pt = newPoint_xy(center2, 20, 0);
				var pt1 = itercection(p0, polar(p0, 0, 100), pt, polar(pt, Math.PI / 2, 100));
				var pt2 = itercection(pt, polar(pt, Math.PI / 2, 100), p20, p21);
				par.pointsShape.unshift(pt1);
				par.pointsShape.unshift(pt2);
			}
		}

		var pt = copyPoint(center1);

		//Отверстия под ограждения
		if (par.hasRailing) {

			if (params.railingModel != "Самонесущее стекло" && params.railingModel != "Трап") {
				center1 = newPoint_xy(par.zeroPoint, par.b * 0.5, par.rackTopHoleY + params.h1 + par.stringerLedge);

				//не допускаем выскакивания низа стойки за нижнюю линию тетивы

				if (center1.y - botLineP1.y < 90) {
					center1 = newPoint_y(center1, (90 - center1.y + botLineP1.y), par.marshAng);
				}
				par.railingHoles.push(center1);
			}

			if (params.railingModel == "Трап") {
				var balOnlay = 150;
				center1 = polar(p1, par.marshAng - Math.PI / 2, balOnlay - 30);
				center1 = newPoint_xy(center1, 5, -5 - par.h / 2);
				center2 = polar(center1, par.marshAng + Math.PI / 2, 60);
				center1.noHole2 = center2.noHole2 = true; //второе отверстие делать не надо
				par.railingHoles.push(center1);
				par.railingHoles.push(center2);
			}

			if (params.railingModel == "Самонесущее стекло") {
				//одиночный рутель на первой ступени
				center1 = newPoint_xy(p1, par.a * 0.5 - 25, par.rutelPosY);
				if (params.bottomAngleType === "регулируемая опора") center1.x = pt.x - 40;
				par.railingHoles.push(center1);

				//пара рутелей на второй ступени
				center1 = newPoint_xy(p1, par.b + par.rutelPosX, par.h + par.rutelPosY);
				center2 = newPoint_xy(center1, 0, -par.rutelDist);
				par.railingHoles.push(center1);
				par.railingHoles.push(center2);

			}
		}
	}

	if (params.calcType == 'console') {

	}


	//базовые точки для стыковки с другими частями косоура
	//http://6692035.ru/dev/mayorov/metal/imageLt/drawBotStepLt_floor_Lom.jpg - для ломанной
	//http://6692035.ru/dev/mayorov/metal/imageLt/drawBotStepLt_floor_Pil.jpg - для пилообразной
	//http://6692035.ru/dev/mayorov/metal/imageLt/drawBotStepLt_floor_Straight.jpg - для прямой

	par.botUnitEnd = par.pointsShape[par.pointsShape.length - 1];
	par.botUnitStart = par.pointsShape[0];
	par.midUnitEnd = par.botUnitEnd;

}//end of drawBotStepLt_floor

/**
 * первый подъем если снизу площадка (Г-образная и трехмаршевая лестница)
 */
function drawBotStepLt_pltG(par) {

	var p0 = newPoint_xy(par.zeroPoint, 0.01, 0);
	var	botStringerWidth = 105.0;
	//var botEndLength = params.M;
	var botEndLength = par.botEndLength;
	if (params.calcType == 'vhod') {
		botEndLength = params.middlePltWidth;
		if (hasCustomMidPlt(par) && par.key == 'in') {
			botEndLength = params.middlePltWidth - params.M;
		}
	}

	if (params.stringerType == 'ломаная') botStringerWidth = par.stringerWidth + 40;	

	/*ТОЧКИ КОНТУРА*/
	var p1 = newPoint_xy(p0, botStringerWidth, -par.stringerWidthPlatform + par.stringerLedge);  // нижний правый угол	
	//var p1 = newPoint_xy(p0, botStringerWidth, par.carcasAnglePosY - 80);  // нижний правый угол	
	if (params.stairModel == "Прямая с промежуточной площадкой" && par.marshId == 3)
		var p1 = newPoint_xy(p0, botStringerWidth, -par.stringerWidthPlatform + par.stringerLedge);
	
	var p2 = newPoint_xy(p1, -botStringerWidth + 40, 0);	
	var p3 = newPoint_xy(p0, 40.0, par.stringerLedge);
	var pt3 = newPoint_xy(p3, 0, par.stringerLedge);
	var p4 = newPoint_xy(p0, 0.0, par.h + par.stringerLedge);  // верхний левый угол
	var p34 = itercection(p3, polar(p3, Math.PI * 2 / 3, 100), p4, newPoint_xy(p4, 0, -100));
	var p5 = newPoint_xy(p4, par.b, 0.0);

	if (params.calcType == 'console') {
		pt3.y += par.addStringerWidth - par.stringerLedge;
		p4.y += par.addStringerWidth;
		p34 = itercection(pt3, polar(pt3, 0, 100), p4, newPoint_xy(p4, 0, -100))
	}

	if(par.isMiddleStringer && par.marshId !== 1){
		p4 = newPoint_xy(p4, par.treadFrontOverhang, -params.treadThickness - par.stringerLedge);
		p4.filletRad = 0;
		p5 = newPoint_xy(p5, par.treadFrontOverhang, -params.treadThickness - par.stringerLedge);
		p34 = itercection(p3, polar(p3, Math.PI * 2 / 3, 100), p4, newPoint_xy(p4, 0, -100));//точка пересечения переднего среза и нижней линии
	}

	//точки на нижней линии марша
	var p20 = newPoint_xy(p4, par.b + (par.stringerWidth / Math.sin(par.marshAng)), 0.0)// первая точка на нижней линии марша
	if (params.stringerType == "прямая") p20.x -= par.b;
	var p21 = polar(p20, par.marshAng, 100.0); // вторая точка на нижней линии

	var botLineP1 = itercection(p21, p20, p1, polar(p1, Math.PI / 3, 100));
	if (params.stringerType == "ломаная") {
		var botLineP2 = newPoint_xy(p5, par.stringerWidth, - par.stringerWidth);
		botLineP1 = newPoint_xy(botLineP2, -par.b, 0);
		p1 = itercection(p2, polar(p2, 0, 100), botLineP1, polar(botLineP1, Math.PI / 2, 100));
		var botLineP3 = newPoint_xy(botLineP2, 0, par.h);

		par.pointsShape.push(botLineP3);
		par.pointsShape.push(botLineP2);
	}

	// проверка на обрезку нижней части
	var isBotLedge = true; //есть выступ вниз
	if(botLineP1.y < p1.y){
		isBotLedge = false;
		p1 = itercection(p1, newPoint_xy(p1, 100, 0), botLineP1, p21, p20);
		}


	//сохраняем точки контура
	if(isBotLedge) par.pointsShape.push(botLineP1);
	par.pointsShape.push(p1);
	p2.filletRad = 0; //нижний угол тетивы не скругляется
	
	if (params.calcType == 'console') {
		pt3.filletRad = 0;
		p34.filletRad = 0;
	}
	if (!(params.calcType == 'console' && params.stringerModel == 'короб')) {
		par.pointsShape.push(p2);
		par.pointsShape.push(pt3);
		par.pointsShape.push(p34);
		par.pointsShape.push(p4);
	}
	

	//сохраняем точку для расчета длины
	par.keyPoints.botPoint = copyPoint(p2);

	//удлинение внешней тетивы площадки
	if (par.key == "out" && !par.is2MarshStright || (hasCustomMidPlt(par) && par.key == 'in')) {
		//var pt1 = newPoint_xy(p3, 0, -par.stringerWidthPlatform - par.stringerLedge);
		var pt1 = newPoint_xy(p3, 0, -par.stringerWidthPlatform);
		var pt2 = newPoint_xy(pt1, -botEndLength, 0);
		var pt3 = newPoint_xy(pt2, 0, par.stringerWidthPlatform);
		var pt4 = newPoint_xy(pt1, 0.0, par.stringerWidthPlatform);

		if (params.calcType == 'console') {
			pt3.y += par.addStringerWidth;
			pt4.y += par.addStringerWidth;
		}

		pt1.filletRad = pt2.filletRad = pt3.filletRad = pt4.filletRad = 0; //углы тетивы не скругляются

		if (params.calcType == 'console' && params.stringerModel == 'короб') {
			par.pointsShape.pop();
			var pt = par.pointsShape.pop();
			var pt1 = itercection(pt, polar(pt, par.marshParams.ang, 100), pt1, pt2)
			pt1.filletRad = 0;
			par.pointsShape.push(pt1);
			par.pointsShape.push(pt2);
			par.pointsShape.push(pt3);
			var pt4 = itercection(p4, polar(p4, par.marshParams.ang, 100), pt3, pt4);
			pt4.filletRad = 0;
			par.pointsShape.push(pt4);
		} else {
			par.pointsShapeBot.push(pt1);
			par.pointsShapeBot.push(pt2);
			par.pointsShapeBot.push(pt3);
			par.pointsShapeBot.push(pt4);

			//сохраняем точки для колонн
			par.keyPoints[par.key].botEnd = pt3;	// для первой колонны
			par.keyPoints[par.key].botEnd2 = pt4;	// для второй колонны

			par.keyPoints.botPointDop = copyPoint(pt2);
			par.keyPoints.topPointDop = copyPoint(pt4);

			//сохраняем длину для спецификации
			par.partsLen.push(distance(pt1, pt2))
		}
		
	}

	/*ОТВЕРСТИЯ*/
	if (params.calcType !== 'console') {
		if (hasTreadFrames() && hasCustomMidPlt(par) && pt3) {
			var pltLength = params.middlePltWidth - params.M;
			var frameAmt = calcPltFrameParams(pltLength, par.platformFramesParams.overhang).frameAmt;
			var frameWidth = calcPltFrameParams(pltLength, par.platformFramesParams.overhang).frameWidth;

			// отверстия под рамки под площадкой
			var begX = par.platformFramesParams.overhang + 5 + par.platformFramesParams.sideHolePosX;
			var i;
			var deltaX = 0;
			if (par.key == 'out') {
				deltaX = params.M;
			}
			for (i = 0; i < frameAmt; i++) {
				center1 = newPoint_xy(pt3, begX + deltaX, par.stepHoleY);
				center2 = newPoint_xy(center1, frameWidth - par.platformFramesParams.sideHolePosX * 2, 0.0);
				center1.isPltFrame = center2.isPltFrame = true;
				par.pointsHoleBot.push(center1);
				par.pointsHoleBot.push(center2);
				begX += frameWidth + 5.0;
			}
		}

		//Отверстия под ограждения
		if (par.hasRailing && par.stairAmt > 0 && params.stairModel != "Прямая с промежуточной площадкой") {

			if (params.railingModel != "Самонесущее стекло") {
				if (par.key == 'in' && !hasCustomMidPlt(par) ||
					(par.key == 'in' && params.middlePltWidth <= params.M + 200 && hasCustomMidPlt(par))) {
					center1 = newPoint_xy(p4, par.b * 0.5, par.rackTopHoleY);
					//смещаем стойку ближе к верхнему маршу
					var mooveY = params.treadThickness;
					if (params.stairType !== "лотки" || params.stairType !== "рифленая сталь") mooveY = 40;
					center1 = newPoint_y(center1, -mooveY, par.marshAng)

					//если повортная стойка, сдвигаем стойку до края предыдущего марша
					if (par.prevMarshPar.hasRailing.in) {
						var pt = setTurnRacksParams(par.marshId, par.key).stringerShiftPoint;
						center1 = newPoint_xy(p4, pt.x, par.stepHoleY + pt.y);
						center1.isTurnRack = true;
						center1.noDrawHoles = true;

						if (params.rackBottom == "сверху с крышкой")
							center1 = newPoint_xy(p4, par.b * 0.5, par.rackTopHoleY);

						//дополнительное отверстие для крепления поворотной стойки
						var center2 = newPoint_xy(p4, pt.x, -params.treadThickness / 2 - par.stringerLedge);
						center2.rad = 3.5;
						center2.noRack = true; // отверстие не учитывается при построении заграждения
						center2.noHole2 = true; //первое отверстие делать не надо
						par.railingHoles.push(center2);
					}

					par.railingHoles.push(center1);
				}

				if (par.key == 'out' ||
					(par.key == 'in' && hasCustomMidPlt(par) && params.middlePltWidth >= params.M + 200)) {
					//отверстие ближе к маршу
					center1 = newPoint_xy(p4, -par.b * 0.5, par.rackTopHoleY - par.h);
					par.railingHolesBot.push(center1);

					//отверстие ближе к углу
					center1 = newPoint_xy(pt3, 80, par.rackTopHoleY);
					par.railingHolesBot.push(center1);

					var platformLength = botEndLength;
					if (platformLength > 1300 && params.railingModel !== "Кованые балясины") {
						var middleRackAmt = Math.round(platformLength / 800) - 1;
						if (middleRackAmt < 0) middleRackAmt = 0;
						var rackDist = (platformLength - 200) / (middleRackAmt + 1);
						for (var i = 1; i <= middleRackAmt; i++) {
							var center11 = newPoint_xy(center1, rackDist * i, 0);
							par.railingHolesBot.push(center11);
						}
					}

				}
			}
			if (params.railingModel == "Самонесущее стекло") {
				//пара рутелей на первой ступени марша
				center1 = newPoint_xy(p4, par.b * 0.5, par.rutelPosY);
				center2 = newPoint_xy(center1, 0, -par.rutelDist);
				par.railingHoles.push(center1);
				par.railingHoles.push(center2);
				if (par.key == 'out') {
					// Отверстие около начала марша
					center1 = newPoint_xy(pt4, -90, -60);
					center2 = newPoint_xy(center1, 0, -par.rutelDist);
					par.railingHolesBot.push(center1);
					par.railingHolesBot.push(center2);
					//Отверстие скраю площадки
					center1 = newPoint_xy(pt3, 90, -60);
					center2 = newPoint_xy(center1, 0, -par.rutelDist);
					par.railingHolesBot.push(center1);
					par.railingHolesBot.push(center2);
				}
			}
		}

		if (params.M > 1100 && par.key == 'out') {
			center1 = newPoint_xy(p3, -calcTreadLen() / 2 - 45, par.carcasAnglePosY - 5);
			center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
			center1.hasAngle = center2.hasAngle = false;
			if (hasTreadFrames()) center1.backZenk = center2.backZenk = true;
			if (!hasTreadFrames()) center1.noZenk = center2.noZenk = true;
			par.pointsHoleBot.push(center2);
			par.pointsHoleBot.push(center1);
		}

		// отверстия под нижний крепежный уголок
		if (!(params.stairModel == "Прямая с промежуточной площадкой" && par.marshId == 3)) {
			// крепления к площадке	
			center1 = newPoint_xy(p3, 30, par.carcasAnglePosY);
			center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
			center1.hasAngle = center2.hasAngle = true;
			center1.rotated = center2.rotated = true;
			if (!(par.key == "in" && hasTreadFrames()) && !par.isMiddleStringer)
				center1.noBoltsInSide1 = center2.noBoltsInSide1 = true;
			par.pointsHole.push(center2);
			par.pointsHole.push(center1);

			//уголки доп. тетивы площадки
			if (par.key == "out" && !par.is2MarshStright) {
				//крепление к внутренней тетиве
				center1 = newPoint_xy(pt4, -38, par.carcasAnglePosY);
				center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
				center1.hasAngle = center2.hasAngle = false;
				par.pointsHoleBot.push(center1);
				par.pointsHoleBot.push(center2);

				//крепление к внешней тетиве
				center1 = newPoint_xy(pt3, 38, par.carcasAnglePosY);
				center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
				center1.hasAngle = center2.hasAngle = false;
				par.pointsHoleBot.push(center1);
				par.pointsHoleBot.push(center2);

				// отверстия под уголки крепления покрытия площадки
				if (!hasTreadFrames()) {
					var anglePos = setBridgeAnglePos();
					center1 = newPoint_xy(pt3, anglePos.sideHolePosX, par.stepHoleY);
					center2 = newPoint_xy(center1, anglePos.holeDist, 0.0);
					center3 = newPoint_xy(pt4, -anglePos.sideHolePosX, par.stepHoleY);
					center4 = newPoint_xy(center3, -anglePos.holeDist, 0.0);
					par.pointsHoleBot.push(center1, center2, center4, center3);
				}
			}
		}

		// отверстия под соединительный фланец
		if (params.stairModel == "Прямая с промежуточной площадкой" && par.marshId == 3) {
			center1 = newPoint_xy(p2, 30.0, 85.0);
			center2 = newPoint_xy(center1, 0, -60.0);
			//center3 = newPoint_xy(center1, 50.0, 0);
			//center4 = newPoint_xy(center3, 0, -60.0);
			center1.hasAngle = center2.hasAngle = false;
			center1.isTopFlanHole = center2.isTopFlanHole = true;
			center1.pos = "botRight";
			center2.pos = "topRight";
			//center3.pos = "botRight";
			//center4.pos = "topRight";
			if (par.isMiddleStringer) {
				par.elmIns[par.key].longBolts.push(center1);
				par.elmIns[par.key].longBolts.push(center2);
			}
			par.pointsHole.push(center1);
			par.pointsHole.push(center2);
			//par.pointsHole.push(center3);
			//par.pointsHole.push(center4);
		}

		//крепление к стенам
		if (par.key == "out" && par.marshParams.wallFix.out && pt3 && pt4) {
			var fixPar = getFixPart(par.marshId);
			//отверстие ближе к маршу
			center1 = newPoint_xy(pt3, 100, -100);
			center1.rad = fixPar.diam / 2 + 1;
			center1.hasAngle = false;
			center1.noZenk = true;
			center1.noBolts = true;
			center1.wallFix = true;
			par.pointsHoleBot.push(center1);
			//отверстие ближе к углу
			center1 = newPoint_xy(pt4, -100, -100);
			center1.rad = fixPar.diam / 2 + 1;
			center1.hasAngle = false;
			center1.noZenk = true;
			center1.noBolts = true;
			center1.wallFix = true;
			par.pointsHoleBot.push(center1);
		}
	}

	if (params.calcType == 'console1') {
		var flanPar = calcStringerConsoleFlanPar({ marshId: par.marshId, type: 'platformBot' });
		var holes = flanPar.holesFlanAndStringer;
		for (var i = 0; i < 2; i++) {
			var pt = newPoint_xy(pt4, -flanPar.widthTread * i - flanPar.shiftFlanX - par.treadFrontOverHang, - par.addStringerWidth + flanPar.shiftFlanY - par.stringerLedge);

			for (var j = 0; j < holes.length; j++) {
				var center = newPoint_xy(pt, -holes[j].x, holes[j].y);
				if (holes[j].noZenk) center.noZenk = holes[j].noZenk;
				if (holes[j].isFixWall) center.isFixWall = holes[j].isFixWall;
				par.pointsHoleBot.push(center);
			}
		}
	}

	//базовые точки для стыковки с другими частями косоура
	//http://6692035.ru/dev/mayorov/metal/imageLt/drawBotStepLt_pltG_Lom.jpg - для ломанной
	//http://6692035.ru/dev/mayorov/metal/imageLt/drawBotStepLt_pltG_Pil.jpg - для пилообразной
	//http://6692035.ru/dev/mayorov/metal/imageLt/drawBotStepLt_pltG_Straight.jpg - для прямой

	par.botUnitEnd = par.pointsShape[par.pointsShape.length - 1];
	par.botUnitStart = par.pointsShape[0];
	if (params.calcType == 'console' && params.stringerModel == 'короб') {
		par.botUnitEnd = p4;
		par.botUnitStart = botLineP1;
	}
	par.midUnitEnd = par.botUnitEnd;

	//сохраняем координаты нижнего левого угла тетивы для самонесущего стекла
	par.keyPoints[par.key].botLineP0 = copyPoint(p2);
	par.keyPoints[par.key].botLineP0.y -= 32.4;//подгон, временно FIX!
	if (par.key == "out")
		par.keyPoints[par.key].botLineP0.x -= params.M;
	if (par.key == "in")
		par.keyPoints[par.key].botLineP0.x = p3.x

}//end of drawBotStepLt_pltG

/**
 * первый подъем если снизу площадка (П-образная, внутренняя сторона)
 */
function drawBotStepLt_pltPIn(par) {
	var p0 = copyPoint(par.zeroPoint);
	var dh = 0; //уменьшение высоты тетивы, чтобы тетива была под ступенью
	dh = params.treadThickness + par.stringerLedge;
	//if (params.stairType !== "лотки") dh = params.treadThickness + par.stringerLedge;

	/*ТОЧКИ КОНТУРА*/
	var pltNotch = 30 + (params.nose - 20); //разер выреза в первом подъеме тетивы для площадки
	var p4 = newPoint_xy(p0, pltNotch, par.stringerLedge);
	var p3 = newPoint_xy(p4, 0, - dh);
	var p2 = newPoint_xy(p3, -par.botEndLength - pltNotch + par.stringerLedge, 0); //верхний левый угол
	var pt = copyPoint(p2);
	if (!hasTreadFrames()) p2 = newPoint_xy(p3, -73, 0);
	var p1 = newPoint_xy(p2, 0, -par.stringerWidthPlatform + dh);
	var p6 = newPoint_xy(p4, -pltNotch, par.h);  // угол первой ступени
	var p5 = itercection(p6, polar(p6, Math.PI / 2, 100), p4, polar(p4, Math.PI * 2 / 3, 100));
	var p7 = newPoint_xy(p6, par.b, 0);

	// нижний край тетивы
		var p20 = newPoint_xy(p6, par.b + (par.stringerWidth / Math.sin(par.marshAng)), 0.0)// первая точка на нижней линии марша
		if (params.stringerType == "прямая") p20.x -= par.b;
		var p21 = polar(p20, par.marshAng, 100.0); // вторая точка на нижней линии

	var botLineP1 = itercection(p1, polar(p1, 0, 100), p20, p21);       // точка пересчечения нижнего края и нижней линии марша
	if (params.stringerType == "ломаная") {
		var botLineP3 = newPoint_xy(p7, par.stringerWidth, - par.stringerWidth);
		var botLineP2 = newPoint_xy(botLineP3, -par.b, 0);
		var botLineP4 = newPoint_xy(botLineP3, 0, par.h);
		botLineP1 = itercection(p1, polar(p1, 0, 100), botLineP2, polar(botLineP2, Math.PI / 2, 100));

		par.pointsShape.push(botLineP4);
		par.pointsShape.push(botLineP3);
		par.pointsShape.push(botLineP2);
	}

	//сохраняем точки контура
	//Если botLine.x не меньше p2.x(верхний угол в начале, то добавляем точку)
	if (botLineP1.x > p2.x) par.pointsShape.push(botLineP1);
	p1.filletRad = p2.filletRad = 0; //угол тетивы не скругляется
	par.pointsShape.push(p1);
	par.pointsShape.push(p2);
	par.pointsShape.push(p3);
	par.pointsShape.push(p4);
	par.pointsShape.push(p5);
	par.pointsShape.push(p6);
	//if (params.stringerType !== "прямая") par.pointsShape.push(p7);

	//сохраняем точку для расчета длины
	par.keyPoints.botPoint = copyPoint(p1);
	//par.keyPoints.botPoint = copyPoint(p2);
	//par.keyPoints.botPoint1 = copyPoint(p1);

	//удлинение внутренней тетивы площадки
	if (!hasTreadFrames()) {
		var pt1 = newPoint_xy(p2, -params.stringerThickness, 0);
		var pt2 = copyPoint(pt);
		var pt3 = newPoint_xy(pt2, 0.0, -105);
		var pt4 = newPoint_xy(pt1, 0.0, -105);

		pt1.filletRad = pt2.filletRad = pt3.filletRad = pt4.filletRad = 0; //углы тетивы не скругляются
		par.pointsShapeBot.push(pt1);
		par.pointsShapeBot.push(pt2);
		par.pointsShapeBot.push(pt3);
		par.pointsShapeBot.push(pt4);
		
		//сохраняем длину для спецификации
		par.partsLen.push(distance(pt1, pt2))
	}


	/*ОТВЕРСТИЯ*/
	if (!hasTreadFrames()) {


		if (par.botEndLength < 790) {
			var holeDist = 50;
			var angleType = "У2-40х40х90";
			var angleHolePosX = 20;
		}
		else {
			var angleType = "У2-40х40х200";
			var angleHolePosX = par.angleHolePosX;
			var holeDist = par.holeDistU2_200;
		}

		var lenMiddlePlatform = (params.platformLength_1 + 7) / 2;
		var centerPlatform = newPoint_xy(pt2, lenMiddlePlatform + 5, 0);

		// отверстия под 1 уголок площадки
		center1 = newPoint_xy(centerPlatform, -lenMiddlePlatform / 2 - holeDist / 2, par.stepHoleY + 5 + params.treadThickness);
		center2 = newPoint_xy(center1, holeDist, 0.0);
		par.pointsHoleBot.push(center1);
		par.pointsHoleBot.push(center2);

		// отверстия под перемычку 2
		center1 = newPoint_xy(centerPlatform, -(params.stringerThickness + 60) / 2, par.stepHoleY + 5 + params.treadThickness); //25 подогнано
		center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
		center1.hasAngle = center2.hasAngle = false; //уголки перемычки отрисовываются внутри drawBridge_2
		par.elmIns[par.key].bridges.push(newPoint_xy(center1, -38.0, 20.0));
		par.pointsHoleBot.push(center1);
		par.pointsHoleBot.push(center2);

		// отверстия под 2 уголок площадки
		var stepHoleXside2 = (par.botEndLength / 2 - 64) / 2 + par.botEndLength / 2 - holeDist / 2;
		if (stepHoleXside2 > 0.0) {
			center1 = newPoint_xy(centerPlatform, (lenMiddlePlatform - 75 - 60) / 2 - holeDist / 2, par.stepHoleY + 5 + params.treadThickness);
			center2 = newPoint_xy(center1, holeDist, 0.0);
			par.pointsHoleBot.push(center1);
			par.pointsHoleBot.push(center2);
		}


		// отверстия под уголки крепления к поперечному косоуру площадки

		//передний уголок
		center1 = newPoint_xy(p3, -73 + 30, -20.0);
		center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
		center1.hasAngle = center2.hasAngle = true;
		center1.noBoltsInSide1 = center2.noBoltsInSide1 = true;
		center1.rotated = center2.rotated = true;
		par.pointsHole.push(center2);
		par.pointsHole.push(center1);

		//задний уголок
		center1 = newPoint_xy(center1, -par.holeDistU4 - params.stringerThickness, 0.0);
		center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
		center1.hasAngle = center2.hasAngle = true;
		center1.noBoltsInSide1 = center2.noBoltsInSide1 = true;
		par.pointsHoleBot.push(center2);
		par.pointsHoleBot.push(center1);
	}

	if (hasTreadFrames()) {

		// отверстия под рамки под площадкой

		var frameAmt = calcPltFrameParams(par.botEndLength + 5, par.platformFramesParams.overhang).frameAmt;
		var frameWidth = calcPltFrameParams(par.botEndLength + 5, par.platformFramesParams.overhang).frameWidth;
		var begX = -frameWidth - par.platformFramesParams.overhang + par.platformFramesParams.sideHolePosX - 25;
		if (params.stairType == "рифленая сталь" || params.stairType == "дпк") {
			var frameAmt = calcPltFrameParams(par.botEndLength + 25, par.platformFramesParams.overhang).frameAmt;
			var frameWidth = calcPltFrameParams(par.botEndLength + 25, par.platformFramesParams.overhang).frameWidth;
			var begX = -frameWidth - par.platformFramesParams.overhang + par.platformFramesParams.sideHolePosX - 5;
		}
		if (params.stairType == "лотки") {
			//var frameAmt = calcPltFrameParams(par.botEndLength + 1, par.platformFramesParams.overhang).frameAmt;
			//var frameWidth = calcPltFrameParams(par.botEndLength + 1, par.platformFramesParams.overhang).frameWidth;
			//var begX = -frameWidth - par.platformFramesParams.overhang + par.platformFramesParams.sideHolePosX - 5;
			var frameAmt = calcPltFrameParams(par.botEndLength + 25, par.platformFramesParams.overhang).frameAmt;
			var frameWidth = calcPltFrameParams(par.botEndLength + 25, par.platformFramesParams.overhang).frameWidth;
			var begX = -frameWidth - par.platformFramesParams.overhang + par.platformFramesParams.sideHolePosX - 5;
		}

		for (var i = 0; i < frameAmt; i++) {
			center1 = newPoint_xy(p3, begX, par.stepHoleY + dh);
			center2 = newPoint_xy(center1, frameWidth - par.platformFramesParams.sideHolePosX - par.platformFramesParams.sideHolePosX, 0.0);
			par.pointsHole.push(center1);
			par.pointsHole.push(center2);
			center1.noZenk = center2.noZenk = true;
			center1.isPltFrame = center2.isPltFrame = true;
			center1.noBoltsIn = center2.noBoltsIn = true;
			//par.elmIns[par.key].longBolts.push(center1);
			//par.elmIns[par.key].longBolts.push(center2);

			begX -= frameWidth + 5.0;
		}
	}

	//Отверстия под ограждения

	if (par.hasRailing) {

		if (params.railingModel != "Самонесущее стекло") {
			center1 = newPoint_xy(p6, par.b * 0.5, par.rackTopHoleY);
			par.railingHoles.push(center1);
		}
		if (params.railingModel == "Самонесущее стекло") {

			center1 = newPoint_xy(p6, par.b * 0.5, par.rutelPosY);
			center2 = newPoint_xy(center1, 0, -par.rutelDist);
			par.railingHoles.push(center1);
			par.railingHoles.push(center2);
		}
	}


	// уголок крепления к задней тетиве
	center1 = newPoint_xy(pt, 30.0, -80.0);
	center2 = newPoint_xy(center1, 0.0, par.holeDistU4);
	if (hasTreadFrames()) {
		//нижнее отверстие
		center1 = newPoint_xy(pt, 30.0, par.carcasAnglePosY + params.treadThickness + 5.0 - par.holeDistU4);
		center2 = newPoint_xy(center1, 0.0, par.holeDistU4);
		}
	center1.hasAngle = center2.hasAngle = true;
	center1.rotated = center2.rotated = true;
	if (hasTreadFrames()) {
		par.pointsHole.push(center1);
		par.pointsHole.push(center2);
		}
	if (!hasTreadFrames()) {
		par.pointsHoleBot.push(center1);
		par.pointsHoleBot.push(center2);
		}

	//базовые точки для стыковки с другими частями косоура
	//http://6692035.ru/dev/mayorov/metal/imageLt/drawBotStepLt_pltPIn_Lom.jpg - для ломанной
	//http://6692035.ru/dev/mayorov/metal/imageLt/drawBotStepLt_pltPIn_Pil.jpg - для пилообразной
	//http://6692035.ru/dev/mayorov/metal/imageLt/drawBotStepLt_pltPIn_Straight.jpg - для прямой

	par.botUnitEnd = par.pointsShape[par.pointsShape.length - 1];
	par.botUnitStart = par.pointsShape[0];
	par.midUnitEnd = par.botUnitEnd;

	//сохраняем координаты угла тетивы для самонесущего стекла
	par.keyPoints[par.key].botLineP0 = copyPoint(p4);

}//end of drawBotStepLt_pltPIn

/**
 * первый подъем если снизу площадка (П-образная лестница, внешняя сторона)
 */
function drawBotStepLt_pltPOut(par) {

	/*ТОЧКИ КОНТУРА*/

	// подъем
	var p0 = newPoint_xy(par.zeroPoint, -par.botEndLength + par.stringerLedge, -par.stringerWidthPlatform + par.stringerLedge); //нижний левый угол
	//if (params.calcType == 'console') p0.y += par.addStringerWidth
	var p1 = newPoint_xy(p0, 0, par.stringerWidthPlatform); // верхний левый угол
	if (params.calcType == 'console') p1.y += par.addStringerWidth
	var p2 = newPoint_xy(p1, par.botEndLength - par.stringerLedge, 0);
	var ph = copyPoint(p2);
	// подъём
	var p3 = newPoint_xy(p2, 0.0, par.h);
	var p4 = newPoint_xy(p3, par.b, 0.0);

	// нижний край тетивы
		var p20 = newPoint_xy(p3, par.b + (par.stringerWidth / Math.sin(par.marshAng)), 0.0)// первая точка на нижней линии марша
		if (params.stringerType == "прямая") p20.x -= par.b;
		var p21 = polar(p20, par.marshAng, 100.0); // вторая точка на нижней линии

	var botLineP1 = itercection(p0, polar(p0, 0, 100), p20, p21);       // точка пересчечения нижнего края и нижней линии марша
	if (params.stringerType == "ломаная") {
		var botLineP2 = newPoint_xy(p3, par.stringerWidth, - par.stringerWidth);
		var botLineP3 = newPoint_xy(botLineP2, par.b, 0);
		var botLineP4 = newPoint_xy(botLineP3, 0, par.h);
		botLineP1 = itercection(p0, polar(p0, 0, 100), botLineP2, polar(botLineP2, Math.PI / 2, 100));

		par.pointsShape.push(botLineP4);
		par.pointsShape.push(botLineP3);
		par.pointsShape.push(botLineP2);
	}

	//сохраняем точки контура
	par.pointsShape.push(botLineP1);
	p0.filletRad = p1.filletRad = 0; //угол тетивы не скругляется
	par.pointsShape.push(p0);
	par.pointsShape.push(p1);
	par.pointsShape.push(p2);
	par.pointsShape.push(p3);

	if (params.calcType == 'console' && params.stringerModel == 'короб') {
		par.pointsShape.pop();
		par.pointsShape.pop();
		var pt = itercection(p3, polar(p3, par.marshParams.ang, 100), p1, p2)
		pt.filletRad = 0;
		par.pointsShape.push(pt);
	}
	//if (params.stringerType !== "прямая") par.pointsShape.push(p4);

	//сохраняем точку для расчета длины
	par.keyPoints.botPoint = copyPoint(p0);

/*ОТВЕРСТИЯ*/
	if (params.calcType !== 'console') {
		if (!hasTreadFrames()) {

			if (par.botEndLength < 790) {
				var holeDistU2_200 = 50;
				var angleType = "У2-40х40х90";
				var angleHolePosX = 20;
			}
			else {
				var angleType = "У2-40х40х200";
				var angleHolePosX = par.angleHolePosX;
				var holeDistU2_200 = par.holeDistU2_200;
			}

			// отверстия под 1 уголок площадки
			//var stepHoleXside1 = (par.botEndLength / 2 - 110 - 64) / 2 + 140 - holeDistU2_200 / 2;
			//center1 = newPoint_xy(ph, stepHoleXside1 - par.botEndLength, par.stepHoleY);
			center1 = newPoint_xy(p1, 120, par.stepHoleY);
			center2 = newPoint_xy(center1, holeDistU2_200, 0.0);
			par.pointsHole.push(center1);
			par.pointsHole.push(center2);

			var rutelHoleBase4 = copyPoint(center1);
			// отверстия под перемычку 2

			center1 = newPoint_xy(p1, params.platformLength_1 / 2 - 25, -25.0 - params.treadThickness); //25 подогнано
			center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
			center1.hasAngle = center2.hasAngle = false; //уголки перемычки отрисовываются внутри drawBridge_2
			par.elmIns[par.key].bridges.push(newPoint_xy(center1, -38.0, 20.0));
			par.pointsHole.push(center1);
			par.pointsHole.push(center2);

			// отверстия под 2 уголок площадки
			var stepHoleXside2 = (par.botEndLength / 2 - 64) / 2 + par.botEndLength / 2 - holeDistU2_200 / 2;
			if (stepHoleXside2 > 0.0) {
				center1 = newPoint_xy(ph, stepHoleXside2 - par.botEndLength, par.stepHoleY);
				center2 = newPoint_xy(center1, holeDistU2_200, 0.0);
				par.pointsHole.push(center1);
				par.pointsHole.push(center2);
			}

			var rutelHoleBase1 = center1 === undefined
				? newPoint_xy(ph, -par.botEndLength + 90.0 - 5 + par.stepHoleX1, par.stepHoleY)
				: copyPoint(center1);

			// отверстия под уголки крепления к поперечному косоуру площадки
			//передний
			center1 = newPoint_xy(ph, -8 - 5 + (params.nose - 20), -25.0 - params.treadThickness);
			center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
			center1.noBoltsInSide1 = center2.noBoltsInSide1 = true;
			center1.rotated = center2.rotated = true
			par.pointsHole.push(center2);
			par.pointsHole.push(center1);

			//задний
			center1 = newPoint_xy(center1, -par.holeDistU4 - params.stringerThickness, 0.0);
			center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
			center1.noBoltsInSide1 = center2.noBoltsInSide1 = true;
			par.pointsHole.push(center2);
			par.pointsHole.push(center1);

		}

		if (hasTreadFrames()) {

			// отверстия под рамки под площадкой

			var frameAmt = calcPltFrameParams(par.botEndLength + 5, par.platformFramesParams.overhang).frameAmt;
			var frameWidth = calcPltFrameParams(par.botEndLength + 5, par.platformFramesParams.overhang).frameWidth;
			var begX = -frameWidth - par.platformFramesParams.overhang + par.platformFramesParams.sideHolePosX + 5.0;
			if (params.stairType == "рифленая сталь" || params.stairType == "дпк") {
				var frameAmt = calcPltFrameParams(par.botEndLength + 25, par.platformFramesParams.overhang).frameAmt;
				var frameWidth = calcPltFrameParams(par.botEndLength + 25, par.platformFramesParams.overhang)
					.frameWidth;
				var begX = -frameWidth -
					par.platformFramesParams.overhang +
					par.platformFramesParams.sideHolePosX +
					25.0;
			}
			if (params.stairType == "лотки") {
				//var frameAmt = calcPltFrameParams(par.botEndLength + 1, par.platformFramesParams.overhang).frameAmt;
				//var frameWidth = calcPltFrameParams(par.botEndLength + 1, par.platformFramesParams.overhang).frameWidth;
				//var begX = -frameWidth - par.platformFramesParams.overhang + par.platformFramesParams.sideHolePosX + 1;
				var frameAmt = calcPltFrameParams(par.botEndLength + 25, par.platformFramesParams.overhang).frameAmt;
				var frameWidth = calcPltFrameParams(par.botEndLength + 25, par.platformFramesParams.overhang)
					.frameWidth;
				var begX = -frameWidth -
					par.platformFramesParams.overhang +
					par.platformFramesParams.sideHolePosX +
					25.0;
			}


			for (var i = 0; i < frameAmt; i++) {
				center1 = newPoint_xy(ph, begX, par.stepHoleY);
				center2 = newPoint_xy(center1,
					frameWidth - par.platformFramesParams.sideHolePosX - par.platformFramesParams.sideHolePosX,
					0.0);
				begX -= frameWidth + 5.0;
				center1.isPltFrame = center2.isPltFrame = true;
				center1.isPltPFrame = center2.isPltPFrame = true;
				par.pointsHole.push(center1);
				par.pointsHole.push(center2);
			}
			var rutelHoleBase1 = copyPoint(center1);
		}


		//Отверстия под ограждения
		if (par.hasRailing) {

			if (params.railingModel != "Самонесущее стекло") {

				// отверстия под дальнюю стойку промежуточной площадки
				center1 = newPoint_xy(p1, 80 - 8, par.rackTopHoleY);
				par.railingHoles.push(center1);

				// отверстия под средние стойки
				if (par.platformLengthBot > 1300) {
					var middleRackAmt = Math.round(par.platformLengthBot / 800) - 1;
					if (middleRackAmt < 0) middleRackAmt = 0;
					var rackDist = (par.platformLengthBot - 200) / (middleRackAmt + 1);
					for (var i = 1; i <= middleRackAmt; i++) {
						var center11 = newPoint_xy(center1, rackDist * i, 0);
						par.railingHoles.push(center11);
					}
				}

				// отверстия под стойку 2 промежуточной площадки
				center1 = newPoint_xy(ph, -60 - 5 - 60, par.rackTopHoleY);
				par.railingHoles.push(center1);
			}
			if (params.railingModel == "Самонесущее стекло") {

				//пара рутелей на первой ступени марша
				center1 = newPoint_xy(p3, par.b * 0.5, par.rutelPosY);
				center2 = newPoint_xy(center1, 0, -par.rutelDist);
				par.railingHoles.push(center1);
				par.railingHoles.push(center2);

				// Отверстие около начала марша
				center1 = newPoint_xy(p2, -140, -60);
				center2 = newPoint_xy(center1, 0, -par.rutelDist);
				par.railingHoles.push(center1);
				par.railingHoles.push(center2);

				//Отверстие скраю площадки
				center1 = newPoint_xy(p1, 90, -60);
				center2 = newPoint_xy(center1, 0, -par.rutelDist);
				par.railingHoles.push(center1);
				par.railingHoles.push(center2);

			}

		}


		// уголок крепления к задней тетиве
		center1 = newPoint_xy(p1, 30, par.carcasAnglePosY);
		center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
		center1.rotated = center2.rotated = true;
		center1.hasAngle = center2.hasAngle = true;
		par.pointsHole.push(center2);
		par.pointsHole.push(center1);


		//крепление к стенам
		if (par.key == "out" && par.marshParams.wallFix.out) {
			var fixPar = getFixPart(par.marshId);
			//отверстие ближе к маршу
			center1 = newPoint_xy(p1, 100, -100);
			center1.rad = fixPar.diam / 2 + 1;
			center1.hasAngle = false;
			center1.noZenk = true;
			center1.noBolts = true;
			center1.wallFix = true;
			par.pointsHoleBot.push(center1);
			//отверстие ближе к углу
			center1 = newPoint_xy(p2, -100, -100);
			center1.rad = fixPar.diam / 2 + 1;
			center1.hasAngle = false;
			center1.noZenk = true;
			center1.noBolts = true;
			center1.wallFix = true;
			par.pointsHoleBot.push(center1);
		}
	}

	if (params.calcType == 'console') {
		if (params.stringerModel == 'лист') {
			var flanPar = calcStringerConsoleFlanPar({ marshId: par.marshId, type: 'platformBotP' });
			var holes = flanPar.holesFlanAndStringer;
			for (var i = 0; i < 2; i++) {
				var pt = newPoint_xy(p2,
					params.nose - flanPar.widthTread * i - flanPar.widthTread / 2 + flanPar.widthFlan / 2 + par.treadFrontOverHang,
					- par.addStringerWidth + flanPar.shiftFlanY - par.stringerLedge);

				for (var j = 0; j < holes.length; j++) {
					var center = newPoint_xy(pt, -holes[j].x, holes[j].y);
					if (holes[j].noZenk) center.noZenk = holes[j].noZenk;
					if (holes[j].isFixWall) center.isFixWall = holes[j].isFixWall;
					par.pointsHole.push(center);
				}
			}
		}

		if (params.stringerModel == 'короб') {
			var pTopOut = newPoint_xy(par.zeroPoint,
				par.turnParams.topStepDelta + par.stringerLedge,
				 - params.treadThickness / 2);

			var framePar = calcConsoleFramePar({ marshId: par.marshId, type: 'platformBotP' });

			var offsetX = 1;
			var offsetY = 8;

			for (var i = 0; i < 2; i++) {
				var center = newPoint_xy(pTopOut, -framePar.widthTread * i - framePar.widthTread / 2, 0);

				center.points = [
					newPoint_xy(center, -framePar.widthBox / 2 - offsetX, - framePar.heightBox / 2 - offsetY),
					newPoint_xy(center, -framePar.widthBox / 2 - offsetX, framePar.heightBox / 2 + offsetY),
					newPoint_xy(center, framePar.widthBox / 2 + offsetX, framePar.heightBox / 2 + offsetY),
					newPoint_xy(center, framePar.widthBox / 2 + offsetX, - framePar.heightBox / 2 - offsetY),
				]
				par.pointsHole.push(center);
			}
		}
	}

	//базовые точки для стыковки с другими частями косоура
	//http://6692035.ru/dev/mayorov/metal/imageLt/drawBotStepLt_pltPOut_Lom.jpg - для ломанной
	//http://6692035.ru/dev/mayorov/metal/imageLt/drawBotStepLt_pltPOut_Pil.jpg - для пилообразной
	//http://6692035.ru/dev/mayorov/metal/imageLt/drawBotStepLt_pltPOut_Straight.jpg - для прямой

	par.botUnitEnd = par.pointsShape[par.pointsShape.length - 1];
	if (params.calcType == 'console' && params.stringerModel == 'короб') {
		par.botUnitEnd = p3;
	}
	par.botUnitStart = par.pointsShape[0];
	par.midUnitEnd = par.botUnitEnd;

	par.keyPoints[par.key].botLineP0 = newPoint_xy(p0, -params.stringerThickness, 0);
}//end of drawBotStepLt_pltPOut

/**
 * первый подъем если снизу забег (внутренняя сторона марша)
 */
function drawBotStepLt_wndIn(par) {

	//рассчитываем высоту вертикального участка тетивы исходя из позиции уголков соединения тетив
	var holePos = -(par.h * 2 + params.treadThickness + 20); // позиция верхнего отверстия перемычки / отверстия рамки относительно верха первой забежной ступени
	//if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 3 && params.stairAmt2 == 0) {
	//	holePos -= 30;
	//	if (hasTreadFrames()) holePos -= 30;
	//}


	//низ верхнего крепежного уголка
	var topAngPosY = holePos - 100 / 2; //болт рамки по середине высоты уголка
	if (!hasTreadFrames()) topAngPosY = holePos - 20; //верхний болт перемычки совпадает с нижним болтом верхнего уголка

	//зазор между крепежными уголками
	var angleDist = 5;
	if (!hasTreadFrames()) angleDist = 20; //для лестницы без рамок нижнее отверстие должно совпадать с отверстием под перемычку

	var botAngPosY = topAngPosY - angleDist - 100;

	//если в нижнем марше 0 ступеней, тогда укорачиваем снизу высоту тетивы, чтобы она не врезалась в пол
	//при этом остается только верхний уголок
	var hasBotAngle = true;
	if (par.stairAmt_prev == 0 && !((params.stairModel == "П-образная с забегом" || params.stairModel == "П-образная трехмаршевая") && par.marshId == 3)) {
		if (hasTreadFrames()) botAngPosY = topAngPosY;
		//верхнее отверстие уголка совпадает с уголком крепления ступени
		if (!hasTreadFrames()) {
			topAngPosY = holePos - 100 / 2; //болт рамки по середине высоты уголка
			botAngPosY = topAngPosY;
			}
		hasBotAngle = false;
	}

	var turnParams = calcTurnParams(par.marshId);//расчитуем параметры нижнего поворота

	/*ТОЧКИ КОНТУРА*/

	//уровень верха третьей забежной ступени
	var p0 = copyPoint(par.zeroPoint);

	if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && params.stairAmt2 == 0) {
		if (par.topEnd !== "winder") p0.x -= params.marshDist + turnParams.topMarshOffsetZ;
		if (par.topEnd == "winder") p0.x -= params.marshDist - turnParams.topMarshOffsetZ - turnParams.topMarshOffsetX;
	}

	//нижний левый угол тетивы
	var p1 = newPoint_xy(p0, 0, botAngPosY - 5);

	//левый верхний угол тетивы
	var p2 = newPoint_xy(p0, 0, par.h + par.stringerLedge);
	if (par.stairAmt == 0) p2.y -= par.h;

	//нижняя линия
	var botLinePoints = [];

	if (params.stringerType == 'ломаная') {
		var botLineP1 = newPoint_xy(p1, par.stringerWidth, 0.0); //нижний правый угол тетивы
		var botLineP2 = newPoint_xy(p2, par.stringerWidth, -par.stringerWidth);
		var botLineP3 = newPoint_xy(botLineP2, par.b, 0);
		var botLineP4 = newPoint_xy(botLineP3, 0, par.h);

		if (par.stairAmt > 0) {
			if (!(par.stairAmt == 1 && par.topEnd == "platformG"))
				botLinePoints.push(botLineP4, botLineP3);
		}
		botLinePoints.push(botLineP2, botLineP1);

	}
	if (params.stringerType != 'ломаная') {
		var botLineP1 = newPoint_xy(p1, 65, 0.0); //нижний правый угол тетивы
		//вспомогательные точки на нижней линии
		var p20 = newPoint_xy(p2, par.b + (par.stringerWidth / Math.sin(par.marshAng)), 0.0)// первая точка на нижней линии марша
		if (params.stringerType == "прямая") p20.x -= par.b;
		var p21 = polar(p20, par.marshAng, 100.0); // вторая точка на нижней линии

		var ang = Math.PI / 18;
		var botLineP2 = itercection(botLineP1, polar(botLineP1, Math.PI / 2 - ang, 100), p20, p21);

		if(par.stairAmt > 0) botLinePoints.push(botLineP2);
		botLinePoints.push(botLineP1);
		}


	par.pointsShape.push(...botLinePoints);
	p1.filletRad = 0; //нижний угол тетивы не скругляется
	par.pointsShape.push(p1);
	par.pointsShape.push(p2);

	if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && params.stairAmt2 == 0) {
		var p3 = newPoint_xy(p2, params.marshDist + turnParams.topMarshOffsetZ, 0);
		if (par.topEnd == "winder") p3 = newPoint_xy(p2, params.marshDist - turnParams.topMarshOffsetZ - turnParams.topMarshOffsetX, 0);
		par.pointsShape.push(p3);
	}

	//сохраняем точку для расчета длины
	par.keyPoints.botPoint = copyPoint(p1);
	
	/*ОТВЕРСТИЯ*/

	/*отверстия под уголки соединения тетив*/

	//верхний уголок
	center1 = newPoint_xy(p0, 30, topAngPosY + 20);
	center2 = newPoint_xy(center1, 0.0, par.holeDistU4);
	center1.hasAngle = center2.hasAngle = true;
	center1.rotated = center2.rotated = true;
	if (!hasTreadFrames()) {
		if (!(par.stairAmt_prev == 0) || (params.stairModel == "П-образная с забегом" && par.marshId == 3)) {
			if (turnFactor == 1) center1.noBoltsInSide1_1 = true;
			if (turnFactor == -1) center1.noBoltsInSide1_2 = true;			
		}
		if (!hasBotAngle) center1.noBoltsInSide1 = true;
	}
		
	par.pointsHole.push(center1);
	par.pointsHole.push(center2);

	// нижний уголок
	if(hasBotAngle){
		center1 = newPoint_xy(p0, 30, botAngPosY + 20);;
		center2 = newPoint_xy(center1, 0.0, par.holeDistU4);
		center1.hasAngle = center2.hasAngle = true;
		center1.rotated = center2.rotated = true;
		if (!hasTreadFrames()) {
			if (turnFactor == 1) center1.noBoltsInSide1_2 = true;
			if (turnFactor == -1) center1.noBoltsInSide1_1 = true;
		}
		par.pointsHole.push(center1);
		par.pointsHole.push(center2);
		}


	if (hasTreadFrames()) {

	// отверстия под рамки забежных ступеней

		// отверстия под вторую забежную рамку

		var holePar = {
			holes: par.wndFramesHoles.topMarsh.in[2],
			basePoint: newPoint_xy(p0, params.stringerThickness - params.M, -params.treadThickness - par.h),
			}
		par.pointsHole.push(...calcWndHoles(holePar));

		// отверстие под третью забежную рамку

		//рассчитываем расстояние от угла рамки до края тетивы
		var offsetX = calcWndFrame3Offset(par);
		var holePar = {
			holes: par.wndFramesHoles.topMarsh.in[3],
			basePoint: newPoint_xy(p0, offsetX, -params.treadThickness),
		}
		if (par.wndFramesHoles1 && par.marshId == 3) holePar.holes = par.wndFramesHoles1.topMarsh.in[3];
		if (par.stringerLast && par.stairAmt == 0) {
			//holePar.holes[0].x += (params.lastWinderTreadWidth - 86) / 2;
			//if (params.stairType == "рифленая сталь" || params.stairType == "лотки")
			//	holePar.holes[0].x -= 14 / 2;
		}
		par.pointsHole.push(...calcWndHoles(holePar));
	}

	if (!hasTreadFrames()) {

		// отверстия под уголки забежных ступеней
		var angleHeight = 40;
		var holeDist = 50; //расстояние между отверстиями уголка У2-90
		var holeOffset = 30; //отступ центра отверстия от края тетивы
		var holeY = - params.treadThickness - angleHeight / 2; // координата y для отверстий третьей забежной ступени

		// третья забежная ступень

		center1 = newPoint_xy(p0, holeOffset, holeY);
		center2 = newPoint_xy(center1, holeDist, 0); //50 расстояние между двумя отверстиями уголка
		center1.hasAngle = center2.hasAngle = true;
		par.pointsHole.push(center1);
		par.pointsHole.push(center2);

		// вторая забежная ступень
		center1 = newPoint_xy(center1, 0, -par.h);
		center2 = newPoint_xy(center1, holeDist, 0);
		center1.hasAngle = center2.hasAngle = true;
		par.pointsHole.push(center1);
		par.pointsHole.push(center2);
/*
		// отверстия под перемычку
		if (par.stairAmt > 0) {
			center1 = newPoint_xy(p4, par.b - 5.0 - 6.0 - 60.0 + 38.0, par.stepHoleY);
			if (par.b < 190) center1.x += 190 - par.b;
			center2 = newPoint_xy(center1, 0, -par.holeDistU4);
			center1.hasAngle = center2.hasAngle = false; //уголки перемычки отрисовываются внутри drawBridge_2
			par.elmIns[par.key].bridges.push(newPoint_xy(center1, -38, 20));

			var center4 = newPoint_xy(p4, 45.0, par.stepHoleY);
			var center3 = newPoint_xy(center4, 50.0, 0.0);
			par.pointsHole.push(center1);
			par.pointsHole.push(center2);
			par.pointsHole.push(center4);
			par.pointsHole.push(center3);
		}
*/
	}


	//Отверстия под ограждения
	if (par.hasRailing) {
		if (params.railingModel != "Самонесущее стекло" && params.railingModel != "Трап") {
			//if (par.stairAmt != 1 && !(par.stairAmt == 2 && par.topEnd == "winder")) {
				center1 = newPoint_xy(p2, par.b * 0.5, par.rackTopHoleY);
				//смещаем точку ближе к низу марша
			if (params.rackBottom == "боковое") {
				center1 = newPoint_x(center1, -par.b * 0.5 + 50, -par.marshAng)

				//если повортная стойка, сдвигаем стойку до края предыдущего марша
				if (params.stairModel == "П-образная с забегом") par.prevMarshPar.hasRailing.in = false;
				if (par.prevMarshPar.hasRailing.in) {
					var pt = setTurnRacksParams(par.marshId, par.key).stringerShiftPoint;
					center1 = newPoint_xy(p2, pt.x, par.rackTopHoleY + pt.y);
					center1.isTurnRack = true;
					center1.noDrawHoles = true;

					//дополнительное отверстие для крепления поворотной стойки
					var center2 = newPoint_xy(p2, pt.x, -params.treadThickness / 2 - par.stringerLedge);
					if (params.stairType == "лотки" || params.stairType == "рифленая сталь" || params.stairType == "пресснастил")
						center2 = newPoint_xy(p2, pt.x, -42);
					//var center2 = newPoint_xy(p2, pt.x, par.stepHoleY + 5);
					center2.rad = 3.5;
					center2.noRack = true; // отверстие не учитывается при построении заграждения
					center2.noHole2 = true; //первое отверстие делать не надо
					par.railingHoles.push(center2);
				}
			}
				par.railingHoles.push(center1);
			//}
		}
		if (params.railingModel == "Трап") {
			var balOnlay = 150;
			center1 = polar(p2, par.marshAng - Math.PI / 2, balOnlay - 30);
			center1 = newPoint_xy(center1, 5, -5 - par.h / 2);
			center2 = polar(center1, par.marshAng + Math.PI / 2, 60);
			center1.noHole2 = center2.noHole2 = true;//второе отверстие делать не надо
			par.railingHoles.push(center1);
			par.railingHoles.push(center2);
		}
		if (params.railingModel == "Самонесущее стекло") {

			center1 = newPoint_xy(p2, par.b * 0.5, -110);
			center2 = newPoint_xy(center1, 0.0, -100.0);
			par.railingHoles.push(center1);
			par.railingHoles.push(center2);
		}


	}

	//базовые точки для стыковки с другими частями косоура
	//http://6692035.ru/dev/mayorov/metal/imageLt/drawBotStepLt_wndIn_Lom.jpg - для ломанной
	//http://6692035.ru/dev/mayorov/metal/imageLt/drawBotStepLt_wndIn_Pil.jpg - для пилообразной
	//http://6692035.ru/dev/mayorov/metal/imageLt/drawBotStepLt_wndIn_Straight.jpg - для прямой

	par.botUnitEnd = par.pointsShape[par.pointsShape.length - 1];
	par.botUnitStart = par.pointsShape[0];
	par.midUnitEnd = par.botUnitEnd;

	//сохраняем координаты нижнего левого угла тетивы для самонесущего стекла
	par.keyPoints[par.key].botLineP0 = copyPoint(p0);

}//end of drawBotStepLt_wndIn

/**
 * первый подъем если снизу забег (внешняя сторона марша)
 */
function drawBotStepLt_wndOut(par) {

	var p0 = newPoint_xy(par.zeroPoint, 0, -(par.h_prev + par.h));
	if (params.calcType == 'console') p0.y += par.addStringerWidth

	var turnParams = calcTurnParams(par.marshId);

	//константы

	var angelLenght = 20 + par.holeDistU4 + 20;	// длина уголка
	var angleClearance = 5;							// зазор между уголками
	var wndBottomAngle = 15 * Math.PI / 180;			// угол нижней линии тетивы под забежной частью


	var backLineLength = par.stringerLedge + params.treadThickness + par.profileHeight + angleClearance * 3 + angelLenght * 2;		// длинна задней вертикальной линии тетивы


	/*ТОЧКИ КОНТУРА*/

	//точка в углу второй забежной ступени
	var p4 = newPoint_xy(p0, 0, par.h + par.h_prev + par.stringerLedge);
	if (par.isWndP) {
		p4.x += params.marshDist + turnParams.topMarshOffsetZ - 40;
		if (params.calcType == 'bolz') p4.x += 42 + 36;
	}
	
	var p3 = newPoint_xy(p4, -par.wndSteps[3].out.topMarsh, 0)
	if (par.isWndP) {
		p3.x -= (params.marshDist - 44) + params.stringerThickness;
		if (params.calcType == 'console' && params.stringerModel == 'короб') 
			var p3 = newPoint_xy(p4, -par.wndSteps[3].out.topMarsh - (params.marshDist - 45), 0)
		if (params.calcType == 'bolz') p3.x -= 36;
	}
	if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && params.stairAmt2 == 0) {
		if (par.topEnd !== "winder") p3.x -= params.marshDist + turnParams.topMarshOffsetZ;
		if (par.topEnd == "winder") p3.x -= params.marshDist - turnParams.topMarshOffsetZ - turnParams.topMarshOffsetX;
	} 
	var p2 = newPoint_xy(p3, 0, -par.h);
	var p1 = newPoint_xy(p2, -par.wndSteps[2].out.topMarsh, -0); //верхний левый угол
	if (params.calcType == 'console') {
		if (params.stringerModel == 'лист') p1.x -= params.stringerThickness + 8 + calcStringerMoove(par.marshId).stringerOutMoovePrev;
		if (params.stringerModel == 'короб') p1.x -= calcStringerMoove(par.marshId).stringerOutMoovePrev;
	}
	var p5 = newPoint_xy(p4, 0, par.h);

	//нижняя линия
	var botLineP1 = newPoint_xy(p1, 0, -backLineLength); //нижний левый угол



	var botLinePoints = [];

	if (params.stringerType == "ломаная") {
		var botLineP3 = newPoint_xy(p1, par.stringerWidth, - par.stringerWidth);
		var botLineP2 = {x: botLineP3.x, y: botLineP1.y}
		var botLineP4 = newPoint_xy(p2, par.stringerWidth, - par.stringerWidth);
		var botLineP5 = newPoint_xy(p3, par.stringerWidth, - par.stringerWidth);
		var botLineP6 = newPoint_xy(p4, par.stringerWidth, - par.stringerWidth);
		var botLineP7 = newPoint_xy(botLineP6, 0, par.h);
		var botLineP8 = newPoint_xy(botLineP7, par.b, 0);
		var botLineP9 = newPoint_xy(botLineP8, 0, par.h);

		if ((par.marshPar.prevMarshId == 1 && params.inStringerElongationTurn1 == 'да') ||
			(par.marshPar.prevMarshId == 2 && params.inStringerElongationTurn2 == 'да')) {
			botLineP5.y = botLineP6.y -= 10;
		}

		if (par.stairAmt > 0) {
			if (!(par.stairAmt == 1 && par.topEnd == "platformG"))
				botLinePoints.push(botLineP9, botLineP8);
		}
		if (!(par.stairAmt == 0 && par.topEnd == "platformG")) botLinePoints.push(botLineP7, botLineP6);
		botLinePoints.push(botLineP5, botLineP4, botLineP3, botLineP2);
		}

	if (params.stringerType != "ломаная") {
		var botLineP2 = newPoint_xy(botLineP1, 0.15 * params.M, 0.0);// 0.15*params.M - длина нижней горизотральной линии тетивы
		//вспомогательные точки на нижней линии марша
		var p20 = newPoint_xy(p4, (par.stringerWidth / Math.sin(par.marshAng)), 0) // первая точка на нижней линии марша
		if (params.stringerType == "прямая") p20.x = par.b;
		var p21 = polar(p20, par.marshAng, 100.0); // вторая точка на нижней линии
		//вспомогательная точка на нижней линии под забегом. Угол этой линии marshAng / 2
		var p22 = polar(botLineP2, par.marshAng / 2, 100.0)

		var botLineP3 = itercection(botLineP2, p22, p20, p21); //если меньше 2 ступеней нижняя линия без перелома

		if (par.stairAmt > 0) botLinePoints.push(botLineP3);
		botLinePoints.push(botLineP2);
	}

	//сохраняем точки для отладки
	par.keyPoints[par.key].botEnd = copyPoint(p1);

	//корректируем форму для прямой тетивы
	if (params.stringerType == "прямая") {
		p1.y += 100;
		}

	//сохраняем точки контура

	p1.filletRad = botLineP1.filletRad = 0;
	par.pointsShape.push(...botLinePoints);
	par.pointsShape.push(botLineP1);
	par.pointsShape.push(p1);
	if (params.stringerType !== "прямая"){
		par.pointsShape.push(p2);
		par.pointsShape.push(p3);
		par.pointsShape.push(p4);
		if(par.stairAmt > 0) par.pointsShape.push(p5);
		}
	if (params.stringerType == "прямая"){
		if(par.stairAmt == 0) {
			if(!par.isWndP) par.pointsShape.push(p3);
			par.pointsShape.push(p4);
			}
		if(par.stairAmt > 0) par.pointsShape.push(p5);
		}

	if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && par.stairAmt == 0 && par.topEnd == "winder")
		par.pointsShape.push(p5);


	//параметры для самонесущего стекла
	par.wndParams[par.key].turnCutBot = distance(botLineP1, botLineP2);

	
	
	//сохраняем точку для расчета длины
	par.keyPoints.botPoint = copyPoint(botLineP1);

/*ОТВЕРСТИЯ*/
	if (params.calcType !== 'console') {
		var
			pointsAngles =
				[]; //точки контуров уголков на тетиве {p1: точка левого нижнего угла, p2: точка правого верхнего угла, orientationVert: true - вертикальное расположение уголка}

		// отверстия под нижние крепежные уголки
		// первый уголок
		center1 = newPoint_xy(botLineP1, 30 + params.stringerThickness, 25.0);
		center2 = newPoint_xy(center1, 0.0, par.holeDistU4);
		center1.hasAngle = center2.hasAngle = true;
		center1.rotated = center2.rotated = true;
		par.pointsHole.push(center1);
		par.pointsHole.push(center2);

		// второй уголок
		center1 = newPoint_xy(center2, 0.0, 45.0);
		center2 = newPoint_xy(center1, 0.0, par.holeDistU4);
		center1.hasAngle = center2.hasAngle = true;
		center1.rotated = center2.rotated = true;
		par.pointsHole.push(center1);
		par.pointsHole.push(center2);

		//уголок на продлении внутреннего косоура предыдущего марша

		if (par.longStringerTop) {
			//позиция уголка относительно угла косоура
			var anglePos = {
				x: params.M - params.stringerThickness,
				y: par.h - params.treadThickness - 40 - 5,
			}
			if (params.stringerType == "прямая") anglePos.y -= 100;
			var center1 = newPoint_xy(p1, anglePos.x - 30, anglePos.y - 25);
			var center2 = newPoint_xy(center1, 0, -60);
			center1.hasAngle = center2.hasAngle = false;
			par.pointsHole.push(center2);
			par.pointsHole.push(center1);
			pointsAngles.push({
				p1: newPoint_xy(center2, -50, -40),
				p2: newPoint_xy(center1, 50, 40),
				orientationVert: true
			})
		}

		if (hasTreadFrames()) {
			// отверстия под вторую забежную рамку
			var holePar = {
				holes: par.wndFramesHoles.topMarsh.out[2],
				basePoint: newPoint_xy(p1, params.stringerThickness, -(par.stringerLedge + params.treadThickness)),
			}
			if (params.stringerType == "прямая") holePar.basePoint.y -= 100;
			par.pointsHole.push(...calcWndHoles(holePar));

			// отверстия под третью забежную рамку
			//расстояние от края тетивы до переднего угла фланца на внутренней стороне (на внешней оно такое же) http://6692035.ru/drawings/wndFramesHoles/3-4.jpg
			var offsetX = calcWndFrame3Offset(par);
			var turnParams = calcTurnParams(par.marshParams.prevMarshId);

			var holePar = {
				holes: par.wndFramesHoles.topMarsh.out[3],
				basePoint: newPoint_xy(p4, offsetX, -(par.stringerLedge + params.treadThickness)),
			}
			if (par.wndFramesHoles1 && par.marshId == 3) holePar.holes = par.wndFramesHoles1.topMarsh.out[3];
			if (par.stringerLast && par.stairAmt == 0) {
				//holePar.holes[1].x += (params.lastWinderTreadWidth - 86);
				//if (params.stairType == "рифленая сталь" || params.stairType == "лотки")
				//	holePar.holes[1].x -= 14;
			}
			if (par.isWndP) holePar.basePoint.x += -params.marshDist + turnParams.topMarshOffsetX + par.stringerLedge;;
			par.pointsHole.push(...calcWndHoles(holePar));
		}

		if (!hasTreadFrames()) {

			// отверстия под уголки забежных ступеней
			var angPar = calcWndParams(); //функция в файле drawCarcas.js
			var angleHoleY = -params.treadThickness - 25;

			// вторая забежная ступень
			center1 = newPoint_xy(p2, 20, angleHoleY);
			center2 = newPoint_xy(center1, -angPar.angleHoleDist, 0);
			center1.partName = 'wndTreadFix';
			center2.partName = 'wndTreadFix';
			par.pointsHole.push(center2);
			par.pointsHole.push(center1);
			pointsAngles.push({
				p1: newPoint_xy(center2, -55, -40),
				p2: newPoint_xy(center1, 55, 40),
				orientationVert: false
			})

			// третья забежная ступень
			// первый уголок

			center1 = newPoint_xy(p3, 60, angleHoleY);
			center2 = newPoint_xy(center1, angPar.angleHoleDist, 0);
			center1.partName = 'wndTreadFix';
			center2.partName = 'wndTreadFix';
			par.pointsHole.push(center1);
			par.pointsHole.push(center2);
			pointsAngles.push({
				p1: newPoint_xy(center1, -55, -40),
				p2: newPoint_xy(center2, 55, 40),
				orientationVert: false
			})

			// второй уголок
			center1 = newPoint_xy(p4, 20, angleHoleY);
			if (params.M < 600) center1 = newPoint_xy(p4, 60, angleHoleY);
			center2 = newPoint_xy(center1, -angPar.angleHoleDist, 0);
			center1.partName = 'wndTreadFix';
			center2.partName = 'wndTreadFix';
			par.pointsHole.push(center2);
			par.pointsHole.push(center1);
			pointsAngles.push({
				p1: newPoint_xy(center2, -55, -40),
				p2: newPoint_xy(center1, 55, 40),
				orientationVert: false
			})
			/*
			// отверстия под перемычку
			if (par.stairAmt > 0 && !(par.stairAmt == 1 && params.stairModel == "П-образная трехмаршевая")) {
				center1 = newPoint_xy(p4, par.b - 5.0 - 6.0 - 60.0 + 38.0, par.stepHoleY);
				if (par.b < 190) center1.x += 190 - par.b;
				if (par.stairAmt == 1) center1.x -= 50;
				center2 = newPoint_xy(center1, 0, -par.holeDistU4);
				center1.hasAngle = center2.hasAngle = false; //уголки перемычки отрисовываются внутри drawBridge_2
				par.elmIns[par.key].bridges.push(newPoint_xy(center1, -38, 20));
				var center4 = newPoint_xy(p4, 45.0, par.stepHoleY);
				var center3 = newPoint_xy(center4, 50.0, 0.0);
				par.pointsHole.push(center1);
				par.pointsHole.push(center2);
				par.pointsHole.push(center4);
				par.pointsHole.push(center3);
			}
			*/
		}


		//Отверстия под ограждения
		if (par.hasRailing) {

			if (params.railingModel != "Самонесущее стекло") {
				// отверстия под стойку ближе к углу лестницы
				center1 = newPoint_xy(par.keyPoints[par.key].botEnd, 80, par.rackTopHoleY);
				//if (par.prevMarshPar.hasRailing.out || (params.stairModel == "П-образная с забегом" && par.marshId == 3 && params.backRailing_2 == "есть"))
				//	center1 = newPoint_xy(center1, 100, 0);
				par.railingHoles.push(center1);

				// отверстия под стойку ближе к маршу

				//заднее ограждение забега П-образной
				if (par.stairAmt == 0 && par.topEnd == "winder") {
					var deltaX = params.M * 2 + params.marshDist - 80 * 2;
					var deltaY = par.h * 3;
					var handrailAngle = Math.atan(deltaY / deltaX);
					center1 = newPoint_y(center1, par.h, handrailAngle)
					center1 = polar(center1, handrailAngle, 10)
					par.railingHoles.push(center1);
				}
				else {
					center1 = newPoint_xy(p5, par.b * 0.5, par.rackTopHoleY);
					//смещаем точку ближе к низу марша
					center1 = newPoint_x(center1, -par.b * 0.5 + 50, -par.marshAng)
					if (par.stairAmt > 1) par.railingHoles.push(center1);
					if (par.stairAmt == 1 && params.stairModel == "П-образная трехмаршевая" && par.marshId == 2)
						par.railingHoles.push(center1);
				}
			}

			if (params.railingModel == "Самонесущее стекло") {
				// отверстия под стойку 1
				center1 = newPoint_xy(botLineP1, 80, par.h);
				center2 = newPoint_xy(center1, 0.0, -100.0);
				par.railingHoles.push(center1);
				par.railingHoles.push(center2);

				// отверстия под стойку 2
				if (par.stairAmt < 10) {
					// var holeXDim = par.stringerWidth / Math.cos(par.marshAng);
					// center1 = newPoint_xy(p2, -holeXDim / Math.tan(par.marshAng), -holeXDim + 80);
					center1 = newPoint_xy(botLineP1, params.M - 215, par.h * 2);
				}
				else {
					var holeXDim = 80 / Math.cos(par.marshAng);
					center1 = newPoint_xy(p2, -holeXDim / Math.tan(par.marshAng), -holeXDim);
				}
				if (par.text == "забежный") {
					center1 = newPoint_xy(pCentralHoles, -120, -110);
				}
				// center1.x = -263.523138347365;
				// center1.y = -297.43909577894496;
				center2 = newPoint_xy(center1, 0.0, -100.0);
				par.railingHoles.push(center1);
				par.railingHoles.push(center2);

				// отверстия под стойку 3 (на ступени)
				center1 = newPoint_xy(p4, par.b * 0.5, par.h / 2 - 40); //FIX
				center2 = newPoint_xy(center1, 0.0, -100.0);
				par.railingHoles.push(center1);
				par.railingHoles.push(center2);
			}
		}

		//крепление к стенам
		if (par.marshParams.wallFix.out) {
			var fixPar = getFixPart(par.marshId);
			//отверстие ближе к маршу
			center1 = newPoint_xy(p4, -150, -150);
			if (params.stringerType == "ломаная") center1.y += 50;
			center1 = calculateOffsetHole(center1, pointsAngles);
			center1.rad = fixPar.diam / 2 + 1;
			center1.hasAngle = false;
			center1.noZenk = true;
			center1.noBolts = true;
			center1.wallFix = true;
			par.pointsHole.push(center1);

			//отверстие ближе к углу
			center1 = newPoint_xy(p1, 200, -150);
			center1 = calculateOffsetHole(center1, pointsAngles);
			center1.rad = fixPar.diam / 2 + 1;
			center1.hasAngle = false;
			center1.noZenk = true;
			center1.noBolts = true;
			center1.wallFix = true;
			par.pointsHole.push(center1);
		}
	}

	if (params.calcType == 'console') {
		if (params.stringerModel == 'лист') {
			// отверстия под третью забежную ступень
			var flanPar = {
				marshId: par.marshId,
				dxfBasePoint: par.dxfBasePoint,
				type: 'winder3',
				wndPar: par.treadsObj.wndPar,
				wndPar2: par.treadsObj.wndPar2,
			}
			calcStringerConsoleFlanPar(flanPar);
			var holes = flanPar.holesFlanAndStringer;
			var pt = newPoint_xy(p4,
				flanPar.shiftFlanX + par.treadFrontOverHang,
				- par.addStringerWidth + flanPar.shiftFlanY - par.stringerLedge);
			for (var j = 0; j < holes.length; j++) {
				var center = newPoint_xy(pt, -holes[j].x, holes[j].y);
				if (holes[j].noZenk) center.noZenk = holes[j].noZenk;
				if (holes[j].isFixWall) center.isFixWall = holes[j].isFixWall;
				par.pointsHole.push(center);
			}

			// отверстия под вторую забежную ступень
			flanPar.type = 'winder21'
			calcStringerConsoleFlanPar(flanPar);
			var holes = flanPar.holesFlanAndStringer;
			var pt = newPoint_xy(pt,
				-flanPar.shiftFlanX -
				par.turnParams.turnLengthBot -
				calcStringerMoove(par.marshId).stringerOutMoovePrev +
				par.treadFrontOverHang,
				-par.marshParams.h);

			var wndPar = flanPar.wndPar;
			if (flanPar.wndPar2 && par.marshId == 3) wndPar = flanPar.wndPar2;
			if (wndPar.plusMarshDist) pt.x -= params.marshDist - 45;

			for (var j = 0; j < holes.length; j++) {
				var center = newPoint_xy(pt, holes[j].x, holes[j].y);
				if (holes[j].noZenk) center.noZenk = holes[j].noZenk;
				if (holes[j].isFixWall) center.isFixWall = holes[j].isFixWall;
				par.pointsHole.push(center);
			}
		}

		if (params.stringerModel == 'короб') {
			var pBotOut = newPoint_xy(par.zeroPoint,
				par.stringerLedge - par.turnBotParams.turnLengthBot,
				-par.h * 0 - params.treadThickness / 2);

			if (par.marshId == 2 && par.stairAmt == 0) {
				pBotOut.x += par.stringerLedge;
			}

			var prevMarshId = par.prevMarshPar.marshId
			if (params.stairModel == "П-образная с забегом" && par.marshId == 3) prevMarshId = 2;

			var framePar = { marshId: prevMarshId, type: 'marsh' }
			calcConsoleFrameWndPar(framePar);
			calcConsoleFramePar(framePar);

			var offsetX = 1;
			var offsetY = 8;

			// отверстия под первую забежную ступень
			var center = copyPoint(pBotOut);
			var pc1 = framePar.wndFrames['3'].p1In;
			var pc2 = framePar.wndFrames['3'].p2In;
			if (par.number == 2) {
				pc1 = framePar.wndFrames['3'].p1Out;
				pc2 = framePar.wndFrames['3'].p2Out;
			}
			center.points = [
				newPoint_xy(center, pc1.x - offsetX, - framePar.heightBox / 2 - offsetY),
				newPoint_xy(center, pc1.x - offsetX, framePar.heightBox / 2 + offsetY),
				newPoint_xy(center, pc2.x + offsetX, framePar.heightBox / 2 + offsetY),
				newPoint_xy(center, pc2.x + offsetX, - framePar.heightBox / 2 - offsetY),
			]
			par.pointsHole.push(center);

			// отверстия под вторую забежную ступень
			var center = newPoint_xy(pBotOut, 0, -par.h);
			var pc1 = framePar.wndFrames['2'].p4In;
			var pc2 = framePar.wndFrames['2'].p5In;
			if (par.number == 2) {
				pc1 = framePar.wndFrames['2'].p4Out;
				pc2 = framePar.wndFrames['2'].p5Out;
			}
			center.points = [
				newPoint_xy(center, pc1.x - offsetX, - framePar.heightBox / 2 - offsetY),
				newPoint_xy(center, pc1.x - offsetX, framePar.heightBox / 2 + offsetY),
				newPoint_xy(center, pc2.x + offsetX, framePar.heightBox / 2 + offsetY),
				newPoint_xy(center, pc2.x + offsetX, - framePar.heightBox / 2 - offsetY),
			]
			par.pointsHole.push(center);
		}
	}

	//базовые точки для стыковки с другими частями косоура
	//http://6692035.ru/dev/mayorov/metal/imageLt/drawBotStepLt_wndOut_Lom.jpg - для ломанной
	//http://6692035.ru/dev/mayorov/metal/imageLt/drawBotStepLt_wndOut_Pil.jpg - для пилообразной
	//http://6692035.ru/dev/mayorov/metal/imageLt/drawBotStepLt_wndOut_Straight.jpg - для прямой

	par.botUnitEnd = par.pointsShape[par.pointsShape.length - 1];
	par.botUnitStart = par.pointsShape[0];
	par.midUnitEnd = par.botUnitEnd;

	//сохраняем координаты нижнего левого угла тетивы для самонесущего стекла
	par.keyPoints[par.key].botLineP0 = newPoint_xy(botLineP1, params.stringerThickness, 0);

}//end of drawBotStepLt_wndOut


/**
 * средние ступени
 */
function drawMiddleStepsLt(par) {
	//сохраняем точки для отладки
	par.keyPoints[par.key].botUnitStart = par.pointsShape[0];
	par.keyPoints[par.key].botUnitEnd = par.pointsShape[par.pointsShape.length - 1];

	var p2 = copyPoint(par.botUnitEnd);
	var p1 = copyPoint(p2);

	//вспомогательыне точки на нижней линии
	var p20 = newPoint_xy(p1, par.b + (par.stringerWidth / Math.sin(par.marshAng)), 0.0)// первая точка на нижней линии марша
	if (params.stringerType == "прямая") p20.x -= par.b;
	if (par.isMiddleStringer) p20 = copyPoint(par.pointsShape[0]);
	var p21 = polar(p20, par.marshAng, -100.0)

	//сохраняем точки на нижней линии марша для самонесущего стекла
	par.keyPoints[par.key].marshBotLineP1 = copyPoint(p20)
	par.keyPoints[par.key].marshBotLineP2 = copyPoint(p21)

	var angleHoleCoords = { "x": 0, "y": 0 };


	/*ТОЧКИ КОНТУРА*/

	//верхняя линия

	var topLinePar = {
		marshId: par.marshId,
		type: "top",
		//prevUnitEnd: par.pointsShape[par.pointsShape.length - 1],
		prevUnitEnd: par.botUnitEnd,
		isMiddleStringer: par.isMiddleStringer,
		};
	var marshTopLine = drawMarshSteps(topLinePar).points;
	if (params.stringerType != "прямая" || par.isMiddleStringer) par.pointsShape.push(...marshTopLine);
	if (params.stringerType == "прямая" && marshTopLine.length > 0 && !par.isMiddleStringer) par.pointsShape.push(marshTopLine[marshTopLine.length - 1]);

	//сохраняем точки для отладки
	par.keyPoints[par.key].marshTopStart = marshTopLine[0];
	par.keyPoints[par.key].marshTopEnd = marshTopLine[marshTopLine.length - 1];


	// нижняя линия
	if (params.stringerType == "ломаная"){
		var botLinePar = {
			marshId: par.marshId,
			type: "bot",
			prevUnitEnd: par.pointsShape[0],
			};
		var marshBotLine = drawMarshSteps(botLinePar).points;

		marshBotLine = marshBotLine.reverse();
		par.pointsShape.unshift(...marshBotLine);

		//сохраняем точки для отладки
		par.keyPoints[par.key].marshBotStart = marshBotLine[0];
		par.keyPoints[par.key].marshBotEnd = marshBotLine[marshBotLine.length - 1];
		}


	/*ОТВЕРСТИЯ*/
	var p0 = copyPoint(topLinePar.prevUnitEnd);
	if (par.isMiddleStringer)
		p0 = newPoint_xy(p0, -par.treadFrontOverhang, params.treadThickness + par.stringerLedge);
	if (params.startTreadAmt > 0 && par.marshId == 1) p0 = newPoint_xy(p0, -params.nose - par.stringerLedge, 0);


	if (params.calcType !== 'console') {
		
		// цикл начинаем со ступени №1
		for (var i = 0; i < par.stairAmt; i++) {
			var p1 = newPoint_xy(p0, par.b * i, par.h * i);


			/*ОТВЕРСТИЯ*/

			var stepHoleY = par.stepHoleY;
			var rackTopHoleY = par.rackTopHoleY;

			// отверстия под уголок/рамку ступени
			var hasTreadFixHoles = true;
			//ступень где есть перемычка на лестнице с уголками
			if (!hasTreadFrames() && par.bridge.indexOf(i + 1) != -1) hasTreadFixHoles = false;

			//ступень где есть соединительный фланец, кроме лотков и рифленых ступеней
			//if(params.stairType != "лотки" && params.stairType != "рифленая сталь" && params.stairType != "пресснастил") {
			//	if(i == par.divide-1) hasTreadFixHoles = false;
			//	}
			if (i == par.divide - 1) hasTreadFixHoles = false;

			if (hasTreadFixHoles) {
				//пригласительные ступени
				if (par.marshId == 1 && params.startTreadAmt > 0) {
					stepHoleY += params.treadThickness + par.stringerLedge;
					rackTopHoleY += params.treadThickness + par.stringerLedge;
				}

				var center1 = newPoint_xy(p1, par.stepHoleX1, stepHoleY);
				var center2 = newPoint_xy(center1, par.holeDist, 0.0);
				if (par.isMiddleStringer) {
					center1.isPltPFrame = center2.isPltPFrame = true;
					if (!par.midStringerFirst) center1.noBoltsFrame = center2.noBoltsFrame = true;
					center1.noZenk = center2.noZenk = true;
				}
				center1.partName = 'treadFix';
				center2.partName = 'treadFix';
				par.pointsHole.push(center1);
				par.pointsHole.push(center2);
				var angleHoleX1 = center1.x;
				var angleHoleX2 = center2.x;
			}

			// отверстия под перемычку
			if (!hasTreadFrames() && par.bridge.indexOf(i + 1) != -1) {
				var center1 = newPoint_xy(p1, par.b - 10 - 5.0 - 6.0 - 60 + 38.0, stepHoleY);
				if (par.b < 190)
					center1.x += 190 - par.b;
				var center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
				var center4 = newPoint_xy(p1, 45.0, stepHoleY);
				var center3 = newPoint_xy(center4, 50.0, 0.0);
				center4.partName = 'otherTreadFix';
				center3.partName = 'otherTreadFix';
				center1.hasAngle = center2.hasAngle = false; //уголки перемычки отрисовываются внутри drawBridge_2
				par.elmIns[par.key].bridges.push(newPoint_xy(center1, -38, 20));

				var angleHoleCoords = copyPoint(center3);
				center1.hasAngle = center2.hasAngle = false; //уголки перемычки отрисовываются внутри drawBridge_2
				if (par.isMiddleStringer) {
					center3.noBoltsInSide1 = center4.noBoltsInSide1 = true;
					par.elmIns[par.key].longBolts.push(center1);
					par.elmIns[par.key].longBolts.push(center2);
					par.elmIns[par.key].longBolts.push(center3);
					par.elmIns[par.key].longBolts.push(center4);
				}
				par.pointsHole.push(center2);
				par.pointsHole.push(center1);
				par.pointsHole.push(center4);
				par.pointsHole.push(center3);

			}

			// стыковка деталей тетивы

			if (i == par.divide - 1 && i > 0) {
				//позиция линии стыка кусков тетивы
				divideY = par.stringerLedge + params.treadThickness + 100 / 2;

				//if(params.stairType == "лотки" || params.stairType == "рифленая сталь" || params.stairType == "пресснастил")
				//	divideY = par.stringerLedge + calcTreadFixHeight() + 5 + 100 / 2 + params.treadThickness;


				var divideP1 = newPoint_xy(p1, 0.0, -divideY);
				if (par.isMiddleStringer) divideP1.x += 15;

				var divideP2 = itercection(divideP1, newPoint_xy(divideP1, 100, 0), p20, p21);
				// точка пересчечения линии стыка и нижней линии марша
				var trashShape = new THREE.Shape();
				if (params.stringerType == "прямая" && !par.isMiddleStringer) {
					divideP1 = itercection(divideP1, divideP2, p1, polar(p1, par.marshAng, 100.0));
				}
				if (params.stringerType == "ломаная") {
					divideP2 = newPoint_xy(divideP1, par.b + par.stringerWidth, 0.0);
				}
				addLine(trashShape, dxfPrimitivesArr, divideP1, divideP2, par.dxfBasePoint);

				//отверстия для уголка на фланце
				var center1 = newPoint_xy(p1, par.stepHoleX1, par.stepHoleY);
				//if (params.stairType == "лотки" || params.stairType == "рифленая сталь" || params.stairType == "пресснастил")
				//	center1.x += par.a - par.b + 2;
				//if (par.isMiddleStringer && (params.stairType == "лотки" || params.stairType == "рифленая сталь" || params.stairType == "пресснастил")) {
				//	center1.x += par.a - par.b + 2;
				//	center1.y -= params.treadThickness - par.stringerLedge;
				//}
				var center2 = newPoint_xy(center1, par.holeDist, 0.0);

				if (hasTreadFrames()) {
					center1.noBolts = center2.noBolts = true;
				}
				else {
					center1.noBoltsInSide1 = center2.noBoltsInSide1 = true;
				}

				var franPar = {
					divideP1: divideP1,
					divideP2: divideP2,
					marshId: par.marshId,
					isMiddleStringer: par.isMiddleStringer,
					angleHoles: {
						center1: center1,
						center2: center2,
					},
				}

				var holes = calcFlanHoles(franPar).holeCenters;
				par.pointsHole.push(...holes);
				if (par.isMiddleStringer) {
					par.elmIns[par.key].longBolts.push(...holes);
				}
				//сохраняем точки для расчета длин тетив
				par.keyPoints.divideP1 = copyPoint(divideP1);
				par.keyPoints.divideP2 = copyPoint(divideP2);

			}

			//Отверстия под ограждения (номера ступеней, где ставится стойка, считаются от 1)


			if (par.railing.indexOf(i + 1) != -1) {
				if (par.hasRailing) {

					if (params.railingModel != "Самонесущее стекло" && params.railingModel != "Трап") {
						center1 = newPoint_xy(p1, par.b * 0.5, rackTopHoleY);
						if (params.rackBottom == "боковое") {
							//смещаем стойку ближе к началу ступени
							var mooveX = center1.x - p1.x - 40; //40 - отступ отверстия от края ступени					
							//для 5 ступеней ставим стойку посередине между болтами уголка/рамки ступени
							if (par.stairAmt == 5 && typeof angleHoleX1 != 'undefined') {
								mooveX = center1.x - (angleHoleX2 + angleHoleX1) / 2
								if (hasTreadFrames()) mooveX += par.b; //непонятный костыль
							}
							center1 = newPoint_x1(center1, - mooveX, par.marshAng);
						}
						par.railingHoles.push(center1);
					}

					if (params.railingModel == "Трап") {
						var balOnlay = 150;
						center1 = polar(p1, par.marshAng - Math.PI / 2, balOnlay - 30);
						center1 = newPoint_xy(center1, 5, -5 - par.h / 2);
						center2 = polar(center1, par.marshAng + Math.PI / 2, 60);
						center1.noHole2 = center2.noHole2 = true; //второе отверстие делать не надо
						par.railingHoles.push(center1);
						par.railingHoles.push(center2);
					}

					if (params.railingModel == "Самонесущее стекло") {
						center1 = newPoint_xy(p1, par.rutelPosX, par.rutelPosY);
						center2 = newPoint_xy(center1, 0.0, -par.rutelDist);
						par.railingHoles.push(center1);
						par.railingHoles.push(center2);
					}

				}
			}


		} //end of cycle

	}

	if (params.calcType == 'console') {
		if (params.stringerModel == 'лист') {
			var flanPar = calcStringerConsoleFlanPar({ marshId: par.marshId, type: 'marsh' });
			var holes = flanPar.holesFlanAndStringer;
			for (var i = 0; i < par.stairAmt; i++) {
				var pt = newPoint_xy(p0,
					par.b * i + flanPar.shiftFlanX + par.treadFrontOverHang,
					par.h * i - par.addStringerWidth + flanPar.shiftFlanY - par.stringerLedge);
				for (var j = 0; j < holes.length; j++) {
					var center = newPoint_xy(pt, holes[j].x, holes[j].y);
					if (holes[j].noZenk) center.noZenk = holes[j].noZenk;
					if (holes[j].isFixWall) center.isFixWall = holes[j].isFixWall;
					par.pointsHole.push(center);
				}
				// стыковка деталей тетивы

				if (i == par.divide - 1 && i > 0) {
					//позиция линии стыка кусков тетивы
					divideY = par.stringerLedge + params.treadThickness + 100 / 2;

					var divideP1 = newPoint_xy(center, 0.0, -divideY);

					var divideP2 = itercection(divideP1, newPoint_xy(divideP1, 100, 0), p20, p21);
					// точка пересчечения линии стыка и нижней линии марша
					var trashShape = new THREE.Shape();
					if (params.stringerType == "прямая" && !par.isMiddleStringer) {
						divideP1 = itercection(divideP1, divideP2, p1, polar(p1, par.marshAng, 100.0));
					}

					addLine(trashShape, dxfPrimitivesArr, divideP1, divideP2, par.dxfBasePoint);

					var franPar = {
						divideP1: divideP1,
						divideP2: divideP2,
						marshId: par.marshId,
						isMiddleStringer: par.isMiddleStringer,
						angleHoles: {
							center1: center,
							center2: newPoint_xy(center, -par.holeDist, 0.0),
						},
					}

					var holes = calcFlanHoles(franPar).holeCenters;
					par.pointsHole.push(...holes);
					if (par.isMiddleStringer) {
						par.elmIns[par.key].longBolts.push(...holes);
					}
					//сохраняем точки для расчета длин тетив
					par.keyPoints.divideP1 = copyPoint(divideP1);
					par.keyPoints.divideP2 = copyPoint(divideP2);

				}
			}
		}
		if (params.stringerModel == 'короб') {
			var framePar = { marshId: par.marshId, type: 'marsh'}
			calcConsoleFramePar(framePar);

			var offsetX = 1;
			var offsetY = 8;

			for (var i = 0; i < par.stairAmt; i++) {
				var center = newPoint_xy(par.zeroPoint,
					par.b * i + par.a / 2 + par.stringerLedge,
					par.h * (i + 1) - params.treadThickness / 2);

				center.points = [
					newPoint_xy(center, -framePar.widthBox / 2 - offsetX, - framePar.heightBox / 2 - offsetY),
					newPoint_xy(center, -framePar.widthBox / 2 - offsetX, framePar.heightBox / 2 + offsetY),
					newPoint_xy(center, framePar.widthBox / 2 + offsetX, framePar.heightBox / 2 + offsetY),
					newPoint_xy(center, framePar.widthBox / 2 + offsetX, - framePar.heightBox / 2 - offsetY),
				]
				par.pointsHole.push(center);
			}
		}
	}

	//базовые точки для стыковки с другими частями косоура
	//http://6692035.ru/dev/mayorov/metal/imageLt/drawMiddleStepsLt.jpg - для ломанной и пилообразной
	//http://6692035.ru/dev/mayorov/metal/imageLt/drawMiddleStepsLt_Straight.jpg - для прямой
	par.midUnitEnd = p2;
	par.keyPoints[par.key].midUnitEnd = copyPoint(par.midUnitEnd);

}//end of drawMiddleStepsLt

/**
 * Верхние узлы
 */

/**
 * последний подъем если сверху перекрытие
 */
function drawTopStepLt_floor(par) {

	//размеры верхнего выступа
	var topLedgeWidth = 0;
	var topLedgeHeight = 0;
	if (params.topAnglePosition == "над ступенью" && !par.isMiddleStringer) {
		topLedgeWidth = 90;
		topLedgeHeight = 110;
	}
	if (params.topAnglePosition == "вертикальная рамка") {
		topLedgeWidth = 85;
		topLedgeHeight = par.h - 25;
	}
	// последняя проступь
	var topStepWidth = par.a + par.stringerLedge;
	if (params.topAnglePosition == "вертикальная рамка") topStepWidth = par.b + topLedgeWidth;

	if (par.stairAmt == 0) {
		topStepWidth = params.lastWinderTreadWidth + par.stringerLedge;
		if (params.topAnglePosition == "вертикальная рамка") topStepWidth += 40 + params.riserThickness;
		};
	
	/*ТОЧКИ КОНТУРА*/

	var p0 = par.pointsShape[par.pointsShape.length - 1];

	//вспомогательыне точки на нижней линии
	var pt = newPoint_xy(p0, 0, 0);
	//if (par.stairAmt <= 1) pt = newPoint_xy(p0, 0.0, -par.h);
	if (par.stairAmt == 0) pt = newPoint_xy(p0, 0.0, -par.h);
	var p20 = newPoint_xy(pt, par.b + (par.stringerWidth / Math.sin(par.marshAng)), 0.0)// первая точка на нижней линии марша
	if (params.stringerType == "прямая") p20.x -= par.b;
	var p21 = polar(p20, par.marshAng, 100.0); // вторая точка на нижней линии

	//последний подъем

	if (params.calcType == 'console') {
		//par.pointsShape[par.pointsShape.length - 1].y += 50;
		//p0 = par.pointsShape[par.pointsShape.length - 1];

		var pt = par.pointsShape[par.pointsShape.length - 2]
		p0 = itercection(pt, polar(pt, par.marshAng, 100), p0, polar(p0, Math.PI / 2, 100));
		par.pointsShape.pop();
		par.pointsShape.push(p0);
	}

	p1 = copyPoint(p0);

	var topLineP1 = newPoint_xy(p1, topStepWidth, 0.0);
	if (params.topFlan == "есть") topLineP1.x += 8;
	
	if (par.isMiddleStringer) {
		topLineP1.x -= par.treadFrontOverhang;
    }
    var topLineP1Tmp = copyPoint(topLineP1);
	//верхний выступ
	var topLedgePoints = [];

	if (topLedgeWidth != 0) {
		//верхняя проступь
		var p2 = newPoint_xy(topLineP1, -topLedgeWidth, 0.0);
		topLedgePoints.push(p2);

		//вертикальный участок
		var p3 = newPoint_xy(p2, 0.0, topLedgeHeight);
		topLedgePoints.push(p3);

		//горизонтальный участок
		var topLineP1 = newPoint_xy(p3, topLedgeWidth, 0.0);

		if (params.stringerType == "прямая") {
			topLedgePoints = [];
			//рассчитываем точку пересечения наклонной верхней линии и горизонтальной линиии верха выступа
			p11 = itercection(topLineP1, newPoint_xy(topLineP1, 100,0), p1, polar(p1, par.marshAng, 100))
			if (par.stairAmt > 1 && par.botEnd == "winder") par.pointsShape.pop();
			topLedgePoints.push(p11);
			}
		}

	if (par.stairAmt == 0 && par.botEnd == "winder" && par.key == "out" && params.stringerType !== "прямая")
		par.pointsShape.pop();

	// нижняя линия
	var botLinePoints = [];
	var backLineLength = par.stringerLedge + topLedgeHeight + params.treadThickness + calcTreadFixHeight() + 100 + 10; // 100 = ширина уголка, 10 = отступ от нижней грани уголка

	var botLineP1 = newPoint_xy(topLineP1, 0, -backLineLength);

	if (params.stringerType == "ломаная") {		
		if (par.stairAmt == 0 && par.botEnd == "winder") {
			if (par.key == "out" || (par.key == "in" && (par.pointsShape[0].x + 10) > topLineP1.x)) {
				par.pointsShape.shift();
				par.pointsShape.shift();
			}
			botLineP1 = itercection(par.pointsShape[0], newPoint_xy(par.pointsShape[0], 100, 0), topLineP1, newPoint_xy(topLineP1, 0, 100));
		}
		else {
			//модифицируем первую точку нижней линии марша чтобы она была на одном уровне по Y с botLineP1
			par.pointsShape[0].y = botLineP1.y
		}

		}

    if (params.stringerType != "ломаная") {
        var botLineP2 = itercection(p20, p21, topLineP1, newPoint_xy(topLineP1, 0, 100));
        if (par.stairAmt == 0 && par.botEnd == "winder") {
            botLineP2 = newPoint_xy(topLineP1Tmp, 0, -100);
        }
        else {
            //если уголок не помещается
            if (params.topAnglePosition == "под ступенью" && botLineP1.y < botLineP2.y) {
                botLineP2 = itercection(p20, p21, botLineP1, newPoint_xy(botLineP1, 100, 0));
                if ((botLineP1.x - botLineP2.x) > 10) botLinePoints.push(botLineP2);
            }
            else {
                botLineP1 = botLineP2;
            }
        }
    }


//	if (par.stairAmt > 1) par.pointsShape.push(p1);
	par.pointsShape.push(...topLedgePoints);
	topLineP1.filletRad = 0; //верхний угол тетивы не скругляется
	par.pointsShape.push(topLineP1);
	par.pointsShape.push(botLineP1);
	par.pointsShape.push(...botLinePoints);


	//сохраняем точку для расчета длины
	par.keyPoints.topPoint = copyPoint(topLineP1);

	/*ОТВЕРСТИЯ*/
	if (params.calcType !== 'console') {
		// отверстия под верхний крепежный уголок
		var angleOffset;

		if (params.topAnglePosition == "под ступенью" || par.isMiddleStringer) {
			angleOffset =
				-(par.stringerLedge +
					params.treadThickness +
					calcFrameParams({ marshId: par.marshId }).profHeight +
					20 +
					topLedgeHeight); //20 - отступ отверстия от края уголка
			if (par.isMiddleStringer) angleOffset += par.stringerLedge + params.treadThickness;
		}
		if (params.topAnglePosition == "над ступенью" && !par.isMiddleStringer) angleOffset = 85 - topLedgeHeight;
		if (params.topAnglePosition == "вертикальная рамка")
			angleOffset =
				-(params.treadThickness / 2 +
					50 +
					(params.treadThickness - 40) /
					2); // 20 = половина толщины ступени, 50 = расстояние от верхней грани рамки до середины верхнего овального отверстия

		if (params.topAnglePosition == "под ступенью" || params.topAnglePosition == "над ступенью") {
			center1 = newPoint_xy(topLineP1, -35 - (params.topFlan == "есть" ? 8 : 0), angleOffset);
			center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
			center1.hasAngle = center2.hasAngle = true;
			center1.pos = center2.pos = "topFloor";
			par.pointsHole.push(center2);
			par.pointsHole.push(center1);
		}
		if (params.topAnglePosition == "вертикальная рамка") {
			center1 = newPoint_xy(topLineP1, -20.0, angleOffset);
			center2 = newPoint_xy(center1, 0.0, -(par.h - 50 * 2));
			center1.hasAngle = center2.hasAngle = false;
			center1.pos = center2.pos = "topFrame";
			par.pointsHole.push(center2);
			par.pointsHole.push(center1);
		}

		//Отверстия под ограждения
		if (par.hasRailing) {

			if (params.railingModel != "Самонесущее стекло" && params.railingModel != "Трап") {
				center1 = newPoint_xy(p1, par.b * 0.5, par.rackTopHoleY);
				//удлиннение последней стойки
				var dyLastRack = calcLastRackDeltaY(); //функция в файле drawRailing_3.0;
				center1.x += dyLastRack / Math.tan(par.marshAng);
				if (par.stairAmt == 0) {
					center1 = newPoint_xy(topLineP1, -60, -20);
				}
				//сдвигаем последнюю стойку ближе к перекрытию
				if (params.rackBottom != "сверху с крышкой") {
					if (params.topAnglePosition == "вертикальная рамка" || params.topAnglePosition == "над ступенью") {
						var mooveX = topLineP1.x - center1.x - 60;
						if (params.topAnglePosition == "над ступенью") {
							mooveX -= 20;
							if (params.stairType == "лотки" ||
								params.stairType == "дпк" ||
								params.stairType == "рифленая сталь") mooveX += 10;
						}
						center1 = newPoint_x1(center1, mooveX, par.marshAng);
					}
					if (params.topAnglePosition == "под ступенью") {
						var mooveX = topLineP1.x - center1.x - 50;
						if (params.stairType == "лотки" ||
							params.stairType == "дпк" ||
							params.stairType == "рифленая сталь") mooveX -= 45;
						center1 = newPoint_x1(center1, mooveX, par.marshAng);
					}
				}

				//если отверстие под ограждение пересекается с другим отверстием
				if (par.pointsHole && params.rackBottom != "сверху с крышкой") {
					var center2 = newPoint_xy(center1, 0, -60);
					flag = true;
					while (flag) {
						if (findItercectionHoles(center1, par)) {
							if (findItercectionHoles(center2, par)) {
								center1 = newPoint_xy(center2, 0, 60);
								flag = false;
							}
						}
						else {
							if (findItercectionHoles(center2, par)) {
								center1 = newPoint_xy(center2, 0, 60);
								if (findItercectionHoles(center1, par)) {
									flag = false;
								}
							}
							else {
								flag = false;
							}
						}
					}
				}
				//if (par.pointsHole && params.rackBottom != "сверху с крышкой") {
				//	var center2 = newPoint_xy(center1, 0, -60);
				//	for (var i = 0; i < par.pointsHole.length - 1; i++) {
				//		if (par.pointsHole[i].x > (center1.x - 20) && par.pointsHole[i].x < (center1.x + 20)) {
				//			if (par.pointsHole[i].y > (center1.y - 20) && par.pointsHole[i].y < (center1.y + 20)) {
				//				var centerTemp = copyPoint(center1);
				//				center1.x = par.pointsHole[i].x - 20;
				//				center1.y -= (Math.abs(centerTemp.x - center1.x)) * Math.tan(par.marshAng);
				//			}
				//		}
				//	}
				//}


				par.railingHoles.push(center1);
			}

			if (params.railingModel == "Трап") {
				var balOnlay = 150;
				center1 = polar(p1, par.marshAng - Math.PI / 2, balOnlay - 30);
				center1 = newPoint_xy(center1, 5, -5 - par.h / 2);
				center2 = polar(center1, par.marshAng + Math.PI / 2, 60);
				center1.noHole2 = center2.noHole2 = true; //второе отверстие делать не надо
				par.railingHoles.push(center1);
				par.railingHoles.push(center2);
			}

			if (params.railingModel == "Самонесущее стекло") {
				if (par.stairAmt <= 2) {
					center1 = newPoint_xy(p1, par.a * 0.5 + 5, par.rutelPosY);
					if (par.stairAmt == 1) center1 = newPoint_xy(p1, topStepWidth - 50, -85);
					center2 = newPoint_xy(center1, 0, -par.rutelDist);
					par.railingHoles.push(center1);
					if (par.stairAmt !== 1) par.railingHoles.push(center2);
				}

				//сохраняем расстояние до края тетивы для самонесущего стекла

				par.keyPoints[par.key].botLineP10 = copyPoint(topLineP1);

			}

		}

	}

	if (params.calcType == 'console') {

	}


	//сохраняем координаты угла тетивы для самонесущего стекла
	par.keyPoints[par.key].botLineP10 = copyPoint(topLineP1);
	//Последний марш!
}//end of drawTopStepLt_floor

/**
 * последний подъем если сверху площадка (Г-образная лестница)
 */

function drawTopStepLt_pltG(par) {

	if (par.isMiddleStringer) {
		par.stringerWidthPlatform -= params.treadThickness + par.stringerLedge;
		par.stringerWidth -= params.treadThickness + par.stringerLedge;
		par.carcasAnglePosY += params.treadThickness + par.stringerLedge;
		par.stepHoleY += params.treadThickness + par.stringerLedge;
	}

	var p0 = par.pointsShape[par.pointsShape.length - 1];
	//вспомогательыне точки на нижней линии
	var p1 = newPoint_xy(p0, par.b, 0);	
	var p20 = newPoint_xy(p1, (par.stringerWidth / Math.sin(par.marshAng)), 0.0) // первая точка на нижней линии марша
	if (params.stringerType == "прямая") p20.x -= par.b;
	var p21 = polar(p20, par.marshAng, 100.0); // вторая точка на нижней линии
	if (params.stairModel == "П-образная трехмаршевая" && params.stairAmt2 == 0 && par.botEnd == "winder" && par.key == "in") {
		//var p20 = newPoint_xy(p0, (par.stringerWidth / Math.sin(par.marshAng)), 0.0)
		var p20 = newPoint_xy(p0, par.stringerWidth, 0.0)
		var p21 = par.pointsShape[0];
	}



	/*ТОЧКИ КОНТУРА*/

	//проступь последней ступени марша
	var p1 = newPoint_xy(p0, par.b, 0);
	if (par.stairAmt === 0) p1 = copyPoint(p0);

	// подъем ступени
	var p2 = newPoint_xy(p1, 0.0, par.h);
	if (params.stairModel == "П-образная трехмаршевая" && params.stairAmt2 == 0 && par.marshId == 2 && params.turnType_1 == "площадка") {
		if (par.key == "in") {
			var pt = newPoint_xy(par.pointsShape[par.pointsShape.length - 2], 0, par.h + params.treadThickness);
			p2 = itercection(pt, polar(pt, 0, 100), p1, polar(p1, Math.PI / 2, 100));
			p2.y += par.stringerLedge;
		}
	} 
	//if (par.stairAmt === 0) p2 = copyPoint(p1);;

	// проступь площадки
	var topLineP1 = newPoint_xy(p2, par.topEndLength, 0.0); //верхний правый угол
	if (par.isMiddleStringer) {
		topLineP1.x -= par.treadFrontOverhang;
	}
	if (params.stairModel == "Прямая с промежуточной площадкой" && par.marshId == 1)
		topLineP1.x -= 6;
	topLineP1.filletRad = 0; //верхний угол тетивы не скругляется

	if ((params.stringerType != "прямая" || par.isMiddleStringer) && par.stairAmt !== 0) {
		par.pointsShape.push(p1);
	}
	else {
		//if (par.stairAmt == 0 && !(params.stairModel == "П-образная трехмаршевая" && par.botEnd == "winder" && par.key == "out"))
		if (par.stairAmt == 0 && !(params.stairModel == "П-образная трехмаршевая" && par.key == "out"))
			par.pointsShape.pop();
	}

	//трехмаршевая 0 ступеней в среднем марше и нижний поворот площадка - тетива уходит под площадку
	if (params.stairModel == "П-образная трехмаршевая" && params.stairAmt2 == 0 && params.turnType_1 == "площадка" && par.key == "in") {
		var p2_m = newPoint_xy(p2, 0, -par.stringerLedge - params.treadThickness);
		var topLineP1_m = newPoint_xy(topLineP1, 0, -par.stringerLedge - params.treadThickness);
		topLineP1_m.filletRad = 0
		par.pointsShape.push(p2_m);
		par.pointsShape.push(topLineP1_m);
		if (par.marshId == 2) {
			p2 = newPoint_xy(p2_m, 0, 0);
			topLineP1 = newPoint_xy(topLineP1_m, 0, 0);
		}
	}
	else {
		if(par.isMiddleStringer){
			//p1.x += par.a - par.b - 5;
			p1.x += par.a - par.b + 5 + 5;
			p2.filletRad = 0;

			var middleP1 = newPoint_xy(p1, 0, params.treadThickness + 5);
			par.pointsShape.push(middleP1);
			middleP1.filletRad = 0;

			var middleP2 = newPoint_xy(p2, 0, -60 - 5);
			middleP2.filletRad = 0;
			par.pointsShape.push(middleP2);
			}
		par.pointsShape.push(p2);
		par.pointsShape.push(topLineP1);
	}


	// нижняя линия
	var botLinePoints = [];

	if (params.stringerType == "ломаная") {
		var botLineP2 = newPoint_xy(p2, par.stringerWidth, -par.stringerWidthPlatform);
		var botLineP1 = itercection(botLineP2, polar(botLineP2, 0, 100), topLineP1, polar(topLineP1, Math.PI / 2, 100));
		botLineP1.filletRad = 0; //нижний угол тетивы не скругляется
		var botLineP3 = newPoint_xy(p1, par.stringerWidth, -par.stringerWidth);
		botLinePoints.push(botLineP1);
		botLinePoints.push(botLineP2);
		botLinePoints.push(botLineP3);
	}

	if (params.stringerType != "ломаная") {
		var botLineP1 = newPoint_xy(topLineP1, 0.0, -par.stringerWidthPlatform);
		if (params.calcType == 'console') botLineP1.y -= par.addStringerWidth;
		botLineP1.filletRad = 0; //верхний угол тетивы не скругляется
		var botLineP2 = itercection(p20, p21, botLineP1, polar(botLineP1, 0, 100));
		if (par.botEnd == "winderTop0" && par.key == "in")
			var botLineP2 = itercection(par.botUnitStart, polar(par.botUnitStart, Math.PI / 2 - Math.PI / 18, 100), botLineP1, polar(botLineP1, 0, 100));

		botLinePoints.push(botLineP1);
		botLinePoints.push(botLineP2);
	}

	par.pointsShape.push(...botLinePoints);
	
	//сохраняем точку для расчета длины
	par.keyPoints[par.key].topPoint = copyPoint(topLineP1);
	par.keyPoints.topPoint = copyPoint(topLineP1);

	/*ОТВЕРСТИЯ*/
	if (params.calcType !== 'console') {
		//совпадают ли отверстия уголка крепления верхнего марша и перемычки
		var isHolesOverlap = true; //отверстия крепления уголка верхнего марша и перемычки совпадают
		if (par.stairAmt == 0) isHolesOverlap = false;

		//позиция отверстий под уголок крепления верхнего марша
		var turnParams = calcTurnParams(par.marshId);
		var topMarshAnlePosX = turnParams.topMarshOffsetX + params.stringerThickness + 30 + par.stringerLedge;

		if (!hasTreadFrames()) {

			// отверстия под перемычку 1
			center1 = newPoint_xy(p2, topMarshAnlePosX, par.carcasAnglePosY);
			center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
			center1.hasAngle = center2.hasAngle = false; //уголки перемычки отрисовываются внутри drawBridge_2

			//на внутренней стороне в перемычке не должно быть болтов на уголке, чтобы не было пересечения с длинными болтами
			var bridgeBasePoint = newPoint_xy(center1, -38.0, 20.0);
			if (isHolesOverlap) bridgeBasePoint.noBoltsOnBridge = true;
			if (par.stringerLast && params.platformTop == 'увеличенная') bridgeBasePoint.noBoltsOnBridge = false;
			par.elmIns[par.key].bridges.push(bridgeBasePoint);

			if (par.key == "in" && !par.stringerLast && isHolesOverlap) center1.noZenk = center2.noZenk = true;
			par.pointsHole.push(center2);
			par.pointsHole.push(center1);

			if (par.key == "in" && !isHolesOverlap) {
				// отверстия под уголок крепления верхнего марша
				center1 = newPoint_xy(p2, params.marshDist + 38, par.carcasAnglePosY);
				center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
				center1.hasAngle = center2.hasAngle = false;
				par.elmIns[par.key].bridges.push(newPoint_xy(center1, -38.0, 20.0));
				par.pointsHole.push(center2);
				par.pointsHole.push(center1);
			}

			// отверстия под 1 уголок площадки
			if (par.topEndLength < 790) {
				var holeDist = 50;
				var angleType = "У2-40х40х90";
				var angleHolePosX = 20;
			}
			else {
				var angleType = "У2-40х40х200";
				var angleHolePosX = par.angleHolePosX;
				var holeDist = par.holeDistU2_200;
			}

			if (par.topEndLength > 500) {
				var stepHoleXside1 = (par.topEndLength / 2 - 110 - 64) / 2 + 140 - holeDist / 2;
				center1 = newPoint_xy(p2, stepHoleXside1, par.stepHoleY);
				center2 = newPoint_xy(center1, holeDist, 0.0);
				par.pointsHole.push(center1);
				par.pointsHole.push(center2);
			}

			// отверстия под перемычку 2
			if (par.topEndLength > 600) {
				center1 = newPoint_xy(p2, ((par.topEndLength * 0.5) + 29), par.carcasAnglePosY);
				center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
				center1.hasAngle = center2.hasAngle = false; //уголки перемычки отрисовываются внутри drawBridge_2
				par.elmIns[par.key].bridges.push(newPoint_xy(center1, -38.0 - 29 - 39, 20.0));
				var pCentralHoles = copyPoint(center1);
				par.pointsHole.push(center2);
				par.pointsHole.push(center1);
			}

			// отверстия под 2 уголок площадки
			var stepHoleXside2 = (par.topEndLength / 2 - 64) / 2 + par.topEndLength / 2 - holeDist / 2;
			if (stepHoleXside2 > 0.0) {
				center1 = newPoint_xy(p2, stepHoleXside2, par.stepHoleY);
				center2 = newPoint_xy(center1, holeDist, 0.0);
				par.pointsHole.push(center1);
				par.pointsHole.push(center2);
			}
		}

		if (hasTreadFrames()) {
			var frameAmt = calcPltFrameParams(par.topEndLength, par.platformFramesParams.overhang).frameAmt;
			var frameWidth = calcPltFrameParams(par.topEndLength, par.platformFramesParams.overhang).frameWidth;

			var pCentralHoles = newPoint_xy(p2, par.platformLength * 0.5, par.stepHoleY);
			// отверстия под рамки под площадкой
			var begX = par.platformFramesParams.overhang + 5 + par.platformFramesParams.sideHolePosX;
			var i;
			var deltaX = 0;
			if (par.isMiddleStringer) {
				deltaX -= par.treadFrontOverhang;
			}
			for (i = 0; i < frameAmt; i++) {
				center1 = newPoint_xy(p2, begX + deltaX, par.stepHoleY);
				if (params.stairType == "пресснастил") center1.y += 5; //костыль
				center2 = newPoint_xy(center1, frameWidth - par.platformFramesParams.sideHolePosX * 2, 0.0);
				center1.isPltFrame = center2.isPltFrame = true;
				par.pointsHole.push(center1);
				par.pointsHole.push(center2);
				begX += frameWidth + 5.0;

				//длинные болты на среднем косоуре
				if (par.isMiddleStringer) {
					center1.isPltPFrame = center2.isPltPFrame = true;
					center1.noZenk = center2.noZenk = true;
				}
				if (params.calcType == 'vhod' && params.platformTop == 'увеличенная' && par.stringerLast) {
					//center1.isPltPFrame = center2.isPltPFrame = true;
					center1.noBoltsIn = center2.noBoltsIn = true;
					if (par.isMiddleStringer) center1.noBolts = center2.noBolts = true;
					//if (turnFactor == 1) center1.noBoltsOut = center2.noBoltsOut = true;
				}
			}
		}

		if (params.stairModel == 'Прямая горка' && params.stairType == 'рифленая сталь') {
			par.carcasAnglePosY -= 15;
		}
		if (par.key == "in" &&
			!par.stringerLast &&
			hasTreadFrames() &&
			params.stairModel !== "Прямая с промежуточной площадкой") {
			center1 = newPoint_xy(p2, topMarshAnlePosX, par.carcasAnglePosY);
			if (!isHolesOverlap)
				center1 = newPoint_xy(p2,
					-par.turnParams.topMarshOffsetZ + params.stringerThickness + 30,
					par.carcasAnglePosY);
			//if (!isHolesOverlap) center1 = newPoint_xy(p2, params.marshDist + 38, 85.0 - par.stringerWidthPlatform, par.carcasAnglePosY);
			center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
			center1.hasAngle = center2.hasAngle = false;
			if (hasTreadFrames()) center1.backZenk = center2.backZenk = true;
			if (!hasTreadFrames()) center1.noZenk = center2.noZenk = true;
			par.pointsHole.push(center2);
			par.pointsHole.push(center1);

			if (par.marshPar.isMiddleStringer) {
				center1 = newPoint_xy(p2,
					-turnParams.topMarshOffsetZ + (params.M + params.stringerThickness) / 2 + 30,
					par.carcasAnglePosY);
				center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
				center1.hasAngle = center2.hasAngle = false;
				if (hasTreadFrames()) center1.backZenk = center2.backZenk = true;
				if (!hasTreadFrames()) center1.noZenk = center2.noZenk = true;
				par.pointsHole.push(center2);
				par.pointsHole.push(center1);
			}
		}

		//if (params.M > 1100 && par.key == 'in') {
		//	center1 = newPoint_xy(p2, calcTreadLen() / 2 + 80, par.carcasAnglePosY);
		//	center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
		//	center1.hasAngle = center2.hasAngle = false;
		//	if (hasTreadFrames()) center1.backZenk = center2.backZenk = true;
		//	if (!hasTreadFrames()) center1.noZenk = center2.noZenk = true;
		//	par.pointsHole.push(center2);
		//	par.pointsHole.push(center1);
		//}

		//определяем что будет использоваться: уголок или фланец
		var isAngel = true;
		if ((params.stairModel == "Прямая с промежуточной площадкой" && par.marshId == 1) ||
			params.stairModel == "Прямая горка")
			isAngel = false;

		// отверстия под задний крепежный уголок
		if (isAngel) {
			var shiftHoleY = par.carcasAnglePosY;
			if (par.marshPar.lastMarsh) {
				shiftHoleY = -params.treadThickness - 5 - 20;
				if (hasTreadFrames() &&
				(params.stairType == "рифленая сталь" ||
					params.stairType == "лотки" ||
					params.stairType == "дпк")) {
					shiftHoleY -= par.platformFramesParams.profHeight + 5
					if (par.isMiddleStringer) shiftHoleY += params.treadThickness + 5;
				}
			}
			center1 = newPoint_xy(topLineP1, -30.0, shiftHoleY);
			center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
			center1.hasAngle = center2.hasAngle = true;
			if (params.topFlan == "есть" && par.stringerLast) {
				center1.pos = center2.pos = "topFloor";
				center1.x -= 5; // 5 - из-за того что ширина уголка становиться 70, тогда (70-60)/2 = 5
				center2.x -= 5;
				if (!(params.stairType == "рифленая сталь" || params.stairType == "лотки" | params.stairType == "дпк")) {
					center1.y -= 60; //60 - высота рамки
					center2.y -= 60; //60 - высота рамки
				}

			}
			if (params.platformRearStringer == "нет" && par.stringerLast) {
				center1.noBoltsInSide1 = center2.noBoltsInSide1 = true;
			}
			par.pointsHole.push(center2);
			par.pointsHole.push(center1);
			if (par.key == "in" &&
				!par.stringerLast &&
				!(params.stairModel == "П-образная трехмаршевая" && params.stairAmt2 == 0 && par.marshId == 1)) {
				center1.noZenk = center2.noZenk = true;
				center1.noBoltsInSide2 = center2.noBoltsInSide2 = true;
			}
		}

		// отверстия под соединительный фланец
		if (!isAngel) {
			center1 = newPoint_xy(topLineP1, -30.0, -par.stringerWidthPlatform + 85.0);
			center2 = newPoint_xy(center1, 0, -60.0);
			if (par.isMiddleStringer) {
				par.elmIns[par.key].longBolts.push(center1);
				par.elmIns[par.key].longBolts.push(center2);
			}
			//center3 = newPoint_xy(center1, -50.0, 0);
			//center4 = newPoint_xy(center3, 0, -60.0);
			center3 = newPoint_xy(topLineP1, 30.0, -par.stringerWidthPlatform + 85.0);
			center4 = newPoint_xy(center3, 0, -60.0);
			center1.hasAngle = center2.hasAngle = center3.hasAngle = center4.hasAngle = false;
			center3.noDraw = center4.noDraw = true;
			center1.isTopFlanHole = center2.isTopFlanHole = center3.isTopFlanHole = center4.isTopFlanHole = true;
			center1.pos = "topLeft";
			center2.pos = "botLeft";
			center3.pos = "topRight";
			center4.pos = "botRight";
			par.pointsHole.push(center1);
			par.pointsHole.push(center2);
			par.pointsHole.push(center3);
			par.pointsHole.push(center4);
			par.flanSidePointInsert = newPoint_xy(center1, -20.0, 20.0);

			//длинные болты на среднем косоуре
			if (par.isMiddleStringer && params.stairModel == "Прямая горка") {
				par.elmIns[par.key].longBolts.push(center1);
				par.elmIns[par.key].longBolts.push(center2);
				par.elmIns[par.key].longBolts.push(center3);
				par.elmIns[par.key].longBolts.push(center4);
			}
		}

		//Отверстия под ограждения

		/*
		par.hasRailing - есть ограждения на марше
		par.hasPltRailing - есть ограждения на площадке
		hasFirstPltRack == true - первая стойка ограждения площадки ставится на площадке, а не на последней ступени марша
		*/


		if (par.hasRailing || par.hasPltRailing) {
			var hasFirstPltRack = false; //есть ли первая стойка на площадке
			if (par.stringerLast) hasFirstPltRack = true;
			if (par.key == "out") hasFirstPltRack = true;
			if (params.stairModel == "Прямая с промежуточной площадкой") hasFirstPltRack = true;
			if (params.stairModel == 'Прямая горка') hasFirstPltRack = true;
			if (params.stairModel == 'Прямая горка' && params.railingModel == 'Ригели') hasFirstPltRack = false
			if (hasCustomMidPlt(par)) hasFirstPltRack = true;
			if (hasCustomMidPlt(par) &&
				par.key == 'in' &&
				(params.stairModel !== 'Прямая' || params.stairModel !== 'Прямая с промежуточной площадкой') &&
				params.middlePltLength < params.M + 200) hasFirstPltRack = false;
			if (par.hasPltRailing) hasFirstPltRack = true;
			if (params.stairModel == 'Прямая горка') hasFirstPltRack = true;

			if (params.railingModel != "Самонесущее стекло" && params.railingModel != "Трап") {

				if (hasFirstPltRack) {
					// отверстия под стойку ближе к маршу
					center1 = newPoint_xy(p2, par.b / 2, par.rackTopHoleY);
					if (!par.hasPltRailing) {
						center1 = newPoint_xy(p2, par.b * 0.5, par.rackTopHoleY);
					}
					par.railingHoles.push(center1);


					if ((par.hasPltRailing || par.hasPltRailing) && params.stairModel !== 'Прямая горка') {
						// отверстия под средние стойки
						var platformLength = par.platformLength;
						if (par.key == 'in' && hasCustomMidPlt(par)) {
							platformLength = params.middlePltLength - params.M;
						}
						if (par.key == 'out' && hasCustomMidPlt(par)) {
							platformLength = params.middlePltLength;
						}
						if (par.marshParams.lastMarsh) {
							platformLength = par.platformLength1;
						}
						//if (params.calcType == 'vhod' && par.marshParams.lastMarsh) {
						//	platformLength = par.platformLength1;
						//}


						if (platformLength > 1300 && params.railingModel !== "Кованые балясины") {
							var middleRackAmt = Math.round(platformLength / 800) - 1;
							if (middleRackAmt < 0) middleRackAmt = 0;
							var rackDist = (platformLength - 200) / (middleRackAmt + 1);
							if (middleRackAmt > 20) middleRackAmt = 2
							for (var i = 1; i <= middleRackAmt; i++) {
								var center11 = newPoint_xy(center1, rackDist * i, 0);
								par.railingHoles.push(center11);
							}
						}
						// отверстия под стойку ближе к углу
						var lastRackX = -80 + 8;
						if (par.key == 'in' && hasCustomMidPlt(par)) {
							lastRackX = -params.M + lastRackX; // - params.stringerThickness - 3 - 5;
						}
						if (par.key == 'out' && hasCustomMidPlt(par)) {
							lastRackX = -80 + 8;
						}
						if (params.rackBottom == "сверху с крышкой") lastRackX -= 80;
						center1 = newPoint_xy(topLineP1, lastRackX, par.rackTopHoleY);
						if (params.stairModel == "Прямая с промежуточной площадкой" && par.marshId == 1)
							center1.x -= 100;
						par.railingHoles.push(center1);

					}
				}
				//стойка ограждения ставится на последней ступени марша. На площадке на этой стороне нет ограждения
				if (!hasFirstPltRack) {
					center1 = newPoint_xy(p0, par.b * 0.5, par.rackTopHoleY);
					//смещаем стойку ближе к верхнему маршу
					var mooveY = params.treadThickness;
					if (params.stairType !== "лотки" || params.stairType !== "рифленая сталь") mooveY = 40;
					center1 = newPoint_y(center1, mooveY, par.marshAng)

					//если на следующем марше повортная стойка, стойку не рисуем и сохраняем сдвиг отверстия до края следующего марша
					if (par.key == "in" && !par.stringerLast) {
						if (par.nextMarshPar.hasRailing.in) {
							if (params.rackBottom == "сверху с крышкой")
								center1 = newPoint_xy(p0, par.b * 0.5, par.rackTopHoleY);
							center1.noDraw = true;
							//сохраняем сдвиг отверстия до края следующего марша (для расчета поручня и ригелей)
							center1.dxToMarshNext =
								-(center1.x - p0.x) + par.b + par.turnBotParams.topMarshOffsetX + 5 - 0.1;

							//отверстия для крепления поворотной стойки следущего марша
							//var center2 = newPoint_xy(p0, par.b + par.turnBotParams.topMarshOffsetX - 40 / 2 + 5, par.stepHoleY);
							var center2 = newPoint_xy(p2, 15, par.rackTopHoleY);
							center2.y -=
								setTurnRacksParams(par.marshPar.nextMarshId, par.key)
								.shiftBotFrame; //сдвиг кронштейна вниз чтобы не попадал на крепление рамки
							center2.noRack = true; // отверстие не учитывается при построении заграждения
							par.railingHoles.push(center2);

							if (par.botEnd == "winder") {
								center1.x -= 1;
								center2.x -= 1;
							}
						}
					}

					par.railingHoles.push(center1);
					//console.log(center1)
				}
			}

			if (params.railingModel == "Трап") {
				var balOnlay = 150;
				var pt = newPoint_xy(p0, -par.b, 0);
				center1 = polar(p0, par.marshAng - Math.PI / 2, balOnlay - 30);
				center1 = newPoint_xy(center1, 5, -5 - par.h / 2);
				center2 = polar(center1, par.marshAng + Math.PI / 2, 60);
				center1.noHole2 = center2.noHole2 = true; //второе отверстие делать не надо
				par.railingHoles.push(center1);
				par.railingHoles.push(center2);
			}

			if (params.railingModel == "Самонесущее стекло" && hasFirstPltRack) {

				// отверстия под последнее стекло марша
				center1 = newPoint_xy(p2, par.rutelPosX, par.rutelPosY);
				center2 = newPoint_xy(center1, 0.0, -par.rutelDist);
				par.railingHoles.push(center1);
				par.railingHoles.push(center2);

				if (par.hasPltRailing) {
					var isPlatformTopRailing = true;
					// отверстия под стойку 1
					var glassSectionLength = par.platformLength - par.b;
					center1 = newPoint_xy(p2, 425, par.stepHoleY + (topLineP1.y - p2.y));
					if (hasTreadFrames()) {
						center1 = newPoint_xy(p2, par.b + 100, par.stepHoleY + (topLineP1.y - p2.y));
					}
					center2 = newPoint_xy(center1, 0, -par.rutelDist);
					par.railingHoles.push(center1);
					par.railingHoles.push(center2);

					if (glassSectionLength > 1000) {
						// первое среднее
						center1 = newPoint_xy(pCentralHoles, -60, 0);
						center2 = newPoint_xy(center1, 0, -par.rutelDist);
						par.railingHoles.push(center1);
						par.railingHoles.push(center2);

						// второе среднее
						center1 = newPoint_xy(center1, 120, 0);
						center2 = newPoint_xy(center1, 0, -par.rutelDist);
						par.railingHoles.push(center1);
						par.railingHoles.push(center2);

					}
					// отверстия под стойку 2
					center1 = newPoint_xy(topLineP1, -60 - 5 - 30, par.stepHoleY);
					center2 = newPoint_xy(center1, 0, -par.rutelDist);
					if (hasTreadFrames()) {
						center1 = newPoint_xy(topLineP1, -60 - 5 - 30 - 60, par.stepHoleY);
						center2 = newPoint_xy(center1, 0, -par.rutelDist);
					}
					par.railingHoles.push(center1);
					par.railingHoles.push(center2);
				}

			}

		}

		// отверстия для подкосов верхней площадки
		if (par.stringerLast) {
			var pt = newPoint_xy(botLineP1, -par.topEndLength, 0);
			if (params.platformTopColumn === "подкосы" || params.topPltColumns === "подкосы") {
				var hasBrace = false;
				if (params.topPltConsolePos == "слева" && getSide()[par.key] == "right") hasBrace = true;
				if (params.topPltConsolePos == "справа" && getSide()[par.key] == "left") hasBrace = true;

				if (hasBrace) {
					var holeDistX = 95; //расстояние между отверстиями по горизонтали

					var center1 = newPoint_xy(pt, 180, 80);
					var center2 = newPoint_xy(center1, 0, -par.holeDistU4);
					var center3 = newPoint_xy(center1, holeDistX, 0);
					var center4 = newPoint_xy(center2, holeDistX, 0);
					center1.isBraceHole = center2.isBraceHole = center3.isBraceHole = center4.isBraceHole = true;
					center1.hasAngle = center2.hasAngle = center3.hasAngle = center4.hasAngle = false;
					par.pointsHole.push(center2);
					par.pointsHole.push(center1);
					par.pointsHole.push(center3);
					par.pointsHole.push(center4);


					//отверстия под второй подкос
					var center1 = newPoint_xy(pt, 140 + (params.platformLength_3 - 400), 80);
					var center2 = newPoint_xy(center1, 0, -par.holeDistU4);
					var center3 = newPoint_xy(center1, holeDistX, 0);
					var center4 = newPoint_xy(center2, holeDistX, 0);
					center1.isBraceHole = center2.isBraceHole = center3.isBraceHole = center4.isBraceHole = true;
					center1.hasAngle = center2.hasAngle = center3.hasAngle = center4.hasAngle = false;
					par.pointsHole.push(center1);
					par.pointsHole.push(center2);
					par.pointsHole.push(center3);
					par.pointsHole.push(center4);

				}
				if (params.topPltConsolePos == "сзади") {
					var center1 = newPoint_xy(pt, 260, 50);
					center1.isBraceHole = true;
					par.pointsHole.push(center1);

				}
			}
		}

		// отверстия для подкосов средней площадки
		if (!par.stringerLast && params.stairModel == "Прямая с промежуточной площадкой") {
			var pt = newPoint_xy(botLineP1, -par.topEndLength, 0);
			if (params.middlePltColumns === "подкосы") {
				var hasBrace = false;
				if (params.middlePltConsolePos == "слева" && getSide()[par.key] == "right") hasBrace = true;
				if (params.middlePltConsolePos == "справа" && getSide()[par.key] == "left") hasBrace = true;

				if (hasBrace) {
					var holeDistX = 95; //расстояние между отверстиями по горизонтали

					var center1 = newPoint_xy(pt, 180, 80);
					var center2 = newPoint_xy(center1, 0, -par.holeDistU4);
					var center3 = newPoint_xy(center1, holeDistX, 0);
					var center4 = newPoint_xy(center2, holeDistX, 0);
					center1.isBraceHole = center2.isBraceHole = center3.isBraceHole = center4.isBraceHole = true;
					center1.hasAngle = center2.hasAngle = center3.hasAngle = center4.hasAngle = false;
					par.pointsHole.push(center2);
					par.pointsHole.push(center1);
					par.pointsHole.push(center3);
					par.pointsHole.push(center4);


					//отверстия под второй подкос
					var center1 = newPoint_xy(pt, 140 + (params.middlePltLength - 400), 80);
					var center2 = newPoint_xy(center1, 0, -par.holeDistU4);
					var center3 = newPoint_xy(center1, holeDistX, 0);
					var center4 = newPoint_xy(center2, holeDistX, 0);
					center1.isBraceHole = center2.isBraceHole = center3.isBraceHole = center4.isBraceHole = true;
					center1.hasAngle = center2.hasAngle = center3.hasAngle = center4.hasAngle = false;
					par.pointsHole.push(center1);
					par.pointsHole.push(center2);
					par.pointsHole.push(center3);
					par.pointsHole.push(center4);

				}
				if (params.middlePltConsolePos == "сзади") {
					var center1 = newPoint_xy(pt, 260, 50);
					par.pointsHole.push(center1);

				}
			}
		}

		//крепление к стенам
		if (par.key == "out" && par.marshParams.wallFix.out) {
			var fixPar = getFixPart(par.marshId);
			//отверстие ближе к маршу
			center1 = newPoint_xy(p2, 150, -100);
			center1.rad = fixPar.diam / 2 + 1;
			center1.hasAngle = false;
			center1.noZenk = true;
			center1.noBolts = true;
			center1.wallFix = true;
			par.pointsHole.push(center1);
			//отверстие ближе к углу
			center1 = newPoint_xy(topLineP1, -100, -100);
			center1.rad = fixPar.diam / 2 + 1;
			center1.hasAngle = false;
			center1.noZenk = true;
			center1.noBolts = true;
			center1.wallFix = true;
			par.pointsHole.push(center1);
		}

		//сохраняем точку для колонны 
		if (params.stairModel == "Прямая с промежуточной площадкой" && par.marshId == 1) {
			par.keyPoints[par.key].platformEnd = topLineP1;
		}

	}

	if (params.calcType == 'console') {
		if (params.stringerModel == 'лист') {
			var flanPar = calcStringerConsoleFlanPar({ marshId: par.marshId, type: 'platformTop' });
			var holes = flanPar.holesFlanAndStringer;
			for (var i = 0; i < 2; i++) {
				var pt = newPoint_xy(p2,
					flanPar.widthTread * i + flanPar.widthTread / 2 - flanPar.widthFlan / 2 + par.treadFrontOverHang,
					- par.addStringerWidth + flanPar.shiftFlanY - par.stringerLedge);

				for (var j = 0; j < holes.length; j++) {
					var center = newPoint_xy(pt, holes[j].x, holes[j].y);
					if (holes[j].noZenk) center.noZenk = holes[j].noZenk;
					if (holes[j].isFixWall) center.isFixWall = holes[j].isFixWall;
					par.pointsHole.push(center);
				}
			}
		}

		if (params.stringerModel == 'короб') {
			var pTopOut = newPoint_xy(par.zeroPoint,
				par.b * (par.stairAmt) + par.stringerLedge + par.turnParams.turnLengthTop,// + calcStringerMoove(par.marshId).stringerOutMoove,
				par.h * (par.stairAmt + 1) - params.treadThickness / 2);

			var framePar = calcConsoleFramePar({ marshId: par.marshId, type: 'platformTop' });

			var offsetX = 1;
			var offsetY = 8;

			for (var i = 0; i < 2; i++) {
				var center = newPoint_xy(pTopOut, -framePar.widthTread * i - framePar.widthTread / 2, 0);

				center.points = [
					newPoint_xy(center, -framePar.widthBox / 2 - offsetX, - framePar.heightBox / 2 - offsetY),
					newPoint_xy(center, -framePar.widthBox / 2 - offsetX, framePar.heightBox / 2 + offsetY),
					newPoint_xy(center, framePar.widthBox / 2 + offsetX, framePar.heightBox / 2 + offsetY),
					newPoint_xy(center, framePar.widthBox / 2 + offsetX, - framePar.heightBox / 2 - offsetY),
				]
				par.pointsHole.push(center);
			}
		}
	}

	//сохраняем координаты угла тетивы для самонесущего стекла
	par.keyPoints[par.key].botLineP10 = newPoint_xy(p2, 35, 0);
	if (par.stringerLast) par.keyPoints[par.key].botLineP10 = newPoint_xy(p2, par.b, 0);
	if (isPlatformTopRailing && (par.key == 'out' || par.stringerLast)) par.keyPoints[par.key].botLineP10 = copyPoint(topLineP1);
	//точки на нижней линии марша для самонесущего стекла
	if (par.stairAmt <= 2) {
		var p10 = polar(par.midUnitEnd,
			(par.marshAng - Math.PI / 2),
			par.stringerWidth) // первая точка на нижней линии марша
		var p20 = polar(p10, par.marshAng, -100.0)
		par.keyPoints[par.key].marshBotLineP1 = copyPoint(p10)
		par.keyPoints[par.key].marshBotLineP2 = copyPoint(p20)
	}

}//end of drawTopStepLt_pltG


/**
 * последний подъем если сверху площадка (П-образная лестница внутренняя сторона)
 */
function drawTopStepLt_pltPIn(par) {

	var p0 = par.pointsShape[par.pointsShape.length - 1];
	var dh = 0; //уменьшение высоты тетивы, чтобы тетива была под ступенью
	dh = params.treadThickness + par.stringerLedge;
	//if (params.stairType !== "лотки") dh = params.treadThickness + par.stringerLedge;

	//вспомогательыне точки на нижней линии
	var p1 = newPoint_xy(p0, par.b, 0);
	var p20 = newPoint_xy(p1, (par.stringerWidth / Math.sin(par.marshAng)), 0.0) // первая точка на нижней линии марша
	if (params.stringerType == "прямая") p20.x -= par.b;
	var p21 = polar(p20, par.marshAng, 100.0); // вторая точка на нижней линии

	/*ТОЧКИ КОНТУРА*/

	//проступь последней ступени марша
	var p1 = newPoint_xy(p0, par.b, 0);

	// подъем ступени
	var p2 = newPoint_xy(p1, 0.0, par.h - dh);
	if (par.stairAmt === 0) p2 = copyPoint(p1);
	var ph = copyPoint(p2);

	if (params.stringerType == "прямая"){
		//угол наклона верхней линии должен быть равен углу наклона марша
		p2 = newPoint_xy(p1, 0, par.h);
		p2 = itercection(p2, polar(p2, par.marshAng, 100), ph, newPoint_xy(ph, 100, 0))
		}

	// проступь площадки
	var topLineP1 = newPoint_xy(ph, par.topEndLength, 0.0);
	var pt = copyPoint(topLineP1); //правый верхний угол
	if (!hasTreadFrames() && !par.stringerLast)
		topLineP1 = newPoint_xy(ph, 73, 0.0);


	// Нижняя линия
	var botLinePoints = [];

	if (params.stringerType == "ломаная") {
		//тетива из двух частей
		if (!hasTreadFrames() && !par.stringerLast) {
			var topLineP2 = {x: topLineP1.x, y: p1.y - par.stringerWidth};
			botLinePoints.push(topLineP2);
			}
		//цельная тетива
		if (hasTreadFrames() || par.stringerLast) {
			var topLineP2 = newPoint_xy(topLineP1, 0, -par.stringerWidthPlatform + dh)
			var topLineP4 = newPoint_xy(p1, par.stringerWidth, -par.stringerWidth)
			var topLineP3 = {x: topLineP4.x, y: topLineP2.y};
			topLineP2.filletRad = 0; //нижний угол тетивы не скругляется
			botLinePoints.push(topLineP2);
			botLinePoints.push(topLineP3);
			botLinePoints.push(topLineP4);

			}
		}

	if (params.stringerType != 'ломаная') {
		if (hasTreadFrames() || par.stringerLast) {
			var topLineP2 = newPoint_xy(topLineP1, 0.0, -par.stringerWidthPlatform + dh);
			topLineP2.filletRad = 0; //нижний угол тетивы не скругляется
			var topLineP3 = itercection(p20, p21, topLineP2, polar(topLineP2, 0, 100));
			botLinePoints.push(topLineP2);
			botLinePoints.push(topLineP3);
		}
		else {
			var topLineP2 = itercection(p20, p21, topLineP1, polar(topLineP1, Math.PI / 2, 100));
			botLinePoints.push(topLineP2);
		}
	}

	if (params.stringerType == "прямая") par.pointsShape.pop();
	if (params.stringerType != "прямая") par.pointsShape.push(p1);
	par.pointsShape.push(p2);
	topLineP1.filletRad = 0; //верхний угол тетивы не скругляется
	par.pointsShape.push(topLineP1);
	par.pointsShape.push(...botLinePoints);

	//удлинение внутренней тетивы площадки
	if (!hasTreadFrames() && !par.stringerLast) {
		var pt1 = newPoint_xy(topLineP1, params.stringerThickness, 0);
		var pt2 = copyPoint(pt);
		var pt3 = newPoint_xy(pt2, 0.0, -105);
		var pt4 = newPoint_xy(pt1, 0.0, -105);

		pt1.filletRad = pt2.filletRad = pt3.filletRad = pt4.filletRad = 0; //углы тетивы не скругляются
		par.pointsShapeTop.push(pt1);
		par.pointsShapeTop.push(pt2);
		par.pointsShapeTop.push(pt3);
		par.pointsShapeTop.push(pt4);
		
		//сохраняем длину для спецификации
		par.partsLen.push(distance(pt1, pt2))
	}

	//сохраняем точку для расчета длины
	par.keyPoints.topPoint = copyPoint(topLineP1);


	/*ОТВЕРСТИЯ*/

	if (!hasTreadFrames()) {

		var aTyp = "У2-40х40х200";
		var holeDist3 = 150.0;
		var angleHolePosX = 25.0;

		if (par.topEndLength < 790) {
			holeDist3 = 50;
			aTyp = "У2-40х40х90";
			angleHolePosX = 20;
		}

		var lenMiddlePlatform = (params.platformLength_1 + 7) / 2;
		if (par.stringerLast) lenMiddlePlatform = (params.platformLength_3 - 3) / 2;
		var centerPlatform = newPoint_xy(pt, -lenMiddlePlatform - 5, 0);
		//var centerPlatform = newPoint_xy(pt2, -lenMiddlePlatform - 5, 0);

		// отверстия под 1 уголок площадки (ближе к маршу)
		center1 = newPoint_xy(centerPlatform, -(lenMiddlePlatform - 75 - 60) / 2 - holeDist3 / 2, par.stepHoleY + 5 + params.treadThickness);		
		var center2 = newPoint_xy(center1, holeDist3, 0.0);
		if (par.stringerLast) {
			par.pointsHole.push(center1);
			par.pointsHole.push(center2);
		}
		else {
			par.pointsHoleTop.push(center1);
			par.pointsHoleTop.push(center2);
		}
		

		// отверстия под перемычку
		if (par.topEndLength > 600) {
			center1 = newPoint_xy(centerPlatform, (params.stringerThickness + 60) / 2, par.stepHoleY + 5 + params.treadThickness);
			center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
			center1.hasAngle = center2.hasAngle = false;
			if (par.stringerLast) {
				par.pointsHole.push(center1);
				par.pointsHole.push(center2);
			}
			else {
				par.pointsHoleTop.push(center1);
				par.pointsHoleTop.push(center2);
			}
		}

		// отверстия под перемычку
		if (par.stringerLast) {
			var turnParams = calcTurnParams(par.marshId);
			var topMarshAnlePosX = turnParams.topMarshOffsetX + params.stringerThickness + 30 + par.stringerLedge;
			center1 = newPoint_xy(ph, topMarshAnlePosX, par.carcasAnglePosY + dh);
			center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
			center1.hasAngle = center2.hasAngle = false; //уголки перемычки отрисовываются внутри drawBridge_2
			par.pointsHole.push(center2);
			par.pointsHole.push(center1);
		}

		// отверстия под 2 уголок площадки (ближе к углу)
		var stepHoleXside2 = par.topEndLength / 4 * 3 - holeDist3 / 2;
		if (stepHoleXside2 > 0.0) {
			center1 = newPoint_xy(centerPlatform, lenMiddlePlatform / 2 - holeDist3 / 2, par.stepHoleY + 5 + params.treadThickness);
			center2 = newPoint_xy(center1, holeDist3, 0.0);
			if (par.stringerLast) {
				par.pointsHole.push(center1);
				par.pointsHole.push(center2);
			}
			else {
				par.pointsHoleTop.push(center1);
				par.pointsHoleTop.push(center2);
			}
		}

		// отверстия под уголки крепления к поперечному косоуру площадки
		//уголок спереди
		if (!par.stringerLast) {
			center1 = newPoint_xy(ph, 43, -20.0);
			center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
			center1.hasAngle = center2.hasAngle = true;
			center1.noBoltsInSide1 = center2.noBoltsInSide1 = true;
			par.pointsHole.push(center2);
			par.pointsHole.push(center1);

			//уголок сзади
			center1 = newPoint_xy(center1, par.holeDistU4 + params.stringerThickness, 0.0);
			center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
			center1.hasAngle = center2.hasAngle = true;
			center1.rotated = center2.rotated = true;
			center1.noBoltsInSide1 = center2.noBoltsInSide1 = true;
			par.pointsHoleTop.push(center2);
			par.pointsHoleTop.push(center1);
		}
	}

	if (hasTreadFrames()) {
		// отверстия под рамки под площадкой

		var frameAmt = calcPltFrameParams(par.topEndLength, par.platformFramesParams.overhang).frameAmt;
		var frameWidth = calcPltFrameParams(par.topEndLength, par.platformFramesParams.overhang).frameWidth;

		var begX = par.platformFramesParams.overhang + 5.0 + par.platformFramesParams.sideHolePosX;
		var i;
		for (i = 0; i < frameAmt; i++) {
			center1 = newPoint_xy(ph, begX, par.stepHoleY + dh);
			if(params.stairType == "пресснастил") center1.y += 5; //костыль
			center2 = newPoint_xy(center1, frameWidth - par.platformFramesParams.sideHolePosX - par.platformFramesParams.sideHolePosX, 0.0);
			begX += frameWidth + 5.0;
		    par.pointsHole.push(center1);
            par.pointsHole.push(center2);
			center1.noZenk = center2.noZenk = true;

			if (params.platformTop == 'увеличенная' && par.stringerLast) {
				center1.isPltFrame = center2.isPltFrame = true;
				center1.isPltPFrame = center2.isPltPFrame = true;
			}
		}
	}


	// уголок крепления к задней тетиве
	var holePos = par.carcasAnglePosY + params.treadThickness + 5.0;
	if (par.marshPar.lastMarsh) holePos = - 20 - par.platformFramesParams.profHeight - 5;
	if (params.calcType == 'vhod') {
		//holePos = -35 + par.carcasAnglePosY;
		//holePos = 25 + par.carcasAnglePosY;
	}
	center1 = newPoint_xy(pt, -30.0, holePos);
	center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
	center1.hasAngle = center2.hasAngle = true;
	if (!hasTreadFrames()) {
		if (par.stringerLast) {
			par.pointsHole.push(center2);
			par.pointsHole.push(center1);
		}
		else {
			par.pointsHoleTop.push(center2);
			par.pointsHoleTop.push(center1);
		}
		}
	if (hasTreadFrames()) {
		par.pointsHole.push(center2);
		par.pointsHole.push(center1);
	}

	if (par.stringerLast && params.platformTop == 'увеличенная') {
		center1 = newPoint_xy(ph, 32.0, holePos);
		//if (params.stairType == "нет") center1.y += par.carcasAnglePosY;
		center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
		center1.hasAngle = center2.hasAngle = false;
		par.pointsHole.push(center2);
		par.pointsHole.push(center1);
	}


	//Отверстия под ограждения
	if (par.hasRailing) {

		if (params.railingModel != "Самонесущее стекло") {
			center1 = newPoint_xy(p0, par.b * 0.5, par.rackTopHoleY);
			//смещаем стойку чтобы она была вровень со стойкой верхнего марша
			center1 = newPoint_x1(center1, 30, par.marshAng);
			par.railingHoles.push(center1);
		}
		if (params.railingModel == "Самонесущее стекло") {

			center1 = center2 = 0;
		}
	}

	//сохраняем координаты угла тетивы для самонесущего стекла
	par.keyPoints[par.key].botLineP10 = copyPoint(ph);

	//точки на нижней линии марша для самонесущего стекла
	if (par.stairAmt <= 2) {
		var p10 = polar(par.midUnitEnd,
			(par.marshAng - Math.PI / 2),
			par.stringerWidth) // первая точка на нижней линии марша
		var p20 = polar(p10, par.marshAng, -100.0)
		par.keyPoints[par.key].marshBotLineP1 = copyPoint(p10)
		par.keyPoints[par.key].marshBotLineP2 = copyPoint(p20)
	}

}//end of drawTopStepLt_pltPIn

/**
 * последний подъем если сверху площадка (П-образная лестница внешняя)
 */
function drawTopStepLt_pltPOut(par) {

	var p0 = par.pointsShape[par.pointsShape.length - 1];

	var p1 = newPoint_xy(p0, par.b, 0);
	var p20 = newPoint_xy(p1, (par.stringerWidth / Math.sin(par.marshAng)), 0.0) // первая точка на нижней линии марша
	if (params.stringerType == "прямая") p20.x -= par.b;
	var p21 = polar(p20, par.marshAng, 100.0); // вторая точка на нижней линии

	/*ТОЧКИ КОНТУРА*/

	//проступь последней ступени марша
	var p1 = newPoint_xy(p0, par.b, 0);

	// подъем ступени
	var p2 = newPoint_xy(p1, 0.0, par.h);
	if (par.stairAmt === 0) p2 = copyPoint(p1);
	var ph = copyPoint(p2);


	// проступь площадки
	var topLineP1 = newPoint_xy(p2, par.topEndLength, 0.0);

	// нижняя линия
	var botLinePoints = [];

	if (params.stringerType == "ломаная") {
		var topLineP3 = newPoint_xy(p1, par.stringerWidth, par.h - par.stringerWidthPlatform);
		var topLineP2 = itercection(topLineP3, polar(topLineP3, 0, 100), topLineP1, polar(topLineP1, Math.PI / 2, 100));
		var topLineP4 = newPoint_xy(p1, par.stringerWidth, -par.stringerWidth);

		topLineP2.filletRad = 0; //нижний угол тетивы не скругляется
		botLinePoints.push(topLineP2);
		botLinePoints.push(topLineP3);
		botLinePoints.push(topLineP4);

	}
	if (params.stringerType != 'ломаная') {
		var topLineP2 = newPoint_xy(topLineP1, 0.0, -par.stringerWidthPlatform);
		if (params.calcType == 'console') topLineP2.y -= par.addStringerWidth;
		topLineP2.filletRad = 0; //нижний угол тетивы не скругляется
		var topLineP3 = itercection(p20, p21, topLineP2, polar(topLineP2, 0, 100));
		botLinePoints.push(topLineP2);
		botLinePoints.push(topLineP3);
	}

	if (params.stringerType == "прямая") par.pointsShape.pop();
	if (params.stringerType != "прямая") par.pointsShape.push(p1);
	par.pointsShape.push(p2);
	topLineP1.filletRad = 0; //верхний угол тетивы не скругляется
	par.pointsShape.push(topLineP1);
	par.pointsShape.push(...botLinePoints);

	//сохраняем точку для расчета длины
	par.keyPoints.topPoint = copyPoint(topLineP1);

	/*ОТВЕРСТИЯ*/
	if (params.calcType !== 'console') {
		if (!hasTreadFrames()) {

			if (par.topEndLength < 790) {
				var holeDistU2_200 = 50;
				var angleType = "У2-40х40х90";
				var angleHolePosX = 20;
			}
			else {
				var angleType = "У2-40х40х200";
				var angleHolePosX = par.angleHolePosX;
				var holeDistU2_200 = par.holeDistU2_200;
			}

			//уголок первого щита плолщадки (ближе к маршу))
			var stepHoleXside1 = (par.topEndLength / 2 - 110 - 64) / 2 + 140 - holeDistU2_200 / 2;
			center1 = newPoint_xy(ph, stepHoleXside1, par.stepHoleY);
			var center2 = newPoint_xy(center1, holeDistU2_200, 0.0);
			par.pointsHole.push(center1);
			par.pointsHole.push(center2);

			// отверстия под перемычку 2
			center1 = newPoint_xy(topLineP1, -(params.platformLength_1 / 2 - 25), -25.0 - params.treadThickness);
			center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
			center1.hasAngle = center2.hasAngle = false; //уголки перемычки отрисовываются внутри drawBridge_2
			par.elmIns[par.key].bridges.push(newPoint_xy(center1, -38.0 - 29 - 39, 20.0));
			var pCentralHoles = copyPoint(center1);
			par.pointsHole.push(center1);
			par.pointsHole.push(center2);

			// отверстия под 2 уголок площадки (ближе к углу)
			var stepHoleXside2 = (par.topEndLength / 2 - 64) / 2 + par.topEndLength / 2 - holeDistU2_200 / 2;
			if (stepHoleXside2 > 0.0) {
				//center1 = newPoint_xy(ph, stepHoleXside2, par.stepHoleY);
				center1 = newPoint_xy(topLineP1, -120, par.stepHoleY);
				center2 = newPoint_xy(center1, -holeDistU2_200, 0.0);
				par.pointsHole.push(center2);
				par.pointsHole.push(center1);
			}

			// отверстия под уголки крепления к поперечному косоуру площадки
			center1 = newPoint_xy(ph, 43.0, -25.0 - params.treadThickness);
			center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
			center1.hasAngle = center2.hasAngle = true;
			center1.noBoltsInSide1 = center2.noBoltsInSide1 = true;
			par.pointsHole.push(center2);
			par.pointsHole.push(center1);

		}

		if (hasTreadFrames()) {
			// отверстия под рамки под площадкой

			var frameAmt = calcPltFrameParams(par.topEndLength, par.platformFramesParams.overhang).frameAmt;
			var frameWidth = calcPltFrameParams(par.topEndLength, par.platformFramesParams.overhang).frameWidth;

			var begX = par.platformFramesParams.overhang + 5.0 + par.platformFramesParams.sideHolePosX;
			var i;
			for (i = 0; i < frameAmt; i++) {
				center1 = newPoint_xy(ph, begX, par.stepHoleY);
				center2 = newPoint_xy(center1,
					frameWidth - par.platformFramesParams.sideHolePosX - par.platformFramesParams.sideHolePosX,
					0.0);
				begX += frameWidth + 5.0;
				center1.isPltFrame = center2.isPltFrame = true;
				center1.isPltPFrame = center2.isPltPFrame = true;
				par.pointsHole.push(center1);
				par.pointsHole.push(center2);
			}
		}

		// уголок крепления к задней тетиве
		center1 = newPoint_xy(topLineP1, -30, par.carcasAnglePosY);
		center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
		center1.hasAngle = center2.hasAngle = true;
		par.pointsHole.push(center2);
		par.pointsHole.push(center1);

		//Отверстия под ограждения
		if (par.hasRailing) {
			if (params.railingModel != "Самонесущее стекло") {
				// отверстия под стойку ближе к маршу
				center1 = newPoint_xy(ph, par.b * 0.5, par.rackTopHoleY);
				if (!par.hasPltRailing) center1 = newPoint_xy(center1, -65, 0);
				par.railingHoles.push(center1);

				// отверстия под средние стойки
				if (params.platformLength_1 > 1500 && par.hasPltRailing) {
					var middleRackAmt = Math.round(params.platformLength_1 / 800) - 1;
					if (middleRackAmt < 0) middleRackAmt = 0;
					var rackDist = (params.platformLength_1 - 200) / (middleRackAmt + 1);
					for (var i = 1; i <= middleRackAmt; i++) {
						var center11 = newPoint_xy(center1, rackDist * i, 0);
						par.railingHoles.push(center11);
					}
				}

				// отверстия под стойку ближе к углу
				if (par.hasPltRailing) {
					center1 = newPoint_xy(topLineP1, -80 + params.stringerThickness, par.rackTopHoleY);
					par.railingHoles.push(center1);
				}
			}

			if (params.railingModel == "Самонесущее стекло") {


				// отверстия под последнее стекло марша
				center1 = newPoint_xy(ph, par.a * 0.5 + 5, par.rutelPosY);
				center2 = newPoint_xy(center1, 0.0, -par.rutelDist);
				par.railingHoles.push(center1);
				par.railingHoles.push(center2);

				if (par.hasPltRailing) {

					// крепление ближе к маршу

					var glassSectionLength = par.topEndLength - par.b;
					center1 = newPoint_xy(ph, 380, par.stepHoleY + (topLineP1.y - p2.y));
					if (hasTreadFrames()) {
						center1 = newPoint_xy(ph, par.b + 100, par.stepHoleY + (topLineP1.y - p2.y));
					}
					center2 = newPoint_xy(center1, 0, -par.rutelDist);
					par.railingHoles.push(center1);
					par.railingHoles.push(center2);


					if (glassSectionLength > 1000) {
						// первое среднее
						var pCentralHoles = newPoint_xy(ph, par.topEndLength * 0.5, par.stepHoleY);
						center1 = newPoint_xy(pCentralHoles, -60, 0);
						center2 = newPoint_xy(center1, 0, -par.rutelDist);
						par.railingHoles.push(center1);
						par.railingHoles.push(center2);


						// второе среднее
						center1 = newPoint_xy(center1, /*par.b*/ 120, 0);
						center2 = newPoint_xy(center1, 0, -par.rutelDist);
						par.railingHoles.push(center1);
						par.railingHoles.push(center2);

					}
					// крепление ближе к углу
					center1 = newPoint_xy(topLineP1, -60 - 5 - 30, par.stepHoleY);
					if (hasTreadFrames()) {
						center1 = newPoint_xy(topLineP1, -60 - 5 - 30 - 60, par.stepHoleY);
					}
					center2 = newPoint_xy(center1, 0.0, -par.rutelDist);
					par.railingHoles.push(center1);
					par.railingHoles.push(center2);
				}

			}

		}

		//сохраняем координаты угла тетивы для самонесущего стекла
		par.keyPoints[par.key].botLineP10 = copyPoint(topLineP1);

		//точки на нижней линии марша для самонесущего стекла
		if (par.stairAmt <= 2) {
			var p10 = polar(par.midUnitEnd,
				(par.marshAng - Math.PI / 2),
				par.stringerWidth) // первая точка на нижней линии марша
			var p20 = polar(p10, par.marshAng, -100.0)
			par.keyPoints[par.key].marshBotLineP1 = copyPoint(p10)
			par.keyPoints[par.key].marshBotLineP2 = copyPoint(p20)
		}

		//крепление к стенам
		if (par.key == "out" && par.marshParams.wallFix.out) {
			var fixPar = getFixPart(par.marshId);
			//отверстие ближе к маршу
			center1 = newPoint_xy(p2, 150, -100);
			center1.rad = fixPar.diam / 2 + 1;
			center1.hasAngle = false;
			center1.noZenk = true;
			center1.noBolts = true;
			center1.wallFix = true;
			par.pointsHole.push(center1);
			//отверстие ближе к углу
			center1 = newPoint_xy(topLineP1, -100, -100);
			center1.rad = fixPar.diam / 2 + 1;
			center1.hasAngle = false;
			center1.noZenk = true;
			center1.noBolts = true;
			center1.wallFix = true;
			par.pointsHole.push(center1);
		}
	}

	if (params.calcType == 'console') {
		if (params.stringerModel == 'лист') {
			var flanPar = calcStringerConsoleFlanPar({ marshId: par.marshId, type: 'platformTopP' });
			var holes = flanPar.holesFlanAndStringer;
			for (var i = 0; i < 2; i++) {
				var pt = newPoint_xy(p2,
					flanPar.widthTread * i + flanPar.widthTread / 2 - flanPar.widthFlan / 2 + par.treadFrontOverHang,
					- par.addStringerWidth + flanPar.shiftFlanY - par.stringerLedge);

				for (var j = 0; j < holes.length; j++) {
					var center = newPoint_xy(pt, holes[j].x, holes[j].y);
					if (holes[j].noZenk) center.noZenk = holes[j].noZenk;
					if (holes[j].isFixWall) center.isFixWall = holes[j].isFixWall;
					par.pointsHole.push(center);
				}
			}
		}
		if (params.stringerModel == 'короб') {
			var pTopOut = newPoint_xy(par.zeroPoint,
				par.b * (par.stairAmt) + par.stringerLedge + par.turnParams.turnLengthTop - (par.turnParams.pltExtraLen - par.turnParams.topStepDelta),// + calcStringerMoove(par.marshId).stringerOutMoove,
				par.h * (par.stairAmt + 1) - params.treadThickness / 2);

			var framePar = calcConsoleFramePar({ marshId: par.marshId, type: 'platformTopP' });

			var offsetX = 1;
			var offsetY = 8;

			for (var i = 0; i < 2; i++) {
				var center = newPoint_xy(pTopOut, -framePar.widthTread * i - framePar.widthTread / 2, 0);

				center.points = [
					newPoint_xy(center, -framePar.widthBox / 2 - offsetX, - framePar.heightBox / 2 - offsetY),
					newPoint_xy(center, -framePar.widthBox / 2 - offsetX, framePar.heightBox / 2 + offsetY),
					newPoint_xy(center, framePar.widthBox / 2 + offsetX, framePar.heightBox / 2 + offsetY),
					newPoint_xy(center, framePar.widthBox / 2 + offsetX, - framePar.heightBox / 2 - offsetY),
				]
				par.pointsHole.push(center);
			}
		}
	}

}//end of drawTopStepLt_pltPOut

/**
 * последний подъем если сверху забег (внутренняя сторона)
 */
function drawTopStepLt_wndIn(par) {

	//константы
	var stringerLedgeTop = 20 + (40 - params.treadThickness); //выступ тетивы над ступенью для последнего участка
	if(hasTreadFrames()) stringerLedgeTop -= 20;

	par.topEndLength = par.stringerLedge * 2 + par.turnStepsParams.params[1].stepWidthLow;

	/*ТОЧКИ КОНТУРА*/
	var p0 = par.pointsShape[par.pointsShape.length - 1];

	var pt = newPoint_xy(p0, par.b, 0);
	var p20 = newPoint_xy(pt, (par.stringerWidth / Math.sin(par.marshAng)), 0.0); // первая точка на нижней линии марша
	if (params.stringerType == "прямая") p20.x -= par.b;
	var p21 = polar(p20, par.marshAng, 100.0); // вторая точка на нижней линии

	//проступь последней ступени перед поворотом
	var step = par.b;
	if(par.stairAmt == 0) {
		step = 0;
		if(par.isWndP) {
			step = params.marshDist - 31 - par.stringerLedge;
			if(step < 10){
				par.topEndLength += step;
				step = 0;
				}
			}
		}

	var p1 = newPoint_xy(p0, step, 0);


	// подъем ступени
	if (params.stringerType == "прямая") {
		var pt = newPoint_xy(p1, 0.0, par.h);
		}

	var p2 = newPoint_xy(p1, 0.0, par.h + stringerLedgeTop);
	if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && params.stairAmt2 == 0 && par.botEnd == "platformG")
		p2.y -= params.treadThickness;

	// верхний край тетивы
	var topLineP1 = newPoint_xy(p2, par.topEndLength, 0.0);

	//удлиннение косоура под забегом
	if (par.longStringerTop) {
		var extraLen = {
			x: params.M - params.stringerThickness * 2 - 60 - 6, // 60 - размер уголка, 6 - отступ уголка от края
			y: par.h_topWnd * 2 - stringerLedgeTop - params.treadThickness - 40 - 5, //40 - высота рамки/уголка
			}
		var topLineP3 = newPoint_xy(topLineP1, extraLen.x, extraLen.y); //верхний правый угол
		var topLineP2 = newPoint_xy(topLineP3, -100, 0);
		var topLineP4 = newPoint_xy(topLineP3, 0, -120);
		var topLineP1 = newPoint_xy(topLineP1, 50, 0);
		}


		// нижняя линия
		var botLinePoints = [];

		if (params.stringerType == "ломаная") {
			var botLineP1 = {
				x: topLineP1.x,
				y: p0.y - par.stringerWidth,
				}
			if(par.stairAmt > 1) botLinePoints.push(botLineP1);
			//корректируем нижнюю точку, чтобы задняя линия была вертикальной
            if ((par.pointsShape[0].x > (topLineP1.x + 10)) && par.stairAmt !== 0) {
	            if (par.botEnd !== "floor") {
		            par.pointsShape.shift();
		            par.pointsShape.shift();
		            par.pointsShape.unshift(itercection(par.pointsShape[0],
			            polar(par.pointsShape[0], 0, 100),
			            topLineP1,
			            polar(topLineP1, Math.PI / 2, 100)));
				}
				if (par.botEnd == "floor") {
					var botLineP1 = itercection(p0, polar(p0, 0, 100), topLineP1, polar(topLineP1, Math.PI / 2, 100));
					var botLineP2 = itercection(botLineP1, polar(botLineP1, 0, 100), par.pointsShape[0], polar(par.pointsShape[0], Math.PI / 2, 100));
					botLinePoints.push(botLineP1);
					botLinePoints.push(botLineP2);
	            }
            }
			//внутренний промежуточный косоур П-образной с забегом
			if(par.stairAmt == 0){
				//нет уступа
				if(botLineP1.x - par.pointsShape[0].x < 10){
					par.pointsShape[0].x = botLineP1.x;
					par.pointsShape[1].x = botLineP1.x;
					}
				//есть уступ
				else{
					var botLineP1 = {
						x: topLineP1.x,
						y: par.pointsShape[0].y,
						}
					botLinePoints.push(botLineP1);
					}

				}
		}

		if (params.stringerType != "ломаная") {
			var botLineP1 = itercection(p20, p21, topLineP1, polar(topLineP1, Math.PI / 2, 100));
			if(par.stairAmt == 0) botLineP1 = newPoint_xy(topLineP1, 0, -240);
			botLinePoints.push(botLineP1);
			}

		if (params.stringerType == "прямая" && par.stairAmt !== 0) {
			if (!(par.stairAmt == 1 && par.botEnd == 'winder')) par.pointsShape.pop();
		}
		if (params.stringerType != "прямая" && step != 0) par.pointsShape.push(p1);
		
	//if (params.stringerType == "прямая" && !(par.stairAmt == 0 && params.marshDist < 85)) par.pointsShape.push(pt);
	par.pointsShape.push(p2);
	par.pointsShape.push(topLineP1);
	if(par.longStringerTop) par.pointsShape.push(topLineP2, topLineP3, topLineP4);
	
	//добавляем нижнюю линию, если она не вертикальна
	if(par.pointsShape[0].x != botLineP1.x) par.pointsShape.push(...botLinePoints);

	//сохраняем точку для расчета длины
	par.keyPoints.topPoint = copyPoint(topLineP1);
	if(par.longStringerTop) par.keyPoints.topPoint = copyPoint(topLineP3);


	/*ОТВЕРСТИЯ*/

	// отверстия под уголки крепления верхнего марша

	var holeCoordX1 = 74;
	var angleDist = 5;
	if (!hasTreadFrames()) angleDist = 20; //для лестницы без рамок нижнее отверстие должно совпадать с отверстием под перемычку

	if (params.stairModel == "П-образная трехмаршевая" &&par.marshId == 2 &&params.stairAmt2 == 0 &&par.botEnd == "platformG") {
		var center1 = newPoint_xy(p2, holeCoordX1, -(stringerLedgeTop + params.treadThickness + 25));
		if (hasTreadFrames()) center1.y -= 60 / 2; //для лестницы с рамками отверстие рамки по середине высоты уголка
		var center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
		center1.hasAngle = center2.hasAngle = false;
		if (!hasTreadFrames()) center1.noZenk = center2.noZenk = true;
		par.pointsHole.push(center1);
		par.pointsHole.push(center2);
	}
	else {
		//верхний уголок
		var center1 = newPoint_xy(p2, holeCoordX1, -(stringerLedgeTop + params.treadThickness + 25));
		if (hasTreadFrames()) center1.y -= 60 / 2; //для лестницы с рамками отверстие рамки по середине высоты уголка
		var center2 = newPoint_xy(center1, 0.0, par.holeDistU4);
		center1.hasAngle = center2.hasAngle = false;
		if (!hasTreadFrames()) {
			center1.noZenk = true;
			center2.backZenk = true;
			}
		if (hasTreadFrames()) {
			center1.backZenk = center2.backZenk = true;
			}
		
		par.pointsHole.push(center1);
		par.pointsHole.push(center2);

		// второй уголок
		center1 = newPoint_xy(center1, 0.0, -(40 + angleDist))
		center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
		center1.hasAngle = center2.hasAngle = false;
		if (!hasTreadFrames()) {
			center1.noZenk = true;
			center2.backZenk = true;
			}
		if (hasTreadFrames()) {
			center1.backZenk = center2.backZenk = true;
			}
		par.pointsHole.push(center1);
		par.pointsHole.push(center2);
	}


	if (hasTreadFrames()) {

		// отверстия под рамки забежных ступеней

			// отверстия под первую забежную рамку
			var holePar = {
				holes: par.wndFramesHoles.botMarsh.in[1],
				basePoint: newPoint_xy(p1, par.stringerLedge + par.wndSteps.frameFrontOffset, par.h - (par.stringerLedge + params.treadThickness)),
		}
		if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && params.stairAmt2 == 0 && par.botEnd == "platformG") 
			holePar.holes[0].y -= params.treadThickness;

			par.pointsHole.push(...calcWndHoles(holePar));

	}

	//уголок на продлении тетивы
	if(par.longStringerTop){
		var center1 = newPoint_xy(topLineP3, -30, -25);
		var center2 = newPoint_xy(center1, 0, -60);
		center1.hasAngle = center2.hasAngle = true;
		par.pointsHole.push(center2);
		par.pointsHole.push(center1);		
		}
		
	//Отверстия под ограждения
	if (par.hasRailing) {

		if (params.railingModel != "Самонесущее стекло") {
			center1 = newPoint_xy(p0, par.b * 0.5, par.rackTopHoleY);
			//смещаем стойку ближе к верхнему маршу
			center1 = newPoint_y(center1, params.treadThickness, par.marshAng)

			//если на следующем марше повортная стойка, стойку не рисуем и сохраняем сдвиг отверстия до края следующего марша
			if (params.stairModel == "П-образная с забегом" || params.stairModel == "П-образная с площадкой")
				par.nextMarshPar.hasRailing.in = false;
			if (par.nextMarshPar.hasRailing.in) {
				center1.noDraw = true;
				//сохраняем сдвиг отверстия до края следующего марша (для расчета поручня и ригелей)
				center1.dxToMarshNext = -(center1.x - p0.x) + par.b + par.turnBotParams.topMarshOffsetX + 5 - 0.1;

				//отверстия для крепления поворотной стойки следущего марша
				var center2 = newPoint_xy(p0, par.b + par.turnBotParams.topMarshOffsetX + 5 - 40 / 2, par.rackTopHoleY);
				center2.y -= setTurnRacksParams(par.marshId + 1, par.key).shiftBotFrame;//сдвиг кронштейна вниз чтобы не попадал на крепление рамки
				center2.noRack = true;// отверстие не учитывается при построении заграждения
				par.railingHoles.push(center2);
			}

			par.railingHoles.push(center1);
		}

		if (params.railingModel == "Самонесущее стекло") {
			center1 = center2 = 0;
			if (par.botEnd == "winder" && par.stairAmt == 2) {
				center1 = newPoint_xy(p0, par.rutelPosX, par.rutelPosY);
				center2 = newPoint_xy(center1, 0.0, -par.rutelDist);
				par.railingHoles.push(center1);
				par.railingHoles.push(center2);
			}
		}
	}


	//сохраняем координаты угла тетивы для самонесущего стекла
	par.keyPoints[par.key].botLineP10 = newPoint_xy(p2, 36, 0);

	//точки на нижней линии марша для самонесущего стекла
	//if (par.stairAmt == 2 && par.botEnd !== "floor") {
	//	var p10 = polar(par.midUnitEnd,
	//		(par.marshAng - Math.PI / 2),
	//		par.stringerWidth) // первая точка на нижней линии марша
	//	var p20 = polar(p10, par.marshAng, -100.0)

	//	p10 = polar(p10, par.marshAng + Math.PI / 2, 30);
	//	p20 = polar(p20, par.marshAng + Math.PI / 2, 30);

	//	par.keyPoints[par.key].marshBotLineP1 = copyPoint(p10)
	//	par.keyPoints[par.key].marshBotLineP2 = copyPoint(p20)
	//}

}//end of drawTopStepLt_wndIn

/**
 * последний подъем если сверху забег (внешняя сторона)
 */
function drawTopStepLt_wndOut(par) {

	//константы
	var angleHoleY = 20;						    // отступ от низа ступени до центра отверстия крепления уголка
	var angelLenght = 20 + par.holeDistU4 + 20;	// длина уголка
	var angleClearance = 5;							// зазор между уголками
	var wndBottomAngle = 10 * Math.PI / 180;			// угол нижней линии тетивы под забежной частью


	var totalLengthWndOut = params.M + 31 + par.stringerLedge - params.stringerThickness;

	if (par.stairAmt == 0 || par.stairAmt == 1) {
		wndBottomAngle = 18 * Math.PI / 180;
		if (!hasTreadFrames()) totalLengthWndOut += 3;
	}

	var backLineLength = par.stringerLedge + params.treadThickness + par.profileHeight + angleClearance + angelLenght + angleClearance + angelLenght + angleClearance;		// длинна задней вертикальной линии тетивы


	/*ТОЧКИ КОНТУРА*/

	var p0 = par.pointsShape[par.pointsShape.length - 1];

	var p1 = newPoint_xy(p0, par.b, 0);
	var p20 = newPoint_xy(p1, (par.stringerWidth / Math.sin(par.marshAng)), 0.0); // первая точка на нижней линии марша
	if (params.stringerType == "прямая") p20.x -= par.b;
	var p21 = polar(p20, par.marshAng, 100.0); // вторая точка на нижней линии

	//проступь последней ступени перед поворотом
	var p1 = copyPoint(p0);
	if(par.stairAmt > 0) p1 = newPoint_xy(p0, par.b, 0);

	// первая забежная ступень

	var p2 = copyPoint(p1);
	if(par.stairAmt > 0 || par.isWndP) p2 = newPoint_xy(p1, 0.0, par.h);
	var p3 = newPoint_xy(p2, par.wndSteps[1].out.botMarsh, 0.0);

	// вторая забежная ступень
	var p4 = newPoint_xy(p3, 0.0, par.h_next);
	var p5 = newPoint_xy(p4, par.wndSteps[2].out.botMarsh, 0);
	if (params.calcType == 'console') {
		p5.x += params.stringerThickness + calcStringerMoove(par.marshId).stringerOutMooveNext
		if (params.stringerModel == 'лист') p5.x += 8;
		if (par.isWndP) p5.x += 10;
	}

	//задняя линия
	var botLineP1 = newPoint_xy(p5, 0, -backLineLength);

	// нижняя линия

	var botLinePoints = [];

	if (params.stringerType == "ломаная") {
		var p7 = newPoint_xy(p3, par.stringerWidth, - par.stringerWidth);
		var p6 = {x: p7.x, y: botLineP1.y,};
		var p8 = newPoint_xy(p2, par.stringerWidth, - par.stringerWidth);
		var p9 = newPoint_xy(p1, par.stringerWidth, - par.stringerWidth);
		if(par.stairAmt == 0) p7.y = 0; //делаем нижнюю кромку прямой на уровне пола
		botLinePoints.push(p6, p7);
		if(par.stairAmt > 1) botLinePoints.push(p8, p9)

		}

	if (params.stringerType != "ломаная") {
		var ang = calcAngleX1(p2, p4);
		var botLineP2 = itercection(p20, p21, botLineP1, polar(botLineP1, ang, 100));
		if (par.stairAmt > 2) botLinePoints.push(botLineP2);; //если меньше 2 ступеней нижняя линия без перелома
		}

		//корректируем форму для прямой тетивы
	if (params.stringerType == "прямая") {
		var p2s = polar(p2, par.marshAng, 100);
		var p5s = newPoint_xy(p5, 0, 100);
		p5s.filletRad = 0;
		if (par.isWndP)
			p2s = newPoint_xy(p5s, -100, 0)
		if (params.calcType == 'console' && params.stringerModel == 'короб') {
			if (par.isWndP) {
				var p2s = newPoint_xy(p5s, -params.stringerThickness, 0)
			}
			if (!par.isWndP) {
				//var p2s = copyPoint(p4)
				var p4s = newPoint_xy(p5s, -params.stringerThickness, 0)
			}
		}
			
		if (par.stairAmt == 0 && par.botEnd == "floor") {
			p2s = copyPoint(p2)
			var p4s = copyPoint(p4)
		}
		}

	//сохраняем точки контура
	p5.filletRad = botLineP1.filletRad = 0;

	if (params.stringerType !== "прямая") {
		if(par.stairAmt > 0) par.pointsShape.push(p1);
		if(par.stairAmt > 0 || par.isWndP) par.pointsShape.push(p2);
		par.pointsShape.push(p3);
		par.pointsShape.push(p4);
		par.pointsShape.push(p5);
		}
	if (params.stringerType == "прямая") {
		//if(par.isWndP) par.pointsShape.pop();
		par.pointsShape.pop();
		par.pointsShape.push(p2s);
		if(p4s) par.pointsShape.push(p4s);
		par.pointsShape.push(p5s);
		}
	par.pointsShape.push(botLineP1);
	par.pointsShape.push(...botLinePoints);

	//сохраняем точки для отладки
	par.keyPoints[par.key].topEnd = p1;
	par.keyPoints[par.key].topEndCol = p5;
	
	
	//сохраняем точку для расчета длины
	par.keyPoints.topPoint = copyPoint(p5);
	if (p5s) par.keyPoints.topPoint = copyPoint(p5s);

	/*ОТВЕРСТИЯ*/
	if (params.calcType !== 'console') {
		// отверстия под уголки крепления верхнего марша
		// первый уголок
		center1 =
			newPoint_xy(p5,
				-30,
				-(par.stringerLedge +
					params.treadThickness +
					par.profileHeight +
					25)); // здесь 25 - это расстояние от фланца рамки до верхнего отверстия в уголке
		center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
		center1.hasAngle = center2.hasAngle = false;
		par.pointsHole.push(center1);
		par.pointsHole.push(center2);

		// второй уголок
		center1 = newPoint_xy(center2, 0.0, -105)
		center2 = newPoint_xy(center1, 0.0, par.holeDistU4);
		center1.hasAngle = center2.hasAngle = false;
		par.pointsHole.push(center1);
		par.pointsHole.push(center2);

		if (hasTreadFrames()) {
			// отверстия под первую забежную рамку
			var holePar = {
				holes: par.wndFramesHoles.botMarsh.out[1],
				basePoint: newPoint_xy(p2,
					par.stringerLedge + par.wndSteps.frameFrontOffset,
					-(par.stringerLedge + params.treadThickness)),
			}
			par.pointsHole.push(...calcWndHoles(holePar));

			// отверстие под вторую забежную рамку
			var holePar = {
				holes: par.wndFramesHoles.botMarsh.out[2],
				basePoint: newPoint_xy(p5, 0, -(par.stringerLedge + params.treadThickness)),
			}
			par.pointsHole.push(...calcWndHoles(holePar));
			var centerHoleWnd1 =
				par.pointsHole[par.pointsHole.length -
					1]; //запоминаем второе отверстие рамки для расчета пересечения отверстия ограждения

		}

		if (!hasTreadFrames()) {

			// отверстия под перемычку
			if ((par.stairAmt > 0 || par.marshId != 1) && params.calcType != 'bolz') {
				var center1 = newPoint_xy(p2, 74.0, -(5 + params.treadThickness + 20));
				var center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
				center1.hasAngle = center2.hasAngle = false; //уголки перемычки отрисовываются внутри drawBridge_2

				//на внутренней стороне в перемычке не должно быть болтов на уголке, чтобы не было пересечения с длинными болтами
				var bridgeBasePoint = newPoint_xy(center1, -38.0, 20.0);
				bridgeBasePoint.noBoltsOnBridge = true;
				par.elmIns[par.key].bridges.push(bridgeBasePoint);

				par.pointsHole.push(center1);
				par.pointsHole.push(center2);
			}


			//отверстия под уголки первой забежной ступени

			var angPar = calcWndParams(); //функция в файле drawCarcas.js


			angleHoleOffsetX = par.turnStepsParams.params[1].stepWidthHi - 60;

			center1 = newPoint_xy(p2, angleHoleOffsetX, par.stepHoleY)
			center2 = newPoint_xy(center1, -angPar.angleHoleDist, 0);
			center1.partName = 'wndTreadFix';
			center2.partName = 'wndTreadFix';
			par.pointsHole.push(center2);
			par.pointsHole.push(center1);

			//дополнительный уголок первой забежной ступени
			if ((par.marshId == 1 && par.stairAmt == 0) || params.calcType == 'bolz') {
				if (params.calcType == 'bolz') center1 = newPoint_xy(p2, 50, par.stepHoleY)
				if (par.marshId == 1 && par.stairAmt == 0) center1 = newPoint_xy(p1, 50, par.stepHoleY)
				center2 = newPoint_xy(center1, angPar.angleHoleDist, 0);
				par.pointsHole.push(center1);
				par.pointsHole.push(center2);
			}

			//отверстия под уголки второй забежной ступени

			angleHoleOffsetX = 60;

			center1 = newPoint_xy(p4, angleHoleOffsetX, par.stepHoleY);
			center2 = newPoint_xy(center1, angPar.angleHoleDist, 0);
			center1.partName = 'wndTreadFix';
			center2.partName = 'wndTreadFix';
			par.pointsHole.push(center1);
			par.pointsHole.push(center2);

			var centerHoleWnd1 =
				par.pointsHole[par.pointsHole.length -
					1]; //запоминаем второе отверстие рамки для расчета пересечения отверстия ограждения

		}

		//Отверстия под ограждения
		if (par.hasRailing) {

			if (params.railingModel != "Самонесущее стекло") {
				// отверстия под стойку 2 (ближнюю к углу)
				center1 = newPoint_xy(p5, -80 + params.stringerThickness, par.rackTopHoleY);
				//if (par.nextMarshPar.hasRailing.out || (params.stairModel == "П-образная с забегом" && par.marshId == 1 && params.backRailing_2 == "есть"))
				//	center1 = newPoint_xy(center1, -100, 0);

				//если отверстия стойки и второй забежной рамки или уголка крепления второй забежной ступени пересекаются, сдвигаем отверстие стойки
				if (Math.abs(center1.x - centerHoleWnd1.x) < 15)
					center1.x = centerHoleWnd1.x - 15;
				par.railingHoles.push(center1);

				//заднее ограждение забега П-образной
				if (par.stairAmt == 0 && par.botEnd == "winder") {
					center1 = newPoint_xy(p5, -80 + params.stringerThickness, par.rackTopHoleY);
					var deltaX = params.M * 2 + params.marshDist - 80 * 2;
					var deltaY = par.h * 3;
					var handrailAngle = Math.atan(deltaY / deltaX);
					center1 = newPoint_y(center1, -par.h, handrailAngle);
					par.railingHoles.push(center1);
				}
				else {
					center1 = newPoint_xy(p2, par.b * 0.5, par.rackTopHoleY);
					//смещаем стойку ближе к началу ступени
					var mooveX = center1.x - p2.x - 40; //40 - отступ отверстия от края ступени	
					center1 = newPoint_x1(center1, - mooveX, par.marshAng);

					if (par.stairAmt > 1) par.railingHoles.push(center1);
					if (par.stairAmt == 1 && params.stairModel == "П-образная трехмаршевая" && par.marshId == 2)
						par.railingHoles.push(center1);
					if (par.stairAmt == 0 && params.stairModel == "П-образная трехмаршевая" && par.marshId == 2) {
						center1 = newPoint_xy(p2, par.b * 0.5, par.rackTopHoleY);
						par.railingHoles.push(center1);
					}
				}


			}

			if (params.railingModel == "Самонесущее стекло") {

				//крепление ближе к маршу
				center1 = newPoint_xy(p2, par.rutelPosX, par.rutelPosY);
				center2 = newPoint_xy(center1, 0.0, -par.rutelDist);
				par.railingHoles.push(center1);
				par.railingHoles.push(center2);

				//крепление ближе к углу
				center1 = newPoint_xy(p5, -60 - params.stringerThickness - 15, par.rutelPosY);
				center2 = newPoint_xy(center1, 0.0, -par.rutelDist);
				par.railingHoles.push(center1);
				par.railingHoles.push(center2);
			}
		}

		//крепление к стенам
		if (par.marshParams.wallFix.out) {
			var fixPar = getFixPart(par.marshId);
			//отверстие ближе к углу
			center1 = newPoint_xy(p5, -200, -200);
			center1.rad = fixPar.diam / 2 + 1;
			center1.hasAngle = false;
			center1.noZenk = true;
			center1.noBolts = true;
			center1.wallFix = true;
			//center1.noZenk = true;
			par.pointsHole.push(center1);
			//отверстие ближе к маршу
			center1 = newPoint_xy(p2, 150, -200);
			center1.rad = fixPar.diam / 2 + 1;
			center1.hasAngle = false;
			center1.noZenk = true;
			center1.noBolts = true;
			center1.wallFix = true;
			//center1.noZenk = true;
			par.pointsHole.push(center1);
		}

	}

	if (params.calcType == 'console') {
		if (params.stringerModel == 'лист') {
			// отверстия под первую забежную ступень
			var flanPar = {
				marshId: par.marshId,
				dxfBasePoint: par.dxfBasePoint,
				type: 'winder1',
				wndPar: par.treadsObj.wndPar,
				wndPar2: par.treadsObj.wndPar2,
			}
			calcStringerConsoleFlanPar(flanPar);
			var holes = flanPar.holesFlanAndStringer;
			var pt = newPoint_xy(p2,
				flanPar.shiftFlanX + par.treadFrontOverHang,
				- par.addStringerWidth + flanPar.shiftFlanY - par.stringerLedge);
			for (var j = 0; j < holes.length; j++) {
				var center = newPoint_xy(pt, holes[j].x, holes[j].y);
				if (holes[j].noZenk) center.noZenk = holes[j].noZenk;
				if (holes[j].isFixWall) center.isFixWall = holes[j].isFixWall;
				par.pointsHole.push(center);
			}

			// отверстия под вторую забежную ступень
			flanPar.type = 'winder2'
			calcStringerConsoleFlanPar(flanPar);
			var holes = flanPar.holesFlanAndStringer;
			if (flanPar.wndPar2 && par.marshId !== 1)
				var pt = newPoint_xy(pt,
					par.turnParams.turnLengthTop - flanPar.wndPar2.params[2].stepWidthY,
					par.marshParams.h_topWnd);
			else
				var pt = newPoint_xy(pt,
					par.turnParams.turnLengthTop - flanPar.wndPar.params[2].stepWidthY,
					par.marshParams.h_topWnd);

			for (var j = 0; j < holes.length; j++) {
				var center = newPoint_xy(pt, holes[j].x, holes[j].y);
				if (holes[j].noZenk) center.noZenk = holes[j].noZenk;
				if (holes[j].isFixWall) center.isFixWall = holes[j].isFixWall;
				par.pointsHole.push(center);
			}
		}

		if (params.stringerModel == 'короб') {
			var pTopOut = newPoint_xy(par.zeroPoint,
				par.b * (par.stairAmt) + par.stringerLedge + par.turnParams.turnLengthTop,
				par.h * (par.stairAmt + 1) - params.treadThickness / 2);

			if (par.marshId == 2 && par.stairAmt == 0) {
				pTopOut.x += params.marshDist - 45;
			}

			var framePar = { marshId: par.marshId, type: 'marsh' }
			calcConsoleFrameWndPar(framePar);
			calcConsoleFramePar(framePar);

			var offsetX = 1;
			var offsetY = 8;

			// отверстия под первую забежную ступень
			var center = copyPoint(pTopOut);
			var pc1 = framePar.wndFrames['1'].p1In;
			var pc2 = framePar.wndFrames['1'].p2In;
			if (par.number == 2) {
				pc1 = framePar.wndFrames['1'].p1Out;
				pc2 = framePar.wndFrames['1'].p2Out;
			}
			center.points = [
				newPoint_xy(center, pc1.y - offsetX, - framePar.heightBox / 2 - offsetY),
				newPoint_xy(center, pc1.y  - offsetX, framePar.heightBox / 2 + offsetY),
				newPoint_xy(center, pc2.y + offsetX, framePar.heightBox / 2 + offsetY),
				newPoint_xy(center, pc2.y + offsetX, - framePar.heightBox / 2 - offsetY),
			]
			par.pointsHole.push(center);

			// отверстия под вторую забежную ступень
			var center = newPoint_xy(pTopOut, 0, par.h);
			var pc1 = framePar.wndFrames['2'].p1In;
			var pc2 = framePar.wndFrames['2'].p2In;
			if (par.number == 2) {
				pc1 = framePar.wndFrames['2'].p1Out;
				pc2 = framePar.wndFrames['2'].p2Out;
			}
			center.points = [
				newPoint_xy(center, pc1.y - offsetX, - framePar.heightBox / 2 - offsetY),
				newPoint_xy(center, pc1.y - offsetX, framePar.heightBox / 2 + offsetY),
				newPoint_xy(center, pc2.y + offsetX, framePar.heightBox / 2 + offsetY),
				newPoint_xy(center, pc2.y + offsetX, - framePar.heightBox / 2 - offsetY),
			]
			par.pointsHole.push(center);
		}
	}

	//сохраняем координаты угла тетивы для самонесущего стекла
	par.keyPoints[par.key].botLineP10 = newPoint_xy(p5, params.stringerThickness, -backLineLength);//FIX

	//точки на нижней линии марша для самонесущего стекла
	if (par.stairAmt <= 2) {
		var pt = copyPoint(par.midUnitEnd);
		//if (par.stairAmt == 0) pt.x += lengthB1;
		var p10 = polar(pt,
			(par.marshAng - Math.PI / 2),
			par.stringerWidth) // первая точка на нижней линии марша

		var p20 = polar(p10, par.marshAng, -100.0)

		p10 = polar(p10, par.marshAng + Math.PI / 2, 30);
		p20 = polar(p20, par.marshAng + Math.PI / 2, 30);

		par.keyPoints[par.key].marshBotLineP1 = copyPoint(p10)
		par.keyPoints[par.key].marshBotLineP2 = newPoint_xy(p20)
	}

}//end of drawTopStepLt_wndOut


/**
 * полная тетива нижнего марша (0 ступеней в марше) - внутренняя и внешняя стороны
 */

function drawStringerLt_0Bot_PltG(par) {

	/*ТОЧКИ КОНТУРА*/

	var h_1 = calcFirstRise(); //подъем первой ступени
	var p0 = newPoint_xy(par.zeroPoint, 0, par.h - h_1 + par.stringerLedge);
	var p1 = newPoint_xy(p0, 0, h_1);

	// срез передней кромки
	var p3 = newPoint_xy(p0, 0.0, 100.0);
	var p4 = itercection(p3, polar(p3, Math.PI * (5 / 3), 100), p0, polar(p0, 0, 100));//точка пересечения переднего среза и нижней линии

	// проступь
	var p5 = newPoint_xy(p1, par.topEndLength, 0.0);

	// нижняя линия
	var p6 = newPoint_xy(p5, 0.0, -par.stringerWidthPlatform);
	var p7 = newPoint_xy(p6, -60, 0);
	var p8 = itercection(p7, polar(p7, Math.PI * (5 / 3) - Math.PI / 2, 100), p4, polar(p4, 0, 100));

	//сохраняем точки контура
	par.pointsShape.push(p4);
	par.pointsShape.push(p3);
	par.pointsShape.push(p1);
	p5.filletRad = 0; //верхний угол тетивы не скругляется
	p6.filletRad = 0; //нижний угол тетивы не скругляется
	par.pointsShape.push(p5);
	par.pointsShape.push(p6);
	par.pointsShape.push(p7);
	par.pointsShape.push(p8);
	
	//сохраняем точку для расчета длины
	par.keyPoints.botPoint = copyPoint(p3);
	par.keyPoints.topPoint = copyPoint(p5);


	/*ОТВЕРСТИЯ*/
	// отверстия под нижний крепежный уголок
	center1 = newPoint_xy(p4, 90.0, 35.0);
	if (params.bottomAngleType === "регулируемая опора") center1.x += 20;
	center2 = newPoint_xy(center1, par.holeDistU4, 0.0);
	center1.hasAngle = center2.hasAngle = true;
	center1.pos = center2.pos = "botFloor";
	par.pointsHole.push(center1);
	par.pointsHole.push(center2);

	// отверстия под нижний крепежный уголок
	center1 = newPoint_xy(p8, -100, 35.0);
	if (params.bottomAngleType === "регулируемая опора") center1.x += 20;
	center2 = newPoint_xy(center1, par.holeDistU4, 0.0);
	center1.hasAngle = center2.hasAngle = true;
	center1.pos = center2.pos = "botFloor";
	par.pointsHole.push(center1);
	par.pointsHole.push(center2);

	if (!hasTreadFrames()) {
		// отверстия под перемычку 1
		// и под уголок крепления верхнего марша
		center1 = newPoint_xy(p1, 73.0, -65.0);
		center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
		center1.hasAngle = center2.hasAngle = false; //уголки перемычки отрисовываются внутри drawBridge_2
		par.elmIns[par.key].bridges.push(newPoint_xy(center1, -38.0, 20.0));
		par.pointsHole.push(center1);
		par.pointsHole.push(center2);

		// отверстия под уголок ступени 1
		center1 = newPoint_xy(p1, 230.0, par.stepHoleY);
		center2 = newPoint_xy(center1, par.holeDistU2_200, 0.0);
		par.pointsHole.push(center1);
		par.pointsHole.push(center2);

		// отверстия под перемычку 2
		center1 = newPoint_xy(p1, ((par.topEndLength * 0.5) + 38), -65.0);
		center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
		center1.hasAngle = center2.hasAngle = false; //уголки перемычки отрисовываются внутри drawBridge_2
		par.elmIns[par.key].bridges.push(newPoint_xy(center1, -38.0 - 68, 20.0));
		var pCentralHoles = copyPoint(center1);
		par.pointsHole.push(center1);
		par.pointsHole.push(center2);

		// отверстия под уголок ступени 2
		center1 = newPoint_xy(center1, 120.0, 0.0);
		center2 = newPoint_xy(center1, par.holeDistU2_200, 0.0);
		par.pointsHole.push(center1);
		par.pointsHole.push(center2);
	}
	if (hasTreadFrames()) {
		// отверстия под уголок крепления верхнего марша
		if (par.key == "in" && !par.stringerLast) {
			center1 = newPoint_xy(p1, 73.0, 85.0 - par.stringerWidthPlatform);
			center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
			par.pointsHole.push(center1);
			par.pointsHole.push(center2);
		}
		var pCentralHoles = newPoint_xy(p1, par.platformLength * 0.5, par.stepHoleY);

		// отверстия под рамки под площадкой

		var frameAmt = calcPltFrameParams(par.topEndLength, par.platformFramesParams.overhang).frameAmt;
		var frameWidth = calcPltFrameParams(par.topEndLength, par.platformFramesParams.overhang).frameWidth;

		var begX = par.platformFramesParams.overhang + 5.0 + par.platformFramesParams.sideHolePosX;
		var i;
		for (i = 0; i < frameAmt; i++) {
			center1 = newPoint_xy(p1, begX, par.stepHoleY);
			center2 = newPoint_xy(center1, frameWidth - par.platformFramesParams.sideHolePosX - par.platformFramesParams.sideHolePosX, 0.0);
			begX += frameWidth + 5.0;
			par.pointsHole.push(center1);
			par.pointsHole.push(center2);
		}
	}


	// отверстия под задний крепежный уголок
	center1 = newPoint_xy(p6, -30.0, 85.0);
	center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
	center1.hasAngle = center2.hasAngle = true;
	par.pointsHole.push(center2);
	par.pointsHole.push(center1);

	//Отверстия под ограждения
	if (par.hasRailing) {

		if (params.railingModel != "Самонесущее стекло") {
			if (par.key == "out" || par.stringerLast) {
				// отверстия под стойку 1
				center1 = newPoint_xy(p1, par.b * 0.5 + 65, par.rackTopHoleY);
				if (!par.hasPltRailing) center1 = newPoint_xy(center1, -65, 0);
				par.railingHoles.push(center1);

				// отверстия под средние стойки
				if (par.platformLength > 1300 && par.hasPltRailing) {
					var middleRackAmt = Math.round(par.platformLength / 800) - 1;
					if (middleRackAmt < 0) middleRackAmt = 0;
					var rackDist = (par.platformLength - 200) / (middleRackAmt + 1);
					for (var i = 1; i <= middleRackAmt; i++) {
						var center11 = newPoint_xy(center1, rackDist * i, 0);
						var center12 = newPoint_xy(center11, 0.0, -par.holeDistU4);
						par.railingHoles.push(center11);
					}
				}


				// отверстия под стойку 2
				if (par.hasPltRailing) {
					center1 = newPoint_xy(p5, -60 - 5 - 30, par.rackTopHoleY);
					center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
					par.railingHoles.push(center1);
				}
			}
		}
		if (params.railingModel == "Самонесущее стекло") {
			if (par.key == "out" || par.stringerLast) {
				// отверстия под последнее стекло марша

				if (par.hasPltRailing) {
					// отверстия под стойку 1
					var glassSectionLength = par.platformLength - par.b;
					center1 = newPoint_xy(p1, 450, par.rackTopHoleY + (p5.y - p1.y));
					if (hasTreadFrames()) {
						center1 = newPoint_xy(p1, par.b + 100, par.rackTopHoleY + (p5.y - p1.y));
						}
					center2 = newPoint_xy(center1, 0, -par.rutelDist);
					par.railingHoles.push(center1);
					par.railingHoles.push(center2);
					if (glassSectionLength > 1000) {
						// первое среднее
						center1 = newPoint_xy(pCentralHoles, -60, 0);
						center2 = newPoint_xy(center1, 0, -par.rutelDist);
						par.railingHoles.push(center1);
						par.railingHoles.push(center2);
						// второе среднее
						center1 = newPoint_xy(center1, /*par.b*/ 120, 0);
						center2 = newPoint_xy(center1, 0, -par.holeDistU4);
						par.railingHoles.push(center1);
						par.railingHoles.push(center2);
					}
					// отверстия под стойку 2
					center1 = newPoint_xy(p5, -60 - 5 - 30, par.rutelPosY);
					if (hasTreadFrames()) {
						center1 = newPoint_xy(p5, -60 - 5 - 30 - 60, par.rackTopHoleY);
						}
					center2 = newPoint_xy(center1, 0, -par.rutelDist);
					par.railingHoles.push(center1);
					par.railingHoles.push(center2);
				}
			}
		}
	}

	par.dxfBasePoint.x += par.b * par.stairAmt + par.dxfBasePointStep;
	if (par.topEndLength !== undefined) par.dxfBasePoint.x += par.topEndLength;

	//базовые точки для стыковки с другими частями косоура
	//http://6692035.ru/dev/mayorov/metal/imageLt/drawStringerLt_0Bot_PltG.jpg

	//сохраняем координаты нижнего левого угла тетивы для самонесущего стекла
	//именованные ключевые точки
	if (!par.keyPoints) par.keyPoints = {};
	if (!par.keyPoints[par.key]) par.keyPoints[par.key] = {};
	par.keyPoints[par.key].zeroPoint = { x: 0, y: 0 };

	par.keyPoints[par.key].botLineP0 = copyPoint(p0);

	return par;
} //end of drawStringerLt_0Bot_PltG


/**
 * первый подъем если снизу площадка средний марш трехмаршевой с 0 ступеней
 */
function drawBotStepLt_pltG_3marsh0(par) {

	var p0 = copyPoint(par.zeroPoint);
	var	botStringerWidth = 105.0;
	var botEndLength = params.M;

	var turnPar = calcTurnParams(2);//расчитуем параметры нижнего поворота

		
	//нижняя площадка
	var botEndLen = params.M + params.marshDist - par.stringerLedge - turnPar.topMarshOffsetX;
	if (par.key == "in") botEndLen = params.marshDist - turnPar.topMarshOffsetX - par.stringerLedge;


	var p1 = newPoint_xy(p0, -botEndLen, -par.stringerWidthPlatform + par.stringerLedge); //левый нижний угол	
	var p2 = newPoint_xy(p1, 0, par.stringerWidthPlatform); //левый верхний угол
	//на внутренней стороне нижний кусок уходит под площадку
	if(par.key == "in") p2.y -= params.treadThickness + par.stringerLedge;
	
	var p3 = newPoint_xy(p0, 0.0, par.stringerLedge);
	//var p3 = newPoint_xy(p0, 0.0, 0);
	var p4 = newPoint_xy(p0, 0.0, par.h + par.stringerLedge);  // верхний левый угол
	
	//правая точка на нижней линии
	var botLineP0 = newPoint_xy(p0, 0, -par.stringerWidthPlatform + par.stringerLedge); //60 - место под уголок
	if(par.key == "in") {
		par.topEndLength1 = 100;
		if(par.topEnd == "winder"){
			par.topEndLength1 = par.stringerLedge * 2 + par.turnStepsParams.params[1].stepWidthLow;
			}
		botLineP0.x += par.topEndLength1;
			
		//вырез под площадку на внутренней стороне
		var p3 = newPoint_xy(p0, turnPar.topMarshOffsetX-8, - params.treadThickness);
		var p4 = newPoint_xy(p0, 0.0, par.h);  // верхний левый угол
		var p31 = newPoint_xy(p3, 0, params.treadThickness + par.stringerLedge);
		var p32 = itercection(p31, polar(p31, Math.PI * 2 / 3, 100), p4, newPoint_xy(p4, 0, -100));

		p3.filletRad = 0;
	}
	
	p1.filletRad = p2.filletRad = 0
	
	par.pointsShape.push(botLineP0);
	par.pointsShape.push(p1);
	par.pointsShape.push(p2);
	par.pointsShape.push(p3);
	if (par.key == "in") {
		par.pointsShape.push(p31);
		par.pointsShape.push(p32);
	}
	else {
		if (par.topEnd == "winder") par.pointsShape.push(p4);
		//par.pointsShape.push(p4);
	}
	
	//сохраняем точки для колонн
	//par.keyPoints[par.key].botEnd = p1;	// для первой колонны
	//par.keyPoints[par.key].botEnd2 = botLineP0;	// для второй колонны
	par.keyPoints[par.key].botEnd = p2;	// для первой колонны
	par.keyPoints[par.key].botEnd2 = { x: botLineP0.x, y: p2.y };	// для второй колонны
	
	//сохраняем точку для расчета длины
	//par.keyPoints.botPoint = copyPoint(p1);
	par.keyPoints.botPoint = copyPoint(p2);


	/*ОТВЕРСТИЯ*/

	if (hasTreadFrames() && hasCustomMidPlt(par) && pt3) {
		var pltLength = params.middlePltWidth - params.M;
		var frameAmt = calcPltFrameParams(pltLength, par.platformFramesParams.overhang).frameAmt;
		var frameWidth = calcPltFrameParams(pltLength, par.platformFramesParams.overhang).frameWidth;

		// отверстия под рамки под площадкой
		var begX = par.platformFramesParams.overhang + 5 + par.platformFramesParams.sideHolePosX;
		var i;
		var deltaX = 0;
		if (par.key == 'out'){
			deltaX = params.M;
		}
		for (i = 0; i < frameAmt; i++) {
			center1 = newPoint_xy(pt3, begX + deltaX, par.stepHoleY);
			center2 = newPoint_xy(center1, frameWidth - par.platformFramesParams.sideHolePosX * 2, 0.0);
			center1.isPltFrame = center2.isPltFrame = true;
			par.pointsHole.push(center1);
			par.pointsHole.push(center2);
			begX += frameWidth + 5.0;
		}
	}

	//Отверстия под ограждения
	if (par.hasRailing) {

		if (params.railingModel != "Самонесущее стекло") {
			if (par.key == 'in' && !hasCustomMidPlt(par) || 
			(par.key == 'in' && params.middlePltWidth <= params.M + 200 && hasCustomMidPlt(par))) {
				center1 = newPoint_xy(p3, par.b * 0.5, par.rackTopHoleY);
				par.railingHoles.push(center1);
			}

			if (par.key == 'out' || (par.key == 'in' && hasCustomMidPlt(par) && params.middlePltWidth >= params.M + 200)) {
				//отверстие ближе к маршу
				center1 = newPoint_xy(p3, -par.b * 0.5, par.rackTopHoleY);
				par.railingHoles.push(center1);

				//отверстие ближе к углу
				center1 = newPoint_xy(p2, 80, par.rackTopHoleY);
				par.railingHoles.push(center1);

				var platformLength = botEndLength;
				if (platformLength > 1300) {
					var middleRackAmt = Math.round(platformLength / 800) - 1;
					if (middleRackAmt < 0) middleRackAmt = 0;
					var rackDist = (platformLength - 200) / (middleRackAmt + 1);
					for (var i = 1; i <= middleRackAmt; i++) {
						var center11 = newPoint_xy(center1, rackDist * i, 0);
						par.railingHoles.push(center11);
					}
				}

			}
		}
		if (params.railingModel == "Самонесущее стекло") {
			//пара рутелей на первой ступени марша
			center1 = newPoint_xy(p3, par.b * 0.5, par.rutelPosY);
			center2 = newPoint_xy(center1, 0, -par.rutelDist);
			par.railingHoles.push(center1);
			par.railingHoles.push(center2);
			if (par.key == 'out') {
				// Отверстие около начала марша
				center1 = newPoint_xy(p3, -90, -60);
				center2 = newPoint_xy(center1, 0, -par.rutelDist);
				par.railingHoles.push(center1);
				par.railingHoles.push(center2);
				//Отверстие скраю площадки
				center1 = newPoint_xy(p2, 90, -60);
				center2 = newPoint_xy(center1, 0, -par.rutelDist);
				par.railingHoles.push(center1);
				par.railingHoles.push(center2);
			}
		}
	}

	if (params.M > 1100 && par.key == 'out') {
		center1 = newPoint_xy(p3, -calcTreadLen() / 2 - 45, par.carcasAnglePosY - 5);
		center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
		center1.hasAngle = center2.hasAngle = false;
		if (hasTreadFrames()) center1.backZenk = center2.backZenk = true;
		if (!hasTreadFrames()) center1.noZenk = center2.noZenk = true;
		par.pointsHole.push(center2);
		par.pointsHole.push(center1);
	}

	// отверстия под уголок крепления к тетивам нижнего марша
	
	//крепление к внутренней тетиве
	var dist = params.marshDist - turnPar.topMarshOffsetX - par.stringerLedge;
	center1 = newPoint_xy(p0, 30 - dist, par.carcasAnglePosY + par.stringerLedge);
	if (par.key == "out") center1 = newPoint_xy(p0, -38 - dist, par.carcasAnglePosY + par.stringerLedge);
	center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
	center1.hasAngle = center2.hasAngle = true;
	if (par.key == "out") center1.hasAngle = center2.hasAngle = false;
	center1.rotated = center2.rotated = true;
	if (!hasTreadFrames()) center1.noBoltsInSide1 = center2.noBoltsInSide1 = true;
	par.pointsHole.push(center2);
	par.pointsHole.push(center1);



	//крепление к внешней тетиве
	if (par.key == "out") {
		center1 = newPoint_xy(p2, 38, par.carcasAnglePosY);
		center2 = newPoint_xy(center1, 0.0, -par.holeDistU4);
		center1.hasAngle = center2.hasAngle = false;
		par.pointsHole.push(center1);
		par.pointsHole.push(center2);

		// отверстия под уголки крепления покрытия площадки
		if(!hasTreadFrames()){
			var anglePos = setBridgeAnglePos();
			center1 = newPoint_xy(p2, anglePos.sideHolePosX, par.stepHoleY);
			center2 = newPoint_xy(center1, anglePos.holeDist, 0.0);
			center3 = newPoint_xy(p2, params.M - anglePos.sideHolePosX, par.stepHoleY);
			center4 = newPoint_xy(center3, -anglePos.holeDist, 0.0);
			par.pointsHole.push(center1, center2, center4, center3);
			}
		}


	par.botUnitEnd = par.pointsShape[par.pointsShape.length - 1];
	par.botUnitStart = par.pointsShape[0];
	par.midUnitEnd = par.botUnitEnd;

	//сохраняем координаты нижнего левого угла тетивы для самонесущего стекла
	par.keyPoints[par.key].botLineP0 = copyPoint(p2);
	par.keyPoints[par.key].botLineP0.y -= 32.4;//подгон, временно FIX!
	if (par.key == "out")
		par.keyPoints[par.key].botLineP0.x -= params.M;
	if (par.key == "in")
		par.keyPoints[par.key].botLineP0.x = p3.x

}//end of drawBotStepLt_pltG_3marsh0


/**
 * полная тетива нижнего марша если в нижнем марше 0 ступеней
 * Г-образная лестница с забегом внутренняя сторона
 */

function drawStringerLt_0Bot_WndGIn(par) {

	/*ТОЧКИ КОНТУРА*/

	var h_1 = calcFirstRise(); //подъем первой ступени
	var p0 = newPoint_xy(par.zeroPoint, 0, par.h - h_1 + par.stringerLedge);
	var p1 = newPoint_xy(p0, 0, h_1);
	var p11 = newPoint_xy(par.zeroPoint, par.stringerLedge, par.h); //угол первой забежной ступени
	//считаем позицию отверстия под уголок крепления верхнего марша так, чтобы крепеж рамки/уголка крепления ступени был на середине высоты уголка
	var holePosY = -params.treadThickness - 20 + 60 / 2; // 20 - позиция отверстия в рамке/уголке ступени
	//не допускаем выскакивания отверстия за контур тетивы
	if(p11.y + holePosY + 20 > p1.y) p1.y = p11.y + holePosY + 20;

	var stringerLen = 110;
	var p2 = newPoint_xy(p1, stringerLen, 0);
	var p3 = newPoint_xy(p0, stringerLen, 0);

	//сохраняем точки контура
	
	par.pointsShape.push(p0);
	par.pointsShape.push(p1);
	par.pointsShape.push(p2);
	par.pointsShape.push(p3);
	
	//сохраняем точку для расчета длины
	//par.keyPoints.botPoint = copyPoint(p1);
	//par.keyPoints.topPoint = copyPoint(p2);

	/*ОТВЕРСТИЯ*/

	// отверстия под нижний крепежный уголок
	var center1 = newPoint_xy(p0, 25.0, 35);
	if (params.bottomAngleType == "регулируемая опора") center1.y += 15;
	var center2 = newPoint_xy(center1, 60, 0);
	center1.hasAngle = center2.hasAngle = true;
	center1.pos = center2.pos = "botFloor";
	par.pointsHole.push(center1);
	par.pointsHole.push(center2);
/*
	//отверстия под уголок крепления верхней тетивы
	var center1 = newPoint_xy(p0, 31 + 5 + params.stringerThickness + 30, 60);
	var center2 = newPoint_xy(center1, 0, 60);
	//вторе отверстие под уголок ступени / рамку
	var center3 = newPoint_xy(center2, -50, 0);
	if(hasTreadFrames()) center3 = newPoint_xy(center2, -50, 0);

	center1.hasAngle = false;
	center2.hasAngle = center3.hasAngle = true;
	if(hasTreadFrames()) center2.hasAngle = center3.hasAngle = false;
	par.pointsHole.push(center1);
	if(!hasTreadFrames()){
		par.pointsHole.push(center3);
		par.pointsHole.push(center2);
		}
*/
	
	//отверстия под уголок крепления верхнего марша
	var holePosX = par.turnParams.topMarshOffsetX  + params.stringerThickness + 30;
	var center1 = newPoint_xy(p11, holePosX, holePosY);
	var center2 = newPoint_xy(center1, 0, -60);
	center1.hasAngle = center2.hasAngle = false;
	center1.backZenk = center2.backZenk = true;
	par.pointsHole.push(center1);
	par.pointsHole.push(center2);

	if(hasTreadFrames()){
		// отверстия под первую забежную рамку
		var holePar = {
			holes: par.wndFramesHoles.botMarsh.in[1],
			basePoint: newPoint_xy(p11, par.wndSteps.frameFrontOffset, -params.treadThickness),
			}
		par.pointsHole.push(...calcWndHoles(holePar));

		}
	if(!hasTreadFrames()){
		var center1 = newPoint_xy(p11, 25, -(params.treadThickness + 20));
		var center2 = newPoint_xy(center1, 50, 0);
		center1.hasAngle = center2.hasAngle = true;
		par.pointsHole.push(center1);
		par.pointsHole.push(center2);
		}


	//базовые точки для стыковки с другими частями косоура
	//http://6692035.ru/dev/mayorov/metal/imageLt/drawStringerLt_0Bot_WndG.jpg

	//сохраняем координаты нижнего левого угла тетивы для самонесущего стекла
	par.keyPoints[par.key].botLineP0 = copyPoint(p0);

} //end of drawStringerLt_0Bot_WndGIn



/** функция рассчитывает смещение третьей забежной рамки от торца тетивы
 * смещение мереется от торца фланца http://6692035.ru/drawings/wndFramesHoles/3-4.jpg
 * функция используется для расчета координат отверстий под фланцы на внешней и внутренней тетивах
*/

function calcWndFrame3Offset(par){
	var offsetX = par.stringerLedge + par.wndSteps.frameFrontOffset / Math.cos(par.turnStepsParams.params[3].edgeAngle)
	//учитываем зазор от торца ступени до тетивы
	offsetX += par.treadSideGap * Math.tan(par.turnStepsParams.params[3].edgeAngle)
	//учитываем что номинальный угол рамки (точка) при косой передней кромке не совпадает с углом фланца
	//http://6692035.ru/drawings/wndFramesHoles/3-1.jpg
	var frontFlanThk = 4;
	offsetX += frontFlanThk * Math.tan((Math.PI / 2 - par.turnStepsParams.params[3].edgeAngle) / 2);

	return offsetX;
}

/** функция рассчитывает высоту рамки/уголка крепления ступени
*/
function calcTreadFixHeight(){
	var treadFixHeight = 40; //высота уголка/рамки
	if(params.stairType == "рифленая сталь" || params.stairType == "лотки") treadFixHeight = 50
	//наличие третьего косоура
	if(params.M > 1020 + 8 * 2) treadFixHeight = 60;
	if(params.calcType == "vhod") treadFixHeight = 60;
	if(params.stairType == "пресснастил") treadFixHeight = 70 - params.treadThickness;
	return treadFixHeight;
} //end of calcTreadFixHeight


/** функция ищет пересечение отверстия в массиве уже созданных отверстий
*/
function findItercectionHoles(center, par) {
	for (var i = 0; i < par.pointsHole.length; i++) {
		if (par.pointsHole[i].x > (center.x - 20) && par.pointsHole[i].x < (center.x + 20)) {
			if (par.pointsHole[i].y > (center.y - 20) && par.pointsHole[i].y < (center.y + 20)) {
				var centerTemp = copyPoint(center);
				center.x = par.pointsHole[i].x - 20;
				center.y -= (Math.abs(centerTemp.x - center.x)) * Math.tan(par.marshAng);
				return true;
			}
		}
	}
	return false;
} //end of findItercectionHoles


/** функция ищет находится ли точка в пределах границы, и если находится тогда смещает ее за пределы границы
*/
function calculateOffsetHole(point, pointsBorders) {
	for (var i = 0; i < pointsBorders.length; i++) {
		var border = pointsBorders[i];
		if (point.x > border.p1.x && point.x < border.p2.x && point.y > border.p1.y && point.y < border.p2.y) {
			if (border.orientationVert) point = { x: border.p1.x, y: point.y }
			else point = { x: point.x, y: border.p1.y }
			break;
		}
	}
	return point;
} //end of calculateOffsetHole