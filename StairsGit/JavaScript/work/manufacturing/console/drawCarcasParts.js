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

	for (var i = 0; i < marshPar.stairAmt; i++) {
		flanPar.dxfBasePoint = newPoint_xy(flanPar.dxfBasePoint, 0, flanPar.widthTread + 50);
		var flan = drawStringerConsoleFlan(flanPar);
		flan.position.x = marshPar.b * i + flanPar.shiftFlanX;
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
			flan.position.x = marshPar.b * marshPar.stairAmt + flanPar.shiftFlanX + flanPar.widthTread * i;
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
				flan.position.x = params.nose - flanPar.shiftFlanX - flanPar.widthFlan - flanPar.widthTread * i;
				flan.position.y = flanPar.shiftFlanY;
				par.mesh.add(flan);
			}
		}
		//flanPar.type = 'platformBot';
		//calcStringerConsoleFlanPar(flanPar);
		//for (var i = 0; i < 2; i++) {
		//	var flan = drawStringerConsoleFlan(flanPar);
		//	flan.position.x =  - flanPar.shiftFlanX - flanPar.widthTread * i;
		//	flan.position.y =  flanPar.shiftFlanY;
		//	par.mesh.add(flan);
		//}
	}

	if (marshPar.topTurn == 'забег') {
		var wndPar = par.wndPar;		
		if (par.wndPar2 && par.marshId !== 1) wndPar = par.wndPar2;

		var marshDist = 0;
		if (par.wndPar2 && par.marshId !== 1) marshDist = params.marshDist - 35;

		var posX = marshPar.b * marshPar.stairAmt + flanPar.shiftFlanX + marshDist;
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
		flan.position.x = flanPar.shiftFlanX - flanPar.widthFlan;
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

	if (typeof anglesHasBolts != "undefined" && anglesHasBolts) { //глобальная переменная
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

	//сохраняем данные для спецификации
	var partName = "treadFrame";
	if(par.type == "winder1") partName = "wndFrame1";
	if(par.type == "winder2") partName = "wndFrame2";
	if(par.type == "winder3") partName = "wndFrame3";
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
			if(par.type == "winder1") specObj[partName].name = "Рама забежной ступени 1";
			if(par.type == "winder2") specObj[partName].name = "Рама забежной ступени 2";
			if(par.type == "winder3") specObj[partName].name = "Рама забежной ступени 3";
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

	//создаем короб------------------------------------------------------------
	var thk = 4;
	if (!(~par.type.indexOf("winder") || par.type == 'platformBotP')) {
		var heightBox = params.treadThickness - 20;
		var widthBox = par.widthFlan - 20 * 2;
		var lenghtBox = params.M + calcStringerMoove(par.marshId).stringerOutMoove - 20;
		if (par.type == 'platformTopP')
			lenghtBox = params.M * 2 + params.marshDist + calcStringerMoove(par.marshId).stringerOutMoove + calcStringerMoove(3).stringerOutMoove;

		var box = new THREE.Object3D();

		var boxExtrudeOptions = {
			amount: thk,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};

		var p0 = { x: 0, y: 0 };

		//верхняя пластина
		var p1 = copyPoint(p0);
		var p2 = newPoint_xy(p1, 0, widthBox);
		var p3 = newPoint_xy(p2, lenghtBox, 0);
		var p4 = newPoint_xy(p1, lenghtBox, 0);

		//создаем шейп
		var shapePar = {
			points: [p1, p4, p3, p2],
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, par.widthFlan + 500, -par.heigthFlan),
		}
		var boxShape = drawShapeByPoints2(shapePar).shape;		

		var geom = new THREE.ExtrudeGeometry(boxShape, boxExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var topPlate = new THREE.Mesh(geom, params.materials.metal);
		topPlate.position.y = -par.heigthFlan / 2 + heightBox / 2;
		topPlate.rotation.x = Math.PI / 2;
		box.add(topPlate);

		//нижняя пластина
		//создаем шейп
		var shapePar = {
			points: [p1, p4, p3, p2],
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: newPoint_xy(shapePar.dxfBasePoint, lenghtBox + 50, 0),
		}
		var boxShape = drawShapeByPoints2(shapePar).shape;

		var botPlate = new THREE.Mesh(geom, params.materials.metal);
		botPlate.position.y = -par.heigthFlan / 2 - heightBox / 2 + thk;
		botPlate.rotation.x = Math.PI / 2;
		box.add(botPlate);

		//передняя пластина
		var p1 = copyPoint(p0);
		var p2 = newPoint_xy(p1, 0, heightBox - thk * 2);
		var p3 = newPoint_xy(p2, lenghtBox, 0);
		var p4 = newPoint_xy(p1, lenghtBox, 0);

		//создаем шейп
		var shapePar = {
			points: [p1, p4, p3, p2],
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: newPoint_xy(shapePar.dxfBasePoint, lenghtBox + 50, 0),
		}
		var boxShape = drawShapeByPoints2(shapePar).shape;

		var geom = new THREE.ExtrudeGeometry(boxShape, boxExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var frontPlate = new THREE.Mesh(geom, params.materials.metal);
		frontPlate.position.y = -par.heigthFlan / 2 - heightBox / 2 + thk;
		box.add(frontPlate);

		//задняя пластина
		//создаем шейп
		var shapePar = {
			points: [p1, p4, p3, p2],
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: newPoint_xy(shapePar.dxfBasePoint, lenghtBox + 50, 0),
		}
		var boxShape = drawShapeByPoints2(shapePar).shape;
		var backPlate = new THREE.Mesh(geom, params.materials.metal);
		backPlate.position.z = widthBox - thk;
		backPlate.position.y = -par.heigthFlan / 2 - heightBox / 2 + thk;
		box.add(backPlate);
		
		box.position.x = par.widthFlan / 2 + widthBox / 2;
		box.position.z = 8;
		if (turnFactor == - 1) box.position.z = -lenghtBox;
		if (params.stairModel == "Прямая") {
			box.position.z = -lenghtBox;
			if (turnFactor == - 1) box.position.z = 8;
		}
		box.rotation.y = -Math.PI / 2;

		mesh.add(box);
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
	return mesh;

} //end of drawStringerConsoleFlan

/**Определение параметров фланцев и отверстий в фланце и крепления тетивы к стене*/
function calcStringerConsoleFlanPar(par) {

	var offsetHoleX = 20;
	var offsetHoleY = 20;

	par.holesFlan = [];
	par.holesFlanAndStringer = [];
	par.widthFlan = 0;
	par.heigthFlan = params.treadThickness + offsetHoleY * 4;
	//par.heigthFlan = 60 + offsetHoleY * 4;
	par.widthTread = 0;
	par.shiftFlanX = params.nose;
	par.shiftFlanY = offsetHoleY * 2;

	var wndPar = par.wndPar;

	var marshPar = getMarshParams(par.marshId);

	if (par.type == 'marsh') {
		par.widthTread = marshPar.a;
		par.widthFlan = par.widthTread - par.shiftFlanX * 2;
	}
	if (par.type == 'platformTop' || par.type == 'platformTopP') {
		var turnParams = calcTurnParams(par.marshId)
		par.widthTread = (turnParams.turnLengthTop) / 2; 
		if (par.type == 'platformTopP')
			par.widthTread = (turnParams.turnLengthTop - (turnParams.pltExtraLen - params.nose) + calcStringerMoove(2).stringerOutMoove) / 2; 
		par.widthFlan = par.widthTread - par.shiftFlanX * 2; 
	}
	if (par.type == 'platformBot' || par.type == 'platformBotP') {
		var turnParams = calcTurnParams(par.marshId)
		par.widthTread = (turnParams.turnLengthBot + calcStringerMoove(par.marshId).stringerOutMooveNext) / 2;
		if (par.type == 'platformBotP')
			par.widthTread = (turnParams.turnLengthBot - (turnParams.pltExtraLen - params.nose) + calcStringerMoove(2).stringerOutMoove) / 2;

		par.widthFlan = par.widthTread - par.shiftFlanX * 2;
	}
	if (par.type == 'winder1') {
		if (par.wndPar2 && par.marshId !== 1) wndPar = par.wndPar2;
		par.widthTread = wndPar.params[1].stepWidthHi;
		par.widthFlan = par.widthTread - par.shiftFlanX * 2;
	}
	if (par.type == 'winder3') {
		if (par.wndPar2 && par.marshId == 3) wndPar = par.wndPar2;
		par.widthTread = wndPar.params[3].stepWidthHi;
		par.widthFlan = par.widthTread - par.shiftFlanX * 2;
	}
	if (par.type == 'winder2') {
		if (par.wndPar2 && par.marshId !== 1) wndPar = par.wndPar2;
		par.widthTread = wndPar.params[2].stepWidthY + calcStringerMoove(par.marshId).stringerOutMooveNext;
		par.widthFlan = par.widthTread - par.shiftFlanX;
	}
	if (par.type == 'winder21') {
		if (par.wndPar2 && par.marshId == 3) wndPar = par.wndPar2;
		par.widthTread = wndPar.params[2].stepWidthX + calcStringerMoove(par.marshId).stringerOutMoovePrev;
		par.widthFlan = par.widthTread - par.shiftFlanX;
	}

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

} //end of calcHolesStringerConsoleFlan

function itercectionLines(line1, line2) {
	return itercection(line1.p1, line1.p2, line2.p1, line2.p2);
}