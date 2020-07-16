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

        this[itemParams.id].items.push(item);
    };

	
	//общие позиции для всех лестницы
	addGeneralItems(list); //функция в файле /calculator/general/calcSpec.js
	
//каркас

	
	//Модуль 190
	list.module_190 = {
		name: "Модуль средний 190х225",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
	//Модуль 225
	list.module_225 = {
		name: "Модуль средний 225х225",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
	
	//Комплект модулей верх/низ (2шт 190
	list.endModule_190 = {
		name: "Комплект модулей верх/низ 190х225 (2 шт)",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
	//Комплект модулей верх/низ (2шт 225
	list.endModule_225 = {
		name: "Комплект модулей верх/низ 225х225 (2 шт)",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
	//Удлиненный модуль 190
	list.longModule_190 = {
		name: "Удлиненный модуль 190х225",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
	//Удлиненный модуль 225
	list.longModule_225 = {
		name: "Удлиненный модуль 225х225",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
	//Модуль площадки 190
	list.platformModule_190 = {
		name: "Модуль площадки 190х225",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
	//Модуль площадки 225
	list.platformModule_225 = {
		name: "Модуль площадки 225х225",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
	
	
	//Фланец угловой ступени
	list.winderFlan = {
		name: "Фланец угловой ступени",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}

		
//ступени
	//прямые ступени
	list.rectTread = {
		name: "Ступень прямая 900х295",
		amtName: "шт",
		metalPaint: false,
        timberPaint: true,
        division: "timber",
        items: []
		}
	//забежные ступени
	list.wndTread = {
		name: "Ступень забежная",
		amtName: "шт",
		metalPaint: false,
        timberPaint: true,
        division: "timber",
        items: []
		}
	//щиты площадки
	list.platform = {
		name: "Площадка 900х900",
		amtName: "шт",
		metalPaint: false,
        timberPaint: true,
        division: "timber",
        items: []
		}


//ограждения

	//больцы
	list.bolz = {
		name: "Больц",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
	//балясины
	list.banister = {
		name: "Стойка огарждения Ф25 L=1030мм",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
	//поручень
	list.handrail = {
		name: "Поручень",
		amtName: "шт",
		metalPaint: false,
        timberPaint: true,
        division: "timber",
        items: []
		}
		
//Колонны

	list.columns = {
		name: "Стойка опорная",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
		
	//Консоли
	list.consoles = {
		name: "Консоль опорная",
		amtName: "шт",
		metalPaint: true,
        timberPaint: false,
        division: "metal",
        items: []
		}
		
    return list;
}



function calcSpecModule() {

/*
	// глобальные переменные с вариантами покраски
	window.metalPaint = params.metalPaint;
	window.metalPaint_perila = params.metalPaint;
	window.timberPaint = params.timberPaint;
	window.timberPaint_perila = params.timberPaint;

	// содержание блока faq (глобальная переменная)
	window.faqContent = "<h3><br>Обратите внимание!</h3>Расчёт спецификации на ограждения балюстрады находится в разработке.<br>В спецификации не заложено крепление лестницы к перекрытиям и стенам.";

	// считывание данных из формы
	getAllInputsValues(params);

	// удаление элементов массива specification
	for (i = 1; i < specification.length; i++) {
		for (j = 0; j < specification[i].length; j++) delete specification[i][j];
		}


// удаление предыдущих заполнений таблиц и их вывода
window.metal_specification = "<tr><td><b>Наименование</b></td><td><b>Кол-во</b></td><td><b>Назначение</b></td><td><b>Покраска</b></td><td><b>Артикул</b></td></tr>";
document.getElementById('metal_list').innerHTML = "";

window.timber_specification = "<tr><td><b>Наименование</b></td><td><b>Кол-во</b></td><td><b>Назначение</b></td><td><b>Покраска</b></td><td><b>Артикул</b></td></tr>";
document.getElementById('timber_list').innerHTML = "";

window.store_specification = "<tr><td><b>Наименование</b></td><td><b>Кол-во</b></td><td><b>Назначение</b></td><td><b>Покраска</b></td><td><b>Артикул</b></td></tr>";
document.getElementById('store_list').innerHTML = "";

document.getElementById('faq').innerHTML = "";
*/

	/* Инициализация справочника деталей*/
    var partsList = createPartsList();
    var item = {}

	//начальный и конечный модули
	var itemId= "endModule_" + params.moduleSize;
		item = {
			id: itemId,
			amt: 1,
			discription: "Первый и последний модули лестницы", 
			unit: "Каркас",
			itemGroup: "Каркас"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	
//перебираем все марши в цикле	
for(var marshNumber = 1; marshNumber <= 3; marshNumber++){
	var marshName = "нижний";
	if(marshNumber == 2) marshName = "средний";
	if(marshNumber == 3) marshName = "верхний";

	//средние модули
	var itemId= "module_" + params.moduleSize;
		item = {
			id: itemId,
			amt: spec.module[marshNumber],
			discription: "Средние модули " + marshName + " марш",
			unit: marshName + " марш",
			itemGroup: "Каркас"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	//прямые ступени 
	item = {
		id: "rectTread",
		amt: spec.treads[marshNumber],
		discription: "Прямые ступени " + marshName + " марш", 
		unit: marshName + " марш",
		itemGroup: "Ступени"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	
	//площадки
	item = {
		id: "platform",
		amt: spec.plt[marshNumber],
		discription: "Щиты площадки " + marshName + " марш",
		unit: marshName + " марш",
		itemGroup: "Ступени"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	//забежные ступени
	item = {
		id: "wndTread",
		amt: spec.wndTreads[marshNumber],
		discription: "Забежные ступени " + marshName + " марш", 
		unit: marshName + " марш",
		itemGroup: "Ступени"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	//больцы
	item = {
		id: "bolz",
		amt: spec.bolz[marshNumber],
		discription: "Больцы " + marshName + " марш", 
		unit: marshName + " марш",
		itemGroup: "Ограждения"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	//балясины
	item = {
		id: "banister",
		amt: spec.banister[marshNumber],
		discription: "Стойки ограждения " + marshName + " марш", 
		unit: marshName + " марш",
		itemGroup: "Ограждения"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	//поручни
	partsList.handrail.name = "Поручень " + params.handrail;
	partsList.handrail.timberPaint = false;
	if(params.handrail != "ПВХ") partsList.handrail.timberPaint = true;
	if(spec.handrail[marshNumber]){
		for(var i=0; i<spec.handrail[marshNumber].length; i++){
			item = {
				id: "handrail",
				amt: 1,
				discription: "Поручень " + marshName + " марш L=" + spec.handrail[marshNumber][i] + "мм", 
				unit: marshName + " марш",
				itemGroup: "Ограждения"
				};
			if(item.amt > 0) partsList.addItem(item);		
			}
		}
	

	//колонны	
	if(spec.columns[marshNumber]){
		for(var i=0; i<spec.columns[marshNumber].length; i++){
			item = {
				id: "columns",
				amt: 1,
				discription: "Колонна " + marshName + " марш L=" + spec.columns[marshNumber][i] + "мм", 
				unit: marshName + " марш",
				itemGroup: "Каркас"
				};
			if(item.amt > 0) partsList.addItem(item);		
			}
		}
		

	//Консоли
	item = {
		id: "consoles",
		amt: spec.consoles[marshNumber],
		discription: "Консоли " + marshName + " марш", 
		unit: marshName + " марш",
		itemGroup: "Каркас"
		};
	if(item.amt > 0) partsList.addItem(item);
	
	
	
}//конец цикла перебора маршей	
	

		
if(stairModel == "Прямая"){
	

	}
if(stairModel == "Г-образная с площадкой"){}
if(stairModel == "Г-образная с забегом"){}
if(stairModel == "П-образная с площадкой"){}
if(stairModel == "П-образная с забегом"){}
if(stairModel == "П-образная трехмаршевая"){}




//балюстрада
	
	calcSpecBanister(partsList)
		
	
		



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
 

	var outputDiv = document.getElementById('drawings');
	outputDiv.innerHTML = "<h3>Чертежи деталей</h3>" + 
	"<a href='/drawings/fire/pasport_v1.1.pdf' target='_blank'>Паспорт лестницы PDF</a></br>" + 
	"<a href='/drawings/fire/parts_v1.4.pdf' target='_blank'>Детали для цеха PDF</a></br>" + 
	"<a href='/drawings/fire/cnc_2mm_v1.4.dxf' target='_blank'>Детали на плазму 2мм DXF</a></br>" + 
	"<a href='/drawings/fire/cnc_4mm_v1.4.dxf' target='_blank'>Детали на плазму 4мм DXF</a></br>" + 
	"<a href='/drawings/fire/cnc_4mm_rifl_v1.4.dxf' target='_blank'>Детали на плазму 4мм рифленка DXF</a></br>" + 
	"<a href='/drawings/fire/cnc_8mm_v1.4.dxf' target='_blank'>Детали на плазму 8мм DXF</a></br>" + 
	"<a href='/drawings/fire/legHolder.dwg' target='_blank'>Кронштейн ноги 8мм DWG</a></br>";

	printPartsAmt();

} // end of calcSpecModule()