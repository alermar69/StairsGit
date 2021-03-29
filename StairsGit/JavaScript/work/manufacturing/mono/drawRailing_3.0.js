/**Общая функция для расчета положения точек крепления стекла


*/
function calculateGlassPoints(par){
	var marshPar = getMarshParams(par.marshId);
	var marshTurnParams = calcTurnParams(par.marshId);
	var prevMarshPar = getMarshParams(marshPar.prevMarshId);
	var nextMarshPar = getMarshParams(marshPar.nextMarshId);
	var rackPos = setRackPos(par.marshId);
	var glassPoints = [];
	var handrailPoints = [];

	var meterHandrailPar = {
		prof: params.handrailProf,
		sideSlots: params.handrailSlots,
		handrailType: params.handrail,
		metalPaint: params.metalPaint_railing,
		timberPaint: params.timberPaint_perila,
	}
	meterHandrailPar = calcHandrailMeterParams(meterHandrailPar);

	var marshFirstDelta = 0;

	//первая точка марша
	var marshFirst = {
		x: 0,
		y: marshPar.h,
		type: 'first'
	}

	//смещаем начальные координаты стекла, если начало ограждений не с первой ступени
	if (par.marshId == 1 && params.railingStart !== "0") {
		marshFirst.x += marshPar.b * params.railingStart;
		marshFirst.y += marshPar.h * params.railingStart;
	}

	//смещаем начальные координаты стекла, чтобы вертикальный поручень нижнего марша был заподлицо со ступенью
	if (par.marshId == 1 && params.startVertHandrail == "есть") {
		marshFirst.x += 45;
	}

	if(marshPar.botTurn == "площадка" && par.key == "in"){
		marshFirstDelta = params.nose + (60 - par.handrailSlotDepth);
		//marshFirstDelta += 60 - par.handrailSlotDepth
		//if(params.handrail != "нет"){
		//	marshFirstDelta += 60 - par.handrailSlotDepth + 5;
		//}
	}

	if(marshPar.botTurn == "забег" && par.key == "in"){
		marshFirstDelta += 5;
		if(params.handrail != "нет"){
			marshFirstDelta += 60 - par.handrailSlotDepth;
		}
	}

	marshFirst = newPoint_xy(marshFirst, marshFirstDelta, marshPar.ang * marshFirstDelta);
	//marshFirst = newPoint_x1(marshFirst, marshFirstDelta, marshPar.ang);

	if (marshPar.botTurn == 'пол') {
		marshFirst.y += 20;
	}
	

	if(par.key == 'out' && marshPar.botTurn !== 'пол'){
		marshFirst.x = -marshPar.b * 0.5;
		marshFirst.y = marshPar.h * 0.5;
		if (marshPar.botTurn == "площадка" && par.key == 'out') marshFirst.y += 20;
	}
	var handrailPoint = copyPoint(marshFirst);
	if(par.key == 'out' && marshPar.botTurn !== 'пол'){
		handrailPoint = polar(handrailPoint, marshPar.ang, -10);
	}

	// если есть вертикальный поручень добавляем первую нижнюю точку
	if (params.handrailFixType == "паз") {
		if (par.marshId == 1 && params.startVertHandrail == "есть") {
			var startPoint = {
				x: marshFirst.x,
				y: -par.sectionHeight,
			}
			handrailPoints.push(startPoint);
		}
		if (marshPar.botTurn == 'забег' && par.key == 'in') {
			var startPoint = newPoint_xy(marshFirst, 0, -(par.sectionHeight + params.treadThickness + marshPar.h * 3));
			startPoint.y -= marshFirstDelta * marshPar.ang;
			if (prevMarshPar.hasRailing.in) startPoint.y -= prevMarshPar.h * 2;
			startPoint.isTurnRackBasePoint = true;
			handrailPoints.push(startPoint);
		}
		if (marshPar.botTurn == 'площадка' && par.key == 'in') {
			var startPoint = newPoint_xy(marshFirst, 0, -par.glassHeight);
			if (prevMarshPar.hasRailing.in && params.stairModel !== "П-образная с площадкой") startPoint.y = -par.sectionHeight - prevMarshPar.h * 2 - 15;
			handrailPoints.push(startPoint);
		}
	}

	handrailPoints.push(handrailPoint);

	glassPoints.push(marshFirst)

	//последняя точка марша

	var lastMarshPoint = {
		x: marshPar.stairAmt * marshPar.b,
		y: marshPar.h * (marshPar.stairAmt + 1),
	};
	if (marshPar.topTurn == 'пол') {
		lastMarshPoint.x += 60;
	}
	lastMarshPoint = itercection(marshFirst, polar(marshFirst, marshPar.ang, 100), lastMarshPoint, polar(lastMarshPoint, Math.PI/2, 100))
	if(par.marshId == 2 && params.stairModel == 'П-образная с забегом' && par.key == 'out') {
		lastMarshPoint = {
			x: 0,
			y: 0,//marshPar.h + marshPar.h_topWnd,
		};
	}

	var handrailPoint = copyPoint(lastMarshPoint);	
	
	// стыковка с вертикальным поручнем следующей секции на внутренней стороне марша
	if (par.key == 'in' && marshPar.topTurn !== 'нет' && !marshPar.lastMarsh) {
		//поручень сдвинут на 5мм относительно края ступени
		var deltaX = 5; //marshTurnParams.pltExtraLen - par.treadOffset - par.glassThickness - 20;
		/*
		if (nextMarshPar.hasRailing.in) {
			deltaX = 60 - marshTurnParams.pltExtraLen;
			if (~params.stairModel.indexOf("Г-образная") || params.stairModel == 'П-образная трехмаршевая')
				deltaX -= par.handrailSlotDepth / 2;
		}
		//if (nextMarshPar.hasRailing.in) deltaX = - params.nose + marshTurnParams.pltExtraLen - 40;
		*/
		handrailPoint = newPoint_xy(lastMarshPoint, deltaX, Math.tan(marshPar.ang) * deltaX);
		
		/*
		//Стекло с нижнего марша не вставляется в вертикальный поручень, поэтому лучше там сделать технологический зазор в 5мм.
		if (nextMarshPar.hasRailing.in) lastMarshPoint = newPoint_x1(lastMarshPoint, -5, marshPar.ang);
		*/
	}
/*
	if((par.key == "out" || (par.key == 'in' && marshPar.lastMarsh)) && marshPar.topTurn !== 'пол'){
		handrailPoint.x += marshPar.b * 0.5;
		handrailPoint.y += marshPar.h * 0.5;
	}	
/*
//коррекция последней точки поручня
	if (marshPar.stairAmt > 0 && !marshPar.lastMarsh) {
		var ang = calcAngleX1(handrailPoints[handrailPoints.length - 1], handrailPoint);
		if (par.key == 'out' && marshPar.topTurn !== 'пол'){
			handrailPoint = polar(handrailPoint, ang, -10);
		}
		if (params.startVertHandrail == "есть" && params.handrailFixType == "паз" && params.handrailEndType == 'под углом') {			
			handrailPoint = polar(handrailPoint, ang, (meterHandrailPar.profY) * Math.tan(ang));
		}

		if (params.handrailEndType == 'под углом' && !(par.key == 'out' && marshPar.topTurn !== 'пол')) {
			if (params.handrailFixType !== "паз") {
				handrailPoint = polar(handrailPoint, ang, 40);	
			}
		}
	}
*/
	//центральные точки марша
	for (var i = 0; i < rackPos.length; i++) {
		var prevPosition = parseInt(rackPos[i] - 1);
		let xDelta = marshPar.a / 2;
		var pt = {
			x: prevPosition * marshPar.b + xDelta,
			y: marshPar.h * rackPos[i] + (xDelta) * Math.tan(marshPar.ang),
		};
		glassPoints.push(itercection(marshFirst, lastMarshPoint, pt, polar(pt, Math.PI / 2, 100)));
	}
/*
	if (par.key == 'in' && marshPar.topTurn == 'пол' && params.handrailFixType == "паз") {
		handrailPoint = polar(handrailPoint, marshPar.ang, 50);
	}
*/	
	if(!(params.stairModel == 'П-образная с забегом' && par.marshId == 2)) handrailPoints.push(handrailPoint);
	glassPoints.push(lastMarshPoint);

	// если есть вертикальный поручень добавляем последнюю нижнюю точку
	if (params.handrailFixType == "паз") {
		var isShiftLastMarshPoint = false;
		if (par.key == 'in') {
			if (!marshPar.lastMarsh) {
				if (params.stairModel == "П-образная с забегом" || params.stairModel == "П-образная с площадкой") {
					isShiftLastMarshPoint = true;
				}
				else if (!nextMarshPar.hasRailing.in) {
					isShiftLastMarshPoint = true;
				}
			}
		}
		
		//не делаем последний вертикальный участок
		if (marshPar.topTurn == 'пол' && params.startVertHandrail == "есть") isShiftLastMarshPoint = false;

		if (isShiftLastMarshPoint) {
			handrailPoints.pop();
			handrailPoint = newPoint_xy(lastMarshPoint, -29, -29 * Math.tan(marshPar.ang));
			if (params.stairModel == "П-образная с площадкой" && !marshPar.lastMarsh) {
				handrailPoint = newPoint_xy(handrailPoint, -50, -50 * Math.tan(marshPar.ang));
			}
			if (params.stairModel == "П-образная с забегом" && !marshPar.lastMarsh) {
				handrailPoint = newPoint_xy(lastMarshPoint, -40, -40 * Math.tan(marshPar.ang));
			}
			handrailPoints.push(handrailPoint);

			//нижняя точка вертикального поручня
			handrailPoint = newPoint_xy(handrailPoint, 0, - par.glassHeight);
			handrailPoints.push(handrailPoint);
		}
	}
	

	//Верхний забег
	if(marshPar.topTurn == "забег" && par.key == "out" && !marshPar.lastMarsh){
		var topLast = {
			x: lastMarshPoint.x + marshTurnParams.turnLengthTop + 10 - marshPar.b * 0.5,
			y: lastMarshPoint.y + marshPar.h_topWnd
		};		
		var ang = calcAngleX1(handrailPoints[handrailPoints.length - 1], topLast);
		if (params.handrailFixType == "паз") topLast = polar(topLast, ang, -meterHandrailPar.profY * Math.tan(ang));
		var handrailPoint = copyPoint(topLast);
		//Укорачиваем поручень на стыке
		if (params.handrailFixType !== "паз") handrailPoint = polar(topLast, ang, -100);
		if (params.handrailFixType == "паз") handrailPoint = polar(topLast, ang, -5);

		if(par.marshId == 2 && params.stairModel == 'П-образная с забегом' && par.key == 'out') {
			handrailPoint.y += marshPar.h_topWnd;
			topLast.y += marshPar.h_topWnd;
		}

		handrailPoints.push(handrailPoint);
		glassPoints.push(topLast);
	}
	//Нижний забег
	if (marshPar.botTurn == "забег" && par.key == "out") {
		var botFirst = {
			x: -params.M + 15,
			y: -marshPar.h * 0.5,
		};
		var ang = calcAngleX1(botFirst, handrailPoints[0]);

		if (params.handrailFixType == "паз") botFirst = polar(botFirst, ang, meterHandrailPar.profY * Math.tan(ang));
		if(par.marshId == 2 && params.stairModel == 'П-образная с забегом' && par.key == 'out') botFirst.x -= params.marshDist;
		glassPoints.push(botFirst);
		
		var handrailPoint = copyPoint(botFirst);
		//Укорачиваем поручень на стыке
		if (params.handrailFixType !== "паз") handrailPoint = polar(botFirst, ang, 80);
		if (params.handrailFixType == "паз") handrailPoint = polar(botFirst, ang, 10);
		
		handrailPoints.unshift(handrailPoint);
	}


	//нижняя площадка
	if (marshPar.botTurn == 'площадка') {
		var pltLength = par.platformLengthBottom - 60 - marshPar.b * 0.5;
		if (params.stairModel == "П-образная с площадкой" && params.backRailing_1 == 'есть') {
			pltLength += 10;
		}
		var pltGlassAmt = Math.ceil(pltLength / 1000);
		var glassLenX = pltLength / pltGlassAmt;
		var point = null;
		for (var i = 1; i <= pltGlassAmt; i++) {
			point = {
				x: -marshPar.b * 0.5 - glassLenX * i,
				y: marshPar.h * 0.5 + 20,
			}
			glassPoints.push(point);
		}
		if (point) {
			handrailPoints.unshift(point);//Укорачиваем поручень на стыке
		}
	}
	//верхняя площадка
	if(marshPar.topTurn == 'площадка'){
		var pltLength = par.platformLengthTop - marshPar.b / 2 + 45 + 60;
		var pltGlassAmt = Math.ceil(pltLength / 1000);
		var glassLenX = pltLength / pltGlassAmt;
		if(marshPar.lastMarsh){
			glassLenX -= 45 / pltGlassAmt
		}
		var point = null;
		for (var i = 1; i <= pltGlassAmt; i++){
			point = {
				x: lastMarshPoint.x + glassLenX * i,
				y: lastMarshPoint.y,
			}
			glassPoints.push(point);
		}
		if(point){
			handrailPoints.push(newPoint_xy(point, 30, 0));//Удлинняем поручень до края площадки
			if (params.stairModel == "П-образная с площадкой" && par.marshId == 1 && params.backRailing_1 == 'есть') {
				glassPoints.pop();
				handrailPoints.pop();
				var pt = {
					x: marshPar.b * marshPar.stairAmt + params.platformLength_1 + 60,
					y: marshPar.h * (marshPar.stairAmt + 1) + marshPar.h / 2 + 20,
				}
				glassPoints.push(pt);
				handrailPoints.push(newPoint_xy(pt, 3.6, 0));
			}
		}		
	}
	
	
	//заднее ограждение верхней площадки
	if(par.marshId == "topPlt"){
		glassPoints = [];
		var p1 = {x: -params.M / 2, y:0,}
		var p2 = newPoint_xy(p1, params.M + 10, 0);
		
		glassPoints.push(p1, p2)
	
	}	
	//marshId: "topPlt"

	//заднее ограждение промежуточной площадки
	if (par.key == "rear" && par.marshId == 2) {
		glassPoints = [];
		handrailPoints = [];
		var p1 = { x: 0, y: 0, }
		if (nextMarshPar.hasRailing.out) p1.y = nextMarshPar.h * 0.5 + 20;
		if (prevMarshPar.hasRailing.out) p1.y = prevMarshPar.h * 0.5 + 20;

		glassPoints.push(p1)
		handrailPoints.push(p1)

		var pltLength = params.M * 2 + params.marshDist + 10;
		var pltGlassAmt = Math.ceil(pltLength / 1000);
		var glassLenX = pltLength / pltGlassAmt;
		var point = null;
		for (var i = 1; i <= pltGlassAmt; i++) {
			point = {
				x: p1.x + glassLenX * i,
				y: p1.y,
			}
			glassPoints.push(point);
		}
		if (point) {
			handrailPoints.push(point);//Удлинняем поручень до края площадки
		}

	}

	glassPoints.sort(function (a, b){
		return a.x - b.x;
	});

	var finalGlassPoints = [];
	for (var i = 0; i < glassPoints.length - 1; i++){
		let point = glassPoints[i];
		let nextPoint = glassPoints[i + 1];
		var pt = {
			x: point.x,
			y: point.y,
			len: nextPoint.x - point.x - 10,
			ang: calcAngleX1(point, nextPoint),
		}
		//if (params.handrailFixType !== "паз") pt.len -= 10;
		finalGlassPoints.push(pt);
	}

	par.handrailPoints = handrailPoints;


	//удаляем некорректные точки из массива - костыль
	for (var i = 0; i < finalGlassPoints.length; i++) {
		if (finalGlassPoints[i].len < 100) finalGlassPoints.splice(i, 1)
	}

	par.marshPar = marshPar;
	par.marshTurnParams = marshTurnParams;
	par.prevMarshPar = prevMarshPar;
	par.nextMarshPar = nextMarshPar;
	par.glassPoints = finalGlassPoints;
}

