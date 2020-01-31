//глобальные переменные для тестирования
var testingMode = false;
var boltDiam = 10;
var boltBulge = 8;
var boltLen = 30;
var stairParams = {};



//функция - оболочка
function drawStaircase(viewportId, isVisible) {

	//удаляем старую лестницу

	for (var layer in layers) {
		removeObjects(viewportId, layer);
	}

	//итоговая модель лестницы

	var model = {
		objects: [],
		//метод выцепляет из массива objects объект слоя по имени слоя layer
		getLayerObj: function(layer) {
			$.each(this.objects, function() {
				if (this.layer == layer) return this;
			})
			return false;
		},
		//метод добавляет в объект слоя layer объект obj
		add: function(obj, layer) {
			var layerObj = this.getLayerObj(layer);
			if (!layerObj) {
				var layerObj = {
					obj: new THREE.Object3D(),
					layer: layer,
				};
				this.objects.push(layerObj);
			};

			layerObj.obj.add(obj);
		},
	};

	//обнуляем счетчики спецификации
	partsAmt = {};
	partsAmt_bal = {
		unit: "banister"
	}
	specObj = partsAmt; //задаем объект, куда будут сохраняться данные для спецификации

	//обнуляем массив примитивов dxfBasePoint
	dxfPrimitivesArr = [];

	//локальный массив элементов лестницы
	var stairCase = [];

	/*вспомогательные оси*/
	var axes = new THREE.AxisHelper(2000);
	model.add(axes, "topFloor");

	/*параметры лестницы*/



	var platformAngle = getInputValue("platformAngle");
	if (params.platformType == "square") platformAngle = 90;
	var platformPosition = getInputValue("platformPosition");
	var handrailMaterial = getInputValue("handrailMaterial");
	var banisterPerStep = getInputValue("banisterPerStep");
	var columnDiam = getInputValue("columnDiam");
	var platformLedge = params.platformLedge;
	var turnFactor = params.turnFactor * 1;
	var treadLowRad = 75;
	var holeDiam = 26;
	var stairAmt = params.stepAmt - 1;
	if (platformPosition == "ниже") stairAmt = params.stepAmt - 2;
	stairParams.stairAmt = stairAmt;
	var botFloorType = params.botFloorType;

	var stairType = "timber";
	if (params.treadsMaterial == "рифленая сталь" || params.treadsMaterial == "лотки под плитку") stairType = "metal";

	//параметры промежуточных креплений
	midHoldersParams = {
		pos: [],
		holderLength: [],
		angle: [],
	};
	for (var i = 0; i < params.holderAmt; i++) {
		midHoldersParams.holderLength.push(params["holderLength_" + i]);
		midHoldersParams.angle.push(params["holderAngle_" + i]);
		midHoldersParams.pos.push(params["holderPos_" + i]);
	}


	//расчет подъема ступени
	var regShimAmt = params.regShimAmt;
	var regShimThk = 4; //толщина с учетом слоя краски
	var stepHeight = Math.floor((params.staircaseHeight - 20) / params.stepAmt);
	var G = (Math.floor((360 - platformAngle) / params.stepAngle) - 1) * stepHeight;
	if (params.treadsMaterial == "рифленая сталь" || params.treadsMaterial == "лотки под плитку") {
		G -= 120;
	}
	if (params.treadsMaterial != "рифленая сталь" && params.treadsMaterial != "лотки под плитку") {
		G -= 40;
		if (params.platformType == "square") G -= 100; //учитываем раму под площадкой 
	}

	if(G < 2000 && !testingMode) alertTrouble("ВНИМАНИЕ! Габарит G = " + G + "мм! Рекомендуется делать габарит не менее 2000мм!")

	//заносим значения в глобальный массив параметров
	stairParams.stepHeight = stepHeight;
	//stairParams.stepAngle = stepAngle;
	stairParams.platformAngle = platformAngle;
	stairParams.G = G;

	//переводим углы в радианы
	var stepAngle = params.stepAngle / 180 * Math.PI;
	var platformAngle = platformAngle / 180 * Math.PI;

	/*Материалы*/
	var metalColor = 0x363636;
	var metalColor1 = 0x333000;
	var metalColor2 = 0xBD3000;
	var metalColor3 = 0xBD3088;
	var shimColor = 0xFF0000;
	var timberColor = 0x804000;
	//цвета из параметров
	if (!menu.realColors) {
		metalColor = metalColor1 = metalColor2 = metalColor3 = shimColor = getMetalColorId(params.metalColorNumber);
		timberColor = getTimberColorId(params.timberColorNumber)
	}

	var metalMaterial1 = new THREE.MeshLambertMaterial({
		color: metalColor1,
		wireframe: false
	});
	var metalMaterial2 = new THREE.MeshLambertMaterial({
		color: metalColor2,
		wireframe: false
	});
	var metalMaterial3 = new THREE.MeshLambertMaterial({
		color: metalColor3,
		wireframe: false
	});
	var shimMaterial = new THREE.MeshLambertMaterial({
		color: shimColor,
		wireframe: false
	});

	var treadExtrudeOptions = {
		amount: params.treadThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	//Угол ступени с учетом нахлеста ступеней
	var treadAngle = calcTriangleParams().treadAngle;
	
	/*
	var treadOverlayArcLength = 60; //длина дуги нахлеста ступеней на внешнем радиусе
	var treadOverlayArcAngle = treadOverlayArcLength / (params.staircaseDiam / 2);
	var treadAngle = stepAngle + treadOverlayArcAngle;
	*/
	/*
	var treadShape = drawVintTreadShape(treadParams);
	var geom = new THREE.ExtrudeGeometry(treadShape, treadExtrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
*/
	/*начальный угол лестницы*/

	var treadExtraAngle = Math.asin(treadLowRad / (params.staircaseDiam / 2));
	var platformDepth = params.staircaseDiam / 2 + platformLedge;
	var L1 = platformDepth / Math.cos(platformAngle / 2);
	var platformWidth = 2 * platformDepth / Math.sin(platformAngle / 2);
	var platformExtraAngle = Math.asin(treadLowRad / L1);
	
	//длина дуги треугольной площадки на диаметре лестницы
	var pltArcLen = platformAngle * params.staircaseDiam / 2;
	//учитываем нахлест площадки на ступень
	pltArcLen -= calcTriangleParams().treadOverlayLength * 2;
	var pltAng = pltArcLen / (params.staircaseDiam / 2);
	
	//ставим заднее ребро последней ступени вдоль оси Х
	//var staircaseAngle = (stairAmt - 1) * stepAngle + calcTriangleParams().treadEdgeAngle;// + platformAngle / 2;
	
	//ставим переднее ребро последней ступени вдоль оси Х
	var staircaseAngle = (stairAmt - 1) * stepAngle	
	//совмещаем переднее ребро последней ступени и переднее ребро площадки
	staircaseAngle += calcTriangleParams().pltEdgeAngle / 2
	//добавляем один шаг
	staircaseAngle += stepAngle;
	
	if (params.platformType == "square") {
		staircaseAngle = stairAmt * stepAngle
		if (stairType == "metal") staircaseAngle -= Math.atan(18 / (params.staircaseDiam / 2 + 10));
	}

	var startAngle = Math.PI - staircaseAngle;
	startAngle = startAngle * turnFactor
	if (turnFactor == -1) {
		var edgeAngle = treadAngle - 2 * Math.asin(treadLowRad / (params.staircaseDiam / 2));
		startAngle = startAngle - edgeAngle;
	}
	/*
	if (params.platformType == "triangle") {
		// Коэф. ведет себя адекватно примерно в диапазоне 40-120
		// пересчитать
		startAngle += Math.asin((treadLowRad - 40) / params.staircaseDiam / 2);
	}
*/
	stairParams.stairCaseAngle = staircaseAngle;

	/*ступени*/

	addVintTreads();

	function addVintTreads() {

		var treadParams = {
			//staircaseDiam: staircaseDiam,
			treadAngle: treadAngle,
			treadLowRad: treadLowRad,
			columnDiam: columnDiam,
			holeDiam: holeDiam,
			type: "timber",
			material: params.materials.tread,
			dxfArr: dxfPrimitivesArr,
		}
		if (params.treadsMaterial == "рифленая сталь" || params.treadsMaterial == "лотки под плитку") {
			treadParams.type = "metal";
		// 	treadParams.material = params.materials.metal;
		}
		var divides = calcDivides(stepHeight);		

		//отрисовывамем винтовую ступень
		var posY = stepHeight;
		for (var i = 0; i < stairAmt; i++) {

			if (stairType != "metal" && i < regShimAmt) posY += regShimThk;

			//определяем наличие разделения тетив под ступенью
			treadParams.isDivide = false;
			if (divides.length > 0) {
				if (divides.indexOf(i + 1) != -1) {
					treadParams.isDivide = true;
				}
			}

			treadParams = drawVintTread(treadParams);
			var tread = treadParams.mesh;
			tread.rotation.y = stepAngle * i * turnFactor + startAngle;
			tread.position.x = 0;
			tread.position.y = posY;
			tread.position.z = 0;
			tread.castShadow = true;
			//treads.push(tread);
			model.add(tread, "treads");


			posY += stepHeight;
			if (stairType == "metal" && i < regShimAmt) posY += regShimThk;

			//контура остальных ступеней кроме первой добавляем в мусорный масси
			treadParams.dxfArr = dxfPrimitivesArr0;
		}

	}
	/*бобышки*/

	function addVintSpacers() {}; //пустая функция для навигации

	var radiusTop = columnDiam / 2;
	var radiusBottom = radiusTop;
	var radialSegments = 36;
	var heightSegments = 1;
	var openEnded = false;
	var botFlanThk = 8;
	var middleFlanThk = 4;

	var cylParams = {
		diam: columnDiam,
		holeDiam: columnDiam - 8,
		height: 0,
		material: params.materials.metal,
		partName: "drum"
	}



	//первая бобышка
	var posY0 = botFlanThk;
	if (botFloorType == "черновой") posY0 -= params.botFloorsDist;

	var spacerHeight0 = stepHeight - params.treadThickness - posY0;
	if (stairType == "metal") spacerHeight0 = stepHeight - posY0 + 4; // 4 - подогнано

	var spacerPar = {
		height: spacerHeight0,
		holeDiam: 50,
	}
	var spacerObj = drawDrum(spacerPar)
	spacerObj.tubeMesh.position.y = spacerObj.shimMesh.position.y = posY0;

	model.add(spacerObj.tubeMesh, "carcas");
	model.add(spacerObj.shimMesh, "shims");


	//остальные бобышки
	//cylParams.holeDiam = 26;
	var spacerHeight = stepHeight - params.treadThickness;
	if (stairType == "metal") spacerHeight = stepHeight;

	//var geom = new THREE.CylinderGeometry( radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded) 
	//var geomHolderDrum = new THREE.CylinderGeometry( radiusTop, radiusBottom, height-8, radialSegments, heightSegments, openEnded) 

	var posY = stepHeight;
	if (stairType == "metal") posY += botFlanThk / 2;
	//if (stairType == "metal") posY = spacerHeight0 + 8
	
	for (var i = 1; i < stairAmt + 1; i++) {
		//регулировочная шайба
		if (i <= regShimAmt) {
			posY += regShimThk;
		}

		var spacerPar = {
			height: spacerHeight,
			holeDiam: 26,
		}
		//бобышка, примыкающая к кронштейну
		var isMidHolderSpacer = false;
		if (params.treadsMaterial != "рифленая сталь" && 
			params.treadsMaterial != "лотки под плитку" &&
			midHoldersParams.pos.indexOf(i + 1) != -1
			) isMidHolderSpacer = true;
		if ((params.treadsMaterial == "рифленая сталь" || params.treadsMaterial == "лотки под плитку") &&
			midHoldersParams.pos.indexOf(i) != -1) isMidHolderSpacer = true;

		if (isMidHolderSpacer) spacerPar.height -= 8;
		// if (isMidHolderSpacer) 
		//if(i == stairAmt && (params.treadsMaterial == "рифленая сталь" || params.treadsMaterial == "лотки под плитку")) spacerPar.height -= 4;
		//последняя бобышка на рифленке без крышки - вмето нее фланец
		if (i == stairAmt && stairType == "metal") spacerPar.noShim = true;
		
		var spacerObj = drawDrum(spacerPar)
		spacerObj.tubeMesh.position.y = spacerObj.shimMesh.position.y = posY;
		if ((params.treadsMaterial == "рифленая сталь" || params.treadsMaterial == "лотки под плитку") &&
			midHoldersParams.pos.indexOf(i) != -1) {
			spacerObj.tubeMesh.position.y = spacerObj.shimMesh.position.y = posY + 8;
			}
		model.add(spacerObj.tubeMesh, "carcas");
		model.add(spacerObj.shimMesh, "shims");

		posY += stepHeight;
	}


	//нижний фланец

	var flanParams = {
		material: metalMaterial1,
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
	//carcas.push(botFlan);
	model.add(botFlan, "shims");
	
	//крышка нижнего фланца
	if(params.botFlanCover == "есть"){
		var flanCover = drawBotFlanCover();
		flanCover.position.y = 0;
		model.add(flanCover, "treads");
	}


	//верхний фланец с 4 отверстиями

	var flanParams = {
		material: metalMaterial1,
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
	topFlan.position.y = stepHeight * (stairAmt + 1) + regShimAmt * regShimThk + 4 + 0.05;
	var sectionTyrnAngle = (platformAngle / 2 - platformExtraAngle + Math.PI) * turnFactor;
	if (params.platformType == "square") sectionTyrnAngle = Math.PI / 2 * turnFactor + Math.PI;
	topFlan.rotation.z = sectionTyrnAngle + Math.PI / 4;
	//carcas.push(topFlan);
	model.add(topFlan, "shims");


	//регулировочные шайбы
	var cylParams = {
		diam: columnDiam,
		holeDiam: 26,
		height: regShimThk,
		material: shimMaterial,
		partName: "regShim"
	}

	//var geom = new THREE.CylinderGeometry( radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded) 

	for (var i = 0; i < regShimAmt; i++) {
		//var regShim = new THREE.Mesh(geom, shimMaterial);
		var regShim = drawCylinder_2(cylParams).mesh;
		regShim.position.x = 0;
		regShim.position.y = (stepHeight + regShimThk) * (i + 1) - params.treadThickness - regShimThk;
		if (stairType == "metal") regShim.position.y += params.treadThickness + 4;
		if (midHoldersParams.pos.indexOf(i + 1) != -1 && stairType != "metal") {
			regShim.position.y -= 8;
		}
		model.add(regShim, "shims");
	}


	//параметры гайки
	var nutParams = {
		diam: 20,
		isLong: true,
	}


	//центральный стержень
	var maxRise = stepHeight + regShimThk;
	var maxLen = 2000;
	var endDist = 5;
	var extraLen = 70;
	//общая длина всех стержней
	var fullLen = params.staircaseHeight + 100 + params.stepAmt * regShimThk;
	if(params.platformPosition == "ниже") fullLen -= maxRise;
	//корректируем длину нижнего куска при установке на черновой пола
	if(params.botFloorType == "черновой") fullLen += params.botFloorsDist;

	var rodAmt = Math.ceil(fullLen / maxLen); //число кусков стержня
	var rodLen0 = fullLen / rodAmt; //номинальная длина куска
	var rodsLen = [];

	//считаем длины кусков так, чтобы стык стержней попадал внутрь бобышки
	var rodStepAmt = Math.round(rodLen0 / maxRise); 
	var prevRodsSumLen = 0;
	for (var i = 0; i < rodAmt-1; i++) {
		var connectionHeight = maxRise * rodStepAmt * (i+1) - posY0// + params.regShimAmt * regShimThk;
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
		
		if(i == rodAmt-1) rodPar.isLast = true;
		
		var rod = drawRod(rodPar).mesh;
		rod.position.y = posY0 + posY + endDist;
		model.add(rod, "rod");

		//удлинненная гайка на стыке
		nutParams.isLong = true;
		var nut = drawNut(nutParams).mesh;
		nut.position.y = posY0 + posY - nutParams.nutHeight / 2;
		if (i == 0) nut.position.y = posY0;
		model.add(nut, "shims");
		
		//средние стяжные гайки
		if(i > 0){
			nutParams.isLong = false;
			var nut = drawNut(nutParams).mesh;
			nut.position.y = posY0 + Math.floor(posY / maxRise) * maxRise + 8 + 0.01; //8 - костыль
			model.add(nut, "shims")
		}
		

		posY += rodsLen[i];

	}



	//верхняя удлиненная гайка
	
	nutParams.isLong = true;
	var nut = drawNut(nutParams).mesh;
	nut.position.y = stepHeight * params.stepAmt + params.regShimAmt * regShimThk + 8 + 4 + 0.5;
	if(params.platformPosition == "ниже") nut.position.y -= stepHeight;
	console.log(nut.position.y, posY0)
	model.add(nut, "shims");
	var nutTopPos = nut.position.y + nutParams.nutHeight;

	//верхняя контргайка
	nutParams.isLong = false;
	var nut = drawNut(nutParams).mesh;
	nut.position.y = nutTopPos + 0.5;
	model.add(nut, "shims");

	/*спиральные тетивы*/

	function addStringers() {}; //пустая фукнция для навигации

	if (params.model != "Винтовая") {
		var stringerMaterial = new THREE.MeshLambertMaterial({
			color: 0x363636,
			wireframe: false
		});
		stringerMaterial.side = THREE.DoubleSide;

		var stringerExtraStep = 0.5;
		if (params.model == "Спиральная") {
			stringerExtraStep = calcTriangleParams().treadOverlayLength / (treadAngle * params.staircaseDiam / 2);
		}

		var stringerParams = {
			rad: params.staircaseDiam / 2 + 1,
			height: stepHeight * (stairAmt + stringerExtraStep),
			stripeWidth: 300,
			angle: (stairAmt + stringerExtraStep) * stepAngle,
			botHeight: stepHeight,
			topHeight: 300 - stepHeight * stringerExtraStep,
			turnFactor: turnFactor,
			material: stringerMaterial,
		}
		
		var dxfStringerPar = {
			angle: stairParams.treadAngle,
			height: stringerParams.height,
			stairAmt: stairAmt,
			stepHeight: stepHeight,
			dxfBasePoint: {x:4000, y: 0,}
		}
		var stringerDXF = drawStringerDXF(dxfStringerPar);
		var stringer = stringerDXF.mesh;
		
		

		stringer.rotation.y = (platformExtraAngle - platformAngle / 2 + Math.PI);
		if (params.platformType == "square") stringer.rotation.y = -Math.PI * turnFactor;
		stringer.rotation.y += Math.PI / 2 * turnFactor;
		translateObject(stringer, -stringerDXF.lenX, 0, params.staircaseDiam / 2 * turnFactor);

		if(document.location.href.indexOf("manufacturing") != -1){		
			model.add(stringer, "stringers2");
		}
		//model.add(stringer, "stringers2");

		stringerParams = drawSpiralStripe(stringerParams);
		var stringer = stringerParams.mesh;
		stringer.rotation.x = -Math.PI / 2;
		stringer.rotation.z = startAngle - treadExtraAngle // + edgeAngle
		if (params.model == "Спиральная") stringer.rotation.z = startAngle;
		if (turnFactor == -1) stringer.rotation.z += treadAngle;

		stringer.position.x = 0;
		//stringers.push(stringer);
		model.add(stringer, "stringers");
		
		var floorAngle = drawAngleSupport("У4-70х70х100");
		floorAngle.rotation.y = stairParams.stairCaseAngle + Math.PI / 2;
		if (params.turnFactor == 1) {
			floorAngle.rotation.y = -stairParams.stairCaseAngle + Math.PI / 2;
			floorAngle.position.x += 100 * Math.cos(Math.PI * 2 - (stairParams.stairCaseAngle + Math.PI / 2));
			floorAngle.position.z -= 100 * Math.sin(Math.PI * 2 - (stairParams.stairCaseAngle + Math.PI / 2));
		}
		translateObject(floorAngle, 0, 0, -params.staircaseDiam / 2);
		model.add(floorAngle, "stringers");
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

		var height = params.staircaseHeight;
		if(params.platformPosition == "ниже") height -= par.stepHeight
		
		var lenX = (params.stepAmt - 1) * stepArcLen;
		
		var length = (par.height - botFaceOffset - topFaceHeight) / Math.sin(angle);

		var typeTread = "timber";
		if (params.treadsMaterial == "рифленая сталь" || params.treadsMaterial == "лотки под плитку") typeTread = "metal";

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
		

		var divides = calcDivides(stepHeight);

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
				var heightDivide = stepHeight * divides[j] - params.treadThickness - 8;
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
				var railingLength = Math.sqrt((stepAngle * params.staircaseDiam / 2) * (stepAngle * params.staircaseDiam / 2) + stepHeight * stepHeight) * stairAmt;
				var rackAmt = Math.ceil(railingLength / 900) + 1;
				var rackDistY = stepHeight * (stairAmt - 0.3) / (rackAmt - 1);
				var rackAngleDist = stepAngle * (stairAmt - 0.3) / (rackAmt - 1);

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

	//внутренняя спиральная тетива*/
	if (params.model == "Спиральная") {
		var stringerParams = {
			rad: params.staircaseDiam / 2 - params.M - 1,
			height: stepHeight * (stairAmt + stringerExtraStep),
			stripeWidth: 500,
			angle: (stairAmt + stringerExtraStep) * stepAngle,
			botHeight: stepHeight,
			topHeight: 500 - stepHeight * stringerExtraStep,
			turnFactor: turnFactor,
			material: stringerMaterial,
		}

		stringerParams = drawSpiralStripe(stringerParams);
		var stringer = stringerParams.mesh;
		stringer.rotation.x = -Math.PI / 2;
		stringer.rotation.z = startAngle - treadExtraAngle // + edgeAngle
		if (params.model == "Спиральная") stringer.rotation.z = startAngle;
		if (turnFactor == -1) stringer.rotation.z += treadAngle;
		stringer.position.x = 0;
		//stringers.push(stringer);
		model.add(stringer, "stringers");
	}
	
	/*площадка*/

	if(params.platformType != 'нет')addVintPlatform();

	function addVintPlatform() {

		var vintPlatformParams = {
			platformAngle: platformAngle,
			platformDepth: platformDepth,
			treadLowRad: treadLowRad,
			columnDiam: columnDiam,
			holeDiam: holeDiam,
			type: "timber",
			material: params.materials.tread,//params.materials.timber,
			metalMaterial: metalMaterial1,
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
		if (params.treadsMaterial == "рифленая сталь" || params.treadsMaterial == "лотки под плитку") {
			vintPlatformParams.type = "metal";
		// 	vintPlatformParams.material = params.materials.metal;
		}

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
		platform.position.y = stepHeight * (stairAmt + 1) + regShimAmt * regShimThk;
		platform.position.z = 0;
		platform.castShadow = true;
		//treads.push(platform);
		model.add(platform, "treads");

		//рама под деревянной площадкой

		if (vintPlatformParams.metalFrame) {
			var platform = vintPlatformParams.metalFrame;
			platform.rotation.y = Math.PI;
			platform.position.x = 0;
			platform.position.y = stepHeight * (stairAmt + 1) + regShimAmt * regShimThk;
			platform.position.z = 0;
			platform.castShadow = true;
			//carcas.push(platform);
			model.add(platform, "carcas");
		}
	} //конец площадки


	function addStaircaseRailing() {}; //пустая функция для навигации

	var banistrPositionAngle0 = treadExtraAngle - calcTriangleParams().treadOverlayAngle / 2 - startAngle;
	if (turnFactor == -1) banistrPositionAngle0 = banistrPositionAngle0 - stepAngle;


	var railingParams = {
		model: params.railingModel,
		base: "treads",
		//timberMaterial: timberMaterial,
		//metalMaterial: metalMaterial,
		rad: params.staircaseDiam / 2,
		side: "out",
		turnFactor: turnFactor,
		stepHeight: stepHeight,
		stairAmt: stairAmt,
		banisterPerStep: params.banisterPerStep,
		treadExtraAngle: treadExtraAngle,

		//stepAngle: stepAngle,
		//treadThickness: treadThickness,
		startAngle: startAngle,
		stairType: stairType,
	}
	if (params.model != "Винтовая") railingParams.base = "stringer";

	//ограждение по внешней стороне
	if (params.railingSide == "внешнее" || params.railingSide == "две") {
		railingParams = drawSpiralRailing(railingParams);
		var sect = railingParams.mesh;
		var rigels = railingParams.rigels;
		var handrail = railingParams.handrail;
		sect.rotation.y = rigels.rotation.y = handrail.rotation.y = -banistrPositionAngle0;

		model.add(sect, "railing");
		model.add(rigels, "rigels");
		model.add(handrail, "handrails");
	}

	//ограждение по внутренней стороне
	if (params.railingSide == "внутреннее" || params.railingSide == "две") {
		railingParams.rad -= params.M;
		railingParams.side = "in";
		railingParams.banisterPerStep = 1;
		railingParams = drawSpiralRailing(railingParams);
		var railingSection = railingParams.mesh;
		railingSection.rotation.y = -banistrPositionAngle0;
		//railing.push(railingSection);
		model.add(railingSection, "railing");
	}


	/*промежуточные крепления*/

	function addMidFix() {}; //пустая функция для навигации

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
		material: metalMaterial3,
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
		pole.position.y = midHoldersParams.pos[i] * stepHeight - params.treadThickness;
		var regShimAmt0 = midHoldersParams.pos[i];
		if (regShimAmt0 > regShimAmt) regShimAmt0 = regShimAmt;

		pole.position.y += regShimAmt0 * 4 - 8; //((midHoldersParams.pos[i] - regShimAmt0) * 4);// - 8;FIX
		
		if (params.treadsMaterial == "рифленая сталь" || params.treadsMaterial == "лотки под плитку"){
			pole.position.y = midHoldersParams.pos[i] * stepHeight + regShimAmt0 * 4 + 4
		}

		//carcas.push(holderParams.mesh);
		model.add(holderParams.mesh, "carcas");
		holderParams.dxfBasePoint.y -= 500;
	}

	//end of addMidFix

	/* секция ограждений площадки*/

	function addPlatformRailingSection() {}; //пустая функция для навигации


	if (params.platformSectionLength > 0) {

		specObj = partsAmt_bal; //задаем объект, куда будут сохраняться данные для спецификации

		var sectionLength = params.platformSectionLength;

		var sectionTyrnAngle = (platformAngle / 2 - platformExtraAngle + Math.PI) * turnFactor;
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
			if (turnFactor == 1) offsetZ = - 95 / 2;
			if (turnFactor == -1) offsetZ = 95;
		}

		translateObject(railingSection, offsetX, 150 + stepHeight * (stairAmt + 1) + regShimAmt * regShimThk, offsetZ);

		// railingSection.position.y = 150 + stepHeight * (stairAmt + 1) + regShimAmt * regShimThk;
		// var offset = 40/2;
		// if (params.railingModel_bal == "Деревянные балясины" || params.railingModel_bal == "Стекло" || params.railingModel_bal == "Дерево с ковкой") {
		// 	offset = 95 / 2;
		// }
		// railingSection.position.x = offset * Math.sin(sectionTyrnAngle);
		// railingSection.position.z = offset * Math.cos(sectionTyrnAngle);
		// if (params.railingModel_bal == "Самонесущее стекло") {
		// 	var centerOffset = params.columnDiam / 2 + 30;
		// 	railingSection.position.x = centerOffset * Math.sin(sectionTyrnAngle);
		// 	railingSection.position.z = centerOffset * Math.cos(sectionTyrnAngle);	
		// }
		//railing.push(railingSection);
		if (!testingMode) {
			model.add(railingSection, "railing");
		}
	};
	//addPlatformRailingSection();

	/*вспомогательные оси*
	var axes2 = new THREE.AxisHelper( 2000 );
	axes2.position.y= stepHeight * params.stepAmt// - treadThickness;
	railing.push(axes2);
	*/



	//сдвигаем и поворачиваем лестницу

	var moove = {
		x: -(params.staircaseDiam / 2 + params.platformLedge),
		y: 0,
		z: (params.staircaseDiam / 2 + 50),
		rot: Math.PI + params.stairCaseRotation / 180 * Math.PI,
	}

	if (params.platformType == "square") {
		moove.x = -(params.staircaseDiam / 2 + params.platformLedgeM);
		moove.z = (params.staircaseDiam / 2 + params.platformLedge);

		if (params.turnFactor == -1) {
			moove.rot += Math.PI / 2;
			moove.x = -(params.staircaseDiam / 2 + params.platformLedge);
			moove.z = (params.staircaseDiam / 2 + params.platformLedgeM);
		}
	}

	for (var i = 0; i < model.objects.length; i++) {
		var obj = model.objects[i].obj;
		//позиционируем
		obj.position.x += moove.x + params.staircasePosX;
		obj.position.y += params.staircasePosY;
		obj.position.z += moove.z + params.staircasePosZ;
		obj.rotation.y = moove.rot;

		//добавляем в сцену
		addObjects(viewportId, obj, model.objects[i].layer);

	}


	//измерение размеров на модели
	addMeasurement(viewportId);


	setTimeout(function() {
		if(typeof staircaseLoaded != 'undefined') staircaseLoaded();
	}, 0);

} //end of drawVintStaircase(scene);

function getIndexDivide(point, divides) {
	var index = 0;
	var startY = 0;
	var endY = 0;
	for (var i = 0; i < divides.length; i++) {
		endY = divides[i];
		if (point.y > startY && point.y < endY) return index;
		startY = endY;
		index++;
	}
	return index;
}

