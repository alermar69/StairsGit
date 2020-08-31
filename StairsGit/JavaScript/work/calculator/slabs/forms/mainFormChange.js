$(function () {
	
	//добавление строки в таблицу сметы
	$(".addRow").click(function(){
		var estimateId = $(this).closest('.estimate').attr("id");
		addRow(estimateId);
		reindexTable()
		recalculate();
		if($("#cost").is(":visible")) $(".cost").show();
	});
	
	//удаление строки в таблицу сметы
	$(".estimateForm").delegate(".removeRow", "click", function(){
		reindexTable();
		recalculate();
	})
	
	//обработка изменения параметров
	$(".estimate").delegate("input,select,textarea", "change", function(){

		var $row = $(this).closest("tr")
		configParamsInputs($row)
		//меняем название при смене типа
		if($(this).hasClass("unitType")){
			if($(this).val() != "другое") $row.find(".name").val($(this).val())
			else $row.find(".name").val("")
		} 
		recalculate();
	})

	$("#headerType").change(function(){
		$(".header").hide();
		$(".footerText").hide();
		
		$("." + $(this).val()).show()
	})

	$(".setWorksPrice").click(function(){
		setWorksPrice();
	})
})

/** функция конфигурирует данные в строках таблицы
*/

function changeSlabsForm(){
	$("tr.estimateItem").each(function(){
		$row = $(this)
		configParamsInputs($row)
	})
	
	//скрываем таблицу работ если нет ни доставки ни сборки
	$("#estimate_works").show();
	if(params.delivery == "нет" && params.isAssembling == "нет") $("#estimate_works").hide();
	
	setTextareaHeight();
}


/** функция инициализирует таблицы при загрузке данных из базы
*/

function configEstimateForms(){

	$(".estimateItem").remove();
	
	$(".estimate").each(function(){
		var amt = $(this).find('.rowAmt').val();
		var estimateId = $(this).attr("id");

		for(var i = 0; i < amt; i++){
			addRow(estimateId);
		}
		
	})
	
	reindexTable()
}

/** функция добавляет строку в таблицу работ или матреиалов
*/

function addRow(estimateId){
	
	var types = ['сборка', 'доставка'];
	if(estimateId == "estimate_mat") types = ['столешница', 'подоконник', 'подстолье', 'фасад мдф', 'фасад массив', 'другое', 'слэб', 'изготовление столешницы', 'выравнивание плоскости'];
	
	var id = $("tr.estimateItem").length;
	var row = "<tr class='estimateItem'>\
		<td class='id'></td>\
		<td><textarea id='name" + id + "' class='name'></textarea></td>";
	
	//параметры
	if(estimateId == "estimate_mat") {
		row += "<td class='props'></td>"		
	}
	
	row +=
		"<td><input type='number' id='amt" + id + "' class='amt' value='1'></td>\
		<td><input type='number' id='unitPrice" + id + "' class='unitPrice' value='200'></td>\
		<td class='summ'></td>";
	
	//тип
	row += "<td class='noPrint'>\
			<select id='unitType" + id + "' class='unitType'>";
	$.each(types, function(){
		row += "<option value='" + this + "'>" + this + "</option>";
	})
	row += "</select>\
		</td>"
	
	row +=
		"<td class='noPrint cost' style='display: none'><input type='number' id='cost" + id + "' class='cost' value='100'></td>\
		<td class='noPrint cost' style='display: none'><input type='number' id='metalPart" + id + "' class='metalPart' value='0'></td>\
		<td class='noPrint cost' style='display: none'><input type='number' id='timberPart" + id + "' class='timberPart' value='0'></td>\
		<td class='noPrint cost' style='display: none'><input type='number' id='partnersPart" + id + "' class='partnersPart' value='0'></td>\
		<td class='removeRow noPrint'>X</td>\
	</tr>";

	$("#" + estimateId + " .estimateForm").append(row);
	$("#" + estimateId + " .rowAmt").val($("#" + estimateId + " .rowAmt").val() * 1 + 1);
	
	var $row = $("#" + estimateId + " .estimateForm tr:last");
	
	addUnitParamsInputs($row);
	configParamsInputs($row);
	
	//reindexTable()
};

function reindexTable(){
	$(".estimateItem").each(function(i){
		$(this).find(".id").text(i+1);
		$(this).find("input,select,textarea").each(function(){
			$(this).attr('id', $(this).attr('class').split(' ')[0] + i)
		});
		//пересчитываем % работы подрядчиков

		var parts = {
			metal: $(this).find(".metalPart").val(),
			timber: $(this).find(".timberPart").val(),
		};
		var partnersPart = 100;
		$.each(parts, function(){
			partnersPart -= this;
		})
		
		$(this).find(".partnersPart").val(partnersPart)
		if(partnersPart < 0) alert("ВНИМАНИЕ ОШИБКА! Отрицательная часть подрядчика! Проверьте цифры")


	})
	
	//кол-во элементов в таблицах
	$(".estimate").each(function(){
		var rowAmt = $(this).find(".estimateItem").length;
		$(this).find(".rowAmt").val(rowAmt)
	});

}

