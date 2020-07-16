
function changeFormCarcas(){
getAllInputsValues(params);

/*
var i; //счетчик цикла - служебная переменная
var j; //счетчик цикла - служебная переменная

//вывод параметров маршей в зависимости от модели
//средний марш
$(".marsh2").hide();
if (params.stairModel == "П-образная трехмаршевая") $(".marsh2").show();
//верхний марш
$(".marsh3").show();
if (params.stairModel == "Прямая") $(".marsh3").hide();

/*вывод кол-ва маршей в зависимости от модели*
var stairModel = params.stairModel;
$(".marsh_2_tr").hide();
$(".marsh_3_tr").hide();
//средний марш
if (stairModel == "П-образная трехмаршевая") $(".marsh_2_tr").show(); 
//верхний марш
if (stairModel != "Прямая") $(".marsh_3_tr").show();

/*геометрия в зависимости от типа модулей*/
$("select#stairModel option[value='П-образная с площадкой']").hide();

if(params.model == "Стиль-Т") {
	$("select#stairModel option[value='П-образная с площадкой']").show();
	}

//Устанавливаем параметры ступени
if(params.model == "Стамет"){
	
	//подъем ступени
	var h = params.moduleSize * 1.0;
	var isRiseUp = false;
	var isRiseDown = false;
	if (params.h1 < h) {		
		$("#h1").val(h);
		isRiseUp = true;	
		}
	if (params.h1-h > 20) {		
		$("#h1").val(h+20);
		isRiseDown = true;	
		}
	if (params.h2 < h) {		
		$("#h2").val(h);
		isRiseUp = true;	
		}
	if (params.h2-h > 20) {		
		$("#h2").val(h+20);
		isRiseDown = true;	
		}
	if (params.h3 < h) {		
		$("#h3").val(h);
		isRiseUp = true;	
		}
	if (params.h3-h > 20) {		
		$("#h3").val(h+20);
		isRiseDown = true;	
		}
	if(isRiseUp) alert("Введена высота шага меньше допустимой. Установлена высота шага h = " + h + "мм")
	if(isRiseDown) alert("Введена высота шага больше допустимой. Установлена высота шага h = " + (h+20) + "мм")

//проступь
	var b = 225;
	var b_min = 180;
	var isStepUp = false;
	var isStepDown = false;
	
	if (params.b1 < b_min) {		
		$("#b1").val(b_min);
		isStepUp = true;	
		}
	if (params.b1 > b) {		
		$("#b1").val(b);
		isStepDown = true;	
		}
	if (params.b2 < b_min) {		
		$("#b2").val(b_min);
		isStepUp = true;	
		}
	if (params.b2 > b) {		
		$("#b2").val(b);
		isStepDown = true;	
		}
	if (params.b3 < b_min) {		
		$("#b3").val(b_min);
		isStepUp = true;	
		}
	if (params.b3 > b) {		
		$("#b3").val(b);
		isStepDown = true;	
		}

	if(isStepUp) alert("Введена проступь меньше допустимой. Установлена проступь b = " + b_min + "мм")
	if(isStepDown) alert("Введена проступь больше допустимой. Установлена высота шага b = " + b + "мм")

		
	//ширина ступени
	var a = 295;
	var isTreadChanged = false;
	if (params.a1 != a) isTreadChanged = true;
	if (params.a2 != a) isTreadChanged = true;
	if (params.a3 != a) isTreadChanged = true;
	$("#a1").val(a);
	$("#a2").val(a);
	$("#a3").val(a);
	
	if(isTreadChanged) alert("Ширина ступени для модульной лестницы является стандартной и не может быть изменена. Установлена ширина ступени a = " + a + "мм")

	var M = 900;
	if (params.M != M){
		$("#M").val(M);
		alert("Ширина марша для модульной лестницы является стандартной и не может быть изменена. Установлена ширина марша М = " + M + "мм")
		}
	
	}

/*параметры площадок и поворотов*
if (stairModel == "П-образная с площадкой") {
//document.getElementById('middlePlatform_tr_1').style.display = "table-row";
document.getElementById('middlePlatform_tr_2').style.display = "table-row";
//document.getElementById('middlePlatform_tr_3').style.display = "table-row";
}
else {
//document.getElementById('middlePlatform_tr_1').style.display = "none";
document.getElementById('middlePlatform_tr_2').style.display = "none";
//document.getElementById('middlePlatform_tr_3').style.display = "none";
}

if (stairModel == "П-образная с забегом" || stairModel == "П-образная с площадкой"){
document.getElementById('marshDist_tr').style.display = "table-row";
//document.getElementById('turn_tr_2').style.display = "table-row";
}
else {
document.getElementById('marshDist_tr').style.display = "none";
//document.getElementById('turn_tr_2').style.display = "none";
}
*

if (stairModel == "П-образная трехмаршевая"){
//document.getElementById('turn_tr_10').style.display = "table-row";
document.getElementById('turn_tr_11').style.display = "table-row";
document.getElementById('turn_tr_12').style.display = "table-row";
}
else {
//document.getElementById('turn_tr_10').style.display = "none";
document.getElementById('turn_tr_11').style.display = "none";
document.getElementById('turn_tr_12').style.display = "none";
}
/*
var platformTop = document.getElementById('platformTop').options[document.getElementById('platformTop').selectedIndex].value;
if (platformTop == "площадка"){
document.getElementById('platformTop_tr_1').style.display = "table-row";
document.getElementById('platformTop_tr_2').style.display = "table-row";
document.getElementById('platformTop_tr_3').style.display = "table-row";
document.getElementById('platformTopColumnAmt_tr').style.display = "table-row";
document.getElementById('platformTop_tr_4').style.display = "none";
//document.getElementById('platformTop_tr_14').style.display = "none";
}
else {
document.getElementById('platformTop_tr_1').style.display = "none";
document.getElementById('platformTop_tr_2').style.display = "none";
document.getElementById('platformTop_tr_3').style.display = "none";
document.getElementById('platformTopColumnAmt_tr').style.display = "none";
document.getElementById('platformTop_tr_4').style.display = "table-row";
//document.getElementById('platformTop_tr_14').style.display = "table-row";
}
*/
/*тип каркаса*
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
	var imgHtml = '<img src="/images/calculator/carcasTypes/' + folder + '/' + carcasConfig + '.jpg" width="250px">';
	var carcasConfig_img = $("#carcasConfig_img").html(imgHtml);
}
*/

/*выступание косоуров*
$("#stringerLedge1_tr").hide();
$("#stringerLedge2_tr").hide();

if(stairModel == "Г-образная с площадкой") $("#stringerLedge1_tr").show();
if(stairModel == "П-образная с площадкой" || stairModel == "П-образная трехмаршевая") {
	$("#stringerLedge1_tr").show();
	$("#stringerLedge2_tr").show();
	}
*/
/*покраска металла*
$('#carcasMetalColor_tr').hide();
if(params.metalPaint != "нет") $('#carcasMetalColor_tr').show();

/*покраска дерева*
$('#carcasTimberColor_tr').hide();
$('#timberColorNumber').closest("tr").hide();
if(params.timberPaint == "морилка+лак") {
	$('#carcasTimberColor_tr').show();
	$('#timberColorNumber').closest("tr").show();
	}
*/
}