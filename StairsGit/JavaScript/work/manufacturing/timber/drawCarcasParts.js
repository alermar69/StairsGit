var treadThickness = 40;
//обозначение точек здесь  http://6692035.ru/drawings/timber/stringer_parts.pdf
var techDelta = 0.025;//велечина зазора чтобы небыло пересечений
/*функция-оболочка, отрисовывающая косоур/тетиву, состоящую из двух слоев: внутренний слой с пазами, внешний без*/

function drawComplexStringer(par){
	par.mesh1 = new THREE.Object3D();
	par.mesh2 = new THREE.Object3D();

	var railingRacks = calcRailingRacks({marshId:par.marshId, side:par.side});
	par.keyPoints = {};
	par.columnsPoints = [];

	if (railingRacks.botFirst) par.keyPoints.botFirst = railingRacks.botFirst;
	if (railingRacks.marshFirst) par.keyPoints.marshFirst = railingRacks.marshFirst;
	if (railingRacks.marshLast) par.keyPoints.marshLast = railingRacks.marshLast;
	if (railingRacks.topLast) par.keyPoints.topLast = railingRacks.topLast;

	//часть без пазов
	par.slots = false;
	par.drawFunction(par);
	for(var i = 0; i < par.meshes.length; ++i){
		var part = par.meshes[i];
		part.position.x = par.pos.x;
		part.position.y = par.pos.y;
		part.position.z = par.pos.z;

		if(par.side == "in") {
			if(turnFactor == 1) part.position.z += -params.stringerThickness + params.stringerSlotsDepth - par.stringerSideOffset
			if(turnFactor == -1) part.position.z += par.stringerSideOffset
			}
		if(par.side == "out") {
			if(turnFactor == 1) part.position.z +=  par.stringerSideOffset
			if(turnFactor == -1) part.position.z += -par.stringerSideOffset - params.stringerThickness + params.stringerSlotsDepth
			}
		par.mesh1.add(part);

		}

	//часть с пазами
	par.slots = true;
	par.drawFunction(par);
	for(var i = 0; i < par.meshes.length; ++i){
		var part = par.meshes[i];
		part.position.x = par.pos.x;
		part.position.y = par.pos.y;
		part.position.z = par.pos.z;
		if(par.side == "in") {
			part.position.z += (-params.stringerThickness - par.stringerSideOffset) * turnFactor;
			if(turnFactor == -1) part.position.z += -params.stringerSlotsDepth;
			}
		if(par.side == "out") {
			if(turnFactor == 1) part.position.z += params.stringerThickness - params.stringerSlotsDepth + par.stringerSideOffset;
			if(turnFactor == -1) part.position.z += -par.stringerSideOffset - params.stringerThickness
			}
		par.mesh2.add(part);
	}
	
	var posZ = par.pos.z;
	if(par.side == "in") {
		posZ += (-params.stringerThickness / 2 - par.stringerSideOffset) * turnFactor;
	}
	if(par.side == "out") {
		if(turnFactor == 1) posZ += params.stringerThickness / 2 + par.stringerSideOffset;
		if(turnFactor == -1) posZ += -par.stringerSideOffset - params.stringerThickness / 2
	}

	if(getMarshParams(par.marshId).lastMarsh){
		var screwPar = {
			id: "screw_8x120",
			description: "Крепление выходного узла к каркасу",
			group: "Каркас",
			hasShim: true
		}

		var bolt = new THREE.Object3D();
		var screw = drawScrew(screwPar).mesh;
		bolt.add(screw);

		var plug = drawTimberPlug(25);
		plug.position.y = - screwPar.len / 2 - 2
		bolt.add(plug);
		
		bolt.position.x = par.keyPoints.topPoint.x
		bolt.position.y = par.keyPoints.topPoint.y + 20;
		bolt.position.z = posZ;
		bolt.rotation.z = Math.PI / 2;
		if(!testingMode)	par.mesh1.add(bolt);

		//----------------------------------------
		var bolt = new THREE.Object3D();
		var screw = drawScrew(screwPar).mesh;
		bolt.add(screw);		

		var plug = drawTimberPlug(25);
		plug.position.y = - screwPar.len / 2 - 2;
		bolt.add(plug);
		
		bolt.position.x = par.keyPoints.topPoint.x
		bolt.position.y = par.keyPoints.topPoint.y + 20 + 200;
		bolt.position.z = posZ;
		bolt.rotation.z = Math.PI / 2;
		if (!testingMode) par.mesh1.add(bolt);
	}

	if (par.side == 'in' && !getMarshParams(par.marshId).lastMarsh) {
		var screwPar = {
			id: "screw_8x120",
			description: "Крепление косоуров к столбу",
			group: "Каркас",
			hasShim: true
		}
		var screw = drawScrew(screwPar).mesh;
		screw.rotation.z = Math.PI / 2
		screw.position.x = par.keyPoints.topPoint.x - 60 + params.rackSize + 0.5;
		screw.position.y = par.keyPoints.topPoint.y - 100;
		screw.position.z = posZ;
		if(!testingMode)	par.mesh1.add(screw);
		
		var plug = drawTimberPlug(25);
		plug.rotation.z = Math.PI / 2
		plug.position.x = par.keyPoints.topPoint.x + params.rackSize + 1 + 0.5;
		plug.position.y = par.keyPoints.topPoint.y - 100;
		plug.position.z = posZ;
		if(!testingMode)	par.mesh1.add(plug);
	}

	if (par.side == 'in' && par.marshId != 1) {
		var screwPar = {
			id: "screw_8x120",
			description: "Крепление косоуров к столбу",
			group: "Каркас",
			hasShim: true
		}
		var screw = drawScrew(screwPar).mesh;
		screw.rotation.z = -Math.PI / 2
		screw.position.x = par.keyPoints.botPoint.x + 60 - params.rackSize - 0.5;
		screw.position.y = par.keyPoints.botPoint.y + 200;
		screw.position.z = posZ;
		if(!testingMode)	par.mesh1.add(screw);
		
		var plug = drawTimberPlug(25);
		plug.rotation.z = -Math.PI / 2
		plug.position.x = par.keyPoints.botPoint.x - params.rackSize - 1 - 0.5;
		plug.position.y = par.keyPoints.botPoint.y + 200;
		plug.position.z = posZ;
		if(!testingMode)	par.mesh1.add(plug);
	}

	//signKeyPoints(par.keyPoints, par.dxfBasePoint);

	//крайние точки - надо снимать с контуров
	// par.keyPoints.botPoint = par.keyPoints.marshFirst; //временная точка - надо исправить
	// par.keyPoints.topPoint = par.keyPoints.marshLast; //надо исправить

	par.maxLen = distance(par.keyPoints.botPoint, par.keyPoints.topPoint);
	//линия между крайними точками для наглядности
	var trashShape = new THREE.Shape();
	var layer = "comments";
	addLine(trashShape, dxfPrimitivesArr, par.keyPoints.botPoint, par.keyPoints.topPoint, par.dxfBasePoint, layer);

	var partName = "stringer";
	if (getMarshParams(par.marshId).stairAmt > 0) {
		if (typeof specObj != 'undefined'){
			if (!specObj[partName]){
				specObj[partName] = {
					types: {},
					amt: 0,
					name: "Тетива",
					area: 0,
					paintedArea: 0,
					metalPaint: false,
					timberPaint: true,
					division: "timber",
					workUnitName: "area", //единица измерения
					group: "stringers",
				}
				if(par.type == "косоур") specObj[partName].name = "Косоур";
			}
			var stringerNname = (par.side === 'out' ? 'внешн. ' : 'внутр. ') + par.marshId + " марш";
	
			var name = stringerNname + " L=" + Math.round(par.maxLen);
			var area = 300 * par.maxLen / 1000000;
	
			if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
			if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
			specObj[partName]["amt"] += 1;
			specObj[partName]["area"] += area;
			specObj[partName]["paintedArea"] += area * 2;
		}
		
		par.mesh1.specId = partName + name;
	}
	
	return par;
}

/*	универсальная функция для отрисовки внутренних тетив и косоуров, а также тетив и косоуров прямой одномаршевой лестницы */

