/**Вывод каркаса одного марша*/
function drawMarshStringersConsole(par, marshId) {

	params.stringerType = "прямая";
	var flanThickness = 8;

	var mesh = new THREE.Object3D();
	var angles = new THREE.Object3D();

	var marshPar = getMarshParams(marshId);

	stringerParams = {
		marshId: marshId,
		dxfBasePoint: par.dxfBasePoint,
		turnStepsParams: par.treadsObj.wndPar,
		treadsObj: par.treadsObj,
		wndFramesHoles: par.wndFramesHoles,
		addStringerWidth: 70,
	};
	if (par.wndFramesHoles1) stringerParams.wndFramesHoles1 = par.wndFramesHoles1;
	var useTopWnPar = false;
	if (par.treadsObj.wndPar2) {
		if (marshId == 3 && params.stairModel == "П-образная с забегом") useTopWnPar = true;
		if (marshId == 3 && params.stairModel == "П-образная трехмаршевая") useTopWnPar = true;
		if (!par.treadsObj.wndPar) useTopWnPar = true;
	}
	if (useTopWnPar) stringerParams.turnStepsParams = par.treadsObj.wndPar2;
	calcStringerParams(stringerParams);

	var stringerModel = params.stringerModel;


	//позиция косоуров по Z
	var posZ = - (params.M / 2 + flanThickness + calcStringerMoove(marshId).stringerOutMoove) * turnFactor;
	if (turnFactor == 1) posZ -= params.stringerThickness - 0.01

	//для прямой лестницы все наоборот
	if (params.stairModel == "Прямая") {
		posZ = (params.M / 2 + flanThickness + calcStringerMoove(marshId).stringerOutMoove) * turnFactor;
		if (turnFactor == -1) posZ -= params.stringerThickness;
	}

	if (stringerModel == 'короб') {
		var thk = 4;
		var stringerThickness = params.stringerThickness;

		var posZ = - (params.M / 2 + calcStringerMoove(marshId).stringerOutMoove) * turnFactor;
		if (turnFactor == 1) posZ -= thk - 0.01

		//для прямой лестницы все наоборот
		if (params.stairModel == "Прямая") {
			posZ = (params.M / 2 + calcStringerMoove(marshId).stringerOutMoove) * turnFactor;
			if (turnFactor == -1) posZ -= thk;
		}

	}


	//внешний косоур/тетива	
	stringerParams.wndFramesHoles = par.wndFramesHoles;

	stringerParams.dxfBasePoint = par.dxfBasePoint;
	stringerParams.key = "out";
	stringerParams.number = 1;
	var stringer2 = drawStringer(stringerParams).mesh;
	stringer2.position.x = -stringerParams.treadFrontOverHang;
	stringer2.position.z = posZ;
	mesh.add(stringer2);

	par.dxfBasePoint.x += stringerParams.lenX + 1000;

	// Рамки внутри ступени
	var framePar = {
		marshId: marshId,
		dxfBasePoint: par.dxfBasePoint,
	}

	var frames = drawConsoleFrames(framePar).mesh;
	frames.setLayer('angles')
	mesh.add(frames);

	

	if (stringerModel == 'лист') {
		// Соединительные фланцы на внешней тетиве

		var flanPar = {
			marshId: marshId,
			dxfBasePoint: par.dxfBasePoint,
			wndPar: par.treadsObj.wndPar,
			wndPar2: par.treadsObj.wndPar2,
		}

		// Отрисовка фланцев 
		var flans = drawStringerConsoleFlans(flanPar).mesh;
		flans.position.z = posZ
		flans.setLayer('angles')

		var offsetZ = flanThickness * turnFactor;

		if (params.stairModel == "Прямая") flans.position.z -= offsetZ;
		if (params.stairModel != "Прямая") flans.position.z += offsetZ;

		mesh.add(flans);

		/* болты */
		if (typeof anglesHasBolts != "undefined" && anglesHasBolts) { //глобальная переменная
			var boltPar = {
				diam: 10,
				len: 40,
				headType: "шестигр.",
				nutOffset: -40 + 20 + 12,
				headShim: true,
			}
			for (var i = 0; i < stringerParams.pointsHole.length; i++) {
				if (stringerParams.pointsHole[i].isFixWall) {
					var bolt = drawBolt(boltPar).mesh;
					bolt.rotation.x = -Math.PI / 2 * turnFactor;
					bolt.position.x = stringerParams.pointsHole[i].x - 5;
					bolt.position.y = stringerParams.pointsHole[i].y;
					bolt.position.z = posZ + params.stringerThickness * (1 - turnFactor) * 0.5;
					if (params.stairModel == "Прямая") {
						bolt.rotation.x = Math.PI / 2 * turnFactor;
						bolt.position.z = posZ + params.stringerThickness * (1 + turnFactor) * 0.5;
					}

					mesh.add(bolt);
				}
			}
		}
	}

	if (stringerModel == 'короб') {

		//внешний косоур/тетива	
		stringerParams.wndFramesHoles = par.wndFramesHoles;

		stringerParams.dxfBasePoint = par.dxfBasePoint;
		stringerParams.key = "out";
		stringerParams.number = 2;
		var stringer21 = drawStringer(stringerParams).mesh;
		stringer21.position.x = stringer2.position.x;
		stringer21.position.z = stringer2.position.z;
		if (params.stairModel == "Прямая") stringer21.position.z += (params.stringerThickness - thk) * turnFactor;
		if (params.stairModel !== "Прямая") stringer21.position.z -= (params.stringerThickness - thk) * turnFactor;
		mesh.add(stringer21);

		par.dxfBasePoint.x += stringerParams.lenX + 1000;

		//внутренние пластины по контуру тетивы
		var platePar = {
			marshId: marshId,
			dxfBasePoint: par.dxfBasePoint,
			pointsShape: stringerParams.pointsShape,
			thk: thk,
			width: params.stringerThickness - thk * 2,
		}

		var plates = drawContourPlates(platePar).mesh;

		plates.position.x = stringer2.position.x;

		if (params.stairModel == "Прямая") {
			plates.position.z = stringer2.position.z + thk * turnFactor;
			if (turnFactor == -1) plates.position.z -= params.stringerThickness - thk * 2;
		}
		if (params.stairModel !== "Прямая") {
			plates.position.z = stringer2.position.z + thk;
			if (turnFactor == 1) plates.position.z -= params.stringerThickness - thk;
		}
		//plates.setLayer('carcas1')
		plates.setLayer('flans')

		mesh.add(plates);

		//ребра тетивы
		var edgePar = {
			marshId: marshId,
			dxfBasePoint: par.dxfBasePoint,
			pointsShape: stringerParams.pointsShape,
			thk: 4,
			width: params.stringerThickness - thk * 2,
			pointsIn: platePar.pointsIn,
		}

		var edges = drawStringerConsoleEdges(edgePar).mesh;

		edges.position.x = stringer2.position.x;

		if (params.stairModel == "Прямая") {
			edges.position.z = stringer2.position.z + thk * turnFactor;
			if (turnFactor == -1) edges.position.z -= params.stringerThickness - thk * 2;
		}
		if (params.stairModel !== "Прямая") {
			edges.position.z = stringer2.position.z + thk;
			if (turnFactor == 1) edges.position.z -= params.stringerThickness - thk;
		}
		edges.setLayer('angels')

		mesh.add(edges);
		
	}


	stringerParams.mesh = mesh;
	stringerParams.angles = angles;

	stringerParams.dxfBasePoint.y += 3000;

	return stringerParams;
}


