var rackProfileX = 100;
var rackProfileZ = 50;

var topRackProfileX = 100;
var topRackProfileZ = 50;

var boltDiam = 10;

drawCarport = function (par) {
	var viewportId = 'vl_1';
	//удаляем старую лестницу
	for(var layer in layers){
		removeObjects(viewportId, layer);
	}
	
	//очищаем глобальный массив параметров для спецификации
	staircasePartsParams = {
		carport: []
	};

	var model = {
		objects: [],
		add: function(obj, layer){
			var objInfo = {
				obj: obj,
				layer: layer,
			}
			this.objects.push(objInfo);
		},
	};
	
	//обнуляем счетчики спецификации
	partsAmt = {};
	partsAmt_bal = {unit: "banister"}
	specObj = partsAmt; //задаем объект, куда будут сохраняться данные для спецификации
	poleList = {};
	railingParams = {};
	shapesList = [];

	/*удаляем контуры*/
	dxfPrimitivesArr = [];
	
	
	
	var carport = drawTrussCarport(params);
	model.add(carport, "carport");

	for(var i=0; i<model.objects.length; i++){		
		var obj = model.objects[i].obj;
		obj.layerName = model.objects[i].layer;
		
		//добавляем в сцену
		console.log(viewportId, obj, model.objects[i].layer);
		addObjects(viewportId, obj, model.objects[i].layer);
	}

	//измерение размеров на модели
	addMeasurement(viewportId);

	if (typeof staircaseLoaded !== undefined) staircaseLoaded();
	
};

/** функция отрисовывает навес с арочными фермами */

