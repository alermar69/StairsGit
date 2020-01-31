/*** КОЛОННЫ ***/
/**
	@param type тип колонны
	@param length высота колонны
	@param topAngle Угол вершины колонны
	@param profSize Размер профиля колонны
	@param dxfArr массив линий
	@param dxfBasePoint Базовая точка

	@return mesh меш колонны
*/
function drawColumn(par){

	par.mesh = new THREE.Object3D();
	var shape = new THREE.Shape();
	
	calcStringerPar(par);
	var dy = par.length;//Разница пола(как я понял)
	if (par.type == "колонна") {

		if (testingMode) {
			par.length -= 0.01;
		}
		//контур колонны
		var deltaHeight = par.profSize * Math.tan(par.topAngle);
		var flanThickness = 8;
		var deltaHeightFlan = flanThickness / Math.cos(par.topAngle);
		var p0 = { x: 0, y: 0 };
		var p1 = copyPoint(p0);
		var p2 = newPoint_xy(p1, 0, par.length - deltaHeight / 2 - deltaHeightFlan);
		var p3 = newPoint_xy(p1, par.profSize, par.length + deltaHeight / 2 - deltaHeightFlan);
		var p4 = newPoint_xy(p1, par.profSize, 0);
		addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p4, p1, par.dxfBasePoint);
		var extrudeOptions = {
			amount: par.profSize,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};
		var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var col = new THREE.Mesh(geometry, params.materials.metal);
		col.position.x = -par.profSize / 2;
		col.position.z = -par.profSize / 2;
		col.position.y = -dy;
		par.mesh.add(col);
		//размер для спецификации
		par.poleLength = par.length + deltaHeight / 2 - deltaHeightFlan;

		//нижний фланец
		var flanPar = {
			type: "botColon",
			pointsShape: par.pointsShape,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, -300),
            profSize: par.profSize,
            marshId: par.marshId,
            countColon: par.countColon,
            isSvg: par.isSvgBot,
		};

		var flan = drawMonoFlan(flanPar).mesh;
		flan.position.y += -dy - 3; // 3 - зазор от нижнего края фланца до опоры

		var text = "Фланец колонны нижний";
		var textHeight = 30;
		var textBasePoint = newPoint_xy(flanPar.dxfBasePoint, -50, -50);
		addText(text, textHeight, dxfPrimitivesArr, textBasePoint);		

		par.mesh.add(flan);
	}

	if (par.type == "подкос") {
		//контур подкоса
		var maxHeight = 400;
		var minHeight = 100;
		var length = params.M / 2 + par.profSize / 2 - params.flanThickness + par.stringerLedge;
		par.sideLength = length; //размер для спецификации
		var flanThickness = 8;
		var deltaHeightFlan = flanThickness / Math.cos(par.topAngle);
		var p0 = { x: 0, y: 0 };
		var p1 = copyPoint(p0);
		var p2 = newPoint_xy(p1, 0, maxHeight);
		var p3 = newPoint_xy(p1, length, maxHeight);
		var p4 = newPoint_xy(p1, length, maxHeight - minHeight);
		addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p4, p1, par.dxfBasePoint);

		//отверстия
		var center = {
			x: length - 60,
			y: maxHeight - 60,
		}
		var holeRad = 30;
		addRoundHole(shape, par.dxfArr, center, holeRad, par.dxfBasePoint);

		center = {
			x: length / 2 + 60,
			y: maxHeight - 100,
		}
		var holeRad = 60;
		addRoundHole(shape, par.dxfArr, center, holeRad, par.dxfBasePoint);

		center = {
			x: length / 4,
			y: maxHeight - 155,
		}
		var holeRad = 90;
		addRoundHole(shape, par.dxfArr, center, holeRad, par.dxfBasePoint);

		var extrudeOptions = {
			amount: 8,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};
		var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var cons = new THREE.Mesh(geometry, params.materials.metal);
		cons.rotation.y = -Math.PI / 2;
		if (par.side == "right") cons.rotation.y = Math.PI / 2;
		cons.position.x = params.flanThickness;//-par.profSize/2;
		cons.position.y = par.length - maxHeight - params.flanThickness / Math.cos(par.topAngle);
		if (testingMode) cons.position.y -= 10; //Отодвигаем от фланца в режиме тестирования FIX IT
		cons.position.z = -length + par.profSize / 2;
		if (par.side == "right") cons.position.z = length - par.profSize / 2;;
		par.mesh.add(cons);

		
		//фланец к стене
		var flanFix = new THREE.Object3D();
		par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, -500);
		var flanParams = {
			width: 100,
			holeDiam: 18,
			holeDiam5: 0,
			angleRadUp: 10,
			angleRadDn: 10,
			hole1X: 20,
			hole1Y: 20,
			hole2X: 20,
			hole2Y: 20,
			hole3X: 20,
			hole3Y: 20,
			hole4X: 20,
			hole4Y: 20,
			hole5X: 0,
			hole5Y: 0,
			height: maxHeight,
			dxfBasePoint: par.dxfBasePoint,
			dxfPrimitivesArr: par.dxfArr,
		};

		flanParams.isFixPart = true; // болты крепления к стенам
		flanParams.fixPar = getFixPart(par.marshId); // параметры крепления к стенам
		flanParams.holeDiam = flanParams.fixPar.diam + 2; 

		//добавляем фланец
		flanParams = drawRectFlan(flanParams);

		var text = "Фланец колонны";
		var textHeight = 30;
		var textBasePoint = newPoint_xy(par.dxfBasePoint, -50, -100);
		addText(text, textHeight, dxfPrimitivesArr, textBasePoint);

		var thickness = 8;
		var extrudeOptions = {
			amount: thickness,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};
		var geometry = new THREE.ExtrudeGeometry(flanParams.shape, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var flan = new THREE.Mesh(geometry, params.materials.metal2);
		//flan.rotation.x = -Math.PI/2;
		flan.position.x = -flanParams.width / 2 + params.flanThickness / 2;
		flan.position.y = par.length - flanParams.height - params.flanThickness / Math.cos(par.topAngle);// - par.M/2 - par.h - 200;
		flan.position.z = -params.M / 2 + par.stringerLedge;
		if (par.side == "right") flan.position.z = params.M / 2 + par.stringerLedge;

		flanFix.add(flan);


		//болты крепления к стенам
		if (typeof isFixPats != "undefined" && isFixPats) { //глобальная переменная
			if (flanParams.fixPar.fixPart !== 'нет') {
				for (var i = 0; i < flanParams.holesFix.length; i++) {
					var fix = drawFixPart(flanParams.fixPar).mesh;
					fix.position.x = flan.position.x + flanParams.holesFix[i].x;
					fix.position.y = flan.position.y + flanParams.holesFix[i].y;
					fix.position.z = flan.position.z + params.flanThickness * (1 + turnFactor) * 0.5;
					fix.rotation.x = -Math.PI / 2 * turnFactor;
					flanFix.add(fix);
				}
			}
		}

		flanFix.rotation.y = Math.PI;
		flanFix.position.x = params.flanThickness;
		flanFix.position.z = -params.M + params.flanThickness;

		par.mesh.add(flanFix);

	} //end of подкос

    if (par.type == "двойной подкос") {
		//контур подкоса
		var maxHeight = 400;
		var minHeight = 100;
		var plateDist = 100; //расстояние между пластинами
		var extraLen = 28;
		var length = params.M / 2 + par.profSize / 2 - params.flanThickness + extraLen + par.stringerLedge;
		par.sideLength = length; //размер для спецификации
		var flanThickness = 8;
		var deltaHeightFlan = flanThickness / Math.cos(par.topAngle);
		var p0 = { x: 0, y: 0 };
		var p1 = copyPoint(p0);
		var p2 = newPoint_xy(p1, 0, maxHeight);
		var p3 = newPoint_xy(p1, length, maxHeight);
		var p4 = newPoint_xy(p1, length, maxHeight - minHeight);
		addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p4, p1, par.dxfBasePoint);

		//отверстия

		var center = {
			x: length - 50 - extraLen,
			y: maxHeight - 50,
		}
		var holeRad = 6.5;
		addRoundHole(shape, par.dxfArr, center, holeRad, par.dxfBasePoint);

		center = {
			x: length / 2 + 50,
			y: maxHeight - 100,
		}
		var holeRad = 50;
		addRoundHole(shape, par.dxfArr, center, holeRad, par.dxfBasePoint);

		center = {
			x: length / 4,
			y: maxHeight - 155,
		}
		var holeRad = 90;
		addRoundHole(shape, par.dxfArr, center, holeRad, par.dxfBasePoint);

		var extrudeOptions = {
			amount: 8,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};
		var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var topFLanDeltaY = (plateDist + 8) * Math.tan(par.topAngle);//Рассчитываем разницу наклона, это нужно чтобы скорректировать положение подкоса и корректно рассчитать фланцы
		var heightDelta = 0;
		if (topFLanDeltaY < -15) {//15 отступ на пластинах которые крепятся к фланцу, проверяем если угол получившийся меньше, сдвигаем подкос ниже
			heightDelta = -topFLanDeltaY + 15;
		}
		//первая пластина
		var cons = new THREE.Mesh(geometry, params.materials.metal);
		cons.rotation.y = -Math.PI / 2;
		if (par.side == "right") cons.rotation.y = Math.PI / 2;
		cons.position.x = - plateDist/2 + params.flanThickness;
		if (par.side == "right") cons.position.x = - plateDist/2;
		cons.position.y = -heightDelta - maxHeight - params.flanThickness / Math.cos(par.topAngle) - plateDist/2 * Math.tan(par.topAngle) - 15 - 0.01;
		cons.position.z = -length + par.profSize / 2 + extraLen;
		if (par.side == "right") cons.position.z = length - (par.profSize / 2 + extraLen);
		par.mesh.add(cons);

		//вторая пластина
		var shapeDop = new THREE.Shape();
		var dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, maxHeight + 100);
		addLine(shapeDop, par.dxfArr, p1, p2, dxfBasePoint);
		addLine(shapeDop, par.dxfArr, p2, p3, dxfBasePoint);
		addLine(shapeDop, par.dxfArr, p3, p4, dxfBasePoint);
		addLine(shapeDop, par.dxfArr, p4, p1, dxfBasePoint);
		//отверстия
		var center = {
			x: length - 50 - extraLen,
			y: maxHeight - 50,
		}
		var holeRad = 6.5;
		addRoundHole(shape, par.dxfArr, center, holeRad, dxfBasePoint);

		center = {
			x: length / 2 + 50,
			y: maxHeight - 100,
		}
		var holeRad = 50;
		addRoundHole(shape, par.dxfArr, center, holeRad, dxfBasePoint);

		center = {
			x: length / 4,
			y: maxHeight - 155,
		}
		var holeRad = 90;
		addRoundHole(shape, par.dxfArr, center, holeRad, dxfBasePoint);

		var cons2 = new THREE.Mesh(geometry, params.materials.metal);
		cons2.rotation.y = cons.rotation.y;
		cons2.position.x = cons.position.x + plateDist;
		cons2.position.y = cons.position.y;
		cons2.position.z = cons.position.z;
        par.mesh.add(cons2);

        shape.drawing = {
            name: "Пластина подкоса: кол-во - 2 шт.",
            group: "carcasFlans",
            marshId: "Подкос " + par.marshId,
        }
        shapesList.push(shape);

		//фланец к стене
		var flanFix = new THREE.Object3D();
		var flanParams = {
			width: 200,
			holeDiam: 18,
			holeDiam5: 0,
			angleRadUp: 10,
			angleRadDn: 10,
			hole1X: 20,
			hole1Y: 20,
			hole2X: 20,
			hole2Y: 20,
			hole3X: 20,
			hole3Y: 20,
			hole4X: 20,
			hole4Y: 20,
			hole5X: 0,
			hole5Y: 0,
			height: maxHeight,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, length + 200, 0),
			dxfPrimitivesArr: par.dxfArr,
		};

		flanParams.isFixPart = true; // болты крепления к стенам
		flanParams.fixPar = getFixPart(par.marshId); // параметры крепления к стенам
		flanParams.holeDiam = flanParams.fixPar.diam + 2; 

		//добавляем фланец
        flanParams = drawRectFlan(flanParams);

        flanParams.shape.drawing = {
            name: "Фланец подкоса к стене",
            group: "carcasFlans",
            marshId: "Подкос " + par.marshId,
        }
        shapesList.push(flanParams.shape);

		var thickness = 8;
		var extrudeOptions = {
			amount: params.flanThickness,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};
		var geometry = new THREE.ExtrudeGeometry(flanParams.shape, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var flan = new THREE.Mesh(geometry, params.materials.metal2);
		//flan.rotation.x = -Math.PI/2;
		flan.position.x = -flanParams.width / 2 + params.flanThickness / 2;
		flan.position.y = cons.position.y;
		flan.position.z = -params.M / 2 - par.stringerLedge;
		if (par.side == "right") flan.position.z = params.M / 2 - params.flanThickness + par.stringerLedge;

		flanFix.add(flan);

		//наклонные пластины фланца
		var gap = 1;
		var p1 = {x:0, y:15 - 0.01};
		p1.y += heightDelta;
		var p2 = newPoint_x(p1, plateDist + 8, -par.topAngle);
		var p3 = newPoint_xy(p1, plateDist + 8, -heightDelta);
		var p4 = newPoint_xy(p3, 0, -15 + 0.01);
		var p5 = newPoint_xy(p4, -10 + gap, 0);
		var p6 = newPoint_xy(p5, 0, -100);
		var p7 = newPoint_xy(p6, -plateDist + 20 - 8 - gap*2, 0);
		var p8 = newPoint_xy(p7, 0, 100);
		var p9 = newPoint_xy(p8, -10 + gap, 0);

		var points = [p1, p2, p3, p4, p5, p6, p7, p8, p9];

		//создаем шейп
		var shapePar = {
			points: points,
			dxfArr: par.dxfArr,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, length + 800, 0),
			radOut: 0, //радиус скругления внешних углов
        }       

		var shape = drawShapeByPoints2(shapePar).shape;
		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		//первая пластина
		var plate = new THREE.Mesh(geom, params.materials.metal2);
		plate.position.x = -plateDist / 2;
		plate.position.y = cons.position.y + maxHeight + 0.01;
		plate.position.z = -50;
		flanFix.add(plate);

		//вторая пластина
        shapePar.dxfBasePoint = newPoint_xy(shapePar.dxfBasePoint, 0, (p2.y - p6.y) + 100);
        shapePar.drawing = {
            name: "Наклонные пластины: кол-во-2шт.",
            group: "carcasFlans",
            marshId: "Подкос " + par.marshId,
        }
		var shapeDop = drawShapeByPoints2(shapePar).shape;

		var plate2 = new THREE.Mesh(geom, params.materials.metal2);
		plate2.position.x = plate.position.x;
		plate2.position.y = plate.position.y;
		plate2.position.z = 50 - 8;
		flanFix.add(plate2);


        //торцевая пластина

        var endPlatePar = {
            len: plateDist - 8,
            width: minHeight,
            thk: params.flanThickness,
            dxfBasePoint: newPoint_xy(par.dxfBasePoint, length + 500, 0),
            material: params.materials.metal,
        }

        var endPlate = drawPlate(endPlatePar).mesh;
        endPlate.position.x = -plateDist / 2 + 8;
        endPlate.position.y = cons.position.y + maxHeight - endPlatePar.width;
        endPlate.position.z = 50 + extraLen - params.flanThickness;
        if (par.side == "right") endPlate.position.z = -(50 + extraLen);
        flanFix.add(endPlate);

        endPlatePar.shape.drawing = {
            name: "Торцевая пластина",
            group: "carcasFlans",
            marshId: "Подкос " + par.marshId,
            notShiftBasePoint: true,
        }
        shapesList.push(endPlatePar.shape);

		//поперечные пластины с овальным пазом
		var headBridgePar = {
			width: 100 - 8*2,
			height: 100,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, length + 1000, 0),
			boltLen: 30,
			isHoleCenter: true,
			isDraw: true,
			slotLen: 50,
			}

		//первая пластина
		var headBridge = drawJumperPlatform(headBridgePar).mesh;
		headBridge.rotation.y = Math.PI / 2;
		headBridge.position.x = plate.position.x + 8 + gap;
		headBridge.position.y = plate.position.y - headBridgePar.height;
		headBridge.position.z = 50 - 8;
		flanFix.add(headBridge);

		//вторая пластина
        headBridgePar.dxfBasePoint = newPoint_xy(headBridgePar.dxfBasePoint, 0, headBridgePar.height + 100);

        headBridgePar.drawingSvg = {
            name: "Поперечные пластины: кол-во-2шт.",
            group: "carcasFlans",
            marshId: "Подкос " + par.marshId,
            basePoint: { x: 0, y: -endPlatePar.width - 100 },
        }

		var headBridge = drawJumperPlatform(headBridgePar).mesh;
		headBridge.rotation.y = Math.PI / 2;
		headBridge.position.x = plateDist / 2 - 8 - gap;
		headBridge.position.y = plate.position.y - headBridgePar.height;
		headBridge.position.z = 50 - 8;
		flanFix.add(headBridge);

		//болты крепления к стенам
		if (typeof isFixPats != "undefined" && isFixPats) { //глобальная переменная
			if (flanParams.fixPar.fixPart !== 'нет') {
				for (var i = 0; i < flanParams.holesFix.length; i++) {
					var fix = drawFixPart(flanParams.fixPar).mesh;
					fix.position.x = flan.position.x + flanParams.holesFix[i].x;
					fix.position.y = flan.position.y + flanParams.holesFix[i].y;
					fix.position.z = flan.position.z + params.flanThickness * (1 + turnFactor) * 0.5;
					fix.rotation.x = Math.PI / 2 * turnFactor;
					flanFix.add(fix);
				}
			}
		}

		par.mesh.add(flanFix);

	} //end of подкос

	//верхний фланец
	if (par.topFlan) {
		//нижний фланец
		var flanPar = {
			type: "topColon",
			pointsShape: par.pointsShape,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, -600),
			profSize: par.profSize,
            topAngle: par.topAngle,
			marshId: par.marshId,
			isSvg: true,
        };
        if (par.type == "двойной подкос") flanPar.marshId =  "Подкос " + par.marshId;

		var flan = drawMonoFlan(flanPar).mesh;
		flan.position.y -= deltaHeightFlan;//par.length - deltaHeightFlan - 0.01;
		var text = "Фланец колонны верхний";
		var textHeight = 30;
		var textBasePoint = newPoint_xy(flanPar.dxfBasePoint, -50, -50);
		addText(text, textHeight, dxfPrimitivesArr, textBasePoint);


		par.mesh.add(flan);
	}

	var poleLen = Math.round(p3.y - p1.y)
	//сохраняем данные для спецификации
	var partName = "column";
	if (par.type == "подкос") partName = "brace";
	if (par.type == "двойной подкос") partName = "doubleBrace";

	if (typeof specObj != 'undefined'){
		if (!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				name: "Колонна",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
			}
			if (par.type == "подкос") specObj[partName].name = "Подкос"
			if (par.type == "двойной подкос") specObj[partName].name = "Двойной подкос"
		}
		var name = Math.round(par.profSize) + "х" + Math.round(par.profSize) + " L=" + Math.round(poleLen) + " A=" + Math.round(par.topAngle * 180 / Math.PI * 10) / 10 + "гр."
		if (par.type == "подкос") {
			name = Math.round(maxHeight) + "х" + Math.round(length) + "х" + 8;
		}
		if (par.type == "двойной подкос") {
			name = Math.round(maxHeight) + "х" + Math.round(length) + "х" + plateDist;
		}
		
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}
	par.mesh.specId = partName + name;


	return par;
}

/**
	Логическая часть рассчета колонн, определяет их наличие

	@param: marshId

	Добавляет в объект следующие поля:
	@return marshMiddleFix - тип среднего косоура
	@return bot1, bot2, middle, top1, top2 - Наличие столбов
*/
function calcColumnLogicParams(par){

	var marshParams = getMarshParams(par.marshId);
	calcStringerConnection(par)
	par.marshMiddleFix = "нет";
	if (par.marshId == 1) {
		if (marshParams.stairAmt > 7) par.marshMiddleFix = params.marshMiddleFix_1;
	}
	if (par.marshId == 2) {
		if (marshParams.stairAmt > 7) par.marshMiddleFix = params.marshMiddleFix_2;
	}
	if (par.marshId == 3) {
		if (marshParams.stairAmt > 7) par.marshMiddleFix = params.marshMiddleFix_3;
	}
	if (par.marshMiddleFix !== 'нет') par.middleVisible = true;

	if (params.stairModel == "Г-образная с площадкой") {
		if (params.isColumn1 && par.marshId == 1 && par.topConnection) par.top2Visible = true;
		if (params.isColumn2 && par.marshId == 1 && par.topConnection) par.top1Visible = true;
		if (params.isColumn1 && par.marshId == 3 && par.botConnection) par.bot1Visible = true;
		if (params.isColumn2 && par.marshId == 3 && par.botConnection) par.bot2Visible = true;
	}
	if (params.stairModel == "Г-образная с забегом") {
		if (params.isColumn1 && par.marshId == 1 && par.topConnection) par.top2Visible = true;
		if (params.isColumn2 && par.marshId == 1 && par.topConnection) par.top1Visible = true;

		if (params.isColumn1 && par.marshId == 1 && !par.topConnection) par.top1Visible = true;

		// if (!params.isColumn1 && !params.isColumn2 && par.marshId == 1 && !par.topConnection) par.top1Visible = true;
	}
	if (params.stairModel == "П-образная трехмаршевая") {
		if (params.isColumn1 && par.marshId == 1 && par.topConnection) par.top2Visible = true;
		if (params.isColumn2 && par.marshId == 1 && par.topConnection) par.top1Visible = true;
		if (params.isColumn1 && par.marshId == 2 && par.botConnection && marshParams.botTurn !== 'забег') par.bot1Visible = true;
		if (params.isColumn2 && par.marshId == 2 && par.botConnection && marshParams.botTurn !== 'забег') par.bot2Visible = true;
		if (params.isColumn4 && par.marshId == 2 && par.topConnection) par.top2Visible = true;
		if (params.isColumn3 && par.marshId == 2 && par.topConnection) par.top1Visible = true;
		if (params.isColumn4 && par.marshId == 3 && par.botConnection && marshParams.botTurn !== 'забег') par.bot1Visible = true;
		if (params.isColumn3 && par.marshId == 3 && par.botConnection && marshParams.botTurn !== 'забег') par.bot2Visible = true;

		if (params.isColumn1 && marshParams.topTurn == 'забег' && !par.topConnection) par.top1Visible = true;
		// if (!params.isColumn1 && !params.isColumn2 && marshParams.topTurn == 'забег' && par.marshId == 1 && !par.topConnection) par.top1Visible = true;
		// if (!params.isColumn3 && !params.isColumn4 && marshParams.topTurn == 'забег' && par.marshId == 2 && !par.topConnection) par.top1Visible = true;
	}
	if (params.stairModel == "П-образная с забегом") {
		if (params.isColumn1 && par.marshId == 1 && par.topConnection) par.top2Visible = true;
		if (params.isColumn2 && par.marshId == 1 && par.topConnection) par.top1Visible = true;
		if (params.isColumn3 && par.marshId == 2 && par.topConnection) par.top1Visible = true;
		if (params.isColumn4 && par.marshId == 2 && par.topConnection) par.top2Visible = true;

		// if (par.marshId == 1 && !par.topConnection) par.top1Visible = true;
		// if (par.marshId == 2 && !par.topConnection) par.top1Visible = true;
		// if (par.marshId == 3 && !par.botConnection) par.bot2Visible = true;
	}
	if (params.stairModel == "П-образная с площадкой") {
		if (params.isColumn1 && par.marshId == 1) par.top2Visible = true;
		if (params.isColumn2 && par.marshId == 1) par.top1Visible = true;
		if (params.isColumn3 && par.marshId == 3) par.bot2Visible = true;
		if (params.isColumn4 && par.marshId == 3) par.bot1Visible = true;
	}

	if (!params.isColumn1 && !params.isColumn2 && marshParams.topTurn == 'забег' && par.marshId == 1 && !par.topConnection) par.top1Visible = true;
	if (!params.isColumn3 && !params.isColumn4 && marshParams.topTurn == 'забег' && par.marshId !== 1 && !par.topConnection) par.top1Visible = true;
	if (params.isColumn1 && marshParams.topTurn == 'забег' && par.marshId == 1 && !par.topConnection) {
		par.top1Visible = true;
		par.top2Visible = false;
	}
	if (params.isColumn3 && marshParams.topTurn == 'забег' && par.marshId !== 1 && !par.topConnection) {
		par.top1Visible = true;
		par.top2Visible = false;
	}
	if (params.platformTopColumn != 'нет' && marshParams.lastMarsh && marshParams.topTurn == 'площадка') {
		par.top1Visible = true;
		par.top2Visible = true;
	}
	return par;
}

/**
	Функция рассчитывает выступ косоура
	@param marshId - ид текущего марша

	@return stringerLedge выступ косоура на этом марше
*/
function getStringerLedge(marshId){
	var stringerLedge = 0;
	//Рассчитываем выступ косоура
	if (params.stairModel == "Г-образная с площадкой" || params.stairModel == "Г-образная с забегом") {
		stringerLedge = params.stringerLedge1;
	}
	if (params.stairModel == "П-образная трехмаршевая" || params.stairModel == "П-образная с площадкой" || params.stairModel == "П-образная с забегом") {
		if (marshId == 1) {
			stringerLedge = params.stringerLedge1;
		}
		if (marshId !== 1) {
			stringerLedge = params.stringerLedge2;
		}
	}
	return stringerLedge
}
/**
	Рассчитывает параметры столбов
	@param - pointsShape - массив точек косоура
	@param - marshId - ид текущего марша
	@param - unitsPos - Позиция текущего поворота

	Инфо:
	http://6692035.ru/dev/egorov/mono/materials/schema.png
	http://6692035.ru/dev/egorov/mono/materials/schema2.png

	@returns - рассчитанные параметры для всех столбов марша
*/
function calcColumnParams(par, stringerParams){
	var bot1 = {}; //Первый нижний столб
	var bot2 = {}; //Нижний столб на пересечении каркасов
	var middle = {}; //Средний столб находится на середине марша
	var top1 = {}; //Верхний столб на пересечении каркасов
	var top2 = {}; //Верхний столб на краю верхнего каркаса

	par.profSize = 100;
	par.columns = [];//Массив колонн

	var columnLogicParams = {
		marshId: par.marshId
	}
	calcColumnLogicParams(columnLogicParams);

	var columnPositionParams = {
		pointsShape: par.pointsShape,
		marshId: par.marshId
	}
	var columnPosition = calcColumnsPosition(columnPositionParams, stringerParams);
	var marshParams = getMarshParams(par.marshId);

	var stringerLedge = getStringerLedge(par.marshId);
	// Корректируем положение опоры для трубы
	var midLengthDelta = 0;
	var botLengthDelta = 0;
	var topLengthDelta = 0;// Фикс положения стойки для трубы
	if (params.model == 'труба') midLengthDelta = botLengthDelta = topLengthDelta = params.profileHeight -  params.sidePlateOverlay;
	//if (marshParams.botTurn == 'площадка' && params.model == 'труба') botLengthDelta = params.profileHeight - 7;
	//if (marshParams.topTurn == 'площадка' && params.model == 'труба') topLengthDelta = params.profileHeight - 7;
	if (params.stairModel == 'П-образная с площадкой' || params.stairModel == 'П-образная трехмаршевая') {
		// if (marshParams.botTurn == 'площадка' && params.model == 'труба') botLengthDelta = params.profileHeight - 7;
		// if (marshParams.topTurn == 'площадка' && params.model == 'труба') topLengthDelta = params.profileHeight - 7;
	}
	//Рассчитываем длинну столбов для 2 и 3 марша
	var marshPosY = 0;

	if (par.marshId !== 1 && par.unitsPos) {
		marshPosY = par.unitsPos.y;// - params.treadThickness - params.treadPlateThickness + (par.pointsShape[1].y - par.pointsShape[2].y);
		if (params.botFloorType === "черновой") {
			marshPosY += params.botFloorsDist;
		}

		// if (params.stairModel == 'П-образная трехмаршевая' && getMarshParams(1)) {
		// 	marshPosY = par.unitsPos.y;
		// }
		// if (params.stairModel !== 'П-образная с площадкой' && params.stairModel !== 'П-образная трехмаршевая') {
		// 	// if (marshParams.botTurn == 'забег') {//Корректируем положение на основе каркса
		// 	// 	marshPosY = par.unitsPos.y - params.treadThickness - params.treadPlateThickness - par.pointsShape[5].y;
		// 	// }
		// 	// if (marshParams.botTurn == 'площадка') {//Корректируем положение на основе каркса
		// 	// 	marshPosY = par.unitsPos.y - params.treadThickness - params.treadPlateThickness - par.pointsShape[2].y;
		// 	// }
		// }
		// if (marshParams.botTurn == 'забег' && par.marshId !== 1) marshPosY += marshParams.h;//Корректируем остальные столбы
		// if (marshParams.stairModel == "П-образная с забегом" && par.marshId == 2) marshPosY += marshParams.h * 2;
	}
	/**
		рассчитываем начальный столб(столб в начале марша)
		BOT1
	*/
	{
		bot1.type = 'колонна';
		bot1.isVisible = columnLogicParams.bot1Visible;//Устанавливаем видимость Столбов
		if (bot1.isVisible) {
			var pStart = par.pointsShape[0];
			var pEnd = par.pointsShape[1];
			bot1.topAngle = calcAngleX1(pEnd, pStart);
			bot1.position = newPoint_xy(columnPosition.bot1, 0,  -botLengthDelta / Math.cos(bot1.topAngle));//copyPoint(pEnd);
			//
			// if (par.columnHoles.bot) {
			// 	bot1.position = newPoint_xy(pEnd, par.columnHoles.bot.bot1Hole.x + params.metalThickness, 0);
			// }
			//
			// if (params.stairModel == 'П-образная с площадкой') {
			// 	bot1.position.x -= params.stringerThickness / 2 + params.flanThickness;// + params.platformLength_1 / 2 - 22;//22 отступ отверстия от края
			// }
			//
			if (params.stairModel == 'П-образная с площадкой' && !columnLogicParams.botConnection) {
				bot1.rotation = Math.PI / 2;
			}
			if (!columnLogicParams.botConnection && params.stairModel == 'П-образная с площадкой') {
				bot1.position.z = (params.M / 2 + params.stringerLedge2 - 220/2)*turnFactor;
			}
			var botCarcasDeltaY = pEnd.y;//корректируем положение для корректной длинны стоек
			if (par.marshId !== 1 && marshParams.botTurn == 'площадка') {
				botCarcasDeltaY = 0;
			}
			bot1.length = -botCarcasDeltaY + bot1.position.y + marshPosY - 0.02 - 3; //2 зазора: от фланца до колонны и от фланца до косоура
		}
	}
	/**
		рассчитываем второй столб
		столб в центре пересечения каркасов маршей(если выбран нужный тип расположения столбов)
		BOT2
	*/
	{
		bot2.type = 'колонна';
		bot2.isVisible = columnLogicParams.bot2Visible;//Устанавливаем видимость Столбов
		if (bot2.isVisible) {
			var pStart = par.pointsShape[0];
			var pEnd = par.pointsShape[1];
			bot2.topAngle = calcAngleX1(pEnd, pStart);
			bot2.position = newPoint_xy(columnPosition.bot2, 0,  -botLengthDelta / Math.cos(bot2.topAngle));//copyPoint(pEnd);
			if (params.stairModel == 'П-образная с площадкой' && params.model !== 'труба') {
				bot2.rotation = Math.PI / 2;
			}
			if (params.model == 'труба' && !columnLogicParams.botConnection) {
				bot2.rotation = Math.PI / 2;
			}
			var botCarcasDeltaY = pEnd.y;
			if (par.marshId !== 1 && marshParams.botTurn == 'площадка') {
				botCarcasDeltaY = 0;
			}
			bot2.length = -botCarcasDeltaY + bot2.position.y + marshPosY - 0.02 - 3; //2 зазора: от фланца до колонны и от фланца до косоура
		}
	}
	/**
		рассчитываем средний столб(столб в середине марша)
		MIDDLE
	*/
	{
		middle.type = columnLogicParams.marshMiddleFix;
		middle.isVisible = columnLogicParams.middleVisible;//Устанавливаем видимость Столбов
		if (middle.isVisible) {
			var pStart = par.pointsShape[0];
			var pEnd = par.pointsShape[par.pointsShape.length - 1];
			middle.topAngle = calcAngleX1(pStart, pEnd);
			middle.position = newPoint_xy(pStart, (pEnd.x - pStart.x) / 2, (pEnd.y - pStart.y) / 2 - midLengthDelta / Math.cos(middle.topAngle));
			middle.length = middle.position.y - 0.02 - 3; //2 зазора: от фланца до колонны и от фланца до косоура
			middle.position.y -= 0.01;

			if (middle.type == 'колонна') {
				if (par.marshId !== 1) {
					middle.length = middle.position.y + marshPosY - 0.02; //2 зазора: от фланца до колонны и от фланца до косоура
					if (marshParams.botTurn == 'забег') {
						middle.length = middle.position.y + marshParams.h * 2 + marshPosY;
					}
				}
			}
			if (middle.type == 'подкос') {
				middle.length = 0;
				if (turnFactor == -1) {
					middle.rotation = Math.PI;
					middle.topAngle *= -1 ;//Math.PI * turnFactor;
				}
			}
		}
	}
	/**
		рассчитываем предпоследний столб
		столб в центре пересечения каркасов маршей(если выбран нужный тип расположения столбов)
		TOP1
	*/
	{
		top1.type = 'колонна';
		if (!columnLogicParams.topConnection && marshParams.topTurn == 'забег' && par.marshId == 1) top1.type = params.isColumn1 ? 'колонна' : 'двойной подкос';
		if (!columnLogicParams.topConnection && marshParams.topTurn == 'забег' && par.marshId == 2) top1.type = params.isColumn3 ? 'колонна' : 'двойной подкос';
		top1.isVisible = columnLogicParams.top1Visible;//Устанавливаем видимость Столбов
		
		if (top1.isVisible) {
			var pStart = par.pointsShape[par.pointsShape.length - 1];
			var pEnd = par.pointsShape[par.pointsShape.length - 2];
			var dist = distance(pStart, pEnd);
			/*
			if (dist < 220 * 2 && columnLogicParams.topConnection) {
					top1.isVisible = false;
			}
			*/
			if (params.model == 'труба' && marshParams.topTurn == 'забег') {
				if (!stringerParams.isKinkTop) {
					var pEnd = par.pointsShape[par.pointsShape.length - 1];
					var ang1 = calcAngleX1(par.pointsShape[0], pEnd);
					var pStart = polar(pEnd, ang1, -(220 + 10) / 2);
				}
			}
			top1.topAngle = calcAngleX1(pStart, pEnd);
			//Позиция рассчитывается в фун-ии calcColumnsPosition
			var localPosX = columnPosition.top1.x - pStart.x;//Позиция учитывая только пластину
			var localPos = localPosX * Math.cos(top1.topAngle);
			top1.position = newPoint_xy(pStart, localPos, localPos * Math.tan(top1.topAngle) - topLengthDelta / Math.cos(top1.topAngle) - 0.02);//Не уверен в этом рещении, обдумать
			
			top1.length = top1.position.y + marshPosY - 0.02 - 3; //2 зазора: от фланца до колонны и от фланца до косоура
			
			if (!columnLogicParams.topConnection && params.stairModel == 'П-образная с площадкой' && params.model == 'труба') {
				top1.rotation = Math.PI / 2;
			}
			
			if (top1.type == 'двойной подкос') {
				top1.position.y -= 0.01;
				top1.length = 0;

				if (turnFactor == -1) {
					top1.rotation = Math.PI;
					top1.topAngle *= -1 ;
				}
			}
			top1.position.z = 0;
		}
	}
	/**
		рассчитываем конечный столб
		столб в конце каркаса марша
		TOP2
	*/
	{
		top2.type = 'колонна';
		top2.isVisible = columnLogicParams.top2Visible;//Устанавливаем видимость Столбов
		if (top2.isVisible) {
			pStart = par.pointsShape[par.pointsShape.length - 1];
			pEnd = par.pointsShape[par.pointsShape.length - 2];
			if (params.model == 'труба' && stringerParams.isKinkTop) {
				let tempPStart = par.pointsShape[par.pointsShape.length - 2];
				let tempPEnd = par.pointsShape[par.pointsShape.length - 3];
				if (distance(tempPEnd, tempPStart) > 220) {//200 размер фланца + 20 зазор с каждой стороны по 10
					pStart = tempPStart;
				 	pEnd = tempPEnd;
				}
			}
			top2.topAngle = calcAngleX1(pStart, pEnd);
			var localPosX = columnPosition.top2.x - pStart.x;//Позиция учитывая только пластину

			var localPos = localPosX * Math.cos(top2.topAngle);
			top2.position = newPoint_xy(pStart, localPos, localPos * Math.tan(top2.topAngle) - topLengthDelta / Math.cos(top2.topAngle) - 0.02);//Не уверен в этом рещении, обдумать

			if (!columnLogicParams.topConnection && params.stairModel == 'П-образная с площадкой') {
				top2.position.x = columnPosition.top1.x;
				top2.position.z = (params.M / 2 + params.stringerLedge2 - 220/2)*turnFactor;
				top2.rotation = Math.PI / 2;
			}
			top2.length = top2.position.y + marshPosY - 0.02 - 3; //2 зазора: от фланца до колонны и от фланца до косоура
		}
	}

	par.columns = [bot1,bot2,middle,top1,top2];
	return par;
}

