/*** НИЖНИЕ УЗЛЫ ***/


/**
 * первый подъем если внизу перекрытие
 */
function drawBotStepKo_floor(par){
	
	/*ТОЧКИ КОНТУРА*/
	
	var h_1 = calcFirstRise(); //подъем первой ступени	
	var p0 = newPoint_xy(par.zeroPoint, params.nose + 0.01, par.h - h_1 - params.treadThickness); //левый нижний угол
	if(params.riserType == "есть") p0.x += params.riserThickness;
	var p1 = newPoint_xy(p0, 0, h_1);

	// проступь
	var p2 = newPoint_xy(p1, par.b, 0);

	// нижняя линия
	var botLinePoints = [];
	
	if (params.stringerType !== "ломаная"){
		var p20 = newPoint_xy(p2, (par.stringerWidth / Math.sin(par.marshAng)), 0.0); // первая точка на нижней линии марша
		var p21 = polar(p20, par.marshAng, 100.0); // вторая точка на нижней линии
		var p00 = newPoint_xy(p0, 100, 0); // вторая точка нижнего края косоура
		var botLineP1 = itercection(p0, p00, p20, p21); // точка пересчечения нижнего края и нижней линии марша
		//выступ при маленьком нижнем горизонтальном участке
		if ((botLineP1.x - p0.x) < 120){
			botLineP1 = newPoint_xy(p0, 120, 0.0);
			var botLineP2 = itercection(botLineP1, polar(botLineP1, Math.PI * 2 / 5, 100), p20, p21);
			botLinePoints.push(botLineP2);
		}
	}
	if (params.stringerType == "ломаная"){
		botLineP1 = newPoint_xy(p0, par.b + par.stringerWidth, 0.0);
		var botLineP2 = newPoint_xy(p2, par.stringerWidth, -par.stringerWidth + par.h);
		if(par.stairAmt > 1 || (par.stairAmt == 1 && par.key == "out")) botLinePoints.push(botLineP2);
		}
		
	//сохраняем точки контура
	p1.filletRad = 0; //угол косоура не скругляется	
	par.pointsShape.push(...botLinePoints);
	par.pointsShape.push(botLineP1);
	par.pointsShape.push(p0);	
	par.pointsShape.push(p1);

	
	//сохраняем точку для расчета длины
	par.keyPoints.botPoint = copyPoint(p0);
		
	/*ОТВЕРСТИЯ*/
	
	// отверстия под нижний крепежный уголок
	center1 = newPoint_xy(botLineP1, -90.0, 35.0);
	
	if (params.bottomAngleType === "регулируемая опора") {
		center1 = newPoint_xy(botLineP1, -90, 50.0);		
		}
	//для ломаной сдвигаем уголок максимально вперед
	if (params.stringerType == "ломаная") center1.x = p2.x + 20;
	//не допускаем пересечения уголка и рамки ступени
	var parFrames = { marshId: par.marshId };
	calcFrameParams(parFrames); // рассчитываем параметры рамки
	if (center1.x - p2.x < 20 && p2.y - center1.y < (parFrames.profHeight + 30)) {// 30 - расстояние от отверстия в уголке до его торца
		center1.x = p2.x + 20;
		}
	center2 = newPoint_xy(center1, 60.0, 0.0);
	center1.hasAngle = center2.hasAngle = true;
	center1.pos = center2.pos = "botFloor";
	par.pointsHole.push(center1);
	par.pointsHole.push(center2);
	
	//Отверстия под ограждения
	if (par.hasRailing){
		if (params.railingModel != "Самонесущее стекло"){
			center1 = newPoint_xy(p1, par.rutelPosX, par.stepHoleY);
			//если снизу пригласительные ступени, тогда сдвигаем стойку ограждения, чтобы не было пересечения с пригласительной ступенью
			if (params.railingStart < params.startTreadAmt) center1.x -= params.nose*2;
			par.railingHoles.push(center1);
			}

		if (params.railingModel == "Самонесущее стекло"){
			
			//один рутель под первой ступенью
			center1 = newPoint_xy(p1, par.rutelPosX, par.rutelPosY);
			par.railingHoles.push(center1);

			//два рутеля под второй ступенью
			if(par.stairAmt > 1){
				center1 = newPoint_xy(p1, par.b + par.rutelPosX, par.h / 2 + par.rutelPosY);
				center2 = newPoint_xy(center1, 0, par.rutelDist);
				par.railingHoles.push(center1);
				par.railingHoles.push(center2);
				}
		}
	}
	
	


	//базовые точки для стыковки с другими частями косоура
	//http://6692035.ru/dev/mayorov/metal/image/drawBotStepKo_floor_Lom.jpg - для ломанной
	//http://6692035.ru/dev/mayorov/metal/image/drawBotStepKo_floor_Pil.jpg - для пилообразной
	
	par.botUnitEnd = par.pointsShape[par.pointsShape.length - 1];
	par.botUnitStart = par.pointsShape[0];
	par.midUnitEnd = par.botUnitEnd;
	
	//сохраняем координаты нижнего левого угла тетивы для самонесущего стекла
	par.keyPoints[par.key].botLineP0 = newPoint_xy(p0, 0, -215);//FIX!



}//end of drawBotStepKo_floor

/**
 * первый подъем если снизу площадка (Г-образная и трехмаршевая лестница)
 */
function drawBotStepKo_pltG(par){

var botEndLen = params.sideOverHang - params.nose;
if(params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && params.stairAmt2 == 0) 
	botEndLen += params.marshDist - 5;
	
	/*ТОЧКИ КОНТУРА*/
	
	//нижняя левая точка
	
	var p0 = newPoint_xy(par.zeroPoint, -botEndLen, -par.stringerWidthPlatform - params.treadThickness);
	
	// задняя линия
	var p1 = newPoint_xy(p0, 0, par.stringerWidthPlatform); // высота первого подъема

	// выступ косоура под площадкой
	var p2 = newPoint_xy(p1, botEndLen + params.nose, 0);
	if(params.riserType == "есть") p2.x += params.riserThickness;
	
	// первая ступень марша
	var p3 = newPoint_xy(p2, 0.0, par.h);

	// нижняя линия
	var botLinePoints = [];
	if (params.stringerType != "ломаная"){
		var p20 = newPoint_xy(p2, (par.stringerWidth / Math.sin(par.marshAng)), 0.0); // первая точка на нижней линии марша
		var p21 = polar(p20, par.marshAng, 100.0); // вторая точка на нижней линии
		var p00 = newPoint_xy(p0, 100, 0); // вторая точка нижнего края косоура
		var botLineP1 = itercection(p0, p00, p20, p21);           // точка пересчечения нижнего края и нижней линии марша
		}
	//нижний горизонтальный участок
	if (params.stringerType === "ломаная"){
		var botLineP2 = newPoint_xy(p3, par.stringerWidth, - par.stringerWidth);
		var botLineP1 = itercection(p0, polar(p0, 0, 100), botLineP2, polar(botLineP2, Math.PI / 2, 100));
		var botLineP3 = newPoint_xy(botLineP2, par.b, 0);
		var botLineP4 = newPoint_xy(botLineP3, 0, par.h);
		if(par.stairAmt > 1) par.pointsShape.push(botLineP4, botLineP3);
		par.pointsShape.push(botLineP2);
		}

	//сохраняем точки контура
	if (!(par.topEnd == "platformG" && par.stairAmt === 1 && params.stringerType === "ломаная"))
		par.pointsShape.push(botLineP1);
	p0.filletRad = p1.filletRad = p2.filletRad = p3.filletRad = 0; //угол тетивы не скругляется
	if (par.stringerDivisionBot) {
		par.pointsShape.push(p0);
		par.pointsShape.push(p1);
	}
	

	//сохраняем точку для расчета длины
	par.keyPoints.botPoint = copyPoint(p0);
	

	//удлинение внешнего косоура площадки
	
	if (par.key == "out"){
		var pt1 = newPoint_xy(p0, -params.stringerThickness, 0);
		var pt2 = newPoint_xy(pt1, -params.M + params.sideOverHang + params.sideOverHang + params.stringerThickness * 2 + calcStringerMoove(par.marshId).stringerOutMoovePrev, 0);
		var pt3 = newPoint_xy(pt2, 0, par.stringerWidthPlatform);
		var pt4 = newPoint_xy(pt1, 0.0, par.stringerWidthPlatform);

		pt1.filletRad = pt2.filletRad = pt3.filletRad = pt4.filletRad = 0; //углы косоура не скругляются
		if (par.stringerDivisionBot) {
			par.pointsShapeBot.push(pt1);
			par.pointsShapeBot.push(pt2);
			par.pointsShapeBot.push(pt3);
			par.pointsShapeBot.push(pt4);
			//сохраняем длину для спецификации
			par.partsLen.push(distance(pt1, pt2))
		}
		if (!par.stringerDivisionBot) {
			par.pointsShape.push(pt2);
			par.pointsShape.push(pt3);
			//сохраняем точку для расчета длины
			par.keyPoints.botPoint = copyPoint(pt2);
		}

		//сохраняем точки для колонн
		par.keyPoints[par.key].botEnd = pt3;	// для первой колонны
		par.keyPoints[par.key].botEnd2 = pt4;	// для второй колонны
		
		par.keyPoints.botPointDop = copyPoint(pt2);
		par.keyPoints.topPointDop = copyPoint(pt4);
	}

	par.pointsShape.push(p2);
	if (par.stairAmt > 0) par.pointsShape.push(p3);
	//if(par.stairAmt > 0 || par.key == "out") par.pointsShape.push(p3);


	/*ОТВЕРСТИЯ*/
	var pointsHoleBot = par.pointsHoleBot;
	var railingHolesBot = par.railingHolesBot;
	//если нет разделения косоуров
	if (!par.stringerDivisionBot) {
		pointsHoleBot = par.pointsHole;
		railingHolesBot = par.railingHoles;
	}

	// отверстия крепления к площадке
	// отверстия под нижний крепежный уголок
	// крепления к площадке
	center1 = newPoint_xy(p0, 30.0, 25.0);
	center2 = newPoint_xy(center1, 0.0, 60.0);
	center1.hasAngle = center2.hasAngle = true;
	center1.rotated = center2.rotated = true;
	if (par.key == 'out') center1.noBoltsInSide1 = center2.noBoltsInSide1 = true;
	//par.pointsHole.push(center1);
	//par.pointsHole.push(center2);
	
	//if (!(par.topEnd == "platformG" && par.stairAmt === 0)){

		//Отверстия под ограждения
		if (par.hasRailing){
			if (params.railingModel != "Самонесущее стекло"){
				if (par.key == 'in'){
					center1 = newPoint_xy(p3, par.rutelPosX, par.stepHoleY);
					//смещаем точку ближе к низу марша
					if (params.rackBottom != "сверху с крышкой") {
						center1 = newPoint_x(center1, -par.b * 0.5 + 50, -par.marshAng)

						//если повортная стойка, сдвигаем стойку до края предыдущего марша
						if (par.prevMarshPar.hasRailing.in) {
							var pt = setTurnRacksParams(par.marshId, par.key).stringerShiftPoint;
							center1 = newPoint_xy(p3, pt.x, par.stepHoleY + pt.y);
							center1.isTurnRack = true;
							center1.noDrawHoles = true;
						}
					}
					par.railingHoles.push(center1);
					}
				if (par.key == 'out'){
					//стойка ближе к маршу
					center1 = newPoint_xy(p3, -160, par.stepHoleY - par.h);
					railingHolesBot.push(center1);
					
					//стойка ближе к углу площадки
					center1 = newPoint_xy(pt3, 80-8, par.stepHoleY);
					railingHolesBot.push(center1);
					}
			}

			if (params.railingModel == "Самонесущее стекло"){
				center1 = newPoint_xy(p3, par.rutelPosX, par.rutelPosY);
				center2 = newPoint_xy(center1, 0.0, -par.rutelDist);
				par.railingHoles.push(center2);
				par.railingHoles.push(center1);
				//FIX
				if (par.key == 'out') {
					// Отверстие около начала марша
					center1 = newPoint_xy(pt4, -90, par.rutelPosY);
					center2 = newPoint_xy(center1, 0, -60);
					railingHolesBot.push(center1);
					railingHolesBot.push(center2);
					//Отверстие скраю площадки
					center1 = newPoint_xy(pt3, 90, par.rutelPosY);
					center2 = newPoint_xy(center1, 0, -60);
					railingHolesBot.push(center1);
					railingHolesBot.push(center2);
				}
			}
		}

		//уголки косоура площадки
		if (par.key == "out"){
			center1 = newPoint_xy(pt1, -30, 25);
			center2 = newPoint_xy(center1, 0.0, 60.0);
			center1.hasAngle = center2.hasAngle = false;
			pointsHoleBot.push(center1);
			pointsHoleBot.push(center2);


			center1 = newPoint_xy(pt2, 30, 25);
			center2 = newPoint_xy(center1, 0.0, 60.0);
			center1.hasAngle = center2.hasAngle = false;
			pointsHoleBot.push(center1);
			pointsHoleBot.push(center2);

			//отверстия под соединительный фланец
			if (par.stringerDivisionBot) {
				center1 = newPoint_xy(p0, 30, 25);
				center2 = newPoint_xy(center1, 0.0, 60.0);
				center1.hasAngle = center2.hasAngle = true;
				center1.noBoltsInSide1 = center2.noBoltsInSide1 = true;
				center1.rotated = center2.rotated = true;
				par.pointsHoleTop.push(center1);
				par.pointsHoleTop.push(center2);
			}

			// отверстия для уголков крепления щитов площадки
			if (params.M > 750) {
				var pv3 = newPoint_xy(pt3, 60, 0)
				var pv4 = newPoint_xy(pt4, -60, 0)
				var pvc = newPoint_xy(pv3, -(pv3.x - pv4.x) / 2, 0);
				var len = pv4.x - pvc.x;

				if (len > 90 + 50) {
					center1 = newPoint_xy(pvc, (len / 2 + 25), -20);
					center2 = newPoint_xy(center1, -50.0, 0);
					center1.hasAngle = center2.hasAngle = true;
					pointsHoleBot.push(center2);
					pointsHoleBot.push(center1);

					center1 = newPoint_xy(pvc, -(len / 2 + 25), -20);
					center2 = newPoint_xy(center1, 50.0, 0);
					center1.hasAngle = center2.hasAngle = true;
					pointsHoleBot.push(center1);
					pointsHoleBot.push(center2);
				}
				else {
					center1 = newPoint_xy(pvc, 25, -20);
					center2 = newPoint_xy(center1, -50.0, 0);
					center1.hasAngle = center2.hasAngle = true;
					pointsHoleBot.push(center2);
					pointsHoleBot.push(center1);
				}
			}
	}
	if (par.key == "in") {
		center1 = newPoint_xy(p0, 30, 25);
		center2 = newPoint_xy(center1, 0.0, 60.0);
		center1.hasAngle = center2.hasAngle = true;
		center1.rotated = center2.rotated = true;
		par.pointsHole.push(center1);
		par.pointsHole.push(center2);	
	}
	//}

	//крепление к стенам
	if (par.key == "out" && par.marshParams.wallFix.out) {
		var fixPar = getFixPart(par.marshId);
		//отверстие ближе к маршу
		center1 = newPoint_xy(pt3, 100, -80);
		center1.rad = fixPar.diam / 2 + 1;
		center1.hasAngle = false;
		center1.noZenk = true;
		center1.noBolts = true;
		center1.wallFix = true;
		if (par.stringerDivisionBot)par.pointsHoleBot.push(center1);
		if (!par.stringerDivisionBot)par.pointsHole.push(center1);
		//отверстие ближе к углу
		center1 = newPoint_xy(pt4, -100, -80);
		center1.rad = fixPar.diam / 2 + 1;
		center1.hasAngle = false;
		center1.noZenk = true;
		center1.noBolts = true;
		center1.wallFix = true;
		if (par.stringerDivisionBot) par.pointsHoleBot.push(center1);
		if (!par.stringerDivisionBot) par.pointsHole.push(center1);
	}

	//базовые точки для стыковки с другими частями косоура
	//http://6692035.ru/dev/mayorov/metal/image/drawBotStepKo_pltG_Lom.jpg - для ломанной
	//http://6692035.ru/dev/mayorov/metal/image/drawBotStepKo_pltG_Pil.jpg - для пилообразной

	par.botUnitEnd = par.pointsShape[par.pointsShape.length - 1];
	par.botUnitStart = par.pointsShape[0];
	par.midUnitEnd = par.botUnitEnd;

	//сохраняем координаты нижнего левого угла тетивы для самонесущего стекла
	var ph = { x: p2.x, y: p0.y };
	if (params.stairModel == 'П-образная трехмаршевая' && par.marshId == 3 && params.stairAmt2 == 0) ph.x = 0;
	par.keyPoints[par.key].botLineP0 = newPoint_xy(ph, 0, -215);//FIX
	if (par.key == "out")
		par.keyPoints[par.key].botLineP0.x -= params.M - par.stringerSideOffset;

	
}//end of drawBotStepKo_pltG

