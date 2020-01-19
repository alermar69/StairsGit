// 
// 
// 
// 
// function newPoint_xy(basePoint, deltaX, deltaY){
// /*функция выдает массив координат точки, удаленной от базовой на заданное расстояние по
// оси х и у*/
// var newPoint=[];
// newPoint[0] = basePoint[0] + deltaX;
// newPoint[1] = basePoint[1] - deltaY;
// return newPoint;
// }
// 
// function newPoint_x(basePoint, deltaX, angle){
// /*функция выдает массив координат точки, удаленной от базовой при заданном расстоянии и угле смещения
// относительно оси x*/
// var newPoint=[];
// newPoint[0] = basePoint[0] + deltaX;
// newPoint[1] = basePoint[1] - deltaX * Math.tan(angle);
// return newPoint;
// }
// 
// function newPoint_y(basePoint, deltaY, angle){
// /*функция выдает массив координат точки, удаленной от базовой при заданном расстоянии и угле смещения
// относительно оси y*/
// var newPoint=[];
// newPoint[0] = basePoint[0] + deltaY / Math.tan(angle);
// newPoint[1] = basePoint[1] + deltaY;
// return newPoint;
// }
// 
// 
// 
// function distance(point_1, point_2){
// /*рассчитывается расстояние между двумя точками*/
// var dist=0;
// dist = (point_1[0] - point_2[0])*(point_1[0] - point_2[0]) + (point_1[1] - point_2[1])*(point_1[1] - point_2[1]);
// dist = Math.sqrt(dist);
// return dist;
// }


/*Функция построения горизонтального размера масштаб 1:10*/
function dem_hor(x1,y1,x2,y2, distance, img){
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
function dem_hor_1(x1,y1,x2,y2, distance, scale, img){
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
var y_text = lineY - 20*scale;
var size = Math.round((x2 - x1 - 0.01)/scale);
img.fillText(size, x_text, y_text);

return size;
}

/*Функция построения вертикального размера в произвольном масштабе*/
function  dem_vert_1(x1,y1,x2,y2, distance, scale, img){
img.fillStyle = 'black'; // –вет текста размеров
img.strokeStyle = "grey"; // –вет размерных линий

//размерные линии
img.beginPath();
img.moveTo(x1, y1);
img.lineTo(x1-distance, y1);
img.lineTo(x1-distance, (y1 + y2)/2 + 30*scale);
img.moveTo(x1-distance, (y1 + y2)/2 - 100*scale);
img.lineTo(x1-distance, y2);
img.lineTo(x2-distance, y2);
img.lineTo(x2, y2);
img.stroke();
//стрелки
var arrowLength = 90*scale;//длина стрелки
var arrowHeight = 30*scale;//половини высоты стрелки
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
var x_text = x1 - distance - 120*scale;
var y_text = (y1 + y2) / 2;
img.fillText(Math.round((y1-y2)/scale), x_text, y_text);
}

function ChangeImgSize() {
imageSize = document.getElementById("imageSize").value;
imageSize = imageSize + "px";

document.getElementById('mainView').style.height = imageSize;
document.getElementById('leftView').style.height = imageSize;
}