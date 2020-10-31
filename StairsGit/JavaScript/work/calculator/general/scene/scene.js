var texturesManger;
var imgPath = "/images/calculator/textures";

function getTextureMangerInstance(){
	return window.textureManager;
}

/**
 * Отвечает за взаимодействие с текстурами и материалами
 */
class TextureManager{
	/**
	 * В конструкторе создаем материалы и получаем параметры материалов
	 * @param {boolean} texturesOn нужны ли текстуры на старте
	 */
	constructor(texturesOn){
		this.createTextureLoader();

		this.texturesEnabled = !!texturesOn;
		this.materialsConfigs = getMaterialsConfigs();
		params.materials = this.createMaterials();

		if (!texturesOn) {
			view.lights[0].color = new THREE.Color(0xFFFFFF);
		}

		this.toggleWireframe();
	}

	//Реализуем ивенты загрузки текстур
	loadingManagerProgress(item, loaded, total){
		if (typeof texturesLoadProgressCallback != 'undefined') texturesLoadProgressCallback(item, loaded, total);
		if (loaded == total) {
			if(typeof texturesLoadedCallback != 'undefined') texturesLoadedCallback(total);
		}
	}

	createTextureLoader(){
		if (!this.textureLoader) {
			this.loadingManager = new THREE.LoadingManager();// Создаем загрузчик
			this.loadingManager.onProgress = this.loadingManagerProgress;
			this.textureLoader = new THREE.TextureLoader(this.loadingManager);
		}
	}

	setTexturesEnabled(state){
		if (typeof state !== 'boolean') {
			console.warn('TextureManager::setTexturesEnabled принимает только boolean на вход');
			return;
		} 
		if (state == this.texturesEnabled) return;
		this.texturesEnabled = state;

		if (this.texturesEnabled) {
			view.lights[0].color = new THREE.Color(0xfffbdf);
			if (view.scene.tempBackground) {
				view.scene.background = view.scene.tempBackground;
				view.scene.tempBackground = undefined;
			}
		}else{
			view.lights[0].color = new THREE.Color(0xFFFFFF);
			if (view.scene.background) {
				view.scene.tempBackground = view.scene.background;
				view.scene.background = undefined;
			}
		}

		this.updateMaterials();
	}

	/**
	 * Метод создает бэкграунд если его нету
	 */
	createBackground(){
		if (!view.scene.background && this.texturesEnabled) {
			// добавляем бэкграунд если его нету
			view.scene.background = getSceneBackGround('day');
		}
	}
	
	/**
	 * Вызывается всякий раз когда нужно обновить конфигурацию всех материалов, будь то включение текстур или изменение цвета
	 */
	updateMaterials(){
		this.createBackground();
		
		var _this = this;
		$.each(params.materials, function(){
			_this.loadMaterialConfig(this, this.name);
		});
		this.toggleWireframe();
	}

	/**
	 * Перключает состояние контуров в зависимости от состояния текстур
	 */
	toggleWireframe(){
		params.materials.wireframe.visible = !this.texturesEnabled;
	}

	/**
	 * получает цвет для материала
	 * @param {string} material_name имя материала
	 */	
	getMaterialColor(material_name){
		var par = {
			material_name: material_name,
			colorName: 'нет',
			colorId: 0xFFFFFF,
		}
		
		if (material_name == 'metal' || material_name == 'metal2') {
			if (params.metalPaint == "порошок") par.colorName = params.carcasColor;			
			par.colorId = getMetalColorId(par.colorName);
		}
		if (material_name == 'metal_railing') {
			if (params.metalPaint_railing == "порошок") par.colorName = params.metalBalColor;
			if (params.calcType == "vint") par.colorName = params.carcasColor;
			par.colorId = getMetalColorId(par.colorName);
		}
		if (material_name == 'stringer_cover') {
			if (params.stringerCoverMaterial == "констр. сталь") par.colorName = params.stringerCoverColor;				
			par.colorId = getMetalColorId(par.colorName);
		}
		if (material_name == 'skirting') {			
			par.colorName = params.skirtingColor;
			par.colorId = getTimberColorId(par.colorName);
		}
		if (material_name == 'timber' || material_name == 'timber2') {
			par.colorName = params.timberColorNumber;
			par.colorId = getTimberColorId(par.colorName);
		}
		if (material_name == 'riser') {
			par.colorName = params.risersColor;
			par.colorId = getTimberColorId(par.colorName);
		}
		if (material_name == 'tread') {
			par.colorName = params.treadsColor;
			par.colorId =  getTimberColorId(params.treadsColor);
			if (getTreadTextureName() == 'rif_metal') {
				if (params.metalPaint == "порошок") par.colorName = params.carcasColor;			
				par.colorId = getMetalColorId(par.colorName);
			}
		}
		if (material_name == 'newell') {
			par.colorName = params.newellsColor;
			par.colorId = getTimberColorId(par.colorName);
		}
		if (material_name == 'bal') {
			par.colorName = params.timberBalColor;
			par.colorId = getTimberColorId(par.colorName);
		}
		if (material_name == 'handrail') {
			par.colorName = params.handrailsColor
			if(params.calcType == "vint"){
				if(params.handrailMaterial == "ПВХ") par.colorName = params.handrailColor
				if(params.handrailMaterial == "Дуб") par.colorName = params.timberColorNumber
			}
			par.colorId = getTimberColorId(par.colorName);
		}
		if (material_name == 'bolt') {
			par.colorId = 0x8B8B8B;
		}
		if (material_name == 'floor') {
			par.colorId = $('#floorColor').val();
		}
		if (material_name == 'floor2') {
			par.colorId = $('#floorColor2').val();
		}
		if (material_name == 'ceil') {
			par.colorId = $('#ceilColor').val();
		}
		if (material_name == 'walls') {
			par.colorId = $('#wallsColor').val();
		}
		if (material_name == 'wireframe') {
			par.colorId = $('#wireframeColor').val() || 0x000000;
		}
		if (material_name == 'resin') par.colorId = getPlasticColorId(params.resinColor);

		return par;
	}

