/**Функция отрисовывает прогон с термошайбами и метизами
	@param len
*/
function drawPurlin(par){
	
	if(!par) par = {};
	initPar(par)
	
	var purlinSectAmt = Math.ceil(par.len / 4100);

	var polePar = {
		poleProfileY: partPar.purlin.profSize.x,
		poleProfileZ: partPar.purlin.profSize.y,
		length: par.len / purlinSectAmt,
		material: params.materials.metal,
		partName: 'purlinProf'
	};
	
	//переворачиваем прогон для плоской кровли
	if(params.roofType == "Плоская") {
		polePar.poleProfileY = partPar.purlin.profSize.y
		polePar.poleProfileZ = partPar.purlin.profSize.x 
	}
	
	for(var i=0; i<purlinSectAmt; i++){
		var purlin = drawPole3D_4(polePar).mesh;
		purlin.position.x = polePar.length * i;
		purlin.setLayer('purlins');
		par.mesh.add(purlin);
		
		if(i>0){
			var connector = drawPurlinConnector().mesh;
			connector.position.x = purlin.position.x;
			connector.setLayer('purlins');
			par.mesh.add(connector);
		}
	}

//термошайбы и саморезы на прогонах

	var screwsAmt = Math.round(par.len / 450);
	var step = par.len / screwsAmt;
	for (var i = 0; i < screwsAmt; i++) {
		//позиция крепежа
		var pos = {
			x: step / 2 + step * i,
			y: partPar.purlin.profSize.x / 2,
			z: partPar.purlin.profSize.y + params.roofThk,
			rotX: Math.PI / 2,
		}
		//переворачиваем прогон для плоской кровли
		if(params.roofType == "Плоская") {
			pos.rotX = 0;
			pos.z = partPar.purlin.profSize.x / 2;
			pos.y = partPar.purlin.profSize.y + params.roofThk;
		}
		
		if(params.roofMat.indexOf("поликарбонат") != -1){
			var shim = drawTermoShim();			
			shim.rotation.x = pos.rotX
			shim.position.x = pos.x
			shim.position.y = pos.y
			shim.position.z = pos.z			
			par.mesh.add(shim);
		}
		
		if(params.roofMat != "нет"){
			var screwPar = {
				id: "roofingScrew_5x32",
				description: "Крепление покрытия к профилям",
				group: "Кровля"
			}
				
			var screw = drawScrew(screwPar).mesh;			
			screw.rotation.x = pos.rotX - Math.PI;
			screw.position.x = pos.x
			screw.position.y = pos.y
			screw.position.z = pos.z
			par.mesh.add(screw);
		}
	};

//фланцы и заглушки
	
	if(params.beamModel != "проф. труба") {
		//фланцы для крепления к фермам
		var flanPar = {
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, params.sectLen + 1000, -500)
		}
		for(var i=0; i<=params.sectAmt; i++){
			var flan = drawPurlinFlan(flanPar).mesh
			if(params.roofType == "Плоская") flan.rotation.x = -Math.PI / 2;
			flan.position.x = params.frontOffset + (partPar.column.profSize.y - 40) / 2 + (params.sectLen - partPar.column.profSize.y / params.sectAmt) * i
			flan.setLayer('carcas');
			par.mesh.add(flan);
			flanPar.dxfBasePoint = false;
		}
		
		//заглушки
		var plugPar = {
			width: partPar.purlin.profSize.x,
			height: partPar.purlin.profSize.y,
		}
		
		if(params.roofType == "Плоская") {
			plugPar = {
				width: partPar.purlin.profSize.y,
				height: partPar.purlin.profSize.x,
			}
		}
			
		var startPlug = drawPlug(plugPar)
		startPlug.rotation.z = Math.PI / 2;
		startPlug.position.y = plugPar.width / 2
		startPlug.position.z = plugPar.height / 2
		startPlug.position.x = -1;
		startPlug.setLayer('metis');
		par.mesh.add(startPlug);
		
		var endPlug = drawPlug(plugPar)
		endPlug.rotation.z = startPlug.rotation.z
		endPlug.position.y = startPlug.position.y
		endPlug.position.z = startPlug.position.z
		endPlug.position.x = par.len + 1;
		endPlug.setLayer('metis');
		par.mesh.add(endPlug);
	}
	

	return par;
}

/** функция отрисовывает колонну навеса
	@param len
	@param isTop
	верхний фланец колонны отрисовывается вместе с поперечной фермой
*/
function drawCarportColumn(par){
	if(!par) par = {};
	initPar(par)
	
	
	var columnPar = {
		poleProfileY: partPar.column.profSize.x,
		poleProfileZ: partPar.column.profSize.y,
		length: par.len,
		poleAngle: Math.PI / 2,
		material: params.materials.metal,
		type: 'rect',
	};
	
	var pole = drawPole3D_4(columnPar).mesh;
	pole.position.z = -partPar.column.profSize.x / 2
	par.mesh.add(pole);

	if(params.calcType != "veranda"){	
		var base = drawCarportColumnBase().mesh;
		base.position.x = -partPar.column.profSize.x / 2
		if(params.carportType.indexOf("консольный") != -1) base.position.z -= partPar.column.profSize.y / 2;
		par.mesh.add(base);
	}
	
	//сохраняем данные для спецификации
	var partName = 'carportColumn';
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				name: 'Колонна навеса',
				metalPaint: true,
				timberPaint: false,
				isModelData: true,
				division: "metal",
				purposes: [],
				workUnitName: "amt",
				group: "carcas",
			}
		}
		
		name = params.columnProf + " L=" + Math.round(par.len);
		if(par.isTop) name += " высокая"
		
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["sumLength"] += par.len / 1000;
		par.mesh.specParams = {specObj: specObj, amt: 1, partName: partName, name: name}
	}
	
	par.mesh.specId = partName + name;
		
	return par;

}

/** функция отрисовывает основание колонны навеса

*/
function drawCarportColumnBase(par){
	if(!par) par = {};
	initPar(par)
	
	var offset = 50;
	var holeOffset = offset / 2;
	var flanSize = partPar.column.profSize.x + offset * 2

//горизонтальный фланец	
	var flanPar = {
		height: flanSize,
		width: flanSize,
		thk: 8,
		cornerRad: 20,
		holeRad: 6.5,
		noBolts: true,
		dxfPrimitivesArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		roundHoleCenters: [
			{x: holeOffset, y: holeOffset},
			{x: flanSize - holeOffset, y: holeOffset},
			{x: flanSize - holeOffset, y: flanSize - holeOffset},
			{x: holeOffset, y: flanSize - holeOffset},
		],
	}
	
	var startFlan = drawRectFlan2(flanPar).mesh;
	startFlan.rotation.x = -Math.PI / 2;
	startFlan.position.x = -flanPar.width / 2;
	startFlan.position.z = flanPar.width / 2;
	par.mesh.add(startFlan);
	
	//вертикальный фланец
	var p0 = {x:0,y:0};
	var p1 = newPoint_xy(p0, flanSize/2 - 10, 0)
	var p2 = newPoint_xy(p1, 0, 20)
	var p3 = newPoint_xy(p0, partPar.column.profSize.x / 2 - 2, 100)
	
	var points = [p1, p2, p3]
	for(var i=2; i>=0; i--){
		var point = copyPoint(points[i])
		point.x *= -1;
		points.push(point);
	}
	
	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;
	
	var holes = [
		{x:0, y: 30},
		{x:0, y: 70},
	]
	holes.forEach(function(center){
		addRoundHole(shape, par.dxfArr, center, 12 / 2 + 1.5, par.dxfBasePoint); 
	})
	
	var extrudeOptions = {
		amount: 4,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

	var flan = new THREE.Mesh(geom, params.materials.metal);
	flan.position.y = 8
	flan.position.z = partPar.column.profSize.y / 2
	par.mesh.add(flan);

	var flan2 = new THREE.Mesh(geom, params.materials.metal);
	flan2.position.x = flan.position.x
	flan2.position.y = flan.position.y
	flan2.position.z = -partPar.column.profSize.y / 2 - 4
	par.mesh.add(flan2);
	
	//метизы
	
	
	var studPar = {
		diam: 10,
		len: partPar.column.profSize.y + 4 * 2 + 30,
		dopParams: {},
		material: params.materials.inox,
	}
	
	var posYarr = [30+8, 70+8];
	
	posYarr.forEach(function(posY){
		var stud1 = drawStudF(studPar)
		stud1.rotation.x = Math.PI / 2;
		stud1.position.y = posY;
		par.mesh.add(stud1)
		
		var shim = drawShim({diam: 10}).mesh
		shim.rotation.x = 0
		shim.position.y = posY;
		shim.position.z = partPar.column.profSize.y / 2 + 4;
		par.mesh.add(shim)
		
		var shim = drawShim({diam: 10}).mesh
		shim.rotation.x = 0
		shim.position.y = posY;
		shim.position.z = -partPar.column.profSize.y / 2 - 4 - 2;
		par.mesh.add(shim)
		
		var nut = drawNut({diam: 10}).mesh
		nut.rotation.x = Math.PI / 2
		nut.position.y = posY;
		nut.position.z = partPar.column.profSize.y / 2 + 4;
		par.mesh.add(nut)
		
		var nut = drawNut({diam: 10}).mesh
		nut.rotation.x = Math.PI / 2
		nut.position.y = posY;
		nut.position.z = -partPar.column.profSize.y / 2 - 4 - 10;
		par.mesh.add(nut)
	})
	
	//винтовая свая
	if(params.fixType == "винтовые сваи"){
		var pile = drawVintPile().mesh;
	//	pile.rotation.x = Math.PI / 2;
		par.mesh.add(pile)
	}
	

	
	//сохраняем данные для спецификации
	var partName = 'carportColumnBase';
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: 'Основание колонны навеса',
				metalPaint: true,
				timberPaint: false,
				isModelData: true,
				division: "stock_2",
				purposes: [],
				workUnitName: "amt",
				group: "carcas",
			}
		}
		
		name = params.columnProf;
		
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		par.mesh.specParams = {specObj: specObj, amt: 1, partName: partName, name: name}
	}
	
	par.mesh.specId = partName + name;
	
	return par;
	
}


/** функция отрисовывает термошайбу для крепления поликарбоната
*/
function drawTermoShim(){
	var termoShimDiam = 38;
	var shimHeight = 4;
	var material = new THREE.MeshLambertMaterial({ color: "#808080" });
	var geometry = new THREE.CylinderGeometry(termoShimDiam / 3, termoShimDiam / 2, shimHeight, 10, 1, false);
	var shim = new THREE.Mesh(geometry, material);
	shim.position.y += shimHeight;

	//сохраняем данные для спецификации
	var partName = 'termoShim';
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: 'Термошайба',
				metalPaint: false,
				timberPaint: false,
				isModelData: true,
				division: "stock_1",
				purposes: [],
				workUnitName: "amt",
				group: "Метизы",
			}
		}

		name = 0;
		
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		shim.specParams = {specObj: specObj, amt: 1, partName: partName, name: name}
	}

	shim.setLayer("metis");
	shim.specId = partName;
	
	return shim;
}

/**Функция отрисовывает и добавляет в спецификацию соединительный профиль поликорбаната
*/
function drawPolyConnectionProfile(par){
	var profile = new THREE.Object3D();
	var profileWidth = 40;
	if (par.angle) {
		var arcPanelPar = {
			rad: par.rad + par.thk / 2 - 1,
			height: profileWidth,
			thk: 1,
			angle: par.angle,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
			material: params.materials.metal,
			dxfPrimitivesArr: par.dxfPrimitivesArr
		}		
		var topPart = drawArcPanel(arcPanelPar).mesh;
		topPart.position.z = -profileWidth / 2;
		profile.add(topPart);
	
		var arcPanelPar = {
			rad: par.rad - par.thk / 2 + 1,
			height: profileWidth,
			thk: 1,
			angle: par.angle,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
			material: params.materials.metal,
			dxfPrimitivesArr: par.dxfPrimitivesArr
		}		
		var botPart = drawArcPanel(arcPanelPar).mesh;
		botPart.position.z = -profileWidth / 2;
		profile.add(botPart);
	
		var arcPanelPar = {
			rad: par.rad,
			height: 1,
			thk: par.thk - 2,
			angle: par.angle,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
			material: params.materials.metal,
			dxfPrimitivesArr: par.dxfPrimitivesArr
		}
		var midPart = drawArcPanel(arcPanelPar).mesh;
		profile.add(midPart);
	}
	else{		
		var polePar = {
			poleProfileY: 2,
			poleProfileZ: profileWidth,
			dxfBasePoint: par.dxfBasePoint,
			length: par.length,
			poleAngle: 0,
			material: params.materials.metal,
			dxfArr: par.dxfPrimitivesArr,
			type: 'rect'
		};
	
		var prof = drawPole3D_4(polePar).mesh;
		profile.add(prof);
	}

	var partName = 'polyConnectionProfile';
	var profLength = (par.rad * Math.PI * THREE.Math.radToDeg(par.angle)) / 180;
	if (!par.angle) profLength = par.length;
		
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				name: "Соединительный профиль для поликарбоната",
				metalPaint: false,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "carcas",
			}
		}
		var name = Math.round(profLength);
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["sumLength"] += profLength / 1000;
		profile.specParams = {specObj: specObj, amt: 1, sumLength: profLength / 1000, partName: partName, name: name}
	}
	profile.specId = partName + name;
	
	return profile;
}

/** функция отрисовывает фланец колонны навеса
centerLines
*/

