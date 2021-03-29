function calcRailingPrice(par) {

	var railingModel = par.railingModel;
	var metalPaint = par.metalPaint;
	var timberPaint = params.timberPaint;
	var handrailType = par.handrailType;
	var rackType = par.rackType;
	var rackBottom = par.rackBottom;
	var rigelType = par.rigelType;
	var rigelAmt_0 = par.rigelAmt_0;
	var banister1 = par.banister1;
	var banister2 = par.banister2;

	var priceDivId = par.priceDivId;
	var costDivId = par.costDivId;
	var glassHandrail = par.glassHandrail;

	if (railingModel == "Самонесущее стекло" || railingModel == "Кованые балясины" || railingModel == "Решетка") {
		par.rackAmt = 0
	}


	/*обнуляем цены*/
	var handrailTotalPrice = 0;
	var rigelTotalPrice = 0;
	var timberPaintTotalPrice = 0;
	var metalPaintTotalPrice = 0;
	var balTotalPrice = 0;
	var rackTotalPrice = 0;
	var fittingTotalPrice = 0;
	var glassTotalPrice = 0;
	var lasetTotalPrice = 0;
	var balPrice1 = 0;
	var balPrice2 = 0;
	var framePrice = 0;
	var kovkaWeldTotalPrice = 0;
	var totalCostPerila = 0;
	var railing_timber = 0;
	var railing_glass = 0;
	var kovkaMetalTotalPrice = 0;




	/*СЕБЕСТОИМОСТЬ ПОРУЧНЕЙ*/

	//параметры поручня
	var handrailPar = {
		prof: par.handrailProf,
		sideSlots: par.handrailSlots,
		handrailType: handrailType,
		metalPaint: metalPaint,
		timberPaint: timberPaint,
	}
	if (!handrailPar.prof) handrailPar.prof = params.handrailProf;
	if (!handrailPar.sideSlots) handrailPar.sideSlots = params.handrailSlots;
	if (railingModel == "Самонесущее стекло" || railingModel == "ограждения") {
		var hasSlot = false;
		if (par.railingName == "лестница" && params.handrailFixType == "паз") hasSlot = true;
		if (par.railingName == "балюстрада" && params.handrailFixType_bal == "паз") hasSlot = true;
		if (handrailPar.handrailType == "Ф50 нерж." && hasSlot) handrailPar.handrailType = "Ф50 нерж. с пазом";
	}

	handrailPar = calcHandrailMeterParams(handrailPar);

	var handrailMeterPrice = handrailPar.price;
	var handrailMat = handrailPar.mat;
	var handrailPaintMeterPrice = handrailPar.paintPrice;

	//учитываем пристенные поручни
	if (par.railingName == "лестница") {
		par.handrailLength_sum += getPartPropVal("sideHandrails", "sumLength", partsAmt);
	}


	if (metalPaint == "грунт" || metalPaint == "порошок") {
		metalPaintTotalPrice = handrailPaintMeterPrice * par.handrailLength_sum;
	}

	if (timberPaint != "нет") {
		timberPaintTotalPrice = handrailPaintMeterPrice * par.handrailLength_sum;
	}

	var handrailTotalPrice = handrailMeterPrice * par.handrailLength_sum;

	//добавляем цену в соответствующий цех
	if (handrailMat == "timber") railing_timber += (handrailMeterPrice * par.handrailLength_sum) * costMarkup;

	//кронштейны пристенных поручней

	if (par.railingName == "лестница") {
		handrailTotalPrice += getPartAmt("wallHandrailHolder") * 300;
	}


	/*СЕБЕСТОИМОСТЬ СТОЕК*/

	var rackPrice = 0;
	var rackPaintPrice = 0;
	var rackBottomCoverPrice = 0;
	var rackMat = "metal";
	if (rackType == "40х40 черн." || params.railingModel == "Трап") {
		rackPrice = 250;
		rackPaintPrice = 0;
		if (metalPaint == "грунт") rackPaintPrice = 100;
		if (metalPaint == "порошок") rackPaintPrice = 200;
		if (rackBottom == "сверху с крышкой") rackBottomCoverPrice = 50;
		metalPaintTotalPrice += rackPaintPrice * par.rackAmt;
	}
	if (rackType == "40х40 нерж.") {
		rackPaintPrice = 0;
		rackPrice = 500;
		if (rackBottom == "сверху с крышкой") rackBottomCoverPrice = 200;
	}
	if (rackType == "40х40 нерж+дуб") {
		rackPaintPrice = 0;
		rackPrice = 1500;
		var m2PaintPrice = calcTimberPaintPrice(timberPaint, "дуб");
		rackPaintPrice = m2PaintPrice * 0.2; //0.2 - подогнано

		if (rackBottom == "сверху с крышкой") rackBottomCoverPrice = 200;
		timberPaintTotalPrice += rackPaintPrice * par.rackAmt;
		rackMat = "timber"
	}
	var rackTotalPrice = (rackPrice + rackBottomCoverPrice) * par.rackAmt;

	//добавляем цену в соответствующий цех
	if (rackMat == "timber") {
		railing_timber += rackTotalPrice * 0.8 * costMarkup;
	}




	/*СЕБЕСТОИМОСТЬ РИГЕЛЕЙ*/

	var rigelMeterPrice = 0;
	var rigelPaintMeterPrice = 0;
	if (rigelType == "20х20 черн.") {
		rigelMeterPrice = 100;
		rigelHolderPrice = 2;
		rigelPlugPrice = 5;
		if (metalPaint == "грунт") rigelPaintMeterPrice = 50;
		if (metalPaint == "порошок") rigelPaintMeterPrice = 100;
		metalPaintTotalPrice += rigelPaintMeterPrice * par.rigelLength_sum;
	}
	if (rigelType == "20х20 нерж.") {
		rigelMeterPrice = 200;
		rigelHolderPrice = 20;
		rigelPlugPrice = 5;
	}
	if (rigelType == "Ф12 нерж.") {
		rigelMeterPrice = 200;
		rigelHolderPrice = 200;
		rigelPlugPrice = 100;
	}
	if (rigelType == "Ф16 нерж.") {
		rigelMeterPrice = 250;
		rigelHolderPrice = 200;
		rigelPlugPrice = 50;
	}

	if (railingModel == "Ригели" || railingModel == "ограждения") {
		var rigelTotalPrice = rigelMeterPrice * par.rigelLength_sum;
		if (par.rigelLength_sum) {
			//добавляем ригеледержатели
			rigelTotalPrice += rigelAmt_0 * par.rackAmt * rigelHolderPrice;
			//добавляем заглушки
			rigelTotalPrice += rigelPlugPrice * par.rigelAmt * 2;
		}

	}



	/*СЕБЕСТОИМОСТЬ СТЕКЛОДЕРЖАТЕЛЕЙ*/
	if (railingModel == "Стекло на стойках" || railingModel == "ограждения") {
		//стеклодержатели по 320 р/шт
		fittingTotalPrice = par.glassAmt * 4 * 320;
	}

	if (railingModel == "Экраны лазер") {
		fittingTotalPrice = par.glassAmt * 4 * 50;
	}

	if (railingModel == "Самонесущее стекло") {
		//рутеля по 350 р/шт
		fittingTotalPrice = par.glassAmt * 4 * 350;
		//выносные кронштейны поручня по 400 р/шт
		if (glassHandrail == "сбоку") fittingTotalPrice += par.glassAmt * 2 * 400;
	}



	/*СЕБЕСТОИМОСТЬ СТЕКОЛ*/

	var glassThk = 8;
	if (railingModel == "Самонесущее стекло") glassThk = 12;
	var m2Price = calcGlassCost(par.glassType, glassThk);
	if (railingModel == "Экраны лазер") m2Price = 0;

	if (par.railingName != "балюстрада") m2Price *= 1.15; //учитываем ромбовидность
	glassTotalPrice = par.glassArea * m2Price;

	if (glassHandrail == "сбоку" && railingModel == "Самонесущее стекло")
		glassTotalPrice = glassTotalPrice * 1.1;

	if (railingModel == "Экраны лазер") {
		var m2price = 3000;
		if (params.laserModel == "01") m2price = 4299;
		if (params.laserModel == "02") m2price = 3337;
		if (params.laserModel == "03") m2price = 2437;
		if (params.laserModel == "04") m2price = 2974;
		if (params.laserModel == "05") m2price = 2949;
		if (params.laserModel == "06") m2price = 6635;
		if (params.laserModel == "07") m2price = 3226;
		if (params.laserModel == "08") m2price = 4331;
		if (params.laserModel == "09") m2price = 3257;
		if (params.laserModel == "10") m2price = 4123;
		if (params.laserModel == "11") m2price = 3786;
		if (params.laserModel == "12") m2price = 3749;
		if (params.laserModel == "13") m2price = 4500;

		lasetTotalPrice = par.glassArea * m2price;
		if (metalPaint == "порошок") metalPaintTotalPrice += par.glassArea * 1000;
	}


	//добавляем цену в соответствующий цех
	railing_glass += glassTotalPrice * costMarkup;

	/*СЕБЕСТОИМОСТЬ КОВКИ*/
	//себестоимость балясин

	var balPrice1 = getBalPrice(banister1) * par.balAmt1; //стоимость балясин 1 типа
	var balPrice2 = getBalPrice(banister2) * par.balAmt2; //стоимость балясин 2 типа

	//стойки, рамки
	var frameLen = getPartPropVal("forgedSection", "sumLength", par.specObj)

	if (frameLen > 0) {
		var framePrice = frameLen * 200;
		var kovkaMetalTotalPrice = balPrice1 + balPrice2 + framePrice;

		//сборка секций
		kovkaWeldTotalPrice = frameLen * 800;

		//покраска
		var kovkaPaintPrice = 0; //общая стоимость покраски ограждения
		if (metalPaint == "грунт") kovkaPaintPrice = frameLen * 300;
		if (metalPaint == "порошок") kovkaPaintPrice = frameLen * 500;




		//обнуляем цену металлического поручня
		if (railingModel == "Кованые балясины") {
			if (handrailType == "40х20 черн.") handrailTotalPrice = 0;
			if (handrailType == "40х40 черн.") handrailTotalPrice = 0;
			if (handrailType == "60х30 черн.") handrailTotalPrice = 0;
			if (handrailType == "кованый полукруглый") handrailTotalPrice = 0;
		}

	}

	if (railingModel == 'Кресты') {
		//стойки, рамки
		var crossProfLen = getPartPropVal("crossProfile", "sumLength", par.specObj);
		var crossProfAmt = getPartPropVal("crossProfile", "amt", par.specObj);

		if (frameLen > 0) {
			var crossProfilePrice = crossProfLen * getProfParams(params.crossProfile).unitCost;
			kovkaMetalTotalPrice = framePrice + crossProfilePrice;

			//сборка секций
			kovkaWeldTotalPrice = frameLen * 800 + crossProfAmt * 100;
		}
	}

	if (railingModel == "Дерево с ковкой" || balPrice1 || balPrice2) {

		var kovkaMetalTotalPrice = balPrice1 + balPrice2;

		//покраска
		var kovkaPaintPrice = 0; //общая стоимость покраски ограждения
		if (metalPaint == "грунт") kovkaPaintPrice = par.handrailLength_sum * 300;
		if (metalPaint == "порошок") kovkaPaintPrice = par.handrailLength_sum * 500;
	}

	/*СЕБЕСТОИМОСТЬ ДЕРЕВЯННЫХ БАЛЯСИН И СТОЛБОВ*/

	if (railingModel == "Деревянные балясины" || railingModel == "Стекло" || railingModel == "Дерево с ковкой" || par.timberNewellAmt) {
		var balWorkPrice = 400 / 5; //400р/час, 5 балясин в час
		var rackWorkPrice = 400 / 3; //400р/час, 3 столба в час

		var m3Price_bal = calcTimberParams(params.timberBalMaterial).m3Price;
		var m3Price_newell = calcTimberParams(params.newellsMaterial).m3Price;

		var balMatPrice = 0.06 * 0.06 * 1 * m3Price_bal; //заготовка клеится 60х60
		var rackMatPrice = 0.12 * 0.12 * 1.2 * m3Price_newell; //заготовка клеится 120х120

		var balPrice = balWorkPrice + balMatPrice;
		var rackPrice = rackWorkPrice + rackMatPrice;

		balTotalPrice = balPrice * par.balAmt;
		rackTotalPrice = rackPrice * par.rackAmt;
		if (railingModel == "ограждения") rackTotalPrice = rackPrice * par.timberNewellAmt;

		//старотвые столбы
		if (getPartAmt('startNewell', par.specObj) > 0) {
			for (var type in par.specObj.startNewell.types) {
				var newellcost = 10000;
				if (type == '01') newellcost = 25000;
				if (type == '02') newellcost = 40000;
				if (type == '03') newellcost = 10000;
				if (type == '04') newellcost = 15000;
				if (type == '05') newellcost = 10000;
				if (type == '06') newellcost = 6000;
				if (type == '07') newellcost = 6000;
				if (type == '08') newellcost = 6000;

				rackTotalPrice += newellcost * par.specObj.startNewell.types[type];

			}
		}

		//добавляем цену в соответствующий цех
		railing_timber += (balTotalPrice + rackTotalPrice) * costMarkup;

		if (timberPaint != "нет") {
			var m2PaintPrice = calcTimberPaintPrice(timberPaint, par.timberBalMaterial);
			var balPaintPrice = m2PaintPrice * par.balAmt * 0.2; //0.2 - подогнано
			var rackPaintPrice = m2PaintPrice * par.rackAmt * 0.4; //0.4 - подогнано

			timberPaintTotalPrice = timberPaintTotalPrice + balPaintPrice + rackPaintPrice;
		}
	}

	if (railingModel == "Частые стойки") {
		balPrice = 350;
		if (params.balMaterial_bal == "хром") balPrice = 600;
		balTotalPrice = balPrice * par.balAmt;

	}

	if (railingModel == "Реечные") {
		var ralingPricePar = {
			racksLength: params.racksType == "металл" ? getPartPropVal("racksMetalPole", "sumLength") : getPartPropVal("racksTimberPole", "sumLength"),
			racksProfile: params.racksProfile,
			racksType: params.racksType,
			racksMaterial: params.timberBalMaterial
		};
		var railingPrices = calcRackWallPrice(ralingPricePar);
		railingParams.rackLength_sum = railingPrices.racksLength;
		balTotalPrice = railingPrices.balPrice;

		//покраска дерева
		if (timberPaint != "нет" && (params.racksType == "массив" || params.racksType == "шпон")) {
			timberPaintTotalPrice += railingPrices.paintPrice;
		}

		//покраска металла
		if (metalPaint == "порошок" && params.racksType == "металл") {
			metalPaintTotalPrice += railingPrices.paintPrice;
		}
	}


	/*ИТОГОВАЯ ЦЕНА*/

	var railingPrice = 0;
	var glassPrice = 0;


	if (railingModel == "Ригели" || params.railingModel == "Трап") {
		railingPrice = (handrailTotalPrice + rackTotalPrice + rigelTotalPrice) * costMarkup;
	}

	if (railingModel == "Стекло на стойках")
		railingPrice = (handrailTotalPrice + rackTotalPrice + fittingTotalPrice + glassTotalPrice) * costMarkup;
	if (railingModel == "ограждения")
		railingPrice = (handrailTotalPrice + rackTotalPrice + fittingTotalPrice + glassTotalPrice + rigelTotalPrice + kovkaMetalTotalPrice) * costMarkup;
	if (railingModel == "Самонесущее стекло") {
		railingPrice = (handrailTotalPrice + fittingTotalPrice + glassTotalPrice) * costMarkup;
	}
	if (railingModel == "Кованые балясины" || railingModel == "Решетка" || railingModel == 'Кресты') {
		railingPrice = (kovkaMetalTotalPrice + kovkaWeldTotalPrice + handrailTotalPrice) * costMarkup;
		metalPaintTotalPrice = kovkaPaintPrice * costMarkup;
	}
	if (railingModel == "Деревянные балясины") {
		railingPrice = (handrailTotalPrice + rackTotalPrice + balTotalPrice) * costMarkup;
		metalPaintTotalPrice = 0;
	}
	if (railingModel == "Стекло") {
		railingPrice = (handrailTotalPrice + rackTotalPrice + glassTotalPrice) * costMarkup;
		metalPaintTotalPrice = 0;
	}
	if (railingModel == "Частые стойки") {
		railingPrice = (handrailTotalPrice + balTotalPrice) * costMarkup;
		metalPaintTotalPrice = 0;
	}
	if (railingModel == "Дерево с ковкой") {
		railingPrice = (handrailTotalPrice + rackTotalPrice + kovkaMetalTotalPrice) * costMarkup;
		metalPaintTotalPrice = kovkaPaintPrice * costMarkup;
	}
	if (railingModel == "Экраны лазер") {
		railingPrice = (handrailTotalPrice + rackTotalPrice + lasetTotalPrice) * costMarkup;
	}
	if (railingModel == "Реечные") {
		railingPrice = (handrailTotalPrice + balTotalPrice) * costMarkup;
	}

	metalPaintTotalPrice = metalPaintTotalPrice * costMarkup;
	timberPaintTotalPrice = timberPaintTotalPrice * costMarkup;
	handrailTotalPrice = handrailTotalPrice * costMarkup;
	rackTotalPrice = rackTotalPrice * costMarkup;
	rigelTotalPrice = rigelTotalPrice * costMarkup;
	glassTotalPrice = glassTotalPrice * costMarkup;
	fittingTotalPrice = fittingTotalPrice * costMarkup;
	balPrice1 = balPrice1 * costMarkup;
	balPrice2 = balPrice2 * costMarkup;
	framePrice = framePrice * costMarkup;
	kovkaWeldTotalPrice = kovkaWeldTotalPrice * costMarkup;

	var margin = 3 / costMarkup;
	var marginPaint = 2 / costMarkup; //наценка на покраску

	var totalPrice_0 = Math.round(railingPrice * margin);
	metalPaintTotalPrice = Math.round(metalPaintTotalPrice * marginPaint);
	timberPaintTotalPrice = Math.round(timberPaintTotalPrice * marginPaint);
	var totalPrice_1 = Math.round(totalPrice_0 + metalPaintTotalPrice + timberPaintTotalPrice);

	if (railingModel == "Ригели" || params.railingModel == "Трап")
		totalCostPerila = handrailTotalPrice + rackTotalPrice + rigelTotalPrice // + (metalPaintTotalPrice/marginPaint) + (timberPaintTotalPrice/marginPaint);
	if (railingModel == "Стекло на стойках")
		totalCostPerila = handrailTotalPrice + rackTotalPrice + fittingTotalPrice + glassTotalPrice // + (metalPaintTotalPrice/marginPaint) + (timberPaintTotalPrice/marginPaint);
	if (railingModel == "ограждения")
		totalCostPerila = handrailTotalPrice + rackTotalPrice + fittingTotalPrice + glassTotalPrice + rigelTotalPrice + kovkaMetalTotalPrice + (metalPaintTotalPrice / marginPaint) + (timberPaintTotalPrice / marginPaint);
	if (railingModel == "Самонесущее стекло")
		totalCostPerila = handrailTotalPrice + glassTotalPrice + fittingTotalPrice // + (metalPaintTotalPrice/marginPaint) + (timberPaintTotalPrice/marginPaint);
	if (railingModel == "Кованые балясины" || railingModel == "Решетка")
		totalCostPerila = handrailTotalPrice + balPrice1 + balPrice2 + framePrice + kovkaWeldTotalPrice // + (metalPaintTotalPrice/marginPaint) + (timberPaintTotalPrice/marginPaint);
	if (railingModel == "Кресты") totalCostPerila = handrailTotalPrice + kovkaMetalTotalPrice + kovkaWeldTotalPrice;
	if (railingModel == "Деревянные балясины")
		totalCostPerila = handrailTotalPrice + rackTotalPrice + balTotalPrice // + (metalPaintTotalPrice/marginPaint) + (timberPaintTotalPrice/marginPaint);
	if (railingModel == "Стекло")
		totalCostPerila = handrailTotalPrice + rackTotalPrice + glassTotalPrice // + (metalPaintTotalPrice/marginPaint) + (timberPaintTotalPrice/marginPaint);
	if (railingModel == "Частые стойки")
		totalCostPerila = handrailTotalPrice + balTotalPrice // + (timberPaintTotalPrice/marginPaint);

	if (railingModel == "Дерево с ковкой")
		totalCostPerila = handrailTotalPrice + rackTotalPrice + balPrice1 + balPrice2;

	if (railingModel == "Экраны лазер")
		totalCostPerila = handrailTotalPrice + rackTotalPrice + lasetTotalPrice // + (metalPaintTotalPrice/marginPaint) + (timberPaintTotalPrice/marginPaint);

	if (railingModel == "Реечные")
		totalCostPerila = handrailTotalPrice + balTotalPrice;


	/*глобальные переменные для расчета общей себестоимости*/

	if (par.railingName == "лестница") {
		staircaseCost.railingHandrails = handrailTotalPrice;
		staircaseCost.railingRigels = rigelTotalPrice;
		staircaseCost.railingTimberPaint = timberPaintTotalPrice / marginPaint;
		staircaseCost.railingMetalPaint = metalPaintTotalPrice / marginPaint * calcMetalPaintCostFactor("railing"); //функция в файле priceLib
		staircaseCost.railingBal = balTotalPrice;
		staircaseCost.railingRacks = rackTotalPrice;
		staircaseCost.railingFittings = fittingTotalPrice;
		staircaseCost.railingGlass = glassTotalPrice;
		staircaseCost.railingLaser = lasetTotalPrice;
		staircaseCost.railingBal1 = balPrice1;
		staircaseCost.railingBal2 = balPrice2;
		staircaseCost.railingFrames = framePrice;
		staircaseCost.railingCross = crossProfilePrice || 0;
		staircaseCost.railingWeld = kovkaWeldTotalPrice;
		staircaseCost.railing = totalCostPerila;
	}

	if (par.railingName == "балюстрада") {
		staircaseCost.banisterHandrails = handrailTotalPrice;
		staircaseCost.banisterRigels = rigelTotalPrice;
		staircaseCost.banisterTimberPaint = timberPaintTotalPrice / marginPaint;
		staircaseCost.banisterMetalPaint = metalPaintTotalPrice / marginPaint * calcMetalPaintCostFactor("banister"); //функция в файле priceLib
		staircaseCost.banisterBal = balTotalPrice;
		staircaseCost.banisterRacks = rackTotalPrice;
		staircaseCost.banisterFittings = fittingTotalPrice;
		staircaseCost.banisterGlass = glassTotalPrice;
		staircaseCost.banisterLaser = lasetTotalPrice;
		staircaseCost.banisterBal1 = balPrice1;
		staircaseCost.banisterBal2 = balPrice2;
		staircaseCost.banisterFrames = framePrice;
		staircaseCost.banisterWeld = kovkaWeldTotalPrice;
		staircaseCost.banister = totalCostPerila;
	}

	/*глобальные переменные для расчета общей цены*/

	if (par.railingName == "лестница") {
		setPrice('railing', totalPrice_0);
		setPrice('railingMetalPaint', metalPaintTotalPrice);
		setPrice('railingTimberPaint', timberPaintTotalPrice);

		//доля в общей цене ограждения (для модуля railing рассчитывается внутри ее функции calcRailingModulePrice)
		if (params.calcType != "railing") {
			setPrice('railing_timber', Math.round(railing_timber * margin));
			setPrice('railing_glass', Math.round(railing_glass * margin));
			setPrice('railing_metal', totalPrice_0 - priceObj['railing_timber'].discountPrice - priceObj['railing_glass'].discountPrice);

			staircaseCost.railing_timber_part = priceObj['railing_timber'].discountPrice / totalPrice_0;
			staircaseCost.railing_glass_part = priceObj['railing_glass'].discountPrice / totalPrice_0;
			if (!staircaseCost.railing_timber_part) staircaseCost.railing_timber_part = 0;
			if (!staircaseCost.railing_glass_part) staircaseCost.railing_glass_part = 0;
		}
	}

	if (par.railingName == "балюстрада") {
		setPrice('banister', totalPrice_0);
		setPrice('banisterMetalPaint', metalPaintTotalPrice);
		setPrice('banisterTimberPaint', timberPaintTotalPrice);

		setPrice('banister_timber', Math.round(railing_timber * margin));
		setPrice('banister_glass', Math.round(railing_glass * margin));
		setPrice('banister_metal', totalPrice_0 - priceObj['banister_timber'].discountPrice - priceObj['banister_glass'].discountPrice);

		//доля в общей цене ограждения
		staircaseCost.banister_timber_part = priceObj['banister_timber'].discountPrice / totalPrice_0;
		staircaseCost.banister_glass_part = priceObj['banister_glass'].discountPrice / totalPrice_0;
		if (!staircaseCost.banister_timber_part) staircaseCost.banister_timber_part = 0;
		if (!staircaseCost.banister_glass_part) staircaseCost.banister_glass_part = 0;
	}

} //end of calcRailingPrice


