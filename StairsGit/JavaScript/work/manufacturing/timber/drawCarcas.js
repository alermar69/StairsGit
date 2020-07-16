// Вывод каркаса всей лестницы

function drawCarcas(par){

	par.mesh1 = new THREE.Object3D();
	par.mesh2 = new THREE.Object3D();

	var dxfX0 = par.dxfBasePoint.x;

	par.stringerParams = [];

	// Каркас нижнего марша

	var marshId = 1;
	par.stringerParams[marshId] = drawMarshStringers(par, marshId);
	par.mesh1.add(par.stringerParams[marshId].mesh1);
	par.mesh2.add(par.stringerParams[marshId].mesh2);

	var stringerParams = par.stringerParams[marshId].params.out;
	var columns = stringerParams.columnsPoints;
	var marshColumnParams = {
		addY: 0,
		columns: columns,
		marshId: marshId,
		dxfBasePoint: stringerParams.dxfBasePoint
	};
	var marshColumns = drawMarshColumns(marshColumnParams).mesh;
	par.mesh1.add(marshColumns);

	if (params.stairModel == 'Прямая') {
		var stringerParams = par.stringerParams[marshId].params.in;
		var columns = stringerParams.columnsPoints;
		var marshColumnParams = {
			addY: 0,
			columns: columns,
			marshId: marshId,
			dxfBasePoint: stringerParams.dxfBasePoint,
			isIn: true,
		};
		var marshColumns = drawMarshColumns(marshColumnParams).mesh;
		marshColumns.position.z += params.M - params.stringerThickness;
		// marshColumns.rotation.y = Math.PI;
		par.mesh1.add(marshColumns);
	}
	// Каркас среднего марша

	if (params.stairModel == "П-образная трехмаршевая") {
		marshId = 2;
		par.stringerParams[marshId] = drawMarshStringers(par, marshId);
		var mesh1 = par.stringerParams[marshId].mesh1;
		var mesh2 = par.stringerParams[marshId].mesh2;
		mesh1.position.x = mesh2.position.x = par.treadsObj.unitsPos.marsh2.x;
		mesh1.position.y = mesh2.position.y = par.treadsObj.unitsPos.marsh2.y;
		mesh1.position.z = mesh2.position.z = par.treadsObj.unitsPos.marsh2.z;
		mesh1.rotation.y = mesh2.rotation.y = par.treadsObj.unitsPos.marsh2.rot;

		par.mesh1.add(mesh1);
		par.mesh2.add(mesh2);

		var stringerParams = par.stringerParams[marshId].params.out;
		var columns = stringerParams.columnsPoints;

		var marshColumnParams = {
			addY: par.treadsObj.unitsPos.marsh2.y,
			columns: columns,
			marshId: marshId,
			dxfBasePoint: stringerParams.dxfBasePoint
		};
		var marshColumns = drawMarshColumns(marshColumnParams).mesh;
		marshColumns.position.x = par.treadsObj.unitsPos.marsh2.x;
		marshColumns.position.z = par.treadsObj.unitsPos.marsh2.z;
		marshColumns.rotation.y = par.treadsObj.unitsPos.marsh2.rot;
		par.mesh1.add(marshColumns);
	}

	if (params.stairModel == "П-образная с забегом") {
		marshId = 2;
		par.isWndP = true;
		par.stringerParams[marshId] = drawMarshStringers(par, marshId);
		var mesh1 = par.stringerParams[marshId].mesh1;
		var mesh2 = par.stringerParams[marshId].mesh2;
		mesh1.position.x = mesh2.position.x = par.treadsObj.unitsPos.turn2.x;
		mesh1.position.y = mesh2.position.y = par.treadsObj.unitsPos.turn2.y;
		mesh1.position.z = mesh2.position.z = par.treadsObj.unitsPos.turn2.z;
		mesh1.rotation.y = mesh2.rotation.y = par.treadsObj.unitsPos.turn2.rot;
		par.mesh1.add(mesh1);
		par.mesh2.add(mesh2);
		par.isWndP = false;

		var stringerParams = par.stringerParams[marshId].params.out;
		var columns = stringerParams.columnsPoints;
		var marshColumnParams = {
			addY: par.treadsObj.unitsPos.turn2.y,
			columns: columns,
			marshId: marshId,
			dxfBasePoint: stringerParams.dxfBasePoint
		};
		var marshColumns = drawMarshColumns(marshColumnParams).mesh;
		marshColumns.position.x = par.treadsObj.unitsPos.turn2.x;
		marshColumns.position.z = par.treadsObj.unitsPos.turn2.z;
		marshColumns.rotation.y = par.treadsObj.unitsPos.turn2.rot;
		par.mesh1.add(marshColumns);
	}

	if (params.stairModel == 'П-образная с площадкой') {
		marshId = 2;
		par.isP = true;
		par.stringerParams[marshId] = drawMarshStringers(par, marshId);
		var mesh1 = par.stringerParams[marshId].mesh1;
		var mesh2 = par.stringerParams[marshId].mesh2;
		mesh1.position.x = mesh2.position.x = par.treadsObj.unitsPos.turn1.x;
		mesh1.position.y = mesh2.position.y = par.treadsObj.unitsPos.turn1.y;
		mesh1.position.z = mesh2.position.z = par.treadsObj.unitsPos.turn1.z;
		mesh1.rotation.y = mesh2.rotation.y = - Math.PI / 2 * turnFactor;
		if (turnFactor == -1) mesh1.position.x = mesh2.position.x += params.platformLength_1 * 2;

		par.mesh1.add(mesh1);
		par.mesh1.add(mesh2);
		par.isP = false;

		var stringerParams = par.stringerParams[marshId].params.out;
		var columns = stringerParams.columnsPoints;
		var marshColumnParams = {
			addY: par.treadsObj.unitsPos.turn1.y,
			columns: columns,
			marshId: marshId,
			dxfBasePoint: stringerParams.dxfBasePoint
		};
		var marshColumns = drawMarshColumns(marshColumnParams).mesh;
		marshColumns.position.x = par.treadsObj.unitsPos.turn1.x;
		marshColumns.position.z = par.treadsObj.unitsPos.turn1.z;
		marshColumns.rotation.y = par.treadsObj.unitsPos.turn1.rot;
		par.mesh1.add(marshColumns);
	}

	//каркас верхнего марша

	if (params.stairModel != 'Прямая') {
		marshId = 3;
		par.stringerParams[marshId] = drawMarshStringers(par, marshId);
		var mesh1 = par.stringerParams[marshId].mesh1;
		var mesh2 = par.stringerParams[marshId].mesh2;
		mesh1.position.x = mesh2.position.x = par.treadsObj.unitsPos.marsh3.x;
		mesh1.position.y = mesh2.position.y = par.treadsObj.unitsPos.marsh3.y;
		mesh1.position.z = mesh2.position.z = par.treadsObj.unitsPos.marsh3.z;
		mesh1.rotation.y = mesh2.rotation.y = par.treadsObj.unitsPos.marsh3.rot;

		par.mesh1.add(mesh1);
		par.mesh2.add(mesh2);

		var stringerParams = par.stringerParams[marshId].params.out;
		var columns = stringerParams.columnsPoints;

		var marshColumnParams = {
			addY: par.treadsObj.unitsPos.marsh3.y,
			columns: columns,
			marshId: marshId,
			dxfBasePoint: stringerParams.dxfBasePoint
		};
		var marshColumns = drawMarshColumns(marshColumnParams).mesh;
		marshColumns.position.x = par.treadsObj.unitsPos.marsh3.x;
		marshColumns.position.z = par.treadsObj.unitsPos.marsh3.z;
		marshColumns.rotation.y = par.treadsObj.unitsPos.marsh3.rot;
		par.mesh1.add(marshColumns);
	}

		//верхний узел

	var unitPar = calcTopUnitParams(par.stringerParams[marshId].params, marshId);
	var topUnit = drawTopUnit(unitPar).mesh;
	topUnit.position.x = par.treadsObj.lastMarshEnd.x;
	topUnit.position.y = par.treadsObj.lastMarshEnd.y;
	topUnit.position.z = par.treadsObj.lastMarshEnd.z;
	topUnit.rotation.y = par.treadsObj.lastMarshEnd.rot;

	par.mesh1.add(topUnit);


	return par;

} //end of drawCarcas

