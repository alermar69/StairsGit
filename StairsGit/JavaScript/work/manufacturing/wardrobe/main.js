var params = {}; //глобальный массив значений инпутов
var viewportsParams = []; //глобальный массив параметров видовых экранов
var dxfPrimitivesArr = []; //глобоальный массив примитивов для экспорта в dxf
var staircasePrice = {}; //глобальный массив цен элементов лестницы
var staircaseCost = {}; //глобальный массив себестоимости элементов лестницы
var railingParams = {}; //глобальный массив параметров ограждений
var banisterParams = {}; //глобальный массив параметров балюстрады
var isPageChanged = false; // тригер на изменение любого значения на странице
var materials = {}; //потребность в материалах
var isDoorsOpened = false;
var partsAmt = {}; //глобальный массив количеств эл-тов для спецификации лестницы
var partsAmt_bal = {}; //глобальный массив количеств эл-тов для спецификации балюстрады
var specObj = partsAmt; //ссылка на массив данных для спецификации (лестница или балюстрада)

$(function () {
	//добавляем видовые экраны на страницу  
	addViewport('WebGL-output', 'vl_1');//параметры outputDivId, viewportId
	//addViewport('WebGL-output', 'vl_2');
	//addViewport('WebGL-output', 'vl_3');

	//добавляем нижнее перекрытие
	addFloorPlane('vl_1', true);//параметры viewportId, isVisible
	//addFloorPlane('vl_2', true);
//	addFloorPlane('vl_3', true);

	//добавляем стены
	addWalls('vl_1', false);//параметры viewportId, isVisible 
	//addWalls('vl_2', true);
	//addWalls('vl_3', true);

	//добавляем балюстраду
	//addBanister('vl_2');
	//addBanister('vl_3');

	//добавляем проем
	//addTopFloor('vl_2');
	//addTopFloor('vl_3');

	//Добавляем слои в 3Д меню
	addLayer('doors', 'Фасады');
	addLayer('shelfs', 'Полки');
	addLayer('metis', 'Метизы');
	addLayer('carcas_wr', 'Каркас шкафа');

//конфигурируем правое меню
	$("#rightMenu").lightTabs();
	$("#wageInfo").lightTabs();
	
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
	
	
	//скрываем блоки, не нужные для моделирования
	$('.canvas canvas:eq(0)').toggle()
	$('.canvas canvas:eq(1)').toggle()
	$("#mainImages").hide();
	$("#description").hide();
	$("#complect").hide();
	$("#marshRailingImages2D").hide();
	$("#about").hide();

	//$("#specificationList").show();
	
	*/
	
	//пересчитываем лестницу
	recalculate();
});

function recalculate() {
	try {
		getAllInputsValues(params);
		changeAllForms();
		addWardrobe('vl_1', true);
		
	} catch (error) {
		prepareFatalErrorNotify(error);
	}
/*	drawStaircase('vl_2', true);
	drawStaircase('vl_3', true);
	drawTopFloor();
	redrawWalls();
	drawBanister();
	//расчет цены
	createMaterialsList(); // обнуляем список материалов
	staircasePrice = {}; //очищаем глобальный массив цен элементов лестницы
	calculateCarcasPrice();
	calculateRailingPrice();
	calculateBanisterPrice(); //функция в файле priceCalcBanister.js
	calculateTotalPrice();
	printPrice();
	printCost();
	printMaterialsNeed();
	*/
}

function changeAllForms() {
	getAllInputsValues(params);
	countFirstSectionWidth();
	changeFormWr();
	$('.installation_man').show();

}

function configDinamicInputs() {
	configSectInputs();
	configBoxInputs();
}