function printRailingPrice(geomParams) {

	var text = "<h4>Расчетные характеристики ограждений: </h4>";
	//поручни
	if (geomParams.handrailLength_sum) text +=
		"Кол-во поручней = " + geomParams.handrailAmt + "шт;<br/>" +
		"Общая длина поручней = " + geomParams.handrailLength_sum + "м<br/>";

	//ригели	
	if (geomParams.rigelAmt) text +=
		"Кол-во ригелей = " + geomParams.rigelAmt + "шт;<br/>" +
		"Общая длина ригелей = " + geomParams.rigelLength_sum + "м<br/>";

	//стойки
	if (geomParams.rackAmt) text +=
		"Кол-во стоек = " + geomParams.rackAmt + "шт;<br/>";

	//стекло
	if (geomParams.glassAmt) text +=
		"Кол-во стекол = " + geomParams.glassAmt + "шт;<br/>" +
		"Общая площадь стекол = " + geomParams.glassArea + "м2;<br/>";

	//кованые балясины
	if (geomParams.balAmt1 || geomParams.balAmt2) text +=
		"Кол-во балясин тип 1 = " + geomParams.balAmt1 + "шт;<br/>" +
		"Кол-во балясин тип 2 = " + geomParams.balAmt2 + "шт;<br/>";

	//деревянные балясины или частые стойки
	if (geomParams.balAmt) text +=
		"Кол-во балясин " + geomParams.balAmt + "шт;<br/>";

	//общая стоимость ограждений
	if (geomParams.railingName == "лестница")
		text +=
		"Общая стоимость ограждений = " + priceObj['railing'].discountPrice + "руб;<br/>";
	if (geomParams.railingName == "балюстрада")
		text += "<h3>Стоимость ограждений:</h3>" +
		"Общая стоимость ограждений = " + priceObj['banister'].discountPrice + "руб;<br/>";

	//стоимость покраски

	if (geomParams.railingName == "лестница") {
		if (priceObj['railingMetalPaint'].discountPrice || priceObj['railingTimberPaint'].discountPrice) {
			text += "<h3>Дополнительные услуги:</h3>";
			if (priceObj['railingMetalPaint'].discountPrice) text +=
				"Покраска металла: " + priceObj['railingMetalPaint'].discountPrice + " руб; <br/>";
			if (priceObj['railingTimberPaint'].discountPrice) text +=
				"Покраска дерева: " + priceObj['railingTimberPaint'].discountPrice + " руб; <br/>";
		}
	}

	if (geomParams.railingName == "балюстрада") {
		if (priceObj['banisterMetalPaint'].discountPrice != 0 || priceObj['banisterTimberPaint'].discountPrice != 0) {
			text += "<h3>Дополнительные услуги:</h3>";
			if (priceObj['banisterMetalPaint'].discountPrice != 0) text +=
				"Покраска металла: " + priceObj['banisterMetalPaint'].discountPrice + " руб; <br/>";
			if (priceObj['banisterTimberPaint'].discountPrice != 0) text +=
				"Покраска дерева: " + priceObj['banisterTimberPaint'].discountPrice + " руб; <br/>";
		}
	}

	$("#" + geomParams.priceDivId).html(text);

} //end of printRailingPrice