	/**
	 * Функция создает материалы, по сути копия старого метода, с легкими доработками
	 */
	createMaterials(){
		var materials = {};
		
		var skirtingMaterial = this.createMaterial({name: 'skirting',color: this.getMaterialColor('skirting').colorId});
		var timberMaterial = this.createMaterial({name: 'timber',color: this.getMaterialColor('timber').colorId});
		var timberMaterial2 = this.createMaterial({name: 'timber2',color: this.getMaterialColor('timber2').colorId});
		var metalMaterial = this.createMaterial({name: 'metal',color: this.getMaterialColor('metal').colorId,wireframe: false});
		var metalMaterial2 = this.createMaterial({name: 'metal2',color: this.getMaterialColor('metal2').colorId,wireframe: false});
		var metalMaterial_railing = this.createMaterial({name: 'metal_railing',color: this.getMaterialColor('metal_railing').colorId,wireframe: false});

		var inoxMaterial = this.createMaterial({name: 'inox',color: 0xEEEEEE,wireframe: false});
		var glassMaterial = this.createMaterial({name: 'glass',opacity: 0.6,color: 0x3AE2CE,transparent: true});
		var resinMaterial = this.createMaterial({name: 'resin', opacity: 0.6,color: this.getMaterialColor('resin').colorId,transparent: true});
		var concreteMaterial = this.createMaterial({name: 'concrete',color: 0xBFBFBF});
		var dpcMaterial = this.createMaterial({name: 'dpc',color: 0x634D39,});
		var boltMaterial = this.createMaterial({name: 'bolt',color: this.getMaterialColor('bolt').colorId});

		var riserMaterial = this.createMaterial({name: 'riser',color: this.getMaterialColor('riser').colorId});
		var treadMaterial = this.createMaterial({name: 'tread',color: this.getMaterialColor('tread').colorId});
		var newellMaterial = this.createMaterial({name: 'newell',color: this.getMaterialColor('newell').colorId});
		var balMaterial = this.createMaterial({name: 'bal',color: this.getMaterialColor('bal').colorId});
		var handrailMaterial = this.createMaterial({name: 'handrail',color: this.getMaterialColor('handrail').colorId});

		var stringerCoverMaterial = this.createMaterial({name: 'stringer_cover',color: this.getMaterialColor('stringer_cover').colorId,wireframe: false});
		if (params.stringerCoverMaterial == "нерж. сталь") stringerCoverMaterial = inoxMaterial;

		var wallMaterial = this.createMaterial({name: 'walls',color: params.wallsColor,transparent: true,opacity: 0.3});
		var floorMaterial = this.createMaterial({name: 'floor',color: params.floorColor,transparent: false,opacity: 0.3});
		var topFloorMaterial = this.createMaterial({name: 'floor2',color: params.floorColor2,transparent: true,opacity: 0.3});
		var ceilMaterial = this.createMaterial({name: 'ceil',color: params.ceilColor,transparent: true,opacity: 0.3});
		
		var wireframeMaterial = this.createMaterial({name: 'wireframe',color: this.getMaterialColor('wireframe').colorId,wireframe: false});
		
		//материал ступеней не из дерева

		if (params.stairType == "рифленая сталь" || params.stairType == "лотки") treadMaterial.color = metalMaterial.color;
		if (params.stairType == "пресснастил") treadMaterial.color = new THREE.Color(0xEEEEEE);
		// if (params.stairType == "стекло") treadMaterial = glassMaterial;
		// if (params.stairType == "дпк") treadMaterial = dpcMaterial;
		
		var metalMaterial_roof = this.createMaterial({name:'metal_roof', color: getMetalColorId(params.roofMetalColor)});
		var plasticMaterial_roof = this.createMaterial({name:'plastic_roof', opacity: 0.6, color: getPlasticColorId(params.roofPlastColor), transparent: true, opacity: 0.3 });
		var additionalObjectTimber = this.createMaterial({name: 'additionalObjectTimber', color: getTimberColorId(params.additionalObjectsTimberColor), wireframe: false});
		var additionalObjectMetal = this.createMaterial({name: 'additionalObjectMetal', color: getMetalColorId(params.additionalObjectsMetalColor), wireframe: false});
		/**
		 * Кастомный цвет для освещения
		*/
		var lightMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color(0xFFFFFF)});
		lightMaterial.transparent = true;
		this.textureLoader.load('/images/calculator/textures/light.png', function(map){
			map.repeat = {x: 2, y: 2};
			map.rotation = -Math.PI / 2;
			map.offset.y = -0.5;
			lightMaterial.alphaMap = map;
			lightMaterial.needsUpdate = true;
		});

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
			whitePlastic: this.createMaterial({name: 'whitePlastic',color: new THREE.Color(255,255,255)}),
			stringerCover: stringerCoverMaterial,
			ceil: ceilMaterial,
			topFloor: topFloorMaterial,
			floor: floorMaterial,
			wall: wallMaterial,
			wireframe: wireframeMaterial,
			lightMaterial: lightMaterial,
			metal_roof: metalMaterial_roof,
			plastic_roof: plasticMaterial_roof,
			additionalObjectTimber: additionalObjectTimber,
			additionalObjectMetal: additionalObjectMetal,
			resin: resinMaterial
		}

		return materials;
	}

	/**
	 * Создает отдельный материал
	 * @param {object} options опции которые передаются в конструктор материала
	 */
	createMaterial(options){
		var material = new THREE.MeshStandardMaterial(options);
		this.loadMaterialConfig(material, material.name);
		return material;
	}

	/**
	 * Загружает и применяет конфигурацию материала
	 * @param {THREE.MeshStandardMaterial} material сам материал
	 * @param {string} material_name имя материала, необходимо для возможности загрузки конфигураций от других материалов
	 */
	loadMaterialConfig(material, material_name){

		var info = this.getMaterialInfo(material_name);
		material.userData.materialKey = info.key;
		material.userData.materialColorName = info.color;
		material.userData.materialGroup = info.group;
		if (!info || info.group == '') return

		var mat_config = false;

		//Загружаем настройки для группы
		if (this.materialsConfigs[info.group]) {

			if (this.materialsConfigs[info.group].main) mat_config = $.extend(true, mat_config, this.materialsConfigs[info.group].main);
			//Загружаем настройки для текстуры
			if (	this.materialsConfigs[info.group].textures 
					&& this.materialsConfigs[info.group].textures[info.texture]
					&& this.materialsConfigs[info.group].textures[info.texture].main) {
				mat_config = $.extend(true, mat_config, this.materialsConfigs[info.group].textures[info.texture].main);
			}
			if (	this.materialsConfigs[info.group].textures
					&& this.materialsConfigs[info.group].textures[info.texture]
					&& this.materialsConfigs[info.group].textures[info.texture].colors
					&& this.materialsConfigs[info.group].textures[info.texture].colors[info.color]
					&& this.materialsConfigs[info.group].textures[info.texture].colors[info.color].main) {
				mat_config = $.extend(true, mat_config, this.materialsConfigs[info.group].textures[info.texture].colors[info.color].main);
			}
		}
		
		if (mat_config) {

			if (mat_config && mat_config.matPar) {
				$.each(mat_config.matPar, function(key){
					material[key] = this;
				});
			}
			if (mat_config.needEnv) {
				material.envMap = view.scene.background;
			}
			if (mat_config.dynamicColor) {
				material.color = new THREE.Color(info.color);
			}
			if (this.texturesEnabled) {
				if (material.tempMap || material.tempNormalMap) {
					material.map = material.tempMap;
					material.normalMap = material.tempNormalMap;
					material.bumpMap = material.tempBumpMap;

					material.tempMap = material.tempNormalMap = material.tempBumpMap = undefined;
				}

				if (!mat_config.mapUrl && material.map) {
					delete material.map;
				}
				if (!mat_config.normalMapUrl && material.normalMap) {
					delete material.normalMap;
					delete material.bumpMap;
				}
				var _this = this;
				this.createTextureLoader();

				if (mat_config.mapUrl) {
					if (material.map) {
						if (material.map.image.src !== "https://6692035.ru" + mat_config.mapUrl) {
							material.map.image.src = mat_config.mapUrl;
							_this.setMapConfig(material.map, mat_config);
							setTimeout(() => {
								material.map.needsUpdate = true;
								material.needsUpdate = true;
							}, 0);
						}
					}
					else{
						this.textureLoader.load(mat_config.mapUrl, function(map){
							map.wrapS = map.wrapT = THREE.RepeatWrapping;
							material.map = map;
							_this.setMapConfig(map, mat_config);
							material.needsUpdate = true;
						});
					}

				}
				if (mat_config.normalMapUrl) {
					if (material.normalMap) {
						if (material.normalMap.image.src !== "https://6692035.ru" + mat_config.normalMapUrl) {
							material.normalMap.image.src = mat_config.normalMapUrl;
							_this.setMapConfig(material.normalMap, mat_config);
							setTimeout(() => {
								material.normalMap.needsUpdate = true;
								material.bumpMap.needsUpdate = true;
								material.needsUpdate = true;
							}, 0);
						}
					}
					else{
						this.textureLoader.load(mat_config.normalMapUrl, function(map){
							map.wrapS = map.wrapT = THREE.RepeatWrapping;
							material.normalMap = map;
							material.bumpMap = map;
							_this.setMapConfig(map, mat_config);
							material.needsUpdate = true;
						});
					}					
				}
				
				if(material.map){
					material.map.repeat.x = mat_config.mapPar.repeat.x / info.mapScale;
					material.map.repeat.y = mat_config.mapPar.repeat.y / info.mapScale;
				}
				if(material.normalMap){
					material.normalMap.repeat.x = mat_config.mapPar.repeat.x / info.mapScale;
					material.normalMap.repeat.y = mat_config.mapPar.repeat.y / info.mapScale;
				}
			}
			else{
				if (material.map || material.normalMap) {
					material.tempMap = material.map;
					material.tempNormalMap = material.normalMap;
					material.tempBumpMap = material.bumpMap;
					material.map = material.normalMap = material.bumpMap = undefined;
				}
			}
		}
		
		
		material.needsUpdate = true;
	}

	/**
	 * Метод определяет группу текстуру и цвет материала
	 */
	getMaterialInfo(material_name){
		var texture_name = '';
		var color_name = '';
		var key = null;
		var mapScale = 1;
		if (material_name == 'tread') {
			key = params.stairType;
			if(key == "массив" || params.calcType == 'vint') key = params.treadsMaterial;
			texture_name = getTreadTextureName();
			color_name = params.treadsColor;	
			if (texture_name == 'rif_metal') if (params.metalPaint == "порошок") color_name = params.carcasColor;
			if (texture_name == 'metal') if (params.metalPaint == "порошок") color_name = params.carcasColor;
		}
		if (material_name == 'riser') {
			texture_name = getTimberTextureName(params.risersMaterial);
			color_name = params.risersColor;
			key = params.risersMaterial;
		}
		if (material_name == 'newell') {
			texture_name = getTimberTextureName(params.newellsMaterial);
			color_name = params.newellsColor;
			key = params.newellsMaterial;
		}
		if (material_name == 'bal') {
			texture_name = getTimberTextureName(params.timberBalMaterial);
			color_name = params.timberBalColor;
			key = params.timberBalMaterial;
		}
		if (material_name == 'resin') {
			color_name = params.resinColor;
			texture_name = 'resin';
			if (params.resinMaterial == 'непрозрачный') texture_name = 'resin_mate';
		}
		if (material_name == 'handrail') {
			texture_name = getTimberTextureName(params.handrailsMaterial);
			color_name = params.handrailsColor;
			key = params.handrailsMaterial;
		}
		if (material_name == 'metal' || material_name == 'metal2') {
			texture_name = 'metal';
			if (params.metalPaint == "порошок") color_name = params.carcasColor;
		}
		//roof
		if (material_name == 'metal_roof') {
			color_name = params.roofMetalColor;
			texture_name = 'metal_roof';
		}
		if (material_name == 'plastic_roof') {
			color_name = params.roofPlastColor;
			texture_name = 'plastic_roof';
		}
		if (material_name == 'whitePlastic') {
			texture_name = 'whitePlastic';
		}
		if (material_name == 'metal_railing') {
			if (params.metalPaint_railing == "нет" || params.metalPaint_railing == "не указано") color_name = 'черный';
			if (params.metalPaint_railing == "порошок") color_name = params.metalBalColor;
			if (params.calcType == "vint") color_name = params.carcasColor;
			texture_name = 'metal'
		}
		if (material_name == 'stringer_cover') {
			if (params.stringerCoverMaterial == "констр. сталь") color_name = params.stringerCoverColor;
			texture_name = 'metal';
		}
		if (material_name == 'skirting') {			
			color_name = params.skirtingColor;
			texture_name = 'oak';
		}
		if (material_name == 'tread_light') {
			texture_name = 'light';
		}

		if (material_name == 'additionalObjectTimber') {
			texture_name = getTimberTextureName(params.additionalObjectsTimberMaterial);
			color_name = params.additionalObjectsTimberColor;
			key = params.additionalObjectsTimberMaterial;
		}
		if (material_name == 'additionalObjectMetal') {
			color_name = params.additionalObjectsTimberColor;
			texture_name = 'metal';
			if (params.metalPaint == "порошок") color_name = params.additionalObjectsMetalColor;
		}
		
		if (material_name == 'timber' || material_name == 'timber2') {
			color_name = params.stringersColor;
			texture_name = getTimberTextureName(params.stringersMaterial);
			key = params.stringersMaterial;
		}
		if (material_name == 'inox' || material_name == 'bolt') texture_name = 'chrome';
		
		if (material_name == 'wireframe') {
			texture_name = 'wireframe';
			color_name = $('#wireframeColor').val() || 0x000000;
		}
		
		if (material_name == 'ceil') {
			color_name = $('#ceilColor').val();
			texture_name = $("#ceilMat").val() || 'paint';
			mapScale = $("#mapScaleCeil").val()
		}
		if (material_name == 'floor') {
			color_name = $('#floorColor').val();
			texture_name = $("#floorMat").val() || 'wood_9';
			mapScale = $("#mapScaleFloor").val()
		}
		if (material_name == 'floor2') {
			color_name = $('#floorColor2').val();
			texture_name = $("#floorMat2").val() || 'wood_9';
			mapScale = $("#mapScaleTopFloor").val() * 20000; //костыль из-за толщины перекрытия
		}
		if (material_name == 'walls') {
			color_name = $('#wallsColor').val();
			texture_name = $("#wallsMat").val() || 'paint';
			mapScale = $("#mapScaleWalls").val()
		}
		
		var group = this.findTextureGroup(texture_name);
		return {
			group: group,
			texture: texture_name,
			color: color_name,
			mapScale: mapScale,
			key: key,
		};
	}

	/** 
	 * Ищет в конфигурации текстуру и возвращает её группу
	 */
	findTextureGroup(texture_name){
		var group = '';
		$.each(this.materialsConfigs, function(key){
			if (this.textures) {
				var textures = Object.keys(this.textures);
				if (textures.includes(texture_name)) {
					group = key;
				}
			}
		});
		return group;
	}

	/**
	 * Функция применяет конфигурацию текстуры на материал и текстуру
	 * @param {THREE.MeshPhysicalMaterial} material сам материал
	 * @param map текстура
	 * @param {object} config конфигурация которую нужно применить
	 */
	setMapConfig(map, config){
		if (config.mapPar) {
			$.each(config.mapPar, function(key){
				map[key] = this;				
			});
		}
	}

	/**
	 * Определяет текстуру для материала и её параметры
	 * @param {string} material_name имя материала
	 */
	getMaterialTexture(material_name, defaultMap){
		var material_group = this.getMaterialGroup(material_name);
		var texture_name = defaultMap || '';
		if (material_group == 'timber') texture_name = getTimberTextureName();
		if (material_name == 'tread') texture_name = getTreadTextureName();
		if (material_group == 'metal') texture_name = 'metal';
		if (material_name == 'ceil') texture_name = $("#ceilMat").val() || 'paint';
		if (material_name == 'floor') texture_name = $("#floorMat").val() || 'wood_9';
		if (material_name == 'floor2') texture_name = $("#floorMat2").val() || 'wood_9';
		if (material_name == 'walls') texture_name = $("#wallsMat").val() || 'paint';
		
		var texture_config = this.getTextureConfig(material_name, texture_name);
		return texture_config;
	}
}

