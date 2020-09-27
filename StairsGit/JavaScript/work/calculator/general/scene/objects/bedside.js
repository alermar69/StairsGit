class Bedside extends AdditionalObject {
	doorClosed = true;
	doorMesh = false;

	constructor(par) {
		super(par);

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
				title: 'Открыть/Закрыть окно',
				function: 'toggleDoor'
			})
		}
		return actions;
	}

	/** STATIC **/

	static draw(par){
		if (!par) par = {}
		initPar(par);
		
		var dspThickness = 15;

		var backGeometry = new THREE.BoxGeometry(par.width, par.height, 2);
		var topGeometry = new THREE.BoxGeometry(par.width, dspThickness, par.depth);
		var sideGeometry = new THREE.BoxGeometry(dspThickness, par.height - dspThickness, par.depth);

		var shelfGeometry = new THREE.BoxGeometry(par.width - dspThickness * 2, dspThickness, par.depth);

		var side = new THREE.Mesh(sideGeometry, par.material);
		side.position.x = dspThickness / 2;
		side.position.y = (par.height - dspThickness) / 2;
		side.position.z = par.depth / 2;
		par.mesh.add(side);

		var side = new THREE.Mesh(sideGeometry, par.material);
		side.position.x = par.width - dspThickness / 2;
		side.position.y = (par.height - dspThickness) / 2;
		side.position.z = par.depth / 2;
		par.mesh.add(side);

		var back = new THREE.Mesh(backGeometry, par.material);
		back.position.x = par.width / 2;
		back.position.y = par.height / 2;
		back.position.z = -1;
		par.mesh.add(back);

		var shelf = new THREE.Mesh(shelfGeometry, par.material);
		shelf.position.x = (par.width) / 2;
		shelf.position.y = dspThickness / 2 + par.height * 0.7;
		shelf.position.z = par.depth / 2;
		par.mesh.add(shelf);

		var shelf = new THREE.Mesh(shelfGeometry, par.material);
		shelf.position.x = (par.width) / 2;
		shelf.position.y = dspThickness / 2 + par.height * 0.35;
		shelf.position.z = par.depth / 2;
		par.mesh.add(shelf);

		var shelf = new THREE.Mesh(shelfGeometry, par.material);
		shelf.position.x = (par.width) / 2;
		shelf.position.y = dspThickness / 2;
		shelf.position.z = par.depth / 2;
		par.mesh.add(shelf);

		var top = new THREE.Mesh(topGeometry, par.material);
		top.position.x = par.width / 2;
		top.position.y = par.height - dspThickness + dspThickness / 2;
		top.position.z = par.depth / 2;
		par.mesh.add(top);

		if (par.doorExist) {
			var doorGeometry = new THREE.BoxGeometry(par.width, par.height * 0.7 + dspThickness, dspThickness);
			doorGeometry.translate(par.width / 2, 0, dspThickness / 2);

			var door = new THREE.Mesh(doorGeometry, par.material);
			door.position.x = 0;
			door.position.y = (par.height * 0.7) / 2 + dspThickness / 2;
			door.position.z = par.depth;
			par.mesh.add(door);
			par.doorMesh = door;
		}

		return par;
	}

	static getMeta() {
		return {
			title: 'Тумбочка',
			inputs: [
				{
					key: 'height',
					title: 'Высота тумбочки',
					default: 600,
					type: 'number'
				},
				{
					key: 'width',
					title: 'Ширина тумбочки',
					default: 400,
					type: 'number'
				},
				{
					key: 'depth',
					title: 'Глубина тумбочки',
					default: 400,
					type: 'number'
				},
				{
					key: 'doorExist',
					title: 'Дверка присутствует',
					default: true,
					type: 'boolean'
				}
			]
		}
	}
}