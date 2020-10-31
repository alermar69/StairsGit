/**отрисовывает фланцы с коробами внутри ступени*/
function drawStringerConsoleFlans(par)
{
	var marshPar = getMarshParams(par.marshId);
	var turnParams = calcTurnParams(par.marshId)
	
	par.mesh = new THREE.Object3D();

	var flanPar = {
		marshId: par.marshId,
		dxfBasePoint: copyPoint(par.dxfBasePoint),
		type: 'marsh',
		wndPar: par.wndPar,
		wndPar2: par.wndPar2,
	}

	calcStringerConsoleFlanPar(flanPar);
	calcConsoleFramePar(flanPar);

	var offsetX = flanPar.shiftFlanX;

	for (var i = 0; i < marshPar.stairAmt; i++) {
		flanPar.dxfBasePoint = newPoint_xy(flanPar.dxfBasePoint, 0, flanPar.widthTread + 50);
		var flan = drawStringerConsoleFlan(flanPar);
		flan.position.x = marshPar.b * i + offsetX;
		flan.position.y = marshPar.h * (i + 1) + flanPar.shiftFlanY;
		par.mesh.add(flan);
	}

	if (marshPar.topTurn == 'площадка') {
		flanPar.type = 'platformTop';
		if (params.stairModel == "П-образная с площадкой" && par.marshId == 1) flanPar.type = 'platformTopP';
		calcStringerConsoleFlanPar(flanPar);
		for (var i = 0; i < 2; i++) {
			flanPar.dxfBasePoint = newPoint_xy(flanPar.dxfBasePoint, 0, flanPar.widthTread + 50);
			var flan = drawStringerConsoleFlan(flanPar);
			flan.position.x = marshPar.b * marshPar.stairAmt + flanPar.widthTread * i + flanPar.widthTread / 2 - flanPar.widthFlan / 2;
			flan.position.y = marshPar.h * (marshPar.stairAmt + 1) + flanPar.shiftFlanY;
			par.mesh.add(flan);
		}
	}

	if (marshPar.botTurn == 'площадка') {
		if (params.stairModel == "П-образная с площадкой") {
			flanPar.type = 'platformBotP';
			calcStringerConsoleFlanPar(flanPar);
			for (var i = 0; i < 2; i++) {
				flanPar.dxfBasePoint = newPoint_xy(flanPar.dxfBasePoint, 0, flanPar.widthTread + 50);
				var flan = drawStringerConsoleFlan(flanPar);
				flan.position.x = params.nose - flanPar.widthTread / 2 - flanPar.widthFlan / 2 - flanPar.widthTread * i;
				flan.position.y = flanPar.shiftFlanY;
				par.mesh.add(flan);
			}
		}
	}

	if (marshPar.topTurn == 'забег') {
		var wndPar = par.wndPar;
		if (par.wndPar2 && par.marshId !== 1) wndPar = par.wndPar2;

		var marshDist = 0;
		if (par.wndPar2 && par.marshId !== 1) marshDist = params.marshDist - 35;

		var posX = marshPar.b * marshPar.stairAmt + offsetX + marshDist;
		var posY = marshPar.h * (marshPar.stairAmt + 1) + flanPar.shiftFlanY;
		flanPar.type = 'winder1';
		calcStringerConsoleFlanPar(flanPar);
		flanPar.dxfBasePoint = newPoint_xy(flanPar.dxfBasePoint, 0, flanPar.widthTread + 50);
		var flan = drawStringerConsoleFlan(flanPar);
		flan.position.x = posX;
		flan.position.y = posY;
		par.mesh.add(flan);

		flanPar.type = 'winder2';
		calcStringerConsoleFlanPar(flanPar);
		flanPar.dxfBasePoint = newPoint_xy(flanPar.dxfBasePoint, 0, flanPar.widthTread + 50);
		var flan = drawStringerConsoleFlan(flanPar);
		flan.position.x = posX + turnParams.turnLengthTop - wndPar.params[2].stepWidthY;
		flan.position.y = posY + marshPar.h_topWnd;
		par.mesh.add(flan);
	}

	if (marshPar.botTurn == 'забег') {
		var wndPar = par.wndPar;
		if (par.wndPar2 && par.marshId == 3) wndPar = par.wndPar2;
		flanPar.type = 'winder3';
		calcStringerConsoleFlanPar(flanPar);
		flanPar.dxfBasePoint = newPoint_xy(flanPar.dxfBasePoint, 0, flanPar.widthTread + 250);
		var flan = drawStringerConsoleFlan(flanPar);
		flan.position.x = offsetX - flanPar.widthFlan;
		if (wndPar.plusMarshDist) flan.position.x += params.marshDist - 45;
		flan.position.y = flanPar.shiftFlanY;
		par.mesh.add(flan);

		flanPar.type = 'winder21';
		calcStringerConsoleFlanPar(flanPar);
		flanPar.dxfBasePoint = newPoint_xy(flanPar.dxfBasePoint, 0, flanPar.widthTread + 50);
		var flan = drawStringerConsoleFlan(flanPar);
		flan.position.x = -turnParams.turnLengthBot + 5 - calcStringerMoove(par.marshId).stringerOutMoovePrev;
		flan.position.y = flanPar.shiftFlanY - marshPar.h;
		par.mesh.add(flan);
	}

	return par;
}