function toggleNightMode(nightModeEnabled){
	if (nightModeEnabled) {
		view.lights[0].intensity = 0.1;
		view.lights[1].intensity = 0.1;
	}else{
		view.lights[0].intensity = 1;
		view.lights[1].intensity = 0.5;
		getSceneBackGround('day');
	}
}


function addCustomersViewport(){
	/*
	view.width = $('.visualisation-wrapper').width();
	view.height = $('.visualisation-wrapper').height();
	*/
	view.width = $('body').width();
	view.height = $('body').height();
	
	view.clock = new THREE.Clock();
	view.scene = new THREE.Scene();
	
	//конфигурируем 3D меню
	var viewportId = 'vl_1';
	$[viewportId] = view.scene; //для совместимости с имеющимися функциями
	// $sceneStruct[viewportId] = [];
	
	// change3dMenu($sceneStruct);
	createMenu();
	
	// setMaterialsCustomers();
	window.textureManager = new TextureManager(true);
	
	// view.scene.background = view.scene.background;//getSceneBackGround();
	
	view.renderer = new THREE.WebGLRenderer({
		preserveDrawingBuffer: true, //опция нужна для выгрузки в png
		antialias: true,
	});
	view.renderer.setPixelRatio( window.devicePixelRatio );
	view.renderer.setClearColor(new THREE.Color(0x000000));
	view.renderer.shadowMap.enabled = true;

	view.ambientLight = new THREE.AmbientLight(0xfffbdf);
	view.scene.add( view.ambientLight );

	view.sunLight = new THREE.SpotLight( 0xffffff, 0.4, 0, Math.PI / 2 );
	view.sunLight.position.set( 1000, 2500 - 100, 3000 * turnFactor );
	view.sunLight.position.multiplyScalar(2);
	view.sunLight.castShadow = true;
	view.sunLight.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 70, 1, 1000, 200000 ) );
	view.sunLight.shadow.bias = 0.00085;
	view.sunLight.shadow.mapSize.width = 1024;
	view.sunLight.shadow.mapSize.height = 1024;
	view.scene.add( view.sunLight );

	view.lights = [
		view.ambientLight,
		view.sunLight
	];

	view.camera = new THREE.PerspectiveCamera(45, view.width / view.height,  10, 100000);
	view.camera.position.set(-5000, 3000, 5000);

	view.splineCamera = new THREE.PerspectiveCamera( 60, view.width / view.height, 10, 10000 );
	view.scene.add( view.splineCamera );

	// view.splineCameraHelper = new THREE.CameraHelper( view.splineCamera );
	// view.scene.add( view.splineCameraHelper );

	$('.visualisation-wrapper #WebGL-output').append( view.renderer.domElement );
	window.addEventListener( 'resize', onWindowResize, false );

	//управление камерой
	view.orbitControls = new THREE.OrbitControls(view.camera, view.renderer.domElement);
	
	//Перерисовка сцены
	renderScene = function () {
		requestAnimationFrame(renderScene);
		render();
	};

	var angle = 0;
	camPosIndex = 0;
	cameraState = 'default';
	
	render = function(){
		var delta = view.clock.getDelta();
		view.orbitControls.update(delta);
		view.renderer.setSize(view.width, view.height);
		// view.mirrorCamera.update( view.renderer, view.scene );

		var camera = view.camera;
		if (cameraState == 'rotation' || cameraState == 'excursion') {
			camera = view.splineCamera;
			if (cameraState == 'rotation') {
				var angularSpeed = THREE.Math.degToRad(20); // угловая скорость - градусов в секунду
				var radius = 3000;

				camera.position.x = Math.cos(angle) * radius + view.sceneCenter.x;
				camera.position.y = params.staircaseHeight + 500;
				camera.position.z = Math.sin(angle) * radius + view.sceneCenter.z;
				angle += angularSpeed * delta; // приращение угла

				camera.lookAt(view.sceneCenter);
			}
			if( cameraState == 'excursion' ){
				camPosIndex++;
				var speed = 600;
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
				
				var lookAt = view.camSpline.getPoint((camPosIndex+1) / speed);
				lookAt.y -= 30;
				camera.lookAt(lookAt);
			}
		}

		processAnimations();
	// var camera = view.camera;

		view.renderer.render(view.scene, camera);
	}

	renderScene(view);
	
	//конфигурируем 3D меню
	// var viewportId = 'vl_1';
	// $[viewportId] = view.scene; //для совместимости с имеющимися функциями
	// $sceneStruct[viewportId] = [];
		
	// change3dMenu($sceneStruct);
}

