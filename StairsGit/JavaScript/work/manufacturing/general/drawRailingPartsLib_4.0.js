var testingMode = false

/** функция отрисовывает стойку 40х40 с кронштейном поручня
/*@params: len,
/*@returns par.mesh

	par.len
	par.material
	par.railingSide //в какую сторону штырьки
	par.showPins //показывать ли штырьки бокового крепления
	par.isBotFlan // есть ли нижний фланец
	par.stringerSideOffset
	dxfArr
	dxfBasePoint
	showHoles
	realHolder: false;
	базовая точка - ось верхнего отверстия
*/

function drawRack3d_4(par) {
	/*
	par.len
	par.material
	par.railingSide //в какую сторону штырьки
	par.showPins //показывать ли штырьки бокового крепления
	par.isBotFlan // есть ли нижний фланец
	par.stringerSideOffset
	dxfArr
	dxfBasePoint
	showHoles
	realHolder: false;
	базовая точка - ось верхнего отверстия
	*/

	if (!par.layer) par.layer = "railing";
	if (!par.material) par.material = params.materials.metal_railing;
	var rackModel = params.banisterMaterial;
	if (specObj.unit == "banister") rackModel = params.banisterMaterial_bal;

	var len = par.len;
	var profSize = 40;
	par.holderLength = 70;
	par.mesh = new THREE.Object3D();

	var topLen = 120;

	var timberPartLen = 600;
	var botLen = len - topLen - timberPartLen;
	if (rackModel != "40х40 нерж+дуб") botLen = len;

	//тело стойки
	var p0 = { x: 0, y: 0 }
	var p1 = newPoint_xy(p0, -profSize / 2, -90);
	var p2 = newPoint_xy(p1, 0, botLen)
	var p3 = newPoint_xy(p2, profSize, 0)
	var p4 = newPoint_xy(p1, profSize, 0)

	var shape = new THREE.Shape();

	addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint, par.layer);
	addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint, par.layer);
	addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint, par.layer);
	addLine(shape, par.dxfArr, p4, p1, par.dxfBasePoint, par.layer);

	var holeDist = 60;
	//отверстия
	if (par.showHoles) {
		var rad = 6.5;
		//верхнее отверстие
		var center = { x: 0, y: 0 }
		if(testingMode) addRoundHole(shape, par.dxfArr, center, rad, par.dxfBasePoint);
		var center = { x: 0, y: -holeDist }
		if(testingMode) addRoundHole(shape, par.dxfArr, center, rad, par.dxfBasePoint);

		//на поворотной стойке для лт добавляем дополнительное отверстие крепления
		if (par.holeYTurnRack) {
			var rad1 = 3;
			if (testingMode) rad1 = 4;
			var turnRackCenter = { x: 0, y: par.holeYTurnRack - holeDist }
			addRoundHole(shape, par.dxfArr, turnRackCenter, rad1, par.dxfBasePoint);
			addLeader("Справа", 30, 70, 60, par.dxfArr, center, par.dxfBasePoint);

			var plugParams = {
				id: "stainlessPlug_16",
				width: 16,
				height: 16,
				description: "Заглушка отверстия поворотной стойки",
				group: "Ограждения",
				isCirclePlug: true,
				type: "inox",
			}
			var plug = drawPlug(plugParams);
			plug.position.z += profSize;
			plug.rotation.x = Math.PI / 2
			plug.position.y = turnRackCenter.y;
			if(!testingMode) par.mesh.add(plug);
		}
	}


	if (params.rackBottom == "боковое" && !par.isBotFlan && !par.isBolz) {
		var rackFlan = drawRackFlan(profSize);
		rackFlan.position.y -= holeDist / 2;
		rackFlan.position.z += 2;
		if (par.key == "out") rackFlan.position.z += profSize - 2 - 2;
		if(!testingMode) par.mesh.add(rackFlan);

		var plugParams = {
			id: "plasticPlug_40_40",
			width: 40,
			height: 40,
			description: "Заглушка низа стойки",
			group: "Ограждения"
		}
		var rackBotPlug = drawPlug(plugParams);
		rackBotPlug.position.z += profSize / 2;
		rackBotPlug.position.y -= topLen - holeDist / 2 + 1;
		if(!testingMode) par.mesh.add(rackBotPlug);
	}

	var extrudeOptions = {
		amount: profSize,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var rack = new THREE.Mesh(geom, par.material);

	//если поворотная стойка, тогда ее надо повернуть
	if (par.holeYTurnRack) {
		rack.rotation.y += Math.PI / 2 * turnFactor;
		rack.position.z += profSize / 2;
		rack.position.x -= profSize / 2 * turnFactor;
	}
	var rackBot = rack;
	par.mesh.add(rack);

	//части комбинированной балясины
	if (rackModel == "40х40 нерж+дуб") {

		//вставка

		var p1 = newPoint_xy(p0, -profSize / 2, -90 + botLen);
		var p2 = newPoint_xy(p1, 0, timberPartLen)
		var p3 = newPoint_xy(p2, profSize, 0)
		var p4 = newPoint_xy(p1, profSize, 0)

		var shape = new THREE.Shape();

		addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint, par.layer);
		addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint, par.layer);
		addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint, par.layer);
		addLine(shape, par.dxfArr, p4, p1, par.dxfBasePoint, par.layer);

		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.rotateUV(Math.PI / 2);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var rack = new THREE.Mesh(geom, params.materials.timber);
		par.mesh.add(rack);

		//верх

		var p1 = newPoint_xy(p0, -profSize / 2, -90 + botLen + timberPartLen);
		var p2 = newPoint_xy(p1, 0, topLen)
		var p3 = newPoint_xy(p2, profSize, 0)
		var p4 = newPoint_xy(p1, profSize, 0)

		var shape = new THREE.Shape();

		addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint, par.layer);
		addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint, par.layer);
		addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint, par.layer);
		addLine(shape, par.dxfArr, p4, p1, par.dxfBasePoint, par.layer);

		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var rack = new THREE.Mesh(geom, par.material);
		var rackTop = rack;
		par.mesh.add(rack);

	}

	//кронштейн поручня

	//приблизительная отрисовка кронштейна
	if (!par.realHolder) {
		var holderRad = 6;
		var segmentsX = 20;
		var segmentsY = 0;
		var openEnded = false;


		var geom = new THREE.CylinderGeometry(holderRad, holderRad, par.holderLength, segmentsX, segmentsY, openEnded);
		var handrailHolder = new THREE.Mesh(geom, params.materials.inox);
		handrailHolder.position.y = (len + par.holderLength / 2) - 90;
		handrailHolder.position.z = profSize / 2;

		par.mesh.add(handrailHolder);
	}
	//точная отрисовка кронштейна
	if (par.realHolder) {
		var holderParams = {
			angTop: par.holderAng,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, len - 90),
			isForge: false,
		}
		var holder = drawHandrailHolder(holderParams).mesh;
		holder.position.x = 0;
		holder.position.y = len - 90;
		holder.position.z = 20;

		par.mesh.add(holder)
	}

	//болты

	if (typeof anglesHasBolts != "undefined" && anglesHasBolts && par.showPins) { //anglesHasBolts - глобальная переменная
		var bolts = new THREE.Object3D();
		var boltPar = {
			diam: boltDiam,
			len: 30,
			headType: "потай",
			noNut: true,
		}
		if (params.model == "ко") boltPar.headType = "шестигр.";

		var bolt = drawBolt(boltPar).mesh;
		if (params.model == "лт") {
			bolt.rotation.x = Math.PI / 2;
			bolt.position.x = 0;
			bolt.position.y = 0;
			bolt.position.z = 2 + 5
			if (testingMode) bolt.position.z += 1 

			if (par.railingSide == "left") {
				bolt.rotation.x = -Math.PI / 2;
				bolt.position.z = profSize - 2 - 5
				if (testingMode) bolt.position.z -= 1
			}
		}

		if (params.model == "ко") {
			bolt.rotation.x = -Math.PI / 2;
			bolt.position.x = 0;
			bolt.position.y = 0;
			bolt.position.z = 2 + 4//boltLen / 2 + boltBulge - 4;

			if (par.railingSide == "left") {
				bolt.rotation.x = Math.PI / 2;
				bolt.position.z = profSize - 2 - 4// - boltLen / 2 - boltBulge + 4;
			}
		}
		bolts.add(bolt)


		var bolt2 = drawBolt(boltPar).mesh;
		bolt2.rotation.x = bolt.rotation.x;
		bolt2.position.x = 0;
		bolt2.position.y = -holeDist;
		bolt2.position.z = bolt.position.z;
		bolts.add(bolt2)

		//на поворотной стойке для лт добавляем дополнительный болт крепления и поворачиваем болты
		if (par.holeYTurnRack) {
			boltPar.diam = 6;
			boltPar.len = 20;
			boltPar.headType = "пол. гол. крест";
			boltPar.noNut = false;

			var bolt2 = drawBolt(boltPar).mesh;
			boltPar.noNut = true;
			bolt2.rotation.x = Math.PI / 2;
			bolt2.rotation.z = -Math.PI / 2;
			bolt2.position.x += profSize / 2;
			bolt2.position.z += profSize / 2;
			bolt2.position.y = turnRackCenter.y;
			if(!testingMode) bolts.add(bolt2);

			bolts.rotation.y += Math.PI / 2 * turnFactor;
			bolts.position.z += profSize / 2;
			bolts.position.x -= profSize / 2 * turnFactor;
		}

		par.mesh.add(bolts)
	}

	//кронштейн из пластин для КО
	if (params.model == "ко" && params.rackBottom == "боковое" && !par.isBotFlan) {
		var holderPar = {
			railingSide: par.railingSide,
			dxfBasePoint: par.dxfBasePoint,
			material: par.material
		}
		var holder = drawRackHolder(holderPar).mesh;
		holder.position.y = -70;
		if (par.railingSide == "right") holder.position.z = 40;
		//на поворотной стойке поворачиваем кронштейн
		if (par.isTurnRack) {
			var factor = params.turnSide == 'левое' ? 1 : -1;
			holder.rotation.y += Math.PI / 2 * turnFactor;
			holder.position.z += profSize / 2 * factor;
			holder.position.x += profSize / 2;
		}
		par.mesh.add(holder);
	}

	//нижний фланец
	if (par.isBotFlan) {
		var flanParams = {
			material: par.material,
			dxfArr: [], //мусорный массив
			dxfBasePoint: { x: 1000, y: -1000, },
			size: 76,
			holeDst: 55,
		}
		if (par.unit == 'balustrade') flanParams.unit = 'balustrade';

		flanParams = drawPlatformRailingFlan(flanParams)
		var botFlan = flanParams.mesh;
		botFlan.position.z = 20;
		botFlan.position.y = -90;
		par.mesh.add(botFlan);
	}

	if((rackModel == "40х40 нерж+дуб" || rackModel == "40х40 нерж.") && !testingMode){
		var topPlug = drawRackPlug(par.material)
		topPlug.position.z += 20;
		topPlug.position.y = len - 90 + 1;
		par.mesh.add(topPlug);
	}

	//сохраняем данные для спецификации

	var partName = "racks";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Стойка бок. L =",
				metalPaint: false,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "Ограждения",
			}
			if (par.isBotFlan) specObj[partName].name = "Стойка фланц. L =";
			if (rackModel == "40х40 черн.") specObj[partName].metalPaint = true;
			if (rackModel == "40х40 нерж+дуб") {
				specObj[partName].timberPaint = true;
				specObj[partName].division = "timber";
				specObj[partName].group = "timberBal";
			}
		}
		var name = Math.round(par.len);
		if (rackModel == "40х40 черн.") name += " черн.";
		if (rackModel == "40х40 нерж.") name += " нерж.";
		if (rackModel == "40х40 нерж+дуб") name += " комб.";
		if (par.holderAng == 0) name += " штырь прямой"
		else name += " штырь с шарниром";

		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;

	}
	par.mesh.specId = partName + name;

	//окончания комбинированных стоек

	if (rackModel == "40х40 нерж+дуб") {
		//верх стойки
		var partName = "combRackTop";
		if (typeof specObj != 'undefined') {
			if (!specObj[partName]) {
				specObj[partName] = {
					types: {},
					amt: 0,
					name: "Верх комб. стойки ",
					metalPaint: false,
					timberPaint: false,
					division: "metal",
					workUnitName: "amt", //единица измерения
					group: "Ограждения",
				};
			}

			var name = "L=" + topLen;
			if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
			if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
			specObj[partName]["amt"] += 1;
		}
		if(rackTop) rackTop.specId = partName + name;

		//низ стойки
		var partName = "combRackBot";
		if (typeof specObj != 'undefined') {
			if (!specObj[partName]) {
				specObj[partName] = {
					types: {},
					amt: 0,
					name: "Низ комб. стойки",
					metalPaint: false,
					timberPaint: false,
					division: "metal",
					workUnitName: "amt", //единица измерения
					group: "Ограждения",
				};
			}

			var name = 0;
			if (par.isBotFlan) name = "фланц. "
			name += "L=" + Math.round(par.len - topLen - timberPartLen);

			if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
			if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
			specObj[partName]["amt"] += 1;
		}
		if(rackBot) rackBot.specId = partName + name;

	}


	//сохраняем данные для ведомости заготовок

	if(!par.sectText) par.sectText = "";

	if (typeof poleList != 'undefined') {
		var poleType = profSize + "х" + profSize;
		if (rackModel == "40х40 черн.") poleType += " черн.";
		if (rackModel == "40х40 нерж.") poleType += " нерж.";
		if (rackModel == "40х40 нерж+дуб") poleType += " нерж.";

		//формируем массив, если такого еще не было
		if (!poleList[poleType]) poleList[poleType] = [];
		var polePar = {
			len1: botLen,
			len2: botLen,
			len3: botLen,
			angStart: 0,
			angEnd: 0,
			cutOffsetStart: 0,
			cutOffsetEnd: 0,
			poleProfileY: profSize,
			poleProfileZ: profSize,
		}

		polePar.text = "стойки";
		if (rackModel == "40х40 нерж+дуб") polePar.text += "(низ)"
		if(par.sectText) polePar.text += " " + par.sectText;
		polePar.description = [];
		polePar.description.push(polePar.text);
		polePar.amt = 1;
		polePar.material = par.material.name;
		poleList[poleType].push(polePar);

		//верх комбинированной стойки
		if (rackModel == "40х40 нерж+дуб") {
			var polePar = {
				len1: topLen,
				len2: topLen,
				len3: topLen,
				angStart: 0,
				angEnd: 0,
				cutOffsetStart: 0,
				cutOffsetEnd: 0,
				poleProfileY: profSize,
				poleProfileZ: profSize,
			}

			polePar.text = par.sectText + " стойки(верх)";
			polePar.description = [];
			polePar.description.push(polePar.text);
			polePar.amt = 1;

			poleList[poleType].push(polePar);
		}

	}

	return par;
}//end of drawRack3d_4

/**
 * Отрисовывает закладную стойки
 */
function drawRackFlan(profSize){
	if (menu.simpleMode) return new THREE.Object3D();
	var geometry = new THREE.BoxGeometry( profSize / 2, 80, 2 );
	var flan = new THREE.Mesh( geometry, params.materials.metal );

	var partName = "banisterInnerFlange";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Закладная стойки",
				metalPaint: true,
				timberPaint: false,
				isModelData: true,
				division: "stock2",
				workUnitName: "amt",
				group: "Ограждения",
				purposes: ["Закладная стойки ограждения"]
			}
			if (params.calcType == "mono") specObj[partName].purposes = ["Закладная под фланец L-образной стойки ограждения"]
		}

		var name = 0;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}

	flan.specId = partName;
	flan.setLayer("metis");
	return flan;
}

/**
 * Отрисовывает пластиковую заглушку
 * @param {object} par
 *- par.width - ширина
 *- par.height - высота
 *- par.thk - толщина (не обязательно, по умолчанию 2)
 *- par.id - ид спецификации
 *- par.description - описание
 *- par.group - группа спецификации
 *- par.isCirclePlug - круглая заглушка
 *- par.type - тип заглушки: plastic || inox || timber
 */
function drawPlug(par){
	if(menu.simpleMode) return new THREE.Object3D();

	par.material = params.materials.metal;
	if(par.type == "inox") par.material = params.materials.inox;
	if(par.type == "timber") par.material = params.materials.handrail;

	if (par.isCirclePlug) {
		var geometry = new THREE.CylinderGeometry(par.width / 2, par.height / 2, par.thk || 2, 32);
		if(par.type == "timber"){
			var maxDiam = par.width + 9;
			if(par.width == 10) maxDiam = 14;
			if(par.width == 12) maxDiam = 16;

			var geometry = new THREE.CylinderGeometry( maxDiam/2, maxDiam/2, 2, 32 );
		}
	}
	else{
		var geometry = new THREE.BoxGeometry( par.width, par.thk || 2, par.height );
	}
	var plug = new THREE.Mesh(geometry, par.material);

	//сохраняем данные для спецификации

	var plugColor = "ЧЕРНАЯ";
	if(params.metalPaint == "порошок"){
		if(params.carcasColor == "белый") plugColor = "БЕЛАЯ";
	}
	if (par.width == 50 && par.height == 100) plugColor = "ЧЕРНАЯ";
	
	var sizeA = par.height;
	var sizeB = par.width;
	if(sizeB > sizeA) {
		sizeB = par.height;
		sizeA = par.width;
	}
	var partName = "plug"
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Заглушка",
				metalPaint: false,
				timberPaint: false,
				isModelData: true,
				division: "stock_1",
				workUnitName: "amt",
				group: "Ограждения",
				purposes: []
			}
			if (par.group) specObj[partName].group = par.group;
		}
		if (par.description) {
			if (specObj[partName].purposes.indexOf(par.description) == -1) specObj[partName].purposes.push(par.description);
		}

		var name =  "пласт. "+ sizeA + "х" + sizeB + " " + plugColor;
		if(par.type == "inox"){
			name = "нерж. "+ sizeB + "х" + sizeA;
			if(par.isCirclePlug) name = "нерж. Ф" + sizeB;
		}
		if(par.type == "timber"){
			name = "дер. грибок для отв.Ф" + sizeB + " " + getTimberPlugType(params.handrailsMaterial);
		}
		if (par.type == "ПВХ") {
			name = "внешняя для поручня ПВХ";
		}

		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}

	plug.specId = partName + name;
	plug.setLayer("plugs");

	return plug;
}


/**
 * Отрисовывает заглушку с переданным диаметром
 * @param {number} plugDiam - диаметр заглушки
 */
