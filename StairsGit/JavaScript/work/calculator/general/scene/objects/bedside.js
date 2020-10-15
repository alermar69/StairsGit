class Bedside extends AdditionalObject {
	constructor(par) {
		super(par);

		this.doorClosed = true;
		this.doorMesh = false;

		var objPar = Object.assign({}, this.par)
		objPar.dxfBasePoint = {x:0,y:0}
		objPar.material = this.material;

		var doorPar = Bedside.draw(objPar);
		if (doorPar.doorMesh) this.doorMesh = doorPar.doorMesh
		this.add(doorPar.mesh);
	}

	toggleDoor() {
		if (this.par.doorExist) {
			if (this.doorClosed) {
				par.mesh.addAnimation('openDoor', 500);
				this.doorClosed = false;
			} else {
				par.mesh.addAnimation('closeDoor', 500)
				this.doorClosed = true;
			}
		}
	}

	animationProgress(animationName, progress) {
		switch (animationName) {
			case 'openDoor':
				this.doorMesh.rotation.y = (-Math.PI / 2) * progress;
				break;
			case 'closeDoor':
				this.doorMesh.rotation.y = -Math.PI / 2 + (Math.PI / 2) * progress;
				break;
		}
	}

	getActions() {
		var actions = [];
		if (this.par.doorExist) {
			actions.push({
				title: 'Открыть/Закрыть',
				function: 'toggleDoor'
			})
		}
		return actions;
	}

	/** STATIC **/

	static draw(par){
		if (!par) par = {}
		initPar(par);
		
		var meshPar = {
			angleTop_wr: 30,
			boxes: [],
			carcasThk_wr: 16,
			depth_wr: par.depth,
			doorsThk_wr: 16,
			dxfBasePoint: {x: 0, y: 0},
			heightLeft_wr: par.height,
			heightRight_wr: par.height,
			sectAmt_wr: 1,
			sections: [],
			topOnlay_wr: "нет",
			width_wr: par.width,
			height: par.height,
			legsHeight: par.legsHeight,
		}
		
		//секции
		var sectPar = {
			type: "открытая",
			width: par.width - meshPar.carcasThk_wr * 2,
		};
		meshPar.sections.push(sectPar)
		
		//ящики
		var drawerHeight = (par.height - meshPar.carcasThk_wr) / par.drawersAmt
		for(var i=0; i<par.drawersAmt; i++){
			var drawerPar = {
					boxCarcasHeight: 120,
					boxDoorPlusBot: -1,
					boxDoorPlusIn: 0,
					boxDoorPlusLeft: meshPar.carcasThk_wr - 2,
					boxDoorPlusRight: meshPar.carcasThk_wr - 2,
					boxDoorPlusTop: -1,
					height: drawerHeight,
					posX: 0,
					posY: drawerHeight * i,
					sect: "1",
					type: "ящик",
					width: 368,
					widthType: "по секции",
				};
				
				//увеличиваем фасад верхнего и нижнего ящика
			//	if(i == par.drawersAmt - 1) drawerPar.boxDoorPlusTop = meshPar.carcasThk_wr - 2
				if(i == 0) drawerPar.boxDoorPlusBot = meshPar.carcasThk_wr - 2
				
				meshPar.boxes.push(drawerPar)
		}
		
		par.mesh.add(drawWardrobe(meshPar).mesh);

	
		return par;
	}
	
	
	static printPrice(par){
		var priceParts = this.calcPriceParts(par);
		var objPrice = this.calcPrice(par);
		var priceCoeff = getPriceCoefficients(objPrice);
		var priceHTML = "";
		if (priceParts.carcas) priceHTML += '<tr><td>Корпус</td><td>' + Math.round(priceParts.carcas * objPrice.priceFactor * priceCoeff.margin) + '</td></tr>';
		if (priceParts.drawers) priceHTML += '<tr><td>Наполнение</td><td>' + Math.round(priceParts.drawers * objPrice.priceFactor * priceCoeff.margin) + '</td></tr>';
		if (priceParts.doors) priceHTML += '<tr><td>Фасады</td><td>' + Math.round(priceParts.doors * objPrice.priceFactor * priceCoeff.margin) + '</td></tr>';

		return priceHTML;
	}

	/**
	 * Расчет цены по пунктам
	 * @param par 
	 */
	static calcPriceParts(par){
		
		var cost = {
			total: 0,
			carcas: 0,
			drawers: 0,
			doors: 0,
		};
		
		//площадь деталей корпуса
		var panelArea = (par.meshParams.height + par.meshParams.width) * par.meshParams.depth / 1000000;
		cost.carcas = panelArea * 2000;
		
		//ножки
		cost.carcas += 200 * 4;
		
		//ящики
		cost.drawers = par.meshParams.drawersAmt * 1000;
		
		//фасады
		var doorsCostM2 = 5000;
		if(par.meshParams.doorsModel == "щит") doorsCostM2 = 5000
		if(par.meshParams.doorsModel == "рамочные массив") doorsCostM2 = 8000
		if(par.meshParams.doorsModel == "рамочные шпон") doorsCostM2 = 7000
		if(par.meshParams.doorsModel == "плоские шпон") doorsCostM2 = 5000
		if(par.meshParams.doorsModel == "плоские эмаль") doorsCostM2 = 6000
		if(par.meshParams.doorsModel == "плоские лдсп") doorsCostM2 = 2000
		cost.doors = par.meshParams.height * par.meshParams.width * doorsCostM2 / 1000000;
		
		$.each(cost, function(item){
			if(item != "total") cost.total += this;
		})

		console.log(cost);
		
		return cost;
	}

	static calcPrice(par){
		return {
			name: this.getMeta().title,
			cost: this.calcPriceParts(par).total,
			priceFactor: 1,
			costFactor: 1
		}
	}

	static getMeta() {
		return {
			title: 'Тумбочка',
			inputs: [
				{
					key: 'model',
					title: 'Модель',
					default: 'ящики',
					values: [
						{
							value: 'ящики',
							title: 'ящики'
						},
						{
							value: 'дверка+полка',
							title: 'дверка+полка'
						},
					],
					type: 'select',
					"printable": "true",
				},
				
				{
					key: 'drawersAmt',
					title: 'Кол-во ящиков',
					default: 3,
					type: 'number',
					"printable": "true",
				},
				
				{
					key: 'height',
					title: 'Высота',
					default: 600,
					type: 'number',
					"printable": "true",
				},
				{
					key: 'width',
					title: 'Ширина',
					default: 400,
					type: 'number',
					"printable": "true",
				},
				{
					key: 'depth',
					title: 'Глубина',
					default: 400,
					type: 'number',
					"printable": "true",
				},
				{
					key: 'doorsModel',
					title: 'Фасады',
					default: 'щит',
					values: [
						{
							value: 'щит',
							title: 'щит'
						},
						{
							value: 'рамочные массив',
							title: 'рамочные массив'
						},
						{
							value: 'рамочные шпон',
							title: 'рамочные шпон'
						},
						{
							value: 'плоские шпон',
							title: 'плоские шпон'
						},
						{
							value: 'плоские эмаль',
							title: 'плоские эмаль'
						},
						{
							value: 'плоские лдсп',
							title: 'плоские лдсп'
						},
						{
							value: 'нет',
							title: 'нет'
						},
					],
					type: 'select',
					"printable": "true",
				},
				{
					key: 'handle',
					title: 'Ручка',
					default: 'нет',
					values: [{
							value: 'нет',
							title: 'нет'
						},
						{
							value: 'скоба',
							title: 'скоба'
						},
					],
					type: 'select',
					"printable": "true",
				},
				
				{
					key: 'legsHeight',
					title: 'Ножки',
					default: 90,
					type: 'number'
				},

				{
					type: 'delimeter',
					"title": "Цена"
				},

				{
					key: 'name',
					title: 'Название',
					default: 'Тумбочка',
					type: 'text'
				},
				...AdditionalObject.defaultInputs()
			]
		}
	}
}