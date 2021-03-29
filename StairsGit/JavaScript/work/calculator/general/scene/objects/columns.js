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

		this.add(Columns.draw(colParams).mesh);
	}

	static draw(par){
		return drawColArray(par);
	}

	static calcPrice(par){
		var meshPar = par.meshParams;
		var dopSpec = partsAmt_dop[par.id];
		var cost = 0;
		if (dopSpec) {
			var columnLength = getPartPropVal('column', 'sumLength', dopSpec) / 1000;
			cost = calcColumnPrice({
				columnLength: columnLength,
				columnAmt: 1,
				columnModel: par.meshParams.columnProf
			})
		}
		return {
			name: par.name || this.getMeta().title,
			cost: cost,
			priceFactor: meshPar.priceFactor || 1,
			costFactor: meshPar.costFactor || 1
		}
	}

	/** STATIC **/
	static getMeta() {
		return {
			title: 'Колонны',
			inputs: [
				{
					key: 'columnType',
					title: 'Тип',
					default: 'колонны',
					values: [
						{
							value: 'колонны',
							title: 'колонны'
						},
						{
							value: 'ножки',
							title: 'ножки'
						},
					],
					type: 'select',
					"printable": "true",
				},
				
				{
					key: 'length',
					title: 'Длинна',
					default: 500,
					type: 'number',
					"printable": "true",
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
						{
							value: '40х40',
							title: '40х40'
						},
						{
							value: 'Ф60',
							title: 'Ф60'
						},
					],
					type: 'select',
					"printable": "true",
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
				...AdditionalObject.defaultInputs()
			]
		}
	}
}

function drawColArray(par){
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
	
	var drawFunc = drawColumn2;
	if(par.columnType == "ножки") {
		drawFunc = drawTableLeg;
		colParams = {
			type: 'квадратные',
			dxfBasePoint: {x:0, y:0},
			dxfArr: [],
			height: par.length,
			thk: 2,
			profPar: profPar,
			widthFlanTop: 100,
		}
		if(par.columnProf == "Ф60") colParams.type = "круглые"
	}
		
	var offset = 0;
	if (par.offset) offset = par.offset

	
	
	par.posCoumns = []
	
	var stepLen = (par.len - offset * 2) / (par.amtLen - 1);
	var stepWidth = par.width / (par.amtWidth - 1);
	if(par.amtLen < 2) stepLen = 0
	if (par.amtWidth < 2) stepWidth = 0

	for(var i=0; i<par.amtLen; i++){
		for(var j=0; j<par.amtWidth; j++){
			var column = drawFunc(colParams).mesh;
			
			column.position.x = stepLen * i + offset;			
			column.position.y = par.length; //в функции отрисовки ноль колонны - центр верхнего отверстия
			column.position.z = stepWidth * j;
			
			if(par.columnType == "ножки") {
				//ноль в центре массива
				column.position.x += profPar.sizeA / 2 - par.len / 2
				column.position.y = 0
				column.position.z += -profPar.sizeB / 2 - par.width / 2
			}
			par.mesh.add(column);
		}
		par.posCoumns.push(column.position.x + profPar.sizeA / 2)
	}
	
	
	
	return par;
}