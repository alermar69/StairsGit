var boltDiam = 10;
var partPar = {};

drawCarport = function (par) {
	var viewportId = 'vl_1';
	//удаляем старую лестницу
	for(var layer in layers){
		removeObjects(viewportId, layer);
	}
	
	//очищаем глобальный массив параметров для спецификации
	staircasePartsParams = {
		carport: []
	};

	var model = {
		objects: [],
		add: function(obj, layer){
			var objInfo = {
				obj: obj,
				layer: layer,
			}
			this.objects.push(objInfo);
		},
	};
	
	//обнуляем счетчики спецификации
	partsAmt = {};
	partsAmt_bal = {unit: "banister"}
	specObj = partsAmt; //задаем объект, куда будут сохраняться данные для спецификации
	poleList = {};
	railingParams = {};
	shapesList = [];
	dxfPrimitivesArr = [];
	
	//параметры всех деталей
	partPar = calcCarportPartPar();
/*	
	var axis = new THREE.AxisHelper( 2000 );
	model.add(axis);
*/	
	var drawFunc = drawRectCarport;
	if(params.carportType == "купол") drawFunc = drawSpherePavilion;
	if(params.carportType == "сдвижной") drawFunc = drawArcPavilion;
	if(params.carportType == "многогранник") drawFunc = drawPolygonPavilion;
	
	var carport = window.mainObj = drawFunc(params);
	model.add(carport, "carport");
	// window.carport = carport;

	for(var i=0; i<model.objects.length; i++){		
		var obj = model.objects[i].obj;
		obj.layerName = model.objects[i].layer;
		
		//добавляем в сцену
		addObjects(viewportId, obj, model.objects[i].layer);
	}

	//измерение размеров на модели
	addMeasurement(viewportId);

	if (typeof staircaseLoaded !== undefined) staircaseLoaded();
	
};



/** функция отрисовывает купольный сферический навес со сдвижной дверью
*/

function drawSpherePavilion(par){
	
	//неподвижная часть
	var dome = new THREE.Object3D();
	
	par.fullAngle = Math.PI * 2 - params.doorAng / 180 * Math.PI;
	par.extraRad = 0;
	par.isMovable = false;
	dome.add(drawSphereSegment(par))
	
	//подвижная часть (дверь)
	params.overlayAng = 5; //угол нахлеста двери на неподвижну часть с каждой стороны
	par.fullAngle = (params.doorAng + params.overlayAng * 2) / 180 * Math.PI;
	par.extraRad = 70;
	par.isMovable = true;
	var door = window.domeDoor = drawSphereSegment(par)
	door.rotation.y = -par.fullAngle + (params.overlayAng / 180 * Math.PI)
	dome.add(door)
	
	window.carportColumns = dome;
		
	return dome;
}

/** функция отрисовывает сегмент шарового купола
	fullAngle  - полный угол сектора
	extraRad - увеличение радиуса и высоты по сравнению со значением из параметров
*/