/**создает фланец с коробом внутри ступени*/
function drawStringerConsoleFlan(par) {

	var mesh = new THREE.Object3D();

	//создаем фланец
	var p1 = { x: 0, y: 0 };
	var p2 = newPoint_xy(p1, par.widthFlan, 0);
	var p3 = newPoint_xy(p2, 0, -par.heigthFlan);
	var p4 = newPoint_xy(p3, -par.widthFlan, 0);

	var pointsShape = [p1, p2, p3, p4];

	//создаем шейп
	var shapePar = {
		points: pointsShape,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
	}
	var flanShape = drawShapeByPoints2(shapePar).shape;

	var holeCenters = par.holesFlan;

	var holesPar = {
		holeArr: holeCenters,
		dxfBasePoint: shapePar.dxfBasePoint,
		shape: flanShape,
	}
	addHolesToShape(holesPar);

	var thk = 8.0;
	var flanExtrudeOptions = {
		amount: thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(flanShape, flanExtrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var flan = new THREE.Mesh(geom, params.materials.metal);

	 mesh.add(flan);


	/* болты */

	if (typeof anglesHasBolts != "undefined" && anglesHasBolts && params.stringerModel == "лист") { //глобальная переменная
		var side = "right";
		//if (par.side) side = par.side;
		if (params.stairModel == "Прямая") {
			//if (par.side == "left") side = "right";
			//if (par.side == "right") side = "left";
			side = "left";
		}
		var boltPar = {
			diam: boltDiam,
			len: boltLen,
		}
		for (var i = 0; i < holeCenters.length; i++) {
			if (!holeCenters[i].hasAngle && !holeCenters[i].noBolt) {
				if (holeCenters[i].headType) boltPar.headType = holeCenters[i].headType;
				else boltPar.headType = false;
				if (holeCenters[i].boltLen) boltPar.len = holeCenters[i].boltLen;
				else boltPar.len = boltLen;
				var bolt = drawBolt(boltPar).mesh;
				bolt.rotation.x = Math.PI / 2 * turnFactor;
				bolt.position.x = holeCenters[i].x;
				bolt.position.y = holeCenters[i].y;
				bolt.position.z = (boltPar.len / 2 - params.stringerThickness) * turnFactor + params.stringerThickness * (1 - turnFactor) * 0.5;
				if (holeCenters[i].dz) bolt.position.z += holeCenters[i].dz;
				if (side == "right") {
					bolt.position.z = (params.stringerThickness * 2 - boltPar.len / 2) * turnFactor + params.stringerThickness * (1 - turnFactor) * 0.5;
					bolt.rotation.x = -Math.PI / 2 * turnFactor;
					if (holeCenters[i].dz) bolt.position.z -= holeCenters[i].dz;
				}
				mesh.add(bolt)
			}
		}
	}


	//короба для забежных ступеней
	if (~par.type.indexOf("winder")) {
		var wndPar = par.wndPar;
		//для первой и третьей забежной ступени
		if (par.type == "winder1" || par.type == "winder3") {
			if (par.wndPar2 && par.marshId !== 1 && par.type == "winder1") wndPar = par.wndPar2;
			if (par.wndPar2 && par.marshId == 3 && par.type == "winder3") wndPar = par.wndPar2;
			var heightBox = params.treadThickness - 20;
			var widthBox = par.widthFlan - 20 * 2;
			var lenghtBox = params.M + calcStringerMoove(par.marshId).stringerOutMoove - 20;
			var turnParams = wndPar.params[1];
			if (par.type == "winder3") turnParams = wndPar.params[3];

			var stringerMoove = calcStringerMoove(par.marshId).stringerOutMoove;

			var p0 = { x: 0, y: 0 };
			var p1 = newPoint_xy(p0, 0, turnParams.stepWidthHi);
			var p3 = newPoint_xy(p0, turnParams.treadWidth, 0);
			var p2 = newPoint_xy(p3, 0, turnParams.stepWidthLow);

			var line_p0_p1 = parallel(p0, p1, stringerMoove);
			var line_p0_p3 = parallel(p0, p3, 40);
			var line_p1_p2 = parallel(p1, p2, -40 * Math.cos(turnParams.edgeAngle) - stringerMoove * Math.tan(turnParams.edgeAngle));
			var line_p2_p3 = parallel(p2, p3, 100 + stringerMoove);

			var pt0 = itercectionLines(line_p0_p1, line_p0_p3);
			var pt1 = itercectionLines(line_p0_p1, line_p1_p2);
			var pt2 = itercectionLines(line_p1_p2, line_p2_p3);
			var pt3 = itercectionLines(line_p0_p3, line_p2_p3);

			var pointsShape = [pt0, pt1, pt2, pt3];

			//создаем шейп
			var shapePar = {
				points: pointsShape,
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: newPoint_xy(par.dxfBasePoint, par.widthFlan + 500, -par.heigthFlan),
			}
			var boxShape = drawShapeByPoints2(shapePar).shape;

			var boxExtrudeOptions = {
				amount: heightBox,
				bevelEnabled: false,
				curveSegments: 12,
				steps: 1
			};

			var geom = new THREE.ExtrudeGeometry(boxShape, boxExtrudeOptions);
			geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
			var box = new THREE.Mesh(geom, params.materials.metal);
			box.position.x = - 20;
			box.position.y = -par.heigthFlan / 2 - heightBox / 2 * turnFactor;
			box.position.z = 8 + calcStringerMoove(par.marshId).stringerOutMoove;
			if (turnFactor == - 1) box.position.z = -calcStringerMoove(par.marshId).stringerOutMoove;
			box.rotation.x = -Math.PI / 2 * turnFactor;
			box.rotation.z = -Math.PI / 2;

			if (par.type == "winder3") {
				box.position.x = 60 + widthBox;
				box.position.y = -par.heigthFlan / 2 + heightBox / 2 * turnFactor;
				box.rotation.x = Math.PI / 2 * turnFactor;
				box.rotation.z = Math.PI / 2;
			}

			mesh.add(box);
		}

		//для второй забежной ступени
		if (par.type == "winder2") {
			if (par.wndPar2 && par.marshId !== 1) wndPar = par.wndPar2;
			var heightBox = params.treadThickness - 20;
			var widthBox = par.widthFlan - 20 * 2;
			var turnParams = wndPar.params[2];
			var stringerMoove1 = calcStringerMoove(par.marshId).stringerOutMoove;
			var stringerMoove2 = calcStringerMoove(par.marshId).stringerOutMooveNext;

			var p0 = { x: 0, y: 0 };
			var p1 = newPoint_xy(p0, 0, turnParams.stepWidthY);
			var p2 = newPoint_xy(p1, turnParams.stepWidthX, 0);
			var p5 = newPoint_xy(p0, turnParams.treadWidthX, -turnParams.stepOffsetY);
			var p3 = newPoint_xy(p5, 0, turnParams.innerOffsetY);
			var p4 = newPoint_xy(p5, -turnParams.innerOffsetX, 0);

			var line_p0_p1 = parallel(p0, p1, stringerMoove1);
			var line_p0_p5 = parallel(p0, p5, 40);
			var line_p1_p2 = parallel(p1, p2, stringerMoove2);
			var line_p2_p3 = parallel(p2, p3, -40);
			var line_p3_p4 = parallel(p3, p5, 100);

			var pt0 = itercectionLines(line_p0_p1, line_p0_p5);
			var pt1 = itercectionLines(line_p0_p1, line_p1_p2);
			var pt2 = itercectionLines(line_p1_p2, line_p2_p3);
			var pt3 = itercectionLines(line_p3_p4, line_p2_p3);
			var pt4 = itercectionLines(line_p3_p4, line_p0_p5);

			var pointsShape = [pt0, pt1, pt2, pt3, pt4];

			//создаем шейп
			var shapePar = {
				points: pointsShape,
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: newPoint_xy(par.dxfBasePoint, par.widthFlan + 500, 0),
			}
			var boxShape = drawShapeByPoints2(shapePar).shape;

			var boxExtrudeOptions = {
				amount: heightBox,
				bevelEnabled: false,
				curveSegments: 12,
				steps: 1
			};

			var geom = new THREE.ExtrudeGeometry(boxShape, boxExtrudeOptions);
			geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
			var box = new THREE.Mesh(geom, params.materials.metal);
			box.position.x = - 20;
			box.position.y = -par.heigthFlan / 2 - heightBox / 2 * turnFactor;
			box.position.z = 8 + calcStringerMoove(par.marshId).stringerOutMoove;
			if (turnFactor == - 1) box.position.z = -calcStringerMoove(par.marshId).stringerOutMoove;
			box.rotation.x = -Math.PI / 2 * turnFactor;
			box.rotation.z = -Math.PI / 2;

			mesh.add(box);
		}
	}

	//сохраняем данные для спецификации
	var partName = "treadFrame";
	if (par.type == "winder1") partName = "wndFrame1";
	if (par.type == "winder2") partName = "wndFrame2";
	if (par.type == "winder3") partName = "wndFrame3";
	if (typeof specObj != 'undefined') {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Рама прямой ступени",
				area: 0,
				paintedArea: 0,
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "area", //единица измерения
				group: "Каркас",
			}
			if (par.type == "winder1") specObj[partName].name = "Рама забежной ступени 1";
			if (par.type == "winder2") specObj[partName].name = "Рама забежной ступени 2";
			if (par.type == "winder3") specObj[partName].name = "Рама забежной ступени 3";
		}
		var name = par.heigthFlan + "x" + par.widthFlan;
		var area = par.heigthFlan * par.widthFlan / 1000000;

		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		specObj[partName]["paintedArea"] += area * 2;
	}

	mesh.specId = partName;
	if (name) mesh.specId += name;

	return mesh;

} //end of drawStringerConsoleFlan

