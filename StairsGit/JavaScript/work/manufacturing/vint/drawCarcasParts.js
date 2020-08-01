//

function drawBanisterAngle_(par) {
	par.mesh = new THREE.Object3D();
	par.thk = 2;
	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	//верхняя пластина
	var dxfBasePoint = {
		x: 0,
		y: 0
	}
	var p0 = {
		x: 0,
		y: 0
	}
	var topShape = new THREE.Shape();
	var cornerRad = 8;
	var clockwise = true;
	par.holeDist = 24;

	//углы без учета скруглений
	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p1, 0, 5);
	var p3 = newPoint_xy(p1, -20, 30);
	var p4 = newPoint_xy(p1, 40, 30);
	var p5 = newPoint_xy(p1, 20, 5);
	var p6 = newPoint_xy(p1, 20, 0);

	//скругление левого угла
	var fil1 = calcFilletParams1(p2, p3, p4, cornerRad, clockwise)
	//скругление правого угла
	var fil2 = calcFilletParams1(p3, p4, p5, cornerRad, clockwise)

	addLine(topShape, par.dxfArr, p1, p2, dxfBasePoint);
	addLine(topShape, par.dxfArr, p2, fil1.start, dxfBasePoint);
	addArc(topShape, par.dxfArr, fil1.center, cornerRad, fil1.angstart, fil1.angend, dxfBasePoint)
	addLine(topShape, par.dxfArr, fil1.end, fil2.start, dxfBasePoint);
	addArc(topShape, par.dxfArr, fil2.center, cornerRad, fil2.angstart, fil2.angend, dxfBasePoint)
	addLine(topShape, par.dxfArr, fil1.end, p5, dxfBasePoint);
	addLine(topShape, par.dxfArr, p5, p6, dxfBasePoint);
	addLine(topShape, par.dxfArr, p6, p1, dxfBasePoint);

	//отверстия
	var center1 = newPoint_xy(p1, -2, 22);
	var holeRad = 3.5;
	addRoundHole(topShape, par.dxfArr, center1, holeRad, dxfBasePoint); //функция в файле drawPrimitives

	var center2 = newPoint_xy(center1, par.holeDist, 0);
	var holeRad = 3.5;
	addRoundHole(topShape, par.dxfArr, center2, holeRad, dxfBasePoint); //функция в файле drawPrimitives



	var geometry = new THREE.ExtrudeGeometry(topShape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var topPlate = new THREE.Mesh(geometry, par.material);
	topPlate.rotation.x = Math.PI / 2
	topPlate.position.x = -10;
	topPlate.position.y = 25;
	topPlate.position.z = 0;
	par.mesh.add(topPlate);



	//вертикальная пластина
	var frontShape = new THREE.Shape();
	var dxfBasePoint = {
		x: 0,
		y: -50
	}
	var p0 = {
		x: 0,
		y: 0
	}
	par.holeOffset = 9;
	par.height = 25;
	par.vertWidth = 20;

	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p1, 0, par.height);
	var p3 = newPoint_xy(p1, par.vertWidth, par.height);
	var p4 = newPoint_xy(p1, par.vertWidth, 0);


	addLine(frontShape, par.dxfArr, p1, p2, dxfBasePoint);
	addLine(frontShape, par.dxfArr, p2, p3, dxfBasePoint);
	addLine(frontShape, par.dxfArr, p3, p4, dxfBasePoint);
	addLine(frontShape, par.dxfArr, p4, p1, dxfBasePoint);

	//овальное отверстие
	var holeWidth = 7;
	var holeHeight = 10;
	var hole1 = new THREE.Path();
	var center1 = newPoint_xy(p1, 10, 7.5);
	var center2 = newPoint_xy(center1, 0, 3);
	var p1 = newPoint_xy(center1, holeWidth / 2, 0);
	var p2 = newPoint_xy(center2, holeWidth / 2, 0);
	var p3 = newPoint_xy(center2, -holeWidth / 2, 0);
	var p4 = newPoint_xy(center1, -holeWidth / 2, 0);
	addLine(hole1, par.dxfArr, p1, p2, dxfBasePoint)
	addArc(hole1, par.dxfArr, center2, holeWidth / 2, 0, Math.PI, dxfBasePoint)
	addLine(hole1, par.dxfArr, p3, p4, dxfBasePoint)
	addArc(hole1, par.dxfArr, center1, holeWidth / 2, Math.PI, Math.PI * 2, dxfBasePoint)
	frontShape.holes.push(hole1);

	var geometry = new THREE.ExtrudeGeometry(frontShape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var frontPlate = new THREE.Mesh(geometry, par.material);
	frontPlate.position.x = -10;
	frontPlate.position.y = 0;
	frontPlate.position.z = 0;
	par.mesh.add(frontPlate);

	//сохраняем данные для спецификации
	var partName = "balAngle";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Уголок балясины",
				metalPaint: true,
				timberPaint: false,
				division: "stock_2",
				workUnitName: "amt", //единица измерения
				group: "Ограждения",
			}
		}
		var name = "3мм";
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}
	par.mesh.specId = partName + name;

	return par;
} //end of drawBanisterAngle

function drawBal(par) {
	//функция отрисовывает прямоугольную балясину с боковыми уголками

	par.mesh = new THREE.Object3D();
	var dxfBasePoint = par.dxfBasePoint;


	/*стойка*/
	var extrudeOptions = {
		amount: par.size,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var shape = new THREE.Shape();
	var p0 = {
		x: 0,
		y: 0
	}

	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p1, 0, par.length);
	var p3 = newPoint_xy(p1, par.size, par.length);
	var p4 = newPoint_xy(p1, par.size, 0);

	addLine(shape, par.dxfArr, p1, p2, dxfBasePoint);
	addLine(shape, par.dxfArr, p2, p3, dxfBasePoint);
	addLine(shape, par.dxfArr, p3, p4, dxfBasePoint);
	addLine(shape, par.dxfArr, p4, p1, dxfBasePoint);


	//отверстие под нижний уголок
	par.botHoleOffset = 20;
	if (par.type == "first") par.botHoleOffset = 15;
	if (par.base == "stringer") par.botHoleOffset += par.holeOffset;
	var center1 = newPoint_xy(p1, par.size / 2, par.botHoleOffset);
	par.holeRad = 3.5;
	addRoundHole(shape, par.dxfArr, center1, par.holeRad, dxfBasePoint); //функция в файле drawPrimitives

	//отверстие под средний уголок
	if (par.type != "middle" && par.base !== 'stringer') {
		var center2 = newPoint_xy(center1, 0, par.holeDst + 2);
		addRoundHole(shape, par.dxfArr, center2, par.holeRad, dxfBasePoint); //функция в файле drawPrimitives
    }

	//отверстие под кронштейн поручня
	if (par.topHole == "yes") {
		par.bracketHoleOffset = 8;
		var center3 = newPoint_xy(p2, par.size / 2, -par.bracketHoleOffset);
		addRoundHole(shape, par.dxfArr, center3, par.holeRad, dxfBasePoint); //функция в файле drawPrimitives
	}

	var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var bal = new THREE.Mesh(geometry, par.balMaterial);
	bal.position.x = -par.size / 2;
	bal.position.y = 0;
	bal.position.z = -par.size;
	par.mesh.add(bal);

	//подпись под фигурой
	var textHeight = 30;
	var textBasePoint = newPoint_xy(dxfBasePoint, -100, -50)
    addText(par.text, textHeight, dxfPrimitivesArr, textBasePoint)

    //кронштейн поручня
    if (par.topHole == "yes") {
			var holder = drawHolderVint();
	    holder.position.x = center3.x - 10;
			holder.position.y = center3.y;
			
			holder.rotation.y = Math.PI / 2;
	    par.mesh.add(holder);
    }

    /*уголки*/

	var angleGap = 0.1; //зазор чтобы проходили тесты

	var angleParams = {
		material: par.angMaterial,
		dxfArr: [],
    }
    if (par.type == "first") angleParams.noBolts = true;

	//нижний уголок
	angleParams = drawBanisterAngle(angleParams);
	var angle = angleParams.mesh;
	if (par.type == "first") {
		angle.rotation.z = Math.PI;
		angle.position.z = angleGap;
		angle.position.y = angleParams.height;
	}
	if (par.type != "first") {
		angle.position.z = angleGap;
		angle.position.y = par.botHoleOffset - angleParams.holeOffset;
	}
	par.mesh.add(angle);

	//верхний уголок
    angleParams.noBolts = false;
	if (par.type != "middle" && par.base !== 'stringer') {
		angleParams = drawBanisterAngle(angleParams);
		var angle = angleParams.mesh;
		angle.position.z = angleGap;
		angle.position.y = par.botHoleOffset + par.holeDst - angleParams.holeOffset + par.angleShift;
		par.mesh.add(angle);
    }
   
   //нижняя заглушка		
	var plugParams = {
		id: "plasticPlug_20_20",
		width: 20,
		height: 20,
		description: "Заглушка низа балясины",
		group: "Ограждения"
	}
	var rackBotPlug = drawPlug(plugParams);
	rackBotPlug.position.z -= par.size / 2;
	rackBotPlug.position.y = 0;
	if(!testingMode) par.mesh.add(rackBotPlug);


	//сохраняем данные для спецификации
	var partName = "bal";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Балясина черн. ",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Ограждения",
			}
		}
		if (params.rackType == "нержавейка") {
			specObj[partName].name = "Балясина нерж. "
			specObj[partName].metalPaint = false;
		}
		var name = "";
		if (par.type == "first") name += "стартовая "
		if (par.type == "middle") name += "промежуточная "
		name += "L=" + par.length;
		if (par.type != "middle") name += " аст=" + (par.botHoleOffset + par.holeDst);

		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}
	par.mesh.specId = partName + name;

	return par;

} //end of drawBal

function drawMetalTreadFrontPlate(par) {
	var length = par.length;
	var widthHi = 120; //высота ребна на внутренней стороне
	par.widthHi = widthHi;
	var widthLow = 40; //высота ребра на внешней стороне
	var offsetIn = 15; //длина горизонтального участка у столба
	var cornerRad = 15; //радиус скругления нижнего угла на внешней стороне 

	var shape = new THREE.Shape();
	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var p0 = {
		x: 0,
		y: 0
	}

	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p1, 0, widthHi);
	var p3 = newPoint_xy(p2, length, 0);
	var p4 = newPoint_xy(p3, 0, -widthLow);
	var p5 = newPoint_xy(p1, offsetIn, 0);

	//скругление нижнего угла на внешней стороне
	var clockwise = true;
	var fil4 = calcFilletParams1(p3, p4, p1, cornerRad, clockwise)

	addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p3, fil4.start, par.dxfBasePoint);
	addArc(shape, par.dxfArr, fil4.center, cornerRad, fil4.angstart, fil4.angend, par.dxfBasePoint);
	addLine(shape, par.dxfArr, fil4.end, p5, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p5, p1, par.dxfBasePoint);

	var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var topPlate = new THREE.Mesh(geometry, par.material);
	par.mesh = topPlate;

	return par;

} //end of drawMetalTreadFrontPlate

function drawVintTreadShape(par) {
	/*чертеж ступени с обозначением параметров здесь:
	http://6692035.ru/drawings/vint/vintTread.pdf
	*/

	//локальные переменные
	var staircaseDiam = params.staircaseDiam;
	var treadAngle = par.treadAngle;
	var treadLowRad = par.treadLowRad;
	var columnRad = par.columnDiam / 2 + 0.05; //учитываем зазор для тестирования
	var holeDiam = par.holeDiam;
	var type = par.type;
	var stairRad = staircaseDiam / 2;
	// Уменьшаем рамку чтобы получить свес
	if (par.isFrameTop && params.stairType == 'рамки') stairRad -= params.vintNose;

	var overlayAngle = calcTriangleParams().treadOverlayAngle;

	//угол между ребрами ступени
	var extraAngle = calcTriangleParams().extraAngle;
	var edgeLength = stairRad * Math.cos(extraAngle);
	var edgeAngle = treadAngle - 2 * extraAngle;

	
	//сохраняем значения в массив параметров
	if (!par.isMonoSpiral) {
		stairParams.treadAngle = treadAngle;
		stairParams.treadEdgeAngle = edgeAngle;
	}

	//рассчитываем координаты базовых точек
	var basePoints = calcVintTreadPoints(par.treadAngle)
	//деревянная ступень
	if (type == "timber" && !par.isMonoSpiral) {
		/*рассчитываем координаты точек*/
		var p0 = basePoints[0]
		var p1 = basePoints[1]
		var p2 = basePoints[2]
		var p3 = basePoints[3]
		var p4 = basePoints[4]
		
		var dxfBasePoint = {
			x: 0,
			y: 0,
		}

		/*вычерчиваем конутр ступени*

		var treadShape = new THREE.Shape();
			addArc(treadShape, par.dxfArr, p0, treadLowRad, 1.5*Math.PI, (Math.PI/2 + edgeAngle), dxfBasePoint);
			addLine(treadShape, par.dxfArr, p2, p3, dxfBasePoint);
			addArc(treadShape, par.dxfArr, p0, stairRad, (treadAngle - extraAngle), -extraAngle, dxfBasePoint);
			addLine(treadShape, par.dxfArr, p4, p1, dxfBasePoint);
		*/

		var filletRad = 10;
		//скругление верхнего угла
		var filletPar = {
			line_p1: copyPoint(p2),
			line_p2: copyPoint(p3),
			arcCenter: copyPoint(p0),
			arcRad: stairRad,
			filletRad: filletRad,
			topAngle: true,
		}

		filletPar = calcArcFillet(filletPar);
		var filletPar1 = filletPar.filletPar[0];

		//скругление нижнего угла
		var filletPar = {
			line_p1: copyPoint(p1),
			line_p2: copyPoint(p4),
			arcCenter: copyPoint(p0),
			arcRad: stairRad,
			filletRad: filletRad,
			topAngle: false,
		}

		filletPar = calcArcFillet(filletPar);
		var filletPar2 = filletPar.filletPar[0];

		/*вычерчиваем конутр ступени*/

		var treadShape = new THREE.Shape();
		//малая дуга
		addArc(treadShape, par.dxfArr, p0, treadLowRad, 1.5 * Math.PI, (Math.PI / 2 + edgeAngle), dxfBasePoint);
		//верхняя линия
		addLine(treadShape, par.dxfArr, p2, filletPar1.start, dxfBasePoint);
		//дуга скругления верхнего угла
		addArc(treadShape, par.dxfArr, filletPar1.center, filletRad, filletPar1.angStart, filletPar1.angEnd, dxfBasePoint);
		//большая дуга
		addArc(treadShape, par.dxfArr, p0, stairRad, filletPar1.angEnd, filletPar2.angStart, dxfBasePoint);
		//дуга скругления нижнего угла
		addArc(treadShape, par.dxfArr, filletPar2.center, filletRad, filletPar2.angStart, filletPar2.angEnd, dxfBasePoint);
		addLine(treadShape, par.dxfArr, filletPar2.end, p1, dxfBasePoint);

		/*отверстие*/
		var hole = new THREE.Path();
		addCircle(hole, par.dxfArr, p0, holeDiam / 2, dxfBasePoint)
		treadShape.holes.push(hole);



		//Направление волокон
		var trashShape = new THREE.Shape();
		var pt1 = newPoint_xy(p0, 200, 0)
		var pt11 = newPoint_xy(pt1, 40, 10)
		var pt12 = newPoint_xy(pt1, 40, -10)
		addLine(trashShape, par.dxfArr, pt1, pt11, dxfBasePoint);
		addLine(trashShape, par.dxfArr, pt1, pt12, dxfBasePoint);
		var pt2 = newPoint_xy(pt1, 400, 0)
		var pt21 = newPoint_xy(pt2, -40, 10)
		var pt22 = newPoint_xy(pt2, -40, -10)
		addLine(trashShape, par.dxfArr, pt2, pt21, dxfBasePoint);
		addLine(trashShape, par.dxfArr, pt2, pt22, dxfBasePoint);
		addLine(trashShape, par.dxfArr, pt1, pt2, dxfBasePoint);

		var text = "Направление волокон"
		var textHeight = 20;
		var textBasePoint = newPoint_xy(dxfBasePoint, 210, 30);
		addText(text, textHeight, par.dxfArr, textBasePoint);

		var sizeA = edgeLength + treadLowRad;
		var sizeB = distance(p3, p4);
		//сохраняем параметры для спецификации
		staircasePartsParams.treadWidth = distance(p3, p4)
		staircasePartsParams.treadLength = edgeLength + treadLowRad;
		staircasePartsParams.treadArea = ((p3.y - p2.y) / 2 + (p2.y - p1.y)) * (edgeLength + treadLowRad) / 1000000;
		staircasePartsParams.treadPaintedArea = staircasePartsParams.treadArea * 2 + (edgeLength * 2 + staircasePartsParams.treadWidth + treadLowRad * Math.PI) * params.treadThickness / 1000000;
	}

	/*металлическая ступень*/

	if (type == "metal" && !par.isMonoSpiral) {
		var deltaAng = Math.PI / 6; //половина угла, на который уменьшается дуга ступени, прилегающая к бобышке
		var radIn = columnRad + 0.1; //радиус внутренней дуги, примыкающей к бобышке
		/*рассчитываем координаты точек*/
		var p0 = {
			x: 0,
			y: 0
		}
		var p11 = polar(p0, -Math.PI / 2 + deltaAng, radIn); //точка на дуге
		var p1 = polar(p11, -Math.PI / 2, 5);
		var p21 = polar(p0, edgeAngle + Math.PI / 2 - deltaAng, radIn) //точка на дуге
		var p2 = polar(p21, Math.PI / 2 + edgeAngle, 5);

		// Добавляем свес
		if (!par.isFrameTop && params.stairType == 'рамки'){
			p2 = polar(p21, Math.PI / 2 + edgeAngle, 5 + params.vintNose);
			p1 = polar(p11, -Math.PI / 2, 5 + params.vintNose);
			extraAngle -= Math.asin(params.vintNose / stairRad);
		}
		
		var p3 = {
			x: stairRad * Math.cos(treadAngle - extraAngle),
			y: stairRad * Math.sin(treadAngle - extraAngle)
		}
		
		var p4 = {
			x: edgeLength,
			y: -treadLowRad
		}

		var dxfBasePoint = {
			x: 0,
			y: 0,
		}

		var stairRadAngle = extraAngle;
		if (!par.isFrameTop && params.stairType == 'рамки'){
			p4.y -= params.vintNose;
		} 

		/*вычерчиваем конутр ступени*/
		var treadShape = new THREE.Shape();
		addLine(treadShape, par.dxfArr, p1, p11, dxfBasePoint);
		addArc2(treadShape, par.dxfArr, p0, radIn, (Math.PI / 2 + edgeAngle - deltaAng), -Math.PI / 2 + deltaAng,  false, dxfBasePoint);
		addLine(treadShape, par.dxfArr, p21, p2, dxfBasePoint);
		addLine(treadShape, par.dxfArr, p2, p3, dxfBasePoint);
		addArc2(treadShape, par.dxfArr, p0, stairRad, (treadAngle - extraAngle), -stairRadAngle, true, dxfBasePoint);
		addLine(treadShape, par.dxfArr, p4, p1, dxfBasePoint);

		//параметры для передней пластины
		par.edgeLength = distance(p4, p1)
		
		// на рамках сохраняем только координаты каркаса
		if (par.isFrameTop || params.stairType != 'рамки') {
			par.p1 = p1;
			par.p2 = p2;
			par.ang1 = angle(p1, p4)
			par.ang2 = angle(p2, p3)
		}

		var sizeA = edgeLength;
		var sizeB = distance(p3, p4);

		if (par.isFrameTop) {
			var sideOffset = 40;
			// торец ступени
			var line1 = parallel(p2, p3, -sideOffset);
			var line2 = parallel(p4, p1, sideOffset);

			// бока ступени
			var line3 = parallel(p1, p2, sideOffset + radIn);
			var line4 = parallel(p3, p4, -sideOffset);

			var p0 = itercection(line1.p1, line1.p2, line3.p1, line3.p2);
			var p1 = itercection(line2.p1, line2.p2, line3.p1, line3.p2);
			var p2 = itercection(line2.p1, line2.p2, line4.p1, line4.p2);
			var p3 = itercection(line1.p1, line1.p2, line4.p1, line4.p2);
			
			p0.filletRad = p1.filletRad = p2.filletRad = p3.filletRad = 15;

			var shapePar = {
				points: [p0,p1, p2, p3],
				dxfArr: par.dxfArr,
				dxfBasePoint: dxfBasePoint
			}
			var hole = drawShapeByPoints2(shapePar).shape;
			treadShape.holes.push(hole);
		}

	}

	/*ступень для монокосоура*/
	if (par.isMonoSpiral) {
		var radIn = columnRad + 0.1;
		var center = basePoints[0];

		var points = itercectionLineCircle(basePoints[1], basePoints[4], center, radIn);
		var pt1 = points[1]
		if (points[0].x > center.x) pt1 = points[0];

		var points = itercectionLineCircle(basePoints[2], basePoints[3], center, radIn);
		var pt2 = points[1]
		if (points[0].x > center.x) pt2 = points[0];


		var p0 = basePoints[0]
		var p1 = pt1
		var p2 = pt2
		var p3 = basePoints[3]
		var p4 = basePoints[4]

		var dxfBasePoint = {
			x: 0,
			y: 0,
		}

		/*вычерчиваем конутр ступени*/

		var treadShape = new THREE.Shape();
		//addLine(treadShape, par.dxfArr, p1, p11, dxfBasePoint);
		addArc2(treadShape, par.dxfArr, p0, radIn, calcAngleX1(p0, p2), calcAngleX1(p0, p1), false, dxfBasePoint);
		addLine(treadShape, par.dxfArr, p2, p3, dxfBasePoint);
		addArc2(treadShape, par.dxfArr, p0, stairRad, calcAngleX1(p0, p3), calcAngleX1(p0, p4), true, dxfBasePoint);
		addLine(treadShape, par.dxfArr, p4, p1, dxfBasePoint);


	/*рассчитываем и запоминаем точки контуров подложек и передней пластины*/
		//точки контура подложки
		var widthPlate = params.M / 2;
		var radPlate = staircaseDiam / 2 - params.M / 2;
		var radOutPlate = radPlate + widthPlate / 2;
		var radInPlate = radPlate - widthPlate / 2;

		var pc1 = p1;
		var pc2 = p2;
		var pc3 = p3;
		var pc4 = p4;
		if (par.turnFactor == 1) {
			pc1 = p2;
			pc2 = p1;
			pc3 = p4;
			pc4 = p3;
		}

		var line = parallel(pc2, pc3, 50 * par.turnFactor);

		var points = itercectionLineCircle(pc1, pc4, center, radInPlate);
		var pt1 = points[1]
		if (points[0].x > center.x) pt1 = points[0];

		var points = itercectionLineCircle(line.p1, line.p2, center, radInPlate);
		var pt2 = points[1]
		if (points[0].x > center.x) pt2 = points[0];

		var points = itercectionLineCircle(line.p1, line.p2, center, radOutPlate);
		var pt3 = points[1]
		if (points[0].x > center.x) pt3 = points[0];

		var points = itercectionLineCircle(pc1, pc4, center, radOutPlate);
		var pt4 = points[1]
		if (points[0].x > center.x) pt4 = points[0];

		par.pointsTreadPlate = [pt1, pt2, pt3, pt4];	

		//точки для построения отверстий в подложке
		var widthStringer = 150 - 4 * 2;
		var radPlate = staircaseDiam / 2 - params.M / 2;
		var radOutPlate = radPlate + widthStringer / 2;
		var radInPlate = radPlate - widthStringer / 2;

		var line = parallel(pc2, pc3, 90 * par.turnFactor);

		var points = itercectionLineCircle(pc1, pc4, center, radInPlate);
		var pt1 = points[1]
		if (points[0].x > center.x) pt1 = points[0];

		var points = itercectionLineCircle(line.p1, line.p2, center, radInPlate);
		var pt2 = points[1]
		if (points[0].x > center.x) pt2 = points[0];

		var points = itercectionLineCircle(line.p1, line.p2, center, radOutPlate);
		var pt3 = points[1]
		if (points[0].x > center.x) pt3 = points[0];

		var points = itercectionLineCircle(pc1, pc4, center, radOutPlate);
		var pt4 = points[1]
		if (points[0].x > center.x) pt4 = points[0];

		par.pointsTreadPlateHoles = [pt1, pt2, pt3, pt4];		
		
		//точки контура передней пластины монокосоура
		var points = itercectionLineCircle(pc1, pc4, center, radPlate - widthStringer / 2);
		var pt1 = points[1]
		if (points[0].x > center.x) pt1 = points[0];

		var points = itercectionLineCircle(pc1, pc4, center, radPlate + widthStringer / 2);
		var pt2 = points[1]
		if (points[0].x > center.x) pt2 = points[0];
		
		par.pointsFrontPlate = [pt1, pt2];
	}
	/*отверстия под стойки*

	//отверстия под первую балясину
	var holesOffset = 22; //отступ отверстий от внешней кромки ступени
	var holeDst = 24; //расстояние между отверстиями в уголке
	var holePosRad = stairRad - holesOffset; //радиус расположения отверстий
	var dirAng = overlayAngle / 2 - extraAngle //угол направления на балясину
	var deltAng = holeDst / 2 / holePosRad; //дельта угла из-за того, что в уголке 2 отверстия

	var holeRad = 4;
	if (type == "timber") holeRad = 2;
	var center1 = polar(p0, dirAng + deltAng, holePosRad)
	var center2 = polar(p0, dirAng - deltAng, holePosRad)
	addRoundHole(treadShape, par.dxfArr, center1, holeRad, dxfBasePoint); //функция в файле drawPrimitives
	addRoundHole(treadShape, par.dxfArr, center2, holeRad, dxfBasePoint);

	//отверстия под остальные стойки
	var stepAngle = params.stepAngle / 180 * Math.PI;
	var balAngle = stepAngle / params.banisterPerStep; //угол между балясинами
	for (var i = 1; i < params.banisterPerStep + 1; i++) {
		dirAng = dirAng + balAngle;
		var center1 = polar(p0, dirAng + deltAng, holePosRad)
		var center2 = polar(p0, dirAng - deltAng, holePosRad)
		addRoundHole(treadShape, par.dxfArr, center1, holeRad, dxfBasePoint);
		addRoundHole(treadShape, par.dxfArr, center2, holeRad, dxfBasePoint);
	}
	*/

	if (!(params.model == "Винтовая" && params.railingModel == "Ригели")) {
		$.each(basePoints.balHoles,
			function() {
				addRoundHole(treadShape, par.dxfArr, this, this.rad, dxfBasePoint);
			})
	}


	//подпись
	var text = "Ступень (вид сверху) "
	if (params.turnFactor == -1) text = "Ступень (вид снизу) "
	text += (params.stepAmt - 1) + " шт."
	var textHeight = 30;
	var textBasePoint = newPoint_xy(dxfBasePoint, 20, -150);
	addText(text, textHeight, par.dxfArr, textBasePoint);

	par.shape = treadShape;

	//сохраняем данные для спецификации
	var partName = "vintTread";
	if (params.stairType == 'рамки' && !par.isFrameTop) partName = "vintTreadTop";
	console.log(partName);

	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				paintedArea: 0,
				name: "Ступень " + (params.stairType == 'массив' ? params.treadsMaterial : params.stairType),
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "area", //единица измерения
				group: "Каркас",
			}
			if (partName == 'vintTreadTop') specObj[partName].name = 'Накладка ступени' + params.treadsMaterial;
			if (type == "timber" || partName == 'vintTreadTop') {
				specObj[partName].metalPaint = false;
				specObj[partName].timberPaint = true;
				specObj[partName].division = "timber";
				specObj[partName].group = "treads";
			}
		}
		var area = sizeA * sizeB / 1000000;
		var name = Math.round(sizeA) + "x" + Math.round(sizeB);
		if (type == "timber") name += "x" + params.treadThickness;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		specObj[partName]["paintedArea"] += area * 2 + area * 0.1; //к-т 0,1 учитывает площадь торцев
	}

	par.articul = partName + name;

	return par;


} //end of drawVintTreadShape


