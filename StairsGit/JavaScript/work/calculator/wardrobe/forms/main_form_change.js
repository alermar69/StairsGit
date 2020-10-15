//обработчики

$(function () {
//добавление секции
	$("#addSect").click(addSectInputs);
	
	//удаление секции
	$("#sectParamsTable").delegate('.removeRow', 'click' , function(event) {
		$(this).closest("tr").remove();
		reindexSectParamsTable();
		$("#sectAmt_wr").val($("#sectAmt_wr").val()*1.0 - 1);
		countFirstSectionWidth()
	 })
	 
	 //добавление полки
	$("#addBox").click(function(){
		addBoxInputs();
		recalculate();
		});
		
	$("#equalSectWidth").click(function(){
		equalSectWidth();
		recalculate();
		});
	
	
	
	//удаление полки 
	$("#boxParamsTable").delegate('.removeRow', 'click' , function(event) {
		$(this).closest("tr").remove();
		$("#boxAmt_wr").val($("#boxAmt_wr").val()*1.0 - 1);
		//reindexSectParamsTable("boxParamsTable");
	 })
	 
	 
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
		
		})
});

function changeFormWr(){
	$("#mainWrTable").find("tr").show();
	$("#wrImputs").show();
	if(params.marsh_wr == "нет"){
		$("#mainWrTable").find("tr").hide();
		$("#mainWrTable").find("tr").eq(0).show();
		$("#wrImputs").hide();
		}
	$("#kupeDoorAmt_wr").closest("tr").hide();
	if(params.model_wr == "купе") $("#kupeDoorAmt_wr").closest("tr").show();
	
	
	$("#angleTop_wr").closest("tr").show();
	if(params.heightLeft_wr == params.heightRight_wr) $("#angleTop_wr").closest("tr").hide();
	
	$("#boxParamsTable .boxType").each(function(){
		//позиция по X
		$(this).closest("tr").find(".boxPosX").closest("span").hide();
		if($(this).val() == "перегородка") $(this).closest("tr").find(".boxPosX").closest("span").show();
		
		//ширина полки
		$(this).closest("tr").find(".boxWidth").closest("span").show();
		if($(this).val() == "перегородка") $(this).closest("tr").find(".boxWidth").closest("span").hide();
		
		//точная ширина полки
		$(this).closest("tr").find(".boxWidth").hide();
		if($(this).closest("tr").find(".boxWidthType").val() == "задается"){
			$(this).closest("tr").find(".boxWidth").show();
			$(this).closest("tr").find(".boxPosX").closest("span").show();
			}
		
		//размер ящика по Y
		$(this).closest("tr").find(".boxHeight").closest("span").show();
		if($(this).val() == "полка" || $(this).val() == "штанга") 
			$(this).closest("tr").find(".boxHeight").closest("span").hide();
			
		//глубина ящика
		$(this).closest("tr").find(".boxCarcasHeight").closest("span").hide();
		if($(this).val() == "ящик" || $(this).val() == "ящик верхний") 
			$(this).closest("tr").find(".boxCarcasHeight").closest("span").show();
		/*	
		//тип петель
		$(this).closest("tr").find(".hingeType").closest("span").hide();
		if($(this).val() == "шкаф прав." || $(this).val() == "шкаф лев." || $(this).val() == "шкаф две") 
			$(this).closest("tr").find(".hingeType").closest("span").show();
		*/
		
		
			
		//параметры фасада
		$(this).closest("tr").find(".fasadParams").show();
		if($(this).val() == "полка" || $(this).val() == "штанга" || $(this).val() == "перегородка") 
			$(this).closest("tr").find(".fasadParams").hide();
		
		//установка ширины ящика по секции
//		console.log($(this).closest("tr").find(".boxWidthType").val())
		if($(this).closest("tr").find(".boxWidthType").val() == "по секции"){
			var sectId = $(this).closest("tr").find(".boxSect").val() - 1
			var sectWidth = $("#sectWidth" + sectId).val()
			$(this).closest("tr").find(".boxWidth").val(sectWidth)
			}
			
		//запрет увеличения фасада для шкафов со стороны петель
		if($(this).val() == "шкаф прав." || $(this).val() == "шкаф две"){
			$(this).closest("tr").find(".boxDoorPlusRight").val(0)
			}
		if($(this).val() == "шкаф лев." || $(this).val() == "шкаф две"){
			$(this).closest("tr").find(".boxDoorPlusLeft").val(0)
			}
		
		});
		
		countFirstSectionWidth()
		
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
}


function addSectInputs(){
	var rowAmt = $("#sectParamsTable tr").length;
	var row = '<tr class="sectParams">' + 
			'<td class="sectNumber">' + rowAmt + '</td>' + 
				'<td>' +
					'<select class="door" id="door' + (rowAmt-1) + '" size="1">' +
						'<option value="открытая">открытая</option>' +
						'<option value="вправо">дверь правая</option>' +
						'<option value="влево">дверь левая</option>' +
						'<option value="две двери">две двери</option>' +
						'<option value="выдвижная">выдвижной шкаф</option>' +
					'</select>' +
				'<td><input class="sectWidth" id="sectWidth' + (rowAmt-1) + '" type="number" value="400" step="10"></td>' +
				'</td>' +
				'<td><span class="removeRow">Х</span></td>' +
			'</tr>';
		$("#sectParamsTable").append(row);
		$("#sectAmt_wr").val($("#sectAmt_wr").val()*1.0 + 1);
		countFirstSectionWidth()
}

