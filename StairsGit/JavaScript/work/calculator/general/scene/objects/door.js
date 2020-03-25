class Door extends AdditionalObject{
	doorClosed = true;
	doorMesh = false;
	doorMesh2 = false;

	constructor(par){
		super(par);
		var door = new THREE.Object3D();

		var nal = this.drawNal(40 + 10);
		door.add(nal);
		var nal = this.drawNal(40 + 5 - this.par.wallThickness);
		door.add(nal);

		if (this.par.doorExist) {
			this.doorMesh = this.drawDoor(this.par.doorsCount == 1 && this.par.doorType == 'правая');
			door.add(this.doorMesh);
			if (this.par.doorsCount == 2) {
				this.doorMesh2 = this.drawDoor(true);
				door.add(this.doorMesh2);
			}
		}

		door.position.z -= 47.5;

		this.add(door);
	}
	
	drawNal(zPos){
		var nal = new THREE.Object3D();

		var nalSideGeometry = new THREE.BoxGeometry( this.par.nalWidth, this.par.height, 5 );
		var nalLeft = new THREE.Mesh( nalSideGeometry, this.material );
		nalLeft.position.x = -this.par.nalWidth / 2;
		nalLeft.position.y = this.par.height / 2;
		nalLeft.position.z = zPos;
		nal.add(nalLeft);

		var nalRight = new THREE.Mesh( nalSideGeometry, this.material );
		nalRight.position.x = this.par.width + this.par.nalWidth / 2;
		nalRight.position.y = this.par.height / 2;
		nalRight.position.z = zPos;
		nal.add(nalRight);

		var nalTopGeometry = new THREE.BoxGeometry( this.par.width + this.par.nalWidth * 2, this.par.nalWidth, 5 );
		var nalTop = new THREE.Mesh( nalTopGeometry, this.material );
		nalTop.position.x = this.par.width / 2;
		nalTop.position.y = this.par.nalWidth / 2 + this.par.height;
		nalTop.position.z = zPos;
		nal.add(nalTop);

		return nal;
	}

	drawDoor(leftDoor){
		var doorMesh = new THREE.Object3D();
		var doorWidth = this.par.width;
		if (this.par.doorsCount == 2) doorWidth = this.par.width / 2;

		var doorGeometry = new THREE.BoxGeometry( doorWidth, this.par.height, 40 );

		if (leftDoor) {
			doorGeometry.translate(-doorWidth / 2, 0, -20);
		}else{
			doorGeometry.translate(doorWidth / 2, 0, -20);
		}

		var door = new THREE.Mesh( doorGeometry, this.material );
		door.position.x = 0;
		door.position.y = this.par.height / 2;
		doorMesh.add(door);

		var handleGeometry = new THREE.CylinderGeometry( 20, 20, 20, 32 );
		var handle = new THREE.Mesh( handleGeometry, this.material );
		handle.position.x = doorWidth - 60;
		if (leftDoor) handle.position.x = -doorWidth + 60;
		handle.position.y = this.par.height / 2;
		handle.position.z = 10;
		handle.rotation.x = Math.PI / 2;
		doorMesh.add(handle);

		var handle = new THREE.Mesh( handleGeometry, this.material );
		handle.position.x = doorWidth - 60;
		if (leftDoor) handle.position.x = -doorWidth + 60;
		handle.position.y = this.par.height / 2;
		handle.position.z = -40 - 10;
		handle.rotation.x = Math.PI / 2;
		doorMesh.add(handle);

		if (leftDoor) doorMesh.position.x = this.par.width;
		if (this.par.isOut) {
			doorMesh.position.z = 46;
			var handleGeometry = new THREE.CylinderGeometry( 10, 10, 130, 32 );
			var handle = new THREE.Mesh( handleGeometry, this.material );
			handle.position.x = 0;
			handle.position.y = this.par.height * 0.2;
			handle.position.z = 10;
			doorMesh.add(handle);

			var handle = new THREE.Mesh( handleGeometry, this.material );
			handle.position.x = 0;
			handle.position.y = this.par.height * 0.8;
			handle.position.z = 10;
			doorMesh.add(handle);
		}else{
			doorMesh.position.z = 45 + 5 / 2 + 20 - this.par.wallThickness / 2;
		}

		return doorMesh;
	}

	toggleDoor(){
		if (this.par.doorExist) {
			if (this.doorClosed) {
				this.addAnimation('openDoor', 500);
				this.doorClosed = false;
			}else{
				this.addAnimation('closeDoor', 500)
				this.doorClosed = true;
			}
		}
	}

	animationProgress(animationName, progress){
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

	getActions(){
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
	static getMeta(){
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
				}
			]
		}
	}
}