var techDelta = 0.05;
/*функция рассчитывает координаты точек нижнего узла тетивы/косоура если снизу столб или пол*/
function calcBotStepPoints(par){

	/*
	par.type
	par.stairAngle
	par.width
	par.slotsOffset
	par.hasRailing
	par.bottomRackNotch
	par.keyPoints.zeroPoint
	*/
	var marshPar = getMarshParams(par.marshId);

	if(par.type == "косоур"){
		//левый нижний угол косоура
		var topLineP0 = {
			x: nose,
			y: 0,
		}
		if(params.riserType == "есть") topLineP0.x += params.riserThickness;

		//первый подъем
		var topLineP1 = {
			x: topLineP0.x,
			y: marshPar.h - params.treadThickness,
		};

		//корректируем точки если внизу столб

		if(par.botEnd == "столб" && params.calcType == "timber") {
			var treadNotch = 50; //врезка первой ступени верхнего марша в столб
			var newellSlotDepth = 30 - 0.1;//FIX //глубина паза в столбе под косоур

			topLineP0 = {
				x: treadNotch - newellSlotDepth,
				y: -params.treadThickness - 20,
			}
			topLineP1 = {
				x: topLineP0.x,
				y: marshPar.h - params.treadThickness,
			};

			//паз под подступенок
			if(params.riserType == "есть" && par.slots){
				topLineP1 = newPoint_xy(topLineP1, params.riserThickness, 0);
				var topLineP02 = newPoint_xy(topLineP1, 0, -marshPar.h);
				var topLineP01 = newPoint_xy(topLineP02, -params.riserThickness, 0);
			}
		}
		
		if(par.botEnd != "пол" && params.calcType == "timber_stock") {
			topLineP0.y -= params.treadThickness + 228;
			if(params.riserType == "есть"){
				topLineP0.x -= params.riserThickness;
				var topLineP02 = newPoint_xy(topLineP1, 0, -marshPar.h);
				var topLineP01 = newPoint_xy(topLineP02, -params.riserThickness, 0);
			}
			if(params.stairModel == "П-образная с площадкой"){
				topLineP0.x -= params.nose * 2;
				if(typeof topLineP02 == 'undefined') var topLineP02 = newPoint_xy(topLineP1, 0, -marshPar.h);
				if(typeof topLineP01 == 'undefined') var topLineP01 = newPoint_xy(topLineP02, 0, 0);
				topLineP01.x -= params.nose * 2;
			}
			
		}

		//вспомогательные точки на верхней линии
		topLineP10 = {
			x: marshPar.a,
			y: marshPar.h - params.treadThickness,
		};
		if(params.riserType == "есть") topLineP10.x += params.riserThickness;
		topLineP11 = polar(topLineP10, par.stairAngle, 100);

		//контур нижней части косоура

		//рассчитываем координаты точек на нижней линии
		var bottomLine = parallel(topLineP10, topLineP11, -par.width);
		//точка пересечения с нижнем перекрытием
		var botLineP10 = itercection(topLineP0, newPoint_xy(topLineP0, 100, 0), bottomLine.p1, bottomLine.p2);

		var points = {
			topLineP0: topLineP0,
			topLineP01: topLineP01,
			topLineP02: topLineP02,
			topLineP1: topLineP1,
			topLineP10: topLineP10,
			topLineP11: topLineP11,
			botLineP10: botLineP10,
			bottomLine: bottomLine,
		}
	}

	if(par.type == "тетива"){
		//левый нижний угол тетивы
		var topLineP0 = {
			x: -par.slotsOffset,
			y: 0,
			}
		if(par.hasRailing && marshPar.stairAmt > 0 && params.firstNewellPos == 'на полу') topLineP0.x = par.bottomRackNotch;

		//корректируем точки если внизу столб
		if(par.botEnd == "столб") {
			//рассчет врезки первой ступени верхнего марша в столб
			var treadOffset = 50; //отступ края ступени от внешней плоскости тетивы нижнего марша
			if (marshPar.botTurn == 'забег') {
				treadOffset = 25;
			}
			if (marshPar.botTurn == 'площадка' && params.stairModel == 'П-образная с площадкой') {
				treadOffset = 30;
			}
			var treadNotch = treadOffset - params.stringerThickness / 2 + params.rackSize / 2;
			var newellSlotDepth = params.stringerSlotsDepth; //глубина паза в столбе под тетиву
			topLineP0 = {
				x: treadNotch - newellSlotDepth,
				y: -params.treadThickness - 20,
			}
		}


		//угол первой ступени
		var p1 = newPoint_xy(par.keyPoints.zeroPoint, 0, marshPar.h);
		if (marshPar.stairAmt == 0 && par.topEnd == 'забег' && par.hasRailing) {
			p1.y += 100;//Модифицируем точку чтобы каркас не пересекал ступень
		}
		//вспомогательные точки на верхней линии
		var topLineP10 = polar(p1, par.stairAngle + Math.PI/2, par.slotsOffset);

		var topLineP11 = polar(topLineP10, par.stairAngle, 100)
		if (marshPar.stairAmt == 0 && marshPar.topTurn == 'площадка') {
			//корректируем высоту для площадки без ступеней, тк марша у нас нету
			topLineP10.y = marshPar.h + 15;
			topLineP11.y = marshPar.h + 15;
		}
		//вспомогательная точка на верхней линии на одном уровне с передним ребром ступени
		var topLinePt = itercection(par.keyPoints.zeroPoint, newPoint_xy(par.keyPoints.zeroPoint, 0, 100), topLineP10, topLineP11)

		//верхний угол тетивы в начале
		var topLineP1 = itercection(topLineP0, newPoint_xy(topLineP0, 0, 100), topLineP10, topLineP11)

		//рассчитываем координаты точек на нижней линии
		var bottomLine = parallel(topLineP10, topLineP11, -par.width);

		//точка пересечения с нижнем перекрытием
		var botLineP10 = itercection(topLineP0, newPoint_xy(topLineP0, 100, 0), bottomLine.p1, bottomLine.p2);

		//вырез сверху для вхождения в столб
		if(par.botEnd == "столб") {
			var notchHeight = 30; //высота выреза сверху тетивы
			topLineP1 = newPoint_x1(topLineP1, newellSlotDepth, par.stairAngle);
			var topLineP02 = newPoint_xy(topLineP1, 0, -notchHeight);
			var topLineP01 = newPoint_xy(topLineP02, -newellSlotDepth, 0);
		}

		var points = {
			topLineP0: topLineP0,
			topLineP01: topLineP01,
			topLineP02: topLineP02,
			topLineP1: topLineP1,
			topLineP10: topLineP10,
			topLineP11: topLineP11,
			botLineP10: botLineP10,
			bottomLine: bottomLine,
			}
		}

	return points;

}//end of calcBotStepPoints

/*функция рассчитывает координаты точек верхнего узла косоура на внешней стороне марша если сверху забег или площадка*/

