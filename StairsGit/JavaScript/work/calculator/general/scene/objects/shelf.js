class Shelf extends AdditionalObject {
	constructor(par) {
		super(par);
		var shelfPar = {
			dxfBasePoint: {x: 0, y: 0},
			shelfPar:{
				"width": this.par.width,
				"depth": this.par.depth,
				"height": this.par.height,
				"shelfAmt": this.par.shelfAmt,
				"shelfThk": this.par.shelfThk,
				"sideOverhang": this.par.sideOverhang,
				"cornerRad": this.par.cornerRad,
				"edgeRad": this.par.edgeRad,
				"timberType": "не указано",
				"timberPaint": "не указано",
				"surfaceType": "гладкая",
				"fillerType": "не указано",
				"carcasModel": "01",
				"legProf": this.par.legProf,
				"bridgeProf": this.par.bridgeProf,
				"topOffset": this.par.topOffset,
				"botOffset": this.par.botOffset
			}
		}
			
		var shelfObj = drawShelf(shelfPar);
		this.add(shelfObj.carcas);
		this.add(shelfObj.panels);
		this.add(shelfObj.countertop);
	}

	/** STATIC **/
	static getMeta() {
		return {
			title: 'Стеллаж',
			inputs: [
				{
					key: 'priceFactor',
					title: 'К-т на цену',
					default: 1,
					type: 'number'
				},
				{
					key: 'costFactor',
					title: 'К-т на себестоимость',
					default: 1,
					type: 'number'
				},
				{
					type: 'delimeter'
				},
				{
					key: 'height',
					title: 'Высота',
					default: 1500,
					type: 'number'
				},
				{
					key: 'width',
					title: 'Ширина',
					default: 700,
					type: 'number'
				},
				{
					key: 'depth',
					title: 'Глубина',
					default: 400,
					type: 'number'
				},
				{
					key: 'shelfAmt',
					title: 'Кол-во полок',
					default: 4,
					type: 'number'
				},
				{
					key: 'shelfThk',
					title: 'Толщина полок',
					default: 20,
					type: 'number'
				},
				{
					key: 'sideOverhang',
					title: 'Свес сбоку',
					default: 20,
					type: 'number'
				},
				{
					key: 'cornerRad',
					title: 'Радиус углов',
					default: 0,
					type: 'number'
				},
				{
					key: 'edgeRad',
					title: 'Радиус граней',
					default: 3,
					type: 'number'
				},
				{
					key: 'legProf',
					title: 'Профиль ножек',
					default: '20х20',
					type: 'select',
					values: [
						{
							value: '20х20',
							title: '20х20'
						},
						{
							value: '40х40',
							title: '40х40'
						},
						{
							value: '50х50',
							title: '50х50'
						},
						{
							value: '60х60',
							title: '60х60'
						},
						{
							value: '40х20',
							title: '40х20'
						},
						{
							value: '60х30',
							title: '60х30'
						},
						{
							value: '60х40',
							title: '60х40'
						},
						{
							value: '80х40',
							title: '80х40'
						}
					]
				},
				{
					key: 'bridgeProf',
					title: 'Профиль перемычек',
					default: '20х20',
					type: 'select',
					values: [
						{
							value: '20х20',
							title: '20х20'
						},
						{
							value: '40х40',
							title: '40х40'
						},
						{
							value: '50х50',
							title: '50х50'
						},
						{
							value: '60х60',
							title: '60х60'
						},
						{
							value: '40х20',
							title: '40х20'
						},
						{
							value: '60х30',
							title: '60х30'
						},
						{
							value: '60х40',
							title: '60х40'
						},
						{
							value: '80х40',
							title: '80х40'
						}
					]
				},
				{
					key: 'topOffset',
					title: 'Отступ сверху',
					default: 100,
					type: 'number'
				},
				{
					key: 'botOffset',
					title: 'Отступ снизу',
					default: 50,
					type: 'number'
				}
			]
		}
	}
}