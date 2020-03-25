class Tv extends AdditionalObject{
	constructor(par){
		super(par);

		var tvGeometry = new THREE.BoxGeometry(this.par.width, this.par.height, 20 );
		var tv = new THREE.Mesh( tvGeometry, this.material );
		tv.position.x = this.par.width / 2;
		tv.position.y = this.par.height / 2;
		tv.position.z = 10;
		if (this.par.standExist) tv.position.y += 30;

		var tvBlackGeometry = new THREE.BoxGeometry(this.par.width - 20, this.par.height - 20, 1 );
		var tvBlack = new THREE.Mesh( tvBlackGeometry, new THREE.MeshBasicMaterial( {color: 0x000000} ) );
		tvBlack.position.x = this.par.width / 2;
		tvBlack.position.y = this.par.height / 2;
		tvBlack.position.z = 20;
		if (this.par.standExist) tvBlack.position.y += 30;

		this.add(tv, tvBlack);

		if (this.par.standExist) {
			var standGeometry = new THREE.BoxGeometry(40, this.par.height / 2 + 20, 20 );
			var stand = new THREE.Mesh( standGeometry, this.material );
			stand.position.x = this.par.width / 2 + 20;
			stand.position.y = ( this.par.height / 2 + 20) / 2;
			stand.position.z = 0;
			this.add(stand);

			var standBotGeometry = new THREE.BoxGeometry(this.par.width * 0.3, 10, 100 );
			var standBot = new THREE.Mesh( standBotGeometry, this.material );
			standBot.position.x = this.par.width / 2;
			standBot.position.y = 5;
			standBot.position.z = 25;
			this.add(standBot);
		}else{
			var standGeometry = new THREE.BoxGeometry(this.par.width * 0.3, this.par.height * 0.3, 20 );
			var stand = new THREE.Mesh( standGeometry, this.material );
			stand.position.x = this.par.width / 2;
			stand.position.y = this.par.height / 2;
			stand.position.z = 0;
			this.add(stand);
		}
	}

	static getMeta(){
		return {
			title: 'Телевизор',
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
					key: 'standExist',
					title: 'Подставка имеется',
					default: true,
					type: 'boolean'
				}
			]
		}
	}
}