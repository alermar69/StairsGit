/**Функция отрисовывает прогон с метизами
*/
function drawProgon(par){
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

	var progon = drawPole3D_4(polePar).mesh;
	par.mesh.add(progon);

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
	
	for (var i = 0; i <= params.arcCount; i++) {
		var bolt = drawBolt(boltPar).mesh;
		bolt.position.x = params.rackFaceOffset + 10 + i * params.sectLen;
		bolt.position.y = par.poleProfileY / 2;
		bolt.position.z = 0;
		bolt.rotation.x = Math.PI / 2;
		par.mesh.add(bolt);
	
		var bolt = drawBolt(boltPar).mesh;
		bolt.position.x = params.rackFaceOffset - 10 + i * params.sectLen;
		bolt.position.y = par.poleProfileY / 2;
		bolt.position.z = 0;
		bolt.rotation.x = Math.PI / 2;
		par.mesh.add(bolt);
	}

	//сохраняем данные для спецификации
	var partName = 'progonProfile';
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
				group: "Метизы",
			}
		}
		var name = Math.round(par.poleProfileZ) + "x" + Math.round(par.poleProfileY) + "х" + Math.round(par.length);
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["sumLength"] += par.length / 1000;
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
	}

	shim.setLayer("metis");
	shim.specId = partName;
	
	return shim;
}

/**Функция отрисовывает и добавляет в спецификацию соединительный профиль поликорбаната
*/
function drawPolyConnectionProfile(par){
	var profile = new THREE.Object3D();
	if (par.angle) {
		var profileWidth = 20;
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
	}else{
		var profileWidth = 20;
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
	var arcLength = (par.rad * Math.PI * THREE.Math.radToDeg(par.angle)) / 180;
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
		var name = arcLength.toFixed(2);
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["sumLength"] += arcLength / 1000;
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
	
	// p1.filletRad = p2.filletRad = p3.filletRad = p4.filletRad = 10;

	//создаем шейп
	var shapePar = {
		points: [p1,p2,p3,p4],
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
	}
	flan.specId = partName;
	flanMesh.add(flan);

	return flanMesh;
}
