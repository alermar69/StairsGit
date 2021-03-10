var costMarkup=1.15;

function calculatePrice(){

var model = params.model;
var stairModel = params.stairModel;
var stairAmt1 = params.stairAmt1;
var stairAmt2 = params.stairAmt2;
var stairAmt3 = params.stairAmt3;
var turnType_1 = params.turnType_1;
var turnType_2 = params.turnType_2;
var bolzSide1 = params.bolzSide1;
var bolzSide2 = params.bolzSide2;
var bolzSide3 = params.bolzSide3;
var stairType = params.stairType;
var timberPaint = params.timberPaint;
var railingSide_1 = params.railingSide_1;
var railingSide_2 = params.railingSide_2;
var railingSide_3 = params.railingSide_3;


/*** РАСЧЕТ КОЛИЧЕСТВА ЭЛЕМЕНТОВ ***/


if(model == "Стамет"){


// модули
var modAmt = 0; //кол-во модулей ступеней
var startModAmt = 1; //кол-во стартовых модулей (2шт в комплекте)
var turnModAmt = 0; //кол-во поворотных модулей
// ступени
var treadAmt = 0;
var platformAmt = 0;
var turnTreadAmt1 = 0; //первая и третья забежная ступень
var turnTreadAmt2 = 0; //вторая забежная ступень
// больцы
var bolzAmt = 0;


//нижний марш
modAmt += stairAmt1 - 1; //учитываем стартовый модуль
treadAmt += stairAmt1;
if(bolzSide1 != "нет") bolzAmt += stairAmt1;
if(bolzSide1 == "две стороны") bolzAmt += stairAmt1;

if (stairModel == "Г-образная с площадкой"){
	turnModAmt += 2;
	platformAmt += 1;
	if(bolzSide1 != "нет") bolzAmt += 1;
	if(bolzSide1 == "две стороны") bolzAmt += 1;
	}
if (stairModel == "Г-образная с забегом"){
	modAmt += 3;
	turnTreadAmt1 += 2;
	turnTreadAmt2 += 1;
	if(bolzSide1 != "нет") bolzAmt += 3;
	if(bolzSide1 == "две стороны") bolzAmt += 3;
	}

if (stairModel == "П-образная с забегом"){
	modAmt += 6;
	turnTreadAmt1 += 4;
	turnTreadAmt2 += 2;
	if(bolzSide1 != "нет") bolzAmt += 6;
	if(bolzSide1 == "две стороны") bolzAmt += 6;
	}
if (stairModel == "П-образная трехмаршевая"){
	if(turnType_1 == "площадка") {
		turnModAmt += 2;
		platformAmt += 1;
		if(bolzSide1 != "нет") bolzAmt += 1;
		if(bolzSide1 == "две стороны") bolzAmt += 1;
		}
	if(turnType_1 == "забег") {
		modAmt += 3;
		turnTreadAmt1 += 2;
		turnTreadAmt2 += 1;
		if(bolzSide1 != "нет") bolzAmt += 3;
		if(bolzSide1 == "две стороны") bolzAmt += 3;
		}
	}
	
//средний марш
if (stairModel == "П-образная трехмаршевая"){
	modAmt += stairAmt2;
	treadAmt += stairAmt2;
	if(bolzSide1 != "нет") bolzAmt += stairAmt2;
	if(bolzSide1 == "две стороны") bolzAmt += stairAmt2;
	if(turnType_2 == "площадка") {
		turnModAmt += 2;
		platformAmt += 1;
		if(bolzSide1 != "нет") bolzAmt += 1;
		if(bolzSide1 == "две стороны") bolzAmt += 1;
		}
	if(turnType_2 == "забег") {
		modAmt += 3;
		turnTreadAmt1 += 2;
		turnTreadAmt2 += 1;
		if(bolzSide1 != "нет") bolzAmt += 3;
		if(bolzSide1 == "две стороны") bolzAmt += 3;		
		}
	}

//верхний марш
if (stairModel != "Прямая"){
	modAmt += stairAmt3 - 1;
	treadAmt += stairAmt3;
	if(bolzSide1 != "нет") bolzAmt += stairAmt3;
	if(bolzSide1 == "две стороны") bolzAmt += stairAmt3;
	}

/*опоры*/
var columnAmt1 = 0; //кол-во столбов 1м
var columnAmt2 = 0; //кол-во столбов 2м
var sideFixAmt = 0; //кол-во креплений в стену

var totalRiseAmt = treadAmt + platformAmt + turnTreadAmt1 + turnTreadAmt2;

if(totalRiseAmt > 5) columnAmt1 += 1;
if(totalRiseAmt > 9) columnAmt2 += 1;
if(totalRiseAmt > 13) sideFixAmt += 1;

if (stairModel != "Прямая"){
	if(stairAmt1 < 4) columnAmt1 += 1;
	else columnAmt2 += 1;
}

if (stairModel == "П-образная с забегом") columnAmt2 += 1;
if (stairModel == "П-образная трехмаршевая") columnAmt2 += 1;


/*ограждения*/


var longBalAmt = 0;
var shortBalAmt = 0;
var handrailAmt = 0;

if (stairModel == "Прямая"){
	if(railingSide_1 != "нет") {
		longBalAmt += stairAmt1;
		handrailAmt += 1;
		}
	if(railingSide_1 == "две") {
		longBalAmt += stairAmt1;
		handrailAmt += 1;
		}
	if(params.railingModel == "Частые стойки") shortBalAmt = longBalAmt;
	}

	
	
if (stairModel == "Г-образная с площадкой") {
	console.log(stairModel)
	if(railingSide_1 == "внутреннее" || railingSide_1 == "две") {
		longBalAmt += stairAmt1 + 1;
		if(params.railingModel == "Частые стойки") shortBalAmt += longBalAmt;
		handrailAmt += 1;
		}
	if(railingSide_1 == "внешнее" || railingSide_1 == "две") {
		longBalAmt += stairAmt1 + 1;
		if(params.railingModel == "Частые стойки") shortBalAmt += longBalAmt + 6;
		handrailAmt += 1;
		}
	if(railingSide_3 == "внутреннее" || railingSide_1 == "две") {
		longBalAmt += stairAmt3 + 1;
		if(params.railingModel == "Частые стойки") shortBalAmt += longBalAmt;
		handrailAmt += 1;
		}
	if(railingSide_3 == "внешнее" || railingSide_1 == "две") {
		longBalAmt += stairAmt3 + 1;
		if(params.railingModel == "Частые стойки") shortBalAmt += longBalAmt + 6;
		handrailAmt += 1;
		}
	
	}
	
if (stairModel == "Г-образная с забегом") {
	if(railingSide_1 == "внутреннее" || railingSide_1 == "две") {
		longBalAmt += stairAmt1 + 1;
		if(params.railingModel == "Частые стойки") shortBalAmt += longBalAmt;	
		handrailAmt += 1;
		}
	if(railingSide_1 == "внешнее" || railingSide_1 == "две") {
		longBalAmt += stairAmt1 + 3;
		if(params.railingModel == "Частые стойки") shortBalAmt += longBalAmt + 4;	
		handrailAmt += 1;
		}
	if(railingSide_3 == "внутреннее" || railingSide_1 == "две") {
		longBalAmt += stairAmt3 + 1;
		if(params.railingModel == "Частые стойки") shortBalAmt += longBalAmt;	
		handrailAmt += 1;
		}
	if(railingSide_3 == "внешнее" || railingSide_1 == "две") {
		longBalAmt += stairAmt3 + 3;
		if(params.railingModel == "Частые стойки") shortBalAmt += longBalAmt + 4;	
		handrailAmt += 1;
		}	
	}
	
if (stairModel == "П-образная с забегом") {
	if(railingSide_1 == "внутреннее" || railingSide_1 == "две") {
		longBalAmt += stairAmt1 + 1;
		if(params.railingModel == "Частые стойки") shortBalAmt += longBalAmt;	
		handrailAmt += 1;
		}
	if(railingSide_1 == "внешнее" || railingSide_1 == "две") {
		longBalAmt += stairAmt1 + 3;
		if(params.railingModel == "Частые стойки") shortBalAmt += longBalAmt + 4;	
		handrailAmt += 1;
		}
	if(railingSide_3 == "внутреннее" || railingSide_1 == "две") {
		longBalAmt += stairAmt3 + 1;
		if(params.railingModel == "Частые стойки") shortBalAmt += longBalAmt;	
		handrailAmt += 1;
		}
	if(railingSide_3 == "внешнее" || railingSide_1 == "две") {
		longBalAmt += stairAmt3 + 3;
		if(params.railingModel == "Частые стойки") shortBalAmt += longBalAmt + 4;	
		handrailAmt += 1;
		}
	//заднее ограждение забега
	if(backRailing_2 == "есть") {
		longBalAmt += 6;
		if(params.railingModel == "Частые стойки") shortBalAmt += 6;	
		handrailAmt += 1;
		}
	
	}
	
if (stairModel == "П-образная трехмаршевая") {
	if(railingSide_1 == "внутреннее" || railingSide_1 == "две") {
		longBalAmt += stairAmt1 + 1;
		if(params.railingModel == "Частые стойки") shortBalAmt += longBalAmt;	
		handrailAmt += 1;
		}
	if(railingSide_1 == "внешнее" || railingSide_1 == "две") {
		longBalAmt += stairAmt1 + 3;
		if(params.railingModel == "Частые стойки") shortBalAmt += longBalAmt + 4;	
		handrailAmt += 1;
		}
	if(railingSide_2 == "внутреннее" || railingSide_2 == "две") {
		longBalAmt += stairAmt2 + 1;
		if(params.railingModel == "Частые стойки") shortBalAmt += longBalAmt;	
		handrailAmt += 1;
		}
	if(railingSide_2 == "внешнее" || railingSide_2 == "две") {
		handrailAmt += 2;
		if(turnType_1 == "площадка"){
			longBalAmt += stairAmt2 + 1;
			if(params.railingModel == "Частые стойки") shortBalAmt += longBalAmt + 6;
			}
		if(turnType_1 == "забег"){
			longBalAmt += stairAmt2 + 3;
			if(params.railingModel == "Частые стойки") shortBalAmt += longBalAmt + 4;
			}
		if(turnType_2 == "площадка"){
			shortBalAmt += 3;
			if(params.railingModel == "Частые стойки") shortBalAmt += 3;
			}
		if(turnType_2 == "забег"){
			longBalAmt += 3;
			if(params.railingModel == "Частые стойки") shortBalAmt += 3;
			}
		}
	if(railingSide_3 == "внутреннее" || railingSide_1 == "две") {
		longBalAmt += stairAmt3 + 1;
		if(params.railingModel == "Частые стойки") shortBalAmt += longBalAmt;	
		handrailAmt += 1;
		}
	if(railingSide_3 == "внешнее" || railingSide_1 == "две") {
		longBalAmt += stairAmt3 + 3;
		if(params.railingModel == "Частые стойки") shortBalAmt += longBalAmt + 4;	
		handrailAmt += 1;
		}
	//заднее ограждение забега
	if(backRailing_2 == "есть") {
		longBalAmt += 6;
		if(params.railingModel == "Частые стойки") shortBalAmt += 6;	
		handrailAmt += 1;
		}
	
	}
	
	


}//end of Стамет



/*** расчет цены ***/


if(model == "Стамет"){

//расценки для клиента

// модули
var modPrice = 1800; //цена модулей ступеней
var startModPrice = 2935; //цена стартовых модулей (2шт в комплекте)
var turnModPrice = 4210; //цена поворотных модулей

// ступени
/*
var treadMeterPrice = 0; //стоимость ступеней за м2
var treadMargin = 3; //маржа на ступени из сосны
if (stairType == "сосна кл.Б") treadMeterPrice = 24000 * 0.04 * treadMargin;
var treadMargin = 2; //маржа на ступени из твердых пород
if (stairType == "береза паркет.") treadMeterPrice = 53000 * 0.04 * treadMargin;
if (stairType == "дуб паркет.") treadMeterPrice = 95000 * 0.04 * treadMargin;
if (stairType == "дуб ц/л") treadMeterPrice = 175000 * 0.04 * treadMargin;
*/
var treadsPanelName = calcTimberParams(stairType).treadsPanelName;
var riserPanelName = calcTimberParams(stairType).riserPanelName;
var treadMeterPrice = calcTimberParams(stairType).m2Price_40 * 2;


var strightTreadPrice = 0.3 * treadMeterPrice;
var platformPrice = treadMeterPrice;
var turnTreadPrice1 = treadMeterPrice * 0.5;
var turnTreadPrice2 = treadMeterPrice;

// больцы
var bolzPrice = 350;
//опоры
var columnPrice1 = 1250; //цена столбов 1м
var columnPrice2 = 2450; //цена столбов 2м
var sideFixPrice = 2750; //цена креплений в стену

var carcasPrice = 0;
var treadsPrice = 0;

// модули
carcasPrice += modAmt * modPrice; //кол-во модулей ступеней
carcasPrice += startModAmt * startModPrice; //кол-во стартовых модулей (2шт в комплекте)
carcasPrice += turnModAmt * turnModPrice; //кол-во поворотных модулей
// ступени
treadsPrice += treadAmt * strightTreadPrice;
treadsPrice += platformAmt  * platformPrice;
treadsPrice += turnTreadAmt1  * turnTreadPrice1; //первая и третья забежная ступень
treadsPrice += turnTreadAmt2  * turnTreadPrice2; //вторая забежная ступень
console.log(treadAmt)
// больцы
carcasPrice += bolzAmt * bolzPrice;
//опоры
carcasPrice += columnAmt1  * columnPrice1; //кол-во столбов 1м
carcasPrice += columnAmt2  * columnPrice1; //кол-во столбов 2м
carcasPrice += sideFixAmt  * sideFixPrice; //кол-во креплений в стену

//покраска ступеней

var meterPaintPrice = 0;
if(timberPaint == "лак") meterPaintPrice = 2000;
if(timberPaint == "морилка+лак") meterPaintPrice = 2700;

var treadPaintPrice = 0.7 * meterPaintPrice;
var platformPaintPrice = meterPaintPrice * 2.1;
var turnTreadPaintPrice1 = meterPaintPrice * 1.1;
var turnTreadPaintPrice2 = meterPaintPrice * 2;

var timberPaintPrice = 0;
timberPaintPrice += treadAmt * treadPaintPrice;
timberPaintPrice += platformAmt  * platformPaintPrice;
timberPaintPrice += turnTreadAmt1  * turnTreadPaintPrice1;
timberPaintPrice += turnTreadAmt2  * turnTreadPaintPrice2;


/*ограждения*/
var longBalPrice = 400;
var shortBalPrice = 350;
if(params.balMaterial == "хром") {
	longBalPrice = 650;
	shortBalPrice = 600;
	}
var handrailPrice = 500;
if(params.handrail == "береза") handrailPrice = 1200;
if(params.handrail == "дуб") handrailPrice = 1700;

var railingPrice = 0;
railingPrice += longBalPrice * longBalAmt;
railingPrice += shortBalPrice * shortBalAmt;
railingPrice += handrailPrice * handrailAmt;

//данные рассчитаны в функции calculateBanisterPrice()
var banisterPrice = staircasePrice.banister;
var banisterCost = staircaseCost.banister;

var totalPrice = carcasPrice + treadsPrice + timberPaintPrice + railingPrice + banisterPrice;

/*доставка, установка*/

var totalInstallPrice = totalPrice * 0.2;

/*рассчитываем минимальную стоимость сборки*/
var minInstalPrice = 0; //минимальная стоимость сборки
var engineer = params.engineer;
var workers = params.workers;
var stepCutting = params.stepCutting;
var handrailCutting = params.handrailCutting;
var isAssembling = params.isAssembling;
var paidParking = params.paidParking;

if (workers != "нет") {
	workers = Number(workers);
	minInstalPrice = workers * 13000;
	}
if (engineer != "нет") {
	engineer = Number(engineer);
	minInstalPrice += engineer * 8000;
	}
if (stepCutting != "нет") {
	minInstalPrice += 7000;
	}
if (handrailCutting != 0) {
	if (handrailCutting < 10) minInstalPrice += 7000;
	else minInstalPrice += handrailCutting * 2000 - 13000;
	}
if(paidParking != "нет"){
	minInstalPrice += 5000;
	}
if (totalInstallPrice != 0 && totalInstallPrice < minInstalPrice) totalInstallPrice = minInstalPrice;

if(isAssembling == "нет") {
	totalInstallPrice = 0; 
	minInstalPrice = 0;
	}

//рассчитываем стоимость доставки

var deliveryPrice = 0;
var deliveryCost = 0;
if(params.delivery != "нет") {
	deliveryPrice = 2500;
	deliveryCost = 2000;
	}
if(params.delivery == "Московская обл.") {
	deliveryPrice = 2500 + 50 * params.deliveryDist;
	deliveryCost = 2000 + 30 * params.deliveryDist;
	}

//обнуляем доставку при стоимости более 100 тыс.
var totalSum = totalPrice + totalInstallPrice;
if(totalSum > 120000) deliveryPrice = 0;



//заносим данные в глобальный объект
staircasePrice.carcas = carcasPrice;
staircasePrice.treads = treadsPrice;
staircasePrice.carcasMetalPaint = 0;
staircasePrice.carcasTimberPaint = timberPaintPrice;
staircasePrice.timberPaint = timberPaintPrice;
staircasePrice.metalPaint = 0;
staircasePrice.railing = railingPrice;
staircasePrice.assembling = totalInstallPrice;
staircasePrice.delivery = deliveryPrice;



staircaseCost.carcas = carcasPrice * 0.8;
staircaseCost.treads = treadsPrice * 0.7;
staircaseCost.carcasMetalPaint = 0;
staircaseCost.carcasTimberPaint = timberPaintPrice * 0.7;
staircaseCost.timberPaint = timberPaintPrice * 0.7;
staircaseCost.metalPaint = 0;
staircaseCost.railing = railingPrice * 0.8;
staircaseCost.assembling = minInstalPrice*0.7;
staircaseCost.delivery = deliveryCost;


//учитываем коэффициенты на цену
staircasePrice.carcas = staircasePrice.carcas * params.carcasPriceFactor;
staircasePrice.treads = staircasePrice.treads * params.treadsPriceFactor;
staircasePrice.railing = staircasePrice.railing * params.railingPriceFactor;
staircasePrice.assembling = staircasePrice.assembling * params.assemblingPriceFactor;

//считаем общую цену, скидку и цену со скидкой
staircasePrice.totalPrice = staircasePrice.carcas + staircasePrice.treads + 
	staircasePrice.timberPaint + staircasePrice.railing + deliveryPrice + staircasePrice.assembling + staircasePrice.banister;

staircasePrice.discountSum = staircasePrice.totalPrice * params.discountFactor / 100;
staircasePrice.finalPrice = staircasePrice.totalPrice - staircasePrice.discountSum;

//учитываем коэффициенты на себестоимость
staircaseCost.carcas = staircaseCost.carcas * params.carcasCostFactor;
staircaseCost.treads = staircaseCost.treads * params.treadsCostFactor;
staircaseCost.railing = staircaseCost.railing * params.railingCostFactor;
staircaseCost.assembling = staircaseCost.assembling * params.assemblingCostFactor;

staircaseCost.totalCost = staircaseCost.carcas + staircaseCost.treads + 
staircaseCost.timberPaint + staircaseCost.railing + minInstalPrice*0.7 + deliveryCost + staircaseCost.banister;
 


	
//валовая прибыль
staircasePrice.vp = staircasePrice.finalPrice - staircaseCost.totalCost;
	
}//end of Стамет

printPrice(staircasePrice);
printCost(staircaseCost, staircasePrice);

//расход материала

// var timberParams = calcTimberParams(params.treadsMaterial);

// materials[timberParams.treadsPanelName].amt = 
// 	treadAmt * 0.3 * 1 + 
// 	platformAmt * 1 * 1 + 
// 	turnTreadAmt1 * 1 * 0.6 + 
// 	turnTreadAmt2 * 1.5 * 0.5;

}//end of calculateCarcasPrice 

