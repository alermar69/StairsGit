$(function(){
	$("#makeGeomSvg").click(function(){
		makeSvg();
		$("#svgParForm").show();
		
	})
	
	$("#saveSvg2").click(function(){
		var text = $("#svgOutputDiv").html();
		saveSvgFile(text);
	})
	
	$("#saveDxf2").click(function(){		
		var svg = $("#svgOutputDiv").find("svg").clone().attr({"id": "temp"});
		$("#svgOutputDiv").append(svg)
		$("svg#temp g").removeAttr("transform")
		$("svg#temp g").removeAttr("style")
		flatten($("svg#temp")[0])
		svgToDxf($("svg#temp")[0])
		$("svg#temp").remove();
	})

})

function makeGeomSvg(){
	getAllInputsValues(params);
	
	var size = 300; //размер картинки в пикселях
	var mapSize = 1000; //размер показываемой области чертежа в мм
	if(!params.treadThickness) params.treadThickness = 40;
	
	var marshDraw = [];
	for(var i=1; i<=3; i++){
		
		//инициализация
		$("#marshParDrawWrap_" + i).html("");
		marshDraw[i] = Raphael("marshParDrawWrap_" + i, size, size);
		marshDraw[i].canvas.id = "marshParDraw_" + i;
		
		//оси координат
		//drawAxisHelper(2000, marshDraw[i]);
		
		var marshPar = getMarshParams(i);
		
		var mapSize = marshPar.a * 3; //размер показываемой области чертежа в мм
		
		var marshPar1 = {
			marshId: i,
			rot: -Math.PI / 2,
			draw: marshDraw[i],
			stairAmt: 2,
		}
		var marsh1 = drawMarsh(marshPar1)
		
		//базовые точки размеров
		var p1 = {x: 0, y: 0}
		var p2 = newPoint_xy(p1, marshPar.b, marshPar.h)
		var p3 = newPoint_xy(p2, marshPar.a, 0)
		
		var dimScale = 1.5;
		
		//проступь
		var dimPar = {
			type: "hor",
			p1: p1,
			p2: p2,
			offset: 50,
			side: "top",
			draw: marshDraw[i],
			dimScale: dimScale,
		}
		
		var dim = drawDim(dimPar);
		dim.setClass("dimensions");
		
		//ступень верхняя
		var dimPar = {
			type: "hor",
			p1: p2,
			p2: p3,
			offset: 50,
			side: "top",
			draw: marshDraw[i],
			dimScale: dimScale,
		}
		
		var dim = drawDim(dimPar);
		dim.setClass("dimensions");
		
		//ступень нижняя
		var dimPar = {
			type: "hor",
			p1: newPoint_xy(p1, marshPar.a, 0),
			p2: p1,
			offset: 70,
			side: "bot",
			draw: marshDraw[i],
			dimScale: dimScale,
		}
		
		var dim = drawDim(dimPar);
		dim.setClass("dimensions");
		
		//подъем
		var dimPar = {
			type: "vert",
			p1: p1,
			p2: p2,
			offset: -marshPar.b / 2 - 100 / dimScale,
			side: "left",
			draw: marshDraw[i],
			dimScale: dimScale,
		}
		
		var dim = drawDim(dimPar);		
		dim.setClass("dimensions");
		
		//угол марша
		var dimPar = {
			center: newPoint_xy(p1, marshPar.a, -params.treadThickness),
			p1: newPoint_xy(p2, marshPar.a, -params.treadThickness),
			p2: newPoint_xy(p1, marshPar.a + 200, -params.treadThickness),
			offset: marshPar.a,
			side: "left",
			draw: marshDraw[i],
			dimScale: dimScale,
			dimLines: true,
		}
		
		var dim = drawAngleDim2(dimPar);		
		dim.setClass("dimensions");
		
		var line1 = drawLine(dimPar.center, dimPar.p1, dimPar.draw);
		
		//масштаб и позиция картинки
		var offset = {
			left: mapSize / 2 - marshPar.b - params.nose / 2,
			top: mapSize / 2 + marshPar.h / 2,
		}
		marshDraw[i].setViewBox(-offset.left, -offset.top, mapSize, mapSize);
		
	}
}

/** функция отрисовывает размеры ступеней марша. Используется для всех маршей
view - имя вида
draw - ссылка на видовый экран
*/

function drawStariCase(view, draw){
	
};


/** функция отрисовывает лестницу. Используется для всех видовых экранов
view - имя вида
draw - ссылка на видовый экран
*/