/***   ФУНКЦИИ ВЕРСИИ 4.0   ***/

/**
функция отрисовывает прямоугольную горизонтальную пластину с отверстиями. Используется для подложек ступеней и горизонтальных пластин каркаса, к которым крепятся подложки. Пластины каркаса отрисовываются с болтами для крепления подложек
*@params step - шаг ступени
*@params type - тип детали: carcasPlate || treadPlate
*/
function drawHorPlate(par) {

	var gap = 1; //зазор от торца пластины до вертикальных пластин косоура

	//задаем параметры детали
	if (par.type == "carcasPlate") {
		par.cornerRad = 0;
		if (par.frontOffset !== 0) par.frontOffset = params.metalThickness + gap;
		if (par.isTurn2) par.frontOffset = gap; //если передняя пластина это фланец соединения косоуров
		par.width = params.stringerThickness - params.metalThickness * 2;
		par.thk = params.metalThickness - 0.01;
	}

	if (par.type == "treadPlate") {
		par.cornerRad = 20;
		par.frontOffset = -30; //нависание подложки над косоуром
		par.width = params.M / 2;
		//par.width = 450;
		par.thk = params.treadPlateThickness;
	}

	par.height = par.step;
	if (par.frontOffset !== 0) par.height += - par.frontOffset - gap;

	par.mesh = new THREE.Object3D();


	//создаем контур пластины для создания Object3D
	var p0 = { x: 0, y: 0 };
	var p1 = newPoint_xy(p0, -par.width / 2, par.frontOffset);
	var p2 = newPoint_xy(p1, 0, par.height);
	var p3 = newPoint_xy(p2, par.width, 0);
	var p4 = newPoint_xy(p1, par.width, 0);

	var points = [p1, p2, p3, p4]

	if (par.isTurn2Top) par.dxfBasePoint.x -= params.stringerThickness;

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		radOut: par.cornerRad, //радиус скругления внешних углов

	}
	if (par.type == "carcasPlate") {
		var shiftXY = par.height / 2 - par.width / 2;//корректировка положения после поворота
		shapePar.drawing = {
			name: "Верхняя пластина каркаса под ступень",
			group: "carcasPlates",
			baseLine: {
				p1: p1,
				p2: p2
			},
			marshId: par.marshId,
			basePoint: newPoint_xy(par.pointCurrentSvg, -par.pointStartSvg.x + shiftXY - 100, -par.pointStartSvg.y + shiftXY + par.width + 50),
		}
	}
    if (par.type == "treadPlate" && par.isSvg) {
        var marshParams = getMarshParams(par.marshId);
		var count = marshParams.stairAmt;
		if (marshParams.topTurn == "пол") count -= 1;
        shapePar.drawing = {
            name: "Подложка марша: кол-во " + count + " шт.",
            group: "carcasFlans",
            marshId: par.marshId,
        }
        if (par.isBotPlatform) shapePar.drawing.name = "Подложка площадки: кол-во 1шт.";
		if (par.isTopLast) shapePar.drawing.name = "Последняя подложка верхнего марша: кол-во 1шт.";
    }

	var shape = drawShapeByPoints2(shapePar).shape;

	//отверстия для болтов и прямогуольный вырез в центре детали
	var holesPar = {
		hasTrapHole: par.hasTrapHole,
		step: par.step,
		holeRad: 6.5,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
	}
	if (par.turnSteps)
		holesPar.edgeAngle = par.turnSteps.edgeAngle;
	if (par.dStep) {
		holesPar.step += par.dStep;
		//второй прямогуольный вырез в пластине второй забежной ступени для закрепления фланца
		if (par.isTurn2Top) {
			holesPar.isTurn2Top = par.isTurn2Top;
			holesPar.dStep = -par.dStep + par.backOffHoles;
		}
	}

	//второй прямогуольный вырез в пластине для закрепления фланца
	if (par.type == "carcasPlate" && par.isBotPlatform) {
		holesPar.isTurn2Top = par.isBotPlatform;
		holesPar.dStep = -50;
	}

	if (par.basePointShiftX) {
		holesPar.step += par.basePointShiftX; //уменьшаем подложку если надо ее сдвинуть от базовой точки
		if (par.type == "carcasPlate") holesPar.basePointShiftX = par.basePointShiftX; //сдвигаем отверстия в верхней пластине
	}
	if (par.backOffHoles) holesPar.step -= par.backOffHoles;


	if (par.isTurn2) {
		holesPar.turnSteps = par.turnSteps;
		holesPar = drawTurn2TreadPlateHoles(holesPar);
	}
	else {
		holesPar = drawTreadPlateHoles(holesPar);
	}


	for (var i = 0; i < holesPar.holes.length; i++) {
		shape.holes.push(holesPar.holes[i]);
	}


	//отверстия для шурупов крепления ступени

	if (par.type == "treadPlate") {
		var holeOffset = 20;

		var center1 = newPoint_xy(p1, holeOffset, holeOffset);
		var center2 = newPoint_xy(p2, holeOffset, -holeOffset);
		var center3 = newPoint_xy(p3, -holeOffset, -holeOffset);
		var center4 = newPoint_xy(p4, -holeOffset, holeOffset);
		
		//Отмечаем тип зенковки, для свг
		center1.holeData = {zenk: 'no'};
		center2.holeData = {zenk: 'no'};
		center3.holeData = {zenk: 'no'};
		center4.holeData = {zenk: 'no'};
		
		par.holes = [center1, center2, center3, center4];
		par.holeRad = 5;

		var screwPar = {
			id: "screw_6x32",
			description: "Крепление ступеней",
			group: "Ступени"
		}
		
		for (var i = 0; i < par.holes.length; i++) {
			addRoundHole(shape, par.dxfArr, par.holes[i], par.holeRad, par.dxfBasePoint);

			//саморезы
			if(params.stairType !== 'нет') {
				var screw = drawScrew(screwPar).mesh;
				screw.position.x = par.holes[i].y;
				screw.position.z = par.holes[i].x;
				par.mesh.add(screw)
			}
		}
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

	par.mesh.add(plate);


	//болты
	if (par.type == "treadPlate") {
		var boltPar = {
			type: "подложка сварной",
			holesCenter: holesPar.holesCenter,
		}

		drawPlateBolts(boltPar);
		par.mesh.add(boltPar.mesh);
	}

	//сохраняем данные для спецификации
	if (par.type == "treadPlate") {
		var partName = "treadPlate";
		if (typeof specObj != 'undefined'){
			if (!specObj[partName]){
				specObj[partName] = {
					types: {},
					amt: 0,
					area: 0,
					name: "Подложка",
					metalPaint: true,
					timberPaint: false,
					division: "metal",
					workUnitName: "amt", //единица измерения
					group: "Каркас",
				}
			}
			var name = Math.round(par.width) + "х" + Math.round(par.height) + "х" + Math.round(par.thk);
			var area = par.width * par.height / 1000000;
			if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
			if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
			specObj[partName]["amt"] += 1;
			specObj[partName]["area"] += area;
		}
		par.mesh.specId = partName + name;
	}
	return par;

} //end of drawHorPlate

/**
функция отрисовывает прямоугольную горизонтальную пластину с отверстиями. Используется для подложек ступеней и горизонтальных пластин каркаса, к которым крепятся подложки. Пластины каркаса отрисовываются с болтами для крепления подложек
функция применяется для площадок, где на разбить одну большую подложку на несколько маленьких
*@params step - шаг ступени
*@params type - тип детали: carcasPlate || treadPlate
*/

function drawHorPlates(par) {


	var gap = 1; //зазор от торца пластины до вертикальных пластин косоура
	var gapPlates = 20; //зазор между пластинами

	//задаем параметры детали
	if (par.type == "carcasPlate") {
		par.cornerRad = 0;
		if (par.frontOffset !== 0) par.frontOffset = params.metalThickness + gap;
		if (par.isTurn2) par.frontOffset = params.flanThickness + gap; //если передняя пластина это фланец соединения косоуров
		par.width = params.stringerThickness - params.metalThickness * 2;
		par.thk = params.metalThickness;
	}

	if (par.type == "treadPlate") {
		par.cornerRad = 20;
		par.frontOffset = -par.frontOff; //нависание подложки над косоуром
		par.width = params.M / 2;
		//par.width = 450;
		par.thk = params.treadPlateThickness;
	}

	//определяем общую длину подложки или пластины
	par.height = par.step;
	if (par.frontOffset !== 0) par.height += par.frontOff - gap;
	if (par.basePointShiftX) par.height += par.basePointShiftX;
	if (par.backOffHoles) par.height -= par.backOffHoles;

	//разбиваем общую длину на несколько подложек
	var count = 1;
	count = Math.floor(par.height / 300);
	if (count == 0) count = 1;
	par.height = ((par.height - gapPlates * (count - 1)) / count);


	par.mesh = new THREE.Object3D();


	for (var j = 0; j < count; j++) {
		//создаем контур пластины для создания Object3D
		if (!(par.type == "carcasPlate" && j > 0))//если это верхняя пластина, то создаем всего 1 shape
		{
			var p0 = { x: 0, y: 0 };
			var p1 = newPoint_xy(p0, -par.width / 2, par.frontOffset);
			if (j > 0) p1.y -= par.frontOffset;
			var p2 = newPoint_xy(p1, 0, par.height);
			if (par.type == "carcasPlate") p2 = newPoint_xy(p1, 0, par.step - par.frontOffset - gap);
			var p3 = newPoint_xy(p2, par.width, 0);
			var p4 = newPoint_xy(p1, par.width, 0);

            var points = [p1, p2, p3, p4]

            var dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, -(distance(p2, p1) + 150) * j)

			//создаем шейп
			var shapePar = {
				points: points,
				dxfArr: par.dxfArr,
                dxfBasePoint: dxfBasePoint,
				radOut: par.cornerRad, //радиус скругления внешних углов

			}
			if (par.type == "carcasPlate") {
				if (par.pointCurrentSvg) {
					var height = par.step - par.frontOffset - gap;
					var shiftXY = height / 2 - par.width / 2; //корректировка положения после поворота
					shapePar.drawing = {
						name: "Верхняя пластина каркаса под ступень",
						group: "carcasPlates",
						baseLine: {
							p1: p1,
							p2: p2
						},
						marshId: par.marshId,
						basePoint: newPoint_xy(par.pointCurrentSvg,
							-par.pointStartSvg.x + shiftXY - 100,
							-par.pointStartSvg.y + shiftXY + par.width + 50),
					}
				}
				if (par.drawing) {
					var shiftXY = par.height / 2 - par.width / 2; //корректировка положения после поворота
					shapePar.drawing = par.drawing;
					shapePar.drawing.baseLine = { p1: p1, p2: p2 };
					shapePar.drawing.basePoint = { x: shiftXY, y: shiftXY };
				}
			}
			
		    if (par.type == "treadPlate") {
		        if (j == 0) {
		            shapePar.drawing = {
		                name: "Подложка площадки: кол-во " + count + " шт.",
		                group: "carcasFlans",
		                marshId: par.marshId,
		            }
		        }
		    }
		    var shape = drawShapeByPoints2(shapePar).shape;
		}


		//отверстия для болтов и прямогуольный вырез в центре детали
		var holesPar = {
			hasTrapHole: par.hasTrapHole,
			step: par.step,
			holeRad: 6.5,
			dxfArr: par.dxfArr,
			dxfBasePoint: dxfBasePoint,
			basePointShiftX: 0
		}


		if (j == 0) {
			holesPar.step = par.height - par.frontOff;
		}

		if (j > 0) {
			holesPar.step = par.height;
			if (par.type == "carcasPlate")
				holesPar.basePointShiftX = -(par.height + gapPlates) * j + par.frontOff;
		}

		if (par.basePointShiftX && par.type == "carcasPlate") {
			holesPar.basePointShiftX += par.basePointShiftX; //сдвигаем отверстия в верхней пластине
		}



		holesPar = drawTreadPlateHoles(holesPar);

		for (var i = 0; i < holesPar.holes.length; i++) {
			shape.holes.push(holesPar.holes[i]);
		}


		//отверстия для шурупов крепления ступени
		if (par.type == "treadPlate") {
			var holeOffset = 20;

			var center1 = newPoint_xy(p1, holeOffset, holeOffset);
			var center2 = newPoint_xy(p2, holeOffset, -holeOffset);
			var center3 = newPoint_xy(p3, -holeOffset, -holeOffset);
			var center4 = newPoint_xy(p4, -holeOffset, holeOffset);

			//Отмечаем тип зенковки, для свг
			center1.holeData = { zenk: 'no' };
			center2.holeData = { zenk: 'no' };
			center3.holeData = { zenk: 'no' };
			center4.holeData = { zenk: 'no' };

			par.holes = [center1, center2, center3, center4];
			par.holeRad = 5;

			for (var i = 0; i < par.holes.length; i++) {
				addRoundHole(shape, par.dxfArr, par.holes[i], par.holeRad, dxfBasePoint);
			}
		}


		if (!(par.type == "carcasPlate" && j !== count - 1))//если это верхняя пластина, то создаем всего 1 mesh
		{
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
			if (par.type == "treadPlate") {
				plate.position.x += (par.height + gapPlates) * j;
				if (j > 0) plate.position.x += par.frontOffset;

				var screwPar = {
					id: "screw_6x32",
					description: "Крепление ступеней",
					group: "Ступени"
				}
				
				if(params.stairType !== 'нет'){
					for (var i = 0; i < par.holes.length; i++) {
							//саморезы
							var screw = drawScrew(screwPar).mesh;
							screw.position.x = par.holes[i].y + (par.height + gapPlates) * j;
							screw.position.z = par.holes[i].x ;
							if (j > 0) screw.position.x += par.frontOffset;
							par.mesh.add(screw)
						}
				}
			}

			par.mesh.add(plate);
		}


		//болты
		if (par.type == "treadPlate") {
			var boltPar = {
				type: "подложка сварной",
				holesCenter: holesPar.holesCenter,
			}

			drawPlateBolts(boltPar);
			boltPar.mesh.position.x += (par.height + gapPlates) * j;
			if (j > 0) boltPar.mesh.position.x += par.frontOffset;
			par.mesh.add(boltPar.mesh);
		}

	
	
		//сохраняем данные для спецификации
		if (par.type == "treadPlate") {
			var partName = "treadPlate";
			if (typeof specObj != 'undefined'){
				if (!specObj[partName]){
					specObj[partName] = {
						types: {},
						amt: 0,
						area: 0,
						name: "Подложка",
						metalPaint: true,
						timberPaint: false,
						division: "metal",
						workUnitName: "amt", //единица измерения
						group: "Каркас",
					}
				}
				var name = Math.round(par.width) + "х" + Math.round(par.height) + "х" + Math.round(par.thk);
				var area = par.width * par.height / 1000000;
				if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
				if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
				specObj[partName]["amt"] += 1;
				specObj[partName]["area"] += area;
			}
			par.mesh.specId = partName + name;
		}
	} //конец цикла перебора деталей

	return par;

} //end of drawHorPlates


/** функция отрисовывает прямоугольные вертикальные пластины для сварного косоура
*@params isLong - является ли данная пластина длиной
*@params marshId
*@params stairAngle1
*@params stringerWidth
*@params dxfArr
*@params dxfBasePoint
*/

function drawFrontPlate(par) {



	par.width = params.stringerThickness - params.metalThickness * 2;

	//высокая пластина с технологическим вырезом
	if (par.isLong) {
		par.height += (par.stringerWidth - params.metalThickness) / Math.cos(par.stairAngle1) - 10;
	}

	if (!par.isLong && par.plateId != 1) par.height += 20;

	var p1 = { x: 0, y: 0 };
	var p2 = newPoint_xy(p1, 0, -par.height);
	var p3 = newPoint_xy(p2, par.width, 0);
	var p4 = newPoint_xy(p1, par.width, 0);

	var points = [p1, p2, p3, p4]

	//технологический вырез
	if (par.isLong) {
		p31 = newPoint_xy(p3, 0, 40);
		p32 = newPoint_xy(p31, -65, 0);
		p41 = newPoint_xy(p31, 0, 60);
		p42 = newPoint_xy(p32, 0, 60);

		points = [p1, p2, p3, p31, p32, p42, p41, p4]
	}

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: par.dxfArr,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, par.height),
	}
	
	if(!par.pointStartSvg) par.pointStartSvg = {x:0, y:0} //костыль чтобы не было фатальной ошибки
	shapePar.drawing = {
		name: "Вертикальные передняя пластина каркаса",
		group: "carcasPlates",
		marshId: par.marshId,
		basePoint: newPoint_xy(par.pointCurrentSvg, -par.pointStartSvg.x - par.width, -par.pointStartSvg.y + par.height + 150 + par.width),
	}
	if (par.isBack)
		shapePar.drawing.basePoint = newPoint_xy(par.pointCurrentSvg, -par.pointStartSvg.x + 150, -par.pointStartSvg.y);

	var shape = drawShapeByPoints2(shapePar).shape;

	var extrudeOptions = {
		amount: params.metalThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var material = params.materials.metal;

	var plateObj = new THREE.Object3D();

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var plate = new THREE.Mesh(geom, material);
	plateObj.add(plate);

	par.mesh = plateObj;

	return par;

} //end of drawFrontPlate


/** функция отрисовывает прямоугольную заднюю пластину сварного короба.
	*/

