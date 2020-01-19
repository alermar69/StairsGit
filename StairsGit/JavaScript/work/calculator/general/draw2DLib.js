/*Функция построения горизонтального размера масштаб 1:10*/
function dem_hor(x1,y1,x2,y2, distance, img, scale){
img.fillStyle = 'black'; // –вет текста размеров
img.strokeStyle = "grey"; // –вет размерных линий



var x0 = x1;
var y0 = y1;
if(x1 > x2) {
	x1 = x2;
	x2 = x0;
	y1 = y2;
	y2 = y0;	
}
var lineY = y1 - distance;//координата y размерной линии
if(y2 < y1) lineY = y2 - distance;

//вынос размерного числа вправо при маленьком размере
var textOffsetRight = 0;
if (x2 - x1 < 40) textOffsetRight = 20;

//размерные линии
img.beginPath();
img.moveTo(x1, y1);
img.lineTo(x1, lineY);
img.lineTo(x2 + textOffsetRight,lineY);
img.moveTo(x2, lineY);
img.lineTo(x2, y2);
img.stroke();
//стрелки
var arrowLength = 9;//длина стрелки
var arrowHeight = 3;//половина высоты стрелки
//слева
img.beginPath();
img.moveTo(x1, lineY);
img.lineTo(x1+arrowLength, lineY-arrowHeight);
img.moveTo(x1+arrowLength, lineY+arrowHeight);
img.lineTo(x1, lineY);
img.stroke();
//справа
img.beginPath();
img.moveTo(x2, lineY);
img.lineTo(x2-arrowLength, lineY-arrowHeight);
img.moveTo(x2-arrowLength, lineY+arrowHeight);
img.lineTo(x2, lineY);
img.stroke();

//размерный текст
var x_text = (x2 + x1)/2-5 + textOffsetRight;
var y_text = lineY - 2;
img.fillText(Math.round((x2-x1)*10), x_text, y_text);
}

/*Функция построения вертикального размера масштаб 1:10*/
function  dem_vert(x1,y1,x2,y2, distance, img){
img.fillStyle = 'black'; // –вет текста размеров
img.strokeStyle = "grey"; // –вет размерных линий

//размерные линии
img.beginPath();
img.moveTo(x1, y1);
img.lineTo(x1-distance, y1);
img.lineTo(x1-distance, (y1 + y2)/2 + 3);
img.moveTo(x1-distance, (y1 + y2)/2 - 10);
img.lineTo(x1-distance, y2);
img.lineTo(x2-distance, y2);
img.lineTo(x2, y2);
img.stroke();
//стрелки
var arrowLength = 9;//длина стрелки
var arrowHeight = 3;//половини высоты стрелки
//снизу
img.beginPath();
img.moveTo(x1-distance, y1);
img.lineTo(x1-distance-arrowHeight, y1-arrowLength);
img.moveTo(x1-distance+arrowHeight, y1-arrowLength);
img.lineTo(x1-distance, y1);
img.stroke();
//сверху
img.beginPath();
img.moveTo(x1-distance, y2);
img.lineTo(x1-distance-arrowHeight, y2+arrowLength);
img.moveTo(x1-distance+arrowHeight, y2+arrowLength);
img.lineTo(x1-distance, y2);
img.stroke();
//размерный текст
var x_text = x1 - distance - 12;
var y_text = (y1 + y2) / 2;
img.fillText(Math.round((y1-y2)*10), x_text, y_text);
} 


