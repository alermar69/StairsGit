var costMarkup = 1.3; //07.05 было 1.25;

function calcGlassRailingPrice(){

	//расчет стоимости ограждений кроме самонесущего стекла
	
	//извлекаем кол-ва из глобального массива счетчиков

	railingParams.handrailAmt = 0;
	railingParams.handrailLength_sum = 0;
	if(partsAmt.handrails) {
		railingParams.handrailAmt = partsAmt.handrails.amt;
		railingParams.handrailLength_sum = partsAmt.handrails.sumLength;
		}
		
	railingParams.rigelAmt = 0;
	railingParams.rigelLength_sum = 0;
	if(partsAmt.rigels) {
		railingParams.rigelAmt = partsAmt.rigels.amt;
		railingParams.rigelLength_sum = partsAmt.rigels.sumLength;
		}
	
	railingParams.rackAmt = 0;
	if(partsAmt.racks) railingParams.rackAmt = partsAmt.racks.amt;

	railingParams.balAmt1 = 0;
	railingParams.balAmt2 = 0;
	if(partsAmt.forgedBal) {
		railingParams.balAmt1 = partsAmt.forgedBal.amt1;
		railingParams.balAmt2 = partsAmt.forgedBal.amt2;
		}
	
	railingParams.glassAmt = 0;
	railingParams.glassArea = 0;
	if(partsAmt.glasses) {
		railingParams.glassAmt = partsAmt.glasses.amt;
		railingParams.glassArea = partsAmt.glasses.sumArea;
		}
	
	/***  РАСЧЕТ ЦЕНЫ  ***/

	//добавляем информацию о конструкции ограждений в массив параметров
	railingParams.railingName = "лестница";
	railingParams.metalPaint = params.metalPaint_railing;
	railingParams.timberPaint = params.timberPaint;
	railingParams.handrailType = params.handrail;
	railingParams.rackType = params.banisterMaterial;
	railingParams.rackBottom = params.rackBottom;
	railingParams.rigelType = params.rigelMaterial;
	railingParams.rigelAmt_0 = params.rigelAmt;
	railingParams.railingModel = "ограждения";
	railingParams.railingTimber = params.railingTimber;
	railingParams.banister1 = params.banister1;
	railingParams.banister2 = params.banister2;

	//блоки, куда выводить данные
	railingParams.priceDivId = "resultPerila";
	railingParams.costDivId = "cost_perila";

	staircaseCost.metalRailing = 0;
	staircaseCost.stockRailing  = 0;
	staircaseCost.timberRailing  = 0;

	calcRailingPrice(railingParams); //функция находится в файле /calculator/general/priceLib.js
	
	//округляем все рассчитанные цифры

	for(var prop in staircaseCost){
		staircaseCost[prop] = Math.round(staircaseCost[prop]);
		}

	//расчет стоимости ограждений с самонесущим стеклом
	
	//обрщая площадь стекол
	var totalArea = 0;
	var totalArea8 = 0;
	var rutelAmt = 0;
	var holeAmt = 0;
	
	for(var i=0; i<railingParams.glass.length; i++){
		totalArea += railingParams.glass[i].area * 1.0;		
		holeAmt += railingParams.glass[i].holeAmt * 1.0;
		rutelAmt += railingParams.glass[i].holeAmt * 1.0;
		}

	if(railingParams.glass8){
		for(var i=0; i<railingParams.glass8.length; i++){
			totalArea8 += railingParams.glass8[i].area * 1.0;
			}
		}
	
	//расценки за единицу
	var unitCost = {
		mdf: 500, //м2 включая резку
		glass: 3200, //м2 готового изделия
		sideHolders: 250, //шт
		glassHolders: 350, //шт
		rutels: 200, //шт
		profile: 3000,
		delivery: calculateAssemblingPrice2().delivery.price,
		assembling: calcAssemblingWage().totalWage,
		}

	//параметры стекол
	var glassThk = 12;
	unitCost.glass = calcGlassCost(params.glassType, glassThk);

	if(params.isOrnament == "да") unitCost.glass += 2000;

	//количества

	var amt = {
		mdf: totalArea,
		glass: totalArea,
		sideHolders: railingParams.sideHolderAmt,
		glassHolders: railingParams.glassHolderAmt,
		rutels: rutelAmt,
		profile: getPartPropVal("glassProfiles", "sumLength", partsAmt) * 1.15, //15% на обрезки
		delivery: 1,
		assembling: 1,
		}
	if(params.delivery == "нет") amt.delivery = 0;
	if(params.isAssembling == "нет") amt.assembling = 0;
	
	var cost = {};
	var totalCost = 0;
	for(var prop in amt){
		cost[prop] = amt[prop] * unitCost[prop];
		totalCost += cost[prop];
		}
		
	//добавляем стоимость прочих ограждений
	totalCost += staircaseCost.railing
		
	var finalCost = totalCost + 
		cost.glass * (params.glassCostFactor - 1) + 
		cost.assembling * (params.assemblingCostFactor - 1) + 
		staircaseCost.railing * (params.otherCostFactor - 1);
	
	var totalPrice = Math.round(totalCost * 3 * params.railingPriceFactor);
	
	var discountSum = Math.round(totalPrice * (params.discountFactor / 100));
	//расчет скидки
	if(params.discountMode != "процент"){
		if(params.discountMode == "скидка"){
			discountSum = params.discountFactor
			}
		if(params.discountMode == "цена"){
			discountSum = totalPrice - params.discountFactor;
			}
		
		}
	
	var finalPrice = totalPrice - discountSum;
	var vp = finalPrice - finalCost;
	var vpPart = Math.round(vp / finalPrice * 100);
	
	//общая цена
	var text = "<b>Общая стоимость ограждений: " + totalPrice + " руб;</b><br/>" + 
		"<b class='yellow'>Скидка: " + discountSum + " руб;</b><br/>" + 
		"<b class='yellow'>Итого со скидкой: " + finalPrice + " руб;</b><br/>";	
	$("#totalResult").html(text);
	
	//подробная себестоимость
	var text = 
		"Шаблоны: " + Math.round(cost.mdf) + "<br/>" + 
		"Стекла 12мм: " + Math.round(cost.glass * params.glassCostFactor) + "<br/>" + 
		"Кронштейны поручня к стеклу: " + Math.round(cost.glassHolders) + "<br/>" + 
		"Кронштейны поручня к стене: " + Math.round(cost.sideHolders) + "<br/>" + 
		"Рутели: " + Math.round(cost.rutels) + "<br/>" + 
		"Профиль: " + Math.round(cost.profile) + "<br/>" + 
		"Поручни: " + staircaseCost.railingHandrails + " руб; <br/>" + 
		"Ригели: " + staircaseCost.railingRigels + " руб; <br/>" + 	
		"Деревянные балясины: " + staircaseCost.railingBal + " руб; <br/>" + 
		"Столбы/стойки: " + staircaseCost.railingRacks + " руб; <br/>" + 
		"Стеклодержатели: " + staircaseCost.railingFittings + " руб; <br/>" + 
		"Стекла 8мм: " + staircaseCost.railingGlass + " руб; <br/>" + 
		"Кованые балясины тип 1: " + staircaseCost.railingBal1 + " руб; <br/>" + 
		"Кованые балясины тип 2: " + staircaseCost.railingBal2 + " руб; <br/>" + 
		"Рамки для ковки: " + staircaseCost.railingFrames + " руб; <br/>" + 
		"Сварка кованых секций: " + staircaseCost.railingWeld + " руб; <br/>" + 
		"Покраска дерева: " + staircaseCost.railingTimberPaint + " руб; <br/>" + 
		"Покраска металла: " + staircaseCost.railingMetalPaint + " руб; <br/>" +
		"Доставка: " + Math.round(cost.delivery) + "<br/>" + 
		"Монтаж: " + Math.round(cost.assembling * params.assemblingCostFactor) + "<br/>" + 
		"<b>Общая себестоимость: " + Math.round(finalCost)  + "</b><br/>" +
		"Общая стоимость ограждений: " + Math.round(totalPrice) + " руб;<br/>" + 
		"Скидка: " + Math.round(discountSum) + " руб;<br/>" + 
		"<b>Итого со скидкой: " + Math.round(finalPrice) + " руб;</b><br/>" + 
		"<b class='yellow'>ВП: " + Math.round(vp) + " руб (<span id='vpPart'>" + vpPart + "</span>%)</b><br/>";
	
	$("#total_cost").html(text);
	

	//параметры стекол 12мм
	var text = "<h3>Размеры стекол 12мм: </h3><table class='form_table'><tbody>" + 
		"<tr><th>Площадь</th><th>A</th><th>B</th><th>d1</th><th>d2</th></tr> ";
	for(var i=0; i<railingParams.glass.length; i++){
		text += "<tr><td>" + Math.round(railingParams.glass[i].area * 100) / 100 + "</td><td>" + 
			Math.round(railingParams.glass[i].A) + "</td><td>" + 
			Math.round(railingParams.glass[i].B) + "</td><td>" + 
			Math.round(railingParams.glass[i].d1) + "</td><td>" + 
			Math.round(railingParams.glass[i].d2) + "</td>" + 
			"</tr>";
		}
	
		
	text += "<tbody><table>";
	text += "Всего стекол: " + railingParams.glass.length + "шт<br/>" + 
		"Сумма площадей описанных прямоугольников: " + Math.round(totalArea * 100) / 100 + " м2";
	
	//параметры стекол 8мм
	if(railingParams.glass8){
		text += "<h3>Размеры стекол 8мм: </h3><table class='form_table'><tbody>" + 
			"<tr><th>Площадь</th><th>A</th><th>B</th><th>d1</th><th>d2</th></tr> ";
		for(var i=0; i<railingParams.glass8.length; i++){
			text += "<tr><td>" + Math.round(railingParams.glass8[i].area * 100) / 100 + "</td><td>" + 
				Math.round(railingParams.glass8[i].A) + "</td><td>" + 
				Math.round(railingParams.glass8[i].B) + "</td><td>" + 
				Math.round(railingParams.glass8[i].d1) + "</td><td>" + 
				Math.round(railingParams.glass8[i].d2) + "</td>" + 
				"</tr>";
			}
		text += "<tbody><table>";
		text += "Всего стекол: " + railingParams.glass8.length + "шт<br/>" + 
			"Сумма площадей описанных прямоугольников: " + Math.round(totalArea8 * 100) / 100 + " м2";
		}
	
	$("#glassParamsTable").html(text);
	
	//сохраняем данные по цене в глобальный объект
	var assemblingFinal = cost.assembling * 1.5;
	var deliveryFinal = cost.delivery * 1.5;
	var railingFinal = finalPrice - assemblingFinal - deliveryFinal;
	
	//приблизительное распрееление цены по цехам - надо доработать
	var glassTotal = (Math.round(cost.glass * params.glassCostFactor) + staircaseCost.railingGlass) * 2;
	var timberTotal = (staircaseCost.railingHandrails + staircaseCost.railingBal + staircaseCost.railingTimberPaint) * 2;
	var metalFinal = railingFinal - glassTotal - timberTotal;
	
	staircasePrice = {
		carcasFinal: 0,
		carcasMetalPaint: 0,
		treadsFinal: 0,
		carcasTimberPaint: 0,
		railingFinal: railingFinal,
		railingMetalPaint: 0,
		railingTimberPaint: 0,
		banisterFinal: 0,
		banisterMetalPaint: 0,
		banisterTimberPaint: 0,
		assemblingFinal: assemblingFinal,
		delivery: deliveryFinal,
		finalPrice: finalPrice,
		railing_metal: metalFinal,
		railing_timber: timberTotal,
		railing_glass: glassTotal,
		banister_metal: 0,
		banister_timber: 0,
		banister_glass: 0,
		}

	//формируем объект для выгрузки
	var exportObj = getExportData_com();
	
	printExportData(exportObj, "exportData")

};
