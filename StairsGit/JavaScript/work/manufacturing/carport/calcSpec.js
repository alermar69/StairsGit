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

	for (var partName in partsAmt) {
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

		partsList.addSpecObjItems(itemsPar);
	}

	crateWorksList();
	// calcWorks(partsAmt, "staircase");
	// calcWorks(partsAmt_bal, "banister");
	calculateTotalPrice2();
	printWorks2();

	//материалы
	// createMaterialsList(); // обнуляем список материалов
	// calcMaterialsAmt();
	// printMaterialsNeed();

	printSpecificationCollation(partsList);

	$('.tab_4').tablesorter({
		widgets: ['zebra', 'filter'],
		theme: 'blue',
		usNumberFormat: false,
		sortReset: true,
		sortRestart: true,
	});

	showDrawingsLinks();
	printPartsAmt(); //функция в файле calcSpecGeneral.js
	printPoleList(); //функция в файле calcSpecGeneral.js

	if (typeof modelSpec !== 'undefined') modelSpec = partsList;
	
} //end of calculateSpec

/** функция выводит на страницу ссылки на типовые чертежи деталей
*/

function showDrawingsLinks() {
	var links = "<p>Типовые чертежи:</p>";
	var path = "/drawings/carport/";

	if(params.carportType == "односкатный" || params.carportType == "двухскатный"){
		//фермы поперечные
		var trussName = "truss";
		if(params.carportType == "двухскатный") trussName += "_double"
		if(params.carportType == "односкатный") trussName += "single"
		
		if(params.roofType == "Плоская") trussName += "_flat"
		if(params.roofType == "Арочная") trussName += "_arc"
		
		links += "<a href='" + path + trussName + ".pdf' target='_blank'>Фермы поперечные</a><br/>";
		
		//фермы боковые
		links += "<a href='" + path + "truss_side.pdf' target='_blank'>Фермы боковые</a><br/>";
		
		//колонны основные
		links += "<a href='" + path + "column.pdf' target='_blank'>Колонны</a><br/>";
		if(params.carportType == "односкатный") links += "<a href='" + path + "column_top.pdf' target='_blank'>Колонны длинные</a><br/>";
	}

	$("#drawings").html(links)
}