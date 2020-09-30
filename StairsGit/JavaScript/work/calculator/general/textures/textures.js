var imgPath = "/images/calculator/textures";

function getHandrailMaterial(angle){
	var color = params.handrailsColor
	if(params.calcType == "vint"){
		if(params.handrailMaterial == "ПВХ") color = params.handrailColor
		if(params.handrailMaterial == "Дуб") color = params.timberColorNumber
	}

	var material = new THREE.MeshStandardMaterial({
		metalness: 0.1,
		roughness: 0.5,
		bumpScale: 0.1,
		color: getTimberColorId(color),//angle == 0 ? 0xFF0000 : 0x00FF00,
	});
	

	var diffuse = getTimberDiffuse(params.handrailsMaterial).diffuse;

	diffuse.rotation += angle || 0;
/*
	material.normalMap = new THREE.TextureLoader(texturesManger).load( imgPath + "/stairs/"+$('#timberMat').val()+"_norm.jpg" );
	material.normalMap.wrapS = diffuse.wrapT = THREE.RepeatWrapping;
	material.normalMap.repeat.set( 1 / 400, 1 / 400 );
	material.normalMap.offset.set( 0.1, 0.5 );
	material.normalMap.rotation += angle || 0;
	material.normalScale = new THREE.Vector2( 1, - 1 );
*/
	material.map = diffuse;
	material.needsUpdate = true;

	return material;
}

function getNewellMaterial(angle){
	var material = new THREE.MeshStandardMaterial({
		metalness: 0.1,
		roughness: 0.5,
		bumpScale: 0.1,
		color: getTimberColorId(params.newellsColor),//angle == 0 ? 0xFF0000 : 0x00FF00,
	});

	var diffuse = getTimberDiffuse(params.newellsMaterial).diffuse;
	diffuse.rotation += angle || 0;
	material.map = diffuse;
/*
	material.normalMap = new THREE.TextureLoader(texturesManger).load( imgPath + "/stairs/"+$('#timberMat').val()+"_norm.jpg" );
	material.normalMap.wrapS = diffuse.wrapT = THREE.RepeatWrapping;
	material.normalMap.repeat.set( 1 / 400, 1 / 400 );
	material.normalMap.offset.set( 0.1, 0.5 );
	material.normalMap.rotation += angle || 0;
	material.normalScale = new THREE.Vector2( 1, - 1 );
*/
	material.needsUpdate = true;

	return material;
}

function getBalMaterial(angle){
	var material = new THREE.MeshStandardMaterial({
		metalness: 0.3,
		roughness: 0.5,
		bumpScale: 0.1,
		color: getTimberColorId(params.timberBalColor),//angle == 0 ? 0xFF0000 : 0x00FF00,
	});

	var diffuse = getTimberDiffuse(params.timberBalMaterial).diffuse;
	diffuse.rotation += angle || 0;
	material.map = diffuse;
/*
	material.normalMap = new THREE.TextureLoader(texturesManger).load( imgPath + "/stairs/"+$('#timberMat').val()+"_norm.jpg" );
	material.normalMap.wrapS = diffuse.wrapT = THREE.RepeatWrapping;
	material.normalMap.repeat.set( 1 / 400, 1 / 400 );
	material.normalMap.offset.set( 0.1, 0.5 );
	material.normalMap.rotation += angle || 0;
	material.normalScale = new THREE.Vector2( 1, - 1 );
*/
	material.needsUpdate = true;

	return material;
}

function getGlassMaterial(){
	var material = new THREE.MeshLambertMaterial({
		opacity: 0.3,
		color: 0x3AE2CE,
		transparent: true,
		// specular:0xffffff,
		combine: THREE.MultiplyOperation,
		// shininess: 50,
		reflectivity: 1.0
	});
	material.envMap	= view.scene.background;
	return material;
}

