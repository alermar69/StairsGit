class Table extends AdditionalObject {
	constructor(par) {
		super(par);
		
		var objPar = Object.assign({}, this.par)
		objPar.objId = this.objId;
		this.add(Table.draw(objPar).mesh);
	}

	static draw(par){
		if(!par) par = {};
		initPar(par);
		
		//исправляем битые параметры
		var meta = this.getMeta();
		meta.inputs.forEach(function(item){
			if(item.key && par[item.key] == "undefined") {
				par[item.key] = item['default']
			}
		})
		
		//подстолье
		if (par.baseModel != 'не указано' && par.baseModel != 'нет') {
			var basePar = {
				dxfBasePoint: {x: 0,y: 0},
				model: par.baseModel,
				width: par.width - par.sideOverhang * 2,
				height: par.height - par.thk,
				len: par.len - par.frontOverhang * 2,
				objectAmt: par.objectAmt
			}
			console.log(basePar)
	
			var base = drawTableBase(basePar).mesh;
			par.mesh.add(base);
		}
		
		//столешница
		if (par.tabletopType != 'нет') {
			var topPar = {
				dxfBasePoint: {x: 2000, y: 0},
				geom: par.tableGeom,
				type: par.tabletopType,
				cornerRad: par.cornerRad,
				width: par.width,
				len: par.len,
				thk: par.thk,
				partsGap: par.partsGap,
				sideEdges: par.sideEdges,
				riverWidth: par.riverWidth,
				modifyKey: 'tabletop:' + par.objId
			}
			// debugger;
			var top = drawTableCountertop(topPar).mesh;
			top.position.y = par.height;
			par.mesh.add(top);
		}
		par.mesh.userData.setObjectDimensions = true;

		return par
	}

	static printPrice(par){
		var priceParts = this.calcPriceParts(par);
		var objPrice = this.calcPrice(par);
		var priceCoeff = getPriceCoefficients(objPrice);
		var priceHTML = "";
		if (priceParts.tableBase) priceHTML += '<tr><td>Основание</td><td>' + Math.round(priceParts.tableBase * objPrice.priceFactor * priceCoeff.margin) + '</td></tr>';
		if (priceParts.countertopCost) priceHTML += '<tr><td>Столешница</td><td>' + Math.round(priceParts.countertopCost * objPrice.priceFactor * priceCoeff.margin) + '</td></tr>';

		return priceHTML;
	}

	/**
	 * Расчет цены по пунктам
	 * @param par 
	 */
	static calcPriceParts(par){
		var countertopCost = calcCountertopCost(par.meshParams);
		var cost = countertopCost;

		if (par.meshParams.baseModel != 'не указано' && par.meshParams.baseModel != 'нет') {		
			var tableBaseCost = 5000;
			var model = par.meshParams.baseModel
			if(model.indexOf("S") != -1) tableBaseCost = 7500;
			if(model.indexOf("D") != -1) tableBaseCost = 15000;
			
			//учитываем размеры
			var profLen = (par.meshParams.height + par.meshParams.width) * 2;
			var nominalProfLen = (700 + 600) * 2;
			
			var table_base = tableBaseCost * 0.7 + (tableBaseCost * 0.3 * profLen / nominalProfLen);
			cost += table_base
		}
		return {
			cost: cost,
			tableBase: table_base,
			countertopCost: countertopCost
		}
	}

	static calcPrice(par){
		return {
			name: this.getMeta().title,
			cost: this.calcPriceParts(par).cost,
			priceFactor: 1,
			costFactor: 1
		}
	}
	
	static formChange(form, data){
		var par = data.meshParams
		
		//зазор между частями столешницы
		form.find('[data-propid="partsGap"]').closest('tr').hide()
		if(par.width > 600 && (par.tabletopType == "щит" || par.tabletopType == "слэб")) form.find('[data-propid="partsGap"]').closest('tr').show()
		
		//ширина реки
		form.find('[data-propid="riverWidth"]').closest('tr').hide()
		if(par.tabletopType == "слэб + стекло" || par.tabletopType == "слэб + смола") form.find('[data-propid="riverWidth"]').closest('tr').show()
		
		//объем заливки
		form.find('[data-propid="resinVol"]').closest('tr').hide()
		form.find('[data-propid="sideEdges"]').closest('tr').hide()
		if(par.tabletopType.indexOf("слэб") != -1) {
			form.find('[data-propid="resinVol"]').closest('tr').show()
			form.find('[data-propid="sideEdges"]').closest('tr').show()
		}

		getObjPar()
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
							"value": "слэб",
							"title": "слэб"
						},
						{
							"value": "слэб + стекло",
							"title": "слэб + стекло"
						},
						{
							"value": "слэб + смола",
							"title": "слэб + смола"
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
					"key": "len",
					"title": "Длина:",
					"default": 1200,
					"type": "number",
					"printable": "true",
				},
				
				{
					"key": "width",
					"title": "Ширина:",
					"default": 600,
					"type": "number",
					"printable": "true",
				},
								
				{
					"key": "thk",
					"title": "Толщина:",
					"default": 40,
					"type": "number",
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
					"default": "скругление R3",
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
					"key": "partsGap",
					"title": "Зазор между частями столешницы:",
					"default": 10,
					"type": "number",
					"printable": "true",
				},
				{
					"key": "cornerRad",
					"title": "Радиус скругления углов:",
					"default": 3,
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
					"title": "Подстолье:",
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
					"key": "height",
					"title": "Высота:",
					"default": 750,
					"type": "number",
					"class": 'basPar',
					"printable": "true",
				},
				{
					"key": "sideOverhang",
					"title": "Свес столешницы боковой:",
					"default": 50,
					"type": "number",
					"class": 'basPar',
					"printable": "true",
				},
				{
					"key": "frontOverhang",
					"title": "Свес столешницы передний/задний:",
					"default": 100,
					"type": "number",
					"class": 'basPar',
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
					"key": "slabModel",
					"title": "Номер слэба(garmonyc-mebel)",
					"type": "text",
					"class": "slab",
					"printable": "true",
				},
				{
					"key": "getSlabData",
					"title": "Загрузить данные слэба",
					"class": "slab",
					"type": "action"
				},
				...AdditionalObject.defaultInputs()
			]
		}
	}
}