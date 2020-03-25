class Fridge extends AdditionalObject{
	doorClosed = true;
	doorMesh = false;
	doorMesh2 = false;

	constructor(par){
		super(par);

		var backGeometry = new THREE.BoxGeometry( this.par.width - 40, this.par.height - 20, 20 );
		var sideGeometry = new THREE.BoxGeometry( 20, this.par.height - 20, this.par.depth - 40 );
		var topGeometry = new THREE.BoxGeometry( this.par.width, 20, this.par.depth - 40 );
		
		var shelfGeometry = new THREE.BoxGeometry( this.par.width - 40, 20, this.par.depth - 40 - 20 );

		var side = new THREE.Mesh( sideGeometry, this.material );
		side.position.x = 20 / 2;
		side.position.y = (this.par.height - 20) / 2;
		side.position.z = (this.par.depth - 40) / 2;
		this.add(side);

		var side = new THREE.Mesh( sideGeometry, this.material );
		side.position.x = this.par.width - 20 / 2;
		side.position.y = (this.par.height - 20) / 2;
		side.position.z = (this.par.depth - 40) / 2;
		this.add(side);

		var back = new THREE.Mesh( backGeometry, this.material );
		back.position.x = this.par.width / 2;
		back.position.y = (this.par.height - 20) / 2;
		back.position.z = 10;
		this.add(back);

		var top = new THREE.Mesh( topGeometry, this.material );
		top.position.x = this.par.width / 2;
		top.position.y = this.par.height - 10;
		top.position.z = this.par.depth / 2 - 20;
		this.add(top);

		var shelf = new THREE.Mesh( shelfGeometry, this.material );
		shelf.position.x = this.par.width / 2 ;
		shelf.position.y = 10;
		shelf.position.z = this.par.depth / 2 - 10;
		this.add(shelf);

		var shelf = new THREE.Mesh( shelfGeometry, this.material );
		shelf.position.x = this.par.width / 2 ;
		shelf.position.y = this.par.height * 0.4 - 10;
		shelf.position.z = this.par.depth / 2 - 10;
		this.add(shelf);

		this.doorMesh = this.drawDoor();
		if (this.par.doorsCount == 2) {
			this.doorMesh2 = this.drawDoor(true);
		}
	}

	drawDoor(isSecondDoor){
		var doorMesh = new THREE.Object3D();
		var doorWidth = this.par.width;
		if (this.par.doorsCount == 2) doorWidth = this.par.width / 2;

		var doorGeometry = new THREE.BoxGeometry( doorWidth, this.par.height * 0.6, 40 );

		if (this.par.doorsCount == 2 && isSecondDoor) {
			doorGeometry.translate(-doorWidth / 2, 0, 20);
		}else{
			doorGeometry.translate(doorWidth / 2, 0, 20);
		}

		var door = new THREE.Mesh( doorGeometry, this.material );
		door.position.x = 0;
		door.position.y = (this.par.height * 0.6) / 2 + this.par.height * 0.4;

		doorMesh.add(door);

		var botDoorGeometry = new THREE.BoxGeometry( doorWidth, this.par.height * 0.4 - 20, 40 );
		if (this.par.doorsCount == 2 && isSecondDoor) {
			botDoorGeometry.translate(-doorWidth / 2, 0, 20);
		}else{
			botDoorGeometry.translate(doorWidth / 2, 0, 20);
		}

		var botDoor = new THREE.Mesh( botDoorGeometry, this.material );

		botDoor.position.x = 0;
		botDoor.position.y = (this.par.height * 0.4 - 20) / 2;

		doorMesh.add(botDoor);

		doorMesh.position.z = this.par.depth - 40;
		if (isSecondDoor) {
			doorMesh.position.x = this.par.width;
		}
		this.add(doorMesh);

		return doorMesh;
	}

	toggleDoor(){
		if (this.doorClosed) {
			this.addAnimation('openDoor', 500);
			this.doorClosed = false;
		}else{
			this.addAnimation('closeDoor', 500)
			this.doorClosed = true;
		}
	}

	animationProgress(animationName, progress){
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

	getActions(){
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
	static getMeta(){
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