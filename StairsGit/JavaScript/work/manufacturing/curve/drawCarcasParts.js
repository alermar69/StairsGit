
/**
	Функция рассчитывает точки контуров забежных ступеней

	@return pointsTreads - точки контуров ступеней, linesTreads - точки передней и задней линии ступени
*/
function calcPointsWndTreads() {

	var pointsTreads = [];
	var linesTreads = [];

	var ang = Math.PI / 2 / params.countWndTread;

	var p0 = { x: 0, y: 0 };
	var p1 = newPoint_xy(p0, 0, params.sizeTurn);
	var p2 = newPoint_xy(p1, params.sizeTurn, 0);
	var p3 = newPoint_xy(p0, params.sizeTurn, 0);
	var center = copyPoint(p3);

	var pBotMarshIn = newPoint_xy(p0, params.M, 0);
	var pTopMarshIn = newPoint_xy(p2, 0, -params.M);

	var lineBotMarshOut = { p1: p0, p2: p1 }
	var lineTopMarshOut = { p1: p1, p2: p2 }

	var lineBotMarshIn = { p1: pBotMarshIn, p2: polar(pBotMarshIn, Math.PI / 2, 100) }
	var lineTopMarshIn = { p1: pTopMarshIn, p2: polar(pTopMarshIn, 0, 100) }

	var countWndTread = params.countWndTread;

	for (var i = 0; i < countWndTread; i++) {

		var angTreadFront = Math.PI - ang * i;
		var angTreadBack = Math.PI - ang * (i + 1);
		var lineFront = { p1: center, p2: polar(center, angTreadFront, 100) }
		var lineBack = { p1: center, p2: polar(center, angTreadBack, 100) }

		var isMiddleTread = false;
		if (i == Math.ceil(countWndTread / 2) - 1) isMiddleTread = true;

		// все ступени кроме средней
		if (!isMiddleTread) {
			var lineMarshOut = lineBotMarshOut;
			var lineMarshIn = lineBotMarshIn;
			if (i >= Math.floor(params.countWndTread / 2)) {
				lineMarshOut = lineTopMarshOut;
				lineMarshIn = lineTopMarshIn;
			}

			var pt1 = itercectionLines(lineMarshOut, lineFront);
			var pt2 = itercectionLines(lineMarshOut, lineBack);
			var pt3 = itercectionLines(lineMarshIn, lineBack);
			var pt4 = itercectionLines(lineMarshIn, lineFront);

			var ptNose = polar(pt3, angTreadBack - Math.PI / 2, params.nose);
			var lineNose = { p1: ptNose, p2: polar(ptNose, angTreadBack, 100) }
			var pt2 = itercectionLines(lineMarshOut, lineNose);
			var pt3 = itercectionLines(lineMarshIn, lineNose);

			pointsTreads.push(roundPoints([pt1, pt2, pt3, pt4]));

			var lines = {
				front: { p1: pt1, p2: pt4 },
				back: { p1: pt2, p2: pt3 },
			};
			linesTreads.push(lines)
		}

		// средняя ступень
		if (isMiddleTread) {
			var pt1 = itercectionLines(lineBotMarshOut, lineFront);
			var pt2 = copyPoint(p1);
			var pt3 = itercectionLines(lineTopMarshOut, lineBack);
			var pt4 = itercectionLines(lineTopMarshIn, lineBack);
			var pt5 = itercectionLines(lineBotMarshIn, lineTopMarshIn);
			var pt6 = itercectionLines(lineBotMarshIn, lineFront);

			var ptNose = polar(pt3, angTreadBack - Math.PI / 2, params.nose);
			var lineNose = { p1: ptNose, p2: polar(ptNose, angTreadBack, 100) }
			var pt3 = itercectionLines(lineTopMarshOut, lineNose);
			var pt4 = itercectionLines(lineTopMarshIn, lineNose);

			pointsTreads.push(roundPoints([pt1, pt2, pt3, pt4, pt5, pt6]));

			var lines = {
				front: { p1: pt1, p2: pt6 },
				back: { p1: pt3, p2: pt4 },
			};
			linesTreads.push(lines)
		}
	}
	return { pointsTreads: pointsTreads, linesTreads: linesTreads };
}

