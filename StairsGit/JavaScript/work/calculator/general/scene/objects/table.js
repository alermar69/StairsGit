<<<<<<< HEAD
class Table extends AdditionalObject{
	constructor(par){
		super(par);
		var legGeometry = new THREE.BoxGeometry( 40, this.par.height - this.par.tableTopWidth, 40 );
		var tableTopGeometry = new THREE.BoxGeometry( this.par.width, this.par.tableTopWidth, this.par.length );

		var leg1 = new THREE.Mesh( legGeometry, this.material );
		leg1.position.x = 20;
		leg1.position.y = this.par.height / 2 - this.par.tableTopWidth / 2;
		leg1.position.z = 20;
		this.add(leg1);

		var leg2 = new THREE.Mesh( legGeometry, this.material );
		leg2.position.x = this.par.width - 20;
		leg2.position.y = this.par.height / 2 - this.par.tableTopWidth / 2;
		leg2.position.z = 20;
		this.add(leg2);

		var leg3 = new THREE.Mesh( legGeometry, this.material );
		leg3.position.x = 20;
		leg3.position.y = this.par.height / 2 - this.par.tableTopWidth / 2;
		leg3.position.z = this.par.length - 20;
		this.add(leg3);

		var leg4 = new THREE.Mesh( legGeometry, this.material );
		leg4.position.x = this.par.width - 20;
		leg4.position.y = this.par.height / 2 - this.par.tableTopWidth / 2;
		leg4.position.z = this.par.length - 20;
		this.add(leg4);
		
		var tableTop = new THREE.Mesh( tableTopGeometry, this.material );
		tableTop.position.x = this.par.width / 2;
		tableTop.position.y = this.par.height - this.par.tableTopWidth / 2;
		tableTop.position.z = this.par.length / 2;

		this.add(tableTop);
	}

	static getMeta(){
		return {
			title: 'Стол',
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
					key: 'length',
					title: 'Длина',
					default: 1500,
					type: 'number'
				},
				{
					key: 'tableTopWidth',
					title: 'Толщина столешницы',
					default: 40,
					type: 'number'
				}
			]
		}
	}
}
=======
class Table extends AdditionalObject{
	constructor(par){
		super(par);
		var legGeometry = new THREE.BoxGeometry( 40, this.par.height - this.par.tableTopWidth, 40 );
		var tableTopGeometry = new THREE.BoxGeometry( this.par.width, this.par.tableTopWidth, this.par.length );

		var leg1 = new THREE.Mesh( legGeometry, this.material );
		leg1.position.x = 20;
		leg1.position.y = this.par.height / 2 - this.par.tableTopWidth / 2;
		leg1.position.z = 20;
		this.add(leg1);

		var leg2 = new THREE.Mesh( legGeometry, this.material );
		leg2.position.x = this.par.width - 20;
		leg2.position.y = this.par.height / 2 - this.par.tableTopWidth / 2;
		leg2.position.z = 20;
		this.add(leg2);

		var leg3 = new THREE.Mesh( legGeometry, this.material );
		leg3.position.x = 20;
		leg3.position.y = this.par.height / 2 - this.par.tableTopWidth / 2;
		leg3.position.z = this.par.length - 20;
		this.add(leg3);

		var leg4 = new THREE.Mesh( legGeometry, this.material );
		leg4.position.x = this.par.width - 20;
		leg4.position.y = this.par.height / 2 - this.par.tableTopWidth / 2;
		leg4.position.z = this.par.length - 20;
		this.add(leg4);
		
		var tableTop = new THREE.Mesh( tableTopGeometry, this.material );
		tableTop.position.x = this.par.width / 2;
		tableTop.position.y = this.par.height - this.par.tableTopWidth / 2;
		tableTop.position.z = this.par.length / 2;

		this.add(tableTop);
	}

	static getMeta(){
		return {
			title: 'Стол',
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
					key: 'length',
					title: 'Длина',
					default: 1500,
					type: 'number'
				},
				{
					key: 'tableTopWidth',
					title: 'Толщина столешницы',
					default: 40,
					type: 'number'
				}
			]
		}
	}
}
>>>>>>> curve
