/**функция оболочка, отрисовывает плинтус на все варианты геометрии
	par = {
		treadsObj
		dxfBasePoint
		}
*/

function drawSkirting_all(par){

	par.mesh = new THREE.Object3D();
	var dxfBasePoint0 = copyPoint(par.dxfBasePoint);

	// Плинтус нижнего марша
	var marshId = 1;
	var skirting = drawMarshSkirting(par, marshId);
	par.mesh.add(skirting);
	
	// Плинтус второго марша
	par.dxfBasePoint = newPoint_xy(dxfBasePoint0, 5000, 0);
	
	if (params.stairModel == "П-образная трехмаршевая"){
		marshId = 2;		
		var skirting = drawMarshSkirting(par, marshId);	
		skirting.position.x = par.treadsObj.unitsPos.marsh2.x;
		skirting.position.y = par.treadsObj.unitsPos.marsh2.y;
		skirting.position.z = par.treadsObj.unitsPos.marsh2.z;	
		skirting.rotation.y = par.treadsObj.unitsPos.marsh2.rot;			
		par.mesh.add(skirting)
		}
	
	if (params.stairModel == "П-образная с забегом"){
		marshId = 2;
		var skirting = drawMarshSkirting(par, marshId);	
		skirting.position.x = par.treadsObj.unitsPos.turn2.x;
		skirting.position.y = par.treadsObj.unitsPos.turn2.y;
		skirting.position.z = par.treadsObj.unitsPos.turn2.z;	
		skirting.rotation.y = par.treadsObj.unitsPos.turn2.rot;			
		par.mesh.add(skirting)
		}
	
	if (params.stairModel == "П-образная с площадкой"){
		marshId = 2;
		var skirting = drawMarshSkirting(par, marshId);	
		skirting.position.x = par.treadsObj.unitsPos.turn1.x;
		skirting.position.y = par.treadsObj.unitsPos.turn1.y;
		skirting.position.z = par.treadsObj.unitsPos.turn1.z;	
		skirting.rotation.y = par.treadsObj.unitsPos.turn1.rot;			
		par.mesh.add(skirting)
	}	
	
	// Плинтус верхнего марша
	
	if (params.stairModel != "Прямая"){
		marshId = 3;
		par.dxfBasePoint = newPoint_xy(dxfBasePoint0, 10000, 0);
		var skirting = drawMarshSkirting(par, marshId);	
		skirting.position.x = par.treadsObj.unitsPos.marsh3.x;
		skirting.position.y = par.treadsObj.unitsPos.marsh3.y;
		skirting.position.z = par.treadsObj.unitsPos.marsh3.z;	
		skirting.rotation.y = par.treadsObj.unitsPos.marsh3.rot;		
		par.mesh.add(skirting)
	}
	
	return par;

} //end of drawSkirting_all

/** функция отрисовывает плинтус с двух сторон одного марша
	наличие плинтуса по сторонам считается внутри 
	par = {
		treadsObj
		dxfBasePoint
		}
	*/
	