/**
 * Функция обрабатывает анимации, вызывается при отрисовке фрейма
 */
function processAnimations(){
	if (window.animations) {
		animations.forEach(function(animation, i){
			var timeStart = animation.timeStart;
			var duration = animation.duration;
			var currentTimestamp = new Date().getTime();

			var progress  = (currentTimestamp - timeStart) / duration;
			if (progress < 1) {
				animation.context.animationProgress(animation.animationName, progress)
			}else{
				animation.context.animationProgress(animation.animationName, 1);
				animations.splice(i, 1);
			}
		});
	}
}

function onWindowResize() {
	/*
	view.width = $('.visualisation-wrapper').width();
	view.height = $('.visualisation-wrapper').height();
	*/
	view.width = $('body').width();
	view.height = $('body').height();
	windowHalfX = view.width / 2;
	windowHalfY = view.height / 2;
	view.camera.aspect = view.width / view.height;
	view.camera.updateProjectionMatrix();
	view.renderer.setSize( view.width, view.height );
}

//Делаем функцию заглушку, тк создаем материалы один раз и сами
function setMaterials(){
	return params.materials;
}

var texturesEnabled = true;
function toggleTextures(){
	texturesEnabled = !texturesEnabled;
	window.textureManager.setTexturesEnabled(texturesEnabled);
}

