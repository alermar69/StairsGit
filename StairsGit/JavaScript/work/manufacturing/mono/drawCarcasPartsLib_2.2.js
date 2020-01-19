/*Версия библиотеки 1.8*/

/*** ОСНОВНЫЕ ФУНКЦИИ, ИСПОЛЬЗУЕМЫ НАПРЯМУЮ ***/


/*общая функция отрисовки квадратного фланца с отверстиями*/

function drawRectFlan(flanParams) {

	/*исходные данные:
	чертеж фланца здесь: 6692035.ru/drawings/carcasPartsLib/flans/scheme_RectFlan.pdf
	flanParams.width - ширина фланца
	flanParams.height - длина фланца (высота при вертикальном расположении)
	flanParams.holeDiam - диаметр отверстий с 1 по 4
	flanParams.holeDiam5 - диаметр пятого (условно центрального) отверстия
	flanParams.angleRadUp - радиус скругления верхних углов фланца
	flanParams.angleRadDn - радиус скругления нижних углов фланца
	flanParams.hole1X - координаты первого отверстия по оси Х (отсчитываются от соответствующего внешного угла фланца)
	flanParams.hole1Y - координаты первого отверстия по оси Y (отсчитываются от соответствующего внешного угла фланца)
	flanParams.hole2X - координаты второго отверстия по оси Х (отсчитываются от соответствующего внешного угла фланца)
	flanParams.hole2Y - координаты второго отверстия по оси Y (отсчитываются от соответствующего внешного угла фланца)
	flanParams.hole3X - координаты третьего отверстия по оси Х (отсчитываются от соответствующего внешного угла фланца)
	flanParams.hole3Y - координаты третьего отверстия по оси Y (отсчитываются от соответствующего внешного угла фланца)
	flanParams.hole4X - координаты четвертого отверстия по оси Х (отсчитываются от соответствующего внешного угла фланца)
	flanParams.hole4Y - координаты четвертого отверстия по оси Y (отсчитываются от соответствующего внешного угла фланца)
	flanParams.hole5X - координаты пятого отверстия по оси Х (отсчитываются от начальной точки фланца - левый нижний угол)
	flanParams.hole5Y - координаты пятого отверстия по оси Y (отсчитываются от начальной точки фланца - левый нижний угол)
	flanParams.dxfBasePoint - базовая точка для вставки контуров в dxf файл
	flanParams.dxfPrimitivesArr - массив для вставки контуров в dxf файл

	!!! Для отрисовки отверстия необходимо наличие всех трех параметров (позиции по х,у и диаметра).
	!!! Нумерация отверстий идет по часовой стрелке, начиная с левого нижнего.
	*/
	var dxfBasePoint = flanParams.dxfBasePoint;
	var dxfPrimitivesArr = flanParams.dxfPrimitivesArr;
	var shape = new THREE.Shape();
	var p1 = { x: 0, y: 0 }
	var centerPoint = { x: 0, y: 0 };
	var p2 = copyPoint(p1);

	//прорисовка левого нижнего угла скругления
	if (flanParams.angleRadDn > 0) {
		var startAngle = Math.PI * 3 / 2;
		var endAngle = Math.PI;
		centerPoint.x = flanParams.angleRadDn; //назначение центра скругления
		centerPoint.y = flanParams.angleRadDn;
		addArc2(shape, dxfPrimitivesArr, centerPoint, flanParams.angleRadDn, startAngle, endAngle, true, dxfBasePoint);
	}

	//прорисовка левого участка
	p1.x = 0;
	p1.y = flanParams.angleRadDn;
	p2 = newPoint_xy(p1, 0, flanParams.height - flanParams.angleRadDn - flanParams.angleRadUp); // params basePoint, deltaX, deltaY
	addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);
	//console.log(p1,p2);
	//прорисовка левого верхнего угла скругления
	if (flanParams.angleRadUp > 0) {
		startAngle = Math.PI;
		endAngle = Math.PI / 2;
		centerPoint.x = flanParams.angleRadUp; //назначение центра скругления
		centerPoint.y = flanParams.height - flanParams.angleRadUp;
		addArc2(shape, dxfPrimitivesArr, centerPoint, flanParams.angleRadUp, startAngle, endAngle, true, dxfBasePoint);
		//console.log(startAngle,endAngle);
	}

	//прорисовка верхнего участка
	p1.x = flanParams.angleRadUp;
	p1.y = flanParams.height;
	p2 = newPoint_xy(p1, flanParams.width - flanParams.angleRadUp * 2, 0); // params basePoint, deltaX, deltaY
	addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);

	//прорисовка правого верхнего угла скругления
	if (flanParams.angleRadUp > 0) {
		startAngle = Math.PI / 2;
		endAngle = 0;
		centerPoint.x = flanParams.width - flanParams.angleRadUp; //назначение центра скругления
		centerPoint.y = flanParams.height - flanParams.angleRadUp;
		addArc2(shape, dxfPrimitivesArr, centerPoint, flanParams.angleRadUp, startAngle, endAngle, true, dxfBasePoint);
	}

	//прорисовка левого участка
	p1.x = flanParams.width;
	p1.y = flanParams.height - flanParams.angleRadUp;
	p2 = newPoint_xy(p1, 0, -flanParams.height + flanParams.angleRadUp + flanParams.angleRadDn); // params basePoint, deltaX, deltaY
	addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);

	//прорисовка правого нижнего угла скругления
	if (flanParams.angleRadDn > 0) {
		startAngle = Math.PI * 2;
		endAngle = Math.PI * 3 / 2;
		centerPoint.x = flanParams.width - flanParams.angleRadDn;
		centerPoint.y = flanParams.angleRadDn;
		addArc2(shape, dxfPrimitivesArr, centerPoint, flanParams.angleRadDn, startAngle, endAngle, true, dxfBasePoint);
	}

	//прорисовка нижнего участка
	p1.x = flanParams.width - flanParams.angleRadDn;
	p1.y = 0;
	p2 = newPoint_xy(p1, -flanParams.width + flanParams.angleRadDn * 2, 0);
	addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);


	/*Прорисовка отверстий*/
	var hole0Pos = { x: 0, y: 0 }

	flanParams.holesFix = [];

	/*отверстие № 1*/
	if (flanParams.hole1X && flanParams.hole1Y && flanParams.holeDiam) {
		var hole1 = new THREE.Path();
		var hole1Pos = copyPoint(hole0Pos);
		hole1Pos.x = hole1Pos.x + flanParams.hole1X;
		hole1Pos.y = hole1Pos.y + flanParams.hole1Y;
		addCircle(hole1, dxfPrimitivesArr, hole1Pos, flanParams.holeDiam / 2, dxfBasePoint)
		shape.holes.push(hole1);
		flanParams.holesFix.push(hole1Pos);
	}

	/*отверстие № 2*/
	if (flanParams.hole2X && flanParams.hole2Y && flanParams.holeDiam) {
		var hole2 = new THREE.Path();
		var hole2Pos = copyPoint(hole0Pos);
		hole2Pos.x = hole2Pos.x + flanParams.hole2X;
		hole2Pos.y = hole2Pos.y + flanParams.height - flanParams.hole2Y;
		addCircle(hole2, dxfPrimitivesArr, hole2Pos, flanParams.holeDiam / 2, dxfBasePoint)
		shape.holes.push(hole2);
		flanParams.holesFix.push(hole2Pos);
	}

	/*отверстие № 3*/
	if (flanParams.hole3X && flanParams.hole3Y && flanParams.holeDiam) {
		var hole3 = new THREE.Path();
		var hole3Pos = copyPoint(hole0Pos);
		hole3Pos.x = hole0Pos.x + flanParams.width - flanParams.hole3X;
		hole3Pos.y = hole0Pos.y + flanParams.height - flanParams.hole3Y;
		addCircle(hole3, dxfPrimitivesArr, hole3Pos, flanParams.holeDiam / 2, dxfBasePoint)
		shape.holes.push(hole3);
		flanParams.holesFix.push(hole3Pos);
	}

	/*отверстие № 4*/
	if (flanParams.hole4X && flanParams.hole4Y && flanParams.holeDiam) {
		var hole4 = new THREE.Path();
		var hole4Pos = copyPoint(hole0Pos);
		hole4Pos.x = hole0Pos.x + flanParams.width - flanParams.hole4X;
		hole4Pos.y = hole0Pos.y + flanParams.hole4Y;
		addCircle(hole4, dxfPrimitivesArr, hole4Pos, flanParams.holeDiam / 2, dxfBasePoint)
		shape.holes.push(hole4);
		flanParams.holesFix.push(hole4Pos);
	}

	/*отверстие № 5*/
	if (flanParams.hole5X && flanParams.hole5Y && flanParams.holeDiam5) {
		var hole5 = new THREE.Path();
		var hole5Pos = copyPoint(hole0Pos);
		hole5Pos.x = hole5Pos.x + flanParams.hole5X;
		hole5Pos.y = hole5Pos.y + flanParams.hole5Y;
		addCircle(hole5, dxfPrimitivesArr, hole5Pos, flanParams.holeDiam5 / 2, dxfBasePoint)
		shape.holes.push(hole5);
	}
	flanParams.shape = shape;

	return flanParams;
}