function getMetalMaterial(color){
	var material = metalMaterial2 = new THREE.MeshStandardMaterial({
		color: getMetalColorId(color),
		metalness: 0.5,//0.5,
		roughness: 0.3,//.3,
		bumpScale: 0.1,
	});

	material.envMap = view.scene.background;
	material.envMapIntensity = 0.8;
	material.reflectivity = 1;

	var grayness = (material.color.r + material.color.g + material.color.b) / 3;
	material.emissive = new THREE.Color(material.color.r * 0.3, material.color.g * 0.3, material.color.b * 0.3);
	var textureLoader = new THREE.TextureLoader(texturesManger);
	if(grayness < 0.9){
		textureLoader.load( imgPath + "/metal.jpg", function ( map ) {
			map.wrapS = THREE.RepeatWrapping;
			map.wrapT = THREE.RepeatWrapping;
			map.anisotropy = 4;
			map.repeat.set( 0.005, 0.005 );

			material.map = map;
			material.needsUpdate = true;
		});
	}


	textureLoader.load( imgPath + "/metal_NORM.jpg", function ( map ) {
		map.wrapS = THREE.RepeatWrapping;
		map.wrapT = THREE.RepeatWrapping;
		map.anisotropy = 4;
		map.repeat.set( 0.005, 0.005 );

		material.normalMap = map;
		material.bumpMap = map;
		material.normalScale = new THREE.Vector2( 1, - 1 );
		material.needsUpdate = true;
	});
	return material;
}

function getLaserMaterial(angle){
	var material = metalMaterial2 = new THREE.MeshStandardMaterial({
		color: getMetalColorId(params.metalBalColor),
		metalness: 0.5,//0.5,
		roughness: 0.3,//.3,
		bumpScale: 0.1,
		transparent: true,
		alphaTest: 0.5,
	});

	material.envMap = view.scene.background;
	material.envMapIntensity = 0.8;
	material.reflectivity = 1;

	var textureLoader = new THREE.TextureLoader(texturesManger);
	textureLoader.load( imgPath + "/metal.jpg", function ( map ) {
		map.wrapS = THREE.RepeatWrapping;
		map.wrapT = THREE.RepeatWrapping;
		map.anisotropy = 4;
		map.repeat.set( 0.005, 0.005 );

		material.map = map;
		material.needsUpdate = true;
	});
	textureLoader.load( imgPath + "/metal_NORM.jpg", function ( map ) {
		map.wrapS = THREE.RepeatWrapping;
		map.wrapT = THREE.RepeatWrapping;
		map.anisotropy = 4;
		map.repeat.set( 0.005, 0.005 );

		material.normalMap = map;
		material.bumpMap = map;
		material.normalScale = new THREE.Vector2( 1, - 1 );
		material.needsUpdate = true;
	});
	textureLoader.load( imgPath + "/alphamap.jpg", function ( map ) {
		map.wrapS = THREE.RepeatWrapping;
		map.wrapT = THREE.RepeatWrapping;
		map.anisotropy = 4;
		map.repeat.set( 0.0015, 0.0015 );
		map.offset.set(-0.25, 0.2)
		map.rotation = angle;
		material.alphaMap = map;
		material.needsUpdate = true;
	});
	return material;
}

function getSkirtingMaterial(){
	var material = new THREE.MeshPhysicalMaterial({
		metalness: 0.3,
		roughness: 0.5,
		color: getTimberColorId(params.skirtingColor),
		bumpScale: 0.1,
	});

	var diffuse = getTimberDiffuse(params.skirtingMaterial).diffuse;
	material.map = diffuse;
	/*
	material.normalMap = getTimberNormalMap();
	material.normalScale = new THREE.Vector2(1,-1);
	*/
	material.needsUpdate = true;

	return material;
}

function getTreadMaterial(){

	var material = new THREE.MeshStandardMaterial({
		metalness: 0.1,
		roughness: 0.48,
		color: getTimberColorId(params.treadsColor),
		bumpScale: 0.1,
	});
	
	if (params.stairType == "рифленая сталь") {
		material.color = new THREE.Color(getMetalColorId(params.carcasColor));
	}

	var diffuse = getTreadDiffuse();

	//material.normalMap = getTimberNormalMap();
	//material.normalScale = new THREE.Vector2(1,-1);

	material.map = diffuse;
	material.needsUpdate = true;

	if (params.stairType !== 'пресснастил') {
		return material;
	}

	if (params.stairType == 'пресснастил') {
		var treadMaterial2 = new THREE.MeshPhysicalMaterial({
			metalness: 0.3,
			roughness: 0.5,
			color: getTimberColorId(params.treadsColor),
			bumpScale: 0.1,
		});
		var diffuse = new THREE.TextureLoader(texturesManger).load( imgPath + "/stairs/press_metal_2.jpg" );
		diffuse.wrapS = diffuse.wrapT = THREE.RepeatWrapping;

		diffuse.repeat.set( 1/400, 1/400 );
		diffuse.offset.set( 0.1, 0.1 );
		treadMaterial2.map = diffuse;

		var mats = [material,treadMaterial2];
		// var faceMaterial = new THREE.MeshFaceMaterial(mats);
		return mats;
	}

}

