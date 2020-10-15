class Door extends AdditionalObject {
	constructor(par) {
		super(par);

		this.doorClosed = true;
		this.doorMesh = false;
		this.doorMesh2 = false;	

		this.color = new THREE.Color(0xFFFFFF);

		this.material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xFFFFFF) });
		this.materialDoor = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xFFFFFF) });
		if (this.par.doorsCount == 2) this.materialDoor2 = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xFFFFFF) });
		
		var objPar = Object.assign({}, this.par)
		objPar.dxfBasePoint = {x:0,y:0}
		objPar.material = this.material;
		objPar.materialDoor = this.materialDoor;
		objPar.materialDoor2 = this.materialDoor2;
		objPar.calc_price = this.calc_price;
		objPar.objId = this.objId;
		
		var doorPar = Door.draw(objPar);
		this.add(doorPar.mesh);

		this.doorMesh = par.doorMesh;
		this.doorMesh2 = par.doorMesh2;
		
	}

	static drawNal(par, zPos) {
		var nal = new THREE.Object3D();

		var nalSideGeometry = new THREE.BoxGeometry(par.nalWidth, par.height, 5);
		var nalLeft = new THREE.Mesh(nalSideGeometry, par.material);
		nalLeft.position.x = -par.nalWidth / 2;
		nalLeft.position.y = par.height / 2;
		nalLeft.position.z = zPos;
		nal.add(nalLeft);

		var nalRight = new THREE.Mesh(nalSideGeometry, par.material);
		nalRight.position.x = par.width + par.nalWidth / 2;
		nalRight.position.y = par.height / 2;
		nalRight.position.z = zPos;
		nal.add(nalRight);

		var nalTopGeometry = new THREE.BoxGeometry(par.width + par.nalWidth * 2, par.nalWidth, 5);
		var nalTop = new THREE.Mesh(nalTopGeometry, par.material);
		nalTop.position.x = par.width / 2;
		nalTop.position.y = par.nalWidth / 2 + par.height;
		nalTop.position.z = zPos;
		nal.add(nalTop);

		return nal;
	}

	static drawDoor(par, leftDoor) {
		var doorMesh = new THREE.Object3D();
		var doorWidth = par.width;
		var materialDoor = par.materialDoor;
		if (par.doorsCount == 2) {
			doorWidth = par.width / 2;
			if(leftDoor) materialDoor = par.materialDoor2;
		}

		var doorGeometry = new THREE.BoxGeometry(doorWidth, par.height, 40);

		if (leftDoor) {
			doorGeometry.translate(-doorWidth / 2, 0, -20);
		} else {
			doorGeometry.translate(doorWidth / 2, 0, -20);
		}

		var door = new THREE.Mesh(doorGeometry, materialDoor);
		door.position.x = 0;
		door.position.y = par.height / 2;
		doorMesh.add(door);

		if (par.haveDoorHandle) {
			var handleGeometry = new THREE.CylinderGeometry(20, 20, 20, 32);
			var handle = new THREE.Mesh(handleGeometry, par.material);
			handle.position.x = doorWidth - 60;
			if (leftDoor) handle.position.x = -doorWidth + 60;
			handle.position.y = par.height / 2;
			handle.position.z = 10;
			handle.rotation.x = Math.PI / 2;
			doorMesh.add(handle);

			var handle = new THREE.Mesh(handleGeometry, par.material);
			handle.position.x = doorWidth - 60;
			if (leftDoor) handle.position.x = -doorWidth + 60;
			handle.position.y = par.height / 2;
			handle.position.z = -40 - 10;
			handle.rotation.x = Math.PI / 2;
			doorMesh.add(handle);
		}

		if (leftDoor) doorMesh.position.x = par.width;
		if (par.isOut) {
			doorMesh.position.z = 46;
			var handleGeometry = new THREE.CylinderGeometry(10, 10, 130, 32);
			var handle = new THREE.Mesh(handleGeometry, par.material);
			handle.position.x = 0;
			handle.position.y = par.height * 0.2;
			handle.position.z = 10;
			doorMesh.add(handle);

			var handle = new THREE.Mesh(handleGeometry, par.material);
			handle.position.x = 0;
			handle.position.y = par.height * 0.8;
			handle.position.z = 10;
			doorMesh.add(handle);
		} else {
			doorMesh.position.z = 45 + 5 / 2 + 20 - par.wallThickness / 2;
		}

		return doorMesh;
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
				if (this.par.openType == 'насебя') this.doorMesh.rotation.y = (-Math.PI / 2) * progress;
				if (this.par.openType != 'насебя') this.doorMesh.rotation.y = (Math.PI / 2) * progress;
				if (this.doorMesh2 && this.par.openType == 'насебя') this.doorMesh2.rotation.y = (Math.PI / 2) * progress;
				if (this.doorMesh2 && this.par.openType != 'насебя') this.doorMesh2.rotation.y = (-Math.PI / 2) * progress;
				break;
			case 'closeDoor':
				if (this.par.openType == 'насебя') this.doorMesh.rotation.y = -Math.PI / 2 + (Math.PI / 2) * progress;
				if (this.par.openType != 'насебя') this.doorMesh.rotation.y = Math.PI / 2 - (Math.PI / 2) * progress;
				if (this.doorMesh2 && this.par.openType == 'насебя') this.doorMesh2.rotation.y = Math.PI / 2 - (Math.PI / 2) * progress;
				if (this.doorMesh2 && this.par.openType != 'насебя') this.doorMesh2.rotation.y = -Math.PI / 2 + (Math.PI / 2) * progress;
				break;
		}
	}

	getActions() {
		var actions = [];
		if (this.par.doorExist) {
			actions.push({
				title: 'Открыть/Закрыть дверь',
				function: 'toggleDoor'
			})
		}
		return actions;
	}

	/** STATIC **/

	static draw(par){
		if(!par) par = {};
		initPar(par);
		
		if (par.texture && textureManager.texturesEnabled) {

			textureManager.textureLoader.load(par.texture + 'other.jpg', function (map) {
				par.material.map = map;
				par.material.needsUpdate = true;
			});

			textureManager.textureLoader.load(par.texture + 'map.jpg', function (map) {
				if (par.doorsCount == 1 && par.doorType == 'левая') {
					map.wrapS = THREE.RepeatWrapping;
					map.repeat.x = - 1;
				}
				par.materialDoor.map = map;
				par.materialDoor.needsUpdate = true;
			});

			if (par.doorsCount == 2) {
				textureManager.textureLoader.load(par.texture + 'map.jpg', function (map) {
					map.wrapS = THREE.RepeatWrapping;
					map.repeat.x = - 1;

					par.materialDoor2.map = map;
					par.materialDoor2.needsUpdate = true;
				});
			}
		}
		window.door = this;

		var door = new THREE.Object3D();

		var nal = Door.drawNal(par, 40 + 10);
		door.add(nal);
		var nal = Door.drawNal(par, 40 + 5 - par.wallThickness);
		door.add(nal);

		if (par.doorExist) {
			par.doorMesh = Door.drawDoor(par, par.doorsCount == 1 && par.doorType == 'правая');
			door.add(par.doorMesh);
			if (par.doorsCount == 2) {
				par.doorMesh2 = Door.drawDoor(par, true);
				door.add(par.doorMesh2);
			}
		}

		door.position.z -= 47.5;

		par.mesh.add(door);

		return par;
	}

	static getMeta() {
		return {
			title: 'Дверь',
			inputs: [
				{
					key: 'height',
					title: 'Высота двери',
					default: 2100,
					type: 'number'
				},
				{
					key: 'width',
					title: 'Ширина двери',
					default: 1100,
					type: 'number'
				},
				{
					key: 'nalWidth',
					title: 'Ширина наличника',
					default: 100,
					type: 'number'
				},
				{
					key: 'doorThickness',
					title: 'Толщина двери',
					default: 70,
					type: 'number'
				},
				{
					key: 'wallThickness',
					title: 'Толщина проема',
					default: 70,
					type: 'number'
				},
				{
					key: 'doorsCount',
					title: 'Количество створок',
					default: '1',
					values: [
						{
							value: '1',
							title: '1'
						},
						{
							value: '2',
							title: '2'
						}
					],
					type: 'select'
				},
				{
					key: 'openType',
					title: 'Открывается',
					default: 'отсебя',
					values: [
						{
							value: 'отсебя',
							title: 'От себя'
						},
						{
							value: 'насебя',
							title: 'На себя'
						}
					],
					type: 'select'
				},
				{
					key: 'doorType',
					title: 'Тип двери',
					default: 'левая',
					values: [
						{
							value: 'левая',
							title: 'Левая'
						},
						{
							value: 'правая',
							title: 'Правая'
						}
					],
					type: 'select'
				},
				{
					key: 'doorExist',
					title: 'Дверь присутствует',
					default: true,
					type: 'boolean'
				},
				{
					key: 'isOut',
					title: 'Дверь входная',
					default: false,
					type: 'boolean'
				},
				{
					key: 'haveDoorHandle',
					title: 'Есть ручка',
					default: true,
					type: 'boolean'
				},
				{
					key: 'texture',
					title: 'Текстура',
					default: '/images/calculator/textures/door/1/',
					values: [
						{
							value: '/images/calculator/textures/door/1/',
							preview: '/images/calculator/textures/door/1/map.jpg'
						},
						{
							value: '/images/calculator/textures/door/2/',
							preview: '/images/calculator/textures/door/2/map.jpg'
						},
						{
							value: '/images/calculator/textures/door/3/',
							preview: '/images/calculator/textures/door/3/map.jpg'
						},
						{
							value: '/images/calculator/textures/door/4/',
							preview: '/images/calculator/textures/door/4/map.jpg'
						},
						{
							value: '/images/calculator/textures/door/5/',
							preview: '/images/calculator/textures/door/5/map.jpg'
						},
						{
							value: '/images/calculator/textures/door/6/',
							preview: '/images/calculator/textures/door/6/map.jpg'
						},
						{
							value: '/images/calculator/textures/door/7/',
							preview: '/images/calculator/textures/door/7/map.jpg'
						},
						{
							value: '/images/calculator/textures/door/8/',
							preview: '/images/calculator/textures/door/8/map.jpg'
						},
						{
							value: '/images/calculator/textures/door/9/',
							preview: '/images/calculator/textures/door/9/map.jpg'
						}
					],
					type: 'image'
				}
			]
		}
	}
}