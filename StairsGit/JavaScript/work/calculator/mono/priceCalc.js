var costMarkup = 1.3; //07.05 было 1.25;

function calculateCarcasPrice(){

//params.model = "лт"//временная адаптация монокосоура
var model = params.model;
var stairModel = params.stairModel;
var platformWidth_1 = params.platformWidth_1;
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
var metalPaint = params.metalPaint;
var timberPaint = params.timberPaint;
//var install = params.install;

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
var stringerLength = 0;

	
if (stairModel == "Прямая"){
	stringerArea = stringerStepLength1 * stringerStepWidth * stairAmt1 * 2;
	stringerLength += stringerStepLength1 * stairAmt1;

	}
if (stairModel == "Г-образная с площадкой"){
	//нижний марш
	stringerArea = stringerStepLength1 * stringerStepWidth * stairAmt1 * 2;
	stringerLength += stringerStepLength1 * stairAmt1;
	//площадка
	stringerArea  = stringerArea + M/1000 * 0.15 * 4;
	stringerLength += M/1000;
	//верхний марш
	stringerArea = stringerArea + stringerStepLength3 * stringerStepWidth * stairAmt3 * 2;
	stringerLength += stringerStepLength3 * stairAmt3;
	}
if (stairModel == "Г-образная с забегом"){
	//нижний марш
	stringerArea = stringerStepLength1 * stringerStepWidth * stairAmt1 * 2;
	stringerLength += stringerStepLength1 * stairAmt1;
	//забег
	stringerArea  = stringerArea + M/1000 * h3/1000 * 5;
	stringerLength += M/1000;
	//верхний марш
	stringerArea = stringerArea + stringerStepLength3 * stringerStepWidth * stairAmt3 * 2;
	stringerLength += stringerStepLength3 * stairAmt3;
	}
if (stairModel == "П-образная с площадкой"){
	//нижний марш
	stringerArea = stringerStepLength1 * stringerStepWidth * stairAmt1 * 2;
	stringerLength += stringerStepLength1 * stairAmt1;
	//площадка
	stringerArea  = stringerArea + platformLength_1/1000 * 2 * 0.15 + platformWidth_1/1000 * 4 * 0.15;
	stringerLength += M/1000 * 3;
	//верхний марш
	stringerArea = stringerArea + stringerStepLength3 * stringerStepWidth * stairAmt3 * 2;
	stringerLength += stringerStepLength3 * stairAmt3;
	}
if (stairModel == "П-образная с забегом"){
	//нижний марш
	stringerArea = stringerStepLength1 * stringerStepWidth * stairAmt1 * 2;
	stringerLength += stringerStepLength1 * stairAmt1;
	//забег
	stringerArea  = stringerArea + M/1000 * h3/1000 * 10;
	stringerLength += M/1000 * 3;
	//верхний марш
	stringerArea = stringerArea + stringerStepLength3 * stringerStepWidth * stairAmt3 * 2;
	stringerLength += stringerStepLength3 * stairAmt3;
	}
if (stairModel == "П-образная трехмаршевая"){
	//нижний марш
	stringerArea = stringerStepLength1 * stringerStepWidth * stairAmt1 * 2;
	stringerLength += stringerStepLength1 * stairAmt1;
	//повороты
	stringerArea  = stringerArea + M/1000 * h3/1000 * 10;
	stringerLength += M/1000 * 3;
	//средний марш
	stringerArea = stringerArea + stringerStepLength2 * stringerStepWidth * stairAmt2 * 2;
	stringerLength += stringerStepLength2 * stairAmt2;
	//верхний марш
	stringerArea = stringerArea + stringerStepLength3 * stringerStepWidth * stairAmt3 * 2;
	stringerLength += stringerStepLength3 * stairAmt3;
	}

/*верхняя площадка*/
if (platformTop == "площадка") {
	stringerArea += platformWidth_3*2*0.2/1000 + platformLength_3*2*0.2/1000;
	stringerLength += M/1000;
	}
	
var stringerMeterPrice = 4500; //цена тетивы из листа за м2	
if(params.model == "сварной") stringerMeterPrice *= 1.1
strigerPrice = stringerMeterPrice * stringerArea;
stringerWeight = stringerArea * 62.4;

if (params.stringerThickness > 150) strigerPrice = strigerPrice * 1.5;


if(params.model == "сварной"){
	materials.sheet4.amt = stringerLength * 0.3 * 2 + stringerLength * params.stringerThickness/1000 * 3;
	}
if(params.model == "труба"){
	materials.sheet4.amt = stringerLength * 0.2 * 2;
	materials.prof_100_100.amt = stringerLength;
	}

} //end of calcStringer()


