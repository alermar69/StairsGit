var view = {};
var measure = [];
var hidenLayers = [];
var lastSelectedPoint = {x:0, y:0, z:0};
var lastSelectedPoint1 = {x:0, y:0, z:0};
// Создаем пустой объект, в последствии должен быть перезаписан, если этого не произошло, у нас проблема
var menu = {};

var selectedSpecObj = null;
var allSpecsShowed = false;
var cameraState = '';

$(function () {
	selectMaterial = new THREE.MeshLambertMaterial({ color: 0xFF00FF });

	// window.optionalDrawing = new OptionalDrawing();

	//заменяем библиотеку триангуляции
	THREE.Triangulation.setLibrary('earcut');

	//задаем параметры видового экрана

	var containerWidth = $('#WebGL-output').width();
	var containerHeight = $('#WebGL-output').height();

	view = {
		height: containerHeight,
		width: containerWidth,
		outputDivId: "WebGL-output",
	}

	$(".updateTextures").click(function () {
		// Обновляем состояние текстур
		textureManager.updateMaterials();
	})

	$('#objectContextMenu').contextmenu(function() {
		return false;
	});

	$('body').on('click', '.findInSpec', function(evt){
		if (window.selectedObject) {
			// window.selectedObject = selectSpecObj(window.selectedObject);
			showSpecInfo(window.selectedObject, evt);
		}
	})

	$('body').on('click', '.changeGeometry', function(evt){
		$("#shapeModifyModal").modal('show');
	});

	$('body').on('click', '.downloadDXF', function(){
		getSelectedObjectDxf();
	});

	$('body').on('click', '.deleteGeometryChange', function(evt){
		var obj = window.selectedObject;
		if ((!obj || !obj.modifyKey) && window.clickedObject && window.clickedObject.modifyKey) obj = clickedObject;
		if (obj) {
			var deleteIndexes = [];
			window.service_data.shapeChanges.forEach(function(modify, i){
				if (obj.modifyKey == modify.modifyKey) deleteIndexes.push(i);
			});
			deleteIndexes.forEach(function(i){
				window.service_data.shapeChanges.splice(i, 1);
			});
			if (obj.oldGeometry) {
				obj.geometry = obj.oldGeometry;
				delete obj.oldGeometry;
			}

			unselectAllObjects();
			$('#objectContextMenu').hide();
			// recalculate();
		}
	});

	//Обработчик кнопки отмена(возвращает сцену в нормальный вид)
	$('#resetSpecView').click(function () {
		unselectAllObjects();
		$('#selectedObjectInfo').hide();
	})

	//Обработчик кнопки показать все объекты
	$('#showAllObjects').click(function () {
		var specId = selectedObject.specId;
		if (specId) {
			var specObjects = [];
			allSpecsShowed = true;
			view.scene.traverse(function (node) {
				if (node.specId == specId) specObjects.push(node);
				if (node.material) {
					if (node.oldMaterial) {
						node.material = node.oldMaterial;
						delete node.oldMaterial
						node.oldMaterial = null;
					}
					if( node.material.transparentDefaultState == undefined) node.material.transparentDefaultState = !!node.material.transparent;
					if( node.material.opacityDefaultState == undefined) node.material.opacityDefaultState = node.material.opacity;

					node.material.transparent = true;
					node.material.opacity = 0.1;
				}
			});
			for (var i = 0; i < specObjects.length; i++) {
				var obj = specObjects[i];
				showSpecObject(obj, specId);
			}
		}
	});

	$('body').on('click', 'tr', function(evt){
		if (evt.altKey) {
			if ($(this).attr('data-id') && $(this).attr('data-object_selector')) {
				var id = $(this).attr('data-id');
				var selector = $(this).attr('data-object_selector');

				selectObjectByRow(selector, id);
			}
		}
	});

	var linesHidden = false;

	$(document).keydown(function (e) {
		if (e.altKey && typeof view.scene != 'undefined') {
			view.scene.traverse(function (node) {
				if (node instanceof THREE.LineSegments) {
					node.visible = false;
					linesHidden = true;
				}
			})
		}

		if (event.key == "Escape") {
			unselectObject();
			unselectAllObjects();
		}
	});

	$(document).keyup(function (e) {
		if (linesHidden) {
			view.scene.traverse(function (node) {
				if (node instanceof THREE.LineSegments) {
					node.visible = true;
					if (node.layerName && node.layerName.indexOf('_wf') !== -1 && menu[node.layerName.replace('_wf', '')] !== undefined) {
						node.visible = menu[node.layerName.replace('_wf', '')];
					}
				}
			})
		}
	});
});

function getSelectedObjectDxf(){
	var obj = window.selectedObject;
	if ((!obj || !obj.geometry) && window.clickedObject && window.clickedObject.geometry) obj = clickedObject;

	if (obj) {
		var shape = obj.geometry.parameters.shapes;
		console.log(shape);
		var extracted = shape.extractPoints();
		var points = extracted.shape;
		var d = points.reduce(function(acc, point, i) {
			point.y *= -1;
			acc += (i === 0) ?'M' : 'L';
			acc += point.x + ',' + point.y;
			return acc;
		}, '');
		
		initMakerJs(function(){
			var models = {};
			if (d) {
				console.log(i);
				models[i] = makerjs.importer.fromSVGPathData(d);
				models[i].layer = $(this).attr('data-layer');
			}
			var dxf = makerjs.exporter.toDXF({models: models});
			
			var byteCharacters = unicodeToWin1251_UrlEncoded(dxf);
			var byteArray = new Uint8Array(byteCharacters);
			
			var BB = window.Blob;
			var fileName = "draw.dxf";
			saveAs(
				new BB([byteArray], {type: "application/octet-stream"}), 
				fileName
			);
		});
	}
}

