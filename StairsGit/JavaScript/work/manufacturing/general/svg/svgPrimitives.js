/** функция отрисовывает размер
type "hor" || "vert" || "dist" - тип: вертикальный, горизонтальный или наклонный
p1
p2
side "top" || "bot" || "left" || "right" - смещение размерной линии
offset - величина смещения
*/

function drawDim(par){
	var dimScale = $("#svgDimScale").val();
	if(par.dimScale) dimScale = par.dimScale;
	var lineExt = 10 * dimScale; //продление выносной линии за размерную
	var arrowSize = 7 * dimScale; //размер засечек/стрелок
	var textHeight = 30 * dimScale; //высота текста
	par.offset *= dimScale;
	
	//выносные и размерная линии
	
	//горизонтальный размер
	if(par.type == "hor"){
		var dimLineY = Math.max(par.p1.y, par.p2.y) + par.offset;
		if(par.side == "bot") {
			dimLineY = Math.min(par.p1.y, par.p2.y) - par.offset;
			lineExt *= -1;
		}
		var p11 = {x: par.p1.x, y: dimLineY};
		var p12 = newPoint_xy(p11, 0, lineExt)
		var p21 = {x: par.p2.x, y: dimLineY};
		var p22 = newPoint_xy(p21, 0, lineExt)
	}
	
	//вертикальный размер
	if(par.type == "vert"){
		var dimLineX = Math.max(par.p1.x, par.p2.x) + par.offset;
		if(par.side == "left") {
			dimLineY = Math.min(par.p1.x, par.p2.x) - par.offset;
			lineExt *= -1;
		}
		var p11 = {x: dimLineX, y: par.p1.y};
		var p12 = newPoint_xy(p11, lineExt, 0)
		var p21 = {x: dimLineX, y: par.p2.y};
		var p22 = newPoint_xy(p21, lineExt, 0)
	}
	
	//наклонный размер
	if(par.type == "dist"){
		var dimLineOffset = par.offset * 1.0;
		if(par.side == "bot"){ 
			dimLineOffset = -par.offset * 1.0;
			lineExt *= -1;
		}
		var ang = angle(par.p1, par.p2) + Math.PI / 2;
		
		var p11 = polar(par.p1, ang, dimLineOffset);
		var p12 = polar(p11, ang, lineExt);
		var p21 = polar(par.p2, ang, dimLineOffset);
		var p22 = polar(p21, ang, lineExt);
	}

	
	var leftLine = drawLine(par.p1, p12, par.draw)
	var rightLine = drawLine(par.p2, p22, par.draw)
	var dimLine = drawLine(p11, p21, par.draw)
	
	//засечки
	
	var pt1 = newPoint_xy(p11, arrowSize, arrowSize);
	var pt2 = newPoint_xy(p11, -arrowSize, -arrowSize);
	var arrow1 = drawLine(pt1, pt2, par.draw)
	
	var pt1 = newPoint_xy(p21, arrowSize, arrowSize);
	var pt2 = newPoint_xy(p21, -arrowSize, -arrowSize);
	var arrow2 = drawLine(pt1, pt2, par.draw)
	
	//размерный текст
	var val = Math.abs(p11.x - p21.x);
	var textPos = {
		x: (p11.x + p21.x) / 2,
		y: dimLineY + textHeight * 0.5,
	}
	
	if(par.type == "vert") {
		val = Math.abs(p11.y - p21.y);
		textPos = {
			x: dimLineX - textHeight * 0.5,
			y: (p11.y + p21.y) / 2,
		}
	}
	
	if(par.type == "dist") {
		val = distance(par.p1, par.p2);
		var textPos = {
			x: (p11.x + p21.x) / 2,
			y: (p11.y + p21.y) / 2,
		}
		textPos = polar(textPos, ang, textHeight * 0.5)
	}
	
	val = Math.round(val);
	
	var text = drawText(val, textPos, textHeight, par.draw)
	text.attr({cx: textPos.x, "font-size": textHeight,})

	if (ang) {
		text.node.setAttribute("data-rot", ang * 180 / Math.PI - 90);
	}
	par.size = val;
	if(par.type == "vert"){
		rotate(text, -90);
		text.node.setAttribute("data-rot","90");
	}
	
	if(par.type == "dist"){
		rotate(arrow1, -ang / Math.PI * 180 + 90)
		rotate(arrow2, -ang / Math.PI * 180 + 90)
		rotate(text, -ang / Math.PI * 180 + 90)
	}
	
	var group = par.draw.set();
	group.push(leftLine, rightLine, dimLine, arrow1, arrow2, text);
	
	return group;
	
}//end of drawDim

