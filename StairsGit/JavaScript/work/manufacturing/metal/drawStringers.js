function drawStringer(par){

	//рассчитываем параметры косоура по номеру марша
	calcStringerPar(par); //функция в этом файле ниже
	par.partsLen = []; //массив длин кусков косоура для спецификации
	par.meshes = [];

	getMarshAllParams(par);

	//рассчитываем проступи на забеге. Берутся параметры верхнего или нижнего забега
	if(par.treadsObj.wndPar) par.wndSteps = calcWndSteps(par.treadsObj.wndPar);
	if(par.treadsObj.wndPar2 && par.marshId > 1) par.wndSteps = calcWndSteps(par.treadsObj.wndPar2);

	//именованные ключевые точки
	if (!par.keyPoints) par.keyPoints = {};
	if (!par.keyPoints[par.key]) par.keyPoints[par.key] = {};
	par.keyPoints[par.key].zeroPoint = { x: 0, y: 0 };
	par.zeroPoint = { x: 0, y: 0 };

	par.pointsShape = [];
	par.pointsShapeTop = [];
	par.pointsShapeBot = [];
	par.pointsHole = [];
	par.pointsHoleTop = [];
	par.pointsHoleBot = [];
	par.railingHoles = [];
	par.railingHolesTop = [];
	par.railingHolesBot = [];

	//смещаем dxfBasePoint на длину нижнего участка
	par.dxfBasePoint.x += par.turnParams.turnLengthBot;

	//подпись под контуром

	var name = "Косоур";
	if(params.model == "лт") name = "Тетива";

	var text = name + " внутр.";
	if(par.key === 'out') text = name + " внешн.";
	var isMirrow = false;
	if(turnFactor == 1 && par.key == "out") isMirrow = true;
	if(turnFactor == -1 && par.key == "in") isMirrow = true;
	//для прямой все наоборот
	if (params.stairModel == "Прямая") isMirrow = !isMirrow;
	if(isMirrow) text += " (зеркально)";
	var textHeight = 30;
	var textBasePoint = newPoint_xy(par.dxfBasePoint, 20, (par.botEnd == "platformG" || par.botEnd == "platformP") ? -350.0 : -150.0);
	addText(text, textHeight, dxfPrimitivesArr, textBasePoint);


	par.stringerShape = new THREE.Shape();
	par.stringerShapeTop = new THREE.Shape();
	par.stringerShapeBot = new THREE.Shape();

	// точки вставки уголков, рамок, перемычек
	if(!par.elmIns) par.elmIns = {};
	par.elmIns[par.key] = {};
	par.elmIns[par.key].bridges = [];
	par.elmIns[par.key].racks = [];
	par.elmIns[par.key].longBolts = [];

	//параметры забега для самонесущего стекла
	par.wndParams = par.wndParams || {};
	par.wndParams[par.key] = {
		turnCutBot: 0,
		turnAngle: 0,
	}


	if(params.model == "ко"){

		// уголки и рамки
		par.stepHoleY = -20.0;           // координата Y отверстий крепления рамки
		par.rutelPosY = -60;

		var isException = false; //является ли текущий случай исключением
		var wndFramesHoles = par.wndFramesHoles;

	//нестандартное построение

		//0 ступеней в первом марше

		if(par.marshId == 1 && par.stairAmt == 0){
			if(par.topEnd == "winder"){
				if (par.key == "in"){
					drawStringerKo_0Bot_WndGIn(par);
					isException = true;
					}
				}
			if(par.topEnd == "platformG"){
				drawStringerKo_0Bot_PltG(par);
				isException = true;
				}

			}

	//стандартное построение

		if (!isException) {

			/*низ марша*/

			//рассчитываем проступи на забеге. Берутся параметры верхнего или нижнего забега
			if (par.treadsObj.wndPar) par.wndSteps = calcWndSteps(par.treadsObj.wndPar);
			if (par.treadsObj.wndPar2 && par.marshId > 2) par.wndSteps = calcWndSteps(par.treadsObj.wndPar2);
			if (par.treadsObj.wndPar2) {
				if (par.marshId > 1 && params.stairModel == "П-образная с забегом") {
					if (par.marshId == 2) par.treadsObj.wndPar2.marshId = 1;
					if (par.marshId == 3) par.treadsObj.wndPar2.marshId = 2;
					par.wndSteps = calcWndSteps(par.treadsObj.wndPar2);
				}
			}

			if (par.wndFramesHoles1 && par.marshId > 2) par.wndFramesHoles = par.wndFramesHoles1;


			if (par.botEnd == "floor") drawBotStepKo_floor(par);
			if (par.botEnd == "platformG") drawBotStepKo_pltG(par);
			if (par.botEnd == "platformP") drawBotStepKo_pltP(par);
			if (par.botEnd == "winder" && par.key == "in") drawBotStepKo_wndIn(par);
			if (par.botEnd == "winder" && par.key == "out") drawBotStepKo_wndOut(par);

			/*средние ступени*/
			ltko_set_railing(par.stairAmt, par);

			par.divide = ltko_set_divide(par.marshId).divide;
			if (par.railing.includes(par.divide) && params.railingModel == "Самонесущее стекло") par.divide += 1;

			if(!par.isWndP) drawMiddleStepsKo(par);

			/*верх марша*/

			//рассчитываем проступи на забеге. Берутся параметры верхнего или нижнего забега
			if (par.treadsObj.wndPar) par.wndSteps = calcWndSteps(par.treadsObj.wndPar);
			if (par.treadsObj.wndPar2 && par.marshId > 1) {
				if (par.marshId == 2) par.treadsObj.wndPar2.marshId = 2;
				par.wndSteps = calcWndSteps(par.treadsObj.wndPar2);
			}

			par.wndFramesHoles = wndFramesHoles;
			if (par.wndFramesHoles1 && par.marshId > 1) par.wndFramesHoles = par.wndFramesHoles1;

			if (par.topEnd == "floor") drawTopStepKo_floor(par);
			if (par.topEnd == "platformG") drawTopStepKo_pltG(par);
			if (par.topEnd == "platformP") drawTopStepKo_pltP(par);
			if (par.topEnd == "winder" && par.key == "in") drawTopStepKo_wndIn(par);
			if (par.topEnd == "winder" && par.key == "out") drawTopStepKo_wndOut(par);

			//смещяем первую стойку если начало ограждений не с первой ступени
			if (par.marshId == 1 && params.railingStart !== "0" && par.railingHoles[0] && par.marshParams.hasRailing[par.key]) {
				par.railingHoles[0] = newPoint_xy(par.railingHoles[0], par.b * params.railingStart, par.h * params.railingStart);
				if (params.railingModel == "Самонесущее стекло") {
					par.railingHoles[1] = newPoint_xy(par.railingHoles[1], par.b * params.railingStart, par.h * params.railingStart);
					par.railingHoles[2] = newPoint_xy(par.railingHoles[2], par.b * params.railingStart, par.h * params.railingStart);
				}
			}
		}
		par.wndFramesHoles = wndFramesHoles;
	}


	if(params.model == "лт"){
	// константы

	par.stepHoleY = -(params.treadThickness + 20.0 + 5.0);          // координата Y отверстий крепления уголка ступени
	if(params.stairType == "пресснастил") par.stepHoleY -= 5;
	if (par.isMiddleStringer) {
		//par.stepHoleY = -params.treadThickness;
	}
	//лотки
	if (params.stairType == "лотки") {
		// рассчитываем параметры рамки
		var parFrame = {marshId: par.marshId}
		calcFrameParams(parFrame); //функция в файле drawCarcasParts.js
		par.stepHoleY = -par.stringerLedge - parFrame.profHeight / 2 + 0.01;
		}

	par.rackTopHoleY = -60; //координта верхнего отверстия крепления стойки
	par.rutelPosY = -115;

	var isException = false; //является ли текущий случай исключением

//нестандартное построение

	//0 ступеней в первом марше
	if(par.marshId == 1 && par.stairAmt == 0){
		if(par.topEnd == "winder"){
			if (par.key == "in") {
				drawStringerLt_0Bot_WndGIn(par);
				isException = true;
				}
			}
		if(par.topEnd == "platformG"){
			drawStringerLt_0Bot_PltG(par);
			isException = true;
			}
		}

//стандартное построение

	if (!isException){
		/*низ марша*/

		if (par.botEnd == "floor") drawBotStepLt_floor(par);
		if (par.botEnd == "platformG") {
			//средний марш трехмаршевой с 0 ступеней во 2 марше
			if(params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && params.stairAmt2 == 0) drawBotStepLt_pltG_3marsh0(par);
			else drawBotStepLt_pltG(par);
			}
		if (par.botEnd == "platformP" && par.key == "in") drawBotStepLt_pltPIn(par);
		if (par.botEnd == "platformP" && par.key == "out") drawBotStepLt_pltPOut(par);
		if (par.botEnd == "winder" && par.key == "in") drawBotStepLt_wndIn(par);
		if (par.botEnd == "winder" && par.key == "out") drawBotStepLt_wndOut(par);

		/*средние ступени*/
		ltko_set_railing(par.stairAmt, par);

		//параметры для самонесущего стекла
		if (params.railingModel == "Самонесущее стекло") {
			if (!par.stringerLast && par.key == "out" && par.marshParams.topTurn == "площадка")
				ltko_set_railing(par.stairAmt + 1, par);
			if(par.stringerLast && params.platformTop != "нет" && getTopPltRailing()[par.key]){
				ltko_set_railing(par.stairAmt + 1, par);
				}
		}

		par.bridge = ltko_set_divide(par.marshId).bridges;
		par.divide = ltko_set_divide(par.marshId).divide;
		if (par.railing.includes(par.divide)) par.divide -= 1;

		if (par.stairFrame == "нет" && par.marshId != 1 && par.stairAmt > 1 && par.botEnd == "winder")
			par.bridge.unshift(1);
		if (params.calcType === 'bolz') par.bridge = [];

		if(!par.isWndP) drawMiddleStepsLt(par);


		/*верх марша*/

		if (par.topEnd == "floor") drawTopStepLt_floor(par);
		if (par.topEnd == "winder" && par.key == "in") drawTopStepLt_wndIn(par);
		if (par.topEnd == "winder" && par.key == "out") drawTopStepLt_wndOut(par);

		//стандартный верхний узел
		if (!par.marshParams.lastMarsh || params.platformTop != 'увеличенная') {
			if (par.topEnd == "platformG")  drawTopStepLt_pltG(par);
			if (par.topEnd == "platformP" && par.key == "in") drawTopStepLt_pltPIn(par);
			if (par.topEnd == "platformP" && par.key == "out") drawTopStepLt_pltPOut(par);
			}

		//увеличенная площадка
		if (par.marshParams.lastMarsh && params.platformTop == 'увеличенная') {
			//выступ увеличенной площадки на внутренней стороне
			if(params.stairModel != 'Прямая'){
				if (par.key == "in") drawTopStepLt_pltPIn(par);
				if (par.key == "out" || par.isMiddleStringer) drawTopStepLt_pltG(par);
				}
			//выступ увеличенной площадки на внешней стороне
			if(params.stairModel == 'Прямая'){
				if (par.key == "out") drawTopStepLt_pltPIn(par);
				if (par.key == "in" || par.isMiddleStringer) drawTopStepLt_pltG(par);
				}

		}

		//смещяем первую стойку если начало ограждений не с первой ступени
		if (par.marshId == 1 && params.railingStart !== 0 && par.railingHoles[0] && par.marshParams.hasRailing[par.key]) {
			par.railingHoles[0].x += par.b * params.railingStart;
			par.railingHoles[0].y += par.h * params.railingStart;
			if (params.railingStart >= par.stairAmt) par.railingHoles.shift();
			if (params.railingModel == "Трап") {
				par.railingHoles[1].x += par.b * params.railingStart;
				par.railingHoles[1].y += par.h * params.railingStart;
			}
			if (params.railingModel == "Самонесущее стекло") {
				par.railingHoles[1].x += par.b * params.railingStart;
				par.railingHoles[1].y += par.h * params.railingStart;
				par.railingHoles[2].x += par.b * params.railingStart;
				par.railingHoles[2].y += par.h * params.railingStart;
			}
		}

	}
	}

	// отверстия для опорных колонн

	if (params.columnModel !== "нет") {
		var holesParams = {
			keyPoints: par.keyPoints[par.key],
			key: par.key,
			botEnd: par.botEnd,
			isWndP: par.isWndP,
			marshId: par.marshId,
			railingHoles: par.railingHoles,
		};

		var colunsHoles = calcColumnPosHoles(holesParams);

		// добавляем отверстия для колонн в общий массив
		if (colunsHoles) {
			for (i=0; i<colunsHoles.length; i++) {
				if (colunsHoles[i].place == "bot") par.pointsHoleBot.push(colunsHoles[i]);
				else par.pointsHole.push(colunsHoles[i]);
			}
		}
	}


	var radIn = 10;
	var radOut = 10;
	if(params.model == "лт") radIn = 5;

	//создаем шейп
	var shapePar = {
		points: par.pointsShape,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		radIn: radIn, //Радиус скругления внутренних углов
		radOut: radOut, //радиус скругления внешних углов
		//markPoints: true,
	}

	var marshShapes = [];
	var divides = [];//[1,3,5,7];
	if (par.divide && par.divide !== 0) {
		// divides = [par.divide];
		divides = [{p1: par.keyPoints.divideP1, p2: par.keyPoints.divideP2}]
	}

	if (divides.length == 0) {
		//параметры для рабочего чертежа
		shapePar.drawing = {
			name: "Косоур марша",
			group: "stringers",
			baseLine: {
				p1: par.keyPoints.botPoint,
				p2: par.keyPoints.topPoint
			},
			mirrow: (par.marshParams.side[par.key] == 'left'),
		}

		par.stringerShape = drawShapeByPoints2(shapePar).shape;

		//рисуем отверстия
		drawStringerHoles(par);

		//рисуем отверстия для обшивки каркаса гипсокартоном
		var stringerHolesParams = {
			dxfBasePoint: par.dxfBasePoint,
			elmIns: par.elmIns,
			stringerShape: par.stringerShape,
			topPoint: par.keyPoints.topPoint,
			botPoint: par.keyPoints.botPoint,
			pointsShape: par.pointsShape,
			marshParams: par.marshParams,

		}
		drawStringerBotHoles(stringerHolesParams);

		//добавляем отверстия под ограждения
		var railingHolesPar = {
			shape: par.stringerShape,
			holeCenters: par.railingHoles,
			dxfBasePoint: par.dxfBasePoint,
		}
		drawRailingHoles(railingHolesPar);
	}

	if (divides.length > 0) {
		//параметры для рабочего чертежа
		shapePar.drawing = {
			name: "Косоур марша",
			group: "stringers",
			baseLine: {
				p1: par.keyPoints.botPoint,
				p2: par.keyPoints.topPoint
			},
			mirrow: (par.marshParams.side[par.key] == 'left'),
		}
		var previousDivideP1 = null;
		var previousDivideP2 = null;

		/*
			Фильтрация точек для разрезов, чтобы не повторяться
		*/
		function shapeHasPoint(p, i, dP1, pdP1, dividesCount){
			if (i == 0 && p.y < dP1.y) {
				return true;
			}else if (i !== 0 && p.y < dP1.y && p.y > pdP1.y) {
				return true;
			}else if(i == dividesCount && p.y > pdP1.y){
				return true
			}else{
				return false;
			}
		}

		for (var i = 0; i <= divides.length; i++) {
			var points = [];
			var divideP1, divideP2;
			if (i < divides.length) {
				divideP1 = divides[i].p1;
				divideP2 = divides[i].p2;
				divideP1.filletRad = divideP2.filletRad = 0;
				// console.log(divideP1, divideP2)
				if (par.pointsShape.find(function(elem){return elem.y == divideP1.y})) {
					divideP1.y -= 1;
					divideP2.y -= 1;
					// divideP1.divideFix = true;//В зависимости от этого поля выбирается корректный индекс куда вставлять точки разреза
				}
			}
			points = par.pointsShape.filter(function(p){return shapeHasPoint(p, i, divideP1, previousDivideP1, divides.length)});

			if (params.stringerType == 'пилообразная' || params.stringerType == 'прямая') {
				//if (i > 0) points.unshift(polar(previousDivideP2, par.marshParams.ang, 10), polar(previousDivideP1, Math.PI / 2, 10));
				if (i > 0) points.unshift(previousDivideP2, previousDivideP1);
			}
			if (params.stringerType == 'ломаная') {
				if (i > 0){
					// var minVal = null;
					// var minIndex = null;

					//Определяем минимальную точку в шейпе
					// points.forEach(function(elem, index) {
					// 	if ((elem.y < minVal) || minVal == null) {
					// 		minVal = elem.y
					// 		minIndex = index;
					// 	};
					// });
					//После минимальной точки вставляем свои
					// if (previousDivideP1.divideFix) minIndex += 2;
					// if (points[minIndex].x !== previousDivideP2.x && !previousDivideP1.divideFix) minIndex += 2;
					// console.log(points, "P1:", previousDivideP1, "P2:", previousDivideP2, "MIN:", points[minIndex])
					var p1 = points.find(function(p){
						return p.x.toFixed(1) == previousDivideP1.x.toFixed(1);//Округляем до 1 символа после запятой
					});
					var p2 = points.find(function(p){
						return p.x.toFixed(1) == previousDivideP2.x.toFixed(1);//Округляем до 1 символа после запятой
					});
					if (p1 && p2) {
						points.splice(points.indexOf(p1), 0, previousDivideP1);
						points.splice(points.indexOf(p2) + 1, 0, previousDivideP2);
					}
				}
			}
			if (i < divides.length) {
				if (params.stringerType == 'пилообразная' || params.stringerType == 'прямая') points.push(divideP1, divideP2);
				if (params.stringerType == 'ломаная') {
					points.push(divideP1);
					points.unshift(divideP2);
				}
				previousDivideP1 = divideP1;
				previousDivideP2 = divideP2;

				previousDivideP1.filletRad = previousDivideP2.filletRad = 0;
			}

			shapePar.points = points;

			var shape = drawShapeByPoints2(shapePar).shape;
			marshShapes.push(shape);

			var holes = par.pointsHole.filter(function(p){
				return shapeHasPoint(p, i, divideP1, previousDivideP1, divides.length)
			});

			var stringerHolesParams = {
				dxfBasePoint: par.dxfBasePoint,
				elmIns: par.elmIns,
				stringerShape: shape,
				key: par.key,
				pointsHole: holes,
			}

			//рисуем отверстия
			drawStringerHoles(stringerHolesParams);

			//рисуем отверстия для обшивки каркаса гипсокартоном
			//stringerHolesParams.keyPoints = par.keyPoints;
			stringerHolesParams.topPoint = divideP1;
			stringerHolesParams.botPoint = par.keyPoints.botPoint;
			stringerHolesParams.isDivideBot = true;
			if (i > 0) {
				stringerHolesParams.isDivideBot = false;
				stringerHolesParams.isDivideTop = true;
				stringerHolesParams.topPoint = par.keyPoints.topPoint;
				stringerHolesParams.botPoint = divideP2;
			}
			//stringerHolesParams.pointsShape = par.pointsShape;
			stringerHolesParams.pointsShape = points;
			stringerHolesParams.marshParams = par.marshParams;
			//stringerHolesParams.divideP2 = divideP2;
			drawStringerBotHoles(stringerHolesParams);

			//добавляем отверстия под ограждения
			var holes = par.railingHoles.filter(function(p){
					return shapeHasPoint(p, i, divideP1, previousDivideP1, divides.length)
				});

			var railingHolesPar = {
				shape: shape,
				holeCenters: holes,
				dxfBasePoint: par.dxfBasePoint,
			}
			drawRailingHoles(railingHolesPar);
		}

	}


	if (par.pointsShapeTop.length > 0){
		//создаем шейп
		var shapePar = {
			points: par.pointsShapeTop,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: par.dxfBasePoint,
			radIn: radIn, //Радиус скругления внутренних углов
			radOut: radOut, //радиус скругления внешних углов
			//markPoints: true,
		}

		//параметры для рабочего чертежа
		shapePar.drawing = {
			name: "Косоур верхний",
			group: "stringers",
		}

		par.stringerShapeTop = drawShapeByPoints2(shapePar).shape;

		//рисуем отверстия
		drawStringerHoles(par, "top");

		//рисуем отверстия для обшивки каркаса гипсокартоном
		var stringerHolesParams = {
			dxfBasePoint: par.dxfBasePoint,
			elmIns: par.elmIns,
			stringerShape: par.stringerShape,
			topPoint: par.keyPoints.topPoint,
			botPoint: par.keyPoints.botPoint,
			pointsShape: par.pointsShape,
			marshParams: par.marshParams,

		}
		drawStringerBotHoles(stringerHolesParams, "top");

		//добавляем отверстия под ограждения
		var railingHolesPar = {
			shape: par.stringerShapeTop,
			holeCenters: par.railingHolesTop,
			dxfBasePoint: par.dxfBasePoint,
			}
		drawRailingHoles(railingHolesPar);
	}

	if (par.pointsShapeBot.length > 0){
		//создаем шейп
		var shapePar = {
			points: par.pointsShapeBot,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: par.dxfBasePoint,
			radIn: radIn, //Радиус скругления внутренних углов
			radOut: radOut, //радиус скругления внешних углов
			//markPoints: true,
		}

		//параметры для рабочего чертежа
		shapePar.drawing = {
			name: "Косоур нижний",
			group: "stringers",
		}


		par.stringerShapeBot = drawShapeByPoints2(shapePar).shape;

		//рисуем отверстия
		drawStringerHoles(par, "bot");

		//рисуем отверстия для обшивки каркаса гипсокартоном
		var stringerHolesParams = {
			dxfBasePoint: par.dxfBasePoint,
			elmIns: par.elmIns,
			stringerShape: par.stringerShape,
			topPoint: par.keyPoints.topPoint,
			botPoint: par.keyPoints.botPoint,
			pointsShape: par.pointsShape,
			marshParams: par.marshParams,

		}
		drawStringerBotHoles(stringerHolesParams, "bot");

		//добавляем отверстия под ограждения
		var railingHolesPar = {
			shape: par.stringerShapeBot,
			holeCenters: par.railingHolesBot,
			dxfBasePoint: par.dxfBasePoint,
			}
		drawRailingHoles(railingHolesPar);
	}

	//указываем именованные точки на выгрузке в dxf для отладки
	//signKeyPoints(par.keyPoints[par.key], par.dxfBasePoint);
/*
	par.dxfBasePoint.x += par.b * par.stairAmt + 2000;
	if (par.topEndLength !== undefined) par.dxfBasePoint.x += par.topEndLength;
*/
		
	par.mesh = new THREE.Object3D();

	var stringerExtrudeOptions = {
		amount: params.stringerThickness - 0.01,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	if (marshShapes.length > 0) {
		for (var i = 0; i < marshShapes.length; i++) {
			var shape = marshShapes[i];
			//косоур на марше
			var geom = new THREE.ExtrudeGeometry(shape, stringerExtrudeOptions);
			geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
			var mesh = new THREE.Mesh(geom, params.materials.metal);
			par.mesh.add(mesh);
			par.meshes.push(mesh);
		}
	}
	else{
		//косоур на марше
		var geom = new THREE.ExtrudeGeometry(par.stringerShape, stringerExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var mesh = new THREE.Mesh(geom, params.materials.metal);
		par.mesh.add(mesh);
		par.meshes.push(mesh);
	}

	//верхний доп. кусок
	if (par.pointsShapeTop.length > 0){
		var geom = new THREE.ExtrudeGeometry(par.stringerShapeTop, stringerExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var mesh = new THREE.Mesh(geom, params.materials.metal);
		par.mesh.add(mesh);
		par.meshes.push(mesh);
	}
	//нижний доп. кусок
	if (par.pointsShapeBot.length > 0){
		var geom = new THREE.ExtrudeGeometry(par.stringerShapeBot, stringerExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var mesh = new THREE.Mesh(geom, params.materials.metal);
		par.mesh.add(mesh);
		par.meshes.push(mesh);
	}

	//формируем единый массив центров отверстий косоура для вставки уголков, рамок, колонн и т.п.
	par.carcasHoles = [];
	par.carcasHoles.push(...par.pointsHole, ...par.pointsHoleBot, ...par.pointsHoleTop);

	//формируем единый массив центров отверстий для ограждений
	stringerParams.elmIns[stringerParams.key].racks.push(...par.railingHolesBot, ...par.railingHoles, ...par.railingHolesTop)
	//удаляем из массива центров отверстий для ограждений отверстия которые не нужно учитывать в ограждениях
	var racks = [];
	for (var k = 0; k < stringerParams.elmIns[stringerParams.key].racks.length; k++) {
		if (!stringerParams.elmIns[stringerParams.key].racks[k].noRack)
			racks.push(stringerParams.elmIns[stringerParams.key].racks[k]);
	}
	stringerParams.elmIns[stringerParams.key].racks = racks;

	//рассчитываем размер косоура по X для расчета dxfBasePoint для следующего косоура
	par.lenX = par.b * par.stairAmt + par.turnParams.turnLengthTop;

	//линия между верхней и нижней точками
	if(par.keyPoints.botPoint && par.keyPoints.topPoint){
		var trashShape = new THREE.Shape();
		var layer = "comments";
		if(par.keyPoints.divideP1 && par.keyPoints.divideP2){
			addLine(trashShape, dxfPrimitivesArr, par.keyPoints.botPoint, par.keyPoints.divideP2, par.dxfBasePoint, layer);
			addLine(trashShape, dxfPrimitivesArr, par.keyPoints.divideP1, par.keyPoints.topPoint, par.dxfBasePoint, layer);
			par.partsLen.push(distance(par.keyPoints.botPoint, par.keyPoints.divideP2));
			par.partsLen.push(distance(par.keyPoints.divideP1, par.keyPoints.topPoint));
			}
		else{
			addLine(trashShape, dxfPrimitivesArr, par.keyPoints.botPoint, par.keyPoints.topPoint, par.dxfBasePoint, layer);
			par.partsLen.push(distance(par.keyPoints.botPoint, par.keyPoints.topPoint));
			}
		}
	//сохраняем данные для спецификации
	if (!par.partsLen[0]) par.partsLen[0] = 0;

	//болты крепления к стенам
	if (typeof isFixPats != "undefined" && isFixPats) { //глобальная переменная
		if (par.marshParams.wallFix.out || par.marshParams.wallFix.in) {
			var fixPar = getFixPart(par.marshId);
			for (var i = 0; i < par.carcasHoles.length; i++) {
				var hole = par.carcasHoles[i];
				if (hole.wallFix) {
					var fix = drawFixPart(fixPar).mesh;
					fix.position.x = hole.x;
					fix.position.y = hole.y;
					fix.rotation.x = Math.PI / 2;
					par.mesh.add(fix);
				}
			}
		}
	}

	var partName = "stringer";
	if (typeof specObj != 'undefined'){
		if (!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				name: name,
				area: 0,
				paintedArea: 0,
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "area", //единица измерения
				group: "Каркас",
			}
		}
		var stringerNname = (par.key === 'out' ? 'внешн. ' : 'внутр. ') + par.marshId + " марш";

		for(var i=0; i<par.partsLen.length; i++){
			var name = stringerNname + " L=" + Math.round(par.partsLen[i]);
			var area = 300 * par.partsLen[i] / 1000000;

			if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
			if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
			specObj[partName]["amt"] += 1;
			specObj[partName]["area"] += area;
			specObj[partName]["paintedArea"] += area * 2;

			par.meshes[i].specId = partName + name;
		}
	}

	// console.log(par.partsLen.length, par.meshes.length)

	// par.mesh.specId = partName + name;


	//накладки на тетивы
	if (par.hasStringerCover) {
		var stringerCoverPar = {
			points: par.pointsShape,
			dxfBasePoint: par.dxfBasePoint,
			radIn: 10, //Радиус скругления внутренних углов
			radOut: 5, //радиус скругления внешних углов
			botPoint: copyPoint(par.keyPoints.botPoint),
			topPoint: copyPoint(par.keyPoints.topPoint),
			stringerCoverThickness: 2,
			railingHoles: par.railingHoles,
			//markPoints: true,
		}
		if (par.keyPoints.botPoint1) stringerCoverPar.botPoint = copyPoint(par.keyPoints.botPoint1);
		if (par.keyPoints.botLines) stringerCoverPar.botLines = par.keyPoints.botLines;

		//объединяем массивы точек разделенных тетив, что бы была одна накладка
		if (par.pointsShapeBot.length > 0) {
			if (!(params.stairModel == "П-образная с площадкой" && par.key == "in"  && !par.lastMarsh)) {
				var pt0 = copyPoint(stringerCoverPar.botPoint);
				var arr = [];
				var x1 = +pt0.x.toFixed(3);
				var y1 = +pt0.y.toFixed(3);

				for (var j = 0; j < stringerCoverPar.points.length; j++) {
					var x2 = +stringerCoverPar.points[j].x.toFixed(3);
					var y2 = +stringerCoverPar.points[j].y.toFixed(3);
					if (x1 == x2 && y1 == y2) {
						arr.push(par.pointsShapeBot[1]);
						arr.push(par.pointsShapeBot[2]);
						if (params.model == "лт") {
							arr.push(stringerCoverPar.points[j + 1]);
						}
						j++;
					}
					else {
						arr.push(stringerCoverPar.points[j]);
					}
				}
				stringerCoverPar.points = arr;
				stringerCoverPar.botPoint = copyPoint(par.keyPoints.botPointDop);
				stringerCoverPar.railingHoles.push.apply(stringerCoverPar.railingHoles, par.railingHolesBot);
			}
		}

		//объединяем массивы точек разделенных тетив, что бы была одна накладка
		if (par.pointsShapeTop.length > 0) {
			if (!(params.stairModel == "П-образная с площадкой" && par.key == "in" && !par.lastMarsh)) {
				var pt0 = copyPoint(stringerCoverPar.topPoint);
				var arr = [];
				var x1 = +pt0.x.toFixed(3);
				var y1 = +pt0.y.toFixed(3);

				for (var j = 0; j < stringerCoverPar.points.length; j++) {
					var x2 = +stringerCoverPar.points[j].x.toFixed(3);
					var y2 = +stringerCoverPar.points[j].y.toFixed(3);
					if (x1 == x2 && y1 == y2) {
						arr.push(par.pointsShapeTop[2]);
						arr.push(par.pointsShapeTop[3]);
					}
					else {
						arr.push(stringerCoverPar.points[j]);
					}
				}
				stringerCoverPar.points = arr;
				stringerCoverPar.topPoint = copyPoint(par.keyPoints.topPointDop);
				stringerCoverPar.railingHoles.push.apply(stringerCoverPar.railingHoles, par.railingHolesTop);
			}
		}

		var stringerCover = drawStringerCover(stringerCoverPar).mesh;
		stringerCover.position.z = -stringerCoverPar.stringerCoverThickness;
		if (par.key == 'out' && turnFactor == -1) stringerCover.position.z = params.stringerThickness;
		if (par.key == 'in' && turnFactor == 1) stringerCover.position.z = params.stringerThickness;
		if (params.stairModel == "Прямая") {
			stringerCover.position.z = -stringerCoverPar.stringerCoverThickness;
			if (par.key == 'out' && turnFactor == 1) stringerCover.position.z = params.stringerThickness;
			if (par.key == 'in' && turnFactor == -1) stringerCover.position.z = params.stringerThickness;
		}

		par.mesh.add(stringerCover);

		//if (par.pointsShapeTop.length > 0) {
		//	stringerCoverPar.points = par.pointsShapeTop;
		//	stringerCoverPar.botPoint = copyPoint(par.keyPoints.botPointDop);
		//	stringerCoverPar.topPoint = copyPoint(par.keyPoints.topPointDop);
		//	stringerCoverPar.railingHoles = par.railingHolesTop;

		//	var stringerCover = drawStringerCover(stringerCoverPar).mesh;
		//	stringerCover.position.z = -stringerCoverPar.stringerCoverThickness;
		//	if (par.key == 'out' && turnFactor == -1) stringerCover.position.z = params.stringerThickness;
		//	if (par.key == 'in' && turnFactor == 1) stringerCover.position.z = params.stringerThickness;

		//	par.mesh.add(stringerCover);
		//}
	}


	return par;

} //end of drawStringer


/**
	* Функция отрисовывает накладку на тетиву
*/
function drawStringerCover(par) {
	var pointsShape = par.points;
	var pointsCoverShape = [];

	// создаем массив точек нижней части накладки между точками botPoint и topPoint
	// (для определения направления где внутреняя сторона накладки)
	var arr = [];
	var flag = true;
	for (var i = 0; i < pointsShape.length; i++) {
		if (pointsShape[i].x.toFixed(3) == par.botPoint.x.toFixed(3) && pointsShape[i].y.toFixed(3) == par.botPoint.y.toFixed(3))
			flag = false;

		if (flag) arr.push(pointsShape[i]);

		if (pointsShape[i].x.toFixed(3) == par.topPoint.x.toFixed(3) && pointsShape[i].y.toFixed(3) == par.topPoint.y.toFixed(3))
			flag = true;
	}

	// создаем массив точек накладки из массива точек тетивы сдвигом на 5мм внутрь
	var offset = 5;
	for (var i = 0; i < pointsShape.length; i++) {
		if(i == 0)
			var p1 = pointsShape[pointsShape.length - 1];
		else
			var p1 = pointsShape[i - 1];

		var p2 = pointsShape[i];

		if (i == (pointsShape.length - 1))
			var p3 = pointsShape[0];
		else
			var p3 = pointsShape[i + 1];

		var offset1 = -offset;
		var offset2 = -offset;

		// определяем направление внутренней стороны
		for (var j = 0; j < arr.length; j++) {
			if (p1.x == arr[j].x && p1.y == arr[j].y) {
				offset1 *= -1;
				break;
			}
		}
		for (var j = 0; j < arr.length; j++) {
			if (p3.x == arr[j].x && p3.y == arr[j].y) {
				offset2 *= -1;
				break;
			}
		}
		for (var j = 0; j < arr.length; j++) {
			if (p2.x == arr[j].x && p2.y == arr[j].y) {
				offset1 = offset;
				offset2 = offset;
				break;
			}
		}
		if (par.botLines) {
			for (var j = 0; j < par.botLines.length; j++) {
				var line = par.botLines[j];
				if ((p2.x == line.p1.x && p2.y == line.p1.y) || (p2.x == line.p2.x && p2.y == line.p2.y)) {
					if ((p1.x == line.p1.x && p1.y == line.p1.y) || (p1.x == line.p2.x && p1.y == line.p2.y)) {
						offset1 *= -1;
						break;
					}
					if ((p3.x == line.p1.x && p3.y == line.p1.y) || (p3.x == line.p2.x && p3.y == line.p2.y)) {
						offset2 *= -1;
						break;
					}
				}
			}
		}

		var line1 = parallel1(p2, p1, offset1);
		var line2 = parallel1(p2, p3, offset2);
		var pt = itercection(line1.p1, line1.p2, line2.p1, line2.p2);

		pointsCoverShape.push(pt);
	}

	//создаем шейп
	var shapePar = {
		points: pointsCoverShape,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		radIn: par.radIn, //Радиус скругления внутренних углов
		radOut: par.radOut, //радиус скругления внешних углов
		//markPoints: true,
	}

	var shape = drawShapeByPoints2(shapePar).shape;

	//добавляем отверстия под ограждения
	var railingHolesPar = {
		shape: shape,
		holeCenters: par.railingHoles,
		dxfBasePoint: par.dxfBasePoint,
	}
	drawRailingHoles(railingHolesPar);


	var stringerExtrudeOptions = {
		amount: par.stringerCoverThickness - 0.01,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, stringerExtrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.stringerCover);
	par.mesh = mesh;

	return par;
}


/*расчет параметров косоура*/

function calcStringerPar(par){

	/*функция добавляет во входящий объект следующие параметры косоура/тетивы:
	h
	b
	a
	stairAmt
	h_topWnd
	h_next
	h_prev
	stairAmt_prev
	marshAng

	исходные данные:
	marshId
	*/

	var marshParams = getMarshParams(par.marshId);
	var turnParams = calcTurnParams(par.marshId)

	par.marshParams = marshParams;
	par.h = marshParams.h;
	par.b = marshParams.b;
	par.a = marshParams.a;
	par.stairAmt = marshParams.stairAmt
	par.h_topWnd = marshParams.h_topWnd;
	par.h_next = getMarshParams(marshParams.nextMarshId).h;
	par.h_prev = getMarshParams(marshParams.prevMarshId).h;
	par.stairAmt_prev = getMarshParams(marshParams.prevMarshId).stairAmt;
	par.marshAng = marshParams.ang;
	par.stringerLedge = 5; //выступ тетивы над ступенью

	if(marshParams.botTurn == "пол") par.botEnd = "floor";
	if(marshParams.topTurn == "пол") par.topEnd = "floor";
	if(marshParams.botTurn == "площадка") par.botEnd = "platformG";
	if(marshParams.topTurn == "площадка") par.topEnd = "platformG";
	if(marshParams.botTurn == "забег") par.botEnd = "winder";
	if(marshParams.topTurn == "забег") par.topEnd = "winder";

	//костыли для совместимости со старыми функциями
	if(params.stairModel == "П-образная с площадкой"){
		if(marshParams.botTurn == "площадка") par.botEnd = "platformP";
		if(marshParams.topTurn == "площадка" && par.marshId == 1) par.topEnd = "platformP";
		}

	par.stringerLast = marshParams.lastMarsh;

	if (params.columnModel != "нет") {
		if (params.columnModel == "40х40") par.profWidth = 40;
		else par.profWidth = 100;
		}

	par.stairFrame = params.stairFrame;
	if(params.stairType == "рифленая сталь" || params.stairType == "лотки") par.stairFrame = "есть"

	par.stringerSideOffset = params.sideOverHang;
	if (params.model == "лт") par.stringerSideOffset = 0;

	par.treadWidth = calcTreadParams().treadWidth;
	par.treadSideOffset = calcTreadParams().treadSideOffset;

	if (par.marshId > 1 && par.stairAmt_prev == 0) par.bottomTrimm = true;
	if (params.stairModel == "П-образная с забегом" && par.marshId == 3) par.bottomTrimm = false;
	if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 3 && params.stairAmt2 == 0) par.bottomTrimm = false;

	//наличие накладки
	par.hasStringerCover = marshParams.hasStringerCover[par.key];

	//наличие ограждений
	par.hasRailing = marshParams.hasRailing[par.key];

	/*на внутренней стороне если сверху площадка ограждение есть только на марше.
	на площадке ограждение есть в том случае, если площадка верхняя, а не промежуточная*/
	par.hasPltRailing = false;
	if(!marshParams.lastMarsh && par.hasRailing) {
		if(par.key == "out") par.hasPltRailing = true;
		if(params.stairModel == "Прямая с промежуточной площадкой") par.hasPltRailing = true;
		}
	if(marshParams.lastMarsh) par.hasPltRailing = marshParams.hasTopPltRailing[par.key];
	//console.log(par.marshId, par.key, par.hasRailing, par.hasPltRailing)
	//if(marshParams.lastMarsh && params.stairModel == "Прямая с промежуточной площадкой") par.hasPltRailing = true;
	//console.log(getTopPltRailing())
	//длина поворотного участка
	//var tyrnLength = calcTurnLength(marshParams.topTurn).tyrnLength;
	par.tyrnLengthTop = turnParams.turnLengthTop;

	//нижний участок
	par.botEndLength = 0;

	if(par.marshId > 1){
		if (params.model == "лт") {
			par.botEndLength = params.M;
			if (params.calcType == 'console') {
				par.botEndLength = params.M + 10 + 5 + 8 + calcStringerMoove(par.marshId).stringerOutMoovePrev;
			}
			//площадка П-образной лестницы имеет длину platformLength_1
			if (params.stairModel == "П-образная с площадкой"){
				par.botEndLength = turnParams.turnLengthBot - params.stringerThickness;
				if (params.calcType == 'console') {
					par.botEndLength = turnParams.turnLengthBot + params.stringerThickness + 8 + calcStringerMoove(2).stringerOutMoove;
				}
			}

			}
		if (params.model == "ко") par.botEndLength = getMarshParams(marshParams.prevMarshId).b + params.nose;
	}

	//верхний участок

	if(marshParams.topTurn == "площадка"){
		if(params.model == "лт") {
			par.topEndLength = turnParams.turnLengthTop - params.stringerThickness + 5;
			if (params.stairModel == 'Прямая с промежуточной площадкой') {
				par.topEndLength = params.middlePltLength + 19 + 8;//FIX IT
			}
			if (params.calcType == 'console') {
				par.topEndLength = turnParams.turnLengthTop + params.stringerThickness + 5 + 8 + calcStringerMoove(par.marshId).stringerOutMooveNext;
			}
			if (params.stairModel == "П-образная с площадкой") {
				par.topEndLength += (params.nose - 20);
				if (params.calcType == 'console') {
					par.topEndLength = turnParams.turnLengthTop + params.stringerThickness + 5 + 8 + calcStringerMoove(2).stringerOutMoove - (turnParams.pltExtraLen - params.nose);
				}
			}

		}

		if(params.model == "ко") {
			par.topEndLength = par.b - 0.001;
			}


		//верхняя площадка
		if (marshParams.lastMarsh) {
			par.topEndLength = params.platformLength_3 + par.stringerLedge - 0.01;
			if(params.platformRearStringer == "есть") par.topEndLength -= params.stringerThickness;
			if(params.model == "ко") par.topEndLength = par.b;
			par.platformLength = params.platformLength_3;
			par.platformLength1 = params.platformLength_3;
			}

		}

	//входная лестница
	if(params.calcType == "vhod"){
		if (par.marshId == 3 && params.stairModel == "Прямая с промежуточной площадкой") {
			par.is2MarshStright = true;
		}

		if (params.stairModel == "Прямая горка") {
			par.topEndLength = par.a;
			if (par.marshId == 3) {
				par.botEnd = 'floor';
				par.topEnd = 'platformG';
			}
		}
	}

	if(marshParams.topTurn == "забег"){
		if(params.model == "лт") {

			}
		if(params.model == "ко") {
			par.topEndLength = params.M + 25 - par.stringerSideOffset;
			if (params.stringerType == 'ломаная') par.topEndLength = par.stringerSideOffset - 15 + params.stringerThickness + 60 + 5;
			if (par.key == "in") {
				par.topEndLength = par.stringerSideOffset - 15 + params.stringerThickness + 60 + 5;
				}

			}

		}

	//П-образная с забегом

	if (par.isWndP || (par.marshId == 2 && params.stairModel == "П-образная с забегом")){
		par.stairAmt = 0;
		par.h = params.h3;
		par.h_topWnd = params.h3;
		par.h_next = params.h3;
		par.h_prev = params.h1;
		par.stairAmt_prev = params.stairAmt1;
		par.botEnd = "winder";
		par.topEnd = "winder";
		}


	//непонятные параметры - надо переделать
	par.platformLength = params.M * 1.0 + 40 + 10;
	//par.platformLength1 = params.M + 30;


	// параметры рамок под площадками (используется только для лт)

	par.platformFramesParams = {
		marshId: par.marshId,
		isPltFrame: true,
		};
	calcFrameParams(par.platformFramesParams);

	par.marshFramesParams = {marshId: par.marshId};
	calcFrameParams(par.marshFramesParams);

	//зазор от торца ступени до тетивы для ЛТ
	par.treadSideGap = 5;
	if(params.stairType == "рифленая сталь" || params.stairType == "лотки") par.treadSideGap = 0;

	//позиция верхнего отверстия уголка каркаса относительно верха тетивы
	par.carcasAnglePosY = -params.treadThickness - 5 - 20; //позиция верхнего отверстия уголка каркаса относительно верха тетивы
	if (params.model == "ко") par.carcasAnglePosY = -65;
	if (params.stairType == "рифленая сталь" || params.stairType == "рифленый алюминий" || params.stairType == "лотки")
		par.carcasAnglePosY -= 65;//50;
	if (params.stairType == "дпк" || params.stairType == "пресснастил") par.carcasAnglePosY -= 65;
	//if (params.stairType == "дпк" || params.stairType == "лотки") par.carcasAnglePosY -= 65;


	//удлиннение внутренней тетивы/косоура под забегом
	par.longStringerTop = false;
	//удлиннение тетивы
	if (par.key == "in"){
		if (par.marshId == 1 && params.inStringerElongationTurn1 == "да") par.longStringerTop = true;
		if (par.marshId == 2 && params.inStringerElongationTurn2 == "да") par.longStringerTop = true;
		}
	//наличие отверстий для крепления удлиненной тетивы на внешней стороне
	if (par.key == "out"){
		if (par.marshId == 2 && params.inStringerElongationTurn1 == "да") par.longStringerTop = true;
		if (par.marshId == 3) {
			if (!(~params.stairModel.indexOf("П-образная")) && params.inStringerElongationTurn1 == "да")
				par.longStringerTop = true;
			if (~params.stairModel.indexOf("П-образная") && params.inStringerElongationTurn2 == "да")
				par.longStringerTop = true;
			}
	}

	//Разделение косоуров
	par.stringerDivision = true;
	if (par.stringerLast && params.stringerDivisionTop == "нет") par.stringerDivision = false;
	if (!par.stringerLast) {
		if (params.stringerDivision == "нет") par.stringerDivision = false;
		if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2) {
			if (params.stringerDivision2 == "есть") par.stringerDivision = true;
			if (params.stringerDivision2 == "нет") par.stringerDivision = false;
		}
		if (params.stairModel == "П-образная с площадкой") {
			par.stringerDivision = true;
			if (params.stringerDivision == "нет" && par.key == "out") par.stringerDivision = false;
		}
	}

	par.stringerDivisionBot = true;
    if (par.key == "out" && params.model == "ко") {
		if (params.stringerDivision == "нет") par.stringerDivisionBot = false;
		if (par.marshId == 3 && (params.stairModel == "П-образная трехмаршевая" || params.stairModel == "П-образная с площадкой")) {
			par.stringerDivisionBot = true;
			if (params.stringerDivision2 == "нет") par.stringerDivisionBot = false;
		}
	}
	//if (params.stairModel == "П-образная трехмаршевая" && params.stairAmt2 == 0 && par.marshId == 2)
	//	par.stringerDivisionBot = false;



	// константы


	par.profileHeight = 40;	// высота профиля в рамках
	par.pltFrameProf = 60;
	if(params.stairType == "рифленая сталь" || params.stairType == "лотки"){
		par.profileHeight = par.pltFrameProf = 50;
		}

	par.holeDistU4 = 60; //расстояние между осями отверстий уголка каркаса У-4

	// ширина тетивы/косоура
	par.stringerWidth = 150;
	if (params.stringerType == "ломаная") par.stringerWidth = 180;
	if (par.stairAmt > 10) par.stringerWidth = 200.0;
	if (params.stringerType == "прямая") par.stringerWidth = 320;


	//ширина тетивы/косоура площадки
	par.stringerWidthPlatform = calcPltStringerWidth();

	// установки размеров под уголки
	setStairAngles(par);


	//координаты отверстий для рамки
	if (hasTreadFrames()) {
		par.stepHoleX1 = par.marshFramesParams.stepHoleX1
		par.stepHoleX2 = par.marshFramesParams.stepHoleX2
		//на лестнице с подступенками делаем рамки короче, чтобы последняя не отличалась
		if (params.riserType == "есть" && params.model == "лт") {
			var frameWidthStep = 20; //точность округления ширины рамок
			var offset = Math.ceil(params.riserThickness / frameWidthStep) * frameWidthStep;
			par.stepHoleX2 -= offset;
		}
		par.holeDist = par.stepHoleX2 - par.stepHoleX1;
		if (params.stairType == "пресснастил") par.holeDist = calcPresParams(par.a).holeDist; //функция в файле drawFrames.js
	}

    par.rutelPosX = par.b / 2;
	par.rutelDist = 100;


	//отступ рамки от переднего ребра тетивы - используется для расчета точек среднего косоура
	var framePar = {marshId: par.marshId}
	par.treadFrontOverhang = calcFrameParams(framePar).overhang + par.stringerLedge;


	return par;
} //end of calcStringerPar


function angleXFull(p1, p2) {
	/*возвращает полный угол (от 0 до 360) между осью x и отрезком, соединяющим точки*/
	var angle;

	if ((p2.x == p1.x) && (p2.y > p1.y)) angle = Math.PI / 2;
	if ((p2.x == p1.x) && (p2.y < p1.y)) angle = Math.PI / 2 + Math.PI;
	if ((p2.x > p1.x) && (p2.y >= p1.y)) angle = Math.atan((p2.y - p1.y) / (p2.x - p1.x));
	if ((p2.x < p1.x) && (p2.y >= p1.y)) angle = -Math.atan((p2.y - p1.y) / (p1.x - p2.x)) + Math.PI;
	if ((p2.x < p1.x) && (p2.y < p1.y)) angle = Math.atan((p1.y - p2.y) / (p1.x - p2.x)) + Math.PI;
	if ((p2.x > p1.x) && (p2.y < p1.y)) angle = -Math.atan((p1.y - p2.y) / (p2.x - p1.x)) + Math.PI * 2;


	return angle;
}

/*функция возвращает координаты концов отрезка, параллельного отрезку,
	соединяющему точку p1 и p2*/

function parallel1(basePoint1, basePoint2, dist) {

	var ang = angleXFull(basePoint1, basePoint2);
	if (ang < Math.PI) {
		var newPoint1 = polar(basePoint1, (ang + Math.PI / 2), dist);
		var newPoint2 = polar(basePoint2, (ang + Math.PI / 2), dist);
	}
	else {
		var newPoint1 = polar(basePoint1, (ang - Math.PI / 2), dist);
		var newPoint2 = polar(basePoint2, (ang - Math.PI / 2), dist);
	}

	var line = {};
	line.p1 = newPoint1;
	line.p2 = newPoint2;
	return line;
}
