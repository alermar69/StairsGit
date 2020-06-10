var showPaintingAlerts = true;

$(function () {
	//кнопка показать себестоимость
	$("#showCost").click(function(){
		if($(this).text() == "Показать себестоимость") {
			$(this).text("Скрыть себестоимость");
			$(".cost").slideDown();
			$("#production_data").slideDown();
		}
		else {
			$(this).text("Показать себестоимость");
			$(".cost").slideUp();
			$("#production_data").slideUp();
		}
	});
		
	//кнопка свернуть все блоки
	$("#toggleAll").click(function(){
		$("#nav-tabContent div[role='tabpanel']").toggleClass('tab-pane').addClass('show')
		if($(this).text() == "Развернуть") $(this).text("Свернуть");
		else $(this).text("Развернуть");
		});
		
	//скрываем все блоки с расчетом цены частей
	$(".priceDiv").hide();
	
	//2D чертежи
	
	$(".makeSvg").click(function(){
		makeSvg();
		$("#svgParForm").show();
		
	})
	
	$("#saveSvg2").click(function(){
		var text = $("#svgOutputDiv").html();
		saveSvgFile(text);
	})
	
	$("#saveDxf2").click(function(){		
		var svg = $("#svgOutputDiv").find("svg").clone().attr({"id": "temp"});
		$("#svgOutputDiv").append(svg)
		$("svg#temp g").removeAttr("transform")
		$("svg#temp g").removeAttr("style")
		flatten($("svg#temp")[0])
		svgToDxf($("svg#temp")[0])
		$("svg#temp").remove();
	})
	
	//Обработчик удаления
	// TODO: в viewports работает некорректно, переработать
	$(document).on('click','.cloned_canvas',function(){
		$(this).closest("div").fadeOut("100", function(){
			var id = $(this).data('id');
			removeSavedCamera(id);
		});
	});
	
	//вешаем обновление форм на изменение любого инпута
	$('.form_table').delegate('input,select,textarea', 'change', function(){
		//showPaintingAlerts = true;
		changeAllForms();	
	});
	
	//вешаем пересчет на все заголовки разделов
	$('.raschet, .recalculate').click(function(){
		recalculate();
	});
	
	
	$("#showPass").click(function(){
		alert("Логин: demo Пароль: demo_pass Как посмотреть модель: https://youtu.be/8zySuZ2spzg ")		
	});
	
	//перерисовка пользовательских размеров
	$('#dimParamsTable').delegate('input,select,textarea', 'change', function(){
		changeFormDim();
		drawSceneDimensions();
	});
	
	//одинаковый профиль поручня на лестнице и балюстраде
	
	$(".handrail").change(function(){
		$(".handrail").val($(this).val());
	});
	
	$(".handrailProf").change(function(){
		$(".handrailProf").val($(this).val());
	});
	
	$(".handrailSlots").change(function(){
		$(".handrailSlots").val($(this).val());
	});

	$('#dimScale').click(function(){
		changeDimTextScale($(this).val() * 1.0);
	});
	
	$('#createConstructionTask').click(function(){createConstructionTask()});
	
	//удаление строки в динамических таблицах
	$(".form_table").delegate('.removeRow', 'click',  function(){
		var tableId = $(this).closest('table').attr('id');

		$(this).closest('tr').remove();		
		
		reindexId(tableId);
		changeAllForms();
	})
	
	//вычисление формул для числовых инпутов
	$("body").delegate("input[type='number']", "dblclick", function(){
		var string = prompt("Введите формулу");
		
		//если содержит что-то кроме цифр и математических знаков, выдаем ошибку
		if (string.search(/[^\d-+*/.()]/g) !== -1) {
			alert("Не удалось вычислить результат")
			return false;
		}
		
		var result = eval(string);
		$(this).val(result);
	})
});

function appendPreview(id, url, isMain){
	var text = "<div class='previewImage' data-id='" + id + "' style='" + (isMain ? 'border: 3px solid black;' : '') + "'>" +
		'<button class="btn btn-danger removeImg noPrint">' +
		'<i class="glyphicon glyphicon-trash"></i>' +
		'<span>Удалить</span>' +
		'</button>' +
		'<button class="btn btn-success setMain noPrint" style="position: absolute; margin: 20px 120px;">' +
		'<span>Сделать главной</span>' +
		'</button>' +
		"<img class='img' src=" + url + ">" +
		"</div>";

	$("#images").append(text);
}

