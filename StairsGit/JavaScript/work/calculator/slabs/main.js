var params = {}; //глобальный массив значений инпутов
var staircasePrice = {};
var staircaseCost = {};
var partsAmt = {};
var priceObj = {};
$(function () {
	
	$(".addRow").click(function(){
		var estimateId = $(this).closest('.estimate').attr("id");
		addRow(estimateId);
		reindexTable()
		recalculate();
		if($("#cost").is(":visible")) $(".cost").show();
	});
	
	$(".estimateForm").delegate(".removeRow", "click", function(){
		reindexTable();
		recalculate();
	})

	$(".estimate").delegate("input,select,textarea", "change", function(){

		var $row = $(this).closest("tr")
		configParamsInputs($row)
		//меняем название при смене типа
		if($(this).hasClass("unitType")){
			if($(this).val() != "другое") $row.find(".name").val($(this).val())
			else $row.find(".name").val("")
		} 
		
		
		recalculate();
	})

	$("#headerType").change(function(){
		$(".header").hide();
		$(".footerText").hide();
		
		$("." + $(this).val()).show()
	})

	$(".setWorksPrice").click(function(){
		setWorksPrice();
	})
	
	//пересчитываем лестницу
	if (window.loadedData) {
		setLoadedData(window.loadedData, true);
	}else{
		recalculate();
	}
});

function recalculate(){	
	changeAllForms();
	calcPrice();
}

function changeAllForms(){
	getAllInputsValues(params);
	changeFormAssembling()
	$("tr.estimateItem").each(function(){
		$row = $(this)
		configParamsInputs($row)
	})
	
	//скрываем таблицу работ если нет ни доставки ни сборки
	$("#estimate_works").show();
	if(params.delivery == "нет" && params.isAssembling == "нет") $("#estimate_works").hide();
	
}

function configDinamicInputs (){
	 configEstimateForms()
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
		var delivery = calculateAssemblingPrice2().delivery;
		
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
		
		var assm = calculateAssemblingPrice2(Math.round(totalPrice)).assembling;
		
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