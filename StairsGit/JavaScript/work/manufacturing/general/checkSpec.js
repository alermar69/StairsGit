var currentSpecList = []; //Список текущих спецификаций, хранится после вызова модального окна, чтобы лишний раз не запрашивать
var currentLoadedSpec = {};

$(function () {

	//показать на модели детали по клику на строке спецификации
	$("#specificationList1").delegate(".specRow", "click", function(event){

		if(event.shiftKey) {
			$(".specRow.selected").removeClass("selected")
			var articul = $(this).attr("data-articul")    
			showSpecItem(articul);
			$(this).addClass("selected")
		}
	
	})
	
	//При открытии модального окна проверяем спецификации и загружаем данные
	$('#openSpecCompareModal').click(function(){
		getSpecsByOrder($('#orderId').val(), function(data){
			if (data.length > 0) {
				fillSpecsList(data);
				var currentOfferData = data.find(function(elem){return elem.offername == $("#orderName").val() && elem.status == "в работу"});
				if (currentOfferData) {
					prepareOffer(currentOfferData);
					return
				}
			}
			alert("Не найдена подходящая спецификация, вы можете сделать это вручную.");
			$('#specListModal').modal('show');
		});
	});


	//Выбор и загрузка спецификации из списка
	$('body').on('click', '.spec-list__spec', function() {
		var index = this.dataset.index;
		prepareOffer(currentSpecList[index]);
		$('#specListModal').modal('hide');
	});

	$('body').on('click', '.showSpecItemOnModel', function() {
		var articul = $(this).html();
		showSpecItem(articul);
	});

	//Выполняет поиск спецификаций по введенным данным
	$('#searchSpecs').click(function(){
		var searchOfferId = $('#searchOfferId').val();
		getSpecsByOrder(searchOfferId, function(data){
			fillSpecsList(data);
			if (data.length == 0) {
				alert("Спецификации не найдены.");
			}
		});
	});

	//Очищаем вывод при закрытии модального окна
	$('#specCompareModal').on('hidden.bs.modal', function () {
		$('#specCompareResult').html(null);//Очищаем блок вывода
	});
	
	$('body').on('click', '.compareToggleDiv', function() {
		$(this).next().slideToggle(200);
		$(this).toggleClass('opened');
		$(this).toggleClass('closed');
	});

	$(document).on('change', '#showCompare', function() {
		if (currentLoadedSpec) {
			prepareOffer(currentLoadedSpec)
		}
	});
});

/**
 * Функция заполняет список доступных спецификаций в попапе с выбором спецификаций
 * @param {array} specs 
 */
function fillSpecsList(specs){
	currentSpecList = specs;

	var tableHeaders = [
		{name: "ID", key: "id"},
		{name: "Номер заказа", key: "orderid"},
		{name: "Номер предложения", key: "offername"},
		{name: "Статус", key: "status"},
		{name: "Создал", key: "user"},
		{name: "Комментарий", key: "comment"},
		{name: "Дата", key: "createdate"},
		{name: "Ошибки", key: "has_errors"},
		{name: "Изменения", key: "has_changes"},
		
	]

	var specListHtml = "<div class='specs-list'>";

	specListHtml += "<table class='compare-table'>"
	specListHtml += getTableHeaders(tableHeaders);

	$.each(currentSpecList, function(key,value){
		specListHtml += "<tr class='spec-list__spec' data-index=" + key + ">" +
			"<td class=''><a href='" + '/orders/spec?orderName=' + value.orderid + '&spec_id=' + value.id + "' target='_blank'>" + value.id + "</a></td>" +
			"<td class=''>" + value.orderid + "</td>" +
			"<td class=''>" + value.offername + "</td>" +
			"<td class='spec-status'>" + value.status + "</td>" +
			"<td class=''>" + value.user + "</td>" +
			"<td class=''>" + value.comment + "</td>" +
			"<td class=''>" + formatDate(value.createdate, "dd.MM_hh.mm") + "</td>" + 
			"<td class=''>" + value.has_errors + "</td>" +
			"<td class=''>" + value.has_changes + "</td>" +
		"</tr>";
	});

	specListHtml += "</table>"
	specListHtml += "</div>";
	$('#specsList').html(specListHtml);
}

function checkModelItemsCount(){

}

//Рассчитывает количество элементов на модели, по артикулу
function calcItemsCount(specId){
	var count = 0;
	view.scene.traverse(function(node){
		if (node.specId == specId) {
			count++;
		}
	});
	return count;
}

//Проверяет наличие объектов из спецификации на модели
function checkSpecModel(){
	var items = [];
	var spec = generateSpecJson();
	$.each(spec.data, function(key, value){
		$.each(value, function(){
			if(calcItemsCount(this.articul) == 0){
				items.push(this);
			}
		});
	});
	return items;
}