function addMeasurement(viewportId) {
	if (measure) removeObjects(viewportId, 'measure');

	measure = [];
	// measurement
	var threshold = 150;
	var fmin = false;
	var point_snap;

	var spStart, spEnd, sConnection;

	var sphereGeometry = new THREE.SphereGeometry(0.75, 32, 32);
	var sphereMaterial = new THREE.MeshBasicMaterial({
		color: 0xbb0000,
		flatShading: THREE.FlatShading
	});
	spStart = new THREE.Mesh(sphereGeometry, sphereMaterial);
	spEnd = new THREE.Mesh(sphereGeometry, sphereMaterial);
	spStart.position.set(100, 0, 0);
	spEnd.position.set(100, 500, 0);
	measure.push(spStart); // scene.add
	measure.push(spEnd); // scene.add

	var lc = new THREE.Color(0xff0000);
	var lineGeometry = new THREE.Geometry();
	lineGeometry.vertices.push(spStart.position.clone(), spEnd.position.clone());
	lineGeometry.colors.push(lc, lc, lc);
	var lineMaterial = new THREE.LineBasicMaterial({
		vertexColors: THREE.VertexColors
	});
	sConnection = new THREE.Line(lineGeometry, lineMaterial);
	measure.push(sConnection); // scene.add

	// snap sphere helper
	var sphereHelper = new THREE.Line(new THREE.SphereGeometry(1, 24, 24), new THREE.LineBasicMaterial({
		color: 0xffff00
	}));
	measure.push(sphereHelper); // scene.add

	addObjects(viewportId, measure, 'measure');

	spStart.visible = false;
	spEnd.visible = false;
	sConnection.visible = false;
	sphereHelper.visible = false;

	var nowStart = true;
	var newdiv1 = $("<div id='popuup_div' align='left' style='position:absolute;z-index:100;width:130px;height:88px;background-color:white;text-align:left;padding-left:9px;color:#000000;font: 16px Verdana, Arial, Helvetica, sans-serif;display:none;'></div>");
	$("body").append(newdiv1);
	var newdiv2 = $("<div id='popuup2_div' align='left' style='position:absolute;z-index:100;width:330px;height:28px;background-color:white;text-align:left;padding-left:9px;color:#000000;font: 18px Verdana, Arial, Helvetica, sans-serif;display:none;'></div>");
	$("body").append(newdiv2);

	var canvas = view.renderer.domElement;

	function onDocumentMouseDown(evt) {

		//Чистим правое меню
		$('#objectContextMenu').hide();
		if (window.rightClickObject) window.rightClickObject = null;

		var raycaster = new THREE.Raycaster();
		window.raycaster = raycaster;
		var mouse = new THREE.Vector2();
		var BB = canvas.getBoundingClientRect();
		mouse.x = ((evt.clientX - BB.left) / canvas.clientWidth) * 2 - 1;
		mouse.y = -((evt.clientY - BB.top) / canvas.clientHeight) * 2 + 1;

		raycaster.setFromCamera(mouse, view.camera);
		var intersects = raycaster.intersectObjects(view.scene.children, true);

		spStart.visible = false;
		spEnd.visible = false;
		sConnection.visible = false;
		sphereHelper.visible = false;

		if (!window.objectMovingId) {
			$('#selectedObjectInfo').hide();
			$('#popuup_div').stop(true, true).hide();
			$('#popuup2_div').stop(true, true).hide();
			// if ((!evt.ctrlKey && !params.customersDimensions) || evt.which !== 1) return;
		}

		if (window.objectMovingId && window.firstPointSelected) {
			var selectedAxis = intersects.find(function(intersect){
				return intersect.object && intersect.object.isAxis;
			});
			if (selectedAxis) {
				var obj = selectedAxis.object;				
				moveObjectByAxis(obj.axis, obj.factor);
			}
		}
		if (intersects.length > 0) {
			var object = intersects[0].object;
			if (object) {
				if (evt.altKey) {
					if(event.button == 0) selectObject(object);
					if(event.button == 2 && selectedObject) {
						var top = event.pageY - 100;
						var left = event.pageX - 90;
						$("#objectContextMenu").css({
							display: "block",
							position: 'absolute',
							top: top,
							left: left
						}).addClass("show");
						// rightClickObject = object;
						$('#objectContextMenu').html("");
						$('#objectContextMenu').append("<a class='dropdown-item findInSpec'>Инфо</a>");
						if (selectedObject.geometry || clickedObject.geometry) {
							$('#objectContextMenu').append("<a class='dropdown-item downloadDXF'>Скачать DXF</a>");
						}
						var obj = window.selectedObject;
						if ((!obj || !obj.modifyKey) && window.clickedObject && window.clickedObject.modifyKey) obj = clickedObject;

						if (obj.modifyKey) {
							if (!obj.oldGeometry) {
								$('#objectContextMenu').append("<a class='dropdown-item changeGeometry'>Изменить геометрию</a>");
							}else{
								$('#objectContextMenu').append("<a class='dropdown-item deleteGeometryChange'>Отменить изменения</a>");
							}
						}
						if (typeof AdditionalObject == 'function') AdditionalObject.onClick(selectedObject, evt);
					}
				}
		
				if (evt.ctrlKey) {
					sphereHelper.visible = false;
					spStart.visible = true;
					spEnd.visible = true;
					sConnection.visible = true;
					if (params.calcType == "coupe" && typeof onObjSelection == "function") {
						var object = intersects[0].object;
						onObjSelection(object);
					}
		
					if (fmin) {
						var Ipoint = sphereHelper.position;
						//сохраняем точку Ipoint в глобальную переменную
						lastSelectedPoint1 = copyPoint(lastSelectedPoint);
						lastSelectedPoint = copyPoint(Ipoint);
		
						if (nowStart) {
							spStart.position.x = Ipoint.x;
							spStart.position.y = Ipoint.y;
							spStart.position.z = Ipoint.z;
							nowStart = false;
						} else {
							spEnd.position.x = Ipoint.x;
							spEnd.position.y = Ipoint.y;
							spEnd.position.z = Ipoint.z;
							nowStart = true;
						}
		
						sConnection.geometry.vertices[0].copy(spStart.position);
						sConnection.geometry.vertices[1].copy(spEnd.position);
						sConnection.geometry.verticesNeedUpdate = true;
						sConnection.geometry.computeBoundingSphere();
						
						//перемещение объекта или стены
						if (window.objectMovingId) {
							if (!window.firstPointSelected) {
								firstPointSelect();
								return;
							}
							
							if (window.firstPointSelected) {
								moveObjectTwoPoints();
								return;
							}
						}
						
					}
		
					// placing distance label
					if (!window.objectMovingId) {
						var labelPos = spStart.position.clone().add(spEnd.position).multiplyScalar(0.5);
						var distance = spStart.position.distanceTo(spEnd.position);
						var lblDistance = document.getElementById("popuup_div");
						$('#popuup_div').stop(true, true).css({
							left: Math.round(evt.pageX + 20),
							top: Math.round(evt.pageY)
						}).show();
						lblDistance.innerHTML = '&#x1D6AB;x: ' + Math.abs(spStart.position.x - spEnd.position.x).toFixed(1) +
							'<br/>&#x1D6AB;y: ' + Math.abs(spStart.position.y - spEnd.position.y).toFixed(1) +
							'<br/>&#x1D6AB;z: ' + Math.abs(spStart.position.z - spEnd.position.z).toFixed(1) +
							'<br/>dist: ' + distance.toFixed(2);
					}
				}
			}
		}
	}

	function onDocumentMouseMove(evt) {
		try {
			if (evt.altKey || evt.ctrlKey || window.objectMovingId) {
				var raycaster = new THREE.Raycaster();
				
				var mouse = {};
				const rect = canvas.getBoundingClientRect();
				const pos = {
					x: event.clientX - rect.left,
					y: event.clientY - rect.top,
				};
				mouse.x = (pos.x / canvas.clientWidth) * 2 - 1;
				mouse.y = (pos.y / canvas.clientHeight) * -2 + 1; // note we flip Y
	
				raycaster.setFromCamera(mouse, view.camera);
	
				var intersects = raycaster.intersectObjects(view.scene.children, true);
	
				if ((!intersects || intersects.length == 0) && hovered){
					hovered.material.color = hovered.material.oldColor;
					hovered.material.oldColor = undefined;
					// hovered.onUnHover({});
				}
				if (intersects.length > 0) {
	
					var intersect = intersects[0];
					var point = intersect.point;
					var object = intersect.object;
					var distance;
					// if (typeof AdditionalObject == 'function') AdditionalObject.onHover(object, evt);
					if (object.hoverable) {
						if (hovered) {
							hovered.material.color = hovered.material.oldColor;
							hovered.material.oldColor = undefined;
						}
						object.material.oldColor = object.material.color;
						object.material.color = new THREE.Color(0,155,155);
						hovered = object;
					}
	
					canvas.style.cursor = 'auto';
					if (!evt.ctrlKey && !params.customersDimensions) return;
	
					if (object.layerName == "measure") return;
					// to skip
					for (var i = 0, il = intersects.length; i < il; i++) {
						intersect = intersects[i];
						object = intersect.object;
						if (object.layerName !== "wireframes") break;
					}
					if (object.layerName === "wireframes") return;
	
					object.updateMatrixWorld();
					point = intersect.point;
					var points = object.geometry.vertices;
					if (points === undefined) return;
					//object.material.transparent = true;
					//object.material.opacity = 0.3;
					//object.material.needsUpdate = true;
	
					point_snap = {
						x: 0,
						y: 0,
						z: 0
					};
					fmin = false;
					var mindistance = threshold;
					for (var i = 0, il = points.length; i < il; i++) {
						var pt = points[i].clone();
						object.localToWorld(pt);
						distance = pt.distanceTo(point);
						if (distance < mindistance) {
							point_snap.x = pt.x;
							point_snap.y = pt.y;
							point_snap.z = pt.z;
							mindistance = distance;
							fmin = true;
						}
					}
					if (fmin) {
						var dia = view.camera.position.distanceTo(point_snap) / 300;
						sphereHelper.scale.x = sphereHelper.scale.y = sphereHelper.scale.z = dia;
						sphereHelper.position.copy(point_snap);
						sphereHelper.visible = true;
						canvas.style.cursor = 'pointer';
					} else {
						sphereHelper.visible = false;
						canvas.style.cursor = 'auto'; //'no-drop';
					}
				}
			}
		} catch (ex) {
			console.log(ex);
		}
	}

	// document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	// document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	$("#WebGL-output").unbind('mousedown');
	$("#WebGL-output").unbind('mousemove');
	$("#WebGL-output").bind("mousedown", onDocumentMouseDown)
	$("#WebGL-output").bind("mousemove", onDocumentMouseMove)

}

function findIntersects(scene, viewportId, onFinish) {
	function showEdge(obj) {
		var geo = new THREE.EdgesGeometry(obj.geometry); // or WireframeGeometry
		var wireframe = new THREE.LineSegments(geo, intersectsMaterial2);
		var vector = new THREE.Vector3();
		vector.setFromMatrixPosition(obj.matrixWorld);
		wireframe.position.set(vector.x, vector.y, vector.z);
		var quaternion = new THREE.Quaternion();
		obj.getWorldQuaternion(quaternion);
		wireframe.quaternion.copy(quaternion);
		addObjects(viewportId, wireframe, "wireframesinter");
	}
	function nname(obj) {
		var name = obj.layerName;
		if (obj.layerName === '' && !!obj.parent) name = nname(obj.parent);
		return name;
	}
	function isVisible(obj) {
		if ((obj.visible || obj.visible === undefined) && !!obj.parent) return isVisible(obj.parent);
		else return obj.visible === undefined ? true : obj.visible;
	}
	//функция поиска пересечений ограничивающих параллелограммов
	function isBoxIntercection(box1, box2) {
		var tolerance = 0.01; //допуск для учета погрешности округления чисел
		var intercect = {
			x: true,
			y: true,
			z: true,
		}

		for (var axis in intercect) {
			//первый правее второго
			if (box1.min[axis] - box2.max[axis] >= -tolerance) intercect[axis] = false;
			//второй правее первого
			if (box2.min[axis] - box1.max[axis] >= -tolerance) intercect[axis] = false;
		}
		var result = intercect.x && intercect.y && intercect.z;
		return result;
	}
	function collectObj(obj) {
		if (obj.name.indexOf("stl") != -1) return;
		if (!!obj.geometry && isVisible(obj) && obj.type !== 'LineSegments') {
			if (!!obj.parent) {
				var nnn = nname(obj);
				obj.updateMatrixWorld();
				THREE.SceneUtils.detach(obj, obj.parent, scene);
				obj.layerName = nnn;
			}

			var geometryCsg = new ThreeBSP(obj);
			var knotBBox = new THREE.Box3().setFromObject(obj);
			st.push(0);
			prevobjs.push(obj);
			prevobjsBBox.push(knotBBox);
			prevobjsBSP.push(geometryCsg);
		} else {
			for (var co = obj.children.length - 1; co > -1; co--) {
				collectObj(obj.children[co]);
			}
		}
	}
	function findIntersectsObj2(co) {
		clearTimeout(st[co]);
		if (co > 0) {
			$('#popuup2_div').stop(true, true).css({
				left: canvasPosition.left + 30,
				top: canvasPosition.top + canvas.height - 30,
			}).show();
			lblInters.innerHTML = 'Проверено объектов ' + (objslength - co) + ' из ' + objslength;

			st[co - 1] = setTimeout(function run() {
				findIntersectsObj2(co - 1);
			}, 5);
		} else {
			//addObjects(viewportId, wireframesinter, 'wireframesinter');

			$('#popuup2_div').stop(true, true).css({
				left: canvasPosition.left + 30,
				top: canvasPosition.top + canvas.height - 30,
			}).show();
			lblInters.innerHTML = 'Найдено пересечений, всего: ' + counts;

			//выводим данные для отчета
			var isTestOk = false;
			$(".testInfo").last().append("<span class='testInfo'>Найдено пересечений: " + counts + "</span><br/>");
			if (boltDiam < 13) {
				if (counts == 0) isTestOk = true;
			}
			if (boltDiam > 13) {
				if (counts == partsAmt.bolt.amt * 2) isTestOk = true;
			}


			if (isTestOk) $("#testResults").append("<span style='color: green;'>ОК</span><br/>");
			if (!isTestOk) {
				$("#testResults").append("<span style='color: red;'>НЕ ПРОЙДЕН</span><br/>");
			}

			submitTesting(isTestOk);

			if (onFinish) {
				onFinish(counts);
			}

			return;
		}

		var knotBBox = prevobjsBBox[co];
		for (var i = co - 1; i > -1; i--) {
			var knotBBox2 = prevobjsBBox[i];

			if (isBoxIntercection(knotBBox, knotBBox2)) {
				try {
					var res = prevobjsBSP[co].intersect(prevobjsBSP[i]);
					var mesh = res.toMesh();
					var bres = new THREE.Box3().setFromObject(mesh);
					if (!bres.isEmpty()) {
						showEdge(prevobjs[co]);
						showEdge(prevobjs[i]);
						counts++;
					}
				} catch (ex) {
					console.log('err\n');
					console.log(ex);
				}
			}
		}
	}

	var intersectsMaterial2 = new MeshLineMaterial({
		color: new THREE.Color(0xff0000),
		lineWidth: 3,
		sizeAttenuation: 1
	});

	var counts = 0;

	removeObjects(viewportId, 'wireframesinter');

	var st = [];
	var prevobjs = [];
	var prevobjsBBox = [];
	var prevobjsBSP = [];

	var lblInters = document.getElementById("popuup2_div");
	var canvas = view.renderer.domElement;
	var canvasPosition = $(canvas).position();

	collectObj(scene);
	var objslength = prevobjs.length;
	findIntersectsObj2(prevobjs.length - 1);

}