function calcWndHoles(par, placeMod){
	if(!placeMod) var placeMod = 'top';
	var placeFactor = placeMod == 'top' ? 1 : -1;
	var marshTurnParams = calcTurnParams(par.marshId);
	var nextpar = getMarshParams(par.nextMarshId);
	var stepH = placeMod == 'top' ? nextpar.h : par.h;
	var startPoint = { // todo: взять точку из calculateGlassPoints
		x: par.stairAmt * par.b + par.b * 0.5,
		y: par.h * (par.stairAmt + 1),
	};
	var pltHoleOffsetX = 50; // отступ отверстия от края стекла
	var pltLength = placeMod == 'top' ? marshTurnParams.turnLengthTop + 10 : params.M;
	if(placeMod == 'bot'){ //корректируем положение для рассчета нижнего поворота
		startPoint.x = -(10 + par.b * 0.5);
		startPoint.y = -stepH * 2;
		pltLength -= par.b * 0.5;
	}
	var center1 = newPoint_xy(startPoint, pltHoleOffsetX * placeFactor, -par.treadOffset);
	var center2 = newPoint_xy(startPoint, (pltLength - 135 - pltHoleOffsetX) * placeFactor, stepH - par.treadOffset);
	if(placeMod == 'bot'){ //корректируем положение для рассчета нижнего поворота
		center1.y += stepH * 2;
		center2 = newPoint_xy(startPoint, (pltLength - 65) * placeFactor, stepH - par.treadOffset);
	};
	var center3 = newPoint_xy(center1, 0, -par.holderHoleDist);
	var center4 = newPoint_xy(center2, 0, -par.holderHoleDist);

	center3.hasHolder = center4.hasHolder = true;
	center3.holderType = center4.holderType = 'oneSideCenter';
	//сдвоенный кронштейн на последнем стекле если есть стыковка со следующей секцией
	if(par.topConnection) center4.holderType = 'corner';
	if (!par.topConnection) {
		center2.x -= 30;
		center4.x -= 30;
	}
	if(par.botConnection && placeMod == 'bot') center4.hasHolder = false;

	par.holes.push(center1);
	par.holes.push(center2);
	par.holes.push(center3);
	par.holes.push(center4);
}

function calcPltHoles(par, placeMod){
	if(!placeMod) var placeMod = 'top';
	var placeFactor = placeMod == 'top' ? 1 : -1
	var startPoint = { // todo: взять точку из calculateGlassPoints
		x: par.stairAmt * par.b + par.b * 0.5,
		y: par.h * (par.stairAmt + 1),
	};
	var marshTurnParams = calcTurnParams(par.marshId);
	var pltLength = placeMod == 'top' ? par.platformLengthTop : par.platformLengthBottom - par.b * 0.5;
	if(placeMod == 'bot'){ //корректируем положение для рассчета нижнего поворота
		startPoint.x = -(10 + par.b * 0.5);//FIXME
		startPoint.y = 0;
		pltLength -= 60;//+par.b * 0.5;//FIXME
	}
	if(placeMod == 'top'){
		pltLength = par.platformLengthTop - par.b / 2 + 45;
	}
	if(placeMod == "rear"){
		pltLength = params.M;
		if (par.marshId == 2) pltLength = params.M * 2 + params.marshDist;
		}
	var pltGlassAmt = Math.ceil(pltLength / 1000);
	var glassLenX = pltLength / pltGlassAmt;
	if(par.lastMarsh && placeMod == 'top'){
		glassLenX -= 45 / pltGlassAmt
	}
	
	//заднее ограждение верхней площадки или промежуточной П-образной лестницы
	if(placeMod == "rear"){
		startPoint = {
			x: -params.M / 2,
			y: 0,
		};
		if (par.marshId == 2) startPoint.x = 0;
		placeFactor = 1
		}
		
	var pltHoleOffsetX = 50; // отступ отверстия от края стекла
	for (var i = 0; i < pltGlassAmt; i++){
		var glassBasePoint = newPoint_xy(startPoint, placeFactor * glassLenX * i, -par.treadOffset);
		var center1 = newPoint_xy(glassBasePoint, pltHoleOffsetX * placeFactor, 0);
		var center2 = newPoint_xy(glassBasePoint, (glassLenX - pltHoleOffsetX) * placeFactor, 0);
		if(pltGlassAmt > 1 && placeMod == 'top' && i < pltGlassAmt - 1) center2.x -= 10; //корректируем положение для рассчета нижнего поворота
		var center3 = newPoint_xy(center1, 0, -par.holderHoleDist);
		var center4 = newPoint_xy(center2, 0, -par.holderHoleDist);

		center3.hasHolder = center4.hasHolder = true;
		center3.holderType = center4.holderType = 'oneSideCenter';

		//сдвоенный кронштейн на последнем стекле если есть стыковка со следующей секцией
		//if(par.topConnection && i == pltGlassAmt - 1) center2.holderType = 'corner';
		if(par.topConnection && i == pltGlassAmt - 1) center4.holderType = 'corner';
		if (par.botConnection && placeMod == 'bot' && i == pltGlassAmt - 1) {
			center4.hasHolder = false;
			if (params.stairModel == "П-образная с площадкой") {
				center4.hasHolder = true;
				center4.holderType = 'corner';
			}
		}
		
		//наличие кронштейнов на заднем ограждении если есть сдвоенный кронштейн на углу
		if(placeMod == "rear"){
			if(params.topPltRailing_4) center3.hasHolder = false;
			if(params.topPltRailing_3) center4.hasHolder = false;
		}

		//наличие кронштейнов на заднем ограждении промежуточной площадки если есть сдвоенный кронштейн на углу
		if (placeMod == "rear" && par.marshId == 2) {
			if (getMarshParams(par.prevMarshId).hasRailing.out && i == 0) center3.hasHolder = false;
			if (getMarshParams(par.nextMarshId).hasRailing.out && i == pltGlassAmt - 1) center4.hasHolder = false;
		}
		

		par.holes.push(center1);
		par.holes.push(center2);
		par.holes.push(center3);
		par.holes.push(center4);
	}
}



function calcGlassHoles(marshId, key){
	var par = getMarshParams(marshId);
	par.marshId = marshId;
	par.key = key;

	var prevpar = getMarshParams(par.prevMarshId);
	var nextpar = getMarshParams(par.nextMarshId);
	var marshTurnParams = calcTurnParams(par.marshId);
	var holeOffset = 25;
	var treadOffset = par.treadOffset = params.treadThickness / 2;// - 10;
	var holderHoleDist = par.holderHoleDist = 150;
	setRailingParams(par);
	par.holes = [];


	//верхний поворот площадка

	if(par.topTurn == 'площадка'){
		calcPltHoles(par, 'top');
	}
	if(par.botTurn == 'площадка'){
		calcPltHoles(par, 'bot');
	}
	if(par.topTurn == 'забег'){
		calcWndHoles(par, 'top');
	}
	if(par.botTurn == 'забег'){
		calcWndHoles(par, 'bot');
	}
	// Рассчет отверстий марша
	var index = 1;
	if (marshId == 1 && params.railingStart !== "0") index += +params.railingStart;//если начало ограждений не с первой ступени
	for (var i = index; i < par.stairAmt + 1; i++){ //Все остальные отверстия марша
		// if(i !== par.stairAmt + 1){
		par.holes.push({
			x: par.b * (i - 1) + par.a - holeOffset,
			y: par.h * i - treadOffset
		});
		if (par.topTurn == 'пол' && i == par.stairAmt && params.lastRiser == 'есть') {
			par.holes[par.holes.length - 1].x -= 40;
		}
		par.holes.push({
			x: par.b * (i - 1) + holeOffset,
			y: par.h * i - treadOffset
		});
		// }
	}

	if(marshId == "topPlt"){
		par.holes = [];
		calcPltHoles(par, 'rear');
	}
	if (key == "rear" && marshId == 2) {
		par.holes = [];
		calcPltHoles(par, 'rear');
	}
	
	return par;
} //end of calcGlassHoles

/** функция отрисовывает секцию ограждения лестницы с самонесущим стеклом 
**/