//Сравнивает количество объектов из спецификации на модели
function checkSpecModelCount(){
	var items = [];
	var spec = generateSpecJson();
	$.each(spec.data, function(key, value){
		$.each(value, function(){
			if(this.articul && calcItemsCount(this.articul) != (this.amt * 1.0)){
				items.push(this);
			}
		});
	});
	return items;
}

/**
 * Подготавливает загруженный заказ к сравнению спецификаций(преобразует json в объект), получает текущую спецификацию и отправляет в фун-ию {@link compareSpecs} для вывода сравнения
 * @param {object} loadedSpec 
 */
function prepareOffer(loadedSpec){
	if (typeof(loadedSpec.data) == 'string') loadedSpec.data = JSON.parse(loadedSpec.data);
	var currentSpec = generateSpecJson();
	
	console.log("ENGENEER: ", loadedSpec);
	console.log("ACTUAL: ", currentSpec);
	
	currentLoadedSpec = loadedSpec;

	compareSpecs(currentSpec, loadedSpec);//Вызываем функцию сравнения спецификаций
}

/**
 * Функция обращается к серверу и получает спецификации на основе номера заказа
 * @param {string} orderId Номер заказа
 * @param {function} callback функция, вызываемая после получения ответа с сервера
 */
function getSpecsByOrder(orderId, callback){
	//Получаем спецификации
	$.ajax({
		url: "/orders/spec-controller/action-get-data",
		type: "GET",
		dataType: 'json',
		data: {orderId: orderId},
		success: function (data) {
			if(callback) callback(data); // Вызываем переданную нам функцию
		},
		error: function (jqXhr, textStatus, errorThrown) {
			alert('Ошибка на сервере ' + errorThrown);
			console.log(jqXhr, textStatus, errorThrown)
			if(callback) callback(false); // Вызываем переданную нам функцию
		}
	});
}

/**
 * Функция отвечает за сравнение и вывод специфакций в блок #specCompareResult
 * @param {object} calculated первый вариант спецификации
 * @param {object} loaded второй вариант спецификации
 */
function compareSpecs(calculated, loaded){
	var calculatedData = calculated.data; // Рассчитанная спецификация
	var loadedData = loaded.data; // Загруженная спецификация

	//Заголовки таблицы, как они работают описано в функции getTableHeaders
	var tableHeaders = [
		{name: "Артикул", key: "articul"},
		{name: "Имя", key: "name"},
		{name: "Количество", key: "amt"},
		{name: "Покраска", key: "painting"},
		{name: "Комментарий", key: "comment"},
		{name: "Ошибка", key: "isError"},
		{name: "Описание ошибки", key: "errorComment"},
		
	]
	
	var showCompare = $('#showCompare').prop('checked');

	$('#specCompareResult').html(null);//Очищаем блок вывода
	
	var hasErrors = false;

	$.each(calculatedData, function(key, value){
		if (key == 'main') return; // main пропускаем, тк информации там нету
		var sortedItems = sortData(value, loadedData[key]); //Сортируем имеющиеся данные

		//Если всё пусто пропускаем блок
		if (sortedItems.hasErrors.length == 0 && !showCompare ) {
			return;
		}

		// Собираем html
		var specHtml = "<div>";
		specHtml += "<h1 class='compareToggleDiv opened'>" + getLocationName(key) + "</h1>";
		specHtml += "<div>"; // открываем wrapper для сворачивания (Этот блок сворачивается при нажатии на заголовок)

		//Выводим элементы с ошибками
		if (sortedItems.hasErrors.length > 0) {
			specHtml += "<h3 class='compareToggleDiv opened'>Элементы с ошибками</h3>"
			specHtml += "<div>"
			specHtml += "<span>Количество: " + sortedItems.hasErrors.length + "</span>"
			$.each(sortedItems.hasErrors, function(key, value){
				specHtml += "<table class='compare-table'>"
				specHtml += getTableHeaders(tableHeaders);

				
				if (value.oldObject) specHtml += getSpecRow(tableHeaders, value.oldObject, value.diffKeys, value.isDeleted ? 'deleted' : 'unequal');
				specHtml += getSpecRow(tableHeaders, value.newObject, value.diffKeys, value.isDeleted ? 'deleted' : 'unequal');


					
				specHtml += "</table>"
			})
			specHtml += "</div>"
			hasErrors = true;
		}

		if (showCompare) {
			specHtml += "<h3 class=''>Результат сравнения</h3>";
			//Выводим несовпадающие элементы
			if (sortedItems.unequal.length > 0) {
				specHtml += "<h3 class='compareToggleDiv closed'>Несовпадающие элементы</h3>"
				specHtml += "<div style='display:none;'>"
				specHtml += "<span>Количество: " + sortedItems.unequal.length + "</span>"
				$.each(sortedItems.unequal, function(key, value){
					specHtml += "<table class='compare-table'>"
					specHtml += getTableHeaders(tableHeaders);
	
					specHtml += getSpecRow(tableHeaders, value.oldObject, value.diffKeys, 'unequal');
					specHtml += getSpecRow(tableHeaders, value.newObject, value.diffKeys, 'unequal');
	
					specHtml += "</table>"
				})
				specHtml += "</div>"
			}

				//Выводим удаленные элементы
				if (sortedItems.deleted.length > 0) {
					specHtml += "<h3 class='compareToggleDiv closed'>Нет у инженера</h3>"
					specHtml += "<div style='display: none;'>"
					specHtml += "<span>Количество: " + sortedItems.deleted.length + "</span>"
					specHtml += "<table class='compare-table'>"
					specHtml += getTableHeaders(tableHeaders);
					$.each(sortedItems.deleted, function(key, value){
						specHtml += getSpecRow(tableHeaders, value, [], 'deleted');
					})
					specHtml += "</table>"
					specHtml += "</div>"
				}
				
				//Выводим добавленные элементы
				if (sortedItems.new.length > 0) {
					specHtml += "<h3 class='compareToggleDiv closed'>Нет на странице</h3>"
					specHtml += "<div style='display: none;'>"
					specHtml += "<span>Количество: " + sortedItems.new.length + "</span>"
					specHtml += "<table class='compare-table'>"
					specHtml += getTableHeaders(tableHeaders);
					$.each(sortedItems.new, function(key, value){
						specHtml += getSpecRow(tableHeaders, value, [], 'new');
					})
					specHtml += "</table>"
					specHtml += "</div>"
				}
		}

		specHtml += "</div>"//Закрываем wrapper
		specHtml += "</div>"//Закрываем блок

		//Добавляем в блок вывода
		$('#specCompareResult').append(specHtml);
	});
	
	if(!hasErrors && !showCompare) {
		$('#specCompareResult').append("<h3 class='compareToggleDiv closed'>Позиции с ошибками не найдены</h3>");
	}
}