function drawSphereSegment(par){

	var dome = new THREE.Object3D();
	if(!par.dxfBasePoint) par.dxfBasePoint = {x:0,y:0}
	if(!par.extraRad) par.extraRad = 0;
	
	//параметры дуг
	var arcPar = getProfParams(par.progonProf);
	
	//радиус и полная высота купола
	var rad = params.domeDiam / 2 + par.extraRad;
	var height = params.height + par.extraRad;
	
	//разница по высоте в сравнении с половиной сферы
	var extraHeight = height - rad;

	//отступ снизу
	var botOffset = 0;
	if(par.isMovable) botOffset = 50;
	
	var extraAngle = Math.atan((extraHeight - botOffset) / (rad));
	
	if(params.cylinderBase == "есть") extraAngle = 0;
	
	//кольцо в основании
	var baseRing = {
		rad: rad * Math.cos(extraAngle),
	}
	baseRing.len = par.fullAngle * baseRing.rad
	
	var arcPanelPar = {
		rad: baseRing.rad,
		height: 30,
		thk: 60,
		angle: Math.PI * 1.999,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
		material: params.materials.metal,
		partName: 'progonProf',
		dxfPrimitivesArr: []
	}
	
	if(par.isMovable){
		arcPanelPar.angle = par.fullAngle;
		arcPanelPar.height = arcPar.sizeA;
		arcPanelPar.thk = arcPar.sizeB;
	}
	
	var ring = drawArcPanel(arcPanelPar).mesh;
	
	ring.rotation.x = -Math.PI / 2;
	ring.position.y = botOffset
	dome.add(ring)
	
	//второе кольцо на переходе сферы в цилиндр
	
	if(params.cylinderBase == "есть"){
		arcPanelPar.angle = par.fullAngle;
		var ring = drawArcPanel(arcPanelPar).mesh;	
		ring.rotation.x = -Math.PI / 2;
		ring.position.y = extraHeight;
		dome.add(ring)
	}
		
	//верхний фланец
	var flanPar = {
		diam: 400,		
	}
	if(par.isMovable) flanPar.bearingHeight = par.extraRad; //высота подшипника)
	
	var flan = drawDomeTopFlan(flanPar).mesh;
	flan.rotation.x = -Math.PI / 2;
	flan.position.y = height;
	dome.add(flan)
	
	//дуги
	var arcStepMax = 1000; //макс. шаг дуг
	var arcAmt = Math.ceil(baseRing.len / arcStepMax);
	var arcStepAng = par.fullAngle / arcAmt;

	//параметры дуги из профиля
	var arcPanelPar = {
		rad: rad,
		height: arcPar.sizeA,
		thk: arcPar.sizeB,
		angle: Math.PI / 2 + extraAngle,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
		material: params.materials.metal,
		partName: 'progonProf',
		dxfPrimitivesArr: []
	}
	
	//укорачиваем дуги на половину диаметра верхнего диска
	arcPanelPar.angle -= flanPar.diam / 4 / rad;
	
	//перемычки между дугами		
	var bridgePosY = params.height / 2;
	var bridgePosAng = Math.asin((bridgePosY - extraHeight) / rad)
	var bridgePosRad = rad * Math.cos(bridgePosAng) - arcPar.sizeB;
	
	var bridgePar = {
		poleProfileY: arcPar.sizeA,
		poleProfileZ: arcPar.sizeB,
		dxfBasePoint: par.dxfBasePoint,
		length: bridgePosRad * arcStepAng, //упрощенная формула - надо править
		poleAngle: 0,
		material: params.materials.metal,
		dxfArr: [],
		type: 'rect',
		partName: 'carportColumn'
	};
		
	//параметры сектора из поликарбоната
	var sectorPolyPar = {
		rad: rad,
		height: arcPar.sizeA,
		thk: params.roofThk,
		angleWidth: arcStepAng,
		extraAngle: extraAngle,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
		material: params.materials.plastic_roof,
		dxfArr: [],
	}
	
	//параметры цилиндрических листов из поликарбоната
	
	var arcSheetPar = {
		rad: baseRing.rad,
		height: extraHeight - botOffset,
		thk: params.roofThk,
		angle: arcStepAng,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
		material: params.materials.plastic_roof,
		partName: 'polySheet',
		dxfPrimitivesArr: []
	}

	for(var i=0; i<= arcAmt; i++){
		var pos = polar({x:0, y:0}, arcStepAng * i, -arcPanelPar.height / 2); //смещение на половину профиля
		
		//отрисовка дуг
		var arcProf = drawArcPanel(arcPanelPar).mesh;
		arcProf.rotation.z = -extraAngle;
		arcProf.rotation.y = arcStepAng * i;
		arcProf.position.x = pos.y;
		arcProf.position.y = extraHeight;
		arcProf.position.z = pos.x;
		dome.add(arcProf)
		
		//перемычки между дугами
		if(params.cylinderBase == "нет" && i != arcAmt){
			var bridgePos = polar({x:0, y:0}, -arcStepAng * i, bridgePosRad)
			
			var bridge = drawPole3D_4(bridgePar).mesh;
			bridge.rotation.y = arcStepAng * (i + 0.5) + Math.PI / 2;
			bridge.position.x = bridgePos.x;
			bridge.position.y = bridgePosY;
			bridge.position.z = bridgePos.y;
			
			dome.add(bridge)
		}
		
		//цилиндрическая часть
		if(params.cylinderBase == "есть"){
			
			//вертикальные стойки
			var polePar = {
				poleProfileY: arcPar.sizeA,
				poleProfileZ: arcPar.sizeB,
				dxfBasePoint: par.dxfBasePoint,
				length: extraHeight - botOffset,
				poleAngle: 0,
				material: params.materials.metal,
				dxfArr: [],
				type: 'rect',
				partName: 'carportColumn'
			};
			
			var pos = polar({x:0, y:0}, -arcStepAng * i, baseRing.rad)
			
			var rack = drawPole3D_4(polePar).mesh;
			rack.rotation.y = arcStepAng * i + Math.PI / 2;
			rack.rotation.z = Math.PI / 2;
			rack.position.x = pos.x;
			rack.position.y = botOffset;
			rack.position.z = pos.y;

			dome.add(rack)
			
			//поликарбонат цилиндры
			if(i != arcAmt){
				var sheet = drawArcPanel(arcSheetPar).mesh;
				sheet.rotation.z = -arcStepAng * (i + 1);
				sheet.rotation.x = Math.PI / 2;
				//sheet.position.x = pos.y;
				sheet.position.y = extraHeight;
				//sheet.position.z = pos.x;
				dome.add(sheet)
			}
			
		}
	
		//поликарбонат сегменты
		if(i != arcAmt){
			var coverSector = drawSphereSector(sectorPolyPar).mesh;
			coverSector.rotation.y = arcStepAng * i + Math.PI;
			coverSector.position.y = extraHeight
			dome.add(coverSector)
		}
		
	}
	

	
	dome.setLayer('carcas');
	
	return dome;
}

