var currentPriceItem = null;

$(function () {
	//выделение блока
	$("#priceItemsWrap").delegate(".priceItem", "click", function(){
		$(".priceItem").removeClass("selected")
		$(this).addClass("selected")
	});
	
	//редактирование текста в блоке
	$("#priceItemsWrap").delegate(".editable", "dblclick", function(){
		if (window.location.href.includes("customers")) return;
		var newText = prompt("", $(this).text());
		if(newText) {
			$(this).text(newText);
			var id = $(this).closest(".priceItem").data('id');
			var priceItem = getArrItemByProp(params.priceItems, 'id', id);
			priceItem[$(this).data("key")] = newText;
		}
		updatePriceItemsSelect()
	});
	
	//добавить блок
	$("#addPriceItem").click(function(){
		recalculate().finally(function(){
			$(".priceItem.selected").removeClass("selected");
			addPriceBlock();
			$("#priceEditionsHeader").removeClass('noPrint');
			
			updatePriceItemsSelect();
		});
	});
	
	//удалить блок
	$("#removePriceItem").click(function(){
		var id = $(".priceItem.selected").data('id');
		$.each(params.priceItems, function(index){
			if(this.id == id) {
				params.priceItems.splice(index, 1);
				return false;
			}
		})
		$(".priceItem.selected").remove();
		if($(".priceItem").length == 0) $("#priceEditionsHeader").addClass('noPrint');
		updatePriceItemsSelect()
	});

	//Сделать блок основным
	$("#setMainPriceItem").click(function(){
		var id = $(".priceItem.selected").data('id');
		setMainPriceItem(id);
	});
	
	//заменить блок текущей информацией
	$("#replacePriceItem").click(function(){
		recalculate().finally(function(){
			var id = $(".priceItem.selected").data('id');
			$.each(params.priceItems, function(index){
				if(this.id == id) {
					params.priceItems.splice(index, 1);
					return false;
				}
			})
			addPriceBlock();
		});
	});
	
	//сдвинуть влево
	$("#moovePriceItem").click(function(){
		//меняем местами блоки на странице
		var pdiv = $(".priceItem.selected");
		pdiv.insertBefore(pdiv.prev());
		var id = $(".priceItem.selected").attr('data-id');
		
		//меняем местами объекты в массиве
		var index = params.priceItems.findIndex(function(currentValue){
			return currentValue.id == id;
		})
		if(index > 0){
			[params.priceItems[index - 1], params.priceItems[index]] = [params.priceItems[index], params.priceItems[index-1]]
		}

		return false
		
	});

	//кнопка применить
	$(document).on('click','.show-price-item button',function(){
		var id = $(".priceItem.selected").data('id');
		applyPriceItem({id: id});
		$("#priceItemsSelectWrap select").val(id);
	});

	//Пересчитать цены
	$(".recalculatePrices").click(function(){
		updatePriceItems();
	});

	//упорядочить названия	
	$("#reindexPriceItems").click(function(){
		reindexPriceItems();
		updatePriceItemsSelect()
	});
	
	$('#updateAllItems').click(function(){
		$("#editionsChangeModal").modal('show');
		$("#editionsChangeModal #formsContent").html('');
		$.each($('.editionsChangeForm'), function(){
			var title = $(this).find('h4').html();
			if (!title) $(this).find('h3').html();
			if (!title) $(this).find('h2').html();

			$("#editionsChangeModal #formsContent").append('<div><input type="checkbox" checked="true" class="selectEditionsFormToChange" data-form_name="' + $(this).attr('id') + '"> '+title+'</div>');
		});
	});

	$('#deleteAllItems').click(function(){
		if (confirm('Вы уверены что хотите удалить все комплектации?')) {
			params.priceItems = [];
			redrawPriceItems();
		}
	});

	$("#addFromOrder").click(function(){
		var orderName = prompt('Введите номер заказа');
		var loadWalls = confirm('Загружать обстановку?');
		if (orderName) {
			var settings = {
				dataType: 'json',
				url: '/orders/calc-controller/get-by-ordername/' + orderName,
				type: 'GET',
				success: function (data) {
					var orderData = JSON.parse(data.order_data)
					var id = addPriceBlock(orderData);
					applyPriceItem({id: id, allInputs: loadWalls});
				},
				error: function (a, b) {}
			};
			$.ajax(settings);
		}
	})

	$('#acceptEditionsChanges').click(function (e) {
		var names = getChangingForms().map(function(form){return form.name})
		if (confirm('Во всех комплектациях будут заменены следующие группы параметров:\n'+names.join('\n - ')+'\nВы уверены?')) {
			$("#editionsChangeModal").modal('hide');
			updateAllPriceItems();
		}
	})

	//не печатать параметры лестницы
	$(".print-btn").click(function(){
		$(this).toggleClass("grey");
		$(this).closest("#totalResultWrap").toggleClass("noPrint");
		$(".paramsForms").toggleClass("noPrint");
	})
	
	//смета/кп
	$(".estimate-btn").click(function(){
		$(this).toggleClass("grey");
		printPrice2();
	})
	/*
		if($(this).hasClass('grey')){
			alert("распечатать смету")
		}
		else {
			alert("смета")
		}
*/
	//скрыть/показать шаблоны
	$("#showTemplates").click(function(){
		$("#templates").slideToggle(200);
		if($(this).text() == "Показать шаблоны комплектации") $(this).text("Скрыть шаблоны")
		else $(this).text("Показать шаблоны комплектации");
	})
	
	//применить конфигурацию при изменении селекта в шапке
	$("#priceItemsSelectWrap").delegate('select', 'change', function(){
		var id = $(this).val();
		applyPriceItem({id: id});
	})
	
});

/**
 * Получаем список выбранных для изменения форм
 */
function getChangingForms() {
	var changingForms = []
	$.each($('.selectEditionsFormToChange'), function(){
		if ($(this).is(':checked')) {
			var el = $('#' + $(this).attr('data-form_name'));
			var title = $(el).find('h4').html();
			if (!title) $(el).find('h3').html();
			if (!title) $(el).find('h2').html();

			changingForms.push({name: title, id: $(this).attr('data-form_name')});
		}
	})
	return changingForms;
}