function getRiserMaterial(){
	var material = new THREE.MeshPhysicalMaterial({
		metalness: 0.3,
		roughness: 0.5,
		color: getTimberColorId(params.risersColor),
		bumpScale: 0.1,
	});

	material.map = getTimberDiffuse(params.riserMaterial).diffuse;
	material.map.rotation = Math.PI / 2;
/*
	material.normalMap = getTimberNormalMap();
	material.normalMap.rotation = Math.PI / 2;
	material.normalScale = new THREE.Vector2(1,-1);
*/
	material.needsUpdate = true;

	return material;
}

function getFloorMaterial(floor){

	var matName = params.floorMat;
	var mapScale = params.mapScaleFloor
	if(floor == "top") {
		matName = params.floorMat2;
		mapScale = params.mapScaleTopFloor
	}


	var textureParams = getTextureParams();

	// debugger;
	var material = new THREE.MeshPhysicalMaterial();
	$.each(textureParams.floor.main, function(key){
		material[key] = this;
	})

	material.transparent = false;
	if(floor == "top" && gui.__controllers[0].object.transparentWalls){
		material.transparent = true;
		material.opacity = 0.3;
	}

	if(!matName) return material;

	var map = new THREE.TextureLoader(texturesManger).load( imgPath + "/floor/" + matName + ".jpg" );
	map.wrapS = map.wrapT = THREE.RepeatWrapping;
	//общие настройки
	$.each(textureParams.floor.mapPar, function(key){
		map[key] = this;
	})
	//настройки конкретного материала

	if(textureParams.floor.matPar[matName]){
		$.each(textureParams.floor.matPar[matName], function(key){
			if (key == 'metalness' || key == 'roughness' || key == 'color' || key == 'bumpScale' || key == 'normalScale' || key == 'reflectivity' || key == 'refractionRatio') {
				material[key] = this;
			}
			map[key] = this;
		})
	}
console.log(mapScale)
	map.repeat.x *= mapScale;
	map.repeat.y *= mapScale;

	material.map = map;

	//карта нормалей
	var normalMap = new THREE.TextureLoader(texturesManger).load( imgPath + "/floor/maps/" + matName + ".jpg" );
	normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
	//общие настройки
	$.each(textureParams.floor.normalMapPar, function(key){
		normalMap[key] = this;
	})
	//настройки конкретного материала
	if(textureParams.floor.matPar[matName]){
		$.each(textureParams.floor.matPar[matName], function(key){
			if (key == 'metalness' || key == 'roughness' || key == 'color' || key == 'bumpScale' || key == 'normalScale' || key == 'reflectivity' || key == 'refractionRatio') {
				material[key] = this;
			}
			normalMap[key] = this;
		})
	}

	normalMap.repeat.x *= mapScale;
	normalMap.repeat.y *= mapScale;
	material.normalMap = normalMap;
	material.bumpMap = normalMap;


	material.needsUpdate = true;

	//непонятный костыль чтобы был нормальный масштаб текстуры верхнего перекрытия
	if(floor == "top") {
		material.map.repeat.x *= 0.00005;
		material.map.repeat.y *= 0.00005;
	}
	console.log("Материал пола: ", material)

	return material;
}

function onTextureLoad(texture){
	console.log(texture);
}

/** старая функция - нужно удалить
*/

function getCeilMaterial(){
	var material = new THREE.MeshPhysicalMaterial({
		metalness: 0.1,
		roughness: 0.48,
		color: params.ceilColor,
		bumpScale: 0.1,
	});
	if(gui.__controllers[0].object.transparentWalls){
		material.transparent = true;
		material.opacity = 0.3;
	}

	if (window.location.href.includes("customers")) {
		material.transparent = true;
		material.opacity = 0.5;
	}

	return material;
}

