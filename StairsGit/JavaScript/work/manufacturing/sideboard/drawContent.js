/** функция отрисовывает все наполнение тумбы
*/

function drawContent(par){
	par.bridge = new THREE.Object3D(); //перемычки
	par.carcas = new THREE.Object3D(); //каркасы ящиков
	par.metiz = new THREE.Object3D(); //метизы
	par.doors = new THREE.Object3D(); //фасады
	par.dimensions = new THREE.Object3D(); //фасады
	
	var modelDim = getModelDimensions();
	
	//цикл перебора секций
	var sectPosX = 0;
	for(var sectId = 0; sectId < par.sections.length; sectId++){
		
		//перегородки секций
		if(sectId > 0){
			//передняя стойка
			var polePar = {
				poleProfileY: modelDim.sectWallThk,
				poleProfileZ: modelDim.sideWall.newellSize,
				dxfBasePoint: par.dxfBasePoint,
				length: params.height - modelDim.leg - modelDim.countertop.thk - modelDim.door.topBeamSize - modelDim.door.botBeamSize,
				poleAngle: Math.PI / 2,
				partName: "timberPole",
				}
			//утапливаем перегородку за фасады
			if(params.model == "Сканди") polePar.poleProfileZ -=  modelDim.door.thk
			var pos = {
				x: sectPosX,
				y: modelDim.leg + modelDim.door.botBeamSize,
				}
			polePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y)
			var bridge = drawPole3D_4(polePar).mesh;
			bridge.position.x = pos.x;
			bridge.position.y = pos.y;
			bridge.position.z = params.depth - polePar.poleProfileZ;
			if(params.model == "Сканди") bridge.position.z -= modelDim.door.thk;
			par.bridge.add(bridge);
			
			//задняя стойка
			polePar.poleProfileZ = modelDim.sideWall.newellSize - modelDim.rearWall.thk - modelDim.rearWall.offset;
			var bridge = drawPole3D_4(polePar).mesh;
			bridge.position.x = pos.x;
			bridge.position.y = pos.y;
			bridge.position.z = modelDim.rearWall.thk + modelDim.rearWall.offset;
			par.bridge.add(bridge);
			
			} //конец перебора перегородок
		
		//ряды секции (строятся сверху вниз)
		var posY = params.height - modelDim.countertop.thk - modelDim.door.topBeamSize;
		for(var rowId = 0; rowId < par.sections[sectId].rows.length; rowId++){
			var row = par.sections[sectId].rows[rowId];
			var rowPar = {
				sectId: sectId,
				height: row.height,
				dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 5000 * sectId),
				width: par.sections[sectId].width,
				type: "drawers",
				unitAmt: 1,
				hingeSide: par.sections[sectId].hingeSide,
				drawBrdge: true, //отрисовывать ли перемычку каркаса под рядом
				doorOnlayLeft: 0, 
				doorOnlayRight: 0,
				}
			
			if(row.type == "два ящика" || row.type == "две дверки") rowPar.unitAmt = 2;
			if(row.type == "три ящика") rowPar.unitAmt = 3;
			if(row.type == "четыре ящика") rowPar.unitAmt = 4; 
			
			if(row.type == "дверка" || row.type == "две дверки") rowPar.type = "doors";
			if(row.type == "открытая") rowPar.type = "open";
			
			if(rowId == par.sections[sectId].rows.length - 1) rowPar.drawBrdge = false;
			
			//выпуск фасада на вертикальную стенку секции
			if(params.model == "Сканди" && par.sections.length > 1){
				//выпуск справа
				if(sectId < par.sections.length - 1) rowPar.doorOnlayRight = modelDim.sectWallThk / 2 + modelDim.door.gap / 2;
				if(sectId > 0) rowPar.doorOnlayLeft = modelDim.sectWallThk / 2 + modelDim.door.gap / 2;
				}
			
			
			var rowObj = drawContentRow(rowPar);
			posY -= rowPar.height;
			if(rowId > 0) posY -= modelDim.bridgeThk; //перемычка между рядами
			rowObj.carcas.position.x = rowObj.metiz.position.x = rowObj.doors.position.x = rowObj.bridge.position.x = rowObj.dimensions.position.x = sectPosX
			rowObj.carcas.position.y = rowObj.metiz.position.y = rowObj.doors.position.y = rowObj.bridge.position.y = rowObj.dimensions.position.y = posY;
			
			par.carcas.add(rowObj.carcas);
			par.metiz.add(rowObj.metiz);
			par.doors.add(rowObj.doors);
			par.bridge.add(rowObj.bridge);
			par.dimensions.add(rowObj.dimensions);			
			} //конец перебора рядов
			
		//перебор внутренних полок
		for(var shelfId = 0; shelfId < par.sections[sectId].shelfs.length; shelfId++){
			var shelfPar = par.sections[sectId].shelfs[shelfId];
			var shelfObj = drawShelf(shelfPar);
			shelfObj.carcas.position.x += sectPosX;			
			par.carcas.add(shelfObj.carcas);
			}
			
			sectPosX += par.sections[sectId].width + modelDim.sectWallThk;
		};
	
	return par;
}

