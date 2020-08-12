var hovered = null;
var animations = [];
// var rightClickObject = null;
var partsAmt_dop = {}; //глобальный массив количеств эл-тов для спецификации балюстрады

class AdditionalObject extends THREE.Object3D {
	material = {};
	color = new THREE.Color(0xcccccc);
	par = {};
	objId = 0;

	constructor(par) {
		super();
		if(!par) return;

		this.objId = par.id;
		this.par = par.meshParams;
		this.calc_price = par.calc_price;

		if (this.par.color) this.color = new THREE.Color(this.par.color);
		this.material = new THREE.MeshBasicMaterial({ color: this.color });

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
			<a class='dropdown-item editObject'>Редактировать</a>\
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

	getObjectMaterial(){
		if(!window.textureManager) return this.material
		if (this.par.material == 'металл') {
			var metalType = 'additionalObjectMetal';
			if (params.additionalObjectsMetalMaterial == 'хром. сталь' || params.additionalObjectsMetalMaterial ==  'нерж. сталь') metalType = 'inox';
			return textureManager.createMaterial({name: metalType, color: getMetalColorId(params.additionalObjectsMetalColor), wireframe: false});
		}
		if (this.par.material == 'массив') {
			return textureManager.createMaterial({name: 'additionalObjectTimber', color: getTimberColorId(params.additionalObjectsTimberColor), wireframe: false});
		}
	}

	static calcPrice(par){
		return {
			name: this.getMeta().title,
			cost: 0,
			priceFactor: 1,
			costFactor: 1
		}
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
				className: 'Pool',
				title: 'Бассейн'
			}
		]
	}
}