function drawTimberPlug(plugDiam){
	if(menu.simpleMode) return new THREE.Object3D();
	var par = {
		width: plugDiam,
		description: "Заглушка деревянная",
		group: "handrails",
		isCirclePlug: true,
		type: "timber",
	}
	par.material = params.materials.handrail;


	var maxDiam = par.width + 9;
	if(par.width == 10) maxDiam = 14;
	if(par.width == 12) maxDiam = 16;

	var geometry = new THREE.CylinderGeometry( maxDiam/2, maxDiam/2, 2, 32 );



	var plug = new THREE.Mesh(geometry, par.material);

	//сохраняем данные для спецификации

	var partName = "timberPlug"
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Заглушка",
				metalPaint: false,
				timberPaint: true,
				division: "stock_1",
				workUnitName: "amt",
				group: "Ограждения",
				purposes: []
			}
			if (par.group) specObj[partName].group = par.group;

		}
		if (par.description) {
			if (specObj[partName].purposes.indexOf(par.description) == -1) specObj[partName].purposes.push(par.description);
		}

		name = "дер. грибок для отв.Ф" + par.width + " " + getTimberPlugType(params.handrailsMaterial);


		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}

	plug.specId = partName + name;
	plug.setLayer('plugs');
	return plug;
}


/**
 * Функция отрисовывает ригеледержатель
 * @param {object} par
 *- par.id - ид спецификации
 *- par.description - описание
 *- par.group - группа спецификации
 *- par.size - размер для отрисовки
*/

function drawRigelHolder(par) {
	if (menu.simpleMode) return new THREE.Object3D();
	var size = par.size + 5;
	var geometry = new THREE.CylinderGeometry(size / 2, size / 2, 25, 32);
	var holder = new THREE.Mesh( geometry, params.materials.inox );

	var partName = par.id;

	//Формируем список со всей фурнитурой, чтобы достать от туда имя
	var partsList = {};
	addGeneralItems(partsList);

	var name = null;
	if(partsList[par.id]) name = partsList[par.id].name;
	if (!name) name = "Ригеледержатель Ф" + par.size;

	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: name,
				metalPaint: true,
				timberPaint: false,
				isModelData: true,
				division: "stock2",
				workUnitName: "amt",
				group: "Ограждения",
				purposes: []
			}
			if (par.group) specObj[partName].group = par.group;
		}
		if (par.description) {
			if (specObj[partName].purposes.indexOf(par.description) == -1) specObj[partName].purposes.push(par.description);
		}

		var name = 0;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}

	holder.specId = partName;
	holder.setLayer("metis");

	return holder;
}

/**
 * Отрисовывает заглушку для нержавеющих стоек
 * @param {*} material
 */
function drawRackPlug(material){
	if (menu.simpleMode) return new THREE.Object3D();
	var geometry = new THREE.BoxGeometry( 40, 2, 40 );
	var mesh = new THREE.Mesh( geometry, material );

	var partName = "handrailHolderBase";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Крепление поручня к стойкам",
				metalPaint: true,
				timberPaint: false,
				isModelData: true,
				division: "stock_1",
				workUnitName: "amt",
				group: "Ограждения",
			}
		}

		var name = 0;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}
	mesh.specId = partName;
	mesh.setLayer("metis");

	return mesh;
}

/** функция отрисовывает боковой кронштейн стойки для крепления к каркасу на КО
*/

function drawRackHolder(par) {
	var mesh = new THREE.Object3D();
	var profSize = 40;
	var holderWidth = 80;
	var plateThk = 4;
	var holeOffset = 10;
	var sidePlateLen = params.sideOverHang + profSize / 2;

	var platePoints = [];

	var p1 = { x: 0, y: 0 };
	var p2 = { x: sidePlateLen, y: 0 };
	var p3 = { x: sidePlateLen, y: holderWidth };
	var p4 = { x: 0, y: holderWidth };

	p3.filletRad = p2.filletRad = 10;

	platePoints.push(p1, p2, p3, p4)

	//создаем шейп
	var shapePar = {
		points: platePoints,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint
		//markPoints: true,
	}

	var plateShape = drawShapeByPoints2(shapePar).shape;

	var plateHole = {
		center: {
			x: sidePlateLen / 2,
			y: holderWidth / 2,
		},
		rad: 20,
	}

	if (params.sideOverHang > 50){
		addRoundHole(plateShape, dxfPrimitivesArr, plateHole.center, plateHole.rad, par.dxfBasePoint)
	}

	var extrudeOptions = {
		amount: plateThk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(plateShape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var plate = new THREE.Mesh(geom, params.materials.metal_railing);

	plate.rotation.y = -Math.PI / 2;
	plate.position.x = - profSize / 2;
	plate.position.z = plateThk - sidePlateLen;
	mesh.add(plate);

	// platePar.dxfArr = []; //не выгружаем второй фланец в dxf

	plate = new THREE.Mesh(geom, params.materials.metal_railing);
	plate.rotation.y = -Math.PI / 2;
	plate.position.x = profSize / 2 + plateThk;
	plate.position.z = plateThk - sidePlateLen;
	mesh.add(plate);

	var flanPar = {
		height: holderWidth,
		width: profSize,
		thk: 4,
		holeRad: 6.5,
		roundHoleCenters: [],
		noBolts: true,
		material: params.materials.metal_railing,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, sidePlateLen + 50, 0),
	}

	var hole1 = {
		x: flanPar.width / 2,
		y: holeOffset
	}
	var hole2 = {
		x: flanPar.width / 2,
		y: flanPar.height - holeOffset
	}

	flanPar.roundHoleCenters.push(hole1, hole2);
	var flan = drawRectFlan2(flanPar).mesh;
	flan.position.x = -flanPar.width / 2;
	flan.position.z = -(20 + flanPar.thk);
	mesh.add(flan);

	// часть прилегающая к стойке
	flanPar.dxfBasePoint.x += flanPar.width;
	flanPar.width = profSize + 20;
	hole1 = {
		x: flanPar.width / 2,
		y: holeOffset
	}

	hole2 = {
		x: flanPar.width / 2,
		y: flanPar.height - holeOffset
	}
	flanPar.roundHoleCenters = [];
	flanPar.roundHoleCenters.push(hole1, hole2);
	flan = drawRectFlan2(flanPar).mesh;
	flan.position.x = -flanPar.width / 2;
	flan.position.z = -(sidePlateLen);
	mesh.add(flan);

	mesh.position.z = -20;
	if (par.railingSide == "left") {
		mesh.rotation.y = Math.PI;
		mesh.position.z = 20;
	};
	if (typeof anglesHasBolts != "undefined" && anglesHasBolts) { //глобальная переменная
		var boltPar = {
			diam: boltDiam,
			len: boltLen,
		}
		var bolt = drawBolt(boltPar).mesh;
		bolt.rotation.x = Math.PI / 2;
		bolt.position.x = 0;
		bolt.position.y = holderWidth - 10;
		bolt.position.z = -sidePlateLen + boltBulge - 1;
		mesh.add(bolt);

		var bolt2 = drawBolt(boltPar).mesh;
		bolt2.rotation.x = Math.PI / 2;
		bolt2.position.y = 10;
		bolt2.position.z = bolt.position.z;
		mesh.add(bolt2);
	}
	var finalObject = new THREE.Object3D();
	finalObject.add(mesh);
	delete mesh;
	par.mesh = finalObject;

	//сохраняем данные для спецификации
	var partName = "sideRackHolder";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Кронштейн стойки",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "Ограждения",
			}
		}

		var name = "L=" + params.sideOverHang;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}
	par.mesh.specId = partName + name;
	par.mesh.setLayer("metis");

	return par;
}

function drawPole3D_4(par) {
	/*
	var pole3DParams = {
		type: "rect", //не обязательный
		poleProfileY: 40,
		poleProfileZ: 60,
		dxfBasePoint:  //не обязательный. Если не указан, в dxf не выводится
		length: 1000,
		poleAngle: 0,
		angStart //не обязательный
		angEnd //не обязательный
		material: railingMaterial, //не обязательный
		dxfArr: dxfPrimitivesArr, //не обязательный
		partName
		text
		sectText
		roundHoles: [],
		unit: "banister",
		fixPoints: крепления для деревяшек
		timberTopFix:{boltIds:[]} массив с ид цилиндров(по часовой с 1 до 4, начиная с нижнего левого угла, 5 центральный) сверху которые символизируют отверстия
		newellName: имя столба для вывода в svg
		}
		*/
	//Необязательные параметры
	if (!par.type) par.type = "rect";
	if (!par.poleAngle) par.poleAngle = 0;
	if (!par.angStart) par.angStart = 0;
	if (!par.angEnd) par.angEnd = 0;
	if (!par.dxfArr) par.dxfArr = dxfPrimitivesArr;
	if (!par.dxfBasePoint) {
		par.dxfBasePoint = { x: 0, y: 0 },
			par.dxfArr = [];
	}
	if (!par.material) par.material = params.materials.metal;

	if (!par.layer) par.layer = "parts";
	if (!par.roundHoles) par.roundHoles = [];

	par.mesh = new THREE.Object3D();

	var pole3DExtrudeOptions = {
		amount: par.poleProfileZ,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};


	//рассчитываем абсолютные углы
	var angStart = par.poleAngle + Math.PI / 2 - par.angStart;
	var angEnd = par.poleAngle + Math.PI / 2 - par.angEnd;
	var startCutLen = par.poleProfileY / Math.sin(angStart - par.poleAngle)
	var endCutLen = par.poleProfileY / Math.sin(angEnd - par.poleAngle)

	var p0 = { x: 0, y: 0 };
	var p1 = polar(p0, angStart, startCutLen);
	var p2 = polar(p1, par.poleAngle, par.length);
	//var p3 = polar(p0, par.poleAngle, par.length);
	var p3 = polar(p2, angEnd, -endCutLen);


	var shape = new THREE.Shape();
	addLine(shape, par.dxfArr, p0, p1, par.dxfBasePoint, par.layer);
	addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint, par.layer);
	addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint, par.layer);
	addLine(shape, par.dxfArr, p3, p0, par.dxfBasePoint, par.layer);

	//круглые отверстия
	for (var i = 0; i < par.roundHoles.length; i++) {
		addRoundHole(shape, par.dxfArr, par.roundHoles[i], par.roundHoles[i].diam / 2, par.dxfBasePoint);
		}

    /*прямоугольная палка*/
    if (par.type != "round") {
        var poleGeometry = new THREE.ExtrudeGeometry(shape, pole3DExtrudeOptions);
		poleGeometry.rotateUV(par.poleAngle * -1);
        poleGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
				var pole = new THREE.Mesh(poleGeometry, par.material);
				pole.userData.angle = par.poleAngle;

				if (par.drawing && par.drawing.group == 'timber_railing') {
					shape.drawing = par.drawing;
					if(shapesList) shapesList.push(shape);
				}
		}
    /*круглая палка*/
    if (par.type == "round") {
        var poleRadius = par.poleProfileY / 2;
        var radiusTop = poleRadius;
        var radiusBottom = poleRadius;
        var height = par.length;
        var segmentsX = 20;
        var segmentsY = 0;
        var openEnded = false;
        var poleGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segmentsX, segmentsY, openEnded);
				var pole = new THREE.Mesh(poleGeometry, par.material);
				pole.userData.angle = par.poleAngle;
        pole.rotation.z = par.poleAngle - Math.PI / 2;
		pole.position.x = (par.length / 2 * Math.cos(par.poleAngle) - par.poleProfileY / 2 * Math.sin(par.poleAngle));
		pole.position.y = (par.length / 2 * Math.sin(par.poleAngle) + par.poleProfileY / 2 * Math.cos(par.poleAngle));
		pole.position.z = poleRadius;
	}

	//добавляем подпись в dxf файл
	if (par.text) {
		var textHeight = 30;
		var textBasePoint = newPoint_xy(par.dxfBasePoint, 40, -200);
		addText(par.text, textHeight, par.dxfArr, textBasePoint);
	}

	if (par.boxId != undefined) pole.boxId = par.boxId;
	par.mesh.add(pole);

	// if (par.drawing) shape.drawing = par.drawing;
	if (par.fixPoints && menu.newell_fixings) {
		if (par.fixPoints.length > 0) {
			for (var i = 0; i < par.fixPoints.length; i++) {
				var point = par.fixPoints[i];

				var basePoint = { x: 0, y: point.y, z: point.x };
				if (point.side == 1) {
					basePoint.x -= par.poleProfileY;
				}
				if (point.side == 3) {
					basePoint.z = par.poleProfileY - point.x;
				}
				if (point.side == 2) {
					basePoint.x = point.x * -1;
					basePoint.y = point.y;
					basePoint.z = 0;
					basePoint.rot = Math.PI / 2;
				}
				if (point.side == 4) {
					basePoint.x = point.x - par.poleProfileY;
					basePoint.y = point.y;
					basePoint.z = par.poleProfileY;
					basePoint.rot = Math.PI / 2;
				}
				if (point.type == 'stringerFixing') {
					var holeElements = drawStringerHoleElements(basePoint);
					par.mesh.add(holeElements);
				}
				if (point.type == 'wndFixing') {
					var material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
					var geometry = new THREE.CylinderGeometry(20, 20, 40, 32);
					var cylinder = new THREE.Mesh(geometry, material);
					cylinder.position.x = basePoint.x || 0;
					cylinder.position.y = basePoint.y || 0;
					cylinder.position.z = basePoint.z || 0;
					cylinder.rotation.z += Math.PI / 2;
					cylinder.rotation.y += basePoint.rot || 0;
					par.mesh.add(cylinder);
				}
			}
			shape.drawing = { group: 'timberStockNewell', name: par.newellName, fixPoints: par.fixPoints, rackSize: par.poleProfileY };
			if (shapesList) shapesList.push(shape);
		}
	}
	if (par.timberTopFix && menu.newell_fixings) {
		var bolts = par.timberTopFix.boltIds;
		var basePoint = { x: -24, y: par.length + 25, z: 24 };
		var material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });

		var holesOffset = params.rackSize - 24 * 2;

		var nagelPar = {
			id: "nagel",
			description: "Крепление ступеней к косоурам",
			group: "Каркас"
		}

		if (bolts.includes(1)) {
			var nagel = drawNagel(nagelPar);
			nagel.position.x = basePoint.x - holesOffset;
			nagel.position.y = basePoint.y - 20.5;
			nagel.position.z = basePoint.z;
			par.mesh.add(nagel);

			var nagel = drawNagel(nagelPar);
			nagel.position.x = basePoint.x - holesOffset;
			nagel.position.y = basePoint.y + 20.5;
			nagel.position.z = basePoint.z;
			par.mesh.add(nagel);
		}

		if (bolts.includes(2)) {
			var nagel = drawNagel(nagelPar);
			nagel.position.x = basePoint.x;
			nagel.position.y = basePoint.y - 20.5;
			nagel.position.z = basePoint.z;
			par.mesh.add(nagel);

			var nagel = drawNagel(nagelPar);
			nagel.position.x = basePoint.x;
			nagel.position.y = basePoint.y + 20.5;
			nagel.position.z = basePoint.z;
			par.mesh.add(nagel);
		}

		if (bolts.includes(3)) {
			var nagel = drawNagel(nagelPar);
			nagel.position.x = basePoint.x;
			nagel.position.y = basePoint.y - 20.5;
			nagel.position.z = basePoint.z + holesOffset;
			par.mesh.add(nagel);

			var nagel = drawNagel(nagelPar);
			nagel.position.x = basePoint.x;
			nagel.position.y = basePoint.y + 20.5;
			nagel.position.z = basePoint.z + holesOffset;
			par.mesh.add(nagel);
		}

		if (bolts.includes(4)) {
			var nagel = drawNagel(nagelPar);
			nagel.position.x = basePoint.x - holesOffset;
			nagel.position.y = basePoint.y - 20.5;
			nagel.position.z = basePoint.z + holesOffset;
			par.mesh.add(nagel);

			var nagel = drawNagel(nagelPar);
			nagel.position.x = basePoint.x - holesOffset;
			nagel.position.y = basePoint.y + 20.5;
			nagel.position.z = basePoint.z + holesOffset;
			par.mesh.add(nagel);
		}

		if (bolts.includes(5)) {
			// var geometry = new THREE.CylinderGeometry(7, 7, 50, 32);
			// var cylinder = new THREE.Mesh(geometry, material);
			// cylinder.position.x = basePoint.x - holesOffset / 2;
			// cylinder.position.y = basePoint.y;
			// cylinder.position.z = basePoint.z + holesOffset / 2;
			// par.mesh.add(cylinder);
		}
	}


	if (par.topType) {
		var rackSize = params.rackSize;
		if (!rackSize) rackSize = 95;
		var maxSize = rackSize;
		//верхняя крышка
		if (par.topType != "пирамидка" && par.topType != "плоское") {
			var capSize = maxSize + 15;
			var capThk = 20;
			var platePar = {
				len: capSize,
				width: capSize,
				thk: capThk,
				dxfArr: par.dxfArr,
				dxfBasePoint: newPoint_xy(par.dxfBasePoint, -(capSize - maxSize) / 2, 200),
				text: "",
				material: params.materials.newell,
			}
			var cap = drawPlate(platePar).mesh;
			cap.rotation.x = Math.PI / 2;
			cap.position.x = -maxSize / 2 - capSize / 2;
			cap.position.y = par.length + capThk;
			cap.position.z = maxSize / 2 - capSize / 2;
			par.mesh.add(cap);
		}
		//шар
		if (par.topType == "шар" && !testingMode) {
			var ballPar = {
				dxfArr: par.dxfArr,
				dxfBasePoint: newPoint_xy(par.dxfBasePoint, maxSize / 2, 400),
				material: params.materials.newell,
			}
			var ball = drawLatheBall(ballPar).mesh;
			ball.position.y = par.length + capThk;
			ball.position.x = -maxSize / 2;
			ball.position.z = maxSize / 2;
			par.mesh.add(ball);
		}
		
		//пирамида
		if (par.topType == "пирамидка") {
			var geometry = new THREE.CylinderGeometry( 1, maxSize, maxSize, 4 );
			var cap = new THREE.Mesh( geometry, params.materials.newell );
			
			cap.position.x = -maxSize / 2 - capSize / 2;
			cap.position.y = par.length + capThk;
			cap.position.z = maxSize / 2 - capSize / 2;
			par.mesh.add(cap);
		}

	}


	//сохраняем данные для спецификации
	//параметры поручня
	var handrailPar = {
		prof: params.handrailProf,
		sideSlots: params.handrailSlots,
		handrailType: params.handrail,
		metalPaint: params.metalPaint_railing,
		timberPaint: params.timberPaint_perila,
		handrailColor: params.handrailColor,
	}
	if (par.unit == "banister") {
		var handrailPar = {
			prof: params.handrailProf_bal,
			sideSlots: params.handrailSlots_bal,
			handrailType: params.handrail_bal,
			metalPaint: params.metalPaint_bal,
			timberPaint: params.timberPaint_bal,
			handrailColor: params.handrailColor_bal,
		}
	}
	handrailPar = calcHandrailMeterParams(handrailPar); //функция в файле priceLib.js

	//Заглушки ригелей
	if (par.partName == "rigels") {
		var rigelPlugId = "plasticPlug_20_20";
		var plugSize = 20;
		if(par.type == "round" && par.poleProfileY == 12) {
			rigelPlugId = "stainlessPlug_12";
			plugSize = 12;
		}
		if(par.type == "round" && par.poleProfileY == 16) {
			rigelPlugId = "stainlessPlug_16";
			plugSize = 16;
		}
		var plugParams = {
			id: rigelPlugId,
			width: plugSize,
			height: plugSize,
			description: "Заглушка ригеля",
			group: "Ограждения"
		}
		if (rigelPlugId !== "plasticPlug_20_20") {
			plugParams.isCirclePlug = true;
			plugParams.type = "inox";
		}
		var zOffset = plugParams.width / 2;

		if (par.rigelStartPlug) {
			var plugBasePoint = p1;
			plugBasePoint = polar(plugBasePoint, par.poleAngle + Math.PI / 2, -plugParams.height / 2);
			var startPlug = drawPlug(plugParams);
			startPlug.position.x = plugBasePoint.x;
			startPlug.position.y = plugBasePoint.y;
			startPlug.position.z = zOffset;
			startPlug.rotation.z = par.poleAngle + Math.PI / 2;
			if(!testingMode) par.mesh.add(startPlug);
		}

		if (par.rigelEndPlug) {
			var plugBasePoint = p2;
			plugBasePoint = polar(plugBasePoint, par.poleAngle + Math.PI / 2, -plugParams.height / 2);
			var endPlug = drawPlug(plugParams);
			endPlug.position.x = plugBasePoint.x;
			endPlug.position.y = plugBasePoint.y;
			endPlug.position.z = zOffset;
			endPlug.rotation.z = par.poleAngle + Math.PI / 2;
			if(!testingMode) par.mesh.add(endPlug);
		}
	}

	var partName = par.partName;
	if (typeof specObj != 'undefined' && partName && partName != "frameProf" && partName != "stringerPart") {
		if (!specObj[partName]) {
			par.handrailPar = handrailPar;
			specObj[partName] = getPoleSpecParams(par);
		}
		var name = Math.round(par.poleProfileZ) + "x" + Math.round(par.poleProfileY) + "х" + Math.round(par.length);
		if (par.type == "round") name = "Ф" + Math.round(par.poleProfileY) + "х" + Math.round(par.length);

		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["sumLength"] += Math.round(par.length) / 1000;
		specObj[partName]["paintedArea"] += (par.poleProfileZ + par.poleProfileY) * 2 * par.length / 1000000;
		
		par.mesh.specParams = {specObj: specObj, amt: 1, sumLength: Math.round(par.length) / 1000, partName: partName, name: name}
		if (partName == 'polySheet') {
			var polyArea = Math.ceil((par.length / 1000)) * Math.ceil((par.poleProfileZ / 2100));
			specObj[partName]["area"] += polyArea;
			par.mesh.specParams.area = polyArea;
			par.mesh.specParams.sumLength = null;
		}

		par.mesh.specId = partName + name;
	}


	//сохраняем данные для ведомости деталей
	var addToPoleList = false;
	var partName = par.partName;
	if (partName == "handrails" ||
		partName == "rigels" ||
		partName == "frameProf" ||
		partName == "column" ||
		partName == "stringerPart" ||
		partName == "crossProfile" ||
		partName == "timberPole") addToPoleList = true;

	if (typeof poleList != 'undefined' && addToPoleList) {
		var poleType = par.poleProfileY + "х" + par.poleProfileZ;
		if (par.type == "round") poleType = "Ф" + par.poleProfileY;
		if (partName == "handrails") {
			if (par.handrailMatType == "metal") poleType += " черн.";
			if (par.handrailMatType == "inox") poleType += " нерж.";
			if (par.handrailMatType == "timber") poleType += " " + params.handrail;
		}
		if (partName == "rigels") {
			if (params.rigelMaterial == "20х20 черн.") poleType += " черн.";
			if (params.rigelMaterial == "Ф12 нерж.") poleType += " нерж.";
		}
		if (partName == "frameProf" || partName == "stringerPart" || partName == "column") {
			poleType += " черн.";
		}



		//формируем массив, если такого еще не было
		if (!poleList[poleType]) poleList[poleType] = [];
		var polePar = {
			len1: Math.round(par.length),
			len2: Math.round(par.length),
			len3: Math.round(par.length),
			// angStart: par.angStart,
			// angEnd: par.angEnd,
			angStart: (par.angStart * 180 / Math.PI).toFixed(1),
			angEnd: (par.angEnd * 180 / Math.PI).toFixed(1),
			cutOffsetStart: 0,
			cutOffsetEnd: 0,
			poleProfileY: par.poleProfileY,
			poleProfileZ: par.poleProfileY,
		}


		if (partName == "handrails") polePar.text = par.sectText + " поручни"
		if (partName == "rigels") polePar.text = par.sectText + " ригели";
		if (partName == "glassProfiles") polePar.text = par.sectText + " профиль стекла"
		if (partName == "frameProf") polePar.text = " профили прямых рамок"
		if (partName == "stringerPart") polePar.text = par.sectText + " детали косоура"
		if (partName == "column") polePar.text = " колонны"
		if (partName == "crossProfile") polePar.text = "Профиль креста"
		if (partName == "purlinProf") polePar.text = "Прогон"

		var material = par.handrailMatType;
		if (par.material && !par.handrailMatType) material = par.material.name;
		if (par.partName == "stringerPart") material = 'metal';

		polePar.description = [];
		polePar.description.push(polePar.text);
		polePar.amt = 1;
		polePar.material = material;

		poleList[poleType].push(polePar);
	}

	return par;
} //end of drawPole3D_4

