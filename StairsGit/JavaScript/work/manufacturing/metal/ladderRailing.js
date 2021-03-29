function drawLadderHandrail(par) {
	/*функция отрисовывает секцию ограждения модель "Трап" для крутых лестниц в подвал.
		исходные данные:
		marshId
		dxfBasePoint
		возвращает mesh
	*/

	par.mesh = new THREE.Object3D();

	var poleProfileZ = 20; //толщина стойки
	var flanThickness = 4;

	railingPositionZ = poleProfileZ;
	if (par.key == "in") var railingPositionZ = 0;
	if (turnFactor === -1) {
		railingPositionZ = -poleProfileZ * 2;
		if (par.key == "in") railingPositionZ = -poleProfileZ;
	}

	//для прямой лестницы все наоборот
	if (params.stairModel == "Прямая") {
		var railingPositionZ = 0;
		if (par.key == "in") railingPositionZ = poleProfileZ;
		if (turnFactor === -1) {
			railingPositionZ = -poleProfileZ;
			if (par.key == "in") railingPositionZ = -poleProfileZ * 2;
		}
	}

	var marshPar = getMarshParams(par.marshId);

	par.h = marshPar.h;
	par.b = marshPar.b;
	par.stairAmt = marshPar.stairAmt;
	var marshAng = marshPar.ang;

	var handrailOffset = 300;
	var handrailEndOffset = 100;
	var handrailLen = 1000;
	var startStep = params.railingStart * 1.0 + 1;

	//базовые точки
	var p0 = { x: 0, y: 0 };
	var balPos1 = newPoint_xy(p0, par.b * (startStep - 1), par.h * startStep); //стойка от угла ступени с номером startStep
	var balPos2 = newPoint_xy(p0, par.b * (par.stairAmt - 1), par.h * par.stairAmt); //стойка от угла последней ступени

	//сдвигаем стойки на половину ширины профиля стоек
	balPos1 = polar(balPos1, marshAng, 20);
	balPos2 = polar(balPos2, marshAng, 20);

	//концы поручня
	var p1 = polar(balPos1, marshAng + Math.PI / 2, handrailOffset + 0.1);
	p1 = polar(p1, marshAng, -handrailEndOffset);

	var p2 = polar(balPos2, marshAng + Math.PI / 2, handrailOffset + 0.1);
	p2 = polar(p2, marshAng, handrailEndOffset);


	//поручень
	var handrailPar = {
		prof: params.handrailProf,
		sideSlots: params.handrailSlots,
		handrailType: params.handrail,
		metalPaint: params.metalPaint_perila,
		timberPaint: params.timberPaint_perila,
	}
	handrailPar = calcHandrailMeterParams(handrailPar); //функция в файле priceLib.js

	var handrailProfileY = handrailPar.profY;
	var handrailProfileZ = handrailPar.profZ;
	var handrailModel = handrailPar.handrailModel;
	var handrailMaterial = params.materials.metal;
	if (handrailPar.mat == "timber") handrailMaterial = params.materials.timber;


	//параметры поручня
	var poleParams = {
		partName: "handrails",
		type: handrailPar.handrailModel,
		poleProfileY: handrailProfileY,
		poleProfileZ: handrailProfileZ,
		length: distance(p1, p2),
		poleAngle: marshAng,
		material: handrailMaterial,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, p1.x, p1.y),
		dxfArr: dxfPrimitivesArr,
	}

	poleParams = drawPole3D_4(poleParams);
	var pole = poleParams.mesh;
	pole.position.x = p1.x;
	pole.position.y = p1.y - par.h / 2;
	pole.position.z = -handrailProfileZ / 2 + poleProfileZ / 2 + railingPositionZ;
	par.mesh.add(pole);

	//стойки

	//сдвигаем стойки на тетиву на 150мм
	var balOnlay = 150;
	balPos1 = polar(balPos1, marshAng - Math.PI / 2, balOnlay);
	balPos2 = polar(balPos2, marshAng - Math.PI / 2, balOnlay);

	var balMaxDist = 1200;
	var balAmt = Math.ceil(distance(balPos1, balPos2) / balMaxDist) + 1;
	var balDist = distance(balPos1, balPos2) / (balAmt - 1);

	var poleParams = {
		partName: "ladderBal",
		type: "rect",
		poleProfileY: 40,
		poleProfileZ: poleProfileZ,
		length: handrailOffset + balOnlay - flanThickness - 0.02,
		poleAngle: marshAng + Math.PI / 2,
		material: params.materials.metal,
		dxfBasePoint: { x: 0, y: 0 },
		dxfArr: dxfPrimitivesArr,
		roundHoles: [],
	}

	//отрисовка стоек
	/*средние ступени*/
	ltko_set_railing(par.stairAmt, par);

	//смещяем все стойки если начало ограждений не с первой ступени
	if (par.marshId == 1 && params.railingStart > 0) {
		for (var j = 0; j < par.railing.length; j++) {
			par.railing[j] += params.railingStart * 1.0;
		}
	}

	var racks = [];

	for (var i = 0; i < par.stairAmt; i++) {
		if (par.railing.indexOf(i + 1) != -1 || (i == 0 || i == par.stairAmt - 1)) {
			var holeDist = 60; //расстояние между отверстиями
			var pos = newPoint_xy(balPos1, par.b * (i - params.railingStart * 1.0), par.h * (i - params.railingStart * 1.0));
			racks.push(pos);
			if (i == 0) pos = copyPoint(balPos1);
			pos.y += - par.h / 2;
			poleParams.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);

			// добавляем отверстия
			var center = polar(p0, marshAng, -poleParams.poleProfileY / 2);
			var center1 = polar(center, marshAng + Math.PI / 2, 30); // 30 - отступ от нижнего края стойки до первого отверстия по Y при вертикальном расположении
			var center2 = polar(center1, marshAng + Math.PI / 2, holeDist);
			center1.diam = center2.diam = 13;
			poleParams.roundHoles = [center1, center2];

			poleParams = drawPole3D_4(poleParams);
			var pole = poleParams.mesh;
			pole.position.x = pos.x;
			pole.position.y = pos.y;
			pole.position.z = railingPositionZ;
			par.mesh.add(pole);


			//болты
			if (typeof anglesHasBolts != "undefined" && anglesHasBolts) { //anglesHasBolts - глобальная переменная
				var bolts = new THREE.Object3D();
				var boltPar = {
					diam: boltDiam,
					len: 20,
					headType: "потай",
				}
				if (params.model == "ко") boltPar.headType = "шестигр.";

				var bolt = drawBolt(boltPar).mesh;
				if (params.model == "лт") {
					bolt.rotation.x = Math.PI / 2;
					bolt.position.x = pos.x + center1.x;
					bolt.position.y = pos.y + center1.y;
					bolt.position.z = 2

					if (par.railingSide == "left") {
						bolt.rotation.x = -Math.PI / 2;
						bolt.position.z = poleProfileZ - 2
					}
				}

				if (params.model == "ко") {
					bolt.rotation.x = -Math.PI / 2;
					bolt.position.x = pos.x + center1.x;
					bolt.position.y = pos.y + center1.y;
					bolt.position.z = 2 + 4//boltLen / 2 + boltBulge - 4;

					if (par.railingSide == "left") {
						bolt.rotation.x = Math.PI / 2;
						bolt.position.z = poleProfileZ - 2 - 4// - boltLen / 2 - boltBulge + 4;
					}
				}
				bolts.add(bolt)


				var bolt2 = drawBolt(boltPar).mesh;
				bolt2.rotation.x = bolt.rotation.x;
				bolt2.position.x = pos.x + center2.x;
				bolt2.position.y = pos.y + center2.y;
				bolt2.position.z = bolt.position.z;
				bolts.add(bolt2)

				par.mesh.add(bolts)
			}

			//закладная стойки
			{
				var rackFlan = drawRackFlan(poleParams.poleProfileY);
				var dy = holeDist / 2 + 30;
				var dx = - poleParams.poleProfileY / 2;
				rackFlan.position.y = dy * Math.cos(marshAng) + dx * Math.sin(marshAng);
				rackFlan.position.x = -dy * Math.sin(marshAng) + dx * Math.cos(marshAng);
				rackFlan.position.z += 2;
				if (par.key == "out") rackFlan.position.z += poleParams.poleProfileZ - 2 - 2;
				rackFlan.rotation.z = marshAng;
				if (!testingMode) pole.add(rackFlan);

				var plugParams = {
					id: "plasticPlug_20_40",
					width: poleParams.poleProfileY,
					height: poleParams.poleProfileZ,
					description: "Заглушка низа стойки",
					group: "Ограждения",
					thk: 2,
				}
				var rackBotPlug = drawPlug(plugParams);
				rackBotPlug.position.z += poleParams.poleProfileZ / 2;
				rackBotPlug.rotation.z = marshAng;
				rackBotPlug.position.y = -plugParams.thk / 2 * Math.cos(marshAng) +  dx * Math.sin(marshAng);
				rackBotPlug.position.x = plugParams.thk / 2 * Math.sin(marshAng) + dx * Math.cos(marshAng);
				if (!testingMode) pole.add(rackBotPlug);
			}

			//фланец крепления к поручню
			{
				var flanObj = new THREE.Object3D();

				var widthFlan = 20;
				var heightFlan = 76;
				var holeRad = 3;

				var p1 = { x: 0, y: - heightFlan / 2 + 20 };
				var p2 = newPoint_xy(p1, 0, heightFlan);
				var p3 = newPoint_xy(p2, widthFlan, 0);
				var p4 = newPoint_xy(p1, widthFlan, 0);

				var points = [p1, p2, p3, p4]

				//создаем шейп
				var shapePar = {
					points: points,
					dxfArr: dxfPrimitivesArr,
					dxfBasePoint: newPoint_xy(poleParams.dxfBasePoint, 0, -200),
					radOut: 5, //радиус скругления внешних углов
				}
				var shape = drawShapeByPoints2(shapePar).shape;

				var hole1 = new THREE.Path();
				var hole2 = new THREE.Path();
				var center1 = newPoint_xy(p1, widthFlan / 2, 7);
				var center2 = newPoint_xy(p2, widthFlan / 2, -7);
				addCircle(hole1, dxfPrimitivesArr, center1, holeRad, dxfBasePoint);
				addCircle(hole2, dxfPrimitivesArr, center2, holeRad, dxfBasePoint);
				shape.holes.push(hole1);
				shape.holes.push(hole2);

				var screwPar = {
					id: "metalHandrailScrew",
					description: "Крепление фланца к поручню",
					group: "Ограждения"
				}
				
				var screw = drawScrew(screwPar).mesh;
				screw.position.x = center1.x;
				screw.position.y = center1.y;
				screw.rotation.x = Math.PI / 2;
				flanObj.add(screw);
				
				var screw = drawScrew(screwPar).mesh;
				screw.position.x = center2.x;
				screw.position.y = center2.y;
				screw.rotation.x = Math.PI / 2;
				flanObj.add(screw);

				var extrudeOptions = {
					amount: flanThickness,
					bevelEnabled: false,
					curveSegments: 12,
					steps: 1
				};
				var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
				geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
				var flan = new THREE.Mesh(geometry, params.materials.metal);
				flanObj.add(flan)
				flanObj.rotation.x = Math.PI / 2;
				flanObj.rotation.y = marshAng;
				flanObj.rotation.z = Math.PI / 2;
				flanObj.position.x = pos.x - (flanThickness + poleParams.length + 0.02) * Math.sin(marshAng);
				flanObj.position.y = pos.y + (flanThickness + poleParams.length + 0.02) * Math.cos(marshAng);
				flanObj.position.z = railingPositionZ;
				par.mesh.add(flanObj)

				//сохраняем данные для спецификации
				var partName = "Flan";
				if (typeof specObj != 'undefined') {
					if (!specObj[partName]) {
						specObj[partName] = {
							types: {},
							amt: 0,
							name: "Фланец",
							area: 0,
							paintedArea: 0,
							metalPaint: true,
							timberPaint: false,
							division: "metal",
							workUnitName: "area", //единица измерения
							group: "Ограждения",
						}
					}
					var name = heightFlan + "x" + widthFlan + "x" + 8;
					var area = heightFlan * widthFlan / 1000000;
					if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
					if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
					specObj[partName]["amt"] += 1;
					specObj[partName]["area"] += area;
					specObj[partName]["paintedArea"] += area * 2;
				}
				par.mesh.specId = partName + name;
			}
		}
	}

	//ригели

	var rigelDist = handrailOffset / (params.rigelAmt * 1.0 + 1);
	var rigelExtraLen = 40 * 2 + poleParams.poleProfileY; //ригель выступает за стойку на 40мм в начале и в конце ограждения
	var basepoint0 = polar(balPos1, marshAng + Math.PI / 2, balOnlay + rigelDist);
	basepoint0 = polar(basepoint0, marshAng, -80);

	var rigelModel = "rect";
	var rigelProfileY = 20;
	var rigelProfileZ = 20;

	if (params.rigelMaterial == "Ф12 нерж.") {
		rigelModel = "round";
		rigelProfileY = 12;
		rigelProfileZ = 12;
	}

	var rigelZ = rigelProfileZ * turnFactor;
	if (par.key == "in") rigelZ = -rigelProfileZ * turnFactor;
	//для прямой лестницы все наоборот
	if (params.stairModel == "Прямая") {
		var rigelZ = -rigelProfileZ * turnFactor;
		if (par.key == "in") rigelZ = rigelProfileZ * turnFactor;
	}


	var poleParams = {
		partName: "rigels",
		type: rigelModel,
		poleProfileY: rigelProfileY,
		poleProfileZ: rigelProfileZ,
		length: distance(balPos1, balPos2) + rigelExtraLen,
		poleAngle: marshAng,
		material: params.materials.metal,
		dxfBasePoint: { x: 0, y: 0 },
		dxfArr: dxfPrimitivesArr,
	}

	//отрисовка ригелей
	for (var i = 0; i < params.rigelAmt; i++) {
		var pos = polar(basepoint0, marshAng + Math.PI / 2, rigelDist * i)
		poleParams.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);
		poleParams = drawPole3D_4(poleParams);
		var pole = poleParams.mesh;
		pole.position.x = pos.x;
		pole.position.y = pos.y - par.h / 2;
		pole.position.z = rigelZ + railingPositionZ;
		par.mesh.add(pole);

		for (var j = 0; j < racks.length; j++) {
			// var rackPos = newPoint_xy(balPos1, par.b * (j - params.railingStart * 1.0), par.h * (j - params.railingStart * 1.0));
			var screwPos = itercection(pos, polar(pos, marshAng, 10.0), racks[j], polar(racks[j], marshAng + Math.PI / 2, 10.0)); //par.railing[j];
			screwPos = polar(screwPos, marshAng + Math.PI / 2, -rigelDist / 2 + 10);
			
			var screwPar = {
				id: "rigelScrew",
				description: "Крепление ригелей",
				group: "Ограждения"
			}
			
			var screw = drawScrew(screwPar).mesh;
			screw.rotation.x = Math.PI / 2;
			screw.position.x = screwPos.x;
			screw.position.y = screwPos.y;
			screw.position.z = -50;
			par.mesh.add(screw);
		}
	}


	//par.mesh.position.y -= par.h / 2


	return par;

} //end of drawLadderHandrail

