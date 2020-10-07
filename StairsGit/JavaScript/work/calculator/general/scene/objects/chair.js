class Chair extends AdditionalObject {
	constructor(par) {
		super(par);
		var objPar = Object.assign({}, this.par)
		objPar.dxfBasePoint = {x:0,y:0}
		objPar.material = this.material;

		this.add(Chair.draw(objPar).mesh);
	}

	static draw(par){
		if(!par) par = {};
		initPar(par);
		
		var chairPar = {
			material: par.material,
			spinExist: par.spinExist,
		};
		
		var arrSize = {
			x: (par.colDist + 400) * par.colAmt - par.colDist,
			z: par.rowDist,
		}
		
		for(var i=0; i<par.colAmt; i++){
			for(var j=0; j<par.rowAmt; j++){
				var chair = drawChair(chairPar).mesh
				
				chair.position.x = i * (par.colDist + 400) - arrSize.x / 2
				chair.position.z = j * par.rowDist - arrSize.z / 2
				
				if(j==1){
					chair.rotation.y = Math.PI
					chair.position.x += 400
				}
				
				
				par.mesh.add(chair)
			}
			
		}
		
		

		return par
	}

	static getMeta() {
		return {
			title: 'Стул',
			inputs: [
				{
					"key": "spinExist",
					"title": "Спинка:",
					"values": [
						{
							"value": "есть",
							"title": "есть"
						},
						{
							"value": "нет",
							"title": "нет"
						},
					],
					"default": "есть",
					"type": "select"
				},
				
				{
					"key": "colAmt",
					"title": "Кол-во в ряду:",
					"default": 2,
					"type": "number",
					"printable": "true",
				},
				
				{
					"key": "rowAmt",
					"title": "Сторона:",
					"values": [
						{
							"value": "1",
							"title": "одна"
						},
						{
							"value": "2",
							"title": "две"
						},
					],
					"default": "2",
					"type": "select"
				},
				
				{
					"key": "colDist",
					"title": "Зазор между стульями:",
					"default": 100,
					"type": "number",
					"printable": "true",
				},
				{
					"key": "rowDist",
					"title": "Зазор между рядами:",
					"default": 1000,
					"type": "number",
					"printable": "true",
				},
				
			]
		}
	}
}

function drawChair(par){
	if(!par) par = {};
	initPar(par);
	
	var height = 1000;
	var width = 400;

	var legGeometry = new THREE.BoxGeometry(40, height * 0.4 - 40, 40);
	var botGeometry = new THREE.BoxGeometry(width, 40, width);
	var spinGeometry = new THREE.BoxGeometry(width, height * 0.6, 40);

	var leg1 = new THREE.Mesh(legGeometry, par.material);
	leg1.position.x = 20;
	leg1.position.y = (height * 0.4) / 2 - 20;
	leg1.position.z = 20;
	par.mesh.add(leg1);

	var leg2 = new THREE.Mesh(legGeometry, par.material);
	leg2.position.x = width - 20;
	leg2.position.y = (height * 0.4) / 2 - 20;
	leg2.position.z = 20;
	par.mesh.add(leg2);

	var leg3 = new THREE.Mesh(legGeometry, par.material);
	leg3.position.x = 20;
	leg3.position.y = (height * 0.4) / 2 - 20;
	leg3.position.z = width - 20;
	par.mesh.add(leg3);

	var leg4 = new THREE.Mesh(legGeometry, par.material);
	leg4.position.x = width - 20;
	leg4.position.y = (height * 0.4) / 2 - 20;
	leg4.position.z = width - 20;
	par.mesh.add(leg4);

	var bot = new THREE.Mesh(botGeometry, par.material);
	bot.position.x = width / 2;
	bot.position.y = height * 0.4 - 40 / 2;
	bot.position.z = width / 2;
	par.mesh.add(bot);
console.log(par.spinExist)
	if (par.spinExist == "есть") {
		var spin = new THREE.Mesh(spinGeometry, par.material);
		spin.position.x = width / 2;
		spin.position.y = height * 0.4 + (height * 0.6) / 2;
		spin.position.z = 20;
		par.mesh.add(spin);
	}
		
	return par;
}