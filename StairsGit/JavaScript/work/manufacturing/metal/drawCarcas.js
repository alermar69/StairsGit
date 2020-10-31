// Вывод каркаса всей лестницы

function drawCarcas(par){

	par.mesh = new THREE.Object3D();	
	par.angles = new THREE.Object3D();
	var dxfX0 = par.dxfBasePoint.x;

	par.stringerParams = [];

	if (params.calcType == 'console') drawMarshStringers = drawMarshStringersConsole;

	// Каркас нижнего марша
	par.stringerParams[1] = drawMarshStringers(par, 1);	
	par.mesh.add(par.stringerParams[1].mesh);
	par.angles.add(par.stringerParams[1].angles);
	
	// Каркас второго марша

	if (params.stairModel == "П-образная трехмаршевая"){
		
		//костыль для лестницы площадка-забега
		if (params.turnType_1 == "площадка" && params.turnType_2 == "забег") {
			par.wndFramesHoles = par.wndFramesHoles1;
			}
			
		par.dxfBasePoint.x = dxfX0;
		par.dxfBasePoint.y += 3000;
		
		par.stringerParams[2] = drawMarshStringers(par, 2);		
		var stringers2 = par.stringerParams[2].mesh;		
		stringers2.position.x = par.treadsObj.unitsPos.marsh2.x;
		stringers2.position.y = par.treadsObj.unitsPos.marsh2.y;
		stringers2.position.z = par.treadsObj.unitsPos.marsh2.z;	
		stringers2.rotation.y = par.treadsObj.unitsPos.marsh2.rot;	
		par.mesh.add(stringers2)
		
		var angles2 = par.stringerParams[2].angles
		angles2.position.x = par.treadsObj.unitsPos.marsh2.x;
		angles2.position.y = par.treadsObj.unitsPos.marsh2.y;
		angles2.position.z = par.treadsObj.unitsPos.marsh2.z;	
		angles2.rotation.y = par.treadsObj.unitsPos.marsh2.rot;	
		par.angles.add(angles2);
	}
	
	if (params.stairModel == "П-образная с забегом"){
		par.dxfBasePoint.x = dxfX0;
		par.dxfBasePoint.y += 3000;
		
		par.stringerParams[2] = drawMarshStringers(par, 2);

		var stringers2 = par.stringerParams[2].mesh;
 		
		stringers2.position.x += par.treadsObj.unitsPos.turn2.x;
		stringers2.position.y += par.treadsObj.unitsPos.turn2.y;
		stringers2.position.z += par.treadsObj.unitsPos.turn2.z;
		stringers2.rotation.y = par.treadsObj.unitsPos.turn2.rot;
		//костыль
		if(params.model == "лт") stringers2.position.z -= (params.marshDist - 35) * turnFactor;
		if(params.model == "ко") stringers2.position.z -= (params.M + params.marshDist - 35 - params.stringerThickness) * turnFactor;
		par.mesh.add(stringers2)
		
		var angles2 = par.stringerParams[2].angles
		angles2.position.x = stringers2.position.x;
		angles2.position.y = stringers2.position.y;
		angles2.position.z = stringers2.position.z;	
		angles2.rotation.y = stringers2.rotation.y;	
		par.angles.add(angles2);
	}
	
	if (params.stairModel == "П-образная с площадкой" && params.calcType !== 'console'){
		par.dxfBasePoint.x = dxfX0;
		par.dxfBasePoint.y += 3000;
		
		par.stringerParams[2] = drawPlatformStringers(par);			

		var stringers2 = par.stringerParams[2].mesh;		
		stringers2.position.x = par.treadsObj.unitsPos.turn1.x;
		stringers2.position.y = par.treadsObj.unitsPos.turn1.y;
		stringers2.position.z = par.treadsObj.unitsPos.turn1.z;	
		stringers2.rotation.y = - Math.PI / 2 * turnFactor; //костыль, надо поправить в drawTreads
		par.mesh.add(stringers2)
		
		var angles2 = par.stringerParams[2].angles
		angles2.position.x = stringers2.position.x;
		angles2.position.y = stringers2.position.y;
		angles2.position.z = stringers2.position.z;	
		angles2.rotation.y = stringers2.rotation.y;	
		par.angles.add(angles2);
	}	
	
	// Каркас верхнего марша
	if (params.stairModel != "Прямая"){
		par.dxfBasePoint.x = dxfX0;
		par.dxfBasePoint.y += 3000;
		//if (params.stairModel == "П-образная с забегом") {
		//	par.wndFramesHoles = par.wndFramesHoles1;
		//}
		//if (par.wndFramesHoles1) {
		//	par.wndFramesHoles = par.wndFramesHoles1;
		//}

		par.stringerParams[3] = drawMarshStringers(par, 3);
		
		var stringers3 = par.stringerParams[3].mesh;
		stringers3.position.x = par.treadsObj.unitsPos.marsh3.x																																																																																										;
		stringers3.position.y = par.treadsObj.unitsPos.marsh3.y;
		stringers3.position.z = par.treadsObj.unitsPos.marsh3.z;
		stringers3.rotation.y = par.treadsObj.unitsPos.marsh3.rot;		
		par.mesh.add(stringers3)
		
		var angles3 = par.stringerParams[3].angles
		angles3.position.x = par.treadsObj.unitsPos.marsh3.x;
		angles3.position.y = par.treadsObj.unitsPos.marsh3.y;
		angles3.position.z = par.treadsObj.unitsPos.marsh3.z;	
		angles3.rotation.y = par.treadsObj.unitsPos.marsh3.rot;
		par.angles.add(angles3);
	}	

    //Каркас верхней площадки
	if (params.platformTop !== 'нет') {
		par.dxfBasePoint.x = dxfX0;
		par.dxfBasePoint.y += 3000;

		par.stringerParams["topPlt"] = drawTopPlatformStringers(par);

		var stringersTop = par.stringerParams["topPlt"].mesh;
		stringersTop.position.x = par.treadsObj.lastMarshEnd.x;
		stringersTop.position.y = par.treadsObj.lastMarshEnd.y;
		stringersTop.position.z = par.treadsObj.lastMarshEnd.z;
		par.mesh.add(stringersTop);

		var anglesTop = par.stringerParams["topPlt"].angles;
		anglesTop.position.x = stringersTop.position.x;
		anglesTop.position.y = stringersTop.position.y;
		anglesTop.position.z = stringersTop.position.z;
		anglesTop.rotation.y = stringersTop.rotation.y;
		par.angles.add(anglesTop);
	}

	if (params.stairModel == "Прямая горка") {
		var carcasPar = {
			marshId: 0,
			dxfBasePoint: par.dxfBasePoint,
			treadsObj: par.treadsObj,
			marshPar: par.stringerParams[1]
		};
		if (params.M > 1100) carcasPar.isMiddleStringer = true;

		drawSlidePart(carcasPar);
		var mesh = carcasPar.mesh;
		var angles = carcasPar.angles;
		mesh.position.x = par.treadsObj.unitsPos.turn1.x + carcasPar.marshPar.a + params.M / 2 - 5;
		mesh.position.y = par.treadsObj.unitsPos.turn1.y;
		mesh.position.z = par.treadsObj.unitsPos.turn1.z;

		angles.position.x = mesh.position.x;
		angles.position.y = mesh.position.y;
		angles.position.z = mesh.position.z;
		par.mesh.add(mesh);
		par.angles.add(angles);
	}

	//добор верхней площадки
	if (params.pltExtenderSide && params.pltExtenderSide != "нет") {
		var marshId = 3;
		if (params.stairModel == "Прямая") marshId = 1;
		var marshParams = getMarshParams(marshId);

		var extenderParams = {
			width: params.pltExtenderWidth,
			length: params.platformLength_3,
			material: params.materials.metal,
			coverMaterial: params.materials.metal2,
			coverThk: 6,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: { x: 0, y: 0 },
		};

		//если есть ограждение на последнем марше, уменьшаем длину добора
		var isOffsetLen = false;
		if (params.stairModel !== "Г-образная с площадкой") {
			if (params.pltExtenderSide == "слева" && marshParams.hasRailing.in) isOffsetLen = true;
			if (params.pltExtenderSide == "справа" && marshParams.hasRailing.out) isOffsetLen = true;
		}
		else {
			if (params.pltExtenderSide == "справа" && marshParams.hasRailing.in) isOffsetLen = true;
			if (params.pltExtenderSide == "слева" && marshParams.hasRailing.out) isOffsetLen = true;
		}
		if (isOffsetLen) extenderParams.length -= marshParams.b / 2 + 40 / 2 + 5; //40 - ширина стойки

		extenderParams = drawExtender(extenderParams);
		var extender = extenderParams.mesh;
		extender.position.x = par.treadsObj.lastMarshEnd.x - extenderParams.length;
		extender.position.y = par.treadsObj.lastMarshEnd.y;

		extender.position.z = 0;
		if (params.pltExtenderSide == "справа") extender.position.z = params.M / 2 + params.pltExtenderWidth;
		if (params.pltExtenderSide == "слева") extender.position.z = -params.M / 2;

		if (params.stairModel == "Г-образная с площадкой") {
			extender.rotation.y = Math.PI / 2;
			extender.position.z = par.treadsObj.lastMarshEnd.x - extenderParams.length;
			
			extender.position.z = par.treadsObj.lastMarshEnd.z + extenderParams.length * (1 - turnFactor) * 0.5;
			extender.position.x = par.treadsObj.lastMarshEnd.x;
			if (params.pltExtenderSide == "слева") extender.position.x += params.M / 2 + params.pltExtenderWidth;
			if (params.pltExtenderSide == "справа") extender.position.x += -params.M / 2;
		}

		par.mesh.add(extender);

	};

	//верхние фланцы
	if(params.topFlan == "есть"){
		var flansPar = {
			dxfBasePoint: par.dxfBasePoint,
			}	
		var flansGroup = drawTopFixFlans(flansPar).mesh;
		flansGroup.rotation.y = par.treadsObj.lastMarshEnd.rot + Math.PI / 2;
		flansGroup.position.x = par.treadsObj.lastMarshEnd.x;		
		flansGroup.position.y = par.treadsObj.lastMarshEnd.y;
		flansGroup.position.z = par.treadsObj.lastMarshEnd.z;
		par.angles.add(flansGroup);	
		
	}

	
	return par;

} //end of drawCarcas