/** функция отрисовывает кровлю навеса
	var roofPar = {
		topArc: ,
	}
*/

function drawRoof(par){
	
	if(!par.dxfBasePoint) par.dxfBasePoint = {x:0,y:0}
	var roof = new THREE.Object3D();
	if(!par.progonProfY) par.progonProfY = 0;
	if(!par.len) par.len = partPar.main.len + partPar.roofSheet.overhang * 2;

//арочная кровля
	
	if(params.roofType == "Арочная") {

		//поликарбонат
		var roofRad = par.topArc.rad + params.roofThk;
		if(params.beamModel != "проф. труба") roofRad += partPar.purlin.profSize.y;
			
		var halfAngle = (par.topArc.startAngle - par.topArc.endAngle) / 2;
		var extraAngle = partPar.roofSheet.overhang / roofRad; //свес сбоку

		var sheetWidth = 2100;
		var sheetStep = sheetWidth;
		var sheetAmt = Math.ceil(par.len / sheetWidth);
		for (var i = 0; i < sheetAmt; i++) {			
			//последний лист неполной ширины
			if ( i == ( sheetAmt - 1 )) sheetWidth = par.len - sheetStep * i;

			var arcPanelPar = {
				rad: roofRad,
				height: sheetWidth,
				thk: params.roofThk,
				angle: halfAngle * 2 + extraAngle * 2,
				dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
				material: params.materials.plastic_roof,
				partName: 'polySheet',
				dxfPrimitivesArr: []
			}
			
			var sheet = drawArcPanel(arcPanelPar).mesh;
			
			sheet.rotation.z = par.topArc.endAngle - extraAngle;
			if (params.carportType == "односкатный" || params.carportType.indexOf("консольный") != -1){
				//sheet.rotation.z = Math.PI / 2;// - extraAngle;
				sheet.position.x = params.width / 2;
			}
			
			sheet.position.z = sheetStep * i;
			sheet.position.y = par.topArc.center.y;
			sheet.setLayer('roof');
			roof.add(sheet);

			// Соединительный профиль
			if (i < (sheetAmt - 1)) {
				var polyProfilePar = {
					rad: roofRad,
					thk: params.roofThk + 2,
					angle: arcPanelPar.angle,
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
					dxfPrimitivesArr: []
				}
				var polyProfile = drawPolyConnectionProfile(polyProfilePar);
		
				polyProfile.rotation.z = sheet.rotation.z;

				polyProfile.position.x = sheet.position.x;
				polyProfile.position.y = sheet.position.y;
				polyProfile.position.z = sheetWidth * i + sheetWidth;
				
		
				polyProfile.setLayer('roof');
				roof.add(polyProfile);
			}
		}
		
		// Краевой профиль
		
		//параметры одного профиля
		var edgePolyPar = {
			poleProfileY: 10,
			poleProfileZ: params.roofThk + 2,
			dxfBasePoint: {x:0,y:0},
			length: par.len,
			poleAngle: 0,
			material: params.materials.metal,
			dxfArr: [],
			type: 'rect',
			partName: 'polyEdgeProf'
		};
		
		//параметры массива профилей
		var arrPar = {
			center: par.topArc.center,
			rad: roofRad - edgePolyPar.poleProfileZ / 2,
			drawFunction: drawPole3D_4,
			startAngle: par.topArc.startAngle + extraAngle,
			endAngle: par.topArc.endAngle - extraAngle,
			itemAmt: 2,
			itemPar: edgePolyPar,
			itemWidth: edgePolyPar.poleProfileY,
			rot: {y: Math.PI / 2},
		}
	
		//отрисовка кругового массива краевых профилей
		var profArr = drawArcArray(arrPar).mesh;
	
		if (params.carportType == "односкатный" || params.carportType.indexOf("консольный") != -1){
			profArr.position.x = -params.width / 2 + params.sideOffset + partPar.column.profSize.y / 2;
		}
		profArr.position.z = par.len;
		profArr.setLayer('carcas');
		profArr.setLayer('roof');
		roof.add(profArr);
	}

//плоская кровля
	
	if(params.roofType != "Арочная") {
		var roofAng = THREE.Math.degToRad(params.roofAng);
		var sheetLen = (params.width + partPar.roofSheet.overhang * 2) / Math.cos(roofAng);
		if (params.carportType == "двухскатный") sheetLen *= 0.5;
		
		//листы кровли
		if(params.roofMat.indexOf("поликарбонат") != -1){
			var sheetWidth = 2100;
			var sheetDrawFunc = drawPole3D_4;
			var sheetPar = {
				poleProfileY: params.roofThk,
				poleProfileZ: sheetWidth,
				dxfBasePoint: {x:0,y:0},
				length: sheetLen,
				material: params.materials.plastic_roof,
				dxfArr: [],
				type: 'rect',
				partName: 'polySheet'
			};
		}
		
		if(params.roofMat == "профнастил" || params.roofMat == "металлочерепица") {
			var sheetWidth = 1000;
			var sheetDrawFunc = drawWaveSheet;
			var sheetPar = {
					len: sheetLen,
					width: sheetWidth,
				}
			
		}
		
		var sheetStep = sheetWidth;
		var sheetAmt = Math.ceil(par.len / sheetWidth);
		
		//цикл отрисовки листов кровли
		for(var i=0; i<sheetAmt; i++){
			var pos = {
					x: sheetWidth * i,
					y: sheetLen * Math.sin(roofAng),
				}
			//последний лист неполной ширины
			if ( i == ( sheetAmt - 1 )) {
				sheetPar.poleProfileZ = par.len - sheetStep * i; //для поликарбоната
				sheetPar.width = par.len - sheetStep * i; //для профлиста
			} 
		
			// левый скат
			var sheet = sheetDrawFunc(sheetPar).mesh;
			sheet.rotation.z = roofAng;
			sheet.position.z = sheetWidth * i;

			//точка на краю фермы
			var pos = newPoint_xy(partPar.truss.endPoint, -params.width/2 + params.sideOffset + partPar.column.profSize.y / 2, 0)
			//смещаем на свес поликарбоната
			pos = polar(pos, THREE.Math.degToRad(params.roofAng), -partPar.roofSheet.overhang)
			//смещаем на высоту прогона
			pos = polar(pos, THREE.Math.degToRad(params.roofAng + 90), partPar.purlin.profSize.y)
			
			sheet.position.x = pos.x
			sheet.position.y = pos.y

			sheet.setLayer('roof');
			roof.add(sheet);

			// Соединительный профиль
			if (params.roofMat.indexOf("поликарбонат") != -1 &&  i < (sheetAmt - 1)) {
				var polyProfilePar = {
					length: sheetLen,
					thk: params.roofThk + 2,
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
					dxfPrimitivesArr: []
				}
				var polyProfile = drawPolyConnectionProfile(polyProfilePar);
				
				polyProfile.rotation.z = sheet.rotation.z;
				polyProfile.position.z = sheet.position.z + sheetStep - 20;
				polyProfile.position.x = sheet.position.x;
				polyProfile.position.y = sheet.position.y + params.roofThk / Math.cos(roofAng);
		
				polyProfile.setLayer('roof');
				roof.add(polyProfile);
			}
			
			
			if (params.carportType == "двухскатный") {
				// правый скат
				var sheet = sheetDrawFunc(sheetPar).mesh;				
				
				//учитываем переворот листа и смещаем на толщину листа
				pos = polar(pos, THREE.Math.degToRad(90 - params.roofAng), params.roofThk)
			
				sheet.rotation.z = Math.PI - roofAng;
				sheet.position.x = -pos.x;
				sheet.position.y = pos.y;
				sheet.position.z = sheetWidth * i;
				
				if(params.roofMat == "профнастил" || params.roofMat == "металлочерепица"){
					sheet.rotation.y = Math.PI
					sheet.rotation.z = roofAng;
					sheet.position.z += sheetPar.width;
				}
				
				sheet.setLayer('roof');
				roof.add(sheet);
	
				// Соединительный профиль
				if (params.roofMat.indexOf("поликарбонат") != -1 && i < (sheetAmt - 1)) {
					var polyProfilePar = {
						length: sheetLen,
						thk: params.roofThk + 2,
						dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
						dxfPrimitivesArr: []
					}
					var polyProfile = drawPolyConnectionProfile(polyProfilePar);
					
					polyProfile.rotation.z = sheet.rotation.z;
					polyProfile.position.z = sheet.position.z + sheetStep - 20;
					polyProfile.position.x = sheet.position.x;
					polyProfile.position.y = sheet.position.y + params.roofThk / Math.cos(roofAng);
			
					polyProfile.setLayer('roof');
					roof.add(polyProfile);
				}
				
				//коньковый профиль
				
			}
		}
		
		//краевой профиль
		
		if(params.roofMat.indexOf("поликарбонат") != -1){
			//параметры профиля
			var edgePolyPar = {
				poleProfileY: 10,
				poleProfileZ: params.roofThk + 2,
				dxfBasePoint: {x:0,y:0},
				length: par.len,
				poleAngle: 0,
				material: params.materials.metal,
				dxfArr: [],
				type: 'rect',
				partName: 'polyEdgeProf'
			};
			
			var prof = drawPole3D_4(edgePolyPar).mesh;
			prof.rotation.y = Math.PI / 2
			prof.position.x = pos.x
			prof.position.y = pos.y
			prof.position.z = par.len
			prof.setLayer('roof');
			roof.add(prof);
			
			//профиль на другой стороне двухскатного навеса
			var prof = drawPole3D_4(edgePolyPar).mesh;
			prof.rotation.y = Math.PI / 2
			prof.position.x = -pos.x
			prof.position.y = pos.y
			prof.position.z = par.len

			//профиль наверху односкатного навеса
			//TODO: сделать тут коньковый профиль для двухскатного или профиль примыкания к стене для односкатного
			if (params.carportType == "односкатный" || params.carportType.indexOf("консольный") != -1){
				var pos1 = polar(pos, THREE.Math.degToRad(params.roofAng), sheetLen)
				prof.position.x = pos1.x
				prof.position.y = pos1.y
			}
			
			prof.setLayer('roof');
			roof.add(prof);
			
		}
		
	}
	
	
	//центр массива в точке 0,0
	var box3 = new THREE.Box3().setFromObject(roof);
	if (params.carportType != "односкатный" && params.carportType.indexOf("консольный") == -1){
		roof.position.x -= (box3.max.x + box3.min.x) / 2;
	}
	roof.position.z -= (box3.max.z + box3.min.z) / 2;

	return roof;
}

