//
/**
 * Вызывает функции для отрисовки каркаса
 * @param par общие параметры
 */
function drawVintCarcas(par){
	var mesh = new THREE.Object3D();

	var drums = drawDrums(par);
	mesh.add(drums);

	var stringers = drawStringers(par);
	mesh.add(stringers);

	return mesh
}

function drawStrightMarsh(par, marshId){
	var marsh = new THREE.Object3D();

	var treads = addStrightTreads(par, marshId);
	marsh.add(treads);

	var carcasParams = {
		marshId: marshId,
		dxfBasePoint: {x:0,y:0},
		addStringerWidth: 70,
		treadsObj: {
			turnEnd: {x:0,y:0},
			lastMarshEnd: {x:0,y:100},
			unitsPos: {
				marsh3:{x:0,y:0,z:0}
			}
		}
	};
	params.stringerThickness = 8;
	params.stairModel = 'Прямая';
	var oldModel = params.model;
	params.model = "ко";
	params.sideOverHang = 70;
	params.stringerMoove_1 = 0;
	var carcas = drawMarshStringers(carcasParams, marshId).mesh;
	marsh.add(carcas);

	params.model = oldModel;
	
	// Позицинируем объект
	var wrapper = new THREE.Object3D();
	if (marshId == 1) {
		marsh.position.x = -getMarshParams(1).len - par.columnDiam / 2 + 10;
		marsh.position.z = (params.M / 2) * turnFactor;
		wrapper.add(marsh)
		wrapper.rotation.y = THREE.Math.degToRad(params.strightTreadsAngle) - Math.PI / 2 * turnFactor;//THREE.Math.degToRad(params.firstStepAngle) + par.startAngle - Math.PI / 2;
		if (params.platformType == "triangle") wrapper.rotation.y = THREE.Math.degToRad(params.strightTreadsAngle) - Math.PI * turnFactor;
	}

	if (marshId == 3) {
		marsh.position.z = (params.M / 2) * turnFactor;
		marsh.position.x = par.columnDiam / 2 + 11.5 - params.nose; //Подогнано ///////////
		//
		wrapper.add(marsh)
		wrapper.rotation.y = -Math.PI / 2 * turnFactor;
	}

	return wrapper;
}

/**
 * Отрисовывает промежуточные крепления
 * @param par Общие параметры
 */
function drawMidFixings(par){
	var fixings = new THREE.Object3D();

	var dxfBasePoint = {
		x: 0,
		y: -4000
	}

	var holderParams = {
		profWidth: 50,
		profHeight: 100,
		holderLength: 1000,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: dxfBasePoint,
		material: params.materials.metal,//metalMaterial2,
		text: "Кронштейн",
		numberFix: 1,
	}

	if (params.holderProf == "40x40") {
		holderParams.profWidth = 40;
		holderParams.profHeight = 40;
	}

	for (var i = 0; i < params.holderAmt; i++) {
		holderParams.holderLength = midHoldersParams.holderLength[i];
		holderParams.text = "Кронштейн " + (i + 1);
		holderParams.numberFix = (i + 1);
		holderParams = drawMidFix(holderParams);
		var pole = holderParams.mesh;
		pole.rotation.y = midHoldersParams.angle[i] * Math.PI / 180;
		pole.position.y = midHoldersParams.pos[i] * par.stepHeight - params.treadThickness;
		var regShimAmt0 = midHoldersParams.pos[i];
		if (regShimAmt0 > regShimAmt) regShimAmt0 = par.regShimAmt;

		pole.position.y += regShimAmt0 * 4 - 8; //((midHoldersParams.pos[i] - regShimAmt0) * 4);// - 8;FIX
		
		if (params.stairType == "рифленая сталь" || params.stairType == "лотки под плитку"){
			pole.position.y = midHoldersParams.pos[i] * par.stepHeight + regShimAmt0 * 4 + 4
		}

		//carcas.push(holderParams.mesh);
		fixings.add(holderParams.mesh);//, "carcas");
		holderParams.dxfBasePoint.y -= 500;
	}

	return fixings;
}

/**
 * Отрисовывает бобышки
 * @param par общие параметры
 */