function drawBackPlate(par) {

	par.mesh = new THREE.Object3D();

	var ang = calcAngleX1(par.pStart, par.pEnd);

	var height = par.stringerWidth;
	var width = distance(par.pEnd, par.pStart);

	par.pMiddle = newPoint_xy(par.pStart, (par.pEnd.x - par.pStart.x) / 2, (par.pEnd.y - par.pStart.y) / 2);

	////создаем контур пластины для выгрузки в dxf
	//var p1 = copyPoint(par.pStart);
	//var p2 = polar(p1, ang + Math.PI / 2, par.stringerWidth);
	//var p4 = copyPoint(par.pEnd);
	//var p3 = polar(p4, ang + Math.PI / 2, par.stringerWidth);

	//var points = [p1, p2, p3, p4];

	////создаем шейп
	//var shapePar = {
	//	points: points,
	//	dxfArr: par.dxfArr,
	//	dxfBasePoint: polar(par.dxfBasePoint, ang - Math.PI / 2, par.stringerWidth + 100),
	//}

	//var shapeDxf = drawShapeByPoints2(shapePar);

	//создаем контур пластины для создания Object3D
	var p0 = { x: 0, y: 0 };
	var p1 = newPoint_xy(p0, 0, -height / 2);
	var p2 = newPoint_xy(p1, 0, height);
	var p3 = newPoint_xy(p2, width, 0);
	var p4 = newPoint_xy(p1, width, 0);

	var points = [p1, p2, p3, p4];
	par.pointsShape = points;

	//создаем шейп
	var shapePar = {
		points: points,
		//dxfArr: [],
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
	}
	if (true) {
		shapePar.drawing = {
			name: "Нижняя пластина каркаса",
			group: "carcasPlates",
			marshId: par.marshId,
			basePoint: newPoint_xy(par.pointCurrentSvg, -par.pointStartSvg.x, -par.pointStartSvg.y),
		}
		if (ang !== 0) {
			shapePar.drawing.baseLine = {p1: par.pStart, p2: par.pEnd}
			shapePar.drawing.isTurned = true;
			shapePar.drawing.basePoint.x -= width / 2  - width / 2 * Math.cos(ang) - 100
			shapePar.drawing.basePoint.y += width / 2 * Math.sin(ang) - 100
			if (par.topPlate) shapePar.drawing.basePoint.x += 100;
		}
		if (ang == 0) {
			shapePar.drawing.basePoint.x -= width;
			shapePar.drawing.basePoint.y -= 100;
		}
	}

    par.stringerShape = drawShapeByPoints2(shapePar).shape;

    //var dxf = copyPoint(par.dxfBasePoint);
    //par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, par.pStart.x, par.pStart.y);

	//отверстия под фланец колонны
	if (par.isHolesColon) {
		var pcenter = newPoint_xy(p0, width / 2, 0);
		drawHolesColumn(par, pcenter, ang);
	}

	if (par.isHolesColonPlatform) {
		var dxPlatform = params.M / 2;
		if (params.stairModel == "П-образная с площадкой") {
			dxPlatform = (params.platformLength_1 + 54) / 2;
			if (!par.topConnection && params.model == "сварной") dxPlatform -= par.stringerLedge + 100;
			if (!par.topConnection && params.model == "труба") dxPlatform = -par.stringerLedge - params.stringerThickness / 2 - params.flanThickness;
		}
		par.columns = {};
		// Отверстия под опоры!
		if (par.isHolesColonPlatform.top1Visible) {
			var pcenter = newPoint_xy(par.columnPosition.top1, -par.pStart.x, -par.pStart.y);
			drawHolesColumn(par, pcenter, ang);
		}

		if (par.isHolesColonPlatform.top2Visible) {
			var pcenter = newPoint_xy(par.columnPosition.top2, -par.pStart.x, -par.pStart.y);
			drawHolesColumn(par, pcenter, ang);
		}

		if (par.isHolesColonPlatform.bot2Visible) {
			var pcenter = newPoint_xy(par.columnPosition.bot2, -par.pStart.x, -par.pStart.y);
			drawHolesColumn(par, pcenter, ang);
		}

		if (par.isHolesColonPlatform.bot1Visible) {
			var pcenter = newPoint_xy(par.columnPosition.bot1, -par.pStart.x, -par.pStart.y);
			drawHolesColumn(par, pcenter, ang);
		}
    }



	var extrudeOptions = {
		amount: params.metalThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};


	var geom = new THREE.ExtrudeGeometry(par.stringerShape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var plate = new THREE.Mesh(geom, params.materials.metal);
	plate.rotation.x = -Math.PI / 2;
	plate.rotation.y = -ang;

	par.mesh.add(plate);

	return par;

} //end of drawBackPlate

/**
	Функция рассчитывает положения колонн
	@param {array} pointsShape - массив точек каркаса
	@param {number} marshId - ид марша

	@return {Object} bot1 - координата первой нижней опоры
	@return {Object} bot2 - координата второй нижней опоры
	@return {Object} top1 - координата предпоследней верхней поры
	@return {Object} top2 - координата последней верхней опоры
*/

function calcColumnsPosition(par, stringerParams){

	var columnPosition = {};
	var marshParams = getMarshParams(par.marshId);

	// задаем начальную и конечную точку поворота
	var startPoint = par.pointsShape[0];
	var endPoint = par.pointsShape[1];
	if (params.stairModel == 'П-образная с площадкой') {
		var startPoint = par.pointsShape[1];
		var endPoint = par.pointsShape[2];
	}
	if (params.model == 'труба') {
		var startPoint = par.pointsShape[0];
		var endPoint = par.pointsShape[1];
	}

	var stringerLedge = getStringerLedge(par.marshId); // получаем выступ косоура
	calcStringerConnection(par);

	var dxPlatform = params.M / 2;
	if (params.stairModel == "П-образная с площадкой") {
		dxPlatform = params.platformLength_1 / 2;
		if (!par.topConnection && params.model == "сварной") dxPlatform -= stringerLedge;
		if (!par.topConnection && params.model == "труба") dxPlatform = -stringerLedge - params.stringerThickness / 2 - params.flanThickness;
	}

	// bot2
	{
		// columnPosition.bot2
		columnPosition.bot2 = newPoint_xy(endPoint, dxPlatform + stringerLedge - params.metalThickness, 0);
		
		if (params.stairModel == 'П-образная с площадкой' && !par.botConnection) {
			//columnPosition.bot2 = newPoint_xy(startPoint, -params.stringerThickness / 2 - params.flanThickness, 0);
			columnPosition.bot2 = newPoint_xy(startPoint, -params.stringerThickness / 2, 0);
			columnPosition.bot2.z = params.flanThickness;
		};
		if (params.stairModel == 'П-образная с площадкой' && par.botConnection) {
			// columnPosition.bot2 = newPoint_xy(startPoint, -params.stringerThickness / 2 - params.flanThickness * 4 - 2.5 - params.platformLength_1 / 2 + 220 / 2, 0); // 2.5 пока-что подогнано
			//columnPosition.bot2 = newPoint_xy(startPoint, -params.stringerThickness / 2 - params.flanThickness,0);//-params.stringerThickness / 2 - params.flanThickness * 4 - 2.5 - params.platformLength_1 / 2 + 220 / 2, 0); // 2.5 пока-что подогнано
			columnPosition.bot2 = newPoint_xy(startPoint, -params.stringerThickness / 2,0);
			columnPosition.bot2.z = params.flanThickness;
		};
		if (params.stairModel == 'П-образная с площадкой' && par.botConnection && params.model == 'труба') {
			columnPosition.bot2 = newPoint_xy(endPoint, params.platformLength_1 / 2 - 1 + params.flanThickness * 2 + params.metalThickness, 0);//FIX ! 1- подогнано
		};
		if (params.stairModel == 'П-образная с площадкой' && !par.botConnection && params.model == 'труба') {
			columnPosition.bot2 = newPoint_xy(endPoint, -params.profileWidth / 2 + 1 - params.flanThickness * 2, 0);//FIX ! 1- подогнано
		};
	}
	// bot1
	{
		// columnPosition.bot1
		columnPosition.bot1 = newPoint_xy(endPoint, 220 / 2  - params.metalThickness, 0);
		if (params.stairModel == 'П-образная с площадкой' && !par.botConnection) {
			//columnPosition.bot1 = newPoint_xy(startPoint, -params.stringerThickness / 2 - params.flanThickness, 0);
			columnPosition.bot1 = newPoint_xy(startPoint, -params.stringerThickness / 2, 0);
		};
		if (params.stairModel == 'П-образная с площадкой' && par.botConnection) {
			columnPosition.bot1 = newPoint_xy(startPoint, -params.stringerThickness / 2 - params.flanThickness * 4 - 2.5 - params.platformLength_1 / 2 + 220 / 2, 0); // 2.5 пока-что подогнано
		};

		if (params.stairModel == 'П-образная с площадкой' && !par.botConnection && params.model == 'труба') {
			columnPosition.bot1 = newPoint_xy(columnPosition.bot2, 0, 0);
		};
		if (params.stairModel == 'П-образная с площадкой' && par.botConnection && params.model == 'труба') {
			columnPosition.bot1 = newPoint_xy(endPoint, 220 / 2, 0);
		};
	}
	// top1
	{
		// columnPosition.top1
		startPoint = par.pointsShape[par.pointsShape.length - 1];
		endPoint = par.pointsShape[par.pointsShape.length - 2];		
		let width = distance(startPoint, endPoint);
		let ang = calcAngleX1(startPoint, endPoint);
		let startOffset = width - (dxPlatform + stringerLedge) / Math.cos(ang) + 10;//10 зазор от края

		if (startOffset < 220 / 2) {// в случае если отступ получается меньше размера фланца, задаем его принудительно
			 startOffset = 220 / 2 + 10;// 220 размер фланца 10 зазор от края
		}
		columnPosition.top1 = newPoint_xy(startPoint, startOffset, 0);
		//Колонна располагается в середие поворота, т.е.
		/*
			startPoint - точка начала Пластины
			endPoint - точка конца пластинцы
			startOffset - отступ от начала пластины 
			width - размер последней пластины
			dxPlatform - отступ до середины поворота
			stringerLedge - выступ косоура
			
			т.е. в нашем случае width - (dxPlatform + stringerLedge) / Math.cos(ang)
			это отступ от начала платформы до середины поворота
		*/ 
		
		if (params.stairModel == 'П-образная с площадкой' && !par.topConnection) {
			var stringerThickness = params.stringerThickness;
			//columnPosition.top1 = newPoint_xy(startPoint, width - (dxPlatform + stringerLedge) + params.metalThickness / 2 + params.stringerThickness / 2, 0);
			columnPosition.top1 = newPoint_xy(startPoint, width - (dxPlatform + stringerLedge) + params.stringerThickness / 2, 0);
		    if (params.model == 'труба') {
				columnPosition.top1 = newPoint_xy(endPoint, 7 + 5 + params.profileWidth / 2, 0);
			}
		}
		if (params.stairModel == 'П-образная с площадкой' && par.topConnection) {
			columnPosition.top1 = newPoint_xy(endPoint, -params.platformLength_1 / 2 + 10, 0);//10 зазор от края(там где скос вниз марша, чтобы фланец не пересекался)
		}
		if (!par.topConnection && params.stairModel !== 'П-образная с площадкой') {
			columnPosition.top1 = newPoint_xy(startPoint, (width / 2) / Math.cos(ang), 0);
		}
		if (params.model == 'труба' && marshParams.topTurn == 'забег') {
			columnPosition.top1 = newPoint_xy(startPoint, 220 / Math.cos(ang) + 10, 0);//Зазор фланца от края
			if (!stringerParams.isKinkTop) {
				startPoint = par.pointsShape[par.pointsShape.length - 1];
				var ang1 = calcAngleX1(par.pointsShape[0], startPoint);
				columnPosition.top1 = polar(startPoint, ang1, -(220 + 10) / 2);
			}
		}
	}
	// top2
	{
		// columnPosition.top2
		startPoint = par.pointsShape[par.pointsShape.length - 1];
		endPoint = par.pointsShape[par.pointsShape.length - 2];
		if (params.model == "труба" && stringerParams.isKinkTop) {
			if (marshParams.topTurn == "забег") {
				startPoint = par.pointsShape[par.pointsShape.length - 2];
				endPoint = par.pointsShape[par.pointsShape.length - 3];
			}
		}

		let width = distance(startPoint, endPoint);
		let ang = calcAngleX1(startPoint, endPoint);
		var columnX = (220 / 2);
        columnPosition.top2 = newPoint_xy(startPoint, width - columnX / Math.cos(ang), 0);
		if (params.stairModel == 'П-образная с площадкой' && par.topConnection) {
			// columnPosition.top2 = newPoint_xy(startPoint, params.platformLength_1 / 2, 0);
			columnPosition.top2 = newPoint_xy(endPoint, -220 / 2, 0);
		}
	}

	return columnPosition;
}

function drawHolesColumn(par, pcenter, ang) {

	pcenter.x -= params.flanThickness * Math.tan(ang);

	var dx = (100 / Math.cos(ang) + 100) / 2 - 20;
	var dy = 100 / 2 - 20;
	var center1 = newPoint_xy(pcenter, -dx, -dy);
	var center2 = newPoint_xy(pcenter, -dx, dy);
	var center3 = newPoint_xy(pcenter, dx, -dy);
	var center4 = newPoint_xy(pcenter, dx, dy);

	center1.rad = center2.rad = center3.rad = center4.rad = 6.5;
	par.pointsHole = [];
	par.pointsHole.push(center1);
	par.pointsHole.push(center2);
	par.pointsHole.push(center3);
	par.pointsHole.push(center4);

	drawStringerHoles(par);
}

/** функция отрисовки подложки первой забежной ступени для лестницы на сварном коробе
step - шаг ступени
*/

function drawTurnPlate1(par) {

	var gap = 1; //зазор от торца пластины до вертикальных пластин косоура

	//задаем параметры детали
	par.cornerRad = 20;
	par.frontOffset = -30; //нависание подложки над косоуром
	par.width = params.M / 2;
	//par.width = 450;
	par.thk = params.treadPlateThickness;

	par.mesh = new THREE.Object3D();

	//создаем контур пластины для создания Object3D
	var p0 = { x: 0, y: 0 };
	var p1 = newPoint_xy(p0, -par.width / 2, par.frontOffset);
	var p4 = newPoint_xy(p1, par.width, 0);

	var pt1 = newPoint_xy(p0, -params.stringerThickness / 2, par.step - gap);

	var p2 = itercection(pt1, polar(pt1, -par.turnSteps.edgeAngle, 100), p1, polar(p1, Math.PI / 2, 100));
	var p3 = itercection(pt1, polar(pt1, -par.turnSteps.edgeAngle, 100), p4, polar(p4, Math.PI / 2, 100));

	var points = [p1, p2, p3, p4];
	if (turnFactor == -1)
		points = mirrowPointsMiddleX(points);

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		radOut: par.cornerRad, //радиус скругления внешних углов

    }
    shapePar.drawing = {
        name: "Подложка первой забежной ступени",
        group: "carcasFlans",
        marshId: par.marshId,
    }

	var shape = drawShapeByPoints2(shapePar).shape;

	//отверстия для болтов и прямогуольный вырез в центре детали
	var holesPar = {
		hasTrapHole: par.hasTrapHole,
		step: par.step,
		holeRad: 6.5,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
	}
	holesPar.edgeAngle = par.turnSteps.edgeAngle;

	holesPar = drawTreadPlateHoles(holesPar);

	for (var i = 0; i < holesPar.holes.length; i++) {
		shape.holes.push(holesPar.holes[i]);
	}


	//отверстия для шурупов крепления ступени
	var holeOffset = 20;

	var center1 = newPoint_xy(p1, holeOffset, holeOffset);
	var center4 = newPoint_xy(p4, -holeOffset, holeOffset);
	var line = parallel(p2, p3, -holeOffset);
	var center2 = itercection(center1, polar(center1, Math.PI / 2, 100), line.p1, line.p2);
	var center3 = itercection(center4, polar(center4, Math.PI / 2, 100), line.p1, line.p2);
	
	par.holes = [center1, center2, center3, center4];
	if (turnFactor == -1)
		par.holes = mirrowPointsMiddleX(par.holes);
	par.holeRad = 5;

	//Отмечаем тип зенковки, для свг
	par.holes.forEach(function(element) {element.holeData = {zenk: 'no'}});

	var screwPar = {
		id: "screw_6x32",
		description: "Крепление ступеней",
		group: "Ступени"
	}
	
		for (var i = 0; i < par.holes.length; i++) {
			addRoundHole(shape, par.dxfArr, par.holes[i], par.holeRad, par.dxfBasePoint);
	
			if(params.stairType !== 'нет') {
				//саморезы
				var screw = drawScrew(screwPar).mesh;
				screw.position.x = par.holes[i].y;
				screw.position.z = par.holes[i].x;
				par.mesh.add(screw);
			}
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

	//болты
	var boltPar = {
		type: "подложка сварной",
		holesCenter: holesPar.holesCenter,
	}

	drawPlateBolts(boltPar);
	par.mesh.add(boltPar.mesh);

	par.mesh.add(plate);

	var partName = "treadPlateWnd";
	if (typeof specObj != 'undefined'){
		if (!specObj[partName]){
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
		var area = par.width * distance(p1,p2) / 1000000;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
	}
	par.mesh.specId = partName + name;

	return par;

} //end of drawTurnPlate1

/** функция отрисовки подложки третьей забежной ступени для лестницы на сварном коробе
	step - шаг ступени
	*/

function drawTurnPlate3(par){

	var gap = 1; //зазор от торца пластины до вертикальных пластин косоура

	//задаем параметры детали
	par.cornerRad = 20;
	par.frontOffset = -30; //нависание подложки над косоуром
	par.width = params.M / 2;
	//par.width = 450;
	par.thk = params.treadPlateThickness;

	var stepWidthLow = par.turnSteps.stepWidthLow
	if (par.stepWidthLow) stepWidthLow = par.stepWidthLow;

	par.mesh = new THREE.Object3D();

	//создаем контур пластины для создания Object3D
	var p0 = { x: 0, y: 0 };
	var p2 = newPoint_xy(p0, -par.width / 2, par.step - gap);
	var p3 = newPoint_xy(p2, par.width, 0);

	var pt1 = newPoint_xy(p0, params.M / 2, par.step - stepWidthLow);
	var line = parallel(pt1, polar(pt1, par.turnSteps.edgeAngle, 100), -par.frontOffset);

	var p1 = itercection(line.p1, line.p2, p2, polar(p2, Math.PI / 2, 100));
	var p4 = itercection(line.p1, line.p2, p3, polar(p3, Math.PI / 2, 100));

	var points = [p1, p2, p3, p4];
	if (turnFactor == -1)
		points = mirrowPointsMiddleX(points);

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		radOut: par.cornerRad, //радиус скругления внешних углов

    }
    shapePar.drawing = {
        name: "Подложка третьей забежной ступени",
        group: "carcasFlans",
        marshId: par.marshId,
    }

	var shape = drawShapeByPoints2(shapePar).shape;

	//отверстия для болтов и прямогуольный вырез в центре детали
	var holesPar = {
		hasTrapHole: par.hasTrapHole,
		step: par.step,
		holeRad: 6.5,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
	}

	holesPar = drawTreadPlateHoles(holesPar);

	for (var i = 0; i < holesPar.holes.length; i++) {
		shape.holes.push(holesPar.holes[i]);
	}


	//отверстия для шурупов крепления ступени

	var holeOffset = 20;

	var center2 = newPoint_xy(p2, holeOffset, -holeOffset);
	var center3 = newPoint_xy(p3, -holeOffset, -holeOffset);
	var line = parallel(p1, p4, holeOffset);
	var center1 = itercection(center2, polar(center2, Math.PI / 2, 100), line.p1, line.p2);
	var center4 = itercection(center3, polar(center3, Math.PI / 2, 100), line.p1, line.p2);
	
	par.holes = [center1, center2, center3, center4];
	if (turnFactor == -1)
		par.holes = mirrowPointsMiddleX(par.holes);

	par.holeRad = 5;

	//Отмечаем тип зенковки, для свг
	par.holes.forEach(function (element) { element.holeData = { zenk: 'no' } });

	var screwPar = {
		id: "screw_6x32",
		description: "Крепление ступеней",
		group: "Ступени"
	}


	for (var i = 0; i < par.holes.length; i++) {
		addRoundHole(shape, par.dxfArr, par.holes[i], par.holeRad, par.dxfBasePoint);
		//саморезы
		if(params.stairType !== 'нет') {
			var screw = drawScrew(screwPar).mesh;
			screw.position.x = par.holes[i].y;
			screw.position.z = par.holes[i].x;
			par.mesh.add(screw)
		}
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

	//болты
	var boltPar = {
		type: "подложка сварной",
		holesCenter: holesPar.holesCenter,
	}

	drawPlateBolts(boltPar);
	par.mesh.add(boltPar.mesh);

	par.mesh.add(plate);

	//сохраняем данные для спецификации
	var partName = "treadPlateWnd";
	if (typeof specObj != 'undefined'){
		if (!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				name: "Подложка забежная",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
			}
		}
		var name = "";//Math.round(par.width) + "х" + Math.round(distance(p1,p2)) + "х" + Math.round(par.thk);
		var area = par.width * distance(p1,p2) / 1000000
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
	}
	par.mesh.specId = partName + name;

	return par;

} //end of drawTurnPlate3

/**
	функция отрисовки подложки второй забежной ступени для лестницы на сварном коробе
	step - шаг ступени
	*/

function drawTurnPlate2(par) {

	var gap = 1; //зазор от торца пластины до вертикальных пластин косоура

	//задаем параметры детали
	par.cornerRad = 20;
	par.frontOffset = -30; //нависание подложки над косоуром
	par.width = params.M / 2;
	//par.width = 450;
	par.thk = params.treadPlateThickness;

	par.mesh = new THREE.Object3D();

	//создаем контур пластины для создания Object3D
	var p0 = { x: 0, y: 0 };

	var pc = newPoint_xy(p0, 0, par.step + params.flanThickness - params.M / 2); //центр нижнего и верхнего маршей

	var pt1 = newPoint_xy(p0, -par.width / 2, 0);
	var pt2 = newPoint_xy(p0, par.width / 2, 0);

	var pt5 = newPoint_xy(p0, params.M / 2 - par.turnSteps.innerOffsetX, par.step + params.flanThickness - par.turnSteps.treadWidthY);
	var line = parallel(pt5, polar(pt5, -par.turnSteps.angleX, 100), -par.frontOffset);

	var p1 = itercection(pt1, polar(pt1, Math.PI / 2, 100), line.p1, line.p2);
	var p5 = itercection(pt2, polar(pt2, Math.PI / 2, 100), line.p1, line.p2);

	var pt3 = newPoint_xy(p0, -params.M / 2 + par.turnSteps.stepWidthX, par.step + params.flanThickness);
	var line = parallel(pt3, polar(pt3, par.turnSteps.angleY + Math.PI / 2, 100), -gap);

	var p4 = itercection(p5, polar(p5, Math.PI / 2 - par.turnSteps.angleX, 100), line.p1, line.p2);

	var pt4 = newPoint_xy(pc, 0, par.width / 2);
	var p3 = itercection(pt4, polar(pt4, 0, 100), line.p1, line.p2);
	var p2 = itercection(pt4, polar(pt4, 0, 100), p1, polar(p1, Math.PI / 2, 100));

	var points = [p1, p2, p3, p4, p5];
	if (turnFactor == -1)
		points = mirrowPointsMiddleX(points);

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		radOut: par.cornerRad, //радиус скругления внешних углов

    }
    shapePar.drawing = {
        name: "Подложка второй забежной ступени",
        group: "carcasFlans",
        marshId: par.marshId,
    }

	var shape = drawShapeByPoints2(shapePar).shape;

	//отверстия для болтов и прямогуольный вырез в центре детали (нижнего марша)
	var holesPar = {
		hasTrapHole: par.hasTrapHole,
		step: par.step - params.M / 2 + params.flanThickness + par.width / 2,
		holeRad: 6.5,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
	}

	holesPar = drawTreadPlateHoles(holesPar);

	for (var i = 0; i < holesPar.holes.length; i++) {
		shape.holes.push(holesPar.holes[i]);
	}

	//болты
	var boltPar = {
		type: "подложка сварной",
		holesCenter: holesPar.holesCenter,
	}

	drawPlateBolts(boltPar);
	par.mesh.add(boltPar.mesh);


	//отверстия для болтов и прямогуольный вырез в центре детали (верхнего марша)
	holesPar.type = "treadPlate";
	holesPar.p0 = newPoint_xy(pc, params.stringerThickness / 2, 0);
	holesPar.turnSteps = par.turnSteps;
	holesPar = drawTurn2TreadPlateHoles(holesPar);

	for (var i = 0; i < holesPar.holes.length; i++) {
		shape.holes.push(holesPar.holes[i]);
	}

	//болты
	var boltPar = {
		type: "подложка сварной",
		holesCenter: holesPar.holesCenter,
	}

	drawPlateBolts(boltPar);
	par.mesh.add(boltPar.mesh);


	//отверстия для шурупов крепления ступени
	var holeOffset = 20;

	var line_p1_p5 = parallel(p1, p5, holeOffset)
	var line_p1_p2 = parallel(p1, p2, -holeOffset)
	var line_p2_p3 = parallel(p2, p3, -holeOffset)
	var line_p21_p31 = parallel(p2, p3, -holeOffset * 3)
	var line_p3_p4 = parallel(p3, p4, -holeOffset)
	var line_p4_p5 = parallel(p4, p5, holeOffset)

	var center1 = itercection(line_p1_p5.p1, line_p1_p5.p2, line_p1_p2.p1, line_p1_p2.p2);
	var center2 = itercection(line_p1_p2.p1, line_p1_p2.p2, line_p2_p3.p1, line_p2_p3.p2);
	var center3 = itercection(line_p21_p31.p1, line_p21_p31.p2, line_p3_p4.p1, line_p3_p4.p2);
	var center4 = itercection(line_p3_p4.p1, line_p3_p4.p2, line_p4_p5.p1, line_p4_p5.p2);
	var center5 = itercection(line_p4_p5.p1, line_p4_p5.p2, line_p1_p5.p1, line_p1_p5.p2);
	
	par.holes = [center1, center2, center3, center4, center5];
	if (turnFactor == -1)
		par.holes = mirrowPointsMiddleX(par.holes);

	par.holeRad = 5;
		
	//Отмечаем тип зенковки, для свг
	par.holes.forEach(function (element) { element.holeData = { zenk: 'no' } });

	var screwPar = {
		id: "screw_6x32",
		description: "Крепление ступеней",
		group: "Ступени"
	}


	for (var i = 0; i < par.holes.length; i++) {
		addRoundHole(shape, par.dxfArr, par.holes[i], par.holeRad, par.dxfBasePoint);

		//саморезы
		if(params.stairType !== 'нет') {
			var screw = drawScrew(screwPar).mesh;
			screw.position.x = par.holes[i].y;
			screw.position.z = par.holes[i].x;
			par.mesh.add(screw)
		}
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

	par.mesh.add(plate);

	var partName = "treadPlateWnd";
	if (typeof specObj != 'undefined'){
		if (!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				name: "Подложка забежная",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
			}
		}
		var name = "";//Math.round(distance(p2,p4)) + "х" + Math.round(distance(p1,p3)) + "х" + Math.round(par.thk);
		var area = distance(p2,p4) * distance(p1,p3) / 1000000
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
	}
	par.mesh.specId = partName + name;

	return par;

} //end of drawTurnPlate2



function drawTreadPlateHoles(par) {

	var p0 = { x: 0, y: 0 };

	//отверстия для болтов
	par.centerDistX = params.stringerThickness - 50;
	par.centerDistY = par.step - params.metalThickness - 50;


	var frontHolesPosY = 50 / 2 + params.metalThickness;

	var center1 = newPoint_xy(p0, -par.centerDistX / 2, frontHolesPosY);
	var center4 = newPoint_xy(center1, par.centerDistX, 0);
	if (!par.hasTrapHole) {
		var center2 = newPoint_xy(center1, 0, par.centerDistY);
		var center3 = newPoint_xy(center2, par.centerDistX, 0);
	}
	if (par.hasTrapHole) {
		var pt = newPoint_xy(p0, -params.stringerThickness / 2, par.step);
		var pt1 = polar(pt, -par.edgeAngle, 100);
		var line = parallel(pt, pt1, -(50 + params.metalThickness) / 2);
		var center2 = itercection(center1, polar(center1, Math.PI / 2, 100), line.p1, line.p2);
		var center3 = itercection(center4, polar(center4, Math.PI / 2, 100), line.p1, line.p2);
	}

	if (par.basePointShiftX) {
		center1.y -= par.basePointShiftX;
		center2.y -= par.basePointShiftX;
		center3.y -= par.basePointShiftX;
		center4.y -= par.basePointShiftX;
	}

	par.holesCenter = [center1, center2, center3, center4];
	if (turnFactor == -1)
		par.holesCenter = mirrowPointsMiddleX(par.holesCenter);

	par.holes = [];

	for (var i = 0; i < par.holesCenter.length; i++) {
		addRoundHole(par, par.dxfArr, par.holesCenter[i], par.holeRad, par.dxfBasePoint);
	}

	//добавляем  вырез в виде треугольника 10х10 для направления сборки
	var center = newPoint_xy(p0, 0, frontHolesPosY);
	if (par.basePointShiftX) center.y -= par.basePointShiftX;
	var hole = new THREE.Path();
	var p1 = { x: center.x, y: center.y + 10 / Math.sqrt(3) };
	var p2 = polar(p1, -Math.PI / 3, 10);
	var p3 = polar(p2, Math.PI, 10);
	addLine(hole, dxfPrimitivesArr, p1, p2, par.dxfBasePoint);
	addLine(hole, dxfPrimitivesArr, p2, p3, par.dxfBasePoint);
	addLine(hole, dxfPrimitivesArr, p3, p1, par.dxfBasePoint);
	par.holes.push(hole);

	//прямогуольный вырез в центре детали
	var holeOffset = 15; //отступ края выреза от оси отверстия
	var pH1 = newPoint_xy(center1, holeOffset, holeOffset);
	var pH4 = newPoint_xy(center4, -holeOffset, holeOffset);
	var line = parallel(center2, center3, -holeOffset);
	var pH2 = itercection(pH1, polar(pH1, Math.PI / 2, 100), line.p1, line.p2);
	var pH3 = itercection(pH4, polar(pH4, Math.PI / 2, 100), line.p1, line.p2);

	var arr = [pH1, pH2, pH3, pH4];
	if (turnFactor == -1)
		arr = mirrowPointsMiddleX(arr);	

	var holeParams = {
		vertexes: arr,
		cornerRad: 10.0,
		dxfPrimitivesArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint
	}

	par.holes.push(topCoverCentralHole(holeParams));

	//второй прямогуольный вырез в пластине второй забежной ступени для закрепления фланца
	if (par.isTurn2Top) {
		var pt = newPoint_xy(p0, 0, par.step - 20);
		if (par.dStep) pt.y += par.dStep;
		var len = 100;
		//if ((center1.y - pt.y) < 120) len = center1.y - pt.y - 20;
		if ((pt.y - center2.y) < 120) len = pt.y - center2.y - 20;

		if (len > 50) {
			var pH1 = itercection(pt, polar(pt, 0, 100), pH1, polar(pH1, Math.PI / 2, 100));
			var pH2 = itercection(pt, polar(pt, 0, 100), pH4, polar(pH4, Math.PI / 2, 100));
			var pH3 = newPoint_xy(pH2, 0, -len);
			var pH4 = newPoint_xy(pH1, 0, -len);

			var arr = [pH1, pH2, pH3, pH4];
			if (turnFactor == -1)
				arr = mirrowPointsMiddleX(arr);

			var holeParams = {
				vertexes: arr,
				cornerRad: 10.0,
				dxfPrimitivesArr: par.dxfArr,
				dxfBasePoint: par.dxfBasePoint
			}

			par.holes.push(topCoverCentralHole(holeParams));
		}
	}

	return par;
} //end of drawTreadPlateHoles


function drawTurn2TreadPlateHoles(par) {

	var p0 = { x: 0, y: 0 };

	//определяем точки контура ступени
	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p1, -par.turnSteps.stepWidthY, 0);
	var p3 = newPoint_xy(p2, 0, par.turnSteps.stepWidthX);
	var p4 = newPoint_xy(p1, par.turnSteps.stepOffsetY - par.turnSteps.innerOffsetY, par.turnSteps.treadWidthX);

	//опеределяем точку пересечения осей нижнего и верхнего маршей
	var pc = newPoint_xy(p2, params.M / 2, params.M / 2);

	//определяем нулевую  точку верхнего марша
	var pv0 = newPoint_xy(pc, 0, params.stringerThickness / 2);

	var pt3 = newPoint_xy(p3, -pv0.x, -pv0.y);
	var pt4 = newPoint_xy(p4, -pv0.x, -pv0.y);

	//отверстия для болтов
	par.centerDistX = params.stringerThickness - 50;
	par.centerDistY = par.step - params.metalThickness - 50;

	var frontHolesPosY = 50 / 2 + params.metalThickness;

	var center1 = newPoint_xy(p0, -par.centerDistX / 2, frontHolesPosY);
	var center4 = newPoint_xy(center1, par.centerDistX, 0);
	var line = parallel(pt3, pt4, -(50 + params.metalThickness) / 2);
	var center2 = itercection(center1, polar(center1, Math.PI / 2, 100), line.p1, line.p2);
	var center3 = itercection(center4, polar(center4, Math.PI / 2, 100), line.p1, line.p2);

	par.holesCenter = [center2, center3];

	//для подложки отверсия под болты поворачиваем и сдвигаем к нулевой точке верхнего марша
	if (par.type == "treadPlate") {
		var center21 = { x: center2.y, y: -center2.x }
		var center31 = { x: center3.y, y: -center3.x }
		par.holesCenter = [center21, center31];
		par.holesCenter = moovePoints(par.holesCenter, par.p0);

	}
	if (turnFactor == -1)
		par.holesCenter = mirrowPointsMiddleX(par.holesCenter);

	par.holes = [];

	for (var i = 0; i < par.holesCenter.length; i++) {
		addRoundHole(par, par.dxfArr, par.holesCenter[i], par.holeRad, par.dxfBasePoint);
	}

	//добавляем  вырез в виде треугольника 10х10 для направления сборки
	var center = newPoint_xy(p0, 0, 10);
	var hole = new THREE.Path();
	var p1 = { x: center.x, y: center.y + 10 / Math.sqrt(3) };
	var p2 = polar(p1, -Math.PI / 3, 10);
	var p3 = polar(p2, Math.PI, 10);
	addLine(hole, dxfPrimitivesArr, p1, p2, dxfBasePoint);
	addLine(hole, dxfPrimitivesArr, p2, p3, dxfBasePoint);
	addLine(hole, dxfPrimitivesArr, p3, p1, dxfBasePoint);
	par.holes.push(hole);

	//прямогуольный вырез в центре детали
	var holeOffset = 5; //отступ края выреза от оси отверстия
	var pH1 = newPoint_xy(center1, holeOffset, -holeOffset);
	var pH4 = newPoint_xy(center4, -holeOffset, -holeOffset);
	if (params.M < 750) {
		pH1.y -= holeOffset*2;
		pH4.y -= holeOffset*2;
	}
	var line = parallel(center2, center3, -holeOffset * 2);
	var pH2 = itercection(pH1, polar(pH1, Math.PI / 2, 100), line.p1, line.p2);
	var pH3 = itercection(pH4, polar(pH4, Math.PI / 2, 100), line.p1, line.p2);

	var arr = [pH1, pH2, pH3, pH4];

	//для подложки центральное отверстие поворачиваем и сдвигаем к нулевой точке верхнего марша
	if (par.type == "treadPlate") {
		pH1 = { x: pH1.y, y: -pH1.x }
		pH2 = { x: pH2.y, y: -pH2.x }
		pH3 = { x: pH3.y, y: -pH3.x }
		pH4 = { x: pH4.y, y: -pH4.x }
		arr = [pH1, pH2, pH3, pH4];
		arr = moovePoints(arr, par.p0);
	}
	if (turnFactor == -1)
		arr = mirrowPointsMiddleX(arr);

	var holeParams = {
		vertexes: arr,
		cornerRad: 10.0,
		dxfPrimitivesArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint
	}

	par.holes.push(topCoverCentralHole(holeParams));

	return par;
} //end of drawTurn2TreadPlateHoles

/** функция отрисовки сборной подложки для лестницы на профиле
	Параметры:
	step: params.b1,
	h: params.h1,
	dxfBasePoint: dxfBasePoint,
	*/

function drawTreadPlateCabriole2(par) {

	var stringerPlateThickness = params.metalThickness;

	par.treadPlateWidth = params.stringerThickness + params.M / 3;
	var holeRad = 4;
	var profileWidth = params.stringerThickness - params.metalThickness * 2;
	var screwOffset = 20; //отступ отверстия под шуруп от угла подложки
	var basePointSvg = { x: 0, y: 0 };

	var treadPlate = new THREE.Object3D();

	var extrudeOptions = {
		amount: params.treadPlateThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
		};
	var dxfBasePoint0 = copyPoint(par.dxfBasePoint);

	var flanParams = { //объявление параметров фланца
		width: par.treadPlateWidth,
		height: par.step - params.treadPlateThickness,
		holeDiam: holeRad * 2,
		angleRadUp: 0,
		angleRadDn: 0,
		hole1X: screwOffset,
		hole1Y: screwOffset,
		hole2X: screwOffset,
		hole2Y: screwOffset,
		hole3X: screwOffset,
		hole3Y: screwOffset,
		hole4X: screwOffset,
		hole4Y: screwOffset,
		metalThickness: stringerPlateThickness,
		dxfBasePoint: par.dxfBasePoint,
		dxfPrimitivesArr: dxfPrimitivesArr
	};

	var shape = drawRectFlan(flanParams).shape;

	//запоминаем цетры отверстий для создание саморезов
	var holesScrew = [];
	for (var i = 0; i < shape.holes.length; i++) {
		holesScrew.push(shape.holes[i].currentPoint);
	}	

	flanParams.dxfPrimitivesArr = [];
	var shapeNo = drawRectFlan(flanParams).shape;


	// отрисовка центрального отверстия

	//углы треугольника без учета скруглений
	var p0 = { x: 0, y: 0 };
	var p1 = newPoint_xy(p0, par.treadPlateWidth / 2 - profileWidth / 2 + 10, 15);
	var p2 = newPoint_xy(p0, par.treadPlateWidth / 2 - profileWidth / 2 + 10, par.step - 33);
	var p3 = newPoint_xy(p0, par.treadPlateWidth / 2 + profileWidth / 2 - 10, par.step - 33);
	var p4 = newPoint_xy(p0, par.treadPlateWidth / 2 + profileWidth / 2 - 10, 15);


	var hole = new THREE.Path();
	var vertexes = []; //массив вершин

	vertexes[0] = p1;
	vertexes[1] = p2;
	vertexes[2] = p3;
	vertexes[3] = p4;

	var filletParams = {
		vertexes: vertexes,
		cornerRad: 10,
		dxfBasePoint: par.dxfBasePoint,
		dxfPrimitivesArr: dxfPrimitivesArr,
		type: "path"
	}

	hole = fiiletPathCorners(filletParams);
	shapeNo.holes.push(hole);

	//-------------------------------------
	var hole = new THREE.Path();
	var dxfPrimitivesArr1 = [];
	addLine(hole, dxfPrimitivesArr1, p1, p4, par.dxfBasePoint);
	addLine(hole, dxfPrimitivesArr1, p4, p3, par.dxfBasePoint);
	addLine(hole, dxfPrimitivesArr1, p3, p2, par.dxfBasePoint);
	addLine(hole, dxfPrimitivesArr1, p2, p1, par.dxfBasePoint);

	shape.holes.push(hole);

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

	var plate = new THREE.Mesh(geom, params.materials.metal2);
	plate.rotation.x = Math.PI / 2;
	plate.rotation.z = -Math.PI / 2;

	plate.position.y = params.treadPlateThickness;
	plate.position.z = par.treadPlateWidth / 2;

	var screwPar = {
		id: "screw_6x32",
		description: "Крепление ступеней",
		group: "Ступени"
	}


	for (var i = 0; i < holesScrew.length; i++) {
		//саморезы
		if(params.stairType !== 'нет') {
			var screw = drawScrew(screwPar).mesh;
			screw.rotation.x = Math.PI / 2;
			screw.position.x = holesScrew[i].x - params.metalThickness;
			screw.position.y = holesScrew[i].y;
			plate.add(screw);
		}
	}

    treadPlate.add(plate);

    if (par.isSvg || par.isPlatform || par.isTopLast) par.isSvg = true;

    if (par.isSvg) {
		shape.drawing = {
			name: "Подложка",
			group: "treadPlate",
			type: "top",
			marshId: par.marshId,
			plateId: par.plateId,
			basePoint: copyPoint(basePointSvg),
		}
        if (par.isFirst) shape.drawing.marshId += "_first";
        if (par.isPlatform) shape.drawing.marshId += "_platform";
        if (par.isTopLast) shape.drawing.marshId += "_topLast";
		shapesList.push(shape);
		basePointSvg.x += par.treadPlateWidth + 100;
	}

	//------------------------------------------------------------------------------------------
	par.dxfBasePoint = newPoint_xy(dxfBasePoint0, par.treadPlateWidth + 50, par.step);


	par.isTop = true
	par.isBot = true
	par.isIn = true

	if (par.isTopNot) par.isTop = false;

	//задняя (верхняя) вертикальная пластина

	if (par.isTop) {
		var shape = new THREE.Shape();

		var p0 = { x: 0, y: 0 };
		var p1 = newPoint_xy(p0, 0, 30);
		var p2 = newPoint_xy(p1, par.treadPlateWidth, 0);
		var p3 = newPoint_xy(p2, 0, -30);

		var rad = 10;
		var clockwise = true;

		addLine(shape, dxfPrimitivesArr, p0, newPoint_xy(p1, 0, -rad), par.dxfBasePoint);
		addArc2(shape, dxfPrimitivesArr, newPoint_xy(p1, rad, -rad), rad, Math.PI, Math.PI / 2, clockwise, par.dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, newPoint_xy(p1, rad, 0), newPoint_xy(p2, -rad, 0), par.dxfBasePoint);
		addArc2(shape, dxfPrimitivesArr, newPoint_xy(p2, -rad, -rad), rad, Math.PI / 2, 0, clockwise, par.dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, newPoint_xy(p2, 0, -rad), p3, par.dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p3, p0, par.dxfBasePoint);

		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		var plate = new THREE.Mesh(geom, params.materials.metal2);
		plate.rotation.y = Math.PI / 2;

		plate.position.x = par.step - params.treadPlateThickness * 2;
		plate.position.y = params.treadPlateThickness;
		plate.position.z = par.treadPlateWidth / 2;

		treadPlate.add(plate);

		if (par.isSvg) {
			shape.drawing = {
				name: "Подложка",
				group: "treadPlate",
				type: "topBack",
				marshId: par.marshId,
				basePoint: copyPoint(basePointSvg),
			}
		    if (par.isFirst) shape.drawing.marshId += "_first";
		    if (par.isPlatform) shape.drawing.marshId += "_platform";
		    if (par.isTopLast) shape.drawing.marshId += "_topLast";
			shapesList.push(shape);
			if (!par.isBot) basePointSvg.x += par.treadPlateWidth + 100;
			if (par.isBot) basePointSvg.y -= 100;
		}
	}

	//----------------------------------------------------------------------------------------
	par.dxfBasePoint.y -= 100;

	//передняя (нижняя) вертикальная пластина

	if (par.isBot) {
		var shape = new THREE.Shape();

		var p0 = { x: 0, y: 0 };
		var p1 = newPoint_xy(p0, par.treadPlateWidth, 0);
		var p2 = newPoint_xy(p1, 0, -20);
		var p3 = newPoint_xy(p0, par.treadPlateWidth / 2 + profileWidth / 2 + params.metalThickness, -par.h - params.treadPlateThickness);
		var p4 = newPoint_xy(p0, par.treadPlateWidth / 2 - profileWidth / 2 - params.metalThickness, -par.h - params.treadPlateThickness);
		var p5 = newPoint_xy(p0, 0, -20);

		addLine(shape, dxfPrimitivesArr, p0, p1, par.dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p1, p2, par.dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p2, p3, par.dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p3, p4, par.dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p4, p5, par.dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p5, p0, par.dxfBasePoint);

		var extrudeOptions1 = {
			amount: params.treadPlateThickness - 0.01,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};

		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions1);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		var plate = new THREE.Mesh(geom, params.materials.metal2);

		plate.rotation.y = Math.PI / 2;

		plate.position.x = -params.treadPlateThickness;
		plate.position.y = params.treadPlateThickness;
		plate.position.z = par.treadPlateWidth / 2;

		treadPlate.add(plate);

		if (par.isSvg) {
			shape.drawing = {
				name: "Подложка",
				group: "treadPlate",
				type: "botFront",
				marshId: par.marshId,
				basePoint: copyPoint(basePointSvg),
			}
		    if (par.isFirst) shape.drawing.marshId += "_first";
		    if (par.isPlatform) shape.drawing.marshId += "_platform";
		    if (par.isTopLast) shape.drawing.marshId += "_topLast";
			shapesList.push(shape);
			basePointSvg.x += par.treadPlateWidth + 100;
		}
	}

	//---------------------------------------------------------------------------------------

	//боковые пластины

	par.dxfBasePoint = newPoint_xy(dxfBasePoint0, par.treadPlateWidth * 2 + 100, 0)

	if (par.isIn) {
		for(var i=0; i<2; i++){
			par.widthIn = par.step - 25;
			par.heightIn = par.h - 25 - params.treadPlateThickness;

			var shape = new THREE.Shape();

			var p0 = { x: 0, y: 0 };
			var p1 = newPoint_xy(p0, 0, par.heightIn);
			var p2 = newPoint_xy(p1, par.widthIn, 0);
			var pt1 = newPoint_xy(p1, 0, -par.h);
			if (par.isFirst) pt1 = newPoint_xy(p1, par.step, 0);
			var dx = params.sidePlateWidth - params.sidePlateOverlay - 12;
			var pt2 = newPoint_xy(pt1, dx / Math.sin(par.stairAngle), 0);
			var pt3 = polar(pt2, par.stairAngle, 100);
			var p3 = itercection(p2, polar(p2, Math.PI * 3 / 2, 100), pt2, pt3);
			var p4 = itercection(p0, polar(p0, 0, 100), pt2, pt3);

			if (par.isBotPipeHor) {
				var p5 = newPoint_xy(p1, 100 - params.sidePlateOverlay - 5, -params.h1 + params.profileHeight + 5);
				var p6 = itercection(p0, polar(p0, 0, 100), p5, polar(p5, Math.PI / 2, 100));
				p4 = itercection(p5, polar(p5, 0, 100), pt2, pt3);

				addLine(shape, dxfPrimitivesArr, p0, p6, par.dxfBasePoint);
				addLine(shape, dxfPrimitivesArr, p6, p5, par.dxfBasePoint);
				addLine(shape, dxfPrimitivesArr, p5, p4, par.dxfBasePoint);
			}
			else {
				addLine(shape, dxfPrimitivesArr, p0, p4, par.dxfBasePoint);
			}
			
			addLine(shape, dxfPrimitivesArr, p4, p3, par.dxfBasePoint);
			addLine(shape, dxfPrimitivesArr, p3, p2, par.dxfBasePoint);
			addLine(shape, dxfPrimitivesArr, p2, p1, par.dxfBasePoint);
			addLine(shape, dxfPrimitivesArr, p1, p0, par.dxfBasePoint);

			// отрисовка двух центральных отверстий под болты
			center1 = newPoint_xy(p1, 20, -(par.h - 65) - 20);
			if (par.isFirst) center1 = newPoint_xy(p0, 20, 20);
			center2 = newPoint_xy(p1, 20, -20);
			center3 = newPoint_xy(p2, -40, -20);

			addOvalHoleX(shape, dxfPrimitivesArr, center1, 6, 10, par.dxfBasePoint, true);
			addOvalHoleX(shape, dxfPrimitivesArr, center2, 6, 10, par.dxfBasePoint, true);
			addOvalHoleX(shape, dxfPrimitivesArr, center3, 6, 10, par.dxfBasePoint, true);

			var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
			geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

			var plateObj = new THREE.Object3D();
			var plate = new THREE.Mesh(geom, params.materials.metal2);
			plateObj.add(plate);
			//болты
			if (par.type == "treadPlate") {
				var boltPar = {
					type: "подложка труба",
					holesCenter: [center1, center2, center3],
				}

				drawPlateBolts(boltPar);
				plateObj.add(boltPar.mesh);
			}

			plateObj.position.z = -(par.treadPlateWidth / 2 - profileWidth / 2 + stringerPlateThickness);

			if(i == 1){
				plateObj.position.z = -(par.treadPlateWidth / 2 + profileWidth / 2);
				}
			plateObj.position.y = -par.heightIn;
			plateObj.position.z += par.treadPlateWidth / 2;

			treadPlate.add(plateObj);

			if (par.isSvg) {
				shape.drawing = {
					name: "Подложка",
					group: "treadPlate",
					type: "in",
					marshId: par.marshId,
					basePoint: copyPoint(basePointSvg),
				}
			    if (par.isFirst) shape.drawing.marshId += "_first";
			    if (par.isPlatform) shape.drawing.marshId += "_platform";
			    if (par.isTopLast) shape.drawing.marshId += "_topLast";
				shapesList.push(shape);
				basePointSvg.x += par.widthIn + 100;
			}

			par.dxfBasePoint.x += par.step + 50;
			}
		}

	//----------------------------------------------------------------------------------------

	par.mesh = treadPlate;

	var partName = "treadPlateWld";
	if (typeof specObj != 'undefined'){
		if (!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Подложка сварная прямой ступени",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
			}
		}
		var name = Math.round(flanParams.width) + "х" + Math.round(flanParams.height) + "х" + Math.round(par.h + params.treadPlateThickness);
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}
	par.mesh.specId = partName + name;

	return par;
}
//конец функции отрисовки подложки ступеней

