function printWrPriceNew(specObj_, wrParams){
	var modelInfo = "<h2>Параметры деталей, снятые с модели</h2>";
	for (var partName in specObj_) {
		if (specObj_[partName]) {
			for (var type in specObj_[partName]["types"]) {
				modelInfo += specObj_[partName].name + " " + type + ": " + specObj_[partName]["types"][type] + " шт<br/>"
			}
		}
	}

	var wrCostPar = calcWrPriceParams(specObj_, wrParams);
	
	modelInfo += "<h3>Расчетные параметры</h3>";
	if (specObj_.mirrow != undefined) modelInfo += "Уплотнитель для стекла 4мм: " + wrCostPar.mirrow + " м.п.<br/>"
	if (specObj_.vertCoupeProf != undefined) modelInfo += "Шлегель: " + wrCostPar.vertCoupeProf + " м.п.<br/>"
	if (wrCostPar.screwAmt) modelInfo += "Сборочный винт: " + wrCostPar.screwAmt + " шт<br/>"

	if (wrParams.sideWall_wr.indexOf('лдсп') != -1) {
		if (wrCostPar.totalAreaCarcas) modelInfo += "Чистая площадь лдсп 16мм: " + wrCostPar.totalAreaCarcas + " м2 (" + wrCostPar.ldspCarcasSheets + " лист.)<br/>"
		if (wrCostPar.totalAreaDoors) modelInfo += "Чистая площадь лдсп 10мм: " + wrCostPar.totalAreaDoors + " м2 (" + wrCostPar.ldspDoorSheets + " лист.)<br/>"
	}else{
		if (wrCostPar.totalAreaCarcas) modelInfo += "Чистая площадь каркаса: " + wrCostPar.totalAreaCarcas + " м2 (" + wrParams.sideWall_wr + ")<br/>"
		if (wrCostPar.totalAreaDoors) modelInfo += "Чистая площадь дверей: " + wrCostPar.totalAreaDoors + " м2 (" + wrParams.sideWall_wr + ")<br/>"
	}

	if (wrCostPar.totalAreaCarcas){
		if (wrParams.contentMat.indexOf('лдсп') != -1) {
			modelInfo += "Чистая площадь наполнения лдсп 16мм: " + wrCostPar.totalAreaContent + " м2 (" + wrCostPar.ldspContentSheets + " лист.)<br/>"
		}else{
			modelInfo += "Чистая площадь наполнения: " + wrCostPar.totalAreaContent + " м2 (" + wrParams.sideWall_wr + ")<br/>"
		}
	}

	$("#modelInfo").html(modelInfo);

	// //подробный расчет себестоимости
	// var text = "<table class='form_table'><tbody>" +
	// 	"<tr><th>Наименование</th><th>ед.изм.</th><th>Кол-во</th><th>Цена</th><th>Сумма</th></tr>";

	// for (var prop in wrCostPar.cost) {
	// 	if (wrCostPar.cost[prop]) {
	// 		text += "<tr><td>" + wrCostPar.cost[prop].name +
	// 			"</td><td>" + wrCostPar.cost[prop].unitName +
	// 			"</td><td>" + wrCostPar.cost[prop].amt +
	// 			"</td><td>" + Math.round(wrCostPar.cost[prop].unitCost) +
	// 			"</td><td>" + wrCostPar.cost[prop].sum + "</td></tr>";
	// 	}
	// }

	// text += "</tbody></table>";

	// text += "<b>Детали: " + wrCostPar.totalCostWr + "</b></br>" +
	// 	"<b>Сборка: " + wrCostPar.cost.assembling.sum + "</b></br>" +
	// 	"<b>Всего: " + (wrCostPar.cost.assembling.sum + wrCostPar.totalCostWr) + "</b></br>";

	// $("#cost_full_wr").html(text);


	// //сводная таблица
	
	// var text = "<table class='form_table'><tbody>" +
	// 	"<tr><th>Наименование</th><th>Себестоимость</th><th>Цена без скидки</th><th>Цена со скидкой</th></tr>";

	// for (var prop in wrCostPar.partsPrice) {
	// 	text += "<tr><td>" + wrCostPar.partsPrice[prop].name + "</td><td>" + wrCostPar.partsPrice[prop].cost + "</td><td>" + wrCostPar.partsPrice[prop].price + "</td><td>" + Math.round(wrCostPar.partsPrice[prop].price * (1 - params.discountFactor / 100)) + "</td></tr>";
	// }

	// text += "<tr><td><b>Итого</b></td><td><b>" + wrCostPar.totalPrice.cost + "</b></td><td><b>" + wrCostPar.totalPrice.price + "</b></td><td><b>" + Math.round(wrCostPar.totalPrice.price * (1 - params.discountFactor / 100)) + "</b></td></tr>";
	// text += "</tbody></table>";
	// text += "<b class='yellow'>Валовая прибыль: " + wrCostPar.vp + " руб (" + wrCostPar.vp_pers + "%)</b></br>";

	// $("#total_cost_wr").html(text);


	//Вывод цены
	staircaseCost.total = 0;
	staircaseCost.assembling = wrCostPar.cost.assembling.sum;
	// text = "";
	for (var prop in wrCostPar.partsPrice) {
		// text += "Стоимость " + wrCostPar.partsPrice[prop].name + ": " + Math.round(wrCostPar.partsPrice[prop].price) + " руб.</br>";
		staircaseCost[prop] = wrCostPar.partsPrice[prop].cost;
		staircaseCost.total += wrCostPar.partsPrice[prop].cost;
	}

	// text += "<h3>Общая стоимость: </h3>"
	// text += "<b>Общая стоимость шкафа со сборкой: " + Math.round(wrCostPar.totalPrice.price) + " руб.</b></br>" +
	// 	"<b class='yellow'>Скидка: " + Math.round(wrCostPar.discount) + " руб.</b></br>" +
	// 	"<b class='yellow'>Цена со скидкой: " + wrCostPar.discountPrice + " руб.</b></br>";

	// $("#totalResult_wr").html(text);

}

