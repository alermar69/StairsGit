//выступ тетивы спереди за габарит ступени
var stringerLedge = 0;
var turnFactor = 1;

function calculateGeom() {
	if($("#turnSide").val() == "левое") turnFactor = -1;
	if(testingMode) showAlerts = false;
	var isStepChanged = true;
	var k = 0; //счетчик для защиты от зацикливания
	while(isStepChanged) {
		getAllInputsValues(params);
		isStepChanged = false;
		var a1 = $("#a1").val();
		var a2 = $("#a2").val();
		var a3 = $("#a3").val();
		stringerLedge = 0;
		if(params.model == "лт") stringerLedge = 5;
		if(params.stairModel == "Прямая") {
			var stairParams = calcStright();
			getAllInputsValues(params);
			// drawStright(stairParams);
		}
		if(params.stairModel != "Прямая") {
			var stairParams = calcGeomParams();
			if(!stairParams && !testingMode) {
				alert("ВНИМАНИЕ! ОШИБКА! \n Рассчет не был произведен")
				return;
			}
			getAllInputsValues(params);
		}
		showAlerts = false; //не показываем предупреждения на после
		if(Math.abs(a1 - $("#a1").val()) > 0.2) {
			isStepChanged = true;
			console.log("a1")
		}
		if(Math.abs(a2 - $("#a2").val()) > 0.2) {
			isStepChanged = true;
			console.log("a2")
		}
		if(Math.abs(a3 - $("#a3").val()) > 0.2) {
			isStepChanged = true;
			console.log("a3: ", a3)
		}
		k += 1;
		if(k > 20) {
			console.log("Произведено больше 20 итераций. Цикл остановлен");
			break;
		}
	}
	console.log("Выполнено " + k + " итераций");
} //end of calculateGeom
 

/** функция рассчитывает параметры прямой лестницы
*/
function calcStright() {
	var model = params.model;
	//Оставил на всякий случай, для работоспособности геометрии
	if (window.location.href.includes("/geometry/")) {
		if(params.staircaseType == "timber_stock") model = params.staircaseType;
		if(params.staircaseType == "mono") model = params.staircaseType;
	}
	/*Общие переменные*/
	var floorHoleLength_min = 2000; //Минимальная длина проема в перекрытии
	var M1 = 800; //Глубина верхней площадки
	var M1_min_a = 800; //вспомогательная переменная для расчета проекции лестницы
	var G = 0; //Расчетный габарит
	var h1 = 200; //высота первого (нижнего) подъема
	var h2 = 200; //высота последнего (верхнего) подъема
	var h1_min; //минимальная высота первого подъема
	var h1_max; //максимальная высота первого подъема
	var h2_min; //минимальная высота последнего подъема
	var h2_max; //максимальная высота последнего подъема
	var Sum_h1_h2; //Сумма первого и последнего подъемов
	var staircaseLength = 2000; //длина проекции нижнего марша на пол
	var angleType; //тип угла: расчетные или задаются
	var angle1; //задаваемый угол наклона лестницы
	var comments; //Комментарии к расчету
	var stairAmt = params.stairAmt1;
	var h1 = params.h1;
	/*Получение данных из формы*/
	var staircaseHeight = params.staircaseHeight;
	var floorHoleLength = params.floorHoleLength;
	var floorThickness = params.floorThickness;
	var G_min = params.G_min;
	var topFlan = params.topFlan;
	var topStairType = params.topStairType;
	var angleType = params.angleType;
	var platformTop = params.platformTop;
	var platformLength_3 = params.platformLength_3;
	var topAnglePosition = params.topAnglePosition;
	var b = params.b1;
	if(G_min < 2000)
		if(!testingMode) alert("Очень маленький габарит. Уверены?")
	//рассчитываем размер последней ступени
	var modelParams = {
		turnType: "stright",
		model: model,
		turnTypeName: "прямая",
	}
	modelParams = setModelDimensions(modelParams);
	var topStepDelta = modelParams.topStepDelta;
	if(angleType == "расчетные") {
		var stepAmt_min = Math.ceil(staircaseHeight / 250);
		var stepAmt_max = Math.ceil(staircaseHeight / 150);
		/*Проверка размера проема*/
		h = Math.round(staircaseHeight * 10 / stepAmt_min) / 10;
		b = 620 - 2 * h;
		G = Math.round((floorHoleLength - topStepDelta) * h / b + h - floorThickness);
		floorHoleLength_min = Math.round((G_min + floorThickness - h) * b / h + topStepDelta);
		//Если проем совсем маленький
		if(G < G_min) {
			document.getElementById('rezultat').innerHTML =
				"<h2>Результаты расчета</h2>" +
				"Необходимо расширять проем. <br/>" +
				"При текущем проеме, максимальная высота габарита G_max = " + G + "мм<br/>" +
				"Минимальный размер проема для того, чтобы габарит был больше 2000мм floorHoleLength_min = " + floorHoleLength_min + "мм<br/>";
			return;
		}
		/*Расчет параметров ступени: */
		var stepAmt = stepAmt_max + 1;
		G = 0;
		while(G < G_min) {
			stepAmt = stepAmt - 1;
			h = Math.round(staircaseHeight * 10 / stepAmt) / 10;
			b = Math.ceil(620 - 2 * h);
			G = Math.round((floorHoleLength - topStepDelta) * h / b - floorThickness);
			if(topStairType == "вровень") G -= Math.round(h)
			if(b > 300) G = 0; //повторяем цикл если проступь больше 300
		}
		if(topStairType == "ниже") stairAmt = stepAmt - 1;
		if(topStairType == "вровень") stairAmt = stepAmt;
	} //end of angleType == "расчетные"
	/*Расчет лестницы с заданным углом наклона*/
	if(angleType == "задаются") {
		stairAmt = params.stairAmt1;
		b = params.b1;
		if(topStairType == "ниже") stepAmt = stairAmt + 1;
		if(topStairType == "вровень") stepAmt = stairAmt;
		if(platformTop == "площадка") {
			stepAmt = stairAmt + 1;
		}
		h = Math.round(staircaseHeight / stepAmt * 10) / 10;
	} //end of angleType == "задаются"
	if((2 * h + b) > 640)
		if(!testingMode) alert("2h + b = " + (2 * h + b) + " > 640. Рекомендуется увеличить кол-во ступеней или уменьшить проступь.")
	if((2 * h + b) < 600)
		if(!testingMode) alert("2h + b = " + (2 * h + b) + " < 600. Рекомендуется уменьшить кол-во ступеней или увеличить проступь.")
	//рассчитываем габарит
	G = Math.round((floorHoleLength - topStepDelta) * h / b - floorThickness);
	if(topStairType == "вровень") G -= Math.round(h)
	staircaseLength = stairAmt * b + topStepDelta;
	if(model == "лт") staircaseLength = staircaseLength + 5; //учитываем вынос тетивы перед первой ступенью
	stairAngle = Math.round(Math.atan(h / b) * 180 * 10 / Math.PI) / 10;
	if(floorHoleLength > staircaseLength) G = staircaseHeight - floorThickness;
	if(platformTop == "площадка") {
		G = 3000;
		topStepWidth = platformLength_3;
		//stairAmt = stairAmt-1;
		staircaseLength = stairAmt * b + platformLength_3;
	}
	if(G < G_min)
		if(!testingMode) alert("Габарит меньше допустимого!")
	//ширина ступени
	//a = Math.round((b + params.nose) * 10) / 10;
	a = calcTreadWidth(b)
	
	//выставляем значение инпутов для сохранения
	setInputValue("stairAmt1", stairAmt);
	setInputValue("b1", b);
	setInputValue("h1", h);
	$("#a1").val(a);

	$('.stairAmt1').val(stairAmt);
	$('.b1').val(b);
	$('.h1').val(h);
	$('.a1').val(a);
	
	//выводим результаты расчета на страницу
	printGeomDescr()
	
	//возвращаемый объект
	var par = {
		topStepDelta: geomDescr.topStepDelta,
		model: params.model,
		staircaseLength: geomDescr.staircaseLength,
		G: geomDescr.G,
	}
	
	return par;
} //end of calcStright()