function drawGlassSectionMono(par){

	var section = new THREE.Object3D();
	var handrails = new THREE.Object3D();
	
	/** Задаем параметры для рассчета стекол */


	par.glassThickness = 12;
	var holeRad = 11;

	//рассчитываем необходимые параметры и добавляем в объект par
	setRailingParams(par) //функция в файле calcRailingParams.js
		
	var marshPar = getMarshParams(par.marshId);
	var nextMarshPar = getMarshParams(marshPar.nextMarshId);
	var prevMarshPar = getMarshParams(marshPar.prevMarshId);
	
	var glassThickness = par.glassThickness;
	var glassOffsetY = par.glassOffsetY = marshPar.h * 2;
	var rackProfile = 40;


	var sectionHeight = params.glassHeight;

	if (par.marshId == "topPlt") {
		glassOffsetY = par.glassOffsetY = 270;
		sectionHeight += 90;
		par.glassOffsetZ = par.glassOffsetZ;
	}
	if (par.key == "rear" && par.marshId == 2) {
		if (!(prevMarshPar.hasRailing.out || nextMarshPar.hasRailing.out)) {
			glassOffsetY = par.glassOffsetY = 140 + params.treadThickness;
			sectionHeight += 90;
		}

		par.glassOffsetZ = par.glassOffsetZ;
	}

	
	sectionHeight -= glassOffsetY;

	par.sectionHeight = sectionHeight;
	par.glassHeight = sectionHeight + glassOffsetY;	
	
	calculateGlassPoints(par);

	if(params.turnSide == 'левое'){
		par.glassOffsetZ *= -1;
	}
	if((par.key == 'in' && params.stairModel !== "Прямая") || (par.key == 'out' && params.stairModel == "Прямая")){
		if(params.turnSide == 'левое') par.glassOffsetZ -= glassThickness;
	}
	if((par.key == 'out' && params.stairModel !== "Прямая") || (par.key == 'in' && params.stairModel == "Прямая")){
		if(params.turnSide == 'левое'){
			par.glassOffsetZ = - par.glassOffsetZ;
		} else {
			par.glassOffsetZ = - glassThickness - par.glassOffsetZ;
		}
	}

	var holes = calcGlassHoles(par.marshId, par.key).holes;
	for (var i = 0; i < par.glassPoints.length; i++){
		var filteredHoles = [];
		for (var j = 0; j < holes.length; j++){
			var hole = Object.assign({}, holes[j]);
			if(hole.x < par.glassPoints[i].x + par.glassPoints[i].len && hole.x > par.glassPoints[i].x){
				hole.x -= par.glassPoints[i].x;
				hole.y -= par.glassPoints[i].y;
				hole.y += glassOffsetY;
				if(hole.x < 40 + holeRad && par.glassPoints[i].x >= 0){
					hole.x += 40 + holeRad - hole.x;
				}
				hole.rad = holeRad;
				//if(hole.x + 40 + holeRad > par.glassPoints[i].len && !hole.hasHolder){
				// 	hole.x -= (40 + holeRad) - par.glassPoints[i].len - hole.x;
				// }
				if (params.treadPlatePockets !== "нет") {
					hole.y -= 5;
					if (hole.hasHolder) hole.y -= 10;
				}
				filteredHoles.push(hole);
			}
		}

		var glassPar = {
			angleTop: par.glassPoints[i].ang,
			// angleBot: 0, //par.glassPoints[i].ang,
			heightLeft: sectionHeight + glassOffsetY,
			width: par.glassPoints[i].len,
			thk: glassThickness,
			holeCenters: filteredHoles,
			key: par.key,
			side: par.marshPar.side[par.key],
		}
		if (i == 0 && par.marshPar.botTurn == 'пол'){
			if (par.glassPoints[0].y < glassOffsetY)
				glassPar.botCutHeight = glassOffsetY - par.marshPar.h;
		}

		//коррекция последнего стекла последнего марша
		if (par.marshPar.topTurn == 'пол' && i == (par.glassPoints.length - 1)){
			//уменьшение длины стекла
			if(params.topGlassExtraLength < 0){
				glassPar.width += params.topGlassExtraLength;
			}
			
			//увеличение длины стекла с вырезом под верхнее перекрытие
			if (params.topGlassExtraLength > 0) {
				glassPar.hasTopOverlap = true;
				glassPar.extraLengthOverlap = (params.topGlassExtraLength) / Math.cos(marshPar.ang);
				glassPar.overlapCutHeight = -marshPar.h + sectionHeight + par.glassPoints[0].y - (par.glassPoints[0].x - params.nose) * Math.tan(glassPar.angleTop) - 10;
			}
			
			//горизонтальный срез сверху
			if(params.handrailEndHor == "да") glassPar.topCutHeight = -params.handrailEndHeight
		}
			
		glassPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, par.glassPoints[i].x, par.glassPoints[i].y);
		var glass = drawGlass2(glassPar).mesh;
		glass.position.x = par.glassPoints[i].x;
		glass.position.y = par.glassPoints[i].y - glassOffsetY;
		glass.position.z = par.glassOffsetZ;
		section.add(glass);

		//отрисовка сварных кронштейнов
		
		for (var j = 0; j < glassPar.holeCenters.length; j++){
			if(glassPar.holeCenters[j].hasHolder){
				var holderPosition = newPoint_xy(glass.position, glassPar.holeCenters[j].x, glassPar.holeCenters[j].y);
				var anglePar = {
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, holderPosition.x, holderPosition.y),
					dxfPrimitivesArr: dxfPrimitivesArr,
					type: glassPar.holeCenters[j].holderType
				}
				if (params.stairModel == "П-образная с площадкой" && par.marshId == 3 && anglePar.type == 'corner') {
					anglePar.isRotation = true;
				}
				var holderMesh = drawGlassAngle2(anglePar).mesh;
				holderMesh.position.x = holderPosition.x;
				holderMesh.position.y = holderPosition.y;
				holderMesh.position.z = 0;//glassThickness;

				var rutelPar = {
					size: 10
				};
				var rutel = drawGlassRutel(rutelPar);
				rutel.position.x = holderPosition.x;
				rutel.position.y = holderPosition.y;
				rutel.position.z = (50 - 15) * turnFactor;
				rutel.rotation.x = -Math.PI / 2;
				section.add(rutel);
				
				var marshPar = getMarshParams(par.marshId);
				var side = marshPar.side[par.key];
				
				if(side == 'left'){
					holderMesh.position.z -= 20 + 8 + 0.01; //подогнано
				}
				
				if(side == 'right' || par.marshId == "topPlt"){
					holderMesh.rotation.y = Math.PI;
					holderMesh.position.z += 20 + 8 + 0.01; //подогнано
				}
				if (par.key == "rear" && par.marshId == 2) {
					holderMesh.rotation.y = Math.PI;
					holderMesh.position.z += 20 + 8 + 0.01; //подогнано
				}
				
				
				section.add(holderMesh);
			}
		}
	}
	
	
	//сохраняем массив точек в отдельную переменную
	var handrailPoints0 = par.handrailPoints;

	//поручни
	if(params.handrail != "нет"){
		var handrailParams = {
			points: par.handrailPoints,
			side: par.railingSide,
			offset: 15,
			extraLengthStart: 10,
			extraLengthEnd: 10,
			connection: params.handrailConnectionType,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, sectionHeight + glassOffsetY),
			fixType: params.handrailFixType,
			sectText: '',
			isGlassHandrail: true,
			marshId: par.marshId
		}

		

		var meterHandrailPar = {
			prof: params.handrailProf,
			sideSlots: params.handrailSlots,
			handrailType: params.handrail,
			metalPaint: params.metalPaint_railing,
			timberPaint: params.timberPaint_perila,
		}
		meterHandrailPar = calcHandrailMeterParams(meterHandrailPar);


		if (params.startVertHandrail == "есть" && params.handrailFixType == "паз") {
			handrailParams.extraLengthEnd = 0;
		}

		//удлиннение поручня в конце
		
		//последний марш
		if (marshPar.lastMarsh) {
			if(params.handrailEndHor != "да") handrailParams.extraLengthEnd += params.topHandrailExtraLength;
			//удлиннение последнего стекла
			handrailParams.extraLengthEnd += params.topGlassExtraLength / Math.cos(marshPar.ang);
		}
		else{
			//стыковка с вертикальным поручнем следующего марша
			handrailParams.extraLengthEnd += par.glassDist / Math.cos(marshPar.ang);
		}
		
		//компенсируем наклонный срез поручня
		if (params.handrailFixType == "паз" && params.handrailEndType == 'под углом' && !(marshPar.lastMarsh && params.handrailEndHor == "да")) {
			handrailParams.extraLengthEnd += meterHandrailPar.profY * Math.tan(marshPar.ang)// par.handrailSlotDepth;
		}

		if (par.key == 'rear' && par.marshId == 2) {
			if (prevMarshPar.hasRailing.out)handrailParams.extraLengthEnd = par.glassOffsetZ + glassThickness / 2 + meterHandrailPar.profZ / 2;
			if (nextMarshPar.hasRailing.out)handrailParams.extraLengthStart = par.glassOffsetZ + glassThickness / 2 + meterHandrailPar.profZ / 2;
		}

/*
		// делаем стык поручня с поворотной стойкой под углом
		if (par.key == 'in' && marshPar.topTurn !== 'нет' && !marshPar.lastMarsh) {
			if (~params.stairModel.indexOf("Г-образная") || params.stairModel == 'П-образная трехмаршевая')
				if (nextMarshPar.hasRailing.in) {
					handrailParams.points[handrailParams.points.length - 1] = polar(handrailParams.points[handrailParams.points.length - 1],marshPar.ang,meterHandrailPar.profY * Math.tan(marshPar.ang))
					handrailParams.isHandrailEndAng = true; // верхний конец поручня под углом
				}
		}
*/

		handrailParams = drawPolylineHandrail(handrailParams);
		var handrail = handrailParams.mesh;
		handrail.position.y = sectionHeight;

		if (params.handrailFixType == "паз") { //40 ширина поручня
			var key = par.key;
			if (params.stairModel == "Прямая") {
				if (par.key == 'in') key = 'out';
				if (par.key == 'out') key = 'in';
			}

			if(key == 'out') handrail.position.z = (par.glassOffsetZ + glassThickness / 2) - 50; // 50 - подогнано
			if(key == 'in') handrail.position.z = (par.glassOffsetZ - 10) + 40 + 20 + glassThickness / 2;
			if (key == 'rear' && par.marshId == 2) handrail.position.z = -30 - meterHandrailPar.profZ / 2 + par.glassOffsetZ + glassThickness / 2;
			if(params.turnSide == 'левое'){
				if(key == 'in') handrail.position.z = (par.glassOffsetZ + glassThickness / 2) - 50; // 50 - подогнано
				if(key == 'out') handrail.position.z = ((par.glassOffsetZ - 10) + 40 + 20 + glassThickness / 2);
			}
			
		}
		
		handrails.add(handrail);

		if(key == 'in' && marshPar.botTurn == 'забег') {
			var startPoint = handrailPoints0.find( function(p){return p.isTurnRackBasePoint});
			if (startPoint) {
				var screwPar = {
					id: "screw_5x90",
					description: "Крепление ограждения к ступени",
					group: "Ограждения",
					timberPlugDiam: 12
				}

				var pos = newPoint_xy(startPoint, handrail.position.x - 15, handrail.position.y + params.treadThickness / 2);
				pos.z = 20 * turnFactor;

				var hasPrevRailing = false;
				if (par.marshId > 1) {
					var prevMarshPar = getMarshParams(marshPar.prevMarshId);
					if (prevMarshPar.hasRailing.in) hasPrevRailing = true;
				}

				if (hasPrevRailing) {
					pos.y += marshPar.h
					var screw = drawScrew(screwPar).mesh;
					screw.rotation.z = Math.PI / 2;
					screw.position.x = pos.x + 10;
					screw.position.y = pos.y;
					screw.position.z = pos.z;
					handrails.add(screw);
					pos.y += marshPar.h;
				}

				var screw = drawScrew(screwPar).mesh;
				screw.rotation.z = Math.PI / 2;
				screw.position.x = pos.x + 10;
				screw.position.y = pos.y;
				screw.position.z = pos.z;
				handrails.add(screw);

				pos.y += marshPar.h;
				var screw = drawScrew(screwPar).mesh;
				screw.rotation.z = Math.PI / 2;
				screw.position.x = pos.x + 10;
				screw.position.y = pos.y;
				screw.position.z = pos.z;
				handrails.add(screw);
				
				pos.y += marshPar.h_topWnd;
				var screw = drawScrew(screwPar).mesh;
				screw.rotation.x = -Math.PI / 2 * turnFactor;
				screw.position.x = pos.x;
				screw.position.y = pos.y;
				screw.position.z = pos.z;
				handrails.add(screw);

				pos.y += marshPar.h_topWnd;
				var screw = drawScrew(screwPar).mesh;
				screw.rotation.x = -Math.PI / 2 * turnFactor;
				screw.position.x = pos.x;
				screw.position.y = pos.y;
				screw.position.z = pos.z;
				handrails.add(screw);
			}
		}

	} //конец поручней
	
	//сохраняем данные для расчета цены монтажа (испольуются в calcAssemblingWage)
	if (typeof railingParams != 'undefined' && typeof handrailPoints0 != 'undefined') {
		if (!railingParams.sections) {
			railingParams.sections = {
				types: [],
				sumLen: 0,
			}
		}
		for(var i=1; i<handrailPoints0.length; i++){
			var sectLen = distance(handrailPoints0[i-1], handrailPoints0[i]);
			//все участки, кроме вертикальных
			if(handrailPoints0[i].x - handrailPoints0[i-1].x > 100){
				railingParams.sections.types.push(sectLen);
				railingParams.sections.sumLen += sectLen / 1000;
			}
			
		}
	}

	var result = {
		mesh: section,
		handrails: handrails,
	}
	return result;
}