/**Определение параметров фланцев и отверстий в фланце и крепления тетивы к стене*/
function calcStringerConsoleFlanPar(par) {

	var offsetHoleX = 20;
	var offsetHoleY = 20;

	par.holesFlan = [];
	par.holesFlanAndStringer = [];
	par.heigthFlan = params.treadThickness + offsetHoleY * 4;

	par.shiftFlanX = params.nose;
	par.shiftFlanY = offsetHoleY * 2;

	calcConsoleTreadPar(par);

	par.widthFlan = par.widthTread - par.shiftFlanX * 2;
	if (~par.type.indexOf('platform')) {
		par.widthFlan = calcConsoleTreadPar({ marshId: par.marshId, type: 'marsh' }).widthTread - par.shiftFlanX * 2;
	}
	if (~par.type.indexOf('winder2')) par.widthFlan = par.widthTread - par.shiftFlanX;

	//определение центров отверстий в фланце
	var p1 = { x: 0, y: 0 };
	var center1 = newPoint_xy(p1, par.widthFlan / 2, -offsetHoleY);
	var center2 = newPoint_xy(center1, 0, -params.treadThickness - offsetHoleY * 2);
	var center3 = newPoint_xy(center1, -par.widthFlan / 2 + offsetHoleX, 0.0);
	var center4 = newPoint_xy(center1, par.widthFlan / 2 - offsetHoleX, 0.0);
	center1.noZenk = center2.noZenk = center3.noZenk = center4.noZenk = true;
	par.holesFlan.push(center1);
	par.holesFlan.push(center2);
	par.holesFlan.push(center3);
	par.holesFlan.push(center4);

	//определение центров отверстий крепления тетивы к стене
	var center5 = newPoint_xy(center3, 0, offsetHoleY * 2);
	var center6 = newPoint_xy(center4, 0, offsetHoleY * 2);
	var center7 = newPoint_xy(center2, 0, -offsetHoleY * 2);
	center5.isFixWall = center6.isFixWall = center7.isFixWall = true;
	center5.noZenk = center6.noZenk = center7.noZenk = true;

	par.holesFlanAndStringer.push(center1);
	par.holesFlanAndStringer.push(center2);
	par.holesFlanAndStringer.push(center3);
	par.holesFlanAndStringer.push(center4);
	par.holesFlanAndStringer.push(center5);
	par.holesFlanAndStringer.push(center6);
	par.holesFlanAndStringer.push(center7);

	return par;
}



/**отрисовывает рамки внутри ступени*/
function drawConsoleFrames(par) {
	var marshPar = getMarshParams(par.marshId);
	var turnParams = calcTurnParams(par.marshId)

	par.mesh = new THREE.Object3D();

	var framePar = {
		marshId: par.marshId,
		dxfBasePoint: copyPoint(par.dxfBasePoint),
		type: 'marsh',
	}

	for (var i = 0; i < marshPar.stairAmt; i++) {
		framePar.dxfBasePoint = newPoint_xy(framePar.dxfBasePoint, 0, framePar.widthTread + 50);

		var frame = drawConsoleFrame(framePar).mesh;
		frame.position.x = marshPar.b * i + marshPar.a / 2;
		frame.position.y = marshPar.h * (i + 1) - params.treadThickness / 2 - framePar.heightBox / 2 * turnFactor;
		frame.rotation.z = Math.PI / 2;
		if (params.stairModel == "Прямая") {
			frame.rotation.x = Math.PI;
			frame.position.y += framePar.heightBox * turnFactor;
		}
		par.mesh.add(frame);
	}

	if (marshPar.topTurn == 'площадка') {
		framePar.type = 'platformTop';
		if (params.stairModel == "П-образная с площадкой" && par.marshId == 1) framePar.type = 'platformTopP';
		for (var i = 0; i < 2; i++) {
			//flanPar.dxfBasePoint = newPoint_xy(flanPar.dxfBasePoint, 0, flanPar.widthTread + 50);
			var frame = drawConsoleFrame(framePar).mesh;
			frame.position.x = marshPar.b * marshPar.stairAmt + framePar.widthTread * i + framePar.widthTread / 2;
			frame.position.y = marshPar.h * (marshPar.stairAmt + 1) - params.treadThickness / 2 - framePar.heightBox / 2 * turnFactor;
			frame.rotation.z = Math.PI / 2;
			if (framePar.type == 'platformTopP') {
				frame.position.z = (params.M + params.marshDist + framePar.offsetFrameIn + calcStringerMoove(3).stringerOutMoove) * turnFactor;
				if (params.stringerModel == 'короб') frame.position.z += params.stringerThickness * turnFactor;
			}
			par.mesh.add(frame);
		}
	}

	if (params.stringerModel == 'короб') {
		if (marshPar.topTurn == 'забег') {
			var thk = 4;
			var wndFrames = new THREE.Object3D();

			calcConsoleFrameWndPar(framePar);
			calcConsoleFramePar(framePar);

			var posX = marshPar.b * marshPar.stairAmt + turnParams.turnLengthTop;
			var posY = marshPar.h * (marshPar.stairAmt + 1) - params.treadThickness / 2 - framePar.heightBox / 2 * turnFactor;

			var meshPar = {
				points: framePar.wndFrames['1'].pointsFrame,
				thk: thk,
				material: params.materials.metal,
				isObject3D: true,
			}

			var frame1 = new THREE.Object3D();

			var plateTop = drawMesh(meshPar).mesh;
			frame1.add(plateTop);

			var plateBot = drawMesh(meshPar).mesh;
			plateBot.position.z = framePar.heightBox - thk;
			frame1.add(plateBot);

			//внутренние пластины по контуру тетивы
			var platePar = {
				marshId: par.marshId,
				dxfBasePoint: par.dxfBasePoint,
				pointsShape: framePar.wndFrames['1'].pointsFrame,
				thk: thk,
				width: framePar.heightBox - thk * 2,
				isNotDraw: [0, 1, 0, 1],
			}

			var plates = drawContourPlates(platePar).mesh;
			plates.position.z = thk;
			frame1.add(plates);

			frame1.position.x = posX + framePar.wndFrames['1'].p1Out.y;
			frame1.position.y = posY;

			frame1.rotation.x = -Math.PI / 2 * turnFactor;
			frame1.rotation.z = -Math.PI / 2;

			wndFrames.add(frame1);

			//---------------
			meshPar.points = framePar.wndFrames['2'].pointsFrame;
			var frame2 = new THREE.Object3D();

			var plateTop = drawMesh(meshPar).mesh;
			frame2.add(plateTop);

			var plateBot = drawMesh(meshPar).mesh;
			plateBot.position.z = framePar.heightBox - thk;
			frame2.add(plateBot);

			//внутренние пластины по контуру тетивы
			var platePar = {
				marshId: par.marshId,
				dxfBasePoint: par.dxfBasePoint,
				pointsShape: framePar.wndFrames['2'].pointsFrame,
				thk: thk,
				width: framePar.heightBox - thk * 2,
				isNotDraw: [0, 1, 0, 0, 1, 0, 1],
			}

			var plates = drawContourPlates(platePar).mesh;
			plates.position.z = thk;
			frame2.add(plates);

			frame2.position.x = posX + framePar.wndFrames['2'].p1Out.y;
			frame2.position.y = posY + marshPar.h;

			frame2.rotation.x = -Math.PI / 2 * turnFactor;
			frame2.rotation.z = -Math.PI / 2;

			wndFrames.add(frame2);

			//----------------------------
			meshPar.points = framePar.wndFrames['3'].pointsFrame;
			var frame3 = new THREE.Object3D();

			var plateTop = drawMesh(meshPar).mesh;
			frame3.add(plateTop);

			var plateBot = drawMesh(meshPar).mesh;
			plateBot.position.z = framePar.heightBox - thk;
			frame3.add(plateBot);

			//внутренние пластины по контуру тетивы
			var platePar = {
				marshId: par.marshId,
				dxfBasePoint: par.dxfBasePoint,
				pointsShape: framePar.wndFrames['3'].pointsFrame,
				thk: thk,
				width: framePar.heightBox - thk * 2,
				isNotDraw: [0, 1, 0, 1],
			}

			var plates = drawContourPlates(platePar).mesh;
			plates.position.z = thk;
			frame3.add(plates);

			frame3.position.x = posX + params.stringerThickness + calcStringerMoove(par.marshId).stringerOutMooveNext;
			frame3.position.y = posY + marshPar.h * 2;
			frame3.position.z = (framePar.wndFrames['3'].p1Out.x + params.stringerThickness + calcStringerMoove(par.marshId).stringerOutMoove) * turnFactor;

			frame3.rotation.x = -Math.PI / 2 * turnFactor;
			frame3.rotation.z = -Math.PI / 2;

			wndFrames.add(frame3);

			wndFrames.position.z = (-params.M / 2 - params.stringerThickness - calcStringerMoove(par.marshId).stringerOutMoove) * turnFactor;

			if (par.marshId == 2 && marshPar.stairAmt == 0) {
				wndFrames.position.x += params.marshDist - 45;
			}
			par.mesh.add(wndFrames);
		}
	}

	return par;
}