function drawMarshSkirting(par, marshId) {

	var mesh = new THREE.Object3D();
	var marshPar = getMarshParams(marshId);
	var skirtingSectPar = {
		marshId: marshId,
		wndPar: par.treadsObj.wndPar,
		dxfBasePoint: par.dxfBasePoint,
	}
	if (par.treadsObj.wndPar2 && marshId > 2) skirtingSectPar.wndPar = par.treadsObj.wndPar2;
	if (!par.treadsObj.wndPar && par.treadsObj.wndPar2) skirtingSectPar.wndPar = par.treadsObj.wndPar2;
	var dxfBasePoint0 = copyPoint(par.dxfBasePoint);

	//внутренняя сторона марша
	var side = "in";
	if (marshPar.hasSkirting[side]) {
		skirtingSectPar.side = side;
		var sect = drawScirtingSection(skirtingSectPar);
		sect.position.z = params.M / 2 * turnFactor;
		if (turnFactor == 1) sect.position.z -= params.riserThickness;
		mesh.add(sect);
	}

	//внешняя сторона марша
	side = "out"
	if (marshPar.hasSkirting[side]) {
		skirtingSectPar.side = side;
		par.dxfBasePoint = newPoint_xy(dxfBasePoint0, 0, -3000);
		var sect = drawScirtingSection(skirtingSectPar);
		sect.position.z = -params.M / 2 * turnFactor;
		if (turnFactor == -1) sect.position.z -= params.riserThickness;
		mesh.add(sect);
	}

	//задний плинтус площадки П-образной с площадкой
	if (marshId == 2 && params.stairModel == "П-образная с площадкой" && params.riserType == "есть" && params.skirting_plt == "есть") {
		var isScirting1 = getMarshParams(1).hasSkirting.out;
		var isScirting3 = getMarshParams(3).hasSkirting.out;
		var skirtingParams = {
			rise: 0,
			step: params.M * 2 + params.marshDist,
			isLast: true,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: par.dxfBasePoint,
			skirtingDescription: "Плинтус задней стороны площадки ",
		}
		skirtingParams.isNotVerticalPlank = true; //нет вертикальной планки
		if (isScirting1) skirtingParams.step -= params.riserThickness;
		if (isScirting3) skirtingParams.step -= params.riserThickness;

		skirtingParams = drawSkirting2(skirtingParams);
		var skirting = skirtingParams.mesh;
		skirting.position.x = params.platformLength_1 + params.nose;
		if (turnFactor == -1 && params.railingModel !== "Самонесущее стекло") skirting.position.x -= params.riserThickness
		skirting.position.z = (- params.M / 2 + 0.1) * turnFactor;
		if (isScirting1) skirting.position.z += params.riserThickness * turnFactor;
		skirting.rotation.y = -Math.PI / 2 * turnFactor;
		mesh.add(skirting);
	}

	return mesh;
} //end of drawMarshSkirting

/** функция отрисовывает плинтус по одной стороне марша: внешней или внутренней
*@params par = {
	marshId
	side
	dxfBasePoint
	
	}
*/

