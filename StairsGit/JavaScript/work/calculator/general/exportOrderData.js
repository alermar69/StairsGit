$(function () {

	$("#makeAccepted").click(function(){
		//привязка заказа невозможна в упрощенном режиме отрисовки
		if(menu.simpleMode){
			alert("ВНИМЕНИЕ! Не удалось привязать заказ. Отключите упрощенный режим отрисовки модели!")
			return;
		}
		
		//из раздела /dev/ добавляем в тестовую базу
		var testDb = false;
		var url = document.location.href;
		if(url.indexOf("dev") != -1) testDb = true;
		
		var queryUrl = "/orders/offer-controller/action-get-data";
		if(testDb) queryUrl = "/dev/rodionov/orders/offer-controller/action-get-data";
		
		$.ajax({
			url: queryUrl,
			type: "GET",
			dataType: 'json',
			data: {
				name: $("#orderName").val(),
				},

			success: function (data) {
				var wrightData = false;
				if(data.id) {
					wrightData = confirm("Этот расчет уже запущен в работу. Обновить данные в базе?");
					};
				if(wrightData || data.result == "not_found"){
					//формируем объект для выгрузки					
					var exportObj = getExportData_com();
					addOfferToOrder(exportObj);
				};
			},
			error: function( jqXhr, textStatus, errorThrown ){
				console.log(jqXhr, textStatus, errorThrown)
				alert('Ошибка на сервере ' + errorThrown );
			}

		});
		
	});
	
	//ручные или автоматические данные для экспорта
	$(".exportData_type").change(function(){
		if($(this).val() == "вручную") {
			$(this).closest("div").find(".manualValues").removeClass("d-none")
			checkDeptSum()
		}
		else $(this).closest("div").find(".manualValues").addClass("d-none");
	})
	
	//расчет суммы введенного вручную распределения по цехам
	$("input.deptPart").change(function(){
		checkDeptSum();
	})

});

/** функция проверяем сумму вручную введенного распределения по цехам */
function checkDeptSum(){
	var totalSum = 0;
	$("input.deptPart").each(function(){
		totalSum += $(this).val() * 1.0;
	})
	
	$("#totalDeptSum").text(totalSum);
	if(totalSum != $("#price_data_prodSum").text()) {
		$("#totalDeptSum").addClass("red")
		return false;
	}
	
	$("#totalDeptSum").removeClass("red")
	return true;
}


/** функция создает объект с данными из КП для экспорта в базу заказов
Работает с глобальными объектами staircasePrice, workList, materials
*/

