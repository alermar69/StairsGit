$(function(){
	$("#addAdditionalObject").click(function(){
		addAdditionalObjectTable();
		redrawAdditionalObjects();
	});

	$('body').on('click', '.additionalObjectPropertiesEdit', function(){
		var id = $(this).parents('.additionalObjectRow').data('object_id');
		additionalObjectModalShow(id);
	});

	$('body').on('click', '.removeAdditionalItem', function(){
		var id = $(this).parents('.additionalObjectRow').data('object_id');
		removeAdditionalItem(id);
	});

	//кнопка применить в модальном окне
	$('#applyObjProps').click(function (e) {
		var $form = $("#additionalObjectProperties")
		var id = $form.find('#additionalObjectId').val();
		var item = getAdditionalObject(id);
		if (item) {
			$.each($form.find('.meshParam'), function(){
				var key = $(this).attr('name');
				if (key) {
					if ($(this).attr('type') == 'checkbox') {
						item.meshParams[key] = $(this).is(':checked');
					}else if($(this).attr('type') == 'number'){
						item.meshParams[key] = $(this).val() * 1.0;
					}else if($(this).attr('type') == 'custom_input'){
						item.meshParams[key] = $(this).find('.selected').data('value');
					}else{
						item.meshParams[key] = $(this).val();
					}
				}
			});
			redrawAdditionalObjects();
		}
	});


	$('#redrawAdditionalObjects').click(function(){
		redrawAdditionalObjects();
	})

	$('body').on('change', '.additionalObjectCalcPrice', function(){
		var id = $(this).parents('.additionalObjectRow').data('object_id');
		var item = getAdditionalObject(id);
		item.calc_price = $(this).is(':checked');
		redrawAdditionalObjects();
	});

	$('body').on('change', '.additionalObjectPosX', function(){
		var id = $(this).parents('.additionalObjectRow').data('object_id');
		var item = getAdditionalObject(id);
		item.position.x = $(this).val();
		redrawAdditionalObjects();
	});

	$('body').on('change', '.additionalObjectPosY', function(){
		var id = $(this).parents('.additionalObjectRow').data('object_id');
		var item = getAdditionalObject(id);
		item.position.y = $(this).val();
		redrawAdditionalObjects();
	});

	$('body').on('change', '.additionalObjectPosZ', function(){
		var id = $(this).parents('.additionalObjectRow').data('object_id');
		var item = getAdditionalObject(id);
		item.position.z = $(this).val();
		redrawAdditionalObjects();
	});

	$('body').on('change', '.additionalObjectClass', function(){
		var id = $(this).parents('.additionalObjectRow').data('object_id');
		var item = getAdditionalObject(id);
		item.className = $(this).val();
		item.meshParams = eval(item.className + '.getDefaults();');
		redrawAdditionalObjects();
	});

	$('body').on('change', '.additionalObjectRot', function(){
		var id = $(this).parents('.additionalObjectRow').data('object_id');
		var item = getAdditionalObject(id);
		item.rotation = $(this).val();
		redrawAdditionalObjects();
	});

	$('body').on('change', '.additionalObjectColor', function(){
		var id = $(this).parents('.additionalObjectRow').data('object_id');
		var item = getAdditionalObject(id);
		item.color = $(this).val();
		redrawAdditionalObjects();
	});

	$('body').on('click', '.meshParam_custom', function() {
		$(this).parents('.meshParam_custom_parent').find('.meshParam_custom').removeClass('selected');
		$(this).addClass('selected');
	});


	$('body').on('click', '.setPosition', function(){
		var id = $(this).parents('.additionalObjectRow').data('object_id');
		moveToPoint(id);
	});

	$('body').on('click', '.setHolePos', function(){
		var id = $(this).parents('.additionalObjectRow').data('object_id');
		setToHole(id);
	});

	$('body').on('click', '.copyObject', function(){
		var id = $(this).parents('.additionalObjectRow').data('object_id');
		copyAdditionalObject(id);
	});

	// addContextMenu();

	$('body').on('click', '.editObject', function(){
		if (window.selectedObject) {
			AdditionalObject.selectIfItemIsChild(window.selectedObject);
			additionalObjectModalShow(window.selectedObject.objId);
		}
	})

	$('body').on('click', '.moveObject', function(){
		if (window.selectedObject) {
			AdditionalObject.selectIfItemIsChild(window.selectedObject);
			moveToPoint(window.selectedObject.objId);
		}
	})

	$('body').on('click', '.copyObjectContext', function(){
		if (window.selectedObject) {
			AdditionalObject.selectIfItemIsChild(window.selectedObject);
			copyAdditionalObject(window.selectedObject.objId);
		}
	})

	$('body').on('click', '.removeObject', function(){
		if (window.selectedObject) {
			AdditionalObject.selectIfItemIsChild(window.selectedObject);
			removeAdditionalItem(window.selectedObject.id);
		}
	})

	$('body').on('click', '.setObjectInHole', function(){
		if (window.selectedObject) {
			AdditionalObject.selectIfItemIsChild(window.selectedObject);
			setToHole(window.selectedObject.objId);
		}
	});

	$('body').on('click', '.additionalAction', function() {
		var func = $(this).data('function');
		if (window.selectedObject) {
			AdditionalObject.selectIfItemIsChild(window.selectedObject);
			if (window.selectedObject[func]) {
				window.selectedObject[func]();
			}
		}
	});
});