/** функция отрисовывает прямоую линию и возвращает ссылку на нее 
*/

function drawLine(p1, p2, draw){
	/*
	return draw.line(p1.x, -p1.y, p2.x, -p2.y).attr({
		fill: "none",
		stroke: "#000",
		strokeWidth: 1,
	});
	*/
	var curveArr = [
			['M', p1.x, -p1.y],
			['L', p2.x, -p2.y],
		];
		
		
	var pathString = getPathString(curveArr)
	
	var path = draw.path(pathString)
	path.attr({
		fill: "none",
		stroke: "#000",
		strokeWidth: 1,
	})
	
	return path;
	
	
}

/** функция отрисовывает прямоугольник и возвращает ссылку на него. Базовая точка в верхнем левом углу
*/

function drawRect(basePoint, width, height, draw, strokeWidth){
	var p1 = copyPoint(basePoint);
	var p2 = newPoint_xy(p1, width, 0);
	var p3 = newPoint_xy(p1, width, -height);
	var p4 = newPoint_xy(p1, 0, -height);

	var curveArr = [
			['M', p1.x, -p1.y],
			['L', p2.x, -p2.y],
			['L', p3.x, -p3.y],
			['L', p4.x, -p4.y],
			['L', p1.x, -p1.y],
		];
		
		
	var pathString = getPathString(curveArr)
	
	var path = draw.path(pathString)
	path.attr({
		fill: "none",
		stroke: "#000",
		strokeWidth: 1,
	});
	if (typeof strokeWidth !== 'undefined') path.attr('stroke-width', strokeWidth);
	return path;
	
}

/** функция отрисовывает многоугольник и возвращает ссылку на него. Базовая точка первая в массиве
*/

function drawSvgPolygon(par){
	
	var curveArr = [
			['M', par.points[0].x, -par.points[0].y],
		];
	
	for(var i=1; i<par.points.length; i++){
		var line = ['L', par.points[i].x, -par.points[i].y];
		curveArr.push(line);
	}
	
	//замыкающая линия
	var line = ['L', par.points[0].x, -par.points[0].y];
	curveArr.push(line);
	
		
	var pathString = getPathString(curveArr)
	
	var path = draw.path(pathString)
	path.attr({
		fill: "none",
		stroke: "#000",
		strokeWidth: 1,
	})
	
	return path;
	
}

/** функция отрисовывает текст и возвращает ссылку на него
*/

function drawText(text, pos, size, draw){
	if(!text) text = "";
	text = text.toString();
	var textObj = draw.text(pos.x, -pos.y, text)
	textObj.attr({"font-size": size,})

	return textObj;
}

/** функция возвращет строку в svg формате по массиву параметров
*/

function getPathString(arr){
	var string = ""
	for(var i=0; i<arr.length; i++){
		var command = arr[i];
		$.each(command, function(){
			string += this + " ";
		})
	}
	return string;
}

/** функция поворачивает объект на заданный угол. Если центр вращения не задан, вращение 
происходит вокруг начала координат
*/

function rotate(obj, ang, center){
	/*
	if(!center) center = {x:0, y:0}
	
	//var t = new Snap.Matrix();
	var t = obj.transform().globalMatrix;
	t.rotate(ang, center.x, -center.y);
	obj.transform(t)
	*/
	if(!center) obj.rotate(ang);
	if(center) obj.rotate(ang, center.x, center.y);
	
}

function rotateSet(set, ang){
	//	var degree = -45;
		var x = 0;
		var y = 0;
		set.forEach(function(e) {
			var textDegree = Math.round( Raphael.angle(e.attr("x"), e.attr("y"), x, y) );
				/*
				if(e.attr("text-anchor") === "end") {
				  textDegree = textDegree - 180;
				}
				*/
			/*
				e.animate({
				  transform: ["r", degree, x, y, "r", textDegree, e.attr("x"),
			e.attr("y")]
				}, 500);
				*/
			e.transform(["r", ang, x, y, "r", textDegree, e.attr("x"), e.attr("y")]);
		});
	}

/** функция перемещает объект в заданную точку. По умолчанию базовая точка - 
верхняя левая точка описанного вокруг объекта прямоугольника*/

function moove(obj, point, align){		
	var b = obj.getBBox();
	var dy = -b.y - point.y;
	if(align == "left_bot") dy = - point.y;
	obj.transform("...T" + (-b.x + point.x)  + "," + dy);
}

/**
	* Функция отрисовывает вертикальные и горизонтальные размеры для элемента
	* @param {Object} par 
	*Поля par
		*- par.draw - paper Raphael'a (место в котором рисуем).
		*- par.obj - Объект который нужно образмерить.
	@returns Возвращает объект:
		*- set - массив с размерами
		*- height - высота
		*- width - ширина
*/

