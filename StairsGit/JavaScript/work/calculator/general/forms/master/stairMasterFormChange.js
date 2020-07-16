var lastSlide = 1;

$(function(){
	
	$('body').on('change', '.stair-master select', function(){
		sceneFormChange();
	});

	$('body').on('change', '.stair-master input', function(){
		sceneFormChange();
	})

	$('.close_modal').click(function(){
		setMasterState(false)
	});

	$('#open_master_modal').click(function(){
		setMasterState(true)
	});

	$('.toggleWallsMaster').click(function(){
		menu.wallall = !menu.wallall;
	});

	$('#prevStep').click(function(){
		var currentStep = $('.master-step:visible').data('step') * 1.0;
		if (currentStep > 1) {
			setStep(currentStep - 1);
			lastSlide = currentStep - 1;
		}
	});

	$('.recalculateMaster').click(function(){
		recalculateMaster();
	});

	$('#nextStep').click(function(){
		var currentStep = $('.master-step:visible').data('step') * 1.0;
		if ($('.master-step[data-step="' + (currentStep + 1) + '"]').length > 0) {
			setStep(currentStep + 1);
			lastSlide = currentStep + 1;
		}
	});

	$('.wallSelect').click(function(){
		var wall = $(this).html();
		
		menu.wall1 = false;
		menu.wall2 = false;
		menu.wall3 = false;
		menu.wall4 = false;
		menu.topFloor = false;

		if (wall == 1) {
			menu.wall1 = true;
			menu.cameraPosId = 'спереди';
		}

		if (wall == 2) {
			menu.wall2 = true;
			menu.cameraPosId = 'сзади';
		}

		if (wall == 3) {
			menu.wall3 = true;
			menu.cameraPosId = 'слева';
		}

		if (wall == 4) {
			menu.wall4 = true;
			menu.cameraPosId = 'справа';
		}

		if (wall == 'Сверху') {
			menu.wall1 = true;
			menu.wall2 = true;
			menu.wall3 = true;
			menu.wall4 = true;
			menu.topFloor = true;
			menu.cameraPosId = 'сверху';
		}

		if (wall == '3D') {
			menu.wall1 = true;
			menu.wall2 = true;
			menu.wall3 = true;
			menu.wall4 = true;
			menu.topFloor = true;
			menu.cameraPosId = '3d';
		}

		// view.orbitControls.enableRotate = false;

	});

	$('#dxfFileMaster').click(function(){
		$('#dxfFile').click();
	});
});

function setMasterState(state){
	if (state) {
		$('.stair-master .visualisation').append($('#WebGL-output').children());
	
		$('#master_modal').modal();
		view.orbitControls.enableRotate = false;
		menu.dimensions = false;

		// Переносим форму стен, тк она оказалась нормальной
		$.each($('.move_form_container'), function(){
			var move_from = $(this).data('content_from');
			if (move_from && $(move_from).length > 0) {
				$(this).append($(move_from).children());
			}
		});

		// Переносим нужные инпуты
		$.each($('.move-input-master'), function(){
			// master-input-copy
			var el = $(this);
			var id = el.data('id');
			if (id && $('#' + id).length > 0) {
				var new_id = el.data('new_id');
				if (!new_id) {
					new_id = id + 'Master';
				}

				var newInput = $('#'+id).clone();
				newInput.attr('id', new_id);
				newInput.data('id', id);
				newInput.addClass('master-input').addClass('w-100');
				el.html(newInput);
			}else{
				var parent = el.closest('.master-input-container')
				$(parent).hide();
			}
		});

		sceneFormChange();
		resizeView();
		setStep(lastSlide);
		recalculateMaster();
	}else{
		// Возвращаем всё на место
		$('#master_modal').modal('hide');
		$('#WebGL-output').append($('.visualisation').children());

		$.each($('.move_form_container'), function(){
			var move_from = $(this).data('content_from');
			if (move_from && $(move_from).length > 0) {
				$(move_from).append($(this).children());
			}
		});

		view.orbitControls.enableRotate = true;
		menu.cameraPosId = '3d';

		menu.wall1 = true;
		menu.wall2 = true;
		menu.wall3 = true;
		menu.wall4 = true;
		menu.topFloor = true;
		resizeView();
	}
}

function resizeView(){
	var parentElem = $(view.renderer.domElement).parent();

	view.width = parentElem.width();
	view.height = parentElem.height();
	windowHalfX = view.width / 2;
	windowHalfY = view.height / 2;
	switchCamera(menu.cameraPosId)
	view.renderer.setSize( view.width, view.height );
}

