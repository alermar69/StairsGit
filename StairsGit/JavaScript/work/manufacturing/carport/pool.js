/** функция отрисовывает секцию сдвижного навеса для бассейна
**/

function drawArcPoolSect(par){
	if(!par) par = {};
	initPar(par)
	
	//ролики
	var weelPar = {}
	var weelAmt = 3;
	var sideOffset = 50; //отступ ролика от края секции
	for(var i=0; i<weelAmt; i++){
		var leftWeel = drawWeelBlock(weelPar).mesh;
		leftWeel.position.x = -par.width / 2 + weelPar.width / 2;
		leftWeel.position.y = weelPar.diam / 2 + partPar.rail.profSize.y + partPar.rail.stripe.y
		leftWeel.position.z = - params.sectLen / 2 + sideOffset + ((params.sectLen - sideOffset * 2) / (weelAmt - 1)) * i
		par.mesh.add(leftWeel);
		
		var rightWeel = drawWeelBlock(weelPar).mesh;
		rightWeel.position.x = par.width / 2 - weelPar.width / 2;
		rightWeel.position.y = leftWeel.position.y
		rightWeel.position.z = leftWeel.position.z
		par.mesh.add(rightWeel);
		
	}
/*	
	//нижняя перемычка
	var basePolePar = {
		poleProfileY: partPar.rafter.profSize.x,
		poleProfileZ: partPar.rafter.profSize.y,
		dxfBasePoint: par.dxfBasePoint,
		length: params.sectLen,
		poleAngle: 0,
		material: params.materials.metal,
		dxfArr: [],
		type: 'rect',
		partName: 'base'
	};
	
	var leftPole = drawPole3D_4(basePolePar).mesh;
	leftPole.rotation.y = Math.PI / 2
	leftPole.position.x = -par.width / 2;
	leftPole.position.y = weelPar.height + partPar.rail.profSize.y + partPar.rail.stripe.y
	leftPole.position.z = params.sectLen / 2
	par.mesh.add(leftPole);
	
	var rightPole = drawPole3D_4(basePolePar).mesh;	
	rightPole.rotation.y  = leftPole.rotation.y 
	rightPole.position.x = par.width / 2 - basePolePar.poleProfileZ
	rightPole.position.y = leftPole.position.y
	rightPole.position.z = leftPole.position.z
	par.mesh.add(rightPole);
*/

	var basePolePar = {
		size: 75,
		len: params.sectLen,
	}
	var leftPole = drawBaseBeam(basePolePar).mesh;
	leftPole.rotation.y = Math.PI
	leftPole.position.x = -par.width / 2 + basePolePar.profSize.x;
	leftPole.position.y = weelPar.height + partPar.rail.profSize.y + partPar.rail.stripe.y
	leftPole.position.z = params.sectLen / 2
	par.mesh.add(leftPole);
	
	var rightPole = drawBaseBeam(basePolePar).mesh;	
	rightPole.rotation.y = 0 
	rightPole.position.x = par.width / 2 - basePolePar.profSize.x
	rightPole.position.y = leftPole.position.y
	rightPole.position.z = -params.sectLen / 2
	par.mesh.add(rightPole);

	
	//дуги
	var sectPar = {
		len: params.sectLen,
		width: par.width,
		a1: par.a1,
		rafterAmt: Math.ceil(params.sectLen / 700) + 1,
	}

	var sect = drawRoofCarcas(sectPar).mesh
	sect.position.y = weelPar.height + partPar.rail.profSize.y + partPar.rail.stripe.y + basePolePar.poleProfileY - 60 //60 - подогнано
	par.mesh.add(sect)
	
	//кровля		
	var roofPar = {
		topArc: sectPar.topArc,
		len: params.sectLen,
	}
	
	var roof = drawRoof(roofPar)
	roof.position.z = - params.sectLen / 2
	roof.position.y = sect.position.y
	roof.setLayer('roof');
	par.mesh.add(roof);

	par.topArc = sectPar.topArc
	
	//щетки
	if(params.lineBrush == "есть"){
		//Щетки ставятся на все секции, кроме первой
		if(par.sectId > 0){
			var arcPanelPar = {
				rad: par.topArc.rad - partPar.rafter.profSize.y,
				height: 10,
				thk: 45,
				angle: par.topArc.startAngle - par.topArc.endAngle,
				dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
				material: params.materials.timber,
				partName: 'lineBrush',
				dxfPrimitivesArr: dxfPrimitivesArr
			}
			

			var brush = drawArcPanel(arcPanelPar).mesh;
			brush.rotation.z = par.topArc.endAngle;
			brush.position.y = par.topArc.center.y
			brush.position.z = -params.sectLen / 2
			par.mesh.add(brush)
			
		}
	}
	
	return par;
}


/** функция отрисовывает сегмент шарового купола
	fullAngle  - полный угол сектора
	extraRad - увеличение радиуса и высоты по сравнению со значением из параметров
*/

