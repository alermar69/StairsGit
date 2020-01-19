function changeFormCarcas(){


var staircaseType = params.staircaseType;
var stairModel = params.stairModel;
var angleType = params.angleType;

/*модели, совместимые с типом лестницы*/

	var modelCompatible = [];
	if (staircaseType == "metal") modelCompatible = [1,2];
	if (staircaseType == "mono") modelCompatible = [6,7];
	if (staircaseType == "timber" || params.staircaseType == 'timber_stock') modelCompatible = [3,4,5];	
	showOptions('model', modelCompatible)	
	
//ограничения по параметрам для деревянной лестницы*/
if(params.staircaseType == "timber" || params.staircaseType == 'timber_stock'){
	$(".treadWidth").hide();
	$("#platformTop").val("нет");
	$("#platformTop").closest("tr").hide();
	$("#topStairType").val("вровень");
	$("#topStairType").closest("tr").hide();
	$("#topFlan").val("нет");
	$("#topFlan").closest("tr").hide();
	$("#topAnglePosition").val("вертикальная рамка");
	$("#topAnglePosition").closest("tr").hide();
	$("#model").val("косоуры")
	}


if(params.staircaseType == "mono"){
	$("#nose").val(50);
	$("#riserType").val("нет")
	}
	
if(params.staircaseType == "timber" || params.staircaseType == 'timber_stock'){
	$("#nose").val(20);
	//$("#riserType").val("нет")
	}
	
if(params.staircaseType != "mono" && params.nose == "50") $("#nose").val(20);


if (params.platformTop == "площадка"){
	$("#topStairType").val("вровень")
	}

/*нужное кол-во видов*/

	if (stairModel == "Прямая") $("#leftView").hide();
	else $("#leftView").show();

/*крепление к верхнему перекрытию*/

	$('#platformTop_tr_4').show();
	$('#topAnglePosition option[value="вертикальная рамка"]').show();
	$('#topAnglePosition option[value="рамка верхней ступени"]').show();
	
	$('#topAnglePosition').closest("tr").show();
	if (staircaseType == "timber" || params.staircaseType == 'timber_stock') {
		$("#topFlan").val("нет")
		$('#platformTop_tr_4').hide();		
		$("#topAnglePosition").val("вертикальная рамка");
		$('#topAnglePosition').closest("tr").hide();
		}
	if (staircaseType == "mono") {
		$("#topAnglePosition option[value='вертикальная рамка']").hide();
		$('#topAnglePosition option[value="рамка верхней ступени"]').hide();
		if($('#topAnglePosition').val() == "рамка верхней ступени") $('#topAnglePosition').val("под ступенью");			
		if($('#topAnglePosition').val() == "вертикальная рамка") $('#topAnglePosition').val("над ступенью");
		$("#topFlan").val("нет");
		if (params.topAnglePosition == "над ступенью") $("#topFlan").val("есть");
		$('#platformTop_tr_4').hide();		
		
		}
	

if (params.topAnglePosition == "вертикальная рамка"){
	$("#topStairType").val("ниже");
	$("#topFlan").val("нет");
	}
	
//рамки ступеней
$("#stairFrame").closest("tr").hide();
if(params.staircaseType == "metal") {
	$("#stairFrame").closest("tr").show();
	if(params.model == "ко") $("#stairFrame").val("есть");
	}
	

/*параметры маршей*/

	$('#marsh1_tr').hide();
	$('#marsh2_tr').hide();
	$('#marsh3_tr').hide();
	$('#stairAmt1_tr').hide();
	$('#stairAmt2_tr').hide();
	$('#stairAmt3_tr').hide();	
	$('#h1_tr').hide();
	$('#h2_tr').hide();
	$('#h3_tr').hide();
	$('#b1_tr').hide();
	$('#b2_tr').hide();
	$('#b3_tr').hide();
	$('#a1_tr').hide();
	$('#a2_tr').hide();
	$('#a3_tr').hide();
	$('#marsh13_tr').hide();
	$('#turn_tr_11').hide();
	$('#turn_tr_12').hide();
	$('#middlePlatform_tr_2').hide();
	$('#marshDist_tr').hide();
	$('#turnSide_tr').hide();
	
	
	if (stairModel == "Прямая") {
		////$('#a1_tr').show();
		if (angleType == "задаются") {
			$('#stairAmt1_tr').show();
			$('#b1_tr').show();
			}
	}

/*Г-образная*/
	
	if (stairModel == "Г-образная с площадкой" || stairModel == "Г-образная с забегом"){
		//$('#marsh13_tr').show();
		//$('#a3_tr').show();
		$('#turnSide_tr').show();
		if (angleType == "задаются") {
			$('#marsh13_tr').hide();
			$('#marsh1_tr').show();
			$('#stairAmt1_tr').show();
			$('#b1_tr').show();
			////$('#a1_tr').show();		
			$('#marsh3_tr').show();
			$('#stairAmt3_tr').show();
			$('#h3_tr').show();
			}
	}

	if (stairModel == "П-образная с площадкой" || stairModel == "П-образная с забегом"){
		var marshDist = $("#floorHoleWidth").val() - $("#wallDist").val() * 2 - $("#M").val() * 2;
		var maxM = ($("#floorHoleWidth").val() - $("#wallDist").val() * 2) / 2;
		if(marshDist < 0) {
			$("#M").val(maxM);
			marshDist = 0;
			}
		$('#marshDist').val(marshDist);
		
		if (stairModel == "П-образная с площадкой") $('#middlePlatform_tr_2').show();
		$('#marshDist_tr').show();
		$('#turnSide_tr').show();
		if (angleType == "задаются") {
			$('#marsh13_tr').hide();
			$('#marsh1_tr').show();
			$('#stairAmt1_tr').show();
			$('#b1_tr').show();
			//$('#a1_tr').show();		
			$('#marsh3_tr').show();
			$('#stairAmt3_tr').show();
			$('#h3_tr').show();
			}
	}

	if (stairModel == "П-образная трехмаршевая"){
		//$('#marsh13_tr').show();
		//$('#a3_tr').show();
		$('#marsh2_tr').show();
		$('#stairAmt2_tr').show();
		//$('#a2_tr').show();
		$('#turn_tr_11').show();
		$('#turn_tr_12').show();
		$('#turnSide_tr').show();
		if (angleType == "задаются") {
			$('#marsh13_tr').hide();
			$('#marsh1_tr').show();
			$('#stairAmt1_tr').show();
			$('#b1_tr').show();
			//$('#a1_tr').show();	
			$('#h2_tr').show();
			$('#marsh3_tr').show();
			$('#stairAmt3_tr').show();
			$('#h3_tr').show();
		}
		if(params.stairAmt2 == 0) {
			$('#marshDist_tr').show();
			if(params.marshDist < 100) {
				$('#marshDist').val(100);
				params.marshDist = 100;
			}
		}

	}
	
	//параметры ступеней
	$(".treadParams").hide();
	if(params.model == "лт"){
		$("#stairType").closest("tr").show();
		if($("#stairType").val() == "дпк"){
			$(".dpcParams").show();
			}
		
		}
		
	//задняя тетива верхней площадки
	$("#platformRearStringer").closest("tr").hide();
	if(params.model == "лт" && params.platformTop == "площадка") 
		$("#platformRearStringer").closest("tr").show();
		
	//параметры дпк
	$("#dpcWidth").closest("tr").hide();
	$("#dpcDst").closest("tr").hide();

	if(params.stairType == "дпк" || params.stairType == "лиственница тер."){
		$("#dpcWidth").closest("tr").show();
		$("#dpcDst").closest("tr").show();
		}
		
	//ширина ступеней и площадок из дпк
	if(params.stairType == "дпк" || 
		params.stairType == "лиственница тер." ||
		(params.calcType == "vhod" && params.staircaseType == "Готовая") ){
			//промежуточная площадка
			var pltDepth = calcTreadWidth(params.platformLength_1);
			//учитываем наличие задней тетивы + 5мм зазор
			if(params.model == "лт") pltDepth += 8 + 5;
			$("#platformLength_1").val(pltDepth);
			
			//верхняя площадка
			var pltDepth = calcTreadWidth(params.platformLength_3);
			//учитываем наличие задней тетивы верхней площадки + 5мм зазор
			if(params.model == "лт" && params.platformRearStringer == "есть") pltDepth += 8 + 5;
			$("#platformLength_3").val(pltDepth);
		}
		
	getAllInputsValues(params);
		
}//end of changeFormCarcas	