function changeFormsGeneral(){
$("#formsTroubles").text("");

$(".marsh1").show(); 
$(".marsh2").hide();
$(".marsh3").show();

//пристенный плинтус
$(".skirting").show();
$(".marsh2").hide();

//пристенный плинтус
if(params.model == "тетивы" || params.model == "лт") $(".skirting").hide();


if (params.stairModel == "Прямая") $(".marsh3").hide();

$("#marshDist").closest("tr").hide();

$(".pltP").hide();
if (params.stairModel == "П-образная с площадкой") {
	$(".pltP").show();
	$("#marshDist").closest("tr").show();
	}

$(".wndP").hide();	
if (params.stairModel == "П-образная с забегом") {
	$(".wndP").show();
	$("#marshDist").closest("tr").show();
	}


$(".P3marsh").hide();	
if (params.stairModel == "П-образная трехмаршевая") {
	$(".P3marsh").show();
	$(".marsh2").show();
	if(params.stairAmt2 == 0) $("#marshDist").closest("tr").show();
	}

$(".topPlt").hide();
$(".topFixParams").show();
	
if (params.platformTop == "площадка") {
	$(".topPlt").show();
	$(".topFixParams").hide();
	}
	
if(params.calcType == "vint" && params.platformType != "нет"){
	$(".topPlt").show();
}

//параметры креплений
$(".fixSpacerLength").hide();
$(".fixSpacer").each(function(){
	if($(this).val() != "не указано" && $(this).val() != "нет") $(this).siblings(".fixSpacerLength").show();
	});
	
$(".fixAmt").hide();
$(".fixPart").each(function(){
	if($(this).val() != "не указано" && $(this).val() != "нет") $(this).siblings(".fixAmt").show();
	});

$(".fixPart").children("option").show();

$(".fixType").each(function(){
	if($(this).val() == "монолит" ||
		$(this).val() == "пустотелая плита" ||
		$(this).val() == "кирпич" ||
		$(this).val() == "пустотелый кирпич" ||
		$(this).val() == "пеноблок" ) {
		$(this).closest("tr").find(".fixPart option[value='глухари']").hide();
		$(this).closest("tr").find(".fixPart option[value='шпилька-шуруп']").hide();
		$(this).closest("tr").find(".fixPart option[value='сварка']").hide();
		var fixPart = $(this).closest("tr").find(".fixPart:eq(0)").val()
		if(fixPart == "глухари" || fixPart == "сварка" || fixPart == "шпилька-шуруп") 
			$(this).closest("tr").find(".fixPart:eq(0)").val("не указано");		
		}
		
	if($(this).val() == "дерево") {
		$(this).closest("tr").find(".fixPart option[value='химия']").hide();
		$(this).closest("tr").find(".fixPart option[value='сварка']").hide();
		var fixPart = $(this).closest("tr").find(".fixPart:eq(0)").val()
		if(fixPart == "химия" || fixPart == "сварка") 
			$(this).closest("tr").find(".fixPart:eq(0)").val("не указано");		
		}
		
	if($(this).val() == "металл") {
		$(this).closest("tr").find(".fixPart option[value='химия']").hide();
		$(this).closest("tr").find(".fixPart option[value='глухари']").hide();
		$(this).closest("tr").find(".fixPart option[value='шпилька-шуруп']").hide();
		var fixPart = $(this).closest("tr").find(".fixPart:eq(0)").val()
		if(fixPart == "химия" || fixPart == "глухари" || fixPart == "шпилька-шуруп") 
			$(this).closest("tr").find(".fixPart:eq(0)").val("не указано");		
		}
		
	if($(this).val() == "гипсокартон") {
		$(this).closest("tr").find(".fixPart option[value='химия']").hide();
		$(this).closest("tr").find(".fixPart option[value='глухари']").hide();
		$(this).closest("tr").find(".fixPart option[value='шпилька-шуруп']").hide();
		$(this).closest("tr").find(".fixPart option[value='сварка']").hide();
		$(this).closest("tr").find(".fixPart option[value='шпилька насквозь']").hide();
		
		var fixPart = $(this).closest("tr").find(".fixPart:eq(0)").val()
		if(fixPart == "химия" || fixPart == "глухари" || fixPart == "шпилька-шуруп" || fixPart == "сварка" || fixPart == "шпилька насквозь") 
			$(this).closest("tr").find(".fixPart:eq(0)").val("не указано");		
		}
		
});

if(params.fixPart1 == "саморезы" && params.calcType == "mono") {
	$("#fixPart1").val("глухари");
	params.fixPart1 = "глухари"
}

//уровень чернового пола
$('#botFloorsDist_tr').hide();
if (params.botFloorType == "черновой") $('#botFloorsDist_tr').show();

//тип кронштейна пристенного поручня
$("#sideHandrailHolders").closest("tr").hide();
if(staircaseHasUnit().sideHandrails) $("#sideHandrailHolders").closest("tr").show();
	

//увеличение высоты всех textarea так, чтобы весь текст был виден
$("textarea").each(function(){
	 if(this.scrollHeight > $(this).innerHeight()){
		$(this).innerHeight(this.scrollHeight)
		};
	});

//смещение лестницы от угла (костыль для старых заказов)
if($("#staircasePosZ").val() == -10 && $("#turnSide").val() == "левое"){
	$("#staircasePosZ").val(10);
	}


//ограждение на первом марше с 0 или 1 ступенью
if(params.calcType != "vhod"){
	if(params.stairAmt1 < 2 && params.railingSide_1 == "внутреннее") {
		$("#railingSide_1").val("нет");
		if(!testingMode) alertTrouble("При кол-ве ступеней в нижнем марше менее 2 не может быть установлено внутренне ограждение")
		}
	if(params.stairAmt1 < 2 && params.railingSide_1 == "две") {
		$("#railingSide_1").val("внешнее");
		if(!testingMode) alertTrouble("При кол-ве ступеней в нижнем марше менее 2 не может быть установлено внутренне ограждение")
		}
}
if(staircaseHasUnit().wndTreads){
	if(params.stairType == "пресснастил" ||
		params.stairType == "дпк" ||
		params.stairType == "лиственница тер."){
		if(!testingMode) alertTrouble("Невозможно изготовление забежных ступеней " + params.stairType);
		$("#stairType").val("нет");
	}
}

	//номер деревянных балясин и столбов
	
	if(isFinite(params.timberRackModel) && params.timberRackModel > 0 && params.timberRackModel < 10 && params.timberRackModel[0] != 0){
		$("#timberRackModel").val("0" + params.timberRackModel);
	}

	if(isFinite(params.timberBalModel) && params.timberBalModel > 0 && params.timberBalModel < 10  && params.timberBalModel[0] != 0){
		$("#timberBalModel").val("0" + params.timberBalModel);
	}
	
	//верхнее и нижнее окончание
	if(typeof getTimberBalParams == "function"){
		var balPar = getTimberBalParams(params.timberBalModel); //функция в файле /manufacturing/timber/drawRailing.js
		$("#timberBalTopEnd").val(balPar.topEnd)
		$("#timberBalBotEnd").val(balPar.botEnd)
		$("#timberBalType").val(balPar.type);
	}
	
	$(".startNewell").hide();
	if(params.startNewellType == "резной") $(".startNewell").show();
	

if(typeof setBanisterConnections != "undefined") setBanisterConnections(); //функция в файле changeFormBanister.js

getAllInputsValues(params);

//покраска
configPaintingInputs();

}//end of changeFormsGeneral