function getSceneBackGround(name){
	view.envMap = new THREE.CubeTextureLoader(texturesManger)
		.setPath( imgPath + '/cube/' + name + '/')
		.load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );
	return view.envMap;
}

function addTreadLights(){
	// var positions = [];
	// THREE.RectAreaLightUniformsLib.init();

	// view.scene.traverse(function(node){
	// 	if (node instanceof THREE.Mesh && node.layerName == 'treads') {
	// 		var position = new THREE.Box3().setFromObject(node)
	// 		positions.push({mesh: node, position: position});
	// 	}
	// });

	// view.rectLights = [];
	// view.treadLights.forEach(function(node){
		// var box3 = new THREE.Box3();
		// box3.setFromObject(node);

		// var width = box3.getSize().z;
		// var height = box3.getSize().x;

		// var light = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
		// var center = box3.getCenter();
		
		// var rectLightMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial( { side: THREE.BackSide } ) );
		// rectLightMesh.scale.x = width;
		// rectLightMesh.scale.y = height;
		// light.add( rectLightMesh );
		// var rectLightMeshBack = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial( { color: 0x080808 } ) );
		// rectLightMesh.add( rectLightMeshBack );
		// rectLightMesh.rotation.y = Math.PI;
		
		// var pos = {
		// 	x: box3.min.x,
		// 	y: box3.min.y,
		// 	z: box3.min.z
		// }
		
		// light.position.set(pos.x, pos.y, pos.z);
		// light.lookAt( pos.x, pos.y - 100, pos.z);

		// var rot = node.getWorldQuaternion();

		// light.rotation.z += rot.z;
		
		// view.scene.add( light );
		// view.rectLights.push(light);
	// });
}

