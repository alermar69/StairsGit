
function drawRailing(par) {
	/*функция отрисовывает ограждения на все марши всех лестниц
	парметры:
	dxfBasePoint
	treadsObj
	stringerParams - только для metal
	*/
	var dxfX0 = par.dxfBasePoint.x;
	par.mesh = new THREE.Object3D();
	par.forgedParts = new THREE.Object3D();
	par.handrails = new THREE.Object3D();

	//ограждения нижнего марша
	par.handrailParams = {};

	var marshId = 1;
	var railingObj = drawMarshRailing(par, marshId);
	var railing = railingObj.railing;
	par.mesh.add(railing);
	if (railingObj.forgedParts) {
		var forge = railingObj.forgedParts;
		par.forgedParts.add(railingObj.forgedParts);
	}
	if (railingObj.handrails) {
		var handrails = railingObj.handrails;
		par.handrails.add(railingObj.handrails);
	}
	par.handrailParams[marshId] = railingObj.handrailParams;

	// ограждения второго марша
	if (params.stairModel == "П-образная трехмаршевая" || (params.stairModel == "П-образная с забегом" || params.stairModel == "П-образная с площадкой") ) {
		par.dxfBasePoint.x = dxfX0;
		par.dxfBasePoint.y += 3000;

		marshId = 2;
		var railingObj = drawMarshRailing(par, marshId);
		par.handrailParams[marshId] = railingObj.handrailParams;
		var baseUnitPos = par.treadsObj.unitsPos.marsh2;
		if (params.stairModel == "П-образная с забегом") {
			baseUnitPos = par.treadsObj.unitsPos.turn2;
			//костыль по аналогии с каркасом
			if (params.model == "лт") baseUnitPos.z -= (params.marshDist - 35) * turnFactor;
			if (params.model == "ко") baseUnitPos.z -= (params.M + params.marshDist - 35 - params.stringerThickness) * turnFactor;
		}
		if (params.stairModel == "П-образная с площадкой") {
			baseUnitPos = par.treadsObj.unitsPos.turn1;
			//костыль по аналогии с каркасом
			//if (params.model == "лт") baseUnitPos.z -= (params.marshDist - 35) * turnFactor;
			//if (params.model == "ко") baseUnitPos.z -= (params.M + params.marshDist - 35 - params.stringerThickness) * turnFactor;
		}

		// if (params.calcType == 'timber') {
		// 	baseUnitPos = copyPoint(par.treadsObj.unitsPos.turn1);
		// 	baseUnitPos.x += -params.M / 2 + params.platformLength_1;
		// 	if (params.model == 'тетивы' || params.model == 'тетива+косоур') {
		// 		// basePltPoint.x += params.stringerThickness + 10;
		// 		baseUnitPos.y += 15;
		// 	}
		// 	baseUnitPos.rot = - Math.PI / 2 * turnFactor
		// }

		var railing = railingObj.railing;
		railing.position.x += baseUnitPos.x;
		railing.position.y += baseUnitPos.y;
		railing.position.z += baseUnitPos.z;
		railing.rotation.y = baseUnitPos.rot;
		par.mesh.add(railing)

		if (railingObj.forgedParts) {
			var forge = railingObj.forgedParts;
			forge.position.x += baseUnitPos.x;
			forge.position.y += baseUnitPos.y;
			forge.position.z += baseUnitPos.z;
			forge.rotation.y = baseUnitPos.rot;
			par.forgedParts.add(forge);
		}
		if (railingObj.handrails) {
			var handrails = railingObj.handrails;
			handrails.position.x += baseUnitPos.x;
			handrails.position.y += baseUnitPos.y;
			handrails.position.z += baseUnitPos.z;
			handrails.rotation.y = baseUnitPos.rot;
			par.handrails.add(handrails);
		}
	}

	if (params.stairModel == "П-образная с площадкой" && params.backRailing_1 == "есть" && params.calcType == 'timber') {

		par.dxfBasePoint.x = dxfX0;
		par.dxfBasePoint.y += 3000;

		marshId = 2;
		var railingObj = drawMarshRailing(par, marshId);
		par.handrailParams[marshId] = railingObj.handrailParams;
		var basePltPoint = copyPoint(par.treadsObj.unitsPos.turn1);
		basePltPoint.x += -params.M / 2 + params.platformLength_1;
		if (params.model == 'тетивы' || params.model == 'тетива+косоур') {
			// basePltPoint.x += params.stringerThickness + 10;
			basePltPoint.y += 15;
		}
		basePltPoint.rot = - Math.PI / 2 * turnFactor

		var railing = railingObj.railing;
		railing.position.x += basePltPoint.x;
		railing.position.y += basePltPoint.y;
		railing.position.z += basePltPoint.z;
		railing.rotation.y = basePltPoint.rot;
		par.mesh.add(railing)

		if(railingObj.forgedParts) {
			var forge = railingObj.forgedParts;
			forge.position.x += basePltPoint.x;
			forge.position.y += basePltPoint.y;
			forge.position.z += basePltPoint.z;
			forge.rotation.y = basePltPoint.rot;
			par.forgedParts.add(forge);
		}
		if(railingObj.handrails) {
			var handrails = railingObj.handrails;
			handrails.position.x += basePltPoint.x;
			handrails.position.y += basePltPoint.y;
			handrails.position.z += basePltPoint.z;
			handrails.rotation.y = basePltPoint.rot;
			par.handrails.add(handrails);
		}
	}

	//ограждение верхнего марша

	if (params.stairModel != "Прямая" && params.stairModel != "Прямая с промежуточной площадкой" && params.stairModel != "Прямая горка") {
		par.dxfBasePoint.x = dxfX0;
		par.dxfBasePoint.y += 3000;

		marshId = 3;
		var railingObj = drawMarshRailing(par, marshId);
		par.handrailParams[marshId] = railingObj.handrailParams;
		var railing = railingObj.railing;

		railing.position.x += par.treadsObj.unitsPos.marsh3.x;
		railing.position.y += par.treadsObj.unitsPos.marsh3.y;
		railing.position.z += par.treadsObj.unitsPos.marsh3.z;
		railing.rotation.y = par.treadsObj.unitsPos.marsh3.rot;
		par.mesh.add(railing);

		if (railingObj.forgedParts) {
			var forge = railingObj.forgedParts;
			forge.position.x += par.treadsObj.unitsPos.marsh3.x;
			forge.position.y += par.treadsObj.unitsPos.marsh3.y;
			forge.position.z += par.treadsObj.unitsPos.marsh3.z;
			forge.rotation.y = par.treadsObj.unitsPos.marsh3.rot;
			par.forgedParts.add(forge);
		}
		if (railingObj.handrails) {
			var handrails = railingObj.handrails;
			handrails.position.x += par.treadsObj.unitsPos.marsh3.x;
			handrails.position.y += par.treadsObj.unitsPos.marsh3.y;
			handrails.position.z += par.treadsObj.unitsPos.marsh3.z;
			handrails.rotation.y = par.treadsObj.unitsPos.marsh3.rot;
			par.handrails.add(handrails);
		}
	}

	//ограждения верхней площадки
	
	if (params.platformTop != "нет") {
		par.dxfBasePoint.x = dxfX0;
		par.dxfBasePoint.y += 3000;

		marshId = "topPlt";
		var railingObj = drawMarshRailing(par, marshId);
		var railing = railingObj.railing;

		railing.position.x += par.treadsObj.lastMarshEnd.x;
		railing.position.y += par.treadsObj.lastMarshEnd.y;
		railing.position.z += par.treadsObj.lastMarshEnd.z;
		railing.rotation.y = par.treadsObj.lastMarshEnd.rot + Math.PI / 2;
		par.mesh.add(railing);

		if (railingObj.forgedParts) {
			var forge = railingObj.forgedParts;
			forge.position.x += par.treadsObj.lastMarshEnd.x;
			forge.position.y += par.treadsObj.lastMarshEnd.y;
			forge.position.z += par.treadsObj.lastMarshEnd.z;
			forge.rotation.y = par.treadsObj.lastMarshEnd.rot + Math.PI / 2;
			par.forgedParts.add(forge);
		}
		if (railingObj.handrails) {
			var handrails = railingObj.handrails;
			handrails.position.x += par.treadsObj.lastMarshEnd.x;
			handrails.position.y += par.treadsObj.lastMarshEnd.y;
			handrails.position.z += par.treadsObj.lastMarshEnd.z;
			handrails.rotation.y = par.treadsObj.lastMarshEnd.rot + Math.PI / 2;
			par.handrails.add(handrails);
		}

	}

	if (params.calcType == 'timber' || params.calcType == 'timber_stock') {
		if (params.stairModel !== 'Прямая') par.mesh.position.x -= params.M / 2;
		if (params.stairModel == 'Прямая') {
			par.mesh.position.z -= params.M / 2 * turnFactor;
			if (params.model == 'тетивы' || (params.model == 'тетива+косоур' && par.side == 'внешнее')) {
				// par.mesh.position.z += params.rackSize * turnFactor;
			}
			// par.mesh.position.x += params.M / 2;
		}
		if (params.stairModel == 'П-образная трехмаршевая' || params.stairModel == 'П-образная с забегом' || params.stairModel == 'П-образная с площадкой') {
			par.mesh.position.z += params.M / 2 * turnFactor;
			par.mesh.position.x += params.M / 2;
		}
	}

	return par;

} //end of drawRailing

function drawMarshRailing(par, marshId) {


	var marshRailing = new THREE.Object3D();
	var forgedParts = new THREE.Object3D();
	var handrails = new THREE.Object3D();

	var marshParams = getMarshParams(marshId);
	var turnParams = calcTurnParams(marshId);

	var handrailParams = {};
	//Параметры ограждения для корректного рассчета поворотного столба

	var sectionPar = {
		marshId: marshId,
		dxfBasePoint: par.dxfBasePoint,
		stringerParams: par.stringerParams,
		rackProfile: 40
	}

	if (par.treadsObj.wndPar2 || par.treadsObj.wndPar) {
		sectionPar.wndPar = par.treadsObj.wndPar2 ? par.treadsObj.wndPar2.params : par.treadsObj.wndPar.params
	}
	if (params.calcType == 'timber' || params.calcType == 'timber_stock') {
		sectionPar.rackProfile = 0;
	}

	//выбираем функцию отрисовки ограждения
	var drawRailingSection = drawRailingSectionNewel2;
	if (params.railingModel == "Кованые балясины" || params.railingModel == "Кресты") drawRailingSection = drawRailingSectionForge2;
	
	if (params.calcType == 'mono') {
		if (params.railingModel == "Самонесущее стекло") drawRailingSection = drawGlassSectionMono;
	}
	if (params.calcType == 'metal' || params.calcType == 'vhod' || params.calcType == 'veranda') {
		if (params.railingModel == "Самонесущее стекло") drawRailingSection = drawGlassSectionMetal;
		if (params.railingModel == "Трап") drawRailingSection = drawLadderHandrail;
	}

	if (params.railingModel == "Деревянные балясины" ||
		params.railingModel == "Стекло" ||
		params.railingModel == "Дерево с ковкой") {
		drawRailingSection = drawMarshRailing_timber;
	}
	if (params.railingModel == "Реечные") {
		drawRailingSection = drawMarshRailing_racks;
	}
	/*
	if (params.calcType == 'timber') {
		drawRailingSection = drawMarshRailing_timber;
	}
*/
	var sideOffset = 0;
	var mooveY = 0;
	if (params.rackBottom == "сверху с крышкой") {
		sideOffset = 70;
		if (params.model == "лт") sideOffset = 80;
		mooveY = 110 + params.treadThickness + 1 + 0.01;
		if (params.stairType == "лотки") mooveY += 30 + params.treadThickness;
		if (params.stairType == "рифленая сталь") mooveY += 30;
		if (params.stairType == "дпк") mooveY += 14;
	}
	if (params.railingModel == "Деревянные балясины" ||
		params.railingModel == "Стекло" ||
		params.railingModel == "Дерево с ковкой") {
		sideOffset = 0;//30;
		sideOffset = 0;
		mooveY = 0;
	}
	if (params.calcType === 'bolz') {
		mooveY = 90 + 0.01;
		//sideOffset = (params.M - calcTreadLen()) / 2 + 40 + 10; // 40 - профиль больца
		sideOffset = 40 + 10; // 40 - профиль больца
		if (params.stairModel == "Прямая") sideOffset += params.M - calcTreadLen()
	}
	if (params.railingModel == "Реечные") {
		sideOffset = 0;
		mooveY = 0;
	}

	//внутренняя сторона
	var hasRailing = false;
	if (marshParams.hasRailing.in) hasRailing = true;
	if (marshParams.hasTopBalRailing.in) hasRailing = true;
	if (marshParams.hasTopPltRailing && params.platformTop == "площадка") {
		if (marshParams.hasTopPltRailing.in) hasRailing = true;
		if (marshParams.hasTopBalRailing.in) hasRailing = true;
	}
	//костыль для ограждения верхней площадки Прямой с промежуточной площадкой: там объединяются массивы для 1 и 3 марша и отрисовывается ограждение как будто только для первого марша
	if (params.stairModel == "Прямая с промежуточной площадкой") {
		if (getMarshParams(3).hasTopPltRailing && getMarshParams(3).hasTopPltRailing.in) hasRailing = true;
	}

	if (marshId != "topPlt" && hasRailing) {

		//смещаем dxfBasePoint на длину нижнего участка
		par.dxfBasePoint.x += turnParams.turnLengthBot;
		sectionPar.dxfBasePoint = par.dxfBasePoint;

		sectionPar.key = "in";
		var sectionObj = drawRailingSection(sectionPar);
		if (params.calcType == 'timber') handrailParams.in = sectionObj.handrailParams;
		var section = sectionObj.mesh;
		section.position.y = mooveY;
		section.position.z = (params.M / 2 + 0.01 - sideOffset) * turnFactor;

		if (params.stairModel == "Прямая") {
			if (!(params.calcType == 'timber' || params.calcType == 'timber_stock')) section.position.z = -(params.M / 2 - sideOffset + sectionPar.rackProfile) * turnFactor;
			if ((params.calcType == 'timber' || params.calcType == 'timber_stock') && (params.model == 'косоуры' || params.model == 'тетива+косоур')) section.position.z -= params.rackSize * turnFactor;
			if (params.calcType == 'timber' && !(params.model == 'косоуры' || params.model == 'тетива+косоур')) section.position.z -= params.stringerThickness * turnFactor;
		}
		if (params.railingModel == "Самонесущее стекло") {
			if (params.stairModel == "Прямая") section.position.z = -(params.M / 2) * turnFactor;
		}
		if (params.model == "лт") {
			if (params.railingModel == "Кресты" || params.railingModel == "Кованые балясины" || params.railingModel == "Самонесущее стекло") section.position.x -= 5;
		}
		marshRailing.add(section);

		if (sectionObj.forgedParts) {
			var forge = sectionObj.forgedParts;
			forge.position.x = section.position.x;
			forge.position.y = section.position.y;
			forge.position.z = section.position.z;
			forgedParts.add(forge);
		}
		if (sectionObj.handrails) {
			var sectHandrails = sectionObj.handrails;
			sectHandrails.position.x = section.position.x;
			sectHandrails.position.y = section.position.y;
			sectHandrails.position.z = section.position.z;
			handrails.add(sectHandrails);
		}

		//подпись в dxf
		var textHeight = 30;
		var text = marshId + " марш внутренняя сторона";
		addText(text, textHeight, dxfPrimitivesArr, newPoint_xy(par.dxfBasePoint, 0, -100));


		//смещаем dxfBasePoint на длину секции
		par.dxfBasePoint.x += marshParams.stairAmt * marshParams.b + turnParams.turnLengthTop + 1000;
		sectionPar.dxfBasePoint = par.dxfBasePoint;
	}

	//внешняя сторона
	var hasRailing = false;
	if (marshParams.hasRailing.out) hasRailing = true;
	if (marshParams.hasTopPltRailing && marshParams.hasTopPltRailing.out) hasRailing = true;
	//костыль для ограждения верхней площадки Прямой с промежуточной площадкой: там объединяются массивы для 1 и 3 марша и отрисовывается ограждение как будто только для первого марша
	if (params.stairModel == "Прямая с промежуточной площадкой") {
		if (getMarshParams(3).hasTopPltRailing && getMarshParams(3).hasTopPltRailing.out) hasRailing = true;
	}

	if (marshId != "topPlt" && hasRailing) {
		sectionPar.key = "out";
		if (params.stairModel == "П-образная с забегом" && marshId == 2) sectionPar.isRearPRailing = true;

		var sectionObj = drawRailingSection(sectionPar);
		if (params.calcType == 'timber') handrailParams.out = sectionObj.handrailParams;

		var section = sectionObj.mesh;
		section.position.y = mooveY;
		section.position.z = -(params.M / 2 + sectionPar.rackProfile - sideOffset) * turnFactor; //-(params.M / 2 + sectionPar.rackProfile) * turnFactor;
		if (params.stairModel == "Прямая" && !(params.calcType == 'timber' || params.calcType == 'timber_stock')) section.position.z = (params.M / 2 - sideOffset) * turnFactor;
		// if (params.stairModel == "Прямая" && params.calcType == 'timber') section.position.z += params.rackSize * turnFactor;
		if (params.stairModel == "Прямая" && (params.calcType == 'timber' || params.calcType == 'timber_stock') && params.model == 'косоуры') section.position.z += params.rackSize * turnFactor;
		if (params.stairModel == "Прямая" && params.calcType == 'timber' && params.model !== 'косоуры') section.position.z += params.stringerThickness * turnFactor;
		if (params.railingModel == "Самонесущее стекло") {
			section.position.z = -(params.M / 2) * turnFactor;
			if (params.stairModel == "Прямая") section.position.z = (params.M / 2) * turnFactor;
		}
		if (params.model == "лт") {
			if (params.railingModel == "Кованые балясины" || params.railingModel == "Кресты" || params.railingModel == "Самонесущее стекло") section.position.x -= 5;
		}
		marshRailing.add(section);

		if (sectionObj.forgedParts) {
			var forge = sectionObj.forgedParts;
			forge.position.x = section.position.x;
			forge.position.y = section.position.y;
			forge.position.z = section.position.z;
			forgedParts.add(forge);
		}
		if (sectionObj.handrails) {
			var sectHandrails = sectionObj.handrails;
			sectHandrails.position.x = section.position.x;
			sectHandrails.position.y = section.position.y;
			sectHandrails.position.z = section.position.z;
			handrails.add(sectHandrails);
		}

		//подпись в dxf
		var textHeight = 30;
		var text = marshId + " марш внешняя сторона";
		addText(text, textHeight, dxfPrimitivesArr, newPoint_xy(par.dxfBasePoint, 0, -100));
	}

	//задняя сторона промежуточной площадки П-образная с площадкой
	if (params.stairModel == "П-образная с площадкой" && marshId == 2 && params.backRailing_1 == "есть" && params.calcType !== 'timber' && params.calcType !== 'timber_stock') {
		sectionPar.key = "rear";
		if (params.calcType !== 'mono') {
			sectionPar.marshId = "topPlt";
			if (sectionPar.stringerParams["topPlt"])
				var topPlt = sectionPar.stringerParams["topPlt"];
			sectionPar.stringerParams["topPlt"] = sectionPar.stringerParams[2];
			var racks = sectionPar.stringerParams["topPlt"].elmIns.rear.racks;
			if (params.railingModel == 'Дерево с ковкой' || params.railingModel == 'Деревянные балясины') {
				sectionPar.marshId = 2;
			}

			//при правом повороте отзеркаливаем отверстия под средние стойки площадки
			if (turnFactor == 1 && racks.length > 2) {
				for (var i = 1; i < racks.length - 1; i++) {
					racks[i].x = racks[0].x + (racks[racks.length - 1].x - racks[i].x);
					if (params.model == "лт" && (params.railingModel == "Кованые балясины" || params.railingModel == "Кресты")) racks[i].x -= 5;
				}
			}
		}
		if (params.calcType == 'mono' && params.railingModel !== "Самонесущее стекло") {
			sectionPar.isBotFlan = true;
		}

		var sectionObj = drawRailingSection(sectionPar);
		var section = sectionObj.mesh;
		section.rotation.y = Math.PI / 2;
		section.position.y = mooveY;
		section.position.x = params.platformLength_1 + params.nose;
		if (turnFactor == -1 && params.railingModel !== "Самонесущее стекло") section.position.x += sectionPar.rackProfile;
		section.position.z = -(params.M / 2 - sideOffset) * turnFactor;
		section.position.z += (params.M * 2 + params.marshDist) * (1 + turnFactor) * 0.5;
		if (params.model == "ко" && params.rackBottom == 'боковое') {
			section.position.z -= params.sideOverHang;
			section.position.y -= 40;
		}
		if (params.model == "лт") {
			section.position.y += 5;
			if (params.railingModel == "Кованые балясины" || params.railingModel == "Кресты")
				section.position.z -= 5;
		}
		if (params.calcType == 'mono' && params.railingModel !== "Самонесущее стекло") {
			section.position.x -= sectionPar.rackProfile + 18; //18 - расстояние от края нижнего фланца до стойки
			section.position.y += 0.01;
		}


		marshRailing.add(section);

		if (sectionObj.forgedParts) {
			var forge = sectionObj.forgedParts;
			forge.position.x = section.position.x;
			forge.position.y = section.position.y;
			forge.position.z = section.position.z;
			forge.rotation.y = section.rotation.y;
			forgedParts.add(forge);
		}
		if (sectionObj.handrails) {
			var sectHandrails = sectionObj.handrails;
			sectHandrails.position.x = section.position.x;
			sectHandrails.position.y = section.position.y;
			sectHandrails.position.z = section.position.z;
			sectHandrails.rotation.y = section.rotation.y;
			handrails.add(sectHandrails);
		}

		//подпись в dxf
		var textHeight = 30;
		var text = "Задняя сторона верхней площадки";
		addText(text, textHeight, dxfPrimitivesArr, newPoint_xy(par.dxfBasePoint, 0, -100));

		if (topPlt)
			sectionPar.stringerParams["topPlt"] = topPlt;
	}

	//задняя сторона верхней площадки
	if (marshId == "topPlt" && params.topPltRailing_5 && (params.platformRearStringer == 'есть' || params.calcType == "mono")) {
		sectionPar.key = "rear";
		var sectionObj = drawRailingSection(sectionPar);
		var section = sectionObj.mesh;
		section.position.y = mooveY;
		section.position.z = (- sideOffset) * turnFactor;
		if (params.platformTop == 'увеличенная' && turnFactor == 1 && params.stairModel == 'Прямая') {
			section.position.x = -(params.platformWidth_3 - params.M) - 5;
		}
		if (params.platformTop == 'увеличенная' && params.stairModel !== 'Прямая' && params.turnSide == "правое") {
			section.position.x -= params.platformWidth_3 - params.M;
		}
		if (params.calcType == "mono") section.position.x -= params.M / 2;

		//костыли
		if (params.model == "лт") section.position.x += 5;
		if (turnFactor == -1) {
			if (params.railingModel != "Самонесущее стекло") section.position.z += 40;
		}


		marshRailing.add(section);

		if (sectionObj.forgedParts) {
			var forge = sectionObj.forgedParts;
			forge.position.x = section.position.x;
			forge.position.y = section.position.y;
			forge.position.z = section.position.z;
			forgedParts.add(forge);
		}
		if (sectionObj.handrails) {
			var sectHandrails = sectionObj.handrails;
			sectHandrails.position.x = section.position.x;
			sectHandrails.position.y = section.position.y;
			sectHandrails.position.z = section.position.z;
			handrails.add(sectHandrails);
		}

		//подпись в dxf
		var textHeight = 30;
		var text = "Задняя сторона верхней площадки";
		addText(text, textHeight, dxfPrimitivesArr, newPoint_xy(par.dxfBasePoint, 0, -100));
	}

	/*	
		//боковые стороны верхней площадки, если нет ограждение марша
		if (marshParams.lastMarsh && params.platformTop == 'площадка' && params.calcType != "mono") {
			sectionPar.marshId = "topPlt";
			if (!sectionPar.stringerParams[sectionPar.marshId]) {
				sectionPar.stringerParams[sectionPar.marshId] = {};
				sectionPar.stringerParams[sectionPar.marshId].elmIns = {};
			}
			sectionPar.stringerParams[sectionPar.marshId].elmIns.in = sectionPar.stringerParams[marshId].elmIns.in;
			sectionPar.stringerParams[sectionPar.marshId].elmIns.out = sectionPar.stringerParams[marshId].elmIns.out;
	
			var hasRailing = marshParams.hasRailing.out;
			if (params.stairModel == "Прямая") hasRailing = marshParams.hasRailing.in;
			if (turnFactor == -1) {
				hasRailing = marshParams.hasRailing.in;
				if (params.stairModel == "Прямая") hasRailing = marshParams.hasRailing.out;
			}
	
			if (params.topPltRailing_3 && !hasRailing) {
				sectionPar.key = "out";
				if (turnFactor == -1) sectionPar.key = "in";
				if (params.stairModel == "Прямая") {
					sectionPar.key = "in";
					if (turnFactor == -1) sectionPar.key = "out";
				}
				sectionPar.rigelMoveZ = sectionPar.rackProfile + 20 * (1 - turnFactor) * 0.5;
				var sectionObj = drawRailingSection(sectionPar);
				var section = sectionObj.mesh;
				section.position.y = mooveY;
				section.position.z = -params.M / 2 - sectionPar.rackProfile * (1 + turnFactor) * 0.5;
	
				marshRailing.add(section);
	
				if (sectionObj.forgedParts) {
					var forge = sectionObj.forgedParts;
					forge.rotation.y = section.rotation.y;
					forge.position.x = section.position.x;
					forge.position.y = section.position.y;
					forge.position.z = section.position.z;
					forgedParts.add(forge);
				}
				if (sectionObj.handrails) {
					var sectHandrails = sectionObj.handrails;
					sectHandrails.rotation.y = section.rotation.y;
					sectHandrails.position.x = section.position.x;
					sectHandrails.position.y = section.position.y;
					sectHandrails.position.z = section.position.z;
					handrails.add(sectHandrails);
				}
	
				//подпись в dxf
				var textHeight = 30;
				var text = "Ограждение верхней площадки";
				addText(text, textHeight, dxfPrimitivesArr, newPoint_xy(par.dxfBasePoint, 0, -100));
			}
	
	
	
			var hasRailing = marshParams.hasRailing.in;
			if (params.stairModel == "Прямая") hasRailing = marshParams.hasRailing.out;
			if (turnFactor == -1) {
				hasRailing = marshParams.hasRailing.out;
				if (params.stairModel == "Прямая") hasRailing = marshParams.hasRailing.in;
			}
	
			if (params.topPltRailing_4 && !hasRailing) {
				sectionPar.key = "in";
				if (turnFactor == -1) sectionPar.key = "out";
				if (params.stairModel == "Прямая") {
					sectionPar.key = "out";
					if (turnFactor == -1) sectionPar.key = "in";
				}
				sectionPar.rigelMoveZ = sectionPar.rackProfile * (1 + turnFactor) * 0.5;
				var sectionObj = drawRailingSection(sectionPar);
				var section = sectionObj.mesh;
				section.position.y = mooveY;
				section.position.z = params.M / 2;
				if (params.railingModel != "Самонесущее стекло") section.position.z += sectionPar.rackProfile * (1 - turnFactor) * 0.5;
	
				marshRailing.add(section);
	
				if (sectionObj.forgedParts) {
					var forge = sectionObj.forgedParts;
					forge.rotation.y = section.rotation.y;
					forge.position.x = section.position.x;
					forge.position.y = section.position.y;
					forge.position.z = section.position.z;
					forgedParts.add(forge);
				}
				if (sectionObj.handrails) {
					var sectHandrails = sectionObj.handrails;
					sectHandrails.rotation.y = section.rotation.y;
					sectHandrails.position.x = section.position.x;
					sectHandrails.position.y = section.position.y;
					sectHandrails.position.z = section.position.z;
					handrails.add(sectHandrails);
				}
	
				//подпись в dxf
				var textHeight = 30;
				var text = "Ограждение верхней площадки";
				addText(text, textHeight, dxfPrimitivesArr, newPoint_xy(par.dxfBasePoint, 0, -100));
			}
	
	
	
		}
	*/
	if (marshId == "topPlt" && params.topPltRailing_4 && params.platformTop == 'увеличенная') {
		sectionPar.key = "side";
		var sectionObj = drawRailingSection(sectionPar);
		var section = sectionObj.mesh;
		section.position.y = mooveY;
		section.position.x = -(params.platformWidth_3 - params.M + params.M / 2 + 40) * turnFactor;
		if (params.platformTop == 'увеличенная' && turnFactor == 1) {
			section.rotation.y = Math.PI / 2;
			section.position.z = -params.M / 2 - 8;
		}
		if (params.platformTop == 'увеличенная' && turnFactor == -1) {
			section.rotation.y = Math.PI / 2;
			section.position.z = -params.M / 2 - 8;
		}

		//костыли
		// if(params.model == "лт") section.position.x += 5;
		// if(turnFactor == -1){
		// 	if (params.railingModel != "Самонесущее стекло") section.position.z += 40;
		// }


		marshRailing.add(section);

		if (sectionObj.forgedParts) {
			var forge = sectionObj.forgedParts;
			forge.rotation.y = section.rotation.y;
			forge.position.x = section.position.x;
			forge.position.y = section.position.y;
			forge.position.z = section.position.z;
			forgedParts.add(forge);
		}
		if (sectionObj.handrails) {
			var sectHandrails = sectionObj.handrails;
			sectHandrails.rotation.y = section.rotation.y;
			sectHandrails.position.x = section.position.x;
			sectHandrails.position.y = section.position.y;
			sectHandrails.position.z = section.position.z;
			handrails.add(sectHandrails);
		}

		//подпись в dxf
		var textHeight = 30;
		var text = "Ограждение верхней площадки";
		addText(text, textHeight, dxfPrimitivesArr, newPoint_xy(par.dxfBasePoint, 0, -100));
	}

	if (marshId == "topPlt" && params.topPltRailing_6 && params.platformTop == 'увеличенная') {
		sectionPar.key = "front";
		sectionPar.railingSide = "left";
		var sectionObj = drawRailingSection(sectionPar);
		var section = sectionObj.mesh;
		section.position.y = mooveY;
		if (params.platformTop == 'увеличенная' && turnFactor == 1) {
			section.position.x = -(params.platformWidth_3 - params.M / 2) + params.M / 2;// - params.M;
			section.position.z = -params.platformLength_3 - params.stringerThickness - 3 - 40;
		}
		if (params.platformTop == 'увеличенная' && turnFactor == -1) {
			section.position.x = params.M;//-(params.platformWidth_3 - params.M / 2);// - params.M / 2;// - params.M;
			section.position.z = -params.platformLength_3 - params.stringerThickness - 3;
		}

		//костыли
		// if(params.model == "лт") section.position.x += 5;
		// if(turnFactor == -1){
		// 	if (params.railingModel != "Самонесущее стекло") section.position.z += 40;
		// }


		marshRailing.add(section);

		if (sectionObj.forgedParts) {
			var forge = sectionObj.forgedParts;
			forge.rotation.y = section.rotation.y;
			forge.position.x = section.position.x;
			forge.position.y = section.position.y;
			forge.position.z = section.position.z;
			forgedParts.add(forge);
		}
		if (sectionObj.handrails) {
			var sectHandrails = sectionObj.handrails;
			sectHandrails.rotation.y = section.rotation.y;
			sectHandrails.position.x = section.position.x;
			sectHandrails.position.y = section.position.y;
			sectHandrails.position.z = section.position.z;
			handrails.add(sectHandrails);
		}

		//подпись в dxf
		var textHeight = 30;
		var text = "Ограждение верхней площадки";
		addText(text, textHeight, dxfPrimitivesArr, newPoint_xy(par.dxfBasePoint, 0, -100));
	}

	if (params.calcType == 'timber' || params.calcType == 'timber_stock') {
		marshRailing.position.z += (params.M / 2 + sideOffset / 2) * turnFactor;
	}

	par.isRearPRailing = null; // Очищаем, вызывает ошибки в других маршах

	var result = {
		railing: marshRailing,
		forgedParts: forgedParts,
		handrails: handrails,
		handrailParams: handrailParams,
	}
	return result;

} //end of drawMarshRailing


