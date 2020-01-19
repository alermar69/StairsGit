
function calcSpec(){
	
	//Инициализация справочника деталей
    var partsList = createPartsList();
    var item = {}
	
	//рассчитываем кол-во секций
	var amt = calcSections().amt;
	var fullLength = calcSections().fullLength;
	
	//задаем id позиций спецификации
	var marshWidth = 600;
	if(params.staircaseType == "П-1.2") marshWidth = 800;	
	var sectId_top = "topSection_" + marshWidth + "_05"; 
	var sectId_2 = "section_" + marshWidth + "_2";
	var sectId_3 = "section_" + marshWidth + "_3"; 
	var sectId_4 = "section_" + marshWidth + "_4"; 
	
//секции лестницы
	
	item = {
		id: sectId_top,
		amt: amt.sect_top,
		discription: "Верхние секции",
		unit: "Секции",
		itemGroup: "Каркас",
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: sectId_2,
		amt: amt.sect_2,
		discription: "Промежуточные секции",
		unit: "Секции",
		itemGroup: "Каркас",
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: sectId_3,
		amt: amt.sect_3,
		discription: "Промежуточные секции",
		unit: "Секции",
		itemGroup: "Каркас",
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: sectId_4,
		amt: amt.sect_4,
		discription: "Промежуточные секции",
		unit: "Секции",
		itemGroup: "Каркас",
		};
	if(item.amt > 0) partsList.addItem(item);
	
	
	//стыковка секций
	addSectConnectionItems(partsList, amt.midSectAmt);
		
	//заглушки сверху и снизу для каждой лестницы
	item = {
        id: "plasticPlug_60_30",
        amt: amt.sect_top * 4,
        discription: "Заглушки секций лестницы",
        unit: "Лестница",
        itemGroup: "Лестница"
    };
    if(item.amt > 0) partsList.addItem(item);
	
	

/* НОГИ */

	
	//создаем позицию в справочнике	
	partsList.leg = {
		name: "Ноги " + (params.wallDist + params.legsExtraLength)+ "мм",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
	if(params.legType == "Т-образные")	
		partsList.leg.name = "Крепление Т-образное " + marshWidth + "мм";
	
	//добавляем кол-во
	var legAmt = params.legAmt * 2;
	if(params.legType == "Т-образные") legAmt = params.legAmt;
	
	item = {
		id: "leg",
		amt: legAmt,
		discription: "Крепление лестницы к стене",
		unit: "Лестница",
		itemGroup: "Лестница"
		};
	if(item.amt > 0) partsList.addItem(item);
		
	addLegFurniture(partsList, legAmt);
	
	if(params.legType == "Т-образные"){
		item = {
			id: "legCover",
			amt: legAmt,
			discription: "Крышка ноги",
			unit: "Лестница",
			itemGroup: "Лестница"
			};
		if(item.amt > 0) partsList.addItem(item);
	
		}
	
		
/* ПЛОЩАДКИ */

	//создаем позиции в справочнике
	partsList.platformCarcas = {
		name: "Каркас площадки " + marshWidth + "х" + params.pltLength,
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
	
	partsList.platformCover = {
		name: "Покрытие площадки " + (marshWidth -8*2 - 5) + "х" + params.pltLength,
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
		
	if(params.pltLength != 0){		
		item = {
			id: "platformCarcas",
			amt: 1,
			discription: "Верхняя площадка",
			unit: "Площадка",
			itemGroup: "Площадка"
			};
		if(item.amt > 0) partsList.addItem(item);
		
		item = {
			id: "platformCover",
			amt: 1,
			discription: "Верхняя площадка",
			unit: "Площадка",
			itemGroup: "Площадка"
			};
		if(item.amt > 0) partsList.addItem(item);
		
		
		
		var platformAmt = 1;
		
		addPlatformItems(partsList, platformAmt, params.pltLength);
	}	

/* ОГРАЖДЕНИЕ ЛЕСТНИЦЫ */
	
	var railingLength = (params.stairCaseLength - params.railingOffset + 1200) / 1000
	if(params.staircaseType == "П-1.1") railingLength = 0;
	if(railingLength != 0) addRailingItems(partsList, railingLength)
	
	

	
	
	
	
	
	
	// вывод спецификации "Комплектовка"
    printSpecificationCollation(partsList);
    // вывод спецификации "Сборка"
    printSpecificationAssembly(partsList);
    //включаем сортировку и поиск по таблица спецификаций
    $('.tab_4').tablesorter({
        widgets: [ 'zebra', 'filter' ],
        theme: 'blue',
        usNumberFormat : false,
        sortReset      : true,
        sortRestart    : true,
    });

	//ссылки на типовые чертежи
	printLinks("drawings"); //функция в файле /manufacturing/fire/calc_spec_2.0.js
	
}//end of calcSections