//--------------------------------------------------------

function calcTurnParams(botMarshId) {

	var marshPar = getMarshParams(botMarshId);
	var nextMarshPar = getMarshParams(marshPar.nextMarshId);
	var prevMarshPar = getMarshParams(marshPar.prevMarshId);
	var turnType = marshPar.topTurn;

	//рассчитываем размеры поворота, зависящие от модели лестницы
	var modelParams = {
		turnType: "G_turn",
		model: "mono",
		turnTypeName: turnType,
		marshId: botMarshId,
	}
	if (params.model == "лт" || params.model == "ко") modelParams.model = params.model;
	if (params.calcType == "timber") modelParams.model = "timber";
	if (params.calcType == "timber_stock") modelParams.model = "timber_stock";
	if (params.stairModel == "П-образная с площадкой" || params.stairModel == "П-образная с забегом") modelParams.turnType = "P_turn";
	if (params.calcType == "bolz") modelParams.model = "bolz";
	if (params.calcType == "console") modelParams.model = "mono";

	modelParams = setModelDimensions(modelParams); //функция в файле calcGeomParams.js

	var par = {};

	par.pltExtraLen = modelParams.deltaTop;

	par.topMarshOffsetZ = modelParams.deltaBottom;
	par.topMarshOffsetX = modelParams.deltaTop;
	if (params.stairModel == "Прямая с промежуточной площадкой") par.topMarshOffsetX = modelParams.deltaBottom;
	par.topStepDelta = modelParams.topStepDelta;

	//деревянные лестницы
	if (params.calcType == "timber") {
		//позиция оси столба относительно передней линии площадки/нижней забежной ступени
		if (params.model != "тетивы") {
			par.newellPosX = par.topMarshOffsetX + params.rackSize / 2;
		}
		if (params.model == "тетивы") {
			par.newellPosX = par.topMarshOffsetX + params.stringerThickness / 2;
		}

		//позиция оси столба относительно внутреннего края нижнего марша
		if (params.model != "тетивы") par.newellPosZ = -params.rackSize / 2;
		if (params.model == "тетивы") par.newellPosZ = -params.stringerThickness / 2; //должно быть 0

		//отступы края паза от края столба

		//площадка/первая забежная ступень, нижний марш
		par.notchOffset1 = params.rackSize / 2 - par.newellPosX;

		//площадка/первая прямая ступень, верхний марш
		par.notchOffset2 = params.rackSize / 2 - par.newellPosZ + par.topMarshOffsetZ;

		//отступ верхнего края тетивы нижнего марша от плоскости последней ступени нижнего марша
		par.stringerTopOffset = -params.treadThickness;
		if (params.model == "тетивы") par.stringerTopOffset = marshPar.h - 20;

		//отступ низа тетивы верхнего марша от плоскости первой ступени верхнего марша
		par.stringerBotOffset = getMarshParams(marshPar.nextMarshId).h + 20 + params.treadThickness;

	}


	//длина поворота вдоль нижнего марша
	par.turnLengthTop = 0;
	if (marshPar.topTurn != "нет") par.turnLengthTop = params.M + par.topMarshOffsetX;

	if (botMarshId == 1 && params.stairModel == "Г-образная с площадкой" && hasCustomMidPlt())
		par.turnLengthTop = params.middlePltLength + par.topMarshOffsetX;

	//для верхней площадки лестницы длина берется из параметров
	if (botMarshId == 3) par.turnLengthTop = params.platformLength_3;
	if (params.stairModel == "Прямая" && params.platformTop != "нет") par.turnLengthTop = params.platformLength_3;
	//для промежуточной площадки П-образной лестницы длина берется из параметров
	if (marshPar.topTurn == "площадка" && botMarshId == 1 && params.stairModel == "П-образная с площадкой")
		par.turnLengthTop = params.platformLength_1 + par.topMarshOffsetX;


	//длина поворота вдоль верхнего марша
	par.turnLengthBot = 0;
	if (marshPar.botTurn != "нет") par.turnLengthBot = params.M + par.topMarshOffsetZ;
	//П-образная с площадкой
	if (marshPar.botTurn == "площадка" && botMarshId == 3 && params.stairModel == "П-образная с площадкой")
		par.turnLengthBot = params.platformLength_1 + par.topMarshOffsetZ;

	//отступ передней тетивы площадки П-образной лестницы
	if (params.model == "лт") par.frontPltStringerOffset = 68;
	if (params.model == "ко") par.frontPltStringerOffset = params.a1;
	if (!par.topStepDelta) par.topStepDelta = 0;
	return par;
}