function drawColumnFlan(par){
	par = calcColumnFlanPar(par);
	par.turnFactor = par.turnFactor || 1;// Для разворота болтов
	par.mesh = new THREE.Object3D();
	var colGap = 1; //зазор до колонны с одной стороны, чтобы не подтачивать после плазмы

	var p0 = {x:0,y:0};
	
	var p1 = newPoint_xy(p0, -partPar.column.profSize.y / 2 - colGap, 0);
	var p2 = newPoint_xy(p1, 0, -50);
	var p3 = itercection(par.lines.left.p1, par.lines.left.p2, p2, newPoint_xy(p2, 1, 0))
	var p4 = itercectionLines(par.lines.left, par.lines.top)
	if(!par.isTop) {
		p4 = itercectionLines(par.lines.left, par.lines.top_ang)
		var p41 = itercectionLines(par.lines.top, par.lines.top_ang);	
	}
	var p5 = itercectionLines(par.lines.right, par.lines.top)

	var p6 = newPoint_xy(p5, 0, -p5.y);

	var p9 = newPoint_xy(p0, partPar.column.profSize.y / 2 + colGap, 0);
	var p8 = newPoint_xy(p9, 0, -150);
	var p7 = newPoint_xy(p8, 30, 0);
	
	p3.filletRad = p4.filletRad = p7.filletRad = 20;
	
	if(par.isTop) {
		p5.filletRad = 20;
	}
	else{
		p41.filletRad = 20;
	}
	

	//создаем шейп
	var shapePar = {
		points: [p0, p1, p2, p3, p4, p41, p5, p6, p7, p8, p9],
		dxfArr: par.dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint
	}
	
	if(par.isTop){
		shapePar.points = [p0, par.points.p1, p4, p5, p6, p7, p8, p9];
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;

	par.holes.forEach(function(center){
		addRoundHole(shape, par.dxfPrimitivesArr, center, par.holeDiam / 2, par.dxfBasePoint); 
	})


	par.holes.forEach(function(center){
		var boltPar = {
			diam: 12,
			len: 40,
			headType: "шестигр.",
			headShim: true,
		}
		
		var bolt = drawBolt(boltPar).mesh;
		bolt.position.x = center.x;
		bolt.position.y = center.y;
		bolt.position.z = 0;
		bolt.rotation.x = -Math.PI / 2 * par.turnFactor;
		par.mesh.add(bolt);
	});


	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

	var flan = new THREE.Mesh(geom, params.materials.metal);
	flan.setLayer('flans');

	par.mesh.add(flan);
	return par;
}

/** функция отрисовывает фланец для крепления поперечной балки из профиля к продольной
centerLines
*/

function drawPoleBeamFlan(par){

	par.mesh = new THREE.Object3D();
	var colGap = 1; //зазор до колонны с одной стороны, чтобы не подтачивать после плазмы

	var p0 = {x:0,y:0};
	
	var p1 = newPoint_xy(p0, -partPar.column.profSize.y / 2, 0);
	var p2 = newPoint_xy(p1, 0, partPar.rafter.profSize.y);
	var p4 = newPoint_xy(p0, partPar.column.profSize.y / 2, 0);
	var p3 = itercection(p2, polar(p2, THREE.Math.degToRad(params.roofAng), 10), p4, newPoint_xy(p4, 0, 10))
	
	
	//создаем шейп
	var shapePar = {
		points: [p1, p2, p3, p4],
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;
	
	par.holes = [];

	par.holes.forEach(function(center){
		addRoundHole(shape, par.dxfPrimitivesArr, center, par.holeDiam / 2, par.dxfBasePoint); 
	})


	par.holes.forEach(function(center){
		var boltPar = {
			diam: 12,
			len: 40,
			headType: "шестигр.",
			headShim: true,
		}
		
		var bolt = drawBolt(boltPar).mesh;
		bolt.position.x = center.x;
		bolt.position.y = center.y;
		bolt.position.z = 0;
		bolt.rotation.x = -Math.PI / 2 * par.turnFactor;
		par.mesh.add(bolt);
	});


	var extrudeOptions = {
		amount: 8,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

	var flan = new THREE.Mesh(geom, params.materials.metal);
	flan.setLayer('flans');

	par.mesh.add(flan);
	return par;
}


/** функция отрисовывает соединительный фланец арочной фермы
*/

function drawArcTrussFlan(par){
	var flanMesh = new THREE.Object3D();
	if(!par.flanParams) return flanMesh;

	var h = par.flanParams.h;
	var a = par.flanParams.a;
	var b = par.flanParams.b;

	var p0 = {x:0,y:0};
	var p1 = newPoint_xy(p0, -a  / 2, 0);
	var p2 = newPoint_xy(p0, -b / 2, h);
	var p3 = newPoint_xy(p2, b, 0);
	var p4 = newPoint_xy(p0, a / 2, 0);



//вырез слева
var p12 = newPoint_xy(p1, 0, h/2)
var p11 = newPoint_xy(p12, 0, -par.flanParams.notchRad)
var p13 = newPoint_xy(p12, 0, par.flanParams.notchRad)
var p14 = newPoint_xy(p12, par.flanParams.notchRad, 0)

//вырез справа
var p42 = newPoint_xy(p4, 0, h/2)
var p41 = newPoint_xy(p42, 0, -par.flanParams.notchRad)
var p43 = newPoint_xy(p42, 0, par.flanParams.notchRad)
var p44 = newPoint_xy(p42, -par.flanParams.notchRad, 0)

p14.filletRad = p44.filletRad =  par.flanParams.notchRad

	//создаем шейп
	var shapePar = {
		points: [p1, p11, p14, p13, p2,p3, p43, p44, p41, p4],
		dxfArr: par.dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;

	var holes = [];
	par.flanParams.holes.forEach(function(hole){
		var hole = newPoint_xy(hole, 0, -10);// Смещаем на 10 тк фланец на 10 меньше высоты фермы
		hole.rad = 7;
		holes.push(hole);
	})

	// Вторая половина отверстий, тк они рассчитаны только для половины фермы
	par.flanParams.holes.forEach(function(hole){
		var hole = newPoint_xy(hole, 0, -10);// Смещаем на 10 тк фланец на 10 меньше высоты фермы
		hole.x *= -1
		hole.rad = 7;
		holes.push(hole);
	})
	

	var holesPar = {
		holeArr: holes,//[h1,h2,h3,h4,h5,h6,h7,h8],
		dxfBasePoint: par.dxfBasePoint,
		shape: shape,
		dxfPrimitivesArr: par.dxfPrimitivesArr
	}
	addHolesToShape(holesPar);

	holesPar.holeArr.forEach(function(hole){
		var boltPar = {
			diam: 12,
			len: 30,
			headType: "шестигр.",
			headShim: true,
		}

		var bolt = drawBolt(boltPar).mesh;
		bolt.position.x = hole.x;
		bolt.position.y = hole.y;
		bolt.position.z = 0;
		bolt.rotation.x = Math.PI / 2;
		flanMesh.add(bolt);
	});

	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

	var flan = new THREE.Mesh(geom, params.materials.metal);
	flan.setLayer('flans');
	
	var box3 = new THREE.Box3().setFromObject(flan);
	var s = ((box3.max.x - box3.min.x) / 1000) * ((box3.max.y - box3.min.y) / 1000);
	var partName = "arcTrussFlan";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				name: "Фланец соединения двух частей ферм",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "carcas",
			}
		}
		var name = 0;
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += s;
		flan.specParams = {specObj: specObj, amt: 1, area: s, partName: partName, name: name}
	}
	flan.specId = partName;
	flanMesh.add(flan);

	return flanMesh;
}

/** функция отрисовывает верхний фланец купола
*/

function drawDomeTopFlan(par){

	if(!par.dxfArr) par.dxfArr = [];
	if(!par.dxfBasePoint) par.dxfBasePoint = {x:0, y:0};
	
	par.thk = 8;
	var centerPoint = {x:0, y:0}
	par.shape = new THREE.Shape();
	par.mesh = new THREE.Object3D();

	addCircle(par.shape, par.dxfArr, centerPoint, par.diam / 2, par.dxfBasePoint)
		
	
	var extrudeOptions = {
		amount: par.thk, 
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	
	var geom = new THREE.ExtrudeGeometry(par.shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var flan = new THREE.Mesh(geom, params.materials.metal);
	par.mesh.add(flan);
	flan.setLayer('carcas');
	
	if(par.bearingHeight){
		var rad = 70
		var geom = new THREE.CylinderBufferGeometry(rad, rad, par.bearingHeight - par.thk, 20);
	
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var bearing = new THREE.Mesh(geom, params.materials.metal);
		bearing.rotation.x = Math.PI / 2;
		bearing.position.z = -par.bearingHeight / 2 + par.thk
		
		par.mesh.add(bearing);
		bearing.setLayer('carcas');
	}
	
	var partName = "trussFlan";
	var area = par.diam * par.diam / 1000000;
	
	if (typeof specObj != 'undefined') {
		name = par.diam + "х" + par.thk;
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				name: "Фланец верхний",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "carcas",
			}
		}
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		par.mesh.specParams = {specObj: specObj, amt: 1, area: area, partName: partName, name: name}
	}
	par.mesh.specId = partName + name;
	
	return par;
}

/** функция отрисовывает ухо для крепления прогона, которое приваривается к верхнему поясу фермы
*/

function drawPurlinFlan(par){

	if(!par) par = {};
	initPar(par)
	
	par.flanWidth = 40;

	var flanPar = {
		height: partPar.purlin.profSize.y,
		width: 40, //partPar.purlin.profSize.y,
		thk: 2,
		//cornerRad: 20,
		holeRad: 4,
		noBolts: true,
		dxfPrimitivesArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		roundHoleCenters: [
			{x: 10, y: 10},
			{x: 30, y: partPar.purlin.profSize.y - 10},
		],
	}

	var startFlan = drawRectFlan2(flanPar).mesh;
	startFlan.rotation.x = Math.PI / 2;
//	startFlan.position.z = flanPar.width / 2;
	par.mesh.add(startFlan);
	
	//саморезы крепления прогонов
	var screwPar = {
		id: "roofingScrew_5x19",
		description: "Крепление прогонов к фермам",
		group: "Кровля",
	}
		
	var screw = drawScrew(screwPar).mesh;	
	screw.position.x = 10
	screw.position.y = 5;
	screw.position.z = 10;
	par.mesh.add(screw);
	
	var screwPar = {
		id: "roofingScrew_5x19",
		description: "Крепление прогонов к фермам",
		group: "Кровля",
	}
	var screw2 = drawScrew(screwPar).mesh;
	screw2.position.x = 30
	screw2.position.y = 5;
	screw2.position.z = partPar.purlin.profSize.y - 10;
	par.mesh.add(screw2);
	
	return par;
}

/** функция отрисовывает сектор сферы из поликарбоната
*/

function drawSphereSector(par){
	
	const radius = par.rad;  // ui: radius
	const widthSegments = 1;  // ui: widthSegments
	const heightSegments = 20;  // ui: heightSegments
	const phiStart = 0;  // ui: phiStart
	const phiLength = par.angleWidth;  // ui: phiLength
	const thetaStart = par.topCutAngle || 0;  // ui: thetaStart
	const thetaLength = Math.PI / 2 + par.extraAngle;  // ui: thetaLength

	var geom = new THREE.SphereBufferGeometry(
		radius,
		widthSegments, heightSegments,
		phiStart, phiLength,
		thetaStart, thetaLength
		);

	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	par.mesh = new THREE.Mesh(geom, par.material);
	par.mesh.setLayer('roof');
	
	var partName = "polySheet";
	var len = Math.round(par.rad * thetaLength);
	var width = Math.round(par.rad * par.angleWidth);
	var area = len * width / 1000000;
	
	if (typeof specObj != 'undefined') {
		name = len + "х" + width;
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				name: "Поликарбонат " + par.thk + " " + params.roofPlastColor,
				metalPaint: false,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "carcas",
			}
		}
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		par.mesh.specParams = {specObj: specObj, amt: 1, area: area, partName: partName, name: name}
	}
	par.mesh.specId = partName + name;
	
	return par;
}

/** функция отрисовывает сектор кровли многоугольного павильона из поликарбоната
	@param ang // угол между гранями листа, примыкающими к шпилю
	@param dxfArr: dxfPrimitivesArr,
	@param dxfBasePoint: {x: 2000, y:0},
	@param edgeLen //длина ребра
	@param isHalf //половина сектора
*/
function drawPolygonRoofSector(par){
	if(par.ang){
		par.angLeft = par.angRight = par.ang / 2
	}
	
	var p1 = {x:0, y:0}
	var p2 = polar(p1, -Math.PI / 2 - par.ang / 2, par.edgeLen)
	var p3 = polar(p1, -Math.PI / 2 + par.ang / 2, par.edgeLen)
	
	if(par.isHalf) p3.x = 0;
		
	//создаем шейп
	var shapePar = {
		points: [p1,p2,p3],
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;
	
	var extrudeOptions = {
		amount: params.roofThk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

	par.mesh = new THREE.Mesh(geom, params.materials.plastic_roof);
	
	par.mesh.setLayer('roof');
	
	var partName = "polySheet";
	var len = Math.round(p1.y - p2.y);
	var width = Math.round(p3.x - p2.x);
	var area = len * width / 1000000;
	
	if (typeof specObj != 'undefined') {
		name = len + "х" + width;
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				name: "Поликарбонат " + par.thk + " " + params.roofColor,
				metalPaint: false,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "carcas",
			}
		}
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		par.mesh.specParams = {specObj: specObj, amt: 1, area: area, partName: partName, name: name}
	}
	par.mesh.specId = partName + name;
	
	
	return par;
}