/**
	Функция рассчитывает длины проступей (внешних и внуренних) забежных ступеней

	@return lengths - длины проступей, lenStraights - длины прямых участков в начале и в конце поворота
*/
function calcLengthsWndTreads() {
	
	var lengths = []; // длины проступей
	var lenStraights = { bot: 0, top: 0}; //длины прямых участков в начале и в конце поворота

	var linesTreads = calcPointsWndTreads().linesTreads; // точки передней и задней линии ступени

	var p0 = { x: 0, y: 0 };
	var pMiddleMarsh = newPoint_xy(p0, params.M / 2, 0);
	var center = { x: params.M, y: params.sizeTurn - params.M }; // центр поворота

	var countWndTread = params.countWndTread;

	for (var i = 0; i < countWndTread; i++) {

		var length = {};
		
		var lineFront = { p1: newPoint_xy(linesTreads[0].front.p1, 0, 50), p2: newPoint_xy(linesTreads[0].front.p2, 0, 50)}
		if(i !== 0) var lineFront = { p1: linesTreads[i - 1].back.p1, p2: linesTreads[i - 1].back.p2 }		
		var lineBack = { p1: linesTreads[i].back.p1, p2: linesTreads[i].back.p2 }			

		var numberMiddleTread = Math.ceil(params.countWndTread / 2) - 1;
		
		//расчет проступей до средней забежной ступени
		if (i < numberMiddleTread) {
			var lenStraightBot = 0;
			var lenStraightTop = 0;
			for (var j = 0; j < 2; j++) { // j=0 - out, j=1 - in 
				if (j == 0) {
					var key = 'out';
					var rad = params.M / 2 + params.stringerThickness / 2;
				}
				if (j == 1) {
					key = 'in';
					var rad = params.M / 2 - params.stringerThickness / 2 + params.metalThickness;
				}
				
				var pBox = newPoint_xy(pMiddleMarsh, -params.stringerThickness / 2, 0);
				if (j == 1) pBox.x += params.stringerThickness - params.metalThickness;
				var lineBox = { p1: pBox, p2: newPoint_xy(pBox, 0, 100) } // линия прямой тетивы
				
				// пересечение тетивы с окружностью поворота
				var pBox_Circle = itercectionLineCircle1(lineBox, center, rad)[0] 
				
				// пересечение тетивы с передней линией ступени
				var pBox_lineFront = itercectionLines(lineBox, lineFront);

				var isItercectionLine = true;  //пересечение передней линии с прямой
				if (pBox_Circle.y < pBox_lineFront.y) isItercectionLine = false;//пересечение передней линии с окружностью
				if (!isItercectionLine) {
					var points = itercectionLineCircle1(lineFront, center, rad);
					var pBox_lineFront = points[1]
					if (points[0].x < center.x) pBox_lineFront = points[0];
				}
				pBox_lineFront.isItercectionLine = isItercectionLine;
				
				// пересечение тетивы с задней линией ступени
				var pBox_lineBack = itercectionLines(lineBox, lineBack);

				var isItercectionLine = true;  //пересечение задней линии с прямой
				if (pBox_Circle.y < pBox_lineBack.y) isItercectionLine = false;//пересечение задней линии с окружностью
				if (!isItercectionLine) {
					var points = itercectionLineCircle1(lineBack, center, rad);
					var pBox_lineBack = points[1]
					if (points[0].x < center.x) pBox_lineBack = points[0];
				}
				pBox_lineBack.isItercectionLine = isItercectionLine;
				
				// рассчитываем длину проступи
				var len = 0;
				var delta = 0;
				// если пересечение передней и задней линии ступени с прямыми
				if (pBox_lineFront.isItercectionLine && pBox_lineBack.isItercectionLine) {
					delta = pBox_lineBack.y - pBox_lineFront.y; //кусок прямой линии
					len += delta;
				}
				// если пересечение передней с прямой, задней с окружностью
				if (pBox_lineFront.isItercectionLine && !pBox_lineBack.isItercectionLine) {
					delta = pBox_Circle.y - pBox_lineFront.y; //кусок прямой линии
					len += delta;
					
					var ang = angleLines(center, pBox_Circle, center, pBox_lineBack);
					len += rad * ang; //длина сегмента
				}
				// если пересечение передней и задней с окружностью
				if(!pBox_lineFront.isItercectionLine && !pBox_lineBack.isItercectionLine) {
					var ang = angleLines(center, pBox_lineFront, center, pBox_lineBack);
					len += rad * ang; //длина сегмента
				}
				
				// запоминаем длину прямого участка
				if (j == 0) {
					lenStraights.bot += delta;
				}
				
				length[key]= len;
			}
			lengths.push(length);
		}
		
		//расчет проступи средней забежной ступени
		if(i == numberMiddleTread){
			for (var j = 0; j < 2; j++) { // j=0 - out, j=1 - in 		
				var rad = params.M / 2 + params.stringerThickness / 2;

				if (j == 0) {
					var key = 'out';
					var rad = params.M / 2 + params.stringerThickness / 2 - params.metalThickness / 2;
					var radBot = params.M / 2 + params.stringerThickness / 2;
					var radTop = radBot - params.metalThickness;
				}
				if (j == 1) {
					key = 'in';
					var rad = params.M / 2 - params.stringerThickness / 2 + params.metalThickness / 2;
					var radBot = params.M / 2 - params.stringerThickness / 2 + params.metalThickness;
					var radTop = radBot - params.metalThickness;
				}
				
				var points = itercectionLineCircle1(lineFront, center, radBot);
				var pBox_lineFront = points[1]
				if (points[0].x < center.x) pBox_lineFront = points[0];
				
				var points = itercectionLineCircle1(lineBack, center, radTop);
				var pBox_lineBack = points[1]
				if (points[0].y > center.y) pBox_lineBack = points[0];
				
				var ang = angleLines(center, pBox_lineFront, center, pBox_lineBack);
				var len = rad * ang;
				
				length[key] = len;
			}
			lengths.push(length);
		}

		//расчет проступей после средней забежной ступени
		if(i > numberMiddleTread){	
			var pMiddleMarsh = newPoint_xy(p0, 0, params.sizeTurn - params.M / 2);
			for (var j = 0; j < 2; j++) { // j=0 - out, j=1 - in 	
				if (j == 0) {
					var key = 'out';
					var rad = params.M / 2 + params.stringerThickness / 2 - params.metalThickness;
				}
				if (j == 1) {
					key = 'in';
					var rad = params.M / 2 - params.stringerThickness / 2;
				}
				
				
				var pBox = newPoint_xy(pMiddleMarsh, 0, params.stringerThickness / 2 - params.metalThickness);
				if (j == 1) var pBox = newPoint_xy(pMiddleMarsh, 0, -params.stringerThickness / 2);
				var lineBox = { p1: pBox, p2: newPoint_xy(pBox, 100, 0) }

				
				// пересечение тетивы с окружностью поворота
				var pBox_Circle = itercectionLineCircle1(lineBox, center, rad)[0]
				
				// пересечение тетивы с передней линией ступени
				var pBox_lineFront = itercectionLines(lineBox, lineFront);	

				var isItercectionLine = true;  //пересечение передней линии с окружностью
				if (pBox_Circle.x > pBox_lineFront.x) isItercectionLine = false;
				if (!isItercectionLine) {
					var points = itercectionLineCircle1(lineFront, center, rad);
					var pBox_lineFront = points[1]
					if (points[0].y > center.y) pBox_lineFront = points[0];
				}
				pBox_lineFront.isItercectionLine = isItercectionLine;
				
				// пересечение тетивы с задней линией
				var pBox_lineBack = itercectionLines(lineBox, lineBack);

				var isItercectionLine = true;  //пересечение задней линии с окружностью
				if (pBox_Circle.x > pBox_lineBack.x) isItercectionLine = false;
				if (!isItercectionLine) {
					var points = itercectionLineCircle1(lineBack, center, rad);
					var pBox_lineBack = points[1]
					if (points[0].y > center.y) pBox_lineBack = points[0];
				}
				pBox_lineBack.isItercectionLine = isItercectionLine;
				
				// рассчитываем длину проступи
				var len = 0;
				var delta = 0;
				// если пересечение передней и задней линии ступени с прямыми
				if (pBox_lineFront.isItercectionLine && pBox_lineBack.isItercectionLine) {					
					delta += pBox_lineBack.x - pBox_lineFront.x;
					len += delta;
				}
				// если пересечение передней с окружностью, задней с прямой
				if(!pBox_lineFront.isItercectionLine && pBox_lineBack.isItercectionLine) {
					delta = pBox_lineBack.x - pBox_Circle.x;
					len += delta;
					
					var ang = angleLines(center, pBox_Circle, center, pBox_lineFront);
					len += rad * ang;
				}
				// если пересечение передней и задней с окружностью
				if(!pBox_lineFront.isItercectionLine && !pBox_lineBack.isItercectionLine) {
					var ang = angleLines(center, pBox_lineFront, center, pBox_lineBack);
					len += rad * ang;
				}
				
				// запоминаем длину прямого участка
				if (j == 0) {
					lenStraights.top += delta
				}
				
				length[key] = len;
			}
			lengths.push(length);
		}
		
	}
	
	return { lengths: lengths, lenStraights: lenStraights};
}

