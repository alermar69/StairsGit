
/** функция рисует обстановку для подоконника
*/

function drawSillEnv(par){
	if(!par) par = {};
	initPar(par);
	

	var p0 = {x: 0, y:0}; //точка на полу под центром стены
	
	//точки без учета вырезов
	var p1 = newPoint_xy(p0, -par.windowWidth / 2 - par.windowOffsetLeft, 0);
	var p4 = newPoint_xy(p0, par.windowWidth / 2 + par.windowOffsetRight, 0);
	
	if(par.geom == "балконное окно" || par.geom == "подоконный блок") {
		if(par.geomSide == "правая") p1.x -= par.doorWidth
		if(par.geomSide == "левая") p4.x += par.doorWidth
	}
	
	var p2 = newPoint_xy(p1, 0, par.ceilHeight);	
	var p3 = newPoint_xy(p4, 0, par.ceilHeight);
	
	var points = [p1, p2, p3, p4];
	
	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		//radIn: radIn, //Радиус скругления внутренних углов
		radOut: 0, //радиус скругления внешних углов
		//markPoints: true,
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;
	
	//окно
	var ph0 = {x: 0, y: par.height};
	
	var ph1 = newPoint_xy(ph0, -par.windowWidth / 2, 0);
	var ph2 = newPoint_xy(ph1, 0, par.windowHeight);
	var ph4 = newPoint_xy(ph0, par.windowWidth / 2, 0);
	var ph3 = newPoint_xy(ph4, 0, par.windowHeight);
	
	var holePoints = [ph4, ph3, ph2, ph1];
	
		
	//боковой вырез
	if(par.geom == "балконное окно" || par.geom == "подоконный блок"){
		par.doorHeight = par.height + par.windowHeight - 50;
		if(par.geomSide == "правая") {			
			ph7 = newPoint_xy(ph2, -par.doorWidth, 0); //левый верхний угол двери
			ph6 = newPoint_xy(ph7, 0, -par.doorHeight); //левый нижний
			ph5 = newPoint_xy(ph6, par.doorWidth, 0); //правый нижний
			
			holePoints = [ph4, ph3, ph7, ph6, ph5, ph1];
		}
		if(par.geomSide == "левая") {
			ph7 = newPoint_xy(ph3, par.doorWidth, 0); //правый верхний угол двери
			ph6 = newPoint_xy(ph7, 0, -par.doorHeight); //правый нижний
			ph5 = newPoint_xy(ph6, -par.doorWidth, 0); //левый нижний
			
			holePoints = [ph4, ph5, ph6, ph7, ph2, ph1];
		}
		
	}
	
	var shapePar = {
		points: holePoints,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		//radIn: radIn, //Радиус скругления внутренних углов
		radOut: 0, //радиус скругления внешних углов
		//markPoints: true,
	}
	
	var hole = drawShapeByPoints2(shapePar).shape;
	
	shape.holes.push(hole)
	
	var extrudeOptions = {
				amount: par.wallThk,
				bevelEnabled: false,
				curveSegments: 12,
				steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.wall);
	par.mesh.add(mesh);
	mesh.setLayer("wall1");

	//откосы
	if(par.wallSideBevel > 0 && par.geom != "подоконный блок"){
		var pt1 = {x: 0, y:0};
		var pt2 = newPoint_xy(pt1, 0, par.windowPosZ);
		var pt3 = newPoint_xy(pt1,  par.wallSideBevel, par.windowPosZ);

		var points = [pt1, pt2, pt3];
		
		//создаем шейп
		var shapePar = {
			points: points,
			dxfArr: [],
			dxfBasePoint: par.dxfBasePoint,
			//radIn: radIn, //Радиус скругления внутренних углов
			radOut: 0, //радиус скругления внешних углов
			//markPoints: true,
		}
		
		var shape = drawShapeByPoints2(shapePar).shape;
		
		var extrudeOptions = {
			amount: par.windowHeight,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};

		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var bevel = new THREE.Mesh(geom, params.materials.wall);
		bevel.rotation.x = -Math.PI / 2
		
		bevel.position.x = - par.windowWidth / 2
		bevel.position.y = par.height
		bevel.position.z = par.wallThk
		bevel.setLayer("wall1");
		
		if(par.geom != "балконное окно" || par.geomSide == "левая") par.mesh.add(bevel);
		
		
		var bevel = new THREE.Mesh(geom, params.materials.wall);
		bevel.rotation.x = Math.PI / 2
		bevel.rotation.z = Math.PI
		
		bevel.position.x = par.windowWidth / 2
		bevel.position.y = par.height + par.windowHeight
		bevel.position.z = par.wallThk;
		bevel.setLayer("wall1");
		
		if(par.geom != "балконное окно" || par.geomSide == "правая") par.mesh.add(bevel);
	}
	
	//стена справа
	if(par.sideWall == "справа" || par.sideWall == "две"){
		var wallLen = par.wallThk + 1000
		var geom = new THREE.BoxGeometry(wallLen, par.ceilHeight, par.wallThk);
		var wall = new THREE.Mesh( geom, params.materials.wall );
		wall.rotation.y = Math.PI / 2;
		wall.position.x = p4.x + par.wallThk / 2
		wall.position.y = par.ceilHeight / 2;
		wall.position.z = wallLen / 2;
	
		par.mesh.add(wall);
		wall.setLayer("wall1");
	}
	
	//стена слева
	if(par.sideWall == "слева" || par.sideWall == "две"){
		var wallLen = par.wallThk + 1000
		var geom = new THREE.BoxGeometry(wallLen, par.ceilHeight, par.wallThk);
		var wall = new THREE.Mesh( geom, params.materials.wall );
		wall.rotation.y = Math.PI / 2;
		wall.position.x = p1.x - par.wallThk / 2
		wall.position.y = par.ceilHeight / 2;
		wall.position.z = wallLen / 2;
	
		par.mesh.add(wall);
		wall.setLayer("wall1");
	}
	
	//окно
	if(par.geom != "подоконный блок"){
		var windowPar = {
			width: par.windowWidth,
			windowsCount: par.windowSectAmt,
			height: par.windowHeight,
			mat: params.materials.whitePlastic,
		}
		var wnd = drawWindow(windowPar).mesh
		wnd.position.y = par.height
		wnd.position.x = -par.windowWidth / 2
		wnd.position.z = par.wallThk - par.windowPosZ - 40
		
		par.mesh.add(wnd);
	}
	
	//балконная дверь
	if(par.geom == "балконное окно"){
		
		var windowPar = {
			width: par.doorWidth,
			windowsCount: 1,
			height: par.doorHeight,
			mat: params.materials.whitePlastic,
		}
		var wnd = drawWindow(windowPar).mesh
		wnd.position.y = 50
		wnd.position.x = par.windowWidth / 2// + par.doorWidth
		if(par.geomSide == "правая") wnd.position.x = -par.windowWidth / 2 - par.doorWidth
		wnd.position.z = par.wallThk - par.windowPosZ - 40
		
		par.mesh.add(wnd);
	}

	// Откосы деревянные
	if(par.windowSlope == 'есть'){
		var slopeThickness = 20;
		var slopeWidth = par.windowWidth;
		var slopeHeight = par.windowHeight - slopeThickness - 10 - par.thk;
		var bevelAngle = 0;

		if(par.wallSideBevel > 0 && par.geom != "подоконный блок"){
			var pt1 = {x: 0, y:0};
			var pt2 = newPoint_xy(pt1,  par.wallSideBevel, par.windowPosZ);
			bevelAngle = angle(pt1, pt2)
		}

		var platePar = {
			len: par.windowPosZ,
			width: slopeHeight,
			thk: slopeThickness,
			partName: "windowSlope",
			material: params.materials.additionalObjectTimber || params.materials.timber
		}
		var vertPart1 = drawPlate(platePar).mesh;
		vertPart1.rotation.y = Math.PI / 2 + (Math.PI / 2 - bevelAngle);
		vertPart1.position.z = (par.wallThk - par.windowPosZ) + platePar.len;
		vertPart1.position.x = par.windowWidth / 2 - platePar.thk;
		vertPart1.position.y = par.height + 10 + par.thk;
		par.mesh.add(vertPart1);

		var vertPart2 = drawPlate(platePar).mesh;
		vertPart2.rotation.y = Math.PI / 2 - (Math.PI / 2 - bevelAngle);
		vertPart2.position.z = (par.wallThk - par.windowPosZ) + platePar.len;
		vertPart2.position.x = -par.windowWidth / 2;
		vertPart2.position.y = par.height + 10 + par.thk;
		par.mesh.add(vertPart2);

		var platePar = {
			len: slopeWidth,
			width: par.windowPosZ,
			thk: slopeThickness,
			partName: "windowSlope",
			material: params.materials.additionalObjectTimber || params.materials.timber
		}
		var horPart = drawPlate(platePar).mesh;
		horPart.rotation.x = Math.PI / 2;
		horPart.position.z = (par.wallThk - par.windowPosZ);// + platePar.width;
		horPart.position.x = -platePar.len / 2;
		horPart.position.y = par.height + par.windowHeight;
		par.mesh.add(horPart);

		// Наличники
		var slopeSize = 40;
		var platePar = {
			len: slopeSize,
			width: slopeHeight + par.thk,
			thk: 4,
			partName: "windowSlope",
			material: params.materials.additionalObjectTimber || params.materials.timber
		}
		var plate = drawPlate(platePar).mesh;
		plate.position.z = par.wallThk;
		plate.position.x = par.windowWidth / 2 - slopeThickness;
		plate.position.y = par.height + 10 + par.thk;
		par.mesh.add(plate);

		var plate = drawPlate(platePar).mesh;
		plate.position.z = par.wallThk;
		plate.position.x = -par.windowWidth / 2 - slopeSize + slopeThickness;
		plate.position.y = par.height + 10 + par.thk;
		par.mesh.add(plate);

		var platePar = {
			len: slopeWidth - slopeThickness * 2, // 40 * 2 - Два наличника
			width: slopeSize,
			thk: 4,
			partName: "windowSlope",
			material: params.materials.additionalObjectTimber || params.materials.timber
		}
		var horPlate = drawPlate(platePar).mesh;
		horPlate.position.z = par.wallThk;
		horPlate.position.x = -par.windowWidth / 2 + slopeThickness;
		horPlate.position.y = par.height + par.windowHeight - slopeThickness;
		par.mesh.add(horPlate);
	}
	
	
	return par;
}


