$(function () {
	
});

function calcPrice(){
	
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
		var amt = $(this).closest('tr').find(".amt").val()
		var unitPrice = $(this).closest('tr').find(".unitPrice").val();
		var type = $(this).closest('tr').find(".unitType").val();
		var cost = $(this).closest('tr').find(".сost").val() * 1.0;
		var metalPart = $(this).closest('tr').find(".metalPart").val();
		var timberPart = $(this).closest('tr').find(".timberPart").val();
		var partnersPart = $(this).closest('tr').find(".partnersPart").val();

		var summ = amt * unitPrice;
		$(this).closest('tr').find(".summ").text(summ);
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
	
	var resultText = "<b class='yellow'>Итого: " + priceObj.total +  " руб </b><br/>";
	$("#totalResult").html(resultText);
	reindexTable();
	
	//сохраняем данные в глобальные объекты
	staircasePrice = priceObj;
	staircasePrice.finalPrice = priceObj.total;
	
	printCost(costObj)
	
	if(typeof getExportData_com == 'function' && document.location.href.indexOf("customers") == -1){
		var exportObj = getExportData_com();
		printExportData(exportObj, "exportData");
	}
	
	
	
}

function printCost(par){
	var vp = staircasePrice.finalPrice - par.total;
	var vpPart = Math.round(vp / staircasePrice.finalPrice * 100)
	var text = "<b>Общая себестоимость: " + par.total + " руб<br/>\
		ВП: <span id='vpSum'>" + vp + "</span> руб (" + vpPart + "%)</b>";
	/*
	var totalCost = 0;
	$.each(par, function(key){
		if(key != )
	})
*/
	$("#totalCost").html(text);
}


