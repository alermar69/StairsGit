class PipeObject extends AdditionalObject {
	constructor(par) {
		super(par);

		var pipeGeometry = new THREE.CylinderGeometry(this.par.diam / 2, this.par.diam / 2, this.par.length, 32);
		var pipe = new THREE.Mesh(pipeGeometry, this.material);

		pipe.position.x = 0;
		pipe.position.y = this.par.length / 2 * Math.cos(this.par.angle / 180 * Math.PI);
		pipe.position.z = 0;


		pipe.rotation.x = THREE.Math.degToRad(this.par.angle);

		this.add(pipe);
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