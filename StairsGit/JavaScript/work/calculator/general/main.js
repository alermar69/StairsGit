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
		if($("#calcType").val() != "railing"){
			drawTopFloor();
			redrawWalls();
		}
		
		drawSceneDimensions();
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
	recalculate();
});

function recalculate(){
	return new Promise(function(resolve, reject){
		$('.loader-block').show({done: function(){
			try {
				shapesList = []; //Очищаем
				if($("#calcType").val() == "timber_stock"){
					setStockParams()
				}
				getAllInputsValues(params);
				changeAllForms();

				drawStaircase('vl_1', true);
				redrawWalls();

				if($("#calcType").val() == "railing"){
					drawConcrete('vl_1');
				}
				else {
					drawTopFloor();				
					drawBanister();
				}

				//данные для производства
				createMaterialsList(); // обнуляем список материалов
				crateWorksList();
				calcWorks(partsAmt, "staircase");
				calcWorks(partsAmt_bal, "banister");

				drawSceneDimensions();
				
				if($("#calcType").val() != "railing"){
					printGeomDescr();
				}
			
				//расчет цены
				if(params.calcType != "geometry"){
					staircasePrice = {}; //очищаем глобальный массив цен элементов лестницы
					if($("#calcType").val() == "railing"){
						calcGlassRailingPrice();
					}
					else {
						if($("#calcType").val() == "vhod" && params.staircaseType == "Готовая"){
							calculateCarcasPrice_stock();
							calculateRailingPrice_stock();
						}else{
							calculateCarcasPrice(); //функция в файле /calculator/metal/priceCalc_2.0.js
							calculateRailingPrice2(); //функция в файле priceLib.js
						}
						calculateBanisterPrice(); //функция в файле priceCalcBanister.js
						calcWrPrice(); //функция в файле /calculator/wardrobe/priceCalc.js
						calculateTotalPrice2(); //функция в файле priceLib.js
						printPrice2(); //функция в файле priceLib.js
						printCost2(); //функция в файле priceLib.js
					}

					printMaterialsNeed();
					calcProductionTime();
					printWorks2();
					formatNumbers();
					printDescr();

					resolve();
				}
			}catch (error) {
				prepareFatalErrorNotify(error);
				reject();
			}
		}});
	});
}

function staircaseLoaded(){
	$('.loader-block').hide();
	setTimeout(function(){
		//Создаем после построения лестницы
		createCamCurve();
		if (window.menu) {
			window.menu.update();
		}
	}, 0);
}
