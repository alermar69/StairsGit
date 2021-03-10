
function changeFormCarport(){
	
	//устанавливаем расчетные сечения профилей
	if(params.profTypes == "расчетные") setCarportProfs();
	getAllInputsValues(params)

	
	$(".truss").show()
	$(".dome").hide()
	if(params.carportType == "купол" || params.carportType == "многогранник"){
		$(".truss").hide()
		$(".dome").show()
	}

	$(".gazeboPar").hide()
	if(params.carportType == "многогранник"){
		$(".gazeboPar").show()
	}
	
	$("#roofType").closest("tr").show()	
	if(params.carportType == 'купол' || params.carportType == 'сдвижной') {
		$("#roofType").closest("tr").hide()
	}
	
	//угол наклона кровли
	if(params.roofType == "Арочная" && 
		params.beamModel == "сужающаяся" && 
		params.carportType.indexOf("консольный") == -1 &&
		params.roofAng < 20) $("#roofAng").val(20)
	
	if(params.roofMat == "металлочерепица" && params.roofAng < 20) params.roofAng < 12
	
	//параметры кровли
	$(".roofPar").show();	
	if(params.roofMat == "нет") $(".roofPar").hide();
	
	$(".polyPar").show()
	if(params.roofMat.indexOf("поликарбонат") == -1) $(".polyPar").hide()
		
	$(".profSheetPar").hide()
	if(params.roofMat == "профнастил" || params.roofMat == "металлочерепица") $(".profSheetPar").show()
	
	//ограничения по толщине поликарбоната
	if(params.roofMat == "монолитный поликарбонат" && params.roofThk > 4) {
		alertTrouble("Монолитный поликарбонат должен быть 4мм. Измените тип поликарбоната или толщину.")
	}
	
	//ограничения по толщине монолитного поликарбоната
	if(params.roofMat == "сотовый поликарбонат" && params.roofThk != 8 && params.carportType != "купол") {
		alertTrouble("Сотовый поликарбонат должен быть 8мм. Измените тип поликарбоната или толщину.")
	}
	
	if(params.carportType.indexOf("консольный") != -1){
		$("#columnProf").val("100х200")
		$("#roofType").val("Арочная")
		$("#fixType").val("фланцы")
	}
	
	if(params.carportType == "сдвижной" || params.carportType == "купол") {
		$("#beamModel").val("проф. труба");
		$("#roofType").val("Арочная")
	}
	
	if(params.carportType == "четырехскатный") {
		$("#roofType").val("Плоская")
		$("#beamModel").val("проф. труба");
	}
	
	if(params.carportType == "многогранник") {
		$("#roofType").val("Плоская")
		$("#beamModel").val("проф. труба");
	}
	
	//свес сверху для односкатного навеса
	$("#sideOffsetTop").closest("tr").hide()
	if(params.carportType == "односкатный") $("#sideOffsetTop").closest("tr").show()
	
	
	//количество граней для многогранной геометрии
	$("#edgeAmt").closest("tr").hide();
	if(params.carportType == "многогранник") {
		$("#edgeAmt").closest("tr").show();
	}
	
	//поворотный сектор
	$("#doorAng").closest("tr").hide();
	if(params.carportType == "купол") {
		$("#doorAng").closest("tr").show();
	}
	
	
	//параметры стенок
	$(".wallPar").hide();	
	if(params.wallMat != "нет") $(".wallPar").show();
	
	
	//скрываем тип несущей конструкции
	var types = ["двухскатный", "односкатный",]
	$("#trussType").closest("tr").hide()
	if(types.indexOf(params.carportType) != -1) $("#trussType").closest("tr").show()
	
	if(params.beamModel == "проф. труба"){
		$("#trussType").val("балки");
		$("#trussHolesType").closest("tr").hide()
		$("#trussType").closest("tr").hide()
		
	}
	
	//подкосы
	$("#consoleHolder").closest("tr").hide()
	if(params.trussType == "балки"){
		$("#consoleHolder").closest("tr").show()
	}
	
	
	//профили навеса
	$("#trussThk").closest("tr").show()
	$("#beamProf").closest("tr").hide()
	$("#beamProf2").closest("tr").hide()
	$("#webProf").closest("tr").hide()

	
//	$("#chordProf").closest("tr").hide()

	if($("#beamModel").val() == "проф. труба"){
		$("#trussThk").closest("tr").hide()
		$("#beamProf").closest("tr").show()
		$("#beamProf2").closest("tr").show()
	}
	
	if($("#beamModel").val() == "ферма постоянной ширины"){
		$("#chordProf").closest("tr").show()
		$("#webProf").closest("tr").show()
		$("#trussThk").closest("tr").hide()
	}
	
	if(params.carportType == "многогранник") {
		$("#columnProf").closest("tr").show();
	}
	
	
	//текстура пола первого этажа
	if(!params.floorMat) $("#floorMat").val("road_brick3")
	
	$('#toggleDomeDoor').hide();	
	$("#roofType").closest("tr").hide()	
	if(params.carportType == 'купол' || params.carportType == 'сдвижной') {
		$('#toggleDomeDoor').show();
	}

	if (params.floorType == "нет") $("#heightFloor").val(0)
	
	getAllInputsValues(params)
	 
}