function replaceOldHandrails(par){

//переопределяем старые неактуальные опции
var handrailSelectId = par.handrailSelectId;
var hanrailProfId = par.hanrailProfId;
var sideSlotsId = par.sideSlotsId;
var handrail = $("#" + handrailSelectId).val();
var handrail_new = handrail;

if(handrail == "кованый полукруглый") handrail_new = "40х20 черн.";

if(handrail == "Ф50 сосна" || handrail == "50х50 сосна") {
	handrail_new = "сосна";
	$("#" + hanrailProfId).val("40х60 верт.");
	$("#" + sideSlotsId).val("нет");
	}
	
if(handrail == "омега-образный сосна") {
	handrail_new = "сосна";
	$("#" + hanrailProfId).val("40х60 гор.");
	$("#" + sideSlotsId).val("да");
	}
	
if(handrail == "40х60 береза") {
	handrail_new = "береза";
	$("#" + hanrailProfId).val("40х60 верт.");
	$("#" + sideSlotsId).val("нет");
	}	
	
if(handrail == "омега-образный дуб") {
	handrail_new = "дуб паркет.";
	$("#" + hanrailProfId).val("40х60 гор.");
	$("#" + sideSlotsId).val("да");
	}
	
if(handrail == "40х60 дуб" || handrail == "40х60 дуб с пазом") {
	handrail_new = "дуб паркет.";
	$("#" + hanrailProfId).val("40х60 верт.");
	$("#" + sideSlotsId).val("нет");
	}	

if(handrail_new != handrail){
	$("#" + handrailSelectId).val(handrail_new);
	if(!testingMode) alertTrouble('ВНИМАНИЕ! Поручень "'+ handrail + '" был заменен на "' + handrail_new + '"');
	params[handrailSelectId] = handrail_new;
	}

//материал поручня

if(handrail_new == "сосна") $("#handrailsMaterial").val("сосна экстра");
if(handrail_new == "береза") $("#handrailsMaterial").val("береза паркет.");
if(handrail_new == "лиственница") $("#handrailsMaterial").val("лиственница паркет.");
if(handrail_new == "дуб паркет.") $("#handrailsMaterial").val("дуб паркет.");
if(handrail_new == "дуб ц/л") $("#handrailsMaterial").val("дуб ц/л");


}//end of replaceOldHandrails

