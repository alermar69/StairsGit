/*версиЯ библиотеки 2.0*/

/*операции с точками*/

function newPointP_xy(points, pt, deltaX, deltaY) {
/*„обавлЯет в массив точку, удаленную от заданной на заданное расстоЯние по оси х и у*/
  points.push({ "x": pt.x * 1.0 + deltaX, "y": pt.y * 1.0 + deltaY });
}

function newPointP_xy_last(points, deltaX, deltaY) {
/*„обавлЯет в массив точку, удаленную от последней на заданное расстоЯние по оси х и у*/
  points.push({ "x": points[points.length - 1].x + deltaX, "y": points[points.length - 1].y + deltaY });
}


function angle(point1, point2) {
/*возвращает угол между осью x и отрезком, соединяющим точки*/
	var angle;
	
	if ((point2.x == point1.x) && (point2.y > point1.y)) angle = Math.PI/2;
	if ((point2.x == point1.x) && (point2.y < point1.y)) angle = Math.PI/2;
	if (point2.x != point1.x) angle = Math.atan((point2.y - point1.y)/(point2.x - point1.x))
	
	return angle;
}


function polar(basePoint, angle, distance){
/*возвращает координаты точки, удаленной от базовой на расстоянии distance под углом angle*/
	var newPoint={};
	newPoint.x = basePoint.x + distance * Math.cos(angle);
	newPoint.y = basePoint.y + distance * Math.sin(angle);
	newPoint.z = basePoint.z;
	return  newPoint;
}

/*функция возвращает координаты концов отрезка, параллельного отрезку, 
соединяющему точку p1 и p2*/

function parallel(basePoint1, basePoint2, dist){

	var ang = angle(basePoint1, basePoint2)
	var newPoint1 = polar(basePoint1, (ang + Math.PI/2), dist);
	var newPoint2 = polar(basePoint2, (ang + Math.PI/2), dist);
	
	var line = {};
	line.p1 = newPoint1;
	line.p2 = newPoint2;
	return line;
}

function subtract(AVec1, AVec2){
/*функция вычитает один вектор из другого*/
	var result = {};
	result.x = AVec1.x - AVec2.x;
	result.y = AVec1.y - AVec2.y;
	return result;
	}

function itercection(LineAP1, LineAP2, LineBP1, LineBP2){
/*функция возвращает координаты точки пересечения лучей, проходящих через заданные точки*/

	var LDetLineA = LineAP1.x * LineAP2.y - LineAP1.y * LineAP2.x;
	var LDetLineB = LineBP1.x * LineBP2.y - LineBP1.y * LineBP2.x;

	var LDiffLA = subtract(LineAP1, LineAP2);
	var LDiffLB = subtract(LineBP1, LineBP2);

	LDetDivInv = 1 / ((LDiffLA.x * LDiffLB.y) - (LDiffLA.y * LDiffLB.x));
	var result = {};
	result.x = ((LDetLineA * LDiffLB.x) - (LDiffLA.x * LDetLineB)) * LDetDivInv;
	result.y = ((LDetLineA * LDiffLB.y) - (LDiffLA.y * LDetLineB)) * LDetDivInv;
	
	//исправляем ошибку округления
	if(LineAP1.x == LineAP2.x) result.x = LineAP1.x;
	if(LineBP1.x == LineBP2.x) result.x = LineBP1.x;
	if(LineAP1.y == LineAP2.y) result.y = LineAP1.y;
	if(LineBP1.y == LineBP2.y) result.y = LineBP1.y;
	
	return result;
}


function newPoint_xy(basePoint, deltaX, deltaY){
/*функция выдает массив координат точки, удаленной от базовой на заданное расстояние по
оси х и у*/
	if (basePoint instanceof Array) {	
		var newPoint=[];
		newPoint[0] = basePoint[0] + deltaX;
		newPoint[1] = basePoint[1] - deltaY;
		if(basePoint[2] != "undefined") newPoint[2] = basePoint[2];
		return newPoint;
		}
	if (basePoint instanceof Object) {	
		var newPoint = {};
		newPoint.x = basePoint.x * 1.0 + deltaX * 1.0;
		newPoint.y = basePoint.y * 1.0 + deltaY * 1.0;
		if(basePoint.z != "undefined") newPoint.z = basePoint.z * 1.0;
		
		return newPoint;	
		}
}

/**функция выдает массив координат точки, удаленной от базовой на заданное расстояние по
оси х и у*/

function newPoint_xyz(basePoint, deltaX, deltaY, deltaZ){

	var newPoint = {};
	newPoint.x = basePoint.x * 1.0 + deltaX * 1.0;
	newPoint.y = basePoint.y * 1.0 + deltaY * 1.0;
	newPoint.z = basePoint.z * 1.0 + deltaZ * 1.0;
	
	return newPoint;	
	
}


function newPoint_x(basePoint, deltaX, angle){
/*функция выдает массив координат точки, удаленной от базовой при заданном расстоянии и угле смещения
относительно оси x*/
	if (basePoint instanceof Array) {
		var newPoint=[];
		newPoint[0] = basePoint[0] + deltaX;
		newPoint[1] = basePoint[1] - deltaX * Math.tan(angle);
		if(basePoint[2] != "undefined") newPoint[2] = basePoint[2];
		return newPoint;
		}
	if (basePoint instanceof Object) {
		var newPoint = {};
		newPoint.x = basePoint.x + deltaX;
		newPoint.y = basePoint.y - deltaX * Math.tan(angle);
		if(basePoint.z != "undefined") newPoint.z = basePoint.z;
		return newPoint;	
		}
	
}

function newPoint_x1(basePoint, deltaX, angle){
/*функция выдает массив координат точки, удаленной от базовой при заданном расстоянии и угле смещения
относительно оси x*/
	if (basePoint instanceof Array) {
		var newPoint=[];
		newPoint[0] = basePoint[0] + deltaX;
		newPoint[1] = basePoint[1] + deltaX * Math.tan(angle);
		if(basePoint[2] != "undefined") newPoint[2] = basePoint[2];
		return newPoint;
		}
	if (basePoint instanceof Object) {
		var newPoint = {};
		newPoint.x = basePoint.x + deltaX;
		newPoint.y = basePoint.y + deltaX * Math.tan(angle);
		if(basePoint.z != "undefined") newPoint.z = basePoint.z;
		return newPoint;	
		}
	
}