function getExportData_com(checkSumm){
	var url = document.location.href;
	var checkPrice = false;
	if(url.indexOf('calculator') != -1 && url.indexOf('dev') == -1) checkPrice = true;

	//данные по цене
	// debugger;
	var price_data = {
		carcas: {
			name: "Каркас",
			price: staircasePrice.carcasFinal,
			metalPaint: staircasePrice.carcasMetalPaint,
			timberPaint: 0,
			stage: params.carcasAssmStage,
			},
		treads: {
			name: "Ступени",
			price: staircasePrice.treadsFinal,
			metalPaint: 0,
			timberPaint: staircasePrice.carcasTimberPaint,
			stage: params.treadsAssmStage,
			},
		railing: {
			name: "Ограждения",
			price: staircasePrice.railingFinal,
			metalPaint: staircasePrice.railingMetalPaint,
			timberPaint: staircasePrice.railingTimberPaint,
			stage: params.railingAssmStage,
			},
		banister: {
			name: "Балюстрада",
			price: staircasePrice.banisterFinal,
			metalPaint: staircasePrice.banisterMetalPaint,
			timberPaint: staircasePrice.banisterTimberPaint,
			stage: params.banisterAssmStage,
			},
		};
	
	if(params.calcType == "railing"){
		var price_data = {
			railing: {
				name: "Ограждения",
				price: staircasePrice.railingFinal,
				metalPaint: 0,
				timberPaint: 0,
			},
			treads: {
				name: "Ступени",
				price: staircasePrice.treadsFinal,
				metalPaint: 0,
				timberPaint: 0,
			},
			risers: {
				name: "Подступенки",
				price: staircasePrice.risersFinal,
				metalPaint: 0,
				timberPaint: 0,
			},
			skirting: {
				name: "Плинтуса",
				price: staircasePrice.skirtingFinal,
				metalPaint: 0,
				timberPaint: 0,
			},
			treads: {
				name: "Установка",
				price: staircasePrice.assemblingFinal,
				metalPaint: 0,
				timberPaint: 0,
			}
		};
	}
		
	if(params.calcType == "fire_2"){
		price_data.carcas.name = "Лестница";
	}
	if(params.calcType == "custom"){
		var price_data = {
			product: {
				name: "Изделие",
				price: staircasePrice.product,
				metalPaint: 0,
				timberPaint: 0,
			},
		};
		
	};
	
	if(params.calcType == "slabs"){
		var price_data = {};
		var discountFactor = staircasePrice.finalPrice / staircasePrice.total;
		$(".estimateItem").each(function(){
			var id = $(this).find(".id").text();

			price_data[id] = {
				name: $(this).find(".name").val(),
				price: $(this).find(".summ").text() * discountFactor,
				metalPaint: 0,
				timberPaint: 0,
			};
			
			//распределение по участкам
			price_data[id].production = price_data[id].price;
			price_data[id].assembling = 0;
			price_data[id].delivery = 0;
			
			if($(this).find(".unitType").val() == "сборка"){
				price_data[id].production = 0;
				price_data[id].assembling = price_data[id].price;
				price_data[id].delivery = 0;
			}
			if($(this).find(".unitType").val() == "доставка"){
				price_data[id].production = 0;
				price_data[id].assembling = 0;
				price_data[id].delivery = price_data[id].price;
			}
			
		});
		
	};

	
	//исправляем пустые значения
	for(var unit in price_data){
		if(!price_data[unit]['price']) price_data[unit]['price'] = 0;	
	}
	
	if(params.calcType != "slabs" && params.calcType != "custom"){
		//подсчитываем общие данные
		price_data.main = 
			{
			price: 0,
			metalPaint: 0,
			timberPaint: 0,
			production: 0,
			assembling: staircasePrice.assemblingFinal
		};
		
		if(!price_data.main.assembling) price_data.main.assembling = 0;
		for(var unit in price_data){
			if(unit != "main"){
				var totalPrice = 0;
				for(var pricePart in price_data[unit]){
					if(pricePart != "name" && pricePart != "stage"){
						//исправляем некорректные значения
						if(!price_data[unit][pricePart]) price_data[unit][pricePart] = 0;
						//подсчитываем общую сумму по каждому пункту
						totalPrice += price_data[unit][pricePart];
						//подсчитываем общие данные по заказу
						price_data.main[pricePart] += price_data[unit][pricePart];
						price_data.main.production += price_data[unit][pricePart];
						}
					};
				price_data[unit].production = totalPrice;			
				};
			};
		//распределяем монтаж пропорционально между всеми позициями

		var assemblingSum = 0; //контрольная сумма
		for(var unit in price_data){
			if(unit != "main"){
				price_data[unit].assembling = staircasePrice.assemblingFinal * (price_data[unit].production / price_data.main.production);
				//округляем сумму монтажа
				price_data[unit].assembling = Math.round(price_data[unit].assembling);
				if(!price_data[unit].assembling) price_data[unit].assembling = 0;
				assemblingSum += price_data[unit].assembling;
				};
			};
		
		//исправляем ошибку округления сумм монтажа про разным узлам
		if(staircasePrice.assemblingFinal != assemblingSum){
			//добавляем разницу в первый ненулевой пункт
			for(var unit in price_data){
				if(unit != "main" && price_data[unit].assembling){
					price_data[unit].assembling += staircasePrice.assemblingFinal - assemblingSum;
					break;
				};
			};
		}
		
		//доставка
		
		price_data.main.delivery = staircasePrice.delivery;
		if(!price_data.main.delivery) price_data.main.delivery = 0;

	}
	if(params.calcType == "slabs"){
		price_data.main = {
			price: staircasePrice.total,
			metalPaint: 0,
			timberPaint: 0,
			production: 0,
			assembling: 0,
			delivery: 0,
		}
		var discountFactor = staircasePrice.finalPrice / staircasePrice.total;
		$("#estimate_mat .estimateItem").each(function(){
			price_data.main.production += $(this).find(".summ").text() * discountFactor;
		})
		$("#estimate_works .estimateItem").each(function(){
			var dept = "assembling"
			if($(this).find(".unitType").val() == "доставка") dept = "delivery";
			price_data.main[dept] += $(this).find(".summ").text() * discountFactor;
		})
	};
	
	if(params.calcType == "custom"){
		price_data.main = {
			price: staircasePrice.total,
			metalPaint: 0,
			timberPaint: 0,
			production: staircasePrice.finalPrice,
			assembling: staircasePrice.assembling,
			delivery: staircasePrice.delivery,
		}
	}
	if (params.calcType == "carport") {
		price_data.main = {
			price: staircasePrice.total,
			metalPaint: 0,
			timberPaint: 0,
			production: staircasePrice.carcasFinal,
			assembling: staircasePrice.assembling,
			delivery: staircasePrice.delivery,
		}
	}
	if (params.calcType == "railing") {
		price_data.main = {
			price: staircasePrice.total,
			metalPaint: 0,
			timberPaint: 0,
			production: staircasePrice.railingFinal,
			assembling: staircasePrice.assemblingFinal,
			delivery: staircasePrice.delivery,
		}
	}
	if (window.additional_objects) {
		price_data.main.additional_objects = staircasePrice.additionalObjectsFinalPrice;
	}else{
		price_data.main.additional_objects = 0;
	}
	
	//общая цена заказа

	var totalPrice = price_data.main.production + price_data.main.assembling + price_data.main.delivery + price_data.main.additional_objects;

	if(Math.abs(staircasePrice.finalPrice - totalPrice) > 0.01 && checkPrice && totalPrice){
		console.log("Ошибка расчета цены для выгрузки: " + totalPrice + " != " + staircasePrice.finalPrice )
		// отправка сообщения об ошибке в багтрекер
		
		var reportPar = {
			description: "Ошибка расчета цены для выгрузки",
			screenshoot: "system",
			link: url,
			user: $("#userName").text(),
			noAlerts: true,
			}
		sendBugReport(reportPar); //функция в файле sendReport.js
	}

	price_data.main.total = totalPrice;


//краткое описание лестницы

	var description = "";
	
	//покраска металла
	var metalPaintName = "Покраска " + params.metalPaint;
	var hasColorComment = false;
	$("#colorsFormTable tr[data-mat='metal']").each(function(){
		if($(this).find("select.Color").val() == "см.комментарий") hasColorComment = true;
	})
	if(params.calcType == "vint" && params.carcasColor == "см.комментарий") hasColorComment = true;
	if(hasColorComment) metalPaintName += " (нестандартынй цвет)"
	metalPaintName += ". ";
	
	//покраска дерева
	var timberPaintName = params.timberPaint;
	var hasColorComment = false;
	$("#colorsFormTable tr[data-mat='timber']").each(function(){
		if($(this).find("select.Color").val() == "см.комментарий") hasColorComment = true;
	})
	if(params.calcType == "vint" && params.carcasColor == "см.комментарий") hasColorComment = true;
	if(hasColorComment) timberPaintName += " (нестандартынй цвет)"

	
	
	var calcTypes = ['metal', 'mono', 'bolz', 'console'];
	if(calcTypes.indexOf(params.calcType) != -1){
		if(staircaseHasUnit().carcas){
			if(params.calcType == "metal") {
				if(params.model == "лт") description = "ЛТ";
				if(params.model == "ко") description = "КО";
				}
			if(params.calcType == "mono") description = "МК";
			if(params.calcType == "bolz") description = "Больцевая";
			if(params.calcType == "console") description = "Консольная";
			
			if(params.stairModel == "Прямая") description += "-1";
			if(params.stairModel == "Г-образная с площадкой") description += "-2";
			if(params.stairModel == "Г-образная с забегом") description += "-3";
			if(params.stairModel == "П-образная с площадкой") description += "-4";
			if(params.stairModel == "П-образная с забегом") description += "-5";
			if(params.stairModel == "П-образная трехмаршевая") description += " трехмаршевая";
			if(params.stairModel == "Прямая двухмаршевая") description += " прямая двухмаршевая";		
			if(params.platformTop != "нет") description += " с верхней площадкой";
			
			if(params.calcType == "mono"){
				if(params.model == "сварной") description += " сварной короб";
				if(params.model == "труба") description += " на проф. трубе";
				}
				
			description += " " + calcTotalStepAmt() + " подъемов. " + metalPaintName;
			
			};
		};
		
	if(params.calcType.indexOf("timber") != -1){
		description = "Деревянная " + params.stairModel + " " + calcTotalStepAmt() + " подъемов. " + 		
			"Каркас " + params.model + " " + params.stringersMaterial + ". "
		};
		
	if(params.calcType == "vhod"){
		description = "Входная " + params.staircaseType + " " + params.stairModel + " " + calcTotalStepAmt() + " подъемов. " + 		
			"Верхняя площадка: " + params.platformTop + ". " + metalPaintName;
		};
		
	if(params.calcType == "fire_2"){
		description = " " + params.staircaseType + " L=" + Math.round(params.stairCaseLength / 100) / 10 + " м.п. " + 		
			"Площадка " + params.pltLength + " мм";
		};
	if(params.calcType == "custom"){
		description = params.descr;
	};	
		
	
//ступени, ограждения
	
	if(params.calcType == "metal" || params.calcType == "mono" || params.calcType == "vhod"){
		var treadsName = params.stairType;
		if(params.stairType == "массив") {
			treadsName = params.treadsMaterial;
			if(params.treadThickness > 40) treadsName += " " + params.treadThickness + "мм"			
		}
		description += "Ступени " + treadsName;
		if(params.riserType == "есть") description += " подступенки " + params.risersMaterial
		//покраска деревянных ступеней

		if(staircaseHasUnit().treads && calcTreadParams().isTimberPaint) 
			description += ", покраска " + timberPaintName + " " + params.surfaceType + ".";
			
		if(staircaseHasUnit().skirting) description += " Есть плинтус.";
		
		if(params.treadLigts == "есть") description += " Есть подсветка."

		if(staircaseHasUnit().railing) description += " Ограждения " + params.railingModel;

		}
		
	if(params.calcType.indexOf("timber") != -1){
		
		description += "Ступени " + params.treadsMaterial;
		if(params.riserType == "есть") description += " подступенки " + params.risersMaterial; 
		//покраска деревянных ступеней

		if(staircaseHasUnit().treads && calcTreadParams().isTimberPaint) 
			description += ", покраска " + timberPaintName + " " + params.surfaceType + ".";
			
		if(staircaseHasUnit().skirting) description += " Есть плинтус.";


		if(staircaseHasUnit().railing) description += " Ограждения " + params.railingModel;

		}
	
	if(params.calcType == "vint"){
		description = params.model + " Ф" + params.staircaseDiam;
		if(params.platformType == "triangle") description += ", площадка треугольная,"
		if(params.platformType == "square") description += ", площадка прямоугольная,"
		description += " " + params.stepAmt + " подъемов. " + metalPaintName + 
			" Ступени " + params.treadMaterial;
		if(params.treadMaterial != "рифленая сталь" && params.treadMaterial != "лотки под плитку")
			description += ", покраска " + timberPaintName + ".";
		description += " Ограждения " + params.railingModel + " " + params.rackType + ", поручень " + params.handrailMaterial;
		
		}
	
	if(params.calcType == "railing"){
		description = "Ограждения";
		var types = {};
		for(var i=0; i<params.railingSectAmt; i++){
			var inputId = "railingType" + i;
			var type = params[inputId];
			if(!types[type]) {
				types[type] = {
					name: type,
					amt: 0,
					len: 0,
					};
				}
			types[type].amt += 1;
			types[type].len += Math.round(params["len" + i] / Math.cos(params["angle" + i] * Math.PI / 180) / 1000 * 10) / 10;			
			}
		
		for(var type in types){
			description += " " + type + " " + Math.round(types[type].len * 10) / 10 + " м.п. (" + types[type].amt + " секц.)";
			}
		}
		
	if(params.calcType == "slabs"){
		description = "";
		//подсчитываем кол-во изделий каждого типа
		var unitTypes = {};
		$(".estimateItem").each(function(){
			var $row = $(this);
			var type = $row.find(".unitType").val()
			var amt = $row.find(".amt").val()
			if(!unitTypes[type]) unitTypes[type] = 0;
			unitTypes[type] += amt * 1.0;
		});
		
		//формируем описание		
		for(var key in unitTypes){
			description += key + ": " + unitTypes[key] + " шт; "
		};
		description += "Покраска дерева " + params.timberPaint;
	}
	
			
	if(staircaseHasUnit().banister) description += ", Балюстрада " + params.railingModel_bal + " " + calcBanisterLen() + "м.п. ";

	//установка
	if(params.isAssembling == "нет") description += ". Без монтажа"
	if(params.isAssembling == "есть") {
		if(params.workers == 1) description += ". Монтаж 1 этап"
		if(params.workers > 1) description += ". Монтаж " + params.workers + " этапа"
	}
	
	

description =  description.split("undefined").join("не указано");;

if(params.product_descr_type == "вручную") description = $("#product_descr_manual").val()
	
//данные по цехам

	var dept_data = {
		metal: 0,
		timber: 0,
		partners: 0,
		assembling: price_data.main.assembling + price_data.main.delivery,
		}
	
	if(params.calcType != "vint" && params.calcType != "custom" && params.calcType != "slabs" && params.calcType != "carport"){
		if(params.calcType != "railing"){
			//каркас
			if(params.calcType.indexOf("timber") == -1) dept_data.metal += price_data.carcas.production;
			if(params.calcType.indexOf("timber") != -1) dept_data.timber += price_data.carcas.production;
			
			//ступени
			if (params.stairType == "рифленый алюминий" || params.stairType == "пресснастил" || params.stairType == "рифленая сталь" || params.stairType == "лотки") 
				dept_data.metal += price_data.treads.production;
			if (params.stairType == "стекло") dept_data.partners += price_data.treads.production;
			if (calcTreadParams().isTimberPaint || params.stairType == "дпк") 
				dept_data.timber += price_data.treads.production;
			}
			
		//ограждения
		
		var metal = staircasePrice.railing_metal + price_data.railing.metalPaint;
		var timber = staircasePrice.railing_timber + price_data.railing.timberPaint;
		var partners = staircasePrice.railing_glass;
		if(params.calcType == "vhod" && params.staircaseType == "Готовая"){
			metal = price_data.railing.price;
			timber = partners = 0;
			}
		var sum = metal + timber + partners;
		var discount = sum - price_data.railing.production;

		//распределяем скидку равномерно по всем позициями
		if(sum){
			metal -= discount * metal / sum;
			timber -= discount * timber / sum;
			partners -= discount * partners / sum;		
			
			dept_data.metal += metal;
			dept_data.timber += timber;
			dept_data.partners += partners;
			}
		
		}

	if(params.calcType == "vint"){
		dept_data.timber = Math.round(price_data.carcas.production * staircaseCost.timberPart);
		dept_data.metal = price_data.carcas.production - dept_data.timber;
		}
		
	if(params.calcType == "fire_2"){
		dept_data.partners += staircasePrice.testing;
		dept_data.metal -= staircasePrice.testing;
		}

	//балюстрада
	if(params.calcType != "railing" && params.calcType != "custom" && params.calcType != "carport" && params.calcType != "slabs"){
		var metal = staircasePrice.banister_metal + price_data.banister.metalPaint;
		var timber = staircasePrice.banister_timber + price_data.banister.timberPaint;
		var partners = staircasePrice.banister_glass;
		var sum = metal + timber + partners;
		var discount = sum - price_data.banister.production;
		
		//распределяем скидку равномерно по всем позициями
		if(sum){
			metal -= discount * metal / sum;
			timber -= discount * timber / sum;
			partners -= discount * partners / sum;		
			
			dept_data.metal += metal;
			dept_data.timber += timber;
			dept_data.partners += partners;
			}
		}
	if(params.calcType == "custom"){		
		dept_data.metal = staircasePrice.metal;
		dept_data.timber = staircasePrice.timber;
		dept_data.partners = staircasePrice.partners;
	}

	if(params.calcType == "carport"){
		dept_data.metal = staircasePrice.finalPrice;
	}
	if(params.calcType == "railing"){
		dept_data.metal = staircasePrice.railingFinal;
	}
	
	if(params.calcType == "slabs"){		
		var discountFactor = staircasePrice.finalPrice / staircasePrice.total;
		dept_data.metal = 0
		dept_data.timber = 0
		dept_data.partners = 0
		
		$("#estimate_mat .estimateItem").each(function(){
			var sum = $(this).find(".summ").text() * discountFactor;
			dept_data.metal += sum * $(this).find(".metalPart").val() / 100;
			dept_data.timber += sum * $(this).find(".timberPart").val() / 100;
			dept_data.partners += sum * $(this).find(".partnersPart").val() / 100;
		})
	}

	//проверка
	var deptsSum = dept_data.metal + dept_data.timber + dept_data.partners;
	if (params.calcType == 'carport') var deptsSum = staircasePrice.carcasFinal;
	if (params.calcType == 'railing') var deptsSum = staircasePrice.railingFinal;

	if(Math.abs(deptsSum - price_data.main.production) > 1 && checkPrice){
		var errorText = "Ошибка расчета сумм по цехам - сумма стоимости по цехам не равна стоимости изделия: " + deptsSum + " != " + price_data.main.production;
		console.log(errorText);
		// отправка сообщения об ошибке в багтрекер
		var url = document.location.href;
		var reportPar = {
			description: "Ошибка расчета цены для выгрузки",
			screenshoot: "system",
			link: url,
			user: $("#userName").text(),
			noAlerts: true,
			}
		//не добавляем ошибки из папки разработчиков
		if(url.indexOf("dev") == -1) sendBugReport(reportPar); //функция в файле sendReport.js
		};
	
	//ручной ввод распределения по цехам
		if(params.dept_data_type == "вручную"){
			//исправляем некорректные значения
			checkDeptSum();
			var deptsSum = params.metalDeptPart + params.timberDeptPart + params.partnersDeptPart
			if(Math.abs(deptsSum - price_data.main.production) > 1){
				var errorText = "Введено неверное распределение сумм по цехам - сумма стоимости по цехам должна совпадать с общей стоимостью изделия: " + deptsSum + " != " + price_data.main.production + " Будет установлено расчетное распределение."
				alert(errorText);
				$("input.deptPart").each(function(){					
					$(this).val(dept_data[$(this).attr('data-dept')])
				})
			}
			else{
				var dept_data = {
					metal: params.metalDeptPart,
					timber: params.timberDeptPart,
					partners: params.partnersDeptPart,
					assembling: price_data.main.assembling + price_data.main.delivery,
				}
				
			}
		}
	
	
	// формируем объект с данными о трудоемкости без нулевых позиций для сохранения в базу
	var workList_sm = {};
	for(var dept in workList){
		workList_sm[dept] = {};
		//общие данные
		workList_sm[dept].totalTime = workList[dept].totalTime;
		workList_sm[dept].deptName = workList[dept].deptName; 
		workList_sm[dept].outputDivId = workList[dept].outputDivId;		
		
		//цикл перебора работ участка
		for(var work in workList[dept]){
			if(workList[dept][work]["amt"]){
				workList_sm[dept][work] = workList[dept][work];
			}		
		}
	}
	
	var materials_sm = {};
	
	for(var mat in materials){
		if(materials[mat]["amt"] != 0){
			materials_sm[mat] = materials[mat];
			materials_sm[mat].amt = Math.round(materials_sm[mat].amt * 10) / 10;
			}
		}

	//данные по времени производства
	var mainDepts = ["metal", "timber", "painting", "plasma", "powder", "cnc", "timber"];	
	//добавляем пустые массивы
	$.each(mainDepts, function(){
		if(!workList_sm[this]) workList_sm[this] = {};
		workList_sm[this].planningTimes = [];
	});

	//металлический цех
	if(workList_sm.metal.totalTime || workList_sm.plasma.totalTime || workList_sm.powder.totalTime){
		var dept = "metal";
		
		if(params.calcType == "metal" || params.calcType == "vhod"){
			//стандартное время
			var opTime = {
				val: 2,
				descr: "стандартное изготовление ЛТ или КО",
			};
			workList_sm[dept].planningTimes.push(opTime);
			
			//дополнительне время			
			var frameAmt = getPartAmt("treadFrame") + getPartAmt("vertFrame") + (getPartAmt("wndFrame1") + getPartAmt("wndFrame2") + getPartAmt("wndFrame3")) * 2;
			if(frameAmt > 20){
				var opTime = {
					val: 1,
					descr: "много рамок",
				};
				workList_sm[dept].planningTimes.push(opTime);
			}
			
			if(params.stairType == "рифленая сталь" || params.stairType == "лотки"){
				var opTime = {
					val: 1,
					descr: "сварные ступени",
				};
				workList_sm[dept].planningTimes.push(opTime);
			}
			
			if(params.stairType == "стекло"){
				var opTime = {
					val: 1,
					descr: "забежные рамки из профиля",
				};
				workList_sm[dept].planningTimes.push(opTime);
			}
		} //конец лт-ко
		
		if(params.calcType == "mono"){
			//стандартное время
			var opTime = {
				val: 3,
				descr: "стандартное изготовление МК",
			};
			workList_sm[dept].planningTimes.push(opTime);
			
			//дополнительне время		
			if(params.stairAmt1 > 6){
				var opTime = {
					val: 1,
					descr: "косоур нижнего марша больше 6 ступеней",
				};
				workList_sm[dept].planningTimes.push(opTime);
			}
			
			if(params.stairAmt3 > 6 && params.stairModel != "Прямая"){
				var opTime = {
					val: 1,
					descr: "косоур верхнего марша больше 6 ступеней",
				};
				workList_sm[dept].planningTimes.push(opTime);
			}
			
			if(params.stairAmt2 > 6 && params.stairModel == "П-образная трехмаршевая"){
				var opTime = {
					val: 1,
					descr: "косоур среднего марша больше 6 ступеней",
				};
				workList_sm[dept].planningTimes.push(opTime);
			}
		} //конец монокосоуров
		
		if(params.calcType == "vint"){
			//стандартное время
			var opTime = {
				val: 4,
				descr: "стандартное изготовление винтовой",
			};
			workList_sm[dept].planningTimes.push(opTime);
			
			if(params.model == "Винтовая с тетивой"){
				var opTime = {
					val: 10,
					descr: "спиральная тетива",
				};
				workList_sm[dept].planningTimes.push(opTime);
			}
			
			if(params.handrailMaterial == "Дуб"){
				var opTime = {
					val: 2,
					descr: "сборка в цеху",
				};
				workList_sm[dept].planningTimes.push(opTime);
			}
			
			if(params.treadMaterial == "рифленая сталь" || params.treadMaterial == "лотки под плитку"){
				var opTime = {
					val: 1,
					descr: "сварные ступени",
				};
				workList_sm[dept].planningTimes.push(opTime);
			}
			
		}//конец винтовой
		
		//общие позиции для всех типов лестниц
		
		if(workList_sm.powder.totalTime){
			var opTime = {
				val: 2,
				descr: "покраска",
			};
			workList_sm[dept].planningTimes.push(opTime);
		}
		
		if(params.railingModel == "Кованые балясины" || (params.railingModel_bal == "Кованые балясины" && params.banisterSectionAmt > 0)){
			var opTime = {
				val: 2,
				descr: "ограждения с ковкой",
			};
			workList_sm[dept].planningTimes.push(opTime);
		}
		
	} //конец металла
	
	if(workList_sm.cnc.totalTime || workList_sm.timber.totalTime){
		var dept = "timber";
		
		if(params.calcType != "timber"){
			//стандартное время
			var opTime = {
				val: 2,
				descr: "стандартное изготовление",
			};
			workList_sm[dept].planningTimes.push(opTime);
			
			if(params.treadThickness > 45){
				var opTime = {
					val: 3,
					descr: "склейка ступеней по толщине",
				};
				workList_sm[dept].planningTimes.push(opTime);
			}
			
			if(params.calcType == "vint" && params.handrailMaterial == "Дуб"){
				var opTime = {
					val: 2,
					descr: "гнутоклееный поручень",
				};
				workList_sm[dept].planningTimes.push(opTime);
			}
			
		}
		
		if(params.calcType.indexOf("timber") != -1){
			//стандартное время
			var opTime = {
				val: 3,
				descr: "стандартное изготовление деревянной",
			};
			workList_sm[dept].planningTimes.push(opTime);
			
			if(getPartAmt("timberBal") + getPartAmt("timberNewell") > 0){
				var opTime = {
					val: Math.ceil((getPartAmt("timberBal") + getPartAmt("timberNewell") * 2) / 40),
					descr: "деревянные столбы и балясины",
				};
				workList_sm[dept].planningTimes.push(opTime);
			}
			
			if(params.timberPaint != "не указано" && params.timberPaint != "нет"){
				var opTime = {
					val: 5,
					descr: "шлифовка, предсборка в цеху",
				};
				workList_sm[dept].planningTimes.push(opTime);
			}
			
			
		} //конец деревянных
		
		//общие позиции
		if(getPartAmt("riser_arc") > 0){
			var opTime = {
				val: getPartAmt("riser_arc"),
				descr: "гнутоклееные подступенки",
			};
			workList_sm[dept].planningTimes.push(opTime);
		}
		
	}// конец дерева
	
	if(workList_sm.painting.totalTime){
		var dept = "painting";
		var paintingTime = Math.ceil(workList_sm.painting.totalTime / 15);
		if(paintingTime < 2) paintingTime = 2;
		
		var opTime = {
			val: paintingTime,
			descr: "покраска",
		};
		workList_sm[dept].planningTimes.push(opTime);
	}
	
//данные по себестоимости
		var cost_data = {};
		if(params.isAssembling == "есть") cost_data.assembling = calcAssemblingWage().totalWage;
		cost_data.vp = $("#vpSum").text() * 1.0;
		
//данные по этапам монтажа
	var assembling_data = {};
	//монтаж
	assembling_data.isAssembling = params.isAssembling
	assembling_data.delivery = params.delivery;
	if(params.delivery == "Московская обл.") assembling_data.delivery += " " + params.deliveryDist + " км"
	
	//кол-во этапов
	assembling_data.stagesAmt = params.workers;
	if(params.workers == "нет") assembling_data.stagesAmt = 0;
	
	//содержание этапов
	if(assembling_data.stagesAmt > 1){
		assembling_data.stages = {};
		$(".assmStages select").each(function(){
			var stage = $(this).val();
			if(stage != "нет"){
				if(!assembling_data.stages[stage]) assembling_data.stages[stage] = "";
				else assembling_data.stages[stage] += ", "
				assembling_data.stages[stage] += $(this).closest("tr").find("td:eq(0)").text();
			}
		})		
	}
	assembling_data.comment_assm = $("#comments_assm").val();
	assembling_data.comment_prod = $("#comments_prod").val();
	
//возвращаемый объект

	var exportObj = {
		price_data: price_data,
		dept_data: dept_data,
		product_descr: description,
		production_data: workList_sm,
		materials_data: materials_sm,
		cost_data: cost_data,
		assembling_data: assembling_data,
		}

	return exportObj;
	
} //end of getExportData_com

