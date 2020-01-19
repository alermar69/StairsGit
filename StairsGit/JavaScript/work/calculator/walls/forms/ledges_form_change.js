
$(function() {	
	 addButtonDelete('topFloorForm', 'topFloorAmt');
	 
	 $('#topFloorForm').delegate('.delete', 'click',  function(){
		$(this).parents('tr').remove();
		reindexId($(this).data('name'), $(this).data('countid'));
		})
	



	$("#addWallLedge").click(function(){
		var amt = $('#wallLedgeAmt').val();
		appendLedges(amt)
	})
	
    reindexLedgeId = function(){
        var group = $('#ledgeForm tbody tr'), amt = 0;
        //перебираем все строки таблицы
        $.each(group, function(i, val){
            var self = i, input = $(val).find('td input,select,textarea');
            //перебираем элементы в строке
            $.each(input, function(i, val){
                var id = val.id.match(/^([^0-9]+)[0-9]+$/)[1];
                val.id = id+(self-1);
            });
            amt = i;
        });
        $('#wallLedgeAmt').val(amt);
        redrawWalls();
    };
    //добавим кнопку удаления строки с выступами
    $('#ledgeForm tr').each(function(i, v){
        $(v).children('td').last().children().first().after($('<div class="button-block"><span class="close-block"></span></div>'));
    });
	$('#ledgeForm').delegate('.close-block', 'click',  function(){
		$(this).parents('tr').remove();
        reindexLedgeId();
		})


    $(window).scroll(function(){
        //console.log(100-$(this).scrollTop());
        var delta = 120-$(this).scrollTop(), top = delta > 0?delta:20;
        $(".tabs").css("top", top);
    });


    $buttonTopFloor = $('<button>Добавить выступы</button>').click(function(){
        $('<tr>' +
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
        '<td><button class="delete" data-name="topFloorForm" data-countid="topFloorAmt">Удалить</button></td>' +
        '</tr>').clone().appendTo($('#topFloorForm tbody') );
        //переиндексируем Id
        reindexId('topFloorForm', 'topFloorAmt');
    });
    $('#topFloorForm table').before($buttonTopFloor);
	
	function showZ_(){
		var $self = $(this);
		var index = $self.attr('id').match(/^.*(\d+)$/)[1];
		var $wallSelect = $('#wallLedgeBaseWall'+index);
		var $z = $('#wallLedgePosZ'+index).parent();
		if($self.val() == 'параллелепипед'){
			//e.preventDefault();
			$wallSelect.prop('disabled', true);
			$z.show();			
			}
		else{
			$wallSelect.prop('disabled', false);
			$z.hide();
			}	
	}
	
//обработчик изменения инпутов	
	$('#ledgeForm').delegate('select, input', 'change', function(){
		console.log(this)
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


    
   changeFormTopFloor = function(){
        removeTopFloor();
        var amt = $('#topFloorAmt').val();
        for(var i = 0; i < amt; i++){
            appendTopFloor(i);
		};
    };
	
    removeTopFloor = function(){
        var inputs = $('table tr').filter(function(){
            return $(this).find('[id^=floorHoleLedge]').length > 0;
        });
        $.each(inputs, function(i,v){
            $(v).remove();
        });
    };
	

    appendTopFloor = function (number) {
        var el = $('#floorHoleLedgeBaseEdge' + number);
        if (el.length > 0)
            return;
        $('<tr>' +
            '<td>' +
            '<select id="floorHoleLedgeBaseEdge'+number+'" size="1" onchange="">' +
            '<option value="1">1</option>' +
            '<option value="2">2</option>' +
            '<option value="3">3</option>' +
            '<option value="4" selected="">4</option>' +
            '</select>' +
            '</td>' +
            '<td><input type="number" id="floorHoleLedgeLength'+number+'" value="1000" step="100"></td>' +
            '<td><input type="number" id="floorHoleLedgeWidth'+number+'" value="1000" step="100"></td>' +
            '<td><input type="number" id="floorHoleLedgePosition'+number+'" value="0" step="100"></td>' +
            '<td><button class="delete" data-name="topFloorForm" data-countid="topFloorAmt">Удалить</button></td>' +
            '</tr>').clone().appendTo($('#topFloorForm tbody'));
        reindexId('topFloorForm', 'topFloorAmt');
    };
	
		changeFormLedges = function(){
        removeLedges();
        var amt = $('#wallLedgeAmt').val();
        for(var i = 0; i < amt; i++)
            appendLedges(i);
    };
    removeLedges = function(){
        var inputs = $('table tr').filter(function(){
            return $(this).find('[id^=wallLedge]').length > 0;
        });
        $.each(inputs, function(i,v){
            $(v).remove();
        });
    };
    appendLedges = function (number) {
        var el = $('#wallLedgeType' + number);
        if (el.length > 0)
            return;
        $('<tr class="ledgeParRow">' +
            '<td>' +
            '<select id="wallLedgeType' + number + '" size="1" class="wallLedgeType">' +
            '<option value="проем">проем</option>' +
            '<option value="выступ" selected="">выступ</option>' +
            '<option value="параллелепипед">блок</option>' +
            '</select>' +
            '</td>' +
            '<td>' +
               '<select id="wallLedgeBaseWall' + number + '" size="1" class="wallLedgeBaseWall">' +
                  '<option value="1">стена 1</option>' +
                  '<option value="2">стена 2</option>' +
                  '<option value="3">стена 3</option>' +
                  '<option value="4">стена 4</option>' +
				  '<option value="нижнее">нижнее</option>' +
               '</select>' +
            '</td>' +
            '<td>' + 
		'<div class="line">X:<input type="number" id="wallLedgeWidth' + number + '" value="500" step="100" class="wallLedgeWidth"></div>' +
            	'<div class="line">Y:<input type="number" id="wallLedgeHeight' + number + '" value="500" step="100" class="wallLedgeHeight"></div>' +
            	'<div class="line">Z:<input type="number" id="wallLedgeDepth' + number + '" value="500" step="100" class="wallLedgeDepth"></div>' + 
	    '</td>' +
            '<td style="border-right: 0;">' +
            	'<div class="line">X:<input type="number" id="wallLedgePosX' + number + '" value="100" step="100" class="wallLedgePosX"></div>' +
            	'<div class="line">Y:<input type="number" id="wallLedgePosY' + number + '" value="100" step="100" class="wallLedgePosY"></div>' + 
	    	'<div class="line" style="display:none">Z:<input type="number" id="wallLedgePosZ' + number + '" value="0" step="100" class="wallLedgePosZ"></div>' + 
	    '</td>' + 
		'<td>' +
			'<select id="wallLedgeMat' + number + '">' +
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
		'<td><input id="wallLedgeColor' + number + '" type="color" value="#cccccc"></td>' +
		'<td style="border-left: 0;">' +
			'<div class="button-block"><span class="close-block"></span></div>' +
		'</td>' +
	'</tr>').clone().appendTo($('#ledgeForm tbody'));
        reindexLedgeId();
    };