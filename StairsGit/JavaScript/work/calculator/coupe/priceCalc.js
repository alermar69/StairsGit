function calculateCarcasPrice(){
	
	var modelInfo = "<h2>Параметры деталей, снятые с модели</h2>";
	for(var partName in specObj){
		if(specObj[partName]){
			for(var type in specObj[partName]["types"]){
				modelInfo +=  specObj[partName].name + " " + type + ": " + specObj[partName]["types"][type] + " шт<br/>"
				}
			}
		}
	modelInfo += "<h3>Расчетные параметры</h3>";
	if(specObj.mirrow != undefined) modelInfo += "Уплотнитель для стекла 4мм: " + Math.ceil(specObj.mirrow.perim * 10) / 10 + " м.п.<br/>"
	if(specObj.vertCoupeProf != undefined) modelInfo += "Шлегель: " + Math.ceil(specObj.vertCoupeProf.sumLength * 10) / 10 + " м.п.<br/>"
	var screwAmt = 0;
	if(specObj.botCoupeProf != undefined) screwAmt += specObj.botCoupeProf.amt * 2;
	if(specObj.topCoupeProf != undefined) screwAmt += specObj.topCoupeProf.amt * 2;
	if(specObj.inpostCoupeProf != undefined) screwAmt += specObj.inpostCoupeProf.amt * 2;
	if(screwAmt) modelInfo += "Сборочный винт: " + screwAmt + " шт<br/>"
	
	var totalAreaDsp16 = 0;
	var totalAreaDsp10 = 0;
	var sheetArea = 2.8*2.07;
	if(specObj.carcasPanel != undefined) totalAreaDsp16 += specObj.carcasPanel.area;
	if(specObj.boxPanel != undefined) totalAreaDsp16 += specObj.boxPanel.area;
	if(specObj.shelf != undefined) totalAreaDsp16 += specObj.shelf.area;
	
	if(specObj.doorPanel != undefined) totalAreaDsp10 += specObj.doorPanel.area;
	
	if(totalAreaDsp16) modelInfo += "Чистая площадь лдсп 16мм: " + Math.ceil(totalAreaDsp16 * 10) / 10 + " м2 ("+ Math.ceil(totalAreaDsp16 / sheetArea * 10) / 10 + " лист.)<br/>"
	if(totalAreaDsp10) modelInfo += "Чистая площадь лдсп 10мм: " + Math.ceil(totalAreaDsp10 * 10) / 10 + " м2 ("+ Math.ceil(totalAreaDsp10 / sheetArea * 10) / 10 + " лист.)<br/>"
	
	$("#modelInfo").html(modelInfo);

	//параметры, рассчитываемые по исходным данным
	var boxAmt = 0;
	var railAmt = 0;
	$(".boxType").each(function(){
		if($(this).val() == "ящик") boxAmt += 1;
		if($(this).val() == "штанга") railAmt += 1;
		})
		
	//расценки за единицу
	var dsp16MeterCost = 350;
	var dsp10MeterCost = 300;
	if(params.carcasMat == "лдсп стандарт"){ 
		dsp16MeterCost = 400;
		dsp10MeterCost = 350;
		}
	if(params.carcasMat == "лдсп премиум"){
		dsp16MeterCost = 450;
		dsp10MeterCost = 400;
		}
	
	var dspCutFacktor = 1.5; //к-т, учитывающий стоимость работы по раскрою и кромлению
	var dspTrashfacktor = 1.3; //к-т, учитывающий отходы
	var curvePanelFacktor = 1.5; //к-т на криволинейные детали
	
	var unitCost = {
		carcasPanel: dsp16MeterCost * dspCutFacktor * dspTrashfacktor, //м2
		boxPanel: dsp16MeterCost * dspCutFacktor * dspTrashfacktor, //м2
		shelf: dsp16MeterCost * dspCutFacktor * dspTrashfacktor, //м2
		doorPanel: dsp10MeterCost * dspCutFacktor * dspTrashfacktor, //м2
		curvePanel: dsp16MeterCost * dspCutFacktor * dspTrashfacktor * curvePanelFacktor, //м2
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
	if(params.rearWallMat_wr == "лдсп") {
		unitCost.rearPanel = unitCost.carcasPanel;
		if(params.rearWallThk_wr < 16) unitCost.rearPanel = unitCost.doorPanel;
		}
	
	//профили
	if(params.doorProfMat_wr == "эконом"){
		unitCost.topRail = 1500 / 5.4
		unitCost.botRail = 750 / 5.4
		unitCost.botCoupeProf = 1200 / 5.4;
		unitCost.topCoupeProf = 650 / 5.4;
		unitCost.vertCoupeProf = 1050 / 5.4;
		unitCost.inpostCoupeProf = 590 / 5.4;
		}
	if(params.doorProfMat_wr == "стандарт"){
		unitCost.vertCoupeProf =  1700 / 5.4;
		}
	if(params.doorProfMat_wr == "flat"){
		unitCost.vertCoupeProf =  1800 / 5.4;
		}
	if(params.doorProfMat_wr == "fusion"){
		unitCost.vertCoupeProf = 2500 / 5.4;
		}
	if(params.doorProfMat_wr == "H"){
		unitCost.vertCoupeProf =  1750 / 5.4;
		}
	
	var cost = {};
	
	//себестоимость позиций, снятых с модели
	for(var prop in specObj){
		cost[prop] = {
			amt: 0,
			unitCost: unitCost[prop],
			name: specObj[prop].name,
			sum: 0,
			unitName: "м2",
			unit: specObj[prop].unit,
			}

		if(specObj[prop].area != undefined) {
			cost[prop].amt = Math.round(specObj[prop].area * 100) / 100; 
			}
		else {
			cost[prop].amt = Math.round(specObj[prop].sumLength * 100) / 100;
			cost[prop].unitName = "м.п.";
			}
		if(prop == "metalBoxPanel" || 
			prop == "pantograph" || 
			prop == "frameRail" || 
			prop == "fixAngle" ||
			prop == "screw" || 
			prop == "legM8" || 
			prop == "jokerFitting" || 
			prop == "jokerFlan") {
				cost[prop].amt  = Math.round(specObj[prop].amt * 100) / 100;
				cost[prop].unitName = "шт";
				}
			
	
		if(cost[prop].unitCost) cost[prop].sum = Math.round(cost[prop].amt * cost[prop].unitCost);
		else console.log("Не удалось посчитать себестоимость детали " + prop)
		};
	
	//фурнитура дверей
	cost.doorWeels = {
		amt: params.kupeDoorAmt_wr,
		unitCost: 200,
		name: "Комплект фурнитуры для двери",
		sum: 0,
		unitName: "шт",
		unit: "doors",
		}
	cost.doorWeels.sum = cost.doorWeels.amt * cost.doorWeels.unitCost;
	
	//работа по изготовлению дверей
	cost.doorWork = {
		amt: params.kupeDoorAmt_wr,
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
			costFactor: params.carcasCostFactor,
			priceFactor: params.carcasPriceFactor,
			},
		doors: {
			cost: 0,
			price: 0,
			name: "дверей",
			costFactor: params.doorsCostFactor,
			priceFactor: params.doorsPriceFactor,
			},
		content: {
			cost: 0,
			price: 0,
			name: "наполнения",
			costFactor: params.contentCostFactor,
			priceFactor: params.contentPriceFactor,
			},
		assembling: {
			cost: 0,
			price: 0,
			name: "сборки",
			costFactor: params.assemblingCostFactor,
			priceFactor: params.assemblingPriceFactor,
			},
		}
	var totalPrice = {
		cost: 0,
		price: 0,
		}
	var margin = 2;

//подробный расчет себестоимости
	
	var text = "<table class='form_table'><tbody>" + 
		"<tr><th>Наименование</th><th>ед.изм.</th><th>Кол-во</th><th>Цена</th><th>Сумма</th></tr>";
	for(var prop in cost){
		if(cost[prop]){
			text += "<tr><td>" + cost[prop].name + 
				"</td><td>" + cost[prop].unitName + 
				"</td><td>" + cost[prop].amt + 
				"</td><td>" + Math.round(cost[prop].unitCost) + 
				"</td><td>" + cost[prop].sum + "</td></tr>";
			totalCostWr += cost[prop].sum;
			if(partsPrice[cost[prop].unit]) {
				partsPrice[cost[prop].unit].cost += cost[prop].sum * partsPrice[cost[prop].unit].costFactor;
				totalPrice.cost += cost[prop].sum * partsPrice[cost[prop].unit].costFactor;
				partsPrice[cost[prop].unit].price += cost[prop].sum * margin * partsPrice[cost[prop].unit].priceFactor;
				totalPrice.price += cost[prop].sum * margin * partsPrice[cost[prop].unit].priceFactor;
				}
			}
		}
		
	text += "</tbody></table>";
	
	//сборка
	cost.assembling = {
		amt: 1,
		unitCost: 0,
		name: "Сборка",
		sum: Math.round(totalCostWr * 0.12),
		unitName: "шт",
		}
	//минималка на монтаж 3000р
	if(cost.assembling.sum < 3000) cost.assembling.sum = 3000;
	
	partsPrice.assembling.cost += cost.assembling.sum * partsPrice.assembling.costFactor;
	partsPrice.assembling.price += cost.assembling.sum * margin * partsPrice.assembling.priceFactor;
	totalPrice.cost += partsPrice.assembling.cost;
	totalPrice.price += partsPrice.assembling.price;
	
	text += "<b>Детали: " + totalCostWr + "</b></br>" + 
		"<b>Сборка: " + cost.assembling.sum + "</b></br>" + 
		"<b>Всего: " + (cost.assembling.sum + totalCostWr) + "</b></br>";
	
	$("#cost_full").html(text);
	

//сводная таблица
	
	var vp = Math.round(totalPrice.price * (1 - params.discountFactor / 100)) - totalPrice.cost;
	var vp_pers = Math.round(vp / totalPrice.cost * 100);
	
	var text = "<table class='form_table'><tbody>" + 
		"<tr><th>Наименование</th><th>Себестоимость</th><th>Цена без скидки</th><th>Цена со скидкой</th></tr>";

	for(var prop in partsPrice){
		text += "<tr><td>" + partsPrice[prop].name + "</td><td>" + partsPrice[prop].cost + "</td><td>" + partsPrice[prop].price + "</td><td>" + Math.round(partsPrice[prop].price * (1 - params.discountFactor / 100)) + "</td></tr>";
		}
	
	text += "<tr><td><b>Итого</b></td><td><b>" + totalPrice.cost + "</b></td><td><b>" + totalPrice.price + "</b></td><td><b>" + Math.round(totalPrice.price * (1 - params.discountFactor / 100)) + "</b></td></tr>";
	text += "</tbody></table>";
	text += "<b class='yellow'>Валовая прибыль: " + vp + " руб (" + vp_pers  + "%)</b></br>";

	$("#total_cost").html(text);
	
	
	
//Вывод цены
	
	var discount = Math.round(totalPrice.price * params.discountFactor / 100)
	text = "";
	for(var prop in partsPrice){
		text += "Стоимость " + partsPrice[prop].name + ": " + Math.round(partsPrice[prop].price) + " руб.</br>";
		}
		
	text += "<h3>Общая стоимость: </h3>"
	text += "<b>Общая стоимость шкафа со сборкой: " + Math.round(totalPrice.price) + " руб.</b></br>" +
		"<b class='yellow'>Скидка: " + Math.round(discount) + " руб.</b></br>" + 
		"<b class='yellow'>Цена со скидкой: " + Math.round(totalPrice.price - discount) + " руб.</b></br>";
	
	$("#price_wardrobe").html(text);
	
	
	
	
	
}//end of calcWrPrice




