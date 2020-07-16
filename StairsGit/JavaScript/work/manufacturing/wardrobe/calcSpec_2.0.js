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


	return list;
}//end of createPartsList

// функция расчёта спецификации
function calcSpec(){


	//Инициализация справочника деталей
	var partsList = createPartsList();
	var item = {}
	
	//балюстрада
	calcSpecBanister(partsList);
	

	
	

	
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
	
	showDrawingsLinks();
	printPartsAmt();
	
} //end of calculateSpec