function printRailingCost(railingName, outputDivId) {

	//Округляем все цифры

	for (var prop in staircaseCost) {
		if (!isNaN(staircaseCost[prop]) && prop != "timberPart") {
			staircaseCost[prop] = Math.round(staircaseCost[prop]);
			if (priceObj[prop]) {
				priceObj[prop].cost = staircaseCost[prop]
			}
		};
	}

	var text = "";
	if (railingName == "лестница") {
		text +=
			"Поручни: " + staircaseCost.railingHandrails + " руб; <br/>" +
			"Ригели: " + staircaseCost.railingRigels + " руб; <br/>" +
			"Деревянные балясины: " + staircaseCost.railingBal + " руб; <br/>" +
			"Столбы/стойки: " + staircaseCost.railingRacks + " руб; <br/>" +
			"Стеклодержатели: " + staircaseCost.railingFittings + " руб; <br/>" +
			"Стекло: " + staircaseCost.railingGlass + " руб; <br/>" +
			"Экраны лазер: " + staircaseCost.railingLaser + " руб; <br/>" +
			"Кованые балясины тип 1: " + staircaseCost.railingBal1 + " руб; <br/>" +
			"Кованые балясины тип 2: " + staircaseCost.railingBal2 + " руб; <br/>" +
			"Рамки для ковки: " + staircaseCost.railingFrames + " руб; <br/>" +
			"Кресты ограждений: " + staircaseCost.railingCross + " руб; <br/>" +
			"Сварка кованых секций: " + staircaseCost.railingWeld + " руб; <br/>" +
			"<b>Итого ограждения: " + staircaseCost.railing + " руб; </b><br/>" +
			"Покраска дерева: " + staircaseCost.railingTimberPaint + " руб; <br/>" +
			"Покраска металла: " + staircaseCost.railingMetalPaint + " руб; <br/>";
	}
	if (railingName == "балюстрада") {
		text +=
			"Поручни: " + staircaseCost.banisterHandrails + " руб; <br/>" +
			"Ригели: " + staircaseCost.banisterRigels + " руб; <br/>" +
			"Балясины: " + staircaseCost.banisterBal + " руб; <br/>" +
			"Столбы/стойки: " + staircaseCost.banisterRacks + " руб; <br/>" +
			"Стеклодержатели: " + staircaseCost.banisterFittings + " руб; <br/>" +
			"Стекло: " + staircaseCost.banisterGlass + " руб; <br/>" +
			"Экраны лазер: " + staircaseCost.banisterLaser + " руб; <br/>" +
			"Кованые балясины тип 1: " + staircaseCost.banisterBal1 + " руб; <br/>" +
			"Кованые балясины тип 2: " + staircaseCost.banisterBal2 + " руб; <br/>" +
			"Рамки для ковки: " + staircaseCost.banisterFrames + " руб; <br/>" +
			"Сварка кованых секций: " + staircaseCost.banisterWeld + " руб; <br/>" +
			"<b>Итого ограждения: " + staircaseCost.banister + " руб; </b><br/>" +
			"Покраска дерева: " + staircaseCost.banisterTimberPaint + " руб; <br/>" +
			"Покраска металла: " + staircaseCost.banisterMetalPaint + " руб; <br/>";

	}

	$("#" + outputDivId).html(text);

} //end of printRailingCost


/**функция подготоавливает данные для calcRailingPrice и вызывает ее
 */

function calculateRailingPrice2() {

	//извлекаем кол-ва из глобального массива счетчиков

	railingParams.handrailAmt = getPartAmt("handrails");
	railingParams.handrailLength_sum = getPartPropVal("handrails", "sumLength");
	railingParams.rigelAmt = getPartAmt("rigels");
	railingParams.rigelLength_sum = getPartPropVal("rigels", "sumLength");
	railingParams.rackAmt = getPartAmt("racks");
	railingParams.balAmt1 = getPartPropVal("forgedBal", "amt1");
	railingParams.balAmt2 = getPartPropVal("forgedBal", "amt2");
	railingParams.glassAmt = getPartAmt("glasses");
	railingParams.glassArea = getPartPropVal("glasses", "sumArea");
	if (params.railingModel == "Трап") railingParams.rackAmt = getPartAmt("ladderBal");

	if (params.railingModel == "Деревянные балясины" || params.railingModel == "Стекло" || params.railingModel == "Дерево с ковкой") {
		railingParams.balAmt = getPartAmt("timberBal");
		railingParams.rackAmt = getPartAmt("timberNewell");
	}

	/***  РАСЧЕТ ЦЕНЫ  ***/

	//добавляем информацию о конструкции ограждений в массив параметров
	railingParams.railingName = "лестница";
	railingParams.metalPaint = params.metalPaint_railing;
	railingParams.timberPaint = params.timberPaint;
	railingParams.handrailType = params.handrail;
	railingParams.rackType = params.banisterMaterial;
	railingParams.rackBottom = params.rackBottom;
	railingParams.rigelType = params.rigelMaterial;
	railingParams.rigelAmt_0 = params.rigelAmt;
	railingParams.railingModel = params.railingModel;
	railingParams.railingTimber = params.railingTimber;
	railingParams.banister1 = params.banister1;
	railingParams.banister2 = params.banister2;
	railingParams.glassType = params.glassType;

	//блоки, куда выводить данные
	railingParams.priceDivId = "resultPerila";
	railingParams.costDivId = "cost_perila";

	staircaseCost.metalRailing = 0;
	staircaseCost.stockRailing = 0;
	staircaseCost.timberRailing = 0;

	railingParams.specObj = partsAmt;

	calcRailingPrice(railingParams); //функция находится в файле /calculator/general/priceLib.js


} //Конец функции calculateRailingPrice()

/** функция рассчитывает общую цену изделия и скидку на основе данных из массива staircaseCost
Данные добавляются в глобальный массив priceObj
*/

function calculateTotalPrice2() {

	//формирование структуры единого объекта с ценой и себестоимостью

	priceObj = {
		carcas: {
			name: "Каркас"
		},
		treads: {
			name: "Ступени"
		},
		railing: {
			name: "Ограждения"
		},
		banister: {
			name: "Балюстрада"
		},
		assembling: {
			name: "Установка"
		},
		delivery: {
			name: "Доставка"
		},
	}

	if (params.calcType == "vint") {
		priceObj.carcas.name = "Лестница"
	}

	if (params.calcType == "tables" || params.calcType == "racks") {
		priceObj = {
			carcas: {
				name: "Каркас"
			},
			countertop: {
				name: "Столешница"
			},
			shelfs: {
				name: "Полки"
			},
			drawers: {
				name: "Тумбы"
			},
			assembling: {
				name: "Сборка"
			},
			delivery: {
				name: "Доставка"
			},
		};
	}

	if (params.calcType == "coupe") {
		priceObj = {
			carcas: {
				name: "Каркас"
			},
			content: {
				name: "Наполнение"
			},
			doors: {
				name: "Двери"
			},
			assembling: {
				name: "Сборка"
			},
			delivery: {
				name: "Доставка"
			},
		};
	}

	if (params.calcType == "carport") {
		priceObj = {
			carcas: {
				name: "Каркас"
			},
			roof: {
				name: "Кровля"
			},
			assembling: {
				name: "Установка"
			},
			delivery: {
				name: "Доставка"
			},
		}
	}

	if (params.calcType == "veranda") {
		priceObj.cannopy = {
			name: "Навес"
		};
	}

	if (params.calcType == "railing") {
		priceObj.treads.name = "Обшивка";
	}

	if (window.additional_objects) {
		var calcPriceObjects = additional_objects.filter(function (item) {
			return item.calc_price
		});
		if (calcPriceObjects.length > 0) {
			calcPriceObjects.forEach(function (item) {
				var price = eval(item.className + '.calcPrice(item)');
				price.is_additional_object = true;
				if (item.meshParams.objectAmt && item.meshParams.objectAmt > 1) {
					price.objectAmt = item.meshParams.objectAmt;
				}
				priceObj[item.className + '_' + item.id] = price;
			});
		}
	}

	for (var unit in priceObj) {
		var name = priceObj[unit].name;
		priceObj[unit] = Object.assign(priceObj[unit], {
			price: 0,
			discount: 0,
			discountPrice: 0
		});
		if (priceObj[unit].cost == undefined) priceObj[unit].cost = 0;
		if (priceObj[unit].priceFactor == undefined) priceObj[unit].priceFactor = params[unit + "PriceFactor"];
		if (priceObj[unit].costFactor == undefined) priceObj[unit].costFactor = params[unit + "CostFactor"];

		if (unit == "banister") {
			priceObj[unit].priceFactor = params.railingPriceFactor;
			priceObj[unit].costFactor = params.railingCostFactor;
		}
		if (unit == "delivery") {
			priceObj[unit].priceFactor = 1;
			priceObj[unit].costFactor = 1;
		}
		/*
		if(params.calcType == "vint"){
			if(unit == "carcas" || unit == "treads" || unit == "railing" || unit == "wr"){
				priceObj[unit].priceFactor = params.staircasePriceFactor;
				priceObj[unit].costFactor = params.staircaseCostFactor;
				}
			if(unit == "banister"){
				priceObj[unit].priceFactor = params.balustradePriceFactor;
				priceObj[unit].costFactor = params.balustradeCostFactor;
				}
			}
		*/

		if (!priceObj[unit].priceFactor) {
			priceObj[unit].priceFactor = 1;
			alertTrouble("Для модуля " + name + " не задан к-т на цену.", 'forms', true);
		}
		if (!priceObj[unit].costFactor) {
			priceObj[unit].costFactor = 1;
			alertTrouble("Для модуля " + name + " не задан к-т на себестоимость.", 'forms', true);
		}
		//дополнительные услуги
		// if (unit == "assembling" || unit == "delivery") priceObj[unit].isOption = true;
	};

	//распределение позиций объекта staircaseCost по частям лестницы

	var unitItems = {
		carcas: ["stringer", "angles", "bolts", "bolz", "frames", "columns", "carcasMetalPaint"],
		treads: ["treads", "carcasTimberPaint"],
		railing: ["railing", "railingTimberPaint", "railingMetalPaint"],
		banister: ["banister", "banisterTimberPaint", "banisterMetalPaint"],
		assembling: ["assembling"],
		delivery: ["delivery"],
	};

	if (params.calcType == "vint") {
		var unitItems = {
			carcas: ["treads", "platform", "spacers", "stringers", "racks", "handrail", "staircaseMetalPaint", "staircaseTimberPaint"],
			banister: ["banister", "banisterTimberPaint", "banisterMetalPaint"],
		}
	}

	if (params.calcType == "tables" || params.calcType == "racks") {
		var unitItems = {
			carcas: ["carcas", "carcasMetalPaint", "carcasTimberPaint"],
			countertop: ["countertop", "topMetalPaint", "topTimberPaint"],
			shelfs: ["shelfs", "timberPaint"],
		}
	}

	if (params.calcType == "coupe") {
		var unitItems = {
			carcas: ['carcas'],
			content: ['content'],
			doors: ['doors'],
			assembling: ["assembling"],
			delivery: ["delivery"]
		}
	}

	if (params.calcType == "carport") {
		var unitItems = {
			carcas: ["truss", "beams", "columns", "flans", "progon", "bolts", "carcasMetalPaint"],
			roof: ["roof", "roofProf", "roofShim", "drain"],
		}
	}

	if (params.calcType == "veranda") {
		unitItems.carcas.push("platform")
		unitItems.cannopy = ["truss", "beams", "columns", "flans", "progon", "bolts", "carcasMetalPaint", "roof", "roofProf", "roofShim", "drain"];

	}

	if (params.calcType == "railing") {
		var unitItems = {
			railing: ["railing"], //в эту позицию входят все остальные, относящиеся к ограждениям
			treads: ["treads", "skirting", "risers"],
			assembling: ["assembling"],
			delivery: ["delivery"]
		}
	}
	var errorText = "";
	for (var item in staircaseCost) {
		var isItemAdded = false; //добавлен ли данный элемент в какой-либо unit
		for (var unit in unitItems) {
			if (unitItems[unit].indexOf(item) != -1) {
				if (staircaseCost[item]) priceObj[unit].cost += staircaseCost[item];
				isItemAdded = true;
			}
		}
		if (!isItemAdded) errorText += item + " ";
	};
	
	//монтаж и доставка
	priceObj["assembling"].cost = Math.round(calcAssemblingWage().totalWage * params.assemblingCostFactor);
	priceObj["delivery"].cost = Math.round(calcDeliveryCost());
	
	//для всех позиций считаем цену исходя из себестоимости и наценки	
	var productionPrice = 0; //общая цена изделия без учета скидки
	for (var unit in priceObj) {
		if (priceObj[unit].cost) {
			var priceCoefficients = getPriceCoefficients(priceObj[unit]);
			priceObj[unit].price = Math.round(priceObj[unit].cost * priceObj[unit].priceFactor * priceCoefficients.margin);
			priceObj[unit].cost = Math.round(priceObj[unit].cost * priceObj[unit].costFactor * priceCoefficients.costFactor);

			if (priceObj[unit].is_additional_object && priceObj[unit].objectAmt && priceObj[unit].objectAmt > 1) {
				priceObj[unit].pricePerItem = priceObj[unit].price;
				priceObj[unit].costPerItem = priceObj[unit].cost;
				priceObj[unit].price *= priceObj[unit].objectAmt;
				priceObj[unit].cost *= priceObj[unit].objectAmt;
			}

			if (unit != "assembling" && unit != "delivery") productionPrice += priceObj[unit].price;
		}
	}
	
	//стоимость сборки должна быть не менее 20% стоимости изделия
	if(params.isAssembling != "нет"){
		if (priceObj["assembling"].price < productionPrice * 0.2) priceObj["assembling"].price = Math.round(productionPrice * 0.2);
		
		//если доставка включена в монтаж
		if(params.deliveryInAssembling == "да") {
			priceObj["assembling"].price += priceObj["delivery"].price;
			priceObj["delivery"].price = 0;
		}
	}
	
	//общая цена заказа
	var totalPrice = productionPrice + priceObj["assembling"].price + priceObj["delivery"].price;

	for (var unit in priceObj) {
		priceObj[unit].discount = Math.round(priceObj[unit].price * params.discountFactor / 100);
		priceObj[unit].discountPrice = Math.round(priceObj[unit].price - priceObj[unit].discount);
	}

	//подсчет скидки
	if (params.discountMode == "процент") {
		for (var unit in priceObj) {
			priceObj[unit].discount = Math.round(priceObj[unit].price * params.discountFactor / 100);
			if (priceObj[unit].isOption) priceObj[unit].discount = 0;
			priceObj[unit].discountPrice = Math.round(priceObj[unit].price - priceObj[unit].discount);
		}
	}

	if (params.discountMode != "процент") {
		if (params.discountMode == "скидка") {
			var discountSum = params.discountFactor;
		}
		if (params.discountMode == "цена") {
			var discountSum = totalPrice - params.discountFactor;
		}
		//распределяем скидку пропорционально между всеми позициями
		var discountSum2 = 0;
		for (var unit in priceObj) {
			if (!priceObj[unit].isOption) {
				priceObj[unit].discount = Math.round(discountSum * priceObj[unit].price / productionPrice);
			}
			if (priceObj[unit].isOption) {
				priceObj[unit].discount = 0;
			}
			priceObj[unit].discountPrice = Math.round(priceObj[unit].price - priceObj[unit].discount);
			discountSum2 += priceObj[unit].discount;
		};

		//устраняем ошибку округления
		if (discountSum2 != discountSum) {
			var delta = discountSum2 - discountSum;
			//ищем первый ненулевой элемент
			for (var unit in priceObj) {
				if (priceObj[unit].price) {
					priceObj[unit].discount -= delta;
					priceObj[unit].discountPrice = Math.round(priceObj[unit].price - priceObj[unit].discount);
					break;
				}
			}
		}
	}

	//рассчытываем валовую прибыль по каждой позиции

	for (var unit in priceObj) {
		priceObj[unit].vp = priceObj[unit].discountPrice - priceObj[unit].cost;
	}

	priceObj.total = {
		price: 0,
		cost: 0,
		discount: 0,
		discountPrice: 0,
		vp: 0,
	}

	for (var pricePart in priceObj.total) {
		for (var unit in priceObj) {
			if (unit != "total") {
				priceObj["total"][pricePart] += priceObj[unit][pricePart];
			}
		}
	}

	priceObj.total.name = "Итого";
	priceObj.total.productionPrice = productionPrice;

	// Сохраняем priceObj этажа для вывода после расчета
	if (window.isMulti && currentPriceItem != null) {
		var priceItem = getArrItemByProp(params.priceItems, 'id', currentPriceItem);
		if (priceItem) {
			priceItem.priceObj = priceObj;
			priceItem.priceObj = priceObj;
		}
	}
}

