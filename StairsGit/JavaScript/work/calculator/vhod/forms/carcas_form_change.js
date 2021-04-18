function changeFormCarcas(){

	if(params.stairType != "пресснастил"){
		$("#a1").val(calcTreadWidth(params.b1));
		$("#a2").val(calcTreadWidth(params.b2));
		$("#a3").val(calcTreadWidth(params.b3));
		getAllInputsValues(params);
	}

	getAllInputsValues(params);
	
	//глубина площадки кратна кол-ву досок
	$("#platformLength_3").attr("step", "50");
	if(params.stairType == "дпк" && params.staircaseType != "Готовая"){
		$("#platformLength_3").attr("step", (params.dpcWidth + params.dpcDst));
		
		// добавляем зазор 5мм и при наличии задней тетивы - толщину тетивы
		var deltaLen = 5;
		if(params.platformRearStringer == "есть") deltaLen += params.stringerThickness;
		
		var pltLen = calcTreadWidth(params.platformLength_3 - deltaLen); //функция в файле calcGeomParams2.js

		if(params.platformLength_3 != pltLen + deltaLen){
			var message = "Установите глубину верхней площадки так, чтобы она была кратна ширине доски дпк. \n " + 
			"Варианты, наиболее близкие к введенному значению: \n" + 
			(pltLen + deltaLen) + "\n" + 
			(pltLen + deltaLen + params.dpcWidth + params.dpcDst) + "\n" + 
			(pltLen + deltaLen - params.dpcWidth - params.dpcDst);
			if(!testingMode) alertTrouble(message);
		}
	}


//для горки задаем параметры второго марша такие же как у первого
if(params.stairModel == "Прямая горка"){
	params.b3 = params.b1;
	params.h3 = params.h1;
	params.stairAmt3 = params.stairAmt1;
	$("#b3").val(params.b3)
	$("#h3").val(params.h3)
	$("#stairAmt3").val(params.stairAmt3)
}


//увеличенная верхняя площадка
if(params.calcType != "veranda" && params.platformTop == "увеличенная" && params.platformWidth_3 - params.M < 150){
	var message = "ВНИМАНИЕ!\n" + 
		"Невозможно сделать увеличенную площадку, по ширине превосходящую марш менее чем на 150мм.\n" + 
		"Увеличте ширину площадки, уменьшите ширину марша или используйте боковой добор.\n" + 
		'Значение параметра Верхняя площадка было изменено на "стандартная"';
	if(!testingMode) alertTrouble(message);
	$("#platformTop").val("площадка");
	$("#platformWidth_3").val(params.M + 150);
	getAllInputsValues(params);
}

//скрываем выбор модели
$("#model_tr").hide();

$("#nose").closest("tr").show();

if(params.staircaseType == "Готовая"){
	$(".custom").hide();
	$(".stock").show();
	$("#stairModel").val("Прямая");
	$("#riserType").val("нет");
	$("#nose").closest("tr").hide();
	if(params.platformTop == "увеличенная") $("#platformTop").val("нет");
	$("#platformLength_3").val(params.topPltLength_stock);
	//расчет ширины марша по кол-ву рамок
	var M_nominal = params.frameAmt_600 * 600 + params.frameAmt_800 * 800 + params.frameAmt_1000 * 1000;
	var stringerAmt = params.frameAmt_600 + params.frameAmt_800 + params.frameAmt_1000 + 1;
	var M = M_nominal + stringerAmt * 8;
	$("#M").val(M);
	
	$("#stringerType").val("пилообразная");
	
	//Ограничение по кол-ву ступеней
	if(params.platformTop != "площадка"){
		if (params.stairAmt1 < 2) $("#stairAmt1").val(2);
		if (params.stairAmt1 > 6) $("#stairAmt1").val(6);		
		}
	if(params.platformTop == "площадка"){
		if (params.stairAmt1 < 1) $("#stairAmt1").val(1);
		if (params.stairAmt1 > 5) $("#stairAmt1").val(5);		
		}
		
	$("#a1").val("305");
	$("#b1").val("260");
	$("#h1").val("180");
	$("#marsh_2_tr").hide();
	$("#marsh_3_tr").hide();
	$("#botFloorType").val("чистовой");
	$("#topAnglePosition").val("под ступенью");
	$("#bottomAngleType").val("регулируемая опора");
	$("#metalPaint").val("порошок");
	$("#metalPaint_perila").val("как на лестнице");
	$("#metalColorNumber").val("коричневый");
	$("#railingMetalColorNumber").val("коричневый");
	$("#metalColorNumber_bal").val("коричневый");
	
	$("#timberPaint").val("нет");
	$("#boltHead").val("countersunk");
	$("#paintedBolts").val("нет");
	
	$(".metalColor").show();
	
	getAllInputsValues(params);
	}

if(params.staircaseType == "На заказ"){
	
	setStairOption(); //функция в файле /calculator/metal/forms/carcas_form_change.js
	
	$(".custom").show();
	$(".stock").hide();
	
	if(params.stairModel == "Г-образная с площадкой" &&
		params.middlePltWidth - params.M < 150 && 
		params.middlePltWidth - params.M != 0){
		if(!testingMode) alertTrouble("Промежуточная площадка должна быть либо по ширине марша либо шире марша не менее чем на 150мм!")
		$("#params.middlePltWidth").val(params.M);
		}
	}

$("#topFlan").closest("tr").hide();
$('#topFlanHolesPosition').closest("tr").hide();
if(params.platformTop == "нет") {
	$("#topFlan").closest("tr").show();
	if(params.topFlan == "есть") $('#topFlanHolesPosition').closest("tr").show();
	}

$("#riserThickness").closest("tr").hide();
if(params.riserType == "есть") $("#riserThickness").closest("tr").show();

//задняя тетива площадки
var needRearStringer = false;
if(params.topPltRailing_5) needRearStringer = true;
if(params.topPltColumns == "колонны" && 
	params.columnModel != "нет" &&
	(params.isColumnTop1 || params.isColumnTop3)) needRearStringer = true;

if(needRearStringer) {
	params.platformRearStringer = "есть";
	$("#platformRearStringer").val("есть");
	}

	
//параметры дпк
$("#dpcWidth").closest("tr").hide();
$("#dpcDst").closest("tr").hide();

if(params.stairType == "дпк" || params.stairType == "лиственница тер."){
	$("#dpcWidth").closest("tr").show();
	$("#dpcDst").closest("tr").show();
	
	}

/*вывод кол-ва маршей в зависимости от модели*/
var stairModel = params.stairModel;
//средний марш
$(".marsh2").hide();

//верхний марш
$(".marsh3").hide();
if (stairModel != "Прямая") $(".marsh3").show();

//параметры промежуточной площадки
$("#middlePltWidth").closest("tr").hide();
$("#middlePltLength").closest("tr").hide();
$("#middlePltColumns").closest("tr").hide();

if (params.stairModel != "Прямая") {
	$("#middlePltLength").closest("tr").show();
	$("#middlePltWidth").closest("tr").show();
	$("#middlePltColumns").closest("tr").show();
	
	}

//параметры верхней площадки

$("#platformTop").closest("tr").show();
if(params.stairModel == "Прямая горка") {
	$("#platformTop").val("нет");
	$("#platformTop").closest("tr").hide();	
	$("#middlePltWidth").closest("tr").hide();	
	}

$("#platformTop_tr_1").hide();
$("#topPltLength_stock").closest("tr").hide();	
$("#platformTop_tr_2").hide();
$("#platformTop_tr_3").hide();
$("#pltExtenderSide").closest("tr").hide();
$("#topPltColumns").closest("tr").hide();
$("#topAnglePosition").closest("tr").hide();


$("#topStepColumns").closest("tr").hide();
if(params.platformTop == "нет") $("#topStepColumns").closest("tr").show();



if(params.platformTop == "площадка") {
	$("#platformTop_tr_1").show();
	//скрываем основную ширину верхней площадки для готовых лестниц
	if(params.staircaseType == "Готовая") {
		$("#platformTop_tr_1").hide();
		$("#topPltLength_stock").closest("tr").show();	
		}
	
	$("#platformTop_tr_3").show();
	$("#pltExtenderSide").closest("tr").show();
	$("#topPltColumns").closest("tr").show();
	$("#topPltColumnsPos_img img").attr("src", "/images/calculator/vhod/columnPos/topPlt/001.jpg")
	$("#isColumnTop5").closest("label").hide();
	$("#isColumnTop6").closest("label").hide();
	}

if(params.platformTop == "увеличенная") {
	$("#platformTop_tr_1").show();
	$("#platformTop_tr_2").show();
	$("#platformTop_tr_3").show();
	$("#topPltColumns").closest("tr").show();
	$("#topPltColumnsPos_img img").attr("src", "/images/calculator/vhod/columnPos/topPlt/002.jpg")
	if(params.turnSide == "левое") 
		$("#topPltColumnsPos_img img").attr("src", "/images/calculator/vhod/columnPos/topPlt/003.jpg")
	$("#isColumnTop5").closest("label").show();
	$("#isColumnTop6").closest("label").show();
	}

if(params.stairModel == "Прямая горка"){
	$("#pltExtenderSide").closest("tr").show();
	}	


if(params.platformTop != "площадка" && params.stairModel != "Прямая горка") {
	$("#pltExtenderSide").val("нет");	
	}

if(params.platformTop == "нет"){
	$("#topAnglePosition").closest("tr").show();
	}

//ширина бокового добора верхней площадки
$("#pltExtenderWidth").closest("tr").hide();
if(params.pltExtenderSide != "нет") $("#pltExtenderWidth").closest("tr").show();

//расположение подкосов площадкок
var uncheckMiddleColumns = false;
var uncheckTopColumns = false;
$("#topPltConsolePos").closest("tr").hide();
if(params.topPltColumns == "подкосы") {
	$("#topPltConsolePos").closest("tr").show();
	uncheckTopColumns = true;	
	}

$("#middlePltConsolePos").closest("tr").hide();
if(params.middlePltColumns == "подкосы") {
	$("#middlePltConsolePos").closest("tr").show();
	uncheckMiddleColumns = true;		
	}

if (params.stairModel == "Прямая") uncheckMiddleColumns = true;
if (params.platformTop == "нет") uncheckTopColumns = true;

//убираем чекбоксы колонн
if(uncheckTopColumns) $("#isColumnTop input[type='checkbox']").removeAttr("checked");
if(uncheckMiddleColumns) $("#isColumnMiddle input[type='checkbox']").removeAttr("checked");




var isColumns = false;
//расположение колонн верхней площадки
$("#isColumnTop1").closest("tr").hide();
if(params.topPltColumns == "колонны" && params.platformTop != "нет") {
	$("#isColumnTop1").closest("tr").show();
	isColumns = true;
	}
	

//расположение колонн средней площадки
$("#isColumnMiddle1").closest("tr").hide();
if(params.middlePltColumns == "колонны" && params.stairModel != "Прямая") {
	$("#isColumnMiddle1").closest("tr").show();
	isColumns = true;
	}

if(params.topStepColumns == "есть") isColumns = true;

//размер колонн

$("#columnModel").closest("tr").hide();
if(isColumns) $("#columnModel").closest("tr").show();


	
//задняя тетива площадки
var needRearStringer = false;
if(params.topPltRailing_5) needRearStringer = true;
if(params.platformTopColumn == "колонны" && 
	params.columnModel != "нет" &&
	(params.isColumnTop1 || params.isColumnTop3)) needRearStringer = true;
if(needRearStringer) {
	params.platformRearStringer = "есть";
	$("#platformRearStringer").val("есть");
	}


//дополнительные функции для веранд
if(params.calcType == "veranda"){
	changeFormCarport()
	partPar = calcCarportPartPar();
	
	$(".verandaPltPar").show()
	if (params.pltType == 'единая с лестницей') {
		$("#pltHeight").val((params.stairAmt1 + 1) * params.h1);
		//$("#calcType").val('vhod');
		$("#platformTop").val('площадка');
		if (params.pltLen !== params.M) $("#platformTop").val('увеличенная');
		$("#platformLength_3").val(params.pltWidth);
		$("#platformWidth_3").val(params.pltLen);

		$(".verandaPltPar").hide()
		//params.calcType = 'vhod';
		//params.platformTop = 'площадка';
		//if (params.pltLen !== params.M) params.platformTop = 'увеличенная';
		//params.platformLength_3 = params.pltWidth;
		//params.platformWidth_3 = params.pltLen
	}
}


} //конец функции changeFormCarcas()