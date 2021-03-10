var materials = {};

function createMaterialsList(materialsArr) {
	if (!materialsArr) materialsArr = materials;

	materialsArr.sheet1 = {
		name: "Лист черн. 1мм",
		dept: "metal",
		amtName: "м2",
	}

	materialsArr.sheet2 = {
		name: "Лист черн. 2мм",
		dept: "metal",
		amtName: "м2",
	}

	materialsArr.sheetRef = {
		name: "Лист рифленый черн. 4мм",
		dept: "metal",
		amtName: "м2",
	}

	materialsArr.sheet4 = {
		name: "Лист черн. 4мм",
		dept: "metal",
		amtName: "м2",
	}

	materialsArr.sheet8 = {
		name: "Лист черн. 8мм",
		dept: "metal",
		amtName: "м2",
	}

	materialsArr.sheetRefAl = {
		name: "Лист рифленый алюм. 3мм",
		dept: "metal",
		amtName: "м2",
	}

	//профиль

	materialsArr.prof_20_20 = {
		name: "Проф. труба черн. 20х20",
		dept: "metal",
		amtName: "м.п.",
	}

	materialsArr.prof_40_20 = {
		name: "Проф. труба черн. 40х20",
		dept: "metal",
		amtName: "м.п.",
	}

	materialsArr.prof_40_40 = {
		name: "Проф. труба черн. 40х40",
		dept: "metal",
		amtName: "м.п.",
	}

	materialsArr.prof_60_30 = {
		name: "Проф. труба черн. 60х30",
		dept: "metal",
		amtName: "м.п.",
	}

	materialsArr.prof_60_40 = {
		name: "Проф. труба черн. 60х40",
		dept: "metal",
		amtName: "м.п.",
	}

	materialsArr.prof_80_40 = {
		name: "Проф. труба черн. 80х40",
		dept: "metal",
		amtName: "м.п.",
	}

	materialsArr.prof_60_60 = {
		name: "Проф. труба черн. 60х60",
		dept: "metal",
		amtName: "м.п.",
	}

	materialsArr.prof_100_50 = {
		name: "Проф. труба черн. 100х50",
		dept: "metal",
		amtName: "м.п.",
	}

	materialsArr.prof_100_100 = {
		name: "Проф. труба черн. 100х100",
		dept: "metal",
		amtName: "м.п.",
	}

	materialsArr.prof_120_120 = {
		name: "Проф. труба черн. 120х120",
		dept: "metal",
		amtName: "м.п.",
	}

	materialsArr.prof_200_100 = {
		name: "Проф. труба черн. 200х100",
		dept: "metal",
		amtName: "м.п.",
	}

	materialsArr.pipe_127 = {
		name: "Труба круглая Ф127",
		dept: "metal",
		amtName: "м.п.",
	}

	materialsArr.profInox_20_20 = {
		name: "Проф. труба нерж. 20х20",
		dept: "metal",
		amtName: "м.п.",
	}

	materialsArr.profInox_40_20 = {
		name: "Проф. труба нерж. 40х20",
		dept: "metal",
		amtName: "м.п.",
	}

	materialsArr.profInox_40_40 = {
		name: "Проф. труба нерж. 40х40",
		dept: "metal",
		amtName: "м.п.",
	}

	materialsArr.pipeInox_12 = {
		name: "Труба круглая нерж. Ф12",
		dept: "metal",
		amtName: "м.п.",
	}

	materialsArr.pipeInox_12 = {
		name: "Труба круглая нерж. Ф16",
		dept: "metal",
		amtName: "м.п.",
	}

	materialsArr.rebar = {
		name: "Арматура Ф20",
		dept: "metal",
		amtName: "м.п.",
	}

	materialsArr.stripe_40 = {
		name: "Полоса черн. 40х4",
		dept: "metal",
		amtName: "м.п.",
	}


	//щит
	materialsArr.panelPine_20 = {
		name: "Щит сосна 20мм",
		dept: "timber",
		amtName: "м2",
	}

	materialsArr.panelPine_40 = {
		name: "Щит сосна 40мм",
		dept: "timber",
		amtName: "м2",
	}

	materialsArr.panelPinePremium_20 = {
		name: "Щит сосна экстра 20мм",
		dept: "timber",
		amtName: "м2",
	}

	materialsArr.panelPinePremium_40 = {
		name: "Щит сосна экстра 40мм",
		dept: "timber",
		amtName: "м2",
	}

	materialsArr.panelBirch_20 = {
		name: "Щит береза сращ. 20мм",
		dept: "timber",
		amtName: "м2",
	}

	materialsArr.panelBirch_40 = {
		name: "Щит береза сращ. 40мм",
		dept: "timber",
		amtName: "м2",
	}

	materialsArr.panelLarch_20 = {
		name: "Щит лиственница сращ. 20мм",
		dept: "timber",
		amtName: "м2",
	}

	materialsArr.panelLarch_40 = {
		name: "Щит лиственница сращ. 40мм",
		dept: "timber",
		amtName: "м2",
	}
	materialsArr.panelLarchPremium_20 = {
		name: "Щит лиственница цельноламельный 20мм",
		dept: "timber",
		amtName: "м2",
	}

	materialsArr.panelLarchPremium_40 = {
		name: "Щит лиственница цельноламельный 40мм",
		dept: "timber",
		amtName: "м2",
	}

	materialsArr.panelOak_20 = {
		name: "Щит дуб сращ. 20мм",
		dept: "timber",
		amtName: "м2",
	}

	materialsArr.panelOak_40 = {
		name: "Щит дуб сращ. 40мм",
		dept: "timber",
		amtName: "м2",
	}

	materialsArr.panelOakPremium_20 = {
		name: "Щит дуб цельноламельный 20мм",
		dept: "timber",
		amtName: "м2",
	}

	materialsArr.panelOakPremium_40 = {
		name: "Щит дуб цельноламельный 40мм",
		dept: "timber",
		amtName: "м2",
	}
	
		materialsArr.panelAsh_20 = {
		name: "Щит ясень сращ. 20мм",
		dept: "timber",
		amtName: "м2",
	}

	materialsArr.panelAsh_40 = {
		name: "Щит ясень сращ. 40мм",
		dept: "timber",
		amtName: "м2",
	}

	materialsArr.panelAshPremium_20 = {
		name: "Щит ясень цельноламельный 20мм",
		dept: "timber",
		amtName: "м2",
	}

	materialsArr.panelAshPremium_40 = {
		name: "Щит ясень цельноламельный 40мм",
		dept: "timber",
		amtName: "м2",
	}
	
	//	
	materialsArr.slabOak_50 = {
		name: "Слэб дуб",
		dept: "timber",
		amtName: "м2",
	}

	materialsArr.slabElm_50 = {
		name: "Слэб карагач",
		dept: "timber",
		amtName: "м2",
	}
	materialsArr.slab = {
		name: "Слэб",
		dept: "timber",
		amtName: "шт",
	}
	materialsArr.veneer = {
		name: "Шпон",
		dept: "timber",
		amtName: "м2",
	}

	materialsArr.dpc = {
		name: "Доска ДПК",
		dept: "timber",
		amtName: "м2",
	}

	materialsArr.larchBoard = {
		name: "Доска террасная лиственница",
		dept: "timber",
		amtName: "м2",
	}



	materialsArr.panelMDF18 = {
		name: "МДФ 18мм",
		dept: "timber",
		amtName: "м2",
	}

	materialsArr.panelMDF4 = {
		name: "МДФ ламинированная белая 4мм",
		dept: "timber",
		amtName: "м2",
	}

	materialsArr.panelLDSP16 = {
		name: "ЛДСП ламинированная 16мм",
		dept: "timber",
		amtName: "м2",
	}

	materialsArr.pressTreads = {
		name: "Ступени из пресснастила",
		dept: "metal",
		amtName: "м2",
	}

	materialsArr.glassTreads = {
		name: "Ступени стеклянные",
		dept: "metal",
		amtName: "м2",
	}

	materialsArr.glass8 = {
		name: "Стекло закаленное 8мм",
		dept: "metal",
		amtName: "м2",
	}

	materialsArr.glass12 = {
		name: "Стекло закаленное 12мм",
		dept: "metal",
		amtName: "м2",
	}


	//ЛКМ
	materialsArr.primer = {
		name: "Грунт",
		dept: "timber",
		amtName: "кг",
	}

	materialsArr.lacquer = {
		name: "Лак",
		dept: "timber",
		amtName: "кг",
	}

	materialsArr.oil = {
		name: "Масло",
		dept: "timber",
		amtName: "кг",
	}
	
	materialsArr.resin = {
		name: "Смола",
		dept: "timber",
		amtName: "л",
	}

	var ignorOptions = [
		"не указано",
		"нет",
		"без морилки",
	];

	// Порошковая краска
	$("#carcasColor option").each(function () {
		if (ignorOptions.indexOf($(this).attr('value')) == -1) {
			materialsArr[$(this).attr('value')] = {
				name: "Порошковая краска " + $(this).attr('value'),
				dept: "metal",
				amtName: "кг",
			}
		}
	});
	//морилка
	$("#treadsColor option.lakColor").each(function () {
		if (ignorOptions.indexOf($(this).attr('value')) == -1) {
			materialsArr[$(this).attr('value')] = {
				name: "Морилка " + $(this).attr('value'),
				dept: "timber",
				amtName: "кг",
			}
		}
	});
	//Масло
	$("#treadsColor option.oilColor").each(function () {
		if (ignorOptions.indexOf($(this).attr('value')) == -1) {
			materialsArr[$(this).attr('value')] = {
				name: "Масло " + $(this).attr('value'),
				dept: "timber",
				amtName: "кг",
			}
		}
	});
	// Кованные балясины
	$("#banister1 option").each(function () {
		if (ignorOptions.indexOf($(this).attr('value')) == -1) {
			materialsArr[$(this).attr('value')] = {
				name: "Кованная балясина " + $(this).html(),
				dept: "metal",
				amtName: "шт",
			}
		}
	});

	//детали ограждений
	/*
		кованый полукруглый
		
		*/

	return materialsArr;
}