/**
 * На основе partName и параметров формирует объект в спецификацию
 */
function getPoleSpecParams(par){
	var partName = par.partName;
	var handrailPar = par.handrailPar;
	var specObjPart = {
		types: {},
		amt: 0,
		sumLength: 0,
		paintedArea: 0,
		area: 0,
		name: "Поручень " + handrailPar.handrailType,
		metalPaint: false,
		timberPaint: false,
		division: "timber",
		workUnitName: "sumLength",
		group: "Ограждения",
		type_comments: {}
	}
	if (partName == "handrails") {
		specObjPart.metalPaint = (handrailPar.mat == "metal");
		specObjPart.timberPaint = (handrailPar.mat == "timber");
		specObjPart.division = handrailPar.mat;
		if (handrailPar.mat == "inox") specObjPart.division = "metal";
		//цвет поручня пвх
		if (handrailPar.handrailType == "ПВХ") {
			specObjPart.name += " цвет " + handrailPar.handrailColor;
			specObjPart.division = "metal";
			specObjPart.timberPaint = false;
		}
		specObjPart.group = "handrails";
	}
	if (partName == "rigels") {
		specObjPart.name = "Ригель черн.";
		specObjPart.metalPaint = true;
		specObjPart.division = "metal";
		if (par.type == "round") {
			specObjPart.metalPaint = false;
			specObjPart.name = "Ригель нерж.";
		}
	}
	
	if (partName == 'crossProfile') {
		specObjPart.name = 'Профиль крестов';
		specObjPart.division = "metal";
		specObjPart.group = 'carcas';
	}
	
	if (partName == "ladderBal") {
		specObjPart.name = "Стойка ограждения с фланцем";
		specObjPart.metalPaint = true;
		specObjPart.division = "metal";
	}
	if (partName == "glassProfiles") {
		specObjPart.name = "Профиль для стекла";
		specObjPart.division = "metal";
	}
	if (partName == "botPole") {
		specObjPart.name = "Подбалясинная доска";
		specObjPart.timberPaint = true;
		specObjPart.group = "handrails";
	}
	if (partName == "topPole") {
		specObjPart.name = "Рейка в поручень";
		specObjPart.timberPaint = true;
		specObjPart.group = "handrails";
	}
	if (partName == "botCoupeProf") specObjPart.name = "Нижний профиль двери";
	if (partName == "topCoupeProf") specObjPart.name = "Верхний провль двери";
	if (partName == "vertCoupeProf") specObjPart.name = "Вертикальный профиль двери";
	if (partName == "inpostCoupeProf") specObjPart.name = "Разделительный профиль";
	if (partName == "rail") specObjPart.name = "Штанга";
	if (partName == "racksTimberPole" || partName == 'racksMetalPole'){
		if (partName == "racksTimberPole") specObjPart.name = "Рейка ограждения";
		if (partName == "racksMetalPole") specObjPart.name = "Профиль ограждения";
		specObjPart.group = "Ограждения";
	}
	if (partName == "timberPole") {
		specObjPart.name = "Брусок";
		specObjPart.timberPaint = true;
		specObjPart.group = "Каркас";
	}
	if (partName == "shelfCrossProfile") {
		specObjPart.name = "Профиль крестов стелажа";
		specObjPart.timberPaint = false;
		specObjPart.metalPaint = true;
		specObjPart.group = "Каркас";
	}
	if (partName == "shelfLeg") {
		specObjPart.name = "Ножка стелажа";
		specObjPart.timberPaint = false;
		specObjPart.metalPaint = true;
		specObjPart.group = "Каркас";
	}
	if (partName == "shelfBridge") {
		specObjPart.name = "Перемычка стелажа";
		specObjPart.timberPaint = false;
		specObjPart.metalPaint = true;
		specObjPart.group = "Каркас";
	}
	
	if (partName.indexOf("platformBeam") !== -1){
		specObjPart.name = "Балка платформы";
		if (partName == "platformBeam_front") specObjPart.name += ' передняя';
		if (partName == "platformBeam_left") specObjPart.name += ' левая';
		if (partName == "platformBeam_right") specObjPart.name += ' правая';
		if (partName == "platformBeam_rear") specObjPart.name += ' задняя';
		if (partName == "platformBeam_mid") specObjPart.name = 'Перемычка платформы';

		specObjPart.metalPaint = true;
		specObjPart.division = "metal";
		specObjPart.group = "Каркас";
	}

	if (partName == 'carportColumn') {
		specObjPart.name = "Колонна навеса";
		specObjPart.group = 'carcas';
		specObjPart.division = "metal";
		specObjPart.metalPaint = true;
	}
	
	if (partName == 'carportBeamLen') {
		specObjPart.name = "Балка продольная";
		specObjPart.group = 'carcas';
		specObjPart.division = "metal";
		specObjPart.metalPaint = true;
	}
	
	if (partName == 'carportBeam') {
		specObjPart.name = "Балка поперечная";
		specObjPart.group = 'carcas';
		specObjPart.division = "metal";
		specObjPart.metalPaint = true;
	}
	
	if (partName == 'purlinProf') {
		specObjPart.name = 'Прогон';
		specObjPart.division = "metal";
		specObjPart.group = 'carcas';
		specObjPart.metalPaint = true;
	}
	
	if (partName == 'polySheet') {
		specObjPart.name = 'Поликарбонат';
		specObjPart.division = "metal";
	}
	if (partName == 'topRoofProf') {
		specObjPart.name = 'Коньковый профиль';
		specObjPart.division = "metal";
		specObjPart.group = 'carcas';
	}
	
	if (partName == 'polyEdgeProf') {
		specObjPart.name = "Краевой профиль поликарбоната";
		specObjPart.division = "metal";
	}

	if (partName == 'roofRafter') {
		specObjPart.name = 'Стропильная нога';
		specObjPart.division = "metal";
		specObjPart.group = 'carcas';
	}
	if (partName == "tableLeg") {
		specObjPart.name = "Ножка стола";
		specObjPart.division = "metal";
		specObjPart.group = "Каркас";
	}
	if (partName == "benchBridge") {
		specObjPart.name = "Перемычка скамейки";
		specObjPart.division = "metal";
		specObjPart.group = "Каркас";
	}

	


	return specObjPart;
}

/**
 * drawCross2 - Функция для отрисовке крестов по заданным 4 точкам
 * Параметры:
 * p0,p1,p2,p3 - точки от нижнего левого угла по часовой стрелке
 * profileX, profileY - профиль балок крестов
 * material - материал
 * fixDirection - опора стоек( horizontal - на горизонтальную часть, vertical - на вертикальную)
 * dxfBasePoint - базовая точка dxf
 * dxfArr - массив для контуров
 */
function drawCross2(par){
	var cross = new THREE.Object3D();
	var crossPoleParams = {
		type: 'rect',
		poleProfileY: par.profileY,
		poleProfileZ: par.profileX,
		material: par.material,
		dxfBasePoint: par.dxfBasePoint,
		dxfArr: par.dxfArr,
		partName: 'crossProfile'
	}
	
	// Расчет для вертикального крепления
	if (par.fixDirection == 'vertical') {
		var tempPoint = polar(par.p2, angle(par.p0, par.p2) + Math.PI / 2, -par.profileY);
		var p2Modified = itercection(par.p0, tempPoint, par.p3, par.p2);
		var pole1Angle = angle(par.p0, p2Modified);
		var poleLength = distance(par.p0, p2Modified);
	
		crossPoleParams.angStart = crossPoleParams.angEnd = pole1Angle;
		crossPoleParams.length = poleLength;
		var pole = drawPole3D_4(crossPoleParams).mesh;
		pole.rotation.z = pole1Angle;
		cross.add(pole);
		
		var pole2Angle = angle(par.p1, par.p3);
		var tempPoint = polar(par.p1, pole2Angle + Math.PI / 2, -par.profileY);
		var p1Modified = itercection(par.p3, tempPoint, par.p0, par.p1);
	
		var crossIntercection = itercection(par.p0, p2Modified, par.p3, p1Modified);
		var poleStartAngle = angle(par.p3, p1Modified);
		var poleEndAngle = poleStartAngle - pole1Angle - Math.PI / 2;
		
		crossPoleParams.length = distance(crossIntercection, par.p3);
		crossPoleParams.angEnd = poleEndAngle;
		crossPoleParams.angStart = poleStartAngle;
	
		var pole = drawPole3D_4(crossPoleParams).mesh;
		pole.position.x = par.p3.x;
		pole.position.y = par.p3.y + par.profileY / Math.cos(poleStartAngle);
		pole.rotation.z = poleStartAngle + Math.PI;
		cross.add(pole);
	
		crossPoleParams.angStart = poleStartAngle;
		crossPoleParams.angEnd = poleEndAngle;
	
		var pole = drawPole3D_4(crossPoleParams).mesh;
		pole.position.x = p1Modified.x;
		pole.position.y = p1Modified.y;
		pole.rotation.z = poleStartAngle;
		cross.add(pole);
	}
	if (par.fixDirection == 'horizontal') {
		var sectionAngle = angle(par.p0, par.p3);
		var tempPoint = polar(par.p0, angle(par.p0, par.p2) + Math.PI / 2, -par.profileY);
		var p0Modified = itercection(par.p2, tempPoint, par.p0, par.p3);
		var pole1Angle = angle(par.p2, p0Modified);
		var poleLength = distance(par.p2, p0Modified);
	
		crossPoleParams.angStart = crossPoleParams.angEnd = pole1Angle - sectionAngle + Math.PI / 2;
		crossPoleParams.length = poleLength;
		crossPoleParams.poleAngle = pole1Angle;
		crossPoleParams.dxfBasePoint = newPoint_xy(par.dxfBasePoint, p0Modified.x, p0Modified.y);
		var pole = drawPole3D_4(crossPoleParams).mesh;
		pole.position.x = p0Modified.x;
		pole.position.y = p0Modified.y;
		cross.add(pole);

		var tempPoint = polar(par.p1, angle(par.p1, par.p3) + Math.PI / 2, par.profileY);
		var p1Modified = itercection(par.p3, tempPoint, par.p1, par.p2);

		var poleAngle = angle(par.p3, p1Modified);
		var endAngle = poleAngle - pole1Angle + Math.PI / 2;

		var crossIntercection = itercection(p1Modified, par.p3, p0Modified, par.p2);
		var poleLength = distance(p1Modified, crossIntercection) - par.profileY / Math.cos(endAngle);

		crossPoleParams.angStart = poleAngle - sectionAngle + Math.PI / 2
		crossPoleParams.angEnd = endAngle;
		crossPoleParams.length = poleLength;
		crossPoleParams.poleAngle = poleAngle + Math.PI;;
		crossPoleParams.dxfBasePoint = newPoint_xy(par.dxfBasePoint, par.p3.x, par.p3.y);
		var pole = drawPole3D_4(crossPoleParams).mesh;
		pole.position.x = par.p3.x;
		pole.position.y = par.p3.y;
		cross.add(pole);

		crossPoleParams.angEnd = endAngle;
		crossPoleParams.angStart = poleAngle - sectionAngle + Math.PI / 2;
		crossPoleParams.length = poleLength;
		crossPoleParams.poleAngle = poleAngle;
		crossPoleParams.dxfBasePoint = newPoint_xy(par.dxfBasePoint, par.p1.x, par.p1.y);
		var pole = drawPole3D_4(crossPoleParams).mesh;
		pole.position.x = par.p1.x;
		pole.position.y = par.p1.y;
		cross.add(pole);

	}

	return cross;
}

/*стойка кованой сеции*/
function drawForgedRack3d_4(par) {
	/*
	par={
		len: 0,
		angleTop: 0,
		}
	*/
	var angleBottom = 0;
	var angleTop = par.angleTop;
	var profSize = 40;
	var forgingExtrudeOptions = {
		amount: profSize,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var rackShape = draw4angleShape(angleBottom, angleTop, profSize, par.len, 1)

	var geom = new THREE.ExtrudeGeometry(rackShape, forgingExtrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var forgedRack = new THREE.Mesh(geom, params.materials.metal);

	par.mesh = forgedRack;

	return par;
} //end of drawForgedRack3d_4

/*стекло в форме параллелограмма*/

function drawGlassShape_4(p1, p2, angle, glassDist, glassHeight) {
	var glassHeight1 = glassHeight;
	var glassHeight2 = glassHeight1 + (p2.y - p1.y) - glassDist * Math.tan(angle);
	var glassWidth = p2.x - p1.x - glassDist;

	var glassShape = new THREE.Shape();
	glassShape.moveTo(0, 0);
	var x = 0;
	var y = glassHeight1;
	glassShape.lineTo(x, y);
	x = glassWidth;
	y = glassHeight2;
	glassShape.lineTo(x, y);
	x = glassWidth;
	y = glassHeight2 - glassHeight1;
	glassShape.lineTo(x, y);
	glassShape.lineTo(0, 0);


	//сохраняем данные для спецификации
	var partName = "glasses";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				sumArea: 0, //остатьки старой функции
				area: 0,
				name: "Стекло",
				metalPaint: false,
				timberPaint: false,
				division: "stock_2",
				workUnitName: "area",
				group: "Ограждения",
			}
		}
		if (params.railingModel == "Экраны лазер") specObj[partName].name = "Экран лазер";

		var name = Math.round(glassWidth) + "x" + Math.round(glassHeight2);
		var area = Math.round(glassWidth * glassHeight2 / 10000) / 100;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["sumArea"] += area;
		specObj[partName]["area"] += area;
	}
	glassShape.articul = partName + name;

	return glassShape;
}


/** функция отрисовывает стекло
исходные данные:
	p1 - левая нижняя точка
	p2 - правая нижняя точка
	height - высота
	offsetLeft - отступ справа
	offsetRight - отступ слева
	offsetY - отступ вверх
	material - материал
	thickness - толщина
	dxfPrimitivesArr
	dxfBasePoint
	holes: []
	*/