function drawVintTread(par) {

	par.mesh = new THREE.Object3D();
	par.thk = params.treadThickness;

	//верхняя пластина
	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	// if(par.isFrame) par.type = 'timber';
	topPlateParams = drawVintTreadShape(par);
	var shape = topPlateParams.shape;
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var topPlate = new THREE.Mesh(geom, par.material);
	topPlate.rotation.x = -0.5 * Math.PI;
	topPlate.position.y = -par.thk;
	if (par.isFrame) topPlate.position.y += 4;
	par.mesh.add(topPlate);
	par.mesh.specId = topPlateParams.articul;
	if (params.stairType == 'рамки') topPlate.specId = topPlateParams.articul;

	//добавляем соединительные пластины разделения тетив
	if (par.isDivide) {
		var flanDivide = drawConnectingFlans(par);
		par.mesh.add(flanDivide);
	}

	// Металлическая накладка
	if (par.isFrame) {
		extrudeOptions.amount = 4;
		par.isFrameTop = true;
		topFramePlate = drawVintTreadShape(par);
		delete par.isFrameTop;
		var shape = topFramePlate.shape;
		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var topPFramelate = new THREE.Mesh(geom, params.materials.metal);
		topPFramelate.rotation.x = -0.5 * Math.PI;
		topPFramelate.position.y = -par.thk;
		par.mesh.add(topPFramelate);
		par.mesh.specId = topFramePlate.articul;
		topPFramelate.setLayer('angles')
	}

	
	//---------------------------
    ////рассчитываем координаты базовых точек
    //var basePoints = calcVintTreadPoints(par.treadAngle)
    //var angleParams = {
    //    material: par.angMaterial,
    //    dxfArr: [],
    //}
    //for (var i = 0; i < basePoints.balHoles.length / 2; i++) {
    //    var c1 = basePoints.balHoles[i];
    //    var c2 = basePoints.balHoles[i + 1];
    //    var ang = calcAngleX1(c1, c2);
    //    angleParams = drawBanisterAngle(angleParams)
    //    var angle = angleParams.mesh;
    //    angle.rotation.y = ang;
    //    angle.position.x = c1.x;
    //    angle.position.z = c1.y;
    //    par.mesh.add(angle);
    //    i++;
    //}
    //-------------------------------------

	//передние пластины

	if (par.type == "metal" || par.isFrame) {
		var frontPlateParams = {
			length: topPlateParams.edgeLength,
			thk: 4,
			dxfArr: par.dxfArr,
			dxfBasePoint: {
				x: 2000,
				y: 0,
			},
			material: par.material,
		}

		if (par.isFrame) frontPlateParams.material = params.materials.metal;

		//первая пластина
		frontPlateParams = drawMetalTreadFrontPlate(frontPlateParams)
		var frontPlate = frontPlateParams.mesh;
		frontPlate.position.y = -par.thk - frontPlateParams.widthHi - 0.05;
		frontPlate.position.z = -par.p1.y - frontPlateParams.thk;
		frontPlate.position.x = par.p1.x;
		frontPlate.rotation.y = par.ang1;
		if (par.isFrame) frontPlate.setLayer('angles')
		par.mesh.add(frontPlate);

		//вторая пластина
		frontPlateParams.dxfArr = [];
		frontPlateParams = drawMetalTreadFrontPlate(frontPlateParams)
		var frontPlate = frontPlateParams.mesh;
		frontPlate.position.y = -par.thk - frontPlateParams.widthHi - 0.05;
		frontPlate.position.z = -par.p2.y // - frontPlateParams.thk;
		frontPlate.position.x = par.p2.x;
		frontPlate.rotation.y = par.ang2;
		if (par.isFrame) frontPlate.setLayer('angles')
		par.mesh.add(frontPlate);
	}

	return par;
}