/** функция выводит на страницу потребность в материалах. Если не передан массив данных,
используется глобальный массив materials
*/

function printMaterialsNeed(par) {
	if (!par) par = {};
	if (par.list) var list = par.list;
	else var list = materials;

	var tableBody = "";
	for (var mat in list) {
		if (list[mat]["amt"]) {
			tableBody += "<tr><td style='min-width: 200px'>" + list[mat]["name"] + "</td>" +
				"<td>" + list[mat]["amtName"] + "</td>" +
				"<td>" + Math.round(list[mat]["amt"] * 10) / 10 + "</td>" +
				"</tr>";
		}
	}

	var tableText =
		"<table class='tab_2' id='materialsTable'>" +
		"<thead><tr><th>Наименование</th><th>ед.изм.</th><th>кол-во</th></tr></thead>" +
		"<tbody>" + tableBody + "</tbody></table><br/>";
	if (!par.noPrint) {
		tableText += "<b>Внимание!</b> <br/>Расход материала рассчитан без учета раскладки деталей на листе и обрезков. Стандартные комплектующие (метизы, уголки и т.п.) не включены в данную таблицу."
		tableText = '<h3 class="raschet">Приблизительный расход материала</h3>' + tableText;
		$("#materialNeed").html(tableText);
	}

	par.text = tableText;

	return par;

} //end of printMaterialsNeeds