/** функция отрисовывает стенки навеса **/

function drawCarportWalls(par){
	if(!par) par = {};
	par.mesh = new THREE.Object3D();
	
	//продольные стены
	var wallPar = {
		len: params.sectLen * params.sectAmt,
	}
	
	//левая стена
	if(params.isWall1){
		var wall = drawCarportWall(wallPar).mesh;
		wall.rotation.y = Math.PI / 2;
		wall.position.x = -params.width / 2 + params.sideOffset
		wall.position.z = wallPar.len / 2
		par.mesh.add(wall)
	}
	
	//правая стена
	if(params.isWall2){
		var wall = drawCarportWall(wallPar).mesh;
		wall.rotation.y = -Math.PI / 2;
		wall.position.x = params.width / 2 - params.sideOffset
		wall.position.z = -wallPar.len / 2
		par.mesh.add(wall)
	}
	
	
	//поперечные стены
	wallPar = {
		len: params.width - params.sideOffset * 2,
	}
	
	//передняя стена
	if(params.isWall3){
		var wall = drawCarportWall(wallPar).mesh;
		wall.rotation.y = Math.PI;
		wall.position.x = params.width / 2 - params.sideOffset
		wall.position.z = params.sectLen * params.sectAmt / 2
		par.mesh.add(wall)
	}
	
	//задняя стена
	if(params.isWall4){
		var wall = drawCarportWall(wallPar).mesh;
		wall.position.x = -params.width / 2 + params.sideOffset
		wall.position.z = -params.sectLen * params.sectAmt / 2
		par.mesh.add(wall)
	}
	
	//фронтон спереди
	if(params.frontCover == "спереди" || params.frontCover == "две"){
		var wall = drawFronton().mesh;
/*
		if(params.roofType == "Плоская"){
			wall.position.x = 0
			wall.position.y = params.height + 
				params.width / 2 * Math.tan(THREE.Math.degToRad(params.roofAng)) + 
				partPar.truss.endHeight - params.sideOffset * Math.tan(THREE.Math.degToRad(params.roofAng));
			wall.position.z = params.sectLen * params.sectAmt / 2 - params.wallThk
		}
*/

		wall.position.x = -params.width / 2 + params.sideOffset
		wall.position.y = params.height	
		wall.position.z = params.sectLen * params.sectAmt / 2
		par.mesh.add(wall)

		
		par.mesh.add(wall)
	}
	
	//фронтон сзади
	if(params.frontCover == "сзади" || params.frontCover == "две"){
		var wall = drawFronton().mesh;
		wall.position.x = -params.width / 2 + params.sideOffset
		wall.position.y = params.height	
		wall.position.z = -params.sectLen * params.sectAmt / 2
		par.mesh.add(wall)
	}
	
	
	return par;
}

