function drawStringerMk(par) {

	if (!par.addOverlayFlan) {
		par.pointsShape = [];
		par.pointsHole = [];

		par.stringerShape = new THREE.Shape();
		par.stringerShapeNo = new THREE.Shape();
	}

	var stringerOffset_x = par.a - par.b;
	var stringerOffset_y = 0;
	if (params.botFloorType === "черновой" && par.botEnd == "пол") {
		stringerOffset_y = params.botFloorsDist;
	}

	//рассчитываем параметры косоура по номеру марша
	calcStringerPar(par);
	var marshParams = getMarshParams(par.marshId);

	// константы



	par.stairAngle1 = Math.atan(par.h / par.b); // вычисляем угол наклона лестницы
	par.stairAngle3 = Math.atan(par.h_topWnd / par.b); // вычисляем угол наклона лестницы

	//par.stringerWidth = 150; // ширина тетивы
	//if (par.stairAmt > 10) { // марш более 10 ступеней шириной 200мм
	//	par.stringerWidth = 200.0;
	//}

	if (params.calcType == 'curve1') {
		par.botEnd = "пол"
		par.topEnd = "пол"
		par.stairAmt -= 1
	}

	
	par.stringerBasePoint = { x: 0, y: 0, }
	//if (par.marshId != 1 && params.stairType === "короб") par.stringerBasePoint = { x: 0, y: 20, }

	//if (par.isCurve) {
	//	drawStepMk_Wnd(par);
	//}

	if (par.botEnd == "пол") {
			if (params.model == "труба")
				par.stringerBasePoint = newPoint_xy(par.stringerBasePoint,
					params.treadPlateThickness * 2,
					params.flanThickness);
			if (params.model == "сварной" || params.model == 'гнутый')
				par.stringerBasePoint = newPoint_xy(par.stringerBasePoint, 0, params.flanThickness);
		}

		//низ марша
		if (par.botEndPlatform !== "площадкаП") {
			if (par.botEnd == "пол") drawBotStepMk_floor(par);
			if (par.botEnd == "площадка") drawBotStepMk_pltG(par);
			if (par.botEnd == "забег" && params.model !== 'гнутый') drawBotStepMk_wnd(par);
			if (par.botEnd == "забег" && params.model == 'гнутый') drawBotStepMkCurve_Wnd(par);

			//средние ступени

			drawMiddleStepsMk(par.stairAmt, par);

			//верх марша


			if (par.topEnd == "пол") drawTopStepMk_floor(par);
			if (par.topEnd == "площадка") drawTopStepMk_pltG(par);
			if (par.topEnd == "забег" && params.model !== 'гнутый') drawTopStepMk_wnd(par);
			if (par.topEnd == "забег" && params.model == 'гнутый') drawTopStepMkCurve_Wnd(par);
		}

		if (par.botEndPlatform == "площадкаП") drawPlatformStepMkN_pltP(par);


		//var max = 0;
		//var min = 0;
		//for (var i = 0; i < par.pointsShape.length; i++) {
		//	if (par.pointsShape[i].x > max) max = par.pointsShape[i].x;
		//	if (par.pointsShape[i].x < min) min = par.pointsShape[i].x;
		//}
		//par.dxfBasePoint.x += max - min + 1000;

	//создаем шейп
		if (!par.addOverlayFlanEnd) {
			if (par.pointsShapeDop) {
				par.pointsShapeDop.reverse();
				for (var i = 0; i < par.pointsShapeDop.length; i++) {
					par.pointsShape.push(par.pointsShapeDop[i]);
				}
				par.pointsShapeDop = [];
			}

			var shapePar = {
				points: par.pointsShape,
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: par.dxfBasePoint,
				radIn: 0, //Радиус скругления внутренних углов
				radOut: 0, //радиус скругления внешних углов
				//markPoints: true,
			}

			//параметры для рабочего чертежа
			shapePar.drawing = {
				name: "Косоур марша",
				group: "stringers",
				//baseLine: {
				//	p1: par.keyPoints.botPoint,
				//	p2: par.keyPoints.topPoint
				//},
				//mirrow: (marshParams.side[par.key] == 'left'),
				key: par.key,
				marshId: par.marshId,
			}
			if (par.key == "in") shapePar.drawing.in = true;

			// если длина косоура больше 4 метров делаем разделение косоура
			if (distance(par.keyPoints.botPoint, par.keyPoints.topPoint) > 4000 &&
				params.model == "сварной") {
				var index = 0;
				for (var i = 0; i < par.pointsShape.length; i++) {
					if (par.botUnitEnd == par.pointsShape[i]) {
						index = i + Math.floor(par.stairAmt / 2) * 2;
						var pt1 = copyPoint(par.pointsShape[index])
						pt1.y += (par.pointsShape[index + 1].y - pt1.y) / 2 
						break;
					}
				}

				//var pt2 = itercection(pt1, polar(pt1, par.marshAngle + Math.PI / 2, 100), par.pointsShape[0], par.pointsShape[par.pointsShape.length - 1]);
				var pt2 = itercection(pt1, polar(pt1, 0, 100), par.pointsShape[0], par.pointsShape[par.pointsShape.length - 1]);

				var trashShape = new THREE.Shape();
				var layer = "comments";
				addLine(trashShape, dxfPrimitivesArr, pt1, pt2, par.dxfBasePoint, layer);

				var botPoints = par.pointsShape.slice(0, index + 1);
				botPoints.push(pt1);
				botPoints.push(pt2);
				var topPoints = par.pointsShape.slice(index + 1);
				topPoints.unshift(pt1)
				topPoints.unshift(pt2)

				var heightTopStringer = sizeShape(topPoints).dimY;

				//shapePar.drawing.isDivide = true;
				shapePar.drawing.basePointOffY = heightTopStringer;
				shapePar.points = botPoints;
				par.stringerShapeBot = drawShapeByPoints2(shapePar).shape;


				var shapePar = {
					points: par.pointsShape,
					dxfArr: dxfPrimitivesArr,
					dxfBasePoint: par.dxfBasePoint,
				}
				shapePar.drawing = {
					name: "Косоур марша",
					group: "stringers",
					key: par.key,
					marshId: par.marshId,
				}
				shapePar.drawing.isDivide = true;
				if (par.key == "in") shapePar.drawing.in = true;
				var pointStartSvg = copyPoint(par.pointsShape[1]);
				var pointCurrentSvg = copyPoint(pt2);
				shapePar.drawing.basePoint = newPoint_xy(pointCurrentSvg, -pointStartSvg.x - (pt2.x - pt1.x), -pointStartSvg.y + heightTopStringer);
				shapePar.points = topPoints;
				par.stringerShapeTop = drawShapeByPoints2(shapePar).shape;

				par.pDivideBot = pt2;
				par.pDivideTop = pt1;

			}
			else {
				par.stringerShape = drawShapeByPoints2(shapePar).shape;
			}


			//рисуем отверстия
			drawStringerHoles(par);
		}

		par.p2 = par.midUnitEnd;
		par.pstart = par.botUnitStart;
		par.p0 = par.stringerBasePoint;


		var max = 0;
		var min = 0;
		for (var i = 0; i < par.pointsShape.length; i++) {
			if (par.pointsShape[i].x > max) max = par.pointsShape[i].x;
			if (par.pointsShape[i].x < min) min = par.pointsShape[i].x;
		}
	
	par.dxfBasePoint.x += max - min + 1000;

	return par;
}


/**
 * полная тетива забега (гнутого) 
 */
function calcTurnCurvePoints(par) {
	var marshPar = getMarshParams(par.marshId);

	var points = [];

	var p0 = { x: 0, y: 0 };

	/*ТОЧКИ КОНТУРА*/

	var lengths = calcLengthsWndTreads().lengths;

	var p2 = copyPoint(p0);

	for (var i = 0; i < lengths.length; i++) {
		// подъем ступени
		if (i == 0) var p1 = newPoint_xy(p2, 0.0, marshPar.h);
		if (i !== 0) var p1 = newPoint_xy(p2, 0.0, marshPar.h_topWnd);

		// проступь
		var p2 = newPoint_xy(p1, lengths[i][par.key], 0.0);

		points.push(p1);
		points.push(p2);
	}

	par.turnPointsCurve[par.key] = calcPointsShapesWnd(points);
	par.turnPointsCurve.turnAngelCurve = calcAngleX1(points[1], points[points.length - 3]);
	return par;
}
 
function drawBotStepMkCurve_Wnd(par) {

	par.turnPointsCurve = par.turn1PointsCurve;
	if (par.marshId == 3 && ~params.stairModel.indexOf("П-образная"))
		par.turnPointsCurve = par.turn2PointsCurve;
	
	//точки полной тетивы забега
	var pointsDivide = par.turnPointsCurve[par.key];	

	//точки прямой тетивы забега для верхнего марша из полной тетивы забега
	var pointsDiv = pointsDivide.pointsTop.concat();


	/*ТОЧКИ КОНТУРА*/
	var p0 = { x: 0, y: -params.treadThickness - 8 };
	var pt0 = copyPoint(pointsDiv[pointsDiv.length - 1])

	//сдвигаем точки прямой тетивы забега так чтобы верхняя точка была за базовую({x:0, y:0}) 
	for (var i = 0; i < pointsDiv.length; i++) {
		pointsDiv[i] = newPoint_xy(pointsDiv[i], - pt0.x, -pt0.y + p0.y);
	}

	var p20 = newPoint_xy(p0, (par.stringerWidth / Math.sin(par.marshAngle)), 0.0); // первая точка на нижней линии марша
	var p21 = polar(p20, par.marshAngle, 100.0); // вторая точка на нижней линии

	if (!par.turnPointsCurve.endTurnY) {
		var bottomLineP1 = itercection(p20, p21, pointsDiv[0], polar(pointsDiv[0], Math.PI / 2, 100));

		// запоминаем расстояние по Y задней линии гнутой тетивы,
		//чтобы координата нижней точки задней линии гнутой тетивы была одинаковая на внешней и внутренней
		par.turnPointsCurve.endTurnY = pointsDiv[0].y - bottomLineP1.y;
	}

	if (par.turnPointsCurve.endTurnY)
		var bottomLineP1 = newPoint_xy(pointsDiv[0], 0, -par.turnPointsCurve.endTurnY);

	par.pointsShape.push(bottomLineP1);
	for (var i = 0; i < pointsDiv.length; i++) {
		par.pointsShape.push(pointsDiv[i]);
	}

	//базовые точки для стыковки с другими частями косоура
	par.botUnitEnd = p0;
	par.midUnitEnd = par.botUnitEnd;

	par.botUnitStart = bottomLineP1;
	
}
function drawTopStepMkCurve_Wnd(par) {

	par.turnPointsCurve = par.turn1PointsCurve;
	if (par.marshId == 2) par.turnPointsCurve = par.turn2PointsCurve;

	//точки полной тетивы забега
	var pointsDivide = par.turnPointsCurve[par.key];
	
	//запоминаем точку вставки для гнутой тетивы
	par.turnPointsCurve.pointInsertTurn = newPoint_xy(par.midUnitEnd, pointsDivide.pointsTurn[0].x + params.nose, 0)

	/*ТОЧКИ КОНТУРА*/
	var p1 = copyPoint(par.midUnitEnd);

	//точки прямой тетивы забега для нижнего марша из полной тетивы забега
	var pointsDiv = pointsDivide.pointsBot.concat();

	//сдвигаем точки прямой тетивы забега в верхнюю точку марша
	pointsDiv = moovePoints(pointsDiv, p1);

	for (var i = 0; i < pointsDiv.length; i++) {
		par.pointsShape.push(pointsDiv[i]);
	}
	var pLast = pointsDiv[pointsDiv.length - 1];
	var topLineP1 = itercectionBackLineMarsh(p1, pLast, Math.PI / 2, par)
	par.pointsShape.push(topLineP1);

	// запоминаем расстояние по Y передней линии гнутой тетивы, 
	//чтобы координата нижней точки передней линии гнутой тетивы была одинаковая на внешней и внутренней
	pointsDivide.startTurnY = par.pointsShape[par.pointsShape.length - 2].y - topLineP1.y;

}

/**
 * Нижние узлы
 */


/**
 * первый подъем если внизу перекрытие
 */
