class Roof extends AdditionalObject{
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
		
		var meta = Roof.getMeta();
		meta.inputs.forEach(function(input){
			sectParams[input.key] = obj.par[input.key];
		})

		sectParams = drawRoofObj(sectParams);

		obj.add(Roof.draw(sectParams).mesh);
	}

	static draw(par){
		return drawRoofObj(par)
	}

	static calcPrice(par){
		var meshPar = par.meshParams;
		var dopSpec = partsAmt_dop[par.id];
		var cost = 0;

		return {
			name: par.name || this.getMeta().title,
			cost: cost,
			priceFactor: meshPar.priceFactor || 1,
			costFactor: meshPar.costFactor || 1
		}
	}

	static getMeta(){
		
		return {
			title: 'Крыша',
			inputs: [
				{
					key: 'roofType',
					title: 'Тип',
					default: 'двухскатная',
					values: [
						{
							value: 'двухскатная',
							title: 'двухскатная'
						},
						{
							value: 'односкатная',
							title: 'односкатная'
						},
						{
							value: 'четырехскатная',
							title: 'четырехскатная'
						},
						],
					type: 'select'
				},
				{
					key: 'len',
					title: 'Длина',
					default: 6000,
					type: 'number'
				},
				{
					key: 'width',
					title: 'Ширина',
					default: 6000,
					type: 'number'
				},
				{
					key: 'height',
					title: 'Высота',
					default: 2000,
					type: 'number'
				},
				
				{
					key: 'sideOffset',
					title: 'Свес сбоку',
					default: 500,
					type: 'number'
				},
				{
					key: 'frontOffset',
					title: 'Свес спереди',
					default: 500,
					type: 'number'
				},
				{
					key: 'thk',
					title: 'Толщина',
					default: 100,
					type: 'number'
				},
			]
		}
	}
}

function drawRoofObj(par){

	if(!par) par = {};
	initPar(par)
	
	//точки на внешнем контуре без учета свеса
	var p1 = {x: 0, y: par.height}
	var p2 = {x: -par.width / 2, y: 0}
	var p3 = {x: par.width / 2, y: 0}
	
	if(par.roofType == "односкатная") p1.x = par.width / 2;
	
	var roofAng = {
		left: angle(p1, p2),
		right: angle(p1, p3),
	}
	
	//точки с учетом свеса
	var p21 = newPoint_x(p2, -par.sideOffset, -roofAng.left);
	var p31 = newPoint_x(p3, par.sideOffset, -roofAng.right);
	if(par.roofType == "односкатная") p31 = newPoint_x(p3, par.sideOffset, roofAng.left);
	
	//точки фронтона
	var leftLine = parallel(p1, p21, -par.thk)
	var rightLine = parallel(p1, p31, -par.thk)
	var p11 = itercectionLines(leftLine, rightLine)
	
	var p22 = leftLine.p2
	var p23 = itercection(leftLine.p1, leftLine.p2, p2, p3)
	
	var p32 = rightLine.p2
	var p33 = itercection(rightLine.p1, rightLine.p2, p2, p3)
		
	//крыша
	var shapePar = {
		points: [p1, p21, p22, p11, p32, p31,],
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
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	
	var roof = new THREE.Mesh(geom, par.material)
	par.mesh.add(roof);
	
	//создаем шейп крыши
	//делаем отступ, чтобы было видно линии
	p11 = newPoint_xy(p11, 0, -5)
	p23 = newPoint_xy(p23, 5, 0)
	p33 = newPoint_xy(p33, -5, 0)

	
	var shapePar = {
		points: [p23, p11, p33],
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint
	}

	
	var shape = drawShapeByPoints2(shapePar).shape;
	
	var extrudeOptions = {
		amount: par.len - par.frontOffset * 2,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

	var fronton = new THREE.Mesh(geom, par.material)
	fronton.position.z = par.frontOffset
	par.mesh.add(fronton);
	
	
	return par;
}//end of drawRoofObj
