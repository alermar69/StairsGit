/*расчет параметров поворота по номеру нижнего марша*/

function calcTurnParams(botMarshId){

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
	if(params.model == "лт" || params.model == "ко") modelParams.model = params.model;
	if(params.calcType == "timber") modelParams.model = "timber";
	if(params.calcType == "timber_stock") modelParams.model = "timber_stock";
	if(params.stairModel == "П-образная с площадкой" || params.stairModel == "П-образная с забегом") modelParams.turnType = "P_turn";
	if (params.calcType == "bolz") modelParams.model = "bolz";
	if (params.calcType == "console") modelParams.model = "mono";
	if (params.model == 'гнутый') modelParams.model = "curve";

	modelParams = setModelDimensions(modelParams); //функция в файле calcGeomParams.js

	var par = {};

	par.pltExtraLen = modelParams.deltaTop;

	par.topMarshOffsetZ = modelParams.deltaBottom;
	par.topMarshOffsetX = modelParams.deltaTop;
	if(params.stairModel == "Прямая с промежуточной площадкой") par.topMarshOffsetX = modelParams.deltaBottom;
	par.topStepDelta = modelParams.topStepDelta;

	//деревянные лестницы
	if(params.calcType == "timber"){
		//позиция оси столба относительно передней линии площадки/нижней забежной ступени
		if(params.model != "тетивы"){
			par.newellPosX = par.topMarshOffsetX + params.rackSize / 2;
		}
		if(params.model == "тетивы"){
			par.newellPosX = par.topMarshOffsetX + params.stringerThickness / 2;
		}

		//позиция оси столба относительно внутреннего края нижнего марша
		if (params.model != "тетивы") par.newellPosZ = -params.rackSize / 2;
		if(params.model == "тетивы") par.newellPosZ = -params.stringerThickness / 2; //должно быть 0

		//отступы края паза от края столба

		//площадка/первая забежная ступень, нижний марш
		par.notchOffset1 = params.rackSize / 2 - par.newellPosX;

		//площадка/первая прямая ступень, верхний марш
		par.notchOffset2 = params.rackSize / 2 - par.newellPosZ + par.topMarshOffsetZ;

		//отступ верхнего края тетивы нижнего марша от плоскости последней ступени нижнего марша
		par.stringerTopOffset = -params.treadThickness;
		if(params.model == "тетивы") par.stringerTopOffset = marshPar.h - 20;

		//отступ низа тетивы верхнего марша от плоскости первой ступени верхнего марша
		par.stringerBotOffset = getMarshParams(marshPar.nextMarshId).h + 20 + params.treadThickness;

	}


	//длина поворота вдоль нижнего марша
	par.turnLengthTop = 0;
	if(marshPar.topTurn != "нет" && params.calcType != 'vint') par.turnLengthTop = params.M + par.topMarshOffsetX;

	if(botMarshId == 1 && params.stairModel == "Г-образная с площадкой" && hasCustomMidPlt())
		par.turnLengthTop = params.middlePltLength + par.topMarshOffsetX;

	//для верхней площадки лестницы длина берется из параметров
	if(botMarshId == 3 && params.calcType != 'vint') par.turnLengthTop = params.platformLength_3;
	if(params.stairModel == "Прямая" && params.platformTop != "нет" && params.calcType != 'vint') par.turnLengthTop = params.platformLength_3;
	//для промежуточной площадки П-образной лестницы длина берется из параметров
	if(marshPar.topTurn == "площадка" && botMarshId == 1 && params.stairModel == "П-образная с площадкой")
		 par.turnLengthTop = params.platformLength_1 + par.topMarshOffsetX;
	
	
	//длина поворота вдоль верхнего марша
	par.turnLengthBot = 0;
	if(marshPar.botTurn != "нет") par.turnLengthBot = params.M + par.topMarshOffsetZ;
	//П-образная с площадкой
	if(marshPar.botTurn == "площадка" && botMarshId == 3 && params.stairModel == "П-образная с площадкой")
		par.turnLengthBot = params.platformLength_1 + par.topMarshOffsetZ;

	//отступ передней тетивы площадки П-образной лестницы
	if(params.model == "лт") par.frontPltStringerOffset = 68;
	if(params.model == "ко") par.frontPltStringerOffset = params.a1;
	if (!par.topStepDelta) par.topStepDelta = 0;
	return par;
}