function drawSphereSegment(par){
	
	var partPar = calcCarportPartPar();
	
	var dome = new THREE.Object3D();
	if(!par.extraRad) par.extraRad = 0;
	

	//ось стропила (дуга)
	var rafterPar = {
		center: {
			x: partPar.dome.topFlanDiam / 2 - partPar.dome.arcFixLen / 2,
			y: 0,
		},
	}
	
	rafterPar.midRad = params.domeDiam / 2 - rafterPar.center.x + par.extraRad; //радиус по средней линии
	rafterPar.center.y = params.height + par.extraRad - rafterPar.midRad;
	


	var axisOffset = partPar.dome.topFlanDiam / 2 - partPar.dome.arcFixLen / 2 //смещение оси дуги относительно оси павильона
	var rad = params.domeDiam / 2 - axisOffset + par.extraRad
	var height = params.height + par.extraRad;

	
	//разница по высоте в сравнении с половиной сферы
	var extraHeight = height - rad;

	
	//отступ снизу
	var botOffset = 0;
	if(par.isMovable) botOffset = partPar.dome.weelBlockHeight + partPar.dome.tubeDiam + partPar.dome.baseThk;
	
	//кольцо в основании
	var botLine = {
		p1: {x: 0, y: partPar.dome.baseThk + botOffset},		
	}
	
	if(!par.isMovable){
		//пересечение основания с внешней дугой стропила
		botLine.p2 = itercectionLineCircle(botLine.p1, newPoint_xy(botLine.p1, 10, 0), rafterPar.center, rafterPar.midRad + partPar.rafter.profSize.y / 2)[0]
	}
	if(par.isMovable){
		//пересечение основания с внутренней дугой стропила
		botLine.p2 = itercectionLineCircle(botLine.p1, newPoint_xy(botLine.p1, 10, 0), rafterPar.center, rafterPar.midRad - partPar.rafter.profSize.y / 2)[0]
	}
	
	var basePar = {
		rad: botLine.p2.x,
		len: par.fullAngle * botLine.p2.x,
		angle: par.fullAngle,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
		isMovable: par.isMovable,
	}
	
	//угловой шаг дуг
	var arcStepMax = 1000; //макс. шаг дуг
	var arcAmt = Math.ceil(basePar.len / arcStepMax);
	var arcStepAng = par.fullAngle / arcAmt;
	basePar.arcStepAng = arcStepAng;
	basePar.arcAmt = arcAmt;
	
	//дополнительный угол, учитывающий ширину профиля и фланцы
	var baseExtraAng = (partPar.rafter.profSize.x + 4 * 2) / basePar.rad; // 4 - толщина фланца
	basePar.angle += baseExtraAng
	
	if(par.railDiam) basePar.railDiam = par.railDiam
	
	var ring = drawBaseRing(basePar).mesh;		
	ring.rotation.x = -Math.PI / 2;
	ring.rotation.z = -baseExtraAng / 2;
	
	ring.position.y = botOffset
	dome.add(ring)
	
	//сохраняем для использования диаметр рельса
	par.railDiam = basePar.railDiam - 30 * 2; //30 - половина ширины ролика

	//верхний фланец
	var flanPar = {
		diam: partPar.dome.topFlanDiam,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 3000, 0),
		dxfArr: dxfPrimitivesArr,
		angle: basePar.angle,
		arcStepAng: arcStepAng,
		arcAmt: arcAmt,
	}
	if(par.isMovable) flanPar.bearingHeight = par.extraRad; //высота подшипника)
	
	var flan = drawDomeTopFlan(flanPar).mesh;
	flan.rotation.x = -Math.PI / 2;
	flan.position.y = height - partPar.rafter.profSize.y / 2 - flanPar.thk;
	dome.add(flan)
	

	
	//рассчитываем начальный и конечный угол дуги
	extraAngle = -angle(rafterPar.center, botLine.p2)

	//параметры дуги из профиля
	var arcPanelPar = {
		rad: rad,
		height: partPar.rafter.profSize.x,
		thk: partPar.rafter.profSize.y,
		angle: Math.PI / 2 + extraAngle,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 4000, 0),
		material: params.materials.metal,
		partName: 'carportBeam',
		dxfPrimitivesArr: dxfPrimitivesArr
	}
	
	//удлинняем дуги на половину длины крепления к верхнему диску
	arcPanelPar.angle += partPar.dome.arcFixLen / 2 / rad;
	
	//перемычки между дугами		
	var bridgePosY = params.height / 2;
	var bridgePosAng = Math.asin((bridgePosY - rafterPar.center.y) / rad)
	var bridgePosRad = rad * Math.cos(bridgePosAng) - partPar.rafter.profSize.x + rafterPar.center.x;
	
	var bridgePar = {
		poleProfileY: partPar.purlin.profSize.y,
		poleProfileZ: partPar.purlin.profSize.x,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 5000, 0),
		length: bridgePosRad * arcStepAng - partPar.rafter.profSize.y, //упрощенная формула - надо править
		poleAngle: 0,
		material: params.materials.metal,
		dxfArr: dxfPrimitivesArr,
		type: 'rect',
		partName: 'carportBridge'
	};
		
	//фланцы крепления дуг к основанию
	var flanPar = {
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 2000, 2000),
		dxfArr: dxfPrimitivesArr,
		ang: extraAngle,
		rad: basePar.rad,
	}

	//для двери делаем фланец по ширине дуги
	if(par.isMovable) {
		flanPar.botWidth = partPar.rafter.profSize.y
		flanPar.vertStripePos = "out"
		
	}


	//параметры сектора из поликарбоната
	var sectorPolyPar = {
		rad: rad + partPar.rafter.profSize.y / 2,
		height: partPar.rafter.profSize.y,
		thk: params.roofThk,
		angleWidth: arcStepAng,
		extraAngle: extraAngle,
		topCutAngle: Math.atan(rafterPar.center.x / rafterPar.midRad),
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 8000, 0),
		material: params.materials.plastic_roof,
		dxfArr: dxfPrimitivesArr,
		rafterPar: rafterPar,
	}
	
	//параметры соединиельных профилей поликарбоната
	var polyProfilePar = {
		rad: rad + partPar.rafter.profSize.y / 2,
		thk: params.roofThk + 2,
		angle: Math.PI / 2 + extraAngle,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
		dxfPrimitivesArr: []
	}

	//параметры щеток (если есть)
	var lineBrushPar = {
		rad: rad - partPar.rafter.profSize.y,
		height: 10,
		thk: 45,
		angle: Math.PI / 2 + extraAngle,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
		material: params.materials.timber,
		partName: 'lineBrush',
	}
	

