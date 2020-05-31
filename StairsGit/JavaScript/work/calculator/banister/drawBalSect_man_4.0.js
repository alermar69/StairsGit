
function drawForgeFrame2(par) {
	var mesh = new THREE.Object3D();
	var basePoint = par.basePoint;//{x:0, y: 0};

	var sectionLength = par.length;
	var pos = { x: 0, y: 0 };
	var railingPositionZ = -par.legProf;
	var rackProfile = par.legProf;
	var height = par.height - 20;	

	var svgMarshId = par.svgMarshId || 0;
	var svgPoleId = par.svgPoleId || 0;
	var material = par.material || params.materials.metal_railing;

	var polePar = {
		type: "pole",
		poleProfileY: 20,
		poleProfileZ: 40,
		dxfBasePoint: par.dxfBasePoint,
		len: sectionLength,
		poleAngle: 0,
		vertEnds: true,
		material: material,
		dxfArr: dxfPrimitivesArr,
		marshId: 'balustrade_' + 111,
		sectText: 'balustrade_' + 111,
	}

	var rackPar = {
		type: "rack",
		poleProfileY: 40,
		poleProfileZ: 40,
		dxfBasePoint: par.dxfBasePoint,
		len: height,
		angTop: 0,
		material: material,
		dxfArr: dxfPrimitivesArr,
		marshId: 'balustrade_' + 111,
		sectText: 'balustrade_' + 111,
		isBanister: true,
	}

	var shortRackPar = {
		type: "rack",
		poleProfileY: 40,
		poleProfileZ: 40,
		dxfBasePoint: par.dxfBasePoint,
		len: par.shortLegLength,
		angTop: 0,
		material: material,
		dxfArr: dxfPrimitivesArr,
		marshId: 'balustrade_' + 111,
		sectText: 'balustrade_' + 111,
		isBanister: true,
	}

	if (par.firstRackDelta) rackPar.len -= par.firstRackDelta;
	var firstRackPosition = newPoint_xy(basePoint, 0, -150);
	rackPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, firstRackPosition.x, firstRackPosition.y);
	//4 максимально возможное кол-во секций марша
	rackPar.drawing = { marshId: svgMarshId, poleId: svgPoleId, group: 'forged_railing', elemType: 'rack', pos: copyPoint(firstRackPosition), len: rackPar.len, key: 'balustrade' };
	var rack = drawForgedFramePart2(rackPar).mesh;
	rack.position.x = firstRackPosition.x;
	rack.position.y = firstRackPosition.y;
	rack.position.z = railingPositionZ;
	if (par.firstRackDelta) {
		rack.position.y += par.firstRackDelta;
		rackPar.len += par.firstRackDelta;
	}
	mesh.add(rack);

	var shortLegsAmt = Math.round((sectionLength - rackProfile) / 800) - 1;
	if (shortLegsAmt < 0) shortLegsAmt = 0;
	var shortLegDst = (sectionLength - rackProfile) / (shortLegsAmt + 1);
	var shortBasePoint = newPoint_xy(firstRackPosition, shortLegDst, 0);

	for (var i = 0; i < shortLegsAmt; i++) {
		shortRackPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, shortBasePoint.x, shortBasePoint.y);
		shortRackPar.drawing = { marshId: svgMarshId, poleId: svgPoleId, group: 'forged_railing', elemType: 'rack', pos: copyPoint(shortBasePoint), len: shortRackPar.len, key: 'balustrade' };
		var rack = drawForgedFramePart2(shortRackPar).mesh;
		rack.position.x = shortBasePoint.x;
		rack.position.y = shortBasePoint.y;
		rack.position.z = railingPositionZ;
		mesh.add(rack)

		shortBasePoint = newPoint_xy(shortBasePoint, shortLegDst, 0);
	}

	//последняя стойка
	if (!par.hiddenLastRack) {
		pos = newPoint_xy(firstRackPosition, sectionLength - rackProfile, 0);
		rackPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);
		rackPar.drawing = { marshId: svgMarshId, poleId: svgPoleId, group: 'forged_railing', elemType: 'rack', pos: copyPoint(pos), len: rackPar.len, key: 'balustrade' };
		var rack = drawForgedFramePart2(rackPar).mesh;
		rack.position.x = pos.x;
		rack.position.y = pos.y;
		rack.position.z = railingPositionZ;
		mesh.add(rack);
	}

	//верхняя перемычка
	polePar.len = sectionLength;
	if (par.hiddenLastRack) polePar.len -= 40;
	polePar.poleAngle = 0;
	pos = {
		x: firstRackPosition.x - rackProfile / 2,
		y: firstRackPosition.y + height,
	}
	polePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);
	polePar.drawing = { marshId: svgMarshId, poleId: svgPoleId, group: 'forged_railing', elemType: 'pole', place: 'top', pos: copyPoint(pos), key: 'balustrade', len: polePar.len, ang: polePar.poleAngle };
	var pole = drawForgedFramePart2(polePar).mesh;
	pole.position.x = pos.x;
	pole.position.y = pos.y;
	pole.position.z = railingPositionZ;
	mesh.add(pole)

	//нижняя перемычка
	polePar.len = sectionLength - rackProfile * 2;
	pos = newPoint_xy(firstRackPosition, rackProfile / 2, par.shortLegLength);
	polePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);
	polePar.drawing = { marshId: svgMarshId, poleId: svgPoleId, group: 'forged_railing', elemType: 'pole', place: 'bot', pos: copyPoint(pos), key: 'balustrade', len: polePar.len, ang: polePar.poleAngle };
	var pole = drawForgedFramePart2(polePar).mesh;
	pole.position.x = pos.x;
	pole.position.y = pos.y;
	pole.position.z = railingPositionZ;
	mesh.add(pole);

	par.mesh = mesh;
	return par;


}