function drawMiddleStringers(par, marshId){
	var mesh = new THREE.Object3D();
	var angles = new THREE.Object3D();

	var marshParams = getMarshParams(marshId);
	
	var stringerParams = {
		marshId: marshId,
		dxfBasePoint: par.dxfBasePoint,
		turnStepsParams: par.treadsObj.wndPar,
		treadsObj: par.treadsObj,
		wndFramesHoles: par.wndFramesHoles,
		isMiddleStringer: true,
	};
	calcStringerParams(stringerParams);
	
	var sideIn = "right";
	var sideOut = "left";
	if(turnFactor == -1) {
		sideIn = "left";
		sideOut = "right";
	}
	
	var midStringers = [];
	var stringerThickness = params.stringerThickness;
	var treadWidth = params.M - 2 * stringerThickness;
	var midStringerAmt = Math.floor(treadWidth / 1090);
	var midstringerBetweenLen = (treadWidth - stringerThickness * midStringerAmt) / (midStringerAmt + 1);
	if (midStringerAmt > 0) {
		for (i = 1; i <= midStringerAmt; i++) {
			if (i == 1) stringerParams.midStringerFirst = true;
			if (i !== 1) stringerParams.midStringerFirst = false;
			var midStringer = drawStringer(stringerParams).mesh;
			midStringer.position.x = -stringerParams.treadFrontOverHang;
			midStringer.position.z = midstringerBetweenLen * i - params.M / 2 + params.stringerThickness * i;
			midStringers.push(midStringer);
			mesh.add(midStringer);

			//уголки
			var midAngle = drawCarcasAngles(stringerParams.carcasHoles, sideIn);
			midAngle.position.x = midStringer.position.x;
			midAngle.position.z = midStringer.position.z;
			if (sideIn == "left") midAngle.position.z += params.stringerThickness;
			angles.add(midAngle);

			//рамки
			if (hasTreadFrames()) {
				par.dxfBasePoint.x += stringerParams.lenX;
				par.dxfBasePoint.x += 2000;
				var framePar = {
					marshId: marshId,
					holes: stringerParams.carcasHoles,
					dxfBasePoint: par.dxfBasePoint,
				}
				var frames = drawFrames(framePar);
				frames.position.x = -stringerParams.treadFrontOverHang;
				frames.position.z = midStringer.position.z - framePar.length / 2;
				angles.add(frames)
			}

			//длинные болты
			if (drawLongBolts) {
				var boltPar = {
					diam: 10,
					len: 40,
					headType: "шестигр.",
				}
				var longBoltPos = stringerParams.elmIns[stringerParams.key].longBolts;
				for (var j = 0; j < longBoltPos.length; j++) {
					var bolt = drawBolt(boltPar).mesh;
					bolt.rotation.x = Math.PI / 2 * turnFactor;
					bolt.position.x = longBoltPos[j].x;
					if (params.model == "лт") bolt.position.x -= 5;
					bolt.position.y = longBoltPos[j].y;
					bolt.position.z = midAngle.position.z//params.stringerThickness/2;
					mesh.add(bolt);
				}
			}
		}
	}

	// Соединительные фланцы на внешней тетиве

	var franPar = {
		carcasHoles: stringerParams.carcasHoles,
		dxfBasePoint: par.dxfBasePoint,
		skew1: stringerParams.skew1,
		skew2: stringerParams.skew2,
		marshAng: stringerParams.marshAng,
		side: sideOut,
		noBolts: true,
	}
	

	// Отрисовка фланцев 
	var flans = drawStringerFlans_all(franPar);
	if (params.model == "лт") flans.position.x -= 5;
	flans.position.z = params.stringerThickness / 2;
	mesh.add(flans);

	// Отрисовка фланцев 
	var flans = drawStringerFlans_all(franPar);
	if (params.model == "лт") flans.position.x -= 5;
	flans.position.z = -params.stringerThickness / 2 - 8;
	mesh.add(flans);

	
	stringerParams.mesh = mesh;
	stringerParams.angles = angles;
	return stringerParams;
}

// Вывод каркаса одного марша

