var preloadedMesh = false;
var objPath = "/images/obj/cars/";

class Transport extends AdditionalObject{
	constructor(par){
		super(par);
		
		var meta = Transport.getMeta();
		var transportInfo = {};
		
		
		$.each(meta.inputs[0].values, function(){
			transportInfo[this.value] = {
				filename: this.value,
				posY: this.posY,
				scale: this.scale,
			}
		})
	
		var OBJFile = objPath + this.par.type + '/' + transportInfo[this.par.type].filename + '.obj';
		var MTLFile = objPath + this.par.type + '/' + transportInfo[this.par.type].filename + '.mtl';

		var self = this;
		new THREE.MTLLoader().load(MTLFile, function (materials) {
			console.log(materials)
			materials.preload();
			new THREE.OBJLoader()
				.setMaterials(materials)
				.load(OBJFile, function (object) {
					object.scale.x = transportInfo[self.par.type].scale * self.par.scale;
					object.scale.y = transportInfo[self.par.type].scale * self.par.scale;
					object.scale.z = transportInfo[self.par.type].scale * self.par.scale;
					if(transportInfo[self.par.type].posY) object.position.y = transportInfo[self.par.type].posY;
					if(transportInfo[self.par.type].rotY) object.rotation.y = transportInfo[self.par.type].rotY;
					if(!preloadedMesh || preloadedMesh.type != self.par.type) preloadedMesh = {mesh: object, type: self.par.type};
					self.add(object);
				});
		});
		// if (!preloadedMesh || preloadedMesh.type != self.par.type || !preloadedMesh.mesh) {
		// }else{
		// 	// console.log(preloadedMesh.mesh)
		// 	self.add(preloadedMesh.mesh.copy());
		// }
	}

	static getMeta(){
		var meta = {
			title: 'Транспорт',
			inputs: [
				{
					key: 'type',
					title: 'Модель',
					default: 'Toyota_Camry',
					values: [					
						{value: 'Toyota_Camry', posY: 0, scale: 30,},
						{value: 'Audi_Q7', posY: 780, scale: 250,},
						{value: 'Cadillac_CTS', posY: 695, scale: 250,},
						{value: 'Chrysler_300', posY: 720, scale: 250,},
						{value: 'Fiat_Punto', posY: 720, scale: 250,},
						{value: 'Ford_Mustang', posY: 695, scale: 250,},
						{value: 'Honda_Civic', posY: 695, scale: 250,},
						{value: 'Mercedes_R-Class', posY: 780, scale: 250,},
						{value: 'Mercedes_S-Class', posY: 695, scale: 250,},
						{value: 'Nissan_Altima', posY: 695, scale: 250,},
						{value: 'Nissan_Maxima', posY: 780, scale: 250,},
						{value: 'Opel_Meriva', posY: 780, scale: 250,},
						{value: 'RangeRover', posY: 800, scale: 250,},
						{value: 'Saab_93', posY: 700, scale: 250,},
						{value: 'Toyota_Matrix', posY: 787, scale: 250,},
						{value: 'Toyota_RAV4', posY: 800, scale: 250,},
					],
					type: 'select'
				},
				{
					key: 'scale',
					title: 'Масштаб',
					default: 1,
					type: 'number'
				},
			]
		};
		
		//назначаем title равным value
		$.each(meta.inputs[0].values, function(){
			if(!this.title) this.title = this.value;
		})
		
		return meta;
	}
}