function drawBalSection(par) {

	if (par.type != "секция" && par.type != "секция площадки" && par.type != "секция railing") return;

	var platformLength = par.platformLength;
	var offsetRight = par.offsetStart;
	var offsetLeft = par.offsetEnd;
	var handrailOffsetStart = par.handrailOffsetStart;
	var handrailOffsetEnd = par.handrailOffsetEnd;
	var railingSide = par.railingSide;
	var railingModel = par.railingModel;

	var balRackBottom = $("#balRackBottom_bal").val();
	//var railingModel = $("#railingModel_bal").val();
	var handrail = $("#handrail_bal").val();
	var banisterMaterial = $("#banisterMaterial_bal").val();
	var rackBottom = $("#rackBottom_bal").val();
	var rigelMaterial = $("#rigelMaterial_bal").val();
	var rigelAmt = $("#rigelAmt_bal").val();
	var rackTypeKovka = $("#rackTypeKovka_bal").val();
	var banister1 = $("#banister1_bal").val();
	var banister2 = $("#banister2_bal").val();
	var balDist = []; //расстояние между балясинами
	balDist[0] = $("#balDist_bal").val(); //примерное расстояние между балясинами
	var timberBalStep = $("#timberBalStep_bal").val();
	var timberBal = $("#timberBal_bal").val();
	var timberRack = $("#timberRack_bal").val();
	var handrailFixType = params.handrailFixType_bal

	if (par.type == "секция railing") {
		var handrail = $("#handrail").val();
		var banisterMaterial = $("#banisterMaterial").val();
		var rackBottom = $("#rackBottom").val();
		var rigelMaterial = $("#rigelMaterial").val();
		var rigelAmt = $("#rigelAmt").val();
		var rackTypeKovka = $("#rackTypeKovka").val();
		var banister1 = $("#banister1").val();
		var banister2 = $("#banister2").val();
		var balDist = []; //расстояние между балясинами
		balDist[0] = $("#balDist").val(); //примерное расстояние между балясинами
		var timberBalStep = $("#timberBalStep").val();
		var timberBal = $("#timberBal").val();
		var timberRack = $("#timberRack").val();
		var handrailFixType = params.handrailFixType
	}


	//заглушка для решетки из профиля
	if (railingModel == "Решетка") {
		railingModel = "Кованые балясины";
		params.banister1_bal = "20х20";
		params.banister2_bal = "20х20";
	}


	//параметры поручня
	var handrailPar = {
		prof: params.handrailProf_bal,
		sideSlots: params.handrailSlots_bal,
		handrailType: params.handrail_bal,
	}
	
	if(par.type == "секция railing"){
		var handrailPar = {
			prof: params.handrailProf,
			sideSlots: params.handrailSlots,
			handrailType: params.handrail,
		}
	}
	if (par.type == "секция площадки" && params.calcType == 'vint') {
		var handrailPar = {
			prof: params.handrailProf,
			sideSlots: params.handrailSlots,
			handrailType: par.handrailType,
		}
	}
	handrailPar = calcHandrailMeterParams(handrailPar); //функция в файле priceLib.js

	var scale = 1;

	var railingSection = new THREE.Object3D();
	var rackOffsetY = 150;
	var rackLength = params.handrailHeight_bal - handrailPar.profY; //длина стойки с учетом кронштейна
	if(par.type == "секция railing"){
		rackLength = par.sectHeight - handrailPar.profY
	}	

	var handrailHolderLength = 70; //длина кронштейна поручня
	var railingPositionZ = -20//-40;
	var basePoint = [];
	if (turnFactor == -1) {
		var railingSideTemp = railingSide
		if (railingSideTemp == "left") railingSide = "right"
		if (railingSideTemp == "right") railingSide = "left"
	}

	/*материалы*/
	var glassThickness = 8;
	if (railingModel == "Самонесущее стекло") glassThickness = 12;
	var handrailAngle = 0;
	var glassExtrudeOptions = {
		amount: glassThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	var forgingExtrudeOptions = {
		amount: 40,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	/* стойки */


	if (railingModel == "Ригели" || railingModel == "Стекло на стойках" || railingModel == "Экраны лазер") {

		rackPosition = [];
		rackNuber = 0;
		var sectionLength = platformLength - offsetLeft - offsetRight - 40
		//rackLength = 830;
		if (params.rackBottom_bal == "боковое") rackLength += 150;

		//стойки
		var rackParams = {
			len: rackLength - 70 - 2, //70 - высота кронштейна 2 - толщина кронштейна
			isBotFlan: true,
			dxfBasePoint: par.dxfBasePoint,
			dxfArr: dxfPrimitivesArr,
			material: params.materials.metal_railing,
			sectText: "балюстрада",
			unit: 'balustrade',
			realHolder: true, //точно отрисовываем кронштейн поручня
			holderAng: 0,
		};
		if (params.banisterMaterial_bal != "40х40 черн.") {
			rackParams.material = params.materials.inox;
		}
		var rackAmt = Math.round(sectionLength / 800) + 1;
		if (rackAmt < 2) rackAmt = 2;
		var rackDist = sectionLength / (rackAmt - 1);
		for (i = 0; i < rackAmt; i++) {
			rackParams.len = rackLength - 70 - 2; //70 - высота кронштейна 2 - толщина кронштейна
			if (i == 0 && par.type == "секция площадки") rackParams.len -= 4; //стойки разной длины для винтовой лестницы
			var pos = {
				x: offsetLeft + 20 + rackDist * i,
				y: -60,
				z: -40,
			}
			if (i == 0 && par.type == "секция площадки") pos.y += 4;

			rackParams.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);

			var rack = drawRack3d_4(rackParams).mesh;
			rack.position.x = pos.x;
			rack.position.y = pos.y;
			rack.position.z = pos.z;
			railingSection.add(rack);
			rackPosition.push(rack.position);
		}
	}


	/* ригели */
	if (railingModel == "Ригели") {

		var rigelProfileY = 20;
		var rigelProfileZ = 20;

		if (rigelMaterial == "20х20 черн.") {
			rigelModel = "rect";
			rigelProfileY = 20;
			rigelProfileZ = 20;
		}
		if (rigelMaterial == "Ф12 нерж.") {
			rigelModel = "round";
			rigelProfileY = 12;
			rigelProfileZ = 12;
		}
		if (rigelMaterial == "Ф16 нерж.") {
			rigelModel = "round";
			rigelProfileY = 16;
			rigelProfileZ = 16;
		}

		var x0 = (offsetLeft - 30);
		var y0 = 0;
		var rigelLength = platformLength - offsetLeft - offsetRight + 60;
		var z0 = 0;
		// if (railingSide == "left") z0 = -40 + rigelProfileZ + 20 + 1;
		// if (railingSide == "right") z0 = 40 - rigelProfileZ - 1;
		rigelAmt = Number(rigelAmt);
		var rigelDist = (rackLength - rackOffsetY) / (rigelAmt + 1);

		var dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, 200)

		var poleParams = {
			partName: "rigels",
			type: rigelModel,
			poleProfileY: rigelProfileY,
			poleProfileZ: rigelProfileZ,
			length: rigelLength,
			poleAngle: 0,
			material: params.materials.metal_railing,
			dxfBasePoint: dxfBasePoint,
			dxfArr: dxfPrimitivesArr,
			rigelStartPlug: true,
			rigelEndPlug: true,
			sectText: "балюстрада",
		}
		if (params.rigelMaterial_bal != "20х20 черн.") poleParams.material = params.materials.inox;

		for (var i = 1; i < rigelAmt + 1; i++) {
			var pole = drawPole3D_4(poleParams).mesh;
			pole.position.x = offsetLeft - 30;
			pole.position.y = rigelDist * i;
			pole.position.z = z0;
			railingSection.add(pole);
			poleParams.dxfBasePoint.y += -50;

			var screwPar = {
				id: "rigelScrew",
				description: "Крепление ригелей",
				group: "Ограждения"
			}

			var rigelHolderId = "rigelHolder12";
			var holderSize = 12;
			if (params.rigelMaterial_bal == "Ф16 нерж.") {
				rigelHolderId = "rigelHolder16";
				plugSize = 16;
			}

			var holderPar = {
				size: holderSize,
				id: rigelHolderId,
				description: "Кронштейн крепления ригелей",
				group: "Ограждения"
			}

			for (var k = 0; k < rackAmt; k++) {
				var screw = drawScrew(screwPar).mesh;
				screw.rotation.x = Math.PI / 2;
				screw.position.x = offsetLeft + 20 + rackDist * k;
				screw.position.y = rigelDist * i + 6;
				screw.position.z = 10;
				railingSection.add(screw);

				if (params.rigelMaterial_bal != "20х20 черн.") {
					var holder = drawRigelHolder(holderPar);
					holder.rotation.x = Math.PI / 2;
					holder.position.x = offsetLeft + 20 + rackDist * k;
					holder.position.y = rigelDist * i + 6;
					holder.position.z = 10;
					if (!testingMode) railingSection.add(holder);
				}
			}

			//var screw = drawScrew(screwPar).mesh;
			//screw.rotation.x = Math.PI / 2;
			//screw.position.x = rigelLength - 30 + 20;
			//screw.position.y = rigelDist * i + 10;
			//screw.position.z = 10;
			//railingSection.add(screw);

			//if (params.rigelMaterial_bal != "20х20 черн.") {
			//	var holder = drawRigelHolder(holderPar);
			//	holder.position.x = rigelLength - 30 + 20;
			//	holder.position.y = rigelDist * i + 10;
			//	holder.position.z = 10;
			//	if (!testingMode) railingSection.add(holder);
			//}
		}
		if (par.type == "секция") {
			balPartsParams.rigels.push(poleParams.length);
			balPartsParams.rigelAmt += rigelAmt;
		}

		//подпись
		var text = "Ригели секции " + (par.sectId + 1);
		var textHeight = 30;
		var textBasePoint = newPoint_xy(poleParams.dxfBasePoint, 100, -50)
		addText(text, textHeight, dxfPrimitivesArr, textBasePoint)

	}

	/* стекла на стойках */

	if (railingModel == "Стекло на стойках" || railingModel == "Экраны лазер") {
		var glassDist = 40 / 2 + 22;
		var glassHeight = 725;
		glassParams = {
			p1: 0,
			p2: 0,
			angle: handrailAngle,
			glassDist: glassDist,
			glassHeight: glassHeight,
			glassExtrudeOptions: glassExtrudeOptions,
			dxfBasePoint: par.dxfBasePoint,
		}

		for (i = 0; i < rackPosition.length - 1; i++) {
			glassParams.p1 = newPoint_xy(rackPosition[i], 0, 10); //10 - подогнано
			glassParams.p2 = newPoint_xy(rackPosition[i + 1], 0, 10);
			var glass = drawGlassNewell(glassParams).mesh;
			glass.position.z = railingPositionZ * 2 + 16;
			railingSection.add(glass);
			if (par.type == "секция") balPartsParams.glassAmt += 1;
		}


	} //конец стекол на стойках


	/* самонесущее стекло */
	if (railingModel == "Самонесущее стекло") {
		var glassDist = 10; //зазор между стеклами

		var glassHeight = params.handrailHeight_bal; //высота без поручня

		if (params.handrailFixType_bal == "паз") glassHeight += -handrailPar.profY + 25; //25 - глубина паза
		if (params.handrailFixType_bal == "кронштейны") glassHeight += 50;
		if (params.glassFix_bal == "профиль") glassHeight -= 25;
		if (params.glassFix_bal == "рутели") glassHeight += 200;

		var glassAmt = Math.round((platformLength) / 800);
		if (glassAmt < 1) glassAmt = 1;
		var glassLengthX = (platformLength) / glassAmt;
		var dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, 200)
		var sectionLength = platformLength * 1.0;

		var glassParams = {
			p1: { x: 0, y: 0 }, //базовая левая нижняя точка
			p2: { x: 0, y: 0 }, //базовая правая нижняя точка
			height: glassHeight, //высота стекла
			offsetLeft: glassDist / 2, //отступ края стекла от базовой точки
			offsetRight: glassDist / 2,
			offsetY: -150, //отступ снизу
			material: params.materials.glass,
			thickness: 12,
			dxfPrimitivesArr: dxfPrimitivesArr,
			dxfBasePoint: dxfBasePoint,
		}

		if (par.angleStart != 0) glassParams.p2.x = - glassDist / 2 - glassParams.thickness / 2;
		if (par.angleStart == 0) glassLengthX = (platformLength - glassDist / 2 - glassParams.thickness / 2) / glassAmt;

		var pos = {
			x: 0,
			y: 0,
			z: 0,
		}
		if (params.glassFix_bal == "профиль") pos.y = 25;
		if (params.glassFix_bal == "рутели") pos.y = -200;


		for (i = 0; i < glassAmt; i++) {
			glassParams.p1.x = glassParams.p2.x;
			glassParams.p2.x += glassLengthX;
			//отверстия под рутели
			if (params.glassFix_bal == "рутели") {
				var offset = {
					x: 100,
					y: 50,
				};
				var rutelDist = 100;
				glassParams.offsetY = -150;
				var center1 = newPoint_xy(glassParams.p1, offset.x, offset.y + glassParams.offsetY);
				var center2 = newPoint_xy(center1, 0, rutelDist);
				var center3 = newPoint_xy(glassParams.p2, -offset.x, offset.y + glassParams.offsetY);
				var center4 = newPoint_xy(center3, 0, rutelDist);
				center1.diam = center2.diam = center3.diam = center4.diam = 18;
				glassParams.holes = [center1, center2, center3, center4];
			}

			glassParams.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x + glassParams.p1.x, pos.y + 150);

			var glass = draw4AngleGlass_4(glassParams).mesh;
			glass.position.y = pos.y;
			glass.position.z = -20 - glassParams.thickness / 2;
			railingSection.add(glass);
		}


		//профиль

		if (params.glassFix_bal == "профиль") {

			var profileParams = {
				width: 50,
				height: 100,
				length: platformLength * 1.0,
				angleStart: par.angleStart,
				angleEnd: par.angleEnd,
				material: params.materials.inox,
				dxfPrimitivesArr: dxfPrimitivesArr,
				dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, -150),
				sectText: "балюстрада",
			}

			profileParams = drawGlassProfile_4(profileParams);
			railingSection.add(profileParams.mesh);

			//кол-во точек крепления к перекрытию
			var fixPointAmt = Math.ceil(platformLength / 300) + 1;
			if (fixPointAmt < 2) fixPointAmt = 2

		}

		if (par.type == "секция") {
			balPartsParams.sectionAmt += 1;
			if (!balPartsParams.fixPointAmt) balPartsParams.fixPointAmt = fixPointAmt;
			else balPartsParams.fixPointAmt += fixPointAmt;
		}
	}// конец самонесущего стекла


	/*  ковка */

	function forge_nav() { }; //пустая функция для навигации

	if (railingModel == "Кованые балясины" || railingModel == "Кресты") {
		if (typeof balDist == 'undefined') balDist = [150];

		var sectionLength = platformLength - offsetLeft - offsetRight;
		var sectionsCount = Math.ceil(sectionLength / 2000);
		if (sectionsCount > 0) sectionsCount = Math.ceil((sectionLength + 40 * (sectionsCount - 1)) / 2000);
		for (var j = 1; j <= sectionsCount; j++) {
			//var sectLen = 2000;
			//if (j == sectionsCount) sectLen = sectionLength - 2000 * (j - 1);

			var sectLen = sectionLength / sectionsCount + 40; //40 - размер стойки
			
			var sectBaseX = (sectLen - 40) * (j - 1); //Базовая точка секции по оси X
			
			var svgMarshId = 4 + par.sectId;
			var svgPoleId = j;

			//рамка
			var frameParams = {
				length: sectLen,
				height: rackLength, 
				shortLegLength: 100,
				legProf: 40,
				botProf: 20,
				topProf: 20,
				material: params.materials.metal_railing,
				dxfPrimitivesArr: dxfPrimitivesArr,
				dxfBasePoint: par.dxfBasePoint,
				firstRackDelta: 0,
				sectText: "балюстрада",
				sectId: par.sectId,
				hiddenLastRack: j < sectionsCount,
				basePoint: { x: offsetLeft + sectBaseX, y: 0 },
				svgMarshId: svgMarshId,
				svgPoleId: svgPoleId,
			}

			if (params.handrailFixType_bal == "паз") frameParams.height += 15; // 15 чтобы поручень оделся на сварную секцию
			if (params.handrailFixType_bal == "кронштейны") frameParams.height -= 40;


			if (par.type == "секция площадки") frameParams.firstRackDelta = 4; //стойки разной длины для винтовой лестницы

			frameParams = drawForgeFrame2(frameParams);
			var frame = frameParams.mesh;
			// frame.position.x = offsetLeft +sectBaseX;
			railingSection.add(frame);

			//балясины
			if (railingModel == "Кованые балясины") {
				var frameLengthIn = sectLen - frameParams.legProf * 2;
				var balAmt = Math.round(frameLengthIn / balDist[0])
				balDist[1] = frameLengthIn / balAmt;
				var balLength = frameParams.height - frameParams.shortLegLength - frameParams.botProf - frameParams.topProf;
	
				var insertPoint = [offsetLeft + sectBaseX + frameParams.legProf, frameParams.botProf - 50, -26];
				insertPoint[0] += balDist[1];
				insertPoint[0] -= 20; //подогнано
				var balAmt1 = 0;
				var balAmt2 = 0;
	
				//точки для линии в dxf
				var p1 = newPoint_xy(par.dxfBasePoint, frameParams.legProf + balDist[1], frameParams.botProf + frameParams.shortLegLength);
				for (i = 0; i < balAmt - 1; i++) {
	
					var balPar = {
						type: getBalType(i, 'balustrade'),
						len: balLength,
						dxfBasePoint: newPoint_xy(p1, balDist[1] * i, 0),
					}
					//var bal = drawForgedBanister_4(balPar).mesh;
					if (!menu.meshBanisters)
						var bal = drawForgedBanister_4(balPar).mesh;
					else
						var bal = drawForgedBanister_5(balPar).mesh;
					bal.position.x = insertPoint[0] + balDist[1] * i;
					bal.position.y = insertPoint[1];
					bal.position.z = insertPoint[2];
					railingSection.add(bal);
	
					var fakeShape = new THREE.Shape();
					var pos = { x: bal.position.x, y: bal.position.y };
					fakeShape.drawing = {
						marshId: svgMarshId,
						poleId: svgPoleId,
						key: 'balustrade',
						group: 'forged_railing',
						elemType: 'banister',
						index: i,
						count: balAmt - 1,
						pos: pos,
						balLen: balLength,
						//banisterType: balType,
					};
					shapesList.push(fakeShape);
				}
			}
			if (railingModel == 'Кресты') {
				var crossHeight = frameParams.height;
				var crossProfParams = getProfParams(params.crossProfileBal);
				var crossProfileX = crossProfParams.sizeA;
				var crossProfileY = crossProfParams.sizeB;

				var crossFillParams = {
					sectLen: sectLen - 80,
					ang: 0,
					height: crossHeight - 140,
					dxfBasePoint: par.dxfBasePoint,
					dxfArr: dxfPrimitivesArr,
					material: params.materials.metal_railing,
					profileX: crossProfileX,
					profileY: crossProfileY
				}

				var crossFillPos = {
					x: offsetLeft + sectBaseX + frameParams.legProf - 20,
					y: frameParams.botProf - 50,
				};

				crossFillParams.dxfBasePoint = newPoint_xy(par.dxfBasePoint, crossFillPos.x, crossFillPos.y);

				var crossFill = drawCrossFill(crossFillParams);
				crossFill.position.x = crossFillPos.x;
				crossFill.position.y = crossFillPos.y;
				crossFill.position.z = -40;
				railingSection.add(crossFill);
			}
		}

		if (railingModel == "Кованые балясины") {
			//подпись
			var text = "Кованая секция балюстрады " + (par.sectId + 1);
			if (par.type == "секция площадки") text = "Секция ограждения площадки";
			var textHeight = 30;
			var textBasePoint = newPoint_xy(par.dxfBasePoint, 100, -100)
			addText(text, textHeight, dxfPrimitivesArr, textBasePoint)
		}
		if (railingModel == 'Кресты') {

		}

		//кронштейны поручня
		if (handrail != "нет" && handrailFixType == "кронштейны") {
			var holderDist = 800;
			var sideOffset = 60;
			var holderLength = 40;
			var holderRad = 6;
			var frameLength = sectionLength - sideOffset * 2;
			var holderAmt = Math.ceil(frameLength / holderDist) + 1;
			holderDist = frameLength / (holderAmt - 1);

			//базовая точка
			var p1 = { x: sideOffset, y: frameParams.height - 150 }

			for (i = 0; i < holderAmt; i++) {
				var pos = newPoint_xy(p1, holderDist * i, 0);
				var holderParams = {
					angTop: 0,
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, pos.x, pos.y + 150),
					isForge: true,
					railingModel: railingModel
				}
				var holder = drawHandrailHolder(holderParams).mesh;
				holder.position.x = pos.x + offsetLeft;
				holder.position.y = pos.y;
				holder.position.z = -20;
				railingSection.add(holder)
			}
		}

		if (par.type == "секция") {
			balPartsParams.sectionAmt += 1;
			balPartsParams.forgedBalAmt1 += balAmt1;
			balPartsParams.forgedBalAmt2 += balAmt2;
			if (!balPartsParams.handrailHolder) balPartsParams.handrailHolder = holderAmt;
			else balPartsParams.handrailHolder += holderAmt;
			if (!balPartsParams.botFlans) balPartsParams.botFlans = frameParams.flanAmt;
			else balPartsParams.botFlans += frameParams.flanAmt;
		}


	}//конец кованых ограждений


	/*** частые стойки ***/


	if (railingModel == "Частые стойки") {
		var sectionLength = platformLength - offsetLeft - offsetRight - 40

		var rackPosition0 = {
			x: 0,
			y: 0,
			z: -20,
		}
		var rackPosition3 = {
			x: platformLength,
			y: 0,
			z: -20,
		}

		var banisterLength = 900;

		//балясины
		var balAmt = Math.round((rackPosition3.x - rackPosition0.x) / balDist)
		balDist = (rackPosition3.x - rackPosition0.x) / (balAmt + 1);

		var insertPoint = newPoint_xy(rackPosition0, balDist, banisterLength / 2 - 150);
		var rad = 12.5;
		var height = banisterLength;
		var segmentsX = 20
		var segmentsY = 0
		var openEnded = false;

		var geom = new THREE.CylinderGeometry(rad, rad, height, segmentsX, segmentsY, openEnded);

		for (i = 0; i < balAmt; i++) {
			var banister = new THREE.Mesh(geom, params.materials.metal);
			banister.position.x = insertPoint.x;
			banister.position.y = insertPoint.y;
			banister.position.z = insertPoint.z;
			railingSection.add(banister);
			insertPoint = newPoint_xy(insertPoint, balDist, 0);
			if (par.type == "секция") balPartsParams.rackAmt += 1;
		}
	}


	/* поручень */

	function handrail_nav() { }; //пустая функция для навигации

	if (handrail != "нет") {

		var handrailProfileY = handrailPar.profY;
		var handrailProfileZ = handrailPar.profZ;
		var handrailModel = handrailPar.handrailModel;
		var handrailMaterial = params.materials.metal;
		if (handrailPar.mat == "timber") handrailMaterial = params.materials.handrail;
		if (handrailPar.mat == "inox") handrailMaterial = params.materials.inox;
		//поручень кроме деревянных ограждений
		if (railingModel != "Деревянные балясины" && railingModel != "Стекло" && railingModel != "Дерево с ковкой") {
			var handrailLength = sectionLength + handrailOffsetStart + handrailOffsetEnd + 40;
			if (railingModel == "Самонесущее стекло") {
				handrailLength = sectionLength + 15 * 2;
				if (par.angleStart == 0) handrailLength += -handrailProfileZ / 2
			}

			if (railingModel == "Решетка" || railingModel == "Кованые балясины") handrailLength -= 40;

			var handrailParams = {
				partName: "handrails",
				unit: "balustrade",
				type: handrailModel,
				poleProfileY: handrailProfileY,
				poleProfileZ: handrailProfileZ,
				length: handrailLength,
				poleAngle: 0,
				material: handrailMaterial,
				dxfBasePoint: newPoint_xy(par.dxfBasePoint, basePoint.x, basePoint.y),
				dxfArr: dxfPrimitivesArr,
				fixType: "нет",
				side: "in",
				drawing: { group: 'handrails', unit: 'balustrade', pos: basePoint, ang: 0 }
			}
			if (par.type == "секция площадки" && params.calcType == 'vint') {
				handrailParams.unit = "vint"
				handrailParams.type = "ПВХ"
			}

			//Поправка положения поручня по оси Z
			if (params.railingModel_bal !== 'Самонесущее стекло') railingPositionZ -= 20 - handrailProfileZ / 2;


			if (params.handrailConnectionType_bal == 'без зазора премиум' && !(par.type == "секция площадки" && params.calcType == 'vint')) {
				handrailParams.cutBasePlane = 'top';
				handrailParams.startAngle = 0;
				handrailParams.endAngle = 0;


				if (params.railingModel !== 'Самонесущее стекло') {

					if (par.connection == 'начало') {
						handrailParams.startAngle = par.angleStart;
						handrailOffsetStart -= handrailProfileZ / 2;
						handrailParams.length -= handrailProfileZ / 2;
					}
					if (par.connection == 'конец') {
						handrailParams.endAngle = par.angleEnd;
						handrailParams.length += handrailProfileZ / 2;
					}
					if (par.connection == 'две стороны') {
						handrailParams.startAngle = par.angleStart;
						handrailParams.endAngle = par.angleEnd;
						handrailOffsetStart -= handrailProfileZ / 2;
					}
				} else {
					if (par.connection == 'начало' || par.connection == 'две стороны') {
						handrailParams.startAngle = par.angleStart;
						handrailOffsetStart -= handrailProfileZ / 2;
					}
					if (par.connection == 'конец' || par.connection == 'две стороны') {
						handrailParams.endAngle = par.angleEnd;
						handrailParams.length -= (40 - handrailProfileZ) / 2;
						if (par.connection == 'две стороны') {
							if (par.sectId == 0 || par.sectId > 0 && $('#banisterSectionDirection' + par.sectId).val() !== $('#banisterSectionDirection' + (par.sectId - 1)).val()) {
								handrailParams.length -= handrailProfileZ / 2;
							}
						}
					}
				}

			}

			if (params.handrailConnectionType_bal == 'шарнир') {
				if (par.connection == 'начало') {
					handrailOffsetStart -= 50;
					handrailParams.length -= 50;
				}
				if (par.connection == 'конец') {
					// handrailParams.length -= 50;
				}
				if (par.connection == 'две стороны') {
					handrailOffsetStart -= 50;
					handrailParams.length -= 50;
				}
			}

			//позиция поручня
			var pos = {
				x: offsetLeft - handrailOffsetStart,
				y: params.handrailHeight_bal - rackOffsetY - handrailProfileY,
				z: railingPositionZ - handrailProfileZ / 2 + 70,
			}

			if(par.type == "секция railing"){
				pos.x = -20;
				pos.y = par.sectHeight - handrailProfileY - 90
				
			}	
			if (handrailParams.poleType === "round") {
				pos.x += handrailParams.length / 2;
				pos.y += handrailProfileY / 2;
				pos.z = - 20;
				if (par.type == "секция площадки") pos.z = 0;
			}

			if (railingModel == "Самонесущее стекло") {
				handrailParams.fixType = params.handrailFixType_bal;
				pos.z = 30;
				if (params.handrailFixType_bal == 'паз' && par.connection !== 'начало' && par.connection !== 'две стороны') pos.x -= 10;
				if (params.handrailFixType_bal == "кронштейны") pos.z = -30; //подогнано
			}

			if (params.calcType == 'vint') {
				pos.y = -rackOffsetY + params.handrailHeight_bal - handrailPar.profY - 25 + 42;//42 высота кронштейна
				if (params.handrail_bal == "Ф50 нерж." || params.handrail_bal == 'ПВХ') {
					pos.y += handrailPar.profY / 2;
				}
			}
			

			handrailParams.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y + 150);

			var partsAmt = Math.ceil(handrailParams.length / 3000);
			var length = handrailParams.length;
			for (var i = 0; i < partsAmt; i++) {
				if ((par.connection == 'конец' || par.connection == 'нет') && i == 0) handrailParams.startPlug = true;
				if ((par.connection == 'начало' || par.connection == 'нет') && i == (partsAmt - 1)) handrailParams.endPlug = true;
				handrailParams.length = length / partsAmt;

				if (params.railingModel_bal == "Кованые балясины" && params.handrailFixType_bal == "паз") handrailParams.hasSilicone = true;
				if (params.railingModel_bal == 'Самонесущее стекло' && params.handrailFixType_bal == "паз") handrailParams.hasSilicone = true;
				var pole = drawHandrail_4(handrailParams).mesh;

				var handrailPos = polar(pos, handrailAngle, handrailParams.length * i)

				pole.position.x = handrailPos.x;
				pole.position.y = handrailPos.y;
				if (testingMode) pole.position.y += 2; //2 подогнано чтобы не было пересечений
				pole.position.z = pos.z;
				railingSection.add(pole);
			}

			if (params.handrailConnectionType_bal == 'шарнир') {
				if (par.connection == 'конец' || par.connection == 'две стороны') {
					var jointParams = {
						rad: 25,
						dxfBasePoint: handrailParams.dxfBasePoint
					}

					var sphere = drawHandrailJoint(jointParams);
					sphere.position.x = pos.x + handrailLength + jointParams.rad;
					sphere.position.y = pos.y + handrailProfileY / 2 - jointParams.rad;
					sphere.position.z = pos.z - handrailProfileZ / 2 - jointParams.rad;

					if (par.connection == 'две стороны') {
						sphere.position.x -= jointParams.rad * 2;
					}

					railingSection.add(sphere);
				}
				if ((par.sectId == 0 && (par.connection == 'начало' || par.connection == 'две стороны')) || par.sectId > 0 && ($('#banisterSectionDirection' + (par.sectId - 1)).val() !== 'начало' && $('#banisterSectionDirection' + (par.sectId - 1)).val() == 'две стороны')) {
					var jointParams = {
						rad: 25,
						dxfBasePoint: handrailParams.dxfBasePoint
					}

					var sphere = drawHandrailJoint(jointParams);
					sphere.position.x = pos.x - jointParams.rad;
					sphere.position.y = pos.y + handrailProfileY / 2 - jointParams.rad;
					sphere.position.z = pos.z - handrailProfileZ / 2 - jointParams.rad;
					railingSection.add(sphere);
				}
			}

		} //конец поручня кроме деревянных ограждений

		if (pos) {
			var flanPar = {
				type: handrailPar.handrailModel,
			}

			if (par.flans == "начало" || par.flans == "две стороны") {
				var flan = drawHandrailFlan(flanPar).mesh;
				flan.position.x = pos.x
				flan.position.y = pos.y + handrailProfileY / 2;
				flan.position.z = pos.z - handrailProfileZ / 2;// - flanPar.width / 2;
				if (flanPar.type == 'round') {
					flan.position.y = pos.y;
					flan.position.z = pos.z - handrailProfileZ;
				}
				railingSection.add(flan);
			}

			if (par.flans == "конец" || par.flans == "две стороны") {
				var flan = drawHandrailFlan(flanPar).mesh;
				flan.position.x = pos.x + handrailLength;
				flan.position.y = pos.y + handrailProfileY / 2;
				flan.position.z = pos.z;
				if (flanPar.type == 'round') {
					flan.position.y = pos.y;
					flan.position.z = pos.z - handrailProfileZ;
				}
				railingSection.add(flan);
			}
		}

	}; //конец поручня

	function drawTimberPlatformRailing_nav() { } //пустая функция для навигации

	if (railingModel == "Деревянные балясины" || railingModel == "Стекло" || railingModel == "Дерево с ковкой") {

		var banisterLength = handrailProfileY;

		var botEndLength = 150;
		var rackSize = 95 * 1.0;
		if (params.rackSize != undefined) rackSize = params.rackSize * 1.0;

		railingPositionZ = -rackSize / 2;
		railingPositionY = -150
		var balDist = params.balDist_bal;
		var banisterSize = params.banisterSize_bal;
		var botEndType = params.timberBalBotEnd_bal;
		var topEndType = params.timberBalTopEnd_bal;

		//столбы
		var maxNewellDist = 2000;
		var midRackAmt = Math.ceil(platformLength / maxNewellDist) - 1;
		var rackDist = (platformLength) / (midRackAmt + 1);

		var basePoint = { x: 0, y: railingPositionY, z: railingPositionZ };

		for (var i = 0; i <= midRackAmt + 1; i++) {

			var basePoint = {
				x: rackDist * i + rackSize / 2,
				y: railingPositionY,
				z: railingPositionZ,
			}

			//столб
			if (par.connection == "нет" || par.connection == "конец" || i > 0) {
				var newellParams = {
					type: params.timberNewellType_bal,
					len: params.handrailHeight_bal + 50,
					rackSize: rackSize - 0.02,
					topType: params.newellTopType_bal,
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, basePoint.x, basePoint.y),
					marshId: par.marshId,
					unit: "balustrade",
				}

				var rack = drawTimberNewell_4(newellParams).mesh;
				rack.position.x = basePoint.x - rackSize;
				rack.position.y = basePoint.y;
				rack.position.z = basePoint.z - rackSize / 2;
				railingSection.add(rack);
			}

			//заполнение секции
			var sectLen = (platformLength - rackSize * (midRackAmt + 1)) / (midRackAmt + 1);

			if (i <= midRackAmt) {
				//поручень
				var dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, -300)
				
				var handrailParams = {
					partName: "handrails",
					unit: "balustrade",
					type: handrailModel,
					poleProfileY: handrailProfileY,
					poleProfileZ: handrailProfileZ,
					length: sectLen,
					poleAngle: 0,
					material: handrailMaterial,
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, basePoint.x, basePoint.y),
					dxfArr: dxfPrimitivesArr,
					fixType: "нет",
					side: "out",
					drawing: { group: 'handrails', unit: 'balustrade', pos: basePoint, ang: 0 }
				}
				if (par.sectId == 0 && params.banisterStart != "столб" && i == 0) {
					handrailParams.length -= handrailProfileZ / 2;
				}

				var pole = drawHandrail_4(handrailParams).mesh;
				pole.position.x = basePoint.x;
				pole.position.y = railingPositionY - handrailProfileY + params.handrailHeight_bal;
				pole.position.z = railingPositionZ - handrailParams.wallOffset;
				if (par.sectId == 0 && params.banisterStart != "столб" && i == 0) {
					pole.position.x += handrailProfileZ / 2;
				}
				railingSection.add(pole);
				var balTopY = pole.position.y;


				//нижняя перемычка секции
				dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, -500);

				var poleParams = {
					partName: "botPole",
					unit: "balustrade",
					type: handrailModel,
					poleProfileY: handrailProfileY,
					poleProfileZ: handrailProfileZ,
					length: sectLen,
					poleAngle: 0,
					material: handrailMaterial,
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, basePoint.x, basePoint.y),
					dxfArr: dxfPrimitivesArr,
					fixType: "нет",
					side: "out",
				}

				if (par.sectId == 0 && params.banisterStart != "столб" && i == 0) {
					poleParams.length -= handrailProfileZ / 2;
				}
				var pole = drawHandrail_4(poleParams).mesh;
				pole.position.x = basePoint.x;
				pole.position.y = -150 + 100; //низ 100мм от перекрытия
				if (railingModel == "Деревянные балясины" && botEndType == "квадрат") pole.position.y = -150;
				//pole.position.y = -150 - handrailProfileY-5
				pole.position.z = railingPositionZ - handrailParams.wallOffset;
				if (par.sectId == 0 && params.banisterStart != "столб" && i == 0) {
					pole.position.x += handrailProfileZ / 2;
				}
				railingSection.add(pole);
				var balBotY = pole.position.y + handrailProfileY;

				var balAmt = Math.floor(sectLen / balDist)
				var balsDist = sectLen / (balAmt + 1);
				//балясины
				if (railingModel != "Стекло") {
					var balParams = {
						basePoint: newPoint_xy(basePoint, 0, 0),
						lenX: sectLen,
						ang: 0,
						balLen: balTopY - balBotY,
						balStep: balsDist,
						dxfBasePoint: newPoint_xy(par.dxfBasePoint, basePoint.x, basePoint.y),
						marshId: par.marshId,
						unit: "balustrade",
					}

					var balArr = drawBanistersArr(balParams);

					balArr.position.y = balBotY + 150;
					balArr.position.z = basePoint.z;

					railingSection.add(balArr);
				}

				//стекла
				if (railingModel == "Стекло") {
					var glassDist = 10; //зазор между стеклами
					var glassHeight = balTopY - balBotY + 30;
					//sectLen -= glassDist;
					var sectGlassAmt = Math.ceil((sectLen - glassDist) / 1000);
					if (sectGlassAmt < 1) sectGlassAmt = 1;
					var glassLengthX = (sectLen - glassDist) / sectGlassAmt;
					var p1 = { x: 0, y: 0 }
					var p2 = { x: glassLengthX, y: 0 }
					var x0 = basePoint.x + glassDist;

					for (j = 0; j < sectGlassAmt; j++) {
						var glassShape = drawGlassShape_4(p1, p2, 0, glassDist, glassHeight);
						var geom = new THREE.ExtrudeGeometry(glassShape, glassExtrudeOptions);
						geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
						var glass = new THREE.Mesh(geom, params.materials.glass);
						glass.position.x = x0 + glassLengthX * j;
						glass.position.y = balBotY - 15;
						glass.position.z = -rackSize / 2;
						glass.castShadow = true;
						railingSection.add(glass);
						if (glassShape.articul) glass.specId = glassShape.articul;
					}
				}

			}
		}



		//стартовый узел для первой секции балюстрады при стыковке с ограждением деревянной лестницы
		if (par.sectId == 0 && params.banisterStart != "столб" && params.banisterStart != "нет") {
			//дополнительная балясина
			if (railingModel == "Деревянные балясины_") {
				var insertPoint = newPoint_xy(basePoint, rackSize / 2, 0);
				var banister = drawLatheBanister(banisterLength, banisterSize, botEndType, botEndLength, topEndType, par.timberBalType);
				banister.position.x = insertPoint.x;
				banister.position.y = insertPoint.y;
				if (botEndType == "круг") banister.position.y = banister.position.y + (params.handrailHeight_bal - banisterLength);
				banister.position.z = insertPoint.z;
				railingSection.add(banister);
			}
			//продолждение подбалясинной доски
			poleParams.length = handrailProfileZ + 20;
			poleParams.poleProfileY = handrailProfileY;
			poleParams.poleProfileZ = handrailProfileZ;
			poleParams.partName = "handrails";
			var pole = drawPole3D_4(poleParams).mesh;
			pole.rotation.y = Math.PI / 2;
			pole.position.x = rackSize / 2 - handrailProfileZ / 2;
			pole.position.y = -50;
			if (railingModel == 'Деревянные балясины') pole.position.y = -150;

			pole.position.z = railingPositionZ + handrailProfileZ / 2;
			if (params.banisterStart == "правый угол") {
				pole.rotation.y = -Math.PI / 2;
				pole.position.x = rackSize / 2 + handrailProfileZ / 2;
				pole.position.z = railingPositionZ - handrailProfileZ / 2;
			}
			railingSection.add(pole);

			//продолжение поручня
			poleParams.length = handrailProfileZ + 20;
			poleParams.poleProfileY = handrailProfileY;
			poleParams.poleProfileZ = handrailProfileZ;
			poleParams.partName = "handrails";
			var pole = drawPole3D_4(poleParams).mesh;
			pole.rotation.y = Math.PI / 2;
			pole.position.x = rackSize / 2 - handrailProfileZ / 2;
			pole.position.y = params.handrailHeight_bal - 150 - handrailProfileY;
			if (botEndType == "квадрат") pole.position.y = -150;

			pole.position.z = railingPositionZ + handrailProfileZ / 2;
			if (params.banisterStart == "правый угол") {
				pole.rotation.y = -Math.PI / 2;
				pole.position.x = rackSize / 2 + handrailProfileZ / 2;
				pole.position.z = railingPositionZ - handrailProfileZ / 2;
			}
			railingSection.add(pole);

		}

	}	//конец деревянных балясины

	//подпись
	var text = "Секция " + (par.sectId + 1);
	var textHeight = 30;
	var textBasePoint = newPoint_xy(par.dxfBasePoint, 100, -250)
	addText(text, textHeight, dxfPrimitivesArr, textBasePoint)


	//сохраняем данные для спецификации

	if (railingModel == "Кованые балясины") {

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
					group: "Балюстрада",
				}
			}
			var name = "L=" + Math.round(sectionLength) + " фланц.";
			//if(par.railingSide == "left") name = "L=" + Math.round(sectionLength) + " лев.";
			if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
			if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
			specObj[partName]["amt"] += 1;
			specObj[partName]["sumLength"] += Math.round(sectionLength / 100) / 10;
		}
		railingSection.specId = partName + name;
	}

	return railingSection;

}// end of drawRailingSectionPlatform

