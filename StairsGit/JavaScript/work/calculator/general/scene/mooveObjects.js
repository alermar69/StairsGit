var objectMovingId = false;
var objectMovingType = false;
var firstPointSelected = false;
var axisObject = null;

//функция перемещения объекта в заданную точку
function moveToPoint(id, type){
	if (!type) type = 'object';
	objectMovingId = id;
	objectMovingType = type;
	
	firstPointSelected = false;
	addNotify('Выберите базовую точку');
}


/**
 * Обрабатываем выбор точки
 */
function firstPointSelect(){
	window.firstPointSelected = true;
	if (objectMovingType != 'railing') {
		addNotify('Выберите вторую точку или выберите ось');
		var point = lastSelectedPoint;
		
		var geometry = new THREE.BoxGeometry(20, 20, 50);
		
		axisObject = new THREE.Object3D();
	
		var xAxis = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: "#FF0000"}));
		xAxis.position.x = point.x + 25;
		xAxis.position.y = point.y;
		xAxis.position.z = point.z;
		xAxis.isAxis = true;
		xAxis.rotation.y = Math.PI / 2;
		xAxis.axis = 'x';
		xAxis.factor = 1;
		xAxis.hoverable = true;
		axisObject.add(xAxis);
	
		var xAxis = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: "#FF0000"}));
		xAxis.position.x = point.x - 25;
		xAxis.position.y = point.y;
		xAxis.position.z = point.z;
		xAxis.isAxis = true;
		xAxis.rotation.y = Math.PI / 2;
		xAxis.axis = 'x';
		xAxis.factor = -1;
		xAxis.hoverable = true;
		axisObject.add(xAxis);
	
		var yAxis = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: "#00FF00"}));
		yAxis.position.x = point.x;
		yAxis.position.y = point.y + 25;
		yAxis.position.z = point.z;
		yAxis.rotation.x = Math.PI / 2;
		yAxis.isAxis = true;
		yAxis.axis = 'y';
		yAxis.factor = 1;
		yAxis.hoverable = true;
		axisObject.add(yAxis);
	
		var yAxis = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: "#00FF00"}));
		yAxis.position.x = point.x;
		yAxis.position.y = point.y - 25;
		yAxis.position.z = point.z;
		yAxis.rotation.x = Math.PI / 2;
		yAxis.isAxis = true;
		yAxis.axis = 'y';
		yAxis.factor = -1;
		yAxis.hoverable = true;
		axisObject.add(yAxis);
	
		var zAxis = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: "#0000FF"}));
		zAxis.position.x = point.x;
		zAxis.position.y = point.y;
		zAxis.position.z = point.z + 25;
		zAxis.isAxis = true;
		zAxis.axis = 'z';
		zAxis.factor = 1;
		zAxis.hoverable = true;
		axisObject.add(zAxis);
	
		var zAxis = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: "#0000FF"}));
		zAxis.position.x = point.x;
		zAxis.position.y = point.y;
		zAxis.position.z = point.z - 25;
		zAxis.isAxis = true;
		zAxis.axis = 'z';
		zAxis.factor = -1;
		zAxis.hoverable = true;
		axisObject.add(zAxis);
	
		view.scene.add(axisObject);
	}else{
		addNotify('Выберите вторую точку');
	}
}

/** перемещение объекта по выбранной оси
*/

