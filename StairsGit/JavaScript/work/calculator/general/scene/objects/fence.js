class Fence extends AdditionalObject{
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
		
		var meta = Fence.getMeta();
		meta.inputs.forEach(function(input){
			sectParams[input.key] = obj.par[input.key];
		})

		obj.add(Fence.draw(sectParams).mesh);
	}

	static draw(par){
		if(!par) par = {};
		initPar(par);

		var geom = new THREE.BoxGeometry(par.len, par.height, par.thk);
		par.mesh = new THREE.Mesh(geom, par.material);

		return par
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
			title: 'Забор',
			inputs: [
				{
					key: 'fenceType',
					title: 'Тип',
					default: 'плоский',
					values: [
						{
							value: 'плоский',
							title: 'плоский'
						},
						{
							value: 'со столбами',
							title: 'со столбами'
						},
						],
					type: 'select'
				},
				{
					key: 'doorType',
					title: 'Ворота',
					default: 'сдвижные',
					values: [
						{
							value: 'сдвижные',
							title: 'сдвижные'
						},
						{
							value: 'распашные',
							title: 'распашные'
						},
						{
							value: 'нет',
							title: 'нет'
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
					key: 'thk',
					title: 'Толщина',
					default: 60,
					type: 'number'
				},
				{
					key: 'height',
					title: 'Высота',
					default: 2000,
					type: 'number'
				}
			]
		}
	}
}