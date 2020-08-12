var params = {}; //глобальный массив значений инпутов
var staircasePrice = {};
var staircaseCost = {};
var partsAmt = {};
var priceObj = {};
$(function () {
	
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
	changeSlabsForm();	
}

function configDinamicInputs (){
	 configEstimateForms()
}