function calcWrPriceParams(_specObj, wrParams){
    var mirrow = 0;
    if (_specObj.mirrow) mirrow = Math.ceil(_specObj.mirrow.perim * 10) / 10; //Уплотнитель для стекла
    var vertCoupeProf = 0;
    if(_specObj.vertCoupeProf) vertCoupeProf = Math.ceil(_specObj.vertCoupeProf.sumLength * 10) / 10; // Шлегель
	var screwAmt = 0;
	if (_specObj.botCoupeProf != undefined) screwAmt += _specObj.botCoupeProf.amt * 2;
	if (_specObj.topCoupeProf != undefined) screwAmt += _specObj.topCoupeProf.amt * 2;
	if (_specObj.inpostCoupeProf != undefined) screwAmt += _specObj.inpostCoupeProf.amt * 2;

	var totalAreaCarcas = 0;
	var totalAreaContent = 0;
	var totalAreaDoors = 0;
	var dspSheetArea = 2.8 * 2.07;
	if (_specObj.carcasPanel != undefined) totalAreaCarcas += _specObj.carcasPanel.area;
	if (_specObj.boxPanel != undefined) totalAreaContent += _specObj.boxPanel.area;
	if (_specObj.shelf != undefined) totalAreaContent += _specObj.shelf.area;

	if (_specObj.doorPanel != undefined) totalAreaDoors += _specObj.doorPanel.area;

	var totalAreaCarcas = Math.ceil(totalAreaCarcas * 10) / 10;
	var ldspCarcasSheets = Math.ceil(totalAreaCarcas / dspSheetArea * 10) / 10;
	var totalAreaDoors = Math.ceil(totalAreaDoors * 10) / 10;
	var ldspDoorSheets = Math.ceil(totalAreaDoors / dspSheetArea * 10) / 10;
	var totalAreaContent = Math.ceil(totalAreaContent * 10) / 10;
	var ldspContentSheets = Math.ceil(totalAreaContent / dspSheetArea * 10) / 10;
	

	//расценки за единицу
	var caracasMaterialCost = 40;
	var doorMaterialCost = 400;
	var contentMaterialCost = 400;
	
	var doorsMat = 'лдсп';
	if (wrParams.doorsMat_wr.indexOf('шпон') != -1) doorsMat = 'шпон';
	if (wrParams.doorsMat_wr == 'шоколад' || wrParams.doorsMat_wr.indexOf('щит') != -1) doorsMat = 'шпон';

	var carcasMat = 'лдсп';
	if (wrParams.sideWall_wr.indexOf('шпон') != -1) carcasMat = 'шпон';
	if (wrParams.sideWall_wr.indexOf('щит') != -1) carcasMat = 'шпон';

	var timberParams = calcTimberParams('шпон');
	if (carcasMat == "шпон") caracasMaterialCost = timberParams.m3Price * (wrParams.carcasThk_wr / 1000);
	if (doorsMat == "шпон") doorMaterialCost = timberParams.m3Price * (wrParams.doorsThk_wr / 1000);
	if (wrParams.contentMat == "шпон")contentMaterialCost = timberParams.m3Price * (wrParams.contentThk_wr / 1000);

	var timberParams = calcTimberParams(params.additionalObjectsTimberMaterial);
	if (carcasMat == "щит") caracasMaterialCost = timberParams.m3Price * (wrParams.carcasThk_wr / 1000);
	if (doorsMat == "щит") doorMaterialCost = timberParams.m3Price * (wrParams.doorsThk_wr / 1000);
	if (wrParams.contentMat == "щит") contentMaterialCost = timberParams.m3Price * (wrParams.contentThk_wr / 1000);

	var dspCutFacktor = 1.5; //к-т, учитывающий стоимость работы по раскрою и кромлению
	var dspTrashfacktor = 1.3; //к-т, учитывающий отходы
	var curvePanelFacktor = 1.5; //к-т на криволинейные детали

	var unitCost = {
		carcasPanel: caracasMaterialCost * dspCutFacktor * dspTrashfacktor, //м2
		boxPanel: contentMaterialCost * dspCutFacktor * dspTrashfacktor, //м2
		shelf: contentMaterialCost * dspCutFacktor * dspTrashfacktor, //м2
		doorPanel: doorMaterialCost * dspCutFacktor * dspTrashfacktor, //м2
		curvePanel: contentMaterialCost * dspCutFacktor * dspTrashfacktor * curvePanelFacktor, //м2
		metalBoxPanel: 300, //шт
		rearPanel: 100 * dspCutFacktor * dspTrashfacktor, //м2
		boxBotPanel: 100 * dspCutFacktor * dspTrashfacktor, //м2
		topRail: 3500 / 5.4, //м.п.
		botRail: 1300 / 5.4, //м.п.
		botCoupeProf: 1500 / 5.4, //м.п.
		topCoupeProf: 900 / 5.4, //м.п.
		vertCoupeProf: 1500 / 5.4, //м.п.
		inpostCoupeProf: 1100 / 5.4, //м.п.
		rail: 100, //м.п.
		mirrow: 1400, //м2
		pantograph: 2800,
		frameRail: 150,
		fixAngle: 8,
		screw: 2,
		legM8: 10,
		jokerFitting: 100,
		jokerFlan: 20,
	}

	//задняя стенка
	if (wrParams.rearWallMat_wr == "лдсп") {
		unitCost.rearPanel = unitCost.carcasPanel;
		if (wrParams.rearWallThk_wr < 16) unitCost.rearPanel = unitCost.doorPanel;
	}

	//профили
	if (wrParams.doorProfMat_wr == "эконом") {
		unitCost.topRail = 1500 / 5.4
		unitCost.botRail = 750 / 5.4
		unitCost.botCoupeProf = 1200 / 5.4;
		unitCost.topCoupeProf = 650 / 5.4;
		unitCost.vertCoupeProf = 1050 / 5.4;
		unitCost.inpostCoupeProf = 590 / 5.4;
	}
	if (wrParams.doorProfMat_wr == "стандарт") {
		unitCost.vertCoupeProf = 1700 / 5.4;
	}
	if (wrParams.doorProfMat_wr == "flat") {
		unitCost.vertCoupeProf = 1800 / 5.4;
	}
	if (wrParams.doorProfMat_wr == "fusion") {
		unitCost.vertCoupeProf = 2500 / 5.4;
	}
	if (wrParams.doorProfMat_wr == "H") {
		unitCost.vertCoupeProf = 1750 / 5.4;
	}

	var cost = {};

	//себестоимость позиций, снятых с модели
	for (var prop in _specObj) {
		cost[prop] = {
			amt: 0,
			unitCost: unitCost[prop],
			name: _specObj[prop].name,
			sum: 0,
			unitName: "м2",
			unit: _specObj[prop].unit,
		}

		if (_specObj[prop].area != undefined) {
			cost[prop].amt = Math.round(_specObj[prop].area * 100) / 100;
		} else {
			cost[prop].amt = Math.round(_specObj[prop].sumLength * 100) / 100;
			cost[prop].unitName = "м.п.";
		}
		if (prop == "metalBoxPanel" ||
			prop == "pantograph" ||
			prop == "frameRail" ||
			prop == "fixAngle" ||
			prop == "screw" ||
			prop == "legM8" ||
			prop == "jokerFitting" ||
			prop == "jokerFlan") {
			cost[prop].amt = Math.round(_specObj[prop].amt * 100) / 100;
			cost[prop].unitName = "шт";
		}


		if (cost[prop].unitCost) cost[prop].sum = Math.round(cost[prop].amt * cost[prop].unitCost);
		else console.log("Не удалось посчитать себестоимость детали " + prop)
	};

	//фурнитура дверей
	cost.doorWeels = {
		amt: wrParams.kupeDoorAmt_wr,
		unitCost: 200,
		name: "Комплект фурнитуры для двери",
		sum: 0,
		unitName: "шт",
		unit: "doors",
	}
	cost.doorWeels.sum = cost.doorWeels.amt * cost.doorWeels.unitCost;

	//работа по изготовлению дверей
	cost.doorWork = {
		amt: wrParams.kupeDoorAmt_wr,
		unitCost: 1000,
		name: "Изготовление дверей",
		sum: 0,
		unitName: "шт",
		unit: "doors",
	}
	cost.doorWork.sum = cost.doorWork.amt * cost.doorWork.unitCost;

	var totalCostWr = 0;

	var partsPrice = {
		carcas: {
			cost: 0,
			price: 0,
			name: "каркаса",
			costFactor: params.carcasCostFactor || 1,
			priceFactor: params.carcasPriceFactor || 1,
		},
		doors: {
			cost: 0,
			price: 0,
			name: "дверей",
			costFactor: params.doorsCostFactor || 1,
			priceFactor: params.doorsPriceFactor || 1,
		},
		content: {
			cost: 0,
			price: 0,
			name: "наполнения",
			costFactor: params.contentCostFactor || 1,
			priceFactor: params.contentPriceFactor || 1,
		},
		assembling: {
			cost: 0,
			price: 0,
			name: "сборки",
			costFactor: params.assemblingCostFactor || 1,
			priceFactor: params.assemblingPriceFactor || 1,
		},
	}
	var totalPrice = {
		cost: 0,
		price: 0,
	}
	var margin = 2;

	//подробный расчет себестоимости

	for (var prop in cost) {
		if (cost[prop]) {
			totalCostWr += cost[prop].sum;
			if (partsPrice[cost[prop].unit]) {
				partsPrice[cost[prop].unit].cost += cost[prop].sum * partsPrice[cost[prop].unit].costFactor;
				totalPrice.cost += cost[prop].sum * partsPrice[cost[prop].unit].costFactor;
				partsPrice[cost[prop].unit].price += cost[prop].sum * margin * partsPrice[cost[prop].unit].priceFactor;
				totalPrice.price += cost[prop].sum * margin * partsPrice[cost[prop].unit].priceFactor;
			}
		}
	}

	//сборка
	cost.assembling = {
		amt: 1,
		unitCost: 0,
		name: "Сборка",
		sum: Math.round(totalCostWr * 0.12),
		unitName: "шт",
	}
	//минималка на монтаж 3000р
	if (cost.assembling.sum < 3000) cost.assembling.sum = 3000;

	partsPrice.assembling.cost += cost.assembling.sum * partsPrice.assembling.costFactor;
	partsPrice.assembling.price += cost.assembling.sum * margin * partsPrice.assembling.priceFactor;
	totalPrice.cost += partsPrice.assembling.cost;
	totalPrice.price += partsPrice.assembling.price;

	var totalCost = cost.assembling.sum + totalCostWr;

	var vp = Math.round(totalPrice.price * (1 - params.discountFactor / 100)) - totalPrice.cost;
	var vp_pers = Math.round(vp / totalPrice.cost * 100);

	var discount = Math.round(totalPrice.price * params.discountFactor / 100);

	return {
		'mirrow': mirrow,
		'vertCoupeProf': vertCoupeProf,
		'screwAmt': screwAmt,
		'ldspDoorSheets': ldspDoorSheets,
		'ldspCarcasSheets': ldspCarcasSheets,
		'totalAreaDoors': totalAreaDoors,
		'totalAreaCarcas': totalAreaCarcas,
		'totalAreaContent': totalAreaContent,
		'ldspContentSheets': ldspContentSheets,
		'cost': cost,
		'totalCostWr': totalCostWr,
		'partsPrice': partsPrice,
		'totalPrice': totalPrice,
		'vp': vp,
		'vp_pers': vp_pers,
		'discount': discount,
		'discountPrice': Math.round(totalPrice.price - discount)
	}
}
