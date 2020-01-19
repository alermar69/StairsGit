$(function(){

	//проверить текущую
	$("#test_this").click(function() {
		testingMode = true;
		var testType = getTestType();
		if(testType == "spec_vhod") testingMode = false;

		if(testType == "intercections") queueConfigurationTest(function(){
			//отключаем режим тестирования
			hidenLayers = []; //очищаем массив чтобы можно было посмотреть все слои
			testingMode = false;					
			});
		if(testType == "compare") compareLayers(function(){});
		if(testType == "sizes") compareSizes(function(){});
		if(testType == "spec") checkSpec(function(){});
		if(testType == "spec_vhod") checkSpec_vhod(function(){});
		

	});
	
	//загрузка синтетической конфигурации при клике по номеру конфигурации в отчете о тестировании
	$("#testResults").delegate('.configId', 'click', function(){
		var configId = $(this).text();
		setConfig(configId);
		}
	);
	
	//применить конфигурацию
	$("#setConfig").click(function() {
		var configId =  $("#configId").val();
		setConfig(configId)
	});
	
	//следующая конфигурация
	$("#nextConfig").click(function(){
		setNextConfig();
	});
	
	//предыдущая конфигурация
	$("#prevConfig").click(function(){
		setPrevConfig();	
	});
	
	//Загрузка данных кп для режима последние
	$("#loadLastOffers").click(function(){
		loadLastOffers(function(){
			//записываем конфигурации
			configurator.resetCounter();
			configurator.configs = [];
			$.each(offers, function(){
				var config = JSON.parse(this.order_data);
				configurator.configs.push(config);					
			});
			console.log(configurator.configs)
			$("#configAmt").val(configurator.configs.length);
			});
		
	});
	
	//тест группы конфигураций	
	$("#test_set").click(function() {
		
		var generatorMode = $("#configGeneratorMode").val();
		if(generatorMode == "синтетические"){
			testConfigs_synth();
			}
		if(generatorMode == "сохраненные"){
			testConfigs_saved();
			}
		if(generatorMode == "последние"){
			
			loadLastOffers(function(){
				//записываем конфигурации
				configurator.configs = [];
				$.each(offers, function(){
					var config = JSON.parse(this.order_data);
					removeTestingParams(config); //удалем параметры инпутов тестирования
					configurator.configs.push(config);					
					});
				testConfigs_synth();
				});
			}
	});
	
	//стоп
	$("#stopTesting").click(function() {
		stopTesting = true; //глобальная переменная
		console.log(stopTesting)
		});
		
	//тип теста	
	$("#testingMode").change(function(){
		checkTestingMode();
		})
	checkTestingMode();
});

function checkTestingMode(){
	var calcType = $("#calcType").val();
	
	if(calcType == "timber"){
		$("#testingMode option[value='без болтов']").hide();
		$("#testingMode option[value='болты Ф12']").hide();
		
		if($("#testingMode").val() != "дерево1" && 
		$("#testingMode").val() != "дерево2" &&
		$("#testingMode").val() != "критические ошибки" &&
		$("#testingMode").val() != "спецификация"){
			$("#testingMode").val("дерево1");
			}
		}
		
	if(calcType != "timber"){
		$("#testingMode option[value='дерево1']").hide();
		$("#testingMode option[value='дерево2']").hide();
	}
	
	if(calcType != "geometry"){
		$("#testingMode option[value='размеры']").hide();
	}
	
	if(calcType == "geometry"){
		$("#testingMode").val("размеры");
	}

}

function removeTestingParams(config){
	$("#testingInputs").find("input,select,textarea").each(function(){
		delete config[this.id];
		})
}


