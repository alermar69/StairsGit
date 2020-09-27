class WallLamp extends AdditionalObject{
	constructor(par){
		super(par);

		var objPar = Object.assign({}, this.par)
		objPar.material = this.material;
		
		this.add(WallLamp.draw(objPar).mesh);

		var size = this.par.size;

		if (this.par.type == 1) {
			var holderGeometry = new THREE.BoxGeometry(20, 20, 50 );
			var holder = new THREE.Mesh( holderGeometry, this.material );
			holder.position.z = 25;
			holder.position.y = 10;
			this.add(holder);
	
			var holder2Geometry = new THREE.BoxGeometry(20, 50, 20 );
			var holder = new THREE.Mesh( holder2Geometry, this.material );
			holder.position.z = 50 + 10;
			holder.position.y = 25;
			this.add(holder);
	
			var plafGeometry = new THREE.BoxGeometry(50, 70, 50 );
			var plaf = new THREE.Mesh( plafGeometry, this.material );
			plaf.position.z = 50 + 10;
			plaf.position.y = 35 + 50;
			this.add(plaf);
		}
		if (this.par.type == 2) {
			var size = 250;
			var holderPlateGeometry = new THREE.BoxGeometry(size, 50, 1 );
			var holderPlate = new THREE.Mesh( holderPlateGeometry, this.material );
			holderPlate.position.z = 0.5;
			holderPlate.position.y = 25;
			this.add(holderPlate);

			var holderGeometry = new THREE.BoxGeometry(20, 20, 50 );
			var holder = new THREE.Mesh( holderGeometry, this.material );
			holder.position.x = -size / 2 + size / 4;
			holder.position.z = 25;
			holder.position.y = 10;
			this.add(holder);
	
			var holder2Geometry = new THREE.BoxGeometry(20, 50, 20 );
			var holder = new THREE.Mesh( holder2Geometry, this.material );
			holder.position.x = -size / 2 + size / 4;
			holder.position.z = 50 + 10;
			holder.position.y = 25;
			this.add(holder);

			var plafGeometry = new THREE.BoxGeometry(50, 70, 50 );
			var plaf = new THREE.Mesh( plafGeometry, this.material );
			plaf.position.x = -size / 2 + size / 4;
			plaf.position.z = 50 + 10;
			plaf.position.y = 35 + 50;
			this.add(plaf);

			var holderGeometry = new THREE.BoxGeometry(20, 20, 50 );
			var holder = new THREE.Mesh( holderGeometry, this.material );
			holder.position.x = size / 2 - size / 4;
			holder.position.z = 25;
			holder.position.y = 10;
			this.add(holder);
	
			var holder2Geometry = new THREE.BoxGeometry(20, 50, 20 );
			var holder = new THREE.Mesh( holder2Geometry, this.material );
			holder.position.x = size / 2 - size / 4;
			holder.position.z = 50 + 10;
			holder.position.y = 25;
			this.add(holder);
	
			var plafGeometry = new THREE.BoxGeometry(50, 70, 50 );
			var plaf = new THREE.Mesh( plafGeometry, this.material );
			plaf.position.x = size / 2 - size / 4;
			plaf.position.z = 50 + 10;
			plaf.position.y = 35 + 50;
			this.add(plaf);
		}

	}

	static draw(par){
		if(!par) par = {};
		initPar(par);

		return par
	}

	static getMeta(){
		return {
			title: 'Люстра',
			inputs: [{
				key: 'type',
				title: 'Тип',
				default: 1,
				values: [
					{value: 1, title: 1},
					{value: 2, title: 2}
				],
				type: 'select'
			}]
		}
	}
}