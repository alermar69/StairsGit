$(function () {
	
});

function calcPrice(){
	
	//наценка
	var margin = 3 * params.priceFactor;
	
	var priceObj = {
		product: 0,
		assembling: 0,
		delivery: 0,
		metal: 0,
		timber: 0,
		partners: 0,
		total: 0,
	}
	var costObj = {
		product: 0,
		assembling: 0,
		delivery: 0,
		metal: 0,
		timber: 0,
		partners: 0,
		total: 0,
		area: 0,
	}
	
	$(".estimateItem").each(function(){
		var $row = $(this);
		
		//расчет себестоимости и цены за единицу
		var type = $row.find(".unitType").val();
		var amt = $row.find(".amt").val();
		var cost = 0;
		
		
	//столешницы, подоконники
		if(type == "столешница" || type == "подоконник" || type == "изготовление столешницы") {
			//дерево
			var model = $row.find(".model").val();
			var area = $row.find(".len").val() * $row.find(".width").val() / 1000000;
			var vol = area * $row.find(".thk").val() / 1000;
			var timberType = $row.find(".timberType").val();
			var m3Cost = calcTimberParams(timberType).m3Price;
			if(model == "слэб цельный") m3Cost = 200000;
			if(model == "шпон") m3Cost = 100000;
			
			
			var timberCost = vol * m3Cost;
			var workCost = 0;
			
			//упрощенный расчет стоимости работы
			if(type == "изготовление столешницы") {
				timberCost = 0;
				workCost = 5000 + area * 1000;
			}
			
			//покраска
			var paintCost = calcTimberPaintPrice(params.timberPaint, timberType) * area * 1.5; //1.5 учитывает торцы и низ
			
			//река
			var riverWidth = $row.find(".riverWidth").val();
			var riverArea = $row.find(".riverWidth").val() * $row.find(".len").val() / 1000000;
			var resinVol = riverArea * $row.find(".thk").val();
			if(type == "изготовление столешницы") resinVol = $row.find(".resinVol").val();
			if(model == "слэб + смола непрозр.") resinVol *= 0.5 //к-т учитывает заполнитель
		
			var riverCost = 0;
			var resinLiterCost = 1500;
			if(model == "слэб + смола прозр." || model == "слэб + смола непрозр." || type == "изготовление столешницы") {
				riverCost += riverArea * resinVol * resinLiterCost;				
			}
			if(model == "слэб + стекло") riverCost += riverArea * 12000 + 2000; //12к - цена стекла за м2, 2к - работа по фрезеровке 
		
			var cost = timberCost + workCost + paintCost + riverCost;			
			
			$row.find("input.cost").val(Math.round(cost * amt));
			$row.find(".unitPrice").val(Math.round(cost * margin));
			
			$row.find(".metalPart").val(0);
			$row.find(".timberPart").val(100);
			$row.find(".partnersPart").val(0);
			
			costObj.area += area * $row.find(".amt").val();
		}

	//выравнивание слэбов
		if(type == "выравнивание плоскости") {
			var area = $row.find(".len").val() * $row.find(".width").val() / 1000000;
			
			var cost = 1000 + area * 500;
			
			$row.find("input.cost").val(Math.round(cost * amt));
			$row.find(".unitPrice").val(Math.round(cost * margin));
			
			$row.find(".metalPart").val(0);
			$row.find(".timberPart").val(100);
			$row.find(".partnersPart").val(0);
			
			costObj.area += area * $row.find(".amt").val();
		}
		
	//подстолья
		if(type == "подстолье") {
			var height = $row.find(".height").val() * 1.0
			var width = $row.find(".width").val() * 1.0;
			var cost = 5000;
			var model = $row.find(".baseModel").val();
			if(model.indexOf("S") != -1) cost = 7500;
			if(model.indexOf("D") != -1) cost = 15000;
			
			//учитываем размеры
			var profLen = (height + width) * 2;
			var nominalProfLen = (700 + 600) * 2;

			cost = cost * 0.7 + (cost * 0.3 * profLen / nominalProfLen);
			
			$row.find("input.cost").val(Math.round(cost * amt));
			$row.find(".unitPrice").val(Math.round(cost * margin));
			
			$row.find(".metalPart").val(100);
			$row.find(".timberPart").val(0);
			$row.find(".partnersPart").val(0);
		}
	
		//фасады
		if(type == 'фасад мдф' || type == 'фасад массив') {
	
			var area = $row.find(".height").val() * $row.find(".width").val() / 1000000;
			var geom = $row.find(".geom").val();
			var timberType = $row.find(".timberType").val();
			var thk = $row.find(".thk").val()
		
			var m3Cost = calcTimberParams(timberType).m3Price;
			var m2Cost = m3Cost * 0.02;
			if(thk > 20) m2Cost = m3Cost * 0.04;
			if(thk > 40) m2Cost = m3Cost * 0.06;
			
			if(type == 'фасад мдф') m2Cost = 1000;

			var timberCost = area * m2Cost;
			
			//упрощенный расчет стоимости работы
			var workCost = 500 + area * 1000;

			//покраска
			var paintCost = calcTimberPaintPrice(params.timberPaint, timberType) * area * 2.2; //2.2 учитывает торцы и низ
			
			var cost = timberCost + workCost + paintCost;	
			
			if(cost < 1000) cost = 1000;
			
			$row.find("input.cost").val(Math.round(cost * amt));
			$row.find(".unitPrice").val(Math.round(cost * margin));
			
			$row.find(".metalPart").val(0);
			$row.find(".timberPart").val(100);
			$row.find(".partnersPart").val(0);
			
			costObj.area += area * $row.find(".amt").val();
			
			console.log(area, $row.find(".amt").val(), area * $row.find(".amt").val())
		}
		
	//коммерческая цена
		
		var amt = $row.find(".amt").val()
		var unitPrice = $row.find(".unitPrice").val();
		var type = $row.find(".unitType").val();
		var cost = $row.find("input.cost").val() * 1.0;
		var metalPart = $row.find(".metalPart").val();
		var timberPart = $row.find(".timberPart").val();
		var partnersPart = $row.find(".partnersPart").val();

		var summ = amt * unitPrice;
		$row.find(".summ").text(summ);
		priceObj.total += summ;
		costObj.total += cost;
		if(type == "изделие"){
			priceObj.product += summ;
			costObj.product += cost;
			priceObj.metal += summ * metalPart / 100;
			priceObj.timber += summ * timberPart / 100;
			priceObj.partners += summ * partnersPart / 100;
		}
		if(type == "монтаж"){
			priceObj.assembling += summ;
			costObj.assembling += cost;
		}
		if(type == "доставка"){
			priceObj.delivery += summ;
			costObj.delivery += cost;
		}		
	})

	//скидка
	var discountSum = 0;

	if(params.discountMode == "процент"){
		discountSum = Math.round(priceObj.total * params.discountFactor / 100);
	}
		
	if(params.discountMode != "процент"){
		if(params.discountMode == "скидка"){
			var discountSum = params.discountFactor;
		}
		if(params.discountMode == "цена"){
			var discountSum = priceObj.total - params.discountFactor;
		}
	}
	
	discountSum = Math.round(discountSum);
	priceObj.finalPrice = Math.round(priceObj.total - discountSum);
	
	var resultText = "<h3>Общая стоимость заказа: " + priceObj.total +  " руб </h3>\
		<b class='yellow'>Скидка: " + discountSum +  " руб </b><br/>\
		<b class='yellow'>Цена со скидкой: " + priceObj.finalPrice +  " руб </b><br/>";
	$("#totalResult").html(resultText);
	reindexTable();
	
	//сохраняем данные в глобальные объекты
	staircasePrice = priceObj;
	staircasePrice.finalPrice = priceObj.finalPrice;
	
	printCost(costObj)
	
	if(typeof getExportData_com == 'function' && document.location.href.indexOf("customers") == -1){
		var exportObj = getExportData_com();
		printExportData(exportObj, "exportData");
	}
	
	
	
}