function setOpeningType(openingType){
	// Определяем видимость стен
	
	var wall1Visible = true;
	var wall2Visible = true;
	var wall3Visible = true;
	var wall4Visible = true;
	var wall5Visible = true;
	var wall6Visible = true;
	
	if (openingType == 'квадратный') {
		wall1Visible = $('#wallAVisible').is(':checked');
		wall2Visible = $('#wallCVisible').is(':checked');
		wall3Visible = $('#wallDVisible').is(':checked');
		wall4Visible = $('#wallBVisible').is(':checked');
	}else if(openingType !== 'dxf'){
		wall1Visible = $('#wallAVisible').is(':checked');
		wall2Visible = $('#wallFVisible').is(':checked');
		wall3Visible = $('#wallEVisible').is(':checked');
		wall4Visible = $('#wallBVisible').is(':checked');
		wall5Visible = $('#wallDVisible').is(':checked');
		wall6Visible = $('#wallCVisible').is(':checked');
	}else{
		wall1Visible = wall2Visible = wall3Visible = wall4Visible = wall5Visible = wall6Visible = false;
	}

	$('.topFloorLedgeParRow').remove();
	$('.ledgeParRow').remove();

	if (openingType == 'квадратный') {
		$('.opening_image img').show();
		$('.opening_image img').attr('src', '/calculator/images/master/rect_opening.jpg')
	}

	if (openingType == 'dxf') {
		$('.opening_image img').hide();
	}

	if (openingType == 'Г-образный' && $("#turnSide").val() == 'правое') {
		$('.opening_image img').show();
		$('.opening_image img').attr('src', '/calculator/images/master/g_opening.jpg')

		var dSize = $('#dSize').val() * 1.0;
		var cSize = $('#cSize').val() * 1.0;
		var ledgeLength = $('#floorHoleWidth').val() - dSize;
		var ledgeWidth = $('#floorHoleLength').val() - cSize;

		var text = '<tr class="topFloorLedgeParRow">' +
			'<td>' +
			'<select id="floorHoleLedgeBaseEdge0" size="1" onchange="">' +
			'<option value="1">1</option>' +
			'<option value="2">2</option>' +
			'<option value="3" selected>3</option>' +
			'<option value="4">4</option>' +
			'</select>' +
			'</td>' +
			'<td><input type="number" id="floorHoleLedgeLength0" value="'+ ledgeLength +'" step="100"></td>' +
			'<td><input type="number" id="floorHoleLedgeWidth0" value="' + ledgeWidth + '" step="100"></td>' +
			'<td><input type="number" id="floorHoleLedgePosition0" value="0" step="100"></td>' +
			'<td><button class="removeRow">Удалить</button></td>' +
			'</tr>'
		
		$('#topFloorLedgesTable tbody').append(text);

		if (wall5Visible) {
			var ledge1Par = {
				index: 0,
				type: 'параллелепипед',
				sizeX: 150,
				sizeY: params.staircaseHeight,
				sizeZ: dSize,
				posX:  0,
				posY:  0,
				posZ:  0
			};
			addLedgeWithParams(ledge1Par);
		}

		if (wall6Visible) {
			var ledge1Par = {
				index: 1,
				type: 'параллелепипед',
				sizeX: cSize,
				sizeY: params.staircaseHeight,
				sizeZ: 150,
				posX:  -$('#floorHoleLength').val() * 1.0,
				posY:  0,
				posZ:  $('#floorHoleWidth').val() * 1.0
			};
			addLedgeWithParams(ledge1Par);
		}
	}

	if (openingType == 'Г-образный' && $("#turnSide").val() == 'левое') {
		$('.opening_image img').show();
		$('.opening_image img').attr('src', '/calculator/images/master/g_mirror_opening.jpg')
		
		var dSize = $('#dSize').val() * 1.0;
		var cSize = $('#cSize').val() * 1.0;
		var ledgeWidth = $('#floorHoleLength').val() - cSize;
		var ledgeLength = $('#floorHoleWidth').val() - dSize;

		var text = '<tr class="topFloorLedgeParRow">' +
			'<td>' +
			'<select id="floorHoleLedgeBaseEdge0" size="1" onchange="">' +
			'<option value="1">1</option>' +
			'<option value="2">2</option>' +
			'<option value="3" selected>3</option>' +
			'<option value="4">4</option>' +
			'</select>' +
			'</td>' +
			'<td><input type="number" id="floorHoleLedgeLength0" value="'+ ledgeLength +'" step="100"></td>' +
			'<td><input type="number" id="floorHoleLedgeWidth0" value="' + ledgeWidth + '" step="100"></td>' +
			'<td><input type="number" id="floorHoleLedgePosition0" value="' + dSize + '" step="100"></td>' +
			'<td><button class="removeRow">Удалить</button></td>' +
			'</tr>'
		
		$('#topFloorLedgesTable tbody').append(text);

		if (wall5Visible) {
			var ledge1Par = {
				index: 0,
				type: 'параллелепипед',
				sizeX: 150,
				sizeY: params.staircaseHeight,
				sizeZ: dSize,
				posX:  0,
				posY:  0,
				posZ:  -dSize
			};
			addLedgeWithParams(ledge1Par);
		}

		if (wall6Visible) {
			var ledge1Par = {
				index: 1,
				type: 'параллелепипед',
				sizeX: cSize,
				sizeY: params.staircaseHeight,
				sizeZ: 150,
				posX:  -$('#floorHoleLength').val() * 1.0,
				posY:  0,
				posZ:  -$('#floorHoleWidth').val() * 1.0 - 150
			};
			addLedgeWithParams(ledge1Par);
		}

	}

	changeAllForms();
	drawTopFloor();
	
	var wall2Length = params.floorHoleLength;
	var wall3Length = params.floorHoleWidth;

	var wall2PosX = -params.floorHoleLength;
	var wall2PosZ = params.floorHoleWidth;

	var wall3PosX = 0;
	var wall3PosZ = 0;

	if (openingType == 'Г-образный') {
		// считаеем длины стен
		wall2Length -= cSize;
		wall3Length -= dSize;

		//Считаем позиции
		wall2PosX += cSize;
		wall2PosZ -= wall3Length;
		
		wall3PosX -= wall2Length;
		wall3PosZ += dSize;
	}
	
	//стена 1
	$("#wallLength_1").val(params.floorHoleLength);
	$("#wallPositionX_1").val(-params.floorHoleLength);
	$("#wallPositionZ_1").val(0);

	if (!wall1Visible) {
		// Не как у всех потому что блоки привязаны к стене
		$('#wallLength_1').val(1);
	}
	
	//стена 2
	$("#wallLength_2").val(wall2Length);
	$("#wallPositionX_2").val(wall2PosX);
	$("#wallPositionZ_2").val(wall2PosZ);

	if (wall2Visible) {
		$('#wallThickness_2').val(150);
	}else{
		$('#wallThickness_2').val(0);
	}

	//стена 3
	$("#wallLength_3").val(wall3Length);
	$("#wallPositionX_3").val(wall3PosX);
	$("#wallPositionZ_3").val(wall3PosZ);

	if (wall3Visible) {
		$('#wallThickness_3').val(150);
	}else{
		$('#wallThickness_3').val(0);
	}
	
	//стена 4
	$("#wallLength_4").val(params.floorHoleWidth);
	$("#wallPositionX_4").val(-params.floorHoleLength);
	$("#wallPositionZ_4").val(0);

	if (wall4Visible) {
		$('#wallThickness_4').val(150);
	}else{
		$('#wallThickness_4').val(0);
	}
	
	redrawWalls();
}