/**
	Функция разбивает полный shape забежной тетивы на сегменты для модели (чтобы можно было повернуть каждый сегмент)

	@return массив точек сегментов для shape
*/
function calcPointsShapesWnd(points) {
	var lenStraights = calcLengthsWndTreads().lenStraights; //длины прямых участков в начале и в конце поворота

	var p1 = newPoint_xy(points[0], lenStraights.bot, 0);
	var p2 = newPoint_xy(points[points.length - 1], -lenStraights.top, 0);

	var pointsDivide = {}

	var isPFirst = false;
	var isPLast = false;
	var pointsBot = [];
	var pointsTop = [];
	var pointsTurn = [];

	// разбиваем общий контур на 3 контура: 
	// контур прямого участка нижнего марша
	// контур прямого участка верхнего марша
	// поворотный контур
	for (var i = 0; i < points.length; i++) {
		// контур прямого участка нижнего марша
		if (!isPFirst) {
			if (points[i].x < p1.x) {
				pointsBot.push(copyPoint(points[i]))
			}
			else {
				var pt1 = itercection(p1, polar(p1, Math.PI / 2, 100), points[i], polar(points[i], 0, 100));
				pointsBot.push(pt1)
				pointsTurn.push(pt1);
				isPFirst = true;
			}
		}

		// поворотный контур
		var pt = p2;
		if ((points[i].x > p1.x) && (points[i].x < pt.x)) {
			pointsTurn.push(copyPoint(points[i]));
		}

		// контур прямого участка верхнего марша
		if (points[i].x > p2.x) {
			if (!isPLast) {
				var pt1 = itercection(p2, polar(p2, Math.PI / 2, 100), points[i], polar(points[i], 0, 100));
				pointsTop.push(pt1);

				pointsTurn.push(pt1);
				isPLast = true;
			}
			pointsTop.push(copyPoint(points[i]))
		}

	}

	pointsDivide.pointsBot = pointsBot;
	pointsDivide.pointsTurn = pointsTurn;
	pointsDivide.pointsTop = pointsTop;

	return pointsDivide;
}

/**
	Функция разбивает поворотный контур на сегменты для модели (чтобы можно было повернуть каждый сегмент)

	@return массив точек сегментов для shape
*/
function calcTurnPointsShapes(pointsTurn) {

	var arr = []

	// разбиваем поворотный контур на сегменты
	var parDivide = {
		points: roundPoints(pointsTurn),
		step: params.maxSizeSegment,
		isEnd: true,
	}

	while (parDivide.isEnd) {
		divideWndShape(parDivide);
		arr.push(parDivide.pointsStart)
	}

	return arr;
}

/**
	Функция разбивает поворотный контур на сегменты с шагом par.step

	@return par.pointsStart - точки нового сегмента, par.points - остаток контура
*/
function divideWndShape(par) {
	var points = par.points;
	var start = 1;

	var p0 = copyPoint(points[0]);
	var p01 = copyPoint(points[1]);

	var p1 = newPoint_xy(points[start], par.step, 0);

	var p20 = points[0];
	var p21 = points[points.length - 1];

	var arr = [];
	var arr1 = [];

	if (points[points.length - 2].x > p1.x) {
		var flag = true;
		for (var i = start + 1; i < points.length; i++) {
			if (flag) {
				if (points[i].x < p1.x) {
					arr.push(copyPoint(points[i]))
				}
				else {
					var pt1 = itercection(p1, polar(p1, Math.PI / 2, 100), points[i], polar(points[i], 0, 100));
					var pt2 = itercection(p1, polar(p1, Math.PI / 2, 100), p20, p21);
					
					arr.unshift(p01)
					arr.unshift(p0)
					arr.push(pt1)
					arr.push(pt2)
					
					arr1.push(copyPoint(pt2))
					arr1.push(copyPoint(pt1))
					flag = false;
				}
			}
			if (!flag) {
				arr1.push(copyPoint(points[i]))
			}
		}
		par.pointsStart = arr;
		par.points = arr1;
		
	}
	else {
		par.isEnd = false;
		par.pointsStart = par.points;
	}

	return par;
}

/**
	Функция отрисовки параметрической задней пластины на забеге на гнутом коробе
*/
function drawTurnBackCurve(par) {

	var drawTurnBackCurve = function (u, v, target) {

		var angle = -Math.PI / 2;
		var radOut = params.M / 2 + params.stringerThickness / 2 - params.metalThickness;
		var radIn = params.M / 2 - params.stringerThickness / 2 + params.metalThickness;
		var height = par.height;

		var x = radOut * u * Math.cos(v * angle) * turnFactor;
		var y = radOut * u * Math.sin(v * angle)// * turnFactor;
		var z = height * v;

		if (x * x + y * y < radIn * radIn) {
			x = radIn * Math.cos(v * angle) * turnFactor;
			y = radIn * Math.sin(v * angle)// * turnFactor;
		}

		target.set(x, y, z);
	}

	var geom = new THREE.ParametricGeometry(drawTurnBackCurve, 120, 120, false);

	var stringerMaterial = new THREE.MeshLambertMaterial({
		color: 0x363636,
		wireframe: false
	});
	stringerMaterial.side = THREE.DoubleSide;

	var mesh = new THREE.Mesh(geom, stringerMaterial)

	par.mesh = mesh;
	return par;

} //end of drawTurnBackCurve


