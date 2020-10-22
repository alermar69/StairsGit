var draw = "";

function makeSvg() {

	//инициализация
	$("#svgOutputDivDraw").html("");
	var draw = Raphael("svgOutputDivDraw", 800, 800);
	var dimScale = $("#svgDimScale").val();

	//оси координат
	//drawAxisHelper(2000, draw)

	//создаем svg объекты из массива шейпов
	var basePoint = {x: 0, y: 0}
	var objDst = 200 + 100 * dimScale; //зазор между объектами на листе по вертикали

	// выводим только уникальные шейпы. Для повторяющихся считаем кол-во
	var shapesAmtList = [];
	var shapesTurnRack = [];
	var railingShapes = [];
	var glassShapes = [];
	var handrailShapes = [];
	var timberRailingShapes = [];
	var shapesMarsh = {};
	var shapesPlatform = {};
	var shapesTreadPlateCabriole = {};
	var shapesFlans = {};
	var isShapesPlatform = false;
    var isTreadPlateCabriole = false;
    var isFlans = false;
	$.each(shapesList, function () {
		var isUnique = true;
		var shape = this;
		var index = 0;
		for (var i = 0; i < shapesAmtList.length; i++) {
			if (isShapesEqual(shape, shapesAmtList[i])) {
				isUnique = false;
				index = i;
			}
		}
		
		if (!(shape.drawing && shape.drawing.group == 'timber_stock')) {
			if (isUnique) {
				shape.amt = 1;
				shapesAmtList.push(shape);
			}else {
				shapesAmtList[index].amt += 1;
			}
		}


		if (!shape.drawing) shape.drawing = {};

		if (shape.drawing.group == "handrails") handrailShapes.push(shape);
			if (shape.drawing.group == "turnRack") {
			shapesTurnRack.push(shape)
		}

		if (shape.drawing.group == 'forged_railing') {
			railingShapes.push(shape);
		}
		if (shape.drawing.group == 'glass') {
			glassShapes.push(shape);
		}

		if (shape.drawing.group == 'timber_railing') {
			timberRailingShapes.push(shape);
		}

		//выбираем shapes для сборочных чертежей
		if (shape.drawing.marshId) {
			var marshId = shape.drawing.marshId;
			if (!shapesMarsh[marshId]) shapesMarsh[marshId] = { shapes: [] };
			if (!shapesPlatform[marshId]) shapesPlatform[marshId] = { shapes: [] };
			if (!shapesTreadPlateCabriole[marshId]) shapesTreadPlateCabriole[marshId] = { shapes: [] };
			if (!shapesFlans[marshId]) shapesFlans[marshId] = { shapes: [] };
			
			//выбираем shapes для сборочного чертежа косоура на сварном коробе
			if (shape.drawing.group == "stringers") {
				if (shape.drawing.key == "in") shapesMarsh[marshId].shapes.push(shape);
			}
			if (shape.drawing.group == "carcasPlates") {
				shapesMarsh[marshId].shapes.push(shape);
			}
            if (shape.drawing.group == "carcasFlans_In") {
				shapesMarsh[marshId].shapes.push(shape);
			}

			//выбираем shapes для сборочного чертежа косоура площадки
			if (shape.drawing.group == "stringersPlatform") {
				shapesPlatform[marshId].shapes.push(shape);
				isShapesPlatform = true;
			}

			//выбираем shapes для сборочного чертежа подложек для трубы
			if (shape.drawing.group == "treadPlate") {
				shapesTreadPlateCabriole[marshId].shapes.push(shape);
				if (marshId == 1 || marshId == 2 || marshId == 3) {
					var marshParams = getMarshParams(marshId);
					var count = marshParams.stairAmt;
					if (marshParams.botTurn == "пол") count -= 1;
					if (marshParams.lastMarsh && marshParams.topTurn == "пол" && params.topAnglePosition == "под ступенью") count -= 1;

					shapesTreadPlateCabriole[marshId].count = count;
				}
				else {
					shapesTreadPlateCabriole[marshId].count = 1;
				}
				isTreadPlateCabriole = true;
			}

			//выбираем shapes для сборочного чертежа фланцев
            if (shape.drawing.group == "carcasFlans") {
                var isPush = true;
                //если надо подсчитываем общее кол-во одинаковых элементов
                if (shape.drawing.isCount) {
                    var shapes = shapesFlans[marshId].shapes;
                    for (var k = 0; k < shapes.length; k++) {
                        if (shape.drawing.name == shapes[k].drawing.name) {
                            shapes[k].drawing.count += 1;
                            isPush = false;
                        }
                    }
                    if (isPush) shape.drawing.count = 1;
                }

                if (isPush) shapesFlans[marshId].shapes.push(shape);
		        isFlans = true;
			}
		}
	});
	
	//создаем сборочный чертеж монокосоура
	basePoint = { x: 0, y: 0 };
	for (var key in shapesMarsh) {
		var shapes = shapesMarsh[key].shapes;

		if (shapes.length > 0) {
			//рисуем сборочный чертеж монокосоура	
			if (shapes[0].drawing.basePointOffY) basePoint.y -= shapes[0].drawing.basePointOffY
			var svgPar = {
				draw: draw,
				basePoint: basePoint,
				basePointOffY: 0,
				borderFrame:
					{ botLeft: copyPoint(basePoint), topRigth: copyPoint(basePoint) }, //объект для точек границ сборочного чертежа
			}
			for (var j = 0; j < shapes.length; j++) {
				svgPar.shape = shapes[j];
				drawShapeSvg(svgPar);
			}

			//определяем масштаб и координаты листа
			scaleBorderDraw(svgPar);
			//создаем рамку листа
			var rect = drawRect(svgPar.borderFrame.botLeft, svgPar.formatX * svgPar.formatScale, -svgPar.formatY * svgPar.formatScale, draw).attr({
				fill: "none",
				stroke: "#555",
				"stroke-width": 1,
			})
			rect.setClass("other");

			//подпись
			var textHeight = 30 * dimScale; //высота текста
			var textPos = newPoint_xy(svgPar.borderFrame.botLeft, 50, svgPar.formatY * svgPar.formatScale - 50)
			var text = drawText("Сборочный чертеж монокосоура " + key + " марша", textPos, textHeight, draw)
			text.attr({ "font-size": textHeight, })
			var b = text.getBBox();
			text.attr({ x: textPos.x + b.width / 2, })

			textPos.y -= 100;
			var text = drawText("Все отверстия без зенковки", textPos, textHeight, draw)
			text.attr({ "font-size": textHeight, })
			var b = text.getBBox();
			text.attr({ x: textPos.x + b.width / 2, })

			basePoint.y = svgPar.borderFrame.botLeft.y - objDst - 500;
			if (params.model == "сварной") basePoint.y -= 500;
		}
	}

	//создаем сборочный чертеж косоура площадки
	if (isShapesPlatform) {
		var svgPar = {
			draw: draw,
			basePoint: basePoint,
			basePointOffY: 0,
			borderFrame:
				{ botLeft: copyPoint(basePoint), topRigth: copyPoint(basePoint) }, //объект для точек границ сборочного чертежа
		}
		for (var key in shapesPlatform) {
			var shapes = shapesPlatform[key].shapes;

			if (shapes.length > 0) {
				//рисуем сборочный чертеж фланцев
				var basePointTmp = copyPoint(svgPar.basePoint);
				for (var j = 0; j < shapes.length; j++) {
					svgPar.shape = shapes[j];
					svgPar.basePoint.x = basePointTmp.x + svgPar.shape.drawing.pointCurrentSvg.x;
					svgPar.basePoint.y = basePointTmp.y + svgPar.shape.drawing.pointCurrentSvg.y;
					drawShapeSvg(svgPar);
					//svgPar.basePoint.y -= svgPar.rect.height + 150;					

					//подпись
					var textHeight = 15 * dimScale; //высота текста
					var textPos = { x: svgPar.rect.x - 30, y: -svgPar.rect.y2 - 30 }
					var str = svgPar.shape.drawing.name;
					var text = drawText(str, textPos, textHeight, draw)
					text.attr({ "font-size": textHeight, })
					var b = text.getBBox();
					text.attr({ x: textPos.x + b.width / 2, });
				}
				//svgPar.basePoint.y -= svgPar.rect.height + 150;

				//подпись
				var textHeight = 30 * dimScale; //высота текста
				var textPos = newPoint_xy(svgPar.borderFrame.botLeft, 0, - 50)
				var str = "Сборочный чертеж косоура площадки";
				if (key == "21") str = "Сборочный чертеж дополнительного косоура площадки"
				if (key == "22") str = "Сборочный чертеж дополнительного косоура площадки"
				var text = drawText(str, textPos, textHeight, draw)
				text.attr({ "font-size": textHeight, })
				var b = text.getBBox();
				text.attr({ x: textPos.x + b.width / 2, });

				svgPar.basePoint.x = basePointTmp.x;
				svgPar.basePoint.y = svgPar.borderFrame.botLeft.y - 150;
				//svgPar.basePoint = newPoint_xy(svgPar.borderFrame.botLeft, 0, - 200);
				//if (key == "21") svgPar.basePoint = newPoint_xy(basePointTmp, svgPar.rect.width + 200, 0);
			}
		}

		//определяем масштаб и координаты листа
		scaleBorderDraw(svgPar);
		//создаем рамку листа
		var rect = drawRect(svgPar.borderFrame.botLeft, svgPar.formatX * svgPar.formatScale, -svgPar.formatY * svgPar.formatScale, draw).attr({
			fill: "none",
			stroke: "#555",
			"stroke-width": 1,
		})
		rect.setClass("other");

		basePoint.y = svgPar.borderFrame.botLeft.y - objDst - 500;
	}

	//создаем сборочный чертеж подложек для трубы
	if (isTreadPlateCabriole) {
		var svgPar = {
			draw: draw,
			basePoint: basePoint,
			basePointOffY: 0,
			borderFrame:
				{ botLeft: copyPoint(basePoint), topRigth: copyPoint(basePoint) }, //объект для точек границ сборочного чертежа
		}

		if (shapesTreadPlateCabriole[2]) {
			if (shapesTreadPlateCabriole[1].shapes.length == shapesTreadPlateCabriole[2].shapes.length) {
				for (var l = 0; l < shapesTreadPlateCabriole[1].shapes.length; l++) {
					if (!isShapesEqual(shapesTreadPlateCabriole[1].shapes[l], shapesTreadPlateCabriole[2].shapes[l])) {
						break;
					}
					if (l == shapesTreadPlateCabriole[1].shapes.length - 1) {
						shapesTreadPlateCabriole[1].count += shapesTreadPlateCabriole[2].count;
						delete shapesTreadPlateCabriole[2];
					}
				}
			}
		}
		if (shapesTreadPlateCabriole[3]) {
			if (shapesTreadPlateCabriole[1].shapes.length == shapesTreadPlateCabriole[3].shapes.length) {
				for (var l = 0; l < shapesTreadPlateCabriole[1].shapes.length; l++) {
					if (!isShapesEqual(shapesTreadPlateCabriole[1].shapes[l], shapesTreadPlateCabriole[3].shapes[l])) {
						break;
					}
					if (l == shapesTreadPlateCabriole[1].shapes.length - 1) {
						shapesTreadPlateCabriole[1].count += shapesTreadPlateCabriole[3].count;
						delete shapesTreadPlateCabriole[3];
					}
				}
			}
		}
		if (shapesTreadPlateCabriole[2] && shapesTreadPlateCabriole[3]) {
			if (shapesTreadPlateCabriole[2].shapes.length == shapesTreadPlateCabriole[3].shapes.length) {
				for (var l = 0; l < shapesTreadPlateCabriole[2].shapes.length; l++) {
					if (!isShapesEqual(shapesTreadPlateCabriole[2].shapes[l], shapesTreadPlateCabriole[3].shapes[l])) {
						break;
					}
					if (l == shapesTreadPlateCabriole[2].shapes.length - 1) {
						shapesTreadPlateCabriole[2].count += shapesTreadPlateCabriole[3].count;
						delete shapesTreadPlateCabriole[3];
					}
				}
			}
		}

		if (shapesTreadPlateCabriole['1_Turn1TreadPlate'] && shapesTreadPlateCabriole['2_Turn1TreadPlate']) {
			var treadPlate1 = shapesTreadPlateCabriole['1_Turn1TreadPlate'];
			var treadPlate2 = shapesTreadPlateCabriole['2_Turn1TreadPlate'];
			if (treadPlate1.shapes.length == treadPlate2.shapes.length) {
				for (var l = 0; l < treadPlate1.shapes.length; l++) {
					if (!isShapesEqual(treadPlate1.shapes[l], treadPlate2.shapes[l])) {
						break;
					}
					if (l == treadPlate1.shapes.length - 1) {
						shapesTreadPlateCabriole['1_Turn1TreadPlate'].count += shapesTreadPlateCabriole['2_Turn1TreadPlate'].count;
						delete shapesTreadPlateCabriole['2_Turn1TreadPlate'];
					}
				}
			}
		}
		if (shapesTreadPlateCabriole['1_Turn2TreadPlate'] && shapesTreadPlateCabriole['2_Turn2TreadPlate']) {
			var treadPlate1 = shapesTreadPlateCabriole['1_Turn2TreadPlate'];
			var treadPlate2 = shapesTreadPlateCabriole['2_Turn2TreadPlate'];
			if (treadPlate1.shapes.length == treadPlate2.shapes.length) {
				for (var l = 0; l < treadPlate1.shapes.length; l++) {
					if (!isShapesEqual(treadPlate1.shapes[l], treadPlate2.shapes[l])) {
						break;
					}
					if (l == treadPlate1.shapes.length - 1) {
						shapesTreadPlateCabriole['1_Turn2TreadPlate'].count += shapesTreadPlateCabriole['2_Turn2TreadPlate'].count;
						delete shapesTreadPlateCabriole['2_Turn2TreadPlate'];
					}
				}
			}
		}
		if (shapesTreadPlateCabriole['1_Turn3TreadPlate'] && shapesTreadPlateCabriole['2_Turn3TreadPlate']) {
			var treadPlate1 = shapesTreadPlateCabriole['1_Turn3TreadPlate'];
			var treadPlate2 = shapesTreadPlateCabriole['2_Turn3TreadPlate'];
			if (treadPlate1.shapes.length == treadPlate2.shapes.length) {
				for (var l = 0; l < treadPlate1.shapes.length; l++) {
					if (!isShapesEqual(treadPlate1.shapes[l], treadPlate2.shapes[l])) {
						break;
					}
					if (l == treadPlate1.shapes.length - 1) {
						shapesTreadPlateCabriole['1_Turn3TreadPlate'].count += shapesTreadPlateCabriole['2_Turn3TreadPlate'].count;
						delete shapesTreadPlateCabriole['2_Turn3TreadPlate'];
					}
				}
			}
		}

		var platforms = []
		if (shapesTreadPlateCabriole['1_platform']) platforms.push('1_platform')
		if (shapesTreadPlateCabriole['2_platform']) platforms.push('2_platform')
		if (shapesTreadPlateCabriole['3_platform']) platforms.push('3_platform')
		if (platforms.length > 1) {
			var treadPlate1 = shapesTreadPlateCabriole[platforms[0]];
			var treadPlate2 = shapesTreadPlateCabriole[platforms[1]];
			if (treadPlate1.shapes.length == treadPlate2.shapes.length) {
				for (var l = 0; l < treadPlate1.shapes.length; l++) {
					if (!isShapesEqual(treadPlate1.shapes[l], treadPlate2.shapes[l])) {
						var isNotEqualsPlatform1 = true
						break;
					}
					if (l == treadPlate1.shapes.length - 1) {
						shapesTreadPlateCabriole[platforms[0]].count += shapesTreadPlateCabriole[platforms[1]].count;
						delete shapesTreadPlateCabriole[platforms[1]];
					}
				}
			}
			if (platforms.length > 2) {
				var treadPlate1 = shapesTreadPlateCabriole[platforms[0]];
				var treadPlate2 = shapesTreadPlateCabriole[platforms[2]];
				if (treadPlate1.shapes.length == treadPlate2.shapes.length) {
					for (var l = 0; l < treadPlate1.shapes.length; l++) {
						if (!isShapesEqual(treadPlate1.shapes[l], treadPlate2.shapes[l])) {
							var isNotEqualsPlatform2 = true
							break;
						}
						if (l == treadPlate1.shapes.length - 1) {
							shapesTreadPlateCabriole[platforms[0]].count += shapesTreadPlateCabriole[platforms[2]].count;
							delete shapesTreadPlateCabriole[platforms[2]];
						}
					}
				}
			}
			if (isNotEqualsPlatform1 && isNotEqualsPlatform2) {
				var treadPlate1 = shapesTreadPlateCabriole[platforms[1]];
				var treadPlate2 = shapesTreadPlateCabriole[platforms[2]];
				if (treadPlate1.shapes.length == treadPlate2.shapes.length) {
					for (var l = 0; l < treadPlate1.shapes.length; l++) {
						if (!isShapesEqual(treadPlate1.shapes[l], treadPlate2.shapes[l])) {
							var isNotEqualsPlatform2 = true
							break;
						}
						if (l == treadPlate1.shapes.length - 1) {
							shapesTreadPlateCabriole[platforms[1]].count += shapesTreadPlateCabriole[platforms[2]].count;
							delete shapesTreadPlateCabriole[platforms[2]];
						}
					}
				}
			}
		}

		for (var key in shapesTreadPlateCabriole) {
			var shapes = shapesTreadPlateCabriole[key].shapes;			

			if (shapes.length > 0) {
				//рисуем сборочный чертеж подложек
				for (var j = 0; j < shapes.length; j++) {
					svgPar.shape = shapes[j];
					drawShapeSvg(svgPar);
				}

				//подпись
				var textHeight = 30 * dimScale; //высота текста
				var textPos = newPoint_xy(svgPar.borderFrame.botLeft, 50, - 50)
                //var str = "Сборочный чертеж подложек " + key + " марша: кол-во - " + count + " шт.";
				var str = "Сборочный чертеж подложек марша: кол-во - " + shapesTreadPlateCabriole[key].count + " шт.";

                if (key.length > 1 && key.substr(2) == "first") str = "Сборочный чертеж первой подложки первого марша: кол-во - 1шт.";
                if (key.length > 1 && key.substr(2) == "topLast") str = "Сборочный чертеж последней подложки последнего марша: кол-во - 1шт.";
				if (key.length > 1 && key.substr(2) == "platform") str = "Сборочный чертеж подложки площадки: кол-во - " + shapesTreadPlateCabriole[key].count + " шт.";
				if (key.length > 1 && key.substr(2) == "Turn1TreadPlate") str = "Сборочный чертеж первой забежной подложки: кол-во - " + shapesTreadPlateCabriole[key].count + " шт.";
				if (key.length > 1 && key.substr(2) == "Turn2TreadPlate") str = "Сборочный чертеж второй забежной подложки: кол-во - " + shapesTreadPlateCabriole[key].count + " шт.";
				if (key.length > 1 && key.substr(2) == "Turn3TreadPlate") str = "Сборочный чертеж третьей забежной подложки: кол-во - " + shapesTreadPlateCabriole[key].count + " шт.";
				var text = drawText(str, textPos, textHeight, draw)
				text.attr({ "font-size": textHeight, })
				var b = text.getBBox();
				text.attr({ x: textPos.x + b.width / 2, });

				svgPar.basePoint = newPoint_xy(svgPar.borderFrame.botLeft, 0, - 200);
			}
		}

		//определяем масштаб и координаты листа
		scaleBorderDraw(svgPar);
		//создаем рамку листа
		var rect = drawRect(svgPar.borderFrame.botLeft, svgPar.formatX * svgPar.formatScale, -svgPar.formatY  * svgPar.formatScale, draw).attr({
			fill: "none",
			stroke: "#555",
			"stroke-width": 1,
		})
		rect.setClass("other");

		basePoint.y = svgPar.borderFrame.botLeft.y - objDst - 500;
	}

    //создаем сборочный чертеж фланцев
    if (isFlans) {
        var svgPar = {
            draw: draw,
            basePoint: basePoint,
            basePointOffY: 0,
            borderFrame:
                { botLeft: copyPoint(basePoint), topRigth: copyPoint(basePoint) }, //объект для точек границ сборочного чертежа
        }
        for (var key in shapesFlans) {
            var shapes = shapesFlans[key].shapes;

            if (shapes.length > 0) {
                //рисуем сборочный чертеж фланцев
                for (var j = 0; j < shapes.length; j++) {
                    svgPar.shape = shapes[j];                   
                    drawShapeSvg(svgPar);
                    if (!svgPar.shape.drawing.notShiftBasePoint) svgPar.basePoint.x += svgPar.rect.width + 150;

                    //подпись
                    var textHeight = 15 * dimScale; //высота текста
                    var textPos = { x: svgPar.rect.x - 30, y: -svgPar.rect.y2 - 30 }
                    var str = svgPar.shape.drawing.name;
                    if (svgPar.shape.drawing.isCount) str += ": кол-во " + svgPar.shape.drawing.count + " шт.";
                    var text = drawText(str, textPos, textHeight, draw)
                    text.attr({ "font-size": textHeight, })
                    var b = text.getBBox();
                    text.attr({ x: textPos.x + b.width / 2, });
                }

                //подпись
                var textHeight = 30 * dimScale; //высота текста
                var textPos = newPoint_xy(svgPar.borderFrame.botLeft, 0, - 50)
                var str = key + " марш";
                var text = drawText(str, textPos, textHeight, draw)
                text.attr({ "font-size": textHeight, })
                var b = text.getBBox();
                text.attr({ x: textPos.x + b.width / 2, });

                svgPar.basePoint = newPoint_xy(svgPar.borderFrame.botLeft, 0, - 200);
            }
        }

        //определяем масштаб и координаты листа
        scaleBorderDraw(svgPar);
        //создаем рамку листа
        var rect = drawRect(svgPar.borderFrame.botLeft, svgPar.formatX * svgPar.formatScale, -svgPar.formatY * svgPar.formatScale, draw).attr({
            fill: "none",
            stroke: "#555",
            "stroke-width": 1,
        })
        rect.setClass("other");

        basePoint.y = svgPar.borderFrame.botLeft.y - objDst - 500;
		}
		
	if(shapesTurnRack.length > 0){
		//Отрисовываем поворотные столбы
		var racksPar = {
			draw: draw,
			shapes: shapesTurnRack,
			basePoint: {x: 0, y: 0},
		};
		var racksSet = drawSVGTurnRacks(racksPar);
	
		var a4Params = {
			elements: [racksSet],
			basePoint: {x:0, y:basePoint.y},
			orientation: 'vert',
			posOrientation: 'vert',
			draw: draw,
		}
		var lists = setA4(a4Params);
		basePoint = newPoint_xy(a4Params.basePoint, 0, -a4Params.height - 100);
	}
	if (railingShapes.length > 0) {
		var railingPar = {
			draw: draw, 
			shapes: railingShapes,
		}
		var railing = drawSVGRailing(railingPar);
		var a4Params = {
			elements: railing,
			basePoint: {x:0, y:basePoint.y},
			orientation: 'hor',
			posOrientation: 'hor',
			draw: draw,
		}
		var lists = setA4(a4Params);
		basePoint = newPoint_xy(a4Params.basePoint, 0, -a4Params.height - 100);
	}

	if (timberRailingShapes && timberRailingShapes.length > 0) {
		var railingPar = {
			draw: draw,
			shapes: timberRailingShapes
		};
		var timber_railings = drawTimberRailingFunction(railingPar);
		var a4Params = {
			elements: timber_railings,
			basePoint: {x:0, y:basePoint.y},
			orientation: 'hor',
			posOrientation: 'hor',
			draw: draw,
		}
		var lists = setA4(a4Params);
		basePoint = newPoint_xy(a4Params.basePoint, 0, -a4Params.height - 100);
	}

	if (glassShapes.length > 0) {
		var glassPar = {
			draw: draw, 
			shapes: glassShapes,
		}
		var glasses = drawGlass(glassPar);

		var a4Params = {
			elements: glasses,
			basePoint: {x:0, y:basePoint.y},
			orientation: 'hor',
			posOrientation: 'hor',
			draw: draw,
		}
		var lists = setA4(a4Params);
		basePoint = newPoint_xy(a4Params.basePoint, 0, -a4Params.height - 100);
	}

	if (handrailShapes.length > 0) {
		var handrailsPar = {
			draw: draw, 
			shapes: handrailShapes,
		}
		var handrails = drawSVGHandrails(handrailsPar);

		var a4Params = {
			elements: handrails,
			basePoint: {x:0, y:basePoint.y},
			orientation: 'hor',
			posOrientation: 'hor',
			draw: draw,
		}
		var lists = setA4(a4Params);
		basePoint = newPoint_xy(a4Params.basePoint, 0, -a4Params.height - 100);
	}
	//зум и сдвиг мышкой
	var panZoom = svgPanZoom('#svgOutputDivDraw svg', {
		zoomScaleSensitivity: 0.5,
		minZoom: 0.1,
		maxZoom: 100,
	});

	//слои
	var svgLayers = {
		parts: "детали",
		dimensions: "размеры",
		other: "прочее",
	}

	printLayersControls(svgLayers);


}

