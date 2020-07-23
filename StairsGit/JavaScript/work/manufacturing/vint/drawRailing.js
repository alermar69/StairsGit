function drawRailing(par){
	var railingMesh = new THREE.Object3D();

	var banistrPositionAngle0 = par.treadExtraAngle - calcTriangleParams().treadOverlayAngle / 2 - par.startAngle;
	if (turnFactor == -1) banistrPositionAngle0 = banistrPositionAngle0 - par.stepAngle;

	var railingParams = {
		model: params.railingModel,
		base: "treads",
		//timberMaterial: timberMaterial,
		//metalMaterial: metalMaterial,
		rad: params.staircaseDiam / 2,
		side: "out",
		turnFactor: turnFactor,
		stepHeight: par.stepHeight,
		stairAmt: par.stairAmt,
		banisterPerStep: params.banisterPerStep,
		treadExtraAngle: par.treadExtraAngle,
		staircaseHeight: par.staircaseHeight,

		//stepAngle: stepAngle,
		//treadThickness: treadThickness,
		startAngle: par.startAngle,
		stairType: par.stairType,
	}
	if (params.stairType == 'рамки') railingParams.rad -= params.nose

	if (params.model != "Винтовая") railingParams.base = "stringer";

	//ограждение по внешней стороне
	if (params.railingSide == "внешнее" || params.railingSide == "две") {
		railingParams = drawSpiralRailing(railingParams);
		var sect = railingParams.mesh;
		var rigels = railingParams.rigels;
		var handrail = railingParams.handrail;
		sect.rotation.y = rigels.rotation.y = handrail.rotation.y = -banistrPositionAngle0;

		railingMesh.add(sect);//, "railing");
		railingMesh.add(rigels);//, "railing");
		railingMesh.add(handrail);//, "handrails");
	}

	//ограждение по внутренней стороне
	if (params.railingSide == "внутреннее" || params.railingSide == "две") {
		railingParams.rad -= params.M;
		railingParams.side = "in";
		railingParams.banisterPerStep = 1;
		railingParams = drawSpiralRailing(railingParams);
		var sect = railingParams.mesh;
		var rigels = railingParams.rigels;
		var handrail = railingParams.handrail;
		sect.rotation.y = rigels.rotation.y = handrail.rotation.y = -banistrPositionAngle0;

		railingMesh.add(sect);//, "railing");
		railingMesh.add(rigels);//, "railing");
		railingMesh.add(handrail);//, "handrails");
	}

	return railingMesh;
}

function drawPlatformRailing(par){
	var platformRailing = new THREE.Object3D();
	specObj = partsAmt_bal; //задаем объект, куда будут сохраняться данные для спецификации

	var sectionLength = params.platformSectionLength;

	var sectionTyrnAngle = (par.platformAngle / 2 - par.platformExtraAngle + Math.PI) * turnFactor;
	if (params.platformType == "square") sectionTyrnAngle = Math.PI / 2 * turnFactor + Math.PI;

	var balSectionParams = {
		platformLength: sectionLength - 20, //20 - смещение на столбе
		offsetStart: 0,
		offsetEnd: -20, //смещение на столбе
		handrailOffsetStart: 70,
		handrailOffsetEnd: 30,
		railingSide: "right",
		railingModel: params.railingModel_bal,
		//handrail: handrail,
		type: "секция площадки",
		sectionNumber: 1,
		startConnection: "нет",
		angleStart: 0,
		angleEnd: 0,
		connection: "нет", //параметр для деревянных столбов
		dxfBasePoint: {
			x: 0,
			y: 3000
		},
	}
	if (params.railingModel_bal == "Ригели" || params.railingModel_bal == "Стекло на стойках") {
		balSectionParams.handrailOffsetEnd += 40; //размер стойки
	}
	if (params.railingModel_bal == "Самонесущее стекло") {
		// balSectionParams.offsetStart = 0;
		// balSectionParams.offsetEnd = 4.5;
		balSectionParams.handrailOffsetStart = 0;
		balSectionParams.handrailOffsetEnd = 0;
	}

	var railingSection = drawBalSection(balSectionParams); //функция в файле drawBalSect_man_4.0.js
	railingSection.rotation.y = sectionTyrnAngle;
	
	
	var offsetX = 40 / 2;
	var offsetZ = 40 / 2;

	if (params.railingModel_bal == "Ригели" || params.railingModel_bal == "Экраны лазер" || params.railingModel_bal == "Стекло на стойках") offsetX = 0;
	if (params.railingModel_bal == "Деревянные балясины" || params.railingModel_bal == "Стекло" || params.railingModel_bal == "Дерево с ковкой") {
		offsetX = 0;
		offsetZ = 95 / 2
	}
	if (params.railingModel_bal == "Самонесущее стекло") {
		railingSection.rotation.y = sectionTyrnAngle;
		if (turnFactor == 1) offsetZ = - 95 / 2;
		if (turnFactor == -1) offsetZ = 95;
		offsetZ = 50 / 2;
	}

	translateObject(railingSection, offsetX, 150 + par.stepHeight * (par.stairAmt + 1) + par.regShimAmt * par.regShimThk, offsetZ);

	if (!testingMode) {
		platformRailing.add(railingSection);//, "railing");
	}

	//замыкание поручня на площадке
	if (params.pltHandrailConnection == 'есть'){
		var railingPar = {
			lengthHandrail: par.vintPlatformParams.lengthConnection,
			dxfBasePoint: balSectionParams.dxfBasePoint,
		}

		
		var railingSection1 = drawRailingConnectionPlatform(railingPar).mesh;
		if (par.vintPlatformParams.pointRack) {
			railingSection1.position.y = 150 + par.stepHeight * (par.stairAmt + 1) + par.regShimAmt * par.regShimThk;
			railingSection1.position.x = -par.vintPlatformParams.pointRack.y;
			railingSection1.position.z = -par.vintPlatformParams.pointRack.x * turnFactor;


			if (!testingMode) {
				platformRailing.add(railingSection1);//, "railing");
			}
		}
	}

	return platformRailing;
}