/** фугкция рассчитывает параметры для всех лестниц кроме прямой
*/
function calcGeomParams(noAlerts) {
	var model = params.model;
	if (window.location.href.includes("/geometry/")) {
		if(params.staircaseType == "timber_stock") model = params.staircaseType;
		if(params.staircaseType == "mono") model = params.staircaseType;
	}
	var topStairMove = 0; //смещение последней ступени верхнего марша
	var stairModel = params.stairModel;
	var staircaseHeight = params.staircaseHeight;
	var floorHoleLength = params.floorHoleLength;
	var floorHoleWidth = params.floorHoleWidth;
	var floorThickness = params.floorThickness;
	var M = params.M;
	var G_min = params.G_min;
	var a1 = params.a1 * 1.0;
	var a3 = params.a3 * 1.0;
	var a = a3;
	var h2 = params.h2 * 1.0;
	var topFlan = params.topFlan;
	var topStairType = params.topStairType;
	if(params.platformTop == "площадка") topStairType = "ниже"; //костыль чтобы совпадала общая высота
	var angleType = params.angleType;
	var topAnglePosition = params.topAnglePosition;
	//тип поворота
	var turnType = 0;
	if(stairModel == "Г-образная с забегом") turnType = 2;
	if(stairModel == "П-образная с забегом") turnType = 5;
	if(G_min < 2000)
		if(!testingMode) alert("Очень маленький габарит. Уверены?")
	var turnTypeName = "площадка";
	var turnTypeName1 = "площадка";
	if(turnType != 0) turnTypeName = "забег";
	if(stairModel == "П-образная трехмаршевая" && params.turnType_2 == "забег")
		turnTypeName = "забег";
	if(stairModel == "П-образная трехмаршевая" && params.turnType_1 == "забег")
		turnTypeName1 = "забег";
	var turnLength = M;
	if(stairModel == "П-образная с площадкой") turnLength = params.platformLength_1;
	var slimHole = "нет"; //узкий или широкий проем
	if(model == "лт" && floorHoleLength < M + 400) slimHole = "да";
	if(model == "ко" && floorHoleLength < M + 420) slimHole = "да";
	if(model == "mono" && floorHoleLength < M + 420) slimHole = "да";
	if(model == "timber_stock" && floorHoleLength < M + 420) slimHole = "да";
	//размеры повротов в зависимости от модели
	var modelDimensions = {
		turnType: "G_turn",
		model: model,
		turnTypeName: turnTypeName,
	}
	if(stairModel == "П-образная с забегом" || stairModel == "П-образная с площадкой")
		modelDimensions.turnType = "P_turn";
	modelDimensions = setModelDimensions(modelDimensions);
	var deltaBottom = modelDimensions.deltaBottom;
	var deltaTop = modelDimensions.deltaTop;
	var topStepDelta = modelDimensions.topStepDelta;
	var deltaBottom_3 = deltaBottom;
	var deltaTop_2 = deltaTop;
	//размеры нижнего поворота
	var turnDimensions = {
		turnType: "G_turn",
		model: model,
		turnTypeName: turnTypeName1,
	}
	turnDimensions = setModelDimensions(turnDimensions);
	deltaBottom_2 = turnDimensions.deltaBottom;
	deltaTop_1 = turnDimensions.deltaTop;
	console.log(angleType)
	if(angleType == "расчетные") {
		var stepAmt_min = Math.ceil(staircaseHeight / 250);
		var stepAmt_max = Math.ceil(staircaseHeight / 150);
		stepAmt = stepAmt_max + 1;
	}
	if(angleType == "задаются") {
		stepAmt = params.stairAmt1 + params.stairAmt3 + turnType + 1;
		if(stairModel == "П-образная трехмаршевая") {
			stepAmt = params.stairAmt1 + params.stairAmt2 + params.stairAmt3 + 2;
			if(params.turnType_1 == "забег") stepAmt += 2;
			if(params.turnType_2 == "забег") stepAmt += 2;
		}
		if(topStairType == "ниже") stepAmt += 1;
	}
	G = 0;
	if(typeof stairAmt == 'undefined') stairAmt = stepAmt;
	while(G < G_min) {
		if(angleType == "расчетные") stepAmt -= 1;
		if(topStairType == "вровень") stairAmt = stepAmt;
		if(topStairType == "ниже") stairAmt = stepAmt - 1;
		h = Math.round(staircaseHeight * 10 / stepAmt) / 10;
		if(angleType == "задаются") {
			h = params.h3;
			//если в нижнем марше 0 ступеней то все подъемы одинаковые
			if(stairAmt1 == 0 && stairModel != "П-образная трехмаршевая") {
				stepAmt_3 = params.stairAmt3;
				if(topStairType == "ниже") stepAmt_3 += 1;
				h = staircaseHeight / (stepAmt_3 + turnType + 1);
				/*
				if(stairModel == "П-образная трехмаршевая") {
					h = Math.round(staircaseHeight / stepAmt * 10) / 10;
				}
				*/
				if(h != params.h1 && !testingMode) alert("Если в нижнем марше 0 ступеней то высота всех ступеней должна быть одинаковой. Установлено значение подъема ступени в верхнем марше h1 = " + h + "мм")
			}
		}
		//расчет параметров верхнего марша
		var topMarshParams = {
			floorHoleLength: floorHoleLength,
			turnLength: turnLength,
			topStepDelta: topStepDelta,
			deltaBottom: deltaBottom,
			h: h,
			turnType: turnType,
			totalStairAmt: stairAmt,
			slimHole: slimHole,
			angleType: angleType,
			model: model,
			turnTypeName: turnTypeName,
		}
		topMarshParams = calcTopMarshParams(topMarshParams);
		if(!topMarshParams) return;
		stairAmt3 = topMarshParams.stairAmt3
		b = topMarshParams.b;
		//рассчитываем кол-во подъемов в верхнем марше
		if(topStairType == "вровень") stepAmt_3 = stairAmt3;
		if(topStairType == "ниже") stepAmt_3 = stairAmt3 + 1;
		//рассчитыаем габарит
		parG = {
			deltaTop: deltaTop,
			turnLength: turnLength,
			topStepDelta: topStepDelta,
			b1: b,
			h1: h,
			b3: b,
			h3: h,
			h2: h,
			stepAmt_3: stepAmt_3,
		}
		G = calcG(parG);
		//H2 = turnType * h + stepAmt_3 * h;
		//G = Math.round(h / b * (floorHoleWidth - turnLength - deltaTop) + H2 - floorThickness);
		//повторяем цикл если не выполняется формула шага
		if((2 * h + b) < 600) G = 0;
		if(angleType == "задаются") break;
	} //end of while
	//расчет параметров среднего марша
	if(stairModel == "П-образная трехмаршевая") {
		var stairAmt2 = params.stairAmt2;
		var stepAmt_2 = stairAmt2 + 1;
		h2 = params.h2;

		if(angleType == "расчетные") h2 = h;
		/*расчет проступи среднего марша*/
		var b2 = (floorHoleWidth - M * 2 - deltaBottom_2 - deltaTop_2 - params.wallDist * 2) / (stairAmt2);
		b2 = Math.round(b2 * 10) / 10;
		h2 = Math.round(h2 * 10) / 10;
		if((2 * h2 + b2) > 640)
			if(!testingMode && !noAlerts) alert("В среднем марше 2h + b = " + (2 * h2 + b2) + " > 640. Рекомендуется увеличить кол-во ступеней или уменьшить подъем.")
		if((2 * h2 + b2) < 600)
			if(!testingMode && !noAlerts) alert("В среднем марше 2h + b = " + (2 * h2 + b2) + " < 600. Рекомендуется уменьшить кол-во ступеней или увеличить подъем.")
	}
	//расчет параметров нижнего марша
	stairAmt1 = stairAmt - stairAmt3 - turnType - 1;
	if(stairModel == "П-образная трехмаршевая") {
		stairAmt1 = stairAmt - stairAmt2 - stairAmt3 - 2;
		if(params.turnType_1 == "забег") stairAmt1 -= 2;
		if(params.turnType_2 == "забег") stairAmt1 -= 2;
	}
	stepAmt_1 = stairAmt1 + 1;
	h1 = h;
	h3 = h;
	b1 = b;
	b3 = b;
	if(angleType == "задаются") {
		stairAmt1 = params.stairAmt1;
		h3 = h;
		b3 = b;
		b1 = params.b1;
		stepAmt_1 = stairAmt1 + 1;
		H2 = turnType * h3 + stepAmt_3 * h3;
		if(stairModel == "П-образная трехмаршевая") {
			H2 = (stairAmt3) * h3 + (stairAmt2 + 1) * h2;
			if(topStairType == "ниже") H2 += h3;
			if(params.turnType_1 == "забег") H2 += 2 * h2;
			if(params.turnType_2 == "забег") H2 += 2 * h3;
		}
		h1 = Math.round((staircaseHeight - H2) * 10 / stepAmt_1) / 10;
		if(stairAmt1 == 0) {
			h1 = h3;
			//если в нижнем марше 0 ступеней то подъем в 1 и 2 маршах одинаковые
			if(stairModel == "П-образная трехмаршевая") {
				var H12 = staircaseHeight - (stepAmt_3) * h3;
				if(params.turnType_2 == "забег") H12 -= 2 * h3;

				var stepAmt12 = params.stairAmt2 + 1 + 1;
				if(params.turnType_1 == "забег") stepAmt12 += 2;

				var h12 = Math.round(H12 / stepAmt12 * 10) / 10;
				h1 = h12;
				h2 = h12;

			}
		}
		if((2 * h1 + b1) > 640)
			if(!testingMode && !noAlerts) alert("В нижнем марше 2h + b = " + (2 * h1 + b1) + " > 640. Рекомендуется увеличить кол-во ступеней или уменьшить проступь.")
		if((2 * h1 + b1) < 600)
			if(!testingMode && !noAlerts) alert("В нижнем марше 2h + b = " + (2 * h1 + b1) + " < 600. Рекомендуется уменьшить кол-во ступеней или увеличить проступь.")
	}
	//габарит
	parG = {
		deltaTop: deltaTop,
		turnLength: turnLength,
		topStepDelta: topStepDelta,
		b1: b,
		h1: h,
		b3: b,
		h3: h,
		h2: h,
		stepAmt_3: stepAmt_3,
	}
	G = calcG(parG);
	//H2 = turnType * h3 + stepAmt_3 * h3;
	//G = Math.round(h1 / b1 * (floorHoleWidth - turnLength - deltaTop) + H2 - floorThickness);
	//проекция нижнего марша
	B1 = stairAmt1 * b1 + turnLength + deltaTop + 5;
	B1 = Math.round(B1 * 10) / 10;
	stairAngle_1 = Math.round(Math.atan(h1 / b1) * 180 / Math.PI);
	stairAngle_2 = Math.round(Math.atan(h2 / b2) * 180 / Math.PI);
	stairAngle_3 = Math.round(Math.atan(h3 / b3) * 180 / Math.PI);
	//ширина ступени
	/*
	a1 = Math.round((b1 + params.nose) * 10) / 10;
	a2 = Math.round((b2 + params.nose) * 10) / 10;
	a3 = Math.round((b3 + params.nose) * 10) / 10;
	*/
	a1 = calcTreadWidth(b1);
	a2 = calcTreadWidth(b2);
	a3 = calcTreadWidth(b3);

	if(G < G_min)
		if(!testingMode) alert("Габарит меньше допустимого!")
	/*Вывод результатов расчета*/
	var text = "<h3 class = 'raschet' onclick = 'recalculate()'>Результаты расчета</h3>";
/*	
	if(angleType == "расчетные") {
		text += "<b>Верхний и нижний марши:</b><br/>" +
			"Ширина проступи b = " + b1 + " мм<br/>" +
			"Высота подъема ступени h = " + h1 + " мм<br/>" +
			"Шаг 2h + b = " + (2 * h + b) + " мм<br/>" +
			"Ширина ступени = " + a1 + " мм;<br/>" +
			"Кол-во прямых ступеней в нижнем марше = " + stairAmt1 + " шт.<br/>" +
			"Кол-во прямых ступеней в верхнем марше = " + stairAmt3 + " шт.<br/>" +
			"Угол наклона маршей = " + stairAngle_1 + "гр.<br/>";
		if(stairModel == "П-образная трехмаршевая")
			text += "<b>Средний марши:</b><br/>" +
			"Ширина проступи b2 = " + b2 + " мм<br/>" +
			"Высота подъема ступени h2 = " + h2 + " мм<br/>" +
			"Шаг 2*h2 + b2 = " + (2 * h2 + b2) + "мм<br/>" +
			"Ширина ступени = " + a2 + " мм;<br/>" +
			"Кол-во прямых ступеней в среднем марше = " + stairAmt2 + " шт.<br/>" +
			"Угол наклона марша = " + stairAngle_2 + "гр.<br/>";
		text +=
			"<b>Общие характеристики:</b><br/>" +
			"Ширина маршей M = " + M + " мм;<br/>" +
			"Свес ступени = " + params.nose + "мм<br/>" +
			"Фланец крепления к верхнему перекрытию: " + topFlan + "<br/>" +
			"Кол-во подъемов всего = " + stepAmt + "шт.<br/>" +
			"Габарит G = " + G + " мм<br/>" +
			"Глубина площадки = " + turnLength + "мм<br/>";
	}
	if(angleType == "задаются") {
		text +=
			"<b>Верхний марш:</b><br/>";
		if(b3 != 0) text +=
			"Ширина проступи b3 = " + b3 + " мм<br/>" +
			"Высота подъема ступени h3 = " + h3 + " мм<br/>" +
			"Шаг 2h + b = " + (2 * h3 + b3) + "мм<br/>" +
			"Ширина ступени а3 = " + a3 + " мм;<br/>" +
			"Кол-во прямых ступеней в верхнем марше = " + stairAmt3 + "шт.<br/>" +
			"Свес на верхнем марше = " + params.nose + "мм<br/>" +
			"Угол наклона верхнего марша = " + stairAngle_3 + "гр.<br/>";
		else text +=
			"Высота подъема ступени h3 = " + h3 + " мм<br/>" +
			"Ширина ступени а3 = " + a3 + " мм;<br/>" +
			"Кол-во прямых ступеней в верхнем марше = " + stairAmt3 + "шт.<br/>";
		text +=
			"<b>Нижний марш:</b><br/>" +
			"Ширина проступи b1 = " + b1 + " мм<br/>" +
			"Высота подъема ступени h1 = " + h1 + " мм<br/>" +
			"Шаг 2h + b = " + (2 * h1 + b1) + "мм<br/>" +
			"Ширина ступени а1 = " + a1 + " мм;<br/>" +
			"Кол-во прямых ступеней в нижнем марше = " + stairAmt1 + "шт.<br/>" +
			"Угол наклона нижнего марша = " + stairAngle_1 + "гр.<br/>" +
			"Длина проекции нижнего марша B1 = " + B1 + "мм<br/>";
		if(stairModel == "П-образная трехмаршевая")
			text +=
			"<b>Средний марш:</b><br/>" +
			"Ширина проступи b2 = <span>" + b2 + " мм<br/>" +
			"Высота подъема ступени h2 = <span>" + h2 + " мм<br/>" +
			"Шаг 2h + b = " + (2 * h2 + b2) + "мм<br/>" +
			"Ширина ступени а2 = " + a2 + " мм;<br/>" +
			"Кол-во прямых ступеней в нижнем марше = " + stairAmt2 + "шт.<br/>" +
			"Угол наклона нижнего марша = " + stairAngle_2 + "гр.<br/>";
		text +=
			"<b>Общие характеристики:</b><br/>" +
			"Ширина маршей M = " + M + " мм;<br/>" +
			"Фланец крепления к верхнему перекрытию: " + topFlan + "<br/>" +
			"Кол-во подъемов всего = " + stepAmt + "шт.<br/>" +
			"Ширина последней верхней проступи = " + topMarshParams.topStepWidth + "мм<br/>" +
			"Габарит G = " + G + " мм<br/>" +
			"Глубина площадки = " + turnLength + "мм<br/>";
	}
	
	if(turnTypeName == "забег" && stairAmt3 == 0) {
		text += "Ширина последней забежной ступени = " + $("#lastWinderTreadWidth").val() + "мм<br/>";
	}
*/
	if(!a2) a2 = a1;
	if(!b2) b2 = b1;
	if(!h2) h2 = h1;
	
	$("#rezultat").html(text);
	$("#stairAmt1, .stairAmt1").val(stairAmt1);
	$("#stairAmt2, .stairAmt2").val(stairAmt2);
	$("#stairAmt3, .stairAmt3").val(stairAmt3);
	$("#a1, .a1").val(a1);
	$("#b1, .b1").val(b1);
	$("#h1, .h1").val(h1);
	$("#a2, .a2").val(a2);
	$("#b2, .b2").val(b2);
	$("#h2, .h2").val(h2);
	$("#a3, .a3").val(a3);
	$("#b3, .b3").val(b3);
	$("#h3, .h3").val(h3);
	
	//выводим результаты расчета на страницу
	printGeomDescr()
		
	//возвращаемый объект
	var par = {
		deltaBottom: deltaBottom,
		deltaTop: deltaTop,
		topStepDelta: topStepDelta,
		topStairMove: topStairMove,
		turnLength: turnLength,
		slimHole: slimHole,
		model: model,
		B1: B1,
		G: G,
		turnTypeName: turnTypeName,
	}
	return par;
}

