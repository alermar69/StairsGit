class PipeObject extends AdditionalObject {
	constructor(par) {
		super(par);
		var objPar = Object.assign({}, this.par)
		objPar.material = this.material;
		
		this.add(PipeObject.draw(objPar).mesh);
	}

	static draw(par){
		if(!par) par = {};
		initPar(par);

		var pipeGeometry = new THREE.CylinderGeometry(par.diam / 2, par.diam / 2, par.length, 32);
		var pipe = new THREE.Mesh(pipeGeometry, par.material);

		pipe.position.x = 0;
		pipe.position.y = par.length / 2 * Math.cos(par.angle / 180 * Math.PI);
		pipe.position.z = 0;


		pipe.rotation.x = THREE.Math.degToRad(par.angle);

		par.mesh.add(pipe);

		return par
	}

	/** STATIC **/
	static getMeta() {
		return {
			title: 'Труба',
			inputs: [
				{
					key: 'length',
					title: 'Длинна',
					default: 500,
					type: 'number'
				},
				{
					key: 'diam',
					title: 'Диаметр',
					default: 50,
					type: 'number'
				},
				{
					key: 'angle',
					title: 'Наклон',
					default: 0,
					type: 'number'
				}
			]
		}
	}
}