function drawTrussCarport(par){
	var carport = new THREE.Object3D();
	if(!par.dxfBasePoint) par.dxfBasePoint = {x:0,y:0}

	// Тк форма статическая заменяем параметры, на параметры из справочника.
	par.width = par.fermaType * 1.0;
	if (params.carportType == "односкатный") par.width *= 2.0;
	
	var columnPar = getProfParams(params.columnProfile)
	
	par.rackProfileX = rackProfileX;
	par.rackProfileZ = rackProfileZ;

	var progonProfParams = getProfParams(par.progonProfile);
	par.progonProfileX = progonProfParams.sizeB;
	par.progonProfileZ = progonProfParams.sizeA;

	var fermas = new THREE.Object3D();

	par.dxfBasePoint = {x:0,y:0};
	
	// полоса
	var stripeThk = 4;

	var topTrussPar = {
		thk: params.trussThk,
		stripeThk: stripeThk,
		len: par.width / 2,
		rackSize: columnPar.sizeB,
		model: params.trussModel,
		holesModel: params.trussHolesType,
		dxfBasePoint: par.dxfBasePoint,
		dxfPrimitivesArr: dxfPrimitivesArr
	}

	//цикл построения секций
	//ноль секции - ось колонны
	for (var i = 0; i <= par.arcCount; i++) {
		var section = new THREE.Object3D();
		topTrussPar.dxfPrimitivesArr = i == 0 ? dxfPrimitivesArr : [];
		
		var fermaShapes = new THREE.Object3D();
		var drawFunc = drawTriangleTruss;
		if(params.roofType == "Арочная") drawFunc = drawArcTruss2;
		
		// Правая половина
		var truss = drawFunc(topTrussPar).mesh;
		truss.position.x = -topTrussPar.len;
		truss.position.z = -topTrussPar.thk / 2;
		truss.setLayer('carcas');
		fermaShapes.add(truss);

		if (params.carportType == "двухскатный") {
			//левая половина
			topTrussPar.dxfPrimitivesArr = [];
			var truss = drawFunc(topTrussPar).mesh;
			truss.position.x = topTrussPar.len;
			truss.position.z = topTrussPar.thk / 2;
			truss.rotation.y = Math.PI;
			truss.setLayer('carcas');
			fermaShapes.add(truss);
	
			if (topTrussPar.connectionFlanPar) {
				par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, 400);
				var flanParams = {
					dxfBasePoint: par.dxfBasePoint,
					thk: 8,
					flanParams: topTrussPar.connectionFlanPar,
					dxfPrimitivesArr: i == 0 ? dxfPrimitivesArr : []
				};
				var flan = drawArcTrussFlan(flanParams);
				flan.position.y = topTrussPar.centerY - 10 - topTrussPar.connectionFlanPar.h;
				flan.position.z = -params.trussThk / 2 - flanParams.thk;
				fermaShapes.add(flan);
			}
		}

		par.vertArcCount = topTrussPar.progonCount * 2;

		fermaShapes.setLayer('carcas');
		fermaShapes.position.y = params.height;
		fermaShapes.position.z = -params.trussThk / 2;
		section.add(fermaShapes);
		
		par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, 400);

		//колонны
		var polePar = {
			poleProfileY: columnPar.sizeA,
			poleProfileZ: columnPar.sizeB,
			dxfBasePoint: par.dxfBasePoint,
			length: params.height,
			poleAngle: 0,
			material: params.materials.metal,
			dxfArr: [],
			type: 'rect',
			partName: 'carportRack'
		};

		var rack = drawPole3D_4(polePar).mesh;
		rack.rotation.z = Math.PI / 2;
		rack.rotation.y = Math.PI / 2;
		rack.position.x = -columnPar.sizeA / 2 - par.width / 2;// - offset / 2;
		rack.position.z = -columnPar.sizeB / 2;
		rack.setLayer('racks');
		section.add(rack);

		par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, 400);

		var flanParams = {
			dxfBasePoint: par.dxfBasePoint,
			dxfPrimitivesArr: i == 0 ? dxfPrimitivesArr : [],
			thk: 8,
			rackSize: columnPar.sizeA,
			isLarge: par.width > 5000,
			holes: topTrussPar.rackFlanHoles,
			flanTopAngle: topTrussPar.topAng
		};
		
		var rackFlan = drawRackFlan(flanParams);
		rackFlan.position.y = params.height;
		rackFlan.position.x = -par.width / 2;
		rackFlan.position.z = -params.trussThk - flanParams.thk;
		section.add(rackFlan);

		if (params.carportType == "односкатный") polePar.length = par.height + topTrussPar.centerYBot;
		if (params.carportType == "односкатный" && params.roofType == 'Плоская') polePar.length = par.height + topTrussPar.centerY;
		
		var rack = drawPole3D_4(polePar).mesh;
		rack.rotation.z = Math.PI / 2;
		rack.rotation.y = Math.PI / 2;
		rack.position.x = par.width / 2 - columnPar.sizeA / 2;
		rack.position.z = -columnPar.sizeB / 2;
		if (params.carportType == "односкатный") rack.position.x = -columnPar.sizeA;
		if (params.carportType == "односкатный" && params.roofType == 'Плоская') rack.position.x = 0;

		rack.setLayer('racks');
		section.add(rack);

		if (params.carportType == 'двухскатный') {
			var rackFlan = drawRackFlan(flanParams);
			rackFlan.position.y = params.height;
			rackFlan.position.x = par.width / 2;
			rackFlan.position.z = -params.trussThk;
			rackFlan.rotation.y = Math.PI;
			section.add(rackFlan);
		}

		//продольные фермы

		var deltaLen = 100; //уменьшение длины фермы относительно длины секции
		
		par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, 400);

		var trussPar = {
			height: 200,
			thk: params.trussThk,
			len: params.sectLen - deltaLen,
			rackSize: columnPar.sizeB,
			dxfPrimitivesArr: i == 0 ? dxfPrimitivesArr : [],
			dxfBasePoint: par.dxfBasePoint
		}
		if(i < par.arcCount){
			var truss = drawStrightTruss(trussPar).mesh;
			truss.rotation.y = -Math.PI / 2;			
			truss.position.x =  - par.width / 2;
			truss.position.y = params.height;
			truss.position.z = deltaLen / 2;
			truss.setLayer('carcas');
			section.add(truss);
			
			if (params.carportType == "двухскатный") {
				var truss = drawStrightTruss(trussPar).mesh;
				truss.rotation.y = -Math.PI / 2;			
				truss.position.x = par.width / 2;
				truss.position.y = params.height;
				truss.position.z = deltaLen / 2;
				truss.setLayer('carcas');
				section.add(truss);
			}
		}
		
		section.rotation.y = Math.PI / 2;
		section.position.x = par.rackProfileX / 2 + params.sectLen * i;
		fermas.add(section);
	}

	fermas.position.z = par.width / 2;
	carport.add(fermas);
	
	//прогоны
	var progonPar = {
		poleProfileY: par.progonProfileX,
		poleProfileZ: par.progonProfileZ,
		dxfBasePoint: {x:0,y:0},
		length: params.sectLen * params.arcCount + params.rackFaceOffset * 2,
		material: params.materials.metal,
		dxfArr: [],
	};

	if(params.roofType == "Арочная") {
		var posRad = topTrussPar.topRad + stripeThk;
		
		var halfAngle = (topTrussPar.arcLength - par.progonProfileX / 2)  / posRad;
		var startAngle = -halfAngle + Math.PI / 2 - (par.progonProfileX / 2) / posRad;
		var progonStep = halfAngle / (par.vertArcCount / 2);

		if (params.carportType == "односкатный") {
			var halfAngle = (topTrussPar.arcLength - par.progonProfileX)  / posRad;
			var startAngle = -halfAngle + Math.PI / 2 - par.progonProfileX / posRad;
			var progonStep = halfAngle / (par.vertArcCount / 2);
			par.vertArcCount = Math.ceil(par.vertArcCount / 2);
		}
	
		for (var i = 0; i <= par.vertArcCount; i++) {
			var vertProfile = drawProgon(progonPar).mesh;
			var profilePos = polar({x: par.width / 2, y: 0}, startAngle + progonStep * i, posRad);
	
			vertProfile.position.y = profilePos.y - topTrussPar.topRad + par.height + topTrussPar.centerY;
			vertProfile.position.z = profilePos.x;
			vertProfile.position.x = -params.rackFaceOffset + 50;
			vertProfile.rotation.x = -(startAngle + progonStep * i);
			vertProfile.setLayer('progon');
			carport.add(vertProfile);
		}

		//поликарбонат
		var roofRad = topTrussPar.topRad + stripeThk + par.progonProfileZ + params.roofThk;
		var extraAnle = (params.sideOffset + par.progonProfileX / 2) / roofRad; //свес сбоку

		var polyLength = params.sectLen * params.arcCount + params.rackFaceOffset * 2;
		var sectWidth = 2100;
		var polyListCount = Math.ceil(polyLength / sectWidth);
		for (var i = 0; i < polyListCount; i++) {
			var polySize = sectWidth;
			if ( i == ( polyListCount - 1 )) polySize = polyLength - sectWidth * i;

			var arcPanelPar = {
				rad: roofRad,
				height: polySize,
				thk: params.roofThk,
				angle: halfAngle * 2 + extraAnle * 2,
				dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
				material: params.materials.glass,
				partName: 'polySheet',
				dxfPrimitivesArr: []
			}
			if (params.carportType == "односкатный") arcPanelPar.angle = halfAngle + extraAnle;// * 2;
			
			var stripe = drawArcPanel(arcPanelPar).mesh;
			
			stripe.rotation.z = Math.PI / 2 - arcPanelPar.angle / 2;
			if (params.carportType == "односкатный") stripe.rotation.z = Math.PI / 2;// - extraAnle;
			stripe.position.z = -arcPanelPar.height + params.rackFaceOffset
			stripe.position.z -= sectWidth * i;
			stripe.position.y = -roofRad + par.height + topTrussPar.centerY + par.progonProfileZ + params.roofThk;
			stripe.setLayer('roof');
			section.add(stripe);

			// Соединительный профиль
			if (i < (polyListCount - 1)) {
				var polyProfilePar = {
					rad: roofRad,
					thk: params.roofThk + 2,
					angle: halfAngle * 2 + extraAnle * 2,
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
					dxfPrimitivesArr: []
				}
				if (params.carportType == "односкатный") polyProfilePar.angle = halfAngle + extraAnle;
				var polyProfile = drawPolyConnectionProfile(polyProfilePar);
		
				polyProfile.rotation.z = Math.PI / 2 - arcPanelPar.angle / 2;
				if (params.carportType == "односкатный") polyProfile.rotation.z = Math.PI / 2;
				polyProfile.position.z = -polySize + params.rackFaceOffset - sectWidth * i;
				polyProfile.position.y = -roofRad + par.height + topTrussPar.centerY + par.progonProfileZ + params.roofThk;
		
				polyProfile.setLayer('roof');
				section.add(polyProfile);
			}
		}
		// Краевой профиль
		var edgePolyPar = {
			poleProfileY: params.roofThk,
			poleProfileZ: 2,
			dxfBasePoint: {x:0,y:0},
			length: polyLength,
			poleAngle: 0,
			material: params.materials.metal,
			dxfArr: [],
			type: 'rect',
			partName: 'polyEdgeProfile'
		};
		var startAngle = -halfAngle - extraAnle + Math.PI / 2;
		var endAngle = halfAngle + extraAnle + Math.PI / 2;
		var edgePolyRad = roofRad - params.roofThk / 2;
		
		var edgePolyPos = polar({x: par.width / 2, y: 0}, startAngle, edgePolyRad);
		var edgePoly = drawPole3D_4(edgePolyPar).mesh;
		edgePoly.position.y = edgePolyPos.y - roofRad + par.height + topTrussPar.centerY + par.progonProfileZ + params.roofThk;
		edgePoly.position.z = edgePolyPos.x;
		edgePoly.position.x = -50;
		edgePoly.rotation.x = -startAngle + Math.PI / 2;
		edgePoly.setLayer('roof');
		carport.add(edgePoly);

		if (params.carportType == "двухскатный") {
			var edgePolyPos = polar({x: par.width / 2, y: 0}, endAngle, edgePolyRad + edgePolyPar.poleProfileY);
			var edgePoly = drawPole3D_4(edgePolyPar).mesh;
			edgePoly.position.y = edgePolyPos.y - roofRad + par.height + topTrussPar.centerY + par.progonProfileZ + params.roofThk;
			edgePoly.position.z = edgePolyPos.x;
			edgePoly.position.x = -50;
			edgePoly.rotation.x = -endAngle - Math.PI / 2;
			edgePoly.setLayer('roof');
			carport.add(edgePoly);
		}
	}else{
		var profAngle = THREE.Math.degToRad(topTrussPar.topAng);
		
		var basePoint = topTrussPar.basePoint;//polar(topTrussPar.basePoint, profAngle + Math.PI / 2, stripeThk);
		var progonCount = Math.ceil(par.vertArcCount / 2);
		var topOffset = 60; // отступ от верха
		var step = (topTrussPar.length - topOffset - par.progonProfileX - par.progonProfileX / 2) / (progonCount - 1);

		for (var i = 0; i < progonCount; i++) {
			if (params.carportType == "двухскатный") {
				// левый скат
				var vertProfile = drawProgon(progonPar).mesh;
				var profilePos = polar(basePoint, profAngle, -step * i - topOffset);
				vertProfile.position.y = par.height + profilePos.y;
				vertProfile.position.z = profilePos.x;
				vertProfile.position.x = -params.rackFaceOffset + 50;
				vertProfile.rotation.x = -profAngle - Math.PI / 2;
				vertProfile.setLayer('progon');
				carport.add(vertProfile);
			}

			// правый скат
			var vertProfile = drawProgon(progonPar).mesh;
			var profilePos = polar(basePoint, -profAngle, step * i + topOffset + par.progonProfileX);
			vertProfile.position.y = par.height + profilePos.y;
			vertProfile.position.z = profilePos.x;
			vertProfile.position.x = -params.rackFaceOffset + 50;
			vertProfile.rotation.x = profAngle - Math.PI / 2;
			vertProfile.setLayer('progon');
			carport.add(vertProfile);
		}

		var halfRoofLength = topTrussPar.length + params.sideOffset;
		var polyLength = params.sectLen * params.arcCount + params.rackFaceOffset * 2;
		
		var sectWidth = 2100;
		var polyListCount = Math.ceil(polyLength / sectWidth);
		
		for (var i = 0; i < polyListCount; i++) {
			var polySize = sectWidth;
			if ( i == ( polyListCount - 1 )) polySize = polyLength - sectWidth * i;

			if (params.carportType == "двухскатный") {
				// левый скат
				var polyPar = {
					poleProfileY: params.roofThk,
					poleProfileZ: polySize,
					dxfBasePoint: {x:0,y:0},
					length: halfRoofLength,
					material: params.materials.glass,
					dxfArr: [],
					type: 'rect',
					partName: 'polySheet'
				};
			
				var polySheet = drawPole3D_4(polyPar).mesh;
	
				var pos = {
					x: -polySize - sectWidth * i + params.rackFaceOffset,
					y: par.height + topTrussPar.basePoint.y
				}
	
				pos = polar(pos, profAngle + Math.PI / 2, stripeThk + par.progonProfileZ);
	
				polySheet.position.y = pos.y;
				polySheet.position.z = pos.x;
				polySheet.rotation.z = -profAngle;
				polySheet.setLayer('roof');
				section.add(polySheet);
	
				// Соединительный профиль
				if (i < (polyListCount - 1)) {
					var polyProfilePar = {
						length: halfRoofLength,
						thk: params.roofThk + 2,
						dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
						dxfPrimitivesArr: []
					}
					var polyProfile = drawPolyConnectionProfile(polyProfilePar);
					var conProfilePos = newPoint_xy(pos, 0, 0)
					polyProfile.position.y = conProfilePos.y + params.roofThk + 2;
					polyProfile.position.z = conProfilePos.x - 10;
					polyProfile.rotation.z = -profAngle;
			
					polyProfile.setLayer('roof');
					section.add(polyProfile);
				}
			}

			// правый скат
			var polyPar = {
				poleProfileY: params.roofThk,
				poleProfileZ: polySize,
				dxfBasePoint: {x:0,y:0},
				length: halfRoofLength,
				material: params.materials.glass,
				dxfArr: [],
				type: 'rect',
				partName: 'polySheet'
			};
		
			var polySheet = drawPole3D_4(polyPar).mesh;

			var pos = {
				x: -polySize - sectWidth * i + params.rackFaceOffset,
				y: par.height + topTrussPar.basePoint.y
			}

			pos = polar(pos, profAngle + Math.PI / 2, stripeThk + par.progonProfileZ);
			polySheet.position.z = pos.x;
			polySheet.position.y = pos.y - halfRoofLength * Math.sin(profAngle);
			polySheet.position.x = -halfRoofLength * Math.cos(profAngle);
			polySheet.rotation.z = profAngle;
			polySheet.setLayer('roof');
			section.add(polySheet);

			// Соединительный профиль
			if (i < (polyListCount - 1)) {
				var polyProfilePar = {
					length: halfRoofLength,
					thk: params.roofThk + 2,
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
					dxfPrimitivesArr: []
				}
				var polyProfile = drawPolyConnectionProfile(polyProfilePar);
				var conProfilePos = newPoint_xy(pos, 0, 0)
				polyProfile.position.z = conProfilePos.x - 10;
				polyProfile.position.y = conProfilePos.y + params.roofThk + 2 - halfRoofLength * Math.sin(profAngle);
				polyProfile.position.x = -halfRoofLength * Math.cos(profAngle);
				polyProfile.rotation.z = profAngle;
		
				polyProfile.setLayer('roof');
				section.add(polyProfile);
			}
		}

		// Краевой профиль
		var edgePolyPar = {
			poleProfileY: params.roofThk,
			poleProfileZ: 2,
			dxfBasePoint: {x:0,y:0},
			length: polyLength,
			poleAngle: 0,
			material: params.materials.metal,
			dxfArr: [],
			type: 'rect',
			partName: 'polyEdgeProfile'
		};

		var edgePoly = drawPole3D_4(edgePolyPar).mesh;
		edgePoly.position.y = par.height + topTrussPar.basePoint.y - halfRoofLength * Math.sin(profAngle);
		edgePoly.position.z = par.width / 2 - halfRoofLength * Math.cos(profAngle);;
		edgePoly.position.x = -50;
		edgePoly.rotation.x = profAngle;
		edgePoly.setLayer('roof');
		carport.add(edgePoly);

		// var edgePolyPos = polar({x: par.width / 2, y: 0}, endAngle, edgePolyRad + edgePolyPar.poleProfileY);
		// var edgePoly = drawPole3D_4(edgePolyPar).mesh;
		// edgePoly.position.y = edgePolyPos.y - roofRad + par.height + topTrussPar.centerY + par.progonProfileZ + params.roofThk;
		// edgePoly.position.z = edgePolyPos.x;
		// edgePoly.position.x = -50;
		// edgePoly.rotation.x = -endAngle - Math.PI / 2;
		// edgePoly.setLayer('roof');
		// carport.add(edgePoly);
	}
	return carport;
}