/** функция отрисовывает сектор кровли многоугольного павильона из поликарбоната
	@param ang // угол между гранями листа, примыкающими к шпилю
	@param dxfArr: dxfPrimitivesArr,
	@param dxfBasePoint: {x: 2000, y:0},
	@param edgeLen //длина ребра
	@param isHalf //половина сектора
*/
function drawPyramidalRoof(par) {
	par.mesh = new THREE.Object3D();

	var extrudeOptions = {
		amount: params.roofThk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var p0 = { x: 0, y: 0 }

	var sideOffset = params.sideOffset + partPar.rafter.profSize.y * Math.sin(partPar.main.roofAng)

	var pt1 = newPoint_xy(p0, -par.lengthPavilion / 2 - sideOffset, -params.width / 2 - sideOffset) //точка угла секции
	var pt2 = newPoint_xy(p0, -par.ridgeLen / 2, 0) // точка края конька

	var pt = polar(pt2, calcAngleX1(pt1, pt2), -distance(pt1, pt2) / Math.cos(partPar.main.roofAng))


	/*передний и задний лист кровли*/
	{
		var p1 = newPoint_xy(pt1, 0, pt.y - pt1.y)
		var p2 = copyPoint(pt2)
		var p3 = copyPoint(p2)
		var p4 = copyPoint(p1)
		p3.x *= -1;
		p4.x *= -1;

		//создаем шейп
		var shapePar = {
			points: [p1, p2, p3, p4],
			dxfArr: par.dxfArr,
			dxfBasePoint: par.dxfBasePoint
		}

		var shape = drawShapeByPoints2(shapePar).shape;

		for (var k = 0; k < 2; k++) {
			var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
			geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

			var sheet = new THREE.Mesh(geom, params.materials.plastic_roof);

			sheet.rotation.x = -Math.PI / 2;
			sheet.rotation.z = -Math.PI / 2;
			sheet.rotation.y = - partPar.main.roofAng;
			if (k == 1) {
				sheet.rotation.z = Math.PI / 2;
				sheet.rotation.y = partPar.main.roofAng;
			}

			sheet.position.y = partPar.rafter.profSize.x / 2 * Math.tan(partPar.main.roofAng);
			sheet.setLayer('roof');

			par.mesh.add(sheet)

			var partName = "polySheet";
			var len = Math.round(p4.x - p1.x);
			var width = Math.round(p2.y - p1.y);
			var area = len * width / 1000000;

			if (typeof specObj != 'undefined') {
				name = len + "х" + width;
				if (!specObj[partName]) {
					specObj[partName] = {
						types: {},
						amt: 0,
						area: 0,
						name: "Поликарбонат " + par.thk + " " + params.roofColor,
						metalPaint: false,
						timberPaint: false,
						division: "metal",
						workUnitName: "amt",
						group: "carcas",
					}
				}
				if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
				if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
				specObj[partName]["amt"] += 1;
				specObj[partName]["area"] += area;
				par.mesh.specParams = { specObj: specObj, amt: 1, area: area, partName: partName, name: name }
			}
			par.mesh.specId = partName + name;
		}
	}

	/*боковые листы кровли*/
	{
		var p1 = newPoint_xy(pt1, pt.x - pt1.x, 0)
		var p2 = copyPoint(pt2)
		var p3 = copyPoint(p1)
		p3.y *= -1;

		var points = [p1, p2, p3]
		points = moovePoints(points, {x: -pt2.x, y: -pt2.y})

		//создаем шейп
		var shapePar = {
			points: points,
			dxfArr: par.dxfArr,
			dxfBasePoint: par.dxfBasePoint
		}

		var shape = drawShapeByPoints2(shapePar).shape;

		for (var k = 0; k < 2; k++) {
			var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
			geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

			var sheet = new THREE.Mesh(geom, params.materials.plastic_roof);

			sheet.rotation.x = -Math.PI / 2 - partPar.main.roofAng;
			sheet.rotation.z = -Math.PI / 2;
			sheet.position.z = pt2.x;
			if (k == 1) {
				sheet.rotation.x = -Math.PI / 2 + partPar.main.roofAng;
				sheet.rotation.z = Math.PI / 2;
				sheet.position.z = -pt2.x;
			}

			sheet.position.y = partPar.rafter.profSize.x / 2 * Math.tan(partPar.main.roofAng);
			sheet.setLayer('roof');

			par.mesh.add(sheet)

			var partName = "polySheet";
			var len = Math.round(p4.x - p1.x);
			var width = Math.round(p2.y - p1.y);
			var area = len * width / 1000000;

			if (typeof specObj != 'undefined') {
				name = len + "х" + width;
				if (!specObj[partName]) {
					specObj[partName] = {
						types: {},
						amt: 0,
						area: 0,
						name: "Поликарбонат " + par.thk + " " + params.roofColor,
						metalPaint: false,
						timberPaint: false,
						division: "metal",
						workUnitName: "amt",
						group: "carcas",
					}
				}
				if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
				if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
				specObj[partName]["amt"] += 1;
				specObj[partName]["area"] += area;
				par.mesh.specParams = { specObj: specObj, amt: 1, area: area, partName: partName, name: name }
			}
			par.mesh.specId = partName + name;
		}
	}


	return par;
}

/** функция отрисовывает рамку из профиля для каркаса кровли многоугольного павильона из поликарбоната
	@param ang // угол между гранями листа, примыкающими к шпилю		
	@param dxfArr: dxfPrimitivesArr,
	@param dxfBasePoint: {x: 2000, y:0},
	@param edgeLen //длина ребра
	@param sideOffset - отступ от края
	@param topOffset - отступ от вершины
*/

function drawPolygonRoofSectorFrame(par){
	
	par.mesh = new THREE.Object3D();
	
	//точки габаритного треугольника
	var p1 = {x:0, y:0}
	var p2 = polar(p1, -Math.PI / 2 - par.ang / 2, par.edgeLen)
	var p3 = polar(p1, -Math.PI / 2 + par.ang / 2, par.edgeLen)
	
	//точки верхней перемычки
	var topOffsetEdge = par.topOffset * Math.cos(par.ang / 2);
	var p12 = polar(p1, -Math.PI / 2 - par.ang / 2, topOffsetEdge)
	var p13 = polar(p1, -Math.PI / 2 + par.ang / 2, topOffsetEdge)
	
	//боковой отступ
	p12.x += par.sideOffset
	p2.x += par.sideOffset
	
	p13.x -= par.sideOffset
	p3.x -= par.sideOffset
	
	//создаем шейп
	var shapePar = {
		//points: [p12, p13, p3, p2],
		points: [p12, p2, p3, p13],
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;
	
	//внутренний контур
	var profWidth = partPar.rafter.profSize.x;
	
	var leftHoleLine = parallel(p12, p2, -profWidth)
	var rightHoleLine = parallel(p13, p3, -profWidth)
	var botHoleLine = parallel(p2, p3, profWidth)
	var topHoleLine = parallel(p12, p13, -profWidth)
	
	var ph12 = itercectionLines(leftHoleLine, topHoleLine)
	var ph13 = itercectionLines(rightHoleLine, topHoleLine)
	var ph3 = itercectionLines(rightHoleLine, botHoleLine)
	var ph2 = itercectionLines(leftHoleLine, botHoleLine)
	
	//создаем шейп отверстия
	var shapePar = {
		points: [ph12, ph13, ph3, ph2],
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		//radOut:20,
	}

	var holeShape = drawShapeByPoints2(shapePar).shape;
	
	shape.holes.push(holeShape)
	
		
	
	
	var extrudeOptions = {
		amount: partPar.rafter.profSize.y,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

	var frame = new THREE.Mesh(geom, params.materials.metal);
	frame.position.z = -partPar.rafter.profSize.y
	par.mesh.add(frame);
	
	
	//стропила
	var cornerRafterOffset = 150; //отступ крайнего опорного стропила от внутреннего угла
	var maxStep = 700;
	var rafterAmt = Math.ceil((distance(ph3, ph2) - cornerRafterOffset * 2) / maxStep);
	var step = (distance(ph3, ph2) - cornerRafterOffset * 2) / rafterAmt;
	
				
	//вертикальные стойки
	var polePar = {
		poleProfileY: partPar.rafter.profSize.x,
		poleProfileZ: partPar.rafter.profSize.y,
		dxfBasePoint: par.dxfBasePoint,
		length: 200,
		poleAngle: 0,
		material: params.materials.metal,
		dxfArr: [],
		type: 'rect',
		partName: 'carportColumn'
	};
/*			
	var pos = polar({x:0, y:0}, -arcStepAng * i, baseRing.rad)
	
	var rack = drawPole3D_4(polePar).mesh;
	rack.rotation.y = arcStepAng * i + Math.PI / 2;
	rack.rotation.z = Math.PI / 2;
	rack.position.x = pos.x;
	rack.position.y = botOffset;
	rack.position.z = pos.y;

	dome.add(rack)
*/	
	for(var i=0; i<=rafterAmt; i++){
		//точки пересечения стропила и рамки
		var botPoint = newPoint_xy(ph2, cornerRafterOffset + step * i, 0);
		var borderLine = leftHoleLine;
		if(botPoint.x > 0) borderLine = rightHoleLine;		
		var topPoint = itercection(borderLine.p1, borderLine.p2, botPoint, newPoint_xy(botPoint, 0, 1));
		
		polePar.length = distance(botPoint, topPoint)
		
		var rafter = drawPole3D_4(polePar).mesh;
		rafter.rotation.z = Math.PI / 2
		rafter.position.x = botPoint.x + partPar.rafter.profSize.x / 2;
		rafter.position.y = botPoint.y;
		rafter.position.z = -partPar.rafter.profSize.y
		par.mesh.add(rafter);
	}
	
	par.mesh.setLayer('carcas');
	
	var partName = "roofFrame";
	var len = Math.round(p1.y - p2.y);
	var width = Math.round(p3.x - p2.x);
	var area = len * width / 1000000;
	
	if (typeof specObj != 'undefined') {
		name = len + "х" + width;
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				name: "Рамка ската ",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "carcas",
			}
		}
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		par.mesh.specParams = {specObj: specObj, amt: 1, area: area, partName: partName, name: name}
	}
	par.mesh.specId = partName + name;
	
	return par;
}

/**
функция отрисовывает поперечную балку навеса
ноль - середина по X на уровне низа профиля
*/
function drawCarportBeam(par){
	if(!par) par = {};
	initPar(par)
	
	var beamProfParams = getProfParams(params.beamProf)
	
	//прямая балка
	if(params.roofType == "Плоская"){
		par.len = params.width / Math.cos(params.roofAng / 180 * Math.PI);
		var polePar = {
			poleProfileY: beamProfParams.sizeA,
			poleProfileZ: beamProfParams.sizeB,
			dxfBasePoint: par.dxfBasePoint,
			length: par.len,
			poleAngle: params.roofAng / 180 * Math.PI,
			//poleAngle: 0,
			material: params.materials.metal,
			dxfArr: [],
			type: 'rect',
			partName: 'carportBeam',
		};
		
		var beam = drawPole3D_4(polePar).mesh;
		beam.position.x = -params.width / 2 - params.sideOffset
		par.mesh.add(beam)
		
		//термошайбы и саморезы на балках

		var screwsAmt = Math.round(par.len / 450);
		var step = par.len / screwsAmt;
		for (var i = 0; i < screwsAmt; i++) {
			var shim = drawTermoShim();
			shim.position.x = step / 2 + step * i
			shim.rotation.x = Math.PI / 2;
			shim.position.y = polePar.poleProfileY / 2;
			shim.position.z = polePar.poleProfileZ + params.roofThk;
			par.mesh.add(shim);

			var screwPar = {
				id: "roofingScrew_5x32",
				description: "Крепление поликарбоната к профилям",
				group: "Кровля"
			}
				
			var screw = drawScrew(screwPar).mesh;
			screw.position.x = step / 2 + step * i
			screw.rotation.x = -Math.PI / 2;
			screw.position.y = polePar.poleProfileY / 2;
			screw.position.z = polePar.poleProfileZ + params.roofThk;
			par.mesh.add(screw);
		};
		
	}
	
	
	//арочная балка
	if(params.roofType == "Арочная"){

		arcPar = partPar.main.arcPar;
		if(params.carportType == "сдвижной") {
			var arcPar = {
				a1: par.a1, //угол вектора на центр внешней дуги и точку p1
				sideOffset: 0, //расстояние от нулевой точки к точке botLine.p2
				endHeight: partPar.rafter.profSize.y,
				midHeight: partPar.rafter.profSize.y,
				width: par.len,
				columnProf: {},				
			}
			arcPar = calcRoofArcParams(arcPar)
		}
			
		//средняя линия балки
		var midArc = {
			center: arcPar.topArc.center,
			startAngle: arcPar.topArc.startAngle,
			endAngle: arcPar.topArc.endAngle,
			rad: arcPar.topArc.rad - partPar.rafter.profSize.y / 2,
		}

		var arcPanelPar = {
			rad: midArc.rad,
			height: partPar.rafter.profSize.x,
			thk: partPar.rafter.profSize.y,
			angle: midArc.startAngle - midArc.endAngle,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
			material: params.materials.metal,
			partName: 'carportBeam',
			dxfPrimitivesArr: []
		}
		

		var beam = drawArcPanel(arcPanelPar).mesh;
		beam.rotation.z = midArc.endAngle;
		if (params.carportType == "односкатный") beam.position.x = params.width / 2
		beam.position.y = midArc.center.y
		par.mesh.add(beam)
		
		//параметры верхней дуги для дальнейшего использования
		par.topArc = arcPar.topArc;
	}
	
	//фланцы
	if (params.carportType != "сдвижной"){
		var flanPar = {
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 2000, 2000),
			dxfArr: dxfPrimitivesArr,
		}
		var flan = drawPoleBeamFlan(flanPar).mesh
		flan.position.x = -params.width / 2 + params.sideOffset + partPar.column.profSize.y / 2
		flan.position.z = -8
		par.mesh.add(flan);
		
		var flan = drawPoleBeamFlan(flanPar).mesh
		flan.position.x = -params.width / 2 + params.sideOffset + partPar.column.profSize.y / 2
		flan.position.z = partPar.rafter.profSize.x
		par.mesh.add(flan);
		
		
		
		var flan = drawPoleBeamFlan(flanPar).mesh
		if (params.carportType == "двухскатный") flan.rotation.y = Math.PI
		flan.position.x = params.width / 2 - params.sideOffset - partPar.column.profSize.y / 2
		flan.position.z = 0
		par.mesh.add(flan);
		
		var flan = drawPoleBeamFlan(flanPar).mesh	
		if (params.carportType == "двухскатный") flan.rotation.y = Math.PI
		flan.position.x = params.width / 2 - params.sideOffset - partPar.column.profSize.y / 2
		flan.position.z = partPar.rafter.profSize.x + 8
		par.mesh.add(flan);
		}
	
	return par;
}

/** функция отрисовывает круговой массив элементов
center
rad
drawFunction
startAngle
endAngle
itemAmt
itemPar
itemWidth //ширина элемента, если надо чтобы элементы не выходили за пределы полного угла. не обязательный
*/
function drawArcArray(par){
	if(!par.itemWidth) itemWidth = 0;
	
	par.mesh = new THREE.Object3D();
	par.itemAng = par.itemWidth / par.rad; //угловая ширина элемента
	par.angStep = (par.endAngle - par.startAngle - par.itemAng) / (par.itemAmt - 1);
	
	
	for (var i = 0; i < par.itemAmt; i++) {
		var item = par.drawFunction(par.itemPar).mesh;
		var pos = polar(par.center, par.startAngle + par.angStep * i, par.rad);
		
		item.position.y = pos.y;
		item.position.z = pos.x;
		item.rotation.x = -(par.startAngle + par.angStep * i);
		par.mesh.add(item);
	}
	
	if(par.rot) {
		if(par.rot.y) par.mesh.rotation.y = par.rot.y
	}
	
	//центр массива в точке 0,0
	var box3 = new THREE.Box3().setFromObject(par.mesh);
	par.mesh.position.x -= (box3.max.x + box3.min.x) / 2;
	par.mesh.position.z -= (box3.max.z + box3.min.z) / 2;
	
	return par;
}

/** функция отрисовывает прямоугольный массив элементов
базовая точка - центр массива
Есть возможность изменять параметры или позицию любого отдельного элемента через функцию modifier

amt: { //кол-во элементов массива. Если не указано принимается 1
	x: 2,
	z: 3,
	y: 1,
}
arrSize: { //полные размеры массива по внешним сторонам
	x: 2000,
	z: 3000,
}
itemSize: { //ширина элемента, если надо чтобы элементы не выходили за пределы полного угла. не обязательный
	x: 60,
	z: 30,
}
itemRot: { //поворот элемента внутри массива, не обязательный
	x: Math.PI / 2,
}
drawFunction //функция отрисовки элемента
itemPar //параметры элемента
modifier // функция модифицирующая параметры элемента в зависимости от номера итерации цикла
noAlign //центрирование массива
*/
function drawRectArray(par){
	
	var axis = ["x", "y", "z"];

	par.mesh = new THREE.Object3D();
	
	if(!par.itemSize) par.itemSize = {};
	if(!par.itemRot) par.itemRot = {};
	if(!par.step) par.step = {};
	if(!par.rot) par.rot = {};
	if(!par.moove) par.moove = {};
	
	par.pos0 = {};
	
	//перебираем все оси
	$.each(axis, function(){
		//параметры по умолчанию
		if(!par.amt[this]) par.amt[this] = 1;
		if(!par.arrSize[this]) par.arrSize[this] = 0;
		if(!par.itemSize[this]) par.itemSize[this] = 0;
		if(!par.itemRot[this]) par.itemRot[this] = 0;
		if(!par.rot[this]) par.rot[this] = 0;
		if(!par.moove[this]) par.moove[this] = 0;
		//рассчитываем шаг
		par.step[this] = 0;
		if(par.amt[this] > 1) par.step[this] = (par.arrSize[this] - par.itemSize[this]) / (par.amt[this] - 1);
	})

	var counter = {}; //счетчики циклов

	for (counter.x = 0; counter.x < par.amt.x; counter.x++) {
		for (counter.y = 0; counter.y < par.amt.y; counter.y++) {
			for (counter.z = 0; counter.z < par.amt.z; counter.z++) {				
				//модифицируем параметры элемента
				var itemMoove = {x:0, y:0, z:0}
				if(typeof par.modifier == "function") par.modifier(counter, par.itemPar, itemMoove);
				//отрисовываем элемент
				var item = par.drawFunction(par.itemPar).mesh;
				$.each(axis, function(){
					item.rotation[this] = par.itemRot[this];
					item.position[this] = par.step[this] * counter[this] + itemMoove[this];
					//выводим в dxf только первый объект
					if(counter[this] > 0) par.itemPar.dxfArr = par.itemPar.dxfPrimitivesArr = []
				})
				par.mesh.add(item);
			}
		}
	}
	
	//поворот и сдвиг массива целиком
	$.each(axis, function(){
		par.mesh.rotation[this] = par.rot[this];
		par.mesh.position[this] = par.moove[this];
	})
	
	//центр массива в точке 0,0
	if(!par.noAlign){
		var box3 = new THREE.Box3().setFromObject(par.mesh);
		par.mesh.position.x -= (box3.max.x + box3.min.x) / 2;
		par.mesh.position.z -= (box3.max.z + box3.min.z) / 2;
	}
	
	return par;
}

