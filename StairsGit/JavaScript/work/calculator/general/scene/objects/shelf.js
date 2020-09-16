class Shelf extends AdditionalObject {
	constructor(par) {
		super(par);
		
		var shelfPar = Object.assign({}, this.par)
		shelfPar.dxfBasePoint = {x:0,y:0}

		var shelfObj = drawShelfTower(shelfPar);
		this.add(shelfObj.carcas);
		this.add(shelfObj.panels);
		this.add(shelfObj.countertop);
	}

	/** STATIC **/

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
	
	static calcPrice(par){

		var meshPar = par.meshParams;
		var dopSpec = partsAmt_dop[par.id];
		var cost = 0;

		if (dopSpec) {
			console.log(meshPar)
			var timberM3Cost = calcTimberParams(params.additionalObjectsTimberMaterial).m3Price;
			var legProfPar = getProfParams(meshPar.legProf)
			var timberPaintCost = calcTimberPaintPrice(params.timberPaint, params.additionalObjectsTimberMaterial)
			
			//боковины
			
			//материал
			var profLen = meshPar.height * 4 + meshPar.depth * (meshPar.shelfAmt + 1)
			var cost = profLen * legProfPar.unitCost / 1000
			
			if(meshPar.carcasModel == "бруски" || meshPar.carcasModel == "панели"){
				cost = timberM3Cost * legProfPar.sizeA * legProfPar.sizeB / 1000000 * profLen / 1000
			}
			
			//изготовление
			if(meshPar.carcasModel == "бруски" || meshPar.carcasModel == "кресты") cost += 3000;
			else cost += 2000;
			
			//покраска
			var area = meshPar.height * meshPar.depth / 1000000
			if(meshPar.carcasModel == "бруски" || meshPar.carcasModel == "кресты") cost += area * timberPaintCost
			else cost += area * 500;
			
			//полки
			
			//материал
			var vol = meshPar.width * meshPar.depth * meshPar.shelfThk * meshPar.shelfAmt / 1000000000;
			cost += vol * timberM3Cost
			debugger
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
						
					]
				},
				{
					key: 'height',
					title: 'Высота',
					default: 1500,
					type: 'number'
				},
				{
					key: 'width',
					title: 'Ширина',
					default: 700,
					type: 'number'
				},
				{
					key: 'depth',
					title: 'Глубина',
					default: 400,
					type: 'number'
				},
				{
					key: 'shelfAmt',
					title: 'Кол-во полок',
					default: 4,
					type: 'number'
				},
				{
					key: 'shelfThk',
					title: 'Толщина полок',
					default: 20,
					type: 'number'
				},
				{
					key: 'sideOverhang',
					title: 'Свес сбоку',
					default: 20,
					type: 'number'
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
					]
				},
				{
					key: 'bridgeProf',
					title: 'Профиль перемычек',
					default: '20х20',
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
					]
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
		var text = "Стеллаж " + par.shelfAmt + " пол. " + par.height + "х" + par.width + "х" + par.depth + "мм";
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

