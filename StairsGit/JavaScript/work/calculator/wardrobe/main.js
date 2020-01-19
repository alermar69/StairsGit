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
	addViewport('WebGL-output', 'vl_2');
	addViewport('WebGL-output', 'vl_3');

	//добавляем нижнее перекрытие
	addFloorPlane('vl_1', true);//параметры viewportId, isVisible
	addFloorPlane('vl_2', true);
	addFloorPlane('vl_3', true);

	//добавляем стены
	addWalls('vl_1', false);//параметры viewportId, isVisible 
	addWalls('vl_2', true);
	addWalls('vl_3', true);

	//добавляем балюстраду
	//addBanister('vl_2');
	//addBanister('vl_3');

	//добавляем проем
	//addTopFloor('vl_1', false);
	//addTopFloor('vl_2', true);
	//addTopFloor('vl_3', true);

	//Добавляем слои в 3Д меню
	addLayer('doors', 'Фасады');
	addLayer('shelfs', 'Полки');
	addLayer('metis', 'Метизы');
	addLayer('carcas_wr', 'Каркас шкафа');

	//конфигурируем правое меню
	$(".tabs").lightTabs();
	
	//скрываем производственные параметры
	//$("#manufacturingParams").hide();
	
	//создаем номенклатуру материалов
	//createMaterialsList(); //в файле /calculator/general/materials.js
	/*
	//задаем начальное положение стен
	$("#wallPositionX_1").val(-5000);
	$("#wallPositionX_2").val(-5000);
	$("#wallPositionX_3").val(1000);
	$("#wallPositionX_4").val(-5000);
	*/
	
	//скрываем блоки, не нужные для моделирования
	$('.canvas canvas:eq(1)').toggle()
	$('.canvas canvas:eq(2)').toggle()

/*	$("#mainImages").hide();
	$("#description").hide();
	$("#complect").hide();
	$("#marshRailingImages2D").hide();
	$("#about").hide();

	//$("#specificationList").show();
	*/
	
	//пересчитываем лестницу
	recalculate();
	
	//изменение количества секций
//	$("#maxSectionAmt_wr").change(configSectInputs); 
	
	
	 
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
