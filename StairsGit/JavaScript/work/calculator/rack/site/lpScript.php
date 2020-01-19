<script>
  var discount = 0.3; //размер скидки
	
  window.onload = function() {
//	$(".more").hide();
    
    //калькулятор
    	//обработчик изменения инпутов
	$("#paramsTable").delegate('input,select', 'change', function(){
		formChange();
		printPrice_prod();
	})
	
	//обработчик кнопки
	$("#printTable").click(function(){
		printPriceTable();
	})
	printDiscountPrice();
	formChange();
	printPrice_prod();
  };
  
function getParams(){
	//получаем параметры из формы и записываем в объект
	var params = {};
	//значения двигунков
	$("#paramsTable").find('.irs-single').each(function(){
		var inputId = $(this).closest('div.widget-field').attr('id');
		var text = $(this).text();
		var val = text.replace(/[^+\d]/g, '');
		
		console.log(inputId, val)
		params[inputId] = val;
	});
	
	//тип стола	
	var checkedVal = $("#tableType").find('input[type="checkbox"]:checked').attr('il-data');
	params.tableType = "обеденный";
	if(checkedVal == 1) params.tableType = "письменный";
	if(checkedVal == 2) params.tableType = "журнальный";
	
	//тип столешницы
	var checkedVal = $("#countertopType").find('input[type="checkbox"]:checked').attr('il-data');
	params.countertopType = "дуб";
	if(checkedVal == 1) params.countertopType = "береза";
	if(checkedVal == 2) params.countertopType = "стекло";
	
	//полка
	var checkedVal = $("#shelfType").find('input[type="checkbox"]:checked').attr('il-data');
	params.shelfType = "нет";
	if(checkedVal == 1) params.shelfType = "есть";
	
	//тумбы
	params.drawersBlocks = $("#drawersBlocks").find('input[type="checkbox"]:checked').attr('il-data');
	
	//кол-во ящиков в тумбе
	params.drawersAmt = $("#drawersAmt").find('input[type="checkbox"]:checked').attr('il-data');
	
	//тип фурнитуры
	var checkedVal = $("#drawersType").find('input[type="checkbox"]:checked').attr('il-data');
	params.drawersType = "эконом";
	if(checkedVal == 1) params.drawersType = "стандарт";
	if(checkedVal == 2) params.drawersType = "премиум";
	
	//получаем параметры из формы напрямую на странице отладки
	if($("#page").text() == "Отладка"){
		var params = {};
		$("#paramsTable").find('input,select').each(function(){
			params[this.id] = $(this).val();
		});
		
	}
	
	//преобразуем в число где возможно
	for(var prop in params){
		if(isFinite(params[prop])) params[prop] = Number(params[prop]);		
	}
	
	
	
	if(!params.vpPart) params.vpPart = 50;
	if(params.countertopType == "стекло") params.countertopThk = 16; //жестко задаем толщину стекла
	
	
	if(params.tableType == "обеденный"){
		params.drawersBlocks = 0;
		params.drawersAmt = 0;
		params.shelfType = "нет";
	}
	
	if(params.tableType == "письменный"){
		params.shelfType = "нет";
	}
	
	if(params.tableType == "журнальный"){
		params.drawersBlocks = 0;
		params.drawersAmt = 0;
	}
	
	
	
	
	console.log(params)
	
	return params;
 
}

function printDiscountPrice(){
	$('div[data-role="itemprice"] div[data-role="itemprice"]').each(function(){
		var text = $(this).find('span').text();
		var price = text.replace(/[^+\d]/g, '');
		var discountPrice = Math.round(price * (1 - discount) / 10) * 10;
		//разеляем разряды
		discountPrice = discountPrice.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
		var text2 = '<div class=""><div class="wrapper1"><div class="wrapper2"><div class=""><div class="xs-force-center textable"><p style="text-align: center;"><span style="font-size: 24px;"><strong>от ' + discountPrice + ' руб.</strong></span></p></div></div></div></div></div>';
		$(this).after(text2);
		$(this).find('span').css({ 
			"color": "grey",
			"text-decoration": "line-through" });
	})
}
  
