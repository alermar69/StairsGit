class Battery extends AdditionalObject {
	constructor(par) {
		super(par);
		var objPar = Object.assign({}, this.par);
		objPar.material = this.material;
		var mesh = Battery.draw(objPar).mesh;
		this.add(mesh);
	}

	static draw(par){
		if(!par) par = {};
		initPar(par);

		var gap = 10;//зазор между секциями
		var sectionGeometry = new THREE.BoxGeometry(par.sectWidth, par.height, par.thk);

		var sectionsCount = Math.floor(par.width / (par.sectWidth + gap));

		for (var i = 0; i < sectionsCount; i++) {
			var section = new THREE.Mesh(sectionGeometry, par.material);
			section.position.x = i * (par.sectWidth + gap);
			section.position.y = par.height / 2;
			section.position.z = 20;
			par.mesh.add(section);
		}

		return par
	}

	static getMeta() {
		return {
			title: 'Батарея',
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
					key: 'thk',
					title: 'Толщина',
					default: 80,
					type: 'number'
				},
				{
					key: 'sectWidth',
					title: 'Секция',
					default: 80,
					type: 'number'
				}
			]
		}
	}
}