/** функция рассчитываем параметры верхнего марша
var par = {
		floorHoleLength: floorHoleLength,
		turnLength: platformLength_1,
		topStepDelta: topStepDelta,
		deltaBottom: deltaBottom,
		h: h,
		turnType: turnType,
		totalStairAmt: stairAmt,
		slimHole: slimHole,
		turnTypeName: turnTypeName,
	}
*/
function calcTopMarshParams(par) {
	var floorHoleLength = par.floorHoleLength;
	//рассчитываем общую длинну ступеней верхнего марша
	var topStepsTotalLength = floorHoleLength - par.topStepDelta - par.turnLength - par.deltaBottom;
	if(params.platformTop == 'площадка') {
		topStepsTotalLength -= params.platformLength_3;
	}

	//учитываем зазор до стен
	if(params.wallDist) topStepsTotalLength -= params.wallDist;
	var model = par.model;
	var topAnglePosition = params.topAnglePosition;
	var totalStairAmt = par.totalStairAmt;
	//предварительный расчет для корректной работы в очень маленьких и очень больших проемах
	b = Math.ceil(620 - 2 * par.h); //предварительное значение
	//рассчитываем предварительное кол-во ступеней в верхнем марше
	stairAmt3 = Math.round(topStepsTotalLength / b);
	//если проем очень большой, то в нижнем марше нет ступеней
	if(stairAmt3 > totalStairAmt - par.turnType - 1) stairAmt3 = totalStairAmt - par.turnType - 1;
	//если проем очень маленький, то в верхнем марше 0 ступеней
	if(stairAmt3 < 0) stairAmt3 = 0;
	if(par.angleType == "задаются") stairAmt3 = params.stairAmt3;
	//рассчитываем точное значение проступи
	if(stairAmt3 > 0) {
		b = Math.round(topStepsTotalLength * 10 / stairAmt3) / 10;
	}
	if(par.angleType == "расчетные") {
		//если получилась b>300 увеличиваем кол-во ступеней в верхнем марше до тех пор, пока не станет b<300
		while(b > 300) {
			stairAmt3 = stairAmt3 + 1;
			b = Math.round(topStepsTotalLength * 10 / stairAmt3) / 10;
		}
	}
	//расчет для узкого проема
	var topStairMove = 0;
	if(par.slimHole == "да") {
		var deltaM_1 = 120;
		var deltaM_2 = 200;
		var deltaM_3 = 400;
		if(model == "timber_stock") {
			deltaM_1 = 0;
			deltaM_2 = 100;
			deltaM_3 = 300;
		}
		if(floorHoleLength < params.M + deltaM_1) {
			if(!testingMode) alert("Невозможно спроектировать лестницу с введенной шириной марша М в таком узком проеме. Рекомендуется уменьшить ширину марша.")
			return;
		}

		//0 ступеней в верхнем марше
		if(floorHoleLength >= params.M + deltaM_1 && floorHoleLength <= params.M + deltaM_2) {
			if(params.stairAmt3 != 0 && par.angleType == "задаются" && !testingMode) alert("При введенных параметрах floorHoleLength и M в верхнем марше невозможно установить ни одной ступени. Расчет будет произведен с нулевым количеством ступеней в верхнем марше.")
			stairAmt3 = 0;
			topStairMove = 0;
			if(par.turnTypeName = "забег") {
				var geomPar = setModelDimensions();
				var lastWinderTreadWidth = floorHoleLength - params.M - geomPar.lastWndTreadOffset - geomPar.topUnitThk;
				if(params.wallDist) lastWinderTreadWidth -= params.wallDist;

				$("#lastWinderTreadWidth").val(lastWinderTreadWidth);
				params.lastWinderTreadWidth = lastWinderTreadWidth;
			}
		}

		//1 ступень в верхнем марше
		if(floorHoleLength > params.M + deltaM_2 && floorHoleLength <= params.M + deltaM_3) {
			if(stairAmt3 != 1 && par.angleType == "задаются" && !testingMode) alert("При введенных параметрах floorHoleLength и M в верхнем марше можно установить только одну ступень. Расчет будет произведен с одной ступенью в верхнем марше.")
			stairAmt3 = 1;
			var topStepWidth = floorHoleLength - params.M - par.deltaBottom - par.topStepDelta;
			//if(topStepWidth > 300) topStepWidth = 300;
			topStairMove = floorHoleLength - params.M - par.deltaBottom - topStepWidth;
			b = topStepWidth;
			if(params.wallDist) b -= params.wallDist;
		}
	}

	par.stairAmt3 = stairAmt3;
	par.b = b;
	par.topStairMove = topStairMove;
	return par;
}