function moveObjectByAxis(axis, factor){
	if (!window.objectMovingId || !window.firstPointSelected || !window.lastSelectedPoint1) {
		return;
	}
	
	var value = prompt('Введите на сколько переместить') * 1.0;
	console.log(value, axis)
	
	if (value && value > 0) {
		//перемещение доп. объекта
		if(window.objectMovingId && window.objectMovingType == 'object'){
			var item = getAdditionalObject(objectMovingId);
			item.position[axis] += value * (factor || 1);
			redrawAdditionalObjects();
		
			objectMovingId = false;		
		}
		if(window.objectMovingId && window.objectMovingType == 'stair'){
			var oldVal = $('#floorPos' + axis.toUpperCase()).val();
			$('#floorPos' + axis.toUpperCase()).val(oldVal * 1.0 + value * (factor || 1));
			recalculate();
		}
		// Перемещение бетон
		if (window.objectMovingId && window.objectMovingType == 'concrete') {
			var axisInputId = ""
			if(axis == "x") axisInputId = "posX" + (window.objectMovingId * 1.0 - 1);
			if(axis == "y") axisInputId = "posY" + (window.objectMovingId * 1.0 - 1);
			if(axis == "z") axisInputId = "posZ" + (window.objectMovingId * 1.0 - 1);
			if(axisInputId){
				var inputVal = $(".concreteParRow[data-id='"+objectMovingId+"'] #" + axisInputId).val() * 1.0;
				inputVal += value * (factor || 1);
				$(".concreteParRow[data-id='"+objectMovingId+"'] #" + axisInputId).val(inputVal);
				// recalculate();
				redrawConcrete();
			}
			objectMovingId = false;
		}
		//перемещение стены
		if(window.objectMovingId && window.objectMovingType == 'wall'){
			var axisInputId = ""
			if(axis == "x") axisInputId = "wallPositionX_" + window.objectMovingId;
			if(axis == "z") axisInputId = "wallPositionZ_" + window.objectMovingId
			if(axis == "y") alert("Перемещение стены по Y невозможно");
			if(axisInputId){
				var inputVal = $("#" + axisInputId).val() * 1.0;
				inputVal += value * (factor || 1);
				$("#" + axisInputId).val(inputVal);
				redrawWalls();
			}
			objectMovingId = false;		
		}
		//перемещение выступа
		if(window.objectMovingId && window.objectMovingType == 'ledge'){
			var axisInputId = "";
			var canMoove = true;
			if(axis == "x" || axis == "z") axisInputId = "wallLedgePosX" + window.objectMovingId;
			if(axis == "y") axisInputId = "wallLedgePosY" + window.objectMovingId;
			var ledgeWall = $("#wallLedgeBaseWall" + window.objectMovingId).val();
			if(axis == "x" && (ledgeWall == 3 || ledgeWall == 4)) canMoove = false;
			if(axis == "z" && (ledgeWall == 1 || ledgeWall == 2)) canMoove = false;
			if(canMoove){
				var inputVal = $("#" + axisInputId).val() * 1.0;
				var xFactor = factor;
				if ((ledgeWall == 2 || ledgeWall == 4) && axis != 'y') {
					xFactor *= -1;
				}

				if (turnFactor == -1 && axis != 'y') xFactor *= -1

				inputVal += value * (xFactor || 1);
				$("#" + axisInputId).val(inputVal);
				redrawWalls();
			}else{
				alert("Перемещение выступа по этой оси невозможно");
			}
			objectMovingId = false;
		}
		firstPointSelected = false;
		addNotify('Объект перемещен');
		view.scene.remove(axisObject);
	}
	else{
		
	}
	var evt = document.createEvent("MouseEvents");
	evt.initEvent("mouseup", true, true);
	document.getElementById("WebGL-output").dispatchEvent(evt);
}

