class Wardrobe extends AdditionalObject {
	constructor(par) {
		super(par);

		this.doorMesh = false;
		this.doorMesh2 = false;
		this.doorClosed = true;

		var objPar = Object.assign({}, this.par)
		objPar.objId = this.objId;
		objPar = Wardrobe.draw(objPar);
		this.add(objPar.mesh);

		this.doorMesh = objPar.doorMesh;
		this.doorMesh2 = objPar.doorMesh2;
	}


	toggleDoor() {
		if (this.par.door != 'нет') {
			if (this.doorClosed) {
				this.addAnimation('openDoor', 500);
				this.doorClosed = false;
			} else {
				this.addAnimation('closeDoor', 500)
				this.doorClosed = true;
			}
		}
	}

	animationProgress(animationName, progress) {
		switch (animationName) {
			case 'openDoor':
				if (this.doorMesh) this.doorMesh.rotation.y = (-Math.PI / 2) * progress;
				if (this.doorMesh2) this.doorMesh2.rotation.y = Math.PI - (Math.PI / 2) * progress;
				break;
			case 'closeDoor':
				if (this.doorMesh) this.doorMesh.rotation.y = -Math.PI / 2 + (Math.PI / 2) * progress;
				if (this.doorMesh2) this.doorMesh2.rotation.y = (Math.PI - Math.PI / 2) + (Math.PI / 2) * progress;
				break;
		}
	}

	getActions() {
		var actions = [];
		if (this.par.door != 'нет') {
			actions.push({
				title: 'Открыть/Закрыть дверцу',
				function: 'toggleDoor'
			})
		}
		return actions;
	}

	static formChange(form, data){
		var par = data.meshParams
		if(par.useLoadedData == 'да'){
			form.find('tr.loadedInputs').show()
			form.find('tr:not(.loadedInputs)').hide()
		}else{
			form.find('tr.loadedInputs').hide()
			form.find('tr:not(.loadedInputs)').show()
		}
		form.find('.alwaysVisible').show()

		if (par.useLoadedData != 'да') {
			if (par.legsHeight <= 120) {
				if (par.legsHeight != 80 && par.legsHeight != 120) {
					alert('Высота ножек может быть 80, 120 или больше 120')
				}
			}
		}

		getObjPar();
	}

	static calcPrice(par) {
		var meshParams = par.meshParams;
		var wrParams = getWrParams();
		var dopSpec = partsAmt_dop[par.id];
		var wrPriceParams = calcWrPriceParams(dopSpec, wrParams);

		return {
			name: meshParams.name || this.getMeta().title,
			cost: wrPriceParams.totalPrice.cost,
			priceFactor: meshParams.priceFactor || 1,
			costFactor: meshParams.costFactor || 1
		}
	}