function drawMarshRailing_timber(par) {

	var section = new THREE.Object3D();
	var handrails = new THREE.Object3D();

	var marshParams = getMarshParams(par.marshId);
	var turnParams = calcTurnParams(par.marshId);

	var stringerParams = {};
	if (params.calcType == 'timber') {
		var stringerParams = par.stringerParams[par.marshId].params[par.key];
		stringerParams.dxfBasePoint = par.dxfBasePoint;
	}
	if (params.calcType == "metal") {
		var stringerParams = par.stringerParams[par.marshId];
		if (params.railingModel == 'Дерево с ковкой' || params.railingModel == 'Деревянные балясины') {
			stringerParams.dxfBasePoint = par.dxfBasePoint;
		}
	}
	if (params.calcType == 'mono') {
		var stringerParams = marshParams;
		stringerParams.dxfBasePoint = par.dxfBasePoint;
	}
	
	if (params.calcType == 'timber_stock') {
		var stringerParams = marshParams;
		stringerParams.dxfBasePoint = par.dxfBasePoint;
	}
	
	var railingSectionParams = {
		marshId: par.marshId,
		topEnd: marshParams.topTurn == 'пол' ? 'нет' : marshParams.topTurn,
		botEnd: marshParams.botTurn == 'пол' ? 'нет' : marshParams.botTurn,
		stringerParams: stringerParams,
		side: marshParams.side[par.key],
	}
	if (par.key == 'in') {
		railingSectionParams.topEnd = 'нет';
		railingSectionParams.botEnd = 'нет';
	}
	if (marshParams.lastMarsh && marshParams.topTurn !== 'пол') {
		railingSectionParams.topEnd = 'нет';
		if (par.key == 'in' && marshParams.hasTopPltRailing.in) railingSectionParams.topEnd = marshParams.topTurn;
		if (par.key == 'out' && marshParams.hasTopPltRailing.out) railingSectionParams.topEnd = marshParams.topTurn;
	}

	var railingSection = drawRailingSection_4(railingSectionParams).mesh;
	section.add(railingSection);

	//сохраняем данные для спецификации

	var handrailPoints = railingSectionParams.stringerParams.keyPoints;
	if (typeof railingParams != 'undefined') {
		if (!railingParams.sections) {
			railingParams.sections = {
				types: [],
				sumLen: 0,
			}
		}
		if (handrailPoints) {
			for(var i=1; i<handrailPoints.length; i++){
				var sectLen = distance(handrailPoints[i-1], handrailPoints[i]);
				railingParams.sections.types.push(sectLen);
				railingParams.sections.sumLen += sectLen / 1000;
				}
			}
		}

	var result = {
		mesh: section,
		handrails: handrails,
		handrailParams: railingSectionParams.handrailParams,
	}
	return result;
} //end of drawMarshRailing_timber

function drawMarshRailing_racks(par){
	var section = new THREE.Object3D();

	var marshParams = getMarshParams(par.marshId);
	
	var railingSectionParams = {
		marshId: par.marshId,
		topEnd: marshParams.topTurn == 'пол' ? 'нет' : marshParams.topTurn,
		botEnd: marshParams.botTurn == 'пол' ? 'нет' : marshParams.botTurn,
		side: marshParams.side[par.key],
		key: par.key
	}
	if (par.key == 'in') {
		railingSectionParams.topEnd = 'нет';
		railingSectionParams.botEnd = 'нет';
	}
	if (marshParams.lastMarsh && marshParams.topTurn !== 'пол') {
		railingSectionParams.topEnd = 'нет';
		if (par.key == 'in' && marshParams.hasTopPltRailing.in) railingSectionParams.topEnd = marshParams.topTurn;
		if (par.key == 'out' && marshParams.hasTopPltRailing.out) railingSectionParams.topEnd = marshParams.topTurn;
	}

	var railingSection = drawRailingSectionRacks(railingSectionParams).mesh;
	section.add(railingSection);

	var result = {
		mesh: section
	}
	return result;
}

/**функция отрисовывает секцию реечного ограждения
 */
function drawRailingSectionRacks(par) {
	var section = new THREE.Object3D();
	var marshPar = getMarshParams(par.marshId);
	var rackProfileX = 40;
	var rackProfileZ = 40;
	var isRound = params.racksProfile == 'Ф12' || params.racksProfile == 'Ф16' || params.racksProfile == 'Ф25' || params.racksProfile == 'Ф38'
	if (isRound) {
		if(params.racksProfile == 'Ф12') rackProfileX = rackProfileZ = 12;
		if(params.racksProfile == 'Ф16') rackProfileX = rackProfileZ = 16;
		if(params.racksProfile == 'Ф25') rackProfileX = rackProfileZ = 25;
		if(params.racksProfile == 'Ф38') rackProfileX = rackProfileZ = 38;
	}else{
		var profParams = getProfParams(params.racksProfile);
		if (profParams.sizeA && profParams.sizeB) {
			rackProfileZ = profParams.sizeA;
			rackProfileX = profParams.sizeB;
		}
	}

	var rackLength = params.staircaseHeight - params.floorThickness;// - marshPar.h;
	if (par.marshId == 2) rackLength -= treadsObj.turnEnd[1].y;
	if (par.marshId == 3) rackLength -= treadsObj.turnEnd[2].y;

	var topProfile = 40;
	rackLength -= topProfile;
	var topProfileOffsetY = rackLength
	
	var carcasOffset = 0;
	if (params.model == 'лт') carcasOffset = 8 + 5;

	var posZ = 40 + carcasOffset;
	if (par.key == 'in' && params.stairModel != 'Прямая' || par.key == 'out' && params.stairModel == 'Прямая') posZ = -rackProfileZ - carcasOffset; //(-rackProfileZ / 2 - 5 - 10) * turnFactor;

	if (turnFactor == -1) {
		posZ = -40 - carcasOffset - rackProfileZ;
		if (par.key == 'in' && params.stairModel != 'Прямая' || par.key == 'out' && params.stairModel == 'Прямая') posZ = carcasOffset;
	}
	
	var racksMode = params.racksPerStep * 1.0;
	var balDist = marshPar.b / racksMode;
	var basePoint = newPoint_xy({x:0,y:0}, 0, 0);

	if (racksMode == 1) basePoint.x = -(marshPar.a / 2 - rackProfileX / 2);
	if (racksMode == 1.5) basePoint.x = -balDist + rackProfileX / 2 + (marshPar.a - (balDist + rackProfileX)) / 2;
	if (racksMode == 2) basePoint.x = -(marshPar.b / 2 - rackProfileX / 2) / 2;

	var material = params.materials.banister;

	var polePar = {
		poleProfileY: rackProfileX,
		poleProfileZ: rackProfileZ,
		dxfBasePoint: par.dxfBasePoint,
		length: 1000,
		poleAngle: 0,
		partName: params.racksType == 'металл' ? 'racksMetalPole' :"racksTimberPole",
		material: material,
		type: isRound ? 'round' : 'rect'
	}

	if (par.botEnd == 'площадка' && par.key == 'out' && rackLength > 0) {
		var turnParams = calcTurnParams(par.marshId);
		var balsCount = Math.floor(turnParams.turnLengthBot / balDist);
		polePar.length = rackLength;

		var basePointBot = newPoint_xy(basePoint, 0, 0);
		for (var i = 0; i < balsCount; i++) {

			var rack = drawPole3D_4(polePar).mesh;
			rack.position.x = basePointBot.x;
			rack.position.y = basePointBot.y;
			// rack.position.z = -polePar.poleProfileZ / 2;
			rack.rotation.z = Math.PI / 2;
			section.add(rack);

			basePointBot = newPoint_xy(basePointBot, -balDist, 0);
		}
	}

	if (par.botEnd == 'забег' && par.key == 'out' && rackLength > 0) {
		var turnParams = calcTurnParams(par.marshId);
		var balsCount = Math.floor(turnParams.turnLengthBot / balDist);
		
		var wndPar = treadsObj.wndPar;
		if (par.marshId == 3 && params.stairModel == 'П-образная трехмаршевая') wndPar = treadsObj.wndPar2;

		var thirdStepWidth = wndPar.params[3].stepWidthHi;
		var thirdStepRacksCount = Math.floor(thirdStepWidth / balDist);
		
		var basePointBot = newPoint_xy(basePoint, 0, 0);
		var rackLengthBot = rackLength;
		polePar.length = rackLengthBot;

		// Первая ступень
		for (var i = 0; i < thirdStepRacksCount; i++) {
			var rack = drawPole3D_4(polePar).mesh;
			rack.position.x = basePointBot.x;
			rack.position.y = basePointBot.y;
			// rack.position.z = -polePar.poleProfileZ / 2;
			rack.rotation.z = Math.PI / 2;
			section.add(rack);

			basePointBot = newPoint_xy(basePointBot, -balDist, 0);
		}

		rackLengthBot += marshPar.h;
		polePar.length = rackLengthBot;
		basePointBot = newPoint_xy(basePointBot, 0, -marshPar.h);

		for (var i = 0; i < (balsCount - thirdStepRacksCount); i++) {
			var rack = drawPole3D_4(polePar).mesh;
			rack.position.x = basePointBot.x;
			rack.position.y = basePointBot.y;
			// rack.position.z = -polePar.poleProfileZ / 2;
			rack.rotation.z = Math.PI / 2;
			section.add(rack);

			basePointBot = newPoint_xy(basePointBot, -balDist, 0);
		}
	}

	for (var i = 0; i < marshPar.stairAmt; i++) {
		rackLength -= marshPar.h;
		if(rackLength <= 0) break;
		
		polePar.length = rackLength;

		var rack = drawPole3D_4(polePar).mesh;
		basePoint = newPoint_xy(basePoint, balDist, marshPar.h)

		rack.position.x = basePoint.x;
		rack.position.y = basePoint.y;
		// rack.position.z = -polePar.poleProfileZ / 2;
		rack.rotation.z = Math.PI / 2;
		section.add(rack);

		if (racksMode == 2 || racksMode == 1.5 && i % 2 == 0) {
			var rack = drawPole3D_4(polePar).mesh;
			
			basePoint = newPoint_xy(basePoint, balDist, 0);
			rack.position.x = basePoint.x;
			rack.position.y = basePoint.y;
			// rack.position.z = -polePar.poleProfileZ / 2;
			rack.rotation.z = Math.PI / 2;
			section.add(rack);
		}
	}

	if (par.topEnd == 'забег' && par.key == 'out') {
		var turnParams = calcTurnParams(par.marshId);
		var balsCount = Math.floor(turnParams.turnLengthTop / balDist);
		
		var wndPar = treadsObj.wndPar;
		if (par.marshId == 2) wndPar = treadsObj.wndPar2;
		var firstStepWidth = wndPar.params[1].stepWidthHi;
		var firstStepBalsCount = Math.floor(firstStepWidth / balDist);
		
		basePoint = newPoint_xy(basePoint, balDist, marshPar.h);
		rackLength -= marshPar.h;
		polePar.length = rackLength;

		if (rackLength > 0) {
			// Первая ступень
			for (var i = 0; i < firstStepBalsCount; i++) {
				var rack = drawPole3D_4(polePar).mesh;
				rack.position.x = basePoint.x;
				rack.position.y = basePoint.y;
				// rack.position.z = -polePar.poleProfileZ / 2;
				rack.rotation.z = Math.PI / 2;
				section.add(rack);

				basePoint = newPoint_xy(basePoint, balDist, 0);
			}

			rackLength -= marshPar.h_topWnd;
			polePar.length = rackLength;
			basePoint = newPoint_xy(basePoint, 0, marshPar.h_topWnd);
			if (rackLength > 0) {
				for (var i = 0; i < (balsCount - firstStepBalsCount); i++) {
					var rack = drawPole3D_4(polePar).mesh;
					rack.position.x = basePoint.x;
					rack.position.y = basePoint.y;
					// rack.position.z = -polePar.poleProfileZ / 2;
					rack.rotation.z = Math.PI / 2;
					section.add(rack);
		
					basePoint = newPoint_xy(basePoint, balDist, 0);
				}
			}
		}
	}
	
	if (par.topEnd == 'площадка' && par.key == 'out') {
		var turnParams = calcTurnParams(par.marshId);
		var balsCount = Math.floor(turnParams.turnLengthTop / balDist);

		var basePoint = newPoint_xy(basePoint, balDist, marshPar.h);
		rackLength -= marshPar.h;

		if (rackLength > 0) {
			polePar.length = rackLength;
			for (var i = 0; i < balsCount; i++) {
				var rack = drawPole3D_4(polePar).mesh;
				rack.position.x = basePoint.x;
				rack.position.y = basePoint.y;
				// rack.position.z = -polePar.poleProfileZ / 2;
				rack.rotation.z = Math.PI / 2;
				section.add(rack);
	
				basePoint = newPoint_xy(basePoint, balDist, 0);
			}
		}
	}

	var bbox = new THREE.Box3().setFromObject(section);
	var profLength = bbox.max.x - bbox.min.x;

	var polePar = {
		thk: topProfile,
		width: rackProfileZ + 20,
		dxfBasePoint: {x:0,y:0},//par.dxfBasePoint,
		holeStep: balDist,
		holeProfileX: rackProfileX,
		holeProfileZ: rackProfileZ,
		length: profLength,
		dxfArr: dxfPrimitivesArr,
		partName: "racksTimberPole",
		material: material
	}

	var topProfile = drawRackTopPole(polePar);
	topProfile.position.x = bbox.min.x;
	topProfile.position.y = topProfileOffsetY;
	topProfile.position.z -= 10;
	topProfile.rotation.x = -Math.PI / 2;
	topProfile.rotation.z = -Math.PI / 2;
	section.add(topProfile);

	section.position.z = posZ;
	par.mesh = section;
	return par;
} //end of drawRailingSectionRacks

function drawRackTopPole(par){
	var offset = 10; // Отступ в начале и конце

	var p0 = { x: 0, y: -offset };
	var p1 = newPoint_xy(p0, par.width, 0);
	var p2 = newPoint_xy(p1, 0, par.length + offset * 2);
	var p3 = newPoint_xy(p2, -par.width, 0);

	var shape = new THREE.Shape();
	addLine(shape, par.dxfArr, p0, p1, par.dxfBasePoint, par.layer);
	addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint, par.layer);
	addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint, par.layer);
	addLine(shape, par.dxfArr, p3, p0, par.dxfBasePoint, par.layer);

	var balsCount = Math.floor(par.length / par.holeStep);
	if (par.length % par.holeStep != 0) balsCount += 1;

	for (var i = 0; i < balsCount; i++) {
		var p0 = { x: 10, y: par.holeStep * i };
		var p1 = newPoint_xy(p0, par.holeProfileZ, 0);
		var p2 = newPoint_xy(p1, 0, par.holeProfileX);
		var p3 = newPoint_xy(p2, -par.holeProfileZ, 0);


		var hole = new THREE.Shape();
		addLine(hole, par.dxfArr, p0, p1, par.dxfBasePoint, par.layer);
		addLine(hole, par.dxfArr, p1, p2, par.dxfBasePoint, par.layer);
		addLine(hole, par.dxfArr, p2, p3, par.dxfBasePoint, par.layer);
		addLine(hole, par.dxfArr, p3, p0, par.dxfBasePoint, par.layer);

		shape.holes.push(hole);
	}

	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var poleGeometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	poleGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var pole = new THREE.Mesh(poleGeometry, par.material);

	var partName = par.partName;
	if (typeof specObj != 'undefined' && partName ) {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				paintedArea: 0,
				name: "Рейка " + params.handrailType,
				metalPaint: false,
				timberPaint: false,
				division: "timber",
				workUnitName: "sumLength",
				group: "Ограждения",
				type_comments: {}
			}

			if (partName == "racksTimberPole" || partName == 'racksMetalPole'){
				if (partName == "racksTimberPole") specObj[partName].name = "Рейка ограждения";
				if (partName == "racksMetalPole") specObj[partName].name = "Профиль ограждения";
				specObj[partName].group = "Ограждения";
			}
		}
		var name = Math.round(par.holeProfileZ) + "x" + Math.round(par.holeProfileX) + "х" + Math.round(par.length);

		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["sumLength"] += Math.round(par.length) / 1000;
		specObj[partName]["paintedArea"] += (par.width + par.thk) * 2 * par.length / 1000000;

		pole.specId = partName + name;
	}

	return pole;
}

