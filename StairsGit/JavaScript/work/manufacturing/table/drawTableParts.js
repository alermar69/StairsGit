/** функция отрисовывает подстолье
	@param model
	@param height
	@param width
	@param len
*/

function drawTableBase(par){
	initPar(par)
	var modelPar = getTableBasePar(par);
	var profPar = getProfParams(modelPar.legProf)
	par.legProfPar = profPar;
	
	for(var i=0; i<modelPar.partsAmt; i++){
		
	//модель T-1, T-3, T-4
		if (par.model == "T-1" || par.model == "T-3" || par.model == "T-4"){
			var posZ = 0;
			var turn = 1;
			var ang = 0; //угол наклона ног

			if (i == 1) {
				posZ = par.len - profPar.sizeA
				turn = -1;
			}

			if (par.model == "T-3") ang = Math.PI / 15;
			if (par.model == "T-4") ang = -Math.PI / 6;

			var p0 = { x: 0, y: 0 };
			var pt = newPoint_xy(p0, 0, par.height);
			if (par.model == "T-4") pt.y -= 8;

			var p1 = copyPoint(p0);
			if (par.model == "T-4") p1.y += 4;
			var p2 = itercection(p1, polar(p1, Math.PI / 2 - ang, 100), pt, polar(pt, 0, 100));
			var line = parallel(p1, p2, -profPar.sizeA)
			var p3 = itercection(line.p1, line.p2, pt, polar(pt, 0, 100));
			var p4 = itercection(line.p1, line.p2, p1, polar(p1, 0, 100));

			var meshPar = {
				points: [p1, p2, p3, p4],
				thk: profPar.sizeB,
			}

			//левая нога
			var pole1 = drawMesh(meshPar).mesh;
			pole1.rotation.y = -Math.PI / 2 * turn;
			pole1.position.z = posZ;
			if (par.model == "T-3") pole1.position.z -= par.height * Math.tan(ang) * turn;
			if (par.model == "T-4") {
				pole1.position.x = (par.width - profPar.sizeB) / 2;
				pole1.position.z += par.len / 2 * turn
			}
			if (i == 1) {
				pole1.position.z += profPar.sizeA
				pole1.position.x -= profPar.sizeB
			}
			par.mesh.add(pole1);

			if (par.model == "T-1" || par.model == "T-3") {
				//правая нога
				var pole1 = drawMesh(meshPar).mesh;
				pole1.rotation.y = -Math.PI / 2 * turn;
				pole1.position.x = par.width - profPar.sizeB;
				pole1.position.z = posZ;
				if (par.model == "T-3") pole1.position.z -= par.height * Math.tan(ang) * turn;
				if (i == 1) {
					pole1.position.z += profPar.sizeA
					pole1.position.x -= profPar.sizeB
				}
				par.mesh.add(pole1);

				//нижняя перемычка
				var polePar = {
					poleProfileY: profPar.sizeB,
					poleProfileZ: profPar.sizeA,
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
					length: par.width - profPar.sizeB * 2,
					poleAngle: 0,
				}

				var pole3 = drawPole3D_4(polePar).mesh;
				pole3.position.z = posZ;
				if (par.model == "T-3") pole3.position.z -= par.height * Math.tan(ang) * turn;
				par.mesh.add(pole3);
			}

			//верхняя пластина
			var platePar = {
				width: 100,
				len: par.width,
				legProfPar: profPar,
				notch: 1,
				ang: ang,
			}
			if (par.model == "T-3") platePar.notch = 2;
			if (par.model == "T-4") platePar.notch = 0;
			
			var plate = drawTableBasePlate(platePar).mesh;
			plate.position.x = -profPar.sizeB;
			plate.position.y = par.height;
			plate.position.z = posZ;
			if(i==1) {
				plate.rotation.x = Math.PI
				plate.position.y -= platePar.thk
				plate.position.z += profPar.sizeA
			}
			par.mesh.add(plate);
		}

    //модель T-2
		if (par.model == "T-2") {

			var posZ = 0;
			if (i == 1) posZ = par.len - profPar.sizeA


			var polePar = {
				poleProfileY: profPar.sizeB,
				poleProfileZ: profPar.sizeA,
				dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
				length: par.height - getTableBaseFramePar().holder.height,
				poleAngle: Math.PI / 2,
			}

			//левая нога
			var pole1 = drawPole3D_4(polePar).mesh;
			pole1.position.z = posZ;
			par.mesh.add(pole1);

			//правая нога
			var pole1 = drawPole3D_4(polePar).mesh;
			pole1.position.x = par.width - profPar.sizeB;
			pole1.position.z = posZ;
			par.mesh.add(pole1);

			//нижняя перемычка
			polePar.length = par.width - profPar.sizeB * 2
			polePar.poleAngle = 0;
			var pole3 = drawPole3D_4(polePar).mesh;
			pole3.position.z = posZ;
			par.mesh.add(pole3);

			//верхняя перемычка
			polePar.length = par.width - profPar.sizeB * 2
			polePar.poleAngle = 0;
			var pole3 = drawPole3D_4(polePar).mesh;
			pole3.position.y = par.height - profPar.sizeB - getTableBaseFramePar().holder.height;
			pole3.position.z = posZ;
			par.mesh.add(pole3);
		}

	//модель T-5
		if (par.model == "T-5") {
			var posZ = 0;
			var turn = 1;
			var angInclination = 0; //угол наклона ног

			var ang = Math.atan2(par.width, par.len);

			if (i == 1) {
				posZ = par.len - profPar.sizeA
				turn = -1;
			}


			var legPar = {
				height: par.height,
				profPar: profPar,
				angInclination: angInclination,
			}

			//левая нога
			var pole1 = drawTableBaseleg(legPar).mesh;
			pole1.rotation.y = -Math.PI / 2 * turn;
			pole1.position.z = posZ;
			if (i == 1) {
				pole1.position.z += profPar.sizeA
				pole1.position.x -= profPar.sizeB
			}
			par.mesh.add(pole1);

			//правая нога
			var pole1 = drawTableBaseleg(legPar).mesh;
			pole1.rotation.y = -Math.PI / 2 * turn;
			pole1.position.x = par.width - profPar.sizeB;
			pole1.position.z = posZ;
			if (i == 1) {
				pole1.position.z += profPar.sizeA
				pole1.position.x -= profPar.sizeB
			}
			par.mesh.add(pole1);

			//нижняя, верхняя перемычка
			var ang = Math.PI / 4;
			var p0 = { x: 0, y: 0 };
			var pt = newPoint_xy(p0, par.width / 2, 0);

			var p1 = newPoint_xy(p0, profPar.sizeB, 0);
			var p2 = newPoint_xy(p1, 0, profPar.sizeA);
			var p3 = newPoint_xy(p0, 0, profPar.sizeA);
			var p4 = itercection(p3, polar(p3, ang, 100), pt, polar(pt, Math.PI / 2, 100));
			var p5 = itercection(p1, polar(p1, ang, 100), pt, polar(pt, Math.PI / 2, 100));
			var points = [p1, p2, p3, p4, p5];

			var meshPar = {
				points: points,
				thk: profPar.sizeB,
			}

			for (var j = 0; j < 2; j++) {
				var pole3 = drawMesh(meshPar).mesh;
				pole3.position.x = -profPar.sizeB;
				pole3.position.z = posZ;
				pole3.rotation.x = Math.PI / 2 * turn;
				if (turn == 1) pole3.position.y = meshPar.thk;
				if (turn == -1) pole3.position.z += profPar.sizeA
				if (j == 1) pole3.position.y += par.height - meshPar.thk;
				par.mesh.add(pole3);


				var pole3 = drawMesh(meshPar).mesh;
				pole3.position.x = par.width - profPar.sizeB;
				pole3.position.z = posZ;
				pole3.rotation.x = Math.PI / 2 * turn;
				pole3.rotation.y = Math.PI;
				if (turn == -1) pole3.position.y = meshPar.thk;
				if (turn == -1) pole3.position.z += profPar.sizeA
				if (j == 1) pole3.position.y += par.height - meshPar.thk;
				par.mesh.add(pole3);
			}
		}

	//модель T-6
		if (par.model == "T-6") {
			var mesh = new THREE.Object3D();

			var ang = Math.atan(par.len / par.width); // угол диагонали

			var p0 = { x: 0, y: 0 };

			//точки контура подстолья
			var pt1 = copyPoint(p0);;
			var pt2 = newPoint_xy(pt1, 0, par.len);
			var pt3 = newPoint_xy(pt2, par.width, 0);
			var pt4 = newPoint_xy(pt1, par.width, 0);

			//точки ноги, вид сверху
			var p1 = polar(pt1, Math.PI / 2 + ang, profPar.sizeB / 2)
			var p2 = polar(p1, ang, profPar.sizeA)
			var p3 = polar(p2, Math.PI / 2 + ang, -profPar.sizeB)
			var p4 = polar(p3, ang, -profPar.sizeA)
			var points = [p1, p2, p3, p4];

			var meshPar = {
				points: [p1, p2, p3, p4],
				thk: par.height,
			}

			//левая передняя нога
			var pole1 = drawMesh(meshPar).mesh;
			mesh.add(pole1);

			//правая передняя нога
			var points4 = mirrowPoints(points, 'y')
			points4 = moovePoints(points4, pt4)
			meshPar.points = points4
			var pole1 = drawMesh(meshPar).mesh;
			mesh.add(pole1);

			//левая задняя нога
			var points2 = mirrowPoints(points, 'x')
			points2 = moovePoints(points2, pt2)
			meshPar.points = points2
			var pole1 = drawMesh(meshPar).mesh;
			mesh.add(pole1);

			//правая задняя нога
			var points3 = mirrowPoints(points, 'x')
			points3 = mirrowPoints(points3, 'y')
			points3 = moovePoints(points3, pt3)
			meshPar.points = points3
			var pole1 = drawMesh(meshPar).mesh;
			mesh.add(pole1);


			mesh.rotation.x = -Math.PI / 2
			par.mesh.add(mesh);

			//диагональная длинная перекладина
			for (var j = 0; j < 2; j++) {
				var points5 = [points4[2], points2[1], points2[2], points4[1]]
				meshPar.points = points5
				meshPar.thk = profPar.sizeB
				var pole1 = drawMesh(meshPar).mesh;
				if(j == 1) pole1.position.z = par.height - meshPar.thk;
				mesh.add(pole1);
			}

			//диагональная короткая перекладина
			for (var j = 0; j < 2; j++) {
				//передняя
				var points6 = [points[2], points[1]]
				points6.push(itercection(points[0], points[1], points4[2], points4[3]))
				points6.push(itercection(points[2], points[3], points4[2], points4[3]))
				meshPar.points = points6
				meshPar.thk = profPar.sizeB
				var pole1 = drawMesh(meshPar).mesh;
				if (j == 1) pole1.position.z = par.height - meshPar.thk;
				mesh.add(pole1);

				//задняя
				var points7 = [points3[2], points3[1]]
				points7.push(itercection(points3[0], points3[1], points4[0], points4[1]))
				points7.push(itercection(points3[2], points3[3], points4[0], points4[1]))
				meshPar.points = points7
				meshPar.thk = profPar.sizeB
				var pole1 = drawMesh(meshPar).mesh;
				if (j == 1) pole1.position.z = par.height - meshPar.thk;
				mesh.add(pole1);
			}


			mesh.rotation.x = -Math.PI / 2
			par.mesh.add(mesh);
		}
	}

	// детали которые отрисовываются в еденичном экземпляре
	{
		if (par.model == "T-2") {
			//верхняя рамка
			var framePar = {
				width: par.width,
				len: par.len - profPar.sizeA * 2,
				legProfPar: profPar,
			}
			var frame = drawTableBaseFrame(framePar).mesh;
			frame.position.y = par.height;
			frame.position.z = profPar.sizeA;
			par.mesh.add(frame);
		}
		if (par.model == "T-4") {
			var width = par.width / 2
			var len = par.len / 2
			var p0 = { x: 0, y: 0 };
			var p1 = newPoint_xy(p0, -width / 2, -len / 2);
			var p2 = newPoint_xy(p0, -width / 2, len / 2);
			var p3 = newPoint_xy(p0, width / 2, len / 2);
			var p4 = newPoint_xy(p0, width / 2, -len / 2);

			var meshPar = {
				points: [p1, p2, p3, p4],
				thk: 4,
			}

			//левая передняя нога
			var pole1 = drawMesh(meshPar).mesh;
			pole1.rotation.x = -Math.PI / 2;
			pole1.position.x = par.width / 2 - profPar.sizeB;
			pole1.position.z = par.len / 2;
			par.mesh.add(pole1);
		}
	}
	
	//центр в точке 0,0
	var box3 = new THREE.Box3().setFromObject(par.mesh);
	par.mesh.position.x -= (box3.max.x + box3.min.x) / 2;
	par.mesh.position.z -= (box3.max.z + box3.min.z) / 2;
	
	return par;
}


