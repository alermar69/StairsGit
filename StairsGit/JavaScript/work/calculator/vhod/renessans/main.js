/** в этом файле собраны функции для расчета цены и вывода ее на страницу **/

$(function() {
	
	//обработчик изменения инпутов
	$("#paramsTable").delegate('input,select', 'change', function(){
		printPrice();
	})
	
	//обработчик кнопки
	$("#printTable").click(function(){
		printPriceTable();
	})
	
	printPrice();
});

/** функция выводит на экран результаты расчета по данным из формы
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

/** функция выводит на экран таблицу результатов для разных комбинаций параметров
*/
function printPriceTable(){
	var stepAmt = [2,3,4,5,6];
	var header = "<table class='tab_2'><thead><tr><th></th>";
	$.each(stepAmt, function(){
		header += "<th>" + this + "</th>";
	});
	header += "</tr></thead><tbody>"
	
	var footer = "</tbody></table>"
	var tbody = ""
	
	//без площадки
	var params = {
		name: 'Каркас без площадки 600мм (базовая)',
		railingSide: "none",
		topPltDepth: 300,
		treadType: "none",
		width: 600,
		vpPart: $("#vpPart").val(),
	}
	tbody += calcPriceRow(params);
	
	//с площадкой
	var params = {
		name: 'Каркас с площадкой 600мм (базовая)',
		railingSide: "none",
		topPltDepth: 600,
		treadType: "none",
		width: 600,
		vpPart: $("#vpPart").val(),
	}
	tbody += calcPriceRow(params);
	
	var text = "<h4>Таблица базовых цен для сайта при ВП = " + params.vpPart + "%</h4>" + 
		header + tbody + footer
	
	$("#result_all").html(text);
}

/** функция генерирует строку таблицы для таблицы с ценами*/
function calcPriceRow(params){
	var stepAmt = [2,3,4,5,6];
	var text = "";
	
	text += "<tr><td>" + params.name + "</td>"
	$.each(stepAmt, function(){
		params.stepAmt = this;
		var priceData = calcPrice(params);
		console.log(priceData)
		text += "<td>" + priceData.totalPrice + "</td>";
	});
	text += "</tr>"
	
	return text;
}

/** функция получает параметры из формы, рассчитывает цену и выводит результат расчета на страницу
*/