/*Функция построения горизонтального размера в произвольном масштабе*/
function dem_hor_1(x1,y1,x2,y2, distance, par){
var img = par.view;
var scale = par.scale;
img.fillStyle = 'black'; // –вет текста размеров
img.strokeStyle = "grey"; // –вет размерных линий

var x0 = x1;
var y0 = y1;
if(x1 > x2) {
	x1 = x2;
	x2 = x0;
	y1 = par.imgHeight - y2;
	y2 = par.imgHeight - y0;	
}
var lineY = y1 - distance;//координата y размерной линии
if(y2 < y1) lineY = y2 - distance;

//вынос размерного числа вправо при маленьком размере
var textOffsetRight = 0;
if (x2 - x1 < 400*scale) textOffsetRight = 200*scale;

//размерные линии
img.beginPath();
img.moveTo(x1, y1);
img.lineTo(x1, lineY);
img.lineTo(x2 + textOffsetRight,lineY);
img.moveTo(x2, lineY);
img.lineTo(x2, y2);
img.stroke();
//стрелки
var arrowLength = 90*scale;//длина стрелки
var arrowHeight = 30*scale;//половина высоты стрелки
//слева
img.beginPath();
img.moveTo(x1, lineY);
img.lineTo(x1+arrowLength, lineY-arrowHeight);
img.moveTo(x1+arrowLength, lineY+arrowHeight);
img.lineTo(x1, lineY);
img.stroke();
//справа
img.beginPath();
img.moveTo(x2, lineY);
img.lineTo(x2-arrowLength, lineY-arrowHeight);
img.moveTo(x2-arrowLength, lineY+arrowHeight);
img.lineTo(x2, lineY);
img.stroke();

//размерный текст
var x_text = (x2 + x1)/2-50*scale + textOffsetRight;
var y_text = lineY - 20 * scale;
img.fillText(Math.round((x2-x1 + 0.01)/scale), x_text, y_text);

}

/*Функция построения вертикального размера в произвольном масштабе*/

function  dem_vert_1(p1, p2, distance, par){
var img = par.view;
var scale = par.scale;
var dimScale = par.dimScale;

img.fillStyle = 'black'; // –вет текста размеров
img.strokeStyle = "grey"; // –вет размерных линий

x1 = p1.x * scale + par.zeroPoint.x * par.scale;
x2 = p2.x * scale + par.zeroPoint.x * par.scale;
y1 = par.imgHeight - p1.y * scale - par.zeroPoint.y * par.scale;
y2 = par.imgHeight - p2.y * scale - par.zeroPoint.y * par.scale;
distance = distance * scale;
dimScale = dimScale * 0.8;

x0 = x1 - distance;
/*
if(distance > 0){
	x0 = x1 - distance;
	if(x1 > x2) x0 = x2 - distance;	
	}
if(distance < 0){
	x0 = x1 - distance;
	if(x1 < x2) x0 = x2 - distance;
	}
*/
if(y1 < y2){
	var y_t = y2;
	y2 = y1;
	y1 = y_t;
	}

var dimSize = 20 * dimScale;
var dimFont = "normal " + dimSize + "px arial";
img.font = dimFont;

//размерные линии
img.beginPath();
img.moveTo(x1, y1);
img.lineTo(x0, y1);
img.lineTo(x0, (y1 + y2)/2 + 30*scale*dimScale);
img.moveTo(x0, (y1 + y2)/2 - 100*scale*dimScale);
img.lineTo(x0, y2);
img.lineTo(x0, y2);
img.lineTo(x2, y2);
img.stroke();
//стрелки
var arrowLength = 90*scale*dimScale;//длина стрелки
var arrowHeight = 20*scale*dimScale;//половини высоты стрелки
//снизу
img.beginPath();
img.moveTo(x0, y1);
img.lineTo(x0-arrowHeight, y1-arrowLength);
img.moveTo(x0+arrowHeight, y1-arrowLength);
img.lineTo(x0, y1);
img.stroke();
//сверху
img.beginPath();
img.moveTo(x0, y2);
img.lineTo(x0-arrowHeight, y2+arrowLength);
img.moveTo(x0+arrowHeight, y2+arrowLength);
img.lineTo(x0, y2);
img.stroke();
//размерный текст
var x_text = x0 - 120*scale*dimScale;
var y_text = (y1 + y2) / 2;
img.fillText(Math.round((y1-y2)/scale), x_text, y_text);
}