function newPoint_y(basePoint, deltaY, angle){
/*функция выдает массив координат точки, удаленной от базовой при заданном расстоянии и угле смещения
относительно оси y*/

	if (basePoint instanceof Array) {
		var newPoint=[];
		newPoint[0] = basePoint[0] + deltaY / Math.tan(angle);
		newPoint[1] = basePoint[1] + deltaY;
		if(basePoint[2] != "undefined") newPoint[2] = basePoint[2];
		return newPoint;
		}
	if (basePoint instanceof Object) {
		var newPoint = {};
		newPoint.x = basePoint.x + deltaY / Math.tan(angle);
		newPoint.y = basePoint.y + deltaY;
		if(basePoint.z != "undefined") newPoint.z = basePoint.z;
		return newPoint;	
		}
}

function newPoint_z(basePoint, deltaZ, angle){
/*функциЯ выдает массив координат точки, удаленной от базовой при заданном расстоЯнии и угле смещениЯ
относительно оси z*/
if (basePoint instanceof Array) {
	var newPoint=[];
	newPoint[0] = basePoint[0];
	newPoint[1] = basePoint[1] - deltaX * Math.tan(angle);
	newPoint[2] = basePoint[2] + deltaZ;
	return newPoint;
	}	
}

function copyPoint(basePoint){
/*функциЯ копирует значениЯ координат одной точки в другую*/
	if (basePoint instanceof Object){
		var newPoint = {};
		newPoint.x = basePoint.x;
		newPoint.y = basePoint.y;
		if(basePoint.z != "undefined") newPoint.z = basePoint.z;
		return newPoint;
		}	
}

function distance(point_1, point_2){
/*рассчитывается расстояние между двумя точками*/
var dist=0;
if(point_1 instanceof Array)
	dist = (point_1[0] - point_2[0])*(point_1[0] - point_2[0]) + (point_1[1] - point_2[1])*(point_1[1] - point_2[1]);
if(point_1 instanceof Object && point_1.x != undefined)
	dist = (point_1.x - point_2.x)*(point_1.x - point_2.x) + (point_1.y - point_2.y)*(point_1.y - point_2.y);

	dist = Math.sqrt(dist);
return dist;
}

/** функция рассчитывается расстояние между двумя трехмерными точками*/

function distance3d(point_1, point_2){

var dist = (point_1.x - point_2.x)*(point_1.x - point_2.x) + 
	(point_1.y - point_2.y)*(point_1.y - point_2.y) + 
	(point_1.z - point_2.z)*(point_1.z - point_2.z);

	dist = Math.sqrt(dist);
return dist;
}

function calculateStringerWidth(h,b,stairAmt) {
/*функциЯ рассчитывает ширину тетивы исходЯ из максимально допустимого прогиба
формула вот такаЯ: http://joxi.ru/GrqV6nMfN3aB5m*/
var result3 = 304.036*((stairAmt*(b/11.25+13.4) + 80)*Math.cos(Math.atan(h/b)))*(Math.pow((Math.sqrt(h*h+b*b)*stairAmt/1000),3))
var result = Math.pow(result3, 1/3);
result = Math.round(result);
return result;
}

function calculateFilletParams(lineAP1, ang1, lineBP1, ang2, rad, clockwise) {
/*функциЯ рассчитывает параметры скруглениЯ двух линий. ‹инии задаютсЯ
точкой и углом. “гол задаетсЯ таким образом, чтобы линиЯ была направлена к точке пересечениЯ
последний параметр - направление построениЯ дуги*/

  var lineAP2 = itercection(lineAP1, polar(lineAP1, ang1, 1.0), lineBP1, polar(lineBP1, ang2, 1.0));
  if (lineAP2.x !== undefined && lineAP2.y !== undefined) {
   // var n = Math.abs(rad / Math.tan((ang2 - ang1) * 0.5));
	var n = rad / Math.tan((ang2 - ang1) * 0.5);
    var pta = polar(lineAP2, ang1, -n);
    var ptb = polar(lineAP2, ang2, -n);
    var ang = Math.abs(ang2 - ang1);
	//var ang = ang2 - ang1;
    ang = ang1 + Math.PI * ((ang2 > ang1 && ang > Math.PI) || (ang2 < ang1 && ang < Math.PI) ? 0.5 : -0.5);
    var ptc = polar(pta, ang, rad);
   var angstart = angleX(ptc, pta);
   var angend = angleX(ptc, ptb);
   //проверЯем направление построениЯ дуги
	if(clockwise && angstart < angend) angend = angend - 2 * Math.PI;   
	if(!clockwise && angstart > angend) angstart = angstart - 2 * Math.PI; 

   var filletParams = {
		int: lineAP2, 
		start: pta, 
		end: ptb, 
		center: ptc, 
		angstart: angstart, 
		angend: angend, 
		}
	
	return filletParams;
  }
  else {
    return null;
  }
}

function calculateFilletParamsLines(lineAP1, lineAP2, lineBP1, lineBP2, rad, clockwise) {
/*функциЯ рассчитывает параметры скруглениЯ двух линий. ‹инии задаютсЯ
точкой и углом. “гол задаетсЯ таким образом, чтобы линиЯ была направлена к точке пересечениЯ
последний параметр - направление построениЯ дуги*/

	var ang1 = angleX(lineAP1, lineAP2)
	var ang2 = angleX(lineBP1, lineBP2)
  //var lineAP2 = itercection(lineAP1, polar(lineAP1, ang1, 1.0), lineBP1, polar(lineBP1, ang2, 1.0));
  if (lineAP2.x !== undefined && lineAP2.y !== undefined) {
   // var n = Math.abs(rad / Math.tan((ang2 - ang1) * 0.5));
	var n = rad / Math.tan((ang2 - ang1) * 0.5);
    var pta = polar(lineAP2, ang1, -n);
    var ptb = polar(lineAP2, ang2, -n);
    var ang = Math.abs(ang2 - ang1);
	//var ang = ang2 - ang1;
    ang = ang1 + Math.PI * ((ang2 > ang1 && ang > Math.PI) || (ang2 < ang1 && ang < Math.PI) ? 0.5 : -0.5);
    var ptc = polar(pta, ang, rad);
   var angstart = angleX(ptc, pta);
   var angend = angleX(ptc, ptb);
   //проверЯем направление построениЯ дуги
	if(clockwise && angstart < angend) angend = angend - 2 * Math.PI;   
	if(!clockwise && angstart > angend) angstart = angstart - 2 * Math.PI; 

   var filletParams = {
		int: lineAP2, 
		start: pta, 
		end: ptb, 
		center: ptc, 
		angstart: angstart, 
		angend: angend, 
		}
	
	return filletParams;
  }
  else {
    return null;
  }
}