function drawSpiralRailing(par) {

	var stepHeight = par.stepHeight;
	var banistrPositionAngle0 = 0;
	var rad = par.rad;
	var turnFactor = par.turnFactor;
	var stepHeight = par.stepHeight;
	var stairAmt = par.stairAmt;
	var banisterPerStep = par.banisterPerStep;
	var treadExtraAngle = par.treadExtraAngle;
	var regShimThk = 4

	var stairType = "timber";
	if (params.stairType == "рифленая сталь" || params.stairType == "лотки под плитку") stairType = "metal";


	var railingSection = new THREE.Object3D();
	var handrail = new THREE.Object3D();
	var rigels = new THREE.Object3D();

	var railingHeight = 900; //номинальная высота ограждения в начале ступени
	var glassMaterial = new THREE.MeshLambertMaterial({
		opacity: 0.6,
		color: 0x3AE2CE,
		transparent: true
	});
	glassMaterial.side = THREE.DoubleSide;

	//переводим углы в радианы
	var stepAngle = params.stepAngle / 180 * Math.PI;
	var platformAngle = platformAngle / 180 * Math.PI;

	if (params.railingModel == "Частые стойки") {
		var railingLift = 0;

		/*Параметры стоек*/
		var banisterProfileSize = 20;
		var banisterBottomOverhang = 36; //выступ балясини ниже нижней поверхности ступени
		var botLedge = banisterBottomOverhang + params.treadThickness; //выступ балясины ниже верхней поверхности ступени
		/*
			if(par.base == "stringer") {
				//banisterBottomOverhang -= 50;
				//botLedge -= 100;
				}
		*/

		var railingHeight = 900; //номинальная высота ограждения в начале ступени
		var banisterHoleDist = []; //расстояние между отверстиями для уголков на балясинах

		//стартовая балясина
		var startBanisterLength = railingHeight + stepHeight;
		banisterHoleDist[0] = stairParams.stepHeight - params.treadThickness - 31 + 2;

		//if (botFloorType == "черновой") {
		//	startBanisterLength += params.botFloorsDist;
		//	banisterHoleDist[0] += params.botFloorsDist;
		//}
		stairParams.startBanisterLength = startBanisterLength;

		var banisterPositionRad = params.staircaseDiam / 2 + 0.1;
		
		//длинные балясины
		var longBanisterLength = railingHeight + stepHeight + botLedge;
		stairParams.longBanisterLength = longBanisterLength;
		banisterHoleDist[1] = stairParams.stepHeight + 2;

		//	var banistrPositionAngle0 = par.treadExtraAngle - par.treadOverlayArcAngle/2 - par.startAngle;
		//	if(turnFactor == -1) banistrPositionAngle0 = banistrPositionAngle0 - stepAngle;


		var dxfBasePoint = {
			x: 0,
			y: 1000
		}
		var balParams = {
			balMaterial: params.materials.metal,
			angMaterial: params.materials.metal2,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: dxfBasePoint,
			size: banisterProfileSize,
			length: startBanisterLength,
			holeDst: 100,
			topHole: "yes",
			type: "first",
			angleShift: 0,
			text: "Первая балясина"
		}
		
		//if (params.botFloorType == 'черновой') balParams.length += params.botFloorsDist;

		//сохраняем размеры для спецификации
		stairParams.banisterHoleDist = banisterHoleDist;

		/*Длинные стойки ограждений*/

		addVintLongBanisters();

		function addVintLongBanisters() {


			var banistrPositionAngle;


			//первая балясина
			balParams.holeDst = banisterHoleDist[0];
			//if (params.botFloorType == 'черновой') balParams.holeDst += params.botFloorsDist;
			balParams.angleShift = 2;
			if (regShimAmt > 0) balParams.angleShift = 2;
			if (par.stairType == "metal") balParams.angleShift = -2;
			balParams = drawBal(balParams);

			var startBanister = balParams.mesh;
			banistrPositionAngle = banistrPositionAngle0;
			startBanister.rotation.y = -banistrPositionAngle - Math.PI / 2;
			startBanister.position.x = banisterPositionRad * Math.cos(banistrPositionAngle);
			startBanister.position.y = 0;
			//if (params.botFloorType == "черновой") startBanister.position.y = -params.botFloorsDist;
			startBanister.position.z = banisterPositionRad * Math.sin(banistrPositionAngle);
			startBanister.castShadow = true;
			//railing.push(startBanister);
			railingSection.add(startBanister);

			//остальные балясины
			balParams.length = longBanisterLength;
			balParams.holeDst = banisterHoleDist[1];
			balParams.type = "longBal";
			balParams.text = "Длинные балясины";
			balParams.dxfBasePoint = {
				x: 750,
				y: 1000
			}

			posY = stepHeight - params.treadThickness - banisterBottomOverhang;
			for (var i = 1; i < stairAmt + 1; i++) {
				var shimDelta = 0;
				//учитываем регулировочную шайбу
				balParams.angleShift = -2;
				if (i <= params.regShimAmt) {
					//if (par.stairType != "metal") posY += regShimThk;
					posY += regShimThk;
					if (i != params.regShimAmt) balParams.angleShift = 2;
					if (par.stairType == 'metal') {
						shimDelta = -regShimThk;
						if (i == params.regShimAmt) {
							balParams.angleShift = 2;
						}
					};
				}

				balParams = drawBal(balParams);
				var longBanister = balParams.mesh;
				//banistrPositionAngle = (-stepAngle * i * turnFactor + banistrPositionAngle0);
				banistrPositionAngle = (-stepAngle * i * turnFactor + banistrPositionAngle0);
				longBanister.rotation.y = -banistrPositionAngle - Math.PI / 2;
				longBanister.position.x = (banisterPositionRad) * Math.cos(banistrPositionAngle);
				longBanister.position.y = posY + shimDelta - 0.1;
				longBanister.position.z = banisterPositionRad * Math.sin(banistrPositionAngle);
				longBanister.castShadow = true;
				//railing.push(longBanister);
				railingSection.add(longBanister);
				balParams.dxfArr = []; //выводим в dxf только одну балясину	
				posY += stepHeight;
			}


		}


		/*короткие стойки ограждений*/

		if (banisterPerStep > 1) addVintShortBanisters();

		function addVintShortBanisters() {

			var shortBanisterPerStep = banisterPerStep - 1;
			var banisterExtraLength = stepHeight / banisterPerStep;
			balParams.dxfBasePoint = {
				x: 1300,
				y: 1000
			}
			balParams.text = "Промежуточные балясины";
			stairParams.shortBanisterLength = [];

			//добавляем балясины
			for (var j = 0; j < shortBanisterPerStep; j++) {
				var shortBanisterLength = longBanisterLength - stepHeight + banisterExtraLength * (j + 1);
				if (turnFactor == -1)
					shortBanisterLength = longBanisterLength - stepHeight + banisterExtraLength * (shortBanisterPerStep - j);
				if (par.base == "stringer") shortBanisterLength = longBanisterLength;
				var geom = new THREE.BoxGeometry(banisterProfileSize, shortBanisterLength, banisterProfileSize);
				//var banistrPositionAngle1 = par.treadExtraAngle - par.treadOverlayArcAngle/2 - stepAngle/banisterPerStep * (j + 1) - par.startAngle;
				//banistrPositionAngle1  = banistrPositionAngle1 * turnFactor;
				//var banisterPositionRad = params.staircaseDiam/2 //+ banisterProfileSize/2;
				var banistrPositionAngle1 = -stepAngle / banisterPerStep * (j + 1) * turnFactor

				balParams.length = shortBanisterLength;
				balParams.type = "middle";
				if (par.base == "stringer") balParams.type = "longBal";
				if (par.base == "stringer") balParams.base = "stringer";
				balParams.dxfArr = dxfPrimitivesArr; //выводим каждую промежуточную балясину по одному разу
				balParams.dxfBasePoint.x += 200;

				posY = stepHeight - params.treadThickness - banisterBottomOverhang;
				if (par.base == "stringer") posY -= stepHeight / (shortBanisterPerStep + 1) * (j + 1);
				if (par.base == "stringer") balParams.holeOffset = stepHeight / (shortBanisterPerStep + 1) * (j + 1);
				for (var i = 0; i < stairAmt; i++) {
					var shimDelta = 0;
					//учитываем регулировочную шайбу
					balParams.angleShift = -2;
					if (i < params.regShimAmt) {
						//if (par.stairType != "metal") posY += regShimThk;
						posY += regShimThk;
						if (i != params.regShimAmt) balParams.angleShift = 2;
						if (par.stairType == 'metal') shimDelta = -regShimThk;
					}

					balParams = drawBal(balParams);
					var middleBanister = balParams.mesh;
					var banistrPositionAngle = -stepAngle * i * turnFactor + banistrPositionAngle1;
					middleBanister.rotation.y = -banistrPositionAngle - Math.PI / 2;
					middleBanister.position.x = banisterPositionRad * Math.cos(banistrPositionAngle);
					middleBanister.position.y = posY + shimDelta - 0.1;
					middleBanister.position.z = banisterPositionRad * Math.sin(banistrPositionAngle);
					middleBanister.castShadow = true;
					//railing.push(middleBanister);
					railingSection.add(middleBanister);
					balParams.dxfArr = []; //выводим только первую балясину
					balParams.text = "";
					posY += stepHeight;
				}
				//сохраняем размер для спецификации
				stairParams.shortBanisterLength.push(shortBanisterLength);
			}
		}

	} //конец частых стоек


	/*стойки для ограждений с ригелями или стеклом на стойках*/

	if (par.model == "Ригели" || par.model == "Стекло на стойках") {
		var isBolz = false;
		if (params.model !== "Винтовая с тетивой") isBolz = true;

		//var banistrPositionAngle0 = treadExtraAngle - calcTriangleParams().treadOverlayAngle / 2 - par.startAngle;
		//if (turnFactor == -1) banistrPositionAngle0 = banistrPositionAngle0 - stepAngle;

		//считаем длину ограждения
		par.railingLength = Math.sqrt((stepAngle * rad) * (stepAngle * rad) + stepHeight * stepHeight) * stairAmt;
		var rackAmt = Math.ceil(par.railingLength / 900) + 1;
		var topRackOffset = 0.3;
		if (isBolz) topRackOffset = 0; 
		var rackAngleDist = stepAngle * (stairAmt - topRackOffset) / (rackAmt - 1);
		var rackDistY = stepHeight * (stairAmt - topRackOffset) / (rackAmt - 1);
		var banisterProfileSize = 40;
		var longBanisterLength = railingHeight + 150;
		
		var banisterPositionRad = rad + 0.1;
		if (par.side == "in") banisterPositionRad = rad - banisterProfileSize - 0.1;
		if (isBolz) banisterPositionRad -= banisterProfileSize + 5

		// если есть больцы, определяем на каких ступенях будут стоять стойки
		if (isBolz) {
			var stepRack = 2;
			var rackAmt = Math.ceil((stairAmt + 1) / stepRack);
			var racksPos = [1];
			for (var i = 1; i <= rackAmt - 2; i++) {
				var pos = stepRack * i + 1;
				if (stairAmt + 1 - pos > 1) racksPos.push(pos);
			}
			racksPos.push(stairAmt+1);

			rackAmt = racksPos.length;
		}

		//var banisterPositionRad = params.staircaseDiam / 2 + 0.1;

		var dxfBasePoint = { x: 0, y: 1000 }

		var rackParams = {
			len: longBanisterLength,
			railingSide: "",
			showPins: true,
			showHoles: true,
			isBotFlan: false,
			material: params.materials.metal_railing,
			dxfBasePoint: dxfBasePoint,
			dxfArr: dxfPrimitivesArr,
			realHolder: true, //точно отрисовываем кронштейн поручня
			sectText: '',
			marshId: 1,
			key: "out",
		}

		if (isBolz) {
			rackParams.showPins = false;
			rackParams.showHoles = false;
		}

		//угол верхнего кронштейна
		var stepLen = Math.PI * par.rad * params.stepAngle / 180;		
		rackParams.holderAng = -Math.atan(stairParams.stepHeight / stepLen)

		var modelTemp = params.model;
		params.model = 'лт';
		for (var i = 0; i < rackAmt; i++) {
			var dy = 0;
			if (i == 0) {
				dy = 40;
				if (isBolz) dy = -regShimThk * 2;
			}
			if (i != 0) dy = 0

			if (isBolz) {
				dy += stepHeight + 60 + 4;
				if (stairType != "metal" && (racksPos[i] - 1) < params.regShimAmt) {
					dy -= regShimThk * 2;
				}
			}

			rackParams.len = longBanisterLength - dy;

			rackParams = drawRack3d_4(rackParams);

			var rack = rackParams.mesh;
			banistrPositionAngle = -rackAngleDist * i * turnFactor;
			if (isBolz) {
				banistrPositionAngle = -stepAngle * (racksPos[i] - 1) * turnFactor;
			}
			rack.position.x = banisterPositionRad * Math.cos(banistrPositionAngle);
			rack.position.y = rackDistY * i + 50 + dy;
			if (isBolz) rack.position.y = stepHeight * (racksPos[i] - 1) + 50 + dy;
			//if (i == 0) rack.position.y += 40;
			rack.position.z = banisterPositionRad * Math.sin(banistrPositionAngle);
			rack.rotation.y = Math.PI / 2 - banistrPositionAngle;
			rack.castShadow = true;
			railingSection.add(rack);
		}
		params.model = modelTemp;

		/*больцы*/
		if (isBolz) {
			var triangleParams = calcTriangleParams();
			var bolzPar = {
				marshId: 1,
				dxfBasePoint: { x: 5000, y: 0, },
				h: stepHeight,
				bolzProfile: 40,
				isRack: false,
				isPlateTread: params.stairType != 'рамки',
				lenPlateTread: 2 * rad * Math.sin(triangleParams.treadAngle / 2) - 17.5,
				angPlateTread: (triangleParams.treadAngle - triangleParams.treadOverlayAngle) / 2
			}

			var rad = par.rad - bolzPar.bolzProfile - 5;

			//отрисовывамем больц
			var posY = 0;
			for (var i = 0; i < stairAmt + 1; i++) {
				var mesh = new THREE.Object3D();
				var mesh1 = new THREE.Object3D();

				bolzPar.h = stepHeight;

				var ang = -stepAngle * i * turnFactor;

				bolzPar.regShimThk = 0;
				if (stairType != "metal" && i <= params.regShimAmt) {
					//if (i !== params.regShimAmt) bolzPar.h += regShimThk;
					if (i !== params.regShimAmt) bolzPar.regShimThk = regShimThk;
					if (i > 0) posY += regShimThk;
				}

				if (params.stairType == 'рамки') {
					bolzPar.regShimThk = 4;
					bolzPar.frameThicknessFix = 4;
					if ( i > params.regShimAmt) bolzPar.h -= regShimThk;
					if ( i == (params.regShimAmt + 1)) {
						posY += regShimThk;
					}
				}

				bolzPar.isFirst = false;
				bolzPar.isRack = false;

				if (i == 0 && params.strightMarsh != "есть") {
					bolzPar.isFirst = true;
				}

				if (i == stairAmt) {
					bolzPar.isPlateTread = false;
				}

				if (racksPos.indexOf(i+1) !== -1) {
					bolzPar.isRack = true;
				}

				var bolz = drawBolz(bolzPar).mesh;
				bolz.position.x = -20;
				mesh1.add(bolz);

				mesh1.position.x = rad * Math.cos(ang);
				mesh1.position.z = rad * Math.sin(ang);
				if (turnFactor == -1) {
					mesh1.position.x += 40 * Math.cos(ang);
					mesh1.position.z += 40 * Math.sin(ang);
				}
				mesh1.rotation.y = Math.PI / 2*turnFactor - ang;
				mesh.add(mesh1);

				mesh.position.y = posY;
				mesh.castShadow = true;
				railingSection.add(mesh);

				posY += stepHeight;
				if (stairType == "metal" && i < params.regShimAmt) posY += regShimThk;
			}
		}


		//уголки для крепления ступеней
		if (params.railingModel == "Частые стойки") {
		//if (params.railingModel == "Частые стойки" || params.model != "Спиральная (косоур)") {
			var angleGap = 0.1; //зазор чтобы проходили тесты
			var angleParams = {
				material: params.materials.metal2,
				dxfArr: [],
			}

			var banisterBottomOverhang = 36; //выступ балясини ниже нижней поверхности ступени

			var anglePositionRad = banisterPositionRad;
			if (par.side == "in") anglePositionRad += banisterProfileSize
			var banistrPositionAngle;

			posY = stepHeight - params.treadThickness - banisterBottomOverhang;

			for (var i = 0; i < stairAmt; i++) {
				var shimDelta = 0;
				//учитываем регулировочную шайбу
				if (i <= params.regShimAmt) {
					posY += regShimThk;
					if (par.stairType == 'metal') shimDelta = -regShimThk;
				}

				angleParams = drawBanisterAngle(angleParams);
				var angle = angleParams.mesh;

				banistrPositionAngle = (-stepAngle * i * turnFactor);
				angle.rotation.y = -banistrPositionAngle - Math.PI / 2;
				if (par.side == "in") angle.rotation.y = -banistrPositionAngle + Math.PI / 2;
				angle.position.x = anglePositionRad * Math.cos(banistrPositionAngle);
				angle.position.y = posY + shimDelta - 0.1 + 20 - angleParams.holeOffset;
				angle.position.z = anglePositionRad * Math.sin(banistrPositionAngle) + 0.1;
				angle.castShadow = true;
				railingSection.add(angle);
				//--------------------------------------------

				angleParams = drawBanisterAngle(angleParams);
				var angle = angleParams.mesh;
				banistrPositionAngle = (-stepAngle * (i + 1) * turnFactor + banistrPositionAngle0);
				angle.rotation.y = -banistrPositionAngle - Math.PI / 2;
				if (par.side == "in") angle.rotation.y = -banistrPositionAngle + Math.PI / 2;
				angle.position.x = (anglePositionRad) * Math.cos(banistrPositionAngle);
				angle.position.y = posY + shimDelta - 0.1 + 20 - angleParams.holeOffset;
				angle.position.z = anglePositionRad * Math.sin(banistrPositionAngle);
				angle.castShadow = true;
				railingSection.add(angle);

				//-----------------------------------


				angleParams = drawBanisterAngle(angleParams);
				var angle = angleParams.mesh;
				var banistrPositionAngle = -stepAngle * i * turnFactor - stepAngle / 2 * turnFactor;
				angle.rotation.y = -banistrPositionAngle - Math.PI / 2;
				if (par.side == "in") angle.rotation.y = -banistrPositionAngle + Math.PI / 2;
				angle.position.x = anglePositionRad * Math.cos(banistrPositionAngle);
				angle.position.y = posY + shimDelta - 0.1 + 20 - angleParams.holeOffset;
				angle.position.z = anglePositionRad * Math.sin(banistrPositionAngle);
				angle.castShadow = true;
				railingSection.add(angle);

				posY += stepHeight;
			}

		} //конец частых стоек
	}

	/*ригели*/
	if (par.model == "Ригели") {
		var rigelRad = 6;

		var rigelParams = {
			poleType: "round",
			poleSize: rigelRad * 2,
			poleRad: rad - rigelRad,
			posY: 0,
			model: par.model,
			material: params.materials.metal,
			startOffset: 0.1,
			endOffset: -0.3,
			partName: "spiralRigel",
			material: params.materials.inox,
		}
		if (par.side == "in") {
			rigelParams.poleRad = rad + rigelRad;
			rigelParams.endOffset = -0.1;
		}
		for (var i = 0; i < params.rigelAmt * 1.0; i++) {
			rigelParams.posY = (longBanisterLength - 200) * (i + 1) / (params.rigelAmt * 1.0 + 1) + 150;
			rigels.add(drawVinPole(rigelParams));
		}
	}

	//стекло на стойках

	if (par.model == "Стекло на стойках") {
		var glassHeight = 650;
		var stringerExtraStep = 0.5;
		var glassOffset = 40;
		var angleGlassOffset = glassOffset / banisterPositionRad;
		var glassAngle = rackAngleDist - 2 * angleGlassOffset;
		var glassDeltaY = rackDistY * glassAngle / rackAngleDist;

		var glassParams = {
			rad: banisterPositionRad,
			height: glassDeltaY,
			stripeWidth: glassHeight,
			angle: glassAngle,
			botHeight: glassHeight,
			topHeight: glassHeight,
			turnFactor: turnFactor,
			material: glassMaterial,
		}

		for (var i = 0; i < rackAmt - 1; i++) {
			glassParams = drawSpiralStripe(glassParams);
			var glass = glassParams.mesh;
			glass.rotation.x = -Math.PI / 2;
			glass.rotation.z = (angleGlassOffset + rackAngleDist * i) * turnFactor;
			glass.position.y = railingHeight - glassHeight + 50 + rackDistY * i;
			railingSection.add(glass);
		}
	}
	
	if (par.model == "Самонесущее стекло") {

		//считаем длину ограждения
		par.railingLength = Math.sqrt((stepAngle * rad) * (stepAngle * rad) + stepHeight * stepHeight) * stairAmt;
		var rackAmt = Math.ceil(par.railingLength / 900) + 1;
		var topRackOffset = 0.3;
		var rackAngleDist = stepAngle * (stairAmt - topRackOffset) / (rackAmt - 1);
		var rackDistY = stepHeight * (stairAmt - topRackOffset) / (rackAmt - 1);
		var banisterProfileSize = 40;
		var longBanisterLength = railingHeight + 150;
		var banisterPositionRad = rad + banisterProfileSize / 2 + 2;
		if (par.side == "in") banisterPositionRad = rad - banisterProfileSize / 2 - 2;

		var glassHeight = 1200;
		var glassOffset = 5;
		var angleGlassOffset = glassOffset / banisterPositionRad;
		var glassAngle = rackAngleDist - 2 * angleGlassOffset;
		var glassDeltaY = rackDistY * glassAngle / rackAngleDist;

		var glassParams = {
			rad: banisterPositionRad,
			height: glassDeltaY,
			stripeWidth: glassHeight,
			angle: glassAngle,
			botHeight: glassHeight,
			topHeight: glassHeight,
			turnFactor: turnFactor,
			material: glassMaterial,
		}

		for (var i = 0; i < rackAmt - 1; i++) {
			glassParams = drawSpiralStripe(glassParams);
			var glass = glassParams.mesh;
			glass.rotation.x = -Math.PI / 2;
			glass.rotation.z = (angleGlassOffset + rackAngleDist * i) * turnFactor;
			glass.position.y = -100 + rackDistY * i;
			railingSection.add(glass);
		}


	}


	//поручень

	var handrailParams = {
		poleType: "round",
		poleSize: 50,
		poleRad: banisterPositionRad,
		posY: longBanisterLength,
		model: par.model,
		material: params.materials.handrail,
		staircaseHeight: par.staircaseHeight,
		startOffset: 0.25,
		endOffset: 0.25,
		partName: "spiralHandrail",
	}
	if (par.model == "Частые стойки") {
		handrailParams.poleRad += 10;
		//handrailParams.posY += 20 / Math.cos((stairAmt + 1.5) * stepAngle) + 15;
		handrailParams.posY += 20;
	}
	if (par.model != "Частые стойки") {
		handrailParams.startOffset = 0.25;
		handrailParams.endOffset = 0.1;
	}
	if (par.model == "Ригели" || par.model == "Стекло на стойках") {
		handrailParams.posY += 50;
		handrailParams.poleRad += 20;
	}

	if (handrailMaterial == "Нержавейка" || handrailMaterial == "Алюминий")
		handrailParams.material = params.materials.metal;

	handrail.add(drawVinPole(handrailParams));






	function drawVinPole(par) {

		var stairAmt = params.stepAmt - 1;
		if (params.platformPosition == "ниже") stairAmt = params.stepAmt - 2;
		var banisterBottomOverhang = 36; //выступ балясини ниже нижней поверхности ступени
		var botLedge = banisterBottomOverhang + params.treadThickness; //выступ балясины ниже верхней поверхности ступени

		var startAngle = 0;
		var endAngle = 0;
		/*координаты верхних точек балЯсин*/
		var handrailPoints = [];
		for (var i = 0; i < stairAmt + 1; i++) {
			banistrPositionAngle = -stepAngle * i * turnFactor + banistrPositionAngle0;
			var p1_x = par.poleRad * Math.cos(banistrPositionAngle);
			var p1_y = par.posY + stepHeight * i - params.treadThickness - banisterBottomOverhang;
			if (par.model != "Частые стойки") p1_y = par.posY + stepHeight * i
			var p1_z = par.poleRad * Math.sin(banistrPositionAngle);

			//выступ за первую стойку
			if (i == 0) {
				var j = -par.startOffset
				banistrPositionAngle = -stepAngle * j * turnFactor + banistrPositionAngle0;
				var p0_x = par.poleRad * Math.cos(banistrPositionAngle);
				var p0_y = par.posY + stepHeight * j - params.treadThickness - banisterBottomOverhang;
				if (par.model != "Частые стойки") p0_y = par.posY + stepHeight * j;
				var p0_z = par.poleRad * Math.sin(banistrPositionAngle);
				handrailPoints.push(new THREE.Vector3(p0_x, p0_y, p0_z));
				startAngle = banistrPositionAngle;
			}
			//остальные стойки
			handrailPoints.push(new THREE.Vector3(p1_x, p1_y, p1_z));
			//выступ за последнюю стойку
			if (i == stairAmt) {
				var j = i + par.endOffset;
				banistrPositionAngle = -stepAngle * j * turnFactor + banistrPositionAngle0;
				var p0_x = par.poleRad * Math.cos(banistrPositionAngle);
				var p0_y = par.posY + stepHeight * j - params.treadThickness - banisterBottomOverhang
				if (par.model != "Частые стойки") p0_y = par.posY + stepHeight * j;
				var p0_z = par.poleRad * Math.sin(banistrPositionAngle);
				handrailPoints.push(new THREE.Vector3(p0_x, p0_y, p0_z));
				endAngle = banistrPositionAngle;
			}
		}
		var handrailSpline = new THREE.CatmullRomCurve3(handrailPoints);
		
		
		var shape = new THREE.Shape();
		shape.absarc(0, 0, par.poleSize / 2, 0, 2 * Math.PI, true)

		var extrudeSettings = {
			steps: 200,
			bevelEnabled: false,
			extrudePath: handrailSpline
		};
	
		var geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
		var handrail = new THREE.Mesh(geometry, par.material);

		// var pts = [], count = 4;
		// for ( var i = 0; i < count; i ++ ) {
		// 	var l = 40;
		// 	var a = 2 * i / count * Math.PI;
		// 	pts.push( new THREE.Vector2( Math.cos( a ) * l, Math.sin( a ) * l ) );
		// }

		// var shape = new THREE.Shape( pts );
		// var geometry = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );
		// var material = new THREE.MeshLambertMaterial( { color: 0xb00000, wireframe: false } );
		// var handrail = new THREE.Mesh( geometry, material );

		//поднимаем поручень для контроля длины балясина
		handrail.position.y += 20;
		var mesh = new THREE.Object3D();
		mesh.add(handrail);

		//рассчитываем длину
		var sumLen = 0;
		for (var i = 0; i < handrailPoints.length - 1; i++) {
			sumLen += distance3d(handrailPoints[i], handrailPoints[i + 1]);
		}
		sumLen += 600; //Учитываем обрезаемые хвостовики

		if (params.handrailMaterial == 'ПВХ' && par.partName !== "spiralRigel") {
			var plugParams = {
				id: "stainlessPlug_pvc",
				width: 50,
				height: 50,
				description: "Заглушка поручня",
				group: "Поручни",
				isCirclePlug: true,
				type: "ПВХ",
			}
			var plug = drawPlug(plugParams);
			plug.position.x = handrailPoints[0].x;
			plug.position.y = handrailPoints[0].y;
			plug.position.z = handrailPoints[0].z;
			// plug.rotation.x = Math.PI / 2;
			// plug.rotation.y = startAngle;
			// plug.rotation.z = 0;
			if(!testingMode) mesh.add(plug);

			var plug = drawPlug(plugParams);
			plug.position.x = handrailPoints[handrailPoints.length - 1].x;
			plug.position.y = handrailPoints[handrailPoints.length - 1].y;
			plug.position.z = handrailPoints[handrailPoints.length - 1].z;
			// plug.rotation.x = Math.PI / 2;
			// plug.rotation.y = endAngle;
			// plug.rotation.z = 0;
			if(!testingMode) mesh.add(plug);
		}

		//сохраняем данные для спецификации
		var partName = par.partName;
		if (params.handrailMaterial == "ПВХ" && partName !== "spiralRigel") partName = "pvcHandrail"
		if (typeof specObj != 'undefined') {
			if (!specObj[partName]) {
				specObj[partName] = {
					types: {},
					amt: 0,
					area: 0,
					paintedArea: 0,
					sumLength: 0,
					name: "Спиральный поручень " + params.handrailMaterial,
					metalPaint: false,
					timberPaint: false,
					division: "metal",
					workUnitName: "sumLength", //единица измерения
					group: "spiral_handrails",
				}
				if (params.handrailMaterial == "Дуб") {
					specObj[partName].division = "timber";
					specObj[partName].timberPaint = true;
				}
				if (params.handrailMaterial == "ПВХ") {
					specObj[partName].name += " цвет " + params.handrailColor;
					specObj[partName].division = "metal";
					specObj[partName].timberPaint = false;
				}
				if (partName == "spiralRigel") {
					specObj[partName].name = "Спиральный ригель";
					specObj[partName].division = "metal";
					specObj[partName].timberPaint = false;
				}
			}
			
			//рассчитываем кол-во кусков исходя из максимальной длины куска
			var maxLen = 3000;
			if(partName == "spiralRigel") maxLen = 6000;
			var partsAmt_l = Math.ceil(sumLen / maxLen);
			
			//рассчитываем кол-во кусков с учетом максимальной высоты стапеля
			var maxHeight = 1800;
			var partsAmt_h = Math.ceil(par.staircaseHeight / maxHeight);
			
			var polePartsAmt = Math.max(partsAmt_l, partsAmt_h);
			
			var partLen = Math.round(sumLen / polePartsAmt)
			
			var name = " L=" + partLen;
			if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += polePartsAmt;
			if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = polePartsAmt;
			specObj[partName]["amt"] += polePartsAmt;
			specObj[partName]["sumLength"] += sumLen / 1000;

		}
		mesh.specId = partName + name;

		if (polePartsAmt > 1  && par.partName !== "spiralRigel") {
			for (var i = 0; i < polePartsAmt - 1; i++) {
				var pos = Math.floor(handrailPoints.length / polePartsAmt) * (i + 1);
				if (params.handrailMaterial == 'ПВХ') {
					var ring = drawHandrailRing();
					ring.position.x = handrailPoints[pos].x;
					ring.position.y = handrailPoints[pos].y;
					ring.position.z = handrailPoints[pos].z;
					ring.rotation.x = Math.PI / 2;
					if(!testingMode) mesh.add(ring);
				}
				if(params.handrailMaterial == 'Дуб'){
					var bolt = drawHandrailZipBolt();
					bolt.position.x = handrailPoints[pos].x;
					bolt.position.y = handrailPoints[pos].y;
					bolt.position.z = handrailPoints[pos].z;
					bolt.rotation.x = Math.PI / 2;
					if (!testingMode) mesh.add(bolt);

					
					var plug = drawTimberPlug(25);
					plug.position.x = handrailPoints[pos].x;
					plug.position.y = handrailPoints[pos].y;
					plug.position.z = handrailPoints[pos].z;
					plug.rotation.x = Math.PI / 2;
					if (!testingMode) mesh.add(plug);
				}
			}
		}

		return mesh;

	} //end of drawVinPole()

	par.mesh = railingSection;
	par.handrail = handrail;
	par.rigels = rigels;


	return par;

}; //end of drawSpiralRailing

