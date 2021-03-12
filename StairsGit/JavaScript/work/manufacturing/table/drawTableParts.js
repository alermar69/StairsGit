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
	
	par.prodPar = []; //размеры для производства
	console.log(par)

	var thk = 8;
	var widthFlanTop = 100;
	var turn = 1;

	var p0 = { x: 0, y: 0 };

	//точки контура подстолья
	var pt1 = copyPoint(p0);
	var pt2 = newPoint_xy(pt1, 0, par.len);
	var pt3 = newPoint_xy(pt2, par.width, 0);
	var pt4 = newPoint_xy(pt1, par.width, 0);

	
	for (var i = 0; i < modelPar.partsAmt; i++){

		if (i > 0 && modelPar.partsAmt == 2 && par.oneSideLegs == 'да') continue
		if (i == 1) turn = -1;

		
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
			if (par.model == "T-4") {				
				ang = Math.atan(par.len / 2 / (par.height - thk)); //примерный угол
				//первое приближение
				var cutLen = profPar.sizeA / Math.cos(ang)
				ang = Math.atan((par.len / 2 - cutLen) / (par.height - thk));
				//второе приближение
				cutLen = profPar.sizeA / Math.cos(ang)
				ang = Math.atan((par.len / 2 - cutLen) / (par.height - thk));
			}

			var p0 = { x: 0, y: 0 };
			var pt = newPoint_xy(p0, 0, par.height);
			if (par.model == "T-4") pt.y -= 8;

			var p1 = copyPoint(p0);
			//if (par.model == "T-4") p1.y += 8;
			var p2 = itercection(p1, polar(p1, Math.PI / 2 - ang, 100), pt, polar(pt, 0, 100));
			var line = parallel(p1, p2, -profPar.sizeA)
			var p3 = itercection(line.p1, line.p2, pt, polar(pt, 0, 100));
			var p4 = itercection(line.p1, line.p2, p1, polar(p1, 0, 100));

			var meshPar = {
				points: [p1, p2, p3, p4],
				thk: profPar.sizeB,
				material: params.materials.additionalObjectMetal,
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: {x: 0, y: par.height * (i + 1)},
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
					material: params.materials.additionalObjectMetal,
					poleAngle: 0,
				}

				var pole3 = drawPole3D_4(polePar).mesh;
				pole3.position.z = posZ;
				if (par.model == "T-3") pole3.position.z -= par.height * Math.tan(ang) * turn;
				par.mesh.add(pole3);
			}

			//верхняя пластина
			
			
			var platePar = {
				width: profPar.sizeB / Math.cos(ang) + 20,
				len: par.width,
				legProfPar: profPar,
				notch: 1,
				ang: ang,
			}
			if (par.model == "T-3") platePar.notch = 2;
			if (par.model == "T-4") platePar.notch = 0;
			if(platePar.width < 100) platePar.width = 100;
			
			var plate = drawTableBasePlate(platePar).mesh;
			plate.position.x = -profPar.sizeB;
			
			plate.position.y = par.height;
			plate.position.z = posZ;
			if(i==1) {
				plate.rotation.x = Math.PI
				plate.position.y -= platePar.thk
				plate.position.z += profPar.sizeA
			}
			
		//	if (par.model == "T-4") plate.position.z -= profPar.sizeA * turn
			
			par.mesh.add(plate);
			
			//размеры для производства
			par.prodPar.A = Math.round(par.len);
			par.prodPar.L = Math.round(distance(p1, p2));
			par.prodPar.f = Math.round(ang * 180 / Math.PI * 10) / 10 + "гр.";
		}

		if (par.model == "K-1"){
			console.log(i)
			var fixingStep = par.width / par.fixingAmt;

			var posZ = 0;
			if (i == 1) posZ = par.len;

			for (var j = 0; j < par.fixingAmt; j++) {
				var mesh = drawTableFixing();
				if (i == 1)	mesh.rotation.y = Math.PI;
				mesh.position.z = posZ;
				mesh.position.y = par.height
				mesh.position.x = fixingStep * j;

				par.mesh.add(mesh)
			}
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
			
			//размеры для производства
			par.prodPar.A = Math.round(polePar.length);
			
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
				material: params.materials.additionalObjectMetal
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
		if (par.model == "T-6" || par.model == "T-12") {
			var mesh = new THREE.Object3D();

			if (par.model == "T-12") profPar.sizeA = profPar.sizeB;

			var ang = Math.atan(par.len / par.width); // угол диагонали

			if (par.model == "T-12") {
				var pt11 = newPoint_xy(pt1, profPar.sizeB / 2, widthFlanTop / 2 - profPar.sizeB / 2)
				var pt31 = newPoint_xy(pt3, -profPar.sizeB / 2, -widthFlanTop / 2 + profPar.sizeB / 2)
				ang = calcAngleX1(pt11, pt31)
			}

			//точки ноги, вид сверху
			var p1 = copyPoint(pt1);
			if (par.model == "T-12") p1 = copyPoint(pt11);

			p1 = polar(p1, Math.PI / 2 + ang, profPar.sizeB / 2)
			var p2 = polar(p1, ang, profPar.sizeA)
			var p3 = polar(p2, Math.PI / 2 + ang, -profPar.sizeB)
			var p4 = polar(p3, ang, -profPar.sizeA)
			var points = [p1, p2, p3, p4];

			var meshPar = {
				points: [p1, p2, p3, p4],
				thk: par.height,
				material: params.materials.additionalObjectMetal
			}
			if (par.model == "T-12") meshPar.thk -= thk;

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

			//диагональная длинная перекладина
			var count = 2;
			if (par.model == "T-12") count = 1;

			for (var j = 0; j < count; j++) {
				var points5 = [points4[2], points2[1], points2[2], points4[1]]
				meshPar.points = points5
				meshPar.thk = profPar.sizeB
				var pole1 = drawMesh(meshPar).mesh;
				if (j == 1) pole1.position.z = par.height - meshPar.thk;
				mesh.add(pole1);
			}

			//диагональная короткая перекладина
			for (var j = 0; j < count; j++) {
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


			//верхняя пластина-------------
			if (par.model == "T-12") {
				var p1 = copyPoint(p0)
				var p2 = newPoint_xy(p1, 0, widthFlanTop)
				var p3 = newPoint_xy(p2, par.width, 0)
				var p4 = newPoint_xy(p1, par.width, 0)
				var pointsTop = [p1, p2, p3, p4]

				var meshPar = {
					points: pointsTop,
					thk: thk,
					material: params.materials.additionalObjectMetal
				}

				var pole1 = drawMesh(meshPar).mesh;
				pole1.position.z = par.height - thk
				mesh.add(pole1);

				//---------
				pointsTop = mirrowPoints(pointsTop, 'y')
				pointsTop = mirrowPoints(pointsTop, 'x')
				pointsTop = moovePoints(pointsTop, pt3)
				meshPar.points = pointsTop;

				var pole1 = drawMesh(meshPar).mesh;
				pole1.position.z = par.height - thk
				mesh.add(pole1);
			}


			mesh.rotation.x = -Math.PI / 2
			par.mesh.add(mesh);
		}

		//модель T-7
		if (par.model == "T-7") {
			var mesh = new THREE.Object3D();

			var angInclination = toRadians(8); //угол наклона 


			//точки ноги, вид сбоку
			var height1 = par.height - thk * 2;

			var pt = newPoint_xy(p0, 0, height1);

			var p1 = copyPoint(p0)
			var p2 = itercection(p0, polar(p0, Math.PI / 2 - angInclination, 100), pt, polar(pt, 0, 100));
			var line = parallel(p1, p2, -profPar.sizeA);
			var p3 = itercection(line.p1, line.p2, pt, polar(pt, 0, 100));
			var p4 = itercection(line.p1, line.p2, p0, polar(p0, 0, 100));
			var points = [p1, p2, p3, p4];

			var meshPar = {
				points: points,
				thk: profPar.sizeB,
				material: params.materials.additionalObjectMetal
			}

			//левая нога
			var pole1 = drawMesh(meshPar).mesh;
			mesh.add(pole1);

			//правая нога
			var points2 = mirrowPoints(points, 'y')
			points2 = moovePoints(points2, newPoint_xy(p0, par.len, 0))
			meshPar.points = points2
			var pole1 = drawMesh(meshPar).mesh;
			mesh.add(pole1);

			mesh.rotation.y = Math.PI / 2;
			mesh.position.y = thk;
			mesh.position.x = par.width / 2 + profPar.sizeB / 2;

			par.mesh.add(mesh)

			//-------------------------------

			var pt1 = newPoint_xy(p0, 0, height1 / 3 * 2);
			pt1 = itercection(pt1, polar(pt1, 0, 100), points[2], polar(points[2], -Math.PI / 4, 100));
			var line1 = parallel(pt1, polar(pt1, 0, 100), profPar.sizeA / 2);
			var line2 = parallel(pt1, polar(pt1, 0, 100), -profPar.sizeA / 2);

			var line3 = parallel(points[3], polar(points[3], calcAngleX1(points[3], pt1), 100), -profPar.sizeA);
			var line4 = parallel(points[2], pt1, profPar.sizeA);

			var p1 = itercectionLines(line3, line2);
			var p2 = itercection(line3.p1, line3.p2, p0, polar(p0, 0, 100));
			var p3 = copyPoint(points[3])
			var p4 = copyPoint(pt1)
			var p5 = copyPoint(points[2])
			var p6 = itercection(line4.p1, line4.p2, pt, polar(pt, 0, 100));
			var p7 = itercectionLines(line4, line1);

			var points3 = [p1, p2, p3, p4, p5, p6, p7];
			var points4 = mirrowPoints(points3, 'y')
			points4 = moovePoints(points4, newPoint_xy(p0, par.len, 0))
			points4.reverse();
			points3.push(...points4)

			var meshPar = {
				points: points3,
				thk: profPar.sizeB,
				material: params.materials.additionalObjectMetal
			}

			var pole1 = drawMesh(meshPar).mesh;
			pole1.rotation.y = Math.PI / 2;
			pole1.position.y = thk;
			pole1.position.x = par.width / 2 + profPar.sizeB / 2;

			par.mesh.add(pole1)

			//верхний, нижний фланец-----------------------------
			var mesh = new THREE.Object3D();

			//верхний-------------
			var p1 = newPoint_xy(p0, 0, points[1].x)
			var p2 = newPoint_xy(p0, 0, points3[5].x)
			var p3 = newPoint_xy(p2, par.width, 0)
			var p4 = newPoint_xy(p1, par.width, 0)
			var pointsTop1 = [p1, p2, p3, p4];

			var meshPar = {
				points: pointsTop1,
				thk: thk,
				material: params.materials.additionalObjectMetal
			}

			//левый фланец
			var pole1 = drawMesh(meshPar).mesh;
			pole1.position.z = par.height - thk;
			mesh.add(pole1);

			//правый фланец
			var pointsTop2 = mirrowPoints(pointsTop1, 'x')
			pointsTop2 = moovePoints(pointsTop2, newPoint_xy(p0, 0, par.len))
			meshPar.points = pointsTop2
			var pole1 = drawMesh(meshPar).mesh;
			pole1.position.z = par.height - thk;
			mesh.add(pole1);

			//нижний-------------
			var p1 = copyPoint(p0)
			var p2 = newPoint_xy(p0, 0, points3[1].x)
			var p3 = newPoint_xy(p2, par.width, 0)
			var p4 = newPoint_xy(p1, par.width, 0)
			var pointsBot1 = [p1, p2, p3, p4];

			var meshPar = {
				points: pointsBot1,
				thk: thk,
				material: params.materials.additionalObjectMetal
			}

			//левый фланец
			var pole1 = drawMesh(meshPar).mesh;
			mesh.add(pole1);

			//правый фланец
			var pointsBot2 = mirrowPoints(pointsBot1, 'x')
			pointsBot2 = moovePoints(pointsBot2, newPoint_xy(p0, 0, par.len))
			meshPar.points = pointsBot2
			var pole1 = drawMesh(meshPar).mesh;
			mesh.add(pole1);

			mesh.rotation.x = -Math.PI / 2
			par.mesh.add(mesh);
		}

		//модель T-8
		if (par.model == "T-8") {
			var mesh = new THREE.Object3D();

			var angInclination = toRadians(15); //угол наклона 


			//точки ноги, вид сбоку
			var height1 = par.height - thk;
			var offset = 200;

			var pt = newPoint_xy(p0, 0, height1);

			var p1 = newPoint_xy(p0, offset, 0)
			var p2 = itercection(p1, polar(p1, Math.PI / 2 + angInclination, 100), pt, polar(pt, 0, 100));
			var line = parallel(p1, p2, profPar.sizeA);
			var p3 = itercection(line.p1, line.p2, pt, polar(pt, 0, 100));
			var p4 = itercection(line.p1, line.p2, p0, polar(p0, 0, 100));
			var points = [p1, p2, p3, p4];

			var meshPar = {
				points: points,
				thk: profPar.sizeB,
				material: params.materials.additionalObjectMetal
			}

			//левая нога
			var pole1 = drawMesh(meshPar).mesh;
			mesh.add(pole1);

			//правая нога
			var points2 = mirrowPoints(points, 'y')
			points2 = moovePoints(points2, newPoint_xy(p0, par.len, 0))
			meshPar.points = points2
			var pole1 = drawMesh(meshPar).mesh;
			mesh.add(pole1);

			mesh.rotation.y = Math.PI / 2;
			if (i == 1) mesh.position.x = par.width - profPar.sizeB;

			par.mesh.add(mesh)

			//----------------------------------
			var p1 = copyPoint(p0)
			var p2 = newPoint_xy(p1, 0, profPar.sizeA);
			var p3 = itercection(points[0], points[1], p2, polar(p2, 0, 100));
			var p4 = itercection(points[0], points[1], p1, polar(p1, 0, 100));
			var points1 = [p1, p2, p3, p4];

			var meshPar = {
				points: points1,
				thk: profPar.sizeB,
				material: params.materials.additionalObjectMetal
			}

			//левая нога
			var pole1 = drawMesh(meshPar).mesh;
			mesh.add(pole1);

			//правая нога
			var points2 = mirrowPoints(points1, 'y')
			points2 = moovePoints(points2, newPoint_xy(p0, par.len, 0))
			meshPar.points = points2
			var pole1 = drawMesh(meshPar).mesh;
			mesh.add(pole1);

			mesh.rotation.y = Math.PI / 2;
			if (i == 1) mesh.position.x = par.width - profPar.sizeB;

			par.mesh.add(mesh)


			//верхний, нижний фланец-----------------------------
			var mesh = new THREE.Object3D();

			//верхний-------------
			var offset = points[1].x + (points[2].x - points[1].x) / 2

			var p1 = newPoint_xy(p0, 0, offset - 100 / 2)
			var p2 = newPoint_xy(p0, 0, offset + 100 / 2)
			var p3 = newPoint_xy(p2, par.width, 0)
			var p4 = newPoint_xy(p1, par.width, 0)

			var pointsTop = [p1, p2, p3, p4];
			if (i == 0) {
				pointsTop = mirrowPoints(pointsTop, 'x')
				pointsTop = moovePoints(pointsTop, newPoint_xy(p0, 0, par.len))
			}

			var meshPar = {
				points: pointsTop,
				thk: thk,
				material: params.materials.additionalObjectMetal
			}

			var pole1 = drawMesh(meshPar).mesh;
			pole1.position.z = par.height - thk;
			mesh.add(pole1);

			//нижний-------------
			var p1 = newPoint_xy(p0, profPar.sizeB, 0)
			var p2 = newPoint_xy(p1, 0, profPar.sizeB)
			var p3 = newPoint_xy(p2, par.width - profPar.sizeB * 2, 0)
			var p4 = newPoint_xy(p1, par.width - profPar.sizeB * 2, 0)

			var pointsBot = [p1, p2, p3, p4];
			if (i == 0) {
				pointsBot = mirrowPoints(pointsBot, 'x')
				pointsBot = moovePoints(pointsBot, newPoint_xy(p0, 0, par.len))
			}

			var meshPar = {
				points: pointsBot,
				thk: profPar.sizeA,
				material: params.materials.additionalObjectMetal
			}

			var pole1 = drawMesh(meshPar).mesh;
			mesh.add(pole1);

			mesh.rotation.x = -Math.PI / 2
			par.mesh.add(mesh);
		}

		//модель T-9
		if (par.model == "T-9") {
			
			var mesh = new THREE.Object3D();
			var width = par.width;
			if(par.partsAmt == 4 && i % 2) width = par.len
			var flanThk = 4;
			var flanOffset = 20
			var halfWidth = width / 2 - par.legProfPar.sizeB / 2 - flanOffset
			
			var ang = Math.atan( halfWidth / (par.height / 2 - flanThk) ) // угол наклона верхней палки подстолья
			//первое приближение
			var L5 = par.legProfPar.sizeA / Math.sin(ang)			
			ang = Math.atan( halfWidth / (par.height / 2 - flanThk + L5 / 2) )
			
			//второе приближение
			var L5 = par.legProfPar.sizeA / Math.sin(ang)			
			ang = Math.atan( halfWidth / (par.height / 2 - flanThk + L5 / 2) )
			var centerPoint = {x: par.legProfPar.sizeB / 2, y: par.height / 2}
			
			var cutLenTop = par.legProfPar.sizeA / Math.cos(ang) //примерная цифра
	
			//ось верхней палки
			var topPoleAxis = {
				p1: copyPoint(centerPoint),
				p2: {
					x: width / 2 - cutLenTop / 2 - flanOffset,
					y: par.height - flanThk,
				}
			}
			
			//ось нижней палки
			var botPoleAxis = {
				p1: copyPoint(centerPoint),
				p2: {
					x: width / 2 - cutLenTop / 2,
					y: 0,
				}
			}
			
			//верхняя палка
			var topPoleLines = {
				top: parallel(topPoleAxis.p1, topPoleAxis.p2,  par.legProfPar.sizeA / 2 ),
				bot: parallel(topPoleAxis.p1, topPoleAxis.p2,  -par.legProfPar.sizeA / 2 ),
			}
			
			//нижняя палка
			var botPoleLines = {
				top: parallel(botPoleAxis.p1, botPoleAxis.p2,  par.legProfPar.sizeA / 2 ),
				bot: parallel(botPoleAxis.p1, botPoleAxis.p2,  -par.legProfPar.sizeA / 2),
			}
			
			var leftLine = {
				p1: {x: par.legProfPar.sizeB / 2, y: 0},
				p2: {x: par.legProfPar.sizeB / 2, y: par.height},
			}
			
			var botLine = {
				p1: {x: 0, y: 0},
				p2: {x: 100, y: 0},
			}
			
			var topLine = {
				p1: {x: 0, y: par.height - flanThk},
				p2: {x: 100, y: par.height - flanThk},
			}
			
			//верхняя палка
			var p1 = itercectionLines(leftLine, topPoleLines.top);
			//var p1 = topPoleLines.top.p1
			var p2 = itercectionLines(topLine, topPoleLines.top);
			var p3 = itercectionLines(topLine, topPoleLines.bot);
			var p4 = itercectionLines(leftLine, topPoleLines.bot);
			//var p4 = topPoleLines.bot.p1
			
			var meshPar = {
				points: [p1, p2, p3, p4],
				thk: par.legProfPar.sizeB,
				material: params.materials.additionalObjectMetal,
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: {x: 0, y: par.height * (i + 1)},
			}

			var pole = drawMesh(meshPar).mesh;
			pole.position.z = -par.legProfPar.sizeB / 2
			mesh.add(pole);
			
			//нижняя палка
			var p5 = itercectionLines(topPoleLines.bot, botPoleLines.bot);
			//var p5 = botPoleLines.bot.p1
			var p6 = itercectionLines(topPoleLines.bot, botPoleLines.top);
			//var p6 = botPoleLines.top.p1
			var p7 = itercectionLines(botLine, botPoleLines.top);
			var p8 = itercectionLines(botLine, botPoleLines.bot);
			
			var meshPar = {
				points: [p5, p6, p7, p8],
				thk: par.legProfPar.sizeB,
				material: params.materials.additionalObjectMetal,
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: {x: 0, y: par.height * (i + 1)},
			}

			var pole = drawMesh(meshPar).mesh;
			pole.position.z = -par.legProfPar.sizeB / 2
			mesh.add(pole);
			
			//верхний фланец
			var flanPar = {
				width: distance(p2, p3) + flanOffset * 2,
				height: par.legProfPar.sizeB + 50,
				cornerRad: 10,
				thk: 4,
				noBolts: true,
				roundHoleCenters: {},
				holeRad: 9 / 2,
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: {x: 500, y: par.height * (i + 1)},				
			}
			
			var holeOffset = 10;
			flanPar.roundHoleCenters = [
				{x: holeOffset, y: holeOffset},
				{x: flanPar.width - holeOffset, y: holeOffset},
				{x: holeOffset, y: flanPar.height - holeOffset},
				{x: flanPar.width - holeOffset, y: flanPar.height - holeOffset},
			];
			
			var flan = drawRectFlan2(flanPar).mesh;
			flan.rotation.x = Math.PI / 2
			flan.position.y = par.height;
			flan.position.x = p3.x - flanPar.width + flanOffset;
			flan.position.z = -flanPar.height / 2;
			
			mesh.add(flan);

			//профиль-заглушка в центре
			var midPoleLen = 0;
			if((i==0 && par.width <= par.len) || (i==1 && par.width > par.len)){
				midPoleLen = distance(p1, p4);
				
				var pole3DParams = {
					poleProfileY: par.legProfPar.sizeB,
					poleProfileZ: par.legProfPar.sizeB,
					length: midPoleLen,
					poleAngle: Math.PI / 2,
				}
				
				var pole = drawPole3D_4(pole3DParams).mesh
				pole.position.x = par.legProfPar.sizeB / 2
				pole.position.y = p4.y
				pole.position.z = -par.legProfPar.sizeB / 2
				
				mesh.add(pole);				
				
			}
			
			mesh.rotation.y = Math.PI * 2 / par.partsAmt * i
			par.mesh.add(mesh);
			
			//размеры для производства
			
			if(par.len != par.width && i % 2){
				par.prodPar.B = Math.round(p3.x * 2)
				par.prodPar.L3 = Math.round(distance(p3, p4));
				par.prodPar.L4 = Math.round(distance(p6, p7));
			}
			else{
				par.prodPar.A = Math.round(p3.x * 2)
				par.prodPar.L1 = Math.round(distance(p3, p4));
				par.prodPar.L2 = Math.round(distance(p6, p7));
			}
			if(midPoleLen) par.prodPar.L3 = Math.round(midPoleLen); 
			
		}

		//модель T-10
		if (par.model == "T-10") {
			var mesh = new THREE.Object3D();

			//нижняя перемычка
			var p1 = newPoint_xy(p0, par.width, 0)
			var p2 = newPoint_xy(p1, -profPar.sizeB, 0)
			var p3 = newPoint_xy(p2, 0, 200)
			var p4 = newPoint_xy(p1, 0, 200)
			var points = [p1, p2, p3, p4];

			//-------------
			var p1 = newPoint_xy(p0, profPar.sizeB, 0)
			var p2 = newPoint_xy(p1, 0, profPar.sizeB);
			var p3 = newPoint_xy(p2, par.width - profPar.sizeB * 2, 0);
			var p4 = newPoint_xy(p1, par.width - profPar.sizeB * 2, 0);

			var points1 = [p1, p2, p3, p4];

			//верхняя перемычка
			var p1 = newPoint_xy(p0, 0, profPar.sizeB)
			var p2 = newPoint_xy(p0, 0, par.len / 2 + profPar.sizeB / 2);
			var p3 = newPoint_xy(p2, profPar.sizeB, 0);
			var p4 = newPoint_xy(p1, profPar.sizeB, 0);

			var points2 = [p1, p2, p3, p4];

			//нога
			var p1 = copyPoint(p0)
			var p2 = newPoint_xy(p1, 0, profPar.sizeB);
			var p3 = newPoint_xy(p2, profPar.sizeB, 0);
			var p4 = newPoint_xy(p1, profPar.sizeB, 0);

			var points3 = [p1, p2, p3, p4];

			if (i == 1) {
				points = mirrowPoints(points, 'y')
				points = mirrowPoints(points, 'x')
				points = moovePoints(points, newPoint_xy(p0, par.width, par.len))

				points1 = mirrowPoints(points1, 'x')
				points1 = moovePoints(points1, newPoint_xy(p0, 0, par.len))

				points2 = mirrowPoints(points2, 'y')
				points2 = mirrowPoints(points2, 'x')
				points2 = moovePoints(points2, newPoint_xy(p0, par.width, par.len))

				points3 = mirrowPoints(points3, 'y')
				points3 = mirrowPoints(points3, 'x')
				points3 = moovePoints(points3, newPoint_xy(p0, par.width, par.len))
			}

			var meshPar = {
				points: points,
				thk: profPar.sizeB,
				material: params.materials.additionalObjectMetal
			}

			//нижняя перемычка
			var pole1 = drawMesh(meshPar).mesh;
			mesh.add(pole1);

			//--
			meshPar.points = points1
			var pole1 = drawMesh(meshPar).mesh;
			mesh.add(pole1);

			//верхняя перемычка
			meshPar.points = points2
			var pole1 = drawMesh(meshPar).mesh;
			pole1.position.z = par.height - profPar.sizeB;
			mesh.add(pole1);

			//нога
			meshPar.points = points3
			meshPar.thk = par.height
			var pole1 = drawMesh(meshPar).mesh;
			mesh.add(pole1);


			//средняя перемычка
			if (i == 0) {
				var p1 = newPoint_xy(p0, profPar.sizeB, par.len / 2 - profPar.sizeB / 2);
				var p2 = newPoint_xy(p1, 0, profPar.sizeB);
				var p3 = newPoint_xy(p2, par.width - profPar.sizeB * 2, 0);
				var p4 = newPoint_xy(p1, par.width - profPar.sizeB * 2, 0);
				var points4 = [p1, p2, p3, p4];

				var meshPar = {
					points: points4,
					thk: profPar.sizeB,
					material: params.materials.additionalObjectMetal
				}

				var pole1 = drawMesh(meshPar).mesh;
				pole1.position.z = par.height - profPar.sizeB;
				mesh.add(pole1);
			}

			mesh.rotation.x -= Math.PI / 2;
			par.mesh.add(mesh)

		}

		//модель T-11
		if (par.model == "T-11") {
			var mesh = new THREE.Object3D();

			var len = 200;

			var arrLeg = []
			var arrBot = []

			var pt = newPoint_xy(p0, par.width, par.len);

			//ноги-----------------------------------
			var p1 = copyPoint(p0)
			var p2 = newPoint_xy(p1, 0, profPar.sizeB)
			var p3 = newPoint_xy(p2, profPar.sizeB, 0)
			var p4 = newPoint_xy(p1, profPar.sizeB, 0)
			arrLeg.push([p1, p2, p3, p4])

			var p1 = newPoint_xy(p0, 0, len - profPar.sizeB)
			var p2 = newPoint_xy(p1, 0, profPar.sizeB)
			var p3 = newPoint_xy(p2, profPar.sizeB, 0)
			var p4 = newPoint_xy(p1, profPar.sizeB, 0)
			arrLeg.push([p1, p2, p3, p4])

			var p1 = newPoint_xy(p0, par.width - profPar.sizeB, 0)
			var p2 = newPoint_xy(p1, 0, profPar.sizeB)
			var p3 = newPoint_xy(p2, profPar.sizeB, 0)
			var p4 = newPoint_xy(p1, profPar.sizeB, 0)
			arrLeg.push([p1, p2, p3, p4])

			var p1 = newPoint_xy(p0, par.width - profPar.sizeB, len - profPar.sizeB)
			var p2 = newPoint_xy(p1, 0, profPar.sizeB)
			var p3 = newPoint_xy(p2, profPar.sizeB, 0)
			var p4 = newPoint_xy(p1, profPar.sizeB, 0)
			arrLeg.push([p1, p2, p3, p4])

			for (var j = 0; j < arrLeg.length; j++) {
				var points = arrLeg[j]
				if (i == 1) {
					points = mirrowPoints(points, 'y')
					points = mirrowPoints(points, 'x')
					points = moovePoints(points, pt)
				}
				var meshPar = {
					points: points,
					thk: par.height - thk,
					material: params.materials.additionalObjectMetal
				}

				var pole1 = drawMesh(meshPar).mesh;
				mesh.add(pole1);
			}

			//нижняя перемычка-------------------------
			var p1 = newPoint_xy(p0, 0, profPar.sizeB)
			var p2 = newPoint_xy(p0, 0, len - profPar.sizeB)
			var p3 = newPoint_xy(p2, profPar.sizeB, 0)
			var p4 = newPoint_xy(p1, profPar.sizeB, 0)
			arrBot.push([p1, p2, p3, p4])

			var p1 = newPoint_xy(p0, par.width - profPar.sizeB, profPar.sizeB)
			var p2 = newPoint_xy(p1, 0, len - profPar.sizeB * 2)
			var p3 = newPoint_xy(p2, profPar.sizeB, 0)
			var p4 = newPoint_xy(p1, profPar.sizeB, 0)
			arrBot.push([p1, p2, p3, p4])

			var p1 = newPoint_xy(p0, profPar.sizeB, 0)
			var p2 = newPoint_xy(p1, 0, profPar.sizeB)
			var p3 = newPoint_xy(p2, par.width - profPar.sizeB * 2, 0)
			var p4 = newPoint_xy(p1, par.width - profPar.sizeB * 2, 0)
			arrBot.push([p1, p2, p3, p4])

			var p1 = newPoint_xy(p0, profPar.sizeB, len - profPar.sizeB)
			var p2 = newPoint_xy(p1, 0, profPar.sizeB)
			var p3 = newPoint_xy(p2, par.width - profPar.sizeB * 2, 0)
			var p4 = newPoint_xy(p1, par.width - profPar.sizeB * 2, 0)
			arrBot.push([p1, p2, p3, p4])

			for (var j = 0; j < arrBot.length; j++) {
				var points = arrBot[j]
				if (i == 1) {
					points = mirrowPoints(points, 'y')
					points = mirrowPoints(points, 'x')
					points = moovePoints(points, pt)
				}
				var meshPar = {
					points: points,
					thk: profPar.sizeB,
					material: params.materials.additionalObjectMetal
				}

				var pole1 = drawMesh(meshPar).mesh;
				mesh.add(pole1);
			}

			//верхняя пластина-------------
			var p1 = copyPoint(p0)
			var p2 = newPoint_xy(p1, 0, len)
			var p3 = newPoint_xy(p2, par.width, 0)
			var p4 = newPoint_xy(p1, par.width, 0)
			var pointsTop = [p1, p2, p3, p4]

			if (i == 1) {
				pointsTop = mirrowPoints(pointsTop, 'y')
				pointsTop = mirrowPoints(pointsTop, 'x')
				pointsTop = moovePoints(pointsTop, pt)
			}
			var meshPar = {
				points: pointsTop,
				thk: thk,
				material: params.materials.additionalObjectMetal
			}

			var pole1 = drawMesh(meshPar).mesh;
			pole1.position.z = par.height - thk
			mesh.add(pole1);



			mesh.rotation.x -= Math.PI / 2;
			par.mesh.add(mesh)

		}

		//модель T-13
		if (par.model == "T-13") {
			var legType = par.legType
			var legPar = {
				type: legType,
				dxfBasePoint: par.dxfBasePoint,
				height: par.height,
				thk: thk,
				profPar: profPar,
				widthFlanTop: widthFlanTop
			}

			// Ноги стола
			var mesh1 = new THREE.Object3D();

			var leg1 = drawTableLeg(legPar).mesh;
			mesh1.add(leg1);

			var leg2 = drawTableLeg(legPar).mesh;
			if (legType != 'квадратные') {
				leg2.rotation.y = Math.PI / 2
				leg2.position.x += par.width - legPar.legProfile * 2;
			}else{
				leg2.position.x += par.width;
			}
			mesh1.add(leg2);

			if (i == 1) {
				mesh1.rotation.y = Math.PI
				mesh1.position.z -= par.len;
				mesh1.position.x += par.width;
			}
			par.mesh.add(mesh1)
		}

		//модель T-14
		if (par.model == "T-14") {

			var lenFlanTop = Math.floor(par.width / 3)

			if (i == 0) {
				//верхняя пластина-------------
				var p1 = copyPoint(p0)
				var p2 = newPoint_xy(p1, 0, widthFlanTop)
				var p3 = newPoint_xy(p2, lenFlanTop, 0)
				var p4 = newPoint_xy(p1, lenFlanTop, 0)
				var points = [p1, p2, p3, p4]

				var partsPar = {
					points: points,
					width: par.width,
					len: par.len,
					thk: thk,
					posY: par.height - thk,
				}

				var mesh = drawTableBaseParts(partsPar).mesh;

				mesh.rotation.x -= Math.PI / 2;
				par.mesh.add(mesh)

				//ноги-------------
				var mesh = new THREE.Object3D();

				var p1 = newPoint_xy(p0, 0, widthFlanTop / 2 - profPar.sizeB / 2)
				var p2 = newPoint_xy(p1, 0, profPar.sizeB)
				var p3 = newPoint_xy(p2, profPar.sizeB, 0)
				var p4 = newPoint_xy(p1, profPar.sizeB, 0)
				var points = [p1, p2, p3, p4]

				var partsPar = {
					points: points,
					width: par.width,
					len: par.len,
					thk: par.height - thk,
					posY: 0,
				}

				var mesh = drawTableBaseParts(partsPar).mesh;

				mesh.rotation.x -= Math.PI / 2;
				par.mesh.add(mesh)
			}

			//Боковые перемычки-------------------------
			//длинная
			var mesh = new THREE.Object3D();

			var p1 = newPoint_xy(p0, profPar.sizeB, 0)
			var p2 = newPoint_xy(p0, par.width - lenFlanTop, par.height - thk)
			var line = parallel(p1, p2, -profPar.sizeB)
			var p3 = itercection(line.p1, line.p2, p2, polar(p2, 0, 100));
			var p4 = itercection(line.p1, line.p2, p1, polar(p1, 0, 100));
			var points = [p1, p2, p3, p4]

			var meshPar = {
				points: points,
				thk: profPar.sizeB,
				material: params.materials.additionalObjectMetal
			}

			var pole1 = drawMesh(meshPar).mesh;
			mesh.add(pole1);

			//короткая
			points1 = mirrowPoints(points, 'y')
			points1 = moovePoints(points1, pt4)

			var points2 = [points1[3], points1[0]]
			points2.push(itercection(points[2], points[3], points1[0], points1[1]))
			points2.push(itercection(points[2], points[3], points1[2], points1[3]))
			meshPar.points = points2;

			var pole1 = drawMesh(meshPar).mesh;
			mesh.add(pole1);

			//-----------------
			var points3 = [points1[1], points1[2]]
			points3.push(itercection(points[0], points[1], points1[2], points1[3]))
			points3.push(itercection(points[0], points[1], points1[0], points1[1]))
			meshPar.points = points3;

			var pole1 = drawMesh(meshPar).mesh;
			mesh.add(pole1);


			mesh.position.z = -(widthFlanTop / 2 + profPar.sizeB / 2) * turn
			if (i == 1) mesh.position.z -= par.len + profPar.sizeB;

			par.mesh.add(mesh)
		}

		//модель T-15
		if (par.model == "T-15") {

			if (i == 0) {
				//верхняя пластина-------------
				var p1 = copyPoint(p0)
				var p2 = newPoint_xy(p1, 0, widthFlanTop)
				var p3 = newPoint_xy(p2, par.width, 0)
				var p4 = newPoint_xy(p1, par.width, 0)
				var points = [p1, p2, p3, p4]

				var partsPar = {
					points: points,
					width: par.width,
					len: par.len,
					thk: thk,
					posY: par.height - thk,
					count: [2, 1]
				}

				var mesh = drawTableBaseParts(partsPar).mesh;

				mesh.rotation.x -= Math.PI / 2;
				par.mesh.add(mesh)
			}

			//Нога шестиугольная-------------------------
			var offset = Math.floor(par.width / 4);
			var pt = newPoint_xy(p0, 0, par.height - thk)

			var p1 = newPoint_xy(p0, offset, 0)
			var p2 = newPoint_xy(p0, 0, (par.height - thk) / 2)
			var p3 = newPoint_xy(p0, offset, par.height - thk)
			var points = [p1, p2, p3]

			var points1 = mirrowPoints(points, 'y')
			points1 = moovePoints(points1, pt4)
			points1.reverse()

			points.push(...points1)


			//точки отверстия
			var line1 = parallel(p1, polar(p1, 0, 100), profPar.sizeB)
			var line11 = parallel(p1, p2, profPar.sizeB)
			var line2 = parallel(p3, polar(p3, 0, 100), -profPar.sizeB)
			var line21 = parallel(p2, p3, -profPar.sizeB)


			var p1 = itercectionLines(line1, line11);
			var p2 = itercectionLines(line11, line21);
			var p3 = itercectionLines(line2, line21);
			var points2 = [p1, p2, p3]

			var points3 = mirrowPoints(points2, 'y')
			points3 = moovePoints(points3, pt4)
			points3.reverse()

			points2.push(...points3)
			points2.push(points2[0])

			//points.reverse()
			points2.reverse()

			//создаем меш
			var meshPar = {
				points: points,
				pointsHole: points2,
				thk: profPar.sizeB,
				dxfArr: dxfPrimitivesArr,
				material: params.materials.additionalObjectMetal
			}

			var pole1 = drawMesh(meshPar).mesh;
			pole1.position.z = -(widthFlanTop / 2 + profPar.sizeB / 2) * turn
			if (i == 1) pole1.position.z -= par.len + profPar.sizeB;

			par.mesh.add(pole1)
		}

		//модель T-16
		if (par.model == "T-16") {

			if (i == 0) {
				//верхняя пластина-------------
				var p1 = copyPoint(p0)
				var p2 = newPoint_xy(p1, 0, widthFlanTop)
				var p3 = newPoint_xy(p2, par.width, 0)
				var p4 = newPoint_xy(p1, par.width, 0)
				var points = [p1, p2, p3, p4]

				var partsPar = {
					points: points,
					width: par.width,
					len: par.len,
					thk: thk,
					posY: par.height - thk,
					count: [2, 1]
				}

				var mesh = drawTableBaseParts(partsPar).mesh;

				mesh.rotation.x -= Math.PI / 2;
				par.mesh.add(mesh)

				//ноги-------------
				profPar.sizeA = profPar.sizeB;
				var ang = Math.atan(par.len / par.width); // угол диагонали
				var pt11 = newPoint_xy(pt1, profPar.sizeB / 2, widthFlanTop / 2 - profPar.sizeB / 2)
				var pt31 = newPoint_xy(pt3, -profPar.sizeB / 2, -widthFlanTop / 2 + profPar.sizeB / 2)
				ang = calcAngleX1(pt11, pt31)

				var p1 = copyPoint(pt11);

				p1 = polar(p1, Math.PI / 2 + ang, profPar.sizeB / 2)
				var p2 = polar(p1, ang, profPar.sizeA)
				var p3 = polar(p2, Math.PI / 2 + ang, -profPar.sizeB)
				var p4 = polar(p3, ang, -profPar.sizeA)
				var points = [p1, p2, p3, p4];


				var partsPar = {
					points: points,
					width: par.width,
					len: par.len,
					thk: par.height - thk,
					posY: 0,
				}

				var mesh = drawTableBaseParts(partsPar).mesh;

				mesh.rotation.x -= Math.PI / 2;
				par.mesh.add(mesh)
			}

			//нижняя дуговая перемычка по ширине
			var points4 = mirrowPoints(points, 'y')
			points4 = moovePoints(points4, pt4)

			var pt = newPoint_xy(p0, par.width / 2, 0)
			var pc = itercection(points[1], points[2], pt, polar(pt, Math.PI / 2, 100))
			var rad = distance(pc, points[2])
			var rad1 = rad + profPar.sizeB / 2

			var shape = new THREE.Shape();
			var ang = calcAngleX1(points[2], points[1])
			addLine(shape, par.dxfArr, points[2], polar(points[2], ang, profPar.sizeB / 2), par.dxfBasePoint);
			addArc2(shape, par.dxfArr, pc, rad1, ang, Math.PI - ang, true, par.dxfBasePoint)
			addLine(shape, par.dxfArr, polar(points4[2], Math.PI - ang, profPar.sizeB / 2), points4[2], par.dxfBasePoint);
			addArc2(shape, par.dxfArr, pc, rad, ang, Math.PI - ang, false, par.dxfBasePoint)

			var extrudeOptions = {
				amount: profPar.sizeB,
				bevelEnabled: false,
				curveSegments: 12,
				steps: 1
			};

			var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
			geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
			var mesh = new THREE.Mesh(geom, params.materials.additionalObjectMetal);

			mesh.rotation.x -= Math.PI / 2;
			if (i == 1) {
				mesh.rotation.x = Math.PI / 2;
				mesh.position.y = profPar.sizeB;
				mesh.position.z -= par.len;
			}
			par.mesh.add(mesh)

			//нижняя дуговая перемычка по длине
			var points2 = mirrowPoints(points, 'x')
			points2 = moovePoints(points2, pt2)

			var pt = newPoint_xy(p0, 0, par.len / 2)
			var pc = itercection(points[1], points[2], pt, polar(pt, 0, 100))
			var rad = distance(pc, points[1])
			var rad1 = rad + profPar.sizeB / 2

			var shape = new THREE.Shape();
			var ang = calcAngleX1(points[1], points[2])
			addLine(shape, par.dxfArr, polar(points[1], ang, profPar.sizeB / 2), points[1], par.dxfBasePoint);
			addArc2(shape, par.dxfArr, pc, rad, -ang, ang, false, par.dxfBasePoint)
			addLine(shape, par.dxfArr, points2[1], polar(points2[1], - ang, profPar.sizeB / 2), par.dxfBasePoint);
			addArc2(shape, par.dxfArr, pc, rad1, -ang, ang, true, par.dxfBasePoint)

			var extrudeOptions = {
				amount: profPar.sizeB,
				bevelEnabled: false,
				curveSegments: 12,
				steps: 1
			};

			var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
			geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
			var mesh = new THREE.Mesh(geom, params.materials.additionalObjectMetal);

			mesh.rotation.x -= Math.PI / 2;
			if (i == 1) {
				mesh.rotation.y = Math.PI;
				mesh.position.y = profPar.sizeB;
				mesh.position.x = par.width;
			}
			par.mesh.add(mesh)
		}

		//модель T-17
		if (par.model == "T-17") {

			var rad = par.width;
			var mesh = new THREE.Object3D();

			var ang = Math.PI * 2 / 3;

			var shape = new THREE.Shape();
			addCircle(shape, par.dxfArr, p0, rad, par.dxfBasePoint)

			var hole = new THREE.Path();
			addCircle(hole, par.dxfArr, p0, rad - profPar.sizeB, par.dxfBasePoint)
			shape.holes.push(hole);

			var extrudeOptions = {
				amount: profPar.sizeB,
				bevelEnabled: false,
				curveSegments: 32,
				steps: 1
			};

			var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
			geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
			var pole1 = new THREE.Mesh(geom, params.materials.additionalObjectMetal);
			mesh.add(pole1);

			var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
			geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
			var pole1 = new THREE.Mesh(geom, params.materials.additionalObjectMetal);
			pole1.position.z = par.height - profPar.sizeB
			mesh.add(pole1);

			mesh.rotation.x -= Math.PI / 2;
			par.mesh.add(mesh)


			//ноги---------------------------------------------
			var mesh = new THREE.Object3D();
			var pt = newPoint_xy(p0, rad, 0)
			var line1 = parallel(p0, pt, - profPar.sizeA / 2)
			var line2 = parallel(p0, pt, profPar.sizeA / 2)

			//точки ноги, вид сверху
			var p1 = itercectionLineCircle(line1.p1, line1.p2, p0, rad)[0]
			var p2 = itercectionLineCircle(line2.p1, line2.p2, p0, rad)[0]
			var p3 = newPoint_xy(p2, -profPar.sizeB, 0)
			var p4 = newPoint_xy(p1, -profPar.sizeB, 0)

			var points1 = [p1, p2, p3, p4];
			var points2 = rotatePoints(points1, ang, p0);
			var points3 = rotatePoints(points2, ang, p0);

			var arr = [points1, points2, points3]

			//рисуем ноги
			for (var j = 0; j < 3; j++) {
				var meshPar = {
					points: arr[j],
					thk: par.height - profPar.sizeB * 2,
					material: params.materials.additionalObjectMetal
				}
				var pole1 = drawMesh(meshPar).mesh;
				pole1.position.z = profPar.sizeB;
				mesh.add(pole1);
			}
			mesh.rotation.x = -Math.PI / 2
			par.mesh.add(mesh);
		}

		//модель T-18
		if (par.model == "T-18") {

			if (i == 0) {

				//ноги-------------
				var mesh = new THREE.Object3D();

				var p1 = copyPoint(p0)
				var p2 = newPoint_xy(p1, 0, profPar.sizeB)
				var p3 = newPoint_xy(p2, profPar.sizeA, 0)
				var p4 = newPoint_xy(p1, profPar.sizeA, 0)
				var points = [p1, p2, p3, p4]

				var partsPar = {
					points: points,
					width: par.width,
					len: par.len,
					thk: par.height,
					posY: 0,
				}

				var mesh = drawTableBaseParts(partsPar).mesh;

				mesh.rotation.x -= Math.PI / 2;
				par.mesh.add(mesh)

				///верхняя, нижняя перемычка-------------
				var mesh = new THREE.Object3D();

				var p1 = newPoint_xy(p0, profPar.sizeA, 0)
				var p2 = newPoint_xy(p1, 0, profPar.sizeB)
				var p3 = newPoint_xy(p2, par.width - profPar.sizeA * 2, 0)
				var p4 = newPoint_xy(p1, par.width - profPar.sizeA * 2, 0)
				var points = [p1, p2, p3, p4]

				var partsPar = {
					points: points,
					width: par.width,
					len: par.len,
					thk: profPar.sizeA,
					posY: 0,
					count: [2, 1],
				}

				//нижняя
				var meshBot = drawTableBaseParts(partsPar).mesh;
				mesh.add(meshBot)

				//верхняя
				partsPar.posY = par.height - profPar.sizeA;
				var meshTop = drawTableBaseParts(partsPar).mesh;
				mesh.add(meshTop)

				mesh.rotation.x -= Math.PI / 2;
				par.mesh.add(mesh)
			}

			//Боковые перемычки в середине--------------------------
			var mesh = new THREE.Object3D();

			var pt1 = newPoint_xy(p0, profPar.sizeA, profPar.sizeA)
			var pt2 = newPoint_xy(p0, profPar.sizeA, par.height - profPar.sizeA)
			var pt3 = newPoint_xy(p0, par.width - profPar.sizeA, par.height - profPar.sizeA)
			var pt4 = newPoint_xy(p0, par.width - profPar.sizeA, profPar.sizeA)

			var arr = []

			var p1 = copyPoint(pt1)
			var p2 = newPoint_xy(pt3, -profPar.sizeA * 3, 0)
			var line = parallel(p1, p2, -profPar.sizeA)
			var p3 = itercection(line.p1, line.p2, pt2, pt3);
			var p4 = itercection(line.p1, line.p2, pt1, pt4);
			arr.push([p1, p2, p3, p4])

			//-------------
			var p6 = copyPoint(p3)
			var p5 = itercection(p6, polar(p6, toRadians(85), 100), pt1, pt4);
			var line = parallel(p5, p6, -profPar.sizeA)
			var p7 = itercection(line.p1, line.p2, pt2, pt3);
			var p8 = itercection(line.p1, line.p2, pt1, pt4);
			arr.push([p5, p6, p7, p8])

			//--------------
			var pt5 = newPoint_xy(pt2, 0, -profPar.sizeA * 2)
			var pt6 = newPoint_xy(pt4, 0, profPar.sizeA * 2)
			var line1 = parallel(pt5, pt6, profPar.sizeA / 2)
			var line2 = parallel(pt5, pt6, -profPar.sizeA / 2)

			var pk1 = itercection(line1.p1, line1.p2, pt1, pt2);
			var pk2 = itercection(line2.p1, line2.p2, pt1, pt2);
			var pk3 = itercection(line2.p1, line2.p2, p1, p2);
			var pk4 = itercection(line1.p1, line1.p2, p1, p2);
			arr.push([pk1, pk2, pk3, pk4])

			var pk1 = itercection(line1.p1, line1.p2, p3, p4);
			var pk2 = itercection(line2.p1, line2.p2, p3, p4);
			var pk3 = itercection(line2.p1, line2.p2, p5, p6);
			var pk4 = itercection(line1.p1, line1.p2, p5, p6);
			arr.push([pk1, pk2, pk3, pk4])

			var pk1 = itercection(line1.p1, line1.p2, p7, p8);
			var pk2 = itercection(line2.p1, line2.p2, p7, p8);
			var pk3 = itercection(line2.p1, line2.p2, pt3, pt4);
			var pk4 = itercection(line1.p1, line1.p2, pt3, pt4);
			arr.push([pk1, pk2, pk3, pk4])

			for (var j = 0; j < arr.length; j++) {
				var meshPar = {
					points: arr[j],
					thk: thk,
					material: params.materials.additionalObjectMetal
				}

				var pole1 = drawMesh(meshPar).mesh;
				mesh.add(pole1);
			}

			mesh.position.z = -(profPar.sizeB / 2 + thk / 2) * turn
			if (i == 1) mesh.position.z -= par.len + thk;

			par.mesh.add(mesh)
		}

		//модель T-20 - еж на 3 ногах
		if (par.model == "T-20"){
			
			var offset = 50; //подогнано
			var diam = par.width - offset * 2
			var ang = Math.atan(diam / par.height); //угол наклона ног
			var legMesh = new THREE.Object3D();
			var plateThk = 4;

			var p0 = { x: -diam / 2 - offset, y: 0 };
			var pt = newPoint_xy(p0, 0, par.height);
			pt.y -= plateThk;

			var p1 = copyPoint(p0);
			p1.y += 4;
			var p2 = itercection(p1, polar(p1, Math.PI / 2 - ang, 100), pt, polar(pt, 0, 100));
			var line = parallel(p1, p2, -profPar.sizeA)
			var p3 = itercection(line.p1, line.p2, pt, polar(pt, 0, 100));
			var p4 = itercection(line.p1, line.p2, p1, polar(p1, 0, 100));

			var meshPar = {
				points: [p1, p2, p3, p4],
				thk: profPar.sizeB,
				material: params.materials.additionalObjectMetal,
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: {x: 0, y: par.height * (i + 1)},
			}

			//левая нога
			var pole = drawMesh(meshPar).mesh;
			pole.position.z = profPar.sizeB / 2 * Math.sin(ang);
			legMesh.add(pole);


			//верхняя пластина
			var platePar = {
				width: 100,
				len: profPar.sizeB / Math.cos(ang) + 20,
				legProfPar: profPar,
				notch: 0,
				ang: ang,
				thk: plateThk,
			}
			
			var plate = drawTableBasePlate(platePar).mesh;
			plate.position.x = p3.x - platePar.len + 10;
			plate.position.y = par.height;
			plate.position.z = pole.position.z + profPar.sizeB / 2 - platePar.width / 2;
			
			legMesh.add(plate);
			
			//смещаем и поворачиваем ногу
			legMesh.rotation.y = Math.PI * 2 / modelPar.partsAmt * i; //угол поворота ноги
			par.mesh.add(legMesh)
			
			par.prodPar.А = Math.round(distance(p1, p2))
		}

	//модель D-1
		if (par.model == "D-1") {
			var posZ = 0;
			var turn = 1;

			if (i == 1) {
				posZ = par.len - profPar.sizeA
				turn = -1;
			}
			var legPar = {
				height: par.height - 8,
				width: par.width,
				profPar: profPar,
				dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, -1000),
				material: params.materials.additionalObjectMetal,
				dxfArr: dxfPrimitivesArr,
			}

			var pole1 = drawTableBaseleg_D1(legPar).mesh;
			pole1.position.z = posZ;
			par.mesh.add(pole1);

			//верхняя пластина
			var platePar = {
				width: 100,
				len: par.width,
				legProfPar: profPar,
				model: par.model,
			}

			var plate = drawTableBasePlate(platePar).mesh;
			plate.position.y = par.height;
			plate.position.z = posZ + (- platePar.width + profPar.sizeA) / 2 * turn;
			if (i == 1) {
				plate.rotation.x = Math.PI
				plate.position.y -= platePar.thk
				plate.position.z += profPar.sizeA
			}
			par.mesh.add(plate);

			//-------------------
			var p0 = { x: 0, y: 0 };

			//углы без учета вырезов
			var p1 = copyPoint(p0);
			var p2 = newPoint_xy(p1, 0, 200);
			var p3 = newPoint_xy(p2, 200, 0);
			var p4 = newPoint_xy(p3, 0, -20);
			var p5 = newPoint_xy(p4, -20, 0);
			var p6 = newPoint_xy(p5, -(200 - 20 *2), 0);
			var p8 = newPoint_xy(p1, 20, 0);
			var p7 = newPoint_xy(p8, 0, 20);

			p4.filletRad = p8.filletRad = 20
			p6.filletRad = distance(p6, p5)


			//создаем шейп
			var shapePar = {
				points: [p1, p2, p3, p4, p5, p6, p7, p8],
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: par.dxfBasePoint,
			}

			var shape = drawShapeByPoints2(shapePar).shape;

			var extrudeOptions = {
				amount: 8,
				bevelEnabled: false,
				curveSegments: 12,
				steps: 1
			};

			var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
			geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
			var mesh = new THREE.Mesh(geom, params.materials.additionalObjectMetal);
			mesh.rotation.y = -Math.PI / 2 * turn;
			mesh.position.z = posZ + profPar.sizeA * turn 
			mesh.position.x = par.width / 2 + 8 / 2
			mesh.position.y = par.height - 8 - 200;
			if (i == 1) {
				mesh.position.z += profPar.sizeA
			}
			par.mesh.add(mesh);
		}

	//модель S
		if (par.model[0] == "S") {
			profPar.sizeA = 80;
			profPar.sizeB = 8;
			var thk = profPar.sizeB;
			var height = par.height - thk;

			//модель S-1
			if (par.model == "S-1") {
				var posZ = 0;
				var turn = 1;
				var ang = toRadians(75); //угол наклона ног

				if (i == 1) {
					posZ = par.len - profPar.sizeA
					turn = -1;
				}

				var pt = newPoint_xy(p0, 0, height);

				var p1 = newPoint_xy(pt, 0, - thk * Math.cos(ang));
				var p2 = polar(p1, Math.PI / 2 - ang, profPar.sizeB);
				var p4 = itercection(p1, polar(p1, -ang, 100), p0, polar(p0, 0, 100));
				var p3 = polar(p4, Math.PI / 2 - ang, profPar.sizeB);

				var offsetXBot = p3.x;
				var offsetXTop = p2.x;

				var meshPar = {
					points: [p1, p2, p3, p4],
					thk: profPar.sizeA,
					material: params.materials.additionalObjectMetal
				}

				//левая нога
				var pole1 = drawMesh(meshPar).mesh;
				pole1.rotation.y = -Math.PI / 2 * turn;
				pole1.position.z = posZ;
				if (i == 1) {
					pole1.position.z += profPar.sizeA
					pole1.position.x -= profPar.sizeA
				}
				par.mesh.add(pole1);

				//правая нога
				var pole1 = drawMesh(meshPar).mesh;
				pole1.rotation.y = -Math.PI / 2 * turn;
				pole1.position.x = par.width - profPar.sizeA;
				pole1.position.z = posZ;
				if (i == 1) {
					pole1.position.z += profPar.sizeA
					pole1.position.x -= profPar.sizeA
				}
				par.mesh.add(pole1);

				//верхняя перемычка
				var p1 = copyPoint(p0);
				var p2 = newPoint_xy(p1, 0, par.len);
				var p3 = newPoint_xy(p2, profPar.sizeA, 0);
				var p4 = newPoint_xy(p1, profPar.sizeA, 0);

				var meshPar = {
					points: [p1, p2, p3, p4],
					thk: profPar.sizeB,
					material: params.materials.additionalObjectMetal
				}

				var pole1 = drawMesh(meshPar).mesh;
				pole1.rotation.x = Math.PI / 2;
				pole1.position.y = par.height;
				pole1.position.x = - profPar.sizeA
				if (i == 1) {
					pole1.position.x += par.width - profPar.sizeA
				}
				par.mesh.add(pole1);

				//боковая нижняя перемычка
				var width1 = par.len / 2 - offsetXBot;
				var height1 = height / 3 - thk;
				var ang1 = Math.atan(height1 / width1);

				var len1 = width1 / Math.cos(ang1);

				var pt = newPoint_xy(p0, par.width / 2, 0);
				var p1 = copyPoint(p0);
				var p2 = newPoint_xy(pt, -profPar.sizeA / 2, len1)
				var p3 = newPoint_xy(p2, profPar.sizeA, 0)
				var p4 = newPoint_xy(p0, par.width, 0);
				var line1 = parallel(p1, p2, -profPar.sizeA)
				var line2 = parallel(p3, p4, -profPar.sizeA)
				var p5 = itercection(line2.p1, line2.p2, p0, polar(p0, 0, 100))
				var p6 = itercection(line1.p1, line1.p2, line2.p1, line2.p2)
				var p7 = itercection(line1.p1, line1.p2, p0, polar(p0, 0, 100))

				var meshPar = {
					points: [p1, p2, p3, p4, p5, p6, p7],
					thk: profPar.sizeB,
					material: params.materials.additionalObjectMetal
				}

				var pole1 = drawMesh(meshPar).mesh;
				pole1.rotation.x = (Math.PI / 2 - ang1)*turn;
				pole1.position.z = posZ + offsetXBot * turn;
				pole1.position.x = - profPar.sizeA
				if (i == 0) pole1.position.y += thk * Math.cos(ang1)
				if (i == 1) pole1.position.z += profPar.sizeA
				par.mesh.add(pole1);

				//боковая верхняя перемычка
				var width1 = par.len / 2 - offsetXTop;
				var height1 = height / 3 * 2;
				var ang1 = Math.atan(height1 / width1);

				var len1 = width1 / Math.cos(ang1);

				var pt = newPoint_xy(p0, par.width / 2, 0);
				var p1 = copyPoint(p0);
				var p2 = newPoint_xy(pt, -profPar.sizeA / 2, len1)
				var p3 = newPoint_xy(p2, profPar.sizeA, 0)
				var p4 = newPoint_xy(p0, par.width, 0);
				var line1 = parallel(p1, p2, -profPar.sizeA)
				var line2 = parallel(p3, p4, -profPar.sizeA)
				var p5 = itercection(line2.p1, line2.p2, p0, polar(p0, 0, 100))
				var p6 = itercection(line1.p1, line1.p2, line2.p1, line2.p2)
				var p7 = itercection(line1.p1, line1.p2, p0, polar(p0, 0, 100))

				var meshPar = {
					points: [p1, p2, p3, p4, p5, p6, p7],
					thk: profPar.sizeB,
					material: params.materials.additionalObjectMetal
				}

				var pole1 = drawMesh(meshPar).mesh;
				pole1.rotation.x = (Math.PI / 2 + ang1) * turn;
				pole1.position.z = posZ + offsetXTop * turn + thk * Math.sin(ang1);
				pole1.position.x = - profPar.sizeA
				pole1.position.y = height
				if (i == 1) pole1.position.y -= thk * Math.cos(ang1)
				if (i == 1) pole1.position.z += profPar.sizeA
				par.mesh.add(pole1);
			}

			//модель S-2
			if (par.model == "S-2") {
				var posZ = 0;
				var turn = 1;
				var angInclination = 0; //угол наклона 

				if (i == 1) {
					posZ = par.len
					turn = -1;
				}

				var ang = Math.PI / 4;

				if (i == 0) {
					var mesh = new THREE.Object3D();

					//точки ноги, вид сверху
					var p1 = newPoint_xy(pt1, 0, profPar.sizeA * Math.cos(ang))
					var p2 = polar(p1, ang, profPar.sizeB)
					var p4 = newPoint_xy(pt1, profPar.sizeA * Math.sin(ang), 0)
					var p3 = polar(p4, ang, profPar.sizeB)
					var points = [p1, p2, p3, p4];

					var meshPar = {
						points: [p1, p2, p3, p4],
						thk: par.height - thk * 2,
						material: params.materials.additionalObjectMetal
					}

					//левая передняя нога
					var pole1 = drawMesh(meshPar).mesh;
					pole1.position.z = thk;
					mesh.add(pole1);

					//правая передняя нога
					var points4 = mirrowPoints(points, 'y')
					points4 = moovePoints(points4, pt4)
					meshPar.points = points4
					var pole1 = drawMesh(meshPar).mesh;
					pole1.position.z = thk;
					mesh.add(pole1);

					//левая задняя нога
					var points2 = mirrowPoints(points, 'x')
					points2 = moovePoints(points2, pt2)
					meshPar.points = points2
					var pole1 = drawMesh(meshPar).mesh;
					pole1.position.z = thk;
					mesh.add(pole1);

					//правая задняя нога
					var points3 = mirrowPoints(points, 'x')
					points3 = mirrowPoints(points3, 'y')
					points3 = moovePoints(points3, pt3)
					meshPar.points = points3
					var pole1 = drawMesh(meshPar).mesh;
					pole1.position.z = thk;
					mesh.add(pole1);


					//передняя нижняя перемычка
					var points6 = [points[3], points[0]]
					points6.push(itercection(points[0], points[1], points4[0], points4[1]))
					points6.push(points4[0], points4[3])
					points6.push(itercection(points[2], points[3], points4[2], points4[3]))
					meshPar.points = points6
					meshPar.thk = profPar.sizeB
					var pole1 = drawMesh(meshPar).mesh;
					mesh.add(pole1);

					//задняя нижняя перемычка
					var points7 = mirrowPoints(points6, 'x')
					points7 = moovePoints(points7, pt2)
					meshPar.points = points7
					meshPar.thk = profPar.sizeB
					var pole1 = drawMesh(meshPar).mesh;
					mesh.add(pole1);

					//передняя верхняя перемычка
					var points8 = [pt4, pt1]
					points8.push(newPoint_xy(pt1, 0, 150))
					points8.push(newPoint_xy(pt4, 0, 150))
					meshPar.points = points8
					meshPar.thk = profPar.sizeB
					var pole1 = drawMesh(meshPar).mesh;
					pole1.position.z = par.height - thk;
					mesh.add(pole1);

					//задняя верхняя перемычка
					var points9 = mirrowPoints(points8, 'x')
					points9 = moovePoints(points9, pt2)
					meshPar.points = points9
					meshPar.thk = profPar.sizeB
					var pole1 = drawMesh(meshPar).mesh;
					pole1.position.z = par.height - thk;
					mesh.add(pole1);


					mesh.rotation.x = -Math.PI / 2
					par.mesh.add(mesh);
				}

				//----------------------------
				var len1 = distance(points6[1], points6[2]) - profPar.sizeA - 20;
				var height1 = par.height - thk * 2;
				var ang1 = Math.atan(height1 / len1);

				var pt = newPoint_xy(p0, 0, height1);
				var p1 = copyPoint(p0);
				var p2 = itercection(p1, polar(p1, ang1, 100), pt, polar(pt, 0, 100));
				var line = parallel(p1, p2, profPar.sizeA);
				var p3 = itercection(line.p1, line.p2, pt, polar(pt, 0, 100));
				var p4 = itercection(line.p1, line.p2, p0, polar(p0, 0, 100));

				var points = [p1, p2, p3, p4];

				var meshPar = {
					points: points,
					thk: profPar.sizeB,
					material: params.materials.additionalObjectMetal
				}

				for (var k = 0; k < 2; k++) {
					var basePoint = polar(points6[2], -ang, distance(p1, p4))
					if (i == 1) {
						basePoint = polar(points7[2], ang, distance(p1, p4))
						basePoint = polar(basePoint, ang + Math.PI / 2, profPar.sizeB)
					}

					if (k == 1) {
						var basePoint = polar(points6[2], ang, -distance(p1, p4))
						basePoint = polar(basePoint, -ang, profPar.sizeB)
						if (i == 1) {
							basePoint = polar(points7[2], -ang, -distance(p1, p4))
						}
					}

					//левая нога
					var pole1 = drawMesh(meshPar).mesh;
					pole1.rotation.y = -ang * turn;
					if (k == 1) {
						pole1.rotation.y -= Math.PI / 2 * turn;
					}
					pole1.position.y = thk;
					pole1.position.z = -basePoint.y;
					pole1.position.x = basePoint.x;
					par.mesh.add(pole1);
				}
			}

			//модель S-3
			if (par.model == "S-3") {
				var posZ = 0;
				var turn = 1;
				var angInclination = 0; //угол наклона 

				if (i == 1) {
					posZ = par.len - profPar.sizeA
					turn = -1;
				}

				var ang = Math.PI / 4;

				//нижняя и верхняя перемычка
				var p1 = copyPoint(p0)
				var p2 = newPoint_xy(p1, 0, profPar.sizeA)
				var p3 = newPoint_xy(p2, par.width, 0)
				var p4 = newPoint_xy(p1, par.width, 0)

				var meshPar = {
					points: [p1, p2, p3, p4],
					thk: profPar.sizeB,
					material: params.materials.additionalObjectMetal
				}

				//нижняя перемычка
				var pole1 = drawMesh(meshPar).mesh;
				pole1.rotation.x = -Math.PI / 2
				pole1.position.z = posZ;
				par.mesh.add(pole1);

				//верхняя перемычка
				var pole1 = drawMesh(meshPar).mesh;
				pole1.rotation.x = -Math.PI / 2
				pole1.position.y = par.height - profPar.sizeB;
				pole1.position.z = posZ;
				par.mesh.add(pole1);

				//боковая
				var height1 = par.height - profPar.sizeB * 2
				var ang = Math.atan(par.height / par.width)
				var pt = newPoint_xy(p0, par.width, par.height);
				var pt1 = polar(pt, ang + Math.PI / 2, profPar.sizeA)
				ang = calcAngleX1(p0, pt1);

				var p1 = copyPoint(p0);
				var p2 = itercection(p1, polar(p1, ang, 100), pt, polar(pt, 0, 100))
				var p3 = copyPoint(pt);
				var p4 = itercection(p3, polar(p3, ang, 100), p0, polar(p0, 0, 100))

				var meshPar = {
					points: [p1, p2, p3, p4],
					thk: profPar.sizeB,
					material: params.materials.additionalObjectMetal
				}

				//нижняя перемычка
				var pole1 = drawMesh(meshPar).mesh;
				pole1.position.z = posZ - profPar.sizeB * turn;
				if (i == 0) {
					pole1.position.z -= profPar.sizeA;
				}
				if (i == 1) {
					pole1.rotation.y = Math.PI
					pole1.position.x = par.width;
				}
				par.mesh.add(pole1);

				//боковая
				var height1 = par.height - profPar.sizeB * 2
				var ang = Math.atan(height1 / par.width)
				var pt = newPoint_xy(p0, par.width, height1);
				var pt1 = polar(pt, ang + Math.PI / 2, profPar.sizeB)
				ang = calcAngleX1(p0, pt1);

				var p1 = copyPoint(p0);
				var p2 = itercection(p1, polar(p1, ang, 100), pt, polar(pt, 0, 100))
				var p3 = copyPoint(pt);
				var p4 = itercection(p3, polar(p3, ang, 100), p0, polar(p0, 0, 100))

				var meshPar = {
					points: [p1, p2, p3, p4],
					thk: profPar.sizeA,
					material: params.materials.additionalObjectMetal
				}

				//нижняя перемычка
				var pole1 = drawMesh(meshPar).mesh;
				pole1.position.y = profPar.sizeB;
				pole1.position.z = posZ;
				if (i == 1) {
					pole1.position.z -= profPar.sizeA;
				}
				if (i == 0) {
					pole1.rotation.y = Math.PI
					pole1.position.x = par.width;
				}
				par.mesh.add(pole1);

			}

			//модель S-4
			if (par.model == "S-4") {
				var thk = 4;
				var posZ = 0;
				var turn = 1;
				var angInclination = toRadians(6); //угол наклона 

				if (i == 1) {
					posZ = par.len - thk
					turn = -1;
				}

				//боковая пластина
				var height1 = par.height / Math.cos(angInclination)
				var widthTop = par.width - 180 - thk * 2;
				var widthTop1 = widthTop - 170;
				var widthBot = 50 - thk;
				var pt = newPoint_xy(p0, par.width / 2, height1)
				var pt1 = newPoint_xy(pt, 0, -60)

				var p1 = newPoint_xy(p0, thk, 0)
				var p2 = newPoint_xy(pt, -widthTop / 2, 0)
				var p3 = newPoint_xy(pt, widthTop / 2, 0)
				var p4 = newPoint_xy(p1, par.width - thk*2, 0)
				var p5 = newPoint_xy(p4, -widthBot, 0)
				var p6 = newPoint_xy(pt1, widthTop1 / 2, 0)
				var p7 = newPoint_xy(pt1, -widthTop1 / 2, 0)
				var p8 = newPoint_xy(p1, widthBot, 0)

				var ang = calcAngleX1(p1, p2);
				var height2 = distance(p1, p2)
				var posXTop = p2.x

				var meshPar = {
					points: [p1, p2, p3, p4, p5, p6, p7, p8],
					thk: thk,
					material: params.materials.additionalObjectMetal
				}

				var pole1 = drawMesh(meshPar).mesh;
				pole1.rotation.x = angInclination * turn
				pole1.position.z = posZ;
				par.mesh.add(pole1);

				//боковая левая, правая пластина
				var height2 = par.height / Math.cos(Math.PI / 2 - ang)
				var pt = newPoint_xy(p0, 0, height2)
				var p1 = copyPoint(p0)
				var p2 = itercection(p1, polar(p1, Math.PI / 2 - angInclination, 100), pt, polar(pt, 0, 100))
				var p3 = newPoint_xy(p2, 100, 0)
				var p4 = newPoint_xy(p1, 50, 0)
				var posZTop = p2.x + thk

				var meshPar = {
					points: [p1, p2, p3, p4],
					thk: thk,
					material: params.materials.additionalObjectMetal
				}

				for (var k = 0; k < 2; k++) {
					var mesh = new THREE.Object3D();
					var pole1 = drawMesh(meshPar).mesh;
					pole1.rotation.y = -Math.PI / 2 * turn
					pole1.position.z = posZ;
					if (i == 0) pole1.position.x = thk;
					if (i == 1) pole1.position.z += thk;

					mesh.rotation.z = -Math.PI / 2 + ang

					if (k == 1) {
						mesh.rotation.z = Math.PI / 2 - ang
						mesh.position.x = par.width - thk;
					}

					mesh.add(pole1);
					par.mesh.add(mesh);
				}
				
				//верхняя пластина
				var p1 = copyPoint(p0)
				var p2 = newPoint_xy(p1, 0, 100 - thk)
				var p3 = newPoint_xy(p2, widthTop, 0)
				var p4 = newPoint_xy(p1, widthTop, 0)

				var meshPar = {
					points: [p1, p2, p3, p4],
					thk: thk,
					material: params.materials.additionalObjectMetal
				}

				var pole1 = drawMesh(meshPar).mesh;
				pole1.rotation.x = Math.PI / 2 * turn
				pole1.position.y = par.height;
				pole1.position.x = posXTop;
				pole1.position.z = posZTop * turn;
				if (i == 1) {
					pole1.position.y -= thk
					pole1.position.z += par.len
				}
				
				par.mesh.add(pole1);
			}

			//модель S-5
			if (par.model == "S-5") {
				var posZ = 0;
				var turn = 1;
				var angInclination = toRadians(8); //угол наклона 

				if (i == 1) {
					posZ = par.len
					turn = -1;
				}


				//нижняя пластина
				var ang = Math.PI / 3
				var p1 = copyPoint(p0)
				var p2 = polar(p1, ang, profPar.sizeA)
				var p4 = newPoint_xy(p1, par.width, 0)
				var p3 = polar(p4, -ang, -profPar.sizeA)

				var pos = copyPoint(p2)

				var meshPar = {
					points: [p1, p2, p3, p4],
					thk: thk,
					material: params.materials.additionalObjectMetal,
					dxfArr: dxfPrimitivesArr,
					dxfBasePoint: {x: 0, y: -2000},
				}

				var pole1 = drawMesh(meshPar).mesh;
				pole1.rotation.x = Math.PI / 2 * turn
				pole1.position.y = thk
				if (i == 1) {
					pole1.position.y = 0
					pole1.position.z += par.len
				}

				par.mesh.add(pole1);

				//боковая левая, правая пластина
				var height1 = (par.height - thk * 2) / Math.cos(angInclination) / Math.cos(angInclination)
				var pt = newPoint_xy(p0, 0, height1)
				var p1 = copyPoint(p0)
				var p2 = itercection(p1, polar(p1, Math.PI / 2 - angInclination, 100), pt, polar(pt, 0, 100))
				var line = parallel(p1, p2, profPar.sizeA)
				var p3 = itercection(line.p1, line.p2, pt, polar(pt, 0, 100))
				var p4 = itercection(line.p1, line.p2, p0, polar(p0, 0, 100))
				var posZTop = p2.x - thk * 2

				var meshPar = {
					points: [p1, p2, p3, p4],
					thk: thk,
					material: params.materials.additionalObjectMetal,
					dxfArr: dxfPrimitivesArr,
					dxfBasePoint: {x: 0, y: -1800},
				}

				for (var k = 0; k < 2; k++) {
					var mesh = new THREE.Object3D();
					var pole1 = drawMesh(meshPar).mesh;
					pole1.rotation.y = - ang * turn
					pole1.position.y = thk;
					pole1.position.z = posZ + pos.y * turn;
					pole1.position.x =  pos.x
					if (i == 0) pole1.position.x += thk / Math.sin(ang);

					mesh.rotation.z = -angInclination
					
					if (k == 1) {
						pole1.rotation.y = (Math.PI + ang) * turn
						pole1.position.x = -pos.x;
						if (i == 1) pole1.position.x -= thk / Math.sin(ang);

						mesh.rotation.z = angInclination
						mesh.position.x = par.width;
						
					}

					mesh.add(pole1);
					par.mesh.add(mesh);
					meshPar.dxfBasePoint.x += 200;
				}

				//верхняя пластина
				var p1 = copyPoint(p0)
				var p2 = newPoint_xy(p1, 0, 100)
				var p3 = newPoint_xy(p2, par.width, 0)
				var p4 = newPoint_xy(p1, par.width, 0)

				var meshPar = {
					points: [p1, p2, p3, p4],
					thk: thk,
					material: params.materials.additionalObjectMetal,
					dxfArr: dxfPrimitivesArr,
					dxfBasePoint: {x: 0, y: -2200},
				}

				var pole1 = drawMesh(meshPar).mesh;
				pole1.rotation.x = Math.PI / 2 * turn
				pole1.position.y = par.height;
				pole1.position.z = posZTop * turn;
				if (i == 1) {
					pole1.position.y -= thk
					pole1.position.z += par.len + thk / 2
				}

				par.mesh.add(pole1);
			}

			//модель S-6
			if (par.model == "S-6") {
				var turn = 1;
				var angInclination = toRadians(8); //угол наклона 

				if (i == 1) turn = -1;

				//нога
				var height1 = par.height - thk
				var ang = Math.PI / 4
				var p1 = newPoint_xy(p0, height1 * Math.tan(angInclination), 0)
				var p2 = newPoint_xy(p0, 0, height1)
				var p3 = newPoint_xy(p2, profPar.sizeA, 0)
				var p4 = newPoint_xy(p1, profPar.sizeA + 20, 0)

				var pt = newPoint_xy(p4, 30, height1 / 3)
				var pt1 = newPoint_xy(p0, par.width * Math.cos(ang), 0)
				var pt3 = newPoint_xy(pt, 0, profPar.sizeA / 2)
				var pt4 = newPoint_xy(pt, 0, -profPar.sizeA / 2)

				var p31 = itercection(p3, pt, pt3, polar(pt3, 0, 100))
				var p41 = itercection(p4, pt, pt4, polar(pt4, 0, 100))
				var p32 = itercection(p31, pt3, pt1, polar(pt1, Math.PI / 2, 100))
				var p42 = itercection(p41, pt4, pt1, polar(pt1, Math.PI / 2, 100))

				var meshPar = {
					points: [p1, p2, p3, p31, p32, p42, p41, p4],
					thk: thk,
					material: params.materials.additionalObjectMetal
				}

				for (var k = 0; k < 2; k++) {

					var pole1 = drawMesh(meshPar).mesh;
					pole1.rotation.y = -ang * turn
					if (k == 1) {
						pole1.rotation.y = (Math.PI + ang) * turn
						pole1.position.x = par.width;
						pole1.position.z += thk * Math.cos(ang)
					}
					if (i == 1) {
						pole1.position.z += par.len
						pole1.position.x -= thk * Math.cos(ang)
					}
					par.mesh.add(pole1);
				}

				//средняя пластина
				if (i == 0) {
					var offsetLen = par.width * Math.cos(ang) * Math.cos(ang)

					var p1 = copyPoint(p0)
					var p2 = newPoint_xy(p1, 0, profPar.sizeA)
					var p3 = newPoint_xy(p2, par.len - offsetLen * 2 - thk * Math.cos(ang), 0)
					var p4 = newPoint_xy(p3, 0, -profPar.sizeA)

					var meshPar = {
						points: [p1, p2, p3, p4],
						thk: thk,
						material: params.materials.additionalObjectMetal
					}

					var pole1 = drawMesh(meshPar).mesh;
					pole1.rotation.y = -Math.PI / 2
					pole1.position.y = height1 / 3 - profPar.sizeA / 2;
					pole1.position.x = par.width / 2 + (thk - thk / 2 / Math.cos(ang)) / 2;
					pole1.position.z = offsetLen + thk * Math.cos(ang);
					par.mesh.add(pole1);
				}

				//верхняя пластина
				var p1 = newPoint_xy(p0, 0, -profPar.sizeA / 2)
				var p2 = newPoint_xy(p0, 0, profPar.sizeA / 2)
				var p3 = newPoint_xy(p2, profPar.sizeA, 0)
				var p4 = newPoint_xy(p1, profPar.sizeA, 0)

				var meshPar = {
					points: [p1, p2, p3, p4],
					thk: thk,
					material: params.materials.additionalObjectMetal
				}

				for (var k = 0; k < 2; k++) {
					var mesh = new THREE.Object3D();
					var pole1 = drawMesh(meshPar).mesh;
					pole1.rotation.x = Math.PI / 2 * turn
					mesh.add(pole1);

					mesh.position.y = par.height;
					mesh.rotation.y = -ang * turn
					mesh.position.x = -thk / 2 * Math.cos(ang);
					mesh.position.z = thk / 2 * Math.cos(ang) * turn;
					if (k == 1) {
						mesh.rotation.y = (Math.PI + ang) * turn
						mesh.position.x = par.width - thk / 2 * Math.cos(ang);
					}
					if (i == 1) {
						mesh.position.z += par.len + thk * Math.cos(ang)
						mesh.position.y = height1;
					}
					par.mesh.add(mesh);
				}
			}

			//модель S-7
			if (par.model == "S-7") {
				var posZ = 0;
				var turn = 1;

				if (i == 1) {
					posZ = -par.len
					turn = -1;
				}


				if (i == 0) {
					var mesh = new THREE.Object3D();

					//точки ноги, вид сверху
					var p1 = copyPoint(p0)
					var p2 = newPoint_xy(p1, 0, profPar.sizeA)
					var p3 = newPoint_xy(p2, thk, 0)
					var p4 = newPoint_xy(p1, thk, 0)
					var points = [p1, p2, p3, p4];

					var meshPar = {
						points: [p1, p2, p3, p4],
						thk: par.height,
						material: params.materials.additionalObjectMetal
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


					//передняя нижняя перемычка
					var len1 = par.width - thk * 2;
					var points4 = [points[3], points[2]]
					points4.push(newPoint_xy(points[2], len1, 0))
					points4.push(newPoint_xy(points[3], len1, 0))
					meshPar.points = points4
					meshPar.thk = thk
					var pole1 = drawMesh(meshPar).mesh;
					mesh.add(pole1);

					//задняя нижняя перемычка
					var points5 = mirrowPoints(points4, 'x')
					points5 = moovePoints(points5, pt2)
					meshPar.points = points5
					var pole1 = drawMesh(meshPar).mesh;
					mesh.add(pole1);

					//точки верхней пластины, вид сверху
					var p1 = newPoint_xy(p0, thk, 0)
					var p2 = newPoint_xy(p1, 0, profPar.sizeA)
					var p3 = newPoint_xy(p2, 60, 0)
					var p4 = newPoint_xy(p1, 60, 0)
					var points = [p1, p2, p3, p4];

					var meshPar = {
						points: [p1, p2, p3, p4],
						thk: thk,
						material: params.materials.additionalObjectMetal
					}

					//левая передняя
					var pole1 = drawMesh(meshPar).mesh;
					pole1.position.z = par.height - thk;
					mesh.add(pole1);

					//правая передняя
					var points4 = mirrowPoints(points, 'y')
					points4 = moovePoints(points4, pt4)
					meshPar.points = points4
					var pole1 = drawMesh(meshPar).mesh;
					pole1.position.z = par.height - thk;
					mesh.add(pole1);

					//левая задняя
					var points2 = mirrowPoints(points, 'x')
					points2 = moovePoints(points2, pt2)
					meshPar.points = points2
					var pole1 = drawMesh(meshPar).mesh;
					pole1.position.z = par.height - thk;
					mesh.add(pole1);

					//правая задняя
					var points3 = mirrowPoints(points, 'x')
					points3 = mirrowPoints(points3, 'y')
					points3 = moovePoints(points3, pt3)
					meshPar.points = points3
					var pole1 = drawMesh(meshPar).mesh;
					pole1.position.z = par.height - thk;
					mesh.add(pole1);

					mesh.rotation.x = -Math.PI / 2
					par.mesh.add(mesh);
				}

				//боковая круглая перемычка
				var ang = Math.atan((par.height - thk * 2) / (par.width - thk * 2))
				var polePar = {
					type: "round",
					poleProfileY: 10,
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
					length: (par.width - thk * 2) / Math.cos(ang),
					poleAngle: ang,
				}

				for (var k = 0; k < 2; k++) {
					var pole2 = drawPole3D_4(polePar).mesh;
					pole2.position.z = posZ - profPar.sizeA / 2 * turn;
					pole2.position.x = thk;
					pole2.position.y = thk;
					if (k == 1) {
						pole2.rotation.y = Math.PI
						pole2.position.x = par.width - thk;
					}
					par.mesh.add(pole2);
				}
			}

			//модель S-8
			if (par.model == "S-8") {
				var mesh = new THREE.Object3D();

				//точки ноги, вид сверху
				var p1 = copyPoint(p0)
				var p2 = newPoint_xy(p1, 0, profPar.sizeA)
				var p3 = newPoint_xy(p2, thk, 0)
				var p4 = newPoint_xy(p1, thk, 0)
				var points = [p1, p2, p3, p4];

				var meshPar = {
					points: [p1, p2, p3, p4],
					thk: par.height - thk * 2,
					material: params.materials.additionalObjectMetal
				}

				//левая передняя нога
				var pole1 = drawMesh(meshPar).mesh;
				pole1.position.z = thk;
				mesh.add(pole1);

				//правая передняя нога
				var points4 = mirrowPoints(points, 'y')
				points4 = moovePoints(points4, pt4)
				meshPar.points = points4
				var pole1 = drawMesh(meshPar).mesh;
				pole1.position.z = thk;
				mesh.add(pole1);

				//левая задняя нога
				var points2 = mirrowPoints(points, 'x')
				points2 = moovePoints(points2, pt2)
				meshPar.points = points2
				var pole1 = drawMesh(meshPar).mesh;
				pole1.position.z = thk;
				mesh.add(pole1);

				//правая задняя нога
				var points3 = mirrowPoints(points, 'x')
				points3 = mirrowPoints(points3, 'y')
				points3 = moovePoints(points3, pt3)
				meshPar.points = points3
				var pole1 = drawMesh(meshPar).mesh;
				pole1.position.z = thk;
				mesh.add(pole1);

				//точки ноги, вид сверху
				var p1 = copyPoint(p0)
				var p2 = newPoint_xy(p1, 0, thk)
				var p3 = newPoint_xy(p2, profPar.sizeA, 0)
				var p4 = newPoint_xy(p1, profPar.sizeA, 0)
				var points = [p1, p2, p3, p4];

				var meshPar = {
					points: [p1, p2, p3, p4],
					thk: par.height - thk * 2,
					material: params.materials.additionalObjectMetal
				}

				var offsetLen = par.len / 4;

				//передняя нога в глубине
				var points1 = moovePoints(points, newPoint_xy(pt4, -profPar.sizeA, offsetLen - thk))
				meshPar.points = points1
				var pole1 = drawMesh(meshPar).mesh;
				pole1.position.z = thk;
				mesh.add(pole1);

				//задняя нога в глубине 
				var points2 = moovePoints(points, newPoint_xy(pt2, 0, -offsetLen))
				meshPar.points = points2
				var pole1 = drawMesh(meshPar).mesh;
				pole1.position.z = thk;
				mesh.add(pole1);


				//нижняя, верхняя перемычка
				//точки, вид сверху
				var p1 = copyPoint(p0)
				var p2 = newPoint_xy(p1, 0, profPar.sizeA)
				var p3 = newPoint_xy(p2, par.width - profPar.sizeA, 0)
				var p4 = newPoint_xy(p3, 0, offsetLen - profPar.sizeA)
				var p5 = newPoint_xy(p4, profPar.sizeA, 0)
				var p6 = copyPoint(pt4)
				var points = [p1, p2, p3, p4, p5, p6];

				var meshPar = {
					points: points,
					thk: thk,
					material: params.materials.additionalObjectMetal
				}

				//передняя перемычка
				//нижняя
				var pole1 = drawMesh(meshPar).mesh;
				mesh.add(pole1);

				//верхняя
				var pole1 = drawMesh(meshPar).mesh;
				pole1.position.z = par.height - thk;
				mesh.add(pole1);

				//задняя перемычка
				var points1 = mirrowPoints(points, 'x')
				points1 = mirrowPoints(points1, 'y')
				points1 = moovePoints(points1, pt3)
				meshPar.points = points1

				//нижняя
				var pole1 = drawMesh(meshPar).mesh;
				mesh.add(pole1);

				//верхняя
				var pole1 = drawMesh(meshPar).mesh;
				pole1.position.z = par.height - thk;
				mesh.add(pole1);

				mesh.rotation.x = -Math.PI / 2
				par.mesh.add(mesh);
			}

			//модель S-9
			if (par.model == "S-9") {
				var rad = par.width / 2;
				var mesh = new THREE.Object3D();

				var ang = Math.PI * 2 / 3;

				var pt = newPoint_xy(p0, rad, 0)
				var line1 = parallel(p0, pt, - profPar.sizeA / 2)
				var line2 = parallel(p0, pt, profPar.sizeA / 2)

				//точки ноги, вид сверху
				var p1 = itercectionLineCircle(line1.p1, line1. p2, p0, rad)[0]
				var p2 = itercectionLineCircle(line2.p1, line2.p2, p0, rad)[0]
				var p3 = newPoint_xy(p2, -thk, 0)
				var p4 = newPoint_xy(p1, -thk, 0)

				var points1 = [p1, p2, p3, p4];
				var points2 = rotatePoints(points1, ang, p0);
				var points3 = rotatePoints(points2, ang, p0);

				var arr = [points1, points2, points3]

				//рисуем ноги
				for (var j = 0; j < 3; j++) {
					var meshPar = {
						points: arr[j],
						thk: par.height,
						material: params.materials.additionalObjectMetal
					}
					var pole1 = drawMesh(meshPar).mesh;
					mesh.add(pole1);
				}
				
				par.prodPar.A = Math.round(par.height)
				
				//верхняя, нижняя пластина
				var points = []

				points.push(points1[0], points1[1])
				var pt = itercection(points1[1], points1[2], points2[0], points2[3])
				pt.filletRad = 50;
				points.push(pt);

				points.push(points2[0], points2[1])
				var pt = itercection(points2[1], points2[2], points3[0], points3[3])
				pt.filletRad = 50;
				points.push(pt);

				points.push(points3[0], points3[1])
				var pt = itercection(points3[1], points3[2], points1[0], points1[3])
				pt.filletRad = 50;
				points.push(pt);

				points.reverse();

				var meshPar = {
					points: points,
					thk: thk,
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, -1000),
					dxfArr: dxfPrimitivesArr,
					material: params.materials.additionalObjectMetal
				}

				var pole1 = drawMesh(meshPar).mesh;
				mesh.add(pole1);

				var pole1 = drawMesh(meshPar).mesh;
				pole1.position.z = par.height - thk;
				mesh.add(pole1);


				mesh.rotation.x = -Math.PI / 2
				par.mesh.add(mesh);
			}
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
			var width = par.counterTop.width / 2
			var len = par.counterTop.len /2
			if(width < 500) width = 500
			if(len < 500) len = 500
			
			var p0 = { x: 0, y: 0 };
			var p1 = newPoint_xy(p0, -width / 2, -len / 2);
			var p2 = newPoint_xy(p0, -width / 2, len / 2);
			var p3 = newPoint_xy(p0, width / 2, len / 2);
			var p4 = newPoint_xy(p0, width / 2, -len / 2);

			var poleX = profPar.sizeB;
			var poleY = profPar.sizeA / Math.cos(ang) * 2 + 8 * Math.tan(ang) * 2;

			var holeP0 = {x:-poleX / 2, y: -poleY / 2}
			var holeP1 = {x:-poleX / 2, y: poleY / 2}
			var holeP2 = {x:poleX / 2, y: poleY / 2}
			var holeP3 = {x:poleX / 2, y: -poleY / 2}

			var meshPar = {
				points: [p1, p2, p3, p4],
				pointsHole: [holeP0, holeP1, holeP2, holeP3],
				thk: 8,
				material: params.materials.additionalObjectMetal,
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: {x:0, y: -1000,}
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
	if (!(par.model == "S-9" || par.model == "T-17")) {
		var box3 = new THREE.Box3().setFromObject(par.mesh);
		par.mesh.position.x -= (box3.max.x + box3.min.x) / 2;
		par.mesh.position.z -= (box3.max.z + box3.min.z) / 2;
	}

	var partsAmt = 1;//Кол-во частей подстолья 2 или 1
	var onePartModels = ['S-1', 'S-6', 'S-9', 'T-4', 'T-6', 'T-7', 'T-9', 'T-10', 'T-12', 'T-16', 'T-17']
	if (onePartModels.indexOf(par.model) == -1 && par.model !='нет' && par.model != 'не указано' && par.model != 'T-13') partsAmt = 2;
	if (par.model == 'T-13') partsAmt = 4;
	partsAmt = partsAmt * (par.objectAmt || 1);

	//сохраняем данные для спецификации
	par.partName = "table_base_" + par.model;
	par.thk = par.thk;
	if(typeof specObj !='undefined' && par.partName){
		if(!specObj[par.partName]){
			specObj[par.partName] = {
				types: {},
				amt: 0,
				name: "Подстолье " + par.model,
				area: 0,
				paintedArea: 0,
				paintedArea: 0,
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				group: "Объекты",
				comment: "",
				typeComments: {},
			}
		}
		
		var name = '№' + par.objId + ' ' + Math.round(par.len) + "x" + Math.round(par.width) + " h=" + Math.round(par.height);
		
		//добавляем размеры для производства в комментарии
		specObj[par.partName].typeComments[name] = "Профиль " + modelPar.legProf;
		for(var key in par.prodPar){
			specObj[par.partName].typeComments[name] += "; "
			specObj[par.partName].typeComments[name] += key + "=" + par.prodPar[key];
		};
		if(par.model == "T-9") specObj[par.partName].typeComments[name] += "; углы см. чертеж"
		
		
		if(specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] += partsAmt;
		if(!specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] = partsAmt;
		specObj[par.partName]["amt"] += partsAmt;
		
		
		par.mesh.specParams = {specObj: specObj, amt: partsAmt, partName: par.partName}
	}
	
	par.mesh.specId = par.partName + name;
	par.mesh.setLayer("carcas");
	if(modelPar.partsAmt == 2 && par.oneSideLegs == 'да') par.mesh.position.z = -par.len / 2;

	return par;
}

/**
 * Функция отрисовывает кронштейн стола
 * @param par 
 */
function drawTableFixing(par){
	var fixing = new THREE.Object3D();

	var b = 60;
	var c = 100;
	var a = 280;

	var flanThk = 2;

	var p0 = {x:0,y:0};
	var p1 = newPoint_xy(p0, b / 2, 0);
	var p2 = newPoint_xy(p1, 0, -40);
	var p3 = newPoint_xy(p0, b / 4, -c);

	var p4 = newPoint_xy(p0, -b / 4, -c);
	var p6 = newPoint_xy(p0, -b / 2, 0);
	var p5 = newPoint_xy(p6, 0, -40);

	p1.filletRad = p2.filletRad = p3.filletRad = 
	p4.filletRad = p5.filletRad = p6.filletRad = 4;

	var shapePar = {
		points: [p0, p1, p2, p3, p4, p5, p6],
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: {x:0,y:0}
	}
	var backPlateShape = drawShapeByPoints2(shapePar).shape
	var extrudeOptions = {
		amount: flanThk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	var geom = new THREE.ExtrudeGeometry(backPlateShape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	
	var flan = new THREE.Mesh(geom, params.materials.metal);
	fixing.add(flan);

	var p0 = {x:0,y:0};
	var p1 = newPoint_xy(p0, a, 0);
	var p2 = newPoint_xy(p1, 0, -20);
	var p3 = newPoint_xy(p0, a / 2, -c / 3);
	var p4 = newPoint_xy(p0, 5, -c * 0.75);
	var p5 = newPoint_xy(p0, 0, -c * 0.75);

	var shapePar = {
		points: [p0, p1, p2, p3, p4, p5],
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: {x:0,y:0}
	};

	p2.filletRad = p4.filletRad = 15;

	var flanShape = drawShapeByPoints2(shapePar).shape
	var extrudeOptions = {
		amount: flanThk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	var geom = new THREE.ExtrudeGeometry(flanShape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	
	var flan = new THREE.Mesh(geom, params.materials.metal);
	flan.rotation.y = -Math.PI / 2;
	flan.position.x = -10;
	flan.position.z = flanThk;
	fixing.add(flan);

	var geom = new THREE.BoxGeometry(20, flanThk, a);
	var mesh = new THREE.Mesh(geom, params.materials.additionalObjectMetal);
	mesh.position.y -= flanThk / 2;
	mesh.position.z = a / 2 + flanThk / 2;
	fixing.add(mesh);

	return fixing;
}

/**
 * Функция отрисовывает ножку стола
 * @param par 
 */
function drawTableLeg(par){
	par.mesh = new THREE.Object3D();

	var p0 = {x:0,y:0};
	if (par.type != 'квадратные') {
		//верхняя пластина-------------
		var p1 = copyPoint(p0)
		var p2 = newPoint_xy(p1, 0, par.widthFlanTop)
		var p3 = newPoint_xy(p2, par.widthFlanTop / 2, 0)
		var p4 = newPoint_xy(p3, 0, -par.widthFlanTop / 2)
		var p5 = newPoint_xy(p4, par.widthFlanTop / 2, 0)
		var p6 = newPoint_xy(p1, par.widthFlanTop, 0)
		var points = [p1, p2, p3, p4, p5, p6]

		var shapePar = {
			points: points,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: par.dxfBasePoint
		}
		var legFlanShape = drawShapeByPoints2(shapePar).shape
		var extrudeOptions = {
			amount: par.thk,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};
		
		//стенки
		var geom = new THREE.ExtrudeGeometry(legFlanShape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));	
		
		var legFlan = new THREE.Mesh(geom, params.materials.metal);
		legFlan.rotation.x = Math.PI / 2;
		legFlan.rotation.z = -Math.PI / 2;
		legFlan.position.y = par.height;
		
		// Размещаем фланец в зависимости от типа ножки
		legFlan.position.x = -10;
		legFlan.position.z = 10;
	
		if (par.type == 'круглые') {
			legFlan.position.x = -par.widthFlanTop / 2 - 10;
			legFlan.position.z = par.widthFlanTop / 2 + 10;
		}
	
		par.mesh.add(legFlan);
	}
	
	if (par.type == 'квадратные') {
		//верхний фланец
		var flanPar = {
			width: par.profPar.sizeA + 50,
			height: par.profPar.sizeB + 50,
			cornerRad: 10,
			thk: 4,
			noBolts: true,
			roundHoleCenters: {},
			holeRad: 9 / 2,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: {x: 500, y: par.height * (i + 1)},				
		}
		
		var holeOffset = 10;
		flanPar.roundHoleCenters = [
			{x: holeOffset, y: holeOffset},
			{x: flanPar.width - holeOffset, y: holeOffset},
			{x: holeOffset, y: flanPar.height - holeOffset},
			{x: flanPar.width - holeOffset, y: flanPar.height - holeOffset},
		];
		
		var flan = drawRectFlan2(flanPar).mesh;
		flan.rotation.x = Math.PI / 2
		flan.position.y = par.height;
		flan.position.x = -par.profPar.sizeA / 2 - flanPar.width / 2;
		flan.position.z = - flanPar.height / 2 +par.profPar.sizeB / 2;
		
		par.mesh.add(flan);
	}

	// Сама ножка
	if (par.type == 'круглые') {
		var polePar = {
			type: "round",
			poleProfileY: 60,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
			length: par.height - par.thk,
			poleAngle: Math.PI / 2,
		}
		par.legProfile = polePar.poleProfileY;

		var pole1 = drawPole3D_4(polePar).mesh;
		par.mesh.add(pole1);
		par.mesh.position.x = polePar.poleProfileY;
		par.mesh.position.z = -polePar.poleProfileY;
	}
	if (par.type == 'квадратные') {
		var polePar = {
			type: "rect",
			poleProfileY: par.profPar.sizeA,
			poleProfileZ: par.profPar.sizeB,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
			length: par.height - par.thk / 2,
			poleAngle: Math.PI / 2,
		}
		par.legProfile = polePar.poleProfileY;
		var pole1 = drawPole3D_4(polePar).mesh;
		par.mesh.add(pole1);
		par.mesh.position.x = polePar.poleProfileY / 2;
		par.mesh.position.z = -polePar.poleProfileZ;
	}
	if (par.type == 'шпильки') {
		var polePar = {
			type: "round",
			poleProfileY: 10,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 0),
			length: par.height - par.thk,
			poleAngle: Math.PI / 2,
		}
		par.legProfile = polePar.poleProfileY;

		var pole1 = drawPole3D_4(polePar).mesh;
		par.mesh.add(pole1);
		
		var ang = Math.atan((par.height - par.thk) / (par.widthFlanTop - polePar.poleProfileY * 2))
		polePar.poleAngle = ang;
		polePar.length = polePar.length / Math.sin(ang);

		var pole2 = drawPole3D_4(polePar).mesh;
		pole2.position.x += polePar.poleProfileY;
		par.mesh.add(pole2);

		var pole3 = drawPole3D_4(polePar).mesh;
		pole3.rotation.y = Math.PI / 2
		pole3.position.z -= polePar.poleProfileY;
		pole3.position.x -= polePar.poleProfileY;
		par.mesh.add(pole3);

		par.mesh.position.x = polePar.poleProfileY;
		par.mesh.position.z = -polePar.poleProfileY;
	}

	return par;
}

/** функция отрисовывает столешницу
	@param model
	@param thk
	@param width
	@param len
*/
function drawTableCountertop(par){
	initPar(par)
	
	par.hasGap = false; //есть ли стык посередине
	if(par.width > 600 && (par.type == "щит" || par.type == "слэб" )) par.hasGap = true;
	if (par.type.indexOf('слэб') != -1 && par.type != 'слэб') {
		par.hasGap = true;
		// par.width -= par.riverWidth * 1.0;
		par.partsGap = par.riverWidth * 1.0;
	}
	//временный костыль
	if(par.tableGeom != "прямоугольный") par.hasGap = false
	
	if(par.hasGap) par.width = (par.width - par.partsGap) / 2;

	var p0 = { x: 0, y: 0 };

	if (par.geom !== 'круглый') {
		var p1 = copyPoint(p0);
		var p2 = newPoint_xy(p0, 0, par.width);
		var p3 = newPoint_xy(p0, par.len, par.width);
		var p4 = newPoint_xy(p0, par.len, 0);

		var points = [p1, p2, p3, p4];
		if (par.sideEdges == 'живые' && !par.hasGap || par.sideEdges == 'живые' && par.type.indexOf('слэб') != -1 && par.type != 'слэб') {
			// размеры неровного края реки зависят от ширины реки
			var offset = par.type.indexOf('слэб') != -1 && par.type != 'слэб' ? value_limit(par.partsGap / 10, 5, 20) : false;
			var points = [p1, p2, ...getNoisedPoints(p2,p3), p3, p4, ...getNoisedPoints(p1,p4, offset).reverse()];
		}
		if (par.sideEdges != 'живые' && par.type.indexOf('слэб') != -1 && par.type != 'слэб') {
			var points = [p1, p2, p3, p4, ...getNoisedPoints(p1,p4, value_limit(par.partsGap / 10, 5, 20)).reverse()];
		}
		if (par.sideEdges == 'живые' && par.type == 'слэб' && par.hasGap) {
			var points = [p1, p2, ...getNoisedPoints(p2,p3), p3, p4];
		}
		
		if (par.hasGap) {
			points[0].filletRad = points[3].filletRad = 1;
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
		if (par.sideEdges == 'живые') shapePar.radOut = undefined;

		var shape = drawShapeByPoints2(shapePar).shape;

		if (par.hasGap) {
			if (par.sideEdges == 'живые'){
				var points = [p1, p2, ...getNoisedPoints(p2,p3), p3, p4];
			}
			if (par.sideEdges == 'живые' && par.type.indexOf('слэб') != -1 && par.type != 'слэб'){
				var points = [p1, p2, ...getNoisedPoints(p2,p3), p3, p4, ...getNoisedPoints(p1,p4, value_limit(par.partsGap / 10, 5, 20)).reverse()];
			}
			if (par.sideEdges != 'живые' && par.type.indexOf('слэб') != -1 && par.type != 'слэб') {
				var points = [p1, p2, p3, p4, ...getNoisedPoints(p1,p4, value_limit(par.partsGap / 10, 5, 20)).reverse()];
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
			if (par.sideEdges == 'живые') shapePar.radOut = undefined;

			var shape2 = drawShapeByPoints2(shapePar).shape;
		}

	}

	if (par.geom == 'круглый') {

		var shape = new THREE.Shape();

		var rad = par.width / 2;

		addCircle(shape, dxfPrimitivesArr, p0, rad, par.dxfBasePoint)
	}
	
	
	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.additionalObjectTimber);
	mesh.rotation.x = Math.PI / 2;
	mesh.rotation.z = Math.PI / 2;
	if (par.modifyKey) mesh.modifyKey = par.modifyKey;
	par.mesh.add(mesh);

	if(par.hasGap){
		var geom = new THREE.ExtrudeGeometry(shape2, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var mesh = new THREE.Mesh(geom, params.materials.additionalObjectTimber);
		mesh.rotation.x = -Math.PI / 2;
		mesh.rotation.z = -Math.PI / 2;
		mesh.position.y = -par.thk;
		mesh.position.x = par.partsGap;
		//mesh.position.z = par.len;
		par.mesh.add(mesh);
	}

	// Проверяем что есть стекло или смола
	if (par.hasGap && par.type.indexOf('слэб') != -1 && par.type != 'слэб') {
		var riverThickness = par.thk - 1;
		var riverWidth = par.partsGap * 1.5;// + value_limit(par.partsGap / 10, 5, 20);
		if (par.type == 'слэб + стекло'){
			riverThickness = 4;
		} 
		var riverGeometry = new THREE.BoxGeometry(riverWidth, par.len - 2, riverThickness);
		var riverMaterial = params.materials.resin;
		if (par.type == 'слэб + стекло') {
			riverMaterial = params.materials.glass;
		}
		var river = new THREE.Mesh(riverGeometry, riverMaterial);
		river.rotation.x = Math.PI / 2;
		if (par.type == 'слэб + стекло') {
			river.position.y = -riverThickness / 2 + 0.1;
		}else{
			river.position.y = -par.thk / 2;
		}
		river.position.z = par.len / 2;
		river.position.x = par.riverWidth / 2;
		par.mesh.add(river)
	}
	
	//сохраняем данные для спецификации
	par.partName = "countertop";
	if(par.type.indexOf("слэб") != -1) par.partName = "slab";
	
	par.thk = par.thk;
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
				group: "Объекты",
				}
			}
		var area = par.len * par.width / 1000000;
		var paintedArea = area * 2 + (par.len + par.width) * 2 * par.thk / 1000000;
		
		var name = '№' + par.objId + ' ' + Math.round(par.len) + "x" + Math.round(par.width) + "x" + Math.round(par.thk);
		if(par.partName = "slab"){
			var name = '№' + par.objId + ' из слэба ' + par.slabModel + ', ' + Math.round(par.len) + "x" + Math.round(par.width) + "x" + Math.round(par.thk);
		}
		
		if(specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] += 1 * par.objectAmt;
		if(!specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] = 1 * par.objectAmt;
		specObj[par.partName]["amt"] += 1 * par.objectAmt;
		specObj[par.partName]["area"] += area;
		specObj[par.partName]["paintedArea"] += paintedArea;
		
		par.mesh.specParams = {specObj: specObj, amt: 1 * par.objectAmt, partName: par.partName, name: name}
	}
	
	//расход материала
	if (par.type == "щит"){
		//добавляем информацию в материалы
		var panelName_40 = calcTimberParams(params.additionalObjectsTimberMaterial).treadsPanelName;	
		var panelName_20 = calcTimberParams(params.additionalObjectsTimberMaterial).riserPanelName;

		if(par.thk == 20) addMaterialNeed({id: panelName_20, amt: area, itemType:  'counterTop'});
		if(par.thk == 40) addMaterialNeed({id: panelName_40, amt: area, itemType:  'counterTop'});
		if(par.thk == 60) {
			addMaterialNeed({id: panelName_20, amt: area, itemType:  'counterTop'});
			addMaterialNeed({id: panelName_40, amt: area, itemType:  'counterTop'});
		}	
		par.mesh.isInMaterials = true;
	}
	
	if(par.type.indexOf('слэб') != -1){
		addMaterialNeed({id: "slab", amt: 1 * par.objectAmt, itemType:  'counterTop'});
		addMaterialNeed({id: "resin", amt: par.resinVol * par.objectAmt, itemType:  'counterTop'});
		par.mesh.isInMaterials = true;
	}
	
	par.mesh.specId = par.partName + name;
	
	//центр в точке 0,0
	var box3 = new THREE.Box3().setFromObject(par.mesh);
	par.mesh.position.x -= (box3.max.x + box3.min.x) / 2;
	par.mesh.position.z -= (box3.max.z + box3.min.z) / 2;
	par.mesh.setLayer("timberPart");
	return par;
}

/**
 * 
 * @param p1 - Первая точка
 * @param p2 - Вторая точка
 */
function getNoisedPoints(p1,p2, offset){
	var dist = 200;
	var offset = offset || 10;
	// Учитываем исходя из того что на 100мм должна быть 1 точка
	var pointsDistance = distance(p1,p2);
	var pointsAngle = angle(p1,p2);
	
	var pointsCount = Math.floor(pointsDistance / dist);
	var offsetStrength = offset;

	var step = pointsDistance / pointsCount;
	var newPoints = [];
	var factor = 1;
	for (var i = 1; i < pointsCount; i++) {
		// var randomAngle =
		var p = polar(p1, pointsAngle, step * i);
		var p = polar(p, pointsAngle + Math.PI / 2, offsetStrength * factor);
		newPoints.push(p);
		factor *= -1;
	}

	return newPoints
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
	
	var models = ['S-8', 'S-9', 'T-6', 'T-7', 'T-12', 'T-17',]
	if(models.indexOf(par.model) != -1){
		par.partsAmt = 1;
	}
	
	if(par.model == 'T-20' || par.model == 'T-9') par.partsAmt = par.legsAmt || 4;
//	if(par.model == 'T-9') par.partsAmt = 4;
	
	//профили
	if(!par.prof || par.prof == "авто"){
		par.legProf = "60х30";
		if(par.width > 600) par.legProf = "80х40";
		if(par.width > 800) par.legProf = "100х40";

		if(par.model == 'T-13') par.legProf = "60х60";

		if(par.model == 'T-4'){
			par.legProf = "40х60";		
			if(par.counterTop.width > 700 || par.counterTop.len > 1200) par.legProf = "50х100";
			if(par.counterTop.width > 1000 || par.counterTop.len > 1400) par.legProf = "100х100";
			if(par.counterTop.geom == "круглый") {
				par.legProf = "40х60";
				if(par.counterTop.width > 900) par.legProf = "50х100";
				if(par.counterTop.width > 1200) par.legProf = "100х100";
			}
		}
		
		//подстолья с квадратной трубой
		if(par.model == "T-10" || par.model == 'T-20') {
			par.legProf = "40х40";
			if(par.width >= 600) par.legProf = "60х60";
		}
	}
	else par.legProf = par.prof;
	
	return par;
}

/** функция отрисовывает верхнюю пластину подстолья
*/

function drawTableBasePlate(par){
	initPar(par)
	
	if(!par.thk) par.thk = 8;
	if(!par.cornerRad) par.cornerRad = 10;
	if (!par.ang) par.ang = 0;
	if (!par.notch) par.notch = 0;

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

	if (par.model == "D-1") {
		var pt = newPoint_xy(p1, distance(p1, p4) / 2, -200);
		var pt1 = itercection(p1, p4, pt, polar(pt, Math.PI / 4, 100))
		var pt2 = itercection(p1, p4, pt, polar(pt, Math.PI / 4 + Math.PI / 2, 100))
		pt.filletRad = pt1.filletRad = pt2.filletRad = par.cornerRad
		points.push(pt1, pt, pt2)
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
	var mesh = new THREE.Mesh(geom, params.materials.additionalObjectMetal);
	mesh.rotation.x = Math.PI / 2;
	if (par.model == "D-1") {
		mesh.rotation.x = -Math.PI / 2;
		mesh.position.y = -par.thk;
		mesh.position.z = par.width;
	}
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
	var mesh = new THREE.Mesh(geom, params.materials.additionalObjectMetal);
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
	var mesh = new THREE.Mesh(geom, params.materials.additionalObjectMetal);

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
	var mesh = new THREE.Mesh(geom, params.materials.additionalObjectMetal);
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
	var mesh = new THREE.Mesh(geom, params.materials.additionalObjectMetal);
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

	if (!par.angInclination) par.angInclination = 0;

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
		material: params.materials.additionalObjectMetal
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


/** функция отрисовывает ногу подстолья для стола D1
*/

function drawTableBaseleg_D1(par) {
	initPar(par)

	var shape = new THREE.Shape();

	var height = par.height
	var width = par.width
	var p0 = { x: 0, y: 0 };

	var r = 50; //радиус скругления
	var r1 = ((width / 2 - 50) ** 2 + 150 ** 2) / (2 * 150);
	var r2 = ((width / 2 - 35) ** 2 + (200 - 20) ** 2) / (2 * (200 - 20));

	var c1 = newPoint_xy(p0, width / 2, 150 - r1);
	var c2 = newPoint_xy(p0, width / 2, 200 - r2);

	var points = [];

	points.push(newPoint_xy(p0, 50, 0))
	points.push(copyPoint(p0))
	points.push(newPoint_xy(p0, 10, 15))
	points.push(newPoint_xy(p0, 35, 20))
	addLines(shape, par.dxfArr, points, par.dxfBasePoint)

	//-----------
	var pt1 = newPoint_xy(c2, -30, r2);
	var pt2 = newPoint_xy(p0, width / 2 - 25, height - 40);

	var line = parallel(pt1, pt2, r)
	var center1 = itercectionLineCircle1(line, c2, r2 + r)[0]

	var pi1 = itercectionLineCircle(c2, center1, c2, r2)[0]
	var pi2 = itercection(pt1, pt2, center1, polar(center1, calcAngleX1(pt1, pt2) + Math.PI / 2, 100))

	addArc2(shape, par.dxfArr, c2, r2, calcAngleX1(c2, points[points.length - 1]), calcAngleX1(c2, pi1), true, par.dxfBasePoint)
	addArc2(shape, par.dxfArr, center1, r, calcAngleX1(center1, pi2), calcAngleX1(center1, pi1), false, par.dxfBasePoint)

	points.push(pi1);
	points.push(pi2);

	//--------------------------
	var pt3 = newPoint_xy(p0, 25, height - 25);

	var fill = calcFilletParams3(pt1, pt2, pt3, r, false)

	addLine(shape, par.dxfArr, pi2, fill.start, par.dxfBasePoint);
	addArc2(shape, par.dxfArr, fill.center, fill.rad, fill.angstart, fill.angend, fill.clockwise, par.dxfBasePoint)
	addLine(shape, par.dxfArr, fill.end, pt3, par.dxfBasePoint);


	points.push(fill.start);
	points.push(fill.end);
	points.push(pt3);
	points.push(newPoint_xy(p0, 0, height));

	addLine(shape, par.dxfArr, pt3, points[points.length - 1], par.dxfBasePoint);

	//------------------------------

	var points1 = [];
	for (var k = 0; k < points.length; k++) {
		points1.push(newPoint_xy(points[k], (width / 2 - points[k].x) * 2, 0))
	}
	points1.reverse();

	var pt1 = newPoint_xy(c2, 30, r2);
	var pt2 = newPoint_xy(p0, width / 2 + 25, height - 40);

	addLine(shape, par.dxfArr, points[points.length - 1], points1[0], par.dxfBasePoint)
	addLine(shape, par.dxfArr, points1[0], points1[1], par.dxfBasePoint)
	addLine(shape, par.dxfArr, points1[1], points1[2], par.dxfBasePoint)

	var fill = calcFilletParams3(points1[1], pt2, pt1, r, false)

	addArc2(shape, par.dxfArr, fill.center, fill.rad, fill.angstart, fill.angend, fill.clockwise, par.dxfBasePoint)
	addLine(shape, par.dxfArr, fill.end, points1[4], par.dxfBasePoint);
	center1 = newPoint_xy(center1, (width / 2 - center1.x) * 2, 0)
	addArc2(shape, par.dxfArr, center1, r, calcAngleX1(center1, points1[5]), calcAngleX1(center1, points1[4]), false, par.dxfBasePoint)
	addArc2(shape, par.dxfArr, c2, r2, calcAngleX1(c2, points1[5]), calcAngleX1(c2, points1[6]), true, par.dxfBasePoint)
	addLine(shape, par.dxfArr, points1[6], points1[7], par.dxfBasePoint)
	addLine(shape, par.dxfArr, points1[7], points1[8], par.dxfBasePoint)
	addLine(shape, par.dxfArr, points1[8], points1[9], par.dxfBasePoint)
	addArc2(shape, par.dxfArr, c1, r1, calcAngleX2(c1, points[0]), calcAngleX2(c1, points1[9]),  false, par.dxfBasePoint)

	var extrudeOptions = {
		amount: par.profPar.sizeA,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	par.mesh = new THREE.Mesh(geom, par.material);

	return par;
}


/** функция отрисовывает часть подстолья относительно всех углов (вид сверху)
*/

function drawTableBaseParts(par) {
	par.mesh = new THREE.Object3D();

	if (!par.count) par.count = [2, 2]; // зеркалить по ширине, длине

	var p0 = { x: 0, y: 0 };

	//точки контура подстолья
	var pt1 = copyPoint(p0);
	var pt2 = newPoint_xy(pt1, 0, par.len);
	var pt3 = newPoint_xy(pt2, par.width, 0);
	var pt4 = newPoint_xy(pt1, par.width, 0);

	var points = par.points;

	for (var i = 0; i < par.count[0]; i++) {

		if (i == 1) {
			points = mirrowPoints(points, 'x')
			points = moovePoints(points, pt2)
		}

		for (var k = 0; k < par.count[1]; k++) {
			if (k == 1) {
				points = mirrowPoints(points, 'y')
				points = moovePoints(points, pt4)
			}

			var meshPar = {
				points: points,
				thk: par.thk,
				material: params.materials.additionalObjectMetal
			}

			var pole1 = drawMesh(meshPar).mesh;
			pole1.position.z = par.posY
			par.mesh.add(pole1);
		}
	}

	return par;
}