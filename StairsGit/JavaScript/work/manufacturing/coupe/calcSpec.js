function printModelInfo() {

	var modelInfo = "<h2>Параметры деталей, снятые с модели</h2>";
	for (var partName in specObj) {
		if (specObj[partName]) {
			for (var type in specObj[partName]["types"]) {
				modelInfo += specObj[partName].name + " " + type + ": " + specObj[partName]["types"][type] + " шт<br/>"
			}
		}
	}

	console.log(specObj)

	//расчетные параметры для спецификации

	//уплотнитель для стекла

	if (specObj.mirrow != undefined) {
		partsParams.glassSeal = {
			name: "Уплотнитель для стекла 4мм",
			amt: Math.ceil(specObj.mirrow.perim * 10) / 10,
			division: 'metal'
		}
	}
	//шлегель
	if (specObj.vertCoupeProf != undefined) {
		partsParams.slegel = {
			name: "Шлегель",
			amt: Math.ceil(specObj.vertCoupeProf.sumLength * 10) / 10,
		}
	}

	//сборочный винт
	var screwAmt = 0;
	if (specObj.botCoupeProf != undefined) screwAmt += specObj.botCoupeProf.amt * 2;
	if (specObj.topCoupeProf != undefined) screwAmt += specObj.topCoupeProf.amt * 2;
	if (specObj.inpostCoupeProf != undefined) screwAmt += specObj.inpostCoupeProf.amt * 2;
	partsParams.doorScrew = {
		name: "Сборочный винт для дверей купе",
		amt: screwAmt,
	}


	modelInfo += "<h3>Расчетные параметры</h3>";

	var totalAreaDsp16 = 0;
	var totalAreaDsp10 = 0;
	var sheetArea = 2.8 * 2.07;
	if (specObj.carcasPanel != undefined) totalAreaDsp16 += specObj.carcasPanel.area;
	if (specObj.boxPanel != undefined) totalAreaDsp16 += specObj.boxPanel.area;
	if (specObj.shelf != undefined) totalAreaDsp16 += specObj.shelf.area;

	if (specObj.doorPanel != undefined) totalAreaDsp10 += specObj.doorPanel.area;

	if (totalAreaDsp16) modelInfo += "Чистая площадь лдсп 16мм: " + Math.ceil(totalAreaDsp16 * 10) / 10 + " м2 (" + Math.ceil(totalAreaDsp16 / sheetArea * 10) / 10 + " лист.)<br/>"
	if (totalAreaDsp10) modelInfo += "Чистая площадь лдсп 10мм: " + Math.ceil(totalAreaDsp10 * 10) / 10 + " м2 (" + Math.ceil(totalAreaDsp10 / sheetArea * 10) / 10 + " лист.)<br/>"



	/*ведомость деталей из лдсп*/

	//копируем детали в новый массив с одновременной групировкой одинаковых деталей
	var boardsTypes = {};
	for (var mat in boardsList) {
		if (mat != "other") boardsTypes[mat] = [];
	}

	//перебираем все панели
	for (var mat in boardsTypes) {
		for (var i = 0; i < boardsList[mat].length; i++) {
			var newBoard = boardsList[mat][i];
			var isNewType = true;

			//перебираем уже внесенные панели, ищем дубли
			for (var j = 0; j < boardsTypes[mat].length; j++) {
				var oldBoard = boardsTypes[mat][j];
				//сравниваем размеры и кромку нового эл-та с уже добавленными
				if (newBoard.height == oldBoard.height &&
					newBoard.width == oldBoard.width &&
					newBoard.thk == oldBoard.thk &&
					newBoard.edging.vertFace == oldBoard.edging.vertFace &&
					newBoard.edging.horFace == oldBoard.edging.horFace &&
					newBoard.edging.vertSide == oldBoard.edging.vertSide &&
					newBoard.edging.horSide == oldBoard.edging.horSide) {
					isNewType = false;
					oldBoard.amt += 1;
					//добавляем название, если оно не было добавлено раньше
					if (oldBoard.description.indexOf(newBoard.text) == -1) {
						oldBoard.description.push(newBoard.text)
					}
				}
			} //конец поиска дублей

			if (isNewType) boardsTypes[mat].push(newBoard);

		} //конец перебора панелей
	} //конец перебора материалов

	var isEdging1 = false;
	var isEdging2 = false;
	if (params.sideEdging != 0) isEdging1 = true;
	if (params.faceEdging != 0 && params.faceEdging != params.sideEdging) isEdging2 = true;
	var edgingColAmt = 1;
	if (isEdging1) edgingColAmt += 1;
	if (isEdging2) edgingColAmt += 1;

	modelInfo += "<h3>Ведомость деталей ЛДСП</h3>" +
		"<p>Размеры указаны до кромления</p>" +
		"<table class='tab_2' id='partsTable'><tbody>";
	if (edgingColAmt > 1) {
		modelInfo +=
			"<tr><th rowspan='2'>Толщина</th><th colspan=" + edgingColAmt + ">Вдоль волокон</th><th colspan=" + edgingColAmt + ">Поперек волокон</th><th rowspan='2'>Кол-во</th><th rowspan='2'>Назначение</th></tr>" +
			"<tr><th>Длина</th>";
		if (isEdging1) modelInfo += "<th>Кромка " + params.sideEdging + "</th>";
		if (isEdging2) modelInfo += "<th>Кромка " + params.faceEdging + "</th>";
		modelInfo += "<th>Ширина</th>";
		if (isEdging1) modelInfo += "<th>Кромка " + params.sideEdging + "</th>";
		if (isEdging2) modelInfo += "<th>Кромка " + params.faceEdging + "</th>";
		modelInfo += "</tr>";
	}
	if (edgingColAmt == 1) {
		modelInfo +=
			"<tr><th>Толщина</th><th>Длина вдоль волокон</th><th>Ширина поперек волокон</th><th>Кол-во</th><th>Назначение</th></tr>";
	}

	for (var mat in boardsTypes) {
		for (var i = 0; i < boardsTypes[mat].length; i++) {
			var board = boardsTypes[mat][i];

			modelInfo += "<tr>" +
				"<td>" + board.thk + "</td><td>" + board.noEdgingHeight + "</td>";
			if (isEdging1) {
				modelInfo += "<td>";
				if (board.edging.vertSide) modelInfo += board.edging.vertSide;
				modelInfo += "</td>";
			}
			if (isEdging2) {
				modelInfo += "<td>";
				if (board.edging.vertFace) modelInfo += board.edging.vertFace;
				modelInfo += "</td>";
			}
			modelInfo += "<td>" + board.noEdgingWidth + "</td>";
			if (isEdging1) {
				modelInfo += "<td>";
				if (board.edging.horSide) modelInfo += board.edging.horSide;
				modelInfo += "</td>";
			}
			if (isEdging2) {
				modelInfo += "<td>";
				if (board.edging.horFace) modelInfo += board.edging.horFace;
				modelInfo += "</td>";
			}

			modelInfo += "<td>" + board.amt + "</td>";
			modelInfo += "<td>";
			for (var j = 0; j < board.description.length; j++) {
				modelInfo += board.description[j];
				if (j < board.description.length - 1) modelInfo += "<br/>";
			}
			modelInfo += "</td></tr>";
		}
	}


	modelInfo += "</tbody></table><br/><button id='downLoadPartsList'>Скачать xls</button>"

	//ведомость деталей дверей
	modelInfo += "<h3>Ведомость деталей дверей</h3>" +

		"<table class='tab_2' id='doorsTable'><tbody>" +
		"<tr><th>Наименование</th><th>Кол-во</th><th>Примечание</th>";

	for (var partName in specObj) {
		if (specObj[partName].unit == "doors") {
			for (var type in specObj[partName]["types"]) {
				modelInfo += "<tr><td>" + specObj[partName].name + " " + type + "</td><td>" + specObj[partName]["types"][type] + "</td><td>с модели</td></tr>";
			}
		}
	}
	if (specObj.mirrow != undefined) modelInfo += "<tr><td>Уплотнитель для стекла 4мм, м.п.: </td><td>" + Math.ceil(specObj.mirrow.perim * 10) / 10 + "</td><td></td></tr>";
	modelInfo += "<tr><td>Сборочный винт, шт</td><td>" + screwAmt + "</td><td></td></tr>";
	modelInfo += "<tr><td>Комплект роликов, шт</td><td>" + params.kupeDoorAmt_wr + "</td><td></td></tr>";


	modelInfo += "</tbody></table><br/><button id='downLoadDoorsSpec'>Скачать xls</button>"

	modelInfo +=
		"<h3>Расчетные параметры дверей</h3>" +
		"Внутренние размеры проема (Ш х В) проема: " + wrParams.totalDoorsWidth + " х " + wrParams.totalDoorsHeight + " мм<br/>" +
		"Размеры двери (Ш х В): " + wrParams.doorWidth + " х " + wrParams.doorHeight + " мм<br/>";



	$("#modelInfo").html(modelInfo);

	$("#partsTable tr").each(function () {
		var heightCell = $(this).find("td").eq(1);
		var widthCell = $(this).find("td").eq(4);

		if (heightCell.text() > 2750) heightCell.css("background-color", "#FFC5C5");
		if (widthCell.text() > 2050) widthCell.css("background-color", "#FFC5C5");

	})


}