function calcArcFillet(par){

/*
функция рассчитывае параметры скругления стыка прямой и окружности
var filletPar = {
	line_p1: copyPoint(p2),
	line_p2: copyPoint(p3),
	arcCenter: copyPoint(p0),
	arcRad: stairRad,
	filletRad: 20,
	topAngle //верхний или нижний угол
	}	
*/	

var p1 = par.line_p1;
var p2 = par.line_p2;
var lineAngle = angle(p1, p2)

if(par.topAngle)  var line2 = parallel(p1, p2, -par.filletRad) //параллель вниз
else  var line2 = parallel(p1, p2, par.filletRad); //параллель вверх


//опускаем перпендикуляр из центра окружности на линию
var perpParams = calcPerpParams(line2.p1, line2.p2, par.arcCenter);
var ph = perpParams.point;
var h = perpParams.dist;

//считаем расстояние от перпендикуляра до точки пересечения прямой и окружности
var rad2 = par.arcRad - par.filletRad;
var dist = Math.sqrt(rad2 * rad2 - h * h);

//считаем координаты точек пересечения
var intP1 = polar(ph, lineAngle, dist);
var intP2 = polar(ph, lineAngle, -dist);


var filletPar = [];
if(par.topAngle){
	filletPar[0] = {
		center: intP1,
		angStart: lineAngle + Math.PI / 2,
		angEnd: angle(par.arcCenter, intP1),
		}
	filletPar[0].start = polar(intP1, filletPar[0].angStart, par.filletRad);
	filletPar[0].end = polar(intP1, filletPar[0].angEnd, par.filletRad)

	filletPar[1] = {
		center: intP2,
		angEnd: lineAngle + Math.PI / 2,
		angStart: angle(par.arcCenter, intP2),
		}
	filletPar[1].start = polar(intP2, filletPar[1].angStart, par.filletRad);
	filletPar[1].end = polar(intP2, filletPar[1].angEnd, par.filletRad)
	}

if(!par.topAngle){
	filletPar[0] = {
		center: intP1,
		angEnd: lineAngle - Math.PI / 2,
		angStart: angle(par.arcCenter, intP1),
		}
	filletPar[0].start = polar(intP1, filletPar[0].angStart, par.filletRad);
	filletPar[0].end = polar(intP1, filletPar[0].angEnd, par.filletRad)

	filletPar[1] = {
		center: intP2,
		angEnd: lineAngle + Math.PI / 2,
		angStart: angle(par.arcCenter, intP2),
		}
	filletPar[1].start = polar(intP2, filletPar[1].angStart, par.filletRad);
	filletPar[1].end = polar(intP2, filletPar[1].angEnd, par.filletRad)
	}
par.filletPar = filletPar

return par;
} //end of calcArcFillet

/** функция рассчитывае параметры перпендикуляра, опущенного из точки p0 на прямую, 
заданную точками line_p1 и line_p2
*/

function calcPerpParams(line_p1, line_p2, p0){

var lineAngle = angle(line_p1, line_p2);
//вспомогательная точка на перпендикуляре из центра окружности к линии
var pht = polar(p0, (lineAngle + Math.PI/2), 100) 
var ph = itercection(line_p1, line_p2, p0, pht);
var dist = distance(p0, ph)
var ang = angle(ph, p0)

var par = {
	dist: dist,
	point: ph,
	ang: ang,
	}
	
	return par;
} //end of calcPerpParams


function angleX(pt1, pt2) {
/*функциЯ возвращает угол между осью X и отрезком, соединЯющим точки*/
if(pt2.x == pt1.x || pt2.y == pt1.y){
	if(pt2.x == pt1.x){
		if(pt2.y > pt1.y) ang = Math.PI/2;
		if(pt2.y < pt1.y) ang = 3*Math.PI/2;
		}
	if(pt2.y == pt1.y){
		if(pt2.x > pt1.x) ang = 0;
		if(pt2.x < pt1.x) ang = Math.PI; 
		}
}
else{
  var x = pt2.x - pt1.x;
  var y = pt2.y - pt1.y;
  var ang = Math.atan(y / x);
  }
  return ang;
}

function toRadians(angle){
  return angle * (Math.PI / 180);
}


/*новые функции сопряжения углов*/


function calcAngleX1(p1, p2) {
	/*функция возвращает угол между осью X и отрезком, соединяющим точки*/
	var length = distance(p1,p2)
	var sin = (p2.y - p1.y)/length;
	var cos = (p2.x - p1.x)/length;

	var angle = Math.asin(sin);
	if(sin > 0 && cos < 0) angle = Math.PI - angle;
	if(sin < 0 && cos < 0) angle = - Math.PI - angle;
	
	if(sin == 0 && cos > 0) angle = 0;
	if(sin == 0 && cos < 0) angle = Math.PI;
	return angle;
}

function calcLinesAngle(p1, p2, p3){
	var ang1 = calcAngleX1(p2, p1);
	var ang2 = calcAngleX1(p2, p3);
	var ang = ang2 - ang1;
	if(ang < 0 && ang < -Math.PI) ang = 2*Math.PI + ang;
	if(ang < 0 && ang > -Math.PI) ang = Math.PI + ang;
	return ang;
}

function calcFilletParams1(p1, p2, p3, radius, clockwise) {
/*функция рассчитывает параметры скругления двух линий. Линии задаются
точкой и углом. Угол задается таким образом, чтобы линия была направлена к точке пересечения
последний параметр - направление построения дуги*/

	var ang1 = calcAngleX1(p2, p1);
	var ang2 = calcAngleX1(p2, p3);
	var linesAngle = calcLinesAngle(p1, p2, p3);
	var startToP2Dist = radius / Math.tan(linesAngle/2);
    var p11 = polar(p2, ang1, startToP2Dist);
    var p31 = polar(p2, ang2, startToP2Dist);
	var center = polar(p11, ang1+Math.PI/2, radius);
	
	var angstart = calcAngleX1(center, p11);
	var angend = calcAngleX1(center, p31); 
   
   //проверяем направление построения дуги
	if(clockwise && angstart < angend) angend = angend - 2 * Math.PI;   
	//if(!clockwise && angstart > angend) angstart = angstart - 2 * Math.PI; 

   var filletParams = {
		start: p11, 
		end: p31, 
		center: center, 
		angstart: angstart, 
		angend: angend,
		rad: radius,
		}
	
	return filletParams;

}