//цикл построения полярного массива элементов
	for(var i=0; i<= arcAmt; i++){
		var pos = polar({x:0, y:0}, arcStepAng * i, -arcPanelPar.height / 2); //смещение на половину профиля
		pos = polar(pos, arcStepAng * i + Math.PI / 2, rafterPar.center.x); //смещение к краю диска
		
		//отрисовка дуг
		var arcProf = drawArcPanel(arcPanelPar).mesh;
		arcProf.rotation.z = -extraAngle;
		arcProf.rotation.y = arcStepAng * i;
		arcProf.position.x = pos.y;
		arcProf.position.y = rafterPar.center.y;
		arcProf.position.z = pos.x;
		dome.add(arcProf)
		
		//перемычки между дугами
		if(params.cylinderBase == "нет" && i != arcAmt){
			var extraPosAngle = partPar.rafter.profSize.y / 2 / bridgePosRad
			var bridgePos = polar({x:0, y:0}, -arcStepAng * i - extraPosAngle, bridgePosRad)
			//bridgePos = polar(bridgePos, -arcStepAng * i + Math.PI / 2, -partPar.rafter.profSize.y / 2)
			
			
			var bridge = drawPole3D_4(bridgePar).mesh;
			bridge.rotation.y = arcStepAng * (i + 0.5) + Math.PI / 2;		
			
			bridge.position.x = bridgePos.x;
			bridge.position.y = bridgePosY;
			bridge.position.z = bridgePos.y;
			
			dome.add(bridge)
		}
		
		//фланцы крепления к основанию
		var fixPlate = drawRafterFixUnit(flanPar).mesh;
		
		fixPlate.rotation.y = arcStepAng * i - Math.PI;
		var flanPos = polar({x:0, y:0}, arcStepAng * i, arcPanelPar.height / 2 + flanPar.thk); //смещение на половину профиля
			flanPos = polar(flanPos, arcStepAng * i + Math.PI / 2, basePar.rad);
		
		//дополнительное смещение для фланцев двери
		if(par.isMovable) {
			flanPos = polar(flanPos, arcStepAng * i + Math.PI / 2, flanPar.botWidth);
			
		}
		
		
		fixPlate.position.x = flanPos.y;
		fixPlate.position.y = botOffset + partPar.dome.baseThk;
		fixPlate.position.z = flanPos.x;
		
		dome.add(fixPlate)
		
		//поликарбонат сегменты
		if(i != arcAmt){
			var sheetPos = polar({x:0, y:0}, -arcStepAng * i, rafterPar.center.x); //смещение к краю диска
			var coverSector = drawSphereSector(sectorPolyPar).mesh;
			coverSector.rotation.y = arcStepAng * i + Math.PI;
			coverSector.rotation.z = -sectorPolyPar.topCutAngle;
			coverSector.position.x = sheetPos.x
			coverSector.position.y = rafterPar.center.y
			coverSector.position.z = sheetPos.y
			dome.add(coverSector)
		}
		
		// Соединительный профиль
		if (i > 0 && i != arcAmt) {
			
			var polyProfile = drawPolyConnectionProfile(polyProfilePar);
	
			polyProfile.rotation.z = arcProf.rotation.z;
			polyProfile.rotation.y = arcProf.rotation.y;

			polyProfile.position.x = arcProf.position.x;
			polyProfile.position.y = arcProf.position.y;
			polyProfile.position.z = arcProf.position.z
			
			polyProfile.setLayer('roof');
			if(!testingMode) dome.add(polyProfile);
		}
			
		sectorPolyPar.dxfArr = []; //выводим в dxf только первую развертку
		//ролики
		if(par.isMovable){
			var weelPar = {}
			var weelPosAng = Math.PI / 2 + arcStepAng * i;
			//смещаем первый и последний ролики
			var weelMooveAng = 50 / (par.railDiam / 2)
			if(i == 0) weelPosAng += weelMooveAng;
			if(i == arcAmt) weelPosAng -= weelMooveAng;
			
			var weelPos = polar({x:0, y:0}, weelPosAng, par.railDiam / 2);
			
			
			var weel = drawWeelBlock(weelPar).mesh;
			
			weel.rotation.y = weelPosAng - Math.PI / 2;
			weel.position.x = weelPos.y;
			weel.position.y = weelPar.diam / 2 + partPar.dome.tubeDiam + partPar.dome.baseThk;
			weel.position.z = weelPos.x;
		
			dome.add(weel)
		}
		
			//щетки
		if(params.lineBrush == "есть" && par.isMovable && (i == 0 || i == arcAmt)){
			var brush = drawArcPanel(lineBrushPar).mesh;
			brush.rotation.z = arcProf.rotation.z;
			brush.rotation.y = arcProf.rotation.y;

			brush.position.x = arcProf.position.x;
			brush.position.y = arcProf.position.y;
			brush.position.z = arcProf.position.z
			
			brush.setLayer('roof');
			if(!testingMode) dome.add(brush);		
		}
	
		
	}
	
	

	
	dome.setLayer('carcas');
	
	return dome;
}