function setMainPriceItem(id){
	var priceItem = getArrItemByProp(params.priceItems, 'id', id);
	var index = params.priceItems.indexOf(priceItem);
	console.log(index);
	[params.priceItems[0], params.priceItems[index]] = [params.priceItems[index], params.priceItems[0]];
	applyPriceItem({id: id});
	redrawPriceItems()
}

/**
 * Функция массового редактирования комплектаций
 */
function updateAllPriceItems(){
	if (params.priceItems && params.priceItems.length > 0) {
		var tablesSelector = [];
		getChangingForms().forEach(function(item){tablesSelector.push('#' + item.id)});
		var elements = $(tablesSelector.join(',')).find('input[type!=file], select, textarea');
		if (tablesSelector.length == 0) {
			return alert('Не выбрано ни одной таблицы')
		}
		$.each(params.priceItems, function(){
			var par = this.params;
			$.each(elements, function(){
				var val = $(this);
				var value = val.val()
				if(val.attr('type') == 'radio'  || val.attr('type') == 'checkbox'){
					value = val.prop('checked')?'checked':'unchecked';
				}
				if(val.attr('type') == 'number') value = val.val() * 1.0;
				par[this.id] = value;
			});
		});
		alert('Конфигурации обновлены, цены будут пересчитаны.')
		updatePriceItems();
		redrawPriceItems(true);
		return
	}
	alert('Комплектации не найдены');
}

function updatePriceItems(i){
	if(i == undefined) i = params.priceItems.length - 1;
	var priceItem = params.priceItems[i];
	if (priceItem && i >= 0) {
		updatePriceItem(priceItem).finally(function(resolve){
			priceItem.params = {};
			// Записываем текущие значения инпутов
			getAllInputsValues(priceItem.params);
			updatePriceItems(i - 1)
		});
	}
}

function updatePriceItem(priceItem){
	return new Promise(function(resolve){
		applyPriceItem({id: priceItem.id, callback: function(){
			priceItem.price = priceObj['total'].discountPrice;
			$('.priceItem[data-id="' + i + '"] .price-old').html(' ' + Math.round(priceItem.price / 0.7) + ' ');
			$('.priceItem[data-id="' + i + '"] .price-new').html(priceItem.price + ' руб.');

			redrawPriceItems();
			resolve();
		}});
	});
}

var isMultiLoading = false;
function applyPriceItem(par){
	var id = par.id;
	var callback = par.callback;
	if(id == null) return;

	var priceItem = getArrItemByProp(params.priceItems, 'id', id);
	currentPriceItem = priceItem.id;

	// // Фикс динамических инпутов для ограждений модуля railing
	// // Решение скорее временное, нужно рефакторить загрузку данных из params
	// if (params.calcType == 'railing') {
	// 	if (priceItem.params.railingSectAmt > $("#railingParamsTable .sectParams").length) {
	// 		var needSectionsCount = priceItem.params.railingSectAmt - $("#railingParamsTable .sectParams").length;
	// 		if (needSectionsCount > 0) {
	// 			for (var i = 0; i < needSectionsCount; i++) {
	// 				addRailingInputs();
	// 			}
	// 		}
	// 	}
	// }

	var keys = Object.keys(priceItem.params);
	var ignoreIds = getServiceInputsIds();
	
	//общие параметры для всех этажей
	if (window.isMulti && !par.allInputs) {
		
		var notGeneralParams = ["discountFactor"]; //параметры, находящиеся в общийх блоках, но разные для разных этажей
		
		$('#openingFormWrap, #wallsFormWrapper, #cost').find("input, select").each(function(){
			var parId = $(this).attr('id')
			if(notGeneralParams.indexOf(parId) == -1) ignoreIds.push(parId)
		});
	}

	isMultiLoading = true;
	$.each(keys, function(){
		if (window.isMulti && !par.allInputs && (this.indexOf('floorHole') !=  -1 || this.indexOf('wallLedge') !=  -1)) return;
		if(this != "" && ignoreIds.indexOf(this.toString()) == -1) setInputValue2({selector: '#' + this, value: priceItem.params[this]});
	});

	// В случае если загружаем вместе с динамическими инпутами, делаем загрузку еще раз
	if (par.allInputs) {
		configDinamicInputs();
		$.each(keys, function(){
			if (window.isMulti && !par.allInputs && (this.indexOf('floorHole') !=  -1 || this.indexOf('wallLedge') !=  -1)) return;
			if(this != "" && ignoreIds.indexOf(this.toString()) == -1) setInputValue2({selector: '#' + this, value: priceItem.params[this]});
		});
	}

	changeAllForms();
	isMultiLoading = false;
	var promise = recalculate();
	if (promise) {
		promise.finally(function(){
			if (callback) callback();
		})
	}
}

/**
 * Перерисовка комплектаций
 * @param {bool} forceUpdate принудительно обновить описания
 */
function redrawPriceItems(forceUpdate){
	$("#priceItemsWrap").html("");	
	if (params.priceItems && params.priceItems.length > 0) {
		for (var i = 0; i < params.priceItems.length; i++) {
			var priceItem = params.priceItems[i];
			var priceBlockTextPar = {
				id: priceItem.id, 
				priceItem: priceItem,
				forceUpdate: forceUpdate,
			};
			var text = getPriceBlockText(priceBlockTextPar);
			$("#priceItemsWrap").append(text);
		}
		formatNumbers();
		$(".priceItem").removeClass("selected")
		updatePriceItemsSelect();		
	}
}

function updatePriceItemsSelect(){
	$("#priceItemsSelectWrap").html("");
	
	if (params.priceItems && params.priceItems.length > 1) {
		var select = "<select class='form-control'>";
		for (var i = 0; i < params.priceItems.length; i++) {
			var id = params.priceItems[i].id;
			select += "<option value='" + id + "'>" + getPriceBlockName(id) + "</option>";			
		}
		select += "</select>";
		$("#priceItemsSelectWrap").html(select);
		
		var selectedItemId = $(".priceItem.selected").data('id');
		if(selectedItemId) $("#priceItemsSelectWrap select").val(selectedItemId);
	}
}