function setHandrailOptions(){
	//переопределяем старые неактуальные опции
	var handrailInputs = {
		handrailSelectId: "handrail",
		hanrailProfId: "handrailProf",
		sideSlotsId: "handrailSlots", 
		}
	replaceOldHandrails(handrailInputs);
	
	//параметры поручня
	var handrailPar = {
		prof: params.handrailProf,
		sideSlots: params.handrailSlots,
		handrailType: params.handrail,
		}
	handrailPar = calcHandrailMeterParams(handrailPar); //функция в файле priceLib.js

/*задаем массив доступных значений*/
var railingModel = params.railingModel;
var handRailCompatible = [1,2,3,4,5,6,9,10,11,12,13];
if (railingModel == "Кованые балясины" || railingModel == "Решетка") 
	handRailCompatible.push(15);
if (railingModel == "Самонесущее стекло"){
	if(params.handrailFixType == "паз") handRailCompatible = [1,7,8,10,11,12,13,14];
	handRailCompatible.push(15);
}
if (railingModel == "Реечные"){
	handRailCompatible.push(15);
}

if (railingModel == "Кресты") handRailCompatible.push(15);


	
if(railingModel == "Деревянные балясины" || railingModel == "Стекло" || railingModel == "Дерево с ковкой") {
	handRailCompatible = [1];
	var profCompatible = [1,2,3,4];
	if(railingModel == "Деревянные балясины") profCompatible = [4,5];
	showOptions('handrailProf', profCompatible);

}
	
if (params.calcType == "vhod" && params.staircaseType == "Готовая") handRailCompatible = [2,6,9];

if(params.calcType == "mono" && railingModel != "нет") {
	if(handRailCompatible.indexOf(15) != -1) handRailCompatible.splice(handRailCompatible.indexOf(15), 1);
	}
showOptions('handrail', handRailCompatible);


$('#handrailProf').closest("tr").hide();
$('#handrailSlots').closest("tr").hide();
$('#handrailEndType').closest("tr").hide();
//форма поручня
if(params.handrail == "сосна" ||
	params.handrail == "массив" ||
	params.handrail == "береза" ||
	params.handrail == "лиственница" ||
	params.handrail == "дуб паркет." ||
	params.handrail == "дуб ц/л" )
	{
		$('#handrailProf').closest("tr").show();
		$('#handrailSlots').closest("tr").show();
		$('#handrailEndType').closest("tr").show();		
		}

	$("#handrailConnectionType option[value='шарнир']").hide();
	if(params.handrail == "ПВХ" || params.handrail == "Ф50 нерж."){
		$("#handrailConnectionType option[value='шарнир']").show();
		if(params.handrail == "ПВХ") $("#handrailConnectionType").val('шарнир');
	}
	else {
		if($("#handrailConnectionType").val() == "шарнир") $("#handrailConnectionType").val("прямые");
	}
	
	//шарниры на круглых поручнях
	if(params.handrail == "Ф50 нерж." || params.handrail == "ПВХ"){
		params.handrailConnectionType = "шарнир";
		$("#handrailConnectionType").val(params.handrailConnectionType);
		}
	
	//цвет поручня пвх
	$("#handrailColor").closest("tr").hide();
	if(params.handrail == "ПВХ") $("#handrailColor").closest("tr").show();
	
	if(railingModel == "Деревянные балясины" || railingModel == "Стекло" || railingModel == "Дерево с ковкой") 
		$("#handrailEndHor").closest("tr").hide();
	
	//горизонтальный участок в конце
	$("#handrailEndHeight").closest("tr").hide();
	$("#handrailEndLen").closest("tr").hide();
	$("#topHandrailExtraLength").closest("tr").show();
	if(params.handrailEndHor == "да"){
		$("#handrailEndHeight").closest("tr").show();
		$("#handrailEndLen").closest("tr").show();
		$("#topHandrailExtraLength").closest("tr").hide();
		if(params.handrailConnectionType == "прямые") $("#handrailConnectionType").val("без зазора премиум");
	}
	
	//крепление паз невозможно для металлических поручней
	if(handrailPar.mat == 'metal' && 
		params.handrail != "Ф50 нерж. с пазом" && 
		params.handrail != "40х60 нерж. с пазом"){
			$("#handrailFixType").val("кронштейны");
		}
	
	if(params.handrailConnectionType == "без зазора" && !testingMode) {
		alertTrouble("Стыки Без зазора стандартные более не используются. Используются премиум стыки.")
		$("#handrailConnectionType").val("без зазора премиум")
	}
	
getAllInputsValues(params);

}//end of setHandrailOptions



/** функция скрывает/показывает инпуты, связанные с покрасокой и цветом каркаса, ограждений и балюстрады
*/