function drawVintPlatform(par) {

	par.mesh = new THREE.Object3D();
	par.thk = params.treadThickness;

	//верхняя пластина
	var extrudeOptions = {
		amount: par.thk - 0.06,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	topPlateParams = drawVintPlatformShape(par);

	var shape = topPlateParams.shape;
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var topPlate = new THREE.Mesh(geom, par.material);
	topPlate.rotation.x = -0.5 * Math.PI;
	topPlate.position.y = -par.thk;
	if (par.turnFactor == -1) {
		topPlate.rotation.x = 0.5 * Math.PI;
		topPlate.position.y += par.thk;
	}
	topPlate.position.y += 0.03;
	par.mesh.specId = topPlateParams.articul;
	par.mesh.add(topPlate);


	//боковые пластины

	if (par.type == "metal" && par.platformType == "triangle" && params.stairType != 'рамки') {
		var dxfBasePoint = newPoint_xy(par.dxfBasePoint, 1000, 500);
		var width = 120; //высота ребра
		extrudeOptions.amount = 4;

		// Задняя пластина
		{	
			var dxfBasePoint = newPoint_xy(par.dxfBasePoint, 2500, 1000);
			
			var lengthFix = 0.5;//(extrudeOptions.amount / Math.cos(params.platformAngle * Math.PI / 180)) * Math.sin(params.platformAngle * Math.PI / 180);//Math.acos(topPlateParams.ang1)); // * 3 тк, отступ от края + 2 раза отступ от боковой пластины
			var length = topPlateParams.rearEdgeLength;
			var shape = new THREE.Shape();
			var p0 = {
				x: lengthFix,
				y: 0
			};
			var p1 = copyPoint(p0);
			var p2 = newPoint_xy(p1, 0, width);
			var p3 = newPoint_xy(p2, length - lengthFix * 2, 0);
			var p4 = newPoint_xy(p3, 0, -width);
			
			addLine(shape, par.dxfArr, p1, p2, dxfBasePoint);
			addLine(shape, par.dxfArr, p2, p3, dxfBasePoint);
			addLine(shape, par.dxfArr, p3, p4, dxfBasePoint);
			addLine(shape, par.dxfArr, p4, p1, dxfBasePoint);
			
			//отверстия
			var sideHoleOffset = 70;
			var holeAmt = 5;
			var holeDist = (length - 2 * sideHoleOffset) / (holeAmt - 1);
			var holeRad = 7;

			par.isFixPart = true; // болты крепления к стенам
			par.fixPar = getFixPart(0, 'topFloor'); // параметры крепления к стенам
			holeRad = par.fixPar.diam / 2 + 1;
			var holesFix = [];
			
			for (var i = 0; i < holeAmt; i++) {
				var center = newPoint_xy(p0, sideHoleOffset + holeDist * i, width / 2)
				addRoundHole(shape, par.dxfArr, center, holeRad, dxfBasePoint);
				holesFix.push(center);
			}
			
			//подпись под фигурой
			var text = "Задняя пластина площадки 1 шт"
			var textHeight = 30;
			var textBasePoint = newPoint_xy(dxfBasePoint, 100, -100)
			addText(text, textHeight, par.dxfArr, textBasePoint)
			
			var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
			geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
			
			var rearPlate = new THREE.Mesh(geometry, par.material);
			rearPlate.position.y = -par.thk - width - 0.05;
			rearPlate.position.z = -topPlateParams.p3.y
			rearPlate.position.x = topPlateParams.p3.x;
			if (params.turnFactor == 1) translateObject(rearPlate, 0, 0, -extrudeOptions.amount);//Смещаем объект и точку вращения чтобы можно было спокойно вращать объект без модификации положения
			if (params.turnFactor == -1) {
				rearPlate.position.z = topPlateParams.p3.y;
			}
			
			rearPlate.rotation.y = topPlateParams.ang3 * par.turnFactor;

			//rearFlan.add(rearPlate)
			par.mesh.add(rearPlate);
			

			//болты крепления к перекрытию
			if (typeof isFixPats != "undefined" && isFixPats && par.isFixPart) { //глобальная переменная		
				if (par.fixPar.fixPart !== 'нет') {
					var rearFlan = new THREE.Object3D();
					for (var i = 0; i < holesFix.length; i++) {
						var fix = drawFixPart(par.fixPar).mesh;
						fix.position.x = p0.x + holesFix[i].x;
						fix.position.y = p0.y + holesFix[i].y;
						fix.position.z = -(extrudeOptions.amount * 2) * par.turnFactor;
						fix.rotation.x = Math.PI / 2 * par.turnFactor;
						rearFlan.add(fix);
                    }
                    rearFlan.position.x = rearPlate.position.x;
                    rearFlan.position.y = rearPlate.position.y;
                    rearFlan.position.z = rearPlate.position.z;
                    rearFlan.rotation.y = rearPlate.rotation.y;
                    par.mesh.add(rearFlan);
				}
			}			
		}
		// Боковые пластины
		{
			var length = topPlateParams.edgeLength - 0.1;// - (extrudeOptions.amount / Math.acos(topPlateParams.ang1)) - 0.1;//0.5 зазор
			var width = 120; //высота ребра
			var shape = new THREE.Shape();

			var p0 = {
				x: 0,
				y: 0
			}
			var p1 = copyPoint(p0);
			var p2 = newPoint_xy(p1, 0, width);
			var p3 = newPoint_xy(p2, length, 0);
			var p4 = newPoint_xy(p3, 0, -width);

			addLine(shape, par.dxfArr, p1, p2, dxfBasePoint);
			addLine(shape, par.dxfArr, p2, p3, dxfBasePoint);
			addLine(shape, par.dxfArr, p3, p4, dxfBasePoint);
			addLine(shape, par.dxfArr, p4, p1, dxfBasePoint);

			//подпись под фигурой
			var text = "Боковые пластины площадки 2шт"
			var textHeight = 30;
			var textBasePoint = newPoint_xy(dxfBasePoint, 100, -100)
			addText(text, textHeight, par.dxfArr, textBasePoint)

			var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
			geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

			//первая пластина
			var frontPlate = new THREE.Mesh(geometry, par.material);
			frontPlate.position.y = -par.thk - width - 0.05;
			frontPlate.position.z = -topPlateParams.p1.y * params.turnFactor;
			frontPlate.position.x = topPlateParams.p1.x;
			
			if (params.turnFactor == 1) translateObject(frontPlate, 0, 0, -extrudeOptions.amount);//Смещаем объект и точку вращения чтобы можно было спокойно вращать объект без модификации положения

			frontPlate.rotation.y = topPlateParams.ang1 * par.turnFactor;
			par.mesh.add(frontPlate);

			//вторая пластина
			var geometry2 = new THREE.ExtrudeGeometry(shape, extrudeOptions);
			geometry2.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
			var frontPlate2 = new THREE.Mesh(geometry2, par.material);
			frontPlate2.position.y = -par.thk - width - 0.05;
			frontPlate2.position.z = -topPlateParams.p2.y * params.turnFactor;
			frontPlate2.position.x = topPlateParams.p2.x;
			if (params.turnFactor == -1) {
				translateObject(frontPlate2, 0, 0, -extrudeOptions.amount);//Смещаем объект и точку вращения чтобы можно было спокойно вращать объект без модификации положения
			}
			
			//коррекрируем угол для очень широких площадок
			if (topPlateParams.ang2 < 0) topPlateParams.ang2 = Math.PI + topPlateParams.ang2;
			frontPlate2.rotation.y = topPlateParams.ang2 * par.turnFactor;

			par.mesh.add(frontPlate2);
		}
		// Дополнительные пластины
		{
			dxfBasePoint = newPoint_xy(par.dxfBasePoint, 2500, 1500)
			var platformAngle = stairParams.platformEdgeAngle;
			var platformDepth = par.platformDepth;
			var treadLowRad = par.treadLowRad;
			var holeDiam = par.holeDiam;
			var type = par.type;
			var columnRad = par.columnDiam / 2 + 0.05; //учитываем зазор для тестирования

			var edgeAmt = 1;
			if (platformAngle > Math.PI / 3) edgeAmt = 2;
			var ang2 = platformAngle / (edgeAmt + 1) // * par.turnFactor;
			var offset = columnRad + 0.5;// Отступ от 0
			width = 100;
			//добавляем зазор от боковых пластин
			var shape = new THREE.Shape();
			var p0 = {
				x: 0,
				y: 0
			}
			
			length = topPlateParams.addEdge1Length - 1;
			
			// length -= offset + 0.5;//учитываем бобышку и зазор
			
			var p1 = copyPoint(p0);
			var p2 = newPoint_xy(p1, 0, width);
			var p3 = newPoint_xy(p2, length, 0);
			var p4 = newPoint_xy(p3, 0, -width);

			addLine(shape, par.dxfArr, p1, p2, dxfBasePoint);
			addLine(shape, par.dxfArr, p2, p3, dxfBasePoint);
			addLine(shape, par.dxfArr, p3, p4, dxfBasePoint);
			addLine(shape, par.dxfArr, p4, p1, dxfBasePoint);

			//подпись под фигурой
			var text = "Ребро жесткости площадки " + edgeAmt + "шт";
			var textHeight = 30;
			var textBasePoint = newPoint_xy(dxfBasePoint, 100, -100)
			addText(text, textHeight, par.dxfArr, textBasePoint)

			var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
			geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
			translateObject(geometry, offset, 0, 0);//Смещаем объект и точку вращения чтобы можно было спокойно вращать объект без модификации положения

			//первое ребро
			var midPlate1 = new THREE.Mesh(geometry, par.material);
			var addAngle = 0;//2 * Math.asin(extrudeOptions.amount / (2 * (length + columnRad)));//Корректируем угол чтобы компенсировать толщину пластины(формула поиска угла сегмента круга)
			midPlate1.rotation.y = (ang2 - addAngle) * par.turnFactor;
			midPlate1.position.y = -par.thk - width - 0.05;

			par.mesh.add(midPlate1);


			//второе дополнительное ребро
			if (edgeAmt == 2) {
				ang2 = ang2 * 2;
				var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
				geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
				translateObject(geometry, offset, 0, -extrudeOptions.amount);//Смещаем объект и точку вращения чтобы можно было спокойно вращать объект без модификации положения
				var midPlate2 = new THREE.Mesh(geometry, par.material);
				midPlate2.position.y = -par.thk - width - 0.05;
				midPlate2.rotation.y = ang2 * par.turnFactor;
				par.mesh.add(midPlate2);
			}
		}
	
	}

	if (par.type == "metal" && par.platformType == "square" && params.stairType != 'рамки') {
		var dxfBasePoint = newPoint_xy(par.dxfBasePoint, 2500, 0)
		var width = 120; //высота ребра
		extrudeOptions.amount = 4;
		
		//передняя пластина
		var length = topPlateParams.edgeLength1;
		var shape = new THREE.Shape();
		var p0 = {
			x: 0,
			y: 0
		}
		var p1 = copyPoint(p0);
		var p2 = newPoint_xy(p1, 0, width);
		var p3 = newPoint_xy(p2, length, 0);
		var p4 = newPoint_xy(p3, 0, -width);

		addLine(shape, par.dxfArr, p1, p2, dxfBasePoint);
		addLine(shape, par.dxfArr, p2, p3, dxfBasePoint);
		addLine(shape, par.dxfArr, p3, p4, dxfBasePoint);
		addLine(shape, par.dxfArr, p4, p1, dxfBasePoint);

		//подпись под фигурой
		var text = "Передняя пластина площадки 1шт"
		var textHeight = 30;
		var textBasePoint = newPoint_xy(dxfBasePoint, 100, -100)
		addText(text, textHeight, par.dxfArr, textBasePoint)

		var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		var frontPlate = new THREE.Mesh(geometry, par.material);
		frontPlate.position.y = -par.thk - width - 0.05;
		frontPlate.position.z = -topPlateParams.p1.y - extrudeOptions.amount
		if (par.turnFactor == -1) frontPlate.position.z = topPlateParams.p1.y;
		frontPlate.position.x = topPlateParams.p1.x;
		frontPlate.rotation.y = 0;
		par.mesh.add(frontPlate);

		//добавляем фланец соединения тетивы к площадке
		if (params.model != "Винтовая" && params.platformType !== 'нет' && params.platformLedgeM > 0) {
			var falnWidth = 60;
			var falnHeigth = 100;
			var pf1 = { x: 0, y: 0 };
			var pf2 = newPoint_xy(pf1, 0, falnHeigth);
			var pf3 = newPoint_xy(pf2, falnWidth, 0);
			var pf4 = newPoint_xy(pf3, 0, -falnHeigth);

			pf3.filletRad = pf4.filletRad = 10;

			var points = [pf1, pf2, pf3, pf4]

			//создаем шейп
			var shapePar = {
				points: points,
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: newPoint_xy(dxfBasePoint, params.platformLedgeM, width + 10)
			}

			var shapeFlan = drawShapeByPoints2(shapePar).shape;

			var hole1 = newPoint_xy(pf1, 30, 20);
			var hole2 = newPoint_xy(hole1, 0, 60);
			addRoundHole(shapeFlan, dxfPrimitivesArr, hole1, 6.5, shapePar.dxfBasePoint);
			addRoundHole(shapeFlan, dxfPrimitivesArr, hole2, 6.5, shapePar.dxfBasePoint);

			var extrudeOptions = {
				amount: 8,
				bevelEnabled: false,
				curveSegments: 12,
				steps: 1
			};
			var geometry = new THREE.ExtrudeGeometry(shapeFlan, extrudeOptions);
			geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
			var flan = new THREE.Mesh(geometry, params.materials.metal);
			flan.position.x = length - params.platformLedgeM - 4;
			flan.position.z = 4;
			if (par.turnFactor == 1) flan.position.z = -falnWidth;
			flan.position.y = 10;
			flan.rotation.y = -Math.PI / 2;
			frontPlate.add(flan);
		}

		//боковая пластина
		//dxfBasePoint = newPoint_xy(par.dxfBasePoint, 2500, 500)
		dxfBasePoint.y += 500
		var length = topPlateParams.edgeLength2;
		var sideWidth = width;// - 6;//6 - толщина площадки
		if (params.railingModel_bal == "Самонесущее стекло") sideWidth += 80;
		var shape = new THREE.Shape();
		var p0 = {
			x: 0,
			y: 0
		}
		var p1 = copyPoint(p0);
		var p2 = newPoint_xy(p1, 0, sideWidth);
		var p3 = newPoint_xy(p2, length, 0);
		var p4 = newPoint_xy(p3, 0, -sideWidth);

		addLine(shape, par.dxfArr, p1, p2, dxfBasePoint);
		addLine(shape, par.dxfArr, p2, p3, dxfBasePoint);
		addLine(shape, par.dxfArr, p3, p4, dxfBasePoint);
		addLine(shape, par.dxfArr, p4, p1, dxfBasePoint);

		//подпись под фигурой
		var text = "Боковая пластина площадки 1шт"
		var textHeight = 30;
		var textBasePoint = newPoint_xy(dxfBasePoint, 100, -100)
		addText(text, textHeight, par.dxfArr, textBasePoint)
		
		if (params.railingModel_bal == "Самонесущее стекло"){
			var center1 = newPoint_xy(p0, 5 + 95 - topPlateParams.p2.y, 50); //95 отступ от бкового края стекла(5 подогнано, пока не нашел откуда берется) 50 отступ отверстия от нижнего края стекла 
			var center2 = newPoint_xy(center1, 0, 100); //50 отступ отверстия от края стекла
			addRoundHole(shape, par.dxfArr, center1, 9, dxfBasePoint);
			addRoundHole(shape, par.dxfArr, center2, 9, dxfBasePoint);
			// console.log(topPlateParams.p2.y + topPlateParams.edgeLength2)
			if (topPlateParams.p2.y + topPlateParams.edgeLength2 >= params.platformSectionLength - 60) {
				var center3 = newPoint_xy(center1, (params.platformSectionLength - 41) - 95 * 2, 0); // 41 подогнал, по факту на 1000 получается размер стекла 959 95 отступ отверстия от бокового края стекла
				var center4 = newPoint_xy(center3, 0, 100); //50 отступ отверстия от края стекла
				addRoundHole(shape, par.dxfArr, center3, 9, dxfBasePoint);
				addRoundHole(shape, par.dxfArr, center4, 9, dxfBasePoint);
			}
		}
		
		var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		var sidePlate = new THREE.Mesh(geometry, par.material);
		sidePlate.position.x = topPlateParams.p2.x;
		sidePlate.position.y = -par.thk - sideWidth - 0.05;
		sidePlate.position.z = -topPlateParams.p2.y;
		if (par.turnFactor == -1) {
			sidePlate.position.z = topPlateParams.p2.y;
			sidePlate.position.x = topPlateParams.p2.x + extrudeOptions.amount;
		}

		sidePlate.rotation.y = Math.PI / 2 * par.turnFactor;
		par.mesh.add(sidePlate);

		//задняя пластина напротив передней

		//var dxfBasePoint = newPoint_xy(par.dxfBasePoint, 2500, 1000)
		dxfBasePoint.y += 500
		var length = topPlateParams.rearEdgeLength1;
		//добавляем зазор от боковых пластин
		length += -extrudeOptions.amount * 2;
		var shape = new THREE.Shape();
		var p0 = {
			x: 0,
			y: 0
		}
		var p1 = copyPoint(p0);
		var p2 = newPoint_xy(p1, 0, width);
		var p3 = newPoint_xy(p2, length, 0);
		var p4 = newPoint_xy(p3, 0, -width);

		addLine(shape, par.dxfArr, p1, p2, dxfBasePoint);
		addLine(shape, par.dxfArr, p2, p3, dxfBasePoint);
		addLine(shape, par.dxfArr, p3, p4, dxfBasePoint);
		addLine(shape, par.dxfArr, p4, p1, dxfBasePoint);

		//отверстия
		var sideHoleOffset = 70;
		var holeAmt = 5;
		var holeDist = (length - 2 * sideHoleOffset) / (holeAmt - 1);
		var holeRad = 7;

		for (var i = 0; i < holeAmt; i++) {
			var center = newPoint_xy(p0, sideHoleOffset + holeDist * i, width / 2)
			addRoundHole(shape, par.dxfArr, center, holeRad, dxfBasePoint);
		}


		//подпись под фигурой
		var text = "Задняя пластина площадки напротив передней 1 шт"
		var textHeight = 30;
		var textBasePoint = newPoint_xy(dxfBasePoint, 100, -100)
		addText(text, textHeight, par.dxfArr, textBasePoint)

		var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		var rearPlate = new THREE.Mesh(geometry, par.material);
		rearPlate.position.x = topPlateParams.p3.x + extrudeOptions.amount;
		rearPlate.position.y = -par.thk - width - 0.05;
		rearPlate.position.z = -topPlateParams.p3.y;
		if (par.turnFactor == -1) {
			rearPlate.position.x = topPlateParams.p3.x + extrudeOptions.amount;
			rearPlate.position.z = topPlateParams.p3.y - extrudeOptions.amount;
		}

		rearPlate.rotation.y = 0;
		par.mesh.add(rearPlate);

		//задняя пластина напротив боковой

		//var dxfBasePoint = newPoint_xy(par.dxfBasePoint, 2500, 1500)
		dxfBasePoint.y += 500
		var length = topPlateParams.rearEdgeLength2
		//добавляем зазор от боковых пластин
		length += -extrudeOptions.amount;
		var shape = new THREE.Shape();
		var p0 = {
			x: 0,
			y: 0
		}
		var p1 = copyPoint(p0);
		var p2 = newPoint_xy(p1, 0, width);
		var p3 = newPoint_xy(p2, length, 0);
		var p4 = newPoint_xy(p3, 0, -width);

		addLine(shape, par.dxfArr, p1, p2, dxfBasePoint);
		addLine(shape, par.dxfArr, p2, p3, dxfBasePoint);
		addLine(shape, par.dxfArr, p3, p4, dxfBasePoint);
		addLine(shape, par.dxfArr, p4, p1, dxfBasePoint);

		//отверстия
		var sideHoleOffset = 70;
		var holeAmt = 5;
		var holeDist = (length - 2 * sideHoleOffset) / (holeAmt - 1);
		var holeRad = 7;

		for (var i = 0; i < holeAmt; i++) {
			var center = newPoint_xy(p0, sideHoleOffset + holeDist * i, width / 2)
			addRoundHole(shape, par.dxfArr, center, holeRad, dxfBasePoint);
		}


		//подпись под фигурой
		var text = "Задняя пластина площадки напротив боковой 1 шт"
		var textHeight = 30;
		var textBasePoint = newPoint_xy(dxfBasePoint, 100, -100)
		addText(text, textHeight, par.dxfArr, textBasePoint)

		var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		var rearPlate = new THREE.Mesh(geometry, par.material);
		rearPlate.position.x = topPlateParams.p5.x - extrudeOptions.amount;
		rearPlate.position.y = -par.thk - width - 0.05;
		rearPlate.position.z = -topPlateParams.p5.y - extrudeOptions.amount
		if (par.turnFactor == -1) {
			rearPlate.position.x = topPlateParams.p5.x;
			rearPlate.position.z = topPlateParams.p5.y + extrudeOptions.amount;
		}

		rearPlate.rotation.y = Math.PI / 2 * par.turnFactor;
		par.mesh.add(rearPlate);

		// var length = topPlateParams.edgeLength2;
		var addPlateAmt = Math.floor(topPlateParams.edgeLength2 / 500);
		
		if (addPlateAmt > 0) {
			var addPlateStep = topPlateParams.edgeLength2 / (addPlateAmt + 1);
			
			// Дополнительное ребро
			for (var i = 1; i <= addPlateAmt; i++) {
				dxfBasePoint.y += 500
				var length = topPlateParams.rearEdgeLength1 - extrudeOptions.amount * 2 - 0.02;
				var shape = new THREE.Shape();
				var p0 = {
					x: 0,
					y: 0
				}
				var p1 = copyPoint(p0);
				var p2 = newPoint_xy(p1, 0, width);
				var p3 = newPoint_xy(p2, length, 0);
				var p4 = newPoint_xy(p3, 0, -width);
				
				addLine(shape, par.dxfArr, p1, p2, dxfBasePoint);
				addLine(shape, par.dxfArr, p2, p3, dxfBasePoint);
				addLine(shape, par.dxfArr, p3, p4, dxfBasePoint);
				addLine(shape, par.dxfArr, p4, p1, dxfBasePoint);
				
				//подпись под фигурой
				var text = "Дополнительная пластина площадки 1шт"
				var textHeight = 30;
				var textBasePoint = newPoint_xy(dxfBasePoint, 100, -100)
				addText(text, textHeight, par.dxfArr, textBasePoint)
				
				var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
				geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
				var addPlate = new THREE.Mesh(geometry, par.material);
				addPlate.position.y = -par.thk - width - 0.05;
				addPlate.position.z = -topPlateParams.p1.y - extrudeOptions.amount - addPlateStep * i;
				if (par.turnFactor == -1) addPlate.position.z = topPlateParams.p1.y + addPlateStep * i;
				addPlate.position.x = topPlateParams.p3.x + extrudeOptions.amount + 0.01;
				addPlate.rotation.y = 0;
				par.mesh.add(addPlate);
			}
		}
	}

	//рама под деревянной прямоугольной площадкой
	
	if (par.type == "timber" && par.platformType == "square" || params.stairType == 'рамки' && par.platformType == "triangle") {
		par = drawPlatformFrame(par);
	}
	
	if (par.type == "timber" && par.platformType == "triangle" && params.model == 'Винтовая с тетивой' || params.stairType == 'рамки' && par.platformType == "triangle") {
		par = drawTrianglePlatformFrame(par);
	}

	if (par.type == "timber" && par.platformType == "triangle" && params.model == 'Винтовая' && params.stairType !== 'рамки') {
		par = drawTrianglePlatformFlans(par);
	}

	return par;
}

/**
 * Функция отрисовывает фланцы для треугольной площадки
 */
function drawTrianglePlatformFlans(par) {
	par.metalFrame = new THREE.Object3D();

	var platformDepth = par.platformDepth;

	//угол между ребрами
	var platformAngle = par.platformAngle;
	
	var platformWidth = 2 * platformDepth * Math.tan(platformAngle / 2);

	// var angle = drawAngleSupport("У5-60х60х100");
	// translateObject(angle, platformDepth, -params.treadThickness - 0.01, -50);

	// angle.rotation.x = Math.PI / 2;
	// angle.rotation.z = Math.PI / 2;
	
	// par.metalFrame.add(angle);

	var angle = drawAngleSupport("У2-40х40х90", {pos: 'topFloor'});
	translateObject(angle, platformDepth, -params.treadThickness - 0.01, -50 + platformWidth / 4);

	angle.rotation.x = Math.PI / 2;
	angle.rotation.z = Math.PI / 2;
	
	par.metalFrame.add(angle);

	var angle = drawAngleSupport("У2-40х40х90", { pos: 'topFloor' });
	translateObject(angle, platformDepth, -params.treadThickness - 0.01, -50 - platformWidth / 4);

	angle.rotation.x = Math.PI / 2;
	angle.rotation.z = Math.PI / 2;
	
	par.metalFrame.add(angle);

	return par;
}//end of drawTrianglePlatformFlans

function drawVintPlatformShape(par) {

	/*чертежи площадки с обозначением параметров здесь:
	http://6692035.ru/drawings/vint/vintPlatform.pdf
	http://6692035.ru/drawings/vint/square_platform.pdf
	*/

	var platformAngle = par.platformAngle;
	var platformDepth = par.platformDepth;
	var treadLowRad = par.treadLowRad;
	var holeDiam = par.holeDiam;
	var type = par.type;
	var columnRad = par.columnDiam / 2 + 0.05; //учитываем зазор для тестирования
	var stairRad = params.staircaseDiam / 2;
	
	

	//угол между ребрами
	var extraAngle = calcTriangleParams().extraAngle;
	var edgeLength = stairRad * Math.cos(extraAngle);
	var edgeAngle = platformAngle - 2 * extraAngle;
	
	//var extraAngle = Math.asin(treadLowRad / L1);
	//var edgeAngle = platformAngle - 2 * extraAngle;
	
	
	var L1 = platformDepth / Math.cos(platformAngle / 2);
	var platformWidth = 2 * platformDepth * Math.tan(platformAngle / 2);

	var edgeLength = L1 * Math.cos(extraAngle);
	
	var dxfBasePoint = {
		x: 0,
		y: -1500,
	}

	//сохраняем значеня в глобальный массив параметров

	stairParams.platformEdgeAngle = edgeAngle;
	stairParams.platformDepth = platformDepth;
	stairParams.platformWidth = platformWidth;
	
	//рассчитываем координаты базовых точек
	var basePoints = calcVintTreadPoints(par.platformAngle)
	
	//точки на задней линии площадки
	var pr1 = polar(basePoints[0],  edgeAngle / 2, par.platformDepth)
	var pr2 = polar(pr1,  edgeAngle / 2 + Math.PI / 2, 100);
	var rearLine = {
		p1: pr1,
		p2: pr2,
	}

	if (type == "timber") {
		if (par.platformType == "triangle") {

			var p0 = basePoints[0]
			var p1 = basePoints[1]
			var p2 = basePoints[2]
			var p3 = basePoints[3]
			//корректируем точку
			p3 = itercection(p2, p3, rearLine.p1, rearLine.p2)
			
			var p4 = basePoints[4]
			//корректируем точку
			p4 = itercection(p1, p4, rearLine.p1, rearLine.p2)
			
			var p7 = basePoints[4];
			var p6 = newPoint_xy(p7, 0, calcTriangleParams().treadOverlayLength);
			var p5 = itercection(p6, polar(p6, edgeAngle / 2, 100), rearLine.p1, rearLine.p2)

			//рассчитываем и запоминаем точку вставки стойки ограждения завязки поручня на площадке
			var ang = calcAngleX1(p6, p5);
			var pt = polar(p6, ang, distance(p6, p5) / 2);
			var pt = polar(pt, ang + Math.PI / 2, 25);
			var pt = rotatePoint(pt, Math.PI / 2 - ang);
			par.pointRack = pt;
			par.lengthConnection = distance(p6, p5);

			/*отрисовываем контур площадки*/

			var treadShape = new THREE.Shape();
			addArc(treadShape, dxfPrimitivesArr, p0, treadLowRad, 1.5 * Math.PI, (Math.PI / 2 + edgeAngle), dxfBasePoint);
			addLine(treadShape, dxfPrimitivesArr, p2, p3, dxfBasePoint);
			addLine(treadShape, dxfPrimitivesArr, p3, p5, dxfBasePoint);
			addLine(treadShape, dxfPrimitivesArr, p5, p6, dxfBasePoint);
			addLine(treadShape, dxfPrimitivesArr, p6, p7, dxfBasePoint);
			addLine(treadShape, dxfPrimitivesArr, p7, p1, dxfBasePoint);
			
			//отверстия для крепления балясины			
			for(var i=0; i<2; i++){
				addRoundHole(treadShape, par.dxfArr, basePoints.balHoles[i], basePoints.balHoles[i].rad, dxfBasePoint);
			}
			
			var sizeA = p5.x - p1.x + treadLowRad;
			var sizeB = p3.y - p1.y
		}

		if (par.platformType == "square") {
			/*рассчитываем координаты точек*/
			var p0 = {
				x: 0,
				y: 0,
			}
			var p1 = {
				x: 0,
				y: -treadLowRad,
			}
			var p2 = {
				x: -treadLowRad,
				y: 0
			}
			var p3 = {
				x: -treadLowRad,
				y: params.staircaseDiam / 2 + params.platformLedge,
			}
			var p4 = {
				x: params.staircaseDiam / 2 + params.platformLedgeM,
				y: params.staircaseDiam / 2 + params.platformLedge,
			}
			var p5 = {
				x: params.staircaseDiam / 2 + params.platformLedgeM,
				y: 0,
			}
			var p6 = {
				x: params.staircaseDiam / 2 - 3,
				y: 0,
			}
			var p7 = {
				x: params.staircaseDiam / 2 - 3,
				y: -treadLowRad,
			}


			/*вычерчиваем конутр площадки*/

			var treadShape = new THREE.Shape();
			addArc(treadShape, dxfPrimitivesArr, p0, treadLowRad, 1.5 * Math.PI, Math.PI, dxfBasePoint);
			addLine(treadShape, dxfPrimitivesArr, p2, p3, dxfBasePoint);
			addLine(treadShape, dxfPrimitivesArr, p3, p4, dxfBasePoint);
			addLine(treadShape, dxfPrimitivesArr, p4, p5, dxfBasePoint);
			addLine(treadShape, dxfPrimitivesArr, p5, p6, dxfBasePoint);
			addLine(treadShape, dxfPrimitivesArr, p6, p7, dxfBasePoint);
			addLine(treadShape, dxfPrimitivesArr, p7, p1, dxfBasePoint);
			
			//отверстие для последней балясины FIX
			var holeCenter = {
				x: params.staircaseDiam / 2 + 10,
				y: -43
			};
			var holeSize = 25;
			var holeRad = 2;
			var polarDst = holeSize / 2 / Math.sin(Math.PI / 4);

			//круглые отверстия под болты
			var center1 = newPoint_xy(holeCenter, -10 - 22, -12)
			var center2 = newPoint_xy(holeCenter, -10 - 22, 12)
			addRoundHole(treadShape, dxfPrimitivesArr, center1, holeRad, dxfBasePoint);
			addRoundHole(treadShape, dxfPrimitivesArr, center2, holeRad, dxfBasePoint);
			
			var sizeA = p4.x - p3.x;
			var sizeB = p3.y - p1.y
		}
		/*отверстие*/
		var hole = new THREE.Path();
		addCircle(hole, dxfPrimitivesArr, p0, holeDiam / 2, dxfBasePoint);
		treadShape.holes.push(hole);

		//Направление волокон
		var trashShape = new THREE.Shape();
		var pt1 = newPoint_xy(p0, 200, 0)
		var pt11 = newPoint_xy(pt1, 40, 10)
		var pt12 = newPoint_xy(pt1, 40, -10)
		addLine(trashShape, dxfPrimitivesArr, pt1, pt11, dxfBasePoint);
		addLine(trashShape, dxfPrimitivesArr, pt1, pt12, dxfBasePoint);
		var pt2 = newPoint_xy(pt1, 400, 0)
		var pt21 = newPoint_xy(pt2, -40, 10)
		var pt22 = newPoint_xy(pt2, -40, -10)
		addLine(trashShape, dxfPrimitivesArr, pt2, pt21, dxfBasePoint);
		addLine(trashShape, dxfPrimitivesArr, pt2, pt22, dxfBasePoint);
		addLine(trashShape, dxfPrimitivesArr, pt1, pt2, dxfBasePoint);

		var text = "Направление волокон"
		var textHeight = 20;
		var textBasePoint = newPoint_xy(dxfBasePoint, 210, 30);
		addText(text, textHeight, dxfPrimitivesArr, textBasePoint);

		//сохраняем параметры для спецификации
		staircasePartsParams.platformWidth = distance(p3, p5)
		staircasePartsParams.platformLength = platformDepth + treadLowRad;
		staircasePartsParams.platformArea = (p3.y - p1.y) / 2 * edgeLength / 1000000;
		staircasePartsParams.platformPaintedArea = staircasePartsParams.platformArea * 2 + (edgeLength * 2 + platformWidth + treadLowRad * Math.PI) * params.treadThickness / 1000000;



	}

	if (type == "metal") {
		var deltaAng = Math.PI / 6; //половина угла, на который уменьшается дуга ступени, прилегающая к бобышке
		var radIn = columnRad + 0.5; //радиус внутренней дуги, примыкающей к бобышке

		if (par.platformType == "triangle") {
			/*рассчитываем координаты точек*
			var p0 = {
				x: 0,
				y: 0
			}
			var p11 = polar(p0, -Math.PI / 2 + deltaAng, radIn); //точка на дуге
			var p1 = polar(p11, -Math.PI / 2, 5);
			var p21 = polar(p0, edgeAngle + Math.PI / 2 - deltaAng, radIn) //точка на дуге
			var p2 = polar(p21, Math.PI / 2 + edgeAngle, 5);
			var p3 = {
				x: L1 * Math.cos(platformAngle - extraAngle),
				y: L1 * Math.sin(platformAngle - extraAngle),
			}
			var p4 = {
				x: edgeLength,
				y: -treadLowRad,
			}
			*/
			
			//номинальные точки
			var p0 = basePoints[0]
			var p1 = basePoints[1]
			var p2 = basePoints[2]
			var p3 = basePoints[3]
			//корректируем точку
			p3 = itercection(p2, p3, rearLine.p1, rearLine.p2)
			
			var p4 = basePoints[4]
			//корректируем точку
			p4 = itercection(p1, p4, rearLine.p1, rearLine.p2)
			
			//реальные точки на узкой стороне
			var p11 = polar(p0, -Math.PI / 2 + deltaAng, radIn); //точка на дуге
			var p1 = polar(p11, -Math.PI / 2, 5);
			var p21 = polar(p0, edgeAngle + Math.PI / 2 - deltaAng, radIn) //точка на дуге
			var p2 = polar(p21, Math.PI / 2 + edgeAngle, 5);
			
			
			var dxfBasePoint = {
				x: 0,
				y: -1500,
			}

			/*отрисовываем контур площадки*/

			var treadShape = new THREE.Shape();
			addLine(treadShape, dxfPrimitivesArr, p1, p11, dxfBasePoint);
			addArc2(treadShape, dxfPrimitivesArr, p0, radIn, (Math.PI / 2 + edgeAngle - deltaAng), -Math.PI / 2 + deltaAng, false, dxfBasePoint);
			addLine(treadShape, dxfPrimitivesArr, p21, p2, dxfBasePoint);
			addLine(treadShape, dxfPrimitivesArr, p2, p3, dxfBasePoint);
			addLine(treadShape, dxfPrimitivesArr, p3, p4, dxfBasePoint);
			addLine(treadShape, dxfPrimitivesArr, p4, p1, dxfBasePoint);
			
			var thk = 4;
			
			var edgeWithOffset = parallel(p4, p1, thk);
			var edge2WithOffset = parallel(p2, p3, -thk);
			
			var rearEdgeWithOffset = parallel(p3,p4, -thk);
			
			var rearEdgeStartPoint = itercection(edge2WithOffset.p1, edge2WithOffset.p2, rearEdgeWithOffset.p1, rearEdgeWithOffset.p2);
			var rearEdgeEndPoint = itercection(edgeWithOffset.p1, edgeWithOffset.p2, rearEdgeWithOffset.p1, rearEdgeWithOffset.p2);
			var edgeEndPoint = itercection(edgeWithOffset.p1, edgeWithOffset.p2, p3, p4);
			
			//параметры для передней пластины
			par.edgeLength = distance(edgeEndPoint, p1);
			par.rearEdgeLength = distance(rearEdgeEndPoint, rearEdgeStartPoint);
			par.p1 = p1;
			par.p2 = p2;
			par.p3 = rearEdgeStartPoint;
			par.ang1 = angle(p1, p4)
			par.ang2 = angle(p2, p3)
			par.ang3 = angle(p3, p4)
			
			var edgeAmt = 1;
			if (edgeAngle > Math.PI / 3) edgeAmt = 2;
			var ang2 = edgeAngle / (edgeAmt + 1);
			var columnOffset = columnRad + 0.5;
			
			var addEdge1StartPoint = polar(p0, ang2, columnOffset);				
			var addEdge1EndPoint = itercection(p0, polar(addEdge1StartPoint, ang2, 100), rearEdgeWithOffset.p1, rearEdgeWithOffset.p2);
			par.addEdge1Length = distance(addEdge1StartPoint, addEdge1EndPoint);

			if (params.platformSectionLength > 0 && params.platformSectionLength - 160 < par.addEdge1Length && params.railingModel_bal !== "Самонесущее стекло") {
				//Отверстия под болты крепления секции ограждения
				var holeRad = 4;
				var flanHoleDst = par.railingFlanHoleDst;
				var polarDst = flanHoleDst / 2 / Math.sin(Math.PI / 4);
				var sectionLength = params.platformSectionLength// - 40 //edgeLength - 160 - 50 + 40;
				var sectionTurnAngle = edgeAngle
				//0.015 поправка по углу, подогнано нужно считать
				var flanCenter = polar(p0, edgeAngle + 0.015, sectionLength)
				var center1 = polar(flanCenter, Math.PI * 0.25 + sectionTurnAngle, polarDst)
				var center2 = polar(flanCenter, Math.PI * 0.75 + sectionTurnAngle, polarDst)
				var center3 = polar(flanCenter, Math.PI * 1.25 + sectionTurnAngle, polarDst)
				var center4 = polar(flanCenter, Math.PI * 1.75 + sectionTurnAngle, polarDst)
				addRoundHole(treadShape, dxfPrimitivesArr, center1, holeRad, dxfBasePoint);
				addRoundHole(treadShape, dxfPrimitivesArr, center2, holeRad, dxfBasePoint);
				addRoundHole(treadShape, dxfPrimitivesArr, center3, holeRad, dxfBasePoint);
				addRoundHole(treadShape, dxfPrimitivesArr, center4, holeRad, dxfBasePoint);
			}

			//отверстие для последней балясины
			if(params.railingModel == "Частые стойки"){
				/*
				// var holeCenter = {x: params.staircaseDiam/2 + 10, y: -32};
				var holeCenter = {
					x: params.staircaseDiam / 2 + 10,
					y: -22.5
				};

				var holeSize = 25;
				var polarDst = holeSize / 2 / Math.sin(Math.PI / 4);
				var sectionTurnAngle = 0;
				

				var ph1 = polar(holeCenter, Math.PI * 0.25 + sectionTurnAngle, polarDst)
				var ph2 = polar(holeCenter, Math.PI * 0.75 + sectionTurnAngle, polarDst)
				var ph3 = polar(holeCenter, Math.PI * 1.25 + sectionTurnAngle, polarDst)
				var ph4 = polar(holeCenter, Math.PI * 1.75 + sectionTurnAngle, polarDst)

				var sqHole = new THREE.Path();
				addLine(sqHole, dxfPrimitivesArr, ph1, ph2, dxfBasePoint);
				addLine(sqHole, dxfPrimitivesArr, ph2, ph3, dxfBasePoint);
				addLine(sqHole, dxfPrimitivesArr, ph3, ph4, dxfBasePoint);
				addLine(sqHole, dxfPrimitivesArr, ph4, ph1, dxfBasePoint);
				treadShape.holes.push(sqHole);

				//круглые отверстия под болты

				var holeRad = 4;
				if (type == "timber") holeRad = 2;
				var center1 = newPoint_xy(holeCenter, -10 - 22, -12)
				var center2 = newPoint_xy(holeCenter, -10 - 22, 12)
				addRoundHole(treadShape, dxfPrimitivesArr, center1, holeRad, dxfBasePoint);
				addRoundHole(treadShape, dxfPrimitivesArr, center2, holeRad, dxfBasePoint);
				*/
				//отверстия для крепления балясины			
				for(var i=0; i<2; i++){
					addRoundHole(treadShape, par.dxfArr, basePoints.balHoles[i], basePoints.balHoles[i].rad, dxfBasePoint);
				}
				
				//квадратное отверстие
				var holeSize = 25;
				var line2 = parallel(basePoints.balHoles[0], basePoints.balHoles[1], -20 - holeSize);
				var line1 = parallel(basePoints.balHoles[0], basePoints.balHoles[1], -20);

				var sqHole = new THREE.Path();

				addLine(sqHole, dxfPrimitivesArr, line1.p1, line1.p2, dxfBasePoint);
				addLine(sqHole, dxfPrimitivesArr, line1.p2, line2.p2, dxfBasePoint);
				addLine(sqHole, dxfPrimitivesArr, line2.p2, line2.p1, dxfBasePoint);
				addLine(sqHole, dxfPrimitivesArr, line2.p1, line1.p1, dxfBasePoint);
				treadShape.holes.push(sqHole);
				
			}
			var sizeA = p4.x - p1.x;
			var sizeB = p3.y - p1.y

		}

		if (par.platformType == "square") {
			/*рассчитываем координаты точек*/
			var p0 = {
				x: 0,
				y: 0
			}
			var p11 = polar(p0, -Math.PI / 2 + deltaAng, radIn); //точка на дуге
			var p1 = polar(p11, -Math.PI / 2, 5);
			var p21 = polar(p0, Math.PI - deltaAng, radIn) //точка на дуге
			var p2 = polar(p21, Math.PI, 5);

			var p3 = {
				x: p2.x,
				y: stairRad + params.platformLedge,
			}

			var p4 = {
				x: stairRad + params.platformLedgeM,
				y: stairRad + params.platformLedge,
			}

			var p5 = {
				x: stairRad + params.platformLedgeM,
				y: p1.y,
			}

			var dxfBasePoint = {
				x: 0,
				y: -1500,
			}

			/*отрисовываем контур площадки*/

			var treadShape = new THREE.Shape();
			addLine(treadShape, dxfPrimitivesArr, p1, p11, dxfBasePoint);
			addArc2(treadShape, dxfPrimitivesArr, p0, radIn, (Math.PI - deltaAng), -Math.PI / 2 + deltaAng, false, dxfBasePoint);
			addLine(treadShape, dxfPrimitivesArr, p21, p2, dxfBasePoint);
			addLine(treadShape, dxfPrimitivesArr, p2, p3, dxfBasePoint);
			addLine(treadShape, dxfPrimitivesArr, p3, p4, dxfBasePoint);
			addLine(treadShape, dxfPrimitivesArr, p4, p5, dxfBasePoint);
			addLine(treadShape, dxfPrimitivesArr, p5, p1, dxfBasePoint);

			//параметры для передней пластины
			par.edgeLength1 = distance(p5, p1);
			par.edgeLength2 = distance(p2, p3);
			par.rearEdgeLength1 = distance(p4, p3);
			par.rearEdgeLength2 = distance(p4, p5);

			par.p1 = p1;
			par.p2 = p2;
			par.p3 = p3;
			par.p5 = p5;

			par.ang1 = angle(p1, p4)
			par.ang2 = angle(p2, p3)
			par.ang3 = angle(p3, p4)

			//длины дополнительных ребер жесткости
			var pt1 = polar(p0, Math.PI / 6, radIn); //точка на дуге
			var pt2 = itercection(p0, pt1, p4, p5)
			par.midEdgeLength1 = distance(pt1, pt2);
			par.pm1 = pt1;

			var pt1 = polar(p0, Math.PI / 3, radIn); //точка на дуге
			var pt2 = itercection(p0, pt1, p4, p3)
			par.midEdgeLength2 = distance(pt1, pt2);
			par.pm2 = pt1;

			var test = {};
			test.pt1 = pt1;
			test.pt1 = pt2;
			signKeyPoints(test, dxfBasePoint);
			//	console.log(par.pm2)


			//Отверстия под болты крепления секции ограждения
			if (params.railingSide !== 'нет') {
				if (params.platformSectionLength > 0 && 
					params.platformSectionLength < (params.staircaseDiam / 2 + params.platformLedge) && 
					params.railingModel_bal !== "Самонесущее стекло") {
					
					var holeRad = 4;
					var flanHoleDst = par.railingFlanHoleDst;
					var polarDst = flanHoleDst / 2 / Math.sin(Math.PI / 4);
					var sectionLength = params.platformSectionLength - 40;
					var sectionTurnAngle = Math.PI / 2;

					var flanCenter = polar(p0, sectionTurnAngle, sectionLength)
					var center1 = polar(flanCenter, Math.PI * 0.25 + sectionTurnAngle, polarDst)
					var center2 = polar(flanCenter, Math.PI * 0.75 + sectionTurnAngle, polarDst)
					var center3 = polar(flanCenter, Math.PI * 1.25 + sectionTurnAngle, polarDst)
					var center4 = polar(flanCenter, Math.PI * 1.75 + sectionTurnAngle, polarDst)
					addRoundHole(treadShape, dxfPrimitivesArr, center1, holeRad, dxfBasePoint);
					addRoundHole(treadShape, dxfPrimitivesArr, center2, holeRad, dxfBasePoint);
					addRoundHole(treadShape, dxfPrimitivesArr, center3, holeRad, dxfBasePoint);
					addRoundHole(treadShape, dxfPrimitivesArr, center4, holeRad, dxfBasePoint);
				}

				//отверстие для последней балясины
				if(params.railingModel == "Частые стойки"){
					var holeCenter = {
						x: params.staircaseDiam / 2 + 10,
						y: -27
					};
					var holeSize = 25;
					var polarDst = holeSize / 2 / Math.sin(Math.PI / 4);
					var sectionTurnAngle = 0;

					var ph1 = polar(holeCenter, Math.PI * 0.25 + sectionTurnAngle, polarDst)
					var ph2 = polar(holeCenter, Math.PI * 0.75 + sectionTurnAngle, polarDst)
					var ph3 = polar(holeCenter, Math.PI * 1.25 + sectionTurnAngle, polarDst)
					var ph4 = polar(holeCenter, Math.PI * 1.75 + sectionTurnAngle, polarDst)

					var sqHole = new THREE.Path();
					addLine(sqHole, dxfPrimitivesArr, ph1, ph2, dxfBasePoint);
					addLine(sqHole, dxfPrimitivesArr, ph2, ph3, dxfBasePoint);
					addLine(sqHole, dxfPrimitivesArr, ph3, ph4, dxfBasePoint);
					addLine(sqHole, dxfPrimitivesArr, ph4, ph1, dxfBasePoint);
					treadShape.holes.push(sqHole);
					
					//круглые отверстия под болты
					var holeRad = 4;
					if (type == "timber") holeRad = 2;
					var center1 = newPoint_xy(holeCenter, -10 - 22, -12)
					var center2 = newPoint_xy(holeCenter, -10 - 22, 12)
					addRoundHole(treadShape, dxfPrimitivesArr, center1, holeRad, dxfBasePoint);
					addRoundHole(treadShape, dxfPrimitivesArr, center2, holeRad, dxfBasePoint);
				}
			}


			var sizeA = p4.x - p3.x;
			var sizeB = p3.y - p1.y
		}

	}


	//подпись
	var text = "Верхняя площадка"
	if (params.turnFactor == -1) text = "Верхняя площадка (зеркально)"
	var textHeight = 30;
	var textBasePoint = newPoint_xy(dxfBasePoint, 20, -150);
	addText(text, textHeight, dxfPrimitivesArr, textBasePoint);

	par.shape = treadShape


	//сохраняем данные для спецификации
	var partName = "vintPlatform";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				paintedArea: 0,
				name: "Площадка треугольная " + (params.stairType == 'массив' ? params.treadsMaterial : params.stairType),
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "area", //единица измерения
				group: "Каркас",
			}
			if (type == "timber") {
				specObj[partName].metalPaint = false;
				specObj[partName].timberPaint = true;
				specObj[partName].division = "timber";
				specObj[partName].group = "treads";
			}
		}
		if (par.platformType == "square") specObj[partName].name = "Площадка прямоугольная " + (params.stairType == 'массив' ? params.treadsMaterial : params.stairType);

		var area = sizeA * sizeB / 1000000;
		var name = Math.round(sizeA) + "x" + Math.round(sizeB);
		if (type == "timber") name += "x" + params.treadThickness;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		specObj[partName]["paintedArea"] += area * 2 + area * 0.1; //к-т 0,1 учитывает площадь торцев
	}

	par.articul = partName + name;

	return par;
} //end of drawVintPlatformShape