function drawHandrailFlan(par) {
	par.mesh = new THREE.Object3D();

	if (par.type == "rect") {
		// var platePar = {
		// 	width: 100,
		// 	len: 100,
		// 	thk: 4,
		// 	holes: [], //массив параметров отверстий - не обазятельный
		// 	partName: "handrailFlan",
		// 	material: params.materials.inox,
		// }
		// par.width = 100;
		// var plate = drawPlate(platePar).mesh;
		// plate.rotation.y = Math.PI / 2;
		// plate.position.y = -platePar.len / 2;
		// plate.position.z = platePar.width / 2;
		// par.mesh.add(plate);
		var rad = 5;
		var thk = 100;
		par.width = rad * 2;
		var geom = new THREE.CylinderGeometry(rad, rad, thk, 30, 4, false);
		geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

		var flan = new THREE.Mesh(geom, params.materials.inox);
		flan.rotation.y = Math.PI / 2;
		flan.position.y = 0;
		flan.position.z = -thk / 2;
		par.mesh.add(flan);
	}


	if (par.type == "round") {
		var rad = 40;
		var thk = 4;
		par.width = 40 * 2;
		var geom = new THREE.CylinderGeometry(rad, rad, thk, 30, 4, false);
		geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

		var flan = new THREE.Mesh(geom, params.materials.inox);
		flan.rotation.y = Math.PI / 2;
		flan.position.y = 0;
		flan.position.z = 0//-thk / 2;
		par.mesh.add(flan);
	}

	return par;
} //end of drawHandrailFlan


