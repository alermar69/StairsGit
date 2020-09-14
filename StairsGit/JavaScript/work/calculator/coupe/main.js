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
var simpleDraw = true; //упрощенная отрисовка модели
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
	
	//скрываем блоки, не нужные для моделирования
	$('.canvas canvas:eq(1)').toggle()
	$('.canvas canvas:eq(2)').toggle()
	$("#cost").hide();
	$("#2d").hide();
	$("#modelInfo").hide();
	
	

	//пересчитываем лестницу
	recalculate();
	
	//вешаем пересчет на все заголовки разделов
	$('.raschet').click(function(){
		recalculate();
	})
	
	$('.form_table, .tabs').delegate('input,select,textarea', 'change', function(){
		recalculate()
	});
	
});


function changeAllForms(){
	setShelfPosByDist() // функция в файле sectFormChange.js
	getAllInputsValues(params);
	countFirstSectionWidth();
	changeFormWr();
	changeFormContent();
	getAllInputsValues(params);
	changeFormAssembling();
}
	
function recalculate(){
	try {
		selectedItems = [];
		getAllInputsValues(params);
		changeAllForms();			
		drawCoupeWr('vl_1', true);
		calculateCarcasPrice();
		setCompany();
		
		drawTopFloor();
		setWallsTemplate();
		redrawWalls();
	} catch (error) {
		prepareFatalErrorNotify(error);
	}
}
	
function configDinamicInputs() {
	configSectInputs();
	configBoxInputs();
	configDoorsInputs();
	changeFormLedges();
}

function staircaseLoaded(){
}