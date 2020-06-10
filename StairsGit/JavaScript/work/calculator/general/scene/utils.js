$(function(){

	var object3DClasses = [
	"Scene","Sprite","LOD","Bone","Mesh","LineSegments","LineLoop","Line","Points",
	"Group","SpotLight","PointLight","RectAreaLight","HemisphereLight","DirectionalLight",
	"AmbientLight","Light","PerspectiveCamera","OrthographicCamera","CubeCamera","ArrayCamera",
	"Camera","Object3D","ImmediateRenderObject","GridHelper","PolarGridHelper",
	"BoxHelper","Box3Helper","PlaneHelper","ArrowHelper","AxesHelper","SVGObject"]

	object3DClasses.forEach(function(className){
		if (THREE[className]) {
			try {
				var testObject = new THREE[className]();
				if (testObject instanceof THREE.Object3D) {
					delete testObject;
					if (THREE[className].prototype && THREE[className].prototype.clone) {
						THREE[className].prototype.oldClone = THREE[className].prototype.clone;
						THREE[className].prototype.clone = function ( recursive ) {
							var obj = this.oldClone(recursive);
							if(this.layerName) obj.layerName = this.layerName;
							if(this.drawing) obj.drawing = this.drawing;
							if(this.specId) obj.specId = this.specId;
							if(this.specParams) obj.specParams = this.specParams;
							return obj;
						};
					}
				}
			} catch (error) {
			}
		}
	});

	var selectMaterial = new THREE.MeshLambertMaterial({ color: 0xFF00FF });
	THREE.Object3D.prototype.setLayer = function(layerName, force){
		this.traverse(function(node){
			if(!node.layerName || force) node.layerName = layerName;
		});
	};

	THREE.Object3D.prototype.specIdTraverse = function ( specId, callback ) {
		callback( this );

		if (!this.specId || this.specId == specId) {
			var children = this.children;
			for ( var i = 0, l = children.length; i < l; i ++ ) {
				children[ i ].specIdTraverse( specId, callback );
			}
		}
	},

	THREE.Object3D.prototype.setFullyVisible = function(){
		this.visible = true;
		if(this.parent && typeof this.parent.setFullyVisible == 'function') this.parent.setFullyVisible(this.parent);
	};

	THREE.Object3D.prototype.cloneWithSpec = function(){
		this.traverse(function(node){
			if (node.specId) {
				if(node.specParams){
					if(node.specParams.amt){
						node.specParams.specObj[node.specParams.partName]['amt'] += node.specParams.amt;
						node.specParams.specObj[node.specParams.partName]["types"][node.specParams.name] += node.specParams.amt;
					} 
					if(node.specParams.area) node.specParams.specObj[node.specParams.partName]['area'] += node.specParams.area;
					if(node.specParams.sumLength) node.specParams.specObj[node.specParams.partName]['sumLength'] += node.specParams.sumLength;
				}
			}
		});
		return new this.constructor().copy( this, true );
	};

	/**
	 * Метод позволяет поворачивать uv на конкретной плоскости объекта
	 */
	THREE.Geometry.prototype.rotateUV = function(angle, faceMaterialIndex){
		if (!faceMaterialIndex) faceMaterialIndex = 0;
		for (var i = 0; i < this.faces.length; i++) {
			var face = this.faces[i];
			if (face.materialIndex == faceMaterialIndex) {
				for (var j = 0; j < this.faceVertexUvs[0][i].length; j++) {
					var vector = this.faceVertexUvs[0][i][j];
					vector.rotateAround({x:0, y:0}, angle);
				}
			}
		}

		this.uvsNeedUpdate = true;
	};

	//Добавляем к сцене функцию для получения объекта по слою
	THREE.Scene.prototype.getObjectByLayerName = function(layerName){
		return this.getObjectByProperty("layerName", layerName)
	};

	//Добавляем к сцене функцию для получения объекта по слою
	THREE.Scene.prototype.getObjectsByLayerName = function(layerName){
		var objects = [];
		this.traverse(function(node){
			if(node.layerName && node.layerName.toString().indexOf(layerName) != -1) objects.push(node); 
		});
		objects.setVisible = function(visible){
			this.forEach(function(node){
				if(node.type !== 'Object3D') {
					node.visible = visible;
				}
			});
		}
		return objects;
	};
});

function drawTextureText(text, size){
	var canvasText = document.createElement('canvas');
	var contextCanvasText = canvasText.getContext('2d');
	contextCanvasText.font = "Bold 140pt Arial";
	contextCanvasText.fillStyle = "rgba(0,0,0,1)";
	contextCanvasText.fillText(text, 0, 140);
	
	// canvas contents will be used for a texture
	var textTexture = new THREE.Texture(canvasText) 
	textTexture.needsUpdate = true;
		
	var materialText = new THREE.MeshBasicMaterial( {map: textTexture, side:THREE.DoubleSide, depthTest: false } );
	materialText.transparent = true;
	
	var mesh = new THREE.Mesh(
		new THREE.PlaneGeometry(size, size),
		materialText
	);

	mesh.noWireFrames = true;
	return mesh;
}