/** функция отрисовывает ряд, состоящий из ящиков, дверок или полок
ряды строятся сверху вниз
*/
function drawContentRow(par){
	par.bridge = new THREE.Object3D(); //перемычки
	par.carcas = new THREE.Object3D();
	par.metiz = new THREE.Object3D();
	par.doors = new THREE.Object3D();
	par.dimensions = new THREE.Object3D();
	
	var modelDim = getModelDimensions();
	
	var unitPar = {
		type: par.type,
		width: par.width / par.unitAmt,
		height: par.height - modelDim.door.gap,
		dxfBasePoint: par.dxfBasePoint,
		hingeSide: "слева",
		drawBrdge: true,
		doorOnlayLeft: 0,
		doorOnlayRight: 0,
		};
	if(par.hingeSide == "справа" && par.unitAmt == 1) unitPar.hingeSide = "справа";
	//учитываем вертикальные перемычки между ящиками
	if(par.type == "drawers") unitPar.width = (par.width - (par.unitAmt - 1) * modelDim.vertBridgeThk) / par.unitAmt;
	var posX = 0;
	
	for(var i=0; i < par.unitAmt; i++){
		if(i == par.unitAmt - 1) unitPar.drawBrdge = false;
		//налезание фасада ящика на перегородку между ящиками для Сканди
		if(params.model == "Сканди"){
			unitPar.doorOnlayLeft = modelDim.vertBridgeThk / 2;
			unitPar.doorOnlayRight = modelDim.vertBridgeThk / 2;
			if(i==0) unitPar.doorOnlayLeft = 0;
			if(i == par.unitAmt - 1) unitPar.doorOnlayRight = 0;
			}
		//налезание фасада на перегородку секции
		if(i == 0) unitPar.doorOnlayLeft = par.doorOnlayLeft;
		if(i == par.unitAmt - 1) unitPar.doorOnlayRight = par.doorOnlayRight;
		
		var unit = drawContentUnit(unitPar);
		var carcas = unit.carcas;
		var metiz = unit.metiz;
		var doors = unit.doors;
		var bridge = unit.bridge;
		var dimensions = unit.dimensions;
		carcas.position.x = metiz.position.x = doors.position.x = bridge.position.x = dimensions.position.x = posX;
		carcas.position.z = metiz.position.z = doors.position.z = bridge.position.z = dimensions.position.z = params.depth;
		if(isDoorsOpened && unitPar.type == "drawers") {
			carcas.position.z = doors.position.z = dimensions.position.z += unitPar.len;
			}
		par.carcas.add(carcas);
		par.metiz.add(metiz);
		par.doors.add(doors);
		par.bridge.add(bridge);
		par.dimensions.add(dimensions);
		posX += unitPar.width;
		//учитываем вертикальные перемычки между ящиками
		if(par.type == "drawers") posX += modelDim.vertBridgeThk;
		unitPar.dxfBasePoint.x += par.width + 400;
		unitPar.hingeSide = "справа"; //для второй дверки петли всегда справа
		}
	
	// горизонтальная перемычка снизу
	if(par.drawBrdge && modelDim.bridgeThk){
		var polePar = {
			poleProfileY: modelDim.bridgeThk,
			poleProfileZ: 60,
			dxfBasePoint: par.dxfBasePoint,
			length: par.width,
			poleAngle: 0,
			partName: "timberPole",
			}
		
		var pos = {
			x: 0,
			y: -polePar.poleProfileY,
			}
		polePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y)
		var bridge = drawPole3D_4(polePar).mesh;
		bridge.position.x = pos.x;
		bridge.position.y = pos.y;
		bridge.position.z = params.depth - polePar.poleProfileZ;
		par.bridge.add(bridge);
		}
	
	return par;

} //end of drawDrawerSect