/** функция отрисовки фланца каркаса
*/

function drawMonoFlan(par) {
	//нижний фланец крепления к перекытию
	if (par.type == "bot") {
		var pStart = par.pointsShape[1];
		var pEnd = par.pointsShape[0];
		if (par.isBotFloorsDist) {
			pStart = par.pointsShape[2];
			pEnd = par.pointsShape[1];
		}
		var flanPar = {
			width: params.stringerThickness + 110.0, //ширина фланца
			height: pEnd.x - pStart.x + 10, //длина фланца (высота при вертикальном расположении)
			holeRad: 6.5,
			cornerRad: 20,
			holeX: 20,
			holeY: 20,
			dxfBasePoint: par.dxfBasePoint,
		};
	    flanPar.drawing = {
	        name: par.name,
	        group: "carcasFlans",
	        marshId: par.marshId,
	    }
	    //корректировка положения после поворота
	    //flanPar.drawing.basePoint.x += flanPar.height / 2 - flanPar.width / 2;
     //   flanPar.drawing.basePoint.y += flanPar.height / 2 - flanPar.width / 2;


		flanPar.noBolts = true; //болты не добавляются

		flanPar.isFixPart = true; // болты крепления к стенам
		flanPar.fixPar = getFixPart(0, 'botFloor'); // параметры крепления к стенам
		flanPar.fixPar.diamHole = 15;

		flanPar.roundHoleCenters = [];

		//добавляем  отверстия в центре
		flanPar.roundHoleCenters = flanCentralHoles(pEnd.x - pStart.x + 10);
		mooveFlanHoles(flanPar);

		//добавляем  отверстия по краям
		addHolesMonoFlan(flanPar);

		flanPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, -flanPar.height - 100);

		var flan = drawRectFlan2(flanPar).mesh;
		flan.position.z = flanPar.width / 2;
		flan.position.y = params.flanThickness;
		flan.rotation.x = -Math.PI / 2 * 3;
		flan.rotation.z = -Math.PI / 2;
	}
	//нижний фланец-заглушка
	if (par.type == "botStub") {
		var pStart = par.pointsShape[1];
		var pEnd = par.pointsShape[0];
		if (par.isBotFloorsDist) {
			pStart = par.pointsShape[2];
			pEnd = par.pointsShape[1];
		}
		var flanPar = {
			width: params.stringerThickness - 2 * params.metalThickness, //ширина фланца
			height: pEnd.x - pStart.x - 2 * params.metalThickness, //длина фланца (высота при вертикальном расположении)
			holeRad: 6.5,
			cornerRad: 0,
			holeX: 50,
			holeY: 20,
            dxfBasePoint: par.dxfBasePoint,
			mirrowBolts: true,
        };
		if (par.pointCurrentSvg) {
			flanPar.drawing = {
				name: "Внутренний нижний фланец-заглушка",
				group: "carcasFlans_In",
				location: "in",
				isRotate: true,
				marshId: par.marshId,
				basePoint: newPoint_xy(par.pointCurrentSvg, -par.pointStartSvg.x, -par.pointStartSvg.y - 100),
			}
			//корректировка положения после поворота
			flanPar.drawing.basePoint.x += flanPar.height / 2 - flanPar.width / 2;
			flanPar.drawing.basePoint.y += flanPar.height / 2 - flanPar.width / 2;
		}

		flanPar.roundHoleCenters = [];
		//добавляем  отверстия в центре
		flanPar.roundHoleCenters = flanCentralHoles(pEnd.x - pStart.x + 10);
		mooveFlanHoles(flanPar);

        flanPar.dxfBasePoint = newPoint_xy(flanPar.dxfBasePoint, 0, -flanPar.height - 100);

		var flan = drawRectFlan2(flanPar).mesh;
		flan.position.z = flanPar.width / 2;
		flan.position.y = params.flanThickness;
		flan.rotation.x = -Math.PI / 2 * 3;
		flan.rotation.z = -Math.PI / 2;
	}
	//фланец для соединения косоуров
	if (par.type == "join") {
		var flanPar = {
			height: params.stringerThickness, //ширина фланца
			width: params.stringerThickness + 110, //длина фланца (высота при вертикальном расположении)
			holeRad: 6.5,
			cornerRad: 20,
			holeX: 20,
			holeY: 20,
			dxfBasePoint: par.dxfBasePoint,
		};
		if (par.height) flanPar.height = par.height;
		flanPar.noBolts = par.noBolts; //болты не добавляются
		if (!par.isCentralHoles) flanPar.holeY = 25;
		par.width = flanPar.width;

		var marshIdFix = par.marshId;
		if (par.marshIdFix) marshIdFix = par.marshIdFix;
		flanPar.isFixPart = true; // болты крепления к стенам
		flanPar.fixPar = getFixPart(marshIdFix); // параметры крепления к стенам
		flanPar.fixPar.diamHole = 15;

	    flanPar.drawing = {
	        name: par.name,
	        group: "carcasFlans",
	        marshId: par.marshId,
		}
	    if (par.groupSvg) flanPar.drawing.group = par.groupSvg;
	    if (par.isPointSvg) {
		    flanPar.drawing.isPointSvg = par.isPointSvg;
		    flanPar.drawing.pointStartSvg = par.pointStartSvg;
		    flanPar.drawing.pointCurrentSvg = par.pointCurrentSvg;
	    }


		flanPar.roundHoleCenters = [];

		//добавляем  отверстия в центре
		if (par.isCentralHoles) {
			var len = flanPar.height - params.metalThickness * 2 - 5;
			var width = params.stringerThickness - 2 * params.metalThickness;
			var p0 = { x: flanPar.width / 2, y: params.metalThickness + len / 2 };
			var c1 = newPoint_xy(p0, - width / 2 + 20, -len / 2 + 20);
			var c2 = newPoint_xy(p0, - width / 2 + 20, len / 2 - 20);
			var c3 = newPoint_xy(p0, width / 2 - 20, -len / 2 + 20);
			var c4 = newPoint_xy(p0, width / 2 - 20, len / 2 - 20);
			flanPar.roundHoleCenters = [c1, c2, c3, c4];
		}

		//добавляем  отверстия по краям
		addHolesMonoFlan(flanPar);

		flanPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, -flanPar.width - 100);

		var flan = drawRectFlan2(flanPar).mesh;
		flan.position.z = flanPar.width / 2;
		flan.rotation.y = Math.PI / 2;
	}
	//внутренний усиливающий фланец
	if (par.type == "joinStrong") {
		var flanPar = {
			height: params.stringerThickness - 5 - params.metalThickness * 2, //ширина фланца
			width: params.stringerThickness + 110, //длина фланца (высота при вертикальном расположении)
			holeRad: 7.5,
			cornerRad: 0,
			holeX: 20,
			holeY: 25 - params.metalThickness ,
			dxfBasePoint: par.dxfBasePoint,
        };
	    flanPar.drawing = {
	        name: par.name,
	        group: "carcasFlans",
	        marshId: par.marshId,
        }

		if (par.height) flanPar.height = par.height;
		flanPar.noBolts = par.noBolts; //болты не добавляются


		flanPar.roundHoleCenters = [];

		//добавляем  отверстия по краям
		flanPar.roundHoleCenters.push({ x: flanPar.holeX, y: flanPar.holeY});
		flanPar.roundHoleCenters.push({ x: flanPar.holeX, y: flanPar.height - flanPar.holeY + 5});
		flanPar.roundHoleCenters.push({ x: flanPar.width - flanPar.holeX, y: flanPar.height - flanPar.holeY + 5});
		flanPar.roundHoleCenters.push({ x: flanPar.width - flanPar.holeX, y: flanPar.holeY});

		flanPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, -flanPar.width - 100);

		var flan = drawRectFlan2(flanPar).mesh;
		flan.position.z = flanPar.width / 2;
		flan.rotation.y = Math.PI / 2;
	}
	//ввариваемый фланец-заглушка
	if (par.type == "joinStub") {
		var flan = new THREE.Object3D();
		//фланец-заглушка
		var flanPar = {
			width: params.stringerThickness - 2 * params.metalThickness, //ширина фланца
			//height: params.stringerThickness - 2 * params.metalThickness, //ширина фланца
			height: par.height, //длина фланца (высота при вертикальном расположении)
			holeRad: 6.5,
			cornerRad: 0,
			holeX: 20,
			holeY: 20,
            dxfBasePoint: par.dxfBasePoint,
			mirrowBolts: true,
        };
        if (par.holeY) flanPar.holeY = par.holeY;
	    if (par.hole1Y) flanPar.hole1Y = par.hole1Y;
        if (par.hole2Y) flanPar.hole2Y = par.hole2Y;
		par.width = flanPar.width;
		if (par.noBolts) flanPar.noBolts = par.noBolts; //болты не добавляются

		if (par.pointCurrentSvg || par.isSvg) {
			flanPar.drawing = {
				name: "Внутренний фланец-заглушка",
                group: "carcasFlans_In",
				marshId: par.marshId,
			}
			if (par.pointCurrentSvg && !par.isPointSvg) {
				flanPar.drawing.basePoint =
					newPoint_xy(par.pointCurrentSvg, -par.pointStartSvg.x, -par.pointStartSvg.y);
			}
			else {
				flanPar.drawing.group = "carcasFlans";
			}
			if (par.name) flanPar.drawing.name = par.name;			
			if (par.isCount) flanPar.drawing.isCount = par.isCount;
			if (par.groupSvg) flanPar.drawing.group = par.groupSvg;
			if (par.isPointSvg) {
				flanPar.drawing.isPointSvg = par.isPointSvg;
				flanPar.drawing.pointStartSvg = par.pointStartSvg;
				flanPar.drawing.pointCurrentSvg = par.pointCurrentSvg;
			}
		}

		flanPar.roundHoleCenters = [];
		//добавляем  отверстия по краям
		addHolesMonoFlan(flanPar);

		flanPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, flanPar.width + 100);

		var flan1 = drawRectFlan2(flanPar).mesh;
		flan.add(flan1);
		flan.position.z = flanPar.width / 2;
		flan.position.x = params.flanThickness - params.metalThickness;
		flan.position.y = -flanPar.height - 5 - params.metalThickness;
		flan.rotation.y = Math.PI / 2;
		//flan.add(flan1);

		if (par.isBolts) {
			//болты
			if (par.isBolts) {
				var boltPar = {
					type: "фланец сварной",
					holesCenter: flanPar.roundHoleCenters,
				};

				drawPlateBolts(boltPar);
				flan.add(boltPar.mesh);
			}
		}
	}
	//фланец для соединения косоуров на профиле
	if (par.type == "joinProf") {
		var flanPar = {
			width: params.profileWidth + 120.0 + 2, //ширина фланца
			height: 60 + params.profileHeight + 20 + 2, //длина фланца (высота при вертикальном расположении)
			holeRad: 9,
			cornerRad: 10,
			holeX: 30,
			holeY: 20,
			dxfBasePoint: par.dxfBasePoint,
        };
	    flanPar.drawing = {
	        name: par.name,
	        group: "carcasFlans",
	        marshId: par.marshId,
        }

		flanPar.noBolts = true; //болты не добавляются
		var sidePlateOverlay = params.sidePlateOverlay;
		if (par.topEnd == 'забег') sidePlateOverlay -= params.flanThickness;
		if (par.topEnd == "площадка") sidePlateOverlay = 7 + (params.sidePlateOverlay - 7);
		flanPar.height = 60 - params.treadPlateThickness + params.profileHeight + sidePlateOverlay + 20;
		if (par.height) flanPar.height = par.height;
		par.height = flanPar.height;

		var marshIdFix = par.marshId;
		if (par.marshIdFix) marshIdFix = par.marshIdFix;
		flanPar.isFixPart = true; // болты крепления к стенам
		flanPar.fixPar = getFixPart(marshIdFix); // параметры крепления к стенам


		flanPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, -flanPar.width - 100);

		//добавляем  отверстия по краям
		flanPar.roundHoleCenters = [];
		flanPar.holeRad = flanPar.fixPar.diamHole / 2;
		addHolesMonoFlan(flanPar);

		//добавляем прямоугольное отверстие под трубу

		var sidePlateOvelayHole = params.sidePlateOverlay;
		if (par.botEnd == 'площадка') sidePlateOvelayHole = 7 + (params.sidePlateOverlay - 7);
		var center = { x: flanPar.width / 2, y: flanPar.height - params.profileHeight / 2 - Math.abs(par.stringerHeight) + sidePlateOvelayHole};// - params.profileHeight / 2 - (60 + sidePlateOverlay - params.treadPlateThickness - 7) };//Подогнано 7 везде отступ
		if (par.topEnd == "площадка") center.y += sidePlateOverlay - params.sidePlateOverlay;
		if (par.isPlatform) center.y -= (params.sidePlateOverlay - 7);
		if (!flanPar.pathHoles) flanPar.pathHoles = [];
		flanPar.pathHoles.push(pathPolygonHole(center, params.profileWidth / 2 + 1, params.profileHeight / 2 + 1, flanPar.dxfBasePoint));
		par.centerHolePos = center;
		var flan = drawRectFlan2(flanPar).mesh;
		flan.position.z = flanPar.width / 2;
		// flan.position.y = - flanPar.height + 58 + params.sidePlateOverlay;
		flan.rotation.y = Math.PI / 2;

		// var center = { x: flanPar.width / 2, y: flanPar.height - params.profileHeight / 2 - (60 + params.sidePlateOverlay - params.treadPlateThickness) };
		// if (par.topEnd == "площадка") center.y += 7 - params.sidePlateOverlay;
		// if (!flanPar.pathHoles) flanPar.pathHoles = [];
		// flanPar.pathHoles.push(pathPolygonHole(center, params.profileWidth / 2 + 1, params.profileHeight / 2 + 1, flanPar.dxfBasePoint));
		// par.centerHolePos = center;
		// var flan = drawRectFlan2(flanPar).mesh;
		// flan.position.z = flanPar.width / 2;
		// flan.position.y = - flanPar.height + 58 + params.sidePlateOverlay;
		// flan.rotation.y = Math.PI / 2;
	}
	//крепление к верхнему перекрытию
	if (par.type == "top") {
		var holOffZapTop = 0;
		var holOffZapBot = 0;
		if (params.topAnglePosition == "над ступенью")
			holOffZapTop = params.metalThickness + params.treadThickness + params.topHolePos + 20.0;
		else holOffZapBot = Math.abs(params.topHolePos) + 20;

		var flanPar = {
			height: params.stringerThickness, //ширина фланца
			width: params.stringerThickness + 110.0, //длина фланца (высота при вертикальном расположении)
			holeRad: 6.5,
			cornerRad: 20,
			holeX: 20,
			holeY: 20,
			dxfBasePoint: par.dxfBasePoint,
		};
		flanPar.noBolts = true; //болты не добавляются

		flanPar.isFixPart = true; // болты крепления к стенам
		flanPar.fixPar = getFixPart(0, 'topFloor'); // параметры крепления к стенам
		flanPar.fixPar.diamHole = 15;

		if (params.platformTop != "площадка") {
			flanPar.height = par.pointsShape[par.pointsShape.length - 2].y - par.pointsShape[par.pointsShape.length - 1].y;
		}
		flanPar.height += Math.abs(params.topHolePos) + 20.0;
		if (params.topAnglePosition == "над ступенью") flanPar.height += params.treadThickness + params.metalThickness;

	    flanPar.drawing = {
	        name: par.name,
	        group: "carcasFlans",
	        marshId: par.marshId,
	    }

		flanPar.roundHoleCenters = [];

		//добавляем  отверстия в центре
		flanPar.holOffY = (holOffZapBot - 5) / 2;
		flanPar.holOffY += -holOffZapTop / 2;
		flanPar.roundHoleCenters =
			flanCentralHoles(par.pointsShape[par.pointsShape.length - 2].y - par.pointsShape[par.pointsShape.length - 1].y, 10);
		mooveFlanHoles(flanPar);

		flanPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint,
			par.pointsShape[par.pointsShape.length - 2].x + 100,
			par.pointsShape[par.pointsShape.length - 2].y - flanPar.height + holOffZapTop);


		if (params.topAnglePosition == "под ступенью") {			
			//добавляем  отверстия по краям			
			addHolesMonoFlan(flanPar);			
			var flan = drawRectFlan2(flanPar).mesh;
		}
		if (params.topAnglePosition == "над ступенью") {
			flanPar.heightBot = par.pointsShape[par.pointsShape.length - 2].y - par.pointsShape[par.pointsShape.length - 1].y - 2 * params.metalThickness - 5;
			flanPar.widthBot = params.stringerThickness + 20;
			var flan = drawFlanTop(flanPar).mesh;
		}

		flan.position.z = flanPar.width / 2;
		flan.position.y = -flanPar.height + holOffZapTop;
		flan.rotation.y = Math.PI / 2;

		if (params.topAnglePosition == "над ступенью") flanPar.height += 10;
	}
	//верхний фланец-заглушка
	if (par.type == "topStub") {
		var flanPar = {
			width: params.stringerThickness - 2 * params.metalThickness, //ширина фланца
			height: params.stringerThickness - 2 * params.metalThickness - 5, //длина фланца (высота при вертикальном расположении)
			holeRad: 6.5,
			cornerRad: 0,
			holeX: 20,
			holeY: 50,
            dxfBasePoint: par.dxfBasePoint,
			mirrowBolts: true,
		};

		if (params.platformTop != "площадка") {
			flanPar.height = par.pointsShape[par.pointsShape.length - 2].y - par.pointsShape[par.pointsShape.length - 1].y - 2 * params.metalThickness - 5;
		}

		if (par.pointCurrentSvg) {
			flanPar.drawing = {
				name: "Внутренний фланец-заглушка",
                group: "carcasFlans_In",
				marshId: par.marshId,
				basePoint: newPoint_xy(par.pointCurrentSvg, -par.pointStartSvg.x, -par.pointStartSvg.y),
			}
		}

		flanPar.roundHoleCenters = [];
		//добавляем  отверстия в центре
		flanPar.roundHoleCenters = flanCentralHoles(par.pointsShape[par.pointsShape.length - 2].y - par.pointsShape[par.pointsShape.length - 1].y, 10);
		mooveFlanHoles(flanPar);

		//добавляем  вырез в виде треугольника 10х10
		var center = { x: flanPar. width / 2, y: flanPar.roundHoleCenters[1].y };
		flanPar.pathHoles = [];
		var hole = new THREE.Path();
		var p1 = { x: center.x, y: center.y + 10 / Math.sqrt(3) };
		var p2 = polar(p1, -Math.PI / 3, 10);
		var p3 = polar(p2, Math.PI, 10);
		addLine(hole, dxfPrimitivesArr, p1, p2, dxfBasePoint);
		addLine(hole, dxfPrimitivesArr, p2, p3, dxfBasePoint);
		addLine(hole, dxfPrimitivesArr, p3, p1, dxfBasePoint);
		flanPar.pathHoles.push(hole);


		flanPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, flanPar.width + 100);
		var boltBulgeTemp = boltBulge;
		boltBulge = 14;
		flanPar.dzBolt = -6;

		var flan = drawRectFlan2(flanPar).mesh;
		flan.position.z = flanPar.width / 2;
		flan.position.y = -flanPar.height - 5 - params.metalThickness;
		flan.rotation.y = Math.PI / 2;

		boltBulge = boltBulgeTemp;
	}
	//нижний фланец колонны
	if (par.type == "botColon") {
		var flanPar = {
			width: par.profSize + 100, //ширина фланца
			height: par.profSize + 100, //длина фланца (высота при вертикальном расположении)
			holeRad: 9,
			cornerRad: 10,
			holeX: 20,
			holeY: 20,
			dxfBasePoint: par.dxfBasePoint,
        };
	    if (par.isSvg) {
	        flanPar.drawing = {
                name: "Фланец колонны нижний: кол-во - " + par.countColon + " шт.",
	            group: "carcasFlans",
	            marshId: par.marshId,
	        }
	    }
	    flanPar.noBolts = true; //болты не добавляются
		//flanPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, -flanPar.width - 100);
		flanPar.dxfBasePoint.y -= flanPar.width + 100;

		flanPar.isFixPart = true; // болты крепления к стенам
		flanPar.fixPar = getFixPart(0, 'botFloor'); // параметры крепления к стенам

		//добавляем  отверстия по краям
		flanPar.roundHoleCenters = [];
		addHolesMonoFlan(flanPar);

		//добавляем прямоугольное отверстие под трубу
		var center = { x: flanPar.width / 2, y: flanPar.height / 2 };
		if (!flanPar.pathHoles) flanPar.pathHoles = [];
		flanPar.pathHoles.push(pathPolygonHole(center, par.profSize / 2 + 1, par.profSize / 2 + 1, flanPar.dxfBasePoint));

		var flan = drawRectFlan2(flanPar).mesh;
		flan.rotation.x = Math.PI / 2;
		flan.position.x = -flanPar.width / 2;
		flan.position.z = -flanPar.height / 2;
		flan.position.y = params.flanThickness;
	}
	//верхний фланец колонны
	if (par.type == "topColon") {
		var flanPar = {
			height: par.profSize, //ширина фланца
			width: par.profSize / Math.cos(par.topAngle) + 100, //длина фланца (высота при вертикальном расположении)
			holeRad: 6.5,
			cornerRad: 10,
			holeX: 20,
			holeY: 20,
			dxfBasePoint: par.dxfBasePoint,
			marshId: par.marshId,
        };
	    if (par.isSvg) {
	        flanPar.drawing = {
	            name: "Фланец колонны верхний",
	            group: "carcasFlans",
                marshId: par.marshId,
                isRotate: true,
                basePoint: { x: flanPar.height / 2 - flanPar.width / 2, y: flanPar.height / 2 - flanPar.width / 2},//коррекция положения после поворота
            }
	    }
		

		//flanPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, -flanPar.width - 100);
		flanPar.dxfBasePoint.y -= flanPar.width + 100;

		if (params.model == "сварной") {
			//добавляем  отверстия по краям
			flanPar.roundHoleCenters = [];
			addHolesMonoFlan(flanPar);

			var boltLenTemp = boltLen;
			boltLen = 40;
			flanPar.mirrowBolts = true;
			flanPar.dzBolt = 24;
			var flan = drawRectFlan2(flanPar).mesh;
			boltLen = boltLenTemp;
		}

		if (params.model == "труба") {
			var flan = drawFlanPipColumnTop(flanPar).mesh;
		}

		flan.rotation.x = -Math.PI / 2;
		flan.rotation.y = -par.topAngle;
		flan.position.x = -flanPar.width / 2 * Math.cos(par.topAngle);
		flan.position.y = -flanPar.width / 2 * Math.sin(par.topAngle);
		flan.position.z = flanPar.height / 2;
	}

	par.mesh = flan;

	function addHolesMonoFlan(par) {
		var hole1Y = par.holeY;
		var hole2Y = par.holeY;
		if (par.hole1Y) hole1Y = par.hole1Y;
		if (par.hole2Y) hole2Y = par.hole2Y;
		//функция добавляет координаты отверстий по краям фланца
		par.roundHoleCenters.push({ x: par.holeX, y: hole1Y, holeData: {zenk: 'no'}, isFixPart: par.isFixPart });
		par.roundHoleCenters.push({ x: par.holeX, y: par.height - hole2Y, holeData: { zenk: 'no' }, isFixPart: par.isFixPart});
		par.roundHoleCenters.push({ x: par.width - par.holeX, y: par.height - hole2Y, holeData: { zenk: 'no' }, isFixPart: par.isFixPart});
		par.roundHoleCenters.push({ x: par.width - par.holeX, y: hole1Y, holeData: { zenk: 'no' }, isFixPart: par.isFixPart});		
	}
	function flanCentralHoles(length, shiftTopHoles) {
		//функция возвращает координаты центральных отверстий от центра фланца (для нижнего и верхнего фланцев)
		var x = params.stringerThickness / 2 - params.metalThickness - 20;
		var y = length / 2 - params.metalThickness - 30;
		var p0 = { x: 0, y: 0 };
		var c1 = newPoint_xy(p0, - x, -y);
		var c2 = newPoint_xy(p0, - x, y);
		var c3 = newPoint_xy(p0, x, -y);
		var c4 = newPoint_xy(p0, x, y);

		if (shiftTopHoles) c2.y = c4.y -= shiftTopHoles;

		return [c1, c2, c3, c4];
	}
	function mooveFlanHoles(par) {
		//функция пересчитывает координаты отверстий от центра фланца к углу
		var dy = 0;
		if (par.holOffY) dy = par.holOffY;

		for (var i = 0; i < par.roundHoleCenters.length; i++) {
			par.roundHoleCenters[i].x += par.width / 2;
			par.roundHoleCenters[i].y += par.height / 2 + dy;
		}
	}


	//сохраняем данные для спецификации

	if (par.type == "bot" || par.type == "join" || par.type == "joinStrong" || par.type == "top") {
		var partName = "carcasFlan";
		if (typeof specObj != 'undefined'){
			if (!specObj[partName]){
				specObj[partName] = {
					types: {},
					amt: 0,
					area: 0,
					name: "Съемный фланец",
					metalPaint: true,
					timberPaint: false,
					division: "metal",
					workUnitName: "amt", //единица измерения
					group: "Каркас",
				}
			}
			var name = Math.round(flanPar.width) + "х" + Math.round(flanPar.height) + "х" + 8;
			var area = flanPar.width * flanPar.height / 1000000;
			if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
			if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
			specObj[partName]["amt"] += 1;
			specObj[partName]["area"] += area;
		}
		par.mesh.specId = partName + name;
	}

	return par;
}

/** функция отрисовывает болты во фланцах и подложках
*/

function drawPlateBolts(par) {

	par.mesh = new THREE.Object3D();

	if (par.type == "подложка сварной") {
		if (typeof anglesHasBolts != "undefined" && anglesHasBolts && !par.noBolts
		) { //anglesHasBolts - глобальная переменная)
			var boltPar = {
				diam: boltDiam,
				len: boltLen,
				headType: "потай",
			}

			for (var i = 0; i < par.holesCenter.length; i++) {
				var bolt = drawBolt(boltPar).mesh;

				bolt.rotation.x = Math.PI;
				bolt.position.x = par.holesCenter[i].y;
				bolt.position.y = -boltLen / 2 + params.treadPlateThickness - 0.01;
				bolt.position.z = par.holesCenter[i].x;

				par.mesh.add(bolt);
			}
		}
	}

	if (par.type == "подложка труба") {
		if (typeof anglesHasBolts != "undefined" && anglesHasBolts && !par.noBolts) { //anglesHasBolts - глобальная переменная)
			var boltPar = {
				diam: boltDiam,
				len: boltLen,
				headType: "меб.",
			}
			if (par.length) boltPar.len = par.length;

			for (var i = 0; i < par.holesCenter.length; i++) {
				var bolt = drawBolt(boltPar).mesh;

				bolt.position.x = par.holesCenter[i].x;
				bolt.position.y = par.holesCenter[i].y;
				bolt.rotation.x = Math.PI / 2;

				par.mesh.add(bolt);
			}
		}
	}

		if (par.type == "фланец труба") {
		if (typeof anglesHasBolts != "undefined" && anglesHasBolts && !par.noBolts) { //anglesHasBolts - глобальная переменная)

			//верхние болты
			var boltPar = {
				diam: 16,
				len: 40,
				headType: "шестигр.",
				hasCapNut: true
			}

			//задаем длину болтов
			par.holesCenter[0].boltLen = 30; //болт в пластину
			par.holesCenter[1].boltLen = 30;
			par.holesCenter[2].boltLen = 130; //болт насквозь через профиль
			par.holesCenter[3].boltLen = 130;
			if(par.isWndTurn) {
				if(turnFactor == 1) par.holesCenter[3].boltLen = 30;
				if(turnFactor == -1) par.holesCenter[2].boltLen = 30;
				}

			for (var i = 0; i < par.holesCenter.length; i++) {
				boltPar.len = par.holesCenter[i].boltLen
				var bolt = drawBolt(boltPar).mesh;

				bolt.rotation.x = Math.PI / 2;
				bolt.position.x = par.holesCenter[i].x;
				bolt.position.y = par.holesCenter[i].y;
				bolt.position.z = -boltPar.len / 2 + 10;


				par.mesh.add(bolt);
			}

		}
	}
	if (par.type == "фланец сварной") {
		if (typeof anglesHasBolts != "undefined" && anglesHasBolts && !par.noBolts) { //anglesHasBolts - глобальная переменная)

			//верхние болты
			var boltPar = {
				diam: 10,
				len: 40,
				headType: "шестигр.",
			}

			//задаем длину болтов
			par.holesCenter[0].boltLen = 40; //болт в пластину
			par.holesCenter[1].boltLen = 40;
			par.holesCenter[2].boltLen = 40; 
			par.holesCenter[3].boltLen = 40;

			for (var i = 0; i < par.holesCenter.length; i++) {
				boltPar.len = par.holesCenter[i].boltLen
				var bolt = drawBolt(boltPar).mesh;

				bolt.rotation.x = Math.PI / 2;
				bolt.position.x = par.holesCenter[i].x;
				bolt.position.y = par.holesCenter[i].y;
				bolt.position.z = -boltPar.len / 2 + 25;


				par.mesh.add(bolt);
			}

		}
	}

	return par;
}

