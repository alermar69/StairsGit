/**функция отрисовки больцев
*/
function drawBolzs(par) {

	par.mesh = new THREE.Object3D();

	//параметры марша
	var marshPar = getMarshParams(par.marshId);

	//var parRacks = { marshId: par.marshId, racks: [] }
	var racks = calcRacksBolzs({ marshId: par.marshId }).racks;

	var isRaling = marshPar.hasRailing.in;
	//if (params.stairModel == "Прямая") isRaling = marshPar.hasRailing.in;


	par.a = marshPar.a;
	par.b = marshPar.b;
	par.h = marshPar.h;
	par.stairAmt = marshPar.stairAmt;

	var bolzProfile = 40;

	var offsetX = (params.nose - bolzProfile) / 2;
	var offsetZ = 10;

	var bolzPar = {
		marshId: par.marshId,
		dxfBasePoint: par.dxfBasePoint,
		h: par.h,
		bolzProfile: bolzProfile,
		isTurn: false,
		isPlateTread: true,
		isRack: false,
	}

	var countBolz = par.stairAmt;
	if (marshPar.topTurn !== 'пол') countBolz += 1;

	for (var i = 0; i < countBolz; i++) {
		bolzPar.isRack = false;
		bolzPar.isTurn = false;
		bolzPar.isTurnLastBolz = false;
		bolzPar.isFirst = false;

		var z = offsetZ * turnFactor;
		if (params.stairModel !== "Прямая") z = -offsetZ * turnFactor;
		if (params.stairModel == "Прямая" && turnFactor == -1) z -= bolzProfile;
		if (params.stairModel !== "Прямая" && turnFactor == 1) z -= bolzProfile;

		var indexRack = racks.findIndex(rack => rack.y == par.h * (i + 1) && !rack.noDraw);
		if (indexRack != -1) {
			bolzPar.isRack = true;

			if (marshPar.topTurn == 'пол' && indexRack == (racks.length - 1)) {
				bolzPar.isLast = true;
				if (!isRaling) bolzPar.isRack = false;

				var bolz = drawBolz(bolzPar).mesh;
				bolz.position.y += par.h * i;
				bolz.position.x = par.b * (i + 1) + offsetX;
				bolz.position.z = z;
				if (par.isWndP) {
					bolz.position.x = -offsetX - 15 + params.marshDist;
				}
				
				par.mesh.add(bolz);

				bolzPar.isLast = false;
				bolzPar.isRack = false;
			}
		}
		
		if (marshPar.botTurn == 'пол' && i == 0) bolzPar.isFirst = true;
		if (marshPar.botTurn == 'забег' && i == 0) bolzPar.isTurn = true;

		if (marshPar.topTurn == 'забег' && i == countBolz - 1) {
			bolzPar.isPlateTread = false;
			bolzPar.isTurnFirstBolz = true;
		}

		if (marshPar.botTurn == 'забег' && i == 0) {
			bolzPar.isTurnLastBolz = true;
		}
		if (!isRaling) bolzPar.isRack = false;

		var bolz = drawBolz(bolzPar).mesh;
		bolz.position.y += par.h * i;
		bolz.position.x = par.b * i + offsetX;
		bolz.position.z = z;
		if (par.isWndP) {
			bolz.position.x = -offsetX - 15 + params.marshDist;
		}
		par.mesh.add(bolz);
	}

	bolzPar.isPlateTread = false;

	if (marshPar.botTurn == 'забег') {
		bolzPar.isTurn = true;
		if (!isRaling) bolzPar.isRack = false;

		var bolz = drawBolz(bolzPar).mesh;
		bolz.position.y = - marshPar.h;
		bolz.position.x = offsetX;
		bolz.position.z = -offsetZ * turnFactor;
		if (turnFactor == 1) bolz.position.z -= bolzProfile;
		if (par.isWndP) {
			bolz.position.x = -offsetX - 15;
		}
		par.mesh.add(bolz);
	}
	if (marshPar.topTurn == 'забег') {
		bolzPar.isTurn = true;
		if (!isRaling) bolzPar.isRack = false;

		var bolz = drawBolz(bolzPar).mesh;
		bolz.position.y = par.h * marshPar.stairAmt + marshPar.h_topWnd;
		bolz.position.x = par.b * marshPar.stairAmt + offsetX;
		bolz.position.z = -offsetZ * turnFactor;
		if (turnFactor == 1) bolz.position.z -= bolzProfile;
		if (par.isWndP) {
			bolz.position.x = -offsetX - 15 + params.marshDist;
		}
		par.mesh.add(bolz);
	}

	return par;
}//end of drawBolzs