function drawStariCase(view, draw){
	
	//угол поворота лестницы в 3D вокруг оси Y
	var rot = 0;
	if(view == "left") rot = Math.PI / 2;
	if(view == "right") rot = -Math.PI / 2;
	if(view == "rear") rot = Math.PI;
	var unitPos = calcUnitsPos();
	var dimensionOffsets = calcDimensionOffsets();

	//отрисовка маршей
	var previousTurn = null;//Переменная отвечает за предыдущий поворот
	for(var i=1; i<=3; i++){
		var marshParams = getMarshParams(i);

		if(unitPos.marsh[i]){
			var marshPar = {
				marshId: i,
				rot: rot,
				draw: draw,
			}
			var marsh = drawMarsh(marshPar)
		}
		if(unitPos.turn[i]){
			var turnPar = {
				turnId: i,
				rot: rot,
				draw: draw,
			}
			var turn = drawTurn(turnPar)
		}
		
		var marshPos = calcUnitsPos().marsh[i];

		if (marshPos) {
			var marshRot = marshPos.rot + rot;
			//Размер марша
			if(Math.abs(marshRot % Math.PI) == Math.PI / 2){
				var sizeGroup = draw.set();
				if (previousTurn) sizeGroup.push(previousTurn);
				if (marshParams.stairAmt > 0) sizeGroup.push(marsh);
				if (turn) sizeGroup.push(turn);
				var b = sizeGroup.getBBox();
				if (i == 1) b.width += dimensionOffsets.offsetStart; // добавляем зазор в начале лестницы
				if (marshParams.lastMarsh) b.width += dimensionOffsets.offsetEnd; // добавляем зазор в конце лестницы
				
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
				
				var sizeName = false;
				if (i == 1) sizeName = '.botMarshSize';
				if (i == 2) sizeName = '.midMarshSize';
				if (i == 3) sizeName = '.topMarshSize';
				if (sizeName) $('#dim_2D_new ' + sizeName).text(dimPar.size);
			}	
		}
		//Сохраняем текущий поворот, необходимо для трехмаршевой лестницы
		if (turn) previousTurn = turn;
	}

	// //отрисовка поворотов
	// for(var i=1; i<=2; i++){
	// 	if(unitPos.turn[i]){
	// 		var turnPar = {
	// 			turnId: i,
	// 			rot: rot,
	// 			draw: draw,
	// 		}
	// 		var turn = drawTurn(turnPar)
	// 	}
	// }
}

/** функция отрисовывает массив ступеней марша
	var marshPar = {
		marshId: i,
		rot: rot, - угол поворота в 3D с учетом вида (спереди, слева и т.п.)
		draw: draw, - ссылка на видовый экран
	}
*/
function drawMarsh(par){
	var group = par.draw.set();	
	
	var marshPar = getMarshParams(par.marshId);
	var marshPos = calcUnitsPos().marsh[par.marshId];
	
	var rectHeight = params.treadThickness;
	var rectWidth = marshPar.a;
	var stepX = marshPar.b;
	var stepY = marshPar.h
	
	//итоговый угол поворота марша с учетом вида
	//var rot = marshPos.rot + par.rot;
	var rot = par.rot;
	
	//вид спереди
	if(rot == 0 || rot == Math.PI || rot == -Math.PI){
		rectWidth = params.M;
		stepX = 0;
	}
	//вид справа
	if(rot == -Math.PI / 2){
		
	}
	//вид слева
	if(rot == Math.PI / 2){
		stepX *= -1;
	}
/*	
	//рассчитываем позицию начала марша в 2D на основе позиции в 3D
	var basePoint = {
		x: marshPos.z * Math.cos(par.rot) - marshPos.x * Math.sin(par.rot),
		y: marshPos.y + stepY,
	}
*/	
var basePoint = {
		x: 0,
		y: 0,
	}
	
	//отрисовка массива прямоугольников (ступеней)
	var stairAmt = marshPar.stairAmt;
	
	var hasCustomLastTread = false;
	if (marshPar.lastMarsh && (params.platformTop == "площадка" || params.topAnglePosition == "вертикальная рамка" || params.staircaseType == 'timber' || params.staircaseType == 'timber_stock')) {
		hasCustomLastTread = true;
		stairAmt += 1;
	}
	if(par.stairAmt) stairAmt = par.stairAmt;
	
	for(var i=0; i < stairAmt; i++){
		var rectPoint = copyPoint(basePoint);
		// Рассчитываем размер последней маленькой ступени(или верхней площадки)
		if((i == stairAmt - 1) && hasCustomLastTread && Math.abs(rot % Math.PI) == Math.PI / 2) {
			var turnParams = calcTurnParams(par.marshId);
			rectWidth = turnParams.topStepDelta;
			if (params.platformTop == "площадка") rectWidth = turnParams.turnLengthTop;
		}
		
		//учитываем что при отрисовке базовая точка в углу прямоугольника, а у марша она в центре нижней ступени
		if(rot == 0 || rot == Math.PI || rot == -Math.PI) rectPoint.x -= params.M / 2;
		if(rot == Math.PI / 2) rectPoint.x -= rectWidth;

		var rect = drawRect(rectPoint, rectWidth, rectHeight, par.draw).attr({
			fill: '#804000',//804000
			stroke: "#555",
			"stroke-width": 1,
		})
		rect.setClass("treads");
		basePoint = newPoint_xy(basePoint, stepX, stepY)
		group.push(rect);
	}
	
	// //Отрисовка последней урезанной ступени
	// if((params.platformTop != "площадка" && params.topAnglePosition == "вертикальная рамка") || params.staircaseType == 'timber') {
	// 	var treadSize = calcTurnParams(par.marshId).topStepDelta;
	// 	if(rot == 0 || rot == Math.PI || rot == -Math.PI) treadSize = params.M;
	// 	if(Math.abs(rot % Math.PI) == Math.PI / 2) basePoint = newPoint_xy(basePoint, stepX - treadSize, 0);
	// 	var rect = drawRect(basePoint, treadSize, rectHeight, par.draw).attr({
	// 		fill: "#804000",
	// 		stroke: "#555",
	// 		"stroke-width": 1,
	// 	})
	// 	rect.setClass("treads");
	// 	group.push(rect);
	// }
	
	return group;

}