//кронштейны для самонесущего стекла
function drawGlassAngle2(par){
	var glassAngleMaterial = new THREE.MeshLambertMaterial({
		color: 0xFF0000
	});
	var dxfBasePoint = par.dxfBasePoint;
	var dxfPrimitivesArr = par.dxfPrimitivesArr;
	var type = par.type;

	var thk = 8;
	var frontEdgeRad = 10;

	//ширина, высота части прилегающей к стеклу
	var bw1 = 100;
	var bh1 = 190;
	var smallDiam1 = 13;
	var smallCenterTopOffset1 = 20;
	var bigDiam1 = 60;

	//ширина, высота части прилегающей к площадке
	var bw2 = bw1 - 2 * thk;
	var bh2 = 150 - thk;
	var smallDiam2 = 9;
	var smallCenterOffset2 = 15;

	//ширина, высота треугольных частей
	var bw3 = bh2;
	var bh3 = bh1 - params.treadThickness;
	var bigDiam3 = 60;
	var bigCenterTopOffset3 = bh1 / 2 - params.treadThickness;
	var bigCenterLeftOffset3 = 40;

	var glassAngleObject = new THREE.Object3D();

	var extrudeOptions = {
		amount: thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	if(type == "oneSideCenter" || type == "oneSideEdge"){
		//отрисовка части прилегающей к стеклу

		var shape = new THREE.Shape();
		var p0 = {
			x: 0,
			y: 0
		};
		var p1 = newPoint_xy(p0, 0, bh1 - 50);
		// var p1 = newPoint_xy(p0, 0, bh1);
		addLine(shape, dxfPrimitivesArr, p0, p1, dxfBasePoint);
		var p2 = newPoint_xy(p1, bw1, 0);
		addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);
		var p1 = copyPoint(p2);
		var p2 = newPoint_xy(p2, 0, -bh1 + 50);
		// var p2 = newPoint_xy(p2, 0, -bh1);
		addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);
		var p1 = copyPoint(p2);
		var p2 = newPoint_xy(p2, -bw1, 0);
		addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);

		var center = {
			x: bw1 / 2,
			y: smallCenterTopOffset1
		};
		addRoundHole(shape, dxfPrimitivesArr, center, smallDiam1 / 2, dxfBasePoint);

		// center = {
		// 	x: bw1 / 2,
		// 	y: bh1 - smallCenterTopOffset1
		// };
		// addRoundHole(shape, dxfPrimitivesArr, center, smallDiam1 / 2, dxfBasePoint);

		center = {
			x: bw1 / 2,
			y: bh1 / 2
		};
		addRoundHole(shape, dxfPrimitivesArr, center, bigDiam1 / 2, dxfBasePoint);

		var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var glassAnglePart1 = new THREE.Mesh(geometry, glassAngleMaterial);
		glassAngleObject.add(glassAnglePart1);
		addText("1шт.", 30, dxfPrimitivesArr, newPoint_xy(dxfBasePoint, 20, -60));

		//отрисовка части прилегающей к площадке
		dxfBasePoint = newPoint_xy(dxfBasePoint, bw1 + 50, 0);
		var shape = new THREE.Shape();
		var p0 = {
			x: 0,
			y: 0
		};
		var p1 = newPoint_xy(p0, 0, bh2);
		addLine(shape, dxfPrimitivesArr, p0, p1, dxfBasePoint);
		var p2 = newPoint_xy(p1, bw2, 0);
		addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);
		var p1 = copyPoint(p2);
		var p2 = newPoint_xy(p2, 0, -bh2);
		addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);
		var p1 = copyPoint(p2);
		var p2 = newPoint_xy(p2, -bw2, 0);
		addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);
		
		var screwPar = {
			id: "screw_6x32",
			description: "Крепление кронштейна к ступеням",
			group: "Ограждения"
		}

		var center = {
			x: smallCenterOffset2,
			y: smallCenterOffset2
		};
		addRoundHole(shape, dxfPrimitivesArr, center, smallDiam2 / 2, dxfBasePoint);

		var screw = drawScrew(screwPar).mesh;
		screw.position.x = center.x + 8;
		screw.position.y = bh1 - params.treadThickness + 10;
		screw.position.z = center.y + 8;
		glassAngleObject.add(screw);

		center = {
			x: smallCenterOffset2,
			y: bh2 - smallCenterOffset2
		};
		addRoundHole(shape, dxfPrimitivesArr, center, smallDiam2 / 2, dxfBasePoint);

		var screw = drawScrew(screwPar).mesh;
		screw.position.x = center.x + 8;
		screw.position.y = bh1 - params.treadThickness + 10;
		screw.position.z = center.y + 8;
		glassAngleObject.add(screw);

		center = {
			x: bw2 - smallCenterOffset2,
			y: smallCenterOffset2
		};
		addRoundHole(shape, dxfPrimitivesArr, center, smallDiam2 / 2, dxfBasePoint);

		var screw = drawScrew(screwPar).mesh;
		screw.position.x = center.x + 8;
		screw.position.y = bh1 - params.treadThickness + 10;
		screw.position.z = center.y + 8;
		glassAngleObject.add(screw);

		center = {
			x: bw2 - smallCenterOffset2,
			y: bh2 - smallCenterOffset2
		};
		addRoundHole(shape, dxfPrimitivesArr, center, smallDiam2 / 2, dxfBasePoint);

		var screw = drawScrew(screwPar).mesh;
		screw.position.x = center.x + 8;
		screw.position.y = bh1 - params.treadThickness + 10;
		screw.position.z = center.y + 8;
		glassAngleObject.add(screw);

		var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var glassAnglePart2 = new THREE.Mesh(geometry, glassAngleMaterial);
		glassAnglePart2.rotation.x = Math.PI / 2;
		glassAnglePart2.position.x = thk;
		glassAnglePart2.position.z = thk;
		// glassAnglePart2.position.y = bh1 - params.treadThickness;
		glassAnglePart2.position.y = bh1 - params.treadThickness + 10;

		glassAngleObject.add(glassAnglePart2);
		addText("1шт.", 30, dxfPrimitivesArr, newPoint_xy(dxfBasePoint, 20, -60));

		//отрисовка треугольных частей

		dxfBasePoint = newPoint_xy(dxfBasePoint, bw2 + 50, 0);
		var shape = new THREE.Shape();
		var p0 = {
			x: 0,
			y: 0
		};
		// var p1 = newPoint_xy(p0, 0, bh3);
		var p1 = newPoint_xy(p0, 0, bh3 + 10);
		addLine(shape, dxfPrimitivesArr, p0, p1, dxfBasePoint);
		var p2 = newPoint_xy(p1, bw3, 0);
		addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);
		var p1 = copyPoint(p2);
		var p2 = newPoint_xy(p2, 0, -thk);
		addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p2, p0, dxfBasePoint);

		var center = {
			x: bigCenterLeftOffset3,
			y: bh3 - bigCenterTopOffset3
		};
		addRoundHole(shape, dxfPrimitivesArr, center, bigDiam3 / 2, dxfBasePoint);

		var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var glassAnglePart3 = new THREE.Mesh(geometry, glassAngleMaterial);
		glassAnglePart3.rotation.y = -Math.PI / 2;
		glassAnglePart3.position.x = thk;
		glassAnglePart3.position.z = thk;
		glassAnglePart3.position.y = 0;

		glassAngleObject.add(glassAnglePart3);

		var glassAnglePart4 = glassAnglePart3.clone();
		glassAnglePart4.position.x = bw1;

		glassAngleObject.add(glassAnglePart4);
		addText("2шт.", 30, dxfPrimitivesArr, newPoint_xy(dxfBasePoint, 20, -60));
	}
	else if (type == "corner") {
		//отрисовка частей прилегающих к стеклу

		var shape = new THREE.Shape();
		var p0 = {
			x: 0,
			y: bh1 / 2
		};
		var p1 = newPoint_xy(p0, 0, bh1 / 2 - 50);
		var p2 = newPoint_xy(p1, bw1, 0);
		var fil1 = calcFilletParams1(p0, p1, p2, frontEdgeRad, false);
		addLine(shape, dxfPrimitivesArr, p0, fil1.start, dxfBasePoint);
		addArc2(shape, dxfPrimitivesArr, fil1.center, frontEdgeRad, fil1.angstart, fil1.angend, true, dxfBasePoint)
		addLine(shape, dxfPrimitivesArr, fil1.end, p2, dxfBasePoint);
		var p1 = copyPoint(p2);
		var p2 = newPoint_xy(p2, 0, -bh1 + 50);
		addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);
		var p1 = copyPoint(p2);
		var p2 = newPoint_xy(p2, -bw1, 0);
		var p3 = newPoint_xy(p2, 0, bh1 / 2);
		var fil1 = calcFilletParams1(p1, p2, p3, frontEdgeRad, false);
		addLine(shape, dxfPrimitivesArr, p1, fil1.start, dxfBasePoint);
		addArc2(shape, dxfPrimitivesArr, fil1.center, frontEdgeRad, fil1.angstart, -fil1.angend, true, dxfBasePoint)
		addLine(shape, dxfPrimitivesArr, fil1.end, p3, dxfBasePoint);

		var center = {
			x: bw1 / 2,
			y: smallCenterTopOffset1
		};
		addRoundHole(shape, dxfPrimitivesArr, center, smallDiam1 / 2, dxfBasePoint);

		// center = {
		// 	x: bw1 / 2,
		// 	y: bh1 - smallCenterTopOffset1
		// };
		// addRoundHole(shape, dxfPrimitivesArr, center, smallDiam1 / 2, dxfBasePoint);

		center = {
			x: bw1 / 2,
			y: bh1 / 2
		};
		addRoundHole(shape, dxfPrimitivesArr, center, bigDiam1 / 2, dxfBasePoint);

		var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var glassAnglePart1 = new THREE.Mesh(geometry, glassAngleMaterial);
		if (par.isRotation) glassAnglePart1.position.z = bw1;
		glassAngleObject.add(glassAnglePart1);

		var glassAnglePart2 = glassAnglePart1.clone();
		glassAnglePart2.rotation.y = Math.PI / 2;
		glassAnglePart2.position.x = bw1;		
		glassAnglePart2.position.z = bw1 + thk;
		glassAngleObject.add(glassAnglePart2);
		addText("2шт.", 30, dxfPrimitivesArr, newPoint_xy(dxfBasePoint, 20, -60));

		//отрисовка части прилегающей к площадке

		dxfBasePoint = newPoint_xy(dxfBasePoint, bw1 + 50, 0);
		var shape = new THREE.Shape();
		var p0 = {
			x: 0,
			y: 0
		};
		var p1 = newPoint_xy(p0, 0, bw1);
		var p2 = newPoint_xy(p1, bw1, 0);
		var fil1 = calcFilletParams1(p0, p1, p2, frontEdgeRad, false);
		addLine(shape, dxfPrimitivesArr, p0, fil1.start, dxfBasePoint);
		addArc2(shape, dxfPrimitivesArr, fil1.center, frontEdgeRad, fil1.angstart, fil1.angend, true, dxfBasePoint)
		addLine(shape, dxfPrimitivesArr, fil1.end, p2, dxfBasePoint);
		var p1 = copyPoint(p2);
		var p2 = newPoint_xy(p2, 0, -bw1);
		addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);
		var p1 = copyPoint(p2);
		var p2 = newPoint_xy(p2, -bw1, 0);
		addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);

		var screwPar = {
			id: "screw_6x32",
			description: "Крепление кронштейна к ступеням",
			group: "Ограждения"
		}

		var center = {
			x: smallCenterOffset2,
			y: smallCenterOffset2
		};
		addRoundHole(shape, dxfPrimitivesArr, center, smallDiam2 / 2, dxfBasePoint);

		var screw = drawScrew(screwPar).mesh;
		screw.position.x = center.x;
		screw.position.y = bh1 - params.treadThickness + 10;
		screw.position.z = center.y + 8;
		glassAngleObject.add(screw);

		center = {
			x: smallCenterOffset2,
			y: bw1 - smallCenterOffset2
		};
		addRoundHole(shape, dxfPrimitivesArr, center, smallDiam2 / 2, dxfBasePoint);

		var screw = drawScrew(screwPar).mesh;
		screw.position.x = center.x;
		screw.position.y = bh1 - params.treadThickness + 10;
		screw.position.z = center.y + 8;
		glassAngleObject.add(screw);

		center = {
			x: bw1 - smallCenterOffset2,
			y: smallCenterOffset2
		};
		addRoundHole(shape, dxfPrimitivesArr, center, smallDiam2 / 2, dxfBasePoint);

		var screw = drawScrew(screwPar).mesh;
		screw.position.x = center.x;
		screw.position.y = bh1 - params.treadThickness + 10;
		screw.position.z = center.y + 8;
		glassAngleObject.add(screw);

		center = {
			x: bw1 - smallCenterOffset2,
			y: bw1 - smallCenterOffset2
		};
		addRoundHole(shape, dxfPrimitivesArr, center, smallDiam2 / 2, dxfBasePoint);

		var screw = drawScrew(screwPar).mesh;
		screw.position.x = center.x;
		screw.position.y = bh1 - params.treadThickness + 10;
		screw.position.z = center.y + 8;
		glassAngleObject.add(screw);

		var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var glassAnglePart2 = new THREE.Mesh(geometry, glassAngleMaterial);
		glassAnglePart2.rotation.x = Math.PI / 2;
		glassAnglePart2.position.z = thk;
		glassAnglePart2.position.y = bh1 - params.treadThickness + 10;

		glassAngleObject.add(glassAnglePart2);
		addText("1шт.", 30, dxfPrimitivesArr, newPoint_xy(dxfBasePoint, 20, -60));
	}

	addText("Кронштейн площадки", 30, dxfPrimitivesArr, newPoint_xy(par.dxfBasePoint, 20, -120));
	// par.mesh = glassAngleObject;
	var positionFixMesh = new THREE.Object3D();
	glassAngleObject.position.x = -bw1 / 2;
	// glassAngleObject.position.y = -bh1 + smallCenterTopOffset1;
	glassAngleObject.position.y = -bh1 + smallCenterTopOffset1 + 150;
	glassAngleObject.position.z = 20;
	if (type == "corner" && turnFactor == -1) {
		glassAngleObject.rotation.y += Math.PI / 2;
		glassAngleObject.position.x -= thk;
		glassAngleObject.position.z += bw1 + thk;
	}
	positionFixMesh.add(glassAngleObject);
	par.mesh = positionFixMesh;
	return par;
}

/** Функция отрисовывает массив стоек*/
function drawRacksMono(par){
	var section = new THREE.Object3D();

	par.sect = section;
	//задаем длину стоек от уровня ступени
	par.rackLength = 800;
	par.handrailTurnOffset = 50; //смещение точки перелома поручня от стойки
	//параметры марша
	var marshPar = getMarshParams(par.marshId);
	var prevMarshPar = getMarshParams(marshPar.prevMarshId);
	var nextMarshPar = getMarshParams(marshPar.nextMarshId);

	setRailingParams(par);
	//рассчитываем длины и расположение стоек
	calculateRacks(par);
	if(par.racks.length == 0) return section;

	var textHeight = 30;
	addText(par.text, textHeight, dxfPrimitivesArr, newPoint_xy(par.dxfBasePoint, 0, -50));
	
	var racks = par.racks;

	
	var rackProfile = 40;
	var railingPositionZ = 0;
	if(turnFactor === -1) railingPositionZ = -rackProfile;
	
	
	//отрисовка стоек

	for (var i = 0; i < racks.length; i++){
		if(racks[i].noDraw) continue;
		var rackParams = {
			type: racks[i].type,
			isFirst: racks[i].isFirst,
			len: racks[i].len,
			railingSide: marshPar.side[par.key],
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, racks[i].x, racks[i].y),
			dxfArr: dxfPrimitivesArr,
			holderAng: racks[i].holderAng * turnFactor,
			turnSide: params.turnSide,
			marshId: par.marshId,
            key: par.key,
            isFirstFlan: racks[i].isFirstFlan,
            isBotFlan: par.isBotFlan,
			isTopWinder: racks[i].isTopWinder,
        }

        if (par.isBotFlan) rackParams.type = 'platformRear'
		
		if(!racks[i].isTurnRackStart && !racks[i].isTurnRackEnd){
			drawRackMono(rackParams);
			var rack_mesh = rackParams.mesh;
			rack_mesh.position.x = racks[i].x;
			rack_mesh.position.y = racks[i].y; // + racks[i].len;
			rack_mesh.position.z = railingPositionZ;
			//if(turnFactor == -1) rack_mesh.rotation.y = -Math.PI;
			section.add(rack_mesh);
			}
			
		
	}

	var result = {
		mesh: section,
		}
	return result;
}


/**
  drawRackMono - отрисовывает обычную стойку ограждения
	INPUT:
	  * type: first || middle || last || turnRackEnd || turnRackStart
	  * railingSide: Сторона поручня
	  * material: материал стойки
	  * dxfBasePoint: -
	  * dxfArr: dxfPrimitivesArr,
	  * holderAng: угол крепежа
	  * stepH: высота ступеньки первого марша
	  * nextStepH: высота ступеньки второго марша
	  * treadOffset: 36 Отступ от края нижней ступени

	OUTPUT:
	  * mesh готовой стойки
*/

