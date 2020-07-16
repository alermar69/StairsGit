/**Функция отрисовывает прогон с метизами
*/
function drawPurlin(par){
	par.mesh = new THREE.Object3D();

	var polePar = {
		poleProfileY: par.poleProfileY,
		poleProfileZ: par.poleProfileZ,
		dxfBasePoint: par.dxfBasePoint,
		length: par.length,
		poleAngle: 0,
		material: par.material,
		dxfArr: [],
		type: 'rect'
	};

	var purlin = drawPole3D_4(polePar).mesh;
	par.mesh.add(purlin);

	var screwsAmt = Math.round(par.length / 450);
	var step = par.length / screwsAmt;
	for (var i = 0; i < screwsAmt; i++) {
		var shim = drawTermoShim();
		shim.position.x = step / 2 + step * i
		shim.rotation.x = Math.PI / 2;
		shim.position.y = par.poleProfileY / 2;
		shim.position.z = par.poleProfileZ + params.roofThk;
		par.mesh.add(shim);

		var screwPar = {
			id: "roofingScrew_5x32",
			description: "Крепление поликарбоната к профилям",
			group: "Кровля"
		}
			
		var screw = drawScrew(screwPar).mesh;
		screw.position.x = step / 2 + step * i
		screw.rotation.x = -Math.PI / 2;
		screw.position.y = par.poleProfileY / 2;
		screw.position.z = par.poleProfileZ + params.roofThk;
		par.mesh.add(screw);
	};

	var boltPar = {
		diam: 6,
		len: 20,
		headType: 'пол. гол. крест',
		headShim: true,
	}
	
	for (var i = 0; i <= params.sectAmt; i++) {
		var bolt = drawBolt(boltPar).mesh;
		bolt.position.x = params.frontOffset + 10 + i * params.sectLen;
		bolt.position.y = par.poleProfileY / 2;
		bolt.position.z = 0;
		bolt.rotation.x = Math.PI / 2;
		par.mesh.add(bolt);
	
		var bolt = drawBolt(boltPar).mesh;
		bolt.position.x = params.frontOffset - 10 + i * params.sectLen;
		bolt.position.y = par.poleProfileY / 2;
		bolt.position.z = 0;
		bolt.rotation.x = Math.PI / 2;
		par.mesh.add(bolt);
	}

	//сохраняем данные для спецификации
	var partName = 'purlinProf';
	if (typeof specObj != 'undefined' && partName) {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				name: 'Прогон',
				metalPaint: false,
				timberPaint: false,
				isModelData: true,
				division: "metal",
				purposes: [],
				workUnitName: "amt",
				group: "Каркас",
			}
		}
		var name = Math.round(par.poleProfileZ) + "x" + Math.round(par.poleProfileY) + "х" + Math.round(par.length);
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["sumLength"] += par.length / 1000;
		par.mesh.specParams = {specObj: specObj, amt: 1, sumLength: par.length / 1000, partName: partName, name: name}
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
		var name = profLength.toFixed(2);
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
*/