function addLedgeWithParams(par){
    $('#wallLedgesTable tbody').append('<tr class="ledgeParRow">' +
                '<td>' +
                '<select id="wallLedgeType' + par.index + '" size="1" class="wallLedgeType">' +
                '<option value="проем" ' + (par.type == 'проем' ? 'selected' : '') + '>проем</option>' +
                '<option value="выступ" ' + (par.type == 'выступ' ? 'selected' : '') + '>выступ</option>' +
                '<option value="параллелепипед" ' + (par.type == 'параллелепипед' ? 'selected' : '') + '>блок</option>' +
                '</select>' +
                '</td>' +
                '<td>' +
                '<select id="wallLedgeBaseWall' + par.index + '" size="1" class="wallLedgeBaseWall">' +
                    '<option value="1" ' + (par.wallBase == '1' ? 'selected' : '') + '>стена 1</option>' +
                    '<option value="2" ' + (par.wallBase == '2' ? 'selected' : '') + '>стена 2</option>' +
                    '<option value="3" ' + (par.wallBase == '3' ? 'selected' : '') + '>стена 3</option>' +
                    '<option value="4" ' + (par.wallBase == '4' ? 'selected' : '') + '>стена 4</option>' +
                    '<option value="нижнее" ' + (par.wallBase == 'нижнее' ? 'selected' : '') + '>нижнее</option>' +
                '</select>' +
                '</td>' +
                '<td>' + 
            '<div class="line">X:<input type="number" id="wallLedgeWidth' + par.index + '" value="' + (par.sizeX || 500) + '" step="100" class="wallLedgeWidth"></div>' +
                    '<div class="line">Y:<input type="number" id="wallLedgeHeight' + par.index + '" value="' + (par.sizeY || 500) + '" step="100" class="wallLedgeHeight"></div>' +
                    '<div class="line">Z:<input type="number" id="wallLedgeDepth' + par.index + '" value="' + (par.sizeZ || 500) + '" step="100" class="wallLedgeDepth"></div>' + 
            '</td>' +
                '<td style="border-right: 0;">' +
                    '<div class="line">X:<input type="number" id="wallLedgePosX' + par.index + '" value="' + (par.posX || 100) + '" step="100" class="wallLedgePosX"></div>' +
                    '<div class="line">Y:<input type="number" id="wallLedgePosY' + par.index + '" value="' + (par.posY || 0) + '" step="100" class="wallLedgePosY"></div>' + 
                '<div class="line" style="display:none">Z:<input type="number" id="wallLedgePosZ' + par.index + '" value="' + (par.posZ || 0) + '" step="100" class="wallLedgePosZ"></div>' + 
            '</td>' + 
            '<td>' +
                '<select id="wallLedgeMat' + par.index + '">' +
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
			'<td><input id="wallLedgeColor' + par.index + '" type="color" value="#cccccc"></td>' +
			'<td>\
				<select class="wallLedgeBase" id="wallLedgeBase' + par.index + '">\
					<option value="left">Слева</option>\
					<option value="right">Справа</option>\
				</select>\
			</td>' +
            '<td style="border-left: 0;">' +
                '<div class="button-block"><span class="close-block"></span></div>' +
            '</td>' +
        '</tr>');
}

