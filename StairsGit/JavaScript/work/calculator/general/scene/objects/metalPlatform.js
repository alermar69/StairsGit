class MetalPlatform extends AdditionalObject{
	constructor(par){
		super(par);
		var obj = this;
		if (!par) par = obj.par;
		console.log(par);
		
		var sectParams = {
			dxfArr: [],
			dxfBasePoint: {
			  x: 0,
			  y: 0
			},
			posX: 0,
			posY: 0,
			posZ: 0,
			posAng: 0,
			material: obj.material
		};
		
		var meta = MetalPlatform.getMeta();
		console.log(obj.par);
		meta.inputs.forEach(function(input){
			sectParams[input.key] = obj.par[input.key];
		})

		obj.add(MetalPlatform.draw(sectParams).mesh);
	}
	
	static draw(par){
		return drawMetalPlatform(par)
	}

	static calcPrice(par){
		var meshPar = par.meshParams;
		var dopSpec = partsAmt_dop[par.id];
		var cost = 0;
		if (dopSpec) {
			var midPositions = ['front','rear','right','left','mid'];

			// Считаем стоимость профилей
			midPositions.forEach(function(pos){
				var beamLength = getPartPropVal('platformBeam_' + pos, 'sumLength', dopSpec);
				var beamCost = getProfParams(par.meshParams['beamProf_' + pos]).unitCost * beamLength;
				cost += beamCost;
				console.log(pos, beamLength, beamCost, )
			});

			if (par.meshParams.coverType != 'нет') {
				var platformArea = getPartPropVal('platformPlate', 'area', dopSpec);
				if (par.meshParams.coverType == 'ступени') var treadMeterPrice = calcTimberParams(params.treadsMaterial).m3Price * (params.treadThickness / 1000);
				if (par.meshParams.coverType == 'фанера 21мм') var treadMeterPrice = 525;
				cost += platformArea * treadMeterPrice;
			}
		}

		return {
			name: par.name || this.getMeta().title,
			cost: cost,
			priceFactor: meshPar.priceFactor || 1,
			costFactor: meshPar.costFactor || 1
		}
	}

	static getMeta(){
		//справочник профилей
		var profiles = ['60х30', '80х40', '100х50', '-150х8', '-200х8', '-250х8', 'нет']
		var _profiles = [];
		profiles.forEach(function(name){
			var item = {value: name, title: name};
			_profiles.push(item)
		})
		
		return {
			title: 'Площадка металл',
			inputs: [
				{
					key: 'len',
					title: 'Длина',
					default: 2000,
					type: 'number',
					"printable": "true",
				},
				{
					key: 'width',
					title: 'Ширина',
					default: 900,
					type: 'number',
					"printable": "true",
				},
				{
					key: 'beamStep',
					title: 'Шаг перемычек',
					default: 500,
					type: 'number'
				},
				
				{
					key: 'beamProf_front',
					title: 'Профиль передний',
					default: '-200х8',
					values: _profiles,
					type: 'select'
				},
				
				{
					key: 'beamProf_rear',
					title: 'Профиль задний',
					default: '-200х8',
					values: _profiles,
					type: 'select'
				},
				
				{
					key: 'beamProf_left',
					title: 'Профиль левый',
					default: '-200х8',
					values: _profiles,
					type: 'select'
				},
				
				{
					key: 'beamProf_right',
					title: 'Профиль правый',
					default: '-200х8',
					values: _profiles,
					type: 'select'
				},
				
				{
					key: 'beamProf_mid',
					title: 'Профиль перемычек',
					default: '80х40',
					values: _profiles,
					type: 'select'
				},
				
				{
					key: 'coverType',
					title: 'Покрытие',
					default: 'фанера 21мм',
					values: [
						{
							value: 'фанера 21мм',
							title: 'фанера 21мм'
						},
						{
							value: 'нет',
							title: 'нет'
						},
						{
							value: 'ступени',
							title: 'ступени'
						},
						],
					type: 'select',
					"printable": "true",
				},
				{
					type: 'delimeter'
				},
				{
					key: 'priceFactor',
					title: 'К-т на цену',
					default: 1,
					hidden: true,
					type: 'number'
				},
				{
					key: 'costFactor',
					title: 'К-т на себестоимость',
					default: 1,
					hidden: true,
					type: 'number'
				},
			]
		}
	}
}