/* Функция отрисовки ограждения с ригелями и стеклом на стойках для metal, vhod и mono*/
function drawRailingSectionNewel2(par) {

	var section = new THREE.Object3D();
	var handrails = new THREE.Object3D();

	var marshPar = getMarshParams(par.marshId);
	var rackLength = 950;
	par.rackLength = rackLength;
	var rackProfile = 40;
	par.rackProfile = rackProfile;
	var railingPositionZ = 0;
	if (turnFactor === -1) railingPositionZ = -40;
	var turnRacksParams = setTurnRacksParams(par.marshId, par.key);//параметры поворотной стойки
	if (params.calcType === 'bolz' && par.key === "in") {
		railingPositionZ = 0;
		if (turnFactor === -1) railingPositionZ = -40;
	}

	if (params.calcType === 'metal' || params.calcType === 'vhod' || params.calcType === 'bolz' || params.calcType === 'veranda') {
		//адаптация к единой функции drawMarshRailing

		par.racks = [];
		
		if (par.stringerParams && par.stringerParams[par.marshId].elmIns[par.key]) par.racks = par.stringerParams[par.marshId].elmIns[par.key].racks
		//объединяем массивы первого и третьего марша
		if ((params.stairModel == "Прямая с промежуточной площадкой" || params.stairModel == 'Прямая горка') && par.marshId !== 'topPlt') {
			par.racks = [];
			// par.racks.push(...par.stringerParams[1].elmIns[par.key].racks);
			par.racks.push.apply(par.racks, par.stringerParams[1].elmIns[par.key].racks);
			//пересчитываем координаты стоек второго марша с учетом позиции марша
			for (var i = 0; i < par.stringerParams[3].elmIns[par.key].racks.length; i++) {
				var point = copyPoint(par.stringerParams[3].elmIns[par.key].racks[i]);
				point.x += par.stringerParams[3].treadsObj.unitsPos.marsh3.x;
				point.y += par.stringerParams[3].treadsObj.unitsPos.marsh3.y;
				par.racks.push(point)
			}
		}
		if (params.stairModel == 'Прямая горка' && par.marshId !== 'topPlt') {
			par.racks = [];
			// par.racks.push(...par.stringerParams[1].elmIns[par.key].racks);
			par.racks.push.apply(par.racks, par.stringerParams[1].elmIns[par.key].racks);
			//пересчитываем координаты стоек второго марша с учетом позиции марша
			for (var i = 0; i < par.stringerParams[3].elmIns[par.key].racks.length; i++) {
				var point = copyPoint(par.stringerParams[3].elmIns[par.key].racks[i]);
				point.x = par.stringerParams[3].treadsObj.unitsPos.marsh3.x - point.x;
				point.y = par.stringerParams[3].treadsObj.unitsPos.marsh3.y + point.y;
				par.racks.push(point)
			}
		}
		if (params.calcType === 'bolz' && par.key === "in") {
			par.racks = [];
			calcRacksBolzs(par);
		}
		//рассчитываем необходимые параметры и добавляем в объект par
		setRailingParams(par) //функция в файле calcRailingParams.js
		if (par.racks.length == 0) return {mesh: section};

		//задаем параметры
		{
			if (par.key == "front") par.railingSide = "left";
			var railingSide = par.railingSide;
			if (!par.railingSide && params.model == "ко" && par.marshId == 'topPlt') railingSide = "right";
			var dxfBasePoint = par.dxfBasePoint;
			var racks = par.racks;
			var model = params.model;

			//параметры марша
			var marshPar = getMarshParams(par.marshId);
			var prevMarshPar = getMarshParams(marshPar.prevMarshId);

			par.a = marshPar.a;
			par.b = marshPar.b;
			par.h = marshPar.h;
			par.stairAmt = marshPar.stairAmt;
			par.lastMarsh = marshPar.lastMarsh;

			//задаем длину стоек
			var rackLength = 950;
			if(params.calcType == 'bolz') rackLength = 800;
			par.rackLength = rackLength;
			var rackProfile = 40;

			var dxfText = {
				side: railingSide === "left" ? " - наружный" : " - внутренний",
				marsh: " нижнего марша "
			}
		}


		/*Стойки*/

		//выделяем из массива racks первые и последние стойки поворотов и марша, рассчтываем длины и углы
		var parRacks = setRacksParams(par).parRacks; //функция в metal/drawRailing.js

		for (var i = 0; i < racks.length; i++) {
			if (!racks[i]) continue;
			var rackParams = {
				len: racks[i].len,
				railingSide: railingSide,
				stringerSideOffset: params.sideOverHang,
				showPins: true,
				showHoles: true,
				isBotFlan: false,
				material: params.materials.metal_railing,
				dxfBasePoint: newPoint_xy(par.dxfBasePoint, racks[i].x, racks[i].y),
				dxfArr: dxfPrimitivesArr,
				realHolder: true, //точно отрисовываем кронштейн поручня
				holderAng: racks[i].holderAng,
				sectText: par.text,
				marshId: par.marshId,
				key: par.key,
			}
			if (params.rackBottom == "сверху с крышкой") {
				rackParams.showPins = false;
				rackParams.showHoles = false;
				rackParams.isBotFlan = true;
			}
			if (params.calcType === 'bolz' && par.key === "in") {
				rackParams.showPins = false;
				rackParams.showHoles = false;
				rackParams.isBotFlan = false;
				rackParams.isBolz = true;
				//if (marshPar.lastMarsh && i == racks.length - 1) rackParams.len -= 4; //4 - толщина шайбы
				rackParams.len -= 4; //4 - толщина шайбы
			}
			if (params.banisterMaterial != "40х40 черн.") rackParams.material = params.materials.inox;

			if (!racks[i].noDraw) {
				//если поворотная стойка
				if (racks[i].isTurnRack) {
					rackParams.isTurnRack = racks[i].isTurnRack;
					//rackParams.holeYTurnRack - расстояние по Y для дополнительного отверстия крепления на поворотной стойке
					rackParams.holeYTurnRack = turnRacksParams.shiftYtoP0 + 20 + params.treadThickness / 2 + 60; // 20 - отступ до первого отверстия, 60 - расстояние между отверстиями
					//if (params.stairType == "лотки" || params.stairType == "рифленая сталь")
					//	rackParams.holeYTurnRack += 65;
					if (marshPar.botTurn == "забег") rackParams.holeYTurnRack -= 4;
					if (params.model == "ко") {
						if (marshPar.botTurn == "забег") rackParams.holeYTurnRack -= marshPar.h - 4;
					}
				}
				rackParams = drawRack3d_4(rackParams);
				var rack = rackParams.mesh;
				rack.position.x = racks[i].x;
				rack.position.y = racks[i].y;
				rack.position.z = railingPositionZ;
				section.add(rack);

				// на больцах, на последней стойки, из-за смещения стойки добавляем шайбы как на больцах
				if (params.calcType === 'bolz' && par.key === "in") {
					//var bolzPar = {
					//	marshId: par.marshId,
					//	dxfBasePoint: par.dxfBasePoint,
					//	h: par.h,
					//	bolzProfile: rackProfile,
					//	isRack: true,
					//}
					//if (marshPar.lastMarsh && i == racks.length - 1)
					//	bolzPar.isRackWithoutBolz = true;

					//var bolz = drawBolz(bolzPar).mesh;
					//bolz.position.x = -rackProfile / 2;
					//bolz.position.y = -90 - bolzPar.shimThk;
					//rack.add(bolz);

					rack.position.y += 4;
					
				}
			}
		} //конец стоек
	}

	if (params.calcType === 'mono') {
		var racks_mesh = drawRacksMono(par);
		section.add(racks_mesh.mesh);
		var parRacks = par.parRacks;
		var racks = par.racks;
	}

	/* ригели */
	
	if (params.railingModel === "Ригели") {

		//Задаем позицию ригелей по Z
		var rigelPosZ = 0
		var rigelProfZ = 20;
		if (params.rigelMaterial == "Ф12 нерж.") rigelProfZ = 12;
		if (par.railingSide == "left") rigelPosZ = (railingPositionZ + rackProfile) * turnFactor + 0.01;
		if (par.railingSide == "right") rigelPosZ = (railingPositionZ - rigelProfZ - 0.01);
		if (par.marshId == "topPlt") {
			rigelPosZ = -rigelProfZ - 0.01;
			if (turnFactor == -1) rigelPosZ -= rackProfile - 0.01;
		}
		if (par.marshId == "topPlt" && par.key == "front") {
			rigelPosZ = rackProfile * (1 + turnFactor) * 0.5;
		}
		if (par.rigelMoveZ) rigelPosZ += par.rigelMoveZ;
		if (params.stairModel == 'П-образная с площадкой' && par.marshId == 2) rigelPosZ -= rigelProfZ;
		if (params.stairModel == 'П-образная с площадкой' && par.marshId == 2 && params.turnSide == 'левое') rigelPosZ -= rackProfile;
		//шаг ригелей по вертикали
		var rigelAmt = Number(params.rigelAmt);
		//устраняем пересечение нижнего ригеля и нижней забежной ступени на монокосоарах
		var rigelMooveY = 0;
		if (params.calcType === 'mono') {
			if (rigelAmt == 2) rigelMooveY = -40;
			if (rigelAmt == 3) rigelMooveY = 50;
			if (rigelAmt == 4) rigelMooveY = -120;
		};
		if (params.calcType === 'metal' || params.calcType === 'vhod' || params.calcType === 'veranda') rigelMooveY = par.b / 2 * Math.tan(parRacks.angMarsh);
		if (isNaN(rigelMooveY)) rigelMooveY = 0;
		var rigelDist = (rackLength - 50 - rigelMooveY) / (rigelAmt + 1);

		if (params.calcType == 'bolz' && marshPar.topTurn == 'забег' && par.key == 'in') {
			if (rigelAmt == 2) rigelDist -= 40;
			if (rigelAmt == 3) rigelMooveY = 50;
			if (rigelAmt == 4) rigelMooveY = -120;
		}


		//формируем массив базовых точек для ригелей
		if (params.calcType === 'metal' || params.calcType === 'vhod' || params.calcType === 'bolz' || params.calcType === 'veranda') {
			var rigelBasePoints = [];

			if (parRacks.marsh1First) rigelBasePoints.push(copyPoint(parRacks.marsh1First));
			if (parRacks.botFirst) rigelBasePoints.push(copyPoint(parRacks.botFirst));
			if (parRacks.marshFirst) {
				rigelBasePoints.push(copyPoint(parRacks.marshFirst));
				if (params.model == "лт" && params.rackBottom !== "сверху с крышкой" && params.calcType !== 'bolz') rigelBasePoints[rigelBasePoints.length - 1].y += turnRacksParams.rackLenAdd - turnRacksParams.shiftYforShiftX;
			}

			if (parRacks.marshLast) {
				rigelBasePoints.push(copyPoint(parRacks.marshLast));
				//if (params.model == "ко" && par.lastMarsh && params.platformTop == "нет") {
				//	rigelBasePoints[rigelBasePoints.length - 1].y += calcLastRackDeltaY();
				//	rigelBasePoints[rigelBasePoints.length - 1].ang = parRacks.angMarsh;
				//}
				if (par.lastMarsh && params.platformTop == "нет") {
					if (params.calcType !== 'bolz') rigelBasePoints[rigelBasePoints.length - 1].y += calcLastRackDeltaY();
					rigelBasePoints[rigelBasePoints.length - 1].ang = parRacks.angMarsh;
				}
				if (params.calcType == 'bolz') {
					if (marshPar.topTurn == 'забег' && params.stairModel == "П-образная с забегом" && params.marshDist !== 0) {
						rigelBasePoints[rigelBasePoints.length - 1].y -= marshPar.h_topWnd * 2;
						rigelBasePoints[rigelBasePoints.length - 1].ang = parRacks.angMarsh;
					}
				}
				if (params.model == "ко" && parRacks.marshLast.len != parRacks.marshFirst.len) {
					rigelBasePoints[rigelBasePoints.length - 1].y += parRacks.marshLast.len - parRacks.marshFirst.len;
				}
				//если на следующем марше поворотная стойка сохраняем сдвиг отверстия до края следующего марша
				if (parRacks.marshLast.noDraw && parRacks.marshLast.dxToMarshNext) {
					rigelBasePoints[rigelBasePoints.length - 1].dxToMarshNext = parRacks.marshLast.dxToMarshNext;
					rigelBasePoints[rigelBasePoints.length - 1].ang = parRacks.angMarsh;
				}
			}
			if (parRacks.topLast) rigelBasePoints.push(copyPoint(parRacks.topLast));
			if (parRacks.marsh2Last) rigelBasePoints.push(copyPoint(parRacks.marsh2Last));

			if (params.calcType === 'vhod' && params.staircaseType == "Готовая" && par.key == 'rear') {
				rigelBasePoints[0].x -= 100;
				rigelBasePoints[rigelBasePoints.length - 1].x += 100;
			}
		}
		if (params.calcType === 'mono') {
			var rigelBasePoints = calcRigelPoints(par, parRacks);
		}

		var side = "out";
		if (railingSide === "right") side = "in";
		var rigelPar = {
			points: rigelBasePoints,
			botEnd: par.botEnd,
			dxfBasePoint: copyPoint(par.dxfBasePoint),
			sectText: par.text,
			topConnection: par.topConnection,
			racks: par.racks
		}

		if (params.model == "ко" && params.rackBottom !== "сверху с крышкой") rigelMooveY += turnRacksParams.rackLenAdd;

		for (var i = 0; i < rigelAmt; i++) {
			rigelPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, rigelDist * (i + 1) + rigelMooveY);
			var rigel = drawPolylineRigel(rigelPar).mesh;
			rigel.position.y = rigelDist * (i + 1) + rigelMooveY;
			rigel.position.z = rigelPosZ;
			section.add(rigel);
		}

	} //конец ригелей

	/* стекло на стойках */
	if (params.railingModel == "Стекло на стойках" || params.railingModel == "Экраны лазер") {

		var glassDist = rackProfile / 2 + 22;
		var glassHeight = 800;

		glassParams = {
			p1: 0,
			p2: 0,
			angle: parRacks.angMarsh,
			glassDist: glassDist,
			glassHeight: glassHeight,
			glassMaterial: params.materials.glass,
			glassHolderMaterial: params.materials.inox,
			dxfBasePoint: par.dxfBasePoint,
		}
		if (params.railingModel == "Экраны лазер") glassParams.glassMaterial = params.materials.metal;

		//номинальная длина стойки
		var nominalLen = rackLength;
		if (params.calcType === 'mono') nominalLen = 800;
		if (params.calcType == 'bolz') nominalLen = 870;//750;
		var pltDeltaY = 0;//Нужна для корректировки положения стоек на площадках

		for (var i = 0; i < racks.length - 1; i++) {
			//выравниваем стекло на площадке
			if (params.calcType !== 'mono') {
				if (par.topTurn == "площадка" && par.key == "out" && Math.abs(racks[i].y - racks[i + 1].y) < 0.01 &&i > 1) {
					// 20 зазор стекла от площадки
					if (racks[i].y - racks[i - 1].y > 0.01)
						pltDeltaY = -20 + par.rackProfile + params.flanThickness + params.treadThickness + glassDist;
				}
				//выравниваем стекло на площадке
				if (par.botTurn == "площадка" && par.key == "out" && racks[i].y - racks[i + 1].y < 0.01) {
					pltDeltaY = -20 + par.rackProfile + params.flanThickness + params.treadThickness + glassDist;
				}
			}
			glassParams.p1 = copyPoint(racks[i]);
			glassParams.p2 = copyPoint(racks[i + 1]);
			//если на следующем марше поворотная стойка сдвигаем стойку до края следующего марша
			if (parRacks.marshLast.noDraw && racks[i + 1].dxToMarshNext) {
				glassParams.p2.x += racks[i + 1].dxToMarshNext - rackProfile / 2;
				glassParams.isHandrailAngle = parRacks.angMarsh;
			}
			glassParams.p1.y += racks[i].len - nominalLen + 80 - pltDeltaY;
			glassParams.p2.y += racks[i + 1].len - nominalLen + 80 - pltDeltaY;
			if (Math.abs(racks[i].y - racks[i + 1].y) < 0.01) glassParams.p1.y = glassParams.p2.y;
			if (par.botTurn == "площадка" && par.key == "out" && i == 0) glassParams.p2.y = glassParams.p1.y;

			glassParams.glassHeight = rackLength - 170;
			//уменьшаем высоту стекла чтобы оно не касалось ступеней
			if (params.rackBottom == "сверху с крышкой" && (glassParams.p1.y !== glassParams.p2.y)) {
				var dy = par.h - (par.b / 2 - (par.a - par.b) - glassDist) * Math.tan(parRacks.angMarsh);
				if(params.calcType == 'bolz') dy = -50;
				glassParams.glassHeight = rackLength - dy - 100;
				glassParams.p1.y += dy - 70;
				glassParams.p2.y += dy - 70;
			}

			if (params.calcType === 'mono' || params.calcType === 'bolz') {		
				glassParams.glassHeight = 700;
			}
			

			var glassParams = drawGlassNewell(glassParams);
			var glass = glassParams.mesh;

			glass.position.z = railingPositionZ + 16;
			glass.castShadow = true;
			section.add(glass);

			//сохраняем данные для спецификации
			staircasePartsParams.glassAmt += 1;
		}
	} //конец стекол на стойках

	/* Поручни */

	if (params.handrail != "нет") {
		if (params.stairModel == "Прямая с промежуточной площадкой") par.topConnection = false;

		var handrailPoints = calcHandrailPoints(par, parRacks);
		
		// Хотфикс ошибки с ограждением, падает все из за того что есть одинаковые точки, ищем и удаляем если такие есть
		if (params.stairModel == 'Прямая горка') {
			handrailPoints.sort(function (a, b) {
				return a.x - b.x;
			});

			var removePoints = [];
			for (var i = 0; i < handrailPoints.length - 1; i++) {
				var point = handrailPoints[i];
				var nextPoint = handrailPoints[i + 1];
				
				if (point.x == nextPoint.x && point.y == nextPoint.y) removePoints.push(i + 1)
			}

			if (removePoints.length > 0) handrailPoints = handrailPoints.filter(function(val, i){return removePoints.indexOf(i) == -1});
		}

		var side = "out";
		if (par.railingSide === "right") side = "in";

		handrailParams = {
			points: handrailPoints,
			side: side,
			offset: 0,
			extraLengthStart: 0,
			extraLengthEnd: 0,
			connection: params.handrailConnectionType,
			dxfBasePoint: par.dxfBasePoint,
			fixType: "нет",
			topConnection: par.topConnection,
			sectText: par.text,
			marshId: par.marshId,
			key: par.key,
			topPoint: parRacks.marshLast
		}

		//удлиннение поручня последнего марша
		if (params.stairModel == "Прямая" || par.marshId == 3) {
			handrailParams.extraLengthEnd += params.topHandrailExtraLength;
		}
		if (params.calcType === 'vhod' && params.staircaseType == "Готовая" && par.key == 'rear') {
			handrailParams.extraLengthStart += 90;
			handrailParams.extraLengthEnd += 90;
		}
		handrailParams = drawPolylineHandrail(handrailParams);

		var handrail = handrailParams.mesh;
		var posZ = -handrailParams.wallOffset + rackProfile / 2 * turnFactor;
		if (side == "in") posZ = handrailParams.wallOffset + rackProfile / 2 * turnFactor;

		handrail.position.z = posZ;
		handrails.add(handrail);
	} //конец поручней


	//сохраняем данные для спецификации
	var handrailPoints = calcHandrailPoints(par, parRacks);
	if (typeof railingParams != 'undefined') {
		if (!railingParams.sections) {
			railingParams.sections = {
				types: [],
				sumLen: 0,
			}
		}

		for (var i = 1; i < handrailPoints.length; i++) {
			var sectLen = distance(handrailPoints[i - 1], handrailPoints[i]);
			railingParams.sections.types.push(sectLen);
			railingParams.sections.sumLen += sectLen / 1000;
		}
	}

	if (params.model == 'лт' && params.calcType !== 'bolz') {
		section.position.x = -5;
	}

	par.isRearPRailing = null; // Очищаем, вызывает ошибки в других маршах

	var result = {
		mesh: section,
		handrails: handrails,
	}
	return result;

} //end of drawRailingSectionNewel


function drawPolylineHandrail(par) {
	var marshPar = getMarshParams(par.marshId);

	var dxfBasePoint = par.dxfBasePoint;
	var side = par.side;

	//адаптация
	if (side == "left") side = "out";
	if (side == "right") side = "in";

	par.mesh = new THREE.Object3D();

	if (!par.points) return par;

	var points = par.points;
	var offset = par.offset;

	//сортируем массив points в порядке возрастания координаты x
	par.points.sort(function (a, b) {
		return a.x - b.x;
	});

	//удаляем ошибочные точки чтобы поручень отрисовывался в любом случае
	$.each(par.points, function (i) {
		if (!isFinite(this.x) || !isFinite(this.y)) {
			par.points.splice(i, 1);
		}
	})
	//костыль чтобы поручень отрисовывался если не осталось точек
	if (points.length < 2) {
		points = [];
		var p1 = { x: -params.M / 2, y: 0 }
		var p2 = { x: params.M / 2, y: 0 }
		points.push(p1, p2)
	}

	var meterHandrailPar = {
		prof: params.handrailProf,
		sideSlots: params.handrailSlots,
		handrailType: params.handrail,
		metalPaint: params.metalPaint_railing,
		timberPaint: params.timberPaint_perila,
	}
	meterHandrailPar = calcHandrailMeterParams(meterHandrailPar);

	//для круглого поручня базовые точки находятся на оси поручня
	if (meterHandrailPar.handrailModel == "round") offset -= meterHandrailPar.profY / 2;

	//пересчет базовых точек чтобы сместить поручень на величину offset

	var points1 = []; //массив точек с отступом
	var points2 = []; //массив центров шарниров
	for (var i = 0; i < points.length; i++) {
		//первая точка
		if (i == 0) {
			//если первый участок вертикальный
			if (points[i].x == points[i + 1].x) {
				var point = newPoint_xy(points[i], offset, 0)
			}
			//если первый участок наклонный
			if (points[i].x != points[i + 1].x) {
				var handrailAngle = angle(points[i], points[i + 1])
				var point = newPoint_xy(points[i], 0, -offset / Math.cos(handrailAngle))
				//удлиннение поручня за начальную точку
				point = polar(point, handrailAngle, -par.extraLengthStart)
			}
			points1.push(point);
		}

		//промежуточные точки
		if (i > 0 && i < points.length - 1) {
			var line1 = parallel(points[i - 1], points[i], -offset);
			var line2 = parallel(points[i], points[i + 1], -offset);
			var point = itercection(line1.p1, line1.p2, line2.p1, line2.p2)
			points1.push(point);
		}

		//последняя точка
		if (i == points.length - 1) {

			//если последний участок вертикальный
			if (points[i - 1].x == points[i].x) {
				//var point = newPoint_xy(points[i], -offset, 0)
				var point = newPoint_xy(points[i], offset, 0);
			}
			//если последний участок наклонный
			if (points[i - 1].x != points[i].x && angle(points[i - 1], points[i]) != 0) {
				var handrailAngle = angle(points[i - 1], points[i])
				//var point = newPoint_xy(points[i], 0, -offset / Math.cos(handrailAngle))
				//var point = newPoint_xy(points[i], 0, -offset * Math.tan(handrailAngle))
				var line1 = parallel(points[i - 1], points[i], -offset);
				var point = itercection(line1.p1, line1.p2, points[i], polar(points[i], Math.PI / 2, 100))
				//var point = itercection(points[i - 1], polar(points[i - 1], handrailAngle, 100), points[i], polar(points[i], Math.PI / 2, 100))


				//удлиннение поручня за конечную точку
				point = polar(point, handrailAngle, par.extraLengthEnd)
				point = polar(point, handrailAngle, -10 / Math.cos(handrailAngle))
				if (params.calcType == "mono") point = polar(point, handrailAngle, -0.1)
				
				//горизонтальный участок в конце
				if (params.handrailEndHor == "да" && marshPar.lastMarsh) {
					point = newPoint_y(point, params.handrailEndHeight, handrailAngle);
					
					points1.push(point);
					var point = newPoint_xy(point, params.handrailEndLen, 0)
				}

			}
			
			//если последний участок горизонтальный
			if (points[i - 1].x != points[i].x && angle(points[i - 1], points[i]) == 0) {
				var point = newPoint_xy(points[i], 0, -offset);
			}
			
			
			points1.push(point);
		}
	}

	points = points1;

	var maxLen = 3000;
	if(!(meterHandrailPar.mat == 'timber' && meterHandrailPar.handrailType != 'ПВХ')) maxLen = 4000;

	var newPoints = [];
	for (var i = 0; i < points.length - 1; i++) {
		var point = points[i];
		var nextPoint = points[i + 1];
		var len = distance(point, nextPoint);
		newPoints.push(point);
		if (len > maxLen) {
			//var midPoint = midpoint(point, nextPoint);
			var midPoint = { x: Math.round((point.x + nextPoint.x) / 2 * 1000) / 1000, y: Math.round((point.y + nextPoint.y) / 2 * 1000) / 1000 };
			// var ang = angle(point, nextPoint);
			midPoint.isMidpoint = true;
			newPoints.push(midPoint);
		}
		if (i == points.length - 2) {
			newPoints.push(nextPoint);
		}
	}
	points = newPoints;
	//расчет длин и углов всех участков поручня
	var startOffset = 0; //смещение начала текущего куска поручня от базовой точки
	var startAngle = Math.PI / 2; //угол начала текущего куска поручня
	var previousLength = 0; //Длинна предыдущего куска, необходима для рассчета конечной точки предыдущего куска

	for (var i = 0; i < points.length - 1; i++) {
		if (points[i] && points[i + 1]) {
			//расчет угла поручня
			var p1 = copyPoint(points[i]); //первая точка текущего куска
			var p2 = copyPoint(points[i + 1]); //вторая точка текущего куска
			var p3 = copyPoint(points[i + 2]); //вторая точка следующего куска

			var handrailAngle = Math.atan((p2.y - p1.y) / (p2.x - p1.x));

			//расчет начального угла поручня для первого куска
			if (i == 0 && params.handrailEndType == "под углом" && p2.x != p1.x) {
				startAngle = Math.PI / 2 - handrailAngle;
			}
			//для остальных кусков стартовый угол рассчитан на предыдущей итерации цикла


			//расчет конечного угла и длины куска (кроме последнего)
			if (p3) var handrailAngle2 = Math.atan((p3.y - p2.y) / (p3.x - p2.x));

			if ((par.connection == "без зазора" || par.connection == "без зазора премиум") && p3) {
				var endAngle = Math.PI / 2 - (handrailAngle - handrailAngle2) / 2;
				//вертикальный участок
				if (p2.x - p1.x == 0) {
					var length = distance(p1, p2) + meterHandrailPar.profY * Math.tan(Math.PI / 2 - endAngle);
				}
				//горизонтальный или наклонный участок
				if (p2.x - p1.x != 0) {
					var length = distance(p1, p2) + meterHandrailPar.profY * Math.tan(Math.PI / 2 - endAngle) - meterHandrailPar.profY * Math.tan(Math.PI / 2 - startAngle);
				}
			}

			//прямые торцы
			if (!(par.connection == "без зазора" || par.connection == "без зазора премиум")) {
				endAngle = Math.PI / 2;
				var length = distance(p1, p2) - meterHandrailPar.profY * Math.tan(Math.PI / 2 - startAngle);
			}

			//последний кусок
			if (i == points.length - 2) {
				endAngle = Math.PI / 2;
				if ((params.handrailEndType == "под углом" || par.isHandrailEndAng) && p2.x != p1.x) {
					endAngle = Math.PI / 2 - handrailAngle;
				}
				//var length = distance(p1, p2);
				var length = distance(p1, p2) + meterHandrailPar.profY * Math.tan(Math.PI / 2 - endAngle) - meterHandrailPar.profY * Math.tan(Math.PI / 2 - startAngle);
				if (params.startVertHandrail == "есть" && params.handrailFixType == "паз") {
					length -= meterHandrailPar.profY * Math.tan(Math.PI / 2 - startAngle)
				}
			}


			if (meterHandrailPar.handrailModel == "round") {
				length = distance(p1, p2);
				//укорачиваем поручень чтобы он не врезался в стойку верхнего марша
				var key = par.key;
				if (params.stairModel == "Прямая" || params.stairModel == "Прямая с промежуточной площадкой") {
					if (par.key == "in") key = "out";
					if (par.key == "out") key = "in";
				}

				//if (!marshPar.lastMarsh && key == "in") length -= meterHandrailPar.profY * Math.tan(handrailAngle)
			}

			//расчет позиции шарниров
			if (i < points.length - 2 && par.connection == "шарнир") {
				var axis1 = parallel(p1, p2, meterHandrailPar.profY / 2);
				var axis2 = parallel(p2, p3, meterHandrailPar.profY / 2);
				var spherePos = itercection(axis1.p1, axis1.p2, axis2.p1, axis2.p2)
			}

			//корректировка длины и позиции в зависимости от типа стыковки кусков
			var basePoint = copyPoint(p1);

			if (par.connection == "без зазора" || par.connection == "без зазора премиум") endOffset = 0;

			if (par.connection == "шарнир") {
				endOffset = 26;
				//если есть шарнир
				if (i <= points.length - 2) {
					length -= endOffset * 2;
					basePoint = polar(basePoint, handrailAngle, endOffset)
				}
			}
			if (par.connection == "прямые") {
				length -= startOffset; //вычитаем отступ, рассчитанный на предыдущей итерации
				basePoint = polar(basePoint, handrailAngle, startOffset)
				endOffset = 0;
				if (p3 && handrailAngle < handrailAngle2) endOffset = meterHandrailPar.profY * Math.tan((handrailAngle2 - handrailAngle) / 2);
				//круглый поручень базируется по оси, поэтому нужны зазоры и при загибе вниз
				if (meterHandrailPar.handrailModel == "round" && p3 && handrailAngle > handrailAngle2)
					endOffset = meterHandrailPar.profY * Math.tan((handrailAngle - handrailAngle2) / 2);
				length -= endOffset;
			}
			

			var key = getSide().in == par.side ? 'in' : 'out';
			
			if (par.side == 'in' || par.side == 'out') key = par.side;
			if (turnFactor == -1 && (par.side == 'in' || par.side == 'out')) key = par.side == 'in' ? 'out' : 'in';
			//Блок отвечает за отрисовку стыка без зазора стандарт
			if (params.handrailConnectionType == "без зазора" && par.points.length > 2) {
				var handrailOffset = 100; //Отступ от места стыка(нижний)

				if (i > 0) {

					var angle1 = angle(basePoint, points[i - 1])
					var angle2 = handrailAngle;

					var unitBasePoint = basePoint;

					var connectionUnitPar = {
						offset: handrailOffset,
						center: unitBasePoint,
						angle1: angle1,
						angle2: angle2,
						dxfBasePoint: par.dxfBasePoint,
						drawing: {group:'handrails', elemType:'connectionUnit', marshId: par.marshId, pos: polar(basePoint, angle1, -handrailOffset), ang: angle1, key: key, profHeight: meterHandrailPar.profY}
					};
					connectionUnitPar.drawing.baseAngle = angle(points[0], points[points.length - 1]) / Math.PI * 180;
					
					var p1 = polar(basePoint, angle1, -100);
					var p2 = polar(basePoint, angle2, 100);
					var anglePos = {center: basePoint, p1: p1, p2: p2};

					if (angle2 > angle1) {
						var p1 = polar(p1, angle1 + Math.PI / 2, meterHandrailPar.profY);
						var p2 = polar(p2, angle2 + Math.PI / 2, meterHandrailPar.profY);
						var center = itercection(p1, polar(p1, angle1, 100), p2, polar(p2, angle2, -100));
						var anglePos = {center: center, p1: p1, p2: p2};
					}
					connectionUnitPar.drawing.anglePos = anglePos;

					var connectionUnit = drawConnectionUnit(connectionUnitPar);
					connectionUnit.position.z = 50 - meterHandrailPar.profZ / 2;
					if (key == 'in') connectionUnit.position.z = -50 - meterHandrailPar.profZ / 2;
					
					if (turnFactor == -1 && key == 'in') connectionUnit.position.z = 50 - meterHandrailPar.profZ / 2;
					if (turnFactor == -1 && key == 'out') connectionUnit.position.z = -50 - meterHandrailPar.profZ / 2;
					

					par.mesh.add(connectionUnit);

					var plugDiam = 10;

					var plug = drawTimberPlug(plugDiam);
	
					var plugPosition = polar(basePoint, handrailAngle, 100);
					plugPosition = polar(plugPosition, handrailAngle + Math.PI / 2, meterHandrailPar.profY / 2);
					plugPosition = polar(plugPosition, handrailAngle, -plugDiam - 10);
	
					plug.position.x = plugPosition.x;
					plug.position.y = plugPosition.y;

					plug.position.z = 50 - meterHandrailPar.profZ / 2 - 1;
					if (key == 'in') plug.position.z = meterHandrailPar.profZ / 2 - 50 + 1;

					if (turnFactor == -1 && key == 'in') plug.position.z = 50 - meterHandrailPar.profZ / 2 - 1;
					if (turnFactor == -1 && key == 'out') plug.position.z = meterHandrailPar.profZ / 2 - 50 + 1;

					plug.rotation.x = Math.PI / 2;
	
					if(!testingMode) par.mesh.add(plug);
				}
				if (i == 0){
					length -= handrailOffset + meterHandrailPar.profY * Math.tan(Math.PI / 2 - endAngle);	
				} else if (i == points.length - 2) {
					length -= handrailOffset;
					basePoint = polar(basePoint, handrailAngle, handrailOffset);
				}else{
					length -= handrailOffset;
					length -= handrailOffset + meterHandrailPar.profY * Math.tan(Math.PI / 2 - endAngle);
					basePoint = polar(basePoint, handrailAngle, handrailOffset);
				}

				startAngle = Math.PI / 2;
				endAngle = Math.PI / 2;
			}

			var angle1 = handrailAngle;
			if(i > 0) angle1 = angle(basePoint, points[i - 1])
			var angle2 = handrailAngle;

			if (params.handrailConnectionType == 'прямые' && i > 0 && angle1.toFixed(4) != angle2.toFixed(4)) {
				var handrailOffset = 20;

				var unitBasePoint = basePoint;
				if ((angle2 - angle1) > 0) {
					unitBasePoint = polar(unitBasePoint, handrailAngle, -startOffset);
				}
				unitBasePoint = polar(unitBasePoint, handrailAngle + Math.PI / 2, - 0.05); // Зазор для того чтобы избежать пересечений

				var handrailConnectionFlanPar = {
					offset: handrailOffset,
					center: unitBasePoint,
					angle1: angle1,
					angle2: angle2,
					dxfBasePoint: par.dxfBasePoint,
				};

				var connectionFlan = drawHandrailConnectionFlan(handrailConnectionFlanPar);

				connectionFlan.position.z = 50 - meterHandrailPar.profZ / 2;
				if (key == 'in') connectionFlan.position.z = -50 - meterHandrailPar.profZ / 2;
				
				if (turnFactor == -1 && key == 'in') connectionFlan.position.z = 50 - meterHandrailPar.profZ / 2;
				if (turnFactor == -1 && key == 'out') connectionFlan.position.z = -50 - meterHandrailPar.profZ / 2;

				if (params.stairModel == 'Прямая' && params.calcType == 'vhod') {
					//connectionFlan.position.z = -connectionFlan.position.z -meterHandrailPar.profZ;
				}

				if(!testingMode) par.mesh.add(connectionFlan);
			}

			if ((params.handrailConnectionType == "без зазора премиум" || params.handrailConnectionType == "без зазора") && i < points.length - 2 && meterHandrailPar.mat == 'timber') {

				var plugDiam = 10;

				var plug = drawTimberPlug(plugDiam);

				var plugPosition = polar(basePoint, handrailAngle, length);
				plugPosition = polar(plugPosition, handrailAngle + Math.PI / 2, meterHandrailPar.profY / 2);
				plugPosition = polar(plugPosition, handrailAngle, -plugDiam - 10);

				plug.position.x = plugPosition.x;
				plug.position.y = plugPosition.y;

				plug.position.z = 50 - meterHandrailPar.profZ / 2 - 1;
				if (key == 'in') plug.position.z = meterHandrailPar.profZ / 2 - 50 + 1;

				

				if (turnFactor == -1 && key == 'in') plug.position.z = 50 - meterHandrailPar.profZ / 2 - 1;
				if (turnFactor == -1 && key == 'out') plug.position.z = meterHandrailPar.profZ / 2 - 50 + 1;
				if (params.stairModel == "Прямая") {
					plug.position.z = 50 - meterHandrailPar.profZ / 2 - 1;
					if (key == 'out') plug.position.z = meterHandrailPar.profZ / 2 - 50 + 1;



					if (turnFactor == -1 && key == 'out') plug.position.z = 50 - meterHandrailPar.profZ / 2 - 1;
					if (turnFactor == -1 && key == 'in') plug.position.z = meterHandrailPar.profZ / 2 - 50 + 1;
				}

				plug.rotation.x = Math.PI / 2;

				if(!testingMode) par.mesh.add(plug);
			}

			//построение поручня
			var handrailParams = {
				model: params.handrail,
				length: length - 0.01, // костыль чтобы не было пересечений
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: par.dxfBasePoint,
				startAngle: startAngle,
				endAngle: endAngle,
				fixType: par.fixType,
				side: side,
				poleAngle: handrailAngle,
				sectText: par.sectText,
				marshId: par.marshId,
				drawing: {group:'handrails', marshId: par.marshId, pos: basePoint, ang: handrailAngle, key: key, profHeight: meterHandrailPar.profY}
			}
			handrailParams.drawing.baseAngle = angle(points[0], points[points.length - 1]) / Math.PI * 180;

			if (i == 0) handrailParams.startChamfer = "R6";
			if (i == points.length - 2) handrailParams.endChamfer = "R6";

			if (params.railingModel == "Самонесущее стекло") handrailParams.isGlassHandrail = true;
			if (params.railingModel == 'Самонесущее стекло' && params.handrailFixType == "паз") handrailParams.hasSilicone = true;
			if ((params.railingModel == "Кованые балясины" || params.railingModel == "Кресты") && params.handrailFixType == "паз") handrailParams.hasSilicone = true;
			if (par.connection !== "без зазора" && par.points.length > 0 && i > 0) {
				var previousAngle = angle(points[i-1], points[i]);
				var angP1 = polar(basePoint, previousAngle, -100);
				var angP2 = polar(basePoint, handrailAngle, 100);
				var anglePos = {center: copyPoint(basePoint), p1: angP1, p2: angP2};

				
				if (handrailAngle > previousAngle && par.connection !== 'прямые') {
					var angP1 = polar(angP1, previousAngle + Math.PI / 2, meterHandrailPar.profY);
					var angP2 = polar(angP2, handrailAngle + Math.PI / 2, meterHandrailPar.profY);
					var center = itercection(angP1, polar(angP1, previousAngle, 100), angP2, polar(angP2, handrailAngle, -100));
					var anglePos = {center: center, p1: angP1, p2: angP2};
				}
				if (handrailAngle > previousAngle && par.connection == 'прямые') {
					var center = polar(basePoint, handrailAngle + Math.PI / 2, meterHandrailPar.profY);
					var angP1 = polar(center, previousAngle, -100);
					var angP2 = polar(center, handrailAngle, 100);
					var anglePos = {center: center, p1: angP1, p2: angP2};
				}

				handrailParams.drawing.anglePos = anglePos;
			}

			handrailParams.dxfBasePoint = newPoint_xy(par.dxfBasePoint, basePoint.x, basePoint.y)

			if (i == (par.points.length - 2) && marshPar.lastMarsh && params.railingModel == "Самонесущее стекло" && params.handrailFixType == 'паз') {
				handrailParams.drawing.isGlassLast = true;
			}

			if (i == 0 || params.handrailConnectionType == 'прямые') handrailParams.startPlug = true;
			if (i == (points.length - 2) || params.handrailConnectionType == 'прямые') handrailParams.endPlug = true;

			handrailParams = drawHandrail_4(handrailParams);
			var handrail = handrailParams.mesh;
			handrail.position.x = basePoint.x;
			handrail.position.y = basePoint.y;

			par.wallOffset = handrailParams.wallOffset;
			par.mesh.add(handrail);


			//шарнир
			if (i < points.length - 2 && par.connection == "шарнир") {

				var jointParams = {
					rad: 25,
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, p2.x, p2.y)
				}
				var posZ = jointParams.rad * 2;
				if (side == "in") posZ = -jointParams.rad * 2;

				var sphere = drawHandrailJoint(jointParams);
				sphere.position.x = p2.x;
				sphere.position.y = p2.y;
				sphere.position.z = posZ;
				par.mesh.add(sphere);

				//Шарнир на конце если есть соединение со следующим участком
				if (par.topConnection && i == points.length - 3) {
					jointParams.dxfBasePoint = newPoint_xy(par.dxfBasePoint, p3.x, p3.y)
					var sphere = drawHandrailJoint(jointParams);
					sphere.position.x = p3.x;
					sphere.position.y = p3.y;
					sphere.position.z = posZ;
					par.mesh.add(sphere);

				}
			}

			//добавляем кронштейн поручня к поворотному столбу
			if (par.topPoint && i == 0) {
				//если нет последней стойки
				if (par.topPoint.noDraw) {
					var holderPar = {
						topPoint: polar(basePoint, handrailAngle, handrailParams.length),//точка верхнего края поручня
						holderAng: par.topPoint.holderAng,
						dxfBasePoint: handrailParams.dxfBasePoint,
					}
					var pt = newPoint_xy(par.topPoint, par.topPoint.dxToMarshNext - 40 - 0.01, 0); //40 - ширина стойки
					holderPar.topPoint = itercection(basePoint, polar(basePoint, handrailAngle, 100), pt, polar(pt, Math.PI / 2, 100))
					if (meterHandrailPar.handrailModel == "round")
						holderPar.topPoint.y -= meterHandrailPar.profY / 2 / Math.cos(handrailAngle);

					holderPar.dxfBasePoint = newPoint_xy(handrailParams.dxfBasePoint, -basePoint.x, -basePoint.y);

					var holder = drawHandrailHolderTurnRack(holderPar).mesh;
					holder.position.z += -30 * turnFactor;
					if (params.calcType === 'mono' && turnFactor == 1) holder.position.z -= 100;
					par.mesh.add(holder);
				}
			}

			//сохраняем начальный параметры для следующего участка
			startAngle = -endAngle;
			startOffset = endOffset;
			previousLength = length;
		}

	}

	par.meterHandrailPar = meterHandrailPar;

	return par;
} //end of drawPolylineHandrail


