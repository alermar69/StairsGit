//глобальные переменные для тестирования
var testingMode = false;
var boltDiam = 10;
var boltBulge = 8;
var boltLen = 30;
var anglesHasBolts = true; //отрисовывать болты уголков
var drawLongBolts = true; //отрисовывать длинные болты, соединяющие два уголка через тетиву насквозь
var turnFactor = 1;
var treadsObj;

drawStaircase = function (viewportId, isVisible) {
	if(params.model == "труба") {
		boltDiam = 8;
		boltLen = 16;
		}

	for(var layer in layers){
		removeObjects(viewportId, layer);
	}

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

    //очищаем массив параметров деталей лестницы для спецификации
    staircasePartsParams = {
        handrails: [],
        rigels: [],
        columns: [],
    };

	if (params.model == "труба") params.treadPlateThickness = 2;

    /*направление поворота (глобальные переменные)*/

	if (params.turnSide == "правое") turnFactor = 1;
	if (params.turnSide == "левое") turnFactor = -1;

	if (testingMode) isFixPats = false;

	if (params.stairModel == "Спиральная") {
		if (params.turnSide == "правое") turnFactor = -1;
		if (params.turnSide == "левое") turnFactor = 1;
		params.platformAngle = 60;
		var treadLowRad = 75;
		var treadExtraAngle = Math.asin(treadLowRad / (params.staircaseDiam / 2));//начальный угол лестницы
		var treadAngle = calcTriangleParams().treadAngle;
		var stepHeight = Math.floor((params.staircaseHeight - 20) / params.stepAmt);
		//var stepHeight = params.h1;
		var stairAmt = params.stepAmt - 1;


		var stepAngle = params.stepAngle / 180 * Math.PI;

		var staircaseAngle = (stairAmt - 1) * stepAngle
		//совмещаем переднее ребро последней ступени и переднее ребро площадки
		staircaseAngle += calcTriangleParams().pltEdgeAngle / 2
		//добавляем один шаг
		staircaseAngle += stepAngle;

		var startAngle = Math.PI - staircaseAngle;
		startAngle = startAngle * turnFactor
		if (turnFactor == -1) {
			var edgeAngle = treadAngle - 2 * Math.asin(treadLowRad / (params.staircaseDiam / 2));
			startAngle = startAngle - edgeAngle;
		}
	}


/*** СТУПЕНИ НА ВСЕ ЛЕСТНИЦЫ ***/

	if (params.stairModel !== "Спиральная") {
		treadsObj = drawTreads();
		model.add(treadsObj.treads, "treads");
	}
	if (params.stairModel == "Спиральная") {
		var treads = drawSpiralTreads();
		model.add(treads, "treads");
	}


	if (params.stairModel !== "Спиральная") {
/*** КАРКАС НА ВСЕ ЛЕСТНИЦЫ ***/

		var stringerParams = {
			dxfBasePoint: newPoint_xy(dxfBasePoint, 0, -5000),
			treadsObj: treadsObj,
		};

		drawCarcas(stringerParams);

		model.add(stringerParams.carcas, "carcas");
		model.add(stringerParams.carcas1, "carcas1");
		model.add(stringerParams.flans, "flans");
		model.add(stringerParams.treadPlates, "treadPlates");

		if (params.calcType !== 'curve') {
			// рамка под площадкой для лестницы на профиле
			if (params.model == "труба") {
				var framePlatformParams = {
					dxfBasePoint: dxfBasePoint,
					treadsObj: treadsObj,
				};

				drawPlatformFrames(framePlatformParams);
				model.add(framePlatformParams.flans, "flans");
				model.add(framePlatformParams.platformFrames, "treadPlates");

			}

/***  ограждения на все лестницы  ***/
			var railingPar = {
				dxfBasePoint: { x: 0, y: 15000 },
				treadsObj: treadsObj,
			};

			var railingObj = drawRailing(railingPar);
			model.add(railingObj.mesh, "railing");
			model.add(railingObj.forgedParts, "forge");
			model.add(railingObj.handrails, "handrails");

			/*** ПРИСТЕННЫЙ ПОРУЧЕНЬ НА ВСЕ ЛЕСТНИЦЫ ***/

			var sideHandrailPar = {
				treadsObj: treadsObj,
				dxfBasePoint: { x: 25000, y: 15000 },
			}

			var handrail = drawSideHandrail_all(sideHandrailPar).mesh;
			model.add(handrail, "handrails");
		}

		//сдвигаем и поворачиваем лестницу чтобы верхний марш был вдоль оси Х
		var moove = calcStaircaseMoove(treadsObj.lastMarshEnd);

		//сохраняем позицию лестницы для позиционирования шкафа
		params.starcasePos = moove;
		params.starcasePos.rot = moove.rot + params.stairCaseRotation / 180 * Math.PI;


		//если на верхней площадке есть заднее ограждение, сдвигаем лестницу по оси Х чтобы ограждение не пересекалось с верхним перекрытием
		if (params.platformTop == "площадка" && params.topPltRailing_5) {
			if (params.railingModel != "Самонесущее стекло") moove.x -= 40; //40-ширина стойки
			else moove.x -= 14 + 12; //14 - зазор от стекла до торца марша, 12 - толщина стекла
		}
	}

	if (params.stairModel == "Спиральная") {
		var stringerMaterial = new THREE.MeshLambertMaterial({
			color: 0x363636,
			wireframe: false
		});
		stringerMaterial.side = THREE.DoubleSide;

		var stringerExtraStep = 0.5;
		if (params.stairModel == "Спиральная") {
			stringerExtraStep = calcTriangleParams().treadOverlayLength / (treadAngle * params.staircaseDiam / 2);
		}

		var stringerParams = {
			rad: params.staircaseDiam / 2 + 1,
			height: stepHeight * (stairAmt + stringerExtraStep),
			stripeWidth: 300,
			angle: (stairAmt + stringerExtraStep) * stepAngle,
			botHeight: stepHeight,
			topHeight: 300 - stepHeight * stringerExtraStep,
			turnFactor: turnFactor,
			material: stringerMaterial,
			stairAmt: stairAmt,
			stepHeight: stepHeight,
		}



		stringerParams = drawSpiralStripe1(stringerParams);
		var stringer = stringerParams.mesh;
		stringer.rotation.x = Math.PI / 2;
		stringer.rotation.z = startAngle - treadExtraAngle // + edgeAngle
		if (params.model == "Спиральная") stringer.rotation.z = startAngle;
		if (turnFactor == -1) stringer.rotation.z += treadAngle;

		stringer.position.x = 0;
		//stringers.push(stringer);
		model.add(stringer, "stringers");




		var moove = {
			x: -(params.staircaseDiam / 2),
			y: 0,
			z: (params.staircaseDiam / 2 + 50),
			rot: Math.PI + params.stairCaseRotation / 180 * Math.PI,
		}
	}

	for (var i = 0; i < model.objects.length; i++) {
			var obj = model.objects[i].obj;
			//позиционируем
			obj.position.x += moove.x + params.staircasePosX;
			obj.position.y += params.staircasePosY;
			obj.position.z += moove.z + params.staircasePosZ + params.M / 2 * turnFactor;
			obj.rotation.y = moove.rot;

			//добавляем в сцену
			addObjects(viewportId, obj, model.objects[i].layer);

		}
	

	//измерение размеров на модели
	addMeasurement(viewportId);

	setTimeout(function() {
		if(typeof staircaseLoaded != 'undefined') staircaseLoaded();
	}, 0);

} //end of drawStair
	