function getPriceCoefficients(priceObj) {
	//подсчет цены
	var priceMarkup = 1.3; //к-т на цену 17.03.21 был 1.1 / к-т на цену 07.05.19 был 1.05
	if (params.calcType == "objects") priceMarkup = 1;
	var margin = 3 * priceMarkup / costMarkup;
	if (params.calcType == "vhod" && params.staircaseType == "Готовая") margin = 1 / (0.7 / 1.45);
	if (params.calcType == 'railing') margin = Math.round(3 * params.railingPriceFactor);
	//if(params.calcType == "vint") margin = 3 / ;
	if (params.calcType == "timber_stock") margin = 2;
	if (params.calcType == "coupe") margin = 2;

	var costFactor = 1;

	if (params.calcType == "carport") {
		costFactor = 1.2
		priceMarkup = 1.3
		margin = 3;
	}

	return {
		costFactor: costFactor,
		priceMarkup: priceMarkup,
		margin: margin
	}
}

function calcColumnPrice(par) {
	var cost = 0;

	// Для всех расчет как за 100х50
	cost = par.columnLength * 400 + par.columnAmt * 1000;

	if (par.columnModel == "40х40") {
		cost = par.columnLength * 60 + par.columnAmt * 200;
	}
	if (par.columnModel == "100x100") {
		cost = par.columnLength * 600 + par.columnAmt * 1500;
	}

	return cost;
}

/** выводит на страницу данные по цене из массива priceObj
В конце функции формируется массив staircasePrice для использования внутри функции getExportData_com

*/

function printPrice2() {

	//формируем объект для выгрузки
	if (window.isMulti && params.priceItems) {
		params.priceItems.forEach(function (priceItem, i) {
			if (i == 0 && priceItem.priceObj) {
				priceObj = $.extend(true, {}, priceItem.priceObj);
			} else {
				if (priceItem.priceObj) {
					$.each(priceItem.priceObj, function (key) {
						if (this.price) priceObj[key].price += this.price;
						if (this.cost) priceObj[key].cost += this.cost;
						if (this.discount) priceObj[key].discount += this.discount;
						if (this.discountPrice) priceObj[key].discountPrice += this.discountPrice;
						if (this.vp) priceObj[key].vp += this.vp;
					})
				}
			}
		})
	}

	//костыли для совместимости со старыми функциями

	var notStairCalcs = ["tables", "racks", "carport", "coupe"]

	if (window.isMulti && params.priceItems) {
		params.priceItems.forEach(function (priceItem, i) {
			if (i == 0 && priceItem.priceObj) {
				priceObj = $.extend(true, {}, priceItem.priceObj);
			} else {
				if (priceItem.priceObj) {
					$.each(priceItem.priceObj, function (key) {
						if (this.price) priceObj[key].price += this.price;
						if (this.cost) priceObj[key].cost += this.cost;
						if (this.discount) priceObj[key].discount += this.discount;
						if (this.discountPrice) priceObj[key].discountPrice += this.discountPrice;
						if (this.vp) priceObj[key].vp += this.vp;
					})
				}
			}
		})
	}

	if (notStairCalcs.indexOf(params.calcType) != -1) {
		var railing_timber = 0;
		var railing_glass = 0;
		var railing_metal = 0;
		var banister_timber = 0;
		var banister_glass = 0;
		var banister_metal = 0;

		if (params.calcType == 'carport') {
			// staircasePrice = {
			// 	carcas: priceObj["carcas"].discountPrice,
			// 	roof: priceObj["roof"].discountPrice,
			// 	carcasMetalPaint: 0,
			// 	assemblingFinal: priceObj["assembling"].discountPrice,
			// 	delivery: priceObj["delivery"].discountPrice,
			// 	finalPrice: priceObj["total"].discountPrice, 
			// }
		}
	} else {

		var railing_timber = Math.round(priceObj["railing"].discountPrice * staircaseCost.railing_timber_part);
		var railing_glass = Math.round(priceObj["railing"].discountPrice * staircaseCost.railing_glass_part);
		var railing_metal = priceObj["railing"].discountPrice - railing_timber - railing_glass;
		var banister_timber = Math.round(priceObj["banister"].discountPrice * staircaseCost.banister_timber_part);
		var banister_glass = Math.round(priceObj["banister"].discountPrice * staircaseCost.banister_glass_part);
		var banister_metal = priceObj["banister"].discountPrice - banister_timber - banister_glass;

		// TODO: Отрефакторить

		priceObj['railing_metal'] = {
			discountPrice: railing_metal
		}
		priceObj['railing_timber'] = {
			discountPrice: railing_timber
		}
		priceObj['railing_glass'] = {
			discountPrice: railing_glass
		}
		priceObj['banister_metal'] = {
			discountPrice: banister_metal
		}
		priceObj['banister_timber'] = {
			discountPrice: banister_timber
		}
		priceObj['banister_glass'] = {
			discountPrice: banister_glass
		}
		priceObj['carcasMetalPaint'] = {
			discountPrice: 0
		};
		priceObj['carcasTimberPaint'] = {
			discountPrice: 0
		};
		priceObj['railingMetalPaint'] = {
			discountPrice: 0
		};
		priceObj['railingTimberPaint'] = {
			discountPrice: 0
		};
		priceObj['banisterMetalPaint'] = {
			discountPrice: 0
		};
		priceObj['banisterTimberPaint'] = {
			discountPrice: 0
		};

		// staircasePrice = {
		// 	carcasFinal: priceObj["carcas"].discountPrice,
		// 	carcasMetalPaint: 0,
		// 	treadsFinal: priceObj["treads"].discountPrice,
		// 	carcasTimberPaint: 0,
		// 	railingFinal: priceObj["railing"].discountPrice,
		// 	railingMetalPaint: 0,
		// 	railingTimberPaint: 0,
		// 	banisterFinal: priceObj["banister"].discountPrice,
		// 	banisterMetalPaint: 0,
		// 	banisterTimberPaint: 0,
		// 	assemblingFinal: priceObj["assembling"].discountPrice,
		// 	delivery: priceObj["delivery"].discountPrice,
		// 	finalPrice: priceObj["total"].discountPrice,
		// 	railing_metal: railing_metal,
		// 	railing_timber: railing_timber,
		// 	railing_glass: railing_glass,
		// 	banister_metal: banister_metal,
		// 	banister_timber: banister_timber,
		// 	banister_glass: banister_glass,
		// }
		// if(params.calcType == "veranda") staircasePrice.cannopy = priceObj["cannopy"].discountPrice;
	}

	if (typeof getExportData_com == 'function' && document.location.href.indexOf("customers") == -1) {
		var exportObj = getExportData_com();
		printExportData(exportObj, "exportData");
	}

	var mode = 'offer';
	if ($(".estimate-btn").hasClass('grey')) mode = 'estimate';
	var text = "";
	var additional = ""; //текст с ценой доп. услуг
	for (var unit in priceObj) {
		if (priceObj[unit].price && priceObj[unit].price != "0" && unit != "total") {
			if (!priceObj[unit].isOption) {
				text += "<div>" + priceObj[unit].name + ": " + priceObj[unit].price + " руб</div>";
			};
			if (priceObj[unit].isOption) {
				additional += "<div>" + priceObj[unit].name + ": " + priceObj[unit].price + " руб</div>";
			};
		}
	}

	text += "<b>Итого: " + priceObj.total.productionPrice + " руб;</b>";
	if (additional) text += "<h3>Дополнительные услуги:</h3>" + additional;

	text += "<h3>Общая стоимость заказа: " + priceObj.total.price + " руб;</h3>";

	if (priceObj.total.discount) text +=
		"<b class='yellow'>Скидка: " + priceObj.total.discount + " руб; </b><br/>" +
		"<b class='yellow'>Цена со скидкой: " + priceObj.total.discountPrice + " руб; </b>";



	//представление - смета (заменяем ранее сформированный text)
	if (mode == "estimate") {
		text = "";
		var tableHead = "<table class='tab_2 number'><tbody><tr><th>Наименование</th><th>Этап</th><th>Ед.изм.</th><th>Кол-во</th><th>Цена ед.</th><th>Сумма</th></tr>";
		var tableFooter = "</tbody></table>";

		if (typeof getExportData_com == 'function') {
			var data = getExportData_com().price_data;
			//printExportData(exportObj, "exportData");

			text += tableHead;

			for (var unit in data) {
				if (unit != "main") {
					//изделие
					if (data[unit].production) {
						text += "<tr class='priceRow'>" +
							"<td class='left'>" + data[unit].name + "</td>" +
							"<td>" + params[unit + "AssmStage"] + "</td>" +
							"<td>шт</td>" +
							"<td>1</td>" +
							"<td>" + Math.round(data[unit].production) + "</td>" +
							"<td>" + Math.round(data[unit].production) + "</td>" +
							"</tr>";
					}
					//Установка
					if (data[unit].assembling) {
						text += "<tr class='priceRow'>" +
							"<td class='left'>" + data[unit].name + " - установка</td>" +
							"<td>" + params[unit + "AssmStage"] + "</td>" +
							"<td>шт</td>" +
							"<td>1</td>" +
							"<td>" + Math.round(data[unit].assembling) + "</td>" +
							"<td>" + Math.round(data[unit].assembling) + "</td>" +
							"</tr>";
					}
				}
			};
			//доставка
			if (data.main.delivery) {
				text += "<tr class='priceRow'>" +
					"<td class='left'>Доставка</td>" +
					"<td>-</td>" +
					"<td>шт</td>" +
					"<td>" + params.deliveryAmt + "</td>" +
					"<td>" + Math.round(data.main.delivery / params.deliveryAmt) + "</td>" +
					"<td>" + Math.round(data.main.delivery) + "</td>" +
					"</tr>";
			}

			text += tableFooter +
				"<b class='yellow'>Итого: " + priceObj.total.discountPrice + " руб; </b><br/>";


		}
	}

	$("#totalResult").html(text);
	formatNumbers();
}


