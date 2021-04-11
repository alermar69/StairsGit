var hovered = null;
var animations = [];
// var rightClickObject = null;
var partsAmt_dop = {}; //глобальный массив количеств эл-тов для спецификации балюстрады
var lastDxfX = 0; // Координата для dxf от которой рисуем следующий объект

class AdditionalObject extends THREE.Object3D {
	constructor(par) {
		super();

		this.material = {};
		this.color = new THREE.Color(0xcccccc);
		this.par = {};
		this.objId = 0;
		this.type = par.className;

		if(!par) return;

		// Обогощаем объект новыми параметрами
		var itemMeta = eval(par.className).getMeta();
		itemMeta.inputs.forEach(function(inp){
			if (par.meshParams[inp.key] == undefined) {
				par.meshParams[inp.key] = inp.default;
			}
		})

		this.objId = par.id;
		this.par = par.meshParams;

		
		this.calc_price = par.calc_price;
		this.objPar = par;

		if (this.par.color) this.color = new THREE.Color(this.par.color);
		if (window.texturesEnabled && window.location.href.indexOf('/customers/') != -1) {
			this.material = new THREE.MeshMatcapMaterial();
			this.material.color = this.color;
			this.matcapTexture = new THREE.TextureLoader().load("/images/calculator/matcap/mate.png");
			this.material.matcap = this.matcapTexture
		}else{
			this.material = new THREE.MeshLambertMaterial({ color: this.color });
		}

		if (this.calc_price) {
			partsAmt_dop[this.objId] = {unit: par.className};
			specObj = partsAmt_dop[this.objId];
		}else{
			specObj = {};
		}

		this.setLayer(par.layer || 'additionalObject');
		this.objectRowClass = 'additionalObjectRow';
		this.objectRowId = par.id;
	}

	/** События */

	onLeftClick(event) {
		console.log('Left click', this.constructor.getMeta());
	}

	onRightClick() {
		var actions = this.getActions();

		var text = "\
			<a class='dropdown-item moveObject'>Переместить</a>\
			<a class='dropdown-item setObjectInHole'>Вставить в проем</a>\
			<a class='dropdown-item copyObjectContext'>Копировать</a>\
			<a class='dropdown-item removeObject'>Удалить</a>\
		";

		actions.forEach(function (action) {
			text += "<a class='dropdown-item additionalAction' data-function='" + action.function + "'>" + action.title + "</a>"
		});

		$("#objectContextMenu").append(text);
	}

	onHoverEvent(event) {
		if (hovered != this) {
			this.material.color = new THREE.Color(50 / 255, 168 / 255, 157 / 255);
			if (hovered) hovered.onUnHover({});
			hovered = this;
		}
	}

	onUnHover(event) {
		if (hovered == this) {
			this.material.color = this.color;
			hovered = null;
		}
	}

	addAnimation(name, duration) {
		animations.push({
			animationName: name,
			timeStart: new Date().getTime(),
			duration: duration,
			context: this
		});
	}

	animationProgress(animationName, progress) {
		return false;
	}

	getActions() {
		return [];
	}

	getObjectMaterial(material){
		if(!window.textureManager) return this.material
		if (material == 'металл' || this.par.material == 'металл') {
			// var metalType = 'additionalObjectMetal';
			// // if (params.additionalObjectsMetalMaterial == 'хром. сталь' || params.additionalObjectsMetalMaterial ==  'нерж. сталь') metalType = 'inox';
			// // return textureManager.createMaterial({name: metalType, color: getMetalColorId(params.additionalObjectsMetalColor), wireframe: false});
			// if (!params.materials['additionalObjectMetal']) {
			// 	params.materials['additionalObjectMetal'] = textureManager.createMaterial({name: metalType, color: getMetalColorId(params.additionalObjectsMetalColor), wireframe: false});
			// }
			return params.materials['additionalObjectMetal'];
		}
		if (material == 'массив' || this.par.material == 'массив') {
			// if (!params.materials['additionalObjectTimber']) {
			// 	params.materials['additionalObjectTimber'] = textureManager.createMaterial({name: 'additionalObjectTimber', color: getTimberColorId(params.additionalObjectsTimberColor), wireframe: false});
			// }
			return params.materials['additionalObjectTimber'];
		}
	}

	/**
	 * Функция отрисовывает объект
	 */
	static draw(par){
		if(!par) par = {};
		initPar(par);

		console.warn('Функция отрисовки не найдена', par);
		// var mesh = new eval(par.className)();
		// par.mesh.add(mesh);

		return par;
	}

	/** возвращает описание объекта.
	@param - meshParams из объекта additional_objects
	*/
	static getDescr(objPar){
		if(!this) return {html: '', text: ''};
		var par = objPar.meshParams;
		var meta = this.getMeta();
		var title = "";
		if (objPar.name) {
			title = objPar.name
		}else{
			title = meta.title + " №" + objPar.id;
		}
		var html = '<div id="object_description_' + objPar.id + '">';//<table class="form_table" style="max-width: 40%"><tbody>'
		html += getObjetParamsHtml(objPar.id, true);
		var text = title;
		var classItem = eval(objPar.className);

		if (objPar.calc_price && priceObj[objPar.className + '_' + objPar.id]) {
			html += "<h4 class='mt-3 pt-3' style='border-top: 2px solid gray;'>Цена</h4>";
			html += '<table class="form_table" style="max-width: 40%"><tbody>'
			html += '<tr><td>Количество</td><td>' + (par.objectAmt || 1) + '</td></tr>';
			if (classItem.printPrice) {
				html += classItem.printPrice(objPar);
			}
			if (priceObj[objPar.className + '_' + objPar.id].pricePerItem) {
				html += '<tr><td>Цена за штуку</td><td>' + priceObj[objPar.className + '_' + objPar.id].pricePerItem + '</td></tr>';
			}
			html += '<tr><td>Общая цена</td><td>' + priceObj[objPar.className + '_' + objPar.id].price + '</td></tr>';
			html += '</tbody></table>'
		}
		html += '</div>';
		return {html: html, text: text, title: title};
	}

