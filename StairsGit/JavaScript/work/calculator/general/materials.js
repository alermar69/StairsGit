var materials = {};

function createMaterialsList(){
	
	//if(!materials) var materials = {}; 
//листы

	materials.sheet1 = {
		name: "Лист черн. 1мм",
		dept: "metal",
		amtName: "м2",
		amt: 0,
		}
	
	materials.sheet2 = {
		name: "Лист черн. 2мм",
		dept: "metal",
		amtName: "м2",
		amt: 0,
		}
	
	materials.sheetRef = {
		name: "Лист рифленый черн. 4мм",
		dept: "metal",
		amtName: "м2",
		amt: 0,
		}
		
	materials.sheet4 = {
		name: "Лист черн. 4мм",
		dept: "metal",
		amtName: "м2",
		amt: 0,
		}
	
	materials.sheet8 = {
		name: "Лист черн. 8мм",
		dept: "metal",
		amtName: "м2",
		amt: 0,
		}
	
	materials.sheetRefAl = {
		name: "Лист рифленый алюм. 3мм",
		dept: "metal",
		amtName: "м2",
		amt: 0,
		}
		
//профиль

	materials.prof_20_20 = {
		name: "Проф. труба черн. 20х20",
		dept: "metal",
		amtName: "м.п.",
		amt: 0,
		}
		
	materials.prof_40_20 = {
		name: "Проф. труба черн. 40х20",
		dept: "metal",
		amtName: "м.п.",
		amt: 0,
		}
	
	materials.prof_40_40 = {
		name: "Проф. труба черн. 40х40",
		dept: "metal",
		amtName: "м.п.",
		amt: 0,
		}
		
	materials.prof_60_30 = {
		name: "Проф. труба черн. 60х30",
		dept: "metal",
		amtName: "м.п.",
		amt: 0,
		}
	
	materials.prof_100_50 = {
		name: "Проф. труба черн. 100х50",
		dept: "metal",
		amtName: "м.п.",
		amt: 0,
		}
	
	materials.prof_100_100 = {
		name: "Проф. труба черн. 100х100",
		dept: "metal",
		amtName: "м.п.",
		amt: 0,
		}
	
	materials.pipe_127 = {
		name: "Труба круглая Ф127",
		dept: "metal",
		amtName: "м.п.",
		amt: 0,
		}
	
	materials.profInox_20_20 = {
		name: "Проф. труба нерж. 20х20",
		dept: "metal",
		amtName: "м.п.",
		amt: 0,
		}
		
	materials.profInox_40_20 = {
		name: "Проф. труба нерж. 40х20",
		dept: "metal",
		amtName: "м.п.",
		amt: 0,
		}
	
	materials.profInox_40_40 = {
		name: "Проф. труба нерж. 40х40",
		dept: "metal",
		amtName: "м.п.",
		amt: 0,
		}
	
	materials.pipeInox_12 = {
		name: "Труба круглая нерж. Ф12",
		dept: "metal",
		amtName: "м.п.",
		amt: 0,
		}
		
	materials.pipeInox_12 = {
		name: "Труба круглая нерж. Ф16",
		dept: "metal",
		amtName: "м.п.",
		amt: 0,
		}
		
	materials.rebar = {
		name: "Арматура Ф20",
		dept: "metal",
		amtName: "м.п.",
		amt: 0,
		}
	
	materials.stripe_40 = {
		name: "Полоса черн. 40х4",
		dept: "metal",
		amtName: "м.п.",
		amt: 0,
		}
	

//щит
	materials.panelPine_20 = {
		name: "Щит сосна 20мм",
		dept: "timber",
		amtName: "м2",
		amt: 0,
		}
	
	materials.panelPine_40 = {
		name: "Щит сосна 40мм",
		dept: "timber",
		amtName: "м2",
		amt: 0,
		}
		
	materials.panelPinePremium_20 = {
		name: "Щит сосна экстра 20мм",
		dept: "timber",
		amtName: "м2",
		amt: 0,
		}
	
	materials.panelPinePremium_40 = {
		name: "Щит сосна экстра 40мм",
		dept: "timber",
		amtName: "м2",
		amt: 0,
		}
	
	materials.panelBirch_20 = {
		name: "Щит береза сращ. 20мм",
		dept: "timber",
		amtName: "м2",
		amt: 0,
		}
	
	materials.panelBirch_40 = {
		name: "Щит береза сращ. 40мм",
		dept: "timber",
		amtName: "м2",
		amt: 0,
		}
		
	materials.panelLarch_20 = {
		name: "Щит лиственница сращ. 20мм",
		dept: "timber",
		amtName: "м2",
		amt: 0,
		}
	
	materials.panelLarch_40 = {
		name: "Щит лиственница сращ. 40мм", 
		dept: "timber",
		amtName: "м2",
		amt: 0,
		}
	materials.panelLarchPremium_20 = {
		name: "Щит лиственница цельноламельный 20мм",
		dept: "timber",
		amtName: "м2",
		amt: 0,
		}
	
	materials.panelLarchPremium_40 = {
		name: "Щит лиственница цельноламельный 40мм", 
		dept: "timber",
		amtName: "м2",
		amt: 0,
		}
	
	materials.panelOak_20 = {
		name: "Щит дуб сращ. 20мм",
		dept: "timber",
		amtName: "м2",
		amt: 0,
		}
	
	materials.panelOak_40 = {
		name: "Щит дуб сращ. 40мм",
		dept: "timber",
		amtName: "м2",
		amt: 0,
		}
	
	materials.panelOakPremium_20 = {
		name: "Щит дуб цельноламельный 20мм",
		dept: "timber",
		amtName: "м2",
		amt: 0,
		}
	
	materials.panelOakPremium_40 = {
		name: "Щит дуб цельноламельный 40мм",
		dept: "timber",
		amtName: "м2",
		amt: 0,
		}
//	
	materials.slabOak_50 = {
		name: "Слэб дуб",
		dept: "timber",
		amtName: "м2",
		amt: 0,
	}
	
	materials.slabElm_50 = {
		name: "Слэб карагач",
		dept: "timber",
		amtName: "м2",
		amt: 0,
	}
	materials.veneer = {
		name: "Шпон",
		dept: "timber",
		amtName: "м2",
		amt: 0,
	}
	
	materials.dpc = {
		name: "Доска ДПК",
		dept: "timber",
		amtName: "м2",
		amt: 0,
		}
	
	materials.larchBoard = {
		name: "Доска террасная лиственница",
		dept: "timber",
		amtName: "м2",
		amt: 0,
	}
		
	
		
	materials.panelMDF18 = {
		name: "МДФ 18мм",
		dept: "timber",
		amtName: "м2",
		amt: 0,
		}
		
	materials.panelMDF4 = {
		name: "МДФ ламинированная белая 4мм",
		dept: "timber",
		amtName: "м2",
		amt: 0,
		}
		
	materials.panelLDSP16 = {
		name: "ЛДСП ламинированная 16мм",
		dept: "timber",
		amtName: "м2",
		amt: 0,
	}
		
	materials.pressTreads = {
		name: "Ступени из пресснастила",
		dept: "metal",
		amtName: "м2",
		amt: 0,
		}
		
	materials.glassTreads = {
		name: "Ступени стеклянные",
		dept: "metal",
		amtName: "м2",
		amt: 0,
		}
		
	materials.glass8 = {
		name: "Стекло закаленное 8мм",
		dept: "metal",
		amtName: "м2",
		amt: 0,
		}
		
	materials.glass12 = {
		name: "Стекло закаленное 12мм",
		dept: "metal",
		amtName: "м2",
		amt: 0,
	}
		
		
	//ЛКМ
	materials.primer = {
		name: "Грунт",
		dept: "timber",
		amtName: "кг",
		amt: 0,
	}
	
	materials.lacquer = {
		name: "Лак",
		dept: "timber",
		amtName: "кг",
		amt: 0,
	}
	
	materials.oil = {
		name: "Масло",
		dept: "timber",
		amtName: "кг",
		amt: 0,
	}
	

	//морилка
	var ignorOptions = [
		"не указано",
		"нет",
		"без морилки",
	];
	$("#treadsColor option").each(function(){
		if(ignorOptions.indexOf($(this).attr('value')) == -1){
			materials[$(this).attr('value')] = {
				name: "Морилка " + $(this).attr('value'),
				dept: "timber",
				amtName: "кг",
				amt: 0,
			}
		}
	});
		
//детали ограждений
/*
	кованый полукруглый
	
	*/
	
	return materials;
	
}