function getPriceBlockText(par){
	if (window.isMulti) {
		return getPriceBlockTextFloors(par);
	}else{
		return getPriceBlockTextEditions(par);
	}
}

function getPriceBlockTextFloors(par){
	var id = par.id;
	par.name = getPriceBlockName(id);

	var parameters = params;//Параметры из которых берутся данные;
	if (par.priceItem) parameters = par.priceItem.params;

	if (!par.priceItem || par.forceUpdate) {
		var price = priceObj['total'].discountPrice;
		var stairDescr = getExportData_com().product_descr;
	}
	
	if (par.priceItem && !par.forceUpdate) {
		if (par.priceItem.priceObj) {
			var price = par.priceItem.priceObj.total.discountPrice;
		}else{
			var price = priceObj.total.discountPrice;
		}
		var stairDescr = par.priceItem.stairDescr || getExportData_com().product_descr;
	}

	var sections = {
		stairDescr: {
			name: "Описание",
			text: stairDescr,
		}
	};

	var text = 
	'<div class="priceItem selected" data-id="' + id + '">' + 
		'<div class="prices-block clearfix">' + 
			'<div class="price-name text-center editable" data-key="name">' + par.name + '</div>' + 
			'<div class="text-wrap text-center">';
	
	for(var sectId in sections){
		var section = sections[sectId]
		text += '<div class="info-block ' + sectId + '">' + 
			'<div class="name">' + section.name + ':</div>' + 
			'<p class="editable" data-key="' + section.name + '">' + section.text +'</p>' + 
		'</div>' + 
		'<div class="shadow"></div>';
	}

	text +=
		'</div>' + 
			'<div class="price-block text-center">' + 
				'<span class="price-old  number"> ' + Math.round(price / 0.7) + ' </span>' + 
				'<span class="price-new  number">' + price + ' руб.</span>' + 
			'</div>' + 
			'<div class="show-price-item text-center noPrint">' + 
				'<button class="btn btn-primary">Применить</button>' +
			'</div>' + 
		'</div>' + 
	'</div>';

	if (!par.priceItem) par.priceItem = {};	
	for(var sectId in sections){
		par.priceItem[sectId] = sections[sectId].text;
	}
	par.priceItem.price = price;
	
	return text;//{text: text, item: priceItem};
}

function getPriceBlockTextEditions(par){
	var id = par.id;
	par.name = getPriceBlockName(id);

	var parameters = params;//Параметры из которых берутся данные;
	if (par.priceItem) parameters = par.priceItem.params;

	if (!par.priceItem || par.forceUpdate) {
		var units = staircaseHasUnit();
	
		//каркас
		var carcasDescr = "металлический, модель " + parameters.model;
		if(parameters.metalPaint != "порошок") carcasDescr += ", без покраски";
		else carcasDescr += ", покраска порошковая";
		if(parameters.isCarcas == "нет") carcasDescr = "нет";
		
		if(parameters.calcType == "timber" || parameters.calcType == "timber_stock"){
			var carcasDescr = "деревянный, модель " + parameters.model;
			if(parameters.timberPaint == "не указано" || parameters.timberPaint == "нет") carcasDescr += ", без покраски";
			else timberPaint += ", отделка " + parameters.timberPaint;
		}
		
		if(parameters.calcType == "railing"){
			carcasDescr = "бетон";
		}
		
		//ступени
		var treadsDescr = "";
		if(parameters.stairType != "массив") treadsDescr += parameters.stairType;
		if(parameters.stairType == "массив") treadsDescr += parameters.treadsMaterial;
		if(parameters.calcType == "vint") treadsDescr = parameters.treadsMaterial;
		if(parameters.riserType == "есть") treadsDescr += " с подступенками";
		if(parameters.timberPaint == "нет" || parameters.timberPaint == "не указано") treadsDescr += " без покраски";
		else treadsDescr += " покраска " + parameters.timberPaint;
		if(parameters.stairType == "нет") treadsDescr = "нет";
		
	
		//ограждения
		
		var railingDescr = parameters.railingModel;	
		
		if(parameters.calcType == "railing"){
			var railingTypes = [];
			railingDescr = ""
			$(".railingType").each(function(){
				var val = $(this).val();
				if(railingTypes.indexOf(val) == -1) {					
					if(railingTypes.length > 0) railingDescr += ", "
					railingDescr += val;
					railingTypes.push(val);
				}
			})
		}
	
		//поручень
		if(parameters.calcType == 'vint') railingDescr += ", поручень " + parameters.handrailMaterial;
		else{
			if(parameters.handrail == "массив") railingDescr += ", поручень " + parameters.handrailsMaterial;
			if(parameters.handrail != "массив" && parameters.handrail != "нет") railingDescr += ", поручень " + parameters.handrail;
		}
		//стойки
		if (parameters.railingModel == "Ригели" || parameters.railingModel == "Стекло на стойках"){
			railingDescr += ", стойки " + parameters.banisterMaterial;
		}
		if(!units.railing) railingDescr = "нет"
		
		//доставка, сборка
		var assemblingDescr = "нет"
		if(parameters.delivery == "Москва" || parameters.delivery == "Московская обл.") assemblingDescr = "доставка включена"
		if(parameters.delivery == "транспортная компания") assemblingDescr = "доставка до транспортной компании включена"
		
		if(parameters.isAssembling == "есть") assemblingDescr += ", сборка включена"
		
	
		var price = priceObj['total'].discountPrice;
	}
	
	if (par.priceItem && !par.forceUpdate) {
		var carcasDescr = par.priceItem.carcasDescr;
		var treadsDescr = par.priceItem.treadsDescr;
		var railingDescr = par.priceItem.railingDescr;
		var assemblingDescr = par.priceItem.assemblingDescr;
		var price = par.priceItem.price;
	}
	
	var sections = {
		carcasDescr: {
			name: "Каркас",
			text: carcasDescr,
		},
		treadsDescr: {
			name: "Ступени",
			text: treadsDescr,
		},
		railingDescr: {
			name: "Ограждение",
			text: railingDescr,
		},
		assemblingDescr: {
			name: "Доставка, сборка",
			text: assemblingDescr,
		},
	};
	
	//описание для навесов
	if(parameters && parameters.calcType == "carport"){
		sections = {
			geom: {name: "Геометрия"},
			carcas: {name: "Каркас"},
			roof: {name: "Кровля"},
			assemblingDescr: {
				name: "Доставка, сборка",
				text: assemblingDescr,
			},
		};
		
		//геометрия
		sections.geom.text = parameters.carportType;
		if(parameters.roofType == "Арочная") sections.geom.text += " арочный"
		if(parameters.roofType == "Плоская") sections.geom.text += " плоский"

		sections.geom.text += ", " + parameters.width + "х" + (parameters.sectAmt * parameters.sectLen + parameters.frontOffset * 2) + ". ";
		
		//каркас
		sections.carcas.text = "Балки - ";
		if(parameters.beamModel == "сужающаяся" || parameters.beamModel == "постоянной ширины") sections.carcas.text += "из листа " + parameters.trussThk + " мм"
		if(parameters.beamModel == "ферма постоянной ширины") sections.carcas.text += "сварные фермы из проф. трубы " + parameters.chordProf + " и " + parameters.webProf;
		if(parameters.beamModel == "проф. труба") sections.carcas.text += "из проф. трубы " + parameters.beamProf + " и " + parameters.beamProf2
		sections.carcas.text += ", колонны " + parameters.columnProf + 
			". Покраска порошковая"
		
		//покрытие
		sections.roof.text = parameters.roofMat + " " + parameters.roofThk + " мм";
		if(parameters.wallMat != "нет") sections.roof.text += ". Стенки " + parameters.wallMat;		
	}
		
	
	var text = 
	'<div class="priceItem selected" data-id="' + id + '">' + 
		'<div class="prices-block clearfix">' + 
			'<div class="price-name text-center editable" data-key="name">' + par.name + '</div>' + 
			'<div class="text-wrap text-center">';
	
	for(var sectId in sections){
		var section = sections[sectId]
		text += '<div class="info-block ' + sectId + '">' + 
			'<div class="name">' + section.name + ':</div>' + 
			'<p class="editable" data-key="' + section.name + '">' + section.text +'</p>' + 
		'</div>' + 
		'<div class="shadow"></div>';
	}
	
	text +=
		'</div>' + 
			'<div class="price-block text-center">' + 
				'<span class="price-old  number"> ' + Math.round(price / 0.7) + ' </span>' + 
				'<span class="price-new  number">' + price + ' руб.</span>' + 
			'</div>' + 
			'<div class="show-price-item text-center noPrint">' + 
				'<button class="btn btn-primary">Применить</button>' +
			'</div>' + 
		'</div>' + 
	'</div>';


	if (!par.priceItem) par.priceItem = {};	
	for(var sectId in sections){
		par.priceItem[sectId] = sections[sectId].text;
	}
	par.priceItem.price = price;

	
	return text;//{text: text, item: priceItem};
}