	static draw(par) {
		if (!par) par = {};
		initPar(par);

		if (par.loadedData && par.useLoadedData == 'да') {
			meshPar = par.loadedData;
			var wrPar = drawWR(meshPar);
			par.mesh.add(wrPar.mesh);
			par.doorMesh = wrPar.door1;
			par.doorMesh2 = wrPar.door2;

			return par;
		}

		//общие параметры
		var meshPar = {
			carcasThk_wr: 16,
			doorsThk_wr: 16,
			dxfBasePoint: {
				x: 0,
				y: 0
			},
			sectAmt: 1,
			width_wr: par.width,
			height_wr: par.height,
			depth_wr: par.depth,
			legsHeight_wr: par.legsHeight,
			sections: [],
			boxes: [],
			wrModel: par.wrModel,
			doorsHandles: par.doorsHandles,
			doorsOffset_wr: 20,
			contentThk_wr: 16,
			doorsMat_wr: par.doorsMat_wr
		}

		if (par.wrModel == 'шоколад') {
			// meshPar.carcasMat = 'щит';
			// meshPar.doorsMat = 'щит';
			meshPar.contentMat = 'щит';
			meshPar.sideWall_wr = 'бруски+щит';
			// meshPar.doorsMat_wr = 'составная панель';
			meshPar.sectDoorsType_wr = 'вкладные';
			meshPar.carcasThk_wr = 40;
			meshPar.doorsThk_wr = 20;
		}
		if (par.wrModel == 'лдсп') {
			// meshPar.carcasMat = 'лдсп';
			// meshPar.doorsMat = 'лдсп';
			meshPar.contentMat = 'лдсп';
			meshPar.sideWall_wr = 'панель';
			// meshPar.sectDoorsModel_wr = 'панель';
			meshPar.sectDoorsType_wr = 'накладные';
		}

		meshPar.legsHeight_wr += meshPar.carcasThk_wr;

		var wrDoorType = par.side;

		//наполнение полки

		if (par.contentType == "полки") {
			var shelfPar = {
				boxDoorPlusIn: 0,
				boxType: "полки",
				boxWidth: 1468,
				boxWidthType: "по секции",
				height: par.height,
				itemAmt: par.shelfAmt,
				posX: 0,
				posY: 0,
				sect: "1",
				shelfSideOffset: 0,
				type: "полки",
				width: par.width - meshPar.carcasThk_wr * 2,
				widthType: "по секции",
			};

			meshPar.boxes.push(shelfPar)
		}else if (par.contentType == "ящики") {
			var shelfPar = {
				boxDoorPlusIn: 0,
				boxType: "ящики",
				boxWidth: 1468,
				boxWidthType: "по секции",
				boxDoorPlusRight: -2,
				boxDoorPlusBot: -2,
				boxDoorPlusLeft: -2,
				boxDoorPlusTop: -2,
				height: par.height - meshPar.legsHeight_wr - meshPar.carcasThk_wr,
				itemAmt: par.shelfAmt,
				posX: 0,
				posY: meshPar.legsHeight_wr,
				sect: "1",
				shelfSideOffset: 0,
				type: "ящики",
				width: par.width - meshPar.carcasThk_wr * 2,
				widthType: "по секции",
				boxHandles: 'есть',
				boxCarcasHeight: 120
			};
			if (par.width > 600) shelfPar.boxHandles = 'две'

			meshPar.boxSideGap = 15.5;
			meshPar.boxHandles = par.doorsHandles;
			meshPar.boxes.push(shelfPar);
		}else if (par.contentType == "ящики+полка") {
			var shelfHeight = 200;
			var shelfPar = {
				boxDoorPlusIn: 0,
				boxType: "полки",
				boxWidth: 1468,
				boxWidthType: "по секции",
				height: 0,
				itemAmt: 1,
				posX: 0,
				posY: par.height - shelfHeight - meshPar.carcasThk_wr + 8,
				sect: "1",
				shelfSideOffset: 0,
				type: "полки",
				width: par.width - meshPar.carcasThk_wr * 2,
				widthType: "по секции",
			};

			meshPar.boxes.push(shelfPar)

			var shelfPar = {
				boxDoorPlusIn: 0,
				boxType: "ящики",
				boxWidth: 1468,
				boxWidthType: "по секции",
				boxDoorPlusRight: -2,
				boxDoorPlusBot: -2,
				boxDoorPlusLeft: -2,
				boxDoorPlusTop: -2,
				height: par.height - meshPar.legsHeight_wr - meshPar.carcasThk_wr - shelfHeight,
				itemAmt: par.shelfAmt,
				posX: 0,
				posY: meshPar.legsHeight_wr,
				sect: "1",
				shelfSideOffset: 0,
				type: "ящики",
				width: par.width - meshPar.carcasThk_wr * 2,
				widthType: "по секции",
				boxHandles: 'есть',
				boxCarcasHeight: 120
			};
			if (par.width > 600) shelfPar.boxHandles = 'две'

			meshPar.boxSideGap = 15.5;
			meshPar.boxHandles = par.doorsHandles;
			meshPar.boxes.push(shelfPar);
		}else if(par.contentType == 'тумба'){
			var shelfPar = {
				boxDoorPlusIn: 0,
				boxType: "полки",
				boxWidth: 1468,
				boxWidthType: "по секции",
				height: 0,
				itemAmt: 1,
				posX: 0,
				posY: par.height - 200,
				sect: "1",
				shelfSideOffset: 0,
				type: "полки",
				width: par.width - meshPar.carcasThk_wr * 2,
				widthType: "по секции",
			};

			meshPar.boxes.push(shelfPar)

			if (par.side != 'открытая') {
				var doorType = 'левая дверь';
				if (par.side == 'дверь правая') doorType = 'правая дверь';
				if (par.side == 'две двери') doorType = 'две двери';
				wrDoorType = 'открытая';
				var shelfPar = {
					boxDoorPlusIn: 0,
					boxType: doorType,
					boxWidth: 1468,
					boxWidthType: "по секции",
					height: par.height - 200 - 8 - meshPar.legsHeight_wr,
					itemAmt: 1,
					posX: 0,
					posY: meshPar.legsHeight_wr,
					sect: "1",
					shelfSideOffset: 0,
					type: doorType,
					width: par.width - meshPar.carcasThk_wr * 2,
					widthType: "по секции",
				};
	
				meshPar.boxes.push(shelfPar)
			}
		} else {
			// Копируем объект чтобы не изменять базовый
			var fillingPar = wrFilling[par.contentType];
			// fillingPar.boxes = Object.assign([], fillingPar.boxes);

			meshPar.isTopShelf = fillingPar.isTopShelf;
			if (meshPar.isTopShelf == 'есть') {
				meshPar.topShelfPosY = (par.height - meshPar.carcasThk_wr) * (fillingPar.topShelfPosY / fillingPar.height_wr);
			}

			var boxes = [];
			//  Если есть наполнение, адаптируем под наши размеры
			if (fillingPar.boxes.length > 0) {
				fillingPar.boxes.forEach(function (boxPar) {
					var box = {};
					// Копируем значения по умолчанию из шаблона
					Object.keys(boxPar).forEach(function (key) {
						box[key] = boxPar[key];
					})
					if (box.boxWidthType == 'задается' || box.widthType == 'задается' || box.type == 'перегородка') {
						if (box.type != 'перегородка') {
							if (box.width > fillingPar.width_wr / 2) {
								box.width = par.width * (box.width / fillingPar.width_wr);
							} else {
								box.width = par.width * 0.5 - meshPar.contentThk_wr / 2 - meshPar.carcasThk_wr;
							}
							// box.width = par.width * (box.width / fillingPar.width_wr);
							box.boxWidth = box.width;
						}
						if (box.posX != 0) {
							box.posX = par.width * 0.5 - meshPar.contentThk_wr / 2 - meshPar.carcasThk_wr;
							if (box.type != 'перегородка') box.posX += meshPar.contentThk_wr;
						}
					}
					if (box.boxWidthType == 'по секции') {
						box.width = par.width - meshPar.carcasThk_wr * 2;
					}
					if (box.itemAmt > 1 && box.boxType == 'полки') box.itemAmt = par.shelfAmt;
					box.boxHeight = box.height = (par.height - meshPar.carcasThk_wr) * (box.height / fillingPar.height_wr);
					if (box.posy != 0) box.posY = (par.height - meshPar.carcasThk_wr) * (box.posY / fillingPar.height_wr);
					boxes.push(box);
				})
			}
			meshPar.boxes = boxes;
		}

		//секции
		meshPar.sections = [{
			width: par.width,
			type: wrDoorType,
		}];

		var wrPar = drawWR(meshPar);
		par.mesh.add(wrPar.mesh);
		par.doorMesh = wrPar.door1;
		par.doorMesh2 = wrPar.door2;

		return par;
	}