/** функция отрисовывает столешницу
	@param model
	@param thk
	@param width
	@param len
*/
function drawCountertop(par){
	initPar(par)
	
	if(par.model != "цельная") par.width = (par.width - par.partsGap) / 2;

	var p0 = {x: 0, y:0};
	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p0, 0, par.len);
	var p3 = newPoint_xy(p0, par.width, par.len);
	var p4 = newPoint_xy(p0, par.width, 0);
	
	
	
	var points = [p1, p2, p3, p4];
	
	if(par.model != "цельная"){
		points[2].filletRad = points[3].filletRad = 1
	}
	
	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		//radIn: radIn, //Радиус скругления внутренних углов
		radOut: par.cornerRad, //радиус скругления внешних углов
		//markPoints: true,
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;
	
	var extrudeOptions = {
        amount: par.thk,
        bevelEnabled: false,
        curveSegments: 12,
        steps: 1
		};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.timber);
	mesh.rotation.x = Math.PI / 2;
	par.mesh.add(mesh);

	if(par.model != "цельная"){
		var mesh = new THREE.Mesh(geom, params.materials.timber);
		mesh.rotation.x = -Math.PI / 2;
		mesh.rotation.y = Math.PI;
	//	mesh.position.y = -par.thk;
		mesh.position.x = par.width * 2+ par.partsGap;
		mesh.position.z = par.len;
		par.mesh.add(mesh);
	}
	
	//сохраняем данные для спецификации
	par.partName = "countertop";
	par.thk = params.countertopThk;
	if(typeof specObj !='undefined' && par.partName){
		if(!specObj[par.partName]){
			specObj[par.partName] = {
				types: {},
				amt: 0,
				name: "Столешница",
				area: 0,
				paintedArea: 0,
				paintedArea: 0,
				metalPaint: false,
				timberPaint: true,
				division: "timber",
				group: "Каркас",
				}
			}
		var area = par.len * par.width / 1000000;
		var paintedArea = area * 2 + (par.len + par.width) * 2 * par.thk / 1000000;
		
		var name = Math.round(par.len) + "x" + Math.round(par.width) + "x" + Math.round(par.thk);
		if(specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] += 1;
		if(!specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] = 1;
		specObj[par.partName]["amt"] += 1;
		specObj[par.partName]["area"] += area;
		specObj[par.partName]["paintedArea"] += paintedArea;
	}
	
	//центр в точке 0,0
	var box3 = new THREE.Box3().setFromObject(par.mesh);
	par.mesh.position.x -= (box3.max.x + box3.min.x) / 2;
	par.mesh.position.z -= (box3.max.z + box3.min.z) / 2;
	
	return par;
}