/** функция отрисовывает элемент ряда: ящик, дверку или полку
*/

function drawContentUnit(par){
	par.carcas = new THREE.Object3D();
	par.metiz = new THREE.Object3D();
	par.doors = new THREE.Object3D();
	par.bridge = new THREE.Object3D(); //перемычки
	par.dimensions = new THREE.Object3D();
	
	var modelDim = getModelDimensions();
	var dxfGap = 200;
	//глубина корпуса для расчета длины ящика
	par.depth = params.depth - modelDim.rearWall.offset - modelDim.rearWall.thk - modelDim.door.thk;
	par.len = Math.floor((par.depth - 10) / 50) * 50;
	
	//фасад
	if(par.type != "open"){
	var platePar = {
		len: par.width - modelDim.door.gap * 2 + par.doorOnlayLeft + par.doorOnlayRight,
		width: par.height - modelDim.door.gap,
		thk: modelDim.door.thk,
		partName: "door",
		}
	if(platePar.width > 700) platePar.partName = "framedDoor"
	var pos = {
		x: modelDim.door.gap - par.doorOnlayLeft,
		y: modelDim.door.gap,
		}
	platePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, 0)
	var panel = drawPlate(platePar).mesh;
	panel.position.x = pos.x;
	panel.position.y = pos.y;
	panel.position.z = -modelDim.door.thk;
	
	if(isDoorsOpened && par.type == "doors") {
			if(par.hingeSide == "слева") {				
				panel.rotation.y = -Math.PI / 2;
				panel.position.x += modelDim.door.thk;
				}
			if(par.hingeSide == "справа") {
				panel.rotation.y = -Math.PI / 2;
				panel.position.x = par.width;
				}
			}
	
	
	par.doors.add(panel);
	
	//ручки
	
	if(params.model == "Брутал"){
		//первая ручка
		var handle = drawHandle().mesh;
		handle.position.y = par.height / 2;
		if(par.type == "drawers") {
			handle.rotation.z = Math.PI / 2;
			handle.position.x = par.width / 2;
			if(isDoorsOpened) handle.position.z = par.len;
			
			//вторая ручка
			if(par.width > 700){
				handle.position.x = par.width / 4;
				var handle2 = drawHandle().mesh;
				handle2.position.y = par.height / 2;
				handle2.rotation.z = Math.PI / 2;
				handle2.position.x = par.width / 4 * 3;
				if(isDoorsOpened) handle2.position.z = par.len;
				}
			}		
		if(par.type == "doors") {
			handle.position.x = par.width - 50;
			if(par.hingeSide == "справа") handle.position.x = 50;
			if(isDoorsOpened){
				handle.position.x = 0;
				if(par.hingeSide == "слева") {				
					handle.rotation.y = -Math.PI / 2;
					handle.position.z = par.width - 50;
					}
				if(par.hingeSide == "справа") {
					handle.rotation.y = Math.PI / 2;
					handle.position.x = par.width;
					handle.position.z = par.width - 50;
					}
				}
			}
		par.metiz.add(handle);
		if(handle2) par.metiz.add(handle2);
		}
		
	//размер высота фасада

	var dimPar = {
		p1: {x: pos.x, y: pos.y, z: 1},
		p2: {x: pos.x, y: pos.y + platePar.width, z: 1},
		offset: 50,
		basePlane: "xy",
		baseAxis: "y",
		}		
	var dim = drawDimension3D_2(dimPar).mesh;
	par.dimensions.add(dim);

	//размер ширина фасада
	var dimPar = {
		p1: {x: pos.x, y: pos.y, z: 1},
		p2: {x: pos.x + platePar.len, y: pos.y, z: 1},
		offset: 50,
		basePlane: "xy",
		baseAxis: "x",
		}		
	var dim = drawDimension3D_2(dimPar).mesh;
	par.dimensions.add(dim);
	} //end of door
	
	
	//корпус ящика
	
	if(par.type == "drawers"){
		
		//левая панель
		var sidePlatePar = {
			len: par.len - modelDim.drawer.deltaLen,
			width: par.height - modelDim.drawer.deltaHeight,
			thk: modelDim.drawer.sideThk,
			side: "left",
			}
		var pos = {
			x: modelDim.drawer.sideOffset,
			y: modelDim.drawer.deltaHeight / 2,
			}
		sidePlatePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, -sidePlatePar.width - dxfGap)
		var panel = drawDrawerSidePlate(sidePlatePar).mesh;
	//	panel.rotation.y = Math.PI / 2;
		panel.position.x = pos.x;
		panel.position.y = pos.y;
		panel.position.z = -modelDim.door.thk; 
		
		par.carcas.add(panel);
		
		//правая панель
		sidePlatePar.side = "right";
		sidePlatePar.dxfBasePoint.y -= sidePlatePar.width + dxfGap;
		var panel = drawDrawerSidePlate(sidePlatePar).mesh;
	//	panel.rotation.y = Math.PI / 2;
		panel.position.x = par.width - modelDim.drawer.sideOffset// - modelDim.drawer.sideThk;
		panel.position.y = pos.y;
		panel.position.z = -modelDim.door.thk; 
		
		par.carcas.add(panel);
		
		//передняя панель
		var frontPlatePar = {
			len: par.width - modelDim.drawer.sideOffset * 2 - modelDim.drawer.sideThk * 2,
			width: sidePlatePar.width - modelDim.drawer.botOffset - modelDim.drawer.botThk,
			thk: modelDim.drawer.sideThk,
			partName: "drawerFrontPlate",
			}

		frontPlatePar.dxfBasePoint = newPoint_xy(sidePlatePar.dxfBasePoint, 0, -frontPlatePar.width - dxfGap);
		var panel = drawPlate(frontPlatePar).mesh;
		panel.position.x = modelDim.drawer.sideOffset + modelDim.drawer.sideThk;
		panel.position.y = pos.y + modelDim.drawer.botOffset + modelDim.drawer.botThk;
		panel.position.z = -modelDim.door.thk - frontPlatePar.thk; 
		
		par.carcas.add(panel);
		
		//задняя панель
		frontPlatePar.dxfBasePoint.y -= frontPlatePar.width + dxfGap;
		var panel = drawPlate(frontPlatePar).mesh;
		panel.position.x = modelDim.drawer.sideOffset + modelDim.drawer.sideThk;
		panel.position.y = pos.y + modelDim.drawer.botOffset + modelDim.drawer.botThk;
		panel.position.z = -modelDim.door.thk - sidePlatePar.len; 
		
		par.carcas.add(panel);
		
		//днище
		var botPlatePar = {
			len: par.width - modelDim.drawer.sideOffset * 2 - modelDim.drawer.sideThk * 2 + modelDim.drawer.botLedge * 2,
			width: par.len - modelDim.drawer.deltaLen,
			thk: modelDim.drawer.botThk,
			partName: "drawerBotPlate",
			}

		botPlatePar.dxfBasePoint = newPoint_xy(frontPlatePar.dxfBasePoint, 0, -botPlatePar.width - dxfGap);
		var panel = drawPlate(botPlatePar).mesh;
		panel.rotation.x = -Math.PI / 2;
		panel.position.x = modelDim.drawer.sideOffset + modelDim.drawer.sideThk - modelDim.drawer.botLedge;
		panel.position.y = pos.y + modelDim.drawer.botOffset;
		panel.position.z = -modelDim.door.thk; 
		
		par.carcas.add(panel);
		
		//вертикальные перемычки

		if(par.drawBrdge){
			var polePar = {
				poleProfileY: modelDim.vertBridgeThk,
				poleProfileZ: modelDim.sideWall.newellSize,
				dxfBasePoint: par.dxfBasePoint,
				length: par.height + modelDim.door.gap,
				poleAngle: Math.PI / 2,
				partName: "timberPole",
				}
			//утапливаем за фасады на сканди
			if(params.model == "Сканди") polePar.poleProfileZ -= modelDim.door.thk;
			//передняя
			var pos = {
				x: par.width + polePar.poleProfileY,
				y: 0,
				}
			polePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y)
			var bridge = drawPole3D_4(polePar).mesh;
			bridge.position.x = pos.x;
			bridge.position.y = pos.y;
			bridge.position.z = - polePar.poleProfileZ;
			if(params.model == "Сканди") bridge.position.z -= modelDim.door.thk;
			par.bridge.add(bridge);
			
			//задняя
			polePar.poleProfileZ = modelDim.sideWall.newellSize - modelDim.rearWall.offset - modelDim.rearWall.thk;
			
			var bridge = drawPole3D_4(polePar).mesh;
			bridge.position.x = pos.x;
			bridge.position.y = pos.y;
			bridge.position.z = -params.depth + modelDim.rearWall.offset + modelDim.rearWall.thk;
			par.bridge.add(bridge);
			}
			
		//боковая крепежная планка
		var sideBridgePar = {
			side: "left",
			dxfBasePoint: par.dxfBasePoint,
			}
		var sideBridge = drawSideBridge(sideBridgePar).mesh;
		sideBridge.position.x = 0;
		par.bridge.add(sideBridge);
		
		var sideBridgePar = {
			side: "right",
			dxfBasePoint: par.dxfBasePoint,
			}
		var sideBridge = drawSideBridge(sideBridgePar).mesh;
		sideBridge.position.x = par.width;
		par.bridge.add(sideBridge);
		
		//направляющие
		var slidePar = {
			len: par.len,
			width: par.width,
			}
		var slides = drawSlides(par).mesh;
		par.metiz.add(slides);
		
		
		} //end of drawer
	
		
	return par;
}