function drawTreads() {
	var treadsGroup = new THREE.Object3D();
	var risersGroup = new THREE.Object3D();
	var dxfBasePoint = { x: 0, y: 0, };
	var turnEnd = [];
	var allUnitsPos = {}; //массив позиций всех участков для использования в построении каркаса

	//выбор функции отрисовки забежных ступеней
	var drawWndTreads = drawWndTreadsMetal;
	if (params.calcType == "mono") drawWndTreads = drawWndTreadsMono;
	//if (params.calcType == "console") drawWndTreads = drawWndTreadsMono;
	if (params.calcType == "timber") drawWndTreads = drawWndTreadsTimber;
	if (params.calcType == "timber_stock") drawWndTreads = drawWndTreadsTimber_stock;
	if (params.calcType == "geometry") {
		if (params.staircaseType == "mono") drawWndTreads = drawWndTreadsMono;
		if (params.staircaseType == "timber") drawWndTreads = drawWndTreadsTimber;
		if (params.staircaseType == "timber_stock") drawWndTreads = drawWndTreadsTimber_stock;
	}


	//нижний марш
	var marshId = 1;

	var treadParams1 = {
		marshId: marshId,
		dxfBasePoint: dxfBasePoint,
	};

	var marshObj = drawMarshTreads2(treadParams1)
	var marshTreads = marshObj.treads;
	var marshRisers = marshObj.risers;
	marshTreads.marshId = 1;
	treadsGroup.add(marshTreads);
	risersGroup.add(marshRisers);


	var unitPos = calcMarshEndPoint(marshTreads.position, marshTreads.rotation.y, marshId);
	var lastMarshEnd = copyPoint(unitPos);
	lastMarshEnd.rot = 0;
	var startTreadsParams = marshObj.startTreadsParams;

	dxfBasePoint.x += 2000;

	if (params.stairModel != "Прямая") {

		//задаем функцию отрисовки площадки
		var pltDrawFunction = drawPlatform2;
		if (params.calcType == "timber") {
			pltDrawFunction = drawTimberPlt_G;
			if (params.stairModel == "П-образная с площадкой") pltDrawFunction = drawTimberPlt_P;
		}

		//первый поворот

		//сохраняем позицию и поворот
		allUnitsPos.turn1 = copyPoint(unitPos);
		allUnitsPos.turn1.rot = 0;
		var turnParams = calcTurnParams(1);

		var marshPar1 = getMarshParams(marshId);
		var turnType1 = marshPar1.topTurn;

		if (turnType1 == "площадка") {
			var pltPar = {
				len: params.M + calcTurnParams(marshId).topMarshOffsetX - (params.M - calcTreadLen()) / 2,
				width: calcTreadLen(),
				dxfBasePoint: dxfBasePoint,
				botMarshId: 1,
			}
			//если лотки или рифленая сталь ступень отрисовываем в функции отрисовки рамок drawFrames
			if (params.stairType == "лотки" || params.stairType == "рифленая сталь") {
				if (params.calcType != 'geometry') pltPar.isNotTread = true;
				//добавляем зазор в конце площадки
				if (params.calcType == 'geometry') pltPar.len -= 5;
			}
			if (params.calcType == 'vhod' && params.stairModel == "Г-образная с площадкой" && params.middlePltLength !== params.M) {
				pltPar.len = params.middlePltLength + calcTurnParams(marshId).topMarshOffsetX - (params.M - calcTreadLen()) / 2;
			}
			if (params.stairModel == "П-образная с площадкой") {
				pltPar.width = params.M * 2 + params.marshDist - (params.M - calcTreadLen());
				pltPar.len = params.platformLength_1 + params.nose;
				if (params.model == "лт") pltPar.len -= (params.M - calcTreadLen()) / 2;
				pltPar.isP = true; //является промежуточной площадкой П-образной				
			}
			//коррекция ширины нижней площадки П-образной трехмаршевой с 0 ступеней в среднем марше
			if (params.stairModel == "П-образная трехмаршевая" && params.stairAmt2 == 0) {
				pltPar.plusMarshDist = true;
				pltPar.width += params.marshDist;
				if (params.model == "ко") pltPar.width -= 5;
			}
			if (params.stairModel == 'Прямая с промежуточной площадкой' || params.stairModel == 'Прямая горка') {
				//FIX IT заменить 19 на рассчитанную величину.
				pltPar.len = params.middlePltLength + calcTurnParams(marshId).topStepDelta;
				if (params.stairModel == 'Прямая горка') pltPar.len = params.middlePltLength - 5;
				// pltPar.isP = true;
			}
			//для деревянных из pltPar используются только параметры botMarshId и dxfBasePoint, размеры площадки считаются внутри
			pltPar = pltDrawFunction(pltPar);

			var platform = pltPar.treads;
			var platformRiser = pltPar.risers;
			platform.marshId = 1;
			if (params.stairModel == "П-образная с площадкой") platform.marshId = 2;
			platform.isTurn = true;
			platform.position.x = platformRiser.position.x = unitPos.x;
			platform.position.y = platformRiser.position.y = unitPos.y;
			platform.position.z = platformRiser.position.z = unitPos.z;

			treadsGroup.add(platform);
			risersGroup.add(platformRiser);
			unitPos = calcTurnEndPoint(platform.position, platform.rotation.y, marshId, pltPar.plusMarshDist);
			if (params.calcType == 'vhod' && params.middlePltWidth !== params.M && params.stairModel !== 'Прямая горка') {
				var pltPar = {
					len: (params.middlePltWidth - params.M) - 3,// + calcTurnParams(marshId).topMarshOffsetX - (params.M - calcTreadLen()) / 2,
					width: calcTreadLen(),
					dxfBasePoint: dxfBasePoint,
					botMarshId: 1,
				}
				if (params.stairModel == 'Прямая с промежуточной площадкой') {
					pltPar.width = (params.middlePltWidth - params.M) - 3;
					pltPar.len = params.middlePltLength + calcTurnParams(marshId).topStepDelta;
				}

				pltPar = pltDrawFunction(pltPar);

				var platform = pltPar.treads;
				platform.marshId = 1;
				platform.isTurn = true;
				var platformRiser = pltPar.risers;
				var turnZ = pltPar.width - calcTurnParams(marshId).topMarshOffsetX - params.stringerThickness + 3;
				var unitPosTmp = unitPos;
				if (params.stairModel == 'Г-образная с площадкой') {
					turnZ = pltPar.len - calcTurnParams(marshId).topMarshOffsetX - params.stringerThickness + 3;
				}
				if (params.stairModel == 'Прямая с промежуточной площадкой') {
					unitPosTmp = allUnitsPos.turn1;
					turnZ = pltPar.width + params.stringerThickness + 3 + 3;
				}
				turnZ *= turnFactor;
				platform.position.x = platformRiser.position.x = unitPosTmp.x;
				platform.position.y = platformRiser.position.y = unitPosTmp.y;
				platform.rotation.y = platformRiser.rotation.y = unitPosTmp.rot;
				platform.position.z = platformRiser.position.z = unitPosTmp.z - turnZ;
				treadsGroup.add(platform);
				risersGroup.add(platformRiser);
			}
			dxfBasePoint.x += pltPar.width + 1000;
		}
		if (turnType1 == "забег") {

			var wndPar = {
				turnId: 1,
				botMarshId: 1,
				dxfBasePoint: dxfBasePoint,
			};
			if (params.stairModel == "П-образная трехмаршевая" && params.stairAmt2 == 0) {
				wndPar.plusMarshDist = true; //необходимо учесть зазор между маршами в ширине последней ступени
			}
			if (params.stairModel == "П-образная с забегом") {
				wndPar.plusMarshDist = true;
			}

			//отрисовываем блок забежных ступеней
			var wndObj = drawWndTreads(wndPar);
			var wndTreads = wndObj.treads; //функция в файле drawTreads.js;
			var wndRisers = wndObj.risers;
			if (wndObj.params) wndPar.params = wndObj.params;
			wndTreads.position.x = wndRisers.position.x = unitPos.x;
			wndTreads.position.y = wndRisers.position.y = unitPos.y;
			wndTreads.position.z = wndRisers.position.z = unitPos.z;
			wndTreads.marshId = 1;
			wndTreads.isTurn = true;
			treadsGroup.add(wndTreads);
			risersGroup.add(wndRisers);

			var unitPos = calcTurnEndPoint(wndTreads.position, wndTreads.rotation.y, marshId, wndPar.plusMarshDist, wndPar.turnId);
			dxfBasePoint.x += 6000;
		}

		turnEnd[1] = copyPoint(unitPos);

		//второй марш

		if (params.stairModel == "П-образная трехмаршевая") {
			var marsh2BasePoint = copyPoint(unitPos);
			marshId = 2;

			//сохраняем позицию и поворот
			allUnitsPos.marsh2 = copyPoint(unitPos);
			allUnitsPos.marsh2.rot = unitPos.rot;

			var treadParams2 = {
				marshId: marshId,
				dxfBasePoint: dxfBasePoint,
			};

			var marshObj = drawMarshTreads2(treadParams2)
			var marshTreads = marshObj.treads;
			var marshRisers = marshObj.risers;
			marshTreads.rotation.y = marshRisers.rotation.y = unitPos.rot;
			marshTreads.position.x = marshRisers.position.x = unitPos.x;
			marshTreads.position.y = marshRisers.position.y = unitPos.y;
			marshTreads.position.z = marshRisers.position.z = unitPos.z;
			marshTreads.marshId = 2;
			treadsGroup.add(marshTreads);
			risersGroup.add(marshRisers);

			var unitPos = calcMarshEndPoint(marshTreads.position, marshTreads.rotation.y, marshId);
			dxfBasePoint.x += 2000;
		}

		//второй поворот
		if (params.stairModel == "П-образная трехмаршевая" || params.stairModel == "П-образная с забегом") {
			var marshPar2 = getMarshParams(marshId);
			var turnType2 = marshPar2.topTurn;

			//сохраняем позицию и поворот
			allUnitsPos.turn2 = copyPoint(unitPos);
			allUnitsPos.turn2.rot = unitPos.rot;

			if (turnType2 == "площадка") {
				var pltPar = {
					len: params.M + calcTurnParams(marshId).topMarshOffsetX - (params.M - calcTreadLen()) / 2,
					width: calcTreadLen(),
					dxfBasePoint: dxfBasePoint,
					botMarshId: 2,
				};
				//если лотки или рифленая сталь ступень отрисовываем в функции отрисовки рамок drawFrames
				if (params.stairType == "лотки" || params.stairType == "рифленая сталь") {
					if (params.calcType != 'geometry') pltPar.isNotTread = true;
					//добавляем зазор в конце площадки
					if (params.calcType == 'geometry') pltPar.len -= 5;
				}
				//для деревянных из pltPar используются только параметры botMarshId и dxfBasePoint, размеры площадки считаются внутри
				pltPar = pltDrawFunction(pltPar);

				var platform = pltPar.treads;
				platform.marshId = 2;
				platform.isTurn = true;
				var platformRiser = pltPar.risers;
				platform.rotation.y = platformRiser.rotation.y = unitPos.rot;
				platform.position.x = platformRiser.position.x = unitPos.x;
				platform.position.y = platformRiser.position.y = unitPos.y;
				platform.position.z = platformRiser.position.z = unitPos.z;
				treadsGroup.add(platform);
				risersGroup.add(platformRiser);

				var unitPos = calcTurnEndPoint(platform.position, platform.rotation.y, marshId);

				turnEnd[2] = copyPoint(unitPos);
				dxfBasePoint.x += pltPar.width + 1000;
			}
			if (turnType2 == "забег" || params.stairModel == "П-образная с забегом") {
				var wndPar2 = {
					turnId: 2,
					botMarshId: marshId,
					dxfBasePoint: dxfBasePoint,
				};

				//отрисовываем блок забежных ступеней

				var wndObj = drawWndTreads(wndPar2);
				var wndTreads = wndObj.treads; //функция в файле drawTreads.js;
				var wndRisers = wndObj.risers;
				if (wndObj.params) wndPar2.params = wndObj.params;
				wndTreads.rotation.y = wndRisers.rotation.y = unitPos.rot;
				wndTreads.position.x = wndRisers.position.x = unitPos.x;
				wndTreads.position.y = wndRisers.position.y = unitPos.y;
				if (params.stairModel == "П-образная с забегом") {
					wndTreads.position.y += params.h3;
					wndRisers.position.y += params.h3;
				}
				wndTreads.position.z = wndRisers.position.z = unitPos.z;
				wndTreads.marshId = 2;
				wndTreads.isTurn = true;
				treadsGroup.add(wndTreads);
				risersGroup.add(wndRisers);
				var unitPos = calcTurnEndPoint(wndTreads.position, wndTreads.rotation.y, marshId, false, wndPar2.turnId);
				dxfBasePoint.x += 6000;
			}
		}
		turnEnd[2] = copyPoint(unitPos);
		if (params.stairModel == "П-образная с забегом") turnEnd[1] = copyPoint(unitPos);

		//верхний марш

		marshId = 3;

		//сохраняем позицию и поворот
		allUnitsPos.marsh3 = copyPoint(unitPos);
		allUnitsPos.marsh3.rot = unitPos.rot;

		var treadParams3 = {
			marshId: marshId,
			dxfBasePoint: dxfBasePoint,
		};

		var marshObj = drawMarshTreads2(treadParams3);
		var marshTreads = marshObj.treads;
		var marshRisers = marshObj.risers;
		marshTreads.rotation.y = marshRisers.rotation.y = unitPos.rot;
		marshTreads.position.x = marshRisers.position.x = unitPos.x;
		marshTreads.position.y = marshRisers.position.y = unitPos.y;
		marshTreads.position.z = marshRisers.position.z = unitPos.z;
		marshTreads.marshId = 3;
		treadsGroup.add(marshTreads);
		risersGroup.add(marshRisers);

		lastMarshEnd = calcMarshEndPoint(marshTreads.position, marshTreads.rotation.y, marshId);
		dxfBasePoint.x += 2000;
	}

	//верхняя площадка
	if (params.platformTop == "площадка" || params.platformTop == 'увеличенная') {
		dxfBasePoint = newPoint_xy(dxfBasePoint, 1000, 0);

		if (params.model == "ко" && params.stairAmt3 == 0 && (turnType1 == "забег" || turnType2 == "забег")) {
			if (params.stairModel == "Г-образная с забегом")
				lastMarshEnd.z += params.lastWinderTreadWidth - 55; //55 - номинальная ширина ступени
			else
				lastMarshEnd.x -= (params.lastWinderTreadWidth - 55); //55 - номинальная ширина ступени
		}

		//сохраняем позицию и поворот
		allUnitsPos.topPlt = copyPoint(lastMarshEnd);
		allUnitsPos.topPlt.rot = lastMarshEnd.rot;

		var pltPar = {
			len: params.platformLength_3,
			width: calcTreadLen(),
			dxfBasePoint: dxfBasePoint,
			botMarshId: 3,
		};

		//учитываем наличие задней тетивы верхней площадки + 5мм зазор
		if ((params.model == "лт" || params.calcType == "vhod") && params.platformRearStringer == "есть") {
			pltPar.len -= 8 + 5;
		}

		//если лотки или рифленая сталь ступень отрисовываем в функции отрисовки рамок drawFrames
		if (params.stairType == "лотки" || params.stairType == "рифленая сталь") {
			if (params.calcType != 'geometry') pltPar.isNotTread = true;
			//добавляем зазор в конце площадки
			//if (params.calcType == 'geometry') pltPar.len -= 5;
		}
		if (params.stairModel == "Прямая") pltPar.botMarshId = 1;

		if (params.platformTop == 'увеличенная') {
			pltPar.width = params.platformWidth_3 - (params.M - calcTreadLen());
		}

		pltPar = drawPlatform2(pltPar);
		var platform = pltPar.treads;
		var risers = pltPar.risers;
		platform.rotation.y = risers.rotation.y = lastMarshEnd.rot;
		platform.position.x = risers.position.x = lastMarshEnd.x;
		platform.position.y = risers.position.y = lastMarshEnd.y;
		platform.position.z = risers.position.z = lastMarshEnd.z;
		if (params.platformTop == 'увеличенная') {
			if ((params.stairModel == 'Прямая' || params.stairModel == 'Прямая с промежуточной площадкой') && turnFactor == -1 && (params.stairType == 'дпк')) {
				platform.position.z -= (pltPar.width - params.M) / 2 + (params.M - calcTreadLen()) / 2;
				if (turnFactor == -1) {
					platform.position.z = lastMarshEnd.z
				}
			}
			if (!(params.stairModel == 'Прямая' || params.stairModel == 'Прямая с промежуточной площадкой') && (params.stairModel == 'дпк')) {//Считаем положения
				platform.position.x += (pltPar.width - params.M) / 2 + (params.M - calcTreadLen()) / 2;//-pltPar.len / 2 * turnFactor - params.stringerThickness * 2;
				if (turnFactor == -1) {
					platform.position.x -= (pltPar.width - params.M) / 2 + (params.M - calcTreadLen()) / 2;//-pltPar.len / 2 * turnFactor - params.stringerThickness * 2;
					platform.position.z += 2;
				}
			}
		}
		platform.marshId = 3;
		treadsGroup.add(platform);
		risersGroup.add(risers);

	}

	//рассчитываем точку конца верхнего марша для привязки к перекрытию
	var topStepDelta = calcTurnParams(marshId).topStepDelta;

	if (params.platformTop == "площадка" || params.platformTop == 'увеличенная') topStepDelta = params.platformLength_3;

	lastMarshEnd.x += topStepDelta * Math.cos(lastMarshEnd.rot);
	lastMarshEnd.z += topStepDelta * Math.sin(-lastMarshEnd.rot);


	//формируем возвращаемый объект
	var par = {
		treads: treadsGroup,
		risers: risersGroup,
		turnEnd: turnEnd,
		lastMarshEnd: lastMarshEnd,
		wndPar: wndPar,
		wndPar2: wndPar2,
		unitsPos: allUnitsPos,
		startTreadsParams: startTreadsParams,
	}

	return par;


} //end of drawTreads

