$(function () {

//обработчики


$('#wrSect').delegate('input,select,textarea', 'change', recalculate);

//добавление секции
	$("#addSect").click(function(){
		addSectInputs("sectParamsTable");
		});
		
	$("#addSect_r").click(function(){
		addSectInputs("sectParamsTable_r");
		});
		
	
	//удаление секции
	$("#sectParamsTable").delegate('.removeRow', 'click' , function(event) {
		$(this).closest("tr").remove();
		reindexSectParamsTable("sectParamsTable");
		$("#sectAmt").val($("#sectAmt").val()*1.0 - 1);
		countFirstSectionWidth("sectParamsTable");
		recalculate();
		})
		
	$("#sectParamsTable_r").delegate('.removeRow', 'click' , function(event) {
		$(this).closest("tr").remove();
		reindexSectParamsTable("sectParamsTable_r");
		$("#sectAmt_r").val($("#sectAmt_r").val()*1.0 - 1);
		countFirstSectionWidth("sectParamsTable_r");
		recalculate();
		})
	 
	
	//выравнивание ширины секции
	$("#equalSectWidth").click(function(){
		equalSectWidth("sectParamsTable");
		recalculate();
		});
		
	$("#equalSectWidth_r").click(function(){
		equalSectWidth("sectParamsTable_r");
		recalculate();
		});

});



function addSectInputs(tableId){
	var rowAmt = $("#" + tableId + " tr").length;
	var counterId = "sectAmt"
	if(tableId == "sectParamsTable_r") {
		rowAmt += 20;
		counterId = "sectAmt_r"
		}
	var row = '<tr class="sectParams">' + 
			'<td class="sectNumber">' + rowAmt + '</td>' + 
				'<td>' +
					'<select class="door" id="door' + (rowAmt-1) + '" size="1">\
						<option value="открытая">открытая</option>\
						<option value="дверь правая">дверь правая</option>\
						<option value="дверь левая">дверь левая</option>\
						<option value="две двери">две двери</option>\
					</select>' +
				'</td>' +
				'<td><input class="sectWidth" id="sectWidth' + (rowAmt-1) + '" type="number" value="400" step="10"></td>' +
				'<td><span class="removeRow">Х</span></td>' +
			'</tr>';
		$("#" + tableId).append(row);
		$("#" + counterId).val($("#" + counterId).val()*1.0 + 1);
		countFirstSectionWidth(tableId);
}

function reindexSectParamsTable(tableId){
	var rowAmt = $("#" + tableId + "  tr").length;
	var plusIndex = 0;
	if(tableId == "sectParamsTable_r") plusIndex = 20;
	
	for (var i=1; i<rowAmt; i++){
		$("#" + tableId + "  tr").eq(i).find(".sectNumber").text(i + plusIndex);
		$("#" + tableId + "  tr").eq(i).find(".door").attr("id", "door" + (i-1 + plusIndex));
		$("#" + tableId + "  tr").eq(i).find(".sectWidth").attr("id", "sectWidth" + (i-1 + plusIndex));		
		}
}

function configSectInputs(){
	$(".sectParams").remove();
	var sectAmt = $("#sectAmt").val();
	$("#sectAmt").val(0);
	for(var i=0; i<sectAmt; i++){
		addSectInputs("sectParamsTable");
		}
	var sectAmt = $("#sectAmt_r").val();
	$("#sectAmt_r").val(0);
	for(var i=0; i<sectAmt; i++){
		addSectInputs("sectParamsTable_r");
		}
}

//расчет ширины первой секции
function countFirstSectionWidth(tableId){
	
	var counterId = "sectAmt";
	var plusIndex = 0;
	var sideWidth = $("#width_wr").val();
	if(params.geom_wr == "угловой") sideWidth = $("#leftWidth").val();
	if(tableId == "sectParamsTable_r") {
		counterId = "sectAmt_r";
		plusIndex = 20;
		sideWidth = $("#rightWidth").val();
		}


var sectAmt = $("#" + counterId).val() * 1.0;
if(sectAmt < 1) {
	sectAmt = 1;
	$("#" + counterId).val(1);
	}

	
var totalWidth = 0;

for (var i=1 + plusIndex; i<sectAmt + plusIndex; i++){
	totalWidth += $("#sectWidth" + i).val() * 1.0;
	}
var width0 = sideWidth - totalWidth - (sectAmt - 1) * params.carcasThk_wr;
//учитываем наличие боковин
if(params.leftWall_wr == "боковина") width0 -= params.carcasThk_wr;
if(params.rightWall_wr == "боковина") width0 -= params.carcasThk_wr;

if(width0 < 0) alert("Внимание! Сумма ширин секций больше 100%! Расчет не был произведен.")
else $("#sectWidth" + plusIndex).val(width0);

}


//выравнивание ширины всех секций
function equalSectWidth(tableId){
	
	var counterId = "sectAmt";
	var plusIndex = 0;
	var sideWidth = $("#width_wr").val();
	if(params.geom_wr == "угловой") sideWidth = $("#leftWidth").val();
	if(tableId == "sectParamsTable_r") {
		counterId = "sectAmt_r";
		var plusIndex = 20;
		sideWidth = $("#rightWidth").val()
		}
	
	//учитываем наличие боковин
	if(params.leftWall_wr == "боковина") sideWidth -= params.carcasThk_wr;
	if(params.rightWall_wr == "боковина") sideWidth -= params.carcasThk_wr;

	var sectAmt = $("#" + counterId).val() * 1.0;
	var sectWidth = (sideWidth - (sectAmt - 1) * params.carcasThk_wr) / sectAmt;


	for (var i=1 + plusIndex; i<sectAmt + plusIndex; i++){
		$("#sectWidth" + i).val(sectWidth);
		}

}//end of equalSectWidth

function setShelfPosByDist(){
	$(".distTop, .distBot").each(function(){
		if($(this).val() != params[this.id]) {
			var delta = $(this).val() * 1.0 - params[this.id];
			var boxRow = $(this).closest("tr").find(".boxRow").val()*1.0;
			console.log(delta, $(this).attr('data-prev'), $(this).val(), params[this.id])
			if($(this).hasClass("distTop")) boxRow -= delta;
			if($(this).hasClass("distBot")) boxRow += delta;

			$(this).closest("tr").find(".boxRow").val(boxRow);
			recalculate();
		}

	})
}
