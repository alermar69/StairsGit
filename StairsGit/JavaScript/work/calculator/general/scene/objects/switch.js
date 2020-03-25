<<<<<<< HEAD
class Switch extends AdditionalObject{
	constructor(par){
		super(par);

		var platformGeometry = new THREE.BoxGeometry( this.par.width, this.par.height, 10 );
		var buttonGeometry = new THREE.BoxGeometry( this.par.width * 0.8, this.par.height * 0.8, 5 );

		var platform = new THREE.Mesh( platformGeometry, this.material );
		platform.position.x = this.par.width / 2;
		platform.position.y = this.par.height / 2;
		platform.position.z = 5;
		this.add(platform);

		var button = new THREE.Mesh( buttonGeometry, this.material );
		button.position.x = this.par.width / 2;
		button.position.y = this.par.height / 2;
		button.position.z = 10;
		button.rotation.x = THREE.Math.degToRad(-3);
		this.add(button);

	}

	/** STATIC **/
	static getMeta(){
		return {
			title: 'Выключатель',
			inputs: [
				{
					key: 'height',
					title: 'Высота',
					default: 70,
					type: 'number'
				},
				{
					key: 'width',
					title: 'Ширина',
					default: 70,
					type: 'number'
				}
			]
		}
	}
=======
class Switch extends AdditionalObject{
	constructor(par){
		super(par);

		var platformGeometry = new THREE.BoxGeometry( this.par.width, this.par.height, 10 );
		var buttonGeometry = new THREE.BoxGeometry( this.par.width * 0.8, this.par.height * 0.8, 5 );

		var platform = new THREE.Mesh( platformGeometry, this.material );
		platform.position.x = this.par.width / 2;
		platform.position.y = this.par.height / 2;
		platform.position.z = 5;
		this.add(platform);

		var button = new THREE.Mesh( buttonGeometry, this.material );
		button.position.x = this.par.width / 2;
		button.position.y = this.par.height / 2;
		button.position.z = 10;
		button.rotation.x = THREE.Math.degToRad(-3);
		this.add(button);

	}

	/** STATIC **/
	static getMeta(){
		return {
			title: 'Выключатель',
			inputs: [
				{
					key: 'height',
					title: 'Высота',
					default: 70,
					type: 'number'
				},
				{
					key: 'width',
					title: 'Ширина',
					default: 70,
					type: 'number'
				}
			]
		}
	}
>>>>>>> curve
}