/**функция добавления в partsList элементов из объекта specObj в цикле
*/

function createPartsList(){
	
    var list = {
		addItem: addItem, //функция в файле /manufacturing/general/calc_spec/calcSpec.js
		addSpecObjItems: addSpecObjItems, //функция в файле /manufacturing/general/calc_spec/calcSpec.js
		};
	
	//общие позиции для всех лестницы
	addGeneralItems(list); //функция в файле /calculator/general/calcSpec.js

return list;
	
	
}//end of createPartsList

/** общая функция добавления применения элемента в partsList для уже имеющейся в справочнике позиции
*/
function addItem(par){
	var item = {
		amt: par.amt, //кол-во в данном применении
		discription: par.discription, //описание применения
		unit: par.unit, //узел лестницы
		group: par.itemGroup, //группа деталей лестницы
	};
	//добавляем информацию о размерах, если она есть
	if(par.size) item.size = par.size;
	if(par.comment) item.comment = par.comment;

	this[par.id].items.push(item);

} //end of addItem;

	
/**функция добавления элементов из объекта specObj в цикле

*/
function addSpecObjItems(par){
	var partName = par.partName;
	var comment = "";
	if(par.comment) comment = par.comment;
	
	if(par.specObj[partName]){
		for(var type in par.specObj[partName]["types"]){
			var itemId = partName;
			if(type != 0) itemId += type;
			//сознаем позицию в справочнике ести такой нет
			if(!this[itemId]){
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
				if(type != 0) this[itemId].name += " " + type;
				/*	
				if(par.timberPaintRailing){
					this[itemId].timberPaintRailing = par.timberPaintRailing;
					}
				if(par.metalPaintRailing){
					this[itemId].metalPaintRailing = par.metalPaintRailing;
					}
				if(par.timberPaint_bal){
					this[itemId].timberPaint_bal = par.timberPaint_bal;
					}
				if(par.metalPaint_bal){
					this[itemId].metalPaint_bal = par.metalPaint_bal;
					}
				*/
				if(params.calcType == "vint" && 
					params.platformType == "square" && 
					params.treadsMaterial != "рифленая сталь" && 
					params.treadsMaterial != "лотки под плитку" &&
					partName == "drum" &&
					par.specObj[partName]["types"][type] > 2){
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
				item.discription = par.specObj[partName].purposes.join(', ');//Добавляем назначение если оно есть
			}
			// if (par.specObj[partName].isModelData && !this[itemId].isModelData) this[itemId].isModelData = true;
			//округляем длину шпильки
			if(item.amt > 0) this[itemId].items.push(item);
			
			}
		}
	
	} //end of addSpecObjItems

/** фуниция добавляет в массивы items и specItems позиции ограждений
var par = {
	unit: "staircase" || "banister"
	}
*/

function railingItemsAdd(par){

	par.items = [];
	par.specItems = [];

	//задаем параметры
	if(par.unit == "staircase"){
		par.handrailModel = params.handrail;
		par.railingModel = params.railingModel;
		par.rackType = params.banisterMaterial;
		par.rigelType = params.rigelMaterial;
		par.rackBottom = params.rackBottom;
		par.specObj = partsAmt;
		par.group = "Ограждения";
		}
		
	if(par.unit == "banister"){
		par.handrailModel = params.handrail_bal;
		par.railingModel = params.railingModel_bal;
		par.rackType = params.banisterMaterial_bal;
		par.rigelType = params.rigelMaterial_bal;
		par.rackBottom = params.rackBottom_bal;
		par.specObj = partsAmt_bal;
		par.group = "Балюстрада";
		}

		
	//покраска ограждений
	if(params.metalPaint_railing == "как на лестнице") params.metalPaint_railing = params.metalPaint;
	if(params.railingMetalColorNumber == "как на лестнице") params.railingMetalColorNumber = params.metalColorNumber;
	if(params.timberPaint_perila == "как на лестнице") params.timberPaint_perila = params.timberPaint;
	if(params.railingTimberColorNumber == "как на лестнице") params.railingTimberColorNumber = params.timberColorNumber;

	if(params.railingMetalColorNumber_bal == "как на лестнице") params.railingMetalColorNumber_bal = params.metalColorNumber;
	if(params.timberPaint_perila_bal == "как на лестнице") params.timberPaint_perila_bal = params.timberPaint;
	if(params.railingTimberColorNumber_bal == "как на лестнице") params.railingTimberColorNumber_bal = params.timberColorNumber;

	if(par.railingModel == "Ригели") {
		banisterItemsAdd(par);
		rigelItemsAdd(par);
		};

    if(par.railingModel == "Стекло на стойках") {
		banisterItemsAdd(par);
		glassItemsAdd(par);
		};
		
	if(par.railingModel == "Экраны лазер") {
		banisterItemsAdd(par);
		//glassItemsAdd(par);
		};

    if(par.railingModel == "Самонесущее стекло") {
		selfCarrierGlassItemsAdd(par);
		};

    if(par.railingModel == "Кованые балясины" || par.railingModel == "Решетка") {
		kovkaItemsAdd(par);
		};
	
	//уголки балясин для винтовых лестниц
	if(par.railingModel == "Частые стойки") {
		//addBalAngles(par);
		};
		
	handrailItemsAdd(par);

	return par;
}

//Done, оставшиеся позиции не понял
// функция расчета ограждений со стойками
function banisterItemsAdd(par) {
	
	var metalPaint = false;
	var timberPaint = false;
	if(par.rackType == "40х40 черн.") metalPaint = true;
	if(par.rackType == "40х40 нерж+дуб") timberPaint = true;

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
	
	var rackAmt = getPartAmt("racks", par.specObj);
	var holderAmt = getPartAmt("handrailHolderAng", par.specObj) + getPartAmt("handrailHolderStr", par.specObj);
	// крепление стоек к лестнице
	if(par.unit == "staircase"){
		if(params.calcType != "mono") marshBanisterFittingsAdd(par);
		//if(params.calcType == "mono" || params.calcType == "vint") addBalAngles(par);
		if(params.calcType == "mono") addMonoRacksFittings(par);
		}
	if(par.unit == "banister"){
		marshBanisterFittingsAdd(par);
		}

		// примыкание к поручню

		// основание штыря
		// if(par.rackType == "40х40 нерж." || par.rackType == "40х40 нерж+дуб"){
		//     item = {
		// 		id:  "handrailHolderBase",
		// 		amt: holderAmt,
		// 		discription: "Крепление поручня к стойкам",
		// 		unit: "banisterItemsAdd",
		// 		itemGroup: par.group,
		// 		comment: "Посчитано по штырям",
		// 		};
		// 	if(item.amt > 0) par.items.push(item);
		// 	}
	/*	
		if(par.rackType == "40х40 черн."){
		    item = {
				id:  "nut_M8",
				amt: holderAmt,
				discription: "Крепление кронштейна поручня к основанию",
				unit: "banisterItemsAdd",
				itemGroup: par.group,
				comment: "Посчитано по штырям",
				};
			if(item.amt > 0) par.items.push(item);
			}
	*/
} // end of banisterItemsAdd

//DONE;
// функция добавления позиций ригелей и их фурнитуры
function rigelItemsAdd(par) {

	var metalPaint = false;
	if(par.rigelType == "20х20 черн.") metalPaint = true;

	var itemsPar = {
		specObj: par.specObj,
		partName: "rigels",
		metalPaint: metalPaint,
		timberPaint: false,
		division: "metal",
		itemGroup: par.group,
		}
	
	par.specItems.push(itemsPar)
	
	var rigelAmt = getPartAmt("rigels", par.specObj);
	var rackAmt = getPartAmt("racks", par.specObj);
	if(params.stairModel == "П-образная с площадкой" || 
		params.stairModel == "П-образная с забегом"){
			rackAmt += getPartAmt("turnRack", par.specObj);
	}
	
	//учитываем крепление ригелей к поворотным столбам на Г-образных поворотах
	if(params.stairModel == "Г-образная с площадкой" || 
		params.stairModel == "Г-образная с забегом" ||
		params.stairModel == "П-образная трехмаршевая"){
			if(params.railingSide_1 == "внутреннее" || params.railingSide_1 == "две")
				rackAmt += 1;
			if(params.railingSide_3 == "внутреннее" || params.railingSide_3 == "две")
				rackAmt += 1;
			if(params.stairModel == "П-образная трехмаршевая" && (params.railingSide_2 == "внутреннее" || params.railingSide_2 == "две"))
				rackAmt += 1;
	}


	// расчет кол-ва фурнитуры
	

	var jointAmt = calcRailingJointAmt(); //кол-во стыков ограждения с шарнирами
	
	if(rackAmt <= 0) return;
	var rigelHolderAmt = params.rigelAmt * rackAmt;
	if(par.unit == "banister") rigelHolderAmt = params.rigelAmt_bal * rackAmt;
	var screwAmt = rigelHolderAmt;
	var rigelJointAmt = jointAmt * params.rigelAmt;
	var rigelPlugAmt = rigelAmt * 2;
	
	var rigelScrewId = "rigelScrew";	
	if(par.rigelType == "20х20 черн."){
		var rigelPlugId = "plasticPlug_20_20";
		var rigelHolderId = "no";
		screwAmt += jointAmt * params.rigelAmt; //на переломе ограждения к стойке крепятся 2 ригеля
		}
	if(par.rigelType == "Ф12 нерж."){
		var rigelPlugId = "stainlessPlug_12";
		var rigelHolderId = "rigelHolder12";
		rigelPlugAmt -= rigelJointAmt * 2;
		}
	if(par.rigelType == "Ф16 нерж."){
		var rigelPlugId = "stainlessPlug_16"
		var rigelHolderId = "rigelHolder16";
		rigelPlugAmt -= rigelJointAmt * 2;
		}
	
	
	// item = {
	// 	id: rigelPlugId,
	// 	amt: rigelPlugAmt,
	// 	discription: "Заглушки ригелей",
	// 	unit: "Ограждения",
	// 	itemGroup: par.group
	// 	};
	// if(item.amt > 0) par.items.push(item);
	
	// item = {
	// 	id: rigelScrewId,
	// 	amt: screwAmt,
	// 	discription: "Крепление ригелей к стойкам",
	// 	unit: "Ограждения",
	// 	itemGroup: par.group,
	// 	};
	// if(item.amt > 0) par.items.push(item);
	
	
	// if(par.rigelType != "20х20 черн."){
	// 	item = {
	// 		id: rigelHolderId,
	// 		amt: rigelHolderAmt,
	// 		discription: "Крепление ригелей к стойкам",
	// 		unit: "Ограждения",
	// 		itemGroup: par.group,
	// 		};
	// 	if(item.amt > 0) par.items.push(item);
		
	// }
			
} // end of rigelItemsAdd


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
	
	
		
	// var glassHolderScrewId = "glassHolderMetalScrew";
	// if(par.rackType == "40х40 нерж+дуб") glassHolderScrewId = "glassHolderTimberScrew";
	
	// item = {
	// 	id:  glassHolderScrewId,
	// 	amt: getPartAmt("glassHolder", par.specObj),
	// 	discription: "Крепление стеклодержателей",
	// 	unit: "glassItemsAdd",
	// 	itemGroup: par.group,
	// 	};
	// if(item.amt > 0) par.items.push(item);

		

} // end of glassItemsAdd