	static calcPrice(par){
		return {
			name: this.getMeta().title,
			cost: 0,
			priceFactor: 1,
			costFactor: 1
		}
	}

	static printPrice(par){
		return ""
	}
	/** STATIC METHODS */

	static onHover(item, event) {
		var parent = AdditionalObject.isChild(item);

		if (hovered && parent != hovered) {
			hovered.onUnHover(event);
		} else {
			if (parent) {
				parent.onHoverEvent(event);
				hovered = parent;
			}
		}
	}

	/**
	 * Обрабатывает данные формы
	 * @param form - дом элемент JQuery (например -  $('#form'))
	 * @param data - параметры объекта
	 */
	static formChange(form, data){
		// console.log(data);
		// form.find('input').hide();
	}

	static onClick(item, event) {
		var parent = AdditionalObject.isChild(item);
		if (parent) {
			if (event.button == 0) parent.onLeftClick(event);
			if (event.button == 2) parent.onRightClick(event);
		}
	}

	static selectIfItemIsChild(item){
		var parent = AdditionalObject.isChild(item);
		if (parent) {
			unselectObject();
			selectObject(parent);
		}
	}

	static isChild(object) {
		if (object instanceof AdditionalObject) return object;

		if (object && object.parent) {
			if (object.parent instanceof AdditionalObject) {
				return object.parent;
			} else {
				return AdditionalObject.isChild(object.parent);
			}
		}
		return null;
	}

	static fromJson(json) {
		if (!json.meshParams) {
			throw 'Создание без meshParams невозможно'
		}
		if (!json.className) {
			throw 'Создание без className невозможно'
		}
		
		if (json.color) json.meshParams.color = json.color;
		return eval('new ' + json.className + '(json)');
	}

	static getMeta() {
		return {
			title: 'Объект',
			inputs: []
		}
	}

	static getDefaultObject(className){
		var item = {
			id: getAdditionalObjectCurrentId(),
			className: className,
			meshParams: eval(className).getDefaults(),
			position: {
				x: 0,
				y: 0,
				z: 0,
			},
			rotation: 0,
			color: '#cccccc'
		};

		return item
	}

	/**
	 * Общие инпуты
	 */
	static defaultInputs(){
		return [
			{
				type: "delimeter",
				title: "Общие параметры"
			},
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
				key: 'objectAmt',
				title: 'Количество',
				default: 1,
				type: 'number'
			},
			{
				key: 'objectComment',
				title: 'Комментарий',
				default: '',
				type: 'text'
			},
		]
	}

	static getDefaults() {
		var obj = {};

		var meta = this.getMeta();
		if (meta.inputs.length > 0) {
			$.each(meta.inputs, function () {
				obj[this.key] = this.default;
			});
		}
		return obj;
	}

	static getAvailableClasses() {
		return [
			{
				className: 'Stair',
				title: 'Лестница'
			},
      {
        className: 'Screen',
        title: 'Экран радиатора'
      },
			{
				className: 'ConcretePlatform',
				title: 'Площадка бетон'
			},
			{
				className: 'Ladder',
				title: 'Марш бетон'
			},			
			{
				className: 'Winder',
				title: 'Забег бетон'
			},
			{
				className: 'Sill',
				title: 'Подоконник'
			},
			{
				className: 'RackWall',
				title: 'Реечная перегородка'
			},
			{
				className: 'MetalPlatform',
				title: 'Площадка металл'
			},
			{
				className: 'Columns',
				title: 'Колонны'
			},
			{
				className: 'Canopy',
				title: 'Козырек'
			},	
			
			{
				className: 'Door',
				title: 'Дверь'
			},
			{
				className: 'Window',
				title: 'Окно'
			},
			{
				className: 'Battery',
				title: 'Батарея'
			},
			{
				className: 'PipeObject',
				title: 'Труба'
			},
			
			{
				className: 'Switch',
				title: 'Выключатель'
			},
			{
				className: 'Socket',
				title: 'Розетка'
			},
			
			{
				className: 'Transport',
				title: 'Транспорт'
			},
			
			{
				className: 'Table',
				title: 'Стол'
			},
			{
				className: 'Sofa',
				title: 'Диван'
			},
			{
				className: 'Chair',
				title: 'Стул'
			},
			{
				className: 'Bedside',
				title: 'Тумбочка'
			},
			{
				className: 'Fridge',
				title: 'Холодильник'
			},
			{
				className: 'Wardrobe',
				title: 'Шкаф'
			},
			
			{
				className: 'Tv',
				title: 'Телевизор'
			},
			{
				className: 'Lustre',
				title: 'Люстра'
			},
			{
				className: 'WallLamp',
				title: 'Настенный светильник'
			},
			{
				className: 'Shelf',
				title: 'Стеллаж'
			},
			{
				className: 'Bed',
				title: 'Кровать'
			},
			{
				className: 'Pool',
				title: 'Бассейн'
			},
			{
				className: 'Roof',
				title: 'Крыша'
			},
			{
				className: 'Fence',
				title: 'Забор'
			}
		]
	}
}