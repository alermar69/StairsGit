

// функция расчёта спецификации

function calculateSpec(){

	//Инициализация справочника деталей
	var partsList = createPartsList();
	var item = {}

	//задаем тип болтов каркаса
	if(params.boltHead == "countersunk") {
		carcasBoltId = "hexVint_M10x30";
		treadBoltId = "hexVint_M10x30";
		if(params.stairFrame == "нет") treadBoltId = "hexVint_M10x20";
		}
	if(params.boltHead == "hexagon") {
		carcasBoltId = "bolt_M10x30";
		treadBoltId = "bolt_M10x30";	
		}


	var wndRiserScrewId = "screw_4x19";
	if (params.calcType !== 'vhod') {//FIX
		if(wndFrames == "профиль") wndRiserScrewId = "screw_4x32";
	}

	
    //учитываем покраску болтов

    if(params.metalPaint != "нет" && params.paintedBolts != "нет") {
		partsList[carcasBoltId].metalPaint = true;
		partsList[treadBoltId].metalPaint = true;
		partsList["bolt_M10x40"].metalPaint = true;
		}
    else{
		partsList[carcasBoltId].metalPaint = false;
		partsList[treadBoltId].metalPaint = false;
		partsList["bolt_M10x40"].metalPaint = false;
    }
	
	/*
	список id деталей, добавляемых из specObj
	stringer
	carcasAngle
	bridge
	adjustableLeg
	carcasFlan
	topFlan
	stringerFlan
	vertFrame
	pltStringer
	treadFrame
	wndFrame1
	wndFrame2
	wndFrame3
	wndFrame6
	treadAngle
	tread
	wndTread
	wndTreadMid
	startTread
	riser
	riser_arc
	skirting_vert
	skirting_hor
	column
	brace
	bolt
	
	учесть длинные болты на перемычках площадок где уголки с двух сторон
	сделать расчет объема для фот через функцию 
		addTimberWorks("rect", "platformShield_top", 2, partsList);
	*/


for(var partName in partsAmt){
	var itemsPar = {
		specObj: partsAmt,
		partName: partName,
		metalPaint: partsAmt[partName]["metalPaint"],
		timberPaint: partsAmt[partName]["timberPaint"],
		division: partsAmt[partName]["division"],
		itemGroup: partsAmt[partName]["group"],
		comment: "",
	}
	if(partsAmt[partName].comment) itemsPar.comment = partsAmt[partName].comment;

	/*
	if(itemsPar.itemGroup == "Ограждения") {
		itemsPar.timberPaintRailing = itemsPar.timberPaint;
		itemsPar.metalPaintRailing = itemsPar.metalPaint;
		}
	*/
	//информация о фланцах забежных рамок
	var paramsId = "";
	if(partName == "wndFrame1") paramsId = "frame1Flans";
	if(partName == "wndFrame2") paramsId = "frame2Flans";
	if(partName == "wndFrame3") paramsId = "frame3Flans";
	if(partName == "wndFrame6") paramsId = "frame6Flans";
	
	if(staircasePartsParams[paramsId]){
		itemsPar.comment += "Фланцы: "
		for(var i=0; i<staircasePartsParams[paramsId].length; i++){
			itemsPar.comment += staircasePartsParams[paramsId][i];
			if(i<staircasePartsParams[paramsId].length - 1) itemsPar.comment += "; ";
			}
		}
	
	if(partName == "treadFrame" && params.riserType == "есть") itemsPar.comment = "Сверлить под подступенки";
	partsList.addSpecObjItems(itemsPar);
	}

function addCarcasItems(){}; //пустая функция для навигации
/*
//гайки регулируемых опор
	item = {
		id: "nut_M20",
		amt: getPartAmt("adjustableLeg") * 2,
		discription: "Деталь регулируемой опоры",
		unit: "Регулируемые опоры",
		itemGroup: "Каркас",
		};
	if(item.amt > 0) partsList.addItem(item);
*/	
function addTreadItems(){}; //пустая функция для навигации

//ступени
	
	var treadPar = getTreadParams(); //функция в файле calcSpecGeneral.js
	
	if(params.stairType != "нет"){

	var fixPartAmt = getPartAmt("tread") * 4;	
	if(treadPar.fixPart == "boltMeb") fixPartAmt = getPartAmt("tread") * 6;
	if(treadPar.fixPart == "scotch") fixPartAmt = getPartAmt("tread") * 2 * params.M / 1000;
	
	
	// item = {
	// 	id: treadPar.fixPartId,
	// 	amt: fixPartAmt,
	// 	discription: "Крепление ступеней",
	// 	unit: "Крепление ступеней",
	// 	itemGroup: "Ступени",
	// 	};
	// if(item.amt > 0 && treadPar.fixPartId) partsList.addItem(item);

	// if(treadPar.fixPart == "boltMeb"){
	// 	item = {
	// 		id:  "nut_M6",
	// 		amt: fixPartAmt,
	// 		discription: "Крепление ступеней",
	// 		unit: "Крепление ступеней",
	// 		itemGroup: "Ступени",
	// 		};
	// 	if(item.amt > 0) partsList.addItem(item);

	// 	item = {
	// 		id:  "shim_M6",
	// 		amt: fixPartAmt,
	// 		discription: "Крепление ступеней",
	// 		unit: "Крепление ступеней",
	// 		itemGroup: "Ступени",
	// 		};
	// 	if(item.amt > 0) partsList.addItem(item);
	// 	}

//забежные ступени

	// item = {
	// 	id: treadPar.fixPartId,
	// 	amt: getPartAmt("wndTread") * 6,
	// 	discription: "Крепление забежных ступеней",
	// 	unit: "Крепление ступеней",
	// 	itemGroup: "Ступени",
	// 	};
	// if(item.amt > 0 && treadPar.fixPartId) partsList.addItem(item);

	// item = {
	// 	id: treadPar.fixPartId,
	// 	amt: getPartAmt("wndTreadMid") * 6,
	// 	discription: "Крепление забежных ступеней",
	// 	unit: "Крепление ступеней",
	// 	itemGroup: "Ступени",
	// 	};
	// if(item.amt > 0 && treadPar.fixPartId) partsList.addItem(item);
	
//пригласительные ступени

	// item = {
	// 	id: treadPar.fixPartId,
	// 	amt: getPartAmt("startTread") * 8,
	// 	discription: "Крепление забежных ступеней",
	// 	unit: "Крепление ступеней",
	// 	itemGroup: "Ступени",
	// 	};
	// if(item.amt > 0 && treadPar.fixPartId) partsList.addItem(item);
	
	
//подступенки

	var wndTreadAmt = getPartAmt("wndTread") + getPartAmt("wndTreadMid");
	if(getPartAmt("riser")){
		// item = {
		// 	id:  "screw_4x32",
		// 	amt: getPartAmt("riser") * 6 - wndTreadAmt * 3,
		// 	discription: "Крепление подступенков",
		// 	unit: "Крепление подступенков",
		// 	itemGroup: "Ступени",
		// 	};
		// if(item.amt > 0) partsList.addItem(item);
		
		// item = {
		// 	id:  "screw_4x19",
		// 	amt: wndTreadAmt * 3,
		// 	discription: "Крепление подступенков забежных рамок сверху",
		// 	unit: "Крепление подступенков",
		// 	itemGroup: "Ступени",
		// 	};
		// if(item.amt > 0) partsList.addItem(item);
	}
	
}

/***  ОПОРНЫЕ КОЛОННЫ  ***/


function columnsAdd(){}; //пустая функция для навигации
	// if (!(params.calcType == 'vhod' && params.staircaseType == 'Готовая')) {
	// 	item = {
	// 		id:  "banisterInnerFlange",
	// 		amt: getPartAmt("column"),
	// 		discription: "Закладная колонн",
	// 		unit: "колонны",
	// 		itemGroup: "Каркас",
	// 		};
	// 	if(item.amt > 0) partsList.addItem(item);
	// }
	
	
    if(params.columnModel == "40х40" && params.calcType !== 'vhod'){
		// item = {
		//     id:  "plasticPlug_40_40",
		//     amt: getPartAmt("column") * 2,
		//     discription: "Опоры колонн",
		//     unit: "колонны",
		//     itemGroup: "Каркас",
		// };
		// if(item.amt > 0) partsList.addItem(item);
		}
		
    // if(params.columnModel == "100x50") {

		// item = {
		//     id:  "plasticPlug_100_50",
		//     amt: getPartAmt("column"),
		//     discription: "Опоры колонн",
		//     unit: "колонны",
		//     itemGroup: "Каркас",
		// 	};
		// if(item.amt > 0) partsList.addItem(item);		
		// }

		
//подкосы

function bracesAdd(){}; //пустая функция для навигации
	
	//подкосы

	// item = {
	// 	id:  "plasticPlug_60_30",
	// 	amt: getPartAmt("brace") * 2,
	// 	discription: "Заглушки подкосов",
	// 	unit: "Подкосы",
	// 	itemGroup: "Каркас",
	// 	};
	// if(item.amt > 0) partsList.addItem(item);

	// item = {
	// 	id: "braceFork",
	// 	amt: 2 * getPartAmt("brace"),
	// 	discription: "Деталь подкоса",
	// 	unit: "Подкосы",
	// 	itemGroup: "Каркас",
	// 	};
	// if(item.amt > 0) partsList.addItem(item);		
	
	// item = {
	// 	id: "bolt_M10x70",
	// 	amt: 2 * getPartAmt("brace"),
	// 	discription: "Деталь подкоса",
	// 	unit: "Подкосы",
	// 	itemGroup: "Каркас",
	// 	};
	// if(item.amt > 0) partsList.addItem(item);

	// item = {
	// 	id:  "nut_M10",
	// 	amt: 2 * getPartAmt("brace"),
	// 	discription: "Деталь подкоса",
	// 	unit: "Подкосы",
	// 	itemGroup: "Каркас",
	// 	};
	// if(item.amt > 0) partsList.addItem(item);

	// item = {
	// 	id:  "shim_M10",
	// 	amt: 4 * getPartAmt("brace"),
	// 	discription: "Деталь подкоса",
	// 	unit: "Подкосы",
	// 	itemGroup: "Каркас",
	// 	};
	// if(item.amt > 0) partsList.addItem(item);

	
//крепление плинтусов
	// if(getPartAmt("skirting_hor")){
	// 	var tubeAmt = Math.floor(getPartAmt("skirting_hor") / 8);
	// 	if(tubeAmt < 1) tubeAmt = 1;
	// 	item = {
	// 		id:  "silicone",
	// 		amt: tubeAmt,
	// 		discription: "Крепление плинтусов",
	// 		unit: "Ступени",
	// 		itemGroup: "Ступени",
	// 		};
	// 	if(item.amt > 0) partsList.addItem(item);
	// }


// ОГРАЖДЕНИЯ
	
function railingItemsAdd_nav(){}; //пустая функция для навигации
	
//функция в файле /manufacturing/general/calc_spec/calcSpec.js
var railingSpecPar = {
	unit: "staircase",
	}
railingSpecPar = railingItemsAdd(railingSpecPar);


for(var i=0; i<railingSpecPar.items.length; i++){
	partsList.addItem(railingSpecPar.items[i]);
	}
	
//балюстрада
	
function balustradeItemsAdd(){}; //функция для навигации
	
	calcSpecBanister(partsList);
	

	
function addMetiz(){};

	// if(params.isPlasticCaps == "есть"){
	// 	item = {
	// 		id: "plasticCap_M10",
	// 		amt: getPartAmt("bolt"),
	// 		discription: "Колпачки",
	// 		unit: "Метизы",
	// 		itemGroup: "Каркас",
	// 		comment: "Рассчитано по болтам",
	// 		};
	// 	if(item.amt > 0) partsList.addItem(item);
	// 	partsList["plasticCap_M10"].comment = "Рассчитано по болтам";
	
	// }
	

function addWorks(){}

crateWorksList();
calcWorks(partsAmt, "staircase");
calcWorks(partsAmt_bal, "banister");
printWorks2();

//материалы
createMaterialsList(); // обнуляем список материалов
calcMaterialsAmt();
printMaterialsNeed();
	

		
		
    // вывод спецификации "Комплектовка"
    printSpecificationCollation(partsList);
    // вывод спецификации "Сборка"
    //printSpecificationAssembly(partsList);
    //включаем сортировку и поиск по таблица спецификаций
    $('.tab_4').tablesorter({
		widgets: [ 'zebra', 'filter' ],
		theme: 'blue',
		usNumberFormat : false,
		sortReset      : true,
		sortRestart    : true,
		});
	
	showDrawingsLinks();
	printPartsAmt(); //функция в файле calcSpecGeneral.js
	printPoleList(); //функция в файле calcSpecGeneral.js
	
	if(typeof modelSpec !== 'undefined') modelSpec = partsList;


} //end of calculateSpec




