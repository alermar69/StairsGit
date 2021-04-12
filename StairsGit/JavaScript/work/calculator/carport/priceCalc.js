//var costMarkup = 1.3; //07.05.20;
//var costMarkup = 1.56; //11.01.21
var costMarkup = 1.6; //31.03.21

/** функия обертка для совместимости с общей структурой **/
function calculateCarcasPrice(){
	calcCarportCost()
};


/** функция рассчитывает себестоимость навеса **/
function calcCarportCost(){
	//колонны
	var profParmas = getProfParams(params.columnProf);
	var amt = getPartPropVal('carportColumn', "sumLength")
	var columnsCost = profParmas.unitCost * amt;
	addMaterialNeed({id: profParmas.materialNeedId, amt: amt})
	
	//прогоны
	profParmas = getProfParams(params.progonProf);
	amt = getPartPropVal('purlinProf', 'sumLength')
	var progonCost = profParmas.unitCost * amt;
	addMaterialNeed({id: profParmas.materialNeedId, id: amt})
	
	if(params.carportType == "купол") progonCost *= 3;
	
	//балки
	var beamCost = 0;
	
	var profParmas = getProfParams("100х50");
	beamCost += profParmas.unitCost * getPartPropVal('carportBeamLen', 'sumLength');
	
	var profParmas = getProfParams(params.beamProf);
	amt = getPartPropVal('carportBeam', 'sumLength')
	beamCost += profParmas.unitCost * amt;
	addMaterialNeed({id: profParmas.materialNeedId, id: amt})
	
	if(params.beamModel == "сужающаяся" || params.beamModel == "постоянной ширины"){
		// Продольные балки (18 швеллер)
		var beamMeterCost = 1000; //800р/м цена материала, 200р/м - плазма + приварка фланцев
		beamCost = getPartPropVal('trussSide', 'sumLength') * beamMeterCost;
	}

	//кровля
	var roofMeterCost = 500; //цена кровельного материала за м2
	
	if(params.roofMat.indexOf("поликарбонат") != -1){
		//цена поликарбоната взята отсюда https://polidin.ru/sotoviy-polikarbonat-petalex-primavera/ 
		if(params.roofPlastColor == "прозрачный"){
			if(params.roofThk == '4') var roofMeterCost = 261;
			if(params.roofThk == '6') var roofMeterCost = 428;
			if(params.roofThk == '8') var roofMeterCost = 475;
			if(params.roofThk == '10') var roofMeterCost = 523;
		}
		if(params.roofPlastColor != "прозрачный"){
			if(params.roofThk == '4') var roofMeterCost = 274;
			if(params.roofThk == '6') var roofMeterCost = 449;
			if(params.roofThk == '8') var roofMeterCost = 499;
			if(params.roofThk == '10') var roofMeterCost = 549;
		}
		
		if(params.roofMat == "монолитный поликарбонат") roofMeterCost *= 8;
		
		roofMeterCost *= 1.2; //к-т учитывающий обрезки
	}
	
	if(params.roofMat == "профнастил" || params.roofMat == "металлочерепица"){
		if(params.roofThk == 0.35) var roofMeterCost = 350;
		if(params.roofThk == 0.4) var roofMeterCost = 400;
		if(params.roofThk == 0.5) var roofMeterCost = 500;
		if(params.roofThk == 0.7) var roofMeterCost = 600;
	}
	
	roofMeterCost *= 1.3; //1.3 - подъем цен 31.03.21
	
	var roofCoverCost = getPartPropVal('polySheet', 'area') * roofMeterCost;
	
	//соединительные профиля для поликарбоната
	var roofProfPrice = (getPartPropVal('polyConnectionProfile', "sumLength") || 0) * 100;
	roofProfPrice += (getPartPropVal('topRoofProf', "sumLength") || 0) * 100;
		
	//краевой профиль для поликарбоната
	roofProfPrice += getPartPropVal('polyEdgeProf', "sumLength") * 100;
	
	//термошайбы
	var roofShimPrice = 10 * getPartAmt('termoShim');//progonLength / 500;

	// Расчет стоимости ферм
	var list8mmPrice = 5000;
	var list4mmPrice = 3000;
	var trussListPrice = params.trussThk == 8 ? list8mmPrice : list4mmPrice;
	
	// Поперечные фермы
	var widthCost = getPartPropVal('truss', 'area') * trussListPrice;
	
	if(params.carportType.indexOf("консольный") != -1){
		widthCost *= 2; //к-т учитывает метизы, соединители и т.п.
	}
		
	//полоса фермы
	stripeCost = getProfParams(params.chordProf).unitCost + 200; //200р/м - приварка полосы	
	widthCost += getPartPropVal('truss', 'stripeLength') * stripeCost;

	var trussLenCost = 0
	
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
			roofProfPrice = getPartPropVal('progonProf', 'sumLength') * profMeterPrice;
			
		}
		
		boltPrice = 5000; //болты, подшипники, колеса и т.п.
		
		//полосовые уполтнительные щетки
		if(params.lineBrush == "есть"){
			var profMeterPrice = 1000; 
			roofProfPrice = getPartPropVal('lineBrush', 'sumLength') * profMeterPrice
		}
		
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

	//водосток - заменить на данные с модели
	
	var drainCost = 0;
	if(params.gutter != "нет"){
		//труба
		var drainCost = 500 + 100 * 3 + 100 * 3; //труба 3м + 3 колена + 3 крепления

		//лоток
		drainCost += Math.ceil(partPar.main.len / 3000) * 500 + 100 * Math.ceil(partPar.main.len / 600) + 200 + 100 * 2; //лоток по 3м, крепления, воронка, 2 заглушки
		
		if(params.carportType == "двухскатный") drainCost *= 2;
		if(params.gutter == "круглый") drainCost *= 1.5;
	}
	
	//покраска металла
	if(params.carportMetalPaint == "порошок") {
		var metalPaintCost = (widthCost + trussLenCost + beamCost + columnsCost + progonCost) * 0.2; //упрощенная формула
		metalPaintCost *= calcMetalPaintCostFactor(); //функция в файле priceLib, добавляет к-т в зависимости от цвета покраски
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
	staircaseCost.drain = Math.round(drainCost)
	staircaseCost.carcasMetalPaint = Math.round(metalPaintCost);

	staircaseCost.total = 
		staircaseCost.truss
		+ staircaseCost.beams
		+ staircaseCost.columns
		+ staircaseCost.flans
		+ staircaseCost.progon
		+ staircaseCost.bolts
		+ staircaseCost.roof
		+ staircaseCost.roofProf
		+ staircaseCost.drain
		+ staircaseCost.roofShim + 
		+ staircaseCost.carcasMetalPaint;
	
}