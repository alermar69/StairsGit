class Sill extends AdditionalObject {
	constructor(par) {
		super(par);

		var sillPar = Object.assign({modifyKey: 'sill:' + this.objId}, this.par)
		sillPar.dxfBasePoint = {x:0,y:0}
		var drawFunc = drawSillEnv;
		if(this.par.geom == "эркер") drawFunc = drawOriel
		var env = drawFunc(sillPar).mesh;
		
		this.add(env);
		
		//подоконник
		if(this.par.geom != "эркер") {
			var sill = drawSill(sillPar).mesh;
			sill.position.y = this.par.height + 10
			sill.position.z = this.par.wallThk + this.par.frontNose
			this.add(sill);
		}
	}

	static calcPrice(par){
		var meshPar = par.meshParams;
		var cost = 0;
		//столешница
		if (meshPar.sillGeom == 'столешница' || meshPar.sillGeom == 'подоконник') {
			var timberPar = calcTimberParams(params.additionalObjectsTimberMaterial);
			var paintPriceM2 = calcTimberPaintPrice(params.additionalObjectsTimberColor, params.additionalObjectsTimberMaterial)
			console.log(params.additionalObjectsTimberMaterial, timberPar)
			var timberVol = meshPar.width * meshPar.len * meshPar.sillThk / 1000000000;
			var paintedArea = (meshPar.width * meshPar.len + (meshPar.width + meshPar.len) * 2 * meshPar.sillThk) / 1000000
			
			
			var timberCost = timberVol * timberPar.m3Price;
			var timberPaintCost = paintedArea * paintPriceM2;
			console.log(timberCost, timberPaintCost);
			cost = timberCost + timberPaintCost;
		}

		return {
			name: this.getMeta().title,
			cost: cost,
			priceFactor: 1,
			costFactor: 1
		}
	}

	/** STATIC **/

	static formChange(form, data){
		var par = data.meshParams
		
		// console.log(data);
		// form.find('input').hide();
		form.find(".orielRow").hide()
		form.find(".doorPar").hide()
		form.find(".wallPar").show()
		form.find('.holePar').hide();
		if(form.find('[data-propid="geom"]').val() == "эркер") {
			form.find(".orielRow").show()
			form.find(".wallPar").hide()
			var imgName =  "/drawings/sill/oriel/" + form.find('[data-propid="orielType"]').val() + ".png"
			$(form.find(".orielRow td")[0]).html("<td><img style='max-width: 100%;' src='"+imgName+"'></td>");
		}
		//параметры вент. отверстий
		if(form.find('[data-propid="ventHoles"]').val() != "нет") {
			form.find('.holePar').show();
		}
		//параметры балконной двери
		if(form.find('[data-propid="geom"]').val() == "балконное окно" || form.find('[data-propid="geom"]').val() == "подоконный блок") {
			form.find(".doorPar").show()
		}
		
	
		//параметры обстановки по подоконнику

		if (par.envPar == 'авто') {
			form.find('[data-propid="frontNose"]').closest('tr').hide()
			form.find(".envPar").hide()
			//ширина окна			
			var windowWidth = par.len - par.rightNose - par.leftNose
			form.find('[data-propid="windowWidth"]').val(windowWidth)
			
			//свес подоконника спереди
			var frontNose = par.width - par.windowPosZ;
			if(par.geom == "подоконный блок") frontNose = (par.width - par.wallThk) / 2
			form.find('[data-propid="frontNose"]').val(frontNose)
		}
		else{

			form.find('[data-propid="frontNose"]').closest('tr').show()
			form.find(".envPar").show()
			
			//длина подоконника
			var len = par.windowWidth + par.rightNose + par.leftNose
			form.find('[data-propid="len"]').val(len)
			
			//ширина подоконника
			var width = par.windowPosZ + par.frontNose;			
			if(par.geom == "подоконный блок") width = par.wallThk + par.frontNose * 2
			form.find('[data-propid="width"]').val(width)
		}
		getObjPar()
	}

	static getMeta() {
		return {
			title: 'Подоконник',
			inputs: [
				{
					"type": "delimeter",
					"title": "Обстановка"
				},
				{
					"key": "geom",
					"title": "Место установки:",
					"values": [
						{
							"value": "стена",
							"title": "стена"
						},
						{
							"value": "балконное окно",
							"title": "балконное окно"
						},
						{
							"value": "подоконный блок",
							"title": "подоконный блок"
						},
						{
							"value": "эркер",
							"title": "эркер"
						}
					],
					"default": "стена",
					"type": "select"
				},
				{
					"key": "envPar",
					"title": "Размеры:",
					"values": [
						{
							"value": "авто",
							"title": "авто"
						},
						{
							"value": "задаются",
							"title": "задаются"
						},
					],
					"default": "авто",
					"type": "select"
				},
				{
					"type": "row_start",
					"class": 'orielRow'
				},
				{
					"key": "orielType",
					"title": "Тип эркера",
					"not_row": true,
					"values": [
					{
						"value": "01",
						"title": "Тип 1"
					},
					{
						"value": "02",
						"title": "Тип 2"
					},
					{
						"value": "03",
						"title": "Тип 3"
					}
					],
					"default": "01",
					"type": "select"
				},
				{
					"key": "orielSizeA",
					"title": "Размер эркера А",
					"default": 2000,
					"not_row": true,
					"type": "number"
				},
				{
					"key": "orielSizeB",
					"title": "Размер эркера Б",
					"default": 1000,
					"not_row": true,
					"type": "number"
				},
				{
					"key": "orielSizeC",
					"title": "Размер эркера С",
					"default": 1000,
					"not_row": true,
					"type": "number"
				},
				{
					"type": "row_end"
				},
				{
					"key": "geomSide",
					"class": "wallPar envPar",
					"title": "Сторона:",
					"values": [
					{
						"value": "правая",
						"title": "правая"
					},
					{
						"value": "левая",
						"title": "левая"
					}
					],
					"default": "правая",
					"type": "select",
				},
				{
					"key": "sideWall",
					"class": "wallPar envPar",
					"title": "Угловая стена:",
					"values": [
					{
						"value": "нет",
						"title": "нет"
					},
					{
						"value": "справа",
						"title": "справа"
					},
					{
						"value": "слева",
						"title": "слева"
					},
					{
						"value": "две",
						"title": "две стороны"
					}
					],
					"default": "нет",
					"type": "select",
				},
				{
					"key": "windowWidth",
					"class": "wallPar envPar",
					"title": "Ширина окна:",
					"default": 1000,
					"type": "number",					
				  },
				  {
					"key": "windowHeight",
					"class": "wallPar envPar",
					"title": "Высота окна:",
					"default": 1600,
					"type": "number"
				  },
				  {
					"key": "wallSideBevel",
					"class": 'envPar',
					"title": "Скос откоса:",
					"default": 30,
					"type": "number",
				  },
				  {
					"key": "ceilHeight",
					"class": 'envPar',
					"title": "Высота потолка:",
					"default": 2800,
					"type": "number",
				  },
				  {
					"key": "wallThk",
					"class": 'envPar',
					"title": "Толщина стены:",
					"default": 400,
					"type": "number",
				  },
				  {
					"key": "windowPosZ",
					"class": "wallPar envPar",
					"title": "Позиция окна по глубине:",
					"default": 200,
					"type": "number",
				  },
				  {
					"key": "windowOffsetRight",
					"class": "wallPar envPar",
					"title": "Отступ окна справа:",
					"default": 500,
					"type": "number",
				  },
				  {
					"key": "windowOffsetLeft",
					"class": "wallPar envPar",
					"title": "Отступ окна слева:",
					"default": 500,
					"type": "number",
				  },
				  {
					"key": "windowSectAmt",
					"class": "wallPar envPar",
					"title": "Кол-во створок окна:",
					"default": 1,
					"type": "number",
				  },
				  {
					"key": "doorWidth",
					"class": "doorPar envPar",
					"title": "Ширина двери:",
					"default": 1000,
					"type": "number",
				  },
				  {
					"key": "height",
					"class": "envPar",
					"title": "Высота от пола:",
					"default": 800,
					"type": "number"
				  },
				{
					"type": "delimeter",
					"title": "Подоконник"
				},
				{
					"key": "sillGeom",
					"title": "Тип:",
					"values": [
						{
							"value": "подоконник",
							"title": "подоконник"
						},
					],
					"default": "подоконник",
					"type": "select"
				},

				{
					"key": "len",
					"title": "Длина:",
					"default": 800,
					"type": "number"
				},
				{
					"key": "width",
					"title": "Ширина:",
					"default": 300,
					"type": "number"
				},
				{
				  "key": "sillThk",
				  "title": "Толщина:",
				  "default": 40,
				  "type": "number"
				},
				{
				  "key": "frontNose",
				  "title": "Свес спереди:",
				  "default": 100,
				  "type": "number"
				},
				{
				  "key": "rightNose",
				  "title": "Свес справа:",
				  "default": 50,
				  "type": "number"
				},
				{
				  "key": "leftNose",
				  "title": "Свес слева:",
				  "default": 50,
				  "type": "number"
				},

				{
				  "key": "cornerRadRight",
				  "title": "Радиус справа:",
				  "default": 20,
				  "type": "number"
				},
				{
				  "key": "cornerRadLeft",
				  "title": "Радиус слева:",
				  "default": 20,
				  "type": "number"
				},
			
				{
					"key": "ventHoles",
					"title": "Отверстия: ",
					"values": [
						{
							"value": "нет",
							"title": "нет"
						},
						{
							"value": "круглые",
							"title": "круглые"
						},
						{
							"value": "овальные вдоль",
							"title": "овальные вдоль"
						},
						{
							"value": "овальные поперек",
							"title": "овальные поперек"
						},
					],
					"default": "нет",
					"type": "select"
				},
				{
					"key": "ventHolesSize",
					"title": "Размер отверстий:",
					"default": "20",
					"class": "holePar",
					"type": "number"
				},
				{
					"key": "ventHolesLen",
					"title": "Длина отверстий:",
					"default": "50",
					"class": "holePar",
					"type": "number"
				},
				{
					"key": "ventHolesStep",
					"title": "Макс. шаг отверстий:",
					"default": "100",
					"class": "holePar",
					"type": "number"
				},
				{
					"key": "ventHolesFrontOffset",
					"title": "Отступ отверстий спереди:",
					"default": "100",
					"class": "holePar",
					"type": "number"
				},
				{
					"key": "ventHolesSideOffset",
					"title": "Отступ отверстий сбоку:",
					"default": "100",
					"class": "holePar",
					"type": "number"
				},
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