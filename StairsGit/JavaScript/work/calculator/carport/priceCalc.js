function calculateCarcasPrice(){
	var trussWidth = params.trussWidth;
		
	//колонны
	var profParmas = getProfParams(params.columnProfile);
	var columnsCost = profParmas.unitCost * getPartPropVal('carportRack', "sumLength");
	
	//прогоны
	var profParmas = getProfParams(params.progonProfile);
	var progonCost = profParmas.unitCost * getPartPropVal('progonProfile', 'sumLength');
	
	
	//кровля

	if(params.roofThk == '8') var polyListPrice = 270;
	if(params.roofThk == '10') var polyListPrice = 350;
	
	var polyRoofCost = getPartPropVal('polySheet', 'area') * polyListPrice;
	
	//соединительные профиля для поликарбоната
	var roofProfPrice = (getPartPropVal('polyConnectionProfile', "sumLength") || 0) * 100;
	roofProfPrice += (getPartPropVal('topRoofProfile', "sumLength") || 0) * 100;

	
	//краевой профиль для поликарбоната
	roofProfPrice += getPartPropVal('polyEdgeProfile', "sumLength") * 100;
	
	//термошайбы
	var roofShimPrice = 10 * getPartAmt('termoShim');//progonLength / 500;

	// Расчет стоимости ферм
	var list8mmPrice = 4000;
	var list4mmPrice = 2500;
	var trussListPrice = params.trussThk == 8 ? list8mmPrice : list4mmPrice;
	
	// Поперечные фермы
	var trussWidthCost = getPartPropVal('truss', 'area') * trussListPrice;
	
	if(params.carportType.indexOf("консольный") != -1){
		trussWidthCost *= 2; //к-т учитывает метизы, соединители и т.п.
	}
		
		
	//полоса по верху фермы
	trussWidthCost += getPartPropVal('trussLine', 'area') * list4mmPrice;

	// Продольные фермы
	var trussLenCost = getPartPropVal('trussSide', 'area') * trussListPrice;
	
	// Фланцы
	var flanPrice = getPartPropVal("rackFlan", "area") * list8mmPrice + getPartPropVal("trussFlan", "area") * list8mmPrice + getPartPropVal("arcTrussFlan", "area") * list8mmPrice;

	//болты, гайки каркаса
	var boltPrice = 0;
	//болты каркаса М10
	boltPrice += 10 * getPartAmt('boltM12');
	//болты крепления прогонов М6
	boltPrice += 5 * getPartAmt('boltM6');

	staircaseCost.truss = Math.round(trussWidthCost + trussLenCost);
	staircaseCost.columns = Math.round(columnsCost);
	staircaseCost.flans = Math.round(flanPrice);
	staircaseCost.progon = Math.round(progonCost);
	staircaseCost.bolts = boltPrice;
	staircaseCost.roof = Math.round(polyRoofCost);
	staircaseCost.roofProf = Math.round(roofProfPrice)
	staircaseCost.roofShim = Math.round(roofShimPrice)

	staircaseCost.total = 
		staircaseCost.truss
		+ staircaseCost.columns
		+ staircaseCost.flans
		+ staircaseCost.progon
		+ staircaseCost.bolts
		+ staircaseCost.roof
		+ staircaseCost.roofProf
		+ staircaseCost.roofShim;
};