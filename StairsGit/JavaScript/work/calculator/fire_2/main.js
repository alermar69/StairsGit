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
var priceObj = {};

$(function () {

//создаем номенклатуру материалов
	createMaterialsList(); //в файле /calculator/general/materials.js
	
	//конфигурируем правое меню
	$(".tabs").lightTabs();
	
	$("#production_data").hide();
	
	//пересчитываем лестницу
	recalculate();
	
	//изменение формы
	$('.form_table,.tabs').delegate('input,select,textarea', 'click', recalculate);
	
	$(".raschet").click(recalculate);

	function ChangeImgSize() {
		imageSize = document.getElementById("imageSize").value;
		imageSize = imageSize + "px";

		document.getElementById('mainView').style.height = imageSize;
		document.getElementById('leftView').style.height = imageSize;
	}

	//сворачивание блоков
	initToggleDivs(); // функция в файле formsChange.js
	
});

function recalculate(){
	try {
		getAllInputsValues(params);
		changeAllForms();
		drawStaircase();
		//данные для производства
		createMaterialsList(); // обнуляем список материалов		
		crateWorksList();
		calcWorks(partsAmt, "staircase");
		printWorks2();
		
		//расчет цены
		createMaterialsList(); // обнуляем список материалов
		staircasePrice = {}; //очищаем глобальный массив цен элементов лестницы
		calculatePrice();
		printMaterialsNeed();
	} catch (error) {
		prepareFatalErrorNotify(error);
	}
	
}

changeAllForms = function () {
	changeFormCarcas();
	changeOffer();
	changeFormAssembling();
}
	
configDinamicInputs = function() {

}