function drawDimensions(par){
	var draw = par.draw;
	par.set = draw.set();
	var b = par.obj.getBBox();
	par.height = b.height;
	par.width = b.width;
	
	var rect = drawRect({x: b.x, y: -b.y}, b.width, b.height, draw).attr({
		fill: "none",
		stroke: "#555",
		"stroke-width": 1,
	})
	rect.setClass("other");
	if(!par.isNotFrame) par.set.push(rect);
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
	par.set.push(dim);
	
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
	par.set.push(dim);
	
	return par;
}

/**
	*Вписывает элементы в a4 лист и отрисовывает их. Получить координату последнего листа после выполнения можно обратившись к par.basePoint
	*** Один элеменент массива - один лист
	*@param par Поля объекта:
	*- par.draw - paper Raphael'a место в котором рисуем.
	*- par.elements - массив элементов (свойство listText в элементе - надпись на листе)
	*- par.orientation - (необязательно - по умолчанию горизонтально) Ориентация листа 'hor' 'vert' 'auto'
	*- par.posOrientation - (необязательно - по умолчанию горизонтально) Ориентация положений литов 'hor' 'vert'
	*- par.basePoint - Базовая точка для листов

	*@return lists - массив с листами
	*@returns в par обновляется:
	*- basePoint - соответствует позиции следующего леста
	*- height - общая высота листов
	*- width - общая ширина листов
*/

function setA4(par){
	var koef = 1.4143;
	var draw = par.draw;
	var lists = draw.set();
	var elemArr = par.elements;
	var orient = par.orientation || 'hor';
	var posOrient = par.posOrientation || 'hor';

	var listBasePoint = par.basePoint;
	
	for (var i = 0; i < elemArr.length; i++) {
		var set = draw.set();
		var obj = elemArr[i];
		var bbox = obj.getBBox();
		
		var listOrient = orient;
		if (orient == 'auto') {
			if(bbox.width >= bbox.height) listOrient = 'hor';
			if(bbox.width < bbox.height) listOrient = 'vert';
		}

		var listHeight, listWidth = 0;
		
		//Считаем лист на основе большей стороны
		if (bbox.width >= bbox.height) {
			listWidth = bbox.width + 200;
			listHeight = listWidth / koef;
		}
		if (bbox.width < bbox.height) {
			listHeight = bbox.height + 200;
			listWidth = listHeight * koef;
		}

		if (listWidth < bbox.width || listHeight < bbox.height) {
			var iterationsCount = 0; //Кол-во итераций
			var fixSide = listWidth < bbox.width ? 'width' : 'height';//Определяем какая сторона проблемная, необходимо для проверки цикла
			do {
				listHeight += 100;
				listWidth = listHeight * koef;
				iterationsCount++;
			} while (((listWidth < bbox.width && fixSide == 'width') || (listHeight < bbox.height && fixSide == 'height')) && iterationsCount < 20); //Останавливаем если кол-во итераций > 20
			console.log("оптимизирован размер листа, кол-во итераций: " + iterationsCount)
		}

		//При вертикальной ориентации меняем местами переменные(высота/ширина)
		if(listOrient == 'vert'){
			var temp = listWidth;
			listWidth = listHeight;
			listHeight = temp;
		}

		//Рисуем контур листа
		var rectPos = {
			x: bbox.x - listWidth / 2 + bbox.width / 2, 
			y: -bbox.y + listHeight / 2 - bbox.height / 2
		};
		var rect = drawRect(rectPos, listWidth, listHeight, draw).attr({
			fill: "none",
			stroke: "#000",
			"stroke-width": 2,
		});
		rect.setClass("other");
		
		//Если есть свойство listText добавляем текст
		if (obj.listText) {
			var text = obj.listText.split("\n");
						
			var basePoint = newPoint_xy(rectPos, 10, -10);
			text.forEach(function(text){
				//подпись
				var textHeight = 30; //высота текста
				var textPos = {x:0,y:0};//newPoint_xy(rectPos, 0, -textHeight);
				
				var text = drawText(text, textPos, textHeight, draw)
				text.attr({cx: textPos.x, "font-size": textHeight, "text-anchor": "middle"})
	
				var bbox = text.getBBox();
				moove(text, newPoint_xy(basePoint, 0, 0));
				
				basePoint = newPoint_xy(basePoint, 0, -bbox.height);

				set.push(text);
			});

		}
		
		set.push(rect, obj);
		lists.push(set);
	}
	
	for (var i = 0; i < lists.length; i++) {
		var listBbox = lists[i].getBBox();
		moove(lists[i], listBasePoint);
		if (posOrient == 'hor') {
			listBasePoint = newPoint_xy(listBasePoint, listBbox.width + 100, 0)
		}
		if (listOrient == 'vert') {
			listBasePoint = newPoint_xy(listBasePoint, 0, listBbox.height + 100)				
		}
	}
	var listsBbox = lists.getBBox();

	//Выносим общие размеры листов, для удобства рассчета базовой точки для других функций
	par.width = listsBbox.width;
	par.height = listsBbox.height;
}