/* функция рисует проф. лист и металлочерепицу
*/

function drawWaveSheet(par){
	if(!par) par = {};
	initPar(par)
	
	par.dxfArr = []; //Не выводим в dxf
	
	if(!par.len) par.len = 1000;
	
	par.waveWidth = 70;
	par.waveHeight = 35;
	par.waveWidth2 = 29
	
	var waveAmt = 5;
	if(par.width) waveAmt = Math.ceil((par.width - par.waveWidth) / (par.waveWidth * 2 + par.waveWidth2 * 2))
	par.width = (par.waveWidth * 2 + par.waveWidth2 * 2) * waveAmt + par.waveWidth;
	
	var startPoint = {x:0, y:par.waveHeight}
	var points = [startPoint];
	
	for(var i=0; i<waveAmt; i++){
		var p1 = newPoint_xy(startPoint, par.waveWidth, 0)
		var p2 = newPoint_xy(p1, par.waveWidth2, -par.waveHeight)
		var p3 = newPoint_xy(p2, par.waveWidth, 0)
		var p4 = newPoint_xy(p3, par.waveWidth2, par.waveHeight)
		
		points.push(p1, p2, p3, p4)
		//низкая волна в конце
		if(i == waveAmt - 1) {
			p4.y -= 2;
			var p5 = newPoint_xy(p4, par.waveWidth, 0)
			points.push(p5)
		}
		startPoint = copyPoint(p4)
		
	}
	//нижний контур
	var botPoints = [];
	$.each(points, function(){
		var point = newPoint_xy(this, 0, -1);
		botPoints.push(point)
	})
	botPoints.reverse();
	points.push(...botPoints)
	
	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint
	}

	var shape = drawShapeByPoints2(shapePar).shape;
	
	
	var extrudeOptions = {
		amount: par.len,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	
	if(params.roofMat == "металлочерепица"){
		var path = new THREE.Path();
		var waveAmtLen = Math.ceil(par.len / 300);
		var waveLen = 272;
		var waveLen2 = 28;
		var waveHeightLen = 10;
		var startPoint = {x:0, y:0}
		var pointsLen = [new THREE.Vector3(0, startPoint.y, startPoint.x)];
		
		for(var i=0; i<waveAmtLen; i++){
			var p1 = newPoint_xy(startPoint, waveLen2, waveHeightLen)
			var p2 = newPoint_xy(p1, waveLen, -waveHeightLen)
			//последняя короткая волна
			if(i == waveAmtLen-1){
				p2 = itercection(p1, p2, newPoint_xy({x:0, y:0}, par.len, 0), newPoint_xy({x:0, y:0}, par.len, 1));
				if(p2.x < p1.x) break;
			}

			pointsLen.push(new THREE.Vector3(0, p1.y, p1.x), new THREE.Vector3(0, p2.y, p2.x))
			startPoint = copyPoint(p2);
		}
	
		for (let i = 0; i < pointsLen.length-1; i ++) {
		  path.add(new THREE.LineCurve3(pointsLen[i], pointsLen[i+1]));
		}


		extrudeOptions = {
			steps: waveAmtLen * 10,
			bevelEnabled: false,
			extrudePath: path,
		}
		var geom =  new THREE.ExtrudeBufferGeometry(shape, extrudeOptions);
	}

	
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

	var mesh = new THREE.Mesh(geom, params.materials.metal_roof);
	mesh.rotation.y = Math.PI / 2
	mesh.position.y = 2
	mesh.position.z = par.width
	if(params.roofMat == "металлочерепица"){
		mesh.position.y = 40
		mesh.position.z = 0
	}
	par.mesh.add(mesh);


	
	var partName = "polySheet";
	var area = par.len * par.width / 1000000;
	
	if (typeof specObj != 'undefined') {
		name = Math.round(par.len) + "х" + Math.round(par.width);
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				name: "Профлист " + params.roofThk + "мм " + params.roofMetalColor,
				metalPaint: false,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "carcas",
			}
		}
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		par.mesh.specParams = {specObj: specObj, amt: 1, area: area, partName: partName, name: name}
	}
	par.mesh.specId = partName + name;
	
	
	return par;
}

/** функция отрисовывает каркас кровли: стропила, прогоны
	par = {
		len: fullLen,
		width //необязательный
		a1 //необязательный
	}
	каркас односкатной плской кровли с балками сначала рисуется горизонтально, затем поворачивается
*/

function drawRoofCarcas(par){
	if(!par.width) par.width = params.width;
	par.mesh = new THREE.Object3D();

	//стропила
	var rafterPar = {
		len: par.width,
		dxfBasePoint: par.dxfBasePoint,
		dxfArr: dxfPrimitivesArr,
	}
	if(par.a1) rafterPar.a1 = par.a1;
	
	//функция отрисовки стропил
	var drawFunc = drawTriangleSheetTruss;
	if(params.roofType == "Арочная") drawFunc = drawArcSheetTruss;
	if(params.carportType == "консольный" || params.carportType == "консольный двойной") drawFunc = drawArcSheetWing;
	if(params.beamModel == "проф. труба" || params.carportType == "сдвижной") drawFunc = drawCarportBeam;
	if (params.beamModel == "ферма постоянной ширины") {
		drawFunc = drawArcTubeTruss;
		if (params.roofType == "Плоская") drawFunc = drawTriangleTubeTruss;
	}
	
	var rafterArrPar = {
		amt: {
			z: partPar.rafter.amt,
		},
		arrSize: {
			z: params.sectLen * params.sectAmt - partPar.column.profSize.y + 4,
		},
		itemSize: {
			z: params.trussThk,
		},
		drawFunction: drawFunc,
		itemPar: rafterPar,
	}
	

	if(params.beamModel == "проф. труба") {
		rafterArrPar.arrSize.z = partPar.main.len;
		rafterArrPar.itemSize.z = partPar.rafter.profSize.x;
	}
	
	if(params.carportType == "сдвижной"){
		rafterArrPar.amt.z = par.rafterAmt;
		rafterArrPar.arrSize.z = par.len;
	}
	
	if(params.carportType == "консольный" || params.carportType == "консольный двойной"){
		rafterArrPar.arrSize.z = params.sectLen * params.sectAmt - partPar.column.profSize.y + 4
	}
		
	var rafterArr = drawRectArray(rafterArrPar).mesh;
	if(params.carportType == "односкатный") rafterArr.position.x = 0; //выравниваем вручную
	//if(params.beamModel == "ферма постоянной ширины")  rafterArr.position.y = -partPar.truss.endHeight;
		
	rafterArr.setLayer('carcas');
	window.carportTruss = rafterArr;
	par.mesh.add(rafterArr);

	//прогоны	
	var amt = 1; //кол-во рядов прогонов
	if(params.beamModel == "проф. труба") amt = rafterArrPar.amt.z - 1;
	if(params.carportType == "двухскатный" && params.roofType != "Арочная") amt = 2;
	
	//параметры одного прогона
	var purlinPar = {
		len: partPar.main.len,
	};
	
	if(params.beamModel == "проф. труба") {
		purlinPar.len = rafterArrPar.step.z - partPar.rafter.profSize.x;
	}

	for(var i=0; i<amt; i++){
	
		if(params.roofType == "Арочная"){
			//параметры массива прогонов
			var topArc = partPar.main.arcPar.topArc;
			if(params.carportType == "сдвижной") topArc = rafterPar.topArc

			var arrPar = {
				center: topArc.center,
				rad: topArc.rad - partPar.purlin.profSize.y, //верхняя плоскость прогона вровень с дугой
				drawFunction: drawPurlin,
				startAngle: topArc.endAngle,
				endAngle: topArc.startAngle,
				itemAmt: 3,
				itemPar: purlinPar,
				itemWidth: partPar.purlin.profSize.x,
				rot: {y: Math.PI / 2}
			}
			if(params.beamModel != "проф. труба") {
				arrPar.itemAmt = rafterPar.progonAmt + 1;
				arrPar.rad = topArc.rad + partPar.truss.stripeThk
			}
			
			if(params.beamModel == "ферма постоянной ширины") {
				arrPar.itemAmt = rafterPar.progonAmt + 1;
				arrPar.rad = topArc.rad
			}
			
			
			
			//отрисовка массива прогонов
			var purlinArr = drawArcArray(arrPar).mesh;
			purlinArr.rotation.y = Math.PI / 2;
			if(params.beamModel == "проф. труба") {
				purlinArr.position.z = rafterArrPar.step.z * i + purlinPar.len - partPar.main.len / 2 + partPar.rafter.profSize.x;
			}
			if(params.carportType == "сдвижной"){
				purlinArr.position.z = rafterArrPar.step.z * i + purlinPar.len - par.len / 2 + partPar.rafter.profSize.x;
			}
			purlinArr.setLayer('carcas');
			if(params.carportType == "односкатный") purlinArr.position.x = 0; //выравниваем вручную
			if (params.frontOffset !== params.backOffset)
				purlinArr.position.z += (params.frontOffset - params.backOffset) / 2; //выравниваем вручную
			
			purlinArr.setLayer('purlins');
			
			par.mesh.add(purlinArr)

		}
	
		if(params.roofType != "Арочная"){
			//поворачиваем профиль
			purlinPar.poleProfileZ = partPar.purlin.profSize.x;
			purlinPar.poleProfileY = partPar.purlin.profSize.y;
		
			var purlinArrPar = {
				amt: {
					x: partPar.purlin.amt,
				},
				arrSize: {
					x: rafterPar.len / Math.cos(THREE.Math.degToRad(params.roofAng)),
				},
				itemSize: {
					x: partPar.purlin.profSize.x,
				},
				itemRot: {
					y: Math.PI / 2,
				},
				rot: {
					z: params.roofAng / 180 * Math.PI,
				},
				
				drawFunction: drawPurlin,
				itemPar: purlinPar,
			}
			
			if(params.beamModel == "проф. труба") noAlign = true;
			
			//левая сторона
			if(i == 1) {
				purlinArrPar.rot.z = Math.PI - params.roofAng / 180 * Math.PI
			}
			
			var purlinArr = drawRectArray(purlinArrPar).mesh;
			if(params.beamModel == "проф. труба") {
				purlinArr.position.z = rafterArrPar.step.z * i + purlinPar.len - partPar.main.len / 2 + partPar.rafter.profSize.x;
				purlinArr.position.y = partPar.rafter.profSize.y - partPar.purlin.profSize.y
			}
			if(params.beamModel != "проф. труба") {				
				purlinArr.position.y = partPar.truss.endPoint.y
				if(params.carportType == "односкатный") purlinArr.position.x = partPar.truss.endPoint.x; //выравниваем вручную
			}
			
			if(params.carportType == "двухскатный"){
				//левая половинка
				if(i == 0) purlinArr.position.x = -params.width / 2
				//правая половинка
				if(i == 1) {
					purlinArr.position.x = params.width / 2
					var moove = polar({x:0, y:0}, -params.roofAng / 180 * Math.PI + Math.PI / 2, partPar.purlin.profSize.y)
					purlinArr.position.x += moove.x
					purlinArr.position.y += moove.y
				}
			}
			if (params.frontOffset !== params.backOffset)
				purlinArr.position.z += (params.frontOffset - params.backOffset) / 2; //выравниваем вручную
			
			purlinArr.setLayer('purlins');
			par.mesh.add(purlinArr);
	
		}
		
		
	}

	//термошайбы по прогонам
	
	
	//термошайбы по дугам
	if(params.beamModel == "проф. труба"){
		
	}
	
	
	par.topArc = topArc
	
	//центр массива в точке 0,0
	var box3 = new THREE.Box3().setFromObject(par.mesh);
	par.mesh.position.x -= (box3.max.x + box3.min.x) / 2;
	par.mesh.position.z -= (box3.max.z + box3.min.z) / 2;
	
	return par;
	
} //end of drawRoofCarcas

/** функция отрисовывает стену навеса  **/

function drawCarportWall(par){
	par.mesh = new THREE.Object3D();

	var sheetPar = {
		poleProfileY: params.wallThk,
		poleProfileZ: params.wallHeight - params.wallBotOffset,
		dxfBasePoint: {x:0,y:0},
		length: par.len,
		material: params.materials.plastic_roof,
		dxfArr: [],
		type: 'rect',
		partName: 'polySheet'
	};
	
	var sheet = drawPole3D_4(sheetPar).mesh;
	sheet.rotation.x = -Math.PI / 2;
	sheet.position.y = params.wallBotOffset;
	par.mesh.add(sheet)
	
	//горизонтальная обрешетка
	
	var maxStep = 1000;
	var beamAmt = Math.ceil(sheetPar.poleProfileZ / maxStep) + 1;
	var beamStep = (sheetPar.poleProfileZ - partPar.wall.beam.y) / (beamAmt - 1)
	
	var polePar = {
		poleProfileY: partPar.wall.beam.y,
		poleProfileZ: partPar.wall.beam.x,
		dxfBasePoint: {x:0,y:0},
		length: par.len - partPar.column.profSize.y * 2,
		material: params.materials.metal,
		dxfArr: [],
		type: 'rect',
		partName: 'purlinProf'
	};
	
	for(var i=0; i<beamAmt; i++){

		var beam = drawPole3D_4(polePar).mesh;
		beam.position.x = partPar.column.profSize.y;
		beam.position.y = params.wallBotOffset + beamStep * i;
		par.mesh.add(beam)
	}
	
	//вертикальная обрешетка
	
	var maxStep = 1000;
	var pillarAmt = Math.ceil(par.len / maxStep) - 1;
	var pillarStep = (par.len - partPar.column.profSize.y * 2) / (pillarAmt + 1)
	
	var polePar = {
		poleProfileY: partPar.wall.pillar.y,
		poleProfileZ: partPar.wall.pillar.x,
		dxfBasePoint: {x:0,y:0},
		length: sheetPar.poleProfileZ - partPar.wall.beam.y * 2,
		material: params.materials.metal,
		dxfArr: [],
		type: 'rect',
		partName: 'purlinProf'
	};

	for(var i=1; i<=pillarAmt; i++){

		var pillar = drawPole3D_4(polePar).mesh;
		pillar.rotation.z = Math.PI / 2
		pillar.position.x = partPar.column.profSize.y + pillarStep * i;
		pillar.position.y = params.wallBotOffset + partPar.wall.beam.y;
		par.mesh.add(pillar)
	}
	
	return par;
}