// Вывод каркаса одного марша

function drawMarshStringers(par, marshId){

	var mesh1 = new THREE.Object3D();
	var mesh2 = new THREE.Object3D();

	var stringerParams = getMarshParams(marshId);
	calcStringerParams(stringerParams); //параметры добавляются в объект stringerParams

	//позиция косоуров по Z
	var posZIn = params.M / 2 * turnFactor;
	var posZOut = (-params.M / 2 - 0.01) * turnFactor;

	//внутренний косоур/тетива
	dxfBasePointIn = {x:3000, y: -3000 - 3000 * marshId};
	dxfBasePointOut = {x:3000 + stringerParams.a * stringerParams.stairAmt + 1000, y: -3000 - 3000 * marshId};

	var pos = {
		x: 0,
		y: 0,
		z: posZIn,
	}

	stringerParams2 = {
		marshId: marshId,
		side: "in",
		dxfBasePoint: dxfBasePointIn,
		drawFunction: drawStrightStringer,
		pos: pos, //позиционирование происходит внутри drawComplexStringer
	};

	if (stringerParams.stairAmt > 0 || params.stairModel == 'Прямая') {
		drawComplexStringer(stringerParams2);
		if(!(par.isP || par.isWndP)){
			mesh1.add(stringerParams2.mesh1);
			mesh2.add(stringerParams2.mesh2);
		}
	}

	//внешний косоур/тетива

	var pos = {
		x: 0,
		y: 0,
		z: posZOut,
	}

	stringerParams1 = {
		marshId: marshId,
		side: "out",
		dxfBasePoint: dxfBasePointOut,
		drawFunction: drawStrightStringer,
		pos: pos, //позиционирование происходит внутри drawComplexStringer
	};
	if (params.model == 'косоуры') {
		stringerParams1.topMarshXOffset = 0;
	}

	if (par.treadsObj.wndPar) stringerParams1.turnStepsParams = par.treadsObj.wndPar.params;
	if (par.treadsObj.wndPar2) stringerParams1.turnStepsParams = par.treadsObj.wndPar2.params;
	if (par.stairModel == 'П-образная с забегом') {
		if (par.treadsObj.wndPar) stringerParams1.turnStepsParams = par.treadsObj.wndPar.params;
		if (par.treadsObj.wndPar2) stringerParams1.turnStepsParams2 = par.treadsObj.wndPar2.params;
	}
	if (stringerParams.topTurn !== 'пол') stringerParams1.drawFunction = drawStringer1;
	if (stringerParams.botTurn !== 'пол') stringerParams1.drawFunction = drawStringer3;
	if (stringerParams.topTurn !== 'пол' && stringerParams.botTurn !== 'пол') stringerParams1.drawFunction = drawStringer5;

	//задняя тетива забега/площадки П-образной лестницы
	if (marshId == 2 && (par.isP || par.isWndP)) {
		var platformStringerHeight = 200;
		// dxfBasePoint = newPoint_xy(dxfBasePoint, (b1 * stairAmt1) * 2 + 1000, 0);

		if(params.stairModel == "П-образная с площадкой") {
			pos.x = -params.M / 2;
			pos.z = -params.platformLength_1;
		}

		if(params.stairModel == "П-образная с забегом") {
			pos.x = -110;//FIX
			if (params.model == 'косоуры') {
				pos.x = -16 -(params.rackSize - params.stringerThickness) - (params.marshDist - 20);
				// pos.x += 20.001;
			}
		}

		stringerParams1 = {
			marshId: marshId,
			side: "out",
			dxfBasePoint: newPoint_xy(dxfBasePointIn, 0, 2000),
			drawFunction: drawStringer5,
			topMarshXOffset: params.platformLength_1,
			topMarshZOffset: params.M,
			pos: pos, //позиционирование происходит внутри drawComplexStringer
			isRearP: true, //является задним косоуром П-образной летстницы
		};

		if (stringerParams.botTurn == 'площадка') stringerParams1.drawFunction = drawStringer7;
		if (stringerParams.botTurn == 'забег') stringerParams1.turnStepsParams =  par.treadsObj.wndPar2 ? par.treadsObj.wndPar2.params : par.treadsObj.wndPar.params;
		if (par.treadsObj.wndPar) stringerParams1.turnStepsParams = par.treadsObj.wndPar.params;
		if (par.treadsObj.wndPar2) stringerParams1.turnStepsParams = par.treadsObj.wndPar2.params;
		if(params.stairModel == "П-образная с забегом") {
			if (par.treadsObj.wndPar) stringerParams1.turnStepsParams = par.treadsObj.wndPar.params;
			if (par.treadsObj.wndPar2) stringerParams1.turnStepsParams2 = par.treadsObj.wndPar2.params;
		}
	}

	drawComplexStringer(stringerParams1);
	mesh1.add(stringerParams1.mesh1);
	mesh2.add(stringerParams1.mesh2);

	if (stringerParams.stairAmt == 0) {
		mesh1.position.z -= 0.01;
		mesh2.position.z -= 0.01;
	}

	stringerParams.mesh1 = mesh1;
	stringerParams.mesh2 = mesh2;

	stringerParams.params = {[stringerParams2.side]: stringerParams2, [stringerParams1.side]: stringerParams1};

	return stringerParams;

} //end of drawMarshStringers


