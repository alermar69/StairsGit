
/**
	* Функция обертка для отрисовки секций ограждений
	* @param par Поля объекта:
	*- draw - paper Raphael'a место в котором рисуем
	*- shapes - шейпы ограждения

	* @returns Сет(draw.set()) с секциями
*/

function drawSVGRailing(par){
	var drawSVGRailingFunction = drawSVGForgedRailing;
	/* Тут возможны проверки на другие типы ограждений в будущем */
	var railing = drawSVGRailingFunction(par);

	return railing;
}

/**
	* Отрисовывает секции кованного ограждения
	* @param par Поля объекта:
	*- draw - paper Raphael'a место в котором рисуем
	*- shapes - шейпы ограждения

	* @returns Сет(draw.set()) с секциями
*/
function drawSVGForgedRailing(par) {
	var railingShapes = par.shapes;
	var draw = par.draw;

	if (railingShapes.length > 0) {
		var sets = [];
		$.each(railingShapes, function () {
			var shape = this;
			var par = this.drawing;
			var mirror = isMirrored(par.key);
			//Отрисовка секции
			{
				var set = sets.find(s => s.marshId == par.marshId && s.key == par.key);
				if (!set) {
					set = draw.set();
					set.marshId = par.marshId;
					set.key = par.key;
					//Кованные ограждения сверлятся сверху.
					set.listText = "Марш " + par.marshId + " Сторона " + (par.key == 'out' ? 'внешняя' : 'внутренняя') + ' (сверлить сверху)';
					if (params.orderName) set.listText = params.orderName + "\n" + set.listText;
					sets.push(set);
				}
				var elementBasePoint = { x: 0, y: 0 };

				if (par.elemType !== 'banister') {
					var obj = makeSvgFromShape(shape, draw);

					if (par.elemType == 'rack' && shape.holes.length == 0 && params.rackBottom == 'боковое') {
						var objBbox = obj.getBBox()
						var text = getIdByPoleIndex(par.partIndex);

						//подпись
						var detailedTextPar = {
							draw: draw,
							center: shape.drawing.pos,
							//center: { x: objBbox.cx, y: objBbox.cy * -1 },
							text: "Нога Г-образная\nНа нас",
							side: 'left',
							lineWidth: 2,
							textHeight: 30 * dimScale,
							offset: 50,
						}
						if (mirror) detailedTextPar.side = 'right';
						var text = drawDetailText(detailedTextPar);
						set.push(text);
					}
				}
				if (par.elemType == 'banister') {
					var svgPath = $("#forgeModal .modalItem[data-itemName=" + par.banisterType + "]").find("path").eq(0).attr("d");
					var obj = draw.path(svgPath);
				}
				if (mirror) {
					obj.transform("S-1,1");
					par.pos.x *= -1;
				}
				obj.setClass("railing");//Устанавливаем класс

				if (par.elemType !== 'pole' && par.elemType !== 'banister') {
					elementBasePoint = newPoint_xy(elementBasePoint, par.pos.x, par.pos.y);
				} else if (par.elemType == 'banister') {//Тк центр смещен в середину стойки
					var poleSize = 12;
					if (par.banisterType == '20х20') poleSize = 20;
					var b = obj.getBBox();

					var deltaY = par.balLen - b.height;//Высота штырька

					//Подогнано нужно потестить, но вроде ок
					// elementBasePoint = newPoint_xy(elementBasePoint, par.pos.x - poleSize / 2, par.pos.y + b.height + deltaY);
					elementBasePoint = newPoint_xy(elementBasePoint, par.pos.x - b.width / 2 + poleSize + poleSize / 2, par.pos.y + deltaY + 297);
					//Удлинняем балясину снизу
					if (deltaY > 0) {
						var rect = drawRect({ x: 0, y: 0 }, poleSize, deltaY, draw).attr({
							fill: "none",
							stroke: "#000",
							"stroke-width": 1,
						});
						rect.setClass("other");
						moove(rect, { x: elementBasePoint.x + b.width / 2 - poleSize / 2, y: par.pos.y + deltaY }, 'left_bot');
						set.push(rect);
					}
				} else {
					elementBasePoint = newPoint_xy(elementBasePoint, par.pos.x + 20/*profile/2*/, par.pos.y);
				}

				if (par.elemType == 'pole' && mirror) {
					var b = obj.getBBox();
					elementBasePoint = newPoint_xy(elementBasePoint, -b.width, b.height);
					moove(obj, elementBasePoint);
				} else if (par.elemType == 'banister') {
					moove(obj, elementBasePoint, 'left_bot');
				} else {
					moove(obj, elementBasePoint, 'left_bot');
				}

				//Если есть свойство listText добавляем текст
				if (par.partIndex) {
					var objBbox = obj.getBBox()
					var text = getIdByPoleIndex(par.partIndex);

					//подпись
					var detailedTextPar = {
						draw: draw,
						center: { x: objBbox.cx, y: objBbox.cy * -1 },
						text: text + " ",
						side: 'left',
						lineWidth: 2,
						textHeight: 30 * dimScale,
						offset: 50,
					}
					if (mirror) detailedTextPar.side = 'right';
					var text = drawDetailText(detailedTextPar);
					set.push(text);
				}

				var dimSet = null;
				//Размеры
				if (par.elemType !== 'pole' && par.elemType !== 'banister') {
					// var dimPar = {
					// 	obj: obj,
					// 	draw: draw,
					// }
					// dimSet = drawDimensions(dimPar).set;
					// dimSet.setClass("dimensions");
				}

				//Диагональный размер 
				if (par.elemType == 'pole') {
					var poleBox = obj.getBBox();
					var cutLen = 20 / Math.cos(par.ang);
					var p1 = { x: poleBox.x, y: poleBox.y + poleBox.height - cutLen };
					var p2 = { x: poleBox.x2, y: poleBox.y2 - poleBox.height };
					if (mirror) {
						p1 = { x: poleBox.x2, y: poleBox.y2 - cutLen };
						p2 = { x: poleBox.x, y: poleBox.y };
					}

					/* разворачиваем иначе размеры не там где нужно */
					p1.y *= -1;
					p2.y *= -1;

					//Сохраняем точки начала и конца, в дальнейшем пригодятся для размеров балясин
					par.startPoint = p1;
					par.endPoint = p2;

					// //горизонтальный размер
					// var dimPar = {
					// 	type: "dist",
					// 	p1: p1,
					// 	p2: p2,
					// 	offset: 100,
					// 	side: "top",
					// 	draw: draw,
					// }

					// if (par.place == 'bot') {
					// 	dimPar.side = 'bot';
					// 	dimPar.offset = 200;
					// }

					// dimSet = drawDim(dimPar);
					// dimSet.setClass("dimensions");

					if (par.place == 'top') {
						var center = { x: p1.x, y: p1.y - cutLen };
						var offset = 80;
						if (!mirror) {
							if (par.place == 'top' && !(getMarshParams(par.marshId).botTurn !== 'пол' && par.key == 'out' && par.poleId == 1)) center = newPoint_xy(center, 40, 40 * Math.tan(par.ang));
							var p1 = polar(center, par.ang, offset);
							var p2 = newPoint_xy(center, 0, -offset);
						}

						if (mirror) {
							if (par.place == 'top' && !(getMarshParams(par.marshId).botTurn !== 'пол' && par.key == 'out' && par.poleId == 1)) center = newPoint_xy(center, -40, 40 * Math.tan(par.ang));
							var p1 = newPoint_xy(center, 0, -offset);
							var p2 = polar(center, -par.ang, -offset);
						}
						var anglePar = {
							draw: draw,
							center: center,
							p1: p1,
							p2: p2,
							offset: offset,
						}

						var angleDim = drawAngleDim2(anglePar);
						if (angleDim) set.push(angleDim);
					}

					if (par.place == 'bot') {
						var center = { x: p1.x, y: p1.y };
						var offset = 80;
						if (!mirror) {
							var p1 = newPoint_xy(center, 0, offset);
							var p2 = polar(center, par.ang, offset);
						}

						if (mirror) {
							var p1 = polar(center, -par.ang, -offset);
							var p2 = newPoint_xy(center, -0.01, offset);
						}
						var anglePar = {
							draw: draw,
							center: center,
							p1: p1,
							p2: p2,
							offset: offset,
						}

						var angleDim = drawAngleDim2(anglePar);
						if (angleDim) set.push(angleDim);
					}
				}

				//if (par.elemType == 'rack' && shape.holes.length > 0) {
				//	var rackPar = {
				//		draw: draw,
				//		shape: shape,
				//		obj: obj,
				//		drawHoleSide: par.isTurnRack,
				//	}
				//	var rackSet = drawSVGRackHoles(rackPar);
				//	moove(rackSet, newPoint_xy(elementBasePoint, 20/*profile/2*/ - rackPar.xOffset, 0), 'left_bot');
				//	set.push(rackSet);
				//}

				set.push(obj);
				if (dimSet) set.push(dimSet);
			}
			//Отрисовка деталей отдельно
			{
				if (par.elemType == 'banister') return;
				var set = sets.find(s => s.marshId == par.marshId && s.key == par.key && s.isParts == true);
				if (!set) {
					set = draw.set();
					set.marshId = par.marshId;
					set.key = par.key;
					set.isParts = true;
					//Кованные ограждения сверлятся сверху.
					set.listText = "Марш " + par.marshId + " Сторона " + (par.key == 'out' ? 'внешняя' : 'внутренняя') + " (сверлить сверху)";
					if (params.orderName) set.listText = params.orderName + "\n" + set.listText;
					set.drawedParts = [];
					set.baseY = 0;
					sets.push(set);
				}
				var objShape = draw.set();
				if (par.partIndex) {
					var index = getIdByPoleIndex(par.partIndex);
					if (set.drawedParts.includes(index)) return;
				}

				if (par.startAngle) {
					var point1 = { x: par.startAngle.center.x, y: par.startAngle.center.y * -1 }
					var circle1 = draw.circle(point1.x, point1.y, 3);
					circle1.attr("fill", "transparent");
					circle1.attr("stroke", "none");
					objShape.push(circle1);

					var point2 = { x: par.startAngle.p1.x, y: par.startAngle.p1.y * -1 }
					var circle2 = draw.circle(point2.x, point2.y, 3);
					circle2.attr("fill", "transparent");
					circle2.attr("stroke", "none");
					objShape.push(circle2);

					var point3 = { x: par.startAngle.p2.x, y: par.startAngle.p2.y * -1 }
					var circle3 = draw.circle(point3.x, point3.y, 3);
					circle3.attr("fill", "transparent");
					circle3.attr("stroke", "none");
					objShape.push(circle3);

					objShape.startAngle = {
						center: circle1,
						p1: circle2,
						p2: circle3
					}
				}

				if (par.endAngle) {
					var point1 = { x: par.endAngle.center.x, y: par.endAngle.center.y * -1 }
					var circle1 = draw.circle(point1.x, point1.y, 3);
					circle1.attr("fill", "transparent");
					circle1.attr("stroke", "none");
					objShape.push(circle1);

					var point2 = { x: par.endAngle.p1.x, y: par.endAngle.p1.y * -1 }
					var circle2 = draw.circle(point2.x, point2.y, 3);
					circle2.attr("fill", "transparent");
					circle2.attr("stroke", "none");
					objShape.push(circle2);

					var point3 = { x: par.endAngle.p2.x, y: par.endAngle.p2.y * -1 }
					var circle3 = draw.circle(point3.x, point3.y, 3);
					circle3.attr("fill", "transparent");
					circle3.attr("stroke", "none");
					objShape.push(circle3);

					objShape.endAngle = {
						center: circle1,
						p1: circle2,
						p2: circle3
					}
				}

				// if (par.startAngle) {
				// 	var anglePar = {
				// 		draw: draw,
				// 		center: par.startAngle.center,
				// 		p1: par.startAngle.p1,
				// 		p2: par.startAngle.p2,
				// 		offset: 100,
				// 		debug: true,
				// 		drawLines: true,
				// 	}

				// 	var angleDim = drawAngleDim2(anglePar);
				// 	objShape.push(angleDim);
				// }

				// if (par.endAngle) {
				// 	var anglePar = {
				// 		draw: draw,
				// 		center: par.endAngle.center,
				// 		p1: par.endAngle.p1,
				// 		p2: par.endAngle.p2,
				// 		offset: 100,
				// 		debug: true,
				// 		drawLines: true,
				// 	}

				// 	var angleDim = drawAngleDim2(anglePar);
				// 	objShape.push(angleDim);
				// }

				var isRotate = shape.drawing.isTurnRack;

				var obj = makeSvgFromShape(shape, draw, isRotate);
				//угол поворота
				var ang = 0;
				if (par.baseLine) ang = angle(par.baseLine.p1, par.baseLine.p2) / Math.PI * 180;

				objShape.push(obj);

				if (par.dimPoints) {
					objShape.dimPoints = [];

					$.each(par.dimPoints, function () {
						// objShape.
						var point1 = { x: this.p1.x, y: this.p1.y * -1 };
						var circle1 = draw.circle(point1.x, point1.y, 3);
						circle1.attr("fill", "transparent");
						circle1.attr("stroke", "none");
						objShape.push(circle1);

						var point2 = { x: this.p2.x, y: this.p2.y * -1 };
						var circle2 = draw.circle(point2.x, point2.y, 3);
						circle2.attr("fill", "transparent");
						circle2.attr("stroke", "none");
						objShape.push(circle2);

						objShape.dimPoints.push({
							p1: circle1, p2: circle2, type: this.type
						});
					});
				}

				rotateSet2(objShape, ang);
				moove(objShape, { x: 0, y: set.baseY });

				if (mirror) objShape.transform("S-1,1,0,0...");

				if (objShape.startAngle) {
					var center = { x: objShape.startAngle.center.getBBox().cx, y: objShape.startAngle.center.getBBox().cy * -1 };
					var p1 = { x: objShape.startAngle.p1.getBBox().cx, y: objShape.startAngle.p1.getBBox().cy * -1 };
					var p2 = { x: objShape.startAngle.p2.getBBox().cx, y: objShape.startAngle.p2.getBBox().cy * -1 };
					p1.x += 0.01;
					p2.x -= 0.01;

					var anglePar = {
						draw: draw,
						center: center,
						p1: p1,
						p2: p2,
						offset: 150,
						drawLines: true,
					}

					var angleDim = drawAngleDim2(anglePar);
					set.push(angleDim);
				}

				if (objShape.endAngle && !isRotate) {
					var center = { x: objShape.endAngle.center.getBBox().cx, y: objShape.endAngle.center.getBBox().cy * -1 };
					var p1 = { x: objShape.endAngle.p1.getBBox().cx, y: objShape.endAngle.p1.getBBox().cy * -1 };
					var p2 = { x: objShape.endAngle.p2.getBBox().cx, y: objShape.endAngle.p2.getBBox().cy * -1 };
					p1.x += 0.01;
					p2.x -= 0.01;

					var anglePar = {
						draw: draw,
						center: center,
						p1: p1,
						p2: p2,
						offset: 150,
						drawLines: true,
					}

					var angleDim = drawAngleDim2(anglePar);
					set.push(angleDim);
				}

				if (objShape.dimPoints) {
					var dimPoints = [];
					$.each(objShape.dimPoints, function () {
						var p1 = { x: this.p1.getBBox().cx, y: this.p1.getBBox().cy * -1 };
						var p2 = { x: this.p2.getBBox().cx, y: this.p2.getBBox().cy * -1 };
						dimPoints.push({ p1: p1, p2: p2, type: 'hor' });
					});
					var dimPar = {
						dimPoints: dimPoints,
						draw: draw,
						dimOffset: 10,
					};
					var dim = drawDimensionsByPoints(dimPar);
					dim.setClass("dimensions");
					set.push(dim);
				}

				var bbox = obj.getBBox();

				set.baseY -= bbox.height + 200;

				set.push(objShape);

				bbox = obj.getBBox();

				if (par.partIndex) {
					var text = "Поз: " + getIdByPoleIndex(par.partIndex);// + " / " + par.partIndex;
					var info = getPartInfo(par.partIndex);
					if (info) {
						text += " " + info.poleProfileY + "х" + info.poleProfileZ;
					}
					set.drawedParts.push(getIdByPoleIndex(par.partIndex));
					text += " " + railingShapes.filter(function (s) {
						var shapePar = s.drawing;
						if (shapePar.marshId == par.marshId && shapePar.key == par.key && getIdByPoleIndex(shapePar.partIndex) == getIdByPoleIndex(par.partIndex)) {
							return true;
						}
						return false;
					}).length + " шт.";

					//подпись
					var detailedTextPar = {
						draw: draw,
						center: { x: bbox.cx, y: bbox.cy * -1 },
						text: text + " ",
						side: 'left',
						lineWidth: 2,
						textHeight: 30 * dimScale,
						offset: 140,
					}
					if (mirror) {
						detailedTextPar.side = 'right';
					}
					var text = drawDetailText(detailedTextPar);
					set.push(text);
				}

				var dimPar = {
					obj: obj,
					draw: draw,
				}
				dimSet = drawDimensions(dimPar).set;
				dimSet.setClass("dimensions");
				set.push(dimSet);

				// set.push(obj);
			}
		});

		//Устанавливаем размер между стойками и балясинами
		{
			$.each(sets, function () {
				if (this.isParts) return;
				var marshId = this.marshId;
				var key = this.key;
				var mirror = isMirrored(key);
				var factor = mirror ? -1 : 1;

				var racks = railingShapes.filter(shape => {
					if (shape.drawing) {
						if (shape.drawing.elemType == 'rack') {
							if (marshId == shape.drawing.marshId && key == shape.drawing.key) {
								return true;
							}
						}
					}
					return false
				});

				//Сортируем в правильном порядке
				racks.sort(function (a, b) {
					if (mirror) {
						return b.drawing.pos.x - a.drawing.pos.x;
					}
					if (!mirror) {
						return a.drawing.pos.x - b.drawing.pos.x;
					}
				});

				//Расстояние между стойками
				for (var i = 0; i < racks.length - 1; i++) {
					var pole = railingShapes.find(shape => {
						var data = shape.drawing || {};
						if (data.place == 'bot' && data.marshId == marshId && data.key == key && racks[i].drawing.poleId == data.poleId) {
							return shape
						}
						return false;
					});
					if (pole) {
						var firstRack = racks.find(shape => {
							var data = shape.drawing || {};
							if (shape.drawing.elemType == 'rack') {
								if (data.marshId == pole.drawing.marshId && data.key == pole.drawing.key && pole.drawing.poleId == data.poleId) {
									return shape
								}
							}
							return false;
						});
						var p1 = copyPoint(firstRack.drawing.pos);
						var p2 = copyPoint(racks[i + 1].drawing.pos);
						var polePos = copyPoint(pole.drawing.pos);
						var poleAngle = pole.drawing.ang;
						var cutLen = 20 / Math.cos(poleAngle) + 5;

						if (!mirror) p1.x += 40;
						if (mirror) p2.x += 40;

						polePos.y -= cutLen / 2 * factor;
						p1 = itercection(polePos, polar(polePos, poleAngle * factor, 100), p1, newPoint_xy(p1, 0, 100));
						p2 = itercection(polePos, polar(polePos, poleAngle * factor, 100), p2, newPoint_xy(p2, 0, 100));

						//горизонтальный размер
						var dimPar = {
							type: "dist",
							p1: p1,
							p2: p2,
							offset: 100 + (40 * i),
							side: "bot",
							draw: draw,
						}

						dimSet = drawDim(dimPar);
						dimSet.setClass("dimensions");
						this.push(dimSet);

						//размер от нижнего края стойки до нижней трубы секции
						var pt1 = copyPoint(racks[i].drawing.pos);
						if (racks[i].drawing.zeroDelta) pt1.y -= racks[i].drawing.zeroDelta - 90;
						if (!mirror) pt1.x += 40;
						var pt2 = itercection(polePos, polar(polePos, poleAngle * factor, 100), pt1, newPoint_xy(pt1, 0, 100));
						var dimPar = {
							type: "dist",
							p1: pt1,
							p2: pt2,
							offset: 100,
							side: "bot",
							draw: draw,
						}

						dimSet = drawDim(dimPar);
						dimSet.setClass("dimensions");
						this.push(dimSet);
					}
				}

				//размер от нижнего края последней стойки до нижней трубы кованной секции
				if (polePos) {
					var pt1 = newPoint_xy(racks[racks.length - 1].drawing.pos, 40, 0);
					if (racks[racks.length - 1].drawing.zeroDelta)
						pt1.y -= racks[racks.length - 1].drawing.zeroDelta - 90;
					var pt2 = itercection(polePos, polar(polePos, poleAngle * factor, 100), pt1, newPoint_xy(pt1, 0, 100));
					var dimPar = {
						type: "dist",
						p1: pt1,
						p2: pt2,
						offset: -100,
						side: "bot",
						draw: draw,
					}
					if (Math.floor(dimPar.p1.x) == Math.floor(dimPar.p2.x)) {
						dimSet = drawDim(dimPar);
						dimSet.setClass("dimensions");
						this.push(dimSet);
					}
				}


				var poles = railingShapes.filter(shape => {
					if (shape.drawing) {
						if (shape.drawing.elemType == 'pole' && shape.drawing.place == 'bot') {
							if (marshId == shape.drawing.marshId && key == shape.drawing.key) {
								return true;
							}
						}
					}
					return false
				});

				var balDimOffset = 30;//Отступ размера балясин
				//Расстояние между балясинами
				for (var i = 0; i < poles.length; i++) {
					var pole = poles[i];
					if (pole) {
						var cutLen = 20 / Math.cos(pole.drawing.ang);
						var poleAngle = pole.drawing.ang;
						var poleStartPoint = pole.drawing.startPoint;
						// var poleEndPoint = pole.drawing.endPoint;
						var firstBal, secondBal;
						var firstBalPos, secondBalPos;
						//Выбираем первую вторую и последнюю балясину для размеров;
						railingShapes.forEach(s => {
							var data = s.drawing;
							if (data) {
								if (marshId == data.marshId && key == data.key && data.poleId == pole.drawing.poleId) {
									if (data.count > 2) {
										if (data.index == Math.floor(data.count / 2)) firstBal = s;
										if (data.index == (Math.floor(data.count / 2) + 1)) secondBal = s;
									}
								}
							}
						});

						if (firstBal && secondBal) {

							poleStartPoint = newPoint_xy(poleStartPoint, 0, firstBal.drawing.balLen / 5);

							var firstBalPos = newPoint_xy(firstBal.drawing.pos, 20, 0);
							firstBalPos = itercection(poleStartPoint, polar(poleStartPoint, poleAngle * factor, 100), firstBalPos, newPoint_xy(firstBalPos, 0, 100));

							var secondBalPos = newPoint_xy(secondBal.drawing.pos, 20, 0);//20 - profile / 2
							secondBalPos = itercection(poleStartPoint, polar(poleStartPoint, poleAngle * factor, 100), secondBalPos, newPoint_xy(secondBalPos, 0, 100));

							var dimPar = {
								type: "dist",
								p1: firstBalPos,
								p2: secondBalPos,
								offset: balDimOffset,
								side: "top",
								draw: draw,
							}

							dimSet = drawDim(dimPar);
							dimSet.setClass("dimensions");
							this.push(dimSet);

							//Высота балясины
							var dimPar = {
								type: "vert",
								p1: firstBal.drawing.pos,
								p2: newPoint_xy(firstBal.drawing.pos, 0, firstBal.drawing.balLen),
								offset: 50,
								side: "left",
								draw: draw,
							}
							if (!mirror) dimPar.offset = -50;

							dimSet = drawDim(dimPar);
							dimSet.setClass("dimensions");
							this.push(dimSet);
						}

					}
				}

				//диагональный размер секции
				var pole = railingShapes.filter(shape => {
					if (shape.drawing) {
						if (shape.drawing.elemType == 'pole') {
							if (marshId == shape.drawing.marshId &&
								key == shape.drawing.key &&
								shape.drawing.place == 'top') {
								return true;
							}
						}
					}
					return false
				});

				if (racks[0]) {
					var dimPar = {
						type: "dist",
						p1: racks[0].drawing.pos,
						p2: pole[0].drawing.endPoint,
						offset: 0,
						side: "bot",
						draw: draw,
					}
					if (racks[0].drawing.zeroDelta) dimPar.p1.y -= racks[0].drawing.zeroDelta - 90;

					dimSet = drawDim(dimPar);
					dimSet.setClass("dimensions");
					this.push(dimSet);
				}

				
			});
		}



		return sets;
	}
}