function getWallMaterial(type){

	var textureParams = getTextureParams();
	var material = new THREE.MeshPhysicalMaterial();
	$.each(textureParams.walls.main, function(key){
		material[key] = this;
	})

	var matName = params.wallsMat;
	var mapScale = params.mapScaleWalls;
	if(type == "ceil") {
		matName = params.ceilMat;
		mapScale = params.mapScaleCeil;
	}

	material.transparent = false;

	if(gui.__controllers[0].object.transparentWalls){
		material.transparent = true;
		material.opacity = 0.3;
	}

	if (window.location.href.includes("customers")) {
		material.transparent = true;
		material.opacity = 0.5;
	}

	if(!matName) return material;

	//текстура

	if (matName !== 'painted') {
		var map = new THREE.TextureLoader(texturesManger).load( imgPath + "/walls/" + matName + ".jpg" );
		map.wrapS = map.wrapT = THREE.RepeatWrapping;
		//общие настройки
		$.each(textureParams.walls.mapPar, function(key){
			map[key] = this;
		})
		//настройки конкретного материала
		if(textureParams.walls.matPar[matName]){
			$.each(textureParams.walls.matPar[matName], function(key){
				if (key == 'metalness' || key == 'roughness' || key == 'color' || key == 'bumpScale' || key == 'normalScale' || key == 'reflectivity' || key == 'refractionRatio') {
					material[key] = this;
				}
				map[key] = this;
			})
		}

		map.repeat.x *= mapScale;
		map.repeat.y *= mapScale;

		material.map = map;

		//карта нормалей
		var normalMap = new THREE.TextureLoader(texturesManger).load( imgPath + "/walls/maps/" + matName + ".jpg" );
		normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
		//общие настройки
		$.each(textureParams.walls.normalMapPar, function(key){
			normalMap[key] = this;
		})
		//настройки конкретного материала
		if(textureParams.walls.matPar[matName]){
			$.each(textureParams.walls.matPar[matName], function(key){
				if (key == 'metalness' || key == 'roughness' || key == 'color' || key == 'bumpScale' || key == 'normalScale' || key == 'reflectivity' || key == 'refractionRatio') {
					material[key] = this;
				}
				normalMap[key] = this;
			})
		}

		normalMap.repeat.x *= mapScale;
		normalMap.repeat.y *= mapScale;
		material.normalMap = normalMap;
		material.bumpMap = normalMap;


		//непонятный костыль чтобы был нормальный масштаб текстуры верхнего перекрытия
		if(type == "ceil") {
			material.map.repeat.x *= 0.0002;
			material.map.repeat.y *= 0.0002;
		}
	}

	material.needsUpdate = true;

	console.log("Материал стен: ", material)

	return material;
}


function getTreadDiffuse(){

	var diffuse =  getTimberDiffuse(params.treadsMaterial).diffuse;
	if(params.calcType == "vint") var diffuse =  getTimberDiffuse(params.treadMaterial).diffuse;
	if (params.stairType == "рифленая сталь") {
		diffuse = new THREE.TextureLoader(texturesManger).load( imgPath + "/stairs/rif_metal.jpg" );
		diffuse.wrapS = diffuse.wrapT = THREE.RepeatWrapping;
		diffuse.repeat.set( 1 / 400, 1 / 400 );
		diffuse.offset.set( 0.1, 0.5 );
	}
	if (params.stairType == "пресснастил") {
		diffuse = new THREE.TextureLoader(texturesManger).load( imgPath + "/stairs/press_metal.jpg" );
		diffuse.wrapS = diffuse.wrapT = THREE.RepeatWrapping;
		diffuse.repeat.set( 1 / 100, 1 / 100 );
		diffuse.offset.set( 0.1, 0.5 );
	}
	if (params.stairType == "дпк") {
		diffuse = new THREE.TextureLoader(texturesManger).load( imgPath + "/stairs/dpc.jpg" );
		diffuse.wrapS = diffuse.wrapT = THREE.RepeatWrapping;
		diffuse.repeat.set( 1 / 100, 0.00674 );
		diffuse.offset.set( 0.1, 0 );
	}
	return diffuse
}

function getTimberNormalMap(){
	var normal = new THREE.TextureLoader(texturesManger).load( imgPath + "/stairs/"+$('#timberMat').val()+"_norm.jpg" );
	normal.wrapS = normal.wrapT = THREE.RepeatWrapping;
	normal.repeat.set( 1 / 400, 1 / 400 );
	normal.offset.set( 0.1, 0.5 );
	return normal;
}