/** функция задает параметры для позиционирования маршей относительно друг друга на поворотах.
Эти параметры зависят от модели и типа поворота. Используются для расчета геометрии, построения
2D и 3D моделей
par = {
	turnType: "G_turn",
	model: model,
	turnTypeName: turnTypeName,
	marshId
	}
*/
function setModelDimensions(par) {

	if(!par) par = {};
	var deltaBottom = 0;
	var deltaTop = 0;
	var topStepDelta = 0;
	
	if(par.model == "сварной" || par.model == "труба") par.model = "mono";
	
	if(par.turnType == "G_turn") {
		/*обозначение параметров здесь
		6692035.ru/drawings/turnSize/lt/turnSize_G.pdf
		6692035.ru/drawings/turnSize/ko/turnSize_G.pdf
		6692035.ru/drawings/turnSize/mk/turnSize_.pdf
		*/
		//поправка для первой ступени марша после поворота
		//учитывается при расчете проступи верхнего марша
		if(par.model == "лт" && par.turnTypeName == "площадка") deltaBottom = -35;
		if(par.model == "лт" && par.turnTypeName == "забег") deltaBottom = 5;
		if(par.model == "ко" && par.turnTypeName == "площадка") deltaBottom = -params.nose;
		if(par.model == "ко" && par.turnTypeName == "забег") deltaBottom = 72 - params.nose;
		if(par.model == "mono" && par.turnTypeName == "площадка") deltaBottom = -params.nose;
		if(par.model == "mono" && par.turnTypeName == "забег") deltaBottom = -5;
		if(par.model == "timber") {
			if(params.model == "тетивы" && par.turnTypeName == "площадка") deltaBottom = -50;
			if(params.model == "тетивы" && par.turnTypeName == "забег") deltaBottom = -25; //было -30
			if(params.model == "косоуры" && par.turnTypeName == "площадка") deltaBottom = -50;
			if(params.model == "косоуры" && par.turnTypeName == "забег") deltaBottom = -50;
			if(params.model == "тетива+косоур" && par.turnTypeName == "площадка") deltaBottom = -50;
			if(params.model == "тетива+косоур" && par.turnTypeName == "забег") deltaBottom = -50;
		}
		if(par.model == "timber_stock") {
			if(par.turnTypeName == "площадка") deltaBottom = -params.nose;
			if(par.turnTypeName == "забег") deltaBottom = -params.nose; //было -30
		}
		if(par.model == "bolz") {
			if(par.turnTypeName == "площадка") deltaBottom = -params.nose - 13; //13 - подогнано
			if(par.turnTypeName == "забег") deltaBottom = -params.nose - 13; //было -30
		}

		//поправка для первой ступени марша перед поворотом
		//Учитывается при расчете длины проекции нижнего марша
		if(par.model == "лт" && par.turnTypeName == "площадка") deltaTop = 30;
		if(par.model == "лт" && par.turnTypeName == "забег") deltaTop = 31;
		if(par.model == "ко" && par.turnTypeName == "площадка") deltaTop = 25;
		if(par.model == "ко" && par.turnTypeName == "забег") deltaTop = 25;
		if(par.model == "mono" && par.turnTypeName == "площадка") deltaTop = 45;
		if(par.model == "mono" && par.turnTypeName == "забег") deltaTop = 45;
		if(par.model == "timber") {
			if(params.model == "тетивы" && par.turnTypeName == "площадка") deltaTop = -10;
			if(params.model == "тетивы" && par.turnTypeName == "забег") deltaTop = 10; //было -10
			if(params.model == "косоуры" && par.turnTypeName == "площадка") deltaTop = -10;
			if(params.model == "косоуры" && par.turnTypeName == "забег") deltaTop = -10;
			if(params.model == "тетива+косоур" && par.turnTypeName == "площадка") deltaTop = -10;
			if(params.model == "тетива+косоур" && par.turnTypeName == "забег") deltaTop = -10;
		}
		if(par.model == "timber_stock") {
			if(par.turnTypeName == "площадка") deltaTop = params.nose;
			if(par.turnTypeName == "забег") {
				deltaTop = params.nose; //было -30
				if(params.riserType == "есть") deltaTop += params.riserThickness;
			}
		}
		if(par.model == "bolz") {
			if(par.turnTypeName == "площадка") deltaTop = -13; //подогнано
			if(par.turnTypeName == "забег") {
				deltaTop = -13; //было -30
				if(params.riserType == "есть") deltaTop += params.riserThickness;
			}
		}
		
	}

	if(par.turnType == "P_turn") {
		/*обозначение параметров здесь
		6692035.ru/drawings/turnSize/lt/turnSize_P.pdf
		6692035.ru/drawings/turnSize/ko/turnSize_P.pdf
		6692035.ru/drawings/turnSize/mk/turnSize_P.pdf
		*/
		//поправка при стыковке верхнего марша с площадкой (снизу)
		//учитывается при расчете проступи верхнего марша
		if(par.model == "лт" && par.turnTypeName == "площадка") deltaBottom = 0;
		if(par.model == "лт" && par.turnTypeName == "забег") deltaBottom = 5;
		if(par.model == "ко" && par.turnTypeName == "площадка") deltaBottom = 0;
		if(par.model == "ко" && par.turnTypeName == "забег") deltaBottom = 72 - params.nose;
		if(par.model == "mono" && par.turnTypeName == "площадка") deltaBottom = 0;
		if(par.model == "mono" && par.turnTypeName == "забег") deltaBottom = -5;
		if(par.model == "timber") {
			if(params.model == "тетивы" && par.turnTypeName == "площадка") deltaBottom = -20;
			if(params.model == "тетивы" && par.turnTypeName == "забег") deltaBottom = -25;
			if(params.model == "косоуры" && par.turnTypeName == "площадка") deltaBottom = -20;
			if(params.model == "косоуры" && par.turnTypeName == "забег") deltaBottom = -50;
			if(params.model == "тетива+косоур" && par.turnTypeName == "площадка") deltaBottom = -20;
			if(params.model == "тетива+косоур" && par.turnTypeName == "забег") deltaBottom = -50;
		}
		if(par.model == "timber_stock") {
			if(par.turnTypeName == "площадка") deltaBottom = -params.nose;
			if(par.turnTypeName == "забег") deltaBottom = -params.nose; //было -30
		}
		if (par.model == "bolz") {
			if (par.turnTypeName == "площадка") deltaBottom = -params.nose - 13; //13 - подогнано
			if (par.turnTypeName == "забег") deltaBottom = -params.nose - 13
		}

		//поправка при стыковке нижнего марша с площадкой(сверху)
		//Учитывается при расчете длины проекции нижнего марша
		if(par.model == "лт" && par.turnTypeName == "площадка") deltaTop = 20;
		if(par.model == "лт" && par.turnTypeName == "забег") deltaTop = 31;
		if(par.model == "ко" && par.turnTypeName == "площадка") deltaTop = params.nose; //15
		if(par.model == "ко" && par.turnTypeName == "забег") deltaTop = 25;
		if(par.model == "mono" && par.turnTypeName == "площадка") deltaTop = 50; //45
		if(par.model == "mono" && par.turnTypeName == "забег") deltaTop = 45;
		if(par.model == "timber") {
			if(params.model == "тетивы" && par.turnTypeName == "площадка") deltaTop = 0;
			if(params.model == "тетивы" && par.turnTypeName == "забег") deltaTop = 10;
			if(params.model == "косоуры" && par.turnTypeName == "площадка") deltaTop = 0;
			if(params.model == "косоуры" && par.turnTypeName == "забег") deltaTop = -10;
			if(params.model == "тетива+косоур" && par.turnTypeName == "площадка") deltaTop = 0;
			if(params.model == "тетива+косоур" && par.turnTypeName == "забег") deltaTop = -10;
		}
		if(par.model == "timber_stock") {
			if(par.turnTypeName == "площадка") deltaTop = params.nose;
			if(par.turnTypeName == "забег") deltaTop = params.nose; //было -30
		}
		if (par.model == "bolz") {
			if (par.turnTypeName == "площадка") deltaTop = -13; //подогнано
			if (par.turnTypeName == "забег") {
				deltaTop = -13; //было -30
				if (params.riserType == "есть") deltaTop += params.riserThickness;
			}
		}
	}
	// if(par.model == "ко" && params.riserType == "есть") deltaBottom -= params.riserThickness;

	//добавка к последней проступи
	topStepDelta = params.nose;
	if(params.topFlan == "есть") topStepDelta += 8;
	if(params.topAnglePosition == "вертикальная рамка") {
		if(par.model == "лт") topStepDelta = 80;
		if(par.model == "ко") topStepDelta = 40 + params.riserThickness + params.nose;
	};

	//для террасной доски добавка считается исходя из фактического размера ступени
	if(params.calcType == "vhod" ||
		params.stairType == "дпк" || 
		params.stairType == "лиственница тер." || 
		params.stairType == "рифленая сталь" || 
		params.stairType == "лотки" || 		
		params.stairType == "пресснастил") {
		topStepDelta = params.a3 - params.b3;
		if(params.stairModel == "Прямая") topStepDelta = params.a1 - params.b1;
		if(params.topFlan == "есть") topStepDelta += 8;
	}

	if(par.model == "mono") {
		topStepDelta = params.nose;
		if(params.topAnglePosition == "над ступенью") topStepDelta += 8;
	}

	if(par.model == "timber") topStepDelta = 60;
	if(par.model == "timber_stock") topStepDelta = 60;

	if(params.platformTop == 'площадка') topStepDelta = 0;

	//размеры для последней забежной ступени при 0 ступеней после забега

	//смещение переднего внутреннего угла третьей забежной ступени относительно внутреннго края нижнего марша
	var lastWndTreadOffset = 0;
	if(params.model == "лт") lastWndTreadOffset = 5; //http://skrinshoter.ru/s/251018/E5kHSzNF
	if(params.model == "ко") lastWndTreadOffset = 17; //http://skrinshoter.ru/s/251018/Bo793jPm
	var calc_type = params.calcType;
	//Для работоспособности модуля геометрии
	if (window.location.href.includes("/geometry/")) calc_type = params.staircaseType
	if(calc_type == "mono") lastWndTreadOffset = -5; //http://skrinshoter.ru/s/251018/gjutyr1K

	//расстояние от торца забежной ступени до перекрытия (толщина узла крепления к перекрытию)
	var topUnitThk = 0;
	if(params.topFlan == "есть") topUnitThk = 8;
	if(params.topAnglePosition == "вертикальная рамка") topUnitThk = 40 + params.riserThickness;
	if(calc_type == "mono") {
		topUnitThk = 0;
		if(params.topAnglePosition == "над ступенью") topUnitThk = 8;
	}

	if(calc_type == "timber" || calc_type == "timber_stock"){
		topUnitThk = 40;
	}

	//формируем возвращаемый объект
	par.deltaBottom = deltaBottom;
	par.deltaTop = deltaTop;
	par.topStepDelta = topStepDelta;
	par.lastWndTreadOffset = lastWndTreadOffset;
	par.topUnitThk = topUnitThk;

	return par;
} //end of setModelDimensions