function calcFilletParams2(p1, p2, p3, radius, clockwise) {
/*функция рассчитывает параметры скругления двух линий. Линии задаются
точкой и углом. Угол задается таким образом, чтобы линия была направлена к точке пересечения
последний параметр - направление построения дуги*/

	//если дуга строится против часовой стрелки меняем местами точки
	if(!clockwise) {
		var pt = copyPoint(p1);
		p1 = copyPoint(p3);
		p3 = copyPoint(pt);
		}
	
	var ang1 = calcAngleX1(p2, p1);
	var ang2 = calcAngleX1(p2, p3);
	var linesAngle = calcLinesAngle(p1, p2, p3);
	var startToP2Dist = radius / Math.tan(linesAngle/2);
    var p11 = polar(p2, ang1, startToP2Dist);
    var p31 = polar(p2, ang2, startToP2Dist);
	var center = polar(p11, ang1+Math.PI/2, radius);
	
	var angstart = calcAngleX1(center, p11);
	var angend = calcAngleX1(center, p31); 
   
   //проверяем направление построения дуги
	  
	//if(!clockwise && angstart > angend) angstart = angstart - 2 * Math.PI; 

   var filletParams = {
		start: p11, 
		end: p31, 
		center: center, 
		angstart: angstart, 
		angend: angend,
		rad: radius,
		}
	if(!clockwise){
		filletParams.start = p31;
		filletParams.end = p11;
		angstart = angend;
		angend = angstart;
		}
	
	return filletParams;

}

function drawPolygon(par){
/*рисует правильный многоугольник со скругленными краями*/

par.path = new THREE.Path();
par.shape = new THREE.Shape();
var dxfPrimitivesArr = par.dxfPrimitivesArr;
var dxfBasePoint = par.dxfBasePoint;
var edgeAngle = 2*Math.PI / par.vertexAmt;
var p0 =  par.basePoint;
var vertexes = [];
	vertexes[0] = p0;
var stepAngle = Math.PI;
var layer = 0;
	
	//углы без учета скруглений
	for(var i=1; i < par.vertexAmt; i++){
		stepAngle = stepAngle - edgeAngle; 
		vertexes[i] = polar(vertexes[i-1], stepAngle, par.edgeLength);
		}
	if(par.cornerRad > 0){
		var filletParams = {
			vertexes: vertexes,
			cornerRad: par.cornerRad,	
			dxfBasePoint: par.dxfBasePoint,
			dxfPrimitivesArr: par.dxfPrimitivesArr,
			type: par.type,
			}
		
		par.path = fiiletPathCorners(filletParams);
		}
	else{
		if(par.type == "path"){
			for(var i = 0; i < vertexes.length; i++){		
				if(i != vertexes.length-1) addLine(par.path, dxfPrimitivesArr, vertexes[i], vertexes[i+1], dxfBasePoint, layer);			
				if(i == vertexes.length-1) addLine(par.path, dxfPrimitivesArr, vertexes[i], vertexes[0], dxfBasePoint, layer);
				};
			par.path = path;
			}
		
		if(par.type == "shape"){
			for(var i = 0; i < vertexes.length; i++){		
				if(i != vertexes.length-1) addLine(par.shape, dxfPrimitivesArr, vertexes[i], vertexes[i+1], dxfBasePoint, layer);			
				if(i == vertexes.length-1) addLine(par.shape, dxfPrimitivesArr, vertexes[i], vertexes[0], dxfBasePoint, layer);
				};
			}
		}
	
	par.vertexes = vertexes;
	return par;	
}


function fiiletPathCorners(filletParams){
	var vertexes = filletParams.vertexes;
	var cornerRad = filletParams.cornerRad;
	var path = new THREE.Path();
	var shape = new THREE.Shape();
	var dxfPrimitivesArr = filletParams.dxfPrimitivesArr;
	var dxfBasePoint = filletParams.dxfBasePoint;
	var layer = 0;
	if(filletParams.layer != "undefined") layer = filletParams.layer;

	//рассчитываем параметры скрулгений
	
	var clockwise = true;
	var fil = [];
	for(var i = 0; i < vertexes.length; i++){
		if(i == 0) fil[0] = calcFilletParams1(vertexes[vertexes.length-1], vertexes[0], vertexes[1], cornerRad, clockwise)
		if(i !=0 && i != vertexes.length-1) fil[i] = calcFilletParams1(vertexes[i-1], vertexes[i], vertexes[i+1], cornerRad, clockwise)
		if(i == vertexes.length-1) fil[vertexes.length-1] = calcFilletParams1(vertexes[i-1], vertexes[i], vertexes[0], cornerRad, clockwise)
		}
	
	//строим контур для отверстия
	if(filletParams.type == "path"){		
		for(var i = 0; i < vertexes.length; i++){		
			addArc(path, dxfPrimitivesArr, fil[i].center, cornerRad, fil[i].angstart, fil[i].angend, dxfBasePoint, layer)
			if(i != vertexes.length-1) addLine(path, dxfPrimitivesArr, fil[i].end, fil[i+1].start, dxfBasePoint, layer);			
			if(i == vertexes.length-1) addLine(path, dxfPrimitivesArr, fil[i].end, fil[0].start, dxfBasePoint, layer);
			}
		return path;
		}
		
	//строим контур для шейпа
	if(filletParams.type == "shape"){	
		for(var i = 0; i < vertexes.length; i++){		
			addArc(shape, dxfPrimitivesArr, fil[i].center, cornerRad, fil[i].angstart, fil[i].angend, dxfBasePoint, layer)
			if(i != vertexes.length-1) addLine(shape, dxfPrimitivesArr, fil[i].end, fil[i+1].start, dxfBasePoint, layer);			
			if(i == vertexes.length-1) addLine(shape, dxfPrimitivesArr, fil[i].end, fil[0].start, dxfBasePoint, layer);
			}
		return shape;
		}
		
}//end of fiiletPathCorners



/*добавление примитивов*/


function addRoundHole(shape, dxfPrimitivesArr, center, holeRad, dxfBasePoint, layer){
	if(!layer) layer = "parts";
	
	var hole = new THREE.Path();
	addCircle(hole, dxfPrimitivesArr, center, holeRad, dxfBasePoint, layer);
	shape.holes.push(hole);	
}//end of addRoundHole

function addPath(shape, dxfArr, points, dxfBasePoint, layer) {
	if(!layer) layer = "parts";
	//отрисовывает несколько линий на основе массива точек
	for (var idx = 0; idx < points.length; idx++) {
		if (idx + 1 < points.length) {
			addLine(shape, dxfArr, points[idx], points[idx + 1], dxfBasePoint, layer);
			}
		}
}