function drawStrightStringer(par){

	var stringerHoles = [];// Массив выдавливаемых отверстий, для тестов.

	//рассчитываем параметры косоура по номеру марша и стороне
	calcStringerPar(par);

	//именованные ключевые точки
	// if(!par.keyPoints) par.keyPoints = {};
	par.keyPoints.zeroPoint = {x:0, y:0};

	var thk = params.stringerThickness - params.stringerSlotsDepth;
	if(par.slots == true) thk = params.stringerSlotsDepth
	var extrudeOptions = {
		amount: thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var marshPar = getMarshParams(par.marshId); //функция в файле inputsReading.js
	var h = marshPar.h;
	var b = marshPar.b;
	var a = marshPar.a;
	var stairAmt = marshPar.stairAmt
	var risers = params.riserType == "есть";

	var dxfBasePoint = par.dxfBasePoint;
	//выводим в dxf только конутур с пазами
	var dxfArr = dxfPrimitivesArr;
	if(!par.slots) dxfArr = [];

	par.slotsOffset = 20;

	var topPointOffsetY = 20; //отступ среза верхнего угла тетивы от уровня верхнего перекрытия для регулировки

	par.meshes = [];

	var stringerWidth = 300;
	if(par.type == "косоур") {
		stringerWidth = 200;
		if (params.calcType == 'timber_stock') stringerWidth = 228;
	}
	par.width = stringerWidth;

	var stairAngle = Math.atan(h/b)
	par.stairAngle = stairAngle

	var stringerOffset_y = 0;

	var stringerShape = new THREE.Shape();

	var text = par.treadDescription;
	var textHeight = 30;
	var textBasePoint = newPoint_xy(dxfBasePoint, 0, -100)
	addText(text, textHeight, dxfArr, textBasePoint);

	//нижние точки
	var botLine = calcBotStepPoints(par);

	var topLineP0 = botLine.topLineP0;
	var topLineP01 = botLine.topLineP01;
	var topLineP02 = botLine.topLineP02;
	var topLineP1 = botLine.topLineP1;
	var topLineP10 = botLine.topLineP10;
	var topLineP11 = botLine.topLineP11;
	var botLineP10 = botLine.botLineP10;
	var bottomLine = botLine.bottomLine;

	//массив точек внешнего контура косоура
	var topLine = [];


	if (par.type == "косоур") {
		//сохраняем точку для ограждений
		// par.keyPoints.marshRailingP1 = copyPoint(topLineP10);

		topLine.push(topLineP0)
		//паз под подступенок
		if(params.riserType == "есть" && par.botEnd == "столб" && par.slots && params.calcType != "timber_stock"){
			topLine.push(topLineP01)
			topLine.push(topLineP02)
		}
		//уступ чтобы дотянуться косоуром до столба
		if((params.riserType == "есть" || params.stairModel == "П-образная с площадкой") && par.botEnd != "пол" && params.calcType == "timber_stock"){
			topLine.push(topLineP01)
			topLine.push(topLineP02)
		}
		topLine.push(topLineP1)
		topLine.push(topLineP10)
		if (testingMode) {
			topLineP10.y -= 0.01
		}

		//цикл построения ступеней
		var p2 = newPoint_xy(topLineP10, 0.01, 0);

		for(var i = 1; i < stairAmt-1; ++i) {
			p2 = newPoint_xy(p2, 0, h); //подъем ступени
			topLine.push(p2);
			p2 = newPoint_xy(p2, b, 0);
			topLine.push(p2); //проступь
		}

		//последний подъем ступени
		p2 = newPoint_xy(p2, -0.01, h);
		topLine.push(p2);

		//проступь
		var botLineP1 = newPoint_xy(p2, b - nose, 0);
		if(risers) botLineP1 = newPoint_xy(botLineP1, -params.riserThickness, 0);

		var newellSlotDepth = par.newellSlotDepth; //глубина паза в столбе под косоур
		if(par.topEnd == "столб") {
			var treadOffset = 10; //отступ края ступени от края столба
			if (params.stairModel == 'П-образная с площадкой') {
				treadOffset = 30
			}
			//fix
			botLineP1 = newPoint_xy(botLineP1, -treadOffset + newellSlotDepth - 0.05, 0);
		}

		if(params.calcType == "timber_stock") {
			botLineP1 = newPoint_xy(p2, b, 0);
			if(risers && marshPar.lastMarsh) botLineP1 = newPoint_xy(botLineP1, -params.riserThickness, 0);
		}
		
		topLine.push(botLineP1);

		//контур нижней части косоура

		//Точка пересечения нижней линии с задней линией
		var botLineP2 = itercection(botLineP1, newPoint_xy(botLineP1, 0, 100), bottomLine.p1, bottomLine.p2);
		//массив точек нижней линии
		var botLine = [botLineP2, botLineP10];

		//вырез внизу косоура для вставки в столб
		if(par.topEnd == "столб" && params.calcType != "timber_stock") {
			var notchHeight = 30; //высота выреза снизу косоура
			var botLineP4 = newPoint_x1(botLineP2, -newellSlotDepth, par.stairAngle)
			var botLineP3 = newPoint_xy(botLineP4, 0, notchHeight);
			botLineP2 = newPoint_xy(botLineP3, newellSlotDepth, 0);
			botLine = [botLineP2, botLineP3, botLineP4, botLineP10];
		}

		//вырез под колонну
		if(par.column){
			var notchPar = {
				points: botLine,
				notchCenterX:  (Math.floor(stairAmt / 2) + 1) * a + params.rackSize / 2 - 40 + (params.riserType == 'есть' ? params.riserThickness : 0), //40 подогнано
				isBotLine: true,
			}
			botLine = addNotch(notchPar).points;
			var columnPos = copyPoint(notchPar.notchCenterPoint);
			// columnPos.treadYOffset = h + params.treadThickness;
			columnPos.treadYOffset = ((Math.floor(stairAmt / 2) + 1) * h + h) - columnPos.y;//+ params.treadThickness;
			if (par.slots) par.columnsPoints.push(columnPos);

			par.excerptDepth = 100;
		}
				
		if (stairAmt == 1) {
			topLine = [];
			
			if (params.riserType == 'есть') {
				topLineP0.x += params.riserThickness;
			}
			if (!par.slots && params.riserType == 'есть') {
				topLineP1.x += params.riserThickness;
			}
			
			// topLine.push(newPoint_xy(topLineP0, -5, 0))
			// topLine.push(newPoint_xy(topLineP1, -5, 0))

			topLineP0.y = topLineP1.y - h;
			var botPoint2 = newPoint_xy(topLineP0, a - params.nose - 0.1, 0);

			topLine.push(topLineP0)
			topLine.push(topLineP1)
			topLine.push(newPoint_xy(topLineP1, a - params.nose - 0.1, 0));
			
			// if (params.riserType == 'есть') {
			// 	botPoint.x += params.riserThickness;
			// }
			
			botLine = [botPoint2];
		}

		//Переменные отвечают за наличие отверстий под крепеж к столбу на timber_stock
		var hasBotFixingHoles = true;
		var hasTopFixingHoles = true;

		if (params.calcType == 'timber_stock' && stairAmt == 0) {
			botLine = [];
			topLine = [];
			var length = params.marshDist + params.nose;
			if (params.riserType == 'нет') length -= params.riserThickness;
			if (par.marshId == 2 && params.stairModel == 'П-образная с забегом' && par.side == 'in') {
				length = params.marshDist;
			}

			var p1 = {x: -params.marshDist + params.nose, y: -params.treadThickness};
			var p2 = newPoint_xy(p1, 0, -228);
			var p3 = newPoint_xy(p1, length, -228);
			var p4 = newPoint_xy(p1, length, 0);
			botLine.push(p2, p3);
			topLine.push(p4, p1);

			hasBotFixingHoles = false;
			hasTopFixingHoles = false;
		}

		if (params.calcType == 'timber_stock' && par.marshId == 1 && stairAmt == 1) {
			botLine = [];
			topLine = [];
			var length = b;
			var p1 = {x: params.nose, y: h - params.treadThickness};
			if (params.riserType == 'есть') p1.x += params.riserThickness

			var p2 = newPoint_xy(p1, 0, -h + params.treadThickness);
			var p3 = newPoint_xy(p1, length, -h + params.treadThickness);
			var p4 = newPoint_xy(p1, length, 0);
			botLine.push(p2, p3);
			topLine.push(p4, p1);

			botLineP1 = copyPoint(p4);

			hasBotFixingHoles = false;
			hasTopFixingHoles = false;

			par.keyPoints.botPoint = p2;
		}

		if (params.calcType == 'timber_stock' && stairAmt == 1 && par.marshId !== 1) {
			botLine = [];
			topLine = [];

			var height = 228;
			// if (marshPar.botTurn == 'площадка') {
			// 	height = ((marshPar.h - params.treadThickness) > 228 ? 228 : (marshPar.h - params.treadThickness));
			// }

			//base(topline)
			var p1 = {x: params.nose, y: -params.treadThickness};
			//bot
			var p2 = newPoint_xy(p1, 0, -height);
			// if (marshPar.topTurn == 'забег' && getMarshParams(marshPar.prevMarshId).stairAmt > 0) {
			// 	height = 228;
			// 	p2 = newPoint_xy(p1, 0, -height);
			// 	hasFixingHoles = true;
			// }
			var p3 = newPoint_xy(p2, a, h);
			if (params.riserType == 'нет') p3.x -= params.nose;

			//top
			var p4 = newPoint_xy(p1, 0, 0);
			if (params.riserType == 'есть') {
				var p4 = newPoint_xy(p1, params.riserThickness, 0);
			}
			var p5 = newPoint_xy(p4, 0, h);
			var p6 = newPoint_xy(p5, b, 0);
			
			//Корректируем точки в случае если снизу площадка и 0 ступеней
			// if (marshPar.botTurn == 'площадка' && getMarshParams(marshPar.prevMarshId).stairAmt == 0) {
			// 	p2.y = p1.y - getMarshParams(marshPar.prevMarshId).h + params.treadThickness;
			// 	p3 = newPoint_xy(p2, a, h);

			// 	if (marshPar.topTurn == 'забег') {
			// 		p3.y = p6.y - 228;
			// 		if (p3.y < p2.y) p3.y = p2.y;
			// 	}
			// 	hasBotFixingHoles = false;
			// 	hasTopFixingHoles = false;
			// }
			
			botLine.push(p2, p3);
			topLine.push(p6, p5, p4, p1);
			
			topLineP0 = newPoint_xy(p1, 0, -228); // bot
			botLineP1 = p6; // top
			if (par.marshId == 3) {//3 марш всегда без отверстий
				hasBotFixingHoles = false;
				hasTopFixingHoles = false;
			}
		}

		var shapePar = {
			points: topLine.concat(botLine),
			dxfArr: dxfArr,
			dxfBasePoint: par.dxfBasePoint,
			markPoints: true //пометить точки в dxf для отладки
		}
		if (par.slots) shapePar.drawing = {group: "stringer", dimPoints:[{p1: par.keyPoints.botPoint, p2: par.keyPoints.topPoint, type:'dist'}]};		
		stringerShape = drawShapeByPoints2(shapePar).shape;

		//отверстия для крепления ступеней
		if(par.slots == true){
			var xSlotOffset = 25.5;
			var ySlotOffset = 25.5;
			var slotDiam = 25.5;

			var treadMetis = new THREE.Object3D();
			var screwPar = {
				id: "screw_4x35",
				description: "Крепление ступеней к косоуру",
				group: "Ступени"
			}
			
			for(var i = 0; i < stairAmt; ++i) {
				var center = {x: b * i + (a - b) + (risers == true ? params.riserThickness : 0) + xSlotOffset,y:h * (i + 1) - params.treadThickness - ySlotOffset}
				addRoundHole(stringerShape, dxfArr, center, slotDiam/2, dxfBasePoint);

				var screw = drawScrew(screwPar).mesh;
				screw.position.x = center.x;
				screw.position.y = center.y;
				screw.position.z = 0;
				if (turnFactor == -1) screw.position.z = params.stringerSlotsDepth;
				if(!testingMode) treadMetis.add(screw);
	
				var plug = drawTimberPlug(25);
				plug.position.x = center.x;
				plug.position.y = center.y;
				// if (turnFactor == 1) plug.position.z = params.stringerSlotsDepth;
				plug.rotation.z = Math.PI / 2;
				plug.rotation.y = Math.PI / 2;
				if(!testingMode) treadMetis.add(plug);
				
				if(params.riserType == "нет"){
					var center2 = newPoint_xy(center, marshPar.b - xSlotOffset * 3, 0);
					addRoundHole(stringerShape, dxfArr, center2, slotDiam/2, dxfBasePoint);

					var screw = drawScrew(screwPar).mesh;
					screw.position.x = center2.x;
					screw.position.y = center2.y;
					screw.position.z = 0;
					// if (turnFactor == -1) screw.position.z = params.stringerSlotsDepth;
					if(!testingMode) treadMetis.add(screw);
		
					var plug = drawTimberPlug(25);
					plug.position.x = center2.x;
					plug.position.y = center2.y;
					if (turnFactor == 1) plug.position.z = params.stringerSlotsDepth;
					plug.rotation.z = Math.PI / 2;
					plug.rotation.y = Math.PI / 2;
					if(!testingMode) treadMetis.add(plug);
				}
			}
			par.meshes.push(treadMetis);
		}

		//сохраняем точки для отрисовки верхнего столба
		par.botLineP1 = copyPoint(botLineP1);
		par.botLineP2 = copyPoint(botLineP2);

		par.keyPoints.botPoint = topLineP0;
		par.keyPoints.topPoint = botLineP1;
		//сохраняем точки для столбов ограждений
		// par.keyPoints.rack1Pos = newPoint_xy(topLineP0, - params.rackSize/2, 0);
		// if(par.botEnd == "пол" && params.riserType == "есть") par.keyPoints.rack1Pos.x -= params.riserThickness;
		// if(par.botEnd == "столб") par.keyPoints.rack1Pos.x += newellSlotDepth;
		// if(par.botEnd == "пол" && params.firstNewellPos == "на первой ступени") par.keyPoints.rack1Pos = newPoint_xy(par.keyPoints.rack1Pos, params.rackSize, h);
		// if(par.botEnd == "пол" && params.firstNewellPos == "на второй ступени") par.keyPoints.rack1Pos = newPoint_xy(par.keyPoints.rack1Pos, params.rackSize + a, h * 2);

		// par.keyPoints.rack2Pos = newPoint_xy(botLineP1, params.rackSize/2, 0);
		// if(par.topEnd == "столб") par.keyPoints.rack2Pos.x -= newellSlotDepth;
	} //конец косоура

	if (par.type == "тетива") {

		var newellSlotDepth = params.stringerSlotsDepth; //глубина паза в столбе под тетиву
		// if (params.stairModel == "П-образная трехмаршевая" && marshPar.topTurn == 'забег' && params.model == 'тетивы') {
		// 	newellSlotDepth += 20;//FIX
		// }
		// if (params.stairModel == "П-образная с забегом" && params.model == 'тетивы') {
		// 	newellSlotDepth += 20;//FIX
		// }
		// if (params.stairModel == "Г-образная с забегом") {
		// 	newellSlotDepth += 20;//FIX
		// }
		//сохраняем точки для ограждений
		par.keyPoints.marshRailingP1 = copyPoint(topLineP1);
		par.keyPoints.marshFirstRailingPoint = copyPoint(topLineP1);

		//вырез сверху тетивы
		if(par.botEnd == "столб"){
			topLine.push(topLineP01)
			topLine.push(topLineP02)
		}

		topLine.push(topLineP1)

		//верхний угол тетивы в конце
		var botLineP1 = {
			x: b * stairAmt,
			y: h * (stairAmt + 1) - topPointOffsetY,
		}

		//корректируем точку если вверху столб
		if(par.topEnd == "столб") {
			//рассчет отступа края ступени от края столба
			var treadOffset = 10; //отступ края ступени от внешней плоскости тетивы верхнего марша
			if (params.stairModel == "П-образная трехмаршевая" && marshPar.topTurn == 'забег' && params.model == 'тетивы') {
				treadOffset -= 20;
			}
			if (params.stairModel == "П-образная с забегом" && params.model == 'тетивы') {
				treadOffset -= 20;
			}
			if (params.stairModel == "Г-образная с забегом") {
				treadOffset -= 20;
			}
			treadOffset += -params.stringerThickness / 2 + params.rackSize / 2;
			botLineP1 = newPoint_xy(botLineP1, -treadOffset + newellSlotDepth, 0);
		}

		var topLineP21 = itercection(topLineP10, topLineP11, botLineP1, newPoint_xy(botLineP1, 100, 0))

		topLine.push(topLineP21);
		topLine.push(botLineP1);

		//сохраняем точку для столбов верхнего узла
		par.botLineP1 = botLineP1;

		//сохраняем точку для столбов ограждений
		// par.keyPoints.rack2Pos = newPoint_xy(botLineP1, params.rackSize/2, 0);
		par.keyPoints.marshRailingP2 = newPoint_xy(botLineP1, 0,0);
		par.keyPoints.marshLastRailingPoint = newPoint_xy(botLineP1, 0,0);
		// if(par.lastMarsh) par.keyPoints.marshRailingP2 = newPoint_xy(botLineP1, 0, 0);

		//добавляем первую точку в начало массива
		// if((!par.hasRailing || !risers || !par.slots) && !(risers == true && par.slots)) topLine.unshift(topLineP0);
		// if(!(risers == true && par.slots))
		if (!par.slots || params.stairModel == 'Прямая' || !risers) topLine.unshift(topLineP0);
		// if (params.stairModel == 'Прямая') {
		// 	topLine.unshift(topLineP0);
		// }

		//В случае наличия подступенков точка не нужна, появляются проблемы из за неё

		//внешний контур нижняя линия
		var botLine = [];

		//Точка пересечения нижней линии с задней линией
		var botLineP2 = itercection(botLineP1, newPoint_xy(botLineP1, 0, -100), bottomLine.p1, bottomLine.p2);

		//массив точек нижней линии
		var botLine = [botLineP2, botLineP10];

		//вырез внизу тетивы для вставки в столб
		if(par.topEnd == "столб") {
			var notchHeight = 30; //высота выреза снизу тетивы
			var botLineP4 = newPoint_x1(botLineP2, -newellSlotDepth, par.stairAngle)
			var botLineP3 = newPoint_xy(botLineP4, 0, notchHeight);
			botLineP2 = newPoint_xy(botLineP3, newellSlotDepth, 0);
			botLine = [botLineP2, botLineP3, botLineP4, botLineP10];
		}

		//вырез под колонну
		if(par.column && stairAmt > 0){
			var notchPar = {
				points: botLine,
				notchCenterX:  (Math.floor(stairAmt / 2) + 1) * a + params.rackSize / 2 - 40 + (params.riserType == 'есть' ? params.riserThickness : 0), //40 подогнано
				isBotLine: true,
			}
			botLine = addNotch(notchPar).points;
			var columnPos = copyPoint(notchPar.notchCenterPoint);
			columnPos.treadYOffset = ((Math.floor(stairAmt / 2) + 1) * h + h) - columnPos.y;//+ params.treadThickness;
			if (par.slots) par.columnsPoints.push(columnPos);
			par.excerptDepth = 100;
		}

		if (params.firstNewellPos !== 'на полу' && par.hasRailing && par.marshId == 1) {
			var notchPar = {
				points: topLine,
				notchCenterX: par.keyPoints.marshFirst.x,//par.keyPoints.rack2Pos.x,
				isBotLine: false,
				botY: par.keyPoints.marshFirst.y, //координата y дна выреза
			}

			notchPar = addNotch(notchPar);
			topLine = notchPar.points;
		}

		//сохраняем точку для столбов верхнего узла
		par.botLineP2 = botLineP2;

		//внешний контур вырез под последнюю ступень

		if(risers == false && par.slots){
			var p1 = newPoint_xy(botLineP1, 0, topPointOffsetY - h);
			var p2 = {
				x: b * (stairAmt - 1) - 0.01,
				y: h * stairAmt,
			}
			var p3 = newPoint_xy(p2, 0, -params.treadThickness);

			p2.filletRad = frontEdgeRad;
			topLine.push(p1);
			topLine.push(p2);
			topLine.push(p3);

			var p4 = newPoint_xy(p1, 0, -params.treadThickness)
			topLine.push(p4);
		}

		//пазы для лестницы с подступенками

		if(risers == true && par.slots){
			var slotsTopPoints = [];
			var slotsBotPoints = [];

			//верхняя линия пазов
			var p1 = newPoint_xy(botLineP1, 0, topPointOffsetY - h);
			slotsTopPoints.push(p1);

			var lastIndex = 0;
			//если вверху есть столб, то первый паз открытый и первый подъем отрисовывается отдельно
			if(par.hasRailing  || par.botEnd == "столб") lastIndex = 1;

			for(var i=stairAmt; i>lastIndex; i--){
				//переднее ребро ступени без учета скругления
				var p2 = {
					x: b * (i - 1) - 0.01,
					y: h * i + 0.01,
				}
				var p3 = newPoint_xy(p2, 0, -params.treadThickness - 0.02);

				p2.filletRad = frontEdgeRad;
				slotsTopPoints.push(p2);
				slotsTopPoints.push(p3);

				p1 = newPoint_xy(p3, nose, 0);
				slotsTopPoints.push(p1);

				p1 = newPoint_xy(p1, 0, -h + params.treadThickness + 0.02);
				slotsTopPoints.push(p1);
			}

			//если есть столб, то первый паз открытый
			if(par.hasRailing || par.botEnd == "столб"){
				var p2 = {x: topLineP0.x, y: h}
				slotsTopPoints.push(p2);
			}

			//нижняя линия пазов (формируем массив с конца)
			var p1 = newPoint_xy(botLineP1, 0, topPointOffsetY - h - params.treadThickness);
			slotsBotPoints.unshift(p1);

			for(var i=stairAmt; i>0; i--){
				//внутренний угол ступени и подступенка
				var p2 = {
					x: b * (i - 1) + nose + params.riserThickness,
					y: h * i - params.treadThickness - 0.03,
				}

				//корректируем точку если cнизу столб
				if(p2.x < topLineP0.x) p2.x = topLineP0.x;

				slotsBotPoints.unshift(p2);

				var p3 = newPoint_xy(p2, 0, -h - 0.03);
				//корректируем первую точку
				if(i == 1) p3.y = topLineP0.y;

				slotsBotPoints.unshift(p3);
			}
		}

		//Модифицируем каркас с учетом ограждений
		{
			if (par.hasRailing) {
				var lenX = (par.keyPoints.marshLastRailingPoint.x - topLineP21.x) / Math.cos(stairAngle);
				var tempPoint = polar(topLineP21, stairAngle, lenX);
				var deltaY = tempPoint.y - topLineP21.y;
				topLineP21.x = tempPoint.x;// / Math.cos(par.stairAngle);
				topLineP21.y = tempPoint.y;//lenX * Math.tan(par.stairAngle);
			}
			if (!marshPar.lastMarsh) {
				par.keyPoints.marshLastRailingPoint.x -= params.stringerSlotsDepth;
			}
		}

		//создание шейпов
		//внешняя часть тетивы и внутренняя часть без подступенков (единый шейп)
		if(risers == false || !par.slots){
			var shapePar = {
				points: topLine.concat(botLine),
				dxfArr: dxfArr,
				dxfBasePoint: par.dxfBasePoint,
			}
			var stringerShape = drawShapeByPoints2(shapePar).shape;
		}

		//внутренняя часть тетивы с подступенками (два шейпа)
		if(risers == true && par.slots){
			//верхняя часть

			var shapePar = {
				points: topLine.concat(slotsTopPoints),
				dxfArr: dxfArr,
				dxfBasePoint: par.dxfBasePoint
				//markPoints: true, //пометить точки в dxf для отладки
			}

			var stringerShape = drawShapeByPoints2(shapePar).shape;
			//нижняя часть
			var shapePar = {
				points: slotsBotPoints.concat(botLine),
				dxfArr: dxfArr,
				dxfBasePoint: par.dxfBasePoint
			}
			var stringerShape2 = drawShapeByPoints2(shapePar).shape;
		}
		//пазы для ступеней без подступенков (отверстия в шейпе)

		if(par.slots && risers == false){
			//формирование пазов дяя ступеней с 1 или 2 по предпоследнюю
			var p1 = {};
			var p2 = {};

			p2 = newPoint_xy(topLineP0, 0, -stringerOffset_y);
			// var startIndex = par.hasRailing == true ? 1 : 0;
			var startIndex = 0;
			var endIndex = p2.x <= b * (stairAmt - 1) + a ? stairAmt - 1 : stairAmt;
			for (var i = startIndex; i < endIndex; i++) {
					var holeBasePoint = {
					x: b * i - techDelta,
					y: h * (i + 1) - params.treadThickness - techDelta
				};

				var holePar = {
					basePoint: holeBasePoint,
					height: params.treadThickness + techDelta * 2,
					len: a + techDelta * 2,
					dxfArr: dxfArr,
					dxfBasePoint: dxfBasePoint,
					rad: frontEdgeRad,
				}

				var slotHole = drawHolePath(holePar).path;
				if (i == 0 || (i == 1 && params.firstNewellPos == 'на первой ступени' && par.marshId == 1)){
					stringerHoles.push(slotHole);
				}else{
					stringerShape.holes.push(slotHole);
				}
			}
		}

		//сохраняем точки для столбов ограждений
		// par.keyPoints.rack1Pos = newPoint_xy(topLineP0, - params.rackSize/2, 0);
		// if(par.botEnd == "столб") par.keyPoints.rack1Pos.x += newellSlotDepth;

		// par.keyPoints.rack2Pos = newPoint_xy(botLineP1, params.rackSize/2, 0);
		// if(par.topEnd == "столб") par.keyPoints.rack2Pos.x -= newellSlotDepth;
		par.keyPoints.botPoint = topLineP0;
		par.keyPoints.topPoint = botLineP2;
	} //конец тетивы

	var geom1 = new THREE.ExtrudeGeometry(stringerShape, extrudeOptions);
	geom1.rotateUV(stairAngle * -1);
	//преобразуем геометрию столба в BSP объект
	var geomBSP = new ThreeBSP(geom1);
	for (var i = 0; i < stringerHoles.length; i++) {
		var hole = stringerHoles[i].getPoints();
		var holeShape = new THREE.Shape(hole);
		//преобразуем шейп отверстия в геометрию
		var holeGeom = new THREE.ExtrudeGeometry(holeShape, extrudeOptions);
		//преобразуем геометрию отверстия в BSP объект
		var holeBSP = new ThreeBSP(holeGeom);

		//Выдавливаем отверстие в столбе
		var geomBSP = geomBSP.subtract(holeBSP);
	}
	//Преобразуем обратно в геометрию
	geom1 = geomBSP.toGeometry();
	geom1.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom1, params.materials.timber2);
	mesh.userData = {textureRot: stairAngle};
	par.meshes.push(mesh);

	if(stringerShape2){
		var geom2 = new THREE.ExtrudeGeometry(stringerShape2, extrudeOptions);
		geom2.rotateUV(stairAngle * -1);
		geom2.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var mesh = new THREE.Mesh(geom2, params.materials.timber);
		mesh.userData = {textureRot: stairAngle};
		par.meshes.push(mesh);
	}
	//сохраняем параметры для отрисовки столба

	if(par.botEnd == "столб") {
		if (par.type == "тетива") par.endHeightBot = distance(topLineP0, topLineP01);
		if (par.type == "косоур") par.endHeightBot = distance(topLineP0, topLineP1);
	}
	// if(par.topEnd == "столб") {
	// }
	par.endHeightTop = distance(topLineP21, botLineP2);
	if (par.type == 'косоур') par.endHeightTop = distance(botLineP1, botLineP2);
	if (par.type == "косоур" && stairAmt == 1) par.endHeightTop = distance(topLineP0, topLineP1);
	if (deltaY) par.endHeightYOffset = deltaY;
} //end of drawStrightStringer

