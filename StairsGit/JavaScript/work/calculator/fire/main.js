var params = {}; //глобальный массив значений инпутов
var viewportsParams = []; //глобальный массив параметров видовых экранов
var dxfPrimitivesArr = []; //глобоальный массив примитивов для экспорта в dxf
var dxfPrimitivesArr0 = []; //вспомогательный глобоальный массив
var staircasePrice = {}; //глобальный массив цен элементов лестницы
var staircaseCost = {}; //глобальный массив себестоимости элементов лестницы
var railingParams = {}; //глобальный массив параметров ограждений
var banisterParams = {}; //глобальный массив параметров балюстрады
var isPageChanged = false; // тригер на изменение любого значения на странице
var materials = {}; //потребность в материалах

$(function () {
/*
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
	addBanister('vl_2');
	addBanister('vl_3');

	//добавляем проем
	addTopFloor('vl_2');
	addTopFloor('vl_3');

	//Добавляем слои в 3Д меню
	addLayer('treads', 'Ступени');
	addLayer('risers', 'Подступенки');
	addLayer('carcas', 'Каркас');
	addLayer('railing', 'Ограждения лестницы');
	addLayer('topFloor', 'Верхнее перекрытие');
	addLayer('topRailing', 'Балюстрада');

	//конфигурируем правое меню
	$(".tabs").lightTabs();
	
	//скрываем блоки для отладки
	
	//$('.canvas canvas:eq(1)').toggle()
	//$('.canvas canvas:eq(2)').toggle()
 	$("#mainImages").hide();
	$("#description").hide();
	$("#complect").hide();
	$("#totalResult").hide();
	$("#about").hide(); 
*/
//создаем номенклатуру материалов
	createMaterialsList(); //в файле /calculator/general/materials.js
	
	changeAllForms = function () {
		changeFormCarcas();
		changeOffer();
		changeFormAssembling();
		}
	
	configDinamicInputs = function() {

		}
	
	//пересчитываем лестницу
	recalculate();
	//изменение формы
	$('.form_table,.tabs').delegate('input,select,textarea', 'click', recalculate);
	


	
	//скрываем блоки для отладки
	//$('.canvas canvas:eq(1)').hide();
	//$('.canvas canvas:eq(2)').hide();
	//$('#mainImages').hide();
	//$('#description').hide();
	//$('#complect').hide();
	//$('#totalResult').hide(); 
	//$('#about').hide();
	
	//конфигурация для отладки
	//$("#stairModel").val("П-образная с забегом")
	//recalculate();
/*	
	var orderName = $.urlParam('orderName');
	if(orderName){
		$('#orderName').val(orderName);
		_loadFromBD('content', '/calculator/general/db_data_exchange/dataExchangeXml_2.1.php', orderName)
	}
*/
	$('.main-content').delegate('input,select,textarea', 'change', function(){
	  isPageChanged = true;
	});
	

	
	
	
	window.onbeforeunload = confirmExit;
	function confirmExit(){
	    	 return (isPageChanged ? "Измененные данные не сохранены. Закрыть страницу?" : false); 
		
	}
});

function recalculate() {
	try {
		getAllInputsValues(params);
		changeAllForms();
		//расчет цены
		createMaterialsList(); // обнуляем список материалов
		staircasePrice = {}; //очищаем глобальный массив цен элементов лестницы
		calculatePrice();
		printMaterialsNeed();
	} catch (error) {
		prepareFatalErrorNotify(error);
	}
}