// Функция рисует стойки в зависимости от типа
function drawRackMono(par){

	par.mesh = new THREE.Object3D();
	
	var marshPar = getMarshParams(par.marshId);
	var prevMarshPar = getMarshParams(marshPar.prevMarshId);
	var nextMarshPar = getMarshParams(marshPar.nextMarshId);
	
	var metalMaterial = params.materials.metal_railing;
	if(params.banisterMaterial != "40х40 черн.") metalMaterial = params.materials.inox;

	var rackProfile = 40 - 0.02;
	var bottomHoleOffset = 20;
	var holeDiam = 6;
	var banisterAngleOffset = 16; //отступ отверстия уголка от нижней поверхности ступени
	var banisterFlanThk = 8; //толщина фланца L-образной стойки
	var sideLen = 120; //длина уступа L-образной стойки
	//к-т, учитывающий сторону ограждения
	var sideFactor = 1;
	if (par.railingSide === "left") sideFactor = -1;

	//сдвиг первой стойки первого марша, чтобы стойка не пересекала пригласительную ступень
	
	var isFirstMove = false;
	if (par.isFirst && params.railingStart != 0) {
		if (params.startTreadAmt == params.railingStart && (params.arcSide == par.railingSide || params.arcSide == "two"))
			isFirstMove = true;
	}

	//расчет длины нижней части стойки (ниже уровня ступени)
	var botLen = marshPar.h; //длина от верха ступени до низа стойки
	if(par.type == 'middle') botLen += params.treadThickness + bottomHoleOffset + banisterAngleOffset;
	if (par.type == 'last') botLen = params.treadThickness + rackProfile + banisterFlanThk;
	if (par.type == 'platformRear') botLen = -5;
	if(par.type == 'turnRackStart'){
		//Г-образный поворот
		if(params.stairModel != "П-образная с площадкой" && params.stairModel != "П-образная с забегом") {
			botLen += params.treadThickness + bottomHoleOffset + banisterAngleOffset + prevMarshPar.h;
			if (marshPar.botTurn == "забег") botLen += marshPar.h * 2;
			if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 3 && params.stairAmt2 == 0 && params.turnType_1 !== "забег")
				botLen -= prevMarshPar.h;
			}
		//П-образный поворот
		if(params.stairModel == "П-образная с площадкой" || params.stairModel == "П-образная с забегом"){
			botLen += params.treadThickness + bottomHoleOffset + banisterAngleOffset;
			if (marshPar.botTurn == "забег") {
				if (marshPar.botTurn == "забег") {
					if (params.marshDist > 40)
						botLen += marshPar.h * 3;
					else
						botLen += marshPar.h * 5;
				}
			}
			}
		} 
	if(par.type == 'turnRackEnd'){
		//Г-образный поворот
		if(params.stairModel != "П-образная с площадкой" && params.stairModel != "П-образная с забегом") {
			botLen += params.treadThickness + bottomHoleOffset + banisterAngleOffset// + prevMarshPar.h;
			if(marshPar.botTurn == "забег") botLen += marshPar.h * 3;
			}
		//П-образный поворот
		if(params.stairModel == "П-образная с площадкой" || params.stairModel == "П-образная с забегом"){
			botLen = params.treadThickness + bottomHoleOffset + banisterAngleOffset + marshPar.h;
			}
    } 
    if (par.isFirstFlan) {
        botLen -= params.treadThickness + bottomHoleOffset + banisterAngleOffset;
        if (params.botFloorType == "черновой") botLen += params.botFloorsDist;
    } 

	
	var points = [];
	var p0 = {x: 0,	y: 0,}; //точка на оси стойки на уровне верха ступени
	
	//верхние точки
	var p1 = newPoint_xy(p0, -rackProfile / 2, par.len);
	var p2 = newPoint_xy(p0, rackProfile / 2, par.len);	
	points.push(p1, p2)
	var topPoint = copyPoint(p1); //сохраняем точку
	
	//нижние точки
	if(par.type != 'last'){
		var p3 = newPoint_xy(p0, rackProfile / 2, -botLen);
		var p4 = newPoint_xy(p0, -rackProfile / 2, -botLen);
		points.push(p3, p4)
		}
	if(par.type == 'last'){
		var p3 = newPoint_xy(p0, rackProfile / 2, -botLen);
		var p4 = newPoint_xy(p3, -(sideLen + rackProfile), 0);
		var p5 = newPoint_xy(p4, 0, rackProfile);
		var p6 = newPoint_xy(p5, sideLen, 0);
		points.push(p3, p4, p5, p6)
		}
	
	if(params.banisterMaterial == "40х40 нерж+дуб"){
		var topPartLen = 120;
		var timberPartLen = 600;
		points[0].y -= topPartLen + timberPartLen;
		points[1].y -= topPartLen + timberPartLen;
		}
		
	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		}

	var shape = drawShapeByPoints2(shapePar).shape;
	
	//отверстия под уголки на стойке марша	
	
	var holeCenters = [];
	
	//отверстия на стойке марша
	if(par.type == 'first' || par.type == 'middle'){
		var rackPar = {
			marshId: par.marshId,
			key: par.key,
            type: par.type,
            isFirstFlan: par.isFirstFlan,
			banisterAngleOffset: banisterAngleOffset,
			isFirstMove: isFirstMove,
		}
		holeCenters = setRackHoles(rackPar).holes;
		
		//размер для спецификации
		var sizeA = botLen + holeCenters[0].y;
		//if (par.type == 'middle') sizeA = distance(holeCenters[0], holeCenters[1])
	}
	
	//отверстия на поворотной стойке	
	if(par.type == 'turnRackStart' || par.type == 'turnRackEnd'){
		var rackPar = {
			marshId: par.marshId,
			key: par.key,
            type: par.type,
            isFirstFlan: par.isFirstFlan,
			banisterAngleOffset: banisterAngleOffset,
		}
		holeCenters = setTurnRackHoles(rackPar).holes;
	}
	
	

	var holesPar = {
		holeArr: [],
		dxfBasePoint: par.dxfBasePoint,
		shape: shape,
		holeRad: holeDiam / 2,
		}
	for(var i=0; i<holeCenters.length; i++){
		if(holeCenters[i].y <= points[0].y){
			holesPar.holeArr.push(holeCenters[i]);
		}
	}
	
	addHolesToShape(holesPar);

	if (par.type == 'turnRackStart' || par.type == 'turnRackEnd') {
		shape.drawing = {};
		shape.drawing.group = 'turnRack';
		shape.drawing.name = 'Поворотный столб марш: ' + par.marshId;
		shape.drawing.yDelta = botLen;
		shapesList.push(shape);
	}
	
	var extrudeOptions = {
		amount: rackProfile,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
		
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var rack = new THREE.Mesh(geom, metalMaterial);
    if (par.type == 'last'){
		rack.position.z = rackProfile / 2;
		rack.rotation.y = -Math.PI / 2;
		rack.position.x = rackProfile / 2;
		if(par.railingSide == "left"){
			rack.rotation.y = Math.PI / 2;
			rack.position.x = -rackProfile / 2;
			}
    }
	if (par.type !== 'turnRackStart') rack.position.z += 0.01 * sideFactor;
	rackBot = rack;
	par.mesh.add(rack);
	
	//вставка и верхняя часть комбинированной стойки
	if(params.banisterMaterial == "40х40 нерж+дуб"){
		
		//вставка

		var pt1 = newPoint_xy(points[0], 0, 0);
		var pt2 = newPoint_xy(pt1, 0, timberPartLen)
		var pt3 = newPoint_xy(pt2, rackProfile, 0)
		var pt4 = newPoint_xy(pt1, rackProfile, 0)

		var points = [pt1, pt2, pt3, pt4];

		//создаем шейп
		var shapePar = {
			points: points,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: par.dxfBasePoint,
			}

		var shape = drawShapeByPoints2(shapePar).shape;

		var holesPar = {
			holeArr: [],
			dxfBasePoint: par.dxfBasePoint,
			shape: shape,
			holeRad: holeDiam / 2,
			}
		for(var i=0; i<holeCenters.length; i++){
			if(holeCenters[i].y > points[0].y){
				holesPar.holeArr.push(holeCenters[i]);
			}
		}
		
		addHolesToShape(holesPar);
		
		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var rack = new THREE.Mesh(geom, params.materials.timber);
		par.mesh.add(rack);

		//верх

		var pt1 = newPoint_xy(pt2, 0, 0);
		var pt2 = newPoint_xy(pt1, 0, topPartLen)
		var pt3 = newPoint_xy(pt2, rackProfile, 0)
		var pt4 = newPoint_xy(pt1, rackProfile, 0)

		var points = [pt1, pt2, pt3, pt4];

		//создаем шейп
		var shapePar = {
			points: points,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: par.dxfBasePoint,
			}

		var shape = drawShapeByPoints2(shapePar).shape;
		
		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var rack = new THREE.Mesh(geom, metalMaterial);
		rackTop = rack;
		par.mesh.add(rack);
		
	}
	//добавлем уголки
	
	var angPar = {
		holeCenters: holeCenters,
		railingSide: par.railingSide,
		dxfBasePoint: par.dxfBasePoint,
		}
	var angles = addRackAngles(angPar).mesh;
	par.mesh.add(angles);

	//Нижняя заглушка
	if(!(par.type == 'first' || par.isFirstFlan || par.type == 'platformRear')){
		var plugParams = {
			id: "plasticPlug_40_40",
			width: 40,
			height: 40,
			description: "Заглушка низа стоек ограждения",
			group: "Ограждения"
		}
		var rackBotPlug = drawPlug(plugParams);
		rackBotPlug.position.z = rackProfile / 2;
		rackBotPlug.position.y = p0.y - botLen;

		if (par.type == 'last'){
			rackBotPlug.position.z = sideLen + plugParams.width / 2 + rackProfile / 2;
			if(par.railingSide === "right") rackBotPlug.position.z = -sideLen - plugParams.width / 2 + rackProfile / 2;
			rackBotPlug.position.y += plugParams.height / 2;
			rackBotPlug.rotation.y = Math.PI / 2;
			rackBotPlug.rotation.z = Math.PI / 2;
		}

		if(!testingMode) par.mesh.add(rackBotPlug);
	}

	if((params.banisterMaterial == "40х40 нерж+дуб" || params.banisterMaterial == "40х40 нерж.") && !testingMode){
		var topPlug = drawRackPlug(metalMaterial)
		topPlug.position.z += 20;
		topPlug.position.y = topPoint.y;
		par.mesh.add(topPlug);
	}

	//фланцы
	if (par.type == 'first' || par.isFirstFlan || par.type == 'platformRear'){
		var flanPar = {
            dxfBasePoint: newPoint_xy(par.dxfBasePoint, 100, 0),
            marshId: par.marshId,
			}
		var botFlan =  drawPlatformRailingFlan(flanPar).mesh;
		botFlan.position.z = rackProfile / 2;
		botFlan.position.y = p3.y;
		par.mesh.add(botFlan);
		}
	
	if (par.type == 'last'){
		var flanPar = {
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 100, 0),
			marshId: par.marshId,
		}
		var botFlan =  drawLastRackFlan(flanPar).mesh;
		botFlan.rotation.y = Math.PI / 2;
		botFlan.position.z = -sideLen / 2 - 5
		if(par.railingSide === "left"){
			botFlan.position.z = sideLen / 2 + rackProfile + 5
		}
		botFlan.position.y = p3.y + rackProfile;
		par.mesh.add(botFlan);

		var rackFlan = drawRackFlan(rackProfile);
		rackFlan.rotation.x = Math.PI / 2;
		rackFlan.position.z = -sideLen / 2 - 5
		if(par.railingSide === "left") rackFlan.position.z = sideLen / 2 + rackProfile + 5;
		rackFlan.position.y = p3.y + rackProfile;
		if(!testingMode) par.mesh.add(rackFlan);
	}
		
	//кронштейн поручня
	var holderParams = {
		angTop: par.holderAng * turnFactor,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, topPoint.y),
		isForge: false,
		}
	var holder = drawHandrailHolder(holderParams).mesh;
	holder.position.x = 0;
	holder.position.y = topPoint.y;
	holder.position.z = rackProfile / 2;

	par.mesh.add(holder)

	//кронштейн поручня к поворотному столбу (отрисовывается вместе с первой стойкой марша)

	if ((par.type == "first" || par.isFirst) && 
		par.key == "in" &&
		nextMarshPar.hasRailing.in && 
		params.stairModel != "П-образная с площадкой" &&
		params.stairModel != "П-образная с забегом"	&&
		params.stairModel != "Прямая"
		) {

		////определяем точку вставки кронштейна
		//var handrailAng = Math.abs(par.holderAng)
		//var dist = 53 + 17 / Math.cos(handrailAng);//расстояние по вертикали от верха стойки до поручня
		//var pt = newPoint_xy(topPoint, rackProfile / 2, dist);
		//var pt1 = newPoint_xy(pt, marshPar.b * marshPar.stairAmt - rackProfile / 2, 0);
		//pt1.x -= 0.05;
		
		////учитываем что на среднем марше если поворот - площадка, длина марша отличается на nose
		//if(par.marshId == 2 && params.turnType_1 == "площадка"){
		//	pt1.x -= params.nose;
		//	}

		//if (params.railingStart != 0) {
		//	pt1.x -= marshPar.b * params.railingStart;
		//	if (isFirstMove) pt1.x -= rackProfile + 5 + 0.02;
		//}
		//var pt2 = itercection(pt, polar(pt, handrailAng, 100), pt1, polar(pt1, Math.PI / 2, 100));
		//var dist1 = 53 + 17 / Math.sin(handrailAng); //расстояние по горизонтали от поворотного столба до поручня
		//pt2.y -= dist1 * Math.tan(handrailAng);
		
		//var holderParams = {
		//	angTop: (Math.PI / 2 - handrailAng) * turnFactor,
		//	dxfBasePoint: newPoint_xy(par.dxfBasePoint, pt2.x, pt2.y),
		//	isForge: false,
		//	isHor: true,
		//}
		////if(turnFactor == -1) holderParams.angTop = handrailAng - Math.PI / 2;
		//var holder = drawHandrailHolder(holderParams).mesh;

		//holder.position.y = pt2.y;
		//holder.position.x = pt2.x //* turnFactor;
		//holder.position.z = rackProfile/2;
		//holder.rotation.z = -Math.PI / 2 * turnFactor;
		//if(turnFactor == 1) holder.rotation.y = Math.PI;

		//par.mesh.add(holder)
	}
	
	//сохраняем данные для спецификации
	var rackLen = topPoint.y - p3.y;
	
	//стойка в сборе
	var profParmas = getProfParams(rackProfile + 'х' + rackProfile);
	addMaterialNeed({id: profParmas.materialNeedId, amt: Math.round(par.len) / 1000, area: (rackProfile + rackProfile) * 2 * rackLen / 1000000, itemType: 'railing'})
	var partName = "racks";
	if(par.type == 'turnRackStart' || par.type == 'turnRackEnd') partName = "turnRack";
	if(typeof specObj !='undefined'){
		if(!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Стойка ограждения ",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Ограждения",
				}
			if(partName == "turnRack") specObj[partName].name = "Столб поворотный "
			if(params.banisterMaterial == "40х40 нерж+дуб"){
				specObj[partName].division = "timber";
				specObj[partName].metalPaint = false;
				specObj[partName].timberPaint = true;
				specObj[partName].name += "комб. ";
				specObj[partName].group = "timberBal"	
			}
			if(params.banisterMaterial == "40х40 нерж."){
				specObj[partName].metalPaint = false;
				specObj[partName].name += "нерж. ";
			}
			if(params.banisterMaterial == "40х40 черн."){
				specObj[partName].name += "черн. ";
			}
			
		}
		
		var name = "";
		if(par.type == 'first') name += " начальная с фланцем ";
		if(par.type == 'last') name += " L-образная ";
		name += "L=" + Math.round(rackLen);
		if (par.type == 'first' || par.type == 'middle') name += " A=" + Math.round(sizeA);
		if (par.type == 'turnRackStart' && par.isFirstFlan) name += " с фланцем "
		
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}
	par.mesh.specId = partName + name;
		
	//окончания комбинированных стоек
	
	if(params.banisterMaterial == "40х40 нерж+дуб"){
		//верх стойки
		var partName = "combRackTop";
		if(typeof specObj !='undefined'){
			if(!specObj[partName]){
				specObj[partName] = {
					types: {},
					amt: 0,
					name: "Верх комб. стойки ",
					metalPaint: false,
					timberPaint: false,
					division: "metal",
					workUnitName: "amt", //единица измерения
					group: "Ограждения",
				};
			}
			
			var name = "L=" + topPartLen;
			if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
			if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
			specObj[partName]["amt"] += 1;
		}
		if(rackTop) rackTop.specId = partName + name;
		
		//низ стойки
		var partName = "combRackBot";
		if(typeof specObj !='undefined'){
			if(!specObj[partName]){
				specObj[partName] = {
					types: {},
					amt: 0,
					name: "Низ комб. стойки",
					metalPaint: false,
					timberPaint: false,
					division: "metal",
					workUnitName: "amt", //единица измерения
					group: "Ограждения",
				};
			}

			var name = ""
			if(par.type == 'first') name += " начальной с фланцем ";
			if(par.type == 'last') name += " L-образной ";
			name += "L=" + Math.round(rackLen - topPartLen - timberPartLen);
			if(par.type == 'first' || par.type == 'middle') name += " A=" + Math.round(sizeA);
			
		
			if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
			if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
			specObj[partName]["amt"] += 1;
		}
		if(rackBot) rackBot.specId = partName + name;
	
	}
	
	return par;
}	



