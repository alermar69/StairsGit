function createPartsList_vl() {

	var list = {
		addItem: addItem, //функция в файле /manufacturing/general/calc_spec/calcSpec.js
		addSpecObjItems: addSpecObjItems, //функция в файле /manufacturing/general/calc_spec/calcSpec.js
	};

	//общие позиции для всех лестницы
	addGeneralItems(list); //функция в файле /calculator/general/calcSpec.js

	list.fixSpacer1 = {
		name: "Проставка " + params.fixSpacer1 + " L=" + params.fixSpacerLength1 + "мм",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "metal",
		items: [],
	};

	list.fixSpacer2 = {
		name: "Проставка " + params.fixSpacer2 + " L=" + params.fixSpacerLength2 + "мм",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "metal",
		items: [],
	};

	list.fixSpacer3 = {
		name: "Проставка " + params.fixSpacer3 + " L=" + (params.fixSpacerLength3 + params.wallDist) + "мм",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "metal",
		items: [],
	};

	list.fixSpacer4 = {
		name: "Проставка " + params.fixSpacer4 + " L=" + (params.fixSpacerLength4 + params.wallDist) + "мм",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "metal",
		items: [],
	};

	list.fixSpacer5 = {
		name: "Проставка " + params.fixSpacer5 + " L=" + (params.fixSpacerLength5 + params.wallDist) + "мм",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "metal",
		items: [],
	};

	list.fixSpacer6 = {
		name: "Проставка " + params.fixSpacer6 + " L=" + (params.fixSpacerLength6 + params.wallDist) + "мм",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "metal",
		items: [],
	};

	//Фланец крепления к перекрытию 
	list.fk15_flange = {
		name: "Фланец крепления к верхнему перекрытию ФК-15", //"Фланец крепления к верхнему перекрытию",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "metal",
		items: [],
	};


	/** ДЕТАЛИ ГОТОВОЙ ЛЕСТНИЦЫ **/


	//тетивы боковые

	list.stringer_side_2 = {
		name: "Тетива Т-180-2 бок (комплект 2 шт)",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
	};

	list.stringer_side_3 = {
		name: "Тетива Т-180-3 бок (комплект 2 шт)",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
	};

	list.stringer_side_4 = {
		name: "Тетива Т-180-4 бок (комплект 2 шт)",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
	};

	list.stringer_side_5 = {
		name: "Тетива Т-180-5 бок (комплект 2 шт)",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
	};

	list.stringer_side_6 = {
		name: "Тетива Т-180-6 бок (комплект 2 шт)",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
	};

	//тетивы средние

	list.stringer_mid_2 = {
		name: "Тетива Т-180-2 сред",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
	};

	list.stringer_mid_3 = {
		name: "Тетива Т-180-3 сред",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
	};

	list.stringer_mid_4 = {
		name: "Тетива Т-180-4 сред",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
	};

	list.stringer_mid_5 = {
		name: "Тетива Т-180-5 сред",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
	};

	list.stringer_mid_6 = {
		name: "Тетива Т-180-6 сред",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
	};

	list.frame_1000 = {
		name: "Рамка под ДПК 1000мм",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
	};
	list.frame_600 = {
		name: "Рамка под ДПК 600мм",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
	};
	list.frame_800 = {
		name: "Рамка под ДПК 800мм",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
	};

	var stairAmt = params.stairAmt1;
	if (params.platformTop == "площадка") stairAmt = params.stairAmt1 + 1;

	var columnName = "Опора площадки  A=960 (6 ступ.)";
	if (stairAmt == 2) columnName = "Опора площадки  A=240 (2 ступ.)";
	if (stairAmt == 3) columnName = "Опора площадки  A=420 (3 ступ.)";
	if (stairAmt == 4) columnName = "Опора площадки  A=600 (4 ступ.)";
	if (stairAmt == 5) columnName = "Опора площадки  A=780 (5 ступ.)";
	list.column = {
		name: columnName,
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
		comment: "длина с запасом 100мм. Подрезать на монтаже по месту",
	};

	list.plate_165_300 = {
		name: "Пластина 165х300 краш.",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
	};
	list.plate_165_600 = {
		name: "Пластина 165х600 краш.",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
	};
	list.plate_165_900 = {
		name: "Пластина 165х900 краш.",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
	};


	list.plate_190_300 = {
		name: "Пластина 190х300 краш. (комплект 2шт)",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
		comment: "Боковая пластина площадки",
	};
	list.plate_190_600 = {
		name: "Пластина 190х600 краш. (комплект 2шт)",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
		comment: "боковая пластина площадки",
	};
	list.plate_190_900 = {
		name: "Пластина 190х900 краш. (комплект 2шт)",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
		comment: "боковая пластина площадки",
	};
	list.rearStringer = {
		name: "Задняя тетива площадки",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "metal",
		items: [],
		comment: "изготавливается на заказ",
	};

	list.botRegLeg = {
		name: "Регулируемая опора краш.",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
	};
	list.connectorFlan8 = {
		name: "Соед. фланец 8 мм.",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
	};




	//детили ограждений

	var handrailPaint = true;
	if (params.handrail == "Ф50 нерж.") handrailPaint = false;

	list.handrail_marsh = {
		name: "Поручень " + params.handrail,
		amtName: "шт.",
		metalPaint: handrailPaint,
		timberPaint: false,
		division: "metal",
		items: [],
		comment: "марш",
	};
	list.handrail_plt3 = {
		name: "Поручень " + params.handrail,
		amtName: "шт.",
		metalPaint: handrailPaint,
		timberPaint: false,
		division: "metal",
		items: [],
		comment: "площадка боковое",
	};
	list.handrail_plt5 = {
		name: "Поручень " + params.handrail,
		amtName: "шт.",
		metalPaint: handrailPaint,
		timberPaint: false,
		division: "metal",
		items: [],
		comment: "площадка заднее",
	};

	var rigelPaint = true;
	if (params.rigelMaterial == "Ф12 нерж.") rigelPaint = false;

	list.rigel_marsh = {
		name: "Ригель " + params.rigelMaterial,
		amtName: "шт.",
		metalPaint: rigelPaint,
		timberPaint: false,
		division: "metal",
		items: [],
		comment: "марш",
	};
	list.rigel_plt3 = {
		name: "Ригель " + params.rigelMaterial,
		amtName: "шт.",
		metalPaint: rigelPaint,
		timberPaint: false,
		division: "metal",
		items: [],
		comment: "площадка боковое",
	};


	list.rigel_plt5 = {
		name: "Ригель " + params.rigelMaterial,
		amtName: "шт.",
		metalPaint: rigelPaint,
		timberPaint: false,
		division: "metal",
		items: [],
		comment: "площадка заднее",
	};

	//Копируем объекты для марша с площадкой
	list.handrail_marsh_with_plt = {
		name: "Поручень " + params.handrail,
		amtName: "шт.",
		metalPaint: handrailPaint,
		timberPaint: false,
		division: "metal",
		items: [],
		comment: "марш",
	};
	list.rigel_marsh_with_plt = {
		name: "Ригель " + params.rigelMaterial,
		amtName: "шт.",
		metalPaint: rigelPaint,
		timberPaint: false,
		division: "metal",
		items: [],
		comment: "марш",
	};

	if (stairAmt == 2) {
		list.handrail_marsh.name += " L=620мм";
		list.rigel_marsh.name += " L=420мм";
	}

	if (stairAmt == 3) {
		if (params.handrail != "Ф50 нерж.") list.handrail_marsh.name += " L=775мм";
		if (params.handrail == "Ф50 нерж.") list.handrail_marsh.name += " L=773мм";
		if (params.rigelMaterial != "Ф12 нерж.") list.rigel_marsh.name += " L=722мм";
		if (params.rigelMaterial == "Ф12 нерж.") list.rigel_marsh.name += " L=720мм";

		list.handrail_marsh_with_plt.name += " L=807мм";
		list.rigel_marsh_with_plt.name += " L=692мм";
	}
	if (stairAmt == 4) {
		list.handrail_marsh.name += " L=1092мм";
		list.rigel_marsh.name += " L=1039мм";

		list.handrail_marsh_with_plt.name += " L=1123мм";
		list.rigel_marsh_with_plt.name += " L=1009мм";
	}
	if (stairAmt == 5) {
		if (params.handrail != "ПВХ") list.handrail_marsh.name += " L=1408мм";
		if (params.handrail == "ПВХ") list.handrail_marsh.name += " L=1406мм";
		list.rigel_marsh.name += " L=1355мм";

		list.handrail_marsh_with_plt.name += " L=1439мм";
		list.rigel_marsh_with_plt.name += " L=1325мм";
	}
	if (stairAmt == 6) {
		if (params.handrail != "ПВХ") list.handrail_marsh.name += " L=1724мм";
		if (params.handrail == "ПВХ") list.handrail_marsh.name += " L=1952мм";
		list.rigel_marsh.name += " L=1671мм";
	}

	if (params.topPltLength_stock == 600) {
		list.handrail_plt3.name += " L=314мм";
		list.rigel_plt3.name += " L=360мм";
	}
	if (params.topPltLength_stock == 900) {
		list.handrail_plt3.name += " L=614мм";
		list.rigel_plt3.name += " L=660мм";
	}
	if (params.topPltLength_stock == 1200) {
		list.handrail_plt3.name += " L=980мм";
		list.rigel_plt3.name += " L=1050мм";
	}

	list.rack = {
		name: "Стойка краш. 950 мм. 40х40 бок. крепление",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
		comment: "стойка ограждения марша",
	};

	if (params.staircaseType == "На заказ") {
		list.rack = {
			name: "Стойка черн. L=950 мм. 40х40 бок. крепление",
			amtName: "шт.",
			metalPaint: true,
			timberPaint: false,
			division: "metal",
			items: [],
			comment: "стойка ограждения марша",
		};
	}

	list.rackInox = {
		name: "Стойка нерж. 950 мм. 40х40 бок. крепление 304",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
		comment: "стойка ограждения марша",
	};

	list.rack_plt = {
		name: "Стойка краш. 1000 мм. 40х40 бок. крепление",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
		comment: "стойка ограждения площадки",
	};
	list.rackInox_plt = {
		name: "Стойка нерж. 40х40 бок. крепление 1000мм AISI304",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
		comment: "стойка ограждения площадки",
	};

	list.handrailConnector = {
		name: 'Соед. пластина поручня 40х60', //"Соединительная пластина поручня",
		amtName: "шт.",
		metalPaint: true,
		timberPaint: false,
		division: "stock_2",
		items: [],
	};
	if (params.handrail == "ПВХ") {
		list.handrailConnector.name = "Шарнир внешн. под ПВХ Ф50";
	}






	//террасная доска

	var treadWidth = params.dpcWidth;
	var treadName = "Ступень " + (params.M - 22) + "x" + treadWidth + "x" + params.treadThickness;
	var pltName = "Ступень " + (params.platformWidth_3 - 22) + "x" + treadWidth + "x" + params.treadThickness;

	list.decking = {
		name: treadName,
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "timber",
		items: [],
	};

	list.deckingTopPlt = {
		name: pltName,
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "timber",
		items: [],
	};

	list.deckingCutedMidPlt = {
		name: treadName + " резаная по длине",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "timber",
		items: [],
	};

	list.deckingCutedTopPlt = {
		name: pltName + " резаная по длине",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "timber",
		items: [],
	};

	list.timberBoard = {
		name: treadName,
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "timber",
		items: [],
	};

	list.timberBoardTopPlt = {
		name: pltName,
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "timber",
		items: [],
	};

	list.timberBoardCutedMidPlt = {
		name: treadName + " резаная по длине",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "timber",
		items: [],
	};

	list.timberBoardCutedTopPlt = {
		name: treadName + " резаная по длине",
		amtName: "шт.",
		metalPaint: false,
		timberPaint: false,
		division: "timber",
		items: [],
	};


	return list;


} //end of createPartsList_vl



