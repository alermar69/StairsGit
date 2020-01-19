function createPartsList(){
	
    var list = {
		addItem: addItem, //функция в файле /manufacturing/general/calc_spec/calcSpec.js
		addSpecObjItems: addSpecObjItems, //функция в файле /manufacturing/general/calc_spec/calcSpec.js
		};
	
	//общие позиции для всех лестницы
	addGeneralItems(list); //функция в файле /calculator/general/calcSpec.js

	return list;
}//end of createPartsList



// функция расчёта спецификации
function calculateSpec(){


	/* Инициализация справочника деталей*/
	var partsList = createPartsList();
	var item = {}
	
	
		/*
	список id деталей, добавляемых из specObj
	stringer
	treadPlate
	treadPlateWld
	treadPlateWnd
	treadPlateWldWnd
	carcasFlan
	column
	brace
	doubleBrace
	pltFrame
	lastRackFlan
	racks
	turnRack
	bolt
	*/


	for(var partName in partsAmt){
		var itemsPar = {
			specObj: partsAmt,
			partName: partName,
			metalPaint: partsAmt[partName]["metalPaint"],
			timberPaint: partsAmt[partName]["timberPaint"],
			division: partsAmt[partName]["division"],
			itemGroup: partsAmt[partName]["group"],
			
		}
		if(partsAmt[partName].comment) itemsPar.comment = partsAmt[partName].comment;

		partsList.addSpecObjItems(itemsPar);
		}
/*	
	//крепление ступеней к каркасу
	var treadFixItems = calcTreadFixMetiz();
		for(var i=0; i<treadFixItems.length; i++){
		partsList.addItem(treadFixItems[i]);
		}
*/	

//крепления к перекрытиям
/*
function floorsMountingItemsAdd(){}; //пустая функция для навигации	
	
	//крепление к нижнему перекрытию
	var fixParams = {
		partsList: partsList,
		fixPart: params.fixPart1,
		fixSurfaceType: params.fixType1,
		discription: "Крепление к нижнему перекрытию",
		unit: "Низ лестницы",
		itemGroup: "Крепление к обстановке",
		amt: 4,
		extraStudLength: params.fixSpacerLength1,
		studDiam: 10,
		}
	if(params.isAssembling == "есть") addFixParts(fixParams);
	
	//проставка
	if(params.fixPart1 != "не указано" && params.fixPart1 != "нет" && 
		params.fixSpacer1 != "не указано" && params.fixSpacer1 != "нет"){
			item = {
				id: "fixSpacer1",
				amt: 2,
				discription: "Крепление к нижнему перекрытию",
				unit: "bottomMountingItemsAdd",
				itemGroup: "Крепление к перекрытиям",
				};
			if(item.amt > 0) partsList.addItem(item);					
			}
		
	//крепление колонн
	var fixParams = {
		partsList: partsList,
		fixPart: params.fixPart1,
		fixSurfaceType: params.fixType1,
		discription: "Крепление колонн к перекрытию",
		unit: "Низ лестницы",
		itemGroup: "Крепление к обстановке",
		amt: getPartAmt("column") * 4,
		extraStudLength: 0,
		studDiam: 10,
		}
	if(params.isAssembling == "есть") addFixParts(fixParams);
	
	//крепление первой стойки

	var fixParams = {
		partsList: partsList,
		fixPart: "саморезы",
		fixSurfaceType: params.fixType1,
		discription: "Крепление первой стойки к перекрытию",
		unit: "Низ лестницы",
		itemGroup: "Крепление к обстановке",
		amt: 4,
		extraStudLength: 0,
		studDiam: 10,
		}
	if(params.isAssembling == "есть" && params.railingSide_1 != "нет") addFixParts(fixParams);
	
	//крепление к верхнему перекрытию
	var fixParams = {
		partsList: partsList,
		fixPart: params.fixPart2,
		discription: "Крепление к верхнему перекрытию",
		unit: "Верх лестницы",
		itemGroup: "Крепление к обстановке",
		amt: 4,
		extraStudLength: params.fixSpacerLength2,
		studDiam: 10,
		}
	
	if(params.isAssembling == "есть") addFixParts(fixParams);
	
	//проставка
	if(params.fixPart2 != "не указано" && params.fixPart2 != "нет" && 
		params.fixSpacer2 != "не указано" && params.fixSpacer2 != "нет"){
			item = {
				id: "fixSpacer2",
				amt: 2,
				discription: "Крепление к верхнему перекрытию",
				unit: "topMountingItemsAdd",
				itemGroup: "Крепление к перекрытиям",
				};
			if(item.amt > 0) partsList.addItem(item);					
			}
	
//крепление к стенам

function wallsMountingItemsAdd(){} //пустая функция для навигации

	//стена 1
	var fixParams={
		partsList: partsList,
		amt: params.fixAmt3,
		discription: "Крепление к стене 1",
		fixSurfaceType: params.fixType3,
		fixPart: params.fixPart3,
		fixSpacer: params.fixSpacer3,
		fixSpacerLength: params.fixSpacerLength3,
		fixSpacerId: "fixSpacer3",
		}
	 wallMountingItemsAdd(fixParams);
	
	
	//стена 2
	var fixParams={
		partsList: partsList,
		amt: params.fixAmt4,
		discription: "Крепление к стене 2",
		fixSurfaceType: params.fixType4,
		fixPart: params.fixPart4,
		fixSpacer: params.fixSpacer4,
		fixSpacerLength: params.fixSpacerLength4,
		fixSpacerId: "fixSpacer4",
		}
	 wallMountingItemsAdd(fixParams);
	
	//стена 3
	var fixParams={
		partsList: partsList,
		amt: params.fixAmt5,
		discription: "Крепление к стене 3",
		fixSurfaceType: params.fixType5,
		fixPart: params.fixPart5,
		fixSpacer: params.fixSpacer5,
		fixSpacerLength: params.fixSpacerLength5,
		fixSpacerId: "fixSpacer5",
		}
	 wallMountingItemsAdd(fixParams);
	
	//стена 4
	var fixParams={
		partsList: partsList,
		amt: params.fixAmt6,
		discription: "Крепление к стене 4",
		fixSurfaceType: params.fixType6,
		fixPart: params.fixPart6,
		fixSpacer: params.fixSpacer6,
		fixSpacerLength: params.fixSpacerLength6,
		fixSpacerId: "fixSpacer6",
		}
	 wallMountingItemsAdd(fixParams);

	//end of wallsMountingItemsAdd	
*/
	
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
	//болты

	// item = {
	// 	id: "capNut_M16",
	// 	amt: getPartAmt("boltM16"),
	// 	discription: "Гайки",
	// 	unit: "Метизы",
	// 	itemGroup: "Каркас",		
	// 	};
	// if(item.amt > 0) partsList.addItem(item);
	// partsList["capNut_M16"].comment = "Рассчитано по болтам";
	   
	// item = {
	// 	id: "shim_M16",
	// 	amt: getPartAmt("boltM16"),
	// 	discription: "Шайбы",
	// 	unit: "Метизы",
	// 	itemGroup: "Каркас",
	// 	comment: "Рассчитано по болтам",
	// 	};
	// if(item.amt > 0) partsList.addItem(item);
	// partsList["shim_M16"].comment = "Рассчитано по болтам";
	
	// if(partsList["rivet_M6"]) partsList["rivet_M6"].comment = "Рассчитано по уголкам балясин";
	
function addWorks(){}

crateWorksList();
calcWorks(partsAmt, "staircase");
calcWorks(partsAmt_bal, "banister");
printWorks2();


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
	
} //end of calculateSpec

