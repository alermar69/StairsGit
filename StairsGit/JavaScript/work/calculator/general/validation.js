$(function () {
	$("#validate").click(function(){
		validateAll();
		checkOrderFiles();
		$("#validationReport").modal('show');
		});
		
	$("#compareModalShow").click(function(){
		$("#compareReport").modal('show');
		});
		
	$("#compareOffers").click(function(){
		compareOffers();
		});
	
	
	

})


/**функция сравнивает значение с эталонным и возвращает true/false
*/

function checkValid_gen(elem){
	var isValid = true;
	
	//скрытые инпуты всегда считаем валидными
	if($(elem).is(':hidden')) return true;
	
	
	var val = $(elem).val();
	
	//незаполненные опции крепления
	if(val == "не указано") isValid = false;
	if(val == "не известно") isValid = false;
	
	
	return isValid;

};

function validateAll(){
	var hasWrongInputs = false;
	var idArr = []; //массив id
	$("input,select").each(function(){
		var isValid = checkValid_gen(this);
		if(!isValid) {
			$(this).css("background-color", "#fcdfdf");
			$(this).closest("td").css("background-color", "#fcdfdf");
			hasWrongInputs = true;
			}
		
		})
	if(hasWrongInputs) {
		$("#val_notSet_res").html("ошибка");
		$("#val_notSet").html('на странице есть параметры с значением "не указано"');
	}
	else $("#val_notSet_res").html("OK");
	
	//зафиксирована цена
	if($("#discountMode").val() == "цена") {
		$("#val_priceFixed_res").html("OK");
		$("#val_priceFixed").html("цена " + $("#discountFactor").val());
		}
	else {		
		$("#val_priceFixed_res").html("ошибка");		
		$("#val_priceFixed").html("не зафиксирована");
		}
	
	//валовка больше 40%
	var vpPart = Number($("#vpPart").text())
	if(vpPart > 40) {
		$("#val_vp_res").text("OK");
		$("#val_vp").text(vpPart + "%");
		}
	else {
		$("#val_vp_res").text("ошибка");
		$("#val_vp").text("Меньше 40% (" + vpPart + "%)");
	}
	
}

/** функция проверяет наличие на сервере файлов и папок и если находит, возвращает ссылку
*/
function checkOrderFiles(){
	
	var offerName = $("#orderName").val();
	//проверка наличия папки
	if(offerName == ""){
		alert("Не указан номер заказа!");
		return;
		}

	//выделяем номер заказа из имени расчета
	if(offerName.charAt(0) != "w"){
		var orderNameLength = offerName.indexOf("-");
		if(orderNameLength > 5) orderNameLength = 5;
		var orderName = offerName.slice(0, orderNameLength);
	}
	if(offerName.charAt(0) == "w"){
		var orderNameLength = 6;
		var orderName = offerName.slice(0, orderNameLength);
	}
	

	var setting = {
		type: 'GET',
		url: '/orders/files/db/actions.php',
		data: {
		   orderName: orderName,
			},
		success: function (data) {
			var result = $.parseJSON(data);
			if(result.status == 'ok'){
				$("#val_folder_res").html("OK");
				$.each(result.data.content, function(){		
				
					//поиск замерочника в технической информации
					if(this.name.indexOf("Техническая") != -1){
						//замерочник в dwg
						var searchPar = {
							folder: this,
							extensions: ["dwg"],
							nameFragments: ["замер"],
							parseFolders: false,
							}
						printFileSeachResult("val_dwg", searchPar);
						
						//замерочник в pdf
						searchPar.extensions = ["pdf"];
						printFileSeachResult("val_pdf", searchPar);
						}
						
				//фото с объекта
					if(this.name.indexOf("Фото") != -1){
						var searchPar = {
							folder: this,
							extensions: ["jpg", "jpeg"],
							nameFragments: [],
							parseFolders: true,
							}
						printFileSeachResult("val_img", searchPar);
						}
					
				//договоры, счета, плажки
					
					if(this.name.indexOf("Договоры") != -1){
						//договор в pdf
						var searchPar = {
							folder: this,
							extensions: ["pdf", "doc", "ods"],
							nameFragments: ["договор"],
							parseFolders: true,
							}
						printFileSeachResult("val_doc", searchPar);
						
						//кп в pdf
						var searchPar = {
							folder: this,
							extensions: ["pdf", "doc", "ods"],
							nameFragments: ["кп"],
							parseFolders: true,
							}
						printFileSeachResult("val_kp", searchPar);

						//геометрия в pdf
						var searchPar = {
							folder: this,
							extensions: ["pdf", "doc", "ods"],
							nameFragments: ["геом"],
							parseFolders: true,
							}
						printFileSeachResult("val_geom", searchPar);
						}
					})
					
					//выделяем цветом
					$("#validationReport tr").each(function(){
						var cell = $(this).find("td:eq(2)");
						if(cell.text() == "OK") {
							$(this).css("background-color", "#CEFFD6");
							}
						if(cell.text() == "ошибка") {
							$(this).css("background-color", "#FFBAEC");
							}
						})
				
				}
			if(result.status == 'not_found' || result.status == "error"){
				console.log("не удалось открыть папку");
				
				$("#val_folder_res").html("ошибка");
				$("#val_folder").html("Папка заказа не найдена");
				}
			
			
			},
		error: function(result){
			console.log(result)
			},
		};
		
	$.ajax(setting);

	return false;		

}//end of searchFiles

