/**
функция оболочка, создающая столбы для лестнциы
* @param treadsObj Объект ступеней
* @param stringerParams параметры каркаса
* @param dxfBasePoint Базовая точка для dxf

* @returns {THREE.Mesh} mesh1 - меш первой стороны
* @returns {THREE.Mesh} mesh2 - меш второй стороны
* @returns {THREE.Mesh} mesh3 - меш третьей стороны
* @returns {THREE.Mesh} mesh4 - меш четвертой стороны
*/
function drawNewells_2(par) {
	var newell = new THREE.Object3D();
	var newel2 = new THREE.Object3D();
	var newel3 = new THREE.Object3D();
	var newel4 = new THREE.Object3D();
	calcStringerPar(par);
	
	//столб нижнего марша

	if (params.stairModel !== 'Прямая') {
		var botMarshId = 1;
		var topMarshId = getMarshParams(botMarshId).nextMarshId;
		var botStringerParams = par.stringerParams[botMarshId];
		var turnParams = calcTurnParams(botMarshId);
		var isP = false; //Параметр отвечает за п-образную с площадкой и забегом
		if (params.stairModel == 'П-образная с площадкой' || params.stairModel == 'П-образная с забегом') isP = true; //Нужна для правильной отрисовки на п-образных не трехмаршевых лестницах
		var pos = newPoint_xyz(par.treadsObj.unitsPos.turn1, turnParams.newellPosX, -botStringerParams.h, params.M + turnParams.newellPosZ);
		if (params.stairModel == 'П-образная с площадкой') {
			pos = newPoint_xyz(par.treadsObj.unitsPos.turn1, -params.M / 2 + turnParams.newellPosX / 2 + 0.01, -botStringerParams.h, params.M / 2 + turnParams.newellPosZ);
			if (params.model == 'косоуры' || params.model == 'тетива+косоур') {
				// pos = newPoint_xyz(par.treadsObj.unitsPos.turn1, -params.platformLength_1 / 2 + turnParams.topStepDelta + turnParams.newellPosX  + 0.01, -botStringerParams.h, params.M / 2 + turnParams.newellPosZ);
				// pos.x -= 50;//fixit;
				// console.log(turnParams)
				pos = newPoint_xyz(par.treadsObj.unitsPos.turn1, -params.M / 2 + turnParams.newellPosX, -botStringerParams.h, params.M / 2 + turnParams.newellPosZ);
				pos.x -= 30;//fixit;
			}
		}
		if (params.stairModel == 'П-образная с забегом') {
			pos = newPoint_xyz(par.treadsObj.unitsPos.turn1, -params.M / 2 + turnParams.newellPosX, -botStringerParams.h, params.M / 2 + turnParams.newellPosZ);
		}
		if (params.stairModel == 'П-образная трехмаршевая') {
			pos = newPoint_xyz(par.treadsObj.unitsPos.turn1, turnParams.newellPosX - params.M / 2, -botStringerParams.h, params.M / 2 + turnParams.newellPosZ);
		}
		if (turnFactor == -1 && params.stairModel == 'П-образная с площадкой') {
			// pos.x -= par.slotsOffset + par.newellSlotDepth;
		}
		pos.z *= turnFactor; // Учитываем поворот
		var newellPar = {
			turnType: par.stringerParams[botMarshId].topTurn,
			dxfBasePoint: {
				x: -2000,
				y: 0
			},
			isP: isP,
			newellId: 1, //par.marshId,
			hasRailing: getMarshParams(botMarshId).hasRailing.in,
			botMarshId: botMarshId,
			botStringerHeight: par.stringerParams[botMarshId].params.in.endHeightTop,
			topStringerHeight: par.stringerParams[topMarshId].params.in.endHeightBot,
			treadsObj: par.treadsObj,
			railingObj: par.railingObj,
			stringerParams: par.stringerParams,
			pos: pos, //грани столба позиционируются внутри
		}
		if (par.treadsObj.wndPar) {
			newellPar.turnStepsParams = par.treadsObj.wndPar.params
		}
		drawTurnNewell(newellPar);
		newell.add(newellPar.mesh0);
		newel2.add(newellPar.mesh1);
		newel3.add(newellPar.mesh2);
		newel4.add(newellPar.mesh3);
	}

	if (params.stairModel == 'П-образная трехмаршевая') {

		var botMarshId = 2;
		var topMarshId = getMarshParams(botMarshId).nextMarshId;
		var botStringerParams = par.stringerParams[botMarshId];
		var turnParams = calcTurnParams(botMarshId);

		var pos = newPoint_xyz(par.treadsObj.unitsPos.turn2,
				-params.M - turnParams.newellPosZ,
			-botStringerParams.h,
			turnFactor * (turnParams.newellPosX));
			// + 0.01
		var newellPar = {
			turnType: par.stringerParams[botMarshId].topTurn,
			dxfBasePoint: {
				x: -2000,
				y: 2000
			},
			isP: isP,
			newellId: 2, //par.marshId,
			hasRailing: getMarshParams(botMarshId).hasRailing.in,
			botMarshId: botMarshId,
			botStringerHeight: par.stringerParams[botMarshId].params.in.endHeightTop,
			topStringerHeight: par.stringerParams[topMarshId].params.in.endHeightBot,
			treadsObj: par.treadsObj,
			railingObj: par.railingObj,
			stringerParams: par.stringerParams,
			pos: pos, //грани столба позиционируются внутри
		}
		if (par.treadsObj.wndPar2) {
			newellPar.turnStepsParams = par.treadsObj.wndPar2.params;
		}
		drawTurnNewell(newellPar);
		newell.add(newellPar.mesh0);
		newel2.add(newellPar.mesh1);
		newel3.add(newellPar.mesh2);
		newel4.add(newellPar.mesh3);
	}

	if (params.stairModel == 'П-образная с площадкой' || params.stairModel == 'П-образная с забегом') {
		var botMarshId = 2;
		var isP = true; //Параметр отвечает за п-образную с площадкой и забегом
		var turnParams = calcTurnParams(botMarshId);
		var topMarshId = botMarshId;
		var botStringerParams = par.stringerParams[botMarshId];

		var pos = newPoint_xyz(par.treadsObj.unitsPos.marsh3, -params.M / 2 + turnParams.newellPosZ / 2, -botStringerParams.h, -params.M / 2 + turnParams.newellPosX); // -turnParams.newellPosX / 2 - params.M / 2, -botStringerParams.h, -params.M / 2 - turnParams.newellPosZ);

		if (params.stairModel == 'П-образная с забегом') {
			pos = newPoint_xyz(par.treadsObj.unitsPos.turn2, -params.M - turnParams.newellPosZ, -botStringerParams.h, turnParams.newellPosX);
			if (turnFactor == -1) {
				pos.z = params.M / 2 + params.marshDist + params.rackSize / 2;//params.M + turnParams.newellPosX;
				if (params.model == 'тетивы') {
					pos.z = params.M / 2 + params.marshDist + (params.rackSize - params.stringerThickness) / 2 - (params.rackSize / 2 - params.stringerThickness) - 0.01;
				}
			}
		}
		if ((params.model == 'косоуры' || params.model == 'тетива+косоур') && params.stairModel == 'П-образная с площадкой') {
			// pos = newPoint_xyz(par.treadsObj.unitsPos.marsh3, -params.platformLength_1 / 2 + turnParams.newellPosX, -botStringerParams.h, -params.M / 2 + turnParams.newellPosX); // -turnParams.newellPosX / 2 - params.M / 2, -botStringerParams.h, -params.M / 2 - turnParams.newellPosZ);
			// pos.x -= 50;//fixit;
			pos = newPoint_xyz(par.treadsObj.unitsPos.marsh3, -params.M / 2 + turnParams.newellPosX - params.nose + 0.01, -botStringerParams.h, -params.M / 2 + turnParams.newellPosZ + params.rackSize);
			pos.x -= 30;//fixit;
		}
		if (params.model == 'тетивы' && params.stairModel == 'П-образная с площадкой') {
			pos.y = par.treadsObj.unitsPos.marsh3.y;
		}
		if (turnFactor == -1 && params.stairModel == 'П-образная с площадкой') {
			// pos.x -= par.slotsOffset + par.newellSlotDepth;
			pos.z = params.M / 2 + params.marshDist + params.rackSize / 2;//params.M + turnParams.newellPosX;
			if (params.model == 'тетивы') {
				pos.z = params.M / 2 + params.marshDist + params.stringerThickness / 2;
			}
		}

		// if (params.model == 'косоуры' || params.model == 'тетива+косоур' && params.stairModel !== 'П-образная с забегом') {
		// 	pos.x +=  21.2;//FIX IT
		// }
		// if (params.model == 'косоуры' && params.stairModel == 'П-образная с забегом') {
		// 	pos.x -=  21.2;//FIX IT
		// }
		pos.z *= turnFactor; // Учитываем поворот

		var newellPar = {
			turnType: par.stringerParams[botMarshId].topTurn,
			dxfBasePoint: {
				x: -2000,
				y: 2000
			},
			isP: isP,
			newellId: 2, //par.marshId,
			hasRailing: getMarshParams(botMarshId).hasRailing.in,
			botMarshId: botMarshId,
			botStringerHeight: par.stringerParams[botMarshId].params.in.endHeightBot,
			topStringerHeight: par.stringerParams[3].params.in.endHeightBot,
			treadsObj: par.treadsObj,
			railingObj: par.railingObj,
			stringerParams: par.stringerParams,
			pos: pos, //грани столба позиционируются внутри
		}

		if (par.treadsObj.wndPar2 || par.treadsObj.wndPar) {
			newellPar.turnStepsParams = par.treadsObj.wndPar2 ? par.treadsObj.wndPar2.params : par.treadsObj.wndPar.params
		}
		drawTurnNewell(newellPar);
		newell.add(newellPar.mesh0);
		newel2.add(newellPar.mesh1);
		newel3.add(newellPar.mesh2);
		newel4.add(newellPar.mesh3);
	}

	return {
		mesh1: newell,
		mesh2: newel2,
		mesh3: newel3,
		mesh4: newel4
	};
}