function calcPointsTurnOut_top(par){

  /*
  nose
  marshId
  platformWidth
  par.keyPoints.topLineP20
  stringerLedge
  frontEdgeRad

  */

	var marshPar = getMarshParams(par.marshId); //функция в файле inputsReading.js
	var railingRacks = calcRailingRacks({marshId: par.marshId, side: 'out'});
	var h = marshPar.h;
	var b = marshPar.b;
	var a = marshPar.a;
	var h_topWnd = marshPar.h_topWnd;
	var stairAmt = marshPar.stairAmt;
	if(par.isRearP) stairAmt = 0;
	var risers = params.riserType == "есть";

	var turnStepsParams = par.turnStepsParams;
	if (params.stairModel == 'П-образная с забегом' && par.marshId == 2) {
		turnStepsParams = par.turnStepsParams2;
	}

	var topLine = [];

	if (par.type == "косоур") {

		if (par.topEnd == "забег") {
			//первая забежная ступень
			//рассчитываем величину забежной проступи
			var wndStepWidth = par.turnStepsParams[1].stepWidthHi + 0.03;
			//учитываем свес
			wndStepWidth -= nose;
			//учитываем сдвиг косоура от края
			wndStepWidth -= par.stringerSideOffset * Math.atan(par.turnStepsParams[1].edgeAngle);
			//учитываем подступенки
			if(risers){
				wndStepWidth += params.riserThickness / Math.cos(par.turnStepsParams[1].edgeAngle) - params.riserThickness;
				}
			var topLineP21 = newPoint_xy(par.keyPoints.topLineP20, wndStepWidth, h);

			//p2 = newPoint_xy(topLineP21, 0, h_topWnd);

			//вторая забежная ступень
			//длина забежного участка косоура
			var stringerTurnLen = params.M - 10 - par.stringerSideOffset - nose + (20 - params.nose);

			if(risers) stringerTurnLen -= params.riserThickness;
			var botLineP1 = newPoint_xy(par.keyPoints.topLineP20, stringerTurnLen, h + h_topWnd)

			//рассчитываем координаты точек на нижней линии	забега
			bottomLine = parallel(par.keyPoints.topLineP20, topLineP21, -par.width);
			var botLineP2 = itercection(bottomLine.p1, bottomLine.p2, botLineP1, newPoint_xy(botLineP1, 0, -10));
			}

		if(par.topEnd == "площадка") {
			var botLineP1 = newPoint_xy(par.keyPoints.topLineP20, par.turnLength - (nose + (risers == true ? params.riserThickness : a - b - nose)) - par.stringerSideOffset - par.topMarshXOffset, h);
			if (params.stairModel == 'Г-образная с площадкой' || (params.stairModel == 'П-образная трехмаршевая' && par.marshId == 1 && marshPar.topTurn == 'площадка')) {
				botLineP1.x -= 10;// ? проверить это решениеы
			}
			var botLineP2 = newPoint_xy(botLineP1, 0, -(stairAmt > 0 ? par.platformWidth : h - params.treadThickness));

			if (stairAmt == 0) {
				botLineP2 = newPoint_xy(botLineP1, -a + 10, -h);
			}
			var topLineP21 = newPoint_xy(par.keyPoints.topLineP20, 0, h);
		}
		
		if(params.calcType == "timber_stock") {
			var topLineP21 = newPoint_xy(par.keyPoints.topLineP20, 0, h);
			var botLineP1 = newPoint_xy(topLineP21, b, 0);
			//рассчитываем координаты точек на нижней линии	забега
			bottomLine = parallel(par.keyPoints.topLineP20, topLineP21, -par.width);
			var botLineP2 = itercection(bottomLine.p1, bottomLine.p2, botLineP1, newPoint_xy(botLineP1, 0, -10));
		}

		var points = {
			topLineP21: topLineP21,
			botLineP1: botLineP1,
			botLineP2: botLineP2,
			stringerTurnLen: stringerTurnLen,
		}
	} //конец косоура

	if (par.type == "тетива") {

		// topLine.push(par.keyPoints.marshRailingP1) //точка совпадает с topLineP1
		topLine.push(par.keyPoints.marshFirstRailingPoint) //точка совпадает с topLineP1
		
		if (par.topEnd == "забег") {
			//верхний угол тетивы в конце
			var botLineP1 = {
				x: b * stairAmt + params.M + 10,
				y: h * (stairAmt + 1) + h_topWnd + par.stringerLedge,
			}

			if (params.stairModel == "Г-образная с забегом" && params.model == 'тетивы') {
				var stringerTurnLen = params.M + 10;
			}
			if (params.model == 'тетива+косоур') botLineP1.x -= 20.01;
			// if(stairAmt == 0) botLineP1 = newPoint_xy(botLineP1, params.marshDist + 55, 0);
			if (params.stairModel == "П-образная с забегом" && par.marshId == 2 && params.model == 'тетива+косоур') {
				botLineP1 = {
					x: params.M + (60 + (40 - params.stringerThickness)),// подогнано но ведёт себя корректно при изменении параметров
					y: h * (stairAmt + 1) + h_topWnd + par.stringerLedge,
				}
			}
			if (params.stairModel == "П-образная с забегом" && par.marshId == 2 && params.model == 'тетивы') {
				botLineP1 = {
					x: params.M + (80 + (40 - params.stringerThickness)) - 0.01,// подогнано но ведёт себя корректно при изменении параметров
					y: h * (stairAmt + 1) + h_topWnd + par.stringerLedge,
				}
			}

			var topLineP20 = newPoint_x1(par.keyPoints.topLinePt, b * stairAmt + nose + params.riserThickness, par.stairAngle);
			if (params.stairModel == "П-образная с забегом" && par.marshId == 2) {
				var topLineP20 = newPoint_x1(par.keyPoints.topLinePt, b * stairAmt + nose + params.riserThickness + (params.marshDist - 100), par.stairAngle);
			}
			//вспомогательная точка рядом с передним углом второй забежной ступени
			var topLinePt20 = newPoint_xy(topLineP20, turnStepsParams[1].stepWidthLow + 10 - params.stringerSlotsDepth - turnStepsParams[2].notchDepthY + turnStepsParams[2].stepOffsetY,  h_topWnd);
			if (risers) topLinePt20 = newPoint_xy(topLineP20, turnStepsParams[1].stepWidthHi - nose/Math.cos(turnStepsParams[1].edgeAngle) - turnStepsParams[2].outerOffsetX * Math.tan(turnStepsParams[2].angleX),  h_topWnd);

			var topLineP21 = itercection(topLineP20, topLinePt20, botLineP1, newPoint_xy(botLineP1, 100, 0));
			if(stairAmt > 0) topLine.push(topLineP20);
			if (params.stairModel == 'П-образная с забегом' && par.marshId == 2) {
				topLineP21.x = params.M - 200;
			}
			if(!par.hasRailing) topLine.push(topLineP21); //если есть ограждение, верхняя линия строится без перелома
				
		}
		
		if (par.topEnd == "площадка") {
			//верхний угол тетивы в конце
			var botLineP1 = {
				x: b * stairAmt + par.turnLength - 10,
				y: h * (stairAmt + 1) + par.stringerLedge,
			}
			if (params.stairModel == 'П-образная с площадкой') {
				botLineP1.x += 20;
				par.turnLength += 10;
				if (params.riserType == 'есть') {
					botLineP1.x -= 10;
				}
			}
			var topLineP20 = itercection(botLineP1, newPoint_xy(botLineP1, 100, 0), par.keyPoints.topLinePt, polar(par.keyPoints.topLinePt, par.stairAngle, 100))
			if(stairAmt > 0) topLine.push(topLineP20);
		}

		topLine.push(botLineP1);


		var botLineP2 = newPoint_xy(botLineP1, 0, -par.width);
		if (stairAmt == 0 && par.topEnd == 'площадка') {
			var botLineTemp2 = parallel(par.keyPoints.topLinePt, polar(par.keyPoints.topLinePt, par.stairAngle, 100), -par.width)
			botLineP2.y = botLineTemp2.y;
		}

		//задаем позицию столба 2 (столб ограждения всегда соосен с опорной колонной)
		// par.keyPoints.rack2Pos = {
		// 	x: topLineP20.x + params.rackSize/2,
		// 	y: h * (stairAmt + 1)
		// }

		//задаем позицию столба 3
		// par.keyPoints.rack3Pos = newPoint_xy(botLineP1, -params.rackSize / 2, -par.stringerLedge);

		//вырез под второй столб ограждения

		if(par.hasRailing && marshPar.stairAmt > 0){
			var notchPar = {
				points: topLine,
				notchCenterX: railingRacks.marshLast.x,//par.keyPoints.rack2Pos.x,
				isBotLine: false,
				botY: botLineP1.y - par.stringerLedge, //координата y дна выреза
			}

			if(par.topEnd == "забег") {
				notchPar.botY -= h_topWnd - 0.05;
			}

			notchPar = addNotch(notchPar);
			if (par.topEnd == 'забег') notchPar.notchRight.y += 50;
			topLine = notchPar.points;
			par.keyPoints.marshLastRailingPoint = notchPar.notchLeft;
			par.keyPoints.topFirstRailingPoint = notchPar.notchRight;

			//сохраняем точку для ограждений
		}

		//вырез под третий столб ограждения
		if(par.hasRailing || par.railingConnectionTop){
			//если есть ограждение на следующем марше, столб смещается вперед
			// if(par.railingConnectionTop)
			// 	par.keyPoints.rack3Pos = newPoint_xy(botLineP1, -params.stringerThickness / 2, -par.stringerLedge + 0.01);


			topLine.pop(); //удаляем последнюю точку
			var endNotchP1 = newPoint_xy(railingRacks.topLast, -params.rackSize / 2, par.stringerLedge);
			var endNotchP2 = newPoint_xy(railingRacks.topLast, -params.rackSize / 2, 0);
			var endNotchP3 = newPoint_xy(botLineP1, 0, -par.stringerLedge);
			if (params.stairModel == 'П-образная с забегом' && par.marshId == 2) {
				var endNotchP1 = newPoint_xy(railingRacks.marshLast, -params.rackSize / 2, par.stringerLedge);
				var endNotchP2 = newPoint_xy(railingRacks.marshLast, -params.rackSize / 2, 0);
				var endNotchP3 = newPoint_xy(botLineP1, 0, -par.stringerLedge);
				par.keyPoints.marshLastRailingPoint = endNotchP1;
			}
			if (par.topEnd == 'забег'){
				endNotchP1.y += 50;
				if (stairAmt == 0 && !(params.stairModel == 'П-образная с забегом' && par.marshId == 2)) {
					var endNotchP1 = newPoint_xy(railingRacks.topLast, -params.rackSize / 2, par.stringerLedge + 50 + 0.03);
					var endNotchP2 = newPoint_xy(railingRacks.topLast, -params.rackSize / 2, 0);
					var endNotchP3 = newPoint_xy(botLineP1, 0, -par.stringerLedge + 0.03);
				}
			}
			topLine.push(endNotchP1, endNotchP2, endNotchP3);
			//сохраняем точку для ограждений
			par.keyPoints.topTurnRailingP2 = endNotchP1;
			par.keyPoints.topLastRailingPoint = endNotchP1;
		}

		//при наличии ограждения изменяем верхнюю линию забега чтобы там не было перелома
		if(par.topEnd == "забег" && par.hasRailing && marshPar.stairAmt > 0){
			// //поднимаем точку у третьего столба
			// endNotchP1.y += 50;
			// //console.log(notchPar)
			// //поднимаем точку у второго столба
			// var p1 = itercection(notchPar.notchRight, newPoint_xy(notchPar.notchRight, 0, 100), endNotchP1, topLinePt20);
			// notchPar.notchRight.y = p1.y
		}

		if (par.topEnd == "забег") {
			//вспомогательные точки на верхнем участке нижней линии
			var botLineTemp1 = parallel(topLineP20, topLineP21, -par.width - 20)
			if (marshPar.stairAmt == 0 && par.topEnd == 'забег' && par.hasRailing) {
				var botLineTemp1 = parallel(topLineP20, topLineP21, -par.width - 100)
				//Модифицируем точку чтобы каркас не пересекал ступень
			}
			var botLineP3 = itercection(botLineP2, newPoint_xy(botLineP2, 100, 0), botLineTemp1.p1, botLineTemp1.p2)

			//вспомогательные точки на нижем участке нижней линии
			var botLineTemp2 = parallel(par.keyPoints.topLinePt, polar(par.keyPoints.topLinePt, par.stairAngle, 100), -par.width)
			var botLineP4 = itercection(botLineTemp1.p1, botLineTemp1.p2, botLineTemp2.p1, botLineTemp2.p2)
		}

		if (par.topEnd == "площадка") {
			//вспомогательные точки на нижем участке нижней линии
			var botLineTemp2 = parallel(par.keyPoints.topLinePt, polar(par.keyPoints.topLinePt, par.stairAngle, 100), -par.width)
			var botLineP4 = itercection(botLineP2, newPoint_xy(botLineP2, 100, 0), botLineTemp2.p1, botLineTemp2.p2);
		}

		{
			//верхняя линия пазов для лестницы с подступенками

			var slotsTopPoints = [];
			var slotsBotPoints = [];
			var bridgeWidth = 15; //расстояние, на которое последний паз не доходит до торца тетивы

			//верхняя линия пазов
			var p1 = newPoint_xy(botLineP1, 0, -par.stringerLedge  + 0.01);
			slotsTopPoints.push(p1);

			if (par.topEnd == "забег") {
				//вторая забежная ступень

				//рассчитываем величину забежной проступи
				var wndStepWidth = turnStepsParams[2].stepWidthY + 0.01;
				//учитываем вхождение в тетиву верхнего марша
				wndStepWidth += params.stringerThickness - params.stringerSlotsDepth;



				var p2 = newPoint_xy(p1, -wndStepWidth, 0)
				if (params.stairModel == 'П-образная с забегом' && par.marshId == 2) {
					wndStepWidth = turnStepsParams[2].stepWidthY;
					p2 = newPoint_xy(p1, -wndStepWidth + params.stringerSlotsDepth, 0.01)
				}
				var p3 = newPoint_xy(p2, 0, -params.treadThickness - 0.02);

				p2.filletRad = frontEdgeRad;
				slotsTopPoints.push(p2);
				slotsTopPoints.push(p3);

				//длина забежного участка тетивы
				var stringerTurnLen = params.M - 10.01;

				//FIX

				if (params.stairModel == "Г-образная с забегом" && params.model == 'тетивы') stringerTurnLen = params.M + 10;
				if (params.stairModel == 'П-образная трехмаршевая' && params.model !== 'тетива+косоур')	stringerTurnLen = params.M + 10;
				if (params.stairModel == 'П-образная с забегом' && params.model == 'тетивы') stringerTurnLen = params.M + 10;

				//передний угол первой забежной ступени
				var wndTread1Front = newPoint_xy(botLineP1, -stringerTurnLen - 0.01, -par.stringerLedge - h_topWnd)

				if (params.stairModel == 'П-образная с забегом' && par.marshId == 2 && params.model == 'тетива+косоур') {
					var wndTread1Front = newPoint_xy(botLineP1, -params.M + (50 + (params.stringerThickness - 40)), -par.stringerLedge - h_topWnd)
				}
				if (params.stairModel == 'П-образная с забегом' && par.marshId == 2 && params.model == 'тетивы') {
					var wndTread1Front = newPoint_xy(botLineP1, -params.M + (30 + (params.stringerThickness - 40)), -par.stringerLedge - h_topWnd)
				}


				//задний угол первой забежной ступени
				var wndTread1Back = newPoint_xy(wndTread1Front, turnStepsParams[1].stepWidthHi + 0.01, 0)
				//учитываем глубину пазов
				wndTread1Back = newPoint_xy(wndTread1Back, -params.stringerSlotsDepth * Math.tan(turnStepsParams[1].edgeAngle) - 0.02, 0);
				//верхняя точка
				p1 = newPoint_xy(wndTread1Back,-0.02, h_topWnd - params.treadThickness - 0.01);
				slotsTopPoints.push(p1);
				//нижняя точка
				slotsTopPoints.push(wndTread1Back);


				//первая забежная ступень

				//переднее ребро ступени без учета скругления
				var p1 = copyPoint(wndTread1Back)
				var p2 = wndTread1Front;
				var p3 = newPoint_xy(p2, 0, -params.treadThickness);

				p2.filletRad = frontEdgeRad;
				slotsTopPoints.push(p2);
				slotsTopPoints.push(p3);

				p1 = newPoint_xy(p3, nose, 0);
				slotsTopPoints.push(p1);

				p1 = newPoint_xy(p1, 0, -h + params.treadThickness);
				slotsTopPoints.push(p1);
			}

			if (par.topEnd == "площадка") {

				//переднее ребро ступени без учета скругления
				var p2 = newPoint_xy(p1, -par.turnLength + 35 - params.stringerThickness + params.stringerSlotsDepth - 0.01, 0.01);
				var p3 = newPoint_xy(p2, 0, -params.treadThickness - 0.02);

				p2.filletRad = frontEdgeRad;
				slotsTopPoints.push(p2);
				slotsTopPoints.push(p3);

				p1 = newPoint_xy(p3, nose, 0);
				slotsTopPoints.push(p1);

				p1 = newPoint_xy(p1, 0, -h + params.treadThickness + 0.02);
				slotsTopPoints.push(p1);
			}

			//нижняя линия пазов (формируем массив с конца)

			p1 = newPoint_xy(botLineP1, 0.01, -par.stringerLedge - 0.01);
			if (!(params.stairModel == 'П-образная с забегом' && par.marshId == 2)) {
				slotsBotPoints.unshift(p1);

				p1 = newPoint_xy(p1, -bridgeWidth, 0);
				slotsBotPoints.unshift(p1);
			}

			p1 = newPoint_xy(p1, 0, - params.treadThickness - 0.01);
			slotsBotPoints.unshift(p1);

			if (par.topEnd == "забег") {
				//подступенок второй забежной ступени

				//используем ранее рассчитанную точку
				var p2 = newPoint_xy(wndTread1Back, 0, h_topWnd - params.treadThickness);
				//учитываем толщину подступенка под углом
				p2 = newPoint_xy(p2, params.riserThickness / Math.cos(turnStepsParams[1].edgeAngle) + 0.01, 0);
				slotsBotPoints.unshift(p2);

				var p2 = newPoint_xy(p2, 0, -h_topWnd);
				slotsBotPoints.unshift(p2);

				//подступенок первой забежной ступени
				var p2 = newPoint_xy(botLineP1, -stringerTurnLen + nose + riserThickness, -h_topWnd - par.stringerLedge - params.treadThickness);
				if (params.stairModel == 'П-образная с забегом' && par.marshId == 2 && params.model == 'тетива+косоур') {
					p2.x += params.riserThickness * 2;
				}
				if (params.stairModel == 'П-образная с забегом' && par.marshId == 2 && params.model == 'тетивы') {
					p2.x += params.riserThickness * 2 + 2 + 0.01;
				}
				slotsBotPoints.unshift(p2);

				var p2 = newPoint_xy(p2, 0, -h);
				if(par.marshId == 1 && stairAmt == 0) p2.y = 0;

				slotsBotPoints.unshift(p2);
			}

			if (par.topEnd == "площадка") {
				var p2 = newPoint_xy(p1, -par.turnLength + 35 + nose + params.riserThickness - params.stringerThickness + params.stringerSlotsDepth + bridgeWidth, -0.01);
				slotsBotPoints.unshift(p2);

				var p2 = newPoint_xy(p2, 0, -h);
				if (stairAmt == 0) {
					p2.y += params.treadThickness;
				}
				slotsBotPoints.unshift(p2);
			}
		}
		//пазы для лестницы без подступенков

		if(par.slots && risers == false){

			if (par.topEnd == "забег") {

				//вторая забежная ступень

				//рассчитываем величину забежной проступи
				var wndStepWidth = turnStepsParams[2].stepWidthY;
				//учитываем вхождение в тетиву верхнего марша
				wndStepWidth += params.stringerThickness - params.stringerSlotsDepth;

				var holeBasePoint = newPoint_xy(botLineP1, - wndStepWidth - techDelta, -par.stringerLedge - params.treadThickness - techDelta)
				
				if (params.stairModel == 'П-образная с забегом' && par.marshId == 2) {
					wndStepWidth = turnStepsParams[2].stepWidthY;
					var holeBasePoint = newPoint_xy(botLineP1, -wndStepWidth + params.stringerSlotsDepth - techDelta, -par.stringerLedge - params.treadThickness - techDelta)
				}

				var holePar = {
					basePoint: holeBasePoint,
					height: params.treadThickness + techDelta * 2,
					len: wndStepWidth - bridgeWidth + techDelta,
					dxfArr: dxfPrimitivesArr,
					dxfBasePoint: par.dxfBasePoint,
					rad: frontEdgeRad,
					};

				var slotHole2 = drawHolePath(holePar).path;

				//первая забежная ступень

				//длина забежного участка тетивы
				var stringerTurnLen = params.M + 10;
				if (params.model == 'тетива+косоур') stringerTurnLen -= 20;
				//передний угол первой забежной ступени
				var wndTread1Front = newPoint_xy(botLineP1, -stringerTurnLen, -par.stringerLedge - h_topWnd)

				if (params.stairModel == 'П-образная с забегом' && par.marshId == 2 && params.model == 'тетива+косоур') {
					var wndTread1Front = newPoint_xy(botLineP1, -params.M + (50 + (params.stringerThickness - 40)), -par.stringerLedge - h_topWnd)
				}
				if (params.stairModel == 'П-образная с забегом' && par.marshId == 2 && params.model == 'тетивы') {
					var wndTread1Front = newPoint_xy(botLineP1, -params.M + (30 + (params.stringerThickness - 40)), -par.stringerLedge - h_topWnd)
				}

				var holePar = {
					basePoint: newPoint_xy(wndTread1Front, -techDelta, -params.treadThickness - techDelta),
					height: params.treadThickness + techDelta * 2,
					len: turnStepsParams[1].stepWidthHi + techDelta * 2,
					dxfArr: dxfPrimitivesArr,
					dxfBasePoint: par.dxfBasePoint,
					rad: frontEdgeRad,
				};

				var slotHole1 = drawHolePath(holePar).path;

				// //используем ранее рассчитанную точку
				//
				// var holeBasePointRiser = newPoint_xy(wndTread1Back, 0, -params.treadThickness);
				// var holePar = {
				// 	basePoint: holeBasePointRiser,
				// 	height: h_topWnd,
				// 	len: params.riserThickness / Math.cos(turnStepsParams[1].edgeAngle) + 0.01,
				// 	dxfArr: dxfPrimitivesArr,
				// 	dxfBasePoint: par.dxfBasePoint,
				// 	rad: 0,
				// };
				//
				// //подступенок второй забежной ступени
				// var slotRiserHole1 = drawHolePath(holePar).path;
			}

			if (par.topEnd == "площадка") {

				var platformSlotLen = par.turnLength - 10  - bridgeWidth;
				var p1 = newPoint_xy(botLineP1, -bridgeWidth, -par.stringerLedge);
				var slotBasePoint= newPoint_xy(p1, -platformSlotLen - techDelta, -params.treadThickness - techDelta);
				if (params.stairModel == 'П-образная с площадкой') {
					slotBasePoint.x -= 10;
				}

				var holePar = {
					basePoint: slotBasePoint,
					height: params.treadThickness + techDelta * 2,
					len: platformSlotLen + techDelta * 4,
					dxfArr: dxfPrimitivesArr,
					dxfBasePoint: par.dxfBasePoint,
					rad: frontEdgeRad,
					};

				var slotHole1 = drawHolePath(holePar).path;
				}
		}
		
		var points = {
			topLineP20: topLineP20,
			topLineP21: topLineP21,
			botLineP1: botLineP1,
			botLineP2: botLineP2,
			botLineP3: botLineP3,
			botLineP4: botLineP4,
			topLine: topLine,
			slotsBotPoints: slotsBotPoints,
			slotsTopPoints: slotsTopPoints,
			slotHole1: slotHole1,
			slotHole2: slotHole2,
			stringerTurnLen: stringerTurnLen,
			}


		}

	return points;

} //end of calcPointsTurnOut_top

