class Column extends AdditionalObject {
	constructor(par) {
		super(par);

		var colParams = {
			dxfArr: [],
			dxfBasePoint: {
			  x: 0,
			  y: 0
			},
			material: this.material,
			colLength: this.par.length,
			posX: 0,
			posY: 0,
			posZ: 0,
			posAng: 0,
			dontAddToSpec: !this.calc_price,
			additionalObjectId: this.objId
		};

		//размеры профиля
		var profPar = getProfParams(this.par.columnProf)
		colParams.profWidth = profPar.sizeA;
		colParams.profHeight = profPar.sizeB;
		
		colParams = drawColumn2(colParams);
		colParams.mesh.position.y = this.par.length; //ноль колонны - центр верхнего отверстия
		
		this.add(colParams.mesh);
	}

	static calcPrice(par){
		var dopSpec = partsAmt_dop[par.id];
		var cost = 0;
		if (dopSpec) {
			var columnLength = getPartPropVal('column', 'sumLength', dopSpec) / 1000;
			console.log('columnLength: ' + columnLength);
			cost = calcColumnPrice({
				columnLength: columnLength,
				columnAmt: 1,
				columnModel: par.meshParams.columnProf
			})
			console.log('columnCost: ' + cost);
		}
		return {
			name: par.name || this.getMeta().title,
			cost: cost,
			priceFactor: par.priceFactor || 1,
			costFactor: par.costFactor || 1
		}
	}

	/** STATIC **/
	static getMeta() {
		return {
			title: 'Колонна',
			inputs: [
				{
					key: 'length',
					title: 'Длинна',
					default: 500,
					type: 'number'
				},
				{
					key: 'columnProf',
					title: 'Профиль',
					default: '100х50',
					values: [
						{
							value: '100х50',
							title: '100х50'
						},
						{
							value: '100х100',
							title: '100х100'
						},
						{
							value: '60х60',
							title: '60х60'
						},
						{
							value: '80х40',
							title: '80х40'
						},
						{
							value: '80х80',
							title: '80х80'
						},
					],
					type: 'select'
				},
			]
		}
	}
}