function hasCustomMidPlt(par){
	var hasPlt = params.calcType == 'vhod' && !!params.middlePltWidth && !!params.middlePltLength && params.stairModel == "Г-образная с площадкой";
	if (params.middlePltWidth <= params.M && params.middlePltLength <= params.M) {
		hasPlt = false
	}
	if (!!par) {
		if (par.key == 'in' && params.middlePltWidth <= params.M && par.marshId == 3) {
			hasPlt = false;
		}
		if (par.key == 'in' && params.middlePltLength <= params.M && par.marshId == 1) {
			hasPlt = false;
		}
		if (par.key == 'out' && params.middlePltLength <= params.M) {
			hasPlt = false;
		}
	}
	if (params.stairModel == 'Прямая' || params.stairModel == 'Прямая с промежуточной площадкой') {
		hasPlt = false;
	}
	return hasPlt;
}

function hasCustomPltRailing(par){
	var hasRail = false
	if (par.key == 'in' && params.middlePltWidth > params.M + 200) {
		hasRail = true;
	}
	if (par.key == 'out' && params.middlePltLength > params.M + 200) {
		hasRail = true;
	}
	return hasRail;
}

function calcMarshEndPoint(pos, rotY, marshId){
	var marshPar = getMarshParams(marshId);
	var endPoint = {
		x: pos.x + marshPar.len * Math.cos(rotY),
		y: pos.y + marshPar.height + marshPar.h,
		z: pos.z - marshPar.len * Math.sin(rotY),
		rot: rotY,
		}

	return endPoint;
};

function calcTurnEndPoint(pos, rotY, botMarshId, plusMarshDist, turnId){

	var turnType = getMarshParams(botMarshId).topTurn;
	var turnParams = calcTurnParams(botMarshId);

		var endPoint = {
			x: pos.x,
			y: pos.y, // + getMarshParams(botMarshId).h_topWnd,
			z: pos.z,
			rot: rotY - Math.PI / 2 * turnFactor,
		}


		if (params.stairModel == "Г-образная с площадкой" && hasCustomMidPlt()) {
			endPoint.x += (params.middlePltLength - params.M);//params.middlePltLength + turnParams.topMarshOffsetX + (params.M - calcTreadLen());
			endPoint.z += (params.middlePltWidth - params.M) * turnFactor;//params.middlePltLength + turnParams.topMarshOffsetX + (params.M - calcTreadLen());
		}

		//ось нижнего марша вдоль оси X
		if(endPoint.rot == - Math.PI / 2 * turnFactor){
			endPoint.x += params.M/2 + turnParams.topMarshOffsetX;
			endPoint.z += (params.M / 2 + turnParams.topMarshOffsetZ) * turnFactor;
			}

		//ось нижнего марша вдоль оси Z
		if(endPoint.rot == - Math.PI * turnFactor){
			endPoint.x -= params.M / 2 + turnParams.topMarshOffsetZ;
			endPoint.z += (params.M/2 + turnParams.topMarshOffsetX)  * turnFactor;
			}

		if (turnType == "забег") {
			
			if (params.model == 'гнутый') {
				endPoint.y += getMarshParams(botMarshId).h_topWnd * (params.countWndTread - 1);
				//if (params.stairModel == "П-образная с забегом" ||
				//	(params.stairModel == "П-образная трехмаршевая" && params.stairAmt2 == 0)) {
				//	endPoint.rot = (rotY + Math.PI) * turnFactor;
				//	endPoint.y += getMarshParams(botMarshId).h_topWnd * params.countWndTread;
				//	endPoint.x = pos.x;
				//	endPoint.z = (pos.z + params.M + turnParams.topMarshOffsetX * 2) * turnFactor;
				//}
			}
			else endPoint.y += getMarshParams(botMarshId).h_topWnd * 2;
		}

		if(params.stairModel == "П-образная с площадкой" && botMarshId == 1){
			var endPoint = {
				x: pos.x + params.nose,
				y: pos.y,
				z: pos.z + (params.M + params.marshDist) * turnFactor,
				rot: rotY - Math.PI * turnFactor,
				}
		}

		if (params.stairModel == 'Прямая с промежуточной площадкой') {
			endPoint = newPoint_xy(pos, params.middlePltLength + turnParams.topMarshOffsetX + (params.M - calcTreadLen()), 0);
			endPoint.rot = 0;
		}

		if (params.stairModel == 'Прямая горка') {
			endPoint = newPoint_xy(pos, pos.x + params.middlePltLength, -pos.y);
			endPoint.rot = Math.PI;
		}

		if(plusMarshDist){
			if(params.stairModel == "П-образная с забегом"){
				if(params.model == "лт") endPoint.z += (params.marshDist - turnParams.topMarshOffsetX - 5) * turnFactor;
				if(params.model == "ко") endPoint.z = (params.M / 2 + params.marshDist - 25) * turnFactor;	//25 - подогнано
				if (params.model == "сварной" || params.model == "труба") endPoint.z += (params.marshDist - 40) * turnFactor;	
				if (params.calcType == "bolz" && turnId == 1) endPoint.z -= 8 * turnFactor;
				}
			if(params.stairModel == "П-образная трехмаршевая"){
				var turnParams2 = calcTurnParams(2); //параметры второго поворота
				if(params.model == "лт") endPoint.z = (params.M / 2 + params.marshDist - turnParams2.topMarshOffsetX) * turnFactor;
				if(params.model == "ко") endPoint.z = (params.M / 2 + params.marshDist - 25) * turnFactor;	//25 - подогнано
				if(params.model == "сварной" || params.model == "труба") endPoint.z = (params.M / 2 + params.marshDist - 45) * turnFactor;	//45 - подогнано
				}
			
			if(params.calcType == "timber"){
				if(params.model == "косоуры" || params.model == "тетива+косоур") endPoint.z += (params.marshDist + 60) * turnFactor; //60 подогнано
				if(params.model == "тетивы") endPoint.z += (params.marshDist + 15) * turnFactor; //15 подогнано
			}
			
			if(params.calcType == "timber_stock") endPoint.z += params.marshDist * turnFactor;
			
			//if(turnType == "площадка") endPoint.z += -turnParams.topMarshOffsetZ * turnFactor;
		}
		if (params.stairModel == 'П-образная с забегом' && turnId == 1 && params.calcType == 'timber_stock') {
			endPoint.x += 20;
		}
		if (params.stairModel == 'П-образная с забегом' && turnId == 2 && params.calcType == 'timber_stock') {
			endPoint.z += 20 * turnFactor;
		}

	return endPoint;
}