function drawHandrailZipBolt(){
	var material = params.materials.inox;

	var geometry = new THREE.CylinderGeometry( 5, 5, 30, 32 );
	var ring = new THREE.Mesh(geometry, material);

	var partName = "zipBolt"
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Зип-болт прямой",
				metalPaint: false,
				timberPaint: false,
				isModelData: true,
				division: "stock_1",
				workUnitName: "amt",
				group: "Поручни",
				purposes: ["Соединение поручня на лестнице"]
			}
		}
		var name = 0;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}

	ring.specId = partName;	
	ring.setLayer("metis");

	return ring;
}

function drawHandrailRing(){
	var material = params.materials.inox;

	var geometry = new THREE.CylinderGeometry( 30, 30, 10, 32 );
	var ring = new THREE.Mesh(geometry, material);

	var partName = "handrailRing_model";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Кольцо для поручня ПВХ",
				metalPaint: false,
				timberPaint: false,
				isModelData: true,
				division: "stock_1",
				workUnitName: "amt",
				group: "Поручни",
				purposes: ["Соединение поручня на лестнице"]
			}
		}
		var name = 0;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}

	ring.specId = partName;	
	ring.setLayer("metis");

	return ring;
}

/** функция отрисовывает участок ограждения на площадке для замыкания спирального ограждения лестницы и балюстрады
*/