/* функция отрисовывает лист обшивки фронтона */
function drawFronton(par){
	if(!par) par = {};
	initPar(par)
	
	
	if(params.roofType == "Плоская"){
		var roofSegmentPar = {
			ang: Math.PI - THREE.Math.degToRad(params.roofAng) * 2,
			edgeLen: params.width / 2 / Math.cos(THREE.Math.degToRad(params.roofAng)),	
			dxfArr: par.dxfArr,
			dxfBasePoint: par.dxfBasePoint,
		}
		
		if(params.carportType == "односкатный") {
			roofSegmentPar.edgeLen *= 2
			roofSegmentPar.isHalf = true
		}

		var sheet = drawPolygonRoofSector(roofSegmentPar).mesh
		
		sheet.position.x = params.width / 2 - params.sideOffset
		sheet.position.y = params.width / 2 * Math.tan(THREE.Math.degToRad(params.roofAng))
		
		if(params.carportType == "односкатный") {
			sheet.position.x = params.width - params.sideOffset
			sheet.position.y = params.width * Math.tan(THREE.Math.degToRad(params.roofAng))
		}
		
		sheet.position.y += partPar.truss.endHeight - params.sideOffset * Math.tan(THREE.Math.degToRad(params.roofAng));
				
		par.mesh.add(sheet)
	}
	
	if(params.roofType == "Арочная"){
		
		if(!par.topArc) par.topArc = partPar.main.arcPar.topArc;
		
		//лист
		var shape = new THREE.Shape()
		var p1 = polar(par.topArc.center, par.topArc.endAngle, par.topArc.rad)
		var p2 = polar(par.topArc.center, par.topArc.startAngle, par.topArc.rad)
		var p3 = {
			x: p1.x,
			y: p2.y,
		}

		addArc2(shape, par.dxfArr, par.topArc.center, par.topArc.rad, par.topArc.startAngle, par.topArc.endAngle, true, par.dxfBasePoint)
		if(params.carportType == "односкатный"){
			addLine(shape, par.dxfArr, p2, p1, par.dxfBasePoint);
			addLine(shape, par.dxfArr, p1, p3, par.dxfBasePoint);
		}
		if(params.carportType == "двухскатный") addLine(shape, par.dxfArr, p2, p1, par.dxfBasePoint);
		
		var extrudeOptions = {
			amount: params.wallThk, 
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};
			
		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var sheet = new THREE.Mesh(geom, params.materials.plastic_roof);
		par.mesh.add(sheet)
		
		//верхняя дуга
		
		if(params.beamModel == 'сужающаяся' || params.beamModel == 'постоянной ширины') {
			var midArc = {
				center: par.topArc.center,
				startAngle: par.topArc.startAngle,
				endAngle: par.topArc.endAngle,
				rad: par.topArc.rad - 40 / 2,
			}

			var arcPanelPar = {
				rad: midArc.rad,
				height: 40,
				thk: 20,
				angle: midArc.startAngle - midArc.endAngle,
				dxfBasePoint: newPoint_xy(par.dxfBasePoint, params.width * 2 + 500, 0),
				material: params.materials.metal,
				partName: 'carportBeam',
				dxfPrimitivesArr: []
			}

			var beam = drawArcPanel(arcPanelPar).mesh;
			beam.rotation.z = midArc.endAngle;
			beam.position.x = params.width / 2 - params.sideOffset
			if (params.carportType == "односкатный") beam.position.x += params.width / 2
			if(params.carportType == 'сдвижной') beam.position.x = params.width / 2;
			beam.position.y = midArc.center.y
			beam.position.z = params.wallThk
			par.mesh.add(beam)
		}
	}
	
	//горизонтальная перемычка
	var beamLen = params.width - params.sideOffset * 2 - partPar.column.profSize.y * 2
	if(params.carportType == 'сдвижной') beamLen = par.width;
	var polePar = {
		poleProfileY: 20,
		poleProfileZ: 40,
		dxfBasePoint: {x:0,y:0},
		length: beamLen,
		material: params.materials.metal,
		dxfArr: [],
		type: 'rect',
		partName: 'purlinProf'
	};
	
	var beam = drawPole3D_4(polePar).mesh;
	beam.position.x = partPar.column.profSize.y;	
	beam.position.y = partPar.truss.endHeight - 20;
	if(params.carportType == 'сдвижной') {
		beam.position.x = 0;
		beam.position.y = 100; //подогнано
	}
	beam.position.z = params.wallThk
	par.mesh.add(beam)

	//вертикальная обрешетка
	
	var maxStep = 1000;
	var pillarAmt = Math.ceil(beamLen / maxStep) - 1;
	var pillarStep = beamLen / (pillarAmt + 1)
	
	var polePar = {
		poleProfileY: 20,
		poleProfileZ: 40,
		dxfBasePoint: {x:0,y:0},
		length: 100, //пересчитывается в цикле для каждой стойки
		material: params.materials.metal,
		dxfArr: [],
		type: 'rect',
		partName: 'purlinProf'
	};

	for(var i=1; i<=pillarAmt; i++){
		var botPoint = {
			x: partPar.column.profSize.y + pillarStep * i - 50, //50-подогнано
			y: partPar.truss.endHeight,
		}
		if(params.carportType == 'сдвижной') botPoint.y = 100;
		
		if(params.roofType == "Арочная"){
			var topPoint = itercectionLineCircle(botPoint, newPoint_xy(botPoint, 0, 1), par.topArc.center, par.topArc.rad - 40)[0]
		}
		if(params.roofType == "Плоская"){
			var leftPoint = {x:0, y:0}
			var topPoint = itercection(botPoint, newPoint_xy(botPoint, 0, 1), leftPoint, polar(leftPoint, THREE.Math.degToRad(params.roofAng), 1));
		}
		
		polePar.length = distance(botPoint, topPoint)
		
		var pillar = drawPole3D_4(polePar).mesh;
		pillar.rotation.z = Math.PI / 2
		pillar.position.x = botPoint.x + 60; //60 - подогнано
		pillar.position.y = botPoint.y;
		pillar.position.z = params.wallThk
		par.mesh.add(pillar)
	}
	
	par.mesh.setLayer("walls");
	
	//поликарбонат на арочный фронтон
	if(params.roofType == "Арочная"){
	
		var partName = "polySheet";
		var len = params.width;
		if(par.width) len = par.width;
		var width = par.topArc.height;
		var area = len * width / 1000000;
		
		if (typeof specObj != 'undefined') {
			name = Math.round(len) + "х" + Math.round(width);
			if (!specObj[partName]) {
				specObj[partName] = {
					types: {},
					amt: 0,
					area: 0,
					name: "Поликарбонат " + par.thk + " " + params.roofColor,
					metalPaint: false,
					timberPaint: false,
					division: "metal",
					workUnitName: "amt",
					group: "carcas",
				}
			}
			if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
			if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
			specObj[partName]["amt"] += 1;
			specObj[partName]["area"] += area;
			par.mesh.specParams = {specObj: specObj, amt: 1, area: area, partName: partName, name: name}
		}
		par.mesh.specId = partName + name;
	}
	
	return par;
}


/** функция отрисовывает колпак сверху кровли многоугольного павильона из поликарбоната
	@param ang // угол между гранями листа, примыкающими к шпилю		
	@param dxfArr: dxfPrimitivesArr,
	@param dxfBasePoint: {x: 2000, y:0},
	@param edgeLen //длина ребра
	@param thk - толщина стенки
*/

function drawPolygonRoofSectorCap(par) {

	par.mesh = new THREE.Object3D();

	var p1 = { x: 0, y: 0 }
	var p2 = polar(p1, -Math.PI / 2 - par.ang / 2, par.edgeLen)
	var p3 = polar(p1, -Math.PI / 2 + par.ang / 2, par.edgeLen)

	
	//создаем шейп
	var shapePar = {
		points: [p1, p2, p3],
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint
	}

	var shape = drawShapeByPoints2(shapePar).shape;

	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

	var frame = new THREE.Mesh(geom, params.materials.metal);
	par.mesh.add(frame);

	par.mesh.setLayer('roof');

	var partName = "roofCap";
	var len = Math.round(p1.y - p2.y);
	var width = Math.round(p3.x - p2.x);
	var area = len * width / 1000000;

	if (typeof specObj != 'undefined') {
		name = len + "х" + width;
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				name: "Колпак ",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "carcas",
			}
		}
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		par.mesh.specParams = { specObj: specObj, amt: 1, area: area, partName: partName, name: name }
	}
	par.mesh.specId = partName + name;

	return par;
}

/** функция отрисовывает чашку каркаса кровли многоугольного павильона из поликарбоната
	@param ang // угол между гранями листа, примыкающими к шпилю		
	@param dxfArr: dxfPrimitivesArr,
	@param dxfBasePoint: {x: 2000, y:0},
	@param topOffset - отступ от вершины
	@param thk - толщина стенки
*/

function drawPolygonRoofSectorBowl(par) {

	par.mesh = new THREE.Object3D();

	var p0 = { x: 0, y: 0 }

	var topOffsetEdge = par.topOffset * Math.cos(par.ang / 2);

	var pt1 = polar(p0, -Math.PI / 2 - par.ang / 2, topOffsetEdge)
	var pt2 = polar(p0, -Math.PI / 2 + par.ang / 2, topOffsetEdge)

	var botEdgeBowl = distance(pt1, pt2); // длина нижнего ребра чаши
	var offsetTopEdgeBowl = partPar.rafter.profSize.y * Math.sin(params.roofAng / 180 * Math.PI) * Math.tan(par.ang / 2)//увеличение верхнего ребра чаши

	var p1 = newPoint_xy(p0, - botEdgeBowl / 2 - offsetTopEdgeBowl, 0)
	var p2 = newPoint_xy(p1, botEdgeBowl + offsetTopEdgeBowl * 2, 0)
	var p4 = newPoint_xy(p0, -botEdgeBowl / 2, partPar.rafter.profSize.y)
	var p3 = newPoint_xy(p4, botEdgeBowl, 0)

	//запоминаем нижнее ребро чаши для отрисовки нижней пластины чаши
	par.botEdgeBowl = botEdgeBowl
	par.botBowlY = pt1.y * Math.sin(params.roofAng / 180 * Math.PI)

	//создаем шейп
	var shapePar = {
		points: [p1, p2, p3, p4],
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint
	}

	var shape = drawShapeByPoints2(shapePar).shape;

	
	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

	var frame = new THREE.Mesh(geom, params.materials.metal);
	frame.rotation.x = Math.PI / 2
	frame.position.y = pt1.y + par.thk
	frame.position.z = -partPar.rafter.profSize.y
	par.mesh.add(frame);

	par.mesh.setLayer('carcas');

	return par;
}

/** функция отрисовывает нижнюю пластину чашки каркаса кровли многоугольного павильона
	@param ang // полный угол сектора
	@param dxfArr: dxfPrimitivesArr,
	@param dxfBasePoint: {x: 2000, y:0},
*/
function drawPolygonRoofSectorBowlBot(par) {

	par.mesh = new THREE.Object3D();

	var p0 = { x: 0, y: 0 }

	var botEdgeBowl = par.botEdgeBowl / 2 / Math.sin(par.ang / 2);

	var points = []
	for (var i = 0; i < params.edgeAmt; i++) {
		points.push(polar(p0, par.ang * i + (par.ang / 2 - Math.PI / 2), botEdgeBowl))
	}

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint
	}

	var shape = drawShapeByPoints2(shapePar).shape;


	var extrudeOptions = {
		amount: 8,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

	var frame = new THREE.Mesh(geom, params.materials.metal)
	frame.rotation.x = Math.PI / 2
	par.mesh.add(frame);

	par.mesh.setLayer('carcas');

	var partName = "roofBowl";
	var area = botEdgeBowl * botEdgeBowl * Math.PI / 1000000;

	if (typeof specObj != 'undefined') {
		name = Math.round(botEdgeBowl) + "х" + params.edgeAmt;
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				name: "Чашка ",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "carcas",
			}
		}
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		par.mesh.specParams = { specObj: specObj, amt: 1, area: area, partName: partName, name: name }
	}
	par.mesh.specId = partName + name;

	return par;
}

/* функция рассчитывает центры колонн четырехскатного павильона*/
function calcParColon(par) {	

	par.points = []
	par.pointsColon = { 'front': [], 'rear': []}

	var p0 = { x: 0, y: 0 }

	//точки контура
	var p1 = newPoint_xy(p0, -par.lengthPavilion / 2, -params.width / 2)
	var p2 = newPoint_xy(p0, -par.lengthPavilion / 2, params.width / 2)
	var p3 = newPoint_xy(p0, par.lengthPavilion / 2, params.width / 2)
	var p4 = newPoint_xy(p0, par.lengthPavilion / 2, -params.width / 2)

	//осевые точки колонн
	p1 = newPoint_xy(p1, par.poleProfileZ / 2, par.poleProfileY / 2)
	p2 = newPoint_xy(p2, par.poleProfileZ / 2, -par.poleProfileY / 2)
	p3 = newPoint_xy(p3, -par.poleProfileZ / 2, -par.poleProfileY / 2)
	p4 = newPoint_xy(p4, -par.poleProfileZ / 2, par.poleProfileY / 2)

	par.points.push(p1, p2, p3, p4)
	par.pointsColon.front.push(p1)
	par.pointsColon.rear.push(p2)

	//определяем дополнительные колонны
	//front, rear

	for (var i = 1; i < params.sectAmt; i++) {
		var pt = newPoint_xy(p1, params.sectLen * i, 0);
		par.points.push(pt)
		par.pointsColon.front.push(pt)

		var pt = newPoint_xy(p2, params.sectLen * i, 0);
		par.points.push(pt)
		par.pointsColon.rear.push(pt)
	}

	par.pointsColon.front.push(p4)
	par.pointsColon.rear.push(p3)

	return par;
}

/** функция отрисовывает стропильные ноги каркаса кровли четырехскатного павильона из поликарбоната
	@param ridgeLen // длина конька
	@param roofHeight // высота кровли от мауэрлата до конька
	@param dxfArr: dxfPrimitivesArr,
	@param dxfBasePoint: {x: 2000, y:0},
*/