/**функция рассчитывает смещение и поворот лестницы так, чтобы верхний марш был вдоль оси X
* и верхняя ступень ровно примыкала к перекрытию
*/

function calcStaircaseMoove(lastMarshEnd){
	var pos = {
		x: lastMarshEnd.z,
		y: lastMarshEnd.x,
	}
	
	var ang0 = -lastMarshEnd.rot
	if(params.floorHoleBaseSide == 1) ang0 += Math.PI / 2
	if(params.floorHoleBaseSide == 2) ang0 += -Math.PI / 2
	if(params.floorHoleBaseSide == 4) ang0 += Math.PI

	var newPos = rotatePoint(pos, ang0);

	
	var moove = {
		x: -Math.round(newPos.y * 100000) / 100000 * turnFactor,
		y: 0,
		z: -Math.round(newPos.x * 100000) / 100000 * turnFactor,
		rot: ang0,
	}
	//коррекция для прямой лестницы
	if(params.stairModel == "Прямая" || params.stairModel == "Прямая с промежуточной площадкой") moove.x = moove.x * turnFactor;

	
	//удлиннение последней ступени при 0 ступеней в верхнем марше
	var deltaLen = 0;
	var isLastTread = false;
	if(params.stairAmt3 == 0){
		if(params.stairModel == "Г-образная с забегом") isLastTread = true;
		if(params.stairModel == "П-образная с забегом") isLastTread = true;
		if(params.stairModel == "П-образная трехмаршевая" && params.turnType_2 == "забег") isLastTread = true;
		}

	if(isLastTread){
		var botMarshId = 1;
		if(params.stairModel == "П-образная трехмаршевая") botMarshId = 2;
		var turnParams = calcTurnParams(botMarshId);
		
		if(params.model == "лт") moove.x -= params.lastWinderTreadWidth - params.nose;
		if(params.model == "ко") moove.x -= params.lastWinderTreadWidth - params.nose - 35; //35 подогнано
		if(params.calcType == "mono") moove.x -= params.lastWinderTreadWidth - params.nose;
	}

	if (params.model == "труба" && params.platformTop == "нет" && params.topAnglePosition == "над ступенью")
		moove.x -= 2; // 2 - толщина подложки
	
	moove.x -= 0.01;
	
	if (params.calcType == 'metal' || params.calcType == 'console') {
		//если на верхней площадке есть заднее ограждение, сдвигаем лестницу по оси Х чтобы ограждение не пересекалось с верхним перекрытием
		if (params.platformTop == "площадка" && params.topPltRailing_5) {
			if (params.railingModel != "Самонесущее стекло") params.staircasePosX -= 40;//40-ширина стойки
			else params.staircasePosX -= 20 + 12;//20 - зазор от стекла до торца марша, 12 - толщина стекла
		}
	}

	if (params.calcType == 'mono') {
		//если на верхней площадке есть заднее ограждение, сдвигаем лестницу по оси Х чтобы ограждение не пересекалось с верхним перекрытием
		if (params.platformTop == "площадка" && params.topPltRailing_5) {
			if (params.railingModel != "Самонесущее стекло") moove.x -= 40;//40-ширина стойки
			else moove.x -= 14 + 12;//14 - зазор от стекла до торца марша, 12 - толщина стекла
		}
	}

	// если для веранды конструктив входной лестницы, тогда сдвигаем лестницу по оси Х на глубину площадки
	if (params.calcType == "vhod" && params.pltType == 'единая с лестницей') {
		moove.x += params.platformLength_3;
	}

	//модифицируем смещение с учетом выбора базовой кромки
	if(params.floorHoleBaseSide == 1){
		if (turnFactor == 1) {
			moove.x += -params.floorHoleLength + params.M / 2;
		}else if(params.stairModel !== 'Прямая'){
			moove.x -= params.M / 2;
			moove.z -= params.floorHoleWidth;
		}else{
			moove.x -= params.M / 2;
			moove.z += getMarshParams(1).len + lastMarshEnd.x + params.nose - params.floorHoleWidth;
		}
		if(params.calcType == "veranda"){
			moove.x += params.floorHoleLength;
			moove.z += params.floorHoleWidth;
		}
	}
	if(params.floorHoleBaseSide == 2){
		if (turnFactor == 1) {
			moove.x += -params.M / 2;
			moove.z += params.floorHoleWidth;
		}else if(params.stairModel !== 'Прямая'){
			moove.x += params.M / 2 - params.floorHoleLength;
		}else{
			moove.x -= params.floorHoleLength - params.M / 2;
			moove.z -= getMarshParams(1).len + lastMarshEnd.x + params.nose;
		}
		if(params.calcType == "veranda"){
			moove.x -= params.floorHoleLength;
			moove.z -= params.floorHoleWidth;
		}
	}

	if(params.floorHoleBaseSide == 3){
		if (window.isMulti) {
			moove.z += params.M / 2;
		}else{
			moove.z += params.M / 2 * turnFactor;
		}
	}

	if(params.floorHoleBaseSide == 4){
		if (turnFactor == 1) {
			moove.x += -params.floorHoleLength;
			moove.z += -params.M / 2 + params.floorHoleWidth;
		}else{
			moove.x += -params.floorHoleLength;
			moove.z += params.M / 2 - params.floorHoleWidth;
		}
	}

	// Считаем пользовательское смещение	
	if (params.floorHoleBaseSide == 1 || params.floorHoleBaseSide == 2) {
		var wallFactor = params.floorHoleBaseSide == 2 ? 1 : -1;
		moove.z -= params.staircasePosX * wallFactor;
		moove.x -= params.staircasePosZ * wallFactor * turnFactor;
	}

	if (params.floorHoleBaseSide == 3 || params.floorHoleBaseSide == 4) {
		var wallFactor = params.floorHoleBaseSide == 4 ? 1 : -1;
		moove.x += params.staircasePosX * wallFactor;
		moove.z -= params.staircasePosZ * wallFactor * turnFactor;
	}

	moove.y += params.staircasePosY;
	moove.rot += params.stairCaseRotation / 180 * Math.PI;

	if (window.isMulti) {
		if (params.connectToFloorHole == 'Да') {
			moove.x += params.floorPosX;
			moove.y += params.floorPosY;
			moove.z += params.floorPosZ;
			moove.rot += params.floorRotation / 180 * Math.PI;
		}else{
			moove.x = params.floorPosX;
			moove.y = params.floorPosY;
			moove.z = params.floorPosZ;
			moove.rot = params.floorRotation / 180 * Math.PI;
		}
	}


	return moove;
	
} //end of calcStaircaseMoove

/** функция устанавливает соответствие между внутренней/наружной и правой/левой стороной лестницы
*/
function getSide(){
	var side = {
		in: "right",
		out: "left",
		}
	if(turnFactor == -1){
		side = {
			in: "left",
			out: "right",
			}
		}
	
	//для прямой лестницы все наоборот
	if(params.stairModel == "Прямая"){
		var temp = side.in;
		side.in = side.out;
		side.out = temp;
		}
		
	return side;
}