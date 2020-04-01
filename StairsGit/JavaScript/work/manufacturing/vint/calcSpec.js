/**функция создает справочник деталей
*/

function createPartsList(){
	
    var list = {
		addItem: addItem, //функция в файле /manufacturing/general/calc_spec/calcSpec.js
		addSpecObjItems: addSpecObjItems, //функция в файле /manufacturing/general/calc_spec/calcSpec.js
		};
	
	//общие позиции для всех лестницы
	addGeneralItems(list); //функция в файле /calculator/general/calcSpec.js

		
	//болт кронштейна
    list.middleHolderBolt = {
        name:  "Болт М10х70 шестигр. гол.",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
    };
	
		
	
	    //зип-болты
    list.zipBolt = {
        name:  "Зип-болт прямой",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
    };
   

    //поручень
    list.timberHandrailRadius = {
        name:  "Поручень ДУБ радиусный",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: true,
        division: "timber",
        items: []
    };

    //заглушки отверстий под зип-болт
    list.timberPlug = {
        name:  "Заглушка дуб круглая",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: true,
        division: "stock1",
        items: []
    };
	
	list.fixSpacer1 = {
		name: "Проставка " + params.fixSpacer1 + " L=" + params.fixSpacerLength1 + "мм",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "metal",
		items: [],
		};
		
	list.fixSpacer2 = {
		name: "Проставка " + params.fixSpacer2 + " L=" + params.fixSpacerLength2 + "мм",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "metal",
		items: [],
		};
	
 	list.fixSpacer3 = {
		name: "Проставка " + params.fixSpacer3 + " L=" + (params.fixSpacerLength3 + params.wallDist) + "мм",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "metal",
		items: [],
		};
		
	list.fixSpacer4 = {
		name: "Проставка " + params.fixSpacer4 + " L=" + (params.fixSpacerLength4 + params.wallDist) + "мм",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "metal",
		items: [],
		};
		
	list.fixSpacer5 = {
		name: "Проставка " + params.fixSpacer5 + " L=" + (params.fixSpacerLength5 + params.wallDist) + "мм",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "metal",
		items: [],
		};
		
	list.fixSpacer6 = {
		name: "Проставка " + params.fixSpacer6 + " L=" + (params.fixSpacerLength6 + params.wallDist) + "мм",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "metal",
		items: [],
		};
	
    return list;
}


