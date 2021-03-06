function changeFormVint(){

	getAllInputsValues(params);

	$("#M").closest("tr").hide();
	$("#columnDiam").closest("tr").hide();
	$("#railingModel option").show();
	$("#rackType option[value='нержавейка+дуб']").show();


	if(params.model == "Винтовая"){
		$("#columnDiam").closest("tr").show();
		$("#railingSide").val("внешнее");
		$("#railingModel option[value='Стекло на стойках']").hide();
		$("#railingModel option[value='Самонесущее стекло']").hide();
		$("#rackType option[value='нержавейка+дуб']").hide();
		}
	if(params.model == "Винтовая с тетивой"){
		$("#columnDiam").closest("tr").show();
		if($("#railingSide").val() != "нет") $("#railingSide").val("внешнее");
	}
	if (params.model == "Винтовая" && params.railingModel == "Ригели" && params.stairType != 'рамки') {
		$("#treadThickness").val(60);
	}
	if (params.stairType == "рамки") {
		// $("#treadThickness").val(20);
		$('.frameTreads').show();
	}else{
		$('.frameTreads').hide();
	}
	if (params.model == "Спиральная" || params.model == "Спиральная (косоур)"){
		$("#M").closest("tr").show();
	}
	if (params.model == "Спиральная" || params.model == "Спиральная (косоур)") {
		var rad = $("#staircaseDiam").val() / 2;
		if (rad  - params.M < 0) $("#M").val(rad - 100);
	}

	$("#carcasParams").show();
	$("#treadsParams").show();

	//параметры площадки
	$("#platformAngle").closest("tr").hide();
	if(params.platformType == "triangle") $("#platformAngle").closest("tr").show();

	$("#platformLedgeM").closest("tr").hide();
	if(params.platformType == "square") $("#platformLedgeM").closest("tr").show();

	$("#platformLedge").closest("tr").hide();
	$("#platformSectionLength").closest("tr").hide();
	if(params.platformType != "нет") {
		$("#platformLedge").closest("tr").show();
		$("#platformSectionLength").closest("tr").show();
		}

	//параметры ограждений
	$(".railingParams").show();
	if(params.railingModel_bal == "нет") {
		$("#platformSectionLength").val(0);
		getAllInputsValues(params);
	}
	
	if(params.platformType == "нет"){
		$("#platformSectionLength").val(0);
		$(".topPlt").hide();
	}

	
	$(".balParams").hide();
	$(".rackType").show();

	if($("#railingModel").val() == "Частые стойки" || $("#railingModel").val() == "Дерево с ковкой"){
		$(".balParams").show();
		if (params.rackType == "нержавейка+дуб") $("#rackType").val("черная сталь");
	} 

	if ($("#railingModel").val() == "Дерево с ковкой") {
		$('.kovka_tr').show();
	}else{
		$('.kovka_tr').hide();
	}
	
	if ($("#strightMarshRailing").val() == "Дерево с ковкой") {
		$('.kovka_tr').show();
		$('.stright_kovka_tr').show();
	}else{
		if($("#railingModel").val() != "Дерево с ковкой")$('.kovka_tr').hide();
		$('.stright_kovka_tr').hide();
	}

	$(".rigelParams").hide();	
	if($("#railingModel").val() == "Ригели") $(".rigelParams").show();

	$(".glassParams").hide();	
	if($("#railingModel").val() == "Самонесущее стекло") {
		$(".glassParams").show(); 
		$(".rackType").hide();
		}


	//цвет поручня пвх
	$("#handrailColor").closest('tr').hide();
	// if(params.handrailMaterial == "ПВХ") $("#handrailColor").closest('tr').show();

	//скрываем параметры если нет совсем никаких ограждений
	if(params.railingSide == "нет" && $("#platformSectionLength").val() == 0) $(".railingParams").hide();
	
	//промежуточные крепления
	if(params.holderAmt < 0) {
		alertTrouble("Количество промежуточных креплений не может быть отрицательным!");
		$("#holderAmt").val(0);
		}
		
	if(params.holderAmt > 5) {
		alertTrouble("Количество промежуточных креплений не может быть больле 5!");
		$("#holderAmt").val(5);
		}

	$(".midHolderInputs").hide();
	if(params.holderAmt > 0) $(".midHolderInputs").show();
	$(".midHolder").hide();
	for(var i=0;i<params.holderAmt; i++) $(".midHolder").eq(i).show();
	
	//крышка нижнего фланца
	$("#botFlanCover").closest("tr").show();
	if (params.stairType == "рифленая сталь" || params.stairType == "лотки под плитку"){
		$("#botFlanCover").closest("tr").hide();
		$("#botFlanCover").val("нет");
	}

	if (params.stairType == 'рамки' || params.stairType == "рифленая сталь" || params.stairType == "лотки под плитку") {
		$("#model option[value='Спиральная'").hide();
		$("#model option[value='Спиральная (косоур)'").hide();
	}else{
		$("#model option[value='Спиральная'").show();
		$("#model option[value='Спиральная (косоур)'").show();
	}
	
	//комментарии к цвету
	if($("#comments_01").val() != "") $("#carcasColor").val("см.комментарий")
	if($("#comments_02").val() != "") $("#timberColorNumber").val("см.комментарий")
	
	$("#comments_01").closest("tr").hide();
	if($("#carcasColor").val() == "см.комментарий") $("#comments_01").closest("tr").show();
	
	$("#comments_02").closest("tr").hide();
	if($("#timberColorNumber").val() == "см.комментарий") $("#comments_02").closest("tr").show();
	
	if(params.regShimAmt > params.stepAmt - 1){
		$("#regShimAmt").val(params.stepAmt - 1);
		params.regShimAmt = params.stepAmt - 1
	}

	$("#a1").val(params.b1 + params.nose);
	$("#a3").val(params.b3 + params.nose);
}

function setTreadThk(){

	//устанавливается толщина ступени по умолчанию в соответствии с выбранным типом ступени
	var stairType = $("#stairType").val();
	$("#treadThickness").val(40);
	/*ступени*/
	if (stairType == "рифленая сталь") $("#treadThickness").val(6);
	if (stairType == "лотки под плитку") $("#treadThickness").val(6);
		
}