/**
 * Отрисовывает фланец на стыке поручня
 * @param {object} par 
 */
function drawHandrailConnectionFlan(par){
	var meterHandrailPar = {
		prof: params.handrailProf,
		sideSlots: params.handrailSlots,
		handrailType: params.handrail,
		metalPaint: params.metalPaint_railing,
		timberPaint: params.timberPaint_perila,
	}
	var handrailPar = calcHandrailMeterParams(meterHandrailPar);
	var profileY = 2;
	var profileZ = handrailPar.profZ;

	par.profileY = profileY;
	par.profileZ = handrailPar.profZ;

	// var handrailPar = calcHandrailMeterParams({handrailType: params.handrail});

	var material = params.materials.metal_railing;
	
	var connectionFlanShape = new THREE.Shape();

	var p1 = polar(par.center, par.angle1, -par.offset + 0.02);
	var p2 = polar(p1, (par.angle1 - Math.PI / 2), profileY);//polar(par.center, par.angle1, -par.offset);


	var p5 = polar(par.center, par.angle2, par.offset - 0.02);
	var p4 = polar(p5, par.angle2 + Math.PI / 2, -profileY);

	var p3 = itercection(p2, polar(p2, par.angle1, 100), p4, polar(p4, par.angle2, -100))

	addLine(connectionFlanShape, dxfPrimitivesArr, par.center, p1, par.dxfBasePoint);
	addLine(connectionFlanShape, dxfPrimitivesArr, p1, p2, par.dxfBasePoint);
	addLine(connectionFlanShape, dxfPrimitivesArr, p2, p3, par.dxfBasePoint);
	addLine(connectionFlanShape, dxfPrimitivesArr, p3, p4, par.dxfBasePoint);
	addLine(connectionFlanShape, dxfPrimitivesArr, p4, p5, par.dxfBasePoint);
	addLine(connectionFlanShape, dxfPrimitivesArr, p5, par.center, par.dxfBasePoint);

	//добавляем шейп в глобальный массив для последующего образмеривания
	if(typeof shapesList != "undefined" && par.drawing) {
		connectionFlanShape.drawing = par.drawing;
		shapesList.push(connectionFlanShape);
	}

	var extrudeOptions = {
		amount: profileZ,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(connectionFlanShape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var connectionFlan = new THREE.Mesh(geom, material);
	var mesh = new THREE.Object3D();
	mesh.add(connectionFlan);

	var screwPar = {
		id: "metalHandrailScrew",
		description: "Крепление соединителя поручней",
		group: "Ограждения"
	}
	
	var screwPosition1 = polar(p1, par.angle1, 7);

	var screw = drawScrew(screwPar).mesh;
	screw.position.x = screwPosition1.x;
	screw.position.y = screwPosition1.y;
	screw.position.z = 7;
	screw.rotation.z = par.angle1;
	mesh.add(screw);

	var screw = drawScrew(screwPar).mesh;
	screw.position.x = screwPosition1.x;
	screw.position.y = screwPosition1.y;
	screw.position.z = profileZ - 7;
	screw.rotation.z = par.angle1;
	mesh.add(screw);

	var screwPosition2 = polar(p5, par.angle2, -7);

	var screw = drawScrew(screwPar).mesh;
	screw.position.x = screwPosition2.x;
	screw.position.y = screwPosition2.y;
	screw.position.z = 7;
	screw.rotation.z = par.angle2;
	mesh.add(screw);

	var screw = drawScrew(screwPar).mesh;
	screw.position.x = screwPosition2.x;
	screw.position.y = screwPosition2.y;
	screw.position.z = profileZ - 7;
	screw.rotation.z = par.angle2;
	mesh.add(screw);

	var partName = "cncHandrailFlan";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
				specObj[partName] = {
						types: {},
						amt: 0,
						sumArea: 0,
						name: "Фланец стыковки поручней",
						metalPaint: true,
						timberPaint: false,
						division: "metal",
						workUnitName: "amt",
						group: "Ограждения",
				}
				if (params.calcType == 'vhod' && params.staircaseType == 'Готовая') specObj[partName].name = "Соед. пластина поручня 40х60";
		}
		var name = (180 - Math.abs(par.angle2 - par.angle1) * 180 / Math.PI).toFixed(1);
		if (params.calcType == 'vhod' && params.staircaseType == 'Готовая') name = 0;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}

	mesh.specId = partName + (name || "");

	return mesh;
}

/**
 * Отрисовывает премиум стык поручня
 * @param {object} par 
 */