/**функция отрисовки больца
var bolzPar = {
		marshId: par.marshId,
		dxfBasePoint: par.dxfBasePoint,
		h: par.h,
		bolzProfile: bolzProfile,
		isMiddle: false,

*/
function drawBolz(par) {
	par.studDiam = 16; //диаметр шпильки
	par.shimThk = 4;
	var bolzThk = 2;

	var marshPar = getMarshParams(par.marshId);
	
	par.mesh = new THREE.Object3D();

	//var bolz = new THREE.Object3D();

	//больц, верхняя и нижняя сварная шайба
	if (true) {

		var bolzPar = {
			len: par.h - params.treadThickness - par.shimThk * 2,
			profile: par.bolzProfile,
			thk: bolzThk,
			dxfBasePoint: par.dxfBasePoint,
		}
		if (par.isFirst) bolzPar.len += par.shimThk;
		if (par.isLast) bolzPar.isLast = par.isLast;

		var bolz = drawProfileBolz(bolzPar).mesh;
		bolz.position.y = par.shimThk;
		par.mesh.add(bolz);


		//шайбы
		var shimPar = {
			profile: 50,
			thk: par.shimThk,
			dxfBasePoint: par.dxfBasePoint,
		}

		//сварная шайба нижняя
		if (!par.isFirst && !par.isLast) {
			var shim = drawShimWeld(shimPar).mesh;
			shim.position.x = par.bolzProfile / 2;
			shim.position.y = par.shimThk
			shim.position.z = par.bolzProfile / 2;
			par.mesh.add(shim);
		}

		//сварная шайба верхняя
		var shim = drawShimWeld(shimPar).mesh;
		shim.rotation.x = Math.PI;
		shim.position.x = par.bolzProfile / 2;
		shim.position.y = bolzPar.len + par.shimThk
		shim.position.z = par.bolzProfile / 2;
		par.mesh.add(shim);

		par.dxfBasePoint.x += par.bolzProfile + 100;
	}

	if (par.isFirst) {
		var flanPar = {
			profSize: 40,
			thk: 5,
			dxfBasePoint: par.dxfBasePoint,
		}
		var flan = drawFlanBolz(flanPar).mesh;
		flan.position.x = -flanPar.profSize / 2 + 2;
		flan.position.z = -flanPar.profSize / 2 + 2;
		flan.position.y += par.shimThk;
		par.mesh.add(flan);

		//шайба в больце
		var shimPar = {
			profile: 35,
			thk: par.shimThk,
			dxfBasePoint: par.dxfBasePoint,
			isNotSpec: true,
		}
		var shim = drawShimBolz(shimPar).mesh;
		shim.rotation.x = Math.PI / 2;
		shim.position.x = par.bolzProfile / 2;
		shim.position.z = par.bolzProfile / 2;
		shim.position.y = par.shimThk * 2 + 20;
		par.mesh.add(shim);

		//гайка	в больце
		var nutParams = { diam: par.studDiam }
		var nut = drawNut(nutParams).mesh;

		nut.position.x = par.bolzProfile / 2;
		nut.position.y = shim.position.y - nutParams.nutHeight - par.shimThk;
		nut.position.z = par.bolzProfile / 2;
		if (!testingMode) par.mesh.add(nut);
	}

	if (!par.isFirst) {
		//если это не больцы на забеге, добавляем снизу шайбу и гайку с колпачком
		if (!par.isTurn && !par.isLast) {
			var shimPar = {
				profile: 50,
				thk: par.shimThk,
				dxfBasePoint: par.dxfBasePoint,
			}

			var frameThicknessFix = par.frameThicknessFix || 0;
			//шайба снизу
			var shim = drawShimBolz(shimPar).mesh;
			shim.rotation.x = Math.PI / 2;
			shim.position.x = par.bolzProfile / 2;
			shim.position.y = -params.treadThickness - frameThicknessFix;
			shim.position.z = par.bolzProfile / 2;
			par.mesh.add(shim);

			//гайка снизу		
			var nutParams = { diam: par.studDiam, isCap: true }
			var nut = drawNut(nutParams).mesh;

			nut.position.x = par.bolzProfile / 2;
			nut.position.y = -params.treadThickness - nutParams.nutHeight - par.shimThk;
			nut.position.z = par.bolzProfile / 2;
			if (!testingMode) par.mesh.add(nut);
		}

		//если сверху нет стойки ограждения, добавляем шпильку
		if (!par.isRack && !par.isTurn && !par.isTurnFirstBolz) {
			//шпилька
			var studPar = {
				len: par.h + params.treadThickness + par.shimThk,
				diam: par.studDiam,
				material: params.materials.metal,
				dopParams: {},
			}
			if (nutParams) studPar.len += nutParams.nutHeight;

			var stud = drawStudF(studPar);
			stud.position.y = studPar.len / 2 - params.treadThickness - 5 - par.shimThk
			if (nutParams) stud.position.y -= nutParams.nutHeight;
			stud.position.z = par.bolzProfile / 2;
			stud.position.x = par.bolzProfile / 2;
			par.mesh.add(stud);
		}

	}

	//если сверху есть стойка ограждения, добавляем шайбу сверху и шайбу с гайкой в стойку, и шпильку
	if (par.isRack) {
		//шайба сверху
		var shimPar = {
			profile: 50,
			thk: par.shimThk,
			dxfBasePoint: par.dxfBasePoint,
		}

		var shim = drawShimBolz(shimPar).mesh;
		shim.rotation.x = Math.PI / 2;
		shim.position.x = par.bolzProfile / 2;
		shim.position.z = par.bolzProfile / 2;
		shim.position.y = bolzPar.len + par.shimThk * 3 + params.treadThickness;
		if (par.regShimThk) shim.position.y += par.regShimThk;
		par.mesh.add(shim);

		//шайба в стойке
		var shimPar = {
			profile: 35,
			thk: par.shimThk,
			dxfBasePoint: par.dxfBasePoint,
			isNotSpec: true,
		}
		var shim = drawShimBolz(shimPar).mesh;
		shim.rotation.x = Math.PI / 2;
		shim.position.x = par.bolzProfile / 2;
		shim.position.z = par.bolzProfile / 2;
		shim.position.y = bolzPar.len + par.shimThk * 3 + params.treadThickness + 5;
		if (par.regShimThk) shim.position.y += par.regShimThk;
		if (par.isFirst) shim.position.y += par.shimThk;
		par.mesh.add(shim);

		//гайка	в стойке
		var nutParams = { diam: par.studDiam }
		var nut = drawNut(nutParams).mesh;

		nut.position.x = par.bolzProfile / 2;
		nut.position.y = shim.position.y;
		nut.position.z = par.bolzProfile / 2;
		if (!testingMode) par.mesh.add(nut);

		//шпилька
		var studPar = {
			len: par.h + params.treadThickness + par.shimThk * 3 + nutParams.nutHeight * 2,
			diam: par.studDiam,
			material: params.materials.metal,
			dopParams: {},
		}
		if (par.isTurnLastBolz) studPar.len += par.h * 3;
		if (par.isFirst) studPar.len = par.h + par.shimThk + nutParams.nutHeight;
		if (par.isLast) studPar.len = params.treadThickness + par.shimThk*2 + nutParams.nutHeight*2 + 10;

		var stud = drawStudF(studPar);
		stud.position.y = studPar.len / 2 - params.treadThickness - par.shimThk - nutParams.nutHeight;
		if (par.isTurnLastBolz) stud.position.y -= par.h * 3;
		if (par.isFirst) stud.position.y = studPar.len / 2 + par.shimThk + nutParams.nutHeight; 
		if (par.isLast) stud.position.y = studPar.len + par.shimThk + nutParams.nutHeight; 
		if (par.regShimThk) stud.position.y += par.regShimThk;
		stud.position.z = par.bolzProfile / 2;
		stud.position.x = par.bolzProfile / 2;
		par.mesh.add(stud);
	}

	if (par.isLast) {
		//шайба в больце
		var shimPar = {
			profile: 35,
			thk: par.shimThk,
			dxfBasePoint: par.dxfBasePoint,
			isNotSpec: true,
		}
		var shim = drawShimBolz(shimPar).mesh;
		shim.rotation.x = Math.PI / 2;
		shim.position.x = par.bolzProfile / 2;
		shim.position.z = par.bolzProfile / 2;
		shim.position.y = bolzPar.len - 5;
		par.mesh.add(shim);

		//гайка	в больце
		var nutParams = { diam: par.studDiam }
		var nut = drawNut(nutParams).mesh;

		nut.position.x = par.bolzProfile / 2;
		nut.position.y = shim.position.y - nutParams.nutHeight - par.shimThk;
		nut.position.z = par.bolzProfile / 2;
		if (!testingMode) par.mesh.add(nut);
	}

	//закладная ступени
	if (par.isPlateTread && !par.isLast) {
		var platePar = {
			width: 38,
			len: marshPar.a - 10,
			thk: par.shimThk,
			studDiam: par.studDiam,
			rad: (par.studDiam + 2) / 2,
			isRack: par.isRack,
			dxfBasePoint: par.dxfBasePoint,
			angPlateTread: par.angPlateTread,
		}
		if (par.lenPlateTread) platePar.len = par.lenPlateTread;

		var plate = drawPlateTreadBolz(platePar).mesh;
		plate.position.x = platePar.len / 2 - 5;
		plate.position.z = par.bolzProfile / 2;
		plate.position.y = bolzPar.len + par.shimThk + par.shimThk + params.treadThickness - 20;
		par.mesh.add(plate);
	}

	if (par.isFirst) par.mesh.position.y -= par.shimThk;

	if (par.regShimThk) {
		if (par.regShimThk >= 2) {
			var regShimThk = par.regShimThk;
			var count2 = 0;
			var count4 = 0;
			if (regShimThk % 4 == 0) {
				count4 = regShimThk / 4;
			}
			else {
				count2 += 1;
				regShimThk -= 2;
				if (regShimThk >= 4) count4 = regShimThk / 4;
			}

			var posY = bolzPar.len + par.shimThk*2;
			var shimPar = {
				profile: 50,
				thk: 2,
				dxfBasePoint: par.dxfBasePoint,
			}
			for (var i = 0; i < count2; i++) {
				var shim = drawShimBolz(shimPar).mesh;
				shim.rotation.x = Math.PI / 2;
				shim.position.x = par.bolzProfile / 2;
				shim.position.y = posY + shimPar.thk;
				shim.position.z = par.bolzProfile / 2;
				par.mesh.add(shim);
				posY += shimPar.thk;
			}
			for (var i = 0; i < count4; i++) {
				shimPar.thk = 4;
				var shim = drawShimBolz(shimPar).mesh;
				shim.rotation.x = Math.PI / 2;
				shim.position.x = par.bolzProfile / 2;
				shim.position.y = posY + shimPar.thk;
				shim.position.z = par.bolzProfile / 2;
				par.mesh.add(shim);
				posY += shimPar.thk;
			}
		}
	}

	return par;
}//end of drawBolz