/** функция отрисовывает поворот

	var turnPar = {
		turnId: i,
		rot: rot, - угол поворота в 3D с учетом вида (спереди, слева и т.п.)
		draw: draw, - ссылка на видовый экран
		}

*/
function drawTurn(par){
	var group = par.draw.set();
	par.botMarshId = 1;
	if(par.turnId == 2 && params.stairModel == "П-образная трехмаршевая") par.botMarshId = 2;
	var marshPar = getMarshParams(par.botMarshId);
	var turnPar = calcTurnParams(par.botMarshId);
	var turnPos = calcUnitsPos().turn[par.turnId];
	var type = marshPar.topTurn;

	var stepX = 0;
	var stepY = marshPar.h_topWnd
	
	var rectHeight = params.treadThickness;
	
	//задаем размеры деталей поворота в 3d

	var rects = []
	var turnPartAmt = 1;
	if(type == "площадка"){
		var rect = {
			depth: turnPar.turnLengthTop, //длина вдоль оси нижнего марша
			width: params.M, //ширина перпендикулярно оси нижнего марша
			mooveX: 0,
			mooveZ: 0,
		}
		if(params.stairModel == "П-образная с площадкой"){
			rect.width = params.M * 2 + params.marshDist;
		} 
		rects.push(rect);
	}
	if(type == "забег"){
		turnPartAmt = 3;
		//нижняя ступень
		var rect = {
			depth: params.M * 0.6, //длина вдоль оси нижнего марша
			width: params.M, //ширина перпендикулярно оси нижнего марша
			mooveX: params.M - params.M * 0.6 + turnPar.topMarshOffsetX,
			mooveZ: 0,
		}
		rects.push(rect);
		
		var rect = {
			depth: params.M,
			width: params.M,
			mooveX: 0,//turnPar.topMarshOffsetX,
			mooveZ: 0,
		}
		rects.push(rect);
		
		var rect = {
			depth: params.M,
			width: params.M * 0.6,
			mooveX: 0,//turnPar.topMarshOffsetX * turnFactor,
			mooveZ: turnPar.topMarshOffsetZ * turnFactor,
		}
		// console.log(turnPar.topMarshOffsetZ)
		
		if ((par.rot == 0 || par.rot == Math.PI) && turnFactor == 1) {
			rect.mooveZ = params.M - params.M * 0.6 + turnPar.topMarshOffsetZ + turnPar.topStepDelta;
		}
		rects.push(rect);
		
	}
	
	
	//итоговый угол поворота марша с учетом поворота модели
	var rot = turnPos.rot + par.rot;
	
	//ширина прямоугольника на 2d виде
	var rects2d = []
	for(var i=0; i<turnPartAmt; i++){
		//вид спереди
		if(rot == 0 || rot == Math.PI || rot == -Math.PI){
			rects2d[i] = {
				width: rects[i].width,
				mooveX: rects[i].mooveZ,
			}
		}
		//вид справа
		if(rot == -Math.PI / 2){
			rects2d[i] = {
				width: rects[i].depth,
				mooveX: rects[i].mooveX,
			}
		}
		//вид слева
		if(rot == Math.PI / 2){
			rects2d[i] = {
				width: rects[i].depth,
				mooveX: rects[i].mooveX,
			}
			
		}
	}
	
	//рассчитываем позицию начала поворота в 2D на основе позиции в 3D
	var turnPos2d = {
		x: turnPos.z * Math.cos(par.rot) - turnPos.x * Math.sin(par.rot),
		y: turnPos.y,
	}

	//учитываем что при отрисовке базовая точка в углу прямоугольника, а у поворота она в центре нижней ступени
	if(rot == 0 || rot == Math.PI || rot == -Math.PI) {
		turnPos2d.x -= params.M / 2;
		if(params.stairModel == "П-образная с площадкой" && params.turnSide == "левое"){
			turnPos2d.x -= params.M + params.marshDist;
		}
	}
	if(rot == Math.PI / 2) turnPos2d.x -= turnPar.turnLengthTop;
	
	
	//отрисовка массива прямоугольников (ступеней)
	
	for(var i=0; i<turnPartAmt; i++){
		var basePoint = newPoint_xy(turnPos2d, rects2d[i].mooveX, stepY * i);
		var rect = drawRect(basePoint, rects2d[i].width, rectHeight, par.draw).attr({
			fill: "#D66B00",
			stroke: "#555",
			"stroke-width": 1,
		})
		rect.setClass("treads");
		group.push(rect);
	}
	
	return group;
}