/**
 * первый подъем если снизу площадка (П-образная лестница, внутренняя сторона)
 */
function drawBotStepKo_pltP(par){
	
	//нижний левый угол
	var p0 = newPoint_xy(par.zeroPoint, -par.botEndLength + params.nose, -(par.stringerWidthPlatform + params.treadThickness));

	/*ТОЧКИ КОНТУРА*/
	
	// верхний левый угол
	var p1 = newPoint_xy(p0, 0, par.stringerWidthPlatform);  // высота первого подъема

	// проступь
	var p2 = polar(p1, 0.0, par.botEndLength + 0.01);
	if(params.riserType == "есть") p2.x += params.riserThickness;

	// нижняя линия
	var botLinePoints = [];
	
	var p20 = newPoint_xy(p2, (par.stringerWidth / Math.sin(par.marshAng)), 0.0); // первая точка на нижней линии марша
	var p21 = polar(p20, par.marshAng, 100.0); // вторая точка на нижней линии
	var p00 = polar(p0, 0.0, 100.0);                                                 // вторая точка нижнего края косоура
	var botLineP1 = itercection(p0, p00, p20, p21);           // точка пересчечения нижнего края и нижней линии марша

	// второй подъём
	var p3 = newPoint_xy(p2, 0.0, par.h);

	// проступь
	var p4 = newPoint_xy(p3, par.b, 0.0);

	//нижний горизонтальный участок
	if (params.stringerType === "ломаная"){
		var botLineP2 = newPoint_xy(p3, par.stringerWidth, - par.stringerWidth);
		var botLineP1 = itercection(p0, polar(p0, 0, 100), botLineP2, polar(botLineP2, Math.PI / 2, 100));
		var botLineP3 = newPoint_xy(botLineP2, par.b, 0);
		var botLineP4 = newPoint_xy(botLineP3, 0, par.h);
		if(par.stairAmt > 1) par.pointsShape.push(botLineP4, botLineP3);
		par.pointsShape.push(botLineP2);
	}

	//сохраняем точки контура
	par.pointsShape.push(botLineP1);
	p0.filletRad = p1.filletRad = p2.filletRad = p3.filletRad = p4.filletRad = 0; //угол тетивы не скругляется
	if (par.stringerDivisionBot) {
		par.pointsShape.push(p0);
		par.pointsShape.push(p1);
	}
	

	//сохраняем точку для расчета длины
	par.keyPoints.botPoint = copyPoint(p0);
	
	//удлинение внешнего косоура площадки
    var pltStringerLen = params.platformLength_1 - par.botEndLength - params.stringerThickness * 2 + params.nose;	
	if (params.sideOverHang <= 75) pltStringerLen -= params.sideOverHang;
	else pltStringerLen -= 75;
	pltStringerLen -= calcStringerMoove(2).stringerOutMoove;
	var pt1 = newPoint_xy(p0, -params.stringerThickness, 0);
	var pt2 = newPoint_xy(pt1, -pltStringerLen, 0);
	var pt3 = newPoint_xy(pt2, 0, par.stringerWidthPlatform);
	var pt4 = newPoint_xy(pt1, 0.0, par.stringerWidthPlatform);

	pt1.filletRad = pt2.filletRad = pt3.filletRad = pt4.filletRad = 0; //углы косоура не скругляются
	if (par.stringerDivisionBot) {
		par.pointsShapeBot.push(pt1);
		par.pointsShapeBot.push(pt2);
		par.pointsShapeBot.push(pt3);
		par.pointsShapeBot.push(pt4);
		//сохраняем длину для спецификации
		par.partsLen.push(distance(pt1, pt2))

		par.keyPoints.botPoint = copyPoint(p0);
		par.keyPoints.botPointDop = copyPoint(pt2);
	}
	if (!par.stringerDivisionBot) {
		par.pointsShape.push(pt2);
		par.pointsShape.push(pt3);
		//сохраняем точку для расчета длины
		par.keyPoints.botPoint = copyPoint(pt2);
	}		

	par.pointsShape.push(p2);
	par.pointsShape.push(p3);


	/*ОТВЕРСТИЯ*/
	var pointsHoleBot = par.pointsHoleBot;
	var railingHolesBot = par.railingHolesBot;
	//если нет разделения косоуров
	if (!par.stringerDivisionBot) {
		pointsHoleBot = par.pointsHole;
		railingHolesBot = par.railingHoles;
	}


	// крепления к переднему поперечному косоуру площадки
	center1 = newPoint_xy(p0, 30.0, 25.0);
	center2 = newPoint_xy(center1, 0.0, 60.0);
	center1.hasAngle = center2.hasAngle = true;
	center1.rotated = center2.rotated = true;
	center1.noBoltsInSide1 = center2.noBoltsInSide1 = true;
	par.pointsHole.push(center1);
	par.pointsHole.push(center2);


	// отверстия под рамку площадки
	var center2 = newPoint_xy(p2, -par.stepHoleX1 - params.nose, par.stepHoleY);
	var center1 = newPoint_xy(p2, -par.stepHoleX2 - params.nose, par.stepHoleY);
    //для П-образная с площадкой делаем рамки на площадке одинаковой ширины (ширина как на первом марше)
    //if (params.stairModel == "П-образная с площадкой") center1.x += params.b3 - params.b1;
	if (params.stairModel == "П-образная с площадкой") {
		var marshFramesParams = { marshId: 1 };
		calcFrameParams(marshFramesParams); 
		var center2 = newPoint_xy(p2, -marshFramesParams.stepHoleX1 - params.nose, par.stepHoleY);
		var center1 = newPoint_xy(p2, -marshFramesParams.stepHoleX2 - params.nose, par.stepHoleY);
		if (params.riserType == "есть") {
			center1.x -= params.riserThickness * 2;
			center2.x -= params.riserThickness * 2;
		}
	}

	par.pointsHole.push(center1);
    par.pointsHole.push(center2);
    var frameHoleDist = center2.x - center1.x //сохраняем расстояние чтобы все рамки сделать одинаковыми
	//сохраняем координаты
	var frame1Hole = copyPoint(center1)
	
	//задний уголок крепления к переднему поперечному косоуру площадки
	center1 = newPoint_xy(pt1, -30, 25);
	center2 = newPoint_xy(center1, 0.0, 60.0);
	center1.hasAngle = center2.hasAngle = true;
	center1.noBoltsInSide1 = center2.noBoltsInSide1 = true;
	pointsHoleBot.push(center1);
	pointsHoleBot.push(center2);
	
	//крепление к заднему косоуру площадки
	center1 = newPoint_xy(pt2, 30, 25);
	center2 = newPoint_xy(center1, 0.0, 60.0);
	center1.hasAngle = center2.hasAngle = true;
	center1.rotated = center2.rotated = true;
	pointsHoleBot.push(center1);
	pointsHoleBot.push(center2);

	// отверстия крепления к площадки
	
	var pltPar = {len: params.platformLength_1 + params.nose,}
	pltPar.len -= calcStringerMoove(2).stringerOutMoove;
	calcPltPartsParams(pltPar);
	//var xPo = pltPar.partLen - par.botEndLength - params.stringerThickness - 96 + params.nose;
	//po1 = newPoint_xy(pt4, -xPo, -20);
	po1 = newPoint_xy(pt4, -par.stepHoleX1, -20);
	var dX = 0;
	for (var i = 0; i < pltPar.partsAmt - 1; i++){
		center2 = newPoint_xy(po1, dX, 0);
		//не допускаем пересечения рамок
        var minDist = 45 * 2 + 5 + params.stringerThickness + 15;
		if(frame1Hole.x - center2.x < minDist) center2.x = frame1Hole.x - minDist;
        center1 = newPoint_xy(center2, -frameHoleDist, 0);
		pointsHoleBot.push(center1);
		pointsHoleBot.push(center2);
		
		dX -= pltPar.partLen;
	}			
	
	//Отверстия под ограждения
	if (par.hasRailing){
		if (params.railingModel != "Самонесущее стекло") {
			if (par.key == 'in') {
				center1 = newPoint_xy(p3, par.rutelPosX, par.stepHoleY);
				//смещяем стойку чтобы она была вровень со стойкой нижнего марша
				if (params.rackBottom != "сверху с крышкой") {
					center1 = newPoint_x1(center1, -40, par.marshAng)

					//var pt = setTurnRacksParams(par.marshId, par.key).stringerShiftPoint;
					//center1 = newPoint_xy(p3, pt.x, par.stepHoleY + pt.y);
					//center1.isTurnRack = true;
					//center1.noDrawHoles = true;
				}
				par.railingHoles.push(center1);
			}
			if (par.key == 'out') {
				//стойка ближе к маршу
				center1 = newPoint_xy(p3, par.rutelPosX - par.b + 20, par.stepHoleY - par.h);
				par.railingHoles.push(center1);

				//стойка ближе к углу площадки
				center1 = newPoint_xy(pt3, 80 - 8, par.stepHoleY);
				railingHolesBot.push(center1);
			}
		}

		if (params.railingModel == "Самонесущее стекло"){
			if (par.key == "out"){
				var offsetHoleX = par.stepHoleX1 + par.stepHoleX2;
				//последняя пара отверстий под стекло площадки
				center1 = newPoint_xy(p1, par.rutelPosX, par.rutelPosY);
				center2 = newPoint_xy(center1, 0.0, -60.0);
				par.railingHoles.push(center1);
				par.railingHoles.push(center2);
				//FIX ^^^
				//отверстие ближе к маршу
				center1 = newPoint_xy(pt4, -90, par.rutelPosY);
				center2 = newPoint_xy(center1, 0.0, -60);
				railingHolesBot.push(center1);
				railingHolesBot.push(center2);
				//отверстие ближе к углу
				center1 = newPoint_xy(pt3, 90, par.rutelPosY);
				center2 = newPoint_xy(center1, 0.0, -60);
				railingHolesBot.push(center1);
				railingHolesBot.push(center2);
			}

			// отверстия на первой ступени марша
			center1 = newPoint_xy(p3, par.rutelPosX, par.rutelPosY);
			center2 = newPoint_xy(center1, 0.0, -par.rutelDist);
			par.railingHoles.push(center1);
			par.railingHoles.push(center2);



		}
	}

	//крепление к стенам
	if (par.key == "out" && par.marshParams.wallFix.out) {
		var fixPar = getFixPart(par.marshId);
		//отверстие ближе к маршу
		center1 = newPoint_xy(pt3, 100, -100);
		center1.rad = fixPar.diam / 2 + 1;
		center1.hasAngle = false;
		center1.noZenk = true;
		center1.noBolts = true;
		center1.wallFix = true;
		pointsHoleBot.push(center1);
		
		//отверстие ближе к углу
		center1 = newPoint_xy(p2, -100, -100);
		center1.rad = fixPar.diam / 2 + 1;
		center1.hasAngle = false;
		center1.noZenk = true;
		center1.noBolts = true;
		center1.wallFix = true;
		par.pointsHole.push(center1);
	}

	//базовые точки для стыковки с другими частями косоура
	//http://6692035.ru/dev/mayorov/metal/image/drawBotStepKo_pltG_Lom.jpg - для ломанной
	//http://6692035.ru/dev/mayorov/metal/image/drawBotStepKo_pltG_Pil.jpg - для пилообразной

	par.botUnitEnd = par.pointsShape[par.pointsShape.length - 1];
	par.botUnitStart = par.pointsShape[0];
	par.midUnitEnd = par.botUnitEnd;

	//сохраняем координаты нижнего левого угла тетивы для самонесущего стекла
	par.keyPoints[par.key].botLineP0 = newPoint_xy(p2, 0, -215);//FIX
	if (par.key == "out")
		par.keyPoints[par.key].botLineP0.x -= params.platformLength_1;

}//end of drawBotStepKo_pltP


/**
 * первый подъем если снизу забег (внутренняя сторона марша)
 */
