var measure = [];
var hidenLayers = []; //список слоев, отключаемых для тестирования
var lastSelectedPoint = {x:0, y:0, z:0};
var lastSelectedPoint1 = {x:0, y:0, z:0};
var gui;
var $camera = [];

$(function(){
	
	//заменяем библиотеку триангуляции
	THREE.Triangulation.setLibrary('earcut');
	
	var stopTesting = false; //параметр для остановки тестирования
	
    var $renderer = [],
       // $camera = [],
        $orbitControls = [],
        $spotLight = [],
        $ambientLight = [],
        $controls = [],
		$viewportScene = [], //сцены видовых экранов
        clock;
    $sceneStruct = {};
   // $sceneBox = [];
    /***   СЦЕНА   ***/
    var imgWidth = 800;
    var imHeight = 600;
    var cameraType = "perspective";
    var wall1, wall2, wall3, wall4;

    clock = new THREE.Clock();
    var i=0;
    addViewport = function(outputDivId, viewportId, cameraType)
    {

        cameraType = cameraType || "perspective";
        //СЦЕНА
        $[viewportId] = new THREE.Scene();
//		$renderer[viewportId] = new THREE.WebGLRenderer();
		$renderer[viewportId] =  new THREE.WebGLRenderer({preserveDrawingBuffer: true,});
        $renderer[viewportId].setClearColor(new THREE.Color(0xEEEEEE));
        $renderer[viewportId].setSize(imgWidth, imHeight);
        $renderer[viewportId].shadowMap.enabled = true;
        $renderer[viewportId].shadowMap.type = 2;

        //КАМЕРА
        if (cameraType == "perspective") {

            $camera[viewportId] = new THREE.PerspectiveCamera(45, imgWidth / imHeight,  10, 100000);
            $camera[viewportId].position.set(-5000, 3000, 5000);
        }
        else {
            $camera[viewportId] = new THREE.OrthographicCamera(imgWidth / -16, imgWidth / 16, imHeight / 16, imHeight / -16, -20000, 50000);
            $camera[viewportId].position.set(-3000, 5000, 4000);
        }
        $camera[viewportId].lookAt($[viewportId].position);

        //СВЕТ
        $spotLight[viewportId] = new THREE.SpotLight(0xffffff);
        $spotLight[viewportId].position.set( -5000, 20000, 10000);
        $spotLight[viewportId].penumbra = 0.05;
        $spotLight[viewportId].decay = 1.5;
        $spotLight[viewportId].distance = 300000;
        $spotLight[viewportId].shadow.mapSize.width = 800;
        $spotLight[viewportId].shadow.mapSize.height = 800;
        $spotLight[viewportId].shadow.camera.near = 0.1;
        $spotLight[viewportId].shadow.camera.far = 200000;
        $[viewportId].add($spotLight[viewportId]);

        $ambientLight[viewportId] = new THREE.AmbientLight(0x494949);
        $[viewportId].add($ambientLight[viewportId]);

        /*управление камерой*/
        $orbitControls[viewportId] = new THREE.OrbitControls($camera[viewportId], $renderer[viewportId].domElement);
        $sceneStruct[viewportId] = [];
		
		//задаем начальные настройки
        $sceneStruct[viewportId]["shadows"] = false;
        $sceneStruct[viewportId]["perspective"] = true;
		
		//настройки для производственного модуля
		var url = document.location.href;
		if(url.indexOf("manufacturing") != -1 || url.indexOf("dev") != -1 || url.indexOf("demo") != -1 ){
			$sceneStruct[viewportId]["wireframes"] = true;			
			}
		
        change3dMenu($sceneStruct);
        var out = $('#'+outputDivId);

        //Удалим стартовое содержимое
        if(out.children().length == 1 &&  !out.children().attr('height') ){
            out.children().remove();
        }
	var canvas = $('<div class="canvas" height="100%"></div>');
        canvas.append($renderer[viewportId].domElement);
	out.append(canvas);
        //Перерисовка сцены
        renderScene = function (viewportId) {
            var delta = clock.getDelta();
            $orbitControls[viewportId].update(delta);
            $spotLight[viewportId].castShadow = $sceneStruct[viewportId]["shadows"];
            requestAnimationFrame(function(){
                return renderScene(viewportId);
            });
            $renderer[viewportId].render($[viewportId], $camera[viewportId]);
        };

        renderScene(viewportId);
        return $[viewportId];
    };
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

            self.floorTop = false;
            self.floorBottom = true;
			self.topFloor = true;
			self.beamTop = true;


            self.perspective = true;
			self.cameraPosId = '0';
            self.shadows = false;
			self.wireframes = false;
			self.realColors = false;
			
			var url = document.location.href;
			if(url.indexOf("manufacturing") != -1) self.wireframes = true;

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
				
				
	
				$camera[viewportId] = new THREE.PerspectiveCamera(45, imgWidth / imHeight,  100, 100000);

				if(!controls.perspective)
					$camera[viewportId] = new THREE.OrthographicCamera( imgWidth / - 0.25, imgWidth / 0.25, imHeight / 0.25, imHeight / - 0.25, -20000, 50000);

				$camera[viewportId].position.set(...pos);
                $camera[viewportId].lookAt($[viewportId].position);
			   
                $orbitControls[viewportId] = new THREE.OrbitControls($camera[viewportId], $renderer[viewportId].domElement);
                $orbitControls[viewportId].enableZoom = true;
            };

            self.add = function() {
				opa1($[viewportId]);
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
            if($[controls.selectvp].getObjectByName(this.property)){
                $[controls.selectvp].getObjectByName(this.property).visible = controls[this.property];
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

	var opa1 = function (obj) {
		if (obj.geometry !== undefined && obj.visible && obj.type !== 'LineSegments') {
			obj.material.transparent = true;
			obj.material.opacity = 0.3;
			obj.material.needsUpdate = true;
		}
		if (obj.children !== undefined) {
			for (var co = obj.children.length - 1; co > -1; co--) {
				opa1(obj.children[co]);
			}
		}
	};
		gui.add(controls, 'add').name('Прозрачно').onChange(function () { opa1($['vl_1']); });


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
		guiWall.add(controls, 'topFloor').name('Верхнее').onChange(hideShowObject);
		guiWall.add(controls, 'beamTop').name('Балки').onChange(hideShowObject);
        guiWall.open();


        var guiSettings = gui.addFolder("Настройки");
        //guiFloor.add(controls, 'floorTop').name('Верхнее').onChange(hideShowObject);

       // guiFloor.open();
	   
		//стандартные позиции камеры
		var cameras = ["справа", "слева", "спереди", "сзади", "сверху", "снизу", 'orto_0', 'orto_1', 'orto_3', 'orto_4']
		
		guiSettings.add(controls, 'cameraPosId', cameras).name('Вид').onChange(function(){
			/*
			$sceneStruct[controls.selectvp]["perspective"] = !$sceneStruct[controls.selectvp]["perspective"];
			controls.perspective = $sceneStruct[controls.selectvp]["perspective"];
			controls.switchCamera(controls.selectvp);
			*/
			console.log(controls.cameraPosId);
			controls.switchCamera(controls.selectvp, controls.cameraPosId);
		});
		
        guiSettings.add(controls, 'perspective').name('Перспектива').onChange(function(){
            $sceneStruct[controls.selectvp]["perspective"] = !$sceneStruct[controls.selectvp]["perspective"];
            controls.perspective = $sceneStruct[controls.selectvp]["perspective"];
            controls.switchCamera(controls.selectvp);
        });
        guiSettings.add(controls, 'shadows').name('Тени').onChange(function(){
            $sceneStruct[controls.selectvp]["shadows"] = !$sceneStruct[controls.selectvp]["shadows"];
            controls.shadows = $sceneStruct[controls.selectvp]["shadows"];
        });

		guiSettings.add(controls, 'wireframes').name('Ребра').onChange(function(){
            $sceneStruct[controls.selectvp]["wireframes"] = !$sceneStruct[controls.selectvp]["wireframes"];
            controls.wireframes = $sceneStruct[controls.selectvp]["wireframes"];
			redrawWalls();
        });
		guiSettings.add(controls, 'realColors').name('Цвета').onChange(function(){
            $sceneStruct[controls.selectvp]["realColors"] = !$sceneStruct[controls.selectvp]["realColors"];
            controls.realColors = $sceneStruct[controls.selectvp]["realColors"];
        });
		
		
		guiSettings.open();

       /* var guiStair = gui.addFolder("Лестница");
        guiStair.add(controls, 'stairs').name("Отображать");
        guiStair.add(controls, 'frame').name("Каркас");
        guiStair.add(controls, 'steps').name("Ступени");
        guiStair.add(controls, 'fences').name("Ограждения");*/


	    gui.close();
    };

    addFloorPlane = function(viewportId, isVisible) {
        isVisible = isVisible || false;

        var planeGeometry = new THREE.CubeGeometry(20000, params.floorThickness, 20000);
        var floorMaterial = new THREE.MeshLambertMaterial({color: 0xcccccc});

        var plane = new THREE.Mesh(planeGeometry, floorMaterial);
        plane.receiveShadow = true;
        plane.position.set(0, -params.floorThickness / 2, 0);
        plane.visible = isVisible;
        plane.name = "floorBottom";
		var floorBSP = new ThreeBSP(plane);
		
        $sceneStruct[viewportId]["floorBottom"] = isVisible;

		$(".ledgeParRow").each(function(){
			
			if($(this).find(".wallLedgeBaseWall").val() == "нижнее"){
				var wallLedgeWidth = $(this).find(".wallLedgeWidth").val()
				var wallLedgeHeight = $(this).find(".wallLedgeHeight").val()
				var wallLedgeDepth = $(this).find(".wallLedgeDepth").val()
				var wallLedgeType = $(this).find(".wallLedgeType").val()
				var wallLedgePosX = $(this).find(".wallLedgePosX").val()
                var wallLedgePosY = $(this).find(".wallLedgePosY").val()
                var wallLedgePosZ = $(this).find(".wallLedgePosZ").val()
				
				geometry = new THREE.CubeGeometry(wallLedgeWidth, wallLedgeHeight, wallLedgeDepth),
				ledge = new THREE.Mesh(geometry, floorMaterial);

                ledge.position.x = wallLedgeWidth / 2 + wallLedgePosX * 1.0;
                ledge.position.y = wallLedgeHeight / 2 + wallLedgePosY * 1.0;
				ledge.position.z = wallLedgeDepth / 2 + wallLedgePosZ * 1.0;
				ledge.name = "floorBottom";
				//addObjects(viewportId, ledge, 'floorBottom');
				console.log(ledge)
			
				if (wallLedgeWidth > 0 && wallLedgeHeight > 0 && wallLedgeDepth > 0) {
					if (wallLedgeType == "выступ") {
						ledge.position.y = wallLedgeHeight / 2;
						var ledgeBSP = new ThreeBSP(ledge);
						floorBSP = floorBSP.union(ledgeBSP);
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
		floor.material = floorMaterial;
		floor.geometry.computeVertexNormals();

		var floorObj = new THREE.Object3D();
		floorObj.add(floor)
		addObjects(viewportId, floorObj, 'floorBottom');
		
		//добавляем белые ребра
		
		if(gui.__controllers[0].object.wireframes) addWareframe(floorObj, floorObj);
		
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
				var positionX = $('#wallPositionX_' + i).val()*1 + (i>2?1:length/2) + (i==4?-thickness/2:i==3?thickness/2:0);
				var positionZ = $('#wallPositionZ_' + i).val()*1 + (i>2?length/2:thickness/2*(i==1?-1:1));
				var wallGeometry = new THREE.CubeGeometry(length,height,thickness);
				var wallMaterial = new THREE.MeshLambertMaterial({color: 0xE0E0E0, wireframe: false});//
				var wall = new THREE.Mesh(wallGeometry, wallMaterial);
				wall.position.set(positionX, height / 2, positionZ * turnFactor);
				addLedges(viewportId, wall, i);
			}
           // wall.visible = visible;
        }
    }
    addWalls = function(viewportId, isVisible)
    {
        /*вспомогательные оси*
        var axes = new THREE.AxisHelper( 2000 );
        $[viewportId].add(axes);
		*/

        isVisible = isVisible || false;
        var wall, length, height, positionX, positionY, positionZ, thickness, turnSide, turnFactor;
        var wallGeometry, wallMaterial;
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
                obj = $[k].getObjectByName('wall'+i);
                if(obj) {
                    find = true;
                    $[k].remove(obj);
					obj = null;
                }
				//белые ребра
				objWf = $[k].getObjectByName('wall'+i + '_wf'); //ребра
                if(objWf) {
					$[k].remove(objWf);
					objWf = null;
					}
            }
		
		_addWalls(k, turnFactor);
		
		//перерисовываем нижнее перекрытие
		/*
		obj = $[k].getObjectByName("floorBottom");
		if(obj) $[k].remove(obj);
		*/
		removeObjects(k, 'floorBottom');
		
		addFloorPlane(k, true);
		
		//перерисовываем верхнее перекрытие
		removeObjects(k, "beamTop");
		removeObjects(k, "topFloor");		
        });
		
		drawTopFloor();
		
    };
	
	hideWalls = function(){
	
		//перебираем выдовые экраны
        $.each($sceneStruct, function(k,v){
            var obj, objWf;
            //скрываем стены
            for(var i = 1; i < 5; i++){
				//сами стены
				obj = $[k].getObjectByName('wall'+i);
				if(obj) obj.visible = false;

				//белые ребра
				objWf = $[k].getObjectByName('wall'+i + '_wf'); //ребра
				if(obj) obj.visible = false;
            }
			//нижнее перекрытие
			obj = $[k].getObjectByName("floorBottom");
			if(obj) obj.visible = false;
			
			//верхнее перекрытие
			obj = $[k].getObjectByName("topFloor");
			if(obj) obj.visible = false;
		});
	}
	
    addLedges = function(viewportId, wall, n){
	
        //найдем выступы, для этой стены
        var wallLedgeWidths = $('#ledgeForm [id^=wallLedgeBaseWall]').filter(function(){
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
                wallMaterial,
                w = wall.geometry.parameters.width,
                h = wall.geometry.parameters.height,
                d = wall.geometry.parameters.depth;
            var wallBSP = new ThreeBSP(wall);
            wallLedgeWidths.each(function (_i, val) {
                //узнаем Id текущих элементов
                var i = val.id.match(/^.*(\d+)$/)[1];
                //console.log(n+' > '+i);
                wallMaterial = new THREE.MeshLambertMaterial({color: 0xBFBFBF, wireframe: false});
                var wallLedgeWidth = $('#wallLedgeWidth' + i).val(),
                    wallLedgeType = $('#wallLedgeType' + i).val(),
                    wallLedgeBaseWall = $('#wallLedgeBaseWall' + i).val(),
                    wallLedgeHeight = $('#wallLedgeHeight' + i).val(),
                    wallLedgeDepth = $('#wallLedgeDepth' + i).val(),
                    wallLedgePosX = $('#wallLedgePosX' + i).val(),
                    wallLedgePosY = $('#wallLedgePosY' + i).val(),
                    wallLedgePosZ = $('#wallLedgePosZ' + i).val(),
                    geometry = new THREE.CubeGeometry(wallLedgeWidth, wallLedgeHeight, wallLedgeDepth),
                    ledge = new THREE.Mesh(geometry, wallMaterial);

                ledge.position.x = x - w / 2 + wallLedgeWidth / 2 + wallLedgePosX * 1;
                ledge.position.y = y - h / 2 + wallLedgeHeight / 2 + wallLedgePosY * 1;
                if (wallLedgeWidth > 0 && wallLedgeHeight > 0 && wallLedgeDepth > 0) {
                    if (wallLedgeType == "выступ") {
                        ledge.position.z = z + d / 2 + wallLedgeDepth / 2;
                        if($("#turnSide").val() == "левое"){
							ledge.position.z = z - d / 2 - wallLedgeDepth / 2;
							}
						var ledgeBSP = new ThreeBSP(ledge);
                        wallBSP = wallBSP.union(ledgeBSP);
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
						var box = new THREE.Mesh(geometry, wallMaterial);
						box.position.x = wallLedgePosX*1.0 + wallLedgeWidth/2;
						box.position.y = wallLedgePosY*1.0 + wallLedgeHeight/2;
						box.position.z = wallLedgePosZ*1.0 + wallLedgeDepth/2;
						complexWall.add(box);
                    }
                }
            });

            wall = wallBSP.toMesh();
            wall.material = wallMaterial;
            wall.geometry.computeVertexNormals();
        }
        wall.name = 'wall' + n;
        wall.rotation.y = n == 3 ? 1.5 * Math.PI : n == 4 ? 0.5 * Math.PI : n == 2 ? Math.PI : 0;

		
		complexWall.add(wall);
		//добавляем белые ребра
		if(gui.__controllers[0].object.wireframes) addWareframe(complexWall, complexWall);

		addObjects(viewportId, complexWall, wall.name);
    };

    var guiLayers;
    updateLaersControls = function(){
        //console.log(guiLayers);
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
            if($objectAdd[gui.__controllers[0].object['selectvp']]){
                if($objectAdd[gui.__controllers[0].object['selectvp']][layerName]) {
					/*
                    $.each($objectAdd[gui.__controllers[0].object['selectvp']][layerName], function (key, val) {
                        $[gui.__controllers[0].object['selectvp']].getObjectById(val).visible = controls[layerName];
                    });
					*/
				var vpObjects = $[gui.__controllers[0].object['selectvp']].children;
				for(var i=0; i<vpObjects.length; i++){
					if(vpObjects[i].name == layerName) vpObjects[i].visible = controls[layerName];
					}
                }
            }
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
        for (i = 0; i < objectsArr.length; i++) {
            objectsArr[i].visible = $sceneStruct[gui.__controllers[0].object['selectvp']][layerName];
            objectsArr[i].name = layerName;
			
			$[viewportId].add(objectsArr[i]);
            
            //формируем массив ID-шников объектов, по имени
            $obj[layerName] = $.merge(($obj[objectsArr[i].name]?$obj[layerName]:[]), [objectsArr[i].id]);
            //$sceneStruct[viewportId][layerName] = true;
			//objectsArr[i] = null;
        }
        $objectAdd[viewportId] = $.extend({}, $objectAdd[viewportId], $obj);
        updateGUI();

    };
    removeObjects = function(viewportId, layerName){
        //удаляем объекты из сцены
       if($objectAdd[viewportId]) {
			while(obj = $[viewportId].getObjectByName(layerName)){
				$[viewportId].remove(obj);
				disposeObjects(obj);
				delete obj;
                }
			
        }
    };

    addObject = function(viewportId, object){
        if(object.name)
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
                    obj.material.map.dispose();
                    obj.material.map = undefined;
                }
                obj.material.dispose();
                obj.material = undefined;
            }
        }
        obj = undefined;
    };



    addMeasurement = function(viewportId) {
		if (measure) removeObjects(viewportId, 'measure');
		
		measure = [];
		// measurement
		var threshold = 10;
		var fmin = false;
		var point_snap;

		var spStart, spEnd, sConnection;

    	var sphereGeometry = new THREE.SphereGeometry(0.75, 32, 32);
    	var sphereMaterial = new THREE.MeshBasicMaterial({color: 0xbb0000, shading: THREE.FlatShading});
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
    	var newdiv1 = $("<div id='popuup_div' align='left' style='position:absolute;z-index:10;width:130px;height:88px;background-color:white;text-align:left;padding-left:9px;color:#000000;font: 16px Verdana, Arial, Helvetica, sans-serif;display:none;'></div>");
    	$("body").append(newdiv1);
    	var newdiv2 = $("<div id='popuup2_div' align='left' style='position:absolute;z-index:10;width:330px;height:28px;background-color:white;text-align:left;padding-left:9px;color:#000000;font: 18px Verdana, Arial, Helvetica, sans-serif;display:none;'></div>");
    	$("body").append(newdiv2);

      	var canvas = $renderer[viewportId].domElement;
      	//var canvas = $renderer[viewportId].domElement;

        function onDocumentMouseDown( evt ) {
    	  	spStart.visible = false;
    	  	spEnd.visible = false;
    	  	sConnection.visible = false;
    	  	sphereHelper.visible = false;

    	  	$('#popuup_div').stop(true, true).hide();
    	  	$('#popuup2_div').stop(true, true).hide();

     	  	if (!evt.ctrlKey || evt.which !== 1) return;

      		sphereHelper.visible = false;
    	  	spStart.visible = true;
    	  	spEnd.visible = true;
    	  	sConnection.visible = true;

          	var raycaster = new THREE.Raycaster();

          	var mouse = new THREE.Vector2();
          	var canvasPosition = $(canvas).position();
    	  	var BB = canvas.getBoundingClientRect();
          	mouse.x = ((evt.clientX - BB.left) / canvas.width) * 2 - 1;
          	mouse.y = -((evt.clientY - BB.top) / canvas.height) * 2 + 1;

          	// update the picking ray with the camera and mouse position
          	raycaster.setFromCamera( mouse, $camera[viewportId] );
          	// calculate objects intersecting the picking ray var intersects =
    	  	var intersects = raycaster.intersectObjects( $[viewportId].children, true );

			//выделение объекта
			var selectedObj = intersects[0].object;
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

        function onDocumentMouseMove( evt ) {
            try {
            	canvas.style.cursor = 'auto';
         	  	if (!evt.ctrlKey) return;

              	var raycaster = new THREE.Raycaster();

              	var mouse = new THREE.Vector2();
              	var canvasPosition = $(canvas).position();
        	  	var BB = canvas.getBoundingClientRect();
              	mouse.x = ((evt.clientX - BB.left) / canvas.width) * 2 - 1;
              	mouse.y = -((evt.clientY - BB.top) / canvas.height) * 2 + 1;

              	// update the picking ray with the camera and mouse position
              	raycaster.setFromCamera( mouse, $camera[viewportId] );
              	// calculate objects intersecting the picking ray var intersects =
        	  	var intersects = raycaster.intersectObjects( $[viewportId].children, true );

        		if (intersects.length > 0) {
        		    var intersect = intersects[0];
            		//var face = intersect.face;
            		var point = intersect.point;
            		var object = intersect.object;
        		    var distance;

        			if (object.name == "measure") return;
        			// to skip
        			for (var i = 0, il = intersects.length; i < il; i++) {
        		    	intersect = intersects[i];
            			object = intersect.object;
        				if (object.name !== "wireframes") break;
        			}
        			if (object.name === "wireframes") return;

            		object.updateMatrixWorld();
           			point = intersect.point;
            		var points = object.geometry.vertices;
            		if (points === undefined) return;
//console.log(object);
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
        				var dia = $camera[viewportId].position.distanceTo(point_snap) / 300;
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
		var name = obj.name;		
		if (obj.name === '' && !!obj.parent) name = nname(obj.parent);
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
		if (!!obj.geometry && isVisible(obj) && obj.type !== 'LineSegments') {
			if (!!obj.parent) {
				var nnn = nname(obj);
				obj.updateMatrixWorld();
    			THREE.SceneUtils.detach( obj, obj.parent, scene );
    			obj.name = nnn;
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
        	//console.log('co: ' + co);
            $('#popuup2_div').stop(true, true).css({left: canvasPosition.left + 30, top: canvasPosition.top + 80 + canvas.height}).show();
			lblInters.innerHTML = 'Проверено объектов ' + (objslength - co) + ' из ' + objslength;

			st[co - 1] = setTimeout(function run() {
  				findIntersectsObj2(co - 1);
				}, 5);
	    }
	    else {
        	//addObjects(viewportId, wireframesinter, 'wireframesinter');

    		$('#popuup2_div').stop(true, true).css({left: canvasPosition.left + 30, top: canvasPosition.top + 80 + canvas.height}).show();
        	//console.log('Найдено пересечений, всего: ' + counts);
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
    var canvas = $renderer[viewportId].domElement;
    var canvasPosition = $(canvas).position();

	collectObj(scene);
	var objslength = prevobjs.length;
	findIntersectsObj2(prevobjs.length - 1);

};



});

function addWareframe(obj, group) {
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
		if(obj.name != undefined) wireframe.name = obj.name + "_wf";
	    if (group !== undefined) group.add( wireframe ); else group.push( wireframe );
	}
	if (obj.children !== undefined) {
		for(var co = obj.children.length - 1; co > -1; co--) {
			addWareframe(obj.children[co], obj);
		}
	}
};

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

function submitTesting(isTestOk){
	
	orderName = $('#orderName').val();
	if(!orderName) return;
	
	//не добавляем ошибки из папки разработчиков
	var url = document.location.href;
	if(url.indexOf("dev") != -1) return;
	
	//добавление информации к расчету КП
	var result = "ok";
	if(!isTestOk) result = "ошибка";

    $.ajax({
        url: '/calculator/offers/db/actions.php',
        type: "GET",
        dataType: 'json',
        data: {
            queryType: 'submitTesting',
			params: {
				itemName: orderName,
				result: result,
				},
            user:$("#userName").text()
        },
        success: function (data) {
			console.log("Отчет о тестировании получен")
        },
        error: function (jqXhr, textStatus, errorThrown) {


            alert('Ошибка на сервере ' + errorThrown);
        }

    });
	
	if(!isTestOk){
		// отправка сообщения об ошибке в багтрекер
		
		//выделяем адрес без параметров
		var url_array = url.split("?");
		url = url_array[0];
		var link = url + "?orderName=" + orderName;
			
		var reportPar = {
			description: "Не пройден тест",
			screenshoot: "-",
			link: link,
			//user: "system",
			noAlerts: true,
			}
			
		sendBugReport(reportPar); //функция в файле sendReport.js
		}
					


}

	var floor;

	addTopFloor = function(viewportId, isVisible){
		$viewportsContainsTopFloor.push(viewportId);
		$sceneStruct[viewportId].topFloor = isVisible;
		$sceneStruct[viewportId].beamTop = isVisible;
		return drawTopFloor();
		};

	drawTopFloor = function() {
		$.each($viewportsContainsTopFloor, function(i, viewportId) {
			//сохраняем значение параметра видимости верхнего перекрытия для текущего видового экрана
			var isVisible = $sceneStruct[viewportId].topFloor;
			if(isVisible == undefined) isVisible = true;
			
			/*удаляем перекрытие из сцены*/
			var obj;
			while (obj = $[viewportId].getObjectByName('topFloor'))
				$[viewportId].remove(obj);
			
			while (obj = $[viewportId].getObjectByName('beamTop'))
				$[viewportId].remove(obj);			
				

			var floorHoleLength = $("#floorHoleLength").val() * 1;
			var floorHoleWidth = $("#floorHoleWidth").val() * 1;
			var floorThickness = $("#floorThickness").val() * 1;

			var floorWidth = 10000;
			var floorLength = 10000;
			var p0_X = -0.5 * (floorWidth + floorHoleLength);
			var p0_Y = -0.5 * (floorLength + floorHoleWidth);
			/*внешний контур*/
			var floorShape;
			var floorHoleLedgeBaseEdges = $('#topFloorForm [id^=floorHoleLedgeBaseEdge]');
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

				var floorMaterial = new THREE.MeshLambertMaterial({color: 0xBFBFBF});
				var floorExtrudeOptions = {
					amount: floorThickness,
					bevelEnabled: false,
					curveSegments: 12,
					steps: 1
				};

				var geom = new THREE.ExtrudeGeometry(floorShape, floorExtrudeOptions);
				geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
				topFloor.add(new THREE.Mesh(geom, floorMaterial));
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

				var floorMaterial = new THREE.MeshLambertMaterial({color: 0xBFBFBF});
				var floorExtrudeOptions = {
					amount: floorThickness,
					bevelEnabled: false,
					curveSegments: 12,
					steps: 1
				};

				var geom = new THREE.ExtrudeGeometry(floorShape, floorExtrudeOptions);
				geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
				floor = new THREE.Mesh(geom, floorMaterial);
				topFloor.add(floor);
			}
			
			
			//проем 
			//добавляем белые ребра
			if(gui.__controllers[0].object.wireframes) addWareframe(topFloor, topFloor);
			
			topFloor.rotation.x = -0.5 * Math.PI;
			topFloor.position.x = 0;
			topFloor.position.y = params.staircaseHeight - floorThickness;
			topFloor.position.z = 0//params.topThreadsPosition;
			if(params.turnSide == "левое") topFloor.position.z -= params.floorHoleWidth;			
			topFloor.castShadow = true;
			topFloor.name = "topFloor";
			
			
			addObjects(viewportId, topFloor, 'topFloor');
			
			
			//балка
			var beamMaterial = new THREE.MeshLambertMaterial({color: 0xFF8000});
			var beamThk = 100;
			var beamLength = params.floorHoleWidth + 200;
			var geom = new THREE.BoxGeometry(100, params.beamWidth, beamLength);
			var beam = new THREE.Mesh(geom, beamMaterial);

			beam.position.x = beamThk / 2 + params.beamPosX + 0.01;
			beam.position.y = params.staircaseHeight - params.beamWidth / 2 - params.beamPosY;
			beam.position.z = params.floorHoleWidth/2 + params.beamPosZ
			if(params.turnSide == "левое") beam.position.z -= params.floorHoleWidth;
		
			beam.name = "beamTop";
			addObjects(viewportId, beam, 'beamTop');
			
			$sceneStruct[viewportId].topFloor = isVisible;
			$sceneStruct[viewportId].beamTop = isVisible;
		});
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


function setMaterials(){
	var materials = [];
	
		if(typeof $sceneStruct != 'undefined' && $sceneStruct.vl_1){
		var metalColor = 0x767676;
		var metalColor1 = 0xA3A3A3;
		var timberColor = 0x804000;
		var timberColor1 = 0xA36323;
		var riserColor = timberColor;
		var treadColor = timberColor;
		var newellColor = timberColor;
		var balColor = timberColor;
		var handrailColor = timberColor;
		
		//цвета из параметров
		if(!$sceneStruct.vl_1.realColors && params.calcType != "geometry"){
			metalColor = metalColor1 = getMetalColorId(params.metalColorNumber);
			timberColor = timberColor1 = getTimberColorId(params.timberColorNumber)
			if(params.calcType == "timber") timberColor = timberColor1 = getTimberColorId(params.stringersColor)
			riserColor = getTimberColorId(params.risersColor)
			treadColor = getTimberColorId(params.treadsColor)
			newellColor = getTimberColorId(params.newellsColor)
			balColor = getTimberColorId(params.timberBalColor)
			handrailColor = getTimberColorId(params.handrailsColor)
			}

		var timberMaterial = new THREE.MeshLambertMaterial({name:'timber', color: timberColor,});
		var timberMaterial2 = new THREE.MeshLambertMaterial({name:'timber2', color: timberColor1,});
		var metalMaterial = new THREE.MeshLambertMaterial({name:'metal', color: metalColor, wireframe: false });
		var metalMaterial2 = new THREE.MeshLambertMaterial({name:'metal2', color: metalColor1, wireframe: false });
		var inoxMaterial = new THREE.MeshLambertMaterial({name:'inox', color: 0xEEEEEE, wireframe: false });
		var glassMaterial = new THREE.MeshLambertMaterial({name:'glass', opacity: 0.6, color: 0x3AE2CE, transparent: true });
		var concreteMaterial = new THREE.MeshLambertMaterial({name:'concrete', color: 0xBFBFBF });
		var dpcMaterial = new THREE.MeshLambertMaterial({name:'dpc', color: 0x634D39,});
		
		var riserMaterial = new THREE.MeshLambertMaterial({name:'riser', color: riserColor,});
		var treadMaterial = new THREE.MeshLambertMaterial({name:'tread', color: treadColor,});
		var newellMaterial = new THREE.MeshLambertMaterial({name:'newell', color: newellColor,});
		var balMaterial = new THREE.MeshLambertMaterial({name:'bal', color: balColor,});
		var handrailMaterial = new THREE.MeshLambertMaterial({name:'handrail', color: handrailColor,});
		

		//материал ступеней не из дерева

		if (params.stairType == "рифленая сталь" || params.stairType == "лотки") treadMaterial = metalMaterial;
			
		if (params.stairType == "пресснастил") treadMaterial = inoxMaterial;
		if (params.stairType == "стекло") treadMaterial = glassMaterial;
		if (params.stairType == "дпк") treadMaterial = dpcMaterial;

		//сохраняем материалы в глобальный массив
		materials = {
			timber: timberMaterial,
			timber2: timberMaterial2,
			metal: metalMaterial,
			metal2: metalMaterial2,
			inox: inoxMaterial,
			glass: glassMaterial,
			concrete: concreteMaterial,			
			dpc: dpcMaterial,
			tread: treadMaterial,
			riser: riserMaterial,
			newell: newellMaterial,
			banister: balMaterial,
			handrail: handrailMaterial,	
		};
	}
	
	return materials;

}

function getMetalColorId(colorName){
	var colorId = 0x363636;

	if(colorName == "светло-серый") colorId = 0xD4D4D4
	if(colorName == "темно-серый") colorId = 0x7C7C7C
	if(colorName == "коричневый") colorId = 0x692902
	if(colorName == "черный") colorId = 0x111111
	if(colorName == "белый") colorId = 0xFFFFFF
	if(colorName == "бежевый") colorId = 0xECD1C6
	if(colorName == "медный антик") colorId = 0x762D15
	if(colorName == "белое серебро") colorId = 0xDBDBDB
	if(colorName == "черное серебро") colorId = 0x6F6F6F
	if(colorName == "черная ящерица") colorId = 0x111111
	if(colorName == "бежевая ящерица") colorId = 0xECD1C6
	if(colorName == "коричневая ящерица") colorId = 0x762D15
	
	return colorId;
}

function getTimberColorId(colorName){
	var colorId = 0xE2BD73;

	if(colorName == "13-1") colorId = 0xDCD0D0
	if(colorName == "13-2") colorId = 0xF6EAEA
	if(colorName == "72-1") colorId = 0x38352F
	if(colorName == "72-2") colorId = 0x28251F
	if(colorName == "76-1") colorId = 0x3A3130
	if(colorName == "76-2") colorId = 0x2B2221
	if(colorName == "84-1") colorId = 0x634D39
	if(colorName == "84-2") colorId = 0x4E3824
	if(colorName == "87-1") colorId = 0x67493E
	if(colorName == "87-2") colorId = 0x4E3025
	if(colorName == "88-1") colorId = 0x6F5240
	if(colorName == "88-2") colorId = 0x5A3D2B
	if(colorName == "90-1") colorId = 0x6C4C3F
	if(colorName == "90-2") colorId = 0x563629
	if(colorName == "92-1") colorId = 0x6F4E3F
	if(colorName == "92-2") colorId = 0x5B3A2B
	if(colorName == "93-1") colorId = 0xAD734D
	if(colorName == "93-2") colorId = 0x975D37
	if(colorName == "96-1") colorId = 0x534039
	if(colorName == "96-2") colorId = 0x45322B

	
	return colorId;
}