function drawSill(par){
	if(!par) par = {};
	initPar(par)
	
	if(!par.objectAmt) par.objectAmt = 1;
	
//	par.len = par.windowWidth + par.rightNose + par.leftNose;
//	par.width = par.windowPosZ + par.frontNose;
//	if(par.geom == "подоконный блок") par.width = par.wallThk + par.frontNose * 2

	var p0 = {x: 0, y:0}; //точка в середине передней кромки
	var p1 = newPoint_xy(p0, -par.windowWidth / 2 - par.leftNose, 0);
	var p2 = newPoint_xy(p1, 0, par.width);
	var p4 = newPoint_xy(p0, par.windowWidth / 2 + par.rightNose, 0);
	var p3 = newPoint_xy(p4, 0, par.width);

	p1.filletRad = par.cornerRadLeft
	p4.filletRad = par.cornerRadRight
	if(par.geom == "подоконный блок") {
		p2.filletRad = par.cornerRadLeft
		p3.filletRad = par.cornerRadRight
	}

	if (par.cutWallHole == 'да') {
		var p21 = newPoint_xy(p2, 0, -par.windowPosZ);
		var p22 = newPoint_xy(p21, par.rightNose, 0);
		var p23 = newPoint_xy(p22, par.wallSideBevel, par.windowPosZ);

		var p31 = newPoint_xy(p3, 0, -par.windowPosZ);
		var p32 = newPoint_xy(p31, -par.leftNose, 0);
		var p33 = newPoint_xy(p32, -par.wallSideBevel, par.windowPosZ);

		var points = [p1, p21, p22, p23, p33, p32, p31, p4];
	}
	else{
		var points = [p1, p2, p3, p4];
	}
	
	//делаем вырезы на передней кромке если есть экран тип 3
	if (par.screenType == '03') {
		var cutDepth = par.frontNose;
		var frontPoints = [];
		var poleAmt = Math.round((par.len - (par.screenSidePoleSize - par.screenPoleSize) - par.screenSidePoleSize) / par.screenPoleStep)
		var poleStep = (par.len - (par.screenSidePoleSize - par.screenPoleSize) - par.screenSidePoleSize) / (poleAmt)
		var holeWidth = poleStep - par.screenPoleSize
		
		var posX = 0;
		for (var i = 0; i < poleAmt; i++) {
			//крайние бруски большей ширины
			if(i == 0 || i == poleAmt) {
				poleWidth = par.screenSidePoleSize
			}
			else {
				poleWidth = par.screenPoleSize
			}
			
			var ph1 = newPoint_xy(p1, posX + poleWidth, 0)
			var ph2 = newPoint_xy(ph1, 0, cutDepth)
			var ph3 = newPoint_xy(ph2, holeWidth, 0)
			var ph4 = newPoint_xy(ph1, holeWidth, 0)
			frontPoints.push(ph1, ph2, ph3, ph4)
			
			posX += poleStep;
			if(i==0) posX += par.screenSidePoleSize - par.screenPoleSize;
		}
		points = [...points, ...frontPoints.reverse()];
	}
	
	var len = par.len;
	var width = par.width;
	if (par.modifyKey && window.service_data && window.service_data.shapeChanges && window.service_data.shapeChanges.length > 0) {
		var modify = window.service_data.shapeChanges.find(function(change){
			return change.modifyKey == par.modifyKey
		})
		if (modify) {
			shape = getShapeFromModify(modify);
			var bbox = findBounds(shape.getPoints());
			len = bbox.x;
			width = bbox.y;
		}
	}

	if (!shape) {
		//создаем шейп
		var shapePar = {
			points: points,
			dxfArr: par.dxfArr,
			dxfBasePoint: par.dxfBasePoint,
		}
		
		var shape = drawShapeByPoints2(shapePar).shape;
	}

//стык на длинных подокониках
	par.parts = [par.len];
	if (par.len > 3000) {
		var sideOffset = par.splitOffset * 1.0 || 1000;
		var holeSize = 0.5;
		var splitP1 = newPoint_xy(p1, sideOffset, 0.01);
		var splitP2 = newPoint_xy(p2, sideOffset, -0.01);
		var splitP3 = newPoint_xy(splitP2, holeSize, 0);
		var splitP4 = newPoint_xy(splitP1, holeSize, 0);

		var shapePar = {
			points: [splitP1, splitP2, splitP3, splitP4],
			dxfArr: par.dxfArr,
			dxfBasePoint: par.dxfBasePoint,
		}
		
		var hole = drawShapeByPoints2(shapePar).shape;
		shape.holes.push(hole);
		
		par.parts = [sideOffset, par.len - sideOffset];	

	}

	//Отверстия

	if(par.ventHoles != "нет"){
		if(par.ventHolesOffsetRight == undefined) par.ventHolesOffsetRight = par.ventHolesSideOffset
		var holesArr = {
		  len: par.windowWidth - par.ventHolesSideOffset - par.ventHolesOffsetRight,
		  centers: [],
		}
		holesArr.amt = Math.ceil(holesArr.len / par.ventHolesStep) + 1;
		holesArr.step = holesArr.len / (holesArr.amt - 1)

		for(var i=0; i<holesArr.amt; i++){
		  var center = newPoint_xy(p0, -par.windowWidth / 2 + par.ventHolesSideOffset + holesArr.step * i, par.ventHolesFrontOffset)

		  if(par.ventHoles == "круглые"){
				addRoundHole(shape, par.dxfArr, center, par.ventHolesSize / 2, par.dxfBasePoint)
		  }
		  if(par.ventHoles != "круглые"){
				var drawHoleFunc = addOvalHoleX
				if(par.ventHoles == "овальные поперек") drawHoleFunc = addOvalHoleY				
				drawHoleFunc(shape, par.dxfArr, center, par.ventHolesSize / 2, par.ventHolesLen, par.dxfBasePoint, true)
		  }
		}
	}
	
	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.additionalObjectTimber || params.materials.timber);
	if(par.modifyKey) mesh.modifyKey = par.modifyKey;
	mesh.rotation.x = -Math.PI / 2;
	mesh.setLayer("timberPart");
	par.mesh.dimObject = mesh;
	par.mesh.add(mesh);


	if (par.botPoleType == 'спереди') {
		var p0 = {x: 0, y:0}; //точка в середине передней кромки
		var p1 = newPoint_xy(p0, -par.windowWidth / 2 - par.leftNose, 0);
		var p2 = newPoint_xy(p1, 0, par.botPoleWidth);
		var p4 = newPoint_xy(p0, par.windowWidth / 2 + par.rightNose, 0);
		var p3 = newPoint_xy(p4, 0, par.botPoleWidth);

		p1.filletRad = par.cornerRadLeft
		p4.filletRad = par.cornerRadRight
		if(par.geom == "подоконный блок") {
			p2.filletRad = par.cornerRadLeft
			p3.filletRad = par.cornerRadRight
		}

		var points = [p1, p2, p3, p4];
		
		//создаем шейп
		var shapePar = {
			points: points,
			dxfArr: par.dxfArr,
			dxfBasePoint: par.dxfBasePoint,
		}
		
		var shape = drawShapeByPoints2(shapePar).shape;

		var extrudeOptions = {
			amount: par.botPoleThk,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};
	
		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var mesh = new THREE.Mesh(geom, params.materials.additionalObjectTimber || params.materials.timber);
		mesh.rotation.x = -Math.PI / 2;
		mesh.position.y = -par.botPoleThk;
		par.mesh.add(mesh);
	}

	if (par.botPoleType == '3 ребра') {
		var p0 = {x: 0, y:0}; //точка в середине передней кромки
		var p1 = newPoint_xy(p0, -par.windowWidth / 2 - par.leftNose, 0);
		var p2 = newPoint_xy(p1, 0, par.width);
		var p3 = newPoint_xy(p2, par.botPoleWidth, 0);
		var p4 = newPoint_xy(p1, par.botPoleWidth, par.botPoleWidth);
		
		var p8 = newPoint_xy(p0, par.windowWidth / 2 + par.rightNose, 0);
		var p7 = newPoint_xy(p8, 0, par.width);
		var p6 = newPoint_xy(p7, -par.botPoleWidth, 0);
		var p5 = newPoint_xy(p8, -par.botPoleWidth, par.botPoleWidth);

		p1.filletRad = par.cornerRadLeft
		p8.filletRad = par.cornerRadRight
		if(par.geom == "подоконный блок") {
			p2.filletRad = par.cornerRadLeft
			p7.filletRad = par.cornerRadRight
		}

		var points = [p1, p2, p3, p4, p5, p6, p7, p8];
		
		//создаем шейп
		var shapePar = {
			points: points,
			dxfArr: par.dxfArr,
			dxfBasePoint: par.dxfBasePoint,
		}
		
		var shape = drawShapeByPoints2(shapePar).shape;

		var extrudeOptions = {
			amount: par.botPoleThk,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};
	
		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var mesh = new THREE.Mesh(geom, params.materials.additionalObjectTimber || params.materials.timber);
		mesh.rotation.x = -Math.PI / 2;
		mesh.position.y = -par.botPoleThk;
		par.mesh.add(mesh);
	}
	
	//сохраняем данные для спецификации
	var partName = 'sill';
	if(par.shapeType == "по чертежу") partName = 'sill_cnc';
	if(par.tabletopType.indexOf("слэб") != -1) partName = 'slab';
	
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				area: 0,
				paintedArea: 0,
				name: 'Подоконник',
				metalPaint: false,
				timberPaint: true,
				isModelData: true,
				division: "timber",
				purposes: [],
				workUnitName: "amt",
				group: "Объекты",
				//дополнительные данные
				lineTemplatesAmt: 0,
				curveTemplates: 0,
				breaking: 0,
				typeComments: {},
				size: {}
			}
		}
		
		var area = len * width / 1000000 * par.objectAmt
		name = '№' + par.objId + ' ' + par.shapeType + " " + Math.round(len) + "х" + Math.round(width) + "х" + Math.round(par.thk);
		if (par.len > 3000){
			var len_name = ""
			par.parts.forEach(function(p){
				if(len_name) len_name += "+"
				len_name += Math.round(p)
			});			
			name = '№' + par.objId + ' ' + par.shapeType + " составной " + Math.round(width) + "х" + Math.round(par.thk) + " L=" + len_name;
		}
		if(partName == 'slab'){
			name = '№' + par.objId + ' из слэба ' + par.slabModel + ', ' + par.shapeType + " " + Math.round(len) + "х" + Math.round(width) + "х" + Math.round(par.thk);
		}
		
		 
			
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1 * par.objectAmt;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1 * par.objectAmt;
		specObj[partName]["amt"] += 1 * par.objectAmt;
		specObj[partName]["sumLength"] += len / 1000 * par.objectAmt;
		specObj[partName]["area"] += area;
		specObj[partName]["paintedArea"] += len * width / 1000000 * par.objectAmt;
		
		specObj[partName].typeComments[name] = getSillSpecComment(par);
		specObj[partName].size[name] = {
			width: width,
			len: len,
			parts: par.parts,
		};
		
		par.mesh.specParams = {specObj: specObj, amt: 1 * par.objectAmt, partName: partName, name: name}
		
		//дополнительные данные
		if(par.shapeType == "по шаблону") specObj[partName]["lineTemplatesAmt"] += 1 * par.objectAmt;
		if(par.shapeType == "по шаблону (криволин.)") specObj[partName]["curveTemplates"] += 1 * par.objectAmt;
		if(par.breaking == "есть") specObj[partName]["breaking"] += 1 * par.objectAmt;
	}
	
	par.mesh.specId = partName + name;
	
	//добавляем информацию в материалы с учетом обрезков
	par.parts.forEach(function(partLen){
		var billetPar = calcBilletSize({
			len: partLen,
			width: width,
			thk: par.thk,
			type: "щит"
		});
		
		var panelName_40 = calcTimberParams(params.additionalObjectsTimberMaterial).treadsPanelName;	
		var panelName_20 = calcTimberParams(params.additionalObjectsTimberMaterial).riserPanelName;

		if(par.thk == 20) addMaterialNeed({id: panelName_20, amt: billetPar.area, itemType:  'sill'});
		if(par.thk == 40) addMaterialNeed({id: panelName_40, amt: billetPar.area, itemType:  'sill'});
		if(par.thk == 60) {
			addMaterialNeed({id: panelName_20, amt: billetPar.area, itemType:  'sill'});
			addMaterialNeed({id: panelName_40, amt: billetPar.area, itemType:  'sill'});
		}
	})
	par.mesh.isInMaterials = true;
	console.log(par)
	return par
}