function drawBotStepKo_wndIn(par){
	
	var p0 = newPoint_xy(par.zeroPoint, params.nose - params.sideOverHang - 72, -(par.h * 2 + params.treadThickness + 215)); //215 - 2 уголка каркаса + 3 х 5мм 72 - подогнано
	if(par.isWndP){
		p0.x = params.M - 75.0 + 40 - params.sideOverHang;
		if (getMarshParams(getMarshParams(par.marshId).prevMarshId).stringerCover == "внутренняя") p0.x += 2;
	}
	if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && params.stairAmt2 == 0)
		p0.x -= params.marshDist - 77 + (params.nose - 20);

	/*ТОЧКИ КОНТУРА*/
	//нижняя левая точка
	var p1 = copyPoint(p0);

	// первая ступень
	var p2 = newPoint_xy(p1, 0.0, 100 + 100 + 15 + 0.01);
	var p3 = newPoint_xy(p2, par.wndSteps[1].in.topMarsh, 0.0);

	// вторая ступень
	var p4 = newPoint_xy(p3, 0.0, par.h - 0.01);
	var p5 = newPoint_xy(p4, par.wndSteps[2].in.topMarsh, 0.0);
	//if (params.stairModel == "П-образная трехмаршевая" &&par.marshId == 2 &&params.stairAmt2 == 0 && par.topEnd !== "winder")
	if (params.stairModel == "П-образная трехмаршевая" &&par.marshId == 2 &&params.stairAmt2 == 0)
		p5.x += (params.marshDist - 77 + (params.nose - 20));

	// третья ступень
	var p6 = newPoint_xy(p5, 0.0, par.h);
	var p7 = newPoint_xy(p6, par.wndSteps[3].in.topMarsh, 0.0);
	if (par.marshId == 2 && params.stairModel == "П-образная с забегом") p7.x += (params.marshDist - 57 - 20); //57 подогнано
	//if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && params.stairAmt2 == 0 && par.topEnd == "winder")
	//	p7.x += (params.marshDist - 77 + (params.nose - 20));
	//if (params.riserType == "есть" && params.stairAmt2 == 0) p7.x += 0.01;

	if (par.marshId == "3" && par.stairAmt == 0 && par.topEnd == "platformG") {
		p7.x += params.lastWinderTreadWidth - 55; //55 - номинальная ширина ступени	
	}

	//подъем первой ступени марша
	var p8 = newPoint_xy(p7, 0.0, par.h);	

	if (par.bottomTrimm){
		// обрезка снизу
		var htrim = par.h_prev - 135.0;
		if (params.bottomAngleType === "регулируемая опора") htrim -= 35.0;
		if (params.botFloorType === "черновой") htrim += params.botFloorsDist;
		p1 = newPoint_xy(p1, 0.0, 120.0 - htrim);
	}
	
	// нижняя линия
	var botLinePoints = [];
	
	if (params.stringerType != 'ломаная'){
		var p20 = newPoint_xy(p7, (par.stringerWidth / Math.sin(par.marshAng)), 0.0); // первая точка на нижней линии марша
		var p21 = polar(p20, par.marshAng, 100.0); // вторая точка на нижней линии                                               // вторая точка нижнего края косоура

		var botLineP1 = newPoint_xy(p1, 65, 0); //вторая точка на нижнем крае
		var botLineP2 = itercection(botLineP1, polar(botLineP1, Math.PI * 3 / 8, 100), p20, p21);           // точка пересчечения нижнего края и нижней линии марша
		botLinePoints.push(botLineP2, botLineP1)
		if(par.stairAmt == 0) botLinePoints.splice(0, 1);
		}

	if (params.stringerType == 'ломаная'){
		var botLineP1 = newPoint_xy(p1, par.stringerWidth, 0);
		var botLineP2 = newPoint_xy(p4, par.stringerWidth, - par.stringerWidth);
		var botLineP3 = newPoint_xy(p5, par.stringerWidth, - par.stringerWidth);
		if (p3.x != p2.x)
			botLineP2 = itercection(botLineP1, polar(botLineP1, Math.PI / 2, 100), botLineP3, polar(botLineP3, 0, 100));
		var botLineP4 = newPoint_xy(p6, par.stringerWidth, - par.stringerWidth);
		var botLineP5 = newPoint_xy(p7, par.stringerWidth, - par.stringerWidth);
		var botLineP6 = newPoint_xy(p8, par.stringerWidth, - par.stringerWidth);
		var botLineP7 = newPoint_xy(botLineP6, par.b, 0);
		var botLineP8 = newPoint_xy(botLineP7, 0, par.h);		
		botLinePoints.push(botLineP8, botLineP7, botLineP6, botLineP5, botLineP4, botLineP3, botLineP2, botLineP1)
		//удаляем ненужные точки для малого кол-ва ступеней
		if(par.topEnd == "floor"){
			if(par.stairAmt == 1) botLinePoints.splice(0, 2);
			if(par.stairAmt == 0) botLinePoints.splice(0, 6);
			}
		if(par.topEnd != "floor"){
			if(par.stairAmt == 1) botLinePoints.splice(0, 2);
			if(par.stairAmt == 0) botLinePoints.splice(0, 4);
			}
	}

	//сохраняем точки контура
	par.pointsShape.push(...botLinePoints);
	p1.filletRad = p2.filletRad = p3.filletRad = p4.filletRad = p5.filletRad = p6.filletRad = p7.filletRad = p8.filletRad = 0; //угол тетивы не скругляется
	par.pointsShape.push(p1);		
	if (p3.x != p2.x) {
		par.pointsShape.push(p2);
		par.pointsShape.push(p3);
	}
	par.pointsShape.push(p4);		
	par.pointsShape.push(p5);
	par.pointsShape.push(p6);
	par.pointsShape.push(p7);
	if (par.stairAmt > 0) par.pointsShape.push(p8);
	//if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && params.stairAmt2 == 0 && par.topEnd == "winder")
	//	par.pointsShape.push(p8);

	//сохраняем точку для расчета длины
	par.keyPoints.botPoint = copyPoint(p1);
	if (p3.x != p2.x) {
		if (!par.keyPoints.botLines) par.keyPoints.botLines = [];
		par.keyPoints.botLines.push({p1: copyPoint(p2), p2:copyPoint(p3)});
	}

	/*ОТВЕРСТИЯ*/
	
	// отверстие под вторую забежную рамку
	var holePar = {
		holes: par.wndFramesHoles.topMarsh.in[2],
		basePoint: newPoint_xy(p2, params.stringerThickness + params.sideOverHang * 2 + calcStringerMoove(par.marshId).stringerOutMoovePrev - params.M, par.h),
		}
	par.pointsHole.push(...calcWndHoles(holePar));
	
	// отверстие под третью забежную рамку
	var holePar = {
		holes: par.wndFramesHoles.topMarsh.in[3],
		basePoint: p6,
		}
	par.pointsHole.push(...calcWndHoles(holePar));

	// отверстия под уголки
	if (par.bottomTrimm){
		var center1 = newPoint_xy(p2, 30, -htrim);
		var center2 = newPoint_xy(center1, 0, -60);
		center1.rotated = center2.rotated = true;
		center1.hasAngle = center2.hasAngle = true;
		// если второе отверстие на уголке крепления к нижнему косоуру совпадает с отверстием под уголок крепления к нижнему перекрытию нижнего косоура
		if (par.prevMarshPar.botTurn == 'пол') {
			var turnParams = calcTurnParams(par.marshPar.prevMarshId)
			var stingerLen = turnParams.topMarshOffsetX + par.stringerSideOffset - params.nose + params.stringerThickness + 60;
			if (params.riserType == "есть") stingerLen -= params.riserThickness;
			if (stingerLen >= 120) center2.noBoltsInSide1_2 = true;
		}
		par.pointsHole.push(center2);
		par.pointsHole.push(center1);
	}
	else {
		var center1 = newPoint_xy(p2, 30, -25);
		var center2 = newPoint_xy(center1, 0, -60);
		center1.hasAngle = center2.hasAngle = true;
		center1.rotated = center2.rotated = true;
		par.pointsHole.push(center2);
		par.pointsHole.push(center1);

		var center1 = newPoint_xy(p2, 30, -130);
		var center2 = newPoint_xy(center1, 0, -60);
		center1.rotated = center2.rotated = true;
		center1.hasAngle = center2.hasAngle = true;
		par.pointsHole.push(center2);
		par.pointsHole.push(center1);
	}


	//Отверстия под ограждения
	if (par.hasRailing && par.stairAmt > 0){
		if (params.railingModel != "Самонесущее стекло"){
			center1 = newPoint_xy(p7, par.b * 0.5, par.stepHoleY + par.h);
			//смещаем первую стойку ближе к краю ступени
			if (params.rackBottom != "сверху с крышкой") {
				center1 = newPoint_x1(center1, -par.b * 0.5 + 50, par.marshAng)

				//если длиная стойка, сдвигаем стойку до края предыдущего марша
				if (params.stairModel == "П-образная с забегом")
					par.prevMarshPar.hasRailing.in = false;
				if (par.prevMarshPar.hasRailing.in) {
					var pt = setTurnRacksParams(par.marshId, par.key).stringerShiftPoint;
					center1 = newPoint_xy(p7, pt.x, par.stepHoleY + pt.y);
					center1.isTurnRack = true;
					center1.noDrawHoles = true;
				}
			}
			par.railingHoles.push(center1);
		}

		if (params.railingModel == "Самонесущее стекло" && !(par.stairAmt == 1 && par.topEnd == "floor")){
			center1 = newPoint_xy(p7, par.b * 0.5, par.rutelPosY + par.h);
			center2 = newPoint_xy(center1, 0.0, -par.rutelDist);
			par.railingHoles.push(center1);
			par.railingHoles.push(center2);
		}

	}

	//базовые точки для стыковки с другими частями косоура
	//http://6692035.ru/dev/mayorov/metal/image/drawBotStepKo_wndIn_Lom.jpg - для ломанной
	//http://6692035.ru/dev/mayorov/metal/image/drawBotStepKo_wndIn_Pil.jpg - для пилообразной

	par.botUnitEnd = par.pointsShape[par.pointsShape.length - 1];
	par.botUnitStart = par.pointsShape[0];
	par.midUnitEnd = par.botUnitEnd;

	//сохраняем координаты нижнего левого угла тетивы для самонесущего стекла
	par.keyPoints[par.key].botLineP0 = newPoint_xy(p1, par.stringerSideOffset, 0);

}//end of drawBotStepKo_wndIn

/**
 * первый подъем если снизу забег (внешняя сторона марша)
 */
function drawBotStepKo_wndOut(par){
	
	var p0 = newPoint_xy(par.zeroPoint, -params.M + params.nose - 72 + par.stringerSideOffset + params.stringerThickness + calcStringerMoove(par.marshId).stringerOutMoovePrev, -(par.h + params.treadThickness + 215));
	if(par.isWndP){
		p0.x = -10 + params.sideOverHang + calcStringerMoove(par.marshId).stringerOutMoovePrev;
	}
	if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && params.stairAmt2 == 0) 
		p0.x -= params.marshDist - 77 + (params.nose - 20);
	/*ТОЧКИ КОНТУРА*/
	//нижний край косоура
	var p1 = copyPoint(p0);
	
	// вторая забежная ступень
	var p2 = newPoint_xy(p1, 0.0, 100 + 100 + 15); //задний верхний угол косоура
	var p3 = newPoint_xy(p2, par.wndSteps[2].out.topMarsh, 0.0);

	// третья забежная ступень
	var p4 = newPoint_xy(p3, 0.0, par.h);
	var p5 = newPoint_xy(p4, par.wndSteps[3].out.topMarsh + 0.01, 0.0);
	if (par.isWndP) p5.x += (params.marshDist - 77); //57 подогнано
	if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && params.stairAmt2 == 0)
		p5.x += (params.marshDist - 77 + (params.nose - 20));
	if (par.marshId == "3" && par.stairAmt == 0 && par.topEnd == "platformG") {
		p5.x += params.lastWinderTreadWidth - 55; //55 - номинальная ширина ступени	
	}
	
	//подъем первой ступени
	var p6 = newPoint_xy(p5, 0.0, par.h);
	
	//нижняя линия
	
	var botLinePoints = [];
	
	if (params.stringerType != 'ломаная'){
		var line = parallel(p3, p5, -par.stringerWidth);
		var p20 = newPoint_xy(p5, (par.stringerWidth / Math.sin(par.marshAng)), 0.0); // первая точка на нижней линии марша
		var p21 = polar(p20, par.marshAng, 100.0); // вторая точка на нижней линии	
		var botLineP2 = itercection(line.p1, line.p2, p20, p21);  // точка пересчечения нижнего края и нижней линии марша
		var botLineP1 = itercection(line.p1, line.p2, p1, polar(p1, 0, 100)); //вторая точка на нижнем крае
		if (par.stairAmt != 0) botLinePoints.push(botLineP2);
		botLinePoints.push(botLineP1);
		}
		
	if (params.stringerType == 'ломаная'){
		var botLineP3 = newPoint_xy(p4, par.stringerWidth, - par.stringerWidth);
		var botLineP2 = {x: botLineP3.x, y: p1.y};
		var botLineP4 = newPoint_xy(p5, par.stringerWidth, - par.stringerWidth);
		var botLineP5 = newPoint_xy(botLineP4, 0, par.h);
		var botLineP6 = newPoint_xy(botLineP5, par.b, 0);
		var botLineP7 = newPoint_xy(botLineP6, 0, par.h);
		botLinePoints.push(botLineP7, botLineP6, botLineP5, botLineP4, botLineP3, botLineP2);
		//удаляем ненужные точки для последнего марша
		if(par.topEnd == "floor"){
			if(par.stairAmt == 1) botLinePoints.splice(0, 2);
			if(par.stairAmt == 0) botLinePoints.splice(0, 4);
			}
		if(par.topEnd != "floor"){
			if(par.stairAmt == 1) botLinePoints.splice(0, 2);
			if(par.stairAmt == 0) botLinePoints.splice(0, 2);
			}
		}

	//сохраняем точки контура
	par.pointsShape.push(...botLinePoints);
	p1.filletRad = p2.filletRad = p3.filletRad = p4.filletRad = p5.filletRad = p6.filletRad = 0; //угол тетивы не скругляется
	par.pointsShape.push(p1);
	par.pointsShape.push(p2);
	par.pointsShape.push(p3);
	par.pointsShape.push(p4);
	par.pointsShape.push(p5);
	if (par.stairAmt > 0) par.pointsShape.push(p6);
	if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && params.stairAmt2 == 0 && par.topEnd == "winder")
		par.pointsShape.push(p6);

	//сохраняем точки для отладки
	par.keyPoints[par.key].botEnd = p2;
	
	//сохраняем точку для расчета длины
	par.keyPoints.botPoint = copyPoint(p1);
	
	/*ОТВЕРСТИЯ*/
	
	// отверстия под уголки каркаса
	//верхний уголок
	var center1 = newPoint_xy(p2, 30, -25);
	var center2 = newPoint_xy(center1, 0, -60);
	center1.hasAngle = center2.hasAngle = true;
	center1.rotated = center2.rotated = true;
	par.pointsHole.push(center2);
	par.pointsHole.push(center1);

	//нижний уголок
	var center3 = newPoint_xy(center2, 0, -45);
	var center4 = newPoint_xy(center3, 0, -60);
	center3.hasAngle = center4.hasAngle = true;
	center3.rotated = center4.rotated = true;
	par.pointsHole.push(center4);
	par.pointsHole.push(center3);

	//уголок на продлении внутреннего косоура предыдущего марша
	if (par.longStringerTop) {
		var parFrames = { marshId: par.marshId };
		calcFrameParams(parFrames); // рассчитываем параметры рамки
		//позиция уголка относительно угла косоура
		var anglePos = {
			x: params.M - params.sideOverHang * 2 - params.stringerThickness * 2 - calcStringerMoove(par.marshId).stringerOutMoovePrev,
			y: par.h - parFrames.profHeight,
			}
		var center1 = newPoint_xy(p2, anglePos.x - 30, anglePos.y -25);
		var center2 = newPoint_xy(center1, 0, -60);
		center1.hasAngle = center2.hasAngle = false; 
		par.pointsHole.push(center2);
		par.pointsHole.push(center1); 
		}
	
	// отверстие под вторую забежную рамку
	var holePar = {
		holes: par.wndFramesHoles.topMarsh.out[2],
		basePoint: p2,
		}
	par.pointsHole.push(...calcWndHoles(holePar));
	
	// отверстие под третью забежную рамку
	var holePar = {
		holes: par.wndFramesHoles.topMarsh.out[3],
		basePoint: newPoint_xy(p4, par.wndSteps[3].out.topMarsh - par.wndSteps[3].in.topMarsh, 0.0),
	}
	//if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && params.stairAmt2 == 0 && par.topEnd == "platformG")
	if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && params.stairAmt2 == 0)
		holePar.basePoint.x += (params.marshDist - 77 + (params.nose - 20));
	par.pointsHole.push(...calcWndHoles(holePar));
	
	//Отверстия под ограждения
	if (par.hasRailing){
		if (params.railingModel != "Самонесущее стекло"){
			// стойка, ближняя к углу
			center1 = newPoint_xy(p2, 80 - params.stringerThickness, par.stepHoleY);
			par.railingHoles.push(center1);

			// отверстия под стойку ближе к маршу
			
			//заднее ограждение забега П-образной
			if (par.stairAmt == 0 && par.topEnd == "winder") {
				var deltaX = params.M * 2 + params.marshDist - 80 * 2 - params.sideOverHang * 2;
				var deltaY = par.h * 3;
				var handrailAngle = Math.atan(deltaY / deltaX);
				center1 = newPoint_y(center1, par.h, handrailAngle)
				par.railingHoles.push(center1);
				}
			else {
				center1 = newPoint_xy(p5, par.b * 0.5, par.stepHoleY + par.h);
				if (par.stairAmt > 1) par.railingHoles.push(center1);
				if (par.stairAmt == 1 && params.stairModel == "П-образная трехмаршевая" && par.marshId == 2) par.railingHoles.push(center1);
				}		
		}

		if (params.railingModel == "Самонесущее стекло" && !(par.stairAmt <= 1 && par.topEnd == "floor")){
			//FIX
			// отверстия под стойку 1
			center1 = newPoint_xy(p2, 60 + 15 + params.stringerThickness, par.rutelPosY);
			center2 = newPoint_xy(center1, 0.0, -par.rutelDist);
			par.railingHoles.push(center1);
			par.railingHoles.push(center2);

			// отверстия под стойку 2
			center1 = newPoint_xy(p4, par.b * 0.5, par.rutelPosY);
			center2 = newPoint_xy(center1, 0.0, -par.rutelDist);
			par.railingHoles.push(center1);
			par.railingHoles.push(center2);

			// отверстия под стойку  на ступени
			center1 = newPoint_xy(p5, par.b * 0.5, par.rutelPosY + par.h);
			center2 = newPoint_xy(center1, 0.0, -par.rutelDist);
			par.railingHoles.push(center1);
			par.railingHoles.push(center2);
		}

	}

	//крепление к стенам
	if (par.marshParams.wallFix.out) {
		var fixPar = getFixPart(par.marshId);
		//отверстие ближе к маршу
		center1 = newPoint_xy(p2, 200, -100);
		center1.rad = fixPar.diam / 2 + 1;
		center1.hasAngle = false;
		center1.noZenk = true;
		center1.noBolts = true;
		center1.wallFix = true;
		par.pointsHole.push(center1);
		//отверстие ближе к углу
		center1 = newPoint_xy(p5, -100, -100);
		center1.rad = fixPar.diam / 2 + 1;
		center1.hasAngle = false;
		center1.noZenk = true;
		center1.noBolts = true;
		center1.wallFix = true;
		par.pointsHole.push(center1);
	}

	//базовые точки для стыковки с другими частями косоура
	//http://6692035.ru/dev/mayorov/metal/image/drawBotStepKo_wndOut_Lom.jpg - для ломанной
	//http://6692035.ru/dev/mayorov/metal/image/drawBotStepKo_wndOut_Pil.jpg - для пилообразной

	//сохраняем координаты нижнего левого угла тетивы для самонесущего стекла
	//FIX zeroPoint заменен на p1
	par.keyPoints[par.key].botLineP0 = copyPoint(p1);//FIX TEMPORARY p1!

}//end of drawBotStepKo_wndOut


