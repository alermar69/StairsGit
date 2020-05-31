/**функция добавления в partsList элементов из объекта specObj в цикле
 */

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
			// if (par.specObj[partName].isModelData && !this[itemId].isModelData) this[itemId].isModelData = true;
			//округляем длину шпильки
			if (item.amt > 0) this[itemId].items.push(item);

		}
	}

} //end of addSpecObjItems

/** фуниция добавляет в массивы items и specItems позиции ограждений
var par = {
	unit: "staircase" || "banister"
	}
*/

function railingItemsAdd(par) {

	par.items = [];
	par.specItems = [];

	//задаем параметры
	if (par.unit == "staircase") {
		par.handrailModel = params.handrail;
		par.railingModel = params.railingModel;
		par.rackType = params.banisterMaterial;
		par.rigelType = params.rigelMaterial;
		par.rackBottom = params.rackBottom;
		par.specObj = partsAmt;
		par.group = "Ограждения";
	}

	if (par.unit == "banister") {
		par.handrailModel = params.handrail_bal;
		par.railingModel = params.railingModel_bal;
		par.rackType = params.banisterMaterial_bal;
		par.rigelType = params.rigelMaterial_bal;
		par.rackBottom = params.rackBottom_bal;
		par.specObj = partsAmt_bal;
		par.group = "Балюстрада";
	}


	//покраска ограждений
	if (params.metalPaint_railing == "как на лестнице") params.metalPaint_railing = params.metalPaint;
	if (params.railingMetalColorNumber == "как на лестнице") params.railingMetalColorNumber = params.metalColorNumber;
	if (params.timberPaint_perila == "как на лестнице") params.timberPaint_perila = params.timberPaint;
	if (params.railingTimberColorNumber == "как на лестнице") params.railingTimberColorNumber = params.timberColorNumber;

	if (params.railingMetalColorNumber_bal == "как на лестнице") params.railingMetalColorNumber_bal = params.metalColorNumber;
	if (params.timberPaint_perila_bal == "как на лестнице") params.timberPaint_perila_bal = params.timberPaint;
	if (params.railingTimberColorNumber_bal == "как на лестнице") params.railingTimberColorNumber_bal = params.timberColorNumber;

	if (par.railingModel == "Ригели") {
		banisterItemsAdd(par);
	};

	if (par.railingModel == "Стекло на стойках") {
		banisterItemsAdd(par);
		glassItemsAdd(par);
	};

	if (par.railingModel == "Экраны лазер") {
		banisterItemsAdd(par);
		//glassItemsAdd(par);
	};

	if (par.railingModel == "Самонесущее стекло") {
		selfCarrierGlassItemsAdd(par);
	};

	if (par.railingModel == "Кованые балясины" || par.railingModel == "Решетка") {
		kovkaItemsAdd(par);
	};

	handrailItemsAdd(par);

	return par;
}

//Done, оставшиеся позиции не понял
// функция расчета ограждений со стойками
function banisterItemsAdd(par) {

	var metalPaint = false;
	var timberPaint = false;
	if (par.rackType == "40х40 черн.") metalPaint = true;
	if (par.rackType == "40х40 нерж+дуб") timberPaint = true;

	var itemsPar = {
		specObj: par.specObj,
		partName: "racks",
		metalPaintRailing: metalPaint,
		timberPaintRailing: timberPaint,
		division: "metal",
		itemGroup: par.group,
	}

	par.specItems.push(itemsPar)

	//нижний кронштейн КО
	var itemsPar = {
		specObj: par.specObj,
		partName: "sideRackHolder",
		metalPaint: true,
		timberPaint: false,
		division: "metal",
		itemGroup: par.group,
	}

	par.specItems.push(itemsPar)

	//поворотный столб моно

	var itemsPar = {
		specObj: par.specObj,
		partName: "turnRack",
		metalPaintRailing: metalPaint,
		timberPaintRailing: timberPaint,
		division: "metal",
		itemGroup: par.group,
	}

	par.specItems.push(itemsPar)

} // end of banisterItemsAdd

//DONE;
// функция добавления позиций стекол и их фурнитуры
function glassItemsAdd(par) {

	var itemsPar = {
		specObj: par.specObj,
		partName: "glasses",
		metalPaint: false,
		timberPaint: false,
		division: "metal",
		itemGroup: par.group,
	}

	par.specItems.push(itemsPar)


	var itemsPar = {
		specObj: par.specObj,
		partName: "glassHolder",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		itemGroup: par.group,
	}

	par.specItems.push(itemsPar)

} // end of glassItemsAdd