function drawScirtingSection(par) {

	var marshPar = getMarshParams(par.marshId);
	var prevMarshPar = getMarshParams(marshPar.prevMarshId);
	var nextMarshPar = getMarshParams(marshPar.nextMarshId);
	var mesh = new THREE.Object3D();
	var dxfBasePoint0 = copyPoint(par.dxfBasePoint);

	var skirtingParams = {
		rise: marshPar.h,
		step: marshPar.b,
		isLast: false,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		skirtingDescription: "Плинтус площадки " + par.marshId + " марша ",
	}

	//нижний участок

	var turnPar = calcTurnParams(marshPar.prevMarshId);


	if (par.side == "out" && marshPar.botTurn == "площадка") {
		skirtingParams.skirtingDescription = "Плинтус площадки ";
		skirtingParams.dxfArr = dxfPrimitivesArr;
		skirtingParams.rise = 0;
		skirtingParams.step = turnPar.turnLengthBot + params.nose - 0.1// - params.riserThickness * 2;
		skirtingParams.isNotVerticalPlank = true; //нет вертикальной планки
		//подрезамем плинтус если на нижнем марше тоже есть плинтус
		if (prevMarshPar.hasSkirting.out) skirtingParams.step -= params.riserThickness;
		if (params.stairModel === "П-образная с площадкой")
			skirtingParams.step = params.platformLength_1 + params.nose;

		if (marshPar.stairAmt == 0 && par.marshId == 3) {
			skirtingParams.isLast = true;
		}
		var basePoint = {
			x: params.nose - skirtingParams.step,
			y: 0,
		}
		skirtingParams.dxfBasePoint = newPoint_xy(dxfBasePoint0, basePoint.x, basePoint.y);

		skirtingParams = drawSkirting2(skirtingParams);
		var skirting = skirtingParams.mesh;
		/*
		skirting.position.x = params.nose - skirtingParams.step;
		skirting.position.y = 0;
		*/
		skirting.position.x = basePoint.x;
		skirting.position.y = basePoint.y;
		mesh.add(skirting);

		skirtingParams.isNotVerticalPlank = false;
	}
	if (par.side == "out" && marshPar.botTurn == "забег") {
		//вторая забежная ступень
		//skirtingParams.skirtingDescription = "Плинтус площадки " + 1 + "шт.";
		skirtingParams.dxfArr = dxfPrimitivesArr;
		skirtingParams.rise = 0;
		skirtingParams.step = par.wndPar.params[2].stepWidthX - 0.15// - params.riserThickness * 2;
		skirtingParams.isNotVerticalPlank = true; //нет вертикальной планки
		//подрезамем плинтус если на нижнем марше тоже есть плинтус
		var deltaStep = 0;
		if (params.rackBottom == 'сверху с крышкой' && (marshPar.hasRailing.out || prevMarshPar.hasRailing.out)) {
			if (params.railingModel == "Деревянные балясины" ||
				params.railingModel == "Стекло" ||
				params.railingModel == "Дерево с ковкой") {
				deltaStep = 95;
			} else {
				deltaStep = 40;
			}
		}
		if (prevMarshPar.hasSkirting.out) {
			if (!(params.stairModel == "П-образная с забегом" && par.marshId == 3))
				deltaStep = params.riserThickness;
		}
		skirtingParams.step -= deltaStep;

		var basePoint = {
			x: -turnPar.turnLengthBot,
			y: -marshPar.h,
		}
		//сдвигаем плинтус если на нижнем марше тоже есть плинтус
		if (deltaStep) basePoint.x += deltaStep + 0.1;
		if (marshPar.stairAmt == 0 && !marshPar.lastMarsh) basePoint.x -= ((params.marshDist - 57) + (params.nose - 40));

		skirtingParams.dxfBasePoint = newPoint_xy(dxfBasePoint0, basePoint.x, basePoint.y);

		skirtingParams = drawSkirting2(skirtingParams);
		var skirting = skirtingParams.mesh;
		/*
		skirting.position.x = -turnPar.turnLengthBot;
		//сдвигаем плинтус если на нижнем марше тоже есть плинтус
		if(prevMarshPar.hasSkirting.out) skirting.position.x += params.riserThickness + 0.1;
		skirting.position.y = -marshPar.h;
		*/
		skirting.position.x = basePoint.x;
		skirting.position.y = basePoint.y;
		mesh.add(skirting);

		skirtingParams.isNotVerticalPlank = false;

		//третья забежная ступень
		skirtingParams.skirtingDescription = "Плинтус площадки";
		skirtingParams.dxfArr = dxfPrimitivesArr;
		skirtingParams.rise = marshPar.h;
		if (marshPar.stairAmt == 0 && par.marshId == 3) {
			skirtingParams.isLast = true;
			if (params.topAnglePosition == "вертикальная рамка") skirtingParams.isLast = false;
		}
		//skirtingParams.step = par.wndPar.params[3].stepWidthHi - params.nose - 0.01// - params.riserThickness * 2;
		skirtingParams.nose = 21.824 / Math.cos(par.wndPar.params[3].edgeAngle) + 0.01;
		if (params.calcType == 'timber') skirtingParams.nose = params.nose / Math.cos(par.wndPar.params[3].edgeAngle) + 0.01;
		if (params.calcType == 'timber_stock') skirtingParams.nose = 40 / Math.cos(par.wndPar.params[3].edgeAngle) + 0.01;
		skirtingParams.step = par.wndPar.params[3].stepWidthHi - skirtingParams.nose // - params.riserThickness * 2;
		//if (marshPar.stairAmt == 0) skirting.step += 45;


		var basePoint = {
			x: params.nose - par.wndPar.params[3].stepWidthHi + skirtingParams.nose - 0.01,
			y: -marshPar.h,
		}
		if (marshPar.stairAmt == 0 && marshPar.lastMarsh && params.lastWinderTreadWidth)
			basePoint.x += 45 - (100 - params.lastWinderTreadWidth);
		if (marshPar.stairAmt == 0 && !marshPar.lastMarsh) basePoint.x -= (params.nose - 20);
		skirtingParams.dxfBasePoint = newPoint_xy(dxfBasePoint0, basePoint.x, basePoint.y);

		skirtingParams = drawSkirting2(skirtingParams);
		var skirting = skirtingParams.mesh;
		/*
		skirting.position.x = params.nose - par.wndPar.params[3].stepWidthHi + skirtingParams.nose - 0.01;
		if (marshPar.stairAmt == 0) skirting.position.x += 45 - (100 - params.lastWinderTreadWidth);
		skirting.position.y = -marshPar.h;
		*/
		skirting.position.x = basePoint.x;
		skirting.position.y = basePoint.y;
		mesh.add(skirting);

		skirtingParams.nose = params.nose;
	}

	if (par.side == "in" && marshPar.botTurn == "площадка") {
		skirtingParams.rise = 0;
		skirtingParams.isNotVerticalPlank = true; //нет вертикальной планки

		if (params.stairModel === "П-образная с площадкой") {
			skirtingParams.rise = marshPar.h;
		}
		skirtingParams.step = marshPar.b + params.nose;
		skirtingParams.stepOffsetX = - params.nose; //сдвиг по оси Х

		var basePoint = {
			x: params.nose,
			y: 0,
		}
		if (params.stairModel !== "П-образная с площадкой") basePoint.y = marshPar.h;
		skirtingParams.dxfBasePoint = newPoint_xy(dxfBasePoint0, basePoint.x, basePoint.y);

		skirtingParams = drawSkirting2(skirtingParams);
		var skirting = skirtingParams.mesh;
		/*
		skirting.position.x = params.nose;
		if (params.stairModel !== "П-образная с площадкой") skirting.position.y = marshPar.h;
		*/
		skirting.position.x = basePoint.x;
		skirting.position.y = basePoint.y;
		mesh.add(skirting);

		skirtingParams.isNotVerticalPlank = false;
		skirtingParams.stepOffsetX = 0;
	}

	//плинтус на пригласительных ступенях
	var hasStartTreadScirting = false;
	if (params.stairModel == "Прямая" && marshPar.side[par.side] == params.arcSide) hasStartTreadScirting = true;
	if (params.stairModel != "Прямая" && marshPar.side[par.side] != params.arcSide && params.arcSide != "two")
		hasStartTreadScirting = true;

	if (params.startTreadAmt > 0 && hasStartTreadScirting && par.marshId == 1) {
		skirtingParams.skirtingDescription = "Плинтус площадки ";
		skirtingParams.dxfArr = dxfPrimitivesArr;
		skirtingParams.rise = params.h1;

		var stepName = 'stepLeft';
		if (params.arcSide == "left") stepName = 'stepRight';

		for (var i = 1; i <= params.startTreadAmt; i++) {
			skirtingParams.isNotBotPlank = false; // наличие нижней планки плинтуса
			if (i == 1) skirtingParams.isNotBotPlank = true;

			var treadPar = staircasePartsParams.startTreadsParams[i];
			var treadNextPar = {}; // параметры следующей пригласительной ступени
			if (i + 1 <= params.startTreadAmt) treadNextPar = staircasePartsParams.startTreadsParams[i + 1];
			if (!treadNextPar.stepOff) treadNextPar.stepOff = 0; // сдвиг подступенка, который сверху от края ступени(для радиусных и веера)
			var treadLen = treadPar[stepName];

			// костыль
			// если пригласительных ступеней больше двух, на нижних надо уменьшить длину
			var n = params.startTreadAmt - 1 - i;
			if (n > 0) treadNextPar.stepOff -= params.nose * n;
			treadLen += treadNextPar.stepOff;

			skirtingParams.step = treadLen - params.nose;
			//if (params.fullArcFront == "да") skirtingParams.step += 2; //костыль чтобы не было пересечений

			var basePoint = {
				x: params.b1 * i + params.nose - skirtingParams.step,
				y: params.h1 * (i - 1),
			}
			skirtingParams.dxfBasePoint = newPoint_xy(dxfBasePoint0, basePoint.x, basePoint.y);

			skirtingParams = drawSkirting2(skirtingParams);
			var skirting = skirtingParams.mesh;

			skirting.position.x = basePoint.x;
			if (treadNextPar.stepOff) skirting.position.x += treadNextPar.stepOff;
			skirting.position.y = basePoint.y;
			mesh.add(skirting);
		}
	}

	//марш
	skirtingParams.rise = marshPar.h;
	skirtingParams.step = marshPar.b;
	var startTread = 0;
	if (marshPar.botTurn == "площадка" && par.side == "in" && par.marshId > 1) startTread = 1;
	if (params.startTreadAmt > 0 && par.marshId == 1) startTread = params.startTreadAmt;

	for (var i = startTread; i < marshPar.stairAmt; i++) {
		skirtingParams.isNotBotPlank = false; // наличие нижней планки плинтуса
		if (i == startTread && marshPar.botTurn == "пол" && !hasStartTreadScirting) {
			skirtingParams.isNotBotPlank = true;
		}
		if (i == startTread && marshPar.botTurn == "забег" && par.side == "in") {
			skirtingParams.isNotBotPlank = true;
		}
		if (i == marshPar.stairAmt - 1 && marshPar.topTurn == "пол") {
			skirtingParams.skirtingDescription = "Плинтус последней ступени " + par.marshId + " марша ";
			skirtingParams.dxfArr = dxfPrimitivesArr;
			skirtingParams.dxfBasePoint.x -= 1000;
			if (params.topAnglePosition !== "вертикальная рамка" && params.calcType != 'timber') skirtingParams.isLast = true;
			if (params.calcType == 'timber') skirtingParams.step -= params.nose;
		}

		var basePoint = {
			x: params.nose + marshPar.b * i,
			y: marshPar.h * i,
		}
		skirtingParams.dxfBasePoint = newPoint_xy(dxfBasePoint0, basePoint.x, basePoint.y);

		skirtingParams = drawSkirting2(skirtingParams);
		var skirting = skirtingParams.mesh;
		/*
		skirting.position.x = params.nose + marshPar.b * i;
		skirting.position.y = marshPar.h * i;
		*/
		skirting.position.x = basePoint.x;
		skirting.position.y = basePoint.y;
		mesh.add(skirting);
		//skirtingParams.dxfArr = dxfPrimitivesArr0;
	}

	if ((params.topAnglePosition == "вертикальная рамка" || params.calcType == 'timber') && marshPar.topTurn == "пол") {
		skirtingParams.isLast = true;
		var basePoint = {
			x: params.nose + marshPar.b * marshPar.stairAmt,
			y: marshPar.h * marshPar.stairAmt,
		}
		skirtingParams.nose = params.nose;
		if (params.calcType == 'timber') {
			basePoint.x -= params.nose;
			skirtingParams.nose = 0;
		}
		skirtingParams.step = turnPar.topStepDelta - skirtingParams.nose;
		if (par.side == "out" && marshPar.botTurn == "забег") {
			if (marshPar.stairAmt == 0 && marshPar.lastMarsh)
				basePoint.x += 45 - (100 - params.lastWinderTreadWidth);
		}
		skirtingParams.dxfBasePoint = newPoint_xy(dxfBasePoint0, basePoint.x, basePoint.y);

		skirtingParams = drawSkirting2(skirtingParams);
		var skirting = skirtingParams.mesh;
		skirting.position.x = basePoint.x;
		skirting.position.y = basePoint.y;
		mesh.add(skirting);
	}

	//верхний участок

	if (marshPar.topTurn == "площадка") {
		skirtingParams.skirtingDescription = "Плинтус площадки ";
		skirtingParams.dxfArr = dxfPrimitivesArr;
		skirtingParams.dxfBasePoint.x -= params.M + 500;
		if (par.side == "out") {
			skirtingParams.step = turnPar.turnLengthTop - params.nose;
			if (params.stairModel === "П-образная с площадкой")
				skirtingParams.step = params.platformLength_1;
		}
		if (par.side == "in") {
			skirtingParams.step = turnPar.topMarshOffsetX;
			if (params.stairModel === "П-образная с площадкой")
				skirtingParams.step = 0;
		}

		skirtingParams.isLast = true;

		var basePoint = {
			x: params.nose + marshPar.b * marshPar.stairAmt,
			y: marshPar.h * marshPar.stairAmt,
		}
		skirtingParams.dxfBasePoint = newPoint_xy(dxfBasePoint0, basePoint.x, basePoint.y);

		skirtingParams = drawSkirting2(skirtingParams);
		var skirting = skirtingParams.mesh;
		/*
		skirting.position.x = params.nose + marshPar.b * marshPar.stairAmt;
		skirting.position.y = marshPar.h * marshPar.stairAmt;
		*/
		skirting.position.x = basePoint.x;
		skirting.position.y = basePoint.y;
		mesh.add(skirting);
	}
	if (marshPar.topTurn == "забег") {
		//skirtingParams.skirtingDescription = "Плинтус площадки " + 1 + "шт.";riserThickness

		//первая забежная ступень
		skirtingParams.dxfArr = dxfPrimitivesArr;
		skirtingParams.dxfBasePoint.x -= params.M + 500;

		skirtingParams.nose = params.nose;
		if (marshPar.stairAmt == 0 && !marshPar.lastMarsh) skirtingParams.nose = 20;

		if (par.side == "out") {
			skirtingParams.step = par.wndPar.params[1].stepWidthHi - skirtingParams.nose - params.riserThickness * Math.tan(par.wndPar.params[1].edgeAngle);
		}
		if (par.side == "in")
			skirtingParams.step = par.wndPar.params[1].stepWidthLow - skirtingParams.nose;
		//skirtingParams.step = par.wndPar.params[1].stepWidthLow + 60 - skirtingParams.nose;

		skirtingParams.isLast = false;

		var basePoint = {
			x: skirtingParams.nose + marshPar.b * marshPar.stairAmt,
			y: marshPar.h * marshPar.stairAmt,
		}
		skirtingParams.dxfBasePoint = newPoint_xy(dxfBasePoint0, basePoint.x, basePoint.y);

		skirtingParams = drawSkirting2(skirtingParams);
		var skirting = skirtingParams.mesh;
		/*
		skirting.position.x = params.nose + marshPar.b * marshPar.stairAmt;
		skirting.position.y = marshPar.h * marshPar.stairAmt;
		*/
		skirting.position.x = basePoint.x;
		skirting.position.y = basePoint.y;
		mesh.add(skirting);

		//вторая забежная ступень
		if (par.side == "out") {
			skirtingParams.step = par.wndPar.params[2].stepWidthY - 20.525 / Math.cos(par.wndPar.params[1].edgeAngle) + params.riserThickness * Math.tan(par.wndPar.params[1].edgeAngle);
			skirtingParams.nose = 20.525 / Math.cos(par.wndPar.params[1].edgeAngle);
			if (params.stairModel == "П-образная с забегом" && par.marshId == 2 && nextMarshPar.hasSkirting.out)
				skirtingParams.step -= params.riserThickness;
			//skirtingParams.step = par.wndPar.params[2].stepWidthY - params.nose;
			skirtingParams.rise = nextMarshPar.h;
			skirtingParams.isLast = true;
			var basePoint = {
				x: marshPar.b * marshPar.stairAmt + par.wndPar.params[1].stepWidthHi - params.riserThickness * Math.tan(par.wndPar.params[1].edgeAngle),
				y: marshPar.h * marshPar.stairAmt + marshPar.h,
				//y: marshPar.h * marshPar.stairAmt + nextMarshPar.h,
			}
			skirtingParams.dxfBasePoint = newPoint_xy(dxfBasePoint0, basePoint.x, basePoint.y);

			skirtingParams = drawSkirting2(skirtingParams);
			var skirting = skirtingParams.mesh;
			/*
			skirting.position.x = marshPar.b * marshPar.stairAmt + par.wndPar.params[1].stepWidthHi - params.riserThickness * Math.tan(par.wndPar.params[1].edgeAngle);
			skirting.position.y = marshPar.h * marshPar.stairAmt + nextMarshPar.h;
			*/
			skirting.position.x = basePoint.x;
			skirting.position.y = basePoint.y;
			mesh.add(skirting);
		}
	}

	return mesh;

}

