class Pool extends AdditionalObject{
	constructor(par){
		super(par);
		var obj = this;
		
		var sectParams = {
			dxfArr: [],
			dxfBasePoint: {
			  x: 0,
			  y: 0
			},
			posX: 0,
			posY: 0,
			posZ: 0,
			posAng: 0,
			material: obj.material
		};
		
		var meta = Pool.getMeta();
		meta.inputs.forEach(function(input){
			sectParams[input.key] = obj.par[input.key];
		})

		sectParams = drawPool(sectParams);

		obj.add(sectParams.mesh);
	}
	
	static getMeta(){
		
		return {
			title: 'Бассейн',
			inputs: [
				
				{
					key: 'model',
					title: 'Тип',
					default: 'круглый',
					values: [
						{
							value: 'круглый',
							title: 'круглый'
						},
						{
							value: 'прямоугольный',
							title: 'прямоугольный'
						},
						],
					type: 'select'
				},
				{
					key: 'len',
					title: 'Длина (диаметр)',
					default: 3000,
					type: 'number'
				},
				{
					key: 'width',
					title: 'Ширина',
					default: 3000,
					type: 'number'
				},
				{
					key: 'depth',
					title: 'Глубина',
					default: 1200,
					type: 'number'
				},
				{
					key: 'wallThk',
					title: 'Стенка',
					default: 50,
					type: 'number'
				},
				
				{
					key: 'cornerRad',
					title: 'Радиус на углах',
					default: 200,
					type: 'number'
				},
				

			]
		}
	}
}

/** функция отрисовывает бассейн
*/

function drawPool(par){
	par.mesh = new THREE.Object3D();
	var centerPoint = {x:0, y:0}
	var wallShape = new THREE.Shape();
	var floorShape = new THREE.Shape();

	if(par.model == "круглый"){
		addCircle(wallShape, par.dxfArr, centerPoint, par.len / 2, par.dxfBasePoint)
		addCircle(floorShape, par.dxfArr, centerPoint, par.len / 2 - par.wallThk, par.dxfBasePoint)
		
		addRoundHole(wallShape, par.dxfArr, centerPoint, par.len / 2 - par.wallThk, par.dxfBasePoint)
	}
	
	if(par.model == "прямоугольный"){
		var p1 = {x: -par.len / 2, y: -par.width / 2}
		var p2 = {x: -par.len / 2, y: par.width / 2}
		var p3 = {x: par.len / 2, y: par.width / 2}
		var p4 = {x: par.len / 2, y: -par.width / 2}
		
		var p11 = newPoint_xy(p1, par.wallThk, par.wallThk)
		var p21 = newPoint_xy(p2, par.wallThk, -par.wallThk)
		var p31 = newPoint_xy(p3, -par.wallThk, -par.wallThk)
		var p41 = newPoint_xy(p4, -par.wallThk, par.wallThk)
		
		var pointsOut = [p1, p2, p3, p4]
		var pointsIn = [p11, p21, p31, p41]
		par.material.side = THREE.DoubleSide;
		
		var shapePar = {
			points: pointsOut,
			dxfArr: par.dxfArr,
			dxfBasePoint: par.dxfBasePoint,
			radOut: par.cornerRad,
		}
		wallShape = drawShapeByPoints2(shapePar).shape
		
		var shapePar = {
			points: pointsIn,
			dxfArr: par.dxfArr,
			dxfBasePoint: par.dxfBasePoint,
			radOut: par.cornerRad - par.wallThk,
		}
		if(shapePar.radOut < 0) shapePar.radOut = 0;
		floorShape = drawShapeByPoints2(shapePar).shape
		
		wallShape.holes.push(floorShape);
		
	}
	
	var treadThickness = par.sectThk;
	var extrudeOptions = {
		amount: par.depth,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	
	//стенки
	var geom = new THREE.ExtrudeGeometry(wallShape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));	
	var wall = new THREE.Mesh(geom, par.material);
	wall.rotation.x = Math.PI / 2
	wall.position.y = par.depth
	par.mesh.add(wall);

	//дно
	extrudeOptions.amount = par.wallThk;
	var geom = new THREE.ExtrudeGeometry(floorShape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));	
	var floor = new THREE.Mesh(geom, par.material);
	floor.rotation.x = Math.PI / 2
	floor.position.y = par.wallThk
	par.mesh.add(floor);
	
	//лестница
	var ladderPar = {
		height: par.depth + 500,
		width: par.depth * 0.8,
		material: par.material,
	}
	
	var ladder = drawPoolLadder(ladderPar).mesh
	ladder.position.x = -par.width / 2;
	if(par.model == "круглый") ladder.position.x = -par.len / 2;
	
	par.mesh.add(ladder);
	
	return par;
}

