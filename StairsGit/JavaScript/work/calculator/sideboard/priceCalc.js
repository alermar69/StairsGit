function calcPrice(){

var cost = {
	carcas: {
		name: "Каркас",
		material: 0,
		work: 0,
		painting: 0,
		total: 0,
		costFactor: params.carcasCostFactor,
		priceFactor: params.carcasPriceFactor,
		},
	content: {
		name: "Наполнение",
		material: 0,
		work: 0,
		painting: 0,
		total: 0,
		costFactor: params.contentCostFactor,
		priceFactor: params.contentPriceFactor,
		},
	doors: {
		name: "Фасады",
		material: 0,
		work: 0,
		painting: 0,
		total: 0,
		costFactor: params.doorsCostFactor,
		priceFactor: params.doorsPriceFactor,
		},
	total: {
		name: "Итого",
		material: 0,
		work: 0,
		painting: 0,
		total: 0,
		},
	}

	/*
	countertop
	handle
	mdfPlate
	timberPlate
	timberPole
	sideBridge
	drawerSidePlate
	drawerFrontPlate
	door
	drawerBotPlate
	drawerSlide
	rail
	*/

	var hourCost = 500; //расценка в час

/*** КАРКАС ***/

	
	//материалы
	var matParams = calcTimberParams(params.carcasMat_wr);
	var mdfMeterPrice = 1000;
	
	//столешница

	var partId = "countertop";
	var amtId = "area";
	var unitPrice = matParams.m2Price_20;
	if(params.model == "Брутал") unitPrice = matParams.m2Price_40;
	
	cost.carcas.material += partsAmt[partId][amtId] * unitPrice;
	
	//бруски
	
	var partId = "timberPole";
	var amtId = "sumLength";
	var unitPrice = matParams.m2Price_20 * 0.1;
	
	cost.carcas.material += partsAmt[partId][amtId] * unitPrice;

	//панели мдф
		
	var partId = "mdfPlate";
	var amtId = "area";
	var unitPrice = mdfMeterPrice;
	
	cost.carcas.material += partsAmt[partId][amtId] * unitPrice;
	
	//изготовление	
	
	//изготовление деталей
	cost.carcas.work += hourCost * ((getPartAmt("countertop") + getPartAmt("timberPole") + getPartAmt("mdfPlate")) * 5/60 + 15/60)
	
	//сборка боковин
	if(params.model == "Сканди") cost.carcas.work += 2 * 2 * hourCost; //2 часа на одну боковину
	if(params.model == "Брутал") cost.carcas.work += 2 * 1.5 * hourCost;
	if(params.height > 1200) cost.carcas.work *= params.height / 800; //шкаф 1,6м высотой в 2 раза сложнее чем 800мм
	
	
	
	//покраска
	
	var sumArea = partsAmt["countertop"]["area"] * 2 + partsAmt["countertop"]["paintedArea"] + partsAmt["mdfPlate"]["area"] * 2;
	var meterPaintCost = 700;
	if(params.carcasPaint_wr == "морилка+лак" || params.carcasPaint_wr == "морилка+масло") meterPaintCost = 1000;
	cost.carcas.painting = meterPaintCost * sumArea;
	
	//общая стоимость
	
	cost.carcas.total = cost.carcas.material + cost.carcas.work + cost.carcas.painting;
	
	
/*** НАПОЛНЕНИЕ ***/
	
	//материалы
	var matParams = calcTimberParams(params.contentMat_wr);
	
	//ящики
	
	var partId = "drawerSidePlate";
	var amtId = "area";
	var unitPrice = matParams.m2Price_20;
	cost.content.material += getPartArea(partId) * unitPrice;
	
	var partId = "drawerFrontPlate";
	var amtId = "area";
	var unitPrice = matParams.m2Price_20;
	cost.content.material += getPartArea(partId) * unitPrice;
	
	var partId = "drawerBotPlate";
	var amtId = "area";
	var unitPrice = mdfMeterPrice;
	cost.content.material += getPartArea(partId) * unitPrice;
	
	var partId = "sideBridge";
	var amtId = "amt";
	var unitPrice = matParams.m2Price_20 * 0.06 * 0.5;
	cost.content.material += getPartAmt(partId) * unitPrice;
	
	var partId = "drawerSlide";
	var amtId = "amt";
	var unitPrice = 600;
	cost.content.material += getPartAmt(partId) * unitPrice;
	
	var partId = "shelf";
	var amtId = "area";
	var unitPrice = mdfMeterPrice;
	cost.content.material += getPartArea(partId) * unitPrice;
	
	
	//работа
	
	//изготовление деталей
	cost.content.work += hourCost * ((getPartAmt("drawerSlide") * 4 + getPartAmt("sideBridge") + getPartAmt("shelf")) * 5/60)
	
	//сборка ящиков
	if(params.model == "Сканди") cost.content.work += 0.2 * getPartAmt("drawerSlide") * hourCost; //0,2 часа на один ящик

	//покраска
	
	var sumArea = getPartArea("drawerSidePlate") * 2 + getPartArea("drawerFrontPlate") * 2 + getPartArea("drawerBotPlate") * 2 + getPartAmt("sideBridge") * (0.06 * 2 + 0.02 * 2) * 0.5 + getPartArea("shelf") * 2;
	var meterPaintCost = 700;
	if(params.carcasPaint_wr == "морилка+лак" || params.carcasPaint_wr == "морилка+масло") meterPaintCost = 1000;
	cost.content.painting = meterPaintCost * sumArea;
	
	//общая стоимость
	
	cost.content.total = cost.content.material + cost.content.work + cost.content.painting;
	
	
/*** ФАСАДЫ ***/
	
	//материалы
	var matParams = calcTimberParams(params.doorsMat_wr);
	
	var partId = "door";
	var amtId = "area";
	var unitPrice = matParams.m2Price_20;
	cost.doors.material += getPartArea(partId) * unitPrice;
	
	var partId = "framedDoor";
	var amtId = "area";
	var unitPrice = matParams.m2Price_20;
	cost.doors.material += getPartArea(partId) * unitPrice;

	//работа
	
	//изготовление деталей
	cost.doors.work += hourCost * (getPartAmt("door") * 10/60);
	cost.doors.work += hourCost * (getPartAmt("framedDoor") * 3);
	
	//покраска
	var sumArea = getPartArea("door") + getPartArea("framedDoor");
	var meterPaintCost = 700;
	if(params.doorsPaint_wr == "морилка+лак" || params.doorsPaint_wr == "морилка+масло") meterPaintCost = 1000;
	cost.doors.painting = meterPaintCost * sumArea;
	
	//общая стоимость 
	
	cost.doors.total = cost.doors.material + cost.doors.work + cost.doors.painting;
	
	
/*** Общие параметры ***/
	
	for(var unit in cost){
		if(unit != "total"){
			for(var prop in cost[unit]){
				if(prop != "name"){
					cost.total[prop] += cost[unit][prop];
					}
				}
			}
		}

	
	var price = {};
	var margin = 2.2;
	
	for(var unit in cost){
		if(unit != "total"){
			price[unit] = Math.round(cost[unit].total * cost[unit].priceFactor * margin);
			}
		}
	
	//итоговая цена
	price.total = 0;
	for(var unit in price){
		if(unit != "total"){
			price.total += price[unit];
			}
		}
		
	price.discount = Math.round(price.total * params.discountFactor / 100);
	//расчет скидки
	if(params.discountMode != "процент"){
		if(params.discountMode == "скидка"){
			price.discount = params.discountFactor
			}
		if(params.discountMode == "цена"){
			price.discount = price.total - params.discountFactor;
			}
		
		}
	
	//вывод расчета на страницу
	
	var text = "";
	text += "Cтоимость каркаса: " + price.carcas + " руб; <br/>" +
		"Cтоимость наполнения: " + price.content + " руб; <br/>" +
		"Cтоимость фасадов: " + price.doors + " руб; <br/>" +
		"<b>Итого: " + price.total + " руб;</b> <br/>" +
		"<b class='yellow'>Скидка: " + price.discount + " руб; </b><br/>" +
		"<b class='yellow'>Цена со скидкой: " + (price.total - price.discount) + " руб; </b><br/>";

	$("#totalResult").html(text);
	
	//вывод подробного расчета себестоимости (без к-тов)
	var costText = "";
	for(var unit in cost){
			costText += "<b>" + cost[unit]["name"] + "</b><br/>" +
				"Материал: " + Math.round(cost[unit]["material"]) +  " руб; <br/>" + 
				"Работа: " + Math.round(cost[unit]["work"]) +  " руб; <br/>" + 
				"Покраска: " + Math.round(cost[unit]["painting"]) +  " руб; <br/>" + 
				"Итого: " + Math.round(cost[unit]["total"]) +  " руб; <br/>";
			}
		
	$("#cost_full").html(costText);
 
	//вывод расчета с учетом коэффициентов
	cost.total = {
		name: "Итого",
		material: 0,
		work: 0,
		painting: 0,
		total: 0,
		};
	for(var unit in cost){
		if(unit != "total"){
			for(var prop in cost[unit]){
				if(prop != "name"){
					cost[unit][prop] = Math.round(cost[unit][prop])
					cost.total[prop] += cost[unit][prop] * cost[unit].costFactor;
					}
				}
			cost[unit].total *= cost[unit].costFactor;
			}
		}
	
	
//сводная таблица
	
	var vp = Math.round((price.total - price.discount) - cost.total.total);
	var vp_pers = Math.round(vp / (price.total - price.discount) * 100);
	
	var text = "<table class='form_table'><tbody>" + 
		"<tr><th>Наименование</th><th>Себестоимость</th><th>Цена без скидки</th><th>Цена со скидкой</th></tr>";

	for(var unit in cost){
		var unitDiscount = price.discount * price[unit] / price.total;
		text += "<tr><td>" + cost[unit].name + "</td><td>" + cost[unit].total + "</td><td>" + price[unit] + "</td><td>" + Math.round(price[unit] - unitDiscount) + "</td></tr>"; 
		}
	
	text += "</tbody></table>";
	text += "<b class='yellow'>Валовая прибыль: " + vp + " руб (" + vp_pers  + "%)</b></br>";

	$("#total_cost").html(text);
	
	//формируем объект для выгрузки
	//var exportObj = getExportData_com();
	//console.log(exportObj)
	
	
}//end of calcPrice