/**
	* Функция рисует выносной текст на основе параметров
	* @param {*} par Поля объекта:
	*- par.draw - paper Raphael'a - место в котором рисуем
	*- par.center - точка к которой относится текст
	*- par.text - Текст
	*- par.offset - (необязательный - по умолчанию 50) оффсет текста
	*- par.side - (необязательный - по умолчанию 'right') сторона 'left' или 'right'
	*- par.lineWidth - (необязательный по умолчанию 5) толщина линии
	*- par.textHeight - (необязательный по умолчанию 30) высота текста
 */
function drawDetailText(par){
	var dimScale = $("#svgDimScale").val();

	var side = par.side || 'right';
	var sideFactor = side == 'right' ? 1 : -1;
	var offset = par.offset || 50;
	var angle = side == 'right' ? Math.PI / 4 : Math.PI - Math.PI / 4;
	var lineWidth = par.lineWidth || 3;
	var set = par.draw.set();

	var textHeight = par.textHeight || 30;
	textHeight *= dimScale;
	
	var p2 = polar(par.center, angle, offset);
	var angledLine = drawLine(par.center, p2, par.draw).attr("stroke-width", lineWidth + 'px');
	set.push(angledLine);
	
	var textPos = newPoint_xy(p2, 0, lineWidth + textHeight / 2);
	var text = drawText(par.text, textPos, textHeight, par.draw).attr({ "font-size": textHeight });
	moove(text, newPoint_xy(textPos, (text.getBBox().width) * sideFactor, lineWidth + textHeight / 2))
	set.push(text);
	
	var textLength = text.getBBox().width + 40;
	var p3 = newPoint_xy(p2, textLength * sideFactor, 0);
	var textLine = drawLine(p2, p3, par.draw).attr("stroke-width", lineWidth + 'px');
	set.push(textLine);

	return set;
}
/**
 * Рисует дугу
 */
function arc(center, radius, startAngle, endAngle) {
	var angle = startAngle;
	coords = toCoords(center, radius, angle);
	path = "M " + coords[0] + " " + coords[1];
	while(angle<=endAngle) {
			coords = toCoords(center, radius, angle);
			path += " L " + coords[0] + " " + coords[1];
			angle += 1;
	}
	return path;
}
/**
 * считает координаты на основе радиуса и угла
 */
function toCoords(center, radius, angle) {
	var radians = (angle/180) * Math.PI;
	var x = center[0] + Math.cos(radians) * radius;
	var y = center[1] + Math.sin(radians) * radius;
	return [x, y];
}

/**
 * Функция отрисовывает угловой размер
 * @param {object} par 
 *- par.center - центр
 *- par.p1 - точка1
 *- par.p2 - точка2
 *- par.offset - оффсет установки размера
 *- debug - включить дебаг и подсветку осей
 *- lineWidth - опционально, ширина линии
 *- draw - paper raphael'a
 * 
 * угол считается между двумя точками(p1,p2)
 */