function getChromeMaterial(){

	var material = new THREE.MeshPhongMaterial( {
		color: 0xABABAB,
		specular:0xABABAB,
		combine: THREE.MultiplyOperation,
		shininess: 50,
		reflectivity: 0.5
	});
	/*
	// var geometry	= new THREE.SphereGeometry(150, 150, 150);
	// var mesh	= new THREE.Mesh(geometry, material)
	// mesh.position.set(0, 1200, 1500)
	// scene.add( mesh );
	// var cubeCamera	= new THREEx.CubeCamera(mesh);
	// cubeCamera.object3d.position.set(0, 1200, 1500)
	// params.materials.cubeCamera = cubeCamera;
	// scene.add(cubeCamera.object3d);
	material.envMap	= view.scene.background;//cubeCamera.textureCube.texture;
	*/
	/*
	var material = new THREE.MeshLambertMaterial({
		name: 'inox',
		color: 0xAEAEAE,
		metalness: 0.5,
		});


	var material = metalMaterial2 = new THREE.MeshStandardMaterial({
		color: 0xAEAEAE,
		metalness: 0.5,//0.5,
		roughness: 1,//.3,
		bumpScale: 0.1,
	});
	*/
	return material;
}

function getLedgeMaterial(matName, color, textureScale){
	var material = new THREE.MeshPhysicalMaterial({
		metalness: 0.3,
		roughness: 0.5,
		bumpScale: 0.1,
	});

	textureScale = textureScale || {x:1,y:1};

	//масштаб текстуры
	var scale = 10;
	if(matName == 'brick_01' || matName == 'brick_02') scale = 4;
	if(matName == 'timber') scale = 6;

	if (matName !== 'brick_01' && matName !== 'brick_02') {
		material.color = new THREE.Color(color);
		material.needsUpdate = true;
	}
	if (matName !== 'painted') {
		var diffuse = new THREE.TextureLoader(texturesManger).load( imgPath + "/walls/" + matName + ".jpg" );
		diffuse.wrapS = diffuse.wrapT = THREE.RepeatWrapping;
		diffuse.repeat.set( scale * textureScale.x, scale * textureScale.y );
		diffuse.offset.set( 0.1, 0.5 );
		material.map = diffuse;
	}

	material.needsUpdate = true;

	return material;
}

function initTextureMaterials(){
	console.log("initTextureMaterials")
	params.materials.texture = {
		metal: getMetalMaterial(params.carcasColor),
		metal_railing: getMetalMaterial(params.metalBalColor),
		glass: getGlassMaterial(),
		tread: getTreadMaterial(),
		skirting: getSkirtingMaterial(),
		riser: getRiserMaterial(),
		floor: getFloorMaterial(),
		ceil: getWallMaterial("ceil"),
		topFloor: getFloorMaterial('top'),
		wall: getWallMaterial(),
		handrail: getHandrailMaterial(0),
		chrome: getChromeMaterial(),
		bal: getBalMaterial(0),
		bal2: getBalMaterial(Math.PI / 2),
		newell: getNewellMaterial(0),
		newell2: getNewellMaterial(Math.PI / 2),
	};
	if(params.calcType == "vint") params.materials.texture.metal_railing = getMetalMaterial(params.carcasColor);

	params.materials.texture.wall.color = new THREE.Color($('#wallsColor').val());
	params.materials.texture.floor.color = new THREE.Color($('#floorColor').val());
	params.materials.texture.ceil.color = new THREE.Color($('#ceilColor').val());
	params.materials.texture.topFloor.color = new THREE.Color($('#floorColor2').val());

	//переносим имя текстуры
	$.each(params.materials.texture, function(key){
		if(params.materials[key]) this.name = params.materials[key].name;
	})

}