/**Отрисовывает рамку ступени*/
function drawConsoleFrame(par) {
	var thk = 4;

	par.mesh = new THREE.Object3D();

	calcConsoleFramePar(par)

	var meshPar = {
		points: par.pointsShapeFrame,
		thk: thk,
		material: params.materials.metal,
		isObject3D: true,
	}

	var frame = new THREE.Object3D();

	if (!(~par.type.indexOf("winder") || par.type == 'platformBotP')) {


		var plateTop = drawMesh(meshPar).mesh;
		frame.add(plateTop);

		var plateBot = drawMesh(meshPar).mesh;
		plateBot.position.z = par.heightBox - thk;
		frame.add(plateBot);

		//внутренние пластины по контуру тетивы
		var platePar = {
			marshId: par.marshId,
			dxfBasePoint: par.dxfBasePoint,
			pointsShape: par.pointsShapeFrame,
			thk: thk,
			width: par.heightBox - thk * 2,
			isNotDraw: [0, 1, 0, 1],
		}

		var plates = drawContourPlates(platePar).mesh;
		plates.position.z = thk;
		frame.add(plates);

		frame.rotation.y = Math.PI / 2 * turnFactor;

		par.mesh.add(frame);
	}

	//короба для забежных ступеней
	if (~par.type.indexOf("winder")) {

		var wndPar = par.wndPar;
		//calcConsoleFramePar(par);

		//для первой и третьей забежной ступени
		if (par.type == "winder1" || par.type == "winder3") {
			if (par.wndPar2 && par.marshId !== 1 && par.type == "winder1") wndPar = par.wndPar2;
			if (par.wndPar2 && par.marshId == 3 && par.type == "winder3") wndPar = par.wndPar2;
			var heightBox = params.treadThickness - 20;
			var turnParams = wndPar.params[1];
			if (par.type == "winder3") turnParams = wndPar.params[3];

			var stringerMoove = calcStringerMoove(par.marshId).stringerOutMoove;

			var p0 = { x: 0, y: 0 };
			var p1 = newPoint_xy(p0, 0, turnParams.stepWidthHi);
			var p3 = newPoint_xy(p0, turnParams.treadWidth, 0);
			var p2 = newPoint_xy(p3, 0, turnParams.stepWidthLow);

			var line_p0_p1 = parallel(p0, p1, stringerMoove);
			var line_p0_p3 = parallel(p0, p3, 40);
			var line_p1_p2 = parallel(p1, p2, -40 * Math.cos(turnParams.edgeAngle) - stringerMoove * Math.tan(turnParams.edgeAngle));
			var line_p2_p3 = parallel(p2, p3, 100 + stringerMoove);

			var pt0 = itercectionLines(line_p0_p1, line_p0_p3);
			var pt1 = itercectionLines(line_p0_p1, line_p1_p2);
			var pt2 = itercectionLines(line_p1_p2, line_p2_p3);
			var pt3 = itercectionLines(line_p0_p3, line_p2_p3);

			var pointsShape = [pt0, pt1, pt2, pt3];

			//создаем шейп
			var shapePar = {
				points: pointsShape,
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: newPoint_xy(par.dxfBasePoint, par.widthFlan + 500, -par.heigthFlan),
			}
			var boxShape = drawShapeByPoints2(shapePar).shape;

			var boxExtrudeOptions = {
				amount: par.heightBox,
				bevelEnabled: false,
				curveSegments: 12,
				steps: 1
			};

			var geom = new THREE.ExtrudeGeometry(boxShape, boxExtrudeOptions);
			geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
			var box = new THREE.Mesh(geom, params.materials.metal);
			box.position.x = - 20;
			box.position.y = -par.heigthFlan / 2 - par.heightBox / 2 * turnFactor;
			box.position.z = 8 + calcStringerMoove(par.marshId).stringerOutMoove;
			if (turnFactor == - 1) box.position.z = -calcStringerMoove(par.marshId).stringerOutMoove;
			if (params.stringerModel == 'короб') {
				box.position.z = calcStringerMoove(par.marshId).stringerOutMoove + params.stringerThickness + 4;
				if (turnFactor == - 1) box.position.z = -calcStringerMoove(par.marshId).stringerOutMoove;
			}
			box.rotation.x = -Math.PI / 2 * turnFactor;
			box.rotation.z = -Math.PI / 2;

			if (par.type == "winder3") {
				box.position.x = 60 + par.widthBox;
				box.position.y = -par.heigthFlan / 2 + par.heightBox / 2 * turnFactor;
				box.rotation.x = Math.PI / 2 * turnFactor;
				box.rotation.z = Math.PI / 2;
			}

			mesh.add(box);
		}

		//для второй забежной ступени
		if (par.type == "winder2") {
			if (par.wndPar2 && par.marshId !== 1) wndPar = par.wndPar2;
			var heightBox = params.treadThickness - 20;
			var widthBox = par.widthFlan - 20 * 2;
			var turnParams = wndPar.params[2];
			var stringerMoove1 = calcStringerMoove(par.marshId).stringerOutMoove;
			var stringerMoove2 = calcStringerMoove(par.marshId).stringerOutMooveNext;

			var p0 = { x: 0, y: 0 };
			var p1 = newPoint_xy(p0, 0, turnParams.stepWidthY);
			var p2 = newPoint_xy(p1, turnParams.stepWidthX, 0);
			var p5 = newPoint_xy(p0, turnParams.treadWidthX, -turnParams.stepOffsetY);
			var p3 = newPoint_xy(p5, 0, turnParams.innerOffsetY);
			var p4 = newPoint_xy(p5, -turnParams.innerOffsetX, 0);

			var line_p0_p1 = parallel(p0, p1, stringerMoove1);
			var line_p0_p5 = parallel(p0, p5, 40);
			var line_p1_p2 = parallel(p1, p2, stringerMoove2);
			var line_p2_p3 = parallel(p2, p3, -40);
			var line_p3_p4 = parallel(p3, p5, 100);

			var pt0 = itercectionLines(line_p0_p1, line_p0_p5);
			var pt1 = itercectionLines(line_p0_p1, line_p1_p2);
			var pt2 = itercectionLines(line_p1_p2, line_p2_p3);
			var pt3 = itercectionLines(line_p3_p4, line_p2_p3);
			var pt4 = itercectionLines(line_p3_p4, line_p0_p5);

			var pointsShape = [pt0, pt1, pt2, pt3, pt4];

			//создаем шейп
			var shapePar = {
				points: pointsShape,
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: newPoint_xy(par.dxfBasePoint, par.widthFlan + 500, 0),
			}
			var boxShape = drawShapeByPoints2(shapePar).shape;

			var boxExtrudeOptions = {
				amount: heightBox,
				bevelEnabled: false,
				curveSegments: 12,
				steps: 1
			};

			var geom = new THREE.ExtrudeGeometry(boxShape, boxExtrudeOptions);
			geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
			var box = new THREE.Mesh(geom, params.materials.metal);
			box.position.x = - 20;
			box.position.y = -par.heigthFlan / 2 - heightBox / 2 * turnFactor;
			box.position.z = 8 + calcStringerMoove(par.marshId).stringerOutMoove;
			if (turnFactor == - 1) box.position.z = -calcStringerMoove(par.marshId).stringerOutMoove;
			box.rotation.x = -Math.PI / 2 * turnFactor;
			box.rotation.z = -Math.PI / 2;

			mesh.add(box);
		}
	}



	return par;

}