/** функция отрисовывает верхний фланец купола
*/

function drawDomeTopFlan(par){

	if(!par.dxfArr) par.dxfArr = [];
	if(!par.dxfBasePoint) par.dxfBasePoint = {x:0, y:0};
	
	par.thk = 8;
	var centerPoint = {x:0, y:0}
	par.shape = new THREE.Shape();
	par.mesh = new THREE.Object3D();
	
	var bearingRad = 25 //радиус подшипника

	addCircle(par.shape, par.dxfArr, centerPoint, par.diam / 2, par.dxfBasePoint)
	
	//отверстие под петлю в центре
	addRoundHole(par.shape, par.dxfArr, centerPoint, bearingRad, par.dxfBasePoint)
	
	//отверстия для крепления дуг
	for(var i=0; i<=par.arcAmt; i++){
		//var pos = polar({x:0, y:0}, arcStepAng * i, -arcPanelPar.height / 2); //смещение на половину профиля
		var center1 = polar({x:0, y:0}, par.arcStepAng * i, par.diam / 2 - 30); //смещение к краю диска
		addRoundHole(par.shape, par.dxfArr, center1, 6.5, par.dxfBasePoint)
		var center2 = polar({x:0, y:0}, par.arcStepAng * i, par.diam / 2 - 90); //смещение к краю диска
		addRoundHole(par.shape, par.dxfArr, center2, 6.5, par.dxfBasePoint)
		
		//винты
		var boltPar = {
			diam: 10,
			len: 30,
			headType: "потай",
			headShim: true,
		}
		
		var bolt = drawBolt(boltPar).mesh;
		bolt.position.x = center1.x;
		bolt.position.y = center1.y;
		bolt.position.z = boltPar.len / 2 - 1;
		bolt.rotation.x = Math.PI / 2;
		par.mesh.add(bolt);
		
		var bolt = drawBolt(boltPar).mesh;
		bolt.position.x = center2.x;
		bolt.position.y = center2.y;
		bolt.position.z = boltPar.len / 2 - 1;
		bolt.rotation.x = Math.PI / 2;
		par.mesh.add(bolt);
		
		//закладная
		var rackFlan = drawRackFlan(40);
		rackFlan.rotation.z = par.arcStepAng * i + Math.PI / 2;
		rackFlan.position.x = (center1.x + center2.x) / 2;
		rackFlan.position.y = (center1.y + center2.y) / 2;
		rackFlan.position.z = 20;
		if(!testingMode) par.mesh.add(rackFlan);
	}
	
	var extrudeOptions = {
		amount: par.thk, 
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	
	var geom = new THREE.ExtrudeGeometry(par.shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var flan = new THREE.Mesh(geom, params.materials.metal);
	par.mesh.add(flan);
	flan.setLayer('flans');
	
	if(par.bearingHeight){
		
		var geom = new THREE.CylinderBufferGeometry(bearingRad, bearingRad, par.bearingHeight - par.thk, 20);
	
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var bearing = new THREE.Mesh(geom, params.materials.metal);
		bearing.rotation.x = Math.PI / 2;
		bearing.position.z = -par.bearingHeight / 2 + par.thk
		
		par.mesh.add(bearing);
		bearing.setLayer('flans');
	}
	
	var partName = "trussFlan";
	var area = par.diam * par.diam / 1000000;
	
	if (typeof specObj != 'undefined') {
		name = par.diam + "х" + par.thk;
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				name: "Фланец верхний",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "carcas",
			}
		}
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		par.mesh.specParams = {specObj: specObj, amt: 1, area: area, partName: partName, name: name}
	}
	par.mesh.specId = partName + name;
	
	return par;
}



