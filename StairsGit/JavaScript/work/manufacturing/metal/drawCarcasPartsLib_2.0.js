/*Версия библиотеки 1.9*/

/*** ОСНОВНЫЕ ФУНКЦИИ, ИСПОЛЬЗУЕМЫ НАПРЯМУЮ ***/



/*функция отрисовки регулируемой опоры*/
function drawAdjustableLeg(isAngle) {
	dxfBasePoint = { x: 0, y: 0 }
	var leg = new THREE.Object3D();

	if (isAngle == undefined) {
		var angle = drawAngleSupport("У5-60х60х100");
		angle.position.x = 0;
		angle.position.y = 0;
		angle.position.z = 0;
		angle.castShadow = true;
		//if(side == "left") angle.rotation.y = Math.PI;
		leg.add(angle);
	}
	//нижний фланец
	var dxfBasePoint = { "x": 1000.0, "y": 2000.0 };
	var flanParams = {};
	flanParams.width = 100.0;
	flanParams.height = 100.0;
	flanParams.holeDiam = 7;
	flanParams.holeDiam5 = 22.0;
	flanParams.angleRadUp = 10.0;
	flanParams.angleRadDn = 10.0;
	flanParams.hole1X = 15.0;
	flanParams.hole1Y = 15.0;
	flanParams.hole2X = 15.0;
	flanParams.hole2Y = 15.0;
	flanParams.hole3X = 15.0;
	flanParams.hole3Y = 15.0;
	flanParams.hole4X = 15.0;
	flanParams.hole4Y = 15.0;
	flanParams.hole5X = flanParams.width / 2;
	flanParams.hole5Y = flanParams.height / 2;
	flanParams.dxfBasePoint = dxfBasePoint;
	flanParams.dxfPrimitivesArr = [];

	if (params.fixPart1 != "нет" && params.fixPart1 != "не указано") {
		var fixPar = getFixPart(1, 'botFloor');
		flanParams.holeDiam = fixPar.diam + 1;
	}

	//добавляем фланец
	drawRectFlan(flanParams);
	var flanShape = flanParams.shape;

	var thickness = 4;
	var extrudeOptions = {
		amount: thickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geometry = new THREE.ExtrudeGeometry(flanShape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var flan = new THREE.Mesh(geometry, params.materials.metal);

	//задаем позицию фланца
	flan.position.x = 0//angle.position.x + (flanParams.width - 100) / 2;
	flan.position.y = -40
	if (params.calcType == "vhod" && params.staircaseType == "Готовая") flan.position.y += 10;
	flan.position.z = flanParams.width - 13//angle.position.z -40 + flanParams.height / 2;
	flan.rotation.x = Math.PI * 1.5;
	flan.castShadow = true;
	//добавлЯем фланец в сцену
	leg.add(flan);



	var boltLen = 100;
	if (testingMode) boltLen = 65;
	var geometry = new THREE.CylinderGeometry(10, 10, boltLen, 10, 1, false);
	var bolt = new THREE.Mesh(geometry, params.materials.metal);
	bolt.position.x = flan.position.x + flanParams.width / 2;
	bolt.position.y = boltLen / 2 - 40
	if (params.calcType == "vhod" && params.staircaseType == "Готовая") bolt.position.y += 10;
	bolt.position.z = (flan.position.z - flanParams.height / 2);
	bolt.rotation.x = 0.0;
	bolt.rotation.y = 0.0;
	bolt.rotation.z = 0.0;
	bolt.castShadow = true;
	leg.add(bolt);

	//гайка
	if (!testingMode) {
		var nutParams = { diam: 20 }
		var nut = drawNut(nutParams).mesh;
		nut.position.y = bolt.position.y - 2;
		if (params.calcType == "vhod" && params.staircaseType == "Готовая") nut.position.y -= 10;
		nut.position.x = bolt.position.x;
		nut.position.z = bolt.position.z;
		leg.add(nut);

		var nutParams = { diam: 20 }
		var nut = drawNut(nutParams).mesh;
		nut.position.y = bolt.position.y - 26;
		if (params.calcType == "vhod" && params.staircaseType == "Готовая") nut.position.y -= 10;
		nut.position.x = bolt.position.x;
		nut.position.z = bolt.position.z;
		leg.add(nut);
	}

	/* болты крепления к нижнему перекрытию */
	if (typeof isFixPats != "undefined" && isFixPats) { //глобальная переменная
		if (params.fixPart1 != "нет" && params.fixPart1 != "не указано") {
			var fixPar = getFixPart(1, 'botFloor');
			if (!isAngle) {//если регулируемая опора на колонне
				fixPar.fixPart = 'саморезы';
				fixPar.diam = 6;
				fixPar.len = 60;
				fixPar.id = "screw_6x60_r";
			}
			fixPar.thickness = thickness;
			var holeXY = 15;

			var fix = drawFixPart(fixPar).mesh;
			fix.position.x = flan.position.x + holeXY;
			fix.position.y = flan.position.y;
			fix.position.z = flan.position.z - holeXY;
			fix.rotation.x = 0;
			if (turnFactor == -1) {
				fix.rotation.x = Math.PI;
				fix.position.y += thickness;
			}
			leg.add(fix);

			var fix = drawFixPart(fixPar).mesh;
			fix.position.x = flan.position.x + flanParams.width - holeXY;
			fix.position.y = flan.position.y;
			fix.position.z = flan.position.z - holeXY;
			fix.rotation.x = 0;
			if (turnFactor == -1) {
				fix.rotation.x = Math.PI;
				fix.position.y += thickness
			}
			leg.add(fix);

			var fix = drawFixPart(fixPar).mesh;
			fix.position.x = flan.position.x + holeXY;
			fix.position.y = flan.position.y;
			fix.position.z = flan.position.z - flanParams.height + holeXY;
			fix.rotation.x = 0;
			if (turnFactor == -1) {
				fix.rotation.x = Math.PI;
				fix.position.y += thickness;
			}
			leg.add(fix);

			var fix = drawFixPart(fixPar).mesh;
			fix.position.x = flan.position.x + flanParams.width - holeXY;
			fix.position.y = flan.position.y;
			fix.position.z = flan.position.z - flanParams.height + holeXY;
			fix.rotation.x = 0;
			if (turnFactor == -1) {
				fix.rotation.x = Math.PI;
				fix.position.y += thickness
			}
			leg.add(fix);
		}
	}

	//сохраняем данные для спецификации
	var partName = "adjustableLeg";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Регулируемая опора",
				metalPaint: true,
				timberPaint: false,
				division: "stock_2",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
				}
		}
		var name = "120";
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}
	leg.specId = partName + name;

	return leg;
}