function drawMetalPlatform(par){
	par.mesh = new THREE.Object3D();
	par.dxfArr = [];
	par.dxfBasePoint = {x:0, y:0};
	par.width = par.width * 1.0;
	par.len = par.len * 1.0;
	
	var thk_front = 0;
	var thk_rear = 0;

	// боковые стороны из профиля
	if (!par.isSideStringer) {
		//передняя балка
		if (par.beamProf_front != "нет") {
			var profPar = getProfParams(par.beamProf_front);
			var poleParams = {
				poleProfileY: profPar.sizeA,
				poleProfileZ: profPar.sizeB,
				length: par.len,
				partName: 'platformBeam_front'

			}
			var pole = drawPole3D_4(poleParams).mesh
			pole.rotation.y = Math.PI / 2;
			pole.position.y = -profPar.sizeA;
			par.mesh.add(pole);
			thk_front = profPar.sizeB;
		}

		//задняя балка
		if (par.beamProf_rear != "нет") {
			var profPar = getProfParams(par.beamProf_rear);
			var poleParams = {
				poleProfileY: profPar.sizeA,
				poleProfileZ: profPar.sizeB,
				length: par.len,
				partName: 'platformBeam_rear'
			}
			var pole = drawPole3D_4(poleParams).mesh
			pole.rotation.y = Math.PI / 2;
			pole.position.x = par.width - profPar.sizeB;
			pole.position.y = -profPar.sizeA;
			par.mesh.add(pole);
			thk_rear = profPar.sizeB;
		}

		//правая балка
		if (par.beamProf_right != "нет") {
			var profPar = getProfParams(par.beamProf_right);
			var poleParams = {
				poleProfileY: profPar.sizeA,
				poleProfileZ: profPar.sizeB,
				length: par.width - thk_front - thk_rear,
				partName: 'platformBeam_right'
			}
			var pole = drawPole3D_4(poleParams).mesh
			pole.position.x = thk_front;
			pole.position.y = -profPar.sizeA;
			pole.position.z = - profPar.sizeB;
			par.mesh.add(pole);
		}

		//левая балка
		if (par.beamProf_left != "нет") {
			var profPar = getProfParams(par.beamProf_left);
			var poleParams = {
				poleProfileY: profPar.sizeA,
				poleProfileZ: profPar.sizeB,
				length: par.width - thk_front - thk_rear,
				partName: 'platformBeam_left'
			}
			var pole = drawPole3D_4(poleParams).mesh
			pole.position.x = thk_front;
			pole.position.y = -profPar.sizeA;
			pole.position.z = -par.len;
			par.mesh.add(pole);
		}
	}

	// боковые стороны в виде тетив
	if (par.isSideStringer) {
		var profPar = getProfParams(par.beamProf_mid);

		//передняя тетива
		var stringerPar = {
			stringerThickness: par.stringerThickness,
			stringerWidth: par.stringerWidth,
			length: par.len + par.stringerThickness * 2,
			dxfBasePoint: par.dxfBasePoint,
			posCoumns: par.posCoumns,
			profileY: profPar.sizeA,
			isHoleColumn: true,
			isFront: true,
		}

		var stringer = drawSideStringerPlt(stringerPar).mesh
		stringer.rotation.y = Math.PI / 2;
		stringer.position.y = -par.stringerWidth + params.treadThickness;
		stringer.position.x = -par.stringerThickness;
		stringer.position.z = par.stringerThickness;
		par.mesh.add(stringer);


		//задняя тетива
		stringerPar.isRear = true;

		var stringer = drawSideStringerPlt(stringerPar).mesh
		stringer.rotation.y = Math.PI / 2;
		stringer.position.y = -par.stringerWidth + params.treadThickness;
		stringer.position.x = par.width;
		stringer.position.z = par.stringerThickness;
		par.mesh.add(stringer);

		//правая тетива
		stringerPar.length = par.width;
		stringerPar.isHoleColumn = false;
		stringerPar.isFront = false;
		stringerPar.isRear = false;

		var stringer = drawSideStringerPlt(stringerPar).mesh
		stringer.position.y = -par.stringerWidth + params.treadThickness;
		par.mesh.add(stringer);

		//левая тетива
		var stringer = drawSideStringerPlt(stringerPar).mesh
		stringer.position.y = -par.stringerWidth + params.treadThickness;
		stringer.position.z = -par.len - par.stringerThickness;
		par.mesh.add(stringer);
	}

	//перемычки
	var profPar = getProfParams(par.beamProf_mid);
	var poleParams = {
		poleProfileY: profPar.sizeA,
		poleProfileZ: profPar.sizeB,
		length: par.width - thk_front - thk_rear,
		partName: 'platformBeam_mid'
	}
		
	var beamAmt = Math.ceil(par.len / par.beamStep);
	var beamStep = par.len / beamAmt;

	for(var i=1; i<beamAmt; i++){
		var pole = drawPole3D_4(poleParams).mesh
		pole.position.x = thk_front;
		pole.position.y = -profPar.sizeA;
		pole.position.z = -beamStep * i - profPar.sizeB / 2;
		par.mesh.add(pole);
	}
	
	//покрытие
	if(par.coverType != "нет"){
		var coverThk = 21
		if(par.coverType == "ступени") coverThk = params.treadThickness;
		
		var panelParams = {		
			width: par.width,
			len: par.len,
			thk: coverThk,
			material: params.materials.tread,
			partName: 'platformPlate'
		}


		var cover = drawPlate(panelParams).mesh
		cover.rotation.x = Math.PI / 2;
		cover.rotation.z = -Math.PI / 2;
		cover.position.y = coverThk
		par.mesh.add(cover);
	
	}
	
	
	
	return par;
}//end of drawMetalPlatform