function drawDrums(par){
	var drums = new THREE.Object3D();
	/*бобышки*/
	if (params.model.indexOf("Спиральная") == -1) {
		function addVintSpacers() {}; //пустая функция для навигации

		var radiusTop = par.columnDiam / 2;
		var radiusBottom = radiusTop;
		var radialSegments = 36;
		var heightSegments = 1;
		var openEnded = false;
		var botFlanThk = 8;
		var middleFlanThk = 4;

		var botFloorType = params.botFloorType;

		var cylParams = {
			diam: par.columnDiam,
			holeDiam: par.columnDiam - 8,
			height: 0,
			material: params.materials.metal,
			partName: "drum"
		}


		//первая бобышка
		var posY0 = botFlanThk;
		if (botFloorType == "черновой") posY0 -= params.botFloorsDist;
		if (params.strightMarsh == "снизу" || params.strightMarsh == "сверху и снизу") posY0 -= par.strightPartHeight;

		var spacerHeight0 = par.stepHeight - params.treadThickness - posY0;
		if (par.stairType == "metal") spacerHeight0 = par.stepHeight - posY0 + 4; // 4 - подогнано
		if (params.stairType == 'рамки') spacerHeight0 = -params.treadThickness + par.stepHeight - posY0 + 4; // 4 - подогнано
		// if (params.stairType == 'рамки') spacerHeight0 = par.stepHeight - posY0; // 4 - подогнано

		var spacerPar = {
			height: spacerHeight0,
			holeDiam: 50,
		}
		var spacerObj = drawDrum(spacerPar)
		spacerObj.tubeMesh.position.y = spacerObj.shimMesh.position.y = posY0;

		drums.add(spacerObj.tubeMesh);//, "carcas");
		drums.add(spacerObj.shimMesh);//, "shims");


		//остальные бобышки
		//cylParams.holeDiam = 26;
		var spacerHeight = par.stepHeight - params.treadThickness;
		if (par.stairType == "metal") spacerHeight = par.stepHeight;
		// if (params.stairType == 'рамки') spacerHeight = par.stepHeight - params.treadThickness;

		//var geom = new THREE.CylinderGeometry( radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded) 
		//var geomHolderDrum = new THREE.CylinderGeometry( radiusTop, radiusBottom, height-8, radialSegments, heightSegments, openEnded) 

		var posY = par.stepHeight;
		if (par.stairType == "metal") posY += botFlanThk / 2;
		if (params.stairType == 'рамки') posY -= params.treadThickness
		//if (par.stairType == "metal") posY = spacerHeight0 + 8

		for (var i = 1; i < par.stairAmt + 1; i++) {
			//регулировочная шайба
			if (i <= par.regShimAmt) {
				posY += par.regShimThk;
			}

			var spacerPar = {
				height: spacerHeight,
				holeDiam: 26,
			}
			//бобышка, примыкающая к кронштейну
			var isMidHolderSpacer = false;
			if (params.stairType != "рифленая сталь" &&
				params.stairType != "лотки под плитку" &&
				midHoldersParams.pos.indexOf(i + 1) != -1
			) isMidHolderSpacer = true;
			if ((params.stairType == "рифленая сталь" || params.stairType == "лотки под плитку" || params.stairType == 'рамки') &&
				midHoldersParams.pos.indexOf(i) != -1) isMidHolderSpacer = true;

			if (isMidHolderSpacer) spacerPar.height -= 8;
			// if (isMidHolderSpacer) 
			//if(i == stairAmt && (params.stairType == "рифленая сталь" || params.stairType == "лотки под плитку")) spacerPar.height -= 4;
			//последняя бобышка на рифленке без крышки - вмето нее фланец
			if (i == par.stairAmt && par.stairType == "metal") spacerPar.noShim = true;

			var spacerObj = drawDrum(spacerPar)
			spacerObj.tubeMesh.position.y = spacerObj.shimMesh.position.y = posY;
			if ((params.stairType == "рифленая сталь" || params.stairType == "лотки под плитку" || params.stairType == 'рамки') &&
				midHoldersParams.pos.indexOf(i) != -1) {
				spacerObj.tubeMesh.position.y = spacerObj.shimMesh.position.y = posY + 8;
			}
			drums.add(spacerObj.tubeMesh);//, "carcas");
			drums.add(spacerObj.shimMesh);//, "shims");

			posY += par.stepHeight;
		}


		//нижний фланец

		var flanParams = {
			material: params.materials.metal,//metalMaterial1,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: {
				x: -1000,
				y: 0,
			},
			partName: "botFlan",
		}

		//отрисовываем нижний фланец
		flanParams = drawRoundFlan(flanParams)

		var botFlan = flanParams.mesh;
		if (botFloorType == "черновой") botFlan.position.y -= params.botFloorsDist;
		if (params.strightMarsh == "снизу" || params.strightMarsh == "сверху и снизу") botFlan.position.y -= par.strightPartHeight;

		//carcas.push(botFlan);
		drums.add(botFlan);//, "shims");

		//крышка нижнего фланца
		if (params.botFlanCover == "есть") {
			var flanCover = drawBotFlanCover();
			flanCover.position.y = 0;
			drums.add(flanCover);//, "treads");
		}


		//верхний фланец с 4 отверстиями

		var flanParams = {
			material: params.materials.metal,//metalMaterial1,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: {
				x: -1000,
				y: -300,
			},
			partName: "topFlan",
		}

		//отрисовываем верхний фланец
		flanParams = drawRoundFlan(flanParams)

		var topFlan = flanParams.mesh;
		topFlan.position.y = par.stepHeight * (par.stairAmt + 1) + par.regShimAmt * par.regShimThk + 4 + 0.05;
		var sectionTyrnAngle = (par.platformAngle / 2 - par.platformExtraAngle + Math.PI) * turnFactor;
		if (params.platformType == "square") sectionTyrnAngle = Math.PI / 2 * turnFactor + Math.PI;
		topFlan.rotation.z = sectionTyrnAngle + Math.PI / 4;
		//carcas.push(topFlan);
		drums.add(topFlan);//, "shims");


		//регулировочные шайбы
		var cylParams = {
			diam: par.columnDiam,
			holeDiam: 26,
			height: par.regShimThk,
			material: params.materials.metal,//shimMaterial,
			partName: "regShim"
		}

		//var geom = new THREE.CylinderGeometry( radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded) 

		for (var i = 0; i < par.regShimAmt; i++) {
			//var regShim = new THREE.Mesh(geom, shimMaterial);
			var regShim = drawCylinder_2(cylParams).mesh;
			regShim.position.x = 0;
			regShim.position.y = (par.stepHeight + par.regShimThk) * (i + 1) - params.treadThickness - par.regShimThk;
			if (par.stairType == "metal" && params.stairType != 'рамки') regShim.position.y += params.treadThickness + 4;
			if (params.stairType == 'рамки') regShim.position.y += 4;
			if (midHoldersParams.pos.indexOf(i + 1) != -1 && par.stairType != "metal") {
				regShim.position.y -= 8;
			}
			drums.add(regShim);//, "shims");
		}


		//параметры гайки
		var nutParams = {
			diam: 20,
			isLong: true,
		}


		//центральный стержень
		var maxRise = par.stepHeight + par.regShimThk;
		var maxLen = 2000;
		var endDist = 5;
		var extraLen = 70;
		//общая длина всех стержней
		var fullLen = par.staircaseHeight + 100 + params.stepAmt * par.regShimThk;
		if (params.platformPosition == "ниже") fullLen -= maxRise;
		//корректируем длину нижнего куска при установке на черновой пола
		if (params.botFloorType == "черновой") fullLen += params.botFloorsDist;
		if (params.strightMarsh == "снизу" || params.strightMarsh == "сверху и снизу") fullLen += par.strightPartHeight;

		var rodAmt = Math.ceil(fullLen / maxLen); //число кусков стержня
		var rodLen0 = fullLen / rodAmt; //номинальная длина куска
		var rodsLen = [];

		//считаем длины кусков так, чтобы стык стержней попадал внутрь бобышки
		var rodStepAmt = Math.round(rodLen0 / maxRise);
		var prevRodsSumLen = 0;
		for (var i = 0; i < rodAmt - 1; i++) {
			var connectionHeight = maxRise * rodStepAmt * (i + 1) - posY0 // + params.par.par.regShimAmt * par.regShimThk;
			var rodLen = connectionHeight - prevRodsSumLen + extraLen;
			rodsLen.push(rodLen);
			prevRodsSumLen += rodLen;
		}

		//последний (верхний) кусок
		rodLen = fullLen - prevRodsSumLen;
		//if(params.platformPosition == "ниже") rodLen -= maxRise;
		rodsLen.push(rodLen);


		var posY = 0;
		for (var i = 0; i < rodAmt; i++) {
			var rodPar = {
				len: rodsLen[i] - endDist,
				pos: i,
				isLast: false,
			}

			if (i == rodAmt - 1) rodPar.isLast = true;

			var rod = drawRod(rodPar).mesh;
			rod.position.y = posY0 + posY + endDist;
			drums.add(rod);//, "rod");

			//удлинненная гайка на стыке
			nutParams.isLong = true;
			var nut = drawNut(nutParams).mesh;
			nut.position.y = posY0 + posY - nutParams.nutHeight / 2;
			if (i == 0) nut.position.y = posY0;
			drums.add(nut);//, "shims");
			var nutPos = nut.position.y + nutParams.nutHeight;

			//средние стяжные гайки
			if (i > 0) {
				nutParams.isLong = false;
				var nut = drawNut(nutParams).mesh;
				//nut.position.y = posY0 + Math.floor(posY / maxRise) * maxRise + 8 + 0.01; //8 - костыль
				nut.position.y = nutPos + 0.5; //8 - костыль
				drums.add(nut);//, "shims")
			}


			posY += rodsLen[i];

		}


		//верхняя удлиненная гайка

		nutParams.isLong = true;
		var nut = drawNut(nutParams).mesh;
		nut.position.y = par.stepHeight * params.stepAmt + params.regShimAmt * par.regShimThk + 8 + 4 + 0.5;
		if (params.platformPosition == "ниже") nut.position.y -= par.stepHeight;
		console.log(nut.position.y, posY0)
		drums.add(nut);//, "shims");
		var nutTopPos = nut.position.y + nutParams.nutHeight;

		//верхняя контргайка
		nutParams.isLong = false;
		var nut = drawNut(nutParams).mesh;
		nut.position.y = nutTopPos + 0.5;
		drums.add(nut);//, "shims");
	}

	return drums;
}

