$(function(){


//перебор конфигураций
	
	configurator = new Configurator();
	/*
	var parParams = {
		id: "model",
		}
	configurator.addParToTest(parParams);

	configurator.addParToTest({id: "turnSide"});
	*/
	var parParams = {
		id: "stairModel",
		ignorOptions: ["Прямая", "П-образная трехмаршевая"],
		}
	configurator.addParToTest(parParams);
	
	var parParams = {
		id: "turnType_1",
		onlyFor: {
			stairModel: "П-образная трехмаршевая",
			},
		}
	configurator.addParToTest(parParams);
	
	var parParams = {
		id: "turnType_2",
		onlyFor: {
			stairModel: "П-образная трехмаршевая",
			},
		}
	configurator.addParToTest(parParams);
	
	var parParams = {
		id: "carcasConfig",
		onlyFor: {
			stairModel: "Г-образная с площадкой",
			},
		ignorOptions: ["003", "004"],
		}
	//configurator.addParToTest(parParams);
	
	var parParams = {
		id: "carcasConfig",
		onlyFor: {
			stairModel: "Г-образная с забегом",
			},
		ignorOptions: ["003", "004"],
		}
	//configurator.addParToTest(parParams);
	
	var parParams = {
		id: "carcasConfig",
		onlyFor: {
			stairModel: "П-образная с площадкой",
			},
		}
	//configurator.addParToTest(parParams);
	
	var parParams = {
		id: "carcasConfig",
		onlyFor: {
			stairModel: "П-образная с забегом",
			},
		}
	//configurator.addParToTest(parParams);
	
	var parParams = {
		id: "carcasConfig",
		onlyFor: {
			stairModel: "П-образная трехмаршевая",
			},
		}
	//configurator.addParToTest(parParams);
	
	//ограждения
	
	var parParams = {
		id: "railingSide_1",
		ignorOptions: ["внешнее", "две"],
		}
	configurator.addParToTest(parParams);
	
	var parParams = {
		id: "railingSide_2",
		onlyFor: {
			stairModel: "П-образная трехмаршевая",
			},
		ignorOptions: ["внешнее", "две"],
		}
	configurator.addParToTest(parParams);
	
	var parParams = {
		id: "railingSide_3",
		ignorOptions: ["внешнее", "две"],
		}
	configurator.addParToTest(parParams);

	console.log(configurator.configs);
	
	//загрузка конфигурации по параметру в url
	var configId = $.urlParam('configId');
	if(configId){		
		$('#configId').val(configId);
		setConfig(configId)
		}


});