function getPriceBlockName(id){
	var name = "";
	if (params.priceItems && params.priceItems.length > 0) {		
		var priceItem = getArrItemByProp(params.priceItems, 'id', id);
		name = priceItem.name;
	}
	if(!name && !window.isMulti) name = "Вариант " + (id+1);
	if(!name && window.isMulti) name = "Лестница " + (id+1);
	return name;
}

function addPriceBlock(priceItemParams){
	var id = 0;
	if(params.priceItems) {
		$.each(params.priceItems, function(){
			if(this.id >= id) id = this.id + 1;
		})
	}

	if(currentPriceItem == null) currentPriceItem = id;

	var priceBlockTextPar = {
		id: id,
	};
	getPriceBlockText(priceBlockTextPar);

	if (!params.priceItems) params.priceItems = [];
	var priceItem = {
		id: id,
		name: priceBlockTextPar.name,
		params: {},
		carcasDescr: priceBlockTextPar.priceItem.carcasDescr,
		treadsDescr: priceBlockTextPar.priceItem.treadsDescr,
		railingDescr: priceBlockTextPar.priceItem.railingDescr,
		assemblingDescr: priceBlockTextPar.priceItem.assemblingDescr,
		price: priceBlockTextPar.priceItem.price
	}
	if (priceItemParams) {
		priceItem.params = priceItemParams;
	}else{
		// Записываем текущие значения инпутов
		getAllInputsValues(priceItem.params);
	}
	var isUniq = true;
	if (!window.isMulti) {
		params.priceItems.forEach(function(pi){
			var result = compareParams(pi.params, priceItem.params);
			if (result.isEqual) {
				isUniq = false;
			}
		});
	}

	if (isUniq) {
		params.priceItems.push(priceItem);
		redrawPriceItems();
	}else{
		alert('Комплектации должны различаться');
	}

	return id
}

/*!
 * Find the differences between two objects and push to a new object
 * (c) 2019 Chris Ferdinandi & Jascha Brinkmann, MIT License, https://gomakethings.com & https://twitter.com/jaschaio
 * @param  {Object} obj1 The original object
 * @param  {Object} obj2 The object to compare against it
 * @return {Object}      An object of differences between the two
 */