function drawPyramidalRafters(par) {

	par.mesh = new THREE.Object3D();

	var p0 = { x: 0, y: 0 }

	var pt1 = newPoint_xy(p0, -par.lengthPavilion / 2 - params.sideOffset, -params.width / 2 - params.sideOffset) //точка угла секции
	var pt2 = newPoint_xy(p0, -par.ridgeLen / 2, 0) // точка края конька

	// Угловые стропильные ноги----------------------------------------------------------

	// определяем угол наклона угловых стропильных ног
	var p3d1 = { x: 0, y: 0, z: 100 }
	var p3d2 = { x: par.lengthPavilion / 2 - par.ridgeLen / 2, y: params.width / 2, z: par.roofHeight - partPar.beam.profSize.y - partPar.rafter.profSize.y}
	var angCornerRafter = angleXY3d(p3d1, p3d2)

	// длина угловых стропильных ног
	var lenCornerRafter = distance(pt1, pt2) / Math.cos(angCornerRafter)

	var rafterPar = {
		poleProfileY: partPar.rafter.profSize.y,
		poleProfileZ: partPar.rafter.profSize.x,
		dxfBasePoint: par.dxfBasePoint,
		length: lenCornerRafter,
		poleAngle: 0,
		material: params.materials.metal,
		dxfArr: [],
		type: 'rect',
		partName: 'roofRafter'
	};

	//передняя, задняя сторона
	for (var k = 0; k < 2; k++) {

		//боковые стороны
		for (var j = 0; j < 2; j++) {
			var cornerRafter = drawPole3D_4(rafterPar).mesh;

			var angRot = calcAngleX1(pt1, pt2) // угол поворота угловых стропильных ног

			cornerRafter.rotation.y = -Math.PI / 2 + angRot;
			cornerRafter.rotation.z = angCornerRafter;
			cornerRafter.position.x = pt1.y;
			cornerRafter.position.z = pt1.x;
			cornerRafter.position.y = - params.sideOffset * Math.tan(partPar.main.roofAng) + partPar.beam.profSize.y;
			if (j == 1) {
				cornerRafter.rotation.y = -Math.PI / 2 - angRot;
				cornerRafter.position.x = -pt1.y;
			}
			if (k == 0) {
				if (j == 0) cornerRafter.position.x += partPar.rafter.profSize.x / 2 / Math.cos(angRot)
				if (j == 1) cornerRafter.position.z += partPar.rafter.profSize.x / 2 / Math.cos(angRot)
			}

			
			if (k == 1) {
				if (j == 0)cornerRafter.rotation.y += Math.PI / 2;
				if (j == 1)cornerRafter.rotation.y -= Math.PI / 2;
				cornerRafter.position.z = -pt1.x;
				if (j == 0) cornerRafter.position.z -= partPar.rafter.profSize.x / 2 / Math.cos(angRot)
				if (j == 1) cornerRafter.position.x -= partPar.rafter.profSize.x / 2 / Math.cos(angRot)
			}

			cornerRafter.setLayer('racks');
			par.mesh.add(cornerRafter);
		}
	}


	// Стропильные ноги боковых сторон----------------------------------------------

	//боковые стороны
	for (var k = 0; k < 2; k++) {

		var rafterPar = {
			poleProfileY: partPar.rafter.profSize.y,
			poleProfileZ: partPar.rafter.profSize.x,
			dxfBasePoint: par.dxfBasePoint,
			length: (par.lengthPavilion / 2 - par.ridgeLen / 2 + params.sideOffset + partPar.rafter.profSize.y * Math.sin(partPar.main.roofAng)) / Math.cos(partPar.main.roofAng),
			poleAngle: 0,
			angEnd: partPar.main.roofAng,
			material: params.materials.metal,
			dxfArr: [],
			type: 'rect',
			partName: 'roofRafter'
		};

		// Средняя нога
		var middleRafter = drawPole3D_4(rafterPar).mesh;

		middleRafter.rotation.y = -Math.PI / 2;
		middleRafter.rotation.z = partPar.main.roofAng;
		middleRafter.position.x = rafterPar.poleProfileZ / 2;
		middleRafter.position.z = pt1.x;
		middleRafter.position.y = - params.sideOffset * Math.tan(partPar.main.roofAng) + partPar.beam.profSize.y;
		if (k == 1) {
			middleRafter.rotation.y += -Math.PI;
			middleRafter.position.z = -pt1.x;
			middleRafter.position.x = -rafterPar.poleProfileZ / 2;
		}
		middleRafter.setLayer('racks');
		par.mesh.add(middleRafter);


		// вспомогательные ноги
		rafterPar.angEnd = 0;

		var line = parallel(pt1, pt2, rafterPar.poleProfileZ / 2) // линия угловой ноги
		var step = 600
		var len = params.width / 2 - partPar.beam.profSize.x
		var count = Math.floor(len / step)
		var step = len / (count + 1)

		// левая и правая сторона от средней ноги
		for (var j = 0; j < 2; j++) {
			var turn = 1;
			if (j == 1) turn = -1;
			for (var i = 1; i <= count; i++) {

				var pt = { x: pt1.x, y: pt2.y - rafterPar.poleProfileZ / 2 - step * i }
				var pi = itercection(line.p1, line.p2, pt, polar(pt, Math.PI / 2, 100))
				rafterPar.length = distance(pt, pi) / Math.cos(partPar.main.roofAng)

				var rafter = drawPole3D_4(rafterPar).mesh;

				rafter.rotation.y = middleRafter.rotation.y;
				rafter.rotation.z = middleRafter.rotation.z;
				rafter.position.z = middleRafter.position.z;
				rafter.position.y = middleRafter.position.y;
				rafter.position.x = - step * i * turn;
				if (k==0 && j == 1) rafter.position.x += rafterPar.poleProfileZ / 2;
				if (k == 1 && j == 0) rafter.position.x -= rafterPar.poleProfileZ;

				rafter.setLayer('racks');
				par.mesh.add(rafter);
			}
		}
	}


	// Стропильные ноги передней и задней стороны----------------------------------------------

	//передняя и задняя сторона
	for (var k = 0; k < 2; k++) {
		var rafterPar = {
			poleProfileY: partPar.rafter.profSize.y,
			poleProfileZ: partPar.rafter.profSize.x,
			dxfBasePoint: par.dxfBasePoint,
			length: (params.width / 2 + params.sideOffset - partPar.rafter.profSize.x / 2) / Math.cos(partPar.main.roofAng) + partPar.rafter.profSize.y * Math.tan(partPar.main.roofAng),
			poleAngle: 0,
			angEnd: partPar.main.roofAng,
			material: params.materials.metal,
			dxfArr: [],
			type: 'rect',
			partName: 'roofRafter'
		};


		// Средняя нога
		var middleRafter = drawPole3D_4(rafterPar).mesh;

		middleRafter.rotation.z = partPar.main.roofAng;
		middleRafter.position.x = pt1.y;
		middleRafter.position.z = -rafterPar.poleProfileZ / 2;
		middleRafter.position.y = - params.sideOffset * Math.tan(partPar.main.roofAng) + partPar.beam.profSize.y;
		if (k == 1) {
			middleRafter.rotation.y = -Math.PI;
			middleRafter.rotation.z = partPar.main.roofAng;
			middleRafter.position.x = -pt1.y;
			middleRafter.position.z = rafterPar.poleProfileZ / 2;
		}

		middleRafter.setLayer('racks');
		par.mesh.add(middleRafter);

		// вспомогательные ноги

		//расчет кол-ва и шаг вспомогательных ног от средней ноги до края конька
		var step = 600
		var count = Math.floor(par.ridgeLen / 2 / step)
		var step = par.ridgeLen / 2 / (count + 1)
		count += 1;

		//расчет кол-ва и шаг вспомогательных ног от края конька до края стороны
		var line = parallel(pt1, pt2, -rafterPar.poleProfileZ / 2)// линия угловой ноги
		var step1 = 600
		var len1 = par.lengthPavilion / 2 - par.ridgeLen / 2 - partPar.beam.profSize.x
		var count1 = Math.floor(len1 / step1)
		var step1 = len1 / (count1 + 1)

		// левая и правая сторона от средней ноги
		for (var j = 0; j < 2; j++) {
			var turn = 1;
			if (j == 1) turn = -1;

			//вспомогательные ноги от средней ноги до края конька
			for (var i = 1; i <= count; i++) {
				rafterPar.length = (params.width / 2 + params.sideOffset - partPar.rafter.profSize.x / 2) / Math.cos(partPar.main.roofAng) + partPar.rafter.profSize.y * Math.tan(partPar.main.roofAng)
				rafterPar.angEnd = partPar.main.roofAng; 

				var rafter = drawPole3D_4(rafterPar).mesh;

				rafter.rotation.y = middleRafter.rotation.y;
				rafter.rotation.z = middleRafter.rotation.z;
				rafter.position.x = middleRafter.position.x;
				rafter.position.z = middleRafter.position.z - step * i * turn;
				if (i == count) rafter.position.z += rafterPar.poleProfileZ / 2 * turn;
				rafter.position.y = middleRafter.position.y;
				rafter.setLayer('racks');
				par.mesh.add(rafter);
			}

			//вспомогательные ноги от края конька до края стороны
			for (var i = 1; i <= count1; i++) {

				var pt = { x: pt2.x - step1 * i, y: pt1.y }
				var pi = itercection(line.p1, line.p2, pt, polar(pt, Math.PI / 2, 100))
				rafterPar.length = distance(pt, pi) / Math.cos(partPar.main.roofAng)
				rafterPar.angEnd = 0; 

				var rafter1 = drawPole3D_4(rafterPar).mesh;

				rafter1.rotation.y = middleRafter.rotation.y;
				rafter1.rotation.z = middleRafter.rotation.z;
				rafter1.position.x = middleRafter.position.x;
				rafter1.position.z = rafter.position.z - step1 * i * turn;
				rafter1.position.y = middleRafter.position.y;
				rafter1.setLayer('racks');
				par.mesh.add(rafter1);
			}
		}
	}

	return par;
}


/** функция отрисовывает скамейку многоугольного павильона
	@param ang // угол грани
	@param dxfArr: dxfPrimitivesArr,
	@param dxfBasePoint: {x: 2000, y:0},
	@param isLast - первая скамейка
	@param isFirst - последняя скамейка
*/

function drawPolygonRoofSectorBench(par) {

	par.mesh = new THREE.Object3D();

	var offset = 0;
	var widthBench = params.widthBench;
	var heightBench = params.heightBench;
	var thkBench = params.thkBench;

	var extrudeOptions = {
		amount: thkBench,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var p0 = { x: 0, y: 0 }

	var pt1 = polar(p0, par.ang, -params.domeDiam / 2)
	var pt2 = copyPoint(pt1)
	pt2.x *= -1;

	//длина ребра
	//var edgeLen = (params.domeDiam / 2 - (partPar.column.profSize.y + offset) / Math.sin(par.ang)) * Math.sin(par.ang / 2) 

	//var p1 = newPoint_xy(p0, -edgeLen, 0)

	var p1 = polar(p0, par.ang, -(params.domeDiam / 2 - (partPar.column.profSize.y + offset) / Math.sin(par.ang)))
	var p2 = polar(p1, par.ang, widthBench / Math.sin(par.ang))
	var p3 = copyPoint(p2)
	var p4 = copyPoint(p1)
	p3.x *= -1;
	p4.x *= -1;
	if (par.isFirst) {
		p3 = itercection(p2, p3, p4, polar(p4, Math.PI / 2, 100))
	}
	if (par.isLast) {
		p2 = itercection(p2, p3, p1, polar(p1, Math.PI / 2, 100))
	}

	var pt = itercection(p0, polar(p0, Math.PI / 2, 100), p1, p4)

	var points = [p1, p2, p3, p4]
	points = moovePoints(points, { x: -pt.x, y: -pt.y })

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint
	}

	var shape = drawShapeByPoints2(shapePar).shape;

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

	var bench = new THREE.Mesh(geom, params.materials.tread)
	bench.rotation.x = Math.PI / 2
	bench.position.z = -distance(pt, p0);
	bench.position.y = heightBench;
	par.mesh.add(bench);

	par.mesh.setLayer('carcas');



	//-------------------------------------------
	var pt = itercection(pt1, pt2, p2, polar(p2, Math.PI / 2, 100))
	var len = distance(pt, p2)

	var offset = 50;

	var profPar = {
		poleProfileY: 40,
		poleProfileZ: 40,
		dxfBasePoint: par.dxfBasePoint,
		length: len,
		poleAngle: 0,
		material: params.materials.metal,
		dxfArr: [],
		type: 'rect',
		partName: 'benchBridge'
	};

	

	for (var i = 0; i < 2; i++) {
		var prof = drawPole3D_4(profPar).mesh;

		prof.rotation.y = -Math.PI / 2
		prof.position.x = p2.x + offset + profPar.poleProfileZ;
		if (i == 1) prof.position.x = p3.x - offset;
		prof.position.z = pt.y;
		prof.position.y = heightBench - thkBench - profPar.poleProfileY;

		prof.setLayer('racks');
		par.mesh.add(prof);
	}

	//распорки
	var ang = Math.atan((heightBench - thkBench - profPar.poleProfileY) / len)
	profPar.length = profPar.length / Math.cos(ang)
	//profPar.angEnd =  Math.PI / 2 - ang

	for (var i = 0; i < 2; i++) {
		var prof = drawPole3D_4(profPar).mesh;

		prof.rotation.y = -Math.PI / 2
		prof.rotation.x = -ang
		prof.position.x = p2.x + offset + profPar.poleProfileZ;
		if (i == 1) prof.position.x = p3.x - offset;
		prof.position.z = pt.y;

		prof.setLayer('racks');
		par.mesh.add(prof);
	}
	


	var partName = "bench";
	var len = distance(p1, p4)
	var area = len * widthBench / 1000000;

	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				name: "Скамейка ",
				metalPaint: false,
				timberPaint: true,
				division: "timber",
				workUnitName: "amt",
				group: "carcas",
			}
		}
		var name = Math.round(len) + "x" + Math.round(widthBench) + "x" + thkBench;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		par.mesh.specParams = { specObj: specObj, amt: 1, area: area, partName: partName, name: name }
	}
	par.mesh.specId = partName + name;

	return par;
}

