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


			//mesh.rotation.x = -Math.PI / 2
			//par.mesh.add(mesh);

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
				material: params.materials.metal,
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
			var mesh = new THREE.Mesh(geom, params.materials.metal);
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

			var p0 = { x: 0, y: 0 };

			//точки контура подстолья
			var pt1 = copyPoint(p0);
			var pt2 = newPoint_xy(pt1, 0, par.len);
			var pt3 = newPoint_xy(pt2, par.width, 0);
			var pt4 = newPoint_xy(pt1, par.width, 0);


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
				}

				//верхняя пластина
				var p1 = copyPoint(p0)
				var p2 = newPoint_xy(p1, 0, 100)
				var p3 = newPoint_xy(p2, par.width, 0)
				var p4 = newPoint_xy(p1, par.width, 0)

				var meshPar = {
					points: [p1, p2, p3, p4],
					thk: thk,
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
				var rad = par.width;
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
						thk: par.height - thk * 2,
					}
					var pole1 = drawMesh(meshPar).mesh;
					pole1.position.z = thk;
					mesh.add(pole1);
				}

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
	if (!(par.model == "S-9")) {
		var box3 = new THREE.Box3().setFromObject(par.mesh);
		par.mesh.position.x -= (box3.max.x + box3.min.x) / 2;
		par.mesh.position.z -= (box3.max.z + box3.min.z) / 2;
	}

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

	var p0 = { x: 0, y: 0 };

	if (params.tableGeom !== 'круглый') {
		var p1 = copyPoint(p0);
		var p2 = newPoint_xy(p0, 0, par.len);
		var p3 = newPoint_xy(p0, par.width, par.len);
		var p4 = newPoint_xy(p0, par.width, 0);



		var points = [p1, p2, p3, p4];

		if (par.model != "цельная") {
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
	}

	if (params.tableGeom == 'круглый') {

		var shape = new THREE.Shape();

		var rad = params.width;

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
	
	var models = ['S-8','S-9', 'T-6', 'T-7', 'T-9', 'T-10', 'T-12', 'T-16', 'T-17',]
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
	var mesh = new THREE.Mesh(geom, params.materials.metal);
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