//Общая функция для расчета положения стоек
function calculateRacks(par){

	var marshPar = getMarshParams(par.marshId);
	var prevMarshPar = getMarshParams(marshPar.prevMarshId);
	var nextMarshPar = getMarshParams(marshPar.nextMarshId);
	var rackPos = setRackPos(par.marshId);
	var parRacks = {};
	par.a = marshPar.a;
	par.b = marshPar.b;
	par.h = marshPar.h;
	par.nextH = nextMarshPar.h;
	par.prevH = prevMarshPar.h;
	par.stairAmt = marshPar.stairAmt;
	par.lastMarsh = marshPar.lastMarsh;
	par.handrailTurnOffset = 50; //смещение точки перелома поручня от стойки
	par.racks = [];
	par.handrailPoints = [];
	par.topTurn = marshPar.topTurn;
	par.botTurn = marshPar.botTurn;
	par.nextMarshPar = nextMarshPar;
	var rackLen = 750;
	var rackProfile = 40;
	var offsetX = 5 + rackProfile / 2; //смещение оси стойки относительно передней кромки ступени

	parRacks.angMarsh = marshPar.ang;
	parRacks.marshLen = marshPar.b * marshPar.stairAmt;
	parRacks.angBot = 0;
	parRacks.angTop = 0;
	
	var isWndP = false;
	//первая стойка марша
	parRacks.marshFirst = {
		x: offsetX,
		y: marshPar.h,
		len: rackLen,
		holderAng: marshPar.ang,
		type: 'middle'
		};

	if (marshPar.botTurn == "пол") {
		parRacks.marshFirst.type = "first";
		//если ограждение начинается не с первой ступени
		if (params.railingStart != "0") {
			parRacks.marshFirst.type = "middle";
			parRacks.marshFirst.isFirst = true;
			parRacks.marshFirst.x = +params.railingStart * marshPar.b + offsetX;
			parRacks.marshFirst.y = (+params.railingStart + 1) * marshPar.h;
			if (params.startTreadAmt == +params.railingStart) {
				if (params.arcSide == par.railingSide || params.arcSide == "two") {
					parRacks.marshFirst.x += par.rackProfile + 5;
					parRacks.marshFirst.len += (par.rackProfile + 5) * Math.tan(marshPar.ang);
				}
			}

			/*
			//смещаем средние стойки
			for (var i = 0; i < rackPos.length; i++) {
				rackPos[i] += +params.railingStart;
			}*/
		}
	}

	
	//на ковке смещаем первую стойку на площадку
	if (params.railingModel == "Кованые балясины"){
		if(marshPar.botTurn == "площадка" && par.key == "out"){
			parRacks.marshFirst.x -=  marshPar.b - 40;
			parRacks.marshFirst.y -=  marshPar.h;
			parRacks.marshFirst.type = "last";
			}
		}
	
	//поворотный столб
	
	if(marshPar.botTurn != "пол" && par.key == "in"){

		var mooveX = 0;
		if(marshPar.botTurn == "площадка") mooveX = 45;
		//учитываем размер поворота для гнутых
		if (params.model == 'гнутый') mooveX = params.M - params.sizeTurn
			
		parRacks.marshFirst.x += mooveX;
		parRacks.marshFirst.len += mooveX * Math.tan(marshPar.ang);
		parRacks.marshFirst.type = 'turnRackStart';
		if (par.marshId == 2) parRacks.marshFirst.isFirst = true;

        //если внизу пол, тогда обрезаем снизу стойку и добавляем фланец крепления к полу
	    if (prevMarshPar.botTurn == "пол" && prevMarshPar.stairAmt == 0) {
	        if (params.stairModel != "П-образная с забегом") {
	            parRacks.marshFirst.isFirstFlan = true;
	        }
	    }
    }

	//последняя стойка марша

	parRacks.marshLast = {
		x: offsetX + marshPar.stairAmt * marshPar.b,
		y: marshPar.h * (marshPar.stairAmt + 1),
		len: rackLen,
		holderAng: marshPar.ang,
		type: 'middle'
	};

	
	var mooveX = 0;
	
	//обычная стойка
	if(marshPar.topTurn == "пол"){
		mooveX = marshPar.a - 100;
		if (params.topAnglePosition == "над ступенью") mooveX -= 20;
		parRacks.marshLast.type = "last"
		parRacks.marshLast.x -= marshPar.b;
		parRacks.marshLast.y -= marshPar.h;
		}

	//поворотный столб
	if (marshPar.topTurn != "пол" && par.key == "in" && !marshPar.lastMarsh) {
		//mooveX = marshPar.b;
		if (params.stairModel == "П-образная с площадкой") mooveX -= 45;
		//учитываем размер поворота для гнутых
		if (params.model == 'гнутый') mooveX = -(params.M - params.sizeTurn)

		//г-образный поворот
		if (params.stairModel != "П-образная с площадкой" && params.stairModel != "П-образная с забегом") {
			//не отрисовываем последнюю стойку если есть стыковка с верхней секцией
			if (nextMarshPar.hasRailing.in || nextMarshPar.hasTopBalRailing.in) parRacks.marshLast.noDraw = true;
			else parRacks.marshLast.type = "turnRackEnd";
		}
		//п-образный поворот
		if (params.stairModel == "П-образная с площадкой" || params.stairModel == "П-образная с забегом") {
			//не отрисовываем последнюю стойку если есть стыковка с верхней секцией
			if ((nextMarshPar.hasRailing.in && params.marshDist == 40) || nextMarshPar.hasTopBalRailing.in) parRacks.marshLast.noDraw = true;
			else parRacks.marshLast.type = 'turnRackEnd';
		}
		if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 1 && params.stairAmt2 == 0 && marshPar.topTurn == "площадка") {
			mooveX -= rackProfile + 5;
		}
	}

	if (marshPar.hasTopBalRailing.in) {
		mooveX = 0;
		parRacks.marshLast = {
			x: params.lastWinderTreadWidth + 8 + 40 + rackProfile / 2,
			y: marshPar.h * 2,
			len: rackLen,
			holderAng: marshPar.ang,
			type: 'middle',
			noDraw: true,
		};
		parRacks.marshFirst.holderAng = calcAngleX1(parRacks.marshFirst, parRacks.marshLast);
		parRacks.marshLast.holderAng = calcAngleX1(parRacks.marshFirst, parRacks.marshLast);
		parRacks.marshFirst.len -= 250;
		parRacks.marshLast.len -= 250;
	}

	parRacks.marshLast.x += mooveX;
	parRacks.marshLast.len += mooveX * Math.tan(marshPar.ang);
	
	
	//первая стойка нижнего поворота
	if(par.botEnd != "нет") {
		parRacks.botFirst = {
			x: -params.M + 130,
			y: 0,//-par.h,
			len: rackLen,
			holderAng: marshPar.ang,
			type: 'last'
		};
		if (par.botEnd == "забег") {
			parRacks.botFirst.len -= 20; //удлинняем стойку чтобы стык поручня не попадал на кронштейн
			parRacks.botFirst.x = -params.M + 180;
			parRacks.botFirst.y -= par.h;
			//смещенная точка перелома поручня
			var handrailTurnPoint = polar(parRacks.marshFirst, marshPar.ang, -par.handrailTurnOffset)
			parRacks.botFirst.holderAng = angle(parRacks.botFirst, handrailTurnPoint);
			// parRacks.angBot = parRacks.botFirst.holderAng;//calcAngleX1(parRacks.botFirst, parRacks.botLast);
		}
		if(par.botEnd == "площадка"){
			if (prevMarshPar.hasRailing.out) {
				parRacks.botFirst.x += 100;
			}
			if (params.stairModel == 'П-образная с площадкой') {
				parRacks.botFirst.x = -params.platformLength_1 + 80;
			}
			parRacks.botFirst.len += par.handrailTurnOffset; //удлинняем стойку чтобы стык поручня не попадал на кронштейн
			parRacks.botFirst.holderAng = 0;
		}
		parRacks.angBot = calcAngleX1(parRacks.botFirst, parRacks.marshFirst);
		parRacks.botLen = distance(parRacks.botFirst, parRacks.marshFirst);
	}

	//последняя стойка верхнего поворота
	if(par.topEnd != "нет"){
		parRacks.topLast = {
			x: parRacks.marshLast.x + par.platformLengthTop - 70,
			y: parRacks.marshLast.y,
			len: rackLen,
			holderAng: marshPar.ang,
			type: 'last'
		};
		if(par.topEnd == "забег"){
			// parRacks.angTop = marshPar.ang;			
			//parRacks.topLast.x = parRacks.marshLast.x + params.M - 100 - 70;
			parRacks.topLast.x = parRacks.marshLast.x + params.M - 70;
			parRacks.topLast.y += marshPar.h_topWnd;
			var handrailTurnPoint = polar(parRacks.marshLast, marshPar.ang, par.handrailTurnOffset)
			parRacks.topLast.holderAng = angle(handrailTurnPoint, parRacks.topLast);
			// parRacks.angTop = parRacks.topLast.holderAng;

		}
		if(par.topEnd == "площадка"){
			
			parRacks.topLast.len += 50; //удлинняем стойку чтобы стык поручня не попадал на кронштейн
			parRacks.topLast.holderAng = 0;
			//устраняем пересечение L-образных стоек
			if (params.railingModel == "Ригели" && par.key == "out" && par.topConnection){
				parRacks.topLast.x -= 100;
            }
            if (params.stairModel == 'П-образная с площадкой') {
                parRacks.topLast.x += 50;
            }
		}
		parRacks.angTop = calcAngleX1(parRacks.marshLast, parRacks.topLast);
		parRacks.topLen = distance(parRacks.marshLast, parRacks.topLast);
	}
	
	
	if (params.stairModel == 'П-образная с забегом' && par.marshId == 2) {
		isWndP = true;
		parRacks.marshFirst = {
			x: -params.M + 100,
			y: -par.h,
			len: rackLen,
			holderAng: 0,
			type: 'last'
		};
		parRacks.marshFirst.holderAng = angle(parRacks.marshFirst, parRacks.marshLast);
		parRacks.marshLast.holderAng = angle(parRacks.marshLast, parRacks.marshFirst);
    }

    //стойки заднего ограждения П-образной с площадкой
    if (params.stairModel == 'П-образная с площадкой' && par.key == "rear") {
        var isRearPlatform = true;
        var parRacks = {};
        parRacks.angMarsh = 0;
        parRacks.marshLen = params.M * 2 + params.marshDist;
        parRacks.angBot = 0;
        parRacks.angTop = 0;
        var offsetXFirst = 60;
        var offsetXLast = 60;

        var meterHandrailPar = {
            prof: params.handrailProf,
            sideSlots: params.handrailSlots,
            handrailType: params.handrail,
            metalPaint: params.metalPaint_railing,
            timberPaint: params.timberPaint_perila,
        }
        meterHandrailPar = calcHandrailMeterParams(meterHandrailPar);

        var offsetXFirst = 80;
        var offsetXLast = 80;
        if (nextMarshPar.hasRailing.out) offsetXFirst += (meterHandrailPar.profZ - rackProfile) / 2;
        if (prevMarshPar.hasRailing.out) offsetXLast += (meterHandrailPar.profZ - rackProfile) / 2;


        //начальная стойка площадки
        parRacks.marshFirst = {
            x: offsetXFirst,
            y: 0,
            len: rackLen,
            holderAng: parRacks.angMarsh,
            type: 'last'
        };

        //конечная стойка площадки
        parRacks.marshLast = {
            x: parRacks.marshLen - offsetXLast,
            y: 0,
            len: rackLen,
            holderAng: parRacks.angMarsh,
            type: 'last'
        };
        

        //средние стойки площадки
        if (parRacks.marshLen > 1000) {
            var count = Math.floor((parRacks.marshLen - offsetXFirst - offsetXLast) / 1000);
            var lenSection = (parRacks.marshLen - offsetXFirst - offsetXLast) / (count + 1);
            var racksRearPlatform = [];
            for (var j = 1; j <= count; j++) {
                var rackRearPlatform = {
                    x: offsetXFirst + lenSection * j,
                    y: 0,
                    len: rackLen,
                    holderAng: parRacks.angMarsh,
                    type: 'last'
                };
                racksRearPlatform.push(rackRearPlatform);
            }
        }
	}

	//стойки заднего ограждения верхней площадки
	if (par.marshId == 'topPlt' && par.key == "rear") {
		var isRearPlatform = true;
		var parRacks = {};
		parRacks.angMarsh = 0;
		parRacks.marshLen = params.M;
		parRacks.angBot = 0;
		parRacks.angTop = 0;
		var offsetXFirst = 60;
		var offsetXLast = 60;

		var meterHandrailPar = {
			prof: params.handrailProf,
			sideSlots: params.handrailSlots,
			handrailType: params.handrail,
			metalPaint: params.metalPaint_railing,
			timberPaint: params.timberPaint_perila,
		}
		meterHandrailPar = calcHandrailMeterParams(meterHandrailPar);

		var offsetXFirst = 80 + 1; //1 - толщина заглушки поручня
		var offsetXLast = 80 + 1;
		if (params.topPltRailing_3) offsetXFirst += (meterHandrailPar.profZ - rackProfile) / 2;
		if (params.topPltRailing_4) offsetXLast += (meterHandrailPar.profZ - rackProfile) / 2;


		//начальная стойка площадки
		parRacks.marshFirst = {
			x: offsetXFirst,
			y: 0,
			len: rackLen + 50,
			holderAng: parRacks.angMarsh,
			type: 'last'
		};

		//конечная стойка площадки
		parRacks.marshLast = {
			x: parRacks.marshLen - offsetXLast,
			y: 0,
			len: rackLen + 50,
			holderAng: parRacks.angMarsh,
			type: 'last'
		};


		//средние стойки площадки
		if (parRacks.marshLen > 1000) {
			var count = Math.floor((parRacks.marshLen - offsetXFirst - offsetXLast) / 1000);
			var lenSection = (parRacks.marshLen - offsetXFirst - offsetXLast) / (count + 1);
			var racksRearPlatform = [];
			for (var j = 1; j <= count; j++) {
				var rackRearPlatform = {
					x: offsetXFirst + lenSection * j,
					y: 0,
					len: rackLen + 50,
					holderAng: parRacks.angMarsh,
					type: 'last'
				};
				racksRearPlatform.push(rackRearPlatform);
			}
		}
	}

	if (parRacks.marshLast.noDraw) {
		if (params.railingModel !== "Кованые балясины") {
			parRacks.marshLast.dxToMarshNext = 10;
			parRacks.marshLast.x += 10;
			parRacks.marshLast.y += 10 * Math.tan(parRacks.marshLast.holderAng);
		}
	}

	//формируем массив racks
	par.racks = [];
	if (parRacks.botFirst) par.racks.push(parRacks.botFirst);
	var isMarshFirst = false;
	if (par.stairAmt !== 0 || isWndP || isRearPlatform || marshPar.hasTopBalRailing.in) isMarshFirst = true;
	if (parRacks.marshFirst.x > parRacks.marshLast.x - 50) isMarshFirst = false;
	//if (marshPar.botTurn === "пол" && par.stairAmt < 2) isMarshFirst = false;

	if (isMarshFirst) {
		par.racks.push(parRacks.marshFirst);		
	}
	else {
		parRacks.isNotMarsh = true;
		if (parRacks.topLast)
			parRacks.marshLast.holderAng = parRacks.topLast.holderAng = parRacks.angTop;
	}
	//сюда вставить добавление средних стоек
	for (var i = 0; i < rackPos.length; i++){
		var prevPosition = parseInt(rackPos[i] - 1);
		par.racks.push({
			x: prevPosition * marshPar.b + offsetX, //Коррекция положения относительно ступени
			y: marshPar.h * rackPos[i],
			len: rackLen,
			holderAng: marshPar.ang,
			type: 'middle'
		});
    }
    if (racksRearPlatform) {
		$.each(racksRearPlatform, function(){
			par.racks.push(this);
		})
	}
	
	par.racks.push(parRacks.marshLast);
	if(parRacks.topLast) par.racks.push(parRacks.topLast);
	par.parRacks = parRacks;
}