function drawBotStepMk_floor(par) {

	/*ТОЧКИ КОНТУРА*/
	var p0 = copyPoint(par.stringerBasePoint);

	// подъем
	var h_1 = par.h - (params.treadThickness + params.treadPlateThickness) - params.flanThickness; // высота первого подъема
	if (params.botFloorType === "черновой") h_1 += params.botFloorsDist;
	if (params.stairType === "короб") h_1 += 20;

	var p1 = newPoint_xy(p0, 0, h_1);

	// проступь
	var p2 = newPoint_xy(p1, par.b, 0);

	// нижний край косоура
	var bottomLineP1 = itercectionBackLineMarsh(p2, p0, 0, par);

	//при большой разнице чистового и чернового пола
	if ((bottomLineP1.x - 200) < p0.x && params.botFloorType === "черновой") {
		pt = newPoint_xy(p0, 100, 0);
		if (params.model == "сварной") pt.x += 90;
		var pt1 = itercectionBackLineMarsh(p2, pt, Math.PI / 2, par);
		if ((pt1.y - 5) > pt.y) {
			var bottomLineP1 = itercectionBackLineMarsh(p2, pt, Math.PI / 2, par);
			var bottomLineP2 = copyPoint(pt);
			par.isBotFloorsDist = true;
		}
	}

	//сохраняем точки контура
	
	par.pointsShape.push(bottomLineP1);
	if (bottomLineP2) par.pointsShape.push(bottomLineP2);
	par.pointsShape.push(p0);
	if (par.stairAmt > 1) {
		par.pointsShape.push(p1);
		par.pointsShape.push(p2);
	}

	//сохраняем точку для расчета длины
	par.keyPoints.botPoint = copyPoint(p0);

	/*ОТВЕРСТИЯ*/
	if (params.model == "труба") {
		if (par.stairAmt !== 1) {
			var center1 = newPoint_xy(p1, 20, -20);
			var center2 = newPoint_xy(center1, par.b - 85, 0);
			var center3 = newPoint_xy(p1, 20, -(h_1 - 30 - 25 + params.flanThickness));
			if (params.botFloorType === "черновой") center3.y += params.botFloorsDist - params.flanThickness;

			center1.polygon = center2.polygon = center3.polygon = true;//отверстие квадратное
			par.pointsHole.push(center1);
			par.pointsHole.push(center2);
			par.pointsHole.push(center3);
		}
	}


	//базовые точки для стыковки с другими частями косоура
	par.botUnitStart = bottomLineP1;
	par.botUnitEnd = p2;
	if (par.stairAmt <= 1) {
		par.botUnitEnd = p0;
		if (params.botFloorType == "черновой" && params.model == "сварной") {
			par.botUnitStart = newPoint_xy(p0, 200.0, 0.0);
		}
	}
	par.midUnitEnd = par.botUnitEnd;

	par.bottomDistance = distance(par.botUnitStart, p0);

} //end of drawBotStepMk_floor


/**
 * первый подъем если снизу площадка (Г-образная и трехмаршевая лестница)
 */
function drawBotStepMk_pltG(par) {

	var p0 = copyPoint(par.stringerBasePoint); //угол площадки

	//высота косоура
	var dy = params.sidePlateOverlay - 7;
	var h_1 = par.stringerWidth; // высота косоура
	if (params.model == "труба")
		h_1 = 60 + params.sidePlateOverlay - params.treadPlateThickness + dy; // высота первого подъема

	p0 = newPoint_xy(p0, -par.botEndLength, -h_1 - params.treadThickness - params.treadPlateThickness); //нижний левый угол
	if (params.model == "труба") p0.x += params.metalThickness;

	/*ТОЧКИ КОНТУРА*/
	// подъем


	var p1 = newPoint_xy(p0, 0, h_1);

	// проступь
	var p2 = newPoint_xy(p1, par.botEndLength, 0);

	// второй подъём
	var p3 = newPoint_xy(p2, 0.0, par.h);

	// проступь
	var p4 = newPoint_xy(p3, par.b, 0.0);

	// нижний край косоура
    var bottomLineP1 = itercectionBackLineMarsh(p2, p0, 0, par);
    if (params.model == "сварной") {
        if (params.stairModel == 'П-образная трехмаршевая' && par.marshId == 2 && params.stairAmt2 == 0) {
           bottomLineP1.x -= 10;
        }
    }
	par.pointsShape.push(bottomLineP1);

	//добавление площадки под фланец соединения косоуров
	if (params.model == "труба" && par.key == "in" && par.botConnection) {
		var pt = newPoint_xy(p0, params.M / 2 - params.flanThickness + par.stringerLedge, 0);
		if (params.stairModel == "П-образная с площадкой")
			pt = newPoint_xy(p0, (params.platformLength_1 + 50) / 2 + par.stringerLedge - params.flanThickness, 0);
		var pt1 = newPoint_xy(pt, (params.profileWidth + 140 + 2) / 2, 0);
		//var pt2 = newPoint_xy(pt1, 0, -(params.profileHeight - params.sidePlateOverlay));
		var pt2 = newPoint_xy(pt1, 0, -(params.profileHeight - 7) + dy);
		var pt4 = newPoint_xy(pt, -(params.profileWidth + 140 + 2) / 2, 0);
        //var pt3 = newPoint_xy(pt4, 0, -(params.profileHeight - params.sidePlateOverlay));
		var pt3 = newPoint_xy(pt4, 0, -(params.profileHeight - 7) + dy);


		par.pointsShape.push(pt1);
		par.pointsShape.push(pt2);
		par.pointsShape.push(pt3);
		par.pointsShape.push(pt4);
	}

	par.pointsShape.push(p0);
	par.pointsShape.push(p1);
	if (params.model == "труба") addPointsRecessFramePlatform(p1, "bot", par);//добавляем точки прорези для рамок площадки
	par.pointsShape.push(p2);
	if (par.stairAmt > 1) {
		par.pointsShape.push(p3);
		par.pointsShape.push(p4);
	}

	//сохраняем точку для расчета длины
	par.keyPoints.botPoint = copyPoint(p0);

	/*ОТВЕРСТИЯ*/
	if (params.model == "сварной") {
		var botConnection = par.botConnection;
		if (par.key == "out") botConnection = false;

		if (params.stairModel == "П-образная с площадкой") {
			botConnection = false;
		}

		// добавляем отверстия для крепления с другим косоуром
		if (botConnection) {
			var stringerWidth = par.stringerWidth;

			var p = newPoint_xy(p2, - params.M / 2, -stringerWidth / 2);
			if (params.stairModel == 'П-образная трехмаршевая' && par.marshId == 2 && params.stairAmt2 == 0)
				p.x -= params.marshDist + 5;
			if (params.stairModel == "П-образная с площадкой")
				p = newPoint_xy(p2, -(par.a - par.b) + (params.platformLength_1 + 50) / 2, -stringerWidth / 2);

			//var center1 = newPoint_xy(p, params.stringerThickness / 2 + 35.0, stringerWidth / 2 - 25);
			//var center2 = newPoint_xy(p, params.stringerThickness / 2 + 35.0, -stringerWidth / 2 + 25);
			//var center3 = newPoint_xy(p, -params.stringerThickness / 2 - 35.0, stringerWidth / 2 - 25);
            //var center4 = newPoint_xy(p, -params.stringerThickness / 2 - 35.0, -stringerWidth / 2 + 25);
		    var center1 = newPoint_xy(p, params.stringerThickness / 2 - 20 - params.metalThickness, params.stringerThickness / 2 - 20 - params.metalThickness - 5);
            var center2 = newPoint_xy(p, params.stringerThickness / 2 - 20 - params.metalThickness, -params.stringerThickness / 2 + 20 + params.metalThickness);
            var center3 = newPoint_xy(p, -params.stringerThickness / 2 + 20 + params.metalThickness, params.stringerThickness / 2 - 20 - params.metalThickness - 5);
            var center4 = newPoint_xy(p, -params.stringerThickness / 2 + 20 + params.metalThickness, -params.stringerThickness / 2 + 20 + params.metalThickness);

            par.pointsHole.push(center1);
			par.pointsHole.push(center2);
			par.pointsHole.push(center3);
			par.pointsHole.push(center4);

			if (params.treadLigts !== 'нет') {
				var center5 = newPoint_xy(p, 0, - 5 / 2);
				center5.rad = radTreadLigts;
				par.pointsHole.push(center5);
			}
		}
	}

	if (params.model == "труба") {
		//отверстия для подложки
		if (par.stairAmt !== 1) {
			var center1 = newPoint_xy(p3, 20, -20);
			var center2 = newPoint_xy(center1, par.b - 85, 0);
			var center3 = newPoint_xy(center1, 0, -(par.h - 65));

			center1.polygon = center2.polygon = center3.polygon = true; //отверстие квадратное
			par.pointsHole.push(center1);
			par.pointsHole.push(center2);
			par.pointsHole.push(center3);
		}

		//отверстия под фланец соединения косоуров
		if (par.key == "in" && par.botConnection) {
			var center1 = newPoint_xy(pt1, -40, -20 + h_1 + params.treadPlateThickness);
			var center2 = newPoint_xy(pt2, -40, 20);
			var center3 = newPoint_xy(pt3, 40, 20);
			var center4 = newPoint_xy(pt4, 40, -20 + h_1 + params.treadPlateThickness);

			center1.rad = center2.rad = center3.rad = center4.rad = 9;
			par.pointsHole.push(center1);
			par.pointsHole.push(center2);
			par.pointsHole.push(center3);
			par.pointsHole.push(center4);
		}
	}


	//базовые точки для стыковки с другими частями косоура
	par.botUnitStart = bottomLineP1;
	par.botUnitEnd = p4;
	if (par.stairAmt <= 1) {
		par.botUnitEnd = p2;
	}
	par.midUnitEnd = par.botUnitEnd;

	par.bottomDistance = distance(par.botUnitStart, p0);

} //end of drawBotStepMk_pltG


/**
 * первый подъем если сверху забег
 */
