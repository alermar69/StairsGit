var configurator = {};

$(function(){


//перебор конфигураций
	
	configurator = new Configurator();
	var parParams = {
		id: "handrail",
		//ignorOptions: ["нет"],
		}
	configurator.addParToTest(parParams);

	console.log(configurator.configs);


});
