class RackWall extends AdditionalObject {
	constructor(par) {
		super(par);
		var profParams = getProfParams(this.par.racksProfile);

		var rackProfileZ = profParams.sizeA;
		var rackProfileX = profParams.sizeB;

		// var racksCount = this.par.width / (this.par.step + rackProfileX);
		var racksCount = Math.ceil(this.par.width / (this.par.step + rackProfileX));
		var rackWall = new THREE.Object3D();
		// var rackGeometry = new THREE.BoxGeometry(rackProfileX, this.par.height, rackProfileZ);
		
		var material = this.getObjectMaterial();

		var polePar = {
			poleProfileY: rackProfileX,
			poleProfileZ: rackProfileZ,
			dxfBasePoint: par.dxfBasePoint,
			length: this.par.height,
			poleAngle: 0,
			partName: this.par.material == 'металл' ? 'racksMetalPole' :"racksTimberPole",
			material: material,
			type: profParams.type
		}

		for (var i = 0; i < racksCount; i++) {
			var rack = drawPole3D_4(polePar).mesh;
			rack.position.x = (rackProfileX + this.par.step) * i;
			rack.rotation.z = Math.PI / 2;
			rackWall.add(rack);
		}

		this.add(rackWall);
	}

	static calcPrice(par){
		var meshPar = par.meshParams;
		var dopSpec = partsAmt_dop[par.id];
		var cost = 0;
		if (dopSpec) {	
			var ralingPricePar = {
				racksLength: meshPar.material == "металл" ? getPartPropVal("racksMetalPole", "sumLength", dopSpec) : getPartPropVal("racksTimberPole", "sumLength", dopSpec),
				racksProfile: meshPar.racksProfile,
				racksType: meshPar.material,
				racksMaterial: params.additionalObjectsTimberMaterial
			};
			var railingPrices = calcRackWallPrice(ralingPricePar);
			cost = railingPrices.balPrice + railingPrices.paintPrice;
		}

		return {
			name: this.getMeta().title,
			cost: cost,
			priceFactor: meshPar.priceFactor || 1,
			costFactor: meshPar.costFactor || 1
		}
	}

	/** STATIC **/
	static getMeta() {
		return {
			title: 'Реечная перегородка',
			inputs: [
				{
					key: 'priceFactor',
					title: 'К-т на цену',
					default: 1,
					type: 'number'
				},
				{
					key: 'costFactor',
					title: 'К-т на себестоимость',
					default: 1,
					type: 'number'
				},
				{
					type: 'delimeter'
				},
				{
					key: 'height',
					title: 'Высота',
					default: 2000,
					type: 'number'
				},
				{
					key: 'width',
					title: 'Ширина',
					default: 700,
					type: 'number'
				},
				{
					key: 'step',
					title: 'Шаг',
					default: 20,
					type: 'number'
				},
				{
					key: 'material',
					title: 'Материал',
					default: 'массив',
					values: [
						{
							value: 'массив',
							title: 'Дерево'
						},
						{
							value: 'металл',
							title: 'Металл'
						}
					],
					type: 'select'
				},
				{
					key: 'racksProfile',
					title: 'Тип реек',
					default: '40х40',
					type: 'select',
					values: [
						{
							value: '20х20',
							title: '20х20'
						},
						{
							value: '40х40',
							title: '40х40'
						},
						{
							value: '50х50',
							title: '50х50'
						},
						{
							value: '60х60',
							title: '60х60'
						},
						{
							value: '40х20',
							title: '40х20'
						},
						{
							value: '60х30',
							title: '60х30'
						},
						{
							value: '60х40',
							title: '60х40'
						},
						{
							value: '80х40',
							title: '80х40'
						},
						{
							value: '100х40',
							title: '100х40'
						},
						{
							value: 'Ф12',
							title: 'Ф12'
						},
						{
							value: 'Ф16',
							title: 'Ф16'
						},
						{
							value: 'Ф25',
							title: 'Ф25'
						},
						{
							value: 'Ф38',
							title: 'Ф38'
						}
					]
				}
			]
		}
	}
}