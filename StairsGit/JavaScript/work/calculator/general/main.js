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
var dxfBasePoint = {};
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
	
	
	//Вызов рассчета геометрии
	$("#calcGeometry").click(function(){
		if(params.calcType == 'metal' || params.calcType == 'mono' || params.calcType == 'timber' || params.calcType == 'timber_stock'){
			 calculateGeom();
			 recalculate();
		}
	})

	//задаем начальное положение стен
	if($("#calcType").val() != "railing" && $("#calcType").val() != "vint"){
		$("#wallPositionX_1").val(-5000);
		$("#wallPositionX_2").val(-5000);
		$("#wallPositionX_3").val(1000);
		$("#wallPositionX_4").val(-5000);
	}
	
	if($("#calcType").val() == "vint"){
		setInputValue("wallPositionX_3", 1000);
		setInputValue("wallPositionZ_3", 0);
		setInputValue("wallLength_3", params.staircaseDiam);
	}
	
	if($("#calcType").val() == "carport"){
		$("#wallPositionX_1").val(-2500);
		$("#wallPositionX_2").val(-2500);
		$("#wallPositionX_3").val(2500);
		$("#wallPositionX_4").val(-2500);
		
		$("#wallPositionZ_1").val(-2500);
		$("#wallPositionZ_2").val(2500);
		$("#wallPositionZ_3").val(-2500);
		$("#wallPositionZ_4").val(-2500);
	}
	
	if(params.calcType == "mono") {
		if(params.discountMode == "процент") $("#discountFactor").val(20);
	}
	if(params.calcType == "timber" || params.calcType == "timber_stock") {
		//устанавливаем деревянные балясины
		setInputValue("railingModel_bal", "Деревянные балясины");
		setInputValue("handrail_bal", "сосна");
		changeFormBanisterConstruct();
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
});

function recalculate() {
	rt1 = performance.now();
	return new Promise(function(resolve, reject){
		$('#loaderBlock').show({done: function(){
			try {
				shapesList = []; //Очищаем
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

				//данные для производства
				if (!menu.simpleMode) {
					createMaterialsList(); // обнуляем список материалов
					crateWorksList();
					calcWorks(partsAmt, "staircase");
					calcWorks(partsAmt_bal, "banister");
				}

				drawSceneDimensions();
				
				var ignorCals = ["railing", "carport", "veranda", "table", "slabs", "sill"]
				
				if(ignorCals.indexOf($("#calcType").val()) == -1){
					printGeomDescr();
				}
			
				//расчет цены
				if(params.calcType != "geometry"){
					staircasePrice = {}; //очищаем глобальный массив цен элементов лестницы
					if ($("#calcType").val() == "railing") {
						calcRailingModulePrice()
					}else{
						if($("#calcType").val() == "vhod" && params.staircaseType == "Готовая"){
							calculateCarcasPrice_stock();
							calculateRailingPrice_stock();
						}else{
							calculateCarcasPrice();
							calculateRailingPrice2(); //функция в файле priceLib.js
						}
						calculateBanisterPrice(); //функция в файле priceCalcBanister.js
						calcWrPrice(); //функция в файле /calculator/wardrobe/priceCalc.js
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
				resolve();
			}catch (error) {
				prepareFatalErrorNotify(error);
				reject();
			}
		}});
	});
}

function staircaseLoaded(){
	$('#loaderBlock').hide();

	var rt2 = performance.now();
	console.log('recalculate time: ' + (rt2 - rt1) / 1000)
	
	//Создаем после построения лестницы
	createCamCurve();
	if (window.menu) {
		window.menu.update();
	}
}

if (window.prepareFatalErrorNotify == undefined) {
	window.prepareFatalErrorNotify = function(err){
		console.log(err);
	}
}