// функция добавления позиций кованых ограждений
function kovkaItemsAdd(par) {
	var itemsPar = {
		specObj: par.specObj,
		partName: "forgedSection",
		metalPaint: true,
		timberPaint: false,
		division: "metal",
		itemGroup: par.group,
	}

	par.specItems.push(itemsPar)
} // end of kovkaItemsAdd

//DONE
// функция добавления позиций ограждений с самонесущим стеклом
function selfCarrierGlassItemsAdd(par) {

	var itemsPar = {
		specObj: par.specObj,
		partName: "glasses",
		metalPaint: false,
		timberPaint: false,
		division: "timber",
		itemGroup: par.group,
	}

	par.specItems.push(itemsPar)

	var totalGlassSectionAmt = getPartAmt("glasses", par.specObj);
	var rutelAmt = 0;
	if (totalGlassSectionAmt != 0) rutelAmt = 4 * totalGlassSectionAmt + 1;

	if (totalGlassSectionAmt != 0) {
		var rutelSize = 14;
		if (par.unit == "staircase" && params.calcType == "mono") rutelSize = 10;

		// кронштейны поручней

		//рассчитываем параметры поручня	
		if (par.unit == "staircase") {
			var handrailPar = {
				prof: params.handrailProf,
				sideSlots: params.handrailSlots,
				handrailType: params.handrail,
			}
		}
		if (par.unit == "banister") {
			var handrailPar = {
				prof: params.handrailProf_bal,
				sideSlots: params.handrailSlots_bal,
				handrailType: params.handrail_bal,
			}
		}
		handrailPar = calcHandrailMeterParams(handrailPar); //функция в файле priceLib.js



		var itemsPar = {
			specObj: par.specObj,
			partName: "glassHandrailHolder",
			metalPaint: false,
			timberPaint: false,
			division: "stock_1",
			itemGroup: par.group,
		}

		par.specItems.push(itemsPar)

		var holderAmt = getPartAmt("glassHandrailHolder", par.specObj);


	}
} // end of selfCarrierGlassItemsAdd

/** функция добавляет поручни и фурнитуру на них
 */

function handrailItemsAdd(par) {
	if (!par.specObj.handrails) return;

	//рассчитываем параметры поручня	
	if (par.unit == "staircase") {
		var handrailPar = {
			prof: params.handrailProf,
			sideSlots: params.handrailSlots,
			handrailType: params.handrail,
		}
		if (params.calcType == "vint") handrailPar.handrailType = params.handrailMaterial;
	}
	if (par.unit == "banister") {
		var handrailPar = {
			prof: params.handrailProf_bal,
			sideSlots: params.handrailSlots_bal,
			handrailType: params.handrail_bal,
		}
	}
	handrailPar = calcHandrailMeterParams(handrailPar); //функция в файле priceLib.js

	var itemsPar = {
		specObj: par.specObj,
		partName: "handrails",
		metalPaint: handrailPar.metalPaint,
		timberPaint: handrailPar.timberPaint,
		division: handrailPar.division,
		itemGroup: par.group,
	}

	par.specItems.push(itemsPar)

	// кронштейны поручня

	var totalHolderAmt = getPartAmt("handrailHolderAng", par.specObj) + getPartAmt("handrailHolderStr", par.specObj) + getPartAmt("tube12", par.specObj);


	if (par.railingModel != "Кованые балясины" && par.railingModel != "Решетка") {
		var itemsPar = {
			specObj: par.specObj,
			partName: "handrailHolderAng",
			metalPaint: false,
			timberPaint: false,
			division: "stock_1",
			itemGroup: par.group,
		}

		par.specItems.push(itemsPar)

		var itemsPar = {
			specObj: par.specObj,
			partName: "handrailHolderStr",
			metalPaint: false,
			timberPaint: false,
			division: "stock_1",
			itemGroup: par.group,
		}

		par.specItems.push(itemsPar)

	}


	if (par.railingModel == "Кованые балясины" || par.railingModel == "Решетка") {

		var itemsPar = {
			specObj: par.specObj,
			partName: "tube12",
			metalPaint: false,
			timberPaint: false,
			division: "stock_1",
			itemGroup: par.group,
		}

		par.specItems.push(itemsPar)

	}

	var handrailAmt = 0;
	if (par.specObj["handrails"]) handrailAmt = par.specObj["handrails"].amt;

	//фурнитура пристенных поручней

	var itemsPar = {
		specObj: par.specObj,
		partName: "wallHandrailHolder",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		itemGroup: par.group,
	}

	par.specItems.push(itemsPar)

	var wallHandrailHolderAmt = 0;
	if (par.specObj["wallHandrailHolder"]) wallHandrailHolderAmt = par.specObj["wallHandrailHolder"].amt;


} //конец поручней