/**Определение параметров рамки*/
function calcConsoleFramePar(par) {

	var p0 = { x: 0, y: 0 };

	par.offsetFrameX = 20;
	par.offsetFrameY = 20;
	par.offsetFrameIn = 20;
	par.pointsShapeFrame = [];

	var turnParams = calcTurnParams(par.marshId)

	calcConsoleTreadPar(par)

	par.heightBox = params.treadThickness - par.offsetFrameY;

	par.widthBox = par.widthTread - par.offsetFrameX * 2;
	if (~par.type.indexOf('platform')) {
		par.widthBox = calcConsoleTreadPar({ marshId: par.marshId, type: 'marsh' }).widthTread - par.offsetFrameX * 2;
	}

	par.lenghtBox = params.M + calcStringerMoove(par.marshId).stringerOutMoove - par.offsetFrameIn;

	if (par.type == 'platformTopP')
		par.lenghtBox = params.M * 2 + params.marshDist + calcStringerMoove(par.marshId).stringerOutMoove + calcStringerMoove(3).stringerOutMoove;

	if (params.stringerModel == 'короб') {
		par.lenghtBox += params.stringerThickness;
		if (par.type == 'platformTopP') par.lenghtBox += params.stringerThickness;
	}


	// рассчитывем точки верхней пластины
	if (!(~par.type.indexOf("winder"))) {
		//центр верхней пластины находится в центре ступени
		var p1 = newPoint_xy(p0, -params.M / 2 + par.offsetFrameIn, -par.widthBox / 2);
		var p2 = newPoint_xy(p1, 0, par.widthBox);
		var p3 = newPoint_xy(p2, par.lenghtBox, 0);
		var p4 = newPoint_xy(p1, par.lenghtBox, 0);
		par.pointsShapeFrame = [p1, p2, p3, p4];
	}

	if (~par.type.indexOf("winder")) {
		if (!par.wndPar) par.wndPar = treadsObj.wndPar;
		if (!par.wndPar2) par.wndPar2 = treadsObj.wndPar2;

		var wndPar = par.wndPar;

		//для первой и третьей забежной ступени
		if (par.type == "winder1" || par.type == "winder3") {

			if (par.wndPar2 && par.marshId !== 1 && par.type == "winder1") wndPar = par.wndPar2;
			if (par.wndPar2 && par.marshId == 3 && par.type == "winder3") wndPar = par.wndPar2;

			var turnParams = par.wndPar.params[1];
			if (par.type == "winder3") turnParams = par.wndPar.params[3];

			var offset = 40;

			var stringerMoove = calcStringerMoove(par.marshId).stringerOutMoove;
			if (params.stringerModel == 'короб') {
				stringerMoove += params.stringerThickness;
				offset = par.offsetFrameX;
			}


			var p0 = { x: 0, y: 0 };
			var p1 = newPoint_xy(p0, 0, turnParams.stepWidthHi);
			var p3 = newPoint_xy(p0, turnParams.treadWidth, 0);
			var p2 = newPoint_xy(p3, 0, turnParams.stepWidthLow);

			var line_p0_p1 = parallel(p0, p1, stringerMoove);
			var line_p0_p3 = parallel(p0, p3, offset);
			var line_p1_p2 = parallel(p1, p2, -offset * Math.cos(turnParams.edgeAngle) - stringerMoove * Math.tan(turnParams.edgeAngle));
			if (params.stringerModel == 'короб') line_p1_p2 = parallel(p1, p2, -offset);
			var line_p2_p3 = parallel(p2, p3, 100 + stringerMoove);

			var pt0 = itercectionLines(line_p0_p1, line_p0_p3);
			var pt1 = itercectionLines(line_p0_p1, line_p1_p2);
			var pt2 = itercectionLines(line_p1_p2, line_p2_p3);
			var pt3 = itercectionLines(line_p0_p3, line_p2_p3);

			par.pointsShapeFrame = [pt0, pt1, pt2, pt3];

			if (params.stringerModel == 'короб') {
				var pk1 = itercection(line_p0_p1.p1, line_p0_p1.p2, p0, p3);
				var pk2 = itercection(line_p0_p1.p1, line_p0_p1.p2, p1, p2);
				par.stepWidthHiTread1 = distance(pk1, pk2);
			}

		}

		//для второй забежной ступени
		if (par.type == "winder2") {
			if (par.wndPar2 && par.marshId !== 1) wndPar = par.wndPar2;
			var turnParams = wndPar.params[2];
			var stringerMoove1 = calcStringerMoove(par.marshId).stringerOutMoove;
			var stringerMoove2 = calcStringerMoove(par.marshId).stringerOutMooveNext;
			if (params.stringerModel == 'короб') {
				stringerMoove1 += params.stringerThickness;
				stringerMoove2 += params.stringerThickness;
			}

			var p0 = { x: 0, y: 0 };
			var p1 = newPoint_xy(p0, 0, turnParams.stepWidthY);
			var p2 = newPoint_xy(p1, turnParams.stepWidthX, 0);
			var p5 = newPoint_xy(p0, turnParams.treadWidthX, -turnParams.stepOffsetY);
			var p3 = newPoint_xy(p5, 0, turnParams.innerOffsetY);
			var p4 = newPoint_xy(p5, -turnParams.innerOffsetX, 0);

			var line_p0_p1 = parallel(p0, p1, stringerMoove1);
			var line_p0_p5 = parallel(p0, p5, 40);
			var line_p1_p2 = parallel(p1, p2, stringerMoove2);
			var line_p2_p3 = parallel(p2, p3, -40);
			var line_p3_p4 = parallel(p3, p5, 100);

			var pt0 = itercectionLines(line_p0_p1, line_p0_p5);
			var pt1 = itercectionLines(line_p0_p1, line_p1_p2);
			var pt2 = itercectionLines(line_p1_p2, line_p2_p3);
			var pt3 = itercectionLines(line_p3_p4, line_p2_p3);
			var pt4 = itercectionLines(line_p3_p4, line_p0_p5);

			par.pointsShapeFrame = [pt0, pt1, pt2, pt3, pt4];
		}
	}

	return par;

} 