/** функция рассчитывает координаты в 3D и угол поворота относительно оси Y для всех маршей
и поворотов. Возвращает массив с этими данными. Использует данные из params
*/

function calcUnitsPos(){
	
	//массив позиций всех элементов
	var unitPos = {
		marsh: [],
		turn: [],
		topPlt: {},
	}; 
	//позиция конца текущего элемента
	var endPos = {
		x: 0,
		y: 0,
		z: 0,
		rot: 0,
	}
	
	//нижний марш
	
	var marshId = 1;
	unitPos.marsh[marshId] = copyPoint(endPos);
	endPos = calcMarshEndPoint(unitPos.marsh[marshId], unitPos.marsh[marshId].rot, marshId)
	
	//поворты, второй и третий марши
	
	if(params.stairModel != "Прямая"){
		
		//первый поворот
		
		var turnId = 1;
		var plusMarshDist = false;
		if ((params.stairModel == "П-образная трехмаршевая" && params.stairAmt2 == 0) || params.stairModel == "П-образная с забегом") {
				plusMarshDist = true;
			}
		unitPos.turn[turnId] = copyPoint(endPos);
		endPos = calcTurnEndPoint(unitPos.turn[turnId], unitPos.turn[turnId].rot, marshId, plusMarshDist, turnId);
		
		//второй марш
		
		if(params.stairModel == "П-образная трехмаршевая" || params.stairModel == "П-образная с забегом"){
			marshId = 2;
			unitPos.marsh[marshId] = copyPoint(endPos);
			endPos = calcMarshEndPoint(unitPos.marsh[marshId], unitPos.marsh[marshId].rot, marshId)
		}
		
		//второй поворот
		
		if (params.stairModel == "П-образная трехмаршевая" || params.stairModel == "П-образная с забегом") {
			var turnId = 2;
			plusMarshDist = false;
			unitPos.turn[turnId] = copyPoint(endPos);
			endPos = calcTurnEndPoint(unitPos.turn[turnId], unitPos.turn[turnId].rot, marshId, plusMarshDist, turnId);
		}
		
		//третий марш
		
		marshId = 3;
		unitPos.marsh[marshId] = copyPoint(endPos);
		endPos = calcMarshEndPoint(unitPos.marsh[marshId], unitPos.marsh[marshId].rot, marshId)
	}
	
	//верхняя площадка
	
	if(params.platformTop == "площадка"){
		unitPos.topPlt = copyPoint(endPos);
	}
	
	return unitPos;
} //end of calcUnitsPos

/**
	Функция приводит угол к виду (0, Math.PI / 2, -Math.PI / 2)
*/
function getMooveDir(ang){
	var mooveDir = 'none';
	if (ang == Math.PI * 2 || ang == 0) mooveDir = 'f';
	if (ang == -Math.PI || ang == Math.PI) mooveDir = 'b';
	if (ang == Math.PI / 2 || ang == -Math.PI * 1.5 ) mooveDir = 'l';
	if (ang == -Math.PI / 2 || ang == Math.PI * 1.5 ) mooveDir = 'r';
	return mooveDir;
}

/**
	Функция рассчитывает отступы в начале и конце марша(пример лт отступ 5 в начале марша)
*/
function calcDimensionOffsets(){
	//отступ в конце лестницы
	var offsetEnd = 0;
	if(params.topFlan == "есть") offsetEnd = 8;
	//учитываем наличие задней тетивы верхней площадки + 5мм зазор
	if(params.topAnglePosition == "над ступенью" && params.staircaseType == "mono") offsetEnd = 8;
	
	var offsetStart = 0;
	if (params.model == 'лт') offsetStart = 5;
	
	return {offsetStart: offsetStart, offsetEnd:offsetEnd};
}
