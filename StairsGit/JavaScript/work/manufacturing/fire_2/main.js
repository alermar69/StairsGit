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
var partsAmt = {};
var partsAmt_bal = {};

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
	
	//пересчитываем лестницу
	// recalculate();

	if (window.loadedData) {
		setLoadedData(window.loadedData, true);
	}else{
		recalculate();
	}
	

	//изменение формы
	$('.form_table,.tabs').delegate('input,select,textarea', 'click', recalculate);
	
	$(".raschet").click(recalculate);


	
function ChangeImgSize() {
	imageSize = document.getElementById("imageSize").value;
	imageSize = imageSize + "px";

	document.getElementById('mainView').style.height = imageSize;
	document.getElementById('leftView').style.height = imageSize;
}

});

function recalculate() {
	console.log('aga');
	try {
		getAllInputsValues(params);
		changeAllForms();
		drawStaircase();
		//расчет цены
		createMaterialsList(); // обнуляем список материалов
		staircasePrice = {}; //очищаем глобальный массив цен элементов лестницы
		calcSpec();
		printMaterialsNeed();
	} catch (error) {
		prepareFatalErrorNotify(error);
	}
}

changeAllForms = function () {
	changeFormCarcas();
	//changeOffer();
	changeFormAssembling();
}

configDinamicInputs = function() {

}