function drawMarshStringers(par, marshId){
	var mesh = new THREE.Object3D();
	var angles = new THREE.Object3D();

	var marshParams = getMarshParams(marshId);
	
	stringerParams = {
		marshId: marshId,
		dxfBasePoint: par.dxfBasePoint,
		turnStepsParams: par.treadsObj.wndPar,
		treadsObj: par.treadsObj,
		wndFramesHoles: par.wndFramesHoles,
	};
	if (par.wndFramesHoles1) stringerParams.wndFramesHoles1 = par.wndFramesHoles1;
	var useTopWnPar = false;
	if(par.treadsObj.wndPar2){
		if(marshId == 3 && params.stairModel == "П-образная с забегом") useTopWnPar = true;
		if(marshId == 3 && params.stairModel == "П-образная трехмаршевая") useTopWnPar = true;
		if(!par.treadsObj.wndPar) useTopWnPar = true;
		} 
	if(useTopWnPar) stringerParams.turnStepsParams = par.treadsObj.wndPar2;
	calcStringerParams(stringerParams);
	
	//позиция косоуров по Z
	var posZIn = (params.M / 2 - stringerParams.stringerSideOffset) * turnFactor;
	if (turnFactor == 1) posZIn -= params.stringerThickness;
	
	var posZOut = - (params.M / 2 - stringerParams.stringerSideOffset - calcStringerMoove(marshId).stringerOutMoove) * turnFactor;
	if (turnFactor == -1) posZOut -= params.stringerThickness  - 0.01
	
	var sideIn = "right";
	var sideOut = "left";
	if(turnFactor == -1) {
		sideIn = "left";
		sideOut = "right";
		}
	
	//для прямой лестницы все наоборот
	if (params.stairModel == "Прямая"){
		var temp = posZIn;
		posZIn = posZOut;
		posZOut = temp;
		if (params.calcType == 'bolz') posZOut += (params.M - calcTreadLen()) * turnFactor;
		
		temp = sideIn;
		sideIn = sideOut;
		sideOut = temp;		
		}
	
	

//внутренний косоур/тетива
	
	if (params.calcType !== 'bolz') {
		stringerParams.key = "in";
		if (marshId == 3 && params.stairModel == "Прямая горка") stringerParams.key = "out";
		var stringer1 = drawStringer(stringerParams).mesh;
		stringer1.position.x = -stringerParams.treadFrontOverHang;
		stringer1.position.z = posZIn;
		// if (turnFactor == 1) stringer1.position.z -= params.stringerThickness;

		var midStringers = [];

		//костыль
		if (params.stairModel == "П-образная с забегом" && stringerParams.isWndP) {
			if (params.model == "лт") stringer1.position.x += 1;
			if (params.model == "ко") stringer1.position.x += 17;
		}

		mesh.add(stringer1);

		//уголки на внутренней тетиве
		var anglesIn = drawCarcasAngles(stringerParams.carcasHoles, sideIn);
		anglesIn.position.x = stringer1.position.x;
		anglesIn.position.z = stringer1.position.z;
		if (sideIn == "left") anglesIn.position.z += params.stringerThickness;
		angles.add(anglesIn);


		// Соединительные фланцы на внутренней тетиве	
		var franPar = {
			carcasHoles: stringerParams.carcasHoles,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 100, 0),
			skew1: stringerParams.skew1,
			skew2: stringerParams.skew2,
			marshAng: stringerParams.marshAng,
			side: sideIn,
		}

		// Отрисовка фланцев 
		var flans = drawStringerFlans_all(franPar);
		if (params.model == "лт") flans.position.x -= 5;
		flans.position.z = (params.M / 2 - stringerParams.stringerSideOffset - params.stringerThickness * 2)
		if (turnFactor == -1) flans.position.z -= calcStringerMoove(par.marshId).stringerOutMoove
		mesh.add(flans);


		//колонны на внутренней тетиве
		stringerParams.anglesPosZ = anglesIn.position.z;
		stringerParams.dxfBasePoint.x += 2200;
		var columnsIn = drawColumnSide(stringerParams, "in");
		mesh.add(columnsIn);

		//длинные болты

		if (drawLongBolts) {
			var boltPar = {
				diam: 10,
				len: 40,
				headType: "шестигр.",
				nutOffset: -40 + 20 + 12,
				headShim: true,
			}
			var longBoltPos = stringerParams.elmIns[stringerParams.key].longBolts;
			for (var i = 0; i < longBoltPos.length; i++) {
				var bolt = drawBolt(boltPar).mesh;
				bolt.rotation.x = -Math.PI / 2 * turnFactor;
				bolt.position.x = longBoltPos[i].x;
				if (params.model == "лт") bolt.position.x -= 5;
				bolt.position.y = longBoltPos[i].y;
				bolt.position.z = anglesIn.position.z //params.stringerThickness/2;
				mesh.add(bolt);
			}
		}

	}

		//внешний косоур/тетива
		stringerParams.wndFramesHoles = par.wndFramesHoles;

		if (params.calcType !== 'bolz') par.dxfBasePoint.x += stringerParams.lenX;
		stringerParams.dxfBasePoint = par.dxfBasePoint;
		stringerParams.key = "out";
		if (marshId == 3 && params.stairModel == "Прямая горка") stringerParams.key = "in";
		var stringer2 = drawStringer(stringerParams).mesh;
		stringer2.position.x = -stringerParams.treadFrontOverHang;
		stringer2.position.z = posZOut;
		mesh.add(stringer2);

		//уголки на внешней тетиве
		var anglesOut = drawCarcasAngles(stringerParams.carcasHoles, sideOut);
		anglesOut.position.x = -stringerParams.treadFrontOverHang
		anglesOut.position.z = stringer2.position.z;
		if (sideOut == "left") anglesOut.position.z += params.stringerThickness;
		angles.add(anglesOut);


		// Соединительные фланцы на внешней тетиве

		var franPar = {
			carcasHoles: stringerParams.carcasHoles,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 100, 0),
			skew1: stringerParams.skew1,
			skew2: stringerParams.skew2,
			marshAng: stringerParams.marshAng,
			side: sideOut,
		}

		// Отрисовка фланцев
		var flans = drawStringerFlans_all(franPar);
		if (params.model == "лт") flans.position.x -= 5;
		flans.position.z = -(params.M / 2 - stringerParams.stringerSideOffset - params.stringerThickness)
	if (turnFactor == 1) flans.position.z += calcStringerMoove(par.marshId).stringerOutMoove
	if (params.calcType == 'bolz') {
		flans.position.z = posZOut + params.stringerThickness * turnFactor;
		if (params.stairModel == "Прямая") flans.position.z = posZOut - params.stringerThickness * turnFactor;
	}
		mesh.add(flans);


		par.dxfBasePoint.x += stringerParams.lenX;

		//колонны на внешней тетиве
		stringerParams.anglesPosZ = anglesOut.position.z;
		var columnsOut = drawColumnSide(stringerParams, "out");
		mesh.add(columnsOut);

		//длинные болты
		if (drawLongBolts) {
			var boltPar = {
				diam: 10,
				len: 40,
				headType: "шестигр.",
			}
			var longBoltPos = stringerParams.elmIns[stringerParams.key].longBolts;
			for (var i = 0; i < longBoltPos.length; i++) {
				var bolt = drawBolt(boltPar).mesh;
				bolt.rotation.x = Math.PI / 2 * turnFactor;
				bolt.position.x = longBoltPos[i].x;
				if (params.model == "лт") bolt.position.x -= 5;
				bolt.position.y = longBoltPos[i].y;
				bolt.position.z = anglesOut.position.z//params.stringerThickness/2;
				mesh.add(bolt);
			}

		}

		//перемычки
		if (params.model == "лт" && params.stairFrame == "нет" && params.calcType !== 'bolz') {
			par.dxfBasePoint.x += 2000;
			var bridgePar = {
				dxfBasePoint: par.dxfBasePoint,
				hasDoubleTreadAngles: false,
			}
			var key = 'out'
			if (params.stairModel == "Прямая") key = 'in';
			for (i = 0; i < stringerParams.elmIns[key].bridges.length; i++) {
				//перемычки с двойными уголками

				bridgePar.hasDoubleTreadAngles = false;
				bridgePar.rotated = false;
				if (i == stringerParams.elmIns[key].bridges.length - 1 && marshParams.topTurn == "площадка" && !stringerParams.isWndP && stringerParams.topEndLength > 600) {
					bridgePar.hasDoubleTreadAngles = true;
					bridgePar.rotated = true;
				}

				if (i == 0 && params.stairModel == "П-образная с площадкой" && marshId == 3) {
					bridgePar.hasDoubleTreadAngles = true;
				}

				//нет болтов на внутренней стороне
				bridgePar.noBoltsOnBridge = false;
				if (stringerParams.elmIns[key].bridges[i].noBoltsOnBridge) bridgePar.noBoltsOnBridge = true;
				if (marshParams.isMiddleStringer) bridgePar.noBoltsOnBridge1 = true;

				var bridge = drawBridge_2(bridgePar).mesh;
				bridge.rotation.y = -Math.PI / 2;
				bridge.position.x = stringerParams.elmIns[key].bridges[i].x + 60 + params.stringerThickness * 2 - stringerParams.treadFrontOverHang;
				bridge.position.y = stringerParams.elmIns[key].bridges[i].y;
				bridge.position.z = -params.M / 2 + params.stringerThickness;
				//переворачиваем перемычку
				if (bridgePar.rotated) {
					bridge.rotation.y = Math.PI / 2;
					bridge.position.x -= params.stringerThickness;
					bridge.position.z = params.M / 2 - params.stringerThickness;
				}
				angles.add(bridge);
				bridgePar.dxfBasePoint.x += params.M + 200;

				//для входных если есть средняя тетива делаем дополнительную перемычку
				if (marshParams.isMiddleStringer) {
					//нет болтов на внутренней стороне
					bridgePar.noBoltsOnBridge1 = false;
					bridgePar.noBoltsOnBridge2 = true;

					var bridge = drawBridge_2(bridgePar).mesh;
					bridge.rotation.y = -Math.PI / 2;
					bridge.position.x = stringerParams.elmIns[key].bridges[i].x + 60 + params.stringerThickness * 2 - stringerParams.treadFrontOverHang;
					bridge.position.y = stringerParams.elmIns[key].bridges[i].y;
					bridge.position.z = params.stringerThickness / 2;
					//переворачиваем перемычку
					if (bridgePar.rotated) {
						bridge.rotation.y = Math.PI / 2;
						bridge.position.x -= params.stringerThickness;
						bridge.position.z = - params.stringerThickness;
					}
					angles.add(bridge);
					bridgePar.dxfBasePoint.x += params.M + 200;
				}
			}
		}
	
	//отрисовка больцев по внутренней стороне
	if (params.calcType == 'bolz') {
		var bolzs = drawBolzs(stringerParams).mesh;
		var treadLen = calcTreadLen();
		bolzs.position.z = (treadLen / 2 + (params.M - treadLen) / 2) * turnFactor;
		if (params.stairModel == "Прямая")
			bolzs.position.z = (-treadLen / 2 + (params.M - treadLen) / 2) * turnFactor;
		mesh.add(bolzs);

		//перемычки
		if (marshParams.botTurn == "площадка" && params.stairModel !== "П-образная с площадкой") {
			var bridgePar = {
				dxfBasePoint: par.dxfBasePoint,
				hasDoubleTreadAngles: false,
			}
			if (turnFactor == -1) bridgePar.isNotAngel1 = true;
			if (turnFactor == 1) bridgePar.isNotAngel2 = true;

			var bridge = drawBridge_2(bridgePar).mesh;
			bridge.rotation.y = -Math.PI / 2;
			bridge.position.x = 35;
			bridge.position.y = -params.treadThickness;
			bridge.position.z = -params.M / 2 + params.stringerThickness;
			if (turnFactor == -1) bridge.position.z += 55;
			angles.add(bridge);
		}

	}
	
	
	//прямые рамки и ребра лотковых ступеней

	if(hasTreadFrames() && !stringerParams.isWndP){
		par.dxfBasePoint.x += 2000;
		var framePar = {
			holes: stringerParams.carcasHoles,
			dxfBasePoint: par.dxfBasePoint,
			marshId: stringerParams.marshId
			}

		var frames = drawFrames(framePar);

		frames.position.x = -stringerParams.treadFrontOverHang;
		if (params.calcType == 'vhod' || params.calcType == 'veranda') {//Свдигаем к крайнему каркасу для того чтобы не пересечься с средним
			frames.position.z = params.M / 2 - params.stringerThickness - framePar.length / 2;
		}
		angles.add(frames)
	}
		
	
	
	//рамка верхней ступени

	for(var i=0; i<stringerParams.carcasHoles.length; i++){
		if(stringerParams.carcasHoles[i].pos == "topFrame"){
		
			var framePar = {
				holeDist: distance(stringerParams.carcasHoles[i], stringerParams.carcasHoles[i+1]),
				dxfBasePoint: par.dxfBasePoint,
				}
			var topFrame = drawTopFixFrame2(framePar).mesh;
			topFrame.position.x = stringerParams.carcasHoles[i].x - stringerParams.treadFrontOverHang;
			topFrame.position.y = stringerParams.carcasHoles[i].y;
			angles.add(topFrame)
			i++ //пропускаем следующее отверстие
			}
		}


	