/** функция возвращает параметры подстолья по модели
	@param model
*/

function getTableBasePar(par){
	par.roundOnly = false; //подходит только для круглых столов
	par.partsAmt = 2; //из скольки одинаковых частей состоит
	
	var models = ["S-9", "T-17"]
	if(models.indexOf(par.model) != -1){
		par.roundOnly = true;
	}
	
	var models = ['S-1', 'S-6', 'S-9', 'T-6', 'T-7', 'T-9', 'T-10', 'T-12', 'T-16', 'T-17',]
	if(models.indexOf(par.model) != -1){
		par.partsAmt = 1;
	}
	
	//профили
	par.legProf = "60х30";
	if(par.width > 600) par.legProf = "80х40";
	if(par.width > 800) par.legProf = "100х40";
	
	return par;
}

/** функция отрисовывает верхнюю пластину подстолья
*/

function drawTableBasePlate(par){
	initPar(par)
	
	if(!par.thk) par.thk = 8;
	if(!par.cornerRad) par.cornerRad = 10;

	var p0 = {x: 0, y:0};
	
	//углы без учета вырезов
	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p0, 0, par.width);
	var p3 = newPoint_xy(p0, par.len, par.width);
	var p4 = newPoint_xy(p0, par.len, 0);
	
	p2.filletRad = p3.filletRad = par.cornerRad

	if (par.notch == 0) {
		p1.filletRad = p4.filletRad = par.cornerRad
		var points = [p1, p2, p3, p4];
	}
	
	//вырезы
	if (par.notch !== 0) {
		var p11 = newPoint_xy(p1, par.legProfPar.sizeB, 0)
		var p12 = newPoint_xy(p1, par.legProfPar.sizeB, par.legProfPar.sizeA)
		if (par.ang) p12 = newPoint_xy(p1, par.legProfPar.sizeB, par.legProfPar.sizeA * Math.cos(par.ang))
		var p13 = newPoint_xy(p1, 0, par.legProfPar.sizeA)

		var p41 = newPoint_xy(p4, 0, par.legProfPar.sizeA)
		var p42 = newPoint_xy(p4, -par.legProfPar.sizeB, par.legProfPar.sizeA)
		if (par.ang) p42 = newPoint_xy(p4, -par.legProfPar.sizeB, par.legProfPar.sizeA * Math.cos(par.ang))
		var p43 = newPoint_xy(p4, -par.legProfPar.sizeB, 0)

		var points = [p11, p12, p13, p2, p3, p41, p42, p43];

		if (par.notch == 2) {
			var pt1 = newPoint_xy(p1, 0, -distance(p13, p2))
			var pt4 = newPoint_xy(p4, 0, -distance(p41, p3))
			pt1.filletRad = pt4.filletRad = par.cornerRad
			points.push(p4, pt4, pt1, p1)
		}
	}

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		//radIn: radIn, //Радиус скругления внутренних углов
	//	radOut: 0, //радиус скругления внешних углов
		//markPoints: true,
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;
	
	var extrudeOptions = {
        amount: par.thk,
        bevelEnabled: false,
        curveSegments: 12,
        steps: 1
		};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.metal);
	mesh.rotation.x = Math.PI / 2;
	par.mesh.add(mesh);
	
	return par;
}

