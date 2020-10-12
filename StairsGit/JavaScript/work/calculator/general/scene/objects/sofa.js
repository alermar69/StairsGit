class Sofa extends AdditionalObject {
	constructor(par) {
		super(par);

		var objPar = Object.assign({}, par)
		objPar.material = par.material;
		
		//par.mesh.add(Sofa.draw(objPar).mesh);
		this.add(Sofa.draw(objPar).mesh);

	}

	static draw(par){
		if(!par) par = {};
		initPar(par);

		var sideWidth = 100;

		var sideGeometry = new THREE.BoxGeometry(100, par.height, par.depth - sideWidth);
		var bottomGeometry = new THREE.BoxGeometry(par.width - sideWidth * 2, par.height / 2, par.depth - sideWidth);
		var backGeometry = new THREE.BoxGeometry(par.width, par.height, sideWidth);

		var side = new THREE.Mesh(sideGeometry, par.material);
		side.position.y = par.height / 2;
		par.mesh.add(side);

		var side2 = new THREE.Mesh(sideGeometry, par.material);
		side2.position.y = par.height / 2;
		side2.position.x = par.width - sideWidth;
		par.mesh.add(side2);

		var bottom = new THREE.Mesh(bottomGeometry, par.material);
		bottom.position.x = (par.width - sideWidth * 2) / 2 + sideWidth / 2;
		bottom.position.y = par.height / 4;
		bottom.position.z = 0.1;
		par.mesh.add(bottom);

		var back = new THREE.Mesh(backGeometry, par.material);
		back.position.x = par.width / 2 - sideWidth / 2;
		back.position.y = par.height / 2;
		back.position.z = -par.depth / 2;
		par.mesh.add(back);

		return par
	}

	static getMeta() {
		return {
			title: 'Диван',
			inputs: [
				{
					key: 'height',
					title: 'Высота',
					default: 600,
					type: 'number'
				},
				{
					key: 'width',
					title: 'Ширина',
					default: 1000,
					type: 'number'
				},
				{
					key: 'depth',
					title: 'Глубина',
					default: 600,
					type: 'number'
				}
			]
		}
	}
}