function draw4AngleGlass_4(par) {

	if (!par.holes) par.holes = [];

	var shape = new THREE.Shape();
	var angleX = angle(par.p1, par.p2)
	var p1 = newPoint_x1(par.p1, par.offsetLeft, angleX); //левый нижний угол
	p1 = newPoint_xy(p1, 0, par.offsetY); //поднимаем вверх
	var p2 = newPoint_x1(par.p2, -par.offsetRight, angleX); //правый нижний угол
	p2 = newPoint_xy(p2, 0, par.offsetY); //поднимаем вверх

	var p3 = newPoint_xy(p2, 0, par.height) //верхний правый угол
	var p4 = newPoint_xy(p1, 0, par.height) //верхний левый угол

	addLine(shape, par.dxfPrimitivesArr, p1, p2, par.dxfBasePoint);
	addLine(shape, par.dxfPrimitivesArr, p2, p3, par.dxfBasePoint);
	addLine(shape, par.dxfPrimitivesArr, p3, p4, par.dxfBasePoint);
	addLine(shape, par.dxfPrimitivesArr, p4, p1, par.dxfBasePoint);

	for (var i = 0; i < par.holes.length; i++) {
		addRoundHole(shape, par.dxfPrimitivesArr, par.holes[i], par.holes[i].diam / 2, par.dxfBasePoint);
	}

	var width = p2.x - p1.x;
	var height = p3.y - p1.y

	var extrudeOptions = {
		amount: par.thickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.glass);

	par.mesh = mesh;

	for (var i = 0; i < par.holes.length; i++) {
		var rutelPar = {
			size: 14
		};

		var rutel = drawGlassRutel(rutelPar);
		rutel.rotation.x = -Math.PI / 2;

		rutel.position.x = par.holes[i].x;
		rutel.position.y = par.holes[i].y;

		if(!testingMode) par.mesh.add(rutel);
	}

	//сохраняем данные для спецификации
	var partName = "glasses";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				sumArea: 0,
				area: 0,
				name: "Стекло",
				metalPaint: false,
				timberPaint: false,
				division: "stock_2",
				workUnitName: "area",
				group: "Ограждения",
			}
		}
		if (params.railingModel == "Экраны лазер") specObj[partName].name = "Экран лазер";

		var name = Math.round(width) + "x" + Math.round(height);
		var area = Math.round(width * height / 10000) / 100;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["sumArea"] += area;
		specObj[partName]["area"] += area;
	}

	par.mesh.specId = partName + name;

	return par;
}//end of draw4AngleGlass_4


function drawGlassNewell_(glassParams) {

	var p1 = glassParams.p1;
	var p2 = glassParams.p2;
	var angle = glassParams.angle;
	var glassDist = glassParams.glassDist;
	var glassHeight = glassParams.glassHeight;
	var dxfBasePoint = glassParams.dxfBasePoint;
	var glassThickness = 8;
	var glassExtrudeOptions = {
		amount: glassThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	angle = calcAngleX1(p1, p2);
	if (glassParams.isHandrailAngle && ((glassParams.angle - 0.1) < angle))
		angle = glassParams.angle;

	if (angle == 0) {
		glassHeight -= 25;
		p1.y += 25;
	}

	var obj = new THREE.Object3D();

	var glassWidth = p2.x - p1.x - glassDist * 2;
	yOffset = Math.tan(angle) * glassWidth;
	var glassShape = new THREE.Shape();

	var pg1 = newPoint_xy(p1, glassDist, 0);
	var pg2 = newPoint_xy(p1, glassDist, glassHeight);

	var pt1 = newPoint_xy(p2, -glassDist, 0);
	var pg3 = itercection(pg1, polar(pg1, angle, 100.0), pt1, polar(pt1, Math.PI / 2, 100.0));
	var pg4 = itercection(pg2, polar(pg2, angle, 100.0), pt1, polar(pt1, Math.PI / 2, 100.0));

	addLine(glassShape, dxfPrimitivesArr, pg1, pg2, dxfBasePoint);
	addLine(glassShape, dxfPrimitivesArr, pg2, pg4, dxfBasePoint);
	addLine(glassShape, dxfPrimitivesArr, pg4, pg3, dxfBasePoint);
	addLine(glassShape, dxfPrimitivesArr, pg3, pg1, dxfBasePoint);

	var geom = new THREE.ExtrudeGeometry(glassShape, glassExtrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var glass = new THREE.Mesh(geom, glassParams.glassMaterial);
	obj.add(glass);

	//размеры описанного прямоугольника
	var rectHeight = pg4.y - pg1.y;
	var rectWidth = pg4.x - pg1.x;

	//стеклодержатели--------------------------------------
	var offsetX = pg1.x - 22; //45;
	var offsetY = pg1.y + 100;
	var dxfBasePoint_h = newPoint_xy(dxfBasePoint, offsetX, offsetY);

	var glassHolderParams = {
		dxfBasePoint: dxfBasePoint_h,
		dxfArr: dxfPrimitivesArr,
		material: glassParams.glassHolderMaterial,
		turn: 1,
	}
	var glassHolder = drawGlassHolder(glassHolderParams).mesh;
	glassHolder.position.z = -16 + 10;
	glassHolder.position.x = offsetX;
	glassHolder.position.y = offsetY;
	obj.add(glassHolder);

	//----------------------
	offsetX = pg2.x - 22;
	offsetY = pg2.y - 140;
	glassHolderParams.dxfBasePoint = newPoint_xy(dxfBasePoint, offsetX, offsetY);
	var glassHolder = drawGlassHolder(glassHolderParams).mesh;
	glassHolder.position.z = -16 + 10;
	glassHolder.position.x = offsetX;
	glassHolder.position.y = offsetY;
	obj.add(glassHolder);
	//----------------------
	offsetX = pg3.x + 22;
	offsetY = pg3.y + 100;
	glassHolderParams.dxfBasePoint = newPoint_xy(dxfBasePoint, offsetX, offsetY);
	glassHolderParams.turn = -1;
	var glassHolder = drawGlassHolder(glassHolderParams).mesh;
	glassHolder.position.z = -16 + 10;
	glassHolder.position.x = offsetX;
	glassHolder.position.y = offsetY;
	obj.add(glassHolder);
	//----------------------
	offsetX = pg4.x + 22;
	offsetY = pg4.y - 140;
	glassHolderParams.dxfBasePoint = newPoint_xy(dxfBasePoint, offsetX, offsetY);
	var glassHolder = drawGlassHolder(glassHolderParams).mesh;
	glassHolder.position.z = -6;
	glassHolder.position.x = offsetX;
	glassHolder.position.y = offsetY;
	obj.add(glassHolder);
	//----------------------

	glassParams.mesh = obj;


	//сохраняем данные для спецификации
	var partName = "glasses";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				sumArea: 0,
				name: "Стекло",
				metalPaint: false,
				timberPaint: false,
				division: "stock_2",
				workUnitName: "area",
				group: "Ограждения",
			}
		}
		if (params.railingModel == "Экраны лазер") specObj[partName].name = "Экран лазер";

		var name = Math.round(rectWidth) + "x" + Math.round(rectHeight);
		var area = Math.round(rectWidth * rectHeight / 10000) / 100;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["sumArea"] += area;
		specObj[partName]["area"] += area;
	}
	obj.specId = partName + name;
	//сохраняем данные для ведомости стекол

	var glassPar = {
		area: rectWidth * rectHeight / 1000000,
		holeAmt: 0,
		A: rectWidth,
		B: rectHeight,
		d1: distance(pg1, pg4),
		d2: distance(pg2, pg3),
		thk: 8,
	}
	if (!railingParams.glass8) railingParams.glass8 = [];
	if (railingParams.glass8) railingParams.glass8.push(glassPar);


	return glassParams;
}

//зажимной стеклодержатель

function drawGlassHolder_(par) {

	par.thk = 20;
	par.height = 40;
	par.width = 50 * par.turn;
	par.rad = par.height / 2;
	par.radOffset = par.width - par.rad * par.turn;

	var shape = new THREE.Shape();
	var p0 = { "x": 0.0, "y": 0.0 };
	var p1 = newPoint_xy(p0, 0.0, par.height);
	var p2 = newPoint_xy(p1, par.radOffset, 0.0);
	var p3 = newPoint_xy(p0, par.radOffset, 0);
	var center = newPoint_xy(p0, par.radOffset, par.rad);

	addLine(shape, par.dxfArr, p3, p0, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p0, p1, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);

	if (par.turn === 1)
		addArc2(shape, par.dxfArr, center, par.rad, Math.PI / 2, -Math.PI / 2, true, par.dxfBasePoint);
	else
		addArc2(shape, par.dxfArr, center, par.rad, Math.PI / 2, Math.PI * 3 / 2, true, par.dxfBasePoint);

	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};


	geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var glassHolder = new THREE.Mesh(geometry, params.materials.inox);

	par.mesh = glassHolder;
	return par;
}


function drawForgedFramePart_(par) {

	/*
	var pole3DParams = {
		type: "pole", rack
		poleProfileY: 40,
		poleProfileZ: 60,
		dxfBasePoint: railingSectionParams.dxfBasePointHandrail,
		len: 1000,
		poleAngle: 0,
		angStart
		angEnd
		angTop
		dxfArr: dxfPrimitivesArr,
		}
		*/

	par.showHoles = true;
	par.showPins = true;
	par.stringerSideOffset = 0;
	if (params.model == "ко") par.stringerSideOffset = params.sideOverHang;

	par.mesh = new THREE.Object3D();

	var extrudeOptions = {
		amount: par.poleProfileZ,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	//стойка
	if (par.type == "rack") {
		var deltaHeight = par.poleProfileY * Math.tan(par.angTop);

		var p0 = { x: -par.poleProfileY / 2, y: 0 };
		var p1 = newPoint_xy(p0, 0, par.len - deltaHeight);
		var p2 = newPoint_xy(p1, par.poleProfileY, deltaHeight);
		var p3 = newPoint_xy(p0, par.poleProfileY, 0);

		if (par.angTop < 0) {
			p1 = newPoint_xy(p0, 0, par.len);
			p2 = newPoint_xy(p1, par.poleProfileY, deltaHeight);
		}

		var shape = new THREE.Shape();
		addLine(shape, par.dxfArr, p0, p1, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p3, p0, par.dxfBasePoint);

		//отверстия
		if (par.showHoles) {
			var rad = 6.5;
			var holeDist = 60;
			//верхнее отверстие
			var center = { x: 0, y: 90 }
			addRoundHole(shape, par.dxfArr, center, rad, par.dxfBasePoint);
			var center = newPoint_xy(center, 0, -holeDist)
			addRoundHole(shape, par.dxfArr, center, rad, par.dxfBasePoint);
		}

		//сохраняем параметры
		par.topCutLen = distance(p1, p2);
		par.len2 = par.len - deltaHeight

		//штырьки для отверстий
		if (par.showPins) {
			var pinMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000, wireframe: false });
			var pinRad = 6;
			var pinLength = 20;
			if (par.stringerSideOffset) pinLength += par.stringerSideOffset;

			var geom = new THREE.CylinderGeometry(pinRad, pinRad, pinLength, 8, 4, false);
			geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

			//верхний штырек
			var pin = new THREE.Mesh(geom, pinMaterial);
			pin.position.y = 90;
			pin.position.z = -pinLength / 2;
			if (par.railingSide == "left") pin.position.z = pinLength / 2 + par.poleProfileZ;
			par.mesh.add(pin);

			//нижний штырек
			var pin = new THREE.Mesh(geom, pinMaterial);
			pin.position.y = 90 - holeDist;
			pin.position.z = -pinLength / 2;
			if (par.railingSide == "left") pin.position.z = pinLength / 2 + par.poleProfileZ;
			par.mesh.add(pin);
		}

		par.angStart = 0;
		par.angEnd = par.angTop;

	}

	//наклонная палка
	if (par.type == "pole") {
		if (par.vertEnds) {
			par.angStart = par.poleAngle;
			par.angEnd = par.poleAngle;
		}
		//рассчитываем абсолютные углы
		var angStart = par.poleAngle + Math.PI / 2 - par.angStart;
		var angEnd = par.poleAngle + Math.PI / 2 - par.angEnd;
		var startCutLen = par.poleProfileY / Math.sin(angStart - par.poleAngle)
		var endCutLen = par.poleProfileY / Math.sin(angEnd - par.poleAngle)

		var p0 = { x: 0, y: 0 };
		var p1 = polar(p0, angStart, startCutLen);
		var p2 = polar(p1, par.poleAngle, par.len);
		var p3 = polar(p0, par.poleAngle, par.len);

		var shape = new THREE.Shape();
		addLine(shape, par.dxfArr, p0, p1, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p3, p0, par.dxfBasePoint);

		//сохраняем параметры
		par.startCutLen = startCutLen;
		par.endCutLen = endCutLen;
		par.len2 = par.len
	}

	var poleGeometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	poleGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var pole = new THREE.Mesh(poleGeometry, params.materials.metal);


	//добавляем подпись в dxf файл
	if (par.text) {
		var textHeight = 30;
		var textBasePoint = newPoint_xy(par.dxfBasePoint, 40, -200);
		addText(par.text, textHeight, par.dxfArr, textBasePoint);
	}

	par.mesh.add(pole);

	//сохраняем данные для спецификации
	if (par.type == "rack") {
		var partName = "forgedRack";
		if (typeof specObj != 'undefined' && partName) {
			if (!specObj[partName]) {
				specObj[partName] = {
					types: {},
					amt: 0,
					sumLength: 0,
					name: "Стойка кованой секции",
					notAddToSpec: true,
				}
			}

			var name = par.len + "х" + par.poleProfileY + "х" + par.poleProfileZ;
			if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
			if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
			specObj[partName]["amt"] += 1;
		}
	}
	par.mesh.specId = partName + name;

	//сохраняем данные для ведомости заготовок

	if (typeof poleList != 'undefined') {
		var poleType = par.poleProfileY + "х" + par.poleProfileZ + " черн.";
		//формируем массив, если такого еще не было
		if (!poleList[poleType]) poleList[poleType] = [];
		var polePar = {
			len1: Math.round(par.len2),
			len2: Math.round(par.len),
			angStart: Math.round(par.angStart * 180 / Math.PI * 10) / 10,
			angEnd: Math.round(par.angEnd * 180 / Math.PI * 10) / 10,
			cutOffsetStart: Math.round(par.poleProfileY * Math.tan(par.angStart)),
			cutOffsetEnd: Math.round(par.poleProfileY * Math.tan(par.angEnd)),
			poleProfileY: par.poleProfileY,
			poleProfileZ: par.poleProfileZ,
		}
		polePar.len3 = polePar.len1 + polePar.cutOffsetEnd; //максимальная длина палки
		polePar.text = par.sectText;
		polePar.description = [];
		polePar.description.push(polePar.text);
		polePar.amt = 1;

		poleList[poleType].push(polePar);

	}

	return par;


};


function drawHandrailHolder(par) {

	par.mesh = new THREE.Object3D();
	if (typeof testingMode == "undefined") testingMode = false;
	var rackModel = params.banisterMaterial;
	if (specObj.unit == "banister") rackModel = params.banisterMaterial_bal;
	var railingModel = params.railingModel;
	if (par.railingModel) railingModel = par.railingModel;

	var botPartLen = 53;
	var topPartLen = 17;
	var holderRad = 6;
	var segmentsX = 20;
	var segmentsY = 0;
	var openEnded = false;
	var basePoint = { x: 0, y: 0 };
	var flanThk = 2;

	if (par.angTop == 0) {
		botPartLen = 0;
		topPartLen = 70;
	}

	if (par.isForge) {
		botPartLen = 0;
		topPartLen = 40 - 1;
	}

	if (testingMode) {
		var deltaLen = 0.5 * holderRad / Math.cos(par.angTop);
		topPartLen -= deltaLen;

	}
	//нижний участок
	if (botPartLen != 0) {
		var len = botPartLen - 0.02;
		if (par.isHor) len -= 2; //костыль, учитывающий толщину нижнего фланца чтобы не двигать кронштейн
		var geom = new THREE.CylinderGeometry(holderRad, holderRad, len, segmentsX, segmentsY, openEnded);
		var cyl = new THREE.Mesh(geom, params.materials.inox);
		cyl.position.y = botPartLen / 2 - 0.01;
		if (par.isHor) cyl.position.y += 1;
		par.mesh.add(cyl);
	}
	//верхний участок
	var geom = new THREE.CylinderGeometry(holderRad, holderRad, topPartLen, segmentsX, segmentsY, openEnded);
	var cyl = new THREE.Mesh(geom, params.materials.inox);
	var basePoint1 = newPoint_xy(basePoint, 0, botPartLen);
	basePoint1 = polar(basePoint1, par.angTop + Math.PI / 2, topPartLen / 2);
	if (testingMode) {
		basePoint1 = polar(basePoint1, par.angTop + Math.PI / 2, deltaLen);
	}
	cyl.rotation.z = par.angTop
	cyl.position.x = basePoint1.x;
	cyl.position.y = basePoint1.y;
	par.mesh.add(cyl);

	//базовая точка для фланца
	basePoint1 = newPoint_xy(basePoint, 0, botPartLen);
	basePoint1 = polar(basePoint1, par.angTop + Math.PI / 2, topPartLen + 0.1); //0.1 - зазор чтобы не подсвечивались пересечения
	if (testingMode) {
		basePoint1 = polar(basePoint1, par.angTop + Math.PI / 2, deltaLen);
	}
	//ось кронштейна в dxf
	var trashShape = new THREE.Shape();
	//вертикальная ориентация
	if (!par.isHor) {
		var p1 = newPoint_xy(basePoint, 0, botPartLen);
		var p2 = polar(p1, par.angTop + Math.PI / 2, topPartLen + flanThk);
		addLine(trashShape, dxfPrimitivesArr, basePoint, p1, par.dxfBasePoint);
		addLine(trashShape, dxfPrimitivesArr, p1, p2, par.dxfBasePoint);
	}
	//горизонтальная ориентация
	if (par.isHor) {
		var p1 = newPoint_xy(basePoint, -botPartLen, 0);
		var p2 = polar(p1, -par.angTop + Math.PI, topPartLen + flanThk);
		addLine(trashShape, dxfPrimitivesArr, basePoint, p1, par.dxfBasePoint);
		addLine(trashShape, dxfPrimitivesArr, p1, p2, par.dxfBasePoint);
	}

	var flan = drawHolderFlan({ railingModel: railingModel}).mesh;

	flan.rotation.x = -Math.PI / 2;
	flan.rotation.y = -par.angTop;
	flan.position.x = basePoint1.x;
	flan.position.y = basePoint1.y;


	par.mesh.add(flan)

	//лодочка нижняя
	if (par.isHor) {
		//var flan2 = new THREE.Mesh(geometry, params.materials.inox);
		var flan2 = drawHolderFlan().mesh;
		flan2.rotation.x = -Math.PI / 2;
		//flan2.rotation.y = -par.angTop;
		flan2.position.x = 0;
		flan2.position.y = 0;
		par.mesh.add(flan2)
	}

	//гайка М8
	if (!par.isHor && rackModel == "40х40 черн." && !testingMode && railingModel != "Кованые балясины"){
		//параметры гайки
		var nutParams = {
			diam: 8,
			isSelfLock: true,
		}

		var nut = drawNut(nutParams).mesh;
		nut.position.y = -10;
		if(!testingMode) par.mesh.add(nut)
	}
	if (railingModel == "Кованые балясины") {
		//параметры гайки
		var nutParams = {
			diam: 6,
			isCap: true,
		}
		var shimParams = {
			diam: 6
		}

		var nut = drawNut(nutParams).mesh;
		nut.position.y = -12;
		nut.rotation.y = -par.angTop;
		if(!testingMode) par.mesh.add(nut);

		//шайба
		var shim = drawShim(shimParams).mesh;
		shim.position.y = -8;
		shim.rotation.y = -par.angTop;
		if(!testingMode) par.mesh.add(shim);
	}


	//сохраняем данные для спецификации
	var partName = "handrailHolderAng";
	if (botPartLen == 0) partName = "handrailHolderStr";
	if (par.isForge) partName = "tube12";
	if (par.isHor) partName = "handrailHolder2flan";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Кронштейн поручня штырь",
				metalPaint: false,
				timberPaint: false,
				division: "stock_1",
				workUnitName: "amt",
				group: "Ограждения",
			}
			if (partName == "handrailHolderStr") specObj[partName].name = "Кронштейн поручня штырь";
			if (partName == "tube12") specObj[partName].name = "Трубка нерж.";
			if (par.isHor) specObj[partName].name = "Кронштейн поручня с двумя лодочками";
		}
		name = "с шарниром";
		if (partName == "handrailHolderStr") name = "прямой";
		if (partName == "tube12") name = 'Ф12х40';
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}

	par.mesh.specId = partName + name;
	par.mesh.setLayer("metis");

	return par;
}

