function calculateCarcasPrice(){
	staircaseCost = {};
	
	//столешница
	var timberPar = calcTimberParams(params.timberType);
	var paintPriceM2 = calcTimberPaintPrice(params.timberPaint, params.timberType)
	
	var timberVol = params.width * params.depth * params.countertopThk / 1000000000;
	var paintedArea = (params.width * params.depth + (params.width + params.depth) * 2 * params.countertopThk) / 1000000
	
	
	staircaseCost.countertop = timberVol * timberPar.m3Price;
	staircaseCost.topTimberPaint = paintedArea * paintPriceM2;
	
	//подстолье
	var legPar = getProfParams(params.legProf)
	var legTubeLen = (params.height - params.countertopThk) * 2 + (params.depth - params.frontOverhang) * 2;
	
	staircaseCost.carcas = legPar.unitCost * legTubeLen / 1000 * 2; //2 опоры
	
	//царги
	var bridgePar = getProfParams(params.bridgeProf)
	var bridgeTubeLen = (params.width - params.sideOverhang * 2 - legPar.sizeA * 2) * 2;
	staircaseCost.carcas += bridgePar.unitCost * bridgeTubeLen / 1000;
	
	//порошковая покраска подстолья - упрощенно равна цене металла
	staircaseCost.carcas *= 2;
	
	
	
	//ящики
	

}