/**
функция оболочка, собирающая из 4 граней поворотный столб
*@param botMarshId - ИД нижнего марша
*@param treadsObj - Объект ступеней
*@param stringerParams - параметры каркаса
*@param dxfBasePoint - Базовая точка для dxf
*@param newellId - ид столба
*@param isP - определяет п-образная ли лестница (п-образная трехмаршевая не учитывается)
*@param botStringerHeight - высота нижнего каркаса
*@param topStringerHeight - высота верхнего каркаса
*@param pos - используется для позиционирования столба

*@returns {THREE.Mesh} par.mesh0 - меш первой стороны
*@returns {THREE.Mesh} par.mesh1 - меш второй стороны
*@returns {THREE.Mesh} par.mesh2 - меш третьей стороны
*@returns {THREE.Mesh} par.mesh3 - меш четвертой стороны
*/
function drawTurnNewell(par) {

	par.mesh0 = new THREE.Object3D();
	par.mesh1 = new THREE.Object3D();
	par.mesh2 = new THREE.Object3D();
	par.mesh3 = new THREE.Object3D();
	// return par
	var marshPar = getMarshParams(par.botMarshId); //функция в файле inputsReading.js
	var turnPar = calcTurnParams(par.botMarshId); //функция в файле drawCarcasParts.js

	if (getMarshParams(marshPar.nextMarshId).stairAmt == 1) turnPar.stringerBotOffset -= 20;//Не разобрался откуда 20 в calcTurnParams

	par.turnType = marshPar.topTurn;

	//Заполняем переменные, которые пусты при отсутствии ступеней
	if (marshPar.stairAmt == 0) {
		par.botStringerHeight = 0;
		par.botStringerOffset = 0;
		if (typeof par.stringerParams[par.botMarshId].params.in.endHeightTop == 'undefined') {
			par.stringerParams[par.botMarshId].params.in.endHeightTop = 0;
		}
		if (typeof par.stringerParams[par.botMarshId].params.in.endHeightBot == 'undefined') {
			par.stringerParams[par.botMarshId].params.in.endHeightBot = 0;
		}
	}
	par.h_bot = marshPar.h;
	par.h_top = getMarshParams(marshPar.nextMarshId).h;
	par.height = par.h_bot + par.h_top + 100;
	par.height -= 30;

	if (params.model == 'косоуры' || params.model == 'тетива+косоур'){
		if (par.turnType == "забег") par.height = par.botStringerHeight + 50 + params.treadThickness + par.h_bot + par.h_top * 3 + 20;// += par.h_top * 2;
		if ((params.stairModel == 'П-образная с площадкой' || params.stairModel == 'П-образная с забегом') && par.newellId == 1) par.height -= par.h_top;
		if (params.stairModel == 'П-образная с забегом' && par.newellId == 1 && getMarshParams(1).hasRailing.in) par.height -= par.h_top * 2 + 55;
		if (params.stairModel == 'П-образная с площадкой' && par.newellId == 2) par.height = -par.h_bot - 120;
		if (params.stairModel == 'П-образная с забегом' && par.newellId == 2) par.height = par.h_bot + par.h_top * 4 + params.treadThickness + 70;
		if (marshPar.stairAmt == 0 && par.newellId == 1 && params.stairModel == 'П-образная с забегом') par.height = par.h_bot + par.h_top * 2 + 20;//par.h_bot- 20;//;//par.h_bot + (par.h_top - par.h_bot);//par.h_bot;
	}
	if (params.model == 'тетивы') {
		if (par.turnType == "забег") par.height += par.h_top * 2 + 30;
		if ((params.stairModel == 'П-образная с площадкой' || params.stairModel == 'П-образная с забегом') && par.newellId == 1) par.height -= par.h_top;
		if ((params.stairModel == 'П-образная с площадкой' || params.stairModel == 'П-образная с забегом') && par.newellId == 2){
			par.height += par.topStringerHeight - par.h_top - 10;
			if (params.stairModel == 'П-образная с забегом') {
				par.height += par.h_top * 2;
			}
		}
	}
	if (params.stairModel == 'П-образная с площадкой' && par.newellId == 2) par.height = par.h_bot + par.h_top * 2;
	// if (params.stairModel == 'П-образная с площадкой' && par.newellId == 1 && params.model == 'тетивы') par.height -= 30;
	// if (params.stairModel == 'П-образная с площадкой' && par.newellId == 2 && params.model == 'тетивы') par.height -= 30;
	// if (params.stairModel == 'П-образная с забегом' && par.newellId == 2 && params.model == 'тетивы') par.height -= 30;


	//учитываем выступение тетивы верхнего марша вверх
	// if (marshPar.stairAmt > 0 && !((params.stairModel == 'П-образная с площадкой' || params.stairModel == 'П-образная с забегом') && par.newellId == 2)) {
	if (marshPar.stairAmt > 0 && !((params.stairModel == 'П-образная с площадкой' || params.stairModel == 'П-образная с забегом') && par.newellId == 2) && par.turnType !== "забег") {
		// if (marshPar.stairAmt == 0 && par.newellId == 1 && params.stairModel == 'П-образная с забегом'){
		par.height += (par.botStringerHeight - turnPar.stringerTopOffset);
		if (params.model == "тетивы" && params.stairModel !== 'П-образная с площадкой') par.height += (par.topStringerHeight - turnPar.stringerBotOffset);
	}

	par.hasRailing = marshPar.hasRailing.in;
	// if (par.isP && par.turnType == 'площадка' && par.newellId == 1) par.height -= 190;
	// if (par.isP && par.turnType == 'площадка' && params.model == 'косоуры') par.height += 100;
	// if (par.isP && par.turnType == 'площадка' && params.model == 'тетива+косоур') par.height += 100;
	// if (par.isP && par.turnType == 'забег' && params.model == 'косоуры' && par.newellId == 1) par.height = par.h_top;
	// if (par.isP && par.turnType == 'забег' && params.model == 'косоуры' && par.newellId == 1 && marshPar.stairAmt == 1) par.height = par.h_bot + par.h_top;
	// if (par.turnType == 'забег' && par.newellId == 2) par.height += 200;
	if ((marshPar.topTurn == 'забег' || par.marshId == 3 && marshPar.botTurn == 'забег') && params.model == 'тетивы') {
		par.height = 0;
		if (par.newellId == 1) {
			par.height = getMarshParams(marshPar.nextMarshId).h * 2 + 10 + par.stringerParams[par.botMarshId].params.in.endHeightTop + par.stringerParams[marshPar.nextMarshId].params.in.endHeightBot + 30 + 20;
			if (!getMarshParams(marshPar.nextMarshId).hasRailing.in && getMarshParams(par.botMarshId).hasRailing.in) {
				par.height = par.stringerParams[par.botMarshId].params.in.endHeightTop + 80 + 20;
			}
		}
		if (par.newellId == 1 && params.stairModel == 'П-образная с забегом') {
			par.height = 52 + par.stringerParams[par.botMarshId].params.in.endHeightTop + 30 + 20;
			if (!getMarshParams(par.botMarshId).hasRailing.in) {
				par.height += getMarshParams(marshPar.nextMarshId).h * 2;
			}
		}
		if (par.newellId == 2) {
			par.height = getMarshParams(marshPar.nextMarshId).h * 2 + 10 + par.stringerParams[par.botMarshId].params.in.endHeightTop + par.stringerParams[marshPar.nextMarshId].params.in.endHeightBot + 30 + 20;//10 подогнано, 30 высота выреза в косоуре под столб, 20 отступ от косоура
		}
		if (par.newellId == 2 && params.stairModel == 'П-образная с забегом') {
			par.height = getMarshParams(marshPar.nextMarshId).h * 3 + 10 + par.stringerParams[marshPar.nextMarshId].params.in.endHeightBot + 30 + 20;//10 подогнано, 30 высота выреза в косоуре под столб, 20 отступ от косоура
		}
	}
	
	if ((marshPar.topTurn == 'площадка' || par.marshId == 3 && marshPar.botTurn == 'площадка') && params.model == 'тетивы') {
		par.height = 0;
		if (par.newellId == 1) {
			par.height = 10 + par.stringerParams[par.botMarshId].params.in.endHeightTop + par.stringerParams[marshPar.nextMarshId].params.in.endHeightBot + 30 + 20;
			if (!getMarshParams(marshPar.nextMarshId).hasRailing.in && getMarshParams(par.botMarshId).hasRailing.in || (params.stairModel == 'П-образная с площадкой' && !marshPar.hasRailing.in)) {
				par.height = par.stringerParams[par.botMarshId].params.in.endHeightTop + 80 + 20;
			}
		}
		// if (par.newellId == 1 && params.stairModel == 'П-образная с забегом') {
		// 	par.height = 52 + par.stringerParams[1].params.in.endHeightTop + 30 + 20;
		// 	if (!getMarshParams(1).hasRailing.in) {
		// 		par.height += getMarshParams(3).h * 2;
		// 	}
		// }
		if (par.newellId == 2) {
			par.height = 10 + par.stringerParams[par.botMarshId].params.in.endHeightTop + par.stringerParams[marshPar.nextMarshId].params.in.endHeightBot + 30 + 20;//10 подогнано, 30 высота выреза в косоуре под столб, 20 отступ от косоура
		}
		if (par.newellId == 2 && params.stairModel == 'П-образная с площадкой') {
			par.height = 10 + par.stringerParams[marshPar.nextMarshId].params.in.endHeightBot + 30 + 20;//10 подогнано, 30 высота выреза в косоуре под столб, 20 отступ от косоура
		}
	}

	//учитываем забег

	//верх косоура/тетивы нижнего марша
	var botStringerTopY = par.height - 50 - par.botStringerHeight;

	//базовая точка - плоскость последней ступени нижнего марша (расстояние от низа столба)
	var posY = par.height - botStringerTopY - turnPar.stringerTopOffset;
	par.posY = posY;
	par.floorDist = par.pos.y - par.posY;

	//Рассчитываем точки для ступеней и каркаса
	par.botStringerOffset = botStringerTopY;
	par.firstTreadOffset = par.botStringerOffset + turnPar.stringerTopOffset - par.h_bot;
	if (par.turnType == "забег") par.firstTreadOffset -= par.h_top;
	par.topStringerOffset = par.firstTreadOffset - par.h_top + turnPar.stringerBotOffset - par.topStringerHeight;
	if (par.turnType == "забег") par.topStringerOffset -= par.h_top;

	//Если par.stringerParams[par.botMarshId].params.in.endHeightTop = 0 то косоур отсутствует
	if (marshPar.stairAmt == 0 && params.model == 'тетивы' && par.newellId == 1 && par.stringerParams[par.botMarshId].params.in.endHeightTop !== 0) {
		par.botStringerOffset -= 110;
		par.firstTreadOffset -= 110;
		par.topStringerOffset -= 110;
		par.pos.y -= 110;
	}
	if (marshPar.stairAmt == 0 && (params.model == 'косоуры' || params.model == 'тетива+косоур') && par.newellId == 1) {
		par.botStringerOffset += 90;
		par.firstTreadOffset += 90;
		par.topStringerOffset += 90;
		par.pos.y += 90;
	}
	if (marshPar.stairAmt == 1 && (params.model == 'косоуры' || params.model == 'тетива+косоур') && par.newellId == 1) {
		par.height += par.floorDist;
		par.pos.y -= par.floorDist;

		// par.botStringerOffset -= par.floorDist;
		// par.firstTreadOffset -= par.floorDist;
		// par.topStringerOffset -= par.floorDist;
		// par.pos.y -= par.floorDist;
	}

	//Переменная позволяет поворачивать столб 'Аккуратно'
	var turnDelta = 0;
	if (params.stairModel == 'П-образная трехмаршевая' && par.newellId == 2) {
		turnDelta = 3;
	}
	if (par.floorDist < 0) par.floorDist = 0;
	//грань, в которую приходит тетива/косоур нижнего марша
	par.side = calcSide(1, turnDelta);
	par.firstSide = par.side;
	par.dxfBasePoint.x -= 2000;
	par.dxfBasePoint.x += 3000 * (par.newellId - 1);

	drawNewellSide(par);
	par.mesh.rotation.y = -Math.PI / 2;
	par.mesh.position.x = par.pos.x + params.stringerSlotsDepth - params.rackSize / 2;
	par.mesh.position.y = par.pos.y - posY;
	par.mesh.position.z = par.pos.z - params.rackSize / 2 * turnFactor;

	par.mesh0.add(par.mesh);

	//внутрення грань на нижнем марше
	par.side = calcSide(2, turnDelta);
	par.dxfBasePoint.x -= 500 * turnFactor;
	drawNewellSide(par);
	par.mesh.rotation.y = Math.PI;
	par.mesh.position.x = par.pos.x - params.rackSize / 2;
	par.mesh.position.y = par.pos.y - posY;
	par.mesh.position.z = par.pos.z + (params.stringerSlotsDepth - params.rackSize / 2) * turnFactor;
	if (turnFactor == -1) {
		par.mesh.rotation.y = 0;
	}
	par.mesh1.add(par.mesh);

	//внутрення грань на верхнем марше
	par.side = calcSide(3, turnDelta);
	par.dxfBasePoint.x -= 500 * turnFactor;
	drawNewellSide(par);
	par.mesh.rotation.y = Math.PI / 2;
	par.mesh.position.x = par.pos.x + params.rackSize - params.rackSize / 2 - params.stringerSlotsDepth;
	par.mesh.position.y = par.pos.y - posY;
	par.mesh.position.z = par.pos.z - params.rackSize / 2 * turnFactor;

	par.mesh2.add(par.mesh);

	//грань, в которую приходит тетива/косоур верхнего марша
	par.side = calcSide(4, turnDelta); //4 + turnDelta;
	par.dxfBasePoint.x -= 500 * turnFactor;
	drawNewellSide(par);

	par.mesh.rotation.y = 0 //Math.PI;
	par.mesh.position.x = par.pos.x + params.rackSize / 2;
	par.mesh.position.y = par.pos.y - posY;
	par.mesh.position.z = par.pos.z + (params.rackSize - params.rackSize / 2 - params.stringerSlotsDepth) * turnFactor;
	if (turnFactor == -1) {
		par.mesh.rotation.y = Math.PI;
		//par.mesh.position.z = par.pos.z - params.rackSize - params.rackSize / 2 + params.stringerSlotsDepth;
	}

	par.mesh3.add(par.mesh);
	
	//верхняя крышка
	var capDelta = 15;
	if(params.newellTopType == "пирамидка" || params.newellTopType == "плоское"){
		var capSize = params.rackSize;
		var capThk = 0.01;
		var platePar = {
			len: capSize,
			width: capSize,
			thk: capThk,
			dxfArr: dxfPrimitivesArr0,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, par.fullHeight + 50),
			text: "",
			material: params.materials.timber,
		}
		var cap = drawPlate(platePar).mesh;
		cap.position.x = par.pos.x + params.rackSize / 2;
		cap.position.y = par.pos.y - posY;
		cap.position.z = par.pos.z + (params.rackSize - params.rackSize / 2 - params.stringerSlotsDepth) * turnFactor;
		cap.rotation.x = Math.PI/2;
		cap.position.x += -params.rackSize;
		cap.position.y += par.fullHeight + capThk;
		if (turnFactor == 1) {
			cap.position.z += -params.rackSize + params.stringerSlotsDepth;
		}
		if (turnFactor == -1) {
			cap.position.z -= params.stringerSlotsDepth;//-params.rackSize;// + params.stringerSlotsDepth;
		}
		par.mesh3.add(cap);
	}
	if(params.newellTopType !== "пирамидка" && params.newellTopType !== "плоское"){
		var capSize = params.rackSize + capDelta;
		var capThk = 20;
		var platePar = {
			len: capSize,
			width: capSize,
			thk: capThk,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, -(capSize - params.rackSize)/2, par.fullHeight + 50),
			text: "",
			material: params.materials.timber,
		}
		var cap = drawPlate(platePar).mesh;
		
		cap.position.x = par.pos.x + params.rackSize / 2;
		cap.position.y = par.pos.y - posY;
		cap.position.z = par.pos.z + (params.rackSize - params.rackSize / 2 - params.stringerSlotsDepth) * turnFactor;
		cap.rotation.x = Math.PI/2;
		cap.position.y += par.fullHeight + capThk;
		cap.position.x += -params.rackSize - capDelta / 2;
		cap.position.z += -params.rackSize + capDelta / 2;
		if (turnFactor == -1) cap.position.z += params.rackSize - capDelta * 2;
		
		par.mesh3.add(cap);
	}
	//шар
	if(params.newellTopType == "шар"){
		var ballPar = {
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, params.rackSize / 2, par.fullHeight + 200),
			material: params.materials.timber,
		}
	
		var ball = drawLatheBall(ballPar).mesh;
		
		ball.position.x = par.pos.x + params.rackSize / 2;
		ball.position.y = par.pos.y - posY;
		ball.position.z = par.pos.z + (params.rackSize - params.rackSize / 2 - params.stringerSlotsDepth) * turnFactor;
		
		ball.position.y += par.fullHeight + capThk;
		ball.position.x += -params.rackSize/2;
		ball.position.z += (-params.rackSize/2 + capDelta) * turnFactor;
		if (!testingMode) {
			par.mesh3.add(ball);
		}
	}
	
	//сохраняем данные для спецификации

	var partName = "turnNewell";
	if (typeof specObj != 'undefined'){
		if (!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Поворотный столб",
				area: 0,
				paintedArea: 0,
				metalPaint: false,
				timberPaint: true,
				division: "timber",
				workUnitName: "area", //единица измерения
				group: "newells",
			}
		}

		var name = "L=" + Math.round(par.height)
		var area = params.rackSize * 4 * par.height / 1000000;

		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		specObj[partName]["paintedArea"] += area * 2;
	}
	par.mesh0.specId = partName + name;
	par.mesh1.specId = partName + name;
	par.mesh2.specId = partName + name;
	par.mesh3.specId = partName + name;

	return par;
}

