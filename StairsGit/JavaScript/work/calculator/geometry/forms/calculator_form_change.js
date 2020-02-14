$(function () {
	//изменение формы модификации геометрии
	var mode = $("#geomModifyMode").change(function(){
		changeGeometryForms()
	});
	
	//подсветка параметров
	$('#angleType').change(function(){
		$(".highlight").removeClass('highlight');
		if ($(this).val() == 'задаются') {
			$('#geometryNotice').show();
			$('#stairAmt1').addClass('highlight');
			$('#stairAmt2').addClass('highlight');
			$('#stairAmt3').addClass('highlight');
			$('#turnType_1').addClass('highlight');
			$('#turnType_2').addClass('highlight');
			$('#h2').addClass('highlight');
			$('#h3').addClass('highlight');
			$('#b1').addClass('highlight');
			$('#b2').addClass('highlight');
			$('#b3').addClass('highlight');
			$('#marshDist').addClass('highlight');
		}
	})
	
	//рассчет геометрии
	$("#calcGeometry").click(function(){
		 calculateGeom();
	})
	
	//модификация геометрии
	$("#modifyGeom").click(function(){
		var mode = $("#geomModifyMode").val();
		var marshId = $("#geomModifyMarshId").val();
		
		//изменение кол-ва ступеней
		if(mode == "addStep") changeStairAmt(marshId, 1)
		if(mode == "removeStep") changeStairAmt(marshId, -1)
		
		//задание длины проекции марша
		if(mode == "setMarshLen"){
			var marshLen = $('#firstMarshLen').val() * 1.0;
			var marshParams = getMarshParams(1);
			var geomParams = calcGeomParams(false);

			var carcasOffset = 0;
			var carcasDelta = 0;
			if (params.model == 'лт') {
				var carcasDelta = (params.M - calcTreadLen()) / 2;
				var carcasOffset = 5; //отступ в начале лестницы
			}
			if (params.model == 'тетивы' || params.model == 'тетива+косоур') {
				carcasDelta = params.stringerThickness - params.stringerSlotsDepth;
			}
			
			marshLen -= carcasOffset;

			if (params.stairModel !== 'Прямая') {
				if (params.stairModel == 'П-образная с площадкой'){
					marshLen -= geomParams.turnLength + geomParams.deltaTop;
				}else{
					marshLen -= params.M + geomParams.deltaTop;
				}
			}else{
				marshLen -= params.nose;
			}

			var b = marshLen / marshParams.stairAmt;
			$('#angleType').val('задаются').change();

			$('#b1').val(b);
			
			calculateGeom();
			recalculate();
		}
		
		//вписание лестницы в проем по ширине для П-образной
		if(mode == "setStaircaseWidth"){
			if (params.stairModel != 'П-образная с площадкой' && params.stairModel != 'П-образная с забегом') {
				alert("Данная опция доступна только для П-образной лестницы")
				return;
			}
			
			var marshDist = $("#floorHoleWidth").val() - $("#wallDist").val() * 2 - $("#M").val() * 2;
			var maxM = ($("#floorHoleWidth").val() - $("#wallDist").val() * 2) / 2;
			if(marshDist < 0) {
				$("#M").val(maxM);
				marshDist = 0;
			}
			$('#marshDist').val(marshDist);
			
			alert("Был установлен расчетный зазор между маршами")
		}
		
		//выравнивание подъема ступени во всех маршах
		if(mode == "setStepHeight"){
			var stepHeight = params.h1;
			var stepAmt = params.stairAmt1;
			if (params.stairModel != "Прямая") stepAmt += params.stairAmt3;
			if (params.stairModel == "Г-образная с площадкой") stepAmt += 1;
			if (params.stairModel == "Г-образная с забегом") stepAmt += 3;
			if (params.stairModel == "П-образная с площадкой") stepAmt += 1;
			if (params.stairModel == "П-образная с забегом") stepAmt += 6;
			if (params.stairModel == "П-образная трехмаршевая") {
				stepAmt += params.stairAmt2;
				if (params.turnType_1 == "забег") stepAmt += 3
				else stepAmt += 1;
				if (params.turnType_2 == "забег") stepAmt += 3
				else stepAmt += 1;				
			}
			if(params.topStairType == "ниже") stepAmt += 1;
			
			var stepHeight = Math.round(params.staircaseHeight / stepAmt * 10) / 10;
			
			$("#h1").val(stepHeight);
			$("#h2").val(stepHeight);
			$("#h3").val(stepHeight);
			
			calculateGeom();
			
			alert("Во всех маршах был установлен подъем ступени h = " + stepHeight)
		}
		
		
	});

});

function changeGeometryForms(){
	var mode = $("#geomModifyMode").val();
	
	$("#firstMarshLen").closest("div").hide();
	if(mode == "setMarshLen") $("#firstMarshLen").closest("div").show();
	
	$("#geomModifyMarshId").closest("div").show();
	if(mode == "setStaircaseWidth" || mode == "setStepHeight") $("#geomModifyMarshId").closest("div").hide();



}

function changeStairAmt(marshId, amount){
	var marshParams = getMarshParams(marshId);
	var newStairAmt = marshParams.stairAmt + amount;
	if (newStairAmt >= 0) {
		$('#stairAmt' + marshId).val(marshParams.stairAmt + amount);
		$('#angleType').val('задаются').change();
		calculateGeom();
	}
}