// промежуточные косоуры широкого марша
	if (marshParams.isMiddleStringer) {
		var middleStringers = drawMiddleStringers(par, marshId);
		mesh.add(middleStringers.mesh);
		angles.add(middleStringers.angles);
		}

	stringerParams.mesh = mesh;
	stringerParams.angles = angles;
	
	return stringerParams;
}

// каркас верхней площадки
function drawTopPlatformStringers(par) {
	var mesh = new THREE.Object3D();
	var angles = new THREE.Object3D();

	var stringerParams = {
		marshId: 3,
		dxfBasePoint: par.dxfBasePoint,
		treadsObj: par.treadsObj,
		dxfBasePoint: par.dxfBasePoint,
	};
	if (params.stairModel == 'Прямая')
		stringerParams.marshId = 1;
	if (params.stairModel == 'Прямая с промежуточной площадкой')
		stringerParams.marshId = 3;
	

	//задняя тетива верхней площадки
	if ((params.platformTop == "площадка" || params.platformTop == "увеличенная") && params.platformRearStringer == "есть") {

		var rearStringer = drawTopPltStringer(stringerParams).mesh;
		rearStringer.rotation.y = par.treadsObj.lastMarshEnd.rot + Math.PI / 2;
		if (params.platformTop == 'увеличенная') {
			//var deltaZ = params.M - (params.platformWidth_3 - (params.M - calcTreadLen())) - params.stringerThickness;
			//rearStringer.position.z -= deltaZ - params.stringerThickness; //FIX	
			//if (turnFactor == -1) { //TURNFACTOR CHANGED
			//	rearStringer.position.z -= (params.platformWidth_3 - params.M);
			//}
			rearStringer.position.z = -params.stringerThickness;
			if (turnFactor == -1) rearStringer.position.z = 0;

			if (turnFactor == 1) {
				rearStringer.position.z = (params.platformWidth_3 - params.M);
			}
			if (~params.stairModel.indexOf("Г-образная")) {
				if (turnFactor == 1) {
					rearStringer.position.x = - (params.platformWidth_3 - params.M);
					rearStringer.position.z = 0;
				}				
			}
			if (~params.stairModel.indexOf("П-образная")) {
				if (turnFactor == 1) {
					rearStringer.position.z = -(params.platformWidth_3 - params.M);
				}
			}
		}		

		//корректируем позицию по длине площадки
		var offset = params.stringerThickness;
		if (params.model == "ко") offset += params.sideOverHang - 0.01;
		rearStringer.position.x -= offset * Math.cos(par.treadsObj.lastMarshEnd.rot);
		rearStringer.position.z -= offset * Math.sin(-par.treadsObj.lastMarshEnd.rot);

		mesh.add(rearStringer);

		//уголки на задней тетиве/косоуре
		var side = "right";
		var rearAngles = drawCarcasAngles(stringerParams.pointsHole, side);
		rearAngles.rotation.y = rearStringer.rotation.y;
		rearAngles.position.x = rearStringer.position.x;
		rearAngles.position.y = rearStringer.position.y;
		rearAngles.position.z = rearStringer.position.z;
		angles.add(rearAngles);

		//колонны на задней тетиве
		stringerParams.anglesPosZ = 0;
		stringerParams.dxfBasePoint.x += 2000;
		var columnsRear = drawColumnSide(stringerParams, "rear");
		columnsRear.rotation.y = rearStringer.rotation.y;
		columnsRear.position.x = rearStringer.position.x;
		columnsRear.position.y = rearStringer.position.y;
		columnsRear.position.z = rearStringer.position.z;
		mesh.add(columnsRear);
	}

	//каркас увеличенной верхней площадки
	if (params.platformTop == 'увеличенная' && params.platformWidth_3 > params.M) {

		var pltCarcas = drawBigPltCarcas(stringerParams);

		var deltaX = params.platformLength_3 / 2 - (params.M - params.platformLength_3) / 2 + 3;
		var deltaZ = ((params.platformWidth_3 - params.M) + params.M / 2 - params.stringerThickness) * turnFactor;
		if (turnFactor == -1) deltaZ -= params.stringerThickness;
		if (!(params.stairModel == 'Прямая' || params.stairModel == 'Прямая с промежуточной площадкой')) {
			deltaX = (params.platformWidth_3 - params.M) + params.M / 2;
			deltaZ = (-params.M / 2 - 5) * turnFactor
		}
		if (~params.stairModel.indexOf("П-образная")) {
			var deltaX = -(params.platformLength_3 / 2 - (params.M - params.platformLength_3) / 2 + 5);
			var deltaZ = -((params.platformWidth_3 - params.M) + params.M / 2) * turnFactor;
		}
		pltCarcas.mesh.position.x = pltCarcas.angles.position.x = -deltaX;
		pltCarcas.mesh.position.z = pltCarcas.angles.position.z = deltaZ;
		mesh.add(pltCarcas.mesh);
		angles.add(pltCarcas.angles);
	}

	stringerParams.mesh = mesh;
	stringerParams.angles = angles;

	return stringerParams;
}

// Вывод косоуров промежуточной площадки для "П-образная с площадкой"
function drawPlatformStringers(par){
	
	var mesh = new THREE.Object3D();
	var angles = new THREE.Object3D();
	
	var stringerParams = {
		marshId: 1,
		dxfBasePoint: par.dxfBasePoint,
		turnStepsParams: par.turnStepsParams,
		treadsObj: par.treadsObj,
		turnFramesParams: par.turnFramesParams,
		dxfBasePoint: par.dxfBasePoint,
	};

	//передняя тетива/косоур
	if (params.model == "ко" || (params.model == "лт" && !hasTreadFrames())) {

		stringerParams.key = "front";

		var frontStringer = drawPltStringer(stringerParams).mesh;
		frontStringer.position.z = -(calcTurnParams(1).frontPltStringerOffset + params.stringerThickness) * turnFactor;		
		if (turnFactor == -1) frontStringer.position.z -= params.stringerThickness;

		frontStringer.position.y = -params.treadThickness;
		frontStringer.position.x = -params.M * 0.5;
		if (params.model == "лт") frontStringer.position.x += params.stringerThickness;
		if (params.model == "ко") {
			frontStringer.position.x += params.sideOverHang + calcStringerMoove(1).stringerOutMoove;
			if (params.stringerDivision == "нет") frontStringer.position.x += params.stringerThickness
		}
		mesh.add(frontStringer);

		//уголки на передней тетиве/косоуре
		var side = "left";
		if (turnFactor == -1) side = "right";
		var frontAngles = drawCarcasAngles(stringerParams.pointsHole, side);

		frontAngles.position.x = frontStringer.position.x;
		frontAngles.position.y = frontStringer.position.y;
		frontAngles.position.z = frontStringer.position.z;
		if (side == "left") frontAngles.position.z += params.stringerThickness;

		angles.add(frontAngles);

		//длинные болты

		if (drawLongBolts) {
			var boltPar = {
				diam: 10,
				len: 40,
				headType: "шестигр.",
			}
			var longBoltPos = stringerParams.elmIns.front.longBolts;
			for (var i = 0; i < longBoltPos.length; i++) {
				var bolt = drawBolt(boltPar).mesh;
				bolt.rotation.x = Math.PI / 2 * turnFactor;
				bolt.position.x = longBoltPos[i].x + frontStringer.position.x;
				//if(params.model == "лт") bolt.position.x -= 5;
				bolt.position.y = longBoltPos[i].y + frontStringer.position.y;
				bolt.position.z = frontAngles.position.z - params.stringerThickness * turnFactor//params.stringerThickness/2;
				mesh.add(bolt);
			}

		}

	}


	//задняя тетива/косоур
	stringerParams.key = "rear";
	
	var rearStringer = drawPltStringer(stringerParams).mesh;

	rearStringer.position.z = -calcTurnParams(1).turnLengthTop * turnFactor;
	if (params.model == "лт" && params.stairModel == "П-образная с площадкой") {
		rearStringer.position.z -= (params.nose - 20) * turnFactor;
		
	}
	if (params.model == "ко") {
		var stringerOffset = 75 + calcStringerMoove(2).stringerOutMoove;
		if (params.sideOverHang < 75) stringerOffset = params.sideOverHang + calcStringerMoove(2).stringerOutMoove;
		rearStringer.position.z += (stringerOffset - 0.01) * turnFactor;
	}
	if(turnFactor == -1) rearStringer.position.z -= params.stringerThickness;
	
	rearStringer.position.y = 5;
	if (params.model == "ко") rearStringer.position.y = -params.treadThickness;
	rearStringer.position.x = -params.M * 0.5;
	if (params.model == "ко") rearStringer.position.x += params.sideOverHang + calcStringerMoove(1).stringerOutMoove;
	mesh.add(rearStringer);

	//уголки на задней тетиве/косоуре
	var side = "left";
	if(turnFactor == -1) side = "right";
	var rearAngles = drawCarcasAngles(stringerParams.pointsHole, side);
	
	rearAngles.position.x = rearStringer.position.x;
	rearAngles.position.y = rearStringer.position.y;
	rearAngles.position.z = rearStringer.position.z;
	if(side == "left") rearAngles.position.z += params.stringerThickness;
	
	angles.add(rearAngles);	

	//колонны на задней тетиве
	stringerParams.anglesPosZ = rearAngles.position.z;
	stringerParams.dxfBasePoint.x += 2000;
	var columnsRear = drawColumnSide(stringerParams, "rear");
	columnsRear.position.x = rearStringer.position.x;
	mesh.add(columnsRear);

	
	stringerParams.mesh = mesh;
	stringerParams.angles = angles;
	
	return stringerParams;
}