/** функция выводит данные о себестоимости на основе массивов priceObj и staircaseCost

*/
function printCost2() {

	//задаем объект, откуда брать данные
	var _priceObj = priceObj;
	if (window.isMulti && currentPriceItem != null) {
		var priceItem = getArrItemByProp(params.priceItems, 'id', currentPriceItem);
		if (priceItem) {
			_priceObj = priceItem.priceObj;
		}
	}

	var tableBody = "";
	for (var unit in _priceObj) {

		if (_priceObj[unit].name) {
			tableBody += "<tr";
			if (unit == "total") tableBody += " class='bold'"

			tableBody += ">" +
				"<td>" + _priceObj[unit].name + "</td>" +
				"<td>" + _priceObj[unit].cost + "</td>" +
				"<td>" + _priceObj[unit].price + "</td>" +
				"<td>" + _priceObj[unit].discount + "</td>" +
				"<td>" + _priceObj[unit].discountPrice + "</td>" +
				"<td>" + _priceObj[unit].vp + "</td>" +
				"</tr>";
		}

	};

	var text =
		"<table class='form_table'><tbody><tr><th>Наименование</th><th>Себестоимость</th><th>Цена</th><th>Скидка</th><th>Цена со скидкой</th><th>ВП</th></tr>" +
		tableBody +
		"</tbody></table>";
	var pricePolicy = getPricePolicy(_priceObj.total.discountPrice);
	var vpPart = _priceObj.total.vp / _priceObj.total.discountPrice * 100;
	var minPrice = Math.ceil(_priceObj.total.cost / (1 - pricePolicy.vp_min / 100));
	var maxDiscount = Math.round(_priceObj.total.discountPrice - minPrice);
	if (vpPart >= pricePolicy.vp_min) {
		text += "<b class='green'>Валовая прибыль: <span id='vpSum'>" + _priceObj.total.vp + "</span> руб (<span id='vpPart'>" + Math.round(vpPart * 10) / 10 + "</span>%)<br/>" +
			"Минимальная цена: " + minPrice + " руб.<br/>" +
			"Максимальная доп. скидка: " + (maxDiscount) + " руб." +
			"</b>";
	} else {
		text += "<b class='red'>Валовая прибыль: <span id='vpSum'>" + _priceObj.total.vp + "</span> руб (<span id='vpPart'>" + Math.round(vpPart * 10) / 10 + "</span>%)<br/>" +
			"Минимальная цена: " + minPrice + " руб.<br/>" +
			"Необходимо увеличить цену на: " + (-maxDiscount) + " руб." +
			"</b>";
	}


	text += getPricePolicy(_priceObj.total.discountPrice).text;

	// if (params.calcType == 'coupe')  text = "";

	$("#total_cost").html(text);

	if (params.calcType != "vint" && params.calcType != "carport" && params.calcType != "railing") {
		var carcasCostDivId = "cost_carcas";
		var railingCostDivId = "cost_perila";
		var banisterCostDivId = "cost_banister";
		var assemblingCostDivId = "cost_assembling";

		/*себестоимость каркаса*/
		var text =
			"Тетивы: " + Math.round(staircaseCost.stringer) + " руб; <br/>" +
			"Гнутые уголки: " + Math.round(staircaseCost.angles) + " руб; <br/>" +
			"Метизы: " + Math.round(staircaseCost.bolts) + " руб; <br/>" +
			"Больцы: " + Math.round(staircaseCost.bolz) + " руб; <br/>" +
			"Рамки: " + Math.round(staircaseCost.frames) + " руб; <br/>" +
			"Колонны: " + Math.round(staircaseCost.columns) + " руб; <br/>" +
			"Площадка: " + Math.round(staircaseCost.platform) + " руб; <br/>" +
			"<b>Итого каркас: " + Math.round(staircaseCost.carcas) + " руб; </b><br/>" +
			"Ступени: " + Math.round(staircaseCost.treads) + " руб; <br/>" +
			"Покраска металла: " + Math.round(staircaseCost.carcasMetalPaint) + " руб; <br/>" +
			"Покраска дерева: " + Math.round(staircaseCost.carcasTimberPaint) + " руб; <br/>";

		$("#" + carcasCostDivId).html(text);

		/*** ОГРАЖДЕНИЯ ЛЕСТНИЦЫ ***/
		outputDivId = railingCostDivId;
		printRailingCost("лестница", outputDivId);

		/*** БАЛЮСТРАДА ***/
		outputDivId = banisterCostDivId;
		printRailingCost("балюстрада", outputDivId);

		/*** ШКАФ ***/
		printWrCost();

		/*** ДОСТАВКА, СБОРКА ***/


		text =
			"Сборка: " + _priceObj['assembling'].cost + " руб; <br/>" +
			"Доставка: " + staircaseCost.delivery + " руб; <br/>";

		$("#" + assemblingCostDivId).html(text);
	};

	if (params.calcType == "vint") {
		var carcasCostDivId = "cost_staircase";
		var banisterCostDivId = "cost_banister";
		var assemblingCostDivId = "cost_assembling";

		$('#vint_cost').show();

		//себестоимость лестницы
		var text =
			"Ступени: " + staircaseCost.treads.toFixed(2) + " руб; <br/>" +
			"Площадка: " + staircaseCost.platform.toFixed(2) + " руб; <br/>" +
			"Бобышки: " + staircaseCost.spacers.toFixed(2) + " руб; <br/>" +
			"Каркас: " + staircaseCost.stringers.toFixed(2) + " руб; <br/>" +
			"Стойки ограждения: " + staircaseCost.racks.toFixed(2) + " руб; <br/>" +
			"Поручень: " + staircaseCost.handrail.toFixed(2) + " руб; <br/>" +
			"<b>Итого лестница: " + staircaseCost.staircase.toFixed(2) + " руб; </b><br/>" +
			"Покраска металла: " + staircaseCost.staircaseMetalPaint.toFixed(2) + " руб; <br/>" +
			"Покраска дерева: " + staircaseCost.staircaseTimberPaint.toFixed(2) + " руб; <br/>";

		$("#" + carcasCostDivId).html(text);

		/*** БАЛЮСТРАДА ***/
		outputDivId = banisterCostDivId;
		printRailingCost("балюстрада", outputDivId);

		/*** ДОСТАВКА, СБОРКА ***/

		text =
			"Сборка: " + staircaseCost.assembling + " руб; <br/>" +
			"Доставка: " + staircaseCost.delivery + " руб; <br/>";

		$("#" + assemblingCostDivId).html(text);
	};

	if (params.calcType == "carport" || params.calcType == "veranda") {
		var carcasCostDivId = "cost_carport";
		var assemblingCostDivId = "cost_assembling";

		//себестоимость лестницы
		var text =
			"Фермы: " + staircaseCost.truss + " руб; <br/>" +
			"Балки: " + staircaseCost.beams + " руб; <br/>" +
			"Колонны: " + staircaseCost.columns + " руб; <br/>" +
			"Фланцы: " + staircaseCost.flans + " руб; <br/>" +
			"Прогоны: " + staircaseCost.progon + " руб; <br/>" +
			"Метизы: " + staircaseCost.bolts + " руб; <br/>" +
			"Листы кровли: " + staircaseCost.roof + " руб; <br/>" +
			"Профили кровли: " + staircaseCost.roofProf + " руб; <br/>" +
			"Термошайбы: " + staircaseCost.roofShim + " руб; <br/>" +
			"Водосток: " + staircaseCost.drain + " руб; <br/>" +
			"Покраска металла: " + staircaseCost.carcasMetalPaint + " руб; <br/>" +
			"<b>Итого: " + staircaseCost.total + " руб; </b><br/>";


		$("#" + carcasCostDivId).html(text);

		/*** ДОСТАВКА, СБОРКА ***/

		text =
			"Сборка: " + staircaseCost.assembling + " руб; <br/>" +
			"Доставка: " + staircaseCost.delivery + " руб; <br/>";

		$("#" + assemblingCostDivId).html(text);
	};



	//подсветка
	if (params.calcType != 'carport' && params.calcType != 'railing') {
		text = "Подсветка ступеней: " + Math.round(staircaseCost.treadLigts) + " руб; <br/>";
		$("#" + carcasCostDivId).append(text);
	}

}

/** функция рассчитывает все параметры ступеней включая цену
 */