function calculatePrintMaterials(){
	var carcasMetalPaintAmt = 0;
	var railingMetalPaintAmt = 0;
	var riserPaintArea = 0;
	var treadsPaintArea = 0;
	$.each(materials, function(){
		if (this.dept == "metal" && this.amt > 0) {
			var mat = this;
			$.each(this.itemTypes, function(itemType){
				var area = this.amt;
				if (mat.amtName != 'м2') area = this.area || 0;
				if (itemType == 'carcas') carcasMetalPaintAmt += area;
				if (itemType == 'railing') railingMetalPaintAmt += area;
			})
		}
		if (this.dept == "timber" && this.amt > 0) {
			var mat = this;
			$.each(this.itemTypes, function(itemType){
				var area = this.amt;
				if (mat.amtName != 'м2') area = this.area;
				if (itemType == 'risers') riserPaintArea += area;
				if (itemType == 'treads') treadsPaintArea += area;
			})
		}
	});
	
	if (params.metalPaint == 'порошок') {
		addMaterialNeed({id: params.carcasColor, amt: (carcasMetalPaintAmt * 100) / 1000});
	}
	if (params.metalPaint_railing == 'порошок') {
		addMaterialNeed({id: params.metalBalColor, amt: (railingMetalPaintAmt * 100) / 1000});
	}
	
	// Расчет покраски для ступеней
	if (treadsPaintArea > 0) calculateTimberPaint('treads', treadsPaintArea);
	if (riserPaintArea > 0) calculateTimberPaint('risers', riserPaintArea);
}

/**
 * Добавляет информацию о покраске
 * @param itemType 
 * @param area 
 */
function calculateTimberPaint(itemType, area){
	if (params.timberPaint == 'лак') {
		addMaterialNeed({id: 'lacquer', amt: (area * 100) / 1000});
	}
	if (params.timberPaint == 'морилка+лак') {
		addMaterialNeed({id: 'primer', amt: (area * 100) / 1000});
		addMaterialNeed({id: 'lacquer', amt: (area * 100) / 1000});
		if ($('#' + itemType + 'Color').val() != 'не указано' && $('#' + itemType + 'Color').val() != 'нет') addMaterialNeed({id: $('#' + itemType + 'Color').val(), amt: (area * 100) / 1000});
	}
	if (params.timberPaint == 'масло') {
		addMaterialNeed({id: 'oil', amt: (area * 100) / 1000});
	}
	
	if (params.timberPaint == 'цветное масло') {
		addMaterialNeed({id: 'oil', amt: (area * 100) / 1000});
		if ($('#' + itemType + 'Color').val() != 'не указано' && $('#' + itemType + 'Color').val() != 'нет') addMaterialNeed({id: $('#' + itemType + 'Color').val(), amt: (area * 100) / 1000});
	}
}

function addMaterialNeed(par) {
	var materialsArr = materials;
	if (!materialsArr[par.id]) {
		materialsArr[par.id] = {
			name: par.id,
			dept: "metal",
			amtName: "ед.",
		}
	}
	if (!materialsArr[par.id].amt) materialsArr[par.id].amt = 0;
	if (!materialsArr[par.id].area) materialsArr[par.id].area = 0;
	materialsArr[par.id].amt += par.amt;
	if (par.area) materialsArr[par.id].area += par.area;

	if (par.itemType) {
		if (!materialsArr[par.id].itemTypes) materialsArr[par.id].itemTypes = {};
		if (!materialsArr[par.id].itemTypes[par.itemType]) materialsArr[par.id].itemTypes[par.itemType] = {
			amt: 0,
			area: 0
		};
		materialsArr[par.id].itemTypes[par.itemType].amt += par.amt;
		if (par.area) materialsArr[par.id].itemTypes[par.itemType].area += par.area;
	}
}