/** функция отрисовывает профиль больца
*/
function drawProfileBolz(par) {

	par.mesh = new THREE.Object3D();


	var p0 = { x: 0, y: 0 }
	var p1 = copyPoint(p0)
	var p2 = newPoint_xy(p1, 0, par.len);
	var p3 = newPoint_xy(p2, par.profile, 0)
	var p4 = newPoint_xy(p1, par.profile, 0)

	var pointsShape = [p1, p2, p3, p4];

	//создаем шейп
	var shapePar = {
		points: pointsShape,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
	}
	//параметры для рабочего чертежа
	if (!par.drawing) {
		shapePar.drawing = {
			name: "Больц",
			group: "Bolzs",
		}
	}
	var shape = drawShapeByPoints2(shapePar).shape;

	//подпись под фигурой
	var text = 'Больц';
	var textHeight = 30;
	var textBasePoint = newPoint_xy(par.dxfBasePoint, -70, -100)
	addText(text, textHeight, dxfPrimitivesArr, textBasePoint);

	//--------------------------------

	var p0 = { x: 0, y: 0 }
	var p1 = copyPoint(p0)
	var p2 = newPoint_xy(p1, 0, par.len);
	var p3 = newPoint_xy(p2, par.profile - par.thk * 2, 0)
	var p4 = newPoint_xy(p1, par.profile - par.thk * 2, 0)

	var pointsShape1 = [p1, p2, p3, p4];

	//создаем шейп
	var shapePar1 = {
		points: pointsShape1,
		dxfArr: [],
		dxfBasePoint: par.dxfBasePoint,
	}
	var shape1 = drawShapeByPoints2(shapePar1).shape;

	//--------------------------------
	var shape2 = shape1;

	if (par.isLast) {
		var hole = new THREE.Path();
		var c1 = newPoint_xy(p0, (par.profile - par.thk * 2) / 2, par.len / 2);
		addCircle(hole, dxfPrimitivesArr, c1, 17.5, par.dxfBasePoint);
		shape1.holes.push(hole);

		var shape2 = drawShapeByPoints2(shapePar1).shape;
		var hole = new THREE.Path();
		addCircle(hole, dxfPrimitivesArr, c1, 6, par.dxfBasePoint);
		shape2.holes.push(hole);
	}

	//тело
	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var plate = new THREE.Mesh(geom, params.materials.metal);
	par.mesh.add(plate);

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var plate = new THREE.Mesh(geom, params.materials.metal);
	plate.position.z = par.profile - par.thk;
	par.mesh.add(plate);

	var geom = new THREE.ExtrudeGeometry(shape1, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var plate = new THREE.Mesh(geom, params.materials.metal);
	plate.rotation.y = -Math.PI / 2;
	plate.position.x = par.thk;
	plate.position.z = par.thk;
	par.mesh.add(plate);

	var geom = new THREE.ExtrudeGeometry(shape2, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var plate = new THREE.Mesh(geom, params.materials.metal);
	plate.rotation.y = -Math.PI / 2;
	plate.position.x = par.profile;
	plate.position.z = par.thk;
	par.mesh.add(plate);

	//сохраняем данные для спецификации
	var partName = "bolz";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				name: "Больц",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
			}
		}
		var name = 'h=' + par.len + 'мм';
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["sumLength"] += par.len;
	}
	par.mesh.specId = partName + name;

	return par;
}