function drawHandle(par){
	if(!par) par = {};
	par.mesh = new THREE.Object3D();
	var modelDim = getModelDimensions();
	if(!par.dxfBasePoint){
		par.dxfArr = [];
		par.dxfBasePoint = {x:0, y:0};
		}
	
	par.len = 120;
	par.width = 15;
	par.height = 20;
	par.legThk = 20;
	par.thk = 5;
	
	var p0 = {x: 0, y:0};
	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p1, 0, par.legThk);
	var p3 = newPoint_xy(p2, par.height - par.thk, 0);
	var p4 = newPoint_xy(p1, par.height - par.thk, par.len - par.legThk);
	var p5 = newPoint_xy(p1, 0, par.len - par.legThk);
	var p6 = newPoint_xy(p1, 0, par.len);
	var p7 = newPoint_xy(p6, par.height, 0);
	var p8 = newPoint_xy(p1, par.height, 0);
	
	p3.filletRad = p4.filletRad = 10;
	p7.filletRad = p8.filletRad = 20;
	
	var points = [p1, p2, p3, p4, p5, p6, p7, p8];
	
	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		radIn: 0, //Радиус скругления внутренних углов
		radOut: 0, //радиус скругления внешних углов
		//markPoints: true,
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;
	
	var extrudeOptions = {
        amount: par.width,
        bevelEnabled: false,
        curveSegments: 12,
        steps: 1
		};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.metal2);
	mesh.rotation.y = -Math.PI / 2;
	mesh.position.x = par.width / 2;
	mesh.position.y = -par.len / 2;
	par.mesh.add(mesh);
	
	//сохраняем данные для спецификации
	par.partName = "handle";
	par.thk = modelDim.countertop.thk;
	if(typeof specObj !='undefined' && par.partName){
		if(!specObj[par.partName]){
			specObj[par.partName] = {
				types: {},
				amt: 0,
				name: "Ручка",
				area: 0,
				paintedArea: 0,
				paintedArea: 0,
				metalPaint: false,
				timberPaint: false,
				division: "stock_1",
				group: "Наполнение",
				}
			}
	//	var area = par.len * par.width / 1000000;
	//	var paintedArea = area * 2 + (par.len + par.width) * 2 * par.thk / 1000000;
		
		var name = Math.round(par.len) + "x" + Math.round(par.width) + "x" + Math.round(par.height);
		if(specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] += 1;
		if(!specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] = 1;
		specObj[par.partName]["amt"] += 1;
	//	specObj[par.partName]["area"] += area;
	//	specObj[par.partName]["paintedArea"] += paintedArea;
		}

	return par;	


}//end of drawHandle

