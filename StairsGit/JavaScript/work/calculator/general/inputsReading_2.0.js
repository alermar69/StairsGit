$(function () {

	$.urlParam = function (name) {
		var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
		if (results == null) {
			return null;
		}
		else {
			return decodeURIComponent(results[1]).replace(/\+/g, ' ') || 0;
		}
	}

	if ($.fancybox) {
		$.fancybox.defaults.btnTpl.rotate = '<button data-fancybox-rotate class="fancybox-button fancybox-button--rotate" title="Rotate">' +
			'<i class="fa fa-repeat"></i>' + 
		'</button>';
	}

	$('body').on('click', '[data-fancybox-rotate]', function() {
		var instance = $.fancybox.getInstance();
		var currentImageSrc = instance.current.src;
		$.ajax({
			url: '/orders/files/db/rotateImage.php',
			data: {
				img: currentImageSrc
			},
			dataType: 'json',
			success: function (result) {
				if(result.STATUS == 'SUCCESS'){
					var newImg = currentImageSrc.split("?")[0] + "?" + Math.random();
					instance.current.$image.attr('src', newImg);
					instance.current.$thumb.attr('src', newImg);
				}else{
					alert(result.MESSAGE);
				}
			},
			error: function (a, b) {
				alert(b);
			}
		});
	});

	$('#filterDiv').on('change', 'select, input', function(){
		if(window.history && window.history.pushState) {
			var mainForm = $(this).parents('#filterDiv');
			var urlParams = new URLSearchParams(window.location.search);
			var formData = {}
			$(mainForm).find('input, select').each(function(){
				urlParams.set(this.id, $(this).val());
				formData[this.id] = $(this).val();
			})
			history.pushState({}, '', window.location.pathname + "?" + urlParams.toString())

			if (window.localStorage) window.localStorage.setItem(getLocalStorageFilterPath(), JSON.stringify(formData))
		}
	});

	// Сначала загружаем данные из хранилища
	if (window.localStorage) {
		var item = window.localStorage.getItem(getLocalStorageFilterPath())
		if (item) {
			item = JSON.parse(item);
			Object.keys(item).forEach(function(key){
				if (key) $('#filterDiv #' + key).val(item[key]);
			})

			if (window.filterFormChange) filterFormChange();
		}
	}
	// Дополняем данными из url
	var urlParams = new URLSearchParams(window.location.search);
	urlParams.forEach(function(val, key){
		if (key){
			if ($('#filterDiv #' + key).length > 0) {
				$('#filterDiv #' + key).val(val);
			}
		}
	});
});

