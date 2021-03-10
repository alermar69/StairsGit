class Fence extends AdditionalObject{
	constructor(par){
		super(par);
		var obj = this;
		this.doorMesh = null;
		this.doorMesh2 = null;
		this.doorClosed = true;
		
		
		var sectParams = {
			dxfArr: [],
			dxfBasePoint: {
			  x: 0,
			  y: 0
			},
			posX: 0,
			posY: 0,
			posZ: 0,
			posAng: 0,
			material: obj.material
		};
		
		var meta = Fence.getMeta();
		meta.inputs.forEach(function(input){
			sectParams[input.key] = obj.par[input.key];
		})
		
		var fencePar = Fence.draw(sectParams);
		fencePar.mesh.position.y = obj.par.height / 2;
		this.doorMesh = fencePar.doorMesh1;
		this.doorMesh2 = fencePar.doorMesh2;
		obj.add(fencePar.mesh);
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
				if (this.par.doorType == 'сдвижные') {
					this.doorMesh.position.x = this.par.doorLen * progress;
				}
				if (this.par.doorType == 'распашные'){
					this.doorMesh.rotation.y = (-Math.PI / 2) * progress;
					this.doorMesh2.rotation.y = (Math.PI / 2) * progress;
				}
				break;
			case 'closeDoor':
				if (this.par.doorType == 'сдвижные') {
					this.doorMesh.position.x = this.par.doorLen - this.par.doorLen * progress;
				}
				if (this.par.doorType == 'распашные'){
					this.doorMesh.rotation.y = -Math.PI / 2 + (Math.PI / 2) * progress;
					this.doorMesh2.rotation.y = Math.PI / 2 - (Math.PI / 2) * progress;
				}
				break;
		}
	}

	getActions() {
		var actions = [];
		actions.push({
			title: 'Открыть/Закрыть дверь',
			function: 'toggleDoor'
		})
		return actions;
	}

	/** STATIC */

	static draw(par){
		if(!par) par = {};
		initPar(par);

		if (par.doorType != 'нет') {
			par.mesh = new THREE.Object3D();
			var rackSize = 300;
			var partLen = par.len / 2 - par.doorLen / 2;
			if (par.fenceType == 'со столбами') partLen -= rackSize * 2;
			
			var geom = new THREE.BoxGeometry(partLen, par.height, par.thk);
			var firstPart = new THREE.Mesh(geom, par.material);
			firstPart.position.x += par.doorLen / 2;

			par.mesh.add(firstPart);

			var secondPart = new THREE.Mesh(geom, par.material);
			secondPart.position.x -= partLen + par.doorLen / 2;
			if (par.fenceType == 'со столбами') secondPart.position.x -= rackSize * 2;
			par.mesh.add(secondPart);

			var doorLen = par.doorLen / 2;
			if (par.doorType == 'сдвижные') doorLen = par.doorLen;
			
			var geom = new THREE.BoxGeometry(doorLen, par.height, 40);
			geom.translate(-doorLen / 2, 0, -20);
			
			var door1 = new THREE.Mesh(geom, par.material);
			if(par.doorType == 'сдвижные') door1.position.z -= par.thk / 2; 
			par.doorMesh1 = door1;
			par.mesh.add(door1);
			
			var geom = new THREE.BoxGeometry(doorLen, par.height, 40);
			geom.translate(doorLen / 2, 0, -20);

			if (par.doorType != 'сдвижные') {
				var door2 = new THREE.Mesh(geom, par.material);
				door2.position.x -= doorLen * 2;
				par.doorMesh2 = door2;
				par.mesh.add(door2);
			}

			if (par.fenceType == 'со столбами'){
				var geom = new THREE.BoxGeometry(rackSize, par.height + 50, rackSize);
				var rack = new THREE.Mesh(geom, par.material);
				rack.position.x = rackSize / 2;
				par.mesh.add(rack);

				var rack = new THREE.Mesh(geom, par.material);
				rack.position.x = rackSize + partLen;
				par.mesh.add(rack);

				var rack = new THREE.Mesh(geom, par.material);
				rack.position.x = -rackSize / 2 - par.doorLen;
				par.mesh.add(rack);

				var rack = new THREE.Mesh(geom, par.material);
				rack.position.x = -rackSize - par.doorLen - partLen;
				par.mesh.add(rack);
			}

		}else{
			var geom = new THREE.BoxGeometry(par.len, par.height, par.thk);
			par.mesh = new THREE.Mesh(geom, par.material);
		}

		return par
	}


	static calcPrice(par){
		var meshPar = par.meshParams;
		var dopSpec = partsAmt_dop[par.id];
		var cost = 0;

		return {
			name: par.name || this.getMeta().title,
			cost: cost,
			priceFactor: meshPar.priceFactor || 1,
			costFactor: meshPar.costFactor || 1
		}
	}

	static getMeta(){
		
		return {
			title: 'Забор',
			inputs: [
				{
					key: 'fenceType',
					title: 'Тип',
					default: 'плоский',
					values: [
						{
							value: 'плоский',
							title: 'плоский'
						},
						{
							value: 'со столбами',
							title: 'со столбами'
						},
						],
					type: 'select'
				},
				{
					key: 'doorType',
					title: 'Ворота',
					default: 'сдвижные',
					values: [
						{
							value: 'сдвижные',
							title: 'сдвижные'
						},
						{
							value: 'распашные',
							title: 'распашные'
						},
						{
							value: 'нет',
							title: 'нет'
						},
						],
					type: 'select'
				},
				{
					key: 'doorLen',
					title: 'Ширина ворот',
					default: 2000,
					type: 'number'
				},
				{
					key: 'len',
					title: 'Длина',
					default: 6000,
					type: 'number'
				},
				{
					key: 'thk',
					title: 'Толщина',
					default: 60,
					type: 'number'
				},
				{
					key: 'height',
					title: 'Высота',
					default: 2000,
					type: 'number'
				}
			]
		}
	}
}

// function drawFenceDoor(par){
// 	var mesh = new THREE.Object3D();

// 	if (par.doorType == '') {
// 		var doorLen = par.doorLen;
// 		var geom = new THREE.BoxGeometry(doorLen, par.height, par.thk);
// 		var door = new THREE.Mesh(geom, par.material);
// 		// firstPart.position.x += par.doorLen / 2;
// 		mesh.add(door);
// 	}
// 	return mesh
// }