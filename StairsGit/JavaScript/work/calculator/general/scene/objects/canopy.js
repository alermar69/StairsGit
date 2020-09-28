class Canopy extends AdditionalObject {
	constructor(par) {
		super(par);
		var obj = this;
		this.par.material = 'металл';
		var canopyPar = {
			dxfArr: [],
			dxfBasePoint: {
			  x: 0,
			  y: 0
			},
			posX: 0,
			posY: 0,
			posZ: 0,
			posAng: 0,
			metalMaterial: this.getObjectMaterial(),
			polyColor: this.par.polyColor
		};
		
		var meta = Canopy.getMeta();
		meta.inputs.forEach(function(input){
			canopyPar[input.key] = obj.par[input.key];
		})

		obj.add(Canopy.draw(canopyPar).mesh);
		
	}

	static draw(par){
		return drawCanopy(par)
	}

	static calcPrice(par){
		var meshPar = par.meshParams;
		var dopSpec = partsAmt_dop[par.id];
		var cost = 0;
		
		var holderPar = getCanopyHolderPar(par.meshParams.holderType)
		
		//кронштейны
		cost += par.meshParams.holderAmt * holderPar.cost;
		
		//поликарбонат
		var m2Cost = 1300; //монолитный поликарбонат
		cost += par.meshParams.width / 1000 * (holderPar.arcLen + 100) / 1000 * m2Cost;
		
		//алюминиевые профили
		var meterCost = 200;
		cost += par.meshParams.width / 1000 * meterCost * 2;
		
		
		return {
			name: par.name || this.getMeta().title,
			cost: cost,
			priceFactor: meshPar.priceFactor || 1,
			costFactor: meshPar.costFactor || 1
		}
	}
	
	static getMeta() {
		return {
			title: 'Козырек',
			inputs: [
				{
					key: 'width',
					title: 'Ширина',
					default: 1500,
					type: 'number',
					"printable": "true",
				},
				{
					key: 'sideOffset',
					title: 'Свес сбоку',
					default: 100,
					type: 'number',
					"printable": "true",
				},
				{
					key: "holderType",
					title: "Тип кронштейна",
					default: "m-800",
					type: 'select',
					values: [
						{
							title: 'm-800',
							value: 'm-800'
						},
						{
							title: 'm-1000',
							value: 'm-1000'
						}
					],
					"printable": "true",
				},
				{
					key: "polyColor",
					title: "Цвет поликорбаната",
					default: "#bfbfbf",
					type: 'select',
					values: [
						{
							title: 'Прозрачный',
							value: '#bfbfbf'
						},
						{
							title: 'Бронза',
							value: '#a15000'
						}
					],
					"printable": "true",
				},
				{
					key: "polyType",
					title: "Тип поликорбаната",
					default: "сотовый",
					type: 'select',
					values: [
						{
							title: 'Сотовый',
							value: 'сотовый'
						},
						{
							title: 'Монолитный',
							value: 'монолитный'
						}
					],
					"printable": "true",
				},
				{
					key: 'holderAmt',
					title: 'Количество держателей',
					default: 3,
					type: 'number',
					"printable": "true",
				},
				...AdditionalObject.defaultInputs()
			]
		}
	}
	
	/** возвращает описание объекта.
	@param - meshParams из объекта additional_objects
	*/

	static getDescr(objPar) {
		console.log(this)
		if(!this) return {html: '', text: ''};
		var par = objPar.meshParams;

		var meta = this.getMeta();
		var text = "Козырек " + par.holderType + " " + par.width + " мм"
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

/** функция отрисовывает козырек
*/

function drawCanopy(par){

	par.mesh = new THREE.Object3D();
	
	//кронштейны
	var holders = new THREE.Object3D();
		
	var step = (par.width - par.sideOffset * 2) / (par.holderAmt - 1);
	for (var i = 0; i < par.holderAmt; i++) {
		var holder = drawCanopyHolder(par, i == 0);
		holder.position.z = i * step + par.sideOffset;

		if (i > 0) holder.position.z -= 4;
		holder.rotation.x = Math.PI;
		par.mesh.add(holder);
	}
	
	//поликарбонат
	var holderPar = getCanopyHolderPar(par.holderType)
	par.roofThk = 4;
	
	var roofRad = holderPar.topArcRad + par.roofThk;
	var endOffset = 100; //свес за край кронштейна
	var fullAngle = (holderPar.arcLen + endOffset) / holderPar.topArcRad;
	
	var polyMaterial = textureManager.createMaterial({name: 'glass', wireframe: false});
	polyMaterial.color = new THREE.Color(par.polyColor);
	polyMaterial.opacity = 0.5;
	polyMaterial.transparent = true;

	var arcPanelPar = {
		rad: roofRad,
		height: par.width,
		thk: par.roofThk,
		angle: fullAngle,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
		material: polyMaterial,
		partName: 'polySheet'
	}

	var stripe = drawArcPanel(arcPanelPar).mesh;
	stripe.rotation.z = Math.PI / 2 
	stripe.position.y = -roofRad;

	
	par.mesh.add(stripe);
	
	return par;
}

/**
функция отрисовывает кронштейн козырька с фланцами 
holderType

*/

function drawCanopyHolder(par, mirrorMetis){
	var holder = new THREE.Object3D();

	var el = $("#canopySvg").find("[data-type='" + par.holderType + "']");
	var main = el.find("path[data-isMain]").attr("d");
	var holes = el.find("path[data-isHole]");

	var shape = transformSVGPath(main);

	$.each(holes, function(){
		var el = $(this);
		var hole = transformSVGPath(el.attr("d"));
		shape.holes.push(hole);
	})

	var floorExtrudeOptions = {
		amount: 4,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, floorExtrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, par.metalMaterial);
	
	var holderBBox = new THREE.Box3().setFromObject(mesh);
	
	mesh.position.x -= holderBBox.max.x
	holder.add(mesh);

	//фланец крепления к стене
	var holderPlateHeight = 227;
	if (par.holderType == 'm-800') holderPlateHeight = 178;
	
	var flanPar = {
		height: holderPlateHeight,
		width: 60,
		thk: 4,
		cornerRad: 0,
		holeRad: 6.5,
		noBolts: true,
		roundHoleCenters: [
			{x: 30, y: 30},
			{x: 30, y: holderPlateHeight - 30},
		],
		filletRad: {2: 20, 3: 20},
	}
	
	
	var flan = drawRectFlan2(flanPar).mesh;

	flan.rotation.y = Math.PI / 2;
	holder.add(flan);
	
	//держатели поликарбоната
	var flanPar = {
		height: 40,
		width: 40,
		thk: 4,
		cornerRad: 0,
		holeRad: 6.5,
		noBolts: true,
		roundHoleCenters: [
			{x: 20, y: 20},
		],
		filletRad: {1: 20, 2: 20},
		
	}
	
	var flanAmt = 3;
	var holderPar = getCanopyHolderPar(par.holderType)
	
	var endOffset = 50; //смещение крайних кронштейнов относительно края кронштейна
	var fullAngle = (holderPar.arcLen - endOffset * 2 - flanPar.width) / holderPar.topArcRad;
	var angleStep = fullAngle / (flanAmt - 1);
	var startAng = (endOffset + flanPar.width) / holderPar.topArcRad;
	var center = {x: 0, y: holderPar.topArcRad}; //центр верхней дуги
	
	for(var i=0; i<flanAmt; i++){
		var ang = startAng + angleStep * i + Math.PI / 2;
		var basePoint = polar(center, -ang, holderPar.topArcRad - flanPar.thk);
		
		var flan = drawRectFlan2(flanPar).mesh;
		flan.rotation.x = - Math.PI / 2;
		flan.rotation.y = Math.PI / 2 + ang;
		flan.position.x = basePoint.x;
		flan.position.y = basePoint.y;
		holder.add(flan);
	}
	
	
	//сохраняем данные для спецификации
	var partName = "canopyHolder";
	if (typeof specObj != 'undefined' && partName) {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Кронштейн козырька",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "Козырек",
			}
		}
		var name = par.holderType;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}

	holder.specId = partName + name;
	
	return holder;
}

/** возвращает параметры кронштейна козырька по модели
*/

function getCanopyHolderPar(model){
	
	var models = {
		"m-800": {
			topArcRad: 1159 + 50,
			arcLen: 750,
			cost: 800,
		},
		"m-1000": {
			topArcRad: 1478 + 50,
			arcLen: 950,
			cost: 1000,
		},
	};

	return models[model];
}