/***** FUNCTIONS *****/

function drawShapeSvg(par) {
	var shape = par.shape;
	var draw = par.draw;
	var basePoint = par.basePoint;


	var obj = makeSvgFromShape(shape, draw);
	obj.setClass("parts");

	//зеркалим объект если это есть в его параметрах
	if (shape.drawing.mirrow) mirrow(obj, "y");

	var b = obj.getBBox()
	var width = b.width;
	var height = b.height;

	if (shape.drawing.basePoint) {
		basePoint = newPoint_xy(basePoint, shape.drawing.basePoint.x, shape.drawing.basePoint.y);
		if (par.basePointOffY) basePoint.y -= par.basePointOffY;
	};

	var moovePoint = copyPoint(basePoint);
	moove(obj, moovePoint);


	//угол поворота
	var ang = 0;
	if (shape.drawing.baseLine) {
		ang = angle(shape.drawing.baseLine.p1, shape.drawing.baseLine.p2) / Math.PI * 180;
		if (shape.drawing.isTurned) ang *= -1;
	};

	rotate(obj, ang);

	//описанный прямоугольник
	var b = obj.getBBox()
	if (!(shape.drawing.isTurned || shape.drawing.group == "stringers")) {
		var rect = drawRect({ x: b.x, y: -b.y }, b.width, b.height, draw).attr({
			fill: "none",
			stroke: "#555",
			"stroke-width": 1,
		})
		rect.setClass("other");
	}



	//базовые точки размеров
	var p1 = { x: b.x, y: -b.y }
	var p2 = newPoint_xy(p1, b.width, 0);
	var p3 = newPoint_xy(p1, b.width, -b.height);
	var p4 = newPoint_xy(p1, 0, -b.height);

	if (!(shape.drawing.isTurned || shape.drawing.group == "stringers")) {
		//горизонтальный размер
		var dimPar = {
			type: "hor",
			p1: p1,
			p2: p2,
			offset: 30,
			side: "top",
			draw: draw,
		}

		var dim = drawDim(dimPar);
		dim.setClass("dimensions");


		//вертикальный размер
	    var dimPar = {
	        type: "vert",
	        p1: p2,
	        p2: p3,
	        offset: 50,
	        side: "right",
	        draw: draw,
	    }

		var dim = drawDim(dimPar);
		dim.setClass("dimensions");
	}

	if (shape.drawing.isTurned) {
		var angRad = angle(shape.drawing.baseLine.p1, shape.drawing.baseLine.p2);
		var pt1 = newPoint_xy(p1, 0, -width * Math.sin(angRad));
		var pt2 = newPoint_xy(p2, -height * Math.sin(angRad), 0);
		var pt3 = newPoint_xy(p3, 0, width * Math.sin(angRad));
		var pt4 = newPoint_xy(p4, height * Math.sin(angRad), 0);
		//наклонный размер
		var dimPar = {
			type: "dist",
			p1: pt3,
			p2: pt4,
			offset: 50,
			side: "bot",
			draw: draw,
		}

		var dim = drawDim(dimPar);
		dim.setClass("dimensions");

		//наклонный размер
		var dimPar = {
			type: "dist",
			p1: pt2,
			p2: pt3,
			offset: 50,
			side: "top",
			draw: draw,
		}

		var dim = drawDim(dimPar);
		dim.setClass("dimensions");
	}

	if (shape.drawing.group == "stringers") {
		//наклонный размер
		var dimPar = {
			type: "dist",
			p1: p2,
			p2: p4,
			offset: 50,
			side: "right",
			draw: draw,
		}

		var dim = drawDim(dimPar);
		dim.setClass("dimensions");
	}


	//определяем границы сборочного чертежа
	if (b.x < par.borderFrame.botLeft.x) par.borderFrame.botLeft.x = b.x;
	if (-b.y2 < par.borderFrame.botLeft.y) par.borderFrame.botLeft.y = -b.y2;

	if (b.x2 > par.borderFrame.topRigth.x) par.borderFrame.topRigth.x = b.x2;
	if (-b.y > par.borderFrame.topRigth.y) par.borderFrame.topRigth.y = -b.y;

	par.borderFrame.width = par.borderFrame.topRigth.x - par.borderFrame.botLeft.x;
	par.borderFrame.height = par.borderFrame.topRigth.y - par.borderFrame.botLeft.y;


	if (shape.drawing.group == "stringers" && !shape.drawing.isDivide) par.basePointOffY += b.height;

    par.rect = b;

	return par;
}


