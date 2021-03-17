//var costMarkup = 1.3; //07.05.20;
var costMarkup = 1.56; //11.01.21

function calculatePrice(){
	var markup = 3;
	
	//рассчитываем кол-во секций
	var amt = calcSections().amt;
	var fullLength = calcSections().fullLength;


	var stairCase = {}

	//секции
	var sectionWidth = 600;
	var sectionMeterCost = 1200;
	if(params.staircaseType == "П-1.2"){
		sectionWidth = 800;
		sectionMeterCost = 1500;
		}
	
	//верхняя секция 0,5 м
	stairCase.topSection_05 = {
		name: "Верхняя секция " + sectionWidth + "мм L=0.5 м.п.",
		unitCost: sectionMeterCost * 1,
		amt: 2,
		}

	//секция 2м
	stairCase.section_2 = {
		name: "Секция " + sectionWidth + "мм L=2 м.п.",
		unitCost: sectionMeterCost * 2 + 500,
		amt: amt.sect_2,
		}
		
	//секция 3м
	stairCase.section_3 = {
		name: "Секция " + sectionWidth + "мм L=3м.п.",
		unitCost: sectionMeterCost * 3 + 500,
		amt: amt.sect_3,
		}

	//секция 4м
	stairCase.section_4 = {
		name: "Секция " + sectionWidth + "мм L=4м.п.",
		unitCost: sectionMeterCost * 4 + 500,
		amt: amt.sect_4,
		}	

	
	//Ограждения
	stairCase.railing = {
		name: "Ограждения секции 800мм",
		unitCost: 700,
		amt: (params.stairCaseLength - params.railingOffset + 1200) / 1000,
		}
	if(params.staircaseType == "П-1.1") stairCase.railing.amt = 0;

	//ноги прямые
	stairCase.leg = {
		name: "Ноги " + (params.wallDist + params.legsExtraLength)+ "мм",
		unitCost: 580,
		amt: params.legAmt,
		}
		
	//крепление Т-образное 600мм
	stairCase.legT = {
		name: "Крепление Т-образное " + sectionWidth + "мм",
		unitCost: 1500,
		amt: params.legAmt,
		}
	if(sectionWidth == 800) stairCase.legT.unitCost = 2000;
	
	if(params.legType == "прямые") stairCase.legT.amt = 0;
	if(params.legType == "Т-образные") stairCase.leg.amt = 0;
	
	//площадка с ограждением 600
	
	
	stairCase.platform = {
		name: "Площадка " + sectionWidth + "мм L = " + params.pltLength + "м.п. с ограждением",
		unitCost: 4100 * params.pltLength / 1000,
		amt: 1,
		}
	
	if(sectionWidth == 800) stairCase.platform.unitCost = stairCase.platform.unitCost * 1.2;
	
	//если нет площадки
	if(params.pltLength == 0){
		stairCase.platform.amt = 0;
	}


var totalCost = 0; //общая себестоимость лестницы
	
for (var prop in stairCase){
	stairCase[prop].cost = stairCase[prop].unitCost * stairCase[prop].amt;
	stairCase[prop].price = stairCase[prop].cost * markup;
	totalCost += stairCase[prop].cost;
	}
	
//покраска
if(params.metalPaint == "грунт") totalCost = totalCost * 1.1;
if(params.metalPaint == "порошок") totalCost = totalCost * 1.3;
if(params.metalPaint == "цинк") totalCost = totalCost * 1.2 + 3000;


//испытания
var testingCost = 0;
if(params.isTesting == "да") testingCost = 5000;

//монтаж

var sectionAssemblingMeterCost = 2500;
var railingAssemblingMeterCost = 500;
var platformAssemblingUnitCost = 3000;
var assemblingCost = 0;

if(params.isAssembling == "есть"){
	//монтаж секций
	var assemblingCost = sectionAssemblingMeterCost * fullLength / 1000;
	//монтаж ограждений секций
	assemblingCost += railingAssemblingMeterCost * stairCase.railing.amt;
	//монтаж площадок
	assemblingCost += platformAssemblingUnitCost * 1
	//платная парковка
	if(params.paidParking == "да") assemblingCost += 2000;
	//разборка фасада
	if(params.facade == "да" || params.wallType == "сэндвич-панель") assemblingCost += 1000 * stairCase.leg.amt;
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

	if(params.discountMode == "процент"){
		var discount = totalStaircasePrice * params.discountFactor / 100;
		}
	
	if(params.discountMode != "процент"){
		if(params.discountMode == "скидка"){
			var discount = params.discountFactor;
			}
		if(params.discountMode == "цена"){
			var discount = totalPrice - params.discountFactor;
			}
		}

var finalPrice = totalPrice - discount;





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

//сохраняем данные в глобальный объект
setPrice('carcas', totalStaircasePrice + testingPrice - discount);
setPrice('delivery', deliveryPrice);
setPrice('assembling', assemblingPrice);
setPrice('testing', testingPrice);
setPrice('total', finalPrice);

//исправляем ошибку округления
var delta = priceObj['total'].discountPrice - priceObj['carcas'].discountPrice - priceObj['delivery'].discountPrice - priceObj['assembling'].discountPrice;
priceObj['carcas'].discountPrice += delta;




/*вывод результатов*/

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
outputDiv.innerHTML += "<b class='yellow'>Валовая прибыль: " + (finalPrice - totalCost) + " руб (<span id='vpPart'>" + vpPart + "</span>%)</b>";


//себестоимость лестницы

var outputDiv = document.getElementById("cost_carcas");
outputDiv.innerHTML = "";

for (var prop in stairCase){
	outputDiv.innerHTML += stairCase[prop].name + ": " + stairCase[prop].cost + " руб.</br>";	
	}

	
//потребность в материалах

//профиль 60х30
	materials.prof_60_30.amt = 
		stairCase.topSection_05.amt * 1.7 * 2 + 
		stairCase.section_2.amt * 2 * 2 + 
		stairCase.section_3.amt * 3 * 2 + 
		stairCase.section_4.amt * 4 * 2 + 		
		stairCase.platform.amt * 0.6 * 3 + 
		stairCase.leg.amt * 0.5 * 2 + 
		stairCase.legT.amt * 0.5 * 2;
		
//арматура
	materials.rebar.amt = 
		stairCase.topSection_05.amt * 0.6 * 2 + 
		stairCase.section_2.amt * 0.6 * 7 + 
		stairCase.section_3.amt * 0.6 * 10 + 
		stairCase.section_4.amt * 0.6 * 13;
		if(sectionWidth == 800) materials.rebar.amt = materials.rebar.amt * 0.8 / 0.6;
		

//полоса
	var fenceArcAmt = Math.ceil(params.railingLength / 0.45);	
	materials.stripe_40.amt = fenceArcAmt * 2.2;

//лист 8мм
	materials.sheet8.amt = stairCase.platform.amt * 0.17 * 1 * 2;

//рифленый лист
	materials.sheetRef.amt = stairCase.platform.amt * 1 * 0.6;
	if(sectionWidth == 800) materials.sheetRef.amt = materials.sheetRef.amt * 0.8 / 0.6;

//профиль 20х20
	var railsAmt = Math.ceil(params.railingLength / 4) * 4
	materials.prof_20_20.amt = stairCase.platform.amt * 4;

//профиль 40х20
	materials.prof_40_20.amt = stairCase.platform.amt * 2;
	
//профиль 100х50
	materials.prof_100_50.amt = stairCase.legT.amt * 2;

	
var exportObj = getExportData_com();
printExportData(exportObj, "exportData");

}//end of calculatePrice


function calcSections(){
	var strightLen = params.stairCaseLength - 500;
	var sectAmt = Math.ceil(strightLen / (params.maxSectLength))
	var fullLength = sectAmt * params.maxSectLength;
	var deltaLength = fullLength - strightLen;
	
	var amt = {
		sect_top: 2,
		sect_2: 0,
		sect_3: 0,
		sect_4: 0,
		}
		
	//если нет площадки
	if(params.pltLength == 0){
		amt.sect_top = 0;
	}
	if(params.maxSectLength == 2000) {
		amt.sect_2 = sectAmt;		
		}
	if(params.maxSectLength == 3000) {
		
		amt.sect_3 = sectAmt - 2;
		if(deltaLength >= 2000){
			amt.sect_2 += 2;
			}
		if(deltaLength >= 1000 && deltaLength < 2000){
			amt.sect_2 += 1;
			amt.sect_3 += 1;
			}
		if(deltaLength < 1000){
			amt.sect_3 += 2;
			}
		//ручное задание кол-ва секций для коротких лестниц
		if(strightLen <= 4000){
			amt.sect_2 = 2;
			amt.sect_3 = 0;
			}
		if(strightLen <= 3000){
			amt.sect_2 = 0;
			amt.sect_3 = 1;
			}
		if(strightLen <= 2000){
			amt.sect_2 = 1;
			amt.sect_3 = 0;
			}
		}

	if(params.maxSectLength == 4000) {
		amt.sect_4 = sectAmt - 2;
		if(deltaLength >= 3000){
			amt.sect_2 += 1;
			amt.sect_3 += 1;
			amt.sect_4 += 0;
			}
		if(deltaLength >= 2000 && deltaLength < 3000){
			amt.sect_2 += 0;
			amt.sect_3 += 2;
			amt.sect_4 += 0;
			}
		if(deltaLength >= 1000 && deltaLength < 2000){
			amt.sect_2 += 0;
			amt.sect_3 += 1;
			amt.sect_4 += 1;
			}
		if(deltaLength < 1000){
			amt.sect_2 += 0;
			amt.sect_3 += 0;
			amt.sect_4 += 2;
			}
		//ручное задание кол-ва секций для коротких лестниц
		if(strightLen <= 8000){
			amt.sect_2 = 0;
			amt.sect_3 = 0;
			amt.sect_4 = 2;
			}
		if(strightLen <= 7000){
			amt.sect_2 = 0;
			amt.sect_3 = 1;
			amt.sect_4 = 1;
			}
		if(strightLen <= 6000){
			amt.sect_2 = 0;
			amt.sect_3 = 2;
			amt.sect_4 = 0;
			}
		if(strightLen <= 5000){
			amt.sect_2 = 1;
			amt.sect_3 = 1;
			amt.sect_4 = 0;
			}
		if(strightLen <= 4000){
			amt.sect_2 = 0;
			amt.sect_3 = 0;
			amt.sect_4 = 1;
			}
		if(strightLen <= 3000){
			amt.sect_2 = 0;
			amt.sect_3 = 1;
			amt.sect_4 = 0;
			}
		if(strightLen <= 2000){
			amt.sect_2 = 1;
			amt.sect_3 = 0;
			amt.sect_4 = 0;
			}
		}

	
	fullLength = 500 + amt.sect_2 * 2000 + amt.sect_3 * 3000 + amt.sect_4 * 4000;
	var midSectAmt = amt.sect_2 + amt.sect_3 + amt.sect_4;
	
	var par = {
		amt: amt,
		fullLength: fullLength,
		midSectAmt: midSectAmt,
		}

	return par;

}//end of calcSections