/*функция рассчитывает координаты точек нижнего узла косоура на внешней стороне марша если снизу забег или плолщадка*/

function calcPointsTurnOut_bot(par){

  /*
  nose
  marshId
  stringerWidth
  par.keyPoints.topLineP20
  par.stringerLedge
  frontEdgeRad
  */

	var marshPar = getMarshParams(par.marshId); //функция в файле inputsReading.js
	var h = marshPar.h;
	var b = marshPar.b;
	var a = marshPar.a;
	var h_topWnd = marshPar.h_topWnd;
	var stairAmt = marshPar.stairAmt
	if(par.isRearP) stairAmt = 0;
	var risers = params.riserType == "есть";

	var topLine = [];

	if (par.type == "косоур") {
		//массив точек внешнего контура косоура
		var topLine = [];

		//длина забежного участка (площадки) косоура
		var stringerTurnLen = par.turnLength - par.stringerSideOffset + par.topMarshZOffset + nose - params.stringerThickness;
		if (params.stairModel == 'П-образная трехмаршевая') {
			stringerTurnLen -= 0.5;
		}
		if (params.stairModel == 'П-образная с забегом' && par.marshId == 2) {
			stringerTurnLen += 9 - .01;//Подогнано
		}
		if (params.stairModel == 'П-образная с площадкой' && par.marshId == 3) {
			stringerTurnLen += params.stringerThickness + 30;
		}
    if (marshPar.botTurn == 'забег') stringerTurnLen -= 1;//Подогнано
		par.stringerTurnLen = stringerTurnLen;

		// par.keyPoints.rack1Pos = {
		// 	x: -(params.M + par.topMarshZOffset + nose - params.stringerThickness) + params.rackSize / 2,
		// 	y: 0
		// }

		if (par.botEnd == "забег") {
			// par.keyPoints.rack1Pos.y -= h;
			// par.keyPoints.rack2Pos = {
			// 	x: nose + (risers ? params.riserThickness : 0) + params.rackSize/2,
			// 	y: h
			// }
			//левый нижний угол косоура
			var topLineP0 = {
				x: -stringerTurnLen + params.stringerThickness,
				y: -(h+par.stringerWidth+params.treadThickness),
			}
      if (marshPar.botTurn == 'забег') topLineP0.x += 1;//Подогнано
			topLine.push(topLineP0);

			//первый подъем забежного участка
			var botTurnRailingP1 = newPoint_xy(topLineP0, 0, par.stringerWidth - 0.01);
			//сохраняем точку для ограждений
			par.keyPoints.botTurnRailingP1 = copyPoint(botTurnRailingP1);
			topLine.push(botTurnRailingP1);

			//вторая забежная ступень
			//рассчитываем величину забежной проступи
			var wndStepWidth = par.turnStepsParams[2].stepWidthX + 0.03;
			//учитываем свес
			wndStepWidth -= par.stringerSideOffset + params.stringerThickness;
			//учитываем сдвиг косоура от края
			wndStepWidth += (par.stringerSideOffset + params.stringerThickness + 5) * Math.tan(par.turnStepsParams[2].angleY);//5 зазор
			//учитываем подступенки
			if(risers){
				wndStepWidth += params.riserThickness/Math.cos(par.turnStepsParams[2].angleY);
			}
			var topLineP9 = newPoint_xy(botTurnRailingP1, wndStepWidth, 0);
			//сохраняем точку для ограждений
			topLine.push(topLineP9);

			//второй подъем забежного участка
			var p1 = newPoint_xy(topLineP9, 0, h);
			par.keyPoints.botTurnRailingP2 = copyPoint(p1);
			topLine.push(p1);

			//третья забежная ступень
			var topLineP10 = newPoint_xy(topLineP0, stringerTurnLen + 0.01, h+par.stringerWidth - 0.01);
			if (params.riserType == 'есть' && params.stairModel == 'П-образная с забегом') {
				topLineP10.x += params.nose + params.riserThickness;
			}
			if (params.riserThickness == 'нет' && (params.stairModel == 'П-образная с забегом' && par.marshId == 3 || marshPar.botTurn == 'забег' && par.marshId == 2 && params.stairModel == 'П-образная трехмаршевая')) {
				topLineP10.x -= params.stringerThickness;
			}
			if(!risers) {
				// 10 залезало на ступень FIX IT!
				topLineP10 = newPoint_xy(topLineP10, params.nose, 0);
				if (par.botEnd == 'забег' && par.marshId == 3) {
					topLineP10 = newPoint_xy(topLineP10, -params.nose * 2 + 0.01, 0);

				}
			}
			topLine.push(topLineP10);
			var topLineP11 = polar(topLineP10, par.stairAngle, 100);

			//рассчитываем координаты точек на нижней линии	забега
			var bottomLine1 = parallel(topLineP10, topLineP11, -par.stringerWidth);
			var bottomLine2 = parallel(topLineP9, topLineP10, -par.stringerWidth);
			var botLineP9 = itercection(bottomLine1.p1, bottomLine1.p2, bottomLine2.p1, bottomLine2.p2);
			var botLineP10 = itercection(bottomLine2.p1, bottomLine2.p2, topLineP0, newPoint_xy(topLineP0, 10, 0));
		}

		if (par.botEnd == "площадка") {
			// par.keyPoints.rack2Pos = {
			// 	x: -(params.rackSize / 2 + par.platformRailingRack2OffsetX),
			// 	y: 0
			// }
			//левый нижний угол косоура
			var topLineP0 = {
				x: -stringerTurnLen + params.stringerThickness,
				y: -(par.stringerWidth+params.treadThickness),
			}

			topLine.push(topLineP0);

			//подъем площадки
			var botTurnRailingP1 = newPoint_xy(topLineP0, 0, par.stringerWidth);
			//сохраняем точку для ограждений
			par.keyPoints.botTurnRailingP1 = copyPoint(botTurnRailingP1);
			topLine.push(botTurnRailingP1);

			var topLineP10 = newPoint_xy(topLineP0, stringerTurnLen, par.stringerWidth);
			par.keyPoints.botTurnRailingP2 = copyPoint(topLineP10);
			if(!risers) {
				topLineP10 = newPoint_xy(topLineP10, -20, 0);
			}
			topLine.push(topLineP10);

			var topLineP11 = polar(topLineP10, par.stairAngle, 100);

			//рассчитываем координаты точек на нижней линии	площадки
			var bottomLine1 = parallel(topLineP10, topLineP11, -par.stringerWidth);
			var botLineP10 = itercection(bottomLine1.p1, bottomLine1.p2, topLineP0, newPoint_xy(topLineP0, 10, 0));
		}

		if (getMarshParams(marshPar.prevMarshId).stairAmt == 0 && par.botEnd == 'площадка') {
			topLineP0.y = -getMarshParams(marshPar.prevMarshId).h;
			botLineP10.y = -getMarshParams(marshPar.prevMarshId).h;
		}


		var points = {
			topLineP0: topLineP0,
			botTurnRailingP1: botTurnRailingP1,
			topLineP9: topLineP9,
			topLineP10: topLineP10,
			botLineP9: botLineP9,
			botLineP10: botLineP10,
			}
	}

	if (par.type == "тетива") {

		var zeroPoint = copyPoint(par.keyPoints.zeroPoint);
		if(stairAmt == 0 && (par.isRearP || par.isRearP3)) zeroPoint = newPoint_xy(par.keyPoints.zeroPoint, params.marshDist + 55, 0);

		//массив точек внешнего контура тетивы
		var topLine = [];

		if (par.botEnd == "забег") {
			//длина забежного участка (площадки) тетивы
			// var stringerTurnLen = par.turnLength + par.topMarshZOffset - (params.stringerThickness - params.stringerSlotsDepth) + 20;
			var stringerTurnLen = par.turnLength + par.topMarshZOffset - 0.01;
			if (params.stairModel == 'Г-образная с забегом' && par.marshId == 3 && params.model == 'тетивы') {
				stringerTurnLen = par.turnLength + par.topMarshZOffset - (params.stringerThickness - 40);
			}
			if (params.stairModel == 'Г-образная с забегом' && par.marshId == 3 && params.model == 'тетива+косоур') {
				stringerTurnLen = par.turnLength + par.topMarshZOffset - (25 + (params.stringerThickness - 40));
			}
			if (params.stairModel == 'П-образная с забегом' && par.marshId == 3) {
				stringerTurnLen += params.stringerSlotsDepth;
			}
			if (params.stairModel == 'П-образная с забегом' && par.marshId == 3 && params.model == 'тетивы') {
				stringerTurnLen = par.turnLength + par.topMarshZOffset + 40;//(40 + (params.stringerThickness - 40));// + params.stringerThickness + params.stringerSlotsDepth;
			}
			if (params.stairModel == 'П-образная с забегом' && par.marshId == 2 && params.model == 'тетива+косоур') {
				stringerTurnLen = -0.03 + par.turnLength + par.topMarshZOffset + params.marshDist - 100 + (25 + (40 - params.stringerThickness));//Подогнано, но корректно реагирует на изменение рассотяние между маршами и толщины тетивы
			}
			if (params.stairModel == 'П-образная с забегом' && par.marshId == 2 && params.model == 'тетивы') {
				stringerTurnLen = -0.03 + par.turnLength + par.topMarshZOffset + params.marshDist - 100 + (5 + (40 - params.stringerThickness));//Подогнано, но корректно реагирует на изменение рассотяние между маршами и толщины тетивы
			}
			if (params.stairModel == 'П-образная трехмаршевая' && params.model == 'тетива+косоур') {
				stringerTurnLen = -0.04 + par.turnLength + par.topMarshZOffset + params.marshDist - 125 + ((40 - params.stringerThickness));//Подогнано, но корректно реагирует на изменение рассотяние между маршами и толщины тетивы
			}
			if(stairAmt == 0 && !(params.stairModel == 'П-образная с забегом' && par.marshId == 2)) stringerTurnLen += 5;
			// if(params.model == 'тетива') stringerTurnLen -= 5;//fix it
			// if(params.model == 'тетива+косоур') stringerTurnLen -= 25;//fix it
			// if(params.model == 'тетива+косоур' && params.stairModel == 'П-образная с забегом' && par.marshId == 2) stringerTurnLen += 45;//fix it

			//левый нижний угол тетивы
			var topLineP0 = {
				x: -stringerTurnLen + nose + params.stringerSlotsDepth,
				y: -(h+par.stringerWidth-par.stringerLedge),
			}

			topLine.push(topLineP0);
			var topLineP9 = newPoint_xy(topLineP0, 0, par.stringerWidth);

			//угол первой ступени после забега
			var p1 = newPoint_xy(zeroPoint, 0, h);

			//вспомогательные точки на верхней линии
			var topLineP10 = polar(p1, par.stairAngle + Math.PI/2, par.slotsOffset);
			var topLineP11 = polar(topLineP10, par.stairAngle, 100);

			//вырез под первый столб ограждения

			if(par.hasRailing || par.railingConnectionBot){
				var begNotchP1 = newPoint_xy(topLineP0, 0, par.stringerWidth - par.stringerLedge + 0.01);
				var begNotchP2 = newPoint_xy(begNotchP1, -params.stringerThickness + params.rackSize, 0);
				if(par.railingConnectionBot){
					begNotchP2 = newPoint_xy(begNotchP1, -params.stringerThickness / 2 + params.rackSize/2, 0);
				}
				if (params.stairModel == 'П-образная с забегом' && par.marshId == 3) {
					var begNotchP1 = newPoint_xy(topLineP0, 0, par.stringerWidth - par.stringerLedge + 0.01);
					var begNotchP2 = newPoint_xy(begNotchP1, params.rackSize - (params.rackSize - params.stringerThickness) / 2 + 0.01, 0);
				}

				if(!risers || !par.slots) topLine.push(begNotchP1);
				topLine.push(begNotchP2);

				topLineP9 = itercection(begNotchP2, newPoint_xy(begNotchP2, 0, 100), topLineP9, topLineP10);
				par.keyPoints.botFirstRailingPoint = begNotchP2;
			}

			topLine.push(topLineP9);
			if(stairAmt > 0) topLine.push(topLineP10);

			//рассчитываем координаты точек на нижней линии	забега
			var bottomLine1 = parallel(topLineP10, topLineP11, -par.stringerWidth);
			var bottomLine2 = parallel(topLineP9, topLineP10, -par.stringerWidth);
			var botLineP9 = itercection(bottomLine1.p1, bottomLine1.p2, bottomLine2.p1, bottomLine2.p2);
			var botLineP10 = itercection(bottomLine2.p1, bottomLine2.p2, topLineP0, newPoint_xy(topLineP0, 10, 0));
		}

		if(par.botEnd == "площадка"){
			//длина забежного участка (площадки) косоура
			var stringerTurnLen = par.turnLength + par.topMarshZOffset - (params.stringerThickness - params.stringerSlotsDepth);
			if (params.stairModel == 'П-образная с площадкой') {
				stringerTurnLen += 70;
			}
			//левый нижний угол косоура
			var topLineP0 = {
				x: -stringerTurnLen + nose + params.stringerSlotsDepth,
				y: -(par.stringerWidth-par.stringerLedge),
				}

			topLine.push(topLineP0);

			var topLineP9 = newPoint_xy(topLineP0, 0, par.stringerWidth);

			//угол первой ступени
			var p1 = newPoint_xy(par.keyPoints.zeroPoint, 0, h);
			//вспомогательные точки на верхней линии
			var p1 = polar(p1, par.stairAngle + Math.PI/2, par.slotsOffset);
			var p2 = polar(p1, par.stairAngle, 100);


			var topLineP10 = itercection(p1, p2, topLineP9, newPoint_xy(topLineP9, 100, 0));
			var topLineP11 = polar(topLineP10, par.stairAngle, 100);

			//вырез под первый столб ограждения
			if(par.hasRailing || par.railingConnectionBot){
				var begNotchP1 = newPoint_xy(topLineP0, 0, par.stringerWidth - par.stringerLedge + 0.01);
				var begNotchP2 = newPoint_xy(begNotchP1, -params.stringerThickness + params.rackSize, 0);
				if(par.railingConnectionBot){
					begNotchP2 = newPoint_xy(begNotchP1, -params.stringerThickness / 2 + params.rackSize/2, 0);
				}
				if (params.stairModel == 'П-образная с площадкой') {
					var begNotchP2 = newPoint_xy(begNotchP1, params.rackSize / 2 + params.stringerThickness / 2, 0);
				}
				if(!risers || !par.slots) topLine.push(begNotchP1);
				topLine.push(begNotchP2);
				topLineP9 = itercection(begNotchP2, newPoint_xy(begNotchP2, 0, 100), topLineP9, topLineP10);
				// par.keyPoints.rack1Pos = newPoint_xy(begNotchP2, -params.rackSize/2, 0);
				botLineP10 = topLineP0;
				// par.keyPoints.botFirstRailingPoint = begNotchP2;
			}
			botLineP10 = topLineP0;

			topLine.push(topLineP9);
			topLine.push(topLineP10);

			//рассчитываем координаты точек на нижней линии	забега
			var bottomLine1 = parallel(topLineP10, topLineP11, -par.stringerWidth);
			var botLineP9 = itercection(bottomLine1.p1, bottomLine1.p2, topLineP0, newPoint_xy(topLineP0, 100, 0));
		}

		par.keyPoints.botTurnRailingP1 = copyPoint(topLineP9);
		par.keyPoints.botTurnRailingP2 = copyPoint(topLineP10);

		par.keyPoints.botFirstRailingPoint = copyPoint(topLineP9);
		//верхний угол тетивы в конце
		var botLineP1 = {
			x: b * stairAmt,
			y: h * (stairAmt + 1) - par.topPointOffsetY,
		}
		if(stairAmt == 0){
			botLineP1.y = h;
		}
		// par.keyPoints.marshLastRailingPoin3t = copyPoint(botLineP1);
		par.botLineP1 = copyPoint(botLineP1);

		var topLineP21 = itercection(topLineP10, topLineP11, botLineP1, newPoint_xy(botLineP1, 100, 0))

		var botLine = [];
		//внешний контур нижняя линия
		//Точка пересечения с задней линией
		var botLineP2 = itercection(botLineP1, newPoint_xy(botLineP1, 0, -100), bottomLine1.p1, bottomLine1.p2);
		if(stairAmt == 0){
			botLineP2.y = botLineP1.y - par.stringerWidth;
			if(par.botEnd == "площадка"){
				botLineP2.y = par.stringerLedge - par.stringerWidth;
			}
		}
		par.botLineP2 = copyPoint(botLineP2);

		if(stairAmt > 0) {
			botLine.push(botLineP9);
		}

		if(par.botEnd == "забег"){
			botLine.push(botLineP10);
			if (params.stairModel == 'П-образная с забегом' && par.marshId == 2) {
				botLineP10.x += 50;				
			}
		}

		botLine.push(topLineP0);

		if (getMarshParams(marshPar.prevMarshId).stairAmt == 0 && par.botEnd == 'площадка') {
			botLineP9.y = -getMarshParams(marshPar.prevMarshId).h;
			botLineP10.y = -getMarshParams(marshPar.prevMarshId).h;
			botLineP9.x += (par.stringerWidth - getMarshParams(marshPar.prevMarshId).h) / Math.cos(marshPar.ang);
		}
		//пазы для лестницы с подступенками

		if(par.slots && risers == true){
			topLine.shift();

			var slotsTopPoints = [];
			var slotsBotPoints = [];

			var p1 = newPoint_xy(zeroPoint, nose,  0); //задний угол третьей забежной ступени / площадки
			if(params.stairModel == "П-образная с забегом" && par.marshId == 2 && (params.model == 'тетива+косоур' || params.model == 'тетивы')){
				p1.x -= (75 + (params.marshDist - 130));
			}
			if (par.botEnd == "забег") {
				var wndStepWidth = par.turnStepsParams[3].stepWidthHi;

				var p2 = newPoint_xy(p1, -wndStepWidth, 0)
				var p3 = newPoint_xy(p2, 0, -params.treadThickness);

				p2.filletRad = frontEdgeRad;
				slotsTopPoints.push(p2);
				slotsTopPoints.push(p3);

				//паз под подступенок третьей забежной ступени

				//центральный угол второй забежной ступени
				// var wndTread2Corner = newPoint_xy(topLineP9, -params.stringerSlotsDepth, -par.stringerLedge);

				var wndTread2Corner = {//Подогнано
					x: topLineP0.x - 13 / Math.cos(par.turnStepsParams[2].angleY),// - params.riserThickness * Math.tan(par.turnStepsParams[2].angleY),// - (params.riserThickness / Math.cos(par.turnStepsParams[2].angleY)),
					y: -h
				};
				//задний угол второй забежной ступени
				var wndTread2Back = newPoint_xy(wndTread2Corner, par.turnStepsParams[2].stepWidthX, 0);
				if(params.stairModel == "П-образная с забегом" && par.marshId == 3){
					var wndTread2Back = {
						x: topLineP0.x + par.turnStepsParams[2].stepWidthX + (params.stringerThickness - params.stringerSlotsDepth),// - params.riserThickness * Math.tan(par.turnStepsParams[2].angleY),// - (params.riserThickness / Math.cos(par.turnStepsParams[2].angleY)),
						y: -h
					};
				}
				//учитываем глубину пазов
				wndTread2Back = newPoint_xy(wndTread2Back, params.stringerSlotsDepth * Math.tan(par.turnStepsParams[2].angleY), 0);

				//верхняя точка
				p1 = newPoint_xy(wndTread2Back, 0, h - params.treadThickness);
				slotsTopPoints.push(p1);
				//нижняя точка
				slotsTopPoints.push(wndTread2Back);

				//точка на левой боковой линии тетивы (конец паза)
				if(!par.hasRailing) {
					var endPoint = newPoint_xy(wndTread2Corner, params.stringerSlotsDepth, 0);
					slotsTopPoints.push(endPoint);
				}
			}
			if (par.botEnd == "площадка") {
				p1 = {
					x: topLineP0.x,
					y: 0
				}
				slotsTopPoints.push(p1);
			}

			//нижняя линия пазов (формируем массив с конца)

			if (par.botEnd == "забег") {
				//подступенок третьей забежной ступени

				//используем ранее рассчитанную точку
				var p2 = newPoint_xy(wndTread2Back, 0, h - params.treadThickness);
				//учитываем толщину подступенка под углом
				p2 = newPoint_xy(p2, params.riserThickness / Math.cos(par.turnStepsParams[1].edgeAngle), 0);
				if (testingMode) {
					p2.x += 0.3;
				}
				slotsBotPoints.unshift(p2);

				var p2 = newPoint_xy(p2, 0, -h);
				slotsBotPoints.unshift(p2);

				//точка на левой боковой линии тетивы (конец паза)
				// var p2 = newPoint_xy(topLineP9, 0, -par.stringerLedge - params.treadThickness);
				var p2 = {
					x: topLineP0.x,
					y: -h - params.treadThickness
				}
				//console.log(topLineP9, p2)
				slotsBotPoints.unshift(p2);
			}

			if (par.botEnd == "площадка") {
				var p2 = {
					x: -stringerTurnLen + params.stringerSlotsDepth + riserThickness,
					y: -params.treadThickness
					};
				slotsBotPoints.unshift(p2);
			}
		}

		//пазы для ступеней без подступенков (отверстия в шейпе)
		if(par.slots && risers == false){
				//формирование пазов для ступеней забега/площадки
				if (par.botEnd == "забег") {
					//паз под третью забежную ступень
					var wndStepWidth = par.turnStepsParams[3].stepWidthHi + techDelta * 2;
					var turnParams = calcTurnParams(par.marshId);
					var marshDelta = calcTurnParams(marshPar.prevMarshId).notchOffset2;

					// var holeBasePoint = newPoint_xy(zeroPoint, -wndStepWidth, -params.treadThickness - 0.015);
					var holeBasePoint = newPoint_xy(zeroPoint, -wndStepWidth + params.nose + techDelta, -params.treadThickness - techDelta);//Подогнано но работает корректно при изменении параметров

					if(params.stairModel == "П-образная с забегом" && par.marshId == 2 && params.model == 'тетива+косоур'){
						holeBasePoint = newPoint_xy(zeroPoint, -wndStepWidth - (33.5 + (params.marshDist - 130)) + techDelta, -params.treadThickness - techDelta);//Подогнано но работает корректно при изменении параметров
					}
					if(params.stairModel == "П-образная с забегом" && par.marshId == 2 && params.model == 'тетивы'){
						holeBasePoint = newPoint_xy(zeroPoint, -wndStepWidth - (45 + (params.marshDist - 130)) + techDelta, -params.treadThickness - techDelta);//Подогнано но работает корректно при изменении параметров
					}
					if(params.stairModel == "П-образная с забегом" && par.marshId == 3){
						holeBasePoint = newPoint_xy(zeroPoint, -wndStepWidth + params.nose + techDelta, -params.treadThickness - techDelta);//Подогнано но работает корректно при изменении параметров
					}
					

					var holePar = {
						basePoint: holeBasePoint,
						height: params.treadThickness + techDelta * 2,
						len: wndStepWidth,
						dxfArr: dxfPrimitivesArr,
						dxfBasePoint: par.dxfBasePoint,
						rad: frontEdgeRad,
						}
					if(par.marshId == 3 && !par.isRearP && stairAmt == 0 ){
						holePar.len = botLineP1.x - holeBasePoint.x -techDelta;
					}
					var slotHole1 = drawHolePath(holePar).path;

					//паз под вторую забежную ступень
					wndStepWidth = par.turnStepsParams[2].stepWidthX - params.stringerSlotsDepth;

					if (params.model == 'тетива+косоур') wndStepWidth += 15;//FIX IT
					holeBasePoint = {
						x: topLineP0.x,
						y: -(h+params.treadThickness + techDelta)
					}
					if(params.stairModel == "П-образная с забегом" && par.marshId == 3 && params.model == 'тетива+косоур'){
						holeBasePoint.x += (params.stringerThickness - params.stringerSlotsDepth) - techDelta;
						wndStepWidth += params.stringerSlotsDepth * Math.tan(par.turnStepsParams[2].angleX) + techDelta * 2;
					}
					if(params.stairModel == "П-образная с забегом" && par.marshId == 3 && params.model == 'тетивы'){
						holeBasePoint.x += (params.stringerThickness - params.stringerSlotsDepth) - techDelta;
						wndStepWidth += params.stringerSlotsDepth + techDelta * 2;
					}
					var holePar = {
						basePoint: holeBasePoint,
						height: params.treadThickness + techDelta * 2,
						len: wndStepWidth + techDelta,
						dxfArr: dxfPrimitivesArr,
						dxfBasePoint: par.dxfBasePoint,
						rad: 0.01,
					}

					var slotHole2 = drawHolePath(holePar).path;
				}
				if (par.botEnd == "площадка") {
					var holeBasePoint = {
						x: topLineP0.x - 0.0,
						y: -params.treadThickness
					}
					var holePar = {
						basePoint: holeBasePoint,
						height: params.treadThickness + techDelta,
						len: stringerTurnLen - params.stringerSlotsDepth + techDelta,
						dxfArr: dxfPrimitivesArr,
						dxfBasePoint: par.dxfBasePoint,
						rad: 0.01,
						}

					if(par.marshId == 3 && !par.isRearP && stairAmt == 0){
						holePar.len = botLineP1.x - holeBasePoint.x - techDelta;
					}

					var slotHole1 = drawHolePath(holePar).path;
				}
			}

		//console.log(slotsTopPoints);
		//console.log(slotsBotPoints);

		var points = {
			topLineP0: topLineP0,
			topLineP9: topLineP9,
			topLineP10: topLineP10,
			topLineP11: topLineP11,
			botLineP9: botLineP9,
			botLineP10: botLineP10,
			bottomLine1: bottomLine1,
			bottomLine2: bottomLine2,
			topLine: topLine,
			botLine: botLine,
			slotsBotPoints: slotsBotPoints,
			slotsTopPoints: slotsTopPoints,
			slotHole1: slotHole1,
			slotHole2: slotHole2,
			}
		}

	return points;

} //end of calcPointsTurnOut_top