/** функция возвращает список файлов с заданным расширением по имени папки
	folder: this, - иерархический массив имен файлов и папок
	extensions: ["jpg", "jpeg"], - расширения (без учета регистра)
	nameFragments: [], - фрагмент названия
	parseFolders: true, - искать ли во вложенных папках
*/
function findFile(par){
	var folder = par.folder;
	var result = "";
	
	//если нет вложенного содержимого
	if(!folder.content) return result;
	
	//перебираем содержимое
	$.each(folder.content, function(){
		//проверяем вложенные папки
		if(this.content && par.parseFolders) {
			par.folder = this;
			result += findFile(par);
			}
		//проверяем файлы
		else {
			var fileName = this.name.replace(folder.name, "");
			//переводим в нижний регистр
			var filsName_lc = fileName.toLowerCase();
			//перебираем все расширения и проверяем вхождение в имя файла
			$.each(par.extensions, function(){
				var extension = "." + this.toLowerCase();
				//если есть фрагменты имени
				if(par.nameFragments && par.nameFragments.length > 0){
					$.each(par.nameFragments, function(){
						var nameFragment = this.toLowerCase();					
						if(filsName_lc.indexOf(extension) != -1 && filsName_lc.indexOf(nameFragment) != -1){
							result += fileName + "<br/>";
							}
						})
					}
				else{
					if(filsName_lc.indexOf(extension) != -1){ 
						result += fileName + "<br/>";
						}
					}
				})
			}
		})

	return result;
};

function printFileSeachResult(divId, searchPar){

	var text = findFile(searchPar);
	if(text != "") {
		$("#" + divId + "_res").html("OK");
		$("#" + divId).html(text);							
		}
	else {
		$("#" + divId + "_res").html("ошибка");
		$("#" + divId).html("файлы не найдены");
		}
}

function compareOffers(){
	var compareType = $("#compareType").val();
	var originOfferId = $("#originOfferId").val();
	if(!originOfferId){
		alert("Введите номер расчета, с которым необходимо сравнить текущий");
		return;
	}
	
	if(compareType == "кп"){
		$.ajax({
			url: '/orders/calc-controller/load-one',
			type: 'GET',
			data: {
			filter: {
				nameFragment: originOfferId,
				},
			},
			dataType: 'json',
			success: function(result){

				if(result.status == 'ok'){
					offerData = JSON.parse(result.data[0].order_data);
					printCompareOffer(offerData);
				}
				else {
					alert("Ошбика на сервере")
				}

			},
			error: function(result){
				console.log(result)
				},
		});
	}
	
	if(compareType == "комплектации"){
		if(originOfferId < 0 || originOfferId >= params.priceItems.length){
			alert("Номер комплектации должен быть от 0 до " +  (params.priceItems.length - 1));
			return;
		}
		offerData = params.priceItems[originOfferId].params;
		printCompareOffer(offerData);
	}

} //end of compareOffers

function printCompareOffer(data){
	printCompareResult(data);
	//выделяем цветом
	$("#offersCompareResult tr").each(function(){
		var cell = $(this).find("td:last");
		if(cell.text() == "совпадает") {
			$(this).css("background-color", "#CEFFD6");
		}
		if(cell.text() == "РАЗНЫЕ") {
			$(this).css("background-color", "#FFBAEC");
		}
	})
}

function printCompareResult(data){
	if(!data) {
		alert("Неверные данные. Сравнение не удалось");
		return;
		}
	var text = "<table class='tab_2'><tbody><tr><th>параметр</th><th>название</th><th>текущий</th><th>другой</th><th>результат</th></tr>"
	
	var ignorList = ["label", "version", "calcType", "calcVersion", "offerDescription", "orderName", "orderDate", "comments", "imageSize"];
	
	if(data.calcType != $("#calcType").val()){
		ignorList.push("staircaseType", "G_min", "angleType")
		}
	
	//добавляем инпуты служебных форм в игнор-лист
	$("#testingInputs, #newBugForm, #offerNameForm").find('input,select,textarea').each(function(){
		ignorList.push(this.id);
		});

	$.each(data, function(key){	
		if(ignorList.indexOf(key) == -1){
			var name = $("#" + key).closest('tr').find("td").eq(0).text();
			name = name.replace(':','');
			if(!name) name = "";
			var res = "совпадает"
			if($("#" + key).val() != this) res = "РАЗНЫЕ"
			
			text += "<tr>" + 
				"<td>" + key + "</td>" + 
				"<td>" + name + "</td>" + 
				"<td>" + $("#" + key).val() + "</td>" + 
				"<td>" + this + "</td>" + 
				"<td>" + res + "</td>" + 
				"</tr>"
		}
	});
	
	text += "</tbody></table>"
	
	$("#offersCompareResult").html(text);

}
