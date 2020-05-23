var preloadedMesh = false;

class Transport extends AdditionalObject{
	constructor(par){
		super(par);
		
		var transportInfo = {
			'suv': {
				scale: 950,
				filename:'suv'
			},
			'small':{
				filename: 'small',
				positionY: 700,
				scale: 10
			},
			'moto': {
				filename: 'motor',
				positionY: 600,
				scale: 270,
			},
			'sedan':{
				filename: 'sedan',
				scale: 25,
			}
		}
		
		var OBJFile = '/calculator/general/scene/objects/files/transport/'+this.par.type+'/'+transportInfo[this.par.type].filename+'.obj';
		var MTLFile = '/calculator/general/scene/objects/files/transport/'+this.par.type+'/'+transportInfo[this.par.type].filename+'.mtl';

		var self = this;
		if (!preloadedMesh || preloadedMesh.type != self.par.type) {
			new THREE.MTLLoader().load(MTLFile, function (materials) {
				console.log(materials)
				materials.preload();
				new THREE.OBJLoader()
					.setMaterials(materials)
					.load(OBJFile, function (object) {
						object.scale.x = transportInfo[self.par.type].scale || 1;
						object.scale.y = transportInfo[self.par.type].scale || 1;
						object.scale.z = transportInfo[self.par.type].scale || 1;
						if(transportInfo[self.par.type].positionY) object.position.y = transportInfo[self.par.type].positionY;
						if(!preloadedMesh || preloadedMesh.type != self.par.type) preloadedMesh = {mesh: object, type: self.par.type};
						self.add(object);
					});
			});
		}else{
			self.add(preloadedMesh.mesh);
		}
	}

	static getMeta(){
		return {
			title: 'Транспорт',
			inputs: [{
				key: 'type',
				title: 'Тип',
				default: 'small',
				values: [
					{value: 'small', title: 'Малолитражка'},
					{value: 'sedan', title: 'Седан'},
					{value: 'suv', title: 'Джип'},
					{value: 'moto', title: 'Мотоцикл'}
				],
				type: 'select'
			}]
		}
	}
}