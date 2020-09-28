class RackWall extends AdditionalObject {
	constructor(par) {
		super(par);
		
		var obj = this;
		
		var objParams = {
			dxfArr: [],
			dxfBasePoint: {
			  x: 0,
			  y: 0
			},
			posX: 0,
			posY: 0,
			posZ: 0,
			posAng: 0,
			mat: this.getObjectMaterial(),
		};
		
		var meta = RackWall.getMeta();
		meta.inputs.forEach(function(input){
			objParams[input.key] = obj.par[input.key];
		})

		obj.add(RackWall.draw(objParams).mesh);
		
	}

	static draw(par){
		return drawRackWall(par);
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
					key: 'height',
					title: 'Высота',
					default: 2000,
					type: 'number',
					"printable": "true",
				},
				{
					key: 'width',
					title: 'Ширина',
					default: 700,
					type: 'number',
					"printable": "true",
				},
				{
					key: 'step',
					title: 'Шаг',
					default: 20,
					type: 'number',
					"printable": "true",
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
					type: 'select',
					"printable": "true",
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
					],
					"printable": "true",
				},
				...AdditionalObject.defaultInputs()
			]
		}
	}
}

/** функция отрисовывает реечную перегородку от пола до потолка
*/

function drawRackWall(par){
	par.mesh = new THREE.Object3D();
	par.mesh = new THREE.Object3D();
	par.dxfArr = [];
	par.dxfBasePoint = {x:0, y:0};
	par.width = par.width * 1.0;
	par.height = par.height * 1.0;
	
	var profParams = getProfParams(par.racksProfile);

	var amt = Math.ceil(par.width / par.step);

	var polePar = {
		poleProfileY: profParams.sizeB,
		poleProfileZ: profParams.sizeA,
		dxfBasePoint: par.dxfBasePoint,
		length: par.height,
		poleAngle: 0,
		partName: par.material == 'металл' ? 'racksMetalPole' :"racksTimberPole",
		material: par.mat,
		type: profParams.type
	}

	for (var i = 0; i < amt; i++) {
		var rack = drawPole3D_4(polePar).mesh;
		rack.position.x = (par.step) * i;
		rack.rotation.z = Math.PI / 2;
		par.mesh.add(rack);
	}
	
	//горизонтальные рейки
	var polePar = {
		thk: 40,
		width: profParams.sizeA + 20,
		dxfBasePoint: {x:0,y:0},//par.dxfBasePoint,
		holeStep: par.step,
		holeProfileX: profParams.sizeB,
		holeProfileZ: profParams.sizeA,
		length: profParams.sizeB + par.step * (amt - 1),
		dxfArr: dxfPrimitivesArr,
		partName: "racksTimberPole",
		material: params.materials.timber,
	}
	
	//рейка сверху
	var topProfile = drawRackTopPole(polePar);
	topProfile.position.x = -profParams.sizeB;
	//topProfile.position.y = topProfileOffsetY;
	topProfile.position.z -= 10;
	topProfile.rotation.x = -Math.PI / 2;
	topProfile.rotation.z = -Math.PI / 2;
	par.mesh.add(topProfile);
	
	//рейка снизу
	var botProfile = drawRackTopPole(polePar);
	botProfile.position.x = topProfile.position.x;
	botProfile.position.y = par.height - 40;
	botProfile.position.z = topProfile.position.z;
	botProfile.rotation.x = topProfile.rotation.x
	botProfile.rotation.z = topProfile.rotation.z
	par.mesh.add(botProfile);
	
	return par;
}