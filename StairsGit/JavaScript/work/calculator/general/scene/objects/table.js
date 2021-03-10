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
				objectAmt: par.objectAmt,
				prof: par.baseProf,
				legsAmt: par.legsAmt,
				counterTop: {
					geom: par.tableGeom,
					len: par.len,
					width: par.width,
				},
				legType: par.legType,
				oneSideLegs: par.oneSideLegs,
				objId: par.objId,
				fixingAmt: par.fixingAmt
			}
			if (par.tableGeom == 'круглый') {
				basePar.len =  basePar.width
				basePar.counterTop.len =  basePar.counterTop.width
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
				modifyKey: 'tabletop:' + par.objId,
				objId: par.objId,
				objectAmt: par.objectAmt,
				tableGeom: par.tableGeom,
				resinVol: par.resinVol,
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
		var countertopCost = calcTimberPanelCost(par.meshParams);
		var cost = countertopCost;
		var metalPart = 0;

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
			
			//доля металлического цеха в цене
			metalPart = table_base / cost;			

		}

		return {
			cost: cost,
			tableBase: table_base,
			countertopCost: countertopCost,
			metalPart: metalPart,
		}
	}

	static calcPrice(par){
		var priceParts = this.calcPriceParts(par);
		
		return {
			name: this.getMeta().title,
			cost: priceParts.cost,
			priceFactor: par.meshParams.priceFactor || 1,
			costFactor: par.meshParams.costFactor || 1,
			metalPart: priceParts.metalPart,
		}
	}
	
	static formChange(form, data){
		var par = data.meshParams
		
		//параметры круглого стола
		form.find('[data-propid="len"]').closest('tr').show()
		form.find('[data-propid="frontOverhang"]').closest('tr').show()
		if(par.tableGeom == "круглый") {
			form.find('[data-propid="len"]').closest('tr').hide()
			form.find('[data-propid="frontOverhang"]').closest('tr').hide()
		}

		if(par.baseModel == "T-13") {
			form.find('[data-propid="legType"]').closest('tr').show()
		}else{
			form.find('[data-propid="legType"]').closest('tr').hide()
		}

		if(par.baseModel == "K-1") {
			form.find('[data-propid="fixingAmt"]').closest('tr').show()
		}else{
			form.find('[data-propid="fixingAmt"]').closest('tr').hide()
		}

		if(par.baseModel == "T-20") {
			form.find('[data-propid="legsAmt"]').closest('tr').show()
		}else{
			form.find('[data-propid="legsAmt"]').closest('tr').hide()
		}
		
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

		if (par.cornerRad > 0 && par.cornerRad <= 25) {
			if (par.cornerRad != 3 && par.cornerRad != 6 && par.cornerRad != 12 && par.cornerRad != 25) {
				alert('Радиус скругления может быть только 3,6,12,25 или больше');
			}
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
					},
					{
						"value": "T-20",
						"title": "T-20"
					},
					{
						"value": "K-1",
						"title": "K-1"
					},
					],
					"default": "T-1",
					"type": "select",
					"printable": "true",
				},
				{
					"key": "oneSideLegs",
					"title": "Половина:",
					"values": [
						{
							"value": "да",
							"title": "да"
						},
						{
							"value": "нет",
							"title": "нет"
						}
					],
					"default": "нет",
					"type": "select"
				},
				{
					"key": "legsAmt",
					"title": "Кол-во ног:",
					"values": [
					{
						"value": "4",
						"title": "4"
					},
					{
						"value": "3",
						"title": "3"
					}
					],
					"default": "4",
					"type": "select",
					"printable": "true",
				},
				
				{
					"key": "legType",
					"title": "Тип ножек:",
					"values": [
						{
							"value": "шпильки",
							"title": "шпильки"
						},
						{
							"value": "круглые",
							"title": "круглые"
						},
						{
							"value": "квадратные",
							"title": "квадратные"
						},
					],
					"default": "шпильки",
					"type": "select",
					"printable": "true",
				},
				{
					"key": "fixingAmt",
					"title": "Кол-во кронштейнов:",
					"default": 2,
					"type": "number",
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
				
				{
					"key": "baseProf",
					"title": "Профиль:",
					"values": [
					{
						"value": "авто",
						"title": "авто"
					},
					{
						"value": "40х20",
						"title": "40х20"
					},
					{
						"value": "40х40",
						"title": "40х40"
					},
					{
						"value": "40х60",
						"title": "40х60"
					},
					{
						"value": "40х80",
						"title": "40х80"
					},
					{
						"value": "40х100",
						"title": "40х100"
					},
					{
						"value": "60х30",
						"title": "60х30"
					},
					{
						"value": "60х60",
						"title": "60х60"
					},
					{
						"value": "80х80",
						"title": "80х80"
					},
					{
						"value": "100х50",
						"title": "100х50"
					},
					{
						"value": "100х100",
						"title": "100х100"
					},
					],
					"default": "авто",
					"type": "select",
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