/** функция рассчитывает процент монтажа в цене изделия
*/
function calcPartnersPart(){
	var parts = {
		metal: $("#metalPart").val(),
		timber: $("#timberPart").val(),
		partners: $("#partnersPart").val(),
	};
	
	var assemblingPart = 100;
	$.each(parts, function(){
		assemblingPart -= this;
	})
	
	$("#assemblingPart").val(assemblingPart);
	if(assemblingPart < 0) alert("ВНИМАНИЕ ОШИБКА! Сумма частей больше 100%! Проверьте цифры")
}

/** функция добавляет в таблицу материалов параметры изделия
*/

function addUnitParamsInputs($row){

	var type = $row.find(".unitType").val();
	var rowId = $row.find(".id").text();
	
	var props = [];
	
	//длина
	var prop = {
		id: "len",
		values: "number",
		name: "Длина, мм",
		defaultVal: 500,
		classNames: 'countertop',
	};
	props.push(prop);
	
	//ширина
	var prop = {
		id: "width",
		values: "number",
		name: "Ширина, мм",
		defaultVal: 600,
		classNames: 'main',
	};
	props.push(prop)
	
	//высота
	var prop = {
		id: "height",
		values: "number",
		name: "Высота, мм",
		defaultVal: 700,
		classNames: 'tableBase',
	};
	props.push(prop)
	
	//порода дерева
	var prop = {
		id: "geom",
		values: [
			"не указано",
			"прямоугольник",
			"по чертежу",
			"по шаблону",
		],
		name: "Геометрия",
		classNames: 'countertop facade',
	};
	props.push(prop);

//столешницы, подоконники
	
	//модель
	var prop = {
		id: "model",
		values: [
			'не указано',
			'щит',
			'шпон',
			'слэб цельный',
			'слэб со склейкой',
			'слэб + стекло',
			'слэб + смола непрозр.',
			'слэб + смола прозр.',
			
		],
		name: "Модель",
		classNames: 'countertop',
	};
	props.push(prop);
	
	//порода дерева для щита
	var prop = {
		id: "timberType",
		values: [
			"не указано",
			"сосна ц/л кл.Б",
			"сосна экстра",
			"береза паркет.",
			"лиственница паркет.",
			"лиственница ц/л",
			"дуб паркет.",
			"дуб ц/л",
			"дуб натур",
			"карагач натур",
		],
		name: "Дерево",
		classNames: 'countertop facade',
	};
	props.push(prop);
	
	//толщина
	var prop = {
		id: "thk",
		values: "number",
		name: "Толщина",
		defaultVal: 40,
		classNames: 'countertop facade',
	};
	props.push(prop);
	
	//цвет смолы
	var prop = {
		id: "resinColor",
		values: [
			"не указано",
			"бесцветная",
			"черная",
			"белая",
			"голубая",
			"синяя",
			"бронза",
		],
		name: "Цвет смолы",
		classNames: 'resin',
	};
	props.push(prop);
	
	//цвет стекла
	var prop = {
		id: "glassColor",
		values: [
			"не указано",
			"бесцветное",
			"бронза",
			"голубое",
			"матовое белое",
		],
		name: "Цвет стекла",
		classNames: 'glass',
	};
	props.push(prop);
	
	//ширина реки
	var prop = {
		id: "riverWidth",
		values: "number",
		name: "Ширина реки, мм",
		defaultVal: 150,
		classNames: 'resin',
	};
	props.push(prop);
	
	//ширина реки
	var prop = {
		id: "resinVol",
		values: "number",
		name: "Объем заливки, л",
		defaultVal: 1,
		classNames: 'resin',
	};
	props.push(prop);
	
	//тип фаски
	var prop = {
		id: "edgeModel",
		values: [
			"не указано",
			"скругление R3",
			"скругление R6",
			"скругление R12",
			"скругление R25",
			"фигурная Ф-1",
			"фигурная Ф-2",
			"фигурная Ф-3",
			"фигурная Ф-4",
			"фигурная Ф-5",
			"фигурная Ф-6",
			"фигурная Ф-7",
			"фигурная Ф-8",
			"фаска 6х45гр",
			"фаска 12х45гр",
		],
		name: "Ребра",
		classNames: 'countertop',
	};
	props.push(prop);
	
	//геометрия фаски на верхней стороне
	var prop = {
		id: "edgeGeomTop",
		values: [
			"не указано",
			"1 ребро",
			"3 ребра",
			"все ребра",
			"по чертежу",
			"по шаблону",
			"нет",
		],
		name: "Фаска сверху",
		classNames: 'countertop',
	};
	props.push(prop);

	//геометрия фаски на нижней стороне
	var prop = {
		id: "edgeGeomBot",
		values: [
			"не указано",
			"1 ребро",
			"3 ребра",
			"все ребра",
			"по чертежу",
			"по шаблону",
			"нет",
		],
		name: "Фаска снизу",
		classNames: 'countertop',
	};
	props.push(prop);
	
	//доклейка по толщине
	var prop = {
		id: "extraThk",
		values: [
			"не указано",
			"нет",
			"по чертежу",
		],
		name: "Доклейка по толщине",
		classNames: 'countertop',
	};
	props.push(prop);
	
//подстолья


	//модель
	var prop = {
		id: "baseModel",
		values: [
			'не указано',
			'D-1',
			'S-1',
			'S-2',
			'S-3',
			'S-4',
			'S-5',
			'S-6',
			'S-7',
			'S-8',
			'S-9',
			'T-1',
			'T-2',
			'T-3',
			'T-4',
			'T-5',
			'T-6',
			'T-7',
			'T-8',
			'T-9',
			'T-10',
			'T-11',
			'T-12',
			'T-13',
			'T-14',
			'T-15',
			'T-16',
			'T-17',
			'T-18',
		],
		name: "Модель",
		classNames: 'tableBase',
	};
	props.push(prop);
	
	//типоразмер подстолья
	var prop = {
		id: "tableGeom",
		values: [
			'не указано',
			'прямоугольный',
			'круглый',
		],
		name: "Форма стола",
		classNames: 'tableBase',
	};
	props.push(prop);



//комментарий
	
	var prop = {
		id: "comment",
		values: "text",
		classNames: 'main',
	};
	props.push(prop);
	
	var propsText = "";
	$.each(props, function(){
		var val = $row.find("#" + this.id).val();
		if(!val && this.defaultVal) val = this.defaultVal;
		var propParams = {
			prop: this,
			val: val,
		}
		
		propsText += "<span";
		if(this.classNames) propsText += " class='" + this.classNames + "'";
		propsText += ">";
		
		if(this.name) propsText += this.name + ": "
		propsText += printEditableProp(propParams) + //функция в файле table.js
			"<br/></span>"; 
	})
	
	$row.find(".props").html(propsText);
	$row.find(".props").find("input,select,textarea").each(function(){
		$(this).addClass($(this).attr('data-propid'));
	})

}

