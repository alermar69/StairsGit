function changeFormCarcas(){

//жестко привязываем ширину ступени к проступи
if(params.calcType == "bolz"){
	params.nose = 60;
	$("#nose").val(60);
}

//наличие каркаса
if(params.model == "нет"){
	$("#model").val('ко');
	$("#isCarcas").val('нет');
	getAllInputsValues(params);
	}

//заполнение параметров ступеней если они некорректно перенеслись из расчета геометрии

if(!params.b1) {
	params.b1 = 260;
	$("#b1").val(260);
	}
if(!params.b2) {
	params.b2 = 260;
	$("#b2").val(260);
	}
if(!params.b3) {
	params.b3 = 260; 
	$("#b3").val(260);
	}
	
if(!params.h1) {
	params.h1 = 180;
	$("#h1").val(180);
	}
if(!params.h2) {
	params.h2 = 180;
	$("#h2").val(180);
	}
if(!params.h3) {
	params.h3 = 180;
	$("#h3").val(180);
	}
	
if(params.stairType != "пресснастил"){
	$("#a1").val(calcTreadWidth(params.b1));
	$("#a2").val(calcTreadWidth(params.b2));
	$("#a3").val(calcTreadWidth(params.b3));
	getAllInputsValues(params);
}

if(params.stringerModel == "лист") $("#stringerThickness").val(8);
if(params.stringerModel == "короб") {
	if(params.stringerThickness < 20) $("#stringerThickness").val(20);
}

// установка зазора между маршами если есть ограждение на П-образных
if(params.stairModel == "П-образная с площадкой" || params.stairModel == "П-образная с забегом"){
	if(getMarshParams(1).hasRailing.in && 
		getMarshParams(3).hasRailing.in &&
		params.rackBottom == "боковое" &&
		params.calcType !== "bolz" &&
		params.marshDist < 100){
			var delta = 100 - params.marshDist;
			var message = "ВНИМАНИЕ! \n" + 
				"Введен слишком маленький зазор между маршами в плане, который не позволит установить ограждения. \n" + 
				"Зазор увеличен до 100мм \n" + 
				"Ширина маршей уменьшена с " + params.M + " до " + (params.M - delta / 2) + " мм";
			if(!testingMode) alertTrouble(message);
			$("#marshDist").val(100);
			$("#M").val(params.M - delta / 2);
			getAllInputsValues(params);
			}

}	

//невозможность выбора вертикальной рамки для
if(params.stairType == "рифленая сталь" ||
	params.stairType == "рифленый алюминий" ||
	params.stairType == "лотки" ||
	params.stairType == "дпк" ||
	params.stairType == "лиственница тер." ||
	params.stairType == "пресснастил" ||
	params.stairType == "стекло"
	){
		if(params.topAnglePosition == "вертикальная рамка"){
			var message = 'ВНИМАНИЕ! \n Тип крепления к верхнему перекрытию "Вертикальная рамка" несовместим с типом ступеней "' + 
				params.stairType + '" \n Установлен тип крепления "Уголок над ступенью"';
			if(!testingMode) alertTrouble(message);
			$("#topAnglePosition").val("над ступенью");
			getAllInputsValues(params);
			}
	}


//var showAlert = false;

//параметры дпк
$("#dpcWidth").closest("tr").hide();
$("#dpcDst").closest("tr").hide();

if(params.stairType == "дпк" || params.stairType == "лиственница тер."){
	$("#dpcWidth").closest("tr").show();
	$("#dpcDst").closest("tr").show();
	
	if($("#a1").val() != params.dpcWidth && $("#a1").val() != params.dpcWidth * 2 + params.dpcDst){
		if(showAlert) alertTrouble("Ширина ступени нижнего марша должна быть кратна ширине доски ДПК. Установлена ширина ступени a1 = " + (params.dpcWidth * 2 + params.dpcDst))
		$("#a1").val(params.dpcWidth * 2 + params.dpcDst);
	}

	if($("#a2").val() != params.dpcWidth && $("#a2").val() != params.dpcWidth * 2 + params.dpcDst){
		if(showAlert)alertTrouble("Ширина ступени среднего марша должна быть кратна ширине доски ДПК. Установлена ширина ступени a2 = " + (params.dpcWidth * 2 + params.dpcDst))
		$("#a2").val(params.dpcWidth * 2 + params.dpcDst);
	}

	if($("#a3").val() != params.dpcWidth && $("#a3").val() != params.dpcWidth * 2 + params.dpcDst){
		if(showAlert)alertTrouble("Ширина ступени верхнего марша должна быть кратна ширине доски ДПК. Установлена ширина ступени a3 = " + (params.dpcWidth * 2 + params.dpcDst))
		$("#a3").val(params.dpcWidth * 2 + params.dpcDst);
	}
}

//расчет ширины площадки по зазору между маршами
var platformWidth_1 = params.marshDist + params.M * 2;
if(params.stairModel == "П-образная с площадкой") {
	$("#platformWidth_1").val(platformWidth_1);
	}
	
//увеличенная верхняя площадка
$("#platformWidth_3").closest("tr").hide();
if(params.platformTop == "увеличенная") {
	$("#platformWidth_3").closest("tr").show();
	$(".topPlt").show();
}

//конструктив забежных рамок
$("#wndFrames").closest("tr").hide();
if (params.stairFrame == "нет") $("#wndFrames").val("нет");
if(params.stairModel == "Г-образная с площадкой" || params.stairModel == "П-образная с площадкой")
	$("#wndFrames").val("нет");
if (params.stairModel == "П-образная трехмаршевая" && (params.turnType_1 != "забег" && params.turnType_2 != "забег"))
	$("#wndFrames").val("нет");

if(params.stairFrame == "есть"){
	if(params.stairModel == "Г-образная с забегом" || params.stairModel == "П-образная с забегом"){
		$("#wndFrames").closest("tr").show();
		if($("#wndFrames").val() == "нет") $("#wndFrames").val("лист");
		}

	if (params.stairModel == "П-образная трехмаршевая" && (params.turnType_1 == "забег" || params.turnType_2 == "забег")){
		$("#wndFrames").closest("tr").show();
		if($("#wndFrames").val() == "нет") $("#wndFrames").val("лист");
		}

	if (params.model == "ко") $("#wndFrames").val("лист");
}

//колонны промежуточной площадки
$("#columnPos_tr").hide();
if (params.columnModel != "нет") $("#columnPos_tr").show();

/*скрываем все чекбоксы*/
for (var i=1; i<9; i++) {
	var trId = "isColumn" + i + "_label";
	document.getElementById(trId).style.display = "none";
	}


var stairModel = params.stairModel;
var posCompatible = [];
var maxColumnAmt = 0;
if (stairModel == "Прямая") {
	maxColumnAmt = 2;
	document.getElementById("columnPos_img").src = "/images/calculator/columnPos/001.jpg";
	}
if (stairModel == "Г-образная с площадкой") {
	maxColumnAmt = 4;
	document.getElementById("columnPos_img").src = "/images/calculator/columnPos/002.jpg";
	}
if (stairModel == "Г-образная с забегом") {
	maxColumnAmt = 4;
	document.getElementById("columnPos_img").src = "/images/calculator/columnPos/003.jpg";
	}
if (stairModel == "П-образная с площадкой") {
	maxColumnAmt = 7;
	document.getElementById("columnPos_img").src = "/images/calculator/columnPos/004.jpg";
	}
if (stairModel == "П-образная с забегом") {
	maxColumnAmt = 7;
	document.getElementById("columnPos_img").src = "/images/calculator/columnPos/005.jpg";
	}
if (stairModel == "П-образная трехмаршевая") {
	maxColumnAmt = 8;
	document.getElementById("columnPos_img").src = "/images/calculator/columnPos/006.jpg";
	}


for (var i=1; i < maxColumnAmt+1; i++) {
	var trId = "isColumn" + i + "_label";
	
	document.getElementById(trId).style.display = "";	
}

	
//колонна №5 на трехмаршевой лестнице
if(params.stairModel == "П-образная с площадкой" || 
	params.stairModel == "П-образная с забегом" || 
	(params.stairModel == "П-образная трехмаршевая" && params.stairAmt2 < 2))
		{
		if(params.isColumn5){
			if(!testingMode) alertTrouble("Колонна №5 может быть установлена только если в среднем марше 2 и более ступеней.");
			params.isColumn5 = false;
			$("#isColumn5").prop("checked", false)
			}
		}
	
// показ селектора выбора разделения косоуров промежуточной площадки и низлежащего марша

$("#stringerDivision").closest("tr").hide();
$("#stringerDivision2").closest("tr").hide();
if (params.model == "ко"){
	if(stairModel == "Г-образная с площадкой") $("#stringerDivision").closest("tr").show();
	if(stairModel == "П-образная с площадкой") {
		$("#stringerDivision").closest("tr").show();
		$("#stringerDivision2").closest("tr").show();
	}
	if(stairModel == "П-образная трехмаршевая"){
		if(params.turnType_1 == "площадка") $("#stringerDivision").closest("tr").show();
		if(params.turnType_2 == "площадка") $("#stringerDivision2").closest("tr").show();
	}
	
}



/*тип ступеней*/
var stairType = document.getElementById('stairType').options;
var stairCompatible = [];
if (params.model == "лт") stairCompatible = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
if (params.model == "ко") stairCompatible = [1,2,3,4,5,6,7,8];
showOptions("stairType", stairCompatible);




//параметры террасной доски
$("#dpcWidth").closest("tr").hide();
$("#dpcDst").closest("tr").hide();

if(params.stairType == "дпк" || params.stairType == "лиственница тер."){
	$("#dpcWidth").closest("tr").show();
	$("#dpcDst").closest("tr").show();
	
	if($("#a1").val() != params.dpcWidth && $("#a1").val() != params.dpcWidth * 2 + params.dpcDst){
		if(!testingMode) alertTrouble("Ширина ступени нижнего марша должна быть кратна ширине доски ДПК. Установлена ширина ступени a1 = " + (params.dpcWidth * 2 + params.dpcDst))
		$("#a1").val(params.dpcWidth * 2 + params.dpcDst);
		}

	if($("#a2").val() != params.dpcWidth && $("#a2").val() != params.dpcWidth * 2 + params.dpcDst){
		if(!testingMode) alertTrouble("Ширина ступени среднего марша должна быть кратна ширине доски ДПК. Установлена ширина ступени a2 = " + (params.dpcWidth * 2 + params.dpcDst))
		$("#a2").val(params.dpcWidth * 2 + params.dpcDst);
		}

	if($("#a3").val() != params.dpcWidth && $("#a3").val() != params.dpcWidth * 2 + params.dpcDst){
		if(!testingMode) alertTrouble("Ширина ступени верхнего марша должна быть кратна ширине доски ДПК. Установлена ширина ступени a3 = " + (params.dpcWidth * 2 + params.dpcDst))
		$("#a3").val(params.dpcWidth * 2 + params.dpcDst);
		}
	}


/*тип тетив*/
var stringerType = document.getElementById('stringerType').options;
var stringerCompatible = [];
if (params.model == "лт") stringerCompatible = [1,2,3];
if (params.model == "ко") stringerCompatible = [1,2];
showOptions("stringerType", stringerCompatible);

/*подступенки*/
var riserType = document.getElementById('riserType').options;
if (params.model == "лт") {
	riserType[0].selected="true";
	riserType[1].style.display = "none";
	}
else {
	riserType[1].style.display = "table-row";
	}



//зазор от стены по умолчанию
var minDist = 10;
if (params.calcType == "console") minDist = 0;
if($("#wallDist").val() < minDist) $("#wallDist").val(minDist);

//зазор между маршами в плане
if (stairModel == "П-образная с забегом"){
	if(params.marshDist < 70) {
		if(!testingMode) alertTrouble("ВНИМАНИЕ!!! Для забежных лестниц ЛТ и КО зазор между маршами в плане не может быть меньше 70мм!")
		//$("#marshDist").val(70);	
		}
	}

// показ инпута бокового свеса ступеней у КО
$("#sideOverHang").closest("tr").hide()
if (params.model == "ко") $("#sideOverHang").closest("tr").show()


/*опции крепления*/

if(params.platformTop != "нет"){
	params.topAnglePosition = "под ступенью";
	$("#topAnglePosition").val(params.topAnglePosition);
	}

$('#topFlan').closest("tr").show();
$('#topFlanHolesPosition').closest("tr").hide();
if(params.topFlan == "есть") $('#topFlanHolesPosition').closest("tr").show();

if(params.topAnglePosition == "вертикальная рамка" || params.platformTop != "нет") {
	$("#topFlan").val("нет");
	$('#topFlan').closest("tr").hide();
	$('#topFlanHolesPosition').closest("tr").hide();
}

if(params.topAnglePosition == "рамка верхней ступени" && !testingMode){
	alertTrouble("ВНИМАНИЕ!\nКрепление к верхнему перекрытию через рамку верхней ступени более не используется. Выберите другой вариант крепления.")
}
//ширина последней забежной ступени если в верхнем марше 0 ступеней
$('#lastWinderTreadWidth').closest("tr").hide();
var showLastTreadWidth = false;
if(params.stairAmt3 == 0){
	if(params.stairModel == "Г-образная с забегом") showLastTreadWidth = true;
	if(params.stairModel == "П-образная с забегом") showLastTreadWidth = true;
	if(params.stairModel == "П-образная трехмаршевая" && params.turnType_2 == "забег") showLastTreadWidth = true;
	}
if(showLastTreadWidth){
	$('#lastWinderTreadWidth').closest("tr").show();
	if(params.model == "лт"){
		if(params.lastWinderTreadWidth < 100) {
			$('#lastWinderTreadWidth').val(100);
			if(!testingMode) alertTrouble("Для лестницы ЛТ ширина последней забежной ступени не может быть меньше 100мм! Было установлено значение ширины ступени 100мм")
			}
		if(params.lastWinderTreadWidth + params.M + 5 > params.floorHoleLength)
			if(!testingMode)  alertTrouble("Ширина проема А = " +
                    params.floorHoleLength +
                    "мм - меньше чем длина проекции верхнего марша (" + (params.lastWinderTreadWidth + params.M + 5) +")\n" +
                    "для ЛТ по конструктивным соображениям невозможно спроектировать лестницу!\n\n" +
                    "Измените ширину верхней ступени, ширину марша или проем.");
		}
	if(params.model == "ко"){
		if(params.lastWinderTreadWidth < 55) {
			$('#lastWinderTreadWidth').val(55);
			if(!testingMode)alertTrouble("Для лестницы ЛТ ширина последней забежной ступени не может быть меньше 55мм! Было установлено значение ширины ступени 55мм")
			}
		if(params.lastWinderTreadWidth + params.M + 17 > params.floorHoleLength)
			if(!testingMode) alertTrouble("Ширина проема А = " +
                    params.floorHoleLength +
                    "мм - меньше чем длина проекции верхнего марша (" + (params.lastWinderTreadWidth + params.M + 17) +")\n" +
                    "для ЛТ по конструктивным соображениям невозможно спроектировать лестницу!\n\n" +
                    "Измените ширину верхней ступени, ширину марша или проем.");
		}
	}
	
	
/*Пристенный плинтус*/
if(params.model == "лт" || params.riserType == "нет") {
	$(".skirting").hide();
	$("#skirting_1").val("нет");
	$("#skirting_2").val("нет");
	$("#skirting_3").val("нет");
	}


var treadMaterial = "metal";

if (params.stairType == "сосна кл.Б" ||
	params.stairType == "сосна экстра" ||
	params.stairType == "береза паркет." ||
	params.stairType == "дуб паркет." ||
	params.stairType == "лиственница паркет." ||
	params.stairType == "лиственница тер." ||	
	params.stairType == "дуб ц/л") treadMaterial = "timber"; 
	

setStairOption();


/*тип верхнего крепления*/

var topFixOptions = document.getElementById('topAnglePosition').options; 
var topFixCompatible = [];
if (params.model == "лт") {
	topFixCompatible = [1, 2];
	topFixCompatible.push(1,4);
	if(params.stairFrame == "есть" && treadMaterial == "timber") topFixCompatible.push(1,3,4);
	//уголок под ступенью невозможен при 0 ступеней после забега
	if(showLastTreadWidth){
		while (topFixCompatible.indexOf(1) != -1){
			topFixCompatible.splice(topFixCompatible.indexOf(1), 1)
		}
	}
}

if (params.model == "ко") topFixCompatible = [1,3,4];
showOptions("topAnglePosition", topFixCompatible);

$("#topPltConsolePos").closest("tr").hide();
$("#isColumnTop").closest("tr").hide();
if(params.platformTop != "нет"){	
	$("#isColumnTop").closest("tr").show();
	if(params.platformTopColumn == "подкосы") {
		$("#topPltConsolePos").closest("tr").show();
		$("#isColumnTop").closest("tr").hide();
		}
}


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
	
//удлиннение внутренней тетивы/косоура под забегом
$("#inStringerElongationTurn1").closest("tr").hide();
$("#inStringerElongationTurn2").closest("tr").hide();
if(params.stairModel == "Г-образная с забегом") $("#inStringerElongationTurn1").closest("tr").show();
if(params.stairModel == "П-образная с забегом") {
	$("#inStringerElongationTurn1").closest("tr").show();
	$("#inStringerElongationTurn2").closest("tr").show();
	};
if(params.stairModel == "П-образная трехмаршевая"){
	if(params.turnType_1 == "забег") $("#inStringerElongationTurn1").closest("tr").show();
	if(params.turnType_2 == "забег") $("#inStringerElongationTurn2").closest("tr").show();
	};

//смещение внешнего косоура
if(params.model != "ко" && params.calcType != "console") $(".stringerMoove").hide();
if(params.calcType == "console"){
	if(params.stringerMoove_1 < 50) $("#stringerMoove_1").val(50);
	if(params.stringerMoove_2 < 50) $("#stringerMoove_2").val(50);
	if(params.stringerMoove_3 < 50) $("#stringerMoove_3").val(50);
}

} //конец функции changeFormCarcas()



function setTemplateCarcas() {
	var template = document.getElementById('template').options[document.getElementById('template').selectedIndex].value;
	var stairType = document.getElementById('stairType').options;
	var metalPaint = document.getElementById('metalPaint').options;
	var timberPaint = document.getElementById('timberPaint').options;
	var install = document.getElementById('install').options;


	if (template == "дерево 1") {
	stairType[3].selected="true";
	metalPaint[2].selected="true";
	timberPaint[2].selected="true";
	install[1].selected="true";
	}
	if (template == "дерево 2") {
	stairType[2].selected="true";
	metalPaint[2].selected="true";
	timberPaint[1].selected="true";
	install[0].selected="true";
	}

	if (template == "дерево 3") {
	stairType[1].selected="true";
	metalPaint[2].selected="true";
	timberPaint[0].selected="true";
	install[0].selected="true";
	}
	if (template == "дерево 4") {
	stairType[0].selected="true";
	metalPaint[0].selected="true";
	timberPaint[0].selected="true";
	install[0].selected="true";
	}
}// end of setTemplateCarcas