function addLine(shape, dxfArr, startPoint, endPoint, dxfBasePoint, layer) {
	if(!layer) layer = "parts";
	shape.moveTo(startPoint.x, startPoint.y)
	shape.lineTo(endPoint.x, endPoint.y)
	shape.currentPoint = new THREE.Vector2( endPoint.x, endPoint.y )
			
	/*добавление в массив dxf*/

	var id = dxfArr.length;
	dxfArr[id] = 
	"0" + "\n" + "LINE" + "\n" + 
	"5" + "\n" + id + "\n" + 
	"8" + "\n" + layer + "\n" + //номер слоя
	"10" + "\n" + (startPoint.x + dxfBasePoint.x) + "\n" + 
	"20" + "\n" + (startPoint.y + dxfBasePoint.y) + "\n" + 
	"30" + "\n" + "0.0" + "\n" + 
	"11" + "\n" + (endPoint.x + dxfBasePoint.x) + "\n" + 
	"21" + "\n" + (endPoint.y + dxfBasePoint.y) + "\n" + 
	"31" + "\n" + "0.0" + "\n"; 
}

function addArc(shape, dxfArr, centerPoint, radius, startAngle, endAngle, dxfBasePoint, layer){
	if(!layer) layer = "parts";
	var endPoint = polar(centerPoint, endAngle, radius);
	/*добавление в shape*/
	
	var clockwise = true;

	if(startAngle < endAngle) {
		clockwise = false;
		temp = startAngle;
		startAngle = endAngle;
		endAngle = temp;
		}

	shape.absarc(centerPoint.x, centerPoint.y, radius, startAngle, endAngle, clockwise)
	
	
	shape.currentPoint = new THREE.Vector2( endPoint.x, endPoint.y )

	/*добавление в dxf*/
	/*переводим углы в градусы*/
	startAngle = startAngle * 180 / Math.PI;
	endAngle = endAngle * 180 / Math.PI;
	/*дуга строится против часовой стрелки*/
	if(startAngle > endAngle) {
		var temp = startAngle;
		startAngle = endAngle;
		endAngle = temp
		}

	var id = dxfArr.length;
	dxfArr[id] = 
	"0" + "\n" + "ARC" + "\n" + 
	"5" + "\n" + id + "\n" + 
	"8" + "\n" + layer + "\n" + //номер слоя
	"10" + "\n" + (centerPoint.x + dxfBasePoint.x) + "\n" + 
	"20" + "\n" + (centerPoint.y + dxfBasePoint.y) + "\n" + 
	"30" + "\n" + "0.0" + "\n" + 
	"40" + "\n" + radius + "\n" + 
	"50" + "\n" + startAngle + "\n" + 
	"51" + "\n" + endAngle + "\n";

}

function addArc2(shape, dxfArr, centerPoint, radius, startAngle, endAngle, clockwise, dxfBasePoint, layer) {
	if (!layer) layer = "parts";
	var endPoint = polar(centerPoint, endAngle, radius);
	
	/*добавление в shape*/
	/*
	var clockwise = true;
	if(startAngle < endAngle) {
		clockwise = false;
		temp = startAngle;
		startAngle = endAngle;
		endAngle = temp;
		}
	*/
	
	if(clockwise == false) {
		//clockwise = false;
		temp = startAngle;
		startAngle = endAngle;
		endAngle = temp;
		}
		
	shape.absarc(centerPoint.x, centerPoint.y, radius, startAngle, endAngle, clockwise)



	/*добавление в dxf*/
	/*переводим углы в градусы*/
	startAngle = startAngle * 180 / Math.PI;
	endAngle = endAngle * 180 / Math.PI;
	/*дуга строится против часовой стрелки*/
	/*if(startAngle > endAngle) {
		var temp = startAngle;
		startAngle = endAngle;
		endAngle = temp
		}
*/
	var id = dxfArr.length;
	dxfArr[id] =
		"0" + "\n" + "ARC" + "\n" +
		"5" + "\n" + id + "\n" +
		"8" + "\n" + layer + "\n" + //номер слоя
		"10" + "\n" + (centerPoint.x + dxfBasePoint.x) + "\n" +
		"20" + "\n" + (centerPoint.y + dxfBasePoint.y) + "\n" +
		"30" + "\n" + "0.0" + "\n" +
		"40" + "\n" + radius + "\n" +
		"50" + "\n" + endAngle + "\n" +
		"51" + "\n" + startAngle + "\n";

}

function addCircle(shape, dxfArr, centerPoint, radius, dxfBasePoint, layer) {
	if(!layer) layer = "parts";
	/*добавление в shape*/
	shape.absarc(centerPoint.x, centerPoint.y, radius, 0, 2*Math.PI, true)

	/*добавление в dxf*/
	var id = dxfArr.length;
	dxfArr[id] = 
	"0" + "\n" + "CIRCLE" + "\n" + 
	"5" + "\n" + id + "\n" + 
	"8" + "\n" + layer + "\n" + //номер слоя
	"10" + "\n" + (centerPoint.x + dxfBasePoint.x) + "\n" + 
	"20" + "\n" + (centerPoint.y + dxfBasePoint.y) + "\n" + 
	"30" + "\n" + "0.0" + "\n" + //центр z
	"40" + "\n" + radius + "\n"; //радиус
}

function addText(text, height, dxfArr, dxfBasePoint, layer) {
	if(!layer) layer = "comments";
	/*добавление в dxf*/
	var id = dxfArr.length;
	dxfArr[id] = 
	"0" + "\n" + "TEXT" + "\n" + 
	"1" + "\n" + text + "\n" + 
	"5" + "\n" + id + "\n" + 
	"8" + "\n" + layer + "\n" + //номер слоя
	"10" + "\n" + dxfBasePoint.x + "\n" + 
	"20" + "\n" + dxfBasePoint.y + "\n" + 
	"30" + "\n" + "0.0" + "\n" + 
	"40" + "\n" + height + "\n";
}

function addLeader(text, textHeight, offsetLeft, offsetTop, dxfArr, basePoint, dxfBasePoint, layer) {
	if(!layer) layer = "comments";
	/*добавляет выноску, смещенную от базовой точки влево вверх*/

	basePoint1 = newPoint_xy(dxfBasePoint, basePoint.x, basePoint.y)
	var lineCornerPoint = newPoint_xy(basePoint1, -offsetLeft, offsetTop)

		
	//Линия выноски
	var id = dxfArr.length;
	dxfArr[id] = 
	"0" + "\n" + "LINE" + "\n" + 
	"5" + "\n" + id + "\n" + 
	"8" + "\n" + layer + "\n" + //номер слоя
	"10" + "\n" + basePoint1.x + "\n" + 
	"20" + "\n" + basePoint1.y + "\n" + 
	"30" + "\n" + "0.0" + "\n" + 
	"11" + "\n" + lineCornerPoint.x + "\n" + 
	"21" + "\n" + lineCornerPoint.y + "\n" + 
	"31" + "\n" + "0.0" + "\n"; 

	//подчеркивание текста
	var textLength = text.length * textHeight;
	var basePointText = newPoint_xy(lineCornerPoint, -textLength, 0);
	//Линия выноски
	id = dxfArr.length;
	dxfArr[id] = 
	"0" + "\n" + "LINE" + "\n" + 
	"5" + "\n" + id + "\n" + 
	"8" + "\n" + layer + "\n" + //номер слоя
	"10" + "\n" + lineCornerPoint.x + "\n" + 
	"20" + "\n" + lineCornerPoint.y + "\n" + 
	"30" + "\n" + "0.0" + "\n" + 
	"11" + "\n" + basePointText.x + "\n" + 
	"21" + "\n" + basePointText.y + "\n" + 
	"31" + "\n" + "0.0" + "\n"; 

	//добавление текста
	basePointText = newPoint_xy(basePointText, 0, textHeight*0.2);
	addText(text, textHeight, dxfArr, basePointText, layer);

}