/** функция конфигурирует параметры изделий
*/

function configParamsInputs($row){

	var type = $row.find(".unitType").val();
	
	$row.find(".props span").hide();
	
	$row.find(".main").show();
	
	if(type == "столешница" || type == "подоконник") {
		$row.find(".countertop").show();
		var model = $row.find(".model").val();
		if(model.indexOf("слэб") != -1){
			alertTrouble("Изделия из слэбов необходимо считать отдельно слэб, отдельно изготовление.")
		}
		if(model == "щит"){
			var timberType = $row.find(".timberType").val();
			if(timberType == "дуб натур" || timberType == "карагач натур") $row.find(".timberType").val("дуб паркет.");
		}
		
		if(model == "шпон"){
			var timberType = $row.find(".timberType").val();
			if(timberType != "дуб ц/л" && timberType != "лиственница ц/л") $row.find(".timberType").val("дуб ц/л");
		}
	}
	
	if(type == "изготовление столешницы") {
		$row.find(".countertop").show();
		var model = $row.find(".model").val();
		if(model == "слэб + смола непрозр." || model == "слэб + смола прозр.") $row.find(".resin").show();			
		if(model == "слэб + стекло") $row.find(".glass").show();
	}
	
	if(type == "подстолье") {
		$row.find(".tableBase").show();
		var baseModel = $row.find(".baseModel").val();
		if(baseModel == "S-9" || baseModel == "T-17") $row.find(".tableGeom").val("круглый");
	}
	
	//слэбы
	if(type == "слэб") {
		$row.find(".len").closest('span').show();
		$row.find(".thk").closest('span').show();
		$row.find(".timberType").closest('span').show();
		
		
	}
	
	if(type == "изготовление столешницы") {
		//$row.find(".countertop").show();

		$row.find(".resin").closest('span').show();
		$row.find(".timberType").closest('span').hide();
		if(model != "слэб + стекло") $row.find(".riverWidth").closest('span').hide();
		$row.find(".thk").closest('span').hide();
		
	}
	
	if(type == "выравнивание плоскости"){
		$row.find(".len").closest('span').show();
	}
	
	if(type == "фасад мдф" || type == "фасад массив") $row.find(".facade").show();
	
	if(!$row.find(".name").val()) $row.find(".name").val(type)
	
	
		
}