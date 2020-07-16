var curConfigIndex = 0; //текущий индекс - глобальная переменная
var offers = [];
var offerProps = [];

$(function(){
	//устанавливаем префикс, соответствующий типу расчета
	if(params.calcType == "mono") $("#configPrefBd").val("mono-")
	if(params.calcType == "vhod") $("#configPrefBd").val("vl-")
	if(params.calcType == "timber") {
		$("#configPrefBd").val("tim-")
		$("#testingMode").val("дерево1")
		}
	
	
	
	$("#setNextBd").click(function() {
		curConfigIndex = $("#configStartIndexBd").val() * 1.0;
		setNextConfigBd();
		$("#configStartIndexBd").val(curConfigIndex)
	});
	
});

/** тест группы сохраненных конфигураций
*/

function testConfigs_saved(){
	var testingModeInput = $("#testingMode").val(); //сохраняем тип теста
		curConfigIndex = $("#configStartIndexBd").val() * 1.0 - 1;
		setNextConfigBd();
		
		//запуск теста
		
		stopTesting = false;		
		
		function testWorkerBd(left) {
			if(stopTesting) return;
			$("#testingMode").val(testingModeInput); //устанавливаем сохраненный тип теста
			queueConfigurationTest(function () {
				if (left > 1) {
					setNextConfigBd();
					testWorkerBd(left - 1);				
				}
				//отключаем режим тестирования
				else {
					hidenLayers = []; //очищаем массив чтобы можно было посмотреть все слои
					testingMode = false;
					}
			});
		};

		testingMode = true;
		var configAmt = $("#configAmtBd").val() * 1.0;
		var testType = getTestType();
		if(testType == "intercections") testWorkerBd(configAmt);

}


function setNextConfigBd(){

	testingMode = true;
	if(params.calcType == "mono") $("#configPrefBd").val("mono-")
	//сохраняем значения
	var pref = $("#configPrefBd").val()
	var startIndex = $("#configStartIndexBd").val();
	var configAmt = $("#configAmtBd").val();
	var testingMode = $("#testingMode").val();
	
	//первая итерация
	if(curConfigIndex < 0){
		curConfigIndex = 0;
		}
	//последующие итерации
	if(curConfigIndex >= 0){
		curConfigIndex ++;
		var configIndex = curConfigIndex;
		}
	
	if(configIndex < 10) configIndex = "0" + configIndex;
	var configName = $("#configPrefBd").val() + configIndex;
	$("#orderName").val(configName);
	
	var showAlert = false;
	_loadFromBD(configName, showAlert);
	
	//затираем загруженные из базы параметры тестов
	$("#configPrefBd").val(pref);
	$("#configStartIndexBd").val(startIndex);
	$("#configAmtBd").val(configAmt);
	$("#testingMode").val(testingMode);
	
} //end of setNextConfigBd

/** тест группы последних сохраненных конфигураций
*/

function loadLastOffers(callback){

	var filter = {
		offersType: $("#offersType").val(),
		daysAmt: $("#daysAmt").val(),
		calcType: $("#calcType").val(),
		testResult: $("#testResult").val(),
	}
	
	if(filter.calcType == "все") filter.calcType = "";
	
	//очищаем глобальные массивы
	offers = [];
	offerProps = [];
	$.ajax({
		url: '/orders/calc-controller/load-data',
		type: 'GET',
		data: {
			filter: filter,
		},
		dataType: 'json',
		success: function(result){
			console.log(result);
			if(result.status == 'ok'){
				offers = result.data;
				offerProps = result.metadata;
				redrawTable();
				printStat();
				if(callback) callback();
			}
		},
		error: function(result){
			console.log(result)
		},
	});
}

function redrawTable() {
    var tablePar = {
        props: offerProps,
        items: offers,
        //noPrintGroups: ["endDate", "startDate"],
	    noPrintGroups: ['service', 'links'],
        outputDivId: "loadedConfigs",
    }

    printTable(tablePar); //функция в файле /orders/libs/table.js"
	//setLinks();
};

function printStat(){
	var amts = {};
	$.each(offers, function(){
		if(!amts[this.calc_type]) amts[this.calc_type] = 0;
		amts[this.calc_type] += 1;
		});

	
	var text = ""
	for(var type in amts){
		text += type + ": " + amts[type] + "<br/>";
		}
	text += "<b>Всего: " + offers.length + "</b><br/>";
	$("#statDiv").html(text);

}