function copyAdditionalObject(id){
	var item = Object.assign({}, getAdditionalObject(id));
	item.meshParams = Object.assign({}, item.meshParams);
	item.position = Object.assign({}, item.position);
	item.id = getAdditionalObjectCurrentId();
	addAdditionalObjectTable(item);

	redrawAdditionalObjects();
}

function removeAdditionalItem(objId){
	if(!confirm("Удалить объект?")) return;
	$('additionalObjectRow[data-id="'+objId+'"').remove();
	var item = getAdditionalObject(objId);
	window.additional_objects.splice(window.additional_objects.indexOf(item), 1);
	redrawAdditionalObjects();
}

function addNotify(content, type, title){
	$("#notifyContent").html(content);
	$("#notifyToast").toast('show');
}

// function addContextMenu(){
// 	var text = "\
// 	<div class='dropdown-menu dropdown-menu-sm' id='additionalObjectContextMenu'>\
// 		<a class='dropdown-item editObject'>Редактировать</a>\
// 		<a class='dropdown-item moveObjectToPoint'>Вставить</a>\
// 		<a class='dropdown-item setObjectInHole'>Вставить в проем</a>\
// 		<div class='dropdown-actions'></div>\
// 	</div>";
// 	$('body').append(text);
// }


function setToHole(id){
	var result = prompt("Укажите ид проема");
	if ($('.ledgeParRow .row_id[data-id=' + result + ']').length > 0) {
		var item = getAdditionalObject(id);

		var wallLedgeWidth = $('#wallLedgeWidth' + result).val() * 1.0;
		var wallLedgeBaseWall = $('#wallLedgeBaseWall' + result).val() * 1.0;
		var wallLedgeType = $('#wallLedgeType' + result).val() * 1.0;
		var wallLedgeHeight = $('#wallLedgeHeight' + result).val() * 1.0;
		var wallLedgePosX = $('#wallLedgePosX' + result).val() * 1.0;
		var wallLedgePosY = $('#wallLedgePosY' + result).val() * 1.0;
		var wallLedgePosZ = $('#wallLedgePosZ' + result).val() * 1.0;
		var wallLedgeBase = $('#wallLedgeBase' + result).val();

		var wallPositionX = $("#wallPositionX_" + wallLedgeBaseWall).val() * 1.0;
		var wallPositionZ = $("#wallPositionZ_" + wallLedgeBaseWall).val() * 1.0;
		var wallThickness = $("#wallThickness_" + wallLedgeBaseWall).val() * 1.0;
		var wallLength = $("#wallLength_" + wallLedgeBaseWall).val() * 1.0;

		var turnSide = $("#turnSide").val();

		var pos = {x: 0, y: wallLedgePosY, z: 0};
		var rot = 0;

		if (wallLedgeBaseWall == 1) {
			if(turnSide == 'правое' && wallLedgeBase == 'left' || turnSide == 'левое' && wallLedgeBase == 'right') pos.x = wallPositionX + wallLedgePosX;
			if(turnSide == 'правое' && wallLedgeBase == 'right' || turnSide == 'левое' && wallLedgeBase == 'left') pos.x = wallPositionX + wallLength - wallLedgePosX - wallLedgeWidth;

			pos.z = wallPositionZ * turnFactor;
			rot = 0;

			if(turnSide == 'левое') {
				rot = 180;
				pos.x += wallLedgeWidth;
			}
		}
		if(wallLedgeBaseWall == 2){
			if(turnSide == 'правое' && wallLedgeBase == 'left' || turnSide == 'левое' && wallLedgeBase == 'right') pos.x = wallPositionX + wallLength - wallLedgePosX;
			if(turnSide == 'правое' && wallLedgeBase == 'right' || turnSide == 'левое' && wallLedgeBase == 'left') pos.x = wallPositionX + wallLedgePosX + wallLedgeWidth;

			pos.z = wallPositionZ * turnFactor + wallLedgePosZ;
			rot = 180;

			if(turnSide == 'левое') {
				rot = 0;
				pos.x -= wallLedgeWidth;
			}
		}
		if(wallLedgeBaseWall == 3){
			if(turnSide == 'правое' && wallLedgeBase == 'left') pos.z = wallPositionZ + wallLedgePosX * turnFactor;
			if(turnSide == 'правое' && wallLedgeBase == 'right') pos.z = wallPositionZ + (wallLength - wallLedgePosX - wallLedgeWidth);
			if(turnSide == 'левое' && wallLedgeBase == 'left') pos.z = -wallPositionZ - wallLength + wallLedgePosX;
			if(turnSide == 'левое' && wallLedgeBase == 'right') pos.z = -wallPositionZ - wallLedgePosX -wallLedgeWidth;

			pos.x = wallPositionX + wallLedgePosZ;
			rot = 270;
		}
		if(wallLedgeBaseWall == 4){
			if(turnSide == 'правое' && wallLedgeBase == 'left' || turnSide == 'левое' && wallLedgeBase == 'right') pos.z = wallPositionZ + (wallLength - wallLedgePosX) * turnFactor;
			if(turnSide == 'правое' && wallLedgeBase == 'right' || turnSide == 'левое' && wallLedgeBase == 'left') pos.z = wallPositionZ + (wallLedgePosX + wallLedgeWidth) * turnFactor;
			if(turnSide == 'левое') pos.z += wallLedgeWidth;

			pos.x = wallPositionX + wallLedgePosZ;
			rot = 90;
		}

		item.position.x = pos.x;
		item.position.y = pos.y;
		item.position.z = pos.z;
		item.rotation = rot;

		if (item.meshParams.width && item.meshParams.height) {
			item.meshParams.width = wallLedgeWidth;
			item.meshParams.height = wallLedgeHeight;
		}

		if (item.meshParams.wallThickness) item.meshParams.wallThickness = wallThickness;

		redrawAdditionalObjects();
	}
}