/*функция возвращает контур паза под ступень*/

function drawHolePath(par){
	/*
	var holePar = {
		basePoint: holeBasePoint,
		height: params.treadThickness,
		len: params.a1,
		dxfArr
		dxfBasePoint
		rad
		}
		*/
	var slotHole = new THREE.Path(); //контур строится против часовой стрелки

	var p1 =  copyPoint(par.basePoint);	//нижний левый угол
	var p2 = newPoint_xy(p1, par.len, 0);
	// var p3 = newPoint_xy(p2, 0, par.height);
	// var p4 = newPoint_xy(p3, -par.len, 0);
	// 
	// var points = [p1,p2,p3,p4].reverse();
	// //создаем шейп
	// var shapePar = {
	// 	points: points,
	// 	dxfArr: par.dxfArr,
	// 	dxfBasePoint: par.dxfBasePoint,
	// }
	// par.path = drawShapeByPoints2(shapePar).shape;

	addLine(slotHole, par.dxfArr, p1, p2, par.dxfBasePoint);
	p1 = copyPoint(p2);
	p2 =  newPoint_xy(p1, 0, par.height);
	addLine(slotHole, par.dxfArr, p1, p2, par.dxfBasePoint);
	
	p1 = copyPoint(p2);
	p2 =  newPoint_xy(p1, -par.len, 0);
	p3 =  newPoint_xy(p2, 0, -par.height);
	if(par.rad){
		//рассчитываем параметры скругления
		var clockWise = false; //дуга строится против часовой стрелки
		var fil1 = calcFilletParams2(p1, p2, p3, par.rad, clockWise);
		//строим линии и скрулгение
		addLine(slotHole, par.dxfArr, p1, fil1.start, par.dxfBasePoint);
		// addArc(slotHole, par.dxfArr, fil1.center, fil1.rad, fil1.angend, fil1.angstart, par.dxfBasePoint)
		addArc2(slotHole, par.dxfArr, fil1.center, fil1.rad, fil1.angstart, fil1.angend, false, par.dxfBasePoint)
		// addArc2(hole1, dxfPrimitivesArr0, center2, holeWidth / 2, Math.PI, 0, true, dxfBasePoint)
		addLine(slotHole, par.dxfArr, fil1.end, p3, par.dxfBasePoint);
		}
	if(par.rad == 0){
		addLine(slotHole, par.dxfArr, p1, p2, par.dxfBasePoint);
		addLine(slotHole, par.dxfArr, p2, p3, par.dxfBasePoint);
		}
		// console.log(slotHole)
	par.path = slotHole;

	return par;

}//end of drawHolePath

