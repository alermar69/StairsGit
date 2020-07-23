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

			$(".priceItem.selected").replaceWith(addPriceBlock(true));
			formatNumbers();
			updatePriceItemsSelect()
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
			console.log(currentValue, id)
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
		applyPriceItem(id);
		$("#priceItemsSelectWrap select").val(id);
	});

	//Пересчитать цены
	$("#recalculatePrices").click(function(){
		updatePriceItems();
	});

	//упорядочить названия	
	$("#reindexPriceItems").click(function(){
		reindexPriceItems();
		updatePriceItemsSelect()
	});
	
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
		applyPriceItem(id);
	})
	
});

function updatePriceItems(i){
	if(!i) i = 0;
	var priceItem = params.priceItems[i];
	if (priceItem) {
		updatePriceItem(priceItem).finally(function(resolve){
			updatePriceItems(i + 1)
		});
	}
}

function updatePriceItem(priceItem){
	return new Promise(function(resolve){
		var keys = Object.keys(priceItem.params);
		$.each(keys, function(){
			$('#' + this).val(priceItem.params[this]);
		});
		recalculate().finally(function(){
			priceItem.price = staircasePrice.finalPrice;
			$('.priceItem[data-id="' + i + '"] .price-old').html(' ' + Math.round(priceItem.price / 0.7) + ' ');
			$('.priceItem[data-id="' + i + '"] .price-new').html(priceItem.price + ' руб.');

			redrawPriceItems();
			formatNumbers();

			resolve();
		});
	});
}

function applyPriceItem(id){
	if(id == null) return;

	var priceItem = getArrItemByProp(params.priceItems, 'id', id);
	var keys = Object.keys(priceItem.params);
	$.each(keys, function(){
		if(this != "") $('#' + this).val(priceItem.params[this]);
	});

	changeAllForms();
	recalculate();

}