/*** ДЕТАЛИ КАРКАСА ***/

var platformMetalListArea = 0;
var stairAngleAmt = 0;
var carcasAngleAmt = 0;
var baseFixAngleAmt = 0;
var frameAmt = 0;
var boltAmt = 0;
var treadPlatesAmt = 0;
var totalAnglePrice = 0; //общая цена всех гнутых уголков
var totalAnglePrice = 0;
var totalBoltPrice = 0;
var totalFramePrice = 0;



calcCarcasParts();

function calcCarcasParts(){

var boltPrice = 10;
var framePrice = 500;
var treadPlatePrice = 500;
if(params.model == "сварной")treadPlatePrice = 500;
if(params.model == "труба")treadPlatePrice = 500;




	

if (stairModel == "Прямая"){
	if(params.model == "сварной"){
		treadPlatesAmt += stairAmt1;
		}
	if(params.model == "труба"){
		treadPlatesAmt += stairAmt1;
		}
	}
if (stairModel == "Г-образная с площадкой"){
	if(params.model == "сварной"){
		treadPlatesAmt += stairAmt1 + 3 + stairAmt3;
		}
	if(params.model == "труба"){
		treadPlatesAmt += stairAmt1 + stairAmt3;
		frameAmt +=1;
		}
	}
if (stairModel == "Г-образная с забегом"){
	if(params.model == "сварной"){
		treadPlatesAmt += stairAmt1 + 3 + stairAmt3;
		}
	if(params.model == "труба"){
		treadPlatesAmt += stairAmt1 + 3 + stairAmt3;
		}
	}
if (stairModel == "П-образная с площадкой"){
	if(params.model == "сварной"){
		treadPlatesAmt += stairAmt1 + 6 + stairAmt3;
		}
	if(params.model == "труба"){
		treadPlatesAmt += stairAmt1 + stairAmt3;
		frameAmt +=2;
		}
	}
if (stairModel == "П-образная с забегом"){
	if(params.model == "сварной"){
		treadPlatesAmt += stairAmt1 + 6 + stairAmt3;
		}
	if(params.model == "труба"){
		treadPlatesAmt += stairAmt1 + 6 + stairAmt3;
		}
	}
if (stairModel == "П-образная трехмаршевая"){
	if(params.model == "сварной"){
		treadPlatesAmt += stairAmt1 + 3 + stairAmt2 + 3 + stairAmt3;
		}
	if(params.model == "труба"){
		treadPlatesAmt += stairAmt1 + stairAmt2 + stairAmt3;
		if (turnType_1 == "забег") treadPlatesAmt += 3;
		if (turnType_1 == "площадка") frameAmt +=1;
		if (turnType_2 == "забег") treadPlatesAmt += 3;
		if (turnType_2 == "площадка") frameAmt +=1;
		
		}
	}
	
if (platformTop == "площадка") {
	if(params.model == "сварной"){
		treadPlatesAmt += 3;
		}
	if(params.model == "труба"){
		frameAmt +=1;
		}
	}	

	if(params.model == "сварной"){
		boltAmt = treadPlatesAmt * 4;
		}
	if(params.model == "труба"){
		boltAmt = treadPlatesAmt * 6;
		}
		

totalAnglePrice = treadPlatesAmt * treadPlatePrice; 
totalBoltPrice = boltAmt * boltPrice;
totalFramePrice += framePrice * frameAmt;

//расход материала
if(params.model == "сварной"){
		materials.sheet8.amt += treadPlatesAmt * 0.3 * 0.6;
		}
	if(params.model == "труба"){
		materials.sheet2.amt += treadPlatesAmt * (0.3 * 0.6 + 0.2*0.6 + 0.3*0.2 * 2);
		materials.prof_60_30.amt += frameAmt * 0.6 * 4;
		}


} //end of calcCarcasParts()

/*Колонны*/

var columnTotalPrice = 0;
calcColumns();

function calcColumns(){

if (columnModel == "40х40") {
	columnTotalPrice = columnLength * 60 + columnAmt * 200;
	materials.prof_40_40.amt += columnLength;
	}
if (columnModel == "100x50") {
	columnTotalPrice = columnLength * 400 + columnAmt * 1000;
	materials.prof_100_50.amt += columnLength;
	}
if (columnModel == "100x100") {
	columnTotalPrice = columnLength * 600 + columnAmt * 1500;
	materials.prof_100_100.amt += columnLength;
	}


}// end of calcColumns()




/***  ПОКРАСКА МЕТАЛЛА   ***/

var metalPaintTotalPrice = 0; //общая стоимость покраски металла
calcMetalPainting();