//Считает позиции поручня исходя из заданных переменных
function calcHandrailPoints(par, parRacks) {

	var handrailPoints = [];
	var pointOffset = 80; //отступ торца поручня от базовой точки стойки

	//рассчитываем координаты верхней точки кронштейна стойки
	if(parRacks.botFirst) var botFirst = calcHolderTopPointMono(parRacks.botFirst);
	if(parRacks.marshFirst) var marshFirst = calcHolderTopPointMono(parRacks.marshFirst);
	if(parRacks.marshLast) var marshLast = calcHolderTopPointMono(parRacks.marshLast);
	if(parRacks.topLast) var topLast = calcHolderTopPointMono(parRacks.topLast);

	//формируем массив точек поручня по координатам стоек с учетом того, чтобы стык не попадал на лодочку

	//нижние точки
	if(parRacks.botFirst){
		if(par.botEnd == "площадка"){
			//pointOffset = 200; //180 отступ от края + 20 отступ от центра этой стойки
			pointOffset = 180; //160 отступ от края + 20 отступ от центра этой стойки
			var p1 = polar(botFirst, parRacks.botFirst.holderAng, -pointOffset); //todo: сделать стык с поручнем нижнего марша
		}
		if (par.botEnd == "забег") {
			var p1 = polar(botFirst, parRacks.botFirst.holderAng, -pointOffset);
		}
		var p2 = itercection(p1, botFirst, marshFirst, polar(marshFirst, parRacks.marshFirst.holderAng, 100))
		handrailPoints.push(p1);
		handrailPoints.push(p2);
	}
	if (!parRacks.botFirst && !parRacks.isNotMarsh){
		var p1 = polar(marshFirst, parRacks.marshFirst.holderAng, -pointOffset);
		handrailPoints.push(p1);
	}

	//верхние точки
	if(parRacks.topLast){
		if(par.topEnd == "площадка"){
			pointOffset = 150; //100 отступ от края + 40 профиль стойки следующего марша + 20 отступ от центра этой стойки
			var p1 = polar(topLast, parRacks.topLast.holderAng, pointOffset); //todo: сделать стык с поручнем верхнего марша
		}
		if(par.topEnd == "забег"){
			var p1 = polar(topLast, parRacks.topLast.holderAng, pointOffset);			
		}
		var p2 = itercection(p1, topLast, marshLast, polar(marshLast, parRacks.marshLast.holderAng, 100))
		if (parRacks.isNotMarsh) p2 = polar(marshLast, parRacks.marshLast.holderAng, -pointOffset);
		handrailPoints.push(p1);
		handrailPoints.push(p2);
	}
	if(!parRacks.topLast){
		var p1 = polar(marshLast, parRacks.marshLast.holderAng, pointOffset);
		if(parRacks.marshLast.noDraw){
			var temp = newPoint_xy(parRacks.marshLast, -par.rackProfile / 2, 0);
			p1 = itercection(marshFirst, p1, temp, polar(temp, Math.PI / 2, 100));
		}
		handrailPoints.push(p1);
	}

	return handrailPoints;
} //end of calcHandrailPoints

function calcRigelPoints(par, parRacks){
	//формируем массив базовых точек для ригелей
	var points = [];
	var basePoint = {};
	var nominalLen = 800;
	
	if(parRacks.botFirst){
		basePoint = newPoint_xy(parRacks.botFirst, 0, parRacks.botFirst.len - nominalLen);
		points.push(basePoint);
		};
		
	if (parRacks.marshFirst && !parRacks.isNotMarsh){
		basePoint = newPoint_xy(parRacks.marshFirst, 0, parRacks.marshFirst.len - nominalLen);
		//делаем ригели на площадке горизонтальными
		if(par.botEnd == 'площадка' && par.key !== "rear") basePoint.y = points[points.length - 1].y;
		points.push(basePoint);
		};
		
	if(parRacks.marshLast){
		basePoint = newPoint_xy(parRacks.marshLast, 0, parRacks.marshLast.len - nominalLen);
		basePoint = polar(basePoint, parRacks.marshLast.holderAng, -15);
		if (parRacks.isNotMarsh) basePoint = polar(basePoint, parRacks.marshLast.holderAng, +10);
		if (parRacks.marshLast.noDraw && parRacks.marshLast.dxToMarshNext)
			basePoint = newPoint_x1(basePoint, -parRacks.marshLast.dxToMarshNext, parRacks.marshLast.holderAng);
		points.push(basePoint);
		};
		
	if(parRacks.topLast){
		basePoint = newPoint_xy(parRacks.topLast, 0, parRacks.topLast.len - nominalLen);
		//делаем ригели на площадке горизонтальными
		if(par.topEnd == 'площадка') basePoint.y = points[points.length - 1].y;
		points.push(basePoint);
		};

	return points;
}

function calcHolderTopPointMono(rackPar){
	//фунция возвращает координаты верхней точки кронштейна поручня, рассчитанные на основе параметров стойки
	//параметры кронштейна поручня
	var botPartLen = 53;
	var topPartLen = 17 + 2 + 0.2; //0.2 - зазор для устранения погрешности округления, чтобы не показывались пересечения
	var point = newPoint_xy(rackPar, 0, rackPar.len + botPartLen);
	point = polar(point, rackPar.holderAng + Math.PI / 2, topPartLen);
	return point;
} //end of calcTopPoint


/** функция задает расположение и ориентацию отверстий под уголки в стойках марша кроме поворотных
	*расположение уголков изначально задается для ограждения с правой стороны марша. Для левой стороны выполняется модификация в конце функции
	*массив хранит следующие данные о каждом отверстии:
	*offset: отступ от нижней части стойки
	*anglePos: на какой грани расположен уголок. Грань определяется если смотреть на секцию ограждения так, чтобы она отрисовывалась слева снизу - направо вверх
	*@param marshId
	*@param type - является ли первой стойкой секции
*/
function setRackHoles(par) {
	var holes = [];
	var p0 = { x: 0, y: 0, }; //базовая точка на оси стойки на уровне верхней плоскости ступени
	//параметры марша
	var marshPar = getMarshParams(par.marshId);
	var prevMarshPar = getMarshParams(marshPar.prevMarshId);
	var nextMarshPar = getMarshParams(marshPar.nextMarshId);

	//верхнее отверстие
	var center1 = newPoint_xy(p0, 0, -params.treadThickness - par.banisterAngleOffset);
	center1.anglePos = 'сзади';
	if (params.stairModel == "П-образная трехмаршевая" && par.key == "in" && par.marshId == 1 && params.stairAmt2 == 0 && marshPar.topTurn == "площадка") {
		center1.anglePos = 'справа';
	}
	holes.push(center1)

	//нижнее отверстие
	if (par.type == 'middle') {
		var center2 = newPoint_xy(center1, 0, -marshPar.h);
		center2.anglePos = 'сзади';
		//уголок первой стойки к пригласительной ступени
		if (par.isFirstMove) center2.anglePos = 'слева';

		holes.push(center2);
	}

	//для левой стороны марша передние и задние уголки меняются местами
	if (marshPar.side[par.key] == "left") {
		for (var i = 0; i < holes.length; i++) {
			if (holes[i].anglePos == 'сзади') holes[i].anglePos = 'спереди';
			else if (holes[i].anglePos == 'спереди') holes[i].anglePos = 'сзади';
		}
	}

	par.holes = holes;
	return par;

}

/** функция задает расположение и ориентацию отверстий под уголки в стойках марша кроме поворотных
	*расположение уголков изначально задается для ограждения с правой стороны марша. Для левой стороны выполняется модификация в конце функции
	*массив хранит следующие данные о каждом отверстии:
	*offset: отступ от нижней части стойки
	*anglePos: на какой грани расположен уголок. Грань определяется если смотреть на секцию ограждения так, чтобы она отрисовывалась слева снизу - направо вверх
	*@param marshId
	*@param type - является ли первой стойкой секции
*/
function setRackHoles(par){
	var holes = [];
	var p0 = {x:0, y:0,}; //базовая точка на оси стойки на уровне верхней плоскости ступени
	//параметры марша
	var marshPar = getMarshParams(par.marshId);
	var prevMarshPar = getMarshParams(marshPar.prevMarshId);
	var nextMarshPar = getMarshParams(marshPar.nextMarshId);

	//верхнее отверстие
	var center1 = newPoint_xy(p0, 0, -params.treadThickness - par.banisterAngleOffset);
	center1.anglePos = 'сзади';
	if (params.stairModel == "П-образная трехмаршевая" && par.key == "in" && par.marshId == 1 && params.stairAmt2 == 0 && marshPar.topTurn == "площадка") {
		center1.anglePos = 'справа';
	}
	holes.push(center1)
	
	//нижнее отверстие
	if(par.type == 'middle'){
		var center2 = newPoint_xy(center1, 0, -marshPar.h);
		center2.anglePos = 'сзади';
		//уголок первой стойки к пригласительной ступени
		if (par.isFirstMove) center2.anglePos = 'слева';
		
		holes.push(center2);
	}
	
	//для левой стороны марша передние и задние уголки меняются местами
	if(marshPar.side[par.key] == "left"){
		for(var i=0; i < holes.length; i++){
			if (holes[i].anglePos == 'сзади') holes[i].anglePos = 'спереди';
			else if(holes[i].anglePos == 'спереди') holes[i].anglePos = 'сзади';
			}
	}
		
	par.holes = holes;	
	return par;

}