//Показывает информацию о объекте
function showSpecInfo(selectedObj, e) {
	$('#objectContextMenu').hide();
	$('#selectedObjectInfo').show();
	$('#selectedObjectInfo').css({
		left: Math.round(e.pageX + 20),
		top: Math.round(e.pageY - $('#selectedObjectInfo').height()),
		position: 'absolute'
	});
	if (selectedObj && selectedObj.specId) {
		var specElem = findInSpec(selectedObj.specId);
		if (specElem) {
			$('#selectedObjectInfo .object-info').html("Артикул: " + selectedObj.specId + "<br>" + "Имя: " + specElem.name + "<br>" + "Количество: " + specElem.amt);
		} else {
			var parts = createPartsList();
			$('#selectedObjectInfo .object-info').html("Артикул: " + selectedObj.specId);
			if (parts[selectedObj.specId]) {
				$('#selectedObjectInfo .object-info').html("Артикул: " + selectedObj.specId + " Имя: " + parts[selectedObj.specId].name);
			} else {}
		}
		$('#showAllObjects').show();
	} else {
		$('#selectedObjectInfo .object-info').html("Этому объекту артикул не присвоен")
		$('#showAllObjects').hide();
	}
}

// Убирает выделение с объекта
// function unselectSpecObj() {
// 	if (selectedSpecObj && selectedSpecObj.traverse) {
// 		selectedSpecObj.traverse(function (node) {
// 			if (node.material instanceof THREE.Material && node.oldMaterial instanceof THREE.Material) {
// 				node.material = node.oldMaterial;
// 				delete node.oldMaterial;
// 			}
// 		});
// 	}
// 	selectedSpecObj = null;
// }

function selectObjectByRow(rowClass, rowId){
	view.scene.traverse(function(node){
		if (node.objectRowClass == rowClass  && node.objectRowId == rowId) {
			selectObject(node);
		}
	})
}

var selectedObject = null
var clickedObject = null
/**
 * Функция выделяет объект либо по specId либо по нажатой строке, либо из raycaster
 * @param object - выделяемый объект
 */
function selectObject(object){
	console.log(object)
	if (selectedObject) unselectObject();
	selectedObject = findNearestObject3D(object);
	clickedObject = object;
	if (selectedObject) {
		selectedObject.traverse(function (node) {
			// Если не линии, есть материал, нету предыдущего материала(oldMaterial)(туда убирается актуальный если есть выделение) и если включено выделение(только для доп объектов)
			if (node.type != "LineSegments" && node.material && !node.oldMaterial && ((selectedObject.objectRowClass == 'additionalObjectRow' && !window.objectSelectionHidden) || selectedObject.objectRowClass != 'additionalObjectRow')) {
				node.oldMaterial = node.material;
				node.material = selectMaterial;
			}

			if (node.material == selectMaterial && selectedObject.objectRowClass == 'additionalObjectRow' && window.objectSelectionHidden) {
				node.material = node.oldMaterial;
				delete node.oldMaterial;
				node.oldMaterial = null;
			}
		});

		if (selectedObject.objectRowClass && (selectedObject.objectRowId != undefined)) {
			$('.' + selectedObject.objectRowClass).removeClass('selected');
			$('.' + selectedObject.objectRowClass + '[data-id="' + selectedObject.objectRowId + '"').addClass('selected');
		}else{
			if (selectedObject.specId) {
				$('.specRow').removeClass('selected');
				$('.specRow[data-articul="' + selectedObject.specId + '"').addClass('selected');
			}
		}

		if (selectedObject.objectRowClass == 'additionalObjectRow' && window.additionalObjectParamsShow) {
			additionalObjectParamsShow(selectedObject.objectRowId);
		}
	}
}

function findNearestObject3D(object){
	if (object.specId || object.objectRowClass && (object.objectRowId != undefined) || !object.parent) {
		if (object == view.scene) {
			return null
		}else{
			return object;
		}
	}else{
		return findNearestObject3D(object.parent);
	}
}

function unselectObject(){
	if (selectedObject && selectedObject.traverse) {
		selectedObject.traverse(function (node) {
			if (node.material instanceof THREE.Material && node.oldMaterial instanceof THREE.Material) {
				node.material = node.oldMaterial;
				delete node.oldMaterial;
				node.oldMaterial = null;
			}
		});
	}
	selectedObject = null;
	clickedObject = null;
}

function unselectAllObjects(){
	if (window.view && view.scene) {
		view.scene.traverse(function (node) {
			if (node.material) {
				if (node.oldMaterial) {
					node.material = node.oldMaterial;
					delete node.oldMaterial;
					node.oldMaterial = null;
				}
	
				if (node.material.transparentDefaultState != undefined) node.material.transparent = node.material.transparentDefaultState
				if (node.material.opacityDefaultState != undefined) node.material.opacity = node.material.opacityDefaultState;
				node.material.transparentDefaultState = node.material.opacityDefaultState = undefined;
			}
			// if (node.objectRowClass) $('.' + node.objectRowClass).removeClass('selected');
		});
		// $('.specRow').removeClass('selected');
		// if (window.additionalObjectParamsShow) additionalObjectParamsShow(0);
		allSpecsShowed = false;
	}
}

// Применяет материал выделения к объекту исключая те дочерние объекты у которых есть свой specId
function showSpecObject(object, specId) {
	object.specIdTraverse(specId, function (node) {
		if ((!node.specId || node == object) && node.type != "LineSegments" && node.material && !node.oldMaterial) {
			node.oldMaterial = node.material;
			node.material = selectMaterial;
		}
	});
}

function addObjects(viewportId, objectsArr, layerName) {
	if (!Array.isArray(objectsArr)) objectsArr = [objectsArr];

	//игнорируемые слои для теста
	if (hidenLayers.indexOf(layerName) != -1) return;


	//добавляем объекты в сцену
	layerName = layerName || 'nonameLayer';

	$.each(objectsArr, function () {

		this.setLayer(layerName, false);

		//добавляем ребра
		if (layerName != "measure" && layerName != "dimensions") {
			// addWareframe(this);
			addWareframe(this, this);
		}

		view.scene.add(this);

	});
	if (!menu[layerName]) {
		var objects = view.scene.getObjectsByLayerName(layerName);
		objects.setVisible(false);
	}

	// updateGUI();
}

function removeObjects(viewportId, layerName) {
	//удаляем объекты из сцены
	var removeObjects = [];
	view.scene.traverse(function (node) {
		if (node.layerName == layerName || node.layerName == layerName + "_wf") {
			removeObjects.push(node);
		}
	});
	removeObjects.forEach(function (node) {
		view.scene.remove(node);
		if (node.parent) node.parent.remove(node);
		disposeObjects(node);
		delete node;
	});
}

function disposeObjects(obj) {
	if (obj !== null) {
		for (var i = 0; i < obj.children.length; i++) {
			disposeObjects(obj.children[i]);
		}
		if (obj.geometry) {
			obj.geometry.dispose();
			obj.geometry = undefined;
		}
		if (obj.material) {
			if (obj.material.map) {
				if (obj.material.map.dispose) {
					obj.material.map.dispose();
				} else {
					delete obj.material.map
				}
				// obj.material.map = undefined;
			}
			if (obj.material.dispose) {
				obj.material.dispose();
			} else {
				delete obj.material
			}
			obj.material = undefined;
		}
	}
	obj = undefined;
};

// В качестве заглушки
function addLayer(layerName, title) {
	if (window.menu) {
		window.menu.addLayer({layerName: layerName, title: title})
	}
}

function addFloorPlane(viewportId, isVisible) {
	isVisible = isVisible || false;
	var floorThk = params.floorThickness - params.floorOffsetBot;
	if(!floorThk) floorThk = 200;
	drawFloorPlane(floorThk, params.floorOffsetBot, isVisible, viewportId, 0xaaaaaa);
	if (params.floorOffsetBot > 0) {
		drawFloorPlane(params.floorOffsetBot, 0, isVisible, viewportId, 0xcccccc);
	}

}