/**
	Функция отрисовки блока подложек забежных ступеней для лестницы на гнутом коробе
*/
function drawTurnPlatesCurve(par) {

	//задаем параметры детали
	par.cornerRad = 20;
	par.width = params.M / 2;
	par.thk = params.treadPlateThickness;

	par.mesh = new THREE.Object3D();

	var linesTreads = calcPointsWndTreads().linesTreads; // точки передней и задней линии ступени

	var lenPlate = par.width;

	var points = calcItersectionStringTreads(params.M / 2).points;

	var radOut = params.M / 2 + params.stringerThickness / 2;
	var radIn = params.M / 2 - params.stringerThickness / 2;
	var pointsOut = calcItersectionStringTreads(radOut).points;
	var pointsIn = calcItersectionStringTreads(radIn).points;

	var center = { x: params.M, y: params.sizeTurn - params.M }; // центр поворота


	for (var i = 0; i < points.length; i++) {

		var lineFront = { p1: newPoint_xy(linesTreads[0].front.p1, 0, 50), p2: newPoint_xy(linesTreads[0].front.p2, 0, 50) }
		if (i !== 0) var lineFront = { p1: linesTreads[i - 1].back.p1, p2: linesTreads[i - 1].back.p2 }
		var lineBack = { p1: linesTreads[i].back.p1, p2: linesTreads[i].back.p2 }

		var numberMiddleTread = Math.ceil(params.countWndTread / 2) - 1;

		var angFront = calcAngleX1(lineFront.p1, lineFront.p2);
		var angBack = calcAngleX1(lineBack.p1, lineBack.p2);
		if (angBack > 0) angBack *= -1;

		var isBotMarsh = true;
		if (i > numberMiddleTread) isBotMarsh = false;

		//подложки до средней забежной ступени
		if (isBotMarsh) {
			var p0 = points[i].pFront;

			var ptOut = polar(p0, angFront, -lenPlate / 2)
			var lineOut = { p1: ptOut, p2: polar(ptOut, angFront + Math.PI / 2, 100) }

			var ptIn = polar(p0, angFront, lenPlate / 2)
			var lineIn = { p1: ptIn, p2: polar(ptIn, angFront + Math.PI / 2, 100) }
		}

		//подложки после средней забежной ступени
		if (!isBotMarsh) {
			var p0 =points[i].pBack;

			var ptOut = polar(p0, angBack, -lenPlate / 2)
			var lineOut = { p1: ptOut, p2: polar(ptOut, angBack + Math.PI / 2, 100) }

			var ptIn = polar(p0, angBack, lenPlate / 2)
			var lineIn = { p1: ptIn, p2: polar(ptIn, angBack + Math.PI / 2, 100) }
		}

		var p1 = itercectionLines(lineOut, lineFront);
		var p2 = itercectionLines(lineOut, lineBack);
		var p3 = itercectionLines(lineIn, lineBack);
		var p4 = itercectionLines(lineIn, lineFront);

		var arr = [p1, p2, p3, p4];
		if (turnFactor == -1)
			arr = mirrowPointsMiddleX(arr);

		//создаем шейп
		var shapePar = {
			points: arr,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: par.dxfBasePoint,
			radOut: par.cornerRad, //радиус скругления внешних углов

		}
		shapePar.drawing = {
			name: "Подложка забежной ступени",
			group: "carcasFlans",
			marshId: par.marshId,
		}

		var shape = drawShapeByPoints2(shapePar).shape;

		//прямоугольный вырез в центре детали------------------------------

		var holesPar = {
			points: [pointsOut[i].pFront, pointsOut[i].pBack, pointsIn[i].pBack, pointsIn[i].pFront],
			dx: 40,
			dy: 40,
		}

		var arr = moovePointsPathToIn(holesPar).points.reverse();
		if (turnFactor == -1)
			arr = mirrowPointsMiddleX(arr);

		var holeParams = {
			vertexes: arr,
			cornerRad: 10.0,
			dxfPrimitivesArr: dxfPrimitivesArr,
			dxfBasePoint: par.dxfBasePoint
		}

		shape.holes.push(topCoverCentralHole(holeParams));

		//отверстия для болтов--------------------------------------------------------
		var holesPar = {
			points: [pointsOut[i].pFront, pointsOut[i].pBack, pointsIn[i].pBack, pointsIn[i].pFront],
			dx: 20,
			dy: 20,
		}

		par.holesBolt = moovePointsPathToIn(holesPar).points;
		if (turnFactor == -1)
			par.holesBolt = mirrowPointsMiddleX(par.holesBolt);
		for (var j = 0; j < par.holesBolt.length; j++) {
			addRoundHole(shape, dxfPrimitivesArr, par.holesBolt[j], 6.5, par.dxfBasePoint);
		}


		//отверстия для шурупов крепления ступени-----------------------------------------
		var holesPar = {
			points: [p1, p2, p3, p4],
			dx: 20,
			dy: 20,
		}

		par.holes = moovePointsPathToIn(holesPar).points;
		if (turnFactor == -1)
			par.holes = mirrowPointsMiddleX(par.holes);
		par.holeRad = 5;

		//Отмечаем тип зенковки, для свг
		par.holes.forEach(function (element) { element.holeData = { zenk: 'no' } });

		for (var j = 0; j < par.holes.length; j++) {
			addRoundHole(shape, dxfPrimitivesArr, par.holes[j], par.holeRad, par.dxfBasePoint);
		}


		var extrudeOptions = {
			amount: par.thk,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};

		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var plate = new THREE.Mesh(geom, params.materials.metal);
		plate.rotation.x = -Math.PI / 2;
		plate.rotation.z = -Math.PI / 2;
		plate.position.y = par.h_topWnd * i;

		//саморезы
		var screwPar = {
			id: "screw_6x32",
			description: "Крепление ступеней",
			group: "Ступени"
		}

		for (var j = 0; j < par.holes.length; j++) {
			var screw = drawScrew(screwPar).mesh;
			screw.position.x = par.holes[j].x;
			screw.position.y = par.holes[j].y;
			screw.rotation.x = Math.PI / 2;
			plate.add(screw);
		}

		//болты
		var boltPar = {
			diam: boltDiam,
			len: boltLen,
			headType: "потай",
		}

		for (var j = 0; j < par.holesBolt.length; j++) {
			var bolt = drawBolt(boltPar).mesh;
			bolt.position.x = par.holesBolt[j].x;
			bolt.position.y = par.holesBolt[j].y;
			bolt.position.z = -boltLen / 2 + params.treadPlateThickness - 0.01;
			bolt.rotation.x = -Math.PI / 2;
			plate.add(bolt);
		}

		par.mesh.add(plate);

		var partName = "treadPlateWnd";
		if (typeof specObj != 'undefined') {
			if (!specObj[partName]) {
				specObj[partName] = {
					types: {},
					amt: 0,
					name: "Подложка забежная",
					metalPaint: true,
					timberPaint: false,
					division: "metal",
					workUnitName: "amt", //единица измерения
					group: "Каркас",
				}
			}
			var name = "";//Math.round(par.width) + "х" + Math.round(distance(p1,p2)) + "х" + Math.round(par.thk);
			var area = par.width * distance(p1, p2) / 1000000;
			if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
			if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
			specObj[partName]["amt"] += 1;
			specObj[partName]["area"] += area;
		}
		par.mesh.specId = partName + name;



		//---------------------------------------
		//расчет проступей до средней забежной ступени
		var shape = new THREE.Shape();
		var clockwise = false;

		var p1 = pointsOut[i].pFront;
		var p2 = pointsOut[i].pBack;
		var p3 = pointsIn[i].pBack;
		var p4 = pointsIn[i].pFront;

		var centerX = newPoint_xy(center, -100, 0)

		////if (i < numberMiddleTread) {
			
		////	if (p1.y < center.y) {
		////		if (p2.y < center.y) {
		////			addLine(shape, dxfPrimitivesArr, p2, p1, par.dxfBasePoint);
		////		}
		////		else {
		////			var pt = { x: p1.x, y: center.y }
					
		////			var ang = angleLines(center, centerX, center, p2);
		////			addArc(shape, dxfPrimitivesArr, center, radOut,  Math.PI - ang,Math.PI, par.dxfBasePoint);
		////			addLine(shape, dxfPrimitivesArr, pt, p1, par.dxfBasePoint);
		////		}
		////	}
		////	else {
		////		var ang1 = angleLines(center, centerX, center, p2);
		////		var ang2 = angleLines(center, centerX, center, p1);
		////		addArc2(shape, dxfPrimitivesArr, center, radOut, Math.PI - ang1, Math.PI - ang2, clockwise, par.dxfBasePoint);
		////	}

		////	addLine(shape, dxfPrimitivesArr, p1, p4, par.dxfBasePoint);

		////	if (p4.y < center.y) {
		////		if (p3.y < center.y) {
		////			addLine(shape, dxfPrimitivesArr, p4, p3, par.dxfBasePoint);
		////		}
		////		else {
		////			var pt = { x: p4.x, y: center.y }
		////			addLine(shape, dxfPrimitivesArr, p4, pt, par.dxfBasePoint);
		////			var ang = angleLines(center, centerX, center, p3);
		////			addArc2(shape, dxfPrimitivesArr, center, radIn, Math.PI , Math.PI- ang, clockwise, par.dxfBasePoint);
					
		////		}
		////	}
		////	else {
		////		var ang1 = angleLines(center, centerX, center, p4);
		////		var ang2 = angleLines(center, centerX, center, p3);
		////		addArc2(shape, dxfPrimitivesArr, center, radIn, Math.PI - ang1, Math.PI - ang2, clockwise, par.dxfBasePoint);
		////	}

		////	addLine(shape, dxfPrimitivesArr, p3, p2, par.dxfBasePoint);
		////}

		//////расчет проступи средней забежной ступени
		////if (i == numberMiddleTread) {
		////	var ang1 = angleLines(center, centerX, center, p2);
		////	var ang2 = angleLines(center, centerX, center, p1);
		////	addArc2(shape, dxfPrimitivesArr, center, radOut, Math.PI - ang1, Math.PI - ang2, clockwise, par.dxfBasePoint);

		////	addLine(shape, dxfPrimitivesArr, p1, p4, par.dxfBasePoint);

		////	var ang1 = angleLines(center, centerX, center, p4);
		////	var ang2 = angleLines(center, centerX, center, p3);
		////	addArc2(shape, dxfPrimitivesArr, center, radIn, Math.PI - ang1, Math.PI - ang2, clockwise, par.dxfBasePoint);

		////	addLine(shape, dxfPrimitivesArr, p3, p2, par.dxfBasePoint);
		////}

		//////расчет проступей после средней забежной ступени
		////if (i > numberMiddleTread) {
		////	if (p2.x > center.x) {
		////		if (p1.x > center.x) {
		////			addLine(shape, dxfPrimitivesArr, p2, p1, par.dxfBasePoint);
		////		}
		////		else {
		////			var pt = { x: center.x, y: p2.y }
		////			addLine(shape, dxfPrimitivesArr, p2, pt, par.dxfBasePoint);
		////			var ang = angleLines(center, centerX, center, p1);
		////			addArc2(shape, dxfPrimitivesArr, center, radOut,Math.PI / 2, Math.PI - ang,  clockwise, par.dxfBasePoint);
					
		////		}
		////	}
		////	else {
		////		var ang1 = angleLines(center, centerX, center, p2);
		////		var ang2 = angleLines(center, centerX, center, p1);
		////		addArc2(shape, dxfPrimitivesArr, center, radOut, Math.PI - ang1, Math.PI - ang2, clockwise, par.dxfBasePoint);
		////	}

		////	addLine(shape, dxfPrimitivesArr, p1, p4, par.dxfBasePoint);

		////	if (p3.x > center.x) {
		////		if (p4.x > center.x) {
		////			addLine(shape, dxfPrimitivesArr, p4, p3, par.dxfBasePoint);
		////		}
		////		else {
		////			var pt = { x: center.x, y: p3.y }
					
		////			var ang = angleLines(center, centerX, center, p4);
		////			addArc2(shape, dxfPrimitivesArr, center, radIn,  Math.PI - ang,Math.PI / 2, clockwise, par.dxfBasePoint);
		////			addLine(shape, dxfPrimitivesArr, pt, p3, par.dxfBasePoint);
		////		}
		////	}
		////	else {
		////		var ang1 = angleLines(center, centerX, center, p4);
		////		var ang2 = angleLines(center, centerX, center, p3);
		////		addArc2(shape, dxfPrimitivesArr, center, radIn, Math.PI - ang1, Math.PI - ang2, clockwise, par.dxfBasePoint);
		////	}

		////	addLine(shape, dxfPrimitivesArr, p3, p2, par.dxfBasePoint);
		////}


		//if (i < numberMiddleTread) {
		//	var centerX = newPoint_xy(center, -100, 0)
		//	var centerY = newPoint_xy(center, 0, 100) 
		//	if (p1.y < center.y) {
		//		if (p2.y < center.y) {
		//			addLine(shape, dxfPrimitivesArr, p1, p2, par.dxfBasePoint);
		//		}
		//		else {
		//			var pt = { x: p1.x, y: center.y }
		//			addLine(shape, dxfPrimitivesArr, p1, pt, par.dxfBasePoint);
		//			var ang = angleLines(center, centerX, center, p2);
		//			addArc2(shape, dxfPrimitivesArr, center, radOut, Math.PI, Math.PI - ang, clockwise, par.dxfBasePoint);
		//		}
		//	}
		//	else {
		//		var ang1 = angleLines(center, centerX, center, p1);
		//		var ang2 = angleLines(center, centerX, center, p2);
		//		addArc2(shape, dxfPrimitivesArr, center, radOut, Math.PI - ang1, Math.PI - ang2, clockwise, par.dxfBasePoint);
		//	}

		//	addLine(shape, dxfPrimitivesArr, p2, p3, par.dxfBasePoint);

		//	if (p4.y < center.y) {
		//		if (p3.y < center.y) {
		//			addLine(shape, dxfPrimitivesArr, p3, p4, par.dxfBasePoint);
		//		}
		//		else {
		//			var pt = { x: p4.x, y: center.y }
		//			var ang = angleLines(center, centerX, center, p3);
		//			addArc2(shape, dxfPrimitivesArr, center, radIn, Math.PI - ang, Math.PI, clockwise, par.dxfBasePoint);
		//			addLine(shape, dxfPrimitivesArr, pt, p4, par.dxfBasePoint);
		//		}
		//	}
		//	else {
		//		var ang1 = angleLines(center, centerX, center, p3);
		//		var ang2 = angleLines(center, centerX, center, p4);
		//		addArc2(shape, dxfPrimitivesArr, center, radIn, Math.PI - ang1, Math.PI - ang2, clockwise, par.dxfBasePoint);
		//	}

		//	addLine(shape, dxfPrimitivesArr, p4, p1, par.dxfBasePoint);
		//}

		////расчет проступи средней забежной ступени
		//if (i == numberMiddleTread) {
		//	var ang1 = angleLines(center, centerX, center, p1);
		//	var ang2 = angleLines(center, centerX, center, p2);
		//	addArc2(shape, dxfPrimitivesArr, center, radOut, Math.PI - ang1, Math.PI - ang2, clockwise, par.dxfBasePoint);

		//	addLine(shape, dxfPrimitivesArr, p2, p3, par.dxfBasePoint);

		//	var ang1 = angleLines(center, centerX, center, p3);
		//	var ang2 = angleLines(center, centerX, center, p4);
		//	addArc2(shape, dxfPrimitivesArr, center, radIn, Math.PI - ang1, Math.PI - ang2, clockwise, par.dxfBasePoint);

		//	addLine(shape, dxfPrimitivesArr, p4, p1, par.dxfBasePoint);
		//}

		////расчет проступей после средней забежной ступени
		//if (i > numberMiddleTread) {
		//	if (p2.x > center.x) {
		//		if (p1.x > center.x) {
		//			addLine(shape, dxfPrimitivesArr, p1, p2, par.dxfBasePoint);
		//		}
		//		else {
		//			var pt = { x: center.x, y: p2.y }
		//			var ang = angleLines(center, centerX, center, p1);
		//			addArc2(shape, dxfPrimitivesArr, center, radOut, Math.PI - ang, Math.PI / 2, clockwise, par.dxfBasePoint);
		//			addLine(shape, dxfPrimitivesArr, pt, p2, par.dxfBasePoint);
		//		}
		//	}
		//	else {
		//		var ang1 = angleLines(center, centerX, center, p1);
		//		var ang2 = angleLines(center, centerX, center, p2);
		//		addArc2(shape, dxfPrimitivesArr, center, radOut, Math.PI - ang1, Math.PI - ang2, clockwise, par.dxfBasePoint);
		//	}

		//	addLine(shape, dxfPrimitivesArr, p2, p3, par.dxfBasePoint);

		//	if (p3.x > center.x) {
		//		if (p4.x > center.x) {
		//			addLine(shape, dxfPrimitivesArr, p3, p4, par.dxfBasePoint);
		//		}
		//		else {
		//			var pt = { x: center.x, y: p3.y }
		//			addLine(shape, dxfPrimitivesArr, p3, pt, par.dxfBasePoint);
		//			var ang = angleLines(center, centerX, center, p4);
		//			addArc2(shape, dxfPrimitivesArr, center, radIn, Math.PI / 2, Math.PI - ang, clockwise, par.dxfBasePoint);
					
		//		}
		//	}
		//	else {
		//		var ang1 = angleLines(center, centerX, center, p3);
		//		var ang2 = angleLines(center, centerX, center, p4);
		//		addArc2(shape, dxfPrimitivesArr, center, radIn, Math.PI - ang1, Math.PI - ang2, clockwise, par.dxfBasePoint);
		//	}

		//	addLine(shape, dxfPrimitivesArr, p4, p1, par.dxfBasePoint);
		//}



		//////прямоугольный вырез в центре детали------------------------------

		////var holesPar = {
		////	points: [pointsOut[i].pFront, pointsOut[i].pBack, pointsIn[i].pBack, pointsIn[i].pFront],
		////	dx: 40,
		////	dy: 40,
		////}

		////var arr = moovePointsPathToIn(holesPar).points.reverse();
		////if (turnFactor == -1)
		////	arr = mirrowPointsMiddleX(arr);

		////var holeParams = {
		////	vertexes: arr,
		////	cornerRad: 10.0,
		////	dxfPrimitivesArr: dxfPrimitivesArr,
		////	dxfBasePoint: par.dxfBasePoint
		////}

		////shape.holes.push(topCoverCentralHole(holeParams));

		//////отверстия для болтов--------------------------------------------------------
		////for (var j = 0; j < par.holesBolt.length; j++) {
		////	addRoundHole(shape, dxfPrimitivesArr, par.holesBolt[j], 6.5, par.dxfBasePoint);
		////}

		////var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		////geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		////var plate = new THREE.Mesh(geom, params.materials.metal);
		////plate.rotation.x = -Math.PI / 2;
		////plate.rotation.z = -Math.PI / 2;
		////plate.position.y = par.h_topWnd * i - params.metalThickness - 5;

		//if (i == params.countWndTread - 1)
		//par.mesh.add(plate);
	}

	return par;
}

