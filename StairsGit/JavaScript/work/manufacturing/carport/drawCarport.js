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

	par.width = par.trussWidth * 1.0;
	if (params.carportType == "односкатный" || params.carportType == "консольный") par.width *= 2.0;
	
	var columnPar = getProfParams(params.columnProfile)
	
	var progonProfParams = getProfParams(par.progonProfile);
	par.progonProfileX = progonProfParams.sizeB;
	par.progonProfileZ = progonProfParams.sizeA;

	var fermas = new THREE.Object3D();

	par.dxfBasePoint = {x:0,y:0};

	var stripeThk = 4; //толщина полосы по верху фермы
	
	//параметры фермы
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
		if(params.carportType == "консольный") drawFunc = drawArcWing;
		
		// Правая половина
		var truss = drawFunc(topTrussPar).mesh;
		truss.position.x = -topTrussPar.len;
		truss.position.z = -topTrussPar.thk / 2;
		if(params.carportType == "консольный") {
			truss.position.z = -topTrussPar.thk / 2 - columnPar.sizeA / 2;
		}
		truss.setLayer('carcas');
		fermaShapes.add(truss);

		if (params.carportType == "двухскатный" || params.carportType == "консольный") {
			//левая половина
			topTrussPar.dxfPrimitivesArr = [];
			var truss = drawFunc(topTrussPar).mesh;
			truss.position.x = topTrussPar.len;
			truss.position.z = topTrussPar.thk / 2;
			truss.rotation.y = Math.PI;
			if(params.carportType == "консольный"){
				truss.position.x = -topTrussPar.len;
				truss.position.z = topTrussPar.thk / 2 + columnPar.sizeA / 2;
				truss.rotation.y = 0;
			}
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

		par.vertArcAmt = topTrussPar.progonAmt * 2;

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
		rack.position.x = -columnPar.sizeB / 2 - par.width / 2;// - offset / 2;
		rack.position.z = -columnPar.sizeA / 2;
		if(params.carportType == "консольный"){
			rack.position.x = - par.width / 2;
		}
		rack.setLayer('racks');
		section.add(rack);

		par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, 400);

		if(params.carportType != "консольный"){
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
		}	
		if (params.carportType == 'двухскатный') {
			var rackFlan = drawRackFlan(flanParams);
			rackFlan.position.y = params.height;
			rackFlan.position.x = par.width / 2;
			rackFlan.position.z = -params.trussThk;
			rackFlan.rotation.y = Math.PI;
			section.add(rackFlan);
		}
		else{
			if (params.roofType == 'Арочная') {
				var flanPar = {
					rackSize: columnPar.sizeA * 2 + 6,
					height: topTrussPar.centerY - topTrussPar.centerYBot,
					thk: 8,
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, -200, 0),
					dxfPrimitivesArr: dxfPrimitivesArr,
					noBolts: true
				};
	
				var rackFlan = drawTrussFlan(flanPar);
				rackFlan.position.y = par.height + topTrussPar.centerYBot;
				rackFlan.position.x = 0;
				rackFlan.position.z = -params.trussThk;
				rackFlan.rotation.y = Math.PI;
				section.add(rackFlan);
			}
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
			if(params.carportType == "консольный"){
				truss.position.y -= trussPar.height
			}
		}
		
		section.rotation.y = Math.PI / 2;
		section.position.x = columnPar.sizeB / 2 + params.sectLen * i;
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
		var progonStep = halfAngle / (par.vertArcAmt / 2);

		if (params.carportType == "односкатный" || params.carportType == "консольный") {
			var halfAngle = (topTrussPar.arcLength - par.progonProfileX)  / posRad;
			var startAngle = -halfAngle + Math.PI / 2 - par.progonProfileX / posRad;
			var progonStep = halfAngle / (par.vertArcAmt / 2);
			par.vertArcAmt = Math.ceil(par.vertArcAmt / 2);
		}

		for (var i = 0; i <= par.vertArcAmt; i++) {
			var vertProfile = drawProgon(progonPar).mesh;
			var profilePos = polar({x: par.width / 2, y: 0}, startAngle + progonStep * i, posRad);
	
			vertProfile.position.y = profilePos.y - topTrussPar.topRad + par.height + topTrussPar.centerY;
			vertProfile.position.z = profilePos.x;
			vertProfile.position.x = -params.rackFaceOffset + 50;
			vertProfile.rotation.x = -(startAngle + progonStep * i);
			console.log(vertProfile)
			vertProfile.setLayer('progon');
			carport.add(vertProfile);
		}

		//поликарбонат
		var roofRad = topTrussPar.topRad + stripeThk + par.progonProfileZ + params.roofThk;
		var extraAnle = (params.sideOffset + par.progonProfileX / 2) / roofRad; //свес сбоку

		var polyLength = params.sectLen * params.arcCount + params.rackFaceOffset * 2;
		var sectWidth = 2100;
		var polyListAmt = Math.ceil(polyLength / sectWidth);
		for (var i = 0; i < polyListAmt; i++) {
			var polySize = sectWidth;
			if ( i == ( polyListAmt - 1 )) polySize = polyLength - sectWidth * i;

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
			if (params.carportType == "односкатный"  || params.carportType == "консольный") arcPanelPar.angle = halfAngle + extraAnle;// * 2;
			
			var stripe = drawArcPanel(arcPanelPar).mesh;
			
			stripe.rotation.z = Math.PI / 2 - arcPanelPar.angle / 2;
			if (params.carportType == "односкатный"  || params.carportType == "консольный") stripe.rotation.z = Math.PI / 2;// - extraAnle;
			stripe.position.z = -arcPanelPar.height + params.rackFaceOffset
			stripe.position.z -= sectWidth * i;
			stripe.position.y = -roofRad + par.height + topTrussPar.centerY + par.progonProfileZ + params.roofThk;
			stripe.setLayer('roof');
			section.add(stripe);

			// Соединительный профиль
			if (i < (polyListAmt - 1)) {
				var polyProfilePar = {
					rad: roofRad,
					thk: params.roofThk + 2,
					angle: halfAngle * 2 + extraAnle * 2,
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
					dxfPrimitivesArr: []
				}
				if (params.carportType == "односкатный"  || params.carportType == "консольный") polyProfilePar.angle = halfAngle + extraAnle;
				var polyProfile = drawPolyConnectionProfile(polyProfilePar);
		
				polyProfile.rotation.z = Math.PI / 2 - arcPanelPar.angle / 2;
				if (params.carportType == "односкатный"  || params.carportType == "консольный") polyProfile.rotation.z = Math.PI / 2;
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
		edgePoly.position.x = -params.rackFaceOffset + 50; //50 - подогнано
		edgePoly.rotation.x = -startAngle + Math.PI / 2;
		edgePoly.setLayer('roof');
		carport.add(edgePoly);

		if (params.carportType == "двухскатный") {
			var edgePolyPos = polar({x: par.width / 2, y: 0}, endAngle, edgePolyRad + edgePolyPar.poleProfileY);
			var edgePoly = drawPole3D_4(edgePolyPar).mesh;
			edgePoly.position.y = edgePolyPos.y - roofRad + par.height + topTrussPar.centerY + par.progonProfileZ + params.roofThk;
			edgePoly.position.z = edgePolyPos.x;
			edgePoly.position.x = -params.rackFaceOffset + 50; //50 - подогнано
			edgePoly.rotation.x = -endAngle - Math.PI / 2;
			edgePoly.setLayer('roof');
			carport.add(edgePoly);
		}
	}
	
	if(params.roofType != "Арочная") {
		var profAngle = THREE.Math.degToRad(topTrussPar.topAng);
		
		var basePoint = topTrussPar.basePoint;
		var progonAmt = Math.ceil(par.vertArcAmt / 2);
		var topOffset = 60; // отступ от верха
		var step = (topTrussPar.length - topOffset - par.progonProfileX - par.progonProfileX / 2) / (progonAmt - 1);

		for (var i = 0; i < progonAmt; i++) {
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
		var polyListAmt = Math.ceil(polyLength / sectWidth);
		
		for (var i = 0; i < polyListAmt; i++) {
			var polySize = sectWidth;
			if ( i == ( polyListAmt - 1 )) polySize = polyLength - sectWidth * i;

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
				if (i < (polyListAmt - 1)) {
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
			if (i < (polyListAmt - 1)) {
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
		var pos = {
			x: par.width / 2,
			y: par.height + topTrussPar.centerY + (stripeThk + 2 + par.progonProfileZ) / Math.cos(profAngle)
		};

		var rightPos = polar(pos, -profAngle, halfRoofLength)
		var edgePoly = drawPole3D_4(edgePolyPar).mesh;
		edgePoly.position.y = rightPos.y;
		edgePoly.position.z = rightPos.x - params.rackFaceOffset;
		edgePoly.position.x = -65;
		edgePoly.rotation.x = profAngle;
		edgePoly.setLayer('roof');
		carport.add(edgePoly);

		if (params.carportType == 'двухскатный') {
			var leftPos = polar(pos, profAngle, -halfRoofLength - 2)
			edgePoly.position.y = leftPos.y;
			edgePoly.position.z = leftPos.x;
			edgePoly.position.x = -65;
			edgePoly.rotation.x = -profAngle;
			edgePoly.setLayer('roof');
			carport.add(edgePoly);
			
			edgePolyPar.partName = 'topRoofProfile';
			var edgePoly = drawPole3D_4(edgePolyPar).mesh;
			edgePoly.position.y = par.height + topTrussPar.centerY + (stripeThk + 2 + par.progonProfileZ + params.roofThk) / Math.cos(profAngle);
			edgePoly.position.z = par.width / 2 - params.roofThk / 2;
			edgePoly.position.x = -65;
			edgePoly.rotation.x = Math.PI / 2;
			edgePoly.setLayer('roof');
			carport.add(edgePoly);
		}
	}
	
	return carport;
}