/** функция отрисовывает радиусный эркер
**/

function drawRadOriel(par){
	if(!par) par = {};
	initPar(par)
	
	var orielWindowCount = par.orielWindowCount;

	var sPar = calcSegmentPar(par.orielSizeA, par.orielSizeC);
	var ang = Math.abs(sPar.halfAngle) * 2;
	if (ang == 0) ang = Math.PI / 2;
	// var windowSize = (sPar.rad * (ang * 2)) / orielWindowCount;
	var angleStep = ang / orielWindowCount;
	var windowSize = sPar.rad * Math.sin(angleStep / 2) * 2
	var startAngle = (Math.PI - ang) / 2;

	var windowPointStart = polar(sPar.center, startAngle, sPar.rad);
	windowPointStart = polar(windowPointStart, startAngle + angleStep * 0.5, par.windowPosZ);

	var windowPointEnd = polar(sPar.center, startAngle + angleStep, sPar.rad);
	windowPointEnd = polar(windowPointEnd, startAngle + angleStep * 1.5, par.windowPosZ);

	var wndSize = distance(windowPointStart,windowPointEnd);
	var orielWrapper = new THREE.Object3D();
	for(var i=0; i < orielWindowCount; i++){
		var p0 = {x: 0, y:0}; //точка в середине передней кромки
		var p1 = newPoint_xy(p0, windowSize, 0);
		var p2 = newPoint_xy(p1, 0, par.height);
		var p3 = newPoint_xy(p2, -windowSize, 0);
		var points = [p0, p1, p2, p3];
		//создаем шейп
		var shapePar = {
			points: points,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: par.dxfBasePoint,
		}
		
		var shape = drawShapeByPoints2(shapePar).shape;
		
		var extrudeOptions = {
			amount: par.wallThk,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};

		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var mesh = new THREE.Mesh(geom, params.materials.wall);
		mesh.setLayer("wall1");

		var basePointPart = polar(sPar.center, startAngle + angleStep * i, sPar.rad);
		mesh.rotation.y = Math.PI / 2 + angleStep * (i + 0.5) + startAngle;
		mesh.position.x = basePointPart.x;
		mesh.position.z = -basePointPart.y;

		orielWrapper.add(mesh);

		var windowPar = {
			width: wndSize,
			windowsCount: 1,
			height: par.windowHeight,
			mat: params.materials.whitePlastic,
		}
		var basePointWindow = polar(sPar.center, startAngle + angleStep * i, sPar.rad + par.windowPosZ);
		// if (i == 0) {
		// 	basePointWindow = polar(basePointWindow, startAngle + angleStep * (i + 0.5), par.windowPosZ)
		// 	windowPar.width -= par.windowPosZ * Math.tan(angleStep / 2);
		// }else{
		// 	basePointWindow = polar(sPar.center, startAngle + angleStep * i, sPar.rad + par.windowPosZ);
		// }

		// if (i == orielWindowCount - 1) {
		// 	windowPar.width -= par.windowPosZ * Math.tan(angleStep / 2);
		// }
		var wnd = drawWindow(windowPar).mesh
		wnd.rotation.y = Math.PI / 2 + angleStep * (i + 0.5) + startAngle;
		wnd.position.y = par.height
		wnd.position.x = basePointWindow.x
		wnd.position.z = -basePointWindow.y
		orielWrapper.add(wnd);
	}
	par.mesh.add(orielWrapper);

	// Отрисовка шейпа подоконника
	var sillPoints = [];
	var rightOffsetAngle = par.rightNose / sPar.rad;
	var leftOffsetAngle = par.leftNose / sPar.rad;

	if (par.radSillType == 'дуга') {
		var shape = new THREE.Shape();
		// Точки у окна
		var firstPoint = null;
		var lastPoint = null;
		// Правый свес
		var p1 = polar(sPar.center, startAngle - rightOffsetAngle, sPar.rad + par.windowPosZ);
		var p2 = polar(sPar.center, startAngle, sPar.rad + par.windowPosZ);
		addLine(shape, dxfPrimitivesArr, p1, p2, par.dxfBasePoint);
		firstPoint = p1;
		for(var i=0; i < orielWindowCount; i++){
			var point = polar(sPar.center, startAngle + angleStep * i, sPar.rad + par.windowPosZ);
			var nextPoint = polar(sPar.center, startAngle + angleStep * (i + 1), sPar.rad + par.windowPosZ);
			addLine(shape, dxfPrimitivesArr, point, nextPoint, par.dxfBasePoint);
			lastPoint = nextPoint;
		}
		// Левый свес
		var p1 = polar(sPar.center, startAngle + angleStep * orielWindowCount + leftOffsetAngle, sPar.rad + par.windowPosZ);
		addLine(shape, dxfPrimitivesArr, lastPoint, p1, par.dxfBasePoint);
		lastPoint = p1;

		// Внутренняя часть
		var p1 = polar(sPar.center, startAngle + angleStep * orielWindowCount + leftOffsetAngle, sPar.rad - par.frontNose);
		addLine(shape, dxfPrimitivesArr, lastPoint, p1, par.dxfBasePoint);

		addArc2(shape, dxfPrimitivesArr, sPar.center, sPar.rad - par.frontNose, startAngle + angleStep * (orielWindowCount), startAngle, true, par.dxfBasePoint)
		
		var p2 = polar(sPar.center, startAngle - rightOffsetAngle, sPar.rad - par.frontNose);
		addLine(shape, dxfPrimitivesArr, p2, firstPoint, par.dxfBasePoint);
	}else{
		var outerPoints = []

		// Правый свес
		var point = polar(sPar.center, startAngle - rightOffsetAngle, sPar.rad + par.windowPosZ);
		outerPoints.push(point);
		// Точки у окна
		for(var i=0; i <= orielWindowCount; i++){
			var point = polar(sPar.center, startAngle + angleStep * i, sPar.rad + par.windowPosZ);
			outerPoints.push(point);
		}
		// Левый свес
		var point = polar(sPar.center, startAngle + angleStep * orielWindowCount + leftOffsetAngle, sPar.rad + par.windowPosZ);
		outerPoints.push(point);

		var innerPoints = []
		// Правый свес
		var point = polar(sPar.center, startAngle - rightOffsetAngle, sPar.rad - par.frontNose);
		innerPoints.push(point);
		// Внутренние точки
		for(var i=0; i <= orielWindowCount; i++){
			var point = polar(sPar.center, startAngle + angleStep * i, sPar.rad - par.frontNose)
			
			innerPoints.push(point);
		}
		// Левый свес
		var point = polar(sPar.center, startAngle + angleStep * orielWindowCount + leftOffsetAngle, sPar.rad - par.frontNose);
		innerPoints.push(point);

		sillPoints = [...outerPoints, ...innerPoints.reverse()]

		//создаем шейп
		var shapePar = {
			points: sillPoints,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: par.dxfBasePoint,
		}
		
		var shape = drawShapeByPoints2(shapePar).shape;
	}

	if (par.ventHoles != "нет") {
		var fullAngle = (angleStep * orielWindowCount);
		var arcLength = sPar.rad * fullAngle;
		console.log(arcLength)
		var holesAngleStart = startAngle + (fullAngle * (par.ventHolesOffsetRight / arcLength));
		var holesAngleEnd = (startAngle + angleStep * orielWindowCount) - (fullAngle * (par.ventHolesSideOffset / arcLength));
		var holeCount = Math.round(arcLength - par.ventHolesSideOffset - par.ventHolesOffsetRight) / par.ventHolesStep;
		var holeSize = 30;
		var holeAngleStep = (holesAngleEnd - holesAngleStart) / holeCount;
		console.log(sPar)
		for (var i = 0; i < holeCount; i++) {
			var holeCenter = polar(sPar.center, holesAngleStart + holeAngleStep * i, sPar.rad - par.frontNose + par.ventHolesFrontOffset);
			addRoundHole(shape, dxfPrimitivesArr, holeCenter, holeSize / 2, par.dxfBasePoint)
		}		
	}
	
	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var sillMesh = new THREE.Mesh(geom, params.materials.additionalObjectTimber || params.materials.timber);
	sillMesh.rotation.x = -Math.PI / 2;
	sillMesh.position.y = par.height;
	par.mesh.add(sillMesh);



	//сохраняем данные для спецификации
	var partName = 'sill';
	if(par.shapeType == "по чертежу") partName = 'sill_cnc';
	if(par.shapeType == "по шаблону (криволин.)") partName = 'sill_arc';

	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				area: 0,
				paintedArea: 0,
				name: 'Подоконник криволинейный',
				metalPaint: false,
				timberPaint: true,
				isModelData: true,
				division: "timber",
				purposes: [],
				workUnitName: "amt",
				group: "Объекты",
				//дополнительные данные
				lineTemplatesAmt: 0,
				curveTemplates: 0,
				breaking: 0,
				typeComments: {},
				size: {}
			}
		}
		
		var box3 = new THREE.Box3().setFromObject(sillMesh);
		var len = box3.max.x - box3.min.x;
		var width = box3.max.z - box3.min.z;
		var area = len * width / 1000000 * par.objectAmt
		
		name = '№' + par.objId + ' ' + par.shapeType + " " + Math.round(len) + "x" + Math.round(width) + "х" + Math.round(par.thk);
		
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1 * par.objectAmt;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1 * par.objectAmt;
		specObj[partName]["amt"] += 1 * par.objectAmt;
		specObj[partName]["sumLength"] += par.len / 1000 * par.objectAmt;
		specObj[partName]["area"] += area;
		specObj[partName]["paintedArea"] += par.len * par.width / 1000000 * par.objectAmt;
		
		specObj[partName].typeComments[name] = getSillSpecComment(par);
		specObj[partName].size[name] = {
			width: width,
			len: len
		};
		
		par.mesh.specParams = {specObj: specObj, amt: 1 * par.objectAmt, partName: partName, name: name}
		
		//дополнительные данные
		if(par.shapeType == "по шаблону") specObj[partName]["lineTemplatesAmt"] += 1 * par.objectAmt;
		if(par.shapeType == "по шаблону (криволин.)") specObj[partName]["curveTemplates"] += 1 * par.objectAmt;
		if(par.breaking == "есть") specObj[partName]["breaking"] += 1 * par.objectAmt;
	}
	
	par.mesh.specId = partName + name;

	//добавляем информацию в материалы с учетом обрезков
	var billetPar = calcBilletSize({
		len: len,
		width: width,
		thk: par.thk,
		type: "щит"
	});
	
	var panelName_40 = calcTimberParams(params.additionalObjectsTimberMaterial).treadsPanelName;	
	var panelName_20 = calcTimberParams(params.additionalObjectsTimberMaterial).riserPanelName;

	if(par.thk == 20) addMaterialNeed({id: panelName_20, amt: billetPar.area, itemType:  'sill'});
	if(par.thk == 40) addMaterialNeed({id: panelName_40, amt: billetPar.area, itemType:  'sill'});
	if(par.thk == 60) {
		addMaterialNeed({id: panelName_20, amt: billetPar.area, itemType:  'sill'});
		addMaterialNeed({id: panelName_40, amt: billetPar.area, itemType:  'sill'});
	}

	par.mesh.isInMaterials = true;
	
	return par
}