/** функция отрисовывает блок роликов для сдвижного навеса 
	@param type: single || block - тип блока: с одиночным роликом под круглую трубу или блок из трех роликов под профильный рельс
**/

function drawWeelBlock(par){
	if(!par) par = {};
	initPar(par)
	
	var partPar = calcCarportPartPar();
	
	par.height = partPar.dome.weelBlockHeight; //рабочая высота ролика от верха рельса до верха кронштейна
	par.width = 60; //полная ширина по внешним сторонам ушей
	par.diam = 34; //диаметр ролика в узкой части
	

		//круглый ролик, рисуется горизонтально
		var weelPar = {
			maxDiam: 65,
			minDiam: par.diam,
			grooveDiam: 28,
			width: 45,
			holeDiam: 8,
		}
		
		if(params.carportType == "сдвижной") {
			par.diam = 50;
			weelPar.maxDiam = par.diam;
			weelPar.minDiam = par.diam;
		}
			
		var p0 = {x:0, y:0} //точка в середине ролика
		
		//рисуем правую половину ролика
		var p1 = newPoint_xy(p0, weelPar.holeDiam / 2, -weelPar.width / 2, )
		var p2 = newPoint_xy(p0, weelPar.maxDiam / 2, -weelPar.width / 2, )
		var p3 = newPoint_xy(p0, weelPar.maxDiam / 2, weelPar.width / 2)
		var p4 = newPoint_xy(p0, weelPar.holeDiam / 2, weelPar.width / 2)
		
		//габариты проточки
		var p21 = newPoint_xy(p0, weelPar.maxDiam / 2, -weelPar.grooveDiam / 2)
		var p22 = newPoint_xy(p0, weelPar.minDiam / 2, -weelPar.grooveDiam / 2)
		var p32 = newPoint_xy(p0, weelPar.minDiam / 2, weelPar.grooveDiam / 2)
		var p31 = newPoint_xy(p0, weelPar.maxDiam / 2, weelPar.grooveDiam / 2)
		
		//p22.filletRad = p32.filletRad = weelPar.grooveDiam / 2 - 1; TODO: Надо доработать drawShapeByPoints2 чтобы скругления нормально строились для внутренних углов
		
	/*	
		//создаем шейп
		var shapePar = {
			points: [p1, p2, p21, p22, p32, p31, p3, p4],
			dxfArr: [],
			dxfBasePoint: par.dxfBasePoint,
		}
		
		var shape = drawShapeByPoints2(shapePar).shape;
		
		
		var extrudeOptions = {
			amount: 10,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};
		
		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	*/

		var points = [p1, p2, p21, p22, p32, p31, p3, p4];
		if(params.carportType == "сдвижной") points = [p1, p2, p3, p4];
		var geom = new THREE.LatheGeometry(points, 36, 2, 2 * Math.PI);
			
		var weel = new THREE.Mesh(geom, params.materials.whitePlastic);
		weel.rotation.z = Math.PI / 2
		par.mesh.add(weel)
		
		
		//вертикальные уши
		var holderPar = {
			width: 40, //ширина вертикального уха
			height: 60,
			offset: 20,
			thk: 4,
			flanLen: 80, //длина верхнего фланца
		}
		
		holderPar.height = par.height - weelPar.minDiam / 2 + holderPar.offset;

		var p1 = newPoint_xy(p0, -holderPar.width / 2, -holderPar.offset, )
		var p2 = newPoint_xy(p1, 0, holderPar.height, )
		var p3 = newPoint_xy(p2, holderPar.width, 0)
		var p4 = newPoint_xy(p3, 0, -holderPar.height)
		
		p1.filletRad = p4.filletRad = 18
		
		var shapePar = {
			points: [p1, p2, p3, p4],
			dxfArr: [],
			dxfBasePoint: par.dxfBasePoint,
		}
		
		var shape = drawShapeByPoints2(shapePar).shape;
		
		addRoundHole(shape, par.dxfArr, p0, 4, par.dxfBasePoint)

		
		var extrudeOptions = {
			amount: holderPar.thk,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};
		
		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);		
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		
		var holder = new THREE.Mesh(geom, params.materials.metal);
		holder.rotation.y = Math.PI / 2
		holder.position.x = -par.width / 2
		par.mesh.add(holder)
		
		var holder = new THREE.Mesh(geom, params.materials.metal);
		holder.rotation.y = Math.PI / 2
		holder.position.x = par.width / 2 - holderPar.thk
		par.mesh.add(holder)
		
		//верхний фланец
		var flanWidth = par.width - holderPar.thk * 2
		var holeOffset = 10
		var flanPar = {
			height: holderPar.flanLen,
			width: flanWidth,
			thk: holderPar.thk,
			cornerRad: 10,
			holeRad: 4,
			noBolts: true,
			dxfPrimitivesArr: par.dxfArr,
			dxfBasePoint: par.dxfBasePoint,
			roundHoleCenters: [
				{x: flanWidth / 2, y: holeOffset },
				{x: flanWidth / 2 , y: holderPar.flanLen - holeOffset},
			],
		}
		
		var flan = drawRectFlan2(flanPar).mesh;
		flan.rotation.x = -Math.PI / 2;
		flan.position.y = par.height - weelPar.minDiam / 2 - holderPar.thk
		flan.position.x = -flanPar.width / 2;
		flan.position.z = flanPar.height / 2;
		par.mesh.add(flan);
	
		
	
	
	//сохраняем данные для спецификации
	var partName = 'weelBlock';
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: 'Ролик с кронштейном',
				metalPaint: true,
				timberPaint: false,
				isModelData: true,
				division: "metal",
				purposes: [],
				workUnitName: "amt",
				group: "carcas",
			}
		}
		
		name = "Ф" + weelPar.maxDiam + " h=" + par.height;
		
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		par.mesh.specParams = {specObj: specObj, amt: 1, partName: partName, name: name}
	}
	
	par.mesh.specId = partName + name;
	
	par.weelPar = weelPar
	
	return par;
}

