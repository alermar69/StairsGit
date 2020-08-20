function setStockParams(){
	var constPar = {
		model: "косоуры",
		platformTop: "нет",
		nose: 20,
	//	rackSize: 80,
	//	timberPaint: "нет",
		// railingModel: "Деревянные балясины",
		handrail: "массив",
		handrailProf: "40х70 гор.",
		handrailSlots: "да",
		sideHandrailHolders: "нержавеющие",
		handrailConnectionType_len: "с рустом",
		// timberBalStep: 1,
		timberNewellType: "квадратные",
		timberBalTopEnd: "квадрат",
		timberBalBotEnd: "квадрат",
		//newellTopType: "плоское",
		//timberBalModel: "10",
		//timberRackModel: "01",
		//балюстрада
		// railingModel_bal: "Деревянные балясины",
		handrail_bal: "массив",
		//handrailProf_bal: "40х70 гор.",
		//handrailSlots_bal: "да",
		sideHandrailHolders_bal: "нержавеющие",
		handrailConnectionType_len_bal: "с рустом",
		// timberBalStep_bal: 1,
		//timberNewellType_bal: "квадратные",
		timberBalTopEnd_bal: "квадрат",
		timberBalBotEnd_bal: "квадрат",
		//newellTopType_bal: "плоское",
		//timberBalModel_bal: "10",
		//timberRackModel_bal: "01",
		//rackBottom_bal: "сверху с крышкой",
		//rackLenType_bal: "стандартные",
	}
	for(var param in constPar){
		$("#" + param).val(constPar[param]);
		$("#" + param).closest("tr").hide();
	}
	
	//задаем свес ступени
	var nose = 20;
	$("#a1").val(params.b1 + nose);
	$("#a2").val(params.b2 + nose);
	$("#a3").val(params.b3 + nose);
/*	
	//задаем размер столбов
	if(params.rackSize > 85) {
		$("#rackSize").val(80);
	}
*/	
/*
	//балясины
	var availableBals = [10, 14];
	//лестница
	var balId = Number($("#timberBalModel").val());
	if(availableBals.indexOf(balId) == -1) $("#timberBalModel").val(availableBals[0])
	//балюстрада
	var balId = Number($("#timberBalModel_bal").val());
	if(availableBals.indexOf(balId) == -1) $("#timberBalModel_bal").val(availableBals[0])
*/
	$("#columnPos_tr").hide();
	// $("#startTreads").hide();
	//$("#complect_inputs").hide();
	//$("#colors_inputs").hide();
	// $("#fixing_inputs").hide();
	$("#manufacturing_inputs").hide();
	$("#wr_inputsWrap").hide();
	
	//настройки для производственного модуля
	var url = document.location.href;
	if(url.indexOf("manufacturing") != -1){
		$("#manufacturing_inputs").show();
		$("#stringerSlotsDepth").closest("tr").hide();
		$("#rackSize").closest("tr").show();
		}
}