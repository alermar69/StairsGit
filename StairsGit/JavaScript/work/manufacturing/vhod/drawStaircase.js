//глобальные переменные для тестирования
var testingMode = false;
var boltDiam = 10;
var boltBulge = 8;
var boltLen = 30;
var turnFactor = 1;
var treadsObj;

drawStaircase = function(viewportId, isVisible) {

	//удаляем старую лестницу

	for (var layer in layers) {
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
		add: function(obj, layer) {
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


	/*** СТУПЕНИ НА ВСЕ ЛЕСТНИЦЫ ***/
	treadsObj = drawTreads();

	// addObjects(viewportId, [treadsObj.treads], 'treads2');
	model.add(treadsObj.treads, "treads");
	model.add(treadsObj.risers, "risers");

	/*** ПЛИНТУС НА ВСЕ ЛЕСТНИЦЫ ***/
	//FIX
	// var skirtingPar = {
	// 	treadsObj: treadsObj,
	// 	dxfBasePoint: {
	// 		x: 0,
	// 		y: -1500
	// 	},
	// }
	// var skirting = drawSkirting_all(skirtingPar).mesh;
	// model.add(skirting, "treads");


	/*** РАМКИ ЗАБЕЖНЫХ СТУПЕНЕЙ ***/

	if (hasTreadFrames() && (treadsObj.wndPar || treadsObj.wndPar2)) {
		var framesObj = new THREE.Object3D();
		//первый поворот
		var turnId = "turn1";

		var wndFramesPar = {
			wndPar: treadsObj.wndPar,
			dxfBasePoint: {
				x: 0,
				y: -3000
			},
			turnId: turnId,
		}

		var marshPar1 = getMarshParams(1);
		var turnType1 = marshPar1.topTurn;

		if (turnType1 == "забег") {
			wndFramesPar = drawWndFrames2(wndFramesPar);
			var wndFrames = wndFramesPar.mesh;
			wndFrames.rotation.y = treadsObj.unitsPos[turnId].rot;
			wndFrames.position.x = treadsObj.unitsPos[turnId].x;
			wndFrames.position.y = treadsObj.unitsPos[turnId].y;
			wndFrames.position.z = treadsObj.unitsPos[turnId].z;
			framesObj.add(wndFrames)
		}

		//второй поворот

		var turnId = "turn2";
		var marshPar3 = getMarshParams(3);
		var turnType3 = marshPar3.botTurn;
		if (turnType3 == "забег" && treadsObj.unitsPos[turnId]) {
			var wndFramesPar = {
				wndPar: treadsObj.wndPar2,
				dxfBasePoint: {
					x: 0,
					y: -3000
				},
				turnId: turnId,
			}
			wndFramesPar = drawWndFrames2(wndFramesPar);
			var wndFrames = wndFramesPar.mesh;
			wndFrames.rotation.y = treadsObj.unitsPos[turnId].rot;
			wndFrames.position.x = treadsObj.unitsPos[turnId].x;
			wndFrames.position.y = treadsObj.unitsPos[turnId].y;
			wndFrames.position.z = treadsObj.unitsPos[turnId].z;
			if (params.stairModel == "П-образная с забегом") wndFrames.position.y += params.h3;
			framesObj.add(wndFrames)
		}

		model.add(framesObj, "angles");
	}

	/*** КАРКАС НА ВСЕ ЛЕСТНИЦЫ ***/

	var carcasPar = {
		dxfBasePoint: {
			x: 0,
			y: 2000
		},
		treadsObj: treadsObj,
	}

	//if(treadsObj.wndPar) carcasPar.turnStepsParams = treadsObj.wndPar;
	//if(treadsObj.wndPar2) carcasPar.turnStepsParams = treadsObj.wndPar2;
	if (wndFramesPar) carcasPar.wndFramesHoles = wndFramesPar.wndFramesHoles;

	if (params.staircaseType == "На заказ") var carcasObj = drawCarcas(carcasPar);
	if (params.staircaseType == "Готовая") var carcasObj = drawCarcasStock(carcasPar);

	model.add(carcasObj.mesh, "carcas");
	model.add(carcasObj.angles, "angles");

	/***  ОГРАЖДЕНИЯ НА ВСЕ ЛЕСТНИЦЫ  ***/

	var railingPar = {
		dxfBasePoint: {
			x: 0,
			y: 20000
		},
		treadsObj: treadsObj,
		stringerParams: carcasPar.stringerParams,
	};

	var railingObj = drawRailing(railingPar);
	model.add(railingObj.mesh, "railing");
	model.add(railingObj.forgedParts, "forge");
	model.add(railingObj.handrails, "handrails");


	/*** ПРИСТЕННЫЙ ПОРУЧЕНЬ НА ВСЕ ЛЕСТНИЦЫ ***/

	 var sideHandrailPar = {
	 	treadsObj: treadsObj,
	 	dxfBasePoint: {
	 		x: 25000,
	 		y: 2000
	 	},
	 }
	
	 var handrail = drawSideHandrail_all(sideHandrailPar);
	 model.add(handrail.mesh, "railing");


	//сдвигаем и поворачиваем лестницу чтобы верхний марш был вдоль оси Х
	var moove = calcStaircaseMoove(treadsObj.lastMarshEnd);

	//сохраняем позицию лестницы для позиционирования шкафа
	params.starcasePos = moove;
	params.starcasePos.rot = moove.rot + params.stairCaseRotation / 180 * Math.PI;
	for (var i = 0; i < model.objects.length; i++) {
		var obj = model.objects[i].obj;
		//позиционируем
		obj.position.x += moove.x + params.staircasePosX;
		obj.position.y += params.staircasePosY;
		obj.position.z += moove.z + params.staircasePosZ + params.M / 2 * turnFactor;
		obj.rotation.y = moove.rot;
		
		//добавляем в сцену
		addObjects(viewportId, [obj], model.objects[i].layer);

		setTimeout(function() {
			if(typeof staircaseLoaded != 'undefined') staircaseLoaded();
		}, 0);

	}

	//измерение размеров на модели
	addMeasurement(viewportId);

} //end of drawStair