// функция отрисовки колонн на одной стороне марша
function drawColumnSide(par, key){

	var mesh = new THREE.Object3D();
	
//колонны
	
	//рассчитываем параметры колонн

	var profSize = calcColumnSize();
	
	if (params.columnModel != "нет") {
		var colParams = {
			key: key,
			colLength: 1000, //переопределяется в цикле
			profWidth: profSize.profWidth,
			profHeight: profSize.profHeight,
			material: params.materials.metal,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: par.dxfBasePoint,
			text: "",
			}
			
		var stringerLedge = 5; //выступ тетивы над ступенью для лт

		var columnOffsetZ = profSize.profHeight / 2 * turnFactor;
		if (params.model == "ко") var columnOffsetZ = -(profSize.profHeight / 2 + params.stringerThickness) * turnFactor;
		if (key == "in") columnOffsetZ *= -1;
		if (params.stairModel == "Прямая") columnOffsetZ *= -1;
		//if (params.model == "ко" && params.columnFixSide == "изнутри") columnOffsetZ *= -1;
		var columnOffsetX = 5;
		if (params.model == "ко") columnOffsetX = 0;
		if (params.stairModel == "П-образная с площадкой" && par.key == "rear") columnOffsetX = 0;
		var marshPos = 0;		
		if(par.marshId == 2 && !par.isWndP) marshPos = par.treadsObj.unitsPos.marsh2.y;
		if(par.marshId == 3) marshPos = par.treadsObj.unitsPos.marsh3.y;
		
		
		
		//задняя тетива забега П-образной с забегом
		if (par.isWndP) marshPos = par.treadsObj.unitsPos.turn2.y;
		
		//задняя тетива площадки
		if(par.key == "rear"){
			//задняя тетива площадки П-образной с площадкой
			if (par.marshId == 1 && params.stairModel == "П-образная с площадкой") {
				marshPos = par.treadsObj.unitsPos.turn1.y;
				}
			//задняя тетива верхней площадки
			if (par.marshId == 3 || params.stairModel == "Прямая") {
				marshPos = par.treadsObj.lastMarshEnd.y;
				columnOffsetX = 0;
				if(params.stairModel == "Прямая" && turnFactor == -1) columnOffsetZ *= -1;
				if(params.stairModel != "Прямая" && turnFactor == 1) columnOffsetZ *= -1;
				}
		}
		if (key == "front") {
			//задняя тетива верхней площадки
			if (par.marshId == 3 || params.stairModel == "Прямая") {
				marshPos = par.treadsObj.lastMarshEnd.y;
				columnOffsetX = 0;
				if (params.stairModel == "Прямая" && turnFactor == -1) columnOffsetZ *= -1;
				if (params.stairModel != "Прямая" && turnFactor == 1) columnOffsetZ *= -1;
			}
		}
		if (params.stairModel == "П-образная с площадкой") {
			if(par.marshId == 1 && par.key == "rear" && params.stairModel != "Прямая") {
				if (params.model == "лт") marshPos += stringerLedge;
				if (params.model == "ко") marshPos -= params.treadThickness;
			}
		}
		
		//боковая тетива увеличенной верхней площадки
		if(key == "side"){
			marshPos = par.treadsObj.lastMarshEnd.y;
			}
		
		for(var i=0; i<par.carcasHoles.length; i++){
			if(par.carcasHoles[i].isColumnHole){
				colParams.colLength = par.carcasHoles[i].y + marshPos;
				if (params.botFloorType == "черновой") colParams.colLength += params.botFloorsDist;
				colParams = drawColumn2(colParams);
				var col1 = colParams.mesh;
				col1.position.x = par.carcasHoles[i].x + profSize.profWidth / 2 - columnOffsetX;
				col1.position.y = par.carcasHoles[i].y;
				if (par.marshId == 1 && par.key == "rear" && params.stairModel != "Прямая") {
					if (params.model == "лт") col1.position.y += stringerLedge;
					if (params.model == "ко") col1.position.y -= params.treadThickness;
				}
				
				col1.position.z = par.anglesPosZ + columnOffsetZ;

				if (params.model == "ко" && params.columnFixSide == "изнутри") {
					col1.rotation.y += Math.PI;
					col1.position.x -= profSize.profWidth;
					if (key == 'out') col1.position.z += (profSize.profHeight + params.stringerThickness) * turnFactor;
					if (key == 'in') col1.position.z -= (profSize.profHeight + params.stringerThickness) * turnFactor;
				}

				if (key == "front") {
					col1.rotation.y = Math.PI / 2;
					col1.position.z -= (90 - params.stringerThickness) * turnFactor;
					col1.position.x -= 90;
					if (turnFactor == -1) col1.position.z += (profSize.profWidth + params.stringerThickness);
				}
				
				mesh.add(col1);
				i++; //пропускаем следующее отверстие
			}
		}

	}
	
//подкосы

	for(var i=0; i<par.carcasHoles.length; i++){
		var bracePar = {
			width: params.M - params.stringerThickness,
			side: getSide()[key],
		}
		if (params.model == "ко") bracePar.width -= params.sideOverHang;
		
		if(par.carcasHoles[i].isBraceHole){

			if (params.topPltConsolePos == "сзади") {
				if (params.model == "ко")
					bracePar.width = par.keyPoints.topPoint.x - par.carcasHoles[i].x + 53 + params.sideOverHang + params.stringerThickness;
				else
					bracePar.width = par.keyPoints[key].topPoint.x - par.carcasHoles[i].x + 53;
			}
			bracePar = drawBrace(bracePar);
			var brace = bracePar.mesh;
			if (params.topPltConsolePos != "сзади"){
				if(getSide()[key] == "left") brace.rotation.y = Math.PI;
				brace.position.x = par.carcasHoles[i].x;
				if (params.model == "ко") brace.position.x += 5;
				brace.position.y = par.carcasHoles[i].y;
				brace.position.z = par.anglesPosZ;				
				if(getSide()[key] == "right") brace.position.z -= bracePar.width;
				if(getSide()[key] == "left") brace.position.z += bracePar.width;
				}
				
			if (params.topPltConsolePos == "сзади"){
				brace.rotation.y = -Math.PI / 2;
				brace.position.x = par.carcasHoles[i].x + bracePar.width - 53 - 5;
				if (params.model == "ко") brace.position.x += 5;
				brace.position.y = par.carcasHoles[i].y - 30;
				brace.position.z = par.anglesPosZ;
				if(getSide()[key] == "right") brace.position.z -= 57.5;
				if(getSide()[key] == "left") brace.position.z += 57.5;

				}
			mesh.add(brace);
			i += 4;
			}
		}
	
	//колонны наверху входной лестницы без площадки
	if (params.calcType == "vhod" && params.platformTop == "нет" && params.topStepColumns == "есть" && params.columnModel == "40х40"){
		var i = par.carcasHoles.length - 1; //номер отверстия верхнего уголка
		colParams.length = par.carcasHoles[i].y + marshPos - 90;
		if(turnFactor == 1){
			if(key == "in") colParams.dir = "left";
			if(key == "out") colParams.dir = "right";
			}
		if(turnFactor == -1){
			if(key == "in") colParams.dir = "right";
			if(key == "out") colParams.dir = "left";
			}
		
		
		colParams = drawColumnF(colParams);
		var col1 = colParams.mesh;
		col1.position.x = par.carcasHoles[i].x - 5;// - profSize.profWidth / 2// - columnOffsetX;
		//col1.position.y = par.carcasHoles[i].y;
		col1.position.z = par.anglesPosZ;
		//учитываем что колонны ставятся сверху на уголок
		if(colParams.dir == "left") col1.position.z += 8 + 1; //1 добавляется чтобы не было пересечений
		if(colParams.dir == "right") col1.position.z -= 8 + 1;
		// - 8 * turnFactor;
		//if (key == "in") col1.position.z += 8 * 2 * turnFactor;
		mesh.add(col1);
		}

	return mesh;
}