function drawTimberRailingFunction(par){
	var railingShapes = par.shapes;
	var draw = par.draw;

	if (railingShapes.length > 0) {
		var sets = [];
		$.each(railingShapes, function(){
			var shape = this;
			var par = this.drawing;
			var mirror = isMirrored(par.key);
			//Отрисовка секции
			{
				var set = sets.find(s => s.marshId == par.marshId && s.key == par.key);
				if (!set){
					set = draw.set();
					set.marshId = par.marshId;
					set.key = par.key;
					//Кованные ограждения сверлятся сверху.
					set.listText = "Марш " + par.marshId + " Сторона " + (par.key == 'out' ? 'внешняя' : 'внутренняя');
					if (params.orderName) set.listText = params.orderName + "\n" + set.listText;
					sets.push(set);
				}
				var elementBasePoint = {x:0, y:0};

				if (par.type == 'rack' && par.svg == true) {
					var svgPath = $("#railing_racks [data-itemName="+par.rackType+"]").find("path").eq(0).attr("d");
					var obj = draw.path(svgPath);
					var objBbox = obj.getBBox();
					elementBasePoint = {x: objBbox.x + 95 / 2, y: objBbox.y2};
				}
				if (par.type == 'banister' && par.svg == true && params.railingModel == 'Деревянные балясины') {
					var svgPath = $("#timber_banister [data-itemName="+par.banisterType+"]").find("path").eq(0).attr("d");
					var obj = draw.path(svgPath);
					var objBbox = obj.getBBox();
					elementBasePoint = {x: objBbox.x + 25, y: objBbox.y2};
				}
				if (par.type == 'banister' && params.railingModel == 'Дерево с ковкой') {
					var svgPath = $("#forgeModal .modalItem[data-itemName=" + par.banisterType + "]").find("path").eq(0).attr("d");
					var obj = draw.path(svgPath);
					var objBbox = obj.getBBox();
					elementBasePoint = {x: objBbox.x, y: objBbox.y2};

					var poleSize = 12;
					if (par.banisterType == '20х20') poleSize = 20;
console.log(par.banisterType)
					//Удлинняем балясину снизу
					if (par.botLen > 0) {
						var rect = drawRect({x: 0, y: 0}, poleSize, par.botLen, draw).attr({
							fill: "none",
							stroke: "#000",
							"stroke-width": 1,
						});
						rect.setClass("other");
						moove(rect, {x: par.pos.x - poleSize / 2, y: par.pos.y}, 'left_bot');
						set.push(rect);
					}
				}

				if (par.svg !== true || !obj) {
					var obj = makeSvgFromShape(shape, draw);
				}

				obj.setClass("railing");//Устанавливаем класс

				if (shape.drawing.type == 'banister' && params.railingModel == 'Деревянные балясины') elementBasePoint.x -= 25;

				elementBasePoint = newPoint_xy(elementBasePoint, par.pos.x, par.pos.y);
				moove(obj, elementBasePoint, 'left_bot');
				
				set.push(obj);
			}
		});
		return sets;
	}
}

