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
		ignorOptions: ["Прямая двухмаршевая"],
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
		id: "riserType",
		onlyFor: {
			model: "ко",
			},
		}
//	configurator.addParToTest(parParams);
	
	var parParams = {
		id: "stairFrame",
		onlyFor: {
			model: "лт",
			},
		}
	configurator.addParToTest(parParams);
	
	var parParams = {
		id: "platformTop",
		}
//	configurator.addParToTest(parParams);

	var parParams = {
		id: "nose",
		options: [20, 40],
		}
//	configurator.addParToTest(parParams);
	
	var parParams = {
		id: "marshDist",
		options: [70, 120],
		onlyFor: {
			stairModel: "П-образная с забегом",
			},		
		}
	configurator.addParToTest(parParams);

	console.log(configurator.configs);


});