function drawPlatformFrame(par) {
	var profWidth = 30;
	var profHeight = 60;
	var columnRad = params.columnDiam / 2 + 0.05;
	/*рассчитываем координаты точек*/

	var ang0 = 2 * Math.asin(profWidth / (columnRad * 2))

	var p0 = {
		x: 0,
		y: 0
	}
	var p1 = {
		x: -profWidth / 2,
		y: columnRad * Math.cos(ang0 / 2)
	}
	var p2 = {
		x: profWidth / 2,
		y: columnRad * Math.cos(ang0 / 2)
	}

	var p3 = {
		x: -profWidth / 2,
		y: params.staircaseDiam / 2 + params.platformLedge,
	}

	var p4 = {
		x: params.staircaseDiam / 2 + params.platformLedgeM,
		y: params.staircaseDiam / 2 + params.platformLedge,
	}

	var p5 = {
		x: params.staircaseDiam / 2 + params.platformLedgeM,
		y: par.columnDiam / 2 + 20,
	}

	var p6 = {
		x: profWidth / 2,
		y: par.columnDiam / 2 + 20,
	}

	var dxfBasePoint = {
		x: 2500,
		y: 0,
	}
	//отрисовываем контур площадки

	var treadShape = new THREE.Shape();
	addLine(treadShape, dxfPrimitivesArr, p1, p3, dxfBasePoint);
	addLine(treadShape, dxfPrimitivesArr, p3, p4, dxfBasePoint);
	addLine(treadShape, dxfPrimitivesArr, p4, p5, dxfBasePoint);
	addLine(treadShape, dxfPrimitivesArr, p5, p6, dxfBasePoint);
	addLine(treadShape, dxfPrimitivesArr, p6, p2, dxfBasePoint);
	addArc2(treadShape, dxfPrimitivesArr, p0, columnRad, Math.PI / 2 + ang0 / 2,  Math.PI / 2 - ang0 / 2,  false, dxfBasePoint);

	//внутренний контур


	//квадратное отверстие
	ph1 = newPoint_xy(p0, profWidth / 2, columnRad + 20 + profWidth)
	ph2 = newPoint_xy(p3, profWidth, -profWidth)
	ph3 = newPoint_xy(p4, -profWidth, -profWidth)
	ph4 = newPoint_xy(p5, -profWidth, profWidth)

	var sqHole = new THREE.Path();
	addLine(sqHole, par.dxfArr, ph1, ph4, dxfBasePoint);
	addLine(sqHole, par.dxfArr, ph4, ph3, dxfBasePoint);
	addLine(sqHole, par.dxfArr, ph3, ph2, dxfBasePoint);
	addLine(sqHole, par.dxfArr, ph2, ph1, dxfBasePoint);

	treadShape.holes.push(sqHole);

	var sizeA = distance(ph1, ph2) + profWidth * 2;
	var sizeB = distance(ph2, ph3) + profWidth * 2;

	//подпись под фигурой
	var text = "Рама площадки"
	if (params.turnFactor == -1) text = "Рама площадки (зеркально) "
	var textHeight = 30;
	var textBasePoint = newPoint_xy(dxfBasePoint, 100, -100)
	addText(text, textHeight, par.dxfArr, textBasePoint)

	var extrudeOptions = {
		amount: profHeight,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	var geometry = new THREE.ExtrudeGeometry(treadShape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var frame = new THREE.Mesh(geometry, par.metalMaterial);
	frame.rotation.x = -Math.PI / 2 * par.turnFactor;
	frame.position.x = 0;
	frame.position.y = -par.thk - profHeight - 0.05;
	frame.position.z = 0;
	if (par.turnFactor == -1) {
		frame.position.y = -par.thk - 0.05;
	}


	par.metalFrame = new THREE.Object3D();
	par.metalFrame.add(frame);

	if(ph2.y - ph1.y > 80){

		//опорные фланцы
		var holeOffset = 15;
		var flanThk = 4;
		var flanParams = { //объявление параметров уголка
			width: 160,
			height: 40,
			holeDiam: 8,
			angleRadUp: 10,
			angleRadDn: 0,
			hole2X: holeOffset,
			hole2Y: holeOffset,
			hole3X: holeOffset,
			hole3Y: holeOffset,
			dxfBasePoint: dxfBasePoint,
			dxfPrimitivesArr: dxfPrimitivesArr,
		}

		var shape = drawRectFlan(flanParams).shape;
		var extrudeOptions = {
			amount: flanThk,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};


		var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		// Фланцы
		{
			//первый фланец
			var flan = new THREE.Mesh(geometry, par.metalMaterial);
			flan.rotation.x = -Math.PI / 2 * par.turnFactor;
			flan.position.x = (params.staircaseDiam / 2 + params.platformLedgeM - 160) / 2;
			flan.position.y = -par.thk;
			if (par.turnFactor == 1) flan.position.y -= flanThk;
			flan.position.z = -(par.columnDiam / 2 + 20 + profWidth + 0.05) * par.turnFactor;
			par.metalFrame.add(flan);
			
			//второй фланец
			var flan = new THREE.Mesh(geometry, par.metalMaterial);
			flan.rotation.x = -Math.PI / 2 * par.turnFactor;
			flan.rotation.z = Math.PI;
			flan.position.x = (params.staircaseDiam / 2 + params.platformLedgeM + 160) / 2;
			flan.position.y = -par.thk;
			if (par.turnFactor == 1) flan.position.y -= flanThk;
			flan.position.z = -(params.staircaseDiam / 2 + params.platformLedge - profWidth) * par.turnFactor;
			par.metalFrame.add(flan);
			
			//фланцы на боковых сторонах (перпендикулярных перекрытию)
			if(params.staircaseDiam / 2 + params.platformLedge > 320){
				//третий фланец
				var flan = new THREE.Mesh(geometry, par.metalMaterial);
				flan.rotation.x = -Math.PI / 2 * par.turnFactor;
				flan.rotation.z = Math.PI / 2;
				flan.position.x = (params.staircaseDiam / 2 + params.platformLedgeM - profWidth);
				flan.position.y = -par.thk;
				if (par.turnFactor == 1) flan.position.y -= flanThk;
				flan.position.z = -(params.staircaseDiam / 2 + params.platformLedge + 20 + par.columnDiam / 2 - 160) / 2 * par.turnFactor;
				par.metalFrame.add(flan);
				
				//четвертый фланец
				var flan = new THREE.Mesh(geometry, par.metalMaterial);
				flan.rotation.x = -Math.PI / 2 * par.turnFactor;
				flan.rotation.z = -Math.PI / 2;
				flan.position.x = profWidth / 2 + 0.05;
				flan.position.y = -par.thk;
				if (par.turnFactor == 1) flan.position.y -= flanThk;
				flan.position.z = -(params.staircaseDiam / 2 + params.platformLedge + 20 + par.columnDiam / 2 + 160) / 2 * par.turnFactor;
				par.metalFrame.add(flan);
			}
		}
	}

	//болты крепления к перекрытию
	//if (typeof isFixPats != "undefined" && isFixPats && par.isFixPart) { //глобальная переменная		
	if (typeof isFixPats != "undefined" && isFixPats && !testingMode) { //глобальная переменная		
		par.fixPar = getFixPart(0, 'topFloor'); // параметры крепления к стенам
		if (par.fixPar.fixPart !== 'нет') {
			var fix = drawFixPart(par.fixPar).mesh;
			fix.rotation.x = -Math.PI / 2 * par.turnFactor;
			fix.rotation.z = Math.PI;
			fix.position.x = (params.staircaseDiam / 2 + params.platformLedgeM + 160) / 2 - flanParams.width / 2 + sizeB / 2 - 100;
			fix.position.y = -par.thk - profHeight / 2;
			if (par.turnFactor == 1) fix.position.y -= flanThk;
			fix.position.z = -(params.staircaseDiam / 2 + params.platformLedge - profWidth) * par.turnFactor;
			par.metalFrame.add(fix);

			var fix = drawFixPart(par.fixPar).mesh;
			fix.rotation.x = -Math.PI / 2 * par.turnFactor;
			fix.rotation.z = Math.PI;
			fix.position.x = (params.staircaseDiam / 2 + params.platformLedgeM + 160) / 2 - flanParams.width / 2 - sizeB / 2 + 100;
			fix.position.y = -par.thk - profHeight / 2;
			if (par.turnFactor == 1) fix.position.y -= flanThk;
			fix.position.z = -(params.staircaseDiam / 2 + params.platformLedge - profWidth) * par.turnFactor;
			par.metalFrame.add(fix);
		}
	}


	//сохраняем данные для спецификации
	var partName = "platformFrame";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Рама площадки",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
			}
		}

		var name = Math.round(sizeA) + "x" + Math.round(sizeB);
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}
	par.metalFrame.specId = partName + name;


	return par;

} //end of drawPlatformFrame

