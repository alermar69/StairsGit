$(function(){
	$("#downloadModifyDxf").click(function(){
		getSelectedObjectDxf('main');
	});

	$("#dxfModifyFile").change(function(){
		var dxfModifyFile = $('#dxfModifyFile').prop('files') ? $('#dxfModifyFile').prop('files')[0] : false;
		console.log(dxfModifyFile);
		if (dxfModifyFile) {
			dxfModifyFile.text().then(function(content){
				appendFromDxf(content)
			});
			$("#shapeModifyModal").modal('hide');

		}
		$('#dxfModifyFile').val(null);
	});

	$("#openEditor").click(function(){
		generateSketchData(true);
		if ($("#shapeEditorIframe").length == 0) {
			$('.iframe-wrapper').html('<iframe id="shapeEditorIframe" src="/jsketcher/sketcher.html" frameborder="0"></iframe>');
		}
		// $("#openEditor").html("Загрузка");
		// $("#openEditor").attr("disabled", true);
	});
	
	$("#loadShapeFromEditor").click(function(){
		var content = $("#shapeEditorIframe")[0].contentWindow.exportDxfFromViewer()
		appendFromDxf(content);
		generateSketchData();
		$("#shapeModifyModal").modal('hide');
	});

	$('#uploadModifyDxf').click(function(){
		$('#dxfModifyFile').click();
	});
});


// function appendModifyDxf(){
// 	if (window.service_data && window.service_data.shapeChanges && window.service_data.shapeChanges.length > 0) {
// 		initMakerJs(function(){
// 			window.service_data.shapeChanges.forEach(function(par){
// 				var newShape = new THREE.Shape()

// 				newShape.fromJSON(par.shapeData);
// 				var models = {};
				
// 				var d = makePathStringFromShape(newShape, false, true);
	
// 				if (d) {
// 					console.log(i);
// 					models[i] = makerjs.importer.fromSVGPathData(d);
// 					models[i].layer = 'main';
// 				}
	
// 				if (newShape.holes) {
// 					newShape.holes.forEach(function(hole, j){
// 						var d = makePathStringFromShape(hole, false, true);
// 						models[i + j + 1] = makerjs.importer.fromSVGPathData(d);
// 						models[i + j + 1].layer = 'holes';
// 					})
// 				}
// 				var dxf = makerjs.exporter.toDXF({models: models});
// 				dxfPrimitivesArr.push(dxf)
				
// 				// var byteCharacters = unicodeToWin1251_UrlEncoded(dxf);
// 				// var byteArray = new Uint8Array(byteCharacters);
// 			});

// 		});
// 	}
// }


function generateSketchData(withReload){
	window.sketchData = null

	var obj = window.selectedObject;
	if ((!obj || !obj.geometry) && window.clickedObject && window.clickedObject.geometry) obj = clickedObject;

	if (obj) {

		var sketchData = {
			"version": 3,
			"objects": [],
			"dimensions": [],
			"stages": [],
			"constants": ""
		};
		var constraintsStage = [];

		var shape = obj.geometry.parameters.shapes;
		
		var mainPar = appendConstraintsFromShape({
			objects: sketchData.objects,
			constraints: constraintsStage,
			shape: shape,
			baseId: 0,
		})


		var nextId = mainPar.nextId;
		shape.holes.forEach(function(hole){
			var holePar = appendConstraintsFromShape({
				objects: sketchData.objects,
				constraints: constraintsStage,
				shape: hole,
				baseId: nextId,
				role: 'holes'
			})
			nextId = holePar.nextId;
		})
		
		sketchData.stages.push({"constraints": constraintsStage, "generators": []});
		console.log(sketchData)
			
		window.sketchData = JSON.stringify(sketchData);
		
		if(withReload && $("#shapeEditorIframe")[0] && $("#shapeEditorIframe")[0].contentWindow) $("#shapeEditorIframe")[0].contentWindow.reloadSketcher();
	}
}