// функция добавления позиций кованых ограждений
function kovkaItemsAdd(par){
	var itemsPar = {
		specObj: par.specObj,
		partName: "forgedSection",
		metalPaint: true,
		timberPaint: false,
		division: "metal",
		itemGroup: par.group,
		}
	
	par.specItems.push(itemsPar)

	// крепление секции
	if(par.unit != "banister"){
		if(params.calcType != "mono") marshBanisterFittingsAdd(par);
	//	if(params.calcType == "mono" || params.calcType == "vint") addBalAngles(par);
	}
	if(par.unit == "banister"){
		// item = {
		// 	id:  "steelCover",
		// 	amt: getPartAmt("forgedRack", partsAmt_bal),
		// 	discription: "Крышки фланцев",
		// 	unit: "Балюстрада",
		// 	itemGroup: "Балюстрада",
		// };
		// if(item.amt > 0) par.items.push(item);
		
	}
	
} // end of kovkaItemsAdd

//DONE
// функция добавления позиций ограждений с самонесущим стеклом
function selfCarrierGlassItemsAdd(par){
		
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
	if(totalGlassSectionAmt != 0) rutelAmt = 4 * totalGlassSectionAmt + 1;
	
	if(totalGlassSectionAmt != 0){
		var rutelSize = 14;
		if(par.unit == "staircase" && params.calcType == "mono") rutelSize = 10;
		
		// if((par.unit == "staircase" || params.glassFix_bal == "рутели") && params.calcType !== 'metal'){
		// 	item = {
		// 		id:  "rutel_m" + rutelSize,
		// 		amt: rutelAmt,
		// 		discription: "Крепление стекол ограждения",
		// 		unit: "selfCarrierGlassItemsAdd",
		// 		itemGroup: par.group,
		// 	};
		// 	if(item.amt > 0) par.items.push(item);
			
		// 	item = {
		// 		id:  "rutelShims_m" + rutelSize,
		// 		amt: rutelAmt,
		// 		discription: "Крепление стекол ограждения",
		// 		unit: "selfCarrierGlassItemsAdd",
		// 		itemGroup: par.group,
		// 	};
		// 	if(item.amt > 0) par.items.push(item);

		// 	item = {
		// 		id:  "shim_M14",
		// 		amt: 2 * rutelAmt,
		// 		discription: "Крепление рутелей",
		// 		unit: "selfCarrierGlassItemsAdd",
		// 		itemGroup: par.group,
		// 	};
		// 	if(item.amt > 0) par.items.push(item);

		// 	item = {
		// 		id:  "nut_M14",
		// 		amt: 2 * rutelAmt,
		// 		discription: "Крепление рутелей",
		// 		unit: "selfCarrierGlassItemsAdd",
		// 		itemGroup: par.group,
		// 	};
		// 	if(item.amt > 0) par.items.push(item);
		// 	}
		
		// кронштейны поручней
		
		//рассчитываем параметры поручня	
		if(par.unit == "staircase"){
			var handrailPar = {
				prof: params.handrailProf,
				sideSlots: params.handrailSlots,
				handrailType: params.handrail,
				}
			}
		if(par.unit == "banister"){
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
		
		// item = {
		// 	id:  handrailPar.screwId,
		// 	amt: holderAmt * 2,
		// 	discription: "Крепление поручня к кронштейнам",
		// 	unit: "banisterItemsAdd",
		// 	itemGroup: par.group,
		// 	};
		// if(item.amt > 0) par.items.push(item);
			
	}
} // end of selfCarrierGlassItemsAdd

/** функция добавляет поручни и фурнитуру на них
*/

function handrailItemsAdd(par){
if(!par.specObj.handrails) return;

//рассчитываем параметры поручня	
	if(par.unit == "staircase"){
			var handrailPar = {
				prof: params.handrailProf,
				sideSlots: params.handrailSlots,
				handrailType: params.handrail,
				}
			if(params.calcType == "vint") handrailPar.handrailType = params.handrailMaterial;
			}
		if(par.unit == "banister"){
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


if(par.railingModel != "Кованые балясины" &&  par.railingModel != "Решетка"){
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
	

	// item = {
	// 	id:  "vint_M6x10",
	// 	amt: totalHolderAmt,
	// 	discription: "Крепление лодочки к штырю",
	// 	unit: "banisterItemsAdd",
	// 	itemGroup: par.group,
	// 	};
	// if(item.amt > 0) par.items.push(item);
	}
	
	
if(par.railingModel == "Кованые балясины" || par.railingModel == "Решетка"){
	
	var itemsPar = {
		specObj: par.specObj,
		partName: "tube12",
		metalPaint: false,
		timberPaint: false,
		division: "stock_1",
		itemGroup: par.group,
		}
	
	par.specItems.push(itemsPar)

	// item = {
	// 	id: "capNut_M6",
	// 	amt: totalHolderAmt,
	// 	discription: "Крепление поручня лестницы",
	// 	unit: "banisterItemsAdd",
	// 	itemGroup: par.group,
	// 	};
	// if(item.amt > 0) par.items.push(item);
	
	// item = {
	// 	id: "vint_M6x70",
	// 	amt: totalHolderAmt,
	// 	discription: "Крепление поручня лестницы",
	// 	unit: "banisterItemsAdd",
	// 	itemGroup: par.group,
	// 	};
	// if(item.amt > 0) par.items.push(item);
	
	// item = {
	// 	id: "shim_M6",
	// 	amt: totalHolderAmt,
	// 	discription: "Крепление поручня лестницы",
	// 	unit: "banisterItemsAdd",
	// 	itemGroup: par.group,
	// 	};
	// if(item.amt > 0) par.items.push(item);
	
	}

	//лодочки

	// item = {
	// 	id:  handrailPar.holderFlanId,
	// 	amt: totalHolderAmt,
	// 	discription: "Крепление поручня к стойкам",
	// 	unit: "banisterItemsAdd",
	// 	itemGroup: par.group,
	// 	};
	// if(item.amt > 0) par.items.push(item);
			
	// шурупы

	// item = {
	// 	id:  handrailPar.screwId,
	// 	amt: 2 * totalHolderAmt,
	// 	discription: "Крепление поручня к стойкам",
	// 	unit: "banisterItemsAdd",
	// 	itemGroup: par.group,
	// 	};
	// if(item.amt > 0) par.items.push(item);
		
	
	var handrailAmt = 0;
	if(par.specObj["handrails"]) handrailAmt = par.specObj["handrails"].amt;
		
	//заглушки

	if(handrailPar.handrailPlugId != "no"){
		// item = {
		// 	id: handrailPar.handrailPlugId,
		// 	amt: handrailAmt * 2,
		// 	discription: "Заглушка поручня",
		// 	unit: "Поручни",
		// 	itemGroup: par.group,
		// 	};
		// if(item.amt > 0) par.items.push(item);
	}
	
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
	if(par.specObj["wallHandrailHolder"]) wallHandrailHolderAmt = par.specObj["wallHandrailHolder"].amt;
	
		// item = {
		// 	id:  "screw_4x45",
		// 	amt: wallHandrailHolderAmt * 4,
		// 	discription: "Крепление поручней к стенам",
		// 	unit: "Пристенные поручни",
		// 	itemGroup: par.group,
		// 	};
		// if(item.amt > 0) par.items.push(item);
		
		// item = {
		// 	id:  handrailPar.screwId,
		// 	amt: wallHandrailHolderAmt * 2,
		// 	discription: "Крепление поручней к кронштейнам",
		// 	unit: "Пристенные поручни",
		// 	itemGroup: par.group,
		// 	};
		// if(item.amt > 0) par.items.push(item);
		
	
		
} //конец поручней

/** функция добавляет крепеж стоек ограждения к лестнице
*/
//DONE
function marshBanisterFittingsAdd(par) {

	var rackAmt = getPartAmt("racks", par.specObj);
	if(par.railingModel == "Кованые балясины" || par.railingModel == "Решетка") rackAmt = getPartAmt("forgedRack", par.specObj);
		
	if(par.rackBottom == 'сверху с крышкой') {
		if(par.unit == "staircase"){
			// item = {
			// 	id:  "screw_6x32",
			// 	amt: 4 * rackAmt,
			// 	discription: "Крепление стоек к ступеням",
			// 	unit: "banisterMountingCounting",
			// 	itemGroup: par.group,
			// 	};
			// if(item.amt > 0) par.items.push(item);
			}
			
		if(par.unit == "banister"){
			// item = {
			// 	id: "screw_6x60",
			// 	amt: balPartsParams.rackAmt * 4,
			// 	discription: "Крепление балюстрады к перекрытию",
			// 	unit: "Балюстрада",
			// 	itemGroup: par.group,
			// 	};
			// if(item.amt > 0) par.items.push(item);				
			
			
			// if(params.fixType2 != "дерево"){
			// 	item = {
			// 		id: "dowel_10x50",
			// 		amt: balPartsParams.rackAmt * 4,
			// 		discription: "Крепление балюстрады к перекрытию",
			// 		unit: "Балюстрада",
			// 		itemGroup: par.group,
			// 		};
			// 	if(item.amt > 0) par.items.push(item);				
			// 	}
			}

		// if(par.rackType == "40х40 черн." || par.railingModel == "Кованые балясины" || par.railingModel == "Решетка") {
		// 	item = {
		// 		id:  "steelCover",
		// 		amt: rackAmt,
		// 		discription: "Крепление стоек к ступеням",
		// 		unit: "banisterMountingCounting",
		// 		itemGroup: par.group,
		// 		};
		// 	if(item.amt > 0) par.items.push(item);
		// 	}

		// if(par.rackType == "40х40 нерж." || par.rackType == "40х40 нерж+дуб") {
		// 	item = {
		// 		id:  "stainlessCover",
		// 		amt: rackAmt,
		// 		discription: "Крепление стоек к ступеням",
		// 		unit: "banisterMountingCounting",
		// 		itemGroup: par.group,
		// 	};
		// 	if(item.amt > 0) par.items.push(item);
		// 	}
		}

	if(par.rackBottom == 'боковое') {
		// item = {
		// 	id:  "plasticPlug_40_40",
		// 	amt: rackAmt,
		// 	discription: "Низ стоек ограждения",
		// 	unit: "banisterMountingCounting",
		// 	itemGroup: par.group,
		// 	};
		// if(item.amt > 0) par.items.push(item);

		// item = {
		// 	id:  "banisterInnerFlange",
		// 	amt: rackAmt,
		// 	discription: "Закладная стойки ограждения",
		// 	unit: "banisterMountingCounting",
		// 	itemGroup: par.group,
		// 	};
		// if(item.amt > 0) par.items.push(item);
		}
		

		
} // end of marshBanisterFittingsAdd()

/** функция добавляет уголки балясин и крепеж для лестниц МК и винтовых
*/

function addBalAngles(par){

	//общее кол-во балясин
	var totalBalAmt = getPartAmt("bal", par.specObj);
	if(params.calcType == "mono"){
		if(params.railingModel == "Ригели" || params.railingModel == "Стекло на стойках") totalBalAmt = getPartAmt("racks", par.specObj);
		if(params.railingModel == "Кованые балясины" || params.railingModel == "Решетка") totalBalAmt = getPartAmt("forgedRack", par.specObj);

		totalBalAmt += getPartAmt("turnRack", par.specObj);

		//на первую стойку не нужна заглушка
		if(params.railingStart == 0 && params.railingSide_1 != "нет") totalBalAmt -= 1;
		
		}

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
	if(params.calcType == "mono") boltId = "bolt_M6x20";
	
	
    item = {
        id: boltId,
        amt: angleAmt,
        discription: "Крепление уголков к балясинам",
		unit: "Крепление балясины к ступени",
        itemGroup: par.group,
    };
    if(item.amt > 0) par.items.push(item);

	if(params.calcType == "vint"){
		//шайбы
		
		item = {
			id: "shim_M6",
			amt: angleAmt,
			discription: "Крепление уголков к балясинам",
			unit: "Крепление балясины к ступени",
			itemGroup: par.group,
		};
		if(item.amt > 0) par.items.push(item);

		//гайки
		
		item = {
			id: "nut_M6",
			amt: angleAmt,
			discription: "Крепление уголков к балясинам",
			unit: "Крепление балясины к ступени",
			itemGroup: par.group,
		};
		if(item.amt > 0) par.items.push(item);
	}
	
	if(params.calcType == "mono"){
		
		//резьбовые заклепки для стоек
		// item = {
		// 	id: "rivet_M6",
		// 	amt: getPartAmt("balAngle"),
		// 	discription: "Крепление уголков к стойкам",
		// 	unit: "Метизы",
		// 	itemGroup: "Ограждения",
		// 	comment: "Рассчитано по уголкам балясин",
		// 	};
		// if(item.amt > 0) par.items.push(item);
		
	}
	//заглушки
	var plugId = "plasticPlug_20_20"
	if(params.calcType == "mono") plugId = "plasticPlug_40_40"
	
    // item = {
    //     id: plugId,
    //     amt: totalBalAmt,
    //     discription: "Заглушка низа балясины",
    //     unit: "Балясины",
    //     itemGroup: par.group,
    // };
    // if(item.amt > 0) par.items.push(item);

	//шурупы крепления к ступеням
	if (params.treadsMaterial != "рифленая сталь" && params.treadsMaterial != "лотки под плитку") {

		item = {
            id: "screw_6x32",
            amt: (angleAmt-1) * 2,
            discription: "Крепление уголков к ступеням",
            unit: "Крепление балясины к ступени",
            itemGroup: par.group,
        };
        if(item.amt > 0) par.items.push(item);

		}

	//болты крепления к ступеням

	if (params.treadsMaterial == "рифленая сталь" || params.treadsMaterial == "лотки под плитку") {
		//болты

        item = {
            id: "bolt_M6x20",
            amt: (angleAmt-1) * 2,
            discription: "Крепление уголков к ступеням",
            unit: "Крепление балясины к ступени",
            itemGroup: par.group,
        };
        if(item.amt > 0) par.items.push(item);

		//шайбы

        item = {
            id: "shim_M6",
            amt: (angleAmt-1) * 2,
            discription: "Крепление уголков к ступеням",
            unit: "Крепление балясины к ступени",
            itemGroup: par.group,
        };
        if(item.amt > 0) par.items.push(item);

		//гайки

        item = {
            id: "nut_M6",
            amt: (angleAmt-1) * 2,
            discription: "Крепление уголков к ступеням",
            unit: "Крепление балясины к ступени",
            itemGroup: par.group,
        };
        if(item.amt > 0) par.items.push(item);

		}

}//end of addBalAngles

/** функция добавляет метизы крепления ступеней к каркасу
*/
function calcTreadFixMetiz(){

	var items = [];
	
	var treadPar = getTreadParams(); //функция в файле calcSpecGeneral.js
	
	if(params.stairType != "нет"){

	var fixPartAmt = getPartAmt("tread") * 4;	
	if(treadPar.fixPart == "boltMeb") fixPartAmt = getPartAmt("tread") * 6;
	if(treadPar.fixPart == "scotch") fixPartAmt = getPartAmt("tread") * 2 * params.M / 1000;
	
	item = {
		id: treadPar.fixPartId,
		amt: fixPartAmt,
		discription: "Крепление ступеней",
		unit: "Крепление ступеней",
		itemGroup: "Ступени",
		};
	if(item.amt > 0) items.push(item);

	if(treadPar.fixPart == "boltMeb"){
		// item = {
		// 	id:  "nut_M6",
		// 	amt: fixPartAmt,
		// 	discription: "Крепление ступеней",
		// 	unit: "Крепление ступеней",
		// 	itemGroup: "Ступени",
		// 	};
		// if(item.amt > 0) items.push(item);

		// item = {
		// 	id:  "shim_M6",
		// 	amt: fixPartAmt,
		// 	discription: "Крепление ступеней",
		// 	unit: "Крепление ступеней",
		// 	itemGroup: "Ступени",
		// 	};
		// if(item.amt > 0) items.push(item);
	}

//забежные ступени

	// item = {
	// 	id: treadPar.fixPartId,
	// 	amt: getPartAmt("wndTread") * 6,
	// 	discription: "Крепление забежных ступеней",
	// 	unit: "Крепление ступеней",
	// 	itemGroup: "Ступени",
	// 	};
	// if(item.amt > 0) items.push(item);

	// item = {
	// 	id: treadPar.fixPartId,
	// 	amt: getPartAmt("wndTreadMid") * 6,
	// 	discription: "Крепление забежных ступеней",
	// 	unit: "Крепление ступеней",
	// 	itemGroup: "Ступени",
	// 	};
	// if(item.amt > 0) items.push(item);
	
//пригласительные ступени

	item = {
		id: treadPar.fixPartId,
		amt: getPartAmt("startTread") * 8,
		discription: "Крепление пригласительные ступеней",
		unit: "Крепление ступеней",
		itemGroup: "Ступени",
		};
	if(item.amt > 0) items.push(item);
	
	
//подступенки

	if(params.riserType != "нет"){
		var wndTreadAmt = getPartAmt("wndTread") + getPartAmt("wndTreadMid");
		
		// item = {
		// 	id:  "screw_4x32",
		// 	amt: getPartAmt("riser") * 6 - wndTreadAmt * 3,
		// 	discription: "Крепление подступенков",
		// 	unit: "Крепление подступенков",
		// 	itemGroup: "Ступени",
		// 	};
		// if(item.amt > 0) items.push(item);
		
		// item = {
		// 	id:  "screw_4x19",
		// 	amt: wndTreadAmt * 3,
		// 	discription: "Крепление подступенков забежных рамок сверху",
		// 	unit: "Крепление подступенков",
		// 	itemGroup: "Ступени",
		// 	};
		// if(item.amt > 0) items.push(item);

	//гнутые подступенки

		item = {
			id:  "screw_3x55",
			amt: getPartAmt("riser_arc") * 4,
			discription: "Крепление гнутых подступенков снизу",
			unit: "Крепление подступенков",
			itemGroup: "Ступени",
			};
		if(item.amt > 0) items.push(item);
	}
	}
	
	return items;

}//end of addTreadFixMetiz

/** функция добавляет специфические позиции: старотвую крышку, фланцы L-образных стоек и т.п.
*/

function addMonoRacksFittings(par){

	
	if(!par.specObj.racks || par.unit != "staircase") return;
	//выцепляем кол-во стартовых и L-образных стоек
	var startRackAmt = 0;
	var LRackAmt = 0;

	for(var type in par.specObj.racks.types){
		if(type.indexOf("начальная с фланцем") != -1) startRackAmt += par.specObj.racks.types[type];
		if(type.indexOf("L-образная") != -1) LRackAmt += par.specObj.racks.types[type];
		}

	//крышка фланца первой стойки на монокосоурах

	if(par.rackType == "40х40 черн." || par.railingModel == "Кованые балясины" || par.railingModel == "Решетка") {
		// item = {
		// 	id:  "steelCover",
		// 	amt: startRackAmt,
		// 	discription: "Крышка фланца начальной стойки",
		// 	unit: "Ограждение",
		// 	itemGroup: par.group,
		// 	};
		// if(item.amt > 0) par.items.push(item);
		}

	// if(par.rackType == "40х40 нерж." || par.rackType == "40х40 нерж+дуб") {
	// 	item = {
	// 		id:  "stainlessCover",
	// 		amt: startRackAmt,
	// 		discription: "Крышка фланца начальной стойки",
	// 		unit: "Ограждение",
	// 		itemGroup: par.group,
	// 	};
	// 	if(item.amt > 0) par.items.push(item);
	// 	}
	
	//фунитура L-образных стоек
	var flanAmt = getPartAmt("lastRackFlan");
	
	// item = {
	// 	id:  "hexVint_M10x20",
	// 	amt: flanAmt * 2,
	// 	discription: "Крепление фланцев L-образных стоек",
	// 	unit: "Стойки",
	// 	itemGroup: par.group,
	// 	};
	// if(item.amt > 0) par.items.push(item);

	// item = {
	// 	id:  "banisterInnerFlange",
	// 	amt: flanAmt,
	// 	discription: "Закладная L-образной стойки",
	// 	unit: "Стойки",
	// 	itemGroup: par.group,
	// 	};
	// if(item.amt > 0) par.items.push(item);
	
	// item = {
	// 	id: "screw_6x32",
	// 	amt: flanAmt * 4,
	// 	discription: "Крепление L-образных стоек",
	// 	unit: "Стойки",
	// 	itemGroup: par.group,
  //       };
	// if(item.amt > 0) par.items.push(item);
	

	

}