/**Определение параметров забежных рамок*/
function calcConsoleFrameWndPar(par) {
	var turnParams = calcTurnParams(par.marshId)

	if (!par.wndPar) par.wndPar = treadsObj.wndPar;
	if (!par.wndPar2) par.wndPar2 = treadsObj.wndPar2;

	var wndPar = par.wndPar;
	if (par.wndPar2 && par.marshId !== 1) wndPar = par.wndPar2;

	var gap = 4; //расстояние между рамками (толщина вертикальной пластины между рамками)
	var offsetX = 20; //расстояние от передней грани ступени до рамки
	var offsetIn = 100; //расстояние от внутренней боковой грани ступени до рамки
	var stringerThickness = params.stringerThickness; //ширина тетивы
	var thk = 4; //толщина стенки тетивы
	var stringerMooveBot = calcStringerMoove(par.marshId).stringerOutMoove;
	var stringerMooveTop = calcStringerMoove(par.marshId).stringerOutMooveNext;

	var wndFrames = { '1': {}, '2': {}, '3': {}}


	var p0 = { x: 0, y: 0 }; //точка внешнего угла забега
	var pBotMarsh = newPoint_xy(p0, 0, -turnParams.turnLengthTop); //точка начала первой забежной ступени (внешняя сторона)
	var pTopMarsh = newPoint_xy(p0, turnParams.turnLengthBot, 0); //точка начала первой ступени верхнего марша (внешняя сторона)
	if (wndPar.plusMarshDist) pTopMarsh.x += params.marshDist - 45;

	var ptBot = newPoint_xy(p0, wndPar.params[1].treadWidth - offsetIn, 0);
	var ptTop = newPoint_xy(p0, 0, - wndPar.params[1].treadWidth + offsetIn);

	// определяем точки нижнего марша
	var pt1 = newPoint_xy(pBotMarsh, 0, wndPar.params[1].stepWidthHi);
	var pt2 = newPoint_xy(p0, 0, -wndPar.params[2].stepWidthY);
	var pcBot = newPoint_xy(pt2, 0, distance(pt1, pt2) / 2);

	var lineInStringerBot = parallel(p0, pBotMarsh, stringerMooveBot + thk);
	var lineOutStringerBot = parallel(p0, pBotMarsh, stringerMooveBot + stringerThickness);

	// определяем точки нижнего марша
	var pt1 = newPoint_xy(pTopMarsh, -wndPar.params[3].stepWidthHi + 50, 0);
	var pt2 = newPoint_xy(p0, wndPar.params[2].stepWidthX, 0);
	var pcTop = newPoint_xy(pt1, distance(pt1, pt2) / 2, 0);

	var lineInStringerTop = parallel(p0, pTopMarsh, stringerMooveTop + thk);
	var lineOutStringerTop = parallel(p0, pTopMarsh, stringerMooveTop + stringerThickness);


	// для первой забежной рамки----------------------------------------------
	var p1 = newPoint_xy(pBotMarsh, 0, offsetX);
	var p2 = newPoint_xy(pcBot, 0, -gap / 2);
	var p3 = itercection(p2, polar(p2, -wndPar.params[1].edgeAngle, 100), ptBot, polar(ptBot, Math.PI / 2, 100));
	var p4 = itercection(p1, polar(p1, 0, 100), ptBot, polar(ptBot, Math.PI / 2, 100));

	var p1In = itercection(p1, p4, lineInStringerBot.p1, lineInStringerBot.p2)
	var p2In = itercection(p2, p3, lineInStringerBot.p1, lineInStringerBot.p2)

	var p1Out = itercection(p1, p4, lineOutStringerBot.p1, lineOutStringerBot.p2)
	var p2Out = itercection(p2, p3, lineOutStringerBot.p1, lineOutStringerBot.p2)

	var points = [p1Out, p2Out, p3, p4];
	points = moovePoints(points, { x: -p1Out.x, y: -p1Out.y })
	
	wndFrames['1'].pointsFrame = points;
	wndFrames['1'].p1In = p1In;
	wndFrames['1'].p2In = p2In;
	wndFrames['1'].p1Out = p1Out;
	wndFrames['1'].p2Out = p2Out;

	// для второй забежной рамки----------------------------------
	var p1 = newPoint_xy(pcBot, 0, gap / 2);
	var p2 = newPoint_xy(p0, 0, -offsetX);
	var p3 = newPoint_xy(p0, offsetX, -offsetX);
	var p4 = newPoint_xy(p0, offsetX, 0);
	var p5 = newPoint_xy(pcTop, -gap / 2, 0);
	var p6 = itercection(p5, polar(p5, -Math.PI / 2 + wndPar.params[1].edgeAngle, 100), ptTop, polar(ptTop, 0, 100));
	var p7 = itercection(p1, polar(p1, -wndPar.params[1].edgeAngle, 100), ptBot, polar(ptBot, Math.PI / 2, 100));

	var p1In = itercection(p1, p7, lineInStringerBot.p1, lineInStringerBot.p2)
	var p2In = itercection(p2, p3, lineInStringerBot.p1, lineInStringerBot.p2)

	var p1Out = itercection(p1, p7, lineOutStringerBot.p1, lineOutStringerBot.p2)
	var p2Out = itercection(p2, p3, lineOutStringerBot.p1, lineOutStringerBot.p2)

	var p4In = itercection(p3, p4, lineInStringerTop.p1, lineInStringerTop.p2)
	var p5In = itercection(p5, p6, lineInStringerTop.p1, lineInStringerTop.p2)

	var p4Out = itercection(p3, p4, lineOutStringerTop.p1, lineOutStringerTop.p2)
	var p5Out = itercection(p5, p6, lineOutStringerTop.p1, lineOutStringerTop.p2)

	var points = [p1Out, p2Out, p3, p4Out, p5Out, p6, p7];
	points = moovePoints(points, { x: -p1Out.x, y: -p1Out.y })

	wndFrames['2'].pointsFrame = points;
	wndFrames['2'].p1In = p1In;
	wndFrames['2'].p2In = p2In;
	wndFrames['2'].p4In = p4In;
	wndFrames['2'].p5In = p5In;
	wndFrames['2'].p1Out = p1Out;
	wndFrames['2'].p2Out = p2Out;
	wndFrames['2'].p4Out = p4Out;
	wndFrames['2'].p5Out = p5Out;


	// для трерьей забежной рамки------------------------------------------------
	var p1 = newPoint_xy(pcTop, gap / 2, 0);
	var p2 = newPoint_xy(pTopMarsh, offsetX - gap, 0);
	var p3 = itercection(p2, polar(p2, Math.PI / 2, 100), ptTop, polar(ptTop, 0, 100));
	var p4 = itercection(p1, polar(p1, -Math.PI / 2 + wndPar.params[1].edgeAngle, 100), ptTop, polar(ptTop, 0, 100));
	

	var p1In = itercection(p1, p4, lineInStringerTop.p1, lineInStringerTop.p2)
	var p2In = itercection(p2, p3, lineInStringerTop.p1, lineInStringerTop.p2)

	var p1Out = itercection(p1, p4, lineOutStringerTop.p1, lineOutStringerTop.p2)
	var p2Out = itercection(p2, p3, lineOutStringerTop.p1, lineOutStringerTop.p2)

	var points = [p1Out, p2Out, p3, p4];
	points = moovePoints(points, { x: -p1Out.x, y: -p1Out.y })

	wndFrames['3'].pointsFrame = points;
	wndFrames['3'].p1In = p1In;
	wndFrames['3'].p2In = p2In;
	wndFrames['3'].p1Out = p1Out;
	wndFrames['3'].p2Out = p2Out;

	par.wndFrames = wndFrames;

	return par;
}