function drawDimension3D(par){
	
	par.mesh = new THREE.Object3D();
	if(!fontGlob) return par;
	
	var color = new THREE.Color( 0x000 );
	var p1 = par.p1;
	var p2 = par.p2;
	var dimLineOverhang = 20;
	//if(dimLineOverhang > par.offset) dimLineOverhang = par.offset;
	
	var min_X = Math.min(p1.x, p2.x);
	var max_X = Math.max(p1.x, p2.x);
	var min_Y = Math.min(p1.y, p2.y);
	var max_Y = Math.max(p1.y, p2.y);
	var min_Z = Math.min(p1.z, p2.z);
	var max_Z = Math.max(p1.z, p2.z);
	
	
	if(par.basePlane == "xy"){
		if(par.baseAxis == "x"){
			if(par.offset > 0){
				var dimLineY = max_Y + par.offset;
				var endLineY = dimLineY + dimLineOverhang;
				};
			if(par.offset < 0){
				var dimLineY = min_Y + par.offset;
				var endLineY = dimLineY - dimLineOverhang;
				};
			
			var p11 = {x: p1.x, y: dimLineY, z: min_Z}
			var p12 = {x: p1.x, y: endLineY, z: min_Z}
			var p21 = {x: p2.x, y: dimLineY, z: min_Z}
			var p22 = {x: p2.x, y: endLineY, z: min_Z}
			
			//выносные линии
			var line = drawLine3D(p1, p12, color);
			par.mesh.add(line);
			var line = drawLine3D(p2, p22, color);
			par.mesh.add(line);
			
			//размерная линия			
			var line = drawLine3D(p11, p21, color);
			par.mesh.add(line);
			/*
			//засечки
			var p13 = newPoint_xy(p11, dimLineOverhang, dimLineOverhang)
			var p14 = newPoint_xy(p11, -dimLineOverhang, -dimLineOverhang)
			var line = drawLine3D(p13, p14, color);
			par.mesh.add(line);
			
			var p23 = newPoint_xy(p21, dimLineOverhang, dimLineOverhang)
			var p24 = newPoint_xy(p21, -dimLineOverhang, -dimLineOverhang)
			var line = drawLine3D(p23, p24, color);
			par.mesh.add(line);
			*/
			
			//стрелка слева
			var p13 = newPoint_xy(p11, dimLineOverhang, dimLineOverhang / 2)
			var p14 = newPoint_xy(p11, dimLineOverhang, -dimLineOverhang / 2)
			var line = drawLine3D(p11, p13, color);
			par.mesh.add(line);
			var line = drawLine3D(p11, p14, color);
			par.mesh.add(line);
			
			//стрелка справа
			var p23 = newPoint_xy(p21, -dimLineOverhang, dimLineOverhang / 2)
			var p24 = newPoint_xy(p21, -dimLineOverhang, -dimLineOverhang / 2)
			var line = drawLine3D(p21, p23, color);
			par.mesh.add(line);
			var line = drawLine3D(p21, p24, color);
			par.mesh.add(line);
			
			var dimText = Math.round(Math.abs(p1.x - p2.x));
			var dimTextLen = String(Math.round(dimText)).length * 20;
			
			var text = drawText3D(dimText, color);
			text.position.x = (p11.x + p21.x) / 2 - dimTextLen / 2;
			text.position.y = p11.y + 3;
			text.position.z = p11.z;
			par.mesh.add(text);
			
			}
		if(par.baseAxis == "y"){
			if(par.offset > 0){
				var dimLineX = max_X + par.offset;
				var endLineX = dimLineX + dimLineOverhang;
				};
			if(par.offset < 0){
				var dimLineX = min_X + par.offset;
				var endLineX = dimLineX - dimLineOverhang;
				};
			
			var p11 = {x: dimLineX, y: p1.y, z: min_Z}
			var p12 = {x: endLineX, y: p1.y, z: min_Z}
			var p21 = {x: dimLineX, y: p2.y, z: min_Z}
			var p22 = {x: endLineX, y: p2.y, z: min_Z}
			
			//выносные линии
			var line = drawLine3D(p1, p12, color);
			par.mesh.add(line);
			var line = drawLine3D(p2, p22, color);
			par.mesh.add(line);
			
			//размерная линия			
			var line = drawLine3D(p11, p21, color);
			par.mesh.add(line);
			
			/*
			//засечки
			var p13 = newPoint_xy(p11, dimLineOverhang, dimLineOverhang)
			var p14 = newPoint_xy(p11, -dimLineOverhang, -dimLineOverhang)
			var line = drawLine3D(p13, p14, color);
			par.mesh.add(line);
			
			var p23 = newPoint_xy(p21, dimLineOverhang, dimLineOverhang)
			var p24 = newPoint_xy(p21, -dimLineOverhang, -dimLineOverhang)
			var line = drawLine3D(p23, p24, color);
			par.mesh.add(line);
			*/
			
			//стрелка снизу
			var p13 = newPoint_xy(p11, dimLineOverhang/2, dimLineOverhang)
			var p14 = newPoint_xy(p11, -dimLineOverhang/2, dimLineOverhang)
			var line = drawLine3D(p11, p13, color);
			par.mesh.add(line);
			var line = drawLine3D(p11, p14, color);
			par.mesh.add(line);
			
			//стрелка сверху
			var p23 = newPoint_xy(p21, dimLineOverhang/2, -dimLineOverhang)
			var p24 = newPoint_xy(p21, -dimLineOverhang/2, -dimLineOverhang)
			var line = drawLine3D(p21, p23, color);
			par.mesh.add(line);
			var line = drawLine3D(p21, p24, color);
			par.mesh.add(line);
			
			var dimText = Math.round(Math.abs(p1.y - p2.y));
			var dimTextLen = String(dimText).length * 20;
			var text = drawText3D(dimText, color);
			text.rotation.z = Math.PI / 2;
			text.position.x = p11.x - 3;
			text.position.y = (p11.y + p21.y)/2 - dimTextLen / 2;
			text.position.z = p11.z;
			par.mesh.add(text);
			
			}
		}
	if(par.basePlane == "xz"){
		if(par.baseAxis == "x"){
			
			}
		if(par.baseAxis == "z"){
			
			}
		}
	if(par.basePlane == "yz"){
		if(par.baseAxis == "y"){
			
			}
		if(par.baseAxis == "z"){
			
			}
		}

	//линия между точками
	/*
	var color = new THREE.Color( 0xff0000 );
	var line = drawLine3D(par.p1, par.p2, color);
	par.mesh.add(line);
	*/
	par.text = text;
	
	return par;

}//end of drawDimension3D

