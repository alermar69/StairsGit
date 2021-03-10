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
	addViewport();

	//пересчитываем лестницу
	if (window.loadedData) {
		setLoadedData(window.loadedData, true);
	}else{
		recalculate();
	}
});

function recalculate() {
	rt1 = performance.now();
	var isStaircaseCalc = getCalcTypeMeta().isStaircaseCalc; //является ли текущий расчет расчетом лестницы
	if (!testingMode) boltDiam = boltDiamNoTest;
	return new Promise(function(resolve, reject){
		try {
			shapesList = []; //Очищаем
			changeAllForms();

			var drawFunc = function(){};
			if($("#calcType").val() == "carport") drawFunc = drawCarport;
			else if($("#calcType").val() == "veranda") drawFunc = drawVeranda;
			else if($("#calcType").val() == "slabs" || $("#calcType").val() == "table") drawFunc = drawTable;
			else if($("#calcType").val() == "sill") drawFunc = drawSills;
			else if($("#calcType").val() == "sideboard") drawFunc = drawSideboard;
			else if($("#calcType").val() == "coupe") drawFunc = drawCoupeWr;
			else if($("#calcType").val() == "objects") drawFunc = drawObjects;
			else drawFunc = drawStaircase;
				
			drawFunc('vl_1', true);
			// redrawWalls();
			
			// if(params.calcType != "objects") drawSceneDimensions();
			
			// updateModifyChanges();

			if ($("#calcType").val() == "objects") staircaseLoaded();
			resolve();
		}catch (error) {
			prepareFatalErrorNotify(error);
			reject();
		}
	});
}

function staircaseLoaded(){
	var rt2 = performance.now();
	console.log('recalculate time: ' + (rt2 - rt1) / 1000)

	if (firstLoad) {
		var event = new Event('iframeLoaded');
		window.dispatchEvent(event);
		firstLoad = false;
	}
}

if (window.prepareFatalErrorNotify == undefined) {
	window.prepareFatalErrorNotify = function(err){
		console.log(err);
	}
}