/** функция отрисовывает кольцо основания для купольного навеса */

function drawBaseRing(par){
	if(!par) par = {};
	initPar(par)
	
	par.dxfArr = dxfPrimitivesArr
	par.diam = par.rad * 2;
	
	var partPar = calcCarportPartPar();
	
	par.thk = partPar.dome.baseThk;
	
	par.railBaseWidth = 100;
	if(par.railDiam) par.railBaseWidth = (par.railDiam - par.diam) / 2
	if(par.isMovable) par.railBaseWidth = 60;
	
	par.ringWidth = 100;
	par.railDiam = par.diam + par.railBaseWidth * 2;
	par.extraAngle = (partPar.dome.overlayAng + 1) / 180 *  Math.PI; //угол нахлеста двери
	par.railAngle = params.doorAng * 2 / 180 * Math.PI + par.extraAngle * 2 ;
	par.tubeDiam = partPar.dome.tubeDiam
	
	par.railStartAng = -Math.PI / 2 - par.extraAngle;
	par.railEndAng = par.railStartAng + par.railAngle;
	
	if(par.isMovable){
		par.extraAngle = 0;
		par.railStartAng = 0;
		par.railEndAng = par.angle;
		//par.railDiam = par.diam - par.railBaseWidth * 2;
	}
	
	var shape = new THREE.Shape();
	var p0 = {x: 0, y: 0} //центр дуг
	
	//нижний внутренний угол
	var p1 = polar(p0, par.railStartAng, par.diam / 2);
	//нижний внешний угол
	var p2 = polar(p0, par.railStartAng, par.railDiam / 2);
	//верхний внешний угол
	var p3 = polar(p0, par.railEndAng, par.railDiam / 2);
	//верхний нижний угол
	var p4 = polar(p0, par.railEndAng, par.diam / 2);

	if(!par.layer) par.layer = "parts";
	
	//неподвижное кольцо
	if(!par.isMovable){
		if(par.railAngle < Math.PI * 1.8){
			addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint, par.layer);
			addArc2(shape, par.dxfArr, p0, par.diam / 2,  par.railStartAng, par.railEndAng, false, par.dxfBasePoint, par.layer);
			
			addLine(shape, par.dxfArr, p2, p1, par.dxfBasePoint, par.layer);
			addArc2(shape, par.dxfArr, p0, par.railDiam / 2, par.railEndAng, par.railStartAng, false, par.dxfBasePoint, par.layer);
		}
		else {
			addArc2(shape, par.dxfArr, p0, par.railDiam / 2, Math.PI * 1.99999, 0, false, par.dxfBasePoint, par.layer);
		}
		
		addRoundHole(shape, par.dxfArr, p0, par.diam / 2 - par.ringWidth, par.dxfBasePoint); 
	}
	//подвижное кольцо
	/*
		var arcPanelPar = {
		rad: baseRing.rad,
		height: 8,
		thk: 100,
		angle: Math.PI * 1.999,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
		material: params.materials.metal,
		partName: 'progonProf',
		dxfPrimitivesArr: dxfPrimitivesArr,
	}
	*/
	
	if(par.isMovable){		
		addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint, par.layer);
		addArc2(shape, par.dxfArr, p0, par.railDiam / 2, par.railEndAng, par.railStartAng, false, par.dxfBasePoint, par.layer);
		addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint, par.layer);
		addArc2(shape, par.dxfArr, p0, par.diam / 2, par.railEndAng, par.railStartAng,  true, par.dxfBasePoint, par.layer);
	}

	//отверстия для установки фланцев крепления дуг
	for(var i=0; i<=par.arcAmt; i++){
		for(var sideFactor = 0; sideFactor < 2; sideFactor++){
		var p0 = polar({x:0, y:0}, par.arcStepAng * i + Math.PI / 2, 2); //смещение на толщину фланца
		if(sideFactor > 0) p0 = polar(p0, par.arcStepAng * i + Math.PI / 2, partPar.rafter.profSize.x + 4); //смещение на ширину профиля
		var holePosRad = par.rad - 20;
		if(par.isMovable) holePosRad = par.rad + 20;
		var center1 = polar(p0, par.arcStepAng * i, holePosRad); //смещение к краю диска
		addRoundHole(shape, par.dxfArr, center1, 3, par.dxfBasePoint)
		
		var holePosRad = par.rad - 40;
		if(par.isMovable) holePosRad = par.rad + 40;
		var center2 = polar(p0, par.arcStepAng * i, holePosRad); //смещение к краю диска
		addRoundHole(shape, par.dxfArr, center2, 3, par.dxfBasePoint)
		}		
	}

	
	var treadExtrudeOptions = {
		amount: par.thk, 
		bevelEnabled: false,
		curveSegments: 72,
		steps: 1
	};
		
	var geom = new THREE.ExtrudeGeometry(shape, treadExtrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var plate = new THREE.Mesh(geom, params.materials.metal);
	par.mesh.add(plate)
	
	//рельс
	if(!par.isMovable){
		var geom = new THREE.TorusGeometry(par.railDiam / 2, par.tubeDiam / 2, 18, 72, par.railAngle);
		var rail = new THREE.Mesh(geom, params.materials.metal);
		rail.rotation.z = par.railStartAng
		rail.position.z = par.tubeDiam / 2 + par.thk
		par.mesh.add(rail)
	}
	
	//вертикальное ребро
	
	//параметры дуги из профиля
	var arcPanelPar = {
		rad: par.rad - 60 - partPar.dome.baseStripe.x / 2,
		height: partPar.dome.baseStripe.y,
		thk: partPar.dome.baseStripe.x,
		//angle: Math.PI * 2 - params.doorAng / 180 * Math.PI,
		angle: par.angle,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 4000, 0),
		material: params.materials.metal,
		dxfPrimitivesArr: dxfPrimitivesArr
	}
	if(par.isMovable) {
		arcPanelPar.angle = par.angle
		arcPanelPar.rad = par.rad + 60 - partPar.dome.baseStripe.x / 2
	}
	var stripe = drawArcPanel(arcPanelPar).mesh;
	stripe.position.z = par.thk
	par.mesh.add(stripe)

	
	
	//сохраняем данные для спецификации
	var partName = 'baseRing';
	if(par.isMovable) partName = 'doorBaseRing';
	
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: 'Основание павильона',
				metalPaint: true,
				timberPaint: false,
				isModelData: true,
				division: "metal",
				purposes: [],
				workUnitName: "amt",
				group: "carcas",
			}
		}
		if(par.isMovable) specObj[partName].name = "Основание двери"
		name = "Ф" + Math.round(par.diam);
		
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		par.mesh.specParams = {specObj: specObj, amt: 1, partName: partName, name: name}
	}
	
	par.mesh.specId = partName + name;
	
	return par;
}