function printPrice(staircasePrice){

var carcasPriceDivId = "resultCarcas";
var railingPriceDivId = "resultPerila";
var banisterPriceDivId = "price_banister";
var assemblingPriceDivId = "price_assembling";
var totalPriceDivId = "totalResult";

//округляем все цены 
$.each(staircasePrice, function(i){ 
	staircasePrice[i] = Math.round(this);
	});



/*** КАРКАС ***/

var outputDiv = document.getElementById(carcasPriceDivId);
	outputDiv.innerHTML = "Cтоимость каркаса: " + staircasePrice.carcas +  " руб; <br/>";
	if (staircasePrice.treads != 0)
		outputDiv.innerHTML += "Cтоимость ступеней: " + staircasePrice.treads +  " руб; <br/>";
	if (staircasePrice.railing != 0)
		outputDiv.innerHTML += "Cтоимость ограждений: " + staircasePrice.railing +  " руб; <br/>";
	if (staircasePrice.railing != 0)
		outputDiv.innerHTML += "Cтоимость балюстрады: " + staircasePrice.banister +  " руб; <br/>";
		
		
	if (staircasePrice.carcasMetalPaint != 0 || staircasePrice.carcasTimberPaint != 0) {
		outputDiv.innerHTML += "<h3>Дополнительные услуги:</h3>";
	if (staircasePrice.carcasMetalPaint != 0) outputDiv.innerHTML +=
		"Покраска металла: " + staircasePrice.carcasMetalPaint +  " руб; <br/>";
	if (staircasePrice.carcasTimberPaint != 0) outputDiv.innerHTML +=
		"Покраска дерева: " + staircasePrice.carcasTimberPaint +  " руб; <br/>";
	}
	

	
/*** ОБЩАЯ ЦЕНА ***/


var outputDiv = document.getElementById(totalPriceDivId);
outputDiv.innerHTML = "";

if(staircasePrice.carcas)
	outputDiv.innerHTML += 
		"Стоимость каркаса: " + staircasePrice.carcas + "руб;<br/>";
if(staircasePrice.treads)
	outputDiv.innerHTML += 
		"Стоимость ступеней: " + staircasePrice.treads + "руб;<br/>";		
if(staircasePrice.railing)
	outputDiv.innerHTML += 
		"Стоимость ограждений лестницы: " + staircasePrice.railing + "руб;<br/>";
if(staircasePrice.banister)
	outputDiv.innerHTML += 
		"Стоимость балюстрады: " + staircasePrice.banister + "руб;<br/>";
		
//доп. услуги
if(staircasePrice.assembling || staircasePrice.metalPaint || staircasePrice.timberPaint || params.delivery != "нет")
	outputDiv.innerHTML += "<h3>Дополнительные услуги </h3>";
if(staircasePrice.metalPaint)
	outputDiv.innerHTML += "Покраска металла: " + staircasePrice.metalPaint + "руб;<br/>";	
if(staircasePrice.timberPaint)
	outputDiv.innerHTML += "Покраска дерева: " + staircasePrice.timberPaint + "руб;<br/>";		
if(staircasePrice.assembling)
	outputDiv.innerHTML += "Сборка: " + staircasePrice.assembling + "руб;<br/>";	
if(params.delivery != "нет" &&  staircasePrice.delivery)
	outputDiv.innerHTML += 
		"Доставка: " + staircasePrice.delivery + "руб;<br/>";	
if(params.delivery != "нет" &&  staircasePrice.delivery == 0)
	outputDiv.innerHTML += "Доставка: бесплатно<br/>";	
	
//общая стоимость
outputDiv.innerHTML += "<h3>Общая стоимость лестницы </h3>" + 
	"<b>Общая стоимость лестницы: " + staircasePrice.totalPrice + " руб;</b> <br/>" + 
	"<b class='yellow'>Скидка: " + staircasePrice.discountSum +  " руб; </b><br/>" + 
	"<b class='yellow'>Цена со скидкой: " + staircasePrice.finalPrice +  " руб; </b><br/>";

}