//Расчет параметров ограждений

function calcRailingParams() {
	var marshBalAmt1 = 0; //балясины первого марша
	var marshBalAmt3 = 0; //балясины третьего марша
	var cornerBalAmt = 0; //угловые балясины
	var pltBalAmt = 0; //L - образные стойки на угол площадки
	var handrailAmt = 0;
	var handrailHolderAmt = 0;
	var handrailHolderAngAmt = 0; //угловой кронштейн поручня к поворотной стойке
	var angleAmt = 0;
	var rigelAmt = 0;
	var rigelHolderAmt = 0;
	var glassHolderAmt = 0;
	var glassAmt = 0;
	var sectionAmt = 0;

	if (params.stairModel == "Прямая") {

		var stairAmt = params.stairAmt1;
		if (params.platformTop == "есть") stairAmt += 1;

		if (params.railingSide_1 == "внешнее" || params.railingSide_1 == "две") {
			marshBalAmt1 += calcRacksAmt(params.stairAmt1);
			sectionAmt += 1;
			glassAmt += marshBalAmt1 - 1;
			rigelAmt += 1;
		}

		if (params.railingSide_1 == "внутреннее" || params.railingSide_1 == "две") {
			marshBalAmt1 += calcRacksAmt(params.stairAmt1);
			sectionAmt += 1;
			glassAmt += marshBalAmt1 - 1;
			rigelAmt += 1;
		}

	} //end of Прямая

	if (params.stairModel == "Г-образная с площадкой" || params.stairModel == "Прямая с промежуточной площадкой") {

		//нижний марш

		if (params.railingSide_1 == "внутреннее" || params.railingSide_1 == "две") {
			marshBalAmt1 += calcRacksAmt(params.stairAmt1);
			if (params.stairModel == "Прямая с промежуточной площадкой")
				marshBalAmt1 += Math.ceil(params.middlePltLength / 1200);
			sectionAmt += 1;
			glassAmt += marshBalAmt1 - 1;
			rigelAmt += 1;
		}
		if (params.railingSide_1 == "внешнее" || params.railingSide_1 == "две") {
			marshBalAmt1 += calcRacksAmt(params.stairAmt1 + 1);
			if (params.stairModel == "Прямая с промежуточной площадкой")
				marshBalAmt1 += Math.ceil(params.middlePltLength / 1200);
			marshBalAmt1 += Math.ceil(params.middlePltLength / 800);
			sectionAmt += 1;
			glassAmt += marshBalAmt1 - 1;
			rigelAmt += 1;
		}

		//верхний марш
		var stairAmt = params.stairAmt3;
		if (params.platformTop == "есть") stairAmt += 1;

		if (params.railingSide_3 == "внутреннее" || params.railingSide_3 == "две") {
			marshBalAmt3 += calcRacksAmt(stairAmt);
			sectionAmt += 1;
			glassAmt += marshBalAmt3 - 1;
			rigelAmt += 1;
		}
		if (params.railingSide_3 == "внешнее" || params.railingSide_1 == "две") {
			marshBalAmt3 += calcRacksAmt(stairAmt);
			if (params.stairModel == "Г-образная с площадкой")
				marshBalAmt3 += Math.ceil(params.middlePltWidth / 800);
			sectionAmt += 1;
			glassAmt += marshBalAmt3 - 1;
			rigelAmt += 1;
		}

	} //end of Г-образная


	//верхняя площадка

	if (params.platformTop == "площадка") {
		if (params.topPltRailing_3) {
			pltBalAmt += Math.ceil(params.platformLength_3 / 1000);
			glassAmt += pltBalAmt;
			rigelAmt += 1;
		}
		if (params.topPltRailing_4) {
			pltBalAmt += Math.ceil(params.M / 1000) + 1;
			sectionAmt += 1;
			glassAmt += pltBalAmt - 1;
			rigelAmt += 1;
		}
		if (params.topPltRailing_5) {
			pltBalAmt += Math.ceil(params.platformLength_3 / 1000);
			glassAmt += pltBalAmt;
			rigelAmt += 1;
		}
	}
	if (params.platformTop == "увеличенная") {
		if (params.topPltRailing_3) {
			var balAmt = Math.ceil(params.platformLength_3 / 1000);
			if (balAmt < 2) balAmt = 2;
			pltBalAmt += balAmt;
			glassAmt += pltBalAmt;
			rigelAmt += 1;
		}
		if (params.topPltRailing_4) {
			var balAmt = Math.ceil(params.platformWidth_3 / 1000);
			if (balAmt < 2) balAmt = 2;
			pltBalAmt += balAmt;
			sectionAmt += 1;
			glassAmt += pltBalAmt - 1;
			rigelAmt += 1;
		}
		if (params.topPltRailing_5) {
			var balAmt = Math.ceil(params.platformLength_3 / 1000);
			if (balAmt < 2) balAmt = 2;
			pltBalAmt += balAmt;
			//pltBalAmt += Math.ceil(params.platformLength_3/1000);
			glassAmt += pltBalAmt;
			rigelAmt += 1;
		}
		if (params.topPltRailing_6 && params.platformWidth_3 - params.M > 306) {
			var balAmt = Math.ceil((params.platformWidth_3 - params.M) / 1000);
			if (balAmt < 2) balAmt = 2;
			pltBalAmt += balAmt;
			//pltBalAmt += Math.ceil((params.platformWidth_3 - params.M) / 1000);
			glassAmt += pltBalAmt;
			rigelAmt += 1;
		}

	}
	if (params.stairModel == "Прямая") marshBalAmt1 += pltBalAmt;
	if (params.stairModel != "Прямая") marshBalAmt3 += pltBalAmt;

	handrailHolderAmt = marshBalAmt1 + marshBalAmt3;


	handrailAmt = rigelAmt;
	rigelAmt = rigelAmt * params.rigelAmt;
	rigelHolderAmt = (marshBalAmt1 + marshBalAmt3) * params.rigelAmt;
	glassHolderAmt = glassAmt * 4;


	//формируем возвращаемый объект
	var railingParams = {
		marshBalAmt1: marshBalAmt1,
		marshBalAmt3: marshBalAmt3,
		rackAmt: marshBalAmt1 + marshBalAmt3,
		pltBalAmt: pltBalAmt,
		handrailAmt: handrailAmt,
		handrailHolderAmt: handrailHolderAmt,
		rigelAmt: rigelAmt,
		rigelHolderAmt: rigelHolderAmt,
		glassAmt: glassAmt,
		glassHolderAmt: glassHolderAmt,
		sectionAmt: sectionAmt,
	};
	return railingParams;
} //end of calcRailingParams()