/**
 * средние ступени
 */

function drawMiddleStepsKo(par){
	
	//сохраняем точки для отладки
	par.keyPoints[par.key].botUnitStart = par.pointsShape[0];
	par.keyPoints[par.key].botUnitEnd = par.pointsShape[par.pointsShape.length - 1];
	
	
	/*ТОЧКИ КОНТУРА*/
		
	//верхняя линия
	var topLinePar = {
		marshId: par.marshId,
		type: "top",
		prevUnitEnd: par.pointsShape[par.pointsShape.length - 1],
		};
	var marshTopLine = drawMarshSteps(topLinePar).points;
	par.pointsShape.push(...marshTopLine);
	
	//сохраняем точки для отладки
	par.keyPoints[par.key].marshTopStart = marshTopLine[0];	
	par.keyPoints[par.key].marshTopEnd = marshTopLine[marshTopLine.length - 1];

	//чтобы небыло пересечения колонны и пригласительной ступени, сдвигаем колонну
	if (par.botEnd == "floor" && par.stairAmt == params.startTreadAmt) {
		par.keyPoints[par.key].marshTopEnd = newPoint_xy(par.keyPoints[par.key].marshTopEnd, 90, 35);
	}

	
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
	
	// цикл начинаем со ступени №1
	for (var i = 1; i <= par.stairAmt; i++){
		var p1 = newPoint_xy(p0, par.b * (i - 1), par.h * (i - 1));
		
		// отверстия под рамку
		if (i != par.divide){
			var center1 = newPoint_xy(p1, par.stepHoleX1, par.stepHoleY);
			var center2 = newPoint_xy(p1, par.stepHoleX2, par.stepHoleY);

			par.pointsHole.push(center1);
			par.pointsHole.push(center2);
			}


		if (i == par.divide && i > 0) {
			var divideY = 50;
			//вспомогательыне точки на нижней линии
			var p20 = newPoint_xy(p0, par.b + (par.stringerWidth / Math.sin(par.marshAng)), 0.0); // первая точка на нижней линии марша
			var p21 = polar(p20, par.marshAng, 100.0); // вторая точка на нижней линии
			
			var divideP1 = newPoint_xy(p1, 0.0, -divideY);
			var divideP2 = newPoint_xy(divideP1, 20.0, 0.0);
			divideP2 = itercection(divideP1, divideP2, p20, p21);
			// точка пересчечения линии стыка и нижней линии марша
			if (params.stringerType == "ломаная"){
				divideP2 = newPoint_xy(divideP1, par.b + par.stringerWidth, 0.0);
			}
			var trashShape = new THREE.Shape();
			addLine(trashShape, dxfPrimitivesArr, divideP1, divideP2, par.dxfBasePoint);
			
			//отверстия для рамки на фланце
			var center1 = newPoint_xy(p1, par.stepHoleX1, par.stepHoleY);
			var center2 = newPoint_xy(p1, par.stepHoleX2, par.stepHoleY);
			center1.noBolts = true;
			center2.noBolts = true;

			var franPar = {
				divideP1: divideP1,
				divideP2: divideP2,
				marshId: par.marshId,
				angleHoles: {
					center1: center1,
					center2: center2,
					},				
				}

			var holes = calcFlanHoles(franPar).holeCenters;
			par.pointsHole.push(...holes);
			
			//сохраняем точки для расчета длин косоуров
			par.keyPoints.divideP1 = copyPoint(divideP1);
			par.keyPoints.divideP2 = copyPoint(divideP2);
		}

		// отверстия под стойку

		if (par.railing.indexOf(i) != -1 && i > 1 && i < par.stairAmt){
			if (par.hasRailing){
				if (params.railingModel != "Самонесущее стекло"){
					center1 = newPoint_xy(p1, par.rutelPosX, par.stepHoleY);
					//смещаем стойку ближе к началу ступени
					if(params.rackBottom == "боковое"){
						var mooveX = center1.x - p1.x - 40; //40 - отступ отверстия от края ступени					
						center1 = newPoint_x1(center1, - mooveX, par.marshAng);
					}
					par.railingHoles.push(center1);
					
				}

				if (params.railingModel == "Самонесущее стекло"){
					center1 = newPoint_xy(p1, par.rutelPosX, par.rutelPosY);
					center2 = newPoint_xy(center1, 0.0, -par.rutelDist);
					par.railingHoles.push(center1);
					par.railingHoles.push(center2);
				}

			}
		}

		// отверстия под опорные колонны
		/*
		if (params.stairModel == "Прямая" && i == Math.round(par.stairAmt / 2) && par.profWidth){
			var isZen = false;
			if ((params.isColumn1 && par.key == "in") || (params.isColumn2 && par.key == "out")){
				var center1 = newPoint_xy(p1, par.b + 20 + par.profWidth / 2, par.h + params.treadThickness - par.h * 0.5 - 20);
				var center2 = newPoint_xy(center1, 0, -60);
				center1.isColumnHole = center2.isColumnHole = true;
				center1.hasAngle = center2.hasAngle = false;
				center1.backZenk = center2.backZenk = true;
				par.pointsHole.push(center1);
				par.pointsHole.push(center2);
			}
		}
		*/
	}
	


	//базовые точки для стыковки с другими частями косоура
	//http://6692035.ru/dev/mayorov/metal/image/drawMiddleStepsKo.jpg

	//точки на нижней линии марша для самонесущего стекла
	//var p10 = polar(par.midUnitEnd, (par.marshAng - Math.PI / 2), par.stringerWidth) // первая точка на нижней линии марша
	//var p20 = polar(p10, par.marshAng, -100.0)

	//par.keyPoints[par.key].marshBotLineP1 = newPoint_xy(p10, 0, -215)//FIX
	//par.keyPoints[par.key].marshBotLineP2 = newPoint_xy(p20, 0, -215)

	var p10 = par.pointsShape[0] // первая точка на нижней линии марша
	var p20 = polar(p10, par.marshAng, -100.0)
	par.keyPoints[par.key].marshBotLineP1 = copyPoint(p10)//FIX
	par.keyPoints[par.key].marshBotLineP2 = copyPoint(p20)

}//end of drawMiddleStepsKo


/**
 * Верхние узлы
 */

/**
 * последний подъем если сверху перекрытие
 */
function drawTopStepKo_floor(par){
	
	var p1 = par.pointsShape[par.pointsShape.length - 1];

	//размеры верхнего выступа
	var topLedgeWidth = 0;
	var topLedgeHeight = 0;

	// последняя проступь
	var topStepWidth = par.b;
	if (par.stairAmt == 0) {
		topStepWidth = params.lastWinderTreadWidth - 55; //55 - номинальная ширина ступени		
		}

	if(params.riserType == "есть") topStepWidth -= params.riserThickness;
	
	//if(par.stairAmt == 0 && par.marshParams.botTurn == "забег" && par.key == "in") topStepWidth = 0; //ширина уже учтена в последней забежной проступи
	
	if (params.topAnglePosition == "вертикальная рамка"){
		topLedgeWidth = 40;
		topLedgeHeight = par.h - 20;
		topStepWidth += topLedgeWidth + params.riserThickness;
		}

	if (params.topFlan == "есть") topStepWidth += 8;

	/*ТОЧКИ КОНТУРА*/
	
	// проступь
	var topLineP1 = newPoint_xy(p1, topStepWidth, 0);
	
	//верхний выступ
	var topLedgePoints = [];
	
	if (topLedgeWidth != 0){
		//верхняя проступь
		var p3 = newPoint_xy(topLineP1, -topLedgeWidth, 0.0);
		p3.filletRad = 0; //угол тетивы не скругляется
		topLedgePoints.push(p3);

		//вертикальный участок
		var p4 = newPoint_xy(p3, 0.0, topLedgeHeight);
		topLedgePoints.push(p4);

		//горизонтальный участок
		var topLineP1 = newPoint_xy(p4, topLedgeWidth, 0.0);
	}

	
	// нижняя линия
	
	var botLinePoints = [];
	
	if (params.stringerType != "ломаная"){
		//вспомогательыне точки на нижней линии
		var p0 = newPoint_xy(p1, 0, -par.h);
		var p20 = polar(p0, (par.marshAng - Math.PI / 2), par.stringerWidth) // первая точка на нижней линии марша
		var p21 = polar(p20, par.marshAng, 100.0);
		var topLineP2 = itercection(p20, p21, topLineP1, newPoint_xy(topLineP1, 0, 100));
		}
	
	if (params.stringerType == "ломаная"){
		var topLineP2 = {x: topLineP1.x, y: p1.y - par.stringerWidth};
		
		//если проступь маленькая, то снизу нет последнего уступа
		
		if(par.pointsShape[0].x >= topLineP2.x - 10){
			topLineP2.y = par.pointsShape[0].y; //переносим topLineP2 вниз до уровня уступа
			par.pointsShape.shift(); //удаляем первую точку
			//если проступь еще меньше, удаляем еще одну точку
			if(par.pointsShape[0].x >= topLineP2.x - 10){
				topLineP2.y = par.pointsShape[0].y; //переносим topLineP2 вниз до уровня уступа
				par.pointsShape.shift(); //удаляем первый элемент
				}
				
			}
		}
		
	botLinePoints.push(topLineP2);
	
	//сохраняем точки контура
	var curPos = par.pointsShape.length;
	par.pointsShape.push(...topLedgePoints);
	topLineP1.filletRad = 0; //верхний угол тетивы не скругляется
	par.pointsShape.push(topLineP1);
	par.pointsShape.push(...botLinePoints);
	
	//сохраняем точки для отладки
	par.keyPoints[par.key].topUnitStart = par.pointsShape[curPos];
	par.keyPoints[par.key].topUnitEnd = par.pointsShape[par.pointsShape.length - 1];

	
	//сохраняем точку для расчета длины
	par.keyPoints.topPoint = copyPoint(topLineP1);
	
	/*ОТВЕРСТИЯ*/

	//Отверстия под ограждения
	if (par.hasRailing){
		if (params.railingModel != "Самонесущее стекло"){
			center1 = newPoint_xy(p1, par.rutelPosX, par.stepHoleY);
			if (par.stairAmt == 0) {
				center1 = newPoint_xy(topLineP1, -60, -20);
				}
			//удлиннение последней стойки
            var dyLastRack = calcLastRackDeltaY(); //функция в файле drawRailing_3.0;
			center1.x += dyLastRack / Math.tan(par.marshAng);
			if (center1.x + 30 > topLineP1.x) center1 = newPoint_x1(center1, -(30 - (topLineP1.x - center1.x)), par.marshAng);
			//смещаем отверстие чуть назад, чтобы не было пересечения с отверстием рамки
			if (params.topAnglePosition != "вертикальная рамка"){
				//if(topLineP1.x > center1.x - 70) center1 = newPoint_x1(center1, -(70 - (topLineP1.x - center1.x)), par.marshAng)
				var dx = 0;
				for (var i = 0; i < par.pointsHole.length; i++) {
					if (par.pointsHole[i].x > (center1.x - 15) && par.pointsHole[i].x < (center1.x + 15)) {
						if (par.pointsHole[i].y > (center1.y - 15) && par.pointsHole[i].y < (center1.y + 15)) {
							if (par.pointsHole[i].x > center1.x) dx = center1.x - (par.pointsHole[i].x - 15);
							if (par.pointsHole[i].x < center1.x) dx = center1.x - par.pointsHole[i].x + 15;
						}
					}
				}
				center1 = newPoint_x1(center1, -dx, par.marshAng)
			}
			//смещаем отверстие чуть назад, чтобы стойка не вылезала за край косоура
			if (params.topAnglePosition == "вертикальная рамка"){
				center1 = newPoint_x1(center1, -25, par.marshAng); //25 - подогнано
				if (par.stairAmt == 0) {
					center1 = newPoint_xy(topLineP1, -60, -20 - topLedgeHeight);
				}
			}
			if(params.rackBottom == "сверху с крышкой") {
				center1 = newPoint_xy(p1, par.rutelPosX, par.stepHoleY);
				}
			par.railingHoles.push(center1);
		}

		if (params.railingModel == "Самонесущее стекло"){
			center1 = newPoint_xy(p1, par.rutelPosX, par.rutelPosY);
			if (par.stairAmt == 0) {
				center1 = newPoint_xy(topLineP1, -60, -20 - topLedgeHeight);
			}
			center2 = newPoint_xy(center1, 0.0, -par.rutelDist);
			par.railingHoles.push(center1);
			par.railingHoles.push(center2);
			par.keyPoints[par.key].botLineP10 = newPoint_xy(topLineP1, 0, -215);//FIX
			/*if (par.key == 'in') {
				par.keyPoints[par.key].botLineP10.x -= params.nose - params.sideOverHang + 12;//Взято из функции где считается первая точка
			}
			*/
		}

	}

	// отверстия под верхний крепежный уголок
	if (params.topAnglePosition == "вертикальная рамка"){
		center1 = newPoint_xy(topLineP1, -topLedgeWidth / 2, -30);
		if (params.topFlan == "есть") center1 = newPoint_xy(center1, -8, 0);
		center2 = newPoint_xy(center1, 0.0, -(par.h - 50 * 2));
		par.pointsHole.push(center2);
		par.pointsHole.push(center1);
		center1.hasAngle = center2.hasAngle = false;
		center1.pos = center2.pos = "topFrame";			
			
		}
	if (params.topAnglePosition == "под ступенью") {		
		var parFrames = { marshId: par.marshId };
		calcFrameParams(parFrames); // рассчитываем параметры рамки

		center1 = newPoint_xy(topLineP1, -35, -(parFrames.profHeight + 20));// 20 - расстояние от отверстия в уголке до его торца
		if (params.topFlan == "есть") center1 = newPoint_xy(center1, -8, 0);
		center2 = newPoint_xy(center1, 0.0, -60.0);
		center1.hasAngle = center2.hasAngle = true;
		center1.pos = center2.pos = "topFloor";
		if (params.riserType == "есть" && par.botEnd == "winder" && par.stairAmt == 0) {
			//center1.x = center2.x += 5;
		}	
		par.pointsHole.push(center2);
		par.pointsHole.push(center1);
		}
}//end of drawTopStepKo_floor