/** функция отрисовывает блок прямоугольных вертикальных пластин на забеге для гнутого короба
*/
function drawFrontPlatesCurve(par) {

	var plateObj = new THREE.Object3D();

	var marshParams = getMarshParams(par.marshId);
	par.height = marshParams.h;

	par.width = params.stringerThickness - params.metalThickness * 2;

	var linesTreads = calcPointsWndTreads().linesTreads; // точки передней и задней линии ступени
	var points = calcItersectionStringTreads(params.M / 2 - params.stringerThickness / 2 + params.metalThickness).points;
	//if (turnFactor == - 1) points = calcItersectionStringTreads(params.M / 2 - params.stringerThickness / 2).points;

	var ang = Math.PI / 2 / (linesTreads.length);

	for (var i = 0; i < linesTreads.length; i++) {
		if (i > 0) par.height = marshParams.h_topWnd;

		var p1 = { x: 0, y: 0 };
		var p2 = newPoint_xy(p1, 0, -par.height);
		var p3 = newPoint_xy(p2, par.width, 0);
		var p4 = newPoint_xy(p1, par.width, 0);

		//создаем шейп
		var shapePar = {
			points: [p1, p2, p3, p4],
			dxfArr: par.dxfArr,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, par.height),
		}

		if (!par.pointStartSvg) par.pointStartSvg = { x: 0, y: 0 } //костыль чтобы не было фатальной ошибки
		shapePar.drawing = {
			name: "Вертикальные передняя пластина каркаса",
			group: "carcasPlates",
			marshId: par.marshId,
			basePoint: newPoint_xy(par.pointCurrentSvg,
				-par.pointStartSvg.x - par.width,
				-par.pointStartSvg.y + par.height + 150 + par.width),
		}

		var shape = drawShapeByPoints2(shapePar).shape;

		var extrudeOptions = {
			amount: params.metalThickness,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};

		var material = params.materials.metal;


		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var plate = new THREE.Mesh(geom, material);
		plate.position.y = par.height * i;
		plate.position.x = points[i].pFront.y;
		plate.position.z = points[i].pFront.x * turnFactor;
		if (turnFactor == - 1) {
			plate.position.x += params.metalThickness * Math.sin(Math.PI / 2 - ang * i);
			plate.position.z -= params.metalThickness * Math.cos(Math.PI / 2 - ang * i);
		}
		plate.rotation.y = (Math.PI / 2 - ang * i) * turnFactor;
		plateObj.add(plate);
	}

	par.mesh = plateObj;

	return par;

} //end of drawFrontPlatesCurve