// Вывод косоуров промежуточной площадки для "П-образная с площадкой"
function drawPlatformStringers(par){

	var mesh = new THREE.Object3D();
	var mesh1 = new THREE.Object3D();

	var stringerParams = {
		marshId: 1,
		dxfBasePoint: par.dxfBasePoint,
		turnStepsParams: par.turnStepsParams,
		treadsObj: par.treadsObj,
		turnFramesParams: par.turnFramesParams,
		dxfBasePoint: par.dxfBasePoint,
		};

	//задняя тетива/косоур

	stringerParams.key = "rear";

	var rearStringer = drawPltStringer(stringerParams).mesh;

	rearStringer.position.z = -calcTurnParams(1).turnLengthTop * turnFactor;
	if (params.model == "ко") rearStringer.position.z += (params.sideOverHang + 75) * turnFactor;
	if(turnFactor == -1) rearStringer.position.z -= params.stringerThickness;

	rearStringer.position.y = 5;
	if (params.model == "ко") rearStringer.position.y = -params.treadThickness;
	rearStringer.position.x = -params.M * 0.5;
	if (params.model == "ко") rearStringer.position.x += params.sideOverHang;
	mesh.add(rearStringer);

	//уголки на задней тетиве/косоуре
	var side = "left";
	if(turnFactor == -1) side = "right";
	var rearAngles = drawCarcasAngles(stringerParams.pointsHole, side);

	rearAngles.position.x = rearStringer.position.x;
	rearAngles.position.y = rearStringer.position.y;
	rearAngles.position.z = rearStringer.position.z;
	if(side == "left") rearAngles.position.z += params.stringerThickness;

	mesh1.add(rearAngles);
	//колонны на задней тетиве
	stringerParams.anglesPosZ = rearAngles.position.z;
	stringerParams.dxfBasePoint.x += 2000;
	var columnsRear = drawColumnSide(stringerParams, "rear");
	columnsRear.position.x = rearStringer.position.x;
	mesh.add(columnsRear);
	//передняя тетива/косоур

	if (params.model == "ко" || (params.model == "лт" && !hasTreadFrames())){

		stringerParams.key = "front";

		var frontStringer = drawPltStringer(stringerParams).mesh;
		frontStringer.position.z = -(calcTurnParams(1).frontPltStringerOffset + params.stringerThickness)  * turnFactor;
		if(turnFactor == -1) frontStringer.position.z -= params.stringerThickness;

		frontStringer.position.y = -params.treadThickness;
		frontStringer.position.x = -params.M * 0.5;
		if (params.model == "лт") frontStringer.position.x += params.stringerThickness;
		if (params.model == "ко") frontStringer.position.x += params.sideOverHang;
		mesh.add(frontStringer);

		//уголки на передней тетиве/косоуре
		var side = "left";
		if(turnFactor == -1) side = "right";
		var frontAngles = drawCarcasAngles(stringerParams.pointsHole, side);

		frontAngles.position.x = frontStringer.position.x;
		frontAngles.position.y = frontStringer.position.y;
		frontAngles.position.z = frontStringer.position.z;
		if(side == "left") frontAngles.position.z += params.stringerThickness;

		mesh1.add(frontAngles);
	}

	stringerParams.mesh = mesh;
	stringerParams.mesh1 = mesh1;

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
			material: params.materials.timber,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: par.dxfBasePoint,
			text: "",
			}

		var stringerLedge = 5; //выступ тетивы над ступенью для лт

		var columnOffsetZ = profSize.profHeight / 2 * turnFactor;
		if (params.model == "ко") var columnOffsetZ = -(profSize.profHeight / 2 + params.stringerThickness) * turnFactor;
		if (key == "in") columnOffsetZ *= -1;
		if (params.stairModel == "Прямая") columnOffsetZ *= -1;
		var columnOffsetX = 5;
		if (params.model == "ко") columnOffsetX = 0;
		if (params.stairModel == "П-образная с площадкой" && par.key == "rear") columnOffsetX = 0;
		var marshPos = 0;

		if(par.marshId == 2 && !(par.isP || par.isWndP)) marshPos = par.treadsObj.unitsPos.marsh2.y;
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
		if (params.stairModel == "П-образная с площадкой") {
			if(par.marshId == 1 && par.key == "rear" && params.stairModel != "Прямая") {
				if (params.model == "лт") marshPos += stringerLedge;
				if (params.model == "ко") marshPos -= params.treadThickness;
			}
		}

		for(var i=0; i<par.carcasHoles.length; i++){
			if(par.carcasHoles[i].isColumnHole){
				colParams.colLength = par.carcasHoles[i].y + marshPos;
				colParams = drawColumn2(colParams);
				var col1 = colParams.mesh;
				col1.position.x = par.carcasHoles[i].x + profSize.profWidth / 2 - columnOffsetX;
				col1.position.y = par.carcasHoles[i].y;
				if (par.marshId == 1 && par.key == "rear" && params.stairModel != "Прямая") {
					if (params.model == "лт") col1.position.y += stringerLedge;
					if (params.model == "ко") col1.position.y -= params.treadThickness;
				}
				col1.position.z = par.anglesPosZ + columnOffsetZ;
				mesh.add(col1);
				i++; //пропускаем следующее отверстие
			}
		}

	}

	//подкосы
	for(var i=0; i<par.carcasHoles.length; i++){
		var bracePar = {
			width: params.M - params.stringerThickness,
			topJoin: true,
			side: getSide()[key],
			}
		if(par.carcasHoles[i].isBraceHole){
			bracePar = drawBrace(bracePar);
			var brace = bracePar.mesh;
			if(getSide()[key] == "left") brace.rotation.y = Math.PI;
			brace.position.x = par.carcasHoles[i].x;
			brace.position.y = par.carcasHoles[i].y;
			brace.position.z = par.anglesPosZ;
			if(getSide()[key] == "right") brace.position.z -= bracePar.width;
			if(getSide()[key] == "left") brace.position.z += bracePar.width;

			mesh.add(brace);
			i += 4;
			}

	}

	return mesh;
}