function drawBotStepMk_wnd(par) {

	//вычисляем длины проступей под вторую и третью забежную ступени
	if (params.model == "сварной") {
		var turnPar1 = calcTurnParams(1);//расчитуем параметры нижнего поворота
		var obj = par.turnSteps.params[3];
		var lengthB1_2 = turnPar1.turnLengthTop - params.M / 2 - params.stringerThickness / 2;

		var lengthB2 =
			(params.M / 2 - params.stringerThickness / 2) * Math.tan(obj.edgeAngle) -
			12; //длина проступи под третью забежную ступень
		var lengthB1 =
			(params.M + 45) -
			(params.M / 2 + params.stringerThickness / 2) -
			lengthB2; //длина проступи под вторую забежную ступень

		if (par.topEnd == "забег") {
			lengthB2 -= 35;
			lengthB1 -= 5;
		}
		if (params.stairModel == "Г-образная с забегом") {
			lengthB1 -= 5;
			lengthB2 += 5;
		}
		if (par.botEnd == "забег" && par.topEnd == "забег") {
			//if (params.stairModel == "П-образная с забегом")
			//	lengthB2 += params.marshDist;
			//else
			//	lengthB2 += 40;
			lengthB2 += params.marshDist;
		}

		//if (params.stairModel == "П-образная трехмаршевая") lengthB2 += 5;
		

		if (!(par.botEnd == "забег" && par.topEnd == "забег" && par.stairAmt <= 2))
			lengthB2 = lengthB1_2 - lengthB1;
		if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && params.stairAmt2 == 0)
			lengthB2 += params.marshDist - 40;
		if (par.stairAmt == 1 && par.lastMarsh) lengthB2 += params.lastWinderTreadWidth - 50;
	}
	if (params.model == "труба") {
		//Вычислем длину проступи под вторую забежную ступень
		var turnParams = par.turnSteps.params[2];

		var p0 = { x: 0, y: 0 };
		var p1 = newPoint_xy(p0, 0, turnParams.stepWidthY);
		var p2 = newPoint_xy(p1, turnParams.stepWidthX, 0);
		var p5 = newPoint_xy(p0, turnParams.treadWidthX, -turnParams.stepOffsetY);
		var p3 = newPoint_xy(p5, 0, turnParams.innerOffsetY);
		var p4 = newPoint_xy(p5, -turnParams.innerOffsetX, 0);

		var lin = parallel(p2, p3, (params.treadPlateThickness * 2));

		p2 = itercection(p1, polar(p1, 0, 100), lin.p1, lin.p2);
		p3 = itercection(p4, polar(p4, Math.PI / 2, 100), lin.p1, lin.p2);

		var pc = newPoint_xy(p0, turnParams.treadWidthX / 2, turnParams.stepWidthY - (turnParams.treadWidthY - 45) / 2);

		var pc1 = newPoint_xy(pc, 0, -params.profileWidth / 2 - params.metalThickness);
		var pt3 = itercection(p2, p3, pc1, polar(pc1, 0, 100));
		var lenIn = (pt3.x - pc1.x) - params.profileWidth / 2 - params.metalThickness - params.flanThickness;

		var pc2 = newPoint_xy(pc, 0, params.profileWidth / 2);;
		var pt2 = itercection(p2, p3, pc2, polar(pc2, 0, 100));
		var lenOut = (pt2.x - pc2.x) - params.profileWidth / 2 - params.metalThickness - params.flanThickness;

		//Вычислем длину проступи под третью забежную ступень
		var lengthB1_2 = (params.M - params.profileWidth) / 2 + 45 - params.metalThickness - params.flanThickness + params.treadPlateThickness * 2;

		var lengthB1 = lenIn + 0.6;
		var lengthB2 = lengthB1_2 - lengthB1;

		if (par.topEnd == "забег") {
			lengthB2 -= 40;
		}

		var lengthBin = lengthB1;

		if (par.key == "out") {

			var lengthB1 = lenOut + 0.6;
			var lengthB2 = lengthB1_2 - lengthB1;

			if (par.topEnd == "забег") {
				lengthB2 -= 40;
			}
		}

		if (par.botEnd == "забег" && par.topEnd == "забег") {
			if (params.stairModel == "П-образная с забегом")
				lengthB2 += params.marshDist;
			else
				lengthB2 += 40;
		}
	}

	var p0 = copyPoint(par.stringerBasePoint); //угол третьей забежной ступени

	//высота косоура
	var h_1 = 215; // высота первого подъема
	if (params.model == "труба")
		h_1 = 60 + params.sidePlateOverlay; // высота первого подъема

	p0 = newPoint_xy(p0, -(lengthB1 + lengthB2), -h_1 - params.treadThickness - params.treadPlateThickness - par.h); //нижний левый угол
	if (params.model == "труба") p0.x += params.metalThickness;

	//если последняя ступень - забежная
	if (par.stairAmt == 1 && par.lastMarsh) {
		p0.x += params.lastWinderTreadWidth - 50;
		if (params.model == "труба") lengthB2 += params.lastWinderTreadWidth - 50 - params.treadPlateThickness;
		if (params.topAnglePosition == "под ступенью") {
			lengthB2 -=params.flanThickness;
			if (params.model == "труба") lengthB2 -= params.treadPlateThickness;
		}
	}

	/*ТОЧКИ КОНТУРА*/

	// первый подъем ступени
	var p1 = newPoint_xy(p0, 0.0, h_1);

	// первая проступь
	var p2 = newPoint_xy(p1, lengthB1, 0.0);

	// второй подъем ступени
	var p3 = newPoint_xy(p2, 0.0, par.h);

	// вторая проступь
	var p4 = newPoint_xy(p3, lengthB2, 0.0);

	par.isKinkBot = false; // излома нет 
	if (params.model == "труба") {
		if (!(par.topEnd == 'забег' && par.stairAmt == 0)) {
			var ang2 = Math.atan(par.h / lengthBin);
			if (Math.abs(par.marshAngle - ang2) > 0.1) par.isKinkBot = true; // излом есть 
		}
	}

	// нижний край косоура
	if (params.model == "сварной" || !par.isKinkBot) {
		var bottomLineP1 = itercectionBackLineMarsh(p4, p0, 0, par);
		if (bottomLineP1.x < (p0.x + 30)) bottomLineP1 = newPoint_xy(p0, 50, 0.0);
	}

	if (params.model == "труба" && par.isKinkBot) {
		var p5 = newPoint_xy(p4, par.b, par.h);
		var ang2 = Math.atan(par.h / lengthBin);

		var line_p2_p4 = parallel(p2, p4, -params.sidePlateWidth);
		if (par.stairAmt == 1) {
			var p22 = newPoint_xy(p2, params.lastWinderTreadWidth - 60, 0.0);
			line_p2_p4 = parallel(p22, p4, -params.sidePlateWidth);
		}
		var line_p4_p5 = parallel(p4, p5, -params.sidePlateWidth);

		if (par.key == "out") {
			var p22 = newPoint_xy(p1, lengthBin, 0.0);
			line_p2_p4 = parallel(p22, p4, -params.sidePlateWidth);
			if (par.stairAmt == 1) {
				var p22 = newPoint_xy(p22, params.lastWinderTreadWidth - 60, 0.0);
				line_p2_p4 = parallel(p22, p4, -params.sidePlateWidth);
			}
		}

		var bottomLineP1 = itercection(p0, polar(p0, 0, 100.0), line_p2_p4.p1, line_p2_p4.p2); // точка пересчечения нижнего края и нижней линии марша
		var bottomLineP2 = itercection(line_p2_p4.p1, line_p2_p4.p2, line_p4_p5.p1, line_p4_p5.p2); // точка пересчечения нижнего края и нижней линии марша
		if (par.stairAmt > 1)
			par.pointsShape.push(bottomLineP2);
		else
			par.marshAngle = ang2;
	}

	par.pointsShape.push(bottomLineP1);
	par.pointsShape.push(p0);
	par.pointsShape.push(p1);
	par.pointsShape.push(p2);
	par.pointsShape.push(p3);
	par.pointsShape.push(p4);

	//сохраняем точку для расчета длины
	par.keyPoints.botPoint = copyPoint(p0);

	/*ОТВЕРСТИЯ*/
	if (params.model == "труба") {
		turnParams = par.turnSteps.params[1];
		if (par.topEnd == "забег" && par.stairAmt <= 2)
			turnParams = par.turnSteps.params[3];

		var dist = setDistHoleTurn("3", turnParams);

		var center1 = newPoint_xy(p3, 20, -20);
		if (par.key == "in") var center2 = newPoint_xy(p3, dist.in, -20);
		if (par.key == "out") var center2 = newPoint_xy(p3, dist.out, -20);
		var center3 = newPoint_xy(center1, 0, -(par.h - 65));

		center1.polygon = center2.polygon = center3.polygon = true; //отверстие квадратное
		par.pointsHole.push(center1);
		if (center2.x - center1.x > 25) par.pointsHole.push(center2);
		par.pointsHole.push(center3);
	}


	//базовые точки для стыковки с другими частями косоура
	par.botUnitEnd = p4;
	par.midUnitEnd = par.botUnitEnd;

	par.botUnitStart = bottomLineP1;
	if (bottomLineP2) par.botUnitStart = bottomLineP2;
	if (par.stairAmt === 1 && par.topEnd !== "забег")
		par.botUnitStart = bottomLineP1;

	if (par.key == "in") {
		par.lengthB1 = lengthB1;
		par.lengthB2 = lengthB2;
		par.ang2 = ang2;
	}

	par.bottomDistance = distance(bottomLineP1, p0);
} //end of drawBotStepMk_wnd


/**
 * средние ступени
 */
function drawMiddleStepsMk(stairAmt, par) {

	/*ТОЧКИ КОНТУРА*/
	var p2 = copyPoint(par.botUnitEnd);

	for (var i = 2; i < stairAmt; i++) {
		// подъем ступени
		var p1 = newPoint_xy(p2, 0.0, par.h);
		var p2 = newPoint_xy(p1, par.b, 0.0);

		par.pointsShape.push(p1);
		par.pointsShape.push(p2);


		/*ОТВЕРСТИЯ*/
		if (params.model == "труба") {
			var center1 = newPoint_xy(p1, 20, -20);
			var center2 = newPoint_xy(center1, par.b - 85, 0);
			var center3 = newPoint_xy(center1, 0, -(par.h - 65));

			center1.polygon = center2.polygon = center3.polygon = true;//отверстие квадратное
			par.pointsHole.push(center1);
			par.pointsHole.push(center2);
			par.pointsHole.push(center3);
		}
	}


	/*ОТВЕРСТИЯ*/

	//базовые точки для стыковки с другими частями косоура
	par.midUnitEnd = p2;
} //end of drawMiddleStepsMk


/**
 * Верхние узлы
 */

/**
 * последний подъем если сверху перекрытие
 */
function drawTopStepMk_floor(par) {

	/*ТОЧКИ КОНТУРА*/
	var p1 = copyPoint(par.midUnitEnd);

	// последняя проступь
	var topStepWidth = par.b - params.flanThickness;
	if (params.model == "труба") topStepWidth -= params.treadPlateThickness;// * 2;
	if (params.topAnglePosition == "под ступенью") {
		//topStepWidth -= params.flanThickness;
		if (params.model == "труба") topStepWidth -= params.treadPlateThickness;
	}

	if (par.stairAmt > 1 || par.botEnd == "площадка") {
		// подъем ступени
		var p2 = newPoint_xy(p1, 0.0, par.h);
		par.pointsShape.push(p2);

		// проступь
		var topLineP1 = newPoint_xy(p2, topStepWidth, 0); //правый верхний угол
	}
	else {
		var topLineP1 = copyPoint(p1);
	}

	//Задняя кромка
	var topLineP2 = itercectionBackLineMarsh(p1, topLineP1, Math.PI / 2, par);
	if (par.stairAmt == 0) topLineP2 = newPoint_xy(p1, 0, -params.stringerThickness);
	if (par.stairAmt === 1 && par.botEnd == "забег" && params.model == "труба")
		topLineP2 = itercection(topLineP1, polar(topLineP1, Math.PI / 2, 100.0),
			par.botUnitStart, polar(par.botUnitStart, par.marshAngle, 100.0));

	if (par.stairAmt !== 1 || par.botEnd == "площадка") par.pointsShape.push(topLineP1);
	par.pointsShape.push(topLineP2);

	//сохраняем точку для расчета длины
	par.keyPoints.topPoint = copyPoint(topLineP1);

	/*ОТВЕРСТИЯ*/
	if (params.model == "труба") {
		if (par.stairAmt > 1) {
			var center1 = newPoint_xy(p2, 20, -20);
			var center2 = newPoint_xy(center1, par.b - 85, 0);
			if (params.topAnglePosition == "под ступенью") center2.x -= params.flanThickness + params.treadPlateThickness*2;


			var center3 = newPoint_xy(center1, 0, -(par.h - 65));

			center1.polygon = center2.polygon = center3.polygon = true;//отверстие квадратное
			par.pointsHole.push(center1);
			par.pointsHole.push(center2);
			par.pointsHole.push(center3);
		}
	}


	par.bottomLineP2 = copyPoint(topLineP2);
	par.bottomLineP2_2 = copyPoint(topLineP1);

} //end of drawTopStepMk_floor


/**
 * последний подъем если сверху площадка (Г-образная лестница)
 */
