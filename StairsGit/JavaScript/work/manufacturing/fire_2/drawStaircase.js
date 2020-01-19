function drawStaircase(){
	
	//стандартные параметры лестницы
	var pltLength = params.pltLength; //длина верхней площадки лестницы
	var pltStringerWidth = 150; 
	var roofAngle = params.roofAngle / 180 * Math.PI;
	var pltRilingHeight = 1200;
	if(pltLength == 0) pltRilingHeight = 0;
	var pltRigelAmt = 2;
	var fenceArcMaxDist = 500;
	var botLegOffset = 500;
	dxfPrimitivesArr = [];
	
	
	var staircaseExtraHeight = (pltLength - params.wallDist + params.corniceWidth + pltStringerWidth) * Math.tan(roofAngle) + params.roofWallDist;
	if(params.roofType == "плоская") {
		staircaseExtraHeight = params.roofWallDist;
		}
	var pltPos = {
		x: - params.wallDist,
		y: params.roofHeight + staircaseExtraHeight,
		}
	var legLength = params.wallDist + params.legsExtraLength;	
	var legsDist = (params.stairCaseLength - params.topLegOffset - botLegOffset - pltStringerWidth) / (params.legAmt - 1);

	var pltRigelDist = pltRilingHeight / (pltRigelAmt + 1);

	
	var fenceLength = params.stairCaseLength + pltRilingHeight - params.railingOffset - 40;
	var fenceArcAmt = Math.ceil(fenceLength / fenceArcMaxDist) + 1;
	var fenceArcDist = fenceLength / (fenceArcAmt - 1);
		

/*построение лестницы*/	
	
var zeroPoint = {
	x: 3000,
	y: 200,
	}
	
scale = 0.2;
var imgHeight = params.roofHeight * scale + 2000*scale; //высота картинки в пикселях
if(params.roofType == "скатная") imgHeight += 500*scale;
var imgWidth = 6000*scale;
var canvasHeight = 800;

//параметры построения
var floorThk = 150;
var wallThk = params.roofWallThk;
var stringerProfSize = 60;

	

/*цвета*/
var rectStepColor = '#804000'; // Цвет заливки ступеней
var turnStepColor = '#D66B00'; // Цвет заливки площадки
var floorColor = '#C0C0C0'; // Цвет заливки перекрытий
var staircaseColor = "#000"


/*построение изображения*/
var canvas = document.getElementById("mainView"); 
canvas.width = imgWidth;
canvas.height = imgHeight;
var	mainView = canvas.getContext('2d');
	mainView.clearRect(0, 0, imgWidth, imgHeight);//Очищаем холст
	mainView.strokeStyle = "black";

	
var canvasParams={
	imgWidth: imgWidth,
	imgHeight: imgHeight,
	view: mainView,
	scale: 0.2,
	dimScale: imgHeight/canvasHeight,
	zeroPoint: zeroPoint,
	dxfBasePoint: {x:0, y:0},
	}
	
//пол
var p1 = {
	x: -2000,
	y: - floorThk,
	}
drawRect(p1, 4200, floorThk, floorColor, canvasParams)



//стена
var wallBasePoint = {
	x: 0,
	y: 0,
	}
drawRect(wallBasePoint, wallThk, params.roofHeight, rectStepColor, canvasParams)

//кровля

if(params.roofType == "плоская"){
	var p2 = newPoint_xy(wallBasePoint, wallThk, params.roofHeight - params.roofWallHeight);
	p2.y -= floorThk;
	drawRect(p2, 1500, floorThk, floorColor, canvasParams)

	//размер высота до парапета
	var p1 = newPoint_xy(wallBasePoint, 0, params.roofHeight);
	dem_vert_1(wallBasePoint, p1, -1700, canvasParams) 

	//размер высота парапета
	var p2 = newPoint_xy(p1, 0, -params.roofWallHeight);
	dem_vert_1(p2, p1, -1200, canvasParams);
	}

if(params.roofType == "скатная"){
	var p1=newPoint_xy(wallBasePoint, -params.corniceWidth, params.roofHeight);
	var roofLength = params.pltLength + 500;
	var p2=newPoint_xy(p1, roofLength, roofLength*Math.tan(roofAngle));
	var p3=newPoint_xy(p1, roofLength, 0);
	drawTriangle(p1, p2, p3, floorColor, canvasParams)
	
	//размер высота до парапета
	//var p1 = newPoint_xy(wallBasePoint, 0, params.roofHeight);
	dem_vert_1(wallBasePoint, p1, -1700, canvasParams) 
	
	}


/*лестница*/

//тетива
staircaseBasePoint = newPoint_xy(pltPos, -stringerProfSize, -params.stairCaseLength + pltStringerWidth)
drawRect(staircaseBasePoint, stringerProfSize, params.stairCaseLength + pltRilingHeight, staircaseColor, canvasParams)

//площадка
if(pltLength){
	drawRect(pltPos, pltLength, pltStringerWidth, staircaseColor, canvasParams)

	//ригели площадки
	var p1 =  newPoint_xy(pltPos, 0, pltRigelDist + pltStringerWidth);
	drawRect(p1, pltLength, 20, staircaseColor, canvasParams)
	p1.y += pltRigelDist;
	drawRect(p1, pltLength, 20, staircaseColor, canvasParams)

	//поручень площадки
	p1.y += pltRigelDist - 20;
	drawRect(p1, pltLength, 20, staircaseColor, canvasParams)

	//задняя секция
	var backStringerLength = pltRilingHeight + pltStringerWidth + params.roofWallHeight;
	if(params.roofType == "скатная") 
		backStringerLength = pltRilingHeight + pltStringerWidth + 50;
	var p2 = newPoint_xy(pltPos, pltLength, pltRilingHeight + pltStringerWidth - backStringerLength);
	if(params.pltRearFix == "кровля"){
		backStringerLength += params.roofWallDist;
		p2.y -= params.roofWallDist;
		
		}
	drawRect(p2, stringerProfSize, backStringerLength, staircaseColor, canvasParams)

	//нога задней секции площадки
	if(params.pltRearFix == "парапет") {
		var pltRearLegLength = params.pltLength - wallThk - params.wallDist;
		p0 = newPoint_xy(pltPos, wallThk + params.wallDist, -params.topLegOffset);
		drawRect(p0, pltRearLegLength, stringerProfSize, staircaseColor, canvasParams)
	}
}
//ноги лестницы
p0 = newPoint_xy(staircaseBasePoint, stringerProfSize, botLegOffset)
for(var i=0; i<params.legAmt; i++){	
	drawRect(p0, legLength, stringerProfSize, staircaseColor, canvasParams)
	if(i == 0){
		//размер высота до начала лестницы
		dem_vert_1(p0, wallBasePoint, -1000, canvasParams)
		var p11 = newPoint_xy(p0, 0, 0)
		}
	if(i == 1){
		//размер высота до начала лестницы
		dem_vert_1(p11, p0, -1000, canvasParams)
		}
		
	p0.y += legsDist;	 
	
	}
	





if(params.staircaseType == "П-1.2"){
//дуги ограждения

var railingBasePoint = newPoint_xy(staircaseBasePoint, -800, params.railingOffset)
p0 = newPoint_xy(railingBasePoint, 0, 0)

for(var i=0; i<fenceArcAmt; i++){
	drawRect(p0, 800, 40, staircaseColor, canvasParams);
	p0.y += fenceArcDist;
	}
	
//прогоны ограждения
p0 = newPoint_xy(railingBasePoint, 0, 0)
drawRect(p0, 20, fenceLength, staircaseColor, canvasParams)
p0.x += 150;
drawRect(p0, 20, fenceLength, staircaseColor, canvasParams)
p0.x += 300;
drawRect(p0, 20, fenceLength, staircaseColor, canvasParams)

//размер высота до начала ограждения
dem_vert_1(wallBasePoint, railingBasePoint, 1000, canvasParams) 
}

var demDist=500;
if(params.staircaseType == "П-1.2") demDist += 800;
//размер высота до начала лестницы
dem_vert_1(staircaseBasePoint, wallBasePoint, demDist, canvasParams) 

//размер длина лестницы
p0 = newPoint_xy(staircaseBasePoint, 0, params.stairCaseLength)
dem_vert_1(staircaseBasePoint, p0, demDist, canvasParams) 

//размер высота ограждения площадки
p1 = newPoint_xy(p0, 0, pltRilingHeight)
if(params.pltLength != 0) dem_vert_1(p0, p1, demDist, canvasParams) 

	





	
/*масштабируем картинки*/
document.getElementById('mainView').style.height = canvasHeight + "px";
}//end of drawStaircase