/** функция выводит на страницу потребность в материалах. Если не передан массив данных,
используется глобальный массив materials
*/

function printMaterialsNeed(par){
	
	
	if(!par) par = {};
	if(par.list) var list = par.list;
	else var list = materials;
	
	
	var tableBody = "";
	for(var mat in list){
		if(list[mat]["amt"] != 0){
			tableBody += "<tr><td style='min-width: 200px'>" + list[mat]["name"] + "</td>" + 
				"<td>" + list[mat]["amtName"] + "</td>" + 
				"<td>" + Math.round(list[mat]["amt"]*10)/10 + "</td>" + 
				"</tr>";				
			}
		}
	
	var tableText =  
		"<table class='tab_2' id='materialsTable'>" + 
		"<thead><tr><th>Наименование</th><th>ед.изм.</th><th>кол-во</th></tr></thead>" +
		"<tbody>" + tableBody + "</tbody></table><br/>";
	if(!par.noPrint){
		tableText += "<b>Внимание!</b> <br/>Расход материала рассчитан без учета раскладки деталей на листе и обрезков. Стандартные комплектующие (метизы, уголки и т.п.) не включены в данную таблицу."
		tableText = '<h3 class="raschet">Приблизительный расход материала</h3>' + tableText;
		$("#materialNeed").html(tableText);
	}
	
	par.text = tableText;
	
	return par;
	
}//end of printMaterialsNeeds
