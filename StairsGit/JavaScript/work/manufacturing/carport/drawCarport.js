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
	if (params.carportType == "четырехскатный") drawFunc = drawPyramidalPavilion;
	
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
	
	var partPar = calcCarportPartPar();
	
	
	var dome = new THREE.Object3D();
	
	//подвижная часть (дверь)
	par.fullAngle = (params.doorAng + partPar.dome.overlayAng * 2) / 180 * Math.PI;
	par.extraRad = partPar.dome.doorOffset;
	par.isMovable = true;
	par.dxfBasePoint = {x:0, y:5000}
	var door = window.domeDoor = drawSphereSegment(par)
	door.rotation.y = -par.fullAngle + (partPar.dome.overlayAng / 180 * Math.PI)
	dome.add(door)
	
	//неподвижная часть
	par.fullAngle = Math.PI * 2 - params.doorAng / 180 * Math.PI;
	par.extraRad = 0;
	par.isMovable = false;
	par.dxfBasePoint = {x:0, y:0}
	dome.add(drawSphereSegment(par))
	

	
	
	window.carportColumns = dome;
		
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
			
			sheet.position.z = sheetStep * i + 10;
			sheet.position.y = par.topArc.center.y + 10;
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
				if(!testingMode) roof.add(polyProfile);
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
			//	dxfBasePoint: {x:0,y:0},
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
		
		//коньковый профиль
		if (params.carportType == "двухскатный"){
			var pos1 = polar(pos, THREE.Math.degToRad(params.roofAng), sheetLen + 50)
			var ridge = drawRidge({}).mesh
			ridge.position.y = pos1.y
			ridge.setLayer('roof');
			roof.add(ridge);
		}
	}
	
	//центр массива в точке 0,0
	var box3 = new THREE.Box3().setFromObject(roof);

	//var isAlignment = true;
	//if (params.carportType == "односкатный" && params.carportType.indexOf("консольный") !== -1) isAlignment = false
	////if (params.frontOffset !== params.backOffset) isAlignment = false //если свес спереди и сзади не одинаковый, то выравниваем кровлю и прогоны вручную

	//if (isAlignment) roof.position.x -= (box3.max.x + box3.min.x) / 2;
	if (params.carportType == "односкатный" && params.carportType.indexOf("консольный") !== -1) {
		roof.position.x -= (box3.max.x + box3.min.x) / 2;
	}
	roof.position.z -= (box3.max.z + box3.min.z) / 2;

	if (params.frontOffset !== params.backOffset) roof.position.z +=  (params.frontOffset - params.backOffset) / 2

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

function drawPolygonPavilion(par) {
	var obj = new THREE.Object3D();

	var edgeAng = Math.PI * 2 / params.edgeAmt;

	var segmentPar = {
		angle: edgeAng,
	}

	//пол---------------------------------------
	if(params.floorType == "граненый"){
		var floor = new THREE.Object3D();

		for (var i = 0; i < params.edgeAmt; i++) {
			var segment = drawPolygonSegmentFloor(segmentPar).mesh
			segment.rotation.y = edgeAng * i
			floor.add(segment)
		}
		
		//центральная опора
		var floorRackPar = {
			ang: edgeAng,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: { x: 2000, y: 0 },
		}

		var middleRack = drawMiddleRackFloor(floorRackPar).mesh;
		floor.add(middleRack);

		obj.add(floor)
	}
	
	//неподвижная часть---------------------------
	var pavilion = new THREE.Object3D();

	var segmentPar = {
		angle: edgeAng,
		}
	
	for (var i = 0; i < params.edgeAmt; i++) {
		segmentPar.i = i;

		var segment = drawPolygonSegment(segmentPar).mesh
		segment.rotation.y = edgeAng * i
		pavilion.add(segment)
		//break
	}


	//нижняя пластина чашки
	var bowlPar = {
		ang: edgeAng,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: { x: 2000, y: 0 },
		botEdgeBowl: segmentPar.botEdgeBowl,
	}

	var bowlBot = drawPolygonRoofSectorBowlBot(bowlPar).mesh;
	bowlBot.position.y = params.height + segmentPar.roofHeight + segmentPar.poleProfileY + segmentPar.botBowlY;

	pavilion.add(bowlBot);

	//стол
	if(params.tableType != "нет"){
		var tablePar = {
			ang: edgeAng,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: { x: 2000, y: 0 },
		}

		var table = drawTable(tablePar).mesh;
		pavilion.add(table);
	}
	
	pavilion.position.y = params.heightFloor;

	obj.add(pavilion)
	
	return obj;
}