/** функция отрисовыает лодочку кронштейна
*/

function drawHolderFlan(par){
	if(!par) par = {};
	var rackModel = params.banisterMaterial;
	if (specObj.unit == "banister") rackModel = params.banisterMaterial_bal;

	//рассчитываем параметры поручня
	var handrailPar = {
		prof: params.handrailProf,
		sideSlots: params.handrailSlots,
		handrailType: params.handrail,
	}
	if(params.calcType == "vint") handrailPar.handrailType = params.handrailMaterial;

	if(specObj.unit == "banister"){
		var handrailPar = {
			prof: params.handrailProf_bal,
			sideSlots: params.handrailSlots_bal,
			handrailType: params.handrail_bal,
			}
		}
	handrailPar = calcHandrailMeterParams(handrailPar); //функция в файле priceLib.js

	par.material = params.materials.inox;

	par.holderFlanId = "handrailHolderFlanPlane";
	if(params.railingModel == "Кованые балясины" ||
		params.railingModel == "Трап" ||
		rackModel == "40х40 черн."){
			par.holderFlanId = "holderFlan";
			if(params.handrail == "40х20 черн." || params.handrail == "ПВХ") par.holderFlanId = "handrailHolderFlanPlane";
			par.material = params.materials.metal_railing;
	}
	if (handrailPar.handrailModel == "round") par.holderFlanId = "handrailHolderFlanArc";

	var len = 60;
	var wid = 20;
	var holeRad = 3;
	var holeDist = 45;
	var rad = wid / 2;
	var dxfArr = [];
	var dxfBasePoint = { x: 0, y: 0, }
	var flanThk = 2;

	var shape = new THREE.Shape();

	var p0 = { x: 0, y: 0 };
	var p1 = newPoint_xy(p0, -len / 2 + rad, -rad);
	var p2 = newPoint_xy(p0, -len / 2 + rad, rad);
	var p3 = newPoint_xy(p0, len / 2 - rad, rad);
	var p4 = newPoint_xy(p0, len / 2 - rad, -rad);
	var center1 = newPoint_xy(p0, -len / 2 + rad, 0);
	var center2 = newPoint_xy(p0, len / 2 - rad, 0);
	var holeCenter1 = newPoint_xy(p0, -holeDist / 2, 0);
	var holeCenter2 = newPoint_xy(p0, holeDist / 2, 0);

	addArc2(shape, dxfArr, center1, rad, 1.5 * Math.PI, 0.5 * Math.PI, true, dxfBasePoint);
	addLine(shape, dxfArr, p2, p3, dxfBasePoint);
	addArc2(shape, dxfArr, center2, rad, 0.5 * Math.PI, -0.5 * Math.PI, true, dxfBasePoint);
	addLine(shape, dxfArr, p4, p1, dxfBasePoint);

	addRoundHole(shape, dxfArr, holeCenter1, holeRad, dxfBasePoint);
	addRoundHole(shape, dxfArr, holeCenter2, holeRad, dxfBasePoint);

	var extrudeOptions = {
		amount: flanThk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	par.mesh = new THREE.Object3D();
	var mesh = new THREE.Mesh(geometry, par.material);
	par.mesh.add(mesh);

	var screwId = "timberHandrailScrew";
	if (handrailPar.mat == 'metal') screwId = 'metalHandrailScrew';
	if (handrailPar.mat == 'inox') screwId = 'metalHandrailScrew';

	var screwPar = {
		id: screwId,
		description: "Крепление поручней",
		group: "Ограждения"
	}

	var screw = drawScrew(screwPar).mesh;
	screw.position.x = holeCenter1.x;
	screw.position.z = screwPar.len / 2;
	screw.rotation.x = Math.PI / 2;
	par.mesh.add(screw)

	var screw2 = drawScrew(screwPar).mesh;
	screw2.position.x = holeCenter2.x;
	screw2.position.z = screwPar.len / 2;
	screw2.rotation.x = Math.PI / 2;
	par.mesh.add(screw2);

	var vintId = "vint_M6x10";
	if (params.railingModel == "Кованые балясины") vintId = "vint_M6x70";
	if (par.railingModel == "Кованые балясины") vintId = "vint_M6x70";
	var vintPar = {
		id: vintId,
		description: "Крепление лодочки к штырю",
		group: "Ограждения"
	}

	var midpoint = {x: Math.floor((holeCenter1.x + holeCenter2.x) / 2), y: Math.floor((holeCenter1.y + holeCenter2.y) / 2)};
	var vint = drawVint(vintPar).mesh;
	vint.position.x = midpoint.x;
	// vint.position.z = midpoint.y;
	vint.position.z = -vintPar.len / 2 + 2;
	vint.rotation.x = Math.PI / 2;
	par.mesh.add(vint);

	// item = {
	// 	id:  par.holderFlanId,
	// 	amt: totalHolderAmt,
	// 	discription: "Крепление поручня к стойкам",
	// 	unit: "banisterItemsAdd",
	// 	itemGroup: par.group,
	// 	};
	// if(item.amt > 0) par.items.push(item);

	//сохраняем данные для спецификации
	var partName = par.holderFlanId + "_model";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "",
				metalPaint: false,
				timberPaint: false,
				division: "stock_1",
				workUnitName: "amt",
				group: "Ограждения",
				purposes: ["Крепление поручня к стойкам"]
			}
			if (partName == "holderFlan_model") {
				specObj[partName].name = "Лодочка плоская черн.";
				specObj[partName].metalPaint = true;
				
			}
			if (partName == "handrailHolderFlanPlane_model") specObj[partName].name = "Лодочка под плоский поручень нерж.";
			if (partName == "handrailHolderFlanArc_model") specObj[partName].name = "Лодочка под круглый поручень";
		}
		var name = 0;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}

	par.mesh.specId = partName;
	par.mesh.setLayer("metis");

	return par;
}


/**
фунция отрисовывает шарнир - соединитель поручня

*/
function drawHandrailJoint(par) {

	if (!par.type) par.type = "handrailJoint"
	par.rad = 50 / 2 - 1;
	if (par.type == "rigelJoint") par.rad = 12 / 2

	var geom = new THREE.SphereGeometry(par.rad, 32, 32);
	var sphere = new THREE.Mesh(geom, params.materials.inox);

	//окружность в dxf
	var trashShape = new THREE.Shape();
	addCircle(trashShape, dxfPrimitivesArr, { x: 0, y: 0 }, par.rad, par.dxfBasePoint);

	//сохраняем данные для спецификации
	var partName = par.type;
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Шарнир внутр. нерж.",
				metalPaint: false,
				timberPaint: false,
				division: "stock_1",
				workUnitName: "amt",
				group: "Ограждения",
			}
			if (params.handrail == "ПВХ") specObj[partName].name = "Шарнир внешн. под ПВХ";
			if (par.type == "rigelJoint") specObj[partName].name = "Шарнир ригеля внешн.";
		}
		var name = "Ф50";
		if (par.type == "rigelJoint") name = "Ф12"
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}

	sphere.specId = partName + name;

	return sphere;
}//end of calcTopPoint

function calcHolderTopPoint(rackPar) {
	//фунция возвращает координаты верхней точки кронштейна поручня, рассчитанные на основе параметров стойки
	//параметры кронштейна поручня
	var botPartLen = 53;
	var topPartLen = 17 + 3;
	var point = newPoint_xy(rackPar, 0, rackPar.len - 90 + botPartLen);
	point = polar(point, rackPar.holderAng + Math.PI / 2, topPartLen);
	return point;
} //end of calcTopPoint


function drawPlatformRailingFlan(par) {
	if (!par) par = {};
	if (!par.dxfArr) par.dxfArr = dxfPrimitivesArr;
	if (!par.dxfBasePoint) {
		par.dxfBasePoint = { x: 0, y: 0 };
		dxfArr = [];
	}
	if (!par.size) par.size = 76;
	if (!par.holeDst) par.holeDst = 55;
	if (!par.material) par.material = params.materials.metal2

	var size = par.size;
	var thk = 4;
	var holeRad = 4;
	var holeDst = par.holeDst;
	var rackSize = 40 + 0.01;

	par.mesh = new THREE.Object3D();

	var shape = new THREE.Shape();
	var extrudeOptions = {
		amount: thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	//внешний контур

	var p0 = { x: 0, y: 0 }
	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p1, 0, size);
	var p3 = newPoint_xy(p2, size, 0);
	var p4 = newPoint_xy(p3, 0, -size);

	addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p4, p1, par.dxfBasePoint);

	//круглые отверстия
	var holeOffset = (size - holeDst) / 2;
	var center1 = newPoint_xy(p0, holeOffset, holeOffset)
	addRoundHole(shape, par.dxfArr, center1, holeRad, par.dxfBasePoint);
	var center2 = newPoint_xy(center1, 0, holeDst)
	addRoundHole(shape, par.dxfArr, center2, holeRad, par.dxfBasePoint);
	var center3 = newPoint_xy(center1, holeDst, holeDst)
	addRoundHole(shape, par.dxfArr, center3, holeRad, par.dxfBasePoint);
	var center4 = newPoint_xy(center1, holeDst, 0)
	addRoundHole(shape, par.dxfArr, center4, holeRad, par.dxfBasePoint);

	//квадратное отверстие
	holeOffset = (size - rackSize) / 2;
	ph1 = newPoint_xy(p0, holeOffset, holeOffset)
	ph2 = newPoint_xy(ph1, rackSize, 0)
	ph3 = newPoint_xy(ph1, rackSize, rackSize)
	ph4 = newPoint_xy(ph1, 0, rackSize)

	var sqHole = new THREE.Path();
	addLine(sqHole, par.dxfArr, ph1, ph2, par.dxfBasePoint);
	addLine(sqHole, par.dxfArr, ph2, ph3, par.dxfBasePoint);
	addLine(sqHole, par.dxfArr, ph3, ph4, par.dxfBasePoint);
	addLine(sqHole, par.dxfArr, ph4, ph1, par.dxfBasePoint);

	shape.holes.push(sqHole);

	var screwPar = {
		id: "screw_6x32",
		description: "Крепление стоек к ступеням",
		group: "Ограждения"
	}

	if (par.unit == "balustrade" && params.fixType2 != "дерево") {
		screwPar.id = "screw_6x60";
		screwPar.dowelId = "dowel_10x50";
		screwPar.description = "Крепление стоек к перекрытию";
		if (params.calcType == 'vint') {
			screwPar.id = "screw_6x32";
			screwPar.dowelId = null;
			screwPar.description = "Крепление стоек к площадке";
		}
	}

	var screw = drawScrew(screwPar).mesh;
	screw.rotation.x = Math.PI;
	screw.position.x = center1.x - size / 2;
	screw.position.y = -screwPar.len / 2;
	screw.position.z = center1.y - size / 2;
	par.mesh.add(screw);

	var screw = drawScrew(screwPar).mesh;
	screw.rotation.x = Math.PI;
	screw.position.x = center2.x - size / 2;
	screw.position.y = -screwPar.len / 2;
	screw.position.z = center2.y - size / 2;
	par.mesh.add(screw);

	var screw = drawScrew(screwPar).mesh;
	screw.rotation.x = Math.PI;
	screw.position.x = center3.x - size / 2;
	screw.position.y = -screwPar.len / 2;
	screw.position.z = center3.y - size / 2;
	par.mesh.add(screw);

	var screw = drawScrew(screwPar).mesh;
	screw.rotation.x = Math.PI;
	screw.position.x = center4.x - size / 2;
	screw.position.y = -screwPar.len / 2;
	screw.position.z = center4.y - size / 2;
	par.mesh.add(screw);

	var partName = "steelCover_model";
	var name = "Декоративная крышка основания стойки (черн.)";
	if (params.banisterMaterial == "40х40 нерж." || params.banisterMaterial == "40х40 нерж+дуб") {
		if (params.railingModel_bal !== "Кованые балясины") {
			partName = "stainlessCover_model";
			name = "Декоративная крышка основания стойки (нерж.)";
		}
	}

	var coverParams = {
		id: partName,
		name: name,
		description: "Крышка фланца стойки"
	}

	if(par.unit == "balustrade") coverParams.description += " баллюстрада";
	var cover = drawRackCover(coverParams);
	par.mesh.add(cover);

	//подпись под фигурой
	var text = "Фланец ограждений"
	var textHeight = 30;
	var textBasePoint = newPoint_xy(par.dxfBasePoint, -100, -200)
	addText(text, textHeight, par.dxfArr, textBasePoint)

	var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

	var flan = new THREE.Mesh(geometry, par.material);
	flan.rotation.x = -Math.PI / 2
	flan.position.x = -size / 2
	flan.position.z = size / 2

	par.mesh.add(flan);
	return par;


} //end of drawPlatformRailingFlan


function drawGlassRutel(par){
	var mesh = new THREE.Object3D();
	if(menu.simpleMode) return mesh;

	par = par || {};
	var len = par.len || 125;
	var diam = par.size || 14;

	var geometry = new THREE.CylinderGeometry(diam / 2, diam / 2, len, 10, 1, false);
	var rutel = new THREE.Mesh(geometry, params.materials.inox);
	mesh.add(rutel);

	var rutelShims = drawRutelShims(diam);
	rutelShims.position.y -= len / 2;
	if(!testingMode) mesh.add(rutelShims);

	//На моно гайки и шайбы не нужны
	if (params.calcType !== 'mono') {
		//шайба
		var shimParams = { diam: diam }
		var shim = drawShim(shimParams).mesh;
		shim.position.y = len / 2 - 20;
		mesh.add(shim);

		//гайка
		var nutParams = { diam: diam }
		var nut = drawNut(nutParams).mesh;
		nut.position.y = len / 2 - 20;
		mesh.add(nut);

		//шайба
		var shimParams = { diam: diam }
		var shim = drawShim(shimParams).mesh;
		shim.position.y = len / 2 - 35;
		shim.rotation.y = Math.PI;
		mesh.add(shim);

		//гайка
		var nutParams = { diam: diam }
		var nut = drawNut(nutParams).mesh;
		nut.position.y = len / 2 - 35;
		nut.rotation.y = Math.PI;
		mesh.add(nut);
	};

	//сохраняем данные для спецификации
	var partName = "rutel_m" + diam;
	mesh.specId = partName;
	if (typeof specObj != 'undefined' && partName) {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Шпилька рутеля М" + diam + " L=" + len + "мм",
				metalPaint: false,
				timberPaint: false,
				division: "stock_1",
				purposes: ["Крепление стекол ограждения"],
				workUnitName: "amt",
				group: "Ограждения",
			}
		}

		name = 0;

		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}

	return mesh
}

function drawRutelShims(diam){
	var geometry = new THREE.CylinderGeometry(13, 13, 2, 10, 1, false);
	var rutel = new THREE.Mesh(geometry, params.materials.inox);
	rutel.specId = "rutelShims_m" + diam;

	//сохраняем данные для спецификации
	var partName = "rutelShims_m" + diam;
	if (typeof specObj != 'undefined' && partName) {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Комплект фурнитуры рутеля М" + diam,
				metalPaint: false,
				timberPaint: false,
				division: "stock_1",
				purposes: ["Крепление стекол ограждения"],
				workUnitName: "amt",
				group: "Ограждения",
			}
		}

		name = 0;

		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}

	return rutel
}

function drawRackCover(par){
	par.mesh = new THREE.Object3D();
	if(menu.simpleMode) return par.mesh;

	par.mesh.specId = par.id;

	var size = 80;

	var geometry = new THREE.BoxGeometry(size, 10, size);
	var material = params.materials.metal;
	if (par.id == "stainlessCover") material = params.materials.inox;
	var cover = new THREE.Mesh(geometry, material);
	if(!testingMode) par.mesh.add(cover);

	//сохраняем данные для спецификации
	par.partName = par.id;
	if (typeof specObj != 'undefined' && par.partName) {
		if (!specObj[par.partName]) {
			specObj[par.partName] = {
				types: {},
				amt: 0,
				name: par.name,
				metalPaint: false,
				timberPaint: false,
				division: "stock_1",
				purposes: [],
				workUnitName: "amt",
				group: "Ограждения",
			}
			if (par.id == 'steelCover_model') specObj[par.partName].metalPaint = true;

			if (par.group) specObj[par.partName].group = par.group;
		}
		if (par.description) {
			if (specObj[par.partName].purposes.indexOf(par.description) == -1) specObj[par.partName].purposes.push(par.description);
		}

		name = 0;

		if (specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] += 1;
		if (!specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] = 1;
		specObj[par.partName]["amt"] += 1;
	}

	return par.mesh;
}

/** функция отрисовывает уголок балясины для монокосоуров и винтовых

*/