function printWrPrice(){

if(!wrParams.carcasPanels) return;

	var text = 
	"Каркас: " + wrPrice.carcas + "</br>" + 
	"Фасады: " + wrPrice.doors + "</br>" + 
	"Фурнитура: " + wrPrice.metis + "</br>" +
	"Покраска: " + wrPrice.painting + "</br>" +	
	"<b>Итого: " + (wrPrice.total + wrPrice.painting) + "</b></br>";

	$("#price_wardrobe").html(text);

}



function printWrCost(par){

if(!wrParams.carcasPanels) return;

var text = "<b>Каркас шкафа</b></br>" + 
	"Кол-во деталей: " + wrParams.carcasPanels.amt + "</br>" + 
	"Общая площадь: " + wrParams.carcasPanels.area + "</br>" + 
	"Общий периметр: " + wrParams.carcasPanels.perim + "</br>" + 
	"Себестоимость работы: " + wrCost.carcasPanelCost.work + "</br>" + 
	"Себестоимость материала: " + wrCost.carcasPanelCost.material + "</br>" + 
	"Себестоимость покраски: " + wrCost.carcasPanelCost.painting + "</br>" + 
	"<b>Фасады шкафа</b></br>" + 
	"Кол-во деталей: " + wrParams.doors.amt + "</br>" + 
	"Общая площадь: " + wrParams.doors.area + "</br>" + 
	"Общий периметр: " + wrParams.doors.perim + "</br>" + 
	"Себестоимость работы: " + wrCost.doorsCost.work + "</br>" + 
	"Себестоимость материала: " + wrCost.doorsCost.material + "</br>" + 
	"Себестоимость покраски: " + wrCost.doorsCost.painting + "</br>" + 
	"<b>Задние панели шкафа</b></br>" + 
	"Кол-во деталей: " + wrParams.rearPanels.amt + "</br>" + 
	"Общая площадь: " + wrParams.rearPanels.area + "</br>" + 
	"Себестоимость работы: " + wrCost.rearPanelCost.work + "</br>" + 
	"Себестоимость материала: " + wrCost.rearPanelCost.material + "</br>" + 
	"<b>Фурнитура шкафа</b></br>" + 
	"Кол-во петель: " + wrParams.hingeAmt + "</br>" + 
	"Кол-во комплектов направляющих (2шт): " + wrParams.boxSlidersAmt + "</br>" + 
	"Кол-во штанг: " + wrParams.poles.amt + "</br>" + 
	"Общая длина штанг, м: " + wrParams.poles.len + "</br>"; 
	
	$("#cost_wr").html(text);

}