/** функция отрисовывает верхнюю раму подстолья
*/

function drawTableBaseFrame(par) {
	initPar(par)

	var framePar = getTableBaseFramePar();
	par.framePar = framePar;

	var polePar = {
		poleProfileY: framePar.beamProfileY,
		poleProfileZ: framePar.beamProfileZ,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
		length: par.len - framePar.holder.thkPlate * 2,
		poleAngle: 0,
	}

	//передняя траверса
	var pole1 = drawPole3D_4(polePar).mesh;
	pole1.position.x = framePar.beamProfileZ - par.legProfPar.sizeB;
	pole1.position.y = -framePar.beamProfileY;
	pole1.position.z = framePar.holder.thkPlate;
	pole1.rotation.y = -Math.PI / 2;
	par.mesh.add(pole1);

	//задняя траверса
	var pole2 = drawPole3D_4(polePar).mesh;
	pole2.position.x = par.width - par.legProfPar.sizeB;
	pole2.position.z = pole1.position.z;
	pole2.position.y = pole1.position.y;
	pole2.rotation.y = pole1.rotation.y;
	par.mesh.add(pole2);

	//перемычки
	var bridgePar = {
		profileY: framePar.bridgeProfileY,
		profileZ: framePar.bridgeProfileZ,
		len: par.width - framePar.beamProfileZ * 2,
	}

	var bridge1 = drawTableBaseFrameBridge(bridgePar).mesh;
	bridge1.position.x = pole1.position.x;
	bridge1.position.z = framePar.bridgeOffset + framePar.holder.thkPlate;
	par.mesh.add(bridge1);

	var bridge2 = drawTableBaseFrameBridge(bridgePar).mesh;
	bridge2.rotation.y = Math.PI;
	bridge2.position.x = bridge1.position.x + bridgePar.len;
	bridge2.position.z = par.len - framePar.bridgeOffset - framePar.holder.thkPlate// - framePar.bridgeProfileZ;
	par.mesh.add(bridge2);

	var bridge3 = drawTableBaseFrameBridge(bridgePar).mesh;
	bridge3.position.x = bridge1.position.x;
	bridge3.position.z = par.len / 2 - bridgePar.profileZ - bridgePar.platePar.width / 2;
	par.mesh.add(bridge3);

	//кронштейны крепления рамки к ногам
	var holderPar = framePar.holder;
	holderPar.beamProfileY = framePar.beamProfileY;

	for (var i = 0; i < 2; i++) {
		var holder1 = drawTableBaseFrameHolder(holderPar).mesh;
		holder1.position.x = pole1.position.x - framePar.beamProfileZ;
		holder1.position.y = -holderPar.beamProfileY;
		if (i == 1) {
			holder1.rotation.y = Math.PI;
			holder1.position.x += holderPar.width;
			holder1.position.z = par.len;
		}
		par.mesh.add(holder1);

		var holder2 = drawTableBaseFrameHolder(holderPar).mesh;
		holder2.position.x = pole2.position.x - holderPar.width;
		holder2.position.y = -holderPar.beamProfileY;
		if (i == 1) {
			holder2.rotation.y = Math.PI;
			holder2.position.x += holderPar.width;
			holder2.position.z = par.len;
		}
		par.mesh.add(holder2);
	}

	return par;
}