function moveObjectTwoPoints(){
	if (!window.objectMovingId || !window.firstPointSelected || !window.lastSelectedPoint || !window.lastSelectedPoint1) {
		return;
	}
	
	//перемещение объекта
	if(window.objectMovingId && window.objectMovingType == 'object'){
		var item = getAdditionalObject(objectMovingId);

		var differenceX = item.position.x - lastSelectedPoint1.x;
		var differenceY = item.position.y - lastSelectedPoint1.y;
		var differencez = item.position.z - lastSelectedPoint1.z;

		var point = lastSelectedPoint; //глобавльная переменная из файла viewports
		item.position.x = (differenceX + point.x).toFixed(2) * 1.0;
		item.position.y = (differenceY + point.y).toFixed(2) * 1.0;
		item.position.z = (differencez + point.z).toFixed(2) * 1.0;

		redrawAdditionalObjects();

		objectMovingId = false;
	}

	//перемещение объекта
	if(window.objectMovingId && window.objectMovingType == 'stair'){
		var item = getAdditionalObject(objectMovingId);

		var differenceX = $('#floorPosX').val() * 1.0 - lastSelectedPoint1.x;
		var differenceY = $('#floorPosY').val() * 1.0 - lastSelectedPoint1.y;
		var differencez = $('#floorPosZ').val() * 1.0 - lastSelectedPoint1.z;

		var point = lastSelectedPoint; //глобавльная переменная из файла viewports
		$('#floorPosX').val((differenceX + point.x).toFixed(2));
		$('#floorPosY').val((differenceY + point.y).toFixed(2));
		$('#floorPosZ').val((differencez + point.z).toFixed(2));
		
		recalculate();

		objectMovingId = false;
	}
	
	// Перемещение бетон
	if (window.objectMovingId && window.objectMovingType == 'concrete') {
		var itemX = $(".concreteParRow[data-id='"+objectMovingId+"'] #posX" + (window.objectMovingId * 1.0 - 1)).val() * 1.0;
		var itemY = $(".concreteParRow[data-id='"+objectMovingId+"'] #posY" + (window.objectMovingId * 1.0 - 1)).val() * 1.0;
		var itemZ = $(".concreteParRow[data-id='"+objectMovingId+"'] #posZ" + (window.objectMovingId * 1.0 - 1)).val() * 1.0;

		var differenceX = itemX - lastSelectedPoint1.x;
		var differenceY = itemY - lastSelectedPoint1.y;
		var differencez = itemZ - lastSelectedPoint1.z;

		var point = lastSelectedPoint; //глобавльная переменная из файла viewports
		$(".concreteParRow[data-id='"+objectMovingId+"'] #posX" + (window.objectMovingId * 1.0 - 1)).val((differenceX + point.x).toFixed(2) * 1.0);
		$(".concreteParRow[data-id='"+objectMovingId+"'] #posY" + (window.objectMovingId * 1.0 - 1)).val((differenceY + point.y).toFixed(2) * 1.0);
		$(".concreteParRow[data-id='"+objectMovingId+"'] #posZ" + (window.objectMovingId * 1.0 - 1)).val((differencez + point.z).toFixed(2) * 1.0);

		// recalculate();
		redrawConcrete();
		objectMovingId = false;
	}

	//перемещение стены
	if(window.objectMovingId && window.objectMovingType == 'wall'){
		var wallPos = {
			x: params["wallPositionX_" + window.objectMovingId],
			z: params["wallPositionZ_" + window.objectMovingId],
		}
		
		var differenceX = wallPos.x - lastSelectedPoint1.x;
		var differencez = wallPos.z - lastSelectedPoint1.z;

		var point = lastSelectedPoint; //глобавльная переменная из файла viewports
		$("#wallPositionX_" + window.objectMovingId).val( (differenceX + point.x).toFixed(2) * 1.0);
		$("#wallPositionZ_" + window.objectMovingId).val( (differencez + point.z).toFixed(2) * 1.0);
		
		redrawWalls();
		
		objectMovingId = false;
	}

	//перемещение выступа
	if(window.objectMovingId && window.objectMovingType == 'ledge'){
		var ledgeWall = $("#wallLedgeBaseWall" + window.objectMovingId).val();

		var posX = $( "#wallLedgePosX" + window.objectMovingId).val() * 1.0;
		var posY = $( "#wallLedgePosY" + window.objectMovingId).val() * 1.0;
		if((ledgeWall == 3 || ledgeWall == 4)) posX += $("#wallPositionZ_" + ledgeWall).val() * 1.0;
		if((ledgeWall == 1 || ledgeWall == 2)) posX += $("#wallPositionX_" + ledgeWall).val() * 1.0;

		if((ledgeWall == 3 || ledgeWall == 4)) baseAxis = 'z';
		if((ledgeWall == 1 || ledgeWall == 2)) baseAxis = 'x';

		var differenceX = lastSelectedPoint[baseAxis] - lastSelectedPoint1[baseAxis];
		var differenceY = lastSelectedPoint.y - lastSelectedPoint1.y;

		if((ledgeWall == 4 || ledgeWall == 2)) differenceX *= -1;
		if ((ledgeWall == 1 || ledgeWall == 2) && turnFactor == -1) differenceX *= -1

		var point = lastSelectedPoint; //глобавльная переменная из файла viewports
		$("#wallLedgePosX" + window.objectMovingId).val( $( "#wallLedgePosX" + window.objectMovingId).val() * 1.0 + differenceX);
		$("#wallLedgePosY" + window.objectMovingId).val( $( "#wallLedgePosY" + window.objectMovingId).val() * 1.0 + differenceY);
		redrawWalls();

		objectMovingId = false;
	}

	if(window.objectMovingId && window.objectMovingType == 'railing'){
		// $("#drawRailingSect").click(function(){
		var el = $('.railingParRow[data-id="'+window.objectMovingId+'"]');
		var p1 = lastSelectedPoint1; //глобавльная переменная из файла viewports
		var p2 = lastSelectedPoint; //глобавльная переменная из файла viewports
		
		var height = p2.y - p1.y;
		var posAng = -Math.atan((p2.z - p1.z)/(p2.x - p1.x))
		if(p1.y > p2.y && p1.x > p2.x) posAng += Math.PI;
		if(Math.abs(posAng) < 0.0001) posAng = 0;
		
		var len = Math.sqrt((p2.z - p1.z) * (p2.z - p1.z) + (p2.x - p1.x) * (p2.x - p1.x));
		if(len == 0) {
			alertTrouble("Неверные точки. Не удалось построить секцию ограждения.");
			console.log(p1, p2)
			return;
		}
		var angle = 0;
		if(height != 0) angle = Math.atan(height / len);
		
		
		$(el).find("input.railingPosX").eq(0).val(p1.x)
		$(el).find("input.railingPosY").eq(0).val(p1.y)
		$(el).find("input.railingPosZ").eq(0).val(p1.z)
		$(el).find("input.railingPosAng").eq(0).val(posAng * 180 / Math.PI)
		
		$(el).find("input.len").eq(0).val(len)
		$(el).find("input.angle").eq(0).val(angle * 180 / Math.PI)

		recalculate();
	}
	firstPointSelected = false;
	addNotify('Объект перемещен');
	view.scene.remove(axisObject);
}