/**
Функция позволяет поворачивать стороны столба без изменения позиций
Получается это с помощью изменения ид сторон
*@param side - исходная сторона
*@param turnDelta - на сколько едениц её нужно повернуть

*@returns {number} side - сторона столба с учетом поворота
*/
function calcSide(side, turnDelta) {
	side = Math.abs(side + turnDelta);
	if (side > 4) side -= 4;
	return side
}

/**
Функция отрисовывает стороны столба
*@param получает par который хранит в себе treadsObj, stringerParams и параметры марша

*@returns {THREE.Mesh} par.mesh - меш стороны
*/
function drawNewellSide(par) {

	par.marshId = par.botMarshId;
	calcStringerPar(par);
	par.mesh = new THREE.Object3D();
	var mat = params.materials.newell; // Материал
	// if (par.side == 1) mat = new THREE.MeshLambertMaterial({color: 'rgb(255,0,255)'});//purple
	// if (par.side == 2) mat = new THREE.MeshLambertMaterial({color: 'rgb(255,0,0)'});//red
	// if (par.side == 3) mat = new THREE.MeshLambertMaterial({color: 'rgb(0,255,0)'});//green
	// if (par.side == 4) mat = new THREE.MeshLambertMaterial({color: 'rgb(0,0,255)'});//blue

	par.sideFactor = -1; //к-т отвечающий за правильное расположение проектции в dxf
	if (par.firstSide == par.side) par.sideFactor = 1

	par.turnPar = calcTurnParams(par.botMarshId); //Параметры поворота функция в файле drawCarcasParts.js

	var extrudeOptions = {
		amount: params.stringerSlotsDepth - 0.05,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	// Выводим тип каркаса в переменную
	par.stringerType = "косоур";
	if (params.model == "тетива+косоур") par.stringerType = "косоур";
	if (params.model == "тетивы") par.stringerType = "тетива";
	var marshParams = getMarshParams(par.botMarshId);
	// Считаем дополнительную длинну столба(в случае с ограждениями удлинняем)
	var additionalLength = 0;
	var hasRailing = marshParams.hasRailing.in;
	if (!hasRailing) {
		hasRailing = getMarshParams(marshParams.nextMarshId).hasRailing.in;
	}
	if (par.newellId == 1 && (params.stairModel == 'П-образная с площадкой' || params.stairModel == 'П-образная с забегом')) hasRailing = getMarshParams(1).hasRailing.in;
	if (par.newellId == 2 && (params.stairModel == 'П-образная с площадкой' || params.stairModel == 'П-образная с забегом')) {
		hasRailing = getMarshParams(3).hasRailing.in;
	}
	
	// console.log(marshParams, par)
	// console.log(par.railingObj.handrailParams)
	
	if (par.stringerType == 'тетива') {
		// if (params.stairModel == 'П-образная с площадкой' && par.newellId == 2){
		// 	// additionalLength = -par.firstTreadOffset + 20;
		// 	// if (!hasRailing) {
		// 	// 	additionalLength += marshParams.h + 120;//100 высота тетивы + 20 осттуп
		// 	// }
		// 	// if (hasRailing) {
		// 	// 	additionalLength += par.railingObj.handrailParams[3].in.handrailPos.y - marshParams.h;
		// 	//  }
		// 	 if (hasRailing && (params.stairModel == 'П-образная с площадкой') && par.newellId == 2) additionalLength += marshParams.h * 3;
		// }
		// if (params.stairModel == 'П-образная с площадкой' && hasRailing && par.newellId == 1) {
		// 	// additionalLength += par.railingObj.handrailParams[1].in.handrailEndPos.y - par.pos.y - marshParams.h;
		// }
		if (hasRailing) {
			if (params.stairModel == 'П-образная с забегом') {
				if (par.newellId == 1) {
					var handrailCutLen = par.railingObj.handrailParams[1].in.handrailCutLen || 80;
					additionalLength += 800 + handrailCutLen;
				}
				if (par.newellId == 2) {
					var handrailCutLen = par.railingObj.handrailParams[3].in.handrailCutLen || 80;
					additionalLength += 800 + handrailCutLen;
				}
			}else{
				additionalLength += 850 + 20;
				if (marshParams.topTurn == 'забег' && !getMarshParams(marshParams.nextMarshId).hasRailing.in) {
					var handrailCutLen = par.railingObj.handrailParams[1].in.handrailCutLen;
					additionalLength = 800 + handrailCutLen;
				}
			}
		}
	}
	if (par.stringerType == 'косоур' && hasRailing) {
		if(par.railingObj.handrailParams[marshParams.nextMarshId].in && getMarshParams(marshParams.nextMarshId)){
			additionalLength = par.railingObj.handrailParams[marshParams.nextMarshId].in.handrailHeight
			// additionalLength = 795 + par.railingObj.handrailParams[marshParams.nextMarshId].in.handrailCutLen;//par.railingObj.handrailParams[3].in.handrailPos.y - par.railingObj.handrailParams[3].in.handrailCutLen - params.h3 / 2;
			
			if (params.timberBalTopEnd == 'квадрат') additionalLength += 10 / Math.cos(par.railingObj.handrailParams[marshParams.nextMarshId].in.handrailAngle);
		}else{
			if (getMarshParams(par.botMarshId).topTurn == 'забег') {
				additionalLength = par.railingObj.handrailParams[par.marshId].in.handrailEndPos.y - par.pos.y - par.h_bot - par.h_top * 3;
			}else if (getMarshParams(par.botMarshId).topTurn == 'площадка') {
				additionalLength = par.railingObj.handrailParams[par.marshId].in.handrailEndPos.y - par.pos.y - par.h_bot - par.h_top;				
			}else{
				additionalLength = 300; //костыль
			}
		}
		if (params.stairModel == 'П-образная с площадкой' && par.newellId == 2) additionalLength = getMarshParams(2).h + 795;
	}

	//Контур столба
	var p1 = {
		x: 0,
		y: 0
	};

	var p2 = newPoint_xy(p1, 0, par.height + additionalLength);
	var p3 = newPoint_xy(p2, params.rackSize, 0);
	var p4 = newPoint_xy(p1, params.rackSize, 0);
	var points = [p1, p2, p3, p4];
	if (par.newellId == 1 && params.isColumn2 || par.newellId == 2 && params.isColumn5) {
		var p5 = newPoint_xy(p4, 0, -par.floorDist);
		var p6 = newPoint_xy(p1, 0, -par.floorDist);
		points.push(p5,p6)
	}

	//Вспомогательные точки для позиционирования отверстий
	par.basePoint1 = {
		x: 0,
		y: 0
	};
	par.basePoint2 = newPoint_xy(par.basePoint1, 0, par.height);
	par.basePoint3 = newPoint_xy(par.basePoint2, params.rackSize, 0);
	par.basePoint4 = newPoint_xy(par.basePoint1, params.rackSize, 0);
	
	par.fullHeight = par.height + additionalLength;
	
	var shapeHoles = []; // Массив отверстий

	if (par.isP) shapeHoles = calcPSideHoles(par);
	if (!par.isP) shapeHoles = calcStandardSideHoles(par);

	if (testingMode) {
		//Делаем вырезы для ступеней, для корректного прохождения тестов
		var h_delta = par.h_bot;
		if (par.turnType == 'площадка') {
			if (par.isP) {
				// var holeShapePar = {
				// 	basePoint: newPoint_xy(par.basePoint2, 0, -par.h_bot - par.firstTreadOffset - params.treadThickness),
				// 	holeWidth: params.rackSize,
				// 	holeHeight: params.treadThickness,
				// 	sideFactor: par.sideFactor,
				// 	dxfBasePoint: par.dxfBasePoint
				// };
				// if (par.newellId == 2) {
				// 	holeShapePar.basePoint.y += par.h_bot + par.h_top;
				// }
				//
				// var holeShape = drawHoleShape(holeShapePar);
				// shapeHoles.push(holeShape); //Добавляем в массив точек
			}
			for (var i = -1; i < 2; i++) {
				if (i == 0) {
					h_delta = par.h_top;
				}
				var holeShapePar = {
					basePoint: newPoint_xy(par.basePoint2, 0, -par.firstTreadOffset - params.treadThickness + h_delta * i - 0.025),
					holeWidth: params.stringerSlotsDepth + 0.05,
					holeHeight: params.treadThickness + 0.05,
					sideFactor: par.sideFactor,
					dxfBasePoint: par.dxfBasePoint
				};

				var holeShape = drawHoleShape(holeShapePar);
				shapeHoles.push(holeShape); //Добавляем в массив точек

				holeShapePar.basePoint = newPoint_xy(par.basePoint3, -params.stringerSlotsDepth - 0.01, -par.firstTreadOffset - params.treadThickness + h_delta * i);
				var holeShape2 = drawHoleShape(holeShapePar);
				shapeHoles.push(holeShape2); //Добавляем в массив точек
			}
		}
		if (par.turnType == 'забег') {
			var holeShapePar = {
				basePoint: newPoint_xy(par.basePoint2, 0, -par.firstTreadOffset - params.treadThickness - par.h_bot - par.h_top),
				holeWidth: params.stringerSlotsDepth + 0.01,
				holeHeight: params.treadThickness,
				sideFactor: par.sideFactor,
				dxfBasePoint: par.dxfBasePoint
			};

			var holeShape = drawHoleShape(holeShapePar);
			shapeHoles.push(holeShape); //Добавляем в массив точек

			holeShapePar.basePoint = newPoint_xy(par.basePoint3, -params.stringerSlotsDepth - 0.01, -par.firstTreadOffset - params.treadThickness  - par.h_bot - par.h_top);
			var holeShape2 = drawHoleShape(holeShapePar);
			shapeHoles.push(holeShape2); //Добавляем в массив точек
			var cycleEnd = 3;
			if (params.stairModel == "П-образная с забегом" && par.newellId == 2) {
				cycleEnd = 4;
			}
			for (var i = -1; i < cycleEnd; i++) {
				if (i == -1) {
					h_delta = par.h_top;
				}

				var holeShapePar = {
					basePoint: newPoint_xy(par.basePoint2, 0, -par.firstTreadOffset - params.treadThickness + h_delta * i),
					holeWidth: params.stringerSlotsDepth + 0.01,
					holeHeight: params.treadThickness,
					sideFactor: par.sideFactor,
					dxfBasePoint: par.dxfBasePoint
				};

				if (par.side == 4 && i == 1 && params.riserType == 'есть') {
						holeShapePar = {
							basePoint: newPoint_xy(holeShapePar.basePoint, 0, -0.015),
							holeWidth: params.riserThickness, //Ширина отверстия
							holeHeight: par.h_top + 0.03, //Высота отверстия
							sideFactor: par.sideFactor, //к-т отвечающий за правильное расположение проекции(см.начало функции)
							dxfBasePoint: par.dxfBasePoint //базовая точка dxf
						};

						var holeShape = drawHoleShape(holeShapePar);
						shapeHoles.push(holeShape); //Добавляем в массив точек
				}

				if (par.side == 4 && i == 0 && params.riserType == 'есть') {
						holeShapePar = {
							basePoint: newPoint_xy(holeShapePar.basePoint, 0, 0),
							holeWidth: params.riserThickness, //Ширина отверстия
							holeHeight: par.h_top, //Высота отверстия
							sideFactor: par.sideFactor, //к-т отвечающий за правильное расположение проекции(см.начало функции)
							dxfBasePoint: par.dxfBasePoint //базовая точка dxf
						};

						var holeShape = drawHoleShape(holeShapePar);
						shapeHoles.push(holeShape); //Добавляем в массив точек
				}

				if (par.side == 1 && i == 2 && params.riserType == 'есть') {
						holeShapePar = {
							basePoint: newPoint_xy(holeShapePar.basePoint, 0, 0),
							holeWidth: params.riserThickness, //Ширина отверстия
							holeHeight: par.h_top, //Высота отверстия
							sideFactor: par.sideFactor, //к-т отвечающий за правильное расположение проекции(см.начало функции)
							dxfBasePoint: par.dxfBasePoint //базовая точка dxf
						};

						var holeShape = drawHoleShape(holeShapePar);
						shapeHoles.push(holeShape); //Добавляем в массив точек
				}

				if (par.side == 3 && i == -1 && params.riserType == 'есть') {
						holeShapePar = {
							basePoint: newPoint_xy(holeShapePar.basePoint, 0, -0.015),
							holeWidth: params.riserThickness, //Ширина отверстия
							holeHeight: par.h_top + 0.03, //Высота отверстия
							sideFactor: par.sideFactor, //к-т отвечающий за правильное расположение проекции(см.начало функции)
							dxfBasePoint: par.dxfBasePoint //базовая точка dxf
						};

						var holeShape = drawHoleShape(holeShapePar);
						shapeHoles.push(holeShape); //Добавляем в массив точек
				}

				var holeShape = drawHoleShape(holeShapePar);
				shapeHoles.push(holeShape); //Добавляем в массив точек

				holeShapePar.basePoint = newPoint_xy(par.basePoint3, -params.stringerSlotsDepth - 0.01, -par.firstTreadOffset - params.treadThickness + h_delta * i);
				var holeShape2 = drawHoleShape(holeShapePar);
				shapeHoles.push(holeShape2); //Добавляем в массив точек
			}
		}
	}

	// Учитываем поворот и сторону столба
	for (var i = 0; i < points.length; i++) {
		points[i].x = points[i].x * turnFactor * par.sideFactor;
	}
	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		//markPoints: true, //пометить точки в dxf для отладки
	}
	var shape = drawShapeByPoints2(shapePar).shape;
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.rotateUV(Math.PI / 2);

	for (var i = 0; i < shapeHoles.length; i++) {
		//преобразуем шейп отверстия в геометрию
		var holeGeom = new THREE.ExtrudeGeometry(shapeHoles[i], extrudeOptions);
		//преобразуем геометрию отверстия в BSP объект
		var holeBSP = new ThreeBSP(holeGeom);
		//преобразуем геометрию столба в BSP объект
		var geomBSP = new ThreeBSP(geom);

		//Выдавливаем отверстие в столбе
		var union_bsp = geomBSP.subtract(holeBSP);
		//Преобразуем обратно в геометрию
		geom = union_bsp.toGeometry();
	}

	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, mat)
	par.mesh.add(mesh);
}