var diff = function (obj1, obj2) {

    // Make sure an object to compare is provided
    if (!obj2 || Object.prototype.toString.call(obj2) !== '[object Object]') {
        return obj1;
    }

    //
    // Variables
    //

    var diffs = {};
    var key;


    //
    // Methods
    //

    /**
     * Check if two arrays are equal
     * @param  {Array}   arr1 The first array
     * @param  {Array}   arr2 The second array
     * @return {Boolean}      If true, both arrays are equal
     */
    var arraysMatch = function (arr1, arr2) {

        // Check if the arrays are the same length
        if (arr1.length !== arr2.length) return false;

        // Check if all items exist and are in the same order
        for (var i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }

        // Otherwise, return true
        return true;

    };

    /**
     * Compare two items and push non-matches to object
     * @param  {*}      item1 The first item
     * @param  {*}      item2 The second item
     * @param  {String} key   The key in our object
     */
    var compare = function (item1, item2, key) {

        // Get the object type
        var type1 = Object.prototype.toString.call(item1);
        var type2 = Object.prototype.toString.call(item2);

        // If type2 is undefined it has been removed
        if (type2 === '[object Undefined]') {
            diffs[key] = null;
            return;
        }

        // If items are different types
        if (type1 !== type2) {
            diffs[key] = item2;
            return;
        }

        // If an object, compare recursively
        if (type1 === '[object Object]') {
            var objDiff = diff(item1, item2);
            if (Object.keys(objDiff).length > 0) {
                diffs[key] = objDiff;
            }
            return;
        }

        // If an array, compare
        if (type1 === '[object Array]') {
            if (!arraysMatch(item1, item2)) {
                diffs[key] = item2;
            }
            return;
        }

        // Else if it's a function, convert to a string and compare
        // Otherwise, just compare
        if (type1 === '[object Function]') {
            if (item1.toString() !== item2.toString()) {
                diffs[key] = item2;
            }
        } else {
            if (item1 !== item2 ) {
                diffs[key] = item2;
            }
        }

    };


    //
    // Compare our objects
    //

    // Loop through the first object
    for (key in obj1) {
        if (obj1.hasOwnProperty(key)) {
            compare(obj1[key], obj2[key], key);
        }
    }

    // Loop through the second object and find missing items
    for (key in obj2) {
        if (obj2.hasOwnProperty(key)) {
            if (!obj1[key] && obj1[key] !== obj2[key] ) {
                diffs[key] = obj2[key];
            }
        }
    }

    // Return the object of differences
    return diffs;

};

function reindexPriceItems(){
	// $(".priceItem").each(function(i){
	// 	var text = "Вариант " + (i+1);
	// 	$(this).find(".price-name").text(text)
	// });
	params.priceItems.forEach(function(item, i){
		item.name = 'Вариант ' + (i + 1);
	})
	redrawPriceItems();
}

