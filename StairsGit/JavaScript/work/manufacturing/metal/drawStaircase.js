//глобальные переменные для тестирования
var testingMode = false;
var boltDiam = 10;
var boltBulge = 8;
var boltLen = 30;
var turnFactor = 1;
var treadsObj;

drawStaircase = function (viewportId, isVisible) {
	//удаляем старую лестницу
	for(var layer in layers){
		removeObjects(viewportId, layer);
	}
	
	//очищаем глобальный массив параметров для спецификации
	staircasePartsParams = {
		handrails: [],
		rigels: [],
		columns: [],
		braces: [],
		angles: {},
		sideHandrailHolderAmt: 0,
		rackAmt: 0,
		glassAmt: 0,
		divideAmt: 0,
		frame1Flans: [],
		frame2Flans: [],
		frame3Flans: [],
		frame6Flans: [],
	};

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
	
	//обнуляем счетчики спецификации
	partsAmt = {};
	partsAmt_bal = {unit: "banister"}
	specObj = partsAmt; //задаем объект, куда будут сохраняться данные для спецификации
	poleList = {};
	railingParams = {};
	shapesList = [];

	/*удаляем контуры*/
	dxfPrimitivesArr = [];
	var dxfBasePointStep = 200.0;

	if (params.model == "нет") {
		params.model = "лт";
		alert("ВНИМАНИЕ! Делаются только ограждения! Каркас и ступени отрисовываются просто для наглядности.")
	}

	/*направление поворота (глобальные переменные)*/

	if (params.turnSide == "правое") turnFactor = 1;
	if (params.turnSide == "левое") turnFactor = -1;

	if (params.railingModel == "Самонесущее стекло" && params.rackBottom == "сверху с крышкой")
		params.rackBottom = "боковое";

	//для консольных лестниц делаем ступени как на mono
	var calcTypeTemp = params.calcType;
	var modelTemp = params.model;
	if (params.calcType == 'console') {
		params.calcType = 'mono';
		params.model = 'сварной';
	}


	/*** СТУПЕНИ НА ВСЕ ЛЕСТНИЦЫ ***/
	if (params.stairType == "лотки") params.treadThickness = 4;
	
	treadsObj = drawTreads()
	model.add(treadsObj.treads, "treads");
	model.add(treadsObj.risers, "risers");
	params.calcType = calcTypeTemp;
	params.model = modelTemp;

	//добавляем параметры пригласительных ступеней в глобальный объект
	staircasePartsParams.startTreadsParams = treadsObj.startTreadsParams;


	/*** ПЛИНТУС НА ВСЕ ЛЕСТНИЦЫ ***/

	var skirtingPar = {
		treadsObj: treadsObj,
		dxfBasePoint: {x: 0, y: -10000},
		}
	var skirting = drawSkirting_all(skirtingPar).mesh;
	model.add(skirting, "treads");
	
	
	/*** РАМКИ ЗАБЕЖНЫХ РАМОК ***/

	if(hasTreadFrames() && (treadsObj.wndPar || treadsObj.wndPar2)){
		var framesObj = new THREE.Object3D();
		//первый поворот
		var turnId = "turn1";
		
		var wndFramesPar = {
			wndPar: treadsObj.wndPar,
			dxfBasePoint: {x: 0, y: -3000},
			turnId: turnId,				
			}
		
		var marshPar1 = getMarshParams(1);
		var turnType1 = marshPar1.topTurn;

		wndFramesPar.marshPar = marshPar1;
		
		if(turnType1 == "забег"){
			wndFramesPar = drawWndFrames2(wndFramesPar);
			var wndFrames = wndFramesPar.mesh;
			wndFrames.rotation.y = treadsObj.unitsPos[turnId].rot;
			wndFrames.position.x = treadsObj.unitsPos[turnId].x;
			wndFrames.position.y = treadsObj.unitsPos[turnId].y;
			if (params.stairType == "лотки") wndFrames.position.y += params.treadThickness - 0.01;
			wndFrames.position.z = treadsObj.unitsPos[turnId].z;
			
			framesObj.add(wndFrames)
			}
		
		//второй поворот
		
		var turnId = "turn2";
		var marshPar3 = getMarshParams(3);
		var turnType3 = marshPar3.botTurn;
		if(turnType3 == "забег" && treadsObj.unitsPos[turnId]){
			var wndFramesPar1 = {
				wndPar: treadsObj.wndPar2,
				dxfBasePoint: {x: 7000, y: -3000},
				turnId: turnId,
			}
			wndFramesPar1.marshPar = marshPar3;
			wndFramesPar1 = drawWndFrames2(wndFramesPar1);
			var wndFrames = wndFramesPar1.mesh;
			wndFrames.rotation.y = treadsObj.unitsPos[turnId].rot;
			wndFrames.position.x = treadsObj.unitsPos[turnId].x;
			wndFrames.position.y = treadsObj.unitsPos[turnId].y;
			if (params.stairType == "лотки") wndFrames.position.y += params.treadThickness - 0.01;
			wndFrames.position.z = treadsObj.unitsPos[turnId].z;
			if(params.stairModel == "П-образная с забегом") wndFrames.position.y += params.h3;
			framesObj.add(wndFrames)
			}
		
		model.add(framesObj, "angles");
	}

	/*** КАРКАС НА ВСЕ ЛЕСТНИЦЫ ***/

	var carcasPar = {
		dxfBasePoint: {x: 0, y: 2000},
		treadsObj: treadsObj,
	}

	//if(treadsObj.wndPar) carcasPar.turnStepsParams = treadsObj.wndPar;
	//if(treadsObj.wndPar2) carcasPar.turnStepsParams = treadsObj.wndPar2;
	if(wndFramesPar) carcasPar.wndFramesHoles = wndFramesPar.wndFramesHoles;
	if(wndFramesPar1) carcasPar.wndFramesHoles1 = wndFramesPar1.wndFramesHoles;

	var carcasObj = drawCarcas(carcasPar);
	
	model.add(carcasObj.mesh, "carcas");
	model.add(carcasObj.angles, "angles");
	
	//для консольных лестниц делаем ограждения как на mono
	var calcTypeTemp = params.calcType;
	var modelTemp = params.model;
	if (params.calcType == 'console') {
		params.calcType = 'mono';
		params.model = 'сварной';
	}

	/***  ОГРАЖДЕНИЯ НА ВСЕ ЛЕСТНИЦЫ  ***/
	var railingPar = {
		dxfBasePoint: {x: 15000, y: 2000},
		treadsObj: treadsObj,
		stringerParams: carcasPar.stringerParams,		
	};
	var railingObj = drawRailing(railingPar);
	model.add(railingObj.mesh, "railing");
	model.add(railingObj.forgedParts, "forge");
	model.add(railingObj.handrails, "handrails");


	params.calcType = calcTypeTemp;
	params.model = modelTemp;
	

/*** ПРИСТЕННЫЙ ПОРУЧЕНЬ НА ВСЕ ЛЕСТНИЦЫ ***/
	
	var sideHandrailPar = {
		treadsObj: treadsObj,
		dxfBasePoint: {x: 25000, y: 2000},
	}

	var handrail = drawSideHandrail_all(sideHandrailPar).mesh;
	model.add(handrail, "handrails");
	//сдвигаем и поворачиваем лестницу чтобы верхний марш был вдоль оси Х
	var moove = calcStaircaseMoove(treadsObj.lastMarshEnd);	

	//сохраняем позицию лестницы для позиционирования шкафа
	params.starcasePos = moove;
	params.starcasePos.rot = moove.rot + params.stairCaseRotation / 180 * Math.PI;

	//если на верхней площадке есть заднее ограждение, сдвигаем лестницу по оси Х чтобы ограждение не пересекалось с верхним перекрытием
	if (params.platformTop == "площадка" && params.topPltRailing_5) {
		if (params.railingModel != "Самонесущее стекло") params.staircasePosX -= 40;//40-ширина стойки
		else params.staircasePosX -= 20 + 12;//20 - зазор от стекла до торца марша, 12 - толщина стекла
	}

	for(var i=0; i<model.objects.length; i++){
		var obj = model.objects[i].obj;
		//позиционируем
		obj.position.x += moove.x + params.staircasePosX;
		obj.position.y += params.staircasePosY;
		obj.position.z += moove.z + params.staircasePosZ + params.M / 2 * turnFactor;
		obj.rotation.y = moove.rot;
		//смещаем все ступени для лотков
		if(params.stairType == "лотки" && model.objects[i].layer == "treads") {
			obj.position.y += 4;
		}
		
		obj.layerName = model.objects[i].layer;
		
		//добавляем в сцену
		addObjects(viewportId, obj, model.objects[i].layer);
		
	}

	//измерение размеров на модели
	addMeasurement(viewportId);

	if (typeof staircaseLoaded !== undefined) staircaseLoaded();

} //end of drawStair
