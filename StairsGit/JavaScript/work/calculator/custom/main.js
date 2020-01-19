var params = {}; //глобальный массив значений инпутов
var staircasePrice = {};
var partsAmt = {};
var priceObj = {};
$(function () {
	
	$("#addRow").click(function(){
		addRow();
		recalculate();
	});
	
	$("#mainForm").delegate(".removeRow", "click", function(){
		$(this).closest('tr').remove();
		$("#rowAmt").val($("#rowAmt").val()*1 - 1);
		recalculate();
	})
	$("#mainForm").delegate("input,select,textarea", "change", function(){
		recalculate();
	})
	
	recalculate();
});

function recalculate(){
	getAllInputsValues(params);
	changeAllForms();
	calcPrice();
}

function changeAllForms(){
	
}

function configDinamicInputs (){
	 configMainForm()
}