class Lustre extends AdditionalObject{
	constructor(par){
		super(par);

		var objPar = Object.assign({}, this.par)
		objPar.material = this.material;
		
		var objPar = Lustre.draw(objPar);
		this.add(objPar.mesh);

	}

	static draw(par){
		if(!par) par = {};
		initPar(par);

		var size = par.size;

		var holderGeometry = new THREE.BoxGeometry(20, 70, 20 );
		var holder = new THREE.Mesh( holderGeometry, par.material );
		holder.position.y = 10 + 70 + 35;
		par.mesh.add(holder);

		var carcasGeometry = new THREE.BoxGeometry(size, 20, 20 );
		var carcas = new THREE.Mesh( carcasGeometry, par.material );
		carcas.position.y = 10 + 70;
		par.mesh.add(carcas);

		var carcas = new THREE.Mesh( carcasGeometry, par.material );
		carcas.position.y = 10 + 70;
		carcas.rotation.y = Math.PI / 2;
		par.mesh.add(carcas);

		var plafGeometry = new THREE.BoxGeometry(50, 70, 50 );
		var plaf = new THREE.Mesh( plafGeometry, par.material );
		plaf.position.x = -size / 2;
		plaf.position.y = 35;
		par.mesh.add(plaf);

		var plaf = new THREE.Mesh( plafGeometry, par.material );
		plaf.position.x = size / 2;
		plaf.position.y = 35;
		par.mesh.add(plaf);

		var plaf = new THREE.Mesh( plafGeometry, par.material );
		plaf.position.z = -size / 2;
		plaf.position.y = 35;
		par.mesh.add(plaf);

		var plaf = new THREE.Mesh( plafGeometry, par.material );
		plaf.position.z = size / 2;
		plaf.position.y = 35;
		par.mesh.add(plaf);

		return par
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