/** функция отрисовывает шайбу больца
*/
function drawShimBolz(par) {
	var rad = 9
	if (par.rad) rad = par.rad;

	par.mesh = new THREE.Object3D();

	var p0 = { x: 0, y: 0 }
	var p1 = newPoint_xy(p0, -par.profile / 2, - par.profile / 2)
	var p2 = newPoint_xy(p0, -par.profile / 2, par.profile / 2)
	var p3 = newPoint_xy(p0, par.profile / 2, par.profile / 2)
	var p4 = newPoint_xy(p0, par.profile / 2, - par.profile / 2)

	var pointsShape = [p1, p2, p3, p4];

	//создаем шейп
	var shapePar = {
		points: pointsShape,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
	}
	//параметры для рабочего чертежа
	if (!par.drawing) {
		shapePar.drawing = {
			name: "Шайба больца",
			group: "Bolzs",
		}
	}
	var shape = drawShapeByPoints2(shapePar).shape;

	var hole = new THREE.Path();
	addCircle(hole, dxfPrimitivesArr, p0, rad, par.dxfBasePoint);
	shape.holes.push(hole);


	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var shim = new THREE.Mesh(geom, params.materials.metal);

	par.mesh.add(shim);

	//сохраняем данные для спецификации
	var partName = "bolzShim_";
	if (typeof specObj != 'undefined' && !par.isNotSpec) {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				name: "Шайба больца",
				metalPaint: true,
				timberPaint: false,
				division: "stock_2",
				workUnitName: "amt", //единица измерения
				group: "Метизы",
			}
		}
		var name = par.profile + 'x' + par.profile;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;

		par.mesh.specId = partName + name;
	}


	return par;
}