/*внешний косоур/тетива нижнего марша*/

function drawStringer1(par) {

	var stringerHoles = [];
	par.meshes = [];
	var stringerShape = new THREE.Shape();
	var marshPar = getMarshParams(par.marshId); //функция в файле inputsReading.js

	//именованные ключевые точки
	// if(!par.keyPoints) par.keyPoints = {};
	par.keyPoints.zeroPoint = {x:0, y:0};

	var slots = par.slots;

	var thk = params.stringerThickness - params.stringerSlotsDepth;
	if(slots) thk = params.stringerSlotsDepth;
	var extrudeOptions = {
		amount: thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	//рассчитываем параметры косоура по номеру марша и стороне
	calcStringerPar(par);

	var stringerType = par.type;
	var stringerSideOffset = par.stringerSideOffset;

	var h1 = params.h1;
	var h3 = params.h3;
	var b1 = params.b1;
	var a1 = params.a1;
	var stairAmt = params.stairAmt1;
	var thisMarshRailing = params.railingSide_1;
	var nextMarshRailing = params.railingSide_3

	if(params.stairModel === "П-образная трехмаршевая"){
		h3 = params.h2;
		nextMarshRailing = params.railingSide_2;
	}

	var hasRailing = par.hasRailing;

	//наличие ограждения на следующем марше
	var railingConnectionTop = false;
	if(nextMarshRailing == "внешнее" || nextMarshRailing == "две"){
		railingConnectionTop = true;
	};
	par.railingConnectionTop = railingConnectionTop

	var risers = params.riserType == "есть";
	var dxfBasePoint = par.dxfBasePoint;
	var dxfArr = dxfPrimitivesArr;
	if(!slots) dxfArr = [];
	var topMarshXOffset = -par.topMarshXOffset; //смещение марша по оси Х
	var stringerLedge = 15; //выступ тетивы над уровнем площадки/забега в конце косоура
	if (par.topEnd == "забег") stringerLedge = 100;
	par.stringerLedge = stringerLedge;

	var stringerThickness = params.stringerThickness;
	var stringerSlotsDepth = params.stringerSlotsDepth;

	var platformWidth = 200;
	par.platformWidth = platformWidth;
	var stringerWidth = 300;
	if(stringerType == "косоур") {
		stringerWidth = 200;
	}
	par.width = stringerWidth;
	var stairAngle = Math.atan(h1/b1);

	par.stairAngle = stairAngle;

	var text = stringerType == "тетива" ? "Внешняя тетива нижнего марша (пазы сверху)" : "Внешний косоур нижнего марша";
	var textHeight = 30;
	var textBasePoint = newPoint_xy(dxfBasePoint, 0, -100)
	addText(text, textHeight, dxfPrimitivesArr, textBasePoint);

	//нижние точки
	var botPoints = calcBotStepPoints(par);

	var topLineP0 = botPoints.topLineP0;
	var topLineP1 = botPoints.topLineP1;
	var topLineP10 = botPoints.topLineP10;
	var topLineP11 = botPoints.topLineP11;
	var botLineP10 = botPoints.botLineP10;

	//массив точек внешнего контура косоура
	var topLine = [];

	if (stringerType == "косоур") {

		//сохраняем точку для ограждений
		par.keyPoints.marshRailingP1 = copyPoint(topLineP10);
		// par.keyPoints.marshRailingP1 = copyPoint(topLineP10);
		topLine.push(topLineP0)
		topLine.push(topLineP1)
		topLine.push(topLineP10)


		//цикл построения ступеней

		var p2 = copyPoint(topLineP10);

		for(var i = 1; i < stairAmt; ++i) {
			p2 = newPoint_xy(p2, 0, h1);
			topLine.push(p2)
			p2 = newPoint_xy(p2, b1 + 0.01, 0);
			topLine.push(p2)
		}
		//сохраняем точку для ограждений
		par.keyPoints.topTurnRailingP1 = copyPoint(p2);
		// par.keyPoints.topTurnRailingP1 = copyPoint(p2);
		//последний подъем
		var topLineP20 = copyPoint(p2);
		p2 = newPoint_xy(topLineP20, 0, h1 - 0.01);
		topLine.push(p2)

		//верхний участок

		par.keyPoints.topLineP20 = topLineP20;

		var topPoints = calcPointsTurnOut_top(par);

		var topLineP21 = topPoints.topLineP21;
		var botLineP1 = topPoints.botLineP1;
		var botLineP2 = topPoints.botLineP2;


		if (par.topEnd == "забег") {
			topLine.push(topLineP21);
			p2 = newPoint_xy(topLineP21, 0, h3);
			topLine.push(p2)
			topLine.push(botLineP1)

			var botLineP4 = itercection(botLineP10, polar(botLineP10, stairAngle, 100), bottomLine.p1, bottomLine.p2);
			if (stairAmt <= 1) botLineP4 = itercection(topLineP0, newPoint_xy(topLineP0, 100, 0), bottomLine.p1, bottomLine.p2);
		}

		if(par.topEnd == "площадка") {
			topLine.push(botLineP1)
			var botLineP4 = itercection(botLineP2, newPoint_xy(botLineP2, 100, 0), botLineP10, polar(botLineP10, stairAngle, 100));
			if (stairAmt == 0) {
				botLineP4 = newPoint_xy(botLineP2, 0, -par.h);
			}
		}

		//массив точек нижней линии
		var botLine = [botLineP2, botLineP4, botLineP10];

		//console.log(botLineP4, botLineP10)
		//задаем позицию столба (столб ограждения всегда соосен с опорной колонной)
		// par.keyPoints.rack2Pos = {
		// 	x: b1 * stairAmt + params.rackSize/2,
		// 	y: h1 * (stairAmt + 1)
		// }
		if(stairAmt == 0){
			topLine = [];
			topLine.push(topLineP0);
			//первый подъем
			topLine.push(topLineP1);

			if (par.topEnd == "забег") {
				//первая забежная ступень

				var topLineP21 = newPoint_xy(topLineP1, (topLineP21.x - topLineP20.x), 0);

				topLine.push(topLineP21);

				p2 = newPoint_xy(topLineP21, 0, h3);
				topLine.push(p2)

				//нижняя линия
				botLine = [];
				//вторая забежная ступень
				var botLineP1 = newPoint_xy(par.keyPoints.zeroPoint, topPoints.stringerTurnLen + nose, h1 + h3 - params.treadThickness)
				botLine.push(botLineP1)
				//////console.log(topPoints.stringerTurnLen)
				var botLineP2 = newPoint_xy(botLineP1, 0, -stringerWidth)
				botLine.push(botLineP2)
				botLine.push(botLineP10);
			}
		}

		//Вырезы под опоры
		{
			//вырез под колонну
			if(stairAmt > 1 && params.isColumn1 == true){
				var notchPar = {
					points: botLine,
					notchCenterX: par.keyPoints.marshLast.x,
					isBotLine: true,
				}
				if (!hasRailing) {
					notchPar.notchCenterX = b1 * stairAmt + 95 / 2 + 20 + 0.5;
					// 0.5 зазор
					if (params.riserThickness) {
						notchPar.notchCenterX += params.riserThickness;
					}
				}
				botLine = addNotch(notchPar).points;
				var columnPos = copyPoint(notchPar.notchCenterPoint);
				columnPos.treadYOffset = par.keyPoints.marshLast.y - columnPos.y - 0.03;
				if (hasRailing && par.topEnd == 'забег') {
					columnPos.treadYOffset -= h1;
				}
				if (par.slots) par.columnsPoints.push(columnPos);
				// par.columnsPoints.push({x: par.keyPoints.marshLast.x,y: 0});
			}

			//вырез под колонну
			if(stairAmt > 1 && params.isColumn3 == true && params.stairModel == 'П-образная с площадкой'){
				var columnPos = newPoint_xy(par.keyPoints.topLast, - 0.03, 0);
				columnPos.y = botLineP2.y;
				columnPos.isCornerColumn = true;
				columnPos.treadYOffset = par.keyPoints.topLast.y - columnPos.y - 0.03;
				if (par.slots) par.columnsPoints.push(columnPos);
			}
			if(stairAmt > 1 && params.isColumn3 == true && params.stairModel == 'П-образная с забегом'){
				// var columnPos = newPoint_xy(par.keyPoints.topLast);
				// columnPos.y = botLineP2.y;
				// columnPos.treadYOffset = botLineP1.y - botLineP2.y;
				// if (par.slots) par.columnsPoints.push(columnPos);

				var notchPar = {
					points: botLine,
					notchCenterX: newPoint_xy(par.keyPoints.topLast, -stringerSideOffset - 5).x,
					isBotLine: true,
				}
				botLine = addNotch(notchPar).points;
				var columnPos = copyPoint(notchPar.notchCenterPoint);
				columnPos.treadYOffset = par.keyPoints.topLast.y - columnPos.y - 0.03;
				// if (par.topEnd == 'забег') {
				// 	columnPos.treadYOffset += h3;
				// }
				if (par.slots) par.columnsPoints.push(columnPos);
			}
		}
		//создаем шейп
		var shapePar = {
			points: topLine.concat(botLine),
			dxfArr: dxfArr,
			dxfBasePoint: par.dxfBasePoint,
			markPoints: true, //пометить точки в dxf для отладки
		}
		stringerShape = drawShapeByPoints2(shapePar).shape;

		//отверстия для крепления ступеней
		if(slots == true && params.calcType == "timber"){
			var xSlotOffset = 25.5;
			var ySlotOffset = 25.5;
			var slotDiam = 25.5;

			for(var i = 0; i < topLine.length; i++) {
				//выцепляем четные точки
				if(i%2){
					var center = newPoint_xy(topLine[i], xSlotOffset, -ySlotOffset);
					addRoundHole(stringerShape, dxfPrimitivesArr, center, slotDiam/2, dxfBasePoint);
					if(params.riserType == "нет"){
						var center2 = newPoint_xy(center, marshPar.b - xSlotOffset * 3, 0);
						addRoundHole(stringerShape, dxfArr, center2, slotDiam/2, dxfBasePoint);
					}
				}
			}
		}

		//сохраняем точки для ограждений
		par.keyPoints.topTurnRailingP2 = botLineP1;
		// par.keyPoints.topTurnRailingP2 = botLineP1;
		// par.keyPoints.rack3Pos = newPoint_xy(botLineP1, stringerSideOffset - params.rackSize / 2, -stringerLedge);
		par.keyPoints.botPoint = topLineP0;
		par.keyPoints.topPoint = botLineP2;
	} //конец косоура

	if (stringerType == "тетива") {

		//сохраняем точки для ограждений
		// par.keyPoints.marshRailingP1 = copyPoint(topLineP1);
		par.keyPoints.marshRailingP1 = copyPoint(topLineP1);
		par.keyPoints.marshFirstRailingPoint = copyPoint(topLineP1);
		//вспомогательная точка на верхней линии на одном уровне с передним ребром ступени
		var topLinePt = itercection(par.keyPoints.zeroPoint, newPoint_xy(par.keyPoints.zeroPoint, 0, 100), topLineP10, topLineP11)
		par.keyPoints.topLinePt = topLinePt;

		var topPoints = calcPointsTurnOut_top(par);

		var topLineP20 = topPoints.topLineP20;
		var topLineP21 = topPoints.topLineP21;
		var botLineP1 = topPoints.botLineP1;
		var botLineP2 = topPoints.botLineP2;
		var botLineP3 = topPoints.botLineP3;
		var botLineP4 = topPoints.botLineP4;

		topLine = topPoints.topLine; //точки на верхней линии
		var slotsBotPoints = topPoints.slotsBotPoints; //точки верхней линии пазов
		var slotsTopPoints = topPoints.slotsTopPoints; //точки нижней линии пазов

		//пазы в тетиве на лестнице без подступенков (path)
		var slotHole1 = topPoints.slotHole1;
		var slotHole2 = topPoints.slotHole2;
		//пазы под подступенки для забега (path)
		var slotRiserHole1 = topPoints.slotRiserHole1;

		//добавляем первую точку в начало массива
		if(!hasRailing || !risers || !par.slots) topLine.unshift(topLineP0);

		if (stairAmt == 0) {
			par.keyPoints.topFirstRailingPoint = topLineP1;
		}
		// if(!hasRailing || !risers || !par.slots)
		// topLine.unshift(topLineP0);

		//внешний контур нижняя линия
		var botLine = [];

		botLine.push(botLineP2)
		if (par.topEnd == "забег") botLine.push(botLineP3)
		if(stairAmt > 0) botLine.push(botLineP4)


		//точка пересечения с полом
		var botLineP10 = itercection(topLineP0, newPoint_xy(topLineP0, 100, 0), botLineP4, polar(botLineP4, par.stairAngle, 100))
		if (stairAmt == 0) {
			botLineP10.x = par.slotsOffset + params.nose;
		}
		botLine.push(botLineP10)

		//пазы для лестницы с подступенками
		if(risers == true && par.slots){

			//верхняя линия пазов (массив формируется с начала)
			//точки пазов на повороте рассчитываются в calcPointsTurnOut_top

			var p1 = slotsTopPoints[slotsTopPoints.length-1];

			var lastIndex = 0;
			//если есть столб ограждения, то последний паз открытый и последний подъем отрисовывается отдельно
			if(hasRailing) lastIndex = 1;
			// var techDelta = 0.01;
			for(var i=stairAmt; i>lastIndex; i--){
				//переднее ребро ступени без учета скругления
				var p2 = {
					x: b1 * (i - 1) - techDelta,
					y: h1 * i + techDelta,
				}
				var p3 = newPoint_xy(p2, 0, -params.treadThickness - techDelta);
				p2.filletRad = frontEdgeRad;
				slotsTopPoints.push(p2);
				slotsTopPoints.push(p3);

				p1 = newPoint_xy(p3, nose - techDelta, 0);
				slotsTopPoints.push(p1);

				p1 = newPoint_xy(p1, 0, -h1 + params.treadThickness + techDelta);
				slotsTopPoints.push(p1);
			}

			//если есть столб ограждения, то последний паз открытый
			if(hasRailing){
				var p2 = {x: topLineP0.x, y: h1}
				slotsTopPoints.push(p2);
			}

			//нижняя линия пазов (формируем массив с конца)
			//точки пазов на повороте рассчитываются в calcPointsTurnOut_top

			//ступени марша
			for(var i=stairAmt; i>0; i--){
				//внутренний угол ступени и подступенка
				var p2 = {
					x: b1 * (i - 1) + nose + params.riserThickness,
					y: h1 * i - params.treadThickness - 0.03,
				}
				slotsBotPoints.unshift(p2);
				var p3 = newPoint_xy(p2, 0, -h1 - 0.03);
				if(p3.y < topLineP0.y) p3.y = topLineP0.y;
				slotsBotPoints.unshift(p3);
			}
		}

		//Вырезы под опорные колонны
		{
			//вырез под колонну
			if(stairAmt > 1 && params.isColumn1 == true){
				var notchPar = {
					points: botLine,
					notchCenterX: par.keyPoints.marshLast.x,
					isBotLine: true,
				}
				if (!hasRailing) {
					notchPar.notchCenterX = b1 * stairAmt + 95 / 2 + 20 + 0.5 + 20;
					// 0.5 зазор
					if (params.riserThickness) {
						notchPar.notchCenterX += params.riserThickness;
					}
				}
				botLine = addNotch(notchPar).points;
				var columnPos = copyPoint(notchPar.notchCenterPoint);
				columnPos.treadYOffset = par.keyPoints.marshLast.y - columnPos.y - 0.03;
				
				// if (par.topEnd == 'забег') columnPos.treadYOffset = botLineP1.y - par.stringerLedge - h3 - columnPos.y;

				if (par.slots) par.columnsPoints.push(columnPos);
			}

			// вырез под колонну
			if(stairAmt > 1 && params.isColumn3 == true && (params.stairModel == 'П-образная с площадкой' || params.stairModel == 'П-образная с забегом')){
				var columnPos = copyPoint(botLineP2);
				columnPos.y = botLineP2.y;
				columnPos.x -= params.stringerThickness + 10;
				columnPos.isCornerColumn = true;
				columnPos.treadYOffset = botLineP1.y - par.stringerLedge - columnPos.y - 0.03;
				if (par.slots) par.columnsPoints.push(columnPos);
			}
		}

		//Модифицируем каркас с учетом ограждений
		{
			if (hasRailing && stairAmt > 0) {
				var lenX = (par.keyPoints.marshLastRailingPoint.x - topLineP20.x) / Math.cos(par.stairAngle);
				topLineP20.x = polar(topLineP20, par.stairAngle, lenX).x;// / Math.cos(par.stairAngle);
				topLineP20.y = polar(topLineP20, par.stairAngle, lenX).y;//lenX * Math.tan(par.stairAngle);
			}
		}

		//создание шейпов

		//внешняя часть тетивы и внутренняя часть без подступенков (единый шейп)

		if(risers == false || !par.slots){
			var shapePar = {
				points: topLine.concat(botLine),
				dxfArr: dxfArr,
				dxfBasePoint: par.dxfBasePoint,
			}
			var stringerShape = drawShapeByPoints2(shapePar).shape;
		}

		//внутренняя часть тетивы с подступенками (два шейпа)

		if(risers == true && par.slots){
			//верхняя часть
			var shapePar = {
				points: topLine.concat(slotsTopPoints),
				dxfArr: dxfArr,
				dxfBasePoint: par.dxfBasePoint,
				markPoints: true, //пометить точки в dxf для отладки
			}
			var stringerShape = drawShapeByPoints2(shapePar).shape;

			//нижняя часть
			var shapePar = {
				points: slotsBotPoints.concat(botLine),
				dxfArr: dxfArr,
				dxfBasePoint: par.dxfBasePoint,
			}
			var stringerShape2 = drawShapeByPoints2(shapePar).shape;
		}


		//пазы для ступеней без подступенков (отверстия в шейпе)


		if(par.slots && risers == false){
				//формирование пазов дяя ступеней с 1 или 2 по предпоследнюю
				var p1 = {};
				var p2 = {};

				p2 = newPoint_xy(topLineP0, 0, 0);
				var startIndex = 0;
				var endIndex = stairAmt;

				for (var i = startIndex; i < endIndex; i++) {
					var holeBasePoint = {
						x: b1 * i - techDelta,
						y: h1 * (i + 1) - params.treadThickness - techDelta,
					}

					var holePar = {
						basePoint: holeBasePoint,
						height: params.treadThickness + techDelta * 2,
						len: params.a1 + techDelta * 2,
						dxfArr: dxfArr,
						dxfBasePoint: par.dxfBasePoint,
						rad: frontEdgeRad,
					}

					var slotHole = drawHolePath(holePar).path;
					if (i == 0) {
						stringerHoles.push(slotHole);
					}else{
						stringerShape.holes.push(slotHole);
					}
				}

				if (par.topEnd == "забег") {
					//вторая забежная ступень
					stringerShape.holes.push(slotHole2);

					//первая забежная ступень
					stringerShape.holes.push(slotHole1);
				}

				if (par.topEnd == "площадка") {
					stringerShape.holes.push(slotHole1);
				}
		}

		par.keyPoints.botPoint = topLineP0;
		par.keyPoints.topPoint = botLineP2;
	}

	//сохраняем точку для столбов ограждений
	// par.keyPoints.rack1Pos = newPoint_xy(topLineP0, -params.rackSize/2, 0);
	var geom1 = new THREE.ExtrudeGeometry(stringerShape, extrudeOptions);
	geom1.rotateUV(stairAngle * -1);
	//преобразуем геометрию столба в BSP объект
	var geomBSP = new ThreeBSP(geom1);
	for (var i = 0; i < stringerHoles.length; i++) {
		var hole = stringerHoles[i].getPoints();
		var holeShape = new THREE.Shape(hole);
		//преобразуем шейп отверстия в геометрию
		var holeGeom = new THREE.ExtrudeGeometry(holeShape, extrudeOptions);
		//преобразуем геометрию отверстия в BSP объект
		var holeBSP = new ThreeBSP(holeGeom);

		//Выдавливаем отверстие в столбе
		var geomBSP = geomBSP.subtract(holeBSP);
	}
	//Преобразуем обратно в геометрию
	geom1 = geomBSP.toGeometry();
	geom1.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom1, params.materials.timber)
	mesh.userData = {textureRot: stairAngle};
	par.meshes.push(mesh);

	if(stringerShape2){
		var geom2 = new THREE.ExtrudeGeometry(stringerShape2, extrudeOptions);
		geom2.rotateUV(stairAngle * -1);
		geom2.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var mesh = new THREE.Mesh(geom2, params.materials.timber);
		mesh.userData = {textureRot: stairAngle};
		par.meshes.push(mesh);
	}

	return par;
} //end of drawStringer1

