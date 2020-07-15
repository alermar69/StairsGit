
/** функция отрисовывает навес с опиранием кровли на прогоны */

function drawTrussCarport(par){
	
	var carport = new THREE.Object3D();
	if(!par.dxfBasePoint) par.dxfBasePoint = {x:0,y:0}

	par.width = par.width * 1.0;
	if (params.carportType == "консольный" || params.carportType == "консольный двойной") par.width *= 2.0;
	
	var columnProfPar = getProfParams(params.columnProf)
	
	var progonProfPar = getProfParams(par.progonProf);

	var fermas = new THREE.Object3D();

	par.dxfBasePoint = {x:0,y:0};

	var stripeThk = 4; //толщина полосы по верху фермы
	

	 
	//параметры фермы
	var topTrussPar = {
		thk: params.trussThk,
		stripeThk: stripeThk,
		len: params.width / 2,
		rackSize: columnProfPar.sizeB,
		model: params.beamModel,
		holesModel: params.trussHolesType,
		dxfBasePoint: par.dxfBasePoint,
		dxfPrimitivesArr: dxfPrimitivesArr
	}
	
	//цикл построения секций
	//ноль секции - ось колонны
	for (var i = 0; i <= par.sectAmt; i++) {
		var section = new THREE.Object3D();
		topTrussPar.dxfPrimitivesArr = i == 0 ? dxfPrimitivesArr : [];
		
		var fermaShapes = new THREE.Object3D();
		var drawFunc = drawTriangleSheetTruss;
		if(params.roofType == "Арочная") drawFunc = drawArcSheetTruss;
		if(params.carportType == "консольный" || params.carportType == "консольный двойной") drawFunc = drawArcSheetWing;
		
		// Правая половина
		var truss = drawFunc(topTrussPar).mesh;
		truss.position.x = -topTrussPar.len;
		truss.position.z = -topTrussPar.thk / 2;
		if(params.carportType == "консольный" || params.carportType == "консольный двойной") {
			truss.position.z = -topTrussPar.thk / 2 - columnProfPar.sizeA / 2;
		}
		truss.setLayer('carcas');
		fermaShapes.add(truss);

		if ((params.carportType == "двухскатный" && topTrussPar.hasDivide) || params.carportType == "консольный" || params.carportType == "консольный двойной") {
			//левая половина
			topTrussPar.dxfPrimitivesArr = [];
			var truss = drawFunc(topTrussPar).mesh;
			truss.position.x = topTrussPar.len;
			truss.position.z = topTrussPar.thk / 2;
			truss.rotation.y = Math.PI;
			if(params.carportType == "консольный" || params.carportType == "консольный двойной"){
				truss.position.x = -topTrussPar.len;
				truss.position.z = topTrussPar.thk / 2 + columnProfPar.sizeA / 2;
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

		fermaShapes.setLayer('carcas');
		fermaShapes.position.y = params.height;
		fermaShapes.position.z = -params.trussThk / 2;
		section.add(fermaShapes);
		
		par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, 400);

		//колонны
		var polePar = {
			poleProfileY: columnProfPar.sizeA,
			poleProfileZ: columnProfPar.sizeB,
			dxfBasePoint: par.dxfBasePoint,
			length: params.height,
			poleAngle: 0,
			material: params.materials.metal,
			dxfArr: [],
			type: 'rect',
			partName: 'carportColumn'
		};
		
		if(params.fixType == "бетон") polePar.length += 1200;
			
		var rack = drawPole3D_4(polePar).mesh;
		rack.rotation.z = Math.PI / 2;
		rack.rotation.y = Math.PI / 2;
		rack.position.x = -columnProfPar.sizeB / 2 - params.width
		if(params.fixType == "бетон") rack.position.y = -1200;
		rack.position.z = -columnProfPar.sizeA / 2;
		if(params.carportType == "консольный" || params.carportType == "консольный двойной"){
			rack.position.x = - params.width / 2;
		}
		rack.setLayer('racks');
		section.add(rack);

		par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, 400);
		
		//фланцы колонн
		if(params.carportType != "консольный" && params.carportType != "консольный двойной"){
			var flanParams = {
				dxfBasePoint: par.dxfBasePoint,
				dxfPrimitivesArr: i == 0 ? dxfPrimitivesArr : [],
				thk: 8,
				rackSize: columnProfPar.sizeA,
				isLarge: params.width > 5000,
				holes: topTrussPar.rackFlanHoles,
				flanTopAngle: topTrussPar.topAng
			};
			
			var rackFlan = drawRackFlan(flanParams);
			rackFlan.position.y = params.height;
			rackFlan.position.x = -params.width / 2;
			rackFlan.position.z = -params.trussThk - flanParams.thk;
			section.add(rackFlan);

			if (params.carportType == "односкатный") polePar.length = par.height + topTrussPar.centerYBot;
			if (params.carportType == "односкатный" && params.roofType == 'Плоская') polePar.length = par.height + topTrussPar.centerY;

			var rack = drawPole3D_4(polePar).mesh;
			rack.rotation.z = Math.PI / 2;
			rack.rotation.y = Math.PI / 2;
			rack.position.x = params.width / 2 - columnProfPar.sizeA / 2;
			if(params.fixType == "бетон") rack.position.y = -1200;
			rack.position.z = -columnProfPar.sizeB / 2;
			if (params.carportType == "односкатный") rack.position.x = -columnProfPar.sizeA;
			if (params.carportType == "односкатный" && params.roofType == 'Плоская') rack.position.x = 0;

			rack.setLayer('racks');
			section.add(rack);
		}	
		if (params.carportType == 'двухскатный') {
			var rackFlan = drawRackFlan(flanParams);
			rackFlan.position.y = params.height;
			rackFlan.position.x = params.width / 2;
			rackFlan.position.z = -params.trussThk;
			rackFlan.rotation.y = Math.PI;
			section.add(rackFlan);
		}
		else{
			if (params.roofType == 'Арочная') {
				var flanPar = {
					rackSize: columnProfPar.sizeA * 2 + 6,
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
			rackSize: columnProfPar.sizeB,
			dxfPrimitivesArr: i == 0 ? dxfPrimitivesArr : [],
			dxfBasePoint: par.dxfBasePoint
		}
		if(i < par.sectAmt){
			var truss = drawStrightTruss(trussPar).mesh;
			truss.rotation.y = -Math.PI / 2;			
			truss.position.x =  - params.width / 2;
			truss.position.y = params.height;
			truss.position.z = deltaLen / 2;
			truss.setLayer('carcas');
			section.add(truss);
			
			if (params.carportType == "двухскатный") {
				var truss = drawStrightTruss(trussPar).mesh;
				truss.rotation.y = -Math.PI / 2;			
				truss.position.x = params.width / 2;
				truss.position.y = params.height;
				truss.position.z = deltaLen / 2;
				truss.setLayer('carcas');
				section.add(truss);
			}
			if(params.carportType == "консольный" || params.carportType == "консольный двойной"){
				truss.position.y -= trussPar.height
			}
		}
		
		section.rotation.y = Math.PI / 2;
		section.position.x = columnProfPar.sizeB / 2 + params.sectLen * i;
		fermas.add(section);
	}

	fermas.position.z = params.width / 2;
	carport.add(fermas);
	
	//прогоны
	
	var progonPar = {
		poleProfileY: progonProfPar.sizeB,
		poleProfileZ: progonProfPar.sizeA,
		dxfBasePoint: {x:0,y:0},
		length: params.sectLen * params.sectAmt + params.frontOffset * 2,
		material: params.materials.metal,
		dxfArr: [],
	};
	
	var progonAmt = topTrussPar.progonAmt * 2;
	
	if(params.roofType == "Арочная") {
		
		//параметры массива прогонов
		var arrPar = {
			center: topTrussPar.topArc.center,
			rad: topTrussPar.topArc.rad + stripeThk,
			drawFunction: drawProgon,
			startAngle: topTrussPar.topArc.startAngle,
			endAngle: topTrussPar.topArc.endAngle,
			itemAmt: topTrussPar.progonAmt * 2,
			itemPar: progonPar,
			itemWidth: progonProfPar.sizeB,
		}
		//корректируем начальный и конечный угол из-за особенностей базовой точки в функции drawProgon
		arrPar.startAngle -= progonProfPar.sizeB / arrPar.rad
		arrPar.endAngle += progonProfPar.sizeB / arrPar.rad
		
		//отрисовка массива краевых прогонов
		var progonArr = drawArcArray(arrPar).mesh;
		progonArr.position.y = params.height
		progonArr.position.x = -params.frontOffset;
		progonArr.setLayer('carcas');
		carport.add(progonArr);
	}
		

	if(params.roofType != "Арочная") {
		var profAngle = THREE.Math.degToRad(params.roofAng);
		
		var basePoint = topTrussPar.basePoint;
		progonAmt = Math.ceil(progonAmt / 2);
		var topOffset = 60; // отступ от верха
		var step = (topTrussPar.length - topOffset - progonProfPar.sizeB - progonProfPar.sizeB / 2) / (progonAmt - 1);

		for (var i = 0; i < progonAmt; i++) {
			if (params.carportType == "двухскатный") {
				// левый скат
				var vertProfile = drawProgon(progonPar).mesh;
				var profilePos = polar(basePoint, profAngle, -step * i - topOffset);
				vertProfile.position.y = par.height + profilePos.y;
				vertProfile.position.z = profilePos.x;
				vertProfile.position.x = -params.frontOffset + 50;
				vertProfile.rotation.x = -profAngle - Math.PI / 2;
				vertProfile.setLayer('progon');
				carport.add(vertProfile);
			}

			// правый скат
			var vertProfile = drawProgon(progonPar).mesh;
			var profilePos = polar(basePoint, -profAngle, step * i + topOffset + progonProfPar.sizeB);
			vertProfile.position.y = par.height + profilePos.y;
			vertProfile.position.z = profilePos.x;
			vertProfile.position.x = -params.frontOffset + 50;
			vertProfile.rotation.x = profAngle - Math.PI / 2;
			vertProfile.setLayer('progon');
			carport.add(vertProfile);
		}
	}
	
	//кровля
	
	if(params.roofType == "Арочная"){
		
		var roofPar = {
			topArc: topTrussPar.topArc,
		}
		roofPar.topArc.rad += progonProfPar.sizeA;
		
		var roof = drawRoof(roofPar)
		roof.rotation.y = Math.PI / 2;
		roof.position.x = progonArr.position.x
		roof.position.y = progonArr.position.y
		roof.position.z = params.width / 2;
		
		roof.setLayer('roof');
		carport.add(roof);
	}
	
	if(params.roofType != "Арочная"){
		
		var roofPar = {}
		
		var roof = drawRoof(roofPar)
		roof.rotation.y = Math.PI / 2;
		roof.position.x = -params.frontOffset
		roof.position.y = params.height + topTrussPar.basePoint.y //progonArr.position.y + beamProfParams.sizeA / Math.cos(params.roofAng / 180 * Math.PI)
		//roof.position.z = params.width / 2;
		
		roof.setLayer('roof');
		carport.add(roof);
	}
	

	if (params.carportType == "консольный двойной") {
		var mirrorCarport = carport.cloneWithSpec();
		mirrorCarport.scale.z *= -1;
		mirrorCarport.position.z = params.width * 2;
		carport.add(mirrorCarport);
	}

	if (params.carportType != 'двухскатный') {
		var box3 = new THREE.Box3().setFromObject(carport);
		carport.position.z -= box3.max.x / 2;
	}
	return carport;
}


/** функци отрисовывает навес с балками из проф. трубы
*/

function drawBeamCarport(par){
	
	var carport = new THREE.Object3D();
	if(!par.dxfBasePoint) par.dxfBasePoint = {x:0,y:0}

	var progonProfPar = getProfParams(par.progonProf);
	var beamProfParams = getProfParams(params.beamProf)
	
	var fullLen = params.frontOffset * 2 + params.sectAmt * params.sectLen;
	
	
	//продольные балки
	
	var stringerPar = {
		poleProfileY: 100,
		poleProfileZ: 50,
		length: fullLen,
		poleAngle: 0,
		material: params.materials.metal,
		type: 'rect',
		partName: 'carportBeamLen'
	};
	
	var deltaHeight = 0
	if(params.carportType == "односкатный") deltaHeight = params.width * Math.tan(params.roofAng / 180 * Math.PI);
		
	var leftBeam = drawPole3D_4(stringerPar).mesh;
	leftBeam.position.y = params.height + deltaHeight
	leftBeam.position.z = -stringerPar.poleProfileZ / 2
	leftBeam.setLayer('carcas');
	carport.add(leftBeam)
	
	var rightBeam = drawPole3D_4(stringerPar).mesh;
	rightBeam.position.y = params.height
	rightBeam.position.z = params.width - stringerPar.poleProfileZ / 2;
	rightBeam.setLayer('carcas');
	carport.add(rightBeam)
	
	//колонны
	
	var columnProfPar = getProfParams(params.columnProf)
	var polePar = {
		poleProfileY: columnProfPar.sizeA,
		poleProfileZ: columnProfPar.sizeB,
		dxfBasePoint: par.dxfBasePoint,
		length: params.height,
		poleAngle: 0,
		material: params.materials.metal,
		dxfArr: [],
		type: 'rect',
		partName: 'carportColumn'
	};
	
	if(params.fixType == "бетон") polePar.length += 1200;
	
	for(var i=0; i<=params.sectAmt; i++){
		polePar.length = params.height + deltaHeight	
		
		var rack1 = drawPole3D_4(polePar).mesh;
		rack1.rotation.z = Math.PI / 2;
		rack1.rotation.y = Math.PI / 2;
		rack1.position.z = -columnProfPar.sizeB / 2;
		rack1.position.x = params.frontOffset + params.sectLen * i;
		if(params.fixType == "бетон") rack1.position.y = -1200;
		rack1.setLayer('racks');
		carport.add(rack1);
		
		
		polePar.length = params.height;
		
		var rack2 = drawPole3D_4(polePar).mesh;
		rack2.rotation.z = rack1.rotation.z;
		rack2.rotation.y = rack1.rotation.y;
		rack2.position.z = rack1.position.z + params.width
		rack2.position.x = rack1.position.x;
		rack2.setLayer('racks');
		carport.add(rack2);
	}
	
	//поперечные балки
	
	var beamArrPar = {
		len: fullLen,
	}
	var beamArr = drawRoofCarcas(beamArrPar).mesh
		beamArr.position.y = params.height + stringerPar.poleProfileY
		if(params.roofType == "Арочная") beamArr.position.y -= 35; //35 - подогнано
		carport.add(beamArr)
	
	//кровля
	
	if(params.roofType == "Арочная"){
		
		var roofPar = {
			topArc: beamArrPar.topArc,
		}
		
		var roof = drawRoof(roofPar)
		roof.rotation.y = Math.PI / 2;
		roof.position.y = beamArr.position.y
		roof.position.z = params.width / 2;
		
		roof.setLayer('roof');
		carport.add(roof);
	}
	
	if(params.roofType != "Арочная"){
		
		var roofPar = {
			//topArc: beamArrPar.topArc,
		}
		
		var roof = drawRoof(roofPar)
		roof.rotation.y = Math.PI / 2;
		roof.position.y = beamArr.position.y + beamProfParams.sizeA / Math.cos(params.roofAng / 180 * Math.PI)
		//roof.position.z = params.width / 2;
		
		roof.setLayer('roof');
		carport.add(roof);
	}
	
	return carport;
	
}