/** функция отрисовывает беседку в форме многоугольника
*/

function drawPolygonPavilion(par){
	//неподвижная часть
	var pavilion = new THREE.Object3D();
	
	var center = {x:0, y:0, z:0}
	
	var edgeAng = Math.PI * 2 / params.edgeAmt;
	var segmentPar = {
			angle: edgeAng,
		}
	
	for(var i=0; i<params.edgeAmt; i++){
		
		var segment = drawPolygonSegment(segmentPar).mesh
		segment.rotation.y = edgeAng * i
		pavilion.add(segment)
		//break
	}
	
	return pavilion;
}

/** функция отрисовывает сегмент многоугольного павильона
	angle  - полный угол сектора
*/

function drawPolygonSegment(par){
	
	par.mesh = new THREE.Object3D();
	if(!par.dxfArr) par.dxfArr = [];
	if(!par.dxfBasePoint) par.dxfBasePoint = {x:0, y:0};
	if(!par.extraRad) par.extraRad = 0;
	
	//радиус вписанной окружности
	par.minRad = params.domeDiam / 2 * Math.cos(par.angle / 2)
	
	//высота кровли от мауэрлата до конька
	par.roofHeight = par.minRad * Math.tan(params.roofAng / 180 * Math.PI)
	
	//длина ребра
	var edgeLen = params.domeDiam / 2 * Math.sin(par.angle / 2) * 2
	
	var roofBeemLen = par.roofHeight / Math.sin((params.roofAng / 180 * Math.PI))
	
	//параметры колонн
	var columnProfPar = getProfParams(params.columnProf)
	var columnPar = {
		poleProfileY: columnProfPar.sizeA,
		poleProfileZ: columnProfPar.sizeB,
		dxfBasePoint: par.dxfBasePoint,
		length: params.height,
		poleAngle: 0,
		material: params.materials.metal,
		dxfArr: [],
		type: 'rect',
		partName: 'carportColumn'
	};
	
	//колонна
	var rack1 = drawPole3D_4(columnPar).mesh;
	rack1.rotation.z = Math.PI / 2;
	rack1.position.x = -edgeLen / 2 + columnPar.poleProfileZ;
	rack1.position.z = -par.minRad;
	
	if(params.fixType == "бетон") rack1.position.y = -1200;
	rack1.setLayer('racks');
	par.mesh.add(rack1);
	
	//балки мауэрлата
	var horBeamPar = {
		poleProfileY: columnProfPar.sizeA,
		poleProfileZ: columnProfPar.sizeB,
		dxfBasePoint: par.dxfBasePoint,
		length: edgeLen,
		poleAngle: 0,
		material: params.materials.metal,
		dxfArr: [],
		type: 'rect',
		partName: 'carportBeam'
	};
	var horBeam = drawPole3D_4(horBeamPar).mesh;

	//horBeam.rotation.y = par.angle + Math.PI;
	horBeam.position.x = -horBeamPar.length / 2;
	horBeam.position.z = -par.minRad;
	horBeam.position.y = params.height;
	
	horBeam.setLayer('racks');
	par.mesh.add(horBeam);
	
	//рамки кровли
	
	var roofEdgeAng =  Math.atan(horBeamPar.length / 2 / roofBeemLen) * 2; //угол между гранями листа, примыкающими к шпилю	
	
	var framePar = {
		ang: roofEdgeAng,
		edgeLen: (roofBeemLen + params.sideOffset) / Math.cos(roofEdgeAng / 2), //длина ребра
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: {x: 2000, y:0},
		sideOffset: 50,
		topOffset: 200,
	}
	
	var frame = drawPolygonRoofSectorFrame(framePar).mesh;
	frame.rotation.x = -params.roofAng / 180 * Math.PI + Math.PI / 2;
	frame.position.y = params.height + par.roofHeight + horBeamPar.poleProfileY;
	
	par.mesh.add(frame);


	//листы кровли
	
	var roofSegmentPar = {
		ang: roofEdgeAng,
		edgeLen: (roofBeemLen + params.sideOffset) / Math.cos(roofEdgeAng / 2),	
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: {x: 2000, y:0},
	}

	//учитываем толщину рамки
	roofSegmentPar.edgeLen += (partPar.rafter.profSize.y + params.roofThk) * Math.tan(params.roofAng / 180 * Math.PI) + 50; //50 - подогнано
	
	var sheet = drawPolygonRoofSector(roofSegmentPar).mesh
	sheet.setLayer('roof');
	
	sheet.rotation.x = -params.roofAng / 180 * Math.PI + Math.PI / 2;
	sheet.position.y = params.height + par.roofHeight + horBeamPar.poleProfileY;
	//толщина рамки
	sheet.position.y += (partPar.rafter.profSize.y + params.roofThk) / Math.cos(params.roofAng / 180 * Math.PI)
	
	par.mesh.add(sheet);
	
	return par;
}