/** функция добавляет уголки балясин и крепеж для лестниц МК и винтовых
 */

function addBalAngles(par) {
	//уголки балясин
	var itemsPar = {
		specObj: par.specObj,
		partName: "balAngle",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		itemGroup: par.group,
	}
	par.specItems.push(itemsPar);

	var angleAmt = getPartAmt("balAngle", par.specObj);

	//болты
	var boltId = "boltHex_M6x30";
	if (params.calcType == "mono") boltId = "bolt_M6x20";


	item = {
		id: boltId,
		amt: angleAmt,
		discription: "Крепление уголков к балясинам",
		unit: "Крепление балясины к ступени",
		itemGroup: par.group,
	};
	if (item.amt > 0) par.items.push(item);

	if (params.calcType == "vint") {
		//шайбы
		item = {
			id: "shim_M6",
			amt: angleAmt,
			discription: "Крепление уголков к балясинам",
			unit: "Крепление балясины к ступени",
			itemGroup: par.group,
		};
		if (item.amt > 0) par.items.push(item);

		//гайки
		item = {
			id: "nut_M6",
			amt: angleAmt,
			discription: "Крепление уголков к балясинам",
			unit: "Крепление балясины к ступени",
			itemGroup: par.group,
		};
		if (item.amt > 0) par.items.push(item);
	}

	//шурупы крепления к ступеням
	if (params.treadsMaterial != "рифленая сталь" && params.treadsMaterial != "лотки под плитку") {

		item = {
			id: "screw_6x32",
			amt: (angleAmt - 1) * 2,
			discription: "Крепление уголков к ступеням",
			unit: "Крепление балясины к ступени",
			itemGroup: par.group,
		};
		if (item.amt > 0) par.items.push(item);

	}

	//болты крепления к ступеням

	if (params.treadsMaterial == "рифленая сталь" || params.treadsMaterial == "лотки под плитку") {
		//болты
		item = {
			id: "bolt_M6x20",
			amt: (angleAmt - 1) * 2,
			discription: "Крепление уголков к ступеням",
			unit: "Крепление балясины к ступени",
			itemGroup: par.group,
		};
		if (item.amt > 0) par.items.push(item);

		//шайбы
		item = {
			id: "shim_M6",
			amt: (angleAmt - 1) * 2,
			discription: "Крепление уголков к ступеням",
			unit: "Крепление балясины к ступени",
			itemGroup: par.group,
		};
		if (item.amt > 0) par.items.push(item);

		//гайки
		item = {
			id: "nut_M6",
			amt: (angleAmt - 1) * 2,
			discription: "Крепление уголков к ступеням",
			unit: "Крепление балясины к ступени",
			itemGroup: par.group,
		};
		if (item.amt > 0) par.items.push(item);
	}

} //end of addBalAngles

/** функция добавляет метизы крепления ступеней к каркасу
 */
function calcTreadFixMetiz() {

	var items = [];

	var treadPar = getTreadParams(); //функция в файле calcSpecGeneral.js

	if (params.stairType != "нет") {

		var fixPartAmt = getPartAmt("tread") * 4;
		if (treadPar.fixPart == "boltMeb") fixPartAmt = getPartAmt("tread") * 6;
		if (treadPar.fixPart == "scotch") fixPartAmt = getPartAmt("tread") * 2 * params.M / 1000;

		item = {
			id: treadPar.fixPartId,
			amt: fixPartAmt,
			discription: "Крепление ступеней",
			unit: "Крепление ступеней",
			itemGroup: "Ступени",
		};
		if (item.amt > 0) items.push(item);

		item = {
			id: treadPar.fixPartId,
			amt: getPartAmt("startTread") * 8,
			discription: "Крепление пригласительные ступеней",
			unit: "Крепление ступеней",
			itemGroup: "Ступени",
		};
		if (item.amt > 0) items.push(item);

		if (params.riserType != "нет") {
			var wndTreadAmt = getPartAmt("wndTread") + getPartAmt("wndTreadMid");


			item = {
				id: "screw_3x55",
				amt: getPartAmt("riser_arc") * 4,
				discription: "Крепление гнутых подступенков снизу",
				unit: "Крепление подступенков",
				itemGroup: "Ступени",
			};
			if (item.amt > 0) items.push(item);
		}
	}

	return items;
} //end of addTreadFixMetiz