/**
Функция отрисовывает отверстия на всех сторонах столбов на п-образной с забегом/площадкой
*@param получает par который хранит в себе treadsObj, stringerParams
*@param par.turnPar - получаются из calcTurnParams
*@param par.sideFactor - определяется в функции drawNewellSide неопходим для корректного поворота отверстий
*@param par.stringerType - тип каркаса назначается в drawNewellSide

*@returns {THREE.Shape[]} Массив шейпов отверстий
*/
function calcPSideHoles(par) {
	var shapeHoles = []; // Массив отверстий

	//Распаковываем некоторые переменные
	var turnPar = par.turnPar;
	var sideFactor = par.sideFactor;
	var stringerType = par.stringerType;

	//Вспомогательные переменные
	var treadNotchesParBot = calcMarshNotches(par.botMarshId);
	var treadNotchesParTop = calcMarshNotches(getMarshParams(par.botMarshId).nextMarshId);
	var cosX = par.newellSlotDepth;

	//Рисуем отверстия для 1 стороны
	if (par.side == 1) {
		//Параметры отверстия
		//Корректируем положение отверстия под каркас для второй стороны

		var holeShapePar = {
			basePoint: newPoint_xy(par.basePoint2, 0, -par.botStringerOffset - par.botStringerHeight - 0.01), //базовая точка отверстия(нижний правый угол отверстия)
			holeWidth: params.stringerThickness, //Ширина отверстия
			holeHeight: par.botStringerHeight + 0.02, //Высота отверстия
			sideFactor: sideFactor, //к-т отвечающий за правильное расположение проекции(см.начало функции)
			dxfBasePoint: par.dxfBasePoint //базовая точка dxf
		};

		//модифицируем положение базовой для тетивы(отверстие должно быть в середине)
		if (stringerType == 'тетива') holeShapePar.basePoint = newPoint_xy(holeShapePar.basePoint, (params.rackSize - params.stringerThickness) / 2, 0);
		if (par.stringerParams[1].params.in && par.newellId == 1) {
			if (par.stringerParams[1].params.in.endHeightYOffset) {
				holeShapePar.basePoint.y += par.stringerParams[1].params.in.endHeightYOffset;
			};
		}
		if (par.newellId == 2) {
			holeShapePar.basePoint = newPoint_xy(par.basePoint3, -params.stringerThickness,  -par.topStringerOffset - par.topStringerHeight);
			holeShapePar.holeHeight = par.topStringerHeight;
			if (stringerType == 'тетива') holeShapePar.basePoint = newPoint_xy(holeShapePar.basePoint, -(params.rackSize - params.stringerThickness) / 2, 0);
		}
		if (par.turnType == 'забег' && par.newellId == 2) holeShapePar.basePoint.y += par.h_top;

		var holeShape = drawHoleShape(holeShapePar);
		shapeHoles.push(holeShape); //Добавляем в массив точек

		if (par.side == 1 && par.newellId == 2 && params.stairModel == 'П-образная с забегом' && stringerType == 'косоур') {
			//первая ступень
			var holeShapePar = {
				isTread: true,
				basePoint: newPoint_xy(par.basePoint2, 0, -par.firstTreadOffset - params.treadThickness + par.h_top * 3 - 0.025),
				holeWidth: params.rackSize,
				holeHeight: params.treadThickness + 0.05,
				sideFactor: sideFactor,
				dxfBasePoint: par.dxfBasePoint
			};

			var holeShape = drawHoleShape(holeShapePar);
			shapeHoles.push(holeShape); //Добавляем в массив точек
		}
		if (par.side == 1 && par.newellId == 2 && params.stairModel == 'П-образная с площадкой' && stringerType == 'тетива') {
			//первая ступень
			var holeShapePar = {
				basePoint: newPoint_xy(par.basePoint3, -cosX, -par.firstTreadOffset - params.treadThickness + par.h_top - 0.025),
				holeWidth: cosX,
				holeHeight: params.treadThickness + 0.05,
				sideFactor: sideFactor,
				dxfBasePoint: par.dxfBasePoint
			};

			var holeShape = drawHoleShape(holeShapePar);
			shapeHoles.push(holeShape); //Добавляем в массив точек
		}
	}

	if (par.turnType == 'площадка') {
		//Рассчитываем отверстия в ступенях
		var pltNotches = calcPltNotches();

		if (par.side == 3) {
			// нижняя ступень
			var holeShapePar = {
				basePoint: newPoint_xy(par.basePoint2, 0, -par.firstTreadOffset - params.treadThickness - 0.025),
				holeWidth: params.rackSize,
				holeHeight: params.treadThickness + 0.05,
				sideFactor: sideFactor,
				dxfBasePoint: par.dxfBasePoint
			};

			var holeShape = drawHoleShape(holeShapePar);
			shapeHoles.push(holeShape); //Добавляем в массив точек

		}

		if (par.side == 2 && par.newellId == 1) {

			if (stringerType == 'косоур') {
				var holeShapePar = {
					basePoint: newPoint_xy(par.basePoint2, 0, -par.botStringerOffset - par.botStringerHeight - 0.025), //базовая точка отверстия(нижний правый угол отверстия)
					holeWidth: cosX + 0.05, //Ширина отверстия
					holeHeight: par.botStringerHeight + 0.05, //Высота отверстия
					sideFactor: sideFactor, //к-т отвечающий за правильное расположение проекции(см.начало функции)
					dxfBasePoint: par.dxfBasePoint //базовая точка dxf
				};

				var holeShape = drawHoleShape(holeShapePar);
				shapeHoles.push(holeShape); //Добавляем в массив точек
			}

			//Начинаем снизу
			//Рассчитываем размеры выреза под ступени
			var firstTreadWidth = treadNotchesParBot.topIn.x;
			var secondTreadOffset = pltNotches.middle.x + params.stringerSlotsDepth + 0.01; //params.rackSize - turnPar.notchOffset1;
			if (stringerType == 'косоур' && params.stairModel !== 'П-образная с площадкой') {
				firstTreadWidth += 20; //FIX исправить ступень будет убрано после фиксов лестницы
			}

			// нижняя ступень
			var holeShapePar = {
				isTread: true,
				basePoint: newPoint_xy(par.basePoint2, 0, -par.firstTreadOffset - params.treadThickness - par.h_bot - 0.025),
				holeWidth: firstTreadWidth,
				holeHeight: params.treadThickness + 0.05,
				sideFactor: sideFactor,
				dxfBasePoint: par.dxfBasePoint
			};

			var holeShape = drawHoleShape(holeShapePar);
			shapeHoles.push(holeShape); //Добавляем в массив точек

			// если есть подступенки рисуем подступенок
			if (params.riserType == 'есть') {
				holeShapePar = {
					basePoint: newPoint_xy(holeShapePar.basePoint, firstTreadWidth - 0.01, 0),
					holeWidth: params.riserThickness + 0.03, //Ширина отверстия
					holeHeight: par.h_bot, //Высота отверстия
					sideFactor: sideFactor, //к-т отвечающий за правильное расположение проекции(см.начало функции)
					dxfBasePoint: par.dxfBasePoint //базовая точка dxf
				};

				var holeShape = drawHoleShape(holeShapePar);
				shapeHoles.push(holeShape); //Добавляем в массив точек
			}

			// вторая ступень
			var holeShapePar = {
				isTread: true,
				basePoint: newPoint_xy(par.basePoint3, -secondTreadOffset, -par.firstTreadOffset - params.treadThickness - 0.025),
				holeWidth: secondTreadOffset,
				holeHeight: params.treadThickness + 0.05,
				sideFactor: sideFactor,
				dxfBasePoint: par.dxfBasePoint
			};

			var holeShape = drawHoleShape(holeShapePar);
			shapeHoles.push(holeShape); //Добавляем в массив точек
		}

		if (par.side == 4 && par.newellId == 2) {
			//Отверстие под косоур
			if (stringerType == 'косоур') {
				var holeShapePar = {
					basePoint: newPoint_xy(par.basePoint3, -cosX, -par.topStringerOffset - par.topStringerHeight), //базовая точка отверстия(нижний правый угол отверстия)
					holeWidth: cosX, //Ширина отверстия
					holeHeight: par.topStringerHeight, //Высота отверстия
					sideFactor: sideFactor, //к-т отвечающий за правильное расположение проекции(см.начало функции)
					dxfBasePoint: par.dxfBasePoint //базовая точка dxf
				};
				var holeShape = drawHoleShape(holeShapePar);
				shapeHoles.push(holeShape); //Добавляем в массив точек
			}

			//Начинаем снизу
			//Рассчитываем размеры выреза под ступени
			var firstTreadWidth = pltNotches.middle.x + params.stringerSlotsDepth;
			var secondTreadOffset = treadNotchesParTop.botIn.x + params.stringerSlotsDepth;// + 20; //FIX 20 - чтобы отверстие совпало. нужно фиксить ступени

			if (stringerType == 'косоур') secondTreadOffset = treadNotchesParTop.botIn.x;

			// нижняя ступень
			var holeShapePar = {
				isTread: true,
				basePoint: newPoint_xy(par.basePoint2, 0, -par.firstTreadOffset - params.treadThickness - 0.025),
				holeWidth: firstTreadWidth,
				holeHeight: params.treadThickness + 0.05,
				sideFactor: sideFactor,
				dxfBasePoint: par.dxfBasePoint
			};

			var holeShape = drawHoleShape(holeShapePar);
			shapeHoles.push(holeShape); //Добавляем в массив точек

			// если есть подступенки рисуем подступенок
			if (params.riserType == 'есть') {
				holeShapePar = {
					basePoint: newPoint_xy(holeShapePar.basePoint, firstTreadWidth, 0),
					holeWidth: params.riserThickness, //Ширина отверстия
					holeHeight: par.h_top, //Высота отверстия
					sideFactor: sideFactor, //к-т отвечающий за правильное расположение проекции(см.начало функции)
					dxfBasePoint: par.dxfBasePoint //базовая точка dxf
				};

				if (stringerType == 'косоур') {
					holeShapePar.basePoint.x -=  0.05;
				}

				var holeShape = drawHoleShape(holeShapePar);
				shapeHoles.push(holeShape); //Добавляем в массив точек
			}

			//вторая ступень
			var holeShapePar = {
				isTread: true,
				basePoint: newPoint_xy(par.basePoint3, -secondTreadOffset, -par.firstTreadOffset - params.treadThickness + par.h_top - 0.025),
				holeWidth: secondTreadOffset,
				holeHeight: params.treadThickness + 0.05,
				sideFactor: sideFactor,
				dxfBasePoint: par.dxfBasePoint
			};

			var holeShape = drawHoleShape(holeShapePar);
			shapeHoles.push(holeShape); //Добавляем в массив точек
		}


	}

	if (par.turnType == 'забег') {
		var wndPar1 = par.treadsObj.wndPar;
		var wndPar2 = par.treadsObj.wndPar2;

		/*
			Вторая сторона первого столба и 3/4 стороны второго столба идентичны по конструкции
		*/
		if ((par.side == 2 && par.newellId == 1) || ((par.side == 3 || par.side == 4) && par.newellId == 2)) {
			if ((par.side == 2 || par.side == 4) && stringerType == 'косоур') {
				var cosX = par.newellSlotDepth;
				//Отверстие под косоур
				var holeShapePar = {
					basePoint: newPoint_xy(par.basePoint2, 0, -par.botStringerOffset - par.botStringerHeight - 0.01), //базовая точка отверстия(нижний правый угол отверстия)
					holeWidth: cosX, //Ширина отверстия
					holeHeight: par.botStringerHeight + 0.02, //Высота отверстия
					sideFactor: sideFactor, //к-т отвечающий за правильное расположение проекции(см.начало функции)
					dxfBasePoint: par.dxfBasePoint //базовая точка dxf
				};
				if (par.side == 4) {
					holeShapePar.basePoint = newPoint_xy(par.basePoint3, -cosX, -par.topStringerOffset - par.topStringerHeight + par.h_top);
					holeShapePar.holeHeight = par.topStringerHeight;
				}

				var holeShape = drawHoleShape(holeShapePar);
				shapeHoles.push(holeShape); //Добавляем в массив точек

			}

			//Начинаем снизу
			//Рассчитываем размеры выреза под ступени второй стороны
			/*
				firstTreadWidth - ширина выреза под первую ступень
				firstTreadOffsetY - высота на которой распологается вырез относительно firstTreadOffset
				secondTreadWidth - ширина выреза под вторую ступень
				secondTreadOffsetY - высота на которой распологается вырез относительно firstTreadOffset
				secondTreadOffset - отступ от края стойки(тк только второй вырез не прилегает к краю)
				thirdTreadWidth - ширина выреза под третью ступень
				thirdTreadOffsetY - высота на которой распологается вырез относительно firstTreadOffset
			*/
			var firstTreadWidth = treadNotchesParBot.topIn.x;
			var firstTreadOffsetY = -(par.h_top + par.h_bot); //par.h_top - par.h_bot;

			var secondTreadWidth = wndPar1.params[1].stepWidthLow;
			var secondTreadOffsetY = -par.h_top;
			var secondTreadOffset = firstTreadWidth - params.nose;//turnPar.notchOffset1;

			var thirdTreadWidth = wndPar1.params[2].notchDepthY + params.stringerSlotsDepth + 0.01;
			var thirdTreadOffsetY = 0;

			//Учитываем угол ступени
			if (params.riserType == 'есть') {
				secondTreadWidth += params.stringerSlotsDepth * Math.tan(wndPar1.params[1].edgeAngle);
				// holeShapePar.holeWidth = params.riserThickness / Math.cos(par.turnStepsParams[1].edgeAngle);
			}

			// рассчитываем отверстия для 3 стороны 2 столба
			if (par.side == 3) {
				firstTreadWidth = wndPar1.params[3].stepWidthLow - (params.rackSize - 10) - params.marshDist;//60;//params.rackSize / 2 - deltaX; //wndPar1.params[3].stepWidthLow - 130;//treadNotchesParBot.topIn.x;
				if (params.model == 'тетивы') firstTreadWidth = wndPar1.params[3].stepWidthLow - (params.rackSize - 10) - (params.marshDist - (55 - (params.stringerThickness - 40)))
				// if (params.model == 'косоуры') firstTreadWidth = wndPar1.params[3].stepWidthLow - (params.rackSize - 10) - (params.marshDist - (55 - (params.stringerThickness - 40)));
				firstTreadOffsetY = -par.h_top;

				var deltaX = par.pos.z - wndPar1.params[3].mesh.position.z; //Разница между столбом и ступенью
				secondTreadWidth = wndPar2.params[1].stepWidthLow;
				secondTreadOffsetY = 0;
				secondTreadOffset = firstTreadWidth - (turnPar.newellPosX - (deltaX * turnFactor));

				thirdTreadWidth = wndPar2.params[2].notchDepthY + params.stringerSlotsDepth;
				thirdTreadOffsetY = par.h_top;

				//Учитываем угол ступени
				if (params.riserType == 'есть') {
					secondTreadWidth += params.stringerSlotsDepth * Math.tan(wndPar2.params[1].edgeAngle);
					// holeShapePar.holeWidth = params.riserThickness / Math.cos(par.turnStepsParams[1].edgeAngle);
				}
			}
			// рассчитываем отверстия для 4 стороны 2 столба
			if (par.side == 4) {
				firstTreadWidth = wndPar2.params[2].notchDepthX + params.stringerSlotsDepth;
				firstTreadOffsetY = par.h_top;

				thirdTreadWidth = treadNotchesParBot.botIn.x + 0.01;
				thirdTreadOffsetY = par.h_top * 3;

				secondTreadWidth = wndPar2.params[3].stepWidthLow;
				secondTreadOffsetY = par.h_top * 2;
				secondTreadOffset = thirdTreadWidth - params.nose;//turnPar.topMarshOffsetX; //turnPar.notchOffset1;

				//Учитываем угол ступени
				if (params.riserType == 'есть') {
					firstTreadWidth -= params.stringerSlotsDepth * Math.tan(wndPar2.params[2].angleX);
					// holeShapePar.holeWidth = params.riserThickness / Math.cos(par.turnStepsParams[1].edgeAngle);
				}
			}

			//первая ступень
			var holeShapePar = {
				isTread: true,
				basePoint: newPoint_xy(par.basePoint2, 0, -par.firstTreadOffset - params.treadThickness + firstTreadOffsetY - 0.025),
				holeWidth: firstTreadWidth,
				holeHeight: params.treadThickness + 0.05,
				sideFactor: sideFactor,
				dxfBasePoint: par.dxfBasePoint
			};

			var holeShape = drawHoleShape(holeShapePar);
			shapeHoles.push(holeShape); //Добавляем в массив точек
			//подступенок между первой и второй
			if (params.riserType == 'есть') {
				holeShapePar = {
					basePoint: newPoint_xy(holeShapePar.basePoint, firstTreadWidth - 0.025, 0),
					holeWidth: params.riserThickness + 0.05, //Ширина отверстия
					holeHeight: par.h_bot, //Высота отверстия
					sideFactor: sideFactor, //к-т отвечающий за правильное расположение проекции(см.начало функции)
					dxfBasePoint: par.dxfBasePoint //базовая точка dxf
				};

				//учитываем угол подступенка
				if (par.side == 4) holeShapePar.holeWidth = params.riserThickness / Math.cos(wndPar2.params[2].angleX) + 0.3;//FIX

				var holeShape = drawHoleShape(holeShapePar);
				shapeHoles.push(holeShape); //Добавляем в массив точек
			}

			//вторая ступень
			holeShapePar = {
				isTread: true,
				basePoint: newPoint_xy(par.basePoint2, secondTreadOffset, -par.firstTreadOffset - params.treadThickness + secondTreadOffsetY - 0.025),
				holeWidth: secondTreadWidth + 0.02,
				holeHeight: params.treadThickness + 0.05,
				sideFactor: sideFactor,
				dxfBasePoint: par.dxfBasePoint
			};
			if (par.side == 4) {
				holeShapePar.basePoint = newPoint_xy(par.basePoint3, -secondTreadWidth -secondTreadOffset - 0.01, -par.firstTreadOffset - params.treadThickness + secondTreadOffsetY - 0.025);
			}

			var holeShape = drawHoleShape(holeShapePar);
			shapeHoles.push(holeShape); //Добавляем в массив точек

			// подступенок между второй и третей
			if (params.riserType == 'есть') {
				holeShapePar = {
					basePoint: newPoint_xy(holeShapePar.basePoint, secondTreadWidth - 0.3 - 0.02, -0.01),//FIX
					holeWidth: params.riserThickness, //Ширина отверстия
					holeHeight: par.h_top + 0.02, //Высота отверстия
					sideFactor: sideFactor, //к-т отвечающий за правильное расположение проекции(см.начало функции)
					dxfBasePoint: par.dxfBasePoint //базовая точка dxf
				};

				//учитываем угол подступенка
				if (par.side == 2) holeShapePar.holeWidth = params.riserThickness / Math.cos(wndPar1.params[1].edgeAngle) + 0.3 + 0.04;
				if (par.side == 3) holeShapePar.holeWidth = params.riserThickness / Math.cos(wndPar2.params[1].edgeAngle) + 0.3 + 0.04;
				if (par.side == 4) holeShapePar.holeWidth += 0.3 + 0.04;

				var holeShape = drawHoleShape(holeShapePar);
				shapeHoles.push(holeShape); //Добавляем в массив точек
			}

			//третья ступень
			holeShapePar = {
				isTread: true,
				basePoint: newPoint_xy(par.basePoint3, -thirdTreadWidth, -par.firstTreadOffset - params.treadThickness + thirdTreadOffsetY - 0.025),
				holeWidth: thirdTreadWidth,
				holeHeight: params.treadThickness + 0.05,
				sideFactor: sideFactor,
				dxfBasePoint: par.dxfBasePoint
			};

			var holeShape = drawHoleShape(holeShapePar);
			shapeHoles.push(holeShape); //Добавляем в массив точек
		}
		// третья сторона первого столба
		if (par.side == 3 && par.newellId == 1) {

			var firstTreadWidth = wndPar1.params[2].notchDepthX + params.stringerSlotsDepth;
			var firstTreadOffsetY = 0; //par.h_top - par.h_bot;

			var secondTreadWidth = params.rackSize - 10; //FIX
			var secondTreadOffsetY = par.h_top;

			//Учитываем угол ступени
			if (params.riserType == 'есть') {
				firstTreadWidth -= params.stringerSlotsDepth * Math.tan(wndPar1.params[2].angleY);
				// holeShapePar.holeWidth = params.riserThickness / Math.cos(par.turnStepsParams[1].edgeAngle);
			}

			//первая ступень
			var holeShapePar = {
				isTread: true,
				basePoint: newPoint_xy(par.basePoint2, 0, -par.firstTreadOffset - params.treadThickness + firstTreadOffsetY - 0.025),
				holeWidth: firstTreadWidth + 0.05,
				holeHeight: params.treadThickness + 0.05,
				sideFactor: sideFactor,
				dxfBasePoint: par.dxfBasePoint
			};

			var holeShape = drawHoleShape(holeShapePar);
			shapeHoles.push(holeShape); //Добавляем в массив точек
			//подступенок между первой и второй
			if (params.riserType == 'есть') {
				var techDelta2 = 0.01;
				holeShapePar = {
					basePoint: newPoint_xy(holeShapePar.basePoint, firstTreadWidth - techDelta2, -techDelta2),
					holeWidth: params.riserThickness, //Ширина отверстия
					holeHeight: par.h_top + techDelta2 * 2, //Высота отверстия
					sideFactor: sideFactor, //к-т отвечающий за правильное расположение проекции(см.начало функции)
					dxfBasePoint: par.dxfBasePoint //базовая точка dxf
				};
				if (params.riserType == 'есть') {
					holeShapePar.holeWidth = params.riserThickness / Math.cos(wndPar1.params[2].angleY) + 0.3 + techDelta2 * 2;//FIX;
				}
				var holeShape = drawHoleShape(holeShapePar);
				shapeHoles.push(holeShape); //Добавляем в массив точек
			}

			//вторая ступень
			holeShapePar = {
				isTread: true,
				basePoint: newPoint_xy(par.basePoint3, -secondTreadWidth, -par.firstTreadOffset - params.treadThickness + secondTreadOffsetY - 0.025),
				holeWidth: secondTreadWidth,
				holeHeight: params.treadThickness + 0.05,
				sideFactor: sideFactor,
				dxfBasePoint: par.dxfBasePoint
			};

			var holeShape = drawHoleShape(holeShapePar);
			shapeHoles.push(holeShape); //Добавляем в массив точек
		}
	}

	return shapeHoles;
}