function calcPrice(params){

	var partsList = []; //массив, куда добавляется информация по каждой детали, используемой в данной конфигурации - название, цена, кол-во, цена единицы
	
	var costArr = getCostArr(); //справочник цены за единицу для всех стандартных позиций
	//каркас
	
	//боковые тетивы
	var item = {
		id: "sideStringer",
		name: "Боковые тетивы марша " + params.stepAmt + " под. (комплект)",
		amt: 1,
		unitCost: costArr.sideStringerCost[params.stepAmt],
	}
	
	partsList.push(item);
	
	//центральный косоур
	if(params.width > 1000) {
		var item = {
			id: "midStringer",
			name: "Центральный косоур " + params.stepAmt + " под.",
			amt: 1,
			unitCost: costArr.midStringerCost[params.stepAmt],
		}
	
		partsList.push(item);	
	
	}
	
	//рамки
	var frameAmt = params.stepAmt;
	var frameWidth = params.width;
	if(params.width == 1200){
		frameAmt = params.stepAmt * 2;
		frameWidth = 600;
	}
	//рамки площадки
	frameAmt += Math.round(params.topPltDepth/300) - 1;
	
	var item = {
		id: "treadFrame_" + frameWidth,
		name: "Рамка " + frameWidth + "мм (марш)",
		amt: frameAmt,
		unitCost: costArr.framePrice[frameWidth],
	}
	
	partsList.push(item);
	
	//верхняя площадка
	if(params.topPltDepth > 300){

		var item = {
			id: "sideStringer_plt",
			name: "Тетивы площадки боковые L = " + (params.topPltDepth - 300) + "мм (комплект)",
			amt: 1,
			unitCost: costArr.sideStringerCost_plt[params.topPltDepth],
		}
		
		partsList.push(item);
		
		if(params.width > 1000) {
			var item = {
				id: "sideStringer_plt",
				name: "Косоур площадки промежуточный L = " + (params.topPltDepth - 300) + "мм ",
				amt: 1,
				unitCost: costArr.midStringerCost_plt[params.topPltDepth],
			}			
			partsList.push(item);
		}
	
	}
	
	//ступени
	if(params.treadType != 'none'){
		var deckAmt = params.stepAmt * 2;
		if(params.topPltDepth > 300){
			deckAmt += (Math.round(params.topPltDepth/300) - 1) * 2;
		}
		
		var item = {
			id: "dpc",
			name: "Доска ДПК L=4000мм",
			amt: Math.ceil(deckAmt / Math.floor(4000 / params.width)),
			unitCost: costArr.tread[params.treadType],
		}
		
		partsList.push(item);
	};
		
	
	//ограждения

	var rigelAmt = 3;
	var rack950Amt = 2;
	if(params.stepAmt > 3) rack950Amt = 3;
	var rack1000Amt = 0;
	if(params.topPltDepth > 300) rack1000Amt = 1;
	console.log()
	if(params.railingSide != 'none' && params.railingType != 'none'){
		//стойки ограждений марша
		var item = {
			id: "rack_950",
			name: "Стойка бок. крепление L=950",
			amt: rack950Amt * params.railingSide,
			unitCost: costArr.racks[params.railingType]['950'],
		}
		
		partsList.push(item);
		
		//поручень
		var handrailLen = -170 + 315 * params.stepAmt;
		var item = {
			id: "handrail",
			name: "Поручень " + params.stepAmt + " под. (L = " + handrailLen + "мм)",
			amt: params.railingSide,
			unitCost: Math.round(costArr.handrail[params.railingType] * handrailLen / 1000),
		}
		partsList.push(item);
		
		//ригели
		var rigelLen = handrailLen - 50;
		var item = {
			id: "rigel",
			name: "Ригель " + params.stepAmt + " под. (L = " + rigelLen + "мм)",
			amt: params.railingSide,
			unitCost: Math.round(costArr.rigel[params.railingType] * rigelLen / 1000),
		}
		partsList.push(item);
		
		//площадка
		if(params.topPltDepth > 300){
			//стойки ограждения площадки
			var item = {
				id: "rack_950",
				name: "Стойка бок. крепление L=1000",
				amt: rack1000Amt * params.railingSide,
				unitCost: costArr.racks[params.railingType]['1000'],
			}			
			partsList.push(item);
			
			//поручень
			var handrailLen = params.topPltDepth - 240;
			var item = {
				id: "handrail_plt",
				name: "Поручень площадки " + params.topPltDepth + " (L = " + handrailLen + "мм)",
				amt: params.railingSide,
				unitCost: Math.round(costArr.handrail[params.railingType] * handrailLen / 1000),
			}
			partsList.push(item);
			
			//ригели
			var rigelLen = handrailLen;
			var item = {
				id: "rigel_plt",
				name: "Ригель площадки " + params.topPltDepth + " (L = " + rigelLen + "мм)",
				amt: params.railingSide,
				unitCost: Math.round(costArr.rigel[params.railingType] * rigelLen / 1000),
			}
			partsList.push(item);
		
		}
	
	}
	

	//общая себестоимость
	var totalCost = 0;
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
	
	//Цена на каркас. Первый индекс - ширина марша, второй - кол-во ступеней
	
	//боковые тетивы марша. Индекс - кол-во ступеней
	costArr.sideStringerCost = {
		2: 5517,
		3: 6646,
		4: 7955,
		5: 9254,
		6: 10541,
	}
	
	//центральный косоур марша. Индекс - кол-во ступеней
	costArr.midStringerCost = {
		2: 2758,
		3: 3323,
		4: 3978,
		5: 4627,
		6: 5270,
	}
	
	//рамки. Индекс - ширина марша
	costArr.framePrice = {
		600: 731,
		800: 850,
		1000: 946,
	}
	
	//боковые тетивы площадки. Индекс - глубина площадки
	costArr.sideStringerCost_plt = {
		600: 1840,
		900: 2640,
		1200: 3760,
	}

	//промежуточные косоуры площадки. Индекс - глубина площадки
	costArr.midStringerCost_plt = {
		600: 920,
		900: 1320,
		1200: 1880,
	}	
	

	//одна доска длиной 4м. Индекс - тип: дпк или лиственница
	costArr.tread = {
		none: 0,
		dpc: 1560,
		larch: 2000,
	};
	
	//стойки. Первый индекс - материал, второй - модель
	costArr.racks = {
		painted: {
			950: 736,
			1000: 810,
		},
		inox: {
			950: 1720,
			1000: 1892,
		},
	};
	
	//ригель, цена за метр
	costArr.rigel = {
		painted: 758 / 3,
		inox: 1320 / 3,
	};
	
	//поручень, цена за метр
	costArr.handrail = {
		painted: 1152 / 3,
		inox: 3600 / 3,
	};
	
	

	return costArr;
	

}