//функция смещает массив точек как единое целое на заданное расстояние по х и у
function moovePoints(points, mooveDist) {
	var newPoints = [];
	for (var i = 0; i < points.length; i++) {
		var newPoint = newPoint_xy(points[i], mooveDist.x, mooveDist.y);
		newPoints.push(newPoint);
	}
	return newPoints;
} //end of moovePoints

//функция повороачивает массив точек как единое целое вокруг начала координат
function rotatePoints(points, rotAng, p0) {
	var newPoints = [];
	var zeroPoint = { x: 0, y: 0, }
	if (p0) zeroPoint = copyPoint(p0);
	for (var i = 0; i < points.length; i++) {
		//рассчитываем полярные координаты точки
		var ang = angle(zeroPoint, points[i]);
		var dist = distance(zeroPoint, points[i]);
		//рассчитываем координаты новой точки с учетом угла поворота
		var newPoint = polar(zeroPoint, (ang + rotAng), dist);
		newPoints.push(newPoint);
	}
	return newPoints;
} //end of rotatePoints

//функция зеркалит массив точек как единое целое относительно линии, заданной двумя точками
function mirrowPoints(points, line) {
	var newPoints = [];
	for (var i = 0; i < points.length; i++) {
		//опускаем перпендикуляр из точки на линию
		var perpPar = calcPerpParams(line.p1, line.p2, points[i]); //функция в файле drawPrimitives

		//if (perpPar.ang === 0) {
		//	if (Math.atan2(perpPar.ang, -0) < 0)
		//		perpPar.ang = Math.PI;
		//}
		//рассчитываем координаты новой точки
		var newPoint = polar(perpPar.point, perpPar.ang, -perpPar.dist);
		newPoints.push(newPoint);
	}
	return newPoints;
}//end of mirrowPoints