/**отрисовывает ребра тетивы*/
function drawStringerConsoleEdges(par) {
	var marshPar = getMarshParams(par.marshId);
	var turnParams = calcTurnParams(par.marshId)

	par.mesh = new THREE.Object3D();

	var edgePar = {
		marshId: par.marshId,
		dxfBasePoint: copyPoint(par.dxfBasePoint),
		type: 'marsh',
		points: par.pointsIn,
		pc: { x: 0, y: 0 },
		thk: par.thk,
		width: par.width,
	}

	calcConsoleFramePar(edgePar)

	for (var i = 0; i < marshPar.stairAmt; i++) {
		edgePar.pDivide = false;
		var dx = marshPar.b * i + marshPar.a / 2 + 5;

		edgePar.pc.x = dx - edgePar.widthBox / 2;
		par.mesh.add(drawConsoleEdge(edgePar).mesh)

		//-----------------
		if (i == marshPar.stairAmt - 1) {
			edgePar.pc.x = dx + edgePar.widthBox / 2 + par.thk;
			par.mesh.add(drawConsoleEdge(edgePar).mesh)
		}

		//-------------
		var offset = edgePar.widthBox / 3
		edgePar.pDivide = { x: 0, y: marshPar.h * (i + 1) - params.treadThickness / 2};
		edgePar.pc.x = dx - edgePar.widthBox / 2 + offset;
		par.mesh.add(drawConsoleEdge(edgePar).mesh)

		//---------
		edgePar.pc.x = dx + edgePar.widthBox / 2 - offset + par.thk;
		par.mesh.add(drawConsoleEdge(edgePar).mesh)
	}

	if (marshPar.topTurn == 'площадка' || (params.stairModel == "П-образная с площадкой" && marshPar.botTurn == 'площадка')) {
		edgePar.type = 'platformTop';
		if (params.stairModel == "П-образная с площадкой" && par.marshId == 1) edgePar.type = 'platformTopP';
		if (params.stairModel == "П-образная с площадкой" && marshPar.botTurn == 'площадка') edgePar.type = 'platformBotP';

		calcConsoleFramePar(edgePar);

		for (var i = 0; i < 2; i++) {

			edgePar.pDivide = false;
			var dx = marshPar.b * marshPar.stairAmt + edgePar.widthTread * i + edgePar.widthTread / 2 + 5;
			if (edgePar.type == 'platformBotP') dx = - edgePar.widthTread * i - edgePar.widthTread / 2 + 5 + turnParams.topStepDelta;

			edgePar.pc.x = dx - edgePar.widthBox / 2;
			par.mesh.add(drawConsoleEdge(edgePar).mesh)

			//-----------------
			edgePar.pc.x = dx + edgePar.widthBox / 2 + par.thk;
			par.mesh.add(drawConsoleEdge(edgePar).mesh)

			//-------------
			var offset = edgePar.widthBox / 3

			edgePar.pDivide = { x: 0, y: marshPar.h * (marshPar.stairAmt + 1) - params.treadThickness / 2 };
			if (edgePar.type == 'platformBotP') edgePar.pDivide = { x: 0, y: - params.treadThickness / 2 };

			edgePar.pc.x = dx - edgePar.widthBox / 2 + offset;
			par.mesh.add(drawConsoleEdge(edgePar).mesh)

			//---------
			edgePar.pc.x = dx + edgePar.widthBox / 2 - offset + par.thk;
			par.mesh.add(drawConsoleEdge(edgePar).mesh)
		}
	}

	

	if (marshPar.topTurn == 'забег') {

		calcConsoleFrameWndPar(edgePar);
		calcConsoleFramePar(edgePar);

		//flanPar.dxfBasePoint = newPoint_xy(flanPar.dxfBasePoint, 0, flanPar.widthTread + 50);
		edgePar.pDivide = false;
		var dx = marshPar.b * marshPar.stairAmt + turnParams.turnLengthTop + 5;
		if (marshPar.botTurn == 'забег' && marshPar.stairAmt == 0) dx += params.marshDist - 45

		//ребра первой забежной рамки------------------------------
		//ребро между первой и второй рамкой
		edgePar.pc.x = dx + edgePar.wndFrames['1'].p2Out.y;
		edgePar.angRotate = treadsObj.wndPar.params[1].edgeAngle * turnFactor;
		var edge = drawConsoleEdge(edgePar).mesh;
		par.mesh.add(edge)

		edgePar.angRotate = false;

		//ребро между первой и третьей (нижнего забега) рамкой
		if (marshPar.botTurn == 'забег' && marshPar.stairAmt == 0) {
			edgePar.pc.x = dx + edgePar.wndFrames['1'].p1Out.y;
			par.mesh.add(drawConsoleEdge(edgePar).mesh)
		}

		//опорные пластины первой ступени 
		var dist = distance(edgePar.wndFrames['1'].p1Out, edgePar.wndFrames['1'].p2Out)
		var offset = dist / 3
		edgePar.pDivide = { x: 0, y: marshPar.h * (marshPar.stairAmt + 1) - params.treadThickness / 2 };
		edgePar.pc.x = dx + edgePar.wndFrames['1'].p2Out.y - offset;
		par.mesh.add(drawConsoleEdge(edgePar).mesh)

		edgePar.pc.x = dx + edgePar.wndFrames['1'].p1Out.y + offset;
		par.mesh.add(drawConsoleEdge(edgePar).mesh)

		edgePar.pDivide = false;


		//ребра второй забежной рамки------------------------------
		edgePar.pc.x = dx + edgePar.wndFrames['2'].p2Out.y + par.thk;
		par.mesh.add(drawConsoleEdge(edgePar).mesh)

		//опорные пластины второй ступени 
		var dist = distance(edgePar.wndFrames['2'].p1Out, edgePar.wndFrames['2'].p2Out)
		var offset = dist / 3
		edgePar.pDivide = { x: 0, y: marshPar.h * (marshPar.stairAmt + 2) - params.treadThickness / 2 };
		edgePar.pc.x = dx + edgePar.wndFrames['2'].p2Out.y - offset;
		par.mesh.add(drawConsoleEdge(edgePar).mesh)

		edgePar.pc.x = dx + edgePar.wndFrames['2'].p1Out.y + offset;
		par.mesh.add(drawConsoleEdge(edgePar).mesh)

		edgePar.pDivide = false;

	}

	if (marshPar.botTurn == 'забег') {

		edgePar.marshId = marshPar.prevMarshId;
		if (params.stairModel == "П-образная с забегом" && par.marshId == 3) edgePar.marshId = 2;
		calcConsoleFrameWndPar(edgePar);
		calcConsoleFramePar(edgePar);

		//flanPar.dxfBasePoint = newPoint_xy(flanPar.dxfBasePoint, 0, flanPar.widthTread + 50);
		edgePar.pDivide = false;
		var dx = - turnParams.turnLengthBot + 5;

		//ребра третьей забежной рамки------------------------------
		//ребро между третьей и второй рамкой
		edgePar.pc.x = dx + edgePar.wndFrames['3'].p1Out.x + par.thk;
		edgePar.angRotate = -treadsObj.wndPar.params[3].edgeAngle * turnFactor;
		var edge = drawConsoleEdge(edgePar).mesh;
		par.mesh.add(edge)

		edgePar.angRotate = false;


		//опорные пластины третьей ступени
		var dist = distance(edgePar.wndFrames['3'].p1Out, edgePar.wndFrames['3'].p2Out)
		var offset = dist / 3
		edgePar.pDivide = { x: 0, y:  - params.treadThickness / 2 };
		edgePar.pc.x = dx + edgePar.wndFrames['3'].p2Out.x - offset;
		par.mesh.add(drawConsoleEdge(edgePar).mesh)

		edgePar.pc.x = dx + edgePar.wndFrames['3'].p1Out.x + offset;
		par.mesh.add(drawConsoleEdge(edgePar).mesh)

		edgePar.pDivide = false;


		//ребра второй забежной рамки------------------------------
		edgePar.pc.x = dx + edgePar.wndFrames['2'].p4Out.x + par.thk;
		par.mesh.add(drawConsoleEdge(edgePar).mesh)

		//опорные пластины второй ступени 
		var dist = distance(edgePar.wndFrames['2'].p4Out, edgePar.wndFrames['2'].p5Out)
		var offset = dist / 3
		edgePar.pDivide = { x: 0, y: - marshPar.h  - params.treadThickness / 2 };
		edgePar.pc.x = dx + edgePar.wndFrames['2'].p5Out.x - offset;
		par.mesh.add(drawConsoleEdge(edgePar).mesh)

		edgePar.pc.x = dx + edgePar.wndFrames['2'].p4Out.x + offset;
		par.mesh.add(drawConsoleEdge(edgePar).mesh)

		edgePar.pDivide = false;

	}

	return par;
}