function calcTreadParams() {

	var riserShieldArea = 0; //необходимая площадь щита 20мм
	var skirtingShieldArea = 0; //необходимая площадь щита 20мм
	var treadShieldArea = 0; //необходимая площадь щита 40мм
	var treadWidth = 0.3; //условная ширина ступени для расчета потребности в щите
	var treadLength = 1;
	if (params.M > 1050) treadLength = 1.5;
	if (params.M < 740) treadLength = 0.75;
	if (params.stairType == "стекло" ||
		params.stairType == "рифленая сталь" ||
		params.stairType == "лотки") treadLength = params.M / 1000;

	if (params.stairType == "дпк") {
		treadWidth = params.dpcWidth / 1000 * Math.floor(params.a1 / params.dpcWidth);
		treadLength = 4 / Math.floor(4000 / (params.M - 16));
		if ((params.M - 16) > 4000) treadLength = 4 * Math.ceil((params.M - 16) / 4000);
	}

	if (params.stairType == "лиственница тер.") {
		treadWidth = params.dpcWidth / 1000 * Math.floor(params.a1 / params.dpcWidth);
		treadLength = 3 / Math.floor(3000 / (params.M - 16));
		if ((params.M - 16) > 3000) treadLength = 3 * Math.ceil((params.M - 16) / 3000);
	}
	var riserWidth = 0.2;
	var riserLength = treadLength;
	var treadArea = treadWidth * treadLength; //площадь пласти ступени
	var riserArea = riserWidth * riserLength;
	var paintedArea = 0;

	//нижний марш
	var stairAmt1 = params.stairAmt1;
	if (params.startTreadAmt) stairAmt1 -= params.startTreadAmt;
	treadShieldArea += stairAmt1 * treadArea;
	paintedArea += (params.a1 * params.M * 2 + (params.a1 + params.M) * 2 * 40) * stairAmt1 / 1000000;
	if (params.riserType != "нет") {
		riserShieldArea += params.stairAmt1 * riserArea;
		paintedArea += (params.h1 * params.M * 2 + (params.h1 + params.M) * 2 * 20) * stairAmt1 / 1000000;
	}

	//верхний марш
	if (params.stairModel != "Прямая") {
		treadShieldArea += params.stairAmt3 * treadArea;
		paintedArea += (params.a3 * params.M * 2 + (params.a3 + params.M) * 2 * 40) * params.stairAmt3 / 1000000;
		if (params.riserType != "нет") {
			riserShieldArea += params.stairAmt3 * riserArea;
			paintedArea += (params.h3 * params.M * 2 + (params.h3 + params.M) * 2 * 20) * params.stairAmt3 / 1000000;
		};
	}

	//средний марш
	if (params.stairModel == "П-образная трехмаршевая") {
		treadShieldArea += params.stairAmt2 * treadArea;
		paintedArea += (params.a2 * params.M * 2 + (params.a2 + params.M) * 2 * 40) * params.stairAmt2 / 1000000;
		if (params.riserType != "нет") {
			riserShieldArea += params.stairAmt2 * riserArea;
			paintedArea += (params.h2 * params.M * 2 + (params.h2 + params.M) * 2 * 20) * params.stairAmt2 / 1000000;
		}
	}

	//площадь промежуточной площадки
	var pltWidth = params.M / 1000;
	var pltLength = (params.M + 50) / 1000
	if (params.stairModel == "П-образная с площадкой") {
		pltWidth = (2 * params.M + params.marshDist) / 1000;
		pltLength = params.platformLength_1 / 1000;
	}
	if (params.calcType == "vhod") {
		if (params.stairModel == "Г-образная с площадкой") {
			pltLength = (params.middlePltLength + params.middlePltWidth - params.M) / 1000;
		}
		if (params.stairModel == "Прямая с промежуточной площадкой") {
			pltLength = params.middlePltLength / 1000;
		}
		if (params.stairModel == "Прямая горка") {
			pltLength = params.middlePltLength / 1000;
		}

	}

	var pltShieldWidth = 0.6;
	if (params.stairType == "дпк" || params.stairType == "лиственница тер.") pltShieldWidth = 0.15;
	var pltShieldLength = 1;
	if (pltWidth > 1) pltShieldLength = 1.5;
	if (pltWidth > 1.5) pltShieldLength = 2;
	if (pltWidth > 2) pltShieldLength = 3;
	if (pltWidth > 3) pltShieldLength = 4;
	var pltShieldPartAmt = Math.ceil(pltLength / pltShieldWidth);
	var pltShieldArea = pltShieldWidth * pltShieldLength * pltShieldPartAmt;


	//забежные ступени		
	var wndTreadArea = 1 * 0.6;
	var wndRiserLength = params.M / Math.cos(Math.PI / 6);
	if (wndRiserLength <= 1050) wndRiserLength = 1;
	if (wndRiserLength > 1050) wndRiserLength = 1.5;
	var wndRiserArea = wndRiserLength * riserWidth;

	//верхняя площадка
	var pltWidth = treadLength;
	//пересчитываем ширину покрытия площадки с учетом длины доски дпк 4м
	if (params.calcType == "vhod" && params.platformTop == "увеличенная") {
		if (params.platformWidth_3 < 4000) {
			pltWidth = 4 / Math.floor(4000 / params.platformWidth_3);
		}
		if (params.platformWidth_3 >= 4000) {
			pltWidth = Math.ceil(params.platformWidth_3 / 4000);
		}
	}

	var topPpltShieldPartAmt = Math.ceil((params.platformLength_3 / 1000) / pltShieldWidth);
	var topPltShieldArea = pltShieldWidth * pltWidth * topPpltShieldPartAmt;

	if (params.calcType == "veranda") {
		topPltShieldArea = params.pltLen * params.pltWidth / 1000000
	}

	//подсчет количества деталей повротов
	var turnPar = getTurnPar();

	//площадь забежных деталей
	treadShieldArea += pltShieldArea * turnPar.pltAmt + wndTreadArea * turnPar.wndTreadAmt;
	paintedArea += (pltShieldArea * turnPar.pltAmt + wndTreadArea * turnPar.wndTreadAmt) * 2; //приблизительная формула

	if (params.riserType != "нет") {
		riserShieldArea += wndRiserArea * turnPar.wndRiserAmt + riserArea * turnPar.riserAmt;
		paintedArea += (wndRiserArea * turnPar.wndRiserAmt + riserArea * turnPar.riserAmt) * 2; //приблизительная формула
	}

	//вертикальная рамка

	if (params.topAnglePosition == "вертикальная рамка") {
		riserShieldArea += riserArea;
		paintedArea += riserArea * 2;
	}

	//верхняя площадка
	if (params.platformTop == "площадка" || params.platformTop == "увеличенная" || params.calcType == "veranda") {
		treadShieldArea += topPltShieldArea;
		paintedArea += topPltShieldArea * 2;
		if (params.riserType != "нет") {
			riserShieldArea += riserArea;
			paintedArea += riserArea * 2; //приблизительная формула
		}
	}

	//пригласительные ступени
	if (partsAmt.startTread) {
		treadShieldArea += partsAmt.startTread["area"] * 2; //к-т 2 учитывае обрезки
		paintedArea += partsAmt.startTread["paintedArea"];
	}

	//гнутые подступенки
	if (partsAmt.riser_arc) {
		riserShieldArea += partsAmt.riser_arc["area"];
		paintedArea += partsAmt.riser_arc["paintedArea"];
	}

	//плинтус
	skirtingShieldArea += getPartPropVal('skirting_hor', 'area') + getPartPropVal('skirting_hor', 'area')
	paintedArea += getPartPropVal('skirting_hor', 'paintedArea') + getPartPropVal('skirting_hor', 'paintedArea')

	//расчет цены
	var stairType = params.stairType;

	//деревянные ступени
	var treadsPanelName = calcTimberParams(params.treadsMaterial).treadsPanelName;
	var riserPanelName = calcTimberParams(params.risersMaterial).riserPanelName;

	//толстые ступени
	if (params.treadThickness > 41) riserPanelName = calcTimberParams(params.treadsMaterial).riserPanelName;
	var skirtingPanelName = calcTimberParams(params.skirtingMaterial).riserPanelName;
	var treadMeterPrice = calcTimberParams(params.treadsMaterial).m2Price_40;
	var riserMeterPrice = calcTimberParams(params.risersMaterial).m2Price_20;
	var skirtingMeterPrice = calcTimberParams(params.skirtingMaterial).m2Price_20;

	//учитываем стоимость работ
	var workMeterPrice = 330;
	treadMeterPrice += workMeterPrice;

	if (stairType == "нет") {
		treadMeterPrice = 0;
		treadsPanelName = "";
		riserPanelName = "";
	}
	if (stairType == "рифленая сталь") {
		treadMeterPrice = 2500;
		treadsPanelName = "sheetRef";
		riserPanelName = "sheetRef";
	}
	if (stairType == "рифленый алюминий") {
		treadMeterPrice = 3500;
		treadsPanelName = "sheetRefAl";
		riserPanelName = "sheetRefAl";
	}
	if (stairType == "лотки") {
		treadMeterPrice = 2500;
		treadsPanelName = "sheet2";
		riserPanelName = "sheet2";
	}
	if (stairType == "дпк") {
		treadMeterPrice = 2000;
		treadsPanelName = "dpc";
		riserPanelName = "dpc";
	}

	if (stairType == "лиственница тер.") {
		treadMeterPrice = 2000;
		treadsPanelName = "larchBoard";
		riserPanelName = "larchBoard";
	}



	if (stairType == "пресснастил") {
		treadMeterPrice = 5000;
		treadsPanelName = "pressTreads";
		riserPanelName = "pressTreads";
	}
	if (stairType == "стекло") {
		treadMeterPrice = 12000;
		treadsPanelName = "glassTreads";
		riserPanelName = "glassTreads";
	}


	var treadsTotalPrice = treadShieldArea * treadMeterPrice + riserShieldArea * riserMeterPrice + skirtingShieldArea * skirtingMeterPrice;

	//учитываем сварку ступеней вместо рамок
	if (stairType == "рифленая сталь" || stairType == "лотки") treadsTotalPrice += getPartAmt("tread") * 200;

	if (partsAmt.riser_arc) treadsTotalPrice += partsAmt.riser_arc["amt"] * 5000;

	var isTimberPaint = true;
	if (stairType == "нет") isTimberPaint = false;
	if (stairType == "рифленая сталь") isTimberPaint = false;
	if (stairType == "рифленый алюминий") isTimberPaint = false;
	if (stairType == "лотки") isTimberPaint = false;
	if (stairType == "дпк") isTimberPaint = false;
	if (stairType == "пресснастил") isTimberPaint = false;
	if (stairType == "стекло") isTimberPaint = false;

	var m2PaintPrice = calcTimberPaintPrice(params.timberPaint, stairType);

	var timberPaintPrice = 0;
	if (isTimberPaint) timberPaintPrice = m2PaintPrice * paintedArea;

	//коробчатые ступени
	if (params.stairType == "короб") {
		treadsTotalPrice += 20000;
	}

	//толстые ступени из щита
	if (params.treadThickness > 41 && params.stairType != "короб") {
		if (params.treadThickness <= 61) {
			treadsTotalPrice *= 1.5;
			timberPaintPrice *= 1.1;
			riserShieldArea += treadShieldArea;
			paintedArea *= 1.1;
			//добавляем рейсмусование
			if (params.treadThickness < 55) treadsTotalPrice *= 1.2;
		}

		if (params.treadThickness > 61 && params.treadThickness <= 81) {
			treadsTotalPrice *= 2;
			timberPaintPrice *= 1.3;
			treadShieldArea *= 2;
			paintedArea *= 1.15;
			//добавляем рейсмусование
			if (params.treadThickness < 75) treadsTotalPrice *= 1.2;
		}
		if (params.treadThickness > 81 && params.treadThickness <= 101) {
			treadsTotalPrice *= 2.5;
			timberPaintPrice *= 1.3;
			treadShieldArea *= 2;
			riserShieldArea += treadShieldArea;
			paintedArea *= 1.2;
			//добавляем рейсмусование
			if (params.treadThickness < 95) treadsTotalPrice *= 1.2;
		}
		if (params.treadThickness > 101) {
			treadsTotalPrice *= 4;
			timberPaintPrice *= 2;
			treadShieldArea *= 3;
			paintedArea *= 1.5;
		}
	}


	//работа по изготовлению плинтуса
	treadsTotalPrice += (getPartAmt('skirting_hor') + getPartAmt('skirting_hor')) * 200;

	//подсветка ступеней
	var treadLigtsCost = 0;
	if (params.treadLigts == "подготовка") treadLigtsCost = 5000;
	if (params.treadLigts == "простая") treadLigtsCost = 8000;
	if (params.treadLigts == "независимая") treadLigtsCost = 25000;

	treadsTotalPrice += treadLigtsCost;

	//фрезеровка пазов под подложки на монокосоурах
	if (params.treadPlatePockets == "есть") treadsTotalPrice += 10000;



	//возвращаемый объект

	var par = {
		treadShieldArea: treadShieldArea,
		riserShieldArea: riserShieldArea,
		skirtingShieldArea: skirtingShieldArea,
		paintedArea: paintedArea,
		treadsTotalPrice: treadsTotalPrice,
		treadsPanelName: treadsPanelName,
		riserPanelName: riserPanelName,
		skirtingPanelName: skirtingPanelName,
		timberPaintPrice: timberPaintPrice,
		timberPaintMeterPrice: m2PaintPrice,
		treadMeterPrice: treadMeterPrice,
		isTimberPaint: isTimberPaint,
		treadLigtsCost: treadLigtsCost,
	}

	return par;


} //end of calcTreadParams