	static getMeta() {
		return {
			title: 'Шкаф',
			inputs: [
				{
					key: 'useLoadedData',
					title: 'Использовать загруженные данные',
					default: 'нет',
					class: 'alwaysVisible',
					type: 'select',
					values: [{
							value: 'да',
							title: 'Да'
						},
						{
							value: 'нет',
							title: 'Нет'
						}
					]
				},
				{
					key: 'wrModel',
					title: 'Коллекция',
					default: 'шоколад',
					type: 'select',
					values: [{
							value: 'шоколад',
							title: 'шоколад'
						},
						{
							value: 'лдсп',
							title: 'лдсп'
						}
					]
				},
				{
					key: 'doorsMat_wr',
					title: 'Материал фасадов',
					default: 'плоские лдсп',
					type: 'select',
					values:[
						{
							value: "шоколад",
							title: "шоколад"
						},
						{
							value: "рамочные массив",
							title: "рамочные массив"
						},
						{
							value: "рамочные шпон",
							title: "рамочные шпон"
						},
						{
							value: "плоские шпон",
							title: "плоские шпон"
						},
						{
							value: "плоские эмаль",
							title: "плоские эмаль"
						},
						{
							value: "плоские лдсп",
							title: "плоские лдсп"
						},
						{
							value: "фрезерованные эмаль",
							title: "фрезерованные эмаль"
						},
					]
				},
				{
					key: 'height',
					title: 'Высота',
					default: 2000,
					type: 'number',
					"printable": "true",
				},
				{
					key: 'width',
					title: 'Ширина',
					default: 1500,
					type: 'number',
					"printable": "true",
				},
				{
					key: 'depth',
					title: 'Глубина',
					default: 600,
					type: 'number',
					"printable": "true",
				},

				{
					key: 'side',
					title: 'Дверки',
					default: 'открытая',
					type: 'select',
					values: [{
							value: 'открытая',
							title: 'открытая'
						},
						{
							value: 'дверь правая',
							title: 'дверь правая'
						},
						{
							value: 'дверь левая',
							title: 'дверь левая'
						},
						{
							value: 'две двери',
							title: 'две двери'
						},
					]
				},

				{
					key: 'doorsHandles',
					title: 'Ручка',
					default: 'скоба',
					values: [
						{
							value: "скоба",
							title: "скоба"
						},
						{
							value: "кнопка круглая",
							title: "кнопка круглая"
						},
						{
							value: "кнопка квадратная",
							title: "кнопка квадратная"
						},
						{
							value: "рейлинг 96",
							title: "рейлинг 96"
						},
						{
							value: "рейлинг 128",
							title: "рейлинг 128"
						},
						{
							value: "рейлинг 160",
							title: "рейлинг 160"
						},
						{
							value: "нет",
							title: "нет"
						}
					],
					type: 'select',
					"printable": "true",
				},

				{
					key: 'contentType',
					title: 'Наполнение',
					default: 'полки',
					type: 'select',
					values: [{
							value: 'полки',
							title: 'полки'
						},

						{
							value: 'штанга',
							title: 'штанга'
						},

						{
							value: 'штанга+полки',
							title: 'штанга+полки'
						},
						{
							value: 'тумба',
							title: 'тумба'
						},
						{
							value: 'ящики',
							title: 'ящики'
						},
						{
							value: 'ящики+полка',
							title: 'ящики+полка',
						}
					]
				},

				{
					key: 'shelfAmt',
					title: 'Кол-во полок',
					default: 4,
					type: 'number',
					"printable": "true",
				},

				{
					key: 'legsHeight',
					title: 'Ножки',
					default: 80,
					type: 'number'
				},

				{
					key: "wardrobeOrder",
					title: "Номер заказа",
					type: "text",
					class: 'loadedInputs',
					printable: "true",
				},
				{
					key: "getWardrobeOrderData",
					title: "Загрузить данные заказа",
					type: "action",
					class: 'loadedInputs'
				},

				{
					type: 'delimeter',
					title: "Цена"
				},
				{
					key: 'name',
					title: 'Название',
					default: 'Шкаф',
					type: 'text'
				},
				...AdditionalObject.defaultInputs()
			]
		}
	}
}

