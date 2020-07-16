function calculatePrice(){
	var markup = 2.2;
	var discountFactor = params.discountFactor / 100;
	var sectionMeterCost_600 = 1200;
	var sectionMeterCost_800 = 1500;
	

	var stairCase = {}

	//секции 600
	
	//верхняя секция 600-0,5 м
	stairCase.topSection_600_05 = {
		name: "Верхняя секция 600мм L=0.5 м.п.",
		unitCost: sectionMeterCost_600 * 1,
		amt: params.topSectionAmt_600_05,
		size: 600,
		height: 2,
		}

	//секция 2м
	stairCase.section_600_2 = {
		name: "Секция 600мм L=2м.п.",
		unitCost: sectionMeterCost_600 * 2,
		amt: params.sectionAmt_600_2,
		size: 600,
		height: 2,
		}
		
	//секция 3м
	stairCase.section_600_3 = {
		name: "Секция 600мм L=3м.п.",
		unitCost: sectionMeterCost_600 * 3,
		amt: params.sectionAmt_600_3,
		size: 600,
		height: 3,
		}

	//секция 4м
	stairCase.section_600_4 = {
		name: "Секция 600мм L=4м.п.",
		unitCost: sectionMeterCost_600 * 4,
		amt: params.sectionAmt_600_4,
		size: 600,
		height: 4,
		}	

	//секции 800
	
		//верхняя секция 800-0,5м
	stairCase.topSection_800_05 = {
		name: "Верхняя секция 800мм L=0,5 м.п.",
		unitCost: sectionMeterCost_800 * 1,
		amt: params.topSectionAmt_800_05,
		size: 800,
		height: 2,
		}

	//секция 2м
	stairCase.section_800_2 = {
		name: "Секция 800мм L=2м.п.",
		unitCost: sectionMeterCost_800 * 2,
		amt: params.sectionAmt_800_2,
		size: 800,
		height: 2,
		}
		
	//секция 3м
	stairCase.section_800_3 = {
		name: "Секция 800мм L=3м.п.",
		unitCost: sectionMeterCost_800 * 3,
		amt: params.sectionAmt_800_3,
		size: 800,
		height: 3,
		}

	//секция 4м
	stairCase.section_800_4 = {
		name: "Секция 800мм L=4м.п.",
		unitCost: sectionMeterCost_800 * 4,
		amt: params.sectionAmt_800_4,
		size: 800,
		height: 4,
		}
	//Ограждения
	stairCase.railing = {
		name: "Ограждения секции 800мм",
		unitCost: 700,
		amt: params.railingLength,
		size: 800,
		}

	//ноги 500мм
	stairCase.leg500 = {
		name: "Ноги 500мм",
		unitCost: 580,
		amt: params.leg500Amt,
		size: "all",
		}
		
	//ноги 600мм
	stairCase.leg750 = {
		name: "Ноги 750мм",
		unitCost: 680,
		amt: params.leg750Amt,
		size: "all",
		}
	
	//крепление Т-образное 600мм
	stairCase.legT_600 = {
		name: "Крепление Т-образное 600мм",
		unitCost: 1500,
		amt: params.legTAmt_600,
		size: "all",
		}
	
	//крепление Т-образное 800мм
	stairCase.legT_800 = {
		name: "Крепление Т-образное 800мм",
		unitCost: 2000,
		amt: params.legTAmt_800,
		size: "all",
		}
		
	
	//площадка с ограждением 600
	stairCase.platform_600 = {
		name: "Площадка 600мм L=1м.п. с ограждением",
		unitCost: 4100,
		amt: params.pltAmt_600,
		size: 600,
		}
	//площадка с ограждением 800
	stairCase.platform_800 = {
		name: "Площадка 800мм L=1м.п. с ограждением",
		unitCost: 4100,
		amt: params.pltAmt_800,
		size: 800,
		}

var totalCost = 0; //общая себестоимость лестницы
var staircaseTotalLength = 0;
	
for (var prop in stairCase){
	stairCase[prop].cost = stairCase[prop].unitCost * stairCase[prop].amt;
	stairCase[prop].price = stairCase[prop].cost * markup;
	totalCost += stairCase[prop].cost;
	if(stairCase[prop].height) staircaseTotalLength += stairCase[prop].height * stairCase[prop].amt;
	}
	
//покраска
if(params.metalPaint == "грунт") totalCost = totalCost * 1.1;
if(params.metalPaint == "порошок") totalCost = totalCost * 1.3;
if(params.metalPaint == "цинк") totalCost = totalCost * 1.2 + 3000;


//испытания
var testingCost = 0;
if(params.isTesting == "да") testingCost = 5000 * (stairCase.platform_800.amt + stairCase.platform_600.amt)

//монтаж

var sectionAssemblingMeterCost = 2500;
var railingAssemblingMeterCost = 500;
var platformAssemblingUnitCost = 3000;
var assemblingCost = 0;

if(params.isAssembling == "есть"){
	//монтаж секций
	var assemblingCost = sectionAssemblingMeterCost * staircaseTotalLength;
	//монтаж ограждений секций
	assemblingCost += railingAssemblingMeterCost * stairCase.railing.amt;
	//монтаж площадок
	assemblingCost += platformAssemblingUnitCost * (stairCase.platform_800.amt + stairCase.platform_600.amt)
	//платная парковка
	if(params.paidParking == "да") assemblingCost += 2000;
	//разборка фасада
	if(params.facade == "да") assemblingCost += 1000 * (stairCase.leg750.amt + stairCase.leg750.amt);
	
	//минималка
	if(assemblingCost < 8000 ) assemblingCost = 8000;
	}



//доставка 

var deliveryPrice = 0;

if(params.delivery != "нет"){
	var deliveryPrice = 3000;
	if(params.delivery == "центр") deliveryPrice = 5000;
	if(params.delivery == "Московская обл.") deliveryPrice += params.deliveryDist * 50;
	}



//учитываем коэффициенты
var totalStaircasePrice = totalCost * markup * params.carcasPriceFactor;
totalStaircaseCost = totalCost * params.carcasCostFactor;
var assemblingPrice = assemblingCost * 1.5 * params.assemblingPriceFactor;
assemblingCost = assemblingCost * params.assemblingCostFactor;
deliveryPrice = deliveryPrice * params.deliveryPriceFactor;
var deliveryCost = deliveryPrice * 0.8 * params.deliveryCostFactor;

var testingPrice = testingCost * 2 * params.testingPriceFactor;
testingCost = testingCost * params.testingCostFactor;

totalCost = totalStaircaseCost + assemblingCost + deliveryCost + testingCost;

//рассчитываем итоговую цену
var totalPrice = totalStaircasePrice + assemblingPrice + deliveryPrice + testingPrice;
var discount = totalStaircasePrice * discountFactor;
var finalPrice = totalPrice - discount;


/*вывод результатов*/

//округляем все значения
totalStaircasePrice = Math.round(totalStaircasePrice);
deliveryPrice = Math.round(deliveryPrice);
assemblingPrice = Math.round(assemblingPrice);
totalPrice = Math.round(totalPrice);
discount = Math.round(discount);
finalPrice = Math.round(finalPrice);
testingPrice = Math.round(testingPrice);

totalStaircaseCost = Math.round(totalStaircaseCost);
assemblingCost = Math.round(assemblingCost);
deliveryCost = Math.round(deliveryCost);
testingCost = Math.round(testingCost);
totalCost = Math.round(totalCost);


var outputDiv = document.getElementById("totalResult");
outputDiv.innerHTML = "";

outputDiv.innerHTML += "Стоимость лестниц: " + totalStaircasePrice + "руб;<br/>";

if(deliveryPrice)
	outputDiv.innerHTML += "Доставка: " + deliveryPrice + "руб;<br/>";
	
if(assemblingPrice)
	outputDiv.innerHTML += "Сборка и монтаж силами аттестованных промышленных альпинистов: " + assemblingPrice + "руб;<br/>";

if(testingPrice)
	outputDiv.innerHTML += "Проведение испытаний с выдачей комплекта документов для МЧС: " + testingPrice + "руб;<br/>";	

//общая стоимость
outputDiv.innerHTML += "<h3>Общая стоимость лестницы </h3>" + 
	"<b>Общая стоимость лестницы: " + totalPrice + " руб;</b> <br/>" + 
	"<b class='yellow'>Скидка: " + discount +  " руб; </b><br/>" + 
	"<b class='yellow'>Цена со скидкой: " + finalPrice +  " руб; </b><br/>";

	
/*вывод себестоимости*/

var tableBody = "";
tableBody += "<tr><td>Лестницы</td><td>" + totalStaircaseCost +"</td><td>"+ totalStaircasePrice + "</td><td>" + (totalStaircasePrice - discount) + "</td></tr>";
tableBody += "<tr><td>Монтаж</td><td>" + assemblingCost +"</td><td>"+ assemblingPrice +"</td><td>"+ assemblingPrice + "</td></tr>";
tableBody += "<tr><td>Доставка</td><td>" + deliveryCost +"</td><td>"+ deliveryPrice +"</td><td>"+ deliveryPrice + "</td></tr>";
tableBody += "<tr><td>Испытания</td><td>" + testingCost +"</td><td>"+ testingPrice +"</td><td>"+ testingPrice + "</td></tr>";
tableBody += "<tr><td><b>Итого</b></td><td><b>" + totalCost +"</b></td><td><b>" + totalPrice + "</b></td><td><b>" + finalPrice + "</b></td></tr>";

var outputDiv = document.getElementById("total_cost");
outputDiv.innerHTML = "";
outputDiv.innerHTML += 
	"<table class='form_table'><tbody><tr><th>Наименование</th><th>Себестоимость</th><th>Цена без скидки</th><th>Цена со скидкой</th></tr>" + 
	tableBody + 
	"</tbody></table>";
var vpPart = Math.round((finalPrice - totalCost) / finalPrice * 100)
outputDiv.innerHTML += "<b class='yellow'>Валовая прибыль: " + (finalPrice - totalCost) + " руб (" + vpPart + "%)</b>";


//себестоимость лестницы

var outputDiv = document.getElementById("cost_carcas");
outputDiv.innerHTML = "";

for (var prop in stairCase){
	outputDiv.innerHTML += stairCase[prop].name + ": " + stairCase[prop].cost + " руб.</br>";	
	}

	
//потребность в материалах

//профиль 60х30
	materials.prof_60_30.amt = 
		stairCase.topSection_600_05.amt * 1.7 * 2 + 
		stairCase.section_600_2.amt * 2 * 2 + 
		stairCase.section_600_3.amt * 3 * 2 + 
		stairCase.section_600_4.amt * 4 * 2 + 
		stairCase.topSection_800_05.amt * 1.7 * 2 + 
		stairCase.section_800_2.amt * 2 * 2 + 
		stairCase.section_800_3.amt * 3 * 2 + 
		stairCase.section_800_4.amt * 4 * 2 + 
		stairCase.platform_600.amt * 0.6 * 3 + 
		stairCase.platform_800.amt * 0.8 * 3 + 
		stairCase.leg500.amt * 0.5 * 2 + 
		stairCase.leg750.amt * 0.75 * 2 + 
		stairCase.legT_600.amt * 0.5 * 2 + 
		stairCase.legT_800.amt * 0.5 * 2; 
		
//арматура
	materials.rebar.amt = 
		stairCase.topSection_600_05.amt * 0.6 * 2 + 
		stairCase.section_600_2.amt * 0.6 * 7 + 
		stairCase.section_600_3.amt * 0.6 * 10 + 
		stairCase.section_600_4.amt * 0.6 * 13 + 
		stairCase.topSection_800_05.amt * 0.8 * 2 + 
		stairCase.section_800_2.amt * 0.8 * 7 + 
		stairCase.section_800_3.amt * 0.8 * 10 + 
		stairCase.section_800_4.amt * 0.8 * 13; 

//полоса
	var fenceArcAmt = Math.ceil(params.railingLength / 0.45);	
	materials.stripe_40.amt = fenceArcAmt * 2.2;

//лист 8мм
	materials.sheet8.amt = stairCase.platform_600.amt * 0.17 * 1 * 2 + 
		stairCase.platform_800.amt * 0.17 * 1 * 2;

//рифленый лист
	materials.sheetRef.amt = stairCase.platform_600.amt * 1 * 0.6 + 
		stairCase.platform_800.amt * 1 * 0.8;

//профиль 20х20
	var railsAmt = Math.ceil(params.railingLength / 4) * 4
	materials.prof_20_20.amt = stairCase.platform_600.amt * 4 + 
		stairCase.platform_800.amt * 4 + railsAmt * 4;

//профиль 40х20
	materials.prof_40_20.amt = stairCase.platform_600.amt * 2+ 
		stairCase.platform_800.amt * 2;
	
//профиль 100х50
	materials.prof_100_50.amt = stairCase.legT_600.amt * 2 + stairCase.legT_800.amt * 2;


}//end of calculatePrice


