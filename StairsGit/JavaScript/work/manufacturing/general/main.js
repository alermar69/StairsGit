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
var boltDiamNoTest = typeof boltDiam != 'undefined' ? boltDiam : 10;
var additional_objects = [];

$(function () {
	getAllInputsValues(params);
	
	//добавляем видовые экраны на страницу
	addViewport('WebGL-output', 'vl_1');//параметры outputDivId, viewportId

	//добавляем нижнее перекрытие
	addFloorPlane('vl_1', true);//параметры viewportId, isVisible

	//добавляем стены
	addWalls('vl_1', false);//параметры viewportId, isVisible
	
	if($("#calcType").val() != "railing" && $("#calcType").val() != "slabs"){
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
		
	//создаем номенклатуру материалов
	createMaterialsList(); //в файле /calculator/general/materials.js

	//перерисовка стен при измененнии инпутов формы параметров стен
    $('#nav-walls').delegate('input,select', 'change', function(){
		getAllInputsValues(params);
		if($("#calcType").val() != "railing"){
			drawTopFloor();
			redrawWalls();
		}
		
		drawSceneDimensions();
	});
	
	//перерисовка балюстрады при измененнии инпутов формы параметров стен
    $('#nav-banister').delegate('input,select', 'change', function(){
		getAllInputsValues(params);
		if($("#calcType").val() != "railing" && typeof drawBanister == "function"){
			drawBanister();
		}
	});
	
	$('#makeDrawings').click(function(){
		makeDrawings();
	});
	
	//пересчитываем лестницу
	if (window.loadedData) {
		setLoadedData(window.loadedData, true);
	}else{
		recalculate();
	}

	if (params.calcType == 'slabs') {
		dxfBasePoint = {};
	}

});

function recalculate() {
	if (!testingMode) boltDiam = boltDiamNoTest;
	return new Promise(function(resolve, reject){
		try {
			$('#loaderBlock').show({done: function(){
				shapesList = []; //Очищаем
				if (window.location.href.includes('/timber_stock')) {
					setStockParams();
				}
				getAllInputsValues(params);
				changeAllForms();
				
				var drawFunc = function(){};
				if($("#calcType").val() == "carport") drawFunc = drawCarport;
				else if($("#calcType").val() == "veranda") drawFunc = drawVeranda;
				else if($("#calcType").val() == "slabs" || $("#calcType").val() == "table") drawFunc = drawTable;
				else if($("#calcType").val() == "sill") drawFunc = drawSills;
				else drawFunc = drawStaircase;
				
				drawFunc('vl_1', true);
				redrawWalls();

				if($("#calcType").val() == "railing"){
					redrawConcrete();
				}
				else if($("#calcType").val() != "slabs") {
					drawTopFloor();
					drawBanister();
				}

				redrawAdditionalObjects();

				if (!menu.simpleMode) {
					calculateSpec();	
					if(!testingMode) checkSpec();
				}
				setHiddenLayers(); //скрываем слои в режиме тестирования
								
				drawSceneDimensions();
				
				createMaterialsList(); // обнуляем список материалов
				crateWorksList();
				calcWorks(partsAmt, "staircase");
				calcWorks(partsAmt_bal, "banister");

				printMaterialsNeed();
				calcProductionTime();
				printWorks2();
				formatNumbers();
				printDescr();
				
				if (window.updateDxfLinks) updateDxfLinks();
				
				if(params.calcType == "vhod" && !menu.simpleMode){			
					if(params.staircaseType == 'Готовая') {
						$("#dpcWidth").val("140");
						calcSpec_vl();
					}
				}

				updateModifyChanges();
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
