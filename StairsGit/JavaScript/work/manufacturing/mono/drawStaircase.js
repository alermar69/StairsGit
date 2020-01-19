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

/*** СТУПЕНИ НА ВСЕ ЛЕСТНИЦЫ ***/

	treadsObj = drawTreads();
	model.add(treadsObj.treads, "treads");


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
		dxfBasePoint: {x: 0, y: 15000},
		treadsObj: treadsObj,
	};

	var railingObj = drawRailing(railingPar);
	model.add(railingObj.mesh, "railing");
	model.add(railingObj.forgedParts, "forge");
	model.add(railingObj.handrails, "handrails");
	
	/*** ПРИСТЕННЫЙ ПОРУЧЕНЬ НА ВСЕ ЛЕСТНИЦЫ ***/
	
	var sideHandrailPar = {
		treadsObj: treadsObj,
		dxfBasePoint: {x: 25000, y: 15000},
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
		if (params.railingModel != "Самонесущее стекло") moove.x -= 40;//40-ширина стойки
		else moove.x -= 14 + 12;//14 - зазор от стекла до торца марша, 12 - толщина стекла
	}
	
	for(var i=0; i<model.objects.length; i++){
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
	