// Функция отрисовывает прогон с метизами
function drawProgon(par){
	par.mesh = new THREE.Object3D();

	var polePar = {
		poleProfileY: par.poleProfileY,
		poleProfileZ: par.poleProfileZ,
		dxfBasePoint: par.dxfBasePoint,
		length: par.length,
		poleAngle: 0,
		material: par.material,
		dxfArr: [],
		type: 'rect'
	};

	var progon = drawPole3D_4(polePar).mesh;
	par.mesh.add(progon);

	var screwsCount = Math.round(par.length / 450);
	var step = par.length / screwsCount;
	for (var i = 0; i < screwsCount; i++) {
		var shim = drawTermoShim();
		shim.position.x = step / 2 + step * i
		shim.rotation.x = Math.PI / 2;
		shim.position.y = par.poleProfileY / 2;
		shim.position.z = par.poleProfileZ + params.roofThk;
		par.mesh.add(shim);

		var screwPar = {
			id: "roofingScrew_5x32",
			description: "Крепление поликарбоната к профилям",
			group: "Кровля"
		}
			
		var screw = drawScrew(screwPar).mesh;
		screw.position.x = step / 2 + step * i
		screw.rotation.x = -Math.PI / 2;
		screw.position.y = par.poleProfileY / 2;
		screw.position.z = par.poleProfileZ + params.roofThk;
		par.mesh.add(screw);
	};

	var boltPar = {
		diam: 6,
		len: 20,
		headType: 'пол. гол. крест',
		headShim: true,
	}
	
	for (var i = 0; i <= params.arcCount; i++) {
		var bolt = drawBolt(boltPar).mesh;
		bolt.position.x = params.rackFaceOffset + 10 + i * params.sectLen;
		bolt.position.y = par.poleProfileY / 2;
		bolt.position.z = 0;
		bolt.rotation.x = Math.PI / 2;
		par.mesh.add(bolt);
	
		var bolt = drawBolt(boltPar).mesh;
		bolt.position.x = params.rackFaceOffset - 10 + i * params.sectLen;
		bolt.position.y = par.poleProfileY / 2;
		bolt.position.z = 0;
		bolt.rotation.x = Math.PI / 2;
		par.mesh.add(bolt);
	}

	//сохраняем данные для спецификации
	var partName = 'progonProfile';
	if (typeof specObj != 'undefined' && partName) {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				name: 'Прогон',
				metalPaint: false,
				timberPaint: false,
				isModelData: true,
				division: "metal",
				purposes: [],
				workUnitName: "amt",
				group: "Метизы",
			}
		}
		var name = Math.round(par.poleProfileZ) + "x" + Math.round(par.poleProfileY) + "х" + Math.round(par.length);
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["sumLength"] += par.length / 1000;
	}

	par.mesh.specId = partName + name;

	return par;
}

