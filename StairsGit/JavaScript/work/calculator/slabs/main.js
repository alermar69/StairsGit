var params = {}; //глобальный массив значений инпутов
var staircasePrice = {};
var partsAmt = {};
var priceObj = {};
$(function () {
	
	$(".addRow").click(function(){
		var estimateId = $(this).closest('.estimate').attr("id");
		addRow(estimateId);
		recalculate();
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
	
<<<<<<< HEAD
	$("#headerType").change(function(){
		$(".header").hide();
		$(".footerText").hide();
		
		$("." + $(this).val()).show()
	})

=======
>>>>>>> curve
	
	//пересчитываем лестницу
	if (window.loadedData) {
		setLoadedData(window.loadedData, true);
	}else{
		recalculate();
	}
});

function recalculate(){
	getAllInputsValues(params);
	changeAllForms();
	calcPrice();
}

function changeAllForms(){
	$("tr.estimateItem").each(function(){
		$row = $(this)
		configParamsInputs($row)
	})
	
}

function configDinamicInputs (){
	 configEstimateForms()
}