/**
 * Возвращает текст исходя из ключа местоположения детали
 * @param {string} location 
 * @returns {string} Имя местоположения для вывода
 */
function getLocationName(location){
	switch (location) {
		case "metal":
			return "Детали, изготавливаемые в металлическом цеху";
		case "stock1":
			return "Детали со склада фурнитуры";
		case "stock2":
			return "Детали со склада заготовок";
		case "timber":
			return "Детали, изготавливаемые в столярном цеху";
		default:
			return "";
	}
}

/**
 * Ищет объект в спецификации по артикулу
 * @param {string} articul 
 */
function findInSpec(articul){
	var obj = generateSpecJson();
	var returnObj = null;
	if (obj.data) {
		$.each(obj.data, function(){
			$.each(this, function(){
				if (this.articul == articul) {
					returnObj = this;
				}
			});
		});
	}
	return returnObj;
}

/**
 * 
 * @param {object} headers Заголовки таблицы, описаны в ф-ии {@link getTableHeaders}
 * @param {object} object - сам объект для вывода
 * @param {array} diffKeys - ключи с отличиями, необходимы для маркировки, ключи описаны в ф-ии {@link sortData}
 * @param {string} row_class - класс строки, необходим для стилей(необязательный)
 * @returns {string} html строки таблицы
 */
function getSpecRow(headers, object, diffKeys, row_class){
	row_class = row_class || "";
	var html = "<tr class='" + row_class + "'>";
	$.each(headers, function(key, value){
		var tdClass = "";
		if (diffKeys.indexOf(value.key) !== -1) tdClass = "diff";
		html += "<td class='" + tdClass + "'>" + (object[value.key] || "") + "</td>";
	});
	html += "</tr>";
	return html;
}

/**
 * Возвращает строку для html на основе входящего массива
 * @param {array} headers [{name: "Имя", key: "name"}] - key используется для получения ключа в момент отрисовки строк, name для отрисовки заголовков
 * @returns {string} html заголовков таблицы
 */
function getTableHeaders(headers){
	var html = "<tr>"
	$.each(headers, function(key, value){
		html += "<th>" + value.name + "</th>"
	});
	html += "</tr>"
	return html;
}

/**
 * Сортирует объекты по 4 массивам, new, deleted, equal, unequal
 * @param {object} calculatedData рассчетный объект
 * @param {object} loadedData загруженный объект
 * @returns {object} {new: [], deleted: [], equal: [], unequal: []}
 *- new = [{тут непосредственно объект}] - новые
 *- deleted = [{тут непосредственно объект}] - удаленные
 *- equal = [{oldObject: старый, newObject: новый объект}] - совпадающие
 *- unequal = [{oldObject: старый, newObject: новый объект, diffKeys: [строки с именем ключа в котором отличие]}] - несовпадающие
 */