function holesColumnPlatform(par, isBot, isTop) {
	var parHoles = {};

	if (params.stairModel == "Г-образная с площадкой") {
		if (params.isColumn1 && par.marshId == "1" && par.topConnection && isTop) {
			// parHoles.isColonPlatformBackTop = true;
			parHoles.top2Visible = true;
		}
		if (params.isColumn2 && par.marshId == "1" && par.topConnection && isTop) {
			// parHoles.isColonPlatformMiddleTop = true;
			parHoles.top1Visible = true;
		}
		if (params.isColumn1 && par.marshId == "3" && par.botConnection && isBot) {
			// parHoles.isColonPlatformBackBot = true;
			parHoles.bot1Visible = true;
		}
		if (params.isColumn2 && par.marshId == "3" && par.botConnection && isBot) {
			// parHoles.isColonPlatformMiddleBot = true;
			parHoles.bot2Visible = true;
		}
	}
	if (params.stairModel == "Г-образная с забегом") {
		if (params.isColumn1 && par.marshId == "1" && par.topConnection && isTop) {
			parHoles.top2Visible = true;
		}
		if (params.isColumn2 && par.marshId == "1" && par.topConnection && isTop) {
			parHoles.top1Visible = true;
		}
		if (params.isColumn1 && par.marshId == "1" && !par.topConnection && isTop) {
			parHoles.top1Visible = true;
		}
		// if ((!params.isColumn1 && !params.isColumn2) && par.marshId == "1" && !par.topConnection && isTop) {
		// 	parHoles.top1Visible = true;
		// }
	}

	if (params.stairModel == "П-образная трехмаршевая") {
		if (params.isColumn1 && par.marshId == "1" && par.topConnection && isTop) {
			parHoles.top2Visible = true;
		}
		if (params.isColumn2 && par.marshId == "1" && par.topConnection && isTop) {
			parHoles.top1Visible = true;
		}
		if (params.isColumn1 && par.marshId == "2" && par.botConnection && par.botEnd !== 'забег' && isBot) {
			parHoles.bot1Visible = true;
		}
		if (params.isColumn2 && par.marshId == "2" && par.botConnection && par.botEnd !== 'забег' && isBot) {
			parHoles.bot2Visible = true;
		}

		if (params.isColumn4 && par.marshId == "2" && par.topConnection && isTop) {
			parHoles.top2Visible = true;
		}
		if (params.isColumn3 && par.marshId == "2" && par.topConnection && isTop) {
			parHoles.top1Visible = true;
		}
		if (params.isColumn4 && par.marshId == "3" && par.botConnection && par.botEnd !== 'забег' && isBot) {
			parHoles.bot1Visible = true;
		}
		if (params.isColumn3 && par.marshId == "3" && par.botConnection && par.botEnd !== 'забег' && isBot) {
			parHoles.bot2Visible = true;
		}

		if (params.isColumn1 && par.topEnd == 'забег' && !par.topConnection && isTop) parHoles.top1Visible = true;

		// if (!params.isColumn1 && !params.isColumn2 && par.topEnd == 'забег' && !par.topConnection && par.marshId == 1 && isTop) parHoles.top1Visible = true;
		// if (!params.isColumn3 && !params.isColumn4 && par.topEnd == 'забег' && !par.topConnection && par.marshId == 2 && isTop) parHoles.top1Visible = true;
	}
	if (params.stairModel == "П-образная с забегом") {
		if (params.isColumn1 && par.marshId == "1" && isTop) {
			parHoles.top2Visible = true;
		}
		if (params.isColumn2 && par.marshId == "1" && isTop) {
			parHoles.top1Visible = true;
		}
		// if ((!params.isColumn1 && !params.isColumn2) && par.marshId == "1" && !par.topConnection && isTop) {
		// 	parHoles.top1Visible = true;
		// }


		if (params.isColumn4 && par.marshId == "2" && isTop) {
			parHoles.top2Visible = true;
		}
		if (params.isColumn3 && par.marshId == "2" && isTop) {
			parHoles.top1Visible = true;
		}
		// if ((!params.isColumn4 && !params.isColumn3) && par.marshId == "2" && !par.topConnection && isTop) {
		// 	parHoles.top1Visible = true;
		// }
	}

	if (params.stairModel == "П-образная с площадкой") {
		if (params.isColumn1 && par.marshId == "1" && par.topConnection && isTop) {
			parHoles.top2Visible = true;
		}
		//if (params.isColumn1 && par.marshId == "1" && !par.topConnection && isTop) {
		//	parHoles.top1Visible = true;
		//}

		if (params.isColumn2 && par.marshId == "1" && isTop) {
			parHoles.top1Visible = true;
		}


		if (params.isColumn3 && par.marshId == "3" && isBot) {
			parHoles.bot2Visible = true;
		}
		if (params.isColumn4 && par.marshId == "3" && isBot) {
			parHoles.bot1Visible = true;
		}

	}

	if (!params.isColumn1 && !params.isColumn2 && par.topEnd == 'забег' && par.marshId == 1 && !par.topConnection && isTop) parHoles.top1Visible = true;
	if (!params.isColumn3 && !params.isColumn4 && par.topEnd == 'забег' && par.marshId !== 1 && !par.topConnection && isTop) parHoles.top1Visible = true;

	if (params.isColumn1 && par.topEnd == 'забег' && par.marshId == 1 && !par.topConnection && isTop) {
		parHoles.top1Visible = true;
		parHoles.top2Visible = false;
	}
	if (params.isColumn3 && par.topEnd == 'забег' && par.marshId !== 1 && !par.topConnection && isTop) {
		parHoles.top1Visible = true;
		parHoles.top2Visible = false;
	}

	if ($.isEmptyObject(parHoles)) parHoles = false;
	return parHoles;
}


/***   ФУНКЦИИ ВЕРСИИ 3.0   ***/

/**
 * ЗАДАНИЕ РАСПОЛОЖЕНИЯ СТОЕК ;;;
 */


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


/* функция отрисовки подложки первой забежной ступени*/