/**
 * последний подъем если сверху площадка (Г-образная лестница либо верхняя площадка)
 */
function drawTopStepKo_pltG(par){
	
	var anglePosX = 30 + params.stringerThickness + 0.01;
	if (par.marshId == 3 || params.stairModel == "Прямая") anglePosX = 30;
	
	var p0 = par.pointsShape[par.pointsShape.length - 1];
	var p1 = newPoint_xy(p0, par.b, 0);
	var p20 = newPoint_xy(p1, (par.stringerWidth / Math.sin(par.marshAng)), 0.0); // первая точка на нижней линии марша
	var p21 = polar(p20, par.marshAng, 100.0); // вторая точка на нижней линии

	/*ТОЧКИ КОНТУРА*/
	
	//проступь последней ступени марша
	var p1 = newPoint_xy(p0, par.b, 0);
	if (par.stairAmt == 0) p1 = copyPoint(p0);
	
	// подъем ступени
	var p2 = newPoint_xy(p1, 0.0, par.h);
	//if (par.stairAmt == 0) p2 = newPoint_xy(p1, 0, 0);

	// проступь
	var topLineP1 = newPoint_xy(p2, par.topEndLength, 0.0);
			

	//сохраняем точки контура
	p1.filletRad = p2.filletRad = topLineP1.filletRad = 0;
	if (par.stairAmt !== 0) par.pointsShape.push(p1);
	par.pointsShape.push(p2);	
	if (par.stringerDivision) par.pointsShape.push(topLineP1);
	
	
	//сохраняем точку для расчета длины
	par.keyPoints.topPoint = copyPoint(topLineP1);
	
	//удлинение косоура площадки
	var platformLen = par.tyrnLengthTop - 0.01;
	var pltStringerLen = platformLen - params.sideOverHang - params.nose - par.topEndLength;// - params.stringerThickness;
	if (!par.stringerLast) pltStringerLen -= calcStringerMoove(par.marshId).stringerOutMooveNext;
	
	//для верхней площадки
	if (par.stringerLast) {
		if(params.platformRearStringer == "есть") pltStringerLen -= params.stringerThickness;
		if(params.platformRearStringer == "нет") pltStringerLen += params.sideOverHang; 
		}
	//if (params.stairModel == "Прямая") pltStringerLen = platformLen - params.nose - par.topEndLength - 0.01;
	if (params.riserType == "есть") pltStringerLen -= params.riserThickness;
	if (!par.stringerDivision && !par.stringerLast && par.key == "in") pltStringerLen -= params.stringerThickness;
	
	var pt1 = newPoint_xy(p2, par.topEndLength, 0);
	var pt2 = newPoint_xy(pt1, pltStringerLen, 0);
	var pt3 = newPoint_xy(pt2, 0, -par.stringerWidthPlatform);
	var pt4 = newPoint_xy(pt1, 0.0, -par.stringerWidthPlatform);

	pt1.filletRad = pt2.filletRad = pt3.filletRad = pt4.filletRad = 0; //углы косоура не скругляются
	if (par.stringerDivision) {
		par.pointsShapeTop.push(pt4);
		par.pointsShapeTop.push(pt1);
		par.pointsShapeTop.push(pt2);
		par.pointsShapeTop.push(pt3);
		
		//сохраняем длину для спецификации
		par.partsLen.push(distance(pt1, pt2))

		par.keyPoints.botPointDop = copyPoint(pt4);
		par.keyPoints.topPointDop = copyPoint(pt2);
	}
	if (!par.stringerDivision) {
		par.pointsShape.push(pt2);
		par.pointsShape.push(pt3);
		//сохраняем точку для расчета длины
		par.keyPoints.topPoint = copyPoint(pt2);
	}


	// нижняя линия
	var botLinePoints = [];

	if (params.stringerType != "ломаная") {
		var topLineP2 = itercection(p20, p21, topLineP1, polar(topLineP1, Math.PI / 2, 100));
		if (!par.stringerDivision) {
			topLineP2 = itercection(p20, p21, pt3, polar(pt3, 0, 100));
			if (topLineP2.x > pt3.x) {
				par.pointsShape.pop(); //удаляем pt3
				topLineP2 = itercection(p20, p21, pt2, polar(pt2, Math.PI / 2, 100));
			}
		}
		if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && params.stairAmt2 == 0)
			topLineP2 = newPoint_xy(topLineP1, 0, -par.stringerWidthPlatform);

		botLinePoints.push(topLineP2);
	}

	if (params.stringerType == "ломаная") {
		var botLineP2 = newPoint_xy(p2, par.stringerWidth, -par.stringerWidthPlatform);
		var botLineP1 = itercection(botLineP2, polar(botLineP2, 0, 100), topLineP1, polar(topLineP1, Math.PI / 2, 100));
		botLineP1.filletRad = 0; //нижний угол тетивы не скругляется
		var botLineP3 = newPoint_xy(p1, par.stringerWidth, -par.stringerWidth);
		if (par.stringerDivision) botLinePoints.push(botLineP1);
		botLinePoints.push(botLineP2);
		botLinePoints.push(botLineP3);
	}

	par.pointsShape.push(...botLinePoints);

	

	/*ОТВЕРСТИЯ*/
	var pointsHoleTop = par.pointsHoleTop;
	var railingHolesTop = par.railingHolesTop;
	//если нет разделения косоуров
	if (!par.stringerDivision) {
		pointsHoleTop = par.pointsHole;
		railingHolesTop = par.railingHoles;
	}
	

	//Отверстия под ограждения
	var hasRailingTop = false;
	if (par.stringerLast && !par.hasRailing) {
		if (params.topPltRailing_3 && par.key == "out") hasRailingTop = true;
		if (params.topPltRailing_4 && par.key == "in") hasRailingTop = true;
		par.hasPltRailing = true;
		if (params.stairModel == 'Прямая') {
			hasRailingTop = false;
			if (params.topPltRailing_3 && par.key == "in") hasRailingTop = true;
			if (params.topPltRailing_4 && par.key == "out") hasRailingTop = true;
		}
		if (turnFactor == -1) {
			if (params.topPltRailing_3 && par.key == "in") hasRailingTop = true;
			if (params.topPltRailing_4 && par.key == "out") hasRailingTop = true;
			par.hasPltRailing = true;
			if (params.stairModel == 'Прямая') {
				hasRailingTop = false;
				if (params.topPltRailing_3 && par.key == "out") hasRailingTop = true;
				if (params.topPltRailing_4 && par.key == "in") hasRailingTop = true;
			}
		}
	}
	if (par.hasRailing || hasRailingTop) {
		if (params.railingModel != "Самонесущее стекло") {
			if (par.stringerLast || par.key == "out") {
				//стойка ближе к маршу
				center1 = newPoint_xy(p2, par.b / 2, par.stepHoleY);
				par.railingHoles.push(center1);
				if(par.hasPltRailing){
					//стойка ближе к углу площадки
					center1 = newPoint_xy(pt2, -80, par.stepHoleY);
					if (params.rackBottom == "сверху с крышкой") center1.x -= 80;
					railingHolesTop.push(center1);
					}
				}
			if (par.key == "in" && !par.stringerLast) {
				center1 = newPoint_xy(p0, par.b / 2, par.stepHoleY);

				//если на следующем марше повортная стойка, стойку не рисуем и сохраняем сдвиг отверстия до края следующего марша
				if (par.nextMarshPar.hasRailing.in) {
					center1.noDraw = true;
					//сохраняем сдвиг отверстия до края следующего марша (для расчета поручня и ригелей)
					center1.dxToMarshNext = -(center1.x - p0.x) + par.b - params.nose + par.turnBotParams.topMarshOffsetX - 0.1;
					if (params.riserType == "есть") center1.dxToMarshNext -= params.riserThickness;

					//отверстия для крепления поворотной стойки следущего марша
					var center2 = newPoint_xy(p0, par.b - params.nose + par.turnBotParams.topMarshOffsetX - 40 / 2, par.stepHoleY);
					if (params.riserType == "есть") center2.x -= params.riserThickness;
					center2.y -= setTurnRacksParams(par.marshPar.nextMarshId, par.key).shiftBotFrame;//сдвиг кронштейна вниз чтобы не попадал на крепление рамки
					center2.noRack = true; // отверстие не учитывается при построении заграждения
					par.railingHoles.push(center2);
				}

				par.railingHoles.push(center1);
				}
		}

		if (params.railingModel == "Самонесущее стекло"){
			
			center1 = newPoint_xy(p2, par.b / 2, par.rutelPosY);
			if (par.key == "in") center1 = newPoint_xy(p0, par.b / 2, par.rutelPosY);
			center2 = newPoint_xy(center1, 0.0, -par.rutelDist);
			par.railingHoles.push(center1);
			par.railingHoles.push(center2);
			
			if (par.key == 'out' || par.stringerLast){
				//Около начала марша
				center1 = newPoint_xy(pt1, 90, par.rutelPosY);
				center2 = newPoint_xy(center1, 0.0, -60);
				railingHolesTop.push(center1);
				railingHolesTop.push(center2);
				//Угол
				center1 = newPoint_xy(pt2, -90, par.rutelPosY);
				center2 = newPoint_xy(center1, 0.0, -60);
				railingHolesTop.push(center1);
				railingHolesTop.push(center2);
				}
		}
	}

	// отверстия под соединительный фланец
	if (par.stringerDivision) {
		center1 = newPoint_xy(topLineP1, -30.0, -par.stringerWidthPlatform + 85.0);
		//center1 = newPoint_xy(topLineP1, -30.0, -95.0);
		center2 = newPoint_xy(center1, 0, -60.0);
		center1.hasAngle = center2.hasAngle = false;
		center1.isTopFlanHole = center2.isTopFlanHole = true;
		center1.pos = "topLeft";
		center2.pos = "botLeft";
		par.pointsHole.push(center1);
		par.pointsHole.push(center2);
		par.flanSidePointInsert = newPoint_xy(center1, -20.0, 20.0);
	}

	// отверстия для крепления верхнего марша
	//if (par.key == "in" && !par.stringerLast && par.stairAmt !== 0){
	if (par.key == "in" && !par.stringerLast){
		var stringerOffset = params.sideOverHang + par.turnParams.topMarshOffsetX - params.nose;
		center1 = newPoint_xy(p2, stringerOffset + params.stringerThickness + 30, -par.stringerWidthPlatform + 85.0);
		//center1 = newPoint_xy(p2, stringerOffset + params.stringerThickness + 30, -95.0);
		if(params.riserType == "есть") center1.x -= params.riserThickness;
		center2 = newPoint_xy(center1, 0, -60.0);
		center1.backZenk = center2.backZenk = true;
		par.pointsHole.push(center1);
		par.pointsHole.push(center2);
	}

	//отверстия под задний уголок
	center1 = newPoint_xy(pt3, -anglePosX, 25);
	if (par.key == "in" && !par.stringerLast && !par.stringerDivision) center1.x += params.stringerThickness;
	center2 = newPoint_xy(center1, 0.0, 60.0);
	center1.hasAngle = center2.hasAngle = true;	
	if (par.key == "in" && !par.stringerLast) {
		center1.noZenk = center2.noZenk = true;
		center1.noBoltsInSide2 = center2.noBoltsInSide2 = true;
		}
	//верхняя площадка
	if(par.stringerLast && params.platformRearStringer == "нет"){
		center1.x -= 5;
		center2.x -= 5;
		center1.pos = center2.pos = "topFloor";	
	}
	pointsHoleTop.push(center1);
	pointsHoleTop.push(center2);
		
	

	//отверстия под соединительный фланец
	if (par.stringerDivision) {
		center1 = newPoint_xy(pt4, 38, 25);
		center2 = newPoint_xy(center1, 0.0, 60.0);
		center1.hasAngle = center2.hasAngle = false;
		center1.isTopFlanHole = center2.isTopFlanHole = true;
		center1.pos = "botRight";
		center2.pos = "topRight";
		par.pointsHoleTop.push(center1);
		par.pointsHoleTop.push(center2);
	}


/**  ОТВЕРСТИЯ ПОД РАМКИ  **/
	
	//первая рамка располагается вплотную к краю косоура, остальные под стыками щитов площадки
	
	//ширину рамки делаем такую же, как на марше
	var pltFrameWidth = par.marshFramesParams.width;
	var holeMoove = 0; //смещение второго отверстия из-за изменения ширины рамки
	
	//считаем параметры щитов площадки
	var pltPar = {
		len: par.tyrnLengthTop,
		//len: pltStringerLen,
	}
	if (!par.stringerLast) pltPar.len -= calcStringerMoove(par.marshId).stringerOutMooveNext;
	pltPar = calcPltPartsParams(pltPar);

	//для верхней площадки если она короткая и там один щит, делаем рамку во всю глубину площадки
	if(par.marshParams.lastMarsh){
		var pltStringerTotalLen = pt2.x - p2.x; //общая длина куска косоура под площадкой
		//если щит один
		if(pltPar.partsAmt == 1) {
			pltFrameWidth = pltStringerTotalLen;
			//не допускаем пересечения рамки с уголком каркаса
			if (params.platformRearStringer == 'есть') pltFrameWidth -= 60; 
		}
		//округляем длину рамки чтобы она была кратна 20
		var frameWidthStep = 20; //точность округления ширины рамок
		pltFrameWidth = Math.floor(pltFrameWidth / frameWidthStep) * frameWidthStep;
		
		holeMoove = pltFrameWidth - par.marshFramesParams.width; //смещение второго отверстия из-за изменения ширины рамки
	}

	// отверстия под первую рамку	
	var center1 = newPoint_xy(p2, par.stepHoleX1, par.stepHoleY);
	var center2 = newPoint_xy(p2, par.stepHoleX2 + holeMoove, par.stepHoleY);
	par.pointsHole.push(center1);
	par.pointsHole.push(center2);
	
	
	//расстояние от края первого щита площадки до начала косоура (точка p2)
	var nose1 = params.nose;
	if(params.riserType == "есть") nose1 += params.riserThickness;
	
	//рамки под стыками щитов площадки
	for (var i = 0; i < pltPar.partsAmt - 1; i++){
		//расстояние от стыка щитов площадки до угла косоура (p2)
		var dividePosX = pltPar.partLen * (i + 1) - nose1;
		
		center1 = newPoint_xy(p2, dividePosX - par.marshFramesParams.holeDist / 2, par.stepHoleY);
		//не допускаем пересечения рамок				
		if (i == 0) {
			if (center1.x - par.pointsHole[par.pointsHole.length - 1].x < par.marshFramesParams.sideHolePosX * 2 + 5) {
				center1.x = par.pointsHole[par.pointsHole.length - 1].x + par.marshFramesParams.sideHolePosX * 2 + 5
			}
		}
		else {
			if (center1.x - pointsHoleTop[pointsHoleTop.length - 1].x < par.marshFramesParams.sideHolePosX * 2 + 5) {
				center1.x = pointsHoleTop[pointsHoleTop.length - 1].x + par.marshFramesParams.sideHolePosX * 2 + 5
			}
		}
		center2 = newPoint_xy(center1, par.marshFramesParams.holeDist, 0);

		pointsHoleTop.push(center1);
		pointsHoleTop.push(center2);
	}	
	
	
	var topPltRailing = getTopPltRailing(); //функция в файле inputsReading.js
	
	//сохраняем координаты угла тетивы для самонесущего стекла
	
	//внешняя сторона Г-образная нижний марш
	
	/**
		FIX
		Тут исправил par.midUnitEnd на p1 в вычислении точки ph
	*/
	
	var ph = newPoint_xy(p1, params.M - par.stringerSideOffset, par.h);
	//внутренняя сторона Г-образная нижний марш
	if (par.key == "in" && !par.stringerLast)
		ph = newPoint_xy(p1, 85, par.h);
		
	//верхняя площадка - есть ограждение
	if (par.stringerLast && topPltRailing[par.key])
		ph = newPoint_xy(p1, params.platformLength_3 - 40 - par.stringerSideOffset - params.stringerThickness, par.h);
	//верхняя площадка - нет ограждения
	if (par.stringerLast && !topPltRailing[par.key])
		ph = newPoint_xy(p1, par.b, par.h);

	par.keyPoints[par.key].botLineP10 = copyPoint(ph);


	// отверстия для подкосов верхней площадки
	if (par.stringerLast) {
		var pt = itercection(pt3, polar(pt3, 0, 100), p2, polar(p2, Math.PI / 2, 100));
		if(params.M < 650) pt.x -= 30;
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


	//крепление к стенам
	if (par.key == "out" && par.marshParams.wallFix.out) {
		var fixPar = getFixPart(par.marshId);
		//отверстие ближе к маршу
		center1 = newPoint_xy(p2, 150, -80);
		center1.rad = fixPar.diam / 2 + 1;
		center1.hasAngle = false;
		center1.noZenk = true;
		center1.noBolts = true;
		center1.wallFix = true;
		par.pointsHole.push(center1);
		//отверстие ближе к углу
		center1 = newPoint_xy(pt2, -100 , -80);
		center1.rad = fixPar.diam / 2 + 1;
		center1.hasAngle = false;
		center1.noZenk = true;
		center1.noBolts = true;
		center1.wallFix = true;
		if (par.stringerDivision)
			par.pointsHoleTop.push(center1);
		else
			par.pointsHole.push(center1);
	}
}//end of drawTopStepKo_pltG