function toggleTreadLights(algorithm, state){
	var lights = view.scene.getObjectsByLayerName('tread_light');
	lights = lights.filter(function(l){return l instanceof THREE.Mesh});
	if (lights.length > 0) {
		if (algorithm == 'step') {
			var iterator = 0;

			var interval = setInterval(function(){
				
				if (state) {
					lights[iterator].material.color = new THREE.Color(0xFFFFFF);
				}else{
					lights[iterator].material.color = new THREE.Color(0x777777);
				}
				lights[iterator].userData.lightMesh.visible = state;
				if (lights[iterator].userData.riserLight) {
					lights[iterator].userData.riserLight.visible = state;
				}

				iterator++;
				if (iterator >= lights.length) {
					clearInterval(interval);
				}
			}, 300);
		}
		if (algorithm == 'all') {
			lights.forEach(function(light){
				if (state) {
					light.material.color = new THREE.Color(0xFFFFFF);
				}else{
					light.material.color = new THREE.Color(0x777777);
				}
				light.userData.lightMesh.visible = state;
			});
		}
	}
}

/**
 * Создает кривую для прогулки по лестнице
 */
function createCamCurve(){
	var positions = [];
	if (getCalcTypeMeta().notStairs) {
		view.sceneCenter = new THREE.Vector3(0,0,0);
		return
	}
	
	if (view.camSpline) view.scene.remove(view.camSpline);
	if (view.camSplineHelper) view.scene.remove(view.camSplineHelper);

	var humanHeight = 1700;
	view.scene.traverse(function(node){
		if (node.layerName == 'treads') {
			if (node.userData && node.userData.marshId) {
				var box3 = new THREE.Box3().setFromObject(node);
				var position = new THREE.Vector3();
				box3.getCenter(position);
				var size = new THREE.Vector3();
				box3.getSize(size);
				position.y += humanHeight;
				positions.push(position);
			}
		}
	});
	// if (params.calcType == 'vint') {
	// }else{
	// 	var moove = calcStaircaseMoove(treadsObj.lastMarshEnd);
	// 	var deltaY = params.staircasePosY || 0;
	// 	var start = new THREE.Vector3(moove.x, deltaY + humanHeight, moove.z);
	// 	positions.push(start);

	// 	var test = start.clone();
	// 	test.x += treadsObj.unitsPos.turn1.x;
	// 	test.y += treadsObj.unitsPos.turn1.y;
	// 	test.z += treadsObj.unitsPos.turn1.z;
	// 	positions.push(test);

	// 	// if (params.stairModel == 'Г-образная с площадкой' || params.stairModel == 'Г-образная с забегом') {
	// 	// 	var start = new THREE.Vector3(moove.x, deltaY + humanHeight, moove.z);
	// 	// 	positions.push(start);
	// 	// 	var marshStart = positions[positions.length - 1];
	// 	// 	for (let i = 0; i < params.stairAmt1; i++) {
	// 	// 		var pos = marshStart.clone().add(new THREE.Vector3(0, params.h1 * i, -params.a1 * i));
	// 	// 		positions.push(pos);
	// 	// 	}
	// 	// }else{
	// 	// 	var start = new THREE.Vector3(moove.x, deltaY + humanHeight, moove.z + (params.M / 2) * turnFactor);
	// 	// 	positions.push(start);
	// 	// 	var marshStart = positions[positions.length - 1];
	// 	// 	for (let i = 1; i < params.stairAmt1; i++) {
	// 	// 		var pos = marshStart.clone().add(new THREE.Vector3(-params.a1 * i, params.h1 * i, 0));
	// 	// 		positions.push(pos);
	// 	// 	}

	// 	// 	if (params.turnType_1 == 'площадка') {
	// 	// 		var pos = positions[positions.length - 1].clone().add(new THREE.Vector3(-params.M / 2, 0, 0));
	// 	// 		positions.push(pos);
	// 	// 		var pos = positions[positions.length - 1].clone().add(new THREE.Vector3(0, 0, -params.M / 2 * turnFactor));
	// 	// 		positions.push(pos);
	// 	// 		if (params.stairModel == 'П-образная с площадкой') {
	// 	// 			var pos = positions[positions.length - 1].clone().add(new THREE.Vector3(0, 0, -params.M / 2 * turnFactor));
	// 	// 			positions.push(pos);
	// 	// 			var pos = positions[positions.length - 1].clone().add(new THREE.Vector3(params.M / 2, 0, 0));
	// 	// 			positions.push(pos);
	// 	// 		}
	// 	// 	}
	// 	// 	if (params.turnType_1 == 'забег') {
	// 	// 		var pos = positions[positions.length - 1].clone().add(new THREE.Vector3(-params.M / 2, params.h1, 0));
	// 	// 		positions.push(pos);
	// 	// 		var pos = positions[positions.length - 1].clone().add(new THREE.Vector3(0, params.h2 * 2, -params.M / 2 * turnFactor));
	// 	// 		positions.push(pos);
	// 	// 	}

	// 	// 	if (params.stairModel == 'П-образная трехмаршевая') {
	// 	// 		var marshStart = positions[positions.length - 1];
	// 	// 		for (let i = 1; i < params.stairAmt2; i++) {
	// 	// 			var pos = marshStart.clone().add(new THREE.Vector3(0, params.h2 * i, -params.a2 * i * turnFactor));
	// 	// 			positions.push(pos);
	// 	// 		}
	// 	// 		if (params.turnType_2 == 'площадка') {
	// 	// 			var pos = positions[positions.length - 1].clone().add(new THREE.Vector3(0, 0, -params.M / 2 * turnFactor));
	// 	// 			positions.push(pos);
	// 	// 			var pos = positions[positions.length - 1].clone().add(new THREE.Vector3(params.M / 2, 0, 0));
	// 	// 			positions.push(pos);
	// 	// 		}
	// 	// 		if (params.turnType_2 == 'забег') {
	// 	// 			var pos = positions[positions.length - 1].clone().add(new THREE.Vector3(0, params.h2, -params.M / 2 * turnFactor));
	// 	// 			positions.push(pos);
	// 	// 			var pos = positions[positions.length - 1].clone().add(new THREE.Vector3(params.M / 2, params.h3 * 2,0));
	// 	// 			positions.push(pos);
	// 	// 		}
	// 	// 	}
	// 	// 	if (params.stairModel != 'Прямая') {
	// 	// 		var marshStart = positions[positions.length - 1];
	// 	// 		for (let i = 1; i < params.stairAmt3; i++) {
	// 	// 			var pos = marshStart.clone().add(new THREE.Vector3(params.a3 * i, params.h3 * i, 0));
	// 	// 			positions.push(pos);
	// 	// 		}
	// 	// 	}
	// 	// }
	// }

	if(!positions.length) return;

	var ang = 0;
	if (params.stairModel == 'Прямая') {
		ang = Math.PI;
	}
	if (params.stairModel == 'Г-образная с площадкой' || params.stairModel == 'Г-образная с забегом') {
		ang = Math.PI / 2;
	}

	var initialPos = positions[0];
	for (var i = 0; i <= 4000; i += 200) {
		var startPos = polar(initialPos, ang, i);
		positions.unshift(new THREE.Vector3(startPos.x, initialPos.y, startPos.z));
	}
	// var startPos = polar(positions[0], ang, 1000);
	// positions.unshift(new THREE.Vector3(startPos.x, positions[0].y, startPos.z));

	// var start = positions[0].clone();
	// start.add(new THREE.Vector3(-100, 0, -100));
	// positions.unshift(start);
	// var ang = positions[positions.length - 1].angleTo(positions[positions.length - 2]);
	// var modifyEnd1 = polar(positions[positions.length - 1], ang, 250);
	// var modifyEnd1 = positions[positions.length - 1].clone().add(new THREE.Vector3(100, 0, 100));
	// var modifyEnd2 = positions[positions.length - 1].clone().add(new THREE.Vector3(-100, 0, 100));
	// positions.push(new THREE.Vector3(modifyEnd1.x, positions[positions.length - 1].y, modifyEnd1.z));

	// var toDown = positions.slice().reverse();
	// positions = positions.concat(toDown);

	var camSpline = new THREE.CatmullRomCurve3(positions, true);

	// var points = camSpline.getPoints( 50 );
	// var geometry = new THREE.BufferGeometry().setFromPoints( points );

	// var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

	// view.camSplineHelper = new THREE.Line( geometry, material );
	// view.scene.add(view.camSplineHelper);

	var obj = view.scene.getObjectByLayerName('treads');
	var box3 = new THREE.Box3().setFromObject(obj);
	view.sceneCenter = new THREE.Vector3();
	box3.getCenter(view.sceneCenter);

	view.camSpline = camSpline;
}