function drawTopStepMk_pltG(par) {

	//var stringerLedge = par.stringerLedge;
	//if (par.stringerLedge1) stringerLedge = par.stringerLedge1;

	var dy = params.sidePlateOverlay - 7;
	var h_1 = par.stringerWidth; // высота задней кромки
	if (params.model == "труба")
		h_1 = 60 + params.sidePlateOverlay - params.treadPlateThickness + dy; // высота задней кромки

	/*ТОЧКИ КОНТУРА*/
	var p1 = copyPoint(par.midUnitEnd);

	// подъем ступени
	var h = par.h;// высота первого подъема
	if (par.stairAmt == 1 && par.botEnd == "пол") {
		h -= params.flanThickness + params.treadThickness + params.treadPlateThickness;
		if (params.botFloorType === "черновой") {
			h += params.botFloorsDist;
		}
	}
	var p2 = newPoint_xy(p1, 0.0, h);

	// проступь
	var topLineP1 = newPoint_xy(p2, par.topEndLength, 0.0); //правый верхний угол

	// задняя часть косоура
	var topLineP2 = newPoint_xy(topLineP1, 0.0, - h_1);

	var topLineP3 = itercectionBackLineMarsh(p1, topLineP2, 0, par);
	if (par.stairAmt == 1 && par.botEnd == "пол")
		topLineP3 = itercection(par.botUnitStart, polar(par.botUnitStart, par.marshAngle, 100), topLineP2, polar(topLineP2, 0, 100));
	if (topLineP3.x > topLineP2.x) {
		topLineP3 = itercection(par.botUnitStart, polar(par.botUnitStart, par.marshAngle, 100), topLineP2, polar(topLineP2, Math.PI / 2, 100));
	}

	par.pointsShape.push(p2);
	if (params.model == "труба" && !par.lastMarsh)
		addPointsRecessFramePlatform(p2, "top", par);//добавляем точки прорези для рамок площадки
	par.pointsShape.push(topLineP1);
	par.pointsShape.push(topLineP2);

	//добавление площадки под фланец соединения косоуров
	if (params.model == "труба" && par.key == "in" && par.topConnection) {
		var pt = itercection(topLineP2, polar(topLineP2, 0, 100.0), par.pcenter, polar(par.pcenter, Math.PI / 2, 100.0));
		var pt1 = newPoint_xy(pt, (params.profileWidth + 140 + 2) / 2, 0);
		//var pt2 = newPoint_xy(pt1, 0, -(params.profileHeight - params.sidePlateOverlay));
		var pt2 = newPoint_xy(pt1, 0, -(params.profileHeight - 7) + dy);
		var pt4 = newPoint_xy(pt, -(params.profileWidth + 140 + 2) / 2, 0);
		//var pt3 = newPoint_xy(pt4, 0, -(params.profileHeight - params.sidePlateOverlay));
		var pt3 = newPoint_xy(pt4, 0, -(params.profileHeight - 7) + dy);

		par.pointsShape.push(pt1);
		par.pointsShape.push(pt2);
		par.pointsShape.push(pt3);
		par.pointsShape.push(pt4);
	}

	par.pointsShape.push(topLineP3);

	//сохраняем точку для расчета длины
	par.keyPoints.topPoint = copyPoint(topLineP1);


	/*ОТВЕРСТИЯ*/
	if (params.model == "сварной") {
		var topConnection = par.topConnection;
		if (typeof (par.topConnection) == "undefined") topConnection = false;
		var topStringerOffset = par.topStringerOffset;
		if (typeof (par.topStringerOffset) == "undefined") topStringerOffset = 45;
		//if (typeof (par.topStringerOffset) == "undefined") topStringerOffset = 30;
		if (par.key == "out") topConnection = false;

		if (params.stairModel == "П-образная с площадкой") {
			topConnection = true;
			if (par.key == "out" && (params.carcasConfig == "001" || params.carcasConfig == "002"))
				topConnection = false;
		}

		// добавляем отверстия для крепления с другим косоуром
		if (topConnection) {
			var stringerWidth = par.stringerWidth;

			var p = newPoint_xy(p2, -(par.a - par.b) + params.M / 2 + topStringerOffset, -stringerWidth / 2);
			if (params.stairModel == "П-образная с площадкой")
				p = newPoint_xy(p2, -(par.a - par.b) + (params.platformLength_1 + 50) / 2, -stringerWidth / 2);

			//var center1 = newPoint_xy(p, params.stringerThickness / 2 + 35.0, stringerWidth / 2 - 25);
			//var center2 = newPoint_xy(p, params.stringerThickness / 2 + 35.0, -stringerWidth / 2 + 25);
			//var center3 = newPoint_xy(p, -params.stringerThickness / 2 - 35.0, stringerWidth / 2 - 25);
			//var center4 = newPoint_xy(p, -params.stringerThickness / 2 - 35.0, -stringerWidth / 2 + 25);
		    var center1 = newPoint_xy(p, params.stringerThickness / 2 - 20 - params.metalThickness, params.stringerThickness / 2 - 20 - params.metalThickness - 5);
		    var center2 = newPoint_xy(p, params.stringerThickness / 2 - 20 - params.metalThickness, -params.stringerThickness / 2 + 20 + params.metalThickness);
		    var center3 = newPoint_xy(p, -params.stringerThickness / 2 + 20 + params.metalThickness, params.stringerThickness / 2 - 20 - params.metalThickness - 5);
		    var center4 = newPoint_xy(p, -params.stringerThickness / 2 + 20 + params.metalThickness, -params.stringerThickness / 2 + 20 + params.metalThickness);
		    
		    

		    par.pointsHole.push(center1);
			par.pointsHole.push(center2);
			par.pointsHole.push(center3);
			par.pointsHole.push(center4);
			

			if (params.treadLigts !== 'нет') {
				var center5 = newPoint_xy(p, 0, - 5 / 2);
				center5.rad = radTreadLigts;
				par.pointsHole.push(center5);
			}
		}
	}

	if (params.model == "труба") {
		//отверстия для подложки
		var center1 = newPoint_xy(p2, 20, -20);
		var center2 = newPoint_xy(center1, 136 - 85, 0);
		var center3 = newPoint_xy(center1, 0, -(par.h - 65));
		if (par.stairAmt == 1 && par.botEnd == "забег") center3.y += params.treadPlateThickness + params.treadThickness;

		center1.polygon = center2.polygon = center3.polygon = true;//отверстие квадратное
		par.pointsHole.push(center1);
		par.pointsHole.push(center2);
		par.pointsHole.push(center3);

		//отверстия под фланец соединения косоуров
		if (par.key == "in" && par.topConnection) {
			var center1 = newPoint_xy(pt1, -40, -20 + h_1 + params.treadPlateThickness);
			var center2 = newPoint_xy(pt2, -40, 20);
			var center3 = newPoint_xy(pt3, 40, 20);
			var center4 = newPoint_xy(pt4, 40, -20 + h_1 + params.treadPlateThickness);

			center1.rad = center2.rad = center3.rad = center4.rad = 9;
			par.pointsHole.push(center1);
			par.pointsHole.push(center2);
			par.pointsHole.push(center3);
			par.pointsHole.push(center4);
		}
	}


	par.bottomLineP1 = copyPoint(topLineP2);
	par.bottomLineP2 = copyPoint(topLineP3);

	if (params.stairModel == "П-образная с площадкой") {
		par.bottomLineP2 = copyPoint(topLineP2);
		par.bottomLineP4 = copyPoint(topLineP3);
	}

} //end of drawTopStepMk_pltG


/**
 * последний подъем если сверху забег
 */
function drawTopStepMk_wnd(par) {
	//вычисляем длины проступей под первую и вторую забежную ступени
	if (params.model == "сварной") {
		var lengthB1 = (params.M / 2 + params.stringerThickness / 2) * Math.tan(par.turnSteps.params[1].edgeAngle) +
			par.turnSteps.params[1].stepWidthLow + 0.01;
		if (par.botEnd == "забег")
			lengthB1 -= 50;
		else if (par.botEnd == "забег")
			lengthB1 -= 35;
		else
			lengthB1 -= (par.a - par.b);


		var lengthB = params.M - lengthB1 + 45 - (par.a - par.b) - params.flanThickness;//+ par.topEndLength; //
		//if (par.botEnd == "забег") lengthB += 50;
		if (par.topConnection) lengthB += par.stringerLedge;
		if (!par.topConnection) lengthB -= params.M / 4 - params.flanThickness;

		if (params.stairModel == "П-образная трехмаршевая" && par.botEnd == "площадка" && par.stairAmt == 1) {
			//lengthB1 -= 40;
		}

	}
	if (params.model == "труба") {
		//Вычислем длину проступи под первую забежную ступень
		var turnParams = par.turnSteps.params[1];

		var p0 = { x: 0, y: 0 };
		var p1 = newPoint_xy(p0, 0, turnParams.stepWidthLow);
		var p2 = newPoint_xy(p0, params.M, 0);
		var p3 = newPoint_xy(p2, 0, turnParams.stepWidthHi);

		var lin = parallel(p1, p3, (params.treadPlateThickness * 2));

		p1 = itercection(p0, polar(p0, Math.PI / 2, 100), lin.p1, lin.p2);
		p3 = itercection(p2, polar(p2, Math.PI / 2, 100), lin.p1, lin.p2);

		var pc = newPoint_xy(p0, params.M / 2, 0);

		var pc1 = newPoint_xy(pc, -params.profileWidth / 2, 0);
		var pt3 = itercection(p1, p3, pc1, polar(pc1, Math.PI / 2, 100));
		var lenIn = (pt3.y - pc1.y) - 50 - params.treadPlateThickness * 2;

		var pc2 = newPoint_xy(pc, params.profileWidth / 2 + params.metalThickness, 0);
		var pt2 = itercection(p1, p3, pc2, polar(pc2, Math.PI / 2, 100));
		var lenOut = (pt2.y - pc2.y) - 50 - params.treadPlateThickness * 2;

		//Вычислем длину проступи под вторую забежную ступень
		var lengthB1_2 = params.M + 45 - params.flanThickness - 50 - params.treadPlateThickness + par.stringerLedge;

		var lengthB1 = lenOut + 0.5;
		if (par.key == "in")
			lengthB1 = lenIn + 0.5;

		var lengthB = lengthB1_2 - lengthB1 - params.treadPlateThickness;
	}

	var h_1 = par.h;
	if (par.stairAmt == 1 && par.botEnd == "пол") {
		h_1 -= params.flanThickness + params.treadThickness + params.treadPlateThickness;
		if (params.botFloorType === "черновой") {
			h_1 += params.botFloorsDist;
		}
	}

	/*ТОЧКИ КОНТУРА*/
	var p1 = copyPoint(par.midUnitEnd);

	// предпоследний подъем ступени
	var p2 = newPoint_xy(p1, 0.0, h_1);

	// предпоследняя проступь
	var p3 = newPoint_xy(p2, lengthB1, 0.0);

	// последний подъем ступени
	var p4 = newPoint_xy(p3, 0.0, par.h_topWnd);


	// последняя проступь
	p1 = copyPoint(p2);

	var topLineP1 = newPoint_xy(p4, lengthB, 0.0);

	// Задняя кромка
	var topLineP2 = newPoint_xy(topLineP1, 0.0, -215.0);
	//if (params.model == "труба") topLineP2 = newPoint_xy(topLineP1, 0.0, -(60 - params.treadPlateThickness + params.sidePlateOverlay));
	if (params.model == "труба") topLineP2 = newPoint_xy(topLineP1, 0.0, -(60 + params.sidePlateOverlay));

	par.pointsShape.push(p2);
	par.pointsShape.push(p3);
	par.pointsShape.push(p4);
	par.pointsShape.push(topLineP1);
	par.pointsShape.push(topLineP2);

	par.isKinkTop = false; // нужен ли излом
	if (params.model == "труба") {
		if (!(par.botEnd == 'забег' && par.stairAmt == 0)) {
			var ang2 = Math.atan(par.h / lenOut);
			if (Math.abs(par.marshAngle - ang2) > 0.09) par.isKinkTop = true; // излом есть 
		}
	}

	if (params.model == "сварной") {
		if (par.stairAmt == 0 && par.botEnd === "забег") {//для П-образной с забегом средний марш
			par.marshAngle = calcAngleX1(par.pointsShape[3], par.pointsShape[7]);
			var line_p3_p7 = parallel(par.pointsShape[3], par.pointsShape[7], -params.stringerThickness);
			par.pointsShape[0] = itercection(par.pointsShape[1], polar(par.pointsShape[1], 0, 100.0), line_p3_p7.p1, line_p3_p7.p2);
			par.botUnitStart = par.pointsShape[0];
		}
		//var line = parallel(p3, topLineP1, -par.stringerWidth);
		var line = parallel(par.midUnitEnd, topLineP1, -par.stringerWidth);

		var p20 = newPoint_xy(par.midUnitEnd, (par.stringerWidth / Math.sin(par.marshAngle)), 0.0);
		var p21 = polar(p20, par.marshAngle, 100.0);
		var topLineP3 = itercection(line.p1, line.p2, p20, p21);

		if (par.stairAmt <= 2 && par.botEnd == "пол") {
			par.pointsShape.shift();
			topLineP3 =itercection(line.p1,line.p2,par.botUnitStart,polar(par.botUnitStart, 0, 100.0)); // точка пересечения верхнего участка  нижней линии марша и задней кромки
			if (params.botFloorType === "черновой") topLineP3 = copyPoint(par.botUnitStart);
		}

        par.pointsShape.push(topLineP3);

        if (par.marshId == 2 && params.stairAmt2 == 0 && par.botEnd === "площадка") {
            par.pointsShape.pop()
            //par.pointsShape.shift()
            //var line = parallel(par.midUnitEnd, p3, -par.stringerWidth);
            //var topLineP3 = itercection(line.p1, line.p2, par.pointsShape[0], polar(par.pointsShape[0], 0, 100));
            //par.pointsShape.unshift(topLineP3);
	    }
	}
	if (params.model == "труба") {
		if (par.isKinkTop) {
			var ang2 = Math.atan(par.h / lenOut);
			var p20 = newPoint_xy(p3, (params.sidePlateWidth / Math.sin(ang2)), 0.0); // первая точка на нижней линии марша
			if (par.key == "in")
				p20 = newPoint_xy(p20, lenOut - lengthB1, 0.0);
			var p21 = polar(p20, ang2, 100.0); // вторая точка на нижней линии

			if (par.stairAmt <= 2 && par.botEnd == "пол") {
				par.pointsShape.shift();
				var pt = itercection(p20, p21, par.botUnitStart, polar(par.botUnitStart, 0, 100.0));
				par.pointsShape.unshift(pt);
			}

			var topLineP5 = itercection(p20, p21, par.botUnitStart, polar(par.botUnitStart, par.marshAngle, 100.0));
		}
		if (!par.isKinkTop) {
			var p20 = copyPoint(par.pointsShape[0]);
			var p21 = polar(p20, par.marshAngle, 100.0);
			if (par.marshId == 2 && par.stairAmt == 0) {
				var ang2 = Math.atan(par.h / lenOut);
				var sidePlateWidth = params.sidePlateWidth;
				if (params.marshDist == 40) sidePlateWidth += 20;
				var p20 = newPoint_xy(p3, (sidePlateWidth / Math.sin(ang2)), 0.0); // первая точка на нижней линии марша
				if (par.key == "in") p20 = newPoint_xy(p20, lenOut - lengthB1, 0.0);
				var p21 = polar(p20, ang2, 100.0); // вторая точка на нижней линии
				par.pointsShape.shift()
				var bottomLineP1 = itercection(p20, p21, par.pointsShape[0], polar(par.pointsShape[0], 0, 100));
				par.pointsShape.unshift(bottomLineP1);
			}
		}

		if (par.key == "out") {
			var topLineP3 = itercection(topLineP2, polar(topLineP2, Math.PI, 100.0), p20, p21);
			par.pointsShape.push(topLineP3);
		}
		if (par.key == "in") {
			var topLineP3 = newPoint_xy(topLineP2, -(params.M - params.profileWidth) / 2 + 60 + 8 - par.stringerLedge, 0.0);

			//var topLineP31 = newPoint_xy(topLineP3, 0.0, -(params.profileHeight - params.sidePlateOverlay) - 2);
			var topLineP31 = newPoint_xy(topLineP3, 0.0, -(params.profileHeight - params.sidePlateOverlay));
			var topLineP4 = itercection(topLineP31, polar(topLineP31, Math.PI, 100.0), p20, p21);

			par.pointsShape.push(topLineP3);
			par.pointsShape.push(topLineP31);
			par.pointsShape.push(topLineP4);
		}

		//if (!(par.stairAmt <= 2 && par.botEnd == "пол")) par.pointsShape.push(topLineP5);
		if (par.isKinkTop) par.pointsShape.push(topLineP5);
	}

	//сохраняем точку для расчета длины
	par.keyPoints.topPoint = copyPoint(topLineP1);

	/*ОТВЕРСТИЯ*/
	if (params.model == "сварной") {
		var topStringerOffset = par.topStringerOffset;
		if (typeof (par.topStringerOffset) == "undefined") topStringerOffset = 30;

		if (par.key == "in") {
			var lengthFlan = (215 - 5 - params.metalThickness * 2) / 2;
			// добавляем отверстия для крепления с другим косоуром
			var p = newPoint_xy(topLineP1, params.flanThickness - params.M / 2 - par.stringerLedge, -lengthFlan - 5 - params.metalThickness);
            if (!par.topConnection) p.x += params.M / 4 - params.flanThickness + par.stringerLedge;
			//var p = newPoint_xy(topLineP1, params.flanThickness - params.M / 2 - par.stringerLedge - par.topEndLength, -lengthFlan - 5 - params.metalThickness);

			var center1 = newPoint_xy(p, params.stringerThickness / 2 - 20.0 - params.metalThickness, lengthFlan - 20);
			var center2 = newPoint_xy(p, params.stringerThickness / 2 - 20.0 - params.metalThickness, -lengthFlan + 20);
			var center3 = newPoint_xy(p, -params.stringerThickness / 2 + 20.0 + params.metalThickness, lengthFlan - 20);
			var center4 = newPoint_xy(p, -params.stringerThickness / 2 + 20.0 + params.metalThickness, -lengthFlan + 20);

			par.pointsHole.push(center1);
			par.pointsHole.push(center2);
			par.pointsHole.push(center3);
			par.pointsHole.push(center4);

			if (params.treadLigts !== 'нет') {
				var center5 = newPoint_xy(p, 0, 0);
				center5.rad = radTreadLigts;
				par.pointsHole.push(center5);
			}
		}
	}

	if (params.model == "труба") {
		//Отрисовка отверстий под первую подложку
		var dist = setDistHoleTurn("1", turnParams);

		var center1 = newPoint_xy(p2, 20, -20);
		if (par.key == "in") var center2 = newPoint_xy(p2, dist.in, -20);
		if (par.key == "out") var center2 = newPoint_xy(p2, dist.out, -20);
		var center3 = newPoint_xy(center1, 0, -(par.h - 65));
		if (par.stairAmt == 1) {
			center3.y += params.treadPlateThickness + params.treadThickness + params.flanThickness;
			if (par.botEnd == "пол" && params.botFloorType === "черновой")
				center3.y -= params.botFloorsDist;
		}

		center1.polygon = center2.polygon = center3.polygon = true; //отверстие квадратное
		par.pointsHole.push(center1);
		if (center2.x - center1.x > 25) par.pointsHole.push(center2);
		par.pointsHole.push(center3);

		//Отрисовка отверстий под вторую подложку
		var center1 = newPoint_xy(p4, 20, -20);
		var center3 = newPoint_xy(center1, 0, -(par.h_topWnd - 65));
		//if (par.stairAmt == 1) center3.y += params.treadPlateThickness + params.treadThickness;

		center1.polygon = center3.polygon = true; //отверстие квадратное
		par.pointsHole.push(center1);
		par.pointsHole.push(center3);

		if (par.key == "out") {
			turnParams = par.turnSteps.params[2];
			var dist = setDistHoleTurn("2", turnParams);
			var center2 = newPoint_xy(p4, dist.out, -20);
			center2.polygon = true; //отверстие квадратное
			par.pointsHole.push(center2);
		}

		if (par.key == "in") {
			//Отрисовка отверстий под фланец
			var pt = newPoint_xy(topLineP1, -params.M / 2 + params.flanThickness - par.stringerLedge, 0);
			var center1 = newPoint_xy(pt, -(params.profileWidth / 2 + 30 + 1), -20);
			var center2 = newPoint_xy(pt, (params.profileWidth / 2 + 30 + 1), -20);
			var center3 = newPoint_xy(center1, 0, -(params.profileHeight + 20));
			var center4 = newPoint_xy(center2, 0, -(params.profileHeight + 20));
			//if (par.stairAmt == 1) {
			//	center3.y += 20;
			//	center4.y += 20;
			//}

			//сдвигаем 3 отверстие чтобы болт не пересекался с трубой
			if (par.isKinkTop) {
				var ang2 = calcAngleX1(par.pointsShape[par.pointsShape.length - 1], par.pointsShape[par.pointsShape.length - 2]);
				var line = parallel(par.pointsShape[par.pointsShape.length - 1], polar(par.pointsShape[par.pointsShape.length - 1], ang2, 100), -(params.sidePlateWidth - params.sidePlateOverlay));
				var pt = itercection(center3, polar(center3, Math.PI / 2, 100), line.p1, line.p2);
			}
			if (!par.isKinkTop) {
				var ang2 = calcAngleX1(par.pointsShape[0], par.pointsShape[par.pointsShape.length - 1]);
				var line = parallel(par.pointsShape[0], par.pointsShape[par.pointsShape.length - 1], (params.sidePlateWidth - params.sidePlateOverlay));
				var pt = itercection(center3, polar(center3, Math.PI / 2, 100), line.p1, line.p2);
			}
            
			//var line = parallel(par.midUnitEnd, polar(par.midUnitEnd, ang2, 100), params.sidePlateOverlay - params.sidePlateWidth);
			//var pt = itercection(center3, polar(center3, Math.PI / 2 - ang2, 100), line.p1, line.p2);
			
			if ((center3.y - 30) < pt.y) {
				var offsetTopWndHoleY3 = pt.y - (center3.y - 30);
				if (!par.offsetTopWndHoleY3) par.offsetTopWndHoleY3 = offsetTopWndHoleY3;
				else par.offsetTopWndHoleY3Turn2 = offsetTopWndHoleY3;
				center3.y += offsetTopWndHoleY3;
			}


			center1.rad = center2.rad = center3.rad = center4.rad = 9;
			par.pointsHole.push(center1);
			par.pointsHole.push(center2);
			par.pointsHole.push(center3);
			par.pointsHole.push(center4);
		}
	}


	par.lengthB = lengthB;
	par.lengthB3 = lengthB1;//сохраняем длину предпоследней проступи для позиционирования пластин
	par.bottomLineP4 = topLineP3;
	par.bottomLineP2 = topLineP2;

	if (par.key == "out") {
		par.lengthBturn1_2 = lengthB + lengthB1; // длина проступи первой забежной ступени + длина второй проступи  забежной ступени (для расчета профильной трубы)
		par.lengthBturn1 = lengthB1; // длина проступи первой забежной ступени + длина второй проступи  забежной ступени (для расчета профильной трубы)
		par.ang2 = ang2; // длина проступи первой забежной ступени + длина второй проступи  забежной ступени (для расчета профильной трубы)
	}

} //end of drawTopStepMk_wnd