function drawRackFlan(par){
	var flanMesh = new THREE.Object3D();
	par.turnFactor = par.turnFactor || 1;// Для разворота болтов

	var flanHeight = par.isLarge ? 150 : 100;

	var flanAngle = THREE.Math.degToRad(par.flanTopAngle || 30);
	var offset = 100 - par.rackSize;

	var p0 = {x:0,y:0};
	var p1 = newPoint_xy(p0, -par.rackSize / 2, 0);
	var p2 = newPoint_xy(p1, 0, -50);
	var p3 = newPoint_xy(p2, -30 - offset / 2, 0);
	var p4 = newPoint_xy(p3, 0, flanHeight + 54);
	var p5 = polar(p4, flanAngle, 200 / Math.cos(flanAngle));
	var p6 = newPoint_xy(p5, 0, -p5.y);

	var p9 = newPoint_xy(p0, par.rackSize / 2, 0);
	var p8 = newPoint_xy(p9, 0, -150);
	var p7 = newPoint_xy(p8, 30, 0);

	p3.filletRad = p4.filletRad = p5.filletRad = p7.filletRad = 20;

	//создаем шейп
	var shapePar = {
		points: [p0,p1,p2,p3,p4,p5,p6, p7, p8, p9],
		dxfArr: par.dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint
	}

	var shape = drawShapeByPoints2(shapePar).shape;

	if (par.holes && par.holes.length > 0) {
		var holes = [];
		
		par.holes.forEach(function(hole){
			hole.rad = 7;
			holes.push(hole);
		})

		var holesPar = {
			holeArr: holes,
			dxfBasePoint: par.dxfBasePoint,
			shape: shape,
			dxfPrimitivesArr: par.dxfPrimitivesArr
		}
		addHolesToShape(holesPar);
	}


	holesPar.holeArr.forEach(function(hole){
		var boltPar = {
			diam: 12,
			len: 30,
			// headType: 'пол. гол. крест',
			headShim: true,
		}
		
		var bolt = drawBolt(boltPar).mesh;
		bolt.position.x = hole.x;
		bolt.position.y = hole.y;
		bolt.position.z = 0;
		bolt.rotation.x = -Math.PI / 2 * par.turnFactor;
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

	var partName = "rackFlan";
	var box3 = new THREE.Box3().setFromObject(flan);
	var s = ((box3.max.x - box3.min.x) / 1000) * ((box3.max.y - box3.min.y) / 1000);
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				name: "Фланец стойки к ферме",
				metalPaint: false,
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

/** функция отрисовывает фланец крепления поперечной фермы навеса к колонне
*/

function drawTrussFlan(par){
	var flanMesh = new THREE.Object3D();

	var rackSize = par.rackSize - 8;// 8 толщина фланца фермы
	// Отступ от стойки
	var rackOffset = (100 - par.rackSize) / 2 + 20 + 23.5;// 100 - размер стойки(при колонне в 100, зазор между опорой и фланцем 0) 20 от края фермы + 20 для отверстий

	var p0 = {x:0,y:0};
	var p1 = newPoint_xy(p0, rackSize / 2, 0);
	var p2 = newPoint_xy(p1, 0, -50);
	var p3 = newPoint_xy(p2, rackOffset, 0);
	var p4 = newPoint_xy(p3, 0, par.height + 50);
	var p5 = newPoint_xy(p4, -rackSize / 2 - rackOffset, 0);

	p3.filletRad = p5.filletRad = 10;

	//создаем шейп
	var shapePar = {
		points: [p0,p1,p2,p3,p4,p5],
		dxfArr: par.dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;

	var h1 = newPoint_xy(p4, -20, -20);
	var h2 = newPoint_xy(h1, 0, -160);
	h1.rad = h2.rad = 7;

	if (!par.noBolts) {
		var holesPar = {
			holeArr: [h1,h2],
			dxfBasePoint: par.dxfBasePoint,
			shape: shape,
			dxfPrimitivesArr: par.dxfPrimitivesArr
		}
		addHolesToShape(holesPar);
	}

	if (!par.noBolts) {
		holesPar.holeArr.forEach(function(hole){
			var boltPar = {
				diam: 12,
				len: 30,
				// headType: 'пол. гол. крест',
				headShim: true,
			}
			
			var bolt = drawBolt(boltPar).mesh;
			bolt.position.x = hole.x;
			bolt.position.y = hole.y;
			bolt.position.z = 0;
			bolt.rotation.x = Math.PI / 2;
			flanMesh.add(bolt);
		});
	}

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

	var partName = "trussFlan";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				name: "Фланец стойки к продольной ферме",
				metalPaint: false,
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

console.log(par.flanParams.notchRad);

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
				metalPaint: false,
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
	console.log(par)
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

/** функция отрисовывает сектор сферы из поликарбоната
*/

function drawSphereSector(par){
	
	const radius = par.rad;  // ui: radius
	const widthSegments = 1;  // ui: widthSegments
	const heightSegments = 20;  // ui: heightSegments
	const phiStart = 0;  // ui: phiStart
	const phiLength = par.angleWidth;  // ui: phiLength
	const thetaStart = 0;  // ui: thetaStart
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
*/
function drawPolygonRoofSector(par){
	
	var p1 = {x:0, y:0}
	var p2 = polar(p1, -Math.PI / 2 - par.ang / 2, par.edgeLen)
	var p3 = polar(p1, -Math.PI / 2 + par.ang / 2, par.edgeLen)
	
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
	if(!par.dxfBasePoint) par.dxfBasePoint = {x: 0, y: 0};
	if(!par.len) par.len = params.width;
	par.mesh = new THREE.Object3D();
	
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
	}
	
	
	//арочная балка
	if(params.roofType == "Арочная"){		

		arcPar = partPar.main.arcPar;
		if(params.carportType == "сдвижной") {
			var arcPar = {
				a1: par.a1, //угол вектора на центр внешней дуги и точку p1
				sideOffset: 0, //расстояние от нулевой точки к точке botLine.p2
				m1: partPar.rafter.profSize.y, //расстояние от точки botLine.p2 до botLine.p1
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
			rad: arcPar.topArc.rad - beamProfParams.sizeA / 2,
		}
	
		var arcPanelPar = {
			rad: midArc.rad,
			height: beamProfParams.sizeB,
			thk: beamProfParams.sizeA,
			angle: midArc.startAngle - midArc.endAngle,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
			material: params.materials.metal,
			partName: 'carportBeam',
			dxfPrimitivesArr: []
		}
		
console.log(arcPanelPar.rad, par)

		var beam = drawArcPanel(arcPanelPar).mesh;
		beam.rotation.z = midArc.endAngle;
		if (params.carportType == "односкатный") beam.position.x = params.width / 2
		beam.position.y = midArc.center.y
		par.mesh.add(beam)
		
		//параметры верхней дуги для дальнейшего использования
		par.topArc = arcPar.topArc;
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
console.log(counter)	
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
	if(!par.dxfBasePoint) par.dxfBasePoint = {x:0, y:0,}
	if(!par.dxfArr) par.dxfArr = [];
	if(!par.len) par.len = 1000;
	par.mesh = new THREE.Object3D();
	
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
			console.log(p5)
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
				name: "Профлист " + par.thk + " " + params.roofColor,
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
			z: params.sectLen * params.sectAmt - partPar.column.profSize.y,
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
		rafterArrPar.arrSize.z += partPar.truss.thk //фермы внакладку на колонны
	}
	if (params.beamModel == "ферма постоянной ширины") {
		if (params.roofType == "Плоская") {
			//rafterPar.len /= Math.cos(partPar.main.roofAng)
			//rafterArrPar.itemRot = {z: partPar.main.roofAng}
			//rafterArrPar.moove = { y: (rafterPar.len / 2 - 100) * Math.tan(partPar.main.roofAng)}
		}
	}
		
	var rafterArr = drawRectArray(rafterArrPar).mesh;
	rafterArr.setLayer('carcas');
	par.mesh.add(rafterArr);

	//прогоны	
	var amt = 1; //кол-во рядов прогонов
	if(params.beamModel == "проф. труба") amt = rafterArrPar.amt.z - 1;
	if(params.carportType == "двухскатный" && params.roofType != "Арочная") amt = 2;
	
	//параметры одного прогона
	var purlinPar = {
		poleProfileY: partPar.purlin.profSize.x,
		poleProfileZ: partPar.purlin.profSize.y,
		length: partPar.main.len,
		material: params.materials.metal,
		partName: 'purlinProf'
	};
	
	if(params.beamModel == "проф. труба") {
		purlinPar.length = rafterArrPar.step.z - partPar.rafter.profSize.x;
	}

	for(var i=0; i<amt; i++){
	
		if(params.roofType == "Арочная"){
			//параметры массива прогонов
			var topArc = partPar.main.arcPar.topArc;
			if(params.carportType == "сдвижной") topArc = rafterPar.topArc
			
			var arrPar = {
				center: topArc.center,
				rad: topArc.rad - partPar.purlin.profSize.y, //верхняя плоскость прогона вровень с дугой
				drawFunction: drawPole3D_4,
				startAngle: topArc.endAngle,
				endAngle: topArc.startAngle,
				itemAmt: 3,
				itemPar: purlinPar,
				itemWidth: partPar.purlin.profSize.x,
				rot: {y: Math.PI / 2}
			}
			if(params.beamModel != "проф. труба") {
				arrPar.itemAmt = rafterPar.progonAmt + 1;
				arrPar.rad = topArc.rad
			}
			
			//отрисовка массива прогонов
			var purlinArr = drawArcArray(arrPar).mesh;
			purlinArr.rotation.y = Math.PI / 2;
			if(params.beamModel == "проф. труба") {
				purlinArr.position.z = rafterArrPar.step.z * i + purlinPar.length - partPar.main.len / 2 + partPar.rafter.profSize.x;
			}
			if(params.carportType == "сдвижной"){
				purlinArr.position.z = rafterArrPar.step.z * i + purlinPar.length - par.len / 2 + partPar.rafter.profSize.x;
			}
			purlinArr.setLayer('carcas');
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
					x: rafterPar.len,
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
				
				drawFunction: drawPole3D_4,
				itemPar: purlinPar,
			}
			
			if(params.beamModel == "проф. труба") noAlign = true;
			
			//левая сторона
			if(i == 1) {
				purlinArrPar.rot.z = Math.PI - params.roofAng / 180 * Math.PI
			}
			
			var purlinArr = drawRectArray(purlinArrPar).mesh;
			if(params.beamModel == "проф. труба") {
				purlinArr.position.z = rafterArrPar.step.z * i + purlinPar.length - partPar.main.len / 2 + partPar.rafter.profSize.x;
				purlinArr.position.y = partPar.rafter.profSize.y - partPar.purlin.profSize.y
			}
			if(params.beamModel != "проф. труба") {				
				//purlinArr.position.x = partPar.truss.endHeight
				purlinArr.position.y = partPar.truss.endHeight
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
			
			
			purlinArr.setLayer('carcas');
			par.mesh.add(purlinArr);
	
		}
		
		
	}
/*	
	if(params.beamModel == "проф. труба" && params.roofType != "Арочная" && params.carportType == "односкатный"){
		par.mesh.rotation.z = params.roofAng / 180 * Math.PI;
		par.mesh.position.y = params.width / 2 * Math.tan(params.roofAng / 180 * Math.PI)
	}
*/
	
	par.topArc = topArc
	
	//центр массива в точке 0,0
	var box3 = new THREE.Box3().setFromObject(par.mesh);
	par.mesh.position.x -= (box3.max.x + box3.min.x) / 2;
	par.mesh.position.z -= (box3.max.z + box3.min.z) / 2;
	
	return par;
	
} //end of drawRoofCarcas



