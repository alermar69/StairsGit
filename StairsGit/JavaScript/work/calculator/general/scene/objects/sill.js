class Sill extends AdditionalObject {
	constructor(par) {
		super(par);

		var sillPar = Object.assign({}, this.par)
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
		console.log(meshPar)
		//столешница
		if (meshPar.sillGeom == 'столешница' || meshPar.sillGeom == 'подоконник') {
			var timberPar = calcTimberParams(params.additionalObjectsTimberMaterial);
			var paintPriceM2 = calcTimberPaintPrice(params.additionalObjectsTimberColor, params.additionalObjectsTimberMaterial)
			console.log(params.additionalObjectsTimberMaterial, timberPar)
			var timberVol = meshPar.width * meshPar.depth * meshPar.sillThk / 1000000000;
			var paintedArea = (meshPar.width * meshPar.depth + (meshPar.width + meshPar.depth) * 2 * meshPar.sillThk) / 1000000
			
			
			var timberCost = timberVol * timberPar.m3Price;
			var timberPaintCost = paintedArea * paintPriceM2;
			console.log(timberCost, timberPaintCost);
			cost = timberCost + timberPaintCost;
		}
		//подстолье
		if (meshPar.sillGeom =='подстолье') {
			cost = 5000;
			if(meshPar.baseModel.indexOf("S") != -1) cost = 7500;
			if(meshPar.baseModel.indexOf("D") != -1) cost = 15000;
			
			//учитываем размеры
			var profLen = (meshPar.height + meshPar.width) * 2;
			var nominalProfLen = (700 + 600) * 2;
			
			cost = cost * 0.7 + (cost * 0.3 * profLen / nominalProfLen);
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
		console.log(form, data)
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
		if(form.find('[data-propid="ventHoles"]').val() != "нет") {
			form.find('.holePar').show();
		}
		if(form.find('[data-propid="geom"]').val() == "балконное окно" || form.find('[data-propid="geom"]').val() == "подоконный блок") {
			form.find(".doorPar").show()
		}
		if (form.find('[data-propid="sillGeom"]').val() == 'подоконник') {
			form.find('[data-propid="frontEdge"]').closest('tr').hide()
			form.find('[data-propid="baseModel"]').closest('tr').hide()
			form.find('[data-propid="depth"]').closest('tr').hide()
			form.find('[data-propid="countertopDepth"]').closest('tr').hide()
			form.find('[data-propid="width"]').closest('tr').hide()
		}else{
			form.find('[data-propid="frontEdge"]').closest('tr').show()
			form.find('[data-propid="baseModel"]').closest('tr').show()
			form.find('[data-propid="depth"]').closest('tr').show()
			form.find('[data-propid="countertopDepth"]').closest('tr').show()
			form.find('[data-propid="width"]').closest('tr').show()
		}
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
					"class": "wallPar",
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
					"type": "select"
				},
				{
					"key": "sideWall",
					"class": "wallPar",
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
					"type": "select"
				},
				{
					"key": "windowWidth",
					"class": "wallPar",
					"title": "Ширина окна:",
					"default": 1000,
					"type": "number"
				  },
				  {
					"key": "windowHeight",
					"class": "wallPar",
					"title": "Высота окна:",
					"default": 1600,
					"type": "number"
				  },
				  {
					"key": "wallSideBevel",
					"title": "Скос откоса:",
					"default": 30,
					"type": "number"
				  },
				  {
					"key": "ceilHeight",
					"title": "Высота потолка:",
					"default": 2800,
					"type": "number"
				  },
				  {
					"key": "wallThk",
					"title": "Толщина стены:",
					"default": 400,
					"type": "number"
				  },
				  {
					"key": "windowPosZ",
					"class": "wallPar",
					"title": "Позиция окна по глубине:",
					"default": 200,
					"type": "number"
				  },
				  {
					"key": "windowOffsetRight",
					"class": "wallPar",
					"title": "Отступ окна справа:",
					"default": 500,
					"type": "number"
				  },
				  {
					"key": "windowOffsetLeft",
					"class": "wallPar",
					"title": "Отступ окна слева:",
					"default": 500,
					"type": "number"
				  },
				  {
					"key": "windowSectAmt",
					"class": "wallPar",
					"title": "Кол-во створок окна:",
					"default": 1,
					"type": "number"
				  },
				  {
					"key": "doorWidth",
					"class": "doorPar",
					"title": "Ширина двери:",
					"default": 1000,
					"type": "number"
				  },
				  {
					"key": "height",
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
						{
							"value": "столешница",
							"title": "столешница"
						},
						{
							"value": "подстолье",
							"title": "подстолье"
						}
					],
					"default": "подоконник",
					"type": "select"
				},
				{
					"key": "frontEdge",
					"title": "Передний край:",
					"values": [
					{
						"value": "прямой",
						"title": "прямой"
					},
					{
						"value": "живой",
						"title": "живой"
					}
					],
					"default": "прямой",
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
					"key": "depth",
					"title": "Глубина столешницы:",
					"default": 800,
					"type": "number"
				},
				{
					"key": "width",
					"title": "Ширина:",
					"default": 800,
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
				  "key": "countertopDepth",
				  "title": "Глубина столешницы:",
				  "default": 500,
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
				}
			]
		}
	}
}