/**Отрисовывает ребро тетивы*/
function drawConsoleEdge(par) {
	var thk = par.thk;

	par.mesh = new THREE.Object3D();

	var meshPar = {
		points: [],
		thk: thk,
		material: params.materials.metal,
		isObject3D: true,
	}

	var lines = [];

	for (var i = 0; i < par.points.length; i++) {
		var p1 = par.points[i];
		var p2 = i == par.points.length - 1 ? par.points[0] :  par.points[i + 1];

		if (p1.x > par.pc.x && p2.x < par.pc.x) {
			lines.push({p1: p1, p2: p2})
		}
		if (p2.x > par.pc.x && p1.x < par.pc.x) {
			lines.push({ p1: p1, p2: p2 })
		}
	}

	if (lines.length > 1) {
		var line = { p1: par.pc, p2: polar(par.pc, Math.PI / 2, 100) }

		var pk1 = itercectionLines(line, lines[0]);
		var pk2 = itercectionLines(line, lines[1]);

		var lines = (pk1.y < pk2.y) ? [lines[0], lines[1]] : [lines[1], lines[0]]

		var p0 = { x: 0, y: 0 };

		var pt1 = itercectionLines(line, lines[0]);
		var pt2 = itercectionLines(line, lines[1]);

		par.pc = pt1;

		//ребро между тетивами
		if (!par.pDivide) {
			var width = par.width;
			var p1 = copyPoint(p0);
			var p2 = newPoint_xy(p1, 0, distance(pt1, pt2) - thk * Math.tan(calcAngleX1(lines[1].p1, lines[1].p2)));
			if (par.angRotate) {
				width = par.width / Math.cos(par.angRotate)
				p2.y -= par.width * Math.tan(Math.abs(par.angRotate)) * Math.tan(calcAngleX1(lines[1].p1, lines[1].p2))
			}
			var p3 = newPoint_xy(p2, width, 0);
			var p4 = newPoint_xy(p1, width, 0);

			meshPar.points = [p1, p2, p3, p4];

			var edge = drawMesh(meshPar).mesh;
			edge.rotation.y = -Math.PI / 2;
			edge.position.x = pt1.x;
			edge.position.y = pt1.y;

			if (par.angRotate) {
				edge.rotation.y -= par.angRotate;
				edge.position.x += par.thk * Math.cos(par.angRotate);
				if (par.angRotate < 0)
					edge.position.y += par.width *
						Math.tan(Math.abs(par.angRotate)) *
						Math.tan(calcAngleX1(lines[1].p1, lines[1].p2));
			}

			par.mesh.add(edge);
		}

		//опорные пластины ступеней
		if (par.pDivide) {
			var pt = newPoint_xy(par.pDivide, 0, -par.heightBox / 2);
			var pt = itercection(pt, polar(pt, 0, 100), line.p1, line.p2);

			var p1 = copyPoint(p0);
			var p2 = newPoint_xy(p1, 0, distance(pt1, pt));
			var p3 = newPoint_xy(p2, par.width, 0);
			var p4 = newPoint_xy(p1, par.width, 0);

			meshPar.points = [p1, p2, p3, p4];

			var edge = drawMesh(meshPar).mesh;
			edge.rotation.y = -Math.PI / 2;
			edge.position.x = pt1.x;
			edge.position.y = pt1.y;
			par.mesh.add(edge);

			//-------------
			var pt = newPoint_xy(par.pDivide, 0, par.heightBox / 2);
			var pt = itercection(pt, polar(pt, 0, 100), line.p1, line.p2);

			var p1 = newPoint_xy(p0, 0, distance(pt1, pt));
			var p2 = newPoint_xy(p0, 0, distance(pt1, pt2) - thk * Math.tan(calcAngleX1(lines[1].p1, lines[1].p2)));
			var p3 = newPoint_xy(p2, par.width, 0);
			var p4 = newPoint_xy(p1, par.width, 0);

			meshPar.points = [p1, p2, p3, p4];

			var edge = drawMesh(meshPar).mesh;
			edge.rotation.y = -Math.PI / 2;
			edge.position.x = pt1.x;
			edge.position.y = pt1.y;
			par.mesh.add(edge);
		}
	}

	return par;
}



/**Определение параметров ступеней*/
function calcConsoleTreadPar(par) {

	var marshPar = getMarshParams(par.marshId);
	var turnParams = calcTurnParams(par.marshId);
	var wndPar = treadsObj.wndPar;

	par.widthTread = 0;

	if (par.type == 'marsh') {
		par.widthTread = marshPar.a;
	}

	if (par.type == 'platformTop' || par.type == 'platformTopP') {
		par.widthTread = (turnParams.turnLengthTop) / 2;
		if (par.type == 'platformTopP')
			par.widthTread = (turnParams.turnLengthTop - (turnParams.pltExtraLen - turnParams.topStepDelta)) / 2;
	}

	if (par.type == 'platformBot' || par.type == 'platformBotP') {
		par.widthTread = (turnParams.turnLengthBot + calcStringerMoove(par.marshId).stringerOutMooveNext) / 2;
		if (par.type == 'platformBotP')
			par.widthTread = (turnParams.turnLengthBot - (turnParams.pltExtraLen - turnParams.topStepDelta)) / 2;
	}

	if (par.type == 'winder1') {
		if (treadsObj.wndPar2 && par.marshId !== 1) wndPar = treadsObj.wndPar2;
		par.widthTread = wndPar.params[1].stepWidthHi;
	}
	if (par.type == 'winder3') {
		if (treadsObj.wndPar2 && par.marshId == 3) wndPar = treadsObj.wndPar2;
		par.widthTread = wndPar.params[3].stepWidthHi;
	}
	if (par.type == 'winder2') {
		if (treadsObj.wndPar2 && par.marshId !== 1) wndPar = treadsObj.wndPar2;
		par.widthTread = wndPar.params[2].stepWidthY + calcStringerMoove(par.marshId).stringerOutMooveNext;
	}
	if (par.type == 'winder21') {
		if (treadsObj.wndPar2 && par.marshId == 3) wndPar = treadsObj.wndPar2;
		par.widthTread = wndPar.params[2].stepWidthX + calcStringerMoove(par.marshId).stringerOutMoovePrev;
	}

	return par;
}
