//var costMarkup = 1.3; //07.05.20;
var costMarkup = 1.56; //11.01.21

function calculateCarcasPrice_stock(){

var model = params.model;
var stairModel = params.stairModel;
var platformWidth_1 = params.platformWidth_1;
var platformLength_1 = params.platformLength_1;
var turnType_1 = params.turnType_1;
var turnType_2 = params.turnType_2;
var platformTop = params.platformTop;
var middlePltLength = params.middlePltLength;
var middlePltWidth = params.middlePltWidth;
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
var stringerThickness = 8;

//ширина верхней площадки равна ширине верхнего марша
var platformWidth_3 = params.platformWidth_3;
if(platformTop == "площадка") platformWidth_3 = M;

var nacenka = 1.45;

//адаптация расчета с сайта lp к нормальным именам переменных
var stairWidth = params.M;
var platform = "нет";
if(platformTop == "площадка") platform = "есть"
var platformLength = params.platformLength_3;
var railingSide = "одна сторона";
if(params.railingSide_1 == "нет") railingSide = "без ограждений";
if(params.railingSide_1 == "две") railingSide = "с двух сторон";
var handrailType = "крашеные";
var rackType = "крашеные";
var rigelAmt = params.rigelAmt;
var extraRailing = 0;

var stairAmt = params.stairAmt1;
if (platform == "есть") stairAmt += 1;

/*стоимость тетив*/
var stringerPrice = 0;
if (stairAmt == 2) stringerPrice = 3448 - 64;
if (stairAmt == 3) stringerPrice = 4154;
if (stairAmt == 4) stringerPrice = 4972;
if (stairAmt == 5) stringerPrice = 5784;
if (stairAmt == 6) stringerPrice = 6588;
stringerPrice = stringerPrice * nacenka;

//учитываем промежуточные тетивы
var stringerAmt = Math.ceil(stairWidth/1050) + 1;
if (stringerAmt == 1) stringerAmt = 2;

stringerPrice = stringerPrice * stringerAmt;

/*добавляем стоимость тетив на площадку*/
if (platform == "есть") {
	var platformStringerPrice = 0;
	if (platformLength == 600) platformStringerPrice = 1150;
	if (platformLength == 900) platformStringerPrice = 1650;
	if (platformLength == 1200) platformStringerPrice = 2350;
	platformStringerPrice = platformStringerPrice * nacenka;
	stringerPrice = stringerPrice + platformStringerPrice * stringerAmt;	
	}

stringerPrice = Math.round(stringerPrice);
 
/*cтоимость рамок и ступеней*/
var framePrice_600 = 914;
var framePrice_800 = 1062;
var framePrice_1000 = 1182;
var dpcPrice_600 = 540;
var dpcPrice_800 = 720;
var dpcPrice_1000 = 900;

//кол-во рамок на одну ступень
var frameAmt_600 = params.frameAmt_600;
var frameAmt_800 = params.frameAmt_800;
var frameAmt_1000 = params.frameAmt_1000; 

if (platform == "нет"){
	frameAmt_600 = frameAmt_600 * stairAmt;
	frameAmt_800 = frameAmt_800 * stairAmt;
	frameAmt_1000 = frameAmt_1000 * stairAmt;	
	}
if (platform == "есть") {
	var pltFrameAmt = 1; //одна рамка площадки уже посчитана в марше 
	if (platformLength == 900) pltFrameAmt = 2;
	if (platformLength == 1200) pltFrameAmt = 3;	
	frameAmt_600 = frameAmt_600 * (stairAmt + pltFrameAmt);
	frameAmt_800 = frameAmt_800 * (stairAmt + pltFrameAmt);
	frameAmt_1000 = frameAmt_1000 * (stairAmt + pltFrameAmt);
	}
	
var framePrice = frameAmt_600 * framePrice_600 + frameAmt_800 * framePrice_800 + frameAmt_1000 * framePrice_1000;

var dpcPrice = frameAmt_600 * dpcPrice_600 + frameAmt_800 * dpcPrice_800 + frameAmt_1000 * dpcPrice_1000;
if(params.stairType == "нет") dpcPrice = 0;



//колонны верхней площадки
var columnUnitPrice = 400; //цена одной колонны
var columnMeterPrice = 120; //поправка за метр
var columnAmt = 0;
var columnPrice = 0;
if(params.topPltColumns == "колонны" && params.platformTop != "нет"){
	if(params.isColumnTop1) columnAmt += 1;
	if(params.isColumnTop2) columnAmt += 1;
	if(params.isColumnTop3) columnAmt += 1;
	if(params.isColumnTop4) columnAmt += 1;
	var colLength = (stairAmt + 1) * params.h1;
	columnLength = columnAmt * colLength/1000;
	columnPrice = columnLength * columnMeterPrice + columnAmt * columnUnitPrice;
	}


//добор верхней площадки
var pltExtenderPrice = 0;
if(params.pltExtenderSide != "нет" && params.platformTop != "нет") pltExtenderPrice = 1000;

/*учитываем наценку*/
framePrice = Math.round(framePrice * nacenka);
dpcPrice = Math.round(dpcPrice * nacenka);
columnPrice = Math.round(columnPrice * nacenka);
pltExtenderPrice = Math.round(pltExtenderPrice * nacenka);

var totalCarcasPrice = stringerPrice + framePrice + columnPrice + pltExtenderPrice;
var treadsTotalPrice = dpcPrice;

//сохраняем себестоимость в глобальный объект
var costFactor = 0.7 / nacenka;
var totalCostCarcas = (stringerPrice + framePrice + columnPrice + pltExtenderPrice) * costFactor;
staircaseCost.stringer = stringerPrice * costFactor;
staircaseCost.angles = 0;
staircaseCost.bolts = 0;
staircaseCost.frames = framePrice * costFactor;
staircaseCost.columns = columnPrice;
staircaseCost.carcasMetalPaint = 0;
staircaseCost.treads = dpcPrice * costFactor; 
staircaseCost.carcasTimberPaint = 0;
staircaseCost.carcas = totalCostCarcas;

//сохраняем цену в глобальный объект
priceObj['carcas'].discountPrice = totalCarcasPrice;
priceObj['treads'].discountPrice = treadsTotalPrice;
priceObj['carcasMetalPaint'].discountPrice = 0;
priceObj['carcasTimberPaint'].discountPrice = 0;


}//Конец функции calculateCarcasPrice_stock()