function drawBanisterAngle(par) {
	if (!par) par = {};
	if (!par.dxfArr) par.dxfArr = dxfPrimitivesArr;
	if (!par.dxfBasePoint) {
		par.dxfBasePoint = { x: 0, y: 0 };
		dxfArr = [];
		par.dxfArr = dxfArr;
	}

	par.mesh = new THREE.Object3D();
	par.thk = 2;
	//par.dxfArr = [];
	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	//верхняя пластина
	var dxfBasePoint = { x: 0, y: 0 }
	var p0 = { x: 0, y: 0 }
	//var topShape = new THREE.Shape();
	var cornerRad = 8;
	var clockwise = true;
	par.holeDist = 24;

	//углы без учета скруглений
	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p1, 0, 5);
	var p3 = newPoint_xy(p1, -20, 30);
	var p4 = newPoint_xy(p1, 40, 30);
	var p5 = newPoint_xy(p1, 20, 5);
	var p6 = newPoint_xy(p1, 20, 0);

	var points = [p1, p2, p3, p4, p5, p6]

	p3.filletRad = cornerRad;
	p4.filletRad = cornerRad;

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		//markPoints: true,
	}

	var topShape = drawShapeByPoints2(shapePar).shape;


	//отверстия
	var center1 = newPoint_xy(p1, -2, 22);
	var holeRad = 3.5;
	addRoundHole(topShape, par.dxfArr, center1, holeRad, dxfBasePoint); //функция в файле drawPrimitives

	var center2 = newPoint_xy(center1, par.holeDist, 0);
	var holeRad = 3.5;
	addRoundHole(topShape, par.dxfArr, center2, holeRad, dxfBasePoint); //функция в файле drawPrimitives



	var geometry = new THREE.ExtrudeGeometry(topShape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var topPlate = new THREE.Mesh(geometry, params.materials.metal2);
	topPlate.rotation.x = Math.PI / 2
	topPlate.position.x = -10;
	topPlate.position.y = 25;
	topPlate.position.z = 0;
	par.mesh.add(topPlate);

		//саморезы или болты
    if (!par.noBolts) {
        if (params.calcType == "vint" && (params.treadsMaterial == 'рифленая сталь' || ~params.treadsMaterial.indexOf("лотки"))) {
            //болты
            if (typeof anglesHasBolts != "undefined" && anglesHasBolts) { //anglesHasBolts - глобальная переменная)
                var boltPar = {
                    diam: 6,
                    len: 20,
                    headType: "внутр. шестигр. плоск. гол.",
                }
                var bolt = drawBolt(boltPar).mesh;
                bolt.rotation.x = Math.PI / 2;
                bolt.position.x = center1.x;
                bolt.position.y = center1.y;
                topPlate.add(bolt)

                var bolt = drawBolt(boltPar).mesh;
                bolt.rotation.x = Math.PI / 2;
                bolt.position.x = center2.x;
                bolt.position.y = center2.y;
                topPlate.add(bolt)
            }
        } else {
            //саморезы
            var screwPar = {
                id: "screw_6x32",
                description: "Крепление ступеней",
                group: "Ступени"
            }
            var screw = drawScrew(screwPar).mesh;
            screw.rotation.x = Math.PI / 2;
            screw.position.x = center1.x;
            screw.position.y = center1.y;
            topPlate.add(screw)

            var screw = drawScrew(screwPar).mesh;
            screw.rotation.x = Math.PI / 2;
            screw.position.x = center2.x;
            screw.position.y = center2.y;
            topPlate.add(screw)
        }
    }


	//вертикальная пластина
	var frontShape = new THREE.Shape();
	var dxfBasePoint = { x: 0, y: -50 }
	var p0 = { x: 0, y: 0 }
	par.holeOffset = 9;
	par.height = 25;
	par.vertWidth = 20;

	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p1, 0, par.height - par.thk);
	var p3 = newPoint_xy(p1, par.vertWidth, par.height - par.thk);
	var p4 = newPoint_xy(p1, par.vertWidth, 0);


	addLine(frontShape, par.dxfArr, p1, p2, dxfBasePoint);
	addLine(frontShape, par.dxfArr, p2, p3, dxfBasePoint);
	addLine(frontShape, par.dxfArr, p3, p4, dxfBasePoint);
	addLine(frontShape, par.dxfArr, p4, p1, dxfBasePoint);

	//овальное отверстие
	var holeWidth = 7;
	var holeHeight = 10;

	var center = newPoint_xy(p1, 10, 9);
	addOvalHoleY(frontShape, [], center, holeWidth / 2, 3, dxfBasePoint, true)

	var geometry = new THREE.ExtrudeGeometry(frontShape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var frontPlate = new THREE.Mesh(geometry, params.materials.metal2);
	frontPlate.position.x = -10;
	frontPlate.position.y = 0;
	frontPlate.position.z = 0;
	par.mesh.add(frontPlate);

	 //болты
    if (typeof anglesHasBolts != "undefined" && anglesHasBolts) { //anglesHasBolts - глобальная переменная)
        var boltPar = {
            diam: 6,
            len: boltLen,
            headType: "внутр. шестигр. плоск. гол.",
        }
        if (params.calcType == 'mono') {
            boltPar.len = 20;
            boltPar.noNut = true;
            boltPar.hasRivet = true;
			boltPar.headType = "пол. гол. крест"
        }
        if (params.calcType == 'vint') {
            boltPar.headType = 'меб.';
            boltPar.len = 16;
            if (params.railingModel == "Частые стойки") {
                boltPar.headType = "внутр. шестигр. плоск. гол.";
                boltPar.len = 35;
            }
        }
        var bolt = drawBolt(boltPar).mesh;
        bolt.rotation.x = Math.PI / 2;
        bolt.position.x = center.x;
        bolt.position.y = center.y;
        if (params.calcType == 'vint' && params.railingModel == "Частые стойки") bolt.position.z = -6;
		if (params.calcType == 'mono') bolt.rotation.x = -Math.PI / 2
        frontPlate.add(bolt)
    }

	//сохраняем данные для спецификации
	var partName = "balAngle";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Уголок балясины",
				metalPaint: true,
				timberPaint: false,
				division: "stock_2",
				workUnitName: "amt",
				group: "Ограждения",
			}
		}
		var name = "3мм";
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}
	par.mesh.specId = partName + name;

	return par;
} //end of drawBanisterAngle


/** функция отрисовывает кованую балясину
*/