function createPartsList() {
	/*функция создает справочник деталей*/
	var list = {};
	//функция добавления применения элемента
	list.addItem = function (itemParams) {
		var item = {
			amt: itemParams.amt, //кол-во в данном применении
			discription: itemParams.discription, //описание применения
			unit: itemParams.unit, //узел лестницы
			group: itemParams.itemGroup, //группа деталей лестницы
		};
		//добавляем информацию о размерах, если она есть
		if (itemParams.size) item.size = itemParams.size;

		this[itemParams.id].items.push(item);
	};

	//функция добавления элементов из объекта specObj в цикле
	list.addSpecObjItems = function (par) {
		var partName = par.partName;

		if (par.specObj[partName]) {
			for (var type in par.specObj[partName]["types"]) {
				//сознаем позицию в справочнике
				var itemId = partName + type;
				this[itemId] = {
					name: par.specObj[partName].name + " " + type,
					amtName: "шт.",
					metalPaint: par.metalPaint,
					timberPaint: par.timberPaint,
					division: par.division,
					items: [],
					comment: "данные с модели",
				};

				//добавляем кол-во
				var item = {
					amt: par.specObj[partName]["types"][type],
					discription: "",
					unit: "данные с модели",
					group: par.itemGroup,
				};
				if (item.amt > 0) this[itemId].items.push(item);

			}
		}

	};


	//общие позиции для всех лестницы
	addGeneralItems(list); //функция в файле /calculator/general/calcSpec.js


	list.coupeDoor = {
		name: "Дверь купе " + wrParams.doorWidth + "х" + wrParams.doorHeight,
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "metal",
		items: [],
	};

	list.ldspPanel = {
		name: "Панель ЛДСП",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "timber",
		items: [],
		comment: "Размеры и кромление см. ведомость деталей",
	};

	list.dvpPanel = {
		name: "Панель ДВП",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "timber",
		items: [],
		comment: "Размеры и кромление см. ведомость деталей",
	};

	list.railFlan = {
		name: "Фланец штанги Ф25 хром",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
	};

	list.slegel = {
		name: "Шлегель",
		amtName: "м.п.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
	};

	list.slegel = {
		name: "Шлегель " + params.schlegelColor,
		amtName: "м.п.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
	};

	list.doorStopper = {
		name: "Стопор двери",
		amtName: "м.п.",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
	};

	list.doorStopper = {
		name: "Стопор двери",
		amtName: "шт",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
	};

	list.ldspPlug = {
		name: "Заглушка самокл. цвет " + params.carcasColor,
		amtName: "шт",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		items: [],
	};


	return list;

}; //end of createPartsList

