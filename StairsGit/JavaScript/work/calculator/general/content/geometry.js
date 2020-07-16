function getGeomDescr(){
	var ignor_calcTypes = ['vint', 'vhod', 'railing']
	if(ignor_calcTypes.indexOf(params.calcType) != -1) return;
	
	var par = {
		text: "",
	}
	
//прямая лестница
	
	if(params.stairModel == "Прямая"){
		var marshParams = getMarshParams(1);
		var modelParams = {
			turnType: "stright",
			model: params.model,
			turnTypeName: "прямая",
		}
		modelParams = setModelDimensions(modelParams);
		var topStepDelta = modelParams.topStepDelta;
		
		par.G = Math.round((params.floorHoleLength - topStepDelta) * marshParams.h / marshParams.b - params.floorThickness);
		if(params.topStairType == "вровень") par.G -= Math.round(marshParams.h)
		
		par.staircaseLength = marshParams.stairAmt * marshParams.b + topStepDelta;
		if(params.model == "лт") par.staircaseLength += 5; //учитываем вынос тетивы перед первой ступенью
		
		if(platformTop == "площадка") {
			par.G = 3000;
			par.staircaseLength = marshParams.stairAmt * marshParams.b + params.platformLength_3;
		}
		
		if(par.G > params.staircaseHeight - params.floorThickness) par.G = params.staircaseHeight - params.floorThickness;
		
		par.text = 
			marshParams.text + 
			"Ширина марша М =  " + params.M + " мм;<br/>\
			Свес = " + params.nose + "мм.<br/>";
		if(params.platformTop != "площадка"){
			par.text += "Габарит par.G = " + par.G + "мм.<br/>";
		}
		par.text +=
			"Длина проекции лестницы на пол staircaseLength = " + par.staircaseLength + "мм.<br/>";
	}
	
//поворотная лестница

	if(params.stairModel != "Прямая"){
		//размеры повротов в зависимости от модели		
		var turnTypeName = "площадка";
		if(params.stairModel == "Г-образная с забегом") turnTypeName = "забег";
		if(params.stairModel == "П-образная с забегом") turnTypeName = "забег";
		if(params.stairModel == "П-образная трехмаршевая" && params.turnType_2 == "забег") turnTypeName = "забег";
	
		var modelDimensions = {
			turnType: "G_turn",
			model: params.model,
			turnTypeName: turnTypeName,
		}
		if(params.stairModel == "П-образная с забегом" || params.stairModel == "П-образная с площадкой") modelDimensions.turnType = "P_turn";
		modelDimensions = setModelDimensions(modelDimensions);
		var deltaBottom = modelDimensions.deltaBottom;
		var deltaTop = modelDimensions.deltaTop;
		var topStepDelta = modelDimensions.topStepDelta;
		var deltaBottom_3 = deltaBottom;
		var deltaTop_2 = deltaTop;
		var turnLength = M;
		if(stairModel == "П-образная с площадкой") turnLength = params.platformLength_1;
		
		//габарит
		parG = {
			deltaTop: deltaTop,
			turnLength: turnLength,
			topStepDelta: topStepDelta,
			b1: params.b1,
			h1: params.h1,
			b3: params.b3,
			h3: params.h3,
			h2: params.h2,
			stepAmt_3: params.stepAmt_3,
		}
		G = calcG(parG);
		
		var stepAmt = params.stairAmt1 + params.stairAmt3 + 1;		
		if(params.stairModel == "Г-образная с забегом") stepAmt += 2;
		if(params.stairModel == "П-образная с забегом") stepAmt += 5;
		if(stairModel == "П-образная трехмаршевая"){
			 stepAmt += params.stairAmt2 + 1;
			 if(params.turnType_1 == "забег")  stepAmt += 2;
			 if(params.turnType_2 == "забег")  stepAmt += 2;
		}
		
	
		//верхний и нижний марши имеют одинаковые параметры
		if(params.b1 == params.b3 && params.h1 == params.h3){
			par.text = "<b>Верхний и нижний марши:</b><br/>" + 
				getMarshParams(1).text + 
				"Кол-во прямых ступеней в нижнем марше = " + params.stairAmt1 + " шт.<br/>" +
				"Кол-во прямых ступеней в верхнем марше = " + params.stairAmt3 + " шт.<br/>";
		}
		else {
			par.text = 
				"<b>Нижний марш:</b><br/>" +
				getMarshParams(1).text + 
				"Кол-во прямых ступеней в нижнем марше = " + params.stairAmt1 + " шт.<br/>" +
				"<b>Верхний марш:</b><br/>" +
				getMarshParams(3).text + 
				"Кол-во прямых ступеней в верхнем марше = " + params.stairAmt1 + " шт.<br/>" +
		}
		
		if(stairModel == "П-образная трехмаршевая"){
				text += "<b>Средний марш:</b><br/>" +
					getMarshParams(2).text +
					"Кол-во прямых ступеней в среднем марше = " + stairAmt2 + " шт.<br/>";
			}
			text +=
				"<b>Общие характеристики:</b><br/>" +
				"Ширина маршей M = " + params.M + " мм;<br/>" +
				"Свес ступени = " + params.nose + "мм.<br/>" +
				"Фланец крепления к верхнему перекрытию: " + params.topFlan + "<br/>" +
				"Кол-во подъемов всего = " + stepAmt + "шт.<br/>" +
				"Габарит G = " + G + " мм.<br/>" +
				"Глубина площадки = " + turnLength + "мм.<br/>";
		
	}
	
	return par;
}