/** функция отрисовывает сегмент многоугольного павильона
	angle  - полный угол сектора
*/

function drawPolygonSegment(par) {

	par.mesh = new THREE.Object3D();
	if (!par.dxfArr) par.dxfArr = [];
	if (!par.dxfBasePoint) par.dxfBasePoint = { x: 0, y: 0 };
	if (!par.extraRad) par.extraRad = 0;

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

	//if (params.fixType == "бетон") rack1.position.y = -1200;
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

	par.poleProfileY = horBeamPar.poleProfileY

	//рамки кровли

	var roofEdgeAng =
		Math.atan(horBeamPar.length / 2 / roofBeemLen) * 2; //угол между гранями листа, примыкающими к шпилю	
	par.roofEdgeAng = roofEdgeAng;

	var framePar = {
		ang: roofEdgeAng,
		edgeLen: (roofBeemLen + params.sideOffset) / Math.cos(roofEdgeAng / 2), //длина ребра
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: { x: 2000, y: 0 },
		sideOffset: 50,
		topOffset: 200,
	}

	var frame = drawPolygonRoofSectorFrame(framePar).mesh;
	frame.rotation.x = -params.roofAng / 180 * Math.PI + Math.PI / 2;
	frame.position.y = params.height + par.roofHeight + horBeamPar.poleProfileY;

	par.mesh.add(frame);

	//колпак сверху
	var capPar = {
		ang: roofEdgeAng,
		edgeLen: 300, //длина ребра
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: { x: 2000, y: 0 },
		thk: 4,
	}

	var cap = drawPolygonRoofSectorCap(capPar).mesh;
	cap.rotation.x = -params.roofAng / 180 * Math.PI + Math.PI / 2;
	cap.position.y = params.height + par.roofHeight + horBeamPar.poleProfileY;
	cap.position.y += (partPar.rafter.profSize.y + params.roofThk + capPar.thk) /
		Math.cos(params.roofAng / 180 * Math.PI)

	par.mesh.add(cap);

	//чашка
	var bowlPar = {
		ang: roofEdgeAng,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: { x: 2000, y: 0 },
		topOffset: 200,
		thk: 8,
	}

	var bowl = drawPolygonRoofSectorBowl(bowlPar).mesh;
	bowl.rotation.x = -params.roofAng / 180 * Math.PI + Math.PI / 2;
	bowl.position.y = params.height + par.roofHeight + horBeamPar.poleProfileY;

	par.mesh.add(bowl);

	par.botEdgeBowl = bowlPar.botEdgeBowl
	par.botBowlY = bowlPar.botBowlY


	//скамейка
	if (params.benchType != "нет" && par.i !== 0) {
		var benchPar = {
			ang: (Math.PI - par.angle) / 2,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: { x: 2000, y: 0 },
			isLast: false,
			isFirst: false,
		}
		if (par.i == 1) benchPar.isFirst = true
		if (par.i == params.edgeAmt - 1) benchPar.isLast = true


		var bench = drawPolygonRoofSectorBench(benchPar).mesh;
		par.mesh.add(bench);
	}

	//ограждение
	if (par.i !== 0) {
		var sectionParams = {
			length: edgeLen - columnProfPar.sizeA * Math.sin(par.angle) * 2,
			connection: "нет",
			type: "секция",
			sectId: i,
			angleStart: 0,
			angleEnd: 0,
			dxfBasePoint: par.dxfBasePoint,
			flans: "две стороны",
		}

		var section = addBanisterSection(sectionParams);
		section.position.z = -par.minRad + 60;
		section.position.x = -sectionParams.length / 2;
		section.position.y = 155;
		section.setLayer('walls');
		par.mesh.add(section);
	}

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
	var leftSectAmt = partPar.movableSections.left //кол-во секций, сдвигаемых влево
	var sPar = calcSegmentPar(params.width, params.height)
	var deltaRad = partPar.rafter.profSize.y + 50
	var topRad = sPar.rad - deltaRad * (leftSectAmt - 1)
	var center = sPar.center
		
	//разница по высоте в сравнении с половиной сферы
	var extraHeight = height - rad;
	
	
	
	//строим секции слева направо от меньшей к большей
	for(var i=0; i<params.sectAmt; i++){
		var section = new THREE.Object3D();
		
		var rad = topRad + deltaRad * i;
		if(i >= leftSectAmt) rad = topRad + deltaRad * leftSectAmt - deltaRad * (i - leftSectAmt + 1);
		
		//точки пересечения дуги с горизонтом
		var points = itercectionLineCircle({x:0, y:0}, {x:1, y:0}, center, rad)
		var width = points[0].x - points[1].x;
		var a1 = angle( center, points[1]) + Math.PI
		if(a1 == Math.PI * 2) a1 = Math.PI
		
		
		var sectPar = {
			rad: rad,
			center: center,
			width: width,
			sectId: i,
			a1: a1,
		}
		
		var sect = drawArcPoolSect(sectPar).mesh
		sect.position.z = params.sectLen * i
		section.add(sect)
		
		//направляющие
		if(i < leftSectAmt){
			/*
			var polePar = {
				poleProfileY: partPar.rail.profSize.y,
				poleProfileZ: partPar.rail.profSize.x,
				dxfBasePoint: par.dxfBasePoint,
				length: params.sectAmt * params.sectLen,
				material: params.materials.metal,
				partName: 'purlinProf'
			};
			
			var rail = drawPole3D_4(polePar).mesh;
			rail.rotation.y = -Math.PI / 2
			rail.position.x = -width / 2 + partPar.rafter.profSize.y / 2 + partPar.rail.profSize.x / 2
			rail.position.z = -params.sectLen / 2
			pavilion.add(rail);
			rail.setLayer('carcas');
			
			var rail = drawPole3D_4(polePar).mesh;
			rail.rotation.y = -Math.PI / 2
			rail.position.x = width / 2 - partPar.rafter.profSize.y / 2 + partPar.rail.profSize.x / 2
			rail.position.z = -params.sectLen / 2
			pavilion.add(rail);
			rail.setLayer('carcas');
			*/
			
			var railPar = {
				len: params.sectAmt * params.sectLen,
			}
			
			var rail = drawPoolRail(railPar).mesh;
		//	rail.rotation.y = -Math.PI / 2
			rail.position.x = -width / 2 + partPar.rafter.profSize.y / 2 + partPar.rail.profSize.x / 2
			rail.position.z = -params.sectLen / 2
			pavilion.add(rail);
			rail.setLayer('carcas');
			
			var rail = drawPoolRail(railPar).mesh;
			//rail.rotation.y = -Math.PI / 2
			rail.position.x = width / 2 - partPar.rafter.profSize.y / 2 + partPar.rail.profSize.x / 2
			rail.position.z = -params.sectLen / 2
			pavilion.add(rail);
			rail.setLayer('carcas');

		}
		
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
				wall.position.x = -width / 2
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
	
		//центр массива в точке 0,0
	var box3 = new THREE.Box3().setFromObject(pavilion);
	pavilion.position.z -= (box3.max.z + box3.min.z) / 2;
	
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
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 500),
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
	
	if(params.carportType == "консольный") {
		columnArrPar.amt.x = 1;
	}
	
	//задаем разную высоту колонн справа и слева для односкатного навеса
	var deltaHeight = 0;
	if(params.carportType == "односкатный"){
		columnArrPar.arrSize.x = params.width - params.sideOffset - params.sideOffsetTop;
		
		if(params.roofType == "Плоская") {
			//перепад высоты по осям колонн на верхней линии
			deltaHeight = partPar.main.colDist * Math.tan(params.roofAng / 180 * Math.PI);
			deltaHeight -= partPar.truss.midHeight - partPar.truss.endHeight;
		}

		if(params.roofType == "Арочная") {
			deltaHeight = partPar.main.arcPar.topArc.height - partPar.truss.width - 50
			if(params.beamModel == "проф. труба") deltaHeight = partPar.main.arcPar.topArc.height - partPar.rafter.profSize.y - partPar.beam.profSize.y
		}
		columnArrPar.modifier = function(counter, itemPar, itemMoove){
			itemPar.len = params.height;
			itemPar.isTop = false;
			
			if(counter.x == 1) {
				itemPar.len = params.height + deltaHeight - 0.5;
				itemPar.isTop = true;
			}
		}
	}

	var columnArr = drawRectArray(columnArrPar).mesh;
	if(params.carportType == "консольный") columnArr.position.x = -params.width / 2 + partPar.column.profSize.x;
	columnArr.setLayer('racks');

	//учитываем что на односкатном нет свеса сверху
	if(params.carportType == "односкатный"){
		columnArr.position.x += (params.sideOffset - params.sideOffsetTop) / 2;
	}
	
	carport.add(columnArr);
	
	window.carportColumns = columnArr;
		
	//продольные балки
	
	var trussPar = {
		thk: params.trussThk,
		len: columnArrPar.step.z - 8 - 4,
		rackSize: partPar.column.profSize.y,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 2000),
	}
	
	var beamArrPar = {
		amt: {
			x: 2,
			z: params.sectAmt,
		},
		arrSize: {
			x: params.width - params.sideOffset * 2,
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
	
	//коррекция расстояния между балками в зависимости от типа навеса
	var deltaWidth = 0;
	var flanHolesPos = partPar.column.profSize.x / 2 + 90; //расстояние от внешнего края колонны до отверстий во фланце, куда крепится балка
	
	
	if(params.carportType == "односкатный") deltaWidth = params.sideOffset - params.sideOffsetTop - flanHolesPos + partPar.truss.thk - 30;
	if(params.carportType == "двухскатный") deltaWidth = -flanHolesPos * 2 + partPar.truss.thk; 

	
	if(params.beamModel == "проф. труба"){
		deltaWidth = params.sideOffset
	}
	
	beamArrPar.arrSize.x += deltaWidth
	
	
	var beamArr = drawRectArray(beamArrPar).mesh;
	
	beamArr.position.y = params.height
	if(params.carportType == "консольный") {
		beamArr.position.x = -params.width / 2// + partPar.column.profSize.x;
		beamArr.position.y -= trussPar.height;
	}
	if(params.beamModel == "ферма постоянной ширины") {
		beamArr.position.y -= trussPar.height 
	}
	
	if(params.carportType == "односкатный"){
		beamArr.position.x = -params.width / 2 + params.sideOffset + flanHolesPos
	}
	if(params.beamModel != "проф. труба") {
		beamArr.position.z += 2;
	}
	
	
	beamArr.setLayer('racks');
	carport.add(beamArr);
	
	//каркас кровли

	var roofCarcasPar = {
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, params.width + 500, 0),
		dxfArr: dxfPrimitivesArr
	}
	
	var roofCarcas = drawRoofCarcas(roofCarcasPar).mesh;
	roofCarcas.position.y += params.height
	
	if(params.beamModel == "проф. труба" && params.carportType != "сдвижной") {
		roofCarcas.position.y += partPar.beam.profSize.y
	}
	
	
	
	
	if (params.carportType == "односкатный") roofCarcas.position.x = -params.width / 2 + partPar.column.profSize.x / 2 + params.sideOffset;
	if (params.beamModel != "проф. труба") roofCarcas.position.z += 6;
	if (params.frontOffset !== params.backOffset) roofCarcas.position.z += (params.frontOffset - params.backOffset) / 2;
	if (params.carportType == "консольный") roofCarcas.position.z = 0;
	carport.add(roofCarcas);
		
	//кровля

	if(params.roofType == "Арочная"){
		
		var roofPar = {
			topArc: partPar.main.arcPar.topArc,
		}
		
		var roof = drawRoof(roofPar)
		roof.position.y = params.height
		if(params.beamModel == "проф. труба" && params.carportType != "сдвижной") {
			roof.position.y += partPar.beam.profSize.y
		}
		
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
		roof.setLayer('roof');
		carport.add(roof);
		window.carportRoof = roof;
	}
	
	//водосток
	
	if(params.gutter != "нет"){
		//слева
		var drainPar = {
			height: params.height - 200,
			offset: params.sideOffset + 30,
			size: 80,
			topOffset: 100,
			len: partPar.main.len,
			pipeOffset: params.frontOffset,
			side: 'left',
		}
		var drain = drawDrain(drainPar).mesh;
		drain.position.x = -params.width / 2 - 80
		drain.position.y = params.height + 100
		drain.position.z = -drainPar.len / 2
		drain.setLayer('roof');
		carport.add(drain);
		
		//справа
		if(params.carportType == "двухскатный"){
			drainPar.side = "right";
			var drain = drawDrain(drainPar).mesh;
			drain.position.x = params.width / 2 + 80
			drain.position.y = params.height + 100
			drain.position.z = -drainPar.len / 2
			drain.setLayer('roof');
			carport.add(drain);
		}
	}
	
	//стенки
	if(params.wallMat != "нет"){
		var walls = drawCarportWalls().mesh;
		walls.setLayer('walls');
		carport.add(walls);
	}

	window.fullCarport = carport;
	
	return carport;
	
} //end of drawRectCarport