/** функция устанавливает расчетное значение доставки и сборки в строках таблицы работ на листе
*/

function setWorksPrice(){
	//добавляем строки если их нет в таблице
		var deliveryRow = false
		var assmblingRow = false
		
		$("#estimate_works .estimateItem").each(function(){
			var unitType = $(this).find(".unitType").val()
			if( unitType == "доставка") {
				deliveryRow = $(this);
			}
			if(unitType == "сборка") {
				assmblingRow = $(this);
			}
		})

	if(params.delivery != "нет"){		
		var delivery = calcDeliveryCost();
		
		//добавляем строку если ее нет
		if(!deliveryRow) {
			addRow("estimate_works");
			deliveryRow = $("#estimate_works .estimateItem:last")
			deliveryRow.find(".unitType").val("доставка")
		}
		//уставливаем значения
		deliveryRow.find(".name").val("Доставка")
		deliveryRow.find(".amt").val(params.deliveryAmt)
		deliveryRow.find(".unitPrice").val(delivery.price / params.deliveryAmt)
		deliveryRow.find(".cost").val(delivery.cost)
	}

	if(params.isAssembling != "нет"){
		var totalPrice = 0;
		$("#estimate_mat .estimateItem").each(function(){
			totalPrice += $(this).find(".summ").text() * 1.0;
		})
		
		var assm = totalPrice * 0.2;
		
		//добавляем строку если ее нет
		if(!assmblingRow) {
			addRow("estimate_works");
			assmblingRow = $("#estimate_works .estimateItem:last")
			assmblingRow.find(".unitType").val("сборка")
		}
		//уставливаем значения
		assmblingRow.find(".name").val("Сборка")
		assmblingRow.find(".amt").val(1)
		assmblingRow.find(".unitPrice").val(assm.price)
		assmblingRow.find(".cost").val(assm.cost)
	}
	
	reindexTable()
	recalculate();
}


function printCost(par){
	var vp = Math.round(staircasePrice.finalPrice - par.total);
	var vpPart = Math.round(vp / staircasePrice.finalPrice * 100)
	var dealerCost = Math.round(par.total * 1.3);
	var dealerVp = Math.round(staircasePrice.finalPrice - dealerCost);
	var dealerVpPart = Math.round(dealerVp / staircasePrice.finalPrice * 100)
	var text = "<b>Общая себестоимость: " + par.total + " руб<br/>\
		ВП: <span id='vpSum'>" + vp + "</span> руб (" + vpPart + "%)<br/><br/>\
		Цена для дилера: " + dealerCost + " руб<br/>\
		ВП дилера: <span id='vpSum'>" + dealerVp + "</span> руб (" + dealerVpPart + "%)\
		</b>\
		<h3>Подробности</h3>\
		Общая площадь: " + Math.round(par.area * 10) / 10 + "м2";
	/*
	var totalCost = 0;
	$.each(par, function(key){
		if(key != )
	})
*/
	$("#totalCost").html(text);
}