function drawForgedBanister(){

}

/**
	Функция определяет нужно ли зеркалить секцию на основе стороны
	@param {string} side - сторона секции 'in' или 'out'
*/
function isMirrored(side){
	var isMirrored = false;
	if (turnFactor == 1 && side == 'in') isMirrored = true;
	if (turnFactor == -1 && side == 'out') isMirrored = true;
	if (params.stairModel == "Прямая") isMirrored = !isMirrored;
	return isMirrored;
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

/**
	* Функция отрисовывает размеры до отверстий и их сторону
	* @param par 
	* Поля объекта:
	*- par.draw - paper Raphael'a
	*- par.shape - шейп столба из которого берем отверстия
	*- par.obj - svg объект
	*- par.drawHoleSide - (true/false)(по умолчанию false) Отрисовывать ли выноску с положением отверстия
	*- par.side - (необязательный, по умолчанию 'right') сторона размеров
	*- par.detailTextSide - (необязательный, по умолчанию 'left') сторона текста стороны отверстий

	* @returns сет со всеми размерами
 */
function drawSVGRackHoles(par) {
	var draw = par.draw;
	var set = draw.set(); //Сет со стойкой
	var shape = par.shape;
	var obj = par.obj;
	var side = par.side || 'right';
	var detailTextSide = par.detailTextSide || 'left';
	var drawHoleSide = par.drawHoleSide;

	var b = obj.getBBox();
	var rackLengthDelta = 0;// Расстояние от основания до 0 точки(ось шейпа находится не в 0 )
	if (shape.drawing) {
		if (typeof shape.drawing.yDelta !== 'undefined') rackLengthDelta = shape.drawing.yDelta;
	}

	par.rackLengthDelta = rackLengthDelta;
	//Ищем крайний левый угол, чтобы найти центр стойки
	var xmin = b.x;
	if (b.x2 < xmin) xmin = b.x2;

	var dimBasePoint = { x: xmin + b.width / 2, y: -rackLengthDelta };

	//Сортируем массив, по возрастанию порядка отверстий
	var holes = shape.holes.sort(function (a, b) {
		return a.currentPoint.y - b.currentPoint.y;
	});

	for (var j = 0; j < holes.length; j++) {
		var center = holes[j].currentPoint;
		center = newPoint_xy(dimBasePoint, 0, rackLengthDelta + center.y);
		//вертикальный размер
		var dimPar = {
			type: "vert",
			p1: dimBasePoint,
			p2: center,
			offset: 50 * (j + 1),
			side: side,
			draw: draw,
		}
		var dim = drawDim(dimPar);
		dim.setClass("dimensions");
		set.push(dim);

		if (holes[j].drawing) {
			if (holes[j].drawing.anglePos && drawHoleSide) {
				var detailedTextPar = {
					draw: draw,
					center: center,
					text: holes[j].drawing.anglePos,
					side: detailTextSide
				}
				var text = drawDetailText(detailedTextPar);
				set.push(text);
			}
		}
	}

	var bbox = set.getBBox();
	var minX = bbox.x < bbox.x2 ? bbox.x : bbox.x2;

	par.xOffset = dimBasePoint.x - minX;

	return set;
}

/**
 * Функция рисует размеры на основе массива точек пример: [{p1: ..., p2: ..., type:'hor'/'vert'/'dist'}] - тип размера как в фун-ии {@link drawDim}
 * @param {object} par
 *- par.draw - draw Raphael'a
 *- par.dimPoints - массив с размерными точками
 *- par.basePoint - (необязательный, по умолчанию 0,0) базовая точка для размерных точек
 *- par.dimOffset - (неоьязательный, по умолчанию 50) оффсет размеров
 * @returns set с размерами
 */
function drawDimensionsByPoints(par){
	var draw = par.draw || draw;
	var set = draw.set();
	var basePoint = par.basePoint || {x:0, y:0};
	var dimOffset = par.dimOffset || 50;

	for (var i = 0; i < par.dimPoints.length; i++) {
		var point = par.dimPoints[i];

		var dimPar = {
			type: point.type,
			p1: newPoint_xy(basePoint, point.p1.x, point.p1.y),
			p2: newPoint_xy(basePoint, point.p2.x, point.p2.y),
			offset: dimOffset,
			draw: draw,
		}

		var dim = drawDim(dimPar);
		dim.setClass("dimensions");
		set.push(dim);
	}

	return set;
}

/**
 * Отрисовывает поручни
 * @param {object} par 
 */
function drawSVGHandrails(par){
	var draw = par.draw;
	var handrailShapes = par.shapes;
	var commonSet = draw.set();

	//заполняем текст чертежа
	commonSet.listText = "Общий чертеж\n";
	if (params.orderName) commonSet.listText = params.orderName + "\n" + commonSet.listText;
	commonSet.listText += "материал: " + params.handrail + "\n";
	commonSet.listText += "профиль: " + params.handrailProf + "\n";
	commonSet.listText += "проточки по бокам: " + params.handrailSlots + "\n";
	commonSet.listText += "паз: " + (params.handrailFixType == 'паз' ? "да" : "нет") + "\n";
	commonSet.listText += "стык: " + params.handrailConnectionType + "\n";
	commonSet.listText += "фаски на концах: 6мм";

	// commonSet.listText = "Общий";
	var sets = [];
	//var sets = [commonSet];
	var partsBasePoint = {x:0, y: -100};
	$.each(handrailShapes, function(){
		var shape = this;
		var par = this.drawing;
		var set = sets.find(s => s.marshId == par.marshId && s.key == par.key);
		if (!set){
			if (getSectionPartsCount(handrailShapes, par.marshId, par.key).count > 0) {
				set = draw.set();
				set.marshId = par.marshId;
				set.key = par.key;
				//Кованные ограждения сверлятся сверху.
				var listText = "Поручень марш " + par.marshId + " Сторона " + (par.key == 'out' ? 'внешняя' : 'внутренняя') + ";\n";
				if (params.orderName) listText = params.orderName + "\n" + listText;
				listText += "материал: " + params.handrail + ";\n";
				listText += "профиль: " + params.handrailProf + ";\n";
				listText += "проточки по бокам: " + params.handrailSlots + ";\n";
				listText += "паз: " + (params.handrailFixType == 'паз' ? "да" : "нет") + "\n";
				listText += "стык: " + params.handrailConnectionType + "\n";
				listText += "фаски на концах: 6мм";
				set.listText = listText;
				set.handrailSection = draw.set();
				sets.push(set);

				partsBasePoint = {x:0, y: -100};
			}else{
				set = commonSet;
			}
		}

		if(par.baseAngle && set.handrailSection && !set.handrailSection.baseAngle) set.handrailSection.baseAngle = par.baseAngle;

		var dimScale = $('#dimScale').val();
		var zeroPoint = {x:0, y:0};

		if (set == commonSet) {
			var elementBasePoint = newPoint_xy(zeroPoint, 0, -180 * set.length);

			//Теперь отрисовываем отдельные части
			var polePar = {
				draw: draw,
				shape: shape
			}
			var poleSet = drawPoleSVG(polePar); 
			moove(poleSet, elementBasePoint);
			set.push(poleSet);

			//подпись
			var textHeight = 30 * dimScale; //высота текста
			var textPos = {
				x: elementBasePoint.x + poleSet.getBBox().width / 2,
				y: elementBasePoint.y + 30,//-b.y - b.height - textHeight,
			};
			var textStr = "Марш " + par.marshId + " Сторона " + (par.key == 'out' ? 'внешняя' : 'внутренняя');
			if (params.orderName) textStr = params.orderName + "\n" + textStr;
			if(par.unit == 'balustrade') textStr = 'Секция балюстрады';
			if (par.partIndex) {
				textStr += " Поз. " + getIdByPoleIndex(par.partIndex);
				var info = getPartInfo(par.partIndex);
				if (info) {
					textStr += " Профиль: " + info.poleProfileY + "х" + info.poleProfileZ;
				}
			}
			var text = drawText(textStr, textPos, textHeight, draw)

			text.attr({cx: textPos.x, "font-size": textHeight})
			set.push(text);
		}else{
			var obj = makeSvgFromShape(shape, draw);
			obj.setClass("handrails");

			var bbox = obj.getBBox();
			var elementBasePoint = newPoint_xy(zeroPoint, 0, bbox.height);
			if (par.isGlassLast) elementBasePoint = newPoint_xy(zeroPoint, -bbox.width, 110);
			
			if (params.handrailConnectionType == 'без зазора' || params.handrailConnectionType == 'прямые') elementBasePoint.x -= par.profHeight * Math.sin(par.ang);
			if (params.handrailConnectionType == 'без зазора премиум'){
				elementBasePoint.x -= par.startCutX
			}
			
			elementBasePoint = newPoint_xy(elementBasePoint, par.pos.x, par.pos.y);
			moove(obj, elementBasePoint);
			obj.params = par;
			
			if (par.anglePos) {
				var circle1 = draw.circle(0, 0, 3);
				circle1.attr("fill", "transparent");
				circle1.attr("stroke", "none");
				moove(circle1, {x: elementBasePoint.x, y: elementBasePoint.y});
				moove(circle1, {x:par.anglePos.center.x, y: par.anglePos.center.y});
				set.handrailSection.push(circle1);
				
				var circle2 = draw.circle(0,0, 3);
				circle2.attr("fill", "transparent");
				circle2.attr("stroke", "none");
				moove(circle2, {x: elementBasePoint.x, y: elementBasePoint.y});
				moove(circle2, {x:par.anglePos.p1.x, y: par.anglePos.p1.y});
				set.handrailSection.push(circle2);
				
				var circle3 = draw.circle(0, 0, 3);
				circle3.attr("fill", "transparent");
				circle3.attr("stroke", "none");
				moove(circle3, {x: elementBasePoint.x, y: elementBasePoint.y});
				moove(circle3, {x:par.anglePos.p2.x, y: par.anglePos.p2.y});
				set.handrailSection.push(circle3);

				obj.params.anglePos = {
					center: circle1,
					p1: circle2,
					p2: circle3
				}
			}
			set.handrailSection.push(obj);
			
			//Отрисовываем отдельные части
			if (par.elemType !== 'connectionUnit') {

				var polePar = {
					draw: draw,
					shape: shape
				}
				var poleSet = drawPoleSVG(polePar);
				
				moove(poleSet, partsBasePoint);
				set.push(poleSet);

				//подпись
				var textHeight = 30 * dimScale; //высота текста
				var textPos = {
					x: partsBasePoint.x,
					y: partsBasePoint.y + 30,//-b.y - b.height - textHeight,
				};
				
				var textStr = " Поз. " + getIdByPoleIndex(par.partIndex);
				var info = getPartInfo(par.partIndex);
				if (info) {
					textStr += " Профиль: " + info.poleProfileY + "х" + info.poleProfileZ;
				}
				var text = drawText(textStr, textPos, textHeight, draw)

				text.attr({cx: textPos.x, "font-size": textHeight})
				set.push(text);

				var setBbox = poleSet.getBBox();
				partsBasePoint.y -= setBbox.height + 50;
			}
		}
	});

	$.each(sets, function(){
		if (this.handrailSection) {
			var handrailSection = this.handrailSection;
			$.each(this.handrailSection, function(){
				this.transform("...R" + handrailSection.baseAngle + ",0,0");
				var par = this.params;
				//Добавляем текст
				if (par) {
					if (par.anglePos) {
						var center = get_center(par.anglePos.center);
						var p1 = get_center(par.anglePos.p1);
						var p2 = get_center(par.anglePos.p2); 
						var anglePar = {
							draw: draw,
							center: {x: center.x, y: center.y * -1},
							p1: {x: p1.x, y: p1.y * -1},
							p2: {x: p2.x, y: p2.y * -1},
							offset: 50,
							drawLines: false
						}

						var angleDim = drawAngleDim2(anglePar);
						handrailSection.push(angleDim);
					}

					if (par.partIndex) {
						var objBbox = this.getBBox()
						var text = getIdByPoleIndex(par.partIndex);
						
						//подпись
						var detailedTextPar = {
							draw: draw,
							center: {x: objBbox.cx, y: objBbox.cy * -1},
							text: text + " ",
							side: 'left',
							lineWidth: 2,
							textHeight: 30,
							offset: 50,
						}
						var text = drawDetailText(detailedTextPar);
						handrailSection.push(text);
					}
				}
			});
			
			var bbox = this.handrailSection.getBBox();
			moove(this.handrailSection, {x:0, y: bbox.height});

			this.push(this.handrailSection);
		}
	});

	return sets;
}

function get_center(obj){
	return {x: obj.getBBox().cx, y:obj.getBBox().cy};
}

/**
 * 
 * @param par.draw - draw raphael'a
 * @param par.shape
 * 
 * @return set
 */
function drawPoleSVG(par){
	var draw = par.draw;
	var set = draw.set();
	var shape = par.shape;
	var shapePar = shape.drawing;

	var obj = makeSvgFromShape(shape, draw);
	obj.setClass("handrails");
	set.push(obj);

	if (shapePar.startAngle) {
		// var line1 = drawLine(shapePar.startAngle.center, shapePar.startAngle.p1, draw);
		// set.push(line1);
		// var line2 = drawLine(shapePar.startAngle.center, shapePar.startAngle.p2, draw);
		// set.push(line2);

		var point1 = {x:shapePar.startAngle.center.x, y:shapePar.startAngle.center.y * -1}
		var circle1 = draw.circle(point1.x, point1.y, 3);
		circle1.attr("fill", "transparent");
		circle1.attr("stroke", "none");
		set.push(circle1);

		var point2 = {x:shapePar.startAngle.p1.x, y:shapePar.startAngle.p1.y * -1}
		var circle2 = draw.circle(point2.x, point2.y, 3);
		circle2.attr("fill", "transparent");
		circle2.attr("stroke", "none");
		set.push(circle2);

		var point3 = {x:shapePar.startAngle.p2.x, y:shapePar.startAngle.p2.y * -1}
		var circle3 = draw.circle(point3.x, point3.y, 3);
		circle3.attr("fill", "transparent");
		circle3.attr("stroke", "none");
		set.push(circle3);

		set.startAngle = {
			center: circle1,
			p1: circle2,
			p2: circle3
		}
	}

	if (shapePar.endAngle) {
		var point1 = {x:shapePar.endAngle.center.x, y:shapePar.endAngle.center.y * -1}
		var circle1 = draw.circle(point1.x, point1.y, 3);
		circle1.attr("fill", "transparent");
		circle1.attr("stroke", "none");
		set.push(circle1);

		var point2 = {x:shapePar.endAngle.p1.x, y:shapePar.endAngle.p1.y * -1}
		var circle2 = draw.circle(point2.x, point2.y, 3);
		circle2.attr("fill", "transparent");
		circle2.attr("stroke", "none");
		set.push(circle2);

		var point3 = {x:shapePar.endAngle.p2.x, y:shapePar.endAngle.p2.y * -1}
		var circle3 = draw.circle(point3.x, point3.y, 3);
		circle3.attr("fill", "transparent");
		circle3.attr("stroke", "none");
		set.push(circle3);

		set.endAngle = {
			center: circle1,
			p1: circle2,
			p2: circle3
		}
	}

	//угол поворота
	var ang = 0;
	var isBaseLine = false;
	if (shapePar.baseLine) {
		if (shapePar.baseLine.p1 && shapePar.baseLine.p2) isBaseLine = true;
	}
	if (shapePar&& isBaseLine){
		ang = angle(shapePar.baseLine.p1, shapePar.baseLine.p2) / Math.PI * 180;
	};
	
	rotateSet2(set, ang);
	
	if (set.startAngle) {
		var center = {x: set.startAngle.center.getBBox().cx, y: set.startAngle.center.getBBox().cy * -1};
		var p1 = {x: set.startAngle.p1.getBBox().cx, y: set.startAngle.p1.getBBox().cy * -1};
		var p2 = {x: set.startAngle.p2.getBBox().cx, y: set.startAngle.p2.getBBox().cy * -1};
		p1.x += 0.01;
		p2.x -= 0.01;

		var anglePar = {
			draw: draw,
			center: center,
			p1: p1,
			p2: p2,
			offset: 150,
			drawLines: true,
		}

		var angleDim = drawAngleDim2(anglePar);
		set.push(angleDim);
	}

	if (set.endAngle) {
		var center = {x: set.endAngle.center.getBBox().cx, y: set.endAngle.center.getBBox().cy * -1};
		var p1 = {x: set.endAngle.p1.getBBox().cx, y: set.endAngle.p1.getBBox().cy * -1};
		var p2 = {x: set.endAngle.p2.getBBox().cx, y: set.endAngle.p2.getBBox().cy * -1};
		p1.x += 0.01;
		p2.x -= 0.01;
		
		var anglePar = {
			draw: draw,
			center: center,
			p1: p1,
			p2: p2,
			offset: 150,
			drawLines: true,
		}

		var angleDim = drawAngleDim2(anglePar);
		set.push(angleDim);
	}

	var dimPar = {
		obj: obj,
		draw: draw,
		isNotFrame: true,
	}
	var dimSet = drawDimensions(dimPar).set;
	dimSet.setClass("dimensions");
	set.push(dimSet);

	return set;
}

/**
 * Получает количество деталей в секции, для определения нужен ли отдельный чертеж(он нужен если деталей больше 1)
 * @param {array} handrailShapes Шейпы
 * @param {number} marshId Ид марша
 * @param {string} key Сторона
 */
function getSectionPartsCount(handrailShapes, marshId, key) {
	var count = 0;
	var shapes = [];
	$.each(handrailShapes, function(){
		if (this.drawing && this.drawing.marshId == marshId && this.drawing.key == key) {
			shapes.push(this);
			count++;
		}
	})
	return {count: count, shapes: shapes}
}
