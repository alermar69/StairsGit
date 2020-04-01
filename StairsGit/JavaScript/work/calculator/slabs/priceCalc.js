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
	}

	$(".estimateItem").each(function(){
		var $row = $(this);
		
		//расчет себестоимости и цены за единицу
		var type = $row.find(".unitType").val();
		var amt = $row.find(".amt").val();
		var cost = 0;
		
		
	//столешницы, подоконники
		if(type == "столешница" || type == "подоконник") {
			//дерево
			var model = $row.find(".model").val();
			var area = $row.find(".len").val() * $row.find(".width").val() / 1000000;
			var vol = area * $row.find(".thk").val() / 1000;
			var timberType = $row.find(".timberType").val();
			var m3Cost = calcTimberParams(timberType).m3Price;
			if(model == "слэб цельный") m3Cost *= 1.5;
			
			var timberCost = vol * m3Cost;
			
			
			//покраска
			var paintCost = calcTimberPaintPrice(params.timberPaint, timberType) * area * 1.5; //1.5 учитывает торцы и низ
			
			//река
			var riverWidth = $row.find(".riverWidth").val();
			var riverArea = $row.find(".riverWidth").val() * $row.find(".len").val() / 1000000;
			var riverCost = 0;
			var resinLiterCost = 1500;
			if(model == "слэб + смола прозр." || model == "слэб + смола непрозр.") {
				riverCost += riverArea * $row.find(".thk").val() * resinLiterCost;
				if(model == "слэб + смола непрозр.") riverCost *= 0.5 //к-т учитывает заполнитель
			}
			if(model == "слэб + стекло") riverCost += riverArea * 12000 + 2000; //12к - цена стекла за м2, 2к - работа по фрезеровке 
			
			var cost = timberCost + paintCost + riverCost;			
			
			$row.find("input.сost").val(Math.round(cost * amt));
			$row.find(".unitPrice").val(Math.round(cost * margin));
		}
		
	//подстолья
		if(type == "подстолье") {
			var height = $row.find(".height").val() * 1.0
			var width = $row.find(".width").val() * 1.0;
			var cost = 5000;
			var model = $row.find(".baseModel").val();
			if(model == "труба нерж.") cost = 15000;
			if(model == "лист") cost = 7500;
			if(model == "короб") cost = 15000;
			
			//учитываем размеры
			var profLen = (height + width) * 2;
			var nominalProfLen = (700 + 600) * 2;

			cost = cost * 0.7 + (cost * 0.3 * profLen / nominalProfLen);
			
			$row.find("input.сost").val(Math.round(cost * amt));
			$row.find(".unitPrice").val(Math.round(cost * margin));
		}
		
	//коммерческая цена
		
		var amt = $row.find(".amt").val()
		var unitPrice = $row.find(".unitPrice").val();
		var type = $row.find(".unitType").val();
		var cost = $row.find(".сost").val() * 1.0;
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
		</b>";
	/*
	var totalCost = 0;
	$.each(par, function(key){
		if(key != )
	})
*/
	$("#totalCost").html(text);
}


