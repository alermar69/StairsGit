function createPartsList() {

	var list = {
		addItem: addItem, //функция в файле /manufacturing/general/calc_spec/calcSpec.js
		addSpecObjItems: addSpecObjItems, //функция в файле /manufacturing/general/calc_spec/calcSpec.js
	};

	//общие позиции для всех лестницы
	addGeneralItems(list); //функция в файле /calculator/general/calcSpec.js

	return list;
} //end of createPartsList

// функция расчёта спецификации
function calculateSpec() {

	//Инициализация справочника деталей
	var partsList = createPartsList();
	var item = {}
	console.log(partsAmt)
	for (var partName in partsAmt) {
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

	//функция в файле /manufacturing/general/calc_spec/calcSpec.js
	var railingSpecPar = {
		unit: "staircase",
	}
	railingSpecPar = railingItemsAdd(railingSpecPar);


	for (var i = 0; i < railingSpecPar.items.length; i++) {
		partsList.addItem(railingSpecPar.items[i]);
	}

	//балюстрада

	calcSpecBanister(partsList);



	// вывод спецификации "Комплектовка"
	printSpecificationCollation(partsList);
	// вывод спецификации "Сборка"
	//printSpecificationAssembly(partsList);
	//включаем сортировку и поиск по таблица спецификаций
	$('.tab_4').tablesorter({
		widgets: ['zebra', 'filter'],
		theme: 'blue',
		usNumberFormat: false,
		sortReset: true,
		sortRestart: true,
	});

	function addWorks() {}

	crateWorksList();
	calcWorks(partsAmt, "staircase");
	calcWorks(partsAmt_bal, "banister");
	printWorks2();

	printPartsAmt(); //функция в файле calcSpecGeneral.js
	printPoleList(); //функция в файле calcSpecGeneral.js


} //end of calculateSpec