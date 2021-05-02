class Screen extends AdditionalObject {
	constructor(par) {
		super(par);

		var screenPar = Object.assign({}, this.par);
		screenPar.dxfBasePoint = {x:lastDxfX, y:0}

		var mesh = Screen.draw(screenPar).mesh;
		this.add(mesh);
	}

	static draw(par){
		if(!par) par = {};
		initPar(par);
		
		//исправляем битые параметры
		var meta = this.getMeta();
		meta.inputs.forEach(function(item){
			if(item.key && par[item.key] == "undefined") {
				par[item.key] = item['default']
			}
		})

		par.mesh.add(drawScreen(par));
		
		return par;
	}
	
	/** STATIC **/
	static calcPrice(par){
		var meshPar = Object.assign({}, par.meshParams);

		var cost = calcScreenCost(par);
		
		return {
			name: this.getDescr(par).title,
			cost: cost,
			priceFactor: par.meshParams.priceFactor,
			costFactor: par.meshParams.costFactor
		}
	}

	static formChange(form, data){
	}

	static getMeta() {
		return {
			title: 'Экран на радиатор',
			inputs: [
				{
					"key": "fillingType",
					"title": "Вставка",
					"values": [
						{
							"value": "нет",
							"title": "нет"
						},
						{
							"value": "01",
							"title": "Тип 1"
						}
					],
					"default": "01",
					"type": "select"
				},
				{
					"key": "screenType",
					"title": "Тип экрана",
					"values": [
						{
							"value": "01",
							"title": "Тип 1"
						},
						{
							"value": "02",
							"title": "Тип 2"
						},
						{
							"value": "03",
							"title": "Тип 3"
						}
					],
					"default": "01",
					"type": "select"
				},
				{
					"key": "plinthType",
					"title": "Тип цоколя",
					"values": [
						{
							"value": "нет",
							"title": "Нет"
						},
						{
							"value": "01",
							"title": "Тип 1"
						},
						{
							"value": "02",
							"title": "Тип 2"
						}
					],
					"default": "нет",
					"type": "select"
				},
				{
					"key": "width",
					"title": "Ширина",
					"default": 1000,
					"type": "number"
				},
				{
					"key": "height",
					"title": "Высота",
					"default": 1000,
					"type": "number"
				},
				{
					"key": "depth",
					"title": "Глубина",
					"default": 100,
					"type": "number"
				}
			]
		}
	}
}

function drawScreen(par){
	var func = window['draw' + par.screenType + 'Screen'];
	if (func) {
		if (par.plinthType != 'нет') {
			var plinthHeight = 100;
			var screenObj = new THREE.Object3D();
			var screen = func(par);
			screen.position.y += plinthHeight;
			screenObj.add(screen);
			// Отрисовка цоколя
			screenObj.add(drawPlinth(par));

			return screenObj;
		}else{
			return func(par);
		}
	}else{
		console.warn('Не найдена функция отрисовки экрана')
	}
}