function drawRect(basePoint, width, height, color, par, rot){
	if(!rot) rot = 0;
	

	var p1={
		x: basePoint.x * par.scale + par.zeroPoint.x * par.scale,
		y: par.imgHeight - basePoint.y * par.scale - height * par.scale - par.zeroPoint.y * par.scale,
		}
	/*
	par.view.fillStyle = color; // Цвет заливки прямоугольника
	par.view.fillRect(p1.x, p1.y, width * par.scale, height * par.scale);
*/
	//построение в dxf
	/*
	var p1 = copyPoint(basePoint);
	var p2 = newPoint_xy(p1, 0, height);
	var p3 = newPoint_xy(p1, width, height);
	var p4 = newPoint_xy(p1, width, 0);
*/

	var p1 = copyPoint(basePoint);
	var p2 = polar(p1, rot + Math.PI / 2, height);
	var p3 = polar(p2, rot, width);
	var p4 = polar(p1, rot, width);
	
	
	var shape = new THREE.Shape();
	var dxfBasePoint = par.dxfBasePoint;
	addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);
	addLine(shape, dxfPrimitivesArr, p2, p3, dxfBasePoint);
	addLine(shape, dxfPrimitivesArr, p3, p4, dxfBasePoint);
	addLine(shape, dxfPrimitivesArr, p4, p1, dxfBasePoint);
	
	draw4Angle(p1, p2, p3, p4, color, par);
}

function drawTriangle(p1, p2, p3, color, par){
var canvas_p1={
	x: p1.x * par.scale + par.zeroPoint.x * par.scale,
	y: par.imgHeight - p1.y * par.scale - par.zeroPoint.y * par.scale,
	}
	
var canvas_p2={
	x: p2.x * par.scale + par.zeroPoint.x * par.scale,
	y: par.imgHeight - p2.y * par.scale - par.zeroPoint.y * par.scale,
	}
	
var canvas_p3={
	x: p3.x * par.scale + par.zeroPoint.x * par.scale,
	y: par.imgHeight - p3.y * par.scale - par.zeroPoint.y * par.scale,
	}

par.view.moveTo(canvas_p1.x, canvas_p1.y);
par.view.lineTo(canvas_p2.x, canvas_p2.y);
par.view.lineTo(canvas_p3.x, canvas_p3.y);
par.view.closePath();

// Заливка
par.view.fillStyle = color;
par.view.fill();

//построение в dxf
var shape = new THREE.Shape();
var dxfBasePoint = par.dxfBasePoint;
addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);
addLine(shape, dxfPrimitivesArr, p2, p3, dxfBasePoint);
addLine(shape, dxfPrimitivesArr, p3, p1, dxfBasePoint);
}

function draw4Angle(p1, p2, p3, p4, color, par){
var canvas_p1={
	x: p1.x * par.scale + par.zeroPoint.x * par.scale,
	y: par.imgHeight - p1.y * par.scale - par.zeroPoint.y * par.scale,
	}
	
var canvas_p2={
	x: p2.x * par.scale + par.zeroPoint.x * par.scale,
	y: par.imgHeight - p2.y * par.scale - par.zeroPoint.y * par.scale,
	}
	
var canvas_p3={
	x: p3.x * par.scale + par.zeroPoint.x * par.scale,
	y: par.imgHeight - p3.y * par.scale - par.zeroPoint.y * par.scale,
	}
	
var canvas_p4={
	x: p4.x * par.scale + par.zeroPoint.x * par.scale,
	y: par.imgHeight - p4.y * par.scale - par.zeroPoint.y * par.scale,
	}

par.view.moveTo(canvas_p1.x, canvas_p1.y);
par.view.lineTo(canvas_p2.x, canvas_p2.y);
par.view.lineTo(canvas_p3.x, canvas_p3.y);
par.view.lineTo(canvas_p4.x, canvas_p4.y);
par.view.closePath();

// Заливка
par.view.fillStyle = color;
par.view.fill();

//построение в dxf
var shape = new THREE.Shape();
var dxfBasePoint = par.dxfBasePoint;
addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);
addLine(shape, dxfPrimitivesArr, p2, p3, dxfBasePoint);
addLine(shape, dxfPrimitivesArr, p3, p4, dxfBasePoint);
addLine(shape, dxfPrimitivesArr, p4, p1, dxfBasePoint);

}