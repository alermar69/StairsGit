function createPartsList(){
	/*функция создает справочник деталей*/
    var list = {};

    //функция добавления применения элемента
    list.addItem = function(itemParams){
        var item = {
            amt: itemParams.amt, //кол-во в данном применении
            discription: itemParams.discription, //описание применения
            unit: itemParams.unit, //узел лестницы
            group: itemParams.itemGroup, //группа деталей лестницы
        };
        //добавляем информацию о размерах, если она есть
        if(itemParams.size) item.size = itemParams.size;

        if(this[itemParams.id]) this[itemParams.id].items.push(item);
		else console.log("Не удалось добавить в спецификацию элемент id = " + itemParams.id);
    };
	
//общие позиции для всех лестницы
addGeneralItems(list); //функция в файле /calculator/general/calcSpec.js

   //секции 600
	
	//верхняя секция 600-0,5 м
	list.topSection_600_05 = {
		name: "Верхняя секция 600мм L=0.5 м.п.",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}

	//секция 2м
	list.section_600_2 = {
		name: "Секция 600мм L=2м.п.",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
		
	//секция 3м
	list.section_600_3 = {
		name: "Секция 600мм L=3м.п.",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}

	//секция 4м
	list.section_600_4 = {
		name: "Секция 600мм L=4м.п.",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}	

	//секции 800
	
		//верхняя секция 800-0,5м
	list.topSection_800_05 = {
		name: "Верхняя секция 800мм L=0,5 м.п.",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}

	//секция 2м
	list.section_800_2 = {
		name: "Секция 800мм L=2м.п.",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
		
	//секция 3м
	list.section_800_3 = {
		name: "Секция 800мм L=3м.п.",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}

	//секция 4м
	list.section_800_4 = {
		name: "Секция 800мм L=4м.п.",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
	//Ограждения
	list.railing = {
		name: "Ограждения секции 800мм",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}

	//нога 500мм
	list.leg500 = {
		name: "Нога 500мм",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
		
	//нога 600мм
	list.leg750 = {
		name: "Нога 750мм",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
	
	//крепление Т-образное 600мм
	list.legT_600 = {
		name: "Крепление Т-образное 600мм",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
	
	//крепление Т-образное 800мм
	list.legT_800 = {
		name: "Крепление Т-образное 800мм",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
		
	//крышка Т-образной ноги
	list.legCover = {
		name: "Крышка Т-образной ноги",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
	
		
	
	//площадка 600
	
	list.platformFrame_600 = {
		name: "Каркас площадки 600х1000мм",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
		
	list.platformCover_600 = {
		name: "Лист площадки 600х1000мм",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
		
	
		
	
	//площадка с ограждением 800
	list.platformFrame_800 = {
		name: "Каркас площадки 800х1000мм",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
		
	list.platformCover_800 = {
		name: "Лист площадки 800х1000мм",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
		
	list.platformHandrail = {
		name: "Поручень площадки 40х20 L=1130мм",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
		
	list.platformRigel = {
		name: "Ригель площадки 20х20 L=1130мм",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}

	//кронштейн крепления лестницы к ногам
	list.legHolder = {
		name: "Кронштейн крепления ног к секциям",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "stock_2",
        items: []
		}
		
	
	list.fenceRail_4 = {
		name: "Профиль 20х20 L=4000мм",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
	
	list.fenceArc = {
		name: "Обечайка ограждения лестницы",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
		
	list.fenceBrace = {
		name: "Раскос ограждения лестницы -40х4 L=1040мм",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
		
    //шпильки крепления к стене
    list.stud_M16 = {
        name:  "Шпилька М16 L=1000 мм",
        amtName: "шт.",
        metalPaint: false,
        timberPaint: false,
        division: "stock_1",
        items: []
    };

	//саморезы
   
	

    return list;
}


function calcSpecFire() {
	
	// Инициализация справочника деталей
    var partsList = createPartsList();
    var item = {}


/*  СЕКЦИИ  */


    item = {
        id: "topSection_600_05",
        amt: params.topSectionAmt_600_05,
        discription: "Секция лестницы",
        unit: "Лестница",
        itemGroup: "Лестница"
    };
    if(item.amt > 0) partsList.addItem(item);


	item = {
        id: "section_600_2",
        amt: params.sectionAmt_600_2,
        discription: "Секция лестницы",
        unit: "Лестница",
        itemGroup: "Лестница"
    };
    if(item.amt > 0) partsList.addItem(item);
	
	item = {
        id: "section_600_3",
        amt: params.sectionAmt_600_3,
        discription: "Секция лестницы",
        unit: "Лестница",
        itemGroup: "Лестница"
    };
    if(item.amt > 0) partsList.addItem(item);
	
	item = {
        id: "section_600_4",
        amt: params.sectionAmt_600_4,
        discription: "Секция лестницы",
        unit: "Лестница",
        itemGroup: "Лестница"
    };
    if(item.amt > 0) partsList.addItem(item);
	
	item = {
        id: "topSection_800_05",
        amt: params.topSectionAmt_800_05,
        discription: "Секция лестницы",
        unit: "Лестница",
        itemGroup: "Лестница"
    };
    if(item.amt > 0) partsList.addItem(item);
	
	item = {
        id: "section_800_2",
        amt: params.sectionAmt_800_2,
        discription: "Секция лестницы",
        unit: "Лестница",
        itemGroup: "Лестница"
    };
    if(item.amt > 0) partsList.addItem(item);
	
	item = {
        id: "section_800_3",
        amt: params.sectionAmt_800_3,
        discription: "Секция лестницы",
        unit: "Лестница",
        itemGroup: "Лестница"
    };
    if(item.amt > 0) partsList.addItem(item);
	
	item = {
        id: "section_800_4",
        amt: params.sectionAmt_800_4,
        discription: "Секция лестницы",
        unit: "Лестница",
        itemGroup: "Лестница"
    };
    if(item.amt > 0) partsList.addItem(item);
	
//стыковка секций
	var connectionAmt = 0;
	if(params.sectionAmt_600_2) connectionAmt += params.sectionAmt_600_2;
	if(params.sectionAmt_600_3) connectionAmt += params.sectionAmt_600_3;
	if(params.sectionAmt_600_4) connectionAmt += params.sectionAmt_600_4;
	if(params.sectionAmt_800_2) connectionAmt += params.sectionAmt_800_2;
	if(params.sectionAmt_800_3) connectionAmt += params.sectionAmt_800_3;
	if(params.sectionAmt_800_4) connectionAmt += params.sectionAmt_800_4;

	addSectConnectionItems(partsList, connectionAmt);
		
	//заглушки сверху и снизу для каждой лестницы
	
	var plugAmt = (topSectionAmt_600_05 + topSectionAmt_800_05) * 2;
	item = {
        id: "plasticPlug_60_30",
        amt: plugAmt,
        discription: "Заглушки секций лестницы",
        unit: "Лестница",
        itemGroup: "Лестница"
    };
    if(item.amt > 0) partsList.addItem(item);
	
	

/* НОГИ */

	
	item = {
		id: "leg500",
		amt: params.leg500Amt * 2,
		discription: "Крепление лестницы к стене",
		unit: "Лестница",
		itemGroup: "Лестница"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: "leg750",
		amt: params.leg750Amt * 2,
		discription: "Крепление лестницы к стене",
		unit: "Лестница",
		itemGroup: "Лестница"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: "legT_600",
		amt: params.legTAmt_600,
		discription: "Крепление лестницы к колоннам",
		unit: "Лестница",
		itemGroup: "Лестница"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: "legT_800",
		amt: params.legTAmt_800,
		discription: "Крепление лестницы к колоннам",
		unit: "Лестница",
		itemGroup: "Лестница"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	var legAmt = 0;
	if(params.leg500Amt) legAmt += params.leg500Amt;
	if(params.leg750Amt) legAmt += params.leg750Amt;
	if(params.legTAmt_600) legAmt += params.legTAmt_600;
	if(params.legTAmt_800) legAmt += params.legTAmt_800;
	
	addLegFurniture(partsList, legAmt);
	
	if(params.legTAmt_600 != 0 || params.legTAmt_800 != 0) {
		item = {
			id: "legCover",
			amt: (params.legTAmt_600 + params.legTAmt_800),
			discription: "Крышка ноги",
			unit: "Лестница",
			itemGroup: "Лестница"
			};
		if(item.amt > 0) partsList.addItem(item);
	
		}
	
		
/* ПЛОЩАДКИ */
	
	
	item = {
		id: "platformFrame_600",
		amt: params.pltAmt_600,
		discription: "Верхняя площадка",
		unit: "Площадка",
		itemGroup: "Площадка"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: "platformCover_600",
		amt: params.pltAmt_600,
		discription: "Верхняя площадка",
		unit: "Площадка",
		itemGroup: "Площадка"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: "platformFrame_800",
		amt: params.pltAmt_800,
		discription: "Верхняя площадка",
		unit: "Площадка",
		itemGroup: "Площадка"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: "platformCover_800",
		amt: params.pltAmt_800,
		discription: "Верхняя площадка",
		unit: "Площадка",
		itemGroup: "Площадка"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	var platformAmt = 0;
	if(pltAmt_600) platformAmt += params.pltAmt_600;
	if(pltAmt_800) platformAmt += params.pltAmt_800;
	
	addPlatformItems(partsList, platformAmt);
	

/* ОГРАЖДЕНИЕ ЛЕСТНИЦЫ */
	
	if(params.railingLength != 0) addRailingItems(partsList, params.railingLength)
	
	

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

/*** ИНФОРМАЦИЯ ДЛЯ ПРОИЗВОДСТВА ***/
 
printLinks("drawings");
	


} // end of calcSpecFire()


function printLinks(outputDivId){

	var outputDiv = document.getElementById(outputDivId);
	outputDiv.innerHTML = "<h3>Чертежи деталей</h3>" + 
	"<a href='/drawings/fire/pasport_v1.1.pdf' target='_blank'>Паспорт лестницы PDF</a></br>" + 
	"<a href='/drawings/fire/parts_v1.4.pdf' target='_blank'>Детали для цеха PDF</a></br>" + 
	"<a href='/drawings/fire/cnc_2mm_v1.4.dxf' target='_blank'>Детали на плазму 2мм DXF</a></br>" + 
	"<a href='/drawings/fire/cnc_4mm_v1.4.dxf' target='_blank'>Детали на плазму 4мм DXF</a></br>" + 
	"<a href='/drawings/fire/cnc_4mm_rifl_v1.4.dxf' target='_blank'>Детали на плазму 4мм рифленка DXF</a></br>" + 
	"<a href='/drawings/fire/cnc_8mm_v1.4.dxf' target='_blank'>Детали на плазму 8мм DXF</a></br>" + 
	"<a href='/drawings/fire/legHolder.dwg' target='_blank'>Кронштейн ноги 8мм DWG</a></br>";
	

}//end of printLinks


function addSectConnectionItems(partsList, connectionAmt){
	if(connectionAmt != 0){	

		item = {
			id: "bolt_M10x70",
			amt: connectionAmt * 4,
			discription: "Стыковка секций лестницы",
			unit: "Лестница",
			itemGroup: "Лестница"
			};
		if(item.amt > 0) partsList.addItem(item);
		
		item = {
			id: "shim_M10",
			amt: connectionAmt * 8,
			discription: "Стыковка секций лестницы",
			unit: "Лестница",
			itemGroup: "Лестница"
			};
		if(item.amt > 0) partsList.addItem(item);
		
		item = {
			id: "nut_M10",
			amt: connectionAmt * 4,
			discription: "Стыковка секций лестницы",
			unit: "Лестница",
			itemGroup: "Лестница"
			};
		if(item.amt > 0) partsList.addItem(item);

		}//end of connectionAmt != 0

} //end of addSectConnectionItems

function addLegFurniture(partsList, legAmt){
	
	item = {
		id: "legHolder",
		amt: legAmt * 2,
		discription: "Крепление секций к ногам",
		unit: "Лестница",
		itemGroup: "Лестница"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: "bolt_M10x60",
		amt: legAmt * 4,
		discription: "Крепление хомутов ног",
		unit: "Лестница",
		itemGroup: "Лестница"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: "shim_M10",
		amt: legAmt * 8,
		discription: "Крепление хомутов ног",
		unit: "Лестница",
		itemGroup: "Лестница"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: "nut_M10",
		amt: legAmt * 4,
		discription: "Крепление хомутов ног",
		unit: "Лестница",
		itemGroup: "Лестница"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: "plasticPlug_60_30",
		amt: legAmt * 2,
		discription: "Заглушки ног",
		unit: "Лестница",
		itemGroup: "Лестница"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: "roofingScrew_5x19",
		amt: legAmt * 2,
		discription: "Фиксация секций к ногам",
		unit: "Лестница",
		itemGroup: "Лестница"
		};
	if(item.amt > 0) partsList.addItem(item);	
		
} //end of addLegFurniture


function addPlatformItems(partsList, platformAmt, pltLen){
	
	if(!pltLen) pltLen = 1000;
	partsList.platformHandrail.name = "Поручень площадки 40х20 L=" + (pltLen + 60*2 + 10) + "мм",
	partsList.platformRigel.name = "Ригель площадки 20х20 L=" + (pltLen + 60*2 + 10) + "мм",
	
	//крепление площадки к секции
	item = {
		id: "bolt_M10x60",
		amt: platformAmt * 8,
		discription: "крепление площадки к секции",
		unit: "Площадка",
		itemGroup: "Площадка"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: "shim_M10",
		amt: platformAmt * 16,
		discription: "крепление площадки к секции",
		unit: "Площадка",
		itemGroup: "Площадка"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: "nut_M10",
		amt: platformAmt * 8,
		discription: "крепление площадки к секции",
		unit: "Площадка",
		itemGroup: "Площадка"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	
	//уголки
	item = {
		id:  "angle200",
		amt: platformAmt * 4,
		discription: "Уголок крепления покрытия площадки",
		unit: "Площадка",
		itemGroup: "Площадка",
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: "bolt_M10x30",
		amt: platformAmt * 8,
		discription: "крепление уголков площадки",
		unit: "Площадка",
		itemGroup: "Площадка"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: "shim_M10",
		amt: platformAmt * 16,
		discription: "крепление уголков площадки",
		unit: "Площадка",
		itemGroup: "Площадка"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: "nut_M10",
		amt: platformAmt * 8,
		discription: "крепление уголков площадки",
		unit: "Площадка",
		itemGroup: "Площадка"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: "bolt_M6x20",
		amt: platformAmt * 8,
		discription: "крепление листа площадки",
		unit: "Площадка",
		itemGroup: "Площадка"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: "shim_M6",
		amt: platformAmt * 16,
		discription: "крепление листа площадки",
		unit: "Площадка",
		itemGroup: "Площадка"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: "nut_M6",
		amt: platformAmt * 8,
		discription: "крепление листа площадки",
		unit: "Площадка",
		itemGroup: "Площадка"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	//ограждение площадки
	item = {
		id: "platformHandrail",
		amt: platformAmt * 2,
		discription: "Поручень площадки",
		unit: "Ограждение площадки",
		itemGroup: "Площадка"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: "platformRigel",
		amt: platformAmt * 4,
		discription: "Поручень площадки",
		unit: "Ограждение площадки",
		itemGroup: "Площадка"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: "plasticPlug_20_20",
		amt: platformAmt * 8,
		discription: "Заглушки ригелей площадки",
		unit: "Ограждение площадки",
		itemGroup: "Площадка"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: "plasticPlug_40_20",
		amt: platformAmt * 4,
		discription: "Заглушки поручня площадки",
		unit: "Ограждение площадки",
		itemGroup: "Площадка"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: "roofingScrew_5x19",
		amt: platformAmt * 4,
		discription: "Крепление поручня площадки",
		unit: "Ограждение площадки",
		itemGroup: "Площадка"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: "roofingScrew_5x32",
		amt: platformAmt * 8,
		discription: "Крепление ригелей площадки",
		unit: "Ограждение площадки",
		itemGroup: "Площадка"
		};
	if(item.amt > 0) partsList.addItem(item);	
	
	//раскосы ограждения (если есть)
	if(params.staircaseType != "П-1.1"){
		item = {
			id: "fenceBrace",
			amt: platformAmt * 2,
			discription: "Верхний раскос ограждения лестницы",
			unit: "Ограждение лестницы",
			itemGroup: "Ограждение лестницы"
			};
		if(item.amt > 0) partsList.addItem(item);
		}
	
}//end of addPlatformItems


function addRailingItems(partsList, railingLength){
		
	var railsAmt = Math.ceil(railingLength / 4) * 4, //4 прутка, длина прутка 4м
	item = {
		id: "fenceRail_4",
		amt: railsAmt,
		discription: "Вертикальные прогоны ограждения лестницы",
		unit: "Ограждение лестницы",
		itemGroup: "Ограждение лестницы"
		};
	if(item.amt > 0) partsList.addItem(item);
	

	item = {
		id: "roofingScrew_5x32",
		amt: railsAmt * 2,
		discription: "Стыковка прогонов ограждения лестницы между собой",
		unit: "Ограждение лестницы",
		itemGroup: "Ограждение лестницы"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: "plasticPlug_20_20",
		amt: railsAmt * 2,
		discription: "Заглушки прогонов ограждения лестницы",
		unit: "Ограждение лестницы",
		itemGroup: "Ограждение лестницы",
		};
	if(item.amt > 0) partsList.addItem(item);
	
	
	var fenceArcAmt = Math.ceil(railingLength / 0.45);		
	
	item = {
		id: "fenceArc",
		amt: fenceArcAmt,
		discription: "Обечайки ограждения лестницы",
		unit: "Ограждение лестницы",
		itemGroup: "Ограждение лестницы"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	item = {
		id: "roofingScrew_5x19",
		amt: fenceArcAmt * 6,
		discription: "Крепление ограждений лестницы",
		unit: "Ограждение лестницы",
		itemGroup: "Ограждение лестницы"
		};
	if(item.amt > 0) partsList.addItem(item);


} //end of addRailingItems
	
	