function drawAngleDim2(par){
	var draw = par.draw;
	var dimScale = $("#svgDimScale").val();
	if(par.dimScale) dimScale = par.dimScale;
	var offset = par.offset || 60;

	var textHeight = par.textHeight || 30; //высота текста
	textHeight *= dimScale;

	var dimSet = draw.set();

	var dAx = par.p1.x - par.center.x;
	var dAy = par.p1.y - par.center.y;
	var dBx = par.p2.x - par.center.x;
	var dBy = par.p2.y - par.center.y;
	var angle = Math.atan2(dAx * dBy - dAy * dBx, dAx * dBx + dAy * dBy);
	if(angle < 0) {angle = angle * -1;}
	var finalAngle = angle * (180 / Math.PI);

	var lineWidth = par.lineWidth || 1;

	var ang1 = calcAngleX1(par.center, par.p1);
	var p1 = polar(par.center, ang1, offset);
	
	var middle = midpoint(par.p1, par.p2);
	var ang = calcAngleX1(par.center, middle);
	middle = polar(par.center, ang, offset * 1.1);

	var ang2 = calcAngleX1(par.center, par.p2);
	var p2 = polar(par.center, ang2, offset);


	var arc = draw.path(['M', p1.x, p1.y * -1, 'Q', middle.x, middle.y * -1, p2.x, p2.y * -1])
	.attr({
			fill: "none",
			stroke: "#000",
			"stroke-width": lineWidth,
	});
	dimSet.push(arc);

	var str = (finalAngle).toFixed(1) + '°';
	

	var textPos = {x: middle.x, y: middle.y};
	var text = drawText(str, textPos, textHeight, par.draw);
	text.attr({cx: textPos.x, "font-size": textHeight});
	dimSet.push(text);

	if (par.drawLines) {
		var lineP1 = polar(par.center, ang1, offset + 15);
		var lineP2 = polar(par.center, ang2, offset + 15);

		var line1 = drawLine(par.center, lineP1, draw);
		dimSet.push(line1);
		var line2 = drawLine(par.center, lineP2, draw);
		dimSet.push(line2);
	}
	
	
	if (par.dimLines) {

		var line1 = drawLine(par.center, p1, draw);
	
		var line2 = drawLine(par.center, newPoint_xy(p2, 10, 0), draw); //подогнано для модуля геометрии
		
		if (par.debug) {
			var line3 = drawLine(par.center, middle, draw).attr({
				stroke: "green",
			});
		}

		dimSet.push(line1);
		dimSet.push(line2);
		dimSet.push(line3);
	}
	return dimSet;
}

/**
 * Поворачивает сет сохраняя позиции объектов относительно друг друга
 * @param {object} set Сет raphael'a
 * @param {object} angle Угол поворота
 */
function rotateSet2(set, angle){
	var l_coord = set.getBBox().x,
	r_coord = set.getBBox().x2,
	t_coord = set.getBBox().y,
	b_coord = set.getBBox().y2;

	var cx = (l_coord + r_coord)/2,
	cy = (t_coord + b_coord)/2;

	set.rotate(angle,cx,cy);
}


function midpoint(a, b) {
	return {x: Math.floor((a.x + b.x) / 2), y: Math.floor((a.y + b.y) / 2)};
}

/** функция зеркалит объект относительно оси 
*/
function mirrow(obj, axis){
	if(axis == "x") obj.transform("s1,-1");
	if(axis == "y") obj.transform("s-1,1");
}

/*
	Создает кривую для отсутствия зенковки
*/
function createNoZenkCurve(curve){
	var center = {x: curve.aX, y: curve.aY};
	var lineLength = 25;
	var l1P1 = polar(center, Math.PI / 4, lineLength); //line1Point1
	var l1P2 = polar(center, Math.PI / 4, -lineLength); //line1Point2
	
	var l2P1 = polar(center, Math.PI - Math.PI / 4, lineLength); //line2Point1
	var l2P2 = polar(center, Math.PI - Math.PI / 4, -lineLength); //line2Point2
	
	var line1 = new THREE.LineCurve(l2P1, l2P2);
	var line2 = new THREE.LineCurve(l1P1, l1P2);
	
	return [line1, line2]
}

/*
	Создает кривую для зенковки сзади
*/
function createBackZenkCurve(curve){
	var backZenk = new THREE.EllipseCurve().copy(curve);
	backZenk.xRadius = 20;
	backZenk.yRadius = 20;
	return backZenk;
}

/** функция отрисовывает на холсте draw линии на основе shape
*/