function draw01Screen(par){
	var screenObj = new THREE.Object3D();
	var plankWidth = 60;
	
	var height = par.height;
	if (par.plinthType != 'нет') height -= 100;

	var horPlankOffset = 40;
	// Боковая рейка
	var sidePlatePar = {
		len: height,
		width: plankWidth,
		thk: 20,
		partName: "screenPlate",
		material: params.materials.additionalObjectTimber
	}

	// var displacementMaterial = params.materials.additionalObjectTimber.clone();

	// new THREE.TextureLoader().load("/calculator/general/scene/objects/files/screen/d.png", function(map){
	//	 map.rotation = Math.PI / 2;
	//	 map.repeat = {x: 0.018, y: 0.018};
	//	 displacementMaterial.side = THREE.DoubleSide;

	//	 displacementMaterial.displacementMap = map;
	//	 displacementMaterial.displacementScale = 2;
	//	 displacementMaterial.displacementBias = 0.5;
	//	 displacementMaterial.needsUpdate = true;
	// });

	// console.log(displacementMaterial);
	// sidePlatePar.material = displacementMaterial;

	var horPlatePar = {
		len: par.width - plankWidth * 2,
		width: plankWidth,
		thk: 20,
		partName: "screenPlate",
		material: params.materials.additionalObjectTimber
	}

	var depthPlatePar = {
		len: height,
		width: par.depth - sidePlatePar.thk,
		thk: 20,
		partName: "screenPlate",
		material: params.materials.additionalObjectTimber
	}

	// Вертикальные рейки параллельные окну
	var sidePlate1 = drawPlate(sidePlatePar).mesh;
	sidePlate1.rotation.z = Math.PI / 2;
	sidePlate1.position.x = plankWidth;
	sidePlate1.position.z -= sidePlatePar.thk;
	screenObj.add(sidePlate1);
	
	var sidePlate2 = drawPlate(sidePlatePar).mesh;
	sidePlate2.rotation.z = Math.PI / 2;
	sidePlate2.position.x += par.width;
	sidePlate2.position.z -= sidePlatePar.thk;
	screenObj.add(sidePlate2);

	// Горизонтальные рейки
	var horPlate1 = drawPlate(horPlatePar).mesh;
	if (par.plinthType == 'нет') horPlate1.position.y += horPlankOffset;
	horPlate1.position.x = plankWidth;
	horPlate1.position.z -= sidePlatePar.thk;
	screenObj.add(horPlate1);
	
	var horPlate2 = drawPlate(horPlatePar).mesh;
	horPlate2.position.y += height - plankWidth - horPlankOffset;
	horPlate2.position.x = plankWidth;
	horPlate2.position.z -= sidePlatePar.thk;
	screenObj.add(horPlate2);


	// Рейки в сторону окна
	var depthPlate1 = drawPlate(depthPlatePar).mesh;
	depthPlate1.rotation.y = Math.PI / 2;
	depthPlate1.rotation.z = Math.PI / 2;
	// depthPlate1.position.x = -plankWidth;
	depthPlate1.position.z = -depthPlatePar.width - sidePlatePar.thk;
	console.log(sidePlatePar.thk, depthPlatePar.width)
	screenObj.add(depthPlate1);
	
	var depthPlate2 = drawPlate(depthPlatePar).mesh;
	depthPlate2.rotation.y = Math.PI / 2;
	depthPlate2.rotation.z = Math.PI / 2;
	depthPlate2.position.x += par.width - depthPlatePar.thk;
	depthPlate2.position.z -= depthPlatePar.width + sidePlatePar.thk;
	screenObj.add(depthPlate2);

	if (par.fillingType != 'нет') {

		var material = params.materials.additionalObjectTimber.clone();
		material.transparent = true;

		new THREE.TextureLoader().load("/calculator/general/scene/objects/files/screen/" + par.fillingType + ".png", function(map){
			map.repeat = {x: (1/100) * 1.3, y: (1/100) * 1.3};
			map.wrapS = THREE.RepeatWrapping;
			map.wrapT = THREE.RepeatWrapping;
			material.alphaMap = map;
			material.needsUpdate = true;
		});

		console.log(material)

		var fillingPar = {
			width: height - plankWidth * 2 - horPlankOffset * 2,
			len: par.width - plankWidth * 2,
			thk: 5,
			partName: "screenFilling",
			material: material
		}
		if (par.plinthType != 'нет') fillingPar.width = height - plankWidth * 2 - horPlankOffset;

		var fillingPlate = drawPlate(fillingPar).mesh;
		
		if (par.plinthType != 'нет'){
			fillingPlate.position.y = plankWidth;
		}else{
			fillingPlate.position.y = plankWidth + horPlankOffset;
		}

		fillingPlate.position.z = sidePlatePar.thk / 2 - sidePlatePar.thk;
		fillingPlate.position.x = plankWidth;

		screenObj.add(fillingPlate);
	}

	return screenObj;
}