/**
 * Дополнительный кусок косоура
 */
function drawStringerMk_extension(par) {
	par.pointsShape = [];
	par.stringerShape = new THREE.Shape();
	var p0 = { x: 0, y: 0 };
	var p1 = newPoint_xy(p0, 0, par.stringerWidth);
	var p2 = newPoint_xy(p1, par.botEndLength, 0);
	var p3 = newPoint_xy(p2, 0, -par.stringerWidth);

	par.pointsShape.push(p0);
	par.pointsShape.push(p1);
	par.pointsShape.push(p2);
	par.pointsShape.push(p3);

	var shapePar = {
		points: par.pointsShape,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		radIn: 0, //Радиус скругления внутренних углов
		radOut: 0, //радиус скругления внешних углов
		markPoints: true,
	}

	par.stringerShape = drawShapeByPoints2(shapePar).shape;

	par.dxfBasePoint.x += par.botEndLength + par.dxfBasePointGap;
	return par;
}//end of drawStringerMk_extension


/**
 * Накладка
 * площадки (П-образная лестница)
 */
function drawPlatformStepMkN_pltP(par) {

	var h_1 = 60 + params.sidePlateOverlay - params.treadPlateThickness; // высота накладки площадки
	var h_frame = 60 - params.treadPlateThickness;

	var p0 = { x: 0, y: 0 };

	if (par.addOverlayFlan) {
		var pt1 = par.pointsShape.pop();
		par.pointsShape.pop();
		var pt2 = newPoint_xy(pt1, 0, -(par.profileHeight - params.sidePlateOverlay));
		var pt3 = newPoint_xy(pt2, par.profileWidth + 140, 0);
		var pt4 = newPoint_xy(pt3, 0, (par.profileHeight - params.sidePlateOverlay));
		var p1 = newPoint_xy(pt4, 0, h_1);
		if (!par.pointsShapeDop) par.pointsShapeDop = [];
		par.pointsShapeDop.push(pt1);
		par.pointsShapeDop.push(pt2);
		par.pointsShapeDop.push(pt3);
		par.pointsShapeDop.push(pt4);

		/*ОТВЕРСТИЯ*/
		var center1 = newPoint_xy(pt4, -40, -20 + h_1 + params.treadPlateThickness);
		var center2 = newPoint_xy(pt3, -40, 20);
		var center3 = newPoint_xy(pt2, 40, 20);
		var center4 = newPoint_xy(pt1, 40, -20 + h_1 + params.treadPlateThickness);

		center1.rad = center2.rad = center3.rad = center4.rad = 9;
		par.pointsHole.push(center1);
		par.pointsHole.push(center2);
		par.pointsHole.push(center3);
		par.pointsHole.push(center4);
	} else {
		var p1 = newPoint_xy(p0, 0, h_1);
		par.pointsShape.push(p0);
		par.pointsShape.push(p1);
	}


	if (par.framePlatformLengthN.l1) {
		var p2 = newPoint_xy(p1, par.framePlatformLengthN.l1, 0);
		var p5 = newPoint_xy(p2, 0, -h_1);
		par.pointsShape.push(p2);

		if (par.framePlatformLengthN.l2) {
			var p3 = newPoint_xy(p2, 0, -h_frame);
			var p4 = newPoint_xy(p3, 34, 0);
			var p5 = newPoint_xy(p4, 0, h_frame);
			par.pointsShape.push(p3);
			par.pointsShape.push(p4);
			par.pointsShape.push(p5);
		} else {
			par.pointsShape.push(p5);
		}
	}

	if (par.framePlatformLengthN.l2) {
		p1 = copyPoint(p5);
		if (par.addOverlayFlan) {
			var pt1 = newPoint_xy(p1, -par.profileWidth - 140, 0);
		}
		p2 = newPoint_xy(p1, par.framePlatformLengthN.l2, 0);
		p5 = newPoint_xy(p2, 0, -h_1);
		par.pointsShape.push(p2);

		if (par.framePlatformLengthN.l3) {
			p3 = newPoint_xy(p2, 0, -h_frame);
			p4 = newPoint_xy(p3, 34, 0);
			p5 = newPoint_xy(p4, 0, h_frame);
			par.pointsShape.push(p3);
			par.pointsShape.push(p4);
			par.pointsShape.push(p5);
		} else {
			par.pointsShape.push(p5);
		}
	}

	if (par.framePlatformLengthN.l3) {
		p1 = copyPoint(p5);
		p2 = newPoint_xy(p1, par.framePlatformLengthN.l3, 0);
		p5 = newPoint_xy(p2, 0, -h_1);
		par.pointsShape.push(p2);

		if (par.framePlatformLengthN.l4) {
			p3 = newPoint_xy(p2, 0, -h_frame);
			p4 = newPoint_xy(p3, 34, 0);
			p5 = newPoint_xy(p4, 0, h_frame);
			par.pointsShape.push(p3);
			par.pointsShape.push(p4);
			par.pointsShape.push(p5);
		} else {
			par.pointsShape.push(p5);
		}
	}

	if (par.framePlatformLengthN.l4) {
		p1 = copyPoint(p5);
		p2 = newPoint_xy(p1, par.framePlatformLengthN.l4, 0);
		p5 = newPoint_xy(p2, 0, -h_1);
		par.pointsShape.push(p2);

		if (par.framePlatformLengthN.l5) {
			p3 = newPoint_xy(p2, 0, -h_frame);
			p4 = newPoint_xy(p3, 34, 0);
			p5 = newPoint_xy(p4, 0, h_frame);
			par.pointsShape.push(p3);
			par.pointsShape.push(p4);
			par.pointsShape.push(p5);
		} else {
			par.pointsShape.push(p5);
		}
	}

	if (par.framePlatformLengthN.l5) {
		p1 = copyPoint(p5);
		p2 = newPoint_xy(p1, par.framePlatformLengthN.l5, 0);
		p5 = newPoint_xy(p2, 0, -h_1);
		par.pointsShape.push(p2);

		if (par.framePlatformLengthN.l6) {
			p3 = newPoint_xy(p2, 0, -h_frame);
			p4 = newPoint_xy(p3, 34, 0);
			p5 = newPoint_xy(p4, 0, h_frame);
			par.pointsShape.push(p3);
			par.pointsShape.push(p4);
			par.pointsShape.push(p5);
		} else {
			par.pointsShape.push(p5);
		}
	}


	par.topEndLength = p5.x;
	par.dxfBasePoint.x += p5.x + par.dxfBasePointGap;
	return par;

} //end of drawPlatformStepMkN_pltP