function addOfferToOrder(data){
	
	//из раздела /dev/ добавляем в тестовую базу
	var testDb = false;
	var url = document.location.href;
	if(url.indexOf("dev") != -1) testDb = true;
	
	var queryUrl = "/orders/offer-controller/action-create";
	if(testDb) queryUrl = "/dev/rodionov/orders/offer-controller/action-create";

    $.ajax({
        url: queryUrl,
        type: "POST",
        dataType: 'json',
        data: {
			price_data: JSON.stringify(data.price_data),
			dept_data: JSON.stringify(data.dept_data),
			product_descr: data.product_descr,
			total_sum: data.price_data.main.total,
			production_price: data.price_data.main.production,
			assembling_price: data.price_data.main.assembling,
			name: $("#orderName").val(),
			calc_type: $("#calcType").val(),
			manager: $("#managerName").val(),
			user: $("#userName").text(),
			order_id: getOrderId(), //функция в файле dataExchangeXml_3.1.js
			production_data: JSON.stringify(data.production_data),
			materials_data: JSON.stringify(data.materials_data),
			cost_data: JSON.stringify(data.cost_data),
			assembling_data: JSON.stringify(data.assembling_data),
			},

        success: function (data) {
        	alert(data.message);
			/*
			if (data.result === 'ok'){
        		callback(event,data.id);
			}
			*/
        },
        error: function( jqXhr, textStatus, errorThrown ){
            alert('Ошибка на сервере ' + errorThrown );
        }

    });

}//end of addOfferToOrder