function calcHandrailMeterParams(par) {

	var prof = par.prof;
	var sideSlots = par.sideSlots
	var handrailType = par.handrailType
	if (par.handrailType == "массив") handrailType = params.handrailsMaterial;

	var metalPaint = par.metalPaint
	if (!metalPaint) metalPaint = "нет";
	var timberPaint = par.timberPaint
	if (!timberPaint) timberPaint = "нет";

	/*СЕБЕСТОИМОСТЬ ПОРУЧНЕЙ*/

	var meterPrice = 200;
	if (handrailType == "40х20 черн.") meterPrice = 140;
	if (handrailType == "40х40 черн.") meterPrice = 180;
	if (handrailType == "60х30 черн.") meterPrice = 250;
	if (handrailType == "40х40 нерж.") meterPrice = 500;
	if (handrailType == "Ф50 нерж.") meterPrice = 500;
	if (handrailType == "Ф50 нерж. с пазом") meterPrice = 1200;
	if (handrailType == "40х60 нерж. с пазом") meterPrice = 1000;
	if (handrailType == "ПВХ") meterPrice = 450;
	if (handrailType == "нет") meterPrice = 0;

	if (handrailType == "кованый полукруглый") meterPrice = 500;
	if (handrailType == "омега-образный сосна") meterPrice = 200;
	if (handrailType == "50х50 сосна") meterPrice = 200;
	if (handrailType == "40х60 береза") meterPrice = 600;
	if (handrailType == "омега-образный дуб") meterPrice = 800;
	if (handrailType == "40х60 дуб") meterPrice = 600;
	if (handrailType == "40х60 дуб с пазом") meterPrice = 900;

	//деревянный поручень
	
	if (par.handrailType == "массив") {
		//материал
		var fullWidth = 0.06 + 0.01; //полная ширина с учетом припуска на обработку
		if (prof == "40х80 верт.") fullWidth = 0.08 + 0.01;
		if (prof == "40х100 верт.") fullWidth = 0.1 + 0.01;
		if (prof == "40х70 гор.") fullWidth = 0.07 + 0.01;

		meterPrice = calcTimberParams(params.handrailsMaterial).m2Price_40 * fullWidth;
		var panelName = calcTimberParams(params.handrailsMaterial).treadsPanelName;

		//работа
		meterPrice += 50;
		//проточки по бокам
		if (sideSlots == "да") meterPrice += 30;
	}

	var handrailMat = "metal";
	if (handrailType == "Ф50 сосна" ||
		handrailType == "омега-образный сосна" ||
		handrailType == "50х50 сосна" ||
		handrailType == "40х60 береза" ||
		handrailType == "омега-образный дуб" ||
		handrailType == "40х60 дуб" ||
		handrailType == "40х60 дуб с пазом" ||
		handrailType == "ПВХ" ||
		handrailType == "сосна" ||
		handrailType == "береза" ||
		handrailType == "лиственница" ||
		handrailType == "дуб паркет." ||
		handrailType == "дуб ц/л" ||
		par.handrailType == "массив") {
		handrailMat = "timber";
	}
	if (handrailType == "40х40 нерж." ||
		handrailType == "Ф50 нерж." ||
		handrailType == "Ф50 нерж. с пазом" ||
		handrailType == "40х60 нерж. с пазом") {
		handrailMat = "inox";
	}


	//покраска поручня
	var paintMeterPrice = 0;

	if (metalPaint == "грунт") {
		paintMeterPrice = 0;
		if (handrailType == "40х20 черн.") paintMeterPrice = 50;
		if (handrailType == "40х40 черн.") paintMeterPrice = 50;
		if (handrailType == "60х30 черн.") paintMeterPrice = 50;
		if (handrailType == "кованый полукруглый") paintMeterPrice = 50;
	}
	if (metalPaint == "порошок") {
		paintMeterPrice = 0;
		if (handrailType == "40х20 черн.") paintMeterPrice = 100;
		if (handrailType == "40х40 черн.") paintMeterPrice = 100;
		if (handrailType == "60х30 черн.") paintMeterPrice = 100;
		if (handrailType == "кованый полукруглый") paintMeterPrice = 100;
	}
	if (timberPaint != "нет") {
		paintMeterPrice = 0;
		if (handrailMat == "timber") {
			var m2PaintPrice = calcTimberPaintPrice(timberPaint, handrailType);
			paintMeterPrice = m2PaintPrice * 0.2;
		}

	}

	//параметры геометрии

	var handrailProfileY = 40;
	var handrailProfileZ = 60;
	var handrailModel = "rect";
	var handrailPlugId = "no";

	if (handrailType == "40х20 черн.") {
		handrailProfileY = 20;
		handrailProfileZ = 40;
		handrailPlugId = "plasticPlug_40_20";
	}
	if (handrailType == "40х40 черн.") {
		handrailProfileY = 40;
		handrailProfileZ = 40;
		handrailPlugId = "plasticPlug_40_40";
	}
	if (handrailType == "60х30 черн.") {
		handrailProfileY = 30;
		handrailProfileZ = 60;
		handrailPlugId = "plasticPlug_60_30";
	}
	if (handrailType == "кованый полукруглый") {
		handrailProfileY = 30;
		handrailProfileZ = 50;

	}
	if (handrailType == "40х40 нерж.") {
		handrailProfileY = 40;
		handrailProfileZ = 40;
		handrailPlugId = "plasticPlug_40_40";
	}
	if (handrailType == "Ф50 нерж.") {
		handrailModel = "round";
		handrailProfileY = 50;
		handrailProfileZ = 50;
		handrailPlugId = "stainlessPlug_50";
	}
	if (handrailType == "ПВХ") {
		handrailModel = "round";
		handrailProfileY = 50;
		handrailProfileZ = 50;
		handrailPlugId = "stainlessPlug_pvc";
	}
	if (handrailType == "омега-образный сосна") {
		handrailProfileY = 55;
		handrailProfileZ = 75;
	}
	if (handrailType == "50х50 сосна") {
		handrailProfileY = 60;
		handrailProfileZ = 40;
	}
	if (handrailType == "40х60 береза") {
		handrailProfileY = 60;
		handrailProfileZ = 40;
	}
	if (handrailType == "омега-образный дуб") {
		handrailProfileY = 55;
		handrailProfileZ = 75;
	}
	if (handrailType == "40х60 дуб") {
		handrailProfileY = 60;
		handrailProfileZ = 40;
	}
	if (handrailType == "40х60 дуб с пазом") {
		handrailProfileY = 60;
		handrailProfileZ = 40;
	}
	if (handrailType == "Ф50 нерж. с пазом") {
		handrailModel = "round";
		handrailProfileY = 50;
		handrailProfileZ = 50;
		handrailPlugId = "stainlessPlug_50";
	}
	if (handrailType == "40х60 нерж. с пазом") {
		handrailProfileY = 40;
		handrailProfileZ = 60;
	}
	if (par.handrailType == "массив" ||	handrailType == "не указано") {
		handrailModel = "rect";
		handrailProfileY = 60;
		handrailProfileZ = 40;
		if (prof == "40х60 гор.") {
			handrailProfileY = 40;
			handrailProfileZ = 60;
		}
		if (prof == "40х70 гор.") {
			handrailProfileY = 40;
			handrailProfileZ = 70;
		}
		if (prof == "40х80 верт.") handrailProfileY = 80;
		if (prof == "40х100 верт.") handrailProfileY = 100;
	}
	//параметры для спецификации
	par.metalPaint = true;
	par.timberPaint = false;
	par.division = "metal";
	par.screwId = "metalHandrailScrew";

	if (handrailMat == "timber") {
		par.metalPaint = false;
		par.timberPaint = true;
		par.division = "timber";
		par.screwId = "timberHandrailScrew";
	}
	if (handrailMat == "inox") {
		par.metalPaint = false;
	}

	par.holderFlanId = "handrailHolderFlanPlane";
	if (handrailModel == "round") par.holderFlanId = "handrailHolderFlanArc";
	if (params.railingModel == "Кованые балясины" ||
		params.railingModel == "Трап" ||
		params.banisterMaterial == "40х40 черн.") {
		par.holderFlanId = "holderFlan"
	}

	//формируем возвращаемый объект
	par.price = meterPrice;
	par.paintPrice = paintMeterPrice;
	par.mat = handrailMat;
	par.panelName = panelName;
	par.fullWidth = fullWidth;
	par.profY = handrailProfileY;
	par.profZ = handrailProfileZ;
	par.handrailModel = handrailModel;
	par.handrailPlugId = handrailPlugId;

	return par;

} //end of calcHandrailMeterParams

/** функция возвращает параметры дерва по названию
 */

function calcTimberParams(timberType) {
	var m3Price = 42000;
	var treadsPanelName = "panelPine_40";
	var riserPanelName = "panelPine_20";

	if (timberType == "сосна экстра" || timberType == "сосна") {
		m3Price = 52000;
		treadsPanelName = "panelPinePremium_40";
		riserPanelName = "panelPinePremium_20";
	}
	if (timberType == "береза паркет." || timberType == "береза") {
		m3Price = 70000;
		treadsPanelName = "panelBirch_40";
		riserPanelName = "panelBirch_20";
	}
	if (timberType == "лиственница паркет." || timberType == "лиственница") {
		m3Price = 74000;
		treadsPanelName = "panelLarch_40";
		riserPanelName = "panelLarch_20";
	}
	if (timberType == "лиственница ц/л") {
		m3Price = 90000;
		treadsPanelName = "panelLarchPremium_40";
		riserPanelName = "panelLarchPremium_20";
	}
	if (timberType == "дуб паркет.") {
		m3Price = 115000;
		treadsPanelName = "panelOak_40";
		riserPanelName = "panelOak_20";
	}
	if (timberType == "дуб ц/л") {
		m3Price = 185000;
		treadsPanelName = "panelOakPremium_40";
		riserPanelName = "panelOakPremium_20";
	}

	if (timberType == "дуб натур") {
		//m3Price = 50000 / 0.8 / 0.8; //50 тыс/м3 доски, толщина 40 из 50, 20% отходов по площади (120мм щита из 150 доски)
		m3Price = 105000;
		treadsPanelName = "slabOak_50";
		riserPanelName = "slabOak_50";
	}

	if (timberType == "ясень паркет.") {
		m3Price = 95000;
		treadsPanelName = "panelAsh_40";
		riserPanelName = "panelAsh_20";
	}
	if (timberType == "ясень ц/л") {
		m3Price = 150000;
		treadsPanelName = "panelAshPremium_40";
		riserPanelName = "panelAshPremium_20";
	}

	if (timberType == "карагач натур") {
		//m3Price = 50000 / 0.8 / 0.8; //50 тыс/м3 доски, толщина 40 из 50, 20% отходов по площади
		m3Price = 105000;
		treadsPanelName = "slabElm_50";
		riserPanelName = "slabElm_50";
	}

	if (timberType == "шпон") {
		m3Price = 105000;
		treadsPanelName = "veneer";
		riserPanelName = "veneer";
	}

	//формируем возвращаемый объект
	var par = {
		timberType: timberType,
		m3Price: m3Price,
		m2Price_20: m3Price * 0.02,
		m2Price_40: m3Price * 0.04,
		m2Price_60: m3Price * 0.06,
		treadsPanelName: treadsPanelName,
		riserPanelName: riserPanelName,
	}
	return par;
} //end of calcTimberParams

/** функция возвращает стоимость покраски дерева за м2
 */

function calcTimberPaintPrice(paintType, timber, surfaceType) {
	var surfaceType = surfaceType;
	if (!surfaceType) surfaceType = params.surfaceType;
	//покраска дерева
	var m2PaintPrice = 0;
	if (paintType == "лак" || paintType == "масло" || paintType == "цветное масло") m2PaintPrice = 1000;
	if (paintType == "морилка+лак") m2PaintPrice = 1500;
	if (paintType == "морилка+патина+лак") m2PaintPrice = 2000;
	if (timber == "лиственница паркет.") {
		if (paintType == "лак") m2PaintPrice = 1200;
		if (paintType == "морилка+лак") m2PaintPrice = 1700;
		if (paintType == "морилка+патина+лак") m2PaintPrice = 2200;
	}

	if (surfaceType == "под пластик") m2PaintPrice *= 1.2;
	return m2PaintPrice;
}
/** функция возвращает к-т на себестоимость покраски металла в зависимости от цвета
 */

function calcMetalPaintCostFactor(unit) {
	var color = params.carcasColor;
	if (unit == "railing") color = params.railingMetalColorNumber;
	if (unit == "banister") color = params.metalColorNumber_bal;
	var costFactor = 1;
	if (color == "черная ящерица" ||
		color == "бежевая ящерица" ||
		color == "коричневая ящерица") costFactor = 1.3;
	return costFactor;

}; //end of calcMetalPaintCost

function calcGlassCost(type, thk) {

	var m2Price = 3000;
	//стекло 8мм
	if (thk == 8) {
		var m2Price = 1800;
		if (type == "оптивайт") m2Price = 3645 * 1.1; //к-т от 25.03.20
		if (type == "тонированное") m2Price = 2850;
		if (type == "матовое") m2Price = 2630;
		if (type == "с пленкой") m2Price = 2800;
		if (type == "триплекс") m2Price = 2115;
		if (type == "триплекс каленый") m2Price = 3375;
		if (type == "триплекс цветной") m2Price = 2800;
		if (type == "триплекс цветной каленый") m2Price = 3900;
	}
	//стекло 12мм
	if (thk == 12) {
		var m2Price = 3200;
		if (type == "оптивайт") m2Price = 7100 * 1.1; //к-т от 25.03.20
		if (type == "тонированное") m2Price = 6000;
		if (type == "матовое") m2Price = 6000;
		if (type == "с пленкой") m2Price = 4200;
		if (type == "триплекс") m2Price = 4200;
		if (type == "триплекс каленый") m2Price = 4200;
		if (type == "триплекс цветной") m2Price = 5200;
		if (type == "триплекс цветной каленый") m2Price = 5200;
	}
	return m2Price;
}
/** функция возвраящет особенности ценовой политики для текущего расчета:
минимальная вп в виде числа и описание
*/

function getPricePolicy(finalPrice) {
	var text = "<div class='pricePolicyInfo'><h4>Ограничения на прием заказов</h4>";

	var vp_descr =
		"<li>заказ менее 150 тыс: 40%</li>" +
		"<li>заказ 150-250 тыс: 40%</li>" +
		"<li>заказ 250-350 тыс: 35%</li>" +
		"<li>заказ более 350 тыс: 35%</li>";

	var timberPaint = "обязательно для заказов менее 200 тыс.";
	var metalPaint = "обязательно для заказов менее 200 тыс.";

	var vp_min = 40;
	//if(finalPrice < 150000) vp_min = 50;
	if (finalPrice >= 150000 && finalPrice < 250000) vp_min = 40;
	if (finalPrice >= 250000 && finalPrice < 350000) vp_min = 35;
	if (finalPrice >= 350000) vp_min = 35;

	if (params.calcType == "metal" || params.calcType == "vhod" || params.calcType == "mono") {
		timberPaint = "не обязательно";
		if (params.model == "ко") metalPaint = "не обязательно";
	}


	if (params.calcType == "vint") {
		vp_descr =
			"<li>заказ менее 200 тыс: 40%</li>" +
			"<li>заказ более 200 тыс: 35%</li>";

		vp_min = 40;
		if (finalPrice >= 200000) vp_min = 35;
	}

	if (params.calcType == "timber_stock") {
		timberPaint = "обязательно";
		metalPaint = "обязательно";
	}

	if (params.calcType == "railing") {
		timberPaint = "обязательно";
		metalPaint = "обязательно";
	}

	//временное снятие ограничений
	timberPaint = "не обязательно";
	metalPaint = "не обязательно";

	text +=
		"Порошковая покраска металла: " + metalPaint + "<br/>" +
		"Покраска дерева: " + timberPaint + "<br/>" +
		"Минимальная ВП:<br/><ul>" + vp_descr + "</ul></div>";

	var result = {
		text: text,
		vp_min: vp_min,
	}
	return result;
}