function draw02Screen(par){
	var screenObj = new THREE.Object3D();
	var plankWidth = 60;
	
	var height = par.height;
	if (par.plinthType != 'нет') height -= 100;

	var betweenPlanks = 30;
	var plankWidth = 40

	var horPlatePar = {
		len: par.width,
		width: plankWidth,
		thk: 20,
		partName: "screenPlate",
		material: params.materials.additionalObjectTimber
	}

	// Боковая рейка
	 var depthPlatePar = {
		len: height,
		width: par.depth - horPlatePar.thk,
		thk: 20,
		partName: "screenPlate",
		material: params.materials.additionalObjectTimber
	}

	// Рейки в сторону окна
	var depthPlate1 = drawPlate(depthPlatePar).mesh;
	depthPlate1.rotation.y = Math.PI / 2;
	depthPlate1.rotation.z = Math.PI / 2;
	depthPlate1.position.z = -depthPlatePar.width - horPlatePar.thk;
	screenObj.add(depthPlate1);

	var depthPlate2 = drawPlate(depthPlatePar).mesh;
	depthPlate2.rotation.y = Math.PI / 2;
	depthPlate2.rotation.z = Math.PI / 2;
	depthPlate2.position.x += par.width - depthPlatePar.thk;
	depthPlate2.position.z -= depthPlatePar.width + horPlatePar.thk;
	screenObj.add(depthPlate2);

	// Горизонтальные рейки
	var count = Math.round((height - plankWidth) / (plankWidth + betweenPlanks));
	var offset = height - (count * (plankWidth + betweenPlanks));
	console.log(count, height)
	for (var i = 0; i < count; i++) {
		var horPlate1 = drawPlate(horPlatePar).mesh;
		horPlate1.position.y = offset / 2 + betweenPlanks / 2 + i * (plankWidth + betweenPlanks);
		horPlate1.position.x = 0;
		horPlate1.position.z -= horPlatePar.thk;
		screenObj.add(horPlate1);
	}

	return screenObj;
}

/** функция отрисовывает экран на радиатор с вертикальными рейками **/

function draw03Screen(par){
	var screenObj = new THREE.Object3D();
	var plateThk = 40;

	var height = par.height;
	if (par.plinthType != 'нет') height -= 100;

	// Боковые щиты
	var depthPlatePar = {
		len: height,
		width: par.depth - plateThk,
		thk: 20,
		partName: "screenPlate",
		material: params.materials.additionalObjectTimber
	}

	var depthPlate1 = drawPlate(depthPlatePar).mesh;
	depthPlate1.rotation.y = Math.PI / 2;
	depthPlate1.rotation.z = Math.PI / 2;
	depthPlate1.position.z = -depthPlatePar.width - plateThk;
	screenObj.add(depthPlate1);

	var depthPlate2 = drawPlate(depthPlatePar).mesh;
	depthPlate2.rotation.y = Math.PI / 2;
	depthPlate2.rotation.z = Math.PI / 2;
	depthPlate2.position.x += par.width - depthPlatePar.thk;
	depthPlate2.position.z -= depthPlatePar.width + plateThk;
	screenObj.add(depthPlate2);

	//вертикальные рейки
	
	var polePar = {
		len: height - plateThk,
		width: par.screenPoleSize,
		thk: plateThk,
		partName: "screenPlate",
		material: params.materials.additionalObjectTimber
	}
	
	var poleAmt = Math.round((par.width - (par.screenSidePoleSize - par.screenPoleSize) - par.screenSidePoleSize) / par.screenPoleStep)
	var poleStep = (par.width - (par.screenSidePoleSize - par.screenPoleSize) - par.screenSidePoleSize) / (poleAmt)
	
	var posX = 0;
	for (var i = 0; i <= poleAmt; i++) {
		//крайние бруски большей ширины
		if(i == 0 || i == poleAmt) {
			polePar.width = par.screenSidePoleSize
			polePar.len = height
		}
		else {
			polePar.width = par.screenPoleSize
			polePar.len = height - plateThk
		}
		
		var pole = drawPlate(polePar).mesh;
		pole.rotation.y = Math.PI;
		pole.rotation.z = Math.PI / 2;
		pole.position.x = posX;
		pole.position.y = plateThk;
		if(i == 0 || i == poleAmt) pole.position.y = 0;
		screenObj.add(pole);
		posX += poleStep;
		if(i==0) posX += par.screenSidePoleSize - par.screenPoleSize;
	}
	
	//нижняя рейка
	var depthPlatePar = {
		len: par.width - par.screenSidePoleSize * 2,
		width: plateThk,
		thk: plateThk,
		partName: "screenPlate",
		material: params.materials.additionalObjectTimber
	}

	var depthPlate1 = drawPlate(depthPlatePar).mesh;
	depthPlate1.position.x = par.screenSidePoleSize;
	depthPlate1.position.z = -plateThk;
	screenObj.add(depthPlate1);
	
	
	return screenObj;
}