function calcMetalPainting(){

if (metalPaint != "нет"){
	/*считаем покраску порошком как базовую*/
	//транспорт, загрузка камеры, упаковка
	metalPaintTotalPrice = 6000;
	//тетивы, площадки
	metalPaintTotalPrice += stringerArea * 700// + platformMetalListArea * 700;
	//гнутые уголки
	metalPaintTotalPrice += (stairAngleAmt + carcasAngleAmt + baseFixAngleAmt)*50;
	//рамки
	metalPaintTotalPrice += frameAmt * 100;
	//металлические ступени
	if (stairType == "рифленая сталь" || stairType == "лотки") 
		metalPaintTotalPrice += frameAmt * 200;	
	//покрытие площадок
	if (stairType == "рифленая сталь" || stairType == "лотки") 
		metalPaintTotalPrice += platformMetalListArea * 700;	
	//колонны
	if (columnModel == "40х40") metalPaintTotalPrice += columnLength * 50 + columnAmt * 100;
	if (columnModel == "100x50") metalPaintTotalPrice += columnLength * 150 + columnAmt * 300;
	if (columnModel == "100x100") metalPaintTotalPrice += columnLength * 250 + columnAmt * 500;
		
	if (metalPaint == "грунт") metalPaintTotalPrice = 5000;
	if (metalPaint == "автоэмаль") metalPaintTotalPrice = metalPaintTotalPrice * 3;
}
} // end of calcMetalPainting()



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

if(treadParams.treadsPanelName) materials[treadsPanelName].amt += treadParams.treadShieldArea;
if(treadParams.riserPanelName) materials[riserPanelName].amt += treadParams.riserShieldArea;

//наценка на сварной короб
var carcasCostFactor = 1;
if(params.model == "сварной") carcasCostFactor = 1.3;
if(params.isCarcas == "нет") carcasCostFactor = 0;

strigerPrice = strigerPrice * costMarkup * carcasCostFactor;
totalAnglePrice = totalAnglePrice * costMarkup * carcasCostFactor;
totalBoltPrice = totalBoltPrice * costMarkup * carcasCostFactor;
totalFramePrice = totalFramePrice * costMarkup * carcasCostFactor;
columnTotalPrice = columnTotalPrice * costMarkup * carcasCostFactor;
metalPaintTotalPrice = metalPaintTotalPrice * costMarkup * carcasCostFactor;

existFactor = 1; //ступени есть
if(params.stairType == "нет") existFactor = 0;
treadsTotalPrice = treadsTotalPrice * costMarkup * existFactor;
timberPaintPrice = timberPaintPrice * costMarkup * existFactor;


totalCostCarcas = strigerPrice + totalAnglePrice + totalBoltPrice + totalFramePrice + columnTotalPrice;


/*сохраняем себестоимость в глобальный объект*/

staircaseCost.stringer = strigerPrice;
staircaseCost.angles = totalAnglePrice;
staircaseCost.bolts = totalBoltPrice;
staircaseCost.frames = totalFramePrice;
staircaseCost.columns = columnTotalPrice;
staircaseCost.carcasMetalPaint = metalPaintTotalPrice * calcMetalPaintCostFactor(); //функция в файле priceLib
staircaseCost.treads = treadsTotalPrice;
staircaseCost.carcasTimberPaint = timberPaintPrice;
staircaseCost.carcas = totalCostCarcas;
staircaseCost.treadLigts = treadParams.treadLigtsCost

/*
/*** ОБЩАЯ СТОИМОСТЬ ЛЕСТНИЦЫ ***
var margin = 3 / costMarkup;
var marginPaint = 2 / costMarkup; //наценка на покраску

totalCarcasPrice = Math.round((strigerPrice + totalAnglePrice + totalBoltPrice + totalFramePrice + columnTotalPrice) * margin);
treadsTotalPrice = Math.round(treadsTotalPrice * margin);
metalPaintTotalPrice = Math.round(metalPaintTotalPrice * marginPaint);
timberPaintPrice = Math.round(timberPaintPrice * marginPaint);
var totalPrice_0 = Math.round(totalCarcasPrice + treadsTotalPrice);
var totalPrice_1 = Math.round(totalCarcasPrice + treadsTotalPrice + metalPaintTotalPrice + timberPaintPrice);
var totalInstalPrice = Math.round(totalPrice_1 * 0.2);

/*сохраняем цены в глобальный объект*
staircasePrice.carcas = totalCarcasPrice;
staircasePrice.treads = treadsTotalPrice;
staircasePrice.carcasMetalPaint = metalPaintTotalPrice;
staircasePrice.carcasTimberPaint = timberPaintPrice;
*/

}//Конец функции calculateCarcasPrice()





