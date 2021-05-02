var params = {}; //глобальный массив значений инпутов
var dxfPrimitivesArr = []; //глобоальный массив примитивов для экспорта в dxf
var dxfPrimitivesArr0 = []; //вспомогательный глобоальный массив
// var staircasePrice = {}; //глобальный массив цен элементов лестницы
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
var dxfBasePoint = {x:0,y:0,z:0};
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
var boltDiamNoTest = typeof boltDiam != 'undefined' ? boltDiam : 10;
var firstLoad = true;

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
	// createMaterialsList(); //в файле /calculator/general/materials.js

	var wallsSelector = '#nav-walls';
	if (window.location.href.indexOf('/installation/') != -1) {
		wallsSelector = '.tabs';

		//скрываем ненужные блоки
		$("#mainImages").hide();
		$("#marshRailingImages2D").hide();
		$("#cost").hide();
		$('#specificationList').show();
		$("#drawings").hide();
		$("#works").hide();
		$('.form_table input,select,textarea').attr('disabled', 'disabled');
		$("#sidebar-toggle").hide();
		$("#carcasForm h2,h4").hide();
		$("#assembling_inputs table.form_table").show();
		$("#assembling_inputs h4").show();
		$("#wr_inputsWrap").hide();
		$(".priceDiv").hide();
		
		$("#assembling table.form_table").show();
	}
	//перерисовка стен при измененнии инпутов формы параметров стен
  $(wallsSelector).delegate('input,select', 'change', function(){
		getAllInputsValues(params);
		redrawWalls();
		if(isStaircaseCalc)	drawTopFloor();
		drawSceneDimensions();
	});
	
	
	//перерисовка балюстрады при измененнии инпутов формы параметров балюстрады
  $('#nav-banister').delegate('input,select', 'change', function(){
		getAllInputsValues(params);
		if(isStaircaseCalc) drawBanister();
	});
	
	
	//Вызов рассчета геометрии
	$("#calcGeometry").click(function(){
		if(isStaircaseCalc && params.calcType != "vint"){
			 calculateGeom();
			 recalculate();
		}
	})

	//задаем начальное положение стен
	if(isStaircaseCalc && params.calcType != "vint"){
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
	
	//стены по умолчанию нулевой толщины
	
	if(!isStaircaseCalc){
		$("#wallThickness_1").val(0);
		$("#wallThickness_2").val(0);
		$("#wallThickness_3").val(0);
		$("#wallThickness_4").val(0);
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
	
  loadAsyncData(function(){
    //пересчитываем лестницу
    if (window.loadedData) {
      if (window.loadedData.is_multi == '1' && window.location.href.indexOf('multiCalcType=') == -1) {
        window.location.href = window.location.href += '&multiCalcType=' + loadedData.calc_type;
      }else{
        setLoadedData(window.loadedData, true);
      }
    }else{
      recalculate();
    }
  })
});
function recalculate() {
	window.customDimensions = [];
	if (window.isMulti && !params.priceItems) params.priceItems = [];

	rt1 = performance.now();
	var isStaircaseCalc = getCalcTypeMeta().isStaircaseCalc; //является ли текущий расчет расчетом лестницы
	if (!testingMode) boltDiam = boltDiamNoTest;
	return new Promise(function(resolve, reject){
		$('#loaderBlock').show({done: function(){
			try {
				createMaterialsList();
				shapesList = []; //Очищаем
				changeAllForms();
				if (window.location.href.includes('/timber_stock')) setStockParams();

				var drawFunc = function(){};
				if($("#calcType").val() == "carport") drawFunc = drawCarport;
				else if($("#calcType").val() == "veranda") drawFunc = drawVeranda;
				else if($("#calcType").val() == "slabs" || $("#calcType").val() == "table") drawFunc = drawTable;
				else if($("#calcType").val() == "sill") drawFunc = drawSills;
				else if($("#calcType").val() == "sideboard") drawFunc = drawSideboard;
				else if($("#calcType").val() == "coupe") drawFunc = drawCoupeWr;
				else if($("#calcType").val() == "objects") drawFunc = drawObjects;
				else drawFunc = drawStaircase;
				
				if(!window.isMulti || window.isMulti && currentPriceItem != null) drawFunc('vl_1', true);
				redrawWalls();
				
				if(isStaircaseCalc){
					drawTopFloor();
					drawBanister();
				}
				if($("#calcType").val() == "railing") redrawConcrete();

				redrawAdditionalObjects();

				//данные для производства
				if (!menu.simpleMode) {
					// createMaterialsList(); // обнуляем список материалов
					crateWorksList();
					calcWorks(partsAmt, "staircase");
					calcWorks(partsAmt_bal, "banister");
					$.each(partsAmt_dop, function(){
						calcWorks(this, "objects");
					});
					
					if (window.location.href.indexOf('/manufacturing/') != -1) {
						calculateSpec();
						if(!testingMode) checkSpec();
					}
				}

				if(params.calcType != "objects")drawSceneDimensions();
				
				
				if((isStaircaseCalc || params.calcType == "veranda") && window.location.href.indexOf('/installation/') == -1) printGeomDescr();

				if (window.location.href.indexOf('/manufacturing/') != -1) {
					setHiddenLayers(); //скрываем слои в режиме тестирования
				}
				
				calculatePrintMaterials(); // Расчет потребности в материалах
				
				//расчет цены
				if(params.calcType != "geometry"){
					// staircasePrice = {}; //очищаем глобальный массив цен элементов лестницы
					if ($("#calcType").val() == "railing") {
						calcRailingModulePrice()
					}else{
						if($("#calcType").val() == "vhod" && params.staircaseType == "Готовая"){
							calculateCarcasPrice_stock();
							calculateRailingPrice_stock();
						}else if($("#calcType").val() != "objects"){
							calculateCarcasPrice();
							calculateRailingPrice2(); //функция в файле priceLib.js
						}
						if ($("#calcType").val() != "objects") {
              calculateBanisterPrice(); //функция в файле priceCalcBanister.js
							calcWrPrice(); //функция в файле /calculator/wardrobe/priceCalc.js
						}
					}
          console.log(staircaseCost.banister_glass_part);
          calculateTotalPrice2(); //функция в файле priceLib.js
          console.log(staircaseCost.banister_glass_part);
					printPrice2(); //функция в файле priceLib.js
					printCost2(); //функция в файле priceLib.js

					printMaterialsNeed();
					calcProductionTime();
					printWorks2();
					formatNumbers();
					printDescr();

					if (window.location.href.indexOf('/installation/') != -1) {
						var comments = "<h3>Комментарии менеджера</h3><p>";
						if($("#comments_mounting").val()) comments += $("#comments_mounting").val() + "</br>";
						if($("#comments_03").val()) comments += $("#comments_03").val() + "</br>";
						if($("#comments_06").val()) comments += $("#comments_06").val() + "</br>";
						if($("#comments_06_bal").val()) comments += $("#comments_06_bal").val() + "</br>";
						if($("#comments").val()) comments += $("#comments").val() + "</br>";
						comments += "</p>"
	
						$("#allComments").html(comments);
					}
				}

				if (window.updateDxfLinks) updateDxfLinks();

				if(params.calcType == "vhod" && !menu.simpleMode){			
					if(params.staircaseType == 'Готовая') {
						$("#dpcWidth").val("140");
						calcSpec_vl();
					}
				}

				updateModifyChanges();

				setTimeout(function(){
					if(params.calcType == "objects") drawSceneDimensions();
				}, 0);

				if ($("#calcType").val() == "objects" || window.isMulti && currentPriceItem == null) staircaseLoaded();
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
	console.log('recalculate time: ' + (rt2 - rt1) / 1000);

	if (firstLoad) {
		var event = new Event('staircaseLoaded');
		window.dispatchEvent(event);
		firstLoad = false;
	}
	
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