function drawTrianglePlatformFrame(par) {
	var profWidth = 30;
	var profHeight = 60;
	var columnRad = params.columnDiam / 2 + 0.05;
	var profileLength = 800;// - columnRad;
	par.metalFrame = new THREE.Object3D();

	var platformAngle = params.platformAngle * Math.PI / 180;
	var platformDepth = par.platformDepth;
	var treadLowRad = par.treadLowRad;
	var holeDiam = par.holeDiam;
	var type = par.type;
	var columnRad = par.columnDiam / 2 + 0.05; //учитываем зазор для тестирования

	var L1 = platformDepth / Math.cos(platformAngle / 2);
	var platformWidth = 2 * platformDepth * Math.tan(platformAngle / 2);
	var extraAngle = Math.asin(treadLowRad / L1);
	var edgeAngle = platformAngle - 2 * extraAngle - 0.05;//0.05 зазор для того чтобы не было пересечений со стойкой
	var edgeLength = L1 * Math.cos(extraAngle);
	var dxfBasePoint = {
		x: 2500,
		y: 0,
	}

	//рассчитываем точки площадки
	{
		//рассчитываем координаты базовых точек
		var basePoints = calcVintTreadPoints(platformAngle)

		//точки на задней линии площадки
		var pr1 = polar(basePoints[0], edgeAngle / 2, platformDepth)
		var pr2 = polar(pr1, edgeAngle / 2 + Math.PI / 2, 100);
		var rearLine = {
			p1: pr1,
			p2: pr2,
		}

		var p0 = basePoints[0]
		var p1 = basePoints[1]
		var p2 = basePoints[2]
		var p3 = basePoints[3]
		//корректируем точку
		p3 = itercection(p2, p3, rearLine.p1, rearLine.p2)

		var p4 = basePoints[4]
		//корректируем точку
		p4 = itercection(p1, p4, rearLine.p1, rearLine.p2)

		var p7 = basePoints[4];
		var p6 = newPoint_xy(p7, 0, calcTriangleParams().treadOverlayLength);
		var p5 = itercection(p6, polar(p6, edgeAngle / 2, 100), rearLine.p1, rearLine.p2)
		var offset = 80;
		var line_p3_p5_Out = { p1: p3, p2: p5 };
		var line_p3_p5_In = parallel(p3, p5, -profWidth);

		var line_p5_p6_Out = { p1: p5, p2: p6 };
		var line_p5_p6_In = parallel(p5, p6, profWidth);

		var line_p1_p7_Middle = { p1: p0, p2: polar(p0, calcAngleX1(p1, p7), 100) };
		var pt1 = polar(p0, calcAngleX1(p1, p7), columnRad)
		var line_p1_p7_Normal = { p1: pt1, p2: polar(pt1, calcAngleX1(p1, p7) + Math.PI /2, 100) };
		var line_p1_p7_Out = parallel(line_p1_p7_Middle.p1, line_p1_p7_Middle.p2, -profWidth / 2  - offset / 2);
		var line_p1_p7_In = parallel(line_p1_p7_Middle.p1, line_p1_p7_Middle.p2, profWidth / 2  - offset / 2);

		var line_p2_p3_Middle = { p1: p0, p2: polar(p0, calcAngleX1(p2, p3), 100) };
		var pt2 = polar(p0, calcAngleX1(p2, p3), columnRad)
		var line_p2_p3_Normal = { p1: pt2, p2: polar(pt2, calcAngleX1(p2, p3) + Math.PI / 2, 100) };
		var line_p2_p3_Out = parallel(line_p2_p3_Middle.p1, line_p2_p3_Middle.p2, profWidth / 2  + offset / 2);
		var line_p2_p3_In = parallel(line_p2_p3_Middle.p1, line_p2_p3_Middle.p2, -profWidth / 2  + offset / 2);
	}

	var extrudeOptions = {
		amount: profHeight,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	//Фланцы
	var shapePar = {
		points: [],
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: dxfBasePoint,
	}
	{
		var pf1 = itercectionLines(line_p2_p3_In, line_p2_p3_Normal);
		var pf2 = itercectionLines(line_p2_p3_Out, line_p2_p3_Normal);
		var pf3 = itercectionLines(line_p2_p3_Out, line_p3_p5_Out);
		var pf4 = itercectionLines(line_p2_p3_In, line_p3_p5_In);

		shapePar.points = [pf1, pf2, pf3, pf4];

		var shapeFlan = drawShapeByPoints2(shapePar).shape;

		var geometry = new THREE.ExtrudeGeometry(shapeFlan, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var flan = new THREE.Mesh(geometry, params.materials.metal);
		par.metalFrame.add(flan);
	}

	{
		var pf1 = itercectionLines(line_p3_p5_Out, line_p5_p6_Out);
		var pf2 = itercectionLines(line_p3_p5_In, line_p5_p6_Out);
		var pf3 = itercectionLines(line_p3_p5_In, line_p2_p3_In);
		var pf4 = itercectionLines(line_p3_p5_Out, line_p2_p3_Out);

		shapePar.points = [pf1, pf2, pf3, pf4];

		var shapeFlan = drawShapeByPoints2(shapePar).shape;

		var geometry = new THREE.ExtrudeGeometry(shapeFlan, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var flan = new THREE.Mesh(geometry, params.materials.metal);
		par.metalFrame.add(flan);
	}

	{
		var pf1 = itercectionLines(line_p5_p6_Out, line_p1_p7_Out);
		var pf2 = itercectionLines(line_p5_p6_In, line_p1_p7_In);
		var pf3 = itercectionLines(line_p5_p6_In, line_p3_p5_In);
		var pf4 = itercectionLines(line_p5_p6_Out, line_p3_p5_In);

		shapePar.points = [pf1, pf2, pf3, pf4];

		var shapeFlan = drawShapeByPoints2(shapePar).shape;

		var geometry = new THREE.ExtrudeGeometry(shapeFlan, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var flan = new THREE.Mesh(geometry, params.materials.metal);
		par.metalFrame.add(flan);
	}

	{
		var pf1 = itercectionLines(line_p1_p7_Out, line_p1_p7_Normal);
		var pf2 = itercectionLines(line_p1_p7_In, line_p1_p7_Normal);
		var pf3 = itercectionLines(line_p1_p7_In, line_p5_p6_In);
		var pf4 = itercectionLines(line_p1_p7_Out, line_p5_p6_Out);

		shapePar.points = [pf1, pf2, pf3, pf4];

		var shapeFlan = drawShapeByPoints2(shapePar).shape;

		var geometry = new THREE.ExtrudeGeometry(shapeFlan, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var flan = new THREE.Mesh(geometry, params.materials.metal);
		par.metalFrame.add(flan);
	}
	

	par.metalFrame.position.y = -params.treadThickness - 0.05;
	par.metalFrame.rotation.x = -Math.PI / 2 * params.turnFactor;
	par.metalFrame.rotation.z = -stairParams.platformEdgeAngle / 2;
	if (params.turnFactor == 1) par.metalFrame.position.y -= profHeight;
	var test = new THREE.Object3D();
	test.add(par.metalFrame);
	par.metalFrame = test;

	var text = "Рама треугольной площадки"
	if (params.turnFactor == -1) text = "Рама треугольной площадки (зеркально) "
	var textHeight = 30;
	var textBasePoint = newPoint_xy(dxfBasePoint, 100, -100)
	addText(text, textHeight, par.dxfArr, textBasePoint)

	//сохраняем данные для спецификации
	var partName = "platformFrame";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Рама треугольной площадки",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
			}

		}

		// var name = Math.round(sizeA) + "x" + Math.round(sizeB);
		// if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		// if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		// specObj[partName]["amt"] += 1;
	}
	par.metalFrame.specId = partName + name;


	return par;

} //end of drawTrianglePlatformFrame
function drawTrianglePlatformFrame1(par) {
	var profWidth = 30;
	var profHeight = 60;
	var columnRad = params.columnDiam / 2 + 0.05;
	var profileLength = 800;// - columnRad;
	par.metalFrame = new THREE.Object3D();
	
	var platformAngle = params.platformAngle * Math.PI / 180;
	var platformDepth = par.platformDepth;
	var treadLowRad = par.treadLowRad;
	var holeDiam = par.holeDiam;
	var type = par.type;
	var columnRad = par.columnDiam / 2 + 0.05; //учитываем зазор для тестирования

	var L1 = platformDepth / Math.cos(platformAngle / 2);
	var platformWidth = 2 * platformDepth * Math.tan(platformAngle / 2);
	var extraAngle = Math.asin(treadLowRad / L1);
	var edgeAngle = platformAngle - 2 * extraAngle - 0.05;//0.05 зазор для того чтобы не было пересечений со стойкой
	var edgeLength = L1 * Math.cos(extraAngle);
	var dxfBasePoint = {
		x: 2500,
		y: 0,
	}


	{
		// положение профиля относительно 0
		var offset = platformDepth - profWidth - 0.05;//profileLength * 0.8;
		// a - сторона равнобедренного треугольника
		var a = (offset) / Math.cos(edgeAngle / 2);
		// b - длинна профиля
		var b = (2 * a) * Math.sin(edgeAngle / 2);
		
		var profilePar = {
			poleProfileY: profWidth,
			poleProfileZ: profHeight,
			dxfBasePoint: dxfBasePoint,  //не обязательный. Если не указан, в dxf не выводится
			length: b - profWidth / Math.cos(edgeAngle / 2) + (profWidth * Math.tan(edgeAngle / 2)) * 2 - 0.05,
			poleAngle: 0,
			angEnd: edgeAngle / 2,
			angStart: -edgeAngle / 2,
			material: params.materials.metal, //не обязательный
			dxfArr: dxfPrimitivesArr, //не обязательный
			partName: '',
			text: '',
			sectText: '',
			roundHoles: [],
			unit: "banister"
		}
		
		var profile3Par = drawPole3D_4(profilePar);
		var profile3 = profile3Par.mesh;
		profile3.rotation.x = Math.PI / 2;
		profile3.rotation.z =  edgeAngle / 2;
		translateObject(profile3, -profilePar.length / 2 + profWidth * Math.tan(edgeAngle / 2), offset, 0);
		par.metalFrame.add(profile3);
		
		var edgeProfileLength = (b - profWidth) / (2 * Math.sin(edgeAngle / 2));
		
		var profilePar = {
			poleProfileY: profWidth,
			poleProfileZ: profHeight,
			dxfBasePoint: dxfBasePoint,  //не обязательный. Если не указан, в dxf не выводится
			length: edgeProfileLength,//(platformDepth) / Math.cos(edgeAngle / 2),
			poleAngle: 0,
			angEnd: edgeAngle / 2, //не обязательный
			material: params.materials.metal, //не обязательный
			dxfArr: dxfPrimitivesArr, //не обязательный
			partName: '',
			text: '',
			sectText: '',
			roundHoles: [],
			unit: "banister"
		}
		
		var profile1 = drawPole3D_4(profilePar);
		profile1.mesh.rotation.x = Math.PI / 2;
		profile1.mesh.rotation.z = Math.PI / 2 + edgeAngle;
		translateObject(profile1.mesh, columnRad,-profilePar.poleProfileY / 2, 0);
		par.metalFrame.add(profile1.mesh);
		
		var profile2 = drawPole3D_4(profilePar);
		profile2.mesh.rotation.x = -Math.PI / 2;
		profile2.mesh.rotation.z = -Math.PI / 2;

		translateObject(profile2.mesh, columnRad, -profilePar.poleProfileY / 2, -profilePar.poleProfileZ);
		par.metalFrame.add(profile2.mesh);
	
		var flanPar = {
			length: 100,
			offset: columnRad + 50,
			angle: edgeAngle / 2,
			deltaLen: (profWidth / 2 + 0.2) / Math.cos(edgeAngle / 2),//Корректируем длинну нижней части фланца(смемщаем на половину профиля внутрь(тк изначально фланец залезает на половину профиля))
		}
		
		var flan = drawRadFlan(flanPar).mesh;
		flan.rotation.x = Math.PI / 2;
		flan.rotation.z = Math.PI / 2 + edgeAngle / 2;
		// translateObject(flan, 0, 0, 0);//Смещаем объект и точку вращения чтобы можно было спокойно вращать объект без модификации положения
		par.metalFrame.add(flan);
		//Фланцы
		{
			var flanThk = 4;
			var holeOffset = 15;
			var flanParams = { //объявление параметров уголка
				width: 160,
				height: 40,
				holeDiam: 8,
				angleRadUp: 10,
				angleRadDn: 0,
				hole2X: holeOffset,
				hole2Y: holeOffset,
				hole3X: holeOffset,
				hole3Y: holeOffset,
				dxfBasePoint: dxfBasePoint,
				dxfPrimitivesArr: dxfPrimitivesArr,
			}
			
			var shape = drawRectFlan(flanParams).shape;
			var extrudeOptions = {
				amount: flanThk,
				bevelEnabled: false,
				curveSegments: 12,
				steps: 1
			};

			
			//первый фланец
			var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
			geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

			var flan = new THREE.Mesh(geometry, params.materials.metal);
			flan.rotation.x = Math.PI / 2;
			flan.rotation.z = Math.PI / 2;
			
			translateObject(flan, edgeProfileLength - flanParams.width - 20, profWidth / 2 + 0.2, 0);
			par.metalFrame.add(flan);
			
			//второй фланец
			var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
			geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

			var flan = new THREE.Mesh(geometry, params.materials.metal);
			flan.rotation.x = Math.PI / 2;
			flan.rotation.z = Math.PI / 2;
			flan.isFlan = true;
			// flan.geometry.translate(profileLength / 3 - profWidth, profWidth / 2, 0)
			translateObject(flan, profileLength / 3 - profWidth, profWidth / 2 + 0.2, 0);
			par.metalFrame.add(flan);
			
			
			//третий фланец
			var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
			geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

			var flan = new THREE.Mesh(geometry, params.materials.metal);
			flan.rotation.x = Math.PI / 2;
			flan.rotation.y = Math.PI;
			flan.rotation.z = Math.PI / 2 - edgeAngle;
			
			translateObject(flan, edgeProfileLength - flanParams.width - 20, profWidth / 2 + 0.2, -extrudeOptions.amount);
			par.metalFrame.add(flan);
			
			// четвертый фланец
			var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
			geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

			var flan = new THREE.Mesh(geometry, params.materials.metal);
			flan.rotation.x = Math.PI / 2;
			flan.rotation.y = Math.PI;
			flan.rotation.z = Math.PI / 2 - edgeAngle;
			
			translateObject(flan, profileLength / 3 - profWidth, profWidth / 2 + 0.2, -extrudeOptions.amount);
			par.metalFrame.add(flan);
		}
	}
	
	par.metalFrame.position.y = -params.treadThickness - 0.05;
	par.metalFrame.rotation.y = Math.PI / 2 + edgeAngle / 2;//2.15;// - Math.PI / 2;
	var test = new THREE.Object3D();
	test.add(par.metalFrame);
	par.metalFrame = test;
	
	var text = "Рама треугольной площадки"
	if (params.turnFactor == -1) text = "Рама треугольной площадки (зеркально) "
	var textHeight = 30;
	var textBasePoint = newPoint_xy(dxfBasePoint, 100, -100)
	addText(text, textHeight, par.dxfArr, textBasePoint)
	
	//сохраняем данные для спецификации
	var partName = "platformFrame";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Рама треугольной площадки",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
			}

		}

		// var name = Math.round(sizeA) + "x" + Math.round(sizeB);
		// if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		// if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		// specObj[partName]["amt"] += 1;
	}
	par.metalFrame.specId = partName + name;


	return par;

} //end of drawTrianglePlatformFrame