function getLocalStorageFilterPath(){
	var page_path = window.location.pathname.toLowerCase().replace(/^\//, '');
	page_path = page_path.replace(/\/$/, '');
	return "filter:" + page_path
}

/**
 * Функция озвращает значение в заданном промежутке
 */
function value_limit(val, min, max) {
	return val < min ? min : (val > max ? max : val);
}

/*функци¤ показывает/пр¤чет блок по id*/
function showHideDiv(id, speed) {
	var block = "#" + id;
	setTimeout(function () { $(block).slideToggle(speed) }, 200);
}

/*функци¤ получает значение пол¤ формы по id*/
function getInputValue(inputId) {
	var value; //возвращаемое значение
	var input = document.getElementById(inputId);

	if (input) {
		if (input.tagName == 'SPAN') value = input.innerHTML;
		if (input.tagName == "SELECT") {
			//value = input.options[input.selectedIndex].value;
			value = $(input).val();
			if (isFinite(value)) value *= 1.0;
		}
		if (input.tagName == "INPUT") {
			value = input.value;
			if (input.getAttribute("type") == "number") value = Number(value);
			if (input.getAttribute("type") == "checkbox") value = input.checked;
		}
		if (input.tagName == "TEXTAREA") value = input.value;
	}
	return (value);
	if (!input)
		return '';
}

/*функци¤ получает значени¤ всех инпутов на странице и записывает в объект*/

function getAllInputsValues(par) {
	$("input, select, textarea").each(function () {
		par[this.id] = getInputValue(this.id);
		if (window.isMulti && params.priceItems) {
			var priceItem = getArrItemByProp(params.priceItems, 'id', currentPriceItem);
			if (priceItem && !isMultiLoading) {
				priceItem.params[this.id] = getInputValue(this.id);
			}
		}
	})
}


/*функция устанавливает значение пол¤ формы по id*/
function setInputValue(selectId, value) {
	var input = document.getElementById(selectId);
	if (input) {
		if (input.tagName == "SELECT") {
			var options = input.options;
			for (var i = 0; i < options.length; i++) {
				if (options[i].value == value) options[i].selected = true;
			}
		}
		if (input.tagName == "INPUT") input.value = value;
		if (input.tagName == "TEXTAREA") input.value = value;
	}
}

/*функция устанавливает значение пол¤ формы по id*/
function setInputValue2(par) {
	var el = $(par.selector);
	var setVal = true; //устанавливать ли значение инпута
	if (el.length > 0) {
		if(el[0].tagName == 'SELECT'){
			//проверяем, есть ли такое значение в селекте
			var sel = el.find('option[value="'+par.value+'"]');
			if(sel.length == 0) setVal = false; //оставляем по умолчанию
		}
		if(el.attr('type') == 'radio'  || el.attr('type') == 'checkbox'){
			el.prop('checked', par.value);
			setVal = false;
		}
		if(setVal) el.val(par.value);
	}
}

/*Функция показывает в input type=select опции, номера которых
	содержатся в массиве compatibleOptions*/
function showOptions(selectId, compatibleOptions) {
	if(!compatibleOptions) return;
	if(!$("#" + selectId).length) return;
	var options = document.getElementById(selectId).options;
	var i;
	var j;
	for (i = 0; i < options.length; i++) {
		//if (compatibleOptions[0] == (i+1)) selectId[i].selected = "true";
		options[i].style.display = "none";
		for (j = 0; j < compatibleOptions.length; j++)
			if (compatibleOptions[j] == (i + 1)) {
				options[i].style.display = "block";
			}
	}
	var selectedIndex = document.getElementById(selectId).selectedIndex + 1;
	//если выбранная опция не совместима, выбираем первую совместимую опцию
	if (compatibleOptions.indexOf(selectedIndex) == -1 && options[compatibleOptions[0] - 1])
		options[compatibleOptions[0] - 1].selected = "true";
}

/**функция возвращает параметры марша по номеру марша
*/
function getMarshParams(marshId) {

	if (!marshId) marshId = 1
	
	if (marshId < 1) marshId = 1;
	if (marshId > 3) marshId = 3;
	var par = {marshId: marshId};
	if (marshId == 1) {
		par.a = params.a1 * 1.0;
		par.b = params.b1;
		par.h = params.h1;
		par.stairAmt = params.stairAmt1;
		par.railingSide = params.railingSide_1;
		par.skirtingSide = params.skirting_1;
		par.sideHandrailSide = params.handrailSide_1;
		par.stringerCover = params.stringerCover_1;
	}
	if (marshId == 2) {
		par.a = params.a2 * 1.0;
		par.b = params.b2;
		par.h = params.h2;
		par.stairAmt = params.stairAmt2;
		par.railingSide = params.railingSide_2;
		par.skirtingSide = params.skirting_2;
		par.sideHandrailSide = params.handrailSide_2;
		if (params.stairModel == "П-образная с забегом") {
			par.h = params.h3;
			par.stairAmt = 0;
		}
		par.stringerCover = params.stringerCover_2;
	}
	if (marshId == 3) {
		par.a = params.a3 * 1.0;
		par.b = params.b3;
		par.h = params.h3;
		par.stairAmt = params.stairAmt3;
		par.railingSide = params.railingSide_3;
		par.skirtingSide = params.skirting_3;
		par.sideHandrailSide = params.handrailSide_3;
		par.stringerCover = params.stringerCover_3;
	}

	par.marshName = 'нижний';

	par.nose = par.a - par.b;

	//наличие промежуточного косоура
	par.isMiddleStringer = false;
	if (params.M > 1100) {
		if (params.calcType == "vhod") par.isMiddleStringer = true;
		if (params.calcType == "veranda") par.isMiddleStringer = true;
	}

	//является ли текущий марш последним
	par.lastMarsh = false;
	if (marshId == 3) par.lastMarsh = true;
	if (params.stairModel == "Прямая" && marshId == 1) par.lastMarsh = true;

	//подъем ступени на забеге
	par.h_botWnd = params.h3;
	par.h_topWnd = params.h3;
	if (params.stairModel == "П-образная трехмаршевая") {
		if (marshId == 1) par.h_topWnd = params.h2;
		if (marshId == 2) par.h_botWnd = params.h2;
	}

	if (marshId == 1) {
		par.botTurn = "пол";
		par.topTurn = "площадка";
		if (params.stairModel == "Прямая" && params.platformTop == "нет") par.topTurn = "пол";
		if (params.stairModel == "Г-образная с забегом") par.topTurn = "забег";
		if (params.stairModel == "П-образная с забегом") par.topTurn = "забег";
		if (params.stairModel == "П-образная трехмаршевая" && params.turnType_1 == "забег") par.topTurn = "забег";
	}

	if (marshId == 2) {
		par.botTurn = params.turnType_1;
		par.topTurn = params.turnType_2;
		if (params.stairModel == "П-образная с забегом") {
			par.botTurn = "забег";
			par.topTurn = "забег";
		}
		if (params.stairModel == "П-образная с площадкой") {
			par.botTurn = "площадка";
			par.topTurn = "площадка";
		}

		par.marshName = 'средний';
	}

	if (marshId == 3) {
		par.topTurn = "пол";
		par.botTurn = "площадка";
		if (params.stairModel == "Г-образная с забегом") par.botTurn = "забег";
		if (params.stairModel == "П-образная с забегом") par.botTurn = "забег";
		if (params.stairModel == "П-образная трехмаршевая" && params.turnType_2 == "забег") par.botTurn = "забег";
		if (params.platformTop != "нет") par.topTurn = "площадка";

		par.marshName = 'верхний';
	}

	par.nextMarshId = 3;
	if (params.stairModel == "П-образная трехмаршевая" && marshId == 1) par.nextMarshId = 2;

	par.prevMarshId = 1;
	if (params.stairModel == "П-образная трехмаршевая" && marshId == 3) par.prevMarshId = 2;

	if (params.calcType == 'vint') {
		par.botTurn = "пол";
		par.topTurn = "пол";
	}

	//угол наклона марша
	par.ang = Math.atan(par.h / par.b);

	//наличие ограждений на внешней и на внутренней стороне
	par.hasRailing = {
		in: false,
		out: false,
	}
	if (par.railingSide == "внешнее" || par.railingSide == "две") par.hasRailing.out = true;
	if ((par.railingSide == "внутреннее" || par.railingSide == "две") && par.stairAmt != 0) par.hasRailing.in = true;

	//заднее ограждение забега или площадки П-образной
	if (params.stairModel == "П-образная с забегом" || params.stairModel == "П-образная с площадкой") {
		if (marshId == 2 && params.backRailing_2 == "есть") par.hasRailing.out = true;
		if (marshId == 2) par.hasRailing.in = false;
	}

	//наличие ограждения на верхней площадке
	par.hasTopPltRailing = {
		in: false,
		out: false,
	}

	if (par.lastMarsh && params.platformTop != "нет") {
		par.hasTopPltRailing = {
			in: getTopPltRailing().in,
			out: getTopPltRailing().out,
		}
	}

	//наличие ограждения к балюстраде, если в верхнем марше 0 ступеней
	par.hasTopBalRailing = {
		in: false,
		out: false,
	}

	if (par.lastMarsh && params.platformTop == "нет" && par.stairAmt == 0 && par.botTurn == "забег") {
		par.hasTopBalRailing = {
			in: false,
			out: false,
		}
		if (par.railingSide == "внутреннее" || par.railingSide == "две") par.hasTopBalRailing.in = true;
		if (par.railingSide == "внешнее" || par.railingSide == "две") par.hasTopBalRailing.out = true;
	}

	//наличие пристенного поручня на внешней и внутренней стороне
	par.hasSideHandrail = {
		in: false,
		out: false,
	}
	if (par.sideHandrailSide == "внешнее" || par.sideHandrailSide == "две") par.hasSideHandrail.out = true;
	if ((par.sideHandrailSide == "внутреннее" || par.sideHandrailSide == "две") && par.stairAmt != 0) par.hasSideHandrail.in = true;


	//наличие плинтуса на внешней и на внутренней стороне
	par.hasSkirting = {
		in: false,
		out: false,
	}
	if (params.riserType == "есть") {
		if (par.skirtingSide == "внешнее" || par.skirtingSide == "две") par.hasSkirting.out = true;
		if (par.skirtingSide == "внутреннее" || par.skirtingSide == "две") par.hasSkirting.in = true;
		if (marshId == 2 && params.stairModel == "П-образная с забегом") {
			if (params.skirting_wnd == "есть") par.hasSkirting.out = true;
		}
	}

	//наличие накладки на внешней и на внутренней стороне
	par.hasStringerCover = {
		in: false,
		out: false,
	}
	if (par.stringerCover == "внешняя" || par.stringerCover == "две") par.hasStringerCover.out = true;
	if ((par.stringerCover == "внутренняя" || par.stringerCover == "две")) par.hasStringerCover.in = true;


	//какая сторона правая, какая левая
	par.side = {
		in: "right",
		out: "left",
	}
	if (params.turnSide == "левое") {
		par.side = {
			in: "left",
			out: "right",
		}
	}
	if (params.stairModel == "Прямая") {
		var temp = par.side.in;
		par.side.in = par.side.out;
		par.side.out = temp;
	}

	par.len = par.b * par.stairAmt;
	par.height = par.h * par.stairAmt;

	//наличие креплений к стене
	var wallFix = {
		in: false,
		out: false,
	}

	//стена №1
	if (params.fixPart3 != "нет" && params.fixPart3 != "не указано") {
		if (params.stairModel == "Прямая") wallFix.in = true;
		if (params.stairModel != "Прямая" && marshId == 3) wallFix.out = true;
	}

	//стена №2
	if (params.fixPart4 != "нет" && params.fixPart4 != "не указано") {
		if (params.stairModel == "Прямая") wallFix.out = true;
		if ((params.stairModel == "Г-образная с забегом" || params.stairModel == "Г-образная с площадкой") && marshId == 3) wallFix.in = true;
		if ((params.stairModel == "П-образная с забегом" || params.stairModel == "П-образная с площадкой" || params.stairModel == "П-образная трехмаршевая") && marshId == 1) wallFix.out = true;
	}

	//стена №3
	if (params.fixPart5 != "нет" && params.fixPart5 != "не указано") {
		if ((params.stairModel == "Г-образная с забегом" || params.stairModel == "Г-образная с площадкой") && marshId == 1) wallFix.in = true;
	}

	//стена №4
	if (params.fixPart6 != "нет" && params.fixPart6 != "не указано") {
		if ((params.stairModel == "Г-образная с забегом" || params.stairModel == "Г-образная с площадкой") && marshId == 1) wallFix.out = true;
		if ((params.stairModel == "П-образная с забегом" || params.stairModel == "П-образная с площадкой" || params.stairModel == "П-образная трехмаршевая") && marshId == 2) wallFix.out = true;
	}
	par.wallFix = wallFix;
	
	var ang = Math.round(par.ang / Math.PI * 180)
	var angCheckText = "<span class='green'>ОК</span>";
	if(ang > 50 || ang < 30) angCheckText = "<span class='red'>неудобно</span>";
	
	var stepCheckText = "<span class='green'>ОК</span>";
	if(par.b > 300 || par.b < 200) stepCheckText = ""//"<span class='red'>неудобно</span>";
	
	var riseCheckText = "<span class='green'>ОК</span>";
	if(par.h > 220 || par.h < 150) riseCheckText = ""//"<span class='red'>неудобно</span>";
	
	var stepSum = Math.round(2 * par.h + par.b);
	var stepSumCheckText = "<span class='green'>ОК</span>";
	if(stepSum > 640 || stepSum < 600) stepSumCheckText = ""//"<span class='red'>неудобно</span>";
	
	par.text = 
		"<table class='form_table' style='width: 100%;'><tbody>\
			<tr><th>Параметр</th><th>Значение</th><th>Норма</th><th>Результат</th></tr>\
			<tr>\
				<td>Угол наклона марша</td>\
				<td>" + ang + " гр.</td>\
				<td>30-50 гр.</td>\
				<td>" + angCheckText + "</td>\
			</tr>\
			<tr>\
				<td>Ширина проступи b</td>\
				<td>" + Math.round(par.b) + " мм</td>\
				<td>200 - 300 мм</td>\
				<td>" + stepCheckText + "</td>\
			</tr>\
			<tr>\
				<td>Подъем ступени h</td>\
				<td>" + Math.round(par.h) + " мм</td>\
				<td>150 - 220 мм</td>\
				<td>" + riseCheckText + "</td>\
			</tr>\
			<tr>\
				<td>Шаг 2h + b</td>\
				<td>" + Math.round(stepSum) + " мм</td>\
				<td>600 - 640 мм</td>\
				<td>" + stepSumCheckText + "</td>\
			</tr>\
		</tbody></table>";
	return par;
} //end of getMarshParam
function getTopPltRailing() {
	var par = {
		in: params.topPltRailing_4,
		out: params.topPltRailing_3,
		rear: params.topPltRailing_5,
		front: params.topPltRailing_6,
	}

	if (params.turnSide == "левое") {
		par = {
			in: params.topPltRailing_3,
			out: params.topPltRailing_4,
		}
	}

	if (params.platformTop == 'увеличенная') {
		if (params.turnSide == "правое") {
			par = {
				out: params.topPltRailing_3,
				in: false,
			}
		}
		if (params.turnSide == "левое") {
			par = {
				out: params.topPltRailing_3,
				in: false,
			}
		}
	}

	if (params.stairModel == "Прямая") {
		var temp = par.in;
		par.in = par.out;
		par.out = temp;
	}


	par.side = params.topPltRailing_4; //боковое ограждение увеличенной площадки

	return par;
}

/** функция возвращает наличие основных элементов на лестнице: ступеней, ограждений, балюстрады и т.п.
*/

function staircaseHasUnit() {

	var par = {
		carcas: false,
		treads: false,
		risers: false,
		skirting: false,
		railing: false,
		banister: false,
		sideHandrails: false,
		carcasMetalPaint: false,
		carcasTimberPaint: false,
		railingMetalPaint: false,
		railingTimberPaint: false,
		balMetalPaint: false,
		balTimberPaint: false,
		handrail: false,
		handrail_bal: false,
		wndTreads: false,
		stringerCovers: false,
		dopTimber: false,
		dopMetal: false,
		timberNewells: false,
	}
	if(params.calcType == 'cnc') return par
	var marshPar_1 = getMarshParams(1);
	var marshPar_2 = getMarshParams(2);
	var marshPar_3 = getMarshParams(3);

	//каркас
	if (params.isCarcas == "есть" || params.calcType == "vint") par.carcas = true;

	//ступени
	if (params.calcType == "timber" || params.calcType == "timber_stock") params.stairType = "массив"
	if (params.stairType != "нет") par.treads = true;

	//подступенки
	if(params.riserType != "нет") par.risers = true;

	//плинтус
	if (params.skirting_1 && params.skirting_1 != "нет") par.skirting = true;
	if (params.skirting_3 && params.stairModel != "Прямая" && params.skirting_3 != "нет") par.skirting = true;
	if (params.skirting_2 && params.stairModel != "П-образная трехмаршевая" && params.skirting_2 != "нет") par.skirting = true;
	if (params.calcType == 'railing') {
		$(".concreteParRow").each(function(){
			if($(this).find(".skirtingType").val() != "нет") par.skirting = true;
		})
	}

	//ограждения
	if (params.railingSide_1 != "нет") par.railing = true;
	if (params.stairModel != "Прямая" && params.railingSide_3 != "нет") par.railing = true;
	if (params.stairModel == "П-образная трехмаршевая" && params.railingSide_2 != "нет") par.railing = true;
	if (params.platformTop != "нет" && params.topPltRailing_5) par.railing = true;
	if (params.stairModel == "П-образная с площадкой" && params.backRailing_1 != "нет") par.railing = true;
	if (params.stairModel == "П-образная с забегом" && params.backRailing_2 != "нет") par.railing = true;
	if (params.calcType == "vint") par.railing = true;
	if (params.calcType == "railing") {
		par.railing = false;
		if(params.railingSectAmt > 0) par.railing = true;		
	}

	//балюстрада
	if (params.banisterSectionAmt > 0) par.banister = true;

	//пристенный поручень
	par.sideHandrails = false;
	if (params.handrailSide_1 != "нет") par.sideHandrails = true;
	if (params.stairModel == "П-образная трехмаршевая" && params.handrailSide_2 != "нет") par.sideHandrails = true;
	if (params.stairModel != "Прямая" && params.handrailSide_3 != "нет") par.sideHandrails = true;
	if (params.stairModel == "П-образная с площадкой" && params.backHandrail_1 != "нет") par.sideHandrails = true;
	if (params.stairModel == "П-образная с забегом" && params.backHandrail_2 != "нет") par.sideHandrails = true;
	if (params.calcType == "railing") par.sideHandrails = false;
	
	//наличие поручней на ограждениях или пристенных
	par.handrail = false;
	if ((par.railing && params.handrail != "нет") || par.sideHandrails) par.handrail = true;

	//наличие окрашиваемых металлических деталей каркаса
	if (params.calcType != "timber" && params.model != "нет") par.carcasMetalPaint = true;

	//наличие окрашиваемых деревянных деталей
	if (params.stairType == "массив" ||
		params.stairType == "сосна кл.Б" ||
		params.stairType == "сосна экстра" ||
		params.stairType == "береза паркет." ||
		params.stairType == "дуб паркет." ||
		params.stairType == "лиственница паркет." ||
		params.stairType == "лиственница тер." ||
		params.stairType == "короб" ||
		params.stairType == "дуб ц/л") par.carcasTimberPaint = true;

	//винтовая
	if (params.treadMaterial == "береза паркет." ||
		params.treadMaterial == "дуб паркет." ||
		params.treadMaterial == "дуб ц/л" ||
		params.handrailMaterial == "Дуб" ||
		params.botFlanCover == "есть"
	) par.carcasTimberPaint = true;


	//наличие окрашиваемых металлических деталей ограждений

	if (par.railing) {
		if (params.railingModel == "Кованые балясины" ||
			params.railingModel == "Решетка" ||
			params.railingModel == "Дерево с ковкой" ||
			params.railingModel == "Кресты" ||
			params.railingModel == "Экраны лазер") par.railingMetalPaint = true;

		if (params.railingModel == "Ригели" || params.railingModel == "Стекло на стойках") {
			if (params.banisterMaterial == "40х40 черн.") par.railingMetalPaint = true;
		}
		if (params.railingModel == "Ригели" && params.rigelMaterial == "20х20 черн.")
			par.railingMetalPaint = true;
		if (params.railingModel == "Реечные" && params.racksType == "металл")
			par.railingMetalPaint = true;
	}
	if (params.calcType == "vint") par.railingMetalPaint = true;

	if (par.handrail) {
		if (params.handrail == "40х20 черн." ||
			params.handrail == "40х40 черн." ||
			params.handrail == "60х30 черн." ||
			params.handrail == "кованый полукруглый") par.railingMetalPaint = true;
	}

	//наличие окрашиваемых деревянных деталей ограждений

	if (par.railing) {
		if (params.railingModel == "Деревянные балясины" || params.railingModel == "Дерево с ковкой" || params.railingModel == "Стекло") {
			par.railingTimberPaint = true;
			par.timberNewells = true;
		}
		if (params.railingModel == "Стекло") par.railingTimberPaint = true;
		if (params.railingModel == "Ригели" || params.railingModel == "Стекло на стойках") {
			if (params.banisterMaterial == "40х40 нерж+дуб") par.railingTimberPaint = true;
		}
		if (params.railingModel == "Реечные" && (params.racksType == "массив" || params.racksType == "шпон"))
			par.railingMetalPaint = true;
	}
	
	//параметры ограждений в модуле railing
	if (params.calcType == 'railing') {
		$(".sectParams").each(function(){
			var hasMetalTypes = ["Ригели", "Стекло на стойках", "Экраны лазер", "Решетка", "Дерево с ковкой"];
			var hasTimberNewels = ["Дерево с ковкой", "Стекло"];
			if(hasMetalTypes.indexOf($(this).find(".railingType").val()) != -1) par.railingMetalPaint = true;
			if(hasTimberNewels.indexOf($(this).find(".railingType").val()) != -1) par.timberNewells = true;
		})
	}

	if (par.handrail) {
		if (params.handrail == "сосна" ||
			params.handrail == "береза" ||
			params.handrail == "лиственница" ||
			params.handrail == "дуб паркет." ||
			params.handrail == "дуб ц/л" ||
			params.handrail == "Ф50 сосна" ||
			params.handrail == "омега-образный сосна" ||
			params.handrail == "50х50 сосна" ||
			params.handrail == "40х60 береза" ||
			params.handrail == "омега-образный дуб" ||
			params.handrail == "40х60 дуб" ||
			params.handrail == "40х60 дуб с пазом") par.railingTimberPaint = true;
	}


	//поручни балюстрады
	if (par.banister) {
		if (params.handrail_bal != "нет") par.handrail_bal = true;

		//наличие окрашиваемых металлических деталей балюстрады
		if (params.railingModel_bal == "Кованые балясины" ||
			params.railingModel_bal == "Решетка" ||
			params.railingModel_bal == "Экраны лазер") par.balMetalPaint = true;

		if (params.railingModel_bal == "Ригели" || params.railingModel_bal == "Стекло на стойках") {
			if (params.banisterMaterial_bal == "40х40 черн.") par.balMetalPaint = true;
		}
		if (params.railingModel_bal == "Ригели" && params.rigelMaterial_bal == "20х20 черн.") par.balMetalPaint = true;

		if (params.handrail_bal == "40х20 черн." ||
			params.handrail_bal == "40х40 черн." ||
			params.handrail_bal == "60х30 черн." ||
			params.handrail_bal == "кованый полукруглый") par.balMetalPaint = true;

		//наличие окрашиваемых деревянных деталей балюстрады
		if (
			params.handrail_bal == "сосна" ||
			params.handrail_bal == "береза" ||
			params.handrail_bal == "лиственница" ||
			params.handrail_bal == "дуб паркет." ||
			params.handrail_bal == "дуб ц/л" ||
			params.banisterMaterial_bal == "40х40 нерж+дуб"
		) par.balTimberPaint = true;
		
		if (params.railingModel_bal == "Деревянные балясины" || params.railingModel_bal == "Дерево с ковкой" || params.railingModel_bal == "Стекло") {
			par.balTimberPaint = true;
			par.timberNewells = true;
		}
		
		if (params.banisterSectionAmt == 0) par.balTimberPaint = false;
		
	}

	//наличие забежных ступеней
	if (params.calcType == "vint" ||
		params.stairModel == "Г-образная с забегом" ||
		params.stairModel == "П-образная с забегом") par.wndTreads = true;

	if (params.stairModel == "П-образная трехмаршевая" && (params.turnType_1 == "забег" || params.turnType_2 == "забег")) par.wndTreads = true;

	//накладки каркаса
	if (params.stringerCover_1 != 'нет') par.stringerCovers = true;
	if (params.stringerCover_3 && params.stairModel != "Прямая" && params.stringerCover_3 != "нет") par.stringerCovers = true;
	if (params.stringerCover_2 && params.stairModel != "П-образная трехмаршевая" && params.stringerCover_2 != "нет") par.stringerCovers = true;

	if (params.calcType == 'carport') {
		par = {
			carportCarcas: true,
			carportRoof: true
		}
	}
	if (params.calcType == 'coupe') {
		par.dopTimber = true;
	}
	
	//деревянные и металлические детали доп. объектов
	if(typeof additional_objects != "undefined"){
		$.each(additional_objects, function(){
			if(this.calc_price){
				if(this.className == "RackWall"){
					par.dopTimber = true;
					if(this.meshParams.material == "металл") par.dopMetal = true;
				}
				if (this.className == "Shelf") {
					par.dopTimber = true;
					par.dopMetal = true;
				}
				if (this.className == "Wardrobe") {
					par.dopTimber = true;
				}
				if(this.className == "MetalPlatform" || this.className == "Column" || this.className == "Canopy"){
					par.dopMetal = true;
				}
				if (this.className == "Canopy") {
					par.dopMetal = true;
				}
				if (this.className == "Sill") {
					par.dopTimber = true;
				}
				if (this.className == "Table") {
					par.dopTimber = true;
					par.dopMetal = true;
				}
			}
		})
	}
	if(par.dopMetal) par.carcasMetalPaint = true;

	return par;

}; //end of staircaseHasUnit

function staircaseHasMat() {

	var par = {
		steel: false,
		timber: false,
		glass8: false,
		glass12: false,
		bolts: false,
		metalPaint: false,
		timberPaint: false,
	};
	
	/*
	var list = ["metal", "mono", "bolz", "console", "vint", "vhod", "timber_stock", "railing", "fire_2"];
	if(list.indexOf(params.calcType) != -1) 
	*/
	
	//металл
	/*
	var list = ["metal", "mono", "bolz", "console", "vint", "vhod", "timber_stock", "railing", "fire_2"];
	if(list.indexOf(params.calcType) != -1) {}
	*/
	
	var units = staircaseHasUnit();
	
	//стекло
	var railingsWithGlass = [
		"Стекло на стойках",
		"Самонесущее стекло",
		"Стекло",
		];
	
	if(units.railing){
		if(params.railingModel == "Самонесущее стекло") par.glass12 = true;
		if(params.railingModel == "Стекло на стойках" || params.railingModel == "Стекло") par.glass8 = true;
	}
	if(units.banister){
		if(params.railingModel_bal == "Самонесущее стекло") par.glass12 = true;
		if(params.railingModel_bal == "Стекло на стойках" || params.railingModel_bal == "Стекло") par.glass8 = true;
	}

	//покраска металла
	par.metalPaint = units.carcasMetalPaint || 
		units.railingMetalPaint || 
		units.balMetalPaint;
	
	//покраска дерева
	par.metalPaint = units.carcasTimberPaint || 
		units.railingTimberPaint || 
		units.balTimberPaint;
	

	return par;
	
};

/** функция возвращает параметры устройства пользователя
*/
function getUserDevicePar() {
	var par = {};

	par.isTouchDevice = !!('ontouchstart' in window);

	//является ли устройство мобилой
	par.isMobile = par.isTouchDevice;

	return par;


}

/** функция возвращает количество и парамеры поворотов лестницы */
function getTurnPar(){
	var wndTurnAmt = 0;
	var pltTurnAmt = 0
	
	if(params.stairModel == "Г-образная с площадкой" || 
		params.stairModel == "П-образная с площадкой" || 
		params.stairModel == "Прямая с промежуточной площадкой" || 
		params.stairModel == "Прямая горка"){
			pltTurnAmt = 1;
	}	
	if(params.stairModel == "Г-образная с забегом"){
		wndTurnAmt = 1;
	}
	if(params.stairModel == "П-образная с забегом"){
		wndTurnAmt = 2;
	}
	if (params.stairModel == "П-образная трехмаршевая") {
		if (params.turnType_1 == "забег") {
			wndTurnAmt += 1;				
		}
		if (params.turnType_1 == "площадка") {
			pltTurnAmt = 1;
		}
		if (params.turnType_2 == "забег") {
			wndTurnAmt += 1;			
		}
		if (params.turnType_2 == "площадка") {
			pltTurnAmt = 1;
		}			
	}
	
	var countWndTread = 3; //кол-во забежных ступеней на поворот 90гр
	if(params.model == "гнутый") countWndTread = params.countWndTread;
	
	var wndTreadAmt = countWndTread * wndTurnAmt;
	var wndRiserAmt = (countWndTread - 1) * wndTurnAmt;
	var pltAmt = pltTurnAmt;
	var riserAmt = pltTurnAmt + wndTurnAmt;
	
	var result = {
		wndTurnAmt: wndTurnAmt,
		pltTurnAmt: pltTurnAmt,
		countWndTread: countWndTread,
		wndTreadAmt: wndTreadAmt,
		wndRiserAmt: wndRiserAmt,
		pltAmt: pltAmt,
		riserAmt: riserAmt,
	}
	
	return result;
}

function formatDate(date, format){

	var dateString = date;
	if(!date) return "";
	if (date == 'Invalid Date') return "";
	
	//если просто строка, то преобразуем в js дату
	if(typeof date == "string"){
		date = new Date(date);
	}
	// Поддержка IOS
	if (date == 'Invalid Date' && dateString != 'Invalid Date') {
		date = new Date(dateString.replace(/-/g, "/"));
	}
	//js дата
	if(date.getDate){
		var dateString = date.getDate();
		if(date.getDate() < 10) dateString = "0" + dateString;
		if(date.getMonth() < 9) dateString += ".0" + (date.getMonth() + 1);
		if(date.getMonth() >= 9) dateString += "." + (date.getMonth() + 1);
		dateString += "." + (date.getFullYear() - 2000);
			
		if(format == "yyyy-MM-dd"){
			var dateString = date.getFullYear();
			if(date.getMonth() < 9) dateString += "-0" + (date.getMonth() + 1);
			if(date.getMonth() >= 9) dateString += "-" + (date.getMonth() + 1);			
			if(date.getDate() < 10) dateString += "-0" + date.getDate();
			if(date.getDate() >= 10) dateString += "-" + date.getDate();
			}
			
		if(format == "dd.MM" || format == "dd.MM_wd"){			
			var dateString = "";
			if(date.getDate() < 10) dateString += "0" + date.getDate();
			if(date.getDate() >= 10) dateString += date.getDate();
			if(date.getMonth() < 9) dateString += ".0" + (date.getMonth() + 1);
			if(date.getMonth() >= 9) dateString += "." + (date.getMonth() + 1);		
		}
		if(format == "dd.MM.yy"){
			var dateString = "";
			if(date.getDate() < 10) dateString += "0" + date.getDate();
			if(date.getDate() >= 10) dateString += date.getDate();
			if(date.getMonth() < 9) dateString += ".0" + (date.getMonth() + 1);
			if(date.getMonth() >= 9) dateString += "." + (date.getMonth() + 1);	
			var year = date.getFullYear() - 2000;
			if(year < 9) dateString += ".0" + year;
			if(year >= 9) dateString += "." + year;
			}
		if(format == "dd.MM_hh.mm") {
			var dateString = "";
			if(date.getDate() < 10) dateString += "0" + date.getDate();
			if(date.getDate() >= 10) dateString += date.getDate();
			if(date.getMonth() < 9) dateString += ".0" + (date.getMonth() + 1);
			if(date.getMonth() >= 9) dateString += "." + (date.getMonth() + 1);	
			dateString += " - " + date.getHours() + ":" + date.getMinutes()
			}
		if(format == "dd.MM.yy_hh.mm"){
			var dateString = "";
			if(date.getDate() < 10) dateString += "0" + date.getDate();
			if(date.getDate() >= 10) dateString += date.getDate();
			if(date.getMonth() < 9) dateString += ".0" + (date.getMonth() + 1);
			if(date.getMonth() >= 9) dateString += "." + (date.getMonth() + 1);	
			var year = date.getFullYear();
			dateString += "." + (year - 2000);
			dateString += " - " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
		}
		if(format == "dd.MM_wd"){			
			dateString += " ";
			if(date.getDay() == 1) dateString += "пн";
			if(date.getDay() == 2) dateString += "вт";
			if(date.getDay() == 3) dateString += "ср";
			if(date.getDay() == 4) dateString += "чт";
			if(date.getDay() == 5) dateString += "пт";
			if(date.getDay() == 6) dateString += "сб";
			if(date.getDay() == 0) dateString += "вс";
		}
	}
	//php дата
	if(date.date){
		//выцепляем первые 10 символов
		dateString = date.date.substring(10, -10);
		if(format == "dd.MM") dateString = date.date.substring(10, -5);
		if(format == "dd.MM_hh.mm") {
			var time = date.date.substring(16, 11)
			var day =  date.date.substring(10, 8)
			var month =  date.date.substring(7, 5)
			dateString = day + "." + month + " - " + time;
			}
		if(format == "dd.MM.yy_hh.mm" || format == "dd.MM.yy") {
			var time = date.date.substring(16, 11)
			var day = date.date.substring(10, 8)
			var year = date.date.substring(4, 2)
			var month =  date.date.substring(7, 5)
			dateString = day + "." + month + "." + year;
			if(format == "dd.MM.yy_hh.mm") dateString += " - " + time;
			}
		}
	
	return dateString;
}

function matchInArray(expression, items) {
	var results = [];
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		if (item.match(expression)) {
			results.push(item);
		}
	}
	return results;
};

/** функция возвращает к-т для расчета нормо-лестницы в зависимости от даты **/

function getNlFactor(date){
	var nlFactor = 1 / 150;
	
	if(!date || formatDate(date, "yyyy-MM-dd") >= "2021-04-01") nlFactor *= 1 / 1.15
	
	return nlFactor;
}