/** функция отрисовывает лестницу для бассейна
*/

function drawPoolLadder(par){
	par.mesh = new THREE.Object3D();
	if(!par.dxfArr) par.dxfArr = [];
	if(!par.dxfBasePoint) par.dxfBasePoint = {x:0, y:0};
	par.poleSize = 20;
	par.topWidth = 150;
	
	par.treadThk = 40;
	par.treadWidth = 100;
	par.treadLen = 500;
	var maxRise = 250;
	
	par.stepAmt = Math.ceil(par.height / maxRise);
	par.step = (par.width - par.topWidth) / 2 / (par.stepAmt);
	par.rise = Math.round(par.height / par.stepAmt);
	
	
	
	var p1 = {x: -par.width / 2, y: 0}
	var p2 = {x: -par.topWidth /2, y: par.height}
	var p3 = {x: par.topWidth /2, y: par.height}
	var p4 = {x: par.width / 2, y: 0}
	
	var botLine1 = parallel(p1, p2, -par.poleSize);
	var botLine2 = parallel(p2, p3, -par.poleSize);
	var botLine3 = parallel(p3, p4, -par.poleSize);
	
	var p11 = itercection(p1, newPoint_xy(p1, 100, 0), botLine1.p1, botLine1.p2);
	var p21 = itercection(botLine1.p1, botLine1.p2, botLine2.p1, botLine2.p2);
	var p31 = itercection(botLine2.p1, botLine2.p2, botLine3.p1, botLine3.p2);
	var p41 = itercection(p4, newPoint_xy(p1, 100, 0), botLine3.p1, botLine3.p2);
	
	//скругления
	p2.filletRad = p3.filletRad = 70;
	p21.filletRad = p31.filletRad = p2.filletRad - par.poleSize;
	
	var points = [p1, p2, p3, p4, p41, p31, p21, p11]
	
	var shapePar = {
		points: points,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
	}
	var shape = drawShapeByPoints2(shapePar).shape
	
	var extrudeOptions = {
		amount: par.poleSize,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));	
	
	var stringer = new THREE.Mesh(geom, par.material);
	stringer.position.z = -par.treadLen / 2 - par.poleSize
	par.mesh.add(stringer);
	
	var stringer = new THREE.Mesh(geom, par.material);
	stringer.position.z = par.treadLen / 2
	par.mesh.add(stringer);
	
	//ступени
	var polePar = {
		poleProfileY: par.treadThk,
		poleProfileZ: par.treadWidth,
		dxfBasePoint: par.dxfBasePoint,
		length: par.treadLen,
		poleAngle: 0,
		material: par.material,
		dxfArr: [],
		type: 'rect',
	};

		
	for(var i=0; i<par.stepAmt - 2; i++){
		var tread = drawPole3D_4(polePar).mesh
		tread.rotation.y = Math.PI / 2;
		tread.position.x = par.step * i - par.width / 2;
		tread.position.y = par.rise * (i+1) - polePar.poleProfileY;
		tread.position.z = par.treadLen / 2;
		par.mesh.add(tread)
	}
	
	for(var i=0; i<par.stepAmt - 2; i++){
		var tread = drawPole3D_4(polePar).mesh
		tread.rotation.y = Math.PI / 2;
		tread.position.x = -par.step * (i+1.5) + par.width / 2;
		tread.position.y = par.rise * (i+1) - polePar.poleProfileY;
		tread.position.z = par.treadLen / 2;
		par.mesh.add(tread)
	}
	
	return par;
	
}