/**
	Функция рассчитывает точки пересечения боковой тетивы с передней и задней линиией забежных ступеней
*/
function calcItersectionStringTreads(rad) {
	var par = { points: [] };

	var linesTreads = calcPointsWndTreads().linesTreads; // точки передней и задней линии ступени

	var center = { x: params.M, y: params.sizeTurn - params.M }; // центр поворота
	//var rad = params.M / 2;


	for (var i = 0; i < linesTreads.length; i++) {

		var lineFront = {
			p1: newPoint_xy(linesTreads[0].front.p1, 0, 50),
			p2: newPoint_xy(linesTreads[0].front.p2, 0, 50)
		}
		if (i !== 0) var lineFront = { p1: linesTreads[i - 1].back.p1, p2: linesTreads[i - 1].back.p2 }
		var lineBack = { p1: linesTreads[i].back.p1, p2: linesTreads[i].back.p2 }

		var numberMiddleTread = Math.ceil(params.countWndTread / 2) - 1;

		var angFront = calcAngleX1(lineFront.p1, lineFront.p2);
		var angBack = calcAngleX1(lineBack.p1, lineBack.p2);
		if (angBack > 0) angBack *= -1;

		//точки пересечения боковой тетивы с передней и задней линией ступени

		//до средней забежной ступени
		if (i < numberMiddleTread) {
			var pt = newPoint_xy(center, -rad, 0);
			var line = { p1: pt, p2: newPoint_xy(pt, 0, 100) } // линия прямой тетивы

			var pFront = itercectionLines(line, lineFront);
			if (center.y < pFront.y) {
				var points = itercectionLineCircle1(lineFront, center, rad);
				var pFront = points[1]
				if (points[0].x < center.x) pFront = points[0];
			}

			var pBack = itercectionLines(line, lineBack);
			if (center.y < pBack.y) {
				var points = itercectionLineCircle1(lineBack, center, rad);
				var pBack = points[1]
				if (points[0].x < center.x) pBack = points[0];
			}

		}

		//на средней забежной ступени
		if (i == numberMiddleTread) {
			var points = itercectionLineCircle1(lineFront, center, rad);
			var pFront = points[1]
			if (points[0].x < center.x) pFront = points[0];

			var points = itercectionLineCircle1(lineBack, center, rad);
			var pBack = points[1]
			if (points[0].y > center.y) pBack = points[0];
		}

		//после средней забежной ступени
		if (i > numberMiddleTread) {
			var pt = newPoint_xy(center, 0, rad);
			var line = { p1: pt, p2: newPoint_xy(pt, 100, 0) } // линия прямой тетивы

			var pFront = itercectionLines(line, lineFront);
			if (center.x > pFront.x) {
				var points = itercectionLineCircle1(lineFront, center, rad);
				var pFront = points[1]
				if (points[0].y > center.y) pFront = points[0];
			}

			var pBack = itercectionLines(line, lineBack);
			if (center.x > pBack.x) {
				var points = itercectionLineCircle1(lineBack, center, rad);
				var pBack = points[1]
				if (points[0].y > center.y) pBack = points[0];
			}
		}

		par.points.push({ pFront: pFront, pBack: pBack })
	}
	return par;
}