/** функция отрисовывает сдвижной навес для бассейна
*/

function drawArcPavilion(par){

	var pavilion = new THREE.Object3D();
	window.moovableSections = [];
	
	//рассчитываем параметры сегмента
	var sPar = calcSegmentPar(params.width, params.height)
	var topRad = sPar.rad
	var center = sPar.center
		
	//разница по высоте в сравнении с половиной сферы
	var extraHeight = height - rad;
	
	for(var i=0; i<params.sectAmt; i++){
		var section = new THREE.Object3D();
		
		var rad = topRad - 100 * i;
		
		//точки пересечения дуги с горизонтом
		var points = itercectionLineCircle({x:0, y:0}, {x:1, y:0}, center, rad)
		var width = points[0].x - points[1].x;
		var a1 = angle( center, points[1]) + Math.PI
		if(a1 == Math.PI * 2) a1 = Math.PI
		
		console.log(points, width, a1)
		//дуги
		var sectPar = {
			len: params.sectLen,
			width: width,
			a1: a1,
			rafterAmt: Math.ceil(params.sectLen / 700) + 1,
		}

		var sect = drawRoofCarcas(sectPar).mesh
		sect.position.z = params.sectLen * i
		section.add(sect)
		
		//кровля		
		var roofPar = {
			topArc: sectPar.topArc,
			len: params.sectLen,
		}
		
		var roof = drawRoof(roofPar)
		roof.position.z = sect.position.z - params.sectLen / 2
		roof.setLayer('roof');
		section.add(roof);
		
		//направляющие
		var polePar = {
			poleProfileY: partPar.purlin.profSize.x,
			poleProfileZ: partPar.purlin.profSize.y,
			dxfBasePoint: par.dxfBasePoint,
			length: params.sectAmt * params.sectLen,
			material: params.materials.metal,
			partName: 'purlinProf'
		};
		
		var rail = drawPole3D_4(polePar).mesh;
		rail.rotation.y = -Math.PI / 2
		rail.position.x = -width / 2
		rail.position.z = -params.sectLen / 2
		pavilion.add(rail);
		
		var rail = drawPole3D_4(polePar).mesh;
		rail.rotation.y = -Math.PI / 2
		rail.position.x = width / 2
		rail.position.z = -params.sectLen / 2
		pavilion.add(rail);
		
		//фронтон
		if(params.wallMat != "нет"){
			var wallPar = {
					topArc: sectPar.topArc,
					width: width,
				}
				
			//передний фронтон
			if(i == 0 && (params.frontCover == "спереди" || params.frontCover == "две")){				
				var wall = drawFronton(wallPar).mesh;
				wall.position.z = -params.sectLen / 2
				wall.position.x = -params.width / 2
				section.add(wall)
			}
			
			//задний фронтон
			if(i == params.sectAmt - 1 && (params.frontCover == "сзади" || params.frontCover == "две")){				
				var wall = drawFronton(wallPar).mesh;
				wall.rotation.y = Math.PI
				wall.position.z = (params.sectAmt - 0.5) * params.sectLen
				wall.position.x = width / 2
				section.add(wall)
			}
		}
		pavilion.add(section)
		window.moovableSections.push(section)
	}
	

	window.carportColumns = pavilion;
	
	return pavilion;
}