/** функция отрисовывает четырескатный павильон
	
*/

function drawPyramidalPavilion(par) {

	par.mesh = new THREE.Object3D();
	if (!par.dxfArr) par.dxfArr = [];
	if (!par.dxfBasePoint) par.dxfBasePoint = { x: 0, y: 0 };
	if (!par.extraRad) par.extraRad = 0;

	par.lengthPavilion = params.sectLen * params.sectAmt;

	var ridgePar = {
		poleProfileY: partPar.rafter.profSize.y,
		poleProfileZ: partPar.rafter.profSize.x,
		dxfBasePoint: par.dxfBasePoint,
		length: par.lengthPavilion,
		poleAngle: 0,
		material: params.materials.metal,
		dxfArr: [],
		type: 'rect',
		partName: 'topRoofProf',
		lengthPavilion: par.lengthPavilion, 
	};

	//высота кровли от мауэрлата до конька
	par.roofHeight = (params.width - ridgePar.poleProfileZ) / 2 * Math.tan(partPar.main.roofAng)
	par.roofHeight += partPar.rafter.profSize.y / Math.cos(partPar.main.roofAng) + partPar.beam.profSize.y
	//par.roofHeight += partPar.rafter.profSize.y * Math.cos(partPar.main.roofAng) + partPar.beam.profSize.y

	//длина конька
	ridgePar.length -= ((par.roofHeight - partPar.beam.profSize.y) / Math.tan(partPar.main.roofAng) - partPar.rafter.profSize.y / Math.sin(partPar.main.roofAng)) * 2
	//ridgePar.length -= ((par.roofHeight - partPar.beam.profSize.y) / Math.tan(partPar.main.roofAng) - partPar.rafter.profSize.y * Math.cos(partPar.main.roofAng) / Math.tan(partPar.main.roofAng)) * 2

	/* колонны */
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
		partName: 'carportColumn',
		lengthPavilion: par.lengthPavilion,
	};

	calcParColon(columnPar);

	for (var i = 0; i < columnPar.points.length; i++) {
		//колонна
		var rack1 = drawPole3D_4(columnPar).mesh;
		rack1.rotation.z = Math.PI / 2;
		rack1.position.x = columnPar.points[i].y + columnPar.poleProfileY / 2;
		rack1.position.z = columnPar.points[i].x - columnPar.poleProfileY / 2;

		if (params.fixType == "бетон") rack1.position.y = -1200;
		rack1.setLayer('racks');
		par.mesh.add(rack1);
	}


	/* балки мауэрлата */
	var horBeamPar = {
		poleProfileY: partPar.beam.profSize.y,
		poleProfileZ: partPar.beam.profSize.x,
		dxfBasePoint: par.dxfBasePoint,
		length: 0,
		poleAngle: 0,
		material: params.materials.metal,
		dxfArr: [],
		type: 'rect',
		partName: 'carportBeam'
	};

	//передняя и задняя сторона
	for (var i = 0; i < 2; i++) {
		horBeamPar.length = distance(columnPar.pointsColon.front[0], columnPar.pointsColon.front[columnPar.pointsColon.front.length - 1]) + columnPar.poleProfileY

		var horBeam = drawPole3D_4(horBeamPar).mesh;

		horBeam.rotation.y = -Math.PI / 2;
		horBeam.position.x = columnPar.pointsColon.front[0].y + columnPar.poleProfileY / 2;
		if (i == 1) horBeam.position.x = columnPar.pointsColon.rear[0].y + columnPar.poleProfileY / 2;
		horBeam.position.z = columnPar.pointsColon.front[0].x - columnPar.poleProfileY / 2;
		horBeam.position.y = params.height;

		horBeam.setLayer('racks');
		par.mesh.add(horBeam);
	}

	//боковые стороны
	for (var i = 0; i < 2; i++) {
		horBeamPar.length = distance(columnPar.pointsColon.front[0], columnPar.pointsColon.rear[0]) + columnPar.poleProfileY

		var horBeam = drawPole3D_4(horBeamPar).mesh;

		horBeam.position.x = columnPar.pointsColon.front[0].y - columnPar.poleProfileY / 2;
		horBeam.position.z = columnPar.pointsColon.front[0].x - columnPar.poleProfileY / 2;
		if (i == 1) horBeam.position.z = columnPar.pointsColon.front[columnPar.pointsColon.front.length-1].x - columnPar.poleProfileY / 2;
		horBeam.position.y = params.height;

		horBeam.setLayer('racks');
		par.mesh.add(horBeam);
	}


	/* конек крыши */
	var ridge = drawPole3D_4(ridgePar).mesh;

	ridge.rotation.y = -Math.PI / 2;
	ridge.position.x = ridgePar.poleProfileZ / 2;
	ridge.position.z = - ridgePar.length / 2;
	ridge.position.y = params.height + par.roofHeight - ridgePar.poleProfileY;

	ridge.setLayer('racks');
	par.mesh.add(ridge);

	/* стропильные ноги */
	var rafterPar = {
		dxfBasePoint: par.dxfBasePoint,
		ridgeLen: ridgePar.length,
		roofHeight: par.roofHeight,
		poleAngle: 0,
		material: params.materials.metal,
		dxfArr: [],
		type: 'rect',
		partName: 'carportBeam',
		lengthPavilion: par.lengthPavilion,
	};

	var rafter = drawPyramidalRafters(rafterPar).mesh
	rafter.position.y = params.height;

	rafter.setLayer('racks');
	par.mesh.add(rafter);


	/* листы кровли */

	var roofSegmentPar = {
		ridgeLen: ridgePar.length,
		roofHeight: par.roofHeight,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: { x: 2000, y: 0 },
		lengthPavilion: par.lengthPavilion,
	}

	var sheet = drawPyramidalRoof(roofSegmentPar).mesh
	sheet.setLayer('roof');

	sheet.position.y = params.height + par.roofHeight;

	par.mesh.add(sheet);

	return par.mesh;
}