function drawFloorPlane(thickness, offsetY, isVisible, viewportId, color) {

	var mat = params.materials.floor;

	var planeGeometry = new THREE.CubeGeometry(20000, thickness, 20000);

	var plane = new THREE.Mesh(planeGeometry, mat);
	plane.receiveShadow = true;
	plane.position.set(0, -thickness / 2 - offsetY, 0);
	plane.visible = isVisible;
	plane.layerName = "floorBottom";
	var floorBSP = new ThreeBSP(plane);

	menu.floorBottom = isVisible;
	var floorObj = new THREE.Object3D();

	$(".ledgeParRow").each(function (i) {
		if ($(this).find(".wallLedgeBaseWall").val() == "нижнее") {
			var wallLedgeWidth = $(this).find(".wallLedgeWidth").val()
			var wallLedgeHeight = $(this).find(".wallLedgeHeight").val()
			var wallLedgeDepth = $(this).find(".wallLedgeDepth").val()
			var wallLedgeType = $(this).find(".wallLedgeType").val()
			var wallLedgePosX = $(this).find(".wallLedgePosX").val()
			var wallLedgePosY = $(this).find(".wallLedgePosY").val()
			var wallLedgePosZ = $(this).find(".wallLedgePosZ").val()

			geometry = new THREE.CubeGeometry(wallLedgeWidth, wallLedgeHeight, wallLedgeDepth),
				ledge = new THREE.Mesh(geometry, mat);

			ledge.position.x = wallLedgeWidth / 2 + wallLedgePosX * 1.0;
			ledge.position.y = wallLedgeHeight / 2 + wallLedgePosY * 1.0;
			ledge.position.z = wallLedgeDepth / 2 + wallLedgePosZ * 1.0;
			ledge.layerName = "floorBottom";

			if (wallLedgeWidth > 0 && wallLedgeHeight > 0 && wallLedgeDepth > 0) {
				if (wallLedgeType == "выступ") {
					ledge.position.y = wallLedgeHeight / 2;
					ledge.userData = {
						id: i,
						isLedge: true,
					}
					floorObj.add(ledge);
				}
				if (wallLedgeType == "проем") {
					ledge.position.y = -wallLedgeHeight / 2;
					var ledgeBSP = new ThreeBSP(ledge);
					floorBSP = floorBSP.subtract(ledgeBSP);
				}
			}

		}
	})

	var floor = floorBSP.toMesh();
	floor.userData.isFloor = true;
	floor.material = mat;
	floor.geometry.computeVertexNormals();

	floorObj.add(floor)
	addObjects(viewportId, floorObj, 'floorBottom');

}

function _addWalls(viewportId, turnFactor) {

	for (var i = 1; i < 5; i++) {
		//текущая стена
		var length = $('#wallLength_' + i).val() * 1.0;
		var height = $('#wallHeight_' + i).val() * 1.0;
		var thickness = $('#wallThickness_' + i).val() * 1.0;

		if (length && height && thickness) {
			var positionX = $('#wallPositionX_' + i).val() * 1 + (i > 2 ? 0 : length / 2) + (i == 4 ? -thickness / 2 : i == 3 ? thickness / 2 : 0);
			var positionZ = $('#wallPositionZ_' + i).val() * 1 + (i > 2 ? length / 2 : thickness / 2 * (i == 1 ? -1 : 1));

			var wallGeometry = new THREE.CubeGeometry(length, height, thickness);
			var wall = new THREE.Mesh(wallGeometry, params.materials.wall);
			wall.userData.isWall = true;
			var wallMesh =  addLedges(wall, i);
			wallMesh.position.set(positionX, height / 2, positionZ * turnFactor);
			wallMesh.rotation.y = i == 3 ? 1.5 * Math.PI : i == 4 ? 0.5 * Math.PI : i == 2 ? Math.PI : 0;
			if ($("#turnSide").val() == 'левое' && (i == 1 || i == 2)) wallMesh.rotation.y -= Math.PI;
			
			wallMesh.objectRowClass = 'wallRow';
			wallMesh.objectRowId = i;
			addObjects(viewportId, wallMesh, wallMesh.layerName);
			// Обновляем состояние для объекта
			menu['wall' + i] = menu['wall' + i];
		}
	}
}

function addWalls(viewportId, isVisible) {
	isVisible = isVisible || false;
	var wall, length, height, positionX, positionY, positionZ, thickness, turnSide, turnFactor;
	var turnSide = $("#turnSide").val();
	var turnFactor = turnSide == "правое" ? 1 : turnSide == "левое" ? -1 : 1;
	//создаем стены
	//1 - дальняя, 2 - ближняя, 3 - правая, 4 - левая
	menu.wall1 = isVisible;
	menu.wall2 = isVisible;
	menu.wall3 = isVisible;
	menu.wall4 = isVisible;

	_addWalls(viewportId, turnFactor);
}

function redrawWalls() {
	var turnSide = $("#turnSide").val();
	var turnFactor = turnSide == "правое" ? 1 : turnSide == "левое" ? -1 : 1;

	var k = 'vl_1';
	//перебираем выдовые экраны
	var obj, objWf;
	//удаляем стены
	var find = false; //есть стены на сцене
	for (var i = 1; i < 5; i++) {
		obj = view.scene.getObjectByLayerName('wall' + i);
		if (obj) {
			find = true;
			view.scene.remove(obj);
			obj = null;
		}
		//белые ребра
		objWf = view.scene.getObjectByLayerName('wall' + i + '_wf'); //ребра
		if (objWf) {
			view.scene.remove(objWf);
			objWf = null;
		}
	}

	_addWalls(k, turnFactor);

	//перерисовываем нижнее перекрытие

	removeObjects(k, 'floorBottom');
	addFloorPlane(k, true);
}

function hideWalls() {
	var obj, objWf;
	//скрываем стены
	for (var i = 1; i < 5; i++) {
		//сами стены
		obj = view.scene.getObjectByLayerName('wall' + i);
		if (obj) obj.visible = false;

		//белые ребра
		objWf = view.scene.getObjectByLayerName('wall' + i + '_wf'); //ребра
		if (obj) obj.visible = false;
	}
	//нижнее перекрытие
	obj = view.scene.getObjectByLayerName("floorBottom");
	if (obj) obj.visible = false;

	//верхнее перекрытие
	obj = view.scene.getObjectByLayerName("topFloor");
	if (obj) obj.visible = false;
}

function addLedges(wall, n){
	//найдем выступы, для этой стены
	var wallLedgeWidths = $('#wallLedgesTable [id^=wallLedgeBaseWall]').filter(function () {
		return this.value == n;
	});
	var complexWall = new THREE.Object3D();
	
	//если есть выступы для этой стены
	if (wallLedgeWidths.length) {
		var x = wall.position.x;
		var y = wall.position.y;
		var z = wall.position.z;
		var w = wall.geometry.parameters.width;
		var h = wall.geometry.parameters.height;
		var d = wall.geometry.parameters.depth;
		var wallBSP = new ThreeBSP(wall);

		wallLedgeWidths.each(function (_i, val) {
			//узнаем Id текущих элементов
			var i = val.id.slice(val.id.indexOf("Wall") + 4);
			var wallLedgeWidth = $('#wallLedgeWidth' + i).val(),
				wallLedgeType = $('#wallLedgeType' + i).val(),
				wallLedgeHeight = $('#wallLedgeHeight' + i).val(),
				wallLedgeDepth = $('#wallLedgeDepth' + i).val(),
				wallLedgePosX = $('#wallLedgePosX' + i).val(),
				wallLedgePosY = $('#wallLedgePosY' + i).val(),
				wallLedgePosZ = $('#wallLedgePosZ' + i).val(),
				wallLedgeRotY = $('#wallLedgeRotY' + i).val(),
				wallLedgeRotZ = $('#wallLedgeRotZ' + i).val(),
				wallLedgeBase = $('#wallLedgeBase' + i).val();
			
		
		//if (wallLedgeType == 'проем') wallLedgeDepth = d; //проем на всю глубину стены
			
			var geometry = new THREE.CubeGeometry(wallLedgeWidth, wallLedgeHeight, wallLedgeDepth),
				ledge = new THREE.Mesh(geometry, params.materials.wall);
				ledge.objectRowClass = 'ledgeParRow';
				ledge.objectRowId = i;

			if (wallLedgeType == 'проем') {
				ledge.material = ledge.material.clone();
				ledge.material.transparent = true;
				ledge.material.opacity = 0;
				ledge.noWireFrames = true;
			};

			if (wallLedgeWidth > 0 && wallLedgeHeight > 0) {
				ledge.position.x = x - w / 2 + wallLedgeWidth / 2 + wallLedgePosX * 1;

				if (wallLedgeBase == 'right') ledge.position.x = x + w / 2 - wallLedgeWidth / 2 - wallLedgePosX * 1;

				ledge.position.y = y - h / 2 + wallLedgeHeight / 2 + wallLedgePosY * 1;
				ledge.position.z = z + d / 2 + wallLedgeDepth / 2;
				if (wallLedgeDepth < 0) {
					ledge.position.z -= d;
				}
				
				ledge.userData = {
					id: i,
					isLedge: true,
				};

				if (wallLedgeType == "выступ") complexWall.add(ledge);

				if (wallLedgeType == "проем" && wallLedgeDepth > 0) {
					ledge.position.z = z + d / 2 - wallLedgeDepth / 2;

					var ledgeBSP = new ThreeBSP(ledge);
					wallBSP = wallBSP.subtract(ledgeBSP);

					ledge.setLayer('block');
					complexWall.add(ledge);
				}
	
				if (wallLedgeType == "параллелепипед") {
					ledge.position.y = wallLedgePosY * 1.0 + wallLedgeHeight / 2 - h / 2;
					
					ledge.position.x = wallLedgePosX * 1.0 + wallLedgeWidth / 2 + w / 2;
					ledge.position.z = wallLedgePosZ * 1.0 + wallLedgeDepth / 2 + d / 2;

					if ($('#turnSide').val() == 'левое') {
						ledge.position.x = wallLedgePosX * -1.0 - wallLedgeWidth / 2 - w / 2;
						ledge.position.z = wallLedgePosZ * -1.0 - wallLedgeDepth / 2;
					}

					ledge.rotation.y += THREE.Math.degToRad(wallLedgeRotY * 1.0);
					ledge.rotation.z += THREE.Math.degToRad(wallLedgeRotZ * 1.0);

					ledge.setLayer('block');

					complexWall.add(ledge);
				}
			}
		});

		wall = wallBSP.toMesh();
		wall.material = params.materials.wall;
		wall.geometry.computeVertexNormals();
	}

	complexWall.add(wall);
	
/*
	// Текст на стене сбоку
	var wallDepth = $('#wallThickness_' + n).val() * 1.0;
	var text = drawTextureText(n, 700);

	text.position.x = wall.position.x;
	text.position.y = wall.position.y;
	text.position.z = wall.position.z;
	text.position.z += (wallDepth / 2 + 0.1) * (n == 2 ? -1 : 1);
	
	text.rotation.x = wall.rotation.x;
	text.rotation.y = wall.rotation.y;
	text.rotation.z = wall.rotation.z;

	text.alwaysTransparent = true;
	text.setLayer('labels');
	complexWall.add(text);

	// Текст на стене сверху
	var text = drawTextureText(n, 200);

	text.position.x = wall.position.x;
	text.position.y = wall.position.y + ($('#wallHeight_' + n).val() * 1.0) / 2 + 0.1;
	text.position.z = wall.position.z + wallDepth / 2;

	text.rotation.x = wall.rotation.x + Math.PI / 2;
	text.rotation.y = wall.rotation.y;
	text.rotation.z = wall.rotation.z + Math.PI / 2;
	text.alwaysTransparent = true;
	text.setLayer('labels');
	complexWall.add(text);
*/
	wall.userData.isWall = true;

	complexWall.setLayer('wall' + n);

	return complexWall;
}

