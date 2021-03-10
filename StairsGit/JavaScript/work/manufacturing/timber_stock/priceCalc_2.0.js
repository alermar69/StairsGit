var costMarkup = 1.0;

function calculateCarcasPrice(){

var model = params.model;
var stairModel = params.stairModel;
var marshDist = params.marshDist;
var platformLength_1 = params.platformLength_1;
var turnType_1 = params.turnType_1;
var turnType_2 = params.turnType_2;
var platformTop = params.platformTop;
var platformLength_3 = params.platformLength_3;
var platformTopColumn = params.platformTopColumn;
var topFlan = params.topFlan;
var columnModel = params.columnModel;
var columnAmt = params.columnAmt;
var columnLength = params.columnLength;
var M = params.M;
var stringerType = params.stringerType;
var stairType = params.stairType;
var stringerMaterial = params.stringerMaterial;
var riserType = params.riserType;
var stairFrame = params.stairFrame;
var stairAmt1 = params.stairAmt1;
var h1 = params.h1;
var b1 = params.b1;
var a1 = params.a1;
var stairAmt2 = params.stairAmt2; 
var h2 = params.h2;
var b2 = params.b2;
var a2 = params.a2;
var stairAmt3 = params.stairAmt3;
var h3 = params.h3;
var b3 = params.b3;
var a3 = params.a3;
var fixType1 = params.fixType1;
var fixAmt1 = params.fixAmt1;
var fixType2 = params.fixType2;
var fixAmt2 = params.fixAmt2;
var fixType3 = params.fixType3;
var fixAmt3 = params.fixAmt3;
var bottomAngleType = params.bottomAngleType;
//var metalPaint = params.metalPaint;
var timberPaint = params.timberPaint;
//var install = params.install;

var platformWidth_1 = 2*M + marshDist;

//ширина верхней площадки равна ширине верхнего марша
var platformWidth_3 = M;

/*** ТЕТИВЫ ***/
var stringerArea = 0; //общая площадь всех тетив
var strigerPrice = 0; //общая стоимость косоуров
var stringerWeight = 0; //общий вес косоуров

calcStringer();

function calcStringer(){
var stringerStepLength1 = Math.sqrt(h1*h1 + b1*b1)/1000;
var stringerStepLength2 = Math.sqrt(h2*h2 + b2*b2)/1000;
var stringerStepLength3 = Math.sqrt(h3*h3 + b3*b3)/1000;
var	stringerStepWidth = 0.3;
console.log(partsAmt)

/*расчет цены материлала*/
	
if (stairModel == "Прямая"){
	stringerArea = stringerStepLength1 * stringerStepWidth * stairAmt1 * 2;
	}
if (stairModel == "Г-образная с площадкой"){
	//нижний марш
	stringerArea = stringerStepLength1 * stringerStepWidth * stairAmt1 * 2;
	//площадка
	stringerArea  = stringerArea + M/1000 * 0.15 * 4;
	//верхний марш
	stringerArea = stringerArea + stringerStepLength3 * stringerStepWidth * stairAmt3 * 2;
	}
if (stairModel == "Г-образная с забегом"){
	//нижний марш
	stringerArea = stringerStepLength1 * stringerStepWidth * stairAmt1 * 2;
	//забег
	stringerArea  = stringerArea + M/1000 * h3/1000 * 5;
	//верхний марш
	stringerArea = stringerArea + stringerStepLength3 * stringerStepWidth * stairAmt3 * 2;
	}
if (stairModel == "П-образная с площадкой"){
	//нижний марш
	stringerArea = stringerStepLength1 * stringerStepWidth * stairAmt1 * 2;
	
	//площадка
	stringerArea  = stringerArea + platformLength_1/1000 * 2 * 0.15 + platformWidth_1/1000 * 4 * 0.15;
	//console.log(platformWidth_1)
	//верхний марш
	stringerArea = stringerArea + stringerStepLength3 * stringerStepWidth * stairAmt3 * 2;
	
	}
if (stairModel == "П-образная с забегом"){
	//нижний марш
	stringerArea = stringerStepLength1 * stringerStepWidth * stairAmt1 * 2;
	//забег
	stringerArea  = stringerArea + M/1000 * h3/1000 * 10;
	//верхний марш
	stringerArea = stringerArea + stringerStepLength3 * stringerStepWidth * stairAmt3 * 2;
	}
if (stairModel == "П-образная трехмаршевая"){
	//нижний марш
	stringerArea = stringerStepLength1 * stringerStepWidth * stairAmt1 * 2;
	//повороты
	stringerArea  = stringerArea + M/1000 * h3/1000 * 10;
	//средний марш
	stringerArea = stringerArea + stringerStepLength2 * stringerStepWidth * stairAmt2 * 2;
	//верхний марш
	stringerArea = stringerArea + stringerStepLength3 * stringerStepWidth * stairAmt3 * 2;
	}

/*верхняя площадка*/
if (platformTop == "площадка") stringerArea += platformWidth_3*2*0.2/1000 + platformLength_3*2*0.2/1000;
	

if (M > 1200) strigerPrice = strigerPrice * 1.5; //добавляется третий косоур

	var carcasPlateName = calcTimberParams(stringerMaterial).treadsPanelName;
	var stringerMeterPrice = calcTimberParams(stringerMaterial).m2Price_40;
	
	//учитываем обрезки
	stringerMeterPrice = stringerMeterPrice * 1.15;
	if (model == "косоуры") stringerArea = stringerArea * 1.1;
	strigerPrice = stringerMeterPrice * stringerArea;
		
	/*цена работы*/
	
	var cncCarcasPartsAmt = 0; //кол-во сложных деталей каркаса	
	if (stairModel == "Прямая") cncCarcasPartsAmt = 4; //вторые 4 это разделение длинных маршей
	if (stairModel == "Г-образная с площадкой") cncCarcasPartsAmt = 4;
	if (stairModel == "Г-образная с забегом") cncCarcasPartsAmt = 6+3;
	if (stairModel == "П-образная с площадкой") cncCarcasPartsAmt = 4;
	if (stairModel == "П-образная с забегом") cncCarcasPartsAmt = 8+6;
	if (stairModel == "П-образная трехмаршевая") cncCarcasPartsAmt = 10+6;
	
	var cncPartCost = 800; //себестоимость изготовления одной детали каркаса (только работа)
	if (riserType == "есть") cncPartCost = cncPartCost * 1.2;
	var carcasWorkCost = cncCarcasPartsAmt * cncPartCost;
	
	strigerPrice += carcasWorkCost;
	
	
	totalAnglePrice = 0;
	totalBoltPrice = 300;
	totalFramePrice = 0;
	columtTotalPrice = 0;
	metalPaintTotalPrice = 0;

} //end of calcStringer()

/*** СТОИМОСТЬ СТУПЕНЕЙ ***/

function calcTreads(){}; //пустая функция для навигации

var treadParams = calcTreadParams();

var treadsTotalPrice = treadParams.treadsTotalPrice;
var timberPaintPrice = treadParams.timberPaintPrice;
var timberPaintedArea = treadParams.paintedArea;
var treadsPanelName = treadParams.treadsPanelName;
var riserPanelName = treadParams.riserPanelName;
var timberPaintMeterPrice = treadParams.timberPaintMeterPrice;
var treadMeterPrice = treadParams.treadMeterPrice;
	
	/*плинтус*/
	
function calcSkirting(){}; //пустая функция для навигации

if(model == "косоуры" && riserType == "есть"){
	var skirtingStepPrice = treadMeterPrice/2 * 0.06 * 0.5 + 100;
	var skirtingAmt = 0;
	//нижний марш
	if(params.skirting_1 != "нет"){
		skirtingAmt += stairAmt1;
		if(params.skirting_1 == "две") skirtingAmt += stairAmt1;
		}
	//верхний марш
	if (stairModel != "Прямая"){
		if(params.skirting_3 != "нет"){
			skirtingAmt += stairAmt3;
			if(params.skirting_3 == "две") skirtingAmt += stairAmt3;
			}
		}
	//средний марш
	if (stairModel == "П-образная трехмаршевая"){
		if(params.skirting_2 != "нет"){
			skirtingAmt += stairAmt3;
			if(params.skirting_2 == "две") skirtingAmt += stairAmt3;
			}
		}
		
	//внешняя сторона забега
	if (stairModel == "П-образная с забегом" && params.skirting_wnd != "нет") {
		skirtingAmt += 4;
		}
	//внешняя сторона площадки
	if (stairModel == "П-образная с площадкой" && params.skirting_plt != "нет"){
		skirtingAmt += 4;
		}
		
	var skirtingPrice = skirtingStepPrice * skirtingAmt;
	
	treadsTotalPrice += skirtingPrice;
	timberPaintedArea += 0.08 * skirtingAmt;
	}

//end of calcSkirting
	



strigerPrice = strigerPrice * costMarkup;
totalAnglePrice = totalAnglePrice * costMarkup;
totalBoltPrice = totalBoltPrice * costMarkup;
totalFramePrice = 0;
columnTotalPrice = 0 * costMarkup;
metalPaintTotalPrice = metalPaintTotalPrice * costMarkup;
treadsTotalPrice = treadsTotalPrice * costMarkup;
timberPaintPrice = timberPaintPrice * costMarkup;


totalCostCarcas = strigerPrice + totalAnglePrice + totalBoltPrice + totalFramePrice + columnTotalPrice;


/*сохраняем себестоимость в глобальный объект*/

staircaseCost.stringer = strigerPrice;
staircaseCost.angles = totalAnglePrice;
staircaseCost.bolts = totalBoltPrice;
staircaseCost.frames = totalFramePrice;
staircaseCost.columns = columnTotalPrice;
staircaseCost.carcasMetalPaint = metalPaintTotalPrice;
staircaseCost.treads = treadsTotalPrice;
staircaseCost.carcasTimberPaint = timberPaintPrice;
staircaseCost.carcas = totalCostCarcas;
}//Конец функции calculateCarcasPrice()


