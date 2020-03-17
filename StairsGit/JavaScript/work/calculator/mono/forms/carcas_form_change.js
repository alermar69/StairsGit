
function changeFormCarcas(){
	
//жестко привязываем ширину ступени к проступи
params.nose = 50;
$("#nose").val(50);

$("#a1").val(params.b1 + params.nose);
$("#a2").val(params.b2 + params.nose);
$("#a3").val(params.b3 + params.nose);
	var stairModel = params.stairModel;

	$("#calcType").val('mono')
	// Установка параметров для гнутого монокосоура
	if (params.model == "гнутый") {
		//$("#stairModel").val("Г-образная с забегом");
		$("#stairModel [value='Прямая']").hide();
		$("#stairModel [value='Г-образная с площадкой']").hide();
		$("#stairModel [value='П-образная с площадкой']").hide();
		$('#sizeTurn').closest("tr").show();
		$('#countWndTread').closest("tr").show();
		$('#maxSizeSegment').closest("tr").show();

		//$("#sizeTurn").val(params.M + 300);
		$("#calcType").val('curve')
	}

// установка зазора между маршами если есть ограждение на П-образных
if(params.stairModel == "П-образная с площадкой" || params.stairModel == "П-образная с забегом"){
	if(getMarshParams(1).hasRailing.in && 
		getMarshParams(3).hasRailing.in &&
		params.rackBottom == "боковое" &&
		params.marshDist < 100){
			var delta = 100 - params.marshDist;
			var message = "ВНИМАНИЕ! \n" + 
				"Введен слишком маленький зазор между маршами в плане, который не позволит установить ограждения. \n" + 
				"Зазор увеличен до 100мм \n" + 
				"Ширина маршей уменьшена с " + params.M + " до " + (params.M - delta / 2) + " мм";
			alertTrouble(message);
			$("#marshDist").val(100);
			$("#M").val(params.M - delta / 2);
			getAllInputsValues(params);
			}

}	


if(params.railingModel == "Самонесущее стекло" && staircaseHasUnit().railing && params.treadThickness < 60) $("#treadThickness").val(60);

var isMarsh_2 = false;
if (stairModel == "П-образная трехмаршевая") isMarsh_2 = true;
	

//зазор между маршами в плане

var enableMarshDist = false;
if (stairModel == "П-образная с забегом") enableMarshDist = true;
if (stairModel == "П-образная с площадкой") enableMarshDist = true;
if (stairModel == "П-образная трехмаршевая" && params.stairAmt2 == 0) enableMarshDist = true;

//зазор между маршами

$("#marshDist_tr").hide();

if (enableMarshDist){
	$("#marshDist_tr").show();
	if(params.marshDist < 40) {
		alertTrouble("Зазор между маршами в плане не может быть меньше 40мм!")
		$("#marshDist").val(40);	
		}
	if(params.marshDist > 40 && params.marshDist < 80){
		alertTrouble("Зазор между маршами в плане может быть 40мм либо больше 80мм!")
		$("#marshDist").val(40);
		}
	}

var platformWidth_1 = $("#marshDist").val() * 1.0 + params.M * 2;
//console.log(platformWidth_1)
$("#platformWidth_1").val(platformWidth_1);

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
		if(params.lastWinderTreadWidth < 50) {
			$('#lastWinderTreadWidth').val(50);
			alertTrouble("Ширина последней забежной ступени не может быть меньше 50мм! Было установлено значение ширины ступени 50мм")
			}
		if(params.lastWinderTreadWidth + params.M - 5 + 8 > params.floorHoleLength)
			 alertTrouble("Ширина проема А = " +
                    params.floorHoleLength +
                    "мм - меньше чем длина проекции верхнего марша (" + (params.lastWinderTreadWidth + params.M - 5 + 8) +")\n" +
                    " По конструктивным соображениям невозможно спроектировать лестницу!\n\n" +
                    "Измените ширину верхней ступени, ширину марша или проем.");
		
	}

	if(params.topStairType == "вровень") {
		if(!testingMode) alertTrouble("Внимание! Установка верхней ступени вровень с перекрытием настоятельно не рекомендуется!")
	}
	
	
	
//головки болтов каркаса
$("#boltHead").closest("tr").hide();
$("#paintedBolts").closest("tr").show();
if(params.model == "сварной") {
	$("#paintedBolts").val("нет");
	$("#paintedBolts").closest("tr").hide();
}

/*тип каркаса*/
var carcasConfig = params.carcasConfig;
$("#carcasConfig_tr").hide();
if(stairModel != "Прямая") {
	$("#carcasConfig_tr").show();
	
	if(stairModel == "Г-образная с площадкой" || stairModel == "Г-образная с забегом"){
		var folder = "turn90";
		var compatibleOptions = [1,2]	
		}
	if(stairModel == "П-образная с площадкой" || stairModel == "П-образная с забегом"){
		var folder = "turn180";
		var compatibleOptions = [1,2,3,4]	
		}
	if(stairModel == "П-образная трехмаршевая"){
		var folder = "3marsh";
		var compatibleOptions = [1,2,3,4];
		}
	showOptions("carcasConfig", compatibleOptions);
	var imgHtml = '<img src="/images/calculator/carcasTypes/' + folder + '/00' + carcasConfig + '.jpg" width="250px">';
	var carcasConfig_img = $("#carcasConfig_img").html(imgHtml);
}