function drawSideBridge(par){
	if(!par) par = {};
	par.mesh = new THREE.Object3D();
	var modelDim = getModelDimensions();
	par.dxfArr = dxfPrimitivesArr;
	if(!par.dxfBasePoint){
		par.dxfArr = [];
		par.dxfBasePoint = {x:0, y:0};
		}
	
	par.len = params.depth - modelDim.door.thk * 2;
	par.width = 60;
	par.thk = params.thinBoardThk;
	var minThk = 10; //остаточноая толщина в месте выборки четверти
	par.ledgeDepth = par.thk - minThk;
	par.ledgeLen = modelDim.sideWall.newellSize - modelDim.door.thk;
	
	
	var p0 = {x: 0, y:0};
	
	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p1, 0, par.len);
	var p3 = newPoint_xy(p2, minThk, 0);
	var p4 = newPoint_xy(p3, 0, -par.ledgeLen);
	var p5 = newPoint_xy(p4, par.ledgeDepth, 0);
	var p6 = newPoint_xy(p1, par.thk, par.ledgeLen);
	var p7 = newPoint_xy(p6, -par.ledgeDepth, 0);
	var p8 = newPoint_xy(p1, minThk, 0);
	
	var points = [p1, p2, p3, p4, p5, p6, p7, p8];
	
	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		radIn: 0, //Радиус скругления внутренних углов
		radOut: 0, //радиус скругления внешних углов
		//markPoints: true,
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;
	
	var extrudeOptions = {
        amount: par.width,
        bevelEnabled: false,
        curveSegments: 12,
        steps: 1
		};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.metal2);
	
	mesh.rotation.x = -Math.PI / 2;
	mesh.position.z = -modelDim.door.thk;
	if(par.side == "left") {
		mesh.rotation.y = Math.PI;
		mesh.position.x = minThk;
		mesh.position.y = par.width;
		}
	if(par.side == "right") {
		mesh.position.x = -minThk;
		}
