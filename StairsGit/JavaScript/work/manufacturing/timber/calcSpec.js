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

	//покраска деталей ограждений
	if(params.timberPaint_perila == "как на лестнице") params.timberPaint_perila = params.timberPaint;
	

for(var partName in partsAmt){
	var itemsPar = {
		specObj: partsAmt,
		partName: partName,
		metalPaint: partsAmt[partName]["metalPaint"],
		timberPaint: partsAmt[partName]["timberPaint"],
		division: partsAmt[partName]["division"],
		itemGroup: partsAmt[partName]["group"],
		}

	partsList.addSpecObjItems(itemsPar);
	}






	
	
//крепления к перекрытиям

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
	//if(params.isAssembling == "есть") addFixParts(fixParams);
	
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
	
	//if(params.isAssembling == "есть") addFixParts(fixParams);
	
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

			
//ограждения
	


//метизы
				
	function screwsAdd(){};
	
	var riserScrewAmt = 0;
	var treadScrewAmt = 0;
	var stringerScrewTAmt = 0;
	var stringerScrewKAmt = 0;
	var nagelAmt_risers = 0;
	var nagelAmt_treads = 0;
	var timberPlug_10Amt = 0;
	var timberPlug_20Amt = 0;
		
	if(params.stairModel == "Прямая"){
		if(params.model == "тетивы"){
			treadScrewAmt += Math.ceil(params.stairAmt1 / 2) * 2;
			if(params.riserType == "есть") {
				riserScrewAmt += params.stairAmt1 * 3;
				nagelAmt_risers += params.stairAmt1 * 2;
				}							
			}
		if(params.model == "косоуры"){			
			nagelAmt_treads += params.stairAmt1 * 4;
			if(params.riserType == "есть") {
				riserScrewAmt += params.stairAmt1 * 3;
				nagelAmt_risers += params.stairAmt1 * 2;
				}			
			}				
		if(params.model == "тетива+косоур"){
			treadScrewAmt += Math.ceil(params.stairAmt1 / 2);
			nagelAmt_treads += params.stairAmt1 * 2;
			if(params.riserType == "есть") {
				riserScrewAmt += params.stairAmt1 * 3;
				nagelAmt_risers += params.stairAmt1 * 2;
				}	
			}
			
		//крепление первого столба ограждения
		if(params.railingSide_1 == "внешнее" || params.railingSide_1 == "две") {
			stringerScrewTAmt += 1; //крепление столба
			stringerScrewTAmt += 2; //крепление поручня к столбу				
			}
		if(params.railingSide_1 == "внутреннее" || params.railingSide_1 == "две") {
			stringerScrewTAmt += 1; //крепление столба
			stringerScrewTAmt += 2; //крепление поручня к столбу				
			}
		}//end of Прямая
		
	//общие позиции для всех лестниц кроме прямой
			
	if(params.stairModel != "Прямая"){
		if(params.model == "тетивы"){
			treadScrewAmt += Math.ceil(params.stairAmt1 / 2) * 2; 
			treadScrewAmt += Math.ceil(params.stairAmt3 / 2) * 2;
			if(params.stairModel == "П-образная трехмаршевая") treadScrewAmt += Math.ceil(params.stairAmt2 / 2) * 2;
			if(params.riserType == "есть") {
				riserScrewAmt += params.stairAmt1 * 3;
				nagelAmt_risers += params.stairAmt1 * 2;
				riserScrewAmt += params.stairAmt3 * 3;
				nagelAmt_risers += params.stairAmt3 * 2;
				if(params.stairModel == "П-образная трехмаршевая"){
					riserScrewAmt += params.stairAmt2 * 3;
					nagelAmt_risers += params.stairAmt2* 2;
					}

				}							
			}
		if(params.model == "косоуры"){			
			nagelAmt_treads += params.stairAmt1 * 4;
			nagelAmt_treads += params.stairAmt3 * 4;
			stringerScrewKAmt += 4;
			if(params.riserType == "есть") {
				riserScrewAmt += params.stairAmt1 * 3;
				nagelAmt_risers += params.stairAmt1 * 2;
				riserScrewAmt += params.stairAmt3 * 3;
				nagelAmt_risers += params.stairAmt3 * 2;
				if(params.stairModel == "П-образная трехмаршевая"){
					riserScrewAmt += params.stairAmt2 * 3;
					nagelAmt_risers += params.stairAmt2 * 2;
					stringerScrewKAmt += 4;
					}
				}			
			}				
		if(params.model == "тетива+косоур"){
			treadScrewAmt += Math.ceil(params.stairAmt1 / 2);
			nagelAmt_treads += params.stairAmt1 * 2;
			treadScrewAmt += Math.ceil(params.stairAmt3 / 2);
			nagelAmt_treads += params.stairAmt3 * 2;
			stringerScrewKAmt += 4;
			if(params.riserType == "есть") {
				riserScrewAmt += params.stairAmt1 * 3;
				nagelAmt_risers += params.stairAmt1 * 2;
				riserScrewAmt += params.stairAmt3 * 3;
				nagelAmt_risers += params.stairAmt3 * 2;
				if(params.stairModel == "П-образная трехмаршевая"){
					riserScrewAmt += params.stairAmt2 * 3;
					nagelAmt_risers += params.stairAmt2 * 2;
					stringerScrewKAmt += 4;
					}
				}	
			}
			
		//крепление первого столба ограждения
		if(params.railingSide_1 == "внешнее" || params.railingSide_1 == "две") {
			stringerScrewTAmt += 3; //крепление столба
			stringerScrewTAmt += 4; //крепление поручня к столбу				
			}
		if(params.railingSide_1 == "внутреннее" || params.railingSide_1 == "две") {
			stringerScrewTAmt += 1; //крепление столба
			stringerScrewTAmt += 2; //крепление поручня к столбу				
			}
		if(params.railingSide_3 == "внешнее" || params.railingSide_3 == "две") {
			stringerScrewTAmt += 3; //крепление столба
			stringerScrewTAmt += 4; //крепление поручня к столбу				
			}
		if(params.railingSide_3 == "внутреннее" || params.railingSide_3 == "две") {
			stringerScrewTAmt += 1; //крепление столба
			stringerScrewTAmt += 2; //крепление поручня к столбу				
			}
		if(params.stairModel == "П-образная трехмаршевая"){
			if(params.railingSide_2 == "внешнее" || params.railingSide_2 == "две") {
				stringerScrewTAmt += 3; //крепление столба
				stringerScrewTAmt += 4; //крепление поручня к столбу				
				}
			if(params.railingSide_3 == "внутреннее" || params.railingSide_3 == "две") {
				stringerScrewTAmt += 1; //крепление столба
				stringerScrewTAmt += 2; //крепление поручня к столбу				
				}
			}
	
		} //конец общих позиций
	
	var wndTurnAmt = 0;
	var pltTurnAmt = 0;
	if(params.stairModel == "Г-образная с площадкой") pltTurnAmt = 1;
	if(params.stairModel == "Г-образная с забегом") wndTurnAmt = 1;
		
	if(params.stairModel == "П-образная трехмаршевая"){		
		if(params.turnType_1 == "забег") wndTurnAmt += 1;
		if(params.turnType_2 == "забег") wndTurnAmt += 1;
		if(params.turnType_1 == "площадка") pltTurnAmt += 1;
		if(params.turnType_2 == "площадка") pltTurnAmt += 1;
		}//end of П-образная трехмаршевая
	
	if(pltTurnAmt > 0){
		if(params.model == "тетивы"){
			treadScrewAmt += 6 * pltTurnAmt; //щиты площадки
			if(params.riserType == "есть") {
				//подступенок площадки
				riserScrewAmt += 1 * 3 * pltTurnAmt;
				nagelAmt_risers += 1 * 2 * pltTurnAmt;
				}							
			}
		if(params.model == "косоуры"){			
			nagelAmt_treads += 10 * pltTurnAmt; //щиты площадки
			treadScrewAmt += 1 * pltTurnAmt;
			if(params.riserType == "есть") {
				riserScrewAmt += 1 * 3 * pltTurnAmt;
				nagelAmt_risers += 1 * 2 * pltTurnAmt;
				}			
			}				
		if(params.model == "тетива+косоур"){
			treadScrewAmt += 6 * pltTurnAmt;
			nagelAmt_treads += 4 * pltTurnAmt;
			if(params.riserType == "есть") {
				riserScrewAmt += 1 * 3 * pltTurnAmt;
				nagelAmt_risers += 1 * 2 * pltTurnAmt;
				}	
			}
		}//конец поворота 90гр через площадку
		
	if(wndTurnAmt > 0){
		if(params.model == "тетивы"){
			treadScrewAmt += 6 * wndTurnAmt; //забежные ступени
			if(params.riserType == "есть") {
				riserScrewAmt += 3 * 3 * wndTurnAmt;
				nagelAmt_risers += 3 * 2 * wndTurnAmt;
				}							
			}
		if(params.model == "косоуры"){			
			nagelAmt_treads += 6 * wndTurnAmt; //забежные ступени
			treadScrewAmt += 3 * wndTurnAmt;
			if(params.riserType == "есть") {
				riserScrewAmt += 3 * 3 * wndTurnAmt;
				nagelAmt_risers += 3 * 2 * wndTurnAmt;
				}			
			}				
		if(params.model == "тетива+косоур"){
			treadScrewAmt += 3 * wndTurnAmt;
			nagelAmt_treads = 6 * wndTurnAmt;
			if(params.riserType == "есть") {
				riserScrewAmt += 3 * 3 * wndTurnAmt;
				nagelAmt_risers = 3 * 2 * wndTurnAmt;
				}	
			}
			
		}//конец поворота 90гр через забег
		
	if(params.stairModel == "П-образная с площадкой"){
		if(params.model == "тетивы"){
			treadScrewAmt += 12; //щиты площадки
			if(params.riserType == "есть") {
				//подступенок площадки
				riserScrewAmt += 1 * 3;
				nagelAmt_risers += 1 * 2;
				}							
			}
		if(params.model == "косоуры"){			
			nagelAmt_treads += 12; //щиты площадки
			treadScrewAmt += 2;
			if(params.riserType == "есть") {
				riserScrewAmt += 1 * 3;
				nagelAmt_risers += 1 * 2;
				}			
			}				
		if(params.model == "тетива+косоур"){
			treadScrewAmt += 12;
			nagelAmt_treads += 8;
			if(params.riserType == "есть") {
				riserScrewAmt += 1 * 3;
				nagelAmt_risers += 1 * 2;
				}	
			}
		}//end of П-образная с площадкой
		
	if(params.stairModel == "П-образная с забегом"){
		if(params.model == "тетивы"){
			treadScrewAmt += 12; //забежные ступени
			if(params.riserType == "есть") {
				riserScrewAmt += 6 * 3;
				nagelAmt_risers += 6 * 2;
				}							
			}
		if(params.model == "косоуры"){			
			nagelAmt_treads += 12; //забежные ступени
			treadScrewAmt += 6;
			if(params.riserType == "есть") {
				riserScrewAmt += 6 * 3;
				nagelAmt_risers += 6 * 2;
				}			
			}				
		if(params.model == "тетива+косоур"){
			treadScrewAmt += 6;
			nagelAmt_treads = 12;
			if(params.riserType == "есть") {
				riserScrewAmt += 6 * 3;
				nagelAmt_risers = 6 * 2;
				}	
			}
		}//end of П-образная с забегом
		
	timberPlug_10Amt = riserScrewAmt;
	timberPlug_20Amt = treadScrewAmt + stringerScrewTAmt + stringerScrewKAmt;
			
			
	item = {
		id:  "screw_4x32",
		amt: riserScrewAmt,
		discription: "Крепление подступенков к торцу ступени",
		unit: "screwsAdd",
		itemGroup: "Каркас",
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id:  "screw_8x80",
		amt: treadScrewAmt,
		discription: "Крепление ступеней к тетивам",
		unit: "screwsAdd",
		itemGroup: "Каркас",
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id:  "screw_8x120",
		amt: stringerScrewTAmt,
		discription: "Крепление тетив к столбам",
		unit: "screwsAdd",
		itemGroup: "Каркас",
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id:  "screw_6x60",
		amt: stringerScrewKAmt,
		discription: "Крепление косоуров к столбам",
		unit: "screwsAdd",
		itemGroup: "Каркас",
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id:  "nagel",
		amt: nagelAmt_risers,
		discription: "Крепление подступенков к ступени",
		unit: "screwsAdd",
		itemGroup: "Каркас",
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id:  "nagel",
		amt: nagelAmt_treads,
		discription: "Крепление ступеней к косоурам",
		unit: "screwsAdd",
		itemGroup: "Каркас",
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id:  "timberPlug_10",
		amt: timberPlug_10Amt,
		discription: "Заглушки креплений подступенков к торцу ступени",
		unit: "screwsAdd",
		itemGroup: "Каркас",
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id:  "timberPlug_20",
		amt: timberPlug_20Amt,
		discription: "Заглушки глухарей каркаса",
		unit: "screwsAdd",
		itemGroup: "Каркас",
		};
	if(item.amt > 0) partsList.addItem(item);


	
	function balustradeItemsAdd(){}; //функция для навигации
	
	calcSpecBanister(partsList)


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

	var pathFrames = "/drawings/frames/";
	var pathTreads = "/drawings/treads/";
	var fileName = "01.pdf";
	var fileNameP = "p-01.pdf";
	var fileNameRectTread = "rectTreads";
	var fileNameWndTread = "winderTreads";
	var fileNamePlatformHalf = "platformHalf"
	
	var turnSideName = "right";
	if(params.turnSide == "левое") turnSideName = "left";
	

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
	if(params.stairFrame == "есть") links += "<a href='" + pathFrames + fileName + "' target='_blank'>Рамки прямых ступеней</a><br/>";
	//рамки забежных ступеней
	if(params.stairFrame == "есть" && isWinder) links += "<a href='" + pathFrames + "winderFrames_ko_" + turnSideName + ".pdf' target='_blank'>Рамки забежных ступеней</a><br/>"
	//рамки площадки
	if(params.stairFrame == "есть" && isPlatform) links += "<a href='" + pathFrames + fileNameP + "' target='_blank'>Рамки площадки</a><br/>"
	//вертикальная рамка
	if(params.topAnglePosition == "вертикальная рамка") links += "<a href='" + pathFrames + "top_frame.pdf' target='_blank'>Вертикальная рамка крепления к верхнему перекрытию<br/></a>"
	//Прямые ступени
	links += "<a href='" + pathTreads + fileNameRectTread + "' target='_blank'>Прямые ступени</a><br/>";
	//Забежные ступени
	if(isWinder) links += "<a href='" + pathTreads + fileNameWndTread + "' target='_blank'>Забежные ступени</a><br/>";
	//половинки площадки
	if(isPlatform) links += "<a href='" + pathTreads + fileNamePlatformHalf + "' target='_blank'>Щиты площадки</a><br/>" 

	
	 $("#drawings").html(links)
	}