/**
	Функция сдвигает точки контура внутрь
*/
function moovePointsPathToIn(par) {

	var p1 = copyPoint(par.points[0]);
	var p2 = copyPoint(par.points[1]);
	var p3 = copyPoint(par.points[2]);
	var p4 = copyPoint(par.points[3]);

	var lineO = parallel(p1, p2, -par.dx);
	var lineI = parallel(p3, p4, par.dx);
	var lineF = parallel(p2, p3, -par.dy);
	if (p2.x == p3.x) lineF = parallel(p2, p3, par.dy);
	var lineB = parallel(p1, p4, par.dy);

	var pt1 = itercectionLines(lineO, lineF);
	var pt2 = itercectionLines(lineO, lineB);
	var pt3 = itercectionLines(lineI, lineB);
	var pt4 = itercectionLines(lineI, lineF);

	par.points = [pt1, pt2, pt3, pt4];

	return par;
}


/**
	Округление числа до 6 знаков после запятой
*/
function round6(num) {
	return Math.round(num * 1000000) / 1000000
}

/**
	Округление координат точек до 6 знаков после запятой
*/
function roundPoints(points) {
	for (var i = 0; i < points.length; i++) {
		points[i].x = round6(points[i].x);
		points[i].y = round6(points[i].y);
	}
	return points;
}