/** функция отрисовывает перемычку верхней рамы подстолья
*/

function drawTableBaseFrameBridge(par) {
	initPar(par)

	var polePar = {
		poleProfileY: par.profileY,
		poleProfileZ: par.profileZ,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
		length: par.len,
		poleAngle: 0,
	}

	var pole1 = drawPole3D_4(polePar).mesh;
	pole1.position.y = -par.profileY;
	par.mesh.add(pole1);


	//пластины крепления столешницы
	var offsetSide = 20;
	var offsetCenter = 50;
	var platePar = {
		width: 40,
		length: 50,
		thk: 2,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
	}

	par.platePar = platePar;

	var plate1 = drawTableBaseFrameBridgePlate(platePar).mesh;
	plate1.position.x = offsetSide + platePar.length;
	plate1.position.z = par.profileZ;
	par.mesh.add(plate1);

	var plate2 = drawTableBaseFrameBridgePlate(platePar).mesh;
	plate2.position.x = par.len - offsetSide;
	plate2.position.z = par.profileZ;
	par.mesh.add(plate2);

	var plate3 = drawTableBaseFrameBridgePlate(platePar).mesh;
	plate3.position.x = par.len / 2 - offsetCenter;
	plate3.position.z = par.profileZ;
	par.mesh.add(plate3);

	var plate4 = drawTableBaseFrameBridgePlate(platePar).mesh;
	plate4.position.x = par.len / 2 + offsetCenter + platePar.length;
	plate4.position.z = par.profileZ;
	par.mesh.add(plate4);


	return par;
}

