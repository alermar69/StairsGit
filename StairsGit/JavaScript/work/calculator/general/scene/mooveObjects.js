var objectMovingId = false;
var wallMovingId = false;
var firstPointSelected = false;
var axisObject = null;

//функция перемещения объекта в заданную точку
function moveToPoint(id, type){
	if(type == 'wall') {
		wallMovingId = id;
		objectMovingId = false;
	}
	else {
		wallMovingId = false;
		objectMovingId = id;
	}
	
	firstPointSelected = false;
	addNotify('Выберите базовую точку');
}


/**
 * Обрабатываем выбор точки
 */
function firstPointSelect(){
	window.firstPointSelected = true;
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
}

/** перемещение объекта по выбранной оси
*/

function moveObjectByAxis(axis, factor){
	if ((!window.objectMovingId && !window.wallMovingId) || !window.firstPointSelected || !window.lastSelectedPoint1) {
		return;
	}
	
	var value = prompt('Введите на сколько переместить') * 1.0;
	console.log(value, axis)
	
	if (value && value > 0) {
		//перемещение доп. объекта
		if(window.objectMovingId){
			var item = getAdditionalObject(objectMovingId);
			item.position[axis] += value * (factor || 1);
			redrawAdditionalObjects();
		
			objectMovingId = false;		
		}
		//перемещение стены
		if(window.wallMovingId){
			var axisInputId = ""
			if(axis == "x") axisInputId = "wallPositionX_" + window.wallMovingId;
			if(axis == "z") axisInputId = "wallPositionZ_" + window.wallMovingId
			if(axis == "y") alert("Перемещение стены по Y невозможно");
			if(axisInputId){
				var inputVal = $("#" + axisInputId).val() * 1.0;
				inputVal += value * (factor || 1);
				$("#" + axisInputId).val(inputVal);
				redrawWalls();
			}
			wallMovingId = false;		
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
	if ((!window.objectMovingId && !window.wallMovingId) || !window.firstPointSelected || !window.lastSelectedPoint || !window.lastSelectedPoint1) {
		return;
	}
	
	//перемещение объекта
	if(window.objectMovingId){
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
	
	//перемещение стены
	if(window.wallMovingId){
		var wallPos = {
			x: params["wallPositionX_" + window.wallMovingId],
			z: params["wallPositionZ_" + window.wallMovingId],
		}
		
		var differenceX = wallPos.x - lastSelectedPoint1.x;
		var differencez = wallPos.z - lastSelectedPoint1.z;

		var point = lastSelectedPoint; //глобавльная переменная из файла viewports
		$("#wallPositionX_" + window.wallMovingId).val( (differenceX + point.x).toFixed(2) * 1.0);
		$("#wallPositionZ_" + window.wallMovingId).val( (differencez + point.z).toFixed(2) * 1.0);
		
		redrawWalls();
		
		wallMovingId = false;
	}
	firstPointSelected = false;
	addNotify('Объект перемещен');
	view.scene.remove(axisObject);
}