function configPaintingInputs(){


//материал ступеней
	if(params.stairType == "сосна кл.Б" ||
		params.stairType == "сосна экстра" ||
		params.stairType == "береза паркет." ||
		params.stairType == "лиственница паркет." ||
		params.stairType == "дуб паркет." ||
		params.stairType == "дуб ц/л"){
			$("#stairType").val("массив")
			$('tr[data-mat="timber"]').find(".Material").val(params.stairType);
			getAllInputsValues(params);
		}

//наличие покраски

	//наличие частей лестницы
	var isUnit = staircaseHasUnit();
	// console.log(isUnit)
	
	//показваем тип покраски металла каркаса если он есть
	$('#metalPaint').closest("tr").hide();
	if(isUnit.carcas || params.calcType == "vint" || params.calcType == "carport") {
		$('#metalPaint').closest("tr").show();
	}

	//показваем тип покраски металла ограждений если нет ограждений лестницы, но есть балюстрада
	$('#metalPaint_railing').closest("tr").hide();
	if(isUnit.railingMetalPaint || isUnit.balMetalPaint || params.calcType == "vint") {
		$('#metalPaint_railing').closest("tr").show();
	}

	//поверхность деревянных деталей, шпаклевка
	$("#surfaceType").closest("tr").hide();
	$("#fillerType").closest("tr").hide();
	if(params.timberPaint && params.timberPaint != "нет") {
		$("#surfaceType").closest("tr").show();
		$("#fillerType").closest("tr").show();
		if(params.surfaceType == "под пластик"){
			if(params.timberPaint.indexOf("патина") != -1) $("#surfaceType").val("фактурная");
			if(params.timberPaint.indexOf("масло") != -1) $("#surfaceType").val("фактурная");
		}
	}

	$("#handrailColor_bal").closest("tr").hide();
	if(params.handrail_bal == "ПВХ") $("#handrailColor_bal").closest("tr").show();

	if(params.calcType == "vint"){
		$("#handrailColor_tr").hide();
		if (params.handrailMaterial == "ПВХ")$("#handrailColor_tr").show();
		}
		
	
	//цвета и материалы
	getAllInputsValues(params);
	var hasUnit = staircaseHasUnit();

	$("#colorsFormTable tr").show();
	if(params.isCarcas == "нет" || params.metalPaint == "нет") $("#colorsFormTable #carcasParams").hide();
	if(params.stairType != "массив" &&
		params.stairType != "сосна кл.Б" &&
		params.stairType != "сосна экстра" &&
		params.stairType != "береза паркет." &&
		params.stairType != "лиственница паркет." &&
		params.stairType != "дуб паркет." &&
		params.stairType != "короб" &&
		params.stairType != "дуб ц/л"){
			$("#colorsFormTable #treadsParams").hide();
			$("#colorsFormTable #risersParams").hide(); //если нет деревянных ступеней, то деревянных подступенков тоже нет
		}

	//подступенки
	if(params.riserType != "есть" && params.topAnglePosition != "вертикальная рамка") $("#colorsFormTable #risersParams").hide();
	
	if(params.stairType == "нет") $("#colorsFormTable #risersParams").hide();
	
		
	if(!hasUnit.skirting) $("#colorsFormTable #skirtingParams").hide();
	//нет ограждений совсем
	if(!hasUnit.railing && !hasUnit.banister){
		$("#colorsFormTable #newellsParams").hide();
		$("#colorsFormTable #timberBalParams").hide();
		$("#colorsFormTable #metalBalParams").hide();
		$("#colorsFormTable #rigelsParams").hide();
	};
	//нет поручней совсем
	if(!hasUnit.railing && !hasUnit.banister && !hasUnit.sideHandrails){
		$("#colorsFormTable #handrailsParams").hide();
		$("#colorsFormTable #handrails_metParams").hide();
		$("#colorsFormTable #handrails_pvcParams").hide();
	} 

	var hasTimberHandrail = false;
	var hasMetalHandrail = false;
	var hasPvcHandrail = false;
	var hasRigels = false;
	var hasNewells = false;
	var hasTimberBal = false;
	var hasMetalBal = false;

	if(params.calcType == "timber" && params.stairModel == "Прямая") hasNewells = true;

	if(hasUnit.railing){
		if(params.railingModel == "Ригели") hasRigels = true;
		
		if(params.railingModel == "Деревянные балясины" || 
			params.railingModel == "Дерево с ковкой" ||
			params.railingModel == "Стекло"){
			hasNewells = true;
		}
		
		if(params.railingModel == "Деревянные балясины") hasTimberBal = true;
		if(	params.railingModel == "Ригели" ||
			params.railingModel == "Стекло на стойках" ||
			params.railingModel == "Экраны лазер"){
			if(params.banisterMaterial == "40х40 нерж+дуб") hasTimberBal = true;
			if(params.banisterMaterial == "40х40 черн.") hasMetalBal = true;
		}
		
		if(params.railingModel == "Дерево с ковкой") hasMetalBal = true;
		
		if(params.railingModel == "Кованые балясины") hasMetalBal = true;
		if(params.railingModel == "Реечные") {
			if(params.racksType == "массив" || params.racksType == "шпон") hasTimberBal = true;
			if(params.racksType == "металл") hasMetalBal = true;
		}
	}

	if(hasUnit.banister){
		if(params.railingModel_bal == "Ригели") hasRigels = true;
		
		if(params.railingModel_bal == "Деревянные балясины" || 
			params.railingModel_bal == "Дерево с ковкой" ||
			params.railingModel_bal == "Стекло"){
			hasNewells = true;
		}
		
		if(params.railingModel_bal == "Деревянные балясины") hasTimberBal = true;
		if(	params.railingModel_bal == "Ригели" ||
			params.railingModel_bal == "Стекло на стойках" ||
			params.railingModel_bal == "Экраны лазер"){
			if(params.banisterMaterial_bal == "40х40 нерж+дуб") hasTimberBal = true;
			if(params.banisterMaterial_bal == "40х40 черн.") hasMetalBal = true;
		}
		
		if(params.railingModel_bal == "Дерево с ковкой") hasMetalBal = true;
		
		if(params.railingModel_bal == "Кованые балясины") hasMetalBal = true;
		
			
	}

	//поручни
	if(hasNewells) hasTimberHandrail = true;

	if(hasUnit.railing || hasUnit.sideHandrails){
		//параметры поручня
		var handrailPar = {
			handrailType: params.handrail,
			}

		var handrailMat = calcHandrailMeterParams(handrailPar).mat;
		if(handrailMat == "timber" && params.handrail != "ПВХ") hasTimberHandrail = true;
		if(handrailMat == "metal" || handrailMat == "inox") hasMetalHandrail = true;
		if(params.handrail == "ПВХ") hasPvcHandrail = true;
	}

	if(hasUnit.banister){
		//параметры поручня
		var handrailPar = {
			handrailType: params.handrail_bal,
			}

		var handrailMat = calcHandrailMeterParams(handrailPar).mat;
		if(handrailMat == "timber" && params.handrail != "ПВХ") hasTimberHandrail = true;
		if(handrailMat == "metal" || handrailMat == "inox") hasMetalHandrail = true;
		if(params.handrail == "ПВХ") hasPvcHandrail = true;
	}

	if(!hasTimberHandrail) $("#colorsFormTable #handrailsParams").hide();
	if(!hasMetalHandrail) $("#colorsFormTable #handrails_metParams").hide();
	if(!hasPvcHandrail) $("#colorsFormTable #handrails_pvcParams").hide();
	if(!hasRigels) $("#colorsFormTable #rigelsParams").hide();
	if(!hasNewells) $("#colorsFormTable #newellsParams").hide();
	if(!hasTimberBal) $("#colorsFormTable #timberBalParams").hide();
	if(!hasMetalBal || params.metalPaint_railing == "нет") $("#colorsFormTable #metalBalParams").hide();
	if(params.calcType == "vint" && params.metalPaint == "порошок") $("#colorsFormTable #metalBalParams").show();
	if(params.calcType != "timber") $("#carcasMaterial").val("констр. сталь");

	$("#colors_inputs").show()
//	if($("#colorsFormTable tr:visible").length < 2) $("#colors_inputs").hide();

	//убираем стандартный цвет если есть комментарий
	$(".Comment").each(function(){
		if($(this).val()){
			$(this).closest("tr").find(".Color").val("см.комментарий");
		}
	})

	//нет накладок
	if(!hasUnit.stringerCovers){
		$("#colorsFormTable #stringerCoverParams").hide();
	} 
	
	//цвет покраски
	$(".lakColor").hide();
	$(".oilColor").hide();
	if(params.timberPaint == "морилка+лак" || params.timberPaint == "морилка+патина+лак") $(".lakColor").show();
	if(params.timberPaint == "цветное масло") $(".oilColor").show();
	
	//брашированная поверхность под масло
	if(params.timberPaint == "масло" || params.timberPaint == "цветное масло"){
		if(params.surfaceType != "брашированная") {
			alertTrouble("Покраска маслом возможна только для брашированной поверхности. Измените тип поверхности или выберите покраску лаком.", "forms", true)
		}
	}
	
	//совместимость лака и масла с разными породами породами
	if(params.timberPaint != "не указано" && params.timberPaint != "нет" && !testingMode && showPaintingAlerts){
		$('tr[data-mat="timber"]:visible').each(function(){
			var timberType = $(this).find(".Material").val();
			var partName =  $(this).find("td:first").text();
			if(timberType == "сосна кл.Б" || timberType == "сосна экстра" || timberType == "лиственница паркет."){
				if(params.surfaceType != "брашированная") {
					//alert(partName + ": Покраска выбранной породы дерева возможна только с брашированной поверхностью. Измените тип поверхности или выберите другую породу дерева.")
					alertTrouble(partName + ": Покраска выбранной породы дерева возможна только с брашированной поверхностью. Измените тип поверхности или выберите другую породу дерева.", "forms", true)
				}
				/*
				if(params.timberPaint == "лак" || params.timberPaint == "морилка+лак" || params.timberPaint == "морилка+патина+лак") {
					alertTrouble(partName + ": Покраска выбранной породы дерева возможна только маслом. Измените тип покраски или выберите другую породу дерева.")
					showPaintingAlerts = false;
				}
				*/
			}

			if(timberType == "береза паркет."){
				if(params.surfaceType == "брашированная") {
					alertTrouble(partName + ": Покраска березы возможна только гладкая. Измените тип поверхности или выберите другую породу дерева.", "forms", true)
					//showPaintingAlerts = false;
				}
				if(params.timberPaint == "масло" || params.timberPaint == "цветное масло") {
					alertTrouble(partName + ": Покраска березы маслом невозможна. Измените тип покраски или выберите другую породу дерева.", "forms", true)
					//showPaintingAlerts = false;
				}
			}

		})
	}
	
	//нет накладок
	if(!hasUnit.dopTimber){
		$("#colorsFormTable #additionalObjectsTimberParams").hide();
	}
	if(!hasUnit.dopMetal){
		$("#colorsFormTable #additionalObjectsMetalParams").hide();
	} 
	
}; //end of configPaintingInputs