//функция рассчитывает параметры косоуров по номеру марша и стороне и добавляет в исходный объект
function calcStringerParams(par){

	par.stringerSideOffset = 0;
	if (params.model == "ко") par.stringerSideOffset = params.sideOverHang;
	
	// Отступ тетивы вперед ступени
	var treadFrontOverHang = 5; // Отступ тетивы для ЛТ
	par.treadFrontOverHang = 0;
	if (params.model == "лт") par.treadFrontOverHang = treadFrontOverHang;

	
	if (par.marshId == 1){
		// Первый марш
		par.botEndLength = 0;
		par.topEndLength = 0;
		if ((params.stairModel == 'Прямая' || params.stairModel == 'Прямая с промежуточной площадкой') && (params.platformTop == "площадка" || params.platformTop == "увеличенная"))
			par.topEndLength = params.platformLength_3;

	}
	
	if (par.marshId == 3){
		par.is3MarshStringer = true;
		if (params.platformTop == 'увеличенная') {
			par.topEndLength = params.platformLength_3;
		}
	}	
	
	if (par.marshId == 2){
		// Второй марш
		par.is2MarshStringer = true; 

		// второй марш для "П-образной с забегом"
		
		if (params.stairModel == "П-образная с забегом"){
	//		par.marshId = 3;
			par.marshDist = params.marshDist;
			par.isWndP = true; //является задним косоуром П-образной лестницы	
		}
	}
	

	if (params.columnModel != "нет") {
		par.profWidth = 40;
		par.profHeight = 40;
		if (params.columnModel == "100x50") {
			par.profWidth = 100;
			par.profHeight = 50;
		}
		if (params.columnModel == "100x100") {
			par.profWidth = 100;
			par.profHeight = 100;
		}
	}

};

function calcWndParams(){
	
	var par = {};
	
	if (params.M <= 700) {
		par.angleModel = 'У2-40х40х160';
		par.angleLength = 160;		
		}
	else {
		par.angleModel = 'У2-40х40х200';
		par.angleLength = 200;
		}
	
	par.angleHoleDist = par.angleLength - 50; 
	
	return par;

}

function drawStringerHoles(par, typeDop){
	if(menu.simpleMode) return;
	
	var pointsHole = par.pointsHole;
	var stringerShape = par.stringerShape;
	if (typeDop == "top") {
		pointsHole = par.pointsHoleTop;
		stringerShape = par.stringerShapeTop;
	}else
	if (typeDop == "bot") {		
		pointsHole = par.pointsHoleBot;
		stringerShape = par.stringerShapeBot;
	}
	
	for (var i = 0; i < pointsHole.length; i++) {
		var center = pointsHole[i];

		if (!center.noDraw) {
			if (!center.points) {
				var center = pointsHole[i];
				if (!center.rad) center.rad = 6.5
				if ((center.partName == "treadFix" ||
						center.partName == 'wndTreadFix' ||
						center.partName == 'otherTreadFix') &&
					params.stringerModel == 'короб') {
					center = Object.assign({}, center);
					center.y += 18;
				}

				var hole1 = new THREE.Path();
				addCircle(hole1, dxfPrimitivesArr, center, center.rad, par.dxfBasePoint);

				// Определяем тип зенковки, для свг чертежа
				var zenk = 'front';
				if (center.noZenk) zenk = 'no';
				if (center.backZenk) zenk = 'back';
				hole1.drawing = {};
				hole1.drawing.zenk = zenk;

				stringerShape.holes.push(hole1);

				var zencDiam = 20; // диаметр зенковки
				var layer = "comments";
				var trashShape = new THREE.Shape();

				//не зенковать
				if (center.noZenk && params.boltHead == "countersunk") {
					layer = "comments";
					var pz1 = newPoint_xy(center, -zencDiam, zencDiam);
					var pz2 = newPoint_xy(center, zencDiam, -zencDiam);
					addLine(trashShape, dxfPrimitivesArr, pz1, pz2, par.dxfBasePoint, layer);
					pz1 = newPoint_xy(pz1, 0, -zencDiam * 2);
					pz2 = newPoint_xy(pz2, 0, zencDiam * 2);
					addLine(trashShape, dxfPrimitivesArr, pz1, pz2, par.dxfBasePoint, layer);
				}

				//зенковать с обратной стороны
				if (center.backZenk) {
					layer = "comments";
					addRoundHole(trashShape, dxfPrimitivesArr, center, zencDiam, par.dxfBasePoint, layer);
				}

				//сохраняем координаты для вставки длинных болтов (кроме отверстий рутелей)

				if (center.noZenk && center.rad < 7 && !center.noBolts) {
					if (!par.elmIns[par.key].longBolts) par.elmIns[par.key].longBolts = [];
					par.elmIns[par.key].longBolts.push(center);
				}
			}

			if (center.points) {
				var hole = new THREE.Path();

				for (var j = 0; j < center.points.length; j++) {
					var p1 = center.points[j];
					var p2 = center.points[j + 1];
					if (j == center.points.length - 1) p2 = center.points[0];

					addLine(hole, dxfPrimitivesArr, p1, p2, par.dxfBasePoint);
				}

				stringerShape.holes.push(hole);
			}
		}
	}
	
}


// функция возвращает координаты опорных колонн всей лестницы
function calcColumnsPos(isWndP) {
	
	// colPos[marshId][key][end][colId]
	
	//формируем внутреннюю структуру для всех маршей
	//внутри стороны колонны нумеруются следующим образом 6692035.ru/drawings/carcas/columnId.jpg
	var colPos = [];
	for(var i=1; i<=3; i++){
		colPos[i] = {
			in: [],
			out: [],
			rear: [],
			};
		};
	//колонны верхней площадки
	var marshId = 3;
	if (params.stairModel == "Прямая") marshId = 1;
	if (params.platformTop == "площадка" || params.platformTop == "увеличенная") {
		if (params.stairModel != "Прямая") {
			if (params.isColumnTop1) colPos[marshId].rear[1] = true;
			if (params.isColumnTop3) colPos[marshId].rear[2] = true;
			if (params.isColumnTop2) colPos[marshId].out[3] = true;
			if (params.isColumnTop4) colPos[marshId].in[3] = true;
			if (params.platformTop == "увеличенная") {
				if (params.isColumnTop5) colPos[marshId].rear[3] = true;
				//вместо 4-й отрисовывается 6-я. 4-я колонна отрисовывается прямо на боковой тетиве
				colPos[marshId].in[3] = false;
				if (params.isColumnTop6) colPos[marshId].in[3] = true;
			}
		}
		if (params.stairModel == "Прямая") {
			if (params.isColumnTop1) colPos[marshId].rear[2] = true;
			if (params.isColumnTop3) colPos[marshId].rear[1] = true;
			if (params.isColumnTop2) colPos[marshId].in[3] = true;
			if (params.isColumnTop4) colPos[marshId].out[3] = true;
			if (params.platformTop == "увеличенная") {
				if (params.isColumnTop5) colPos[marshId].rear[3] = true;
				//вместо 4-й отрисовывается 6-я. 4-я колонна отрисовывается прямо на боковой тетиве
				colPos[marshId].out[3] = false;
				if (params.isColumnTop6) colPos[marshId].out[3] = true;
			}
		}

	}


	// колонны маршей

	if(params.calcType == "vhod"){
		params.isColumn1 = params.isColumn2 = params.isColumn3 = params.isColumn4 = false;
		if(params.isColumnMiddle1) params.isColumn3 = true;
		if(params.isColumnMiddle2) params.isColumn1 = true;
		if(params.isColumnMiddle3) params.isColumn4 = true;
		if (params.isColumnMiddle4) params.isColumn2 = true;
		if (params.platformTop == "нет" && params.topStepColumns == "есть" && params.columnModel !== "40х40") {
			colPos[marshId].in[3] = true;
			colPos[marshId].out[3] = true;
		}

	}
		
	if (params.stairModel != "Прямая") {
		//передние колонны нижнего поворота
		marshId = 1;
		if (params.isColumn1) colPos[marshId].out[3] = true;
		if (params.isColumn2) colPos[marshId].in[3] = true;

		//колонны средней площадки Прямая с промежуточной площадкой
		if (params.stairModel == "Прямая с промежуточной площадкой") {
			if (params.isColumn3) colPos[marshId]["out"][2] = true;
			if (params.isColumn4) colPos[marshId]["in"][2] = true;
		}
		
		//задние колонны нижнего поворота
		marshId = 3;
		var key = "out";
		if (params.stairModel == "П-образная с площадкой" || params.stairModel == "П-образная с забегом") {
			key = "rear";
			marshId = 1; //заднюю тетиву площадки/забега относим к 1 маршу
			}
		if (params.stairModel == "П-образная трехмаршевая") marshId = 2;
		
		if (params.isColumn3) colPos[marshId][key][1] = true;
		if (params.isColumn4) colPos[marshId][key][2] = true;

		//передние колонны верхнего поворота
		if (params.isColumn5) colPos[2].in[3] = true;
		if (params.isColumn6) colPos[3].out[2] = true;
		
		//задние колонны верхнего поворота 
		var key = "out";
		if (params.stairModel == "П-образная с площадкой" && params.isColumn7){
			colPos[1]["rear"][3] = true; //заднюю тетиву площадки/забега относим к 1 маршу
		}
		
		if (params.stairModel == "П-образная трехмаршевая" || params.stairModel == "П-образная с забегом") {
			if (params.stairModel == "П-образная трехмаршевая" && params.isColumn7) colPos[3][key][1] = true;
			if (params.isColumn8) colPos[2]["out"][3] = true;
		}
		
		if (isWndP) {
			if (params.isColumn3) colPos[2]["out"][1] = true;
			if (params.isColumn4) colPos[2]["out"][2] = true;
			if (params.isColumn7) colPos[2]["out"][3] = true;
		}
		
		//колонны верхней площадки прямой горки
		if (params.stairModel == "Прямая горка"){
			colPos[1]["in"][2] = colPos[1]["out"][2] = colPos[3]["in"][2] = colPos[3]["out"][2] = false;
			if(params.isColumnMiddle1) colPos[1]["in"][3] = true;
			if(params.isColumnMiddle3) colPos[1]["out"][3] = true;
			if(params.isColumnMiddle2) colPos[3]["out"][3] = true;
			if(params.isColumnMiddle4) colPos[3]["in"][3] = true;
		}

		
	}

	return colPos;
}