function drawTurn1TreadPlateCabriole(par) {
	var stringerPlateThickness = params.treadPlateThickness;
	var h1 = par.h;
	var treadPlateWidth = params.stringerThickness + params.M / 3;
	var treadPlateHeight = par.step - params.treadPlateThickness;
	var holeRad = 4;
	var turnParams = par.turnSteps;
	var firstboultoffsert = 20;
	var dxfBasePoint = par.dxfBasePoint;
	var profileWidth = params.profileWidth;
	par.stringerMaterial = params.materials.metal2;
	par.sidePlateWidth = params.sidePlateWidth;
	par.sidePlateOverlay = params.sidePlateOverlay;
	par.strapThickness = params.metalThickness;
	par.turn = turnFactor;
	par.isTop = true
	par.isBot = true
	par.isIn = true

	var marshPar = getMarshParams(par.marshId);

	var dxfArr = dxfPrimitivesArr;
	if (turnFactor == 1) dxfArr = {};

	var basePointSvg = { x: 0, y: 0 };

	par.stringerTreadPlateExtrudeOptions = {
		amount: params.treadPlateThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};



	var marsh = 0;
	if (par.marsh && par.marsh !== 0)
		marsh = par.marsh - 60;

	var treadPlate = new THREE.Object3D();

	var p0 = { x: 0, y: 0 };
	var p1 = newPoint_xy(p0, 0, turnParams.stepWidthLow + marsh - stringerPlateThickness * Math.cos(turnParams.edgeAngle) + 0.1);
	var p2 = newPoint_xy(p0, turnParams.treadWidth, 0);
	var p3 = newPoint_xy(p2, 0, turnParams.stepWidthHi + marsh - stringerPlateThickness * Math.cos(turnParams.edgeAngle) + 0.1);

	var dy = par.turnNumber == 4 ? 45 + stringerPlateThickness * 2 : 50;
	if (par.turnNumber == 11)
		dy = 50 + stringerPlateThickness;

	var pt0 = newPoint_xy(p0, (turnParams.treadWidth - treadPlateWidth) / 2, dy);
	var pt2 = newPoint_xy(p2, -(turnParams.treadWidth - treadPlateWidth) / 2, dy);
	var pt1 = itercection(p1, p3, pt0, polar(pt0, Math.PI / 2, 100));
	var pt3 = itercection(p1, p3, pt2, polar(pt2, Math.PI / 2, 100));

	var pv0 = { x: 0, y: 0 };
	var pv1 = newPoint_xy(pv0, 0, distance(pt1, pt0));
	var pv2 = newPoint_xy(pv0, distance(pt2, pt0), 0);
	var pv3 = newPoint_xy(pv2, 0, distance(pt3, pt2));

	var pi0 = newPoint_xy(pv2, -treadPlateWidth / 2 + profileWidth / 2, 0);
	var pi00 = newPoint_xy(pv2, -treadPlateWidth / 2 - profileWidth / 2, 0);
	var pi1 = itercection(pv1, pv3, pi0, polar(pi0, Math.PI / 2, 100));
	var pi2 = itercection(pv1, pv3, pi00, polar(pi00, Math.PI / 2, 100));
	var angle1 = Math.atan(h1 / distance(pi1, pi0));

	// создаем shape для Object3D
	{
		var shape = new THREE.Shape();

		addLine(shape, dxfArr, pv0, pv2, dxfBasePoint);
		addLine(shape, dxfArr, pv2, pv3, dxfBasePoint);
		addLine(shape, dxfArr, pv3, pv1, dxfBasePoint);
		addLine(shape, dxfArr, pv1, pv0, dxfBasePoint);

		//размеры для спецификации
		var sizeA = Math.round(distance(pv0, pv2))
		var sizeB = Math.round(distance(pv2, pv3))

		hole1 = new THREE.Path();
		hole2 = new THREE.Path();
		hole3 = new THREE.Path();
		hole4 = new THREE.Path();

		var dy = firstboultoffsert * Math.tan(turnParams.edgeAngle);
		center1 = newPoint_xy(pv0, firstboultoffsert, firstboultoffsert);
		center2 = newPoint_xy(pv1, firstboultoffsert, -firstboultoffsert + dy);
		center3 = newPoint_xy(pv3, -firstboultoffsert, -firstboultoffsert - dy);
		center4 = newPoint_xy(pv2, -firstboultoffsert, firstboultoffsert);

		addCircle(hole1, dxfArr, center1, holeRad, par.dxfBasePoint);
		addCircle(hole2, dxfArr, center2, holeRad, par.dxfBasePoint);
		addCircle(hole3, dxfArr, center3, holeRad, par.dxfBasePoint);
		addCircle(hole4, dxfArr, center4, holeRad, par.dxfBasePoint);

		shape.holes.push(hole1);
		shape.holes.push(hole2);
		shape.holes.push(hole3);
		shape.holes.push(hole4);

		// отрисовка центрального отверстия

		//углы треугольника без учета скруглений
		var p0 = { x: 0, y: 0 };
		var p1 = newPoint_xy(p0, treadPlateWidth / 2 - profileWidth / 2 + 10, 15);
		var p2 = newPoint_xy(p0, treadPlateWidth / 2 - profileWidth / 2 + 10, (distance(pi2, pi00) - 33));
		var p3 = newPoint_xy(p0, treadPlateWidth / 2 + profileWidth / 2 - 10, (distance(pi2, pi00) - 33));
		var p4 = newPoint_xy(p0, treadPlateWidth / 2 + profileWidth / 2 - 10, 15);


		var hole = new THREE.Path();
		var vertexes = []; //массив вершин

		vertexes[0] = p1;
		vertexes[1] = p2;
		vertexes[2] = p3;
		vertexes[3] = p4;

		var filletParams = {
			vertexes: vertexes,
			cornerRad: 10,
			dxfBasePoint: dxfBasePoint,
			dxfPrimitivesArr: dxfArr,
			type: "path"
		}

		hole = fiiletPathCorners(filletParams);
		shape.holes.push(hole);

		var geom = new THREE.ExtrudeGeometry(shape, par.stringerTreadPlateExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		var tread1 = new THREE.Mesh(geom, par.stringerMaterial);
		tread1.position.x = stringerPlateThickness;
		tread1.rotation.x = toRadians(90);
		tread1.rotation.y = toRadians(0);
		tread1.rotation.z = toRadians(270);

		treadPlate.add(tread1);

		//саморезы
		var holes = [center1, center2, center3, center4];
		var screwPar = {
			id: "screw_6x32",
			description: "Крепление ступеней",
			group: "Ступени"
		}
		if(params.stairType !== 'нет') {
			for (var i = 0; i < holes.length; i++) {
				var screw = drawScrew(screwPar).mesh;
				screw.position.x = holes[i].y + stringerPlateThickness;
				screw.position.z = -holes[i].x;
				treadPlate.add(screw)
			}
		}
	}

	//для правой лестницы зеркалим чертеж для svg и dxf
	if (turnFactor == 1) {
		var shape = new THREE.Shape();
		dxfArr = dxfPrimitivesArr;
		var dxfPoint = newPoint_xy(dxfBasePoint, pv3.x, 0);
		var pvm0 = copyPoint(pv0);
		var pvm1 = copyPoint(pv1);
		var pvm2 = copyPoint(pv2);
		var pvm3 = copyPoint(pv3);
		pvm0.x *= -1;
		pvm1.x *= -1;
		pvm2.x *= -1;
		pvm3.x *= -1;
		addLine(shape, dxfArr, pvm0, pvm2, dxfPoint);
		addLine(shape, dxfArr, pvm2, pvm3, dxfPoint);
		addLine(shape, dxfArr, pvm3, pvm1, dxfPoint);
		addLine(shape, dxfArr, pvm1, pvm0, dxfPoint);

		
		hole1 = new THREE.Path();
		hole2 = new THREE.Path();
		hole3 = new THREE.Path();
		hole4 = new THREE.Path();

		var dy = firstboultoffsert * Math.tan(turnParams.edgeAngle);
		center1 = newPoint_xy(pvm0, -firstboultoffsert, firstboultoffsert);
		center2 = newPoint_xy(pvm1, -firstboultoffsert, -firstboultoffsert + dy);
		center3 = newPoint_xy(pvm3, firstboultoffsert, -firstboultoffsert - dy);
		center4 = newPoint_xy(pvm2, firstboultoffsert, firstboultoffsert);

		addCircle(hole1, dxfArr, center1, holeRad, dxfPoint);
		addCircle(hole2, dxfArr, center2, holeRad, dxfPoint);
		addCircle(hole3, dxfArr, center3, holeRad, dxfPoint);
		addCircle(hole4, dxfArr, center4, holeRad, dxfPoint);

		shape.holes.push(hole1);
		shape.holes.push(hole2);
		shape.holes.push(hole3);
		shape.holes.push(hole4);

		// отрисовка центрального отверстия

		//углы треугольника без учета скруглений
		var p0 = { x: 0, y: 0 };
		var p1 = newPoint_xy(p0, -treadPlateWidth / 2 + profileWidth / 2 - 10, 15);
		var p2 = newPoint_xy(p0, -treadPlateWidth / 2 + profileWidth / 2 - 10, (distance(pi2, pi00) - 33));
		var p3 = newPoint_xy(p0, -treadPlateWidth / 2 - profileWidth / 2 + 10, (distance(pi2, pi00) - 33));
		var p4 = newPoint_xy(p0, -treadPlateWidth / 2 - profileWidth / 2 + 10, 15);


		var hole = new THREE.Path();
		var vertexes = []; //массив вершин

		vertexes[0] = p4;
		vertexes[1] = p3;
		vertexes[2] = p2;
		vertexes[3] = p1;

		var filletParams = {
			vertexes: vertexes,
			cornerRad: 10,
			dxfBasePoint: dxfPoint,
			dxfPrimitivesArr: dxfArr,
			type: "path"
		}

		hole = fiiletPathCorners(filletParams);
		shape.holes.push(hole);
	}

	shape.drawing = {
		name: "Подложка",
		group: "treadPlate",
		type: "top",
		marshId: par.marshId + "_Turn1TreadPlate",
		plateId: par.plateId,
		basePoint: copyPoint(basePointSvg),
	}
	shapesList.push(shape);
	basePointSvg.x += distance(pv0, pv2) + 100;

	//dxfBasePoint.y += distance(pv3, pv2) + 40;
	var dxfY = dxfBasePoint.y;
	dxfBasePoint.x += Math.abs(pv3.x) + 40;
	dxfBasePoint.y += h1 + stringerPlateThickness + 40;

	if (par.isTop) {
		var shape = new THREE.Shape();

		var heigth = 30;
		treadPlateWidth = distance(pv3, pv1);

		if (params.railingModel == "Деревянные балясины" || params.railingModel == "Дерево с ковкой")
			treadPlateWidth -= 50;

		var p0 = copyPoint(pv0);
		var p1 = newPoint_xy(p0, 0, 30);
		var p2 = newPoint_xy(p1, treadPlateWidth, 0);
		var p3 = newPoint_xy(p2, 0, -30);

		var rad = 10;
		var clockwise = true;

		addLine(shape, dxfPrimitivesArr, p0, newPoint_xy(p1, 0, -rad), dxfBasePoint);
		addArc2(shape, dxfPrimitivesArr, newPoint_xy(p1, rad, -rad), rad, Math.PI, Math.PI / 2, clockwise, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, newPoint_xy(p1, rad, 0), newPoint_xy(p2, -rad, 0), dxfBasePoint);
		addArc2(shape, dxfPrimitivesArr, newPoint_xy(p2, -rad, -rad), rad, Math.PI / 2, 0, clockwise, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, newPoint_xy(p2, 0, -rad), p3, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p3, p0, dxfBasePoint);

		var geom = new THREE.ExtrudeGeometry(shape, par.stringerTreadPlateExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		var tread2 = new THREE.Mesh(geom, par.stringerMaterial);

		tread2.position.x = distance(pv1, pv0) + stringerPlateThickness;
		tread2.position.x += -stringerPlateThickness / Math.cos(turnParams.edgeAngle);
		tread2.position.z += stringerPlateThickness * Math.sin(turnParams.edgeAngle);
		
		tread2.rotation.y = -turnParams.edgeAngle + toRadians(90);

		tread2.rotation.z = toRadians(180) * (1 - par.turn) * 0.5;

		tread2.position.z = -treadPlateWidth * (1 - par.turn) * 0.5 * Math.cos(turnParams.edgeAngle);
		if (params.railingModel == "Деревянные балясины" || params.railingModel == "Дерево с ковкой") {
			tread2.position.z -= 50 * Math.cos(turnParams.edgeAngle);
			tread2.position.x += 50 * Math.sin(turnParams.edgeAngle);
		}
		tread2.position.x += (treadPlateWidth * Math.sin(turnParams.edgeAngle)) * (1 - par.turn) * 0.5;
		tread2.position.y = -stringerPlateThickness * (1 - par.turn) * 0.5;
		treadPlate.add(tread2);

		shape.drawing = {
			name: "Подложка",
			group: "treadPlate",
			type: "topBack",
			marshId: par.marshId + "_Turn1TreadPlate",
			plateId: par.plateId,
			basePoint: copyPoint(basePointSvg),
		}
		shapesList.push(shape);
		if (!par.isBot) basePointSvg.x += treadPlateWidth + 100;
		if (par.isBot) basePointSvg.y -= 100;
	}

	//dxfBasePoint.y -= distance(pv3, pv2) + 80;
	dxfBasePoint.y = dxfY + h1 + stringerPlateThickness;

	if (par.isBot) {
		var shape = new THREE.Shape();

		var heigth = h1;
		treadPlateWidth = distance(pv2, pv0);

		var p0 = copyPoint(pv0);
		var p1 = newPoint_xy(p0, treadPlateWidth, 0);
		var p2 = newPoint_xy(p1, 0, -20);
		var p3 = newPoint_xy(p0, treadPlateWidth / 2 + profileWidth / 2 + params.metalThickness, -h1 - stringerPlateThickness);
		var p4 = newPoint_xy(p0, treadPlateWidth / 2 - profileWidth / 2 - params.metalThickness, -h1 - stringerPlateThickness);
		var p5 = newPoint_xy(p0, 0, -20);

		addLine(shape, dxfPrimitivesArr, p0, p1, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p2, p3, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p3, p4, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p4, p5, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p5, p0, dxfBasePoint);

		var stringerTreadPlateExtrudeOptions = {
			amount: params.treadPlateThickness - 0.02,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};

		var geom = new THREE.ExtrudeGeometry(shape, stringerTreadPlateExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		var tread3 = new THREE.Mesh(geom, par.stringerMaterial);

		tread3.position.y = -stringerPlateThickness * (1 - par.turn) * 0.5;
		tread3.rotation.y = toRadians(90);
		tread3.rotation.z = toRadians(180) * (1 - par.turn) * 0.5;
		tread3.position.z = -treadPlateWidth * (1 - par.turn) * 0.5;

		treadPlate.add(tread3);

		shape.drawing = {
			name: "Подложка",
			group: "treadPlate",
			type: "botFront",
			marshId: par.marshId + "_Turn1TreadPlate",
			plateId: par.plateId,
			basePoint: copyPoint(basePointSvg),
		}
		shapesList.push(shape);
		if (!par.isTop) basePointSvg.x += treadPlateWidth + 100;
		if (par.isTop) basePointSvg.x += distance(pv3, pv1) + 100;
	}


	//dxfBasePoint.y += treadPlateHeight + 90 + distance(pv3, pv2);
	dxfBasePoint.x += distance(pv1, pv3) + 40;
	dxfBasePoint.y = dxfY;

	if (par.isIn) {
		par.widthIn = par.step - 25;
		par.heightIn = par.h - 25 - params.treadPlateThickness;

		if (par.angleIn1)
			angle1 = par.angleIn1;
		else
			par.angleIn1 = angle1;

		//внутренняя боковая пластина подложки
		var shape = new THREE.Shape();

		var p0 = { x: 0, y: 0 };
		var p1 = newPoint_xy(p0, 0, par.heightIn);
		var p2 = newPoint_xy(p1, distance(pi2, pi00) - 25, 0);
		//var pt1 = newPoint_xy(p1, 0, -h1 + stringerPlateThickness);
		//pt1 = newPoint_xy(p1, par.step, 0);
		//var dx = par.sidePlateWidth - par.sidePlateOverlay - 10;
		//if (par.isNotKinkTop) dx -= 20;
		//var pt2 = newPoint_xy(pt1, dx / Math.sin(angle1), 0);
		//var pt3 = polar(pt2, angle1, 100);
		//var p3 = itercection(p2, polar(p2, Math.PI * 3 / 2, 100), pt2, pt3);
		//var p4 = itercection(p0, polar(p0, 0, 100), pt2, pt3);

		var pt1 = newPoint_xy(p1, 0, -marshPar.h);
		var pt2 = polar(pt1, -(Math.PI / 2 - angle1), params.sidePlateWidth - params.sidePlateOverlay - 5);
		var pt3 = polar(pt2, angle1, 100);

		var p3 = itercection(p2, polar(p2, Math.PI / 2, 100), pt2, pt3);
		if (p3.y + 5 > p2.y) {
			var pt4 = itercection(p1, polar(p1, 0, 100), pt2, pt3);
			p2 = newPoint_xy(pt4, -10, 0);
			var p3 = itercection(p2, polar(p2, Math.PI / 2, 100), pt2, pt3);
		}
		var p4 = itercection(p0, polar(p0, 0, 100), pt2, pt3);

		var points = [p0, p1, p2, p3];

		if (par.isBotPipeHor) {
			var p5 = newPoint_xy(p1, 100 - params.sidePlateOverlay - 5, -params.h1 + params.profileHeight + 5);
			var p6 = itercection(p0, polar(p0, 0, 100), p5, polar(p5, Math.PI / 2, 100));
			p4 = itercection(p5, polar(p5, 0, 100), pt2, pt3);

			points.push(p4);
			points.push(p5);
			points.push(p6);
		}
		else {
			points.push(p4);
		}

		
		points = points.reverse();

		/*
		addLine(shape, dxfPrimitivesArr, p0, p1, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p2, p3, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p3, p4, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p4, p0, dxfBasePoint);
		*/

		//создаем шейп
		var shapePar = {
			points: points,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: dxfBasePoint,
			radOut: 0, //радиус скругления внешних углов
        }       

		var shape = drawShapeByPoints2(shapePar).shape;
		
		// отрисовка двух центральных отверстий под болты
		center1 = newPoint_xy(p0, 20, 20 - stringerPlateThickness);
		center2 = newPoint_xy(p1, 20, -20);

		var dist = setDistHoleTurn("1", turnParams);
		center3 = newPoint_xy(p1, dist.in, -20);

		var holesCenter = [center1, center2];
		addOvalHoleX(shape, dxfPrimitivesArr, center1, 6, 10, dxfBasePoint, true);
		addOvalHoleX(shape, dxfPrimitivesArr, center2, 6, 10, dxfBasePoint, true);
		if (center3.x - center2.x > 25) {
			addOvalHoleX(shape, dxfPrimitivesArr, center3, 6, 10, dxfBasePoint, true);
			holesCenter.push(center3)
		}


		var geom = new THREE.ExtrudeGeometry(shape, par.stringerTreadPlateExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		var tread1Obj = new THREE.Object3D();
		var tread1 = new THREE.Mesh(geom, par.stringerMaterial);
		tread1Obj.add(tread1);
		//болты
		if (par.type == "treadPlate") {
			var boltPar = {
				type: "подложка труба",
				holesCenter: holesCenter,
			}

			drawPlateBolts(boltPar);
			tread1Obj.add(boltPar.mesh);
		}
		tread1Obj.position.z = -(treadPlateWidth / 2 - profileWidth / 2 + stringerPlateThickness);
		tread1Obj.position.y = -par.heightIn - stringerPlateThickness;
		tread1Obj.position.x = stringerPlateThickness;

		tread1Obj.rotation.x = toRadians(180) * (1 - par.turn) * 0.5;
		tread1Obj.position.y += (par.heightIn + stringerPlateThickness / 2) * 2 * (1 - par.turn) * 0.5;
		tread1Obj.position.z += stringerPlateThickness * (1 - par.turn) * 0.5;

		treadPlate.add(tread1Obj);

		shape.drawing = {
			name: "Подложка",
			group: "treadPlate",
			type: "in",
			marshId: par.marshId + "_Turn1TreadPlate",
			plateId: par.plateId,
			basePoint: copyPoint(basePointSvg),
		}
		shapesList.push(shape);
		basePointSvg.x += distance(p1, p2) + 100;


		var shape = new THREE.Shape();

		//наружная боковая пластина подложки
		var p0 = { x: 0, y: 0 };
		var p1 = newPoint_xy(p0, 0, par.heightIn);
		var p2 = newPoint_xy(p1, distance(pi1, pi0) - 25, 0);
		//var pt1 = newPoint_xy(p1, 0, -h1 + stringerPlateThickness);
		//var pt1 = newPoint_xy(p1, par.step, 0);
		//var dx = par.sidePlateWidth - par.sidePlateOverlay - 10;
		//if (par.isNotKinkTop) dx -= 20;
		//var pt2 = newPoint_xy(pt1, dx / Math.sin(angle1), 0);
		//var pt3 = polar(pt2, angle1, 100);
		//var p3 = itercection(p2, polar(p2, Math.PI * 3 / 2, 100), pt2, pt3);
		//var p4 = itercection(p0, polar(p0, 0, 100), pt2, pt3);
		var pt1 = newPoint_xy(p1, 0, -marshPar.h);
		var pt2 = polar(pt1, -(Math.PI / 2 - angle1), params.sidePlateWidth - params.sidePlateOverlay - 5);
		var pt3 = polar(pt2, angle1, 100);

		var p3 = itercection(p2, polar(p2, Math.PI / 2, 100), pt2, pt3);
		if (p3.y + 5 > p2.y) {
			var pt4 = itercection(p1, polar(p1, 0, 100), pt2, pt3);
			p2 = newPoint_xy(pt4, -10, 0);
			var p3 = itercection(p2, polar(p2, Math.PI / 2, 100), pt2, pt3);
		}
		var p4 = itercection(p0, polar(p0, 0, 100), pt2, pt3);

		dxfBasePoint.x += distance(p2, p1) + 100;

		var points = [p3, p2, p1, p0]

		if (par.isBotPipeHor) {
			var p5 = newPoint_xy(p1, 100 - params.sidePlateOverlay - 5, -params.h1 + params.profileHeight + 5);
			var p6 = itercection(p0, polar(p0, 0, 100), p5, polar(p5, Math.PI / 2, 100));
			p4 = itercection(p5, polar(p5, 0, 100), pt2, pt3);

			points.push(p6);
			points.push(p5);
			points.push(p4);
		}
		else {
			points.push(p4);
		}

	    //создаем шейп
	    var shapePar = {
	        points: points,
	        dxfArr: dxfPrimitivesArr,
	        dxfBasePoint: dxfBasePoint,
	        radOut: 0, //радиус скругления внешних углов
	    }

	    var shape = drawShapeByPoints2(shapePar).shape;

		// отрисовка двух центральных отверстий под болты
		center1 = newPoint_xy(p0, 20, 20 - stringerPlateThickness);
		center2 = newPoint_xy(p1, 20, -20);
		center3 = newPoint_xy(p1, dist.out, -20);

		var holesCenter = [center1, center2];
		addOvalHoleX(shape, dxfPrimitivesArr, center1, 6, 10, dxfBasePoint, true);
		addOvalHoleX(shape, dxfPrimitivesArr, center2, 6, 10, dxfBasePoint, true);
		if (center3.x - center2.x > 25) {
			addOvalHoleX(shape, dxfPrimitivesArr, center3, 6, 10, dxfBasePoint, true);
			holesCenter.push(center3)
		}


		var geom = new THREE.ExtrudeGeometry(shape, par.stringerTreadPlateExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		var tread2Obj = new THREE.Object3D();
		var tread2 = new THREE.Mesh(geom, par.stringerMaterial);
		tread2Obj.add(tread2);
		//болты
		if (par.type == "treadPlate") {
			var boltPar = {
				type: "подложка труба",
				holesCenter: holesCenter,
			}

			drawPlateBolts(boltPar);
			tread2Obj.add(boltPar.mesh);
		}
		tread2Obj.position.z = -(treadPlateWidth / 2 + profileWidth / 2);
		tread2Obj.position.y = -par.heightIn - stringerPlateThickness;
		tread2Obj.position.x = stringerPlateThickness;

		tread2Obj.rotation.x = toRadians(180) * (1 - par.turn) * 0.5;
		tread2Obj.position.y += (par.heightIn + stringerPlateThickness / 2) * 2 * (1 - par.turn) * 0.5;
		tread2Obj.position.z += stringerPlateThickness * (1 - par.turn) * 0.5;

		treadPlate.add(tread2Obj);

		shape.drawing = {
			name: "Подложка",
			group: "treadPlate",
			type: "in",
			marshId: par.marshId + "_Turn1TreadPlate",
			plateId: par.plateId,
			basePoint: copyPoint(basePointSvg),
		}
		shapesList.push(shape);
		basePointSvg.x += distance(p1, p2) + 100;

		dxfBasePoint.x -= distance(p2, p1) + 100;
	}


	treadPlate.position.z += treadPlateWidth / 2 * turnFactor;
	treadPlate.position.y += stringerPlateThickness;
	treadPlate.position.x -= stringerPlateThickness;

	if (turnFactor == -1) {
		treadPlate.rotation.x += Math.PI;
		treadPlate.position.y -= stringerPlateThickness;
	}

	par.object3D = treadPlate;
	par.mesh = treadPlate;

	var partName = "treadPlateWldWnd";
	if (typeof specObj != 'undefined'){
		if (!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Подложка сварная забежная",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
			}
		}
		var name = sizeA + "х" + sizeB + "х" + Math.round(par.h + params.treadPlateThickness);
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}
	par.mesh.specId = partName + name;

	return par;
}
//конец функции отрисовки подложки первой забежной ступени

/* функция отрисовки подложки второй забежной ступени*/

function drawTurn2TreadPlateCabriole(par) {
	var stringerPlateThickness = params.treadPlateThickness;
	var h1 = par.h;
	var treadPlateWidth = params.stringerThickness + params.M / 3;
	var treadPlateHeight = par.step - params.treadPlateThickness;
	var holeRad = 4;
	var turnParams = par.turnSteps;
	var firstboultoffsert = 20;
	var dxfBasePoint = par.dxfBasePoint;
	var profileWidth = params.profileWidth;
	var profileHeight = params.profileHeight;
	par.stringerMaterial = params.materials.metal2;
	par.sidePlateWidth = params.sidePlateWidth;
	par.sidePlateOverlay = params.sidePlateOverlay;
	par.strapThickness = params.metalThickness;
	par.turn = turnFactor;
	par.isTop = true
	par.isBot = true
	par.isIn = true

	var marshPar = getMarshParams(par.marshId);
	var nextMarshPar = getMarshParams(marshPar.nextMarshId);

	var dxfArr = dxfPrimitivesArr;
	if (turnFactor == -1) dxfArr = {};

	var basePointSvg = { x: 0, y: 0 };

	par.stringerTreadPlateExtrudeOptions = {
		amount: params.treadPlateThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var marsh = 0;
	if (par.marsh && par.marsh !== 0)
		marsh = par.marsh - 60;

	var treadPlate = new THREE.Object3D();

	var p0 = { x: 0, y: 0 };
	var p1 = newPoint_xy(p0, 0, turnParams.stepWidthY);
	var p2 = newPoint_xy(p1, turnParams.stepWidthX, 0);
	var p5 = newPoint_xy(p0, turnParams.treadWidthX, -turnParams.stepOffsetY);
	var p3 = newPoint_xy(p5, 0, turnParams.innerOffsetY);
	var p4 = newPoint_xy(p5, -turnParams.innerOffsetX, 0);

	//var lin = parallel(p2, p3, (stringerPlateThickness + 0.1));
	var lin = parallel(p2, p3, (-stringerPlateThickness - 0.2));

	p2 = itercection(p1, polar(p1, 0, 100), lin.p1, lin.p2);
	p3 = itercection(p5, polar(p5, Math.PI / 2, 100), lin.p1, lin.p2);


	var pc = newPoint_xy(p0, turnParams.treadWidthX / 2, turnParams.stepWidthY - (turnParams.treadWidthY - 45) / 2);
	var pc0 = newPoint_xy(pc, -treadPlateWidth / 2, 0);;
	var pc4 = newPoint_xy(pc, treadPlateWidth / 2, 0);;
	var pc2 = newPoint_xy(pc, 0, treadPlateWidth / 2);;
	var pc3 = newPoint_xy(pc, 0, -treadPlateWidth / 2);;

	var pt0 = itercection(p0, p4, pc0, polar(pc0, Math.PI / 2, 100));
	var pt4 = itercection(p0, p4, pc4, polar(pc4, Math.PI / 2, 100));

	var lin = parallel(pt0, pt4, (50 + 0.5 + stringerPlateThickness));
	if (par.turnNumber == 22)
		lin = parallel(pt0, pt4, (50 + stringerPlateThickness * 3));

	pt0 = itercection(pc0, polar(pc0, Math.PI / 2, 100), lin.p1, lin.p2);
	pt4 = itercection(pc4, polar(pc4, Math.PI / 2, 100), lin.p1, lin.p2);

	var pt2 = itercection(p2, p3, pc2, polar(pc2, 0, 100));
	var pt3 = itercection(p2, p3, pc3, polar(pc3, 0, 100));
	var pt1 = itercection(pt0, polar(pt0, Math.PI / 2, 100), pt2, polar(pt2, 0, 100));


	var pv0 = { x: 0, y: 0 };
	var pv1 = newPoint_xy(pv0, 0, distance(pt1, pt0));
	var pv2 = newPoint_xy(pv1, distance(pt2, pt1), 0);
	var pv3 = polar(pv2, calcAngleX1(pt2, pt3), distance(pt3, pt2));
	var pv4 = polar(pv0, calcAngleX1(pt0, pt4), distance(pt4, pt0));


	var pic = newPoint_xy(pv0, (pc.x - pt0.x), 0);
	var pi0 = newPoint_xy(pv0, (pc.x - pt0.x) - profileWidth / 2 - params.metalThickness, 0);
	var pi00 = newPoint_xy(pv0, (pc.x - pt0.x) + profileWidth / 2, 0);
	var pi1 = itercection(pv0, pv4, pi0, polar(pi0, Math.PI / 2, 100));
	var pi11 = itercection(pv0, pv4, pi00, polar(pi00, Math.PI / 2, 100));
	var pi2 = itercection(pv1, pv2, pi1, polar(pi1, Math.PI / 2, 100));


	var pk0 = newPoint_xy(pc, -profileWidth / 2 - 4, 0);
	var pk00 = newPoint_xy(pc, profileWidth / 2, 0);
	var pk1 = itercection(pt0, pt4, pk0, polar(pk0, Math.PI / 2, 100));
	var pk11 = itercection(pt0, pt4, pk00, polar(pk00, Math.PI / 2, 100));
	var pk2 = itercection(pt1, pt2, pk1, polar(pk1, Math.PI / 2, 100));
	var pk22 = itercection(pt2, pt3, pk11, polar(pk11, Math.PI / 2, 100));

	var py0 = newPoint_xy(pc, 0, profileWidth / 2 + 60);
	var py1 = itercection(pk1, pk2, py0, polar(py0, Math.PI, 100));
	var py2 = itercection(pk11, pk22, py0, polar(py0, 0, 100));


	// создаем shape для Object3D
	{
		var shape = new THREE.Shape();

		var line_pv0_pv4 = parallel(pv0, pv4, 0.01)
		var pv0t = itercection(pv0, pv1, line_pv0_pv4.p1, line_pv0_pv4.p2);
		var pv4t = itercection(pv4, pv3, line_pv0_pv4.p1, line_pv0_pv4.p2);

		addLine(shape, dxfArr, pv0t, pv4t, dxfBasePoint);
		addLine(shape, dxfArr, pv4t, pv3, dxfBasePoint);
		addLine(shape, dxfArr, pv3, pv2, dxfBasePoint);
		addLine(shape, dxfArr, pv2, pv1, dxfBasePoint);
		addLine(shape, dxfArr, pv1, pv0t, dxfBasePoint);

		//размеры для спецификации
		var sizeA = Math.round(distance(pv0, pv2))
		var sizeB = Math.round(distance(pv1, pv3))

		hole1 = new THREE.Path();
		hole2 = new THREE.Path();
		hole3 = new THREE.Path();
		hole4 = new THREE.Path();
		hole5 = new THREE.Path();

		center1 = newPoint_xy(pv0, firstboultoffsert, firstboultoffsert);
		center2 = newPoint_xy(pv1, firstboultoffsert, -firstboultoffsert);
		center3 = newPoint_xy(pv3, -firstboultoffsert * 3, 0);
		center4 = newPoint_xy(pv2, -firstboultoffsert, -firstboultoffsert);
		center5 = newPoint_xy(pv4, 0, firstboultoffsert * 3 / 2);

		addCircle(hole1, dxfArr, center1, holeRad, par.dxfBasePoint);
		addCircle(hole2, dxfArr, center2, holeRad, par.dxfBasePoint);
		addCircle(hole3, dxfArr, center3, holeRad, par.dxfBasePoint);
		addCircle(hole4, dxfArr, center4, holeRad, par.dxfBasePoint);
		addCircle(hole5, dxfArr, center5, holeRad, par.dxfBasePoint);

		shape.holes.push(hole1);
		shape.holes.push(hole2);
		shape.holes.push(hole3);
		shape.holes.push(hole4);
		shape.holes.push(hole5);

		// отрисовка центрального отверстия

		//углы треугольника без учета скруглений
		var p0 = { x: 0, y: -distance(pi1, pi0) };
		var p1 = newPoint_xy(p0, treadPlateWidth / 2 - profileWidth / 2 + 10, 15);
		var p2 = newPoint_xy(p0, treadPlateWidth / 2 - profileWidth / 2 + 10, distance(py1, pk1) - 33);
		var p3 = newPoint_xy(p0, treadPlateWidth / 2 + profileWidth / 2 - 10, distance(py1, pk1) - 33);
		var p4 = newPoint_xy(p0, treadPlateWidth / 2 + profileWidth / 2 - 10, 15);


		var hole = new THREE.Path();
		var vertexes = []; //массив вершин

		vertexes[0] = p1;
		vertexes[1] = p2;
		vertexes[2] = p3;
		vertexes[3] = p4;

		var filletParams = {
			vertexes: vertexes,
			cornerRad: 10,
			dxfBasePoint: dxfBasePoint,
			dxfPrimitivesArr: dxfArr,
			type: "path"
		}

		hole = fiiletPathCorners(filletParams);
		shape.holes.push(hole);
		//---------------------------------------------------------------------------------------


		var geom = new THREE.ExtrudeGeometry(shape, par.stringerTreadPlateExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		var tread1 = new THREE.Mesh(geom, par.stringerMaterial);
		tread1.rotation.x = toRadians(90);
		tread1.rotation.y = toRadians(180);
		tread1.rotation.z = toRadians(90);

		treadPlate.add(tread1);

		//саморезы
		var holes = [center1, center2, center3, center4, center5];
		var screwPar = {
			id: "screw_6x32",
			description: "Крепление ступеней",
			group: "Ступени"
		}
		if(params.stairType !== 'нет') {
			for (var i = 0; i < holes.length; i++) {
				var screw = drawScrew(screwPar).mesh;
				screw.position.x = holes[i].y// + stringerPlateThickness;
				screw.position.z = holes[i].x;
				treadPlate.add(screw)
			}
		}
	}

	//для левой лестницы зеркалим чертеж для svg и dxf
	if (turnFactor == -1) {
		var shape = new THREE.Shape();
		dxfArr = dxfPrimitivesArr;
		var dxfPoint = newPoint_xy(dxfBasePoint, pv3.x, 0);
		var pvm0 = copyPoint(pv0);
		var pvm1 = copyPoint(pv1);
		var pvm2 = copyPoint(pv2);
		var pvm3 = copyPoint(pv3);
		var pvm4 = copyPoint(pv4);
		pvm0.x *= -1;
		pvm1.x *= -1;
		pvm2.x *= -1;
		pvm3.x *= -1;
		pvm4.x *= -1;
		addLine(shape, dxfArr, pvm0, pvm4, dxfPoint);
		addLine(shape, dxfArr, pvm4, pvm3, dxfPoint);
		addLine(shape, dxfArr, pvm3, pvm2, dxfPoint);
		addLine(shape, dxfArr, pvm2, pvm1, dxfPoint);
		addLine(shape, dxfArr, pvm1, pvm0, dxfPoint);

		hole1 = new THREE.Path();
		hole2 = new THREE.Path();
		hole3 = new THREE.Path();
		hole4 = new THREE.Path();
		hole5 = new THREE.Path();

		center1 = newPoint_xy(pvm0, -firstboultoffsert, firstboultoffsert);
		center2 = newPoint_xy(pvm1, -firstboultoffsert, -firstboultoffsert);
		center3 = newPoint_xy(pvm3, firstboultoffsert * 3, 0);
		center4 = newPoint_xy(pvm2, firstboultoffsert, -firstboultoffsert);
		center5 = newPoint_xy(pvm4, 0, firstboultoffsert * 3 / 2);

		addCircle(hole1, dxfArr, center1, holeRad, dxfPoint);
		addCircle(hole2, dxfArr, center2, holeRad, dxfPoint);
		addCircle(hole3, dxfArr, center3, holeRad, dxfPoint);
		addCircle(hole4, dxfArr, center4, holeRad, dxfPoint);
		addCircle(hole5, dxfArr, center5, holeRad, dxfPoint);

		shape.holes.push(hole1);
		shape.holes.push(hole2);
		shape.holes.push(hole3);
		shape.holes.push(hole4);
		shape.holes.push(hole5);

		// отрисовка центрального отверстия

		//углы треугольника без учета скруглений
		var p0 = { x: 0, y: -distance(pi1, pi0) };
		var p1 = newPoint_xy(p0, -treadPlateWidth / 2 + profileWidth / 2 - 10, 15);
		var p2 = newPoint_xy(p0, -treadPlateWidth / 2 + profileWidth / 2 - 10, distance(py1, pk1) - 33);
		var p3 = newPoint_xy(p0, -treadPlateWidth / 2 - profileWidth / 2 + 10, distance(py1, pk1) - 33);
		var p4 = newPoint_xy(p0, -treadPlateWidth / 2 - profileWidth / 2 + 10, 15);


		var hole = new THREE.Path();
		var vertexes = []; //массив вершин

		vertexes[0] = p4;
		vertexes[1] = p3;
		vertexes[2] = p2;
		vertexes[3] = p1;

		var filletParams = {
			vertexes: vertexes,
			cornerRad: 10,
			dxfBasePoint: dxfPoint,
			dxfPrimitivesArr: dxfArr,
			type: "path"
		}

		hole = fiiletPathCorners(filletParams);
		shape.holes.push(hole);
	}

	shape.drawing = {
		name: "Подложка",
		group: "treadPlate",
		type: "top",
		marshId: par.marshId + "_Turn2TreadPlate",
		plateId: par.plateId,
		basePoint: copyPoint(basePointSvg),
	}

	shapesList.push(shape);
	
	basePointSvg.x += (pv3.x - pv0.x) + 100;


	//------------------------------------------------------------------------------------------
	//dxfBasePoint.y += distance(pv1, pv0) + 40;
	var dxfY = dxfBasePoint.y;
	dxfBasePoint.x += Math.abs(pv3.x) + 40;
	dxfBasePoint.y += 40;

	if (par.isTop) {
		var shape = new THREE.Shape();

		var heigth = 30;
		treadPlateWidth = distance(pv3, pv2);
		var ang = calcAngleX1(pv2, pv3);		

		var p0 = copyPoint(pv0);
		var p1 = newPoint_xy(p0, 0, 30);
		var p2 = newPoint_xy(p1, treadPlateWidth, 0);
		var p3 = newPoint_xy(p2, 0, -30);

		var rad = 10;
		var clockwise = true;

		addLine(shape, dxfPrimitivesArr, p0, newPoint_xy(p1, 0, -rad), dxfBasePoint);
		addArc2(shape, dxfPrimitivesArr, newPoint_xy(p1, rad, -rad), rad, Math.PI, Math.PI / 2, clockwise, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, newPoint_xy(p1, rad, 0), newPoint_xy(p2, -rad, 0), dxfBasePoint);
		addArc2(shape, dxfPrimitivesArr, newPoint_xy(p2, -rad, -rad), rad, Math.PI / 2, 0, clockwise, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, newPoint_xy(p2, 0, -rad), p3, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p3, p0, dxfBasePoint);

		var geom = new THREE.ExtrudeGeometry(shape, par.stringerTreadPlateExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		var tread2 = new THREE.Mesh(geom, par.stringerMaterial);



		tread2.rotation.y = ang + toRadians(270);
		tread2.position.x = distance(pv1, pv0);
		tread2.position.z = distance(pv2, pv1);
		tread2.position.y = stringerPlateThickness * (1 + par.turn) * 0.5;

		tread2.rotation.z = toRadians(180) * (1 - par.turn) * 0.5;

		tread2.position.z += treadPlateWidth * (1 - par.turn) * 0.5 * Math.cos(ang);
		tread2.position.x += (treadPlateWidth * Math.sin(ang)) * (1 - par.turn) * 0.5;

		treadPlate.add(tread2);

		shape.drawing = {
			name: "Подложка",
			group: "treadPlate",
			type: "topBack",
			marshId: par.marshId + "_Turn2TreadPlate",
			plateId: par.plateId,
			basePoint: copyPoint(basePointSvg),
		}
		shapesList.push(shape);
		if (!par.isBot) basePointSvg.x += treadPlateWidth + 100;
		if (par.isBot) basePointSvg.y -= 100;
	}

	//----------------------------------------------------------------------------------------
	//dxfBasePoint.y -= distance(pv1, pv0) - pv4.y + pv0.y + 80;
	dxfBasePoint.y = dxfY;

	if (par.isBot) {
		var shape = new THREE.Shape();

		var heigth = h1;
		treadPlateWidth = distance(pv4, pv0);
		var ang = calcAngleX1(pv0, pv4);

		var p0 = copyPoint(pv0);
		var p1 = newPoint_xy(p0, treadPlateWidth, 0);
		var p2 = newPoint_xy(p1, 0, -20);
		var p3 = newPoint_xy(p0, treadPlateWidth / 2 + (profileWidth / 2 + par.strapThickness) / Math.cos(ang), -h1 - stringerPlateThickness);
		var p4 = newPoint_xy(p0, treadPlateWidth / 2 - (profileWidth / 2 + par.strapThickness) / Math.cos(ang), -h1 - stringerPlateThickness);
		var p5 = newPoint_xy(p0, 0, -20);

		addLine(shape, dxfPrimitivesArr, p0, p1, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p2, p3, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p3, p4, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p4, p5, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p5, p0, dxfBasePoint);

		var stringerTreadPlateExtrudeOptions = {
			amount: params.treadPlateThickness - 0.01,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};

		var geom = new THREE.ExtrudeGeometry(shape, stringerTreadPlateExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		var tread3 = new THREE.Mesh(geom, par.stringerMaterial);



		tread3.rotation.y = ang + toRadians(270);

		tread3.rotation.z = toRadians(180) * (1 - par.turn) * 0.5;

		tread3.position.z += treadPlateWidth * (1 - par.turn) * 0.5 * Math.cos(ang);
		tread3.position.x += (treadPlateWidth * Math.sin(ang) - 0.01) * (1 - par.turn) * 0.5;
		tread3.position.y = stringerPlateThickness * (1 + par.turn) * 0.5;

		treadPlate.add(tread3);

		shape.drawing = {
			name: "Подложка",
			group: "treadPlate",
			type: "botFront",
			marshId: par.marshId + "_Turn2TreadPlate",
			plateId: par.plateId,
			basePoint: copyPoint(basePointSvg),
		}
		shapesList.push(shape);
		if (!par.isTop) basePointSvg.x += treadPlateWidth + 100;
		if (par.isTop) basePointSvg.x += distance(pv3, pv2) + 100;
	}

	//---------------------------------------------------------------------------------------

	//dxfBasePoint.y += treadPlateHeight * 2 + 90// + distance(pv1, pv0);
	dxfBasePoint.x += distance(pv2, pv3) + 40;

	if (par.isIn) {
		par.widthIn = par.step - 25;
		par.heightIn = par.h - 25 - params.treadPlateThickness;

		var dxWidthIn = 0;
		if (par.dxWidthIn)
			dxWidthIn = par.dxWidthIn;

		//наружная боковая пластина подложки
		var shape = new THREE.Shape();

		var p0 = { x: 0, y: 0 };
		var p1 = newPoint_xy(p0, 0, par.heightIn);
		var p2 = newPoint_xy(p1, distance(py1, pk1) + dxWidthIn, 0);
		//var pt1 = newPoint_xy(p1, 0, -h1);
		//var dx = par.sidePlateWidth - par.sidePlateOverlay - 10;
		//if (par.isNotKinkTop) dx -= 20;
		//var pt2 = newPoint_xy(pt1, dx / Math.sin(par.angleIn1), 0);
		//var pt3 = polar(pt2, par.angleIn1, 100);
		//var p4 = itercection(p0, polar(p0, 0, 100), pt2, pt3);
		var pt1 = newPoint_xy(p1, - par.stepPrev, -marshPar.h - nextMarshPar.h);		
		//var pt1 = newPoint_xy(par.pointProf, 0, -marshPar.h + par.heightIn);
		var pt2 = polar(pt1, -(Math.PI / 2 - par.angleIn1), params.sidePlateWidth - params.sidePlateOverlay - 5);
		var pt3 = polar(pt2, par.angleIn1, 100);
		var p3 = itercection(p2, polar(p2, Math.PI / 2, 100), pt2, pt3);
		var p4 = itercection(p0, polar(p0, 0, 100), pt2, pt3);
		var p3 = newPoint_xy(p2, 0, -60 + 12);
		var p31 = itercection(p3, polar(p3, Math.PI, 100), p4, polar(p4, par.angleIn1, 100));


	    var points = [p0, p1, p2]

		if (p3.x < p31.x) {
			var p3 = itercection(p2, polar(p2, Math.PI * 3 / 2, 100), p4, polar(p4, par.angleIn1, 100));
		    points.push(p3, p4);
		} else {
		    points.push(p3, p31, p4);
        }
        points.reverse();

	    //создаем шейп
	    var shapePar = {
	        points: points,
	        dxfArr: dxfPrimitivesArr,
	        dxfBasePoint: dxfBasePoint,
	        radOut: 0, //радиус скругления внешних углов
	    }

	    var shape = drawShapeByPoints2(shapePar).shape;

		// отрисовка двух центральных отверстий под болты
		center1 = newPoint_xy(p1, 20 + 0.4, -(par.h - 45));
		center2 = newPoint_xy(p1, 20 + 0.4, -20);

		var dist = setDistHoleTurn("2", turnParams);
		center3 = newPoint_xy(p1, dist.out + 0.4, -20);

		addOvalHoleX(shape, dxfPrimitivesArr, center1, 6, 10, dxfBasePoint, true);
		addOvalHoleX(shape, dxfPrimitivesArr, center2, 6, 10, dxfBasePoint, true);
        addOvalHoleX(shape, dxfPrimitivesArr, center3, 6, 10, dxfBasePoint, true);


		var geom = new THREE.ExtrudeGeometry(shape, par.stringerTreadPlateExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		var tread2Obj = new THREE.Object3D();
		var tread2 = new THREE.Mesh(geom, par.stringerMaterial);
		tread2Obj.add(tread2);
		//болты
		if (par.type == "treadPlate") {
			var boltPar = {
				type: "подложка труба",
				holesCenter: [center1, center2, center3],
			}

			drawPlateBolts(boltPar);
			tread2Obj.add(boltPar.mesh);
		}

		tread2Obj.position.x = -distance(pi1, pi0);// + stringerPlateThickness;
		tread2Obj.position.z = (pc.x - pt0.x) - profileWidth / 2;// + par.strapThickness;
		tread2Obj.position.y = -par.heightIn;

		tread2Obj.rotation.x = toRadians(180) * (1 - par.turn) * 0.5;
		tread2Obj.position.y += (par.heightIn + stringerPlateThickness / 2) * 2 * (1 - par.turn) * 0.5;
		tread2Obj.position.z += stringerPlateThickness * (1 - par.turn) * 0.5;

		treadPlate.add(tread2Obj);

		shape.drawing = {
			name: "Подложка",
			group: "treadPlate",
			type: "in",
			marshId: par.marshId + "_Turn2TreadPlate",
			plateId: par.plateId,
			basePoint: copyPoint(basePointSvg),
		}
		shapesList.push(shape);
		basePointSvg.x += distance(p1, p2) + 100;


		//-----------------------------------------------------------------------------

		//внутренняя боковая пластина подложки

		var shape = new THREE.Shape();

		var p0 = { x: 0, y: 0 };
		var p1 = newPoint_xy(p0, 0, par.heightIn);
		var p2 = newPoint_xy(p1, distance(py2, pk11) + dxWidthIn - stringerPlateThickness * Math.cos(ang), 0);
		//var pt1 = newPoint_xy(p1, 0, -h1 - ((pk1.y - pk11.y) / Math.tan(Math.PI / 2 - par.angleIn1)) + stringerPlateThickness);
		//var dx = par.sidePlateWidth - par.sidePlateOverlay;// - 10 ? FIX
		//if (par.isNotKinkTop) dx -= 20;

		//var pt2 = newPoint_xy(pt1, dx / Math.sin(par.angleIn1), 0);
		//var pt3 = polar(pt2, par.angleIn1, 125);
		////var p4 = itercection(p0, polar(p0, 0, 100), pt2, pt3);
		//var p4 = newPoint_xy(p0, 50, 0);
		var pt1 = newPoint_xy(p1, - par.stepPrev, - marshPar.h - nextMarshPar.h);
		var pt1 = newPoint_xy(pt1, profileWidth * Math.tan(turnParams.angleX), 0);
		var pt2 = polar(pt1, -(Math.PI / 2 - par.angleIn1), params.sidePlateWidth - params.sidePlateOverlay - 5);
		var pt3 = polar(pt2, par.angleIn1, 100);
		var p3 = itercection(p2, polar(p2, Math.PI / 2, 100), pt2, pt3);
		var p4 = itercection(p0, polar(p0, 0, 100), pt2, pt3);
		var p3 = newPoint_xy(p2, 0, -60 + 12);
		var p31 = itercection(p3, polar(p3, Math.PI, 100), p4, polar(p4, par.angleIn1, 100));

		dxfBasePoint.x += distance(p2, p1) + 100;

		//добавляем отверстия под фланец крепления косоуров
		center1 = newPoint_xy(p2, -30 - params.flanThickness, -20);
		center2 = newPoint_xy(center1, -(profileWidth + 60) - 2, 0);
		center3 = newPoint_xy(center2, 0, -120);//120 расстояние между отверстиями


		if (center3.y - 10 < p4.y) {
			p0.y -= 10
			p4 = itercection(p0, polar(p0, 0, 100), pt2, pt3);
		}	


		var points = [p0, p1, p2]

		var pn = copyPoint(p31);

		if (p3.x < p31.x) {
			var p3 = itercection(p2, polar(p2, Math.PI * 3 / 2, 100), p4, polar(p4, par.angleIn1, 100));
		    points.push(p3, p4);
			pn = copyPoint(p3);
		} else {
		    points.push(p3, p31, p4);
		}
	    points.reverse();

	    //создаем шейп
	    var shapePar = {
	        points: points,
	        dxfArr: dxfPrimitivesArr,
	        dxfBasePoint: dxfBasePoint,
	        radOut: 0, //радиус скругления внешних углов
	    }

	    var shape = drawShapeByPoints2(shapePar).shape;
		
		//сдвигаем 3 отверстие чтобы болт не пересекался с трубой
		var pn1 = newPoint_xy(p1, 0, -par.h);
		var pn1 = polar(pt1, -(Math.PI / 2 - par.angleIn1), params.sidePlateWidth - params.sidePlateOverlay);
		var line = parallel(pn1, polar(pn1, par.angleIn1, 100), params.sidePlateOverlay - params.sidePlateWidth);
		var pn2 = itercection(center3, polar(center3, Math.PI / 2, 100), line.p1, line.p2);
		if ((center3.y - 10) < pn2.y) {
			center3.y += pn2.y - (center3.y - 10);
		}
		//определяем наличие 3-го отверстия
		var pn3 = itercection(center3, polar(center3, Math.PI / 2, 100), p4, pn);
		var isHole3 = false;
		if ((center3.y - 10) > pn3.y) isHole3 = true;
		

		hole1 = new THREE.Path();
		hole2 = new THREE.Path();
		hole3 = new THREE.Path();
		addCircle(hole1, dxfPrimitivesArr, center1, 9, dxfBasePoint);
		addCircle(hole2, dxfPrimitivesArr, center2, 9, dxfBasePoint);
		if (isHole3) addCircle(hole3, dxfPrimitivesArr, center3, 9, dxfBasePoint);
		shape.holes.push(hole1);
		shape.holes.push(hole2);
		if (isHole3) shape.holes.push(hole3);

		// отрисовка отверстий под болты
		center1 = newPoint_xy(p1, 20 - 1.9, -(par.h - 45));
		center2 = newPoint_xy(p1, 20 - 1.9, -20);

		addOvalHoleX(shape, dxfPrimitivesArr, center1, 6, 10, dxfBasePoint, true);
		addOvalHoleX(shape, dxfPrimitivesArr, center2, 6, 10, dxfBasePoint, true);
		//------------------------

		var geom = new THREE.ExtrudeGeometry(shape, par.stringerTreadPlateExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));


		var tread1Obj = new THREE.Object3D();
		var tread1 = new THREE.Mesh(geom, par.stringerMaterial);
		tread1Obj.add(tread1);
		//болты
		if (par.type == "treadPlate") {
			var boltPar = {
				type: "подложка труба",
				holesCenter: [center1, center2],
			}

			drawPlateBolts(boltPar);
			tread1Obj.add(boltPar.mesh);
		}
		tread1Obj.position.x = -(pi0.y - pi11.y) + stringerPlateThickness;
		tread1Obj.position.z = (pc.x - pt0.x) + profileWidth / 2 - stringerPlateThickness;
		tread1Obj.position.y = -par.heightIn;

		tread1Obj.rotation.x = toRadians(180) * (1 - par.turn) * 0.5;
		tread1Obj.position.y += (par.heightIn + stringerPlateThickness / 2) * 2 * (1 - par.turn) * 0.5;
		tread1Obj.position.z += stringerPlateThickness * (1 - par.turn) * 0.5;

		treadPlate.add(tread1Obj);

		shape.drawing = {
			name: "Подложка",
			group: "treadPlate",
			type: "in",
			marshId: par.marshId + "_Turn2TreadPlate",
			plateId: par.plateId,
			basePoint: copyPoint(basePointSvg),
		}
		shapesList.push(shape);
		basePointSvg.x += distance(p1, p2) + 100;

		dxfBasePoint.x -= distance(p2, p1) + 100;
	}

	//----------------------------------------------------------------------------------------


	par.treadPlateWidthX = turnParams.stepOffsetY + pt0.y;
	par.treadPlateWidthY = pt0.x;//pv4.x


	treadPlate.position.z -= (pc.x - pt0.x) * turnFactor;
	treadPlate.position.x -= pi1.y + 0.4;

	if (turnFactor == -1) {
		treadPlate.rotation.x += Math.PI;
		treadPlate.position.y += stringerPlateThickness;
	}

	par.object3D = treadPlate;
	par.mesh = treadPlate;

	var partName = "treadPlateWldWnd";
	if (typeof specObj != 'undefined'){
		if (!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Подложка сварная забежная",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
			}
		}
		var name = sizeA + "х" + sizeB + "х" + Math.round(par.h + params.treadPlateThickness);
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}
	par.mesh.specId = partName + name;

	return par;
}
//конец функции отрисовки подложки второй забежной ступени

/* функция отрисовки подложки третьей забежной ступени*/

function drawTurn3TreadPlateCabriole(par) {
	var stringerPlateThickness = params.treadPlateThickness;
	var h1 = par.h;
	var treadPlateWidth = params.stringerThickness + params.M / 3;
	var treadPlateHeight = par.step - params.treadPlateThickness;
	var holeRad = 4;
	var turnParams = par.turnSteps;
	var firstboultoffsert = 20;
	var dxfBasePoint = par.dxfBasePoint;
	var profileWidth = params.profileWidth;
	par.stringerMaterial = params.materials.metal2;
	par.sidePlateWidth = params.sidePlateWidth;
	par.sidePlateOverlay = params.sidePlateOverlay;
	par.strapThickness = params.metalThickness;
	par.turn = turnFactor;
	par.isTop = true
	par.isBot = true
	par.isIn = true

	var marshPar = getMarshParams(par.marshId);

	var dxfArr = {};

	var basePointSvg = { x: 0, y: 0 };

	if (par.isTopNot) par.isTop = false;

	par.stringerTreadPlateExtrudeOptions = {
		amount: params.treadPlateThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};


	var marsh = 0;
	if (par.dStep) marsh += par.dStep;
	if (par.marsh && par.marsh !== 0)
		marsh = par.marsh - 40 - 5;

	if (par.turnNumber == 6) marsh = -5;

	var treadPlate = new THREE.Object3D();

	var p0 = { x: 0, y: 0 };
	var p1 = newPoint_xy(p0, 0, turnParams.stepWidthLow + marsh + stringerPlateThickness * 2 - 0.5 + 0.07);
	var p2 = newPoint_xy(p0, turnParams.treadWidth, 0);
	var p3 = newPoint_xy(p2, 0, turnParams.stepWidthHi + marsh + stringerPlateThickness * 2 - 0.5 + 0.07);

	var lin = parallel(p1, p3, (-54));

	p1 = itercection(p0, polar(p0, Math.PI / 2, 100), lin.p1, lin.p2);
	p3 = itercection(p2, polar(p2, Math.PI / 2, 100), lin.p1, lin.p2);


	var dy = 55 + stringerPlateThickness * 2;

	var pt0 = newPoint_xy(p0, (turnParams.treadWidth - treadPlateWidth) / 2, -stringerPlateThickness);
	var pt2 = newPoint_xy(p2, -(turnParams.treadWidth - treadPlateWidth) / 2, -stringerPlateThickness);
	var pt1 = itercection(p1, p3, pt0, polar(pt0, Math.PI / 2, 100));
	var pt3 = itercection(p1, p3, pt2, polar(pt2, Math.PI / 2, 100));

	var pv0 = { x: 0, y: 0 };
	var pv1 = newPoint_xy(pv0, 0, distance(pt1, pt0));
	var pv2 = newPoint_xy(pv0, distance(pt2, pt0), 0);
	var pv3 = newPoint_xy(pv2, 0, distance(pt3, pt2));

	var pi0 = newPoint_xy(pv0, treadPlateWidth / 2 - profileWidth / 2 - stringerPlateThickness, 0);
	var pi00 = newPoint_xy(pv0, treadPlateWidth / 2 + profileWidth / 2, 0);
	var pi1 = itercection(pv1, pv3, pi0, polar(pi0, Math.PI / 2, 100));
	var pi2 = itercection(pv1, pv3, pi00, polar(pi00, Math.PI / 2, 100));
	var angle1 = Math.atan(h1 / distance(pi1, pi0));
	if (par.angleIn3) angle1 = par.angleIn3;

	// создаем shape для Object3D
	{
		var shape = new THREE.Shape();

		addLine(shape, dxfArr, pv0, pv2, dxfBasePoint);
		addLine(shape, dxfArr, pv2, pv3, dxfBasePoint);
		addLine(shape, dxfArr, pv3, pv1, dxfBasePoint);
		addLine(shape, dxfArr, pv1, pv0, dxfBasePoint);

		//размеры для спецификации
		var sizeA = Math.round(distance(pv0, pv2))
		var sizeB = Math.round(distance(pv2, pv3))

		hole1 = new THREE.Path();
		hole2 = new THREE.Path();
		hole3 = new THREE.Path();
		hole4 = new THREE.Path();

		var dy = firstboultoffsert * Math.tan(turnParams.edgeAngle);
		center1 = newPoint_xy(pv0, firstboultoffsert, firstboultoffsert);
		center2 = newPoint_xy(pv1, firstboultoffsert, -firstboultoffsert + dy);
		center3 = newPoint_xy(pv3, -firstboultoffsert, -firstboultoffsert - dy);
		center4 = newPoint_xy(pv2, -firstboultoffsert, firstboultoffsert);

		addCircle(hole1, dxfArr, center1, holeRad, par.dxfBasePoint);
		addCircle(hole2, dxfArr, center2, holeRad, par.dxfBasePoint);
		addCircle(hole3, dxfArr, center3, holeRad, par.dxfBasePoint);
		addCircle(hole4, dxfArr, center4, holeRad, par.dxfBasePoint);

		shape.holes.push(hole1);
		shape.holes.push(hole2);
		shape.holes.push(hole3);
		shape.holes.push(hole4);

		// отрисовка центрального отверстия

		//углы треугольника без учета скруглений
		var p0 = { x: 0, y: distance(pi1, pi0) };
		var p1 = newPoint_xy(p0, treadPlateWidth / 2 - profileWidth / 2 + 10, -15);
		var p2 = newPoint_xy(p0, treadPlateWidth / 2 - profileWidth / 2 + 10, -(distance(pi1, pi0) - 33));
		var p3 = newPoint_xy(p0, treadPlateWidth / 2 + profileWidth / 2 - 10, -(distance(pi1, pi0) - 33));
		var p4 = newPoint_xy(p0, treadPlateWidth / 2 + profileWidth / 2 - 10, -15);

		var hole = new THREE.Path();
		var vertexes = []; //массив вершин

		vertexes[0] = p1;
		vertexes[1] = p4;
		vertexes[2] = p3;
		vertexes[3] = p2;

		var filletParams = {
			vertexes: vertexes,
			cornerRad: 10,
			dxfBasePoint: dxfBasePoint,
			dxfPrimitivesArr: dxfArr,
			type: "path"
		}

		hole = fiiletPathCorners(filletParams);
		shape.holes.push(hole);
		//---------------------------------------------------------------------------------------


		var geom = new THREE.ExtrudeGeometry(shape, par.stringerTreadPlateExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		var tread1 = new THREE.Mesh(geom, par.stringerMaterial);
		tread1.rotation.x = toRadians(270);
		//tread1.rotation.y = toRadians(180);
		tread1.rotation.z = toRadians(90);

		treadPlate.add(tread1);

		//саморезы
		var holes = [center1, center2, center3, center4];
		var screwPar = {
			id: "screw_6x32",
			description: "Крепление ступеней",
			group: "Ступени"
		}
		if(params.stairType !== 'нет') {
			for (var i = 0; i < holes.length; i++) {
				var screw = drawScrew(screwPar).mesh;
				screw.position.x = -holes[i].y;
				screw.position.z = -holes[i].x;
				treadPlate.add(screw)
			}
		}
	}

	// создаем shape для dxf и svg
	{
		// делаем симметрию по оси Y для dxf и svg
		var dxfArr = dxfPrimitivesArr;
		if (turnFactor == 1) dxfArr = {};

		var shape = new THREE.Shape();
		var dxfPoint = newPoint_xy(dxfBasePoint, 0, pv3.y);
		var pvb0 = copyPoint(pv0);
		var pvb1 = copyPoint(pv1);
		var pvb2 = copyPoint(pv2);
		var pvb3 = copyPoint(pv3);
		pvb0.y *= -1;
		pvb1.y *= -1;
		pvb2.y *= -1;
		pvb3.y *= -1;
		addLine(shape, dxfArr, pvb0, pvb2, dxfPoint);
		addLine(shape, dxfArr, pvb2, pvb3, dxfPoint);
		addLine(shape, dxfArr, pvb3, pvb1, dxfPoint);
		addLine(shape, dxfArr, pvb1, pvb0, dxfPoint);

		hole1 = new THREE.Path();
		hole2 = new THREE.Path();
		hole3 = new THREE.Path();
		hole4 = new THREE.Path();

		var dy = firstboultoffsert * Math.tan(turnParams.edgeAngle);
		center1 = newPoint_xy(pvb0, firstboultoffsert, -firstboultoffsert);
		center2 = newPoint_xy(pvb1, firstboultoffsert, firstboultoffsert - dy);
		center3 = newPoint_xy(pvb3, -firstboultoffsert, firstboultoffsert + dy);
		center4 = newPoint_xy(pvb2, -firstboultoffsert, -firstboultoffsert);

		addCircle(hole1, dxfArr, center1, holeRad, dxfPoint);
		addCircle(hole2, dxfArr, center2, holeRad, dxfPoint);
		addCircle(hole3, dxfArr, center3, holeRad, dxfPoint);
		addCircle(hole4, dxfArr, center4, holeRad, dxfPoint);

		shape.holes.push(hole1);
		shape.holes.push(hole2);
		shape.holes.push(hole3);
		shape.holes.push(hole4);

		// отрисовка центрального отверстия

		//углы треугольника без учета скруглений
		var p0 = { x: 0, y: -distance(pi1, pi0) };
		var p1 = newPoint_xy(p0, treadPlateWidth / 2 - profileWidth / 2 + 10, 15);
		var p2 = newPoint_xy(p0, treadPlateWidth / 2 - profileWidth / 2 + 10, (distance(pi1, pi0) - 33));
		var p3 = newPoint_xy(p0, treadPlateWidth / 2 + profileWidth / 2 - 10, (distance(pi1, pi0) - 33));
		var p4 = newPoint_xy(p0, treadPlateWidth / 2 + profileWidth / 2 - 10, 15);

		var hole = new THREE.Path();
		var vertexes = []; //массив вершин

		vertexes[0] = p1;
		vertexes[1] = p2;
		vertexes[2] = p3;
		vertexes[3] = p4;

		var filletParams = {
			vertexes: vertexes,
			cornerRad: 10,
			dxfBasePoint: dxfPoint,
			dxfPrimitivesArr: dxfArr,
			type: "path"
		}

		hole = fiiletPathCorners(filletParams);
		shape.holes.push(hole);


		//для правой лестницы зеркалим чертеж для svg и dxf
		if (turnFactor == 1) {
			var shape = new THREE.Shape();
			dxfArr = dxfPrimitivesArr;
			var dxfPoint = newPoint_xy(dxfBasePoint, pv3.x, 0);
			var pvm0 = copyPoint(pvb0);
			var pvm1 = copyPoint(pvb1);
			var pvm2 = copyPoint(pvb2);
			var pvm3 = copyPoint(pvb3);
			pvm0.x *= -1;
			pvm1.x *= -1;
			pvm2.x *= -1;
			pvm3.x *= -1;
			addLine(shape, dxfArr, pvm0, pvm2, dxfPoint);
			addLine(shape, dxfArr, pvm2, pvm3, dxfPoint);
			addLine(shape, dxfArr, pvm3, pvm1, dxfPoint);
			addLine(shape, dxfArr, pvm1, pvm0, dxfPoint);


			hole1 = new THREE.Path();
			hole2 = new THREE.Path();
			hole3 = new THREE.Path();
			hole4 = new THREE.Path();

			var dy = firstboultoffsert * Math.tan(turnParams.edgeAngle);
			center1 = newPoint_xy(pvm0, -firstboultoffsert, -firstboultoffsert);
			center2 = newPoint_xy(pvm1, -firstboultoffsert, firstboultoffsert - dy);
			center3 = newPoint_xy(pvm3, firstboultoffsert, firstboultoffsert + dy);
			center4 = newPoint_xy(pvm2, firstboultoffsert, -firstboultoffsert);

			addCircle(hole1, dxfArr, center1, holeRad, dxfPoint);
			addCircle(hole2, dxfArr, center2, holeRad, dxfPoint);
			addCircle(hole3, dxfArr, center3, holeRad, dxfPoint);
			addCircle(hole4, dxfArr, center4, holeRad, dxfPoint);

			shape.holes.push(hole1);
			shape.holes.push(hole2);
			shape.holes.push(hole3);
			shape.holes.push(hole4);

			// отрисовка центрального отверстия

			//углы треугольника без учета скруглений
			var p0 = { x: 0, y: -distance(pi1, pi0) };
			var p1 = newPoint_xy(p0, -treadPlateWidth / 2 + profileWidth / 2 - 10, 15);
			var p2 = newPoint_xy(p0, -treadPlateWidth / 2 + profileWidth / 2 - 10, (distance(pi1, pi0) - 33));
			var p3 = newPoint_xy(p0, -treadPlateWidth / 2 - profileWidth / 2 + 10, (distance(pi1, pi0) - 33));
			var p4 = newPoint_xy(p0, -treadPlateWidth / 2 - profileWidth / 2 + 10, 15);


			var hole = new THREE.Path();
			var vertexes = []; //массив вершин

			vertexes[0] = p1;
			vertexes[1] = p4;
			vertexes[2] = p3;
			vertexes[3] = p2;

			var filletParams = {
				vertexes: vertexes,
				cornerRad: 10,
				dxfBasePoint: dxfPoint,
				dxfPrimitivesArr: dxfArr,
				type: "path"
			}

			hole = fiiletPathCorners(filletParams);
			shape.holes.push(hole);
		}
	}

	var marshId = par.marshId * 1 - 1;
	if (params.stairModel == "Г-образная с забегом") marshId -= 1;
	shape.drawing = {
		name: "Подложка",
		group: "treadPlate",
		type: "top",
		marshId: marshId + "_Turn3TreadPlate",
		plateId: par.plateId,
		basePoint: copyPoint(basePointSvg),
	}
	shapesList.push(shape);
	basePointSvg.x += distance(pv0, pv2) + 100;

	//------------------------------------------------------------------------------------------

	//dxfBasePoint.y += distance(pv3, pv2) + 40;
	var dxfY = dxfBasePoint.y;
	dxfBasePoint.x += Math.abs(pv3.x) + 40;
	dxfBasePoint.y += h1 + stringerPlateThickness + 40;

	if (par.isTop) {
		var shape = new THREE.Shape();

		var heigth = 30;
		treadPlateWidth = distance(pv2, pv0);

		var p0 = copyPoint(pv0);
		var p1 = newPoint_xy(p0, 0, 30);
		var p2 = newPoint_xy(p1, treadPlateWidth, 0);
		var p3 = newPoint_xy(p2, 0, -30);

		var rad = 10;
		var clockwise = true;

		addLine(shape, dxfPrimitivesArr, p0, newPoint_xy(p1, 0, -rad), dxfBasePoint);
		addArc2(shape, dxfPrimitivesArr, newPoint_xy(p1, rad, -rad), rad, Math.PI, Math.PI / 2, clockwise, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, newPoint_xy(p1, rad, 0), newPoint_xy(p2, -rad, 0), dxfBasePoint);
		addArc2(shape, dxfPrimitivesArr, newPoint_xy(p2, -rad, -rad), rad, Math.PI / 2, 0, clockwise, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, newPoint_xy(p2, 0, -rad), p3, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p3, p0, dxfBasePoint);

		var geom = new THREE.ExtrudeGeometry(shape, par.stringerTreadPlateExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		var tread2 = new THREE.Mesh(geom, par.stringerMaterial);

		tread2.position.x = -stringerPlateThickness * (1 + turnFactor) * 0.5;
		tread2.position.y = stringerPlateThickness * (1 + par.turn) * 0.5;

		tread2.rotation.y = toRadians(90) * turnFactor;
		tread2.rotation.z = toRadians(180) * (1 - par.turn) * 0.5;

		//tread2.position.z += treadPlateWidth * (1 - par.turn) * 0.5;// + stringerPlateThickness;

		treadPlate.add(tread2);

		shape.drawing = {
			name: "Подложка",
			group: "treadPlate",
			type: "topBack",
			marshId: marshId + "_Turn3TreadPlate",
			plateId: par.plateId,
			basePoint: copyPoint(basePointSvg),
		}
		shapesList.push(shape);
		if (!par.isBot) basePointSvg.x += treadPlateWidth + 100;
		if (par.isBot) basePointSvg.y -= 100;
	}

	//----------------------------------------------------------------------------------------
	//dxfBasePoint.y -= distance(pv3, pv2) + 80;
	dxfBasePoint.y = dxfY + h1 + stringerPlateThickness;

	if (par.isBot) {
		var shape = new THREE.Shape();

		var heigth = h1;
		treadPlateWidth = distance(pv3, pv1);

		var ang = angleX(pv1, pv3);

		var p0 = copyPoint(pv0);
		var p1 = newPoint_xy(p0, treadPlateWidth, 0);
		var p2 = newPoint_xy(p1, 0, -20);
		var p3 = newPoint_xy(p0, treadPlateWidth / 2 + (profileWidth / 2 + par.strapThickness) / Math.cos(ang), -h1 - stringerPlateThickness);
		var p4 = newPoint_xy(p0, treadPlateWidth / 2 - (profileWidth / 2 + par.strapThickness) / Math.cos(ang), -h1 - stringerPlateThickness);
		var p5 = newPoint_xy(p0, 0, -20);

		addLine(shape, dxfPrimitivesArr, p0, p1, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p2, p3, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p3, p4, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p4, p5, dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p5, p0, dxfBasePoint);

		var geom = new THREE.ExtrudeGeometry(shape, par.stringerTreadPlateExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		var tread3 = new THREE.Mesh(geom, par.stringerMaterial);

		tread3.rotation.y = ang + toRadians(90) * turnFactor;
		tread3.position.x = -distance(pv1, pv0) - 0.01;
		tread3.position.z += stringerPlateThickness * Math.sin(ang) * (1 + turnFactor) * 0.5;
		tread3.position.x -= stringerPlateThickness * Math.cos(ang) * (1 + turnFactor) * 0.5;

		tread3.rotation.z = toRadians(180) * (1 - par.turn) * 0.5;

		tread3.position.y = stringerPlateThickness * (1 + par.turn) * 0.5;

		treadPlate.add(tread3);

		shape.drawing = {
			name: "Подложка",
			group: "treadPlate",
			type: "botFront",
			marshId: marshId + "_Turn3TreadPlate",
			plateId: par.plateId,
			basePoint: copyPoint(basePointSvg),
		}
		shapesList.push(shape);
		if (!par.isTop) basePointSvg.x += treadPlateWidth + 100;
		if (par.isTop) basePointSvg.x += distance(pv3, pv1) + 100;
	}

	//---------------------------------------------------------------------------------------

	//dxfBasePoint.y += treadPlateHeight + 90 + distance(pv3, pv2);
	dxfBasePoint.x += distance(pv1, pv3) + 40;
	dxfBasePoint.y = dxfY;

	if (par.isIn) {
		par.widthIn = par.step - 25;
		par.heightIn = par.h - 25 - params.treadPlateThickness;

		//внутренняя боковая пластина подложки
		var shape = new THREE.Shape();

		var p0 = { x: 0, y: 0 };
		var p1 = newPoint_xy(p0, 0, par.heightIn);
		//var p2 = newPoint_xy(p1, par.widthIn, 0);
		var p2 = newPoint_xy(p1, distance(pi1, pi0) - 25, 0);
		//var pt1 = newPoint_xy(p1, 0, -h1 + stringerPlateThickness);
		//var dx = par.sidePlateWidth - par.sidePlateOverlay - 10;
		//if (par.isNotKinkBot) dx -= 20;
		//var pt2 = newPoint_xy(pt1, dx / Math.sin(angle1), 0);
		//var pt3 = polar(pt2, angle1, 100);
		//var p3 = itercection(p2, polar(p2, Math.PI * 3 / 2, 100), pt2, pt3);
		//var p4 = itercection(p0, polar(p0, 0, 100), pt2, pt3);

		var pt1 = newPoint_xy(p1, par.step - profileWidth * Math.tan(turnParams.edgeAngle), 0);
		var pt2 = polar(pt1, -(Math.PI / 2 - angle1), params.sidePlateWidth - params.sidePlateOverlay - 5);
		var pt3 = polar(pt2, angle1, 100);

		var p3 = itercection(p2, polar(p2, Math.PI / 2, 100), pt2, pt3);
		if (p3.y + 5 > p2.y) {
			var pt4 = itercection(p1, polar(p1, 0, 100), pt2, pt3);
			p2 = newPoint_xy(pt4, -10, 0);
			var p3 = itercection(p2, polar(p2, Math.PI / 2, 100), pt2, pt3);
		}
		var p4 = itercection(p0, polar(p0, 0, 100), pt2, pt3);

	    var points = [p4, p3, p2, p1, p0]

	    //создаем шейп
	    var shapePar = {
	        points: points,
	        dxfArr: dxfPrimitivesArr,
	        dxfBasePoint: dxfBasePoint,
	        radOut: 0, //радиус скругления внешних углов
	    }

	    var shape = drawShapeByPoints2(shapePar).shape;

		// отрисовка отверстий под болты
		center1 = newPoint_xy(p1, 20 + par.strapThickness/2, -(par.h - 45));
		center2 = newPoint_xy(p1, 20 + par.strapThickness / 2, -20);

		var dist = setDistHoleTurn("3", turnParams);
		center3 = newPoint_xy(p1, dist.in + par.strapThickness / 2, -20);

		var holesCenter = [center1, center2];
		addOvalHoleX(shape, dxfPrimitivesArr, center1, 6, 10, dxfBasePoint, true);
		addOvalHoleX(shape, dxfPrimitivesArr, center2, 6, 10, dxfBasePoint, true);
		if (center3.x - center2.x > 25) {
			addOvalHoleX(shape, dxfPrimitivesArr, center3, 6, 10, dxfBasePoint, true);
			holesCenter.push(center3)
		}

		var geom = new THREE.ExtrudeGeometry(shape, par.stringerTreadPlateExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		var tread1Obj = new THREE.Object3D();
		var tread1 = new THREE.Mesh(geom, par.stringerMaterial);
		tread1Obj.add(tread1);
		//болты
		if (par.type == "treadPlate") {
			var boltPar = {
				type: "подложка труба",
				holesCenter: holesCenter,
			}

			drawPlateBolts(boltPar);
			tread1Obj.add(boltPar.mesh);
		}
		tread1Obj.position.z = -distance(pv2, pv0) / 2 + profileWidth / 2 - stringerPlateThickness;
		//tread1Obj.position.z = -par.widthIn;
		tread1Obj.position.x = -distance(pi1, pi0);// - stringerPlateThickness;
		tread1Obj.position.y = -par.heightIn;
		//tread1Obj.rotation.y = toRadians(-90) * par.turn;

		tread1Obj.rotation.z = toRadians(180) * (1 - par.turn) * 0.5;
		tread1Obj.rotation.y = toRadians(180) * (1 - par.turn) * 0.5;
		tread1Obj.position.y += (par.heightIn + stringerPlateThickness / 2) * 2 * (1 - par.turn) * 0.5;
		tread1Obj.position.z += stringerPlateThickness * (1 - par.turn) * 0.5;

		treadPlate.add(tread1Obj);

		shape.drawing = {
			name: "Подложка",
			group: "treadPlate",
			type: "in",
			marshId: marshId + "_Turn3TreadPlate",
			plateId: par.plateId,
			basePoint: copyPoint(basePointSvg),
		}
		shapesList.push(shape);
		basePointSvg.x += distance(p1, p2) + 100;
		//-----------------------------------------------------------------------------------

		var shape = new THREE.Shape();

		//наружная боковая пластина подложки
		var p0 = { x: 0, y: 0 };
		var p1 = newPoint_xy(p0, 0, par.heightIn);
		//var p2 = newPoint_xy(p1, par.widthIn, 0);
		var p2 = newPoint_xy(p1, distance(pi2, pi00) - 25, 0);
		//var pt1 = newPoint_xy(p1, 0, -h1 + stringerPlateThickness);
		//var dx = par.sidePlateWidth - par.sidePlateOverlay - 10;
		//if (par.isNotKinkBot) dx -= 20;
		//var pt2 = newPoint_xy(pt1, dx / Math.sin(angle1) + (pi2.y - pi1.y), 0);
		//var pt3 = polar(pt2, angle1, 100);
		//var p3 = itercection(p2, polar(p2, Math.PI * 3 / 2, 100), pt2, pt3);
		//var p4 = itercection(p0, polar(p0, 0, 100), pt2, pt3);

		var pt1 = newPoint_xy(p1, par. step, 0);
		var pt2 = polar(pt1, -(Math.PI / 2 - angle1), params.sidePlateWidth - params.sidePlateOverlay - 5);
		var pt3 = polar(pt2, angle1, 100);

		var p3 = itercection(p2, polar(p2, Math.PI / 2, 100), pt2, pt3);
		if (p3.y + 5 > p2.y) {
			var pt4 = itercection(p1, polar(p1, 0, 100), pt2, pt3);
			p2 = newPoint_xy(pt4, -10, 0);
			var p3 = itercection(p2, polar(p2, Math.PI / 2, 100), pt2, pt3);
		}
		var p4 = itercection(p0, polar(p0, 0, 100), pt2, pt3);

		dxfBasePoint.x += distance(p2, p1) + 100;

	    var points = [p4, p3, p2, p1, p0]

	    //создаем шейп
	    var shapePar = {
	        points: points,
	        dxfArr: dxfPrimitivesArr,
	        dxfBasePoint: dxfBasePoint,
	        radOut: 0, //радиус скругления внешних углов
	    }

	    var shape = drawShapeByPoints2(shapePar).shape;

		// отрисовка отверстий под болты
		center1 = newPoint_xy(p1, 20 - 1.5, -(par.h - 45));
		center2 = newPoint_xy(p1, 20 - 1.5, -20);
		center3 = newPoint_xy(p1, dist.out - 1.5, -20);

		var holesCenter = [center1, center2];
		addOvalHoleX(shape, dxfPrimitivesArr, center1, 6, 10, dxfBasePoint, true);
		addOvalHoleX(shape, dxfPrimitivesArr, center2, 6, 10, dxfBasePoint, true);
		if (center3.x - center2.x > 25) {
			addOvalHoleX(shape, dxfPrimitivesArr, center3, 6, 10, dxfBasePoint, true);
			holesCenter.push(center3)
		}

		var geom = new THREE.ExtrudeGeometry(shape, par.stringerTreadPlateExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		var tread2Obj = new THREE.Object3D();
		var tread2 = new THREE.Mesh(geom, par.stringerMaterial);
		tread2Obj.add(tread2);
		//болты
		if (par.type == "treadPlate") {
			var boltPar = {
				type: "подложка труба",
				holesCenter: holesCenter,
			}

			drawPlateBolts(boltPar);
			tread2Obj.add(boltPar.mesh);
		}


		tread2Obj.position.z = -distance(pv2, pv0) / 2 - profileWidth / 2;
		tread2Obj.position.x = -distance(pi2, pi00) + stringerPlateThickness;//*(1 + turnFactor)*0.5;// - stringerPlateThickness;
		tread2Obj.position.y = -par.heightIn;
		//tread2Obj.rotation.y = toRadians(-90) * par.turn;

		tread2Obj.rotation.z = toRadians(180) * (1 - par.turn) * 0.5;
		tread2Obj.rotation.y = toRadians(180) * (1 - par.turn) * 0.5;
		tread2Obj.position.y += (par.heightIn + stringerPlateThickness / 2) * 2 * (1 - par.turn) * 0.5;
		tread2Obj.position.z += stringerPlateThickness * (1 - par.turn) * 0.5;

		treadPlate.add(tread2Obj);

		shape.drawing = {
			name: "Подложка",
			group: "treadPlate",
			type: "in",
			marshId: marshId + "_Turn3TreadPlate",
			plateId: par.plateId,
			basePoint: copyPoint(basePointSvg),
		}
		shapesList.push(shape);
		basePointSvg.x += distance(p1, p2) + 100;

		dxfBasePoint.x -= distance(p2, p1) + 100;
	}

	//----------------------------------------------------------------------------------------


	treadPlate.position.z += (pv2.x - pv0.x) / 2 * turnFactor;
	treadPlate.position.x += distance(pi00, pi2) - 0.5;// - stringerPlateThickness;
	//treadPlate.position.x -= 60 * (1 - turnFactor) * 0.5;

	if (turnFactor == -1) {
		treadPlate.rotation.x += Math.PI;
		treadPlate.position.y += stringerPlateThickness;
	}

	par.object3D = treadPlate;
	par.mesh = treadPlate;

	var partName = "treadPlateWldWnd";
	if (typeof specObj != 'undefined'){
		if (!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Подложка сварная забежная",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
			}
		}
		var name = sizeA + "х" + sizeB + "х" + Math.round(par.h + params.treadPlateThickness);
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}
	par.mesh.specId = partName + name;

	return par;
} //конец функции отрисовки подложки первой забежной ступени

/**
	@param {string} flanType - тип фланца
	
	@return {object} параметры фланца
*/
function getFlanParams(type, isWndTurn){
	switch (type) {
		case 'flan_pipe_bot'://Фланец крепления к другому маршу/к другому каркасу на трубе
			var flanParams = {};
			flanParams.holeX = 30;
			flanParams.holeY = 20;
			flanParams.widthPipe = params.profileWidth + 2;
			flanParams.width = flanParams.widthPipe + flanParams.holeX * 4;			
			flanParams.height = 60 + params.sidePlateOverlay + params.profileHeight - 7;
			if (isWndTurn) flanParams.height = 60 + params.profileHeight;
			flanParams.heightPipe = params.profileHeight + 1;
			flanParams.holesDist = flanParams.widthPipe + flanParams.holeX * 2;
			return flanParams;
			break;
		default:
			return flanParams;
	}
}//конец getFlanParams

/**
  ПОСТРОЕНИЕ НИЖНЕГО ФЛАНЦА
	@param dxfBasePoint - базовая точка <обязательный>
	@param holeX - <необязательный>
	@param holeY - <необязательный>
	@param widthPipe - <необязательный>
	@param heightPipe - <необязательный>
	@param width - <необязательный>
	@param height - <необязательный>
	@param isBolts - <необязательный>
	@param isWndTurn <необязательный>
	
	В случае отстутствия необязательного параметра берется стандартное значение из фун-ии getFlanParams
	
	@return {object} mesh
 */
 
function drawFlanPipeBot(par) {
	var flanParams = getFlanParams('flan_pipe_bot', par.isWndTurn);
	var holeX = par.holeX || flanParams.holeX;
	var holeY = par.holeY ||flanParams.holeY;
	par.holeX = holeX;
	par.holeY = holeY;
	par.widthPipe = par.widthPipe || flanParams.widthPipe;
	par.heightPipe = par.heightPipe || flanParams.heightPipe;
	par.width = par.width || flanParams.width;
	par.height = par.height || flanParams.height;	
	
	//рисуем контур фланца
	var p0 = { x: 0, y: 0 };
	var p1 = newPoint_xy(p0, 0, par.height);
	var p2 = newPoint_xy(p1, holeX * 2, 0);
	var p3 = newPoint_xy(p2, 0, -par.heightPipe);
	var p4 = newPoint_xy(p3, par.widthPipe, 0);
	var p5 = newPoint_xy(p4, 0, par.heightPipe);
	var p6 = newPoint_xy(p5, holeX * 2, 0);
	var p7 = newPoint_xy(p6, 0, -par.height);

	p2.filletRad = 0; //угол не скругляется
	p3.filletRad = 0; //угол не скругляется
	p5.filletRad = 0; //угол не скругляется

	var points = [p0, p1, p2, p3, p4, p5, p6, p7];

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		radOut: 20,
		radIn: 0
    }
    shapePar.drawing = {
        name: par.name,
        group: "carcasFlans",
        marshId: par.marshId,
    }

	par.shape = drawShapeByPoints2(shapePar).shape;

	flanParams.isFixPart = true; // болты крепления к стенам
	flanParams.fixPar = getFixPart(0, 'botFloor'); // параметры крепления к стенам
	flanParams.fixPar.diamHole = 15;

	//Добавляем отверстия
	var center1 = newPoint_xy(p0, holeX, holeY);
	var center2 = newPoint_xy(p7, -holeX, holeY);
	var center3 = newPoint_xy(p1, holeX, -holeY);
	var center4 = newPoint_xy(p6, -holeX, -holeY);
	center1.holeData = center2.holeData = center3.holeData = center4.holeData = { zenk: 'no' };
	if (par.isWndTurn && par.offsetTopWndHoleY3) {
		if(turnFactor == 1) center4.y -= par.offsetTopWndHoleY3;
		if(turnFactor == -1) center3.y -= par.offsetTopWndHoleY3;
	}

	var holeCenters = [center1, center2, center3, center4];


	var holesPar = {
		holeArr: holeCenters,
		holeRad: 9,
		dxfBasePoint: par.dxfBasePoint,
		shape: par.shape,
	}
	if (par.isBotFloor) holesPar.holeRad = flanParams.fixPar.diamHole / 2;

	addHolesToShape(holesPar);



	var extrudeOptions = {
		amount: params.flanThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var flanObj = new THREE.Object3D();

	var geom = new THREE.ExtrudeGeometry(par.shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var flan = new THREE.Mesh(geom, params.materials.metal2);
	flanObj.add(flan);

	//болты
	if (par.isBolts) {
		var boltPar = {
			type: "фланец труба",
			holesCenter: holeCenters,
			isWndTurn: par.isWndTurn,
		};
		boltPar.length = params.metalThickness * 2;

		drawPlateBolts(boltPar);
		flanObj.add(boltPar.mesh);
	}

	//болты крепления к нижнему перекрытию
	if (typeof isFixPats != "undefined" && isFixPats && par.isBotFloor) { //глобальная переменная
		if (flanParams.fixPar.fixPart !== 'нет') {
			for (var i = 0; i < holeCenters.length; i++) {
				var fix = drawFixPart(flanParams.fixPar).mesh;
				fix.position.x = holeCenters[i].x;
				fix.position.y = holeCenters[i].y;
				fix.position.z = params.flanThickness * (1 + turnFactor) * 0.5;
				fix.rotation.x = -Math.PI / 2 * turnFactor;
				flanObj.add(fix);
			}
		}
	}

	flanObj.position.z = -par.width / 2;
	par.mesh = flanObj;


	return par;
} //end of drawFlanPipeBot

/*
 * ПОСТРОЕНИЕ ВЕРХНЕГО ФЛАНЦА лестницы на трубе
 */
function drawFlanPipeTop(par) {
	par.mesh = new THREE.Object3D();

	var holeRad = 8;
	var holeX = 20;
	var holeY = 20;
	par.widthPipe = params.profileWidth + 2;
	par.width = par.widthPipe + holeX * 4;
	if (params.topAnglePosition === "над ступенью") par.width = 300;

	var dy = 0;
	if (params.topAnglePosition === "над ступенью") dy = params.topHolePos + params.treadThickness + 20;

	par.heightPipe = params.profileHeight / Math.cos(par.marshAngle) + 2 + (params.flanThickness - 3) * Math.tan(par.marshAngle);
	par.height = par.heightPipe + 20 * 2 + dy;
	if (params.topAnglePosition === "под ступенью") par.height += 20;

	var height = par.height + 20;
	var width = par.width;

	par.isFixPart = true; // болты крепления к стенам
	par.fixPar = getFixPart(0, 'topFloor'); // параметры крепления к стенам
	par.fixPar.diamHole = 15;

	holeRad = par.fixPar.diamHole / 2;

	//рисуем контур фланца
	if (params.topAnglePosition === "под ступенью") {
		var p0 = { x: 0, y: -20 };
		var p1 = newPoint_xy(p0, 0, height);
		var p2 = newPoint_xy(p1, width, 0);
		var p3 = newPoint_xy(p2, 0, -height);
		var p4 = newPoint_xy(p3, -holeX + holeRad, 0);
		var p5 = newPoint_xy(p4, 0, holeY);
		var p6 = newPoint_xy(p5, -holeRad * 2, 0);
		var p7 = newPoint_xy(p6, 0, -holeY);
		var p8 = newPoint_xy(p0, holeX + holeRad, 0);
		var p9 = newPoint_xy(p8, 0, holeY);
		var p10 = newPoint_xy(p9, -holeRad * 2, 0);
		var p11 = newPoint_xy(p10, 0, -holeY);

		p4.filletRad = 0; //угол не скругляется
		p7.filletRad = 0; //угол не скругляется
		p8.filletRad = 0; //угол не скругляется
		p11.filletRad = 0; //угол не скругляется

		var points = [p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11];
	}

	if (params.topAnglePosition === "над ступенью") {
		var p0 = { x: 0, y: -20 };
		var p1 = newPoint_xy(p0, 0, height);
		var p11 = newPoint_xy(p1, 0, - dy);
		var p2 = newPoint_xy(p1, width, 0);
		var p3 = newPoint_xy(p2, 0, -height);
		var p22 = newPoint_xy(p2, 0, -dy);
		var p4 = newPoint_xy(p3, -width / 2 + par.widthPipe / 2 + holeX, 0);
		var p5 = newPoint_xy(p0, width / 2 - par.widthPipe / 2 - holeX, 0);

		var points = [p11, p1, p2, p22, p4, p5];
	}

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		radOut: 10,
		radIn: holeRad
    }
    shapePar.drawing = {
        name: par.name,
        group: "carcasFlans",
        marshId: par.marshId,
    }

	par.shape = drawShapeByPoints2(shapePar).shape;

	//Добавляем отверстия
	var center1 = newPoint_xy(p1, holeX, -holeY);
	var center2 = newPoint_xy(p2, -holeX, -holeY);
	center1.holeData = center2.holeData = { zenk: 'no' };

	var holeCenters = [center1, center2];

	if (params.topAnglePosition === "над ступенью") {
		var center3 = newPoint_xy(p1, holeX, -dy + params.treadThickness + holeY);
		var center4 = newPoint_xy(p2, -holeX, -dy + params.treadThickness + holeY);
		var center5 = newPoint_xy(p1, width / 2, - dy / 2 + params.treadThickness - holeY);
		center3.holeData = center4.holeData = center5.holeData = { zenk: 'no' };
		holeCenters.push(center3);
		holeCenters.push(center4);
		holeCenters.push(center5);
	}	
	

	var holesPar = {
		holeArr: holeCenters,
		holeRad: holeRad,
		dxfBasePoint: par.dxfBasePoint,
		shape: par.shape,
	}

	addHolesToShape(holesPar);


	//добавляем прямоугольное отверстие под трубу
	var dy1 = par.pointsShape[par.pointsShape.length - 2].y - par.pointsShape[par.pointsShape.length - 1].y;
	dy1 -= params.sidePlateOverlay / Math.cos(par.marshAngle) + (params.flanThickness - 3) * Math.tan(par.marshAngle) + 1 - dy;

	var center = { x: par.width / 2, y: p1.y - dy1 - par.heightPipe / 2 };
	addPolygonHole(par.shape, dxfPrimitivesArr, center, par.widthPipe / 2, par.heightPipe / 2, par.dxfBasePoint);


	var extrudeOptions = {
		amount: params.flanThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(par.shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var flan = new THREE.Mesh(geom, params.materials.metal2);
	flan.position.z = par.width / 2;
	flan.rotation.y = Math.PI / 2;
	par.mesh.add(flan);


	//пластина в отвестие трубы, чтобы закрыть торец трубы
	var offset = 0.5;
	var p1 = newPoint_xy(center, -par.widthPipe / 2 + offset, -par.heightPipe / 2 + offset);
	var p2 = newPoint_xy(center, -par.widthPipe / 2 + offset, par.heightPipe / 2 - offset);
	var p3 = newPoint_xy(center, par.widthPipe / 2 - offset, par.heightPipe / 2 - offset);
	var p4 = newPoint_xy(center, par.widthPipe / 2 - offset, -par.heightPipe / 2 + offset);

	//создаем шейп
	var shapePar = {
		points: [p1, p2, p3, p4],
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
	}
	shapePar.drawing = {
		name: 'Пластина под торец трубы',
		group: "carcasFlans",
		marshId: par.marshId,
	}

	par.shape = drawShapeByPoints2(shapePar).shape;

	var extrudeOptions = {
		amount: 2,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(par.shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var flan1 = new THREE.Mesh(geom, params.materials.metal2);
	flan1.position.x = params.flanThickness - extrudeOptions.amount;
	flan1.position.z = flan.position.z;
	flan1.rotation.y = Math.PI / 2;
	par.mesh.add(flan1);


	//болты крепления к верхнему перекрытию
	if (typeof isFixPats != "undefined" && isFixPats) { //глобальная переменная
		if (par.fixPar.fixPart !== 'нет') {
			if (params.topAnglePosition === "под ступенью") {
				holeCenters.push(newPoint_xy(p10, holeRad, -holeRad));
				holeCenters.push(newPoint_xy(p6, holeRad, -holeRad));
			}
			for (var i = 0; i < holeCenters.length; i++) {
				var fix = drawFixPart(par.fixPar).mesh;
				fix.position.x = holeCenters[i].x;
				fix.position.y = holeCenters[i].y;
				fix.position.z = params.flanThickness * (1 + turnFactor) * 0.5;
				fix.rotation.x = -Math.PI / 2 * turnFactor;
				flan.add(fix);
			}
		}
	}

	return par;
} //end of drawFlanPipeTop

/*
 * ПОСТРОЕНИЕ ВЕРХНЕГО ФЛАНЦА лестницы на сварном коробе
 */
function drawFlanTop(par) {
	var holeRad = 7.5;
	var holeX = 20;
	var holeY = 20;


	//рисуем контур фланца
	var p0 = { x: 0, y: 0 };
	var p1 = newPoint_xy(p0, 0, par.height);
	var p2 = newPoint_xy(p1, par.width, 0);
	var p3 = newPoint_xy(p2, 0, -par.height);

	var p11 = newPoint_xy(p0, par.width / 2 - par.widthBot / 2, -10);
	var p12 = newPoint_xy(p11, 0, par.heightBot);
	var p13 = newPoint_xy(p0, 0, par.heightBot);

	var p21 = newPoint_xy(p3, -par.width / 2 + par.widthBot / 2, -10);
	var p22 = newPoint_xy(p21, 0, par.heightBot);
	var p23 = newPoint_xy(p3, 0, par.heightBot);

	var points = [p11, p12, p13, p1, p2, p23, p22, p21];

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		radOut: par.cornerRad,
		radIn: par.cornerRad,
		//markPoints: true,
    }
    if (par.drawing) {
        shapePar.drawing = {
            name: par.drawing.name,
            group: par.drawing.group,
            marshId: par.drawing.marshId,
        }
    }
    else {
        shapePar.drawing = {
            name: "Фланец крепления к перекрытию",
            group: "carcasFlans",
            marshId: par.marshId,
        } 
    }
    par.shape = drawShapeByPoints2(shapePar).shape;

	//добавляем  отверстия в центре
	if (par.roundHoleCenters) {
		var holesPar = {
			holeArr: par.roundHoleCenters,
			dxfBasePoint: par.dxfBasePoint,
			shape: par.shape,
		}
		if (par.holeRad) holesPar.holeRad = par.holeRad;
		addHolesToShape(holesPar);
	}

	//Добавляем отверстия по краям
	var center1 = newPoint_xy(p1, holeX, -holeY);
	var center2 = newPoint_xy(p2, -holeX, -holeY);
	//var center3 = newPoint_xy(p1, par.width / 2, -(par.height - par.heightBot) / 2);
	var center3 = newPoint_xy(p1, holeX, -(par.height - par.heightBot) / 2);
	var center4 = newPoint_xy(p2, -holeX, -(par.height - par.heightBot) / 2);

	//Отмечаем тип зенковки, для свг
	center1.holeData = {zenk: 'no'};
	center2.holeData = {zenk: 'no'};
	center3.holeData = {zenk: 'no'};
	center4.holeData = {zenk: 'no'};
	
	var holeCenters = [center1, center2, center3, center4];

	var holesPar = {
		holeArr: holeCenters,
		holeRad: par.fixPar.diamHole / 2,
		dxfBasePoint: par.dxfBasePoint,
		shape: par.shape,
	}
	addHolesToShape(holesPar);

	var extrudeOptions = {
		amount: params.flanThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(par.shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var flan = new THREE.Mesh(geom, params.materials.metal2);
	par.mesh = flan;

	//болты крепления к верхнему перекрытию
	if (typeof isFixPats != "undefined" && isFixPats) { //глобальная переменная
		if (par.fixPar.fixPart !== 'нет') {
			for (var i = 0; i < holeCenters.length; i++) {
				var fix = drawFixPart(par.fixPar).mesh;
				fix.position.x = holeCenters[i].x;
				fix.position.y = holeCenters[i].y;
				fix.position.z = params.flanThickness * (1 + turnFactor) * 0.5;
				fix.rotation.x = -Math.PI / 2 * turnFactor;
				par.mesh.add(fix);
			}
		}
	}

	return par;
} //end of drawFlanTop

/*
 * ПОСТРОЕНИЕ ВЕРХНЕГО ФЛАНЦА КОЛОННЫ лестницы на проф трубе
 */
function drawFlanPipColumnTop(par) {
	par.mesh = new THREE.Object3D();

	var dxfArr = dxfPrimitivesArr;
	par.thk = 8;
	par.material = params.materials.metal2

	var p1 = { x: 0, y: 0, };
	var p2 = newPoint_xy(p1, 0, par.height);
	var p3 = newPoint_xy(p2, par.width, 0);
	var p4 = newPoint_xy(p1, par.width, 0);

	var pt1 = newPoint_xy(p1, 0, par.holeY - par.holeRad);
	var pt2 = newPoint_xy(pt1, par.holeX + par.holeRad, 0);
	var pt4 = newPoint_xy(p1, 0, par.holeY + par.holeRad);
	var pt3 = newPoint_xy(pt4, par.holeX + par.holeRad, 0);

	var pt8 = newPoint_xy(p2, 0, -par.holeY + par.holeRad);
	var pt7 = newPoint_xy(pt8, par.holeX + par.holeRad, 0);
	var pt5 = newPoint_xy(p2, 0, -par.holeY - par.holeRad);
	var pt6 = newPoint_xy(pt5, par.holeX + par.holeRad, 0);

	pt1.filletRad = pt4.filletRad = pt5.filletRad = pt8.filletRad = 0;
	pt2.filletRad = pt3.filletRad = pt6.filletRad = pt7.filletRad = par.holeRad;

	var points = [p1, pt1, pt2, pt3, pt4, pt5, pt6, pt7, pt8, p2, p3, p4];

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: dxfArr,
		dxfBasePoint: par.dxfBasePoint,
	}

	shapePar.radOut = par.cornerRad;
	shapePar.radIn = par.cornerRad;

	if (par.drawing) {
		shapePar.drawing = {
			name: "Фланец колонны верхний",
			group: "carcasFlans",
			marshId: par.marshId,
			isRotate: true,
			basePoint: { x: par.height / 2 - par.width / 2, y: par.height / 2 - par.width / 2 },//коррекция положения после поворота
		}
		shapePar.drawing.baseLine = { p1: p1, p2: p2 }
	}

	par.shape = drawShapeByPoints2(shapePar).shape;


	//добавляем  отверстия по краям
	par.roundHoleCenters = [];
	par.roundHoleCenters.push({ x: par.width - par.holeX, y: par.height - par.holeY, holeData: { zenk: 'no' } });
	par.roundHoleCenters.push({ x: par.width - par.holeX, y: par.holeY, holeData: { zenk: 'no' } });
	var holesPar = {
		holeArr: par.roundHoleCenters,
		dxfBasePoint: par.dxfBasePoint,
		shape: par.shape,
		holeRad: par.holeRad,
	}
	addHolesToShape(holesPar);

	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(par.shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var flan = new THREE.Mesh(geom, par.material);
	par.mesh.add(flan);

	return par;
} //end of drawFlanPipColumnTop

/** функция отрисовывает рамку под площадкой на лестнице на профиле
*/

function drawPlatformFrames(par) {
	par.marshId = 1;
	calcStringerPar(par);

	par.platformFrames = new THREE.Object3D();
	par.flans = new THREE.Object3D();

	var framePlatformParams = {
		width: params.M - 300,
		height: params.M - 300,
		widthIn: 30,
		thickness: 60,
		dxfBasePoint: par.dxfBasePoint,
		topConnection: par.topConnection,
		botConnection: par.botConnection,
	}

	var jumperPlatformParams = {
		isHoleCenter: true,
		width: params.profileWidth,
		height: framePlatformParams.thickness - 4,
		dxfBasePoint: par.dxfBasePoint, //базовая точка для вставки контуров в dxf файл
		isDraw: true,
	};

	var framePlatformExtrudeOptions = {
		amount: framePlatformParams.thickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};


	/*РАМКА И ФЛАНЦЫ ПЕРВОЙ ПЛОЩАДКИ*/
	if (par.topEnd === "площадка" && !par.lastMarsh) {
		var turnPar = calcTurnParams(1); //расчитуем параметры поворота
		if (params.stairModel == "П-образная с площадкой") {
			//turnPar.topMarshOffsetX += 34;
			//turnPar.turnLengthTop += 34;
		}

		if (params.stairModel == "П-образная с площадкой") framePlatformParams.width = params.platformLength_1 - 300;

		framePlatformParams = drawFramePlatform(framePlatformParams);

		var geom = new THREE.ExtrudeGeometry(framePlatformParams.shape, framePlatformExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		var framePlatform = new THREE.Mesh(geom, params.materials.metal2);
		framePlatform.position.x = par.treadsObj.unitsPos.turn1.x + turnPar.topMarshOffsetX + (turnPar.turnLengthTop - turnPar.topMarshOffsetX) / 2 - framePlatformParams.width / 2;
		if (params.stairModel == "П-образная с площадкой") framePlatform.position.x += turnPar.topMarshOffsetX / 2;
		framePlatform.position.y = par.treadsObj.unitsPos.turn1.y - params.treadThickness;
		framePlatform.position.z =  - framePlatformParams.height / 2;
		if (testingMode) framePlatform.position.y += 0.01;
		framePlatform.rotation.x = Math.PI / 2;
		framePlatform.castShadow = true;
		framePlatform.specId = framePlatformParams.articul;
		par.platformFrames.add(framePlatform);


		//Отрисовка перемычек площадки
		var jump = drawJumperPlatform(jumperPlatformParams).mesh;

		var x = par.treadsObj.unitsPos.turn1.x + turnPar.topMarshOffsetX + (turnPar.turnLengthTop - turnPar.topMarshOffsetX) / 2;
		if (params.stairModel == "П-образная с площадкой") x += turnPar.topMarshOffsetX / 2;
		var y = par.treadsObj.unitsPos.turn1.y - params.treadThickness - jumperPlatformParams.height - 2;
		var z = jumperPlatformParams.width / 2;

		var frameWidthIn = framePlatformParams.widthIn + 2;
		jump.position.y = y;
		jump.position.x = x;
		jump.position.x += (framePlatformParams.width) / 2 - frameWidthIn - params.flanThickness;
		jump.position.z = z;
		jump.rotation.y = Math.PI / 2;
		if (!par.topConnection && params.stairModel == 'П-образная с площадкой') {
			jump.rotation.y = 0;//Math.PI;
			jump.position.x = x - jumperPlatformParams.width - 2 + params.treadPlateThickness;
			if (testingMode) jump.position.x += 0.01;
			jump.position.z = -(framePlatformParams.height / 2 - frameWidthIn) * turnFactor;
			if (turnFactor == -1) jump.position.z -= params.flanThickness;
		}
		if (!par.topConnection && params.stairModel !== 'П-образная с площадкой') {
			jump.rotation.y = 0;
			jump.position.x = x - jumperPlatformParams.width / 2;
			jump.position.z = -(framePlatformParams.height / 2 - frameWidthIn) * turnFactor;
		}

		par.flans.add(jump);

		//--------------------------------------------
		var jump = drawJumperPlatform(jumperPlatformParams).mesh;

		jump.position.y = y;
		jump.position.x = x;
		jump.position.x += -(framePlatformParams.width) / 2 + frameWidthIn;
		jump.position.z = z;
		jump.rotation.y = Math.PI / 2;

		par.flans.add(jump);

		//---------------------------------------------------
		var jump = drawJumperPlatform(jumperPlatformParams).mesh;

		jump.position.y = y;
		jump.rotation.y = Math.PI;
		jump.position.x = x;
		jump.position.x += jumperPlatformParams.width / 2;
		if (testingMode && params.stairModel !== 'П-образная с площадкой') {
			jump.position.x -= 0.005;
		}
		if (params.stairModel == "П-образная с площадкой") {
			jump.position.x += -jumperPlatformParams.width / 2 ;
			if (testingMode && turnFactor == 1) jump.position.x += 0.01;
		}
		jump.position.z = (framePlatformParams.height / 2 - frameWidthIn) * turnFactor;
		// jump.position.z += -params.flanThickness * (1 + turnFactor) * 0.5;
		if (turnFactor == -1) {
			jump.position.x += 0.01;
			jump.position.z += params.flanThickness;
		}

		par.flans.add(jump);
	}

	/*РАМКА И ФЛАНЦЫ ВТОРОЙ ПЛОЩАДКИ*/
	if (params.stairModel == "П-образная с площадкой" || (params.stairModel == "П-образная трехмаршевая" && params.turnType_2 === "площадка")) {
		par.marshId = 2;
		calcStringerPar(par);
		var turnPar = calcTurnParams(2);//расчитуем параметры поворота
		if (params.stairModel == "П-образная с площадкой") {
			var turnPar = calcTurnParams(1);
			//turnPar.topMarshOffsetX += 34;
			//turnPar.turnLengthTop += 34;
		}

		framePlatformParams = drawFramePlatform(framePlatformParams);


		var geom = new THREE.ExtrudeGeometry(framePlatformParams.shape, framePlatformExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		var framePlatform = new THREE.Mesh(geom, params.materials.metal2);
		if (params.stairModel == "П-образная с площадкой") {
			//framePlatform.position.x = par.treadsObj.unitsPos.marsh3.x - turnPar.topStepDelta + turnPar.topMarshOffsetX + turnPar.turnLengthTop / 2 - framePlatformParams.width / 2;
            framePlatform.position.x = par.treadsObj.unitsPos.marsh3.x + turnPar.turnLengthTop / 2 - framePlatformParams.width / 2;
			framePlatform.position.y = par.treadsObj.unitsPos.marsh3.y - params.treadThickness;
			framePlatform.position.z = par.treadsObj.unitsPos.marsh3.z - framePlatformParams.height / 2;
		}
		if (params.stairModel == "П-образная трехмаршевая") {
			framePlatform.position.x = par.treadsObj.unitsPos.turn2.x - framePlatformParams.height / 2;
			framePlatform.position.y = par.treadsObj.unitsPos.turn2.y - params.treadThickness;
			framePlatform.position.z = par.treadsObj.unitsPos.marsh3.z - framePlatformParams.height / 2;
		}
		framePlatform.rotation.x = Math.PI / 2;
		framePlatform.castShadow = true;
		framePlatform.specId = framePlatformParams.articul;
		par.platformFrames.add(framePlatform);

		//Отрисовка перемычек площадки
		var jump = drawJumperPlatform(jumperPlatformParams).mesh;

		if (params.stairModel == "П-образная с площадкой") {
            var x = par.treadsObj.unitsPos.marsh3.x + turnPar.turnLengthTop / 2;
			var y = par.treadsObj.unitsPos.marsh3.y - params.treadThickness - jumperPlatformParams.height - 2;
			var z = par.treadsObj.unitsPos.marsh3.z - params.flanThickness;

			jump.position.y = y;
			jump.position.x = x;
			jump.position.z = z;
			jump.position.x += -jumperPlatformParams.width;
			if (par.botConnection) jump.position.x -= params.treadPlateThickness;
			jump.position.z += (framePlatformParams.height) / 2 - frameWidthIn;
			if (testingMode) jump.position.x += 0.01
			if (par.botConnection) {
				jump.position.x = x;
				jump.position.z = z;
				jump.position.z -= jumperPlatformParams.width / 2 - params.flanThickness;
				jump.position.x += (framePlatformParams.width) / 2 - frameWidthIn;
				jump.rotation.y = -Math.PI / 2;
			}
			par.flans.add(jump);

			//--------------------------------------------
			var jump = drawJumperPlatform(jumperPlatformParams).mesh;

			jump.position.y = y;
			jump.position.x = x;
			jump.position.z = z;
			jump.position.x += -jumperPlatformParams.width;
			jump.position.z += -(framePlatformParams.height) / 2 + frameWidthIn + params.flanThickness;
			if (testingMode) jump.position.x += 0.01
			
			par.flans.add(jump);

			//---------------------------------------------------
			var jump = drawJumperPlatform(jumperPlatformParams).mesh;

			jump.position.y = y;
			jump.position.x = x;
			jump.position.z = z;
			jump.position.z += jumperPlatformParams.width / 2 + params.flanThickness;
			jump.position.x -= (framePlatformParams.width) / 2 - frameWidthIn;
			jump.rotation.y = Math.PI / 2;

			par.flans.add(jump);
		}
		if (params.stairModel == "П-образная трехмаршевая") {
			var x = par.treadsObj.unitsPos.turn2.x;
			var y = par.treadsObj.unitsPos.turn2.y - params.treadThickness - jumperPlatformParams.height - 2;
			var z = par.treadsObj.unitsPos.marsh3.z;

			jump.position.y = y;
			jump.position.x = x;
			jump.position.z = z;
			jump.position.x += -jumperPlatformParams.width / 2;
			jump.position.z += (framePlatformParams.width / 2 - frameWidthIn - params.flanThickness) * turnFactor;
			jump.position.z += -params.flanThickness * (1 - turnFactor) * 0.5;
			
			if (par.botConnection) {
				jump.position.x = x;
				jump.position.z = z;
				jump.position.z -= jumperPlatformParams.width / 2;
				jump.position.x += (framePlatformParams.height) / 2 - frameWidthIn;
				jump.rotation.y = -Math.PI / 2;
			}
			
			par.flans.add(jump);

			//--------------------------------------------
			var jump = drawJumperPlatform(jumperPlatformParams).mesh;

			jump.position.y = y;
			jump.position.x = x;
			jump.position.z = z;
			jump.position.x += -jumperPlatformParams.width / 2;
			jump.position.z += (-framePlatformParams.width / 2 + frameWidthIn) * turnFactor;
			jump.position.z += -params.flanThickness * (1 - turnFactor) * 0.5;

			par.flans.add(jump);

			//---------------------------------------------------
			var jump = drawJumperPlatform(jumperPlatformParams).mesh;

			jump.position.y = y;
			jump.position.x = x;
			jump.position.z = z;
			jump.position.z += jumperPlatformParams.width / 2;
			jump.position.x -= (framePlatformParams.height) / 2 - frameWidthIn;
			jump.rotation.y = Math.PI / 2;

			par.flans.add(jump);
		}

	}

};

/* функция отрисовки рамки площадки*/

function drawFramePlatform(framePlatformParams) {
	var width = framePlatformParams.width;
	var height = framePlatformParams.height;
	var thickness = framePlatformParams.thickness;
	var dxfBasePoint = framePlatformParams.dxfBasePoint;
	framePlatformParams.firstboultoffsert = 15;
	framePlatformParams.firstBoultRaduis = 4;

	var plateWidth = framePlatformParams.widthIn;
	var holeXY = framePlatformParams.firstboultoffsert;

	var flanParams = { //объявление параметров фланца
		width: width,
		height: height,
		holeDiam: framePlatformParams.firstBoultRaduis * 2,
		angleRadUp: 0,
		angleRadDn: 0,
		hole1X: holeXY,
		hole1Y: holeXY,
		hole2X: holeXY,
		hole2Y: holeXY,
		hole3X: holeXY,
		hole3Y: holeXY,
		hole4X: holeXY,
		hole4Y: holeXY,
		metalThickness: thickness,
		dxfBasePoint: dxfBasePoint,
		dxfPrimitivesArr: dxfPrimitivesArr
	};

	var shape = drawRectFlan(flanParams).shape;

	// отрисовка центрального отверстия

	//углы четырехугольника без учета скруглений
	var p0 = { x: 0, y: 0 };
	var p1 = newPoint_xy(p0, plateWidth, plateWidth);
	var p2 = newPoint_xy(p0, width - plateWidth, plateWidth);
	var p3 = newPoint_xy(p0, width - plateWidth, height - plateWidth);
	var p4 = newPoint_xy(p0, plateWidth, height - plateWidth);

	//-------------------------------------
	var hole = new THREE.Path();
	addLine(hole, dxfPrimitivesArr, p1, p2, dxfBasePoint);
	addLine(hole, dxfPrimitivesArr, p2, p3, dxfBasePoint);
	addLine(hole, dxfPrimitivesArr, p3, p4, dxfBasePoint);
	addLine(hole, dxfPrimitivesArr, p4, p1, dxfBasePoint);

	shape.holes.push(hole);

	//отверстия под крепления к площадке
	var hole1 = new THREE.Path();
	var hole2 = new THREE.Path();

	var pt = newPoint_xy(p0, width / 2, plateWidth / 2);
	if (framePlatformParams.topConnection) pt = newPoint_xy(p0, width / 2, height - plateWidth / 2);
	
	var center1 = newPoint_xy(pt, - 100, 0);
	var center2 = newPoint_xy(pt, 100, 0);

	if (framePlatformParams.botConnection) {
		pt = newPoint_xy(p0, width - plateWidth / 2, height / 2);
		var center1 = newPoint_xy(pt, 0, - 100);
		var center2 = newPoint_xy(pt, 0, 100);
	}
	addCircle(hole1, dxfPrimitivesArr, center1, framePlatformParams.firstBoultRaduis, dxfBasePoint);
	addCircle(hole2, dxfPrimitivesArr, center2, framePlatformParams.firstBoultRaduis, dxfBasePoint);
	shape.holes.push(hole1);
	shape.holes.push(hole2);

	framePlatformParams.shape = shape;

	var partName = "pltFrame";
	if (typeof specObj != 'undefined'){
		if (!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Рамка площадки",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
			}
		}
		var name = Math.round(width) + "х" + Math.round(height) + "х" + Math.round(thickness);
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}
	framePlatformParams.articul = partName + name;

	return framePlatformParams;
}
//конец функции отрисовки рамки площадки

/* функция отрисовки фланца с овальным отверстием для крепления рамки площадки лестницы с трубой*/

function drawJumperPlatform(par) {
	var width = par.width;
	var height = par.height;
	var dxfBasePoint = par.dxfBasePoint;

	var holeCenterRad = 6.5;
	var holeCenterWidth = 10;
	if(par.slotLen) holeCenterWidth = par.slotLen / 2;

	par.mesh = new THREE.Object3D();

	var p0 = { x: 0, y: 0 };
	var p1 = newPoint_xy(p0, 0, height);
	var p2 = newPoint_xy(p1, width, 0);
	var p3 = newPoint_xy(p2, 0, -height);

	var points = [p0, p3, p2, p1];

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		radOut: 0,
		radIn: 0
    }
    if (par.drawingSvg) {
        shapePar.drawing = par.drawingSvg;
    }

	var shape = drawShapeByPoints2(shapePar).shape;

	// отрисовка центрального отверстия
	if (par.isHoleCenter) {
		var pc0 = { x: width / 2, y: height / 2 };
		var pc1 = newPoint_xy(pc0, -holeCenterWidth, -holeCenterRad);
		var pc2 = newPoint_xy(pc0, -holeCenterWidth, holeCenterRad);
		var pc3 = newPoint_xy(pc0, holeCenterWidth, holeCenterRad);
		var pc4 = newPoint_xy(pc0, holeCenterWidth, -holeCenterRad);

		//-------------------------------------
		var hole = new THREE.Path();
		var clockwise = true;
		addArc2(hole, dxfPrimitivesArr, newPoint_xy(pc0, -holeCenterWidth, 0), holeCenterRad, Math.PI * 3 / 2, Math.PI / 2, clockwise, dxfBasePoint);
		addLine(hole, dxfPrimitivesArr, pc2, pc3, dxfBasePoint);
		addArc2(hole, dxfPrimitivesArr, newPoint_xy(pc0, holeCenterWidth, 0), holeCenterRad, Math.PI / 2, -Math.PI / 2, clockwise, dxfBasePoint);
		addLine(hole, dxfPrimitivesArr, pc4, pc1, dxfBasePoint);

		shape.holes.push(hole);
	}

	var extrudeOptions = {
		amount: params.flanThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var flan = new THREE.Mesh(geom, params.materials.metal2);

	//болты

	if (typeof anglesHasBolts != "undefined" && anglesHasBolts && !testingMode) { //anglesHasBolts - глобальная переменная)
			var boltPar = {
				diam: 10,
				len: 60,
				headType: "шестигр.",
				}
			if(par.boltLen == 30){
				boltPar.len = 30;
				boltPar.headType = "потай";
				}

				var bolt = drawBolt(boltPar).mesh;
				bolt.rotation.x = Math.PI / 2;

				bolt.position.x = pc0.x;
				bolt.position.y = pc0.y;
				bolt.position.z = 0;

				par.mesh.add(bolt);

		}


	par.mesh.add(flan);

	return par;
}
//конец функции отрисовки рамки площадки



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
		return { "int": pti, "start": pta, "end": ptb, "center": ptc, "angstart": anglea(ptc, pta), "angend": anglea(ptc, ptb) };
	}
	else {
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

function addArc1_(centerPoint, radius, startAngle, endAngle, stringerParams) {
	addArc2(stringerParams.stringerShape, dxfPrimitivesArr, centerPoint, radius, startAngle, endAngle, stringerParams.dxfBasePoint);

	//Возвращает точку привязки следующего примитива
	return polar(centerPoint, endAngle, radius);
}

function addLine1(startPoint, endPoint, stringerParams) {
	addLine(stringerParams.stringerShape, dxfPrimitivesArr, startPoint, endPoint, stringerParams.dxfBasePoint);

	//Возвращает точку привязки следующего примитива
	return endPoint;
}


/** функция отрисовывает "ломаную" профильную трубу, состоящую из ряда сегментов
*@params points, offset, profSizeY, profSizeZ, botEndAng, topEndAng, dxfBasePoint, roundHoles, marshId(для идентификации в ведомостях)
*/
function drawPolylinePole(par) {
	par.mesh = new THREE.Object3D();

	//сортируем массив points в порядке возрастания координаты x
	par.points.sort(function (a, b) {
		return a.x - b.x;
	});
	var points = par.points;
	var offset = par.offset;

	//пересчет базовых точек чтобы сместить поручень на величину offset

	var points1 = []; //массив точек с отступом

	for (var i = 0; i < points.length; i++) {
		//первая точка
		if (i == 0) {
			//если первый участок вертикальный
			if (points[i].x == points[i + 1].x) {
				var point = newPoint_xy(points[i], offset, 0)
			}
			//если первый участок наклонный
			if (points[i].x != points[i + 1].x) {
				var poleAngle = angle(points[i], points[i + 1])
				var point = newPoint_xy(points[i], 0, -offset / Math.cos(poleAngle))
			}
			points1.push(point);
		}

		//промежуточные точки
		if (i > 0 && i < points.length - 1) {
			var line1 = parallel(points[i - 1], points[i], -offset);
			var line2 = parallel(points[i], points[i + 1], -offset);
			var point = itercection(line1.p1, line1.p2, line2.p1, line2.p2, )
			points1.push(point);
		}

		//последняя точка
		if (i == points.length - 1) {

			//если последний участок вертикальный
			if (points[i - 1].x == points[i].x) {
				var point = newPoint_xy(points[i], -offset, 0)
			}
			//если последний участок наклонный
			if (points[i - 1].x != points[i].x) {
				var poleAngle = angle(points[i - 1], points[i])
				var point = newPoint_xy(points[i], 0, -offset / Math.cos(poleAngle))
			}
			points1.push(point);
		}
	}

	points = points1;

	//расчет длин и углов всех участков

	var startOffset = 0; //смещение начала текущего куска  от базовой точки
	var startAngle = Math.PI / 2; //угол начала текущего куска

	for (var i = 0; i < points.length - 1; i++) {
		if (points[i] && points[i + 1]) {
			//расчет угла
			var p1 = copyPoint(points[i]); //первая точка текущего куска
			var p2 = copyPoint(points[i + 1]); //вторая точка текущего куска
			var p3 = copyPoint(points[i + 2]); //вторая точка следующего куска

			var poleAngle = Math.atan((p2.y - p1.y) / (p2.x - p1.x));

			//расчет начального угла первого куска
			if (i == 0 && p2.x != p1.x) startAngle = -(Math.PI / 2 - poleAngle + par.botEndAng);

			//для остальных кусков стартовый угол рассчитан на предыдущей итерации цикла


			//расчет конечного угла и длины куска (кроме последнего)
			if (p3) var poleAngle2 = Math.atan((p3.y - p2.y) / (p3.x - p2.x));

			if (p3) {
				var endAngle = (poleAngle - poleAngle2) / 2;
				//вертикальный участок
				if (p2.x - p1.x == 0) {
					var length = distance(p1, p2) + par.profSizeY * Math.tan(endAngle);
				}
				//горизонтальный или наклонный участок
				if (p2.x - p1.x != 0) {
					var length = distance(p1, p2) + par.profSizeY * Math.tan(endAngle) - par.profSizeY * Math.tan(startAngle);
				}
			}


			//последний кусок
			if (i == points.length - 2) {
				endAngle = 0;
				if (p2.x != p1.x) {
					endAngle = -(Math.PI / 2 - poleAngle) + par.topEndAng;
				}

				var length = distance(p1, p2);
				length += par.profSizeY * Math.tan(poleAngle) - par.profSizeY * Math.tan(startAngle);
			}




			//построение профилей
			var basePoint = copyPoint(p1);
			endOffset = 0;

			var pole3DParams = {
				poleProfileY: par.profSizeY,
				poleProfileZ: par.profSizeZ,
				dxfBasePoint: par.dxfBasePoint,
				length: length - 0.01,
				poleAngle: poleAngle,
				angStart: startAngle,
				angEnd: endAngle,
				material: params.materials.metal,
				partName: "stringerPart",
				roundHoles: [],
				sectText: par.marshId + " марш (деталь:" + i + ")"
			}

			pole3DParams.dxfBasePoint = newPoint_xy(par.dxfBasePoint, basePoint.x, basePoint.y)

			//круглые отверстия
			if(par.roundHoles){
				for(var j=0; j<par.roundHoles.length; j++ ){
					//если точка попадает в текущий участок
					if(par.roundHoles[j].x > p1.x && par.roundHoles[j].x < p2.x){
						//пересчитываем координаты к базовой точке текущего участка
						var center = newPoint_xy(par.roundHoles[j], - basePoint.x, - basePoint.y)
						center.diam = par.roundHoles[j].diam
						pole3DParams.roundHoles.push(center);
						}
					}
				}

			var pole = drawPole3D_4(pole3DParams).mesh;
			pole.position.x = basePoint.x;
			pole.position.y = basePoint.y;

			par.mesh.add(pole);


			//сохраняем начальный параметры для следующего участка
			startAngle = -endAngle;
			startOffset = endOffset;
		}
	}




	return par;

}

function setDistHoleTurn(numberTurn, turnParams) {

	if (numberTurn == "1") {
		var p0 = { x: 0, y: 0 };
		var p1 = newPoint_xy(p0, 0, turnParams.stepWidthLow);
		var p2 = newPoint_xy(p0, turnParams.treadWidth, 0);
		var p3 = newPoint_xy(p2, 0, turnParams.stepWidthHi);

		p0.y += 50 + params.treadPlateThickness * 2;
		p2.y += 50 + params.treadPlateThickness * 2;

		var pc = newPoint_xy(p0, turnParams.treadWidth / 2, 0);
		var pt1In = newPoint_xy(pc, -params.profileWidth / 2, 0);
		var pt1Out = newPoint_xy(pc, params.profileWidth / 2, 0);
		var pt2In = itercection(p1, p3, pt1In, polar(pt1In, Math.PI / 2, 100));
		var pt2Out = itercection(p1, p3, pt1Out, polar(pt1Out, Math.PI / 2, 100));

		return { in: distance(pt2In, pt1In) - 70, out: distance(pt2Out, pt1Out) - 70 }
	}
	if (numberTurn == "2") {
		var treadPlateWidth = params.stringerThickness + params.M / 3;

		var p0 = { x: 0, y: 0 };
		var p1 = newPoint_xy(p0, 0, turnParams.stepWidthY);
		var p2 = newPoint_xy(p1, turnParams.stepWidthX, 0);
		var p5 = newPoint_xy(p0, turnParams.treadWidthX, -turnParams.stepOffsetY);
		var p3 = newPoint_xy(p5, 0, turnParams.innerOffsetY);
		var p4 = newPoint_xy(p5, -turnParams.innerOffsetX, 0);

		var pc = newPoint_xy(p0, turnParams.treadWidthX / 2, turnParams.stepWidthY - (turnParams.treadWidthY - 45) / 2);
		var pc0 = newPoint_xy(pc, -treadPlateWidth / 2, 0);
		var pc4 = newPoint_xy(pc, treadPlateWidth / 2, 0);
		var pc2 = newPoint_xy(pc, 0, treadPlateWidth / 2);

		var pt0 = itercection(p0, p4, pc0, polar(pc0, Math.PI / 2, 100));
		var pt4 = itercection(p0, p4, pc4, polar(pc4, Math.PI / 2, 100));

		var lin = parallel(pt0, pt4, (50 + 0.5 + params.treadPlateThickness));

		pt0 = itercection(pc0, polar(pc0, Math.PI / 2, 100), lin.p1, lin.p2);
		pt4 = itercection(pc4, polar(pc4, Math.PI / 2, 100), lin.p1, lin.p2);

		var pt2 = itercection(p2, p3, pc2, polar(pc2, 0, 100));
		var pt1 = itercection(pt0, polar(pt0, Math.PI / 2, 100), pt2, polar(pt2, 0, 100));

		var pk0 = newPoint_xy(pc, -params.profileWidth / 2 - 4, 0);
		var pk1 = itercection(pt0, pt4, pk0, polar(pk0, Math.PI / 2, 100));
		var pk2 = itercection(pt1, pt2, pk1, polar(pk1, Math.PI / 2, 100));

		var py0 = newPoint_xy(pc, 0, params.profileWidth / 2 + 60);
		var py1 = itercection(pk1, pk2, py0, polar(py0, Math.PI, 100));

		return { in: 0, out: distance(py1, pk1) - 50 }
	}
	if (numberTurn == "3") {
		var marsh = 0;
		if (params.marsh && turnParams.stepWidthLow !== 50)
			marsh = params.marsh - 40 - 5;

		var p0 = { x: 0, y: 0 };
		var p1 = newPoint_xy(p0, 0, turnParams.stepWidthLow + marsh + params.treadPlateThickness * 2);
		var p2 = newPoint_xy(p0, turnParams.treadWidth, 0);
		var p3 = newPoint_xy(p2, 0, turnParams.stepWidthHi + marsh + params.treadPlateThickness * 2);

		var lin = parallel(p1, p3, (-54));

		p1 = itercection(p0, polar(p0, Math.PI / 2, 100), lin.p1, lin.p2);
		p3 = itercection(p2, polar(p2, Math.PI / 2, 100), lin.p1, lin.p2);

		var pc = newPoint_xy(p0, turnParams.treadWidth / 2, 0);
		var pt1In = newPoint_xy(pc, -params.profileWidth / 2, 0);
		var pt1Out = newPoint_xy(pc, params.profileWidth / 2, 0);
		var pt2In = itercection(p1, p3, pt1In, polar(pt1In, Math.PI / 2, 100));
		var pt2Out = itercection(p1, p3, pt1Out, polar(pt1Out, Math.PI / 2, 100));

		return { in: distance(pt2In, pt1In) - 70, out: distance(pt2Out, pt1Out) - 70 }
	}
}