function getAdditionalObjectCurrentId(){
	var id = 1;
	if (window.service_data && window.additional_objects && window.additional_objects.length) {
		for (var i = 0; i < window.additional_objects.length; i++) {
			var obj = window.additional_objects[i];
			if (obj.id >= id) id = obj.id + 1;
		}
	}
	return id;
}

function addAdditionalObjectTable(par){
	console.log(par);
	if(!par) {
		par = {
			id: getAdditionalObjectCurrentId(),
			className: 'ConcretePlatform',
			meshParams: ConcretePlatform.getDefaults(),
			position: {
				x: 0,
				y: 1000,
				z: 0
			},
			rotation: 0,
			color: '#cccccc'
		};
	}

	if (!par.id && !par.position) return;

	var text = '\
		<tr class="additionalObjectRow" data-object_selector="additionalObjectRow" data-object_id='+ par.id +' data-id='+ par.id +'>\
			<td>\
				<select class="additionalObjectClass">';
				AdditionalObject.getAvailableClasses().forEach(function(c){
					text += '<option value="' + c.className + '">' + c.title + '</option>'
				});
		text+= '</select>\
			</td>\
			<td>\
				<div class="line">X: <input type="number" value="100" step="100" class="additionalObjectPosX"></div>\
				<div class="line">Y: <input type="number" value="0" step="100" class="additionalObjectPosY"></div>\
				<div class="line">Z: <input type="number" value="100" step="100" class="additionalObjectPosZ"></div>\
				<div class="line">Поворот: <input type="number" value="100" step="100" class="additionalObjectRot"></div>\
			</td>\
			<td><input class="additionalObjectColor" type="color" value="#cccccc"></td>\
			<td style="text-align: center;">\
				<button class="btn btn-outline-dark setHolePos" style="margin: 2px" data-toggle="tooltip" title="Вставить в проем" data-original-title="Вставить в проем">\
					<i class="fa fa-window-maximize actionIcon"></i>\
				</button>\
				<button class="btn btn-outline-dark copyObject" style="margin: 2px" data-toggle="tooltip" title="Копировать" data-original-title="Копировать">\
					<i class="fa fa-copy actionIcon"></i>\
				</button>\
				<button class="btn btn-outline-dark setPosition" style="margin: 2px" data-toggle="tooltip" title="Вставить" data-original-title="Вставить">\
					<i class="fa fa-arrows-alt actionIcon"></i>\
				</button>\
				<button class="btn btn-outline-dark additionalObjectPropertiesEdit" style="margin: 2px" data-toggle="tooltip" title="Редкатировать свойства" data-original-title="Редкатировать свойства">\
					<i class="fa fa-edit actionIcon"></i>\
				</button>\
				<button class="btn btn-outline-danger removeAdditionalItem" style="margin: 2px" data-toggle="tooltip" title="Удалить" data-original-title="Удалить">\
					<i class="fa fa-trash-o actionIcon"></i>\
				</button>\
			</td>\
			<td>\
				<input type="checkbox" class="additionalObjectCalcPrice">\
			</td>\
		</tr>\
	';

	if (!window.service_data) window.service_data = {};
	if (!window.additional_objects) window.additional_objects = [];
	if (window.additional_objects.indexOf(par) == -1) window.additional_objects.push(par);

	$('#objectsTableBody').append(text);
	var el = $('.additionalObjectRow[data-object_id="' + par.id +'"]');
	el.find('.additionalObjectPosX').val(par.position.x);
	el.find('.additionalObjectPosY').val(par.position.y);
	el.find('.additionalObjectPosZ').val(par.position.z);
	el.find('.additionalObjectRot').val(par.rotation);
	el.find('.additionalObjectClass').val(par.className);
	el.find('.additionalObjectColor').val(par.color);
	if(par.calc_price) el.find('.additionalObjectCalcPrice').attr('checked', true);


	return par.id;
}

