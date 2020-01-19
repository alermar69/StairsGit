var configurator = {};

$(function(){


//перебор конфигураций
	
	configurator = new Configurator();
	var parParams = {
		id: "model",
		ignorOptions: ["нет"],
		}
//	configurator.addParToTest(parParams);

	var parParams = {
		id: "turnSide",
		}
	configurator.addParToTest(parParams);
	
	var parParams = {
		id: "stairModel",
		ignorOptions: ["Прямая горка"],
		}
	configurator.addParToTest(parParams);
	

	var parParams = {
		id: "platformTop",
		ignorOptions: ["нет"],
		}
	configurator.addParToTest(parParams);



	console.log(configurator.configs);
	
	$("#configAmt").val(configurator.configs.length)


});