/** Функция вращает объект относительно начальной точки
* @param object THREE.Object3D или THREE.Mesh
* @param x
* @param y
* @param z
*/
function rotateObject(object, x, y, z){
	if ((object instanceof THREE.Object3D) || (object instanceof THREE.Geometry)) {
		object.rotateX(x || 0);
		object.rotateY(y || 0);
		object.rotateX(z || 0);
	}
	if (object instanceof THREE.Mesh) {
		object.geometry.rotateX(x || 0);
		object.geometry.rotateY(y || 0);
		object.geometry.rotateX(z || 0);
	}
}

/**
 Функция отрисовывает профиль с скругленным концом(под бобышку)
*/
function drawRadProfile(par){
	var profileWidth = par.profileWidth || 30;
	var profileHeight = par.profileHeight || 60;
	var profileLength = par.profileLength || 400;
	var rad = par.rad || 0;
	var arcAngle = 2 * Math.asin(profileWidth / (rad * 2));
	
	par.ang1 = par.ang1 || 0;
	par.ang2 = par.ang2 || 0;
	var p0 = {x: 0,y: 0};
	// if(!par.ang || par.ang == 0){
	// 	var p1_1 = {
	// 		x: -profileWidth / 2,
	// 		y: rad * Math.cos(arcAngle / 2)
	// 	}
	// 	var p1_2 = {
	// 		x: profileWidth / 2,
	// 		y: rad * Math.cos(arcAngle / 2)
	// 	}
	// 
	// 	var p2 = newPoint_xy(p1_1, 0, profileLength);
	// 	var p3 = newPoint_xy(p1_2, 0, profileLength);
	// 
	// 	var profileAngle = Math.asin(profileWidth / (par.rad * 2));//Какой угол от 360* занимает профиль
	// 
	// 	var treadShape = new THREE.Shape();
	// 	addLine(treadShape, dxfPrimitivesArr, p1_1, p2, dxfBasePoint);
	// 	addLine(treadShape, dxfPrimitivesArr, p2, p3, dxfBasePoint);
	// 	addLine(treadShape, dxfPrimitivesArr, p3, p1_2, dxfBasePoint);
	// 	addLine(treadShape, dxfPrimitivesArr, p1_2, p1_1, dxfBasePoint);
	// }
	// if (par.ang) {
	{
		var sideLength1 = profileWidth / Math.cos(par.ang1);
		var sideLength2 = profileWidth / Math.cos(par.ang2);
		
		// var p1 = newPoint_xy(p0, profileWidth, 0);
		// p0 = polar(p1, par.ang1, -sideLength1);
		// var p2 = newPoint_xy(p1, 0, profileLength - p1.y);
		
		
		// var p1 = polar(p0, par.ang1, sideLength1);
		// var p3 = newPoint_xy(p0, 0, profileLength);
		// var p2 = polar(p3, par.ang2, sideLength2);
		
		var p0_1 = newPoint_xy(p0, 0, profileLength / 2);
		var p1 = polar(p0_1, par.ang1, sideLength1);
		var p2 = newPoint_xy(p0, 0, -profileLength / 2);
		var p3 = polar(p2, par.ang2, sideLength2);
		// console.log(par.ang2, sideLength2, p2)
		
		// if (par.ang1 < 0) {
		// 
		// }else{
		// 	var p1 = polar(p0, par.ang1, sideLength1);
		// 	var p2 = newPoint_xy(p1, 0, profileLength - p1.y);
		// }
		// if (par.ang2 < 0) {
		// 	var p3 = newPoint_xy(p2, -profileWidth, 0);
		// }else{
		// 	var p3 = polar(p2, par.ang2, -sideLength2);
		// }
		
		// var p3 = newPoint_xy(p0, 0, profileLength - profileWidth * Math.tan(par.ang2));

		// var p3 = polar(p2, par.ang2, profileWidth);
		// var p4 = newPoint_xy(p3, 0, -profileLength);
		
		// var profileAngle = Math.asin(profileWidth / (par.rad * 2));//Какой угол от 360* занимает профиль
		
		var treadShape = new THREE.Shape();
		addLine(treadShape, dxfPrimitivesArr, p0, p0_1, dxfBasePoint);
		addLine(treadShape, dxfPrimitivesArr, p0_1, p1, dxfBasePoint);
		addLine(treadShape, dxfPrimitivesArr, p1, p3, dxfBasePoint);
		addLine(treadShape, dxfPrimitivesArr, p3, p2, dxfBasePoint);
		addLine(treadShape, dxfPrimitivesArr, p2, p0, dxfBasePoint);
	}
	var extrudeOptions = {
		amount: profileHeight,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	
	var geometry = new THREE.ExtrudeGeometry(treadShape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var profile = new THREE.Mesh(geometry, params.materials.metal);
	profile.rotation.x = Math.PI / 2;
	var mesh = new THREE.Object3D();
	mesh.add(profile);
	par.mesh = mesh;
	par.geometry = geometry;
	return par;
}

function drawRadFlan(par){
	var dxfBasePoint = {
		x: 0,
		y: -1500,
	}
	// Точки контура
	{
		/*рассчитываем координаты точек*/
		var p0 = {x: 0,y: 0};
		// var p1 = newPoint_xy(p0, 0, deltaX / 2);
		// var p2 = newPoint_xy(p0, 0, -deltaX / 2);
		var p1 = polar(p0, par.angle, par.offset);
		var p2 = polar(p0, -par.angle, par.offset);
				
		if (par.deltaLen) {
			p1.y -= par.deltaLen;
			p2.y += par.deltaLen;
		}
		
		var p3 = polar(p1, par.angle, par.length);
		var p4 = polar(p2, -par.angle, par.length);
		
		var shape = new THREE.Shape();
		
		addLine(shape, dxfPrimitivesArr, p1, p3, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p3, p4, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p4, p2, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p2, p1, dxfBasePoint);
		
		//Отверстия
		var holeRad = 4;
		var holeOffset = 15;//Отступ от грани фланца
		var center1 = newPoint_xy(getMiddlePoint(p2, p1), holeOffset, 0);
		addRoundHole(shape, dxfPrimitivesArr, center1, holeRad, dxfBasePoint);
		var middle = getMiddlePoint(p3, p4);
		var center2 = newPoint_xy(getMiddlePoint(p3, middle), -holeOffset, 0);
		addRoundHole(shape, dxfPrimitivesArr, center2, holeRad, dxfBasePoint);
		var center3 = newPoint_xy(getMiddlePoint(middle, p4), -holeOffset, 0);
		addRoundHole(shape, dxfPrimitivesArr, center3, holeRad, dxfBasePoint);
	}

	var extrudeOptions = {
		amount: 6,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	
	var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	par.mesh = new THREE.Mesh(geometry, params.materials.metal);
	return par;
}

function drawRoundFlan(par) {

	par.mesh = new THREE.Object3D();

	var rad = 135;
	var thk = 8;
	var holesAmt = 6;
	var holeRad = 7;
	var holePosRad = 115;
	var text = "Нижний фланец";
	var centralHoleRad = 11;

	if (par.partName == "topFlan") {
		rad = 127 / 2;
		holesAmt = 4;
		holeRad = 4;
		thk = 4;
		holePosRad = 78.7 / 2;
		text = "Верхний фланец";
		centralHoleRad = 13;
	}
	var shape = new THREE.Shape();
	var extrudeOptions = {
		amount: thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	//внешний контур
	var flanCenter = {
		x: 0,
		y: 0
	}
	addCircle(shape, par.dxfArr, flanCenter, rad, par.dxfBasePoint)

	if (par.partName == "botFlan") {
		par.isFixPart = true; // болты крепления к стенам
		par.fixPar = getFixPart(0, 'botFloor'); // параметры крепления к стенам
		holeRad = par.fixPar.diam / 2 + 1;
	}
	

	//отверстия
	var holesFix = [];
	var angleStep = Math.PI * 2 / holesAmt;
	for (var i = 0; i < holesAmt; i++) {
		var center = polar(flanCenter, angleStep * i, holePosRad);
		addRoundHole(shape, par.dxfArr, center, holeRad, par.dxfBasePoint);
		holesFix.push(center);
	}

	//центральное отверстие
	addRoundHole(shape, par.dxfArr, flanCenter, centralHoleRad, par.dxfBasePoint);

	//подпись под фигурой

	var textHeight = 30;
	var textBasePoint = newPoint_xy(par.dxfBasePoint, -100, -200)
	addText(text, textHeight, dxfPrimitivesArr, textBasePoint)

	var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

	var flan = new THREE.Mesh(geometry, par.material);
	//flan.rotation.x = -Math.PI / 2;
	par.mesh.add(flan);

	//болты крепления к перекрытию
	if (typeof isFixPats != "undefined" && isFixPats && par.isFixPart) { //глобальная переменная		
		if (par.fixPar.fixPart !== 'нет') {
			for (var i = 0; i < holesFix.length; i++) {
				var fix = drawFixPart(par.fixPar).mesh;
				fix.position.x = holesFix[i].x;
				fix.position.y = holesFix[i].y;
				fix.position.z = thk * (1 + turnFactor) * 0.5;
				fix.rotation.x = -Math.PI / 2 * turnFactor;
				par.mesh.add(fix);
			}
		}
	}

	par.mesh.rotation.x = Math.PI / 2;
	par.mesh.position.y = thk;

	//сохраняем данные для спецификации
	if (par.partName == "topFlan" && (params.stairType == "рифленая сталь" || params.stairType == "лотки под плитку")) thk = 8;
	if (typeof specObj != 'undefined') {
		if (!specObj[par.partName]) {
			specObj[par.partName] = {
				types: {},
				amt: 0,
				name: text,
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
			}
		}
		var name = "Ф" + rad * 2 + "x" + thk + " " + holesAmt + " отв. Ф" + holeRad * 2;
		if (specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] += 1;
		if (!specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] = 1;
		specObj[par.partName]["amt"] += 1;
	}
	par.mesh.specId = par.partName + name;

	return par;



}

function drawPlatformRailingFlan_(par) {
	var size = par.size;
	var thk = 4;
	var holeRad = 4;
	var holeDst = par.holeDst;
	var rackSize = 40;

	var shape = new THREE.Shape();
	var extrudeOptions = {
		amount: thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	//внешний контур

	var p0 = {
		x: 0,
		y: 0
	}
	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p1, 0, size);
	var p3 = newPoint_xy(p2, size, 0);
	var p4 = newPoint_xy(p3, 0, -size);

	addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p4, p1, par.dxfBasePoint);

	//круглые отверстия
	var holeOffset = (size - holeDst) / 2;
	var center1 = newPoint_xy(p0, holeOffset, holeOffset)
	addRoundHole(shape, par.dxfArr, center1, holeRad, par.dxfBasePoint);
	var center2 = newPoint_xy(center1, 0, holeDst)
	addRoundHole(shape, par.dxfArr, center2, holeRad, par.dxfBasePoint);
	var center2 = newPoint_xy(center1, holeDst, holeDst)
	addRoundHole(shape, par.dxfArr, center2, holeRad, par.dxfBasePoint);
	var center2 = newPoint_xy(center1, holeDst, 0)
	addRoundHole(shape, par.dxfArr, center2, holeRad, par.dxfBasePoint);

	//квадратное отверстие
	holeOffset = (size - rackSize) / 2;
	ph1 = newPoint_xy(p0, holeOffset, holeOffset)
	ph2 = newPoint_xy(ph1, rackSize, 0)
	ph3 = newPoint_xy(ph1, rackSize, rackSize)
	ph4 = newPoint_xy(ph1, 0, rackSize)

	var sqHole = new THREE.Path();
	addLine(sqHole, par.dxfArr, ph1, ph2, par.dxfBasePoint);
	addLine(sqHole, par.dxfArr, ph2, ph3, par.dxfBasePoint);
	addLine(sqHole, par.dxfArr, ph3, ph4, par.dxfBasePoint);
	addLine(sqHole, par.dxfArr, ph4, ph1, par.dxfBasePoint);

	shape.holes.push(sqHole);


	//подпись под фигурой
	var text = "Фланец ограждений"
	var textHeight = 30;
	var textBasePoint = newPoint_xy(par.dxfBasePoint, -100, -200)
	addText(text, textHeight, dxfPrimitivesArr, textBasePoint)

	var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

	var flan = new THREE.Mesh(geometry, par.material);
	flan.rotation.x = -Math.PI / 2
	flan.position.x = -size / 2
	flan.position.z = size / 2

	par.mesh = new THREE.Object3D();
	par.mesh.add(flan);
	return par;


}

function drawMidFix(par) {

	/*
	profWidth
	profHeight
	holderLength
	*/
	//функция отрисовывает прямоугольный профиль промежуточного крепления лестинцы к стене

	par.mesh = new THREE.Object3D();
	var dxfBasePoint = par.dxfBasePoint;


	var extrudeOptions = {
		amount: par.profHeight,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var shape = new THREE.Shape();
	var p0 = {
		x: 0,
		y: 0
	}

	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p1, 0, par.profWidth);
	var p3 = newPoint_xy(p1, par.holderLength, par.profWidth);
	var p4 = newPoint_xy(p1, par.holderLength, 0);

	addLine(shape, par.dxfArr, p1, p2, dxfBasePoint);
	addLine(shape, par.dxfArr, p2, p3, dxfBasePoint);
	addLine(shape, par.dxfArr, p3, p4, dxfBasePoint);
	addLine(shape, par.dxfArr, p4, p1, dxfBasePoint);

	var center = newPoint_xy(p4, -25, par.profWidth / 2)
	addRoundHole(shape, par.dxfArr, center, 6, dxfBasePoint);

	var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var bal = new THREE.Mesh(geometry, par.material);
	bal.rotation.x = Math.PI / 2;
	bal.position.x = params.columnDiam / 2 + 5;
	bal.position.y = 0;
	if (params.stairType == "рифленая сталь" || params.stairType == "лотки под плитку") bal.position.y = 40 + 8;
	bal.position.z = -par.profWidth / 2;

	par.mesh.add(bal);

	//подпись под фигурой
	var textHeight = 30;
	var textBasePoint = newPoint_xy(dxfBasePoint, -100, -50)
	addText(par.text, textHeight, dxfPrimitivesArr, textBasePoint)

	var flanParams = {
		dxfBasePoint: dxfBasePoint,
		dxfArr: par.dxfArr,
		material: par.material,
	}

	flanParams = drawMidFixFlan(flanParams);
	var flan = flanParams.mesh;
	flan.rotation.x = Math.PI / 2;
	flan.rotation.y = Math.PI;
	flan.position.x = 0 //500//params.columnDiam / 2 + 5;
	flan.position.y = 0;
	flan.position.z = 0 //500//-par.profWidth/2;

	par.mesh.add(flan);

	//фланец для крепления к стене
	var flanPar = {
		height: 140, //ширина фланца
		width: 140, //длина фланца (высота при вертикальном расположении)
		holeRad: 7.5,
		cornerRad: 20,
		holeX: 20,
		holeY: 20,
		dxfBasePoint: dxfBasePoint,
	};
	//flanPar.noBolts = par.noBolts; //болты не добавляются
	flanPar.noBolts = true; //болты не добавляются

	flanPar.isFixPart = true; // болты крепления к стенам
	var numberFix = par.numberFix;
	if (numberFix == 5) numberFix = 1;
	flanPar.fixPar = getFixPart(par.numberFix, 'vint'); // параметры крепления к стенам

	flanPar.holeRad = flanPar.fixPar.diam / 2 + 1;

	flanPar.roundHoleCenters = [];

	//добавляем  отверстия по краям
	flanPar.roundHoleCenters.push({ x: flanPar.holeX, y: flanPar.holeY, holeData: { zenk: 'no' }, isFixPart: flanPar.isFixPart });
	flanPar.roundHoleCenters.push({ x: flanPar.holeX, y: flanPar.height - flanPar.holeY, holeData: { zenk: 'no' }, isFixPart: flanPar.isFixPart });
	flanPar.roundHoleCenters.push({ x: flanPar.width - flanPar.holeX, y: flanPar.height - flanPar.holeY, holeData: { zenk: 'no' }, isFixPart: flanPar.isFixPart });
	flanPar.roundHoleCenters.push({ x: flanPar.width - flanPar.holeX, y: flanPar.holeY, holeData: { zenk: 'no' }, isFixPart: flanPar.isFixPart });


	var flan = drawRectFlan2(flanPar).mesh;
	flan.position.x = bal.position.x + par.holderLength;
	flan.position.y = bal.position.y - flanPar.height / 2 - par.profWidth / 2;
	flan.position.z = bal.position.z - flanPar.width / 2 + par.profWidth / 2;
	flan.rotation.x = Math.PI / 2;
	flan.rotation.y = Math.PI / 2;

	par.mesh.add(flan);

	//косынка кронштейна
	{
		var p0 = {x: 0,y: 0}

		var p1 = copyPoint(p0);
		var p2 = newPoint_xy(p1, 0, flanPar.height);
		var p3 = newPoint_xy(p1, 40, flanPar.height / 2);

		p3.filletRad = 20;

		var shapePar = {
			points: [p3, p2, p1],
			dxfArr: par.dxfArr,
			dxfBasePoint: dxfBasePoint,
		}

		var shape = drawShapeByPoints2(shapePar).shape;

		var center = newPoint_xy(p1, 25, flanPar.height / 2)
		addRoundHole(shape, par.dxfArr, center, 6, dxfBasePoint);

		var extrudeOptions = {
			amount: 8,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};

		var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var flan = new THREE.Mesh(geometry, par.material);
		flan.position.x = bal.position.x + par.holderLength;
		flan.position.y = bal.position.y// - flanPar.height / 2 - par.profWidth / 2;
		flan.position.z = bal.position.z - flanPar.width / 2 + par.profWidth / 2;
		flan.rotation.x = Math.PI / 2;
		flan.rotation.y = Math.PI;

		par.mesh.add(flan);

		var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var flan1 = new THREE.Mesh(geometry, par.material);
		flan1.position.x = bal.position.x + par.holderLength;
		flan1.position.y = bal.position.y - par.profWidth - 8;
		flan1.position.z = bal.position.z - flanPar.width / 2 + par.profWidth / 2;
		flan1.rotation.x = Math.PI / 2;
		flan1.rotation.y = Math.PI;

		par.mesh.add(flan1);

		/* болты */
		if (typeof anglesHasBolts != "undefined" && anglesHasBolts) { //глобальная переменная
			var boltPar = {
				diam: 10,
				len: 70,
				headType: "шестигр.",
			}
			var bolt = drawBolt(boltPar).mesh;
			bolt.rotation.x = -Math.PI / 2;
			bolt.position.x = center.x;
			bolt.position.y = center.y;
			bolt.position.z = -5 - 20;

			flan.add(bolt)
		}
	}

	var plugParams = {
		id: "plasticPlug_40_40",
		width: 40,
		height: 40,
		description: "Заглушка бокового крепления",
		group: "Каркас"
	}
	var rackBotPlug = drawPlug(plugParams);
	rackBotPlug.position.x = bal.position.x;// + par.holderLength;
	rackBotPlug.position.y = bal.position.y - par.profWidth / 2;
	rackBotPlug.position.z = bal.position.z + par.profWidth / 2;
	rackBotPlug.rotation.x = Math.PI / 2;
	rackBotPlug.rotation.z = Math.PI / 2;

	if(!testingMode) par.mesh.add(rackBotPlug);


	//сохраняем данные для спецификации
	var partName = "midFix";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Кронштейн промежуточного крепления к стене",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
			}
		}

		var name = par.profHeight + "x" + par.profWidth + "x" + par.holderLength;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}
	par.mesh.specId = partName + name;

	return par;
} //end of drawMidFix