function drawLine3D(p1, p2, color){
	var lineGeometry = new THREE.Geometry();
	var v1 = new THREE.Vector3(p1.x, p1.y, p1.z);
	var v2 = new THREE.Vector3(p2.x, p2.y, p2.z);
	//lineGeometry.vertices.push(p1, p2);
	lineGeometry.vertices.push(v1, v2);
	lineGeometry.colors.push(color, color, color);
	var lineMaterial = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } );
	var line = new THREE.Line(lineGeometry, lineMaterial);
	
	return line;
}

function drawText3D(text, color){
    var textGeo = new THREE.TextGeometry( text, {
        font: fontGlob,
        size: 30,
        height: 0,
       } );

    var textMaterial = new THREE.MeshPhongMaterial( { color: 0x0000 } );

    var mesh = new THREE.Mesh( textGeo, textMaterial );

    return mesh;
	

}


function loadFont(){
	var loader = new THREE.FontLoader();
	var mesh = loader.load( '/calculator/general/three_libs/font.json', function ( font ) {
	fontGlob = font;
	if (typeof fontLoadedCallback == 'function') fontLoadedCallback();
});

}


function signKeyPoints(pointsArr, dxfBasePoint){
	//вспомогательная функция показывает на dxf чертеже точки из объекта pointsArr
	var layer = "comments2";
	if(typeof pointsArr == "object"){
		for(var pointName in pointsArr){
			var text = pointName;
			var textHeight = 20;
			var offsetLeft = 200;
			var offsetTop = 100;
			if(pointsArr[pointName] != undefined)
				addLeader(text, textHeight, offsetLeft, offsetTop, dxfPrimitivesArr, pointsArr[pointName], dxfBasePoint, layer)
			else console.log("Не удалось обозначить точку " + pointName)
			}
		}
}//end of signKeyPoints

function drawShapeByPoints(par){

	//функция строит шейп по массиву точек
	par.shape = new THREE.Shape();
	
	if(par.points.length < 3) {
		console.log("drawShapeByPoints: не удалось построить shape, т.к. в массиве меньше 3 точек");
		return par;
		}
	
	for(var i=0; i<par.points.length-1; i++){
		var p1 = par.points[i];
		var p2 = par.points[i+1]
		//если угол не скруглен и обе точки существуют
		if(p1.x != undefined && p2.x != undefined){
			//если точки не совпадают
			if(p1.x != p2.x || p1.y != p2.y)
				addLine(par.shape, par.dxfArr, p1, p2, par.dxfBasePoint);			
			else
				console.log("Точки " + i + " и " + (i+1) + " совпадают");
			}
		//следующая точка - начало дуги
		if(p1.x != undefined && p2.center){
			addLine(par.shape, par.dxfArr, p1, p2.start, par.dxfBasePoint);
			}
		//текущая точка - дуга
		if(p1.center && p2.x != undefined){
			addArc(par.shape, par.dxfArr, p1.center, p1.rad, p1.angend, p1.angstart, par.dxfBasePoint)
			addLine(par.shape, par.dxfArr, p1.end, p2, par.dxfBasePoint);
			}
		
		//все углы скруглены
		if(p1.center && p2.center){
			addArc(par.shape, par.dxfArr, p1.center, p1.rad, p1.angend, p1.angstart, par.dxfBasePoint)
			addLine(par.shape, par.dxfArr, p1.end, p2.start, par.dxfBasePoint);
			}
		
		}
	//замыкающая линия
	var p1 = par.points[par.points.length-1];
	var p2 = par.points[0];
	if(p1.center) p1 = copyPoint(p1.end);
	if(p2.center) p2 = copyPoint(p2.start);
	
	addLine(par.shape, par.dxfArr, p1, p2, par.dxfBasePoint);
	
	//пометка точек в dxf для отладки
	if(par.markPoints){
		var layer = "comments2";
		for(var i=0; i<par.points.length; i++){
			var p1 = par.points[i];
			var text = i + " точка";
			if(p1.name) text += " (" + p1.name + ")";
			var textHeight = 20;
			var offsetLeft = 200;
			var offsetTop = 100;
			if(p1.x) 
				addLeader(text, textHeight, offsetLeft, offsetTop, par.dxfArr, p1, par.dxfBasePoint, layer);
			if(p1.center) 
				addLeader(text, textHeight, offsetLeft, offsetTop, par.dxfArr, p1.center, par.dxfBasePoint, layer)
			}
		}
	
	return par;
}//end of drawShapeByPoints

/** функция создает шейп по массиву точек
*@params: points, 
*@params: radIn, radOut, 

*/


