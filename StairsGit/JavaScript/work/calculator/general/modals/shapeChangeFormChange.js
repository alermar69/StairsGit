$(function(){
	$("#downloadModifyDxf").click(function(){
		getSelectedObjectDxf();
	});

	$("#dxfModifyFile").change(function(){
		var dxfModifyFile = $('#dxfModifyFile').prop('files') ? $('#dxfModifyFile').prop('files')[0] : false;
		console.log(dxfModifyFile);
		if (dxfModifyFile) {
			dxfModifyFile.text().then(function(content){
				appendFromDxf(content)
			});
		}
		$('#dxfModifyFile').val(null);
	});

	$("#openEditor").click(function(){
		generateSketchData();
		$('.iframe-wrapper').html('<iframe id="shapeEditorIframe" src="/jsketcher/sketcher.html" frameborder="0"></iframe>');
		// $("#openEditor").html("Загрузка");
		// $("#openEditor").attr("disabled", true);
	});
	
	$("#loadShapeFromEditor").click(function(){
		var content = $("#shapeEditorIframe")[0].contentWindow.exportDxfFromViewer()
		appendFromDxf(content);
		$("#shapeModifyModal").modal('hide');
	});

	$('#uploadModifyDxf').click(function(){
		$('#dxfModifyFile').click();
	});
});

function generateSketchData(){
	window.sketchData = null

	var obj = window.selectedObject;
	if ((!obj || !obj.geometry) && window.clickedObject && window.clickedObject.geometry) obj = clickedObject;

	if (obj) {
		var shape = obj.geometry.parameters.shapes;

		var sketchData = {
			"layers": [{
					"name": "_dim",
					"style": {
						"lineWidth": 1,
						"strokeStyle": "#bcffc1",
						"fillStyle": "#00FF00"
					},
					"readOnly": false,
					"data": []
				},
				{
					"name": "sketch",
					"style": {
						"lineWidth": 2,
						"strokeStyle": "#ffffff",
						"fillStyle": "#000000"
					},
					"readOnly": false,
					"data": [],
				}
			],
			"constraints": []
		};
		var layer = sketchData.layers[1];
		var connectedPoints = [];
		var pointId = 1;
		for (var i = 0; i < shape.curves.length; i++) {
			var curve = shape.curves[i];
			if (curve.type == "LineCurve") {
				layer.data.push({
					"id": pointId,
					"_class": "TCAD.TWO.Segment",
					"role": null,
					"points": [
							[pointId + 1, [pointId + 2, curve.v1.x],
							[pointId + 3, curve.v1.y]
						],
							[pointId +4, [ pointId + 5, curve.v2.x],
							[pointId + 6, curve.v2.y]
						]
					],
					"children": [pointId]
				})
				connectedPoints.push(pointId + 1, pointId + 4);
				pointId += 7;
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
				
				// var midPoint = polar(center, angEnd - angStart, -rad);
				// var midPoint2 = polar(center, angEnd - angStart, rad);
				// layer.data.push({
				// 	"id": pointId,
				// 	"_class": "TCAD.TWO.EllipticalArc",
				// 	"role": null,
				// 	"ep1": [pointId + 1, [pointId + 2, midPoint.x],
				// 		[pointId +3, midPoint.y]
				// 	],
				// 	"ep2": [pointId + 4, [pointId + 5, midPoint2.x],
				// 		[pointId + 6, midPoint2.y]
				// 	],
				// 	"a": [pointId + 7, [pointId + 8, startPoint.x],
				// 		[pointId + 9, startPoint.y]
				// 	],
				// 	"b": [pointId + 10, [pointId + 11, endPoint.x],
				// 		[pointId + 12, endPoint.y]
				// 	],
				// 	"r": rad,
				// 	"children": [pointId]
				// });
				layer.data.push({
					"id": pointId,
					"_class": "TCAD.TWO.Arc",
					"role": null,
					"points": [
						[pointId + 1, [pointId + 2, startPoint.x],
							[pointId + 3, startPoint.y]
						],
						[pointId + 4, [pointId + 5, endPoint.x],
							[pointId + 6, endPoint.y]
						],
						[pointId + 7, [pointId + 8, center.x],
							[pointId + 9, center.y]
						]
					],
					"children": [pointId]
				})
				connectedPoints.push(pointId + 4, pointId + 1);
				pointId += 10;
			}
		}
		for (var i = 1; i <= connectedPoints.length; i+=2) {
			
			if (i <= connectedPoints.length - 2) {
				sketchData.constraints.push(["coi", [connectedPoints[i], connectedPoints[i + 1]]])
			}
			if (i == connectedPoints.length - 1) {
				sketchData.constraints.push(["coi", [connectedPoints[i], connectedPoints[0]]])
			}
			if (i == connectedPoints.length) {
				sketchData.constraints.push(["coi", [connectedPoints[i - 1], connectedPoints[0]]])
			}
		}
			
		window.sketchData = JSON.stringify(sketchData);
	}
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
	// console.log(shape);
	if (window.selectedObject || window.clickedObject) {
		var obj = selectedObject;
		if (!obj.modifyKey && clickedObject) {
			obj = clickedObject;
		}
		// var extracted = shape.extractPoints();
		// var points = extracted.shape;
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