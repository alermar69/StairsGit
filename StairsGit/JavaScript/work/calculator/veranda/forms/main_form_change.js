$(function(){
	// применение шаблона
	$("#applyRoofTemplate").click(function(){
		var template = $("#roofTemplate").val();
		
		if(template == "прямое крыльцо"){
			
			if(params.carportType == "двухскатный"){
				var width = params.pltLen + params.sideOffset * 2 + partPar.column.profSize.y * 2
				$("#width").val(width)
			}
			
			if(params.carportType == "односкатный") {
				//свес вбок
				width = params.pltLen + params.sideOffset + params.sideOffsetTop + partPar.column.profSize.y * 2				
				$("#width").val(width)
				//свес вперед
			}
			$("#carportPosX").val(0)
			$("#carportPosZ").val(0)
			
		}
		
		if(template == "боковое крыльцо"){
			
			if(params.carportType == "двухскатный"){
				var width = params.pltLen + params.sideOffset * 2 + partPar.column.profSize.y * 2
				$("#width").val(width)
			}
			
			if(params.carportType == "односкатный") {
				//свес вбок
				width = params.pltLen + params.sideOffset + params.sideOffsetTop + partPar.column.profSize.y				
				$("#width").val(width)
				//свес вперед
			}
			
			$("#carportPosX").val(partPar.column.profSize.y)
			$("#carportPosZ").val(-partPar.column.profSize.y / 2 * turnFactor)
		}
		
		recalculate();
	})
})



function changeFormCarcas(){
	changeFormCarport()
	partPar = calcCarportPartPar();
	
	$(".verandaPltPar").show()
	if (params.pltType == 'единая с лестницей') {
		$("#pltHeight").val((params.stairAmt1 + 1) * params.h1);
		//$("#calcType").val('vhod');
		$("#platformTop").val('площадка');
		if (params.pltLen !== params.M) $("#platformTop").val('увеличенная');
		$("#platformLength_3").val(params.pltWidth);
		$("#platformWidth_3").val(params.pltLen);

		$(".verandaPltPar").hide()
		//params.calcType = 'vhod';
		//params.platformTop = 'площадка';
		//if (params.pltLen !== params.M) params.platformTop = 'увеличенная';
		//params.platformLength_3 = params.pltWidth;
		//params.platformWidth_3 = params.pltLen
	}
	

	 
}