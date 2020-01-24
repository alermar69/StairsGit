var params = {}; //глобальный массив значений инпутов
var dxfPrimitivesArr = []; //глобоальный массив примитивов для экспорта в dxf
var dxfPrimitivesArr0 = []; //вспомогательный глобоальный массив
var staircasePrice = {}; //глобальный массив цен элементов лестницы
var staircaseCost = {}; //глобальный массив себестоимости элементов лестницы
var railingParams = {}; //глобальный массив параметров ограждений
var banisterParams = {}; //глобальный массив параметров балюстрады
var staircasePartsParams = {}; //параметры деталей лестницы для спецификации
	staircasePartsParams.handrails = []; //массив длин поручней лестницы
//параметры деталей балюстрады для спецификации	
var balPartsParams = {
	handrails: [],
	rigels: [],
	};

var workList = {}; //сдельные расценки для цеха
var isDoorsOpened = false;
var wrPrice = {}; //глобальный массив цен элементов шкафа
var wrCost = {}; //глобальный массив себестоимости элементов шкафа
var wrParams = {}; //глобальный массив параметров ограждений
var glassSectParams = []; //глобальный массив параметров секций ограждений
var partsAmt = {}; //глобальный массив количеств эл-тов для спецификации лестницы
var partsAmt_bal = {}; //глобальный массив количеств эл-тов для спецификации балюстрады
var specObj = partsAmt; //ссылка на массив данных для спецификации (лестница или балюстрада)
var poleList = {}; //ведомость резки профилей и поручней
var layers = {};
var materials = {}; //потребность в материалах
var anglesHasBolts = true; //отрисовывать болты уголков
var drawLongBolts = true; //отрисовывать длинные болты, соединяющие два уголка через тетиву насквозь
var priceObj = {};
var shapesList = [];
var isFixPats = true; //отрисовывать болты крепления к стенам, к нижнему и верхнему перекрытию
var holeMooveParams = []; //массив данных для смещения отверстий
var modelSpec = {};//Сюда попадает итоговая спецификация
var calculatedSpec = {};//Сюда попадает итоговая спецификация

$(function () {
	getAllInputsValues(params);
	
	//добавляем видовые экраны на страницу
	addViewport('WebGL-output', 'vl_1');//параметры outputDivId, viewportId

	//добавляем нижнее перекрытие
	addFloorPlane('vl_1', true);//параметры viewportId, isVisible

	//добавляем стены
	addWalls('vl_1', false);//параметры viewportId, isVisible
	
	if($("#calcType").val() != "railing"){
		//добавляем балюстраду
		addBanister('vl_1');

		//добавляем верхнее перекрытие
		addTopFloor('vl_1');
	}
	
	//Добавляем слои в 3Д меню
	layers = getLayersList();
	for(var layer in layers){
		var needAdd = true;
		if(layers[layer]['not_for'] && layers[layer]['not_for'].indexOf(params.calcType) != -1) needAdd = false;
		if(layers[layer]['only_for'] && layers[layer]['only_for'].indexOf(params.calcType) == -1) needAdd = false;
		if(needAdd) addLayer(layer, layers[layer]['name']);
	}
		
	//конфигурируем правое меню
	$(".tabs").lightTabs();
	
	//конфигурируем табы в трудоемкости
	$("#wageInfo").lightTabs();
	
	//создаем номенклатуру материалов
	createMaterialsList(); //в файле /calculator/general/materials.js

	//вешаем перерисовку стен на измененние инпутов формы параметров стен
    $('.tabs').delegate('input,select,textarea', 'change', function(){
		getAllInputsValues(params);
		drawTopFloor();
		redrawWalls();
		drawSceneDimensions();
	});
	
	//пересчитываем лестницу
	if (window.loadedData) {
		setLoadedData(window.loadedData, true);
	}else{
		recalculate();
	}

});

function recalculate(){
	return new Promise(function(resolve, reject){
		try {
			$('#loaderBlock').show({done: function(){
				shapesList = []; //Очищаем
				if (window.location.href.includes('/timber_stock')) {
					setStockParams();
				}
				getAllInputsValues(params);
				changeAllForms();
				if (!window.location.href.includes('/coupe')) {
					drawStaircase('vl_1', true);
				}
				redrawWalls();
				if (!window.location.href.includes('/railing')) {
					drawTopFloor();
				}

				setHiddenLayers(); //скрываем слои в режиме тестирования
				drawBanister();
				if (!menu.simpleMode) {
					calculateSpec();	
					if(!testingMode) checkSpec();
				}

				drawSceneDimensions();
				
				/* непонятные функции
				crateWorksList();
				calcWorks(partsAmt, "staircase");
				calcWorks(partsAmt_bal, "banister");
				printWorks2();
				*/
				
				if(params.calcType == "railing"){
					drawConcrete('vl_1');
				}
				
				if(params.calcType == "vhod" && !menu.simpleMode){			
					if(params.staircaseType == 'Готовая') {
						$("#dpcWidth").val("140");
						calcSpec_vl();
					}
				}
				resolve();
			}});
		} catch (error) {
			prepareFatalErrorNotify(error);
		}	
	});
}

function staircaseLoaded(){
	$('.loader-block').hide();
	setTimeout(function(){
		//Создаем после построения лестницы
		createCamCurve();
		if (window.menu) {
			menu.update();
		}
	}, 0);
}