function drawMidFixFlan(par) {
	var dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, -150);
	par.thk = 8;


	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var shape = new THREE.Shape();
	var p0 = {
		x: 0,
		y: 0
	}
	var rad = params.columnDiam / 2;

	var p11 = {
		x: -rad * Math.cos(Math.PI / 3),
		y: rad * Math.sin(Math.PI / 3)
	}
	var p21 = {
		x: -rad * Math.cos(Math.PI / 3),
		y: -rad * Math.sin(Math.PI / 3),
	}
	var p1 = {
		x: -92.4,
		y: 20,
	}
	var p2 = newPoint_xy(p1, -50, 0);
	var p3 = newPoint_xy(p2, 0, -40);
	var p4 = newPoint_xy(p3, 50, 0);

	addLine(shape, par.dxfArr, p1, p2, dxfBasePoint);
	addLine(shape, par.dxfArr, p2, p3, dxfBasePoint);
	addLine(shape, par.dxfArr, p3, p4, dxfBasePoint);
	addLine(shape, par.dxfArr, p4, p21, dxfBasePoint);
	addArc2(shape, par.dxfArr, p0, rad, Math.PI * 2 / 3, -Math.PI * 2 / 3, false, dxfBasePoint)
	addLine(shape, par.dxfArr, p11, p1, dxfBasePoint);
console.log("ghgh")
	var holeRad = 26 / 2;
	addRoundHole(shape, par.dxfArr, p0, holeRad, dxfBasePoint); //функция в файле drawPrimitives


	var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	par.mesh = new THREE.Mesh(geometry, par.material);


	//подпись под фигурой
	var textHeight = 30;
	var textBasePoint = newPoint_xy(dxfBasePoint, -100, -50)
	addText("фланец кронштейна", textHeight, dxfPrimitivesArr, textBasePoint)

	return par;

}

function drawCylinder(par) {
	var radiusTop = par.diam / 2;
	var radiusBottom = radiusTop;
	var radialSegments = 36;
	var heightSegments = 1;
	var openEnded = false;


	var geom = new THREE.CylinderGeometry(radiusTop, radiusBottom, par.height, radialSegments, heightSegments, openEnded)
	par.mesh = cyl = new THREE.Mesh(geom, par.material);

	//сохраняем данные для спецификации
	if (typeof specObj != 'undefined') {
		if (!specObj[par.partName]) {
			specObj[par.partName] = {
				types: {},
				amt: 0,
				name: "Шайба",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
			}
		}

		var height = par.height;
		if (par.partName == "drum") specObj[par.partName].name = "Бобышка";
		if (par.partName == "middleFlan") {
			specObj[par.partName].name = "Крышка бобышки";
			height = 8;
		}



		var name = "Ф" + par.diam + "x" + height + " отв. Ф" + par.holeDiam;
		if (specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] += 1;
		if (!specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] = 1;
		specObj[par.partName]["amt"] += 1;
	}
	par.mesh.specId = par.partName + name;

	return par;

} //end of drawCylinder

function drawCylinder_2(par) {
	/*
	var radiusTop = par.diam/2;
	var radiusBottom = radiusTop;
	var radialSegments = 36;
	var heightSegments = 1;
	var openEnded = false;
	*/

	par.dxfArr = [];
	par.dxfBasePoint = {
		x: 0,
		y: 0
	}

	var shape = new THREE.Shape();

	var extrudeOptions = {
		amount: par.height,
		bevelEnabled: false,
		curveSegments: 36,
		steps: 1
	};

	//внешний контур
	var flanCenter = {
		x: 0,
		y: 0
	}
	addCircle(shape, par.dxfArr, flanCenter, par.diam / 2, par.dxfBasePoint)


	//центральное отверстие
	addRoundHole(shape, par.dxfArr, flanCenter, par.holeDiam / 2, par.dxfBasePoint);

	var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

	par.mesh = new THREE.Mesh(geometry, par.material);
	par.mesh.rotation.x = -Math.PI / 2

	if (!par.partName) return par;

	//сохраняем данные для спецификации
	if (typeof specObj != 'undefined') {
		if (!specObj[par.partName]) {
			specObj[par.partName] = {
				types: {},
				amt: 0,
				name: "Шайба",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
			}
		}

		var height = par.height;
		if (par.partName == "drum") specObj[par.partName].name = "Бобышка";
		if (par.partName == "middleFlan") {
			specObj[par.partName].name = "Крышка бобышки";
			height = 8;
		}



		var name = "Ф" + par.diam + "x" + Math.round(height) + " отв. Ф" + par.holeDiam;
		if (specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] += 1;
		if (!specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] = 1;
		specObj[par.partName]["amt"] += 1;
	}
	par.mesh.specId = par.partName + name;

	return par;

} //end of drawCylinder_2

/** функция отрисовывает бобышку с внутренней шайбой и верхней крышкой

*/

function drawDrum(par) {
	par.shimMesh = new THREE.Object3D();

	var tubeThk = 4;
	var shimThk = 4 - 0.01;

	var cylParams = {
		diam: params.columnDiam,
		holeDiam: params.columnDiam - tubeThk * 2,
		height: par.height - shimThk,
		material: params.materials.metal,
		partName: "",
	}

	par.tubeMesh = drawCylinder_2(cylParams).mesh;

	//внутренняя шайба снизу

	var cylParams = {
		diam: params.columnDiam - (tubeThk + 1) * 2,
		holeDiam: par.holeDiam,
		height: shimThk,
		material: params.materials.metal2,
		partName: ""
	}

	var botShim = drawCylinder_2(cylParams).mesh;
	if(!testingMode) par.shimMesh.add(botShim);

	//крышка бобышки
	if(!par.noShim){
		var cylParams = {
			diam: params.columnDiam,
			holeDiam: 26,
			height: shimThk,
			material: params.materials.metal2,
			partName: "middleFlan"
		}

		var topShim = drawCylinder_2(cylParams).mesh;
		topShim.position.y = par.height - shimThk;
		par.shimMesh.add(topShim);

		//поясок верхней шайбы шайба
		var cylParams = {
			diam: params.columnDiam - (tubeThk + 1) * 2,
			holeDiam: 26,
			height: shimThk,
			material: params.materials.metal2,
			partName: ""
		}

		var topShim = drawCylinder_2(cylParams).mesh;
		topShim.position.y = par.height - shimThk * 2;
		par.shimMesh.add(topShim);
	}
	par.partName = "drum";
	if (typeof specObj != 'undefined') {
		if (!specObj[par.partName]) {
			specObj[par.partName] = {
				types: {},
				amt: 0,
				name: "Бобышка",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
			}
		}

		var height = par.height - shimThk;

		var name = "Ф" + params.columnDiam + "x" + Math.round(height) + " отв. Ф" + par.holeDiam;
		if (specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] += 1;
		if (!specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] = 1;
		specObj[par.partName]["amt"] += 1;
	}
	par.tubeMesh.specId = par.partName + name;

	return par;

} //end of drawDrum

/** функция отрисовывает центральный стержень
 */

function drawRod(par) {

	par.mesh = new THREE.Object3D();
	par.diam = 24;
	par.threadDiam = 20;
	par.startThreadLen = 50;
	par.endThreadLen = 100;
	if(par.isLast){
		par.len -= 50;
		par.endThreadLen = 150;
	}
	par.midLen = par.len - par.startThreadLen - par.endThreadLen;

	var radialSegments = 36;
	var heightSegments = 1;
	var openEnded = false;

	//резьба в начале	
	var geom = new THREE.CylinderGeometry(par.threadDiam / 2, par.threadDiam / 2, par.startThreadLen, radialSegments, heightSegments, openEnded)
	var cyl = new THREE.Mesh(geom, params.materials.metal2);
	cyl.position.y = par.startThreadLen / 2;
	par.mesh.add(cyl);

	//тело стержня
	var geom = new THREE.CylinderGeometry(par.diam / 2, par.diam / 2, par.midLen, radialSegments, heightSegments, openEnded)
	var cyl = new THREE.Mesh(geom, params.materials.metal2);
	cyl.position.y = par.midLen / 2 + par.startThreadLen;
	par.mesh.add(cyl);

	//резьба в конце

	var geom = new THREE.CylinderGeometry(par.threadDiam / 2, par.threadDiam / 2, par.endThreadLen, radialSegments, heightSegments, openEnded)
	var cyl = new THREE.Mesh(geom, params.materials.metal2);
	cyl.position.y = par.midLen + par.startThreadLen + par.endThreadLen / 2;

	if (!testingMode) par.mesh.add(cyl); //в режиме тестирования не добавляем, чтобы не было пересечений со стйокой балюстрады


	//сохраняем данные для спецификации
	par.partName = "rod";
	if (typeof specObj != 'undefined') {
		if (!specObj[par.partName]) {
			specObj[par.partName] = {
				types: {},
				amt: 0,
				name: "Центральный стержень",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
			}
		}

		var posName = "средний " + par.pos;
		if(par.pos == 0) posName = "нижний"
		if(par.isLast) posName = "верхний"
		
		var name = "Ф" + par.diam + "x" + par.len + " L1=" + par.startThreadLen + " L2=" + par.endThreadLen + " " + posName;
		if (specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] += 1;
		if (!specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] = 1;
		specObj[par.partName]["amt"] += 1;
	}
	par.mesh.specId = par.partName + name;

	return par;

} //end of drawCylinder

function drawSpiralStripe(par) {

	var drawSpiralStripe = function(u, v, target) {

		var angle = u * par.angle;
		var rad = par.rad;
		var height = par.height;
		var width = par.stripeWidth;
		var deltaBot = par.stripeWidth - par.botHeight;

		var x = rad * Math.cos(angle);
		var y = rad * Math.sin(angle) * par.turnFactor;
		var z = v * width + height * u - deltaBot;

		//срезаем снизу по горизонтали
		if (z < 0) z = 0;

		//срезаем сверху по горизонтали
		if (z > height + par.topHeight - deltaBot) z = height + par.topHeight - deltaBot;

		target.set( x, y, z );
		//return new THREE.Vector3(x, y, z);
	}

	var geom = new THREE.ParametricGeometry(drawSpiralStripe, 120, 120, false);

	var mesh = new THREE.Mesh(geom, par.material)

	//рассчитываем угол срезанного участка
	var startCutAngle = (par.stripeWidth - par.botHeight) / par.height * par.angle;

	par.mesh = mesh;
	par.startCutAngle = startCutAngle;
	return par;

} //end of drawSpiralStripe

function drawSpiralStripeMono(par) {
	var drawSpiralStripeMono = function (u, v, target) {

		var angle = u * par.angle;
		var rad = par.rad;
		var height = par.height;
		var width = par.stripeWidth;
		var deltaBot = par.stripeWidth - par.botHeight;

		var x = rad * Math.cos(angle);
		var y = rad * Math.sin(angle) * par.turnFactor;
		var z = v * width + height * u - deltaBot;

		//срезаем снизу по горизонтали
		if (z < 0) z = 0;

		//срезаем сверху по горизонтали
		//if (z > height + par.topHeight - deltaBot) z = height + par.topHeight - deltaBot;

		//вырезы
		var rise = stairParams.stepHeight
		var stepAngle = params.stepAngle / 180 * Math.PI;
		var ang = 0;
		if (par.deltaAng) ang += par.deltaAng;
		for (var i = 0; i < stairParams.stairAmt; i++) {
			if (angle >= stepAngle * i && angle <= stepAngle * (i + 1) - ang) {
				if (z > (rise * (i + 1) - params.treadThickness - 4)) {
					z = rise * (i + 1) - params.treadThickness - 4
				};
			}			
		}

		//срезаем сверху по горизонтали
		if (z > (rise * (stairParams.stairAmt + 1) - params.treadThickness - 4 + 20)) {
			z = rise * (stairParams.stairAmt + 1) - params.treadThickness - 4 + 20
		};



		target.set(x, y, z);
		//return new THREE.Vector3(x, y, z);
	}

	var geom = new THREE.ParametricGeometry(drawSpiralStripeMono, 220, 220, false);

	var mesh = new THREE.Mesh(geom, par.material)

	//рассчитываем угол срезанного участка
	var startCutAngle = (par.stripeWidth - par.botHeight) / par.height * par.angle;

	par.mesh = mesh;
	par.startCutAngle = startCutAngle;
	return par;

} //end of drawSpiralStripe


/** функция отрисовывает крышку нижнего фланца
*/

function drawBotFlanCover(){
	
	var holeRad = params.columnDiam / 2 + 1;
	var flanRad = 270 / 2;
	var rad = flanRad + 30;
	var height = 40;
	var topThk = 10;
	
	var points = [];
    var point = new THREE.Vector3(rad, 0, 0);
    points.push(point);
    point = new THREE.Vector3(rad, height, 0);
    points.push(point);
	point = new THREE.Vector3(holeRad, height, 0);
    points.push(point);
	
	/* внутренний контур */
	point = new THREE.Vector3(holeRad, height - topThk, 0);
    points.push(point);
	point = new THREE.Vector3(flanRad + 10, height - topThk, 0);
    points.push(point);
	point = new THREE.Vector3(flanRad + 10, 0, 0);
    points.push(point);
	var point = new THREE.Vector3(rad, 0, 0);
    points.push(point);

	
	var latheGeometry = new THREE.LatheGeometry (points, 36, 2, 2 * Math.PI);
	var cover = new THREE.Mesh( latheGeometry, params.materials.timber);
	
	//сохраняем данные для спецификации
	var partName = "botFlanCover";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Крышка нижнего фланца",
				metalPaint: false,
				timberPaint: true,
				division: "timber",
				workUnitName: "amt", //единица измерения
				group: "carcas",
			}
		}
		var name = "Ф" + rad * 2;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}
	cover.specId = partName + name;

	return cover;
}

function getMiddlePoint(p1, p2){
	var point = {
		x: (p1.x + p2.x) / 2,
		y: (p1.y + p2.y) / 2,
	}
	return point;
}

/** функция рассчитывает углы треугольной площадки и ступени
*/



function calcTriangleParams(){
	var par = {};
	var stairRad = params.staircaseDiam / 2
	var treadLowRad = 75;
	
	//нахлест ступеней
	par.treadOverlayLength = 60; //длина дуги нахлеста ступеней на внешнем радиусе
	par.treadOverlayAngle = par.treadOverlayLength / stairRad;
	
	//угол ступени
	par.treadAngle = params.stepAngle / 180 * Math.PI + par.treadOverlayAngle;
	//угол площадки
	par.pltAngle = params.platformAngle / 180 * Math.PI;
	
	//угол между ребрами
	par.extraAngle = Math.asin(treadLowRad / stairRad);
	par.treadEdgeAngle = par.treadAngle - 2 * par.extraAngle;
	par.pltEdgeAngle = par.pltAngle - 2 * par.extraAngle;
	
	return par;
}

/** функция расситывает базовые точки винтовой ступени
*/

function calcVintTreadPoints(treadAngle){
	
	//локальные переменные

	var treadLowRad = 75;
	var stairRad = params.staircaseDiam / 2;

	//угол между ребрами ступени
	var extraAngle = calcTriangleParams().extraAngle;
	var edgeLength = stairRad * Math.cos(extraAngle);
	var edgeAngle = treadAngle - 2 * extraAngle;

	var points = {};
	
	points[0] = {
		x: 0,
		y: 0
	}
	points[1] = {
		x: 0,
		y: -treadLowRad,
	}
	points[2] = {
		x: -treadLowRad * Math.sin(edgeAngle),
		y: treadLowRad * Math.cos(edgeAngle)
	}
	points[3] = {
		x: stairRad * Math.cos(treadAngle - extraAngle),
		y: stairRad * Math.sin(treadAngle - extraAngle)
	}
	points[4] = {
		x: edgeLength,
		y: -treadLowRad
	}
	
	points.balHoles = [];
	
	//отверстия под уголки балясины

	//отверстия под первую балясину
	var holesOffset = 22; //отступ отверстий от внешней кромки ступени
	var holeDst = 24; //расстояние между отверстиями в уголке
	var holePosRad = stairRad - holesOffset; //радиус расположения отверстий
	var dirAng = calcTriangleParams().treadOverlayAngle / 2 - extraAngle //угол направления на балясину
	var deltAng = holeDst / 2 / holePosRad; //дельта угла из-за того, что в уголке 2 отверстия

	var holeRad = 2;
	if (params.stairType == "рифленая сталь" || params.stairType == "лотки под плитку") holeRad = 4;
	var center1 = polar(points[0], dirAng + deltAng, holePosRad)
	var center2 = polar(points[0], dirAng - deltAng, holePosRad)
	center1.rad = center2.rad = holeRad;
	points.balHoles.push(center1, center2)

	//отверстия под остальные стойки
	var stepAngle = params.stepAngle / 180 * Math.PI;
	var balAngle = stepAngle / params.banisterPerStep; //угол между балясинами
	for (var i = 1; i < params.banisterPerStep + 1; i++) {
		dirAng = dirAng + balAngle;
		var center1 = polar(points[0], dirAng + deltAng, holePosRad)
		var center2 = polar(points[0], dirAng - deltAng, holePosRad)
		center1.rad = center2.rad = holeRad;
		points.balHoles.push(center1, center2)
	}
	


	return points;

}


