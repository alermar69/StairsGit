var params = {}; //глобальный массив значений инпутов
var viewportsParams = []; //глобальный массив параметров видовых экранов
var dxfPrimitivesArr = []; //глобоальный массив примитивов для экспорта в dxf
var wrPrice = {}; //глобальный массив цен элементов шкафа
var wrCost = {}; //глобальный массив себестоимости элементов шкафа
var wrParams = {}; //глобальный массив параметров ограждений
var isPageChanged = false; // тригер на изменение любого значения на странице
var materials = {}; //потребность в материалах
var isDoorsOpened = false;
var isDoorsFixed = false; //двери открываются при нажатии
var selectedItems = [];
var doorPos = {};
var specObj = {};
var boardsList = {};
var fontGlob;
var simpleDraw = false; //упрощенная отрисовка модели
var partsParams = {}; //данные о деталях для спецификации
var layers = {};

$(function () {
	loadFont();
	
	//добавляем видовые экраны на страницу  
	addViewport('WebGL-output', 'vl_1');//параметры outputDivId, viewportId

	//добавляем нижнее перекрытие
    addFloorPlane('vl_1', true);//параметры viewportId, isVisible

	//добавляем проем
	addTopFloor('vl_1', false);

	//добавляем стены
	addWalls('vl_1', false);//параметры viewportId, isVisible 
	//Добавляем слои в 3Д меню
	layers = {
		doors: "Фасады",
		shelfs: "Полки",
		metis: "Метизы",
		carcas_wr: "Каркас шкафа",
		wireframesinter: "Пересечения",
		dimensions: "Размеры",
		}
	for(var layer in layers){
		addLayer(layer, layers[layer]);
		}


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
	$('.form_table').delegate('input,select,textarea', 'change', function(){
		if($(this).hasClass("distTop") || $(this).hasClass("distBot")){
				var delta = $(this).val() * 1.0 - params[this.id];
				var boxRow = $(this).closest("tr").find(".boxRow").val()*1.0;
				
				if($(this).hasClass("distTop")) boxRow -= delta;
				if($(this).hasClass("distBot")) boxRow += delta;

				$(this).closest("tr").find(".boxRow").val(boxRow);				
				}
console.log($(this).val())
	//	recalculate();
		});
	
	$('.tabs, .form_table').delegate('input,select,textarea', 'change', changeAllForms);
	
	
	//вешаем пересчет на все заголовки разделов
	$('.raschet').click(function(){
		recalculate();
		})
	
	//открывание дверок
	
	
/*	
	//вешаем перерисовку стен, проема и балюстрады на измененние инпутов формы параметров стен
	$('.tabs').delegate('input,select,textarea', 'change', function(){
		changeAllForms();
		drawTopFloor();
		redrawWalls();
		drawBanister();
		});
	
	
	
	//толщина ступеней по умолчанию
	
	stairType
	$("#stairType").change(function(){
		setTreadThickness();
		recalculate();
		});
*/
	
	//сохранение ведомости заготовок в xls
	//$("#downLoadPartsList").click(function(){
	$('#modelInfo').delegate('#downLoadPartsList', 'click', function(){
		tableToExcel('partsTable', 'Детали',);
		})
	
	//сохранение ведомости деталей дверей в xls
	//$("#downLoadDoorsSpec").click(function(){
	$('#modelInfo').delegate('#downLoadDoorsSpec', 'click', function(){
		tableToExcel('doorsTable', 'Детали',);
		})
		
	
/*
	var orderName = $.urlParam('orderName');
	if(orderName){
		$('#orderName').val(orderName);
		_loadFromBD('content', '/calculator/general/db_data_exchange/dataExchangeXml_2.1.php', orderName)
	}
*/
	$("#viewLink").click(function(){
		if(params.orderName){
			var link = "http://6692035.ru/installation/coupe/?orderName=" + params.orderName;
			var result = prompt("Ссылка для просмотра 3D модели. Логин demo, пароль demo_pass", link);			
			};		
		});
		
	$('.main-content').delegate('input,select,textarea', 'change', function(){
	  isPageChanged = true;
	});
	window.onbeforeunload = confirmExit;
	function confirmExit(){
	    	 return (isPageChanged ? "Измененные данные не сохранены. Закрыть страницу?" : false); 
		
	}

});


function changeAllForms(){		
	getAllInputsValues(params);
	countFirstSectionWidth();
	changeFormWr();
	changeFormContent();
	getAllInputsValues(params);
	changeFormAssembling();
}
	
function recalculateModule(){
	// getAllInputsValues(params);
	// changeAllForms();			
	// drawTopFloor();	
	// redrawWalls();

	selectedItems = [];
	addWardrobe('vl_1', true);
	setWallsTemplate();
	printModelInfo();
	calculateSpec();		
}

function configDinamicInputs() {
	configSectInputs();
	configBoxInputs();
	configDoorsInputs();
	changeFormLedges();
}