function formChange(){
	var params = getParams();
	
	if(params.tableType == "обеденный"){
		$(".drawers").hide();
		$(".shelf").hide();
	}
	if(params.tableType == "письменный"){
		$(".drawers").show();
		$(".shelf").hide();
	}
	if(params.tableType == "журнальный"){
		$(".drawers").hide();
		$(".shelf").show();
	}
	
	if(params.drawersBlocks == 0) {
		$(".drawersSet").hide()
	}
	else{
		$(".drawersSet").show()
	}
	
	if(params.countertopType == "стекло") {
		$(".counterTop").hide();
	}
	else {
		$(".counterTop").show();
	}
}

/** функция выводит на экран результаты расчета по данным из формы - полный вариант
*/
function printPrice(){
	//получаем параметры из формы и записываем в объект
	var params = {};
	$("#paramsTable").find('input,select').each(function(){
		params[this.id] = $(this).val();
		//преобразуем в число где возможно
		if(isFinite(params[this.id])) params[this.id] = Number(params[this.id]);
	});
	
	var priceData = calcPrice(params);
	
	//вывод результатов расчета на страницу
	var resultText = "Себестоимость: " + priceData.totalCost + " руб.<br/>" + 
		"Цена для клиента: " + priceData.totalPrice + " руб<br/>" +
		"<h4>Подробный расчет себестоимости</h4>" +
		"<table class='tab_2'><thead><tr><th>Наименование</th><th>Кол-во</th><th>Цена ед.</th><th>Сумма</th></tr><thead>" +
		"<tbody>";
	
	var sum = 0;
	$.each(priceData.partsList, function(){
		resultText += "<tr>" +
			"<td class='left'>" + this.name + "</td>" +
			"<td>" + this.amt + "</td>" +
			"<td>" + this.unitCost + "</td>" +
			"<td>" + Math.round(this.unitCost * this.amt) + "</td>" +
			"</tr>";
		sum += Math.round(this.unitCost * this.amt);
	})
	
	resultText += "</tbody></table>" + 
	"<b>Итого: " + sum + "</b>"
	$("#result").html(resultText);
}

/** функция выводит на экран результаты расчета по данным из формы - вариант для продакшна
*/
function printPrice_prod(){
	var params = getParams();
		
	var priceData = calcPrice(params);
	
	//вывод результатов расчета на страницу
	var totalPriceText = Math.round(priceData.totalPrice / 10) * 10;
	totalPriceText = totalPriceText.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
	var discountPrice = Math.round(priceData.totalPrice * 0.7 / 10) * 10;
	discountPrice = discountPrice.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
	$("#calcPrice").text(totalPriceText);
	$("#calcPrice_discount").text(discountPrice);
}


/** функция получает параметры из формы, рассчитывает цену и выводит результат расчета на страницу
*/

