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