/** функция отрисовывает радиусный эркер тип 5
**/

function drawStepOriel(par){
	if(!par) par = {};
	initPar(par)
	
	var parts = Object.assign([], par.oriel_parts);

	parts.forEach(function(p){
		p.oriel_angle = (180 - p.oriel_angle) * -1;
	});

	var sillWidth = par.width;
  var holeWidth = 0.5;
	var frontSillPoints = [];
	var rearSillPoints = [];
	var basePoint = {x:0,y:0};
	var previousAngle = 0;

	frontSillPoints.push(basePoint);
	rearSillPoints.push(polar(basePoint, Math.PI / 2, -sillWidth));
  
  var holes = [];
	
	for (var i = 0; i < parts.length; i++) {
		var partAngle = THREE.Math.degToRad(parts[i].oriel_angle);
		var ang = previousAngle + partAngle;

		if (i < (parts.length - 1)) {
			var nextAngle = THREE.Math.degToRad(parts[i + 1].oriel_angle);
		}else{
			var nextAngle = 0;
		}

		var point = polar(basePoint, ang, -parts[i].oriel_len);
		frontSillPoints.push(point);
		
		var rearPointAngle = ang - Math.PI / 2 + nextAngle / 2;
		
		var rearPoint = polar(point, rearPointAngle, -(sillWidth / Math.cos(nextAngle / 2)));
		rearSillPoints.push(rearPoint);
		previousAngle = ang;
		basePoint = point;

		if (i < parts.length - 1) {
		  var pointsAng = angle(point, rearPoint);
		  var holeP1 = polar(polar(point, pointsAng + Math.PI / 2, holeWidth), pointsAng, -2);
		  var holeP2 = polar(polar(point, pointsAng - Math.PI / 2, holeWidth), pointsAng, -2);
		  var holeP3 = polar(polar(rearPoint, pointsAng - Math.PI / 2, holeWidth), pointsAng, 2);
		  var holeP4 = polar(polar(rearPoint, pointsAng + Math.PI / 2, holeWidth), pointsAng, 2);
		  
		  //создаем шейп
		  var shapePar = {
				points: [holeP1, holeP2, holeP3, holeP4],
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: par.dxfBasePoint,
		  }
		  
		  var hole = drawShapeByPoints2(shapePar).shape;
		  holes.push(hole);
		}
	};

	var orielWrapper = new THREE.Object3D();
	var curAng = 0;
	for(var i=0; i < (frontSillPoints.length - 1); i++){
		var point = frontSillPoints[i];
		var nextPoint = frontSillPoints[i + 1];
		var dist = distance(point, nextPoint);
		curAng += THREE.Math.degToRad(parts[i].oriel_angle);

		var p0 = {x: 0, y:0}; //точка в середине передней кромки
		var p1 = newPoint_xy(p0, -dist, 0);
		var p2 = newPoint_xy(p1, 0, par.height);
		var p3 = newPoint_xy(p2, dist, 0);
		var points = [p0, p1, p2, p3];

		//создаем шейп
		var shapePar = {
			points: points,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: par.dxfBasePoint,
		}
		
		var shape = drawShapeByPoints2(shapePar).shape;
		
		var extrudeOptions = {
			amount: par.wallThk,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};

		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var mesh = new THREE.Mesh(geom, params.materials.wall);
		mesh.setLayer("wall1");

		mesh.rotation.y = curAng;
		mesh.position.x = point.x;
		mesh.position.z = -point.y;

		orielWrapper.add(mesh);

		var windowPar = {
			width: dist,
			windowsCount: 1,
			height: par.windowHeight,
			mat: params.materials.whitePlastic,
		}
		var wndObj = new THREE.Object3D();
		var wnd = drawWindow(windowPar).mesh;

		wnd.position.x -= dist;

		wndObj.add(wnd);

		wndObj.rotation.y = curAng;
		wndObj.position.y = par.height;
		wndObj.position.x = point.x;
		wndObj.position.z = -point.y;

		orielWrapper.add(wndObj);
	}
	par.mesh.add(orielWrapper);

	//создаем шейп
	var shapePar = {
		points: [...frontSillPoints, ...rearSillPoints.reverse()],
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;
  shape.holes = holes;
	
	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var sillMesh = new THREE.Mesh(geom, params.materials.additionalObjectTimber || params.materials.timber);
	sillMesh.rotation.x = -Math.PI / 2;
	sillMesh.position.y = par.height;
	par.mesh.add(sillMesh);

  //сохраняем данные для спецификации
	var partName = 'sill';
	if(par.shapeType == "по чертежу") partName = 'sill_cnc';
	if(par.shapeType == "по шаблону (криволин.)") partName = 'sill_arc';

	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				area: 0,
				paintedArea: 0,
				name: 'Подоконник составной',
				metalPaint: false,
				timberPaint: true,
				isModelData: true,
				division: "timber",
				purposes: [],
				workUnitName: "amt",
				group: "Объекты",
				//дополнительные данные
				lineTemplatesAmt: 0,
				curveTemplates: 0,
				breaking: 0,
				typeComments: {},
				size: {}
			}
		}
		
		// var box3 = new THREE.Box3().setFromObject(sillMesh);
		// var len = box3.max.x - box3.min.x;
		// var width = box3.max.z - box3.min.z;
		var width = sillWidth
		var len = 0;
	var len_name = ""
		parts.forEach(function(p){
		  len += p.oriel_len;
	  if(len_name) len_name += "+"
	  len_name += Math.round(p.oriel_len)
		});
		var area = len * width / 1000000 * par.objectAmt
		
		name = '№' + par.objId + ' ' + par.shapeType + " " + Math.round(width) + "х" + Math.round(par.thk) + " L=" + len_name;
		
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1 * par.objectAmt;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1 * par.objectAmt;
		specObj[partName]["amt"] += 1 * par.objectAmt;
		specObj[partName]["sumLength"] += par.len / 1000 * par.objectAmt;
		specObj[partName]["area"] += area;
		specObj[partName]["paintedArea"] += par.len * par.width / 1000000 * par.objectAmt;
		
		specObj[partName].typeComments[name] = getSillSpecComment(par);
		specObj[partName].size[name] = {
			width: width,
			len: len
		};
		
		par.mesh.specParams = {specObj: specObj, amt: 1 * par.objectAmt, partName: partName, name: name}
		
		//дополнительные данные
		if(par.shapeType == "по шаблону") specObj[partName]["lineTemplatesAmt"] += 1 * par.objectAmt;
		if(par.shapeType == "по шаблону (криволин.)") specObj[partName]["curveTemplates"] += 1 * par.objectAmt;
		if(par.breaking == "есть") specObj[partName]["breaking"] += 1 * par.objectAmt;
	}
	
	par.mesh.specId = partName + name;


	//добавляем информацию в материалы с учетом обрезков
	parts.forEach(function(p){
		var billetPar = calcBilletSize({
			len: p.oriel_len,
			width: width,
			thk: par.thk,
			type: "щит"
		});

		var panelName_40 = calcTimberParams(params.additionalObjectsTimberMaterial).treadsPanelName;	
		var panelName_20 = calcTimberParams(params.additionalObjectsTimberMaterial).riserPanelName;

		if(par.thk == 20) addMaterialNeed({id: panelName_20, amt: billetPar.area, itemType:  'sill'});
		if(par.thk == 40) addMaterialNeed({id: panelName_40, amt: billetPar.area, itemType:  'sill'});
		if(par.thk == 60) {
			addMaterialNeed({id: panelName_20, amt: billetPar.area, itemType:  'sill'});
			addMaterialNeed({id: panelName_40, amt: billetPar.area, itemType:  'sill'});
		}
	 });
	
	return par
}


