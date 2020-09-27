class Fridge extends AdditionalObject {
	doorClosed = true;
	doorMesh = false;
	doorMesh2 = false;

	constructor(par) {
		super(par);

		var objPar = Object.assign({}, this.par)
		objPar.dxfBasePoint = {x:0,y:0}
		objPar.material = this.material;
		
		var doorPar = Fridge.draw(objPar);
		this.add(doorPar.mesh);

		this.doorMesh = par.doorMesh;
		this.doorMesh2 = par.doorMesh2;
		
	}

	static draw(par){
		if(!par) par = {};
		initPar(par);

		var backGeometry = new THREE.BoxGeometry(par.width - 40, par.height - 20, 20);
		var sideGeometry = new THREE.BoxGeometry(20, par.height - 20, par.depth - 40);
		var topGeometry = new THREE.BoxGeometry(par.width, 20, par.depth - 40);

		var shelfGeometry = new THREE.BoxGeometry(par.width - 40, 20, par.depth - 40 - 20);

		var side = new THREE.Mesh(sideGeometry, par.material);
		side.position.x = 20 / 2;
		side.position.y = (par.height - 20) / 2;
		side.position.z = (par.depth - 40) / 2;
		par.mesh.add(side);

		var side = new THREE.Mesh(sideGeometry, par.material);
		side.position.x = par.width - 20 / 2;
		side.position.y = (par.height - 20) / 2;
		side.position.z = (par.depth - 40) / 2;
		par.mesh.add(side);

		var back = new THREE.Mesh(backGeometry, par.material);
		back.position.x = par.width / 2;
		back.position.y = (par.height - 20) / 2;
		back.position.z = 10;
		par.mesh.add(back);

		var top = new THREE.Mesh(topGeometry, par.material);
		top.position.x = par.width / 2;
		top.position.y = par.height - 10;
		top.position.z = par.depth / 2 - 20;
		par.mesh.add(top);

		var shelf = new THREE.Mesh(shelfGeometry, par.material);
		shelf.position.x = par.width / 2;
		shelf.position.y = 10;
		shelf.position.z = par.depth / 2 - 10;
		par.mesh.add(shelf);

		var shelf = new THREE.Mesh(shelfGeometry, par.material);
		shelf.position.x = par.width / 2;
		shelf.position.y = par.height * 0.4 - 10;
		shelf.position.z = par.depth / 2 - 10;
		par.mesh.add(shelf);

		par.doorMesh = Fridge.drawDoor(par);
		if (par.doorsCount == 2) {
			par.doorMesh2 = Fridge.drawDoor(par, true);
		}

		return par
	}

	static drawDoor(par, isSecondDoor) {
		var doorMesh = new THREE.Object3D();
		var doorWidth = par.width;
		if (par.doorsCount == 2) doorWidth = par.width / 2;

		var doorGeometry = new THREE.BoxGeometry(doorWidth, par.height * 0.6, 40);

		if (par.doorsCount == 2 && isSecondDoor) {
			doorGeometry.translate(-doorWidth / 2, 0, 20);
		} else {
			doorGeometry.translate(doorWidth / 2, 0, 20);
		}

		var door = new THREE.Mesh(doorGeometry, par.material);
		door.position.x = 0;
		door.position.y = (par.height * 0.6) / 2 + par.height * 0.4;

		doorMesh.add(door);

		var botDoorGeometry = new THREE.BoxGeometry(doorWidth, par.height * 0.4 - 20, 40);
		if (par.doorsCount == 2 && isSecondDoor) {
			botDoorGeometry.translate(-doorWidth / 2, 0, 20);
		} else {
			botDoorGeometry.translate(doorWidth / 2, 0, 20);
		}

		var botDoor = new THREE.Mesh(botDoorGeometry, par.material);

		botDoor.position.x = 0;
		botDoor.position.y = (par.height * 0.4 - 20) / 2;

		doorMesh.add(botDoor);

		doorMesh.position.z = par.depth - 40;
		if (isSecondDoor) {
			doorMesh.position.x = par.width;
		}
		par.mesh.add(doorMesh);

		return doorMesh;
	}

	toggleDoor() {
		if (this.doorClosed) {
			this.addAnimation('openDoor', 500);
			this.doorClosed = false;
		} else {
			this.addAnimation('closeDoor', 500)
			this.doorClosed = true;
		}
	}

	animationProgress(animationName, progress) {
		switch (animationName) {
			case 'openDoor':
				this.doorMesh.rotation.y = (-Math.PI / 2) * progress;
				if (this.doorMesh2) this.doorMesh2.rotation.y = (Math.PI / 2) * progress;
				break;
			case 'closeDoor':
				this.doorMesh.rotation.y = -Math.PI / 2 + (Math.PI / 2) * progress;
				if (this.doorMesh2) this.doorMesh2.rotation.y = Math.PI / 2 - (Math.PI / 2) * progress;
				break;
		}
	}

	getActions() {
		var actions = [];
		if (this.par.doorExist) {
			actions.push({
				title: 'Открыть/Закрыть дверки',
				function: 'toggleDoor'
			})
		}
		return actions;
	}

	/** STATIC **/
	static getMeta() {
		return {
			title: 'Холодильник',
			inputs: [
				{
					key: 'height',
					title: 'Высота',
					default: 1900,
					type: 'number'
				},
				{
					key: 'width',
					title: 'Ширина',
					default: 700,
					type: 'number'
				},
				{
					key: 'depth',
					title: 'Глубина',
					default: 500,
					type: 'number'
				},
				{
					key: 'doorsCount',
					title: 'Количество дверок',
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
				}
			]
		}
	}
}