function drawTermoShim(){
	var termoShimDiam = 38;
	var shimHeight = 4;
	var material = new THREE.MeshLambertMaterial({ color: "#808080" });
	var geometry = new THREE.CylinderGeometry(termoShimDiam / 3, termoShimDiam / 2, shimHeight, 10, 1, false);
	var shim = new THREE.Mesh(geometry, material);
	shim.position.y += shimHeight;

	//сохраняем данные для спецификации
	var partName = 'termoShim';
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: 'Термошайба',
				metalPaint: false,
				timberPaint: false,
				isModelData: true,
				division: "stock_1",
				purposes: [],
				workUnitName: "amt",
				group: "Метизы",
			}
		}

		name = 0;
		
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}

	shim.setLayer("metis");
	shim.specId = partName;
	
	return shim;
}

// Функция отрисовывает и добавляет в спецификацию соединительный профиль поликорбаната
function drawPolyConnectionProfile(par){
	var profile = new THREE.Object3D();
	if (par.angle) {
		var profileWidth = 20;
		var arcPanelPar = {
			rad: par.rad + par.thk / 2 - 1,
			height: profileWidth,
			thk: 1,
			angle: par.angle,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
			material: params.materials.metal,
			dxfPrimitivesArr: par.dxfPrimitivesArr
		}		
		var topPart = drawArcPanel(arcPanelPar).mesh;
		topPart.position.z = -profileWidth / 2;
		profile.add(topPart);
	
		var arcPanelPar = {
			rad: par.rad - par.thk / 2 + 1,
			height: profileWidth,
			thk: 1,
			angle: par.angle,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
			material: params.materials.metal,
			dxfPrimitivesArr: par.dxfPrimitivesArr
		}		
		var botPart = drawArcPanel(arcPanelPar).mesh;
		botPart.position.z = -profileWidth / 2;
		profile.add(botPart);
	
		var arcPanelPar = {
			rad: par.rad,
			height: 1,
			thk: par.thk - 2,
			angle: par.angle,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
			material: params.materials.metal,
			dxfPrimitivesArr: par.dxfPrimitivesArr
		}
		var midPart = drawArcPanel(arcPanelPar).mesh;
		profile.add(midPart);
	}else{
		var profileWidth = 20;
		var polePar = {
			poleProfileY: 2,
			poleProfileZ: profileWidth,
			dxfBasePoint: par.dxfBasePoint,
			length: par.length,
			poleAngle: 0,
			material: params.materials.metal,
			dxfArr: par.dxfPrimitivesArr,
			type: 'rect'
		};
	
		var prof = drawPole3D_4(polePar).mesh;
		profile.add(prof);
	}

	var partName = 'polyConnectionProfile';
	var arcLength = (par.rad * Math.PI * THREE.Math.radToDeg(par.angle)) / 180;
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				name: "Соединительный профиль для поликарбоната",
				metalPaint: false,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "carcas",
			}
		}
		var name = arcLength.toFixed(2);
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["sumLength"] += arcLength / 1000;
	}
	profile.specId = partName + name;
	
	return profile;
}