/**
 * последний подъем если сверху площадка (П-образная лестница)
 */
function drawTopStepKo_pltP(par){
	
	var p0 = par.pointsShape[par.pointsShape.length - 1];

	//проступь последней ступени марша
	var p1 = newPoint_xy(p0, par.b, 0);
	var p20 = newPoint_xy(p1, (par.stringerWidth / Math.sin(par.marshAng)), 0.0); // первая точка на нижней линии марша
	var p21 = polar(p20, par.marshAng, 100.0); // вторая точка на нижней линии

	/*ТОЧКИ КОНТУРА*/
	
	//проступь последней ступени марша
	var p1 = newPoint_xy(p0, par.b, 0);
	
	// подъем ступени
	var p2 = newPoint_xy(p1, 0.0, par.h);

	// проступь
	var topLineP1 = newPoint_xy(p2, par.topEndLength, 0.0);
	if(params.riserType == "есть") topLineP1.x -= params.riserThickness;

	

	//сохраняем точки контура

	p1.filletRad = p2.filletRad = topLineP1.filletRad = 0;
	par.pointsShape.push(p1);
	par.pointsShape.push(p2);	
	if (par.stringerDivision) par.pointsShape.push(topLineP1);
	
	
	//сохраняем точку для расчета длины
	par.keyPoints.topPoint = copyPoint(topLineP1);
	

	//удлинение косоура площадки
	if (par.marshId == 3)	
		var platformLen = params.platformLength_3;
	else
		var platformLen = params.platformLength_1;
	var pltStringerLen = platformLen - (par.a - par.b) - par.topEndLength - params.stringerThickness - 0.01 + params.nose;
	if (params.sideOverHang <= 75) pltStringerLen -= params.sideOverHang;	
	else pltStringerLen -= 75;

	if (!par.stringerLast) pltStringerLen -= calcStringerMoove(2).stringerOutMoove;

	var pt1 = newPoint_xy(topLineP1, params.stringerThickness, 0);
	var pt2 = newPoint_xy(pt1, pltStringerLen - params.stringerThickness, 0);
	var pt3 = newPoint_xy(pt2, 0, -par.stringerWidthPlatform);
	var pt4 = newPoint_xy(pt1, 0.0, -par.stringerWidthPlatform);

	pt1.filletRad = pt2.filletRad = pt3.filletRad = pt4.filletRad = 0; //углы косоура не скругляются
	if (par.stringerDivision) {
		par.pointsShapeTop.push(pt4);
		par.pointsShapeTop.push(pt1);
		par.pointsShapeTop.push(pt2);
		par.pointsShapeTop.push(pt3);
		
		//сохраняем длину для спецификации
		par.partsLen.push(distance(pt1, pt2))

		par.keyPoints.topPoint = copyPoint(topLineP1);
		par.keyPoints.topPointDop = copyPoint(pt2);
	}
	if (!par.stringerDivision) {
		par.pointsShape.push(pt2);
		par.pointsShape.push(pt3);
		//сохраняем точку для расчета длины
		par.keyPoints.topPoint = copyPoint(pt2);
	}
	
	

	// нижняя линия
	var botLinePoints = [];

	if (params.stringerType != "ломаная") {
		var topLineP2 = itercection(p20, p21, topLineP1, polar(topLineP1, Math.PI / 2, 100));
		if (!par.stringerDivision) {
			topLineP2 = itercection(p20, p21, pt3, polar(pt3, 0, 100));
			if (topLineP2.x > pt3.x) {
				par.pointsShape.pop(); //удаляем pt3
				topLineP2 = itercection(p20, p21, pt2, polar(pt2, Math.PI / 2, 100));
			}
		}
		botLinePoints.push(topLineP2);
	}

	if (params.stringerType == "ломаная") {
		var botLineP2 = newPoint_xy(p2, par.stringerWidth, -par.stringerWidthPlatform);
		var botLineP1 = itercection(botLineP2, polar(botLineP2, 0, 100), topLineP1, polar(topLineP1, Math.PI / 2, 100));
		botLineP1.filletRad = 0; //нижний угол тетивы не скругляется
		var botLineP3 = newPoint_xy(p1, par.stringerWidth, -par.stringerWidth);
		if (par.stringerDivision) botLinePoints.push(botLineP1);
		botLinePoints.push(botLineP2);
		botLinePoints.push(botLineP3);
	}

	par.pointsShape.push(...botLinePoints);

	
	/*ОТВЕРСТИЯ*/
	var pointsHoleTop = par.pointsHoleTop;
	var railingHolesTop = par.railingHolesTop;
	//если нет разделения косоуров
	if (!par.stringerDivision) {
		pointsHoleTop = par.pointsHole;
		railingHolesTop = par.railingHoles;
	}


	// отверстия под рамку
	var center1 = newPoint_xy(p2, par.stepHoleX1, par.stepHoleY);
	var center2 = newPoint_xy(p2, par.stepHoleX2 - 0.01, par.stepHoleY);
	par.pointsHole.push(center1);
	par.pointsHole.push(center2);
	var frameHoleDist = center2.x - center1.x //сохраняем расстояние чтобы все рамки сделать одинаковыми
	//сохраняем координаты
	var frame1Hole = copyPoint(center2)

	//передний уголок крепления к переднему поперечному косоуру площадки
	center1 = newPoint_xy(topLineP1, -30.0, -par.stringerWidthPlatform + 85.0);
	center2 = newPoint_xy(center1, 0, -60.0);
	center1.hasAngle = center2.hasAngle = true;
	center1.noBoltsInSide1 = center2.noBoltsInSide1 = true;
	par.pointsHole.push(center2);
	par.pointsHole.push(center1);

	//задний уголок крепления к переднему поперечному косоуру площадки
	center1 = newPoint_xy(pt4, 30, 25);
	center2 = newPoint_xy(center1, 0.0, 60.0);
	center1.hasAngle = center2.hasAngle = true;
	center1.rotated = center2.rotated = true;
	center1.noBoltsInSide1 = center2.noBoltsInSide1 = true;
	pointsHoleTop.push(center1);
	pointsHoleTop.push(center2);
	
	//крепление к заднему косоуру площадки
	center1 = newPoint_xy(pt3, -30, 25);
	center2 = newPoint_xy(center1, 0.0, 60.0);
	center1.hasAngle = center2.hasAngle = true;
	pointsHoleTop.push(center1);
	pointsHoleTop.push(center2);

	// отверстия крепления рамки площадки
	var pltPar = { len: platformLen + params.nose, }
	if (!par.stringerLast) pltPar.len -= calcStringerMoove(2).stringerOutMoove;
	calcPltPartsParams(pltPar);
	//var xPo = pltPar.partLen - par.topEndLength - params.stringerThickness - 96;
	//po1 = newPoint_xy(pt1, xPo, -20);
	po1 = newPoint_xy(pt1, par.stepHoleX1, -20);
	var dX = 0;
	for (var i = 0; i < pltPar.partsAmt - 1; i++){
		center1 = newPoint_xy(po1, dX, 0);
		//не допускаем пересечения рамок
		var minDist = 45 * 2 + 5 + params.stringerThickness + 15;
		if(center1.x - frame1Hole.x < minDist) center1.x = frame1Hole.x + minDist;
		center2 = newPoint_xy(center1, frameHoleDist, 0);		
		pointsHoleTop.push(center1);
		pointsHoleTop.push(center2);
		
		dX += pltPar.partLen;
	}		
	

	//Отверстия под ограждения
	if (par.hasRailing){
		if (params.railingModel != "Самонесущее стекло"){
			if (par.key == "out"){
				//стойка ближе к маршу
				center1 = newPoint_xy(p2, par.b / 2, par.stepHoleY);
				par.railingHoles.push(center1);
				
				//стойка ближе к углу площадки
				center1 = newPoint_xy(pt2, -80, par.stepHoleY);
				railingHolesTop.push(center1);				
				}
			if (par.key == "in"){
				center1 = newPoint_xy(p0, par.b / 2, par.stepHoleY);
				par.railingHoles.push(center1);
				}
			}

		if (params.railingModel == "Самонесущее стекло"){
			
			// отверстия под последнее стеко марша
			center1 = newPoint_xy(p2, par.b / 2, par.rutelPosY);
			if (par.key == "in") center1 = newPoint_xy(p0, par.b / 2, par.rutelPosY);
			center2 = newPoint_xy(center1, 0.0, -par.rutelDist);
			par.railingHoles.push(center1);
			par.railingHoles.push(center2);
			
			if (par.key != "in"){
				//отверстие ближе к маршу
				center1 = newPoint_xy(pt1, 90, par.rutelPosY);
				center2 = newPoint_xy(center1, 0.0, -60);
				railingHolesTop.push(center1);
				railingHolesTop.push(center2);
				//отверстие ближе к углу
				center1 = newPoint_xy(pt2, -90, par.rutelPosY);
				center2 = newPoint_xy(center1, 0.0, -60);
				railingHolesTop.push(center1);
				railingHolesTop.push(center2);
			}
		}
	}

	//par.keyPoints[par.key].marshTopEnd = newPoint_xy(p2, - par.b / 2, 0);

	//сохраняем координаты угла тетивы для самонесущего стекла
	par.keyPoints[par.key].botLineP10 = newPoint_xy(p2, 0, par.h);
	if (par.key == "out")
		par.keyPoints[par.key].botLineP10 =
			newPoint_xy(p2, - 40 + params.platformLength_1 - params.stringerThickness,
				par.h);

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
		center1 = newPoint_xy(pt2, -100, -100);
		center1.rad = fixPar.diam / 2 + 1;
		center1.hasAngle = false;
		center1.noZenk = true;
		center1.noBolts = true;
		center1.wallFix = true;
		pointsHoleTop.push(center1);
	}

}//end of drawTopStepKo_pltP



/**
 * последний подъем если сверху забег (внутренняя сторона)
 */