/** функция отрисовывает стол многоугольного павильона
	@param ang // полный угол сектора
	@param dxfArr: dxfPrimitivesArr,
	@param dxfBasePoint: {x: 2000, y:0},
*/
function drawTable(par) {

	par.mesh = new THREE.Object3D();

	var extrudeOptions = {
		amount: params.thkTable,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var rad = params.diamTable / 2;

	var p0 = { x: 0, y: 0 }

	if (params.tableType == 'круглый') {
		var shape = new THREE.Shape();

		addCircle(shape, par.dxfArr, p0, rad, par.dxfBasePoint)
	}

	if (params.tableType == 'многогранник') {
		var points = []
		for (var i = 0; i < params.edgeAmt; i++) {
			points.push(polar(p0, par.ang * i + (par.ang / 2 - Math.PI / 2), rad))
		}

		//создаем шейп
		var shapePar = {
			points: points,
			dxfArr: par.dxfArr,
			dxfBasePoint: par.dxfBasePoint
		}

		var shape = drawShapeByPoints2(shapePar).shape;
	}

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

	var table = new THREE.Mesh(geom, params.materials.tread)
	table.rotation.x = Math.PI / 2
	table.position.y = params.heightTable;
	par.mesh.add(table);

	par.mesh.setLayer('carcas');

	//стойка стола
	var profPar = {
		poleProfileY: 100,
		poleProfileZ: 100,
		dxfBasePoint: par.dxfBasePoint,
		length: params.heightTable - params.thkTable,
		poleAngle: 0,
		material: params.materials.metal,
		dxfArr: [],
		type: 'rect',
		partName: 'tableLeg'
	};

	var prof = drawPole3D_4(profPar).mesh;
	prof.rotation.z = Math.PI / 2
	prof.position.x = profPar.poleProfileY / 2;
	prof.position.z = -profPar.poleProfileZ / 2;
	prof.setLayer('racks');
	par.mesh.add(prof);

	//основание
	profPar.length = (rad * Math.cos(par.ang / 2) - 100) * 2
	profPar.poleProfileY = 40
	profPar.poleProfileZ = 40

	for (var i = 0; i < 2; i++) {
		var prof = drawPole3D_4(profPar).mesh;

		prof.position.x = -profPar.length / 2;
		prof.position.z = -profPar.poleProfileZ / 2;
		if (i == 1) {
			prof.rotation.y = -Math.PI / 2
			prof.position.z = -profPar.length / 2;
			prof.position.x = profPar.poleProfileZ / 2;
		}
		prof.setLayer('racks');
		par.mesh.add(prof);
	}


	var partName = "table";
	var area = rad * rad * Math.PI / 1000000;

	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				name: "Столешница ",
				metalPaint: false,
				timberPaint: true,
				division: "timber",
				workUnitName: "amt",
				group: "carcas",
			}
		}
		name = "Ф" + params.diamTable;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		par.mesh.specParams = { specObj: specObj, amt: 1, area: area, partName: partName, name: name }
	}
	par.mesh.specId = partName + name;

	return par;
}

/** функция отрисовывает доски и балки пола многоугольного павильона
	@param ang // угол грани
	@param dxfArr: dxfPrimitivesArr,
	@param dxfBasePoint: {x: 2000, y:0},
	@param beamProfY: размер по Y балки,
	@param beamProfZ: размер по Z балки,
*/
function drawPolygonSectorFloorRafters(par) {

	par.mesh = new THREE.Object3D();

	var crossbeamProfY = partPar.beam.profSize.y + params.thkFloor
	var crossbeamProfZ = 30

	var extrudeOptions = {
		amount: par.beamProfY,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var shapeMeshPar = {
		points: [],
		holes: [],
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		extrudeOptions: extrudeOptions,
		material: params.materials.metal,
	}

	var p0 = { x: 0, y: 0 }

	var pt1 = polar(p0, par.ang, -(params.domeDiam / 2 - crossbeamProfZ / Math.sin(par.ang)))
	var pt2 = copyPoint(pt1)
	pt2.x *= -1;
	var pt3 = itercection(pt1, pt2, p0, polar(p0, Math.PI / 2, 100))


	var radIn = 120;
	

	var line = { p1: p0, p2: pt1 }
	var line1 = parallel(line.p1, line.p2, -par.beamProfZ / 2)
	var line2 = parallel(p0, pt1, par.beamProfZ / 2)

	//угловой профиль секции под доски
	var p1 = itercection(pt1, pt2, line1.p1, line1.p2)
	var p2 = itercection(pt1, polar(pt1, par.ang + Math.PI / 2, 100), line2.p1, line2.p2)

	var pt = polar(p0, par.ang, -radIn)
	var p4 = itercection(pt, polar(pt, par.ang + Math.PI / 2, 100), line1.p1, line1.p2)
	var p3 = itercection(pt, polar(pt, par.ang + Math.PI / 2, 100), line2.p1, line2.p2)

	var points = [p1, pt1, p2, p3, p4]

	shapeMeshPar.points = points;

	var beam = createShapeAndMesh(shapeMeshPar)
	beam.rotation.x = Math.PI / 2
	beam.position.y = params.heightFloor - params.thkFloor;
	par.mesh.add(beam);


	//средний профиль секции под доски
	var p1 = newPoint_xy(pt3, par.beamProfZ / 2, 0)
	var p2 = newPoint_xy(pt3, -par.beamProfZ / 2, 0)

	var pt = polar(p0, Math.PI / 2, -radIn)
	var p3 = newPoint_xy(pt, -par.beamProfZ / 2, 0)
	var p4 = newPoint_xy(pt, par.beamProfZ / 2, 0)

	var points = [p1, p2, p3, p4]

	shapeMeshPar.points = points;

	var beam = createShapeAndMesh(shapeMeshPar)
	beam.rotation.x = Math.PI / 2
	beam.position.y = params.heightFloor - params.thkFloor;
	par.mesh.add(beam);

	

	//фасадная доска--------------------------------

	var p1 = polar(p0, par.ang, -params.domeDiam / 2)
	var p2 = copyPoint(pt1)
	var p3 = copyPoint(p2)
	var p4 = copyPoint(p1)
	p3.x *= -1;
	p4.x *= -1;

	var points = [p1, p2, p3, p4]

	shapeMeshPar.points = points;
	shapeMeshPar.extrudeOptions.amount = crossbeamProfY;
	shapeMeshPar.material = params.materials.tread;

	var beam = createShapeAndMesh(shapeMeshPar)
	beam.rotation.x = Math.PI / 2
	beam.position.y = params.heightFloor;
	par.mesh.add(beam);


	//доски---------------------------------------------------

	var widthTread = 200;
	var offset = 5;

	var pt = polar(p0, par.ang, -radIn)

	var i = 0;
	var flag = true
	while (flag) {
		var p1 = polar(pt1, par.ang, (widthTread + offset) * i / Math.sin(par.ang))
		var p2 = polar(p1, par.ang, widthTread / Math.sin(par.ang))

		if (p2.y > pt.y) {
			p2 = copyPoint(pt)
			flag = false;
		}

		var p3 = copyPoint(p2)
		var p4 = copyPoint(p1)
		p3.x *= -1;
		p4.x *= -1;

		var points = [p1, p2, p3, p4]


		shapeMeshPar.points = points;
		shapeMeshPar.extrudeOptions.amount = params.thkFloor;

		var tread = createShapeAndMesh(shapeMeshPar)
		tread.rotation.x = Math.PI / 2
		tread.position.y = params.heightFloor;
		par.mesh.add(tread);

		i++;
	}


	par.mesh.setLayer('carcas');

	return par;
}

/** функция отрисовывает центральную опору пола многоугольного павильона
	@param ang // полный угол сектора
	@param dxfArr: dxfPrimitivesArr,
	@param dxfBasePoint: {x: 2000, y:0},
*/

function drawMiddleRackFloor(par) {

	par.mesh = new THREE.Object3D();

	var extrudeOptions = {
		amount: 8,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var rad = params.diamTable / 2;

	var p0 = { x: 0, y: 0 }

	var len = 300

	var p1 = newPoint_xy(p0, -len / 2, - len / 2);
	var p2 = newPoint_xy(p1, 0, len);
	var p3 = newPoint_xy(p2, len, 0);
	var p4 = newPoint_xy(p1, len, 0);

	var points = [p1, p2, p3, p4];

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint
	}

	var shape = drawShapeByPoints2(shapePar).shape;

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

	var table = new THREE.Mesh(geom, params.materials.metal)
	table.rotation.x = Math.PI / 2
	table.position.y = params.heightFloor - params.thkFloor - partPar.beam.profSize.y;
	par.mesh.add(table);

	table.setLayer('carcas');

	//стойка
	var profPar = {
		poleProfileY: 100,
		poleProfileZ: 100,
		dxfBasePoint: par.dxfBasePoint,
		length: params.heightFloor - params.thkFloor - extrudeOptions.amount - partPar.beam.profSize.y,
		poleAngle: 0,
		material: params.materials.metal,
		dxfArr: [],
		type: 'rect',
		partName: 'tableLeg'
	};

	var prof = drawPole3D_4(profPar).mesh;
	prof.rotation.z = Math.PI / 2
	prof.position.x = profPar.poleProfileY / 2;
	prof.position.z = -profPar.poleProfileZ / 2;
	prof.setLayer('racks');
	par.mesh.add(prof);


	var partName = "table";
	var area = rad * rad * Math.PI / 1000000;

	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				name: "Столешница ",
				metalPaint: false,
				timberPaint: true,
				division: "timber",
				workUnitName: "amt",
				group: "carcas",
			}
		}
		name = "Ф" + params.diamTable;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		par.mesh.specParams = { specObj: specObj, amt: 1, area: area, partName: partName, name: name }
	}
	par.mesh.specId = partName + name;

	return par;
}


/** функция отрисовывает водосток - лоток и трубу
	@param height
	@param offset
	@param size
	@param topOffset
	@param len
	@param pipeOffset
	@param side			
Базовая точка - центр верха желоба
**/

function drawDrain(par){
	if(!par) par = {};
	initPar(par)
	
	par.gutterRad = par.size / 2 + 40 //радиус лотка
	
	var sideFactor = 1
	if(par.side == "right") sideFactor = -1
	
	//параметры
	par.turnSize = 20; //размер отвода по прямой от точки пересечения осей
	
	var p0 = {x:0, y:0,}
	
	//сечение водостока
	var pt1 = newPoint_xy(p0, -par.size / 2, -par.size / 2)
	var pt2 = newPoint_xy(p0, -par.size / 2, par.size / 2)
	var pt3 = newPoint_xy(p0, par.size / 2, par.size / 2)
	var pt4 = newPoint_xy(p0, par.size / 2, -par.size / 2)
	
	//создаем шейп
	var shapePar = {
		points: [pt1, pt2, pt3, pt4],
		dxfArr: [],
		dxfBasePoint: par.dxfBasePoint,
		radOut: 20,
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;
	
	if(params.gutter == "круглый"){
		var shape = new THREE.Shape();
		shape.absarc(0, 0, par.size / 2, 0, 2 * Math.PI, true)
	}
	
	
	//точки на оси трубы без учета отводов
	var p1 = newPoint_xy(p0, 0, -par.gutterRad * 0.8);
	var p2 = newPoint_xy(p1, 0, -par.turnSize - par.topOffset);	
	var p3 = newPoint_xy(p2, par.offset * sideFactor, -par.offset);		
	var p4 = newPoint_xy(p1, par.offset * sideFactor, -par.height + par.turnSize + par.gutterRad * 0.8);		
	var p5 = newPoint_xy(p4, -(par.turnSize + 50) * sideFactor, -par.turnSize - 50);
	
	//точки концов отводов
	var p21 = newPoint_xy(p2, 0, par.turnSize);
	var p22 = polar(p2, angleX(p2, p3), par.turnSize * sideFactor);
	var p31 = polar(p3, angle(p2,p3), -par.turnSize * sideFactor);
	var p32 = newPoint_xy(p3, 0, -par.turnSize);
	var p41 = newPoint_xy(p4, 0, par.turnSize);
	var p42 = polar(p4, angle(p4, p5) + Math.PI, par.turnSize * sideFactor);
	var p51 = polar(p5, angle(p4, p5) + Math.PI, -50 * sideFactor);
	
	//вспомогательные точки на прямом участке чтобы он был ровный
	var p33 = newPoint_xy(p32, 0, -10);
	var p40 = newPoint_xy(p41, 0, 10);
	
	var points = [p1, p21, p22, p31, p32, p33, p40, p41, p42, p51, p5];
	
	//преобразуем точки в векторы
	var vectorPoints = []
	points.forEach(function(point, i){
		var pt = new THREE.Vector3(point.x, point.y, 0);
		vectorPoints.push(pt)
	});
	
	var path = new THREE.CatmullRomCurve3(vectorPoints);
	
	var extrudeSettings = {
		steps: 200,
		bevelEnabled: false,
		extrudePath: path,
	};

	var geom = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings);
	var pipe = new THREE.Mesh(geom, params.materials.metal);
	pipe.position.z = par.pipeOffset
	par.mesh.add(pipe);
	
	var thk = 1;
	
	//лоток круглый
	
	if(params.gutter == "круглый"){
		var arcPanelPar = {
			rad: par.gutterRad,
			height: par.len,
			thk: thk,
			angle: Math.PI,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
			material: params.materials.metal,
			dxfPrimitivesArr: par.dxfPrimitivesArr
		}		
		var gutter = drawArcPanel(arcPanelPar).mesh;
		gutter.rotation.z = Math.PI
		par.mesh.add(gutter);
	}
	
	//лоток квадратный
	
	if(params.gutter == "квадратный"){
		
		//сечение лотка
		var pt1 = newPoint_xy(p0, -par.gutterRad / 2, 0)
		var pt2 = newPoint_xy(p0, -par.gutterRad / 2, -par.gutterRad * 0.8)
		var pt3 = newPoint_xy(p0, par.gutterRad / 2, -par.gutterRad * 0.8)
		var pt4 = newPoint_xy(p0, par.gutterRad / 2, 0)
		
		var pt41 = newPoint_xy(pt4, -thk, 0)
		var pt31 = newPoint_xy(pt3, -thk, thk)
		var pt21 = newPoint_xy(pt2, thk, thk)
		var pt11 = newPoint_xy(pt1, thk, 0)
		
		pt2.filletRad = pt21.filletRad = pt3.filletRad = pt31.filletRad = 10;
	
		//создаем шейп
		var shapePar = {
			points: [pt1, pt2, pt3, pt4, pt41, pt31, pt21, pt11],
			dxfArr: [],
			dxfBasePoint: par.dxfBasePoint,
			//radOut: 20,
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

		var gutter = new THREE.Mesh(geom, params.materials.metal);
		par.mesh.add(gutter);
		
	}
	
	//данные для спецификации
	

	return par;
}


/** функция отрисовывает коньковый профиль
**/

function drawRidge(par){
	if(!par) par = {};
	initPar(par)
	
	if(!par.len) par.len = partPar.main.len + 50 * 2;
	
	par.size = 50;
	par.thk = 12;
	par.mat = params.materials.plastic_roof;
	if(params.roofMat == "профнастил" || params.roofMat == "металлочерепица"){
		par.size = 200;
		par.thk = 1;
		par.mat = params.materials.metal_roof;
	}
	
	
	//сечение профиля
	var p0 = {x:0, y:0}
	
	var p1 = copyPoint(p0)
	var p2 = polar(p1, params.roofAng / 180 * Math.PI + Math.PI, par.size)
	var p3 = polar(p1, -params.roofAng / 180 * Math.PI, par.size)

	
	var p11 = newPoint_xy(p1, 0, -par.thk * Math.cos(params.roofAng / 180 * Math.PI))
	var p21 = polar(p2, params.roofAng / 180 * Math.PI - Math.PI / 2, par.thk)
	var p31 = polar(p3, -params.roofAng / 180 * Math.PI - Math.PI / 2, par.thk)

	
	p1.filletRad = p11.filletRad = 10;

	//создаем шейп
	var shapePar = {
		points: [p1, p2, p21, p11, p31, p3],
		dxfArr: [],
		dxfBasePoint: par.dxfBasePoint,
		//radOut: 20,
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
	
	
	
	var gutter = new THREE.Mesh(geom, par.mat);
	
	//подогнано
	if(params.roofMat == "профнастил" || params.roofMat == "металлочерепица"){
		var offsetTop = 40;
		if(params.roofMat == "металлочерепица") offsetTop = 50;
		gutter.position.y += offsetTop * Math.cos(params.roofAng / 180 * Math.PI)
	}
		
	par.mesh.add(gutter);
		
	//данные для спецификации
	var partName = "ridgeProf"
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				name: "Коньковый профиль ",
				metalPaint: false,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "roof",
			}
		}
		name = par.size + " L=" + par.len;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["sumLength"] += Math.round(par.len);
		par.mesh.specParams = { specObj: specObj, amt: 1, sumLength: Math.round(par.len), partName: partName, name: name }
	}
	par.mesh.specId = partName + name;

	return par;
}

