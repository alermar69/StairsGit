//глобальные переменные для тестирования
var testingMode = false;
var boltDiam = 10;
var boltBulge = 8;
var boltLen = 30;
var turnFactor = 1;
var fontGlob;
var treadsObj;

drawStaircase = function (viewportId, isVisible) {

	params.botFloorType = "чистовой";
	params.botFloorsDist = 0;
	params.metalPaint = "нет"
	params.timberPaint = "нет"
	params.startTreadAmt = 0
	params.treadThickness = 40;
	if(params.stairType == "дпк" || params.stairType == "лиственница тер.") params.treadThickness = 20;

	if (params.staircaseType == 'metal') {
		params.stringerThickness = 8;
		params.sideOverHang = 75;
	}

	if (params.staircaseType == 'mono') {
		params.stringerThickness = 150;
	}

	if (params.staircaseType == 'timber' || params.staircaseType == 'timber_stock') {
		params.calcType = params.staircaseType;
		params.rackSize = 95;
		params.topAnglePosition = "";
		params.stringerThickness = 40;
		params.stringerSlotsDepth = 15;
	}

	//удаляем старую лестницу

	for(var layer in layers){
		removeObjects(viewportId, layer);
	}

	//очищаем глобальный массив параметров для спецификации
	staircasePartsParams = {};

	var model = {
		objects: [],
		add: function(obj, layer){
			var objInfo = {
				obj: obj,
				layer: layer,
				}
			this.objects.push(objInfo);
			},
		};

	// if (params.model == 'лт' || params.model == 'тетивы' || params.model == 'тетива+косоур') {
	// 	switch($('#staircaseType').val()){
	// 		case 'metal':
	//
	// 		break;
	// 		case 'metal':
	// 		$.when(
	// 			$.getScript( "/manufacturing/metal/drawCarcas.js" ),
	// 			$.getScript( "/manufacturing/metal/drawCarcasParts.js" ),
	// 			$.getScript( "/manufacturing/metal/drawStringerPartsKo.js" ),
	// 			$.getScript( "/manufacturing/metal/drawStringerPartsLt.js" ),
	// 			$.getScript( "/manufacturing/metal/drawStringers.js" ),
	// 			$.getScript( "/manufacturing/metal/drawFrames.js" ),
	// 			$.getScript( "/manufacturing/metal/drawCarcasPartsLib_2.0.js" ),
	// 		).done(function(){
	// 			drawLongBolts = false;
	// 			carcasScriptLoaded()
	// 		});
	// 		break;
	// 		case 'timber':
	// 		$.when(
	// 			$.getScript( "/manufacturing/timber/drawCarcas.js" ),
	// 			$.getScript( "/manufacturing/timber/drawCarcasParts.js" ),
	// 			$.getScript( "/manufacturing/timber/drawStringerParts.js" ),
	// 			$.getScript( "/manufacturing/timber/drawRailing.js" ),
	// 		).done(function(){
	// 			frontEdgeRad = 6;
	// 			console.log(`Timber carcas scripts loaded`);
	// 			carcasScriptLoaded()
	// 		});
	// 		break;
	// 		default:
	// 		break;
	// 	}
	// }else{
	// 	carcasScriptLoaded();
	// }

	/*удаляем контуры*/
	dxfPrimitivesArr = [];
	var dxfBasePointStep = 200.0;

	/*направление поворота (глобальные переменные)*/

	if (params.turnSide == "правое") turnFactor = 1;
	if (params.turnSide == "левое") turnFactor = -1;

	/*** СТУПЕНИ НА ВСЕ ЛЕСТНИЦЫ ***/
	if (params.stairType == "лотки") params.treadThickness = 4;

	treadsObj = drawTreads()
	model.add(treadsObj.treads, "treads");
	model.add(treadsObj.risers, "risers");

	//верхний узел
	if (params.staircaseType == 'timber' || params.staircaseType == 'timber_stock') {
		var stringerHeight = 250;
		
		var unitPar = {
			stringerHeight: stringerHeight,
			dxfBasePoint: {x:0,y:0}
		}

		var topUnit = drawTimberStockTopUnit(unitPar).mesh;
		topUnit.position.x = treadsObj.lastMarshEnd.x;
		topUnit.position.y = treadsObj.lastMarshEnd.y;
		topUnit.position.z = treadsObj.lastMarshEnd.z;
		topUnit.rotation.y = treadsObj.lastMarshEnd.rot;
		//добавляем в соответствующий марш
		topUnit.marshId = 3;
		if(params.stairModel == "Прямая") topUnit.marshId = 1;
		treadsObj.treads.add(topUnit)
	}

	//сдвигаем и поворачиваем лестницу чтобы верхний марш был вдоль оси Х
	var moove = calcStaircaseMoove(treadsObj.lastMarshEnd);

	//сохраняем позицию лестницы для позиционирования шкафа
	params.starcasePos = moove;
	params.starcasePos.rot = moove.rot;

	//Рисуем пол
	{
		removeObjects('vl_1', 'floor');
		
		var material = new THREE.MeshLambertMaterial({color: 0xAAAAAA});//, transparent:true, opacity: 0.3});

		//Пол
		var geometry = new THREE.BoxGeometry( 10000, 300, 10000 );
		var cube = new THREE.Mesh( geometry, material );
		cube.position.x = 0;
		cube.position.z = 0;
		cube.position.y = -150 - 5;
		addObjects('vl_1', cube, 'floor');
	}


	// carcasScriptLoaded = function() {
		// if (params.model == 'лт' || params.model == 'тетивы' || params.model == 'тетива+косоур') {
		// 	var carcasPar = {
		// 		dxfBasePoint: {x: 0, y: 2000},
		// 		treadsObj: treadsObj,
		// 	}
		//
		// 	var carcasObj = drawCarcas(carcasPar);
		// 	model.add(carcasObj.mesh, 'carcas');
		// }
		// var dimensionsPar = {
		// 	treadsObj: treadsObj,
		// 	moove: moove,
		// 	view: '3d',
		// };
		// // if (params.model == 'лт' || params.model == 'тетивы' || params.model == 'тетива+косоур') dimensionsPar.carcasObj = carcasObj;
		drawSceneDimensions();
		// dimMesh.position.x += moove.x + params.staircasePosX;
		// dimMesh.position.y += params.staircasePosY;
		// dimMesh.position.z += moove.z + params.staircasePosZ + params.M / 2 * turnFactor;
		// dimMesh.rotation.y = moove.rot;
		// addObjects(viewportId, dimMesh, 'dimensions');
		
		for(var i=0; i<model.objects.length; i++){
			var obj = model.objects[i].obj;
			//позиционируем
			obj.position.x += moove.x;
			obj.position.y += moove.y;
			obj.position.z += moove.z;
			obj.rotation.y = moove.rot;
			//смещаем все ступени для лотков
			if(params.stairType == "лотки" && model.objects[i].layer == "treads") {
				obj.position.y += 4;
				//obj.position.y -= calcTreadFixHeight();
			}
			if (params.stairType == "дпк" && params.topFlan == "есть") {
				obj.position.x -= 8;
			}
			//добавляем белые ребра
			if(menu.wireframes){
				addWareframe(obj, obj);
			}
			//добавляем в сцену
			addObjects(viewportId, obj, model.objects[i].layer);
		// }
	};

	//измерение размеров на модели
	addMeasurement(viewportId);
	
	setTimeout(function() {
		if(typeof staircaseLoaded != 'undefined') staircaseLoaded();
	}, 0);
	
} //end of drawStair