function makeSvgFromShape(shape, draw, isRotate){	
	var curveArr = [];
	var curvesArr = shape.curves.concat();

	if (isRotate) {
		var y = curvesArr[0].v1.y;
		curvesArr[2].v2.y = y;
		curvesArr[3].v1.y = y;
	}

	if (shape.holes.length == 0) {
		// '40' вызывает ошибки построения, пока убрал. Вероятно это вызовет проблему там, для чего костыль, появление костыля - ревизия 162
		var pt1 = newPoint_xy(shape.curves[1].v1, 0, 0);//40);
		var pt2 = newPoint_xy(shape.curves[1].v2, 0, 0);//40);

		var line = new THREE.LineCurve(pt1, pt2);
		//curvesArr.push(line);
	}

	//добавлем отверстия

	$.each(shape.holes, function(){
		if (this.drawing) {
			if (this.drawing.zenk == 'no') {
				var noZenkCurves = createNoZenkCurve(this.curves[0]);
				curvesArr.push(...noZenkCurves);
			}
			if (this.drawing.zenk == 'back') {
				var backCurves = createBackZenkCurve(this.curves[0]);
				curvesArr.push(backCurves);
			}
		}
		curvesArr.push(...this.curves);
	});

	$.each(curvesArr, function(){
		
		if(this.type == "EllipseCurve"){
			var center = {
				x: this.aX,
				y: this.aY,
			}
			var rad = this.xRadius;
			var angStart = this.aStartAngle;
			var angEnd = this.aEndAngle;
			if(this.aClockwise){
				angEnd = this.aStartAngle;
				angStart = this.aEndAngle;
			}
			var startPoint = polar(center, angStart, rad);
			var endPoint = polar(center, angEnd, rad);
			var midPoint = polar(center, 0, -rad);
			
			//неполная дуга
			var isCircle = true;
			if(Math.abs(startPoint.x - endPoint.x) > 0.000001) isCircle = false;
			if(Math.abs(startPoint.y - endPoint.y) > 0.000001) isCircle = false;
			
			if(!isCircle){			
				curveArr.push(
					['M', startPoint.x, -startPoint.y],
					['A', rad, rad, 0, 0, 0, endPoint.x, -endPoint.y],		
				);
			}
			//полная дуга - рисуем из двух половинок
			if(isCircle){
				curveArr.push(
					['M', startPoint.x, -startPoint.y],
					['A', rad, rad, 0, 0, 0, midPoint.x, -midPoint.y],
					['M', midPoint.x, -midPoint.y],
					['A', rad, rad, 0, 0, 0, endPoint.x, -endPoint.y],
				);			
			}
		}
		if(this.type == "LineCurve"){
			curveArr.push(
				['M', this.v1.x, -this.v1.y],
				['L', this.v2.x, -this.v2.y],
			);
		}
	})
	
	var pathString = getPathString(curveArr)
	
	var path = draw.path(pathString)
	path.attr({
		fill: "none",
		stroke: "#000",
		"stroke-width": 3,
	})
	
	return path;
}

function drawAxisHelper(len, draw){
	var lineX = drawLine({x: -len/2, y:0}, {x: len/2, y:0}, draw).attr({
		stroke: "green",
	})
	var lineY = drawLine({x: 0, y:-len/2}, {x: 0, y:len/2}, draw).attr({
		stroke: "red",
	})
}


/** функция поворачивает объект таким образом, чтобы его максимальный размер был горизонтален
*/

function rotateHor(obj){
	//первый проход с увеличенным шагом по часовой стрелке
	var step = 1;
	var width0 = obj.getBBox().width;

	rotate(obj, step)
	var width1 = obj.getBBox().width;
	
	var ang = step;
	while(width1 > width0){		
		ang += step;
		rotate(obj, ang);
		width0 = width1;
		width1 = obj.getBBox().width;
	}
	var maxLen1 = width0;
	var ang1 = ang;
	var step1 = step;
	
	//первый проход с увеличенным шагом против часовой стрелки
	var step = -1;
	var width0 = obj.getBBox().width;

	rotate(obj, step)
	var width1 = obj.getBBox().width;
	
	var ang = step;
	while(width1 > width0){		
		ang += step;
		rotate(obj, ang);
		width0 = width1;
		width1 = obj.getBBox().width;
	}
	var maxLen2 = width0;
	
	if(maxLen1 > maxLen2){
		ang = ang1;
		step = step1;
	}
	
	//второй проход в противоположную сторону с уменьшенным шагом
	step = -step * 0.1;
	ang += step;
	width0 = width1;
	rotate(obj, ang)
	width1 = obj.getBBox().width;
	
	while(width1 > width0){		
		ang += step;
		rotate(obj, ang);
		width0 = width1;
		width1 = obj.getBBox().width;
	}

}//end of rotateHor