function drawStringerHoles(par, typeDop) {

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
		if (!center.rad) center.rad = 6.5
		var hole1 = new THREE.Path();
		addCircle(hole1, dxfPrimitivesArr, center, center.rad, par.dxfBasePoint);
		stringerShape.holes.push(hole1);

		var zencDiam = 20;		// диаметр зенковки
		var layer = "comments";
		var trashShape = new THREE.Shape();

		//не зенковать
		if (center.noZenk && params.boltHead == "countersunk") {
			var pz1 = newPoint_xy(center, -zencDiam, zencDiam);
			var pz2 = newPoint_xy(center, zencDiam, -zencDiam);
			addLine(trashShape, dxfPrimitivesArr, pz1, pz2, par.dxfBasePoint, layer);
			pz1 = newPoint_xy(pz1, 0, -zencDiam * 2);
			pz2 = newPoint_xy(pz2, 0, zencDiam * 2);
			addLine(trashShape, dxfPrimitivesArr, pz1, pz2, par.dxfBasePoint, layer);
		}

		//зенковать с обратной стороны
		if (center.backZenk) {
			addRoundHole(trashShape, dxfPrimitivesArr, center, zencDiam, par.dxfBasePoint, layer);
		}

		//сохраняем координаты для вставки длинных болтов (кроме отверстий рутелей)
		if (center.noZenk && center.rad < 7) {
			par.elmIns[par.key].longBolts.push(center);
		}

	}

}