/** функция отрисовывает сварную шайбу больца
*/
function drawShimWeld(par) {
	var rad = 9

	par.mesh = new THREE.Object3D();

	var shimPar = {
		profile: 50,
		thk: 4,
		dxfBasePoint: par.dxfBasePoint,
		isNotSpec: true,
	}

	//шкайба нижняя
	var shim = drawShimBolz(shimPar).mesh;
	shim.rotation.x = Math.PI / 2;
	par.mesh.add(shim);

	shimPar.profile = 35

	//шкайба нижняя
	var shim = drawShimBolz(shimPar).mesh;
	shim.rotation.x = Math.PI / 2;
	shim.position.y = shimPar.thk
	par.mesh.add(shim);

	//сохраняем данные для спецификации
	var partName = "bolzShimWld_";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				name: "Шайба больца сварная",
				metalPaint: true,
				timberPaint: false,
				division: "stock_2",
				workUnitName: "amt", //единица измерения
				group: "Метизы",
			}
		}
		var name = '50х50';
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}
	par.mesh.specId = partName + name;

	return par;
}

/** функция отрисовывает закладную ступени
*/
function drawPlateTreadBolz(par) {
	var rad = 9
	if (par.rad) rad = par.rad;

	par.mesh = new THREE.Object3D();

	var p0 = { x: 0, y: 0 }
	var p1 = newPoint_xy(p0, -par.len / 2, - par.width / 2)
	var p2 = newPoint_xy(p0, -par.len / 2, par.width / 2)
	var p3 = newPoint_xy(p0, par.len / 2, par.width / 2)
	var p4 = newPoint_xy(p0, par.len / 2, - par.width / 2)

	var pointsShape = [p1, p2, p3, p4];

	//создаем шейп
	var shapePar = {
		points: pointsShape,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
	}
	//параметры для рабочего чертежа
	if (!par.drawing) {
		shapePar.drawing = {
			name: "Больц",
			group: "Bolzs",
		}
	}
	var shape = drawShapeByPoints2(shapePar).shape;

	var hole = new THREE.Path();
	var c1 = newPoint_xy(p0, -par.len / 2 + 25, 0);
	addCircle(hole, dxfPrimitivesArr, c1, rad, par.dxfBasePoint);
	shape.holes.push(hole);

	var hole = new THREE.Path();
	var c2 = newPoint_xy(p0, par.len / 2 - 25, 0);
	addCircle(hole, dxfPrimitivesArr, c2, rad, par.dxfBasePoint);
	shape.holes.push(hole);

	//отверстия под саморезы
	var hole = new THREE.Path();
	var c3 = newPoint_xy(c1, 50, 0);
	addCircle(hole, dxfPrimitivesArr, c3, 3.5, par.dxfBasePoint);
	shape.holes.push(hole);

	var hole = new THREE.Path();
	var c4 = newPoint_xy(c2, -50, 0);
	addCircle(hole, dxfPrimitivesArr, c4, 3.5, par.dxfBasePoint);
	shape.holes.push(hole);

	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var plate = new THREE.Mesh(geom, params.materials.metal);
	plate.rotation.x = Math.PI / 2;

	//поворот относительно отверстия под больц
	if (par.angPlateTread) {
		var turnF = params.turnFactor * -1;
		plate.rotation.z = par.angPlateTread * turnF;
		//if (+params.turnFactor == 1) plate.rotation.z += Math.PI;
		var h = 2 * c2.x * Math.sin(par.angPlateTread / 2);
		plate.position.x -= h * Math.sin(par.angPlateTread / 2);
		plate.position.z += h * Math.cos(par.angPlateTread / 2) * turnF;
	}

	par.mesh.add(plate);

	//гайка	
	if (!par.isRack) {
		var nutParams = { diam: par.studDiam }
		var nut = drawNut(nutParams).mesh;

		nut.position.x = c1.x;
		nut.position.y = plate.position.y;
		nut.position.z = c1.y;
		if (!testingMode) par.mesh.add(nut);
	}

	//сохраняем данные для спецификации
	var partName = "InnerFlange";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				name: "Закладная ступени",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
			}
		}
		var name = 'с гайкой ';
		if (par.isRack) name = 'без гайки '
		name += '4мм  ' + par.width +'xL=' + par.len;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}
	par.mesh.specId = partName + name;

	return par;
}