function scaleBorderDraw(par) {
	//делаем отступы чертежа от краев листа
	var borderFrame = par.borderFrame;
	borderFrame.botLeft = newPoint_xy(borderFrame.botLeft, -80, -80); //80 - отступ, чтобы надпись и размер попали в лист
	borderFrame.topRigth = newPoint_xy(borderFrame.botLeft, 80, 80); //80 - отступ, чтобы надпись и размер попали в лист
	borderFrame.width += 80 * 2;
	borderFrame.height += 80 * 2;

	par.formatOrient = "horizontal";
	if (borderFrame.height > borderFrame.width) par.formatOrient = "vertical";

	//определяем масштаб листа
	var formatScale = 1;
	par.formatX = 297;
	par.formatY = 210;
	if (par.formatOrient == "vertical") {
		par.formatX = 210;
		par.formatY = 297;
	}

	var formatScaleX = borderFrame.width / par.formatX;
	var formatScaleY = borderFrame.height / par.formatY;
	if (formatScaleX > formatScaleY) {
		formatScale = formatScaleX;
		borderFrame.botLeft.y -=
			(par.formatY * formatScale - borderFrame.height) / 2; //сдвигаем по Y, чтобы чертеж был посередине листа
	}
	if (formatScaleX <= formatScaleY) {
		formatScale = formatScaleY;
		borderFrame.botLeft.x -=
			(par.formatX * formatScale - borderFrame.width) / 2; //сдвигаем по X, чтобы чертеж был посередине листа
	}


	par.formatScale = formatScale;

	return par;
}