function sortData(calculatedData, loadedData){
	var hasErrors = [];
	var newItems = [];
	var deletedItems = [];
	var equalItems = [];
	var unequalItems = [];
	$.each(loadedData, function(key, value){
		var oldItem = calculatedData.find(function(x){return x.articul == value.articul }); // Ищем есть ли подходящий элемент в рассчетной спецификации

		//Если в рассчетной спецификации нет того, что есть во втором помещаем в массив newItems
		if (!oldItem) {
			if (value.isError) {
				hasErrors.push({
					oldObject: null,
					newObject: value,
					isDeleted: (value.rowClass && value.rowClass.indexOf('deleted')),
					diffKeys: [],
				});
			}else{
				newItems.push(value);
			}
			return;
		}
		else{
			if (value.isError) {
				var diffKeys = getDiffKeys(oldItem, value);
				hasErrors.push({
					oldObject: oldItem,
					newObject: value,
					isDeleted: (value.rowClass && value.rowClass.indexOf('deleted')),
					diffKeys: diffKeys,
				});
			}else if (isEqual(oldItem, value)) { // если совпадают помещаем в массив equalItems
				equalItems.push({
					oldObject: oldItem,
					newObject: value
				});
			}else{ // Если нет, ищем отличия и помещаем в unequalItems
				var diffKeys = getDiffKeys(oldItem, value);
				unequalItems.push({
					oldObject: oldItem,
					newObject: value,
					diffKeys: diffKeys,
				});
			}
		}
	});
	$.each(calculatedData, function(key, value){
		var item = loadedData.find(function(x){return x.articul == value.articul }); // Ищем в загруженной спецификации элементы из рассчетной

		//Если в рассчетной спецификации есть то, чего нету в загруженной помещаем элемент в массив deletedItems
		if (!item) {
			deletedItems.push(value);
		};
	});

	var result = {
		hasErrors: hasErrors, 
		new: newItems, 
		deleted: deletedItems, 
		equal: equalItems, 
		unequal: unequalItems,
	}
	return result;
}

/**
 * функция сравнивает два объекта
 * @param {object} a первый объект для сравнения
 * @param {object} b второй объект для сравнения
 * @returns {boolean} результат сравнения true/false идентичны/не идентичны
 */
function isEqual(a, b) {
	if (!a || !b) return false;
	// Create arrays of property names
	var aProps = Object.getOwnPropertyNames(a);
	// var bProps = Object.getOwnPropertyNames(b);

	// If number of properties is different,
	// objects are not equivalent
	// if (aProps.length != bProps.length) {
	// 		return false;
	// }

	for (var i = 0; i < aProps.length; i++) {
		var propName = aProps[i];
		//пропускаем неактуальные свойства
		if (propName == 'result' || 
			propName == 'checked' || 
			propName == 'formula' || 
			propName == 'isModelData') continue;

		if (a[propName] !== b[propName] && a[propName] && b[propName]) {
			return false;
		}
	}
	return true;
}

/**
 * Функция получает ключи отличающихся полей
 * @param {object} a первый объект для сравнения
 * @param {object} b второй объект для сравнения
 * @returns {array} массив строк отличающихся ключей объектов
 */
function getDiffKeys(a, b) {
	if (!a || !b) return [];
	// Получаем ключи объекта
	var aProps = Object.getOwnPropertyNames(a);

	var diffs = [];

	for (var i = 0; i < aProps.length; i++) {
		var propName = aProps[i];
		
		if (a[propName] !== b[propName] && a[propName] && b[propName]) {
			diffs.push(propName)
		}
	}
	return diffs;
}

/**
* Функция собирает объект в JSON, вынес в отдельную функцию, чтобы было удобнее работать
* @returns {object} объект со спецификацией, структура которой такая же как мы получаем с сервера
*/
function generateSpecJson(){
	var dataObj = {
		orderId: $("#orderId").val(),
		offerName: $("#orderName").val(),
		data: {
			metal: [],
			timber: [],
			stock1: [],
			stock2: [],
		},
		user: $("#userName").text(),
	};

	if($("#page").val() == "spec") dataObj.offerName = $("#offerName").text();
	if($("#calcType").val()) dataObj.calc_type = $("#calcType").val();

	for(var dept in dataObj.data){
		//перебираем таблицы спецификации (комплектовка) на странице
		$('#specificationList1').find("#" + dept + "_list .specRow").each(function(){
			var $row = $(this);
			var item = {};			
			$row.find('td').each(function(){				
				var propId = $(this).attr('data-propid');
				item[propId] = $(this).text();
				if(propId == 'checked') item[propId] = $(this).find('input').prop('checked');
				if(propId == 'formula') item[propId] = $(this).find('textarea').val();
			});
			//дополнительные классы строки
			if($row.hasClass('highlited')) item.rowClass = "highlited";
			//артикул
			if($row.attr('data-articul')) item.articul = $row.attr('data-articul');
			
			dataObj.data[dept].push(item);			
		})

	}

	dataObj.data['main'] = [{
		comment: $("#mainComment").val(),
		name: $("#specName").text(),
	}];

	return dataObj;
}