/**
	функция возвращает координаты точек пересечения прямой с окружностью
*/
function itercectionLineCircle(p1, p2, center, rad) {

	var x1, y1, x2, y2;//координаты точек пересечения
	var x, a1, b1, c1, d; //вспомогательные переменные

	var cntr = { x: round6(center.x), y: round6(center.y) } // координаты центра окружности
	var r = round6(rad); // радиус окружности

	var points = []; // точки пересечения

	// определяем коэффициенты прямой ax+by+c=0 и y=kx+s
	var ratios = ratiosStraight(p1, p2);
	var a = ratios.a;
	var b = ratios.b;
	var c = ratios.c;
	var k = ratios.k;
	var s = ratios.s;

	//прямая вертикальна
	if (b == 0) {
		x = round6(-c / a);
		if ((cntr.x - r > x) || (cntr.x + r < x)) {
			return points; // Окружность и прямая не пересекаются
		} 
		else {
			if ((cntr.x - r == x) || (cntr.x + r == x)) {// Прямая касается окружности в точке
				points.push({ x: x, y: cntr.y })
				return points
			} 
			else { // Прямая пересекает окружность в 2-х точках
				y1 = round6(cntr.y + Math.sqrt(r * r - Math.sqrt(cntr.x - x)));
				y2 = round6(cntr.y - Math.sqrt(r * r - Math.sqrt(cntr.x - x)));
				points.push({ x: x, y: y1 })
				points.push({ x: x, y: y2 })
				return points;
			}
		}
	}

	//прямая горизонтальная
	if (a == 0) {
		y = round6(-c / b);
		if ((cntr.y - r > y) || (cntr.y + r < y)) {
			return points; // Окружность и прямая не пересекаются
		}
		else {
			if ((cntr.y - r == y) || (cntr.y + r == y)) {// Прямая касается окружности в точке
				points.push({ x: cntr.x, y:y })
				return points
			}
			else { // Прямая пересекает окружность в 2-х точках
				x1 = round6(cntr.x + Math.sqrt(r * r - Math.sqrt(cntr.y - y)));
				x2 = round6(cntr.x - Math.sqrt(r * r - Math.sqrt(cntr.y - y)));
				points.push({ x: x1, y: y })
				points.push({ x: x2, y: y })
				return points;
			}
		}
	}

	//другие случаи

	//и решим систему
	//(x - x0)**2 + (y - y0)**2 = r**2 (окружность)
	//y=kx+s {прямая}
	//после приведения найдем коэффициенты уравнения a1x**2+b1x+c1=0
	a1 = round6(1 + k * k);
	b1 = round6(-2 * cntr.x + 2 * k * s - 2 * k * cntr.y);
	c1 = round6(s * s + cntr.x * cntr.x - 2 * s * cntr.y + cntr.y * cntr.y - r * r);
	d = round6(b1 * b1 - 4 * a1 * c1);

	if (d < 0) return points; //Прямая и окружность не пересекаются
	if (d == 0) { // Прямая касается окружности в точке
		x1 = round6(-b1 / (2 * a1));
		y1 = round6(k * x1 + s);
		return points.push({ x: x1, y: y1 })
	}

	// Прямая пересекает окружность в 2-х точках
	x1 = round6((-b1 + Math.sqrt(d)) / (2 * a1));
	x2 = round6((-b1 - Math.sqrt(d)) / (2 * a1));
	y1 = round6(k * x1 + s);
	y2 = round6(k * x2 + s);
	points.push({ x: x1, y: y1 })
	points.push({ x: x2, y: y2 })
	return points;

}

function itercectionLineCircle1(line, center, rad) {
	return itercectionLineCircle(line.p1, line.p2, center, rad)
}

/**
	функция возвращает коэффициенты прямой ax+by+c=0 и y=kx+s
*/
function ratiosStraight(p1, p2) {
	// определяем коэффициенты прямой ax+by+c=0
	a = round6(p1.y - p2.y);
	b = round6(p2.x - p1.x);
	c = round6(p1.x * p2.y - p2.x * p1.y);

	//преобразуем уравнение ax+by+c=0 к виду y=kx+s
	k = round6(-a / b); 
	s = round6(-c / b);

	var ratios = {
		a: a,
		b: b,
		c: c,
		k: k,
		s: s,
	}

	return ratios;
}

/**
	функция определяет угол между прямыми
*/
function angleLines(p1, p2, p3, p4) {
	var ratios1 = ratiosStraight(p1, p2);
	var ratios2 = ratiosStraight(p3, p4);

	var a1 = ratios1.a;
	var a2 = ratios2.a;
	var b1 = ratios1.b;
	var b2 = ratios2.b;

	//var ang = Math.abs(Math.atan((ratios2.k - ratios1.k) / (1 + ratios1.k * ratios2.k)));
	var ang = Math.abs(Math.atan((a1*b2 - a2*b1) / (a1*a2 + b1*b2)));
	return ang;
}

function angleLines1(line1, line2) {
	return angleLines(line1.p1, line1.p2, line2.p1, line2.p2);
}

function angleLineX(line) {
	var lineX = { p1: { x: 0, y: 0 }, p2: { x: 100, y: 0 }}
	return angleLines(line.p1, line.p2, lineX.p1, lineX.p2);
}

/**
	функция перерассчитывает точки по Х так чтобы начальная точка по Х = 0
	
	@return points - сдвинутые точки, len - длина на которую сдвигали
*/
function moovePointsToP0X(points) {

	var min = points[0].x;
	var max = points[0].x;
	for (var i = 0; i < points.length; i++) {
		if (points[i].x < min) min = points[i].x;
		if (points[i].x > max) max = points[i].x
	}

	for (var i = 0; i < points.length; i++) {
		points[i].x -= min;
	}
	return {points: points, len: max-min}
}

function moovePointsToP0X1(points) {

	var min = points[0].x;
	var max = points[points.length - 1].x;

	for (var i = 0; i < points.length; i++) {
		points[i].x -= min;
	}
	return { points: points, len: max - min }
}