// Отрисовка цоколя
function drawPlinth(par){
	var plinthObj = new THREE.Object3D();
	var plateThk = 20;
	var plinthHeight = 100;

	// Боковая рейка
	var depthPlatePar = {
		len: plinthHeight,
		width: par.depth - plateThk,
		thk: 20,
		partName: "screenPlate",
		material: params.materials.additionalObjectTimber
	}

	// Рейки в сторону окна
	var depthPlate1 = drawPlate(depthPlatePar).mesh;
	depthPlate1.rotation.y = Math.PI / 2;
	depthPlate1.rotation.z = Math.PI / 2;
	depthPlate1.position.z = -depthPlatePar.width - plateThk;
	plinthObj.add(depthPlate1);

	var depthPlate2 = drawPlate(depthPlatePar).mesh;
	depthPlate2.rotation.y = Math.PI / 2;
	depthPlate2.rotation.z = Math.PI / 2;
	depthPlate2.position.x += par.width - depthPlatePar.thk;
	depthPlate2.position.z -= depthPlatePar.width + plateThk;
	plinthObj.add(depthPlate2);

	var platePoints = [];
	console.log(par.width, plinthHeight)
	var p0 = {x:0,y:0};
	var p1 = newPoint_xy(p0, 0, plinthHeight);
	var p2 = newPoint_xy(p1, par.width, 0);
	var p3 = newPoint_xy(p2, 0, -plinthHeight);
	platePoints.push(p0, p1, p2, p3);

	if (par.plinthType == '01') {
		var p4 = newPoint_xy(p3, -100, 0);
		var p5 = newPoint_xy(p4, 0, 50);
		var p6 = newPoint_xy(p5, -par.width + 100 * 2, 0);
		var p7 = newPoint_xy(p6, 0, -50);
		p4.filletRad = p7.filletRad = 5;
		p5.filletRad = p6.filletRad = 40;
		platePoints.push(p4,p5,p6,p7);
	}

	if (par.plinthType == '02') {
		var p4 = newPoint_xy(p3, -100, 0);
		var p5 = newPoint_xy(p4, 0, 50);
		var p6 = newPoint_xy(p5, -(par.width / 2 - 100 - 50), 0)
		var p7 = newPoint_xy(p6, 0, -50)
		var p8 = newPoint_xy(p7, -100, 0)
		var p9 = newPoint_xy(p8, 0, 50)
		var p10 = newPoint_xy(p5, -par.width + 100 * 2, 0);
		var p11 = newPoint_xy(p10, 0, -50);
		
		p4.filletRad = p7.filletRad = p7.filletRad = p8.filletRad = p11.filletRad = 5;
		p5.filletRad = p6.filletRad = p9.filletRad = p10 .filletRad = 40;

		platePoints.push(p4,p5,p6,p7,p8,p9,p10,p11);
	}

	var shapePar = {
		points: platePoints,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: {x:0,y:0}
	}
	var shape = drawShapeByPoints2(shapePar).shape
	
	var extrudeOptions = {
		amount: plateThk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));	
	var plinth = new THREE.Mesh(geom, params.materials.additionalObjectTimber);
	plinth.position.z = -plateThk;
	plinthObj.add(plinth);
	console.log(plinth)

	return plinthObj;
}

function calcScreenCost(par){
	var cost = 0;
	var plateVolume = getDopPartPropVal('screenPlate', "volume")
	var platePaintArea = getDopPartPropVal('screenPlate', "paintedArea")
	
	
	var timberPar = calcTimberParams(params.additionalObjectsTimberMaterial);
	var paintPriceM2 = calcTimberPaintPrice(params.timberPaint, params.additionalObjectsTimberMaterial)
	cost +=	plateVolume * timberPar.m3Price + platePaintArea * paintPriceM2;

	// Для типа 3 рисуется панель
	
	var plateVolume = getDopPartPropVal('screenPanel', "volume")
	var platePaintArea = getDopPartPropVal('screenPanel', "paintedArea")
	
	var timberPar = calcTimberParams(params.additionalObjectsTimberMaterial);
	var paintPriceM2 = calcTimberPaintPrice(params.timberPaint, params.additionalObjectsTimberMaterial)
	cost +=	plateVolume * timberPar.m3Price + platePaintArea * paintPriceM2;

	return cost;
}