/** общая функция отрисовки квадратного фланца с отверстиями
	*- исходные данные:
	*- чертеж фланца здесь: 6692035.ru/drawings/carcasPartsLib/flans/scheme_RectFlan.pdf
	*- par.width - ширина фланца
	*- par.height - длина фланца (высота при вертикальном расположении)
	*- par.holeDiam - диаметр отверстий с 1 по 4
	*- par.holeDiam5 - диаметр пятого (условно центрального) отверстия
	*- par.angleRadUp - радиус скругления верхних углов фланца
	*- par.angleRadDn - радиус скругления нижних углов фланца
	*- par.hole1X - координаты первого отверстия по оси Х (отсчитываются от соответствующего внешного угла фланца)
	*- par.hole1Y - координаты первого отверстия по оси Y (отсчитываются от соответствующего внешного угла фланца)
	*- par.hole1Zenk - тип зенковки отверстия
	*- par.hole2X - координаты второго отверстия по оси Х (отсчитываются от соответствующего внешного угла фланца)
	*- par.hole2Y - координаты второго отверстия по оси Y (отсчитываются от соответствующего внешного угла фланца)
	*- par.hole2Zenk - тип зенковки отверстия
	*- par.hole3X - координаты третьего отверстия по оси Х (отсчитываются от соответствующего внешного угла фланца)
	*- par.hole3Y - координаты третьего отверстия по оси Y (отсчитываются от соответствующего внешного угла фланца)
	*- par.hole3Zenk - тип зенковки отверстия
	*- par.hole4X - координаты четвертого отверстия по оси Х (отсчитываются от соответствующего внешного угла фланца)
	*- par.hole4Y - координаты четвертого отверстия по оси Y (отсчитываются от соответствующего внешного угла фланца)
	*- par.hole4Zenk - тип зенковки отверстия
	*- par.hole5X - координаты пятого отверстия по оси Х (отсчитываются от начальной точки фланца - левый нижний угол)
	*- par.hole5Y - координаты пятого отверстия по оси Y (отсчитываются от начальной точки фланца - левый нижний угол)
	*- par.hole5Zenk - тип зенковки отверстия
	*- par.dxfBasePoint - базовая точка для вставки контуров в dxf файл
	*- par.dxfPrimitivesArr - массив для вставки контуров в dxf файл
	*- 
	*- !!! Для отрисовки отверстия необходимо наличие всех трех параметров (позиции по х,у и диаметра).
	*- !!! Нумерация отверстий идет по часовой стрелке, начиная с левого нижнего.
*/
function drawRectFlan(par) {

	
	//необязательные параметры
	if(!par.angleRadUp) par.angleRadUp = 0;
	if(!par.angleRadDn) par.angleRadDn = 0;
	
	var dxfBasePoint = par.dxfBasePoint;
	var dxfPrimitivesArr = par.dxfPrimitivesArr;
	var shape = new THREE.Shape();
	var p1 = { x: 0, y: 0 }
	var centerPoint = { x: 0, y: 0 };
	var p2 = copyPoint(p1);

	//прорисовка левого нижнего угла скругления
	if (par.angleRadDn > 0) {
		var startAngle = Math.PI * 3 / 2;
		var endAngle = Math.PI;
		centerPoint.x = par.angleRadDn; //назначение центра скругления
		centerPoint.y = par.angleRadDn;
		addArc(shape, dxfPrimitivesArr, centerPoint, par.angleRadDn, startAngle, endAngle, dxfBasePoint);
	}

	//прорисовка левого участка
	p1.x = 0;
	p1.y = par.angleRadDn;
	p2 = newPoint_xy(p1, 0, par.height - par.angleRadDn - par.angleRadUp); // params basePoint, deltaX, deltaY
	addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);
	//прорисовка левого верхнего угла скругления
	if (par.angleRadUp > 0) {
		startAngle = Math.PI;
		endAngle = Math.PI / 2;
		centerPoint.x = par.angleRadUp; //назначение центра скругления
		centerPoint.y = par.height - par.angleRadUp;
		addArc(shape, dxfPrimitivesArr, centerPoint, par.angleRadUp, startAngle, endAngle, dxfBasePoint);
	}

	//прорисовка верхнего участка
	p1.x = par.angleRadUp;
	p1.y = par.height;
	p2 = newPoint_xy(p1, par.width - par.angleRadUp * 2, 0); // params basePoint, deltaX, deltaY
	addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);

	//прорисовка правого верхнего угла скругления
	if (par.angleRadUp > 0) {
		startAngle = Math.PI / 2;
		endAngle = 0;
		centerPoint.x = par.width - par.angleRadUp; //назначение центра скругления
		centerPoint.y = par.height - par.angleRadUp;
		addArc(shape, dxfPrimitivesArr, centerPoint, par.angleRadUp, startAngle, endAngle, dxfBasePoint);
	}

	//прорисовка левого участка
	p1.x = par.width;
	p1.y = par.height - par.angleRadUp;
	p2 = newPoint_xy(p1, 0, -par.height + par.angleRadUp + par.angleRadDn); // params basePoint, deltaX, deltaY
	addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);

	//прорисовка правого нижнего угла скругления
	if (par.angleRadDn > 0) {
		startAngle = Math.PI * 2;
		endAngle = Math.PI * 3 / 2;
		centerPoint.x = par.width - par.angleRadDn;
		centerPoint.y = par.angleRadDn;
		addArc(shape, dxfPrimitivesArr, centerPoint, par.angleRadDn, startAngle, endAngle, dxfBasePoint);
	}

	//прорисовка нижнего участка
	p1.x = par.width - par.angleRadDn;
	p1.y = 0;
	p2 = newPoint_xy(p1, -par.width + par.angleRadDn * 2, 0);
	addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);


	/*Прорисовка отверстий*/
	var hole0Pos = { x: 0, y: 0 }

	/*отверстие № 1*/
	if (par.hole1X && par.hole1Y && par.holeDiam) {
		var hole1 = new THREE.Path();
		var hole1Pos = copyPoint(hole0Pos);
		hole1Pos.x = hole1Pos.x + par.hole1X;
		hole1Pos.y = hole1Pos.y + par.hole1Y;
		addCircle(hole1, dxfPrimitivesArr, hole1Pos, par.holeDiam / 2, dxfBasePoint)
		if (par.hole1Zenk) hole1.drawing = {zenk: par.hole1Zenk};
		shape.holes.push(hole1);
	}

	/*отверстие № 2*/
	if (par.hole2X && par.hole2Y && par.holeDiam) {
		var hole2 = new THREE.Path();
		var hole2Pos = copyPoint(hole0Pos);
		hole2Pos.x = hole2Pos.x + par.hole2X;
		hole2Pos.y = hole2Pos.y + par.height - par.hole2Y;
		addCircle(hole2, dxfPrimitivesArr, hole2Pos, par.holeDiam / 2, dxfBasePoint)
		if (par.hole2Zenk) hole2.drawing = {zenk: par.hole2Zenk};
		shape.holes.push(hole2);
	}

	/*отверстие № 3*/
	if (par.hole3X && par.hole3Y && par.holeDiam) {
		var hole3 = new THREE.Path();
		var hole3Pos = copyPoint(hole0Pos);
		hole3Pos.x = hole0Pos.x + par.width - par.hole3X;
		hole3Pos.y = hole0Pos.y + par.height - par.hole3Y;
		addCircle(hole3, dxfPrimitivesArr, hole3Pos, par.holeDiam / 2, dxfBasePoint)
		if (par.hole3Zenk) hole3.drawing = {zenk: par.hole4Zenk};
		shape.holes.push(hole3);
	}

	/*отверстие № 4*/
	if (par.hole4X && par.hole4Y && par.holeDiam) {
		var hole4 = new THREE.Path();
		var hole4Pos = copyPoint(hole0Pos);
		hole4Pos.x = hole0Pos.x + par.width - par.hole4X;
		hole4Pos.y = hole0Pos.y + par.hole4Y;
		addCircle(hole4, dxfPrimitivesArr, hole4Pos, par.holeDiam / 2, dxfBasePoint)
		if (par.hole4Zenk) hole4.drawing = {zenk: par.hole4Zenk};
		shape.holes.push(hole4);
	}

	/*отверстие № 5*/
	if (par.hole5X && par.hole5Y && par.holeDiam5) {
		var hole5 = new THREE.Path();
		var hole5Pos = copyPoint(hole0Pos);
		hole5Pos.x = hole5Pos.x + par.hole5X;
		hole5Pos.y = hole5Pos.y + par.hole5Y;
		addCircle(hole5, dxfPrimitivesArr, hole5Pos, par.holeDiam5 / 2, dxfBasePoint)
		if (par.hole5Zenk) hole5.drawing = {zenk: par.hole5Zenk};
		shape.holes.push(hole5);
	}
	par.shape = shape;

	return par;
}




