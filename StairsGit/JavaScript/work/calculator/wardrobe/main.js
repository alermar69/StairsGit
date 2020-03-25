var params = {}; //глобальный массив значений инпутов
var viewportsParams = []; //глобальный массив параметров видовых экранов
var dxfPrimitivesArr = []; //глобоальный массив примитивов для экспорта в dxf
var wrPrice = {}; //глобальный массив цен элементов шкафа
var wrCost = {}; //глобальный массив себестоимости элементов шкафа
var wrParams = {}; //глобальный массив параметров ограждений
var isPageChanged = false; // тригер на изменение любого значения на странице
var materials = {}; //потребность в материалах
var isDoorsOpened = false;

$(function () {
	//добавляем видовые экраны на страницу  
	addViewport('WebGL-output', 'vl_1');//параметры outputDivId, viewportId

	//добавляем нижнее перекрытие
	addFloorPlane('vl_1', true);//параметры viewportId, isVisible
	//добавляем стены
	addWalls('vl_1', false);//параметры viewportId, isVisible 

	addLayer('doors', 'Фасады');
	addLayer('shelfs', 'Полки');
	addLayer('metis', 'Метизы');
	addLayer('carcas_wr', 'Каркас шкафа');

	
	//пересчитываем лестницу
	recalculate();
	
	//изменение количества секций

	//изменение форм
	$('.form_table').delegate('input,select,textarea', 'change', changeAllForms);
	
	//вешаем пересчет на все заголовки разделов
	$('.raschet').click(function(){
		recalculate();
	})
	
	
	 //открывание/закрываение дверок
	 $("#openDoors").click(function(){
		if(isDoorsOpened) {
			isDoorsOpened = false;
			$("#openDoors").text("Открыть дверки");
			} 
		else {
			isDoorsOpened = true;
			$("#openDoors").text("Закрыть дверки");
			}
		recalculate();	
		
		})
});

function recalculate() {
	rt1 = performance.now();
	try {
		getAllInputsValues(params);		
		changeAllForms();			
		addWardrobe('vl_1', true);		
		calcWrPrice();
		printWrPrice();
		printWrCost();
		redrawWalls();
	} catch (error) {
		prepareFatalErrorNotify(error);
	}
}

function changeAllForms() {
	
	getAllInputsValues(params);
	countFirstSectionWidth();
	changeFormWr();
}

function configDinamicInputs() {
	configSectInputs();
	configBoxInputs();
}