/** 
	* Функция отрисовывает стойки с размерами до отверстий
	* @param par 
	* Поля объекта:
	*- par.draw - paper Raphael'a
	*- par.shapes - шейпы поворотных столбов
	*- par.basePoint - базовая точка отрисовки

	@returns сет со всеми стойками

*/

function drawSVGTurnRacks(par){
	var draw = par.draw;
	var shapesTurnRack = par.shapes;
	var basePointTurn = {x:0, y:0};
	var turnRacksSet = draw.set();
	var dimScale = parseInt(params.dimScale) || 1;
	
	//создаем чертеж поворотного столба
	for (var i = 0; i < shapesTurnRack.length; i++) {
		var set = draw.set();
		var shape = shapesTurnRack[i];

		var obj = makeSvgFromShape(shape, draw);
		obj.setClass("turnRack");

		set.push(obj);

		var dimPar = {
			draw: draw,
			obj: obj,
		}
		var dim = drawDimensions(dimPar);
		set.push(dim.set);

		var rackPar = {
			draw: draw,
			shape: shape,
			obj: obj,
			drawHoleSide: true,
		}
		var rackSet = drawSVGRackHoles(rackPar);
		set.push(rackSet);
		//подпись
		var textHeight = 30 * dimScale; //высота текста
		var str = shape.drawing.name || 'Поворотный столб';
		var textPos = {x: textHeight * str.length / 4, y: -textHeight - rackPar.rackLengthDelta};
		var text = drawText(str, textPos, textHeight, draw)
		text.attr({ "font-size": textHeight, });
		set.push(text);
		
		var setBbox = set.getBBox();
		moove(set, newPoint_xy(basePointTurn, 0, setBbox.height));
		basePointTurn.x += setBbox.width + 10;

		turnRacksSet.push(set);
	}

	var setsBbox = turnRacksSet.getBBox();
	moove(turnRacksSet, newPoint_xy(par.basePoint, 0, 0));

	return turnRacksSet;
}


