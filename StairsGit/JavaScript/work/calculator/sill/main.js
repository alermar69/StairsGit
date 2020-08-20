$(function () {
    loadFont();
	//добавляем видовые экраны на страницу
    addViewport('WebGL-output', 'vl_1');//параметры outputDivId, viewportId


    //добавляем нижнее перекрытие
    addFloorPlane('vl_1', true);//параметры viewportId, isVisible
    //addFloorPlane('vl_2', true);

	//Добавляем слои в 3Д меню
	layers = {
		carcas: "Каркас",
		doors: "Фасады",
		panels: "Пенели",
		boxes: "Ящики",
		countertop: "Столешница",
		metiz: "Фурнитура",
		wireframesinter: "Пересечения",
		dimensions: "Размеры",
		dimensions2: "Размеры2",
		}
	for(var layer in layers){
		addLayer(layer, layers[layer]);
	}
	
	recalculate()
		
});

function recalculate(){
	try {
		getAllInputsValues(params);
		//changeAllForms();

		drawTable('vl_1', true);
		calcTablePrice();
		calculateTotalPrice2();
		printPrice2();
	} catch (error) {
		prepareFatalErrorNotify(error);
	}
}