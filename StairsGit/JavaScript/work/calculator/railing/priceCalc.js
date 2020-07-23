var costMarkup = 1.3; //07.05 было 1.25;

function calcRailingModulePrice() {
	//расчет стоимости ограждений кроме самонесущего стекла

	//извлекаем кол-ва из глобального массива счетчиков

	railingParams.handrailAmt = 0;
	railingParams.handrailLength_sum = 0;
	if (partsAmt.handrails) {
		railingParams.handrailAmt = partsAmt.handrails.amt;
		railingParams.handrailLength_sum = partsAmt.handrails.sumLength;
	}

	railingParams.rigelAmt = 0;
	railingParams.rigelLength_sum = 0;
	if (partsAmt.rigels) {
		railingParams.rigelAmt = partsAmt.rigels.amt;
		railingParams.rigelLength_sum = partsAmt.rigels.sumLength;
	}

	railingParams.rackAmt = 0;
	if (partsAmt.racks) railingParams.rackAmt = partsAmt.racks.amt;

	railingParams.balAmt1 = 0;
	railingParams.balAmt2 = 0;
	if (partsAmt.forgedBal) {
		railingParams.balAmt1 = partsAmt.forgedBal.amt1;
		railingParams.balAmt2 = partsAmt.forgedBal.amt2;
	}

	railingParams.glassAmt = 0;
	railingParams.glassArea = 0;
	if (partsAmt.glasses) {
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
	staircaseCost.stockRailing = 0;
	staircaseCost.timberRailing = 0;

	calcRailingPrice(railingParams); //функция находится в файле /calculator/general/priceLib.js

	//округляем все рассчитанные цифры

	for (var prop in staircaseCost) {
		staircaseCost[prop] = Math.round(staircaseCost[prop]);
	}

	//расчет стоимости ограждений с самонесущим стеклом

	//обрщая площадь стекол
	var totalArea = 0;
	var totalArea8 = 0;
	var rutelAmt = 0;
	var holeAmt = 0;

	for (var i = 0; i < railingParams.glass.length; i++) {
		totalArea += railingParams.glass[i].area * 1.0;
		holeAmt += railingParams.glass[i].holeAmt * 1.0;
		rutelAmt += railingParams.glass[i].holeAmt * 1.0;
	}

	if (railingParams.glass8) {
		for (var i = 0; i < railingParams.glass8.length; i++) {
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
		// delivery: calculateAssemblingPrice2().delivery.price,
		// assembling: calcAssemblingWage().totalWage,
	}

	//параметры стекол
	var glassThk = 12;
	unitCost.glass = calcGlassCost(params.glassType, glassThk);

	if (params.isOrnament == "да") unitCost.glass += 2000;

	//количества

	var amt = {
		mdf: totalArea,
		glass: totalArea,
		sideHolders: railingParams.sideHolderAmt,
		glassHolders: railingParams.glassHolderAmt,
		rutels: rutelAmt,
		profile: getPartPropVal("glassProfiles", "sumLength", partsAmt) * 1.15, //15% на обрезки
		// delivery: 1,
		// assembling: 1,
	}
	// if (params.delivery == "нет") amt.delivery = 0;
	// if (params.isAssembling == "нет") amt.assembling = 0;

	var cost = {};
	var railingCost = 0;
	for (var prop in amt) {
		cost[prop] = amt[prop] * unitCost[prop];
		railingCost += cost[prop];
	}

	//добавляем стоимость прочих ограждений
	railingCost += staircaseCost.railing;

	staircaseCost.treads = 0;
	staircaseCost.skirting = 0;
	staircaseCost.risers = 0;
	// Стоимость обшивки
	if (params.stairType == 'массив') {
		var treadsTotalCost = 0;

		// Ступени
		var turnTreadCost = calcTimberParams(params.treadsMaterial).m2Price_40 * getPartPropVal('timberTurnTread', 'area');
		treadsTotalCost += turnTreadCost;

		var treadCost = calcTimberParams(params.treadsMaterial).m2Price_40 * getPartPropVal('tread', 'area');
		treadsTotalCost += treadCost;

		var platformTreadCost = calcTimberParams(params.treadsMaterial).m2Price_40 * getPartPropVal('platformTread', 'area');
		treadsTotalCost += platformTreadCost;

		treadsTotalCost = Math.floor(treadsTotalCost);

		// Подступенки
		var risersTotalCost = calcTimberParams(params.risersMaterial).m2Price_20 * getPartPropVal('riser', 'area');

		// Плинтуса
		var skirtingTotalCost = 0
		var skirtingCost = calcTimberParams(params.skirtingMaterial).m2Price_20 * getPartPropVal('skirting_hor', 'area');
		skirtingTotalCost += skirtingCost;

		skirtingTotalCost = Math.floor(skirtingTotalCost);

		var skirtingCost = calcTimberParams(params.skirtingMaterial).m2Price_20 * getPartPropVal('skirting_vert', 'area');
		skirtingTotalCost += skirtingCost;

		var treadsPaintPrice = calcTimberPaintPrice(params.timberPaint, params.treadsMaterial) * (getPartPropVal('timberTurnTread', 'paintedArea') + getPartPropVal('tread', 'paintedArea') + getPartPropVal('platformTread', 'paintedArea'));
		var riserPaintPrice = calcTimberPaintPrice(params.timberPaint, params.treadsMaterial) * (getPartPropVal('riser', 'paintedArea'));
		var skirtingPaintPrice = calcTimberPaintPrice(params.timberPaint, params.skirtingMaterial) * (getPartPropVal('skirting_hor', 'paintedArea') + getPartPropVal('skirting_hor', 'paintedArea'));

		staircaseCost.treads = Math.floor(treadsTotalCost + treadsPaintPrice);
		staircaseCost.skirting = Math.floor(skirtingTotalCost + skirtingPaintPrice);
		staircaseCost.risers = Math.floor(risersTotalCost + riserPaintPrice);
	}

	// var finalCost = cost.glass + staircaseCost.railing;
	staircaseCost.railing = railingCost;
	
	//распределение цены по цехам
	staircaseCost.railing_timber = cost.mdf + staircaseCost.railingHandrails + staircaseCost.railingBal + staircaseCost.railingTimberPaint;
	staircaseCost.railing_glass = cost.glass + staircaseCost.railingGlass;
	staircaseCost.railing_metal = railingCost - staircaseCost.railing_timber - staircaseCost.railing_glass;
			
	staircaseCost.railing_timber_part = staircaseCost.railing_timber / railingCost;
	staircaseCost.railing_glass_part = staircaseCost.railing_glass / railingCost;
	if(!staircaseCost.railing_timber_part) staircaseCost.railing_timber_part = 0;
	if(!staircaseCost.railing_glass_part) staircaseCost.railing_glass_part = 0;

// debugger
	//подробная себестоимость
	var text =
		"Шаблоны: " + Math.round(cost.mdf) + "<br/>" +
		"Стекла 12мм: " + Math.round(cost.glass) + "<br/>" +
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
		"Ступени: " + staircaseCost.treads + " руб; <br/>" +
		"Подступенки: " + staircaseCost.risers + " руб; <br/>" +
		"Плинтуса: " + staircaseCost.skirting + " руб; <br/>" +
		"<b>Общая себестоимость: " + Math.round(railingCost + staircaseCost.treads + staircaseCost.risers + staircaseCost.skirting) + "</b><br/>";

	$("#total_railing_cost").html(text);


	//параметры стекол 12мм
	var text = "<h3>Размеры стекол 12мм: </h3><table class='form_table'><tbody>" +
		"<tr><th>Площадь</th><th>A</th><th>B</th><th>d1</th><th>d2</th></tr> ";
	for (var i = 0; i < railingParams.glass.length; i++) {
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
	if (railingParams.glass8) {
		text += "<h3>Размеры стекол 8мм: </h3><table class='form_table'><tbody>" +
			"<tr><th>Площадь</th><th>A</th><th>B</th><th>d1</th><th>d2</th></tr> ";
		for (var i = 0; i < railingParams.glass8.length; i++) {
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
};