function drawConnectionUnit(par){

	var meterHandrailPar = {
		prof: params.handrailProf,
		sideSlots: params.handrailSlots,
		handrailType: params.handrail,
		metalPaint: params.metalPaint_railing,
		timberPaint: params.timberPaint_perila,
	}
	var handrailPar = calcHandrailMeterParams(meterHandrailPar);
	var profileY = handrailPar.profY;
	var profileZ = handrailPar.profZ;

	par.profileY = handrailPar.profY;
	par.profileZ = handrailPar.profZ;

	// var handrailPar = calcHandrailMeterParams({handrailType: params.handrail});

	var material = params.materials.metal_railing;
	if (handrailPar.mat == "timber") material = params.materials.handrail;
	if (handrailPar.mat == "inox") material = params.materials.inox;
	
	var connectionUnitShape = new THREE.Shape();

	var p1 = polar(par.center, par.angle1, -par.offset + 0.02);
	var p2 = polar(p1, (par.angle1 - Math.PI / 2), -profileY);//polar(par.center, par.angle1, -par.offset);


	var p5 = polar(par.center, par.angle2, par.offset - 0.02);
	var p4 = polar(p5, par.angle2 + Math.PI / 2, profileY);

	var p3 = itercection(p2, polar(p2, par.angle1, 100), p4, polar(p4, par.angle2, -100))

	addLine(connectionUnitShape, dxfPrimitivesArr, par.center, p1, par.dxfBasePoint);
	addLine(connectionUnitShape, dxfPrimitivesArr, p1, p2, par.dxfBasePoint);
	addLine(connectionUnitShape, dxfPrimitivesArr, p2, p3, par.dxfBasePoint);
	addLine(connectionUnitShape, dxfPrimitivesArr, p3, p4, par.dxfBasePoint);
	addLine(connectionUnitShape, dxfPrimitivesArr, p4, p5, par.dxfBasePoint);
	addLine(connectionUnitShape, dxfPrimitivesArr, p5, par.center, par.dxfBasePoint);

	//добавляем шейп в глобальный массив для последующего образмеривания
	if(typeof shapesList != "undefined" && par.drawing) {
		connectionUnitShape.drawing = par.drawing;
		shapesList.push(connectionUnitShape);
	}

	var extrudeOptions = {
		amount: profileZ,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(connectionUnitShape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var connectionUnit = new THREE.Mesh(geom, material);

	var partName = "cncHandrailPart";
	if (typeof specObj != 'undefined') {
			if (!specObj[partName]) {
					specObj[partName] = {
							types: {},
							amt: 0,
							sumArea: 0,
							name: "Поворот поручня ЧПУ",
							metalPaint: false,
							timberPaint: true,
							division: "timber",
							workUnitName: "amt",
							group: "Ограждения",
					}
			}
			var name = (180 - Math.abs(par.angle2 - par.angle1) * 180 / Math.PI).toFixed(1);
			if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
			if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
			specObj[partName]["amt"] += 1;
	}
	connectionUnit.specId = partName + name;

	return connectionUnit;
}

function drawPolylineRigel(par) {

	var dxfBasePoint = par.dxfBasePoint;
	var side = par.side;

	par.mesh = new THREE.Object3D();

	if (!par.points) return par;

	var points = par.points;
	var offset = par.offset;

	//зазор между торцами ригелей при соединении шарниром
	var endOffset = 0;
	if (!(par.connection == "без зазора" || par.connection == "без зазора премиум")) endOffset = 7;

	//задаем параметры ригелей
	rigelParams = {
		type: "rect",
		poleProfileY: 20,
		poleProfileZ: 20,
		length: 0, //пересчитывается в цикле
		poleAngle: 0, //пересчитывается в цикле
		material: params.materials.metal_railing,
		dxfArr: dxfPrimitivesArr,
		partName: "rigels",
		dxfBasePoint: par.dxfBasePoint,
		angDxf: true,
		sectText: par.sectText,
	};

	if (params.rigelMaterial === "Ф12 нерж.") {
		rigelParams.type = "round";
		rigelParams.poleProfileY = 12;
		rigelParams.poleProfileZ = 12;
		rigelParams.material = params.materials.inox;
	}
	if (params.rigelMaterial === "Ф16 нерж.") {
		rigelParams.type = "round";
		rigelParams.poleProfileY = 16;
		rigelParams.poleProfileZ = 16;
		rigelParams.material = params.materials.inox;
	}

	//выпуск ригеля за ось стойки по X
	var extraLenEnd = 50;
	var extraLenMid = 20;
	if (rigelParams.type == "round") extraLenMid = 70; //отступ чтобы шарнир не попал на стойку
	if (testingMode) extraLenEnd = 20;

	//сортируем массив points в порядке возрастания координаты x
	par.points.sort(function (a, b) {
		return a.x - b.x;
	});

	var lastPoint = copyPoint(par.points[0])
	for (var i = 0; i < par.points.length - 1; i++) {
		var p1 = copyPoint(lastPoint);
		var p2 = copyPoint(par.points[i + 1]);
		if (par.points[i + 1].ang) {
			var pt = itercection(p1, polar(p1, par.points[i + 1].ang, 100), p2, polar(p2, Math.PI / 2, 100));
			par.points[i + 1].x = pt.x;
			par.points[i + 1].y = pt.y;
			var p2 = copyPoint(par.points[i + 1]);
		}
		var ang = angle(p1, p2);

		if (typeof (ang) == "undefined") ang = 0;

		if (rigelParams.type != "round") {
			//продлеваем ригель в обе стороны
			if (i == 0) p1 = polar(p1, ang, -extraLenEnd);
			else p1 = polar(p1, ang, -extraLenMid);
			if (i < par.points.length - 2) p2 = polar(p2, ang, extraLenMid);
			else p2 = polar(p2, ang, extraLenEnd);

			//пересчитываем базовые точки для нечетных участков чтобы избежать пересечения
			if (i % 2 == 1) {
				var deltaY = par.points[i].y - p1.y + rigelParams.poleProfileY / Math.cos(ang);
				deltaY += rigelParams.poleProfileY / Math.cos(angle(par.points[i - 1], par.points[i]));
				p1.y += deltaY;
				p2.y += deltaY;
			}
			lastPoint = copyPoint(par.points[i + 1])
		}
		if (rigelParams.type == "round") {

			if (i == 0) p1 = polar(p1, ang, -extraLenEnd);
			//переносим конечную точку так, чтобы шарнир не попал на стойку
			if (i < par.points.length - 2) {
				p2 = polar(p2, ang, -extraLenMid);
				p2.y = par.points[i + 1].y; //если следующий участок горизонтальный, он должен таким и остаться
			}
			else p2 = polar(p2, ang, extraLenEnd);

			lastPoint = copyPoint(p2);

			var radJoint = 6 + 0.2;
			var angBot = angle(p1, p2);
			var pcJoint = polar(p2, angBot + Math.PI / 2, rigelParams.poleProfileY / 2);
			pcJoint = polar(pcJoint, angBot, -radJoint);

			if (par.points[i + 2]) {
				var p3 = copyPoint(par.points[i + 2]);
				var angTop = angle(p2, p3);
				var pt1 = polar(pcJoint, angTop, radJoint);
				var pt2 = itercection(p2, polar(p2, angTop + Math.PI / 2, 100), pcJoint, polar(pcJoint, angTop, 100));
				var lengthOff = distance(pt1, pt2);
				if (pt2.x > pt1.x) lengthOff *= -1;

				lastPoint = polar(p2, angTop, lengthOff);
			}
		}

		rigelParams.length = distance(p1, p2) - 10; //10 - размер шарнира
		if (rigelParams.type == "round") rigelParams.length = distance(p1, p2) - radJoint * 2;
		rigelParams.poleAngle = angle(p1, p2);
		rigelParams.dxfBasePoint = newPoint_xy(par.dxfBasePoint, p1.x, p1.y);

		//если на следующем марше поворотная стойка, удлиняем ригели до неё
		if (par.points[i + 1].dxToMarshNext) {
			p2 = newPoint_xy(par.points[i + 1], par.points[i + 1].dxToMarshNext, 0);
			rigelParams.length = (p2.x - p1.x) / Math.cos(rigelParams.poleAngle);
		}

		if (i ==0 || params.rigelMaterial == "20х20 черн.") rigelParams.rigelStartPlug = true;
		if (i == (points.length - 2) || params.rigelMaterial == "20х20 черн.") rigelParams.rigelEndPlug = true;

		var rigel = drawPole3D_4(rigelParams).mesh;
		rigel.position.x = p1.x;
		rigel.position.y = p1.y;
		par.mesh.add(rigel);

		//Саморезы(Для ригелей 20x20 рисуем внутри цикла тк ищем точки для каждого ригеля)
		if (params.rigelMaterial == "20х20 черн." && par.racks) {
			var rigelRacks = par.racks.filter(function(rack){
				return rack.x >= p1.x && rack.x <= p2.x;
			});

			for (var j = 0; j < rigelRacks.length; j++) {
				var rack = rigelRacks[j];
				var screwPar = {
					id: "rigelScrew",
					description: "Крепление ригелей",
					group: "Ограждения"
				}
				var pos = itercection(p1, polar(p1, ang, 100), { x: rack.x, y: 0 }, newPoint_xy({ x: rack.x, y: 0 }, 0, 100));
				//если на следующем марше поворотная стойка, удлиняем ригели до неё
				if (rack.dxToMarshNext) {
					var pos = itercection(p1, polar(p1, ang, 100), { x: rack.x + rack.dxToMarshNext - 40 / 2, y: 0 }, newPoint_xy({ x: rack.x + rack.dxToMarshNext - 40 / 2, y: 0 }, 0, 100)); // 40 - профиль стойки
					//pos = polar(pos, ang, rack.dxToMarshNext);
				}
				var screw = drawScrew(screwPar).mesh;
				screw.rotation.x = Math.PI / 2;
				screw.position.x = pos.x;
				screw.position.y = pos.y;
				screw.position.z = 10;
				par.mesh.add(screw);
			}

		}

		//шарниры ригелей
		if (rigelParams.type == "round") {
			//if (par.points[i + 2] || (par.topConnection && i == points.length - 2)) {
			if (par.points[i + 2]) {
				var jointParams = {
					rad: 6,
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, pcJoint.x, pcJoint.y),
					type: "rigelJoint",
				}

				var sphere = drawHandrailJoint(jointParams);
				sphere.position.x = pcJoint.x;
				sphere.position.y = pcJoint.y;
				sphere.position.z = jointParams.rad;
				par.mesh.add(sphere);
			}
		}
	}

	if (par.racks && params.rigelMaterial != "20х20 черн.") {
		for (var i = 0; i < par.racks.length; i++) {
			var rack = par.racks[i];
			var rigelBasePoint = par.points[0];
			par.points.forEach(function(point, i){
				if (point.x < rack.x) {
					rigelBasePoint = point;
				}
			});

			if (par.points.indexOf(rigelBasePoint) < par.points.length - 1) {
				var ang = angle(rigelBasePoint, par.points[par.points.indexOf(rigelBasePoint) + 1]);
			}else{
				var ang = angle(rigelBasePoint, par.points[par.points.indexOf(rigelBasePoint) - 1]);
			}

			var screwPar = {
				id: "rigelScrew",
				description: "Крепление ригелей",
				group: "Ограждения"
			}
			var pos = itercection(rigelBasePoint, polar(rigelBasePoint, ang, 100), {x: rack.x, y: 0}, newPoint_xy({x: rack.x, y: 0}, 0, 100));

			//если на следующем марше поворотная стойка, сдвигаем позицию до неё
			if (rack.dxToMarshNext) pos = newPoint_x1(pos, rack.dxToMarshNext - 40 / 2, ang); // 40 - ширина стойки

			var screw = drawScrew(screwPar).mesh;
			screw.rotation.x = Math.PI / 2;
			screw.position.x = pos.x;
			screw.position.y = pos.y;// + rigelParams.poleProfileY / 2;
			screw.position.z = 10;
			par.mesh.add(screw);

			var rigelHolderId = "rigelHolder12";
			var holderSize = 12;
			if(params.rigelMaterial == "Ф16 нерж.") {
				rigelHolderId = "rigelHolder16";
				plugSize = 16;
			}

			var holderPar = {
				size: holderSize,
				id: rigelHolderId,
				description: "Кронштейн крепления ригелей",
				group: "Ограждения"
			}
			var holder = drawRigelHolder(holderPar);
			holder.rotation.x = Math.PI / 2;
			holder.position.x = pos.x;
			holder.position.y = pos.y + rigelParams.poleProfileY / 2;
			holder.position.z = 5;
			if(!testingMode) par.mesh.add(holder);
		}
	}

	// par.meterHandrailPar = meterHandrailPar;

	return par;
} //end of drawPolylineRigel
/* функция отрисовки секции с коваными балясинами */
function drawRailingSectionForge2(par) {
	var section = new THREE.Object3D();
	var forgedParts = new THREE.Object3D();
	var handrails = new THREE.Object3D();
	var marshPar = getMarshParams(par.marshId);
	var sectionLen = 0; //параметр для спецификации

	//параметры для рабочего чертежа
	section.drawing = {
		name: "Секция марш " + par.marshId,
		group: "forgedSections",
	}
	if (par.key == "in") section.drawing.name += " внутр."
	if (par.key == "out") section.drawing.name += " нар."

	//задаем константы
	var rackLength = 1000;
	var balLen = 850;
	//укорачиваем балясины чтобы не было пересечения нижней перемычки с кронштейном крелпения стойки
	if (params.model == "ко") {
		// Если это вызовет ошибки убрать комментарий, вызывает проблемы с высотой средней стойки 
		// if (params.rackBottom == "боковое" && marshPar.h / marshPar.b > 220 / 200) balLen = 800;
	}
	var botPoleOffset = rackLength - balLen;

	par.rackLength = rackLength;
	var rackProfile = 40;
	var maxHolderDist = 1200;
	if (params.handrail == "ПВХ") maxHolderDist = 800;
	var handrailSlotDepth = 15;

	var crossProfParams = getProfParams(params.crossProfile);
	var crossProfileX = crossProfParams.sizeA;
	var crossProfileY = crossProfParams.sizeB;
	var botPoleProfileY = 20;

	//рассчитываем необходимые параметры и добавляем в объект par
	setRailingParams(par) //функция в файле calcRailingParams.js

	if (params.calcType == 'metal' || params.calcType === 'vhod' || params.calcType === 'veranda') {
		//выделяем из массива racks первые и последние стойки поворотов и марша
		//адаптация к единой функции drawMarshRailing
		if (par.stringerParams) par.racks = par.stringerParams[par.marshId].elmIns[par.key].racks;
		//объединяем массивы первого и третьего марша
		if (params.stairModel == "Прямая с промежуточной площадкой" && par.marshId !== 'topPlt') {
			par.racks = [];
			// par.racks.push(...par.stringerParams[1].elmIns[par.key].racks);
			par.racks.push.apply(par.racks, par.stringerParams[1].elmIns[par.key].racks);
			//пересчитываем координаты стоек второго марша с учетом позиции марша
			for (var i = 0; i < par.stringerParams[3].elmIns[par.key].racks.length; i++) {
				var point = copyPoint(par.stringerParams[3].elmIns[par.key].racks[i]);
				point.x += par.stringerParams[3].treadsObj.unitsPos.marsh3.x;
				point.y += par.stringerParams[3].treadsObj.unitsPos.marsh3.y;
				par.racks.push(point)
			}
		}
		if (params.stairModel == 'Прямая горка') {
			par.racks = [];
			// par.racks.push(...par.stringerParams[1].elmIns[par.key].racks);
			par.racks.push.apply(par.racks, par.stringerParams[1].elmIns[par.key].racks);
			//пересчитываем координаты стоек второго марша с учетом позиции марша
			for (var i = 0; i < par.stringerParams[3].elmIns[par.key].racks.length; i++) {
				var point = copyPoint(par.stringerParams[3].elmIns[par.key].racks[i]);
				point.x = par.stringerParams[3].treadsObj.unitsPos.marsh3.x - point.x;
				point.y = par.stringerParams[3].treadsObj.unitsPos.marsh3.y + point.y;
				par.racks.push(point)
			}
		}

		//рассчитываем необходимые параметры и добавляем в объект par
		var parRacks = setRacksParams(par).parRacks;
	}

	if (params.calcType == 'mono') {
		calculateRacks(par);
		var parRacks = par.parRacks;

		if (parRacks.botFirst) parRacks.botLast = parRacks.marshFirst;
		if (parRacks.topLast) parRacks.topFirst = parRacks.marshLast;
	}

	if (params.calcType === 'bolz' && par.key === "in") {
		par.racks = [];
		calcRacksBolzs(par);
		var parRacks = setRacksParams(par).parRacks; //функция в metal/drawRailing.js
	}

	if (par.racks.length == 0) return section;

	//позиция секции
	var railingPositionZ = 0;
	if (turnFactor == -1) railingPositionZ = -40;

	var handrailPoints = [];

	var polePar = {
		type: "pole",
		poleProfileY: 20,
		poleProfileZ: 40,
		dxfBasePoint: par.dxfBasePoint,
		len: 1000,
		poleAngle: Math.PI / 6,
		vertEnds: true,
		material: params.materials.metal_railing,
		dxfArr: dxfPrimitivesArr,
		marshId: par.marshId,
		key: par.key,
		side: par.railingSide,
		sectText: par.text,
	}

	var rackPar = {
		type: "rack",
		poleProfileY: rackProfile,
		poleProfileZ: rackProfile,
		dxfBasePoint: par.dxfBasePoint,
		len: rackLength,
		angTop: Math.PI / 6,
		railingSide: par.railingSide,
		material: params.materials.metal_railing,
		dxfArr: dxfPrimitivesArr,
		marshId: par.marshId,
		key: par.key,
		side: par.railingSide,
		sectText: par.text,
	}

	var shortRackPar = {
		type: "rack",
		poleProfileY: 40,
		poleProfileZ: 40,
		dxfBasePoint: par.dxfBasePoint,
		len: 150,
		angTop: Math.PI / 6,
		railingSide: par.railingSide,
		material: params.materials.metal_railing,
		dxfArr: dxfPrimitivesArr,
		marshId: par.marshId,
		key: par.key,
		side: par.railingSide,
		sectText: par.text,
	}
	if (params.calcType == 'mono') { //FIX AFTER TURN RACK
		rackPar.stepH = shortRackPar.stepH = par.h;
		rackPar.nextStepH = shortRackPar.nextStepH = par.nextH;
		rackPar.isBotFlan = shortRackPar.isBotFlan = par.isBotFlan;
	}

	var pos = {
		x: 0,
		y: 0
	}
	var topPoint0, topPoint1, topPoint2, topPoint3, topPoint4, topPoint5;

	//нижний поворот
	if (parRacks.botFirst) {
		//первая стойка
		rackPar.angTop = parRacks.angBot;
		pos.x = parRacks.botFirst.x;
		pos.y = parRacks.botFirst.y - 90;
		rackPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);
		if (params.calcType == 'mono') {
			rackPar.monoType = parRacks.botFirst.type;
		}
		rackPar.drawing = {
			marshId: par.marshId,
			poleId: 0,
			group: 'forged_railing',
			elemType: 'rack',
			pos: copyPoint(pos),
			len: rackPar.len,
			key: par.key
		};
		var rack = drawForgedFramePart2(rackPar).mesh;
		rack.position.x = pos.x;
		rack.position.y = pos.y;
		rack.position.z = railingPositionZ;
		section.add(rack)

		//базовая точка для поручня
		topPoint1 = newPoint_xy(pos, -20, rackPar.len2 + 20 / Math.cos(parRacks.angBot))

		//последняя стойка
		pos.x = parRacks.botLast.x;
		pos.y = parRacks.botLast.y - 90;
		rackPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);
		if (params.calcType == 'mono') {
			rackPar.monoType = parRacks.botLast.type;
		}
		rackPar.drawing = {
			marshId: par.marshId,
			poleId: 1,
			group: 'forged_railing',
			elemType: 'rack',
			pos: copyPoint(pos),
			len: rackPar.len,
			key: par.key
		};
		var rack = drawForgedFramePart2(rackPar).mesh;
		rack.position.x = pos.x;
		rack.position.y = pos.y;
		rack.position.z = railingPositionZ;
		section.add(rack)

		//базовая точка для поручня
		topPoint2 = newPoint_xy(pos, 20, rackPar.len + 20 / Math.cos(parRacks.angBot))


		//верхняя перемычка
		polePar.len = parRacks.botLen + rackPar.topCutLen;
		polePar.poleAngle = parRacks.angBot;
		pos.x = parRacks.botFirst.x - rackPar.poleProfileY / 2;
		pos.y = parRacks.botFirst.y - 90 + rackPar.len2;
		polePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);
		polePar.drawing = {
			marshId: par.marshId,
			poleId: 0,
			group: 'forged_railing',
			elemType: 'pole',
			place: 'top',
			pos: copyPoint(pos),
			key: par.key,
			len: polePar.len,
			ang: polePar.poleAngle
		};
		var pole = drawForgedFramePart2(polePar).mesh;
		pole.position.x = pos.x;
		pole.position.y = pos.y;
		pole.position.z = railingPositionZ;
		section.add(pole)
		var endCutLen = polePar.endCutLen;
		var topPolePos = copyPoint(pos);
		// if (marshPar.botTurn == 'забег') parRacks.botFirst.y += 70;

		//нижняя перемычка
		polePar.len = parRacks.botLen - rackPar.topCutLen;
		pos.x = parRacks.botFirst.x + rackPar.poleProfileY / 2;
		pos.y = parRacks.botFirst.y - 90 + botPoleOffset;
		polePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);
		polePar.drawing = {
			marshId: par.marshId,
			poleId: 0,
			group: 'forged_railing',
			elemType: 'pole',
			place: 'bot',
			pos: copyPoint(pos),
			key: par.key,
			len: polePar.len,
			ang: polePar.poleAngle
		};
		var pole = drawForgedFramePart2(polePar).mesh;
		pole.position.x = pos.x;
		pole.position.y = pos.y;
		pole.position.z = railingPositionZ;
		section.add(pole);
		var botPolePos = copyPoint(pos);
		var botPoleLen = polePar.len;

		// наполнение
		if (params.railingModel == 'Кресты') {
			var crossHeight = polar(topPolePos, parRacks.angBot, rackProfile / Math.cos(parRacks.angBot)).y - botPolePos.y - botPoleProfileY / Math.cos(parRacks.angBot);
			var crossFillParams = {
				sectLen: botPoleLen,
				ang: parRacks.angBot,
				height: crossHeight,
				dxfBasePoint: par.dxfBasePoint,
				dxfArr: dxfPrimitivesArr,
				material: params.materials.metal,
				profileX: crossProfileX,
				profileY: crossProfileY
			}

			var crossFillPos = {
				x: botPolePos.x,
				y: botPolePos.y + botPoleProfileY / Math.cos(parRacks.angBot)
			};

			crossFillParams.dxfBasePoint = newPoint_xy(par.dxfBasePoint, crossFillPos.x, crossFillPos.y);

			var crossFill = drawCrossFill(crossFillParams);
			crossFill.position.x = crossFillPos.x;
			crossFill.position.y = crossFillPos.y;
			crossFill.position.z = railingPositionZ;
			section.add(crossFill);
		}else{
			//балясины
			var balParams = {
				p1: copyPoint(parRacks.botFirst),
				p2: copyPoint(parRacks.botLast),
				ang: parRacks.angBot,
				balLen: balLen,
				dxfBasePoint: par.dxfBasePoint,
				material: params.materials.metal,
				drawing: {
					marshId: par.marshId,
					poleId: 0,
					key: par.key
				},
			}
			// if (marshPar.botTurn == 'забег') {
			// 	balParams.balLen -= 70;
			// 	balParams.p1.y -= 70;
			// 	balParams.p2.y -= 70;
			// }
			var balArr = drawForgedBanistersArr(balParams);
			balArr.position.z = railingPositionZ;
			forgedParts.add(balArr);
		}


		//кронштейны поручня
		if (params.handrail != "нет" && params.handrailFixType == "кронштейны") {
			var p1 = polar(topPoint1, parRacks.angBot, 100);
			var p2 = polar(topPoint2, parRacks.angBot, -100);
			var holderAmt = Math.ceil(distance(p1, p2) / maxHolderDist) + 1;
			var holdeDist = distance(p1, p2) / (holderAmt - 1);
			for (var i = 0; i < holderAmt; i++) {
				var pos = polar(p1, parRacks.angBot, holdeDist * i);
				var holderParams = {
					angTop: parRacks.angBot,
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, pos.x, pos.y),
					isForge: true,
				}
				var holder = drawHandrailHolder(holderParams).mesh;
				holder.position.x = pos.x;
				holder.position.y = pos.y;
				holder.position.z = 20 + railingPositionZ;
				section.add(holder)
			}
		}
	}

	//верхний участок
	if (parRacks.topLast) {

		rackPar.angTop = parRacks.angTop;
		//первая стойка
		pos.x = parRacks.topFirst.x;
		pos.y = parRacks.topFirst.y - 90;
		rackPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);
		if (params.calcType == 'mono') {
			rackPar.monoType = parRacks.topFirst.type;
		}
		rackPar.drawing = {
			marshId: par.marshId,
			poleId: 2,
			group: 'forged_railing',
			elemType: 'rack',
			pos: copyPoint(pos),
			len: rackPar.len,
			key: par.key
		};
		var rack = drawForgedFramePart2(rackPar).mesh;
		rack.position.x = pos.x;
		rack.position.y = pos.y;
		rack.position.z = railingPositionZ;
		section.add(rack)

		//базовая точка для поручня
		topPoint3 = newPoint_xy(pos, -20, rackPar.len2 + 20 / Math.cos(parRacks.angTop))


		//последняя стойка
		pos.x = parRacks.topLast.x;
		pos.y = parRacks.topLast.y - 90;
		rackPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);
		if (params.calcType == 'mono') {
			rackPar.monoType = parRacks.topLast.type;
		}
		rackPar.drawing = {
			marshId: par.marshId,
			poleId: 2,
			group: 'forged_railing',
			elemType: 'rack',
			pos: copyPoint(pos),
			len: rackPar.len,
			key: par.key
		};
		var rack = drawForgedFramePart2(rackPar).mesh;
		rack.position.x = pos.x;
		rack.position.y = pos.y;
		rack.position.z = railingPositionZ;
		section.add(rack)

		//базовая точка для поручня
		topPoint4 = newPoint_xy(pos, 20, rackPar.len + 20 / Math.cos(parRacks.angTop))


		//верхняя перемычка
		polePar.len = parRacks.topLen + rackPar.topCutLen;
		polePar.poleAngle = parRacks.angTop;
		pos.x = parRacks.topFirst.x - rackPar.poleProfileY / 2;
		pos.y = parRacks.topFirst.y - 90 + rackPar.len2;
		polePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);
		polePar.drawing = {
			marshId: par.marshId,
			poleId: 2,
			group: 'forged_railing',
			elemType: 'pole',
			place: 'top',
			pos: copyPoint(pos),
			key: par.key,
			ang: polePar.poleAngle
		};
		var pole = drawForgedFramePart2(polePar).mesh;
		pole.position.x = pos.x;
		pole.position.y = pos.y;
		pole.position.z = railingPositionZ;
		section.add(pole);
		var topPolePos = copyPoint(pos);

		// if (marshPar.topTurn == 'забег') parRacks.topFirst.y += 70;
		//нижняя перемычка
		polePar.len = parRacks.topLen - rackPar.topCutLen;
		pos.x = parRacks.topFirst.x + rackPar.poleProfileY / 2;
		pos.y = parRacks.topFirst.y - 90 + botPoleOffset
		polePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);
		polePar.drawing = {
			marshId: par.marshId,
			poleId: 2,
			group: 'forged_railing',
			elemType: 'pole',
			place: 'bot',
			pos: copyPoint(pos),
			key: par.key,
			ang: polePar.poleAngle
		};
		var pole = drawForgedFramePart2(polePar).mesh;
		pole.position.x = pos.x;
		pole.position.y = pos.y;
		pole.position.z = railingPositionZ;
		section.add(pole);
		var botPolePos = copyPoint(pos);
		var botPoleLen = polePar.len;

		if (params.railingModel == 'Кресты') {
			var crossHeight = polar(topPolePos, parRacks.angTop, rackProfile / Math.cos(parRacks.angTop)).y - botPolePos.y - botPoleProfileY / Math.cos(parRacks.angTop);
			var crossFillParams = {
				sectLen: botPoleLen,
				ang: parRacks.angTop,
				height: crossHeight,
				dxfBasePoint: par.dxfBasePoint,
				dxfArr: dxfPrimitivesArr,
				material: params.materials.metal,
				profileX: crossProfileX,
				profileY: crossProfileY
			}

			var crossFillPos = {
				x: botPolePos.x,
				y: botPolePos.y + botPoleProfileY / Math.cos(parRacks.angTop)
			};

			crossFillParams.dxfBasePoint = newPoint_xy(par.dxfBasePoint, crossFillPos.x, crossFillPos.y);

			var crossFill = drawCrossFill(crossFillParams);
			crossFill.position.x = crossFillPos.x;
			crossFill.position.y = crossFillPos.y;
			crossFill.position.z = railingPositionZ;
			section.add(crossFill);
		}else{
			//балясины
			var balParams = {
				p1: parRacks.topFirst,
				p2: parRacks.topLast,
				ang: parRacks.angTop,
				balLen: balLen,
				dxfBasePoint: par.dxfBasePoint,
				material: params.materials.metal,
				drawing: {
					marshId: par.marshId,
					poleId: 2,
					key: par.key
				},
			}
			// if (marshPar.topTurn == 'забег') {
			// 	balParams.balLen -= 70;
			// 	balParams.p1.y -= 70;
			// 	balParams.p2.y -= 70;
			// }
			var balArr = drawForgedBanistersArr(balParams);
			balArr.position.z = railingPositionZ;
			forgedParts.add(balArr);
		}


		//кронштейны поручня
		if (params.handrail != "нет" && params.handrailFixType == "кронштейны") {
			var p1 = polar(topPoint3, parRacks.angTop, 100);
			var p2 = polar(topPoint4, parRacks.angTop, -100);
			var holderAmt = Math.ceil(distance(p1, p2) / maxHolderDist) + 1;
			var holdeDist = distance(p1, p2) / (holderAmt - 1);
			for (var i = 0; i < holderAmt; i++) {
				var pos = polar(p1, parRacks.angTop, holdeDist * i);
				var holderParams = {
					angTop: parRacks.angTop,
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, pos.x, pos.y),
					isForge: true,
				}
				var holder = drawHandrailHolder(holderParams).mesh;
				holder.position.x = pos.x;
				holder.position.y = pos.y;
				holder.position.z = 20 + railingPositionZ;
				section.add(holder)
			}
		}

	}


	//марш
	if (parRacks.marshFirst && !parRacks.isNotMarsh) {
		//расчет угла марша

		//если стойки сверху, тогда сдвигаем вверх нижнюю перемычку, чтобы не было пересечения перемычки со ступенями
		var dyRackTop = 60 * Math.tan(parRacks.angMarsh);
		if (params.rackBottom == "сверху с крышкой") dyRackTop = 40 * Math.tan(parRacks.angMarsh);
		var turnRacksParams = setTurnRacksParams(par.marshId, par.key); //параметры поворотной стойки
		var rackAddLen = 0; //Увелечение стойки для поворота
		if (turnRacksParams.rackLenAdd) rackAddLen = turnRacksParams.rackLenAdd;
		//rackPar.len += rackAddLen;

		//если нет нижнего участка
		if (!topPoint2) {
			topPoint2 = {
				x: parRacks.marshFirst.x + 20,
				y: parRacks.marshFirst.y - 90 + rackPar.len + 20 / Math.cos(parRacks.angMarsh),
			}
		}


		//если нет верхнего участка
		if (!topPoint3) {
			var angMarsh = parRacks.angMarsh;
			if (parRacks.marshLast.dxToMarshNext) {
				parRacks.marshLast.x += parRacks.marshLast.dxToMarshNext - 20;
			}

			topPoint3 = {
				x: parRacks.marshLast.x + 20 - 0.01, //TURN RACK
				y: parRacks.marshLast.y - 90 + rackPar.len + 20 / Math.cos(angMarsh),
			}
			if (marshPar.lastMarsh) topPoint3.y += calcLastRackDeltaY();
			if (par.key == 'out') { //костыль чтобы компенсировать отличие parRacks.angMarsh от реального угла
				if (params.model == "ко") {
					topPoint3.y += 0.3;
					if (params.topAnglePosition == "вертикальная рамка") topPoint3.y += 0.7;
				}
				if (params.model == "лт") {
					topPoint3.y += 0.1;
				}
			}
		}

		parRacks.angMarsh = angle(topPoint2, topPoint3)
		parRacks.marshLen = distance(topPoint2, topPoint3)

		//делаем чтобы угол секции соответствовал углу марша
		if (par.key == 'in' && marshPar.botTurn !== "пол") {
			parRacks.angMarsh = marshPar.ang;
			var pt = itercection(topPoint3, polar(topPoint3, parRacks.angMarsh, 100), topPoint2, polar(topPoint2, Math.PI / 2, 100));
			parRacks.marshLen = distance(topPoint3, pt);
			parRacks.firstRackDeltaLength = pt.y - topPoint2.y; //изменение длины последней стойки марша из-за изменения угла секции
			if (par.key == 'in')parRacks.lastRackDeltaLength = pt.y - topPoint2.y; //изменение длины последней стойки марша из-за изменения угла секции
			topPoint2 = copyPoint(pt);
		}
		if (marshPar.botTurn == "пол") {
			parRacks.angMarsh = marshPar.ang;
			var pt = itercection(topPoint2, polar(topPoint2, parRacks.angMarsh, 100), topPoint3, polar(topPoint3, Math.PI / 2, 100));
			parRacks.marshLen = distance(topPoint2, pt);
			parRacks.lastRackDeltaLength = pt.y - topPoint3.y;
			topPoint3 = copyPoint(pt);
			if (topPoint4 && parRacks.angTop == 0) topPoint4.y = topPoint3.y;
		}

		rackPar.angTop = parRacks.angMarsh;

		//первая стойка
		if (!parRacks.botFirst) {
			pos.x = parRacks.marshFirst.x;
			pos.y = parRacks.marshFirst.y - 90;
			if (parRacks.firstRackDeltaLength) rackPar.len += parRacks.firstRackDeltaLength;
			rackPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);
			if (params.calcType == 'mono') {
				rackPar.monoType = parRacks.marshFirst.type;
				rackPar.isFirst = true;
			}
			rackPar.isTurnRack = parRacks.marshFirst.isTurnRack;
			rackPar.drawing = {
				isTurnRack: rackPar.isTurnRack,
				marshId: par.marshId,
				poleId: 1,
				group: 'forged_railing',
				elemType: 'rack',
				pos: copyPoint(pos),
				len: rackPar.len,
				key: par.key
			};

			if (!parRacks.marshFirst.turnRack) { //TURN RACK
				var rack = drawForgedFramePart2(rackPar).mesh;
				rack.position.x = pos.x;
				rack.position.y = pos.y;
				rack.position.z = railingPositionZ;
				if (rackPar.isTurnRack && turnFactor == -1 && testingMode) rack.position.z -= 0.01;
				section.add(rack)
			}
			if (parRacks.marshFirst.turnRack) { //TURN RACK
				rackPar.holes = [{
					offset: 20,
					angelText: 'сзади',
					diam: 6,
					holder: 'baniAngle'
				}];
				var holeHeightDifference = par.prevH - par.h + rackPar.holes[0].offset;
				rackPar.stepH = par.prevH;
				rackPar.nextStepH = par.h;
				var deltaY = 0;
				//Задаем отверстия
				if (par.botTurn == "забег") {
					rackPar.place = 'забег';
					rackPar.holes.push({
						offset: par.h + holeHeightDifference,
						angelText: 'сзади',
						diam: 6,
						holder: 'baniAngle'
					});
					rackPar.holes.push({
						offset: par.h * 2 + holeHeightDifference,
						angelText: 'сзади',
						diam: 6,
						holder: 'baniAngle'
					});
					rackPar.holes.push({
						offset: par.h * 3 + holeHeightDifference,
						angelText: 'слева',
						diam: 6,
						holder: 'baniAngle'
					});
					rackPar.holes.push({
						offset: par.h * 4 + holeHeightDifference,
						angelText: 'слева',
						diam: 6,
						holder: 'baniAngle'
					});
				}
				if (par.botTurn == "площадка") {
					rackPar.place = 'площадка';
					rackPar.holes.push({
						offset: par.h + holeHeightDifference,
						angelText: 'сзади',
						diam: 6,
						holder: 'baniAngle'
					});
					rackPar.holes.push({
						offset: par.prevH + par.h + holeHeightDifference,
						angelText: 'слева',
						diam: 6,
						holder: 'baniAngle'
					});
				}
				rackPar.monoType = 'turn';
				rackPar.drawing = {
					marshId: par.marshId,
					poleId: 1,
					group: 'forged_railing',
					elemType: 'rack',
					pos: copyPoint(pos),
					len: rackPar.len,
					key: par.key
				};
				var rack = drawForgedFramePart2(rackPar).mesh;
				rack.position.x = pos.x;
				rack.position.z = railingPositionZ;
				rack.position.y = pos.y + deltaY;
				section.add(rack);

			}
		}
		var rackLength2 = rackPar.len2;

		rackPar.isFirst = false;

		//последняя стойка

		if (!parRacks.topFirst) {
			/*
			var rackPar = {
				type: "rack",
				poleProfileY: rackProfile,
				poleProfileZ: rackProfile,
				dxfBasePoint: par.dxfBasePoint,
				len: rackLength,
				angTop: Math.PI / 6,
				railingSide: par.railingSide,
				material: params.materials.metal,
				dxfArr: dxfPrimitivesArr,
				marshId: par.marshId,
				side: par.railingSide,
				sectText: par.text,
				};
				*/
			pos.x = parRacks.marshLast.x;
			pos.y = parRacks.marshLast.y - 90;
			if (marshPar.lastMarsh) rackPar.len += calcLastRackDeltaY();
			if (parRacks.lastRackDeltaLength) rackPar.len -= parRacks.lastRackDeltaLength;
			rackPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);
			if (params.calcType == 'mono') {
				rackPar.monoType = parRacks.marshLast.type;
			}
			rackPar.isTurnRack = parRacks.marshLast.isTurnRack;
			rackPar.drawing = {
				marshId: par.marshId,
				poleId: 1,
				group: 'forged_railing',
				elemType: 'rack',
				pos: copyPoint(pos),
				len: rackPar.len,
				key: par.key
			};
			if (!parRacks.marshLast.noDraw) {
				var rack = drawForgedFramePart2(rackPar).mesh;
				rack.position.x = pos.x;
				rack.position.y = pos.y;
				rack.position.z = railingPositionZ;
				section.add(rack);
			}
		}

		//средние короткие стойки
		shortRackPar.angTop = parRacks.angMarsh;
		for (var i = 0; i < par.racks.length; i++) {
			if (par.racks[i].x > parRacks.marshFirst.x && par.racks[i].x < parRacks.marshLast.x) {
				pos.x = par.racks[i].x;
				pos.y = par.racks[i].y - 90;
				shortRackPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);

				//рассчитываем длину
				var deltaY = (pos.x - parRacks.marshFirst.x) * Math.tan(parRacks.angMarsh) - (pos.y + 90 - parRacks.marshFirst.y);

				shortRackPar.len = 150 + deltaY + dyRackTop + rackAddLen;
				// if (marshPar.h / marshPar.b > 220 / 200) shortRackPar.len += 50;
				if (params.calcType == 'mono') {
					shortRackPar.monoType = par.racks[i].type;
				}
				shortRackPar.drawing = {
					marshId: par.marshId,
					poleId: 1,
					group: 'forged_railing',
					elemType: 'rack',
					pos: copyPoint(pos),
					len: shortRackPar.len,
					key: par.key
				};
				var rack = drawForgedFramePart2(shortRackPar).mesh;
				rack.position.x = pos.x;
				rack.position.y = pos.y;
				rack.position.z = railingPositionZ;
				section.add(rack);
			}

		}

		var splitSection = false;
		var sectionLength = distance(par.racks[0], newPoint_xy(par.racks[par.racks.length - 1], 0, 1000));
		if (sectionLength > 3800) splitSection = true;
		if (params.stairModel == 'Прямая' || par.key == 'in') splitSection = false;


		//верхняя перемычка
		polePar.len = parRacks.marshLen;
		if (splitSection) {
			if (par.key == 'out') polePar.startFlan = true;
			if (par.topTurn != 'пол' || (par.marshLast && marshPar.hasTopPltRailing[par.key]))
				polePar.endFlan = true;
		}

		if (parRacks.marshLast.noDraw) polePar.endFlan = true;

		if ((params.calcType == 'vhod' || params.calcType === 'veranda') && par.marshId == 1) {
			polePar.startFlan = false;
		}

		polePar.place = 'top';
		if (parRacks.marshLast.noDraw) polePar.len -= rackPar.topCutLen; //TURN RACK
		if (!parRacks.botFirst) polePar.len += rackPar.topCutLen;

		polePar.poleAngle = parRacks.angMarsh;
		pos.x = parRacks.marshFirst.x - rackPar.poleProfileY / 2;
		pos.y = parRacks.marshFirst.y - 90 + rackLength2;
		if (parRacks.botFirst) {
			pos.x = parRacks.marshFirst.x + rackPar.poleProfileY / 2;
			pos.y = parRacks.marshFirst.y - 90 + rackLength + endCutLen - 20 / Math.cos(parRacks.angMarsh);
		}
		polePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);
		polePar.drawing = {
			marshId: par.marshId,
			poleId: 1,
			group: 'forged_railing',
			elemType: 'pole',
			place: 'top',
			pos: copyPoint(pos),
			key: par.key,
			ang: polePar.poleAngle
		};
		var pole = drawForgedFramePart2(polePar).mesh;
		pole.position.x = pos.x;
		pole.position.y = pos.y;
		pole.position.z = railingPositionZ;
		var topPolePos = copyPoint(pos);
		section.add(pole);

		//нижняя перемычка
		polePar.len = parRacks.marshLen;
		polePar.poleAngle = parRacks.angMarsh;
		if (!parRacks.topFirst) polePar.len -= rackPar.topCutLen;
		pos.x = parRacks.marshFirst.x + rackPar.poleProfileY / 2;
		pos.y = parRacks.marshFirst.y - 90 + botPoleOffset + dyRackTop + rackAddLen;
		polePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);
		if (splitSection) {
			if (par.key == 'out') polePar.startFlan = true;
			if (par.topTurn != 'пол' || (par.marshLast && marshPar.hasTopPltRailing[par.key]))
				polePar.endFlan = true;
		}
		if (parRacks.marshLast.noDraw) polePar.endFlan = true;

		polePar.place = 'bot';
		polePar.drawing = {
			marshId: par.marshId,
			group: 'forged_railing',
			poleId: 1,
			elemType: 'pole',
			place: 'bot',
			pos: copyPoint(pos),
			key: par.key,
			ang: polePar.poleAngle
		};
		var pole = drawForgedFramePart2(polePar).mesh;
		pole.position.x = pos.x;
		pole.position.y = pos.y;
		pole.position.z = railingPositionZ;
		section.add(pole);
		var botPolePos = copyPoint(pos);
		var botPoleLen = polePar.len;

		if (params.railingModel == 'Кресты') {
			var crossHeight = polar(topPolePos, parRacks.angMarsh, rackProfile / Math.cos(parRacks.angMarsh)).y - botPolePos.y - botPoleProfileY / Math.cos(parRacks.angMarsh);
			var crossFillParams = {
				sectLen: botPoleLen,
				ang: parRacks.angMarsh,
				height: crossHeight,
				dxfBasePoint: par.dxfBasePoint,
				dxfArr: dxfPrimitivesArr,
				material: params.materials.metal,
				profileX: crossProfileX,
				profileY: crossProfileY
			}

			var crossFillPos = {
				x: botPolePos.x,
				y: botPolePos.y + botPoleProfileY / Math.cos(parRacks.angMarsh)
			};

			crossFillParams.dxfBasePoint = newPoint_xy(par.dxfBasePoint, crossFillPos.x, crossFillPos.y);

			var crossFill = drawCrossFill(crossFillParams);
			crossFill.position.x = crossFillPos.x;
			crossFill.position.y = crossFillPos.y;
			crossFill.position.z = railingPositionZ;
			section.add(crossFill);
		}else{
			//балясины
			var balParams = {
				//p1: newPoint_xy(parRacks.marshFirst, 0, rackAddLen),
				//p2: newPoint_xy(parRacks.marshLast, 0, rackAddLen),
				p1: copyPoint(parRacks.marshFirst),
				p2: copyPoint(parRacks.marshLast),
				ang: parRacks.angMarsh,
				balLen: balLen - dyRackTop,
				dxfBasePoint: par.dxfBasePoint,
				material: params.materials.metal,
				drawing: {
					marshId: par.marshId,
					poleId: 1,
					key: par.key
				},
			}
			if (parRacks.firstRackDeltaLength) balParams.balLen += parRacks.firstRackDeltaLength - rackAddLen;
			var balArr = drawForgedBanistersArr(balParams);
			if (parRacks.firstRackDeltaLength) balArr.position.y += parRacks.firstRackDeltaLength;
			balArr.position.z = railingPositionZ;
			forgedParts.add(balArr);
		}

		//кронштейны поручня
		if (params.handrail != "нет" && params.handrailFixType == "кронштейны") {
			var p1 = polar(topPoint2, parRacks.angMarsh, 100);
			var p2 = polar(topPoint3, parRacks.angMarsh, -100);
			if (distance(topPoint2, topPoint3) < 250) {
				p1 = polar(topPoint2, parRacks.angMarsh, 10);
				p2 = polar(topPoint3, parRacks.angMarsh, -10);
			}
			var holderAmt = Math.ceil(distance(p1, p2) / maxHolderDist) + 1;
			var holdeDist = distance(p1, p2) / (holderAmt - 1);
			for (var i = 0; i < holderAmt; i++) {
				var pos = polar(p1, parRacks.angMarsh, holdeDist * i);
				var holderParams = {
					angTop: parRacks.angMarsh,
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, pos.x, pos.y),
					isForge: true,
				}
				var holder = drawHandrailHolder(holderParams).mesh;
				holder.position.x = pos.x;
				holder.position.y = pos.y;
				holder.position.z = 20 + railingPositionZ;
				section.add(holder)
			}
		}

	}

	//нижний марш прямой двухмаршевой
	if (parRacks.marsh1First) {
		rackPar.len = rackLength;
		//расчет угла марша
		if (!topPoint0) {
			topPoint0 = {
				x: parRacks.marsh1First.x + 20,
				y: parRacks.marsh1First.y - 90 + rackPar.len + 20 / Math.cos(parRacks.angMarsh1),
			}
		}

		parRacks.angMarsh1 = angle(topPoint0, topPoint1)
		parRacks.marshLen = distance(topPoint0, topPoint1)

		rackPar.angTop = parRacks.angMarsh1;

		//первая стойка
		pos.x = parRacks.marsh1First.x;
		pos.y = parRacks.marsh1First.y - 90;
		rackPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);
		rackPar.drawing = {
			marshId: par.marshId,
			poleId: 3,
			group: 'forged_railing',
			elemType: 'rack',
			pos: copyPoint(pos),
			len: rackPar.len,
			key: par.key
		};
		var rack = drawForgedFramePart2(rackPar).mesh;
		rack.position.x = pos.x;
		rack.position.y = pos.y;
		rack.position.z = railingPositionZ;
		section.add(rack)


		//средние короткие стойки
		shortRackPar.angTop = parRacks.angMarsh1;
		for (var i = 0; i < par.racks.length; i++) {
			if (par.racks[i].x > parRacks.marsh1First.x && par.racks[i].x < parRacks.botFirst.x) {
				pos.x = par.racks[i].x;
				pos.y = par.racks[i].y - 90;
				shortRackPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);

				//рассчитываем длину
				var deltaY = (pos.x - parRacks.marsh1First.x) * Math.tan(parRacks.angMarsh1) - (pos.y + 90 - parRacks.marsh1First.y);
				shortRackPar.len = 150 + deltaY;

				// shortRackPar.drawing = {marshId: par.marshId, group: 'forged_railing', elemType:'rack', pos: copyPoint(pos), len: rackPar.len, key: par.key};
				shortRackPar.drawing = {
					marshId: par.marshId,
					poleId: 3,
					group: 'forged_railing',
					elemType: 'rack',
					pos: copyPoint(pos),
					len: shortRackPar.len,
					key: par.key
				};

				var rack = drawForgedFramePart2(shortRackPar).mesh;
				rack.position.x = pos.x;
				rack.position.y = pos.y;
				rack.position.z = railingPositionZ;
				section.add(rack)
			}

		}

		//верхняя перемычка
		polePar.len = parRacks.marshLen;
		polePar.len += rackPar.topCutLen;

		polePar.poleAngle = parRacks.angMarsh1;
		pos.x = parRacks.marsh1First.x - rackPar.poleProfileY / 2;
		pos.y = parRacks.marsh1First.y - 90 + rackPar.len2;
		polePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);
		polePar.drawing = {
			marshId: par.marshId,
			poleId: 3,
			group: 'forged_railing',
			elemType: 'pole',
			place: 'top',
			pos: copyPoint(pos),
			key: par.key,
			ang: polePar.poleAngle
		};
		var pole = drawForgedFramePart2(polePar).mesh;
		pole.position.x = pos.x;
		pole.position.y = pos.y;
		pole.position.z = railingPositionZ;
		section.add(pole)
		var topPolePos = copyPoint(pos);

		//нижняя перемычка
		polePar.len = parRacks.marshLen;
		//if(!parRacks.topFirst) polePar.len -= rackPar.topCutLen;
		pos.x = parRacks.marsh1First.x + rackPar.poleProfileY / 2;
		pos.y = parRacks.marsh1First.y - 90 + botPoleOffset
		polePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);
		polePar.drawing = {
			marshId: par.marshId,
			poleId: 3,
			group: 'forged_railing',
			elemType: 'pole',
			place: 'bot',
			pos: copyPoint(pos),
			key: par.key,
			ang: polePar.poleAngle
		};
		var pole = drawForgedFramePart2(polePar).mesh;
		pole.position.x = pos.x;
		pole.position.y = pos.y;
		pole.position.z = railingPositionZ;
		section.add(pole);
		
		var botPolePos = copyPoint(pos);
		var botPoleLen = polePar.len;

		if (params.railingModel == 'Кресты') {
			var crossHeight = polar(topPolePos, parRacks.angMarsh1, rackProfile / Math.cos(parRacks.angMarsh1)).y - botPolePos.y - botPoleProfileY / Math.cos(parRacks.angMarsh1);
			var crossFillParams = {
				sectLen: botPoleLen,
				ang: parRacks.angMarsh1,
				height: crossHeight,
				dxfBasePoint: par.dxfBasePoint,
				dxfArr: dxfPrimitivesArr,
				material: params.materials.metal,
				profileX: crossProfileX,
				profileY: crossProfileY
			}

			var crossFillPos = {
				x: botPolePos.x,
				y: botPolePos.y + botPoleProfileY / Math.cos(parRacks.angMarsh1)
			};

			crossFillParams.dxfBasePoint = newPoint_xy(par.dxfBasePoint, crossFillPos.x, crossFillPos.y);

			var crossFill = drawCrossFill(crossFillParams);
			crossFill.position.x = crossFillPos.x;
			crossFill.position.y = crossFillPos.y;
			crossFill.position.z = railingPositionZ;
			section.add(crossFill);
		}else{
			//балясины
			var balParams = {
				p1: parRacks.marsh1First,
				p2: parRacks.botFirst,
				ang: parRacks.angMarsh1,
				balLen: balLen,
				dxfBasePoint: par.dxfBasePoint,
				material: params.materials.metal,
				drawing: {
					marshId: par.marshId,
					poleId: 3,
					key: par.key
				},
			}
			var balArr = drawForgedBanistersArr(balParams);
			balArr.position.z = railingPositionZ;
			forgedParts.add(balArr);
		}


		//кронштейны поручня
		if (params.handrail != "нет" && params.handrailFixType == "кронштейны") {
			var p1 = polar(topPoint0, parRacks.angMarsh1, 100);
			var p2 = polar(topPoint1, parRacks.angMarsh1, -100);
			var holderAmt = Math.ceil(distance(p1, p2) / maxHolderDist) + 1;
			var holdeDist = distance(p1, p2) / (holderAmt - 1);
			for (var i = 0; i < holderAmt; i++) {
				var pos = polar(p1, parRacks.angMarsh1, holdeDist * i);
				var holderParams = {
					angTop: parRacks.angMarsh1,
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, pos.x, pos.y),
					isForge: true,
				}
				var holder = drawHandrailHolder(holderParams).mesh;
				holder.position.x = pos.x;
				holder.position.y = pos.y;
				holder.position.z = 20 + railingPositionZ;
				section.add(holder)
			}
		}

	}

	//второй марш лестницы горкой
	if (parRacks.marsh2First) {

		topPoint5 = {
			x: parRacks.marsh2Last.x + 20,
			y: parRacks.marsh2Last.y - 90 + rackPar.len2 + 20 / Math.cos(parRacks.angMarsh2) + 0.5,
		}

		parRacks.angMarsh2 = angle(topPoint4, topPoint5)
		parRacks.marshLen = distance(topPoint4, topPoint5)

		rackPar.angTop = parRacks.angMarsh2;
		//последняя стойка
		pos.x = parRacks.marsh2Last.x;
		pos.y = parRacks.marsh2Last.y - 90;
		rackPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);
		rackPar.drawing = {
			marshId: par.marshId,
			poleId: 4,
			group: 'forged_railing',
			elemType: 'rack',
			pos: copyPoint(pos),
			len: rackPar.len,
			key: par.key
		};
		var rack = drawForgedFramePart2(rackPar).mesh;
		rack.position.x = pos.x;
		rack.position.y = pos.y;
		rack.position.z = railingPositionZ;
		section.add(rack)


		//средние короткие стойки
		shortRackPar.angTop = parRacks.angMarsh2;
		for (var i = 0; i < par.racks.length; i++) {
			if (par.racks[i].x > parRacks.marsh2First.x && par.racks[i].x < parRacks.marsh2Last.x) {
				pos.x = par.racks[i].x;
				pos.y = par.racks[i].y - 90;
				shortRackPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);
				shortRackPar.drawing = {
					marshId: par.marshId,
					poleId: 4,
					group: 'forged_railing',
					elemType: 'rack',
					pos: copyPoint(pos),
					len: shortRackPar.len,
					key: par.key
				};
				//рассчитываем длину
				var deltaY = (pos.x - parRacks.marsh2First.x) * Math.tan(parRacks.angMarsh2) - (pos.y + 90 - parRacks.marsh2First.y);
				shortRackPar.len = 150 + deltaY - rackProfile * Math.tan(parRacks.angMarsh2);
				var rack = drawForgedFramePart2(shortRackPar).mesh;
				rack.position.x = pos.x;
				rack.position.y = pos.y;
				rack.position.z = railingPositionZ;
				section.add(rack)
			}

		}

		//верхняя перемычка
		polePar.len = parRacks.marshLen;
		//polePar.len += rackPar.topCutLen;

		polePar.poleAngle = parRacks.angMarsh2;
		pos.x = parRacks.marsh2First.x + rackPar.poleProfileY / 2;
		pos.y = parRacks.marsh2First.y - 90 + rackPar.len2;

		pos = newPoint_xy(topPoint4, 0, -20 / Math.cos(parRacks.angMarsh2))
		polePar.drawing = {
			marshId: par.marshId,
			poleId: 4,
			group: 'forged_railing',
			elemType: 'pole',
			place: 'top',
			pos: copyPoint(pos),
			key: par.key,
			ang: polePar.poleAngle
		};
		polePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);
		var pole = drawForgedFramePart2(polePar).mesh;
		pole.position.x = pos.x;
		pole.position.y = pos.y;
		pole.position.z = railingPositionZ;
		section.add(pole);
		var topPolePos = copyPoint(pos);

		//нижняя перемычка
		polePar.len = parRacks.marshLen;
		polePar.len -= rackPar.topCutLen;
		pos.x = parRacks.marsh2First.x + rackPar.poleProfileY / 2;
		pos.y = parRacks.marsh2First.y - 90 + botPoleOffset
		polePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);
		polePar.drawing = {
			marshId: par.marshId,
			poleId: 4,
			group: 'forged_railing',
			elemType: 'pole',
			place: 'bot',
			pos: copyPoint(pos),
			key: par.key,
			ang: polePar.poleAngle
		};
		var pole = drawForgedFramePart2(polePar).mesh;
		pole.position.x = pos.x;
		pole.position.y = pos.y;
		pole.position.z = railingPositionZ;
		section.add(pole)
		var botPolePos = copyPoint(pos);
		var botPoleLen = polePar.len;

		if (params.railingModel == 'Кресты') {
			var crossHeight = polar(topPolePos, parRacks.angMarsh2, rackProfile / Math.cos(parRacks.angMarsh2)).y - botPolePos.y;// - botPoleProfileY / Math.cos(parRacks.angMarsh2);
			var crossFillParams = {
				sectLen: botPoleLen,
				ang: parRacks.angMarsh2,
				height: crossHeight,
				dxfBasePoint: par.dxfBasePoint,
				dxfArr: dxfPrimitivesArr,
				material: params.materials.metal,
				profileX: crossProfileX,
				profileY: crossProfileY
			}

			var crossFillPos = {
				x: botPolePos.x,
				y: botPolePos.y + botPoleProfileY / Math.cos(parRacks.angMarsh2)
			};

			crossFillParams.dxfBasePoint = newPoint_xy(par.dxfBasePoint, crossFillPos.x, crossFillPos.y);

			var crossFill = drawCrossFill(crossFillParams);
			crossFill.position.x = crossFillPos.x;
			crossFill.position.y = crossFillPos.y;
			crossFill.position.z = railingPositionZ;
			section.add(crossFill);
		}else{
			//балясины
			var balParams = {
				p1: parRacks.marsh2First,
				p2: parRacks.marsh2Last,
				ang: parRacks.angMarsh2,
				balLen: balLen,
				dxfBasePoint: par.dxfBasePoint,
				material: params.materials.metal,
				drawing: {
					marshId: par.marshId,
					poleId: 4,
					key: par.key
				},
			}
			var balArr = drawForgedBanistersArr(balParams);
			balArr.position.z = railingPositionZ;
			forgedParts.add(balArr);
		}

		//кронштейны поручня
		if (params.handrail != "нет" && params.handrailFixType == "кронштейны") {
			var p1 = polar(topPoint4, parRacks.angMarsh2, 100);
			var p2 = polar(topPoint5, parRacks.angMarsh2, -100);
			var holderAmt = Math.ceil(distance(p1, p2) / maxHolderDist) + 1;
			var holdeDist = distance(p1, p2) / (holderAmt - 1);
			for (var i = 0; i < holderAmt; i++) {
				var pos = polar(p1, parRacks.angMarsh2, holdeDist * i);
				var holderParams = {
					angTop: parRacks.angMarsh2,
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, pos.x, pos.y),
					isForge: true,
				}
				var holder = drawHandrailHolder(holderParams).mesh;
				holder.position.x = pos.x;
				holder.position.y = pos.y;
				holder.position.z = 20 + railingPositionZ;
				section.add(holder)
			}
		}

	}

	/* Поручни */



	var meterHandrailPar = {
		prof: params.handrailProf,
		sideSlots: params.handrailSlots,
		handrailType: params.handrail,
		metalPaint: params.metalPaint_railing,
		timberPaint: params.timberPaint_perila,
	}
	meterHandrailPar = calcHandrailMeterParams(meterHandrailPar);

	//первая точка первого марша на прямой двухмаршевой
	if (topPoint0) {
		var extraLen = 80 + rackPar.topCutLen / 2;
		topPoint0 = polar(topPoint0, parRacks.angMarsh1, -extraLen);
		handrailPoints.push(topPoint0);
	}

	if (topPoint1) {
		//продлеваем поручень до конца площадки
		var extraLen = 80 - 20;
		if (params.model == "ко") extraLen += params.sideOverHang;
		if (par.botConnection) {
			if (params.calcType == 'mono') extraLen = 175;
			if (params.rackBottom == "сверху с крышкой") extraLen -= 80;
			if (meterHandrailPar.handrailModel == "round")
				extraLen += rackProfile / 2;
			if (meterHandrailPar.handrailModel != "round")
				extraLen += rackProfile / 2 - meterHandrailPar.profZ / 2;

			//topPoint1 = polar(topPoint1, parRacks.angBot, 20);
			var pt = newPoint_xy(parRacks.botFirst, 0, 930)
			topPoint1 = itercection(topPoint1, topPoint2, pt, polar(pt, 0, 100));
			var pt = newPoint_xy(parRacks.botFirst, -extraLen, 0)
			var topPoint7 = itercection(topPoint1, polar(topPoint1, 0, 100), pt, polar(pt, Math.PI / 2, 100));
			handrailPoints.push(topPoint7);
		}
		//if (!topPoint0) topPoint1 = polar(topPoint1, parRacks.angBot, -extraLen);
		//if (!topPoint0 && !par.botConnection) topPoint1 = polar(topPoint1, parRacks.angBot, -extraLen);
		if (!topPoint0 && !par.botConnection) topPoint1 = polar(topPoint1, parRacks.angBot, -extraLen);
		handrailPoints.push(topPoint1);
	}

	//корректируем вторую точку если нет нижнего поворота
		if (!topPoint1 && topPoint2) {
		var extraLen = 80 + rackPar.topCutLen / 2;
		if (par.isPlatform && par.botConnection) {
			extraLen = 80 + rackPar.topCutLen / 2;
			if (params.model == "ко") extraLen += params.sideOverHang;
			if (params.rackBottom == "сверху с крышкой") extraLen -= 80;
			if (meterHandrailPar.handrailModel == "round")
				extraLen -= rackProfile / 2;
			if (meterHandrailPar.handrailModel != "round")
				extraLen += rackProfile / 2 - meterHandrailPar.profZ / 2;
		}
		if (par.isRearPRailing && par.botConnection) {
			if (params.calcType == 'mono') extraLen = 175;
			if (params.model == "ко") extraLen += params.sideOverHang;
			if (params.rackBottom == "сверху с крышкой") extraLen -= 80;
			if (meterHandrailPar.handrailModel == "round")
				extraLen -= rackProfile / 2;
			if (meterHandrailPar.handrailModel != "round")
				extraLen += rackProfile / 2 - meterHandrailPar.profZ / 2;

			//topPoint2 = polar(topPoint2, parRacks.angMarsh, 20);
			var pt = newPoint_xy(parRacks.marshFirst, 0, 930)
			topPoint2 = itercection(topPoint2, topPoint3, pt, polar(pt, 0, 100));
			var pt = newPoint_xy(parRacks.marshFirst, -extraLen, 0)
			var topPoint8 = itercection(topPoint2, polar(topPoint2, 0, 100), pt, polar(pt, Math.PI / 2, 100));
			handrailPoints.push(topPoint8);
		}
		if (par.marshId == 'topPlt' && par.key == 'rear') {
			extraLen = 70 + params.stringerThickness + 40 / 2 - meterHandrailPar.profZ / 2; //40 - ширина стойки, 70 - расстояние от центра стойки до края тетивы
			if (params.model == "ко") extraLen += params.sideOverHang;
		}
		if (!topPoint8) topPoint2 = polar(topPoint2, parRacks.angMarsh, -extraLen);
	}
	if (topPoint2) handrailPoints.push(topPoint2);

	//корректируем третью точку если нет верхнего поворота
	if (!topPoint4) {
		var extraLen = 80 - rackPar.topCutLen / 2;
		if (par.topConnection) {
			if (params.model == "ко") extraLen += params.sideOverHang;
			extraLen = 80 - rackPar.topCutLen / 2;
			if (params.rackBottom == "сверху с крышкой") extraLen -= 80;
			if (meterHandrailPar.handrailModel == "round")
				extraLen += rackProfile / 2;
			if (meterHandrailPar.handrailModel != "round")
				extraLen += rackProfile / 2 - meterHandrailPar.profZ / 2;
			if (par.isRearPRailing) extraLen += meterHandrailPar.profZ;

		}
		if (parRacks.marshLast.noDraw) { //TURN RACK
			extraLen = -rackPar.topCutLen;
		}
		if (par.marshId == 'topPlt' && par.key == 'rear') {
			extraLen = 70 + params.stringerThickness + 40 / 2 - meterHandrailPar.profZ / 2; //40 - ширина стойки, 70 - расстояние от центра стойки до края тетивы
			if (params.model == "ко") extraLen += params.sideOverHang;
		}
		topPoint3 = polar(topPoint3, parRacks.angMarsh, extraLen);
	}
	if (topPoint3) {
		if ((params.calcType == 'vhod' || params.calcType === 'veranda') && params.stairModel == 'Прямая') {
			topPoint3 = polar(topPoint3, parRacks.angMarsh, 40);
		}
		handrailPoints.push(topPoint3);
	}

	if (topPoint4) {
		//продлеваем поручень до конца площадки
		var extraLen = 80 - rackProfile / 2;
		if (params.model == "ко") extraLen += params.sideOverHang;
		if (params.calcType == 'mono') extraLen = 90;

		if (par.topConnection) {
			if (params.rackBottom == "сверху с крышкой") extraLen -= 80;
			if (meterHandrailPar.handrailModel == "round")
				extraLen += rackProfile / 2;
			if (meterHandrailPar.handrailModel != "round")
				extraLen += rackProfile / 2 + meterHandrailPar.profZ / 2;


			//topPoint4 = polar(topPoint4, parRacks.angTop, -20);
			var pt = newPoint_xy(parRacks.topLast, 0, 930)
			topPoint4 = itercection(topPoint4, polar(topPoint4, parRacks.angTop, 100), pt, polar(pt, 0, 100));
			var pt = newPoint_xy(parRacks.topLast, extraLen + meterHandrailPar.profY * Math.tan(parRacks.angTop / 2), 0)
			var topPoint6 = itercection(topPoint4, polar(topPoint4, 0, 100), pt, polar(pt, Math.PI / 2, 100));
		}

		if (!topPoint5 && !topPoint6) topPoint4 = polar(topPoint4, parRacks.angTop, extraLen);

		handrailPoints.push(topPoint4);
		if (topPoint6) handrailPoints.push(topPoint6);
	}

	//последняя точка второго марша на прямой горке
	if (topPoint5) {
		var extraLen = 80 // + rackPar.topCutLen / 2;
		topPoint5 = polar(topPoint5, parRacks.angMarsh2, extraLen);
		handrailPoints.push(topPoint5);
	}

	if (params.handrail != "нет") {
		handrailParams = {
			points: handrailPoints,
			side: par.railingSide,
			offset: handrailSlotDepth,
			extraLengthStart: 0,
			extraLengthEnd: 0,
			connection: params.handrailConnectionType,
			dxfBasePoint: par.dxfBasePoint,
			fixType: "нет",
			topConnection: par.topConnection,
			sectText: par.text,
			marshId: par.marshId,
			key: par.key,
		}

		if (params.handrailFixType == "кронштейны") handrailParams.offset = -42;

		//удлиннение поручня последнего марша
		if (params.stairModel == "прямая" || par.marshId == 3) {
			handrailParams.extraLengthEnd += params.topHandrailExtraLength;
		}

		handrailParams = drawPolylineHandrail(handrailParams);

		var handrail = handrailParams.mesh;
		//var posZ = -handrailParams.wallOffset + 20;
		//if (par.railingSide == "left") posZ = handrailParams.wallOffset + 20;
		//handrail.position.z = posZ + railingPositionZ;

		var posZ = -handrailParams.wallOffset + rackProfile / 2 * turnFactor;
		if (par.railingSide == "right") posZ = handrailParams.wallOffset + rackProfile / 2 * turnFactor;
		handrail.position.z = posZ;
		if (par.marshId == 'topPlt' && par.key == 'rear') handrail.position.x -= rackProfile / 2;


		handrails.add(handrail);
	}

	var result = {
		mesh: section,
		forgedParts: forgedParts,
		handrails: handrails,
	}

	//сохраняем данные для спецификации

	var sectLen = distance(handrailPoints[0], handrailPoints[handrailPoints.length - 1]);

	var partName = "forgedSection";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				sumArea: 0,
				sumLength: 0,
				name: "Кованая секция ",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "Ограждения",
			}
		}
		var name = "L=" + Math.round(sectLen) + " прав.";
		if (par.railingSide == "left") name = "L=" + Math.round(sectLen) + " лев.";
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["sumLength"] += Math.round(sectLen) / 1000;
		specObj[partName]["amt"] += 1;
	}
	result.mesh.specId = partName + name;

	if (typeof railingParams != 'undefined') {
		if (!railingParams.sections) {
			railingParams.sections = {
				types: [],
				sumLen: 0,
			}
		}
		for (var i = 1; i < handrailPoints.length; i++) {
			var sectLen = distance(handrailPoints[i - 1], handrailPoints[i]);
			railingParams.sections.types.push(sectLen);
			railingParams.sections.sumLen += sectLen / 1000;
		}
	}

	return result;

} // end of drawRailingSectionForge2