/*выступание косоуров*/
$("#stringerLedge1_tr").hide();
$("#stringerLedge2_tr").hide();

if(stairModel == "Г-образная с площадкой" || stairModel == "Г-образная с забегом") $("#stringerLedge1_tr").show();
if(stairModel == "П-образная с площадкой" || stairModel == "П-образная с забегом" || stairModel == "П-образная трехмаршевая") {
	$("#stringerLedge1_tr").show();
	$("#stringerLedge2_tr").show();
	}

//толщина подложек по умолчанию
$("#treadPlateThickness").val(8);
if(params.model == "труба") $("#treadPlateThickness").val(2);

//технологические параметры для лестницы на профиле
$(".profileParams_tr").hide();
if(params.model == "труба") $(".profileParams_tr").show();

//толщина косоура для профиля
if(params.model == "труба") $("#stringerThickness").val(108);
if(params.model == "сварной" && $("#stringerThickness").val() < 150)
		alertTrouble("Толщина косоура установлена меньше 150мм. Вы уверены?")

//чекбоксы колонн
$("#isColumn3").closest("label").hide();
$("#isColumn4").closest("label").hide();
if(stairModel == "П-образная с площадкой" || 
	stairModel == "П-образная с забегом" || 
	stairModel == "П-образная трехмаршевая"){
		$("#isColumn3").closest("label").show();
		$("#isColumn4").closest("label").show();
		}


//колонна под серединой косоура
var maxStairAmt = 8; //максимальное кол-во ступеней, при котором НЕ нужна колонна
var isMarshMiddleFix_1 = false;
var isMarshMiddleFix_2 = false;
var isMarshMiddleFix_3 = false;


if(params.stairAmt1 < maxStairAmt) {
	$("#marshMiddleFix_1 [value='нет']").show();
	$("#marshMiddleFix_1").val("нет");
	$("#marshMiddleFix_1").closest("tr").hide();
	}
if(params.stairAmt1 >= maxStairAmt) {
	$("#marshMiddleFix_1").closest("tr").show();
	if(params.model == "труба"){
		$("#marshMiddleFix_1 [value='нет']").hide();
		if($("#marshMiddleFix_1").val() == "нет") $("#marshMiddleFix_1").val("колонна");
		}
	if(params.model == "сварной"){
		$("#marshMiddleFix_1 [value='нет']").show();
		}	
	}

if(params.stairAmt2 < maxStairAmt || !isMarsh_2) {
	$("#marshMiddleFix_2 [value='нет']").show();
	$("#marshMiddleFix_2").val("нет");
	$("#marshMiddleFix_2").closest("tr").hide();
	}
if(params.stairAmt2 >= maxStairAmt) {
	$("#marshMiddleFix_2").closest("tr").show();
	if(params.model == "труба"){		
		if($("#marshMiddleFix_2").val() == "нет") $("#marshMiddleFix_2").val("колонна");
		$("#marshMiddleFix_2 [value='нет']").hide();
		}
	if(params.model == "сварной"){
		$("#marshMiddleFix_2 [value='нет']").show();
		}	
	}

	
if(params.stairAmt3 < maxStairAmt || stairModel == "Прямая") {
	$("#marshMiddleFix_3 [value='нет']").show();
	$("#marshMiddleFix_3").val("нет");
	$("#marshMiddleFix_3").closest("tr").hide();
	}
if(params.stairAmt3 >= maxStairAmt && stairModel != "Прямая") {
	$("#marshMiddleFix_3").closest("tr").show();

	if(params.model == "труба"){		
		if($("#marshMiddleFix_3").val() == "нет") $("#marshMiddleFix_3").val("колонна");
		$("#marshMiddleFix_3 [value='нет']").hide();
		}
	if(params.model == "сварной"){
		$("#marshMiddleFix_3 [value='нет']").show();
		}	
	}
	
//позиция верхнего отверстия

if(params.topAnglePosition == "над ступенью" && $("#topHolePos").val() < 0) $("#topHolePos").val(100);
if(params.topAnglePosition == "под ступенью" && $("#topHolePos").val() > 0) $("#topHolePos").val(-60);

//самоенсущее стекло не ставится на профиль
if(params.railingModel == "Самонесущее стекло" && 
	staircaseHasUnit().railing && 
	params.model == "труба" &&
	!testingMode
	) {
		alertTrouble("ВНИМАНИЕ!\nОграждение с самонесущим стеклом не может быть установлено на лестницу на профиле. Измените каркас на сварной короб или выберите другой тип ограждения")
	};
}