function printCost(staircaseCost, staircasePrice){
var carcasCostDivId = "cost_carcas";
var railingCostDivId = "cost_perila";
var banisterCostDivId = "cost_banister";
var assemblingCostDivId = "cost_assembling";
var totalCostDivId = "total_cost";
//округляем значения
$.each(staircaseCost, function(i){
	staircaseCost[i] = Math.round(this); 
	});


var tableBody = "";
tableBody += "<tr><td>Каркас</td><td>" + staircaseCost.carcas +"</td><td>"+ staircasePrice.carcas + "</td><td>" + (staircasePrice.carcas * (1-params.discountFactor/100)) + "</td></tr>";
tableBody += "<tr><td>Ступени</td><td>" + staircaseCost.treads +"</td><td>"+ staircasePrice.treads + "</td><td>"+ (staircasePrice.treads * (1-params.discountFactor/100)) + "</td></tr>";
tableBody += "<tr><td>Ограждения лестницы</td><td>" + staircaseCost.railing +"</td><td>"+ staircasePrice.railing +"</td><td>"+ (staircasePrice.railing * (1-params.discountFactor/100)) + "</td></tr>";
tableBody += "<tr><td>Балюстрада</td><td>" + staircaseCost.banister +"</td><td>"+ staircasePrice.banister +"</td><td>"+ (staircasePrice.banister * (1-params.discountFactor/100))+ "</td></tr>";
tableBody += "<tr><td>Покраска металла</td><td>" + staircaseCost.metalPaint +"</td><td>"+ staircasePrice.metalPaint +"</td><td>"+ (staircasePrice.metalPaint* (1-params.discountFactor/100)) + "</td></tr>";
tableBody += "<tr><td>Покраска дерева</td><td>" + staircaseCost.timberPaint +"</td><td>"+ staircasePrice.timberPaint +"</td><td>"+ (staircasePrice.timberPaint** (1-params.discountFactor/100)) + "</td></tr>";
tableBody += "<tr><td>Сборка</td><td>" + staircaseCost.assembling +"</td><td>"+ staircasePrice.assembling +"</td><td>"+ (staircasePrice.assembling  * (1-params.discountFactor/100)) + "</td></tr>";
tableBody += "<tr><td>Доставка</td><td>" + staircaseCost.delivery +"</td><td>"+ staircasePrice.delivery +"</td><td>"+ (staircasePrice.delivery * (1-params.discountFactor/100))+ "</td></tr>";
tableBody += "<tr><td><b>Итого</b></td><td><b>" + staircaseCost.totalCost +"</b></td><td><b>" + staircasePrice.totalPrice + "</b></td><td><b>" + (staircasePrice.finalPrice * (1-params.discountFactor/100)) + "</b></td></tr>";

var outputDiv = document.getElementById(totalCostDivId);
outputDiv.innerHTML = "";
outputDiv.innerHTML += 
	"<table class='form_table'><tbody><tr><th>Наименование</th><th>Себестоимость</th><th>Цена без скидки</th><th>Цена со скидкой</th></tr>" + 
	tableBody + 
	"</tbody></table>";
var vpPart = Math.round(staircasePrice.vp / staircasePrice.finalPrice * 100)
outputDiv.innerHTML += "<b class='yellow'>Валовая прибыль: " + staircasePrice.vp + " руб (" + vpPart + "%)</b>";

/*себестоимость каркаса*/
outputDiv = document.getElementById(carcasCostDivId);
outputDiv.innerHTML =
	"Тетивы: " + Math.round(staircaseCost.stringer) +  " руб; <br/>" + 
	"Гнутые уголки: " + Math.round(staircaseCost.angles) +  " руб; <br/>" + 
	"Метизы: " + Math.round(staircaseCost.bolts) +  " руб; <br/>" + 
	"Рамки: " + Math.round(staircaseCost.frames) +  " руб; <br/>"+
	"Колонны: " + Math.round(staircaseCost.columns) +  " руб; <br/>" + 
	"<b>Итого каркас: " + Math.round(staircaseCost.carcas) +  " руб; </b><br/>" + 
	"Ступени: " + Math.round(staircaseCost.treads) +  " руб; <br/>" +
	"Покраска металла: " + Math.round(staircaseCost.carcasMetalPaint) +  " руб; <br/>" + 	
	"Покраска дерева: " + Math.round(staircaseCost.carcasTimberPaint) +  " руб; <br/>";	

/*** ОГРАЖДЕНИЯ ЛЕСТНИЦЫ ***/
outputDivId = railingCostDivId;
printRailingCost("лестница", outputDivId);

/*** БАЛЮСТРАДА ***/
outputDivId = banisterCostDivId;
printRailingCost("балюстрада", outputDivId);

/*** ДОСТАВКА, СБОРКА ***/
outputDiv = document.getElementById(assemblingCostDivId);
outputDiv.innerHTML =
"Сборка: " + staircaseCost.assembling +  " руб; <br/>"+
"Доставка: " + staircaseCost.delivery +  " руб; <br/>";

}