function getWrPartPrice(type){
	var materialPrice = 0;
	var workPrice = 0;
	var meterPaintPrice = 0;
	
	if(type == "лдсп") {
		materialPrice = 400;
		workPrice = 100;
		meterPaintPrice = 0;
		}
		
	if(type == "мдф") {
		materialPrice = 600;
		workPrice = 200;
		meterPaintPrice = 1500;
		}
		
	if(type == "мдф4") {
		materialPrice = 100;
		workPrice = 200;
		meterPaintPrice = 0;
		}
		
	if(type == "сосна кл.Б" ||
		type =="сосна экстра" || 
		type =="береза паркет." ||
		type =="лиственница паркет." ||
		type =="дуб паркет." ||
		type =="дуб ц/л"){
			var timberParams = calcTimberParams(type);
			materialPrice = timberParams.m2Price_20;
			workPrice = 500;
			meterPaintPrice = 1500;
			}
		
	var par = {	
		material: materialPrice,
		work: workPrice,
		paint: meterPaintPrice,
		}
	
	//фурнитура
	
	if(type == "Boyard"){
		par = {
			hinge: 50,
			boxSlider: 200,
			pole: 200,
			}
		}
		
	if(type == "Ferrari"){
		par = {
			hinge: 100,
			boxSlider: 600,
			pole: 200,
			}
		}
		
	if(type == "Blum"){
		par = {
			hinge: 200,
			boxSlider: 2000,
			pole: 200,
			}
		}
		
	
	return par;
	

}