/** функция проверки спецификации по расчетным даным*/

function checkSpec(callback){
	var text = "";
	
	var isTestOk = true;
	var localResult = "";
	
//ищем ошибочный текст в спецификации
	var isErrWords = false;
	var errWords = ['undefined', 'NaN'];
	localResult = "<span class='green'>отсутствуют</span>";
	$.each(errWords, function(){
		if($("#specificationList1").text().indexOf(this) != -1){
			isTestOk = false;
			$("#specificationList1").highlight(this, 'red');
			localResult = "<span class='red'>есть</span>";
			isErrWords = true;
		};
	
	});
	text += "Ошибки в числах: " + localResult + "<br/>";
	
//проверка количества ступеней
	if (params.stairType != 'дпк' && params.stairType != 'лиственница тер.'){
	
		var calcTreadAmt = params.stairAmt1;
		if(params.stairModel != "Прямая") calcTreadAmt += params.stairAmt3;
		if(params.stairModel == "П-образная трехмаршевая") calcTreadAmt += params.stairAmt2;
		//куски площадок
		if(params.stairModel == "Г-образная с площадкой"){
			if(params.calcType != "timber") calcTreadAmt += Math.ceil((params.M + 17) / 600);
			if(params.calcType == "timber") calcTreadAmt += 2;
		}
		
		if(params.stairModel == "П-образная с площадкой"){
			calcTreadAmt += Math.ceil(params.platformLength_1 / 600);
		}
		if(params.stairModel == "П-образная трехмаршевая"){
			if(params.turnType_1 == "площадка") calcTreadAmt += Math.ceil((params.M + 17) / 600);
			if(params.turnType_2 == "площадка") calcTreadAmt += Math.ceil((params.M + 17) / 600);
		}
		
		//ступенька верхнего узла
		if(params.calcType == "timber"  || params.calcType == "timber_stock") calcTreadAmt += 1;
		if ((params.topAnglePosition == "вертикальная рамка") && params.platformTop == "нет") calcTreadAmt += 1;
		if ((params.lastRiser == "есть") && params.platformTop == "нет") calcTreadAmt += 1;
		
		if(params.platformTop != "нет"){
			calcTreadAmt += Math.ceil(params.platformLength_3 / 600);
		}


		if (params.stairType == 'рифленая сталь' || params.stairType == 'лотки') {
			calcTreadAmt = 0;
			calcTreadAmt += params.stairAmt1;
			if (params.stairModel == "П-образная трехмаршевая") calcTreadAmt += params.stairAmt2;
			if (params.stairModel !== 'Прямая') calcTreadAmt += params.stairAmt3;

			if(params.stairModel == "Г-образная с площадкой") {
				var treadAmt = calcPltFrameParams(params.M + 25, 0).frameAmt;
				calcTreadAmt += treadAmt;
				if (params.M > 1100 && params.calcType == 'vhod') calcTreadAmt += treadAmt * Math.floor(params.M / 1100);
			}

			if(params.stairModel == "Прямая с промежуточной площадкой" || params.stairModel == "Прямая горка") {
				var treadAmt = calcPltFrameParams(params.middlePltLength + 25, 0).frameAmt;
				calcTreadAmt += treadAmt;
				if (params.M > 1100) calcTreadAmt += treadAmt * Math.floor(params.M / 1100);
			}
			
			if(params.stairModel == "П-образная с площадкой"){
				calcTreadAmt += calcPltFrameParams(params.platformLength_1 + 25, 0).frameAmt * 2; //25 взято из функции отрисовки, откуда берется изначально не знаю, но работает корректно;
				if(params.marshDist > 0) calcTreadAmt += calcPltFrameParams(params.platformLength_1 + 25, 0).frameAmt;
			}

			if(params.stairModel == "П-образная трехмаршевая"){
				var treadAmt = calcPltFrameParams(params.M + 25, 0).frameAmt;
				if(params.turnType_1 == "площадка") calcTreadAmt += treadAmt;
				if(params.turnType_2 == "площадка") calcTreadAmt += treadAmt;
				
			}

			if (params.platformTop !== 'нет') {
				var treadAmt = calcPltFrameParams(params.platformLength_3, 0).frameAmt;
				calcTreadAmt += treadAmt;
				if (params.M > 1100 && params.calcType == 'vhod') {
					calcTreadAmt += treadAmt * Math.floor(params.M / 1100); // Когда больше 1100 на площадка делится косоуром
				}
				if (params.platformWidth_3 > params.M && params.platformTop == 'увеличенная') {
					calcTreadAmt += treadAmt; // Когда площадка шире марша, она делится косоуром
				}
			}
		}

		if (params.stairType == 'нет') calcTreadAmt = 0;

		if (params.stairType == 'нет' && params.startTreadAmt !== 0) {
			calcTreadAmt += params.startTreadAmt;
		}

		var specTreadAmt = getPartAmt("tread") + getPartAmt("notchedTread") + getPartAmt("startTread");
		
		if(!calcTreadAmt) calcTreadAmt = 0;

		if(specTreadAmt != calcTreadAmt){
			isTestOk = false;
			console.log("Кол-во ступеней в спецификации " + specTreadAmt + " не равно расчетному " + calcTreadAmt)
		}
			
		text += "Расчетное кол-во ступеней: " + calcTreadAmt + ", в спецификации " + specTreadAmt;
		if(specTreadAmt != calcTreadAmt){
			isTestOk = false;
			text += "<span class='red'> не совпадает</span>"
			}
		else text += "<span class='green'> совпадает</span>";


		text += "<br/>";
	}
	
//проверка все ли позиции из partsAmt вывелись в спецификацию
	
	localResult = "<span class='green'>все</span>";
	$(".partId").each(function(){
		if($(this).text().indexOf("forgedBalbal") != -1 || $(this).text().indexOf("forgedBal20х20") != -1 || params.staircaseType == 'Готовая') return; //кованые балясины не учитываем или если готовая
		
		//var count = ($("#specificationList1").text().split($(this).text()).length - 1)
		var count = $("tr[data-articul='" + $(this).text() + "']").length;
		if(count < 1){
			$(this).addClass('red');
			isTestOk = false;
			localResult = "<span class='red'>не все</span>";
		}
	})
	
	text += "Позиции с модели есть в спецификации: " + localResult + "<br/>";
	
	var isModelSpecOk = true;
	var errItems = checkSpecModel();
	if (errItems.length > 0) isModelSpecOk = false;
	var modelResult = "<span class='green'>все</span>";
	if (!isModelSpecOk) {
		modelResult = "<span class='red'>не все <br>Нехватает:<br>";
		// modelResult +=
		errItems.forEach(function(elem){
			modelResult += elem.articul + " " + elem.name + "<br>"
		});
		modelResult += "</span>"
	}
	text += "Позиции из спецификации есть на модели: " + modelResult + "<br/>";

	// var isModelCountOk = true;
	// var errItems = checkSpecModelCount();
	// if (errItems.length > 0) isModelCountOk = false;
	// var modelResult = "<span class='green'>да</span>";
	// if (!isModelCountOk) {
	// 	modelResult = "<span class='red'>нет <br>Несовпадает:<br>";
	// 	// modelResult +=
	// 	errItems.forEach(function(elem){
	// 		modelResult += elem.articul + " " + elem.name + " " + elem.amt + "/" + calcItemsCount(elem.articul) + "<br>"
	// 	});
	// 	modelResult += "</span>"
	// }
	// text += "Количество позиций из спецификации совпадает с количеством на модели: " + modelResult + "<br/>";

	//проверка покраски
	var isPaintingOk = true;
	var isMaterialOk = true;
	$("#timberSpec .specRow").each(function(){
		var isItemColorOk = true;
		var isItemMatOk = true;
		var articul = $(this).find("td[data-propId='articul']").text().toLowerCase();
		var name = $(this).find("td[data-propId='name']").text().toLowerCase();
		var painting = $(this).find("td[data-propId='painting']").text().toLowerCase();

		if(articul.indexOf('tread') != -1){
			if(painting.indexOf(params.treadsColor) == -1) isItemColorOk = false;
			if(name.indexOf(params.treadsMaterial) == -1) isItemMatOk = false;
		} 
		if(articul.indexOf('stringer') != -1){
			if(painting.indexOf(params.stringersColor) == -1) isItemColorOk = false;
			if(name.indexOf(params.stringersMaterial) == -1) isItemMatOk = false;
		} 
		if(articul.indexOf('riser') != -1){
			if(painting.indexOf(params.risersColor) == -1) isItemColorOk = false;
			if(name.indexOf(params.risersMaterial) == -1) isItemMatOk = false;
		} 
		if(articul.indexOf('skirting') != -1){
			if(painting.indexOf(params.skirtingColor) == -1) isItemColorOk = false;
			if(name.indexOf(params.skirtingMaterial) == -1) isItemMatOk = false;
		} 
		if(articul.indexOf('newell') != -1){
			if(painting.indexOf(params.newellsColor) == -1) isItemColorOk = false;
			if(name.indexOf(params.newellsMaterial) == -1) isItemMatOk = false;
		} 
		if(articul.indexOf('timberBal') != -1){
			if(painting.indexOf(params.timberBalColor) == -1) isItemColorOk = false;
			if(name.indexOf(params.timberBalMaterial) == -1) isItemMatOk = false;
		} 
		if(articul.indexOf('handrail') != -1){
			if(painting.indexOf(params.handrailsColor) == -1) isItemColorOk = false;
			if(name.indexOf(params.handrailsMaterial) == -1) isItemMatOk = false;
		} 
		
		
		if(!isItemColorOk) {
			isPaintingOk = false;
			$(this).find("td[data-propId='painting']").addClass("red");

		};
		
		if(!isItemMatOk) {
			isMaterialOk = false;
			$(this).find("td[data-propId='name']").addClass("red");

		};
	})
	
	//проверяем наименования складских позиций
	var isNamesOk = true;
	$("#stock1_list, #stock2_list").find('td[data-propid="name"]').each(function(){
		if(getStockNames().indexOf($(this).text()) == -1 && $(this).text().indexOf("Стекло") == -1){
			$(this).addClass('red');
			isNamesOk = false;
		}
	})

	$("#specCheckResult").html("");//Очищаем div
	//Проверяем входную лестницу
	var isVhodOk = true;
	if (params.calcType == 'vhod' && params.staircaseType == 'Готовая') {
		$("#specCheckResult").html("<span id='vhodCompareTable' class='compareToggleDiv closed'>Подробнее</span>");
		$("#specCheckResult").append("<div id='vhodCompareSpec' style='display: none;'></div><br>");
		if (typeof calculatedSpec !== 'undefined' && typeof modelSpec !== 'undefined') {
			compareAndPrintSpecs(calculatedSpec, modelSpec);
			isVhodOk = checkSpec_vhod();
			//Добавляем в начало, так как на этапе тестирования таблица уже должна быть, но результат выводим перед ней, для удобства интерфейса
			$("#specCheckResult").prepend("Тест входной лестницы " + (isVhodOk ? "<span class='green'>пройден</span>" : "<span class='red'>не пройден</span>"));
		}
	}
	
	if(isPaintingOk) text += "Цвет морилки <span class='green'>совпадает с параметрами</span><br/>";
 	if(!isPaintingOk){
		isTestOk = false;
		text += "Цвет морилки <span class='red'>НЕ СОВПАДАЕТ с параметрами</span><br/>";
	} 
	
	if(isMaterialOk) text += "Порода дерева <span class='green'>совпадает с параметрами</span><br/>";
 	if(!isMaterialOk){
		isTestOk = false;
		text += "Порода дерева <span class='red'>НЕ СОВПАДАЕТ с параметрами</span><br/>";
	}
	
	if(isNamesOk) text += "Неверные названия складских деталей <span class='green'>отсутствуют</span><br/>";
 	if(!isNamesOk){
		isTestOk = false;
		text += "Неверные названия складских деталей <span class='red'>ОБНАРУЖЕНЫ</span><br/>";
	}
	
	
	
	$("#specCheckResult").append(text);
	
	if(testingMode && $("#testingMode").val() !== 'болты Ф12'){
		var text = "<div class='testResult'>Конфигурация № <span class='configId'>" + $('#configId').val() + "</span>";

			if($('#orderName').val()){
				text += " (" +  $('#orderName').val() + ") ";
			}
			text += " тест спецификации "
			if(isTestOk) text += "<span class='green'> ОК</span><br/>";
			else text += "<span class='red'> НЕ ПРОЙДЕН</span><br/>";
			
			$("#testResults").append(text);
	}
	
	// отправка сообщения об ошибке в багтрекер
	if(!isNamesOk || !isTestOk || !isVhodOk || !isModelSpecOk){		
		var reportPar = {
			description: "Ошибка спецификации",
			screenshoot: "-",
			noAlerts: true,
			}
		if(!isNamesOk) reportPar.description += " Есть нескладские наименования";
		if(isErrWords) reportPar.description += " Есть ошибки в числах";
		if(!isVhodOk) reportPar.description += " Ошибка в входной лестнице";
		if(!isModelSpecOk) reportPar.description += " Не все позиции спецификации есть на модели";
		
		sendBugReport(reportPar); //функция в файле sendReport.js
	}
	
	if(callback) callback();
}

