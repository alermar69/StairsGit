var configurator = {};

$(function(){


//перебор конфигураций
	
	configurator = new Configurator();
	var parParams = {
		id: "treadsMaterial",
		//ignorOptions: ["нет"],
		}
	configurator.addParToTest(parParams);

	var parParams = {
		id: "platformType",
		ignorOptions: ["нет"],
		}
	configurator.addParToTest(parParams);
	
	var parParams = {
		id: "turnFactor",
		}
	//configurator.addParToTest(parParams);
	
	var parParams = {
		id: "banisterPerStep",
		options: [1, 2, 3],
		}
	configurator.addParToTest(parParams);
	
	console.log(configurator.configs);


});