/*внешний косоур/тетива верхнего марша*/

function drawStringer3(par) {

	var stringerHoles = [];//Используется для выдавливания отверстий, в тестовом режиме
	var marshPar = getMarshParams(par.marshId); //функция в файле inputsReading.js
	
	par.meshes = [];
	var stringerShape = new THREE.Shape();

	//именованные ключевые точки
	// if(!par.keyPoints) par.keyPoints = {};
	par.keyPoints.zeroPoint = {x:0, y:0};


	var slots = par.slots;

	var thk = params.stringerThickness - params.stringerSlotsDepth;
	if(slots) thk = params.stringerSlotsDepth;
	var extrudeOptions = {
		amount: thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var stringerType = "тетива";
	var stringerSideOffset = 0;
	if(params.model == "косоуры") {
		stringerType = "косоур";
		stringerSideOffset = params.rackSize - params.stringerThickness;
	}

	//рассчитываем параметры косоура по номеру марша и стороне
	calcStringerPar(par);

	par.type = stringerType;
	par.stringerSideOffset = stringerSideOffset;

	var h1 = params.h3;
	var h3 = params.h3;
	var b1 = params.b3;
	var a1 = params.a3;
	var stairAmt = params.stairAmt3;
	var thisMarshRailing = params.railingSide_3;
	var prevMarshRailing = params.railingSide_1;

	//наличие ограждения на этом марше
	var hasRailing = false;

	if(thisMarshRailing == "внешнее" || thisMarshRailing == "две"){
		hasRailing = true;
	}
	par.hasRailing = hasRailing;

	//наличие ограждения на предыдущем марше
	var railingConnectionBot = false;
	if(prevMarshRailing == "внешнее" || prevMarshRailing == "две"){
		railingConnectionBot = true;
	}
	par.railingConnectionBot = railingConnectionBot;

	var risers = params.riserType == "есть";
	par.risers = risers;
	var dxfBasePoint = par.dxfBasePoint;
	var dxfArr = dxfPrimitivesArr;
	if(!slots) dxfArr = [];
	var stringerSideOffset = par.stringerSideOffset;
	var topMarshXOffset = 10;
	var topMarshZOffset = -30;
	par.topMarshXOffset = topMarshXOffset;
	par.topMarshZOffset = topMarshZOffset;
	var bottomRackNotch = par.bottomRackNotch;
	var stringerThickness = params.stringerThickness;
	var stringerSlotsDepth = params.stringerSlotsDepth;
	var topRackTreadOffset = 0;

	var stringerLedge = 15;
	if (par.botEnd == "забег") stringerLedge = 100;
	par.stringerLedge = stringerLedge;

	var stringerWidth = 300;
	if(stringerType == "косоур") {
		stringerWidth = 200;
	}

	var slotsOffset = 20;
	par.slotsOffset = slotsOffset;
	par.stringerWidth = par.width = stringerWidth;

	var stairAngle = Math.atan(h1/b1);
	par.stairAngle = stairAngle;

	var platformRailingRack2OffsetX = 100;
	par.platformRailingRack2OffsetX = platformRailingRack2OffsetX;
	var topPointOffsetY = 20; //отступ среза верхнего угла тетивы от уровня верхнего перекрытия для регулировки
	par.topPointOffsetY = topPointOffsetY;

	var stringerShape = new THREE.Shape();

	var text =	stringerType == "тетива" ? "Внешняя тетива верхнего марша (пазы снизу)" : "Внешний косоур верхнего марша";
	var textHeight = 30;
	var textBasePoint = newPoint_xy(dxfBasePoint, 0, -100);
	addText(text, textHeight, dxfPrimitivesArr, textBasePoint);

	if (stringerType == "косоур") {
		//массив точек внешнего контура косоура
		var topLine = [];

		var botPoints = calcPointsTurnOut_bot(par);

		var topLineP0 = botPoints.topLineP0;
		var botTurnRailingP1 = botPoints.botTurnRailingP1;
				// var botTurnRailingP1 = botPoints.botTurnRailingP1;
		var topLineP9 = botPoints.topLineP9;
		var topLineP10 = botPoints.topLineP10;
		var botLineP9 = botPoints.botLineP9;
		var botLineP10 = botPoints.botLineP10;

		if (par.botEnd == "забег") {
			topLine.push(topLineP0);
			topLine.push(botTurnRailingP1);
			topLine.push(topLineP9);

			//второй подъем забежного участка
			var p1 = newPoint_xy(topLineP9, 0, h1);
						// par.keyPoints.botTurnRailingP2 = copyPoint(p1);
			par.keyPoints.botTurnRailingP2 = copyPoint(p1);
			topLine.push(p1);

			//третья забежная ступень
			if(stairAmt !== 0) topLine.push(topLineP10);
			var topLineP11 = polar(topLineP10, par.stairAngle, 100);

			//рассчитываем координаты точек на нижней линии	забега
			var bottomLine1 = parallel(topLineP10, topLineP11, -par.stringerWidth);
			var bottomLine2 = parallel(topLineP9, topLineP10, -par.stringerWidth);
		}

		if (par.botEnd == "площадка") {
			topLine.push(topLineP0);
			topLine.push(botTurnRailingP1);
			topLine.push(topLineP10);

			var topLineP11 = polar(topLineP10, par.stairAngle, 100);

			//рассчитываем координаты точек на нижней линии	площадки
			var bottomLine1 = parallel(topLineP10, topLineP11, -par.stringerWidth);
		}

		//контур нижней части косоура
		var botLineP1 = {
			x: b1 * stairAmt - topRackTreadOffset,
			y: h1 * stairAmt - params.treadThickness
		}
		if (stairAmt == 0) botLineP1.x += params.nose;
		
		var botLineP2 = itercection(botLineP1, newPoint_xy(botLineP1, 0, 100), bottomLine1.p1, bottomLine1.p2);
		par.botLineP1 = copyPoint(botLineP1);
		// par.keyPoints.rack3Pos = newPoint_xy(botLineP1, params.rackSize/2, 0);
		par.botLineP2 = copyPoint(botLineP2);

		if (testingMode) {
			topLineP10.y -= 0.01
		}
		var p2 = copyPoint(topLineP10);
		//цикл построения ступеней
		for(var i = 1; i < stairAmt; ++i) {
			p2 = newPoint_xy(p2, 0, h1);
			topLine.push(p2)
			p2 = newPoint_xy(p2, b1 + 0.01, 0);
			topLine.push(p2)
			if(i == 1){
				par.keyPoints.marshRailingP1 = copyPoint(p2);
								// par.keyPoints.marshRailingP1 = copyPoint(p2);
			}
		}
		//сохраняем точку для ограждений
		par.keyPoints.topTurnRailingP1 = copyPoint(p2);
				// par.keyPoints.topTurnRailingP1 = copyPoint(p2);

		//последний подъем
		var topLineP20 = copyPoint(p2);
		p2 = newPoint_xy(topLineP20, 0, h1);
		if(stairAmt > 0){
			topLine.push(p2);
		}

		//массив точек нижней линии

		if (par.botEnd == "забег") {
			var botLine = [botLineP1, botLineP2, botLineP9, botLineP10];
			if(stairAmt == 0){
				botLine = [botLineP1, botLineP2, botLineP10];
			}
		}

		if (par.botEnd == "площадка") {
			var botLine = [botLineP1, botLineP2, botLineP10];
			if(stairAmt == 0){
				botLineP2 = itercection(botLineP1,botLineP2, botLineP10, newPoint_xy(botLineP10, 100, 0));
				botLine = [botLineP1, botLineP2];
			}
		}

		// Вырезы под опоры
		{
			//вырез под колонну
			if(stairAmt > 1 && (params.stairModel == "П-образная трехмаршевая" && params.isColumn6 == true) || (params.stairModel != "П-образная трехмаршевая" && params.isColumn4 == true) || params.stairModel == "П-образная с площадкой" && params.isColumn6 == true){
				if (par.botEnd == 'забег') {
					var notchPar = {
						points: botLine,
						notchCenterX: par.keyPoints.marshFirst.x,
						isBotLine: true,
					}
					botLine = addNotch(notchPar).points;
					var columnPos = notchPar.notchCenterPoint;
					columnPos.treadYOffset = par.keyPoints.marshFirst.y - columnPos.y - 0.03;
					if (par.slots) par.columnsPoints.push(columnPos);
				}
				if (par.botEnd == 'площадка') {
					var columnPos = {x: par.keyPoints.marshFirst.x, y: botLineP10.y};
					columnPos.treadYOffset = par.keyPoints.marshFirst.y - columnPos.y - 0.03;
					if (par.slots) par.columnsPoints.push(columnPos);
				}
			}

			//вырез под колонну
			if(stairAmt > 1 && (params.isColumn7 == true || params.isColumn3 == true)){
				var columnPos = copyPoint(par.keyPoints.botFirst);
				if (params.stairModel == 'П-образная с забегом') {
					var columnPos = newPoint_xy(par.keyPoints.botFirst, params.rackSize * 2, 0);
				}
				if (params.stairModel == 'П-образная с площадкой') {
					var columnPos = newPoint_xy(par.keyPoints.botFirst, params.rackSize / 2 + 40, 0);
				}
				columnPos.y = botLineP10.y;
				columnPos.isCornerColumn = true;
				columnPos.treadYOffset = par.keyPoints.botFirst.y - columnPos.y - 0.03;
				if (par.slots) par.columnsPoints.push(columnPos);
			}
		}
		//создаем шейп
		var shapePar = {
			points: topLine.concat(botLine),
			dxfArr: dxfArr,
			dxfBasePoint: par.dxfBasePoint,
			markPoints: true, //пометить точки в dxf для отладки
		}
		stringerShape = drawShapeByPoints2(shapePar).shape;

		//отверстия для крепления ступеней
		if(slots == true && params.calcType == "timber"){
			var xSlotOffset = 25.5;
			var ySlotOffset = 25.5;
			var slotDiam = 25.5;

			for(var i = 0; i < topLine.length; i++) {
				//выцепляем четные точки
				if(i%2){
					var center = newPoint_xy(topLine[i], xSlotOffset, -ySlotOffset);
					addRoundHole(stringerShape, dxfPrimitivesArr, center, slotDiam/2, dxfBasePoint);
					if(params.riserType == "нет"){
						var center2 = newPoint_xy(center, marshPar.b - xSlotOffset * 3, 0);
						addRoundHole(stringerShape, dxfArr, center2, slotDiam/2, dxfBasePoint);
					}
				}
			}
		}
		par.keyPoints.botPoint = topLineP0;
		par.keyPoints.topPoint = botLineP2;
	}// Конец косоура

	if (stringerType == "тетива") {
		//массив точек внешнего контура косоура
		var botPoints = calcPointsTurnOut_bot(par);

		var topLineP0 = botPoints.topLineP0;
		var topLineP9 = botPoints.topLineP9;
		var topLineP10 = botPoints.topLineP10;
		var topLineP11 = botPoints.topLineP11;
		var bottomLine1 = botPoints.bottomLine1;
		var bottomLine2 = botPoints.bottomLine2;
		var botLineP9 = botPoints.botLineP9;
		var botLineP10 = botPoints.botLineP10;
		topLine = botPoints.topLine;
		var slotHole1 = botPoints.slotHole1;
		var slotHole2 = botPoints.slotHole2;
		var slotRiserHole1 = botPoints.slotRiserHole1;

		//верхний угол тетивы в конце
		var botLineP1 = {
			x: b1 * stairAmt,
			y: h1 * (stairAmt + 1) - topPointOffsetY,
		}
		if(stairAmt == 0){
			botLineP1.y = h1;

		}
		par.botLineP1 = copyPoint(botLineP1);

		var topLineP21 = itercection(topLineP10, topLineP11, botLineP1, newPoint_xy(botLineP1, 100, 0))

		topLine.push(topLineP21);
		topLine.push(botLineP1);

		//задаем позицию столба (столб ограждения всегда соосен с опорной колонной)
		// par.keyPoints.rack2Pos = {
		// 	x: nose + params.rackSize/2 + (risers ? params.riserThickness : 0),
		// 	y: h1
		// }

		// if(par.botEnd == "площадка"){
		// 	par.keyPoints.rack2Pos.x = -(params.rackSize/2+platformRailingRack2OffsetX);
		// 	par.keyPoints.rack2Pos.y = 0;
		// }

		if(hasRailing && stairAmt > 0){
			var notchPar = {
				points: topLine,
				notchCenterX: par.keyPoints.marshFirst.x,
				isBotLine: false,
				botY: 0.01, //координата y дна выреза
			}

			if(par.botEnd == "забег"){
				notchPar.botY = 0.04;
			}
			notchPar = addNotch(notchPar);
			topLine = notchPar.points;

			//сохраняем точку для ограждений
			par.keyPoints.botTurnRailingP2 = notchPar.notchLeft;
			par.keyPoints.marshRailingP1 = notchPar.notchRight;

			par.keyPoints.botLastRailingPoint = notchPar.notchLeft;
			par.keyPoints.marshFirstRailingPoint = notchPar.notchRight;
		}

		var botLine = [];
		//внешний контур нижняя линия
		//Точка пересечения с задней линией
		var botLineP2 = itercection(botLineP1, newPoint_xy(botLineP1, 0, -100), bottomLine1.p1, bottomLine1.p2);
		if(stairAmt == 0){
			botLineP2.y = botLineP1.y - stringerWidth;
			if(par.botEnd == "площадка"){
				botLineP2.y = par.stringerLedge - par.stringerWidth;
			}
		}
		par.botLineP2 = copyPoint(botLineP2);
		botLine.push(botLineP2);

		if (!par.keyPoints.marshLastRailingPoint) {
			par.keyPoints.marshLastRailingPoint = copyPoint(botLineP1);
		}

		botLine = botLine.concat(botPoints.botLine);

		////console.log(botLine)
		//пазы для лестницы с подступенками

		if(risers == true && par.slots){
			var slotsTopPoints = [];
			var slotsBotPoints = [];

			//верхняя линия пазов
			var p1 = {
				x: botLineP1.x,
				y: h1 * stairAmt
			}
			slotsTopPoints.push(p1);

			for(var i=stairAmt; i>0; i--){
				//переднее ребро ступени без учета скругления
				var p2 = {
					x: b1 * (i - 1) - 0.02,
					y: h1 * i + 0.01,
				}
				if (i == 1 && hasRailing && par.botEnd == 'забег') {
					p2.x += params.nose;
				}

				var p3 = newPoint_xy(p2, 0, -params.treadThickness -0.02);

				p2.filletRad = frontEdgeRad;
				slotsTopPoints.push(p2);
				slotsTopPoints.push(p3);

				p1 = newPoint_xy(p3, nose, 0);
				slotsTopPoints.push(p1);
				if (i == 1 && hasRailing && par.botEnd == 'забег') {
					p1.x -= params.nose;
				}

				p1 = newPoint_xy(p1, 0, -h1 + params.treadThickness + 0.02);
				slotsTopPoints.push(p1);
			}

			slotsTopPoints = slotsTopPoints.concat(botPoints.slotsTopPoints);
			//нижняя линия пазов (формируем массив с конца

			var p1 = {
				x: botLineP1.x,
				y: h1 * stairAmt - params.treadThickness
			}
			slotsBotPoints.unshift(p1);

			//ступени марша
			for(var i=stairAmt; i>0; i--){
				//внутренний угол ступени и подступенка
				var p2 = {
					x: b1 * (i - 1) + nose + params.riserThickness,
					y: h1 * i - params.treadThickness - 0.03,
				}
				// if (i == 1 && hasRailing && par.botEnd == 'забег') {
				// 	p3.x -= params.nose;
				// }
				slotsBotPoints.unshift(p2);
				var p3 = newPoint_xy(p2, 0, -h1 - 0.03);
				if(p3.y < topLineP0.y) p3.y = topLineP0.y;
				slotsBotPoints.unshift(p3);
			}

			slotsBotPoints = botPoints.slotsBotPoints.concat(slotsBotPoints);
		}


		// Вырезы под опоры
		{
			//вырез под колонну
			if(stairAmt > 1 && (params.stairModel == "П-образная трехмаршевая" && params.isColumn6 == true) || (params.stairModel != "П-образная трехмаршевая" && params.isColumn4 == true)){
				var notchPar = {
					points: botLine,
					notchCenterX: par.keyPoints.marshFirst.x,
					isBotLine: true,
				}
				botLine = addNotch(notchPar).points;
				var columnPos = notchPar.notchCenterPoint;
				columnPos.treadYOffset = par.keyPoints.marshFirst.y - columnPos.y - 0.03;
				if (par.slots) par.columnsPoints.push(columnPos);
			}
			//вырез под колонну
			if(stairAmt > 1 && (params.isColumn7 == true || params.isColumn3 == true)){
				var columnPos = copyPoint(par.keyPoints.botFirst);
				columnPos.y = botLineP10.y;
				columnPos.treadYOffset = par.keyPoints.botFirst.y - columnPos.y - 0.03;
				if (par.botEnd == 'забег') {
					columnPos = newPoint_xy(topLineP9, -params.rackSize / 2, 0);
					columnPos.treadYOffset = - h3 - columnPos.y - 0.03;
				}
				if (params.stairModel == 'П-образная с площадкой' || params.stairModel == 'П-образная с забегом') {
					columnPos = newPoint_xy(par.keyPoints.botFirst, params.rackSize + params.stringerThickness / 2, 0);
					columnPos.y = botLineP10.y;
					columnPos.treadYOffset =par.keyPoints.botFirst.y - columnPos.y - 0.03;
				}
				columnPos.isCornerColumn = true;
				columnPos.isBot = true;
				if (par.slots) par.columnsPoints.push(columnPos);
			}
		}

		//Модифицируем каркас с учетом ограждений
		{
			if (par.hasRailing) {
				var lenX = (par.keyPoints.marshLastRailingPoint.x - topLineP21.x) / Math.cos(stairAngle);
				var tempPoint = polar(topLineP21, stairAngle, lenX);
				topLineP21.x = tempPoint.x;// / Math.cos(par.stairAngle);
				topLineP21.y = tempPoint.y;//lenX * Math.tan(par.stairAngle);
				if (par.botEnd == 'площадка') {
					// topLineP10.y = par.keyPoints.botLastRailingPoint.y;
					var midPoint = topLine.find( function(p){
						return p.x == par.keyPoints.botLastRailingPoint.x && p.y == par.keyPoints.botLastRailingPoint.y
					});
					// var midPoint = topLine.indexOf(par.keyPoints.botLastRailingPoint);
					if (midPoint) {
						midPoint.y = topLineP10.y;
					}
				}
			}
		}

		//создание шейпов

		//внешняя часть тетивы и внутренняя часть без подступенков (единый шейп)

		if(risers == false || !par.slots){
			var shapePar = {
				points: topLine.concat(botLine),
				dxfArr: dxfArr,
				dxfBasePoint: par.dxfBasePoint,
			}
			var stringerShape = drawShapeByPoints2(shapePar).shape;
		}

		//внутренняя часть тетивы с подступенками (два шейпа)

		if(risers == true && par.slots){
			//верхняя часть
			var shapePar = {
				points: topLine.concat(slotsTopPoints),
				dxfArr: dxfArr,
				dxfBasePoint: par.dxfBasePoint,
				markPoints: true, //пометить точки в dxf для отладки
			}
			var stringerShape = drawShapeByPoints2(shapePar).shape;

			//нижняя часть
			var shapePar = {
				points: slotsBotPoints.concat(botLine),
				dxfArr: dxfArr,
				dxfBasePoint: par.dxfBasePoint,
			}
			var stringerShape2 = drawShapeByPoints2(shapePar).shape;
		}

		//пазы для ступеней без подступенков (отверстия в шейпе)
		if(par.slots && risers == false){
			//формирование пазов для ступеней марша
			for (var i = 0; i < stairAmt; i++) {
				var holeBasePoint = {
					x: b1 * i -techDelta,
					y: h1 * (i + 1) - params.treadThickness - techDelta,
				}

				var holePar = {
					basePoint: holeBasePoint,
					height: params.treadThickness + techDelta * 2,
					len: params.a3 + techDelta * 2,
					dxfArr: dxfArr,
					dxfBasePoint: dxfBasePoint,
					rad: frontEdgeRad,
				}
				if(i == stairAmt - 1){
					holePar.len = botLineP1.x - holeBasePoint.x - techDelta;
				}
				if (i == 0 && hasRailing && par.botEnd == 'забег') {
					holePar.len -= params.nose;
					holePar.basePoint.x += params.nose;
				}
				if (i == stairAmt - 1 && testingMode) {
					holePar.len = botLineP1.x - holeBasePoint.x + techDelta;
					var slotHole = drawHolePath(holePar).path;
					stringerHoles.push(slotHole);
				}else{
					var slotHole = drawHolePath(holePar).path;
					stringerShape.holes.push(slotHole);
				}
			}

			//формирование пазов для ступеней забега/площадки

			if (par.botEnd == "площадка") {
				stringerHoles.push(slotHole1);
			}
			if (par.botEnd == "забег") {
				stringerShape.holes.push(slotHole1);
				stringerHoles.push(slotHole2);
			}
		}
		par.keyPoints.botPoint = topLineP0;
		par.keyPoints.topPoint = botLineP2;
	}//Конец тетивы

	var geom1 = new THREE.ExtrudeGeometry(stringerShape, extrudeOptions);
	geom1.rotateUV(stairAngle * -1);
	//преобразуем геометрию столба в BSP объект
	var geomBSP = new ThreeBSP(geom1);
	for (var i = 0; i < stringerHoles.length; i++) {
		var hole = stringerHoles[i].getPoints();
		var holeShape = new THREE.Shape(hole);
		//преобразуем шейп отверстия в геометрию
		var holeGeom = new THREE.ExtrudeGeometry(holeShape, extrudeOptions);
		//преобразуем геометрию отверстия в BSP объект
		var holeBSP = new ThreeBSP(holeGeom);

		//Выдавливаем отверстие в столбе
		var geomBSP = geomBSP.subtract(holeBSP);
	}
	//Преобразуем обратно в геометрию
	geom1 = geomBSP.toGeometry();
	geom1.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom1, params.materials.timber2);
	mesh.userData = {textureRot: stairAngle};
	par.meshes.push(mesh);

	if(stringerShape2){
		var geom2 = new THREE.ExtrudeGeometry(stringerShape2, extrudeOptions);
		geom2.rotateUV(stairAngle * -1);
		geom2.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var mesh = new THREE.Mesh(geom2, params.materials.timber);
		mesh.userData = {textureRot: stairAngle};
		par.meshes.push(mesh);
	}
	return par;
}//end of drawStringer3