function mirrorWalls(){
	var sortedValues = {
		"1": {wallParams:{}, ledges: []},
		"2": {wallParams:{}, ledges: []},
		"3": {wallParams:{}, ledges: []},
		"4": {wallParams:{}, ledges: []}
	};
	$.each($('.ledgeParRow'), function(){
		var val = $(this).find('.wallLedgeBaseWall').val();
		if (val !== 'нижнее') {
			sortedValues[val].ledges.push($(this));
		}
	});

	for (var i = 1; i <= 4; i++) {
		sortedValues[i].wallParams.wallLength = $('#wallLength_' + i).val() * 1.0;
		sortedValues[i].wallParams.wallHeight = $('#wallHeight_' + i).val() * 1.0;
		sortedValues[i].wallParams.wallPositionX = $('#wallPositionX_' + i).val() * 1.0;
		sortedValues[i].wallParams.wallPositionZ = $('#wallPositionZ_' + i).val() * 1.0;
		sortedValues[i].wallParams.wallThickness = $('#wallThickness_' + i).val() * 1.0;
	}


	$.each(sortedValues, function(i){

		var newIndex = 0;
		if (i == 1) newIndex = 2;
		if (i == 2) newIndex = 1;
		if (i == 3) newIndex = 4;
		if (i == 4) newIndex = 3;
		
		if(i == 3 || i == 4) {
			var val = sortedValues[i].wallParams.wallPositionZ * -1 - (sortedValues[i].wallParams.wallLength - params.floorHoleWidth);

			$('#wallPositionZ_' + i).val(val);
		}
		if(i == 1 || i == 2) {
			var deltaZ = params.floorHoleWidth;

			$('#wallLength_' + newIndex).val(sortedValues[i].wallParams.wallLength);
			$('#wallHeight_' + newIndex).val(sortedValues[i].wallParams.wallHeight);
			$('#wallThickness_' + newIndex).val(sortedValues[i].wallParams.wallThickness);
			
			$('#wallPositionX_' + newIndex).val(sortedValues[i].wallParams.wallPositionX * 1.0);
			$('#wallPositionY_' + newIndex).val(sortedValues[i].wallParams.wallPositionY * 1.0);
			$('#wallPositionZ_' + newIndex).val(sortedValues[i].wallParams.wallPositionZ * -1.0 + deltaZ);
		}

		$.each(this.ledges, function(){
			if (i == 1 || i == 2) {
				this.find('.wallLedgeBaseWall').val(newIndex);
			}
		});
	})

	if ($('#turnSide').val() == 'левое') {
		$('#turnSide').val('правое');
	}else{
		$('#turnSide').val('левое');
	}

	recalculate().finally(function(){
		alert('Обстановка отзеркалена, поворот лестницы изменен');
	});
}

/**
 * Функция добавляет сторонний объект в сцену
 * @param {object} json 
 * Пример json
	{
		className: 'Table',
		meshParams: {
			height: 600,
			width: 1000,
			length: 1500,
			tableTopWidth: 40
		},
		position: {
			x: 0,
			y: 0,
			z: 0
		},
		rotation: {
			x: 0,
			y: 0,
			z: 0
		}
	}

	{
		className: 'Sofa',
		meshParams: {
			height: 600,
			width: 1000,
			depth: 600
		},
		position: {
			x: 0,
			y: 0,
			z: 0
		},
		rotation: {
			x: 0,
			y: 0,
			z: 0
		}
	}
 */
function addAdditionalObject(json){
	// Валидируем параметры
	if(!json.className) return;
	var mesh = AdditionalObject.fromJson(json);
	if (mesh) {
		if (json.position) {
			mesh.position.x = json.position.x || 0;
			mesh.position.y = json.position.y || 0;
			mesh.position.z = json.position.z || 0;
		}
		if (json.rotation) {
			mesh.rotation.y = THREE.Math.degToRad(json.rotation) || 0;
		}

		addObjects('', mesh, json.layer || 'additionalObject');
	}
	return mesh;
}

function redrawAdditionalObjects(){
	if (!window.additional_objects) return;
	var obj = view.scene.getObjectsByLayerName('additionalObject');

	if (obj) {
		for (var i = 0; i < obj.length; i++) {
			view.scene.remove(obj[i]);
		}
	}

	$('.additionalObjectRow').remove();

	// Сохраняем ссылку на specObj перед отрисовкой, тк в процессе отрисовки формируется спецификация для доп объектов
	partsAmt_dop = {};
	
	// Отсекаем несуществуюищие классы
	window.additional_objects = window.additional_objects.filter(function(item){
		try {
			eval(item.className);
			return true;
		} catch (error) {
			console.warn('Ошибка, класса ' + item.className + ' не существует');
			return false
		}
	})
	$.each(window.additional_objects, function(i){
		addAdditionalObjectTable(this);
		addAdditionalObject(this);
	});

	if (window.selectedObject && selectedObject.objectRowClass == "additionalObjectRow") {
		selectObjectByRow(selectedObject.objectRowClass, selectedObject.objectRowId);
	}

	updateModifyChanges();
}

function drawParMeshWrapper(par){
	var par = eval(par.drawFunction + '()');
	return par[par.mesh];
}

function addViewport() {

	window.scene = view.scene = new THREE.Scene();

	// Отныне строим сцену сразу как с текстурами
	createRenderer();
	createCamera();

	//добавляем свет
	createLights();

	//управление камерой
	view.orbitControls = new THREE.OrbitControls(view.camera, view.renderer.domElement);

	//вывод на страницу
	$('#' + view.outputDivId).html(view.renderer.domElement);

	cameraAngle = 0;
	camPosIndex = 0;
	cameraState = 'Стандартная';
	view.clock = new THREE.Clock();

	renderScene();

	// Создаем менеджер текстур, в последствии он управляет всеми текстурами
	window.textureManager = new TextureManager(false);

	//Для поддержки старого кода, пока окончательно не выпилим
	$['vl_1'] = view.scene;
	// $sceneStruct = {
	// 	vl_1: {}
	// };

	createMenu();
}