function drawCrossFill(par){
	var section = new THREE.Object3D();

	var sectCount = Math.ceil(par.sectLen / par.height);
	var sectSize = par.sectLen / sectCount + (par.profileY / Math.cos(par.ang)) / sectCount;
	
	// Вертикальные части
	var basePoint = {x:0,y:0};
	var rackPoleParams = {
		type: 'rect',
		poleProfileY: par.profileY,
		poleProfileZ: par.profileX,
		length: par.height,
		poleAngle: Math.PI / 2,
		angStart: -par.ang,
		angEnd: -par.ang,
		material: params.materials.metal_railing,
		dxfBasePoint: par.dxfBasePoint,
		dxfArr: par.dxfArr,
		partName: 'crossProfile'
	}
	
	var zOffset = 0;
	if (par.profileX != 40) {
		zOffset = par.profileX / 2
	}
	for (var i = 0; i < sectCount; i++) {
		var point = polar(basePoint, par.ang, sectSize * i);
		if (i > 0) {
			rackPoleParams.dxfBasePoint = newPoint_xy(par.dxfBasePoint, point.x, point.y)
			var pole = drawPole3D_4(rackPoleParams).mesh;
			pole.position.x = point.x;
			pole.position.y = point.y;
			pole.position.z = zOffset;
			section.add(pole);
		}

		var crossEndPoint = polar(basePoint, par.ang, sectSize - par.profileY / Math.cos(par.ang))
		var crossPar = {
			p0: basePoint,
			p1: newPoint_xy(basePoint, 0, par.height),
			p2: newPoint_xy(crossEndPoint, 0, par.height),
			p3: crossEndPoint,
			profileX: par.profileX,
			profileY: par.profileY,
			material: params.materials.metal_railing,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, point.x, point.y),
			dxfArr: par.dxfArr,
			fixDirection: 'horizontal'
		}

		var cross = drawCross2(crossPar);
		cross.position.x = point.x;
		cross.position.y = point.y;
		cross.position.z = zOffset;
		section.add(cross);
	}

	return section;
}

 /*
 * Calculates the angle ABC (in radians) 
 *
 * A first point, ex: {x: 0, y: 0}
 * C second point
 * B center point
 */