/** функция отрисовывает пластину для крепления дуги к основанию
par.ang
*/

function drawRafterFixUnit(par){
	if(!par) par = {};
	initPar(par)

	par.topWidth = partPar.rafter.profSize.y - 5;
	if(!par.botWidth) par.botWidth = 60;
	par.height = 120;
	par.thk = 4;
	if(!par.vertStripePos) par.vertStripePos = "in"
	
	var ang = par.ang - Math.PI / 2
	//корректируем угол на высоту фланца
	ang -= par.height / par.rad
	/*
	if(par.ang > 0) ang -= par.height / par.rad
	else ang += par.height / par.rad
	*/
	var shape = new THREE.Shape();
	var p0 = {x: 0, y: 0} //центр дуг
	
	var p1 = copyPoint(p0)
	var p2 = newPoint_y(p0, par.height, ang)
	var p3 = newPoint_xy(p2, par.topWidth, 0)
	var p4 = newPoint_xy(p0, par.botWidth, 0)
	
	//участок, примыкающий к вертикальной полосе на внутренней стороне
	if(p3.x < p4.x){
		var p41 = newPoint_xy(p4, 0, partPar.dome.baseStripe.y)
	}
	else{
		var p41 = itercection(p4, p3, {x: 0, y: partPar.dome.baseStripe.y}, {x: 10, y: partPar.dome.baseStripe.y})
		p4.x = p41.x
	}
	
	var points = [p1, p2, p3, p41, p4]
	
	//участок, примыкающий к вертикальной полосе на внешней стороне
	if(par.vertStripePos == "out"){
		
		if(p1.x < p2.x){
			var p11 = newPoint_xy(p1, 0, partPar.dome.baseStripe.y)
		}
		else{
			p1.x = p4.x - 60 + partPar.dome.baseStripe.x
			var p11 = newPoint_xy(p1, 0, partPar.dome.baseStripe.y)
		}
		
		points = [p1, p11, p2, p3, p4]
	}
	
	
	p2.filletRad = 10
	p3.filletRad = 10
		
		var shapePar = {
			points: points,
			dxfArr: par.dxfArr,
			dxfBasePoint: par.dxfBasePoint,
		}
		
		var shape = drawShapeByPoints2(shapePar).shape;
		
		par.holes = [];
	
		var center = newPoint_xy(p0, partPar.rafter.profSize.y / 2, 0)		
		center = polar(center, Math.PI / 2 + par.ang, 30)			
		addRoundHole(shape, par.dxfArr, center, 6.5, par.dxfBasePoint)
		par.holes.push(center)	
		
		center = polar(center, Math.PI / 2 + par.ang, 60)
		addRoundHole(shape, par.dxfArr, center, 6.5, par.dxfBasePoint)
		par.holes.push(center)

		
		var extrudeOptions = {
			amount: par.thk,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};
		
		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);		
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		
		//первая пластина
		var holder = new THREE.Mesh(geom, params.materials.metal);
		par.mesh.add(holder)
		
		//вторая пластина
		var holder = new THREE.Mesh(geom, params.materials.metal);
		holder.position.z = partPar.rafter.profSize.x + par.thk
		par.mesh.add(holder)

		//болты	
		par.holes.forEach(function(center){
			var boltPar = {
				diam: 10,
				len: 70,
				headType: "шестигр.",
				headShim: true,
			}
			
			var bolt = drawBolt(boltPar).mesh;
			bolt.position.x = center.x;
			bolt.position.y = center.y;
			bolt.position.z = boltPar.len / 2 - 5;
			bolt.rotation.x = Math.PI / 2;
			par.mesh.add(bolt);
		});

	
	return par;
}