/** функция отрисовывает фланец крепления к полу больца
*/
function drawFlanBolz(par) {
	//нижний фланец колонны
	var flanPar = {
		width: par.profSize + 36, //ширина фланца
		height: par.profSize + 36, //длина фланца (высота при вертикальном расположении)
		holeRad: 7,
		cornerRad: 10,
		holeX: 10,
		holeY: 10,
		thk: par.thk,
		dxfBasePoint: par.dxfBasePoint,
	};
	if (par.isSvg) {
		flanPar.drawing = {
			name: "Фланец больца нижний",
			group: "carcasFlans",
			marshId: par.marshId,
		}
	}
	flanPar.noBolts = true; //болты не добавляются
	//flanPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, -flanPar.width - 100);
	flanPar.dxfBasePoint.y -= flanPar.width + 100;

	flanPar.isFixPart = true; // болты крепления к стенам
	flanPar.fixPar = getFixPart(0, 'botFloor'); // параметры крепления к стенам

	//добавляем  отверстия по краям
	flanPar.roundHoleCenters = [];
	addHolesMonoFlan(flanPar);

	//добавляем прямоугольное отверстие под трубу
	var center = { x: flanPar.width / 2, y: flanPar.height / 2 };
	if (!flanPar.pathHoles) flanPar.pathHoles = [];
	flanPar.pathHoles.push(pathPolygonHole(center, par.profSize / 2 + 1, par.profSize / 2 + 1, flanPar.dxfBasePoint));

	var flan = drawRectFlan2(flanPar).mesh;
	flan.rotation.x = Math.PI / 2;
	flan.position.y = flanPar.thk;

	par.mesh = flan;


	//сохраняем данные для спецификации
	var partName = "carcasFlan";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				name: "Фланец",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
			}
		}
		var name = 'ФП' + par.thk + '-' + flanPar.width + 'x' + flanPar.height;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}
	par.mesh.specId = partName + name;

	return par;
}