/*внешний косоур/тетива среднего марша П-образной лестницы и задней части забега П-образной*/

function drawStringer5(par) {
	var stringerHoles = [];

	var marshPar = getMarshParams(par.marshId); //функция в файле inputsReading.js
	
	par.meshes = [];
	var stringerShape = new THREE.Shape();

	//именованные ключевые точки
	// if(!par.keyPoints) par.keyPoints = {};
	par.keyPoints.zeroPoint = {x:0, y:0};


	var slots = par.slots;

	var thk = params.stringerThickness - params.stringerSlotsDepth;
	if(slots) thk = params.stringerSlotsDepth;
	var extrudeOptions = {
		amount: thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	//рассчитываем параметры косоура по номеру марша и стороне
	calcStringerPar(par);

	var marshPar = getMarshParams(par.marshId); //функция в файле inputsReading.js
	var h = marshPar.h;
	var b = marshPar.b;
	var a = marshPar.a;
	var h_topWnd = marshPar.h_topWnd;
	var stairAmt = marshPar.stairAmt

	var nextMarshRailing = params.railingSide_3;
	var thisMarshRailing = params.railingSide_2;
	var prevMarshRailing = params.railingSide_1;

	//наличие ограждения на предыдущем марше
	var railingConnectionBot = false;
	if(prevMarshRailing == "внешнее" || prevMarshRailing == "две"){
		railingConnectionBot = true;
	}
	par.railingConnectionBot = railingConnectionBot;

	//наличие ограждения на следующем марше
	var railingConnectionTop = false;
	if(nextMarshRailing == "внешнее" || nextMarshRailing == "две"){
		railingConnectionTop = true;
	};
	par.railingConnectionTop = railingConnectionTop

	if(par.isRearP) {
		stairAmt = 0;
		thisMarshRailing = params.railingSide_2;
	}

	var risers = params.riserType == "есть";
	par.risers = risers;
	var dxfBasePoint = par.dxfBasePoint;
	var dxfArr = dxfPrimitivesArr;
	if(!slots) dxfArr = [];
	var turnLength = par.turnLength;

	var topMarshXOffset = 10;
	var topMarshZOffset = -30;
	par.topMarshXOffset = topMarshXOffset;
	par.topMarshZOffset = topMarshZOffset;
	var bottomRackNotch = par.bottomRackNotch;
	var stringerThickness = params.stringerThickness;
	var stringerSlotsDepth = params.stringerSlotsDepth;
	var topRackTreadOffset = 0;

	var stringerLedge = 15;
	if (par.botEnd == "забег") stringerLedge = 100;
	par.stringerLedge = stringerLedge;

	var stringerLedge2 = 15;
	if (par.topEnd == "забег") stringerLedge2 = 100;

	var stringerWidth = 300;
	if(par.type == "косоур") {
		stringerWidth = 200;
	}

	var slotsOffset = 20;
	if (params.stairModel == 'П-образная с забегом' && par.marshId == 2) {
		slotsOffset = 45;
	}
	par.slotsOffset = slotsOffset;
	par.platformWidth = par.stringerWidth = par.width = stringerWidth;

	var stairAngle = Math.atan(h/b);
	par.stairAngle = stairAngle;

	var platformRailingRack2OffsetX = 100;
	par.platformRailingRack2OffsetX = platformRailingRack2OffsetX;
	var topPointOffsetY = 20; //отступ среза верхнего угла тетивы от уровня верхнего перекрытия для регулировки
	par.topPointOffsetY = topPointOffsetY;

	//нижние точки
	var botPoints = calcBotStepPoints(par);

	var topLineP0 = botPoints.topLineP0;
	var topLineP1 = botPoints.topLineP1;
	var topLineP10 = botPoints.topLineP10;
	var topLineP11 = botPoints.topLineP11;
	var botLineP10 = botPoints.botLineP10;

	var stringerShape = new THREE.Shape();

	var text =	par.type == "тетива" ? "Внешняя тетива верхнего марша (пазы снизу)" : "Внешний косоур верхнего марша";
	var textHeight = 30;
	var textBasePoint = newPoint_xy(dxfBasePoint, 0, -100);
	addText(text, textHeight, dxfPrimitivesArr, textBasePoint);

	if (par.type == "косоур") {
		//массив точек внешнего контура косоура
		var topLine = [];

		var botPoints = calcPointsTurnOut_bot(par);

		// var rack2PosTemp = copyPoint(par.keyPoints.rack2Pos);
		var topLineP0 = botPoints.topLineP0;
		var botTurnRailingP1 = botPoints.botTurnRailingP1;
		var topLineP9 = botPoints.topLineP9;
		var topLineP10 = botPoints.topLineP10;
		var botLineP9 = botPoints.botLineP9;
		var botLineP10 = botPoints.botLineP10;

		if (par.botEnd == "забег") {
			topLine.push(topLineP0);
			topLine.push(botTurnRailingP1);
			topLine.push(topLineP9);

			//второй подъем забежного участка
			var p1 = newPoint_xy(topLineP9, 0, h);
			par.keyPoints.botTurnRailingP2 = copyPoint(p1);
			topLine.push(p1);

			//третья забежная ступень
			//учитываем межмаршевое расстояние при 0 ступеней
			if(stairAmt == 0 && params.stairModel !== 'П-образная с забегом') topLineP10 = newPoint_xy(topLineP10, params.marshDist + 35, 0);
			if (params.stairModel == 'П-образная с забегом') topLineP10 = newPoint_xy(topLineP10, params.marshDist, 0);

			if (params.stairModel == 'П-образная с забегом') {
				topLineP10.x += 10;
			}
			topLine.push(topLineP10);
			var topLineP11 = polar(topLineP10, par.stairAngle, 100);

			//рассчитываем координаты точек на нижней линии	забега
			var bottomLine1 = parallel(topLineP10, topLineP11, -par.stringerWidth);
			var bottomLine2 = parallel(topLineP9, topLineP10, -par.stringerWidth);
		}

		if (par.botEnd == "площадка") {
			topLine.push(topLineP0);
			topLine.push(botTurnRailingP1);
			topLine.push(topLineP10);

			var topLineP11 = polar(topLineP10, par.stairAngle, 100);

			//рассчитываем координаты точек на нижней линии	площадки
			var bottomLine1 = parallel(topLineP10, topLineP11, -par.stringerWidth);
		}

		//контур нижней части косоура
		var botLineP1 = {
			x: b * stairAmt - topRackTreadOffset,
			y: h * stairAmt - params.treadThickness
		}
		var botLineP2 = itercection(botLineP1, newPoint_xy(botLineP1, 0, 100), bottomLine1.p1, bottomLine1.p2);
		par.botLineP1 = copyPoint(botLineP1);

		par.botLineP2 = copyPoint(botLineP2);

		var p2 = copyPoint(topLineP10);

		//цикл построения ступеней
		for(var i = 1; i < stairAmt + 1; ++i) {
			p2 = newPoint_xy(p2, 0, h);
			topLine.push(p2)
			p2 = newPoint_xy(p2, b, 0);
			topLine.push(p2)
			if(i == 1){
				par.keyPoints.marshRailingP1 = copyPoint(p2);
			}
		}
		//сохраняем точку для ограждений
		par.keyPoints.topTurnRailingP1 = copyPoint(p2);

		//последний подъем
		var topLineP20 = copyPoint(p2);
		p2 = newPoint_xy(topLineP20, 0, h);
		topLine.push(p2)

		//верхний участок

		par.keyPoints.topLineP20 = topLineP20;

		par.stringerLedge = stringerLedge2;
		var topPoints = calcPointsTurnOut_top(par);

		var topLineP21 = topPoints.topLineP21;
		// //console.log(topPoints)
		var botLineP1 = topPoints.botLineP1;
		var botLineP2 = topPoints.botLineP2;

		if (par.topEnd == "забег") {
			topLine.push(topLineP21);
			p2 = newPoint_xy(topLineP21, 0, h_topWnd);
			topLine.push(p2)
			topLine.push(botLineP1)

			if(par.botEnd == "площадка") {
				var botLineP4 = itercection(botLineP10, polar(botLineP10, stairAngle, 100), bottomLine.p1, bottomLine.p2);
			}
			if(par.botEnd == "забег") {
				var botLineP4 = itercection(botLineP9, polar(botLineP9, stairAngle, 100), bottomLine.p1, bottomLine.p2);
			}
		}

		if(par.topEnd == "площадка") {
			topLine.push(botLineP1)
			if(par.botEnd == "площадка") {
				var botLineP4 = itercection(botLineP2, newPoint_xy(botLineP2, 100, 0), botLineP10, polar(botLineP10, stairAngle, 100));
			}
			if(par.botEnd == "забег") {
				var botLineP4 = itercection(botLineP2, newPoint_xy(botLineP2, 100, 0), botLineP9, polar(botLineP9, stairAngle, 100));
			}
		}

		//задаем позицию столба (столб ограждения всегда соосен с опорной колонной)
		// par.keyPoints.rack2Pos = {
		// 	x: b * stairAmt + params.rackSize/2,
		// 	y: h * (stairAmt + 1)
		// }

		//массив точек нижней линии

		if (par.botEnd == "забег") {
			var botLine = [botLineP1, botLineP2, botLineP4, botLineP9, botLineP10];
			if(stairAmt == 0) botLine = [botLineP1, botLineP2, botLineP10];
		}

		par.keyPoints.botLineP2 = botLineP2;
		par.keyPoints.botLineP10 = botLineP10;

		if (par.botEnd == "площадка") {
			var botLine = [botLineP1, botLineP2, botLineP4, botLineP10];
		}

		{
			//вырез под колонну
			if(stairAmt > 1 && params.isColumn4 == true && par.botEnd == "забег"){
				var notchPar = {
					points: botLine,
					notchCenterX: par.keyPoints.marshFirst.x,
					isBotLine: true,
				}
				botLine = addNotch(notchPar).points;
				var columnPos = copyPoint(notchPar.notchCenterPoint);
				columnPos.treadYOffset = par.keyPoints.marshFirst.y - columnPos.y - 0.03;
				if (par.slots) par.columnsPoints.push(columnPos);
			}

			//вырез под колонну
			if(stairAmt > 1 && params.isColumn4 == true && par.botEnd == "площадка"){
				var columnPos = {x: par.keyPoints.marshFirst.x, y: botLineP10.y};
				columnPos.treadYOffset = par.keyPoints.marshFirst.y - columnPos.y - 0.03;
				if (par.slots) par.columnsPoints.push(columnPos);
			}

			//вырез под колонну
			if(stairAmt > 1 && params.isColumn8 == true){
				var notchPar = {
					points: botLine,
					notchCenterX: par.keyPoints.marshLast.x,
					isBotLine: true,
				}
				botLine = addNotch(notchPar).points;
				var columnPos = copyPoint(notchPar.notchCenterPoint);
				columnPos.treadYOffset = par.keyPoints.marshLast.y - columnPos.y - 0.03;
				if (par.slots) par.columnsPoints.push(columnPos);
			}

			//вырез под колонну
			if(stairAmt > 1 && params.isColumn3 == true){
				var columnPos = copyPoint(par.keyPoints.botFirst);
				columnPos.y = botLineP10.y;
				columnPos.treadYOffset = par.keyPoints.botFirst.y - columnPos.y - 0.03;
				columnPos.isCornerColumn = true;
				if (par.slots) par.columnsPoints.push(columnPos);
			}
		}

		par.keyPoints.topTurnRailingP2 = botLineP1;
		//перестановка точек столбов
		// par.keyPoints.rack4Pos = newPoint_xy(botLineP1, par.stringerSideOffset - params.rackSize / 2, -stringerLedge);
		// par.keyPoints.rack3Pos = par.keyPoints.rack2Pos;
		// par.keyPoints.rack2Pos = rack2PosTemp;

		//создаем шейп
		var shapePar = {
			points: topLine.concat(botLine),
			dxfArr: dxfArr,
			dxfBasePoint: par.dxfBasePoint,
			markPoints: true, //пометить точки в dxf для отладки
		}
		//////console.log(shapePar)
		stringerShape = drawShapeByPoints2(shapePar).shape;

		//отверстия для крепления ступеней
		if(slots == true && params.calcType == "timber"){
		    var xSlotOffset = 25.5;
		    var ySlotOffset = 25.5;
		    var slotDiam = 25.5;

		    for(var i = 0; i < topLine.length; i++) {
			    //выцепляем четные точки
				if(i%2){
					var center = newPoint_xy(topLine[i], xSlotOffset, -ySlotOffset);
					addRoundHole(stringerShape, dxfPrimitivesArr, center, slotDiam/2, dxfBasePoint);
					if(params.riserType == "нет"){
						var center2 = newPoint_xy(center, marshPar.b - xSlotOffset * 3, 0);
						addRoundHole(stringerShape, dxfArr, center2, slotDiam/2, dxfBasePoint);
					}
				}
			}
		}
		par.keyPoints.botPoint = topLineP0;
		par.keyPoints.topPoint = botLineP2;
	}// Конец косоура

	if (par.type == "тетива") {
		//массив точек внешнего контура косоура

		var botPoints = calcPointsTurnOut_bot(par);

		var topLineP0 = botPoints.topLineP0;
		var topLineP9 = botPoints.topLineP9;
		var topLineP10 = botPoints.topLineP10;
		var topLineP11 = botPoints.topLineP11;
		var bottomLine1 = botPoints.bottomLine1;
		var bottomLine2 = botPoints.bottomLine2;
		var botLineP9 = botPoints.botLineP9;
		var botLineP10 = botPoints.botLineP10;
		topLine = botPoints.topLine;
		var slotHole1 = botPoints.slotHole1;
		var slotHole2 = botPoints.slotHole2;

		//сохраняем точки для ограждений
		// par.keyPoints.marshRailingP1 = copyPoint(topLineP0);
		par.keyPoints.marshFirstRailingPoint = copyPoint(topLineP0);

		//вспомогательная точка на верхней линии на одном уровне с передним ребром ступени
		var topLinePt = itercection(par.keyPoints.zeroPoint, newPoint_xy(par.keyPoints.zeroPoint, 0, 100), topLineP10, topLineP11)
		par.keyPoints.topLinePt = topLinePt;

		par.stringerLedge = stringerLedge2;
		var topPoints = calcPointsTurnOut_top(par);

		var topLineP20 = topPoints.topLineP20;
		var topLineP21 = topPoints.topLineP21;
		var botLineP1 = topPoints.botLineP1;
		var botLineP2 = topPoints.botLineP2;
		var botLineP3 = topPoints.botLineP3;
		var botLineP4 = topPoints.botLineP4;


		var slotsBotPoints = topPoints.slotsBotPoints; //точки верхней линии пазов
		var slotsTopPoints = topPoints.slotsTopPoints; //точки нижней линии пазов
		//пазы в тетиве на лестнице без подступенков (path)
		var slotHole1 = topPoints.slotHole1;
		var slotHole2 = topPoints.slotHole2;

		//задаем позицию столба (столб ограждения всегда соосен с опорной колонной)


		// var rack2PosTemp = {
		// 	x: nose + params.rackSize/2 + (risers ? params.riserThickness : 0),
		// 	y: h
		// }
		//
		// if(par.botEnd == "площадка"){
		// 	rack2PosTemp.x = -(params.rackSize/2+platformRailingRack2OffsetX);
		// 	rack2PosTemp.y = 0;
		// }

		topLine.push(topLineP20);
		if(par.hasRailing && stairAmt > 0){
			var notchPar = {
				points: topLine,
				notchCenterX: par.keyPoints.marshFirst.x,
				isBotLine: false,
				botY: 0.01, //координата y дна выреза
			}

			if(par.botEnd == "забег"){
				// notchPar.botY += h;
			}
			notchPar = addNotch(notchPar);
			topLine = notchPar.points;

			//сохраняем точку для ограждений
			// par.keyPoints.marshRailingP1 = notchPar.notchRight;
			// par.keyPoints.botTurnRailingP2 = notchPar.notchLeft;

			//сохраняем точку для ограждений
			par.keyPoints.marshFirstRailingPoint = notchPar.notchRight;
			par.keyPoints.botLastRailingPoint = notchPar.notchLeft;
		}
		// //console.log(topPoints)
		topLine.pop();
		topPoints.topLine.shift();
		topLine = topLine.concat(topPoints.topLine); //точки на верхней линии

		//внешний контур нижняя линия
		var botLine = [];

		botLine.push(botLineP2)
		if (params.stairModel == 'П-образная с забегом' && par.marshId == 2) {
			botLineP3.x -= params.M / 2;
		}
		if (par.topEnd == "забег" && !(params.stairModel == 'П-образная с забегом' && par.marshId == 2)) botLine.push(botLineP3)
		if (par.topEnd == "забег" && params.stairModel == 'П-образная с забегом' && par.marshId == 2){
			// var point = itercection(botLineP2, newPoint_xy(botLineP2, -100, 0), botLineP4, newPoint_xy(botLineP2, -params.M / 2, 0));
			botLine.push(newPoint_xy(botLineP2, -150, 0))
		} 
		if(stairAmt > 0) botLine.push(botLineP4)

		//точка пересечения с полом
		botLine = botLine.concat(botPoints.botLine);

		//пазы для лестницы с подступенками

		if(risers == true && par.slots){
			//верхняя линия пазов
			var p1 = {
				x: b * (stairAmt - 1) + a,
				y: h * stairAmt
			}

			for(var i=stairAmt; i>0; i--){
				//переднее ребро ступени без учета скругления
				var p2 = {
					x: b * (i - 1),
					y: h * i,
				}
				if (par.botEnd == 'забег' && i == 1 && stairAmt > 1) {
					p2.x += nose;
				}

				var p3 = newPoint_xy(p2, 0, -params.treadThickness);

				p2.filletRad = frontEdgeRad;
				slotsTopPoints.push(p2);
				slotsTopPoints.push(p3);

				p1 = newPoint_xy(p3, nose, 0);
				if (par.botEnd == 'забег' && i == 1 && stairAmt > 1) {
					p1.x -= nose;
				}
				slotsTopPoints.push(p1);

				p1 = newPoint_xy(p1, 0, -h + params.treadThickness);
				slotsTopPoints.push(p1);
			}

			slotsTopPoints = slotsTopPoints.concat(botPoints.slotsTopPoints);
			//нижняя линия пазов (формируем массив с конца

			var p1 = {
				x: b * (stairAmt - 1) + a,
				y: h * stairAmt-params.treadThickness
			}

			//ступени марша
			for(var i=stairAmt; i>0; i--){
				//внутренний угол ступени и подступенка
				var p2 = {
					x: b * (i - 1) + nose + params.riserThickness,
					y: h * i - params.treadThickness,
				}
				slotsBotPoints.unshift(p2);
				var p3 = newPoint_xy(p2, 0, -h);
				if(p3.y < topLineP0.y) p3.y = topLineP0.y;
				slotsBotPoints.unshift(p3);
			}

			slotsBotPoints = botPoints.slotsBotPoints.concat(slotsBotPoints);
		}

		{
			//вырез под колонну
			if(stairAmt > 1 && params.isColumn4 == true){
				var notchPar = {
					points: botLine,
					notchCenterX: par.keyPoints.marshFirst.x,
					isBotLine: true,
				}
				botLine = addNotch(notchPar).points;
				var columnPos = copyPoint(notchPar.notchCenterPoint);
				columnPos.treadYOffset = par.keyPoints.marshFirst.y - columnPos.y - 0.03;
				if (par.slots) par.columnsPoints.push(columnPos);
			}

			// //вырез под колонну
			// if(stairAmt > 1 && params.isColumn4 == true && par.botEnd == "площадка"){
			// 	var columnPos = {x: par.keyPoints.marshFirst.x, y: botLineP10.y};
			// 	columnPos.treadYOffset = topLineP10.y - par.stringerLedge - columnPos.y;
			// 	if (par.slots) par.columnsPoints.push(columnPos);
			// }
			//
			//вырез под колонну
			if(stairAmt > 1 && params.isColumn8 == true){
				var notchPar = {
					points: botLine,
					notchCenterX: par.keyPoints.marshLast.x,
					isBotLine: true,
				}
				botLine = addNotch(notchPar).points;
				var columnPos = copyPoint(notchPar.notchCenterPoint);
				columnPos.treadYOffset = par.keyPoints.marshLast.y - columnPos.y - 0.03;
				if (par.slots) par.columnsPoints.push(columnPos);
			}

			if(stairAmt > 1 && params.isColumn3 == true){
				var columnPos = copyPoint(par.keyPoints.botFirst);
				columnPos.y = botLineP10.y;
				columnPos.treadYOffset = par.keyPoints.botFirst.y - columnPos.y - 0.03;
				if (par.botEnd == 'забег') {
					columnPos = newPoint_xy(topLineP9, params.rackSize / 2, 0);
					columnPos.treadYOffset = - h - columnPos.y - 0.03;
				}
				columnPos.isCornerColumn = true;
				if (par.slots) par.columnsPoints.push(columnPos);
			}
		}

		//Модифицируем каркас с учетом ограждений
		{
			if (par.hasRailing && stairAmt > 0) {
				if (par.botEnd == 'забег') {
					//console.log(topLine)
					// var index = topLine.indexOf(topLineP10);
					// var lenX = (topLineP10.x - par.keyPoints.marshFirstRailingPoint.x) / Math.cos(stairAngle);
					// let tempPoint = polar(topLineP10, stairAngle, -lenX);
					// topLineP10.x = tempPoint.x;// / Math.cos(par.stairAngle);
					// topLineP10.y = tempPoint.y;//lenX * Math.tan(par.stairAngle);
					// topLine.splice(-2, 1);
					// par.keyPoints.marshFirstRailingPoint = topLineP10;
				}
				var lenX = (par.keyPoints.marshLastRailingPoint.x - topLineP20.x) / Math.cos(stairAngle);
				var tempPoint = polar(topLineP20, stairAngle, lenX);
				topLineP20.x = tempPoint.x;// / Math.cos(par.stairAngle);
				topLineP20.y = tempPoint.y;//lenX * Math.tan(par.stairAngle);
				if (par.botEnd == 'площадка') {
					// topLineP10.y = par.keyPoints.botLastRailingPoint.y;
					var midPoint = topLine.find( function(p){
						 p.x == par.keyPoints.botLastRailingPoint.x && p.y == par.keyPoints.botLastRailingPoint.y
					 });
					// var midPoint = topLine.indexOf(par.keyPoints.botLastRailingPoint);
					if (midPoint) {
						midPoint.y = topLineP10.y;
					}
				}
			}
		}

		// //console.log(botLine, topLine)

		//перестановка точек столбов
		// par.keyPoints.rack4Pos = par.keyPoints.rack3Pos;
		// par.keyPoints.rack3Pos = par.keyPoints.rack2Pos;
		// par.keyPoints.rack2Pos = rack2PosTemp;

		//создание шейпов
		//внешняя часть тетивы и внутренняя часть без подступенков (единый шейп)
		if(risers == false || !par.slots){
			var shapePar = {
				points: topLine.concat(botLine),
				dxfArr: dxfArr,
				dxfBasePoint: par.dxfBasePoint,
			}
			var stringerShape = drawShapeByPoints2(shapePar).shape;
		}
		//внутренняя часть тетивы с подступенками (два шейпа)

		if(risers == true && par.slots){
			//верхняя часть
			var shapePar = {
				points: topLine.concat(slotsTopPoints),
				dxfArr: dxfArr,
				dxfBasePoint: par.dxfBasePoint,
				markPoints: true, //пометить точки в dxf для отладки
			}
			var stringerShape = drawShapeByPoints2(shapePar).shape;

			//нижняя часть
			var shapePar = {
				points: slotsBotPoints.concat(botLine),
				dxfArr: dxfArr,
				dxfBasePoint: par.dxfBasePoint,
			}
			var stringerShape2 = drawShapeByPoints2(shapePar).shape;
		}


		//пазы для ступеней без подступенков (отверстия в шейпе)
		if(par.slots && risers == false){
			//формирование пазов для ступеней марша
			for (var i = 0; i < stairAmt; i++) {

				var holeBasePoint = {
					x: b * i - 0.015,
					y: h * (i + 1) - params.treadThickness - 0.015,
				}

				var holePar = {
					basePoint: holeBasePoint,
					height: params.treadThickness + 0.03,
					len: a + 0.03,
					dxfArr: dxfArr,
					dxfBasePoint: dxfBasePoint,
					rad: frontEdgeRad,
				}

				var slotHole = drawHolePath(holePar).path;
				stringerShape.holes.push(slotHole);
			}

				//формирование пазов для ступеней забега/площадки

				if (botPoints.slotHole1) stringerHoles.push(botPoints.slotHole1);
				if (botPoints.slotHole2) stringerHoles.push(botPoints.slotHole2);
				if (botPoints.slotRiserHole1) stringerHoles.push(botPoints.slotRiserHole1);
				if (topPoints.slotHole1) stringerHoles.push(topPoints.slotHole1);
				if (topPoints.slotHole2) stringerHoles.push(topPoints.slotHole2);
				// stringerShape.holes.push(topPoints.slotHole1);
				// if (par.topEnd == "забег") {
				// 	stringerShape.holes.push(topPoints.slotHole2);
				// }
		}

		par.keyPoints.botPoint = topLineP0;
		par.keyPoints.topPoint = botLineP2;
	}

	var geom1 = new THREE.ExtrudeGeometry(stringerShape, extrudeOptions);
	//преобразуем геометрию столба в BSP объект
	var geomBSP = new ThreeBSP(geom1);
	for (var i = 0; i < stringerHoles.length; i++) {
		var hole = stringerHoles[i].getPoints();
		var holeShape = new THREE.Shape(hole);
		//преобразуем шейп отверстия в геометрию
		var holeGeom = new THREE.ExtrudeGeometry(holeShape, extrudeOptions);
		//преобразуем геометрию отверстия в BSP объект
		var holeBSP = new ThreeBSP(holeGeom);

		//Выдавливаем отверстие в столбе
		var geomBSP = geomBSP.subtract(holeBSP);
	}
	//Преобразуем обратно в геометрию
	geom1 = geomBSP.toGeometry();
	geom1.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom1, params.materials.timber2);
	mesh.userData = {textureRot: stairAngle};
	par.meshes.push(mesh);

	if(stringerShape2){
		var geom2 = new THREE.ExtrudeGeometry(stringerShape2, extrudeOptions);
		geom2.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var mesh = new THREE.Mesh(geom2, params.materials.timber);
		mesh.userData = {textureRot: stairAngle};
		par.meshes.push(mesh);
	}
	return par;
}//end of drawStringer5

