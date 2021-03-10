function calculateCarcasPrice() {
	var wrParams = params;
	printWrPriceNew(specObj, wrParams);
} //end of calcWrPrice

function printWrPrice() {

	if (!wrParams.carcasPanels) return;

	var text =
		"Каркас: " + wrPrice.carcas + "</br>" +
		"Фасады: " + wrPrice.doors + "</br>" +
		"Фурнитура: " + wrPrice.metis + "</br>" +
		"Покраска: " + wrPrice.painting + "</br>" +
		"<b>Итого: " + (wrPrice.total + wrPrice.painting) + "</b></br>";

	$("#price_wardrobe").html(text);

}



function printWrCost(par) {

	if (!wrParams.carcasPanels) return;

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

function getWrPartPrice(type) {
	var materialPrice = 0;
	var workPrice = 0;
	var meterPaintPrice = 0;

	if (type == "лдсп") {
		materialPrice = 400;
		workPrice = 100;
		meterPaintPrice = 0;
	}

	if (type == "мдф") {
		materialPrice = 600;
		workPrice = 200;
		meterPaintPrice = 1500;
	}

	if (type == "мдф4") {
		materialPrice = 100;
		workPrice = 200;
		meterPaintPrice = 0;
	}

	if (type == "сосна кл.Б" ||
		type == "сосна экстра" ||
		type == "береза паркет." ||
		type == "лиственница паркет." ||
		type == "дуб паркет." ||
		type == "дуб ц/л") {
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

	if (type == "Boyard") {
		par = {
			hinge: 50,
			boxSlider: 200,
			pole: 200,
		}
	}

	if (type == "Ferrari") {
		par = {
			hinge: 100,
			boxSlider: 600,
			pole: 200,
		}
	}

	if (type == "Blum") {
		par = {
			hinge: 200,
			boxSlider: 2000,
			pole: 200,
		}
	}


	return par;


}