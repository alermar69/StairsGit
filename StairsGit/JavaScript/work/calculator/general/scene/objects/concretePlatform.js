class ConcretePlatform extends AdditionalObject{
	constructor(par){
		super(par);
		if(!par) return;
		var size = this.par.size;
		
		var sectParams = {
			dxfArr: [],
			dxfBasePoint: {
			  x: 0,
			  y: 0
			},
			sectType: this.par.sectType,
			h: this.par.h,
			b: this.par.b,
			stairAmt: this.par.stairAmt,
			turnAngle: this.par.turnAngle,
			offsetIn: this.par.offsetIn,
			sectLen: this.par.sectLen,
			sectWidth: this.par.sectWidth,
			sectWidthS: this.par.sectWidthS,
			sectThk: this.par.sectThk,
			cutSide: this.par.cutSide,
			marshType: this.par.marshType,
			rotX: this.par.rotX,
			posX: 0,
			posY: 0,
			posZ: 0,
			posAng: 0,
			M: this.par.M
		};

		//общие параметры
		sectParams.material = this.material;

		sectParams = drawConcretePlatform(sectParams);

		this.add(sectParams.mesh);
	}

	static getMeta(){
		return {
			title: 'Площадка',
			inputs: [
				{
					key: 'sectLen',
					title: 'Длина',
					default: 1000,
					type: 'number'
				},
				{
					key: 'sectWidth',
					title: 'Ширина в начале',
					default: 900,
					type: 'number'
				},
				
				{
					key: 'sectWidthS',
					title: 'Ширина в конце',
					default: 900,
					type: 'number'
				},
				
				{
					key: 'cutSide',
					title: 'Изменение ширины',
					default: 'справа',
					values: [
						{
							value: 'справа',
							title: 'Справа'
						},
						{
							value: 'слева',
							title: 'Слева'
						},
						{
							value: 'две',
							title: 'Две'
						}
					],
					type: 'select'
				},
				{
					key: 'sectThk',
					title: 'Толщина',
					default: 200,
					type: 'number'
				},
				{
					key: 'rotX',
					title: 'Наклон',
					default: 0,
					type: 'number'
				},
			]
		}
	}
}

function drawConcretePlatform(par){
	
	par.mesh = new THREE.Object3D();
	par.dxfArr = [];
	par.dxfBasePoint = {x:0, y:0};
	par.sectWidth = par.sectWidth * 1.0;
	par.sectWidthS = par.sectWidthS * 1.0;
	par.sectLen = par.sectLen * 1.0;
	
	var treadThickness = par.sectThk;
	var extrudeOptions = {
		amount: treadThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
		};
	
	var deltaWidth = par.sectWidth - par.sectWidthS
	
	var shape = new THREE.Shape();
	var p0 = {x:0, y:0};
	var p1 = newPoint_xy(p0, par.sectWidth, 0);
	if(par.cutSide == "справа") var p2 = newPoint_xy(p1, -deltaWidth, par.sectLen);
	if(par.cutSide == "слева") var p2 = newPoint_xy(p1, 0, par.sectLen);
	if(par.cutSide == "две") var p2 = newPoint_xy(p1, -deltaWidth/2, par.sectLen);
	var p3 = newPoint_xy(p2, -par.sectWidthS, 0);
	
	addLine(shape, par.dxfArr, p0, p1, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p3, p0, par.dxfBasePoint);
	
	//console.log(par)
	// console.log(p0, p1, p2, p3);
	
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));	
	var tread = new THREE.Mesh(geom, par.material);
	tread.rotation.x = -Math.PI / 2
	tread.rotation.y = -par.rotX / 180 * Math.PI
	tread.rotation.z = -Math.PI / 2;
	tread.position.y = -treadThickness;
	par.mesh.add(tread);


	return par;
}//end of drawConcretePlatform