/** функция возвращает координаты отверстий в тетиве для крепления опорных колонн
*@params: points[] - 4 базовых точки (http://joxi.ru/823bzOdsJPER5m)
*@result: points[] - точки отверстий под колонны //внутри стороны колонны нумеруются следующим образом 6692035.ru/drawings/carcas/columnId.jpg
**/

function calcColumnPosHoles(par) {
	
	var holeDist = 60;
	var frameProfHeight = 60;
	//var frameProfHeight = 40;
	var stringerLedge = 5;
	var colHoleOffset = 20

	//параметры колонн
	var profSize = calcColumnSize();
	
	var basePoints = [
		undefined,						// нулевой колонны нет
		par.keyPoints.botEnd,			// 1 колонна
		par.keyPoints.marshTopStart,	// 2 колонна
		par.keyPoints.marshTopEnd,		// 3 колонна
	];
	if (params.stairModel == "П-образная с площадкой" && par.key == "rear") {
		basePoints[1] = par.keyPoints.end2;
		basePoints[2] = newPoint_xy(par.keyPoints.end1, (par.keyPoints.end2.x - par.keyPoints.end1.x) / 2, 0);
		basePoints[3] =  newPoint_xy(par.keyPoints.end1, - 20, 0);
		//если ширина колонны больше чем зазор между маршами, тогда чтобы средняя колонна непересекалась с тетивами сдвигаем ее
		if (params.model == "лт" && profSize.profWidth > params.marshDist)
			basePoints[2].x += params.marshDist / 2 + params.stringerThickness + 60 + 5 + profSize.profWidth / 2;
	}
	if (params.stairModel == "П-образная с забегом" && par.key == "out" && par.isWndP) {
		basePoints[2] = newPoint_xy(par.keyPoints.botEnd, (par.keyPoints.topEndCol.x - par.keyPoints.botEnd.x) / 2, 10);
		if (params.model == "ко") basePoints[2].y += 30;
		basePoints[3] = par.keyPoints.topEndCol;
	}
	if (par.key == "rear" && par.isTopPlt) {
		basePoints[1] = par.keyPoints.end2;
		basePoints[2] = par.keyPoints.end1;
		if (par.keyPoints.end3) basePoints[3] = par.keyPoints.end3;
	}
	if (par.key == "front" && par.isTopPlt) {
		basePoints[1] = par.keyPoints.end2;
	}
	if (par.botEnd == "platformG" && !(par.key == "rear" && par.isTopPlt)) {
		basePoints[2] = par.keyPoints.botEnd2;
	}
	
	var columnPos = calcColumnsPos(par.isWndP);

	var columnsHoles = [];

	
		// параметры марша
		var marshParams = getMarshParams(par.marshId);
		
		// позиция отверстия относительно базовой точки
	var offsetY = stringerLedge + params.treadThickness + frameProfHeight + colHoleOffset + 5;
		//учитываем что на рифленке высота ребра ступени 50мм
		if(params.stairType == "рифленая сталь") offsetY += 20;
		var holePos = [
			undefined,
			newPoint_xy(basePoints[1], profSize.profWidth / 2 + 60 + 10, -offsetY),
			newPoint_xy(basePoints[2], -(marshParams.b / 2 - 30), -offsetY),
			newPoint_xy(basePoints[3], marshParams.b / 2 + profSize.profWidth / 2, -offsetY),
		];
		//if (par.botEnd == "platformG" || par.botEnd == "platformP") basePoints[2] = newPoint_xy(basePoints[2], - 20, 0);
		if (par.botEnd == "platformG" || par.botEnd == "platformP")
		holePos[2] = newPoint_xy(basePoints[2], -profSize.profWidth / 2 - 60 - 10, -offsetY);
		if (params.model == "ко" && par.botEnd == "platformG" && par.key == "out") {
			holePos[1].y += 20;
			holePos[2].y += 20;
		}
		if (params.model == "ко" && marshParams.topTurn == "площадка" && holePos[3]) {
			//holePos[3].x -= 20;
		}
		if (params.stringerType == "ломаная") {
			if (par.botEnd !== "winder") holePos[2] = newPoint_xy(basePoints[2], - marshParams.b / 2, -offsetY);
			holePos[3] = newPoint_xy(basePoints[3], marshParams.b / 2, -offsetY);
		}
	
		
		// задняя тетива п-образной с площадкой
		if (params.stairModel == "П-образная с площадкой" && par.key == "rear") {
			holePos[2] = newPoint_xy(basePoints[2], 0, -offsetY);
			holePos[3] = newPoint_xy(basePoints[3], -(profSize.profWidth / 2 + 60 + 10), -offsetY);
			if (params.model == "ко") {
				for (j=1; j<=3; j++) {
					holePos[j] = newPoint_xy(holePos[j], 0, 40);
				}
			}
		}
		// внешняя сторона п-образной с забегом
		if (params.stairModel == "П-образная с забегом" && par.isWndP) {
			holePos[2] = newPoint_xy(basePoints[2], 0, marshParams.h - offsetY);
			holePos[3] = newPoint_xy(basePoints[3], -(profSize.profWidth / 2 + 60 + 10 - params.stringerThickness), -offsetY);
			if (params.model == "ко") {
				holePos[2] = newPoint_xy(holePos[2], 0, 40);
				holePos[3] = newPoint_xy(holePos[3], -20, 0);
			}
		}
		// задняя тетива верхней площадки 
		if (par.key == "rear" && par.isTopPlt) {
			var deltaY = 0;
			var deltaX = 0;
			if ((params.stairModel !== 'Прямая' && turnFactor == 1) || (params.stairModel == 'Прямая' && turnFactor == -1) ) {
				holePos[2] = newPoint_xy(holePos[1], deltaX, deltaY);
				holePos[1] = newPoint_xy(basePoints[2], -(profSize.profWidth / 2 + 60 + 10) + deltaX, deltaY - offsetY);
			}
			else {
				holePos[1] = newPoint_xy(holePos[1], deltaX, deltaY);
				holePos[2] = newPoint_xy(basePoints[2], -(profSize.profWidth / 2 + 60 + 10) + deltaX, deltaY - offsetY);
			}
			if (par.keyPoints.end3) holePos[3] = newPoint_xy(basePoints[3], -(profSize.profWidth / 2) + deltaX, - offsetY);
		}

		if (par.botEnd == "winder" && params.model == "лт") {
			//сдвигаем колонну чтобы не было пересечения с забежной рамкой
			if (params.stairFrame == "есть") holePos[2] = newPoint_xy(holePos[2], (260 - marshParams.b) / 2, 0); //260 - подогнано
			//сдвигаем колонну чтобы не было пересечения с перемычкой
			if (params.stairFrame == "нет") holePos[2] = newPoint_xy(holePos[2], - marshParams.b, -marshParams.h);

			//удлиннение внутренней тетивы/косоура под забегом
			var longStringerTop = false;
			//удлиннение тетивы
			if (par.key == "out") {
				if (marshParams.prevMarshId == 1 && params.inStringerElongationTurn1 == "да") longStringerTop = true;
				if (marshParams.prevMarshId == 2 && params.inStringerElongationTurn2 == "да") longStringerTop = true;

				if (longStringerTop && holePos[2]) holePos[2].x -= 50;
			}			
		};
		
		//if (params.stairType == "дпк" && holePos[3]) {
		if (params.calcType == 'vhod' && holePos[3]) {
			holePos[3].x += marshParams.a - marshParams.b / 2 - marshParams.b + 5;
			if (params.stringerType == "ломаная") holePos[3].x += profSize.profWidth / 2;
		}

		if (params.stairModel == "Прямая с промежуточной площадкой" && par.marshId == 1) {
			//holePos[2] = newPoint_xy(holePos[3], marshParams.b + params.middlePltLength - 100, marshParams.h);
			holePos[2] = newPoint_xy(par.keyPoints.platformEnd, - 100, - offsetY);

		}
		
		//сдвигаем колонны чтобы они не пересекались со стойками ограждений. 

	if (params.model == "ко" && par.railingHoles) {
			for(var j=1; j<4; j++){
				for(var k=0; k < par.railingHoles.length; k++){
					if (holePos[j] && !par.railingHoles[k].noDraw){
						var holesDist = Math.abs(holePos[j].x - par.railingHoles[k].x)
						if (holesDist < (profSize.profWidth / 2 + 20 + 5)) { //20 - половина ширины стойки ограждения, 5 - зазор между стойкой и колонной
							var mooveX = (profSize.profWidth / 2 + 25) - holesDist;
							if(holePos[j].x < par.railingHoles[k].x) mooveX *= -1;
							holePos[j] = newPoint_x1(holePos[j], mooveX, marshParams.ang)
						}
					}
				}
			}
		}

		var stringerPar = calcStringerPar({ marshId: par.marshId, key: par.key});
			
		// добавляем отверстия в конечный массив
		for (var k=1; k<=3; k++) {		// k - номер колонны в марше
			if (columnPos[par.marshId][par.key]) {
				if (columnPos[par.marshId][par.key][k] && holePos[k]) {
					var colHole1 = holePos[k];
					var colHole2 = newPoint_xy(colHole1, 0, -holeDist);
					colHole2.isColumnHole = colHole1.isColumnHole = true;
					if (params.model == "ко") colHole2.backZenk = colHole1.backZenk = true;
					if (params.model == "ко" && params.columnFixSide == "изнутри") {
						colHole2.backZenk = colHole1.backZenk = false;
					}
					colHole2.hasAngle = colHole1.hasAngle = false;
                    //if ((k == 1 || k == 2) && par.botEnd == "platformG" && (stringerPar.stringerDivision || stringerPar.stringerDivisionBot))
                    if ((k == 1 || k == 2) && par.botEnd == "platformG" && stringerPar.stringerDivisionBot)
						colHole2.place = colHole1.place = "bot";		// в массти для отверстий в нижней части тетивы (pointsHoleBot) должны попасть только отвертия для 1 и 2 колонн
					columnsHoles.push(colHole1);
					columnsHoles.push(colHole2);
				}
			}
		}

	

	
	//колонны под серединой марша на прямой лестнице
	if(params.stairModel == "Прямая"){
		var hasMidColumn = false;
		if(par.key == "in"){
			if(turnFactor == 1 && params.isColumn1) hasMidColumn = true;
			if(turnFactor == -1 && params.isColumn2) hasMidColumn = true;
			}
		if(par.key == "out"){
			if(turnFactor == 1 && params.isColumn2) hasMidColumn = true;
			if(turnFactor == -1 && params.isColumn1) hasMidColumn = true;
			}
		
		if(hasMidColumn){
			var stepId = Math.floor(params.stairAmt1 / 2);
			var divide = ltko_set_divide(par.marshId).divide;
			if (stepId == divide) stepId -= 1;
			var rackPos = setRackPos(1);
			if (rackPos.includes(stepId)) stepId -= 1;
			var colHole1 = {
				x: params.b1 * (stepId - 0.5),
				y: params.h1 * (stepId - 1),
			}
			
			if (params.stairType == "дпк") colHole1.x += params.a1 - params.b1 / 2 - params.b1 + profSize.profWidth / 2 + 5;
			var colHole2 = newPoint_xy(colHole1, 0, -holeDist);
			colHole2.isColumnHole = colHole1.isColumnHole = true;
			colHole2.backZenk = colHole1.backZenk = true;
			colHole2.hasAngle = colHole1.hasAngle = false;
			columnsHoles.push(colHole1);
			columnsHoles.push(colHole2);
			}
		}

	return columnsHoles; 
}

