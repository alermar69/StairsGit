var params = {}; //глобальный массив значений инпутов
var viewportsParams = []; //глобальный массив параметров видовых экранов
var dxfPrimitivesArr = []; //глобоальный массив примитивов для экспорта в dxf
var dxfPrimitivesArr0 = []; //вспомогательный глобоальный массив
var staircasePrice = {}; //глобальный массив цен элементов лестницы
var staircaseCost = {}; //глобальный массив себестоимости элементов лестницы
var railingParams = {}; //глобальный массив параметров ограждений
var banisterParams = {}; //глобальный массив параметров балюстрады
var isPageChanged = false; // тригер на изменение любого значения на странице
var staircasePartsParams = {}; //параметры деталей лестницы для спецификации
//параметры деталей балюстрады для спецификации	
var balPartsParams = {
	handrails: [],
	rigels: [],
	};
var workList = {}; //сдельные расценки для цеха

//формируем масив количеств элементов для спецификации
var spec = {
	treads: [],
	plt: [],
	wndTreads: [],
	module: [],
	bolz: [],
	banister: [],
	handrail: [],
	columns: [],
	consoles: [],
	};

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
	//addFloorPlane('vl_3', true);

	//добавляем стены
	addWalls('vl_1', true);//параметры viewportId, isVisible 
	//addWalls('vl_2', true);
	//addWalls('vl_3', true);

	//добавляем балюстраду
	addBanister('vl_1');
	//addBanister('vl_3');

	//добавляем проем
	addTopFloor('vl_1');
	//addTopFloor('vl_3');

	//Добавляем слои в 3Д меню
	addLayer('treads', 'Ступени');
	addLayer('risers', 'Подступенки');
	addLayer('carcas', 'Каркас');
	addLayer('railing', 'Ограждения лестницы');
	//addLayer('topFloor', 'Верхнее перекрытие');
	addLayer('topRailing', 'Балюстрада');

	//конфигурируем правое меню
	$(".tabs").lightTabs();
	
	//скрываем блоки для отладки
	
	//$('.canvas canvas:eq(1)').toggle()
	//$('.canvas canvas:eq(2)').toggle()
 	//$("#mainImages").hide();
	//$("#description").hide();
	//$("#complect").hide();
	//$("#totalResult").hide();
	//$("#about").hide(); 

	changeAllForms = function () {
		changeFormsGeneral();
		changeFormCarcas();
		changeFormRailing();
		changeFormBanisterConstruct();
		//changeOffer();
		//complectDescription();
		changeFormAssembling();
	}
	
	configDinamicInputs = function() {
		changeFormBanister();
		changeFormTopFloor();
		changeFormLedges();
		changeAllForms();
		}
	
	//пересчитываем лестницу
	recalculate();
	//изменение формы
	$('.form_table,.tabs').delegate('input,select,textarea', 'click', changeAllForms);
	$("#staircasePosX, #staircasePosZ").change(recalculate);
	
	function redrawScene(){
		drawTopFloor();
		redrawWalls();
		drawBanister();	
		}
	//изменение формы
	$('.form_table,.tabs').delegate('input,select,textarea', 'click', redrawScene);
	
	//ссылка для монтажников
	$("#viewLink").click(function(){
		if(params.orderName){
			var link = "http://6692035.ru/installation/module/?orderName=" + params.orderName;
			var result = prompt("Ссылка для просмотра 3D модели. Логин demo, пароль demo_pass", link);			
			};		
		});

	
	//скрываем ненужные блоки
	$("#mainImages").hide();
	$("#marshRailingImages2D").hide();
	//$("#cost").hide();
	$("#M_tr").hide();
	
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
	
	var orderName = $.urlParam('orderName');
	if(orderName){
		$('#orderName').val(orderName);
		_loadFromBD(orderName)
	}

	$('.main-content').delegate('input,select,textarea', 'change', function(){
	  isPageChanged = true;
	});
	window.onbeforeunload = confirmExit;
	function confirmExit(){
	    	 return (isPageChanged ? "Измененные данные не сохранены. Закрыть страницу?" : false); 
		
	}

});

function recalculateModule() {
	// getAllInputsValues(params);
	// changeAllForms();
	// drawStaircase('vl_1', true);
	// redrawWalls();
	// drawTopFloor();
	// drawStaircase('vl_2', true);
	// drawStaircase('vl_3', true);
	// drawBanister();
	
	drawBanister();		
	crateWorksList(); //функция в файле /calculator/general/works.js
	calcSpecModule();
	printWorks2();
	//расчет цены
	//staircasePrice = {}; //очищаем глобальный массив цен элементов лестницы
	//calculatePrice();
	//calculateCarcasPrice();
	//calculateRailingPrice();
	//calculateBanisterPrice(); //функция в файле priceCalcBanister.js
	//calculateTotalPrice();
	//printPrice();
	//printCost();
	//расчет спецификации
	//calculateSpec();
	//calculateBanisterSpec(); //функция в файле calcSpecBanister.js
}