function createMenu(){
	window.menu = new Menu();
	if (window.menu) {
		var group = menu.addGroup({title: 'Обстановка'});

		menu.addLayer({group: group, layerName: 'block', title: 'Блоки'});
		menu.addLayer({group: group, layerName: 'wall1', title: 'Стена 1'});
		menu.addLayer({group: group, layerName: 'wall2', title: 'Стена 2'});
		menu.addLayer({group: group, layerName: 'wall3', title: 'Стена 3'});
		menu.addLayer({group: group, layerName: 'wall4', title: 'Стена 4'});
		menu.addCheckbox({state: false, group: group, variableName: 'wallall', title: 'Все стены', callback: function(menuElement){
			// menu.wall1 = menu.wall2 = menu.wall3 = menu.wall4 = menuElement.value;
			menu.wall1 = menuElement.value;
			menu.wall2 = menuElement.value;
			menu.wall3 = menuElement.value;
			menu.wall4 = menuElement.value;
			menu.topFloor = menuElement.value;
			menu.labels = menuElement.value;
		}});
		menu.addLayer({group: group, layerName: 'floorBottom', title: 'Нижнее'});
		menu.addLayer({group: group, layerName: 'topFloor', title: 'Верхнее'});
		menu.addLayer({group: group, layerName: 'beamTop', title: 'Балки'});


		var group = menu.addGroup({title: 'Настройки'});
		
		var simpleModeState = true;
		if (window.location.href.includes("/manufacturing") || params.calcType == 'carport') simpleModeState = false;
		var simpleModeUrl = $.urlParam('simpleMode');
		if (simpleModeUrl !== null) simpleModeState = simpleModeUrl == 1;

		menu.addCheckbox({state: simpleModeState, group: group, variableName: 'simpleMode', title: 'Упрощённый режим', callback: function(){
			recalculate();
		}});

		menu.addSelect({group: group, title: 'Камеры', variableName: 'cameraPosId', options: ['3d', 'справа', 'слева', 'спереди', 'сзади', 'сверху', 'снизу', 'orto_0', 'orto_1', 'orto_3', 'orto_4'], callback: function(menuElement){
			if (['справа', 'слева', 'спереди', 'сзади', 'сверху', 'снизу'].includes(menuElement.value)) {
				menu.perspective = false; // При изменении значения всё равно вызовется switchCamera ( обработчик perspective ниже )
			}else{
				menu.perspective = true; // При изменении значения всё равно вызовется switchCamera ( обработчик perspective ниже )
			}
		}});

		menu.addSelect({group: group, title: 'Вид', options: ["Стандартная", "Вращение", "Подъем"], callback: function(menuElement){
			cameraState = menuElement.value;
		}});

		menu.addCheckbox({state: true, group: group, variableName: 'perspective', title: 'Перспектива', callback: function(menuElement){
			switchCamera(menu.cameraPosId);
		}});

		menu.addCheckbox({group: group, variableName: 'transparentAll', title: 'Прозрачное всё', callback: function(menuElement){
			var state = menuElement.value;
			$.each(params.materials, function(){
				var mat = this;
				if (state) {
					if (mat && mat.transparentDefaultState == undefined && mat.opacityDefaultState == undefined) {
						mat.transparentDefaultState = !!mat.transparent;
						mat.opacityDefaultState = mat.opacity;

						mat.transparent = true;
						mat.opacity = 0.3;
					}
				}else{
					if (mat) {
						mat.transparent = mat.transparentDefaultState || false;
						mat.opacity = mat.opacityDefaultState || 1;
						mat.transparentDefaultState = mat.opacityDefaultState = undefined;
					}
				}
			});
		}});

		menu.addCheckbox({state: true, group: group, variableName: 'transparentWalls', title: 'Прозр. Стены', callback: function(menuElement){
			var wallLayers = ["wall1", "wall2", "wall3", "wall4", "topFloor", "ceil", "beamTop"]

			view.scene.traverse(function(node){
				if (node.material && wallLayers.indexOf(node.layerName) != -1 && !node.alwaysTransparent) {
					node.material.transparent = menuElement.value;
					node.material.opacity = 0.3;
				}
			});
		}});

		menu.addCheckbox({group: group, title: 'Подсветка ступеней', callback: function(menuElement){
			toggleTreadLights('step', menuElement.value);
		}});

		menu.addCheckbox({group: group, title: 'Текстуры', variableName: 'textures', callback: function(menuElement){
			redrawView(menuElement.value);
		}});

		menu.addCheckbox({state: true, group: group, title: 'Балясины детально', variableName: 'meshBanisters'});
		menu.addCheckbox({group: group, title: 'Рёбра', variableName: 'wireframes'});
		menu.addCheckbox({group: group, title: 'Фаски', variableName: 'bevels'});

		menu.addCheckbox({group: group, title: 'Ночь', callback: function(menuElement){
			toggleNightMode(menuElement.value);
		}});

		menu.addCheckbox({state: true, group: group, title: 'Фон', callback: function(menuElement){
			if(menuElement.value) view.renderer.setClearColor(new THREE.Color(0xEEEEEE));
			else view.renderer.setClearColor(new THREE.Color(0xFFFFFF));
		}});

		menu.addCheckbox({state: true, group: group, title: 'Ребра', callback: function(menuElement){
			// var objects = view.scene.getObjectsByLayerName("_wf");
			// objects.setVisible(menuElement.value);
			if (typeof view.scene != 'undefined') {
				view.scene.traverse(function (node) {
					if (node instanceof THREE.LineSegments) {
						node.visible = menuElement.value;
					}
				})
			}
		}});

		menu.addCheckbox({group: group, variableName: 'realColors', title: 'Цвета', callback: function(menuElement){
			var objects = view.scene.getObjectsByLayerName("_wf");
			$.each(objects, function(){
				this.material.color.setRGB(255,255,255)
			})
		}});

		menu.addCheckbox({group: group, variableName: 'newell_fixings', title: 'Крепления к опорам'});
		menu.addCheckbox({group: group, state: true, variableName: 'boltHead', title: 'Головки болтов'});
	}
}

function switchCamera(posId) {
	if(!posId) posId = "orto_0";
	var pos = [-5000, 3000, 5000];
	if(posId == 'orto_0') pos = [-5000, 3000, 5000];
	if(posId == 'orto_1') pos = [5000, 3000, 5000];
	if(posId == 'orto_3') pos = [-2090, 1415, 3615]
	if(posId == 'orto_4') pos = [5000, 2000, 3000]
	if(posId == "справа") pos = [5000, 0, 0];
	if(posId == "слева") pos = [-5000, 0, 0];
	if(posId == "спереди") pos = [0, 0, 5000];
	if(posId == "сзади") pos = [0, 0, -5000];
	if(posId == "сверху") pos = [0, 5000, 0];
	if(posId == "снизу") pos = [0, -5000, 0];

	view.camera = new THREE.PerspectiveCamera(45, view.width / view.height,  100, 100000);

	if(!menu.perspective) view.camera = new THREE.OrthographicCamera( view.width / - 0.25, view.width / 0.25, view.height / 0.25, view.height / - 0.25, -20000, 50000);

	view.camera.position.set(pos[0], pos[1], pos[2]);
	view.orbitControls = new THREE.OrbitControls(view.camera, view.renderer.domElement);
};

//Перерисовка сцены
function renderScene() {
	requestAnimationFrame(renderScene);
	render();
}

function render() {
	var delta = view.clock.getDelta();

	view.orbitControls.update(delta);
	view.renderer.setSize(view.width, view.height);

	var camera = cameraAnimation();
	
	processAnimations();
	
	view.renderer.render(view.scene, camera);
}

function cameraAnimation(){
	var camera = view.camera;

	if ((cameraState == 'Вращение' || cameraState == 'Подъем') && view.splineCamera) {
		camera = view.splineCamera;
		if (cameraState == 'Вращение' && view.ladderCenter) {
			var angularSpeed = THREE.Math.degToRad(20); // угловая скорость - градусов в секунду
			var radius = 3000;

			camera.position.x = Math.cos(cameraAngle) * radius + view.ladderCenter.x;
			camera.position.y = params.staircaseHeight + 500;
			camera.position.z = Math.sin(cameraAngle) * radius + view.ladderCenter.z;
			cameraAngle += angularSpeed * delta; // приращение угла

			camera.lookAt(view.ladderCenter);
		}
		if (cameraState == 'Подъем' && view.camSpline) {
			camPosIndex++;
			var speed = 500;
			if (camPosIndex > speed) {
				camPosIndex = 0;
			}
			var camPos = view.camSpline.getPoint(camPosIndex / speed);
			var camRot = view.camSpline.getTangent(camPosIndex / speed);

			camera.position.x = camPos.x;
			camera.position.y = camPos.y;
			camera.position.z = camPos.z;

			camera.rotation.x = camRot.x;
			camera.rotation.y = camRot.y;
			camera.rotation.z = camRot.z;

			var lookAt = view.camSpline.getPoint((camPosIndex + 1) / speed);
			lookAt.y -= 25;
			camera.lookAt(lookAt);
		}
	}

	return camera;
}

/** функция возвращает стандартную камеру
 */
function createCamera() {
	view.camera = new THREE.PerspectiveCamera(45, view.width / view.height, 10, 100000);
	view.camera.position.set(-5000, 3000, 5000);

	view.splineCamera = new THREE.PerspectiveCamera(60, view.width / view.height, 10, 10000);

	view.scene.add(view.splineCamera);
	view.scene.add(view.camera);
}

/** функция возвращает стандартный рендерер
 */