function find_angle(A,B,C) {
    var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));    
    var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2)); 
    var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
    return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
}

function drawForgedFramePart2(par) {

	/*
	var pole3DParams = {
		type: "pole", rack
		poleProfileY: 40,
		poleProfileZ: 60,
		dxfBasePoint: railingSectionParams.dxfBasePointHandrail,
		len: 1000,
		poleAngle: 0,
		angStart
		angEnd
		angTop
		material: params.materials.metal,
		dxfArr: dxfPrimitivesArr,
	  monoType: для монокосуров
	  stepH
	  nextStepH
	  holes отверстия для поворотного столба(считаются от нижней части стойки, для более продобной инфы см mono)
		}
		*/


	par.mesh = new THREE.Object3D();
	var marshPar = getMarshParams(par.marshId);
	var prevMarshPar = getMarshParams(marshPar.prevMarshId);
	var nextMarshPar = getMarshParams(marshPar.nextMarshId);

	par.stringerSideOffset = 0;
	if (params.model == "ко") par.stringerSideOffset = params.sideOverHang;

	//стойка
	if (par.type == "rack") {
		var points = [];
		var holeCenters = [];
		//высота верхнего наклонного среза стойки
		var deltaHeight = par.poleProfileY * Math.tan(par.angTop);

		//верхние точки
		var p0 = { x: 0, y: 0 };
		var p1 = newPoint_xy(p0, -par.poleProfileY / 2, par.len - deltaHeight - 0.01);
		var p2 = newPoint_xy(p1, par.poleProfileY, deltaHeight);

		if (par.angTop < 0) {
			p1 = newPoint_xy(p0, -par.poleProfileY / 2, par.len);
			p2 = newPoint_xy(p1, par.poleProfileY, deltaHeight);
		}
		points.push(p1, p2);

		par.topCutLen = distance(p1, p2);
		par.len2 = par.len - deltaHeight;
		par.angStart = 0;
		par.angEnd = par.angTop;
		
		par.isFirstFlan = false;
		if (par.monoType == 'first' || par.monoType == 'platformRear') par.isFirstFlan = true;

		//стойки монокосоуров

		if (params.calcType == 'mono' && !par.isBanister) {
			p0.y += 90; //костыль для совместимости с лт
			var botLen = 0;
			var stepH = par.stepH;
			var nextStepH = par.nextStepH;
			var holeDiam = 6;
			var bottomHoleOffset = 20;
			var banisterAngleOffset = 16;
			var banisterFlanThk = 8; //толщина фланца L-образной стойки
			var sideLenLast = 120; //длина уступа L-образной стойки

			var angleParams = {
				material: par.material,
				dxfArr: []
			}

			if (par.isBotFlan) par.monoType = 'platformRear';

			//расчет длины нижней части стойки (ниже уровня ступени)
			var botLen = marshPar.h; //длина от верха ступени до низа стойки
			if (par.monoType == 'middle') botLen += params.treadThickness + bottomHoleOffset + banisterAngleOffset;
			//if (par.monoType == 'last') botLen = params.treadThickness + bottomHoleOffset + banisterAngleOffset;
			if (par.monoType == 'last') botLen = params.treadThickness + par.poleProfileY + banisterFlanThk;
			if (par.monoType == 'turnRackStart') {
				//Г-образный поворот
				if (params.stairModel != "П-образная с площадкой" && params.stairModel != "П-образная с забегом") {
					botLen += params.treadThickness + bottomHoleOffset + banisterAngleOffset + prevMarshPar.h;
					if (marshPar.botTurn == "забег") botLen += marshPar.h * 2;
					if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 3 && params.stairAmt2 == 0 && params.turnType_1 !== "забег")
						botLen -= prevMarshPar.h;
				}
				//П-образный поворот
				if (params.stairModel == "П-образная с площадкой" || params.stairModel == "П-образная с забегом") {
					botLen += params.treadThickness + bottomHoleOffset + banisterAngleOffset;
					if (marshPar.botTurn == "забег") {
						if (params.marshDist > 40)
							botLen += marshPar.h * 3;
						else
							botLen += marshPar.h * 5;
					}
				}
			}
			if (par.monoType == 'turnRackEnd') {
				//Г-образный поворот
				if (params.stairModel != "П-образная с площадкой" && params.stairModel != "П-образная с забегом") {
					botLen += params.treadThickness + bottomHoleOffset + banisterAngleOffset + prevMarshPar.h;
					if (marshPar.botTurn == "забег") botLen += marshPar.h * 3;
				}
				//П-образный поворот
				if (params.stairModel == "П-образная с площадкой" || params.stairModel == "П-образная с забегом") {
					botLen = params.treadThickness + bottomHoleOffset + banisterAngleOffset + marshPar.h;
				}
			}

			//нижние точки
			var p3 = newPoint_xy(p0, par.poleProfileY / 2, -botLen);
			var p4 = newPoint_xy(p3, -par.poleProfileY, 0);
			points.push(p3, p4);

			if (par.monoType == 'last') {
				var pointsDop = [];
				var pt1 = newPoint_xy(p0, par.poleProfileY / 2, -botLen);
				var pt2 = newPoint_xy(pt1, sideLenLast, 0);
				var pt3 = newPoint_xy(pt2, 0, par.poleProfileY);
				var pt4 = newPoint_xy(pt3, -sideLenLast, 0);
				pointsDop.push(pt1, pt2, pt3, pt4)

				//создаем шейп
				var shapeParDop = {
					points: pointsDop,
					dxfArr: dxfPrimitivesArr,
					dxfBasePoint: par.dxfBasePoint,
				}

				var shapeDop = drawShapeByPoints2(shapeParDop).shape;
				var extrudeOptionsDop = {
					amount: par.poleProfileZ,
					bevelEnabled: false,
					curveSegments: 12,
					steps: 1
				};

				var poleGeometry = new THREE.ExtrudeGeometry(shapeDop, extrudeOptionsDop);
				poleGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
				var poleDop = new THREE.Mesh(poleGeometry, par.material);
				poleDop.rotation.y = -Math.PI / 2 * turnFactor;
				poleDop.position.z = par.poleProfileY / 2;
				poleDop.position.x = par.poleProfileY / 2 * turnFactor;
				if (par.railingSide == "right" && turnFactor == 1) poleDop.position.z -= sideLenLast + par.poleProfileY;
				if (par.railingSide == "left" && turnFactor == -1) poleDop.position.z += sideLenLast + par.poleProfileY;

				par.mesh.add(poleDop);
			}

			//отверстия под уголки

			//сдвиг первой стойки первого марша, чтобы стойка не пересекала пригласительную ступень

			var isFirstMove = false;
			if (par.isFirst && params.railingStart != 0) {
				if (params.startTreadAmt == params.railingStart && (params.arcSide == par.railingSide || params.arcSide == "two"))
					isFirstMove = true;
			}

			//отверстия на стойке марша
			if(par.monoType == 'first' || par.monoType == 'middle'){
				var rackPar = {
					marshId: par.marshId,
					key: par.key,
					type: par.monoType,
					isFirstFlan: par.isFirstFlan,
					banisterAngleOffset: banisterAngleOffset - 90,
					isFirstMove: isFirstMove,
				}
				holeCenters = setRackHoles(rackPar).holes;
				
				//размер для спецификации
				var sizeA = botLen + holeCenters[0].y;
				if (par.type == 'middle') sizeA = distance(holeCenters[0], holeCenters[1])
			}
	/*
			//верхнее отверстие
			if (par.monoType != 'last' && par.monoType != 'platformRear') {
				var center1 = newPoint_xy(p0, 0, -params.treadThickness - banisterAngleOffset);
				holeCenters.push(center1)

			}
			//нижнее отверстие
			if (par.monoType == 'middle') {
				var center2 = newPoint_xy(center1, 0, -marshPar.h);
				//уголок первой стойки к пригласительной ступени
				if (isFirstMove) center2.anglePos = 'слева';
				holeCenters.push(center2);
			}
		*/	
			if (par.monoType == 'turnRackStart' || par.monoType == 'turnRackEnd') {
				var rackPar = {
					marshId: par.marshId,
					key: par.key,
					type: par.monoType,
					isFirstFlan: par.isFirstFlan,
					banisterAngleOffset: banisterAngleOffset - 90,
				}
				holeCenters = setTurnRackHoles(rackPar).holes;
				/*
				for (var center in holeCenters) {
					holeCenters[center].y += 90;
				}
				*/
			}

			//добавлем уголки

			var angPar = {
				holeCenters: holeCenters,
				railingSide: par.railingSide,
				dxfBasePoint: par.dxfBasePoint,
			}
			var angles = addRackAngles(angPar).mesh;
			par.mesh.add(angles);

			//фланцы
			if (par.isFirstFlan) {
				var flanPar = {
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, 100, 0),
				}
				var botFlan = drawPlatformRailingFlan(flanPar).mesh;
				botFlan.position.z = par.poleProfileY / 2;
				botFlan.position.y = p3.y;
				par.mesh.add(botFlan);
			}
			if (par.monoType == 'last') {
				var flanPar = {
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, 100, 0),
				}
				var botFlan = drawLastRackFlan(flanPar).mesh;
				botFlan.rotation.y = -Math.PI / 2;
				botFlan.position.z = -sideLenLast / 2 - 5
				if (par.railingSide === "left") {
					botFlan.position.z = sideLenLast / 2 + par.poleProfileY + 5
					botFlan.rotation.y = Math.PI / 2;
				}
				botFlan.position.y = p3.y + par.poleProfileY;
				par.mesh.add(botFlan);

				var rackFlan = drawRackFlan(par.poleProfileY);
				rackFlan.rotation.x = Math.PI / 2;
				rackFlan.position.z = -sideLenLast / 2 - 5
				if(par.railingSide === "left") rackFlan.position.z = sideLenLast / 2 + par.poleProfileY + 5
				rackFlan.position.y = p3.y + par.poleProfileY;
				if(!testingMode) par.mesh.add(rackFlan);
			}
			if (!par.isFirstFlan && par.monoType !== 'last') {
				var plugParams = {
					id: "plasticPlug_40_40",
					width: par.poleProfileY,
					height: par.poleProfileY,
					description: "Заглушка низа стойки",
					group: "Ограждения"
				}
				var rackBotPlug = drawPlug(plugParams);
				rackBotPlug.position.z += par.poleProfileY / 2;
				rackBotPlug.position.y = p3.y;
				if (!testingMode) par.mesh.add(rackBotPlug);
			}
		}

		//стойки лт и ко

		if (params.calcType == 'metal' || params.calcType == 'vhod' || par.isBanister || params.calcType == 'bolz' || params.calcType === 'veranda') {
			var p3 = newPoint_xy(p0, par.poleProfileY / 2, 0);
			var p4 = newPoint_xy(p3, -par.poleProfileY, 0);
			points.push(p3, p4);

			var holeDiam = 13;
			var holeDist = 60;

			//отверстия для бокового крепления

			if (params.rackBottom == "боковое" && !par.isBanister) {
				//верхнее отверстие
				var center = { x: 0, y: 90 }
				//нижнее отверстие
				var center2 = newPoint_xy(center, 0, -holeDist)

				if (par.isTurnRack && params.model == 'лт') {
					center.anglePos = turnFactor == 1 ? 'слева' : 'справа';
					center2.anglePos = turnFactor == 1 ? 'слева' : 'справа';
				}
				if (par.isTurnRack && params.model == 'ко') {
					center.anglePos = turnFactor == 1 ? 'справа' : 'слева';
					center2.anglePos = turnFactor == 1 ? 'справа' : 'слева';
				}

				holeCenters.push(center, center2)


				//болты

				if (typeof anglesHasBolts != "undefined" && anglesHasBolts) { //anglesHasBolts - глобальная переменная
					if (!(params.model == "ко" && params.rackBottom == "боковое" && !par.isBotFlan && par.isTurnRack && testingMode)) {
		                /*
	                    var boltPar = {
	                         diam: boltDiam,
	                         len: boltLen,
	                     }
	                     */
						var boltPar = {
							diam: boltDiam,
							len: 20,
							headType: "потай",
						}
						if (params.model == "ко") boltPar.headType = "шестигр.";

						if (par.isTurnRack && !testingMode) {

							var bolt = drawBolt(boltPar).mesh;
							/*
					        bolt.rotation.x = -Math.PI / 2;
					        bolt.position.x = 0;
					        bolt.position.y = 90;
					        bolt.position.z = 2 + 4;
					        if (par.railingSide == "left") {
								bolt.rotation.x = Math.PI / 2;
								bolt.position.z = 40 - boltLen / 2 + boltBulge;
							}
								*/

							if (params.model == "лт") {
								bolt.rotation.x = Math.PI / 2;
								bolt.position.x = 0;
								bolt.position.y = 90;
								bolt.position.z = 2

								if (par.railingSide == "left") {
									bolt.rotation.x = -Math.PI / 2;
									bolt.position.z = par.poleProfileY - 2
								}
							}

							if (params.model == "ко") {
								bolt.rotation.x = -Math.PI / 2;
								bolt.position.x = 0;
								bolt.position.y = 90;
								bolt.position.z = 2 + 4 //boltLen / 2 + boltBulge - 4;

								if (par.railingSide == "left") {
									bolt.rotation.x = Math.PI / 2;
									bolt.position.z = par.poleProfileY - 2 - 4 // - boltLen / 2 - boltBulge + 4;
								}
							}

							par.mesh.add(bolt)

							var bolt2 = drawBolt(boltPar).mesh;
							bolt2.rotation.x = bolt.rotation.x;
							bolt2.position.x = 0;
							bolt2.position.y = 90 - holeDist;
							bolt2.position.z = bolt.position.z;
							par.mesh.add(bolt2)
						}
					}
				}

				//кронштейн из пластин для КО
				if (params.model == "ко" && params.rackBottom == "боковое" && !par.isBotFlan) {
					var holderPar = {
						railingSide: par.railingSide,
						dxfBasePoint: par.dxfBasePoint,
						material: par.material,
					}
					var holder = drawRackHolder(holderPar).mesh;
					holder.position.y = 20;
					if (par.railingSide == "right" || par.marshId == "topPlt") holder.position.z = 40;
					if (par.isTurnRack) {
						holder.rotation.y += Math.PI / 2 * turnFactor;
						holder.position.x += 20;
						holder.position.z -= 20 * turnFactor;
					}
					par.mesh.add(holder);
				}

				if (params.rackBottom == "боковое"){
					var rackFlan = drawRackFlan(par.poleProfileY);
					rackFlan.position.y += holeDist / 2 + 30;
					rackFlan.position.z += 2;
					if (par.key == "out") rackFlan.position.z += par.poleProfileY - 2 - 2;
					if(!testingMode) par.mesh.add(rackFlan);
					
					var plugParams = {
						id: "plasticPlug_40_40",
						width: par.poleProfileY,
						height: par.poleProfileY,
						description: "Заглушка низа стойки",
						group: "Ограждения"
					}
					var rackBotPlug = drawPlug(plugParams);
					rackBotPlug.position.z += par.poleProfileY / 2;
					if(!testingMode) par.mesh.add(rackBotPlug);
				}
			}

			//фланец балясины

			if (params.rackBottom == "сверху с крышкой" || par.isBanister) {
				var flanParams = {
					material: par.material,
					dxfArr: dxfPrimitivesArr0,
					dxfBasePoint: { x: 1000, y: -1000, },
					size: 76,
					holeDst: 55,
				}
				flanParams = drawPlatformRailingFlan(flanParams)
				var botFlan = flanParams.mesh;
				botFlan.position.z = 20;
				botFlan.position.y = 0;
				par.mesh.add(botFlan);
			}

		}

		//Нижняя заглушка
		//if(!(par.monoType == 'first' || par.isBotFlan || par.monoType == 'platformRear')){
		//	var plugParams = {
		//		id: "plasticPlug_40_40",
		//		width: 40,
		//		height: 40,
		//		description: "Заглушка низа стоек ограждения",
		//		group: "Ограждения"
		//	}
		//	var rackBotPlug = drawPlug(plugParams);
		//	rackBotPlug.position.z = par.poleProfileY / 2;
		//	rackBotPlug.position.y = p0.y - botLen;

		//	if (par.monoType == 'last'){
		//		rackBotPlug.position.z = sideLenLast + plugParams.width / 2 + par.poleProfileY / 2;
		//		rackBotPlug.position.y += plugParams.height / 2;
		//		if(par.railingSide === "right") rackBotPlug.position.z = -sideLenLast - plugParams.width / 2 + par.poleProfileY / 2;
		//		rackBotPlug.rotation.y = Math.PI / 2;
		//		rackBotPlug.rotation.z = Math.PI / 2;
		//	}

		//	if(!testingMode) par.mesh.add(rackBotPlug);
		//}

		//создаем шейп
		var shapePar = {
			points: points,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: par.dxfBasePoint,
			drawing: par.drawing || {},
		}

		if (par.monoType == 'turnRackStart' || par.monoType == 'turnRackEnd') {
			shapePar.drawing = { group: 'turnRack', name: 'Поворотный столб марш: ' + par.marshId, yDelta: botLen || 0 };
		}
		if (params.calcType == 'mono' && botLen && !par.isBanister) shapePar.drawing.yDelta -= 90;

		var shape = drawShapeByPoints2(shapePar).shape;

		if (Math.abs(par.angTop) !== 0) {
			shape.drawing.endAngle = {center: copyPoint(p2)};

			var len = 100;
			var angP1 = polar(p2, par.angTop, -len);
			var angP2 = newPoint_xy(p2, -len, 0);//polar(p2, 0, -len * Math.sin(angStart));
			
			shape.drawing.endAngle.p1 = angP2;
			shape.drawing.endAngle.p2 = angP1;
		}

		shape.drawing.baseLine = {p1: p1, p2: p4};
		shape.drawing.zeroDelta = botLen;//Отступ от 0 шейпа, для чертежа необходимо для рассчета размера
		//добавляем отверстия
		var holesPar = {
			holeArr: holeCenters,
			dxfBasePoint: par.dxfBasePoint,
			shape: shape,
			holeRad: holeDiam / 2,
		}
		addHolesToShape(holesPar);

		if (holeCenters.length > 0) {
			shape.drawing.dimPoints = [];//{group: 'timberTurnRack', dimPoints:[{p1: p3_1, p2: p3_2, type:'hor'}, {p1: p3_2, p2: p3_3, type:'vert'}]};
			for (var i = 0; i < holeCenters.length; i++) {
				var hole = holeCenters[i];
				shape.drawing.dimPoints.push({
					p1: p4,
					p2: hole,
					type: 'vert'
				})
			}
		}

	}//конец стойки

	//наклонная палка
	if (par.type == "pole") {
		if (par.vertEnds) {
			par.angStart = par.poleAngle;
			par.angEnd = par.poleAngle;
		}
		//рассчитываем абсолютные углы
		var angStart = par.poleAngle + Math.PI / 2 - par.angStart;
		var angEnd = par.poleAngle + Math.PI / 2 - par.angEnd;
		var startCutLen = par.poleProfileY / Math.sin(angStart - par.poleAngle)
		var endCutLen = par.poleProfileY / Math.sin(angEnd - par.poleAngle)

		var p0 = {
			x: 0,
			y: 0
		};

		if (par.startFlan) {
			p0 = polar(p0, par.poleAngle, 4 / Math.cos(par.poleAngle));
			par.len -= 4 / Math.cos(par.poleAngle);
		}

		if (par.endFlan) {
			par.len -= 4 / Math.cos(par.poleAngle);
			var flanParams = {
				dxfBasePoint: par.dxfBasePoint,
				dxfArr: par.dxfArr,
			}
		}

		var p1 = polar(p0, angStart, startCutLen);
		var p2 = polar(p1, par.poleAngle, par.len);
		var p3 = polar(p0, par.poleAngle, par.len);

		if (par.startFlan) {
			var flanParams = {
				dxfBasePoint: par.dxfBasePoint,
				dxfArr: par.dxfArr,
				place: par.place,
				material: par.material,
				flanType: 'start'
			}
			var flan = drawForgedSectionConnectionFlan(flanParams).mesh;
			flan.position.x = p0.x - 4;
			flan.position.y = p0.y;
			if (par.place == 'top') {
				flan.position.y -= 60 - startCutLen;
			}
			par.mesh.add(flan);
		}
		
		if (par.endFlan) {
			var flanParams = {
				dxfBasePoint: par.dxfBasePoint,
				dxfArr: par.dxfArr,
				place: par.place,
				material: par.material,
				flanType: 'end'
			}
			var flan = drawForgedSectionConnectionFlan(flanParams).mesh;
			flan.position.x = p3.x;
			flan.position.y = p3.y;
			if (par.place == 'top') {
				flan.position.y -= 60 - endCutLen - 4 * Math.tan(par.poleAngle);
			}
			par.mesh.add(flan);
		}

		var shape = new THREE.Shape();
		addLine(shape, par.dxfArr, p0, p1, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p3, p0, par.dxfBasePoint);

		shape.drawing = par.drawing;
		shape.drawing.baseLine = {p1: p0, p2: p3};
		shapesList.push(shape);
		//сохраняем параметры
		par.startCutLen = startCutLen;
		par.endCutLen = endCutLen;
		par.len2 = par.len;


		if (Math.abs(par.angStart) !== 0) {
			shape.drawing.startAngle = {center: copyPoint(p0)};

			var angP1 = polar(p0, angStart, 100);
			var angP2 = polar(p0, par.poleAngle + Math.PI / 2, 100);
			
			shape.drawing.startAngle.p1 = angP2;
			shape.drawing.startAngle.p2 = angP1;
		}
		
		if (Math.abs(par.angEnd) !== 0) {
			shape.drawing.endAngle = {center: copyPoint(p2)};

			var angP1 = polar(p2, angEnd, -100);
			var angP2 = polar(p2, par.poleAngle - Math.PI / 2, 100);

			shape.drawing.endAngle.p1 = angP1;
			shape.drawing.endAngle.p2 = angP2;
		}

	}

	var extrudeOptions = {
		amount: par.poleProfileZ,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var poleGeometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	poleGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var pole = new THREE.Mesh(poleGeometry, par.material);


	par.mesh.add(pole);

	//сохраняем данные для спецификации
	if (par.type == "rack") {
		var partName = "forgedRack";
		if (typeof specObj != 'undefined' && partName) {
			if (!specObj[partName]) {
				specObj[partName] = {
					types: {},
					amt: 0,
					sumLength: 0,
					name: "Стойка кованой секции",
				}
			}

			var name = par.len + "х" + par.poleProfileY + "х" + par.poleProfileZ;
			if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
			if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
			specObj[partName]["amt"] += 1;
		}
		// par.mesh.specId = partName + name;
	}

	//сохраняем данные для ведомости заготовок
	if (typeof poleList != 'undefined') {
		var poleType = par.poleProfileY + "х" + par.poleProfileZ + " черн.";
		//формируем массив, если такого еще не было
		if (!poleList[poleType]) poleList[poleType] = [];
		var polePar = {
			len1: Math.round(par.len2),
			len2: Math.round(par.len),
			angStart: Math.round(par.angStart * 180 / Math.PI * 10) / 10,
			angEnd: Math.round(par.angEnd * 180 / Math.PI * 10) / 10,
			cutOffsetStart: Math.round(par.poleProfileY * Math.tan(par.angStart)),
			cutOffsetEnd: Math.round(par.poleProfileY * Math.tan(par.angEnd)),
			poleProfileY: par.poleProfileY,
			poleProfileZ: par.poleProfileZ,
		}
		polePar.len3 = polePar.len1 + polePar.cutOffsetEnd; //максимальная длина палки
		polePar.text = par.sectText;
		polePar.description = [];
				// polePar.description.push(polePar.text);material
				var side = (par.side == "right" && params.turnSide == 'правое' || par.side == "left" && params.turnSide == 'левое') ? 'внутренняя' : 'внешняя';
				var partName = "Стойка кованой секции Марш: " + par.marshId + " сторона: " + side;
				
				var material = "metal";
				if (par.material.name == 'metal_railing') material = 'metal';

				polePar.material = material;
        polePar.description.push(partName);
		polePar.amt = 1;
		polePar.partIndex = getPartIndex();//Получаем индекс детали для спецификации
		poleList[poleType].push(polePar);
		if(shape.drawing) shape.drawing.partIndex = polePar.partIndex;

	}
	return par;
};

/** Функция отрисовывает фланец для соединения секций ковки
 * 
 */
function drawForgedSectionConnectionFlan(par){
	if (!par) par = {};
	if (!par.dxfArr) par.dxfArr = dxfPrimitivesArr;
	if (!par.dxfBasePoint) {
		par.dxfBasePoint = { x: 0, y: 0 };
		dxfArr = [];
	}

	par.mesh = new THREE.Object3D();

	var size = 40;

	var shape = new THREE.Shape();
	var extrudeOptions = {
		amount: 4,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	//внешний контур
	var p0 = { x: 0, y: 0 }
	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p1, 0, 60);
	var p3 = newPoint_xy(p2, size, 0);
	var p4 = newPoint_xy(p3, 0, -60);

	addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p4, p1, par.dxfBasePoint);

	//круглые отверстия
	var center1 = newPoint_xy(p1, size / 2, 10);
	if (par.place == 'bot') center1 = newPoint_xy(p2, size / 2, -10);
	addRoundHole(shape, par.dxfArr, center1, 4, par.dxfBasePoint);

	if (!testingMode) {
		var boltPar = {
			diam: 6,
			len: 50,
			headType: "меб.",
		}
		var bolt = drawBolt(boltPar).mesh;
		bolt.position.x = -16;
		if (par.flanType == 'end') bolt.position.x = 20;
		bolt.position.y = center1.y;
		bolt.position.z = size / 2;
		bolt.rotation.z = Math.PI / 2;
		if (par.flanType == 'end') {
			bolt.rotation.z = -Math.PI / 2;
		}
		par.mesh.add(bolt);
	}

	//подпись под фигурой
	var text = "Фланец ограждений"
	var textHeight = 30;
	var textBasePoint = newPoint_xy(par.dxfBasePoint, -100, -200)
	addText(text, textHeight, par.dxfArr, textBasePoint)

	var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

	var flan = new THREE.Mesh(geometry, par.material);
	flan.position.z = size;
	flan.rotation.y = Math.PI / 2;
	par.mesh.add(flan);

	//сохраняем данные для спецификации
	var partName = "railingFlan";
	if(typeof specObj !='undefined' && partName){
		if(!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				name: "Фланец скрепления секций ограждения",
				metalPaint: false,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
			}
		}
		var name = "40х60"
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}
	par.mesh.specId = partName + name;

	return par;
}

