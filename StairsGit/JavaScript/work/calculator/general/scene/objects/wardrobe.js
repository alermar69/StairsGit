class Wardrobe extends AdditionalObject {

	doorMesh = false;
	doorClosed = true;

	constructor(par) {
		super(par);

		var dspThikness = this.par.dspThickness || 15;
		console.log(dspThikness);

		var radAngle = THREE.Math.degToRad(this.par.angle);
		var p0 = { x: 0, y: this.par.height };
		var p1 = itercection(p0, polar(p0, radAngle, 100), { x: this.par.width, y: 0 }, { x: this.par.width, y: 100 });
		var length = distance(p0, p1);

		if (this.par.side == 'левый') {
			var side1Geometry = new THREE.BoxGeometry(dspThikness, this.par.height, this.par.depth);
			var side2Geometry = new THREE.BoxGeometry(dspThikness, p1.y - dspThikness * Math.tan(radAngle), this.par.depth);
		} else {
			var side1Geometry = new THREE.BoxGeometry(dspThikness, p1.y - dspThikness * Math.tan(radAngle), this.par.depth);
			var side2Geometry = new THREE.BoxGeometry(dspThikness, this.par.height, this.par.depth);
		}
		var shelfGeometry = new THREE.BoxGeometry(this.par.width - dspThikness * 2, dspThikness, this.par.depth);
		var topGeometry = new THREE.BoxGeometry(length - dspThikness / Math.cos(radAngle), dspThikness, this.par.depth);
		topGeometry.translate(0, -dspThikness / 2, 0);

		var top = new THREE.Mesh(topGeometry, this.material);
		var pos = polar(p0, radAngle, (length - dspThikness / Math.cos(radAngle)) / 2);

		top.position.x = pos.x;
		top.position.y = pos.y;
		top.position.z = this.par.depth / 2;

		if (this.par.side == 'левый') {
			top.rotation.z = radAngle;
		} else {
			top.rotation.z = -radAngle;
		}

		this.add(top);

		var side1 = new THREE.Mesh(side1Geometry, this.material);
		side1.position.x = dspThikness / 2;
		side1.position.y = side1Geometry.parameters.height / 2;
		side1.position.z = this.par.depth / 2;
		this.add(side1);

		var side2 = new THREE.Mesh(side2Geometry, this.material);
		side2.position.x = this.par.width - dspThikness / 2;
		side2.position.y = side2Geometry.parameters.height / 2;
		side2.position.z = this.par.depth / 2;
		this.add(side2);

		var bot = new THREE.Mesh(shelfGeometry, this.material);
		bot.position.x = this.par.width / 2;
		bot.position.y = dspThikness / 2;
		bot.position.z = this.par.depth / 2;
		this.add(bot);

		for (let i = 1; i <= this.par.shelfsCount; i++) {
			var offset = (this.par.height / (this.par.shelfsCount + 1)) * i;
			var shelf = new THREE.Mesh(shelfGeometry, this.material);
			shelf.position.x = this.par.width / 2;
			shelf.position.y = dspThikness / 2 + offset;
			shelf.position.z = this.par.depth / 2;
			this.add(shelf);
		}

		var doorP1 = { x: 0, y: 0 };
		var doorP2 = p0;
		var doorP3 = p1;
		var doorP4 = { x: this.par.width, y: 0 };

		if (this.par.side == 'правый') {
			var doorP1 = { x: 0, y: 0 };
			var doorP2 = { x: 0, y: p1.y };
			var doorP3 = { x: this.par.width, y: this.par.height };
			var doorP4 = { x: this.par.width, y: 0 };
		}

		//создаем шейп
		var shapePar = {
			points: [doorP1, doorP2, doorP3, doorP4],
			dxfArr: [],
			dxfBasePoint: { x: 0, y: 0 },
		}

		var shape = drawShapeByPoints2(shapePar).shape;

		var extrudeOptions = {
			amount: 1,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};
		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		var back = new THREE.Mesh(geom, this.material);
		back.position.z -= 1;
		this.add(back);

		if (this.par.doorExist) {
			var extrudeOptions = {
				amount: dspThikness,
				bevelEnabled: false,
				curveSegments: 12,
				steps: 1
			};
			var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
			geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
			var doorWrapper = new THREE.Object3D();
			var door = new THREE.Mesh(geom, this.material);
			doorWrapper.position.z = this.par.depth;
			doorWrapper.add(door);
			this.doorMesh = doorWrapper;
			this.add(doorWrapper);
		}
	}

	toggleDoor() {
		if (this.par.doorExist) {
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
				title: 'Открыть/Закрыть дверцу',
				function: 'toggleDoor'
			})
		}
		return actions;
	}

	static calcPrice(par){
		var meshParams = par.meshParams;
		var price = meshParams.height * 12; // Пример
		return {
			name: meshParams.name || this.getMeta().title,
			cost: price,
			priceFactor: meshParams.priceFactor || 1,
			costFactor: meshParams.costFactor || 1
		}
	}

	static getMeta() {
		return {
			title: 'Шкаф',
			inputs: [
				{
					key: 'name',
					title: 'Название',
					default: 'Шкаф',
					type: 'text'
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
					type: 'delimeter'
				},
				{
					key: 'height',
					title: 'Высота',
					default: 1700,
					type: 'number'
				},
				{
					key: 'width',
					title: 'Ширина',
					default: 600,
					type: 'number'
				},
				{
					key: 'depth',
					title: 'Глубина',
					default: 600,
					type: 'number'
				},
				{
					key: 'angle',
					title: 'Угол верха',
					default: 45,
					type: 'number'
				},
				{
					key: 'shelfsCount',
					title: 'Кол-во полок',
					default: 2,
					type: 'number'
				},
				{
					key: 'doorExist',
					title: 'Дверца есть',
					default: true,
					type: 'boolean'
				},
				{
					key: 'side',
					title: 'Направление',
					default: 'левый',
					values: [
						{
							value: 'левый',
							title: 'Левый'
						},
						{
							value: 'правый',
							title: 'Правый'
						}
					],
					type: 'select'
				},
			]
		}
	}
}