/** стеллажи, полки **/
class Shelf extends AdditionalObject {
	constructor(par) {
		super(par);
		
		var shelfPar = Object.assign({}, this.par)
		shelfPar.dxfBasePoint = {x:0,y:0}

		this.add(Shelf.draw(shelfPar).mesh);
	}

	/** STATIC **/

	static draw(par){
		if(!par) par = {};
		initPar(par);

		var shelfObj = drawShelfTower(par);
		par.mesh.add(shelfObj.carcas);
		par.mesh.add(shelfObj.panels);
		par.mesh.add(shelfObj.countertop);

		return par
	}

	static formChange(form, data){
		var par = data.meshParams
		
		//параметры боковин
		form.find('[data-propid="legProf"]').closest('tr').show()
		form.find('[data-propid="bridgeProf"]').closest('tr').show()
		
		if(par.carcasModel == "бруски"){
			var profs = ['40х40', '50х50', '60х60'] 
			if(profs.indexOf(par.legProf) == -1) form.find('[data-propid="legProf"]').val(profs[0])
			form.find('[data-propid="topOffset"]').val(0);
		}
		if(par.carcasModel == "панели"){
			form.find('[data-propid="legProf"]').closest('tr').hide()
			form.find('[data-propid="bridgeProf"]').closest('tr').hide()
			
			var sizeA = 40;
			var minGap = 40;
			var maxWidth = 200;
			var sizeB = (par.depth - minGap) / 2
			if(sizeB > maxWidth) sizeB = maxWidth
			var profName = sizeA + "х" + sizeB;
			
			form.find('[data-propid="legProf"]').append('<option value="' + profName + '">' + profName + '</option>');
			form.find('[data-propid="legProf"]').val(profName);
			
			form.find('[data-propid="sideOverhang"]').val(0);
			form.find('[data-propid="topOffset"]').val(0);
			
		}
		
		if(par.carcasModel == "бруски" || par.carcasModel == "панели") form.find('[data-propid="sideOverhang"]').val(0);
		
		getObjPar()
	}
	
	static printPrice(par){
		var priceParts = this.calcPriceParts(par);
		var objPrice = this.calcPrice(par);
		var priceCoeff = getPriceCoefficients(objPrice);
		var priceHTML = "";
		if (priceParts.standsCost) priceHTML += '<tr><td>Стойки</td><td>' + Math.round(priceParts.standsCost * objPrice.priceFactor * priceCoeff.margin) + '</td></tr>';
		if (priceParts.shelfsCost) priceHTML += '<tr><td>Полки</td><td>' + Math.round(priceParts.shelfsCost * objPrice.priceFactor * priceCoeff.margin) + '</td></tr>';

		return priceHTML;
	}
	
	static calcPriceParts(par){

		var meshPar = par.meshParams;
		var dopSpec = partsAmt_dop[par.id];
		var metalPart = 0;
		var standsCost = 0;
		var shelfsCost = 0;

		if (dopSpec) {

			var timberM3Cost = calcTimberParams(params.additionalObjectsTimberMaterial).m3Price;
			var legProfPar = getProfParams(meshPar.legProf)
			var timberPaintCost = calcTimberPaintPrice(params.timberPaint, params.additionalObjectsTimberMaterial)
			
			//боковины
			
			//материал
			var profLen = meshPar.height * 4 + meshPar.depth * (meshPar.shelfAmt + 1)
			standsCost += profLen * legProfPar.unitCost / 1000
			
			if(meshPar.carcasModel == "бруски" || meshPar.carcasModel == "панели"){
				standsCost = timberM3Cost * legProfPar.sizeA * legProfPar.sizeB / 1000000 * profLen / 1000
			}
			
			//изготовление
			if(meshPar.carcasModel == "бруски" || meshPar.carcasModel == "кресты") standsCost += 3000;
			else standsCost += 2000;
			
			//покраска
			var area = meshPar.height * meshPar.depth / 1000000
			if(meshPar.carcasModel == "бруски" || meshPar.carcasModel == "панели") standsCost += area * timberPaintCost
			else standsCost += area * 500;
			
			//учитываем кол-во секций
			if(meshPar.sectAmt) standsCost *= (meshPar.sectAmt + 1) / 2;
	
			//полки
			
			var shelfPar = {
				width: meshPar.depth,
				len: meshPar.width,
				thk: meshPar.shelfThk,
			};
			shelfsCost  = calcTimberPanelCost(shelfPar) * meshPar.shelfAmt;
			
		
			//доля металлического цеха в цене
			if(meshPar.carcasModel == "проф. труба" || meshPar.carcasModel == "кресты") metalPart = standsCost / (standsCost + shelfsCost);			
		}
		

		return {
			cost: standsCost + shelfsCost,
			standsCost: standsCost,
			shelfsCost: shelfsCost,
			metalPart: metalPart,
		}

	}
	
	static calcPrice(par){
		return {
			name: this.getMeta().title,
			cost: this.calcPriceParts(par).cost,
			priceFactor: par.meshParams.priceFactor || 1,
			costFactor: par.meshParams.costFactor || 1,
		}
	}

	static getMeta() {
		return {
			title: 'Стеллаж',
			inputs: [
				{
					key: 'carcasModel',
					title: 'Боковины',
					default: 'проф. труба',
					type: 'select',
					values: [
						{
							value: 'проф. труба',
							title: 'проф. труба'
						},
						{
							value: 'кресты',
							title: 'кресты'
						},
						{
							value: 'бруски',
							title: 'бруски'
						},
						{
							value: 'панели',
							title: 'панели'
						},
						
					],
					"printable": "true",
				},
				{
					key: 'height',
					title: 'Высота',
					default: 1500,
					type: 'number',
					"printable": "true",
				},
				{
					key: 'width',
					title: 'Ширина общая',
					default: 700,
					type: 'number',
					"printable": "true",
				},
				{
					key: 'depth',
					title: 'Глубина',
					default: 400,
					type: 'number',
					"printable": "true",
				},
				{
					key: 'sectAmt',
					title: 'Кол-во секций',
					default: 1,
					type: 'number',
					"printable": "true",
				},
				{
					key: 'shelfAmt',
					title: 'Кол-во полок',
					default: 4,
					type: 'number',
					"printable": "true",
				},
				{
					key: 'shelfThk',
					title: 'Толщина полок',
					default: 20,
					type: 'number',
					"printable": "true",
				},
				{
					key: 'sideOverhang',
					title: 'Свес сбоку',
					default: 20,
					type: 'number',
					"printable": "true",
				},
				{
					key: 'edgeRad',
					title: 'Радиус граней',
					default: 3,
					type: 'number'
				},
				{
					key: 'legProf',
					title: 'Профиль ножек',
					default: '40х20',
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
						}
					],
					"printable": "true",
				},
				{
					key: 'bridgeProf',
					title: 'Профиль перемычек',
					default: '40х20',
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
						}
					],
					"printable": "true",
				},
				{
					key: 'topOffset',
					title: 'Отступ сверху',
					default: 100,
					type: 'number'
				},
				{
					key: 'botOffset',
					title: 'Отступ снизу',
					default: 50,
					type: 'number'
				},
				...AdditionalObject.defaultInputs()
			]
		}
	}
}

