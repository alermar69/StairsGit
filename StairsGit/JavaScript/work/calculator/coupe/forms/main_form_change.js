$(function () {

//обработчики	
	//открывание/закрываение дверок
	 $("#openDoors").click(function(){
		if(isDoorsOpened) {
			isDoorsOpened = false;
			$("#openDoors").text("Открыть дверки");
			} 
		else {
			isDoorsOpened = true;
			$("#openDoors").text("Закрыть дверки");
			}
		recalculate();		
		});
	
	//блокирование дверей-купе
	$("#fixDoors").click(function(){
		if(isDoorsFixed) {
			isDoorsFixed = false;
			$("#fixDoors").text("Заблокировать двери");
		} else {
			isDoorsFixed = true;
			$("#fixDoors").text("Разблокировать двери");
		}
	});
});

function changeFormWr(){
		
		countFirstSectionWidth("sectParamsTable");
		countFirstSectionWidth("sectParamsTable_r");
		
		//варианты отделки
		
		$("#carcasPaint_wr").closest("tr").hide();
		if(params.carcasMat_wr != "лдсп") $("#carcasPaint_wr").closest("tr").show();
		
		$("#doorsPaint_wr").closest("tr").hide();
		if(params.doorsMat_wr != "лдсп") $("#doorsPaint_wr").closest("tr").show();
		
		$("#doorsPaint_wr option[value='лак']").show();
		$("#doorsPaint_wr option[value='морилка+лак']").show();
		if(params.doorsMat_wr == "мдф"){
			$("#doorsPaint_wr option[value='лак']").hide();
			$("#doorsPaint_wr option[value='морилка+лак']").hide();
			}
			
	if (params.sideWall_wr == 'проф. труба' || params.sideWall_wr == 'кресты металл' || params.sideWall_wr == 'кресты дерево') {
		$('.sideWall').show();
	}else{
		$('.sideWall').hide();
	}
		
	if ($("#sideWall_wr").val().indexOf('бруски') != -1) {
		$('.wallProf').show();
	}else{
		$('.wallProf').hide();
	}
	
	$(".leftSect").show();
	if($("#leftSectWidth").val() == 0) $("#leftSectWidth").val(400);
	if(params.leftSect == "нет"){
		$(".leftSect").hide();
		$("#leftSectWidth").val(0)
		}
	
	$(".rightSect").show();
	if($("#rightSectWidth").val() == 0) $("#rightSectWidth").val(400);
	if(params.rightSect == "нет"){
		$(".rightSect").hide();	
		$("#rightSectWidth").val(0)
		}
		
	//параметры углового шкафа
	$(".corner").hide();
	$(".stright").show();
	$("#rightSideSectDiv").hide();
	
	
	if(params.geom_wr == "угловой"){
		$(".corner").show();
		$(".stright").hide();
		$("#rightSideSectDiv").show();
	
		$("#diagDoorRad").closest("tr").show();
		if(params.diagDoorType == "прямая"){
			$("#diagDoorRad").closest("tr").hide();
			}
			
		} 
		
	//шаблон расположения
	$(".typeConfig").hide();
	if(params.type_wr == "Отдельно стоящий"){
		$("#leftWall_wr").val("боковина");
		$("#rightWall_wr").val("боковина");
		$("#topWall_wr").val("накладная");
		$("#botWall_wr").val("цоколь");
		$("#rearWall_wr").val("накладная");
		}
	if(params.type_wr == "Встроенный"){
		$("#leftWall_wr").val("нет");
		$("#rightWall_wr").val("нет");
		$("#topWall_wr").val("нет");
		$("#botWall_wr").val("нет");
		$("#rearWall_wr").val("нет");
		}
	if(params.type_wr == "Раздвижная система"){
		$("#leftWall_wr").val("фальшпанель");
		$("#rightWall_wr").val("фальшпанель");
		$("#topWall_wr").val("нет");
		$("#botWall_wr").val("нет");
		$("#rearWall_wr").val("нет");
		}
	if(params.type_wr == "Тонкая настройка"){
		$(".typeConfig").show();
		}

//параметры дверей-купе
$(".doorParamsDiv").hide();
$(".doorParamsDiv").eq(0).show();
if(params.isDoorsEqual == "нет"){
	$(".doorParamsDiv").slice(0, params.kupeDoorAmt_wr).show();
	
	}
		
for(var i=0; i<5; i++)	setTopInpostHeight(i)
	

if(params.boxType == "деревянные") {
	if($("#boxBotThk").val() > 6) $("#boxBotThk").val(6);
	if(params.boxSideGap == 15.5) $("#boxSideGap").val(12.7)
	}
if(params.boxType == "метабоксы") {
	$("#boxBotThk").val(params.carcasThk_wr);
	//зазор для боковины по умолчанию
	if(params.boxSideGap == 12.7) $("#boxSideGap").val(15.5)
	}

//доводчики дверей-купе
if(params.doorProfMat_wr == "эконом"){
	$("#closer").val("нет");
	}

//задняя стенка
$(".rearWall").show();
if(params.rearWall_wr == "нет") $(".rearWall").hide();

if(params.rearWallMat_wr == "лдсп") {
	if(params.rearWallThk_wr != 16 && 
		params.rearWallThk_wr != 10 &&
		params.rearWallThk_wr != 8)  $("#rearWallThk_wr").val(16)

	}
	
}