// функция расчёта кол-ва стоек в зависимости от числа прямых ступеней
function calcRacksAmt(stairAmt) {

	var newellAmt = [];

	/*кол-во стоек*/
	newellAmt[0] = 0;
	newellAmt[1] = 0;
	newellAmt[2] = 2;
	newellAmt[3] = 2;
	newellAmt[4] = 2;
	newellAmt[5] = 3;
	newellAmt[6] = 3;
	newellAmt[7] = 3;
	newellAmt[8] = 4;
	newellAmt[9] = 4;
	newellAmt[10] = 4;
	newellAmt[11] = 5;
	newellAmt[12] = 5;
	newellAmt[13] = 5;
	newellAmt[14] = 6;
	newellAmt[15] = 6;
	newellAmt[16] = 6;
	newellAmt[17] = 7;
	newellAmt[18] = 7;
	newellAmt[19] = 7;


	return newellAmt[stairAmt];

} // end of calcRacksAmt()



// функция расчёта спецификации
function calcSpec_vl() {

	/* Инициализация справочника деталей*/
	var partsList = createPartsList_vl();
	var item = {}
	params.rigelAmt = params.rigelAmt * 1.0;


	function stockStairCalc() {}; //пустая функция для навигации

	if (params.staircaseType == "Готовая") {

		function addStandartMarshItems() {}; //пустая функция для навигации

		//параметры деталей марша в зависимости от кол-ва ступеней
		var sideStringerId = "stringer_side_2";
		var midStringerId = "stringer_mid_2";
		var stairAmt = params.stairAmt1;
		if (params.platformTop == "площадка") stairAmt += 1;

		if (stairAmt == 2) {
			stringerId = "stringer_side_2";
			midStringerId = "stringer_mid_2";
		}
		if (stairAmt == 3) {
			stringerId = "stringer_side_3";
			midStringerId = "stringer_mid_3";
		}
		if (stairAmt == 4) {
			stringerId = "stringer_side_4";
			midStringerId = "stringer_mid_4";
		}
		if (stairAmt == 5) {
			stringerId = "stringer_side_5";
			midStringerId = "stringer_mid_5";
		}
		if (stairAmt == 6) {
			stringerId = "stringer_side_6";
			midStringerId = "stringer_mid_6";
			rigelId = "rigel_5steps"
		}



		//детали каркаса

		item = {
			id: stringerId,
			amt: 1,
			discription: "Боковые тетивы",
			unit: "Марш",
			itemGroup: "Каркас"
		};
		if (item.amt > 0) partsList.addItem(item);

		var midStringersAmt = params.frameAmt_600 + params.frameAmt_800 + params.frameAmt_1000 - 1;

		item = {
			id: midStringerId,
			amt: midStringersAmt,
			discription: "Промежуточные косоуры",
			unit: "Марш",
			itemGroup: "Каркас"
		};
		if (item.amt > 0) partsList.addItem(item);

		//рамки ступеней
		var frameAmt_600 = params.frameAmt_600 * params.stairAmt1;
		var frameAmt_800 = params.frameAmt_800 * params.stairAmt1;
		var frameAmt_1000 = params.frameAmt_1000 * params.stairAmt1;
		item = {
			id: "frame_600",
			amt: frameAmt_600,
			discription: "Рамки ступеней",
			unit: "Марш",
			itemGroup: "Каркас"
		};
		if (item.amt > 0) partsList.addItem(item);

		item = {
			id: "frame_800",
			amt: frameAmt_800,
			discription: "Рамки ступеней",
			unit: "Марш",
			itemGroup: "Каркас"
		};
		if (item.amt > 0) partsList.addItem(item);

		item = {
			id: "frame_1000",
			amt: frameAmt_1000,
			discription: "Рамки ступеней",
			unit: "Марш",
			itemGroup: "Каркас"
		};
		if (item.amt > 0) partsList.addItem(item);

		item = {
			id: "decking",
			amt: params.stairAmt1 * 2,
			discription: "Покрытие ступеней",
			unit: "Марш",
			itemGroup: "Каркас"
		};
		if (item.amt > 0 && params.stairType != "нет") partsList.addItem(item);



		//метизы крепления рамок и доски дпк

		var frameBoltAmt_side = params.stairAmt1 * 2 * 2;
		var frameBoltAmt_mid = params.stairAmt1 * 2 * midStringersAmt;

		item = {
			id: "hexVint_M10x30",
			amt: frameBoltAmt_side,
			discription: "Крепление рамок марша к боковым тетивам",
			unit: "Марш",
			itemGroup: "Каркас"
		};
		if (item.amt > 0) partsList.addItem(item);

		item = {
			id: "nut_M10",
			amt: frameBoltAmt_side,
			discription: "Крепление рамок марша к боковым тетивам",
			unit: "Марш",
			itemGroup: "Каркас"
		};
		if (item.amt > 0) partsList.addItem(item);

		if (params.isPlasticCaps == "есть") {
			item = {
				id: "plasticCap_M10",
				amt: frameBoltAmt_side,
				discription: "Колпачки",
				unit: "Марш",
				itemGroup: "Каркас",
			};
			if (item.amt > 0) partsList.addItem(item);
		}


		item = {
			id: "shim_M10",
			amt: frameBoltAmt_side,
			discription: "Крепление рамок марша к боковым тетивам",
			unit: "Марш",
			itemGroup: "Каркас"
		};
		if (item.amt > 0) partsList.addItem(item);

		item = {
			id: "bolt_M10x40",
			amt: frameBoltAmt_mid,
			discription: "Крепление рамок марша к средним косоурам",
			unit: "Марш",
			itemGroup: "Каркас"
		};
		if (item.amt > 0) partsList.addItem(item);

		item = {
			id: "nut_M10",
			amt: frameBoltAmt_mid,
			discription: "Крепление рамок марша к средним косоурам",
			unit: "Марш",
			itemGroup: "Каркас"
		};
		if (item.amt > 0) partsList.addItem(item);

		if (params.isPlasticCaps == "есть") {
			item = {
				id: "plasticCap_M10",
				amt: frameBoltAmt_mid,
				discription: "Колпачки",
				unit: "Марш",
				itemGroup: "Каркас",
			};
			if (item.amt > 0) partsList.addItem(item);
		}

		item = {
			id: "shim_M10",
			amt: frameBoltAmt_mid * 2,
			discription: "Крепление рамок марша к средним косоурам",
			unit: "Марш",
			itemGroup: "Каркас"
		};
		if (item.amt > 0) partsList.addItem(item);

		var mebBoltAmt = (frameAmt_600 + frameAmt_800 + frameAmt_1000) * 4;
		if (params.stairType == "нет") mebBoltAmt = 0;

		item = {
			id: "boltMeb_M6x35",
			amt: mebBoltAmt,
			discription: "Крепление досок ДПК",
			unit: "Марш",
			itemGroup: "Каркас"
		};
		if (item.amt > 0) partsList.addItem(item);

		item = {
			id: "nut_M6",
			amt: mebBoltAmt,
			discription: "Крепление досок ДПК",
			unit: "Марш",
			itemGroup: "Каркас"
		};
		if (item.amt > 0) partsList.addItem(item);

		item = {
			id: "shim_M6",
			amt: mebBoltAmt,
			discription: "Крепление досок ДПК",
			unit: "Марш",
			itemGroup: "Каркас"
		};
		if (item.amt > 0) partsList.addItem(item);





		//крепления к перекрытиям

		var botFixAmt = midStringersAmt + 2
		item = {
			id: "regSupport",
			amt: botFixAmt,
			discription: "Крепление к нижнему перекрытию",
			unit: "Марш",
			itemGroup: "Каркас"
		};
		if (item.amt > 0) partsList.addItem(item);

		item = {
			id: "angle_u5_100",
			amt: botFixAmt,
			discription: "Крепление к нижнему перекрытию",
			unit: "Марш",
			itemGroup: "Каркас"
		};
		if (item.amt > 0) partsList.addItem(item);

		item = {
			id: "nut_M20",
			amt: botFixAmt * 2,
			discription: "Крепление к нижнему перекрытию",
			unit: "Марш",
			itemGroup: "Каркас"
		};
		if (item.amt > 0) partsList.addItem(item);

		item = {
			id: "hexVint_M10x30",
			amt: botFixAmt * 2,
			discription: "Крепление нижних опор к тетивам",
			unit: "Марш",
			itemGroup: "Каркас"
		};
		if (item.amt > 0) partsList.addItem(item);

		item = {
			id: "nut_M10",
			amt: botFixAmt * 2,
			discription: "Крепление нижних опор к тетивам",
			unit: "Марш",
			itemGroup: "Каркас"
		};
		if (item.amt > 0) partsList.addItem(item);

		if (params.isPlasticCaps == "есть") {
			item = {
				id: "plasticCap_M10",
				amt: botFixAmt * 2,
				discription: "Колпачки",
				unit: "Марш",
				itemGroup: "Каркас",
			};
			if (item.amt > 0) partsList.addItem(item);
		}

		item = {
			id: "shim_M10",
			amt: botFixAmt * 2,
			discription: "Крепление нижних опор к тетивам",
			unit: "Марш",
			itemGroup: "Каркас"
		};
		if (item.amt > 0) partsList.addItem(item);


		//верхнее крепление
		var topFixAmt = botFixAmt;

		if (params.platformTop != "площадка") {

			item = {
				id: "angle100",
				amt: topFixAmt,
				discription: "Верхнее крепление",
				unit: "Марш",
				itemGroup: "Каркас"
			};
			if (item.amt > 0) partsList.addItem(item);

			item = {
				id: "hexVint_M10x30",
				amt: topFixAmt * 2,
				discription: "Крепление верхних опор к тетивам",
				unit: "Марш",
				itemGroup: "Каркас"
			};
			if (params.topStepColumns == 'есть') item.id = "hexVint_M10x40";
			if (item.amt > 0) partsList.addItem(item);

			item = {
				id: "nut_M10",
				amt: topFixAmt * 2,
				discription: "Крепление верхних опор к тетивам",
				unit: "Марш",
				itemGroup: "Каркас"
			};
			if (item.amt > 0) partsList.addItem(item);

			if (params.isPlasticCaps == "есть") {
				item = {
					id: "plasticCap_M10",
					amt: topFixAmt * 2,
					discription: "Колпачки",
					unit: "Марш",
					itemGroup: "Каркас",
				};
				if (item.amt > 0) partsList.addItem(item);
			}

			item = {
				id: "shim_M10",
				amt: topFixAmt * 2,
				discription: "Крепление верхних опор к тетивам",
				unit: "Марш",
				itemGroup: "Каркас"
			};
			if (item.amt > 0) partsList.addItem(item);

			if (params.topFlan == "есть") {
				item = {
					id: "fk15_flange",
					amt: topFixAmt,
					discription: "Вертикальный фланец",
					unit: "Марш",
					itemGroup: "Каркас"
				};
				if (item.amt > 0) partsList.addItem(item);

				item = {
					id: "hexVint_M10x30",
					amt: topFixAmt * 2,
					discription: "Крепление вертикальных фланцев",
					unit: "Марш",
					itemGroup: "Каркас"
				};
				if (item.amt > 0) partsList.addItem(item);

				item = {
					id: "nut_M10",
					amt: topFixAmt * 2,
					discription: "Крепление вертикальных фланцев",
					unit: "Марш",
					itemGroup: "Каркас"
				};
				if (item.amt > 0) partsList.addItem(item);

				if (params.isPlasticCaps == "есть") {
					item = {
						id: "plasticCap_M10",
						amt: topFixAmt * 2,
						discription: "Колпачки",
						unit: "Марш",
						itemGroup: "Каркас",
					};
					if (item.amt > 0) partsList.addItem(item);
				}

				item = {
					id: "shim_M10",
					amt: topFixAmt * 2,
					discription: "Крепление вертикальных фланцев",
					unit: "Марш",
					itemGroup: "Каркас"
				};
				if (item.amt > 0) partsList.addItem(item);
			}
		}


		//ограждения марша

		var rackAmt = 0;
		var handrailAmt = 0;
		var rigelAmt = 0;
		if (params.railingSide_1 == "внешнее" || params.railingSide_1 == "две") {
			rackAmt += 2;
			if (stairAmt > 4) rackAmt += 1;
			handrailAmt += 1;
			rigelAmt += params.rigelAmt * 1.0;
		}
		if (params.railingSide_1 == "внутреннее" || params.railingSide_1 == "две") {
			rackAmt += 2;
			if (stairAmt > 4) rackAmt += 1;
			handrailAmt += 1;
			rigelAmt += params.rigelAmt * 1.0;
		}

		var rackId = "rack";
		var rackId_plt = "rack_plt";
		if (params.banisterMaterial == "40х40 нерж.") {
			rackId = "rackInox";
			rackId_plt = "rackInox_plt";
		}

		item = {
			id: rackId,
			amt: rackAmt,
			discription: "Стойки ограждения марша",
			unit: "Марш",
			itemGroup: "Ограждения"
		};
		if (item.amt > 0) partsList.addItem(item);

		item = {
			id: "hexVint_M10x30",
			amt: rackAmt * 2,
			discription: "Крепление стоек марша",
			unit: "Марш",
			itemGroup: "Ограждения"
		};
		if (item.amt > 0) partsList.addItem(item);

		if (params.isPlasticCaps == "есть") {
			item = {
				id: "plasticCap_M10",
				amt: rackAmt * 2,
				discription: "Колпачки",
				unit: "Марш",
				itemGroup: "Каркас",
			};
			if (item.amt > 0) partsList.addItem(item);
		}

		item = {
			id: "banisterInnerFlange",
			amt: rackAmt,
			discription: "Крепление стоек марша",
			unit: "Марш",
			itemGroup: "Ограждения"
		};
		if (item.amt > 0) partsList.addItem(item);

		item = {
			id: "plasticPlug_40_40",
			amt: rackAmt,
			discription: "Заглушки низа стоек марша",
			unit: "Марш",
			itemGroup: "Ограждения"
		};
		if (item.amt > 0) partsList.addItem(item);

		item = {
			id: "handrailHolderTurn",
			amt: rackAmt,
			discription: "Кронштейн поручня стоек марша",
			unit: "Марш",
			itemGroup: "Ограждения"
		};
		if (item.amt > 0) partsList.addItem(item);

		if (params.banisterMaterial == '40х40 нерж.' || params.banisterMaterial == "40х40 нерж+дуб") {
			item = {
				id: "handrailHolderBase",
				amt: rackAmt,
				discription: "Основание штыря",
				unit: "Марш",
				itemGroup: "Ограждения"
			};
			if (item.amt > 0) partsList.addItem(item);
		}

		item = {
			id: "vint_M6x10",
			amt: rackAmt,
			discription: "Крепление лодочки к штырю",
			unit: "Марш",
			itemGroup: "Ограждения"
		};
		if (item.amt > 0) partsList.addItem(item);

		var handrailHolderFlanId = "handrailHolderFlanPlane";
		if (params.handrail == "Ф50 нерж.") handrailHolderFlanId = "handrailHolderFlanArc";

		item = {
			id: handrailHolderFlanId,
			amt: rackAmt,
			discription: "Лодочки поручня марша",
			unit: "Марш",
			itemGroup: "Ограждения"
		};
		if (item.amt > 0) partsList.addItem(item);

		if (params.handrail != "Ф50 нерж.") {
			item = {
				id: "nut_M8",
				amt: rackAmt,
				discription: "Лодочки поручня марша",
				unit: "Марш",
				itemGroup: "Ограждения"
			};
			if (item.amt > 0) partsList.addItem(item);
		}
		//partsList.nut_M8.comment = "Выдать в цех"

		//поручни
		item = {
			id: "handrail_marsh",
			amt: handrailAmt,
			discription: "Поручни марша",
			unit: "Марш",
			itemGroup: "Ограждения"
		};

		var handrailWithPltAmt = 0;
		if (params.topPltRailing_3 && (params.railingSide_1 == "две" || params.railingSide_1 == "внутреннее") && turnFactor == 1 ||
			params.topPltRailing_3 && (params.railingSide_1 == "две" || params.railingSide_1 == "внешнее") && turnFactor == -1) {
			item.amt -= 1;
			handrailWithPltAmt += 1;
		}

		if (params.topPltRailing_4 && (params.railingSide_1 == "две" || params.railingSide_1 == "внешнее") && turnFactor == 1 ||
			params.topPltRailing_4 && (params.railingSide_1 == "две" || params.railingSide_1 == "внутреннее") && turnFactor == -1) {
			item.amt -= 1;
			handrailWithPltAmt += 1;
		}

		if (item.amt > 0) partsList.addItem(item);

		item = {
			id: "handrail_marsh_with_plt",
			amt: handrailWithPltAmt,
			discription: "Поручни марша",
			unit: "Марш",
			itemGroup: "Ограждения"
		};
		if (item.amt > 0) partsList.addItem(item);

		item = {
			id: "metalHandrailScrew",
			amt: rackAmt * 2,
			discription: "Поручни марша",
			unit: "Марш",
			itemGroup: "Ограждения"
		};
		if (params.handrail == 'ПВХ') item.id = "timberHandrailScrew";
		if (item.amt > 0) partsList.addItem(item);

		var handrailPlugId = "plasticPlug_40_20";
		if (params.handrail == "Ф50 нерж.") handrailPlugId = "stainlessPlug_50";
		if (params.handrail == "ПВХ") handrailPlugId = 'none';

		if (handrailPlugId !== 'none') {
			item = {
				id: handrailPlugId,
				amt: handrailAmt * 2,
				discription: "Поручни марша",
				unit: "Марш",
				itemGroup: "Ограждения"
			};
			if (item.amt > 0) partsList.addItem(item);
		}


		//ригели

		item = {
			id: "rigel_marsh",
			amt: rigelAmt,
			discription: "Ригели марша",
			unit: "Марш",
			itemGroup: "Ограждения"
		};

		var rigelWithPltAmt = 0;
		if (params.topPltRailing_3 && (params.railingSide_1 == "две" || params.railingSide_1 == "внутреннее") && turnFactor == 1 ||
			params.topPltRailing_3 && (params.railingSide_1 == "две" || params.railingSide_1 == "внешнее") && turnFactor == -1) {
			item.amt -= 1 * params.rigelAmt;
			rigelWithPltAmt += 1 * params.rigelAmt;
		}

		if (params.topPltRailing_4 && (params.railingSide_1 == "две" || params.railingSide_1 == "внешнее") && turnFactor == 1 ||
			params.topPltRailing_4 && (params.railingSide_1 == "две" || params.railingSide_1 == "внутреннее") && turnFactor == -1) {
			item.amt -= 1 * params.rigelAmt;
			rigelWithPltAmt += 1 * params.rigelAmt;
		}

		if (item.amt > 0) partsList.addItem(item);

		item = {
			id: "rigel_marsh_with_plt",
			amt: rigelWithPltAmt,
			discription: "Ригели марша",
			unit: "Марш",
			itemGroup: "Ограждения"
		};
		if (item.amt > 0) partsList.addItem(item);

		var rigelPlugId = "plasticPlug_20_20";
		var rigelHolderId = "";
		if (params.rigelMaterial == "Ф12 нерж.") {
			rigelPlugId = "stainlessPlug_12";
			rigelHolderId = "rigelHolder12";
		}
		if (params.rigelMaterial == "Ф16 нерж.") {
			rigelPlugId = "stainlessPlug_16";
			rigelHolderId = "rigelHolder16";
		}

		item = {
			id: rigelPlugId,
			amt: rigelAmt * 2,
			discription: "Ригели марша",
			unit: "Марш",
			itemGroup: "Ограждения"
		};
		if (params.rigelMaterial == "20х20 черн." && params.platformTop !== 'нет') item.amt += rigelAmt;
		if (item.amt > 0) partsList.addItem(item);

		item = {
			id: "rigelScrew",
			amt: params.rigelAmt * rackAmt,
			discription: "Ригели марша",
			unit: "Марш",
			itemGroup: "Ограждения"
		};
		if (item.amt > 0) partsList.addItem(item);

		if (rigelHolderId != "") {
			item = {
				id: rigelHolderId,
				amt: params.rigelAmt * rackAmt,
				discription: "Ригели марша",
				unit: "Марш",
				itemGroup: "Ограждения"
			};
			if (item.amt > 0) partsList.addItem(item);
		}


		function addStandartPltItems() {}; //пустая функция для навигации


		//колонны площадки

		var colAmt = 0;
		if (params.platformTop == "площадка") {
			if (params.isColumnTop1) colAmt += 1;
			if (params.isColumnTop2) colAmt += 1;
			if (params.isColumnTop3) colAmt += 1;
			if (params.isColumnTop4) colAmt += 1;
		}

		if (params.topStepColumns == "есть" && params.platformTop == "нет") colAmt += 2;

		item = {
			id: "column",
			amt: colAmt,
			discription: "Колонна площадки",
			unit: "Площадка",
			itemGroup: "Площадка"
		};
		if (item.amt > 0) partsList.addItem(item);

		item = {
			id: "plasticPlug_40_40",
			amt: colAmt,
			discription: "Заглушки низа опор площадки",
			unit: "Площадка",
			itemGroup: "Площадка"
		};
		if (item.amt > 0) partsList.addItem(item);

		//площадка
		if (params.platformTop == "площадка") {

			var sidePltStringerId = "plate_190_" + (params.topPltLength_stock - 300);
			var midPltStringerId = "plate_165_" + (params.topPltLength_stock - 300);

			item = {
				id: sidePltStringerId,
				amt: 1,
				discription: "Боковые тетивы площадки",
				unit: "Площадка",
				itemGroup: "Площадка"
			};
			if (item.amt > 0) partsList.addItem(item);

			item = {
				id: midPltStringerId,
				amt: midStringersAmt,
				discription: "Промежуточные косоуры площадки",
				unit: "Площадка",
				itemGroup: "Площадка"
			};
			if (item.amt > 0) partsList.addItem(item);

			//соединительный фланец

			item = {
				id: "connectorFlan8",
				amt: midStringersAmt + 2,
				discription: "Соединение тетив марша и площадки",
				unit: "Площадка",
				itemGroup: "Площадка"
			};
			if (item.amt > 0) partsList.addItem(item);

			var shortBoltAmt = 4 * (midStringersAmt + 2);
			if (params.isColumnTop2) shortBoltAmt += 2;
			if (params.isColumnTop4) shortBoltAmt += 2;
			//var shortBoltAmt = topFixAmt * 2 - longBoltAmt;

			item = {
				id: "hexVint_M10x30",
				amt: shortBoltAmt,
				discription: "Болты соединительного фланца",
				unit: "Площадка",
				itemGroup: "Площадка"
			};
			if (item.amt > 0) partsList.addItem(item);

			/*
		//уголки площадки	
	
		var topFixAmt = botFixAmt;
		item = {
			id: "angle100",
			amt: topFixAmt,
			discription: "Уголки площадки",
			unit: "Площадка",
			itemGroup: "Каркас"
			};
		if(item.amt > 0) partsList.addItem(item);
		
		var boltPerAngle = 2;
		if(params.platformRearStringer == "есть") boltPerAngle = 4;
		item = {
			id: "hexVint_M10x30",
			amt: topFixAmt * boltPerAngle,
			discription: "Крепление уголков к тетивам",
			unit: "Площадка",
			itemGroup: "Каркас"
			};
		if(item.amt > 0) partsList.addItem(item);
		
		item = {
			id: "nut_M10",
			amt: topFixAmt * boltPerAngle,
			discription: "Крепление уголков к тетивам",
			unit: "Площадка",
			itemGroup: "Каркас"
			};
		if(item.amt > 0) partsList.addItem(item);
		
		item = {
			id: "shim_M10",
			amt: topFixAmt * boltPerAngle,
			discription: "Крепление уголков к тетивам",
			unit: "Площадка",
			itemGroup: "Каркас"
			};
		if(item.amt > 0) partsList.addItem(item);
		*/

			item = {
				id: "nut_M10",
				amt: shortBoltAmt,
				discription: "Соединение тетив марша и площадки",
				unit: "Площадка",
				itemGroup: "Площадка"
			};
			if (item.amt > 0) partsList.addItem(item);

			if (params.isPlasticCaps == "есть") {
				item = {
					id: "plasticCap_M10",
					amt: shortBoltAmt,
					discription: "Колпачки",
					unit: "Марш",
					itemGroup: "Каркас",
				};
				if (item.amt > 0) partsList.addItem(item);
			}

			item = {
				id: "shim_M10",
				amt: shortBoltAmt,
				discription: "Соединение тетив марша и площадки",
				unit: "Площадка",
				itemGroup: "Площадка"
			};
			if (item.amt > 0) partsList.addItem(item);

			//рамки площадки
			var framesRowsAmt = Math.round(params.topPltLength_stock / 300)
			var frameAmt_600 = params.frameAmt_600 * framesRowsAmt;
			var frameAmt_800 = params.frameAmt_800 * framesRowsAmt;
			var frameAmt_1000 = params.frameAmt_1000 * framesRowsAmt;
			item = {
				id: "frame_600",
				amt: frameAmt_600,
				discription: "Рамки площадки",
				unit: "Площадка",
				itemGroup: "Площадка"
			};
			if (item.amt > 0) partsList.addItem(item);

			item = {
				id: "frame_800",
				amt: frameAmt_800,
				discription: "Рамки площадки",
				unit: "Площадка",
				itemGroup: "Площадка"
			};
			if (item.amt > 0) partsList.addItem(item);

			item = {
				id: "frame_1000",
				amt: frameAmt_1000,
				discription: "Рамки площадки",
				unit: "Площадка",
				itemGroup: "Площадка"
			};
			if (item.amt > 0) partsList.addItem(item);

			item = {
				id: "decking",
				amt: (params.topPltLength_stock) / 150,
				discription: "Покрытие площадки",
				unit: "Площадка",
				itemGroup: "Площадка"
			};
			if (item.amt > 0 && params.stairType != "нет") partsList.addItem(item);

			//метизы крепления рамок

			var frameBoltAmt_side = framesRowsAmt * 2 * 2;
			var frameBoltAmt_mid = framesRowsAmt * 2 * midStringersAmt;

			item = {
				id: "hexVint_M10x30",
				amt: frameBoltAmt_side,
				discription: "Крепление рамок площадки к боковым тетивам",
				unit: "Площадка",
				itemGroup: "Площадка"
			};
			if (item.amt > 0) partsList.addItem(item);

			item = {
				id: "nut_M10",
				amt: frameBoltAmt_side,
				discription: "Крепление рамок площадки к боковым тетивам",
				unit: "Площадка",
				itemGroup: "Площадка"
			};
			if (item.amt > 0) partsList.addItem(item);

			if (params.isPlasticCaps == "есть") {
				item = {
					id: "plasticCap_M10",
					amt: frameBoltAmt_side,
					discription: "Колпачки",
					unit: "Марш",
					itemGroup: "Каркас",
				};
				if (item.amt > 0) partsList.addItem(item);
			}

			item = {
				id: "shim_M10",
				amt: frameBoltAmt_side,
				discription: "Крепление рамок площадки к боковым тетивам",
				unit: "Площадка",
				itemGroup: "Площадка"
			};
			if (item.amt > 0) partsList.addItem(item);

			item = {
				id: "bolt_M10x40",
				amt: frameBoltAmt_mid,
				discription: "Крепление рамок площадки к средним косоурам",
				unit: "Площадка",
				itemGroup: "Площадка"
			};
			if (item.amt > 0) partsList.addItem(item);

			item = {
				id: "nut_M10",
				amt: frameBoltAmt_mid,
				discription: "Крепление рамок площадки к средним косоурам",
				unit: "Площадка",
				itemGroup: "Площадка"
			};
			if (item.amt > 0) partsList.addItem(item);

			if (params.isPlasticCaps == "есть") {
				item = {
					id: "plasticCap_M10",
					amt: frameBoltAmt_mid,
					discription: "Колпачки",
					unit: "Марш",
					itemGroup: "Каркас",
				};
				if (item.amt > 0) partsList.addItem(item);
			}

			item = {
				id: "shim_M10",
				amt: frameBoltAmt_mid * 2,
				discription: "Крепление рамок площадки к средним косоурам",
				unit: "Площадка",
				itemGroup: "Площадка"
			};
			if (item.amt > 0) partsList.addItem(item);

			var mebBoltAmt = (frameAmt_600 + frameAmt_800 + frameAmt_1000) * 4;
			if (params.stairType == "нет") mebBoltAmt = 0;
			item = {
				id: "boltMeb_M6x35",
				amt: mebBoltAmt,
				discription: "Крепление досок ДПК",
				unit: "Площадка",
				itemGroup: "Площадка"
			};
			if (item.amt > 0) partsList.addItem(item);

			item = {
				id: "nut_M6",
				amt: mebBoltAmt,
				discription: "Крепление досок ДПК",
				unit: "Площадка",
				itemGroup: "Площадка"
			};
			if (item.amt > 0) partsList.addItem(item);

			item = {
				id: "shim_M6",
				amt: mebBoltAmt,
				discription: "Крепление досок ДПК",
				unit: "Площадка",
				itemGroup: "Площадка"
			};
			if (item.amt > 0) partsList.addItem(item);



			//заднее крепление площадки

			if (params.platformRearStringer == "нет") {

				var longBoltAmt = 0;
				if (params.isColumnTop1) longBoltAmt += 2;
				if (params.isColumnTop3) longBoltAmt += 2;
				var shortBoltAmt = topFixAmt * 2 - longBoltAmt;

				item = {
					id: "angle100",
					amt: topFixAmt,
					discription: "Верхнее крепление",
					unit: "Площадка",
					itemGroup: "Площадка"
				};
				if (item.amt > 0) partsList.addItem(item);

				item = {
					id: "hexVint_M10x30",
					amt: shortBoltAmt,
					discription: "Крепление верхних опор к тетивам",
					unit: "Площадка",
					itemGroup: "Площадка"
				};
				if (item.amt > 0) partsList.addItem(item);

				item = {
					id: "bolt_M10x40",
					amt: longBoltAmt,
					discription: "Крепление верхних опор к тетивам",
					unit: "Площадка",
					itemGroup: "Площадка"
				};
				if (item.amt > 0) partsList.addItem(item);

				item = {
					id: "nut_M10",
					amt: topFixAmt * 2,
					discription: "Крепление верхних опор к тетивам",
					unit: "Площадка",
					itemGroup: "Площадка"
				};
				if (item.amt > 0) partsList.addItem(item);

				if (params.isPlasticCaps == "есть") {
					item = {
						id: "plasticCap_M10",
						amt: topFixAmt * 2,
						discription: "Колпачки",
						unit: "Марш",
						itemGroup: "Каркас",
					};
					if (item.amt > 0) partsList.addItem(item);
				}

				item = {
					id: "shim_M10",
					amt: topFixAmt * 2,
					discription: "Крепление верхних опор к тетивам",
					unit: "Площадка",
					itemGroup: "Площадка"
				};
				if (item.amt > 0) partsList.addItem(item);
			}

			//задняя тетива площадки

			if (params.platformRearStringer == "есть") {
				var longBoltAmt = 0;
				if (params.isColumnTop1) longBoltAmt += 2;
				if (params.isColumnTop3) longBoltAmt += 2;
				var shortBoltAmt = topFixAmt * 4 - longBoltAmt;


				item = {
					id: "rearStringer",
					amt: 1,
					discription: "Площадка",
					unit: "Площадка",
					itemGroup: "Площадка"
				};
				if (item.amt > 0) partsList.addItem(item);

				item = {
					id: "angle100",
					amt: topFixAmt,
					discription: "Крепление задней тетивы",
					unit: "Площадка",
					itemGroup: "Площадка"
				};
				if (item.amt > 0) partsList.addItem(item);

				item = {
					id: "hexVint_M10x30",
					amt: shortBoltAmt,
					discription: "Крепление задней тетивы",
					unit: "Площадка",
					itemGroup: "Площадка"
				};
				if (item.amt > 0) partsList.addItem(item);
				console.log(longBoltAmt)
				item = {
					id: "hexVint_M10x40",
					amt: longBoltAmt,
					discription: "Крепление задней тетивы",
					unit: "Площадка",
					itemGroup: "Площадка"
				};
				if (item.amt > 0) partsList.addItem(item);

				item = {
					id: "nut_M10",
					amt: topFixAmt * 4,
					discription: "Крепление задней тетивы",
					unit: "Площадка",
					itemGroup: "Площадка"
				};
				if (item.amt > 0) partsList.addItem(item);

				if (params.isPlasticCaps == "есть") {
					item = {
						id: "plasticCap_M10",
						amt: topFixAmt * 4,
						discription: "Колпачки",
						unit: "Марш",
						itemGroup: "Каркас",
					};
					if (item.amt > 0) partsList.addItem(item);
				}

				item = {
					id: "shim_M10",
					amt: topFixAmt * 4,
					discription: "Крепление задней тетивы",
					unit: "Площадка",
					itemGroup: "Площадка"
				};
				if (item.amt > 0) partsList.addItem(item);

			}


			//ограждения площадки

			var rackAmt = 0;
			var handrail3Amt = 0;
			var handrail5Amt = 0;
			var rigel3Amt = 0;
			var rigel5Amt = 0;
			var railingConnectionAmt = 0;

			var isRightRailing = false;
			var isLeftRailing = false;

			//правая лестница

			if (params.turnSide == "правое") {
				//правая сторона
				if (params.railingSide_1 == "внешнее" || params.railingSide_1 == "две") {
					if (params.topPltRailing_4) isRightRailing = true;
				}
				//левая сторона
				if (params.railingSide_1 == "внутреннее" || params.railingSide_1 == "две") {
					if (params.topPltRailing_3) isLeftRailing = true;
				}
			}
			if (params.turnSide == "левое") {
				//правая сторона
				if (params.railingSide_1 == "внутреннее" || params.railingSide_1 == "две") {
					if (params.topPltRailing_4) isRightRailing = true;
				}
				//левая сторона
				if (params.railingSide_1 == "внешнее" || params.railingSide_1 == "две") {
					if (params.topPltRailing_3) isLeftRailing = true;
				}

			}

			var pltRailingAmt = 0;
			if (params.topPltRailing_3) pltRailingAmt += 1;
			if (params.topPltRailing_4) pltRailingAmt += 1;
			var rackAmt = pltRailingAmt * 2;
			if (isRightRailing) rackAmt -= 1;
			if (isLeftRailing) rackAmt -= 1;

			var rigelAmt = pltRailingAmt * params.rigelAmt;
			railingConnectionAmt += pltRailingAmt;

			var straightHoldersAmt = 0;
			if (params.topPltRailing_3) straightHoldersAmt += 1;
			if (params.topPltRailing_3 && (params.railingSide_1 == "нет" || params.railingSide_1 == "внешнее") && turnFactor == 1) straightHoldersAmt += 1;
			if (params.topPltRailing_3 && (params.railingSide_1 == "нет" || params.railingSide_1 == "внутреннее") && turnFactor == -1) straightHoldersAmt += 1;
			if (params.topPltRailing_4) straightHoldersAmt += 1;
			if (params.topPltRailing_4 && (params.railingSide_1 == "нет" || params.railingSide_1 == "внутреннее") && turnFactor == 1) straightHoldersAmt += 1;
			if (params.topPltRailing_4 && (params.railingSide_1 == "нет" || params.railingSide_1 == "внешнее") && turnFactor == -1) straightHoldersAmt += 1;
			if (params.topPltRailing_5) straightHoldersAmt += 2;

			if (handrailHolderFlanId == "handrailHolderFlanPlane") {
				item = {
					id: "handrailHolderStraight",
					amt: straightHoldersAmt,
					discription: "",
					unit: "Марш",
					itemGroup: "Ограждения"
				};
				if (item.amt > 0) partsList.addItem(item);
			}

			//боковые ограждения
			item = {
				id: rackId_plt,
				amt: rackAmt,
				discription: "Боковое ограждение площадки",
				unit: "Площадка",
				itemGroup: "Ограждение площадки"
			};
			if (item.amt > 0) partsList.addItem(item);

			item = {
				id: "handrail_plt3",
				amt: pltRailingAmt,
				discription: "Боковое ограждение площадки",
				unit: "Площадка",
				itemGroup: "Ограждение площадки"
			};
			if (item.amt > 0) partsList.addItem(item);

			item = {
				id: "rigel_plt3",
				amt: pltRailingAmt * params.rigelAmt,
				discription: "Боковое ограждение площадки",
				unit: "Площадка",
				itemGroup: "Ограждение площадки"
			};
			if (item.amt > 0) partsList.addItem(item);


			//задние ограждения
			if (params.topPltRailing_5) {
				pltRailingAmt += 1;
				rackAmt += 2;
				rigelAmt += params.rigelAmt;
				if (railingConnectionAmt != 0) railingConnectionAmt = railingConnectionAmt * 2;


				item = {
					id: rackId_plt,
					amt: 2,
					discription: "Заднее ограждение площадки",
					unit: "Площадка",
					itemGroup: "Ограждение площадки"
				};
				if (item.amt > 0) partsList.addItem(item);

				item = {
					id: "handrail_plt5",
					amt: 1,
					discription: "Заднее ограждение площадки",
					unit: "Площадка",
					itemGroup: "Ограждение площадки"
				};
				if (item.amt > 0) partsList.addItem(item);

				item = {
					id: "rigel_plt5",
					amt: 1 * params.rigelAmt,
					discription: "Заднее ограждение площадки",
					unit: "Площадка",
					itemGroup: "Ограждение площадки"
				};
				if (item.amt > 0) partsList.addItem(item);
			}

			//фурнитура ограждений площадки
			item = {
				id: "hexVint_M10x30",
				amt: rackAmt * 2,
				discription: "Крепление стоек площадки",
				unit: "Площадка",
				itemGroup: "Ограждение площадки"
			};
			if (item.amt > 0) partsList.addItem(item);

			if (params.isPlasticCaps == "есть") {
				item = {
					id: "plasticCap_M10",
					amt: rackAmt * 2,
					discription: "Колпачки",
					unit: "Марш",
					itemGroup: "Каркас",
				};
				if (item.amt > 0) partsList.addItem(item);
			}

			item = {
				id: "banisterInnerFlange",
				amt: rackAmt,
				discription: "Крепление стоек площадки",
				unit: "Площадка",
				itemGroup: "Ограждение площадки"
			};
			if (item.amt > 0) partsList.addItem(item);

			item = {
				id: "plasticPlug_40_40",
				amt: rackAmt,
				discription: "Заглушки низа стоек площадки",
				unit: "Площадка",
				itemGroup: "Ограждение площадки"
			};
			if (item.amt > 0) partsList.addItem(item);

			// item = {
			// 	id: "handrailHolderTurn",
			// 	amt: rackAmt,
			// 	discription: "Кронштейн поручня стоек площадки",
			// 	unit: "Площадка",
			// 	itemGroup: "Ограждение площадки"
			// 	};
			// if(item.amt > 0) partsList.addItem(item);

			item = {
				id: "vint_M6x10",
				amt: rackAmt,
				discription: "Крепление лодочки к штырю",
				unit: "Площадка",
				itemGroup: "Ограждение площадки"
			};
			if (item.amt > 0) partsList.addItem(item);

			item = {
				id: handrailHolderFlanId,
				amt: rackAmt,
				discription: "Лодочки поручня площадки",
				unit: "Площадка",
				itemGroup: "Ограждение площадки"
			};
			if (item.amt > 0) partsList.addItem(item);

			if (params.handrail != "Ф50 нерж.") {
				item = {
					id: "nut_M8",
					amt: rackAmt,
					discription: "Лодочки поручня площадки",
					unit: "Площадка",
					itemGroup: "Ограждение площадки"
				};
				if (item.amt > 0) partsList.addItem(item);
			}

			item = {
				id: "metalHandrailScrew",
				amt: rackAmt * 2,
				discription: "Поручни площадки",
				unit: "Площадка",
				itemGroup: "Ограждение площадки"
			};
			if (params.handrail == 'ПВХ') item.id = "timberHandrailScrew";
			if (item.amt > 0) partsList.addItem(item);

			var handrailPlugAmt = pltRailingAmt * 2;
			if (params.handrail == "Ф50 нерж.") handrailPlugAmt -= railingConnectionAmt;
			var handrailPlugId = "plasticPlug_40_20";
			if (params.handrail == "Ф50 нерж.") handrailPlugId = "stainlessPlug_50";
			if (params.handrail == "ПВХ") handrailPlugId = 'none';
			if (handrailPlugId !== 'none') {
				item = {
					id: handrailPlugId,
					amt: handrailPlugAmt,
					discription: "Поручни площадки",
					unit: "Площадка",
					itemGroup: "Ограждение площадки"
				};
				if (item.amt > 0) partsList.addItem(item);
			}



			var rigelPlugAmt = pltRailingAmt * params.rigelAmt;
			if (params.rigelMaterial == "Ф12 нерж.") rigelPlugAmt -= railingConnectionAmt * params.rigelAmt;

			item = {
				id: rigelPlugId,
				amt: rigelPlugAmt,
				discription: "Ригели площадки",
				unit: "Площадка",
				itemGroup: "Ограждение площадки"
			};
			if (item.amt > 0) partsList.addItem(item);

			item = {
				id: "rigelScrew",
				amt: rigelAmt * rackAmt,
				discription: "Ригели площадки",
				unit: "Площадка",
				itemGroup: "Ограждение площадки"
			};
			if (isRightRailing && !isLeftRailing) item.amt += params.rigelAmt * 1.0;
			if (isLeftRailing && !isRightRailing) item.amt += params.rigelAmt * 1.0;

			if (item.amt > 0) partsList.addItem(item);

			if (rigelHolderId != "") {
				item = {
					id: rigelHolderId,
					amt: rigelAmt * rackAmt,
					discription: "Ригели площадки",
					unit: "Площадка",
					itemGroup: "Ограждение площадки"
				};
				if (item.amt > 0) partsList.addItem(item);
			}

			//Шарниры и соединители

			//соединитель поручней
			var handrailConnectorId = "handrailConnector";
			if (params.handrail == "Ф50 нерж.") handrailConnectorId = "inoxHandrailJoint";

			item = {
				id: handrailConnectorId,
				amt: railingConnectionAmt,
				discription: "Соединение поручня марша и площадки",
				unit: "Площадка",
				itemGroup: "Ограждение площадки"
			};
			if (item.amt > 0) partsList.addItem(item);

			if (params.handrail != "Ф50 нерж.") {
				item = {
					id: "metalHandrailScrew",
					amt: railingConnectionAmt * 4,
					discription: "Крепление соединителя поручней",
					unit: "Площадка",
					itemGroup: "Ограждение площадки"
				};
				if (params.handrail == 'ПВХ') item.id = "timberHandrailScrew";
				if (item.amt > 0) partsList.addItem(item);
			}

			//соединитель ригелей
			if (params.rigelMaterial == "Ф12 нерж.") {
				item = {
					id: "inoxRigelJoint",
					amt: railingConnectionAmt * params.rigelAmt,
					discription: "Соединение ригелей",
					unit: "Площадка",
					itemGroup: "Ограждение площадки"
				};
				if (item.amt > 0) partsList.addItem(item);


			}




		} //end of площадка

		//end of addStandartPltItems
		if (typeof calculatedSpec !== 'undefined') calculatedSpec = partsList;

		//балюстрада На этапе тестирования и отладки спрятал
		//calcSpecBanister(partsList);

	}

	// вывод спецификации "Комплектовка"
	printSpecificationCollation(partsList, "vhod_test");
	// вывод спецификации "Сборка"
	//printSpecificationAssembly(partsList, "vhod_test");
	//включаем сортировку и поиск по таблица спецификаций
	$('.tab_4').tablesorter({
		widgets: ['zebra', 'filter'],
		theme: 'blue',
		usNumberFormat: false,
		sortReset: true,
		sortRestart: true,
	});

	showDrawingsLinks_vl();
	printPartsAmt();
}