function addHolesMonoFlan(par) {
	var hole1Y = par.holeY;
	var hole2Y = par.holeY;
	if (par.hole1Y) hole1Y = par.hole1Y;
	if (par.hole2Y) hole2Y = par.hole2Y;
	//функция добавляет координаты отверстий по краям фланца
	par.roundHoleCenters.push({ x: par.holeX, y: hole1Y, holeData: { zenk: 'no' }, isFixPart: par.isFixPart });
	par.roundHoleCenters.push({ x: par.holeX, y: par.height - hole2Y, holeData: { zenk: 'no' }, isFixPart: par.isFixPart });
	par.roundHoleCenters.push({ x: par.width - par.holeX, y: par.height - hole2Y, holeData: { zenk: 'no' }, isFixPart: par.isFixPart });
	par.roundHoleCenters.push({ x: par.width - par.holeX, y: hole1Y, holeData: { zenk: 'no' }, isFixPart: par.isFixPart });
}

function pathPolygonHole(center, holeX, holeY, dxfBasePoint) {
	var hole = new THREE.Path();

	var p1 = { x: center.x - holeX, y: center.y + holeY };
	var p2 = { x: center.x + holeX, y: center.y + holeY };
	var p3 = { x: center.x + holeX, y: center.y - holeY };
	var p4 = { x: center.x - holeX, y: center.y - holeY };

	addLine(hole, dxfPrimitivesArr, p1, p4, dxfBasePoint);
	addLine(hole, dxfPrimitivesArr, p4, p3, dxfBasePoint);
	addLine(hole, dxfPrimitivesArr, p3, p2, dxfBasePoint);
	addLine(hole, dxfPrimitivesArr, p2, p1, dxfBasePoint);

	return hole;
}//end of addPolygonHole