function drawForgedBanister(type, basePoint, scale, railingMaterial, railingSection, balLen) {
	if (!basePoint) basePoint = [0, 0, 0];
	if (!scale) scale = 1;
	if (!railingMaterial) railingMaterial = new THREE.MeshLambertMaterial({ color: 0xD0D0D0, wireframe: false });
	if (!railingSection) railingSection = new THREE.Object3D();



	var banisterLength = 750;
	if (balLen) banisterLength = balLen;
	var poleSize = 12

	var banisterExtrudeOptions = {
		amount: 12 * scale,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};


	if (type == "20х20") {
		poleSize = 20;
		var poleGeometry = new THREE.BoxGeometry(poleSize, banisterLength, poleSize);
		var pole = new THREE.Mesh(poleGeometry, railingMaterial);
		pole.position.x = basePoint[0];
		pole.position.y = basePoint[1] + banisterLength / 2;
		pole.position.z = basePoint[2];
		pole.castShadow = true;
		railingSection.add(pole);
	}

	if (type == "bal_1" || type == "bal_3") {
		//шишка
		var bulbGeometry = new THREE.OctahedronGeometry(25 * scale, 0);
		var bulb = new THREE.Mesh(bulbGeometry, railingMaterial);
		bulb.rotation.y = Math.PI / 4;
		bulb.position.x = basePoint[0];
		bulb.position.y = basePoint[1] + banisterLength / 2 * scale;
		bulb.position.z = basePoint[2] + poleSize / 2 * scale;
		bulb.castShadow = true;
		railingSection.add(bulb);
		//stairCase.push(bulb);

		//палка
		var poleGeometry = new THREE.BoxGeometry(poleSize * scale, banisterLength * scale, poleSize * scale);
		var pole = new THREE.Mesh(poleGeometry, railingMaterial);
		pole.position.x = basePoint[0];
		pole.position.y = basePoint[1] + banisterLength / 2 * scale;
		pole.position.z = basePoint[2] + poleSize / 2 * scale;
		pole.castShadow = true;
		railingSection.add(pole);
		//stairCase.push(pole);
	}

	if (type == "bal_2" || type == "bal_4") {
		//шишка
		var bulbGeometry = new THREE.OctahedronGeometry(25 * scale, 0);
		var bulb = new THREE.Mesh(bulbGeometry, railingMaterial);
		bulb.rotation.y = Math.PI / 4;
		bulb.position.x = basePoint[0];
		bulb.position.y = basePoint[1] + banisterLength / 3 * scale;
		bulb.position.z = basePoint[2] + poleSize / 2 * scale;
		bulb.castShadow = true;
		railingSection.add(bulb);
		//stairCase.push(bulb);

		var bulb = new THREE.Mesh(bulbGeometry, railingMaterial);
		bulb.rotation.y = Math.PI / 4;
		bulb.position.x = basePoint[0];
		bulb.position.y = basePoint[1] + banisterLength * 2 / 3 * scale;
		bulb.position.z = basePoint[2] + poleSize / 2 * scale;
		bulb.castShadow = true;
		railingSection.add(bulb);
		//stairCase.push(bulb);

		//палка
		var poleGeometry = new THREE.BoxGeometry(poleSize * scale, banisterLength * scale, poleSize * scale);
		var pole = new THREE.Mesh(poleGeometry, railingMaterial);
		pole.position.x = basePoint[0];
		pole.position.y = basePoint[1] + banisterLength / 2 * scale;
		pole.position.z = basePoint[2] + poleSize / 2 * scale;
		pole.castShadow = true;
		railingSection.add(pole);
		//stairCase.push(pole);
	}

	if (type == "bal_5" || type == "bal_9") {
		var rad1 = 40;
		var rad2 = 50;
		var height1 = banisterLength / 2 - rad2 * 2


		var banisterPart1 = new THREE.Shape();
		banisterPart1.moveTo(0, 0);
		banisterPart1.lineTo(0, height1 * scale);
		banisterPart1.arc(0, rad2 * scale, rad2 * scale, 1.5 * Math.PI, 0, true)
		banisterPart1.lineTo(rad1 * scale, (height1 + rad2) * scale);
		banisterPart1.arc(-rad1 * scale, 0, rad1 * scale, 0, 1.5 * Math.PI, true)
		banisterPart1.lineTo(poleSize * scale, (height1 + poleSize) * scale);
		banisterPart1.lineTo(poleSize * scale, height1 * scale);
		banisterPart1.lineTo(poleSize * scale, 0);
		banisterPart1.lineTo(0, 0);

		var banisterPart2 = new THREE.Shape();
		banisterPart2.moveTo(poleSize * scale, banisterLength * scale);
		banisterPart2.lineTo(poleSize * scale, (banisterLength - height1) * scale);
		banisterPart2.arc(0, -rad2 * scale, rad2 * scale, 0.5 * Math.PI, -Math.PI, true)
		banisterPart2.lineTo(-(rad1 - poleSize) * scale, (banisterLength - height1 - rad2) * scale);
		banisterPart2.arc(rad1 * scale, 0, rad1 * scale, -Math.PI, 0.5 * Math.PI, true)
		banisterPart2.lineTo(0 * scale, (banisterLength - height1 - poleSize) * scale);
		banisterPart2.lineTo(0 * scale, banisterLength * scale);

		var banisterShape = [banisterPart1, banisterPart2]

		var geom = new THREE.ExtrudeGeometry(banisterShape, banisterExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var banister = new THREE.Mesh(geom, railingMaterial);
		banister.position.x = basePoint[0];
		banister.position.y = basePoint[1];
		banister.position.z = basePoint[2];
		banister.castShadow = true;
		railingSection.add(banister);
		//stairCase.push(banister);


	}

	if (type == "bal_6") {
		var bagelWidth = 70;
		var bagelHeight = 140;

		var bagelShape = drawBagel(bagelWidth, bagelHeight, poleSize, scale);

		var geom = new THREE.ExtrudeGeometry(bagelShape, banisterExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		//бублик 1
		var bagel1 = new THREE.Mesh(geom, railingMaterial);
		bagel1.position.x = basePoint[0];
		bagel1.position.y = basePoint[1] - bagelHeight / 2 * scale + banisterLength / 2 * scale;
		bagel1.position.z = basePoint[2];
		bagel1.castShadow = true;
		railingSection.add(bagel1);
		//stairCase.push(bagel1);

		//бублик 2
		var bagel2 = new THREE.Mesh(geom, railingMaterial);
		bagel2.rotation.z = Math.PI;
		bagel2.position.x = basePoint[0];
		bagel2.position.y = basePoint[1] + bagelHeight / 2 * scale + banisterLength / 2 * scale;
		bagel2.position.z = basePoint[2];
		bagel2.castShadow = true;
		railingSection.add(bagel2);
		//stairCase.push(bagel2);

		//палка
		var poleGeometry = new THREE.BoxGeometry(poleSize * scale, banisterLength * scale, poleSize * scale);
		var pole = new THREE.Mesh(poleGeometry, railingMaterial);
		pole.position.x = basePoint[0];
		pole.position.y = basePoint[1] + banisterLength / 2 * scale;
		pole.position.z = basePoint[2] + poleSize / 2 * scale;
		pole.castShadow = true;
		railingSection.add(pole);
		//stairCase.push(pole);
	}

	if (type == "bal_7") {
		var bagelWidth = 70;
		var bagelHeight = 140;

		var bagelShape = drawBagel(bagelWidth, bagelHeight, poleSize, scale);

		var geom = new THREE.ExtrudeGeometry(bagelShape, banisterExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		//бублик 1
		var bagel1 = new THREE.Mesh(geom, railingMaterial);
		bagel1.position.x = basePoint[0];
		bagel1.position.y = basePoint[1] - bagelHeight / 2 * scale + banisterLength / 3 * scale;
		bagel1.position.z = basePoint[2];
		bagel1.castShadow = true;
		railingSection.add(bagel1);
		//stairCase.push(bagel1);

		//бублик 2
		var bagel2 = new THREE.Mesh(geom, railingMaterial);
		bagel2.rotation.z = Math.PI;
		bagel2.position.x = basePoint[0];
		bagel2.position.y = basePoint[1] + bagelHeight / 2 * scale + banisterLength / 3 * scale;
		bagel2.position.z = basePoint[2];
		bagel2.castShadow = true;
		railingSection.add(bagel2);
		//stairCase.push(bagel2);

		//бублик 3
		var bagel1 = new THREE.Mesh(geom, railingMaterial);
		bagel1.position.x = basePoint[0];
		bagel1.position.y = basePoint[1] - bagelHeight / 2 * scale + banisterLength * 2 / 3 * scale;
		bagel1.position.z = basePoint[2];
		bagel1.castShadow = true;
		railingSection.add(bagel1);
		//stairCase.push(bagel1);

		//бублик 4
		var bagel2 = new THREE.Mesh(geom, railingMaterial);
		bagel2.rotation.z = Math.PI;
		bagel2.position.x = basePoint[0];
		bagel2.position.y = basePoint[1] + bagelHeight / 2 * scale + banisterLength * 2 / 3 * scale;
		bagel2.position.z = basePoint[2];
		bagel2.castShadow = true;
		railingSection.add(bagel2);
		//stairCase.push(bagel2);



		//палка
		var poleGeometry = new THREE.BoxGeometry(poleSize * scale, banisterLength * scale, poleSize * scale);
		var pole = new THREE.Mesh(poleGeometry, railingMaterial);
		pole.position.x = basePoint[0];
		pole.position.y = basePoint[1] + banisterLength / 2 * scale;
		pole.position.z = basePoint[2] + poleSize / 2 * scale;
		pole.castShadow = true;
		railingSection.add(pole);
		//stairCase.push(pole);
	}

	if (type == "bal_8") {
		var bagelWidth = 50;
		var bagelHeight = 120;

		var bagelShape = drawBagel(bagelWidth, bagelHeight, poleSize, scale);

		var geom = new THREE.ExtrudeGeometry(bagelShape, banisterExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		//бублик 1

		var deltaX = bagelWidth * scale + bagelHeight * 0.5 * scale;
		var bagel1 = new THREE.Mesh(geom, railingMaterial);
		bagel1.position.x = basePoint[0] - deltaX
		bagel1.position.y = basePoint[1] - bagelHeight / 2 * scale + banisterLength / 2 * scale;
		bagel1.position.z = basePoint[2];
		bagel1.castShadow = true;
		railingSection.add(bagel1);
		//stairCase.push(bagel1);

		//бублик 2
		var bagel2 = new THREE.Mesh(geom, railingMaterial);
		bagel2.rotation.z = 0.75 * Math.PI;
		bagel2.position.x = basePoint[0] + bagelHeight * 1 * scale - deltaX
		bagel2.position.y = basePoint[1] + bagelHeight * 1.6 * scale - bagelHeight / 2 * scale + banisterLength / 2 * scale;
		bagel2.position.z = basePoint[2];
		bagel2.castShadow = true;
		railingSection.add(bagel2);
		//stairCase.push(bagel2);

		//бублик 3
		var bagel3 = new THREE.Mesh(geom, railingMaterial);
		bagel3.rotation.z = 1.25 * Math.PI;
		bagel3.position.x = basePoint[0] + bagelHeight * 0.3 * scale - deltaX
		bagel3.position.y = basePoint[1] + bagelHeight * 0.1 * scale - bagelHeight / 2 * scale + banisterLength / 2 * scale;
		bagel3.position.z = basePoint[2];
		bagel3.castShadow = true;
		railingSection.add(bagel3);
		//stairCase.push(bagel3);

		//бублик 4

		var deltaX = bagelWidth * scale + bagelHeight * 0.5 * scale;
		var bagel4 = new THREE.Mesh(geom, railingMaterial);
		bagel4.rotation.z = Math.PI;
		bagel4.position.x = basePoint[0] + bagelWidth * scale + bagelHeight * 0.5 * scale;
		bagel4.position.y = basePoint[1] + bagelHeight / 2 * scale + banisterLength / 2 * scale;
		bagel4.position.z = basePoint[2];
		bagel4.castShadow = true;
		railingSection.add(bagel4);
		//stairCase.push(bagel4);

		//бублик 5
		var bagel5 = new THREE.Mesh(geom, railingMaterial);
		bagel5.rotation.z = 0.25 * Math.PI;
		bagel5.position.x = basePoint[0] + bagelHeight * 0.65 * scale
		bagel5.position.y = basePoint[1] + bagelHeight * 0.9 * scale - bagelHeight / 2 * scale + banisterLength / 2 * scale;
		bagel5.position.z = basePoint[2];
		bagel5.castShadow = true;
		railingSection.add(bagel5);
		//stairCase.push(bagel5);

		//бублик 6
		var bagel6 = new THREE.Mesh(geom, railingMaterial);
		bagel6.rotation.z = -0.25 * Math.PI;
		bagel6.position.x = basePoint[0] - bagelHeight * 0.1 * scale
		bagel6.position.y = basePoint[1] - bagelHeight * 1.1 * scale + banisterLength / 2 * scale;
		bagel6.position.z = basePoint[2];
		bagel6.castShadow = true;
		railingSection.add(bagel6);
		//stairCase.push(bagel6);

		//шишка
		var bulbGeometry = new THREE.OctahedronGeometry(25 * scale, 0);
		var bulb = new THREE.Mesh(bulbGeometry, railingMaterial);
		bulb.rotation.y = Math.PI / 4;
		bulb.position.x = basePoint[0];
		bulb.position.y = basePoint[1] + banisterLength / 2 * scale;
		bulb.position.z = basePoint[2] + poleSize / 2 * scale;
		bulb.castShadow = true;
		railingSection.add(bulb);
		//stairCase.push(bulb);

		//палка
		var poleGeometry = new THREE.BoxGeometry(poleSize * scale, banisterLength * scale, poleSize * scale);
		var pole = new THREE.Mesh(poleGeometry, railingMaterial);
		pole.position.x = basePoint[0];
		pole.position.y = basePoint[1] + banisterLength / 2 * scale;
		pole.position.z = basePoint[2] + poleSize / 2 * scale;
		pole.castShadow = true;
		railingSection.add(pole);
		//stairCase.push(pole);
	}

	if (type == "bal_10" || type == "bal_11") {

		//палка
		var poleGeometry = new THREE.BoxGeometry(poleSize * scale, banisterLength * scale, poleSize * scale);
		var pole = new THREE.Mesh(poleGeometry, railingMaterial);
		pole.position.x = basePoint[0];
		pole.position.y = basePoint[1] + banisterLength / 2 * scale;
		pole.position.z = basePoint[2] + poleSize / 2 * scale;
		pole.castShadow = true;
		railingSection.add(pole);
		//stairCase.push(pole);
	}

	if (type == "bal_12") {
		/*волюта*/
		var radBottom = 65;
		var radTop = 65;
		var valutHeight = 400;
		var poleSize = 12
		var valutShape = drawValut(radBottom, radTop, valutHeight, poleSize, scale);

		var geom = new THREE.ExtrudeGeometry(valutShape, banisterExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		var dist = valutHeight - radBottom - radTop
		var angle = Math.atan((radBottom + radTop - poleSize) / dist);
		var valutHeightRotated = dist / Math.cos(angle) + radBottom + radTop;


		var valut1 = new THREE.Mesh(geom, railingMaterial);
		valut1.rotation.z = - angle;
		valut1.position.x = basePoint[0] - (radBottom - poleSize / 2) * scale;
		valut1.position.y = basePoint[1] + radBottom * (1 + Math.sin(angle)) * scale + (banisterLength - valutHeightRotated) * 0.5 * scale;
		valut1.position.z = basePoint[2];
		valut1.castShadow = true;
		railingSection.add(valut1);
		//stairCase.push(valut1);

		/*бублики*/
		var bagelWidth = 70;
		var bagelHeight = 120;
		var poleSize = 12
		var bagelShape = drawBagel(bagelWidth, bagelHeight, poleSize, scale);

		var geom = new THREE.ExtrudeGeometry(bagelShape, banisterExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		var bagel1 = new THREE.Mesh(geom, railingMaterial);
		bagel1.rotation.z = - angle;
		bagel1.position.x = basePoint[0] - bagelHeight / 2 * scale * Math.sin(angle);
		bagel1.position.y = basePoint[1] - bagelHeight / 2 * scale * Math.cos(angle) + banisterLength / 2 * scale;
		bagel1.position.z = basePoint[2];
		bagel1.castShadow = true;
		railingSection.add(bagel1);
		//stairCase.push(bagel1);

		var bagel2 = new THREE.Mesh(geom, railingMaterial);
		bagel2.rotation.z = Math.PI - angle;
		bagel2.position.x = basePoint[0] + bagelHeight / 2 * scale * Math.sin(angle);
		bagel2.position.y = basePoint[1] + bagelHeight / 2 * scale * Math.cos(angle) + banisterLength / 2 * scale;
		bagel2.position.z = basePoint[2];
		bagel2.castShadow = true;
		railingSection.add(bagel2);
		//stairCase.push(bagel2);

		/*окончания*/
		var length = (banisterLength - valutHeightRotated) * 0.5;
		var poleGeometry = new THREE.BoxGeometry(poleSize * scale, length * scale, poleSize * scale);
		var pole = new THREE.Mesh(poleGeometry, railingMaterial);
		pole.position.x = basePoint[0];
		pole.position.y = basePoint[1] + length / 2 * scale;
		pole.position.z = basePoint[2] + poleSize / 2 * scale;
		pole.castShadow = true;
		railingSection.add(pole);
		//stairCase.push(pole);

		var pole = new THREE.Mesh(poleGeometry, railingMaterial);
		pole.position.x = basePoint[0];
		pole.position.y = basePoint[1] + 1.5 * length * scale + valutHeightRotated * scale;
		pole.position.z = basePoint[2] + poleSize / 2 * scale;
		pole.castShadow = true;
		railingSection.add(pole);
		//stairCase.push(pole);


	}

	if (type == "bal_13") {
		/*волюта*/
		var radBottom = 55;
		var radTop = 25;
		var valutHeight = 300;
		var poleSize = 12
		var valutShape = drawValut(radBottom, radTop, valutHeight, poleSize, scale);

		var geom = new THREE.ExtrudeGeometry(valutShape, banisterExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));

		var angle = 26 / 180 * Math.PI;
		var valutHeightRotated = 445;

		var valut1 = new THREE.Mesh(geom, railingMaterial);
		valut1.rotation.z = 0 - angle;
		valut1.position.x = basePoint[0] - (radBottom - poleSize / 2) * scale;
		valut1.position.y = basePoint[1] + radBottom * (1 + Math.sin(angle)) * scale + (banisterLength - valutHeightRotated) * 0.5 * scale;
		valut1.position.z = basePoint[2];
		valut1.castShadow = true;
		railingSection.add(valut1);
		//stairCase.push(valut1);

		var valut2 = new THREE.Mesh(geom, railingMaterial);
		valut2.rotation.z = Math.PI - angle;
		valut2.position.x = basePoint[0] + 99 * scale - (radBottom - poleSize / 2) * scale;
		valut2.position.y = basePoint[1] + 290 * scale + radBottom * (1 + Math.sin(angle)) * scale + (banisterLength - valutHeightRotated) * 0.5 * scale;
		valut2.position.z = basePoint[2];
		valut2.castShadow = true;
		railingSection.add(valut2);
		//stairCase.push(valut2);

		/*окончания*/

		var length = (banisterLength - valutHeightRotated) * 0.5;
		var poleGeometry = new THREE.BoxGeometry(poleSize * scale, length * scale, poleSize * scale);
		var pole = new THREE.Mesh(poleGeometry, railingMaterial);
		pole.position.x = basePoint[0];
		pole.position.y = basePoint[1] + length / 2 * scale;
		pole.position.z = basePoint[2] + poleSize / 2 * scale;
		pole.castShadow = true;
		railingSection.add(pole);
		//stairCase.push(pole);

		var pole = new THREE.Mesh(poleGeometry, railingMaterial);
		pole.position.x = basePoint[0];
		pole.position.y = basePoint[1] + 1.5 * length * scale + valutHeightRotated * scale;
		pole.position.z = basePoint[2] + poleSize / 2 * scale;
		pole.castShadow = true;
		railingSection.add(pole);
		//stairCase.push(pole);


	}

	//сохраняем данные для спецификации
	var partName = "forgedBal";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt1: 0,
				amt2: 0,
				name: "Кованая балясина",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "Ограждения",
			}
		}

		var name = type;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		if (specObj.unit != "banister") {
			if (type == params.banister1) specObj[partName]["amt1"] += 1;
			if (params.banister2 != params.banister1 && type == params.banister2) specObj[partName]["amt2"] += 1;
		}
		if (specObj.unit == "banister") {
			if (type == params.banister1_bal) specObj[partName]["amt1"] += 1;
			if (params.banister2_bal != params.banister1_bal && type == params.banister2_bal) specObj[partName]["amt2"] += 1;
		}
	}
	railingSection.specId = partName + name;

	return railingSection;

}

/**
 * Функиця отрисовывает часть поручня с скошенными углами
 * @param {object} par
 */

 //Pole_5
function drawHandrailPorfile_4(par) {
	// par.startAngle = Math.PI / 2;
	// par.endAngle = Math.PI / 2;
	// par.startAngle = -Math.PI / 4;//-Math.PI;
	// par.angleEnd = -Math.PI / 4;//-Math.PI;

	var extrudeOptions = {
		amount: par.poleProfileY,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var p0 = {
		x: 0,
		y: 0
	};
	var p00 = newPoint_xy(p0, par.length, 0);

	var p1 = newPoint_xy(p0, par.profWidth * Math.tan(par.startAngle) / 2, -par.profWidth / 2);
	var p2 = newPoint_xy(p1, -par.profWidth * Math.tan(par.startAngle), par.profWidth);
	var p4 = newPoint_xy(p00, -par.profWidth * Math.tan(par.endAngle) / 2, -par.profWidth / 2);
	var p3 = newPoint_xy(p4, par.profWidth * Math.tan(par.endAngle), par.profWidth);

	var shape = new THREE.Shape();
	addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p4, p1, par.dxfBasePoint);

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var pole = new THREE.Mesh(geom, par.material);
	pole.rotation.x = Math.PI / 2;
	pole.position.y = par.profHeight;
	pole.position.z = -50;//par.profWidth / 2;
	par.mesh.add(pole);

	var leftX = Math.min(p1.x, p2.x)
	var rightX = Math.max(p3.x, p4.x)

	par.len1 = distance(p2, p3);
	par.len2 = distance(p4, p1);

	//добавляем шейп в глобальный массив для последующего образмеривания
	if(typeof shapesList != "undefined" && par.drawing) {
		shape.drawing = par.drawing;
		shape.drawing.baseLine = {p1: p1, p2: p4};

		var angStart = par.poleAngle + par.startAngle;
		var angEnd = par.poleAngle + par.endAngle;

		if (Math.abs(par.startAngle) !== 0) {
			shape.drawing.startAngle = {center: copyPoint(p2)};

			var len = 160;

			var angP1 = polar(p2, -angStart, len);
			var angP2 = polar(p2, par.poleAngle + Math.PI / 2, -len);

			shape.drawing.startAngle.p1 = angP2;
			shape.drawing.startAngle.p2 = angP1;

			if (par.startAngle < 0) {

				shape.drawing.startAngle.center = copyPoint(p1);
				var angP1 = polar(p1, -angStart, len);
				var angP2 = polar(p1, par.poleAngle + Math.PI / 2, len);

				shape.drawing.startAngle.p1 = angP2;
				shape.drawing.startAngle.p2 = angP1;
			}
		}

		if (Math.abs(par.endAngle) !== 0) {
			shape.drawing.endAngle = {center: copyPoint(p4)};

			var len = 160;
			var angP1 = polar(p4, angEnd, -len);
			var angP2 = polar(p4, par.poleAngle + Math.PI / 2, len);

			shape.drawing.endAngle.p1 = angP1;
			shape.drawing.endAngle.p2 = angP2;

			if (par.endAngle > 0) {

				shape.drawing.endAngle.center = copyPoint(p3);

				var angP1 = polar(p3, angEnd, -len);
				var angP2 = polar(p3, par.poleAngle + Math.PI / 2, -len);

				shape.drawing.endAngle.p1 = angP2;
				shape.drawing.endAngle.p2 = angP1;
			}
		}

		shapesList.push(shape);
	}

	//параметры поручня
	var handrailPar = {
		prof: params.handrailProf,
		sideSlots: params.handrailSlots,
		handrailType: params.handrail,
		metalPaint: params.metalPaint_railing,
		timberPaint: params.timberPaint_perila,
		handrailColor: params.handrailColor,
	}
	if (par.unit == "balustrade") {
		var handrailPar = {
			prof: params.handrailProf_bal,
			sideSlots: params.handrailSlots_bal,
			handrailType: params.handrail_bal,
			metalPaint: params.metalPaint_bal,
			timberPaint: params.timberPaint_bal,
			handrailColor: params.handrailColor_bal,
		}
	}
	handrailPar = calcHandrailMeterParams(handrailPar); //функция в файле priceLib.js

	//сохраняем данные для спецификации
	var partName = "handrails";
	if (typeof specObj != 'undefined' && partName) {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				name: "Поручень",
				metalPaint: (handrailPar.mat == "metal"),
				timberPaint: (handrailPar.mat == "timber"),
				division: handrailPar.mat,
				workUnitName: "amt",
				group: "handrails",
				type_comments: {}
			}
		}

		var name = Math.round(par.profWidth) + "x" + Math.round(par.profHeight) + "х" + Math.round(par.length);
		if (par.type == "round") name = "Ф" + Math.round(par.profHeight) + "х" + Math.round(par.length);
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["sumLength"] += Math.round(par.length) / 1000;
	}
	par.mesh.specId = partName + name;


	//сохраняем данные для ведомости деталей

	if (typeof poleList != 'undefined') {
		var boardType = par.width + "х" + par.height + " алюм.";

		//формируем массив, если такого еще не было
		if (!poleList[boardType]) poleList[boardType] = [];
		var polePar = {
			len1: Math.round(par.len1),
			len2: Math.round(par.len2),
			angStart: Math.round(par.angleStart * 180 / Math.PI * 10) / 10,
			angEnd: Math.round(-par.angleEnd * 180 / Math.PI * 10) / 10,
			cutOffsetStart: Math.round(par.width * Math.tan(par.angleStart)),
			cutOffsetEnd: Math.round(par.width * Math.tan(-par.angleEnd)),
			poleProfileY: par.width,
			poleProfileZ: par.height,
		}

		//максимальная длина палки
		polePar.len3 = polePar.len1;
		if (polePar.cutOffsetStart < 0) polePar.len3 += -polePar.cutOffsetStart;
		if (polePar.cutOffsetEnd > 0) polePar.len3 += polePar.cutOffsetEnd;

		polePar.text = par.sectText + " поручень";
		polePar.description = [];
		polePar.description.push(polePar.text);
		polePar.amt = 1;

		// poleList[boardType].push(polePar);
		var partIndex = poleList[boardType].push(polePar);
		polePar.partIndex = partIndex;
		if(par.drawing) shape.drawing.partIndex = partIndex;

	}

	return par;
}

