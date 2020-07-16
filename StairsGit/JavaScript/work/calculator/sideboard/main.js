var params = {}; //глобальный массив значений инпутов
var dxfPrimitivesArr = []; //глобоальный массив примитивов для экспорта в dxf
var dxfPrimitivesArr0 = []; //вспомогательный массив, чтобы не засорЯть основной чертеж
var workList = {}; //сдельные расценки для цеха
var isDoorsOpened = false;
var partsAmt = {}; //глобальный массив количеств эл-тов для спецификации лестницы
var poleList = {}; //ведомость резки профилей и поручней
var layers = {};

$(function () {
    getAllInputsValues(params);

	
	loadFont();

	//добавляем видовые экраны на страницу
	addViewport('WebGL-output', 'vl_1');//параметры outputDivId, viewportId

	//добавляем нижнее перекрытие
	//addFloorPlane('vl_1', true);//параметры viewportId, isVisible

	//конфигурируем правое меню
	$(".tabs").lightTabs();
	
	//создаем номенклатуру материалов
	createMaterialsList(); //в файле /calculator/general/materials.js

	//сворачивание блоков
	initToggleDivs(); // функция в файле formsChange.js

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

    //пересчитываем
    recalculate();

	$('.form_table,.tabs').delegate('input,select,textarea', 'change', changeAllForms);
	
	//вешаем пересчет на все заголовки разделов
	$('.raschet').click(function(){
		recalculate();
		});
	//перерисовка пользовательских размеров
	$('#dimParamsTable').delegate('input,select,textarea', 'change', function(){
		changeFormDim();
		drawSceneDimensions();
		});
		
	//перерисовка пользовательских размеров
	$('#dimParamsTable').delegate('input,select,textarea', 'change', function(){
		changeFormDim();
		drawSceneDimensions();
		});


    //скрываем блоки, не нужные для моделирования

	$("#aboutWrap").hide();
    $("#cost").hide();
	$('#specificationList').show();
	

	
		
	$("#viewLink").click(function(){
		if(params.orderName){
			var link = "http://6692035.ru/installation/metal/?orderName=" + params.orderName;
			var result = prompt("Ссылка для просмотра 3D модели. Логин demo, пароль demo_pass", link);			
			};		
		});
	$(".setTemplate").click(function(){
		var orderName = $(this).attr("id");
		_loadFromBD(orderName)
	});
	
	//сохранение ведомости заготовок в xls
	$("#poleList").delegate('#downLoadPoleList', 'click', function(){
		tableToExcel('partsTable', 'Детали',);
		})
	

	
});

function recalculate() {
	try {
		getAllInputsValues(params);
		changeAllForms();
		setHiddenLayers();
		drawSideboard('vl_1', true);
		drawSceneDimensions();
		calcPrice();
	} catch (error) {
		prepareFatalErrorNotify(error);
	}
}

function changeAllForms() {	
	getAllInputsValues(params);
	mainFormChange();
}

function configDinamicInputs() {
	//	changeFormBanister();
	//	changeFormTopFloor();
	//	changeFormLedges();
		changeAllForms();
		configBoxInputs();
		configShelfInputs();
		//setHandrailParams_bal();
	//	configSectInputs();
	//	configBoxInputs();
	addDimRows();
		
}
