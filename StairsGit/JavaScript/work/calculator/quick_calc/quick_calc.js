var templates = [];

$(function(){
	$("#showEditModal").on('click', function () {
		console.log('ok');
		$("#editCalcTempaltes").modal('show');
		updateTemplates(params.calcType);
	});

	$('#deleteTemplate').click(function(){
		if (selectedId) {
			result = confirm("Вы уверены что хотите удалить шаблон");
			if (result) {
				$.post('/orders/calc-controller/templates/delete/' + selectedId, function(resp){
					alert(resp);
					updateTemplates(params.calcType);
				})
			}
		}
	});

	// Выбор шаблона
	$("#selectTemplate").click(function(){
		$("#calcCreationModal").modal('hide');
		$("#editCalcTempaltes").modal('hide');
		
		if (selectedId) {
			currentTemplate = templates.find(function(item){return item.id == selectedId});

			if (window.location.href.indexOf('/calculator/quick_calc') != -1) {
				$.get('/orders/calc-controller/get-by-ordername/' + currentTemplate.order_name, function (result) {
					var body = JSON.parse(result);
					var order_data = JSON.parse(body['order_data']);
					if (order_data) {
						defaultOrderData = order_data;
						$('.templates').hide();
						$('.template-forms').show();
						updateUrl();
						$('.template-form').hide();
						$('[data-calc_type=' + currentTemplate.calc_type + ']').show();
						showInputs();
					}
				})
			}else{
				_loadFromBD(currentTemplate.order_name);
			}
		}
	});

	$.get("/orders/site-controller/action-get-data?page=calcTemplates", function (resp) {
		if (resp && resp.workers && resp.workers.data && resp.workers.data.length > 0) {
			resp.workers.data.forEach(function (worker) {
				$('#filter_creator').append('<option value="' + worker.name + '">' + worker.name + '</option>')
			})
		}
	});

	$('#editCalcTempaltes').on('click', 'tr', function(){
		var template_id = $(this).attr("data-template_id");
		if (template_id) {
			selectedId = template_id;
			$("#editCalcOutputDiv tr").removeClass("selected");
			$(this).addClass("selected");
		}
	});

	$("#showCreateTemplateModal").click(function(){
		$("#calcCreationModal").modal("show");
	})

	$('#createTemplate').click(function(){
		$.post('/orders/calc-controller/templates', {
			orderName: $("#newTemplateOrderName").val(),
			title: $("#newTemplateTitle").val(),
			description: $("#newTemplateDescription").val(),
			user: $('#userName').html()
		}, function(resp){
			alert(resp);
			updateTemplates(params.calcType);
			$("#calcCreationModal").modal('hide');
		})
	});

	//изменение параметров задачи
	$('#editCalcTempaltes').on('change', 'input, textarea', function(){
		var changePar = {
			templateId: $(this).closest("tr").attr("data-template_id"),
			propId: $(this).attr("data-propid"),
			value: $(this).val()
		}
		if (changePar.templateId) changeTemplate(changePar);
	});

	$(".edition_button").click(function(){
		changeParams($(this).attr('data-edition'))
	});
})

/**
 * Возможные шаблоны
 */
var quickCalcEditions = {
	'эконом': {
		metalPaint: 'порошок'
	},
	'стандарт': {
		metalPaint: 'порошок',
		treadsMaterial: 'сосна ц/л кл.Б',
		railingModel: 'Ригели'
	},
	'премиум': {
		metalPaint: 'порошок',
		treadsMaterial: 'лиственница паркет.',
		railingModel: 'Кованые балясины',
		isAssembling: 'есть',
		delivery: 'Москва'
	},
	'премиум_2': {
		metalPaint: 'порошок',
		treadsMaterial: 'дуб паркет.',
		railingModel: 'Стекло на стойках',
		timberPaint: 'масло',
		isAssembling: 'есть',
		delivery: 'Москва'
	},
	'премиум_3': {
		metalPaint: 'порошок',
		treadsMaterial: 'дуб ц/л',
		timberPaint: 'морилка+лак',
		railingModel: 'Самонесущее стекло',
		isAssembling: 'есть',
		delivery: 'Москва'
	}
}

// Функция обновляет параметры на основе edition
function changeParams(edition_name){
	if (quickCalcEditions[edition_name]) {
		templateParams = {}
		$.each(quickCalcEditions[edition_name], function(key){
			templateParams[key] = this;
		});
		updateUrl();
	}
}

/**
 * Обновляет темплейт при изменении инпутов
 */