/*функция возвращает ближайшие доступные параметры ступени из пресснастила
*/
function getPresTreadParams(b, M){
	var widthList = [240, 260, 270, 295, 305];
	var lengthList = [600, 800, 1000, 1200];
	var result = {};
	
	//ищем ближайшее большее
	for(var i=0; i<widthList.length; i++){
		if(widthList[i] >= b){
			result.width = widthList[i];
			break;
		}
	}
	if(!result.width) result.width = widthList[widthList.length-1];
	
	
	//ищем ближайшее меньшее
	for(var i=0; i<lengthList.length; i++){		
		if(widthList[i] > M){
			break;
		}
		result.length = widthList[i];
	}
	
	if(!result.length) result.length = widthList[0];
	
	return result;
}

/** функция устанавливает параметры ступеней в зависимости от типа*/

function setStairOption(){

	getAllInputsValues(params);
	
	/*рамки под ступенями*/
	var stairFrameOptions = document.getElementById('stairFrame').options;
	var frame;
	var stairTypeSelected = $("#stairType").val()

	frame = "2 варианта";
	if (params.model == "ко") frame = "только с рамками";
	if (stairTypeSelected == "рифленая сталь") frame = "только без рамок";
	if (stairTypeSelected == "рифленый алюминий") frame = "только с рамками";
	if (stairTypeSelected == "лотки") frame = "только без рамок";
	if (stairTypeSelected == "дпк") frame = "только с рамками";
	if (stairTypeSelected == "лиственница тер.") frame = "только с рамками";
	if (stairTypeSelected == "пресснастил") frame = "только без рамок";
	if (stairTypeSelected == "стекло") frame = "только с рамками";


	if (frame == "только с рамками") {
		stairFrameOptions[0].style.display = "none";
		stairFrameOptions[1].style.display = "block";
		setInputValue("stairFrame", "есть");
		}
	if (frame == "только без рамок") {
		stairFrameOptions[0].style.display = "block";
		stairFrameOptions[1].style.display = "none";
		//stairFrame[0].selected="true";
		}
	if (frame == "2 варианта") {
		stairFrameOptions[0].style.display = "block";
		stairFrameOptions[1].style.display = "block";
		//stairFrame[0].selected="true";
		}
		
	//ширина ступени
	$("#a1, #a2, #a3, #M").each(function(){
		var cell = $(this).closest("td");
		var id = this.id;

		if($(this).prop("tagName") == "INPUT" && $("#stairType").val() == "пресснастил"){
			var text = "<select id='" + id + "'>" + 
				"<option value='240'>240</option>" + 
				"<option value='260'>260</option>" + 
				"<option value='270'>270</option>" + 
				"<option value='295'>295</option>" + 
				"<option value='305'>305</option>" + 
			"</select>";
			if(id == "M"){
				var text = "<select id='" + id + "'>" + 
					"<option value='616'>616</option>" + 
					"<option value='816'>816</option>" + 
					"<option value='1016'>1016</option>" + 
					"<option value='1216'>1216</option>" + 
				"</select>";
				}
			cell.html(text);
			if(id == "M") $("#" + id).val(816);
			else $("#" + id).val(270);
		}
		if($(this).prop("tagName") == "SELECT" && $("#stairType").val() != "пресснастил"){
			var text = "<input id='" + this.id + "' type='number'>";
			cell.html(text);
			if(id == "M") $("#" + id).val(900);
			else {
				$("#a1").val(calcTreadWidth(params.b1));
				$("#a2").val(calcTreadWidth(params.b2));
				$("#a3").val(calcTreadWidth(params.b3));
			}
		}
	})
	
	if($("#stairType").val() != "лотки" && $("#stairType").val() != "нет"){
		if($("#treadThickness").val() < 30) $("#treadThickness").val(40);
		if($("#stairType").val() == "дпк") $("#treadThickness").val(20);
		if($("#stairType").val() == "лиственница тер.") $("#treadThickness").val(25);
		if($("#stairType").val() == "рифленая сталь") $("#treadThickness").val(4);
		if($("#stairType").val() == "рифленый алюминий") $("#treadThickness").val(4);
		if($("#stairType").val() == "пресснастил") $("#treadThickness").val(30);
		if($("#stairType").val() == "стекло") $("#treadThickness").val(30);
	}
	
	if(params.calcType == "console"){
		if($("#treadThickness").val() < 80) $("#treadThickness").val(80);
	}
	
	if(params.calcType == "bolz"){
		if($("#treadThickness").val() < 60) $("#treadThickness").val(60);
	}

	if ($('#stairType').val() == 'короб') {
		$("#treadThickness").val(20);
	}
	
} //end of setStairOption()