/**
 * профильная труба
 */
function drawProfPipe(par) {

	var dyColumnlen = 0;
	var dyColumnMiddlelen = 0;

	var stringerOffset_y = 0;
	if (params.botFloorType === "черновой" && par.botEnd == "пол") {
		stringerOffset_y = params.botFloorsDist;
	}

	par.pointsShape = [];
	par.stringerShape = new THREE.Shape();

	par.stairAngle1 = Math.atan(par.h / par.b); // вычисляем угол наклона лестницы
	if (par.stairAmt == 1 && par.botEnd == "пол" && par.topEnd == "забег")
		par.stairAngle1 = par.ang2;

	if (par.botEnd == "площадка" || par.botEnd == "площадкаП") {
		var p0 = { x: 0, y: 0, };

		if (par.botConnection)
			p0.x += 3;
		var p1 = newPoint_xy(p0, par.botEndLength + params.flanThickness, params.profileHeight + 58);
		var p11 = newPoint_xy(p1, (params.sidePlateWidth - params.sidePlateOverlay) / Math.sin(par.stairAngle1), 0);
		var p2 = newPoint_xy(p0, 0, params.profileHeight);
		var p3 = itercection(p2, polar(p2, 0, 100.0), p11, polar(p11, par.stairAngle1, 100.0));
		var p41 = newPoint_xy(p3, params.profileHeight / Math.sin(par.stairAngle1), 0);
		var p4 = itercection(p0, polar(p0, 0, 100.0), p41, polar(p41, par.stairAngle1, 100.0));
		var p5 = newPoint_xy(p0, par.b * par.stairAmt - params.treadPlateThickness + params.flanThickness * 2 + par.botEndLength - 3, 0);
		if (par.botConnection)
			p5.x -= 3;
		var p55 = newPoint_xy(p5, 0, par.h * par.stairAmt + params.profileHeight + 60);

		var p6 = itercection(p5, polar(p5, Math.PI / 2, 100.0), p3, polar(p3, par.stairAngle1, 100.0));

		par.pointsShape.push(p4);
		par.pointsShape.push(p0);
		par.pointsShape.push(p2);
		par.pointsShape.push(p3);


		//Вычисляем длину средней опоры
		var pm3 = newPoint_xy(p1, par.b * Math.round((par.stairAmt) / 2) - 4, 0);
		var pm4 = itercection(pm3, polar(pm3, Math.PI / 2, 100.0), p4, polar(p4, par.stairAngle1, 100.0));

		dyColumnMiddlelen = pm4.y - p1.y;

		if (par.stairAmt > 7) {
			var sh = new THREE.Shape();
			var psm1 = polar(pm4, par.stairAngle1, 30 + 50 / Math.cos(par.stairAngle1));
			var psm2 = polar(pm4, par.stairAngle1, -(30 + 50 / Math.cos(par.stairAngle1)));
			var ang = par.stairAngle1 + Math.PI / 2;

			addLine(sh, dxfPrimitivesArr, polar(psm1, ang, -20), polar(psm1, ang, params.profileHeight + 20), par.dxfBasePoint);
			addLine(sh, dxfPrimitivesArr, polar(psm2, ang, -20), polar(psm2, ang, params.profileHeight + 20), par.dxfBasePoint);
		}

		if (par.botConnection) {
			if (par.isColumn1) {
				var sh = new THREE.Shape();
				var pt2 = newPoint_xy(p0, params.flanThickness + 100 - 3, 0);
				var psm1 = polar(pt2, 0, 30 + 50);
				var psm2 = polar(pt2, 0, -(30 + 50));
				var ang = Math.PI / 2;

				addLine(sh, dxfPrimitivesArr, polar(psm1, ang, -20), polar(psm1, ang, params.profileHeight + 20), par.dxfBasePoint);
				addLine(sh, dxfPrimitivesArr, polar(psm2, ang, -20), polar(psm2, ang, params.profileHeight + 20), par.dxfBasePoint);
			}
			if (par.isColumn2) {
				var sh = new THREE.Shape();
				var pt2 = newPoint_xy(p0, params.M / 2 - 3, 0);
				var psm1 = polar(pt2, 0, 30 + 50);
				var psm2 = polar(pt2, 0, -(30 + 50));
				var ang = Math.PI / 2;

				addLine(sh, dxfPrimitivesArr, polar(psm1, ang, -20), polar(psm1, ang, params.profileHeight + 20), par.dxfBasePoint);
				addLine(sh, dxfPrimitivesArr, polar(psm2, ang, -20), polar(psm2, ang, params.profileHeight + 20), par.dxfBasePoint);
			}
		}
	}
	if (par.botEnd == "забег") {
		var p0 = { x: 0, y: 0, };

		var p2 = newPoint_xy(p0, 0, params.profileHeight);

		var ps1 = newPoint_xy(p0, par.lengthB1 + params.flanThickness, params.profileHeight + 60);
		var ps2 = newPoint_xy(ps1, par.lengthB2, par.h);
		var ps3 = newPoint_xy(ps2, par.b, par.h);
		var line_pt3_p3 = parallel(ps1, ps2, -(params.sidePlateWidth - params.sidePlateOverlay));
		var line_p3_p6 = parallel(ps2, ps3, -(params.sidePlateWidth - params.sidePlateOverlay));

		var pt3 = itercection(p2, polar(p2, 0, 100.0), line_pt3_p3.p1, line_pt3_p3.p2);
		var p3 = itercection(line_pt3_p3.p1, line_pt3_p3.p2, line_p3_p6.p1, line_p3_p6.p2);

		var p5 = newPoint_xy(p0, par.b * (par.stairAmt - 1) + params.flanThickness * 2 + par.lengthB1 + par.lengthB2 - 3, 0);
		var p55 = newPoint_xy(p5, 0, par.h * (par.stairAmt) + params.profileHeight + 60);

		var p6 = itercection(p5, polar(p5, Math.PI / 2, 100.0), line_p3_p6.p1, line_p3_p6.p2);

		var line_pt4_p4 = parallel(p3, pt3, -(params.profileHeight));
		var line_p4_p7 = parallel(p3, p6, -(params.profileHeight));
		var pt4 = itercection(p0, polar(p0, 0, 100.0), line_pt4_p4.p1, line_pt4_p4.p2);
		var p4 = itercection(line_pt4_p4.p1, line_pt4_p4.p2, line_p4_p7.p1, line_p4_p7.p2);

		p0.x += 4;
		p2.x += 4;

		if (par.stairAmt === 1) {
			var p3 = itercection(p5, polar(p5, Math.PI / 2, 100.0), line_pt3_p3.p1, line_pt3_p3.p2);
			var p4 = itercection(p5, polar(p5, Math.PI / 2, 100.0), line_pt4_p4.p1, line_pt4_p4.p2);

			par.topEnd = "floor1";

			var p6 = copyPoint(p3);
			var p7 = copyPoint(p4);
		}

		par.pointsShape.push(p4);
		par.pointsShape.push(pt4);
		par.pointsShape.push(p0);
		par.pointsShape.push(p2);
		par.pointsShape.push(pt3);
		par.pointsShape.push(p3);

		//Вычисляем длину средней опоры
		var pm3 = newPoint_xy(ps2, par.b * Math.round((par.stairAmt + 1) / 2) - 4, 0);
		var pm4 = itercection(pm3, polar(pm3, Math.PI / 2, 100.0), p4, polar(p4, par.stairAngle1, 100.0));

		dyColumnMiddlelen = pm4.y - ps1.y;

		if (par.stairAmt > 7) {
			var sh = new THREE.Shape();
			var psm1 = polar(pm4, par.stairAngle1, 30 + 50 / Math.cos(par.stairAngle1));
			var psm2 = polar(pm4, par.stairAngle1, -(30 + 50 / Math.cos(par.stairAngle1)));
			var ang = par.stairAngle1 + Math.PI / 2;

			addLine(sh, dxfPrimitivesArr, polar(psm1, ang, -20), polar(psm1, ang, params.profileHeight + 20), par.dxfBasePoint);
			addLine(sh, dxfPrimitivesArr, polar(psm2, ang, -20), polar(psm2, ang, params.profileHeight + 20), par.dxfBasePoint);
		}
	}
	if (par.botEnd == "пол") {
		var p0 = { x: params.treadPlateThickness * 0, y: -stringerOffset_y };
		var p1 = newPoint_xy(p0, par.bottomDistance, params.flanThickness);
		var p2 = newPoint_xy(p1, -params.sidePlateOverlay / Math.sin(par.stairAngle1), 0);
		var p3 = newPoint_xy(p2, -(params.flanThickness - 3) / Math.tan(par.stairAngle1), -params.flanThickness + 3);
		var p4 = newPoint_xy(p3, params.profileHeight / Math.sin(par.stairAngle1), 0);
		var p5 = newPoint_xy(p0, par.b * par.stairAmt - params.treadPlateThickness + params.flanThickness - 3, 0);
		var p55 = newPoint_xy(p5, 0, par.h * par.stairAmt - (params.treadThickness + params.treadPlateThickness) + params.flanThickness + stringerOffset_y);
		var p6 = itercection(p5, polar(p5, Math.PI / 2, 100.0), p3, polar(p3, par.stairAngle1, 100.0));

		par.pointsShape.push(p4);
		par.pointsShape.push(p3);

		//Вычисляем длину средней опоры
		var pm3 = newPoint_xy(p0, par.b * Math.round((par.stairAmt) / 2) - 4, 0);
		var pm4 = itercection(pm3, polar(pm3, Math.PI / 2, 100.0), p4, polar(p4, par.stairAngle1, 100.0));

		dyColumnMiddlelen = pm4.y;

		if (par.stairAmt > 7) {
			var sh = new THREE.Shape();
			var psm1 = polar(pm4, par.stairAngle1, 30 + 50 / Math.cos(par.stairAngle1));
			var psm2 = polar(pm4, par.stairAngle1, -(30 + 50 / Math.cos(par.stairAngle1)));
			var ang = par.stairAngle1 + Math.PI / 2;

			addLine(sh, dxfPrimitivesArr, polar(psm1, ang, -20), polar(psm1, ang, params.profileHeight + 20), par.dxfBasePoint);
			addLine(sh, dxfPrimitivesArr, polar(psm2, ang, -20), polar(psm2, ang, params.profileHeight + 20), par.dxfBasePoint);
		}
	}

	//------------------------------------------------------------------------------------------------------------------
	if (par.topEnd == "площадка" || par.topEnd == "площадкаП") {
		var p51 = newPoint_xy(p0, par.b * (par.stairAmt - 1) - params.treadPlateThickness * 2 + params.flanThickness + par.topEndLength - 3, 0);
		if (par.botConnection)
			p51.x -= 3;
		if (par.botEnd == "площадка" || par.botEnd == "площадкаП")
			p51.x += par.botEndLength;

		if (par.botEnd == "забег") {
			p51.x += par.lengthB1 + par.lengthB2 - par.b;
		}
		var p61 = newPoint_xy(p51, 0, par.h * par.stairAmt - (params.treadThickness + params.treadPlateThickness) - 60 + stringerOffset_y);
		if (par.botEnd == "площадка")
			p61 = newPoint_xy(p51, 0, par.h * par.stairAmt + params.profileHeight + stringerOffset_y);
		//p61.y += par.h + 20;
		if (par.botEnd == "забег") {
			p61.y += par.h_topWnd + 2;
		}
		var p6 = itercection(p3, polar(p3, par.stairAngle1, 100.0), p61, polar(p61, Math.PI, 100.0));
		var p71 = newPoint_xy(p61, 0, -params.profileHeight);
		var p7 = itercection(p71, polar(p71, Math.PI, 100.0), p4, polar(p4, par.stairAngle1, 100.0));

		par.pointsShape.push(p6);
		par.pointsShape.push(p61);
		par.pointsShape.push(p71);
		par.pointsShape.push(p7);

		if (par.topConnection) {
			if (par.isColumn1) {
				var sh = new THREE.Shape();
				var pt2 = newPoint_xy(p71, -params.flanThickness - 100 + 3, 0);
				var psm1 = polar(pt2, 0, 30 + 50);
				var psm2 = polar(pt2, 0, -(30 + 50));
				var ang = Math.PI / 2;

				addLine(sh,
					dxfPrimitivesArr,
					polar(psm1, ang, -20),
					polar(psm1, ang, params.profileHeight + 20),
					par.dxfBasePoint);
				addLine(sh,
					dxfPrimitivesArr,
					polar(psm2, ang, -20),
					polar(psm2, ang, params.profileHeight + 20),
					par.dxfBasePoint);
			}
			if (par.isColumn2) {
				var sh = new THREE.Shape();
				var pt2 = newPoint_xy(p71, -params.M / 2 + 3, 0);
				if (params.stairModel == "П-образная с площадкой")
					pt2 = newPoint_xy(p71, -par.platformLength_1 / 2 + 3, 0);
				var psm1 = polar(pt2, 0, 30 + 50);
				var psm2 = polar(pt2, 0, -(30 + 50));
				var ang = Math.PI / 2;

				addLine(sh,
					dxfPrimitivesArr,
					polar(psm1, ang, -20),
					polar(psm1, ang, params.profileHeight + 20),
					par.dxfBasePoint);
				addLine(sh,
					dxfPrimitivesArr,
					polar(psm2, ang, -20),
					polar(psm2, ang, params.profileHeight + 20),
					par.dxfBasePoint);
			}
		}
	}
	if (par.topEnd == "забег") {
		var ang = par.stairAngle1;

		if (par.botEnd == "забег") {
			var p51 = newPoint_xy(p0, par.lengthB1 + par.lengthB2 + params.flanThickness * 2 + par.lengthBturn1_2 - 3, 0);
			var p61 = newPoint_xy(p51, 0, par.h * 3 + params.profileHeight);


			if (params.stairModel == "П-образная трехмаршевая") {

				p61 = newPoint_xy(p51,
					par.b * (par.stairAmt - 2),
					par.h * par.stairAmt + par.h_topWnd + params.profileHeight);
				var p71 = newPoint_xy(p61, 0, -params.profileHeight);

				var ps31 = newPoint_xy(p0,
					par.lengthB1 +
					par.lengthB2 +
					params.flanThickness +
					par.b * (par.stairAmt - 2),
					0);
				var ps31 = newPoint_xy(ps31, 0, params.profileHeight + 60 + par.h * (par.stairAmt - 1));
				var ps6 = newPoint_xy(ps31, par.lengthBturn1, par.h);

				var line_p3_p31 = parallel(ps2,
					ps31,
					-(params.sidePlateWidth - params.sidePlateOverlay));
				var line_p31_p6 = parallel(ps31,
					ps6,
					-(params.sidePlateWidth - params.sidePlateOverlay));

				var p31 = itercection(line_p3_p31.p1, line_p3_p31.p2, line_p31_p6.p1, line_p31_p6.p2);
				var p6 = itercection(p61, polar(p61, Math.PI, 100.0), line_p31_p6.p1, line_p31_p6.p2);

				var line_p4_p41 = parallel(p3, p31, -params.profileHeight);
				var line_p41_p7 = parallel(p31, p6, -params.profileHeight);

				var p41 = itercection(line_p4_p41.p1, line_p4_p41.p2, line_p41_p7.p1, line_p41_p7.p2);
				var p7 = itercection(p71, polar(p71, Math.PI, 100.0), line_p41_p7.p1, line_p41_p7.p2);

				par.pointsShape.push(p31);
				par.pointsShape.push(p6);
				par.pointsShape.push(p61);
				par.pointsShape.push(p71);
				par.pointsShape.push(p7);
				par.pointsShape.push(p41);
			} else {
				ang = Math.atan(par.h / (par.lengthBturn1));

				var p6 = itercection(p3, polar(p3, ang, 100.0), p61, polar(p61, Math.PI, 100.0));
				var p71 = newPoint_xy(p61, 0, -params.profileHeight);
				var line_p41_p7 = parallel(p3, p6, -params.profileHeight);
				var p7 = itercection(p71, polar(p71, Math.PI, 100.0), line_p41_p7.p1, line_p41_p7.p2);

				par.pointsShape.push(p6);
				par.pointsShape.push(p61);
				par.pointsShape.push(p71);
				par.pointsShape.push(p7);
			}


		} else if (par.botEnd == "площадка") {
			var p51 = newPoint_xy(p0, par.b * (par.stairAmt - 1) + params.flanThickness * 2 + 10 + par.botEndLength + par.lengthBturn1_2 - 3, 0);
			var p61 = newPoint_xy(p51, 0, par.h * (par.stairAmt) + params.profileHeight + par.h_topWnd);

			var p71 = newPoint_xy(p61, 0, -params.profileHeight);

			var ps31 = newPoint_xy(p0, par.botEndLength + params.flanThickness + par.b * (par.stairAmt - 1), 0);
			var ps31 = newPoint_xy(ps31, 0, params.profileHeight + 60 + par.h * (par.stairAmt - 1));

			var ps6 = newPoint_xy(ps31, par.lengthBturn1, par.h);

			var line_p31_p6 = parallel(ps31, ps6, -(params.sidePlateWidth - params.sidePlateOverlay));

			var p31 = itercection(p3, polar(p3, ang, 100), line_p31_p6.p1, line_p31_p6.p2);
			var p6 = itercection(p61, polar(p61, Math.PI, 100.0), line_p31_p6.p1, line_p31_p6.p2);

			var line_p4_p41 = parallel(p3, p31, -params.profileHeight);
			var line_p41_p7 = parallel(p31, p6, -params.profileHeight);

			var p41 = itercection(line_p4_p41.p1, line_p4_p41.p2, line_p41_p7.p1, line_p41_p7.p2);
			var p7 = itercection(p71, polar(p71, Math.PI, 100.0), line_p41_p7.p1, line_p41_p7.p2);

			par.pointsShape.push(p31);
			par.pointsShape.push(p6);
			par.pointsShape.push(p61);
			par.pointsShape.push(p71);
			par.pointsShape.push(p7);
			par.pointsShape.push(p41);

		} else {
			var pt3 = newPoint_xy(p0, par.b * (par.stairAmt - 1) + params.flanThickness + par.lengthBturn1, 0);
			var pt3 = newPoint_xy(pt3, 0, par.h * par.stairAmt - (params.treadThickness + params.treadPlateThickness) + params.flanThickness + stringerOffset_y);

			var p51 = newPoint_xy(p0, par.b * (par.stairAmt - 1) + params.flanThickness + par.lengthBturn1_2 - 3, 0);
			var p61 = newPoint_xy(p51, 0, par.h * (par.stairAmt) - (params.treadThickness + params.treadPlateThickness) - 60 + stringerOffset_y + par.h_topWnd);


			var pt31 = newPoint_xy(pt3, (params.sidePlateWidth - params.sidePlateOverlay) / Math.sin(par.ang2), 0);
			var p31 = itercection(p3, polar(p3, par.stairAngle1, 100.0), pt31, polar(pt31, par.ang2, 100.0));


			var p6 = itercection(p31, polar(p31, par.ang2, 100.0), p61, polar(p61, Math.PI, 100.0));
			var p71 = newPoint_xy(p61, 0, -params.profileHeight);

			var line_p41_p7 = parallel(p31, p6, -params.profileHeight);

			var p7 = itercection(p71, polar(p71, Math.PI, 100.0), line_p41_p7.p1, line_p41_p7.p2);
			var p41 = itercection(p4, polar(p4, par.stairAngle1, 100.0), line_p41_p7.p1, line_p41_p7.p2);

			if (par.stairAmt === 1) {
				var p61 = newPoint_xy(p51, 0, par.h - 60 + stringerOffset_y + par.h_topWnd);
				var p71 = newPoint_xy(p61, 0, -params.profileHeight);
				var p6 = itercection(p3, polar(p3, par.ang2, 100.0), p61, polar(p61, Math.PI, 100.0));
				var line_p4_p7 = parallel(p3, p6, -params.profileHeight);
				var p7 = itercection(p71, polar(p71, Math.PI, 100.0), line_p4_p7.p1, line_p4_p7.p2);

				par.pointsShape.push(p6);
				par.pointsShape.push(p61);
				par.pointsShape.push(p71);
				par.pointsShape.push(p7);
			} else {
				par.pointsShape.push(p31);
				par.pointsShape.push(p6);
				par.pointsShape.push(p61);
				par.pointsShape.push(p71);
				par.pointsShape.push(p7);
				par.pointsShape.push(p41);
			}

		}

		if (par.isColumn1) {
			var sh = new THREE.Shape();
			var pt2 = newPoint_xy(p71, -params.flanThickness - 100 + 3, 0);
			var psm1 = polar(pt2, 0, 30 + 50);
			var psm2 = polar(pt2, 0, -(30 + 50));
			var ang = Math.PI / 2;

			addLine(sh, dxfPrimitivesArr, polar(psm1, ang, -20), polar(psm1, ang, params.profileHeight + 20), par.dxfBasePoint);
			addLine(sh, dxfPrimitivesArr, polar(psm2, ang, -20), polar(psm2, ang, params.profileHeight + 20), par.dxfBasePoint);
		}
		if (par.isColumn2) {
			var sh = new THREE.Shape();

			var pt1 = newPoint_xy(p71, -params.M / 2 + 3, 0);
			var pt2 = itercection(pt1, polar(pt1, Math.PI / 2, 100.0), line_p41_p7.p1, line_p41_p7.p2);

			dyColumnlen = pt1.y - pt2.y;

			var psm1 = polar(pt2, par.ang2, 30 + 50 / Math.cos(par.ang2));
			var psm2 = polar(pt2, par.ang2, -(30 + 50 / Math.cos(par.ang2)));
			var ang = par.ang2 + Math.PI / 2;

			addLine(sh, dxfPrimitivesArr, polar(psm1, ang, -20), polar(psm1, ang, params.profileHeight + 20), par.dxfBasePoint);
			addLine(sh, dxfPrimitivesArr, polar(psm2, ang, -20), polar(psm2, ang, params.profileHeight + 20), par.dxfBasePoint);
		}
	}
	if (par.topEnd == "пол") {
		if (params.topAnglePosition === "под ступенью") {
			p5.x -= params.flanThickness;// + params.treadPlateThickness;
			p6.x -= params.flanThickness;// + params.treadPlateThickness;
		}
		var p7 = itercection(p5, polar(p5, Math.PI / 2, 100.0), p4, polar(p4, par.stairAngle1, 100.0));
		p6.x = p7.x -= 3;

		par.pointsShape.push(p6);
		par.pointsShape.push(p7);
	}



	par.dyColumnlen = dyColumnlen;
	par.dyColumnMiddlelen = dyColumnMiddlelen;


	par.bottomDistance = distance(p4, p0);
	par.bottomDistancePipe = distance(p4, p3);

	par.topDistance = distance(p55, p7);
	par.topDistancePipe = distance(p6, p7);


	var shapePar = {
		points: par.pointsShape,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		radIn: 0, //Радиус скругления внутренних углов
		radOut: 0, //радиус скругления внешних углов
		markPoints: true,
	}

	par.stringerShape = drawShapeByPoints2(shapePar).shape;



	par.dxfBasePoint.x += (p6.x - p3.x) + par.dxfBasePointGap;
	if (par.botEnd == "площадка" || par.botEnd == "площадкаП")
		par.dxfBasePoint.x += (p3.x - p2.x);
	if (par.topEnd == "площадка" || par.topEnd == "площадкаП")
		par.dxfBasePoint.x += (p61.x - p6.x);

	return par;

} //end of drawProfPipe

