//
//глобальные переменные для тестирования
var testingMode = false;
var boltDiam = 10;
var boltBulge = 8;
var boltLen = 30;
var stairParams = {};
var turnFactor = 1;
var stringerParams = {};


//функция - оболочка
function drawStaircase(viewportId, isVisible) {

	//удаляем старую лестницу

	for (var layer in layers) {
		removeObjects(viewportId, layer);
	}

	//итоговая модель лестницы

	var model = {
		objects: [],
		//метод выцепляет из массива objects объект слоя по имени слоя layer
		getLayerObj: function(layer) {
			$.each(this.objects, function() {
				if (this.layer == layer) return this;
			})
			return false;
		},
		//метод добавляет в объект слоя layer объект obj
		add: function(obj, layer) {
			var layerObj = this.getLayerObj(layer);
			if (!layerObj) {
				var layerObj = {
					obj: new THREE.Object3D(),
					layer: layer,
				};
				this.objects.push(layerObj);
			};

			layerObj.obj.add(obj);
		},
	};

	//обнуляем счетчики спецификации
	partsAmt = {};
	partsAmt_bal = {
		unit: "banister"
	}
	specObj = partsAmt; //задаем объект, куда будут сохраняться данные для спецификации

	//обнуляем массив примитивов dxfBasePoint
	dxfPrimitivesArr = [];

	/*вспомогательные оси*/
	var axis = new THREE.AxisHelper(2000);
	model.add(axis, "topFloor");

	/*параметры лестницы*/
	var platformAngle = getInputValue("platformAngle");
	if (params.platformType == "square") platformAngle = 90;
	var platformPosition = getInputValue("platformPosition");
	var columnDiam = getInputValue("columnDiam");
	var platformLedge = params.platformLedge;
	turnFactor = params.turnFactor * 1;
	var treadLowRad = 75;
	var holeDiam = 26;
	var stairAmt = params.stepAmt - 1;
	if (platformPosition == "ниже") stairAmt = params.stepAmt - 2;
	if (params.platformType == 'нет') stairAmt += 1;

	stairParams.stairAmt = stairAmt;
	var botFloorType = params.botFloorType;

	var stairType = "timber";
	if (params.stairType == "рифленая сталь" || params.stairType == "лотки под плитку" || params.stairType == 'рамки') stairType = "metal";

	var isBolz = false;
	if (params.model == "Винтовая" && params.railingModel == "Ригели") isBolz = true;

	//параметры промежуточных креплений
	midHoldersParams = {
		pos: [],
		holderLength: [],
		angle: [],
	};
	for (var i = 0; i < params.holderAmt; i++) {
		midHoldersParams.holderLength.push(params["holderLength_" + i]);
		midHoldersParams.angle.push(params["holderAngle_" + i]);
		midHoldersParams.pos.push(params["holderPos_" + i]);
	}

	// if (params.strightMarsh == "снизу" || params.strightMarsh == "сверху и снизу") {
	// 	midHoldersParams.holderLength.push(params.M - 70 * 2); // 70 - боковой свес и прочее(заменить)
	// 	midHoldersParams.angle.push(params.strightTreadsAngle - 180);
	// 	midHoldersParams.pos.push(1);

	// 	params.holderAmt += 1;
	// }
	// if (params.strightMarsh == "сверху" || params.strightMarsh == "сверху и снизу") {
	// 	midHoldersParams.holderLength.push(params.M - 70 * 2); // 70 - боковой свес и прочее(заменить)
	// 	midHoldersParams.angle.push(180);
	// 	midHoldersParams.pos.push(params.stepAmt - 1);
	// 	params.holderAmt += 1;
	// }

	var strightPartHeight1 = 0;
	if (params.strightMarsh == "снизу" || params.strightMarsh == "сверху и снизу") {
		if (params.platformType == "square") {
			var vintTreadsAngle = (params.strightTreadsAngle * 1.0) / stairAmt;
			params.stepAngle = vintTreadsAngle;
		}

		if (params.platformType == "triangle") {
			var vintTreadsAngle = (params.strightTreadsAngle * 1.0) / stairAmt;
			vintTreadsAngle += (90 - platformAngle / 2) / stairAmt;
			var treadExtraAngle = Math.asin(treadLowRad / (params.staircaseDiam / 2));
			vintTreadsAngle += THREE.Math.radToDeg(treadExtraAngle) / stairAmt;
			params.stepAngle = vintTreadsAngle;
			// 60 - 17.6
			// 90 - 16.5
			// console.log(vintTreadsAngle, platformAngle)
		}

		if (params.platformType == "нет") {
			var vintTreadsAngle = (params.strightTreadsAngle * 1.0) / stairAmt;
			params.stepAngle = vintTreadsAngle;
			var treadAngle = calcTriangleParams().treadAngle;
			var treadExtraAngle = Math.asin(treadLowRad / (params.staircaseDiam / 2));
			var edgeAngle = treadAngle - 2 * Math.asin(treadLowRad / (params.staircaseDiam / 2));
			var vintTreadsAngle = (params.strightTreadsAngle * 1.0) / stairAmt;
			vintTreadsAngle += THREE.Math.radToDeg(treadExtraAngle) / stairAmt;
			params.stepAngle = vintTreadsAngle;
		}

		$("#stepAngle").val(params.stepAngle);
		
		strightPartHeight1 = params.stairAmt1 * params.h1;
	}
	var strightPartHeight2 = 0;
	if (params.strightMarsh == "сверху" || params.strightMarsh == "сверху и снизу") {
		strightPartHeight2 = params.stairAmt3 * params.h3;//
	}

	var staircaseHeight = params.staircaseHeight - strightPartHeight1 - strightPartHeight2;

	//расчет подъема ступени
	var regShimAmt = params.regShimAmt;
	var regShimThk = 4; //толщина с учетом слоя краски
	var stepHeight = Math.floor((staircaseHeight - 20) / params.stepAmt);
	var G = (Math.floor((360 - platformAngle) / params.stepAngle) - 1) * stepHeight;
	if (params.stairType == "рифленая сталь" || params.stairType == "лотки под плитку") {
		G -= 120;
	}
	if (params.stairType == "рамки") {
		G -= 120 + params.treadThickness;
	}
	if (params.stairType != "рифленая сталь" && params.stairType != "лотки под плитку") {
		G -= 40;
		if (params.platformType == "square") G -= 100; //учитываем раму под площадкой 
	}

	if(G < 2000 && !testingMode) alertTrouble("ВНИМАНИЕ! Габарит G = " + G + "мм! Рекомендуется делать габарит не менее 2000мм!")

	//заносим значения в глобальный массив параметров
	stairParams.stepHeight = stepHeight;
	stairParams.platformAngle = platformAngle;
	stairParams.G = G;

	//переводим углы в радианы
	var stepAngle = params.stepAngle / 180 * Math.PI;
	var platformAngle = platformAngle / 180 * Math.PI;

	/*Материалы*/
	var metalColor1 = 0x333000;
	var metalColor2 = 0xBD3088;
	var shimColor = 0xFF0000;
	//цвета из параметров
	if (!menu.realColors) {
		metalColor1 = metalColor2 = shimColor = getMetalColorId(params.metalColorNumber);
	}

	var metalMaterial1 = new THREE.MeshLambertMaterial({
		color: metalColor1,
		wireframe: false
	});
	var metalMaterial2 = new THREE.MeshLambertMaterial({
		color: metalColor2,
		wireframe: false
	});
	var shimMaterial = new THREE.MeshLambertMaterial({
		color: shimColor,
		wireframe: false
	});

	//Угол ступени с учетом нахлеста ступеней
	var treadAngle = calcTriangleParams().treadAngle;
	var edgeAngle = treadAngle - 2 * Math.asin(treadLowRad / (params.staircaseDiam / 2));
	
	/*начальный угол лестницы*/
	var treadExtraAngle = Math.asin(treadLowRad / (params.staircaseDiam / 2));
	var platformDepth = params.staircaseDiam / 2 + platformLedge;
	var L1 = platformDepth / Math.cos(platformAngle / 2);
	var platformExtraAngle = Math.asin(treadLowRad / L1);
	
	//ставим переднее ребро последней ступени вдоль оси Х
	var staircaseAngle = (stairAmt - 1) * stepAngle	
	//совмещаем переднее ребро последней ступени и переднее ребро площадки
	staircaseAngle += calcTriangleParams().pltEdgeAngle / 2
	//добавляем один шаг
	staircaseAngle += stepAngle;
	
	if (params.platformType == "square" || params.platformType == "нет") {
		staircaseAngle = stairAmt * stepAngle
		if (stairType == "metal") staircaseAngle -= Math.atan(18 / (params.staircaseDiam / 2 + 10));
		if (params.platformType == "нет") staircaseAngle += -stepAngle + edgeAngle
	}

	var startAngle = Math.PI - staircaseAngle;
	startAngle = startAngle * turnFactor

	if (turnFactor == -1) startAngle = startAngle - edgeAngle;
	stairParams.stairCaseAngle = staircaseAngle;

	var mainParams = {
		treadAngle: treadAngle,
		treadLowRad: treadLowRad,
		columnDiam: columnDiam,
		holeDiam: holeDiam,
		stepHeight: stepHeight,
		stairAmt: stairAmt,
		stairType: stairType,
		isBolz: isBolz,
		startAngle: startAngle,
		stepAngle: stepAngle,
		regShimThk: regShimThk,
		regShimAmt: regShimAmt,
		platformExtraAngle: platformExtraAngle,
		treadExtraAngle: treadExtraAngle,
		platformAngle: platformAngle,
		platformPosition: platformPosition,
		platformLedge: platformLedge,
		edgeAngle: edgeAngle,
		platformDepth: platformDepth,
		strightPartHeight: strightPartHeight1,
		staircaseHeight: staircaseHeight
	};
	var treads = addVintTreads(mainParams).mesh;
	model.add(treads, 'treads');

	if (params.strightMarsh != 'нет') {
		params.M = params.staircaseDiam / 2;// - columnDiam / 2;
		$("#M").val(params.M);
		//нижний марш
		if (params.strightMarsh == "снизу" || params.strightMarsh == "сверху и снизу"){
			var treads = drawStrightMarsh(mainParams, 1);
			treads.position.y -= strightPartHeight1;
			model.add(treads, 'treads');
		}
		
		//верхний марш
		if (params.strightMarsh == "сверху" || params.strightMarsh == "сверху и снизу"){
			var treads = drawStrightMarsh(mainParams, 3);
			treads.position.y = staircaseHeight;// - strightPartHeight2;
			if (params.platformPosition == 'ниже') {
				treads.position.y -= params.h3;
			}
			model.add(treads, 'treads');
		}
	}
	
	
	var carcas = drawVintCarcas(mainParams);
	model.add(carcas, 'carcas');
	
	if (params.platformType != 'нет') {
		var vintPlatformParams = drawPlatform(mainParams);
		mainParams.vintPlatformParams = vintPlatformParams;
		model.add(vintPlatformParams.mesh, 'carcas');
	}

	var railing = drawRailing(mainParams);
	model.add(railing, 'railing');

	var fixings = drawMidFixings(mainParams);
	model.add(fixings, 'carcas');
	/* секция ограждений площадки*/

	if (params.platformSectionLength > 0) {
		var platformRailing = drawPlatformRailing(mainParams);
		model.add(platformRailing, 'railing');
	};

	//сдвигаем и поворачиваем лестницу
	var moove = {
		x: -(params.staircaseDiam / 2 + params.platformLedge),
		y: 0,
		z: (params.staircaseDiam / 2 + 50),
		rot: Math.PI + params.stairCaseRotation / 180 * Math.PI,
	}

	if (params.platformType == "square") {
		moove.x = -(params.staircaseDiam / 2 + params.platformLedgeM);
		moove.z = (params.staircaseDiam / 2 + params.platformLedge);

		if (params.turnFactor == -1) {
			moove.rot += Math.PI / 2;
			moove.x = -(params.staircaseDiam / 2 + params.platformLedge);
			moove.z = (params.staircaseDiam / 2 + params.platformLedgeM);
		}
	}
	
	if (params.platformType == "нет") {
		moove.x = -75; //подогнано
		moove.z = (params.staircaseDiam / 2);

		if (params.turnFactor == -1) {
			moove.rot += Math.PI / 2;
		}
	}
	
	if (params.strightMarsh == "сверху" || params.strightMarsh == "сверху и снизу") {
		moove.x -= getMarshParams(3).len;

		if(turnFactor == 1) {
			moove.rot -= Math.PI / 2;
		}
	}
	
	window.vintStaircaseMoove = moove;
	//window.vintStaircaseMoove.x += params.staircasePosX;
	//window.vintStaircaseMoove.z += params.staircasePosZ * 2;

	for (var i = 0; i < model.objects.length; i++) {
		var obj = model.objects[i].obj;
		//позиционируем
		obj.position.x += moove.x + params.staircasePosX;
		obj.position.y += params.staircasePosY + (strightPartHeight1 || 0);
		obj.position.z += moove.z + params.staircasePosZ;
		obj.rotation.y = moove.rot;

		//добавляем в сцену
		addObjects(viewportId, obj, model.objects[i].layer);

	}

	//измерение размеров на модели
	addMeasurement(viewportId);

	setTimeout(function() {
		if(typeof staircaseLoaded != 'undefined') staircaseLoaded();
	}, 0);

} //end of drawVintStaircase(scene);

function getIndexDivide(point, divides) {
	var index = 0;
	var startY = 0;
	var endY = 0;
	for (var i = 0; i < divides.length; i++) {
		endY = divides[i];
		if (point.y > startY && point.y < endY) return index;
		startY = endY;
		index++;
	}
	return index;
}