function setTreadDescr(par){
	
	var stairType = params.stairType;
	if(stairType == "массив") stairType = params.treadsMaterial;
	if(par.timberType) stairType = par.timberType;

	$("#stairsDiv").show();
	if (stairType =="нет") $("#stairsDiv").hide();

	var stairsHeader = "Ступени из 100% массива хвойных пород";
	var stairMaterial = "дерево";
	var stairsImage = "001.jpg";
	var stairsText_1 = "";
	var stairsText_2 = "";
	var stairsText_3 = "";
	var stairsText_4 = "";

		
	if (stairType =="сосна экстра") {
		stairsHeader = "Ступени из 100% массива сосны класса Экстра без сучков и других дефектов";
		stairMaterial = "дерево";
		stairsImage = "pine_prem.jpg";
	}
	if (stairType =="лиственница паркет.") {
		stairsHeader = "Ступени из 100% массива сибирской лиственницы класса Экстра без сучков и других дефектов";
		stairMaterial = "дерево";
		stairsImage = "larch.jpg";
	}
	if (stairType =="лиственница ц/л") {
		stairsHeader = "Ступени из 100% массива сибирской лиственницы класса Экстра без сучков и других дефектов";
		stairMaterial = "дерево";
		stairsImage = "larch_prem.jpg";
	}
	if (stairType =="береза паркет.") {
		stairsHeader = "Ступени из 100% массива березы";
		stairMaterial = "дерево";
		stairsImage = "002.jpg";
	}
	if (stairType =="дуб паркет.") {
		stairsHeader = "Ступени из 100% массива дуба";
		stairMaterial = "дерево";
		stairsImage = "003.jpg";
	}
	if (stairType =="дуб ц/л") {
		stairsHeader = "Ступени из 100% массива дуба класса Экстра";
		stairMaterial = "дерево";
		stairsImage = "004.jpg";
	}
	
	if (stairType =="дуб натур") {
		stairsHeader = "Ступени из слэбов дуба";
		stairMaterial = "дерево";
		stairsImage = "oak_slab.jpg";
	}
	
	if (stairType =="карагач натур") {
		stairsHeader = "Ступени из слэбов карагача";
		stairMaterial = "дерево";
		stairsImage = "elm_slab.jpg";
	}
	
	if (stairType =="ясень ц/л") {
		stairsHeader = "Ступени из ясеня";
		stairMaterial = "дерево";
		stairsImage = "ash.jpg";
	}

	if (stairType =="ясень паркет.") {
		stairsHeader = "Ступени из ясеня";
		stairMaterial = "дерево";
		stairsImage = "ash_01.jpg";
	}

	if (stairType =="рифленая сталь") {
		stairsHeader = "Ступени из рифленой стали";
		stairsText_1 = "Ступени полностью металлические с покрытием из нескользкого рифленого стального листа;";
		stairsText_2 = "Ступени имеют усиленную конструкцию и каждая ступень выдерживает нагрузку до 250кг;";
		stairsText_3 = "Металлические ступени идеально подходят для уличных лестниц";
		stairMaterial = "металл";
		stairsImage = "005.jpg";
	}
	if (stairType =="рифленый алюминий") {
		stairsHeader = "Ступени с покрытием из рифленого алюминия";
		stairsText_1 = "Ступени состоят из несущеей стальной рамки и покрытия из рифленого алюминия;";
		stairsText_2 = "Ступени имеют усиленную конструкцию и каждая ступень выдерживает нагрузку до 250кг;";
		stairsText_3 = "Покрытие из алюминия великолепно выглядит, не ржавеет, с него не стирается краска при ходьбе";
		stairMaterial = "рамки";
		stairsImage = "006.jpg";
	}
	if (stairType =="лотки") {
		stairsHeader = "Лотковые ступени под плитку"
		stairsText_1 = "Ступени предвтавляют собо сварной лоток, который заливается бетоном и облицовывается плиткой или камнем;";
		stairsText_2 = "Ступени имеют усиленную конструкцию и каждая ступень выдерживает нагрузку до 250кг;";
		stairsText_3 = "Ступени, облицованные плиткой идеально подходят для лестниц в общественных местах с большой проходимостью";
		stairMaterial = "металл";
		stairsImage = "007.jpg";
	}
	if (stairType =="дпк") {
		stairsHeader = "Ступени из террасной доски ДПК"
		stairsText_1 = "Ступени состоят из несущеей стальной рамки и покрытия террасной доски ДПК;";
		stairsText_2 = "Ступени имеют усиленную конструкцию и каждая ступень выдерживает нагрузку до 250кг;";
		stairsText_3 = "Cтупени из террасной доски великолепно выглядят, нескользкие и долговечные;";
		stairMaterial = "рамки";
		stairsImage = "008.jpg";
	}
	if (stairType =="пресснастил") {
		stairsHeader = "Ступени из решетчатого настила";
		stairsText_1 = "Ступени предвтавляют собой решетку из стальных полос, поставленных на ребро;";
		stairsText_2 = "Ступени имеют усиленную конструкцию и каждая ступень выдерживает нагрузку до 250кг;";
		stairsText_3 = "Зимой на решетчатых ступенях не задерживается снег;";
		stairsText_4 = "Ступени защищены от коррозии методом горячего цинкования;";
		stairsImage = "009.jpg";
	}
	if (stairType =="стекло") {
		stairsHeader = "Ступени из многослойного стекла";
		stairsText_1 = "Ступени состоят из несущеей стальной рамки и покрытия из двухслойного закаленного стекла толщиной 20мм;";
		stairsText_2 = "Ступени имеют усиленную конструкцию и каждая ступень выдерживает нагрузку до 250кг;";
		stairsText_3 = "Стеклянные ступени идеальный вариант при оформлении интерьера в стие Хайтек;";
		stairMaterial = "рамки";
		stairsImage = "010.jpg";
	}

	if (stairMaterial == "дерево") {
		stairsText_1 = "Ступени склеены на немецкой линии сращивания клеем класса D3. Прочность склейки превышает прочность дерева;";
		stairsText_2 = "Дерево тщательно высушено до влажности 8%. Благодаря этому ступени не потрескаются и не покоробятся в процессе эксплуатации;";
		if (params.timberPaint == "нет"){
			stairsText_3 = "Для красоты и безопасности верхние грани аккуратно скруглены фрезером;";
			stairsText_4 = "Ступени поставляются отшлифованными и подготовленными к покраске";
		}
		if (params.timberPaint == "лак") {
			stairsText_3 = "Ступени покрываются в 3 слоя специальным износостойким двухкомпонентным паркетным лаком итальянского производства;";
			stairsText_4 = "Лак имеет нескользкую и приятную на ощупь полуматовую поверхность. Отделка прозрачным лаком без тонировки подчеркивает красоту натурального дерева;";
		}
		if (params.timberPaint == "морилка+лак") {
			stairsText_3 = "Ступени покрываются в 3 слоя специальным износостойким двухкомпонентным паркетным лаком итальянского производства;";
			stairsText_4 = "Лак имеет нескользкую и приятную на ощупь полуматовую поверхность. Перед нанесением лака ступени тонируются в выбранный Вами цвет";
		}
	}
		
	if (stairMaterial == "металл") { 
		if (metalPaint == "нет") stairsText_4 = "Ступени поставляются зачищенными и подготовленными к покраске;";
		if (metalPaint == "грунт") stairsText_4 = "Ступени зачищаются и покрываются антикоррозийным гнутом;";
		if (metalPaint == "порошок") stairsText_4 = "Ступени покрываются красивой, прочной и долговечной порошковой краской;";
		if (metalPaint == "автоэмаль") stairsText_4 = "Ступени шпаклюются, шлифуются и покрываются высокоглянцевой автомобильной эмалью;";
	}

	if (stairMaterial == "рамки") { 
		if (metalPaint == "нет") stairsText_4 = "Рамки ступеней поставляются зачищенными и подготовленными к покраске;";
		if (metalPaint == "грунт") stairsText_4 = "Рамки ступеней зачищаются и покрываются антикоррозийным гнутом;";
		if (metalPaint == "порошок") stairsText_4 = "Рамки ступеней покрываются красивой, прочной и долговечной порошковой краской;";
		if (metalPaint == "автоэмаль") stairsText_4 = "Рамки ступеней шпаклюются, шлифуются и покрываются высокоглянцевой автомобильной эмалью;";
	}
	
	par.imgLink = "/images/calculator/stairs/" + stairsImage;
	
	if(params.calcType == "slabs") return par
	
	$('#stairsHeader').html(stairsHeader);
	$('#stairsImage').html("<a href='" + par.imgLink + "' rel='fancy'><img src='" + par.imgLink + "' width='300px'></a>");
	$('#stairsText_1').html(stairsText_1); 
	$('#stairsText_2').html(stairsText_2);
	$('#stairsText_3').html(stairsText_3);
	$('#stairsText_4').html(stairsText_4);

	if (!stairsText_1) $('#stairsText_1').hide();
	if (!stairsText_2) $('#stairsText_2').hide();
	if (!stairsText_3) $('#stairsText_3').hide();
	if (!stairsText_4) $('#stairsText_4').hide();
}

