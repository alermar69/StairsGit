class Table extends AdditionalObject {
	constructor(par) {
		super(par);
		
		var objPar = Object.assign({}, this.par)
		this.add(Table.draw(objPar).mesh);

		//подстолье
		if (this.par.baseModel != 'не указано' && this.par.baseModel != 'нет') {
			var basePar = {
				dxfBasePoint: {x: 0,y: 0},
				model: this.par.baseModel,
				width: this.par.width - this.par.sideOverhang * 2,
				height: this.par.height - this.par.countertopThk,
				len: this.par.len - this.par.frontOverhang * 2,
			}
	
			var base = drawTableBase(basePar).mesh;
			this.add(base);
		}
		
		//столешница
		if (this.par.tabletopType != 'нет') {
			var topPar = {
				dxfBasePoint: {x: 2000, y: 0},
				geom: this.par.tableGeom,
				model: this.par.countertopModel,
				cornerRad: this.par.cornerRad,
				width: this.par.width,
				len: this.par.len,
				thk: this.par.countertopThk,
				partsGap: this.par.partsGap,
				modifyKey: 'tabletop:' + this.objId
			}
			// debugger;
			var top = drawTableCountertop(topPar).mesh;
			top.position.y = this.par.height;
			this.add(top);
		}
	}

	static draw(par){
		if(!par) par = {};
		initPar(par);

		return par
	}

	static calcPrice(par){
		var meshPar = par.meshParams;
		var cost = 0;

		//дерево
		var len = meshPar.len
		var width = meshPar.width
		var model = meshPar.tabletopType;
		var area = len * width / 1000000;
		var vol = area * meshPar.countertopThk / 1000;
		var timberType = params.additionalObjectsTimberMaterial;//$row.find(".timberType").val();
		var m3Cost = calcTimberParams(timberType).m3Price;
		// if(model == "слэб цельный") m3Cost = 200000;
		if(model == "шпон") m3Cost = 100000;
		
		var timberCost = vol * m3Cost;
		if (["слэб цельный", "слэб со склейкой","слэб + стекло","слэб + смола непрозр.","слэб + смола прозр."].indexOf(model) != -1) {
			timberCost = meshPar.slabPrice;
		}
		var workCost = 0;
		
		//упрощенный расчет стоимости работы
		// if(type == "изготовление столешницы") {
		// 	timberCost = 0;
		// 	workCost = 5000 + area * 1000;
		// }
		
		//покраска
		var paintCost = calcTimberPaintPrice(params.timberPaint, timberType) * area * 1.5; //1.5 учитывает торцы и низ
		
		//река
		var riverArea = meshPar.riverWidth * len / 1000000;
		var resinVol = riverArea * meshPar.countertopThk
		// if(type == "изготовление столешницы") resinVol = meshPar.resinVol;
		if(model == "слэб + смола непрозр.") resinVol *= 0.5 //к-т учитывает заполнитель
	
		var riverCost = 0;
		var resinLiterCost = 1500;
		if(model == "слэб + смола прозр." || model == "слэб + смола непрозр."){// || type == "изготовление столешницы") {
			riverCost += riverArea * resinVol * resinLiterCost;				
		}
		if(model == "слэб + стекло") riverCost += riverArea * 12000 + 2000; //12к - цена стекла за м2, 2к - работа по фрезеровке 
	
		cost += timberCost + workCost + paintCost + riverCost;
		
		if (meshPar.baseModel != 'не указано') {
			var tableBaseCost = 5000;
			var model = meshPar.baseModel
			if(model.indexOf("S") != -1) tableBaseCost = 7500;
			if(model.indexOf("D") != -1) tableBaseCost = 15000;
			
			//учитываем размеры
			var profLen = (meshPar.height + meshPar.width) * 2;
			var nominalProfLen = (700 + 600) * 2;
	
			cost += tableBaseCost * 0.7 + (tableBaseCost * 0.3 * profLen / nominalProfLen);
		}
		
		return {
			name: this.getMeta().title,
			cost: cost,
			priceFactor: 1,
			costFactor: 1
		}
	}

	static getMeta() {
		return {
			title: 'Стол',
			inputs: [
				{
					"type": "delimeter",
					"title": "Столешница"
				},
				
								{
					"key": "tabletopType",
					"title": "Тип столешницы:",
					"default": "щит",
					"type": "select",
					"values": [
						{
							"value": "щит",
							"title": "щит"
						},
						{
							"value": "шпон",
							"title": "шпон"
						},
						{
							"value": "слэб цельный",
							"title": "слэб цельный"
						},
						{
							"value": "слэб со склейкой",
							"title": "слэб со склейкой"
						},
						{
							"value": "слэб + стекло",
							"title": "слэб + стекло"
						},
						{
							"value": "слэб + смола непрозр.",
							"title": "слэб + смола непрозр."
						},
						{
							"value": "слэб + смола прозр.",
							"title": "слэб + смола прозр."
						},
						{
							"value": "нет",
							"title": "нет"
						},
					],
					"printable": "true",
				},
				
				{
					"key": "tableGeom",
					"title": "Форма:",
					"values": [
						{
							"value": "прямоугольный",
							"title": "прямоугольный"
						},
						{
							"value": "круглый",
							"title": "круглый"
						},
						{
							"value": "овальный",
							"title": "овальный"
						}
					],
					"default": "прямоугольный",
					"type": "select"
				},
				
				{
					"key": "width",
					"title": "Ширина:",
					"default": 600,
					"type": "number",
					"printable": "true",
				},
				{
					"key": "len",
					"title": "Длина:",
					"default": 1200,
					"type": "number",
					"printable": "true",
				},
				{
					"key": "height",
					"title": "Высота:",
					"default": 750,
					"type": "number",
					"printable": "true",
				},
				
				{
					"key": "edgeGeomTop",
					"title": "Фаска сверху:",
					"values": [
						{
							"value": "не указано",
							"title": "не указано"
						},
						{
							"value": "1 ребро",
							"title": "1 ребро"
						},
						{
							"value": "3 ребра",
							"title": "3 ребра"
						},
						{
							"value": "все ребра",
							"title": "все ребра"
						},
						{
							"value": "по чертежу",
							"title": "по чертежу"
						},
						{
							"value": "по шаблону",
							"title": "по шаблону"
						},
						{
							"value": "нет",
							"title": "нет"
						}
					],
					"default": "все ребра",
					"type": "select",
					"printable": "true",
				},

				{
					"key": "edgeModel",
					"title": "Ребра",
					"values": [
						{
							"value": "не указано",
							"title": "не указано"
						},
						{
							"value": "скругление R3",
							"title": "скругление R3"
						},
						{
							"value": "скругление R6",
							"title": "скругление R6"
						},
						{
							"value": "скругление R12",
							"title": "скругление R12"
						},
						{
							"value": "скругление R25",
							"title": "скругление R25"
						},
						{
							"value": "фигурная Ф-1",
							"title": "фигурная Ф-1"
						},
						{
							"value": "фигурная Ф-2",
							"title": "фигурная Ф-2"
						},
						{
							"value": "фигурная Ф-3",
							"title": "фигурная Ф-3"
						},
						{
							"value": "фигурная Ф-4",
							"title": "фигурная Ф-4"
						},
						{
							"value": "фигурная Ф-5",
							"title": "фигурная Ф-5"
						},
						{
							"value": "фигурная Ф-6",
							"title": "фигурная Ф-6"
						},
						{
							"value": "фигурная Ф-7",
							"title": "фигурная Ф-7"
						},
						{
							"value": "фигурная Ф-8",
							"title": "фигурная Ф-8"
						},
						{
							"value": "фаска 6х45гр",
							"title": "фаска 6х45гр"
						},
						{
							"value": "фаска 12х45гр",
							"title": "фаска 12х45гр"
						},
					],
					"printable": "true",
				},

				{
					"key": "countertopModel",
					"title": "Тип:",
					"values": [
					{
						"value": "цельная",
						"title": "цельная"
					},
					{
						"value": "двойная",
						"title": "двойная"
					},
					{
						"value": "двойная с вставкой",
						"title": "двойная с вставкой"
					},
					{
						"value": "нет",
						"title": "нет"
					}
					],
					"default": "цельная",
					"type": "select",
					"printable": "true",
				},
				{
					"key": "sideEdges",
					"title": "Края:",
					"values": [
					{
						"value": "прямые",
						"title": "прямые"
					},
					{
						"value": "живые",
						"title": "живые"
					}
					],
					"default": "прямые",
					"type": "select",
					"printable": "true",
				},
				
				
				{
					"key": "countertopThk",
					"title": "Толщина:",
					"default": 40,
					"type": "number",
					"printable": "true",
				},
				{
					"key": "partsGap",
					"title": "Зазор между частями столешницы:",
					"default": 10,
					"type": "number",
					"printable": "true",
				},
				{
					"key": "cornerRad",
					"title": "Радиус скругления углов:",
					"default": 20,
					"type": "number",
					"printable": "true",
				},
				{
					"key": "riverWidth",
					"type": "number",
					"title": "Ширина реки, мм",
					"default": 150,
					"printable": "true",
				},
				{
					"key": "resinVol",
					"type": "number",
					"title": "Объем заливки, л",
					"default": 1,
					"printable": "true",
				},
				
	//подстолье			
				{
					"type": "delimeter",
					"title": "Подстолье"
				},
				{
					"key": "baseModel",
					"title": "Модель:",
					"values": [
					{
						"value": "нет",
						"title": "нет"
					},
					{
						"value": "не указано",
						"title": "не указано"
					},
					{
						"value": "D-1",
						"title": "D-1"
					},
					{
						"value": "S-1",
						"title": "S-1"
					},
					{
						"value": "S-2",
						"title": "S-2"
					},
					{
						"value": "S-3",
						"title": "S-3"
					},
					{
						"value": "S-4",
						"title": "S-4"
					},
					{
						"value": "S-5",
						"title": "S-5"
					},
					{
						"value": "S-6",
						"title": "S-6"
					},
					{
						"value": "S-7",
						"title": "S-7"
					},
					{
						"value": "S-8",
						"title": "S-8"
					},
					{
						"value": "S-9",
						"title": "S-9"
					},
					{
						"value": "T-1",
						"title": "T-1"
					},
					{
						"value": "T-2",
						"title": "T-2"
					},
					{
						"value": "T-3",
						"title": "T-3"
					},
					{
						"value": "T-4",
						"title": "T-4"
					},
					{
						"value": "T-5",
						"title": "T-5"
					},
					{
						"value": "T-6",
						"title": "T-6"
					},
					{
						"value": "T-7",
						"title": "T-7"
					},
					{
						"value": "T-8",
						"title": "T-8"
					},
					{
						"value": "T-9",
						"title": "T-9"
					},
					{
						"value": "T-10",
						"title": "T-10"
					},
					{
						"value": "T-11",
						"title": "T-11"
					},
					{
						"value": "T-12",
						"title": "T-12"
					},
					{
						"value": "T-13",
						"title": "T-13"
					},
					{
						"value": "T-14",
						"title": "T-14"
					},
					{
						"value": "T-15",
						"title": "T-15"
					},
					{
						"value": "T-16",
						"title": "T-16"
					},
					{
						"value": "T-17",
						"title": "T-17"
					},
					{
						"value": "T-18",
						"title": "T-18"
					}
					],
					"default": "T-1",
					"type": "select",
					"printable": "true",
				},
				{
					"key": "sideOverhang",
					"title": "Свес столешницы боковой:",
					"default": 50,
					"type": "number",
					"printable": "true",
				},
				{
					"key": "frontOverhang",
					"title": "Свес столешницы передний/задний:",
					"default": 100,
					"type": "number",
					"printable": "true",
				},
				
	//цена			
				{
					"type": "delimeter",
					"title": "Цена"
				},
				{
					"key": "slabPrice",
					"title": "Цена слэба",
					"type": "number"
				},
				{
					key: 'priceFactor',
					title: 'К-т на цену',
					default: 1,
					hidden: true,
					type: 'number'
				},
				{
					key: 'costFactor',
					title: 'К-т на себестоимость',
					default: 1,
					hidden: true,
					type: 'number'
				},
				
			]
		}
	}
}