function showDrawingsLinks_vl() {


	pathFrames = "/drawings/frames/";

	if (params.staircaseType == "Готовая") {
		var fileNameFrame = "04.pdf"

		var links = "<p>Типовые чертежи:</p>";
		//рамки
		links += "<a href='" + pathFrames + fileNameFrame + "' target='_blank'>Рамки PDF</a><br/>";
		//остальные детали
		links += '<a href="/images/parts/autocad/entrance_plasma_v.5.6.dxf" target="_blank">Контуры на плазму v.5.6 DXF</a><br />';
		links += '<a href="/images/parts/autocad/gotovie_vhod_5.6.pdf" target="_blank">Чертежи для цеха v.5.6 PDF</a><br />';
		links += '<a href="/images/parts/autocad/passport_1.2.pdf" target="_blank">Паспорт лестницы v.1.2 PDF</a><br />';
		if (params.pltExtenderSide != "нет")
			links += '<a href="/images/parts/autocad/pltExtenderSide_1.0.pdf" target="_blank">Добор площадки v.1.0 PDF</a><br />';
		if (params.topPltColumns == "подкосы" && params.platformTop != "нет")
			links += '<a href="/images/parts/autocad/brace_1.0.pdf" target="_blank">Подкос v.1.0 PDF</a><br />';

		$("#drawings").html(links)
	}

	if (params.staircaseType != "Готовая") {
		var fileNameFrame = "04.pdf"
		var isPlatform = false;
		if (params.stairModel != "Прямая") isPlatform = true;
		if (params.platformTop != "нет") isPlatform = true;

		var links = "<p>Типовые чертежи:</p>";
		//рамки
		if (params.stairType != "рифленая сталь") links += "<a href='" + pathFrames + fileNameFrame + "' target='_blank'>Рамки PDF</a><br/>";
		//остальные детали
		//links +='<a href="/images/parts/autocad/entrance_plasma_v.5.6.dxf" target="_blank">Контуры на плазму v.5.6 DXF</a><br />';
		//links +='<a href="/images/parts/autocad/gotovie_vhod_5.6.pdf" target="_blank">Чертежи для цеха v.5.6 PDF</a><br />';
		//links +='<a href="/images/parts/autocad/passport_1.2.pdf" target="_blank">Паспорт лестницы v.1.2 PDF</a><br />';
		if (params.pltExtenderSide != "нет")
			links += '<a href="/images/parts/autocad/pltExtenderSide_1.0.pdf" target="_blank">Добор площадки v.1.0 PDF</a><br />';
		if (params.topPltColumns == "подкосы")
			links += '<a href="/images/parts/autocad/brace_1.0.pdf" target="_blank">Подкос v.1.0 PDF</a><br />';
		if (params.topPltColumns == "колонны" && params.platformTop != "нет")
			links += '<a href="/drawings/carcas/column_100x50.pdf" target="_blank">Колонна 100х50 v.1.0 PDF</a><br />';
		if (params.railingSide_1 != "нет" || params.railingSide_3 != "нет")
			links += '<a href="/drawings/railing/rack.pdf" target="_blank">Стойка ограждения PDF</a><br />';

		if (params.stairType == "рифленая сталь") links += "<a href='/drawings/treads/steelTread.pdf' target='_blank'>Прямые ступени</a><br/>";
		if (params.stairType == "рифленая сталь" && isPlatform) links += "<a href='/drawings/treads/steelPlatform.pdf' target='_blank'>Площадки</a><br/>";

		$("#drawings").html(links)
	}


} //end of showDrawingsLinks