/** функция задает расположение и ориентацию отверстий под уголки в поворотных стойках
	*если столб единый для секции верхнего и нижнего марша, он отрисовывается вместе с секцией верхнего марша
	*расположение уголков изначально задается для ограждения с правой стороны марша. Для левой стороны выполняется модификация в конце функции
	*массив хранит следующие данные о каждом отверстии:
	*offset: отступ от нижней части стойки
	*anglePos: на какой грани расположен уголок. Грань определяется если смотреть на секцию ограждения так, чтобы она отрисовывалась слева снизу - направо вверх
	*@param marshId
	*@param type - является ли первой стойкой секции
*/
function setTurnRackHoles(par){
	var holes = [];
	var p0 = {x:0, y:0,}; //базовая точка на оси стойки на уровне верхней плоскости ступени
	//параметры марша
	var marshPar = getMarshParams(par.marshId);
	var prevMarshPar = getMarshParams(marshPar.prevMarshId);
	var nextMarshPar = getMarshParams(marshPar.nextMarshId);
	
	//костыль для совместимости со старым кодом - удалить
	var  rackParams = {}
	rackParams.nextStepH = marshPar.h;
	rackParams.holderAng = prevMarshPar.ang;
	rackParams.nextMarshAng = marshPar.ang;
	rackParams.additionalHolder = prevMarshPar.hasRailing.in; 
	
	//верхний уголок
	var center1 = newPoint_xy(p0, 0, -params.treadThickness - par.banisterAngleOffset);
	//center1.anglePos = 'сзади';
	//последняя стойка нижнего марша П-образной с площадкой
	//if(params.stairModel == "П-образная с площадкой" && par.type == 'turnRackEnd') center1.anglePos = 'справа';
		
	//holes.push(center1);
	
	//П-образный поворот
		
	if(params.stairModel == "П-образная с забегом"){
		
		//поворотный столб в начале секции верхнего марша
		
		if(par.type == 'turnRackStart'){
			//первая прямая ступень верхнего марша
			if (!marshPar.hasTopBalRailing.in) {
				center1.anglePos = 'сзади';
				holes.push(center1);
			}

			//6 забежная ступень
			var center = newPoint_xy(center1, 0, -marshPar.h);
			center.anglePos = 'сзади';
			holes.push(center);
			//5 забежная ступень
			var center = newPoint_xy(center, 0, -marshPar.h);
			center.anglePos = 'слева';
			holes.push(center);
			//4 забежная ступень
			var center = newPoint_xy(center, 0, -marshPar.h);
			center.anglePos = 'слева';
			holes.push(center);
			//3 забежная ступень
			var center = newPoint_xy(center, 0, -marshPar.h);
			center.anglePos = 'слева';
			holes.push(center);

			if (params.marshDist == 40) {
				//2 забежная ступень
				var center = newPoint_xy(center, 0, -marshPar.h);
				center.anglePos = 'спереди';
				holes.push(center);
				//1 забежная ступень
				var center = newPoint_xy(center, 0, -marshPar.h);
				center.anglePos = 'спереди';
				holes.push(center);
			}
		}
			
		//поворотный столб в конце секции нижнего марша
		if(par.type == 'turnRackEnd'){
			//последняя прямая ступень нижнего марша
			var center = newPoint_xy(center1, 0, -marshPar.h);
			center.anglePos = 'сзади';
			holes.push(center);
			
			//первая забежная ступень
			center1.anglePos = 'сзади';
			holes.push(center1);
			
			//вторая забежная ступень
			var center = newPoint_xy(center1, 0, marshPar.h_topWnd);
			center.anglePos = 'сзади';
			holes.push(center);
			
			//третья забежная ступень
			var center = newPoint_xy(center, 0, marshPar.h_topWnd);
			center.anglePos = 'справа';
			holes.push(center);
		}
	}


	if(params.stairModel == "П-образная с площадкой"){
	
		//поворотный столб в начале секции верхнего марша
		if(par.type == 'turnRackStart'){
			//первая прямая ступень верхнего марша
			if (!marshPar.hasTopBalRailing.in) {
				center1.anglePos = 'сзади';
				holes.push(center1);
			}

			//площадка
			var center = newPoint_xy(center1, 0, -marshPar.h);
			center.anglePos = 'слева';
			holes.push(center);
			}
			
		//поворотный столб в конце секции нижнего марша
		if(par.type == 'turnRackEnd'){
			//площадка
			center1.anglePos = 'справа';
			holes.push(center1);
			
			//последняя прямая ступень нижнего марша
			var center = newPoint_xy(center1, 0, -marshPar.h);
			center.anglePos = 'сзади';
			holes.push(center);
		}
	}
		
	
		
	//Г-образный поворот
	
	if(params.stairModel != "П-образная с площадкой" && params.stairModel != "П-образная с забегом"){
		
	//поворотный столб в начале секции верхнего марша
		
		if(par.type == 'turnRackStart'){
			if(marshPar.botTurn == "забег"){
				//первая прямая ступень верхнего марша
				if (!marshPar.hasTopBalRailing.in) {
					center1.anglePos = 'сзади';
					holes.push(center1);
				}

				//третья забежная ступень
				var center = newPoint_xy(center1, 0, -marshPar.h);
				center.anglePos = 'сзади';
				holes.push(center);
				
				//вторая забежная ступень
				var center = newPoint_xy(center, 0, -marshPar.h);
				center.anglePos = 'слева';
				holes.push(center);
				
				//первая забежная ступень
				var center = newPoint_xy(center, 0, -marshPar.h);
				center.anglePos = 'слева';
				holes.push(center);

			}

			if (marshPar.botTurn == "площадка") {
				//первая прямая ступень верхнего марша
				center1.anglePos = 'сзади';
				holes.push(center1);
				
				//площадка
				var center = newPoint_xy(center1, 0, -marshPar.h);
				center.anglePos = 'слева';
				holes.push(center);

			}

			//последняя прямая ступень нижнего марша
			if (!(params.stairModel == "П-образная трехмаршевая" && par.marshId == 3 && params.stairAmt2 == 0 && params.turnType_1 !== "забег")) {
				var center = newPoint_xy(center, 0, -prevMarshPar.h);
				center.anglePos = 'слева';
				if(!par.isFirstFlan) holes.push(center);
			}

		}
		
		//поворотный столб в конце секции нижнего марша
		
		if(par.type == 'turnRackEnd'){
			if(marshPar.topTurn == "забег"){
				//последняя прямая ступень нижнего марша
				var center = newPoint_xy(center1, 0, -marshPar.h);
				center.anglePos = 'сзади';
				holes.push(center);
				
				//первая забежная ступень
				center1.anglePos = 'сзади';
				holes.push(center1);
				
				//вторая забежная ступень
				var center = newPoint_xy(center1, 0, marshPar.h_topWnd);
				center.anglePos = 'сзади';
				holes.push(center);
				
				//третья забежная ступень
				var center = newPoint_xy(center, 0, marshPar.h_topWnd);
				center.anglePos = 'справа';
				holes.push(center);
			}
			
			if(marshPar.topTurn == "площадка"){
				//площадка
				center1.anglePos = 'сзади';
				holes.push(center1);
				
				//последняя прямая ступень нижнего марша
				var center = newPoint_xy(center1, 0, -marshPar.h);
				center.anglePos = 'сзади';
				holes.push(center);
			}
		}
	}

		
	//для левой лестницы передние и задние уголки меняются метсами
	if(marshPar.side[par.key] == "left"){
		for(var i=0; i < holes.length; i++){
			if (holes[i].anglePos == 'сзади') holes[i].anglePos = 'спереди';
			else if(holes[i].anglePos == 'спереди') holes[i].anglePos = 'сзади';
			}
		}
		

	par.holes = holes;

	return par;

}//end of setTurnRackHoles



function drawLastRackFlan(par){
	if(!par) par = {};
	if(!par.material) par.material = params.materials.metal2;
	if(!par.dxfArr) par.dxfArr = dxfPrimitivesArr;
	if(!par.dxfBasePoint){
		par.dxfBasePoint = {x:0, y:0};
		dxfArr = [];
		}
	var len = 100;
	var width = 120;
	var boltHoleDiam = 13;
	var screwHoleDiam = 8;
	var flanThk = 8;
	par.mesh = new THREE.Object3D(0);
	
	var points = [];
	var p0 = {x: 0,	y: 0,}; //точка на оси стойки на уровне верха ступени
	
	
	//верхние точки
	var p1 = newPoint_xy(p0, -width / 2, len / 2);
	var p2 = newPoint_xy(p0, width / 2, len / 2);
	var p3 = newPoint_xy(p0, width / 2, -len / 2);
	var p4 = newPoint_xy(p0, -width / 2, -len / 2);
	points.push(p1, p2, p3, p4)
	
	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		radOut: 10,
    }
    //shapePar.drawing = {
    //    name: "Фланец стойки ограждения",
    //    group: "carcasFlans",
    //    marshId: 3,
    //    isCount: true,//указывает что надо будет потом подсчитать общее количество
    //}

	var shape = drawShapeByPoints2(shapePar).shape;
	
	//отверстия под шурупы
	var holeOffset = 15;
	var center1 = newPoint_xy(p1, holeOffset, -holeOffset)
	var center2 = newPoint_xy(p2, -holeOffset, -holeOffset)
	var center3 = newPoint_xy(p3, -holeOffset, holeOffset)
	var center4 = newPoint_xy(p4, holeOffset, holeOffset)
	//Отмечаем тип зенковки, для свг
	center1.holeData = {zenk: 'no'};
	center2.holeData = {zenk: 'no'};
	center3.holeData = {zenk: 'no'};
	center4.holeData = {zenk: 'no'};

	if (!testingMode) {
		var screwPar = {
			id: "screw_6x32",
			description: "Крепление ступеней",
			group: "Ступени"
		}
		var screw = drawScrew(screwPar).mesh;
		screw.position.x = center1.x;
		screw.position.z = center1.y;
		par.mesh.add(screw);

		var screw = drawScrew(screwPar).mesh;
		screw.position.x = center2.x;
		screw.position.z = center2.y;
		par.mesh.add(screw);

		var screw = drawScrew(screwPar).mesh;
		screw.position.x = center3.x;
		screw.position.z = center3.y;
		par.mesh.add(screw);

		var screw = drawScrew(screwPar).mesh;
		screw.position.x = center4.x;
		screw.position.z = center4.y;
		par.mesh.add(screw);
	}
	
	var holeCenters = [center1, center2, center3, center4];
	
	//центральные отверстия
	var center5 = newPoint_xy(p0, 30, 0)
	var center6 = newPoint_xy(p0, -30, 0)
	center5.holeRad = center6.holeRad = boltHoleDiam / 2;
	holeCenters.push(center5, center6)
	
	var holesPar = {
		holeArr: holeCenters,
		dxfBasePoint: par.dxfBasePoint,
		shape: shape,
		holeRad: screwHoleDiam / 2,
		}
	addHolesToShape(holesPar);
	
	
	
	
	var extrudeOptions = {
		amount: flanThk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
		};
		
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.metal2);
	mesh.rotation.x = -Math.PI / 2;
	
	par.mesh.add(mesh)

	if (!testingMode) {
		if (typeof anglesHasBolts != "undefined" && anglesHasBolts && !par.noBolts) { //anglesHasBolts - глобальная переменная)

			//верхние болты
			var boltPar = {
				diam: 10,
				len: 20,
				headType: "потай",
				noNut: true,
			}

			var bolt1 = drawBolt(boltPar).mesh;

			bolt1.rotation.x = Math.PI;
			bolt1.position.x = center5.x;
			bolt1.position.y = -5 / 2;
			par.mesh.add(bolt1);

			var bolt2 = drawBolt(boltPar).mesh;

			bolt2.rotation.x = Math.PI;
			bolt2.position.x = center6.x;
			bolt2.position.y = -5 / 2;
			par.mesh.add(bolt2);
		}
	}

	//сохраняем данные для спецификации
	var partName = "lastRackFlan";
	if(typeof specObj !='undefined'){
		if(!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Фланец L-образной стойки",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
				}
			}
		var name = len + "x" + width;
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}
	
	par.mesh.specId = partName + name;
	return par;
	
} //end of drawLastRackFlan

/** функция добавляет уголки стоек по массиву координат отверстий
*@param holeCenters
*@param railingSide


*/

function addRackAngles(par){

	par.mesh = new THREE.Object3D();
	var rackProfile = 40;
	
	for(var i=0; i < par.holeCenters.length; i++){
		var angleParams = drawBanisterAngle();
		var angle = angleParams.mesh;		
		angle.position.y = par.holeCenters[i].y - angleParams.holeOffset;

		if(par.holeCenters[i].anglePos == 'слева') {
			angle.rotation.y = -Math.PI / 2;
			angle.position.x = -rackProfile / 2;
			angle.position.z = rackProfile / 2;		
			}
			
		if(par.holeCenters[i].anglePos == 'справа') {
			angle.rotation.y = Math.PI / 2			
			angle.position.x = rackProfile / 2;
			angle.position.z = rackProfile / 2;
		}

		if (par.holeCenters[i].anglePos == 'сзади') {
			angle.rotation.y = Math.PI;
			angle.position.z = 0;			
		}
		
		if (par.holeCenters[i].anglePos == 'спереди') {
			angle.rotation.y = 0;
			angle.position.z = rackProfile;
			
		}
		par.mesh.add(angle);
		
		//добавляем выноску в dxf
		var text = "неизвестно";
		if(par.holeCenters[i].anglePos) text = par.holeCenters[i].anglePos
		addLeader(text, 30, 70, 60, dxfPrimitivesArr, par.holeCenters[i], par.dxfBasePoint);
		
	}
	return par;

}//end of addRackAngles