//функция зеркалит массив точек как единое целое относительно линии, заданной двумя точками
function mirrowPointsMiddleX(points) {
	var newPoints = [];
	for (var i = 0; i < points.length; i++) {
		//рассчитываем координаты новой точки
		var x = -1 * points[i].x;
		var y = points[i].y;
		var newPoint = { x: x, y: y };
		newPoints.push(newPoint);
	}

	newPoints.reverse();

	return newPoints;
}//end of mirrowPoints

function calcFilletParams3(p1, p2, p3, radius, clockwise) {
	/*функция рассчитывает параметры скругления двух линий. Линии задаются
	точкой и углом. Угол задается таким образом, чтобы линия была направлена к точке пересечения
	последний параметр - направление построения дуги*/

	if (radius !== 0) {
		//если дуга строится против часовой стрелки меняем местами точки
		if (!clockwise) {
			var pt = copyPoint(p1);
			p1 = copyPoint(p3);
			p3 = copyPoint(pt);
		}

		var ang1 = calcAngleX1(p2, p1);
		var ang2 = calcAngleX1(p2, p3);
		var linesAngle = calcLinesAngle(p1, p2, p3);
		var startToP2Dist = radius / Math.tan(linesAngle / 2);
		var p11 = polar(p2, ang1, startToP2Dist);
		var p31 = polar(p2, ang2, startToP2Dist);
		var center = polar(p11, ang1 + Math.PI / 2, radius);

		var angstart = calcAngleX1(center, p11);
		var angend = calcAngleX1(center, p31);

		//проверяем направление построения дуги
		if (p1.x < 0 && p3.x < 0) {
			if (angstart < angend && p1.x < p3.x && clockwise) angstart = angstart + 2 * Math.PI;
		} else {
			if (angstart < angend && p1.x > p3.x && clockwise) angstart = angstart + 2 * Math.PI;
		}


		var filletParams = {
			start: p11,
			end: p31,
			center: center,
			angstart: angstart,
			angend: angend,
			rad: radius,
			clockwise: clockwise,
		}
		if (!clockwise) {
			filletParams.start = p31;
			filletParams.end = p11;
			//filletParams.angstart = angend;
			//filletParams.angend = angstart;
		}
	} else {
		return p2;
	}

	return filletParams;

}