function createRenderer() {
	var renderer = new THREE.WebGLRenderer({
		preserveDrawingBuffer: true, //опция нужна для выгрузки в png
		antialias: true,
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setClearColor(new THREE.Color(0xEEEEEE));
	renderer.shadowMap.enabled = true;

	view.renderer = renderer;
}

//включение и отключение текстур
function redrawView(showTextures) {
	// Вызываем метод менеджера для изменения состояния
	textureManager.setTexturesEnabled(showTextures);
	redrawAdditionalObjects();
}

function addWareframe(obj, group) {
	if (obj.noWireFrames) return;

	var materialColor = 0x000000;
	var materialLineWidth = 2;
	if (window.location.href.includes('/manufacturing')) {
		materialColor = 0xffffff;
	}
	/*
		var materialColor = 0xeeeeee;
		var materialLineWidth = 3;
		if (window.location.href.includes('/customers')) {
			materialColor = 0x000000;
			materialLineWidth = 1;
		}
		if (params.calcType == 'geometry' || window.location.href.includes("/geometry")) {
			materialColor = 0x000000;
			materialLinewidth = 1;
		}
		if (obj.material) {
			if (obj.material.name == "wallMaterial" || obj.material.name == "floorMaterial" || obj.material.name == "ceilMaterial") {
				materialColor = 0x666666;
				materialLinewidth = 1;
			}
		}
	*/
	// Подключаем общий материал для контуров
	var mat = params.materials.wireframe || new THREE.LineBasicMaterial({
		color: materialColor,
		linewidth: materialLineWidth
	});

	if (obj.geometry !== undefined && obj.geometry.type != "EdgesGeometry") {
		var geo = new THREE.EdgesGeometry(obj.geometry); // or WireframeGeometry
		var wireframe = new THREE.LineSegments(geo, mat);
		wireframe.rotation.x = obj.rotation.x;
		wireframe.rotation.y = obj.rotation.y;
		wireframe.rotation.z = obj.rotation.z;
		wireframe.position.x = obj.position.x;
		wireframe.position.y = obj.position.y;
		wireframe.position.z = obj.position.z;
		var layerName = obj.layerName || group.layerName;

		if (layerName != undefined) {
			wireframe.layerName = layerName + "_wf";
		} else {
			wireframe.layerName = 'noname_wf';
		}
		if (group !== undefined) group.add(wireframe);
		else group.push(wireframe);
	}
	if (obj.children !== undefined) {
		for (var co = obj.children.length - 1; co > -1; co--) {
			addWareframe(obj.children[co], obj);
		}
	}
}

/** старая функция, возможно не используется
 */
function addWallWareframe(obj, group) {
	var mat = new THREE.LineBasicMaterial({
		color: 0xeeeeee,
		linewidth: 3
	});
	if (obj.geometry !== undefined) {
		var geo = new THREE.EdgesGeometry(obj.geometry); // or WireframeGeometry
		var wireframe = new THREE.LineSegments(geo, mat);
		wireframe.rotation.x = obj.rotation.x;
		wireframe.rotation.y = obj.rotation.y;
		wireframe.rotation.z = obj.rotation.z;
		wireframe.position.x = obj.position.x;
		wireframe.position.y = obj.position.y;
		wireframe.position.z = obj.position.z;

		if (group !== undefined) group.add(wireframe);
		else group.push(wireframe);
	}
	if (obj.children !== undefined) {
		for (var co = obj.children.length - 1; co > -1; co--) {
			addWareframe(obj.children[co], obj);
		}
	}
}

function saveCanvasImg(canvasId) {

	var canvas = $("#WebGL-output").find("canvas").eq(canvasId)[0];

	var imageData = canvas.toDataURL();
	var image = new Image();
	image.src = imageData;

	var link = document.createElement("a");
	link.setAttribute("href", image.src);
	var imgName = params.orderName;
	if (imgName == "") imgName = "staircase"
	imgName += '.png'
	link.setAttribute("download", imgName);

	link.click();

} //end of saveCanvasImg

function cloneCanvas() {
	var canvas = $("#WebGL-output").find("canvas:first")[0];
	var imageData = canvas.toDataURL();
	var id = $("#images").children().length;
	var text = "<div class='cloned_canvas' data-id='" + id + "'>" +
		'<button class="btn btn-danger removeImg noPrint">' +
		'<i class="glyphicon glyphicon-trash"></i>' +
		'<span>Удалить</span>' +
		'</button>' +
		"<img class='img' src=" + imageData + ">" +
		"</div>"
	var imgDiv = $("#images").append(text);
	imgDiv.find(".removeImg").click(function () {
		$(this).closest("div").fadeOut("100", function () {
			this.remove();
		});
	});

	return {id: id, context: canvas};
}

var floor;

function addTopFloor(viewportId, isVisible) {
	$viewportsContainsTopFloor.push(viewportId);
	// $sceneStruct[viewportId].topFloor = isVisible;
	// $sceneStruct[viewportId].beamTop = isVisible;
	return drawTopFloor();
}

function drawTopFloor() {
	var floorThickness = $("#floorThickness").val() * 1;

	var obj;
	if (view.scene) {
		while (obj = view.scene.getObjectByLayerName('topFloor'))
			view.scene.remove(obj);

		while (obj = view.scene.getObjectByLayerName('beamTop'))
			view.scene.remove(obj);
	}
	
	//не отрисовываем верхнее перекрытие нулевой толщины
	if(floorThickness == 0) return;
	
	var floorCoverThk = params.floorOffsetTop;
	if (floorCoverThk == 0) floorCoverThk = 1;

	drawTopFloorPlane(floorThickness - floorCoverThk, 0xaaaaaa, floorCoverThk, true);
	if (floorCoverThk > 0) {
		drawTopFloorPlane(floorCoverThk, 0xcccccc, 0, false);
	}

	//балка
	if (params.calcType !== 'timber_stock' && !window.location.href.includes('/customers')) {
		var beamObj = new THREE.Object3D();
		var beamMaterial = new THREE.MeshLambertMaterial({
			color: 0xFF8000
		});
		var beamThk = 100;
		var beamSideOffset = 100; //выступ балки за край проема
		
		var beamLength = params.floorHoleWidth;
		if(params.floorHoleBaseSide == 1 || params.floorHoleBaseSide == 2) beamLength = params.floorHoleLength;
		
		beamLength += beamSideOffset * 2;
		
		var geom = new THREE.BoxGeometry(100, params.beamWidth, beamLength);
		var beam = new THREE.Mesh(geom, beamMaterial);
		
		if(params.floorHoleBaseSide == 1 || params.floorHoleBaseSide == 2){
			beam.rotation.y = Math.PI / 2;
			beam.position.x = -params.floorHoleLength / 2;
			beam.position.y = params.staircaseHeight - params.beamWidth / 2 - params.beamPosY;
			if(params.floorHoleBaseSide == 1){
			beam.position.z = -beamThk / 2 - 0.01
			if (params.turnSide == "левое") beam.position.z -= params.floorHoleWidth;
			}
			if(params.floorHoleBaseSide == 2){
				beam.position.z = params.floorHoleWidth + beamThk / 2 + 0.01
				if (params.turnSide == "левое") beam.position.z -= params.floorHoleWidth;
			}
		}
		
		if(params.floorHoleBaseSide == 3 || params.floorHoleBaseSide == 4){
			
			beam.position.y = params.staircaseHeight - params.beamWidth / 2 - params.beamPosY;
			beam.position.z = params.floorHoleWidth / 2 + params.beamPosZ
			if (params.turnSide == "левое") beam.position.z -= params.floorHoleWidth;
			if(params.floorHoleBaseSide == 3 ){
				beam.position.x = beamThk / 2 + params.beamPosX + 0.01;
			}
			if(params.floorHoleBaseSide == 4){
				beam.position.x = -params.floorHoleLength - beamThk / 2 + params.beamPosX + 0.01;
			}
			
		}
		
		beam.layerName = "beamTop";
		beamObj.add(beam)

		addObjects("vl_1", beamObj, 'beamTop');
	}
}

function drawTopFloorPlane(thickness, color, offsetY, isCeil) {

	var mat = params.materials.topFloor;
	if (isCeil) mat = params.materials.ceil;

	//сохраняем значение параметра видимости верхнего перекрытия для текущего видового экрана
	var isVisible = menu.topFloor;
	if (isVisible == undefined) isVisible = true;

	var floorHoleLength = $("#floorHoleLength").val() * 1;
	var floorHoleWidth = $("#floorHoleWidth").val() * 1;
	var floorThickness = thickness;

	var floorWidth = 10000;
	var floorLength = 10000;
	var p0_X = -0.5 * (floorWidth + floorHoleLength);
	var p0_Y = -0.5 * (floorLength + floorHoleWidth);
	/*внешний контур*/
	var floorShape;
	var floorHoleLedgeBaseEdges = $('#topFloorLedgesTable [id^=floorHoleLedgeBaseEdge]');
	var topFloor = new THREE.Object3D();

	//проем без выступов
	if ($('#dxfOpening').val() == 'нет' && floorHoleLedgeBaseEdges.length == 0) {
		floorShape = new THREE.Shape();
		floorShape.moveTo(p0_X, p0_Y);
		floorShape.lineTo(p0_X, p0_Y + floorLength);
		floorShape.lineTo(p0_X + floorWidth, p0_Y + floorLength);
		floorShape.lineTo(p0_X + floorWidth, p0_Y);
		floorShape.lineTo(p0_X, p0_Y);
		/*контур проема*/
		var hole = new THREE.Path();
		hole.moveTo(0, 0);
		hole.lineTo(-floorHoleLength, 0);
		hole.lineTo(-floorHoleLength, -floorHoleWidth);
		hole.lineTo(0, -floorHoleWidth);
		hole.lineTo(0, 0);

		floorShape.holes.push(hole);

		var floorExtrudeOptions = {
			amount: thickness,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};

		var geom = new THREE.ExtrudeGeometry(floorShape, floorExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var mesh = new THREE.Mesh(geom, mat);
		if (!isCeil) mesh.userData.isTopFloor = true
		else mesh.userData.isCeil = true;
		topFloor.add(mesh);

		addFloorObjectsToScene();
	}

	//проем с выступами
	if ($('#dxfOpening').val() == 'нет') {
		for (var i = 0; i < floorHoleLedgeBaseEdges.length; i++) {
	
			var floorHoleLedgeBaseEdge = $("#floorHoleLedgeBaseEdge" + i).val();
			var floorHoleLedgeLength = $("#floorHoleLedgeLength" + i).val() * 1;
			var floorHoleLedgeWidth = $("#floorHoleLedgeWidth" + i).val() * 1;
			var floorHoleLedgePosition = $("#floorHoleLedgePosition" + i).val() * 1;
			var floorHoleLedgeType = (floorHoleLedgeWidth >= 0 ? "выступ" : "вырез");
			floorHoleLedgeWidth = Math.abs(floorHoleLedgeWidth);
	
	
	
			/*внешний контур*/
			floorShape = new THREE.Shape();
			floorShape.moveTo(p0_X, p0_Y);
			floorShape.lineTo(p0_X, p0_Y + floorLength);
			floorShape.lineTo(p0_X + floorWidth, p0_Y + floorLength);
			floorShape.lineTo(p0_X + floorWidth, p0_Y);
			floorShape.lineTo(p0_X, p0_Y);
			/*контур проема*/
			var hole = new THREE.Path();
			hole.moveTo(0, 0);
			//если выступ на грани №1
			if (floorHoleLedgeBaseEdge == "1") {
				if (floorHoleLedgePosition) hole.lineTo(-floorHoleLedgePosition, 0);
				if (floorHoleLedgeType == "выступ") {
					hole.lineTo(-floorHoleLedgePosition, -floorHoleLedgeWidth);
					hole.lineTo(-(floorHoleLedgePosition + floorHoleLedgeLength), -floorHoleLedgeWidth);
					hole.lineTo(-(floorHoleLedgePosition + floorHoleLedgeLength), 0);
				} else {
					hole.lineTo(-floorHoleLedgePosition, floorHoleLedgeWidth);
					hole.lineTo(-(floorHoleLedgePosition + floorHoleLedgeLength), floorHoleLedgeWidth);
					hole.lineTo(-(floorHoleLedgePosition + floorHoleLedgeLength), 0);
				}
			}
			hole.lineTo(-floorHoleLength, 0);
			//если выступ на грани №4
			if (floorHoleLedgeBaseEdge == "4") {
				if (floorHoleLedgePosition) hole.lineTo(-floorHoleLength, -floorHoleLedgePosition);
				if (floorHoleLedgeType == "выступ") {
					hole.lineTo(-(floorHoleLength - floorHoleLedgeWidth), -floorHoleLedgePosition);
					hole.lineTo(-(floorHoleLength - floorHoleLedgeWidth), -(floorHoleLedgePosition + floorHoleLedgeLength));
					hole.lineTo(-floorHoleLength, -(floorHoleLedgePosition + floorHoleLedgeLength));
				} else {
					hole.lineTo(-(floorHoleLength + floorHoleLedgeWidth), -floorHoleLedgePosition);
					hole.lineTo(-(floorHoleLength + floorHoleLedgeWidth), -(floorHoleLedgePosition + floorHoleLedgeLength));
					hole.lineTo(-floorHoleLength, -(floorHoleLedgePosition + floorHoleLedgeLength));
				}
			}
			hole.lineTo(-floorHoleLength, -floorHoleWidth);
	
			//если выступ на грани №2
			if (floorHoleLedgeBaseEdge == "2") {
				if (floorHoleLedgePosition) hole.lineTo(-floorHoleLength + floorHoleLedgePosition, -floorHoleWidth);
				if (floorHoleLedgeType == "выступ") {
					hole.lineTo(-floorHoleLength + floorHoleLedgePosition, -floorHoleWidth + floorHoleLedgeWidth);
					hole.lineTo(-floorHoleLength + floorHoleLedgePosition + floorHoleLedgeLength, -floorHoleWidth + floorHoleLedgeWidth);
					hole.lineTo(-floorHoleLength + floorHoleLedgePosition + floorHoleLedgeLength, -floorHoleWidth);
				} else {
					hole.lineTo(-floorHoleLength + floorHoleLedgePosition, -floorHoleWidth - floorHoleLedgeWidth);
					hole.lineTo(-floorHoleLength + floorHoleLedgePosition + floorHoleLedgeLength, -floorHoleWidth - floorHoleLedgeWidth);
					hole.lineTo(-floorHoleLength + floorHoleLedgePosition + floorHoleLedgeLength, -floorHoleWidth);
				}
	
			}
			hole.lineTo(0, -floorHoleWidth);
			//если выступ на грани №3
			if (floorHoleLedgeBaseEdge == "3") {
				if (floorHoleLedgePosition) hole.lineTo(0, -(floorHoleWidth - floorHoleLedgePosition));
				if (floorHoleLedgeType == "выступ") {
					hole.lineTo(-floorHoleLedgeWidth, -(floorHoleWidth - floorHoleLedgePosition));
					hole.lineTo(-floorHoleLedgeWidth, -(floorHoleWidth - floorHoleLedgePosition - floorHoleLedgeLength));
					hole.lineTo(0, -(floorHoleWidth - floorHoleLedgePosition - floorHoleLedgeLength));
				} else {
					hole.lineTo(floorHoleLedgeWidth, -(floorHoleWidth - floorHoleLedgePosition));
					hole.lineTo(floorHoleLedgeWidth, (floorHoleLedgePosition - floorHoleLedgeLength));
					hole.lineTo(0, (floorHoleLedgePosition - floorHoleLedgeLength));
				}
			}
			hole.lineTo(0, 0);
	
			floorShape.holes.push(hole);
	
			var floorExtrudeOptions = {
				amount: thickness,
				bevelEnabled: false,
				curveSegments: 12,
				steps: 1
			};
	
			var geom = new THREE.ExtrudeGeometry(floorShape, floorExtrudeOptions);
			geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
			floor = new THREE.Mesh(geom, mat);
			if (!isCeil) floor.userData.isTopFloor = true
			else floor.userData.isCeil = true;
			topFloor.add(floor);
		}

		addFloorObjectsToScene()
	}

	if ($('#dxfOpening').val() == 'да') {
		var floorHoleFile = $('#dxfFile').prop('files') ? $('#dxfFile').prop('files')[0] : false;
		if (floorHoleFile) {
			floorHoleFile.text().then(function(content){
				floorShape = new THREE.Shape();
				floorShape.moveTo(p0_X, p0_Y);
				floorShape.lineTo(p0_X, p0_Y + floorLength);
				floorShape.lineTo(p0_X + floorWidth, p0_Y + floorLength);
				floorShape.lineTo(p0_X + floorWidth, p0_Y);
				floorShape.lineTo(p0_X, p0_Y);
				
				/*контур проема*/
				var parser = new DxfParser();
				var dxf = parser.parseSync(content);
				var hole = dxfToPath(dxf);
				if (hole) {
					if (!window.service_data) window.service_data = {}
					window.service_data.openingPath = hole.toJSON();
					floorShape.holes.push(hole);
				}else{
					alert('Проблема при построении проема!')
				}
	
				var floorExtrudeOptions = {
					amount: thickness,
					bevelEnabled: false,
					curveSegments: 12,
					steps: 1
				};
		
				var geom = new THREE.ExtrudeGeometry(floorShape, floorExtrudeOptions);
				geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
				var mesh = new THREE.Mesh(geom, mat);
				if (!isCeil) mesh.userData.isTopFloor = true
				else mesh.userData.isCeil = true;
				topFloor.add(mesh);

				addFloorObjectsToScene();
			});
		}else{
			if (window.service_data && window.service_data.openingPath) {
				floorShape = new THREE.Shape();
				floorShape.moveTo(p0_X, p0_Y);
				floorShape.lineTo(p0_X, p0_Y + floorLength);
				floorShape.lineTo(p0_X + floorWidth, p0_Y + floorLength);
				floorShape.lineTo(p0_X + floorWidth, p0_Y);
				floorShape.lineTo(p0_X, p0_Y);
				
				var hole = new THREE.Path().fromJSON(window.service_data.openingPath);
				if (hole) {
					floorShape.holes.push(hole);
				}else{
					alert('Проблема при построении проема из сохраненного контура!')
				}
	
				var floorExtrudeOptions = {
					amount: thickness,
					bevelEnabled: false,
					curveSegments: 12,
					steps: 1
				};
		
				var geom = new THREE.ExtrudeGeometry(floorShape, floorExtrudeOptions);
				geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
				var mesh = new THREE.Mesh(geom, mat);
				if (!isCeil) mesh.userData.isTopFloor = true
				else mesh.userData.isCeil = true;
				topFloor.add(mesh);

				addFloorObjectsToScene();
			}
		}
	}

	// Я сознательно вынес этот код в функцию, тк часть построения потолка асинхронна добавлять в сцену потолок необходимо после
	function addFloorObjectsToScene(){
		topFloor.layerName = "topFloor";

		topFloor.rotation.x = -0.5 * Math.PI;
		topFloor.position.x = 0;
		topFloor.position.y = params.staircaseHeight - floorThickness - offsetY;
		topFloor.position.z = 0 //params.topThreadsPosition;
		if (params.turnSide == "левое") topFloor.position.z -= params.floorHoleWidth;
	
		addObjects('vl_1', topFloor, 'topFloor');
	
		menu.topFloor = isVisible;
		menu.beamTop = isVisible;
	}

}

async function readFileSync(file) {
	var text = ''
	await file.text().then(function(content){
		text = content;
	});

	return text;
}

//функция возвращает объекты, имеюдие свойство с заданным значением
function getObjectsByProp(propName, value) {
	var objects = [];

	var findObj = function (arr, propName, value) {
		if (arr.children == undefined) return;
		for (var i = 0; i < arr.children.length; i++) {
			if (arr.children[i][propName] == value) objects.push(arr.children[i]);
			if (arr.children[i].type == "Object3D") findObj(arr.children[i], propName, value);
		}
	}

	findObj(view.scene, propName, value)

	return objects;

} //end of getObjectsByProp


function updateTextures() {
	getAllInputsValues(params);

	textureManager.updateMaterials();

	$("span.property-name").each(function () {
		if ($(this).text() == "Текстуры") {
			$(this).closest('div').find('input[type="checkbox"]').prop('checked', 'checked')
		}
	});
}

/** функция возвращает стандартный свет для сцены без текстур
 */

function createLights() {
	view.lights = [];
	if (window.location.href.includes('/geometry/')) {
		var ambientLight = new THREE.AmbientLight(0xffffff);
		view.scene.add(ambientLight);
		view.lights.push(ambientLight);
	} else {
		var ambientLight = new THREE.AmbientLight(0xfffbdf);
		view.scene.add(ambientLight);

		var sunLight = new THREE.SpotLight(0xffffff, 0.4, 0, Math.PI / 2);
		sunLight.position.set(1000, params.staircaseHeight - params.floorThickness - 100, 3000 * turnFactor);
		sunLight.position.multiplyScalar(2);
		sunLight.castShadow = true;
		sunLight.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(70, 1, 1000, 200000));
		sunLight.shadow.bias = 0.00085;

		sunLight.shadow.mapSize.width = 4096;
		sunLight.shadow.mapSize.height = 4096;
		view.scene.add(sunLight);

		view.lights.push(ambientLight, sunLight);
	}
}
