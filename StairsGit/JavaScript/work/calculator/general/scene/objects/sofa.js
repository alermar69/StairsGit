class Sofa extends AdditionalObject {
	constructor(par) {
		super(par);

		var sideWidth = 100;

		var sideGeometry = new THREE.BoxGeometry(100, this.par.height, this.par.depth - sideWidth);
		var bottomGeometry = new THREE.BoxGeometry(this.par.width - sideWidth * 2, this.par.height / 2, this.par.depth - sideWidth);
		var backGeometry = new THREE.BoxGeometry(this.par.width, this.par.height, sideWidth);

		var side = new THREE.Mesh(sideGeometry, this.material);
		side.position.y = this.par.height / 2;
		this.add(side);

		var side2 = new THREE.Mesh(sideGeometry, this.material);
		side2.position.y = this.par.height / 2;
		side2.position.x = this.par.width - sideWidth;
		this.add(side2);

		var bottom = new THREE.Mesh(bottomGeometry, this.material);
		bottom.position.x = (this.par.width - sideWidth * 2) / 2 + sideWidth / 2;
		bottom.position.y = this.par.height / 4;
		bottom.position.z = 0.1;
		this.add(bottom);

		var back = new THREE.Mesh(backGeometry, this.material);
		back.position.x = this.par.width / 2 - sideWidth / 2;
		back.position.y = this.par.height / 2;
		back.position.z = -this.par.depth / 2;
		this.add(back);
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