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
		$("#openEditor").html("Загрузка");
		$("#openEditor").attr("disabled", true);
	});
	
	$("#loadShapeFromEditor").click(function(){
		var content = $("#shapeEditorIframe")[0].contentWindow.exportDxfFromViewer()
		appendFromDxf(content);
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
		var extracted = shape.extractPoints();
		var points = extracted.shape;
		if (points) {
			var sketchData = {
				"version": 3,
				"objects": [],
				"dimensions": [],
				"stages": [],
				"constants": ""
			};
			var constraintsStage = [];
			for (var i = 1; i < points.length; i++) {
				var point = points[i];
				var nextPointId = i + 1;
				if (nextPointId > points.length - 1) nextPointId = 1
				var nextPoint = points[nextPointId];

				sketchData.objects.push(
					{
						"id": i.toString(),
						"type": "Segment",
						"role": null,
						"stage": 0,
						"data": {
							"a": {
								"x": point.x,
								"y": point.y
							},
							"b": {
								"x": nextPoint.x,
								"y": nextPoint.y
							}
						}
					}
				);
				constraintsStage.push({
					"typeId": "PCoincident",
					"objects": [i + ":B", nextPointId + ":A"],
					"stage": 0,
					"annotations": []
				});
			}

			// for (var i = 0; i < points.length; i++) {
			// 	var nextPointId = i + 1;
			// 	if (nextPointId > points.length - 1) nextPointId = 0;
			// }

			sketchData.stages.push({"constraints": constraintsStage, "generators": []});
			
			window.sketchData = JSON.stringify(sketchData);
		}
	}

	// {
	// 	"id": "3",
	// 	"type": "Segment",
	// 	"role": null,
	// 	"stage": 0,
	// 	"data": {
	// 		"a": {
	// 			"x": 503.5837087850063,
	// 			"y": 664.8472000944522
	// 		},
	// 		"b": {
	// 			"x": 1065.0848111702164,
	// 			"y": 664.8472000944522
	// 		}
	// 	}
	// }, {
	// 	"id": "12",
	// 	"type": "Segment",
	// 	"role": null,
	// 	"stage": 0,
	// 	"data": {
	// 		"a": {
	// 			"x": 1065.0848111702164,
	// 			"y": 664.8472000944522
	// 		},
	// 		"b": {
	// 			"x": 1065.0848111702164,
	// 			"y": 450.43450983902744
	// 		}
	// 	}
	// }, {
	// 	"id": "21",
	// 	"type": "Segment",
	// 	"role": null,
	// 	"stage": 0,
	// 	"data": {
	// 		"a": {
	// 			"x": 1065.0848111702164,
	// 			"y": 450.43450983902744
	// 		},
	// 		"b": {
	// 			"x": 432.60090739627094,
	// 			"y": 450.43450983902744
	// 		}
	// 	}
	// }, {
	// 	"id": "30",
	// 	"type": "Segment",
	// 	"role": null,
	// 	"stage": 0,
	// 	"data": {
	// 		"a": {
	// 			"x": 432.60090739627094,
	// 			"y": 450.43450983902744
	// 		},
	// 		"b": {
	// 			"x": 432.60090739627094,
	// 			"y": 597.098067317805
	// 		}
	// 	}
	// }, {
	// 	"id": "39",
	// 	"type": "Segment",
	// 	"role": null,
	// 	"stage": 0,
	// 	"data": {
	// 		"a": {
	// 			"x": 432.60090739627094,
	// 			"y": 597.098067317805
	// 		},
	// 		"b": {
	// 			"x": 503.5837087850063,
	// 			"y": 597.098067317805
	// 		}
	// 	}
	// }, {
	// 	"id": "48",
	// 	"type": "Segment",
	// 	"role": null,
	// 	"stage": 0,
	// 	"data": {
	// 		"a": {
	// 			"x": 503.5837087850063,
	// 			"y": 597.098067317805
	// 		},
	// 		"b": {
	// 			"x": 503.5837087850063,
	// 			"y": 664.8472000944522
	// 		}
	// 	}
	// }
}

function appendFromDxf(content){
	var parser = new DxfParser();
	var dxf = parser.parseSync(content);
	var shape = dxfToShape(dxf);
	// console.log(shape);
	if (window.selectedObject || window.clickedObject) {
		var obj = selectedObject;
		if (!obj.modifyKey && clickedObject) {
			obj = clickedObject;
		}
		var extracted = shape.extractPoints();
		var points = extracted.shape;
		var changeParams = {
			modifyKey: obj.modifyKey,
			points: points
		}
		window.service_data.shapeChanges.push(changeParams);

		updateModifyChanges();
		if (obj.wireframe) {
			obj.wireframe.remove();
		}
	}
}