/** функция рассчитывает габарит
	par	= {
		deltaTop: deltaTop,
		turnLength: turnLength,
		topStepDelta: topStepDelta,
		b1: b1,
		h1: h1,
		b3: b3,
		h3: h3,
		h2: h2,
		stepAmt_3: stepAmt_3,
	}

*/
function calcG(par) {
	var G = 0;
	var marsh1TopHeight = 0; //расстояние от верха нижнего марша до верхнего чистого пола
	var deltaTop = par.deltaTop;
	var turnLength = par.turnLength;
	var floorHoleLimitSize = params.floorHoleLength;
	if(params.stairModel == "Прямая") {
		if(params.topStairType == "вровень") {
			marsh1TopHeight = 0;
			turnLength = par.b1;
			deltaTop = par.topStepDelta;
		}
		if(params.topStairType == "ниже") {
			marsh1TopHeight = par.h1;
			turnLength = 0;
			deltaTop = par.topStepDelta;
		}
	}
	if(params.stairModel == "Г-образная с площадкой") {
		marsh1TopHeight = par.stepAmt_3 * par.h3;
		floorHoleLimitSize = params.floorHoleWidth;
	}
	if(params.stairModel == "Г-образная с забегом") {
		marsh1TopHeight = (par.stepAmt_3 + 2) * par.h3;
		floorHoleLimitSize = params.floorHoleWidth;
	}
	if(params.stairModel == "П-образная с площадкой") {
		marsh1TopHeight = par.stepAmt_3 * par.h3;
		// if (params.floorHoleWidth < (params.M * 2 + params.marshDist)) {
		// 	return par.h1 * params.stairAmt1;
		// }
	}
	if(params.stairModel == "П-образная с забегом") {
		marsh1TopHeight = (par.stepAmt_3 + 5) * par.h3;
	}
	if(params.stairModel == "П-образная трехмаршевая") {
		var turnRiseAmt1 = 0;
		var turnRiseAmt2 = 0;
		if(params.turnType_1 == "забег") turnRiseAmt1 = 2;
		if(params.turnType_2 == "забег") turnRiseAmt2 = 2;
		marsh1TopHeight = (turnRiseAmt2 + par.stepAmt_3) * par.h3 + (params.stairAmt2 + 1 + turnRiseAmt1) * par.h2;
	}
	G = Math.round(par.h1 / par.b1 * (floorHoleLimitSize - turnLength - deltaTop) + marsh1TopHeight - params.floorThickness);
	return G;
}

