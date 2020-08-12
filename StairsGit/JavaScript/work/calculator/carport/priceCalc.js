function calculateCarcasPrice(){
	var width = params.width;
		
	//колонны
	var profParmas = getProfParams(params.columnProf);
	var amt = getPartPropVal('carportColumn', "sumLength")
	var columnsCost = profParmas.unitCost * amt;
	addMaterialNeed(profParmas.materialNeedId, amt)
	
	//прогоны
	profParmas = getProfParams(params.progonProf);
	amt = getPartPropVal('purlinProf', 'sumLength')
	var progonCost = profParmas.unitCost * amt;
	addMaterialNeed(profParmas.materialNeedId, amt)
	
	if(params.carportType == "купол") progonCost *= 3;
	
	//балки
	var beamCost = 0;
	
	var profParmas = getProfParams("100х50");
	beamCost += profParmas.unitCost * getPartPropVal('carportBeamLen', 'sumLength');
	
	var profParmas = getProfParams(params.beamProf);
	amt = getPartPropVal('carportBeam', 'sumLength')
	beamCost += profParmas.unitCost * amt;
	addMaterialNeed(profParmas.materialNeedId, amt)
	
	//кровля
	var roofMeterCost = 200; //цена кровельного материала за м2
	
	if(params.roofMat.indexOf("поликарбонат") != -1){
		if(params.roofThk == '4') var roofMeterCost = 160;
		if(params.roofThk == '6') var roofMeterCost = 200;
		if(params.roofThk == '8') var roofMeterCost = 270;
		if(params.roofThk == '10') var roofMeterCost = 350;
		
		if(params.roofMat == "монолитный поликарбонат") roofMeterCost *= 8;
	}
	
	if(params.roofMat == "профнастил" || params.roofMat == "металлочерепица"){
		if(params.roofThk == 0.5) var roofMeterCost = 350;
		if(params.roofThk == 0.7) var roofMeterCost = 450;

		
		if(params.roofMat == "монолитный поликарбонат") roofMeterCost *= 8;
	}
	
	var roofCoverCost = getPartPropVal('polySheet', 'area') * roofMeterCost;
	
	//соединительные профиля для поликарбоната
	var roofProfPrice = (getPartPropVal('polyConnectionProfile', "sumLength") || 0) * 100;
	roofProfPrice += (getPartPropVal('topRoofProf', "sumLength") || 0) * 100;
		
	//краевой профиль для поликарбоната
	roofProfPrice += getPartPropVal('polyEdgeProf', "sumLength") * 100;
	
	//термошайбы
	var roofShimPrice = 10 * getPartAmt('termoShim');//progonLength / 500;

	// Расчет стоимости ферм
	var list8mmPrice = 4000;
	var list4mmPrice = 2500;
	var trussListPrice = params.trussThk == 8 ? list8mmPrice : list4mmPrice;
	
	// Поперечные фермы
	var widthCost = getPartPropVal('truss', 'area') * trussListPrice;
	
	if(params.carportType.indexOf("консольный") != -1){
		widthCost *= 2; //к-т учитывает метизы, соединители и т.п.
	}
		
		
	//полоса по верху фермы
	widthCost += getPartPropVal('trussLine', 'area') * list4mmPrice;
	
	// Продольные фермы
	var trussLenCost = getPartPropVal('trussSide', 'area') * trussListPrice;
	
	//сварные фермы из профилей
	if(params.beamModel == "ферма постоянной ширины"){
		//примерный расчет стоимости ферм
		var chordMeterCost = getProfParams(params.chordProf).unitCost
		var webMeterCost = getProfParams(params.webProf).unitCost
		
		//продольные фермы
		widthCost = params.width / 1000 * 2 * (chordMeterCost + webMeterCost);
		
		//поперечные фермы
		trussLenCost = params.sectAmt * params.sectLen / 1000 * 2 * 2 * (chordMeterCost + webMeterCost);
		
		//учитываем работу по изготовлению
		widthCost *= 2;
		trussLenCost *= 2;
		
	}

	// Фланцы
	var flanPrice = getPartPropVal("rackFlan", "area") * list8mmPrice + getPartPropVal("trussFlan", "area") * list8mmPrice + getPartPropVal("arcTrussFlan", "area") * list8mmPrice;

	//болты, гайки каркаса
	var boltPrice = 0;
	//болты каркаса М10
	boltPrice += 10 * getPartAmt('boltM12');
	//болты крепления прогонов М6
	boltPrice += 5 * getPartAmt('boltM6');
	
	//расчетные данные для купольного навеса - удалить после проработки модели
	
	if(params.carportType == "купол"  || params.carportType == "сдвижной") {
		
		if(params.roofMat != "нет"){
			var profMeterPrice = 60; 
			if(params.roofProfType == "алюминий") profMeterPrice = 350;
			roofProfPrice = getPartPropVal('progonProf', 'sumLength') * profMeterPrice;
			
		}
		
		boltPrice = 5000; //болты, подшипники, колеса и т.п.
		
		//к-т на цену
		beamCost *= 2;
		progonCost *= 2;
		
	}
	
	//расчетные данные для навеса с дугами - удалить после проработки модели
	
	if(params.beamModel == "проф. труба") {
		boltPrice += 200 * getPartPropVal('carportBeam', 'amt');
		roofShimPrice = 10 * getPartPropVal('carportBeam', 'sumLength') / 0.5;
	}
	
	//расчетные данные для многоугольной беседки - удалить после проработки модели
	
	if(params.carportType == "многогранник") {
		boltPrice += 200 * getPartPropVal('carportBeam', 'amt');
		roofShimPrice = 10 * getPartPropVal('carportBeam', 'sumLength') / 0.5;
		
		beamCost *= 2; //к-т учитывающий сложное запиливание под уголом и соединители из листа
	}

//если нет кровли
	if(params.roofMat == "нет") {
		roofCoverCost = roofProfPrice = roofShimPrice = 0;
	}

	staircaseCost.truss = Math.round(widthCost + trussLenCost);
	staircaseCost.beams = Math.round(beamCost);
	staircaseCost.columns = Math.round(columnsCost);
	staircaseCost.flans = Math.round(flanPrice);
	staircaseCost.progon = Math.round(progonCost);
	staircaseCost.bolts = boltPrice;
	staircaseCost.roof = Math.round(roofCoverCost);
	staircaseCost.roofProf = Math.round(roofProfPrice)
	staircaseCost.roofShim = Math.round(roofShimPrice)

	staircaseCost.total = 
		staircaseCost.truss
		+ staircaseCost.beams
		+ staircaseCost.columns
		+ staircaseCost.flans
		+ staircaseCost.progon
		+ staircaseCost.bolts
		+ staircaseCost.roof
		+ staircaseCost.roofProf
		+ staircaseCost.roofShim;

};