/** функция отрисовывает прямоугольный навес
	ось навеса вдоль оси Z
	ноль по X на середине ширины
	ноль по Z на середине длины
	свес кровли считается в проекции на землю
	ширина и длина считается по кровле
*/

function drawRectCarport(par){
	
	var carport = new THREE.Object3D();
	if(!par.dxfBasePoint) par.dxfBasePoint = {x:0,y:0}

	//колонны

	var columnPar = {
		len: params.height,
		isTop: false,
	};
	
	var columnArrPar = {
		amt: {
			x: 2,
			z: params.sectAmt + 1,
		},
		arrSize: {
			x: params.width - params.sideOffset * 2,
			z: params.sectLen * params.sectAmt,
		},
		itemSize: {
			x: partPar.column.profSize.x,
			z: partPar.column.profSize.y,
		},
		drawFunction: drawCarportColumn,
		itemPar: columnPar,
	}
	
	if(params.carportType == "консольный") columnArrPar.amt.x = 1;
	
	//задаем разную высоту колонн справа и слева для односкатного навеса
	var deltaHeight = 0;
	if(params.carportType == "односкатный"){
		columnArrPar.arrSize.x += params.sideOffset; //не делаем свес на верхней стороне
		deltaHeight = (params.width - params.sideOffset - partPar.column.profSize.y / 2) * Math.tan(params.roofAng / 180 * Math.PI);
		if(params.beamModel == "сужающаяся") deltaHeight -= partPar.truss.midHeight - partPar.truss.endHeight;
		if(params.roofType == "Арочная") {
			deltaHeight = partPar.main.arcPar.topArc.height - partPar.truss.width
			if(params.beamModel == "проф. труба") deltaHeight = partPar.main.arcPar.topArc.height - partPar.rafter.profSize.y - partPar.beam.profSize.y
		}
		columnArrPar.modifier = function(counter, itemPar, itemMoove){
			itemPar.len = params.height;
			itemPar.isTop = false;
			
			if(counter.x == 1) {
				itemPar.len = params.height + deltaHeight;
				itemPar.isTop = true;
			}
		}
	}

	var columnArr = drawRectArray(columnArrPar).mesh;
	if(params.carportType == "консольный") columnArr.position.x = -params.width / 2 + partPar.column.profSize.x;
	columnArr.setLayer('racks');

	//учитываем что на односкатном нет свеса сверху
	if(params.carportType == "односкатный"){
		columnArr.position.x += params.sideOffset / 2;
	}
	
	carport.add(columnArr);
	
	window.carportColumns = columnArr;
	window.carportPosCoumns = columnArrPar.posItems;
		
	//продольные балки
	
	var trussPar = {
		height: partPar.truss.endHeight,
		thk: params.trussThk,
		len: columnArrPar.step.z - 8 - 4,
		rackSize: partPar.column.profSize.y,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
	}
	
	var beamArrPar = {
		amt: {
			x: 2,
			z: params.sectAmt,
		},
		arrSize: {
			x: columnArrPar.arrSize.x - partPar.column.profSize.y,
			z: params.sectLen * params.sectAmt - partPar.column.profSize.y - 8 - 4,
		},
		itemSize: {
			x: params.trussThk,
			z: trussPar.len,
		},
		itemRot:{
			y: Math.PI / 2,
		},
		drawFunction: drawStrightTruss,
		itemPar: trussPar,
	}
	
	
	if(params.carportType == "консольный") beamArrPar.amt.x = 1;
	if(params.beamModel == "проф. труба") {
		var beamPar = {
			poleProfileY: partPar.beam.profSize.x,
			poleProfileZ: partPar.beam.profSize.y,
			length: params.sectLen * params.sectAmt + params.frontOffset + params.backOffset,
			poleAngle: 0,
			material: params.materials.metal,
			type: 'rect',
			partName: 'carportBeamLen'
		};
	
		beamArrPar.amt.z = 1;
		beamArrPar.itemSize = {
			x: partPar.beam.profSize.x,
			z: beamPar.length,
		};
		beamArrPar.arrSize = {
			x: columnArrPar.arrSize.x,
			z: beamPar.length,
		};
		beamArrPar.drawFunction = drawPole3D_4;
		beamArrPar.itemPar = beamPar;
	}
	
	//задаем разную высоту колонн справа и слева для односкатного навеса. Также переворачиваем балки из листа
	if(params.carportType == "односкатный" || params.beamModel != "проф. труба"){
		beamArrPar.modifier = function(counter, itemPar, itemMoove){
			if(counter.x == 1) {
				if(params.carportType == "односкатный") itemMoove.y = deltaHeight;
				if(params.beamModel != "проф. труба") itemPar.isLeft = true;
			}
		}
	}
	
	if(params.beamModel != "проф. труба") {
		beamArrPar.arrSize.x -= 185;
		if(params.carportType == "односкатный") beamArrPar.arrSize.x += 95;
	}
	
	var beamArr = drawRectArray(beamArrPar).mesh;
	beamArr.position.y = params.height
	if(params.carportType == "консольный") {
		beamArr.position.x = -params.width / 2// + partPar.column.profSize.x;
		beamArr.position.y -= trussPar.height;
	}
	beamArr.setLayer('racks');
	if(params.carportType == "односкатный"){
		beamArr.position.x = -params.width / 2 + params.sideOffset + partPar.column.profSize.x / 2 + 120 - 25; //120 - размер фланца, 25 - отступ отверстия
	}
	if(params.beamModel != "проф. труба") {
		beamArr.position.z += 2;
	}

	carport.add(beamArr);
	
	//каркас кровли

	var roofCarcasPar = {
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, params.width + 500, 0),
		dxfArr: dxfPrimitivesArr
	}
	
	var roofCarcas = drawRoofCarcas(roofCarcasPar).mesh;
	roofCarcas.position.y += params.height
	if(params.carportType == "односкатный") roofCarcas.position.x = -params.width / 2 + partPar.column.profSize.x / 2 + params.sideOffset;
	if(params.beamModel != "проф. труба") roofCarcas.position.z += 6;
	carport.add(roofCarcas);
		
	//кровля

	if(params.roofType == "Арочная"){
		
		var roofPar = {
			topArc: partPar.main.arcPar.topArc,
		}
		
		var roof = drawRoof(roofPar)
		roof.position.y = params.height
		roof.position.z += (params.frontOffset - params.backOffset) / 2;
		
		roof.setLayer('roof');
		carport.add(roof);
		window.carportRoof = roof;
	}
	
	if(params.roofType != "Арочная"){
		
		var roofPar = {
			//topArc: beamArrPar.topArc,
		}
		
		var roof = drawRoof(roofPar)
		if(params.beamModel == "проф. труба") {
			roof.position.y = params.height + partPar.rafter.profSize.y / Math.cos(params.roofAng / 180 * Math.PI)
		}
		if(params.beamModel != "проф. труба") {
			roof.position.y = params.height
		}
		roof.position.z += (params.frontOffset - params.backOffset) / 2;
		roof.setLayer('roof');
		carport.add(roof);
		window.carportRoof = roof;
	}
	
	//стенки
	var walls = drawCarportWalls().mesh;
	walls.setLayer('walls');
	carport.add(walls);

	carport.rotation.y = params.carportAng / 180 * Math.PI

	window.fullCarport = carport;
	
	return carport;
	
} //end of drawRectCarport