function changeTemplate(par){
	var template = getArrItemByProp(templates, "id", par.templateId);
	if(!template) return;
	
	//вносим изменения в локальный массив
	var prev_val = template[par.propId];
	template[par.propId] = par.value;
	
	var changes = [];
	var change = {
		prop: par.propId,
		val: par.value,
		prim: true,
		table: "tasks",
		prev_val: prev_val,
	}
	
	changes.push(change);
	$.ajax({
        url: "/orders/calc-controller/templates/update/" + par.templateId,
        type: "POST",
        dataType: 'json',
        data: {
            changes: JSON.stringify(changes)
        },
        success: function (data) {
			
        },
        error: function( jqXhr, textStatus, errorThrown ){
            alert('Ошибка на сервере ' +errorThrown );
        }
    });
}//end of changeEvent


// запрашивает и вызывает перерисовку таблицы с шаблонами
function updateTemplates(calcType) {
	$.get('/orders/calc-controller/get-templates', function (body) {
		var items = body['data'];
		if (calcType) {
			items = items.filter(function(item){
				return item.calc_type == calcType
			})
		}
		printTemplatesTable(items)
		templates = items;
	})
}

// Отрисовка таблицы с шаблонами
function printTemplatesTable(templates) {
	var text = "<table class='tab_4'><thead><tr>";
	var columns = [
		{
		  "id": "order_name",
		  "name": "Номер заказа",
		  "values": "string",
		  "isconstant": 1
		},
		{
			"id": "title",
			"name": "Имя",
			"values": "string",
		},
		{
			"id": "description",
			"name": "Описание",
			"values": "text",
		},
		{
			"id": "preview",
			"name": "Картинка",
			"values": "image"
		},
		{
			"id": "groups",
			"name": "Группа",
			"values": "string"
		},
		{
			"id": "calc_type",
			"name": "Тип расчета",
			"values": "string",
			"isconstant": 1
		},
		{
			"id": "creator",
			"name": "Создатель",
			"values": "string",
			"isconstant": 1
		}
	];
	//заголовки таблицы
	for (i = 0; i < columns.length; i++) {
		text += "<th>" + columns[i].name + "</th>";
	}
	text += "</tr><tbody>";
	//тело таблицы
	for (var i = 0; i < templates.length; i++) {
		text += "<tr data-template_id='" + templates[i].id + "'>";
		for (j = 0; j < columns.length; j++) {
			var propId = columns[j].id;
			text += "<td style='min-width: " + columns[j].colWidth + "px'>";
			var propParams = {
				prop: columns[j],
				val: templates[i][propId],
			}

			text += printEditableProp(propParams); //функция в файле table.js
			text += "</td>";
		}
		text += "</tr>";
	}
	text += "</tbody></table>";

	$("#editCalcOutputDiv").html(text)

	//включаем сортировку и поиск по таблице
	$('.tab_4').tablesorter({
		widgets: ['zebra', 'filter'],
		theme: 'blue',
		usNumberFormat: false,
		sortReset: true,
		sortRestart: true,
		headers: {
			1: {
				sorter: "inputs"
			},
			2: {
				sorter: "inputs"
			},
			3: {
				sorter: "inputs"
			},
			4: {
				sorter: "select-text"
			}
		},
	});
}

// Показывает инпуты 
function showInputs() {
	if (window.defaultOrderData) {
		$.each(defaultOrderData, function(key){
			if ($('#' + key).length > 0) {
				if (this instanceof String) $('#' + key).val(this.toString());
			}
		});
	}
}

// Обновляет урл 
function updateUrl() {
	var url_calculator = '/calculator/' + currentTemplate.calc_type + '?orderName=' + currentTemplate.order_name + '&' + getNewUrlParams();
	var url_customers = '/customers/' + currentTemplate.calc_type + '?orderName=' + currentTemplate.order_name + '&calculate_price=1&' + getNewUrlParams();
	if (window.isMulti) {
		var url_calculator = '/calculator/multi?orderName=' + currentTemplate.order_name + '&multiCalcType='+ currentTemplate.calc_type +'&' + getNewUrlParams();
		var url_customers = '/customers/multi?orderName=' + currentTemplate.order_name + '&multiCalcType='+ currentTemplate.calc_type +'&calculate_price=1&' + getNewUrlParams();
	}
	$('#customerLink').attr('href', url_customers);

	$('#urlResultCalculator').attr('href', url_calculator);
	$('#urlResultCalculator').html(url_calculator);
}

function getNewUrlParams() {
	var params = [];
	$.each(templateParams, function (key, val) {
		if (defaultOrderData[key] != val) {
			params.push(key + '=' + val);
		}
	})

	return params.join('&');
}

function drawTemplates() {
	$("#templates").html("");
	templates.forEach(function (item, index) {
		var image = item.preview;
		$("#templates").append(`
			<div class="card" style='margin: 10px; width: 18rem;'>
				<img class="card-img-top" src="${image}" alt="">
				<div class="card-header">${item.title}</div>
				<div class="card-header">Номер заказа ${item.order_name}</div>
				<div class="card-header">Тип расчета: ${item.calc_type}</div>
				<div class="card-body">
					<a href="#" class="btn btn-primary selectTemplate" data-id="${index}">Использовать</a>
				</div>
			</div>
		`);
	});
}