/**
Функция отрисовывает отверстия на всех сторонах столбов на всех лестницах кроме п-образной с забегом/площадкой
*@param получает par который хранит в себе treadsObj, stringerParams
*@param par.turnPar - получаются из calcTurnParams
*@param par.sideFactor - определяется в функции drawNewellSide неопходим для корректного поворота отверстий
*@param par.stringerType - тип каркаса назначается в drawNewellSide

*@returns {THREE.Shape[]} Массив шейпов отверстий
*/
function calcStandardSideHoles(par) {

	//Распаковываем некоторые переменные
	var turnPar = par.turnPar;
	var sideFactor = par.sideFactor;
	var stringerType = par.stringerType;
	var marshParams = getMarshParams(par.botMarshId);
	var topMarshParams = getMarshParams(marshParams.nextMarshId);
	var shapeHoles = []; // Массив отверстий
	var cosX = par.newellSlotDepth;

	if (par.side == 4 && topMarshParams.stairAmt == 0) return shapeHoles;

	//Рисуем отверстия для 1 и 4 стороны
	if (par.side == 1 || par.side == 4) {
		// if (stringerType == 'косоур') {
		// 	var holeShapePar = {
		// 		basePoint: newPoint_xy(par.basePoint3, -cosX, -par.firstTreadOffset - params.treadThickness + par.h_top),
		// 		holeWidth: cosX,//Пересчитать
		// 		holeHeight: params.treadThickness,
		// 		sideFactor: sideFactor,
		// 		dxfBasePoint: par.dxfBasePoint
		// 	};
		//
		// 	var holeShape = drawHoleShape(holeShapePar);
		// 	shapeHoles.push(holeShape); //Добавляем в массив точек
		// }

		// if (stringerType == 'тетива' && par.side == 4) {
		// 	var holeShapePar = {
		// 		basePoint: newPoint_xy(par.basePoint3, -cosX, -par.firstTreadOffset - params.treadThickness + par.h_top),
		// 		holeWidth: cosX,//Пересчитать
		// 		holeHeight: params.treadThickness,
		// 		sideFactor: sideFactor,
		// 		dxfBasePoint: par.dxfBasePoint
		// 	};
		//
		// 	var holeShape = drawHoleShape(holeShapePar);
		// 	shapeHoles.push(holeShape); //Добавляем в массив точек
		// }

		//Параметры отверстия
		var holeShapePar = {
			basePoint: newPoint_xy(par.basePoint2, 0, -par.botStringerOffset - par.botStringerHeight - 0.01), //базовая точка отверстия(нижний правый угол отверстия)
			holeWidth: params.stringerThickness, //Ширина отверстия
			holeHeight: par.botStringerHeight + 0.02, //Высота отверстия
			sideFactor: sideFactor, //к-т отвечающий за правильное расположение проекции(см.начало функции)
			dxfBasePoint: par.dxfBasePoint //базовая точка dxf
		};

		if (par.stringerParams[par.botMarshId].params.in) {
			if (par.stringerParams[par.botMarshId].params.in.endHeightYOffset) {
				holeShapePar.basePoint.y += par.stringerParams[par.botMarshId].params.in.endHeightYOffset;
			};
		}

		if (par.side == 4) {
			holeShapePar.holeHeight = par.topStringerHeight;
			holeShapePar.basePoint = newPoint_xy(par.basePoint2, 0, -par.topStringerOffset - par.topStringerHeight);
		}
		if (par.newellId == 2 && stringerType == 'косоур') {
			holeShapePar.basePoint = newPoint_xy(par.basePoint3, -params.stringerThickness, -par.botStringerOffset - par.botStringerHeight - 0.01);
			if (par.side == 4) {
				holeShapePar.basePoint = newPoint_xy(par.basePoint3, -params.stringerThickness, -par.topStringerOffset - par.topStringerHeight);
			}
		}
		//модифицируем положение базовой для тетивы(отверстие должно быть в середине)
		if (stringerType == 'тетива') holeShapePar.basePoint = newPoint_xy(holeShapePar.basePoint, (params.rackSize - params.stringerThickness) / 2, 0);
		var holeShape = drawHoleShape(holeShapePar);
		if (par.side == 1 && marshParams.stairAmt > 0 || par.side == 4) {
			shapeHoles.push(holeShape); //Добавляем в массив точек
		}
		// if (par.side == 4) {
		// 	// верхняя ступень
		// 	var holeShapePar = {
		// 		isTread: true,
		// 		basePoint: newPoint_xy(par.basePoint3, -cosX, -par.firstTreadOffset - params.treadThickness + par.h_top), //базовая точка отверстия(нижний правый угол отверстия)
		// 		holeWidth: cosX, //Ширина отверстия
		// 		holeHeight: params.treadThickness, //Высота отверстия
		// 		sideFactor: sideFactor, //к-т отвечающий за правильное расположение проекции(см.начало функции)
		// 		dxfBasePoint: par.dxfBasePoint //базовая точка dxf
		// 	};
		// 	if (par.newellId == 2) {
		// 		var holeShapePar = {
		// 			isTread: true,
		// 			basePoint: newPoint_xy(par.basePoint2, 0, -par.firstTreadOffset - params.treadThickness + par.h_top), //базовая точка отверстия(нижний правый угол отверстия)
		// 			holeWidth: params.rackSize, //Ширина отверстия
		// 			holeHeight: params.treadThickness, //Высота отверстия
		// 			sideFactor: sideFactor, //к-т отвечающий за правильное расположение проекции(см.начало функции)
		// 			dxfBasePoint: par.dxfBasePoint //базовая точка dxf
		// 		};
		// 	}
		// 	var holeShape = drawHoleShape(holeShapePar);
		// 	shapeHoles.push(holeShape); //Добавляем в массив точек
		// }
		//
	}
	//Отверстия 2 и 3 стороны
	if (par.side == 2 || par.side == 3) {

		//Отверстие под косоур
		if (stringerType == 'косоур') {
			var holeShapePar = {
				basePoint: newPoint_xy(par.basePoint2, 0, -par.firstTreadOffset - params.treadThickness - par.h_bot - par.botStringerHeight - 0.01), //базовая точка отверстия(нижний правый угол отверстия)
				holeWidth: cosX, //Ширина отверстия
				holeHeight: par.botStringerHeight + 0.02, //Высота отверстия
				sideFactor: sideFactor, //к-т отвечающий за правильное расположение проекции(см.начало функции)
				dxfBasePoint: par.dxfBasePoint //базовая точка dxf
			};

			if (par.turnType == 'забег') {
				holeShapePar.basePoint = newPoint_xy(par.basePoint2, 0, -par.firstTreadOffset - params.treadThickness - par.h_top - par.h_bot - par.botStringerHeight - 0.01);
			}
			
			// Модифицируем параметры для стороны 3 (следующий марш)
			if (par.side == 3) {
				holeShapePar.basePoint = newPoint_xy(par.basePoint3, -cosX, -par.topStringerOffset - par.topStringerHeight);
				holeShapePar.holeHeight = par.topStringerHeight;
			}
			if (params.riserType == 'есть' && marshParams.stairAmt == 1 && stringerType == 'косоур') {
				holeShapePar.holeWidth += params.riserThickness;
			}
			var holeShape = drawHoleShape(holeShapePar);
			if (par.side == 2 && marshParams.stairAmt > 0 || par.side == 3 && getMarshParams(marshParams.nextMarshId).stairAmt > 0) {
				shapeHoles.push(holeShape); //Добавляем в массив точек
			}
		}

		if (par.turnType == "площадка") {
			if ( params.riserType == 'есть' && par.side == 3 && testingMode) {
				holeShapePar = {
					basePoint: newPoint_xy(par.basePoint2, 0, -par.firstTreadOffset - par.h_top),
					holeWidth: params.riserThickness, //Ширина отверстия
					holeHeight: par.h_top, //Высота отверстия
					sideFactor: sideFactor, //к-т отвечающий за правильное расположение проекции(см.начало функции)
					dxfBasePoint: par.dxfBasePoint //базовая точка dxf
				};

				var holeShape = drawHoleShape(holeShapePar);
				shapeHoles.push(holeShape); //Добавляем в массив точек
			}
			//Начинаем снизу
			//Рассчитываем размеры выреза под ступени
			var firstTreadWidth = params.rackSize - turnPar.notchOffset1;
			var secondTreadWidth = params.rackSize / 2 + turnPar.newellPosX;

			if (stringerType == 'косоур') firstTreadWidth = cosX;
			//Модифицируем в зависимости от стороны столба
			if (par.side == 3) {
				firstTreadWidth = turnPar.notchOffset1;
				secondTreadWidth = params.rackSize - turnPar.notchOffset2;
				if (stringerType == 'косоур') firstTreadWidth = params.rackSize - cosX;
			}

			// нижняя ступень
			var holeShapePar = {
				isTread: true,
				basePoint: newPoint_xy(par.basePoint2, 0, -par.firstTreadOffset - params.treadThickness - par.h_bot),
				holeWidth: firstTreadWidth,
				holeHeight: params.treadThickness,
				sideFactor: sideFactor,
				dxfBasePoint: par.dxfBasePoint
			};
			// Модифицируем параметры для стороны 3 (следующий марш)
			if (par.side == 3) holeShapePar.basePoint = newPoint_xy(par.basePoint2, 0, -par.firstTreadOffset - params.treadThickness);

			var holeShape = drawHoleShape(holeShapePar);
			if (par.side == 2 && marshParams.stairAmt > 0 || par.side == 3) {
				shapeHoles.push(holeShape); //Добавляем в массив точек
			}

			// если есть подступенки рисуем подступенок
			if (params.riserType == 'есть') {
				holeShapePar = {
					basePoint: newPoint_xy(holeShapePar.basePoint, firstTreadWidth, 0),
					holeWidth: params.riserThickness, //Ширина отверстия
					holeHeight: par.h_bot, //Высота отверстия
					sideFactor: sideFactor, //к-т отвечающий за правильное расположение проекции(см.начало функции)
					dxfBasePoint: par.dxfBasePoint //базовая точка dxf
				};

				//Учитываем h верхнего марша
				if (par.side == 3) holeShapePar.holeHeight = par.h_top;
				if (par.side == 2 && marshParams.stairAmt == 0) {
					holeShapePar.holeHeight -= params.treadThickness;
					holeShapePar.basePoint.y += params.treadThickness;
				}
				if (par.side == 2) {
					var holeShape = drawHoleShape(holeShapePar);
					shapeHoles.push(holeShape); //Добавляем в массив точек
				}
				if (par.side == 3 && topMarshParams.stairAmt > 0) {
					var holeShape = drawHoleShape(holeShapePar);
					shapeHoles.push(holeShape); //Добавляем в массив точек
				}
			}

			// верхняя ступень
			var holeShapePar = {
				isTread: true,
				basePoint: newPoint_xy(par.basePoint3, -secondTreadWidth, -par.firstTreadOffset - params.treadThickness), //базовая точка отверстия(нижний правый угол отверстия)
				holeWidth: secondTreadWidth, //Ширина отверстия
				holeHeight: params.treadThickness, //Высота отверстия
				sideFactor: sideFactor, //к-т отвечающий за правильное расположение проекции(см.начало функции)
				dxfBasePoint: par.dxfBasePoint //базовая точка dxf
			};
			if (par.side == 3) {
				holeShapePar.basePoint.y += par.h_top;
			}
			if (par.side == 2) {
				var holeShape = drawHoleShape(holeShapePar);
				shapeHoles.push(holeShape); //Добавляем в массив точек
			}
			if (par.side == 3 && topMarshParams.stairAmt > 0) {
				var holeShape = drawHoleShape(holeShapePar);
				shapeHoles.push(holeShape); //Добавляем в массив точек
			}
		}
		if (par.turnType == "забег") {

			var treadNotchesParBot = calcMarshNotches(par.botMarshId);
			var treadNotchesParTop = calcMarshNotches(getMarshParams(par.botMarshId).nextMarshId);

			//Начинаем снизу
			//Рассчитываем размеры выреза под ступени
			var firstTreadWidth = treadNotchesParBot.topIn.x;
			var secondTreadWidth = par.turnStepsParams[1].stepWidthLow;
			var thirdTreadWidth = par.turnStepsParams[2].notchDepthY + params.stringerSlotsDepth + 0.03;
			if (params.riserType == 'есть') {
				secondTreadWidth += params.stringerSlotsDepth * Math.tan(par.turnStepsParams[1].edgeAngle);
			}
			//Рассчитываем отступ ступени
			var secondTreadOffset = turnPar.notchOffset1;

			//Модифицируем в зависимости от стороны столба
			if (par.side == 3) {
				firstTreadWidth = par.turnStepsParams[2].notchDepthX + params.stringerSlotsDepth;
				secondTreadWidth = par.turnStepsParams[3].stepWidthLow;
				thirdTreadWidth = params.rackSize - turnPar.notchOffset2;
				// Рассчитываем положение второй ступени на основе третьей
				// FIX IT TEMP!!!!!!!
				// secondTreadOffset = turnPar.topMarshOffsetX;
				secondTreadOffset = 10; //turnPar.topMarshOffsetX;
				if (params.riserType == 'есть') {
					firstTreadWidth -= params.stringerSlotsDepth * Math.tan(par.turnStepsParams[2].angleX);
				}
			}

			//первая ступень
			var holeShapePar = {
				isTread: true,
				basePoint: newPoint_xy(par.basePoint2, 0, -par.firstTreadOffset - params.treadThickness - par.h_top - par.h_bot),
				holeWidth: firstTreadWidth,
				holeHeight: params.treadThickness,
				sideFactor: sideFactor,
				dxfBasePoint: par.dxfBasePoint
			};
			// Модифицируем параметры для стороны 3 (следующий марш)
			if (par.side == 3) holeShapePar.basePoint = newPoint_xy(par.basePoint2, 0, -par.firstTreadOffset - params.treadThickness);

			var holeShape = drawHoleShape(holeShapePar);
			shapeHoles.push(holeShape); //Добавляем в массив точек
			//подступенок между первой и второй
			if (params.riserType == 'есть') {
				holeShapePar = {
					basePoint: newPoint_xy(holeShapePar.basePoint, firstTreadWidth - 0.025, 0),
					holeWidth: params.riserThickness + 0.05, //Ширина отверстия
					holeHeight: par.h_bot, //Высота отверстия
					sideFactor: sideFactor, //к-т отвечающий за правильное расположение проекции(см.начало функции)
					dxfBasePoint: par.dxfBasePoint //базовая точка dxf
				};

				//Учитываем h верхнего марша
				if (par.side == 3) {
					holeShapePar.holeHeight = par.h_top;
					holeShapePar.holeWidth = params.riserThickness / Math.cos(par.turnStepsParams[2].angleY) + 0.3 + 0.02;//FIX !!!
					holeShapePar.basePoint.x -= 0.01;
				}

				var holeShape = drawHoleShape(holeShapePar);
				shapeHoles.push(holeShape); //Добавляем в массив точек
			}

			//вторая ступень
			holeShapePar = {
				isTread: true,
				basePoint: newPoint_xy(par.basePoint2, secondTreadOffset, -par.firstTreadOffset - params.treadThickness - par.h_top),
				holeWidth: secondTreadWidth,
				holeHeight: params.treadThickness,
				sideFactor: sideFactor,
				dxfBasePoint: par.dxfBasePoint
			};
			// Модифицируем параметры для стороны 3 (следующий марш)
			if (par.side == 3) holeShapePar.basePoint = newPoint_xy(par.basePoint2, secondTreadOffset, -par.firstTreadOffset - params.treadThickness + par.h_top);

			var holeShape = drawHoleShape(holeShapePar);
			shapeHoles.push(holeShape); //Добавляем в массив точек

			// подступенок между второй и третей
			if (params.riserType == 'есть') {
				holeShapePar = {
					basePoint: newPoint_xy(holeShapePar.basePoint, secondTreadWidth, 0),
					holeWidth: params.riserThickness, //Ширина отверстия
					holeHeight: par.h_top, //Высота отверстия
					sideFactor: sideFactor, //к-т отвечающий за правильное расположение проекции(см.начало функции)
					dxfBasePoint: par.dxfBasePoint //базовая точка dxf
				};
				if (par.side == 2) {
					holeShapePar.basePoint.x -= 0.3;//FIX IT
					holeShapePar.holeWidth = params.riserThickness / Math.cos(par.turnStepsParams[1].edgeAngle) + 0.3;
				}

				if (par.side == 2) {
					var holeShape = drawHoleShape(holeShapePar);
					shapeHoles.push(holeShape); //Добавляем в массив точек
				}
				if (par.side == 3 && topMarshParams.stairAmt > 0) {
					var holeShape = drawHoleShape(holeShapePar);
					shapeHoles.push(holeShape); //Добавляем в массив точек
				}
			}

			//третья ступень
			holeShapePar = {
				isTread: true,
				basePoint: newPoint_xy(par.basePoint3, -thirdTreadWidth, -par.firstTreadOffset - params.treadThickness - 0.025),
				holeWidth: thirdTreadWidth,
				holeHeight: params.treadThickness + 0.05,
				sideFactor: sideFactor,
				dxfBasePoint: par.dxfBasePoint
			};
			// Модифицируем параметры для стороны 3 (следующий марш)
			if (par.side == 3) holeShapePar.basePoint = newPoint_xy(par.basePoint3, -thirdTreadWidth, -par.firstTreadOffset - params.treadThickness + par.h_top * 2);

			if (par.side == 2) {
				var holeShape = drawHoleShape(holeShapePar);
				shapeHoles.push(holeShape); //Добавляем в массив точек
			}
			if (par.side == 3 && topMarshParams.stairAmt > 0) {
				var holeShape = drawHoleShape(holeShapePar);
				shapeHoles.push(holeShape); //Добавляем в массив точек
			}
		}
	}

	return shapeHoles;
}