/** функция отрисовывает винтовую сваю **/
function drawVintPile(par){
	if(!par) par = {};
	initPar(par)
	
	if(!par.len) par.len = 2000;
	if(!par.diam) par.diam = 89;
	if(!par.vintDiam) par.vintDiam = 300;
	
	//тело сваи
	var polePar = {
		poleProfileY: par.diam,
		poleProfileZ: par.diam,
		length: par.len,
		poleAngle: Math.PI / 2,
		type: "round",
		material: params.materials.metal,
	};
	
	var pile = drawPole3D_4(polePar).mesh;
	//pile.rotation.x = Math.PI / 2;
	pile.position.x = par.diam / 2;
	pile.position.y = -par.len;
	pile.position.z = -par.diam / 2;
	pile.setLayer('carcas');
	par.mesh.add(pile);
	
	//винт
	var polePar = {
		poleProfileY: par.vintDiam,
		poleProfileZ: par.vintDiam,
		poleAngle: Math.PI / 2,
		length: 8,
		type: "round",
		material: params.materials.metal,
	};
	
	var vint = drawPole3D_4(polePar).mesh;
	vint.setLayer('carcas');
	vint.position.y = -par.len + 300;
	vint.position.x = par.vintDiam / 2;
	vint.position.z = -par.vintDiam / 2;
	par.mesh.add(vint);
	
	//сохраняем данные для спецификации
	var partName = 'vintPile';
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: 'Винтовая свая',
				metalPaint: false,
				timberPaint: false,
				isModelData: true,
				division: "stock_2",
				purposes: [],
				workUnitName: "amt",
				group: "carcas",
			}
		}
		
		name = "Ф" + par.diam + "х" + par.len;
		
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		par.mesh.specParams = {specObj: specObj, amt: 1, partName: partName, name: name}
	}
	
	par.mesh.specId = partName + name;
	
	return par;
}

/** функция отрисовывает соединитель прогона **/

function drawPurlinConnector(par){
	if(!par) par = {};
	initPar(par)
	
	if(!par.len) par.len = 300;
	if(!par.height) par.height = 60;
	if(!par.width) par.width = 40;
	par.gap = 5;
	
	var polePar = {
		poleProfileY: par.height - par.gap,
		poleProfileZ: par.width - par.gap,
		dxfBasePoint: par.dxfBasePoint,
		length: par.len,
		material: params.materials.metal,
	};
	
	var pole = drawPole3D_4(polePar).mesh;
	pole.position.x = -par.len / 2
	pole.position.y = par.gap / 2
	pole.position.z = par.gap / 2
	pole.setLayer('carcas');
	par.mesh.add(pole);
	

	var boltPar = {
		diam: 6,
		len: 50,
		headType: "пол. гол. крест",
		headShim: true,
		headNut: true,
	}
	
	
	for(var i=0; i<4; i++){
		var bolt = drawBolt(boltPar).mesh;
		bolt.position.x =  -par.len / 2 + 50 + (par.len - 50 * 2) / 3 * i;
		bolt.position.y = par.height / 2;
		bolt.position.z = 18;
		bolt.rotation.x = -Math.PI / 2;
		par.mesh.add(bolt);
	}
	
		
	
	//сохраняем данные для спецификации
	var partName = 'purlinConnector';
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: 'Соединитель прогона',
				metalPaint: false,
				timberPaint: false,
				isModelData: true,
				division: "stock_2",
				purposes: [],
				workUnitName: "amt",
				group: "carcas",
			}
		}
		
		name = par.height + "х" + par.width;
		
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		par.mesh.specParams = {specObj: specObj, amt: 1, partName: partName, name: name}
	}
	
	par.mesh.specId = partName + name;
	
	return par;
}

/** функция отрисовывает блок роликов для сдвижного навеса 
	@param type: single || block - тип блока: с одиночным роликом под круглую трубу или блок из трех роликов под профильный рельс
**/

function drawWeelBlock(par){
	if(!par) par = {};
	initPar(par)
	
	var partPar = calcCarportPartPar();
	
	par.height = partPar.dome.weelBlockHeight; //рабочая высота ролика от верха рельса до верха кронштейна
	par.width = 60; //полная ширина по внешним сторонам ушей
	par.diam = 34; //диаметр ролика в узкой части
	
	if(params.carportType == "купол"){
		//круглый ролик, рисуется горизонтально
		var weelPar = {
			maxDiam: 65,
			minDiam: par.diam,
			grooveDiam: 28,
			width: 45,
			holeDiam: 8,
		}

			
		var p0 = {x:0, y:0} //точка в середине ролика
		
		//рисуем правую половину ролика
		var p1 = newPoint_xy(p0, weelPar.holeDiam / 2, -weelPar.width / 2, )
		var p2 = newPoint_xy(p0, weelPar.maxDiam / 2, -weelPar.width / 2, )
		var p3 = newPoint_xy(p0, weelPar.maxDiam / 2, weelPar.width / 2)
		var p4 = newPoint_xy(p0, weelPar.holeDiam / 2, weelPar.width / 2)
		
		//габариты проточки
		var p21 = newPoint_xy(p0, weelPar.maxDiam / 2, -weelPar.grooveDiam / 2)
		var p22 = newPoint_xy(p0, weelPar.minDiam / 2, -weelPar.grooveDiam / 2)
		var p32 = newPoint_xy(p0, weelPar.minDiam / 2, weelPar.grooveDiam / 2)
		var p31 = newPoint_xy(p0, weelPar.maxDiam / 2, weelPar.grooveDiam / 2)
		
		//p22.filletRad = p32.filletRad = weelPar.grooveDiam / 2 - 1; TODO: Надо доработать drawShapeByPoints2 чтобы скругления нормально строились для внутренних углов
		
	/*	
		//создаем шейп
		var shapePar = {
			points: [p1, p2, p21, p22, p32, p31, p3, p4],
			dxfArr: [],
			dxfBasePoint: par.dxfBasePoint,
		}
		
		var shape = drawShapeByPoints2(shapePar).shape;
		
		
		var extrudeOptions = {
			amount: 10,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};
		
		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	*/

		var points = [p1, p2, p21, p22, p32, p31, p3, p4];
		var geom = new THREE.LatheGeometry(points, 36, 2, 2 * Math.PI);
			
		var weel = new THREE.Mesh(geom, params.materials.whitePlastic);
		weel.rotation.z = Math.PI / 2
		par.mesh.add(weel)
		
		
		//вертикальные уши
		var holderPar = {
			width: 40, //ширина вертикального уха
			height: 60,
			offset: 20,
			thk: 4,
			flanLen: 80, //длина верхнего фланца
		}
		
		holderPar.height = par.height - weelPar.minDiam / 2 + holderPar.offset;

		var p1 = newPoint_xy(p0, -holderPar.width / 2, -holderPar.offset, )
		var p2 = newPoint_xy(p1, 0, holderPar.height, )
		var p3 = newPoint_xy(p2, holderPar.width, 0)
		var p4 = newPoint_xy(p3, 0, -holderPar.height)
		
		p1.filletRad = p4.filletRad = 18
		
		var shapePar = {
			points: [p1, p2, p3, p4],
			dxfArr: [],
			dxfBasePoint: par.dxfBasePoint,
		}
		
		var shape = drawShapeByPoints2(shapePar).shape;
		
		addRoundHole(shape, par.dxfArr, p0, 4, par.dxfBasePoint)

		
		var extrudeOptions = {
			amount: holderPar.thk,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};
		
		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);		
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		
		var holder = new THREE.Mesh(geom, params.materials.metal);
		holder.rotation.y = Math.PI / 2
		holder.position.x = -par.width / 2
		par.mesh.add(holder)
		
		var holder = new THREE.Mesh(geom, params.materials.metal);
		holder.rotation.y = Math.PI / 2
		holder.position.x = par.width / 2 - holderPar.thk
		par.mesh.add(holder)
		
		//верхний фланец
		var flanWidth = par.width - holderPar.thk * 2
		var holeOffset = 10
		var flanPar = {
			height: holderPar.flanLen,
			width: flanWidth,
			thk: holderPar.thk,
			cornerRad: 10,
			holeRad: 4,
			noBolts: true,
			dxfPrimitivesArr: par.dxfArr,
			dxfBasePoint: par.dxfBasePoint,
			roundHoleCenters: [
				{x: flanWidth / 2, y: holeOffset },
				{x: flanWidth / 2 , y: holderPar.flanLen - holeOffset},
			],
		}
		
		var flan = drawRectFlan2(flanPar).mesh;
		flan.rotation.x = -Math.PI / 2;
		flan.position.y = par.height - weelPar.minDiam / 2 - holderPar.thk
		flan.position.x = -flanPar.width / 2;
		flan.position.z = flanPar.height / 2;
		par.mesh.add(flan);
	
		
	}
	
	if(params.carportType == "сдвижной"){
		
	}
	
	
	
	//сохраняем данные для спецификации
	var partName = 'weelBlock';
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: 'Ролик с кронштейном',
				metalPaint: true,
				timberPaint: false,
				isModelData: true,
				division: "metal",
				purposes: [],
				workUnitName: "amt",
				group: "carcas",
			}
		}
		
		name = "Ф" + weelPar.maxDiam + " h=" + par.height;
		
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		par.mesh.specParams = {specObj: specObj, amt: 1, partName: partName, name: name}
	}
	
	par.mesh.specId = partName + name;
	
	par.weelPar = weelPar
	
	return par;
}

/** функция отрисовывает кольцо основания для купольного навеса */

function drawBaseRing(par){
	if(!par) par = {};
	initPar(par)
	
	par.dxfArr = dxfPrimitivesArr
	par.diam = par.rad * 2;
	
	var partPar = calcCarportPartPar();
	
	par.thk = partPar.dome.baseThk;
	
	par.railBaseWidth = 100;
	if(par.railDiam) par.railBaseWidth = (par.railDiam - par.diam) / 2
	if(par.isMovable) par.railBaseWidth = 60;
	
	par.ringWidth = 100;
	par.railDiam = par.diam + par.railBaseWidth * 2;
	par.extraAngle = (partPar.dome.overlayAng + 1) / 180 *  Math.PI; //угол нахлеста двери
	par.railAngle = params.doorAng * 2 / 180 * Math.PI + par.extraAngle * 2 ;
	par.tubeDiam = partPar.dome.tubeDiam
	
	par.railStartAng = -Math.PI / 2 - par.extraAngle;
	par.railEndAng = par.railStartAng + par.railAngle;
	
	if(par.isMovable){
		par.extraAngle = 0;
		par.railStartAng = 0;
		par.railEndAng = par.angle;
		//par.railDiam = par.diam - par.railBaseWidth * 2;
	}
	
	var shape = new THREE.Shape();
	var p0 = {x: 0, y: 0} //центр дуг
	
	//нижний внутренний угол
	var p1 = polar(p0, par.railStartAng, par.diam / 2);
	//нижний внешний угол
	var p2 = polar(p0, par.railStartAng, par.railDiam / 2);
	//верхний внешний угол
	var p3 = polar(p0, par.railEndAng, par.railDiam / 2);
	//верхний нижний угол
	var p4 = polar(p0, par.railEndAng, par.diam / 2);

	if(!par.layer) par.layer = "parts";
	
	//неподвижное кольцо
	if(!par.isMovable){
		if(par.railAngle < Math.PI * 1.8){
			addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint, par.layer);
			addArc2(shape, par.dxfArr, p0, par.diam / 2,  par.railStartAng, par.railEndAng, false, par.dxfBasePoint, par.layer);
			
			addLine(shape, par.dxfArr, p2, p1, par.dxfBasePoint, par.layer);
			addArc2(shape, par.dxfArr, p0, par.railDiam / 2, par.railEndAng, par.railStartAng, false, par.dxfBasePoint, par.layer);
		}
		else {
			addArc2(shape, par.dxfArr, p0, par.railDiam / 2, Math.PI * 1.99999, 0, false, par.dxfBasePoint, par.layer);
		}
		
		addRoundHole(shape, par.dxfArr, p0, par.diam / 2 - par.ringWidth, par.dxfBasePoint); 
	}
	//подвижное кольцо
	/*
		var arcPanelPar = {
		rad: baseRing.rad,
		height: 8,
		thk: 100,
		angle: Math.PI * 1.999,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
		material: params.materials.metal,
		partName: 'progonProf',
		dxfPrimitivesArr: dxfPrimitivesArr,
	}
	*/
	
	if(par.isMovable){		
		addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint, par.layer);
		addArc2(shape, par.dxfArr, p0, par.railDiam / 2, par.railEndAng, par.railStartAng, false, par.dxfBasePoint, par.layer);
		addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint, par.layer);
		addArc2(shape, par.dxfArr, p0, par.diam / 2, par.railEndAng, par.railStartAng,  true, par.dxfBasePoint, par.layer);
	}


	
	var treadExtrudeOptions = {
		amount: par.thk, 
		bevelEnabled: false,
		curveSegments: 72,
		steps: 1
	};
		
	var geom = new THREE.ExtrudeGeometry(shape, treadExtrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var plate = new THREE.Mesh(geom, params.materials.metal);
	par.mesh.add(plate)
	
	//рельс
	if(!par.isMovable){
		var geom = new THREE.TorusGeometry(par.railDiam / 2, par.tubeDiam / 2, 18, 72, par.railAngle);
		var rail = new THREE.Mesh(geom, params.materials.metal);
		rail.rotation.z = par.railStartAng
		rail.position.z = par.tubeDiam / 2 + par.thk
		par.mesh.add(rail)
	}
	//сохраняем данные для спецификации
	var partName = 'baseRing';
	if(par.isMovable) partName = 'doorBaseRing';
	
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: 'Основание павильона',
				metalPaint: true,
				timberPaint: false,
				isModelData: true,
				division: "metal",
				purposes: [],
				workUnitName: "amt",
				group: "carcas",
			}
		}
		if(par.isMovable) specObj[partName].name = "Основание двери"
		name = "Ф" + Math.round(par.diam);
		
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		par.mesh.specParams = {specObj: specObj, amt: 1, partName: partName, name: name}
	}
	
	par.mesh.specId = partName + name;
	
	return par;
}