function compareAndPrintSpecs(spec1, spec2){
	var tableStr = "<h1>Рассчетная</h1>";
	tableStr += "<table id='calc_vhod_spec' style='width: 50%; display: inline-block;'>";
	$.each(spec1, function(index, item){
		if (typeof item !== 'function') {
			if (item.items.length > 0) {
				tableStr += printItemRow(index, item);
			}
		}
	});
	tableStr += "</table>";
	tableStr += "<h1>С модели</h1>";
	tableStr += "<table id='model_vhod_spec' style='width: 50%; display: inline-block;'>";
	$.each(spec2, function(index, item){
		if (typeof item !== 'function') {
			if (item.items.length > 0) {
				tableStr += printItemRow(index, item);
			}
		}
	});
	// console.log(tableStr);
	tableStr += "</table>";
	$('#vhodCompareSpec').html(tableStr);
}

function printItemRow(articul, item, isCalc){
	var amt = 0;
	item.items.forEach(function(elem){amt += parseInt(elem.amt);});

	var str = "<tr class='' data-name='" + item.name + "' data-articul='" + articul + "' data-amt='" + amt.toString() + "'>" +
	"<td class='articul'><a style='cursor:pointer' class='showSpecItemOnModel'>" + articul + "</a></td>" +
	"<td class='name'>" + item.name + " </td>";
	str += "<td class='amount'>" + amt.toString() + "</td>";

	str += "</tr>";
	return str;
}

