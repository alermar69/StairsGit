var measure = [];
var hidenLayers = []; //список слоев, отключаемых для тестирования
var lastSelectedPoint = {x:0, y:0, z:0};
var lastSelectedPoint1 = {x:0, y:0, z:0};
var gui;
var $camera = [];

var view = {};
var $sceneStruct = {};

var selectedSpecObj = null;
var allSpecsShowed = false;

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

	/**
	 * Метод позволяет поворачивать uv на конкретной плоскости объекта
	 */
	THREE.Geometry.prototype.rotateUV = function(angle, faceMaterialIndex = 0){
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

	//заменяем библиотеку триангуляции
	THREE.Triangulation.setLibrary('earcut');
	
	var stopTesting = false; //параметр для остановки тестирования

	var clock = new THREE.Clock();
	
	//задаем параметры видового экрана
	
	var containerWidth = $('#WebGL-output').width();
	var containerHeight = $('#WebGL-output').height();
		
	view = {
		height: containerHeight,
		width: containerWidth,
		outputDivId: "WebGL-output",
	}

	addViewport = function(){

		window.scene = view.scene = new THREE.Scene();
		// Отныне строим сцену сразу как с текстурами
		view.renderer = createRenderer(true);
		createCamera();
		
		//добавляем свет
		// Отныне строим сцену сразу как с текстурами
		var lights = createLigts(true);
		$.each(lights, function(){
			view.scene.add(this);
		})
		view.lights = lights;
		//текстура мира создается в TextureManager по необходимости
		// view.scene.background = getSceneBackGround();
		
		//управление камерой
		view.orbitControls = new THREE.OrbitControls(view.camera, view.renderer.domElement);
		
		//вывод на страницу
		$('#' + view.outputDivId).html(view.renderer.domElement);
		
	//	window.addEventListener( 'resize', onWindowResize, false );
		
		//Перерисовка сцены
		renderScene = function (view) {
			requestAnimationFrame(renderScene);
			render();
		};

		var angle = 0;
		camPosIndex = 0;
		cameraState = 'Стандартная';
		view.clock = new THREE.Clock();

		render = function(){
			var delta = view.clock.getDelta();
			// console.log(delta)
			view.orbitControls.update(delta);
			view.renderer.setSize(view.width, view.height);
			// view.mirrorCamera.update( view.renderer, view.scene );

			var camera = view.camera;
			if ((cameraState == 'Вращение' || cameraState == 'Подъем') && view.splineCamera) {
				camera = view.splineCamera;
				if (cameraState == 'Вращение' && view.sceneCenter) {
					var angularSpeed = THREE.Math.degToRad(20); // угловая скорость - градусов в секунду
					var radius = 3000;

					camera.position.x = Math.cos(angle) * radius + view.sceneCenter.x;
					camera.position.y = params.staircaseHeight + 500;
					camera.position.z = Math.sin(angle) * radius + view.sceneCenter.z;
					angle += angularSpeed * delta; // приращение угла

					camera.lookAt(view.sceneCenter);
				}
				if( cameraState == 'Подъем' && view.camSpline){
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
					
					var lookAt = view.camSpline.getPoint((camPosIndex+1) / speed);
					lookAt.y -= 25;
					camera.lookAt(lookAt);
				}
			}

			view.renderer.render(view.scene, camera);
		};

		renderScene(view);
		
		//конфигурируем 3D меню
		var viewportId = 'vl_1';
		$[viewportId] = view.scene; //для совместимости с имеющимися функциями
		$sceneStruct[viewportId] = [];
			
		change3dMenu($sceneStruct);
		// Создаем менеджер текстур, в последствии он управляет всеми текстурами
		window.textureManager = new TextureManager(false);
	};

	/** функция возвращает стандартную камеру
	*/
	function createCamera(){
		view.camera = new THREE.PerspectiveCamera(45, view.width / view.height,  10, 100000);
		view.camera.position.set(-5000, 3000, 5000);

		view.splineCamera = new THREE.PerspectiveCamera( 60, view.width / view.height, 10, 10000 );
		
		view.scene.add( view.splineCamera );
		view.scene.add( view.camera );
	};
	
	/** функция возвращает стандартный рендерер
	*/
	
	function createRenderer(showTextures){
		if(!showTextures){
			var renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true,});
			renderer.setClearColor(new THREE.Color(0xEEEEEE));		
			renderer.shadowMap.enabled = true;
			renderer.shadowMap.type = 2;
		}
		if(showTextures){
			var renderer = new THREE.WebGLRenderer({
				preserveDrawingBuffer: true, //опция нужна для выгрузки в png
				antialias: true,
			});
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setClearColor(new THREE.Color(0xEEEEEE));
			renderer.shadowMap.enabled = true;
			
			// // postprocessing
			// composer = new THREE.EffectComposer( renderer );
			// ssaaRenderPass = new THREE.SSAARenderPass( view.scene, view.camera );
			// ssaaRenderPass.unbiased = false;
			// composer.addPass( ssaaRenderPass );
			// copyPass = new THREE.ShaderPass( THREE.CopyShader );
			// copyPass.renderToScreen = true;
			// composer.addPass( copyPass );
		}
		
		
		return renderer;
	}
	
	//включение и отключение текстур
	function redrawView(showTextures){
		// Вызываем метод менеджера для изменения состояния
		textureManager.setTexturesEnabled(showTextures);
		// //пересоздаем рендерер с нужными настройками
		// view.renderer = createRenderer(showTextures);
		// //управление камерой
		// view.orbitControls = new THREE.OrbitControls(view.camera, view.renderer.domElement);
		// //вывод на страницу
		// $('#' + view.outputDivId).html(view.renderer.domElement);
		
		
		// if(!showTextures){
		// 	view.scene = new THREE.Scene();
		// 	//добавляем свет
		// 	var lights = createLigts();
		// 	$.each(lights, function(){
		// 		view.scene.add(this);
		// 	})
		// 	$["vl_1"] = view.scene; //для совместимости с имеющимися функциями
		// 	recalculate();
		// }
		
		// if(showTextures){
		// 	updateTextures();
		// }
	}
	
	$(".updateTextures").click(function(){
		//if($sceneStruct["vl_1"].textures) 
		// gui.__folders['Настройки'].__controllers[7].setValue(true);	
		// updateTextures();
		// Обновляем состояние текстур
		textureManager.updateMaterials();
	})
	
    var $func = [];

    change3dMenu = function(viewportsParams){
        //добавляем элементы управления
        if(gui)
            gui.destroy();
        dat.GUI.TEXT_CLOSED = 'Закрыть панель';
        dat.GUI.TEXT_OPEN = 'Открыть панель';
        gui = new dat.GUI();
        var el;
        var controls = new function(){
            var self = this;
            self.selectvp = 'vp1';

            self.wall1 = true;
            self.wall2 = false;
            self.wall3 = true;
            self.wall4 = false;
            self.wallall = false;
			self.transparentWalls = true;
			self.treadLightsToggle = false;
			self.nightToggle = false;
			self.transparentAll = false;

            self.floorTop = false;
            self.floorBottom = true;
			self.topFloor = true;
			self.beamTop = true;


            self.perspective = true;
			self.cameraPosId = '0';
			self.cameraState = 'Стандартная';
			
            self.shadows = false;
			self.background = true;
			self.wireframes = false;
			self.realColors = false;
			self.textures = false;
			self.bevels = false;
			self.boltHead = true;
			self.banisters = true;
			self.newell_fixings = true;
			
			var url = document.location.href;

            self.stairs = false;
            self.frame = false;
            self.steps = false;
            self.fences = false;

            self.switchCamera = function(viewportId, posId) {
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

				if(!controls.perspective)
					view.camera = new THREE.OrthographicCamera( view.width / - 0.25, view.width / 0.25, view.height / 0.25, view.height / - 0.25, -20000, 50000);

				// view.camera.position.set(...pos);
				view.camera.position.set(pos[0], pos[1], pos[2]);
			   
                view.orbitControls = new THREE.OrbitControls(view.camera, view.renderer.domElement);
               // $orbitControls[viewportId].enableZoom = true;
            };

        };

        var menu = [], i = 1;
        for(var key in viewportsParams){
            menu.push('vp'+i);
            i++;
        }
        hideShowObject = function(){
            $sceneStruct[controls.selectvp][this.property] = !$sceneStruct[controls.selectvp][this.property];
			controls[this.property] = $sceneStruct[controls.selectvp][this.property];
			
            if($[controls.selectvp].getObjectByLayerName(this.property)){
                $[controls.selectvp].getObjectByLayerName(this.property).visible = controls[this.property];
            }
        };
        updateGUI = function(){
            for (var i in gui.__controllers) {
                if(gui.__controllers[i].property == 'selectvp')
                    continue;
                gui.__controllers[i].object[gui.__controllers[i].property] =
                    $sceneStruct[controls.selectvp][gui.__controllers[i].property];
                gui.__controllers[i].updateDisplay();
            }
            for(var i in gui.__folders)
                for (var j in gui.__folders[i].__controllers) {
                gui.__folders[i].__controllers[j].object[gui.__folders[i].__controllers[j].property] =
                    $sceneStruct[controls.selectvp][gui.__folders[i].__controllers[j].property];
                    gui.__folders[i].__controllers[j].updateDisplay();
                }
        };
        gui.add(controls, 'selectvp', menu).name('Экран').onChange(updateGUI);

        i=1;
        for(var key in viewportsParams){
            $('select option[value="vp'+i+'"]').val(key);
            if(i==1)
                controls.selectvp = key;
            i++;
        }
        var guiWall = gui.addFolder("Обстановка");
        guiWall.add(controls, 'wall1').name('Стена 1').onChange(hideShowObject);
        guiWall.add(controls, 'wall2').name('Стена 2').onChange(hideShowObject);
        guiWall.add(controls, 'wall3').name('Стена 3').onChange(hideShowObject);
        guiWall.add(controls, 'wall4').name('Стена 4').onChange(hideShowObject);
        guiWall.add(controls, 'wallall').name('Все стены').onChange(function(){
            $sceneStruct[controls.selectvp]["wallall"] = !$sceneStruct[controls.selectvp]["wallall"];
            controls.wallall = $sceneStruct[controls.selectvp]["wallall"];
            for(var i in guiWall.__controllers){
                if(guiWall.__controllers[i].property != 'wallall')
                {
                    if(controls.wallall != controls[guiWall.__controllers[i].property])
                        guiWall.__controllers[i].domElement.click();
                }
            }
        });
		guiWall.add(controls, 'floorBottom').name('Нижнее').onChange(hideShowObject);		
		guiWall.add(controls, 'topFloor').name('Верхнее').onChange(function(){
			var objects = $[gui.__controllers[0].object['selectvp']].getObjectsByLayerName("topFloor");
			objects.setVisible(controls["topFloor"]);
		});
		guiWall.add(controls, 'beamTop').name('Балки').onChange(hideShowObject);
        guiWall.open();


        var guiSettings = gui.addFolder("Настройки");
        //guiFloor.add(controls, 'floorTop').name('Верхнее').onChange(hideShowObject);

       // guiFloor.open();
	   
		//стандартные позиции камеры
		var cameras = ["3d", "справа", "слева", "спереди", "сзади", "сверху", "снизу", 'orto_0', 'orto_1', 'orto_3', 'orto_4']
		
		guiSettings.add(controls, 'cameraPosId', cameras).name('Вид').onChange(function(){
			var cameraPosId = this.object.cameraPosId;			
			$sceneStruct[controls.selectvp]["cameraPosId"] = cameraPosId
			controls.cameraPosId = cameraPosId;
			var ortoViews = ["справа", "слева", "спереди", "сзади", "сверху", "снизу"]
			if(ortoViews.indexOf(cameraPosId) != -1){
				gui.__folders['Настройки'].__controllers[1].setValue(false);
				$sceneStruct[controls.selectvp]["perspective"] = false;
				controls.perspective = false;
			}
			
			controls.switchCamera(controls.selectvp, controls.cameraPosId);
		});

		var cameraStates = ["Стандартная", "Вращение", "Подъем"];

		guiSettings.add(controls, 'cameraState', cameraStates).name('Камера').onChange(function(){
			$sceneStruct[controls.selectvp]["cameraState"] = this.object.cameraState
			controls.cameraState = this.object.cameraState;
			if (typeof cameraState != 'undefined') {
				cameraState = this.object.cameraState;
			}
		});
		
        guiSettings.add(controls, 'perspective').name('Перспектива').onChange(function(){
            $sceneStruct[controls.selectvp]["perspective"] = this.object.perspective;
            controls.perspective = this.object.perspective;
            controls.switchCamera(controls.selectvp, controls.cameraPosId);
		});

		guiSettings.add(controls, 'transparentWalls').name('Прозр.стены').onChange(function(){
			$sceneStruct[controls.selectvp]["transparentWalls"] = this.object.transparentWalls;
			controls.transparentWalls = this.object.transparentWalls;
			var layers = ["wall1", "wall2", "wall3", "wall4", "topFloor", "ceil", "beamTop"]
			
			view.scene.traverse(function(node){
				if (node.material && layers.indexOf(node.layerName) != -1) {
					node.material.transparent = controls.transparentWalls;
					node.material.opacity = 0.3;
				}
			});
		});

		guiSettings.add(controls, 'treadLightsToggle').name('Подсветка ступеней').onChange(function(){
			$sceneStruct[controls.selectvp]["treadLightsToggle"] = this.object.treadLightsToggle;
			controls.treadLightsToggle = this.object.treadLightsToggle;
			toggleTreadLights('step', this.object.treadLightsToggle);
		});

		guiSettings.add(controls, 'nightToggle').name('Ночь').onChange(function(){
			$sceneStruct[controls.selectvp]["nightToggle"] = this.object.nightToggle;
			controls.nightToggle = this.object.nightToggle;
			toggleNightMode(this.object.nightToggle);
		});
		
		guiSettings.add(controls, 'transparentAll').name('Прозр.все').onChange(function(){
			$sceneStruct[controls.selectvp]["transparentAll"] = this.object.transparentAll;
			controls.transparentAll = this.object.transparentAll;

			view.scene.traverse(function(node){
				if (node.material) {
					node.material.transparent = controls.transparentAll;
					node.material.opacity = 0.3;
				}
			});

		});
		
		guiSettings.add(controls, 'background').name('Фон').onChange(function(){
            $sceneStruct[controls.selectvp]["background"] = this.object.background;
            controls.background = $sceneStruct[controls.selectvp]["background"];
			if(this.object.background) view.renderer.setClearColor(new THREE.Color(0xEEEEEE));
			else view.renderer.setClearColor(new THREE.Color(0xFFFFFF));
        });
		
		guiSettings.add(controls, 'wireframes').name('Ребра').onChange(function(){
			$sceneStruct[gui.__controllers[0].object['selectvp']]['wireframes'] = !$sceneStruct[gui.__controllers[0].object['selectvp']]['wireframes'];
            controls['wireframes'] = $sceneStruct[gui.__controllers[0].object['selectvp']]['wireframes'];
			var objects = $[gui.__controllers[0].object['selectvp']].getObjectsByLayerName("_wf");
			objects.setVisible(controls['wireframes']);
        });
		
		guiSettings.add(controls, 'realColors').name('Цвета').onChange(function(){
            $sceneStruct[controls.selectvp]["realColors"] = !$sceneStruct[controls.selectvp]["realColors"];
            controls.realColors = $sceneStruct[controls.selectvp]["realColors"];
			var objects = $[gui.__controllers[0].object['selectvp']].getObjectsByLayerName("_wf");
			$.each(objects, function(){
				this.material.color.setRGB(255,255,255)
			})
			//objects.setVisible(controls['wireframes']);
        });
		
		guiSettings.add(controls, 'textures').name('Текстуры').onChange(function(){
			$sceneStruct[controls.selectvp]["textures"] = !$sceneStruct[controls.selectvp]["textures"];
            controls.textures = $sceneStruct[controls.selectvp]["textures"];
			redrawView(controls.textures)
			
		});
		
		guiSettings.add(controls, 'bevels').name('Фаски').onChange(function(){
            $sceneStruct[controls.selectvp]["bevels"] = !$sceneStruct[controls.selectvp]["bevels"];
            controls.bevels = $sceneStruct[controls.selectvp]["bevels"];
        });
		
		guiSettings.add(controls, 'boltHead').name('Головки болтов').onChange(function(){
            $sceneStruct[controls.selectvp]["boltHead"] = this.object.boltHead;
            controls.boltHead = $sceneStruct[controls.selectvp]["boltHead"];
        });
		
		guiSettings.add(controls, 'banisters').name('Балясины').onChange(function(){
			$sceneStruct[controls.selectvp]["banisters"] = this.object.banisters;
			controls.banisters = $sceneStruct[controls.selectvp]["banisters"];
		});
		if ($('#calcType').val() == 'timber_stock'){
			guiSettings.add(controls, 'newell_fixings').name('Кр.Столбов').onChange(function(){
				$sceneStruct[controls.selectvp]["newell_fixings"] = this.object.newell_fixings;
				controls.newell_fixings = $sceneStruct[controls.selectvp]["newell_fixings"];
			});
		}
		
		
		
		//задаем начальные значения
		$sceneStruct["vl_1"]["boltHead"] = true;
		$sceneStruct["vl_1"]["banisters"] = true;
		$sceneStruct["vl_1"]["newell_fixings"] = false;


		$sceneStruct["vl_1"]["background"] = true;
		$sceneStruct["vl_1"]["perspective"] = true;
		$sceneStruct["vl_1"]["transparentWalls"] = true;
		
		$sceneStruct["vl_1"]["treadLightsToggle"] = false;
		$sceneStruct["vl_1"]["nightToggle"] = false;

		$sceneStruct["vl_1"]["wireframes"] = true;	
		
		guiSettings.open();
	    gui.close();
    };

		addFloorPlane = function(viewportId, isVisible) {
			isVisible = isVisible || false;
			drawFloorPlane(params.floorThickness - params.floorOffsetBot, params.floorOffsetBot, isVisible, viewportId, 0xaaaaaa);
			if (params.floorOffsetBot > 0) {
				drawFloorPlane(params.floorOffsetBot, 0, isVisible, viewportId, 0xcccccc);
			}
			
		};

		drawFloorPlane = function(thickness, offsetY, isVisible, viewportId, color){
			
			var mat = params.materials.floor;
			
			var planeGeometry = new THREE.CubeGeometry(20000, thickness, 20000);

			var plane = new THREE.Mesh(planeGeometry, mat);
			plane.receiveShadow = true;
			plane.position.set(0, -thickness / 2 - offsetY, 0);
			plane.visible = isVisible;
			plane.layerName = "floorBottom";
			var floorBSP = new ThreeBSP(plane);
		
			$sceneStruct[viewportId]["floorBottom"] = isVisible;
			var floorObj = new THREE.Object3D();

			$(".ledgeParRow").each(function(i){
				if($(this).find(".wallLedgeBaseWall").val() == "нижнее"){
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

		};

    _addWalls = function(viewportId, turnFactor){
	
		for(var i=1; i < 5; i++)
        {
            var visible = $sceneStruct[viewportId]["wall"+i] || false;
            //текущая стена
            var length = $('#wallLength_' + i).val() * 1.0;
            var height = $('#wallHeight_' + i).val() * 1.0;
            var thickness = $('#wallThickness_' + i).val() * 1.0;
			if(length && height && thickness){
				var positionX = $('#wallPositionX_' + i).val()*1 + (i>2?0:length/2) + (i==4?-thickness/2:i==3?thickness/2:0);
				var positionZ = $('#wallPositionZ_' + i).val()*1 + (i>2?length/2:thickness/2*(i==1?-1:1));
				var wallGeometry = new THREE.CubeGeometry(length,height,thickness);
				var wall = new THREE.Mesh(wallGeometry, params.materials.wall);
				wall.userData.isWall = true;
				wall.position.set(positionX, height / 2, positionZ * turnFactor);
				addLedges(viewportId, wall, i);
			}
           // wall.visible = visible;
        }
    }
    addWalls = function(viewportId, isVisible){
        /*вспомогательные оси*
        var axes = new THREE.AxisHelper( 2000 );
        $[viewportId].add(axes);
		*/
        isVisible = isVisible || false;
        var wall, length, height, positionX, positionY, positionZ, thickness, turnSide, turnFactor;
        var turnSide = $("#turnSide").val();
        var turnFactor = turnSide == "правое" ? 1 : turnSide == "левое" ? -1 : 1;
        //создаем стены
        //1 - дальняя, 2 - ближняя, 3 - правая, 4 - левая
        $sceneStruct[viewportId]["wall1"] = isVisible;
        $sceneStruct[viewportId]["wall2"] = isVisible;
        $sceneStruct[viewportId]["wall3"] = isVisible;
        $sceneStruct[viewportId]["wall4"] = isVisible;

        _addWalls(viewportId, turnFactor);
    };

    redrawWalls = function(){
        var turnSide = $("#turnSide").val();
        var turnFactor = turnSide == "правое" ? 1 : turnSide == "левое" ? -1 : 1;
		
        //перебираем выдовые экраны
        $.each($sceneStruct,function(k,v){
            var obj, objWf;
            //удаляем стены
            var find = false; //есть стены на сцене
            for(var i = 1; i < 5; i++){
                obj = $[k].getObjectByLayerName('wall'+i);
                if(obj) {
                    find = true;
                    $[k].remove(obj);
					obj = null;
                }
				//белые ребра
				objWf = $[k].getObjectByLayerName('wall'+i + '_wf'); //ребра
                if(objWf) {
					$[k].remove(objWf);
					objWf = null;
					}
            }
		
		_addWalls(k, turnFactor);
		
		//перерисовываем нижнее перекрытие

		removeObjects(k, 'floorBottom');		
		addFloorPlane(k, true);
        });
    };
	
	hideWalls = function(){
	
		//перебираем выдовые экраны
        $.each($sceneStruct, function(k,v){
            var obj, objWf;
            //скрываем стены
            for(var i = 1; i < 5; i++){
				//сами стены
				obj = $[k].getObjectByLayerName('wall'+i);
				if(obj) obj.visible = false;

				//белые ребра
				objWf = $[k].getObjectByLayerName('wall'+i + '_wf'); //ребра
				if(obj) obj.visible = false;
            }
			//нижнее перекрытие
			obj = $[k].getObjectByLayerName("floorBottom");
			if(obj) obj.visible = false;
			
			//верхнее перекрытие
			obj = $[k].getObjectByLayerName("topFloor");
			if(obj) obj.visible = false;
		});
	}
	
    addLedges = function(viewportId, wall, n){
	
        //найдем выступы, для этой стены
        var wallLedgeWidths = $('#wallLedgesTable [id^=wallLedgeBaseWall]').filter(function(){
            return this.value == n;
        });
	//var boxNew = [];
	var complexWall = new THREE.Object3D();
        //если есть выступы для этой стены
        if(wallLedgeWidths.length) {
            //
            var x = wall.position.x,
                y = wall.position.y,
                z = wall.position.z,
                w = wall.geometry.parameters.width,
                h = wall.geometry.parameters.height,
                d = wall.geometry.parameters.depth;
            var wallBSP = new ThreeBSP(wall);
            wallLedgeWidths.each(function (_i, val) {
				//узнаем Id текущих элементов
               // var i = val.id.match(/^.*(\d+)$/)[1];
			   var i = val.id.slice(val.id.indexOf("Wall") + 4);
                var wallLedgeWidth = $('#wallLedgeWidth' + i).val(),
                    wallLedgeType = $('#wallLedgeType' + i).val(),
                    wallLedgeBaseWall = $('#wallLedgeBaseWall' + i).val(),
                    wallLedgeHeight = $('#wallLedgeHeight' + i).val(),
                    wallLedgeDepth = $('#wallLedgeDepth' + i).val(),
                    wallLedgePosX = $('#wallLedgePosX' + i).val(),
                    wallLedgePosY = $('#wallLedgePosY' + i).val(),
                    wallLedgePosZ = $('#wallLedgePosZ' + i).val(),
                    geometry = new THREE.CubeGeometry(wallLedgeWidth, wallLedgeHeight, wallLedgeDepth), 
					ledge = new THREE.Mesh(geometry, params.materials.wall);
										
                ledge.position.x = x - w / 2 + wallLedgeWidth / 2 + wallLedgePosX * 1;
                ledge.position.y = y - h / 2 + wallLedgeHeight / 2 + wallLedgePosY * 1;
				if (wallLedgeBaseWall == 2) {
						ledge.position.x = x + w / 2 - wallLedgeWidth / 2 - wallLedgePosX * 1;
					}
				
                if (wallLedgeWidth > 0 && wallLedgeHeight > 0 && wallLedgeDepth > 0) {
                    if (wallLedgeType == "выступ") {
                        ledge.position.z = z + d / 2 + wallLedgeDepth / 2;
						var mirrowZ = false;						
						if(wallLedgeBaseWall == 1 && $("#turnSide").val() == "левое") mirrowZ = true;
						if(wallLedgeBaseWall == 2 && $("#turnSide").val() == "правое") mirrowZ = true;

						if(mirrowZ)	ledge.position.z = z - d / 2 - wallLedgeDepth / 2;


						if (wallLedgeBaseWall == 4) {
							ledge.position.x = x + d / 2 + wallLedgeDepth / 2;
							ledge.position.z = z + w / 2 - wallLedgeWidth / 2 - wallLedgePosX * 1;
							ledge.rotation.y = -Math.PI / 2;
						}
						if (wallLedgeBaseWall == 3) {
							ledge.position.x = x - d / 2 - wallLedgeDepth / 2;
							ledge.position.z = z - w / 2 + wallLedgeWidth / 2 + wallLedgePosX * 1;
							ledge.rotation.y = -Math.PI / 2;
						}
						// var ledgeBSP = new ThreeBSP(ledge);
						// wallBSP = wallBSP.union(ledgeBSP);
						ledge.userData = {
							id: i,
							isLedge: true,
						};
						
						// var test = new THREE.Object3D();
						// test.add(ledge);
						// test.rotation.y = Math.PI / 2;
						complexWall.add(ledge);
						// complexWall.add(test);
                    }
                    if (wallLedgeType == "проем") {
                        ledge.position.z = z + d / 2 - wallLedgeDepth / 2;
						if($("#turnSide").val() == "левое"){
							ledge.position.z = z - d / 2 + wallLedgeDepth / 2;
							}
                        var ledgeBSP = new ThreeBSP(ledge);
                        wallBSP = wallBSP.subtract(ledgeBSP);
                    }
                    if (wallLedgeType == "параллелепипед") {
						var box = new THREE.Mesh(geometry, params.materials.wall);
						box.position.x = wallLedgePosX*1.0 + wallLedgeWidth/2;
						box.position.y = wallLedgePosY*1.0 + wallLedgeHeight/2;
						box.position.z = wallLedgePosZ*1.0 + wallLedgeDepth/2;
						// box.userData = {}
						box.userData = {
							id: _i,
							isLedge: true,
						}
						complexWall.add(box);
                    }
                }
            });

            wall = wallBSP.toMesh();
            wall.material = params.materials.wall;
			wall.geometry.computeVertexNormals();
        }
        wall.layerName = 'wall' + n;
        wall.rotation.y = n == 3 ? 1.5 * Math.PI : n == 4 ? 0.5 * Math.PI : n == 2 ? Math.PI : 0;

		
		complexWall.add(wall);

		wall.userData.isWall = true;
		
		addObjects(viewportId, complexWall, wall.layerName);
    };

    var guiLayers;
    updateLaersControls = function(){
        for(var i in guiLayers.__folders)
            for (var j in gui.__folders[i].__controllers) {
                gui.__folders[i].__controllers[j].object[gui.__folders[i].__controllers[j].property] =
                    $sceneStruct[controls.selectvp][gui.__folders[i].__controllers[j].property];
                gui.__folders[i].__controllers[j].updateDisplay();
            }
    };
    addLayer = function(layerName, label){
        if(typeof controls === "undefined")
            controls = new function() {};
        var self = this;
        controls[layerName] = false;
        var found = false;
        $.each(gui.__folders, function(key, val){
            if(key == 'Слои')
                found = true;
        });

        if(!found)
            guiLayers = gui.addFolder("Слои");

		$sceneStruct["vl_1"][layerName] = true;
		
        guiLayers.add(controls, layerName).name(label).onChange(function(){
			$sceneStruct[gui.__controllers[0].object['selectvp']][layerName] = !$sceneStruct[gui.__controllers[0].object['selectvp']][layerName];
            controls[layerName] = $sceneStruct[gui.__controllers[0].object['selectvp']][layerName];
			var objects = $[gui.__controllers[0].object['selectvp']].getObjectsByLayerName(layerName);
			objects.setVisible(controls[layerName]);
        });
        guiLayers.open();
    };
	
	
	
	
    var $objectAdd = [];
	
    addObjects = function(viewportId, objectsArr, layerName){
		if(!Array.isArray(objectsArr)) objectsArr = [objectsArr];
		
		//игнорируемые слои для теста
		if(hidenLayers.indexOf(layerName) != -1) return;
	
	
		//добавляем объекты в сцену
        var $obj = [];
        layerName = layerName || 'nonameLayer';
	
		$.each(objectsArr, function(){
            this.visible = $sceneStruct[gui.__controllers[0].object['selectvp']][layerName];

			this.setLayer(layerName, false);
			
			//добавляем ребра
			if(layerName != "measure" && layerName != "dimensions") {
				addWareframe(this, this);
			}			
			
			$[viewportId].add(this);
            
            //формируем массив ID-шников объектов, по имени
            $obj[layerName] = $.merge(($obj[this.name]?$obj[layerName]:[]), [this.id]);
        });
		
        $objectAdd[viewportId] = $.extend({}, $objectAdd[viewportId], $obj);
        updateGUI();

    };
    removeObjects = function(viewportId, layerName){
        //удаляем объекты из сцены
       if($objectAdd[viewportId]) {
			var removeObjects = [];
			$[viewportId].traverse(function(node){
				if (node.layerName == layerName || node.layerName == layerName + "_wf") {
					removeObjects.push(node);
				}
			});
			removeObjects.forEach(function(node){
				$[viewportId].remove(node);
				if(node.parent) node.parent.remove(node);
				disposeObjects(node);
				delete node;
			});
			// while(obj = $[viewportId].getObjectByLayerName(layerName)){
			// 	$[viewportId].remove(obj);
			// 	disposeObjects(obj);
			// 	delete obj;
            //     }
			
        }
    };

    addObject = function(viewportId, object){
        if(object.layerName)
        {

        }
    };
	
	function disposeObjects(obj)
    {
        if (obj !== null)
        {
            for (var i = 0; i < obj.children.length; i++)
            {
                disposeObjects(obj.children[i]);
            }
            if (obj.geometry)
            {
                obj.geometry.dispose();
                obj.geometry = undefined;
            }
            if (obj.material)
            {
                if (obj.material.map)
                {
									if (obj.material.map.dispose) {
										obj.material.map.dispose();
									}else{
										delete obj.material.map
									}
                    // obj.material.map = undefined;
                }
								if (obj.material.dispose) {
									obj.material.dispose();
								}else{
									delete obj.material
								}
                obj.material = undefined;
            }
        }
        obj = undefined;
	};
	
	//Обработчик кнопки отмена(возвращает сцену в нормальный вид)
	$('#resetSpecView').click(function(){
		view.scene.traverse(function(node){
			if (node.material) {
				node.material.transparent = false;
				node.material.depthTest = true;
				node.material.opacity = 1;
				if (node.oldMaterial) {
					node.material = node.oldMaterial;
					node.material.transparent = false;
					node.material.depthTest = true;
					node.material.opacity = 1;
				}
			}
		});
	})

	//Обработчик кнопки показать все объекты
	$('#showAllObjects').click(function(){
		var specId = selectedSpecObj.specId;
		if (specId) {
			var specObjects = [];
			allSpecsShowed = true;
			view.scene.traverse(function(node){
				if (node.specId == specId) {
					specObjects.push(node);
				}
				if (node.material) {
					if (node.oldMaterial) {
						node.material = node.oldMaterial;
						node.material.transparent = false;
						node.material.depthTest = true;
						node.material.opacity = 1;
						node.oldMaterial = null;
					}
	
					node.material.opacity = 0.1;
					node.material.transparent = true;
				}
			});
			for (var i = 0; i < specObjects.length; i++) {
				var obj = specObjects[i];
				showSpecObject(obj, specId);
			}
		}
	});

	//Показывает информацию о объекте
	function showSpecInfo(selectedObj, e){
		$('#selectedObjectInfo').show();
		$('#selectedObjectInfo').css({left: Math.round(e.pageX + 20), top: Math.round(e.pageY - $('#selectedObjectInfo').height()), position:'absolute'});
		if (selectedObj && selectedObj.specId) {
			var specElem = findInSpec(selectedObj.specId);
			if (specElem) {
				$('#selectedObjectInfo .object-info').html("Артикул: " + selectedObj.specId + "<br>" + "Имя: " + specElem.name + "<br>" +  "Количество: " + specElem.amt);
			}else{
				var parts = createPartsList();
				$('#selectedObjectInfo .object-info').html("Артикул: " + selectedObj.specId);
				if (parts[selectedObj.specId]) {
					$('#selectedObjectInfo .object-info').html("Артикул: " + selectedObj.specId + " Имя: " + parts[selectedObj.specId].name);
				}else{
				}
			}
			$('#showAllObjects').show();
		}else{
			$('#selectedObjectInfo .object-info').html("Этому объекту артикул не присвоен")
			$('#showAllObjects').hide();
		}
	}

	//Убирает выделение с объекта
	function unselectSpecObj(){
		if (selectedSpecObj && selectedSpecObj.traverse) {
			selectedSpecObj.traverse(function(node){
				if (node.material instanceof THREE.Material && node.oldMaterial instanceof THREE.Material) {
					node.material = node.oldMaterial;
					delete node.oldMaterial;
				}
			});
		}
		selectedSpecObj = null;
	}

	//Применяет материал выделения к объекту
	function showSpecObject(object, specId){
		object.specIdTraverse(specId, function(node){
			if ((!node.specId || node == object) && node.type != "LineSegments" && node.material) {
				node.oldMaterial = node.material;
				node.material = selectMaterial;
			}
		});
	}

	//Выделяет объект
	function selectSpecObj(selectedObj, evt){
		if (selectedObj.specId) {
			if (selectedSpecObj) unselectSpecObj();
			selectedSpecObj = selectedObj;
			showSpecInfo(selectedObj, evt);
			showSpecObject(selectedObj, selectedObj.specId)
		}else{
			if(selectedObj.parent) {
				selectSpecObj(selectedObj.parent, evt);
			}else{
				showSpecInfo(false, evt);
			}
		}
	}

	var linesHidden = false;

	$(document).keydown(function(e){
		if (e.shiftKey && typeof view.scene != 'undefined') {
			view.scene.traverse(function(node){
				if (node instanceof THREE.LineSegments) {
					node.visible = false;
					linesHidden = true;
				}
			})
		}
	});

	$(document).keyup(function(e){
		if (linesHidden) {
			view.scene.traverse(function(node){
				if (node instanceof THREE.LineSegments) {
					node.visible = true;
				}
			})
		}
	});

    addMeasurement = function(viewportId) {
		if (measure) removeObjects(viewportId, 'measure');
		
		measure = [];
		// measurement
		var threshold = 10;
		var fmin = false;
		var point_snap;

		var spStart, spEnd, sConnection;

    	var sphereGeometry = new THREE.SphereGeometry(0.75, 32, 32);
    	var sphereMaterial = new THREE.MeshBasicMaterial({color: 0xbb0000, flatShading: THREE.FlatShading});
    	spStart = new THREE.Mesh(sphereGeometry, sphereMaterial);
    	spEnd = new THREE.Mesh(sphereGeometry, sphereMaterial);
    	spStart.position.set(100, 0, 0);
    	spEnd.position.set(100, 500, 0);
    	measure.push(spStart);     // scene.add
    	measure.push(spEnd);       // scene.add

    	var lc = new THREE.Color( 0xff0000 );
    	var lineGeometry = new THREE.Geometry();
    	lineGeometry.vertices.push(spStart.position.clone(), spEnd.position.clone());
    	lineGeometry.colors.push(lc, lc, lc);
    	var lineMaterial = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } );
    	sConnection = new THREE.Line(lineGeometry, lineMaterial);
    	measure.push(sConnection);  // scene.add

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
    	var newdiv1 = $("<div id='popuup_div' align='left' style='position:absolute;z-index:1000;width:130px;height:88px;background-color:white;text-align:left;padding-left:9px;color:#000000;font: 16px Verdana, Arial, Helvetica, sans-serif;display:none;'></div>");
    	$("body").append(newdiv1);
    	var newdiv2 = $("<div id='popuup2_div' align='left' style='position:absolute;z-index:1000;width:330px;height:28px;background-color:white;text-align:left;padding-left:9px;color:#000000;font: 18px Verdana, Arial, Helvetica, sans-serif;display:none;'></div>");
    	$("body").append(newdiv2);

		var canvas = view.renderer.domElement;

        function onDocumentMouseDown( evt ) {
    	  	spStart.visible = false;
    	  	spEnd.visible = false;
    	  	sConnection.visible = false;
    	  	sphereHelper.visible = false;

			$('#selectedObjectInfo').hide();
			if (selectedSpecObj && !allSpecsShowed) unselectSpecObj();
    	  	$('#popuup_div').stop(true, true).hide();
					$('#popuup2_div').stop(true, true).hide();
     	  	if ((!evt.ctrlKey && !evt.shiftKey && !params.customersDimensions) || evt.which !== 1) return;

          	var raycaster = new THREE.Raycaster();

          	var mouse = new THREE.Vector2();
          	var canvasPosition = $(canvas).position();
    	  	var BB = canvas.getBoundingClientRect();
          	mouse.x = ((evt.clientX - BB.left) / canvas.width) * 2 - 1;
          	mouse.y = -((evt.clientY - BB.top) / canvas.height) * 2 + 1;

          	// update the picking ray with the camera and mouse position
          	raycaster.setFromCamera( mouse, view.camera );
          	// calculate objects intersecting the picking ray var intersects =
    	  	var intersects = raycaster.intersectObjects( $[viewportId].children, true );

			//выделение объекта
			if(intersects[0]) var selectedObj = intersects[0].object;
			if (selectedObj) {
				if (evt.shiftKey) {
					selectSpecObj(selectedObj, evt)
				}

				if(evt.ctrlKey || params.customersDimensions){
					sphereHelper.visible = false;
					spStart.visible = true;
					spEnd.visible = true;
					sConnection.visible = true;
					if(typeof onObjSelection == "function") onObjSelection(selectedObj);
					
					if (fmin && intersects.length > 0) {
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
					}
		
		
					// placing distance label
					var labelPos = spStart.position.clone().add(spEnd.position).multiplyScalar(0.5);
					var distance = spStart.position.distanceTo(spEnd.position);
					var lblDistance = document.getElementById("popuup_div");
					$('#popuup_div').stop(true, true).css({left: Math.round(evt.pageX + 20), top: Math.round(evt.pageY)}).show();
					lblDistance.innerHTML = '&#x1D6AB;x: ' + Math.abs(spStart.position.x - spEnd.position.x).toFixed(1)
						+ '<br/>&#x1D6AB;y: ' + Math.abs(spStart.position.y - spEnd.position.y).toFixed(1)
						+ '<br/>&#x1D6AB;z: ' + Math.abs(spStart.position.z - spEnd.position.z).toFixed(1)
						+ '<br/>dist: ' + distance.toFixed(2);
	
				}
			}
        }
        function onDocumentMouseMove( evt ) {
            try {
				canvas.style.cursor = 'auto';
         	  	if (!evt.ctrlKey && !params.customersDimensions) return;

              	var raycaster = new THREE.Raycaster();

              	// var mouse = new THREE.Vector2();
              	// var canvasPosition = $(canvas).position();
        	  	// 	var BB = canvas.getBoundingClientRect();
              	// mouse.x = ((evt.clientX - BB.left) / canvas.width) * 2 - 1;
              	// mouse.y = -((evt.clientY - BB.top) / canvas.height) * 2 + 1;
				// var mouse = setPickPosition(evt);
				var mouse = {};
				const rect = canvas.getBoundingClientRect();
				const pos = {
					x: event.clientX - rect.left,
					y: event.clientY - rect.top,
				};
				mouse.x = (pos.x / canvas.clientWidth ) *  2 - 1;
				mouse.y = (pos.y / canvas.clientHeight) * -2 + 1;  // note we flip Y

              	// update the picking ray with the camera and mouse position
              	raycaster.setFromCamera( mouse, view.camera );
              	// calculate objects intersecting the picking ray var intersects =
        	  	var intersects = raycaster.intersectObjects( $[viewportId].children, true );

        		if (intersects.length > 0) {
        		    var intersect = intersects[0];
            		//var face = intersect.face;
            		var point = intersect.point;
            		var object = intersect.object;
        		    var distance;

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

            		point_snap = { x: 0, y: 0, z: 0 };
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
        	catch (ex) {
        		console.log(ex);
        	}
        }

       // document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	   // document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	   $("#WebGL-output").unbind('mousedown');
	   $("#WebGL-output").unbind('mousemove');
	   $("#WebGL-output").bind("mousedown", onDocumentMouseDown)
	   $("#WebGL-output").bind("mousemove", onDocumentMouseMove)

	};



findIntersects = function(scene, viewportId, onFinish) {

	var showEdge = function (obj) {
	    var geo = new THREE.EdgesGeometry( obj.geometry ); // or WireframeGeometry
	    var wireframe = new THREE.LineSegments( geo, intersectsMaterial2 );
		var vector = new THREE.Vector3();
		vector.setFromMatrixPosition( obj.matrixWorld );
		wireframe.position.set(vector.x, vector.y, vector.z);
		var quaternion = new THREE.Quaternion();
		obj.getWorldQuaternion(quaternion);
		wireframe.quaternion.copy(quaternion);
		//wireframesinter.push( wireframe );
		//scene.add(wireframe);
		addObjects(viewportId, wireframe, "wireframesinter");
	};


	var nname = function (obj) {		
		var name = obj.layerName;		
		if (obj.layerName === '' && !!obj.parent) name = nname(obj.parent);
		return name;
	};

	var isVisible = function (obj) {
		if ((obj.visible || obj.visible === undefined) && !!obj.parent) return isVisible(obj.parent); 
		else return obj.visible === undefined ? true : obj.visible;
	};

	//функция поиска пересечений ограничивающих параллелограммов
	var isBoxIntercection = function (box1, box2){
		var tolerance = 0.01; //допуск для учета погрешности округления чисел
		var intercect = {
			x: true,
			y: true,
			z: true,
			}
		
		for(var axis in intercect){
			//первый правее второго
			if(box1.min[axis] - box2.max[axis] >= -tolerance) intercect[axis] = false;
			//второй правее первого
			if(box2.min[axis] - box1.max[axis] >= -tolerance) intercect[axis] = false;
			}
		var result = intercect.x && intercect.y && intercect.z;
		return result;
		}

	var collectObj = function(obj) {
		if(obj.name.indexOf("stl") != -1) return;
		if (!!obj.geometry && isVisible(obj) && obj.type !== 'LineSegments') {
			if (!!obj.parent) {
				var nnn = nname(obj);
				obj.updateMatrixWorld();
    			THREE.SceneUtils.detach( obj, obj.parent, scene );
    			obj.layerName = nnn;
    		}

			var geometryCsg = new ThreeBSP(obj);
			var knotBBox = new THREE.Box3().setFromObject(obj);
			st.push(0);
			prevobjs.push(obj);
			prevobjsBBox.push(knotBBox);
			prevobjsBSP.push(geometryCsg);
		}
		else {
			for (var co = obj.children.length - 1; co > -1; co--) {
				collectObj(obj.children[co]);
			}
		}
	};

	var findIntersectsObj2 = function(co) {
    	clearTimeout(st[co]);
	    if (co > 0) {
            $('#popuup2_div').stop(true, true).css({left: canvasPosition.left + 30, top: canvasPosition.top + 80 + canvas.height}).show();
			lblInters.innerHTML = 'Проверено объектов ' + (objslength - co) + ' из ' + objslength;

			st[co - 1] = setTimeout(function run() {
  				findIntersectsObj2(co - 1);
				}, 5);
	    }
	    else {
        	//addObjects(viewportId, wireframesinter, 'wireframesinter');

    		$('#popuup2_div').stop(true, true).css({left: canvasPosition.left + 30, top: canvasPosition.top + 80 + canvas.height}).show();
            lblInters.innerHTML = 'Найдено пересечений, всего: ' + counts;
			
			//выводим данные для отчета
			var isTestOk = false;
			$(".testInfo").last().append("<span class='testInfo'>Найдено пересечений: " + counts + "</span><br/>");
			if(boltDiam < 13){
				if(counts == 0) isTestOk = true;
				}
			if(boltDiam > 13){
				if(counts == partsAmt.bolt.amt * 2) isTestOk = true;
				}
			

			if(isTestOk) $("#testResults").append("<span style='color: green;'>ОК</span><br/>");
			if(!isTestOk) {
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

			if(isBoxIntercection(knotBBox, knotBBox2)){
    			try {
					var res = prevobjsBSP[co].intersect(prevobjsBSP[i]);
					var mesh = res.toMesh();
					var bres = new THREE.Box3().setFromObject(mesh);
					if (!bres.isEmpty()) {
						showEdge(prevobjs[co]);
						showEdge(prevobjs[i]);
						counts++;
					}
				}
				catch (ex) {
					console.log('err\n');
					console.log(ex);
				}
			}
		}
	};


	//var intersectsMaterial2 = new THREE.MeshLambertMaterial({ color: 0xff0000 });
	var intersectsMaterial2 = new MeshLineMaterial({ color: new THREE.Color(0xff0000), lineWidth: 3, sizeAttenuation: 1 });

	var counts = 0;

    removeObjects(viewportId, 'wireframesinter');
	//wireframesinter.length = 0;
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

};

});

function addWareframe(obj, group) {
	if(obj.noWireFrames) return;
	
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
	var mat = params.materials.wireframe || new THREE.LineBasicMaterial( { color: materialColor, linewidth:materialLineWidth } );

	if (obj.geometry !== undefined && obj.geometry.type != "EdgesGeometry") {
	    var geo = new THREE.EdgesGeometry( obj.geometry ); // or WireframeGeometry
		var wireframe = new THREE.LineSegments( geo, mat );
		wireframe.rotation.x = obj.rotation.x;
	    wireframe.rotation.y = obj.rotation.y;
	    wireframe.rotation.z = obj.rotation.z;
	    wireframe.position.x = obj.position.x;
	    wireframe.position.y = obj.position.y;
	    wireframe.position.z = obj.position.z;
		var layerName = obj.layerName || group.layerName;

		if(layerName != undefined) {
			wireframe.layerName = layerName + "_wf";
		}
		else{
			wireframe.layerName = 'noname_wf';
		}
	    if (group !== undefined) group.add( wireframe ); else group.push( wireframe );
	}
	if (obj.children !== undefined) {
		for(var co = obj.children.length - 1; co > -1; co--) {
			addWareframe(obj.children[co], obj);
		}
	}
};
/** старая функция, возможно не используется
*/
function addWallWareframe(obj, group) {
	var mat = new THREE.LineBasicMaterial( { color: 0xeeeeee, linewidth: 3 } );
	if (obj.geometry !== undefined) {
	    var geo = new THREE.EdgesGeometry( obj.geometry ); // or WireframeGeometry
	    var wireframe = new THREE.LineSegments( geo, mat );
	    wireframe.rotation.x = obj.rotation.x;
	    wireframe.rotation.y = obj.rotation.y;
	    wireframe.rotation.z = obj.rotation.z;
	    wireframe.position.x = obj.position.x;
	    wireframe.position.y = obj.position.y;
	    wireframe.position.z = obj.position.z;

	    if (group !== undefined) group.add( wireframe ); else group.push( wireframe );
	}
	if (obj.children !== undefined) {
		for(var co = obj.children.length - 1; co > -1; co--) {
			addWareframe(obj.children[co], obj);
		}
	}
};

function saveCanvasImg(canvasId){

	var canvas = $("#WebGL-output").find("canvas").eq(canvasId)[0];

	var imageData = canvas.toDataURL();
	var image = new Image();
	image.src = imageData;
	
	var link = document.createElement("a");
	link.setAttribute("href", image.src);
	var imgName = params.orderName;
	if(imgName == "") imgName = "staircase"
	imgName += '.png'
	link.setAttribute("download", imgName);

	link.click();

}//end of saveCanvasImg

function cloneCanvas(){
	var canvas = $("#WebGL-output").find("canvas:first")[0];
	var imageData = canvas.toDataURL();
	var id = $("#images").children().length;
	var text = "<div class='cloned_canvas' data-id='"+ id +"'>" + 
		'<button class="btn btn-danger removeImg noPrint">' + 
					'<i class="glyphicon glyphicon-trash"></i>' + 
					'<span>Удалить</span>' + 
				'</button>' + 
			"<img class='img' src=" + imageData + ">" + 
	"</div>"
	var imgDiv = $("#images").append(text);
	imgDiv.find(".removeImg").click(function(){
		$(this).closest("div").fadeOut("100", function(){
			this.remove();
		});
	});

	return id;
}


var floor;

addTopFloor = function(viewportId, isVisible){
	$viewportsContainsTopFloor.push(viewportId);
	$sceneStruct[viewportId].topFloor = isVisible;
	$sceneStruct[viewportId].beamTop = isVisible;
	return drawTopFloor();
};

drawTopFloor = function() {
		//console.log(asdf)
	var floorThickness = $("#floorThickness").val() * 1;

	var obj;
	if($['vl_1']){
	while (obj = $['vl_1'].getObjectByLayerName('topFloor'))
		$['vl_1'].remove(obj);
	
	while (obj = $['vl_1'].getObjectByLayerName('beamTop'))
		$['vl_1'].remove(obj);			
	}
	var floorCoverThk = params.floorOffsetTop;
	//if(gui.__controllers[0].object.textures) floorCoverThk = 10;
	if(floorCoverThk == 0) floorCoverThk = 1;
	
	drawTopFloorPlane(floorThickness - floorCoverThk, 0xaaaaaa, floorCoverThk, true);
	if (floorCoverThk > 0) {
		drawTopFloorPlane(floorCoverThk, 0xcccccc, 0, false);
	}

	//балка
	if (params.calcType !== 'timber_stock' && !window.location.href.includes('/customers')) {
		var beamObj = new THREE.Object3D();
		var beamMaterial = new THREE.MeshLambertMaterial({color: 0xFF8000});
		var beamThk = 100;
		var beamLength = params.floorHoleWidth + 200;
		var geom = new THREE.BoxGeometry(100, params.beamWidth, beamLength);
		var beam = new THREE.Mesh(geom, beamMaterial);

		beam.position.x = beamThk / 2 + params.beamPosX + 0.01;
		beam.position.y = params.staircaseHeight - params.beamWidth / 2 - params.beamPosY;
		beam.position.z = params.floorHoleWidth/2 + params.beamPosZ
		if(params.turnSide == "левое") beam.position.z -= params.floorHoleWidth;
	
		beam.layerName = "beamTop";
		beamObj.add(beam)
		
		addObjects("vl_1", beamObj, 'beamTop');
	}
};

drawTopFloorPlane = function(thickness, color, offsetY, isCeil){

	var mat = params.materials.topFloor;
	if(isCeil) mat = params.materials.ceil;

	//сохраняем значение параметра видимости верхнего перекрытия для текущего видового экрана
	var isVisible = $sceneStruct['vl_1'].topFloor;
	if(isVisible == undefined) isVisible = true;
	
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

	if(floorHoleLedgeBaseEdges.length == 0){
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
		if(!isCeil) mesh.userData.isTopFloor = true
		else mesh.userData.isCeil = true;
		topFloor.add(mesh);
	}

	//проем с выступами			
	
	for(var i=0; i<floorHoleLedgeBaseEdges.length; i++){				
		
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
			if(floorHoleLedgePosition) hole.lineTo(-floorHoleLedgePosition, 0);
			if (floorHoleLedgeType == "выступ") {
				hole.lineTo(-floorHoleLedgePosition, -floorHoleLedgeWidth);
				hole.lineTo(-(floorHoleLedgePosition + floorHoleLedgeLength), -floorHoleLedgeWidth);
				hole.lineTo(-(floorHoleLedgePosition + floorHoleLedgeLength), 0);
			}
			else {
				hole.lineTo(-floorHoleLedgePosition, floorHoleLedgeWidth);
				hole.lineTo(-(floorHoleLedgePosition + floorHoleLedgeLength), floorHoleLedgeWidth);
				hole.lineTo(-(floorHoleLedgePosition + floorHoleLedgeLength), 0);
			}
		}
		hole.lineTo(-floorHoleLength, 0);
		//если выступ на грани №4
		if (floorHoleLedgeBaseEdge == "4") {
			if(floorHoleLedgePosition) hole.lineTo(-floorHoleLength, -floorHoleLedgePosition);
			if (floorHoleLedgeType == "выступ") {
				hole.lineTo(-(floorHoleLength - floorHoleLedgeWidth), -floorHoleLedgePosition);
				hole.lineTo(-(floorHoleLength - floorHoleLedgeWidth), -(floorHoleLedgePosition + floorHoleLedgeLength));
				hole.lineTo(-floorHoleLength, -(floorHoleLedgePosition + floorHoleLedgeLength));
			}
			else {
				hole.lineTo(-(floorHoleLength + floorHoleLedgeWidth), -floorHoleLedgePosition);
				hole.lineTo(-(floorHoleLength + floorHoleLedgeWidth), -(floorHoleLedgePosition + floorHoleLedgeLength));
				hole.lineTo(-floorHoleLength, -(floorHoleLedgePosition + floorHoleLedgeLength));
			}
		}
		hole.lineTo(-floorHoleLength, -floorHoleWidth);

		//если выступ на грани №2
		if (floorHoleLedgeBaseEdge == "2") {
			if(floorHoleLedgePosition) hole.lineTo(-floorHoleLength + floorHoleLedgePosition, -floorHoleWidth);
			if (floorHoleLedgeType == "выступ") {
				hole.lineTo(-floorHoleLength + floorHoleLedgePosition, -floorHoleWidth + floorHoleLedgeWidth);
				hole.lineTo(-floorHoleLength + floorHoleLedgePosition + floorHoleLedgeLength, -floorHoleWidth + floorHoleLedgeWidth);
				hole.lineTo(-floorHoleLength + floorHoleLedgePosition + floorHoleLedgeLength, -floorHoleWidth);
			}
			else {
				hole.lineTo(-floorHoleLength + floorHoleLedgePosition, -floorHoleWidth - floorHoleLedgeWidth);
				hole.lineTo(-floorHoleLength + floorHoleLedgePosition + floorHoleLedgeLength, -floorHoleWidth - floorHoleLedgeWidth);
				hole.lineTo(-floorHoleLength + floorHoleLedgePosition + floorHoleLedgeLength, -floorHoleWidth);
			}

		}
		hole.lineTo(0, -floorHoleWidth);
		//если выступ на грани №3
		if (floorHoleLedgeBaseEdge == "3") {
			if(floorHoleLedgePosition) hole.lineTo(0, -(floorHoleWidth - floorHoleLedgePosition));
			if (floorHoleLedgeType == "выступ") {
				hole.lineTo(-floorHoleLedgeWidth, -(floorHoleWidth - floorHoleLedgePosition));
				hole.lineTo(-floorHoleLedgeWidth, -(floorHoleWidth - floorHoleLedgePosition - floorHoleLedgeLength));
				hole.lineTo(0, -(floorHoleWidth - floorHoleLedgePosition - floorHoleLedgeLength));
			}
			else {
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
		if(!isCeil) floor.userData.isTopFloor = true
		else floor.userData.isCeil = true;
		topFloor.add(floor);
	}
	
	
	topFloor.layerName = "topFloor";
	
	topFloor.rotation.x = -0.5 * Math.PI;
	topFloor.position.x = 0;
	topFloor.position.y = params.staircaseHeight - floorThickness - offsetY;
	topFloor.position.z = 0//params.topThreadsPosition;
	if(params.turnSide == "левое") topFloor.position.z -= params.floorHoleWidth;
	
	
	
	
	
	addObjects('vl_1', topFloor, 'topFloor');
	
	$sceneStruct['vl_1'].topFloor = isVisible;
	$sceneStruct['vl_1'].beamTop = isVisible;

	if(gui.__controllers[0].object.textures) updateTextures();
};

	
	
//функция возвращает объекты, имеюдие свойство с заданным значением

function getObjectsByProp(propName, value){
	var objects = [];
	
	var findObj = function(arr, propName, value){
		if(arr.children == undefined) return;
		for (var i=0; i<arr.children.length; i++){
			if(arr.children[i][propName] == value) objects.push(arr.children[i]);
			if(arr.children[i].type == "Object3D") findObj(arr.children[i], propName, value);
			}
		}
	
	findObj($["vl_1"], propName, value)
	
	return objects;

}//end of getObjectsByProp

	
function updateTextures(){
	getAllInputsValues(params);

	textureManager.updateMaterials();

	$("span.property-name").each(function(){
		if($(this).text() == "Текстуры"){
			$(this).closest('div').find('input[type="checkbox"]').prop('checked', 'checked')
		}
	});
}

/** функция возвращает стандартный свет для сцены без текстур
*/

function createLigts(showTextures){
	var lights = [];

	if (window.location.href.includes('/geometry/')) {
		var ambientLight = new THREE.AmbientLight(0xffffff);
		lights.push(ambientLight);
	}
	if(!showTextures && !window.location.href.includes('/geometry/')){
		var spotLight = new THREE.SpotLight(0xffffff);
		spotLight.position.set( -5000, 20000, 10000);
		spotLight.penumbra = 0.05;
		spotLight.decay = 1.5;
		spotLight.distance = 300000;
		spotLight.shadow.mapSize.width = 800;
		spotLight.shadow.mapSize.height = 800;
		spotLight.shadow.camera.near = 0.1;
		spotLight.shadow.camera.far = 200000;

		lights.push(spotLight);

		var ambientLight = new THREE.AmbientLight(0x494949);
		lights.push(ambientLight);
	}
	if(showTextures && !window.location.href.includes('/geometry/')){
		var ambientLight = new THREE.AmbientLight( 0xfffbdf );
		lights.push( ambientLight );
		
		var sunLight = new THREE.SpotLight( 0xffffff, 0.4, 0, Math.PI / 2 );
		sunLight.position.set( 1000, params.staircaseHeight - params.floorThickness - 100, 3000 * turnFactor );
		sunLight.position.multiplyScalar(2);
		sunLight.castShadow = true;
		sunLight.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 70, 1, 1000, 200000 ) );
		sunLight.shadow.bias = 0.00085;
		/*
		var shadowCameraHelper = new THREE.CameraHelper( sunLight.shadow.camera );
		shadowCameraHelper.visible = true;
		lights.push( shadowCameraHelper );
		*/
		sunLight.shadow.mapSize.width = 4096;
		sunLight.shadow.mapSize.height = 4096;
		lights.push( sunLight );
		
		// 
		// var sphere = new THREE.SphereBufferGeometry( 100, 100, 100 );
		// var light1 = new THREE.PointLight( 0xff0040, 5, 500 );
		// light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
		// light1.position.x = -1000;
		// light1.position.y = 1500;
		// // light1.position.y = 300;
		// lights.push( light1 );
	}
	
	return lights;
};