/** функция отрисовывает сегмент пола многоугольного павильона
	angle  - полный угол сектора
*/

function drawPolygonSegmentFloor(par) {

	par.mesh = new THREE.Object3D();
	if (!par.dxfArr) par.dxfArr = [];
	if (!par.dxfBasePoint) par.dxfBasePoint = { x: 0, y: 0 };
	if (!par.extraRad) par.extraRad = 0;

	par.rad = params.domeDiam / 2;

	var beamProfY = partPar.beam.profSize.y
	var beamProfZ = partPar.beam.profSize.x

	//радиус вписанной окружности
	par.minRad = par.rad * Math.cos(par.angle / 2)

	//длина ребра
	var edgeLen = par.rad * Math.sin(par.angle / 2) * 2

	//параметры колонн
	var columnProfPar = getProfParams(params.columnProf)
	var columnPar = {
		poleProfileY: columnProfPar.sizeA,
		poleProfileZ: columnProfPar.sizeB,
		dxfBasePoint: par.dxfBasePoint,
		length: params.heightFloor - params.thkFloor - columnProfPar.sizeA - beamProfY,
		poleAngle: 0,
		material: params.materials.metal,
		dxfArr: [],
		type: 'rect',
		partName: 'carportColumn'
	};

	//колонна
	var rack = drawPole3D_4(columnPar).mesh;
	rack.rotation.z = Math.PI / 2;
	rack.position.x = -edgeLen / 2 + columnPar.poleProfileZ;
	rack.position.z = -par.minRad;

	if (params.fixType == "бетон") rack.position.y = -1200;
	rack.setLayer('racks');
	par.mesh.add(rack);

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

	horBeam.position.x = -horBeamPar.length / 2;
	horBeam.position.z = -par.minRad;
	horBeam.position.y = columnPar.length;

	horBeam.setLayer('racks');
	par.mesh.add(horBeam);


	//доски пола и балки
	var floorPar = {
		ang: (Math.PI - par.angle) /2,
		beamProfY: beamProfY,
		beamProfZ: beamProfZ,
		dxfBasePoint: par.dxfBasePoint,
		dxfArr: dxfPrimitivesArr,
	};

	var floor = drawPolygonSectorFloorRafters(floorPar).mesh
	par.mesh.add(floor);

	return par;
}
