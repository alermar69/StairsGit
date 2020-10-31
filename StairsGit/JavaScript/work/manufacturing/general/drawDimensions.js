function drawSceneDimensions(viewType){
	if (!viewType) viewType = '3d';
	var viewportId = 'vl_1';//Он у нас уже один, но функции используют этот ид
	removeObjects(viewportId, "dimensions");
	drawCustomDimensions(viewportId);
	setDimensions(viewportId, viewType);
	drawObjectDimensions(viewType)
}

function drawCustomDimensions(viewportId){	
	var mesh = new THREE.Object3D();
	
	var dimAmt = $("#dimAmt").val();
	for(var i=0; i<dimAmt; i++){
		var dimPar = {
			p1: {
				x: $("#startPointX" + i).val() * 1.0,
				y: $("#startPointY" + i).val() * 1.0,
				z: $("#startPointZ" + i).val()* 1.0,
				},
			p2: {
				x: $("#endPointX" + i).val() * 1.0,
				y: $("#endPointY" + i).val() * 1.0,
				z: $("#endPointZ" + i).val() * 1.0,
				},
			offset: $("#dimOffset" + i).val() * 1.0,
			basePlane: $("#dimBasePlane" + i).val(),
			baseAxis: $("#dimBaseAxis" + i).val(),
			dimSide: $("#dimSide" + i).val(),
			}
		var dim = drawDimension3D_2(dimPar).mesh;
		dim.position.x += $("#mooveX" + i).val() * 1.0;
		dim.position.y += $("#mooveY" + i).val() * 1.0;
		dim.position.z += $("#mooveZ" + i).val() * 1.0;
		mesh.add(dim);
	}

	drawAdditionalDimensions();

	addObjects(viewportId, mesh, "dimensions");
	//return mesh;
};

function drawAdditionalDimensions(callback){
	var mesh = new THREE.Object3D();

	setTimeout(function(){
		if (window.customDimensions && window.customDimensions.length > 0) {
			window.customDimensions.forEach(function(item){
				var target = new THREE.Vector3(); // create once an reuse it
				item.target.getWorldPosition( target );
				var axises = item.axises || ['x', 'y', 'z'];
				axises.forEach(function(axis){
					if (item.basePoint[axis] != target[axis]) {
						var basePoint = copyPoint(item.basePoint);
						var targetPoint = copyPoint(target);
						
						var dimPar = {
							p1: basePoint,
							p2: targetPoint,
							offset: item.offset || 100,
							baseAxis: axis,
							dimSide: item.dimSide || 'спереди',
						}
						
						if (item.basePlane) {
							dimPar.basePlane = item.basePlane
						}else{
							if (axis == 'x') dimPar.basePlane = 'xy';
							if (axis == 'y') dimPar.basePlane = 'xy';
							if (axis == 'z') dimPar.basePlane = 'yz';
						}
	
						var dim = drawDimension3D_2(dimPar).mesh;
						mesh.add(dim);
					}
				})
			});
		}
		addObjects('', mesh, "dimensions");

		if(callback) callback();
	}, 1000)
}

/** функция отрисовывает размер в 3D
*/