/**
 * Кусок прямой профильной трубы
 */
function drawProfPipeStraight(par) {

	par.pointsShape = [];
	par.stringerShape = new THREE.Shape();

	var p0 = { x: 0, y: 0, };
	if (par.topConnection)
		p0.x += 3;
	var p1 = newPoint_xy(p0, 0, params.profileHeight);
	var p2 = newPoint_xy(p1, par.topEndLength, 0);
	if (par.botConnection)
		p2.x -= 3;
	if (par.topConnection)
		p2.x -= 3;
	var p3 = newPoint_xy(p2, 0, -(params.profileHeight));

	par.pointsShape.push(p0);
	par.pointsShape.push(p1);
	par.pointsShape.push(p2);
	par.pointsShape.push(p3);

	var shapePar = {
		points: par.pointsShape,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		radIn: 0, //Радиус скругления внутренних углов
		radOut: 0, //радиус скругления внешних углов
		markPoints: true,
	}

	par.stringerShape = drawShapeByPoints2(shapePar).shape;

	if (par.topConnection) {
		if (params.isColumn4) {
			var sh = new THREE.Shape();
			var pt2 = newPoint_xy(p3, -params.flanThickness - 100 + 3, 0);
			var psm1 = polar(pt2, 0, 30 + 50);
			var psm2 = polar(pt2, 0, -(30 + 50));
			var ang = Math.PI / 2;

			addLine(sh,
				dxfPrimitivesArr,
				polar(psm1, ang, -20),
				polar(psm1, ang, params.profileHeight + 20),
				par.dxfBasePoint);
			addLine(sh,
				dxfPrimitivesArr,
				polar(psm2, ang, -20),
				polar(psm2, ang, params.profileHeight + 20),
				par.dxfBasePoint);
		}
		if (params.isColumn3) {
			var sh = new THREE.Shape();
			var pt2 = newPoint_xy(p3, -params.M / 2 + 3, 0);
			//if (params.stairModel == "П-образная с площадкой")
			//    pt2 = newPoint_xy(p71, -par.platformLength_1 / 2 + 3, 0);
			var psm1 = polar(pt2, 0, 30 + 50);
			var psm2 = polar(pt2, 0, -(30 + 50));
			var ang = Math.PI / 2;

			addLine(sh,
				dxfPrimitivesArr,
				polar(psm1, ang, -20),
				polar(psm1, ang, params.profileHeight + 20),
				par.dxfBasePoint);
			addLine(sh,
				dxfPrimitivesArr,
				polar(psm2, ang, -20),
				polar(psm2, ang, params.profileHeight + 20),
				par.dxfBasePoint);
		}
	}
	if (par.botConnection) {
		if (params.isColumn1) {
			var sh = new THREE.Shape();
			var pt2 = newPoint_xy(p0, params.flanThickness + 100 - 3, 0);
			var psm1 = polar(pt2, 0, 30 + 50);
			var psm2 = polar(pt2, 0, -(30 + 50));
			var ang = Math.PI / 2;

			addLine(sh, dxfPrimitivesArr, polar(psm1, ang, -20), polar(psm1, ang, params.profileHeight + 20), par.dxfBasePoint);
			addLine(sh, dxfPrimitivesArr, polar(psm2, ang, -20), polar(psm2, ang, params.profileHeight + 20), par.dxfBasePoint);
		}
		if (params.isColumn2) {
			var sh = new THREE.Shape();
			var pt2 = newPoint_xy(p0, params.M / 2 - 3, 0);
			var psm1 = polar(pt2, 0, 30 + 50);
			var psm2 = polar(pt2, 0, -(30 + 50));
			var ang = Math.PI / 2;

			addLine(sh, dxfPrimitivesArr, polar(psm1, ang, -20), polar(psm1, ang, params.profileHeight + 20), par.dxfBasePoint);
			addLine(sh, dxfPrimitivesArr, polar(psm2, ang, -20), polar(psm2, ang, params.profileHeight + 20), par.dxfBasePoint);
		}
	}
	par.dxfBasePoint.x += p3.x + par.dxfBasePointGap;
	return par;

} //end of drawProfPipe