function getAdditionalObject(id){
	if (!window.service_data || !window.additional_objects || window.additional_objects.length == 0) return null;
	return window.additional_objects.find(item => item.id == id);
}

function additionalObjectModalShow(id){
	var className = $(".additionalObjectRow[data-object_id=" + id + "] .additionalObjectClass").val();
	var itemMeta = eval(className + '.getMeta()');
	$('#additionalObjectTitle').html(itemMeta.title);
	$('#additionalObjectId').val(id);
	var text = "";
	var item = getAdditionalObject(id);
	if (!item) return;
	$.each(itemMeta.inputs, function(){
		text += '<div>';
		if (this.type == 'delimeter') {
			text += "<div style='margin: 15px;width: 100%;border: 1px solid gray;'></div>";
		}
		if (this.type == 'text') {
			text += this.title + ' <input class="meshParam" type="text" name="' + this.key + '" value="' + item.meshParams[this.key] + '">';
		}
		if (this.type == 'number') {
			text += this.title + ' <input class="meshParam" type="number" name="' + this.key + '" value="' + item.meshParams[this.key] + '">';
		}
		if (this.type == 'boolean') {
			text += this.title + ' <input class="meshParam" type="checkbox" name="' + this.key + '" ' + (item.meshParams[this.key] ? 'checked' : '') + '>';
		}
		if (this.type == 'select') {
			text += this.title + ' <select class="meshParam" name="' + this.key + '">';
			var key = this.key;
			this.values.forEach(function(value){
				text += '<option class="meshParam" value="' + value.value + '" ' + ((item.meshParams[key] == value.value) ? 'selected' : '') + ' >' + value.title + '</option>';
			});
			text += '</select>';
		}
		if (this.type == 'image') {
			text += this.title + ' <div class="meshParam meshParam_custom_parent imageSelector" name="' + this.key + '" type="custom_input">';
			var key = this.key;
			this.values.forEach(function(value){
				text += '<image width="64px" height="64px" style="margin: 5px;" class="meshParam_custom ' + ((item.meshParams[key] == value.value) ? 'selected' : '') + '" data-value="' + value.value + '" src="' + value.preview + '">';
			});
			text += '</div>';
		}
		text += '</div>';
	});
	$('#additionalObjectBody').html(text);

	$('#additionalObjectProperties').modal('show');
}