// функция расчёта спецификации
function calculateSpec() {

	//Инициализация справочника деталей
	var partsList = createPartsList();
	var item = {}


	//двери	

	item = {
		id: "coupeDoor",
		amt: params.kupeDoorAmt_wr,
		discription: "Двери купе",
		unit: "Двери купе",
		itemGroup: "Двери",
	};
	if (item.amt > 0) partsList.addItem(item);

	modelInfo += "<tr><td>Шлегель, м.п.</td><td>" + Math.ceil(specObj.vertCoupeProf.sumLength * 10) / 10 + "</td><td></td></tr>";

	//комплектующие дверей
	item = {
		id: "slegel",
		amt: Math.ceil(specObj.vertCoupeProf.sumLength * 10) / 10,
		discription: "Двери купе",
		unit: "Двери купе",
		itemGroup: "Двери",
	};
	if (item.amt > 0) partsList.addItem(item);

	item = {
		id: "doorStopper",
		amt: params.kupeDoorAmt_wr,
		discription: "Двери купе",
		unit: "Двери купе",
		itemGroup: "Двери",
	};
	if (item.amt > 0) partsList.addItem(item);


	//верхние напрваляющие

	var itemsPar = {
		specObj: specObj,
		partName: "topRail",
		metalPaint: false,
		timberPaint: false,
		division: "metal",
		itemGroup: "Двери",
	}

	partsList.addSpecObjItems(itemsPar);


	//нижние направляющие

	var itemsPar = {
		specObj: specObj,
		partName: "botRail",
		metalPaint: false,
		timberPaint: false,
		division: "metal",
		itemGroup: "Двери",
	}

	partsList.addSpecObjItems(itemsPar);

	item = {
		id: "scotch",
		amt: Math.ceil(params.width_wr / 1000 * 2),
		discription: "Крепление направляющих",
		unit: "Двери купе",
		itemGroup: "Двери",
	};
	if (item.amt > 0) partsList.addItem(item);

	//пенели корпуса

	if (boardsList["ldsp_carcas"]) {
		item = {
			id: "ldspPanel",
			amt: boardsList["ldsp_carcas"].length,
			discription: "панели корпуса",
			unit: "Корпус",
			itemGroup: "Корпус",
			comment: "данные с модели",
		};
		if (item.amt > 0) partsList.addItem(item);
	}

	if (boardsList["dvp"]) {
		item = {
			id: "dvpPanel",
			amt: boardsList["dvp"].length,
			discription: "панели корпуса",
			unit: "Корпус",
			itemGroup: "Корпус",
			comment: "данные с модели",
		};
		if (item.amt > 0) partsList.addItem(item);
	}

	//крепление фальшпанелей
	var fixAmt = 0;
	if (params.leftWall_wr == "фальшпанель") fixAmt += Math.ceil(params.height_wr / 1000) + 1;
	if (params.rightWall_wr == "фальшпанель") fixAmt += Math.ceil(params.height_wr / 1000) + 1;
	if (params.topWall_wr == "фальшпанель") fixAmt += Math.ceil(params.width_wr / 1000) + 1;
	if (params.botWall_wr == "фальшпанель") fixAmt += Math.ceil(params.width_wr / 1000) + 1;

	item = {
		id: "screw_3x55",
		amt: fixAmt,
		discription: "Крепление фальшпанелей к стенам",
		unit: "Корпус",
		itemGroup: "Корпус",
	};
	if (item.amt > 0) partsList.addItem(item);

	item = {
		id: "dowel_6x40",
		amt: fixAmt,
		discription: "Крепление фальшпанелей к стенам",
		unit: "Корпус",
		itemGroup: "Корпус",
	};
	if (item.amt > 0) partsList.addItem(item);

	item = {
		id: "ldspPlug",
		amt: fixAmt,
		discription: "Крепление фальшпанелей к стенам",
		unit: "Корпус",
		itemGroup: "Корпус",
	};
	if (item.amt > 0) partsList.addItem(item);





	//Метабоксы	

	var itemsPar = {
		specObj: specObj,
		partName: "metalBoxPanel",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		itemGroup: "Наполнение",
	}

	partsList.addSpecObjItems(itemsPar);

	var metalBoxAmt = 0;
	if (specObj["metalBoxPanel"]) metalBoxAmt = specObj["metalBoxPanel"].amt / 2;

	item = {
		id: "screw_4x16",
		amt: metalBoxAmt * 14,
		discription: "Сборка выдвижных ящиков",
		unit: "Ящики",
		itemGroup: "Наполнение",
	};
	if (item.amt > 0) partsList.addItem(item);

	item = {
		id: "screw_4x16",
		amt: metalBoxAmt * 6,
		discription: "Крепление выдвижных ящиков",
		unit: "Ящики",
		itemGroup: "Наполнение",
	};
	if (item.amt > 0) partsList.addItem(item);


	//штанги

	var itemsPar = {
		specObj: specObj,
		partName: "rail",
		metalPaint: false,
		timberPaint: false,
		division: "metal",
		itemGroup: "Наполнение",
	}

	partsList.addSpecObjItems(itemsPar);

	var itemsPar = {
		specObj: specObj,
		partName: "jokerFitting",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		itemGroup: "Наполнение",
	}

	partsList.addSpecObjItems(itemsPar);

	var itemsPar = {
		specObj: specObj,
		partName: "jokerFlan",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		itemGroup: "Наполнение",
	}

	partsList.addSpecObjItems(itemsPar);

	var flanAmt = 0;
	if (specObj["jokerFlan"]) flanAmt = specObj["jokerFlan"].amt;

	item = {
		id: "screw_4x16",
		amt: flanAmt * 3,
		discription: "Крепление фланцев штанг",
		unit: "Штанги",
		itemGroup: "Наполнение",
	};
	if (item.amt > 0) partsList.addItem(item);

	//уголки

	var itemsPar = {
		specObj: specObj,
		partName: "fixAngle",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		itemGroup: "Наполнение",
	}

	partsList.addSpecObjItems(itemsPar);

	var fixAngleAmt = 0;
	if (specObj["fixAngle"]) fixAngleAmt = specObj["fixAngle"].amt;


	item = {
		id: "screw_4x16",
		amt: fixAngleAmt * 2,
		discription: "Крепление уголков",
		unit: "Сборка корпуса",
		itemGroup: "Наполнение",
	};
	if (item.amt > 0) partsList.addItem(item);

	//конфираматы
	var itemsPar = {
		specObj: specObj,
		partName: "screw",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		itemGroup: "Наполнение",
	}

	partsList.addSpecObjItems(itemsPar);

	//опоры
	var itemsPar = {
		specObj: specObj,
		partName: "legM8",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		itemGroup: "Наполнение",
	}

	partsList.addSpecObjItems(itemsPar);

	// вывод спецификации "Комплектовка"
	printSpecificationCollation(partsList);
	// вывод спецификации "Сборка"
	printSpecificationAssembly(partsList);
	//включаем сортировку и поиск по таблица спецификаций
	$('.tab_4').tablesorter({
		widgets: ['zebra', 'filter'],
		theme: 'blue',
		usNumberFormat: false,
		sortReset: true,
		sortRestart: true,
	});

} //end of calculateSpec