function getProfParams(profName, profMaterial) {
	var priceKf = 1;

	if (profMaterial) {
		if (profMaterial == 'хром') priceKf = 2;
		if (profMaterial == 'нержавейка') priceKf = 4;
	}

	var costArr = {
		'20х20': 47,
		'40х40': 120,
		'50х50': 198,
		'60х60': 217,
		'80х80': 287,
		'100х100': 415,
		'40х20': 72,
		'60х30': 136,
		'60х40': 178,
		'80х40': 217,
		'100х40': 275,
		'100х50': 315,
		'100х200': 755,
		'-150х8': 470,
		'-200х8': 625,
		'-250х8': 780,
		'Ф12': 100,
		'Ф16': 120,
		'Ф25': 200,
		'Ф38': 300,
		"40х4": 60,
		'60х4': 90,
		'80х5': 150,
		'100х6': 200,
		'100х10': 380,
		'Швеллер 120х50': 350,
		'Швеллер 180х60': 700,
		'Швеллер 200х100': 960,
	};

	var result = {
		sizeA: profName.slice(0, profName.indexOf('х')) * 1.0,
		sizeB: profName.slice(profName.indexOf('х') + 1, profName.length) * 1.0,
		unitCost: costArr[profName],
		type: 'rect',
	}

	if (profName[0] == "Ф") {
		result = {
			sizeA: profName.slice(1, profName.length) * 1.0,
			sizeB: profName.slice(1, profName.length) * 1.0,
			unitCost: costArr[profName],
			type: 'round',
		}
	}
	if (profName[0] == "-") {
		result = {
			sizeA: profName.slice(1, profName.indexOf('х')) * 1.0,
			sizeB: profName.slice(profName.indexOf('х') + 1, profName.length) * 1.0,
			unitCost: costArr[profName],
			type: 'round',
		}
	}
	if (profName[0] == "Ш") {
		result = {
			sizeA: profName.slice(8, profName.indexOf('х')) * 1.0,
			sizeB: profName.slice(profName.indexOf('х') + 1, profName.length) * 1.0,
			unitCost: costArr[profName],
			type: 'round',
		}
	}

	if ((result.sizeA != result.sizeB) && !result.unitCost) {
		profName = result.sizeB + "х" + result.sizeA;
		result.unitCost = costArr[profName];
	}

	//расчет по весу для нестандартных профилей
	if (!result.unitCost) {
		var thk = 3;
		if (result.sizeB > 50 && result.sizeA > 50) thk = 4;
		result.unitCost = (result.sizeB + result.sizeA) * 2 * thk / 1000000000 * 7800 * 50000;
	}

	// Учитываем материал
	result.unitCost *= priceKf;

	//идентификатор для потребности в материалах
	result.materialNeedId = "prof_" + result.sizeA + "_" + result.sizeB;
	if (result.sizeA < result.sizeB) result.materialNeedId = "prof_" + result.sizeB + "_" + result.sizeA;

	return result;

}

function calcRackWallPrice(par) {
	var racksLength = par.racksLength;
	var balPrice = 0;
	var paintPrice = 0;
	var profPar = getProfParams(par.racksProfile);

	if (par.racksType == "массив") {
		var timberPar = calcTimberParams(par.racksMaterial);
		var meterPrice = profPar.sizeA / 1000 * profPar.sizeB / 1000 * timberPar.m3Price;
	}
	if (par.racksType == "шпон") {
		var timberPar = calcTimberParams(par.racksType);
		var meterPrice = profPar.sizeA / 1000 * profPar.sizeB / 1000 * timberPar.m3Price;
	}

	if (par.racksType == "металл") {
		meterPrice = profPar.unitCost;
	}

	balPrice = racksLength * meterPrice;

	var paintedArea = (profPar.sizeA / 1000 + profPar.sizeB / 1000) * 2 * racksLength;

	//покраска дерева
	if (params.timberPaint != "нет" && (par.racksType == "массив" || par.racksType == "шпон")) {
		var m2PaintPrice = calcTimberPaintPrice(params.timberPaint, par.timberBalMaterial);
		var balPaintPrice = m2PaintPrice * paintedArea
		paintPrice += balPaintPrice;
	}

	//покраска металла
	if (params.metalPaint == "порошок" && par.racksType == "металл") {
		paintPrice += paintedArea * 1000;
	}

	return {
		racksLength: racksLength,
		paintPrice: paintPrice,
		balPrice: balPrice
	}
}

/** функция рассчитывает стоимость деревянной панели
par = {
	width
	len
	thk
	tabletopType
	riverWidth
	resinVol
	shapeType
*/

function calcTimberPanelCost(par) {

	//параметры по умолчанию
	if (!par.tabletopType) par.tabletopType = "щит";
	if (!par.riverWidth) par.riverWidth = 0;
	if (!par.resinVol) par.resinVol = 0;
	if (!par.shapeType) par.shapeType = "прямоугольник";

	var timberPar = calcTimberParams(params.additionalObjectsTimberMaterial);
	var paintPriceM2 = calcTimberPaintPrice(params.timberPaint, params.additionalObjectsTimberMaterial)
	var timberVol = par.width * par.len * par.thk / 1000000000;

	//учитвем обрезки
	if (par.tabletopType == "щит") {
		var billetPar = calcBilletSize({
			len: par.len,
			width: par.width,
			thk: par.thk,
			type: "щит"
		});
		if (billetPar.vol > timberVol) timberVol = billetPar.vol;
	}

	var paintedArea = Math.round(par.width * par.len / 1000000 * 1.5 * 100) / 100; //1.5 учитывает торцы и низ

	if (!par.tabletopType) par.tabletopType = "щит";
	if (!par.riverWidth) par.riverWidth = 0;
	if (!par.resinVol) par.resinVol = 0;
	if (!par.shapeType) par.shapeType = "прямоугольник";


	//древесина
	var timberCost = timberVol * timberPar.m3Price;
	if (par.slabPrice && par.slabPrice > 0) timberCost = par.slabPrice * 0.5; //себестоимость слэба - половина цены с сайта гармоник-мебель
	//покраска
	var timberPaintCost = paintedArea * paintPriceM2
	cost = timberCost + timberPaintCost;

	//заливка смолой
	var riverArea = par.riverWidth * par.len / 1000000;
	var resinVol_calc = riverArea * par.thk
	if (par.tabletopType == "слэб") resinVol_calc = 1;

	var riverCost = 0;
	var resinLiterCost = 1500;
	if (params.resinMaterial == "непрозрачный") resinLiterCost *= 0.5 //к-т учитывает заполнитель

	if (par.tabletopType && par.tabletopType.indexOf("слэб") != -1) {
		riverCost += par.resinVol * resinLiterCost;
		if (resinVol_calc > par.resinVol) alertTrouble("ВНИМАНИЕ ОШИБКА! Расчетный объем реки превышает указанный объем заливки. Расчетный объем " + Math.ceil(resinVol_calc) + "л")
	}
	if (par.tabletopType == "слэб + стекло") riverCost = riverArea * 12000 + 2000; //12к - цена стекла за м2, 2к - работа по фрезеровке 

	cost += riverCost;

	//доклейка по толщине

	if (par.botPoleType && par.botPoleType != "нет") {
		var botPoleLen = par.len;
		if (par.botPoleType != "спереди") botPoleLen += par.width * 2;

		var botPoleVol = botPoleLen * par.botPoleThk * par.botPoleWidth / 1000000000;

		cost += botPoleVol * timberPar.m3Price + 300; //300р - стоимость работы по доклейке		

	}

	//непрямоугольные изделия
	var perim = (par.width + par.len) * 2 / 1000
	cost += getTimberCutCost(par.shapeType) * perim;

	return cost;
}

/**
 * Получение цены балясины
 * @param balType Тип балясины
 */
function getBalPrice(balType) {
	var balPrice = 0
	if (balType == "bal_1") balPrice = 307; //1 корзинка
	if (balType == "bal_2") balPrice = 344; // 2 корзинки
	if (balType == "bal_3") balPrice = 308; // 1 поковка
	if (balType == "bal_4") balPrice = 458; // 2 поковки		
	if (balType == "bal_5") balPrice = 288; // Завиток
	if (balType == "bal_6") balPrice = 323; // 2 бублика
	if (balType == "bal_7") balPrice = 428; // 4 бублика
	if (balType == "bal_8") balPrice = 550; // 6 бубликов
	if (balType == "bal_9") balPrice = 750; // Завиток с листьями
	if (balType == "bal_10") balPrice = 137; // 1 кручение
	if (balType == "bal_11") balPrice = 137; // 2 кручения
	if (balType == "bal_12") balPrice = 428; // S-образная №1
	if (balType == "bal_13") balPrice = 447; //S-образная №2
	if (balType == "20х20") balPrice = 70; //профиль 20х20

	return balPrice;
}

/**
 * Считает цену рамок
 */
function calcFramesPrice() {
	var framePrice = 400;
	var totalFramePrice = framePrice * (getPartAmt("treadFrame") + getPartAmt("vertFrame"));
	var wndFramePrice = 1000;
	if (params.wndFrames == "профиль") wndFramePrice = 2000;
	totalFramePrice += wndFramePrice * (getPartAmt("wndFrame1") + getPartAmt("wndFrame2") + getPartAmt("wndFrame3"))
	return totalFramePrice;
}

/**
 * Расчет цены уголков
 */
function calcAnglesCost() {
	var anglePrice = 60;
	var angleAmt = getPartAmt("carcasAngle") + getPartAmt("treadAngle") + getPartAmt("adjustableLeg");
	return {
		angleAmt: angleAmt,
		price: anglePrice * angleAmt
	};
}

/**
	расчет цены распиловки
*/

function getTimberCutCost(shapeType) {
	var meterCutCost = 0; //резка на форматке в подарок
	if (shapeType == "по чертежу") meterCutCost = 150;
	if (shapeType == "по шаблону") meterCutCost = 300;
	if (shapeType == "по шаблону (криволин.)") meterCutCost = 500;

	return meterCutCost;
}

/** функция рассчитывает размеры заготовки с учетом размера листа
type: "щит" || "монолитный поликарбонат" || "сотовый поликарбонат"
len
width
calcBilletSize({len: 1900, width: 500, thk:40, type: "щит"})
**/

function calcBilletSize(par) {

	var billet = {
		len: par.len,
		width: par.width,
	}

	var sheet = {
		len: 3000,
		width: 600,
		amtLen: 1,
	}

	if (par.type == "щит") {
		sheet.amtLen = Math.floor(par.len / sheet.len);
		var extraPart = par.len % sheet.len;

		if (extraPart <= 1000) extraPart = 1000;
		if (extraPart > 1000 && extraPart <= 1500) extraPart = 1500;
		if (extraPart > 1500 && extraPart <= 2000) extraPart = 2000;
		if (extraPart > 2000) extraPart = 3000;
	}

	if (par.type == "сотовый поликарбонат") {
		var sheet = {
			len: 12000,
			width: 2100,
		}
		sheet.amtLen = Math.floor(par.len / sheet.len);
		var extraPart = par.len % sheet.len;

		if (extraPart <= 2000) extraPart = 2000;
		if (extraPart > 2000 && extraPart <= 3000) extraPart = 3000;
		if (extraPart > 3000 && extraPart <= 5000) extraPart = 5000;
		if (extraPart > 5000 && extraPart <= 7000) extraPart = 7000;
		if (extraPart > 7000) extraPart = 12000;

		billet.width = Math.ceil(par.width / sheet.width);
	}

	if (par.type == "монолитный поликарбонат") {

		sheet = {
			len: 3050,
			width: 2050,
		}
		sheet.amtLen = Math.floor(par.len / sheet.len);
		var extraPart = par.len % sheet.len;

		//округляем до целого листа
		billet.len = Math.ceil(par.len / sheet.len);
		billet.width = Math.ceil(par.width / sheet.width);
	}

	billet.len = sheet.len * sheet.amtLen + extraPart;

	if (par.type != "щит" && par.width > sheet.width) alertTrouble("Ширина детали больше размера листа!")
	if (par.len > sheet.len) alertTrouble("Длина детали больше размера листа!")

	//защита от ошибки
	if (billet.len < par.len) billet.len = par.len;
	if (billet.width < par.width) billet.width = par.width;

	billet.area = billet.len * billet.width / 1000000;
	billet.vol = billet.len * billet.width * par.thk / 1000000000;

	return billet

}

function setPrice(key, price) {
	if (!priceObj[key]) priceObj[key] = {}
	priceObj[key].discountPrice = price|| 0;
}

/** функция рассчитывает себестоимость доставки **/
function calcDeliveryCost(){
	var deliveryCost = 0;
	if (params.delivery != "нет") deliveryCost = 2000;	
	if (params.delivery == "Московская обл.") deliveryCost = 2000 + 30 * params.deliveryDist;	

	//разгрузка
	if (deliveryCost && params.customersLoad == "нет")  deliveryCost += 1500;

	deliveryCost *= params.deliveryAmt;

	return deliveryCost;
	
} //end of calcDeliveryCost