function redrawPriceItems(){
	$("#priceItemsWrap").html("");	
	if (params.priceItems && params.priceItems.length > 0) {
		for (var i = 0; i < params.priceItems.length; i++) {
			var priceItem = params.priceItems[i];
			var priceBlockTextPar = {
				id: priceItem.id, 
				priceItem: priceItem
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
	
	if (params.priceItems && params.priceItems.length > 0) {
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
	var id = par.id;
	par.name = getPriceBlockName(id);
	
	if (!par.priceItem) {
		var units = staircaseHasUnit();
	
		//каркас
		var carcasDescr = "металлический, модель " + params.model;
		if(params.metalPaint != "порошок") carcasDescr += ", без покраски";
		else carcasDescr += ", покраска порошковая";
		if(params.isCarcas == "нет") carcasDescr = "нет";
		
		if(params.calcType == "timber" || params.calcType == "timber_stock"){
			var carcasDescr = "деревянный, модель " + params.model;
			if(params.timberPaint == "не указано" || params.timberPaint == "нет") carcasDescr += ", без покраски";
			else timberPaint += ", отделка " + params.timberPaint;
		}
		
		//ступени
		var treadsDescr = "";
		if(params.stairType != "массив") treadsDescr += params.stairType;
		if(params.stairType == "массив") treadsDescr += params.treadsMaterial;
		if(params.calcType == "vint") treadsDescr = params.treadsMaterial;
		if(params.riserType == "есть") treadsDescr += " с подступенками";
		if(params.timberPaint == "нет" || params.timberPaint == "не указано") treadsDescr += " без покраски";
		else treadsDescr += " покраска " + params.timberPaint;
		if(params.stairType == "нет") treadsDescr = "нет";
		
		
		//ограждения
		
		var railingDescr = params.railingModel;	
		
	
		//поручень
		if(params.calcType == 'vint') railingDescr += ", поручень " + params.handrailMaterial;
		else{
			if(params.handrail == "массив") railingDescr += ", поручень " + params.handrailsMaterial;
			if(params.handrail != "массив" && params.handrail != "нет") railingDescr += ", поручень " + params.handrail;
		}
		//стойки
		if (params.railingModel == "Ригели" || params.railingModel == "Стекло на стойках"){
			railingDescr += ", стойки " + params.banisterMaterial;
		}
		
		
		if(!units.railing) railingDescr = "нет"
		
		//доставка, сборка
		var assemblingDescr = "нет"
		if(params.delivery == "Москва" || params.delivery == "Московская обл.") assemblingDescr = "доставка включена"
		if(params.delivery == "транспортная компания") assemblingDescr = "доставка до транспортной компании включена"
		
		if(params.isAssembling == "есть") assemblingDescr += ", сборка включена"
	
		var price = staircasePrice.finalPrice;
	}
	if (par.priceItem) {
		var carcasDescr = par.priceItem.carcasDescr;
		var treadsDescr = par.priceItem.treadsDescr;
		var railingDescr = par.priceItem.railingDescr;
		var assemblingDescr = par.priceItem.assemblingDescr;
		var price = par.priceItem.price;
	}

	var text = 
	'<div class="priceItem selected" data-id="' + id + '">' + 
		'<div class="prices-block clearfix">' + 
			'<div class="price-name text-center editable" data-key="name">' + par.name + '</div>' + 
			'<div class="text-wrap text-center">' + 
				'<div class="info-block carcasDescr">' + 
					'<div class="name">Каркас:</div>' + 
					'<p class="editable" data-key="carcasDescr">' + carcasDescr +'</p>' + 
				'</div>' + 
				'<div class="shadow"></div>' + 
				'<div class="info-block treadsDescr">' + 
					'<div class="name">Ступени:</div>' + 
					'<p class="editable" data-key="treadsDescr">' + treadsDescr + '</p>' + 
				'</div>' + 
				'<div class="shadow"></div>' + 
				'<div class="info-block railingDescr">' + 
					'<div class="name">Ограждение:</div>' + 
					'<p class="editable" data-key="railingDescr">' + railingDescr + '</p>' + 
				'</div>' + 
				'<div class="shadow"></div>' + 
				'<div class="info-block assemblingDescr">' + 
					'<div class="name">Доставка, сборка:</div>' + 
					'<p class="editable" data-key="assemblingDescr">' + assemblingDescr + '</p>' + 
				'</div>' + 
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

	if (!par.priceItem) {
		par.priceItem = {
			carcasDescr: carcasDescr,
			treadsDescr: treadsDescr,
			railingDescr: railingDescr,
			assemblingDescr: assemblingDescr,
			price: price
		}
	}
	return text;//{text: text, item: priceItem};
}

function getPriceBlockName(id){
	var name = "";
	if (params.priceItems && params.priceItems.length > 0) {		
		var priceItem = getArrItemByProp(params.priceItems, 'id', id);
		name = priceItem.name;
	}
	if(!name) name = "Вариант " + (id+1);
	return name;
}

function addPriceBlock(noPrint){
	var id = 0;
	if(params.priceItems) {
		$.each(params.priceItems, function(){
			if(this.id >= id) id = this.id + 1;
		})
	}

	var priceBlockTextPar = {
		id: id,		
		};
	var text = getPriceBlockText(priceBlockTextPar);

	if(!noPrint) {
		$("#priceItemsWrap").append(text);
		formatNumbers();
	}

	if (!params.priceItems) params.priceItems = [];
	var params_copy = Object.assign({}, params);
	delete params_copy.materials;//Удаляем материалы
	delete params_copy.priceItems;

	var priceItem = {
		id: id,
		name: priceBlockTextPar.name,
		params: params_copy,
		carcasDescr: priceBlockTextPar.priceItem.carcasDescr,
		treadsDescr: priceBlockTextPar.priceItem.treadsDescr,
		railingDescr: priceBlockTextPar.priceItem.railingDescr,
		assemblingDescr: priceBlockTextPar.priceItem.assemblingDescr,
		price: priceBlockTextPar.priceItem.price
	}
	params.priceItems.push(priceItem);
	
	return text;

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
	$(".priceItem").each(function(i){
		var text = "Вариант " + (i+1);
		$(this).find(".price-name").text(text)
	});
}

function setTreadDescr(){
	var stairType = params.stairType;
	if(stairType == "массив") stairType = params.treadsMaterial;

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

	$('#stairsHeader').html(stairsHeader);
	$('#stairsImage').html("<a href='/calculator/images/stairs/" + stairsImage + "' rel='fancy'><img src='/calculator/images/stairs/" + stairsImage + "' width='300px'></a>");
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

	var railingImgPath = "/calculator/images/railing/lt/";
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