function createProjectionTexture(){
	
	// projCamera = new THREE.PerspectiveCamera(45, view.width / view.height, 10, 300);
	// var tread = view.scene.children[4].children[0].children[0];
	// var box3 = new THREE.Box3().setFromObject(tread);
	// var center = box3.getCenter();
	// projCamera.position.set(center.x, center.y + params.M, center.z);

	// projCamera.lookAt(center.x, center.y, center.z);
	// projCamera.rotation.z -= Math.PI / 2;
	// projCamera.updateMatrixWorld();

	// projCameraHelper = new THREE.CameraHelper( projCamera );
	// view.scene.add( projCameraHelper );
	// view.scene.add( projCamera );

	new THREE.TextureLoader().load('/images/calculator/textures/light.png', function(map){
		map.repeat = {x:0.005, y:0.005};
		map.rotation = Math.PI;
		map.offset.y = 1;

		view.scene.traverse(function(node){
			if (node instanceof THREE.Mesh) {
				if (node.layerName == 'tread_light') {
					// createSimpleLightForTread(node, map);
					createProjectionLightForTread(map, node);
				}
			}
		})
	});
}

function createSimpleLightForTread(light, map){
	var material = new THREE.MeshBasicMaterial({color: new THREE.Color(0xFFFFFF)});
	material.alphaMap = map;
	material.transparent = true;
	// material.opacity = 0.5;

	// var tread = light.userData.tread;

	// var box3 = new THREE.Box3().setFromObject(tread);
	// var size = new THREE.Vector3();
	// box3.getSize(size);

	// var newNode = new THREE.Mesh(new THREE.BoxBufferGeometry( 50, 1, params.M ), material);
	// light.parent.add(newNode);
	// newNode.matrixWorld.copy(light.matrixWorld);
	// newNode.matrixWorldNeedsUpdate = true;
	// newNode.position = new THREE.Vector3(0, 0, 0);
	// newNode.position.y -= tread.userData.h - 0.5;
	
	// newNode.material = material;
	// newNode.material.needsUpdate = true;
	// newNode.needsUpdate = true;

	// newNode.visible = false;

	// light.userData.lightMesh = newNode;
}

