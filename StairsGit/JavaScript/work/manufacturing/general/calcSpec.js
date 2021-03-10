/**функция добавления в partsList элементов из объекта specObj в цикле */
function createPartsList() {

	var list = {
		addItem: addItem, //функция в файле /manufacturing/general/calc_spec/calcSpec.js
		addSpecObjItems: addSpecObjItems, //функция в файле /manufacturing/general/calc_spec/calcSpec.js
	};

	//общие позиции для всех лестницы
	addGeneralItems(list); //функция в файле /calculator/general/calcSpec.js

	return list;


} //end of createPartsList

/** общая функция добавления применения элемента в partsList для уже имеющейся в справочнике позиции
 */
function addItem(par) {
	var item = {
		amt: par.amt, //кол-во в данном применении
		discription: par.discription, //описание применения
		unit: par.unit, //узел лестницы
		group: par.itemGroup, //группа деталей лестницы
	};
	//добавляем информацию о размерах, если она есть
	if (par.size) item.size = par.size;
	if (par.comment) item.comment = par.comment;

	this[par.id].items.push(item);

} //end of addItem;

/**функция добавления элементов из объекта specObj в цикле */
function addSpecObjItems(par) {
	var partName = par.partName;
	var comment = "";
	if (par.comment) comment = par.comment;

	if (par.specObj[partName]) {
		for (var type in par.specObj[partName]["types"]) {
			var itemId = partName;
			if (type != 0) itemId += type;
			//сознаем позицию в справочнике ести такой нет
			if (!this[itemId]) {
				this[itemId] = {
					name: par.specObj[partName].name,
					amtName: "шт.",
					metalPaint: par.metalPaint,
					timberPaint: par.timberPaint,
					division: par.division,
					items: [],
					comment: comment,
					group: par.itemGroup,
					isModelData: true,
				};
				if (type != 0) this[itemId].name += " " + type;

				if (params.calcType == "vint" &&
					params.platformType == "square" &&
					params.treadsMaterial != "рифленая сталь" &&
					params.treadsMaterial != "лотки под плитку" &&
					partName == "drum" &&
					par.specObj[partName]["types"][type] > 2) {
					this[itemId].comment = "одну приварить к рамке площадки"
				}

			}
			//добавляем кол-во
			var item = {
				amt: Math.round(par.specObj[partName]["types"][type] * 100) / 100,
				discription: "",
				unit: "данные с модели",
				group: par.itemGroup,
			};
			if (par.specObj[partName].purposes) {
				item.discription = par.specObj[partName].purposes.join(', '); //Добавляем назначение если оно есть
			}
			// debugger;
			if (par.specObj[partName].typeComments && par.specObj[partName].typeComments[type]) {
				this[itemId].comment += par.specObj[partName].typeComments[type];
			}
			// if (par.specObj[partName].isModelData && !this[itemId].isModelData) this[itemId].isModelData = true;
			//округляем длину шпильки
			if (item.amt > 0) this[itemId].items.push(item);

		}
	}

} //end of addSpecObjItems

function calculateSpec(){
	//Инициализация справочника деталей
	var partsList = createPartsList();

	var partsAmtObjects = [partsAmt];
	if (window.partsAmt_bal) partsAmtObjects.push(partsAmt_bal);
	if (window.partsAmt_dop) {
		$.each(partsAmt_dop, function(){
			partsAmtObjects.push(this);
		})
	}
	$.each(partsAmtObjects, function() {
		var partsAmtObj = this;
		for (var partName in partsAmtObj) {
			var itemsPar = {
				specObj: partsAmtObj,
				partName: partName,
				metalPaint: partsAmtObj[partName]["metalPaint"],
				timberPaint: partsAmtObj[partName]["timberPaint"],
				division: partsAmtObj[partName]["division"],
				itemGroup: partsAmtObj[partName]["group"],
				comment: "",
			}
			if (partsAmtObj[partName].comment) itemsPar.comment = partsAmtObj[partName].comment;
	
			partsList.addSpecObjItems(itemsPar);
		}
	});

	// вывод спецификации "Комплектовка"
	if(window.printSpecificationCollation) printSpecificationCollation(partsList);
	
	//включаем сортировку и поиск по таблица спецификаций
	$('.tab_4').tablesorter({
		widgets: ['zebra', 'filter'],
		theme: 'blue',
		usNumberFormat: false,
		sortReset: true,
		sortRestart: true,
	});

	if (params.calcType != 'carport' && params.calcType != 'railing' && window.showDrawingsLinks ) showDrawingsLinks();
	printPartsAmt(); //функция в файле calcSpecGeneral.js
	printPoleList(); //функция в файле calcSpecGeneral.js
}