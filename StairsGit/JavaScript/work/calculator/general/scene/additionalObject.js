var hovered = null;
var animations = [];
var rightClickObject = null;

class AdditionalObject extends THREE.Object3D {
	material = {};
	color = new THREE.Color(0xcccccc);
	par = {};
	objId = 0;

	constructor(par) {
		super();

		this.objId = par.id;
		this.par = par.meshParams;

		if (this.par.color) this.color = new THREE.Color(this.par.color);
		this.material = new THREE.MeshBasicMaterial({ color: this.color });

		this.setLayer('additionalObject');
	}

	/** События */

	onLeftClick(event) {
		console.log('Left click', this.constructor.getMeta());
	}

	onRightClick(event) {
		var top = event.pageY - 10;
		var left = event.pageX - 90;
		$("#additionalObjectContextMenu").css({
			display: "block",
			position: 'absolute',
			top: top,
			left: left
		}).addClass("show");
		rightClickObject = this;

		var actions = this.getActions();

		var text = "";

		actions.forEach(function (action) {
			text += "<a class='dropdown-item additionalAction' data-function='" + action.function + "'>" + action.title + "</a>"
		});

		$("#additionalObjectContextMenu .dropdown-actions").html(text);
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

	static isChild(object) {
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

		return eval('new ' + json.className + '(json)')
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
				className: 'Switch',
				title: 'Выключатель'
			},
			{
				className: 'Socket',
				title: 'Розетка'
			}
		]
	}
}