/** функция рассчтиывает ширину ступени по проступи
 */
function calcTreadWidth(step) {

	var treadWidth = Math.round((step + params.nose) * 10) / 10;
	if(params.stairType == "рифленая сталь" || params.stairType == "лотки"){
		//округляем ширину ступени с заданной точностью
		var frameWidthStep = 20; //точность округления ширины рамок
		var frameThk = 4; //толщина вертикальных ребер
		treadWidth = Math.round(treadWidth / frameWidthStep) * frameWidthStep + frameThk * 2;
	}

	if(params.stairType == "дпк" ||
		params.stairType == "лиственница тер." ||
		(params.calcType == "vhod" && params.staircaseType == "Готовая") ){
		var deckAmt = Math.ceil((step - 10) / (params.dpcWidth + params.dpcDst));
		treadWidth = (params.dpcWidth + params.dpcDst) * deckAmt - params.dpcDst;
	}

	return treadWidth;
}

function getGeomDescr(){
	
	var par = {
		text: [],
	}
	
	var ignor_calcTypes = ['vint', 'vhod', 'railing']
	if(ignor_calcTypes.indexOf(params.calcType) != -1) return par;
	
	
	
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
		
		if(params.platformTop == "площадка") {
			par.G = 3000;
			par.staircaseLength = marshParams.stairAmt * marshParams.b + params.platformLength_3;
		}
		
		if(par.G > params.staircaseHeight - params.floorThickness) par.G = params.staircaseHeight - params.floorThickness;
		
		par.text[1] = marshParams.text;
		par.text[0] = 
			"<h4>Общие параметры</h4>" +
			"Ширина марша М =  " + params.M + " мм;<br/>\
			Свес = " + params.nose + "мм<br/>";
		if(params.platformTop != "площадка"){
			par.text[0] += "Габарит par.G = " + par.G + "мм<br/>";
		}
		par.text[0] +=
			"Длина проекции лестницы на пол staircaseLength = " + par.staircaseLength + "мм<br/>";
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
		var turnLength = params.M;
		if(stairModel == "П-образная с площадкой") turnLength = params.platformLength_1;
		var stepAmt_3 = params.stairAmt3;
		if(params.topStairType == "ниже") stepAmt_3 += 1;
				
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
			stepAmt_3: stepAmt_3,
		}
		G = calcG(parG);

		var stepAmt = params.stairAmt1 + params.stairAmt3 + 1;		
		if(params.stairModel == "Г-образная с забегом") stepAmt += 2;
		if(params.stairModel == "П-образная с забегом") stepAmt += 5;
		if(params.stairModel == "П-образная трехмаршевая"){
			 stepAmt += params.stairAmt2 + 2;
			 if(params.turnType_1 == "забег")  stepAmt += 2;
			 if(params.turnType_2 == "забег")  stepAmt += 2;
		}
	
		//верхний и нижний марши имеют одинаковые параметры
		if(params.b1 == params.b3 && params.h1 == params.h3){
			par.text[1] = getMarshParams(1).text;
				
		}
		else {
			par.text[1] = getMarshParams(1).text;
			par.text[3] = getMarshParams(3).text;
		}
		
		if(params.stairModel == "П-образная трехмаршевая"){
				par.text[2] = getMarshParams(2).text;
			}
			
			
			par.text[0] = "Кол-во прямых ступеней в нижнем марше = " + params.stairAmt1 + " шт.<br/>";
			if(params.stairModel == "П-образная трехмаршевая"){
				par.text[0] = 
					"Кол-во прямых ступеней в среднем марше = " + params.stairAmt2 + " шт.<br/>";
			}
			par.text[0] +=
				"Кол-во прямых ступеней в верхнем марше = " + params.stairAmt3 + " шт.<br/>" +
				"Ширина маршей M = " + params.M + " мм;<br/>" +
				"Свес ступени = " + params.nose + "мм<br/>" +
				"Кол-во подъемов всего = " + stepAmt + "шт.<br/>" +
				"Зазор от лестницы до стен = " + params.wallDist + "мм<br/>" +
				"Габарит G = " + G + " мм<br/>";
			if(params.stairModel == "П-образная с площадкой"){
				par.text[0] +=
					"Глубина площадки = " + params.platformLength_1 + " мм;<br/>";
			}
			if(params.stairModel == "П-образная с площадкой"){
				par.text[0] +=
					"Глубина площадки = " + params.platformLength_1 + " мм;<br/>";
			}
			
	}
	
	if(params.platformTop == "площадка") {
		par.text[0] +=
		"Глубина верхней площадки = " + params.platformLength_3 + "мм<br/>";
	}
	
	return par;
}

