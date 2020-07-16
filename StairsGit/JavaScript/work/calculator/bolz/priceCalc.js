var costMarkup = 1.3; //07.05 было 1.25;
var priceObj = {};

function calculateCarcasPrice(){

//тетивы
var stringerMeterPrice = 4000; //цена тетивы из листа за м2
if(params.stringerModel == "короб") stringerMeterPrice = 10000;

var stringerArea = getPartPropVal('stringer', 'area') + getPartPropVal('bridge', 'area') + getPartPropVal('pltStringer', 'area')

strigerPrice = stringerMeterPrice * stringerArea;

if(params.isCarcas != "нет"){
	materials.sheet8.amt += stringerArea;
}

//уголки
var anglePrice = 60;
var angleAmt = getPartAmt("carcasAngle") + getPartAmt("treadAngle") + getPartAmt("adjustableLeg");
var totalAnglePrice = anglePrice * angleAmt;

//болты
var boltPrice = 10; //комплект болт, гайка, шайба
if(params.boltHead == "countersunk") boltPrice = 20;
if(params.isPlasticCaps == "есть") boltPrice += 5;
var boltAmt = 
	getPartAmt("treadFrame") * 4 + 
	getPartAmt("carcasAngle") * 4 + 
	getPartAmt("treadAngle") * 2 + 
	getPartAmt("wndFrame1") * 4 + 
	getPartAmt("wndFrame2") * 4 + 
	getPartAmt("wndFrame3") * 4 + 
	getPartAmt("vertFrame") * 4;

if (params.stairType == "рифленая сталь" || 
	params.stairType == "лотки" || 
	params.stairType == "рифленый алюминий" || 
	params.stairType == "пресснастил"
	) {
		boltAmt += getPartAmt("tread") * 4;
	}

	

var totalBoltPrice = boltPrice * boltAmt;

//рамки
var framePrice = 400;

var totalFramePrice = framePrice * (getPartAmt("treadFrame") + getPartAmt("vertFrame"));

var wndFramePrice = 1000;
if(params.wndFrames == "профиль") wndFramePrice = 2000;
totalFramePrice += wndFramePrice * (getPartAmt("wndFrame1") + getPartAmt("wndFrame2") + getPartAmt("wndFrame3"))

var totalFrameAmt = 
	getPartAmt("treadFrame") + 
	getPartAmt("vertFrame") + 
	getPartAmt("wndFrame1") + 
	getPartAmt("wndFrame2") + 
	getPartAmt("wndFrame3");

if(params.isCarcas != "нет"){
	materials.sheet4.amt += getPartPropVal('wndFrame1', 'area') + getPartPropVal('wndFrame2', 'area') + getPartPropVal('wndFrame3', 'area');
}	

//Колонны
var colAmt = getPartAmt("column");
var colSumLen = getPartPropVal('column', 'sumLength') / 1000;
var columnTotalPrice = 0;

if (params.columnModel == "40х40") {
	columnTotalPrice = colSumLen * 60 + colAmt * 200;
	}
if (params.columnModel == "100x50") {
	columnTotalPrice = colSumLen * 400 + colAmt * 1000;
	}
if (params.columnModel == "100x100") {
	columnTotalPrice = colSumLen * 600 + colAmt * 1500;
	}
	

//больцы

var totalBolzPrice = 1000 * getPartAmt("bolz");


/***  ПОКРАСКА МЕТАЛЛА   ***/

var metalPaintTotalPrice = 0; //общая стоимость покраски металла
calcMetalPainting();

function calcMetalPainting(){

if (params.metalPaint != "нет" && params.metalPaint != "не указано"){

	//транспорт, загрузка камеры, упаковка
	metalPaintTotalPrice = 6000;
	//тетивы, площадки
	metalPaintTotalPrice += stringerArea * 700;
	//гнутые уголки
	metalPaintTotalPrice += angleAmt * 50;
	//рамки
	metalPaintTotalPrice += totalFrameAmt * 100;
	
	
	//металлические ступени

	if (params.stairType == "рифленая сталь" || params.stairType == "лотки") {
		metalPaintTotalPrice += (getPartPropVal('tread', 'area') + getPartPropVal('wndTread', 'area')) * 700;	
	}
	
	//колонны
	if (params.columnModel == "40х40") metalPaintTotalPrice += colSumLen * 50 + colAmt * 100;
	if (params.columnModel == "100x50") metalPaintTotalPrice += colSumLen * 150 + colAmt * 300;
	if (params.columnModel == "100x100") metalPaintTotalPrice += colSumLen * 250 + colAmt * 500;
		
	if (params.metalPaint == "грунт") metalPaintTotalPrice = 5000;
	if (params.metalPaint == "автоэмаль") metalPaintTotalPrice = metalPaintTotalPrice * 3;
	}
} // end of calcMetalPainting()



/*** СТОИМОСТЬ СТУПЕНЕЙ ***/

function calcTreads(){}; //пустая функция для навигации

var treadParams = calcTreadParams(); //функция в файле priceLib.js

var treadsTotalPrice = treadParams.treadsTotalPrice;
var timberPaintPrice = treadParams.timberPaintPrice;
var timberPaintedArea = treadParams.paintedArea;
var treadsPanelName = treadParams.treadsPanelName;
var riserPanelName = treadParams.riserPanelName;
var timberPaintMeterPrice = treadParams.timberPaintMeterPrice;
var treadMeterPrice = treadParams.treadMeterPrice;

if(params.stairType != "нет"){
	if(treadParams.treadsPanelName) materials[treadsPanelName].amt += treadParams.treadShieldArea;
	if(treadParams.riserPanelName) materials[riserPanelName].amt += treadParams.riserShieldArea;
}

var existFactor = 1; //каркас есть
if(params.isCarcas == "нет") existFactor = 0;
strigerPrice = strigerPrice * costMarkup * existFactor;
totalAnglePrice = totalAnglePrice * costMarkup * existFactor;
totalBoltPrice = totalBoltPrice * costMarkup * existFactor;
totalBolzPrice = totalBolzPrice * costMarkup * existFactor;
totalFramePrice = totalFramePrice * costMarkup * existFactor;
columnTotalPrice = columnTotalPrice * costMarkup * existFactor;
metalPaintTotalPrice = metalPaintTotalPrice * costMarkup * existFactor;

existFactor = 1; //ступени есть
if(params.stairType == "нет") existFactor = 0;
treadsTotalPrice = treadsTotalPrice * costMarkup * existFactor;
timberPaintPrice = timberPaintPrice * costMarkup * existFactor;


totalCostCarcas = strigerPrice + totalAnglePrice + totalBoltPrice + totalBolzPrice + totalFramePrice + columnTotalPrice;


/*сохраняем себестоимость в глобальный объект*/

staircaseCost.stringer = strigerPrice;
staircaseCost.angles = totalAnglePrice;
staircaseCost.bolts = totalBoltPrice;
staircaseCost.bolz = totalBolzPrice;
staircaseCost.frames = totalFramePrice;
staircaseCost.columns = columnTotalPrice;
staircaseCost.carcasMetalPaint = metalPaintTotalPrice * calcMetalPaintCostFactor(); //функция в файле priceLib
staircaseCost.treads = treadsTotalPrice;
staircaseCost.carcasTimberPaint = timberPaintPrice;
staircaseCost.carcas = totalCostCarcas
}//Конец функции calculateCarcasPrice()