function setRailingDescr(){
	/*ограждения*/
	/*показываем блок описания*/
	$("#railingDiv").hide();
	if(params.railingSide_1 != "нет") $("#railingDiv").show();
	if(params.railingSide_2 != "нет" && params.stairModel == "П-образная трехмаршевая") $("#railingDiv").show();
	if(params.railingSide_3 != "нет" && params.stairModel != "Прямая") $("#railingDiv").show();
	if(params.stairModel == "П-образная с площадкой" && params.backRailing_1 != "нет") $("#railingDiv").show();
	if(params.stairModel == "П-образная с забегом" && params.backRailing_2 != "нет") $("#railingDiv").show();
	if(params.platformTop == "площадка" && params.topPltRailing_5) $("#railingDiv").show();
	if (railingModel == "Деревянные балясины" || railingModel == "Дерево с ковкой" || railingModel == "Стекло") $("#railingDiv").hide();

	var railingModel = params.railingModel;
	var handrail = params.handrail;
	var rackType = params.banisterMaterial;
	var rigelMaterial = params.rigelMaterial;
	var rigelAmt = params.rigelAmt;

	var railingMetalPaint, railingTimberPaint, railingHeader, railingImage, 
	railingText_1, railingText_2, railingText_3, railingText_4, railingText_5, railingText_6;
	
	/*поручень*/
	if (handrail == "40х20 черн."){
		railingText_2 = "Поручень из профильной трубы 40х20мм из конструкционной стали";
		railingMetalPaint = "сталь";
	}
	if (handrail == "40х40 черн."){
		railingText_2 = "Поручень из профильной трубы 40х40мм из конструкционной стали";
		railingMetalPaint = "сталь";
	}
	if (handrail == "60х30 черн."){
		railingText_2 = "Поручень из профильной трубы 60х30мм из конструкционной стали";
		railingMetalPaint = "сталь";
	}
	if (handrail == "кованый полукруглый"){
		railingText_2 = "Кованый полукруглый поручень подчеркивает оригинальность ограждений;";
		railingMetalPaint = "сталь";
	}
	if (handrail == "40х40 нерж."){
		railingText_2 = "Поручень из квадратной нержавеющей трубы 40х40мм подчеркивает оригинальность ограждений;";
	}
	if (handrail == "Ф50 нерж."){
		railingText_2 = "Поручень из круглой нержавеющей трубы подчеркивает оригинальность ограждений;";
	}
	if (handrail == "Ф50 сосна"){
		railingText_2 = "Круглый поручень из массива сосны теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;";
		railingTimberPaint = "дерево";
	}
	if (handrail == "омега-образный сосна"){
		railingText_2 = "Классический фигурный поручень из массива сосны теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;";
		railingTimberPaint = "дерево";
	}
	if (handrail == "50х50 сосна"){
		railingText_2 = "Квадратный поручень из массива сосны теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;";
		railingTimberPaint = "дерево";
	}
	if (handrail == "40х60 береза"){
		railingText_2 = "Прямоугольный поручень из массива березы теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;";
		railingTimberPaint = "дерево";
	}
	if (handrail == "омега-образный дуб"){
		railingText_2 = "Классический фигурный поручень из массива дуба теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;";
		railingTimberPaint = "дерево";
	}
	if (handrail == "40х60 дуб"){
		railingText_2 = "Прямоугольный поручень из массива дуба теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;";
		railingTimberPaint = "дерево";
	}
	if (handrail == "40х60 дуб с пазом"){
		railingText_2 = "Прямоугольный поручень из массива дуба теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;";
		railingTimberPaint = "дерево";
	}
	if (handrail == "Ф50 нерж. с пазом"){
		railingText_2 = "Круглый нержавеющий поручень подчеркивает оригинальность ограждений;";
	}
	if (handrail == "40х60 нерж. с пазом"){
		railingText_2 = "Прямоугольный нержавеющий поручень подчеркивает оригинальность ограждений;";
	}	
	if (handrail == "нет"){
		railingText_2 = "Отсутствие поручня подчеркивает оригинальность ограждений;";
	}
	if (handrail == "массив"){
		railingText_2 = "Прямоугольный поручень из массива теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;";
		railingTimberPaint = "дерево";
	}
	if (handrail == "сосна"){
		railingText_2 = "Прямоугольный поручень из массива сосны теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;";
		railingTimberPaint = "дерево";
	}
	if (handrail == "береза"){
		railingText_2 = "Прямоугольный поручень из массива березы теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;";
		railingTimberPaint = "дерево";
	}
	if (handrail == "лиственница"){
		railingText_2 = "Прямоугольный поручень из массива лиственницы теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;";
		railingTimberPaint = "дерево";
	}
	if (handrail == "дуб паркет."){
		railingText_2 = "Прямоугольный поручень из массива дуба теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;";
		railingTimberPaint = "дерево";
	}
	if (handrail == "дуб ц/л"){
		railingText_2 = "Прямоугольный поручень из массива дуба теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;";
		railingTimberPaint = "дерево";
	}
	if (handrail == "ПВХ"){
		railingText_2 = "Круглый поручень из ПВХ, теплый и приятный на ощупь, подчеркивает оригинальный дизайн ограждений;";
		railingTimberPaint = "дерево";
	}

	railingImage = "001.jpg";
	
	if (railingModel == "Деревянные балясины") {
		railingHeader = "Деревянные балясины";
		railingText_1 = "Текст";
		railingImage = "001.jpg";
		railingText_3 = "Стойки из массива";
		railingMetalPaint = "дерево";
	}
	if (railingModel == "Дерево с ковкой") {
		railingHeader = "Кованные балясины";
		railingText_1 = "Текст";
		railingImage = "001.jpg";
		railingText_3 = "Стойки из массива";
		railingMetalPaint = "дерево";
	}
	if (railingModel == "Ригели") {
		railingHeader = "Ограждения с ригелями";
		railingText_1 = "Изящные минималистичные ограждения с горизонтальным заполнением (ригелями)";
		railingImage = "001.jpg";
		if (rackType == "40х40 черн.") {
			railingText_3 = "Стойки из квадратной профильной трубы 40х40мм из конструкционной стали";
			railingMetalPaint = "сталь";
		}
		if (rackType == "40х40 нерж+дуб") {
			railingText_3 = "Стойки квадратного сечения из нержавейки со вставками из массива дуба;";
			railingTimberPaint = "дерево";
		}
		if (rackType == "40х40 нерж.") {
			railingText_3 = "Стойки из профильной трубы 40х40мм из полированной нержавеющей стали;";
		}
		if (rigelMaterial == "20х20 черн.") {
			railingText_4 = "Ригеля из квадратной 20х20мм из конструкционной стали, " + rigelAmt + "шт.;"
			railingMetalPaint = "сталь";
		}
		if (rigelMaterial == "Ф12 нерж.") {
			railingText_4 = "Ригеля из круглой неравеющей трубки Ф12мм, " + rigelAmt + "шт.;"
		}
		if (rigelMaterial == "Ф16 нерж."){
			railingText_4 = "Ригеля из круглой неравеющей трубки Ф16мм, " + rigelAmt + "шт.;"	
		}
	}
	if (railingModel == "Стекло на стойках") {
		railingHeader = "Стеклянные ограждения на стойках";
		railingText_1 = "Ограждения в современном стиле со стеклом, установенным между стойкаи";
		railingImage = "003.jpg";
		if (rackType == "40х40 черн.") {
			railingText_3 = "Квадратные стойки из конструкционной стали сечением 40х40";
			railingMetalPaint = "сталь";
		}
		if (rackType == "40х40 нерж+дуб") {
			railingText_3 = "Стойки квадратного сечения из нержавейки со вставками из массива дуба;";
			railingTimberPaint = "дерево";
		}
		if (rackType == "40х40 нерж.") {
			railingText_3 = "Стойки квадратного сечения из полированной нержавеющей стали;";
		}
		railingText_4 = "Между стойками устанавливается закаленное стекло толщиной 8мм;"	
	}
	if (railingModel == "Экраны лазер") {
		railingHeader = "Ограждения с резными металлическими вставками";
		railingText_1 = "Оригинальные ограждения в современном стиле с резными металлическими вставками, установенным между стойкаи";
		railingImage = params.laserModel + ".jpg";
		if (rackType == "40х40 черн.") {
			railingText_3 = "Квадратные стойки из конструкционной стали сечением 40х40";
			railingMetalPaint = "сталь";
			}
		if (rackType == "40х40 нерж+дуб") {
			railingText_3 = "Стойки квадратного сечения из нержавейки со вставками из массива дуба;";
			railingTimberPaint = "дерево";
			}
		if (rackType == "40х40 нерж.") {
			railingText_3 = "Стойки квадратного сечения из полированной нержавеющей стали;";
			}
		railingText_4 = "Между стойками устанавливаются вставки с вырезанным на них узором. Толщина вставок 4мм;"	
	}
	if (railingModel == "Самонесущее стекло") {
		railingHeader = "Стеклянные ограждения без стоек";
		railingText_1 = "Стильные полностью стеклянные ограждения. Толстое закаленное стекло крепится прямо к торцу марша";
		railingImage = "004.jpg";
		railingText_3 = "Ограждение из толстого закаленного стекла толщиной 12мм;"
		railingText_4 = "";
	}
	if (railingModel == "Кованые балясины") {
		railingHeader = "Ограждения с коваными балясинами";
		railingText_1 = "Классические ограждения с металлическими коваными балясинами";
		railingImage = "002.jpg";
		railingMetalPaint = "сталь";
		railingText_3 = "Рисунок ограждения в соответствии с эскизом (см. внизу предложения)";
		railingText_4 = "";
	}
	if (railingModel == "Решетка") {
		railingHeader = "Ограждения в виде решетки из квадратных профилей";
		railingText_1 = "Стильное ограждение из квадратного профиля в современном стиле";
		railingImage = "002.jpg";
		railingMetalPaint = "сталь";
		railingText_3 = "Рисунок ограждения в соответствии с эскизом (см. внизу предложения)";
		railingText_4 = "";
	}

	if (railingMetalPaint == "сталь") {
		if (metalPaint == "нет") railingText_5 = "Металлические детали ограждений поставляются зачищенными и подготовленными к покраске;";
		if (metalPaint == "грунт") railingText_5 = "Металлические детали ограждений зачищаются и покрываются антикоррозийным гнутом;";
		if (metalPaint == "порошок") railingText_5 = "Металлические детали ограждений покрываются красивой, прочной и долговечной порошковой краской;";
		if (metalPaint == "автоэмаль") railingText_5 = "Металлические детали ограждений шпаклюются, шлифуются и покрываются высокоглянцевой автомобильной эмалью;";
	}
	if (railingTimberPaint == "дерево"){
		if (timberPaint == "нет") railingText_6 = "Деревянные детали ограждений поставляются отшлифованными и подготовленными к покраске";
		if (timberPaint == "лак") railingText_6 = "Деревянные детали ограждений покрываются прозрачным лаком";
		if (timberPaint == "морилка+лак") railingText_6 = "Деревянные детали ограждений тонируются в выбранный Вами цвет и покрываются лаком";
	}

	var railingImgPath = "/images/calculator/railing/lt/";
	if (railingModel == "Экраны лазер") railingImgPath = "/images/calculator/railing/laser/";

	$('#railingHeader').html(railingHeader);
	$('#railingImage').html("<a href='" + railingImgPath + railingImage + "' rel='fancy'><img src='" + railingImgPath + railingImage + "' width='300px'></a>");
	$('#railingText_1').html(railingText_1);
	$('#railingText_2').html(railingText_2);
	$('#railingText_3').html(railingText_3);
	$('#railingText_4').html(railingText_4);
	$('#railingText_5').html(railingText_5);
	$('#railingText_6').html(railingText_6);

	if (!railingText_4) $('#railingText_4').hide();
	if (railingText_4) $('#railingText_4').show();

	if (!railingText_5) $('#railingText_5').hide();
	if (railingText_5) $('#railingText_5').show();

	if (!railingText_6) $('#railingText_6').hide();
	if (railingText_6) $('#railingText_6').show();

	if (!railingText_1) $("#railingText_1").hide();
	if (!railingText_2) $("#railingText_2").hide();
	if (!railingText_3) $("#railingText_3").hide();
	if (!railingText_4) $("#railingText_4").hide();
	if (!railingText_5) $("#railingText_5").hide();
	if (!railingText_6) $("#railingText_6").hide();
}