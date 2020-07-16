class Chair extends AdditionalObject {
	constructor(par) {
		super(par);

		var height = 1000;
		var width = 400;

		var legGeometry = new THREE.BoxGeometry(40, height * 0.4 - 40, 40);
		var botGeometry = new THREE.BoxGeometry(width, 40, width);
		var spinGeometry = new THREE.BoxGeometry(width, height * 0.6, 40);

		var leg1 = new THREE.Mesh(legGeometry, this.material);
		leg1.position.x = 20;
		leg1.position.y = (height * 0.4) / 2 - 20;
		leg1.position.z = 20;
		this.add(leg1);

		var leg2 = new THREE.Mesh(legGeometry, this.material);
		leg2.position.x = width - 20;
		leg2.position.y = (height * 0.4) / 2 - 20;
		leg2.position.z = 20;
		this.add(leg2);

		var leg3 = new THREE.Mesh(legGeometry, this.material);
		leg3.position.x = 20;
		leg3.position.y = (height * 0.4) / 2 - 20;
		leg3.position.z = width - 20;
		this.add(leg3);

		var leg4 = new THREE.Mesh(legGeometry, this.material);
		leg4.position.x = width - 20;
		leg4.position.y = (height * 0.4) / 2 - 20;
		leg4.position.z = width - 20;
		this.add(leg4);

		var bot = new THREE.Mesh(botGeometry, this.material);
		bot.position.x = width / 2;
		bot.position.y = height * 0.4 - 40 / 2;
		bot.position.z = width / 2;
		this.add(bot);

		if (this.par.spinExist) {
			var spin = new THREE.Mesh(spinGeometry, this.material);
			spin.position.x = width / 2;
			spin.position.y = height * 0.4 + (height * 0.6) / 2;
			spin.position.z = 20;
			this.add(spin);
		}
	}

	static getMeta() {
		return {
			title: 'Стул',
			inputs: [
				{
					key: 'spinExist',
					title: 'Спинка есть?',
					default: true,
					type: 'boolean'
				}
			]
		}
	}
}