function calculateSpec() {

	/* Инициализация справочника деталей*/
    var partsList = createPartsList();
    var item = {}
	
/***   ДАННЫЕ, СНЯТЫЕ С МОДЕЛИ   ***/

	for(var partName in partsAmt){
		var itemsPar = {
			specObj: partsAmt,
			partName: partName,
			metalPaint: partsAmt[partName]["metalPaint"],
			timberPaint: partsAmt[partName]["timberPaint"],
			division: partsAmt[partName]["division"],
			itemGroup: partsAmt[partName]["group"],
			}

		if(!partsAmt[partName].notAddToSpec) partsList.addSpecObjItems(itemsPar);
	}

	
//метизы
if(params.treadsMaterial != "рифленая сталь" && params.treadsMaterial != "лотки под плитку"){
	// //крепление площадки к металлической раме
	// if(params.platformType == "square") {
	// 	item = {
	// 		id: "treadScrew",
	// 		amt: 8,
	// 		discription: "Крепление площадки",
	// 		unit: "Каркас",
	// 		itemGroup: "Каркас"
	// 	};
	// 	if(item.amt > 0) partsList.addItem(item);
	// }
	
	// //крепление секции ограждения площадки
	// if(params.platformSectionLength > 0){
	// 	item = {
	// 		id: "treadScrew",
	// 		amt: 8,
	// 		discription: "Крепление ограждения площадки",
	// 		unit: "Ограждения",
	// 		itemGroup: "Ограждения"
	// 	};
	// 	if(item.amt > 0) partsList.addItem(item);
	// }
	
}


//кронштейн промежуточного крепления


//болт кронштейна


    // item = {
    //     id: "middleHolderBolt",
    //     amt: getPartAmt("midFix"),
    //     discription: "Болт кронштейна",
		// unit: "Центральный столб",
    //     itemGroup: "Каркас"
    // };
    // if(item.amt > 0) partsList.addItem(item);

//гайка кронштейна

    // item = {
    //     id: "nut_M10",
    //    amt: getPartAmt("midFix"),
    //     discription: "Гайка кронштейна",
		// unit: "Центральный столб",
    //     itemGroup: "Каркас"
    // };
    // if(item.amt > 0) partsList.addItem(item);

//шайба кронштейна
    // item = {
    //     id: "shim_M10",
    //    amt: getPartAmt("midFix") * 2,
    //     discription: "Шайба кронштейна",
		// unit: "Центральный столб",
    //     itemGroup: "Каркас"
    // };
    // if(item.amt > 0) partsList.addItem(item);
	
	//пластиковая заглушка
	// item = {
  //       id: "plasticPlug_40_40",
  //      amt: getPartAmt("midFix") * 2,
  //       discription: "Заглушка кронштейна",
	// 	unit: "Центральный столб",
  //       itemGroup: "Каркас"
  //   };
  //   if(item.amt > 0) partsList.addItem(item);

	
	
//крепления к перекрытиям

function floorsMountingItemsAdd(){}; //пустая функция для навигации	
	
	//крепление к нижнему перекрытию
	// var fixParams = {
	// 	partsList: partsList,
	// 	fixPart: params.fixPart1,
	// 	fixSurfaceType: params.fixType1,
	// 	discription: "Крепление к нижнему перекрытию",
	// 	unit: "Низ лестницы",
	// 	itemGroup: "Крепление к обстановке",
	// 	amt: 6,
	// 	extraStudLength: params.fixSpacerLength1,
	// 	studDiam: 10,
	// 	}
	// if(params.isAssembling == "есть") addFixParts(fixParams);
	
	//проставка
	//if(params.fixPart1 != "не указано" && params.fixPart1 != "нет" && 
	//	params.fixSpacer1 != "не указано" && params.fixSpacer1 != "нет"){
	//		item = {
	//			id: "fixSpacer1",
	//			amt: 2,
	//			discription: "Крепление к нижнему перекрытию",
	//			unit: "bottomMountingItemsAdd",
	//			itemGroup: "Крепление к перекрытиям",
	//			};
	//		if(item.amt > 0) partsList.addItem(item);					
	//		}
			
	
	//крепление к верхнему перекрытию
	// var fixParams = {
	// 	partsList: partsList,
	// 	fixPart: params.fixPart2,
	// 	discription: "Крепление к верхнему перекрытию",
	// 	unit: "Верх лестницы",
	// 	itemGroup: "Крепление к обстановке",
	// 	amt: 4,
	// 	extraStudLength: params.fixSpacerLength2,
	// 	studDiam: 10,
	// 	}
	
	// if(params.isAssembling == "есть") addFixParts(fixParams);
	
	//проставка
	//if(params.fixPart2 != "не указано" && params.fixPart2 != "нет" && 
	//	params.fixSpacer2 != "не указано" && params.fixSpacer2 != "нет" && params.fixSpacer2 != "комментарий"){
	//		item = {
	//			id: "fixSpacer2",
	//			amt: 2,
	//			discription: "Крепление к верхнему перекрытию",
	//			unit: "topMountingItemsAdd",
	//			itemGroup: "Крепление к перекрытиям",
	//			};
	//		if(item.amt > 0) partsList.addItem(item);					
	//		}
	
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

	
function railingItemsAdd_nav(){};


/*** ОГРАЖДЕНИЕ ЛЕСТНИЦЫ ***/

//функция в файле /manufacturing/general/calc_spec/calcSpec.js
//var railingSpecPar = {
//	unit: "staircase",
//	}
//railingSpecPar = railingItemsAdd(railingSpecPar);


//for(var i=0; i<railingSpecPar.items.length; i++){
//	partsList.addItem(railingSpecPar.items[i]);
//	}


/*верхний узел балясин*/

	////кронштейны поручня
	//var totalBalAmt = getPartAmt("bal");

 //   item = {
 //       id: "bracket",
 //       amt: totalBalAmt,
 //       discription: "Крепление поручня",
 //       unit: "Крепление поручня к балясине",
 //       itemGroup: "Ограждения"
 //   };
 //   if(item.amt > 0) partsList.addItem(item);
	

	////болты
	
	//var boltAmt = getPartAmt("bal")// + getPartAmt("balAngle");

 //   item = {
 //       id: "boltHex_M6x30",
 //       amt: boltAmt,
 //       discription: "Крепление кронштейнов к балясинам",
 //       unit: "Крепление поручня к балясине",
 //       itemGroup: "Ограждения"
 //   };
 //   if(item.amt > 0) partsList.addItem(item);

	////шайбы

 //   item = {
 //       id: "shim_M6",
 //       amt: boltAmt,
 //       discription: "Крепление кронштейнов к балясинам",
 //      unit: "Крепление поручня к балясине",
 //       itemGroup: "Ограждения"
 //   };
 //   if(item.amt > 0) partsList.addItem(item);

	////гайки


 //   item = {
 //       id: "nut_M6",
 //       amt: boltAmt,
 //       discription: "Крепление кронштейнов к балясинам",
 //      unit: "Крепление поручня к балясине",
 //       itemGroup: "Ограждения"
 //   };
 //   if(item.amt > 0) partsList.addItem(item);

	////шурупы крепления поручня
	//if ((params.handrailMaterial == "ПВХ") || (params.handrailMaterial == "Дуб")){
 //       item = {
 //           id: "timberHandrailScrew",
 //           amt: totalBalAmt * 2,
 //           discription: "Крепление поручня к балясинам",
 //          unit: "Крепление поручня к балясине",
 //           itemGroup: "Ограждения"
 //       };
 //       if(item.amt > 0) partsList.addItem(item);
 //   }


/*поручень на лестнице*/

	handrailSectionAmt = getPartAmt("pvcHandrail") + getPartAmt("spiralHandrail");

	if (params.handrailMaterial == "ПВХ") {

      //   item = {
      //       id: "handrailRing",
      //       amt: handrailSectionAmt - 1,
      //       discription: "Соединение поручня на лестнице",
			// unit: "Поручень лестницы",
      //       itemGroup: "Поручни"
      //   };
      //   if(item.amt > 0) partsList.addItem(item);

      //   item = {
      //       id: "stainlessPlug_pvc",
      //       amt: 2,
      //       discription: "Концы поручня на лестнице",
      //       unit: "Поручень лестницы",
      //       itemGroup: "Поручни"
      //   };
      //   if(item.amt > 0) partsList.addItem(item);
		
		}

	if (params.handrailMaterial == "Дуб") {

		//зип-болты
        item = {
            id: "zipBolt",
            amt: handrailSectionAmt - 1,
            discription: "Соединение поручня на лестнице",
            unit: "Поручень лестницы",
            itemGroup: "Поручни"
        };
        if(item.amt > 0) partsList.addItem(item);

		//заглушки на торцы

        item = {
            id: "timberPlug",
            amt: handrailSectionAmt - 1,
            discription: "Заглушка отверстий под зип-болт в поручне",
            unit: "Поручень лестницы",
            itemGroup: "Поручни"
        };
        if(item.amt > 0) partsList.addItem(item);
		
	}


	//Балюстрада (секция ограждения верхней площадки считается как балюстрада)
	calcSpecBanister(partsList);

	function addWorks(){}

	crateWorksList();
	calcWorks(partsAmt, "staircase");
	calcWorks(partsAmt_bal, "banister");
	printWorks2();

	//ступени, детали каркаса
	//addTimberWorksCarcas("vintTread")
	//addTimberWorksCarcas("vintPlatform")


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

/*** ИНФОРМАЦИЯ ДЛЯ ПРОИЗВОДСТВА ***/
 


	var stapelStepHeight = stairParams.stepHeight * 12.857/params.stepAngle; //12.857 - угол между стойками стапеля, град.
	stapelStepHeight = Math.round(stapelStepHeight)
	var handrailHorSize = 40;
	if (params.handrailMaterial == "ПВХ") handrailHorSize = 50;
	var balSize = 20;
	var stapelMaxDiam = 2000;
	var stapelOffset = (stapelMaxDiam - params.staircaseDiam)/2 - balSize/2 + handrailHorSize/2 + 20;
	//высоты установки упоров стапеля
	var table = "<table class='tab_2'><tbody><tr><th>Номер стойки</th><th>Высота упора H1, мм</th></tr>"
	for (var i=0; i<15; i++){
		table += "<tr><td>" + (i+1) + "</td><td>" + (80 + stapelStepHeight*i) + "</td></tr>"
		}
	table += "</tbody></table>"
	
	var handrailTurn = "правый";
	if(params.turnFactor == 1) handrailTurn = "левый";
/*	
	var text = 
	"<h3>Информация для производства</h3>" + 
	"Длина поручня лестницы без запаса: " + Math.round(getPartPropVal("pvcHandrail", "sumLength") + getPartPropVal("spiralHandrail", "sumLength")) + " мм <br/>" + 	
	"Длина поручня площадки: " + Math.round(stairParams.handrailPlatformLength + 40) + " мм <br/>" +
	"Длина секции ограждения площадки (по осям столбов): " + Math.round(stairParams.sectionLength - 40) + " мм <br/>" +
	"Шаг эл-тов заполнения секции: " + Math.round(stairParams.sectionHoleWidth) + " мм <br/>" +
	"Кол-во эл-тов заполнения секции: " + Math.round(stairParams.sectionBalAmt) + " шт <br/>" +
	"Разность высот столбов (снизу): 4 мм <br/>" +
*/
	var text = 
	"<h3>Настройка стапеля для изготовления поручня</h3>" + 
	"<a href='/drawings/vint/stapel_settings.pdf' target='_blank'>Схема настройки стапеля</a></br>" + 	
	"Отступ для установки стоек стапеля: A = " + Math.round(stapelOffset) + " мм <br/>" +
	"Подъем на одну стойку стапеля: " + Math.round(stapelStepHeight) + " мм <br/>" +
	"Тип изгиба поручня: <b>" + handrailTurn + "</b> (см. схему настройки стапеля)<br/>" +	
	table; 
	$("#manInfo").html(text);
	
	text = 
	"<h3>Типовые чертежи деталей:</h3>" + 
	"<a href='/drawings/vint/stud_v1.1.pdf' target='_blank'>Центральный стержень v1.1 PDF</a></br>" + 	
	"<a href='/drawings/vint/vintParts_v1.4.pdf' target='_blank'>Детали для цеха v1.4 PDF </a></br>" + 
	"<a href='/drawings/vint/vintParts_4mm_v1.3.dxf' target='_blank'>Детали на чпу 4мм v1.3 DXF</a></br>" + 
	"<a href='/drawings/vint/vintParts_8mm_v1.3.dxf' target='_blank'>Детали на чпу 8мм v1.3 DXF</a></br>";
	
	if(params.pltHandrailConnection == "есть") text += "<a href='/drawings/vint/pltHandrailConnection.pdf' target='_blank'>Замыкание поручня на площадке</a></br>"
	

	$("#drawings").html(text);
	
	
/*** ИНФОРМАЦИЯ ДЛЯ МОНТАЖА ***/



	var text = "<h2>Информация для монтажа</h2>";
	text += "<h4>Параметры обстановки</h4>" +
	"<table class='tab_2'><tbody><tr><th>Параметр</th><th>Значение</th></tr>" + 
	"<tr><td>Высота от чистого пола снизу до чистого пола сверху</td><td>" + params.staircaseHeight + "</td></tr>" + 
	"<tr><td>Толщина перекрытия</td><td>" + params.floorThickness + "</td></tr>" + 
	"<tr><td>Проем</td><td>" + params.floorHoleWidth + " x " + params.floorHoleLength + "</td></tr>" + 
	"<tr><td>На какой пол ставим</td><td>" + params.botFloorType + "</td></tr>" + 
	"</tbody></table>";
	
	text += "<h4>Регулировка лестницы по высоте</h4>" +
	"<table class='tab_2'><tbody><tr><th>Кол-во шайб</th><th>Высота</th></tr>";
	for(var i=0; i<params.stepAmt; i++){
		var height = params.stepAmt * stairParams.stepHeight + 4 * i;
		text += "<tr><td>" + i + "</td><td>" + height + "</td></tr>";
		}
	text +="</tbody></table>";
	
	$("#assemblingInfo").html(text);
	
	printPartsAmt();
	
} // end of calcSpecVint()