/*функция рассчитывает параметры косоуров по номеру марша и стороне и добавляет в исходный объект
*/

function calcStringerParams(par){

	par.stringerSideOffset = {
		in: 0,
		out: 0,
		};
	if (params.model == "косоуры"){
		par.stringerSideOffset = {
			in: params.rackSize - params.stringerThickness,
			out: params.rackSize - params.stringerThickness,
			};
		};
	if (params.model == "тетива+косоур"){
		par.stringerSideOffset = {
			in: params.rackSize - params.stringerThickness,
			out: 0,
			};
		}

};

/** функция рассчитывает параметры верхнего узла лестницы
*/
function calcTopUnitParams(par, marshId){
	var topUnitParams = {
		heightIn: 500,
		heightOut: 300,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: {x: 0, y:5000},
		newellType: params.timberNewellType,
		newellTopType: params.newellTopType,
	}
	var marshParams = getMarshParams(marshId);
	//расчет длины столбов

	//длина внутреннего столба
	//выступ столба снизу и сверху от тетивы/косоура
	var rackYTopOffset = 20;
	if(par.in.type === "косоур"){
		rackYTopOffset = marshParams.h + params.treadThickness;
	}
	var rackYBotOffset = 20;

	if (par.in.botLineP1 && par.in.botLineP2) {
		topUnitParams.heightIn = rackYTopOffset + rackYBotOffset + (par.in.botLineP1.y - par.in.botLineP2.y) - params.treadThickness;
	}else{
		topUnitParams.heightIn = 100;
	}

	//длина внешнего столба
	//выступ столба снизу и сверху от тетивы/косоура
	rackYTopOffset = 20;
	if(par.out.type === "косоур"){
		rackYTopOffset = marshParams.h + params.treadThickness;
	}

	if (par.in.botLineP1 && par.in.botLineP2) {
		topUnitParams.heightOut = rackYTopOffset + rackYBotOffset + (par.out.botLineP1.y - par.out.botLineP2.y) - params.treadThickness;
	}else{
		topUnitParams.heightOut = 100;
	}

	return topUnitParams;

} //end of calcTopUnitParams