function printGeomDescr(){
	
	if(params.calcType == "vint") {
		printVintParams();
		return;
	}
	
	
	getAllInputsValues(params);
	var geomDescr = getGeomDescr();
	var text = 		
		'<div id="svgDrawings">\
			<div id="svgOutputDiv">\
				<div class="marsh1">\
					<h4 id="marshParDrawHeader_1">Нижний марш</h4>\
					<div class="row">\
						<div id="marshParDrawWrap_1" class="svg-wrap col-12 col-md-4"></div>\
						<div class="col-12 col-md-8">' + geomDescr.text[1] + '</div>\
					</div>\
				</div>\
				<div class="marsh2">\
					<h4>Средний марш</h4>\
					<div class="row">\
						<div id="marshParDrawWrap_2" class="svg-wrap col-12 col-md-4"></div>\
						<div class="col-12 col-md-8">' + geomDescr.text[2] + '</div>\
					</div>\
				</div>\
				<div class="marsh3">\
					<h4>Верхний марш</h4>\
					<div class="row">\
						<div id="marshParDrawWrap_3" class="svg-wrap col-12 col-md-4"></div>\
						<div class="col-12 col-md-8">' + geomDescr.text[3] + '</div>\
					</div>\
				</div>\
			</div>\
		</div>' + 
		geomDescr.text[0];


		
		
	
	$("#geomDescr").html(text);
	makeGeomSvg();

	//конфигурируем внешний вид картинок
	if(params.stairModel == "Прямая"){
		$("#marshParDrawHeader_1").text("Параметры марша");
		$("#marshParDrawWrap_3").closest('div.marsh3').hide();
		$("#marshParDrawWrap_2").closest('div.marsh2').hide();
	}
	if(params.stairModel != "Прямая"){
		if(params.b1 == params.b3 && params.h1 == params.h3){
			$("#marshParDrawHeader_1").text("Верхний и нижний марши");
			$("#marshParDrawWrap_3").closest('div.marsh3').hide();
		}
		else{
			$("#marshParDrawHeader_1").text("Нижний марш")
			$("#marshParDrawWrap_3").closest('div.marsh3').show();
		}
		if(params.stairModel == "П-образная трехмаршевая"){
			$("#marshParDrawWrap_2").closest('div.marsh2').show();
		}
		else{
			$("#marshParDrawWrap_2").closest('div.marsh2').hide();
		}
	}
}

