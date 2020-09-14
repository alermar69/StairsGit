$(function(){
	$("#downloadModifyDxf").click(function(){
		getSelectedObjectDxf();
	});

	$("#dxfModifyFile").change(function(){
		var dxfModifyFile = $('#dxfModifyFile').prop('files') ? $('#dxfModifyFile').prop('files')[0] : false;
		console.log(dxfModifyFile);
		if (dxfModifyFile) {
			dxfModifyFile.text().then(function(content){
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
			});
		}
		$('#dxfModifyFile').val(null);
	});

	$('#uploadModifyDxf').click(function(){
		$('#dxfModifyFile').click();
	});
})