function drawRailingConnectionPlatform(par) {
	var railingSection = new THREE.Object3D();

	//параметры поручня
	var handrailPar = {
		prof: params.handrailProf_bal,
		sideSlots: params.handrailSlots_bal,
		handrailType: params.handrail_bal,
	}

	handrailPar = calcHandrailMeterParams(handrailPar); //функция в файле priceLib.js

	var rackOffsetY = 150;
	var rackLength = params.handrailHeight_bal - handrailPar.profY; //длина стойки с учетом кронштейна

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

	var rack = drawRack3d_4(rackParams).mesh;
	rack.position.y = -60;

	railingSection.add(rack);

	var handrailParams = {
		partName: "handrails",
		unit: 'balustrade',
		type: handrailPar.handrailModel,
		poleProfileY: handrailPar.profY,
		poleProfileZ: handrailPar.profZ,
		length: par.lengthHandrail + params.topHandrailExtraLength,
		poleAngle: 0,
		material: params.materials.handrail,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
		dxfArr: dxfPrimitivesArr,
		fixType: "нет",
		side: "in",
		drawing: { group: 'handrails', unit: 'balustrade', ang: 0 }
		//drawing: { group: 'handrails', unit: 'balustrade', pos: basePoint, ang: 0 }
	}

	//if (params.handrailConnectionType_bal == 'без зазора премиум') {
	//	handrailParams.cutBasePlane = 'top';
	//	handrailParams.startAngle = 0;
	//	handrailParams.endAngle = 0;
	//}


	var pole = drawHandrail_4(handrailParams).mesh;
	pole.position.x = - par.lengthHandrail / 2 - params.topHandrailExtraLength;
	pole.position.y = params.handrailHeight_bal - 150 - handrailPar.profY + 25;
	if (testingMode) pole.position.y += 2; //2 подогнано чтобы не было пересечений
	pole.position.z = 50 + handrailPar.profZ / 2;
	railingSection.add(pole);

	par.mesh = railingSection;

	return par;
}