function checkSpecErrors(partsList){
	var noModelItems = {articuls: [], items: []}
	$.each(partsList, function(index, item){
		if(item.items){
			for (var i = 0; i < item.items.length; i++) {
				var itemElem = item.items[i];
				if (itemElem.unit !== "данные с модели") {
					noModelItems.articuls.push(index)
					noModelItems.items.push({id: index, item: item})
				}
			}
		}
	});

	return noModelItems;
}

function checkSpec_vhod(callback){
	var isTestOk = true;

	var calcSpecTable = $('#calc_vhod_spec');
	var modelSpecTable = $('#model_vhod_spec');

	var calcSpecTableItems = calcSpecTable.find('tr');
	var modelSpecTableItems = modelSpecTable.find('tr');

	$.each(calcSpecTableItems, function(index, item){
		var name = $(item).data('name');
		var amt = $(item).data('amt');
		var modelSpecItem = modelSpecTable.find("[data-name='" + name + "']");
		if (modelSpecItem.length > 0) {
			var modelSpecItemAmt = modelSpecItem.data('amt');
			if (amt !== modelSpecItemAmt) {
				$(item).css('background-color','#ffff80');
				isTestOk = false;
			}
		}else{
			$(item).css('background-color','#ff8080');
			isTestOk = false;
		}
	});

	$.each(modelSpecTableItems, function(index, item){
		var name = $(item).data('name');
		var amt = $(item).data('amt');
		var calcSpecItem = calcSpecTable.find("[data-name='" + name + "']");
		if (calcSpecItem.length > 0) {
			var calcSpecItemAmt = calcSpecItem.data('amt');
			if (amt !== calcSpecItemAmt) {
				$(item).css('background-color','#ffff80');
				isTestOk = false;
			}
		}else{
			$(item).css('background-color','#ff8080');
			isTestOk = false;
		}
	});
	//callback присутствует только во время тестирования
	if(callback && $("#testingMode").val() !== 'болты Ф12'){
		var text = "<div class='testResult'>Конфигурация № <span class='configId'>" + $('#configId').val() + "</span>";

			if($('#orderName').val()){
				text += "  <a href='http://6692035.ru/dev/egorov/vhod/?orderName=" + $('#orderName').val() + "'>" +  $('#orderName').val() + ")</a> ";
			}
			text += " тест спецификации входной";
			if (isTestOk) {
				text += "<span class='green'> ОК</span><br/>";
			}else if(params.staircaseType == 'На заказ'){
				text += "<span class='green'>На заказ</span><br/>";
			}else{
				text += "<span class='red'> НЕ ПРОЙДЕН</span><br/>";
			}
			
			$("#testResults").append(text);
	}

	// <div id='vhodCompareSpec'></div>
	
	if(callback) callback();
	return isTestOk;
}

function showSpecItem(specId){
	selectedSpecObj = {specId: specId}
	$("#showAllObjects").trigger("click")
}

/** функция оборачивает в заданный класс встречающиеся в тексте строки str
*/

jQuery.fn.highlight = function (str, className) {
    var regex = new RegExp("\\b"+str+"\\b", "gi");

    return this.each(function () {
        this.innerHTML = this.innerHTML.replace(regex, function(matched) {return "<span class=\"" + className + "\">" + matched + "</span>";});
    });
};