/** EXPERIMENTAL */
function createProjectionLightForTread(map, tread){
	projCamera = new THREE.PerspectiveCamera(45, view.width / view.height, 10, 300);
	var box3 = new THREE.Box3().setFromObject(tread);
	var center = new THREE.Vector3();
	box3.getCenter(center);
	projCamera.position.set(center.x, center.y + params.M, center.z);

	projCamera.lookAt(center.x, center.y, center.z);
	projCamera.rotation.z -= Math.PI / 2;
	projCamera.updateMatrixWorld();

	projCameraHelper = new THREE.CameraHelper( projCamera );
	view.scene.add( projCameraHelper );
	view.scene.add( projCamera );
	
	var projectionMaterial = new THREE.ShaderMaterial({
		transparent: true,
		uniforms: {
			baseColor: {value: new THREE.Color(0xcccccc)},
			cameraMatrix: { type: 'm4', value: projCamera.matrixWorldInverse },
			projMatrix: { type: 'm4', value: projCamera.projectionMatrix },
			texture: {value: map},
			opacity: {value: 1.0}
		},
		vertexShader: `
			
			varying vec4 vWorldPos;
			
			void main() {
			
			vWorldPos = modelMatrix * vec4(position, 1.0);
			gl_Position = projectionMatrix * viewMatrix * vWorldPos;
			
			}
			
		`,
		fragmentShader: `

			uniform vec3 baseColor;
			uniform sampler2D texture;
			uniform mat4 cameraMatrix;
			uniform mat4 projMatrix;
			uniform float opacity;
			
			varying vec4 vWorldPos;
			
			void main() {
				vec4 texc = projMatrix * cameraMatrix * vWorldPos;
				vec2 uv = texc.xy / texc.w / 2.0 + 0.5;
				
				vec4 color = ( max( uv.x, uv.y ) <= 1. && min( uv.x, uv.y ) >= 0. ) ? texture2D(texture, uv).rgba : vec4(1.0, 1.0, 1.0, 1.0);
				// vec4 finalColor = vec4(baseColor, 0.0);
				gl_FragColor = color;
			}
		`,
		side: THREE.DoubleSide
	});

	var newNode = tread.clone();
	newNode.position.y += 0.5;
	newNode.scale.z = 0.1;
	newNode.material = projectionMaterial;
	newNode.material.needsUpdate = true;
	newNode.needsUpdate = true;
	tread.parent.add(newNode);

	if (tread.userData && tread.userData.riser) {
		var newNode = tread.userData.riser.clone();
		newNode.position.z -= 0.01;
		newNode.scale.z = 0.01;
		newNode.material = projectionMaterial;
		newNode.material.needsUpdate = true;
		newNode.needsUpdate = true;
		tread.userData.riser.add(newNode);
	}
}

function updateUniforms(){
	projectionMaterial.uniforms = {
		baseColor: {value: new THREE.Color(0xcccccc)},
		cameraMatrix: { type: 'm4', value: projCamera.matrixWorldInverse },
		projMatrix: { type: 'm4', value: projCamera.projectionMatrix },
		opacity: {value: 0.6}
	};
}