var texturesManger;
function initObjectShadowsMaterials2(scene){

	texturesManger = new THREE.LoadingManager();//Создаем загрузчик
	texturesManger.onProgress = loaderProgress;

	initTextureMaterials();
	//Заставляем объекты отбрасывать тени
	scene.traverse( function( node ) {
		if (node instanceof THREE.LineSegments) {
			node.visible = false;
		}
		if ( node instanceof THREE.Mesh ) {
			node.castShadow = true;

			if (node.material.name == 'metal_railing') {
				node.material = params.materials.texture.metal_railing;
			}
			if (node.material.name == 'timber' || node.material.name == 'timber2') {
				node.material = params.materials.texture.tread;
				if (node.userData.angle) {
					var material = getTreadMaterial();
					material.map.rotation += node.userData.angle;
					material.normalMap.rotation += node.userData.angle;

					var material2 = params.materials.texture.tread;
					var mats = [material,material2];
					node.material = mats;
				}
			}
			if (node.material.name == 'tread') {
				node.material = params.materials.texture.tread;
			}
			if (node.material.name == 'dpc') {
				node.material = params.materials.texture.tread;
			}
			if (node.material.name == 'newell') {
				if (node.userData){
					if (node.userData.type == "timberNewell") {
						node.material = params.materials.texture.newell2;
						return;
					}
				}
				var mats = [params.materials.texture.newell2,params.materials.texture.newell];
				node.material = mats;
			}
			if (node.material.name == 'bal') {
				if (node.name !== "") {
					node.material = params.materials.texture.bal;
				}else{
					var mats = [params.materials.texture.bal2, params.materials.texture.bal];
					// var faceMaterial = new THREE.MeshFaceMaterial(mats);
					node.material = mats;
				}
			}

			if (node.material.name == 'riser') {
				node.material = params.materials.texture.riser;
			}
			if (node.material.name == 'inox') {
				node.material = params.materials.texture.chrome;
			}
			if (node.material.name == 'metal' || node.material.name == 'metal2') {
				node.material = params.materials.texture.metal;
			}
			if (node.material.name == 'skirting') {
				node.material = params.materials.texture.skirting;
			}
			if (node.material.name == 'handrail') {
				var material1 = getHandrailMaterial(node.userData.angle);
				var material2 = params.materials.texture.handrail;
				var mats = [material1,material2];
				// var faceMaterial = new THREE.MeshFaceMaterial(mats);
				node.material = mats;
			}
			if (node.material.name == 'glass') {
				node.castShadow = false;
				node.material = params.materials.texture.glass;
			}
			if (node.material.name == 'wallMaterial'){
				node.receiveShadow = true;
				node.castShadow = false;
				node.material = params.materials.texture.wall;
			}
			if (node.userData.isLedge) {
				var matName = $('#wallLedgeMat' + node.userData.id).val();
				var color = $('#wallLedgeColor' + node.userData.id).val();
				var x = $('#wallLedgeWidth' + node.userData.id).val();
				var y = $('#wallLedgeHeight' + node.userData.id).val();
				if (matName && color) {
					var scale = {x: x / 4000, y: y / 4000};
					node.material = getLedgeMaterial(matName, color, scale);
				}
			}
			if (node.material.name == "floorMaterial") {
				node.receiveShadow = true;
				node.castShadow = false;
				node.material = params.materials.texture.floor;
			}

			if (node.material.name == "floorMaterial2") {
				node.receiveShadow = true;
				node.castShadow = false;
				node.material = params.materials.texture.topFloor;
			}

			if (node.material.name == "ceilMaterial") {
				node.receiveShadow = true;
				node.castShadow = false;
				node.material = params.materials.texture.ceil;
			}

			if (node.userData.wndTreadParams && node.material.name !== 'glass') {

				var material = getTreadMaterial();

				if (node.userData.wndTreadParams.treadId == 2) material.map.rotation -= node.userData.wndTreadParams.angle * turnFactor;
				if (node.userData.wndTreadParams.treadId == 3) material.map.rotation += node.userData.wndTreadParams.angle * turnFactor;
				//material.normalMap.rotation = material.map.rotation;

				var material2 = params.materials.texture.tread;
				var mats = [material,material2];
				node.material = mats;

			}

		}

	});

}

//Реализуем ивенты загрузки текстур
function loaderProgress(item, loaded, total){
	if (typeof texturesLoadProgressCallback != 'undefined') texturesLoadProgressCallback(item, loaded, total);
	if (loaded == total) {
		if(typeof texturesLoadedCallback != 'undefined') texturesLoadedCallback(total);
	}
}

function getSceneBackGround(){
	var envMap = new THREE.CubeTextureLoader(texturesManger)
		.setPath( imgPath + '/cube/')
		.load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );
	return envMap;
}