/** функция конвертирует svg изображение в dxf
*/
function svgToDxf(svg){
	var dxfArr = [];
	var trashShape = new THREE.Shape();
	var dxfBasePoint = {x: 0, y: 0,}
	
	$(svg).find("g").children().each(function(){
		
		var layer = 0;
		if($(this).attr('class')) layer = $(this).attr('class');
		
		if(this.nodeName == "path"){
			var d = $(this).attr("d");			
			var parts = Raphael.parsePathString(d)			
			var curPoint = {x: 0, y: 0,}
			for(var i = 0; i < parts.length; i++){
				var command = parts[i];

				//перемещение
				if(command[0] == "M"){
					curPoint.x = command[1];
					curPoint.y = command[2] * (-1);
				}
				//линия
				if(command[0] == "L"){
					addLine(trashShape, dxfArr, curPoint, {x: command[1], y: command[2] * (-1)}, dxfBasePoint, layer) //функция в файле drawPrimitives
					curPoint.x = command[1];
					curPoint.y = command[2] * (-1);
				}
				//дуга
				if(command[0] == "A"){
					var endPoint = {x: command[6], y: -command[7]};
					//if(endPoint.x != curPoint.x || curPoint.y != curPoint.y){
					var rad = command[1];
					var fS = 1;
					if(this.classList.contains("is_mirrored")) fS = 0;
					var arcPar = svgArcToCenterParam(curPoint.x, curPoint.y, command[1], command[2], 0, 0, fS, command[6], -command[7]); // 0,0,1 - подогнано
					if(this.classList.contains("is_mirrored")) {
						var endAngle = arcPar.endAngle;
						arcPar.endAngle = arcPar.startAngle;
						arcPar.startAngle = endAngle;
					}
					
					addArc2(trashShape, dxfArr, {x: arcPar.cx, y: arcPar.cy}, rad, arcPar.endAngle, arcPar.startAngle,  !arcPar.clockwise, dxfBasePoint, layer) //функция в файле drawPrimitives
					curPoint = copyPoint(endPoint);
				}
				//сплайн - пока заменяется прямой линией
				if(command[0] == "C"){
					addLine(trashShape, dxfArr, curPoint, {x: command[5], y: command[6] * (-1)}, dxfBasePoint, layer) //функция в файле drawPrimitives
					curPoint.x = command[5];
					curPoint.y = command[6] * (-1);
				}
				
			}	
			
		}
		
		if(this.nodeName == "rect"){
		
		}
		if(this.nodeName == "text"){
			var text = $(this).find("tspan").text();
			var height = $(this).attr("font-size").replace("px", "") * 0.7;
			var basePoint = {
				x: $(this).attr("x") * 1,
				y: -$(this).attr("y") * 1,
			}
			var cons = this.transform.baseVal.consolidate();
			if (cons) {
				var matrix = cons.matrix;
				if (matrix) {
					var raphMatrix = Raphael.matrix(matrix.a,matrix.b,matrix.c,matrix.d,matrix.e,matrix.f);
					var transformString = raphMatrix.toTransformString();
					var transformations = Raphael.parseTransformString(transformString);
					var translation = {x: 0, y: 0}
					var rot = 0;
					if(transformations){
						$.each(transformations, function(){
							if(this[0] == "t"){
								translation.x = this[1];
								translation.y = this[2];
							}
							if(this[0] == "r"){
								rot = -this[1] / 180 * Math.PI; //знак минус т.к. в svg все наоборот
							}
						})
					}

					if(translation.x || translation.y){
						var pos = {
							x: $(this).attr("x") * 1,
							y: -$(this).attr("y") * 1, //знак минус т.к. в svg все наоборот
						}
				
						basePoint = {
							x: translation.x + (basePoint.x * Math.cos(rot) - basePoint.y * Math.sin(rot)),
							y: -(translation.y  - basePoint.x * Math.sin(rot) - basePoint.y * Math.cos(rot)),
						}
					}
				}
			}
			
			//поворот текста
			var rot = 0;
			if($(this).attr('data-rot')){
				rot = $(this).attr('data-rot') * 1.0
			}
			addText2(text, height, dxfArr, basePoint, layer, rot)
		}
		
	})
	
	exportToDxf(dxfArr) //функция в файле dxfFileMaker.js
}

// svg : [A | a] (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+

function  radian( ux, uy, vx, vy ) {
    var  dot = ux * vx + uy * vy;
    var  mod = Math.sqrt( ( ux * ux + uy * uy ) * ( vx * vx + vy * vy ) );
    var  rad = Math.acos( dot / mod );
    if( ux * vy - uy * vx < 0.0 ) {
        rad = -rad;
    }
    return rad;
}

