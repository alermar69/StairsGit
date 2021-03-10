var fontGlob;

//обработчики

$(function () {
	if(!window.IS_ISOLATION && params.calcType != 'custom') loadFont();

	//добавление секции
	$("#addDimRow").click(function(){
		addDimInputs();
		reindexId('dimParamsTable');
		drawSceneDimensions();
	});
	
	//обновить
	$("#drawSceneDimensions").click(function(){
		drawSceneDimensions();
	});
	
	 
	 //указание базовой точки на модели
	 $("#dimParamsTable").delegate('.setBasePoints', 'click' , function(event) {
		var basePlane = "";
		var dimSide = "";
		var cameraPosId = menu.cameraPosId;
		if(cameraPosId == "справа"){
			basePlane = "yz";
			dimSide = "сзади";
		}
		if(cameraPosId == "слева"){
			basePlane = "yz";
			dimSide = "спереди";
		}
		if(cameraPosId == "спереди"){
			basePlane = "xy";
			dimSide = "спереди";
		}
		if(cameraPosId == "сзади"){
			basePlane = "xy";
			dimSide = "сзади";
		}
		if(cameraPosId == "сверху"){
			basePlane = "xz";
			dimSide = "спереди";
		}
		if(cameraPosId == "снизу") {
			basePlane = "xz";
			dimSide = "сзади";
		}
		
		if(basePlane) $(this).closest("tr").find("select.dimBasePlane").eq(0).val(basePlane)
		if(dimSide) $(this).closest("tr").find("select.dimSide").eq(0).val(dimSide)
		
		var startPoint = lastSelectedPoint; //глобавльная переменная из файла viewports
		var endPoint = lastSelectedPoint1; //глобавльная переменная из файла viewports
		
		$(this).closest("tr").find("input.startPointX").eq(0).val(Math.round(startPoint.x * 10) / 10)
		$(this).closest("tr").find("input.startPointY").eq(0).val(Math.round(startPoint.y * 10) / 10)
		$(this).closest("tr").find("input.startPointZ").eq(0).val(Math.round(startPoint.z * 10) / 10)
		
		$(this).closest("tr").find("input.endPointX").eq(0).val(Math.round(endPoint.x * 10) / 10)
		$(this).closest("tr").find("input.endPointY").eq(0).val(Math.round(endPoint.y * 10) / 10)
		$(this).closest("tr").find("input.endPointZ").eq(0).val(Math.round(endPoint.z * 10) / 10)
		
		drawSceneDimensions();
	 })
	 
});

function addDimRows(){
	$(".dimParams").remove();
	var rowAmt = $("#dimAmt").val();
	for(var i=0; i<rowAmt; i++){
		addDimInputs();
		}
	reindexId('dimParamsTable');
}

//показ/скрытие параметров размеров
function changeFormDim(){

$("#dimParamsTable tr").each(function(){
	$(this).find(".axisX").show();
	$(this).find(".axisY").show();
	$(this).find(".axisZ").show();
	var basePlane = $(this).find(".dimBasePlane").val();
	if(basePlane == "xy") $(this).find(".axisZ").hide();
	if(basePlane == "yz") $(this).find(".axisX").hide();
	if(basePlane == "xz") $(this).find(".axisY").hide();
	})
	
}

function addDimInputs(){
	
	
	var rowAmt = $("#dimParamsTable tr").length;
	var row = '<tr class="dimParams">' + 
			'<td class="dimNumber">' + rowAmt + '</td>' + 
			'<td>' +
				'<span style="display: none">' + 
				'<span>X1:<input class="startPointX" id="startPointX' + (rowAmt-1) + '" type="number" value="-500"><br/></span>' +
				'<span>Y1:<input class="startPointY" id="startPointY' + (rowAmt-1) + '" type="number" value="0"><br/></span>' +
				'<span>Z1:<input class="startPointZ" id="startPointZ' + (rowAmt-1) + '" type="number" value="0"><br/></span>' +
				'<span>X2:<input class="endPointX" id="endPointX' + (rowAmt-1) + '" type="number" value="-200"><br/></span>' +
				'<span>Y2:<input class="endPointY" id="endPointY' + (rowAmt-1) + '" type="number" value="0"><br/></span>' +
				'<span>Z2:<input class="endPointZ" id="endPointZ' + (rowAmt-1) + '" type="number" value="0"><br/></span>' +
				'</span>' + 
				'<button class="setBasePoints">Вставить</button>' +
				'</td>' +
			'<td>' +
				'<select class="dimBasePlane" id="dimBasePlane' + (rowAmt-1) + '" size="1">' +
					'<option value="xy">xy</option>' +
					'<option value="yz">yz</option>' +
					'<option value="xz">xz</option>' +
				'</select><br/>' +
				'<select class="dimSide" id="dimSide' + (rowAmt-1) + '" size="1">' +
					'<option value="спереди">спереди</option>' +
					'<option value="сзади">сзади</option>' +
				'</select>' +
			'</td>' +
			'<td>' +
				'<select class="dimBaseAxis" id="dimBaseAxis' + (rowAmt-1) + '" size="1">' +
					'<option class="axisX" value="x">x</option>' +
					'<option class="axisY" value="y">y</option>' +
					'<option class="axisZ" value="z">z</option>' +
				'</select>' +
			'</td>' +
			'<td>' +
				'<input class="dimOffset" id="dimOffset' + (rowAmt-1) + '" type="number" value="100" step="20"><br/>' +
				'<span>X:<input class="mooveX" id="mooveX' + (rowAmt-1) + '" type="number" value="0"><br/></span>' +
				'<span>Y:<input class="mooveY" id="mooveY' + (rowAmt-1) + '" type="number" value="0"><br/></span>' +
				'<span>Z:<input class="mooveZ" id="mooveZ' + (rowAmt-1) + '" type="number" value="0"><br/></span>' +
			'</td>' +
			'<td><span class="removeRow">Х</span></td>' +
		'</tr>';
		
		$("#dimParamsTable").append(row);
}