//	mesh.position.x = par.width / 2;
//	mesh.position.y = -par.len / 2;
	
	par.mesh.add(mesh);
	
	//сохраняем данные для спецификации
	par.partName = "sideBridge";
	par.thk = params.thinBoardThk;
	if(typeof specObj !='undefined' && par.partName){
		if(!specObj[par.partName]){
			specObj[par.partName] = {
				types: {},
				amt: 0,
				name: "Перемычка боковины ",
				area: 0,
				paintedArea: 0,
				metalPaint: false,
				timberPaint: true,
				division: "timber",
				group: "Наполнение",
				}
			}
		var area = par.len * par.width / 1000000;
		var paintedArea = area * 2 + (par.len + par.width) * 2 * par.thk / 1000000;
		
		var name = Math.round(par.len) + "x" + Math.round(par.width) + "x" + Math.round(par.thk) + ", четверть " + par.ledgeDepth + "х" + par.ledgeLen;
		if(specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] += 1;
		if(!specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] = 1;
		specObj[par.partName]["amt"] += 1;
		specObj[par.partName]["area"] += area;
		specObj[par.partName]["paintedArea"] += paintedArea;
		}

	return par;	


}//end of drawSideBridge

function drawSlides(par){
	
	if(!par) par = {};
	par.mesh = new THREE.Object3D();
	var modelDim = getModelDimensions();
	var side
	
	//левая сторона
	var slidePar = {
		side: "left",
		len: par.len,
		}
	
	var slide = drawDrawerSlide(slidePar).mesh;
	slide.position.x = 10;
	slide.position.y = 3.5;
	par.mesh.add(slide);
	
	//правая сторона
	var slidePar = {
		side: "right",
		len: par.len,
		}
	
	var slide = drawDrawerSlide(slidePar).mesh;
	slide.position.x = par.width - 10;
	slide.position.y = 3.5;
	par.mesh.add(slide);
	

	//сохраняем данные для спецификации
	par.partName = "drawerSlide";
	par.thk = modelDim.countertop.thk;
	if(typeof specObj !='undefined' && par.partName){
		if(!specObj[par.partName]){
			specObj[par.partName] = {
				types: {},
				amt: 0,
				name: "Направляющие ящика, к-т L=",
				area: 0,
				paintedArea: 0,
				paintedArea: 0,
				metalPaint: false,
				timberPaint: false,
				division: "stock_1",
				group: "Наполнение",
				}
			}
		var name = Math.round(par.len);
		if(specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] += 1;
		if(!specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] = 1;
		specObj[par.partName]["amt"] += 1;
		}

	return par;


} //end of drawSlides

