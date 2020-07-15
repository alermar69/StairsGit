//обработчики

$(function () {
	//добавление секции
	$("#addConcreteRow").click(function(){
		addConcreteInputs();
		$("#stairSectAmt").val($("#stairSectAmt").val()*1.0 + 1);
		// recalculate();
		redrawConcrete();
	});
	
	//удаление секции
	$("#concreteParamsTable").delegate('.removeRow', 'click' , function(event) {
		$(this).closest("tr").remove();
		reindexConcreteParamsTable();
		$("#stairSectAmt").val($("#stairSectAmt").val()*1.0 - 1);
		// recalculate();
		redrawConcrete();
	 })

	 $('#concreteParamsTable').on('change', 'select, input, textarea', function(){
		redrawConcrete();
	 })
	 
	 //указание базовой точки на модели
	 $("#concreteParamsTable").delegate('.setBasePoint', 'click' , function(event) {
		var point = lastSelectedPoint; //глобавльная переменная из файла viewports
		$(this).closest("tr").find("input.posX").eq(0).val(point.x)
		$(this).closest("tr").find("input.posY").eq(0).val(point.y)
		$(this).closest("tr").find("input.posZ").eq(0).val(point.z)
		
		recalculate();
	 })

	 $("#concreteParamsTable").delegate('.mooveConcreteSection', 'click' , function(event) {
		var id = $(this).closest("tr").attr('data-id');
		moveToPoint(id, 'concrete');
	 })

	 $("#concreteParamsTable").delegate('.copyConcreteSection', 'click' , function(event) {
		var index = addConcreteInputs();
		console.log('asdasdasdasdasd', index)
		$.each($(this).find('input, select'), function(){
			console.log($(this)[0].classList[0], $(this).val(), this)
			$('.concreteParRow[data-id="' + index + '"]').find($(this)[0].classList[0]).val($(this).val());
		});

		$("#stairSectAmt").val($("#stairSectAmt").val()*1.0 + 1);
		// recalculate();
		redrawConcrete();
	})
});

function addConcreteRows(){
var rowAmt = $("#stairSectAmt").val();
for(var i=0; i<rowAmt; i++){
	addConcreteInputs();
	//console.log(i)
	}	
}

//показ/скрытие параметров секции
function changeFormConcrete(){

$("#concreteParamsTable tr").each(function(){
	$(this).find(".marshParams").hide();
	$(this).find(".turnParams").hide();
	$(this).find(".bridgeParams").hide();
	var type = $(this).find(".sectType").val();
	if(type == "марш") $(this).find(".marshParams").show();
	if(type == "поворот") $(this).find(".turnParams").show();
	if(type == "площадка") $(this).find(".bridgeParams").show();
	
	})
	
}

function addConcreteInputs(){
	
	
	var rowAmt = $("#concreteParamsTable tr").length;
	var row = '<tr class="sectParams concreteParRow" data-object_selector="concreteParRow" data-id="'+ rowAmt +'">' + 
			'<td class="sectNumber">' + rowAmt + '</td>' + 
				'<td>' +
					'<select class="sectType" id="sectType' + (rowAmt-1) + '" size="1">' +
						'<option value="марш">марш</option>' +
						'<option value="поворот">поворот</option>' +
						'<option value="площадка">площадка</option>' +
					'</select>' +
				'<td>' +
					'<span class="marshParams turnParams">h: <input class="h" id="h' + (rowAmt-1) + '" type="number" value="180"><br/></span>' +
					'<span class="marshParams">b: <input class="b" id="b' + (rowAmt-1) + '" type="number" value="260"><br/></span>' +
					'<span class="marshParams turnParams">Подъемов: <input  class="stairAmt" id="stairAmt'  + (rowAmt-1) + '" type="number" value="5"><br/></span>' +
					'<span class="turnParams">Угол поворота: <input id="turnAngle' + (rowAmt-1) + '" type="number" value="90"><br/></span>' +
					'<span class="turnParams">Смещение центра: <input id="offsetIn' + (rowAmt-1) + '" type="number" value="0"><br/></span>' +
					'<span class="bridgeParams">Длина: <input id="sectLen' + (rowAmt-1) + '" type="number" value="1000"><br/></span>' +
					'<span class="marshParams turnParams bridgeParams">Ширина: <input class="sectWidth" id="sectWidth' + (rowAmt-1) + '" type="number" value="900"><br/></span>' +
					'<span class="turnParams bridgeParams">Ширина 2: <input id="sectWidthS' + (rowAmt-1) + '" type="number" value="900"><br/></span>' +
					'<span class="marshParams bridgeParams">Толщина: <input id="sectThk' + (rowAmt-1) + '" type="number" value="200"><br/></span>' +
					'<span class="bridgeParams">Срез: <select class="cutSide" id="cutSide' + (rowAmt-1) + '" size="1">' +
						'<option value="справа">справа</option>' +
						'<option value="слева">слева</option>' +
						'<option value="две">две</option>' +
					'</select></span>' +
					'<span class="marshParams">Тип: <select id="marshType' + (rowAmt-1) + '" size="1">' +
						'<option value="пилообразный">пилообразный</option>' +
						'<option value="ломаный">ломаный</option>' +
					'</select></span><br>' +
					'<span class="bridgeParams">Плинтус: <br>'+
					'1 <input type="checkbox" id="firstSkirting' + (rowAmt + 1) +'"><br>' +
					'2 <input type="checkbox" id="secondSkirting' + (rowAmt + 1) +'"><br>' +
					'3 <input type="checkbox" id="thirdSkirting' + (rowAmt + 1) +'"><br>' +
					'4 <input type="checkbox" id="fourthSkirting' + (rowAmt + 1) +'"><br>' +
					'</span>' +
					'<span class="marshParams turnParams">Плинтус: <select id="skirtingType' + (rowAmt-1) + '" size="1">' +
						'<option value="нет">нет</option>' +
						'<option class="turnParams" value="да">да</option>' +
						'<option class="marshParams" value="слева">слева</option>' +
						'<option class="marshParams" value="справа">справа</option>' +
						'<option class="marshParams" value="две стороны">две стороны</option>' +
					'</select></span>' +
				'</td>' +
				'<td>' +
					'<span>X: <input class="posX" id="posX' + (rowAmt-1) + '" type="number" value="0"><br/></span>' +
					'<span>Y: <input class="posY" id="posY' + (rowAmt-1) + '" type="number" value="0"><br/></span>' +
					'<span>Z: <input class="posZ" id="posZ' + (rowAmt-1) + '" type="number" value="0"><br/></span>' +
					'<span>Ang: <input class="posAng" id="posAng' + (rowAmt-1) + '" type="number" value="0"><br/></span>' +
					'<button class="mooveConcreteSection">Переместить</button>' +
					'<button class="copyConcreteSection">Копировать</button>' +
				'</td>' +
				
				'<td><span class="removeRow">Х</span></td>' +
			'</tr>';
		$("#concreteParamsTable").append(row);
		return rowAmt
}

function reindexConcreteParamsTable(){
	var rowAmt = $("#concreteParamsTable tr").length;
	for (var i=1; i<rowAmt; i++){
		$("#concreteParamsTable tr").eq(i).find(".sectNumber").text(i);
		$("#concreteParamsTable tr").eq(i).find('td input,select,textarea').each(function(){
			var oldId = $(this).attr("id");
			var newId = oldId.match(/^([^0-9]+)[0-9]+$/)[1] + (i-1);
			$(this).attr("id", newId);
			});	
		}
}