/** функция отрисовывает пластину перемычки крепления столешницы верхней рамы подстолья
*/

function drawTableBaseFrameBridgePlate(par) {
	initPar(par)

	var p0 = { x: 0, y: 0 };
	var p1 = copyPoint(p0);;
	var p2 = newPoint_xy(p0, 0, par.length);
	var p3 = newPoint_xy(p2, par.width, 0);
	var p4 = newPoint_xy(p1, par.width, 0);
	p3.filletRad = p4.filletRad = 10;

	//создаем шейп
	var shapePar = {
		points: [p1, p2, p3, p4],
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
	}

	var shape = drawShapeByPoints2(shapePar).shape;

	center = newPoint_xy(p0, par.width / 2, par.length / 2);
	addOvalHoleY(shape, dxfPrimitivesArr, center, 6, par.length - 30, dxfBasePoint, true);

	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.metal);
	mesh.rotation.x = Math.PI / 2;
	mesh.rotation.z = Math.PI / 2;

	par.mesh.add(mesh);

	return par;
}

/** функция отрисовывает кронштейн верхней рамы подстолья
*/

function drawTableBaseFrameHolder(par) {
	initPar(par)

	var p0 = { x: 0, y: 0 };

	// вертикальная планка крепления кронштейна к ноге
	var p1 = copyPoint(p0);;
	var p2 = newPoint_xy(p0, 0, par.beamProfileY);
	var p3 = newPoint_xy(p2, par.width, 0);
	var p4 = newPoint_xy(p1, par.width, 0);
	p1.filletRad = p2.filletRad = p3.filletRad = p4.filletRad = 5;

	//создаем шейп
	var shapePar = {
		points: [p1, p2, p3, p4],
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
	}

	var shape = drawShapeByPoints2(shapePar).shape;

	center = newPoint_xy(p0, par.width / 4, (par.beamProfileY - par.height) / 2);
	addOvalHoleY(shape, dxfPrimitivesArr, center, 6, par.beamProfileY - par.height - 30, dxfBasePoint, true);

	center = newPoint_xy(center, par.width / 2, 0);
	addOvalHoleY(shape, dxfPrimitivesArr, center, 6, par.beamProfileY - par.height - 30, dxfBasePoint, true);

	var extrudeOptions = {
		amount: par.thkPlate,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.metal);

	par.mesh.add(mesh);


	//обрезок трубы-----------------------------------
	var p1 = copyPoint(p0);;
	var p2 = newPoint_xy(p1, 0, par.width);
	var p3 = newPoint_xy(p2, par.length, 0);
	var p4 = newPoint_xy(p1, par.length, 0);
	p1.filletRad = p2.filletRad = p3.filletRad = p4.filletRad = 5;

	//создаем шейп
	var shapePar = {
		points: [p1, p2, p3, p4],
		dxfArr: [],
		dxfBasePoint: par.dxfBasePoint,
	}

	var shape = drawShapeByPoints2(shapePar).shape;

	// отрисовка центрального отверстия
	var thk = 2;
	var pt1 = newPoint_xy(p1, thk, thk);
	var pt2 = newPoint_xy(p2, thk, -thk);
	var pt3 = newPoint_xy(p3, -thk, -thk);
	var pt4 = newPoint_xy(p4, -thk, thk);

	var filletParams = {
		vertexes: [pt1, pt2, pt3, pt4],
		cornerRad: 5,
		dxfBasePoint: par.dxfBasePoint,
		dxfPrimitivesArr: [],
		type: "path"
	}

	hole = fiiletPathCorners(filletParams);
	shape.holes.push(hole);

	var extrudeOptions = {
		amount: par.height,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.metal);
	mesh.rotation.x = -Math.PI / 2;
	mesh.rotation.z = -Math.PI / 2;
	mesh.position.y = par.beamProfileY - par.height;
	mesh.position.z = -par.length;

	par.mesh.add(mesh);

	//горизонтальная планка под обрезок трубы------------------------------
	var p1 = copyPoint(p0);;
	var p2 = newPoint_xy(p1, 0, par.width - 5);
	var p3 = newPoint_xy(p2, par.length - 5, 0);
	var p4 = newPoint_xy(p1, par.length - 5, 0);
	p1.filletRad = p2.filletRad = p3.filletRad = p4.filletRad = 5;

	//создаем шейп
	var shapePar = {
		points: [p1, p2, p3, p4],
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
	}

	var shape = drawShapeByPoints2(shapePar).shape;

	center = newPoint_xy(p0, (par.length - 5) / 2, (par.width - 5) / 2);
	addOvalHoleY(shape, dxfPrimitivesArr, center, 6, 20, dxfBasePoint, true);


	var extrudeOptions = {
		amount: par.thkPlate,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.metal);
	mesh.rotation.x = -Math.PI / 2;
	mesh.rotation.z = -Math.PI / 2;
	mesh.position.y = par.beamProfileY - par.height;
	mesh.position.z = -par.length + 5 /2;
	mesh.position.x = 5 /2;

	par.mesh.add(mesh);

	return par;
}