function addNotch(par){
	/*
	функция рассчитывает координаты точек выреза под колонну на нижней линии тетивы/косоура и возвращает массив точек
	par = {
		points //массив точек
		notchCenterX //середина выреза
		width //ширина выреза
		isBotLine //вырез на нижней или на верхней линии косоура/тетивы
		notchDepth //глубина выреза
		}
	*/
  //console.log(par.points[0])
	if(!par.width) par.width = params.rackSize
	if(!par.notchDepth) par.notchDepth = 0;

	//границы выреза
	var notchLeftX = par.notchCenterX - par.width / 2;
	var notchRightX = par.notchCenterX + par.width / 2;

	//вспомогательные точки на левой и правой границе выреза
	var notchLeftP1 = {x: notchLeftX, y: 0};
	var notchLeftP2 = {x: notchLeftX, y: 100};
	var notchRightP1 = {x: notchRightX, y: 0};
	var notchRightP2 = {x: notchRightX, y: 100};

	//сортируем массив в порядке возрастания X
	par.points.sort(function (a, b) {
		var d = a.x - b.x
		if(d == 0) d = a.y - b.y;
		return d;
		});

	//если вырез в начале линии
	if(notchLeftX <= par.points[0].x){
		var p1 = {
			x: par.points[0].x,
			y: par.botY,
		}
		var p2 = {
			x: notchRightX,
			y: par.botY,
		}
		var p3 = itercection(notchRightP1, notchRightP2, par.points[0], par.points[1]);

		par.points.splice(0, 1) //удаляем первую точку
		par.points.unshift(p1);
		par.points.unshift(p2);
		par.points.unshift(p3);
	}
	//если вырез в конце линии
	if(notchRightX >= par.points[par.points.length-1].x){
		//var p1 = newPoint_xy(par.points[par.points.length-1], 0, -par.notchDepth);
		var p1 = {
			x:par.points[par.points.length-1].x,
			y: par.botY,
			}
		var p2 = {
			x: notchLeftX,
			y: par.botY,
			}
		var p3 = itercection(notchRightP1, notchRightP2, par.points[par.points.length-1], par.points[par.points.length-2]);

		//par.points.splice(par.points.length-1, 1) //удаляем последнюю точку
		par.points.pop(); //удаляем последнюю точку
		par.points.push(p3);
		par.points.push(p2);
		par.points.push(p1);
	}

	//если вырез в середине линии
	if(notchLeftX > par.points[0].x && notchRightX < par.points[par.points.length-1].x){
		//находим ближайшую точку перед вырезом
		var p1 = par.points[0];
		var p1_ind = 0;
		for(var i=0; i<par.points.length; i++){
			if(notchLeftX >= par.points[i].x) {
				p1 = par.points[i];
				p1_ind = i;
			}
		}

		var p2 = par.points[p1_ind + 1];

		//вырез полность находится до точки p2
		if(notchRightX <= p2.x){
			var pn1 = itercection(notchLeftP1, notchLeftP2, p1, p2);
			var pn3 = itercection(notchRightP1, notchRightP2, p1, p2);
			}
		//выерез заходит за точку p2
		if(notchRightX > p2.x){
			var p3 = par.points[p1_ind + 2];
			var pn1 = itercection(notchLeftP1, notchLeftP2, p1, p2);
			var pn3 = itercection(notchRightP1, notchRightP2, p2, p3);
			par.points.splice(p1_ind + 1, 1) //удаляем точку р2 из массива
			}
		//рассчитываем вторую точку на дне выреза
		var pn2 = newPoint_xy(pn1, par.width, 0);
		if(par.isBotLine) pn2 = newPoint_xy(pn3, -par.width, 0);
		//если высота дна выреза не задана
		if(!par.botY){
			par.points.splice(p1_ind + 1, 0, pn1, pn2, pn3);
			}
		//если высота дна выреза задана
		if(par.botY){
			var pn0 = copyPoint(pn1);
			pn1.y = par.botY;
			pn2.y = par.botY;
			par.points.splice(p1_ind + 1, 0, pn0, pn1, pn2, pn3);

			}
		}

	//для нижней линии сортируем массив в порядке убывания координаты Х, а если X равнны то Y
	if(par.isBotLine){
		par.points.sort(function (a, b) {
			var d = b.x - a.x
			if(d == 0) d = b.y - a.y;
			return d;
		});
	}

	if(pn0) par.notchLeft = copyPoint(pn0);
	if(pn3) par.notchRight = pn3;
	if (par.notchLeft) par.notchCenterPoint = {x: par.notchCenterX, y: par.notchLeft.y};
	if (par.notchRight) par.notchCenterPoint = {x: par.notchCenterX, y: par.notchRight.y};
	if (!par.notchLeft && !par.notchRight) par.notchCenterPoint = {x: par.notchCenterX, y: 0}

	return par;

}//end of addNotch