drawStaircase = function (viewportId, isVisible) {
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
		add: function (obj, layer) {
			var objInfo = {
				obj: obj,
				layer: layer,
			}
			this.objects.push(objInfo);
		},
	};

	//обнуляем счетчики спецификации
	partsAmt = {};
	partsAmt_bal = { unit: "banister" }
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
		dxfBasePoint: { x: 0, y: -10000 },
	}
	var skirting = drawSkirting_all(skirtingPar).mesh;
	model.add(skirting, "treads");


	/*** РАМКИ ЗАБЕЖНЫХ РАМОК ***/

	if (hasTreadFrames() && (treadsObj.wndPar || treadsObj.wndPar2)) {
		var framesObj = new THREE.Object3D();
		//первый поворот
		var turnId = "turn1";

		var wndFramesPar = {
			wndPar: treadsObj.wndPar,
			dxfBasePoint: { x: 0, y: -3000 },
			turnId: turnId,
		}

		var marshPar1 = getMarshParams(1);
		var turnType1 = marshPar1.topTurn;

		wndFramesPar.marshPar = marshPar1;

		if (turnType1 == "забег") {
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
		if (turnType3 == "забег" && treadsObj.unitsPos[turnId]) {
			var wndFramesPar1 = {
				wndPar: treadsObj.wndPar2,
				dxfBasePoint: { x: 7000, y: -3000 },
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
			if (params.stairModel == "П-образная с забегом") wndFrames.position.y += params.h3;
			framesObj.add(wndFrames)
		}

		model.add(framesObj, "angles");
	}

	/*** КАРКАС НА ВСЕ ЛЕСТНИЦЫ ***/

	var carcasPar = {
		dxfBasePoint: { x: 0, y: 2000 },
		treadsObj: treadsObj,
	}

	//if(treadsObj.wndPar) carcasPar.turnStepsParams = treadsObj.wndPar;
	//if(treadsObj.wndPar2) carcasPar.turnStepsParams = treadsObj.wndPar2;
	if (wndFramesPar) carcasPar.wndFramesHoles = wndFramesPar.wndFramesHoles;
	if (wndFramesPar1) carcasPar.wndFramesHoles1 = wndFramesPar1.wndFramesHoles;

	var carcasObj = drawCarcas(carcasPar);

	model.add(carcasObj.mesh, "carcas");
	model.add(carcasObj.angles, "angles");

	var calcTypeTemp = params.calcType;
	var modelTemp = params.model;
	if (params.calcType == 'console') {
		params.calcType = 'mono';
		params.model = 'сварной';
	}

	/***  ОГРАЖДЕНИЯ НА ВСЕ ЛЕСТНИЦЫ  ***/
	var railingPar = {
		dxfBasePoint: { x: 15000, y: 2000 },
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
		dxfBasePoint: { x: 25000, y: 2000 },
	}

	var handrail = drawSideHandrail_all(sideHandrailPar).mesh;
	model.add(handrail, "handrails");
	//сдвигаем и поворачиваем лестницу чтобы верхний марш был вдоль оси Х
	var moove = calcStaircaseMoove(treadsObj.lastMarshEnd);

	//сохраняем позицию лестницы для позиционирования шкафа
	params.starcasePos = moove;
	params.starcasePos.rot = moove.rot;

	for (var i = 0; i < model.objects.length; i++) {
		var obj = model.objects[i].obj;
		//позиционируем
		obj.position.x += moove.x;
		obj.position.y += moove.y;
		obj.position.z += moove.z;
		obj.rotation.y = moove.rot;
		//смещаем все ступени для лотков
		if (params.stairType == "лотки" && model.objects[i].layer == "treads") {
			obj.position.y += 4;
		}

		//добавляем белые ребра
		if (menu.wireframes) {
			addWareframe(obj, obj);
		}
		//добавляем в сцену
		addObjects(viewportId, obj, model.objects[i].layer);

	}

	//измерение размеров на модели
	addMeasurement(viewportId);

	setTimeout(function () {
		if (typeof staircaseLoaded != 'undefined') staircaseLoaded();
	}, 0);

} //end of drawStair