function showDrawingsLinks(){

	var pathFrames = "/drawings/frames/";
	var pathTreads = "/drawings/treads/";
	var fileName = "01.pdf";
	var fileNameP = "p-01.pdf";
	var fileNameRectTread = "rectTreads";
	var fileNameWndTread = "winderTreads";
	var fileNamePlatformHalf = "platformHalf"
	
	var turnSideName = "right";
	if(params.turnSide == "левое") turnSideName = "left";
	
	var stairType = "timber";
	if(params.stairType == "рифленая сталь") stairType = "metal";
	if(params.stairType == "лотки") stairType = "metal";
	if(params.stairType == "рифленый алюминий") stairType = "metal";
	if(params.stairType == "дпк") stairType = "dpc";
	if(params.stairType == "стекло") stairType = "glass";
	if(params.stairType == "нет") stairType = "no";

	if(stairType == "metal"){
		if(params.M <= 900 ) fileName = "06.pdf";
		if(params.M > 900 ) fileName = "07.pdf";
		fileNameP = "p-02.pdf";
		};
	if(stairType == "dpc"){
		if(params.M <= 900 ) fileName = "frame_dpc.pdf";
		if(params.M > 900 ) fileName = "frame_dpc_long.pdf";
		};
	if(stairType == "glass"){
		if(params.M <= 900 ) fileName = "02.pdf";
		if(params.M > 900 ) fileName = "03.pdf";
		fileNameP = "p-02.pdf";
		};
	
	
		
	if(params.model == "лт") {
		fileNameWndTread += "_lt_";
		fileNameRectTread += "_lt";
		fileNamePlatformHalf += "_lt"; 
		}
	if(params.model == "ко") {
		fileNameWndTread += "_ko_";
		fileNameRectTread += "_ko";
		fileNamePlatformHalf += "_ko";
		}
	fileNameWndTread += turnSideName;
	if(params.riserType == "есть") {
		fileNameWndTread += "_risers";
		fileNameRectTread += "_risers";
		}
	fileNameWndTread += ".pdf";
	fileNameRectTread += ".pdf";
	fileNamePlatformHalf += ".pdf";

	var isPlatform = false;
	var isWinder = false;
	if(params.stairModel == "Г-образная с площадкой") isPlatform = true;
	if(params.stairModel == "Г-образная с забегом") isWinder = true;
	if(params.stairModel == "П-образная с площадкой") isPlatform = true;
	if(params.stairModel == "П-образная с забегом") isWinder = true;
	if(params.stairModel == "П-образная трехмаршевая") {
		if(params.turnType_1 == "площадка") isPlatform = true;
		if(params.turnType_2 == "площадка") isPlatform = true;
		if(params.turnType_1 == "забег") isWinder = true;
		if(params.turnType_2 == "забег") isWinder = true;
		}
	if(params.platformTop == "площадка") isPlatform = true;
	
	
	
	var links = "<p>Типовые чертежи:</p>";
	//рамки прямых ступеней
	if(params.stairFrame == "есть") links += "<a href='" + pathFrames + fileName + "' target='_blank'>Рамки прямые</a><br/>";
	//рамки забежных ступеней
	if(params.stairFrame == "есть" && isWinder) links += "<a href='" + pathFrames + "winderFrames_ko_" + turnSideName + ".pdf' target='_blank'>Рамки забежных ступеней</a><br/>"
	//рамки площадки
	//if(params.stairFrame == "есть" && isPlatform && params.model != "ко") links += "<a href='" + pathFrames + fileNameP + "' target='_blank'>Рамки площадки</a><br/>"
	//вертикальная рамка
	if(params.topAnglePosition == "вертикальная рамка") links += "<a href='" + pathFrames + "top_frame.pdf' target='_blank'>Вертикальная рамка крепления к верхнему перекрытию<br/></a>"
	//Прямые ступени
	if(stairType == "timber") links += "<a href='" + pathTreads + fileNameRectTread + "' target='_blank'>Прямые ступени</a><br/>";
	if(stairType == "metal") links += "<a href='" + pathTreads + "steelTread.pdf' target='_blank'>Прямые ступени</a><br/>";

	//Забежные ступени
	if(stairType == "timber" && isWinder) links += "<a href='" + pathTreads + fileNameWndTread + "' target='_blank'>Забежные ступени</a><br/>";
	//половинки площадки
	if(stairType == "timber" && isPlatform) links += "<a href='" + pathTreads + fileNamePlatformHalf + "' target='_blank'>Щиты площадки</a><br/>" 
	if(stairType == "metal" && isPlatform) links += "<a href='" + pathTreads + "steelPlatform.pdf' target='_blank'>Площадки</a><br/>";

	//забежные подступенки
	if(params.riserType == "есть" && params.model == "ко" && isWinder) links += "<a href='" + pathTreads + "wndRisers.pdf' target='_blank'>Подступенки забега</a><br/>" 
	//колонны
	if(params.isColumn1 || 
		params.isColumn2 || 
		params.isColumn3 || 
		params.isColumn4 || 
		params.isColumn5 || 
		params.isColumn6 || 
		params.isColumn7 || 
		params.isColumn8) 
			links += "<a href='/drawings/carcas/column_100x50.pdf' target='_blank'>Колонны</a><br/>" 

	
	
	
	 $("#drawings").html(links)
	 
	 
	 
	}