function EqualSizeShapes(shape1, shape2) {
	//инициализация
	//$("#svgOutputDivDraw").html("");
	//var draw = Raphael("svgOutputDivDraw", 800, 800);
	var paper = Raphael(10, 50, 320, 200);

	var obj1 = makeSvgFromShape(shape1, paper);
	var obj2 = makeSvgFromShape(shape2, paper);

	var b1 = obj1.getBBox()
	var b2 = obj2.getBBox()

	var isEqual = false;
	if (Math.round(b1.width) == Math.round(b2.width) && Math.round(b1.height) == Math.round(b2.height))
		isEqual = true;
	paper.clear();
	return isEqual;
}

function isEq(a, b) {

	if (a == b) return true;

	for (var i in a) {
		//if(typeof a[i] == "Object" && (a[i].x && a[i].y) && (a[i].x != b[i].x || a[i].y != b[i].y)) return false;
		if (typeof (a[i]) != "function" && !isEq(a[i], b[i])) return false;
	}
	for (var i in b) {
		//if(typeof b[i] == "Object" && (a[i].x && a[i].y) && (a[i].x != b[i].x || a[i].y != b[i].y)) return false;
		if (typeof (a[i]) != "function" && !isEq(a[i], b[i])) return false;
	}

	if (!isNaN(parseFloat(a)) && isFinite(a)) {
		//if (a.toFixed(3) !== b.toFixed(3)) return false;
		if (Math.round(a) !== Math.round(b)) return false;
	}

	return true;
}