/** функция выводит параметры винтовой лестницы */

function printVintParams() {
	var radianFactor = 180 / Math.PI;

	var text =
		"Кол-во ступеней = " + stairParams.stairAmt + " шт + площадка<br/>" +
		"Подъем ступени = " + stairParams.stepHeight + " мм<br/>" +
		"Угол проступи treadAngle = " + Math.round(stairParams.treadAngle * radianFactor * 10) / 10 + "&deg;<br/>" +
		"Угол шага ступени stepAngle = " + Math.round(params.stepAngle * 10) / 10 + "&deg;<br/>" +
		"Угол ребер ступени edgeAngle = " + Math.round(stairParams.treadEdgeAngle * radianFactor * 10) / 10 + "&deg;<br/>" +
		"Угол поворота лестницы  stairCaseAngle = " + Math.round(stairParams.stairCaseAngle * radianFactor * 10) / 10 + "&deg;<br/>" +
		"Угол площадки platformAngle = " + Math.round(stairParams.platformAngle * 10) / 10 + "&deg;<br/>" +
		"Угол ребер площадки edgeAngle = " + Math.round(stairParams.platformEdgeAngle * radianFactor * 10) / 10 + "&deg;<br/>" +
		"Глубина площадки platformDepth = " + Math.round(stairParams.platformDepth * 10) / 10 + " мм<br/>" +
		"Ширина площадки на выходе platformWidth = " + Math.round(stairParams.platformWidth * 10) / 10 + " мм<br/>" +
		"Габарит = " + stairParams.G + " мм";

	$("#geomDescr").html(text);



} //end of printGeomParams()