function setWallsTemplate(){
	var template = params.wallsTemplate_wr;
	
	if(template != "нет"){
	//устанавливаем высоту	
	$("#wallHeight_1").val(3000);
	$("#wallHeight_2").val(3000);
	$("#wallHeight_3").val(3000);
	$("#wallHeight_4").val(3000);
	
	//устанавливаем толщину
	$("#wallThickness_1").val(150);
	$("#wallThickness_2").val(150);
	$("#wallThickness_3").val(150);
	$("#wallThickness_4").val(150);
	
	$("#wallPositionZ_1").val(0);
	$("#wallPositionZ_2").val(5000);
	$("#wallPositionZ_3").val(0);
	$("#wallPositionZ_4").val(0);
	}
	
	if(template == "стена"){
		//позиция
		$("#wallPositionX_1").val(-2150);
		$("#wallPositionX_2").val(-2000);
		$("#wallPositionX_3").val(params.width_wr + 2000);
		$("#wallPositionX_4").val(-2000);
		
		//размеры
		$("#wallLength_1").val(params.width_wr + 4300);
		}
	if(template == "левый угол"){
		//позиция
		$("#wallPositionX_1").val(-150);
		$("#wallPositionX_2").val(-150);
		$("#wallPositionX_3").val(params.width_wr + 2000);
		$("#wallPositionX_4").val(0);
		//размеры
		$("#wallLength_1").val(params.width_wr + 2300);
		}
	if(template == "правый угол"){
		//позиция
		$("#wallPositionX_1").val(-2150);
		$("#wallPositionX_2").val(-2150);
		$("#wallPositionX_3").val(params.width_wr);
		$("#wallPositionX_4").val(-2000);
		//размеры
		$("#wallLength_1").val(params.width_wr + 2300);
		}
	if(template == "прямая ниша"){
		//позиция
		$("#wallPositionX_1").val(-2150);
		$("#wallPositionX_2").val(-2000);
		$("#wallPositionX_3").val(params.width_wr + 2000);
		$("#wallPositionX_4").val(-2000);
		$("#wallPositionZ_1").val(params.depth_wr);
		//$("#wallPositionZ_2").val(params.depth_wr);
		$("#wallPositionZ_3").val(params.depth_wr);
		$("#wallPositionZ_4").val(params.depth_wr);
		$("#wallThickness_1").val(params.depth_wr + 50);
		//размеры
		$("#wallLength_1").val(params.width_wr + 4300);
		
		//добавляем выступ
		if(params.wallLedgeAmt == 0) appendLedges(1);
		$("#wallLedgeType0").val("проем");
		$("#wallLedgeBaseWall0").val(1);
		$("#wallLedgeWidth0").val(params.width_wr);
		$("#wallLedgeHeight0").val(params.height_wr);
		$("#wallLedgeDepth0").val(params.depth_wr);
		$("#wallLedgePosX0").val(2150);
		$("#wallLedgePosY0").val(0);
		
		
		}
	if(template == "левая ниша"){
		//позиция
		$("#wallPositionX_1").val(-2150);
		$("#wallPositionX_2").val(0);
		$("#wallPositionX_3").val(params.width_wr + 2000);
		$("#wallPositionX_4").val(-2000);
		$("#wallPositionZ_1").val(params.depth_wr);
		$("#wallPositionZ_2").val(-150);
		$("#wallPositionZ_4").val(0);
		
		//размеры
		$("#wallLength_1").val(2150);
		$("#wallThickness_1").val(750);		
		$("#wallLength_2").val(params.width_wr + 2150);
		$("#wallHeight_2").val(3000);
		}
	if(template == "правая ниша"){
		//позиция
		$("#wallPositionX_1").val(-2150);
		$("#wallPositionX_2").val(params.width_wr);
		$("#wallPositionX_3").val(params.width_wr + 2000);
		$("#wallPositionX_4").val(-2000);
		$("#wallPositionZ_1").val(0);
		$("#wallPositionZ_2").val(-150);
		$("#wallPositionZ_4").val(0);
		
		//размеры
		$("#wallLength_1").val(2150 + params.width_wr);
		$("#wallThickness_1").val(150);
		$("#wallThickness_2").val(750);		
		$("#wallLength_2").val(2150);
		$("#wallHeight_2").val(3000);
		}
	if(template == "по ширине"){
		//позиция
		$("#wallPositionX_1").val(-150);
		$("#wallPositionX_2").val(-150);
		$("#wallPositionX_3").val(params.width_wr);
		$("#wallPositionX_4").val(0);
		
		//размеры
		$("#wallLength_1").val(params.width_wr + 300);
		}
	


}//end of setWallsTemplate