function drawShapeByPoints2(par) {

	var points = par.points;
/*	
	for(var i=0; i<points.length-1; i++){
		var point = {
			x: (points[i].x + points[i+1].x) / 2,
			y: (points[i].y + points[i+1].y) / 2,
			filletRad: 0,
			};
		points.splice(i+1, 0, point);
		i++
		//console.log(points[i].y, points[i+1].y, point.y)
	}
*/
	//функция строит шейп по массиву точек
	par.shape = new THREE.Shape();

	if (points.length < 3) {
		console.log("drawShapeByPoints: не удалось построить shape, т.к. в массиве меньше 3 точек");
		return par;
	}

	//скругляем углы
	var pointsRad = [];
	for (var i = 0; i < points.length; i++) {
		var p1 = points[i];
		var p2 = points[i + 1];
		var p3 = points[i + 2];
		//последние точки
		if (i == points.length - 2) {
			p3 = points[0]
		}
		if (i == points.length - 1) {
			p2 = points[0];
			p3 = points[1];
		}
		var clockWise = true;
		//во внутренних углах дуга строится против часовой стрелки
		if (calcAngleX2(p1, p2) < calcAngleX2(p1, p3)) clockWise = false;

		//задаем радиус скругления
		var rad = 0;
		if (p2.filletRad || p2.filletRad == 0) {
			rad = p2.filletRad;
		} else {
			if (calcAngleX2(p1, p2) < calcAngleX2(p1, p3)) {
				if (par.radIn) rad = par.radIn;
			} else {
				if (par.radOut) rad = par.radOut;
			}
		}

		var fill = calcFilletParams3(p1, p2, p3, rad, clockWise);
		pointsRad.push(fill);
	}

	points = pointsRad;

	for (var i = 0; i < points.length - 1; i++) {
		var p1 = points[i];
		var p2 = points[i + 1]
		//если угол не скруглен
		if (!p1.center && !p2.center) {
			//если точки не совпадают
			if (p1.x != p2.x || p1.y != p2.y)
				addLine(par.shape, par.dxfArr, p1, p2, par.dxfBasePoint);
			else
				console.log("Точки " + i + " и " + (i + 1) + " совпадают");
		}
		//следующая точка - начало дуги
		if (!p1.center && p2.center) {
			addLine(par.shape, par.dxfArr, p1, p2.start, par.dxfBasePoint);
		}
		//текущая точка - дуга
		if (p1.center && !p2.center) {
			addArc2(par.shape, par.dxfArr, p1.center, p1.rad, p1.angstart, p1.angend, p1.clockwise, par.dxfBasePoint)
			addLine(par.shape, par.dxfArr, p1.end, p2, par.dxfBasePoint);
		}

		//все углы скруглены
		if (p1.center && p2.center) {
			addArc2(par.shape, par.dxfArr, p1.center, p1.rad, p1.angstart, p1.angend, p1.clockwise, par.dxfBasePoint)
			addLine(par.shape, par.dxfArr, p1.end, p2.start, par.dxfBasePoint);
		}
	}

	//замыкающая линия
	var p1 = points[points.length - 1];
	if (p1.center) addArc2(par.shape, par.dxfArr, p1.center, p1.rad, p1.angstart, p1.angend, p1.clockwise, par.dxfBasePoint)

	var p2 = points[0];
	if (p1.center) p1 = copyPoint(p1.end);
	if (p2.center) p2 = copyPoint(p2.start);
	addLine(par.shape, par.dxfArr, p1, p2, par.dxfBasePoint);

	//пометка точек в dxf для отладки
	if (par.markPoints) {
		var layer = "comments2";
		for (var i = 0; i < par.points.length; i++) {
			var p1 = par.points[i];
			var text = i + " точка";
			if (p1.name) text += " (" + p1.name + ")";
			var textHeight = 20;
			var offsetLeft = 200;
			var offsetTop = 100;
			if (!p1.center)
				addLeader(text, textHeight, offsetLeft, offsetTop, par.dxfArr, p1, par.dxfBasePoint, layer);
			if (p1.center)
				addLeader(text, textHeight, offsetLeft, offsetTop, par.dxfArr, p1.center, par.dxfBasePoint, layer)
		}
	}

	par.points = points;

	return par;
}//end of drawShapeByPoints




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
		//if (angstart < angend && p1.x > p3.x && clockwise) angstart = angstart + 2 * Math.PI;

		if (p1.x < 0 && p3.x < 0) {
			if (angstart < angend && p1.x < p3.x && clockwise) angstart = angstart + 2 * Math.PI;
			} 
		else {
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

function calcAngleX2(p1, p2) {
	var ang = calcAngleX1(p1, p2);
	if (ang > -Math.PI && ang <= -Math.PI /2) ang += Math.PI * 2;
	return ang;
}


//функция рассчитывает координаты точки после поворота вокруг начала координат
function rotatePoint(point, rotAng){
	var zeroPoint = {x:0, y:0,}
	//рассчитываем полярные координаты точки
	var ang = angle(zeroPoint, point);
	var dist = distance(zeroPoint, point);

	//рассчитываем координаты новой точки с учетом угла поворота
	var newPoint = polar(zeroPoint, (ang + rotAng), dist);

	return newPoint;
} //end of rotatePoint

//функция смещает массив точек как единое целое на заданное расстояние по х и у
function moovePoints(points, mooveDist){
	var newPoints = [];
	for(var i = 0; i < points.length; i++){
		var newPoint = newPoint_xy(points[i], mooveDist.x, mooveDist.y);
		newPoints.push(newPoint);
		}
	return newPoints;
} //end of moovePoints

/** функция зеркалит точки относительно заданной оси*/

function mirrowPoints(points, axis){
	var newPoints = [];
	for(var i = 0; i < points.length; i++){
		if(axis == "y"){
			var newPoint = {x: -points[i].x, y: points[i].y};
		}
		if(axis == "x"){
			var newPoint = {x: points[i].x, y: -points[i].y};
		}
		newPoints.push(newPoint);
		}
	return newPoints;
} //end of moovePoints


function addHolesToShape(par) {	

	var zencDiam = 20;		// диаметр зенковки
	var layer = "parts";
	var trashShape = new THREE.Shape();
	if(!par.holeRad) par.holeRad = 6.5;
	par.noZenkHoles = [];

	par.dxfPrimitivesArr = par.dxfPrimitivesArr || dxfPrimitivesArr;
	
	//задаем функцию добавления отверстий
	var addHole = addRoundHole;
	if(par.isRailing) addHole = addRoundHoleRail;
		
	for (var i = 0; i < par.holeArr.length; i++) {
		var center = par.holeArr[i];
		layer = "parts";
		var rad = par.holeRad;
		if(center.rad) rad = center.rad;
		if(center.holeRad) rad = center.holeRad;
		addRoundHole(par.shape, par.dxfPrimitivesArr, center, rad, par.dxfBasePoint); 

		//не зенковать
		if (center.noZenk && params.boltHead == "countersunk") {
			layer = "comments";
			var pz1 = newPoint_xy(center, -zencDiam, zencDiam);
			var pz2 = newPoint_xy(center, zencDiam, -zencDiam);
			addLine(trashShape, par.dxfPrimitivesArr, pz1, pz2, par.dxfBasePoint, layer);
			pz1 = newPoint_xy(pz1, 0, -zencDiam * 2);
			pz2 = newPoint_xy(pz2, 0, zencDiam * 2);
			addLine(trashShape, par.dxfPrimitivesArr, pz1, pz2, par.dxfBasePoint, layer);
			}
		

		//зенковать с обратной стороны
		if (center.backZenk) {
			layer = "comments";
			addHole(trashShape, par.dxfPrimitivesArr, center, zencDiam, par.dxfBasePoint, layer);
			}
		
		//сохраняем отверстия для длинных болтов
		if (center.noZenk && rad < 7) par.noZenkHoles.push(center);
		
	}
	
	return par;
}

