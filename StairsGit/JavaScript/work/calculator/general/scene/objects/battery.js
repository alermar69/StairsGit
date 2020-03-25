class Battery extends AdditionalObject{
	constructor(par){
		super(par);
		var gap = 10;//зазор между секциями
		var sectionGeometry = new THREE.BoxGeometry( this.par.sectWidth, this.par.height, this.par.thk );
		
		var sectionsCount = Math.floor(this.par.width / (this.par.sectWidth + gap));

		for (var i = 0; i < sectionsCount; i++) {
			var section = new THREE.Mesh( sectionGeometry, this.material );
			section.position.x = i * (this.par.sectWidth + gap);
			section.position.y = this.par.height / 2;
			section.position.z = 20;
			this.add(section);
		}
	}

	static getMeta(){
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