/**
 * расчет точек сопряжения двух отрезков
 * @param {Object} <начальная точка>
 * @param {Double} <угол первого сопрягаемого отрезка>
 * @param {Object} <конечная точка>
 * @param {Double} <угол второго сопрягаемого отрезка>
 * @param {Double} <радиус сопряжения>
 * @return {Object} -
 *   точка пересечения отрезков, начальная точка дуги, конечная точка дуги, центр дуги,
 *   начальный угол дуги, конечный угол дуги
 */
function fillet(pt1, ang1, pt2, ang2, rad) {
	var pti = itercection(pt1, polar(pt1, ang1, 1.0), pt2, polar(pt2, ang2, 1.0));
	if (pti.x !== undefined && pti.y !== undefined) {
		var n = Math.abs(rad / Math.tan((ang2 - ang1) * 0.5));
		var pta = polar(pti, ang1, -n);
		var ptb = polar(pti, ang2, -n);
		var ang = Math.abs(ang2 - ang1);
		ang = ang1 + Math.PI * ((ang2 > ang1 && ang > Math.PI) || (ang2 < ang1 && ang < Math.PI) ? 0.5 : -0.5);
		var ptc = polar(pta, ang, rad);
		return {
			"int": pti,
			"start": pta,
			"end": ptb,
			"center": ptc,
			"angstart": anglea(ptc, pta),
			"angend": anglea(ptc, ptb)
		};
	} else {
		return null;
	}
}

/**
 * угол между осью X и отрезком, соединяющим точки
 * @param {Object} - точка 1
 * @param {Object} - точка 2
 * @return {Double}
 */
function anglea(pt1, pt2) {
	var x = pt2.x - pt1.x;
	var y = pt2.y - pt1.y;
	var ang = Math.acos(x / Math.sqrt(x * x + y * y));
	return pt2.y > pt1.y ? ang : Math.PI + Math.PI - ang;
}


function toRadians(angle) {
	return angle * (Math.PI / 180);
}

function addArc1_(centerPoint, radius, startAngle, endAngle, par) {
	addArc(par.stringerShape, dxfPrimitivesArr, centerPoint, radius, startAngle, endAngle, par.dxfBasePoint);

	//Возвращает точку привязки следующего примитива
	return polar(centerPoint, endAngle, radius);
}

function addLine1(startPoint, endPoint, par) {
	addLine(par.stringerShape, dxfPrimitivesArr, startPoint, endPoint, par.dxfBasePoint);

	//Возвращает точку привязки следующего примитива
	return endPoint;

}

function addPolygonHole(shape, dxfPrimitivesArr, center, holeX, holeY, dxfBasePoint) {
	var hole = new THREE.Path();

	var p1 = { x: center.x - holeX, y: center.y + holeY };
	var p2 = { x: center.x + holeX, y: center.y + holeY };
	var p3 = { x: center.x + holeX, y: center.y - holeY };
	var p4 = { x: center.x - holeX, y: center.y - holeY };

	addLine(hole, dxfPrimitivesArr, p1, p4, dxfBasePoint);
	addLine(hole, dxfPrimitivesArr, p4, p3, dxfBasePoint);
	addLine(hole, dxfPrimitivesArr, p3, p2, dxfBasePoint);
	addLine(hole, dxfPrimitivesArr, p2, p1, dxfBasePoint);

	shape.holes.push(hole);

	return hole;

}//end of addPolygonHole

function pathPolygonHole(center, holeX, holeY, dxfBasePoint) {
	var hole = new THREE.Path();

	var p1 = { x: center.x - holeX, y: center.y + holeY };
	var p2 = { x: center.x + holeX, y: center.y + holeY };
	var p3 = { x: center.x + holeX, y: center.y - holeY };
	var p4 = { x: center.x - holeX, y: center.y - holeY };

	addLine(hole, dxfPrimitivesArr, p1, p4, dxfBasePoint);
	addLine(hole, dxfPrimitivesArr, p4, p3, dxfBasePoint);
	addLine(hole, dxfPrimitivesArr, p3, p2, dxfBasePoint);
	addLine(hole, dxfPrimitivesArr, p2, p1, dxfBasePoint);

	return hole;
}//end of addPolygonHole

function itercectionBackLineMarsh(pTop, pBot, angBot, par) {
	//функция определяет точку пересечения нижней линии марша задаваемой точкой pTop
	//и другой линиией задаваемой точкой pBot и углом angBot

	var p20 = newPoint_xy(pTop, (par.stringerWidth / Math.sin(par.marshAngle)), 0.0); // первая точка на нижней линии марша
	if (params.model == "труба")
		p20 = newPoint_xy(pTop, (params.sidePlateWidth / Math.sin(par.marshAngle)), 0.0); // первая точка на нижней линии марша
	var p21 = polar(p20, par.marshAngle, 100.0); // вторая точка на нижней линии
	var p00 = polar(pBot, angBot, 100.0); // вторая точка нижнего края косоура
	var bottomLineP1 = itercection(pBot, p00, p20, p21); // точка пересечения нижнего края и нижней линии марша

	return bottomLineP1;
}


function drawStringerHoles(par) {
	var shape = par.stringerShape;
	for (var i = 0; i < par.pointsHole.length; i++) {
		var center = par.pointsHole[i];
		if (par.pDivideBot) {
			if (center.x < par.pDivideBot.x) shape = par.stringerShapeBot
			else shape = par.stringerShapeTop
		}

		if (center.polygon) {
			if (!center.rad) center.rad = par.rectHoleSize / 2;
			addPolygonHole(shape, dxfPrimitivesArr, center, center.rad, center.rad, par.dxfBasePoint);
		}

		if (!center.polygon) {
			if (!center.rad) center.rad = 7.5;
			var hole1 = new THREE.Path();
			addCircle(hole1, dxfPrimitivesArr, center, center.rad, par.dxfBasePoint);
			shape.holes.push(hole1);
		}
	}
}

function addPointsRecessFramePlatform(p, pos, par) {
	var h_frame = 60 - params.treadPlateThickness + 0.01;
	par.framePlatformWidth = params.M - 300;
	if (params.stairModel == "П-образная с площадкой")
		par.framePlatformWidth = params.platformLength_1 - 300;

	if (pos == "top") {

		if (par.topConnection) {
			var pcenter = newPoint_xy(p, ((par.topEndLength - par.stringerLedge) + params.flanThickness) - params.M / 2, 0);
			if (params.stairModel == "П-образная с площадкой") {
				pcenter = newPoint_xy(p, ((par.topEndLength - par.stringerLedge) + params.flanThickness) - params.platformLength_1 / 2 + 25, 0);
			}
		}
		else {
			var pcenter = newPoint_xy(p, par.topEndLength + params.profileWidth / 2 + params.flanThickness + params.metalThickness, 0);
			//if (params.stairModel == "П-образная с площадкой") pcenter.x += 50;
		}


		var p6 = newPoint_xy(pcenter, -(par.framePlatformWidth / 2 - 32), 0);
		var p5 = newPoint_xy(p6, 0, -h_frame);
		var p4 = newPoint_xy(p5, -34, 0);
		var p3 = newPoint_xy(p4, 0, h_frame);

		par.pointsShape.push(p3);
		par.pointsShape.push(p4);
		par.pointsShape.push(p5);
		par.pointsShape.push(p6);

		if (par.topConnection) {
			var pt3 = newPoint_xy(pcenter, (par.framePlatformWidth / 2 - 32), 0);
			var pt4 = newPoint_xy(pt3, 0, -h_frame);
			var pt5 = newPoint_xy(pt4, 34, 0);
			var pt6 = newPoint_xy(pt5, 0, h_frame);

			par.pointsShape.push(pt3);
			par.pointsShape.push(pt4);
			par.pointsShape.push(pt5);
			par.pointsShape.push(pt6);

			par.pcenter = pcenter;
			if (params.stairModel == "П-образная с площадкой") par.pcenter.x -= 50;
		}


	}

	if (pos == "bot") {
		if (!par.botConnection) {
			var dx = par.framePlatformWidth / 2 - params.profileWidth / 2 - params.flanThickness - params.metalThickness - 32;
			if (params.stairModel == "П-образная с площадкой") dx -= 50;

			var p3 = newPoint_xy(p, dx, 0);
			var p4 = newPoint_xy(p3, 0, -h_frame);
			var p5 = newPoint_xy(p4, 34, 0);
			var p6 = newPoint_xy(p5, 0, h_frame);

			par.pointsShape.push(p3);
			par.pointsShape.push(p4);
			par.pointsShape.push(p5);
			par.pointsShape.push(p6);

		} else {
			var pcenter = newPoint_xy(p, (par.botEndLength + par.stringerLedge + params.treadPlateThickness * 2) / 2 - params.flanThickness, 0);
			//if (params.stairModel == "П-образная с площадкой") pcenter.x -= (par.a - par.b);
			//if (params.stairModel == "П-образная трехмаршевая" && par.topEnd == "пол")
			//	pcenter.x -= 11;
			if (params.stairModel == "П-образная трехмаршевая" && par.topEnd == "забег")
                pcenter.x -= 6;
            if (params.stairModel == "П-образная трехмаршевая" &&par.botEnd == "площадка" &&par.marshId == 2 && par.stairAmt == 1) {
                pcenter.x -= (params.marshDist + 5) / 2;
            }

			//первая прорезь
			var p6 = newPoint_xy(pcenter, -(par.framePlatformWidth / 2 - 32), 0);
			var p5 = newPoint_xy(p6, 0, -h_frame);
			var p4 = newPoint_xy(p5, -34, 0);
			var p3 = newPoint_xy(p4, 0, h_frame);

			par.pointsShape.push(p3);
			par.pointsShape.push(p4);
			par.pointsShape.push(p5);
			par.pointsShape.push(p6);

			//вторая прорезь
			var pt3 = newPoint_xy(pcenter, (par.framePlatformWidth / 2 - 32), 0);
			var pt4 = newPoint_xy(pt3, 0, -h_frame);
			var pt5 = newPoint_xy(pt4, 34, 0);
			var pt6 = newPoint_xy(pt5, 0, h_frame);

			par.pointsShape.push(pt3);
			par.pointsShape.push(pt4);
			par.pointsShape.push(pt5);
			par.pointsShape.push(pt6);

			par.pcenter = pcenter;
		}

	}

	if (pos == "platform") {
		var width = 34;
		var p1 = newPoint_xy(p, -width / 2, 0);
		var p2 = newPoint_xy(p1, 0, -h_frame);
		var p3 = newPoint_xy(p2, width, 0);
		var p4 = newPoint_xy(p3, 0, h_frame);

		par.pointsShape.push(p1);
		par.pointsShape.push(p2);
		par.pointsShape.push(p3);
		par.pointsShape.push(p4);
	}
}

function sizeShape(points) {
	var minX = points[0].x;
	var minY = points[0].y;
	var maxX = points[0].x;
	var maxY = points[0].y;

	for (var i = 0; i < points.length; i++) {
		if (points[i].x > maxX) maxX = points[i].x
		if (points[i].x < minX) minX = points[i].x
		if (points[i].y > maxY) maxY = points[i].y
		if (points[i].y < minY) minY = points[i].y
	}

	return { dimX: maxX - minX, dimY: maxY - minY }
}