function drawRackFlan(par){
	var flanMesh = new THREE.Object3D();
	par.turnFactor = par.turnFactor || 1;// Для разворота болтов

	var flanHeight = par.isLarge ? 150 : 100;

	var flanAngle = THREE.Math.degToRad(par.flanTopAngle || 30);
	var offset = 100 - par.rackSize;

	var p0 = {x:0,y:0};
	var p1 = newPoint_xy(p0, -par.rackSize / 2, 0);
	var p2 = newPoint_xy(p1, 0, -50);
	var p3 = newPoint_xy(p2, -30 - offset / 2, 0);
	var p4 = newPoint_xy(p3, 0, flanHeight + 54);
	var p5 = polar(p4, flanAngle, 200 / Math.cos(flanAngle));
	var p6 = newPoint_xy(p5, 0, -p5.y);

	var p9 = newPoint_xy(p0, par.rackSize / 2, 0);
	var p8 = newPoint_xy(p9, 0, -150);
	var p7 = newPoint_xy(p8, 30, 0);

	p3.filletRad = p4.filletRad = p5.filletRad = p7.filletRad = 20;

	//создаем шейп
	var shapePar = {
		points: [p0,p1,p2,p3,p4,p5,p6, p7, p8, p9],
		dxfArr: par.dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint
	}

	console.log(shapePar.points)
	
	var shape = drawShapeByPoints2(shapePar).shape;

	if (par.holes && par.holes.length > 0) {
		var holes = [];
		
		par.holes.forEach(function(hole){
			hole.rad = 7;
			holes.push(hole);
		})

		var holesPar = {
			holeArr: holes,
			dxfBasePoint: par.dxfBasePoint,
			shape: shape,
			dxfPrimitivesArr: par.dxfPrimitivesArr
		}
		addHolesToShape(holesPar);
	}


	holesPar.holeArr.forEach(function(hole){
		var boltPar = {
			diam: 12,
			len: 30,
			// headType: 'пол. гол. крест',
			headShim: true,
		}
		
		var bolt = drawBolt(boltPar).mesh;
		bolt.position.x = hole.x;
		bolt.position.y = hole.y;
		bolt.position.z = 0;
		bolt.rotation.x = -Math.PI / 2 * par.turnFactor;
		flanMesh.add(bolt);
	});


	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

	var flan = new THREE.Mesh(geom, params.materials.metal);
	flan.setLayer('flans');

	var partName = "rackFlan";
	var box3 = new THREE.Box3().setFromObject(flan);
	var s = ((box3.max.x - box3.min.x) / 1000) * ((box3.max.y - box3.min.y) / 1000);
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				name: "Фланец стойки к ферме",
				metalPaint: false,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "carcas",
			}
		}
		var name = 0;
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += s;
	}
	flan.specId = partName;

	flanMesh.add(flan);
	return flanMesh;
}