/* проставка между столбами П-Образной лестницы*/

function drawStringer7(par){

	//именованные ключевые точки
	// if(!par.keyPoints) par.keyPoints = {};
	par.keyPoints.zeroPoint = {x:0, y:0};

	var slots = par.slots;

	var marshPar = getMarshParams(par.marshId); //функция в файле inputsReading.js
	
	var thk = params.stringerThickness - params.stringerSlotsDepth;
	if(par.side == "in") thk = params.rackSize - params.stringerSlotsDepth;
	if(slots) thk = params.stringerSlotsDepth;
	var extrudeOptions = {
		amount: thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	//рассчитываем параметры косоура по номеру марша и стороне
	calcStringerPar(par);

	//проставка между столбами
	if(par.side == "in") {
		par.len = params.marshDist;
		if(par.type == "тетива") par.len += params.stringerThickness - params.rackSize;
		var text = par.type + " между столбами";
		var sideOffset = 0;
		par.type = "тетива"; //проставка между маршами на тетивах и косоурах одинаковая
	}

	//задняя тетива/косоур площадки П-образной лестницы
	if(par.side == "out") {
		var sideOffset = params.stringerThickness;
		if(par.type == "косоур") sideOffset = params.rackSize;
		par.len = params.marshDist + params.M * 2 - 2 * sideOffset;// + params.stringerThickness;
		var text = par.type + " задней части площадки";
	}

	var stringerHoles = [];
	var dxfArr = dxfPrimitivesArr;
	if(!slots) dxfArr = [];
	var dxfBasePoint = par.dxfBasePoint;
	par.meshes = [];

	var stringerLedge = 15;
	var stringerHeight = 300;
	if(par.type == "косоур") stringerHeight = 200;
	if(par.side == "in") stringerHeight = 150;

	var textHeight = 30;
	var textBasePoint = newPoint_xy(dxfBasePoint, 0, -100)
	addText(text, textHeight, dxfArr, textBasePoint);

	var p1 = {
		x: 0,
		y: -stringerHeight + stringerLedge
	};
	if(par.side == "out") p1.x += params.stringerThickness;
	if(par.type == "косоур")
		p1 = {
			x: sideOffset,
			y: -stringerHeight - params.treadThickness
		};

	var p2 = newPoint_xy(p1, 0, stringerHeight);
	var p3 = newPoint_xy(p2, par.len, 0);
	var p4 = newPoint_xy(p1, par.len, 0);

	var points = [p1, p2, p3, p4];

	par.keyPoints.botPoint = p1;
	par.keyPoints.topPoint = p4;

	if (par.type == "тетива") {
		points = [p1];
		if (getMarshParams(1).hasRailing.out) {
			var p1_1 = newPoint_xy(p2, 0, -15);
			var p1_2 = newPoint_xy(p1_1, params.rackSize / 2 - params.stringerThickness / 2, 0);
			var p1_3 = newPoint_xy(p1_2, 0, 15);
			points.push(p1_1, p1_2, p1_3);
		}else{
			points.push(p2);
		}
		if (getMarshParams(3).hasRailing.out) {
			var p1_3 = newPoint_xy(p3, 0, -15);
			var p1_2 = newPoint_xy(p1_3, -params.rackSize / 2 + params.stringerThickness / 2, 0);
			var p1_1 = newPoint_xy(p1_2, 0, 15);
			points.push(p1_1, p1_2, p1_3);
		}else{
			points.push(p3);
		}
		points.push(p4);
	}

	if (par.type == "тетива" && slots) {
		var holeBasePoint = newPoint_xy(p2, 0,-15)
		var holePar = {
			basePoint: holeBasePoint,
			height: -params.treadThickness,
			len: params.marshDist + params.M * 2 - 2 * sideOffset + 0.01,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: par.dxfBasePoint,
			rad: 0,
		};

		var slotHole = drawHolePath(holePar).path;
		stringerHoles.push(slotHole);
	}

	var shapePar = {
		points: points,
		dxfArr: dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		markPoints: true, //пометить точки в dxf для отладки
	}
	var stringerShape = drawShapeByPoints2(shapePar).shape;

	var geom1 = new THREE.ExtrudeGeometry(stringerShape, extrudeOptions);
	//преобразуем геометрию столба в BSP объект
	var geomBSP = new ThreeBSP(geom1);
	for (var i = 0; i < stringerHoles.length; i++) {
		var hole = stringerHoles[i].getPoints();
		var holeShape = new THREE.Shape(hole);
		//преобразуем шейп отверстия в геометрию
		var holeGeom = new THREE.ExtrudeGeometry(holeShape, extrudeOptions);
		//преобразуем геометрию отверстия в BSP объект
		var holeBSP = new ThreeBSP(holeGeom);

		//Выдавливаем отверстие в столбе
		var geomBSP = geomBSP.subtract(holeBSP);
	}
	//Преобразуем обратно в геометрию
	geom1 = geomBSP.toGeometry();
	geom1.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	par.meshes.push(new THREE.Mesh(geom1, params.materials.timber2));

	return par;
} //end of drawStringer7

/*опорная колонна*/

function drawColumn(par){

	var length = par.length; //длина
	var size = par.size; //сечение
	var excerptLength = par.excerptLength; //длина выборки
	var excerptDepth = par.excerptDepth; //глубина выборки
	var dxfPrimitivesArr = par.dxfPrimitivesArr;
	var dxfBasePoint = par.dxfBasePoint;
	var strightDescriptin = par.strightDescriptin;

	var shape = new THREE.Shape();

	/*внешний контур*/

	var p0 =  {x:0,y:0}

	p1 = copyPoint(p0);
	p2 = newPoint_xy(p1, 0, length - excerptLength);
	addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);
	p1 = copyPoint(p2);
	p2 = newPoint_xy(p2, excerptDepth, 0);
	addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);
	p1 = copyPoint(p2);
	p2 = newPoint_xy(p2, 0, excerptLength);
	addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);
	p1 = copyPoint(p2);
	p2 = newPoint_xy(p2, size-excerptDepth, 0);
	addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);
	p1 = copyPoint(p2);
	p2 = newPoint_xy(p2, 0, -length);
	addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);
	addLine(shape, dxfPrimitivesArr, p2, p0, dxfBasePoint);

	var text = strightDescriptin;
	var textHeight = 30;
	var textBasePoint = newPoint_xy(dxfBasePoint, 0, -100)
	addText(text, textHeight, dxfPrimitivesArr, textBasePoint);

	var extrudeOptions = {
		amount: size,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.rotateUV(Math.PI / 2);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geometry, params.materials.timber);
	par.mesh = mesh;

	return par;
}