/** функция отрисовывает рельс, по которому двигаются секции навеса
len - длина

**/
function drawPoolRail(par){
	if(!par) par = {};
	initPar(par)
	
	//тело рельса
	var polePar = {
		poleProfileY: partPar.rail.profSize.y,
		poleProfileZ: partPar.rail.profSize.x,
		dxfBasePoint: par.dxfBasePoint,
		length: par.len,
		material: params.materials.metal,
	};
	
	var rail = drawPole3D_4(polePar).mesh;
	rail.rotation.y = -Math.PI / 2
	
	par.mesh.add(rail);
	
	//полоса
	var polePar = {
		poleProfileY: partPar.rail.stripe.y,
		poleProfileZ: partPar.rail.stripe.x,
		dxfBasePoint: par.dxfBasePoint,
		length: par.len,
		material: params.materials.metal,
	};
	
	var stripe = drawPole3D_4(polePar).mesh;
	stripe.rotation.y = -Math.PI / 2
	stripe.position.y = partPar.rail.profSize.y
	stripe.position.x = -partPar.rail.profSize.x / 2 + partPar.rail.stripe.x / 2
	par.mesh.add(stripe);
	
	//сохраняем данные для спецификации
	var partName = 'poolRail';
	
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: 'Рельс',
				metalPaint: true,
				timberPaint: false,
				isModelData: true,
				division: "metal",
				purposes: [],
				workUnitName: "amt",
				group: "carcas",
			}
		}

	name = partPar.rail.profSize.x + "х" + partPar.rail.profSize.y + " L=" + par.len;
		
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		par.mesh.specParams = {specObj: specObj, amt: 1, partName: partName, name: name}
	}
	
	par.mesh.specId = partName + name;
	
	return par;	
}

function drawBaseBeam(par){
	
	if(!par) par = {};
	initPar(par)
	
	par.profSize = {
		x: par.size,
		y: par.size,
		thk: 4,
	}
	
	var shape = new THREE.Shape();
	var p0 = {x: 0, y: 0} //внешний угол
	
	var p1 = newPoint_xy(p0, par.profSize.x, 0)
	var p2 = newPoint_xy(p0, 0, par.profSize.y)
	var p3 = newPoint_xy(p2, par.profSize.thk, 0)
	var p4 = newPoint_xy(p0, par.profSize.thk, par.profSize.thk)
	var p5 = newPoint_xy(p1, 0, par.profSize.thk)
	
	var shapePar = {
		points: [p1, p0, p2, p3, p4, p5],
		dxfArr: [],
		dxfBasePoint: par.dxfBasePoint,
	}
//debugger	
	var shape = drawShapeByPoints2(shapePar).shape;
	
	var extrudeOptions = {
		amount: par.len,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);		
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	
	var pole = new THREE.Mesh(geom, params.materials.metal);
	par.mesh.add(pole)
		
		
	
	//сохраняем данные для спецификации
	var partName = 'baseBeam';
	
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: 'Нижняя балка секции',
				metalPaint: true,
				timberPaint: false,
				isModelData: true,
				division: "metal",
				purposes: [],
				workUnitName: "amt",
				group: "carcas",
			}
		}

	name = par.profSize.x + "х" + par.profSize.y + " L=" + par.len;
		
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		par.mesh.specParams = {specObj: specObj, amt: 1, partName: partName, name: name}
	}
	
	par.mesh.specId = partName + name;
	par.poleProfileY = par.profSize.thk
	
	return par
}