/** функция возвращает информацию в базе о кп, если оно уже запущено в работу и false если не запущено

*/
function getThisOfferInfo(callback){
	$.ajax({
        url: "/orders/offer-controller/action-get-data",
        type: "GET",
        dataType: 'json',
        data: {
			name: $("#orderName").val(),
			},

        success: function (data) {
        	if(data) return data;
        },
        error: function( jqXhr, textStatus, errorThrown ){
            alert('Ошибка на сервере ' + errorThrown );
        }

    });
	
	return false;

}//end of getOfferInfo


/** функция выводит на страницу данные по цене, предназначенные для сохранения в базу
*/

function printExportData(data, outputDivId){
	
	var text = 
		"<b>Описание: </b>" + data.product_descr + "<br/>\
		<b>Смета с учетом скидки:</b><br/>\
		<table class='tab_2'><thead><tr>\
			<th>Наименование</th>\
			<th>Изделие</th>\
			<th>Монтаж</th>\
			<th>Всего</th>\
			</tr></thead><tbody>";
			
	var price_data = data.price_data;
	
	for(var unit in price_data){
		if(unit != "main"){
			text += "<tr>\
					<td>" + price_data[unit].name + "</td>\
					<td>" + Math.round(price_data[unit].production) + "</td>\
					<td>" + Math.round(price_data[unit].assembling) + "</td>\
					<td>" + Math.round(price_data[unit].production + price_data[unit].assembling) + "</td>\
				</tr>";
			}
		};
		
	text += 
		"<tr>\
			<td>Доставка: </td>\
			<td>0</td>\
			<td>" + Math.round(price_data.main.delivery) + "</td>\
			<td>" + Math.round(price_data.main.delivery) + "</td>\
		</tr>\
		<tr class='bold'>\
			<td>Итого: </td>\
			<td id='price_data_prodSum'>" + Math.round(price_data.main.production) + "</td>\
			<td>" + Math.round(price_data.main.assembling + price_data.main.delivery) + "</td>\
			<td>" + Math.round(price_data.main.total) + "</td>\
		</tr></tbody></table>";
		
	var dept_data = data.dept_data;
	
	text += "<br/><b>Данные по цехам: </b> </br>" + 
		"Металл: " + Math.round(dept_data.metal) + "<br/>" + 
		"Дерево: " + Math.round(dept_data.timber) + "<br/>" + 
		"Подрядчики: " + Math.round(dept_data.partners) + "<br/>" + 
		"Доставка, монтаж: " + Math.round(dept_data.assembling) + "<br/>" + 
		"<b>Всего: " + Math.round(dept_data.metal + dept_data.timber + dept_data.partners + dept_data.assembling) + "</b><br/><br/>";
	//данные по материалам
	
	var printPar={
		list: data.materials_data,
		noPrint: true,
	}
	text += "<br/><b>Потребность в материалах: </b> </br>" + 
		printMaterialsNeed(printPar).text;
				
	$("#" + outputDivId).html(text);

}