/*вертикальная или горизонтальная планка плинтуса*/

function drawSkirting(par){
	par.mesh = new THREE.Object3D();
	var width = 60;

	if (nose < 0) nose = 0;
	var extrudeOptions = {
			amount: par.thk,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};

	// вертикальная планка
	if(par.rise != 0){
		var shape = new THREE.Shape();
		var p0 = { "x": 0.0, "y": 0.0 };
		var p1 = newPoint_xy(p0, -width, 0);
		var p2 = newPoint_xy(p1, 0, par.rise + width);
		var p3= newPoint_xy(p2, width, 0);
		var p4= newPoint_xy(p3, 0, -width);
		var p5= newPoint_xy(p4, -nose, 0); //скругляемый угол
		var p6= newPoint_xy(p5, 0, -par.treadThk);
		var p7= newPoint_xy(p6, nose, 0);

		var fil5 = calcFilletParams1(p6, p5, p4, frontEdgeRad, false);

		addLine(shape, par.dxfArr, p0, p1, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p4, fil5.end, par.dxfBasePoint);
		addArc(shape, par.dxfArr, fil5.center, frontEdgeRad, fil5.angend, fil5.angstart, par.dxfBasePoint)
		addLine(shape, par.dxfArr, fil5.start, p6, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p6, p7, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p7, p0, par.dxfBasePoint);

		geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var mesh = new THREE.Mesh(geometry, params.materials.timber);
		par.mesh.add(mesh);
		}

	//горизонтальная планка

	if(par.step != 0){
		var length = par.step - width;
		if(par.last) length = par.step;

		var shape = new THREE.Shape();
		var p0 = { "x": 0.0, "y": 0.0 };
		var p1 = newPoint_xy(p0, 0, width);
		var p2 = newPoint_xy(p1, length, 0);
		var p3 = newPoint_xy(p2, 0, -width);
		var dxfBasePoint = newPoint_xy(par.dxfBasePoint, 100, 0);

		addLine(shape, par.dxfArr, p0, p1, dxfBasePoint);
		addLine(shape, par.dxfArr, p1, p2, dxfBasePoint);
		addLine(shape, par.dxfArr, p2, p3, dxfBasePoint);
		addLine(shape, par.dxfArr, p3, p0, dxfBasePoint);

		geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var mesh = new THREE.Mesh(geometry, params.materials.timber);
		mesh.position.y = par.rise;
		par.mesh.add(mesh);
		}

	var text = par.skirtingDescription;
	var textHeight = 30;
	var textBasePoint = newPoint_xy(par.dxfBasePoint, 0, -100)
	addText(text, textHeight, par.dxfArr, textBasePoint);

	return par;
}//end of drawSkirting

/** функция отрисовывает узел крепления лестницы к верхнему перекрытию,
состоящий из двух столбов, ступени и подступенка

	var topUnitParams = {
		heightIn: 500,
		heightOut: 300,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: {x: -500, y:0},
		newellType: params.timberNewellType,
		newellTopType: params.newellTopType,
		}


*/

function drawTopUnit(par){

	//заглушка для геометриии
	if(!par) par = {
		heightIn: 500,
		heightOut: 500,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: {x: -500, y:0},
		newellType: params.timberNewellType,
		newellTopType: params.newellTopType,
	}
	var dxfBasePoint = par.dxfBasePoint || {x:0, y: -500};

	var text = 'Верхний выходной узел';
	var textHeight = 30;
	var textBasePoint = newPoint_xy(par.dxfBasePoint, -250, -params.M / 2 - 40)
	addText(text, textHeight, par.dxfArr, textBasePoint);
		
	par.sideThk = 60; //Толщина боковой пластины
	par.midThk = params.treadThickness;
	par.midHeight = params.h3 + 40;
	nose = par.sideThk - par.midThk;
	var marshParams = getMarshParams(3);
	var newellLen = 1000;
	par.mesh = new THREE.Object3D();

	//определяем наличие столбов ограждений
	var isRailing = params.railingSide_3;
	if(params.stairModel == "Прямая") {
		isRailing = params.railingSide_1;
		par.midHeight = params.h1 + 40;
	}
	if (params.model == 'косоуры') isRailing = 'нет';
	if (params.model == 'тетива+косоур') isRailing = isRailing == 'внутреннее' ?'нет' : isRailing;
	if (params.model == 'тетива+косоур') isRailing = isRailing == 'две' ?'внешнее' : isRailing;
	
	var isNewellRight = false;
	var isNewellLeft = false;
	if(isRailing == "внешнее" || isRailing == "две") isNewellRight = true;
	if(isRailing == "внутреннее" || isRailing == "две" && params.stairAmt3) isNewellLeft = true;
	
	if(params.turnSide == "правое"){
		var temp = isNewellRight;
		isNewellRight = isNewellLeft;
		isNewellLeft = temp;
	}

	//увеличиваем длину столба на толщину верхней ступени если есть ограждение
	if(isRailing == "внешнее" || isRailing == "две") par.heightOut += params.treadThickness;
	if(isRailing == "внутреннее" || isRailing == "две") par.heightIn += params.treadThickness;


	//пересчитываем высоту досок с внутренняя-наружная на правая-левая
	var heightLeft = par.heightOut;
	var heightRight = par.heightIn;
	if(params.turnSide == "левое"){
		heightLeft = par.heightIn;
		heightRight = par.heightOut;
	}

	var newellParams = {
		type: par.newellType,
		len: newellLen + heightLeft,
		isNotched: true,
		topEndType: par.newellTopType,
		topType: par.newellTopType,
		botNotch: {
			x: params.rackSize - par.sideThk,
			y: heightLeft,
		},
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,//{x: -500, y:0},
	}

	//расчет ширины узла
	par.width = params.M;

	if(((params.railingSide_1 === "внешнее" || params.railingSide_1 === "две") && params.stairModel === "Прямая") ||
	   (params.railingSide_3 === "внешнее" || params.railingSide_3 === "две")){
		if(params.model === "тетивы" || params.model === "тетива+косоур"){
			par.width += params.rackSize/2 - params.stringerThickness/2;
		}
	}
	if(((params.railingSide_1 === "внутреннее" || params.railingSide_1 === "две") && params.stairModel === "Прямая") ||
	   (params.railingSide_3 === "внутреннее" || params.railingSide_3 === "две")){
	 if(params.model === "тетивы" && params.stairModel !== 'Прямая'){
		 par.width += params.rackSize/2 - params.stringerThickness/2;
		}
		if (params.stairModel == 'Прямая') {
			if(params.model === "тетива+косоур"){
				par.width -= params.rackSize / 2 - params.stringerThickness / 2;
			}
			if (params.railingSide_1 == 'две') {
				if(params.model === "косоуры"){
					// par.width -= params.rackSize / 2 - params.stringerThickness / 2;
				}else{
					par.width += params.rackSize/2 - params.stringerThickness/2;
				}
			}
		}

	}

	if (params.railingSide_1 == 'внутреннее' && params.stairModel == 'Прямая' && params.model !== 'косоуры') {
		par.width += params.rackSize/2 - params.stringerThickness/2;
	}
	//левый столб
	if(isNewellLeft){
		newellParams.dxfBasePoint = newPoint_xy(dxfBasePoint, -heightLeft + 0.03, -params.M / 2);
		var newell = drawTimberNewell_4(newellParams).mesh;
		newell.position.x = -par.sideThk;
		newell.position.y = -heightLeft + 0.03;
		newell.position.z = -params.M / 2;
		par.mesh.add(newell);
		}

		//правый столб
	if(isNewellRight){
		newellParams.len = newellLen + heightRight;
		newellParams.botNotch.y = heightRight;
		newellParams.dxfBasePoint = newPoint_xy(dxfBasePoint, -heightLeft + 0.03, par.width - params.rackSize - params.M / 2);
		var newell = drawTimberNewell_4(newellParams).mesh;
		newell.position.x = -par.sideThk;
		newell.position.y = -heightRight + 0.03;
		newell.position.z = par.width - params.rackSize - params.M / 2;
		//////console.log(newellParams)
		par.mesh.add(newell);
	}

		//левая доска
	if(!isNewellLeft && marshParams.stairAmt > 0){
		var platePar = {
			len: heightLeft,
			width: params.rackSize,
			thk: par.sideThk,
			dxfArr: par.dxfArr,
			dxfBasePoint: newPoint_xy(dxfBasePoint, -heightLeft - params.treadThickness, params.rackSize - params.M / 2),
			text: "",
			material: params.materials.timber,
		}
		var plate = drawPlate(platePar).mesh;
		plate.rotation.y = -Math.PI/2;
		plate.rotation.z = Math.PI/2;
		plate.position.x = 0;
		plate.position.y = -heightLeft - params.treadThickness;
		plate.position.z = params.rackSize - params.M / 2;
		par.mesh.add(plate);
		}

	//правая доска
	if(!isNewellRight && marshParams.stairAmt > 0){
		var platePar = {
			len: heightRight,
			width: params.rackSize,
			thk: par.sideThk,
			dxfArr: par.dxfArr,
			dxfBasePoint: newPoint_xy(dxfBasePoint, -heightRight - params.treadThickness, par.width - params.M / 2),
			text: "",
			material: params.materials.timber,
		}
		var plate = drawPlate(platePar).mesh;
		plate.rotation.y = -Math.PI/2;
		plate.rotation.z = Math.PI/2;
		plate.position.x = 0;
		plate.position.y = -heightRight - params.treadThickness;
		plate.position.z = par.width - params.M / 2;
		par.mesh.add(plate);
	}

		//средняя доска
	var platePar = {
		len: par.midHeight,
		width: par.width - 2 * params.rackSize,
		thk: par.midThk,
		dxfArr: par.dxfArr,
		dxfBasePoint: newPoint_xy(dxfBasePoint, -par.midHeight - params.treadThickness, par.width - 2 * params.rackSize + params.rackSize - params.M / 2),
		text: "",
		material: params.materials.timber,
	}
	if (params.model == 'косоуры' && marshParams.stairAmt == 0) platePar.dxfBasePoint = newPoint_xy(dxfBasePoint, -par.midHeight - params.treadThickness, platePar.width - params.M / 2);

	if (params.model == 'косоуры' && marshParams.stairAmt == 0) platePar.width = par.width - params.rackSize;
	var plate = drawPlate(platePar).mesh;
	plate.geometry.rotateUV(Math.PI / 2);
	plate.rotation.y = -Math.PI/2;
	plate.rotation.z = Math.PI/2;
	plate.position.x = 0;
	plate.position.y = -par.midHeight - params.treadThickness;
	plate.position.z = platePar.width + params.rackSize - params.M / 2;
	// if (params.model == 'косоуры' && marshParams.stairAmt == 0) plate.position.z = platePar.width - params.M / 2;
	par.mesh.add(plate);


	var topTreadPosZ = 0;
	if (isNewellLeft && isNewellRight && turnFactor == -1 && params.stairModel == 'Прямая' && params.model == 'тетивы') topTreadPosZ = -params.rackSize / 2 + 20;
	if (isNewellLeft && isNewellRight && turnFactor == 1 && params.stairModel == 'Прямая' && (params.model == 'тетивы' || params.model == 'тетива+косоур')) topTreadPosZ = -params.rackSize / 2 + 20;
	if (isNewellLeft && isNewellRight && turnFactor == 1 && params.stairModel !== 'Прямая' && params.model == 'тетива+косоур') topTreadPosZ = -params.rackSize / 2 + 20;
	if (isNewellLeft && isNewellRight && turnFactor == 1 && params.stairModel !== 'Прямая' && params.model == 'тетивы') topTreadPosZ = -params.rackSize / 2 + 20;
	if (isNewellLeft && !isNewellRight && turnFactor == 1 && (params.model == 'тетивы' || params.model == 'тетива+косоур')) topTreadPosZ = -params.rackSize / 2 + 20;
	if (isNewellLeft && !isNewellRight && turnFactor == -1 && params.stairModel !== 'Прямая' && params.model == 'тетивы') topTreadPosZ = -params.rackSize / 2 + 20;
	if (params.model == 'косоуры' && marshParams.stairAmt == 0) topTreadPosZ += params.rackSize;

	//верхняя ступень
	var platePar = {
		len: par.sideThk,
		width: par.width,
		thk: params.treadThickness,
		dxfArr: par.dxfArr,
		dxfBasePoint: newPoint_xy(dxfBasePoint, -params.treadThickness, topTreadPosZ - params.M / 2 + params.rackSize),
		text: "",
		material: params.materials.tread,
	}
	if(isNewellLeft) platePar.dxfBasePoint.y += params.rackSize;

	if(isNewellRight) platePar.width -= params.rackSize;
	if(isNewellLeft) platePar.width -= params.rackSize;
	if (marshParams.stairAmt == 0) platePar.width -= params.rackSize;

	var plate = drawPlate(platePar).mesh;
	plate.rotation.x = Math.PI/2;
	plate.position.x = -platePar.len;
	plate.position.y = 0;
	plate.position.z = topTreadPosZ - params.M / 2;
	// if(isNewellLeft) plate.position.z += params.rackSize;
	par.mesh.add(plate);

	var treadSizeA = platePar.width;
	var treadSizeB = platePar.len;

 // par.mesh.position.x += 20; //костыль - должна быть разница толщины боковой и средней досок
	// console.log(params.stairModel, marshParams.stairAmt)
	// if (isNewellRight && isNewellLeft && turnFactor == -1) par.mesh.position.z = 0;//params.rackSize / 2 - 20;

	var mesh = new THREE.Object3D();
	mesh.add(par.mesh);
	par.mesh = mesh;

	//сохраняем данные для спецификации

	var partName = "topUnit";
	if (typeof specObj != 'undefined'){
		if (!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Верхний узел",
				area: 0,
				paintedArea: 0,
				metalPaint: false,
				timberPaint: true,
				division: "timber",
				workUnitName: "area", //единица измерения
				group: "stringers",
			}
		}

		var name = Math.round(par.width) + "х" + Math.round(Math.max(heightRight, heightLeft) + params.treadThickness)
		var area = par.width * par.midHeight / 1000000;

		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		specObj[partName]["paintedArea"] += area * 2;
		
		//верхняя ступенька
		var partName = "tread";
		if(!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Ступень",
				area: 0,
				paintedArea: 0,
				metalPaint: false,
				timberPaint: true,
				division: "timber",
				workUnitName: "amt",
				group: "treads",
				}
			}
		var name = Math.round(treadSizeA) + "х" + Math.round(treadSizeB) + "х" + params.treadThickness;
		var area = treadSizeA * treadSizeB / 1000000;

		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		specObj[partName]["paintedArea"] += area * 2 + area * 0.1; //к-т 0,1 учитывает площадь торцев
		
	}

	return par;

} //end of drawTopUnit

