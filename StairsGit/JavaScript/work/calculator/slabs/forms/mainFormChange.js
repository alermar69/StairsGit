
/** функция инициализирует таблицы при загрузке данных из базы
*/

function configEstimateForms(){
	
	$(".estimateItem").remove();
	
	$(".estimate").each(function(){
		var amt = $(this).find('.rowAmt').val();
		var estimateId = $(this).attr("id");
		console.log(amt, estimateId)
		for(var i = 0; i < amt; i++){
			addRow(estimateId);
		}
		reindexTable()
	})
	
}

/** функция добавляет строку в таблицу работ или матреиалов
*/

function addRow(estimateId){
	
	var types = ['сборка', 'доставка'];
	if(estimateId == "estimate_mat") types = ['столешница', 'подоконник', 'подстолье', 'фасад мдф', 'фасад массив', 'другое'];
	
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
		"<td class='noPrint cost' style='display: none'><input type='number' id='сost" + id + "' class='сost' value='100'></td>\
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
	
	reindexTable()
};

function reindexTable(){
	$(".estimateItem").each(function(i){
		$(this).find(".id").text(i+1);
		$(this).find("input,select,textarea").each(function(){
			$(this).attr('id', $(this).attr('class') + i)
		});
		//пересчитываем % работы подрядчиков
		if($(this).find(".unitType").val() == "изделие"){
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
		}
		else{
			$(this).find(".metalPart").val(0)
			$(this).find(".timberPart").val(0)
			$(this).find(".partnersPart").val()
		}
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

//столешницы, подоконники
	
	//модель
	var prop = {
		id: "model",
		values: [
			'не указано',
			'щит',
			'слэб цельный',
			'слэб со склейкой',
			'слэб + стекло',
			'слэб + смола непрозр.',
			'слэб + смола прозр.',
			'шпон',
		],
		name: "Модель",
		classNames: 'countertop',
	};
	props.push(prop);
	
	//порода дерева
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
	
	//тип фаски
	var prop = {
		id: "edgeModel",
		values: [
			"не указано",
			"скругление R3",
			"скругление R6",
			"фаска 3х45гр",
			"фаска 6х45гр",
			"калевка R10",
			"фигурная №1",
			"фигурная №2",
		],
		name: "Ребра",
		classNames: 'countertop',
	};
	props.push(prop);

//подстолья


	//модель
	var prop = {
		id: "baseModel",
		values: [
			'не указано',
			'труба крашенная',
			'труба нерж.',
			'лист',
			'короб',
		],
		name: "Модель",
		classNames: 'tableBase',
	};
	props.push(prop);
	
	//профиль
	var prop = {
		id: "prof",
		values: [
			'не указано',
			'40х20',
			'40х40',
			'60х30',
			'60х40',
			'60х60',
			'80х40',
			'100х40',
			'100х50',
		],
		name: "Профиль",
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

function configParamsInputs($row){

	var type = $row.find(".unitType").val();
	
	$row.find(".props span").hide();
	
	$row.find(".main").show();
	
	if(type == "столешница" || type == "подоконник") {
		$row.find(".countertop").show();
		var model = $row.find(".model").val();
		if(model == "слэб + смола непрозр." || model == "слэб + смола прозр.") $row.find(".resin").show();			
		if(model == "слэб + стекло") $row.find(".glass").show();			
	}
	
	if(type == "подстолье") $row.find(".tableBase").show();
	
	if(type == "фасад мдф" || type == "фасад массив") $row.find(".facade").show();
	
	if(!$row.find(".name").val()) $row.find(".name").val(type)
		
}