function drawTopStepKo_wndIn(par) {

	if (params.riserType == "есть") par.pointsShape[par.pointsShape.length - 1].x += 0.01;
	var p0 = par.pointsShape[par.pointsShape.length - 1]
	
	/*ТОЧКИ КОНТУРА*/
	
	//проступь последней ступени перед поворотом
	var p1 = copyPoint(p0);
	if(par.stairAmt > 0) p1 = newPoint_xy(p0, par.b, 0);
	
	// подъем ступени
	var p2 = newPoint_xy(p1, 0.0, par.h);

	// верхний горизонтальный участок
	var turnParams = calcTurnParams(1); //считаем параметры для botMarshId = 1
	var topLineLen = turnParams.topMarshOffsetX + params.sideOverHang + params.stringerThickness + 60 + 5; //60 - уголок, 5 - отступ уголка от края
	//учитываем свес
	if(!par.isWndP) topLineLen -= params.nose;
	if(par.isWndP) topLineLen -= 20;
	if(params.riserType == "есть") topLineLen -= params.riserThickness;

	var topLineP1 = newPoint_xy(p2, topLineLen, 0.0);

	// нижняя линия
	var botLinePoints = [];
	
	if (params.stringerType != "ломаная"){
		var p20 = newPoint_xy(p1, (par.stringerWidth / Math.sin(par.marshAng)), 0.0) // первая точка на нижней линии марша
		var p21 = polar(p20, par.marshAng, 100.0); // вторая точка на нижней линии
		var topLineP2 = itercection(p20, p21, topLineP1, polar(topLineP1, Math.PI / 2, 100));
		if (par.longStringerTop) topLineP2.filletRad = 0;
		botLinePoints.push(topLineP2);
		}
		
	if (params.stringerType == "ломаная"){
		var botLineP1 = { x: topLineP1.x, y: p1.y - par.stringerWidth };
		if (par.pointsShape[0].x >= botLineP1.x) {
			par.pointsShape.shift();
			botLineP1 = itercection(par.pointsShape[0], polar(par.pointsShape[0], 0, 100), topLineP1, polar(topLineP1, Math.PI / 2, 100));
		}
		botLinePoints.push(botLineP1);
		}
	
	//удлиннение косоура под забегом
	if (par.longStringerTop) {
		var parFrames = { marshId: par.marshId };
		calcFrameParams(parFrames); // рассчитываем параметры рамки
		var extraLen = params.M - params.sideOverHang * 2 - params.stringerThickness * 2 - 60 - 5 - 0.02 - calcStringerMoove(par.marshId).stringerOutMooveNext;
		var topLineP3 = newPoint_xy(topLineP1, extraLen, par.h_topWnd * 2 - parFrames.profHeight); //верхний правый угол
		var topLineP2 = newPoint_xy(topLineP3, -100, 0);
		var topLineP4 = newPoint_xy(topLineP3, 0, -120);
		}

	//сохраняем точки контура

	p1.filletRad = p2.filletRad = 0;	
	if(par.stairAmt > 0) par.pointsShape.push(p1);
	par.pointsShape.push(p2);	
	par.pointsShape.push(topLineP1);
	if(par.longStringerTop) par.pointsShape.push(topLineP2, topLineP3, topLineP4);
	par.pointsShape.push(...botLinePoints);

	//сохраняем точку для расчета длины
	par.keyPoints.topPoint = copyPoint(topLineP1);
	if(par.longStringerTop) par.keyPoints.topPoint = copyPoint(topLineP3);

	/*ОТВЕРСТИЯ*/
	//сохраняем координаты второго отверстия рамки последней прямой ступени
	var lastFrameHole2 = copyPoint(par.pointsHole[par.pointsHole.length - 1]);

	// отверстия под первую забежную рамку	
	var holePar = {
		holes: par.wndFramesHoles.botMarsh.in[1],
		basePoint: p2,
		}
	par.pointsHole.push(...calcWndHoles(holePar));
	
	// отверстия под уголки

	var center1 = newPoint_xy(topLineP1, -35, -25);
	var center2 = newPoint_xy(center1, 0, -60);
	center1.backZenk = center2.backZenk = true;
	par.pointsHole.push(center1);
	par.pointsHole.push(center2);

	var center1 = newPoint_xy(center1, 0, -105);
	var center2 = newPoint_xy(center1, 0, -60);
	center1.backZenk = center2.backZenk = true;
	par.pointsHole.push(center1);
	par.pointsHole.push(center2);
	
	//уголок на продлении тетивы
	if(par.longStringerTop){
		var center1 = newPoint_xy(topLineP3, -30 - 0.01, -25);
		var center2 = newPoint_xy(center1, 0, -60);
		center1.hasAngle = center2.hasAngle = true;
		par.pointsHole.push(center2);
		par.pointsHole.push(center1);		
		}

	//Отверстия под ограждения
	if (par.hasRailing){
		if (params.railingModel != "Самонесущее стекло"){
			
			center1 = newPoint_xy(p0, par.rutelPosX, par.stepHoleY);
			if(params.rackBottom == "боковое"){
				//удлиннение последней стойки
                var dyLastRack = calcLastRackDeltaY("wnd_ko", par.marshId); //функция в файле drawRailing;
			    center1.x += dyLastRack / Math.tan(par.marshAng);
			    //смещаем отверстие чуть назад, чтобы не было пересечения с отверстием рамки
				if(Math.abs(lastFrameHole2.x - center1.x) < 30) center1 = newPoint_x1(center1, -(30 - (lastFrameHole2.x - center1.x)), par.marshAng)

				//если на следующем марше повортная стойка, стойку не рисуем и сохраняем сдвиг отверстия до края следующего марша
				if (params.stairModel == "П-образная с забегом" || params.stairModel == "П-образная с площадкой")
					par.nextMarshPar.hasRailing.in = false;
				if (par.nextMarshPar.hasRailing.in) {
					center1.noDraw = true;
					//сохраняем сдвиг отверстия до края следующего марша (для расчета поручня и ригелей)
					center1.dxToMarshNext = -(center1.x - p0.x) + par.b - params.nose + par.turnBotParams.topMarshOffsetX - 0.1;
					if (params.riserType == "есть") center1.dxToMarshNext -= params.riserThickness;

					//отверстия для крепления поворотной стойки следущего марша
					var center2 = newPoint_xy(p0, par.b - params.nose + par.turnBotParams.topMarshOffsetX - 40 / 2, par.stepHoleY);
					if (params.riserType == "есть") center2.x -= params.riserThickness;
					center2.y -= setTurnRacksParams(par.marshId + 1, par.key).shiftBotFrame;//сдвиг кронштейна вниз чтобы не попадал на крепление рамки
					center2.noRack = true;// отверстие не учитывается при построении заграждения
					par.railingHoles.push(center2);
				}
			}
			
			//center1 = newPoint_xy(p1, -33 - 0.1, par.stepHoleY);
			
			par.railingHoles.push(center1);
			
		}

		if (params.railingModel == "Самонесущее стекло"){
			center1 = newPoint_xy(p0, par.b / 2, par.rutelPosY);
			center2 = newPoint_xy(center1, 0.0, -par.rutelDist);
			par.railingHoles.push(center1);
			par.railingHoles.push(center2);
		}
	}


	//сохраняем координаты угла тетивы для самонесущего стекла
	// par.keyPoints[par.key].botLineP10 = newPoint_xy(par.midUnitEnd, par.stringerSideOffset - 15, par.h);
	par.keyPoints[par.key].botLineP10 = newPoint_xy(topLineP1, -60 - 5 - params.stringerThickness, 0); //FIX

}//end of drawTopStepKo_wndIn

/**
 * последний подъем если сверху забег (внешняя сторона)
 */
function drawTopStepKo_wndOut(par){

	var p0 = par.pointsShape[par.pointsShape.length - 1]

	/*ТОЧКИ КОНТУРА*/
	//проступь последней ступени перед поворотом
	var p1 = copyPoint(p0);
	if(par.stairAmt > 0) p1 = newPoint_xy(p0, par.b, 0);
	
	// первая забежная ступень
	var p2 = copyPoint(p1);
	if (par.stairAmt > 0 || par.isWndP) p2 = newPoint_xy(p1, 0.0, par.h - 0.01);
	if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && params.stairAmt2 == 0 && par.botEnd == "platformG")
		p2 = newPoint_xy(p1, 0.0, par.h - 0.01);
	var p3 = newPoint_xy(p2, par.wndSteps[1].out.botMarsh, 0.0);

	// вторая забежная ступень
	var p4 = newPoint_xy(p3, 0.0, par.h_next);
	var topLineP1 = newPoint_xy(p4, par.wndSteps[2].out.botMarsh, 0.0);

	// нижняя линия
	var botLinePoints = [];
	
	var botLineP1 = newPoint_xy(topLineP1, 0.0, -215.0);
	var line = parallel(p1, p3, -par.stringerWidth);
	
	if (params.stringerType != "ломаная"){
		
		var topLineP3 = itercection(line.p1, line.p2, par.botUnitStart, polar(par.botUnitStart, par.marshAng, 100.0)); // точка пересечения верхнего участка  нижней линии марша и задней кромки
		if(par.stairAmt > 1) botLinePoints.push(topLineP3);
		}

	if (params.stringerType == "ломаная"){
		par.wndParams[par.key].turnAngle = Math.atan(2 * par.h / (params.M + 75 - 2.5 - (par.a - par.b)));
		par.wndParams[par.key].turnCutBot = 250;

		var botLineP3 = newPoint_xy(p3, par.stringerWidth, -par.stringerWidth);
		var botLineP2 = {x: botLineP3.x, y: botLineP1.y};
		var botLineP4 = newPoint_xy(p2, par.stringerWidth, -par.stringerWidth);
		var botLineP5 = newPoint_xy(p1, par.stringerWidth, -par.stringerWidth);
		//если в марше 0 ступеней не допускаем ухода точки ниже первой
		if(botLineP3.y < par.pointsShape[0].y) botLineP3.y = par.pointsShape[0].y
		
		botLinePoints.push(botLineP2, botLineP3);
		if(par.stairAmt > 1) botLinePoints.push(botLineP4, botLineP5);
		}

	//сохраняем точки контура

	p1.filletRad = p2.filletRad = p3.filletRad = p4.filletRad = topLineP1.filletRad = botLineP1.filletRad = 0; //угол тетивы не скругляется
	if(par.stairAmt > 0) par.pointsShape.push(p1);
	if (par.stairAmt > 0 || par.isWndP) par.pointsShape.push(p2);
	if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && params.stairAmt2 == 0 && par.botEnd == "platformG")
		par.pointsShape.push(p2);
	par.pointsShape.push(p3);
	par.pointsShape.push(p4);
	par.pointsShape.push(topLineP1);
	par.pointsShape.push(botLineP1);
	par.pointsShape.push(...botLinePoints);

	//сохраняем точки для отладки
	par.keyPoints[par.key].topEndCol = topLineP1;
	
	//сохраняем точку для расчета длины
	par.keyPoints.topPoint = copyPoint(topLineP1);
	
	/*ОТВЕРСТИЯ*/
	
	// отверстия под первую забежную рамку

	var holePar = {
		holes: par.wndFramesHoles.botMarsh.out[1],
		basePoint: p2,
		}
	par.pointsHole.push(...calcWndHoles(holePar));
	var centerHoleWnd1 = par.pointsHole[par.pointsHole.length - 1];//запоминаем второе отверстие рамки для расчета пересечения отверстия ограждения
	
	// отверстие под вторую забежную рамку
	var holePar = {
		holes: par.wndFramesHoles.botMarsh.out[2],
		basePoint: newPoint_xy(topLineP1, -params.stringerThickness, 0),
		}
	par.pointsHole.push(...calcWndHoles(holePar));

	// отверстия под уголки каркаса
	//верхний уголок
	var center1 = newPoint_xy(topLineP1, -38, -25);
	var center2 = newPoint_xy(center1, 0, -60);
	center1.hasAngle = center2.hasAngle = false;
	par.pointsHole.push(center1);
	par.pointsHole.push(center2);

	//нижний уголок
	var center3 = newPoint_xy(center2, 0, -45);
	var center4 = newPoint_xy(center3, 0, -60);
	center3.hasAngle = center4.hasAngle = false;
	par.pointsHole.push(center3);
	par.pointsHole.push(center4);


	//Отверстия под ограждения

	if (par.hasRailing){
		if (params.railingModel != "Самонесущее стекло"){
			// отверстия под стойку ближе к углу
			center1 = newPoint_xy(topLineP1, -80, par.stepHoleY);
			par.railingHoles.push(center1);
			
			/*
			// отверстия под стойку 1
			if (par.marshId != 1 || par.stairAmt > 1){
				center1 = newPoint_xy(p2, par.b * 0.5, par.stepHoleY);
				//если отверстия стойки и первой забежной рамки пересекаются, сдвигаем отверстие стойки
				if (Math.abs(center1.x - centerHoleWnd1.x) < 15)
					center1.x = centerHoleWnd1.x - 15;
				par.railingHoles.push(center1);
			}
			*/
			//стойка ближе к маршу
			
			//заднее ограждение забега П-образной
			if (par.stairAmt == 0 && par.botEnd == "winder") {
				var deltaX = params.M * 2 + params.marshDist - 80 * 2 - params.sideOverHang * 2;
				var deltaY = par.h * 3;
				var handrailAngle = Math.atan(deltaY / deltaX);
				center1 = newPoint_y(center1, -par.h, handrailAngle);
				//если отверстия стойки и первой забежной рамки пересекаются, сдвигаем отверстие стойки
				if (params.rackBottom !== "сверху с крышкой") {
					if (Math.abs(center1.x - centerHoleWnd1.x) < 15) {
						var mooveX = centerHoleWnd1.x - 15 - center1.x;
						center1 = newPoint_x(center1, mooveX, -handrailAngle)
					}
				}
				par.railingHoles.push(center1);
				}
			else {				
				center1 = newPoint_xy(p2, par.b * 0.5, par.stepHoleY);
				/*
				//если отверстия стойки и первой забежной рамки пересекаются, сдвигаем отверстие стойки
				if (Math.abs(center1.x - centerHoleWnd1.x) < 15)
					center1.x = centerHoleWnd1.x - 15;
				*/
				//смещаем стойку ближе к началу ступени
				if (params.rackBottom == "боковое") {
					var mooveX = center1.x - p2.x - 40; //40 - отступ отверстия от края ступени	
					center1 = newPoint_x1(center1, - mooveX, par.marshAng);
				}

				if (par.stairAmt > 1) par.railingHoles.push(center1);
				if (par.stairAmt == 1 && params.stairModel == "П-образная трехмаршевая" && par.marshId == 2) par.railingHoles.push(center1);
				}
				
			
		}

		if (params.railingModel == "Самонесущее стекло"){
			// пара рутелей ближе к маршу
			center1 = newPoint_xy(p2, par.b * 0.5, par.rutelPosY);
			center2 = newPoint_xy(center1, 0.0, -par.rutelDist);
			if(par.stairAmt == 0){
				center1 = newPoint_xy(topLineP1, -60 - params.stringerThickness - 15 - 150, par.rutelPosY);
				center2 = newPoint_xy(center1, 0.0, -par.rutelDist);
				}
			par.railingHoles.push(center1);
			par.railingHoles.push(center2);

			// пара рутелей ближе к углу
			center1 = newPoint_xy(topLineP1, -60 - params.stringerThickness - 15, par.rutelPosY);
			center2 = newPoint_xy(center1, 0.0, -par.rutelDist);
			par.railingHoles.push(center1);
			par.railingHoles.push(center2);
		}

	}

	//сохраняем координаты угла тетивы для самонесущего стекла
	par.keyPoints[par.key].botLineP10 = copyPoint(botLineP1);
	
	//точки на нижней линии марша для самонесущего стекла
	if (par.stairAmt <= 2){
		var pt = newPoint_xy(topLineP1, -50, 0);
		var pt1 = newPoint_xy(topLineP1, -100, 0);

		p10 = itercection(line.p1, line.p2, pt, polar(pt, Math.PI / 2, 100));
		p20 = itercection(line.p1, line.p2, pt1, polar(pt1, Math.PI / 2, 100));

		p10 = polar(p10, par.marshAng + Math.PI / 2, 60);
		p20 = polar(p20, par.marshAng + Math.PI / 2, 60);

		par.keyPoints[par.key].marshBotLineP1 = copyPoint(p10)
		par.keyPoints[par.key].marshBotLineP2 = copyPoint(p20)
	}

	//крепление к стенам
	if (par.marshParams.wallFix.out) {
		var fixPar = getFixPart(par.marshId);
		//отверстие ближе к углу
		center1 = newPoint_xy(topLineP1, -150, -150);
		center1.rad = fixPar.diam / 2 + 1;
		center1.hasAngle = false;
		center1.noZenk = true;
		center1.noBolts = true;
		center1.wallFix = true;
		//center1.noZenk = true;
		par.pointsHole.push(center1);
		//отверстие ближе к маршу
		center1 = newPoint_xy(p2, 150, -150);
		center1.rad = fixPar.diam / 2 + 1;
		center1.hasAngle = false;
		center1.noZenk = true;
		center1.noBolts = true;
		center1.wallFix = true;
		//center1.noZenk = true;
		par.pointsHole.push(center1);
	}


}//end of drawTopStepKo_wndOut


/**
 * тетива нижнего марша если в нем 0 ступеней (Г-образная с площадкой)
 */