function setMaterials(){

	var materials = [];

	if(typeof $sceneStruct != 'undefined' && $sceneStruct.vl_1){
		var metalColor = 0x767676;
		var metalColor_railing = 0x767676;			
		var metalColor2 = 0xA3A3A3;
		var stringerCoverColor = 0x767676;
		var skirtingColor = 0x804000;
		var timberColor = 0x804000;
		var timberColor1 = 0xA36323;
		var riserColor = timberColor;
		var treadColor = timberColor;
		var newellColor = timberColor;
		var balColor = timberColor;
		var handrailColor = timberColor;
		var boltColor = 0x8B8B8B//0xAEAEAE;
		
		var metalColor_roof = 0xEEEEEE;	
		var plasticColor_roof 0x3AE2CE;

		//цвета из параметров
		if(!$sceneStruct.vl_1.realColors && params.calcType != "geometry"){
			if(params.metalPaint == "порошок") metalColor = metalColor2 = getMetalColorId(params.carcasColor);
			if(params.metalPaint_railing == "порошок") metalColor_railing = getMetalColorId(params.metalBalColor);
			if(params.calcType == "vint") metalColor_railing = getMetalColorId(params.carcasColor);
			if(params.stringerCoverMaterial == "констр. сталь") stringerCoverColor = getMetalColorId(params.stringerCoverColor);

			timberColor = timberColor1 = getTimberColorId(params.timberColorNumber)
			if(params.calcType == "timber" || params.calcType == "timber_stock") timberColor = timberColor1 = getTimberColorId(params.stringersColor)
			riserColor = getTimberColorId(params.risersColor)
			treadColor = getTimberColorId(params.treadsColor)
			skirtingColor = getTimberColorId(params.skirtingColor)
			newellColor = getTimberColorId(params.newellsColor)
			balColor = getTimberColorId(params.timberBalColor)
			handrailColor = getTimberColorId(params.handrailsColor)
			
			metalColor_roof = getMetalColorId(params.roofMetalColor);
			plasticColor_roof = getPlasticColorId(params.roofPlastColor);
			
		}

		var skirtingMaterial = new THREE.MeshLambertMaterial({name:'skirting', color: skirtingColor,});
		var timberMaterial = new THREE.MeshLambertMaterial({name:'timber', color: timberColor,});
		var timberMaterial2 = new THREE.MeshLambertMaterial({name:'timber2', color: timberColor1,});
		var metalMaterial = new THREE.MeshLambertMaterial({name:'metal', color: metalColor, wireframe: false });
		var metalMaterial2 = new THREE.MeshLambertMaterial({name:'metal2', color: metalColor2, wireframe: false });
		var metalMaterial_railing = new THREE.MeshLambertMaterial({name:'metal_railing', color: metalColor_railing, wireframe: false });

		var inoxMaterial = new THREE.MeshLambertMaterial({name:'inox', color: 0xEEEEEE, wireframe: false });
		var glassMaterial = new THREE.MeshLambertMaterial({name:'glass', opacity: 0.6, color: 0x3AE2CE, transparent: true });
		var concreteMaterial = new THREE.MeshLambertMaterial({name:'concrete', color: 0xBFBFBF });
		var dpcMaterial = new THREE.MeshLambertMaterial({name:'dpc', color: 0x634D39,});
		var boltMaterial = new THREE.MeshLambertMaterial({name:'bolt', color: boltColor,});

		var riserMaterial = new THREE.MeshLambertMaterial({name:'riser', color: riserColor,});
		var treadMaterial = new THREE.MeshLambertMaterial({name:'tread', color: treadColor,});
		var newellMaterial = new THREE.MeshLambertMaterial({name:'newell', color: newellColor,});
		var balMaterial = new THREE.MeshLambertMaterial({name:'bal', color: balColor,});
		var handrailMaterial = new THREE.MeshLambertMaterial({name:'handrail', color: handrailColor,});

		var stringerCoverMaterial = new THREE.MeshLambertMaterial({name:'metal', color: stringerCoverColor, wireframe: false });
		if(params.stringerCoverMaterial == "нерж. сталь") stringerCoverMaterial = inoxMaterial;

		var wallMaterial = new THREE.MeshLambertMaterial({name: 'wallMaterial', color: params.wallsColor, transparent: true, opacity: 0.3});
		var floorMaterial = new THREE.MeshLambertMaterial({name: 'floorMaterial', color: params.floorColor, transparent: false, opacity: 0.3});
		var topFloorMaterial = new THREE.MeshLambertMaterial({name: 'floorMaterial2', color: params.floorColor2, transparent: true, opacity: 0.3});
		var ceilMaterial = new THREE.MeshLambertMaterial({name: 'ceilMaterial', color: params.ceilColor, transparent: true, opacity: 0.3});
		if(!gui.__controllers[0].object.transparentWalls){
			topFloorMaterial.transparent = ceilMaterial.transparent = wallMaterial.transparent = false;

		}
		
		var metalMaterial_roof = new THREE.MeshLambertMaterial({name:'metal_roof', color: metalColor_roof, wireframe: false });
		var plasticMaterial_roof = new THREE.MeshLambertMaterial({name:'plastic_roof', opacity: 0.6, color: plasticColor_roof, transparent: true });

		//материал ступеней не из дерева

		if (params.stairType == "рифленая сталь" || params.stairType == "лотки") treadMaterial.color = metalMaterial.color;

		if (params.stairType == "пресснастил") treadMaterial.color = new THREE.Color(0xEEEEEE);
		if (params.stairType == "стекло") treadMaterial = glassMaterial;
		if (params.stairType == "дпк") treadMaterial = dpcMaterial;

		//сохраняем материалы в глобальный массив
		materials = {
			timber: timberMaterial,
			timber2: timberMaterial2,
			skirting: skirtingMaterial,
			metal: metalMaterial,
			metal2: metalMaterial2,
			metal_railing: metalMaterial_railing,
			inox: inoxMaterial,
			glass: glassMaterial,
			concrete: concreteMaterial,
			dpc: dpcMaterial,
			tread: treadMaterial,
			riser: riserMaterial,
			newell: newellMaterial,
			banister: balMaterial,
			handrail: handrailMaterial,
			bolt: boltMaterial,
			stringerCover: stringerCoverMaterial,
			ceil: ceilMaterial,
			topFloor: topFloorMaterial,
			floor: floorMaterial,
			wall: wallMaterial,
			metal_roof: metalMaterial_roof,
			plastic_roof: plasticMaterial_roof,
		};
	}

	return materials;

}


