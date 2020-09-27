class Bed extends AdditionalObject {
	constructor(par) {
		super(par);
		
		var objPar = Object.assign({}, this.par)
		objPar.dxfBasePoint = {x:0,y:0}

		var mesh = Bed.draw(objPar).mesh;
		this.add(mesh);
	}

	/** STATIC **/
	
	static draw(par){
		if(!par) par = {};
		initPar(par)
		
		var legPar = getProfParams(par.legProf)
		var bridgePar = getProfParams(par.bridgeProf)
		
		//ножки
		var polePar = {
			poleProfileY: legPar.sizeB,
			poleProfileZ: legPar.sizeA,
			dxfBasePoint: par.dxfBasePoint,
			length: par.height,
			poleAngle: Math.PI / 2,
			partName: "shelfLeg",
			material: params.materials.timber,
		}
		
		//царги
		var platePar = {
			len: par.width - legPar.sizeB * 2,
			width: bridgePar.sizeA,
			thk: bridgePar.sizeB,
			partName: "mdfPlate",
		}
				
		var pos = {
			x: [0, par.width - legPar.sizeB],
			z: [0, par.len - legPar.sizeA],
			
		}
		
		
		pos.z.forEach(function(posZ){
			pos.x.forEach(function(posX){
				//ножки
				if(posZ > 0) polePar.length = par.headBoardHeight //изголовье
				var newell = drawPole3D_4(polePar).mesh;
				newell.position.x = posX;
				newell.position.z = posZ;
				par.mesh.add(newell);		
				
				//царги поперечные
				if(posX == 0) {
					platePar.len = par.width - legPar.sizeB * 2
					platePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y)
					
					platePar.width = bridgePar.sizeA;
					if(posZ > 0) platePar.width += par.headBoardHeight - par.height  //изголовье
						
					var panel = drawPlate(platePar).mesh;
					panel.position.x = posX;
					panel.position.y = par.height - bridgePar.sizeA;
					panel.position.z = posZ + legPar.sizeB / 2 - bridgePar.sizeB / 2;
	
					par.mesh.add(panel);
				}
				if(posZ == 0) {
					//царги продольные
					platePar.len = par.len - legPar.sizeB * 2
					platePar.width = bridgePar.sizeA;
					platePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y)
					var panel = drawPlate(platePar).mesh;
					//поперечные
					panel.rotation.y = Math.PI / 2
					panel.position.x = posX - legPar.sizeB / 2 - bridgePar.sizeB / 2;
					panel.position.y = par.height - platePar.width;
					panel.position.z = par.len - legPar.sizeB;
	
					par.mesh.add(panel);
				}
			})
			
			
		})
		
		
		return par;
	}
	
	static formChange(form, data){
		var par = data.meshParams
		getObjPar()
	}
	
	static calcPrice(par){
		var meshPar = par.meshParams;
		var dopSpec = partsAmt_dop[par.id];
		var cost = 0;
		if (dopSpec) {
			// Цена крестов
			var crossProfileCost = getPartPropVal('shelfCrossProfile', 'sumLength', dopSpec) * getProfParams('20х20').unitCost;
			cost += crossProfileCost;
			// Ножки
			var legProfileCost = getPartPropVal('shelfLeg', 'sumLength', dopSpec) * getProfParams(par.meshParams.legProf).unitCost;
			cost += legProfileCost;
			// перемычки
			var bridgeProfileCost = getPartPropVal('shelfBridge', 'sumLength', dopSpec) * getProfParams(par.meshParams.bridgeProf).unitCost;
			cost += bridgeProfileCost;
			//Полки
			var countertopCost = getPartPropVal('countertop', 'vol', dopSpec) * calcTimberParams(params.additionalObjectsTimberMaterial).m3Price;
			cost += countertopCost;
			//Сварка
			var weldPrice = 100 * (getPartPropVal('shelfCrossProfile', 'amt', dopSpec) + getPartPropVal('shelfLeg', 'amt', dopSpec) + getPartPropVal('shelfBridge', 'amt', dopSpec));
			cost += weldPrice;
			//Покраска
			var paintPrice = (getPartPropVal('countertop', 'area', dopSpec) * 2) * calcTimberPaintPrice(params.timberPaint, params.additionalObjectsTimberMaterial);
			cost += paintPrice;
		}
		return {
			name: par.name || this.getMeta().title,
			cost: cost,
			priceFactor: meshPar.priceFactor || 1,
			costFactor: meshPar.costFactor || 1
		}
	}

	static getMeta() {
		return {
			title: 'Кровать',
			inputs: [
				{
					key: 'model',
					title: 'Модель',
					default: 'кантри',
					type: 'select',
					values: [
						{
							value: 'кантри',
							title: 'кантри'
						},
					
					]
				},
				{
					key: 'height',
					title: 'Высота',
					default: 400,
					type: 'number'
				},
				{
					key: 'headBoardHeight',
					title: 'Высота',
					default: 800,
					type: 'number'
				},
				{
					key: 'width',
					title: 'Ширина',
					default: 1400,
					type: 'number'
				},
				{
					key: 'len',
					title: 'Длина',
					default: 2100,
					type: 'number'
				},
				
				{
					key: 'legProf',
					title: 'Профиль ножек',
					default: '80х80',
					type: 'select',
					values: [
						{
							value: '60х60',
							title: '60х60'
						},
						{
							value: '80х80',
							title: '80х80'
						},
						{
							value: '100х100',
							title: '100х100'
						},
					]
				},
				{
					key: 'bridgeProf',
					title: 'Профиль царг',
					default: '200х40',
					type: 'select',
					values: [
						{
							value: '200х40',
							title: '200х40'
						},
						{
							value: '250х40',
							title: '250х40'
						},
					]
				},
				
				{
					type: 'delimeter',
					title: 'Цена',
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
	
	/** возвращает описание объекта.
	@param - meshParams из объекта additional_objects
	*/
	
	static getDescr(par) {

		if(!this) return {html: '', text: ''};
		var meta = this.getMeta();
		var text = "Кровать " + par.shelfAmt + " пол. " + par.height + "х" + par.width + "х" + par.depth + "мм";
		var html = "<h3>Параметры " + meta.title + "</h3>";
		html += '<table class="form_table" style="max-width: 40%"><tbody>'
		meta.inputs.forEach(function(input){
			if (input && par[input.key] && !input.hidden) {
				html += '<tr><td>' + input.title + '</td><td>' + par[input.key] + '</td></tr>';
			}
		});
		html += '</tbody></table>'
		return {html: html, text: text};
	}
}