function drawProfile(profileParams) {
    /*параметры:
            width: profileWidth,
            height: profileHeight,
            angle1: angle1,
            angle2: angle2,
            backLength: backLength,
            dxfBasePoint: dxfBasePoint,
            dxfPrimitivesArr: dxfPrimitivesArr,
            */

	var shape = new THREE.Shape();


	/*внешний контур*/

	var p1 = { x: 0, y: 0 }
	var p2 = newPoint_xy(p1, profileParams.backLength, 0);
	var p3 = newPoint_y(p2, profileParams.width, profileParams.angle2);
	var p4 = newPoint_y(p1, profileParams.width, profileParams.angle1);

	addLine(shape, profileParams.dxfPrimitivesArr, p1, p2, profileParams.dxfBasePoint);
	addLine(shape, profileParams.dxfPrimitivesArr, p2, p3, profileParams.dxfBasePoint);
	addLine(shape, profileParams.dxfPrimitivesArr, p3, p4, profileParams.dxfBasePoint);
	addLine(shape, profileParams.dxfPrimitivesArr, p4, p1, profileParams.dxfBasePoint);

	var extrudeOptions = {
		amount: profileParams.height,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geometry, profileParams.material);
	profileParams.mesh = mesh;

	return profileParams;
}



/*** ВСПОМОГАТЕЛЬЫНЕ ВНУТРЕННИЕ ФУНКЦИИ ***/