function drawDrawerSlide(par){
	if(!par) par = {};
	par.mesh = new THREE.Object3D();
	var modelDim = getModelDimensions();
	par.dxfArr = [];
	if(!par.dxfBasePoint){
		par.dxfArr = [];
		par.dxfBasePoint = {x:0, y:0};
		}
		
	//параметры боковины петли
	var sidePar = {
		thk: 2,
		height: 45,
		width: 37,
		height2: 11.5,
		}
	//неподвижная часть
	var p0 = {x: 0, y:0};
	
	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p1, 0, sidePar.height);
	var p3 = newPoint_xy(p2, sidePar.thk, 0);
	var p4 = newPoint_xy(p1, sidePar.thk, sidePar.thk);
	var p5 = newPoint_xy(p1, sidePar.width - sidePar.thk, sidePar.thk);	
	var p6 = newPoint_xy(p1, sidePar.width - sidePar.thk, sidePar.height2);
	var p7 = newPoint_xy(p6, sidePar.thk, 0);
	var p8 = newPoint_xy(p1, sidePar.width, 0);
	
	var points = [p1, p2, p3, p4, p5, p6, p7, p8];
	
	if(par.side == "right"){
		for(var i=0; i<points.length; i++){
			points[i].x *= -1;
			}
		}

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		radIn: 0, //Радиус скругления внутренних углов
		radOut: 0, //радиус скругления внешних углов
		//markPoints: true,
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;
	
	var extrudeOptions = {
        amount: par.len * 0.6,
        bevelEnabled: false,
        curveSegments: 12,
        steps: 1
		};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.metal3);
/*	
	mesh.rotation.x = -Math.PI / 2;
	mesh.position.z = -modelDim.door.thk;
	if(par.side == "left") {
		mesh.rotation.y = Math.PI;
		mesh.position.x = par.ledgeDepth;
		mesh.position.y = par.width;
		}
	if(par.side == "right") {
		mesh.position.x = -par.ledgeDepth;
		}
//	mesh.position.x = par.width / 2;
//	mesh.position.y = -par.len / 2;
*/	
	mesh.position.z = -par.len * 0.6 - modelDim.door.thk;
	par.mesh.add(mesh);
	
	//подвижная часть
	var polePar = {
		poleProfileY: 15,
		poleProfileZ: 29,
		dxfBasePoint: par.dxfBasePoint,
		length: par.len,
		poleAngle: 0,
		}
	// взято из каталога
	var pos = {
		x: 21, 
		y: 26.5 - polePar.poleProfileY,
		}
	if(par.side == "right") pos.x = -21 - polePar.poleProfileZ;
	polePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y)
	var pole = drawPole3D_4(polePar).mesh;
	pole.rotation.y = Math.PI / 2;
	pole.position.x = pos.x;
	pole.position.y = pos.y;
	pole.position.z = -modelDim.door.thk;
	if(isDoorsOpened) pole.position.z += par.len;
	par.mesh.add(pole);
	
	
	