function calcPrice(params){
	
	var partsList = []; //массив, куда добавляется информация по каждой детали, используемой в данной конфигурации - название, цена, кол-во, цена единицы
	
	var costArr = getCostArr(); //справочник цены за единицу для всех стандартных позиций
	
	//задаем константы для каркаса
	params.frontOverhang = params.sideOverhang = 20;
	params.legProf = '80х40';
	params.bridgeProf = '60х30'
	
	var legPar = getProfParams(params.legProf)
	var legTubeLen = (params.height - params.countertopThk) * 2 + (params.depth - params.frontOverhang) * 2;
	
	var carcasCost = legPar.unitCost * legTubeLen / 1000 * 2; //2 опоры
	
	//царги
	var bridgePar = getProfParams(params.bridgeProf)
	var bridgeTubeLen = (params.width - params.sideOverhang * 2 - legPar.sizeA * 2) * 2;
	carcasCost += bridgePar.unitCost * bridgeTubeLen / 1000;
	
	//порошковая покраска подстолья - упрощенно равна цене металла
	carcasCost *= 2;
	
	
	var item = {
		id: "carcas",
		name: "Каркас",
		amt: 1,
		unitCost:  Math.round(carcasCost),
	}
	
	partsList.push(item);
	
	//cтолешница
	var timberVol = params.width * params.depth * params.countertopThk / 1000000000;
	var paintedArea = (params.width * params.depth + (params.width + params.depth) * 2 * params.countertopThk) / 1000000
	
	
	var countertopCost = timberVol * costArr.countertop[params.countertopType];
	countertopCost += paintedArea * costArr.timberPaintPriceM2;
	
	var item = {
		id: "countertop",
		name: "Столешница",
		amt: 1,
		unitCost: Math.round(countertopCost),
	}
	
	partsList.push(item);
	
	//ящики
	if(params.drawersBlocks > 0){
		var item = {
			id: "drawerBlock",
			name: "Корпус тумбы",
			amt: params.drawersBlocks,
			unitCost: Math.round(costArr.drawerBlock),
		}
		
		partsList.push(item);
		
		var item = {
			id: "drawer",
			name: "Выдвижной ящик",
			amt: params.drawersBlocks * params.drawersAmt,
			unitCost: Math.round(costArr.drawer[params.drawersType]),
		}
		
		partsList.push(item);
		
		
	}

	//полка
	if(params.shelfType == "есть"){
		//cтолешница
		var timberVol = params.width * params.depth * 20 / 1000000000;
		var paintedArea = (params.width * params.depth + (params.width + params.depth) * 2 * 20) / 1000000
		
		
		var shelfCost = timberVol * costArr.countertop[params.countertopType];
		shelfCost += paintedArea * costArr.timberPaintPriceM2;
		
		var item = {
			id: "shelf",
			name: "Полка",
			amt: 1,
			unitCost: Math.round(shelfCost),
		}
		
		partsList.push(item);
	}
		

	//общая себестоимость
	var totalCost = 5000;
	$.each(partsList, function(){
		totalCost += this.amt * this.unitCost;
	})
	
	//общая цена
	var margin = 1 / (1 - params.vpPart / 100);
	var totalPrice = Math.round(totalCost * margin);
	
	var result = {
		totalPrice: totalPrice,
		totalCost: totalCost,
		partsList: partsList,
	}

	return result;
}



/** функия формирует справочинк цен в виде js объекта и возвращает его
*/
function getCostArr(){
	var costArr = {};
	
	//столешница за м3
	costArr.countertop = {
		'дуб': 105000,
		'береза': 65000,
		'стекло': 281000,
	}
	
	//покраска дерева
	costArr.timberPaintPriceM2 = 2000;
	
	//цена профильной трубы 40х80
	costArr.tubeCost = 217; 
	
	//цена за корпус тумбы
	costArr.drawerBlock = 6000;
	
	//цена за каждый ящик
	costArr.drawer = {
		'эконом': 1000,
		'стандарт': 2000,
		'премиум': 5000,
	}

	return costArr;
	

}


function getProfParams(profName){
	var costArr = {	
		'20х20': 47,
		'40х40': 120,
		'50х50': 198,
		'60х60': 217,
		'80х80': 287,
		'100х100': 415,		
		'40х20': 72,
		'60х30': 136,
		'60х40': 178,
		'80х40': 217,
		'100х40': 275,		
		'100х50': 315,	
	};
	
	var result = {
		sizeA: profName.slice(0, profName.indexOf('х')) * 1.0,
		sizeB: profName.slice(profName.indexOf('х')+1, profName.length) * 1.0,
		unitCost: costArr[profName],
	}
	
	if((result.sizeA != result.sizeB) && !result.unitCost){
		profName = result.sizeB + "х" + result.sizeA;
		result.unitCost = costArr[profName];
	}
	
	return result;

}


</script>