/**
 * Отрисовывает тетивы
 * @param par - общие параметры
 */
function drawStringers(par){
	var stringers = new THREE.Object3D();
	if (params.model != "Винтовая" && params.model !== "Винтовая с больцами") {
		var stringerMaterial = new THREE.MeshLambertMaterial({
			color: 0x363636,
			wireframe: false
		});
		stringerMaterial.side = THREE.DoubleSide;

		var stringerExtraStep = 0.5;
		if (params.model == "Спиральная") {
			stringerExtraStep = calcTriangleParams().treadOverlayLength / (par.treadAngle * params.staircaseDiam / 2);
		}

		var stringerParams = {
			rad: params.staircaseDiam / 2 + 1,
			height: par.stepHeight * (par.stairAmt + stringerExtraStep),
			stripeWidth: 300,
			angle: (par.stairAmt + stringerExtraStep) * par.stepAngle,
			botHeight: par.stepHeight,
			topHeight: 300 - par.stepHeight * stringerExtraStep,
			turnFactor: turnFactor,
			material: stringerMaterial,
		}
		if (params.model == "Спиральная (косоур)") {
			stringerParams.rad = params.staircaseDiam / 2 - params.M / 2 + 75;
			stringerParams.stripeWidth = 400;
			par.treadExtraAngle = Math.asin(par.treadLowRad / (stringerParams.rad));
		}
		
		var dxfStringerPar = {
			angle: stairParams.treadAngle,
			height: stringerParams.height,
			stairAmt: par.stairAmt,
			stepHeight: par.stepHeight,
			staircaseHeight: par.staircaseHeight,
			dxfBasePoint: {x:4000, y: 0,}
		}
		var stringerDXF = drawStringerDXF(dxfStringerPar);
		console.log(dxfStringerPar, par.platformExtraAngle, par.platformAngle)
		var stringer = stringerDXF.mesh;
		
		stringer.rotation.y = (par.platformExtraAngle - par.platformAngle / 2 + Math.PI);
		if (params.platformType == "square") stringer.rotation.y = -Math.PI * turnFactor;
		stringer.rotation.y += Math.PI / 2 * turnFactor;
		translateObject(stringer, -stringerDXF.lenX, 0, params.staircaseDiam / 2 * turnFactor);

		if(document.location.href.indexOf("manufacturing") != -1){		
			stringers.add(stringer);//, "stringers2");
		}
		
		var drawSpiralStringer = drawSpiralStripe;
		if (params.model == "Спиральная (косоур)")
			drawSpiralStringer = drawSpiralStripeMono;

		stringerParams = drawSpiralStringer(stringerParams);
		var stringer = stringerParams.mesh;
		stringer.rotation.x = -Math.PI / 2;
		stringer.rotation.z = par.startAngle - par.treadExtraAngle // + edgeAngle
		if (params.model == "Спиральная") stringer.rotation.z = par.startAngle;
		if (turnFactor == -1) stringer.rotation.z += par.treadExtraAngle * 2 + par.edgeAngle;

		if (params.model == "Спиральная (косоур)") {
			stringer.rotation.z = par.startAngle - (par.stepAngle - par.treadExtraAngle) * turnFactor	
			if (turnFactor == 1) stringer.rotation.z += par.edgeAngle;
		}

		stringer.position.x = 0;
		//stringers.push(stringer);
		stringers.add(stringer);//, "stringers");

		var floorAngle = drawAngleSupport("У4-70х70х100");
		floorAngle.rotation.y = stairParams.stairCaseAngle + Math.PI / 2;
		if (params.turnFactor == 1) {
			floorAngle.rotation.y = -stairParams.stairCaseAngle + Math.PI / 2;
			floorAngle.position.x += 100 * Math.cos(Math.PI * 2 - (stairParams.stairCaseAngle + Math.PI / 2));
			floorAngle.position.z -= 100 * Math.sin(Math.PI * 2 - (stairParams.stairCaseAngle + Math.PI / 2));
		}
		translateObject(floorAngle, 0, 0, -params.staircaseDiam / 2);
		stringers.add(floorAngle);//, "stringers");
	}
	
	//внутренняя спиральная тетива*/
	if (params.model == "Спиральная" || params.model == "Спиральная (косоур)") {
		var stringerParams = {
			rad: params.staircaseDiam / 2 - params.M - 1,
			height: par.stepHeight * (par.stairAmt + stringerExtraStep),
			stripeWidth: 300,
			angle: (par.stairAmt + stringerExtraStep) * par.stepAngle,
			botHeight: par.stepHeight,
			topHeight: 500 - par.stepHeight * stringerExtraStep,
			turnFactor: turnFactor,
			material: stringerMaterial,
		}
		if (params.model == "Спиральная (косоур)") {
			stringerParams.rad = params.staircaseDiam / 2 - params.M / 2 - 75;
			stringerParams.stripeWidth = 400;
			var treadExtraAngleIn = Math.asin(par.treadLowRad / (stringerParams.rad));
			stringerParams.deltaAng = par.treadExtraAngle - treadExtraAngleIn;		
		}

		var drawSpiralStringer = drawSpiralStripe;
		if (params.model == "Спиральная (косоур)")
			drawSpiralStringer = drawSpiralStripeMono;

		stringerParams = drawSpiralStringer(stringerParams);
		var stringer = stringerParams.mesh;
		stringer.rotation.x = -Math.PI / 2;
		stringer.rotation.z = par.startAngle - par.treadExtraAngle // + edgeAngle
		if (params.model == "Спиральная") stringer.rotation.z = par.startAngle;
		if (turnFactor == -1) stringer.rotation.z += par.treadExtraAngle * 2 + par.edgeAngle;

		if (params.model == "Спиральная (косоур)") {
			stringer.rotation.z = par.startAngle - (par.stepAngle - par.treadExtraAngle) * turnFactor	
			if (turnFactor == 1) stringer.rotation.z += par.edgeAngle;
		}
		
		stringer.position.x = 0;
		//stringers.push(stringer);
		stringers.add(stringer);//, "stringers");
	}
	
	if (params.model == "Спиральная (косоур)") {
		//задняя пластина
		stringerParams = drawTurnBackCurve(stringerParams);
		var stringer = stringerParams.mesh;
		stringer.rotation.x = -Math.PI / 2;
		stringer.rotation.z = par.startAngle - (par.stepAngle - par.treadExtraAngle - stringerParams.startCutAngle) * turnFactor;	
		if (turnFactor == 1) stringer.rotation.z += par.edgeAngle;
		
		stringer.position.x = 0;
		stringers.add(stringer);//, "stringers");

		//отрисовывамем подложки под ступень и переднии пластины для монокосоура
		var posY = par.stepHeight;
		for (var i = 0; i < par.stairAmt; i++) {

			//Подложка
			var plateParams = {
				points: par.treadParams.pointsTreadPlate,
				pointsHoles: par.treadParams.pointsTreadPlateHoles,
				turnFactor: turnFactor,
				dxfBasePoint: { x: 4000, y: -3000, },
				dxfArr: dxfPrimitivesArr
			};
			plateParams = drawTreadPlate(plateParams);
			var plate = plateParams.mesh;
			plate.rotation.y = par.stepAngle * i * turnFactor + par.startAngle;
			plate.position.y = posY - params.treadThickness;
			stringers.add(plate);//, "stringers2");

			//Передняя пластина
			var frontPlateParams = {
				points: par.treadParams.pointsFrontPlate,
				height: par.stepHeight,
				width: 150,
				turnFactor: turnFactor,
				dxfBasePoint: { x: 4000, y: -4000, },
				dxfArr: dxfPrimitivesArr,
			};
			
			if(i == 0){
				frontPlateParams.height -= params.treadThickness;
				frontPlateParams = drawFrontPlate(frontPlateParams);
				var plate = frontPlateParams.mesh;
				plate.rotation.y = par.stepAngle * i * turnFactor + par.startAngle - par.stepAngle * turnFactor;
				plate.position.y = posY - params.treadThickness - frontPlateParams.height;
				plate.castShadow = true;
				stringers.add(plate);//, "stringers2");
				
				frontPlateParams.height += params.treadThickness;
			}
			
			frontPlateParams = drawFrontPlate(frontPlateParams);
			var plate = frontPlateParams.mesh;
			plate.rotation.y = par.stepAngle * i * turnFactor + par.startAngle;
			plate.position.y = posY - params.treadThickness;
			plate.castShadow = true;
			stringers.add(plate);//, "stringers2");
			posY += par.stepHeight;
			
			//контура остальных подложек и пластин кроме первой добавляем в мусорный масси
			plateParams.dxfArr = dxfPrimitivesArr0;
			frontPlateParams.dxfArr = dxfPrimitivesArr0;
		}
	}

	return stringers;
}