function addButtonDelete(id, countid){
	$('#'+id+' tr').each(function(i, v){
		var el = $(v);
		if(el.find('th').length == 0)
			el.append('<td><button class="delete" data-name="'+id+'" data-countid="'+countid+'">Удалить</button></td>');
		else el.append('<th>#</th>');
	});
}

function alertTrouble(message, type, noAlert){
	if(!type) type = "forms";
	
	if(type == "forms") $("#formsTroubles").append("<p>" + message + "<p>");
	if(type == "data") $("#dataTroubles").append("<p>" + message + "<p>");
	
	if (window.location.href.includes("customers")) noAlert = true;
	if(!testingMode && !noAlert) alert(message);

}

function fontLoadedCallback(){
	drawSceneDimensions();
}

function changeAllForms() {
	if($("#calcType").val() == "timber_stock"){
		setStockParams();
	}
	var calcType = $("#calcType").val();
	getAllInputsValues(params);
	changeFormsGeneral();
	if(typeof changeFormAssembling == 'function') changeFormAssembling();
	if(typeof changeFormBanisterConstruct == 'function' && params.calcType != 'railing') changeFormBanisterConstruct();
	
	if($("#calcType").val() != "vint" && $("#calcType").val() != "railing"){
		changeFormCarcas();
		if(typeof changeFormRailing == 'function') changeFormRailing();		
		if(typeof changeFormStartTreads == 'function') changeFormStartTreads();
		if(typeof changeGeometryForms == 'function') changeGeometryForms();
	}
	
	
	if($("#calcType").val() == "vint"){		
		changeFormVint();		
		$("#banisterСonstructFormWrap").show();
	}
	
	if($("#calcType").val() == "railing"){
		changeFormConcrete();
		changeFormRailing();
		changeFormTreads();
	}
	
	textureManager = getTextureMangerInstance()
	if (textureManager) {
		textureManager.updateMaterials();
	}
}
function configDinamicInputs() {
	
	if($("#calcType").val() == "railing") {
		addConcreteRows();
		addRailingRows();
		addRutelRows();		
	}
	else {
		if(typeof changeFormBanister == 'function') changeFormBanister();
		if(typeof changeFormTopFloor == 'function') changeFormTopFloor();
		changeAllForms();
		
	}
	
	addDimRows();
	if(typeof changeFormLedges == 'function') changeFormLedges();
}

/** функция используется для переиндексирования динамических таблиц параметров
*/
function reindexId(tableId){

	var group = $('#' + tableId + ' tbody tr'), amt = 0;
	//перебираем все строки таблицы
	$.each(group, function(i, val){
		var self = i, input = $(val).find('td input,select,textarea');
		if( $(val).find('.row_id').length > 0 ) {
			$(val).find('.row_id').attr("data-id", self - 1);
			$(val).find('.row_id').html(self - 1);
		}
		$(val).attr('data-id', self - 1);
		//перебираем элементы в строке
		$.each(input, function(i, val){
			var id = val.id.match(/^([^0-9]+)[0-9]+$/)[1];
			val.id = id+(self-1);
		});
		amt = i;
	});
	var counterId = $('#' + tableId).attr('data-counter')
	$("#" + counterId).val(amt);

};