function setStep(step){

	if (step == 1) {
		// Начальное состояние для 1 шага
		menu.wall1 = true;
		menu.wall2 = true;
		menu.wall3 = true;
		menu.wall4 = true;
		menu.topFloor = true;
		menu.cameraPosId = 'сверху';
		view.orbitControls.enableRotate = false;
	}

	if (step == 2) {
		// Начальное состояние для 2 шага
		menu.wall1 = true;
		menu.wall2 = false;
		menu.wall3 = false;
		menu.wall4 = false;
		menu.topFloor = false;
		
		menu.cameraPosId = 'спереди';
		view.orbitControls.enableRotate = false;
	}

	$('.master-step').hide();
	$('.master-step[data-step="' + step + '"]').show();
	if ($('.master-step[data-step]').length == step) {
		$('#nextStep').attr('disabled', true);
	}else{
		$('#nextStep').attr('disabled', false);
	}

	if (step == 1) {
		$('#prevStep').attr('disabled', true);
	}else{
		$('#prevStep').attr('disabled', false);
	}
}

function sceneFormChange(){

	var turnSideBefore = $('#turnSide').val();
	var currentStep = $('.master-step:visible').data('step') * 1.0;
	var doubleMasterInputs = $('.master-input'); //Дубли реальных инпутов, для мастера
	$.each(doubleMasterInputs, function(){
		$('#' + $(this).data('id')).val($(this).val());
	});

	var openingType = $('#openingType').val();
	if (openingType == 'квадратный') {
		$('.dSize, .cSize').hide();
	}
	if (openingType == 'Г-образный' || openingType == 'Г-образный-левый') {
		$('.dSize, .cSize').show();
	}
	if (openingType == 'dxf') {
		$('.walls_table').hide();
		$('.dxfImportInput').show();
		$('#dxfOpening').val('да');
	}else{
		$('.walls_table').show();
		$('.dxfImportInput').hide();
		$('#dxfOpening').val('нет');
	}

	if (currentStep < 2) {
		setOpeningType(openingType);
	}

	if (turnSideBefore != $('#turnSide').val()) {
		setTimeout(function(){
			recalculateMaster();
		}, 0);
	}
}

function recalculateMaster(){
	recalculate().finally(function(){
		$('#priceBlockMaster #price').html(staircasePrice.finalPrice);
	});
}
