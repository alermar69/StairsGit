class Lustre extends AdditionalObject{
	constructor(par){
		super(par);

		var size = this.par.size;

		var holderGeometry = new THREE.BoxGeometry(20, 70, 20 );
		var holder = new THREE.Mesh( holderGeometry, this.material );
		holder.position.y = 10 + 70 + 35;
		this.add(holder);

		var carcasGeometry = new THREE.BoxGeometry(size, 20, 20 );
		var carcas = new THREE.Mesh( carcasGeometry, this.material );
		carcas.position.y = 10 + 70;
		this.add(carcas);

		var carcas = new THREE.Mesh( carcasGeometry, this.material );
		carcas.position.y = 10 + 70;
		carcas.rotation.y = Math.PI / 2;
		this.add(carcas);

		var plafGeometry = new THREE.BoxGeometry(50, 70, 50 );
		var plaf = new THREE.Mesh( plafGeometry, this.material );
		plaf.position.x = -size / 2;
		plaf.position.y = 35;
		this.add(plaf);

		var plaf = new THREE.Mesh( plafGeometry, this.material );
		plaf.position.x = size / 2;
		plaf.position.y = 35;
		this.add(plaf);

		var plaf = new THREE.Mesh( plafGeometry, this.material );
		plaf.position.z = -size / 2;
		plaf.position.y = 35;
		this.add(plaf);

		var plaf = new THREE.Mesh( plafGeometry, this.material );
		plaf.position.z = size / 2;
		plaf.position.y = 35;
		this.add(plaf);

	}

	static getMeta(){
		return {
			title: 'Люстра',
			inputs: [{
				key: 'size',
				title: 'Размер',
				default: 500,
				type: 'number'
			}]
		}
	}
}