function appendConstraintsFromShape(par){
	var shape = par.shape;
	var baseId = par.baseId;

	var pointId = baseId;
	var nextPointId = baseId;
	for (var i = 0; i < shape.curves.length; i++) {
		var pointId = baseId + i + 1;
		var nextPointId = pointId + 1;
		if (i == shape.curves.length - 1) nextPointId = baseId + 1;

		var curve = shape.curves[i];
		if (curve.type == "LineCurve") {
			par.objects.push(
				{
					"id": pointId.toString(),
					"type": "Segment",
					"role": par.role || null,
					"stage": 0,
					"data": {
						"a": {
							"x": curve.v1.x,
							"y": curve.v1.y
						},
						"b": {
							"x": curve.v2.x,
							"y": curve.v2.y
						}
					}
				}
			);
		}
		if (curve.type == "EllipseCurve") {
			var center = {
				x: curve.aX,
				y: curve.aY,
			}
			var rad = curve.xRadius;
			var angStart = curve.aStartAngle;
			var angEnd = curve.aEndAngle;
			if(curve.aClockwise){
				angEnd = curve.aStartAngle;
				angStart = curve.aEndAngle;
			}
			var startPoint = polar(center, angStart, rad);
			var endPoint = polar(center, angEnd, rad);

			par.objects.push({
				"id": pointId.toString(),
				"type": "Arc",
				"role": par.role || null,
				"stage": 0,
				"data": {
					"b": {
						"x": startPoint.x,
						"y": startPoint.y
					},
					"a": {
						"x": endPoint.x,
						"y": endPoint.y
					},
					"c": {
						"x": center.x,
						"y": center.y
					}
				}
			});
		}
	}

	for (var i = 0; i < shape.curves.length; i++) {
		var pointId = baseId + i + 1;
		var nextPointId = pointId + 1;
		if (nextPointId == (baseId + shape.curves.length + 1)) {
			pointId = baseId + shape.curves.length;
			nextPointId = baseId + 1;
		}
		par.constraints.push({
			"typeId": "PCoincident",
			"objects": [pointId + ":B", nextPointId + ":A"],
			"stage": 0,
			"annotations": []
		});
	}

	console.log(par.objects, par.constraints)

	par.nextId = nextPointId + 1;
	return par
}

// var sketchData = {
// 	"version": 3,
// 	"objects": [],
// 	"dimensions": [],
// 	"stages": [],
// 	"constants": ""
// };
// var constraintsStage = [];
// for (var i = 0; i < shape.curves.length; i++) {
// 	// var point = points[i];
// 	var pointId = i + 1;
// 	var nextPointId = pointId + 1;
// 	if (nextPointId > points.length) pointId = 1
// 	// var nextPoint = points[nextPointId];
// 	var curve = shape.curves[i];
// 	if (curve.type == "LineCurve") {
// 		sketchData.objects.push(
// 			{
// 				"id": pointId.toString(),
// 				"type": "Segment",
// 				"role": null,
// 				"stage": 0,
// 				"data": {
// 					"a": {
// 						"x": curve.v1.x,
// 						"y": curve.v1.y
// 					},
// 					"b": {
// 						"x": curve.v2.x,
// 						"y": curve.v2.y
// 					}
// 				}
// 			}
// 		);
// 	}
// 	constraintsStage.push({
// 		"typeId": "PCoincident",
// 		"objects": [pointId + ":B", nextPointId + ":A"],
// 		"stage": 0,
// 		"annotations": []
// 	});
// }

// for (var i = 0; i < points.length; i++) {
// 	var nextPointId = i + 1;
// 	if (nextPointId > points.length - 1) nextPointId = 0;
// }

// sketchData.stages.push({"constraints": constraintsStage, "generators": []});
function appendFromDxf(content){
	var parser = new DxfParser();
	var dxf = parser.parseSync(content);
	console.log(dxf);
	var shape = dxfToShape(dxf);
	console.log(shape)
	console.log(shape);
	if (!window.service_data) {
		window.service_data = {
			shapeChanges: []
		}
	}
	// console.log(shape);
	if (window.selectedObject || window.clickedObject) {
		var obj = selectedObject;
		if (!obj.modifyKey && clickedObject) {
			obj = clickedObject;
		}
		
		var oldChange = window.service_data.shapeChanges.find(function(change){
			return change.modifyKey == obj.modifyKey
		})
		if (oldChange) {
			window.service_data.shapeChanges.splice(oldChange, 1);
		}

		var changeParams = {
			modifyKey: obj.modifyKey,
			shapeData: shape.toJSON()
		}
		window.service_data.shapeChanges.push(changeParams);

		updateModifyChanges();
		if (obj.wireframe) {
			obj.wireframe.remove();
		}
	}
}

function getShapeFromModify(modify){
	var shape = new THREE.Shape()
	shape.fromJSON(modify.shapeData)
	return shape;
}