return par;
} //end of drawDrawerSlide

function drawDrawerSidePlate(par){
	if(!par) par = {};
	par.mesh = new THREE.Object3D();
	var modelDim = getModelDimensions();
	par.dxfArr = dxfPrimitivesArr;
	if(!par.dxfBasePoint){
		par.dxfArr = [];
		par.dxfBasePoint = {x:0, y:0};
		}
	
	var minThk = 16;
	var slotOffset = 10;
	var slotDepth = 12;
	var slotWidth = modelDim.drawer.botThk;

	var p0 = {x: 0, y:0};
	
	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p1, 0, par.width);
	var p3 = newPoint_xy(p2, par.thk, 0);
	var p4 = newPoint_xy(p1, par.thk, slotOffset + slotWidth);
	var p5 = newPoint_xy(p4, -slotDepth, 0);
	var p6 = newPoint_xy(p5, 0, -slotWidth);
	var p7 = newPoint_xy(p1, minThk, slotOffset);
	var p8 = newPoint_xy(p1, minThk, 0);
	
	var points = [p1, p2, p3, p4, p5, p6, p7, p8];
	if(par.side == "right"){
		for(var i=0; i<points.length; i++){
			points[i].x *= -1;
			}
		}
	
	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		radIn: 0, //Радиус скругления внутренних углов
		radOut: 0, //радиус скругления внешних углов
		//markPoints: true,
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;
	
	var extrudeOptions = {
        amount: par.len,
        bevelEnabled: false,
        curveSegments: 12,
        steps: 1
		};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.timber);
	mesh.position.z = -par.len;
	
	par.mesh.add(mesh);
	
	//сохраняем данные для спецификации
	par.partName = "drawerSidePlate";
	par.thk = modelDim.drawer.sideThk;
	if(typeof specObj !='undefined' && par.partName){
		if(!specObj[par.partName]){
			specObj[par.partName] = {
				types: {},
				amt: 0,
				name: "Боковина ящика ",
				area: 0,
				paintedArea: 0,
				paintedArea: 0,
				metalPaint: false,
				timberPaint: true,
				division: "timber",
				group: "Наполнение",
				}
			}
		var area = par.len * par.width / 1000000;
		var paintedArea = area * 2 + (par.len + par.width) * 2 * par.thk / 1000000;
		
		var name = Math.round(par.len) + "x" + Math.round(par.width) + "x" + Math.round(par.thk) + ", паз " + modelDim.drawer.botThk;
		if(specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] += 1;
		if(!specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] = 1;
		specObj[par.partName]["amt"] += 1;
		specObj[par.partName]["area"] += area;
		specObj[par.partName]["paintedArea"] += paintedArea;
		}

	return par;	

} //end of drawDrawerSidePlate


function drawShelf(par){
	par.carcas = new THREE.Object3D();
	par.metiz = new THREE.Object3D();
	par.doors = new THREE.Object3D();
	par.bridge = new THREE.Object3D(); //перемычки
	par.dimensions = new THREE.Object3D();
	
	var modelDim = getModelDimensions();
	var frontOffset = 50; //отступ торца полки от передней плоскости шкафа
	var rearOffset = modelDim.rearWall.thk + modelDim.rearWall.offset;
	
	var platePar = {
		len: par.size.x,
		width: params.depth - frontOffset - rearOffset,
		thk: par.size.y,
		partName: "shelf",
		dxfBasePoint: par.dxfBasePoint,
		}
	if(par.type == "штанга"){
		platePar.width = 20;
		platePar.thk = 40;	
		platePar.partName = "rail";
		}
	
		var panel = drawPlate(platePar).mesh;
		panel.rotation.x = -Math.PI / 2;
		panel.position.x = par.pos.x;
		panel.position.y = par.pos.y;
		panel.position.z = platePar.width + rearOffset;
		if(par.type == "штанга") panel.position.z +=  params.depth / 2;
		
		par.carcas.add(panel);
		
	return par;

}//end of drawShelf