/** Функция отрисовывает вертикальный и горизонтальную планку плинтуса (к-т на одну ступень)
*/


function drawSkirting2(par) {
	par.mesh = new THREE.Object3D();
	var width = 60;
	var frontEdgeRad = 3;
	var rad1 = 10;
	var rad2 = 6;
	if (params.nose < 0) params.nose = 0;
	var extrudeOptions = {
		amount: params.riserThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	var gap = 0.1; //зазор от плинтуса до ступени/подступенка

	var nose = params.nose;
	if (par.nose || par.nose === 0) nose = par.nose;
	nose += 0.01;

	// вертикальная планка
	if (par.rise != 0 && !par.isNotVerticalPlank) {
		var shape = new THREE.Shape();

		var p0 = { "x": 0.0, "y": gap };
		//if (!par.isNotBotPlank) 
		//p0.y += width; // если внизу есть горизонтальная планка
		var p1 = newPoint_xy(p0, -width, 0);
		var p2 = newPoint_xy(p1, 0, par.rise - params.treadThickness - gap);
		//if (!par.isNotBotPlank) p2.y -= width; // если внизу есть горизонтальная планка
		var p3 = newPoint_xy(p2, width, 0);
		var points = [p0, p1, p2, p3];

		//создаем шейп
		var shapePar = {
			points: points,
			dxfArr: par.dxfArr,
			dxfBasePoint: par.dxfBasePoint,
		}

		var shape = drawShapeByPoints2(shapePar).shape;

		var extrudeOptions = {
			amount: params.riserThickness,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};
		//косоур на марше
		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var vert_plate = new THREE.Mesh(geom, params.materials.skirting);
		vert_plate.position.x -= gap;
		par.mesh.add(vert_plate);

	}

	//горизонтальная планка

	if (par.step != 0) {
		var ledge = width + rad1;
		if (par.isNotVerticalPlank) ledge = 0
		var length = par.step + ledge;
		if(!par.isLast) length -= width;
		par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, - ledge, par.rise);

		var shape = new THREE.Shape();
		var p0 = { "x": 0.0, "y": 0.0 };
		if (par.stepOffsetX) p0.x += par.stepOffsetX;//сдвиг по оси Х
		var p1 = newPoint_xy(p0, 0, width);
		var p2 = newPoint_xy(p1, length, 0);
		var p3 = newPoint_xy(p2, 0, -width);

		if (par.isNotVerticalPlank) {
			var points = [p0, p1, p2, p3];
		}
		else {
			p0 = newPoint_xy(p0, 0, -params.treadThickness);
			var p5 = newPoint_xy(p0, ledge - nose, 0);
			var p4 = newPoint_xy(p5, 0, params.treadThickness);
			p1.filletRad = rad1;
			p0.filletRad = rad2;
			p4.filletRad = rad2;
			if(testingMode) p4.filletRad = 0;
			var points = [p0, p1, p2, p3, p4, p5];
		}

		var dxfBasePoint = newPoint_xy(par.dxfBasePoint, 100, 0);

		//создаем шейп
		var shapePar = {
			points: points,
			dxfArr: par.dxfArr,
			dxfBasePoint: par.dxfBasePoint,
			markPoints: true,
		}

		var shape = drawShapeByPoints2(shapePar).shape;

		geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var hor_plate = new THREE.Mesh(geometry, params.materials.skirting);
		hor_plate.position.y = par.rise + gap;
		hor_plate.position.x -= gap + ledge;
		par.mesh.add(hor_plate);

		if (!testingMode) {
			var siliconePar = {
				description: "Крепление плинтусов",
				group: "Ступени",
				len: par.rise - params.treadThickness,
			}
			if (par.isNotVerticalPlank) siliconePar.len = length;

			var silicone = drawSilicone(siliconePar).mesh;
			if (par.isNotVerticalPlank) {
				silicone.position.x += length / 2;
				silicone.position.z += params.riserThickness * turnFactor;
				silicone.rotation.z = Math.PI / 2;
			}
			else {
				silicone.position.y += siliconePar.len / 2;
			}
			par.mesh.add(silicone);
		}
	}

	var text = par.skirtingDescription;
	var textHeight = 30;
	var textBasePoint = newPoint_xy(par.dxfBasePoint, 0, -100)
	addText(text, textHeight, par.dxfArr, textBasePoint);


	//сохраняем данные для спецификации
	var partName = "skirting_vert";
	if (typeof specObj != 'undefined' && par.rise != 0 && !par.isNotVerticalPlank) {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Планка плинтуса верт.",
				area: 0,
				paintedArea: 0,
				metalPaint: false,
				timberPaint: true,
				division: "timber",
				workUnitName: "area", //единица измерения
				group: "skirting",
			}
		}
		var len = par.rise + width;
		var area = len * width / 1000000;
		var paintedArea = area * 2 + (len + width) * 2 * params.riserThickness / 1000000;

		var name = Math.round(len) + "x" + Math.round(width) + "x" + params.riserThickness;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		specObj[partName]["paintedArea"] += paintedArea;
	}
	if(vert_plate) vert_plate.specId = partName + name;

	var partName = "skirting_hor";
	if (typeof specObj != 'undefined' && par.step != 0) {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Планка плинтуса гор.",
				area: 0,
				paintedArea: 0,
				metalPaint: false,
				timberPaint: true,
				division: "timber",
				workUnitName: "area", //единица измерения
				group: "skirting",
			}
		}
		var len = length;
		var area = len * width / 1000000;
		var paintedArea = area * 2 + (len + width) * 2 * params.riserThickness / 1000000;

		var name = Math.round(len) + "x" + Math.round(width) + "x" + params.riserThickness;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		specObj[partName]["paintedArea"] += paintedArea;
	}
	if(hor_plate) hor_plate.specId = partName + name;



	return par;


}//end of drawSkirting2




