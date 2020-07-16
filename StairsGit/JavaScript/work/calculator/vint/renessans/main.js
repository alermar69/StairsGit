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
	
	//считаем высоту лестницы или кол-во подъемов если одного из параметров нет
	if(!params.stepAmt) params.stepAmt = Math.round(params.staircaseHeight / 200);
	if(!params.staircaseHeight) params.staircaseHeight = params.stepAmt * 200;
	
	//каркас
	
	//ступени
	var treadName = "береза"
	if(params.treadType == "steel") treadName += "рифленая сталь"
	var stepHeight = Math.round(params.staircaseHeight / params.stepAmt);
	
	var item = {
		id: "tread",
		name: "Ступень Ф" + params.diam + " " + treadName + " подъем " + stepHeight + "мм (комплект)",
		amt: params.stepAmt - 1,
		unitCost: costArr.tread[params.treadType][params.diam],
	}
	
	partsList.push(item);
	
	//площадка
	var pltName = "треугольная";
	if(params.pltType == 'rect') pltName = "прямоугольная";
	var item = {
		id: "platform",
		name: "Площадка Ф" + params.diam + " " + treadName + " " + pltName + " подъем " + stepHeight + "мм (комплект)",
		amt: 1,
		unitCost: costArr.platform[params.treadType][params.diam][params.pltType],
	}
	
	partsList.push(item);
	
	//промежуточные крепления
	var item = {
		id: "midFix",
		name: "Крепление лестницы промежуточное (комплект)",
		amt: params.midFixAmt,
		unitCost: costArr.midFix,
	}
	
	if(params.midFixAmt) partsList.push(item);
	
	//ограждение лестницы
	
	//стойки ограждений марша первая
	var item = {
		id: "rack_vint_1",
		name: "Стойка ограждения винтовой лестницы первая",
		amt: params.stepAmt,
		unitCost: costArr.vintRack['main'],
	}
	partsList.push(item);
	
	//стойки ограждений марша промежуточная
	var item = {
		id: "rack_vint_2",
		name: "Стойка ограждения винтовой лестницы промежуточная",
		amt: params.stepAmt,
		unitCost: costArr.vintRack['middle'],
	}
	partsList.push(item);
	
	
	//спиральный поручень
	params.stepAngle = 22;
	var staircaseAngle = params.stepAngle * params.stepAmt;
	var circleLength = Math.PI * params.diam * staircaseAngle/360;
	var handrailLen = Math.sqrt(circleLength * circleLength + params.staircaseHeight * params.staircaseHeight)


	var item = {
		id: "spiralHandrail",
		name: "Поручень спиральный ПВХ L=3м",
		amt: Math.ceil(handrailLen / 3000),
		unitCost: costArr.spiralHandrail,
	}
	
	partsList.push(item);
	
	//ограждение площадки

	var rigelAmt = 3;
	var rack950Amt = 2;


	//стойки ограждений площадки
	var item = {
		id: "rack_900",
		name: "Стойка балюстрады L=900 с фланцем крашенная",
		amt: 2,
		unitCost: costArr.racks['painted']['900'],
	}
	
	partsList.push(item);
	
	//поручень
	var handrailLen = params.diam / 2 + 100;
	var item = {
		id: "handrail",
		name: "Поручень площадки ПВХ (L = " + handrailLen + "мм)",
		amt: 1,
		unitCost: Math.round(costArr.handrail['pvc'] * handrailLen / 1000),
	}
	partsList.push(item);
	
	//ригели
	var rigelLen = handrailLen - 50;
	var item = {
		id: "rigel",
		name: "Ригель площадки краш. (L = " + rigelLen + "мм)",
		amt: 3,
		unitCost: Math.round(costArr.rigel['painted'] * rigelLen / 1000),
	}
	partsList.push(item);
		

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
	
	//Цена на ступени. Первый индекс - тип ступеней, второй - диаметр лестницы
	
	costArr.tread = {
		timber: {
			1200: 2750,
			1400: 3050,
			1600: 3400,
		},
		steel: {
			1200: 2590,
			1400: 2900,
			1600: 3150,
		},
	}
	
	//Цена на площадку. Первый индекс - тип ступеней, второй - диаметр лестницы, тртий - тип: прямоугольная или треугольная
	costArr.platform = {
		timber: {
			1200: {
				tri: 6050,
				rect: 7865,				
			},
			1400: {
				tri: 6710,
				rect: 8723,				
			},
			1600: {
				tri: 7480,
				rect: 9724,				
			},
		},
		steel: {
			1200: {
				tri: 5698,
				rect: 7407,				
			},
			1400: {
				tri: 6380,
				rect: 8294,				
			},
			1600: {
				tri: 6930,
				rect: 9009,				
			},
		},
	}
	
	//цена на стойки ограждения
	costArr.vintRack = {
		main: 440,
		middle: 380,
	}
	
	//центральный косоур марша. Индекс - кол-во ступеней
	costArr.midFix = 2000;
	
	costArr.spiralHandrail = 6500;
	
	//стойки. Первый индекс - материал, второй - модель
	costArr.racks = {
		painted: {
			900: 883,
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
		pvc: 3500/4,
	};
	
	

	return costArr;
	

}

