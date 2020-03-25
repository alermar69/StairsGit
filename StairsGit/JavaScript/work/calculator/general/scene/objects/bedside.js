class Bedside extends AdditionalObject{
	doorClosed = true;
	doorMesh = false;

	constructor(par){
		super(par);

		var dspThickness = 15;

		var backGeometry = new THREE.BoxGeometry( this.par.width, this.par.height, 2 );
		var topGeometry = new THREE.BoxGeometry( this.par.width, dspThickness, this.par.depth );
		var sideGeometry = new THREE.BoxGeometry( dspThickness, this.par.height - dspThickness, this.par.depth );
		
		var shelfGeometry = new THREE.BoxGeometry( this.par.width - dspThickness * 2, dspThickness, this.par.depth );

		var side = new THREE.Mesh( sideGeometry, this.material );
		side.position.x = dspThickness / 2;
		side.position.y = (this.par.height - dspThickness) / 2;
		side.position.z = this.par.depth / 2;
		this.add(side);

		var side = new THREE.Mesh( sideGeometry, this.material );
		side.position.x = this.par.width - dspThickness / 2;
		side.position.y = (this.par.height - dspThickness) / 2;
		side.position.z = this.par.depth / 2;
		this.add(side);

		var back = new THREE.Mesh( backGeometry, this.material );
		back.position.x = this.par.width / 2;
		back.position.y = this.par.height / 2;
		back.position.z = -1;
		this.add(back);

		var shelf = new THREE.Mesh( shelfGeometry, this.material );
		shelf.position.x = (this.par.width) / 2;
		shelf.position.y = dspThickness / 2 + this.par.height * 0.7;
		shelf.position.z = this.par.depth / 2;
		this.add(shelf);

		var shelf = new THREE.Mesh( shelfGeometry, this.material );
		shelf.position.x = (this.par.width) / 2;
		shelf.position.y = dspThickness / 2 + this.par.height * 0.35;
		shelf.position.z = this.par.depth / 2;
		this.add(shelf);

		var shelf = new THREE.Mesh( shelfGeometry, this.material );
		shelf.position.x = (this.par.width) / 2;
		shelf.position.y = dspThickness / 2;
		shelf.position.z = this.par.depth / 2;
		this.add(shelf);

		var top = new THREE.Mesh( topGeometry, this.material );
		top.position.x = this.par.width / 2;
		top.position.y = this.par.height - dspThickness + dspThickness / 2;
		top.position.z = this.par.depth / 2;
		this.add(top);

		if (this.par.doorExist) {
			var doorGeometry = new THREE.BoxGeometry( this.par.width, this.par.height * 0.7 + dspThickness, dspThickness );
			doorGeometry.translate(this.par.width / 2, 0, dspThickness / 2);
			
			var door = new THREE.Mesh( doorGeometry, this.material );
			door.position.x = 0;
			door.position.y = (this.par.height * 0.7) / 2 + dspThickness / 2;
			door.position.z = this.par.depth;
			this.add(door);
			this.doorMesh = door;
		}
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
				this.doorMesh.rotation.y = (-Math.PI / 2) * progress;
				break;
			case 'closeDoor':
				this.doorMesh.rotation.y = -Math.PI / 2 + (Math.PI / 2) * progress;
				break;
		}
	}

	getActions(){
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
	static getMeta(){
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