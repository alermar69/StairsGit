class Table extends AdditionalObject {
	constructor(par) {
		super(par);

		var basePar = {
			dxfBasePoint: {x: 0,y: 0},
			model: this.par.baseModel,
			width: this.par.width - this.par.sideOverhang * 2,
			height: this.par.height - this.par.countertopThk,
			len: this.par.len - this.par.frontOverhang * 2,
		}

		var base = drawTableBase(basePar).mesh;
		this.add(base);
		
		var topPar = {
			dxfBasePoint: {x: 2000, y: 0},
			geom: this.par.tableGeom,
			model: this.par.countertopModel,
			cornerRad: this.par.cornerRad,
			width: this.par.width,
			len: this.par.len,
			thk: this.par.countertopThk,
			partsGap: this.par.partsGap,
		}
		// debugger;
		var top = drawTableCountertop(topPar).mesh;
		top.position.y = this.par.height;
		this.add(top);
	}

	static calcPrice(par){
		var meshPar = par.meshParams;
		var cost = 0;

		//дерево
		// var model = $row.find(".model").val();
		// var area = $row.find(".len").val() * $row.find(".width").val() / 1000000;
		// var vol = area * $row.find(".thk").val() / 1000;
		// var timberType = $row.find(".timberType").val();
		// var m3Cost = calcTimberParams(timberType).m3Price;
		// if(model == "слэб цельный") m3Cost = 200000;
		// if(model == "шпон") m3Cost = 100000;
		
		
		// var timberCost = vol * m3Cost;
		// var workCost = 0;
		
		// //упрощенный расчет стоимости работы
		// if(type == "изготовление столешницы") {
		// 	timberCost = 0;
		// 	workCost = 5000 + area * 1000;
		// }
		
		// //покраска
		// var paintCost = calcTimberPaintPrice(params.timberPaint, timberType) * area * 1.5; //1.5 учитывает торцы и низ
		
		// //река
		// var riverWidth = $row.find(".riverWidth").val();
		// var riverArea = $row.find(".riverWidth").val() * $row.find(".len").val() / 1000000;
		// var resinVol = riverArea * $row.find(".thk").val();
		// if(type == "изготовление столешницы") resinVol = $row.find(".resinVol").val();
		// if(model == "слэб + смола непрозр.") resinVol *= 0.5 //к-т учитывает заполнитель
	
		// var riverCost = 0;
		// var resinLiterCost = 1500;
		// if(model == "слэб + смола прозр." || model == "слэб + смола непрозр." || type == "изготовление столешницы") {
		// 	riverCost += riverArea * resinVol * resinLiterCost;				
		// }
		// if(model == "слэб + стекло") riverCost += riverArea * 12000 + 2000; //12к - цена стекла за м2, 2к - работа по фрезеровке 
	
		// cost += timberCost + workCost + paintCost + riverCost;
		
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
					"type": "select"
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
					"type": "select"
				},
				{
					"key": "baseModel",
					"title": "Модель:",
					"values": [
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
					"type": "select"
				},
				{
					"key": "width",
					"title": "Ширина:",
					"default": 600,
					"type": "number"
				},
				{
					"key": "len",
					"title": "Длина:",
					"default": 1200,
					"type": "number"
				},
				{
					"key": "height",
					"title": "Высота:",
					"default": 750,
					"type": "number"
				},
				{
					"key": "countertopThk",
					"title": "Толщина:",
					"default": 40,
					"type": "number"
				},
				{
					"key": "partsGap",
					"title": "Зазор между частями столешницы:",
					"default": 10,
					"type": "number"
				},
				{
					"key": "cornerRad",
					"title": "Радиус скругления углов:",
					"default": 20,
					"type": "number"
				},
				{
					"key": "edgeRad",
					"title": "Радиус скругления кромок:",
					"default": 3,
					"type": "number"
				},
				{
					"key": "sideOverhang",
					"title": "Свес столешницы боковой:",
					"default": 50,
					"type": "number"
				},
				{
					"key": "frontOverhang",
					"title": "Свес столешницы передний/задний:",
					"default": 100,
					"type": "number"
				}
			]
		}
	}
}