function drawStringerKo_0Bot_PltG(par){
	var key = par.key;


	/*ТОЧКИ КОНТУРА*/
	
	// подъем
	var h_1 = calcFirstRise(); //подъем первой ступени	
	var p0 = newPoint_xy(par.zeroPoint, params.nose + 0.01, par.h - h_1 - params.treadThickness); //левый нижний угол
	if(params.riserType == "есть") p0.x += params.riserThickness;
	var p1 = newPoint_xy(p0, 0, h_1);

	// проступь
	var p2 = polar(p1, 0.0, params.M - par.stringerSideOffset + 5 - 0.01);
	var p3 = polar(p0, 0.0, params.M - par.stringerSideOffset + 5 - 0.01);

	p1.filletRad = p2.filletRad = 0; //верхний угол косоура не скругляется
	par.pointsShape.push(p0);
	par.pointsShape.push(p1);
	par.pointsShape.push(p2);
	par.pointsShape.push(p3);
	
/*
	// задняя линия
	if (h_1 > 160){
		var p5 = polar(p2, Math.PI * 1.5, 150);
		var p4 = newPoint_xy(p5, -65 - params.stringerThickness, 0);
		var p3 = itercection(p0, polar(p0, 0, 100), p4, polar(p4, Math.PI / 2, 100));

		p5.filletRad = 0; //угол тетивы не скругляется
		par.pointsShape.push(p5);
		par.pointsShape.push(p4);
		par.pointsShape.push(p3);
	}
	else {
		var p3 = itercection(p0, polar(p0, 0, 100), p2, polar(p2, Math.PI / 2, 100));
		p3.filletRad = 0; //угол тетивы не скругляется
		par.pointsShape.push(p3);
	}
*/

	/*ОТВЕРСТИЯ*/
	// отверстия под первую рамку
	var center1 = newPoint_xy(p1, par.stepHoleX1, par.stepHoleY);
	var center2 = newPoint_xy(p1, par.stepHoleX2, par.stepHoleY);
	par.pointsHole.push(center1);
	par.pointsHole.push(center2);

	// отверстия под вторую рамку
	center1 = newPoint_xy(p1, (params.M - par.stringerSideOffset) / 2, par.stepHoleY);
	center2 = newPoint_xy(center1, (par.stepHoleX2 - par.stepHoleX1), 0.0);
	par.pointsHole.push(center1);
	par.pointsHole.push(center2);

	// отверстия под крепежный уголок
	center1 = newPoint_xy(p2, -30.0 - params.stringerThickness, -95 - 20.0);
	center2 = newPoint_xy(center1, 0, -60);
	center1.hasAngle = center2.hasAngle = true;
	par.pointsHole.push(center2);
	par.pointsHole.push(center1);

	// отверстия под крепежный уголок для крепления верхнего марша
	if (key == "in"){
		center1 = newPoint_xy(p1, par.stringerSideOffset + 5 + params.stringerThickness + 30, -95 - 20.0);
		center2 = newPoint_xy(center1, 0, -60);
		par.pointsHole.push(center1);
		par.pointsHole.push(center2);

	}

	//Отверстия под ограждения
	if (par.hasRailing && key == "out"){
		if (params.railingModel != "Самонесущее стекло"){
			// под первую стойку
			center1 = newPoint_xy(p1, (par.stepHoleX1 + par.stepHoleX2) * 0.5, par.stepHoleY);
			par.railingHoles.push(center1);

			// под вторую стойку
			center1 = newPoint_xy(p2, -60 - 5 - 30, par.stepHoleY);
			par.railingHoles.push(center1);
		}
	}

	// отверстия под нижний крепежный уголок ближе к переднему ребру площадки
	center1 = newPoint_xy(p0, 105, 35.0);
	if (params.bottomAngleType === "регулируемая опора") center1 = newPoint_xy(p0, par.stringerSideOffset + 105, 50.0);
	if (params.stringerType == "ломаная") center1 = newPoint_xy(p0, params.b1, 50.0);
	center2 = newPoint_xy(center1, 60.0, 0.0);
	center1.hasAngle = center2.hasAngle = true;
	center1.pos = center2.pos = "botFloor";
	par.pointsHole.push(center1);
	par.pointsHole.push(center2);

	// отверстия под нижний крепежный уголок ближе к заднему ребру площадки
	center1 = newPoint_xy(p3, -(105 + 60), 35.0);
	
	if (params.bottomAngleType === "регулируемая опора"){
		center1 = newPoint_xy(center1, 0, 15);
	}

	center2 = newPoint_xy(center1, 60.0, 0.0);
	center1.hasAngle = center2.hasAngle = true;
	center1.pos = center2.pos = "botFloor";
	par.pointsHole.push(center1);
	par.pointsHole.push(center2);


	//базовые точки для стыковки с другими частями косоура
	//http://6692035.ru/dev/mayorov/metal/image/drawStringerKo_0Bot_PltG.jpg

	par.keyPoints[par.key].botLineP10 = copyPoint(p2);

}	// end of drawStringerKo_0Bot_PltG()

/**
 * тетива нижнего марша если в нижнем марше 0 ступеней
 * внутренняя
 */
function drawStringerKo_0Bot_WndGIn(par){

	/*ТОЧКИ КОНТУРА*/
	// подъем
	var h_1 = calcFirstRise(); //подъем первой ступени	
	var p0 = newPoint_xy(par.zeroPoint, params.nose, par.h - h_1 - params.treadThickness);
	if(params.riserType == "есть") p0.x += params.riserThickness;
	var p1 = newPoint_xy(p0, 0, h_1);

	// проступь
	var stingerLen = par.turnParams.topMarshOffsetX + par.stringerSideOffset - params.nose + params.stringerThickness + 60;
	if (params.riserType == "есть") stingerLen -= params.riserThickness;
	if (stingerLen < 120) stingerLen = 120;
	var p2 = newPoint_xy(p1, stingerLen, 0);

	// нижняя линия
	var botLineP1 = itercection(p0, polar(p0, Math.PI, 100.0), p2, polar(p2, Math.PI * 1.5, 100.0));

	//сохраняем точки контура
	p1.filletRad = 0; //угол тетивы не скругляется
	par.pointsShape.push(botLineP1);
	par.pointsShape.push(p0);
	par.pointsShape.push(p1);
	par.pointsShape.push(p2);
	
	//сохраняем точку для расчета длины
	par.keyPoints.botPoint = copyPoint(p0);
	par.keyPoints.topPoint = copyPoint(p2);


	/*ОТВЕРСТИЯ*/
	

	// отверстие под уголок крепления верхнего косоура	
	var htrim = h_1 - 95.0;
	if (params.bottomAngleType === "регулируемая опора") htrim -= 15.0;
	
	if (stingerLen == 120) {
		var dx = par.turnParams.topMarshOffsetX + par.stringerSideOffset - params.nose + params.stringerThickness + 30;
		if (params.riserType == "есть") dx -= params.riserThickness;
		var center1 = newPoint_xy(p1, dx, -htrim);
		center2 = newPoint_xy(center1, 0.0, -60.0);
		center1.hasAngle = center2.hasAngle = false;
		par.pointsHole.push(center1);
		par.pointsHole.push(center2);
	}
	else {
		// второе отверстие совпадает с отверстием под уголок крепления к нижнему перекрытию
		var center1 = newPoint_xy(p2, -30, -htrim);
		center1.hasAngle = false; 
		
		par.pointsHole.push(center1);
	}


	// отверстия под нижний крепежный уголок
	center1 = newPoint_xy(p2, -30, -htrim - 60);	
	//if (params.bottomAngleType === "регулируемая опора") center1 = newPoint_xy(botLineP1, -97.0, 50.0);
	center2 = newPoint_xy(center1, -60.0, 0.0);
	center1.hasAngle = center2.hasAngle = true;
	center1.pos = center2.pos = "botFloor";
	// если первое отверстие совпадает с отверстием под уголок крепления верхнего косоура
	if (stingerLen !== 120) {
		center1.noZenk = true;
		center2.noBoltsInSide2_2 = true;
	}
	par.pointsHole.push(center2);
	par.pointsHole.push(center1);

	//отверстие под рамку первой забежной ступени
	var center1 = newPoint_xy(p1, 24, -20);
	center1.hasAngle = false;
	par.pointsHole.push(center1);

	//базовые точки для стыковки с другими частями косоура
	//http://6692035.ru/dev/mayorov/metal/image/drawStringerKo_0Bot_WndGIn.jpg

}//end of drawStringerKo_0Bot_WndGIn



/**
 * первый подъем если снизу площадка средний марш трехмаршевой с 0 ступеней
 */
function drawBotStepKo_pltG_3marsh0(par) {

	
	/*ТОЧКИ КОНТУРА*/
	var pltLen = params.marshDist + params.sideOverHang - params.nose;
	if(par.key == "out") pltLen += params.M - params.sideOverHang * 2;
	
	//нижняя левая точка
	var p0 = newPoint_xy(par.zeroPoint, -pltLen, -par.stringerWidthPlatform - params.treadThickness);
	
	// задняя линия
	var p1 = newPoint_xy(p0, 0, par.stringerWidthPlatform); // высота первого подъема

	// выступ косоура под площадкой
	var p2 = newPoint_xy(p1, pltLen, 0);
	if(params.riserType == "есть") p2.x += params.riserThickness;
	
	// первая ступень марша
	var p3 = newPoint_xy(p2, 0.0, par.h);

	// нижняя линия
	var botLinePoints = [];
	if (params.stringerType != "ломаная"){
		var p20 = newPoint_xy(p2, (par.stringerWidth / Math.sin(par.marshAng)), 0.0); // первая точка на нижней линии марша
		var p21 = polar(p20, par.marshAng, 100.0); // вторая точка на нижней линии
		var p00 = newPoint_xy(p0, 100, 0); // вторая точка нижнего края косоура
		var botLineP1 = itercection(p0, p00, p20, p21);           // точка пересчечения нижнего края и нижней линии марша
		}
	//нижний горизонтальный участок
	if (params.stringerType === "ломаная"){
		var botLineP2 = newPoint_xy(p3, par.stringerWidth, - par.stringerWidth);
		var botLineP1 = itercection(p0, polar(p0, 0, 100), botLineP2, polar(botLineP2, Math.PI / 2, 100));
		var botLineP3 = newPoint_xy(botLineP2, par.b, 0);
		var botLineP4 = newPoint_xy(botLineP3, 0, par.h);
		if(par.stairAmt > 1) par.pointsShape.push(botLineP4, botLineP3);
		par.pointsShape.push(botLineP2);
		}

	//сохраняем точки контура
	if (!(par.topEnd == "platformG" && par.stairAmt === 1 && params.stringerType === "ломаная"))
		par.pointsShape.push(botLineP1);
	p0.filletRad = p1.filletRad = p2.filletRad = p3.filletRad = 0; //угол тетивы не скругляется
	par.pointsShape.push(p0);
	par.pointsShape.push(p1);
	par.pointsShape.push(p2);
	par.pointsShape.push(p3);

	//сохраняем точки для колонн
		par.keyPoints[par.key].botEnd = p0;	// для первой колонны
		par.keyPoints[par.key].botEnd2 = p2;	// для второй колонны
		
	//сохраняем точку для расчета длины
	par.keyPoints.botPoint = copyPoint(p0);
	

	//удлинение внешнего косоура площадки
	
	if (par.key == "out"){
		var pt1 = newPoint_xy(p0, -params.stringerThickness, 0);
		var pt2 = newPoint_xy(pt1, -params.M + params.sideOverHang + params.sideOverHang + params.stringerThickness * 2, 0);
		var pt3 = newPoint_xy(pt2, 0, par.stringerWidthPlatform);
		var pt4 = newPoint_xy(pt1, 0.0, par.stringerWidthPlatform);
/*
		pt1.filletRad = pt2.filletRad = pt3.filletRad = pt4.filletRad = 0; //углы косоура не скругляются
		par.pointsShapeBot.push(pt1);
		par.pointsShapeBot.push(pt2);
		par.pointsShapeBot.push(pt3);
		par.pointsShapeBot.push(pt4);
		
		//сохраняем точки для колонн
		par.keyPoints[par.key].botEnd = pt3;	// для первой колонны
		par.keyPoints[par.key].botEnd2 = pt4;	// для второй колонны
		*/
	}

	/*ОТВЕРСТИЯ*/
	//уголок каркаса на конце косоура
	center1 = newPoint_xy(p0, 30.0, 25.0);
	center2 = newPoint_xy(center1, 0.0, 60.0);
	center1.hasAngle = center2.hasAngle = true;
	if (par.key == "out") center1.hasAngle = center2.hasAngle = false;
	center1.rotated = center2.rotated = true;
	par.pointsHole.push(center1);
	par.pointsHole.push(center2);
	
	//уголки косоура площадки
	if (par.key == "out"){
		
		//уголок ближе к маршу
		center1 = newPoint_xy(p0, params.M - params.sideOverHang -38, 25);
		center2 = newPoint_xy(center1, 0.0, 60.0);
		center1.hasAngle = center2.hasAngle = false;
		par.pointsHole.push(center1);
		par.pointsHole.push(center2);

		// отверстия для уголков крепления щитов площадки

		//уголок ближе к маршу
		center1 = newPoint_xy(p2, -140, -20);
		center2 = newPoint_xy(center1, -50.0, 0);
		center1.hasAngle = center2.hasAngle = true;
		par.pointsHole.push(center2);
		par.pointsHole.push(center1);	
		
		//уголок ближе к углу
		center1 = newPoint_xy(p1, 130, -20);
		center2 = newPoint_xy(center1, 50.0, 0);
		center1.hasAngle = center2.hasAngle = true;
		par.pointsHole.push(center1);
		par.pointsHole.push(center2);
		}
	
	par.botUnitEnd = par.pointsShape[par.pointsShape.length - 1];
	par.botUnitStart = par.pointsShape[0];
	par.midUnitEnd = par.botUnitEnd;

	//сохраняем координаты нижнего левого угла тетивы для самонесущего стекла
	var ph = {x: p2.x, y: p0.y};
	par.keyPoints[par.key].botLineP0 = newPoint_xy(ph, 0, -215);//FIX
	if (par.key == "out")
		par.keyPoints[par.key].botLineP0.x -= params.M - par.stringerSideOffset;

	
}//end of drawBotStepKo_pltG_3marsh0


function calcLastRise(){
	var rise = params.h3;
	
	if(params.stairAmt3 == 0) rise = 0;
	
	if(params.stairModel == "Прямая"){
		rise = params.h1;
		}
	
}

/** функция отрисовывает верхнюю или нижнюю ломаную линию марша
*@params marshId, type: "top" || "bot", prevUnitEnd
*@returns par.points
*/

function drawMarshSteps(par){

	var marshParams = getMarshParams(par.marshId);
	par.points = [];
	
	var p1 = copyPoint(par.prevUnitEnd);
	var p2 = copyPoint(p1);
	
	var stairAmt = marshParams.stairAmt - 1;
	var filletRad = 0;

	if(par.type == "bot") {
		stairAmt -= 1;
		filletRad = 10;
	}
	
	for (var i = 0; i < stairAmt; i++){
		p1 = newPoint_xy(p2, marshParams.b, 0);
		p2 = newPoint_xy(p1, 0, marshParams.h);
		
		//вырез под ступень в вертикальной части косоура
		var hasNotch = false;
		var isStartTreadStep = false;
		if(par.isMiddleStringer) hasNotch = true;
		if(params.startTreadAmt > 0 && params.model == "лт" && par.marshId == 1) {
			if(i <= params.startTreadAmt-1) isStartTreadStep = true;
			if(i == params.startTreadAmt-1) hasNotch = true;

			}
		
		//модифицируем точки если есть вырез
		/*
		if(params.startTreadAmt > 0 && i == params.startTreadAmt-1 && params.model == "лт"){
			p2.y += params.treadThickness// + par.stringerLedge;
			p1.filletRad = 0;
			};
		*/
		if(params.model == "ко" || isStartTreadStep) p1.filletRad = p2.filletRad = filletRad;
		if(hasNotch){
			if (par.isMiddleStringer) {
				p1.x += marshParams.a - marshParams.b + 5 + 5; //5 - выступ косоура, 5 - зазор
				//if (params.stairType == "рифленая сталь") p1.x -= 10;
			} 
			if(params.stairType == "дпк") p1.x -= 10; //-10 - свес покрытия ступени над рамкой
			if(isStartTreadStep){
				if(i == params.startTreadAmt-1) {
					p2.y += params.treadThickness + 5;
					p2.x -= params.nose + 5;
					p2.filletRad = 10;					
					}
				}
			var p11 = newPoint_xy(p1, 0, params.treadThickness + 5);
			var p21 = newPoint_xy(p2, 0, -40 - 5); //40 - высота профиля рамки
			if(par.isMiddleStringer) p2.filletRad = 0;				
			}
		par.points.push(p1);
		if(hasNotch) par.points.push(p11, p21);
		par.points.push(p2);
		}
	
	return par;
} //end of drawMarshSteps

/** функция пересчитывает координаты отверстий для рамок забежных ступеней с учетом базовой точки
*@params holes, basePoint
*/

function calcWndHoles(par){
	var centers = [];
	for(var i=0; i<par.holes.length; i++){
		var pt = copyPoint(par.holes[i]);
		pt.x += par.basePoint.x;
		pt.y += par.basePoint.y;
		if(params.stairType == "лотки") pt.y += params.treadThickness
		pt.wndFrame = true;
		centers.push(pt);
		}
	
	return centers;
} //end of calcWndHoles