/**
 * 
 * @param {object} context элемент массива additional_objects - из параметров получаем ид слэба и обратно кладем цену
 */
function getWardrobeOrderData(form, context) {
	var orderName = context.meshParams.wardrobeOrder;
	if (!orderName) {
		alert('Неверный номер заказа');
		return;
	}
	$.ajax({
		dataType: 'json',
		url: '/orders/calc-controller/get-by-ordername/' + orderName,
		type: 'GET',
		success: function (data) {
			if (data.result && data.result == 'error') {
				alert(data.message);
				return;
			}
			if (data.calc_type == "coupe") {
				console.log(data);
				var orderdata = JSON.parse(data.order_data);
				if (orderdata.boxAmt_wr > 0) {
					orderdata.sections = [];
					orderdata.boxes = [];

					for (var i = 0; i < orderdata.sectAmt; i++) {
						orderdata.sections.push({
							width: orderdata['sectWidth' + i],
							type: orderdata['door' + i]
						});
					}

					for (var i = 0; i < orderdata.boxAmt_wr; i++) {
						orderdata.boxes.push({
							sect: orderdata['boxSect' + i],
							boxSect: orderdata['boxSect' + i],
							posX: orderdata['boxPosX' + i],
							posY: orderdata['boxRow' + i],
							height: orderdata['boxHeight' + i],
							type: orderdata['boxType' + i],
							widthType: orderdata['boxWidthType' + i],
							width: orderdata['boxWidth' + i],

							boxPosX: orderdata['boxPosX' + i],
							boxRow: orderdata['boxRow' + i],
							distTop: orderdata['distTop' + i],
							distBot: orderdata['distBot' + i],
							boxWidthType: orderdata['boxWidthType' + i],
							boxWidth: orderdata['boxWidth' + i],
							boxHeight: orderdata['boxHeight' + i],
							boxCarcasHeight: orderdata['boxCarcasHeight' + i],
							shelfSideOffset: orderdata['shelfSideOffset' + i],
							itemAmt: orderdata['itemAmt' + i],
							borderShelfs: orderdata['borderShelfs' + i],
							itemsGap: orderdata['itemsGap' + i],
							boxHandles: orderdata['boxHandles' + i],
							boxType: orderdata['boxType' + i],
							poleStart: orderdata['poleStart' + i],
							poleEnd: orderdata['poleEnd' + i],
							boxDoorPlusIn: orderdata['boxDoorPlusIn' + i],
							boxDoorPlusRight: orderdata['boxDoorPlusRight' + i],
							boxDoorPlusLeft: orderdata['boxDoorPlusLeft' + i],
							boxDoorPlusTop: orderdata['boxDoorPlusTop' + i],
							boxDoorPlusBot: orderdata['boxDoorPlusBot' + i]
						})
						// if (boxPar.sect < 20) boxes.push(boxPar);
					}
					console.log(orderdata.boxes);
				}

				context.meshParams.loadedData = orderdata;
				alert('Данные загружены');
				redrawAdditionalObjects();
			} else {
				alert('Неверный тип расчета!')
			}
		},
		error: function (a, b) {
			console.log(a)
			alertTrouble(b, 'data');
		}
	});
}

function calcBoxDist() {}