/*расчет параметров косоура*/

function calcStringerPar(par){

	/*функция добавляет во входящий объект следующие параметры косоура/тетивы:
	type
	hasRailing
	stringerSideOffset
	botEnd
	topEnd
	slotsOffset
	bottomRackNotch
	turnLength

	исходные данные:
	side
	marshId
	*/

	//исходные данные
	var side = par.side;
	var marshId = par.marshId;
	var isRearP = par.isRearP;
	par.newellSlotDepth = 30;//глубина паза в столбе под косоур
	//тип
	par.type = "косоур";
	if(params.model == "тетивы") par.type = "тетива";
	if (params.model == "тетива+косоур"){
		if(side == "in") par.type = "косоур";
		if(side == "out") par.type = "тетива";
		}

	//наличие ограждений
	var railingSide = getMarshParams(marshId).railingSide;


	par.hasRailing = false;
	if(railingSide == "две") par.hasRailing = true;
	if(side == "in" && railingSide == "внутреннее") par.hasRailing = true;
	if(side == "out" && railingSide == "внешнее") par.hasRailing = true;

	if(isRearP) {
		par.hasRailing = false;
		}

	//отступ от края марша
	par.stringerSideOffset = params.rackSize - params.stringerThickness;
	if(par.type == "тетива") par.stringerSideOffset = 0;

	//тип верхнего и нижнего поворотов

	par.botEnd = getMarshParams(marshId).botTurn;
	par.topEnd = getMarshParams(marshId).topTurn;

	if(side == "in"){
		if(par.botEnd != "пол") par.botEnd = "столб";
		if(par.topEnd != "пол") par.topEnd = "столб";
		}
	if(isRearP) {
		if(params.stairModel == "П-образная с площадкой") {
			par.botEnd = "площадка";
			par.topEnd = "площадка";
			}
		if(params.stairModel == "П-образная с забегом") {
			par.botEnd = "забег";
			par.topEnd = "забег";
			}
		}

	//колонны
	if(marshId == 1 && params.stairModel == "Прямая"){
		if(par.side == "in") par.column = params.isColumn2;
		if(par.side == "out") par.column = params.isColumn1;
	}

	if(marshId == 3 && (params.stairModel == "Г-образная с площадкой" || params.stairModel == "Г-образная с забегом")){
		// if(par.side == "in") par.column = params.isColumn2;
		if(par.side == "out") par.column = params.isColumn4;
	}

	par.slotsOffset = 20;

	if(marshId == 1) par.bottomRackNotch = nose;

	//длина поворота
	par.turnLength = params.M;
	if(params.stairModel == "П-образная с площадкой") par.turnLength = params.platformLength_1;

	return par;
}

/**
	Отрисовывает опоры марша
	@param - addY
	@param - columns
	@param - marshId
	@param - dxfBasePoint

	@return mesh
*/
function drawMarshColumns(par){
	par.mesh = new THREE.Object3D();
	if (!par.columns) return par;
	var columns = par.columns;
	var model = params.model == 'тетивы' || params.model == 'тетива+косоур' ? 'тетива' : 'косоур';
	if (par.isIn && params.model == 'тетива+косоур') model = 'косоур';
	var marshParams = getMarshParams(par.marshId);
	var hasRailing = marshParams.hasRailing.out;
	if (model == 'тетива') var posZ = (params.rackSize / 2 - params.stringerThickness / 2);
	if (model == 'косоур') var posZ = 0;
	// //console.log(columns)
	for (var i = 0; i < columns.length; i++) {
		var column = columns[i];
		if (model == 'тетива' && !hasRailing && !column.isCornerColumn) posZ = -params.rackSize;//-params.stringerThickness;
		var hasHole = true;
		// if (model == 'тетива') hasHole = false;
		if (model == 'тетива' && column.isCornerColumn) hasHole = false;
		var columnParams = {
			len: column.y + par.addY - 0.01,
			model: model,
			holeHeight: column.treadYOffset - 0.01,
			hasHole: hasHole,
			rackSize: params.rackSize,
			hasRailing: hasRailing,
			dxfBasePoint: par.dxfBasePoint
		};
		if (params.stairModel == 'Прямая') {
			columnParams.hasRailing = false;
			columnParams.hasHole = true;
			posZ = -params.rackSize;// + params.stringerThickness;
		}
		if (model == 'тетива' && !hasRailing && column.isCornerColumn) columnParams.len -= params.treadThickness;
		var columnMesh = drawOpColumn(columnParams).mesh;
		columnMesh.position.x = column.x + 0.01;
		columnMesh.position.z = -params.M / 2 * turnFactor;
		// columnMesh.position.x = column.x - params.rackSize / 2;
		// if (column.isCornerColumn && model == 'косоур') columnMesh.position.x += params.rackSize + 10;//отступ от края
		// if (column.isCornerColumn && model == 'косоур' && marshParams.botTurn == 'площадка') columnMesh.position.x += params.stringerThickness / 2;//подогнано
		// columnMesh.position.z = -params.M / 2 - posZ + 0.01;
		// if (column.isCornerColumn && model == 'тетива') {
		// 	var deltaX = column.isBot ? params.stringerThickness / 2 + 5 : -params.rackSize - params.stringerThickness / 2;
		// 	columnMesh.position.x = column.x + deltaX;
		// 	columnMesh.position.z = -params.M / 2 + params.stringerThickness + 5;
		// }

		// if (column.isCornerColumn && model == 'косоур') columnMesh.position.x += params.stringerThickness * 2;
		if (par.isIn && model !== 'косоур') {
			columnMesh.rotation.y = Math.PI;
			columnMesh.position.z = (-params.M / 2 + params.stringerThickness);
			if (turnFactor == -1) {
				columnMesh.position.z = -params.M  - params.M / 2  + params.rackSize - params.stringerThickness - 15;//15 подогнано
			}
		}
		if (model == 'косоур' && par.isIn) {
			columnMesh.position.z -= params.rackSize + 15;//15 подогнано
		}
		if (model == 'косоур' && params.stairModel == 'Прямая') {
			if (turnFactor == -1 && !(params.model == 'тетива+косоур' && par.isIn)) {
				columnMesh.rotation.y = Math.PI;
				columnMesh.position.z -= params.M;
			}
			if (turnFactor == -1 && params.model == 'тетива+косоур' && par.isIn) {
				columnMesh.position.z -= params.M * 2 - 205 - params.rackSize - 0.01;
				//205 подогнано, пересчитаю
			}
			if (!par.isIn) {
				columnMesh.position.z += params.rackSize + params.stringerThickness + 15 + 0.01;
				columnMesh.rotation.y = Math.PI * turnFactor;
				if (turnFactor == -1) {
					columnMesh.rotation.y = 0;
				}
			}
		}

		if (column.isCornerColumn && (params.stairModel == 'П-образная с площадкой' || params.stairModel == 'П-образная с забегом')){
			columnMesh.position.x = column.x - params.rackSize / 2 - params.stringerThickness;
		}
		if (column.isCornerColumn && !(params.stairModel == 'П-образная с площадкой' || params.stairModel == 'П-образная с забегом')){// && marshParams.botTurn == 'забег') {
			columnMesh.position.x = -params.M + params.rackSize;
			if (model == 'косоур') {
				columnMesh.position.x += params.rackSize + 5;
			}
		}

		par.mesh.add(columnMesh);
	}

	return par;
}

/**
	Функция отрисовывает опорные колонну
	@param - len
	@param - model
	@param - holeHeight
	@param - hasHole
	@param - rackSize
	@param - dxfBasePoint

	@return mesh
*/
function drawOpColumn(par){
	par.mesh = new THREE.Object3D();

	var extrudeOptions = {
		amount: par.rackSize,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	var points = [];
	if (par.model == 'косоур') {
		//Контур столба
		var p1 = {x: 0, y: 0};
		var p2 = newPoint_xy(p1, 0, par.len + par.holeHeight - params.treadThickness - 0.01);
		var p3 = newPoint_xy(p2, par.rackSize - params.stringerThickness - 0.01, 0);
		var p4 = newPoint_xy(p3, 0, -par.holeHeight + params.treadThickness - 0.01);
		var p5 = newPoint_xy(p4, params.stringerThickness + 0.01, 0);
		var p6 = newPoint_xy(p5, 0, -par.len);
		points = [p1, p2, p3, p4, p5, p6];
	}
	if (par.model == 'тетива' && par.hasHole) {
		//Контур столба
		var p1 = {x: 0, y: 0};
		var p2 = newPoint_xy(p1, 0, par.len + par.holeHeight);
		var p3 = newPoint_xy(p2, par.rackSize / 2 - params.stringerThickness / 2 - 0.03, 0);
		var p4 = newPoint_xy(p3, 0, -par.holeHeight);
		var p5 = newPoint_xy(p4, params.stringerThickness + 0.03, 0);
		var p6 = newPoint_xy(p5, 0, par.holeHeight - params.treadThickness - 0.01);
		var p7 = newPoint_xy(p6, par.rackSize / 2 - params.stringerThickness / 2, 0);
		var p8 = newPoint_xy(p7, 0, -par.len - par.holeHeight + params.treadThickness);
		points = [p1, p2, p3, p4, p5, p6, p7, p8];
	}
	if (par.model == 'тетива' && !par.hasHole) {
		//Контур столба
		var p1 = {x: 0, y: 0};
		var p2 = newPoint_xy(p1, 0, par.len + par.holeHeight - params.treadThickness);
		var p3 = newPoint_xy(p2, par.rackSize, 0);
		var p4 = newPoint_xy(p3, 0, -par.holeHeight - par.len + params.treadThickness);
		points = [p1, p2, p3, p4];
	}
	if (par.model == 'тетива' && par.hasHole && !par.hasRailing) {
		//Контур столба
		var p1 = {x: 0, y: 0};
		var p2 = newPoint_xy(p1, 0, par.len + par.holeHeight - params.treadThickness - 0.01);
		var p3 = newPoint_xy(p2, -par.rackSize + params.stringerThickness - 0.01, 0);
		var p4 = newPoint_xy(p3, 0, -par.holeHeight + params.treadThickness - 0.01);
		var p5 = newPoint_xy(p4, -params.stringerThickness + 0.01, 0);
		var p6 = newPoint_xy(p5, 0, -par.len);
		points = [p1, p2, p3, p4, p5, p6];
	}
	// //console.log(points)

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
	}
	var shape = drawShapeByPoints2(shapePar).shape;
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.rotateUV(Math.PI / 2);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.timber)
	mesh.position.x = params.rackSize;
	mesh.rotation.y = -Math.PI / 2 * turnFactor;
	if (par.model == 'тетива' && !par.hasHole) {
		mesh.position.z = (params.stringerThickness + 5) * turnFactor;
		if (turnFactor == -1) mesh.position.x = 0;
	}
	if (par.model == 'косоур') {
		mesh.position.x = params.rackSize / 2 * turnFactor;
	}

	if (par.model == 'тетива' && par.hasHole && !par.hasRailing) {
		mesh.position.x = params.rackSize / 2 * turnFactor;
		mesh.position.z = (params.rackSize + 0.01) * turnFactor;//(-(params.rackSize - params.stringerThickness) / 2) * turnFactor;
	}
	if (par.model == 'тетива' && par.hasHole && par.hasRailing) {
		mesh.position.x = params.rackSize / 2 * turnFactor;
		mesh.position.z = (-(params.rackSize - params.stringerThickness) / 2) * turnFactor;
	}
	par.mesh.add(mesh);

	//сохраняем данные для спецификации

	var partName = "column";
	if (typeof specObj != 'undefined'){
		if (!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Опорный столб",
				area: 0,
				paintedArea: 0,
				metalPaint: false,
				timberPaint: true,
				division: "timber",
				workUnitName: "area", //единица измерения
				group: "newells",
			}
		}

		var name = "L=" + Math.round(par.len + par.holeHeight)
		var area = params.rackSize * 4 * (par.len + par.holeHeight - params.treadThickness) / 1000000;

		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		specObj[partName]["paintedArea"] += area * 2;
	}
	par.mesh.specId = partName + name;

	return par
}