//conversion_from_endpoint_to_center_parameterization
//sample :  svgArcToCenterParam(200,200,50,50,0,1,1,300,200)
// x1 y1 rx ry φ fA fS x2 y2
function svgArcToCenterParam(x1, y1, rx, ry, phi, fA, fS, x2, y2) {
    var cx, cy, startAngle, deltaAngle, endAngle;
    var PIx2 = Math.PI * 2.0;

    if (rx < 0) {
        rx = -rx;
    }
    if (ry < 0) {
        ry = -ry;
    }
    if (rx == 0.0 || ry == 0.0) { // invalid arguments
        throw Error('rx and ry can not be 0');
    }

    var s_phi = Math.sin(phi);
    var c_phi = Math.cos(phi);
    var hd_x = (x1 - x2) / 2.0; // half diff of x
    var hd_y = (y1 - y2) / 2.0; // half diff of y
    var hs_x = (x1 + x2) / 2.0; // half sum of x
    var hs_y = (y1 + y2) / 2.0; // half sum of y

    // F6.5.1
    var x1_ = c_phi * hd_x + s_phi * hd_y;
    var y1_ = c_phi * hd_y - s_phi * hd_x;

    // F.6.6 Correction of out-of-range radii
    //   Step 3: Ensure radii are large enough
    var lambda = (x1_ * x1_) / (rx * rx) + (y1_ * y1_) / (ry * ry);
    if (lambda > 1) {
        rx = rx * Math.sqrt(lambda);
        ry = ry * Math.sqrt(lambda);
    }

    var rxry = rx * ry;
    var rxy1_ = rx * y1_;
    var ryx1_ = ry * x1_;
    var sum_of_sq = rxy1_ * rxy1_ + ryx1_ * ryx1_; // sum of square
    if (!sum_of_sq) {
        throw Error('start point can not be same as end point');
    }
    var coe = Math.sqrt(Math.abs((rxry * rxry - sum_of_sq) / sum_of_sq));
    if (fA == fS) { coe = -coe; }

    // F6.5.2
    var cx_ = coe * rxy1_ / ry;
    var cy_ = -coe * ryx1_ / rx;

    // F6.5.3
    cx = c_phi * cx_ - s_phi * cy_ + hs_x;
    cy = s_phi * cx_ + c_phi * cy_ + hs_y;

    var xcr1 = (x1_ - cx_) / rx;
    var xcr2 = (x1_ + cx_) / rx;
    var ycr1 = (y1_ - cy_) / ry;
    var ycr2 = (y1_ + cy_) / ry;

    // F6.5.5
    startAngle = radian(1.0, 0.0, xcr1, ycr1);

    // F6.5.6
    deltaAngle = radian(xcr1, ycr1, -xcr2, -ycr2);
    while (deltaAngle > PIx2) { deltaAngle -= PIx2; }
    while (deltaAngle < 0.0) { deltaAngle += PIx2; }
    if (fS == false || fS == 0) { deltaAngle -= PIx2; }
    endAngle = startAngle + deltaAngle;
    while (endAngle > PIx2) { endAngle -= PIx2; }
    while (endAngle < 0.0) { endAngle += PIx2; }

    var outputObj = { /* cx, cy, startAngle, deltaAngle */
        cx: cx,
        cy: cy,
        startAngle: startAngle,
        deltaAngle: deltaAngle,
        endAngle: endAngle,
        clockwise: (fS == true || fS == 1)
    }

    return outputObj;
}

/** функция проверяет эквивалентность шейпов
*/

function isShapesEqual(shape1, shape2){
	if(typeof shape1.drawing != typeof shape2.drawing) return false;
	if(typeof shape1.drawing != "undefined"){
		if(shape1.drawing.mirrow != shape2.drawing.mirrow) return false;
	}
	
	if(shape1.curves.length != shape2.curves.length) return false;
	for(var i=0; i<shape1.curves.length; i++){
		if(shape1.curves[i].type != shape2.curves[i].type) return false;
		if(!isEq(shape1.curves[i], shape2.curves[i])) return false;
	}
	return true;
}

/** функция проверки простых полей объектами
*/
function isEq(a, b){
	
	if(a == b) return true;

	for(var i in a){
		//if(typeof a[i] == "Object" && (a[i].x && a[i].y) && (a[i].x != b[i].x || a[i].y != b[i].y)) return false;
		if(typeof(a[i]) != "function" && !isEq(a[i], b[i])) return false;		
	}
	for(var i in b){
		//if(typeof b[i] == "Object" && (a[i].x && a[i].y) && (a[i].x != b[i].x || a[i].y != b[i].y)) return false;
		if(typeof(a[i]) != "function" && !isEq(a[i], b[i])) return false;		
	}

	if (!isNaN(parseFloat(a)) && isFinite(a)) {
		if (a.toFixed(3) !== b.toFixed(3)) return false;
	}

	return true;
}

/** расширение библиотеки
*/

Raphael.el.setClass = function (className) {
		this.node.setAttribute("class", className);
	};

Raphael.st.setClass = function (className) {
	for(var i=0; i<this.items.length; i++){
		this.items[i].setClass(className);
	}
};

/** функция выводит на страницу чекбоксы слоев и вешает обработчики на них
*/
function printLayersControls(layers){
	var checkBoxes = ""
	$.each(layers, function(key, val){
		var id = "svgLayer_" + key;
		checkBoxes += "<input type='checkBox' id='" + id + "' checked><label for='" + id + "'>" + val + "</label> ";
	})
	$("#svgLayers").html(checkBoxes);
	$("#svgLayers input[type=checkBox]").change(function(){
		var layerName = $(this).attr("id").replace("svgLayer_", "");
		$("#svgOutputDiv").find("." + layerName).toggle();
	})
} //end of printLayersControls
