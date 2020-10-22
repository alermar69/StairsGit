var draw = "";
// var listBasePoint = {x:3000, y: 0}; //Глобально для позиционирования листов
// var previousWidth = 0; //Глобально для позиционирования листов

function makeSvg(){
	
	//инициализация
	$("#svgOutputDivDraw").html("");
	var draw = Raphael("svgOutputDivDraw", 800, 800);
	var dimScale = $("#svgDimScale").val();
	
	//оси координат
	//drawAxisHelper(2000, draw)
	
	//создаем svg объекты из массива шейпов
	var basePoint = {x: 0, y: 0}
	var objDst = 200 + 100 * dimScale; //зазор между объектами на листе по вертикали
	
	//Массив в который попадают элементы которые требуют уникальной отрисовки
	var sortedShapes = {};
	
	//Группы которые отрисовываются отдельно
	var customDrawingGroups = ["glass", "handrails", "forged_railing", "timber_railing", "wndFrames"]
	
	// выводим только уникальные шейпы. Для повторяющихся считаем кол-во
	var shapesAmtList = [];
	$.each(shapesList, function(){
		var isUnique = true;
		var shape = this;
		var index = 0;
		for(var i=0; i < shapesAmtList.length; i++){
			if(isShapesEqual(shape, shapesAmtList[i])) {
				isUnique = false;
				index = i;
			}
		}

		if (shape.drawing) {
			if (shape.drawing.group) {
				if (!sortedShapes[shape.drawing.group]) sortedShapes[shape.drawing.group] = [];
				sortedShapes[shape.drawing.group].push(shape);
				if (customDrawingGroups.includes(shape.drawing.group)) isUnique = false;
			}
		}
		if(isUnique) {
			shape.amt = 1;
			shapesAmtList.push(shape);
		}else {
			shapesAmtList[index].amt += 1;
		}
	});
	
	var basePoint = {x:2500, y:0};

	if (sortedShapes.timber_railing) {
		var railingPar = {
			draw: draw,
			shapes: sortedShapes.timber_railing
		};
		var timber_railings = drawTimberRailingFunction(railingPar);
		var a4Params = {
			elements: timber_railings,
			basePoint: basePoint,
			orientation: 'hor',
			posOrientation: 'hor',
			draw: draw
		}
		var lists = setA4(a4Params);
		basePoint = newPoint_xy(a4Params.basePoint, 0, -a4Params.height - 100);
	}

	if (sortedShapes.forged_railing) {
		var railingPar = {
			draw: draw, 
			shapes: sortedShapes.forged_railing,
		}
		var railing = drawSVGRailing(railingPar);
		var a4Params = {
			elements: railing,
			basePoint: basePoint,
			orientation: 'hor',
			posOrientation: 'hor',
			draw: draw,
		}
		var lists = setA4(a4Params);
		basePoint = newPoint_xy(a4Params.basePoint, 0, -a4Params.height - 100);
	}
	if (sortedShapes.glass) {
		// var balustrade = drawBalustrade(sortedShapes.balustrade);
		// var lists = setA4(balustrade);g
		var glassPar = {
			draw: draw, 
			shapes: sortedShapes.glass,
		}
		var glasses = drawGlass(glassPar);

		var a4Params = {
			elements: glasses,
			basePoint: basePoint,
			orientation: 'hor',
			posOrientation: 'hor',
			draw: draw,
		}
		var lists = setA4(a4Params);
		basePoint = newPoint_xy(a4Params.basePoint, 0, -a4Params.height - 100);
	}

	if (sortedShapes.handrails) {
		var handrailsPar = {
			draw: draw, 
			shapes: sortedShapes.handrails,
		}
		var handrails = drawSVGHandrails(handrailsPar);

		var a4Params = {
			elements: handrails,
			basePoint: basePoint,
			orientation: 'hor',
			posOrientation: 'hor',
			draw: draw,
		}
		var lists = setA4(a4Params);
		basePoint = newPoint_xy(a4Params.basePoint, 0, -a4Params.height - 100);
	}

	if (sortedShapes.wndFrames) {
		var wndFramesPar = {
			draw: draw,
			shapes: sortedShapes.wndFrames,
		}
		var wndFrames = drawSVGWndFrames(wndFramesPar);

		var a4Params = {
			elements: wndFrames,
			basePoint: basePoint,
			orientation: 'hor',
			posOrientation: 'hor',
			draw: draw,
		}
		var lists = setA4(a4Params);
		basePoint = newPoint_xy(a4Params.basePoint, 0, -a4Params.height - 100);
	}
	
	/**
		* Отрисовывает стекла с размерами
		* @param par Поля объекта:
		*- draw - paper Raphael'a место в котором рисуем
		*- shapes - шейпы стекол

		* @returns Сет(draw.set()) со стеклами
	*/
	function drawGlass(par){
		var railingShapes = par.shapes;
		var draw = par.draw;

		if (railingShapes.length > 0) {
			var set = draw.set();
			$.each(railingShapes, function(){
				var glassSet = draw.set();

				var shape = this;
				var par = this.drawing;

				var obj = makeSvgFromShape(shape, draw);
				obj.setClass("glass");

				var objBbox = obj.getBBox();
				var p0 = {x:0, y:objBbox.y2 * -1};//Устанавливаем правильную точку y, так как у первого стекла есть срез а 0 точка ниже

				var dimPar = {
					obj: obj,
					draw: draw,
				}
				dimSet = drawDimensions(dimPar).set;
				dimSet.setClass("dimensions");

				var holes = shape.holes;
				for (let j = 0; j < holes.length; j++) {
					// console.log(holes[j]);
					var radius = 9;
					//Если получается достаем радиус из кривой
					if (holes[j].curves) {
						if (holes[j].curves[0]) {
							if (holes[j].curves[0].xRadius) {
								radius = holes[j].curves[0].xRadius;
							}
						}
					}
					var center = newPoint_xy(holes[j].currentPoint, -radius, 0);


					//вертикальный размер
					var dimPar = {
						type: "vert",
						p1: p0,
						p2: center,
						offset: 30,
						side: "right",
						draw: draw,
					}
					//Если x совпадает, смещаем размерную линию
					if (j < holes.length - 1) {
						if (Math.floor(holes[j + 1].currentPoint.x) == Math.floor(holes[j].currentPoint.x)) {
							dimPar.offset = 80;
						}
					}
					var dim = drawDim(dimPar);
					dim.setClass("dimensions");
					glassSet.push(dim);

					//горизонтальный размер
					var dimPar = {
						type: "hor",
						p1: p0,
						p2: center,
						offset: 30,
						side: "top",
						draw: draw,
					}
					
					var detailedTextPar = {
						draw: draw,
						center: center,
						text: 'Ф' + radius * 2,
						side: 'right',
						lineWidth: 1,
						textHeight: 20,
						offset: 30,
					}
					var text = drawDetailText(detailedTextPar);
					glassSet.push(text);

					var dim = drawDim(dimPar);
					dim.setClass("dimensions");
					glassSet.push(dim);
				}

				if (par.keyPoints) {
					if (par.keyPoints.topP1 && par.keyPoints.topP2) {
						//горизонтальный размер
						var dimPar = {
							type: "dist",
							p1: par.keyPoints.topP1,
							p2: par.keyPoints.topP2,
							offset: 100,
							side: "top",
							draw: draw,
						}
						
						var topSideDim = drawDim(dimPar);
						topSideDim.setClass("dimensions");
						glassSet.push(topSideDim);

						var vertPoint = newPoint_xy(par.keyPoints.topP1, 0, -	100);
						var anglePar = {
							draw: draw,
							center: par.keyPoints.topP1,
							p1: par.keyPoints.topP2,
							p2: vertPoint,
							offset: 200,
						}

						var angleDim = drawAngleDim2(anglePar);
						if (angleDim) glassSet.push(angleDim);
					}

					if (par.keyPoints.botP1 && par.keyPoints.botP2) {
						//горизонтальный размер
						var dimPar = {
							type: "dist",
							p1: par.keyPoints.botP1,
							p2: par.keyPoints.botP2,
							offset: 100,
							side: "bot",
							draw: draw,
						}
						
						var topSideDim = drawDim(dimPar);
						topSideDim.setClass("dimensions");
						glassSet.push(topSideDim);

						if (par.keyPoints.botP3) {
							//горизонтальный размер
							var dimPar = {
								type: "dist",
								p1: par.keyPoints.botP2,
								p2: par.keyPoints.botP3,
								offset: 100,
								side: "bot",
								draw: draw,
							}
							
							var topSideDim = drawDim(dimPar);
							topSideDim.setClass("dimensions");
							glassSet.push(topSideDim);
						}

						var horPoint = newPoint_xy(par.keyPoints.botP2, 100, 0);
						var anglePar = {
							draw: draw,
							center: par.keyPoints.botP2,
							p1: par.keyPoints.botP1,
							p2: horPoint,
							offset: 300,
						}

						var angleDim = drawAngleDim2(anglePar);
						if (angleDim) glassSet.push(angleDim);
					}
				}

				glassSet.push(dimSet);
				glassSet.push(obj);

				set.push(glassSet)
			});
			return set;
		}
	}

	//выводим на страницу уникальные шейпы
	
	$.each(shapesAmtList, function(i){
		var obj = makeSvgFromShape(this, draw);
		obj.setClass("parts");
		
		//зеркалим объект если это есть в его параметрах
		if(this.drawing && this.drawing.mirrow) mirrow(obj, "y");
		if(this.drawing && this.drawing.mirrow) obj.setClass("parts is_mirrored");
		
		//угол поворота
		var ang = 0;
		var isBaseLine = false;
		if (this.drawing.baseLine) {
			if (this.drawing.baseLine.p1 && this.drawing.baseLine.p2) isBaseLine = true;
		}
		if (this.drawing && isBaseLine){
			ang = angle(this.drawing.baseLine.p1, this.drawing.baseLine.p2) / Math.PI * 180;
		};
		
		rotate(obj, ang);
		moove(obj, basePoint);

		//описанный прямоугольник
		var b = obj.getBBox()
		var rect = drawRect({x: b.x, y: -b.y}, b.width, b.height, draw).attr({
			fill: "none",
			stroke: "#555",
			"stroke-width": 1,
		})
		rect.setClass("other");
		
		//базовые точки размеров
		var p1 = {x: b.x, y: -b.y}
		var p2 = newPoint_xy(p1, b.width, 0)
		var p3 = newPoint_xy(p1, b.width, -b.height)
		
		//горизонтальный размер
		var dimPar = {
			type: "hor",
			p1: p1,
			p2: p2,
			offset: 50,
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

		if (this.drawing) {
			if (this.drawing.dimPoints) {
				var dimPar = {
					dimPoints: this.drawing.dimPoints,
					draw: draw,
					basePoint: newPoint_xy(basePoint, 0, -b.height),
				};
				var dim = drawDimensionsByPoints(dimPar);
				dim.setClass("dimensions");
			}
		}
		
		//подпись
		var textHeight = 30 * dimScale; //высота текста
		var textPos = {
			x: b.cx,
			y: -b.y - b.height - textHeight,
			};
		var text = drawText("Кол-во " + this.amt + " шт.", textPos, textHeight, draw)
		text.attr({cx: textPos.x, "font-size": textHeight,})

		basePoint.y -= b.height + objDst;
	});
	
	// var sections = [];
	// addForgedSections(sections, view.scene);
	
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

	printLayersControls(svgLayers)
}


/**
 * Отрисовывает рамки забежных ступеней
 * @param {object} par 
 */
function drawSVGWndFrames(par) {
	var draw = par.draw;
	var handrailShapes = par.shapes;

	var sets = [];
	var partsBasePoint = { x: 0, y: -100 };

	$.each(handrailShapes, function () {
		var shape = this;
		var par = this.drawing;
		var set = sets.find(s => s.marshId == par.marshId && s.frameId == par.frameId);
		if (!set) {
			set = draw.set();
			set.marshId = par.marshId;
			set.frameId = par.frameId;

			var listText = "Рамка " + set.frameId + " забежной ступени марш " + par.marshId;
			set.listText = listText;
			set.wndFrame = draw.set();
			sets.push(set);

			partsBasePoint = { x: 0, y: -100 };
		}

		var obj = makeSvgFromShape(shape, draw);
		obj.setClass("wndFrames");

		//зеркалим объект если это есть в его параметрах
		if (this.drawing && this.drawing.mirrow) mirrow(obj, "y");
		if (this.drawing && this.drawing.mirrow) obj.setClass("parts is_mirrored");

		//угол поворота
		var ang = 0;
		var isBaseLine = false;
		if (this.drawing.baseLine) {
			if (this.drawing.baseLine.p1 && this.drawing.baseLine.p2) isBaseLine = true;
		}
		if (this.drawing && isBaseLine) {
			ang = angle(this.drawing.baseLine.p1, this.drawing.baseLine.p2) / Math.PI * 180;
		};

		rotate(obj, ang);
		moove(obj, partsBasePoint);

		obj.params = par;

		set.wndFrame.push(obj);

		var bbox = obj.getBBox();

		var dimPar = {
			obj: obj,
			draw: draw,
			//isNotFrame: true,
		}
		var dimSet = drawDimensions(dimPar).set;
		dimSet.setClass("dimensions");
		set.wndFrame.push(dimSet);

		partsBasePoint.y -= bbox.height + 100;
	});

	$.each(sets, function () {
		if (this.wndFrame) {

			var bbox = this.wndFrame.getBBox();
			moove(this.wndFrame, { x: 0, y: bbox.height });

			this.push(this.wndFrame);
		}
	});

	return sets;
}