function drawTrussFlan(par){
	var flanMesh = new THREE.Object3D();

	var rackSize = par.rackSize - 8;// 8 толщина фланца фермы
	// Отступ от стойки
	var rackOffset = (100 - par.rackSize) / 2 + 20 + 23.5;// 100 - размер стойки(при колонне в 100, зазор между опорой и фланцем 0) 20 от края фермы + 20 для отверстий

	var p0 = {x:0,y:0};
	var p1 = newPoint_xy(p0, rackSize / 2, 0);
	var p2 = newPoint_xy(p1, 0, -50);
	var p3 = newPoint_xy(p2, rackOffset, 0);
	var p4 = newPoint_xy(p3, 0, par.height + 50);
	var p5 = newPoint_xy(p4, -rackSize / 2 - rackOffset, 0);

	p3.filletRad = p5.filletRad = 10;

	//создаем шейп
	var shapePar = {
		points: [p0,p1,p2,p3,p4,p5],
		dxfArr: par.dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;

	var h1 = newPoint_xy(p4, -20, -20);
	var h2 = newPoint_xy(h1, 0, -160);
	h1.rad = h2.rad = 7;

	var holesPar = {
		holeArr: [h1,h2],
		dxfBasePoint: par.dxfBasePoint,
		shape: shape,
		dxfPrimitivesArr: par.dxfPrimitivesArr
	}
	addHolesToShape(holesPar);

	holesPar.holeArr.forEach(function(hole){
		var boltPar = {
			diam: 12,
			len: 30,
			// headType: 'пол. гол. крест',
			headShim: true,
		}
		
		var bolt = drawBolt(boltPar).mesh;
		bolt.position.x = hole.x;
		bolt.position.y = hole.y;
		bolt.position.z = 0;
		bolt.rotation.x = Math.PI / 2;
		flanMesh.add(bolt);
	});

	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

	var flan = new THREE.Mesh(geom, params.materials.metal);
	flan.setLayer('flans');

	var box3 = new THREE.Box3().setFromObject(flan);
	var s = ((box3.max.x - box3.min.x) / 1000) * ((box3.max.y - box3.min.y) / 1000);

	var partName = "trussFlan";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				name: "Фланец стойки к продольной ферме",
				metalPaint: false,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "carcas",
			}
		}
		var name = 0;
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += s;
	}
	flan.specId = partName;
	flanMesh.add(flan);
	
	return flanMesh;
}