/*Функция отрисовки кронштейна крепления поручня для частых стоек*/
function drawHolderVint() {

	var dxfBasePoint = { x: 0, y: 0 };
	var basePoint = { x: -20, y: 12.5 }; //устанавливаем базавую точку кронштейна в отверстие для болта

	var color = 0xC0C0C0;

	var length = 40;
	var thk = 1.5;


	var metalMaterial = new THREE.MeshLambertMaterial({ color: color, wireframe: false });
	if (!menu.realColors) metalMaterial = params.materials.metal;


	// Кронштейн деталь бок
	dxfBasePoint.x = 0;
	dxfBasePoint.y = -100;

	var holderSupport2 = drawHolderVintSide();
	holderSupport2.rotation.z = -Math.PI / 2;
	holderSupport2.position.x = -thk;
	holderSupport2.position.y = basePoint.y;
	holderSupport2.position.z = basePoint.x;


	// Кронштейн деталь бок
	dxfBasePoint.x = 0;
	dxfBasePoint.y = 100;

	var holderSupport4 = drawHolderVintSide();
	holderSupport4.position.x = 24 - thk - thk;
	holderSupport4.rotation.z = -Math.PI / 2;
	holderSupport4.position.y = basePoint.y;
	holderSupport4.position.z = basePoint.x;

	// Кронштейн деталь вверх
	dxfBasePoint.x = 0;
	dxfBasePoint.y = 100;

	var holderSupport5 = drawHolderVintTop();
	holderSupport5.position.x = thk - thk;
	holderSupport5.position.y = basePoint.y;
	holderSupport5.position.z = basePoint.x;

	var complexObject1 = new THREE.Object3D();
	complexObject1.add(holderSupport2);
	complexObject1.add(holderSupport4);
	complexObject1.add(holderSupport5);

	//complexObject1.rotation.x = -stairParams.stairCaseAngle;
	var stepAngle = params.stepAngle / 180 * Math.PI;
	// complexObject1.rotation.x = -(stairParams.stairAmt + 1.5) * stepAngle;


	// шурупы крепления поручня
	var partName = "timberHandrailScrew";
	if ((params.handrailMaterial == "ПВХ") || (params.handrailMaterial == "Дуб")) {
		var screwPar = {
			id: "screw_4x32",
			description: "Крепление поручня к балясинам",
			group: "Ограждения"
		}

		var screw = drawScrew(screwPar).mesh;

		screw.rotation.y = Math.PI / 2
		screw.position.z = -12;
		screw.position.y = 12.5;
		screw.position.x = 10.5;
		complexObject1.add(screw)

		var screw2 = drawScrew(screwPar).mesh;
		screw2.rotation.y = Math.PI / 2
		screw2.position.z = 12;
		screw2.position.y = 12.5;
		screw2.position.x = 10.5;
		complexObject1.add(screw2)
	}

	//болт крепление кронштейна к балясине
	if (typeof anglesHasBolts != "undefined" && anglesHasBolts) { //глобальная переменная
		var boltPar = {
			diam: 6,
			len: 30,
			headType: "внутр. шестигр. плоск. гол.",
		}

		var bolt = drawBolt(boltPar).mesh;
		bolt.position.x = 10;
		bolt.rotation.z = -Math.PI / 2;
		complexObject1.add(bolt)
	}


	//сохраняем данные для спецификации
	var partName = "bracket";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Кронштейн поручня",
				metalPaint: true,
				timberPaint: false,
				division: "stock_2",
				workUnitName: "amt", //единица измерения
				group: "Ограждения",
			}
		}

		var name = "П-образный для стойки 20х20";
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}

	//complexObject1.specId = partName + name;
	//$.each(complexObject1.children, function () {
	//    this.specId = partName + name;
	//})

	// var complexObject2 = new THREE.Object3D();
	// complexObject2.add(complexObject1)

	complexObject1.specId = partName + name;
	// addSpecIdToChilds(complexObject2, partName + name);

	return complexObject1
}

/*функция отрисовки боковой части кронштейна крепления поручня для частых стоек*/
function drawHolderVintSide() {
	var dxfBasePoint = { x: 0, y: 0 };

	var thk = 1.5;

	var mesh = new THREE.Object3D();

	//создаем контур пластины для создания Object3D
	var p0 = { x: 0, y: 0 };
	var p1 = newPoint_xy(p0, 0, 10);
	var p2 = newPoint_xy(p0, 12.5, 22.5);
	var p3 = newPoint_xy(p2, 15, 0);
	var p5 = newPoint_xy(p0, 40, 0);
	var p4 = newPoint_xy(p5, 0, 10);

	p0.filletRad = p5.filletRad = 0;
	var points = [p0, p1, p2, p3, p4, p5];

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: [],
		dxfBasePoint: dxfBasePoint,
		radOut: 3, //радиус скругления внешних углов
	}

	var shape = drawShapeByPoints2(shapePar).shape;

	var center = newPoint_xy(p0, 20, 12.5);
	addRoundHole(shape, [], center, 3.5, dxfBasePoint);

	var extrudeOptions = {
		amount: thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var plate = new THREE.Mesh(geom, params.materials.metal);
	plate.rotation.x = -Math.PI / 2;
	plate.rotation.z = -Math.PI / 2;

	mesh.add(plate);

	return mesh;

} //end of drawHolderVintSide

/*функция отрисовки верхней части кронштейна крепления поручня для частых стоек*/
function drawHolderVintTop() {
	var dxfBasePoint = { x: 0, y: 0 };

	var thk = 1.5;

	var mesh = new THREE.Object3D();

	//создаем контур пластины для создания Object3D
	var p0 = { x: 0, y: 0 };
	var p1 = newPoint_xy(p0, 0, 21);
	var p2 = newPoint_xy(p1, 40, 0);
	var p3 = newPoint_xy(p2, 0, -21);

	var points = [p0, p1, p2, p3];

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: [],
		dxfBasePoint: dxfBasePoint,
		radOut: 0, //радиус скругления внешних углов
	}

	var shape = drawShapeByPoints2(shapePar).shape;

	var center = newPoint_xy(p0, 8, 10.5);
	addRoundHole(shape, [], center, 2.5, dxfBasePoint);

	var center = newPoint_xy(p3, -8, 10.5);
	addRoundHole(shape, [], center, 2.5, dxfBasePoint);

	var extrudeOptions = {
		amount: thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var plate = new THREE.Mesh(geom, params.materials.metal);
	plate.rotation.x = -Math.PI / 2;
	plate.rotation.z = -Math.PI / 2;

	mesh.add(plate);

	return mesh;

} //end of drawHolderVintTop


/**
 * Функция вычисляет номера ступеней под которыми надо сделать разделение тетив 
 */
function calcDivides(stepHeight, staircaseHeight) {
	var arr = []

	var typeTread = "timber";
	if (params.stairType == "рифленая сталь" || params.stairType == "лотки под плитку") typeTread = "metal";


	if (params.model != "Винтовая") {
		var countDivide = Math.ceil((staircaseHeight - 20) / 1400);
		var heightDivide = (staircaseHeight - 20) / countDivide;

		var h = -params.treadThickness;
		if (typeTread == "metal") h -= 30;

		var j = 1;

		for (var i = 0; i < params.stepAmt; i++) {
			h += stepHeight;
			if (h > heightDivide * j) {
				arr.push(i + 1);
				j++;
			}
		}
	}
	return arr
}

/**
 * Функция отрисовывает пластины соединения тетив
 */
function drawConnectingFlans(par) {
	par.flanThickness = 8;
	var mesh = new THREE.Object3D();

	var flan1 = connectingFlan(par).flanMesh;
	flan1.position.y = -par.flanThickness - params.treadThickness;
	if (par.type == "metal") flan1.position.y -= 30;
	mesh.add(flan1)

	var flan2 = connectingFlan(par).flanMesh;
	flan2.position.y = -par.flanThickness * 2 - params.treadThickness;
	if (par.type == "metal") flan2.position.y -= 30;
	mesh.add(flan2)

	/* болты */
	if (typeof anglesHasBolts != "undefined" && anglesHasBolts) { //глобальная переменная
		var boltPar = {
			diam: 10,
			len: 30,
		}
		for (var i = 0; i < par.boltCenters.length; i++) {
			var bolt = drawBolt(boltPar).mesh;
			bolt.rotation.x = -Math.PI / 2;
			bolt.position.x = par.boltCenters[i].x;
			bolt.position.y = par.boltCenters[i].y;
			bolt.position.z = -3;

			var cap = drawPlasticCap(boltPar.diam);
			cap.position.y = boltPar.len / 2 - 7;
			bolt.add(cap);

			flan1.add(bolt)
		}
	}

	return mesh;
}

/**
 * Функция отрисовывает пластину соединения тетив
 */
function connectingFlan(par) {
	par.boltCenters = [];
	var radOut = params.staircaseDiam / 2 - 4;
	var radIn = radOut - 50;
	var extraAngle = calcTriangleParams().extraAngle;
	var ang = 0.5 * (Math.PI / 180)

	var angStart = par.treadAngle - extraAngle - ang
	var angEnd = - extraAngle + ang

	var p0 = { x: 0, y: 0 }
	var p1 = polar(p0, angStart, radOut);
	var p2 = polar(p0, angEnd, radOut);
	var p4 = polar(p0, angStart, radIn);
	var p3 = polar(p0, angEnd, radIn);

	/*вычерчиваем конутр пластины*/
	var dxfBasePoint = {
		x: 0,
		y: 0,
	}


	var shape = new THREE.Shape();
	addLine(shape, dxfPrimitivesArr, p4, p1, dxfBasePoint);
	addArc2(shape, dxfPrimitivesArr, p0, radOut, angStart, angEnd, true, dxfBasePoint);
	addLine(shape, dxfPrimitivesArr, p2, p3, dxfBasePoint);
	addArc2(shape, dxfPrimitivesArr, p0, radIn, angStart, angEnd, false, dxfBasePoint);

	//рисуем отверстия
	var radHoleBolt = 6.5;
	var radHoleScrew = 3;
	var rad = radOut - (radOut - radIn) / 2;
	var angStepFirstLast = 1 * (Math.PI / 180)

	var hole1 = polar(p0, angStart - angStepFirstLast, rad);	
	var hole2 = polar(p0, angEnd + angStepFirstLast, rad);
	addRoundHole(shape, dxfPrimitivesArr, hole1, radHoleBolt, dxfBasePoint);
	addRoundHole(shape, dxfPrimitivesArr, hole2, radHoleBolt, dxfBasePoint);
	par.boltCenters.push(hole1);
	par.boltCenters.push(hole2);
	
	if (par.type == "metal") {
		var stepAng = ((angStart - angEnd) - angStepFirstLast * 2) / 3
		var hole3 = polar(p0, angStart - angStepFirstLast - stepAng, rad);
		var hole4 = polar(p0, angEnd + angStepFirstLast + stepAng, rad);
		addRoundHole(shape, dxfPrimitivesArr, hole3, radHoleBolt, dxfBasePoint);
		addRoundHole(shape, dxfPrimitivesArr, hole4, radHoleBolt, dxfBasePoint);
		par.boltCenters.push(hole3);
		par.boltCenters.push(hole4);
	}

	if (par.type == "timber") {
		var angMiddle = (angStart + angEnd) / 2;
		var hole3 = polar(p0, angMiddle, rad);
		addRoundHole(shape, dxfPrimitivesArr, hole3, radHoleBolt, dxfBasePoint);
		par.boltCenters.push(hole3);

		var stepAng = ((angStart - angMiddle) - angStepFirstLast) / 3
		var hole4 = polar(p0, angStart - angStepFirstLast - stepAng, rad);
		var hole5 = polar(p0, angMiddle + stepAng, rad);
		var hole6 = polar(p0, angEnd + angStepFirstLast + stepAng, rad);
		var hole7 = polar(p0, angMiddle - stepAng, rad);
		addRoundHole(shape, dxfPrimitivesArr, hole4, radHoleScrew, dxfBasePoint);
		addRoundHole(shape, dxfPrimitivesArr, hole5, radHoleScrew, dxfBasePoint);
		addRoundHole(shape, dxfPrimitivesArr, hole6, radHoleScrew, dxfBasePoint);
		addRoundHole(shape, dxfPrimitivesArr, hole7, radHoleScrew, dxfBasePoint);
	}

	
	

	var extrudeOptions = {
		amount: par.flanThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.metal);
	mesh.rotation.x = -0.5 * Math.PI;

	par.flanMesh = mesh;

	return par;
}

function itercectionLines(line1, line2) {
	return itercection(line1.p1, line1.p2, line2.p1, line2.p2);
}



/**
	Функция отрисовки параметрической задней пластины на забеге на гнутом коробе
*/
function drawTurnBackCurve(par) {

	var drawTurnBackCurve = function (u, v, target) {

		//var angle = -Math.PI / 2;
		//var angle = u * par.angle;
		var angle = par.angle// * turnFactor;
		var radOut = params.staircaseDiam / 2 - params.M / 2 + 75// - params.metalThickness;
		var radIn = params.staircaseDiam / 2 - params.M / 2 - 75// + params.metalThickness;
		var height = par.height;

		var x = radOut * u * Math.cos(v * angle)// * turnFactor;
		var y = radOut * u * Math.sin(v * angle) * par.turnFactor;
		var z = height * v;

		if (x * x + y * y < radIn * radIn) {
			x = radIn * Math.cos(v * angle)// * turnFactor;
			y = radIn * Math.sin(v * angle) * par.turnFactor;
		}

		//срезаем сверху по горизонтали
		if (v * angle >= angle - par.startCutAngle) {
			x = par.topPoint.x;
			y = par.topPoint.y;
			z = par.topPoint.z;
		}
		else{
			par.topPoint.x = x;
			par.topPoint.y = y;
			par.topPoint.z = z;
		}

		target.set(x, y, z);
	}
	
	par.topPoint = {x: 0, y: 0, z: 0}

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

/** функция отрисовки подложки первой забежной ступени для лестницы на сварном коробе
*@params points - точки контура, рассчитанные при расчете ступеней в функции drawVintTreadShape
*@params dxfArr
*@params dxfBasePoint
*/
function drawTreadPlate(par) {

	par.mesh = new THREE.Object3D();
	par.thk = 4;

	//создаем шейп
	var shapePar = {
		points: par.points,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
	}

	var shape = drawShapeByPoints2(shapePar).shape;

	//прямоугольный вырез в центре детали------------------------------

	var holesPar = {
		points: par.pointsHoles,
		dx: -40,
		dy: -40 * par.turnFactor,
	}

	var arr = moovePointsPathToIn(holesPar).points//.reverse();
	if (par.turnFactor == -1) arr.reverse();
	//if (turnFactor == -1)
	//arr = mirrowPointsMiddleX(arr);

	var holeParams = {
		vertexes: arr,
		cornerRad: 10.0,
		dxfPrimitivesArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint
	}

	shape.holes.push(topCoverCentralHole(holeParams));

	//отверстия для болтов--------------------------------------------------------
	var holesPar = {
		points: par.pointsHoles,
		dx: -20,
		dy: -20 * par.turnFactor,
	}

	par.holesBolt = moovePointsPathToIn(holesPar).points;
	//if (turnFactor == -1)
	//par.holesBolt = mirrowPointsMiddleX(par.holesBolt);
	for (var j = 0; j < par.holesBolt.length; j++) {
		addRoundHole(shape, par.dxfArr, par.holesBolt[j], 6.5, par.dxfBasePoint);
	}

	//отверстия для шурупов крепления ступени-----------------------------------------
	var holesPar = {
		points: par.points,
		dx: -20,
		dy: -20 * par.turnFactor,
	}

	par.holes = moovePointsPathToIn(holesPar).points;
	//if (turnFactor == -1)
	//par.holes = mirrowPointsMiddleX(par.holes);
	par.holeRad = 5;

	//Отмечаем тип зенковки, для свг
	par.holes.forEach(function (element) { element.holeData = { zenk: 'no' } });

	for (var j = 0; j < par.holes.length; j++) {
		addRoundHole(shape, par.dxfArr, par.holes[j], par.holeRad, par.dxfBasePoint);
	}


	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var topPlate = new THREE.Mesh(geom, params.materials.metal);
	topPlate.rotation.x = -0.5 * Math.PI;
	topPlate.position.y = -par.thk;
	par.mesh.add(topPlate);

	return par;
}

/** функция отрисовывает прямоугольные вертикальные пластины для сварного косоура
*@params points - точки контура, рассчитанные при расчете ступеней в функции drawVintTreadShape
*@params dxfArr
*@params dxfBasePoint
*/
function drawFrontPlate(par) {

	par.mesh = new THREE.Object3D();
	par.thk = 4;

	var p1 = copyPoint(par.points[0]);
	var p4 = copyPoint(par.points[1]);
	var p2 = newPoint_xy(p1, 0, par.thk * par.turnFactor);
	var p3 = newPoint_xy(p4, 0, par.thk * par.turnFactor);

	var points = [p1, p2, p3, p4]

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: par.dxfArr,
		dxfBasePoint: { x: 4000, y: 0, },
	}

	var shape = drawShapeByPoints2(shapePar).shape;

	var extrudeOptions = {
		amount: par.height,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var topPlate = new THREE.Mesh(geom, params.materials.metal);
	topPlate.rotation.x = -0.5 * Math.PI;
	topPlate.position.y = -par.thk;
	par.mesh.add(topPlate);

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

/*функция отрисовки центрального отверстия в верхней горизонтальной пластине сварного косоура
*/
function topCoverCentralHole(holeParams) {

	var vertexes = holeParams.vertexes;
	var cornerRad = holeParams.cornerRad;
	var path = new THREE.Path();
	var dxfPrimitivesArr = holeParams.dxfPrimitivesArr;
	var dxfBasePoint = holeParams.dxfBasePoint;
	var clockwise = true;

	var pH1 = copyPoint(vertexes[0]);
	var pH2 = copyPoint(vertexes[1]);
	var pH3 = copyPoint(vertexes[2]);
	var pH4 = copyPoint(vertexes[3]);

	var fil1 = calcFilletParams1(pH4, pH1, pH2, cornerRad, clockwise);
	var fil2 = calcFilletParams1(pH1, pH2, pH3, cornerRad, clockwise);
	var fil3 = calcFilletParams1(pH2, pH3, pH4, cornerRad, clockwise);
	var fil4 = calcFilletParams1(pH3, pH4, pH1, cornerRad, clockwise);
	addArc2(path, dxfPrimitivesArr, fil1.center, cornerRad, fil1.angstart, fil1.angend, !clockwise, dxfBasePoint);
	addLine(path, dxfPrimitivesArr, fil1.start, fil4.end, dxfBasePoint);
	addArc2(path, dxfPrimitivesArr, fil4.center, cornerRad, fil4.angstart, fil4.angend, !clockwise, dxfBasePoint);
	addLine(path, dxfPrimitivesArr, fil4.start, fil3.end, dxfBasePoint);
	addArc2(path, dxfPrimitivesArr, fil3.center, cornerRad, fil3.angstart, fil3.angend, !clockwise, dxfBasePoint);
	addLine(path, dxfPrimitivesArr, fil3.start, fil2.end, dxfBasePoint);
	addArc2(path, dxfPrimitivesArr, fil2.center, cornerRad, fil2.angstart, fil2.angend, !clockwise, dxfBasePoint);
	addLine(path, dxfPrimitivesArr, fil2.start, fil1.end, dxfBasePoint);

	return path;
}