function drawHandrail_4(par) {

	//адаптация для отрисовки пристенных поручней
	if (!par.startAngle && par.startAngle !== 0) par.startAngle = Math.PI / 2;
	if (!par.endAngle && par.endAngle !== 0) par.endAngle = Math.PI / 2;
	if (!par.fixType) par.fixType = "кронштейны";
	if (!par.poleAngle) par.poleAngle = 0;
	if (!par.dxfArr) par.dxfArr = dxfPrimitivesArr;
	if (!par.dxfBasePoint) {
		par.dxfBasePoint = { x: 0, y: 0 };
		par.dxfArr = [];
	}

	par.mesh = new THREE.Object3D();
	par.wallOffset = 50; //расстояние от стены до оси поручня
	par.holderHeight = 50; //высота кронштейна от оси до лодочки
	par.holderEndOffset = 70; //расстояние от кронштейна до конца поручня
	par.holderMaxDist = 800; //максимальное расстояние между кронштейнами

	//параметры поручня
	var handrailPar = {
		prof: params.handrailProf,
		sideSlots: params.handrailSlots,
		handrailType: params.handrail,
		metalPaint: params.metalPaint_railing,
		timberPaint: params.timberPaint_perila,
	}
	if (par.unit == "balustrade") {
		var handrailPar = {
			prof: params.handrailProf_bal,
			sideSlots: params.handrailSlots_bal,
			handrailType: params.handrail_bal,
			metalPaint: params.metalPaint_railing,
			timberPaint: params.timberPaint_perila_bal,
		}
	}
	if(params.calcType == "railing"){
		var handrailPar = {
			prof: params.handrailProf,
			sideSlots: params.handrailSlots,
			handrailType: params.handrail,
			metalPaint: params.metalPaint_railing,
			timberPaint: params.timberPaint_perila,
		}
	}

	
	handrailPar = calcHandrailMeterParams(handrailPar); //функция в файле priceLib.js

	par.profHeight = handrailPar.profY;
	par.profWidth = handrailPar.profZ;
	par.type = handrailPar.handrailModel;
	par.poleMaterial = params.materials.metal_railing;
	if (handrailPar.mat == "timber") par.poleMaterial = params.materials.handrail;
	if (handrailPar.mat == "inox") par.poleMaterial = params.materials.inox;

	if (par.cutBasePlane == 'top') return drawHandrailPorfile_4(par);

	//поручень
	//рассчитываем абсолютные углы
	var angStart = par.poleAngle + par.startAngle;
	var angEnd = par.poleAngle + par.endAngle;
	var startCutLen = par.profHeight / Math.sin(par.startAngle)
	var endCutLen = par.profHeight / Math.sin(par.endAngle)

	var p0 = { x: 0, y: 0 };
	//круглый поручень строится по оси
	if (par.type == "round") p0 = polar(p0, par.poleAngle + Math.PI / 2, -par.profHeight / 2);
	var p1 = polar(p0, angStart, startCutLen);
	var p2 = polar(p1, par.poleAngle, par.length);
	var p3 = polar(p2, angEnd, -endCutLen);

	var shape = new THREE.Shape();
	addLine(shape, par.dxfArr, p0, p1, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p3, p0, par.dxfBasePoint);

	//добавляем шейп в глобальный массив для последующего образмеривания
	if(typeof shapesList != "undefined" && par.drawing) {
		shape.drawing = par.drawing;

		shape.drawing.startCutX = p0.x - p1.x;
		shape.drawing.endCutX = p3.x - p2.x;

		shape.drawing.baseLine = {p1: p0, p2: p3};
		if (Math.abs(par.startAngle) !== Math.PI / 2) {
			shape.drawing.startAngle = {center: copyPoint(p0)};

			var len = Math.abs(startCutLen) + 130;
			var angP1 = polar(p0, angStart, -len);
			var angP2 = polar(p0, par.poleAngle + Math.PI / 2, -len * Math.sin(angStart));

			shape.drawing.startAngle.p1 = angP2;
			shape.drawing.startAngle.p2 = angP1;

			if (Math.abs(par.startAngle) < Math.PI / 2) {
				var len = Math.abs(startCutLen) + 130;
				shape.drawing.startAngle.center = copyPoint(p1);
				var angP1 = polar(p1, angStart, len);
				var angP2 = polar(p1, par.poleAngle + Math.PI / 2, len * Math.sin(angStart));

				shape.drawing.startAngle.p1 = angP1;
				shape.drawing.startAngle.p2 = angP2;
			}
		}

		if (Math.abs(par.endAngle) !== Math.PI / 2) {
			shape.drawing.endAngle = {center: copyPoint(p3)};

			var len = Math.abs(endCutLen) + 130;
			var angP1 = polar(p3, angEnd, len);
			var angP2 = polar(p3, par.poleAngle + Math.PI / 2, len * Math.sin(angEnd));

			shape.drawing.endAngle.p1 = angP1;
			shape.drawing.endAngle.p2 = angP2;

			if (par.endAngle < Math.PI / 2) {
				shape.drawing.endAngle.center = copyPoint(p2);

				var angP1 = polar(p2, angEnd, -len);
				var angP2 = polar(p2, par.poleAngle + Math.PI / 2, -len * Math.sin(angEnd));

				shape.drawing.endAngle.p1 = angP2;
				shape.drawing.endAngle.p2 = angP1;
			}
		}

		shapesList.push(shape);
	}

	par.len = par.length;
	par.len2 = distance(p3, p0)

	if (par.type == "rect") {
		var extrudeOptions = {
			amount: par.profWidth,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		}
		if(params.stairType == "массив") setBevels(extrudeOptions)

		var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		geometry.rotateUV(-par.poleAngle);
		var pole = new THREE.Mesh(geometry, par.poleMaterial);
		pole.userData.angle = par.poleAngle;
		pole.position.z = par.wallOffset - par.profWidth / 2;
		if (par.side == "in") pole.position.z = -par.wallOffset - par.profWidth / 2;
		par.mesh.add(pole);
	}

	if (par.type == "round") {
		var pos = { x: 0, y: 0, }
		//pos = polar(pos, par.poleAngle + Math.PI/2, par.profHeight/2)
		pos = polar(pos, par.poleAngle, par.length / 2)
		var geometry = new THREE.CylinderGeometry(par.profHeight / 2, par.profHeight / 2, par.length, 30, 1, false);
		var pole = new THREE.Mesh(geometry, par.poleMaterial);
		pole.userData.angle = par.poleAngle;
		pole.rotation.z = Math.PI / 2 + par.poleAngle;
		pole.position.x = pos.x;
		pole.position.y = pos.y
		pole.position.z = par.wallOffset;
		if (par.side == "in") pole.position.z = -par.wallOffset;

		if (par.fixType == "кронштейны") {
			pole.position.z = par.wallOffset;
			if (par.side == "in") pole.position.z = -par.wallOffset;
		}

		par.mesh.add(pole);
	}

	//Силикон
	if (par.hasSilicone) {
		var siliconePar = {
			description: "Крепление поручней",
			group: "Ограждения",
			len: par.len2,
		}

		var silicone = drawSilicone(siliconePar).mesh;
		var silicone_pos = polar(p0, par.poleAngle, siliconePar.len / 2);
		silicone.position.x = silicone_pos.x;
		silicone.position.y = silicone_pos.y;

		silicone.rotation.z = par.poleAngle + Math.PI / 2;
		silicone.position.z = par.wallOffset - par.profWidth / 2;
		if (par.side == "in") silicone.position.z = -par.wallOffset - par.profWidth / 2;
		par.mesh.add(silicone);
	}

	//кронштейны
	if (par.fixType == "кронштейны") {
		par.holderMaterial = params.materials.inox;
		if (params.sideHandrailHolders == "крашеные") par.holderMaterial = params.materials.metal;
		var holderAmt = Math.ceil((par.length - 2 * par.holderEndOffset) / par.holderMaxDist) + 1;
		if (holderAmt < 2) holderAmt = 2;
		var holderDst = (par.length - 2 * par.holderEndOffset) / (holderAmt - 1);

		var holderParams = {
			wallOffset: par.wallOffset,
			height: par.holderHeight,
			dxfArr: dxfPrimitivesArr0,
			dxfBasePoint: { x: 0, y: 0 },
			material: par.holderMaterial,
			isGlassHandrail: par.isGlassHandrail,
		}
		var pos0 = polar(p0, par.poleAngle + Math.PI / 2, -holderParams.height)

		for (var i = 0; i < holderAmt; i++) {
			holderParams = drawWallHandrailHolder(holderParams);
			var holder = holderParams.mesh;
			holder.rotation.z = par.poleAngle
			pos = polar(pos0, par.poleAngle, par.holderEndOffset + holderDst * i);
			holder.position.set(pos.x, pos.y, 0)
			if (par.side == "in") {
				holder.rotation.y = Math.PI;
				holder.rotation.z = -par.poleAngle
			}
			par.mesh.add(holder);
		}

		par.holderAmt = holderAmt;
	}

	if ((par.startPlug || par.endPlug) &&
		(handrailPar.mat == 'metal' || handrailPar.mat == 'inox' || handrailPar.handrailType == 'ПВХ')) {
		var plugParams = {
			id: handrailPar.handrailPlugId,
			width: handrailPar.profY,
			height: handrailPar.profZ,
			description: "Заглушка поручня",
			group: "Ограждения"
		}
		if ((params.handrailMaterial == 'ПВХ' || handrailPar.handrailType == 'ПВХ') && par.partName !== "spiralRigel") {
			var plugParams = {
				id: "stainlessPlug_pvc",
				width: 50,
				height: 50,
				description: "Заглушка поручня",
				group: "Поручни",
				isCirclePlug: true,
				type: "inox",
			}
		}
		if (handrailPar.mat == 'inox') plugParams.type = "inox";
		if (params.handrailMaterial == 'ПВХ') plugParams.type = "ПВХ";

		if(handrailPar.handrailType == "Ф50 нерж.") plugParams.isCirclePlug = true;

		//var zOffset = -par.wallOffset;
		//if (par.side == 'out') zOffset = par.wallOffset;
		var zOffset = par.wallOffset;
		if (par.side == 'in') zOffset = -par.wallOffset;
		

		if (par.startPlug) {
			var plugBasePoint = polar(p1, par.poleAngle + Math.PI / 2, -handrailPar.profY / 2);
			var startPlug = drawPlug(plugParams);
			startPlug.position.x = plugBasePoint.x;
			startPlug.position.y = plugBasePoint.y;
			startPlug.position.z = zOffset;
			startPlug.rotation.z = par.poleAngle + Math.PI / 2;
			if(!testingMode) par.mesh.add(startPlug);
		}

		if (par.endPlug) {
			var plugBasePoint = p2;//newPoint_xy(p1, length, 0)
			plugBasePoint = polar(plugBasePoint, par.poleAngle + Math.PI / 2, -handrailPar.profY / 2);
			var endPlug = drawPlug(plugParams);
			endPlug.position.x = plugBasePoint.x;
			endPlug.position.y = plugBasePoint.y;
			endPlug.position.z = zOffset;
			endPlug.rotation.z = par.poleAngle + Math.PI / 2;
			if(!testingMode) par.mesh.add(endPlug);
		}

	}


	//сохраняем данные для спецификации
	var partName = "handrails";
	if (par.partName) partName = par.partName; //используется для sideHandrails
	if (typeof specObj != 'undefined' && partName) {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				name: "Поручень",
				metalPaint: (handrailPar.mat == "metal"),
				timberPaint: (handrailPar.mat == "timber"),
				division: handrailPar.mat,
				workUnitName: "amt",
				group: "handrails",
				type_comments: {}
			}
			if (handrailPar.mat == "inox") specObj[partName].division = "metal";
			//if(params.calcType == "timber") specObj[partName].name = "Поручень";
			if (par.partName == "botPole") specObj[partName].name = "Подбалясная рейка";
		}

		var name = Math.round(par.profWidth) + "x" + Math.round(par.profHeight) + "х" + Math.round(par.length);
		if (par.type == "round") name = "Ф" + Math.round(par.profHeight) + "х" + Math.round(par.length);
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["sumLength"] += Math.round(par.length) / 1000;

		if (partName == "handrails" || partName == 'sideHandrails') {
			var prot = 'нет';
			if (params.handrailSlots == 'да' && par.unit !== "balustrade") prot = 'есть';
			if (params.handrailSlots_bal == 'да' && par.unit == "balustrade") prot = 'есть';
			specObj[partName]["type_comments"][name] = "Сторона " + (par.side == 'out' ? 'внешняя' : 'внутренняя');
			if (par.unit == "balustrade") specObj[partName]["type_comments"][name] = 'Баллюстрада'
			if (par.marshId) specObj[partName]["type_comments"][name] = "Марш " + getMarshParams(par.marshId).marshName + "; Сторона " + (par.side == 'out' ? 'внешняя' : 'внутренняя');
			specObj[partName]["type_comments"][name] += "; Проточки по бокам: " + prot;
		}
	}
	par.mesh.specId = partName + name;

	if (par.hasFixings) {
		var screwPar = {
			id: "screw_8x120",
			description: "Крепление поручней к столбу",
			group: "Ограждения",
			hasShim: true
		}
		var rackSize = 95;

		var screw = drawScrew(screwPar).mesh;
		screw.rotation.z = -Math.PI / 2;
		screw.position.x = p0.x - 60 + (120 - rackSize) - 0.5;
		screw.position.y = p0.y + startCutLen / 2;
		screw.position.z = rackSize / 2;
		if (par.marshId == 2 && params.stairModel == 'П-образная с площадкой' && par.side == 'in') screw.position.z *= -1;
		if(!testingMode)	par.mesh.add(screw);

		var plug = drawTimberPlug(25);
		plug.rotation.z = -Math.PI / 2;
		plug.position.x = p0.x - 60 - 60 + (120 - rackSize) - 1 - 0.5;
		plug.position.y = p0.y + startCutLen / 2;
		plug.position.z = rackSize / 2;
		if (par.marshId == 2 && params.stairModel == 'П-образная с площадкой' && par.side == 'in') plug.position.z *= -1;
		if(!testingMode)	par.mesh.add(plug);

		var screw = drawScrew(screwPar).mesh;
		screw.rotation.z = Math.PI / 2
		screw.position.x = p2.x + 60 - (120 - rackSize) + 0.5;
		screw.position.y = p2.y - endCutLen / 2;
		screw.position.z = rackSize / 2;
		if (par.marshId == 2 && params.stairModel == 'П-образная с площадкой' && par.side == 'in') screw.position.z *= -1;
		if(!testingMode)	par.mesh.add(screw);

		var plug = drawTimberPlug(25);
		plug.rotation.z = Math.PI / 2
		plug.position.x = p2.x + 120 - (120 - rackSize) + 1 + 0.5;
		plug.position.y = p2.y - endCutLen / 2;
		plug.position.z = rackSize / 2;
		if (par.marshId == 2 && params.stairModel == 'П-образная с площадкой' && par.side == 'in') plug.position.z *= -1;
		if(!testingMode)	par.mesh.add(plug);
	}

	//сохраняем данные для ведомости заготовок
	if(!par.sectText) par.sectText = "";
	if (typeof poleList != 'undefined') {
		var boardType = handrailPar.profY + "х" + handrailPar.profZ;
		if (par.type == "round") boardType = "Ф" + handrailPar.profY;

		if (handrailPar.mat == "metal") boardType += " черн.";
		if (handrailPar.mat == "inox") boardType += " нерж.";
		if (handrailPar.mat == "timber") boardType += " " + params.handrailsMaterial;


		//формируем массив, если такого еще не было
		if (!poleList[boardType]) poleList[boardType] = [];
		var polePar = {
			len1: Math.round(par.len),
			len2: Math.round(par.len2),
			angStart: Math.round((par.startAngle - Math.PI / 2) * 180 / Math.PI * 10) / 10,
			angEnd: Math.round((par.endAngle - Math.PI / 2) * 180 / Math.PI * 10) / 10,
			cutOffsetStart: Math.round(handrailPar.profY * Math.tan(par.startAngle - Math.PI / 2)),
			cutOffsetEnd: Math.round(handrailPar.profY * Math.tan(par.endAngle - Math.PI / 2)),
			poleProfileY: handrailPar.profY,
			poleProfileZ: handrailPar.profZ,
		}
		//пересчитываем углы
		if (startCutLen < 0) polePar.angStart = Math.round((polePar.angStart + 180) * 10) / 10;
		if (endCutLen < 0) angEnd += 180;
		//максимальная длина палки
		polePar.len3 = polePar.len1;
		if (polePar.cutOffsetStart < 0) polePar.len3 += -polePar.cutOffsetStart;
		if (polePar.cutOffsetEnd > 0) polePar.len3 += polePar.cutOffsetEnd;
		if (par.type == "round") {
			polePar = {
				len1: Math.round(par.len),
				len2: Math.round(par.len),
				len3: Math.round(par.len),
				angStart: 0,
				angEnd: 0,
				cutOffsetStart: 0,
				cutOffsetEnd: 0,
				poleProfileY: handrailPar.profY,
				poleProfileZ: handrailPar.profZ,
			}
		}

		if (par.startChamfer) polePar.startChamfer = par.startChamfer;
		if (par.endChamfer) polePar.endChamfer = par.endChamfer;

		polePar.text = par.sectText + " поручень";

		var text = "";

		var prot = 'нет';
		if (params.handrailSlots == 'да' && par.unit !== "balustrade") prot = 'есть';
		if (params.handrailSlots_bal == 'да' && par.unit == "balustrade") prot = 'есть';
		text = "Сторона " + (par.side == 'out' ? 'внешняя' : 'внутренняя');
		if (par.unit == "balustrade") specObj[partName]["type_comments"][name] = 'Баллюстрада'
		if (par.marshId) text = "Марш " + getMarshParams(par.marshId).marshName + "; Сторона " + (par.side == 'out' ? 'внешняя' : 'внутренняя');
		text += "; Проточки по бокам: " + prot;

		polePar.description = [];
		polePar.description.push(polePar.text + "; " + text);
		polePar.amt = 1;
		polePar.material = calcHandrailMeterParams({handrailType: params.handrail}).mat;
		if (par.unit == 'balustrade') polePar.material = calcHandrailMeterParams({handrailType: params.handrail_bal}).mat;

		var partIndex = poleList[boardType].push(polePar);
		polePar.partIndex = partIndex;
		if(shape.drawing) shape.drawing.partIndex = partIndex;
	}

	return par;
}//end of drawHandrail_4


/** функция отрисовывает прямую балясину со вставками в виде мэшей
	par = {
		insetAmt: 2, - кол-во вставок
		type: "timber" || "forge", - тпи балясины
		insetName: "bulb" "basket" - имя вставки
	}

	*/

function drawMeshBal(par) {
	if (!par.topEnd) par.topEnd = "rect";
	if (!par.botEnd) par.botEnd = "rect";

	if (par.type == "forge") {
		if (!par.len) par.len = 800;
		par.insetLen = 70;
		if (par.insetName == "bulb") par.insetLen = 60;
		if (par.insetName == "screw") par.insetLen = 400;
		if (par.insetName == "screw_sm") par.insetLen = 200;
		var poleSize = 12;
	}
	if (par.type == "timber") {
		par.len = 900;
		par.insetLen = 600;
		var poleSize = 50;
	}

	if (par.type == "timberNewell") {
		par.len = 1100;
		par.insetLen = 700;
		var poleSize = 100;
	}

	var poleLen = (par.len - par.insetLen * par.insetAmt) / (par.insetAmt + 1);
	var profPar = {
		type: "rect",
		poleProfileY: poleSize,
		poleProfileZ: poleSize,
		length: poleLen,
		poleAngle: Math.PI / 2,
		material: params.materials.metal_railing,
		dxfBasePoint: { x: 0, y: 0 },
		dxfArr: [], //профиль не выводим в dxf
	};
	if (par.type == "timber" || par.type == "timberNewell") profPar.material = params.materials.banister;

	var complexObj = new THREE.Object3D();
	for (var i = 0; i <= par.insetAmt; i++) {
		//палка
		if (i == 0) profPar.type = par.botEnd;
		if (i == par.insetAmt) profPar.type = par.topEnd;
		if (profPar.type == "round") profPar.poleProfileY = 25;
		// if (par.drawing && i == 0) {
		// 	profPar.drawing = Object.assign({}, par.drawing);
		// 	profPar.drawing.pos = newPoint_xy(par.drawing.pos, 0, (poleLen + par.insetLen) * i);
		// }
		var pole = drawPole3D_4(profPar).mesh;
		pole.position.x = profPar.poleProfileY / 2;
		pole.position.y = (poleLen + par.insetLen) * i;
		pole.position.z = -profPar.poleProfileY / 2;
		complexObj.add(pole);

		//вставка
		if (i < par.insetAmt) {
			var insetPar = {
				type: par.type,
				name: par.insetName,
				obj: complexObj,
				basePoint: {
					x: 0,
					y: (poleLen + par.insetLen) * (i + 1),
					z: 0,
				}
			}
			if (par.type == "timber" || par.type == "timberNewell") {
				insetPar.basePoint.y -= par.insetLen;
				insetPar.basePoint.x -= poleSize / 2;
				insetPar.basePoint.z -= poleSize / 2;

			}
			drawMeshInset(insetPar);
		}
	}
	if(par.drawing && par.drawing.group == 'timber_railing'){
		var fakeShape = new THREE.Shape();
		fakeShape.drawing = Object.assign({}, par.drawing);
		fakeShape.drawing.botLen = par.len - 740;
		fakeShape.drawing.pos = newPoint_xy(fakeShape.drawing.pos, 12 / 2, par.len - 740);//740 / 2 + botLen + 72.9);
		fakeShape.drawing.svg = true;
		fakeShape.drawing.banisterType = par.banisterType;
		shapesList.push(fakeShape);
	}
	return complexObj;
} //drawMeshBal

/** функция возвращает вставку балясины, загруженную из файла в виде мэша
*/

function drawMeshInset(par) {
	var url = "/dev/rodionov/forge/banisters/" + par.name + ".json";
	if (params.calcType == "railing") url = "/images/forge/" + par.name + ".json";
	if (par.type == "timber") url = "/images/timberBal/json/" + par.name + ".json";
	if (par.type == "timberNewell") url = "/images/timberNewell/json/" + par.name + ".json";
	if (par.type == "startNewell") url = "/images/startNewell/json/" + par.name + ".json";

	var loader = new THREE.ObjectLoader();
	loader.load(url, function (mesh) {
		mesh.material = params.materials.metal_railing;
		if (par.type == "timber" || par.type == "timberNewell" || par.type == "startNewell") mesh.material = params.materials.banister;
		if (par.material) mesh.material = par.material;
		mesh.position.x = par.basePoint.x;
		mesh.position.y = par.basePoint.y;
		if (par.name == "bulb") mesh.position.y += 10;
		mesh.position.z = par.basePoint.z;
		if (par.basePoint.rot) mesh.rotation.y = par.basePoint.rot;
		if (par.type == "timberNewell") {
			var rackSize = 95;
			if (params.rackSize) rackSize = params.rackSize;
			mesh.scale.x = mesh.scale.z = rackSize / 100;
			mesh.userData.type = 'timberNewell';
		}
		mesh.setLayer("railing");
		par.obj.add(mesh)
	});



	if (par.type == "startNewell") {
		//сохраняем данные для спецификации
		var partName = "startNewell";
		if (typeof specObj != 'undefined') {
			if (!specObj[partName]) {
				specObj[partName] = {
					types: {},
					amt: 0,
					name: "Стартовый столб",
					metalPaint: false,
					timberPaint: true,
					division: "timber",
					workUnitName: "amt",
					group: "newells",
				}
			}
			if (specObj[partName]["types"][par.name]) specObj[partName]["types"][par.name] += 1;
			if (!specObj[partName]["types"][par.name]) specObj[partName]["types"][par.name] = 1;
			specObj[partName]["amt"] += 1;
		}
		par.obj.specId = partName + par.name;
	}

} //end of drawMeshInset
