var configurator = {};

$(function(){


//������� ������������
	
	configurator = new Configurator();
	var parParams = {
		id: "handrail",
		//ignorOptions: ["���"],
		}
	configurator.addParToTest(parParams);

	console.log(configurator.configs);


});