/**
 * Фланец крепления колоны к площадке с двумя овальными отверстиями
 */
function drawColFlan(columnParams) {
    var dxfBasePoint = copyPoint(columnParams.dxfBasePoint);
	dxfBasePoint.x += 100;

    var text = 'Фланец крепления колоны';
    var textHeight = 30;
    var textBasePoint = newPoint_xy(dxfBasePoint, 20, -250);
    addText(text, textHeight, dxfPrimitivesArr, textBasePoint);

    var flanShape = new THREE.Shape();

    var p0 = { x: 0.0, y: 0.0 };
    var p1 = newPoint_xy(p0, 0.0, 154.0);
    var p2 = newPoint_xy(p0, 40.0, 0.0);
    var p3 = newPoint_xy(p0, 40.0, 154.0);
    var ptc1 = newPoint_xy(p1, 8.0, 0.0);
    var ptc2 = newPoint_xy(p3, -8.0, 0.0);
    addLine(flanShape, dxfPrimitivesArr, p1, p0, dxfBasePoint);
    addLine(flanShape, dxfPrimitivesArr, p0, p2, dxfBasePoint);
    addLine(flanShape, dxfPrimitivesArr, p2, p3, dxfBasePoint);
    addArc2(flanShape, dxfPrimitivesArr, ptc2, 8.0, Math.PI * 0.5, 0, false, dxfBasePoint)
    addLine(flanShape, dxfPrimitivesArr, newPoint_xy(ptc2, 0.0, 8.0), newPoint_xy(ptc1, 0.0, 8.0), dxfBasePoint);
	addArc2(flanShape, dxfPrimitivesArr, ptc1, 8.0, Math.PI, Math.PI * 0.5, false, dxfBasePoint);

    var holes = flanShape.holes;
 /*
	    // отверстия
	    var hole1 = new THREE.Path();
	    var hole2 = new THREE.Path();
	    var center1 = newPoint_xy(p1, 20.0, -8.0);
	    var center2 = newPoint_xy(center1, 0.0, -60.0);
	    addLine(hole1, dxfPrimitivesArr, newPoint_xy(center1, -6.0, 0.0), newPoint_xy(center1, -6.0, -20.0), dxfBasePoint);
	    addArc(hole1, dxfPrimitivesArr, newPoint_xy(center1, 0.0, -20.0), 6.0, Math.PI, Math.PI * 2.0, dxfBasePoint)
	    addLine(hole1, dxfPrimitivesArr, newPoint_xy(center1, 6.0, -20.0), newPoint_xy(center1, 6.0, 0.0), dxfBasePoint);
	    addArc(hole1, dxfPrimitivesArr, center1, 6.0, 0, Math.PI, dxfBasePoint);
    
	    addLine(hole2, dxfPrimitivesArr, newPoint_xy(center2, -6.0, 0.0), newPoint_xy(center2, -6.0, -20.0), dxfBasePoint);
	    addArc(hole2, dxfPrimitivesArr, newPoint_xy(center2, 0.0, -20.0), 6.0, Math.PI, Math.PI * 2.0, dxfBasePoint)
	    addLine(hole2, dxfPrimitivesArr, newPoint_xy(center2, 6.0, -20.0), newPoint_xy(center2, 6.0, 0.0), dxfBasePoint);
	    addArc(hole2, dxfPrimitivesArr, center2, 6.0, 0, Math.PI, dxfBasePoint);
	    holes.push(hole1);
	    holes.push(hole2);
 */
    //верхнее отверстие
    var center = {
	    x: 20,
	    y: 136,
    }
    var distOval = 20;
    var clockwise = true;
    addOvalHoleY(flanShape, dxfPrimitivesArr, center, 6.5, distOval, dxfBasePoint, clockwise)

    //нижнее отверстие 
    var center2 = newPoint_xy(center, 0, -60);
    addOvalHoleY(flanShape, dxfPrimitivesArr, center2, 6.5, distOval, dxfBasePoint, clockwise)

    var flanThickness = 8.0;
    var flanExtrudeOptions = {
        amount: flanThickness,
        bevelEnabled: false,
        curveSegments: 12,
        steps: 1
    };

    var geom = new THREE.ExtrudeGeometry(flanShape, flanExtrudeOptions);
    geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
    var flan = new THREE.Mesh(geom, params.materials.metal);
    flan.castShadow = true;

    columnParams.dxfBasePoint.x += 200;

    return flan;
}//end of drawColFlan
