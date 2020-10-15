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

	var isStaircaseCalc = getCalcTypeMeta().isStaircaseCalc; //является ли текущий расчет расчетом лестницы
	
	if(isStaircaseCalc){
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
		if(isStaircaseCalc)	drawTopFloor();
		redrawWalls();
		drawSceneDimensions();
	});
	
	//перерисовка балюстрады при измененнии инпутов формы параметров стен
    $('#nav-banister').delegate('input,select', 'change', function(){
		getAllInputsValues(params);
		if(isStaircaseCalc) drawBanister();
	});

	//задаем начальное положение стен
	if(isStaircaseCalc && params.calcType != "vint"){
		$("#wallPositionX_1").val(-5000);
		$("#wallPositionX_2").val(-5000);
		$("#wallPositionX_3").val(1000);
		$("#wallPositionX_4").val(-5000);
	}

	//стены по умолчанию нулевой толщины
	if(!isStaircaseCalc){
		$("#wallThickness_1").val(0);
		$("#wallThickness_2").val(0);
		$("#wallThickness_3").val(0);
		$("#wallThickness_4").val(0);
	}

	if(!isStaircaseCalc || params.calcType == "mono") {
		if(params.discountMode == "процент") $("#discountFactor").val(20);
	}
	
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
	var isStaircaseCalc = getCalcTypeMeta().isStaircaseCalc; //является ли текущий расчет расчетом лестницы
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
				else if($("#calcType").val() == "objects") drawFunc = drawObjects;
				else if($("#calcType").val() != "objects") drawFunc = drawStaircase;
				
				drawFunc('vl_1', true);
				redrawWalls();

				if(isStaircaseCalc){
					drawTopFloor();
					drawBanister();
				}
				if($("#calcType").val() == "railing"){
					redrawConcrete();
				}

				redrawAdditionalObjects();

				if (!menu.simpleMode) {
					calculateSpec();	
					if(!testingMode) checkSpec();
				}

				if(params.calcType != "objects") drawSceneDimensions();
				
				
				if(isStaircaseCalc || params.calcType == "veranda"){
					printGeomDescr();
				}

				setHiddenLayers(); //скрываем слои в режиме тестирования

				createMaterialsList(); // обнуляем список материалов
				crateWorksList();
				calcWorks(partsAmt, "staircase");
				calcWorks(partsAmt_bal, "banister");

			//	printMaterialsNeed();
			//	calcProductionTime();
			//	if($("#calcType").val() != "objects") printWorks2();
				
				//расчет цены
				if(params.calcType != "geometry"){
					staircasePrice = {}; //очищаем глобальный массив цен элементов лестницы
					if ($("#calcType").val() == "railing") {
						calcRailingModulePrice()
					}else{
						if($("#calcType").val() == "vhod" && params.staircaseType == "Готовая"){
							calculateCarcasPrice_stock();
							calculateRailingPrice_stock();
						}else if($("#calcType").val() != "objects" && $("#calcType").val() != "slabs"){
							calculateCarcasPrice();
							calculateRailingPrice2(); //функция в файле priceLib.js
						}
						if ($("#calcType").val() != "objects"  && $("#calcType").val() != "slabs") {
							calculateBanisterPrice(); //функция в файле priceCalcBanister.js
							calcWrPrice(); //функция в файле /calculator/wardrobe/priceCalc.js
						}
					}
					calculateTotalPrice2(); //функция в файле priceLib.js
					printPrice2(); //функция в файле priceLib.js
					printCost2(); //функция в файле priceLib.js

					printMaterialsNeed();
					calcProductionTime();
					printWorks2();
					formatNumbers();
					printDescr();
				}
				
				if (window.updateDxfLinks) updateDxfLinks();
				
				if(params.calcType == "vhod" && !menu.simpleMode){			
					if(params.staircaseType == 'Готовая') {
						$("#dpcWidth").val("140");
						calcSpec_vl();
					}
				}

				updateModifyChanges();
				if ($("#calcType").val() == "objects") staircaseLoaded();
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