//Рисуем чертеж тетивы
function drawStringerDXF(par){
	/*
	Переменные захордкожены тк нужно сначала описать функционал
	*/
	var botFaceLength = 250;//Длинна стороны прилегающей к полу
	var botFaceHeight = 180;//Длинна стороны прилегающей к полу
	var botFaceHeightOffset = 85;//Длинна стороны прилегающей к полу
	var botFaceOffset = 25; //Отступ от пола перед диагональной частью
	var botFaceOffsetOut = 33; //Отступ от пола перед диагональной частью
	var topFaceHeight = 190;//высота верхней стороны
	var topFlanHeightOffset = 60;//Высота выступа под фланец
	var topFlanDepthOffset = 45;//Глубина выступа под фланец
	var topFaceLength = 190; //Длинна верхней стороны
	var edgeRad = 6;
	//длина дуги одного шага на внешнем диаметре лестницы
	var stepArcLen = params.stepAngle / 180 * Math.PI  * params.staircaseDiam / 2; 
	//угол подъема тетивы
	var angle = Math.atan(par.stepHeight / stepArcLen);

	var height = par.staircaseHeight;
	if(params.platformPosition == "ниже") height -= par.stepHeight
	
	var lenX = (params.stepAmt - 1) * stepArcLen;
	
	var length = (par.height - botFaceOffset - topFaceHeight) / Math.sin(angle);

	var typeTread = "timber";
	if (params.stairType == "рифленая сталь" || params.stairType == "лотки под плитку") typeTread = "metal";

	par.partsLen = [];
	par.meshes = [];

/*	
	var p0 = {x:0,y:0};
	var p0_1 = newPoint_xy(p0, botFaceOffsetOut, 0);
	var p1_1 = newPoint_xy(p0, botFaceLength, 0);
	var p1 = newPoint_xy(p1_1, 0, botFaceOffset);
	//var p2 = polar(p1, angle, length);
	var p2 = newPoint_xy(p0, lenX, height);
	console.log(p2)
	var p3 = newPoint_xy(p2, 0, topFaceHeight - topFlanHeightOffset);
	var p4 = newPoint_xy(p3, -topFlanDepthOffset, 0);
	var p5 = newPoint_xy(p4, 0, topFlanHeightOffset);
	var p6 = newPoint_xy(p5, -topFaceLength + topFlanDepthOffset, 0);
	var p7 = itercection(p0, newPoint_xy(p0, 0, 100), p6, polar(p6, angle, -100));
	var p8 = newPoint_xy(p7, 0, -botFaceHeightOffset);
	*/
	var p0 = {x:-70,y:0};
	
	
	var p1 = newPoint_xy(p0, 20, 0);
	var p1_1 = newPoint_xy(p0, -10, 100);
	
	var p2 = newPoint_xy(p0, -10, par.stepHeight + 10);
	var pt = newPoint_xy(p0, 0, height);
	var p3 = itercection(pt, polar(pt, 0, -100), p2, polar(p2, angle, -100));
	//var p3 = newPoint_xy(p0, lenX - 75, height);
	var p4 = newPoint_xy(p3, 75 + 70, 0);
	var p5 = newPoint_xy(p4, 0, -params.treadThickness - 10);
	var p6 = newPoint_xy(p5, 75 + 8.5, 0);
	
	var p7 = newPoint_xy(p6, 0, -200);
	var p8 = itercection(p0, newPoint_xy(p0, 100, 0), p7, polar(p7, angle, -100));

	if (params.platformType !== 'нет' && typeTread == "metal" && params.platformLedgeM > 0) {
		var p5 = newPoint_xy(p0, lenX + 4 + 5.5 + 4, height - params.treadThickness - 14);
		var p4 = newPoint_xy(p5, 0, -120);
		p3 = itercection(p2, p5, p4, polar(p4, 0, 100));
		var p6 = newPoint_xy(p5, 120, 0);
		var p7 = itercection(p8, polar(p8, angle, 100), p6, polar(p6, Math.PI / 2, 100));

		p6.filletRad = 40;
	}
	var points = [p1, p1_1, p2, p3, p4, p5, p6, p7, p8]
	
	//p1.filletRad = p2.filletRad = p3.filletRad = p5.filletRad = p6.filletRad = p7.filletRad = edgeRad;
	// var p1 = newPoint_xy(p0, 140, 0);
	// var p2 = polar(p1, -par.angle, par.height);
	// var p3 = newPoint_xy(p2, -140, 0);
	
	var dxfBasePoint = {x:0,y:0};
	
	//var points = [p0_1,p1_1, p1,p2,p3,p4,p5,p6,p7, p8]
	

	var divides = calcDivides(par.stepHeight, par.staircaseHeight);

	if (divides.length == 0) {
		//создаем шейп
		var shapePar = {
			points: points,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: par.dxfBasePoint,
			//radOut: 20, //радиус скругления внешних углов
			markPoints: true,
		}

		stringerShape = drawShapeByPoints2(shapePar).shape;

		par.partsLen.push(distance(p1, p6));
	}
	if (divides.length > 0) {

		var heightDivides = [];
		for (var j = 0; j < divides.length; j++) {
			var heightDivide = par.stepHeight * divides[j] - params.treadThickness - 8;
			if (typeTread == "metal") heightDivide -= 30;
			heightDivides.push(heightDivide)
		}

		var divideShapes = [];
		for (var j = 0; j < divides.length; j++) {
			if (j == 0) {
				points = [p1, p1_1, p2]
			}
			if (j !== 0) {
				points = [pt2, pt1]
			}

			var pt = { x: 0, y: heightDivides[j]}
			var pt1 = itercection(p2, p3, pt, polar(pt, 0, 100));
			var pt2 = itercection(p8, p7, pt, polar(pt, 0, 100));

			points.push(pt1);
			points.push(pt2);
			if (j == 0) points.push(p8);

			//создаем шейп
			var shapePar = {
				points: points,
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: par.dxfBasePoint,
				markPoints: true,
			}
			var shape = drawShapeByPoints2(shapePar).shape;
			divideShapes.push(shape);
			if (j == 0) par.partsLen.push(distance(p1, pt2));
			if (j != 0) par.partsLen.push(distance(points[1], pt2));

			//добавляем отверстия под фланец соединения тетив
			if (j == 0) {
				var line = parallel(p2, pt1,  -30);
				var line1 = parallel(pt1, pt2, -20);

				var hole1 = itercectionLines(line, line1);
				addRoundHole(shape, dxfPrimitivesArr, hole1, 6.5, par.dxfBasePoint);
			}
			if (j != 0) {
				var line = parallel(points[1], pt1, -30);
				var line1 = parallel(pt1, pt2, -20);
				var line2 = parallel(points[0], points[1], 20);

				var hole1 = itercectionLines(line, line1);
				var hole2 = itercectionLines(line, line2);
				addRoundHole(shape, dxfPrimitivesArr, hole1, 6.5, par.dxfBasePoint);
				addRoundHole(shape, dxfPrimitivesArr, hole2, 6.5, par.dxfBasePoint);
			}

			

			if (j == (divides.length - 1)) {
				points = [pt1, p3, p4, p5, p6, p7, pt2]
				//создаем шейп
				var shapePar = {
					points: points,
					dxfArr: dxfPrimitivesArr,
					dxfBasePoint: par.dxfBasePoint,
					markPoints: true,
				}
				var shape = drawShapeByPoints2(shapePar).shape;
				divideShapes.push(shape);
				par.partsLen.push(distance(pt1, p6));

				//добавляем отверстия под фланец соединения тетив
				var line = parallel(pt1, p3, -30);
				var line1 = parallel(pt1, pt2, 20);

				var hole1 = itercectionLines(line, line1);
				addRoundHole(shape, dxfPrimitivesArr, hole1, 6.5, par.dxfBasePoint);
			}
		}
	}
	
	var hole1 = newPoint_xy(p0, 30, par.stepHeight - params.treadThickness - 15);
	for (var i = 1; i <= par.stairAmt; i++) {
		if (i > 1) {
			hole1 = newPoint_xy(hole1, stepArcLen, par.stepHeight);//polar(p1, angle, 175 * (i + 1));//) / Math.cos(angle));
		}
		var hole2 = newPoint_xy(hole1, stepArcLen / 2, 0);
		var hole3 = newPoint_xy(hole2, stepArcLen / 2, 0);

		if (divides.length == 0) {
			addRoundHole(stringerShape, dxfPrimitivesArr, hole1, 4, par.dxfBasePoint);
			addRoundHole(stringerShape, dxfPrimitivesArr, hole2, 4, par.dxfBasePoint);
			addRoundHole(stringerShape, dxfPrimitivesArr, hole3, 4, par.dxfBasePoint);
		}
		if (divides.length !== 0) {				
			var indexDivide = getIndexDivide(hole1, heightDivides)
			addRoundHole(divideShapes[indexDivide], dxfPrimitivesArr, hole1, 4, par.dxfBasePoint);
			addRoundHole(divideShapes[indexDivide], dxfPrimitivesArr, hole2, 4, par.dxfBasePoint);
			addRoundHole(divideShapes[indexDivide], dxfPrimitivesArr, hole3, 4, par.dxfBasePoint);
		}
	}

	//отверстия под ограждение по внешней стороне
	if (params.railingSide == "внешнее" || params.railingSide == "две") {
		if (params.railingModel == "Ригели" || params.railingModel == "Стекло на стойках") {
			//считаем длину ограждения
			var railingLength = Math.sqrt((par.stepAngle * params.staircaseDiam / 2) * (par.stepAngle * params.staircaseDiam / 2) + par.stepHeight * par.stepHeight) * par.stairAmt;
			var rackAmt = Math.ceil(railingLength / 900) + 1;
			var rackDistY = par.stepHeight * (par.stairAmt - 0.3) / (rackAmt - 1);
			var rackAngleDist = par.stepAngle * (par.stairAmt - 0.3) / (rackAmt - 1);

			for (var j = 0; j < rackAmt; j++) {
				var banistrPositionAngle = rackAngleDist * j;
				var holeY = rackDistY * j + 50;
				if (j == 0) holeY += 40;

				var pt = { x: 0, y: holeY };
				var pt1 = itercection(p2, p3, pt, polar(pt, 0, 100));
				var pt2 = itercection(p7, p8, pt, polar(pt, 0, 100));

				var hole1 = newPoint_xy(p0, 30, holeY);
				if (j !== 0) {
					//hole1.x = pt1.x + (pt2.x - pt1.x) / 2;
					var stepArcLenRacks = banistrPositionAngle * params.staircaseDiam / 2; 
					hole1 = newPoint_xy(hole1, stepArcLenRacks, 0)
					hole1 = newPoint_xy(p0, stepArcLenRacks + 42, holeY)
				}

				var hole2 = newPoint_xy(hole1, 0, -60);
				if (divides.length == 0) {
					addRoundHole(stringerShape, dxfPrimitivesArr, hole1, 6.5, par.dxfBasePoint);
					addRoundHole(stringerShape, dxfPrimitivesArr, hole2, 6.5, par.dxfBasePoint);
				}
				if (divides.length !== 0) {
					var indexDivide = getIndexDivide(hole1, heightDivides)
					addRoundHole(divideShapes[indexDivide], dxfPrimitivesArr, hole1, 6.5, par.dxfBasePoint);
					addRoundHole(divideShapes[indexDivide], dxfPrimitivesArr, hole2, 6.5, par.dxfBasePoint);
				}
			}
			
		}
	}

	//отверстия под соединительный фланец верхней площадке к тетиве
	if (params.platformType !== 'нет' && typeTread == "metal" && params.platformLedgeM > 0) {
		var hole1 = newPoint_xy(p5, 30, -30);
		var hole2 = newPoint_xy(hole1, 0, -60);
		if (divides.length == 0) {
			addRoundHole(stringerShape, dxfPrimitivesArr, hole1, 6.5, par.dxfBasePoint);
			addRoundHole(stringerShape, dxfPrimitivesArr, hole2, 6.5, par.dxfBasePoint);
		}
		if (divides.length !== 0) {
			addRoundHole(divideShapes[divideShapes.length - 1], dxfPrimitivesArr, hole1, 6.5, par.dxfBasePoint);
			addRoundHole(divideShapes[divideShapes.length - 1], dxfPrimitivesArr, hole2, 6.5, par.dxfBasePoint);
		}
	}

	var meshStringer = new THREE.Object3D();

	var extrudeOptions = {
		amount: 4,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	if (divides.length == 0) {
		var geometry = new THREE.ExtrudeGeometry(stringerShape, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var stringer = new THREE.Mesh(geometry, params.materials.metal);
		meshStringer.add(stringer);
		par.meshes.push(stringer);
	}
	if (divides.length !== 0) {
		for (var j = 0; j < divideShapes.length; j++) {
			var geometry = new THREE.ExtrudeGeometry(divideShapes[j], extrudeOptions);
			geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
			var stringer = new THREE.Mesh(geometry, params.materials.metal);
			meshStringer.add(stringer);
			par.meshes.push(stringer);
		}
	}

	par.mesh = meshStringer;
	par.lenX = lenX;

	var partName = "stringer";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Тетива",
				area: 0,
				paintedArea: 0,
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "area", //единица измерения
				group: "Каркас",
			}
		}
		var stringerNname = 'внешн. ';

		for (var i = 0; i < par.partsLen.length; i++) {
			var name = stringerNname + " L=" + Math.round(par.partsLen[i]);
			var area = 300 * par.partsLen[i] / 1000000;

			if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
			if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
			specObj[partName]["amt"] += 1;
			specObj[partName]["area"] += area;
			specObj[partName]["paintedArea"] += area * 2;

			par.meshes[i].specId = partName + name;
		}
	}
	
	return par;
}

