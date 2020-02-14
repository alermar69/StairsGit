
$(function() {

	//добавление выступа стен
	$("#addWallLedge").click(function(){
		addWallLedge();
		reindexId('wallLedgesTable');
		redrawWalls();
	})
	
	//добавление выступа в верхнем проеме
	 
	$("#addTopFloorLedge").click(function(){
		addTopFloorLedge()		
		reindexId('topFloorLedgesTable');
		drawTopFloor();
	});

	$("#redrawWalls").click(function(){
		changeAllForms();
		redrawWalls();
	});
	
	$("#redrawTopFloor").click(function(){
		changeAllForms();
		drawTopFloor();
	});

	$('#wallsTable').delegate('select, input', 'change', function(){
		redrawWalls();
		drawTopFloor();
	});

	$('#dxfOpening').change(function(){
		if ($(this).val() == 'нет') {
			$('.dxfOpeningFileInput').hide();
		}else{
			$('.dxfOpeningFileInput').show();
		}
	});

	$('#dxfFile').change(function(){
		changeAllForms();
		drawTopFloor();
	});

//обработчик изменения инпутов выступов стен
	$('#wallLedgesTable').delegate('select, input', 'change', function(){

		var ledgeType = $(this).closest("tr").find(".wallLedgeType").val();
		var baseWall = $(this).closest("tr").find(".wallLedgeBaseWall").val();
		
		$(this).closest("tr").find(".wallLedgeBaseWall").show();
		if(ledgeType == "параллелепипед") {
			$(this).closest("tr").find(".wallLedgeBaseWall").val("1");
			$(this).closest("tr").find(".wallLedgeBaseWall").hide();
		}
		
		//позиция по Z
		$(this).closest("tr").find(".wallLedgePosZ").closest("div.line").hide();
		if(ledgeType == "параллелепипед" || baseWall == "нижнее"){
			$(this).closest("tr").find(".wallLedgePosZ").closest("div.line").show();
		}

		//позиция по Y
		$(this).closest("tr").find(".wallLedgePosY").closest("div.line").show();
		if(baseWall == "нижнее"){
			$(this).closest("tr").find(".wallLedgePosY").closest("div.line").hide();
		}
		redrawWalls();
	});
	
	//выставление стен по проему
	$("#setWallsPos").click(function(){
		//стена 1
		$("#wallLength_1").val(params.floorHoleLength);
		$("#wallPositionX_1").val(-params.floorHoleLength);
		$("#wallPositionZ_1").val(0);
		
		//стена 2
		$("#wallLength_2").val(params.floorHoleLength);
		$("#wallPositionX_2").val(-params.floorHoleLength);
		$("#wallPositionZ_2").val(params.floorHoleWidth);

		//стена 3
		$("#wallLength_3").val(params.floorHoleWidth);
		$("#wallPositionX_3").val(0);
		$("#wallPositionZ_3").val(0);
		
		//стена 4
		$("#wallLength_4").val(params.floorHoleWidth);
		$("#wallPositionX_4").val(-params.floorHoleLength);
		$("#wallPositionZ_4").val(0);
		
		redrawWalls();
	})
    
});

/** функция добавляет строку в таблицу выступов верхнего проема*/

function addTopFloorLedge(){
	 var text = '<tr class="topFloorLedgeParRow">' +
        '<td>' +
        '<select id="floorHoleLedgeBaseEdge0" size="1" onchange="">' +
        '<option value="1">1</option>' +
        '<option value="2">2</option>' +
        '<option value="3">3</option>' +
        '<option value="4" selected="">4</option>' +
        '</select>' +
        '</td>' +
        '<td><input type="number" id="floorHoleLedgeLength0" value="1000" step="100"></td>' +
        '<td><input type="number" id="floorHoleLedgeWidth0" value="1000" step="100"></td>' +
        '<td><input type="number" id="floorHoleLedgePosition0" value="0" step="100"></td>' +
        '<td><button class="removeRow">Удалить</button></td>' +
        '</tr>'
		
		$('#topFloorLedgesTable tbody').append(text);
};

/** функция добавляет строку в таблицу выступов стен*/

function addWallLedge(){
	 var text = '<tr class="ledgeParRow">' +
            '<td>' +
            '<select id="wallLedgeType0" size="1" class="wallLedgeType">' +
            '<option value="проем">проем</option>' +
            '<option value="выступ" selected="">выступ</option>' +
            '<option value="параллелепипед">блок</option>' +
            '</select>' +
            '</td>' +
            '<td>' +
               '<select id="wallLedgeBaseWall0" size="1" class="wallLedgeBaseWall">' +
                  '<option value="1">стена 1</option>' +
                  '<option value="2">стена 2</option>' +
                  '<option value="3">стена 3</option>' +
                  '<option value="4">стена 4</option>' +
				  '<option value="нижнее">нижнее</option>' +
               '</select>' +
            '</td>' +
            '<td>' + 
		'<div class="line">X:<input type="number" id="wallLedgeWidth0" value="500" step="100" class="wallLedgeWidth"></div>' +
            	'<div class="line">Y:<input type="number" id="wallLedgeHeight0" value="500" step="100" class="wallLedgeHeight"></div>' +
            	'<div class="line">Z:<input type="number" id="wallLedgeDepth0" value="500" step="100" class="wallLedgeDepth"></div>' + 
	    '</td>' +
            '<td style="border-right: 0;">' +
            	'<div class="line">X:<input type="number" id="wallLedgePosX0" value="100" step="100" class="wallLedgePosX"></div>' +
            	'<div class="line">Y:<input type="number" id="wallLedgePosY0" value="100" step="100" class="wallLedgePosY"></div>' + 
	    	'<div class="line" style="display:none">Z:<input type="number" id="wallLedgePosZ0" value="0" step="100" class="wallLedgePosZ"></div>' + 
	    '</td>' + 
		'<td>' +
			'<select id="wallLedgeMat0">' +
				'<option value="brick_01">Кирпич 1</option>' +
				'<option value="brick_02">Кирпич 2</option>' +
				'<option value="timber">Брус</option>' +
				'<option value="painted">Покраска</option>' +
				'<option value="wallPaper_01">Обои 1</option>' +
				'<option value="wallPaper_02">Обои 2</option>' +
				'<option value="wallPaper_03">Обои 3</option>' +
				'<option value="wallPaper_04">Обои 4</option>' +
			'</select>' +
		'</td>' +
		'<td><input id="wallLedgeColor0" type="color" value="#cccccc"></td>\
		<td>\
			<button class="removeRow">Удалить</button>\
		</td>\
	</tr>';
		
	$('#wallLedgesTable tbody').append(text);
};


/** функция инициализирует форму выступов проема в верхнем перекрытии при загрузке данных из базы */

changeFormTopFloor = function(){
	$(".topFloorLedgeParRow").remove();
	var amt = $('#topFloorAmt').val();
	for(var i = 0; i < amt; i++){
		addTopFloorLedge();
	};
	reindexId('topFloorLedgesTable');
};

/** функция инициализирует форму выступов стен при загрузке данных из базы */
	
changeFormLedges = function(){
	$(".ledgeParRow").remove();
	var amt = $('#wallLedgeAmt').val();
	for(var i = 0; i < amt; i++){
		addWallLedge()
	}
	reindexId('wallLedgesTable');
};

