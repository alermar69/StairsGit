function calcWrPrice(){
	//console.log(wrParams)
	if(!wrParams.carcasPanels) {
		wrCost.total = 0;
		wrPrice.total = 0;
		wrPrice.finalPrice = 0;
		return;
		}
	
	var margin = 3;
	
	//покраска
	wrCost.painting = 0;
	wrPrice.painting = 0;
	
	//панели каркаса
	var carcasPanelCost = getWrPartPrice(params.carcasMat_wr); //расценки за единицу	
	carcasPanelCost.material = carcasPanelCost.material * wrParams.carcasPanels.area;
	carcasPanelCost.work = carcasPanelCost.work * wrParams.carcasPanels.amt;	
	carcasPanelCost.painting = 0;
	if(params.carcasPaint_wr == "лак")
		carcasPanelCost.painting = carcasPanelCost.paint * wrParams.carcasPanels.area;
	if(params.carcasPaint_wr == "морилка+лак" || params.carcasPaint_wr == "эмаль")
		carcasPanelCost.painting = carcasPanelCost.paint * wrParams.carcasPanels.area * 1.3;	
	wrCost.carcas = Math.round(carcasPanelCost.material + carcasPanelCost.work);
	wrPrice.carcas = Math.round(wrCost.carcas * margin);
	//добавляем покраску
	wrCost.painting += Math.round(carcasPanelCost.painting);
	wrPrice.painting += Math.round(carcasPanelCost.painting * margin);
	
	//задние стенки
	var rearPanelCost = getWrPartPrice("мдф4"); //расценки за единицу
	rearPanelCost.material = rearPanelCost.material * wrParams.rearPanels.area;
	rearPanelCost.work = rearPanelCost.work * wrParams.rearPanels.amt;
	wrCost.rearPanels = Math.round(rearPanelCost.material + rearPanelCost.work);
	wrCost.carcas += wrCost.rearPanels
	wrPrice.carcas += Math.round(wrCost.rearPanels * margin);
	
	//фасады
	var doorsCost = getWrPartPrice(params.doorsMat_wr); //расценки за единицу	
	doorsCost.material = doorsCost.material * wrParams.doors.area;
	doorsCost.work = doorsCost.work * wrParams.doors.amt;
	doorsCost.painting = 0;
	if(params.doorsPaint_wr == "лак")
		doorsCost.painting = doorsCost.paint * wrParams.carcasPanels.area;
	if(params.doorsPaint_wr == "морилка+лак" || params.doorsPaint_wr == "эмаль")
		doorsCost.painting = doorsCost.paint * wrParams.carcasPanels.area * 1.3;		
	wrCost.doors = Math.round(doorsCost.material + doorsCost.work);
	wrPrice.doors = Math.round(wrCost.doors * margin);
	//добавляем покраску
	wrCost.painting += Math.round(doorsCost.painting);
	wrPrice.painting += Math.round(wrCost.painting * margin);
	
	//фурнитура
	var metisCost = getWrPartPrice(params.metisType_wr)
	wrCost.metis = 	metisCost.hinge * wrParams.hingeAmt + metisCost.boxSlider * wrParams.boxSlidersAmt + metisCost.pole * wrParams.poles.amt;
	wrPrice.metis = Math.round(wrCost.metis * margin);
	
	//общая цена
	wrCost.total = wrCost.metis + wrCost.doors + wrCost.carcas;
	wrPrice.total = wrPrice.metis + wrPrice.doors + wrPrice.carcas;
	
	//сохраняем данные по себестоимости в глобальный объект
	wrCost.carcasPanelCost = carcasPanelCost;
	wrCost.doorsCost = doorsCost;
	wrCost.rearPanelCost = rearPanelCost;
	
	//console.log(wrPrice.painting, wrCost.painting)
	
	//printWrPrice(wrPrice);
	//printWrCost(wrCost)
	/*
	//вывод детального расчета себестоимости
	var text = "<b>Каркас шкафа</b></br>" + 
	"Кол-во деталей: " + wrParams.carcasPanels.amt + "</br>" + 
	"Общая площадь: " + wrParams.carcasPanels.area + "</br>" + 
	"Общий периметр: " + wrParams.carcasPanels.perim + "</br>" + 
	"Себестоимость работы: " + carcasPanelCost.work + "</br>" + 
	"Себестоимость материала: " + carcasPanelCost.material + "</br>" + 
	"Себестоимость покраски: " + carcasPanelCost.painting + "</br>" + 
	"<b>Фасады шкафа</b></br>" + 
	"Кол-во деталей: " + wrParams.doors.amt + "</br>" + 
	"Общая площадь: " + wrParams.doors.area + "</br>" + 
	"Общий периметр: " + wrParams.doors.perim + "</br>" + 
	"Себестоимость работы: " + doorsCost.work + "</br>" + 
	"Себестоимость материала: " + doorsCost.material + "</br>" + 
	"Себестоимость покраски: " + doorsCost.painting + "</br>" + 
	"<b>Задние панели шкафа</b></br>" + 
	"Кол-во деталей: " + wrParams.rearPanels.amt + "</br>" + 
	"Общая площадь: " + wrParams.rearPanels.area + "</br>" + 
	"Себестоимость работы: " + rearPanelCost.work + "</br>" + 
	"Себестоимость материала: " + rearPanelCost.material + "</br>" + 
	"<b>Фурнитура шкафа</b></br>" + 
	"Кол-во петель: " + wrParams.hingeAmt + "</br>" + 
	"Кол-во комплектов направляющих (2шт): " + wrParams.boxSlidersAmt + "</br>" + 
	"Кол-во штанг: " + wrParams.poles.amt + "</br>" + 
	"Общая длина штанг, м: " + wrParams.poles.len + "</br>"; 
	
	$("#cost_wr").html(text);
*/
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