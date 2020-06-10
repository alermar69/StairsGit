class Columns extends AdditionalObject {
	constructor(par) {
		super(par);
		var obj = this;

		var colParams = {
			dxfArr: [],
			dxfBasePoint: {
			  x: 0,
			  y: 0
			},
			material: this.material,
			posX: 0,
			posY: 0,
			posZ: 0,
			posAng: 0,
			dontAddToSpec: !this.calc_price,
			additionalObjectId: this.objId
		};
		
		var meta = Columns.getMeta();
		meta.inputs.forEach(function(input){
			colParams[input.key] = obj.par[input.key];
		})
		
		colParams = drawColArray(colParams);
/*
		//размеры профиля
		var profPar = getProfParams(this.par.columnProf)
		colParams.profWidth = profPar.sizeA;
		colParams.profHeight = profPar.sizeB;
		
		colParams = drawColumn2(colParams);
		colParams.mesh.position.y = this.par.length; //ноль колонны - центр верхнего отверстия
*/		
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
			title: 'Колонны',
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
				
				{
					key: 'len',
					title: 'Длина массива',
					default: 2000,
					type: 'number'
				},
				
				{
					key: 'amtLen',
					title: 'Кол-во по длине',
					default: 3,
					type: 'number'
				},
				
				{
					key: 'width',
					title: 'Ширина',
					default: 1000,
					type: 'number'
				},
				
				{
					key: 'amtWidth',
					title: 'Кол-во по ширине',
					default: 2,
					type: 'number'
				},
				
			]
		}
	}
}

function drawColArray(par){
	console.log(par)
	par.mesh = new THREE.Object3D();
		
	//размеры профиля
	var profPar = getProfParams(par.columnProf)
	
	var colParams = {
		profWidth: profPar.sizeA,
		profHeight: profPar.sizeB,
		colLength: par.length,
		dxfArr: [],
		dxfBasePoint: {x:0, y:0},
	}
	
	var stepLen = par.len / par.amtLen;
	var stepWidth = par.width / par.amtLen;
	
	for(var i=0; i<par.amtLen; i++){
		for(var j=0; j<par.amtWidth; j++){
			var column = drawColumn2(colParams).mesh;
			
			column.position.x = stepLen * i;
			column.position.y = par.length; //в функции отрисовки ноль колонны - центр верхнего отверстия
			column.position.z = stepWidth * j;
			
			par.mesh.add(column);
		}
	}
	
	
	
	return par;
}