/** функция отрисовывает ногу подстолья
*/

function drawTableBaseleg(par) {
	initPar(par)

	var p0 = { x: 0, y: 0 };
	var pt = newPoint_xy(p0, 0, par.height);

	var p1 = copyPoint(p0);;
	var p2 = itercection(p1, polar(p1, Math.PI / 2 - par.angInclination, 100), pt, polar(pt, 0, 100));
	var line = parallel(p1, p2, -par.profPar.sizeA)
	var p3 = itercection(line.p1, line.p2, pt, polar(pt, 0, 100));
	var p4 = itercection(line.p1, line.p2, p1, polar(p1, 0, 100));

	var meshPar = {
		points: [p1, p2, p3, p4],
		thk: par.profPar.sizeB,
	}

	var mesh = drawMesh(meshPar).mesh;

	par.mesh.add(mesh);

	return par;
}

/** функция возвращает параметры верхней рамы подстолья
*/
function getTableBaseFramePar() {

	var framePar = {
		beamProfileY: 60,
		beamProfileZ: 30,
		bridgeProfileY: 40,
		bridgeProfileZ: 20,
		bridgeOffset: 100,
	}

	// параметры кронштейна
	framePar.holder = {
		width: 60,
		length: 40,
		height: 20,
		thkPlate: 4,
	}

	return framePar;
}