function calculateRailingPrice_stock(){

/*обнуляем счетчики*/
railingParams.handrailAmt = 0;
railingParams.rigelAmt = 0;
railingParams.rackAmt = 0;
railingParams.balAmt1 = 0;
railingParams.balAmt2 = 0;
railingParams.glassAmt = 0;
railingParams.glassArea = 0;
railingParams.handrailLength = []; // массив длин поручней
railingParams.rigelLength = []; //массив длин ригелей


var nacenka = 1.45;

//Задаем локальные переменные
var stairAmt = params.stairAmt1;
if (params.platformTop == "площадка") stairAmt += 1;

var handrailType = "крашеные";
if(params.handrail == "Ф50 нерж." || params.handrail == "ПВХ") handrailType = "нержавейка";
var rackType = "крашеные";
if (params.banisterMaterial == "40х40 нерж.") rackType = "нержавейка";
var stairWidth = params.M;
var platform = "нет";
if(params.platformTop == "площадка") platform = "есть"
var platformLength = params.platformLength_3;
var railingSide = "одна сторона";
if(params.railingSide_1 == "нет") railingSide = "без ограждений";
if(params.railingSide_1 == "две") railingSide = "с двух сторон";
var rigelAmt = params.rigelAmt;



var stepLength = 0.32; //длина поручня на одну ступень с учетом запаса

if (handrailType == "крашеные") {
	var handrailMeterPrice = 480;
	var rigelMeterPrice = 316;	
	}
if (handrailType == "нержавейка") {
	var handrailMeterPrice = 1500;
	var rigelMeterPrice = 550;
	}
	

var rackPrice = 920;
if(rackType == "нержавейка") rackPrice = 2150;
	
//ограждения на лестнице	
	handrailPrice = handrailMeterPrice * stepLength * stairAmt;
	rigelPrice = rigelMeterPrice * stepLength * stairAmt * rigelAmt;
	var rackAmt = 2;
	if (stairAmt > 5) rackAmt = 3;
	rackPrice = rackPrice * rackAmt;
	
	totalRailingPrice = handrailPrice + rigelPrice + rackPrice;
	//учет стороны ограждения
	if(railingSide == "с двух сторон") totalRailingPrice = totalRailingPrice * 2;
	if(railingSide == "без ограждений") totalRailingPrice = 0;

//ограждения на площадке
	if (platform == "есть") {
		var pltRailingPrice = 0;
		if(params.topPltRailing_3){
			handrailPrice = handrailMeterPrice * platformLength/1000;
			rigelPrice = rigelMeterPrice * platformLength/1000 * rigelAmt;
			rackPrice = rackPrice * 1;
			pltRailingPrice += handrailPrice + rigelPrice + rackPrice;
			}
		if(params.topPltRailing_4){
			handrailPrice = handrailMeterPrice * platformLength/1000;
			rigelPrice = rigelMeterPrice * platformLength/1000 * rigelAmt;
			rackPrice = rackPrice * 1;
			pltRailingPrice += handrailPrice + rigelPrice + rackPrice;
			}
		if(params.topPltRailing_5){
			handrailPrice = handrailMeterPrice * params.M/1000;
			rigelPrice = rigelMeterPrice * params.M/1000;
			rackPrice = rackPrice * (Math.round(params.M/1000) + 1) * rigelAmt;
			pltRailingPrice += handrailPrice + rigelPrice + rackPrice;
			}
		totalRailingPrice += pltRailingPrice;
		}
	totalRailingPrice = totalRailingPrice * nacenka;
	
	//сохраняем рассчитанные параметры в глобальный объект
	priceObj['railing'].discountPrice = totalRailingPrice
	staircaseCost.railing = totalRailingPrice * 0.7 / nacenka;
	


}//Конец функции calculateRailingPrice_stock()

