function calcRackPrice(){
	staircaseCost = {};
	
	//полки
	var timberPar = calcTimberParams(params.timberType);
	var paintPriceM2 = calcTimberPaintPrice(params.timberPaint, params.timberType)
	
	var timberVol = params.width * params.depth * params.shelfThk * params.shelfAmt / 1000000000;
	var paintedArea = (params.width * params.depth + (params.width + params.depth) * 2 * params.countertopThk) * params.shelfAmt / 1000000
	
	
	staircaseCost.shelfs = timberVol * timberPar.m3Price;
	staircaseCost.timberPaint = paintedArea * paintPriceM2;
	
	//каркас
	
	//стойки
	var legPar = getProfParams(params.legProf)
	var legTubeLen = params.height * 2 + params.depth;
	staircaseCost.carcas = legPar.unitCost * legTubeLen / 1000 * 2; //2 опоры
	
	
	//перемычки
	var bridgePar = getProfParams(params.bridgeProf)
	var bridgeTubeLen = (params.depth - legPar.sizeA * 2) * params.shelfAmt * 2;
	staircaseCost.carcas += bridgePar.unitCost * bridgeTubeLen / 1000;
	
	//раскосы
	if(params.carcasModel == "01"){
		var bracePar = getProfParams("20х20")
		var shelfStep = (params.height - params.topOffset - params.botOffset - params.shelfThk) / (params.shelfAmt - 1);
		var braceAng = Math.atan(shelfStep / params.width);
		var braceLen = shelfStep / Math.sin(braceAng);
		
		var braceTubeLen = (braceLen * 2) * (params.shelfAmt - 1) * 2;
		staircaseCost.carcas += bracePar.unitCost * braceTubeLen / 1000;
	}
	
	
	//порошковая покраска подстолья - упрощенно равна цене металла
	staircaseCost.carcas *= 2;
	
	//учитываем кол-во секций
	if(par.sectAmt) staircaseCost.carcas *= (par.sectAmt + 1) / 2;
	
}

