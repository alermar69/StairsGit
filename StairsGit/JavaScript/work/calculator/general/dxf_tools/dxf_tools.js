function calcVectorsAngle(p1, p2) {
	var v1 = new THREE.Vector2(p1.x, p1.y);
	var v2 = new THREE.Vector2(p2.x, p2.y);
	v2.sub(v1); // sets v2 to be our chord
	v2.normalize();
	if(v2.y < 0) return -Math.acos(v2.x);
	return Math.acos(v2.x);
}

function dxfToPath(data){
	var path = new THREE.Shape();

	$.each(data.entities, function(){
		var entity = this;

		if(entity.type == "LINE"){
			if (entity.vertices.length > 1) {
				path.moveTo(entity.vertices[0].x, entity.vertices[0].y);
				for (var i = 1; i < entity.vertices.length; i++) {
					var point = entity.vertices[i];
					path.lineTo(point.x, point.y);
				}
			}
		}

		if (entity.type === 'LWPOLYLINE' || entity.type === 'POLYLINE') {
			if (entity.vertices.length > 1) {
				path.moveTo(entity.vertices[0].x, entity.vertices[0].y);
				for (var i = 1; i < entity.vertices.length; i++) {
					var point = entity.vertices[i];
					if (!point.bulge) {
						path.lineTo(point.x, point.y);
					}else{
						var points = [];
						
						var endPoint = i + 1 < entity.vertices.length ? entity.vertices[i + 1] : entity.vertices[0];

						var p0 = new THREE.Vector2(entity.vertices[i].x, entity.vertices[i].y) || new THREE.Vector2(0,0);
						var p1 = endPoint ? new THREE.Vector2(endPoint.x, endPoint.y) : new THREE.Vector2(1,0);
				
						var bulge = entity.vertices[i].bulge;
						var startPoint = entity.vertices[i];
						
						var angle = 4 * Math.atan(bulge);
						var radius = p0.distanceTo(p1) / 2 / Math.sin(angle/2);
						var center = polar(startPoint, calcVectorsAngle(p0,p1) + (Math.PI / 2 - angle/2), radius);
					
						var segments = Math.max( Math.abs(Math.ceil(angle/(Math.PI/18))), 6); // Сегментом считается участок 10 градусов
						var startAngle = calcVectorsAngle(center, p0);
						var thetaAngle = angle / segments;

						points.push(new THREE.Vector3(p0.x, p0.y, 0));
					
						for(var j = 1; j <= segments - 1; j++) {
							var vertex = polar(center, startAngle + thetaAngle * j, Math.abs(radius));
							points.push(new THREE.Vector3(vertex.x, vertex.y, 0));
						}

						path.lineTo(points[0].x, points[0].y);
						path.setFromPoints(points);
					}
				}
				path.lineTo(entity.vertices[0].x, entity.vertices[0].y);
			}
		}

		if(entity.type == "CIRCLE"){
			path.ellipse(entity.center.x, entity.center.y, entity.radius, entity.radius, 0, 0, Math.PI, false);
		};
		
		if(entity.type == "ARC"){
			path.arc(entity.center.x, entity.center.y, entity.radius, entity.startAngle, entity.endAngle, false);
		}
	});
	return path;
}

function dxfToShape(data){

	var mainEntities = data.entities.filter(function(entity){
		return entity.layer.toLowerCase() != 'holes'
	})

	var holeEntities = data.entities.filter(function(entity){
		return entity.layer.toLowerCase() == 'holes'
	})

	var mainShape = dxfToPath({entities: mainEntities})
	if (holeEntities.length > 0) {
		holeEntities.forEach(function(entity){
			if (entity.type === 'LWPOLYLINE' || entity.type === 'POLYLINE') {
				var hole = dxfToPath({entities: [entity]});
				mainShape.holes.push(hole);
			}
		})
	}

	debugger;
	
	return mainShape;
}
