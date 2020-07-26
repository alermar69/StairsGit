function changeFormCarcas(){
	
	//устанавливаем расчетные сечения профилей
	if(params.profTypes == "расчетные") setCarportProfs();
	getAllInputsValues(params)

	
	$(".truss").show()
	$(".dome").hide()
	if(params.carportType == "купол" || params.carportType == "многогранник"){
		$(".truss").hide()
		$(".dome").show()
	}
	
	//количество граней для многогранной геометрии
	$("#edgeAmt").closest("tr").hide();
	if(params.carportType == "многогранник") {
		$("#columnProf").closest("tr").show();
		
	}
	
	//угол наклона кровли
	if(params.roofType == "Арочная" && 
		params.beamModel == "сужающаяся" && 
		params.carportType.indexOf("консольный") == -1 &&
		params.roofAng < 20) $("#roofAng").val(20)
	
	
	//параметры кровли
	$(".roofPar").show();	
	if(params.roofMat == "нет") $(".roofPar").hide();
	
	$(".polyPar").show()
	if(params.roofMat.indexOf("поликарбонат") == -1) $(".polyPar").hide()
		
	$(".profSheetPar").hide()
	if(params.roofMat == "профнастил" || params.roofMat == "металлочерепица") $(".profSheetPar").show()
	
	if(params.carportType.indexOf("консольный") != -1){
		$("#columnProf").val("100х200")
		$("#roofType").val("Арочная")
	}
	
	if(params.carportType == "сдвижной") $("#beamModel").val("проф. труба");
	
	if(params.carportType == "четырехскатный") {
		$("#roofType").val("Плоская")
		$("#beamModel").val("проф. труба");
	}
	
	if(params.carportType == "многогранник") {
		$("#roofType").val("Плоская")
		$("#beamModel").val("проф. труба");
	}
	
	//параметры стенок
	$(".wallPar").hide();	
	if(params.wallMat != "нет") $(".wallPar").show();
	
	//профили навеса
	$("#trussThk").closest("tr").show()
	$("#beamProf").closest("tr").hide()
	$("#beamProf2").closest("tr").hide()

	if($("#beamModel").val() == "проф. труба"){
		$("#trussThk").closest("tr").hide()
		$("#beamProf").closest("tr").show()
		$("#beamProf2").closest("tr").show()
	}
	
	//текстура пола первого этажа
	if(!params.floorMat) $("#floorMat").val("road_brick3")
	
	$('#toggleDomeDoor').hide();
	if(params.carportType == 'купол' || params.carportType == 'сдвижной') {
		$('#toggleDomeDoor').show();
	}
	
	getAllInputsValues(params)
	 
}