function getTimberDiffuse(timberType){
	var par = {
		type: timberType,
		basePath: '/images/calculator/textures/timber/',
		size: {
			x: 1600,
			y: 800,
		}
	}
	par.name = "pine";

	if(timberType == "сосна ц/л кл.Б") {
		par.name = "pine";
		par.size = {x: 800, y: 800,};
	}
	if(timberType == "сосна экстра") {
		par.name = "pine_prem";
		par.size = {x: 1000, y: 250,};
	}
	if(timberType == "береза паркет.") {
		par.name = "birch";
		par.size = {x: 1600, y: 780,};
	}
	if(timberType == "лиственница паркет.") {
		par.name = "larch";
		par.size = {x: 1000, y: 250,};
	}
	if(timberType == "лиственница ц/л") {
		par.name = "larch_prem";
		par.size = {x: 1000, y: 500,};
	}
	if(timberType == "дуб паркет.") {
		par.name = "oak";
		par.size = {x: 1200, y: 600,};
	}
	if(timberType == "дуб ц/л") {
		par.name = "oak_prem";
		par.size = {x: 2000, y: 1000,};
	}
	
	if(timberType == "дуб натур") {
		par.name = "oak_slab";
		par.size = {x: 2000, y: 1000,};
	}
	if(timberType == "каракач натур") {
		par.name = "elm_slab";
		par.size = {x: 2000, y: 1000,};
	}
	if(timberType == "шпон") {
		par.name = "oak_veneer";
		par.size = {x: 2000, y: 1000,};
	}

	par.diffuse = new THREE.TextureLoader(texturesManger).load( par.basePath + par.name + ".jpg");
	par.diffuse.wrapS = par.diffuse.wrapT = THREE.RepeatWrapping;
	par.diffuse.repeat.set( 1 / par.size.x, 1 / par.size.y );
	par.diffuse.offset.set( 0.1, 0.5 );

	return par;
}

function getMateMaterial(name, color, texture, normal, roughness){
	var material = new THREE.MeshPhongMaterial( {
		color: color,
		name: name,
		reflectivity: 0.4,
		combine: THREE.MixOperation,
		normalScale: null,
		shininess: 8,
		normalScale: new THREE.Vector2( 2, 2 )
	});
	if (typeof texture !== 'undefined') material.map = texture;
	if (typeof normal !== 'undefined') {
		material.normalMap = normal;
		material.bumpMap = normal;
	}
	return material;
}