function drawArcTrussFlan(par){
	var flanMesh = new THREE.Object3D();
	if(!par.flanParams) return flanMesh;

	var h = par.flanParams.h;
	var a = par.flanParams.a;
	var b = par.flanParams.b;

	var p0 = {x:0,y:0};
	var p1 = newPoint_xy(p0, -a  / 2, 0);
	var p2 = newPoint_xy(p0, -b / 2, h);
	var p3 = newPoint_xy(p2, b, 0);
	var p4 = newPoint_xy(p0, a / 2, 0);
	
	// p1.filletRad = p2.filletRad = p3.filletRad = p4.filletRad = 10;

	//создаем шейп
	var shapePar = {
		points: [p1,p2,p3,p4],
		dxfArr: par.dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;

	var holes = [];
	par.flanParams.holes.forEach(function(hole){
		var hole = newPoint_xy(hole, 0, -10);// Смещаем на 10 тк фланец на 10 меньше высоты фермы
		hole.rad = 7;
		holes.push(hole);
	})

	// Вторая половина отверстий, тк они рассчитаны только для половины фермы
	par.flanParams.holes.forEach(function(hole){
		var hole = newPoint_xy(hole, 0, -10);// Смещаем на 10 тк фланец на 10 меньше высоты фермы
		hole.x *= -1
		hole.rad = 7;
		holes.push(hole);
	})
	

	var holesPar = {
		holeArr: holes,//[h1,h2,h3,h4,h5,h6,h7,h8],
		dxfBasePoint: par.dxfBasePoint,
		shape: shape,
		dxfPrimitivesArr: par.dxfPrimitivesArr
	}
	addHolesToShape(holesPar);

	holesPar.holeArr.forEach(function(hole){
		var boltPar = {
			diam: 12,
			len: 30,
			headShim: true,
		}

		var bolt = drawBolt(boltPar).mesh;
		bolt.position.x = hole.x;
		bolt.position.y = hole.y;
		bolt.position.z = 0;
		bolt.rotation.x = Math.PI / 2;
		flanMesh.add(bolt);
	});

	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

	var flan = new THREE.Mesh(geom, params.materials.metal);
	flan.setLayer('flans');
	
	var box3 = new THREE.Box3().setFromObject(flan);
	var s = ((box3.max.x - box3.min.x) / 1000) * ((box3.max.y - box3.min.y) / 1000);
	var partName = "arcTrussFlan";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				name: "Фланец соединения двух частей ферм",
				metalPaint: false,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "carcas",
			}
		}
		var name = 0;
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += s;
	}
	flan.specId = partName;
	flanMesh.add(flan);

	return flanMesh;
}