/** Функция создает шейп в зависимости от переданных параметров

*@param: basePoint - базовая точка отверстия (нижний правый угол)
*@param: holeWidth - ширина отверстия
*@param: holeHeight - высота отверстия
*@param: sideFactor - для рассчета правильного положения отверстий в зависимости от сторон
*@param: dxfBasePoint - базовая точка для dxf

*@returns {THREE.shape} получившийся шейп
*/
function drawHoleShape(par) {
	var techDelta = 0.01; //Техническая переменная, должна фиксить лишние пересечения
	var sideOffset = 4;
	// par.holeHeight += techDelta * 2;
	// Точки отверстия
	var p1 = newPoint_xy(par.basePoint, par.holeWidth +	techDelta, -techDelta);
	var p2 = newPoint_xy(p1, 0, par.holeHeight + techDelta *2);
	var p3 = newPoint_xy(p2, -par.holeWidth - techDelta, 0);
	var p4 = newPoint_xy(p3, 0, -par.holeHeight - techDelta * 2);

	if (par.isTread && p3.x != params.rackSize && p3.x > 0) {
		p3.filletRad = frontEdgeRad;
	}


	var points = [p1, p2, p3, p4];

	// Учитываем поворот и сторону столба
	for (var i = 0; i < points.length; i++) {
		//if (points[i].x == 0) points.x -= sideOffset;
		//if (points[i].x == params.rackSize) points.x += sideOffset;

		points[i].x = points[i].x * turnFactor * par.sideFactor;
	}

	//Параметры шейпа
	var shapePar = {
		points: points,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		//markPoints: true, //пометить точки в dxf для отладки
	}
	var shape = drawShapeByPoints2(shapePar).shape;
	return shape
}