function showDrawingsLinks(){

	var pathTreads = "/drawings/treads/";
	var pathRailing = "/drawings/railing_mono/"
	var fileNameRectTread = "rectTreads_mono.pdf";
	if(params.model == "труба") fileNameRectTread = "rectTreads_mono_pipe.pdf";
	var fileNameWndTread = "winderTreads";
	var fileNamePlatformHalf = "platformHalf"
	
	var turnSideName = "_right";
	if(params.turnSide == "левое") turnSideName = "_left";
	
	var stairType = "timber";
	if(params.stairType == "нет") stairType = "no";


		
	fileNameWndTread += "_mono";
	fileNamePlatformHalf += "_mono"; 

	fileNameWndTread += turnSideName;
	
	fileNameWndTread += ".pdf";
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
	//Прямые ступени
	if(stairType == "timber") links += "<a href='" + pathTreads + fileNameRectTread + "' target='_blank'>Прямые ступени</a><br/>";
	//Забежные ступени
	if(stairType == "timber" && isWinder) links += "<a href='" + pathTreads + fileNameWndTread + "' target='_blank'>Забежные ступени</a><br/>";
	//половинки площадки
	if(stairType == "timber" && isPlatform) links += "<a href='" + pathTreads + fileNamePlatformHalf + "' target='_blank'>Щиты площадки</a><br/>" 
	//стойки ограждений
	if(railingSide_1 != "нет" || railingSide_2 != "нет" || railingSide_3 != "нет"){
		if(params.banisterMaterial == "40х40 черн.") var filename = "rack";
		if(params.banisterMaterial == "40х40 нерж.") var filename = "rack_inox";
			links += "<a href='" + pathRailing + filename + ".pdf' target='_blank'>Стойки ограждения марша</a><br/>";
			links += "<a href='" + pathRailing + filename + "_first.pdf' target='_blank'>Первая стойка ограждения марша</a><br/>";
			links += "<a href='" + pathRailing + filename + "_L.pdf' target='_blank'>L-образная стойка ограждения марша</a><br/>";
			
		}
	if(params.railingModel_bal == "Ригели" || params.railingModel_bal == "Стекло на стойках"){
		links += "<a href='" + pathRailing + filename + "_bal.pdf' target='_blank'>Стойка ограждения балюстрады</a><br/>";
		}
	
	//колонны
	if(params.marshMiddleFix_1 == "колонна" || 
		params.marshMiddleFix_2 == "колонна" || 
		params.marshMiddleFix_3 == "колонна" ||
		params.isColumn1 || params.isColumn2 || params.isColumn3 || params.isColumn4){
			if(params.model == "труба") links += "<a href='/drawings/carcas/column_mono_prof.pdf' target='_blank'>Колонны марша</a><br/>"
			else links += "<a href='/drawings/carcas/column_mono.pdf' target='_blank'>Колонны марша</a><br/>";
			}
	
	//подложки
	if(params.model == "труба"){
		links += "<a href='/drawings/mono/treadPlates.pdf' target='_blank'>Подложки прямых ступеней</a><br/>";
		if(isWinder){
			if(turnFactor == 1) links += "<a href='/drawings/mono/treadPlates_wndRight.pdf' target='_blank'>Подложки забежных ступеней (прав)</a><br/>";
			if(turnFactor == -1) links += "<a href='/drawings/mono/treadPlates_wndLeft.pdf' target='_blank'>Подложки забежных ступеней (лев)</a><br/>";
		}
	}
	
	 $("#drawings").html(links)

}//end of showDrawingsLinks