/** функция возврящает размеры опорных колонн
* @result: profWidth - ширина профиля колонны
* @result: profHeight - высота профиля колонны
**/

function calcColumnSize(){
	
	var profWidth = 40;
	var profHeight = 40;
		
	if (params.columnModel == "100x50") {
		profWidth = 100;
		profHeight = 50;
		}
	if (params.columnModel == "100x100") {
		profWidth = 100;
		profHeight = 100;
		}
		
	var profSize = {
		profWidth: profWidth,
		profHeight: profHeight,
	}
	
	return profSize;
}

//функция рассчитывает смещение наружного косоура по номеру марша
function calcStringerMoove(marshId) {

	var par = {
		stringerOutMoove: 0,
		stringerOutMooveNext: 0,
		stringerOutMoovePrev: 0,
	};
	if (params.model == "ко" || params.calcType == 'console') {
		if (params.stairModel == 'Прямая') {
			par.stringerOutMoove = params.stringerMoove_1;
		}
		else {
			if (marshId == 1) {
				par.stringerOutMoove = params.stringerMoove_1;
				par.stringerOutMooveNext = params.stringerMoove_3;
				if (~params.stairModel.indexOf("П-образная")) par.stringerOutMooveNext = params.stringerMoove_2;
			}
			if (marshId == 2) {
				par.stringerOutMoove = params.stringerMoove_2;
				par.stringerOutMoovePrev = params.stringerMoove_1;
				par.stringerOutMooveNext = params.stringerMoove_3;
			}
			if (marshId == 3) {
				par.stringerOutMoove = params.stringerMoove_3;
				par.stringerOutMoovePrev = params.stringerMoove_1;
				if (~params.stairModel.indexOf("П-образная")) par.stringerOutMoovePrev = params.stringerMoove_2;
			}
		}
	}
	return par;
};


/** функция рисует отверстия по нижней кромке косоура для крепления профиля для обшивки лестницы гипсокартоном
**/
function drawStringerBotHoles(par, typeDop) {

	if(par.marshParams.stairAmt < 1 && par.marshParams.marshId != 2) return; 
	
	if (params.model == "ко" && params.stringerBotHoles == 'есть') {

		//Определяем точки косоура по которым будут определяться отверстия
		if (typeDop) {
			var points = [];
			
			if (typeDop == 'bot' && par.pointsShapeBot && par.pointsShapeBot.length > 0) {
				var points = [par.pointsShapeBot[1], par.pointsShapeBot[0]];
			}

			if (typeDop == 'top' && par.pointsShapeTop && par.pointsShapeTop.length > 0) {
				var points = [par.pointsShapeTop[0], par.pointsShapeTop[3]];
			}
		}
		if (!typeDop) {
			var arrBot = [];
			var arrTop = [];
			var flagBot = true;
			var flagTop = false;
			for (var i = 0; i < par.pointsShape.length; i++) {
				if (flagBot) {
					arrBot.push(par.pointsShape[i]);
					if (par.botPoint.x == par.pointsShape[i].x && par.botPoint.y == par.pointsShape[i].y)
						flagBot = false;
				}

				if (flagTop) arrTop.push(par.pointsShape[i]);

				if (!flagBot && !flagTop) {
					if (par.topPoint.x == par.pointsShape[i].x && par.topPoint.y == par.pointsShape[i].y)
						flagTop = true;
				}

			}

			arrBot.reverse();
			arrTop.reverse();
			var points = arrBot.concat(arrTop);

			//если есть разделение тетивы, добавляем эту точку
			if (par.divideP2) {
				var points1 = [];
				var flag = true;
				for (var i = 0; i < points.length; i++) {
					if (par.divideP2.x < points[i].x && flag) {
						var pt = copyPoint(par.divideP2);
						pt.isDivide = true;
						points1.push(pt);
						flag = false;
					}
					points1.push(points[i]);
				}
				points = points1;
			}
		}
		
		var offsetSide = 50;
		var offsetBot = 20;
		for (var i = 0; i < points.length; i++) {
			if (points[i + 1]) {
				//Определяем центры отверстий
				var p1 = points[i];
				var p2 = points[i + 1];
				var ang = calcAngleX1(p1, p2);
				var len = distance(p1, p2);

				if (len > 100) {
					var centers = [];

					var pt = polar(p1, ang, offsetSide);
					if (p1.isDivide || par.isDivideTop) pt = polar(pt, ang, 50);
					var center1 = polar(pt, ang + Math.PI / 2, offsetBot);
					if (p1.division) center1.division = p1.division;
					centers.push(center1);

					var pt = polar(p2, ang, -offsetSide);
					if (p2.isDivide || par.isDivideBot) pt = polar(pt, ang, -150);
					var center2 = polar(pt, ang + Math.PI / 2, offsetBot);
					if (p2.division) center2.division = p2.division;
					centers.push(center2);

					if (len > 800) {
						var count = Math.floor(len / 800);
						var distHoles = len / (count + 1);

						var center = copyPoint(center1);
						for (var j = 0; j < count; j++) {
							center = polar(center, ang, distHoles);
							if (p2.division) center.division = p2.division;
							centers.push(center);
						}
					}

					//добавляем отверстия
					for (var j = 0; j < centers.length; j++) {
						var hole = new THREE.Path();
						addCircle(hole, dxfPrimitivesArr, centers[j], 4, par.dxfBasePoint);
						if (typeDop) {
							if (typeDop == 'bot') par.stringerShapeBot.holes.push(hole);
							if (typeDop == 'top') par.stringerShapeTop.holes.push(hole);
						}
						else {
							par.stringerShape.holes.push(hole);
						}

					}
				}
			}
		}
	}	
}