/** функция отрисовывает эркер **/

function drawOriel(par){
	if(!par) par = {};
	initPar(par)
	
	var p0 = {x: 0, y:0}; //точка в середине передней кромки
	var p1 = newPoint_xy(p0, -par.orielSizeA / 2, 0);
	var p2 = newPoint_xy(p1, 0, par.orielSizeC);
	var p4 = newPoint_xy(p0, par.orielSizeA / 2, 0);
	var p3 = newPoint_xy(p4, 0, par.orielSizeC);
	var points = [p1, p2, p3, p4];
	
	
	//корректируем внутренний контур
	if(par.orielType == 1){
		p2.x += (par.orielSizeA - par.orielSizeB) / 2
		p3.x -= (par.orielSizeA - par.orielSizeB) / 2
	}
	if(par.orielType == 2){
		//p2.x += (par.orielSizeA - par.orielSizeB) / 2
		p3.x -= par.orielSizeA - par.orielSizeB
	}
	
	if(par.orielType == 3){
		p2.x = 0
		p3.x = 0
	}
	
	//точки на внешнем контуре слева
	var p11 = newPoint_xy(p1, -500, 0);
	var p12 = newPoint_xy(p11, 0, par.wallThk);
	
	//точки на внешнем контуре справа
	var p41 = newPoint_xy(p4, 500, 0);
	var p42 = newPoint_xy(p41, 0, par.wallThk);
	
	var leftLine = parallel(p1, p2, par.wallThk)
	var topLine = parallel(p2, p3, par.wallThk)
	var rightLine = parallel(p3, p4, par.wallThk)
	
	var p13 = itercection(p12, newPoint_xy(p12, 10, 0), leftLine.p1, leftLine.p2)
	var p21 = itercection(topLine.p1, topLine.p2, leftLine.p1, leftLine.p2)
	var p31 = itercection(topLine.p1, topLine.p2, rightLine.p1, rightLine.p2)	
	var p43 = itercection(p42, newPoint_xy(p42, 10, 0), rightLine.p1, rightLine.p2)
	
	points = [p1, p2, p3, p4, p41, p42, p43, p31, p21, p13, p12, p11];
	
	if(par.orielType == 3) {
		p21 = itercection(leftLine.p1, leftLine.p2, rightLine.p1, rightLine.p2)
		p31 = copyPoint(p21)
		points = [p1, p2, p4, p41, p42, p43, p21, p13, p12, p11];
	}
	
	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;
	
	var extrudeOptions = {
				amount: par.height,
				bevelEnabled: false,
				curveSegments: 12,
				steps: 1
		};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.wall);
	mesh.setLayer("wall1");

	mesh.rotation.x = -Math.PI / 2;
	par.mesh.add(mesh);
	
	//простенок слева
	var p14 = polar(p13, angle(p13, p21), 50);
	var p15 = calcPerpParams(p1, p2, p14).point;
	points = [p1, p11, p12, p13, p14, p15];

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;
	
	var extrudeOptions = {
				amount: par.windowHeight,
				bevelEnabled: false,
				curveSegments: 12,
				steps: 1
		};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.wall);
	mesh.setLayer("wall1");

	mesh.rotation.x = -Math.PI / 2;
	mesh.position.y = par.height;
	par.mesh.add(mesh);
	
	//простенок справа
	var p44 = polar(p43, angle(p43, p31), -50);
	var p45 = calcPerpParams(p4, p3, p44).point;
	points = [p4, p41, p42, p43, p44, p45];

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;
	
	var extrudeOptions = {
				amount: par.windowHeight,
				bevelEnabled: false,
				curveSegments: 12,
				steps: 1
		};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.wall);
	mesh.setLayer("wall1");

	mesh.rotation.x = -Math.PI / 2;
	mesh.position.y = par.height;
	par.mesh.add(mesh);
	
	
	//окна
	

	var leftLine = parallel(p15, p2, par.windowPosZ)
	var topLine = parallel(p2, p3, par.windowPosZ)
	var rightLine = parallel(p3, p45, par.windowPosZ)
	
	var pw1 = leftLine.p1
	var pw2 = itercectionLines(leftLine, topLine)
	var pw3 = itercectionLines(rightLine, topLine)
	var pw4 = rightLine.p2
	
	if(par.orielType == 3) {
		pw2 = itercection(leftLine.p1, leftLine.p2, rightLine.p1, rightLine.p2)
		pw3 = copyPoint(pw2)
	}
	
	
	//левое
	var windowPar = {
		width: distance(pw1, pw2),
		windowsCount: par.windowSectAmt,
		height: par.windowHeight,
		mat: params.materials.whitePlastic,
	}
	var wnd = drawWindow(windowPar).mesh
	wnd.rotation.y = angle(pw1, pw2) + Math.PI
	wnd.position.y = par.height
	wnd.position.x = pw2.x
	wnd.position.z = -pw2.y
	par.mesh.add(wnd);
	
	//переднее
	if(par.orielType != 3){
		var windowPar = {
			width: distance(pw2, pw3),
			windowsCount: par.windowSectAmt,
			height: par.windowHeight,
			mat: params.materials.whitePlastic,
		}
		var wnd = drawWindow(windowPar).mesh
		wnd.position.y = par.height
		wnd.position.x = pw2.x
		wnd.position.z = -pw2.y - 40
		
		par.mesh.add(wnd);
	}
	//правое
	var windowPar = {
		width: distance(pw3, pw4),
		windowsCount: par.windowSectAmt,
		height: par.windowHeight,
		mat: params.materials.whitePlastic,
	}
	var wnd = drawWindow(windowPar).mesh
	wnd.rotation.y = angle(pw3, pw4) + Math.PI
	wnd.position.y = par.height
	wnd.position.x = pw4.x
	wnd.position.z = -pw4.y
	par.mesh.add(wnd);
	
	
	//подоконник
	var leftLine = parallel(p15, p2, -par.frontNose)
	var toptLine = parallel(p2, p3, -par.frontNose)
	var rightLine = parallel(p3, p45, -par.frontNose)
	
	var ps1 = leftLine.p1
	var ps2 = itercectionLines(leftLine, toptLine)
	var ps3 = itercectionLines(rightLine, toptLine)
	var ps4 = rightLine.p2
	
	if(par.orielType == 3 && par.sillGeom != "столешница") {
		ps2 = itercection(leftLine.p1, leftLine.p2, rightLine.p1, rightLine.p2)
		ps3 = copyPoint(ps2)
	}
	
	//линии торцов подоконника
	var leftSideLine = parallel(pw1, ps1, -par.leftNose)
	var rightSideLine = parallel(pw4, ps4, -par.rightNose)
	
	points = [leftSideLine.p1, pw2, pw3, rightSideLine.p1, rightSideLine.p2];
	
	//точки на внутренней линии
	if(par.sillGeom != "столешница"){
		points.push(ps3, ps2);		
	}
	points.push(leftSideLine.p2);	
	
	leftSideLine.p2.filletRad = par.cornerRadLeft
	rightSideLine.p2.filletRad = par.cornerRadRight
	
	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;
	
	var holeWidth = 0.5;
	
	if (par.orielType == 3) {
			var holeP1 = newPoint_xy(pw2, holeWidth / 2, 0);
			holeP1 = itercection(rightSideLine.p2, pw2, holeP1, newPoint_xy(holeP1, 0, -10))
			var holeP2 = newPoint_xy(pw2, -holeWidth / 2, 0);
			holeP2 = itercection(leftSideLine.p2, pw2, holeP2, newPoint_xy(holeP2, 0, -10))
			var holeP3 = newPoint_xy(ps2, -holeWidth / 2, 0);
			holeP3 = itercection(leftSideLine.p2, ps2, holeP3, newPoint_xy(holeP3, 0, 10))
			var holeP4 = newPoint_xy(ps2, holeWidth / 2, 0);
			holeP4 = itercection(rightSideLine.p2, ps2, holeP4, newPoint_xy(holeP4, 0, 10))
			
			//создаем шейп
			var shapePar = {
				points: [holeP1, holeP2, holeP3, ps2, holeP4],
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: par.dxfBasePoint,
			}
			
			var hole = drawShapeByPoints2(shapePar).shape;
			shape.holes.push(hole);
	}

	if (par.orielType == 1 || par.orielType == 2) {

		var holeP1 = newPoint_xy(pw2, holeWidth / 2, -1);
		var holeP2 = newPoint_xy(pw2, -holeWidth / 2, -1);
		var holeP3 = newPoint_xy(ps2, -holeWidth / 2, 1);
		var holeP4 = newPoint_xy(ps2, holeWidth / 2, 1);
		
		//создаем шейп
		var shapePar = {
			points: [holeP1, holeP2, holeP3, holeP4],
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: par.dxfBasePoint,
		}
		
		var hole = drawShapeByPoints2(shapePar).shape;
		shape.holes.push(hole);

		var holeP1 = newPoint_xy(pw3, holeWidth / 2, -1);
		var holeP2 = newPoint_xy(pw3, -holeWidth / 2, -1);
		var holeP3 = newPoint_xy(ps3, -holeWidth / 2, 1);
		var holeP4 = newPoint_xy(ps3, holeWidth / 2, 1);
		
		//создаем шейп
		var shapePar = {
			points: [holeP1, holeP2, holeP3, holeP4],
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: par.dxfBasePoint,
		}
		
		var hole = drawShapeByPoints2(shapePar).shape;
		shape.holes.push(hole);
}
	
	//Отверстия
	if(par.ventHoles != "нет"){
		
		var centerLines = []
		
		var holesLeftLine = parallel(p15, p2, -par.frontNose + par.ventHolesFrontOffset)
		var holesToptLine = parallel(p2, p3, -par.frontNose + par.ventHolesFrontOffset)
		var holesRightLine = parallel(p3, p45, -par.frontNose + par.ventHolesFrontOffset)
		
		var ph1 = holesLeftLine.p1
		var ph2 = itercectionLines(holesLeftLine, holesToptLine)
		var ph3 = itercectionLines(holesRightLine, holesToptLine)
		var ph4 = holesRightLine.p2
		
		if(par.orielType == 3) {
			ph2 = itercection(holesLeftLine.p1, holesLeftLine.p2, holesRightLine.p1, holesRightLine.p2)
			ph3 = copyPoint(ph2)
		}
	
		//учитывваем отступ
		if(par.ventHolesOffsetRight == undefined) par.ventHolesOffsetRight = par.ventHolesSideOffset
		ph1 = polar(ph1, angle(ph1, ph2), par.ventHolesSideOffset)
		ph4 = polar(ph4, angle(ph4, ph3), -par.ventHolesSideOffset)
		
		var centerLinePoints = [ph1, ph2, ph3, ph4]
		if(par.orielType == 3) centerLinePoints = [ph1, ph2, ph4]
		
		//перебираем все точки
		for(var i=0; i < centerLinePoints.length-1; i++){
			
			var dist = distance(centerLinePoints[i], centerLinePoints[i+1])
			//пропускаем точку если расстояние маленькое
			if(dist < par.ventHolesStep) continue;
			var holesArr = {
				len: dist,
				centers: [],
			}
			holesArr.amt = Math.ceil(holesArr.len / par.ventHolesStep) + 1;
			holesArr.step = holesArr.len / (holesArr.amt - 1)
			if(i < centerLinePoints.length-2) holesArr.amt -= 1; //Не отрисовываем последнее отверстие, чтобы они не задваивались
			
			for(var j=0; j<holesArr.amt; j++){
				var center = polar(centerLinePoints[i], angle(centerLinePoints[i], centerLinePoints[i+1]), holesArr.step * j)

				if(par.ventHoles == "круглые"){
					addRoundHole(shape, par.dxfArr, center, par.ventHolesSize / 2, par.dxfBasePoint)
				}
				if(par.ventHoles != "круглые"){
					var drawHoleFunc = addOvalHoleX
					if(par.ventHoles == "овальные поперек") drawHoleFunc = addOvalHoleY				
					drawHoleFunc(shape, par.dxfArr, center, par.ventHolesSize / 2, par.ventHolesLen, par.dxfBasePoint, true)
				}
			}
		}
	}
	
	
	var extrudeOptions = {
				amount: par.thk,
				bevelEnabled: false,
				curveSegments: 12,
				steps: 1
		};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.additionalObjectTimber || params.materials.timber);
	if(par.modifyKey) mesh.modifyKey = par.modifyKey;
	mesh.rotation.x = -Math.PI / 2;
	mesh.position.y = par.height;
	mesh.userData.setObjectDimensions = true;
	par.mesh.add(mesh);
	
	//длину подоконника считаем по внешнему периметру
	var len = distance(leftSideLine.p1, pw2) + distance(pw2, pw3) + distance(pw3, rightSideLine.p1)
	var width = par.width
	
	//для столешницы считаем размеры по описанному прямоугольнику
	if(par.sillGeom == "столешница"){
		var bbox = findBounds(shape.getPoints());
		len = bbox.x;
		width = bbox.y;
	}
	
	//сохраняем данные для спецификации
	var partName = 'sill';
	if(par.shapeType == "по чертежу") partName = 'sill_cnc';
	
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				area: 0,
				paintedArea: 0,
				name: 'Подоконник',
				metalPaint: false,
				timberPaint: true,
				isModelData: true,
				division: "timber",
				purposes: [],
				workUnitName: "amt",
				group: "Объекты",
				//дополнительные данные
				lineTemplatesAmt: 0,
				curveTemplates: 0,
				breaking: 0,
				typeComments: {},
				size: {},
			}
		}
		
		var area = len * width / 1000000 * par.objectAmt
		name = '№' + par.objId + ' ' + par.shapeType + " " + Math.round(len) + "х" + Math.round(width) + "х" + Math.round(par.thk);
		
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1 * par.objectAmt;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1 * par.objectAmt;
		specObj[partName]["amt"] += 1 * par.objectAmt;
		specObj[partName]["sumLength"] += len / 1000 * par.objectAmt;
		specObj[partName]["area"] += area;
		specObj[partName]["paintedArea"] += len * width / 1000000 * par.objectAmt;
		
		specObj[partName].typeComments[name] = getSillSpecComment(par);
		specObj[partName].size[name] = {
			width: width,
			len: len
		};
		
		par.mesh.specParams = {specObj: specObj, amt: 1 * par.objectAmt, partName: partName, name: name}
		
		//дополнительные данные
		if(par.shapeType == "по шаблону") specObj[partName]["lineTemplatesAmt"] += 1 * par.objectAmt;
		if(par.shapeType == "по шаблону (криволин.)") specObj[partName]["curveTemplates"] += 1 * par.objectAmt;
		if(par.breaking == "есть") specObj[partName]["breaking"] += 1 * par.objectAmt;
	}
	
	par.mesh.specId = partName + name;
	
	//добавляем информацию в материалы с учетом обрезков
	var billetPar = calcBilletSize({
		len: len,
		width: width,
		thk: par.thk,
		type: "щит"
	});
	
	var panelName_40 = calcTimberParams(params.additionalObjectsTimberMaterial).treadsPanelName;	
	var panelName_20 = calcTimberParams(params.additionalObjectsTimberMaterial).riserPanelName;

	if(par.thk == 20) addMaterialNeed({id: panelName_20, amt: billetPar.area, itemType:  'sill'});
	if(par.thk == 40) addMaterialNeed({id: panelName_40, amt: billetPar.area, itemType:  'sill'});
	if(par.thk == 60) {
		addMaterialNeed({id: panelName_20, amt: billetPar.area, itemType:  'sill'});
		addMaterialNeed({id: panelName_40, amt: billetPar.area, itemType:  'sill'});
	}

	par.mesh.isInMaterials = true;
	
	
	return par
}

/** функция возвращает описание подоконника для цеха **/

function getSillSpecComment(par){
	console.log(par);
	var comment = "";
	if (par.edgeGeomTop) comment += 'Фаска: ' +  par.edgeModel + " " + par.edgeGeomTop + ';\n';
	if (par.cornerRadRight) comment += 'Скругление справа ' + par.cornerRadRight + ';\n';
	if (par.cornerRadLeft) comment += 'Скругление слева ' + par.cornerRadLeft + ';\n';
	if (par.botPoleType && par.botPoleType != 'нет') comment += 'Доклейка ' + par.botPoleType + ' ' + Math.round(par.botPoleWidth)  + "х" + Math.round(par.botPoleThk) + '; ';
	if (par.slabModel) comment += 'Модель слэба: ' + par.slabModel + ';\n';
	if (par.resinVol > 0 && par.tabletopType.indexOf("слэб") != -1) {
		comment += 'Объем смолы: ' + par.resinVol + ';\n';
	}
	return comment;
}