function reindexSectParamsTable(){
	var rowAmt = $("#sectParamsTable tr").length;
	for (var i=1; i<rowAmt; i++){
		$("#sectParamsTable tr").eq(i).find(".sectNumber").text(i);
		$("#sectParamsTable tr").eq(i).find(".door").attr("id", "door" + (i-1));
		$("#sectParamsTable tr").eq(i).find(".sectWidth").attr("id", "sectWidth" + (i-1));		
		}
}

function addBoxInputs(){
	var rowAmt = $("#boxParamsTable tr").length;
	var row = '<tr class="boxParams">' + 	
		'<td><input class="boxSect" id="boxSect' + (rowAmt - 1) + '" type="number" value="1"></td>' +
		'<td>' + 
			'<span>X: <input class="boxPosX" id="boxPosX' + (rowAmt - 1) + '" type="number" value="0"></span>' + 
			'<span>Y: <input class="boxRow" id="boxRow' + (rowAmt - 1) + '" type="number" value="0"></span>' + 			
		'</td>' +
		'<td><span> X: ' + 
			'<select class="boxWidthType" id="boxWidthType' + (rowAmt - 1) + '" size="1">' +
				'<option value="по секции">по секции</option>' +
				'<option value="задается">задается</option>' +
			'</select>' +
			'<input class="boxWidth" id="boxWidth' + (rowAmt - 1) + '" type="number" value="200"></span>' +
			'<span>Y: <input class="boxHeight" id="boxHeight' + (rowAmt - 1) + '" type="number" value="200"></span>' + 
			'<span>Глубина: <input class="boxCarcasHeight" id="boxCarcasHeight' + (rowAmt - 1) + '" type="number" value="120"></span>' +
		'</td>' +
		'<td>' +
			'<select class="boxType" id="boxType' + (rowAmt - 1) + '" size="1">' +
				'<option value="полка">полка</option>' +
				'<option value="шкаф прав.">шкаф правый</option>' +
				'<option value="шкаф лев.">шкаф левый</option>' +
				'<option value="шкаф две">шкаф две двери</option>' +
				'<option value="ящик">ящик средний</option>' +
				'<option value="ящик верхний">ящик до верха</option>' +
				'<option value="перегородка">перегородка</option>' +
				'<option value="штанга">штанга</option>' +
			'</select>' +
			/*
			'<span><br>Петли: ' + 
			'<select class="hingeType" id="boxType' + (rowAmt - 1) + '" size="1">' +
				'<option value="накладные">накладные</option>' +
				'<option value="полунакладные">полунакладные</option>' +
				'<option value="вкладные.">вкладные</option>' +
			'</select></span>' +
			*/
		'</td>' +
		'<td>' +
			
			'Утапл.: <br/>' + 
			'<input class="boxDoorParams" id="boxDoorPlusIn' + (rowAmt - 1) + '" type="number" value="0">' +
			'<span class="fasadParams">' + 
			'Увеличение: <br/>' + 
			'П: <input class="boxDoorPlusRight" id="boxDoorPlusRight' + (rowAmt - 1) + '" type="number" value="0"><br>' +
			'Л: <input class="boxDoorPlusLeft" id="boxDoorPlusLeft' + (rowAmt - 1) + '" type="number" value="0"><br>' +
			'В: <input class="boxDoorPlusTop" id="boxDoorPlusTop' + (rowAmt - 1) + '" type="number" value="0"><br>' +
			'Н: <input class="boxDoorPlusBot" id="boxDoorPlusBot' + (rowAmt - 1) + '" type="number" value="0">' +
			'</span>' + 
		'</td>' +
		'<td><span class="removeRow">Х</span></td>' +
	'</tr>';
	
	$("#boxParamsTable").append(row);
	$("#boxAmt_wr").val($("#boxAmt_wr").val()*1.0 + 1);
}

function configSectInputs(){
	$(".sectParams").remove();
	var sectAmt = $("#sectAmt_wr").val();
	$("#sectAmt_wr").val(0);
	for(var i=1; i<sectAmt; i++){
		addSectInputs();
		}
}

function configBoxInputs(){
	$(".boxParams").remove();
	var boxAmt = $("#boxAmt_wr").val();
	$("#boxAmt_wr").val(0);
	for(var i=0; i<boxAmt; i++){
		addBoxInputs();
		}
}

//расчет ширины первой секции
function countFirstSectionWidth(){

var sectAmt = $("#sectAmt_wr").val();
if(sectAmt < 1) {
	sectAmt = 1;
	$("#sectAmt_wr").val(1);
	}

var totalWidth = 0;

for (var i=1; i<sectAmt; i++){
	totalWidth += $("#sectWidth" + i).val() * 1.0;
	}

var width0 = params.width_wr - totalWidth - (params.sectAmt_wr + 1) * params.carcasThk_wr;
if(width0 < 0) alert("Внимание! Сумма ширин секций больше 100%! Расчет не был произведен.")
else $("#sectWidth0").val(width0);
}

//выравнивание ширины всех секций
function equalSectWidth(){
var sectAmt = $("#sectAmt_wr").val();
var sectWidth = ($("#width_wr").val() - (params.sectAmt_wr + 1) * params.carcasThk_wr) / sectAmt;

for (var i=1; i<sectAmt; i++){
	$("#sectWidth" + i).val(sectWidth);
	}

}//end of equalSectWidth