/**
 * Отрисовывает каркас площадки и накладку
 * @param par - общие параметры
 */
function drawPlatform(par){
	var platformMesh = new THREE.Object3D();
	var vintPlatformParams = {
		platformAngle: par.platformAngle,
		platformDepth: par.platformDepth,
		treadLowRad: par.treadLowRad,
		columnDiam: par.columnDiam,
		holeDiam: par.holeDiam,
		type: "timber",
		material: params.materials.tread,//params.materials.timber,
		metalMaterial: params.materials.metal, //metalMaterial1,
		turnFactor: turnFactor,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: {
			x: 1000,
			y: -1000,
		},
		railingFlanSize: 76,
		railingFlanHoleDst: 55,
		platformType: params.platformType,
	}
	if (params.stairType == "рифленая сталь" || params.stairType == "лотки под плитку") {
		vintPlatformParams.type = "metal";
	}
	if (vintPlatformParams.type == "metal" && params.stairType !== 'рамки') vintPlatformParams.material = params.materials.metal;

	//отрисовываем площадку
	vintPlatformParams = drawVintPlatform(vintPlatformParams)
	var platform = vintPlatformParams.mesh;
	/*
	platform.rotation.y = (platformExtraAngle - platformAngle / 2 + Math.PI);
	if (turnFactor == -1) platform.rotation.y = -(platformExtraAngle - platformAngle / 2 + Math.PI);
	*/
	
	platform.rotation.y = Math.PI - stairParams.platformEdgeAngle / 2 * turnFactor;
	
	if (params.platformType == "square") platform.rotation.y = Math.PI;
	platform.position.x = 0;
	platform.position.y = par.stepHeight * (par.stairAmt + 1) + par.regShimAmt * par.regShimThk;
	platform.position.z = 0;
	platform.castShadow = true;
	//treads.push(platform);
	platformMesh.add(platform);//, "treads");

	//рама под деревянной площадкой

	if (vintPlatformParams.metalFrame) {
		var platform = vintPlatformParams.metalFrame;
		platform.rotation.y = Math.PI;
		platform.position.x = 0;
		platform.position.y = par.stepHeight * (par.stairAmt + 1) + par.regShimAmt * par.regShimThk;
		platform.position.z = 0;
		platform.castShadow = true;
		platformMesh.add(platform);//, "carcas");
	}
	vintPlatformParams.mesh = platformMesh;
	return vintPlatformParams;
}