/** Функция отрисовывает стекло
ссылка на чертеж 6692035.ru/drawings/railing/drawGlass2.pdf

*@params angleTop, heightLeft, width, thk
*@params angleBot, botCutHeight, topCutHeight, holeCenters - не обязательные
*@params dxfBasePoint - если не указан, то в dxf не выводится

*@returns par.mesh
*/

function drawGlass2(par){

	par.dxfArr = dxfPrimitivesArr;
	if(!par.dxfBasePoint) {
		par.dxfBasePoint = {x: 0, y:0,};
		par.dxfArr = [];
	}
	
	par.mesh = new THREE.Object3D();

	//необязательные параметры
	if(!par.angleBot) par.angleBot = par.angleTop;
	if(!par.botCutHeight) par.botCutHeight = 0;
	if(!par.topCutHeight) par.topCutHeight = 0;
	if(!par.holeCenters) par.holeCenters = [];


    var extrudeOptions = {
        amount: par.thk,
        bevelEnabled: false,
        curveSegments: 12,
        steps: 1
		};

	par.mesh = new THREE.Object3D();

	var glassMaterial = new THREE.MeshLambertMaterial({ opacity: 0.6, color: 0x3AE2CE, transparent: true });
	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	//четырехугольник без срезов
	var p1 = {x: 0, y: 0};
	var p2 = newPoint_xy(p1, 0, par.heightLeft);
	var p3 = newPoint_x1(p2, par.width, par.angleTop);
	var p4 = newPoint_x1(p1, par.width, par.angleBot);


	//срез снизу
	var botY = p1.y;
	if(par.botCutHeight != 0) {
		var p11 = newPoint_y(p1,  par.botCutHeight, par.angleBot);
		var p12 = newPoint_xy(p1, 0, par.botCutHeight);
		botY = p12.y;
		}

	//вырез для нахлеста на верхнее перекрытие
	var topY = p3.y;
	if (par.hasTopOverlap) {
		var p41 = newPoint_xy(p3, 0, -par.overlapCutHeight); //Угол выреза
		p3 = polar(p3, par.angleTop, par.extraLengthOverlap);
		var p42 = itercection(p41, newPoint_xy(p41, 10, 0), p3, newPoint_xy(p3, 0, 10));
		
		//par.topCutHeight += p3.y - topY;
	}
	
	//срез сверху	
	if(par.topCutHeight != 0) {			
		var p32 = newPoint_xy(p3, 0, -par.topCutHeight);
		var p31 = itercection(p2, p3, p32, newPoint_xy(p32, 10, 0))
		topY = p32.y;
	}

	var points = []
	
	//левый нижний
	if(par.botCutHeight != 0) points.push(p11, p12)
	else points.push(p1)

	//левый верхний
	points.push(p2)
	
	//правый верхний
	if(par.topCutHeight != 0) points.push(p31, p32)
	else points.push(p3)
	
	//правый нижний
	if(par.hasTopOverlap) points.push(p42, p41)
	points.push(p4)
	
	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
	}

	var shape = drawShapeByPoints2(shapePar).shape;


	//длина стекла справа (для расчета длины слева следующего стекла)
	par.heightRight = p3.y - p4.y;

	//базовые точки для поручней
	par.p1 = copyPoint(p2);
	par.p2 = copyPoint(p3);

	//отверстия стекла
	for(var i = 0; i < par.holeCenters.length; ++i){
		addRoundHole(shape, dxfPrimitivesArr, par.holeCenters[i], par.holeCenters[i].rad, par.dxfBasePoint);
		
		if(!par.holeCenters[i].hasHolder){
			var rutelPar = {
				size: 10
			};

			var rutel = drawGlassRutel(rutelPar);
			rutel.rotation.x = Math.PI / 2;
			if(par.side == "right" && turnFactor == 1) rutel.rotation.x *= -1;
			if(par.side == "left" && turnFactor == -1) rutel.rotation.x *= -1;
			rutel.rotation.x *= turnFactor;
			
			rutel.position.x = par.holeCenters[i].x;
			rutel.position.y = par.holeCenters[i].y;
			rutel.position.z = 125 / 2 - 2;
			if(par.side == "right" && turnFactor == 1) rutel.position.z = -125 / 2 + 2;
			if(par.side == "left" && turnFactor == -1) rutel.position.z = -125 / 2 + 2;
			if (par.side == "right") rutel.position.z += par.thk * turnFactor;
			rutel.position.z *= turnFactor;
	
			if(!testingMode) par.mesh.add(rutel);
		}

	}
	
	if (!shape.drawing) shape.drawing = {};
		shape.drawing.group = 'glass';
		shape.drawing.keyPoints = {topP1: p2, topP2: p3, botP1: p4, botP2: p1};
	if (p11) {
		shape.drawing.keyPoints.botP2 = p11;
		shape.drawing.keyPoints.botP3 = p12;
	}
	shapesList.push(shape);

	var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var glass = new THREE.Mesh(geometry, params.materials.glass);

	par.mesh.add(glass);

	//сохраняем данные для спецификации
	var glassHeight2 = topY - botY;
	var partName = "glasses";
	if(typeof specObj !='undefined'){
		if(!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				sumArea: 0,
				name: "Стекло",
				metalPaint: false,
				timberPaint: false,
				division: "stock_2",
				workUnitName: "amt",
				group: "Ограждения",
				}
			}
		var name = Math.round(par.width) + "x" + Math.round(glassHeight2);
		var area = Math.round(par.width * glassHeight2 / 10000)/100;
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["sumArea"] += area;
	}
	par.mesh.specId = partName + name;

	return par;
} //end of drawGlass2

/** функция отрисовывает стекло для ограждений на стойках
*/

function drawGlassNewell(par) {
    var p1 = par.p1;
    var p2 = par.p2;
		var angle = calcAngleX1(p1, p2)
		if(par.isHandrailAngle) angle = par.angle;
    var glassDist = par.glassDist;
    var glassHeight = par.glassHeight;
    var dxfBasePoint = par.dxfBasePoint;

    var obj = new THREE.Object3D();

    var glassWidth = p2.x - p1.x - glassDist*2;
	
	if(glassWidth < 100) {
		par.mesh = obj;
		return par;
		}
	
    yOffset = Math.tan(angle) * glassWidth;
    var glassShape = new THREE.Shape();

    var pg1 = newPoint_xy(p1, glassDist, 0);
    var pg2 = newPoint_xy(p1, glassDist, glassHeight);

    var pt1 = newPoint_xy(p2, -glassDist, 0);
		var pg3 = itercection(pg1, polar(pg1, angle, 100.0), pt1, polar(pt1, Math.PI / 2, 100.0));
    var pg4 = itercection(pg2, polar(pg2, angle, 100.0), pt1, polar(pt1, Math.PI / 2, 100.0));
		// pg1.y += 200

    addLine(glassShape, dxfPrimitivesArr, pg1, pg2, dxfBasePoint);
    addLine(glassShape, dxfPrimitivesArr, pg2, pg4, dxfBasePoint);
    addLine(glassShape, dxfPrimitivesArr, pg4, pg3, dxfBasePoint);
    addLine(glassShape, dxfPrimitivesArr, pg3, pg1, dxfBasePoint);

	var extrudeOptions = {
        amount: 8,
        bevelEnabled: false,
        curveSegments: 12,
        steps: 1
		};


	par.glassMaterial = params.materials.glass;
	var laserHoleShape = null;
	if (params.railingModel == "Экраны лазер" && params.calcType == 'railing') {
		par.glassMaterial = params.materials.metal_railing;

		var sideOffset = 60;//Отступ от края

		// var holeP1 = newPoint_xy(pg1, sideOffset, sideOffset);
		// var holeP2 = newPoint_xy(pg2, sideOffset, -sideOffset);
		// var holeP3 = newPoint_xy(pg3, -sideOffset, sideOffset);
		// var holeP4 = newPoint_xy(pg4, -sideOffset, -sideOffset);

		var holeP1 = polar(pg1, Math.PI / 4 + angle, 40);
		var holeP2 = polar(pg2, -Math.PI / 4 - angle, 40);
		var holeP3 = polar(pg3, (Math.PI / 2 + Math.PI / 4) - angle, sideOffset);
		var holeP4 = polar(pg4, (Math.PI + Math.PI / 4) + angle, sideOffset);
		
		laserHoleShape = new THREE.Shape();
		addLine(laserHoleShape, dxfPrimitivesArr, holeP1, holeP2, dxfBasePoint);
		addLine(laserHoleShape, dxfPrimitivesArr, holeP2, holeP4, dxfBasePoint);
		addLine(laserHoleShape, dxfPrimitivesArr, holeP4, holeP3, dxfBasePoint);
		addLine(laserHoleShape, dxfPrimitivesArr, holeP3, holeP1, dxfBasePoint);
		glassShape.holes.push(laserHoleShape);
		
	}

	if (!glassShape.drawing) glassShape.drawing = {};
	glassShape.drawing.group = 'glass';
	glassShape.drawing.keyPoints = { topP1: pg2, topP2: pg4, botP1: pg3, botP2: pg1 };
	//if (p11) {
	//	shape.drawing.keyPoints.botP2 = p11;
	//	shape.drawing.keyPoints.botP3 = p12;
	//}
	shapesList.push(glassShape);

	var geom = new THREE.ExtrudeGeometry(glassShape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var glass = new THREE.Mesh(geom, par.glassMaterial);
	obj.add(glass);
	if (laserHoleShape) {
		var laserGeom = new THREE.ExtrudeGeometry(laserHoleShape, extrudeOptions);
		laserGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var laserHoleMesh = new THREE.Mesh(laserGeom, par.glassMaterial);
		laserHoleMesh.userData = {isLaserHole: true};
		obj.add(laserHoleMesh);
	}

    //стеклодержатели--------------------------------------
    var offsetX = pg1.x - 22 + 0.1; //45;
    var offsetY = pg1.y + 100;
    var dxfBasePoint_h = newPoint_xy(dxfBasePoint, offsetX, offsetY);

    var glassHolderParams = {
        dxfBasePoint: dxfBasePoint_h,
        dxfArr: dxfPrimitivesArr,
        material: par.glassHolderMaterial,
        turn: 1,
			}
    var glassHolder = drawGlassHolder1(glassHolderParams).mesh;
    glassHolder.position.z = -16 + 10;
    glassHolder.position.x = offsetX;
    glassHolder.position.y = offsetY;
    obj.add(glassHolder);

    //----------------------
    offsetX = pg2.x - 22 + 0.1;
    offsetY = pg2.y - 140;
    glassHolderParams.dxfBasePoint = newPoint_xy(dxfBasePoint, offsetX, offsetY);
    var glassHolder = drawGlassHolder1(glassHolderParams).mesh;
    glassHolder.position.z = -16 + 10;
    glassHolder.position.x = offsetX;
    glassHolder.position.y = offsetY;
    obj.add(glassHolder);
    //----------------------
    offsetX = pg3.x + 22 - 0.1;
    offsetY = pg3.y + 100;
    glassHolderParams.dxfBasePoint = newPoint_xy(dxfBasePoint, offsetX, offsetY);
    glassHolderParams.turn = -1;
    var glassHolder = drawGlassHolder1(glassHolderParams).mesh;
    glassHolder.position.z = -16+10;
    glassHolder.position.x = offsetX;
    glassHolder.position.y = offsetY;
    obj.add(glassHolder);
    //----------------------
    offsetX = pg4.x + 22 - 0.1;
    offsetY = pg4.y - 140;
    glassHolderParams.dxfBasePoint = newPoint_xy(dxfBasePoint, offsetX, offsetY);
    var glassHolder = drawGlassHolder1(glassHolderParams).mesh;
    glassHolder.position.z = -6;
    glassHolder.position.x = offsetX;
    glassHolder.position.y = offsetY;
    obj.add(glassHolder);
    //----------------------

    par.mesh = obj;


	//сохраняем данные для спецификации
	var sizeHor = pg4.x - pg1.x;
	var sizeVert = pg4.y - pg1.y;
	var partName = "glasses";
	if(typeof specObj !='undefined'){
		if(!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				sumArea: 0,
				name: "Стекло",
				metalPaint: false,
				timberPaint: false,
				division: "stock_2",
				workUnitName: "amt",
				group: "Ограждения",
				}
			}
		if(specObj.unit != "banister" && params.railingModel == "Экраны лазер") specObj[partName].name = "Экран лазер";
		if(specObj.unit == "banister" && params.railingModel_bal == "Экраны лазер") specObj[partName].name = "Экран лазер";
		if(specObj[partName].name == "Экран лазер"){
			specObj[partName].metalPaint = true;
			specObj[partName].division = "metal";
		}
		var name = Math.round(sizeHor) + "x" + Math.round(sizeVert);
		var area = Math.round(sizeHor * sizeVert / 10000)/100;
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["sumArea"] += area;
	}
	par.mesh.specId = partName + name;

	return par;
}

//зажимной стеклодержатель

function drawGlassHolder1(par) {
		var glassHolder = new THREE.Object3D();
		var glassThickness = 8;
		var glassOffset = 20;
    par.thk = 20;
    par.height = 40;
    par.width = 50 * par.turn;
    par.rad = par.height / 2;
    par.radOffset = par.width  - par.rad * par.turn;
	var mat = params.materials.inox;
	if (params.railingModel == "Экраны лазер") mat = params.materials.metal2;

    var shape = new THREE.Shape();
    var p0 = { "x": 0.0, "y": 0.0 };
    var p1 = newPoint_xy(p0, 0.0, par.height);
    var p2 = newPoint_xy(p1, par.radOffset, 0.0);
    var p3 = newPoint_xy(p0, par.radOffset, 0);
    var center = newPoint_xy(p0, par.radOffset, par.rad);

    addLine(shape, par.dxfArr, p3, p0, par.dxfBasePoint);
    addLine(shape, par.dxfArr, p0, p1, par.dxfBasePoint);
    addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);

    if (par.turn === 1)
        addArc2(shape, par.dxfArr, center, par.rad, Math.PI / 2, -Math.PI / 2, true, par.dxfBasePoint);
    else
        addArc2(shape, par.dxfArr, center, par.rad, Math.PI * 3 / 2, Math.PI / 2,  false, par.dxfBasePoint);

		var arcPartThickness = (par.thk - glassThickness) / 2;

    var extrudeOptions = {
        amount: arcPartThickness,
        bevelEnabled: false,
        curveSegments: 12,
        steps: 1
		};

    geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
    var halfHolderPart = new THREE.Mesh(geometry, mat);
		glassHolder.add(halfHolderPart);

    var halfHolderPart = new THREE.Mesh(geometry, mat);
		halfHolderPart.position.z = glassThickness + arcPartThickness;
		glassHolder.add(halfHolderPart);

		var p1 = newPoint_xy(p0, 0.0, par.height);
		var p2 = newPoint_xy(p1, glassOffset * par.turn, 0);
		var p3 = newPoint_xy(p2, 0.0, -par.height);

		var shape = new THREE.Shape();

		addLine(shape, par.dxfArr, p0, p1, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p3, p0, par.dxfBasePoint);

		extrudeOptions.amount = glassThickness;
		geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var centerHolderPart = new THREE.Mesh(geometry, mat);
		centerHolderPart.position.z = arcPartThickness;
		glassHolder.add(centerHolderPart);

		var glassHolderScrewId = "glassHolderMetalScrew";
		if(params.banisterMaterial == "40х40 нерж+дуб") glassHolderScrewId = "glassHolderTimberScrew";
		
		var screwPar = {
			id: glassHolderScrewId,
			description: "Крепление стеклодержателей к стойкам",
			group: "Ограждения"
		}
	
		var screw = drawScrew(screwPar).mesh;
		screw.position.x = p1.x;
		screw.position.y = p1.y - par.height / 2;
		screw.position.z = par.thk / 2;
		screw.rotation.z = Math.PI / 2;
	if(!testingMode) glassHolder.add(screw);

		var partName = "glassHolder";
		if(typeof specObj !='undefined'){
			if(!specObj[partName]){
				specObj[partName] = {
					types: {},
					amt: 0,
					name: "Стеклодержатель зажимной ",
					metalPaint: false,
					timberPaint: false,
					division: "stock_1",
					workUnitName: "amt",
					group: "Ограждения",
					}
				}
			var name = "8мм";
			if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
			if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
			specObj[partName]["amt"] += 1;
		}

		par.mesh = glassHolder;
		par.mesh.specId = partName + name;
		par.mesh.setLayer("metis");

    return par;
} // end of drawGlassHolder1

/** функция задает удлиннение последней стойки верхнего марша
*/

function calcLastRackDeltaY(unit, marshId) {
    if (!marshId) marshId = 3;
    if (params.stairModel == 'Прямая') marshId = 1;

    var marshParams = getMarshParams(marshId);

    var dyLastRack = 0;
    if (params.platformTop == "нет") {
        if (params.model == "лт") {
            if (params.topAnglePosition == "под ступенью" ||
                params.topAnglePosition == "рамка верхней ступени") {
                dyLastRack = 65;
                if (params.stairType == "дпк") {
                    dyLastRack = (marshParams.a - 80 - marshParams.b / 2) * Math.tan(marshParams.ang);
                }
            }
            if (params.topAnglePosition == "над ступенью") {
                if ((marshParams.a - marshParams.b) > 50)
                    dyLastRack = (marshParams.a - marshParams.b - 20) * Math.tan(marshParams.ang);
            }
        }
        if (params.model == "ко") {
            var dyLastRack = 50;
        }
    }
    if (params.calcType == 'mono') {
        dyLastRack = (marshParams.a - 100) * Math.tan(marshParams.ang);
    }

    if (params.stairModel == 'Прямая горка' && params.calcType == 'vhod') dyLastRack = 0;

    if (unit == "wnd_ko") {
        var offsetX = params.nose - 5 + 0.1;
        if (params.riserType == "есть") offsetX += params.riserThickness;

        dyLastRack = marshParams.h * (0.5 - offsetX / marshParams.b);
    }

	if (params.rackBottom == "сверху с крышкой") dyLastRack = 0;
	if (params.calcType == 'vhod' && params.staircaseType == "Готовая") dyLastRack = 0;
	if (params.calcType == 'bolz') {
			dyLastRack = (marshParams.a - 40 - 20) * Math.tan(marshParams.ang);
	}

    return dyLastRack;
}


/** функция задает смещение и удлинение поворотной стойки для metal:
 *
	*stringerShiftPoint: { x: 0, y: 0 }: смещение поворотной стойки
	*rackLenAdd: удлинение стойки
	*shiftBotFrame: сдвиг кронштейна крепления к косоуру  вниз чтобы не попадал на крепление рамки
	*shiftYtoP0: сдвиг вниз от начальной точки
	*shiftYforShiftX: сдвиг вниз по Y из-за сдвига по Х
*/

function setTurnRacksParams(marshId, key) {
	var marshPar = getMarshParams(marshId);
	var prevMarshPar = getMarshParams(marshPar.prevMarshId);
	var nextMarshPar = getMarshParams(marshPar.nextMarshId);

	var rackProfile = 40;

	var turnParams = calcTurnParams(marshPar.prevMarshId)

	if (params.stairModel == "П-образная с забегом" || params.stairModel == "П-образная с площадкой")
		prevMarshPar.hasRailing.in = false;

	var par = {
		stringerShiftPoint: { x: 0, y: 0 }, // смещение поворотной стойки
		rackLenAdd: 0, // удлинение стойки
		shiftBotFrame: 0, //сдвиг кронштейна крепления к косоуру вниз чтобы не попадал на крепление рамки
		shiftYtoP0: 0, //сдвиг вниз от начальной точки
		shiftYforShiftX: 0,//сдвиг вниз по Y из-за сдвига по Х
	}
	if (marshPar.botTurn != "пол" && key == "in" && prevMarshPar.hasRailing.in) {

		par.shiftYforShiftX = (marshPar.b * 0.5 - rackProfile / 2) * Math.tan(marshPar.ang);

		if (params.model == "ко") {
			par.shiftBotFrame = 30;
			if (marshPar.botTurn == "забег") {
				par.shiftYtoP0 = marshPar.h * 2 + prevMarshPar.h + par.shiftBotFrame;
				par.stringerShiftPoint.x = -(turnParams.topMarshOffsetZ + params.nose) + rackProfile / 2;
				par.stringerShiftPoint.y = - par.shiftYtoP0;
				par.rackLenAdd = par.shiftYtoP0 + marshPar.h - par.shiftYforShiftX - (turnParams.topMarshOffsetZ + params.nose) * Math.tan(marshPar.ang);
				if (params.riserType == "есть") {
					par.stringerShiftPoint.x -= params.riserThickness;
					par.rackLenAdd -= params.riserThickness * Math.tan(marshPar.ang);
				}
			}
			if (marshPar.botTurn == "площадка") {
				par.shiftYtoP0 = marshPar.h + prevMarshPar.h + par.shiftBotFrame;
				par.stringerShiftPoint.x = rackProfile / 2;
				par.stringerShiftPoint.y = - par.shiftYtoP0;
				par.rackLenAdd = par.shiftYtoP0 - par.shiftYforShiftX;
				if (params.riserType == "есть") {
					par.stringerShiftPoint.x -= params.riserThickness;
					par.rackLenAdd -= params.riserThickness * Math.tan(marshPar.ang);
				}
			}
		}

		if (params.model == "лт") {
			if (marshPar.botTurn == "забег") {
				par.shiftYtoP0 = marshPar.h * 3 + prevMarshPar.h;
				par.stringerShiftPoint.x = rackProfile / 2;
				par.stringerShiftPoint.y = -par.shiftYtoP0;
				par.rackLenAdd = par.shiftYtoP0 - par.shiftYforShiftX;
			}
			if (marshPar.botTurn == "площадка") {
				par.shiftYforShiftX -= (40) * Math.tan(marshPar.ang);
				//par.shiftYtoP0 = marshPar.h + prevMarshPar.h;
				par.shiftYtoP0 = prevMarshPar.h// + 65;
				if (params.stairType == "лотки" || params.stairType == "рифленая сталь") par.shiftYtoP0 += 65
				par.stringerShiftPoint.x = rackProfile / 2 + 40;
				par.stringerShiftPoint.y = - par.shiftYtoP0;
				par.rackLenAdd = par.shiftYtoP0 - par.shiftYforShiftX + 5;
				if (params.stairType == "лотки" || params.stairType == "рифленая сталь")
					par.rackLenAdd -= 40 - 5;
				if (params.stairType == "дпк")
					par.rackLenAdd -= 20;
			}
		}
	}

	return par;
}

function drawHandrailHolderTurnRack(par) {
	//кронштейн поручня к поворотному столбу


	var topPoint = par.topPoint;//точка верхнего края поручня
	var handrailAng = Math.abs(par.holderAng);
	rackProfile = 40;

	var holderParams = {
		angTop: (Math.PI / 2 - handrailAng) * turnFactor,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, topPoint.x, topPoint.y),
		isForge: false,
		isHor: true,
	}
	var dy = (19 / Math.sin(handrailAng) + 53) * Math.tan(handrailAng);//расстояние сдвига кронштейна вниз от верхнего края поручня
	holderParams.dxfBasePoint.y -= dy;

	var holder = drawHandrailHolder(holderParams).mesh;

	holder.position.y = topPoint.y - 0.5;
	holder.position.y -= dy;
	holder.position.x = topPoint.x;
	holder.position.z = -rackProfile / 2 * turnFactor;
	if (params.calcType === 'mono') {
		if (turnFactor == 1) holder.position.z = rackProfile * 2;
		if (turnFactor == -1) holder.position.z = rackProfile / 2;
	}
	holder.rotation.z = -Math.PI / 2 * turnFactor;
	if (turnFactor == 1) holder.rotation.y = Math.PI;

	par.mesh = holder;

	return par;
}

function getMarshAllParams(par) {
	if (par.marshId) {
		if (!par.marshPar) par.marshPar = getMarshParams(par.marshId);
		if (!par.prevMarshPar) par.prevMarshPar = getMarshParams(par.marshPar.prevMarshId);
		if (!par.nextMarshPar) par.nextMarshPar = getMarshParams(par.marshPar.nextMarshId);
		if (!par.turnBotParams) par.turnBotParams = calcTurnParams(par.marshPar.prevMarshId);
		if (!par.turnParams) par.turnParams = calcTurnParams(par.marshId);
	}
}

/** функция возвращает тип балясины в зависимости от номера балясины в секции и типа чередования
*/

function getBalType(balId, unitPos){
	if(!unitPos) unitPos = "staircase";
	var balToggleType = params.forgeBalToggle;
	var balType1 = params.banister1;
	var balType2 = params.banister2;
	
	if(unitPos == "balustrade") {
		balToggleType = params.forgeBalToggle_bal;
		balType1 = params.banister1_bal;
		balType2 = params.banister2_bal;
	}
	
	//тип балясины
	var balType = balType1;
	if(balToggleType == "1-1"){
		if (balId % 2 == 0) balType = balType1;
		if (balId % 2 == 1) balType = balType2;
	}
	if(balToggleType == "2-1"){				
		if (balId % 3 == 0) balType = balType1;
		if (balId % 3 == 1) balType = balType1;
		if (balId % 3 == 2) balType = balType2;
	}
	if(balToggleType == "1-2"){				
		if (balId % 3 == 0) balType = balType1;
		if (balId % 3 == 1) balType = balType2;
		if (balId % 3 == 2) balType = balType2;
	}
	if(balToggleType == "2-2"){
		if (balId % 4 == 0) balType = balType1;
		if (balId % 4 == 1) balType = balType1;
		if (balId % 4 == 2) balType = balType2;
		if (balId % 4 == 3) balType = balType2;
	}
	
	return balType;

}


function getLastPointsMarsh(treadsObj) {
	// нижние точки
	var botPoints = {}
	botPoints[1] = { "in": 0, "out": 0 };
	botPoints[2] = { "in": 0, "out": 0 };
	botPoints[3] = { "in": 0, "out": 0 };

	var marshId = 1;
	var marshPar = getMarshParams(marshId);
	var turnParams = calcTurnParams(marshId);

	if (marshPar.botTurn != "пол") {
		botPoints[marshId].out = - turnParams.turnLengthBot;
	}
	var marshId = 2;
	var marshPar = getMarshParams(marshId);
	var turnParams = calcTurnParams(marshId);

	if (marshPar.botTurn != "пол") {
		botPoints[marshId].out = - turnParams.turnLengthBot;
	}
	var marshId = 3;
	var marshPar = getMarshParams(marshId);
	var turnParams = calcTurnParams(marshId);

	if (marshPar.botTurn != "пол") {
		botPoints[marshId].out = - turnParams.turnLengthBot;
	}
	//верхние точки
	var topPoints = {}
	topPoints[1] = { "in": 0, "out": 0 };
	topPoints[2] = { "in": 0, "out": 0 };
	topPoints[3] = { "in": 0, "out": 0 };

	var marshId = 1;
	var marshPar = getMarshParams(marshId);
	var turnParams = calcTurnParams(marshId);

	if (marshPar.topTurn != "пол") {
		topPoints[marshId].out = treadsObj.unitsPos.turn1.x + turnParams.turnLengthTop;
	}
	var marshId = 2;
	var marshPar = getMarshParams(marshId);
	var turnParams = calcTurnParams(marshId);

	if (marshPar.topTurn != "пол") {
		topPoints[marshId].out = treadsObj.unitsPos.turn2.x + turnParams.turnLengthTop;
	}
	var marshId = 3;
	var marshPar = getMarshParams(marshId);
	var turnParams = calcTurnParams(marshId);

	if (marshPar.topTurn != "пол") {
		topPoints[marshId].out = treadsObj.unitsPos.marsh3.x + turnParams.turnLengthTop;
	}
	return { botPoints: botPoints, topPoints: topPoints};
}

