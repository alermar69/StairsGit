
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
	
	//откосы
	if(par.wallSideBevel > 0 && par.geom != "подоконный блок"){
		var pt1 = {x: 0, y:0};
		var pt2 = newPoint_xy(pt1, 0, par.windowPosZ);
		var pt3 = newPoint_xy(pt1,  par.wallSideBevel, par.windowPosZ);

		var points = [pt1, pt2, pt3];
		
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
		
		if(par.geom != "балконное окно" || par.geomSide == "левая") par.mesh.add(bevel);
		
		
		var bevel = new THREE.Mesh(geom, params.materials.wall);
		bevel.rotation.x = Math.PI / 2
		bevel.rotation.z = Math.PI
		
		bevel.position.x = par.windowWidth / 2
		bevel.position.y = par.height + par.windowHeight
		bevel.position.z = par.wallThk
		
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
	
	
	var points = [p1, p2, p3, p4];
	
	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;

	//Отверстия
	if(par.ventHoles != "нет"){
		var holesArr = {
			len: par.windowWidth - par.ventHolesSideOffset * 2,
			centers: [],
		}
		holesArr.amt = Math.ceil(holesArr.len / par.ventHolesStep) + 1;
		holesArr.step = holesArr.len / (holesArr.amt - 1)

		for(var i=0; i<holesArr.amt; i++){
			var center = newPoint_xy(p0, -holesArr.len / 2 + holesArr.step * i, par.ventHolesFrontOffset)

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
        amount: par.sillThk,
        bevelEnabled: false,
        curveSegments: 12,
        steps: 1
		};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.additionalObjectTimber || params.materials.timber);
	if(par.modifyKey) mesh.modifyKey = par.modifyKey;
	mesh.rotation.x = -Math.PI / 2;
	par.mesh.add(mesh);
	
	//сохраняем данные для спецификации
	var partName = 'sill';
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				area: 0,
				name: 'Подоконник',
				metalPaint: false,
				timberPaint: true,
				isModelData: true,
				division: "timber",
				purposes: [],
				workUnitName: "amt",
				group: "treads",
				//дополнительные данные
				lineTemplatesAmt: 0,
				curveTemplates: 0,
				breaking: 0,
			}
		}
		
		name = par.shapeType + " " + Math.round(par.len) + "х" + Math.round(par.width);
		
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1 * par.objectAmt;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1 * par.objectAmt;
		specObj[partName]["amt"] += 1 * par.objectAmt;
		specObj[partName]["sumLength"] += par.len / 1000 * par.objectAmt;
		specObj[partName]["area"] += par.len * par.width / 1000000 * par.objectAmt;
		par.mesh.specParams = {specObj: specObj, amt: 1 * par.objectAmt, partName: partName, name: name}
		
		//дополнительные данные
		if(par.makingTemplates == "прямолинейные") specObj[partName]["lineTemplatesAmt"] += 1 * par.objectAmt;
		if(par.makingTemplates == "криволинейные") specObj[partName]["curveTemplates"] += 1 * par.objectAmt;
		if(par.breaking == "есть") specObj[partName]["breaking"] += 1 * par.objectAmt;
	}
	
	par.mesh.specId = partName + name;
		
	
	return par
}

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
	if(par.sillGeom == "столешница"){
		toptLine = parallel(pw2, pw3, -par.countertopDepth)
		if(par.orielType == 3){
			toptLine = parallel(newPoint_xy(pw2, -10, 0), newPoint_xy(pw3, 10, 0), -par.countertopDepth)
		}
		
	}
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
	
	points = [leftSideLine.p1, pw2, pw3, rightSideLine.p1, rightSideLine.p2, ps3, ps2, leftSideLine.p2];
	
	leftSideLine.p2.filletRad = par.cornerRadLeft
	rightSideLine.p2.filletRad = par.cornerRadRight
	
	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;
	
	var extrudeOptions = {
        amount: par.sillThk,
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
	par.mesh.add(mesh);
	
	
	
	return par
}