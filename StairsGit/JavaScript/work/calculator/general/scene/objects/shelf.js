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
			var profs = ['20х60', '40х60'] 
			if(profs.indexOf(par.legProf) == -1) form.find('[data-propid="legProf"]').val(profs[0])
			if(profs.indexOf(par.bridgeProf) == -1) form.find('[data-propid="bridgeProf"]').val(profs[0])
			form.find('[data-propid="topOffset"]').val(40);
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
		var priceParts = this.calcPriceParts(par);
		
		return {
			name: this.getMeta().title,
			cost: priceParts.cost,
			priceFactor: par.meshParams.priceFactor || 1,
			costFactor: par.meshParams.costFactor || 1,
			metalPart: priceParts.metalPart,
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
						},
						{
							value: '20х60',
							title: '20х60'
						},
						{
							value: '40х60',
							title: '40х60'
						},
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
						},
						
						{
							value: '20х60',
							title: '20х60'
						},
						{
							value: '40х60',
							title: '40х60'
						},
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


/** функция отрисовывает стеллаж
*/
function drawShelfTower(par) {

	par.carcas = new THREE.Object3D();
	par.panels = new THREE.Object3D();
	par.countertop = new THREE.Object3D();
	var dxfX0 = par.dxfBasePoint.x;
	par.dxfArr = dxfPrimitivesArr
	var legPar = getProfParams(par.legProf);


	//полки
	

	var panelPar = {
		len: par.width,
		width: par.depth - legPar.sizeB * 2,
		thk: par.shelfThk,
		partName: "shelf",
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 2000, 0),
		dxfArr: dxfPrimitivesArr,
	}
	
	if(par.carcasModel == "панели" || par.carcasModel == "бруски") {
		panelPar.len = par.width - legPar.sizeA * 2;
		panelPar.width = par.depth;
	}
		
	var botShelfPosY = par.botOffset + par.shelfThk;
	var shelfStep = (par.height - par.topOffset - par.botOffset - par.shelfThk) / (par.shelfAmt - 1);
	var shelfPositions = [];
	
	for (var i = 0; i < par.shelfAmt; i++) {
		
		if(par.carcasModel == "панели"){
			//последняя полка толстая
			if(i == par.shelfAmt - 1) panelPar.thk = legPar.sizeA;
		}
			
		var panel = drawPlate(panelPar).mesh;
		panel.rotation.x = Math.PI / 2
		panel.position.x = 0;
		if(par.carcasModel == "панели" || par.carcasModel == "бруски") panel.position.x = legPar.sizeA;
		panel.position.y = botShelfPosY + shelfStep * i;
		panel.position.z = (par.depth - panelPar.width) / 2;
		par.countertop.add(panel);
		shelfPositions.push(panel.position.y);
		
		panelPar.dxfArr = [];
	}


	par.carcasParams = [];

	var modelDim = getModelDimensions();
	var sideWallDim = modelDim.sideWall;
	
	//боковины / стойки
	
	var standPar = {
		dxfBasePoint: par.dxfBasePoint,
		side: "left",
		shelfPositions: shelfPositions,
		legProf: par.legProf,
		bridgeProf: par.bridgeProf,
		width: par.depth,
		height: par.height,
		shelfThk: par.shelfThk,
		carcasModel: par.carcasModel,
		topOffset: par.topOffset,
	}
	
	if(!par.sectAmt) par.sectAmt = 1;
	var sectWidth = (par.width - par.sideOverhang * 2 - legPar.sizeA) / par.sectAmt;
	var startPos = legPar.sizeA + par.sideOverhang;
	for(var i=0; i<=par.sectAmt; i++){		
		
		var stand = drawSideWall(standPar);
		stand.carcas.rotation.y = -Math.PI / 2;
		stand.carcas.position.z = legPar.sizeB;
		stand.carcas.position.x = startPos + sectWidth * i;
		stand.panels.rotation.y = stand.carcas.rotation.y;
		stand.panels.position.z = stand.carcas.position.z;
		stand.panels.position.x = stand.carcas.position.x;

		par.carcas.add(stand.carcas);
		par.panels.add(stand.panels);

		standPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, par.depth + 200, 0);
		if(i == par.sectAmt) standPar.side = "right";
		
		//раскосы сзади
		if(i < par.sectAmt){
			var crossPar = {
				height: par.height - par.topOffset - par.botOffset,
				width: sectWidth - legPar.sizeA,
				dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, par.height + 500),
				isFlat: true,
				profSize: 10,
			}
			var cross = drawCross(crossPar).mesh;
			cross.position.x = stand.carcas.position.x;
			cross.position.y = par.botOffset;
			par.carcas.add(cross);
		}
	}
	
	
	//царги
	var bridgePar = getProfParams(par.bridgeProf)


	var polePar = {
		poleProfileY: bridgePar.sizeA,
		poleProfileZ: bridgePar.sizeB,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, -1000),
		length: par.width - legPar.sizeA * 2 - par.sideOverhang * 2,
		poleAngle: 0,
	}

	//задняя царга
	var pos = {
		x: legPar.sizeA + par.sideOverhang,
		y: par.height - polePar.poleProfileY - modelDim.countertop.thk,
		z: par.depth - polePar.poleProfileZ - par.frontOverhang,
	}
	var pole1 = drawPole3D_4(polePar).mesh;
	pole1.position.x = pos.x;
	pole1.position.y = pos.y;
	pole1.position.z = par.frontOverhang;
	par.carcas.add(pole1);

	//верхняя передняя царга
	polePar.dxfBasePoint.y -= 200;
	var pole2 = drawPole3D_4(polePar).mesh;
	pole2.position.x = pos.x;
	pole2.position.y = pos.y;
	pole2.position.z = pos.z;
	par.carcas.add(pole2);
	/*	
		//нижние перемычки
		pos.y = modelDim.leg;
		polePar.poleProfileY = modelDim.door.botBeamSize,
		
		//нижняя передняя перемычка
		polePar.dxfBasePoint.y -= 200;
		var pole3 = drawPole3D_4(polePar).mesh;
		pole3.position.x = pos.x;
		pole3.position.y = pos.y;
		pole3.position.z = pos.z;
		par.carcas.add(pole3);
		
		//нижняя задняя перемычка
		polePar.dxfBasePoint.y -= 200;
		var pole4 = drawPole3D_4(polePar).mesh;
		pole4.position.x = pos.x;
		pole4.position.y = pos.y;
		pole4.position.z = pole1.position.z;
		par.carcas.add(pole4);
	*/

	//задняя стенка
	if (par.rearPanel == "есть") {
		var platePar = {
			len: par.width - sideWallDim.newellSize * 2 + modelDim.rearWall.ledge * 2,
			width: par.rearPanelHeight,
			thk: modelDim.rearWall.thk,
			partName: "mdfPlate",
		}
		var pos = {
			x: -modelDim.rearWall.ledge,
			y: modelDim.leg,
		}
		platePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, -2000)
		var panel = drawPlate(platePar).mesh;
		panel.position.x = pos.x;
		panel.position.y = pos.y;
		panel.position.z = modelDim.rearWall.offset;

		par.panels.add(panel);
	}
	
	return par;

} //end of drawCarcas
