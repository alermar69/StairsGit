//обработчики

$(function () {
	//добавление секции
	$("#addRutelRow").click(function(){
		addRutelMooveInputs();
		$("#rutelMooveAmt").val($("#rutelMooveAmt").val()*1.0 + 1);
		recalculate();
		});
	
	//удаление секции
	$("#rutelMooveTable").delegate('.removeRow', 'click' , function(event) {
		$(this).closest("tr").remove();
		reindexRutelMooveTable();
		$("#rutelMooveAmt").val($("#rutelMooveAmt").val()*1.0 - 1);
		recalculate();
	 })
	 
	 //указание базовой точки на модели
	 $("#rutelMooveTable").delegate('.setBasePoint', 'click' , function(event) {
		var point = lastSelectedPoint; //глобавльная переменная из файла viewports
		$(this).closest("tr").find("input.posX").eq(0).val(point.x)
		$(this).closest("tr").find("input.posY").eq(0).val(point.y)
		$(this).closest("tr").find("input.posZ").eq(0).val(point.z)
		
		recalculate();
	 })
	 
});

//функция для конфигурирования динамической формы для загрузки данных из базы
function addRutelRows(){
var rowAmt = $("#rutelMooveAmt").val();
for(var i=0; i<rowAmt; i++){
	addRutelMooveInputs();
	//console.log(i)
	}	
}

//показ/скрытие параметров секции
function changeFormRutel(){

$("#rutelMooveTable tr").each(function(){
	$(this).find(".marshParams").hide();
	$(this).find(".turnParams").hide();
	$(this).find(".bridgeParams").hide();
	var type = $(this).find(".sectType").val();
	if(type == "марш") $(this).find(".marshParams").show();
	if(type == "поворот") $(this).find(".turnParams").show();
	if(type == "площадка") $(this).find(".bridgeParams").show();
	
	})
	
}

function addRutelMooveInputs(){
	
	
	var rowAmt = $("#rutelMooveTable tr").length;
	var row = '<tr class="rutelMoove">' + 
				'<td><input class="sectID"  id="sectID'  + (rowAmt-1) + '" type="number" value="1" ></td>' + 
				'<td><input class="glassId" id="glassId'  + (rowAmt-1) + '" type="number" value="1"></td>' + 
				'<td><input class="holeId" id="holeId'  + (rowAmt-1) + '" type="number" value="1"></td>' + 
				'<td>X: <input class="mooveX" id="mooveX'  + (rowAmt-1) + '" type="number" value="0" step="20">' + 
					'Y: <input class="mooveY" id="mooveY'  + (rowAmt-1) + '" type="number" value="0" step="20">' +
				'</td>' +				
				'<td><span class="removeRow">Х</span></td>' +
			'</tr>';
		$("#rutelMooveTable").append(row);
}

function reindexRutelMooveTable(){
	var rowAmt = $("#rutelMooveTable tr").length;
	for (var i=1; i<rowAmt; i++){
		$("#rutelMooveTable tr").eq(i).find(".sectNumber").text(i);
		$("#rutelMooveTable tr").eq(i).find('td input,select,textarea').each(function(){
			var oldId = $(this).attr("id");
			var newId = oldId.match(/^([^0-9]+)[0-9]+$/)[1] + (i-1);
			$(this).attr("id", newId);
			});	
		}
}