function drawDimension3D_2(par){
	
	par.mesh = new THREE.Object3D();
	par.mesh.setLayer('dimensions');
	if(!fontGlob) return par;
	
	var color = new THREE.Color( 0x000000 );
	var p1 = par.p1;
	var p2 = par.p2;
	var dimLineOverhang = 10 * params.dimScale;
	
	var min_X = Math.min(p1.x, p2.x);
	var max_X = Math.max(p1.x, p2.x);
	var min_Y = Math.min(p1.y, p2.y);
	var max_Y = Math.max(p1.y, p2.y);
	var min_Z = Math.min(p1.z, p2.z);
	var max_Z = Math.max(p1.z, p2.z);

//размеры в вертикальных плоскостях
if(par.basePlane == "xy" || par.basePlane == "yz"){
	//горизонтальный размер вверх от базовых точек
	if(par.baseAxis == "x" || par.baseAxis == "z"){
		if(par.offset > 0){
			var dimLineY = max_Y + par.offset;
			var endLineY = dimLineY + dimLineOverhang;
			};
		if(par.offset < 0){
			var dimLineY = min_Y + par.offset;
			var endLineY = dimLineY - dimLineOverhang;
			};
		
		var p11 = {x: p1.x, y: dimLineY, z: p1.z}
		var p12 = {x: p1.x, y: endLineY, z: p1.z}
		var p21 = {x: p2.x, y: dimLineY, z: p2.z}
		var p22 = {x: p2.x, y: endLineY, z: p2.z}
		
		//переводим точки в нужную плоскость
		if(par.basePlane == "xy"){
			p11.z = p12.z = p21.z = p22.z = min_Z;
			}
		if(par.basePlane == "yz"){
			p11.x = p12.x = p21.x = p22.x = min_X;
			}
		//выносные линии
		var line = drawLine3D(p1, p12, color);
		par.mesh.add(line);
		var line = drawLine3D(p2, p22, color);
		par.mesh.add(line);
		
		//размерная линия			
		var line = drawLine3D(p11, p21, color);
		par.mesh.add(line);
		
		//стрелка слева
		var arrowPar = {
			dir: "left",
			basePlane: par.basePlane,
			}
		if(p11.x > p21.x) arrowPar.dir = "right"; 
		var arrow = drawArrow(arrowPar).mesh;
		arrow.position.x = p11.x;
		arrow.position.y = p11.y;
		arrow.position.z = p11.z;
		par.mesh.add(arrow);
				
		//стрелка справа
		var arrowPar = {
			dir: "right",
			basePlane: par.basePlane,
			}
		if(p11.x > p21.x) arrowPar.dir = "left"; 
		var arrow = drawArrow(arrowPar).mesh;
		arrow.position.x = p21.x;
		arrow.position.y = p21.y;
		arrow.position.z = p21.z;
		par.mesh.add(arrow);
		
		//размерный текст
		if(par.basePlane == "xy"){
			var dimText = Math.round(Math.abs(p1.x - p2.x));
			var dimTextLen = String(Math.round(dimText)).length * 20 * params.dimScale;			
			var text = drawText3D(dimText, color);
			text.position.x = (p11.x + p21.x) / 2 - dimTextLen / 2;
			text.position.y = p11.y + 3;
			text.position.z = min_Z;
			if(par.dimSide == "сзади") {				
				text.rotation.y += Math.PI;
				text.position.x += dimTextLen;
				}			
			}
		if(par.basePlane == "yz"){
			var dimText = Math.round(Math.abs(p1.z - p2.z));
			var dimTextLen = String(Math.round(dimText)).length * 20 * params.dimScale;		
			var text = drawText3D(dimText, color);
			text.rotation.y = -Math.PI / 2;
			text.position.x = min_X;
			text.position.y = p11.y + 3;
			text.position.z = (p11.z + p21.z) / 2 - dimTextLen / 2;
			if(par.dimSide == "сзади") {				
				text.rotation.y += Math.PI;
				text.position.z += dimTextLen;
				};	
			}
		

		par.mesh.add(text);
		
			
		}
		
	//вертикальный размер
	
	if(par.baseAxis == "y"){
		if(par.basePlane == "xy"){
			if(par.offset > 0){
				var dimLineX = max_X + par.offset;
				var endLineX = dimLineX + dimLineOverhang;
				};
			if(par.offset < 0){
				var dimLineX = min_X + par.offset;
				var endLineX = dimLineX - dimLineOverhang;
				};
			
			var p11 = {x: dimLineX, y: p1.y, z: min_Z}
			var p12 = {x: endLineX, y: p1.y, z: min_Z}
			var p21 = {x: dimLineX, y: p2.y, z: min_Z}
			var p22 = {x: endLineX, y: p2.y, z: min_Z}
			}
		if(par.basePlane == "yz"){
			if(par.offset > 0){
				var dimLineZ = max_Z + par.offset;
				var endLineZ = dimLineZ + dimLineOverhang;
				};
			if(par.offset < 0){
				var dimLineZ = min_Z + par.offset;
				var endLineZ = dimLineZ - dimLineOverhang;
				};
			
			var p11 = {x: min_X, y: p1.y, z: dimLineZ}
			var p12 = {x: min_X, y: p1.y, z: endLineZ}
			var p21 = {x: min_X, y: p2.y, z: dimLineZ}
			var p22 = {x: min_X, y: p2.y, z: endLineZ}
			}

			//выносные линии
			var line = drawLine3D(p1, p12, color);
			par.mesh.add(line);
			var line = drawLine3D(p2, p22, color);
			par.mesh.add(line);
			
			//размерная линия			
			var line = drawLine3D(p11, p21, color);
			par.mesh.add(line);

			//стрелка снизу
			var arrowPar = {
				dir: "bot",
				basePlane: par.basePlane,
				}
			if(p11.y > p21.y) arrowPar.dir = "top"; 
			var arrow = drawArrow(arrowPar).mesh;
			arrow.position.x = p11.x;
			arrow.position.y = p11.y;
			arrow.position.z = p11.z;
			par.mesh.add(arrow);
					
			//стрелка сверху
			var arrowPar = {
				dir: "top",
				basePlane: par.basePlane,
				}
			if(p11.y > p21.y) arrowPar.dir = "bot"; 
			var arrow = drawArrow(arrowPar).mesh;
			arrow.position.x = p21.x;
			arrow.position.y = p21.y;
			arrow.position.z = p21.z;
			par.mesh.add(arrow);
		
		//размерный текст
		if(par.basePlane == "xy"){
			var dimText = Math.round(Math.abs(p1.y - p2.y));
			var dimTextLen = String(dimText).length * 20 * params.dimScale;
			var text = drawText3D(dimText, color);
			text.rotation.z = Math.PI / 2;
			text.position.x = p11.x - 3;
			text.position.y = (p11.y + p21.y)/2 - dimTextLen / 2;
			text.position.z = p11.z;
			if(par.dimSide == "сзади") {				
				text.rotation.x += Math.PI;
				text.position.y += dimTextLen;
				};		
			}
		if(par.basePlane == "yz"){
			var dimText = Math.round(Math.abs(p1.y - p2.y));
			var dimTextLen = String(Math.round(dimText)).length * 20 * params.dimScale;		
			var text = drawText3D(dimText, color);
			text.rotation.y = -Math.PI / 2;
			text.rotation.x = -Math.PI / 2;
			text.position.x = min_X;
			text.position.y = (p11.y + p21.y) / 2 - dimTextLen / 2;
			text.position.z = p11.z - 3;
			if(par.dimSide == "сзади") {				
				text.rotation.y += Math.PI;
				text.position.y += dimTextLen;
				};				
			}
		par.mesh.add(text);
		}	
	}

//размеры в горизонтальной плоскости
if(par.basePlane == "xz"){
	if(par.baseAxis == "x"){
		if(par.offset > 0){
			var dimLineZ = max_Z + par.offset;
			var endLineZ = dimLineZ + dimLineOverhang;
			};
		if(par.offset < 0){
			var dimLineZ = min_Z + par.offset;
			var endLineZ = dimLineZ - dimLineOverhang;
			};
		
		var p11 = {x: p1.x, y: max_Y, z: dimLineZ}
		var p12 = {x: p1.x, y: max_Y, z: endLineZ}
		var p21 = {x: p2.x, y: max_Y, z: dimLineZ}
		var p22 = {x: p2.x, y: max_Y, z: endLineZ}
		}
	if(par.baseAxis == "z"){
		if(par.offset > 0){
			var dimLineX = max_X + par.offset;
			var endLineX = dimLineX + dimLineOverhang;
			};
		if(par.offset < 0){
			var dimLineX = min_X + par.offset;
			var endLineX = dimLineX - dimLineOverhang;
			};
		
		var p11 = {x: dimLineX, y: max_Y, z: p1.z}
		var p12 = {x: endLineX, y: max_Y, z: p1.z}
		var p21 = {x: dimLineX, y: max_Y, z: p2.z}
		var p22 = {x: endLineX, y: max_Y, z: p2.z}
		}

		//выносные линии
		var line = drawLine3D(p1, p12, color);
		par.mesh.add(line);
		var line = drawLine3D(p2, p22, color);
		par.mesh.add(line);
		
		//размерная линия			
		var line = drawLine3D(p11, p21, color);
		par.mesh.add(line);
		
		//стрелка 1
		var arrowPar = {
			dir: "left",
			basePlane: par.basePlane,
			}
		if(p11.x > p21.x) arrowPar.dir = "right";
		if(par.baseAxis == "z"){
			arrowPar.dir = "bot";
			if(p11.z > p21.z) arrowPar.dir = "top";
			}
		var arrow = drawArrow(arrowPar).mesh;
		arrow.rotation.x = Math.PI / 2;
		arrow.position.x = p11.x;
		arrow.position.y = p11.y;
		arrow.position.z = p11.z;
		par.mesh.add(arrow);
				
		//стрелка 2
		var arrowPar = {
			dir: "right",
			basePlane: par.basePlane,
			}
		if(p11.x > p21.x) arrowPar.dir = "left"; 
		if(par.baseAxis == "z"){
			arrowPar.dir = "top";
			if(p11.z > p21.z) arrowPar.dir = "bot";
			}
		var arrow = drawArrow(arrowPar).mesh;
		arrow.rotation.x = Math.PI / 2;
		arrow.position.x = p21.x;
		arrow.position.y = p21.y;
		arrow.position.z = p21.z;
		par.mesh.add(arrow);
		
		//размерный текст
		if(par.baseAxis == "x"){
			var dimText = Math.round(Math.abs(p1.x - p2.x));
			var dimTextLen = String(Math.round(dimText)).length * 20 * params.dimScale;			
			var text = drawText3D(dimText, color);
			text.rotation.x = -Math.PI / 2;
			text.position.x = (p11.x + p21.x) / 2 - dimTextLen / 2;
			text.position.y = p11.y;
			text.position.z = p11.z - 3;
			if(par.dimSide == "сзади") {				
				text.rotation.y += Math.PI;
				text.position.x += dimTextLen;
				};			
			}
		if(par.baseAxis == "z"){
			var dimText = Math.round(Math.abs(p1.z - p2.z));
			var dimTextLen = String(Math.round(dimText)).length * 20 * params.dimScale;			
			var text = drawText3D(dimText, color);
			text.rotation.x = -Math.PI / 2;
			text.rotation.z = -Math.PI / 2;
			text.position.x = p11.x + 3;
			text.position.y = p11.y;
			text.position.z = (p11.z + p21.z) / 2 - dimTextLen / 2;
			if(par.dimSide == "сзади") {				
				text.rotation.x += Math.PI;
				text.position.z += dimTextLen;
				};
			}
		par.mesh.add(text);

}

	if (dimText) par.text = dimText;
	if (par.mirror) {
		if (par.basePlane == "xz" && par.baseAxis == "z" || (par.baseAxis == "x" || par.baseAxis == "z") && par.basePlane == "yz") {
			if(par.dimSide == "сзади") {
				text.rotation.z -= Math.PI;
				// text.position.z -= dimTextLen;
			}else{
				text.rotation.z += Math.PI;
				text.position.z += dimTextLen;
			}
		}else if (par.basePlane == 'xy' || par.basePlane == "yz") {
			if(par.baseAxis == "y"){
				text.rotation.z += Math.PI;
				if (par.dimSide == 'спереди') {
					text.position.y += dimTextLen;
				}else{
					text.position.y -= dimTextLen;
				}
			}
		}else{
			text.rotation.z += Math.PI;
		}
	}
	if (par.mirrorSide) {
		if (par.basePlane == 'xy' || par.basePlane == "yz") {
			if(par.baseAxis == "y"){
				text.rotation.z += Math.PI;
				if (par.dimSide == 'сзади') {
					text.position.y -= dimTextLen;
				}else{
					text.position.y += dimTextLen;
				}
			}
		}else if(par.basePlane == 'xz'){
			if (par.baseAxis == 'x') {
				text.rotation.z += Math.PI;
				if (par.dimSide == 'сзади') {
					text.position.x -= dimTextLen;
				}else{
					text.position.x += dimTextLen;
				}
			}
		}
	}
	if (par.alwaysOnTop) {
		par.mesh.traverse(function(node){
			if (node.material && !window.location.href.includes("/customers")) {
				node.material.depthTest = false;
				node.setLayer('dimensions');
			}
		});
	}
	return par;

}//end of drawDimension3D_2

/** функция отрисовывает стрелку на конце размера
dir: "left" || "right" || "top" || "bot"
basePlane
*/

function drawArrow(par){
	par.mesh = new THREE.Object3D();
	var tempMesh = new THREE.Object3D();
	var color = new THREE.Color( 0x000 );
	var size = 20 * params.dimScale;
	
	//стрелка слева в плоскости xy
	var p0 = {x:0, y:0, z:0};
	var p1 = newPoint_xy(p0, size, size / 2)
	var p2 = newPoint_xy(p0, size, -size / 2)
	var line = drawLine3D(p0, p1, color);
	tempMesh.add(line);
	var line = drawLine3D(p0, p2, color);
	tempMesh.add(line);
	
	if(par.dir == "left") tempMesh.rotation.z = 0;
	if(par.dir == "right") tempMesh.rotation.z = Math.PI;
	if(par.dir == "top") tempMesh.rotation.z = -Math.PI / 2;
	if(par.dir == "bot") tempMesh.rotation.z = Math.PI / 2;
	
	if(par.basePlane == "yz") tempMesh.rotation.y = -Math.PI / 2;
	
	par.mesh.add(tempMesh);
	
	return par;

} //end of drawArrow



