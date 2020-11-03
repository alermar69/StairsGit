var pointCurrentSvgTmp = {};
var pointStartSvgTmp = {};

/** функция отрисовывает косоур вметсе со всеми пластинами и подложками
*/

function drawComplexStringer(par) {
	par.mesh1 = new THREE.Object3D();
	par.mesh2 = new THREE.Object3D();
	par.flans = new THREE.Object3D();
	par.treadPlates = new THREE.Object3D();

	var marshParams = getMarshParams(par.marshId);
	var turnPar = calcTurnParams(par.marshId); //расчитуем параметры поворота

	if (params.model == "труба") params.stringerThickness = params.profileWidth + params.metalThickness * 2;
	
	//именованные ключевые точки
	if (!par.keyPoints) par.keyPoints = {};
	if (!par.keyPoints[par.key]) par.keyPoints[par.key] = {};
	par.keyPoints[par.key].zeroPoint = { x: 0, y: 0 };
	par.zeroPoint = { x: 0, y: 0 };

	//рассчитываем параметры косоура по номеру марша
	calcStringerPar(par);

	var dxfBasePoint0 = copyPoint(par.dxfBasePoint);
	params.carcasConfig = $("#carcasConfig").val();
	
	//боковые накладки косоура

	var extrudeOptions = {
		amount: params.metalThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	


	//первая накладка
	
	par.key = "in";
	if (turnFactor == -1) par.key = "out";
	par = drawStringerMk(par);
	if (par.pDivideBot) {
		var sidePlate1 = new THREE.Object3D();

		var geom = new THREE.ExtrudeGeometry(par.stringerShapeBot, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var botPlate = new THREE.Mesh(geom, params.materials.metal);
		sidePlate1.add(botPlate);

		var geom = new THREE.ExtrudeGeometry(par.stringerShapeTop, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var topPlate = new THREE.Mesh(geom, params.materials.metal);
		sidePlate1.add(topPlate);

		if (par.key == "out") var pointsShape = par.pointsShape;
	}
	else {
		var geom = new THREE.ExtrudeGeometry(par.stringerShape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var sidePlate1 = new THREE.Mesh(geom, params.materials.metal);
		if (par.key == "out") var pointsShape = par.pointsShape;
	}

	var dxfBasePoint1 = copyPoint(par.dxfBasePoint);

	var parStringer = par;


	
	
	//вторая накладка
	
	par.key = "out";
	if (turnFactor == -1) par.key = "in";
	par = drawStringerMk(par);
	if (par.pDivideBot) {
		var sidePlate2 = new THREE.Object3D();

		var geom = new THREE.ExtrudeGeometry(par.stringerShapeBot, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var botPlate = new THREE.Mesh(geom, params.materials.metal);
		sidePlate2.add(botPlate);

		var geom = new THREE.ExtrudeGeometry(par.stringerShapeTop, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var topPlate = new THREE.Mesh(geom, params.materials.metal);
		sidePlate2.add(topPlate);

		if (par.key == "out") var pointsShape = par.pointsShape;
	}
	else {
		var geom = new THREE.ExtrudeGeometry(par.stringerShape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var sidePlate2 = new THREE.Mesh(geom, params.materials.metal);
		if (par.key == "out") var pointsShape = par.pointsShape;
	}	
	

	sidePlate1.position.x = sidePlate2.position.x = par.a - par.b;
	sidePlate1.position.y = sidePlate2.position.y = 0;

	var dxfBasePoint2 = copyPoint(par.dxfBasePoint);
	
	par.dxfBasePoint = copyPoint(dxfBasePoint1);

	//если последняя ступень - забежная
	if (par.botEnd === "забег" && par.topEnd == "пол" && par.stairAmt == 1) {
		if (params.model == "труба") {
			sidePlate1.position.x = sidePlate2.position.x = 100 - params.lastWinderTreadWidth;
		}
	}

	if (params.botFloorType == "черновой" && par.marshId == 1) {
		sidePlate1.position.y -= params.botFloorsDist;
		sidePlate2.position.y -= params.botFloorsDist;
	}

	var columnHoles = {};// Переменная в которую запишутся положения отверстий столбов
	sidePlate1.position.z = params.stringerThickness / 2 - params.metalThickness;
	sidePlate2.position.z = -params.stringerThickness / 2;

	par.mesh1.add(sidePlate1);
	par.mesh1.add(sidePlate2);

    par.pointsShape = pointsShape;
	

	//отрисовка профильной трубы
	if (params.model == "труба") {
		var botEndAng = 0;
		var sidePlateOverlayPlatform = 7 + (params.sidePlateOverlay - 7);
		var offset = params.flanThickness - 3;
		var stringerPoints = [];

		if (par.botEnd == "пол") {
			var pt1 = par.pointsShape[0];
			var pt2 = par.pointsShape[par.pointsShape.length - 1];
			var ang = calcAngleX1(pt1, pt2);

			var line = parallel(pt1, pt2, params.sidePlateOverlay);
			var pv1 = newPoint_xy(pt1, 0, - offset);
			var pv2 = itercection(pv1, polar(pv1, 0, 100), line.p1, line.p2);

			var line_1_2 = parallel(par.pointsShape[par.pointsShape.length - 1], par.pointsShape[par.pointsShape.length - 2], - params.profileHeight + params.sidePlateOverlay);
			pt1 = newPoint_xy(pv2, params.profileHeight / Math.sin(ang), 0);

			//при большой разнице чистового и чернового пола
			if (par.isBotFloorsDist) {
				var line1 = parallel(line.p1, line.p2, - params.profileHeight);
				var pt0 = newPoint_xy(par.pointsShape[1], -params.sidePlateOverlay, - offset);
				pt = newPoint_xy(pt0, params.profileHeight, 0);
				pt1 = itercection(pt, polar(pt, Math.PI / 2, 100), line1.p1, line1.p2);
				if (pt1.y < pt.y) {
					pt1 = itercection(pt, polar(pt, 0, 100), line1.p1, line1.p2);
					pt = copyPoint(pt0)
					botEndAng = Math.PI / 2;
					par.isBotPipeHor = true;
				}
				pt.x -= 0.01;
				stringerPoints.push(pt);
			}
		}
		if (par.botEnd == "площадка") {
			var pt1 = par.pointsShape[0];
			var pt2 = par.pointsShape[par.pointsShape.length - 1];
			var pt0 = par.pointsShape[1];
			pt0 = newPoint_xy(pt0, - offset, - params.profileHeight + sidePlateOverlayPlatform);

			var line = parallel(pt1, pt2, params.sidePlateOverlay - params.profileHeight);
			pt1 = itercection(pt0, polar(pt0, 0, 100), line.p1, line.p2);

			botEndAng = Math.PI / 2;
			stringerPoints.push(pt0);
		}
		//if (par.botEnd == "забег" && par.stairAmt > 1) {
		if (par.botEnd == "забег" && par.isKinkBot) {
			var pt1 = par.pointsShape[0];
			var pt2 = par.pointsShape[par.pointsShape.length - 1];

			var pt0 = par.pointsShape[2];
			var pt01 = par.pointsShape[1];
			pt0 = newPoint_xy(pt0, - offset, - params.profileHeight + params.sidePlateOverlay);

			var line = parallel(pt01, pt1, params.sidePlateOverlay - params.profileHeight);
			var line1 = parallel(pt1, pt2, params.sidePlateOverlay - params.profileHeight);
			pt1 = itercection(line.p1, line.p2, line1.p1, line1.p2);
			pt01 = itercection(pt0, polar(pt0, 0, 100), line.p1, line.p2);

			botEndAng = Math.PI / 2;
			stringerPoints.push(pt0);
			stringerPoints.push(pt01);
		}
		//if (par.botEnd == "забег" && par.stairAmt <= 1) {
		if (par.botEnd == "забег" && !par.isKinkBot) {
			var pt1 = par.pointsShape[0];
			var pt2 = par.pointsShape[par.pointsShape.length - 1];

			var pt0 = par.pointsShape[1];
			pt0 = newPoint_xy(pt0, - offset, - params.profileHeight + params.sidePlateOverlay);

			var line = parallel(pt1, pt2, params.sidePlateOverlay - params.profileHeight);
			pt1 = itercection(pt0, polar(pt0, 0, 100), line.p1, line.p2);

			botEndAng = Math.PI / 2;
			stringerPoints.push(pt0);
		}

		if (par.topEnd == "пол") {
			pt2 = newPoint_xy(pt2, offset, 0);
			pt2 = itercection(pt1, polar(pt1, par.marshAngle, 100), pt2, polar(pt2, Math.PI / 2, 100));
		}
		if (par.topEnd == "площадка") {
			var pt3 = par.pointsShape[par.pointsShape.length - 2];
			pt3 = newPoint_xy(pt3, offset, - params.profileHeight + sidePlateOverlayPlatform);
			pt2 = itercection(pt1, polar(pt1, par.marshAngle, 100), pt3, polar(pt3, 0, 100));
		}
		//if (par.topEnd == "забег" && !(par.stairAmt <= 2 && par.botEnd == "пол")) {
		if (par.topEnd == "забег" && par.isKinkTop) {
			var pt3 = par.pointsShape[par.pointsShape.length - 2];
			var pt4 = par.pointsShape[par.pointsShape.length - 3];
			pt4 = newPoint_xy(pt4, offset, - params.profileHeight + params.sidePlateOverlay);
			if (!par.topConnection) pt4.x -= 5 + params.metalThickness;

			var line_1_2 = parallel(par.pointsShape[0], pt2, - params.profileHeight + params.sidePlateOverlay);
			var line_2_3 = parallel(pt2, pt3, - params.profileHeight + params.sidePlateOverlay);
			pt2 = itercection(line_1_2.p1, line_1_2.p2, line_2_3.p1, line_2_3.p2);
			var pt3 = itercection(line_2_3.p1, line_2_3.p2, pt4, polar(pt4, 0, 100));
		}
		//if (par.topEnd == "забег" && (par.stairAmt <= 2 && par.botEnd == "пол")) {
		if (par.topEnd == "забег" && !par.isKinkTop) {
			//var ang = Math.atan(par.h / (par.pointsShape[3].x - par.pointsShape[2].x));
			var ang = calcAngleX1(par.pointsShape[0], par.pointsShape[par.pointsShape.length - 1]);
			var pt3 = par.pointsShape[par.pointsShape.length - 2];
			pt3 = newPoint_xy(pt3, offset, - params.profileHeight + params.sidePlateOverlay);
			pt2 = itercection(pt1, polar(pt1, ang, 100), pt3, polar(pt3, 0, 100));
			if (!par.topConnection) pt3.x -= 5 + params.metalThickness;
		}




		stringerPoints.push(pt1, pt2);
		if (pt3) stringerPoints.push(pt3);
		if (pt4) stringerPoints.push(pt4);

		var polePar = {
			points: stringerPoints,
			offset: 0, //-params.sidePlateOverlay,
			botEndAng: botEndAng,
			topEndAng: Math.PI / 2,
			profSizeY: params.profileHeight,
			profSizeZ: params.profileWidth,
			dxfBasePoint: par.dxfBasePoint,
			roundHoles: [],
		}
		
		//круглые отверстия в трубе насквозь для крепления нижнего марша
		if (par.botEnd == "площадка" && par.botConnection){
			var flanParams = getFlanParams('flan_pipe_bot');
			var holeDist = flanParams.holesDist; //Расстояние между отверстиями
            var pltLength = params.M;		    
			if (params.stairModel == 'П-образная с площадкой') {
				pltLength = params.platformLength_1 + 50;//Подогнано, пока разбираюсь что за отступ
			}
			var hole1 = {
				x: -pltLength / 2 - holeDist / 2,
				y: -params.treadThickness - (flanParams.height - flanParams.holeY), //140 - расстояние от вершины фланца до середины нижнего отверстия
			}
		    if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && par.stairAmt == 1) {
		        hole1.x -= params.marshDist + 5;
		    }
			var hole2 = newPoint_xy(hole1, holeDist, 0);

			hole1.diam = hole2.diam = 18;
			polePar.roundHoles.push(hole1, hole2)
		}
		//круглые отверстия в трубе насквозь для крепления верхнего марша
		if (par.topEnd == "площадка" && par.topConnection){
			var flanParams = getFlanParams('flan_pipe_bot');
			var holeDist = flanParams.holesDist; //Расстояние между отверстиями
			var pltLength = params.M;
			if (params.stairModel == 'П-образная с площадкой') {
				pltLength = params.platformLength_1 + 54;//Подогнано, пока разбираюсь что за отступ
			}
			var stairAmt = par.stairAmt;
			if (par.botEnd == 'забег') {
				stairAmt -= 1;
			}
			var hole1 = {
				x: (stairAmt - 1) * par.b - params.nose + 45 + params.M / 2 - holeDist / 2,//45 - расстояние начала площадки до края второго марша
				y: (stairAmt) * par.h - params.treadThickness - (flanParams.height - flanParams.holeY), //142 - расстояние от вершины фланца до середины нижнего отверстия
			}
			if (par.botEnd == "пол" && params.botFloorType == "черновой") hole1.y += params.botFloorsDist;
			if (params.stairModel == 'П-образная с площадкой') {
				hole1 = newPoint_xy(par.pointsShape[par.pointsShape.length - 3], -pltLength / 2 - holeDist / 2 + params.flanThickness + params.treadPlateThickness - par.stringerLedge, -(flanParams.height - flanParams.holeY) + 2);//2 выступ фланца за каркас
				// hole1 = {
				// 	x: (par.stairAmt - 1) * par.b,// + 27 - params.nose + params.platformLength_1 / 2 - holeDist / 2,//27 - подогнано, тестировал на разных параметрах
				// 	y: (par.stairAmt) * par.h - params.treadThickness - (flanParams.height - flanParams.holeY),
				// }
			}
			var hole2 = newPoint_xy(hole1, holeDist, 0);

			hole1.diam = hole2.diam = 18;
			polePar.roundHoles.push(hole1, hole2)
			}
		if (par.topEnd == "забег" && !(params.stairModel == 'П-образная с забегом' && par.marshId !== 1)){
			var flanParams = getFlanParams('flan_pipe_bot', true);
			var stairAmt = par.stairAmt;
			if (par.botEnd == 'забег') {
				stairAmt -= 1;
			}
			var hole1 = {
				x: (stairAmt - 1) * par.b + params.M / 2 + flanParams.holesDist / 2 - 5, //5 - отступ, пока не пойму какой, но он статичен
				y: (stairAmt) * par.h + par.h_topWnd - params.treadThickness - (flanParams.height - flanParams.holeY) - 2,
			}
			hole1.y -= sidePlate2.position.y;
			//var hole2 = newPoint_xy(hole1, flanParams.holesDist, 0);

			hole1.diam = 18;
			polePar.roundHoles.push(hole1)

			var hole2 = newPoint_xy(hole1, -flanParams.holesDist, 0);
			hole2.diam = 18;
			var line = parallel(stringerPoints[stringerPoints.length - 2], stringerPoints[stringerPoints.length - 3], params.profileHeight)
			var pt = itercection(hole2, polar(hole2, Math.PI / 2, 100), line.p1, line.p2);
			var angel = calcAngleX1(stringerPoints[stringerPoints.length - 3], stringerPoints[stringerPoints.length - 2])
			if (hole2.y < (pt.y - hole2.diam / 2 / Math.sin(angel)))
				polePar.roundHoles.push(hole2);
		}
		if (par.topEnd == "забег" && par.marshId !== 1 && params.stairModel == 'П-образная с забегом'){
			var hole1 = {
				x: (par.stairAmt) * par.b + params.M / 2 + 76, //76 - расстояние от середины фланца до середины верхнего левого отверстия
				y:  par.h * 2 - params.treadThickness - 142, //142 - расстояние от вершины фланца до середины нижнего отверстия
			}
			//var hole2 = newPoint_xy(hole1, 162, 0);

			hole1.diam = 18;
			polePar.roundHoles.push(hole1)
		}

		polePar.marshId = par.marshId;

		var stringerPole = drawPolylinePole(polePar).mesh;
		stringerPole.position.z = -params.profileWidth / 2;
		stringerPole.position.x = sidePlate2.position.x;
		stringerPole.position.y = sidePlate2.position.y;
		par.mesh2.add(stringerPole);
	}
	

	/*
		Подложки ступеней
	*/
	{
		par.stepPoints = [];
		
		if (par.botEnd == "пол" && par.topEnd == "забег" && par.stairAmt <= 2 && (params.model == "сварной" || params.model == "гнутый"))
			par.pointsShape.unshift(par.pointsShape[par.pointsShape.length - 1]);
		if (par.marshId == 2 && params.stairAmt2 == 0 && par.botEnd == "площадка" && par.topEnd == "забег" && (params.model == "сварной" || params.model == "гнутый"))
			par.pointsShape.push(par.pointsShape[0]);
       

		var arr = par.pointsShape.concat();
		arr.shift();

		//if ((par.botEnd == "забег" && par.stairAmt > 1 && params.model == "труба"))
		if ((par.botEnd == "забег" && par.isKinkBot && params.model == "труба"))
			arr.shift();
		if (params.model == "труба" && par.botEnd == "площадка") {
			arr.splice(2, 4); //убираем точки выемки для рамки площадки
			if (par.botConnection) arr.splice(2, 4); //убираем точки выемки для рамки площадки
		}
		//if (par.botEnd == "пол" && par.topEnd == "забег" && par.stairAmt == 1 && params.model == "сварной")
		//	arr.unshift(arr[0]);

		if (params.model == 'гнутый') {
			if (par.topEnd == "забег") {
				arr.splice(arr.length - par.turn1PointsCurve['out'].pointsBot.length);
			}
			if (par.botEnd == "забег") {
				arr.splice(0, par.turn1PointsCurve['out'].pointsTop.length - 1);
			}
		}

		//при большой разнице чистового и чернового пола
		if (par.isBotFloorsDist) arr.splice(1, 1);
		

		var p0 = { x: 0, y: 0, z: -params.stringerThickness / 2 + params.metalThickness };

		var count = par.stairAmt * 2 + 1;
		if (par.botEnd !== "пол") count += 2;
		if (par.topEnd == "забег") count += 2;
		if (params.stairModel == "П-образная с забегом" && par.marshId == 2) count = 9;

		
		
		if(count > arr.length) count = arr.length; //костыль чтобы убрать фатальную ошибку
		for (var i = 0; i < count; i++) {
			var p1 = newPoint_xy(p0, arr[i].x, arr[i].y);
			par.stepPoints.push(p1);
		}


		//подложки ступеней
		var drawTreadPlate = drawHorPlate; //функция в drawCarcasParts.js
		if (params.model == "труба") drawTreadPlate = drawTreadPlateCabriole2; //функция в drawCarcasParts.js

		var platePar = {
			marshId: par.marshId,
			plateId: 0,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, -1000),
			type: "treadPlate",
			stairAngle: Math.atan(par.h / par.b),
			isSvg: true,
		}

		for (var i = 1; i < par.stepPoints.length - 1; i++) {
			if (i % 2) {
				platePar.plateId += 1;
				platePar.step = par.stepPoints[i + 1].x - par.stepPoints[i].x;
				platePar.h = par.stepPoints[i].y - par.stepPoints[i - 1].y; //параметр для сборных подложек
				platePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, -(platePar.step + 150) * i - 1000);
				platePar.hasTrapHole = false;
				platePar.isFirst = false;
				platePar.isBotPlatform = false;
				platePar.isPltBot = false;
				platePar.isPltBotP = false;
				platePar.isPlt = false;
				var plate = false;

				var isPlate = true;
				var basePointShiftX = 0;

				if (par.botEnd == "пол" && i == 1) {
					platePar.isFirst = true;
					if (params.model == "труба" && par.stairAmt == 2 && par.topEnd == "забег")
						platePar.stairAngle = calcAngleX1(par.pointsShape[0], par.pointsShape[par.pointsShape.length - 1]);
					if (params.botFloorType === "черновой")
						platePar.h -= params.botFloorsDist - params.flanThickness;
					if (params.model == "труба" && par.isBotPipeHor)
						platePar.isBotPipeHor = par.isBotPipeHor;
				}
				////подложка промежуточной площадки(нижнего марша)

				if (par.topEnd == "площадка" && i >= par.stepPoints.length - 2 && par.stairAmt > 1) {
					if (params.model == "сварной") {
						if (!(params.stairModel !== "П-образная с площадкой" && params.stairType == 'лотки')) {
							platePar.isPlt = true;
							platePar.frontOff = 30;
							if (params.stairModel == "П-образная с площадкой" || par.topConnection) {
								if (par.topConnection) {
									if (par.stringerLedge1) platePar.step -= par.stringerLedge1;
									else platePar.step -= par.stringerLedge;
								}
								var stepPlate = par.stepPoints[i - 1].x - par.stepPoints[i - 2].x
								platePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, -(stepPlate + 150) * i - 1000);
								if (params.stairModel == "П-образная с площадкой") platePar.isPltP = true;

								var plate = drawHorPlates(platePar).mesh;
								isPlate = false;
							}
							else {
								platePar.step -= ((params.M / 2) / 2 - params.stringerThickness / 2);
								if (!par.topConnection) platePar.isPlt = true;
								platePar.isSvg = true;
								platePar.isTopPlatform = true;
							}
						}
						else {
							isPlate = false;
						}
					}
					if (params.model == "труба") {
						platePar.isTopNot = true;
						platePar.step = 136;
						platePar.isPlatform = true;
						if (params.stairModel == "П-образная с площадкой" && par.marshId == 1) {
							var step = turnPar.turnLengthTop / 2 - (params.platformLength_1 - 300) / 2 - params.nose;
							if (step < platePar.step) {
								platePar.step = step - 10;
							}
						}
					}
				}

				//if (par.topEnd == "забег" && i == par.stepPoints.length - 1 && params.model == 'гнутый')
				//	isPlate = false;

				//подложка первой и  второй забежной ступени
				if (par.topEnd == "забег" && i >= par.stepPoints.length - 4 && params.model !== 'гнутый') {
					//подложка второй забежной ступени
					if (i == par.stepPoints.length - 2 && params.model !== 'гнутый') {
						platePar.turnSteps = par.turnSteps.params[2];
						if (params.model == "труба") {
							if (par.stairAmt == 1)
                                platePar.angleIn1 = calcAngleX1(par.pointsShape[0], par.pointsShape[par.pointsShape.length - 1]);
							if (par.stairAmt == 0)
								platePar.angleIn1 = calcAngleX1(par.pointsShape[par.pointsShape.length - 1], par.pointsShape[par.pointsShape.length - 2]);
							if (par.stairAmt == 0) platePar.stairAmt = 0;
							if (!par.isKinkTop) {
								platePar.angleIn1 = calcAngleX1(par.pointsShape[0],par.pointsShape[par.pointsShape.length - 1]);
								platePar.isNotKinkTop = true;
							}
							if (par.offsetTopWndHoleY3) platePar.offsetTopWndHoleY3 = par.offsetTopWndHoleY3;
							if (par.offsetTopWndHoleY3Turn2) platePar.offsetTopWndHoleY3 = par.offsetTopWndHoleY3Turn2;
							platePar.stepPrev = par.stepPoints[i].x - par.stepPoints[i - 2].x;
							var plate = drawTurn2TreadPlateCabriole(platePar).mesh;
						} else {
							if (par.topConnection) platePar.step -= par.stringerLedge;
							if (!par.topConnection) platePar.step += params.M / 4 - params.flanThickness;
							var plate = drawTurnPlate2(platePar).mesh;
						}
					}
					//подложка первой забежной ступени
					if (i == par.stepPoints.length - 4 && params.model !== 'гнутый') {
						platePar.turnSteps = par.turnSteps.params[1];
						platePar.hasTrapHole = true;
						if (params.model == "труба") {
							platePar.angleIn1 = calcAngleX1(par.pointsShape[0], par.pointsShape[par.pointsShape.length - 2]);
							if (par.stairAmt <= 1) {
								if (par.isBotPipeHor) platePar.isBotPipeHor = par.isBotPipeHor;
							}
							if (par.stairAmt == 0) platePar.stairAmt = 0;	
							if (!par.isKinkTop) {
								platePar.angleIn1 = calcAngleX1(par.pointsShape[0], par.pointsShape[par.pointsShape.length - 1]);
								platePar.isNotKinkTop = true;
							}
							

							var plate = drawTurn1TreadPlateCabriole(platePar).mesh;
						}
						else
							var plate = drawTurnPlate1(platePar).mesh;
					}
					isPlate = false;
				}
				
				//подложка третьей забежной ступени
				if (par.botEnd == "забег" && i <= 3 && params.model !== 'гнутый') {
					if (i == 3 && params.model !== 'гнутый') {
						platePar.turnSteps = par.turnSteps.params[1];
						if (params.stairModel == "П-образная с забегом" && par.topEnd == "забег")
							platePar.turnSteps = par.turnSteps.params[3];
						if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && params.stairAmt2 == 0)
							platePar.turnSteps = par.turnSteps.params[3];
						if (params.model == "труба") {
							//if (par.stairAmt == 0)
							if (!par.isKinkBot) {
								platePar.angleIn3 = calcAngleX1(par.pointsShape[0], par.pointsShape[par.pointsShape.length - 1]);
								platePar.isNotKinkBot = true;
							}
							//if (par.stairAmt > 0)
							if (par.isKinkBot)
								platePar.angleIn3 = calcAngleX1(par.pointsShape[1], par.pointsShape[0]);
							if (par.topEnd == "пол" && par.stairAmt == 1) { //если ступень последняя
								platePar.dStep = params.lastWinderTreadWidth - 50;
								if (params.topAnglePosition == "под ступенью") {
									platePar.isTopNot = true;
									platePar.dStep -= params.treadPlateThickness;
								}
							}
							var plate = drawTurn3TreadPlateCabriole(platePar).mesh;
						}

						if (params.model == "сварной") {
							if (par.stairAmt == 1 && par.lastMarsh)
								platePar.stepWidthLow = params.lastWinderTreadWidth;

							var plate = drawTurnPlate3(platePar).mesh;
						}
					}
					isPlate = false;
				}
				//подложка промежуточной площадки(верхнего марша)
				if (par.botEnd == "площадка" && i == 1) {
					if (params.model == "сварной") {
						if (!(params.stairModel !== "П-образная с площадкой" && params.stairType == 'лотки' && !par.botConnection)) {
							if (params.stairModel == "П-образная с площадкой" || par.botConnection) {
								platePar.frontOff = 1;
								basePointShiftX = -(platePar.frontOff + params.flanThickness + 2);
								if (params.stairModel !== "П-образная с площадкой" && par.botConnection)
									basePointShiftX += - par.stringerLedge;
								platePar.step += basePointShiftX;
								if (params.stairModel == "П-образная с площадкой") {
									platePar.isPltBotP = true;
									if (params.stairType == 'лотки') basePointShiftX = 0;
									//var plate = drawHorPlatesPlatformBot(platePar).mesh;								
								}
								else {
									platePar.isPltBot = true;
									//var plate = drawHorPlates(platePar).mesh;
								}
								var plate = drawHorPlatesPlatformBot(platePar).mesh;
								isPlate = false;
							}
							else {
								basePointShiftX = params.stringerThickness / 2 - (params.M / 2) / 2 - 5 - 30;
								platePar.step += basePointShiftX;
								platePar.isBotPlatform = true;
							}
						}
						else {
							isPlate = false;
						}
					}
					if (params.model == "труба" || params.stairType == 'лотки') {
                        isPlate = false;
					}
				}

				//для последней подложки верхнего марша убираем верхний выступ

				if (par.topEnd == "пол" && i == par.stepPoints.length - 2) {
					if (params.model == "труба") {
						platePar.step += params.treadPlateThickness;
						if (params.topAnglePosition == "под ступенью") {
							platePar.isTopNot = true;
							platePar.isTopLast = true;
							platePar.step -= params.treadPlateThickness;
						}
					}

					if (params.model == "сварной") {
						platePar.isTopLast = true;
						platePar.isSvg = true;
					}
				}

				//подложка прямой ступени

				if (isPlate) {					
					var plate = drawTreadPlate(platePar).mesh;
                    if (!platePar.isFirst || params.model == "сварной") platePar.isSvg = false;
                    if (platePar.isBotPlatform) platePar.isSvg = true;
				}

				if (plate) {
					plate.position.x += sidePlate2.position.x + par.stepPoints[i].x - basePointShiftX;
					if (platePar.isPltBotP || platePar.isPltBot) plate.position.x = sidePlate2.position.x;
					plate.position.y += sidePlate2.position.y + par.stepPoints[i].y + 0.005;
					par.treadPlates.add(plate);
				}
			}
		} //конец цикла

		if (params.model == 'гнутый' && par.marshId !== 3) {
			var plates = drawTurnPlatesCurve(par).mesh
			plates.position.x += sidePlate2.position.x + par.stepPoints[par.stepPoints.length - 1].x - params.nose;
			plates.position.y += sidePlate2.position.y + par.stepPoints[par.stepPoints.length - 1].y + 0.005;
			plates.position.z -= params.M / 2 * turnFactor;
			par.treadPlates.add(plates);
		}
	}
	
	/*
		Задаем позиции столбов
	*/
	var columnPosition = calcColumnsPosition({ pointsShape: par.pointsShape, marshId: par.marshId}, par);


	/*
		Фланцы и пластины
	*/
	{
		if (params.model == "сварной" || params.model == "гнутый") {
		//if (params.model == "сварной") {
			// при большой разнице чистового и чернового пола
			if (par.botEnd == "пол") {
				if (par.pointsShape[0].x == par.pointsShape[1].x && par.pointsShape[0].y > par.pointsShape[1].y) {
					par.isBigFloor = true;
				}
			}

			//вертикальные пластины
			var platePar = {
				isLong: false,
				marshId: par.marshId,
				plateId: 0,
				stairAngle1: par.marshAngle,
				stringerWidth: par.stringerWidth,
				dxfArr: dxfPrimitivesArr,
                dxfBasePoint: turnFactor == 1 ? dxfBasePoint0 : par.dxfBasePoint,
            }
	        var dxfBasePoint = platePar.dxfBasePoint;
			//Лицевая часть между ступенями
			{
				for (var i = 1; i < par.stepPoints.length - 1; i++) {
					platePar.pointCurrentSvg = copyPoint(par.stepPoints[i]);
					platePar.pointStartSvg = copyPoint(par.stepPoints[0]);
					if (par.isBigFloor) platePar.pointStartSvg = copyPoint(par.pointsShape[2]);// при большой разнице чистового и чернового пола

					if (i % 2) {
						var isPlate = true;
						var isDrawPlate = true;
                        platePar.dxfBasePoint = newPoint_xy(dxfBasePoint,
							par.stepPoints[i].x - par.stringerWidth,
							par.stepPoints[i].y + (par.stepPoints[i + 1].x - par.stepPoints[i].x) + 100 * 2);
						platePar.plateId += 1;
						platePar.height = par.stepPoints[i].y - par.stepPoints[i - 1].y;
						platePar.isLong = false;
						if (platePar.plateId % 3 == 0) platePar.isLong = true; //каждая третья пластина длинная
							
						//пластина на забеге не может быть длинной
						if (i == par.stepPoints.length - 2) {
							if (par.topEnd == "забег") platePar.isLong = false;
                            //сохраняем в глобальные переменные точки привязки последней вертикальной пластины для фланца соединения косоуров, который строится в следующем марше
							var pointCurrentSvgTmp1 = newPoint_xy(platePar.pointCurrentSvg, -params.stringerThickness, platePar.height + 150 + params.stringerThickness + params.metalThickness * 2);
						    var pointStartSvgTmp1 = copyPoint(platePar.pointStartSvg);
						}
						if (par.topEnd == "забег" && par.botEnd == "забег" && i == par.stepPoints.length - 4 && params.model !== 'гнутый') {
							platePar.isLong = false;
						}
						if (par.botEnd == "пол" && params.stairAmt1 < 3) {
							platePar.isLong = false;
						}
						//if (par.botEnd == "забег" && platePar.plateId == 3) {
						//	platePar.stairAngle1 = calcAngleX1(par.pointsShape[1], par.pointsShape[0]);
						//}
						//else {
						//	platePar.stairAngle1 = par.marshAngle;
						//}
						platePar.stairAngle1 = par.marshAngle;
						
						platePar.isFlan = false;
						//вместо пластины делаем фланец соединения косоуров
						if (par.botEnd !== "пол" && i == 1 && params.model !== 'гнутый') isDrawPlate = false;

						if (params.model == 'гнутый') {
							//if (par.topEnd == "забег" && i >= par.stepPoints.length - 4) isDrawPlate = false;
							//if (par.botEnd == "забег" && i <= 3) isDrawPlate = false;
						}

						if (isDrawPlate) {
							var plate = drawFrontPlate(platePar).mesh; //функция в drawCarcasParts.js
							plate.rotation.y = -Math.PI / 2;
							plate.position.x += sidePlate2.position.x + par.stepPoints[i].x + params.metalThickness;
							plate.position.y += sidePlate2.position.y + par.stepPoints[i].y;
							plate.position.z += sidePlate2.position.z + params.metalThickness;

							par.mesh2.add(plate)
						}
					}
				}

				if (params.model == 'гнутый' && par.marshId !== 3) {
					var plates = drawFrontPlatesCurve(platePar).mesh; //функция в drawCarcasParts.js
					//plates.rotation.y = -Math.PI / 2;
					plates.position.x += sidePlate2.position.x + par.stepPoints[par.stepPoints.length - 1].x - params.nose;
					plates.position.y += sidePlate2.position.y + par.stepPoints[par.stepPoints.length - 1].y;
					//plates.position.z += sidePlate2.position.z;
					plates.position.z = -(params.M / 2);
					if (turnFactor == - 1) {
						plates.position.x = sidePlate2.position.x + par.stepPoints[par.stepPoints.length - 1].x - params.nose;
						plates.position.y = sidePlate2.position.y + par.stepPoints[par.stepPoints.length - 1].y;
						plates.position.z = (params.M / 2);
						//plates.position.x += params.metalThickness;
					}

					par.mesh2.add(plates)
				}
			}
			// Пластины под ступени
			{
				//горизонтальные пластины каркаса
				var offsetY = 5; //зазор между подложкой ступени и пластиной
				
				for (var i = 1; i < par.stepPoints.length - 1; i++) {
					
					var platePar = {
						plateId: 0,
						marshId: par.marshId,
						dxfArr: dxfPrimitivesArr,
						dxfBasePoint: turnFactor == 1 ? dxfBasePoint0 : par.dxfBasePoint,
						type: "carcasPlate",
					}
					platePar.pointCurrentSvg = copyPoint(par.stepPoints[i]);
					platePar.pointStartSvg = copyPoint(par.stepPoints[0]);
					if (par.isBigFloor) platePar.pointStartSvg = copyPoint(par.pointsShape[2]);// при большой разнице чистового и чернового пола
					
					if (i % 2 && !menu.simpleMode) {
						platePar.plateId += 1;
						platePar.step = par.stepPoints[i + 1].x - par.stepPoints[i].x;
						platePar.dxfBasePoint = newPoint_xy(platePar.dxfBasePoint,
							par.stepPoints[i + 1].x - par.stringerWidth / 2 - 100,
							par.stepPoints[i - 1].y + par.stringerWidth + 100);
						//platePar.dxfBasePoint.y -= platePar.step + 150;
						platePar.hasTrapHole = false;
						platePar.isTurn2 = false;
						var isPlate = true;
						var isDrawPlate = true;
						platePar.isBotPlatform = false;
						platePar.isPltBotP = false;
						platePar.isPltBot = false;


						if (par.topEnd == "забег" && i >= par.stepPoints.length - 4) {
							//пластина второй забежной ступени(нижнего марша)
							if (i == par.stepPoints.length - 2 && params.model !== 'гнутый') {
								platePar.turnSteps = par.turnSteps.params[2];
								platePar.dStep = - params.M / 2 + params.flanThickness + (params.M / 2) / 2;
								platePar.backOffHoles = par.stringerLedge;
								if (par.topConnection) {
									platePar.backOffHoles = par.stringerLedge;
									platePar.isTurn2Top = true;//наличие второго прямогуольного выреза для закрепления фланца
								}
								if (!par.topConnection) {
									platePar.step -= params.metalThickness;
									platePar.backOffHoles = -params.M / 4 + params.flanThickness - params.metalThickness;
								}
								if (par.topConnection && params.stairType !== 'лотки') {

									var deltaLen = 8;//Сдвиг к стене, чтобы закрыть фланец.
									var len = params.M / 2 / 2 + par.stringerLedge - 0.01;//-platePar.dStep + 10 + deltaLen;
									var width = params.stringerThickness;

									// тело стойки
									var p0 = { x: 0, y: 0 }
									var p1 = newPoint_xy(p0, width, 0);
									var p2 = newPoint_xy(p1, 0, len)
									var p3 = newPoint_xy(p2, -width, 0)

									var shape = new THREE.Shape();

									addLine(shape, dxfPrimitivesArr, p0, p1, platePar.dxfBasePoint, 'carcas');
									addLine(shape, dxfPrimitivesArr, p1, p2, platePar.dxfBasePoint, 'carcas');
									addLine(shape, dxfPrimitivesArr, p2, p3, platePar.dxfBasePoint, 'carcas');
									addLine(shape, dxfPrimitivesArr, p3, p0, platePar.dxfBasePoint, 'carcas');

									var thickness = 8;
									var extrudeOptions = {
										amount: thickness,
										bevelEnabled: false,
										curveSegments: 12,
										steps: 1
									};
									var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
									geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
									var flan = new THREE.Mesh(geometry, params.materials.metal2);
									flan.position.x = sidePlate2.position.x + par.stepPoints[i].x + platePar.step - len + deltaLen;
									flan.position.y = sidePlate2.position.y + par.stepPoints[i].y + thickness;
									flan.position.z = width / 2;
									flan.rotation.x = Math.PI / 2;
									flan.rotation.z = -Math.PI / 2;
									par.mesh2.add(flan);

									//сохраняем данные для спецификации
									var partName = "treadPlate1";
									if (typeof specObj != 'undefined') {
										if (!specObj[partName]) {
											specObj[partName] = {
												types: {},
												amt: 0,
												area: 0,
												name: "Пластина",
												metalPaint: true,
												timberPaint: false,
												division: "metal",
												workUnitName: "amt", //единица измерения
												group: "Каркас",
											}
										}
										var name = Math.round(width) + "х" + Math.round(len) + "х" + Math.round(thickness);
										var area = width * len / 1000000;
										if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
										if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
										specObj[partName]["amt"] += 1;
										specObj[partName]["area"] += area;
									}
									flan.specId = partName + name;
								}
							}
							//пластина первой забежной ступени
							if (i == par.stepPoints.length - 4 && params.model !== 'гнутый') {
								platePar.hasTrapHole = true;
								platePar.turnSteps = par.turnSteps.params[1];
							}

							if (params.model == 'гнутый') isDrawPlate = false;
						}
						//пластина второй забежной ступени(верхнего марша)
						if (par.botEnd == "забег" && i == 1) {
							if (params.model !== 'гнутый') {
								platePar.turnSteps = par.turnSteps.params[2];
								platePar.isTurn2 = true;
							}
							if (params.model == 'гнутый') isDrawPlate = false;
						}

						//пластина промежуточной площадки(верхнего марша)
						if (par.botEnd == "площадка" && i == 1) {

							if (params.stairModel == "П-образная с площадкой" || par.botConnection) {
								platePar.frontOff = 1;
								platePar.frontOffset = 0;
								platePar.basePointShiftX = -(platePar.frontOff + params.flanThickness + 2);
								if (params.stairModel !== "П-образная с площадкой" && par.botConnection) {
									platePar.basePointShiftX += - par.stringerLedge;
									platePar.stringerLedge = par.stringerLedge;
								}
								if (params.stairModel == "П-образная с площадкой") {
									//var plate = drawHorPlatesPlatformBot(platePar).mesh;
									platePar.isPltBotP = true;
								}
								else {
									platePar.isPltBot = true;
									//var plate = drawHorPlates(platePar).mesh;
								}
								var plate = drawHorPlatesPlatformBot(platePar).mesh;
								isPlate = false;
							}
							else {
								platePar.basePointShiftX = params.stringerThickness / 2 - (params.M / 2) / 2 - 5 - 30;
								platePar.frontOffset = 0;
								platePar.isBotPlatform = true; //второй прямогуольный вырез в пластине для закрепления фланца
							}
						}

						//пластина промежуточной площадки(нижнего марша)
						if (par.topEnd == "площадка" && i >= par.stepPoints.length - 2) {
							platePar.frontOff = 30;
							if (params.stairModel == "П-образная с площадкой" || par.topConnection) {
								if (par.topConnection) platePar.backOffHoles = par.stringerLedge;
								var plate = drawHorPlates(platePar).mesh; //функция в drawCarcasParts.js
								isPlate = false;
							}
							else {
								platePar.backOffHoles = ((params.M / 2) / 2 - params.stringerThickness / 2);
								platePar.isTopPlatform = true; //второй прямогуольный вырез в пластине для закрепления фланца
							}
						}

						if (isPlate) {
							var plate = drawHorPlate(platePar).mesh; //функция в drawCarcasParts.js			
						}

						if (isDrawPlate) {
							plate.position.x = sidePlate2.position.x + par.stepPoints[i].x;
							if (platePar.isPltBotP || platePar.isPltBot) plate.position.x = sidePlate2.position.x;
							plate.position.y = sidePlate2.position.y + par.stepPoints[i].y - params.metalThickness - offsetY;
							par.mesh2.add(plate);
						}
					}
				} //конец цикла
			}
			//задняя пластина каркаса(Нижняя)
            {
                var dxfPoint = copyPoint(dxfBasePoint0);
                if (turnFactor == -1) dxfPoint = copyPoint(par.dxfBasePoint);
                dxfPoint.y -= par.stringerWidth;
                if (par.botEnd == "забег") dxfPoint.y -= par.h * 4;
                if (par.botEnd == "площадка") dxfPoint.y -= par.h * 2;

                var platePar = {
                    stringerWidth: par.stringerWidth - 2 * params.metalThickness,
                    dxfArr: dxfPrimitivesArr,
                    dxfBasePoint: copyPoint(dxfPoint),
                    pStart: par.pointsShape[0],
                    pEnd: par.pointsShape[par.pointsShape.length - 1],
                    stringerLedge: par.stringerLedge,
                    topConnection: par.topConnection,
                    columnPosition: columnPosition,
                    marshId: par.marshId,
				}
				ang = calcAngleX1(platePar.pStart, platePar.pEnd);
				platePar.pEnd = newPoint_x1(platePar.pEnd, -0.01, ang)
				if (par.marshMiddleFix !== "нет") platePar.isHolesColon = true;
				platePar.pointCurrentSvg = copyPoint(par.pointsShape[0]);
				platePar.pointStartSvg = copyPoint(par.pointsShape[1]);
				if (par.isBigFloor)
					platePar.pointStartSvg = copyPoint(par.pointsShape[2]); // при большой разнице чистового и чернового пола

				if (par.pDivideBot) {
					//точки полной пластины, для правильного расчета отверстий под колонны
					platePar.pStartFull = par.pointsShape[0]
					platePar.pEndFull = par.pointsShape[par.pointsShape.length - 1]
					platePar.pDivide = par.pDivideBot

					platePar.pEnd = newPoint_x1(par.pDivideBot, -0.01, ang)
					var plate1 = drawBackPlate(platePar).mesh;
					plate1.position.x = sidePlate2.position.x + par.pointsShape[0].x;
					plate1.position.y = sidePlate2.position.y + par.pointsShape[0].y;
					par.mesh2.add(plate1);
					platePar.dxfBasePoint.y += 300;

					platePar.pStart = par.pDivideBot;
					platePar.pointCurrentSvg = copyPoint(par.pDivideBot);
					//platePar.pointStartSvg = copyPoint(par.pDivideBot);
					platePar.pEnd = newPoint_x1(par.pointsShape[par.pointsShape.length - 1], -0.01, ang)
					var plate2 = drawBackPlate(platePar).mesh;
					plate2.position.x = sidePlate2.position.x + par.pDivideBot.x;
					plate2.position.y = sidePlate2.position.y + par.pDivideBot.y;
					par.mesh2.add(plate2);

					platePar.dxfBasePoint.x += distance(platePar.pEnd, platePar.pStart) + 100;

					platePar.pStartFull = false
					platePar.pEndFull = false
					platePar.pDivide = false
				}
				else {				
					var isDrawBackPlate = true;
					if (platePar.pStart.x + 5 > platePar.pEnd.x) isDrawBackPlate = false;
					if (par.botEnd == "пол" && par.topEnd == "забег" && par.stairAmt <= 2) isDrawBackPlate = false;
					if (par.marshId == 2 && params.stairAmt2 == 0 && par.topEnd == "забег" && par.botEnd == "площадка")
						isDrawBackPlate = false;
					if (isDrawBackPlate) {
						var plate = drawBackPlate(platePar).mesh;
						plate.position.x = sidePlate2.position.x + par.pointsShape[0].x;
						plate.position.y = sidePlate2.position.y + par.pointsShape[0].y;
						par.mesh2.add(plate);
						platePar.dxfBasePoint.x += distance(platePar.pEnd, platePar.pStart) + 100;

					}
				}


				// Пластина, при большой разнице чистового и чернового пола
				if (par.botEnd == "пол") {
					if (par.pointsShape[0].x == par.pointsShape[1].x && par.pointsShape[0].y > par.pointsShape[1].y) {
						platePar.isHolesColon = false;
						platePar.pStart = copyPoint(par.pointsShape[1]);
						//var ang = calcAngleX1(par.pointsShape[0], par.pointsShape[par.pointsShape.length - 1]);
						platePar.pEnd = copyPoint(par.pointsShape[0]);

						dxfBasePointTemp = copyPoint(platePar.dxfBasePoint);
						platePar.dxfBasePoint = newPoint_xy(dxfPoint, - distance(platePar.pEnd, platePar.pStart) - 100, 0);
						platePar.pointCurrentSvg = copyPoint(platePar.pEnd);
						platePar.pointStartSvg = copyPoint(platePar.pStart);
						//platePar.pointStartSvg.y += par.pointsShape[0].y - par.pointsShape[1].y;
						platePar.pointCurrentSvg = copyPoint(platePar.pStart);
						platePar.pointStartSvg = copyPoint(platePar.pEnd);

						var plate = drawBackPlate(platePar).mesh;
						plate.position.x = sidePlate2.position.x + platePar.pStart.x;
						plate.position.y = sidePlate2.position.y + platePar.pStart.y;
						par.mesh2.add(plate);

						platePar.dxfBasePoint = dxfBasePointTemp;
					}
	            }


                // Пластина на прямой части каркаса если поворот снизу(снизу каркаса)
				if (par.botEnd !== "пол" && params.model !== 'гнутый') {
                    platePar.isHolesColon = false;
                    if (!(par.botEnd == "забег" || params.stairModel == "П-образная с площадкой"))
                        platePar.isHolesColonPlatform = holesColumnPlatform(par, true, false);

                    //if (par.botEnd == "забег" && par.stairAmt == 1)
					platePar.pStart = copyPoint(par.pointsShape[1]);
					if (par.isBigFloor) platePar.pStart = copyPoint(par.pointsShape[2]);// при большой разнице чистового и чернового пола
                    var ang = calcAngleX1(par.pointsShape[0], par.pointsShape[par.pointsShape.length - 1]);
					if (par.marshId == 2 && params.stairAmt2 == 0 && par.topEnd == "забег" && par.botEnd == "площадка")
						ang = calcAngleX1(par.pointsShape[0], par.pointsShape[par.pointsShape.length - 2]);
                    platePar.pEnd = newPoint_xy(par.pointsShape[0], - params.metalThickness * Math.sin(ang), 0);

                    dxfBasePointTemp = copyPoint(platePar.dxfBasePoint);
                    platePar.dxfBasePoint = newPoint_xy(dxfPoint, - distance(platePar.pEnd, platePar.pStart) - 100, 0);
                    platePar.pointCurrentSvg = copyPoint(platePar.pEnd);
					platePar.pointStartSvg = copyPoint(platePar.pStart);

                    var plate = drawBackPlate(platePar).mesh;
                    plate.position.x = sidePlate2.position.x + platePar.pStart.x;
                    plate.position.y = sidePlate2.position.y + platePar.pStart.y;
                    par.mesh2.add(plate);

                    platePar.dxfBasePoint = dxfBasePointTemp;
                }

                // Пластина на прямой части каркаса если поворот сверху(снизу каркаса)
				if (par.topEnd !== "пол" && params.model !== 'гнутый') {
                    var ang1 = calcAngleX1(par.pointsShape[0], par.pointsShape[par.pointsShape.length - 1]);
                    var ang2 = calcAngleX1(par.pointsShape[par.pointsShape.length - 1],
                        par.pointsShape[par.pointsShape.length - 2]);
                    platePar.isHolesColon = false;
                    platePar.isHolesColonPlatform = holesColumnPlatform(par, false, true);
                    //if (par.topEnd == "забег") platePar.isHolesColonPlatform = true;
                    platePar.pStart = newPoint_xy(par.pointsShape[par.pointsShape.length - 1], 0.01, 0);
                    if (par.topEnd == "забег" && ang1 < ang2) {
						//platePar.pStart.x += params.metalThickness * Math.sin(ang2);
						var pt1 = polar(platePar.pStart, ang1 + Math.PI / 2, params.metalThickness);
						var pt2 = polar(platePar.pStart, ang2 + Math.PI / 2, params.metalThickness);
						var dist = distance(pt1, pt2);
						platePar.pStart = polar(platePar.pStart, ang2, dist);
                    }
					if (par.topEnd == "площадка" && ang2 == Math.PI / 2) {
						platePar.pStart.y += params.metalThickness * Math.cos(ang1);
					}
                    platePar.pEnd = par.pointsShape[par.pointsShape.length - 2];
					platePar.pointCurrentSvg = copyPoint(platePar.pStart);
					if (par.isBigFloor) platePar.pointStartSvg = copyPoint(par.pointsShape[2]);// при большой разнице чистового и чернового пола
                    if (par.topEnd == "площадка")
                        platePar.pointCurrentSvg = newPoint_xy(platePar.pEnd, 0, -params.stringerThickness - 200);
                    platePar.topPlate = true;

                    var plate = drawBackPlate(platePar).mesh;
                    plate.position.x = sidePlate2.position.x + platePar.pStart.x;
                    plate.position.y = sidePlate2.position.y + platePar.pStart.y;
                    par.mesh2.add(plate);
                }
            }

            par.dxfBasePoint = copyPoint(dxfBasePoint0);
			var dxfBasePoint = newPoint_xy(dxfBasePoint0, 0, -200);
			var dxfStep = 200;
			
			//нижний фланец (Который крепится к полу)
			if (par.botEnd == "пол") {
				var flanPar = {
					marshId: par.marshId,
					type: "bot", 
					pointsShape: par.pointsShape, 
                    dxfBasePoint: copyPoint(dxfBasePoint),
                    name: "Фланец крепления к полу",
				};
				flanPar.pointCurrentSvg = copyPoint(par.pointsShape[1]);
				flanPar.pointStartSvg = copyPoint(par.pointsShape[1]);
				if (par.isBotFloorsDist) flanPar.isBotFloorsDist = par.isBotFloorsDist; 
		
				var flan = drawMonoFlan(flanPar).mesh;
				flan.position.x = sidePlate2.position.x - 5;

				flan.position.y += sidePlate2.position.y;
				par.flans.add(flan);
				
				//нижний фланец-заглушка
				var flanPar = {
					marshId: par.marshId,
					type: "botStub",
					pointsShape: par.pointsShape, 
                    dxfBasePoint: newPoint_xy(dxfBasePoint, -dxfStep, 0),
				};
				flanPar.pointCurrentSvg = copyPoint(par.pointsShape[1]);
				flanPar.pointStartSvg = copyPoint(par.pointsShape[1]);
				if (par.isBotFloorsDist) flanPar.isBotFloorsDist = par.isBotFloorsDist;
				if (par.isBigFloor) flanPar.pointStartSvg.y += params.botFloorsDist;// при большой разнице чистового и чернового пола

				
				var flan = drawMonoFlan(flanPar).mesh;
				flan.position.x = sidePlate2.position.x + params.metalThickness + 1;
				flan.position.y += sidePlate2.position.y + params.flanThickness;
				par.flans.add(flan);
			}
			
			//Фланцы площадки
			if (par.botEnd === "площадка") {
				dxfBasePoint.y -= dxfStep;
				var flanPar = {
					marshId: par.marshId,
					type: "join",
					pointsShape: par.pointsShape,
                    dxfBasePoint: dxfBasePoint,
					name: "Фланец площадки крепления к стене",
					marshIdFix: marshParams.prevMarshId,
				};

				//если соединение к стене
				if (par.botConnection && params.stairModel !== "П-образная с площадкой") {
					flanPar.noBolts = true; //болты не добавляются
					flanPar.isCentralHoles = true; //отверстия в центре

					var flan = drawMonoFlan(flanPar).mesh;

					flan.position.x = sidePlate2.position.x - params.flanThickness + par.pointsShape[1].x;
					flan.position.y = sidePlate2.position.y + par.pointsShape[1].y;
					par.flans.add(flan);

					//фланец-заглушка
					var flanPar = {
						type: "joinStub",
						pointsShape: par.pointsShape,
						dxfBasePoint: par.dxfBasePoint,
					};
					flanPar.height = params.stringerThickness - params.metalThickness * 2 - 5;

					var flan = drawMonoFlan(flanPar).mesh;
					flan.position.x = sidePlate2.position.x + par.pointsShape[1].x;
					flan.position.y = sidePlate2.position.y + par.pointsShape[1].y + params.metalThickness;
					par.flans.add(flan);
				}
				//если соединение косоуров
				if (!par.botConnection || params.stairModel == "П-образная с площадкой") {	
					flanPar.marshIdFix = 2;
                    flanPar.type = "joinStub";
                    flanPar.height = params.stringerThickness - params.metalThickness * 2 - 5 - 2;
                    //flanPar.holeY = 25;
                    flanPar.name = "Фланец площадки соединения косоуров";
                    flanPar.noBolts = true; //болты в первом фланце не добавляются
                    flanPar.isBolts = true; //болты в первом фланце добавляются с шестигрн.
                    flanPar.pointCurrentSvg = newPoint_xy(par.stepPoints[1], -params.stringerThickness - 100, 0);
                    flanPar.pointStartSvg = copyPoint(par.stepPoints[0]);

					var flan = drawMonoFlan(flanPar).mesh;
					flan.position.x = sidePlate2.position.x  + par.pointsShape[1].x;
                    flan.position.y = sidePlate2.position.y + par.pointsShape[1].y + params.metalThickness + 1;
					par.flans.add(flan);

					//усиливающий фланец
                    flanPar.noBolts = true; //болты во втором фланце не добавляются
                    flanPar.isBolts = false; //болты во втором фланце не добавляются
                    flanPar.dxfBasePoint.x += params.stringerThickness + 100; 
                    flanPar.marshId = getMarshParams(par.marshId).prevMarshId;
                    flanPar.pointCurrentSvg = newPoint_xy(pointCurrentSvgTmp, params.stringerThickness * 2 + 100, 0);
                    flanPar.pointStartSvg = copyPoint(pointStartSvgTmp);

					var flan2 = drawMonoFlan(flanPar).mesh;
					flan2.position.x = flan.position.x - params.flanThickness - params.metalThickness - 0.1;
					flan2.position.y = flan.position.y ;
					par.flans.add(flan2);
				}
			}
			//TODO глянуть на забегах
			if (par.botEnd == "забег" && params.model !== 'гнутый'){
				var flanPar = {
						marshId: par.marshId,
						type: "joinStub",
						height: 215 - params.metalThickness * 2 - 5 - 2,
						pointsShape: par.pointsShape, 
						dxfBasePoint: par.dxfBasePoint,
						marshIdFix: marshParams.prevMarshId,
					};

					flanPar.pointCurrentSvg = newPoint_xy(par.stepPoints[1], -params.stringerThickness - 100, 0);
					flanPar.pointStartSvg = copyPoint(par.stepPoints[0]);
					flanPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, -(params.M / 2 + 45 + params.stringerThickness / 2 + params.stringerThickness + 100), -par.h * 3 - flanPar.height);

					//фланец в косоуре	
					flanPar.noBolts = true; //болты в первом фланце не добавляются
					flanPar.isBolts = true; //болты в первом фланце добавляются с шестигрн.
					var plate = drawMonoFlan(flanPar).mesh;
					plate.position.x = sidePlate2.position.x + par.stepPoints[0].x + params.flanThickness;
					plate.position.y = sidePlate2.position.y + par.stepPoints[0].y + params.metalThickness + 1;
					plate.position.z = -params.stringerThickness / 2 + params.metalThickness;
					plate.rotation.y = -Math.PI / 2;
					par.flans.add(plate);
					
					//усиливающий фланец
					flanPar.noBolts = true; //болты во втором фланце не добавляются
					flanPar.isBolts = false; //болты во втором фланце не добавляются
					flanPar.dxfBasePoint.y += flanPar.height + 50;
					//flanPar.pointCurrentSvg = newPoint_xy(par.stepPoints[1], -params.stringerThickness*2 - 100*2, 0);
					//flanPar.pointStartSvg = copyPoint(par.stepPoints[0]);

					flanPar.marshId = getMarshParams(par.marshId).prevMarshId;
					if (params.stairModel == "П-образная с забегом" && par.marshId == 3) flanPar.marshId  = 2
					flanPar.pointCurrentSvg = newPoint_xy(pointCurrentSvgTmp, params.stringerThickness * 2 + 100, 0);
					flanPar.pointStartSvg = copyPoint(pointStartSvgTmp);

					var plate1 = drawMonoFlan(flanPar).mesh;
					plate1.position.x = plate.position.x - params.flanThickness - params.metalThickness;
					plate1.position.y = plate.position.y;
					plate1.position.z = plate.position.z;
					if (testingMode && turnFactor == -1 && params.stairModel == 'П-образная с забегом') {
						plate1.position.x -= 0.01;
					}
					plate1.rotation.y = -Math.PI / 2;
					par.flans.add(plate1);
				}
			
			//Верхние фланцы
			if (par.topEnd !== "пол" && params.model !== 'гнутый') {
					dxfBasePoint = newPoint_xy(par.dxfBasePoint, par.keyPoints.topPoint.x + 100, par.keyPoints.topPoint.y)

					if (par.topConnection || params.stairModel == "П-образная с площадкой") {
					//dxfBasePoint.y -= dxfStep;
					var flanPar = {
						marshId: par.marshId,
						type: "join", 
						pointsShape: par.pointsShape, 
						dxfBasePoint: dxfBasePoint,
						name: "Фланец площадки крепления к стене",
						marshIdFix: marshParams.nextMarshId,
					};
					//если соединение к стене
					if (par.topConnection) {
						flanPar.marshIdFix = 2;
						if (par.topEnd === "забег") flanPar.height = 215.0;
						flanPar.noBolts = true; //болты не добавляются
						flanPar.isCentralHoles = true; //отверстия в центре
						flanPar.pointCurrentSvg = newPoint_xy(par.stepPoints[par.stepPoints.length - 1], 100, 0);
						flanPar.pointStartSvg = copyPoint(par.stepPoints[0]);
						if (par.isBigFloor) flanPar.pointStartSvg = copyPoint(par.pointsShape[2]);// при большой разнице чистового и чернового пола


						var flan = drawMonoFlan(flanPar).mesh;
						flan.position.x = sidePlate2.position.x + par.pointsShape[par.pointsShape.length - 2].x;
						flan.position.y = sidePlate2.position.y + par.pointsShape[par.pointsShape.length - 2].y;

						par.flans.add(flan);
						if (window.customDimensions && window.customDimensions.length > 0) {
							if (params.stairModel.indexOf('Г-') != -1 || params.stairModel.indexOf('П-') != -1 && par.marshId == 2) {
								window.customDimensions.push({
									basePoint: {
										x: 0,
										y: 0,
										z: 0
									},
									target: flan,
									axises: ['x', 'y']
								});
							}else{
								window.customDimensions.push({
									basePoint: {
										x: -params.floorHoleLength,
										y: 0,
										z: 0
									},
									target: flan,
									axises: ['y', 'z']
								});
							}
						}
						
						//фланец-заглушка
						var flanPar = {
							marshId: par.marshId,
							type: "joinStub",
							pointsShape: par.pointsShape,
							dxfBasePoint: dxfBasePoint,
						};
						if (par.topEnd === "забег") flanPar.height = 215 - params.metalThickness * 2 - 5 - 2;
						if (par.topEnd === "площадка") flanPar.height = params.stringerThickness - params.metalThickness * 2 - 5 - 2;
						flanPar.pointCurrentSvg = newPoint_xy(par.stepPoints[par.stepPoints.length - 1], 100, 0);
						flanPar.pointStartSvg = copyPoint(par.stepPoints[0]);
						if (par.isBigFloor) flanPar.pointStartSvg = copyPoint(par.pointsShape[2]);// при большой разнице чистового и чернового пола


						var flan = drawMonoFlan(flanPar).mesh;
						flan.position.x = sidePlate2.position.x + par.pointsShape[par.pointsShape.length - 2].x - params.flanThickness;
						flan.position.y = sidePlate2.position.y + par.pointsShape[par.pointsShape.length - 2].y + params.metalThickness + 1;
						par.flans.add(flan);
					}
					
					//если соединение косоуров
                    if (!par.topConnection && params.stairModel !== 'П-образная с площадкой') {
                        flanPar.type = "joinStub";
                        flanPar.name = "Фланец площадки соединения косоуров";
                        flanPar.height = params.stringerThickness - params.metalThickness * 2 - 5;
                        //flanPar.holeY = 25;
                        flanPar.noBolts = true; //болты в первом фланце не добавляются
                        flanPar.isBolts = true; //болты в первом фланце добавляются с шестигрн.
                        flanPar.pointCurrentSvg = newPoint_xy(par.stepPoints[par.stepPoints.length - 1], 100, 0);
                        flanPar.pointStartSvg = copyPoint(par.stepPoints[0]);
						var flan = drawMonoFlan(flanPar).mesh;
                        flan.position.x = sidePlate2.position.x + par.pointsShape[par.pointsShape.length - 2].x - params.flanThickness;
                        flan.position.y = sidePlate2.position.y + par.pointsShape[par.pointsShape.length - 2].y + params.metalThickness;
						par.flans.add(flan);

						//усиливающий фланец
                        flanPar.noBolts = true; //болты не добавляются
                        flanPar.isBolts = false; //болты во втором фланце не добавляются
                        flanPar.dxfBasePoint.x += params.stringerThickness + 100; 
                        flanPar.pointCurrentSvg = newPoint_xy(par.stepPoints[par.stepPoints.length - 1], 100, 0);
                        flanPar.pointStartSvg = copyPoint(par.stepPoints[0]);
						var flan2 = drawMonoFlan(flanPar).mesh;
                        flan2.position.x = flan.position.x + params.flanThickness + params.metalThickness + 0.1;
                        flan2.position.y = flan.position.y;
						par.flans.add(flan2);
					}
					if (!par.topConnection && params.stairModel == 'П-образная с площадкой' && par.marshId == 1) {
                        var pointId = par.pointsShape.length - 2;
						var platePar = {
								isLong: false,
								marshId: par.marshId,
								plateId: 0,
								stairAngle1: par.marshAngle,
								//stringerWidth: params.stringerWidth + params.metalThickness * 2,
								dxfArr: dxfPrimitivesArr,
								dxfBasePoint: par.dxfBasePoint,
								height: params.stringerThickness - 20 - 5 - params.metalThickness * 2, //пластина рисуется на 20мм длиннее
								}
						
							var plate = drawFrontPlate(platePar).mesh; //функция в drawCarcasParts.js
							plate.rotation.y = -Math.PI / 2;
							plate.position.x += sidePlate2.position.x + par.pointsShape[pointId - 1].x;
							plate.position.y += sidePlate2.position.y + par.pointsShape[pointId - 1].y - 5 - params.metalThickness;
							plate.position.z += sidePlate2.position.z + params.metalThickness;
						
							par.mesh2.add(plate)
					}
				}else {
					//Фланец соединения косоуров
					if (par.topEnd == 'площадка' && !par.lastMarsh) {
						var flanPar = {
                            type: "joinStub",
							pointsShape: par.pointsShape, 
                            dxfBasePoint: dxfBasePoint,
                            name: "Фланец площадки соединения косоуров",
                        };
					    flanPar.height = params.stringerThickness - params.metalThickness * 2 - 5;
                        //flanPar.holeY = 25;
					    flanPar.noBolts = true; //болты в первом фланце не добавляются
                        flanPar.isBolts = true; //болты в первом фланце добавляются с шестигрн.
					    flanPar.pointCurrentSvg = newPoint_xy(par.stepPoints[par.stepPoints.length - 1], 100, 0);
					    flanPar.pointStartSvg = copyPoint(par.stepPoints[0]);
						var flan = drawMonoFlan(flanPar).mesh;
                        flan.position.x = sidePlate2.position.x + par.pointsShape[par.pointsShape.length - 2].x - params.flanThickness;
                        flan.position.y = sidePlate2.position.y + par.pointsShape[par.pointsShape.length - 2].y + params.metalThickness;
						par.flans.add(flan);
						
						//усиливающий фланец
                        flanPar.noBolts = true; //болты не добавляются
                        flanPar.isBolts = false; //болты во втором фланце не добавляются
					    flanPar.pointCurrentSvg = newPoint_xy(par.stepPoints[par.stepPoints.length - 1], 100, 0);
					    flanPar.pointStartSvg = copyPoint(par.stepPoints[0]);
						var flan2 = drawMonoFlan(flanPar).mesh;
					    flan2.position.x = flan.position.x + params.flanThickness + params.metalThickness + 0.1;
                        flan2.position.y = flan.position.y;
						par.flans.add(flan2);
					}
					//Фланец крепления к перекрытию
					if (par.topEnd == 'площадка' && par.lastMarsh) {
						var flanPar = {
							marshId: par.marshId,
							type: "top", 
							pointsShape: par.pointsShape, 
                            dxfBasePoint: dxfBasePoint,
                            name: "Фланец крепления к перекрытию",
						};

						flanPar.pointCurrentSvg = newPoint_xy(par.stepPoints[par.stepPoints.length - 1], 50, 0);
						flanPar.pointStartSvg = copyPoint(par.stepPoints[0]);
						if (par.isBigFloor && par.marshId == 1) flanPar.pointStartSvg = copyPoint(par.pointsShape[2]);// при большой разнице чистового и чернового пола
		
						var flan = drawMonoFlan(flanPar).mesh;
						flan.position.x = sidePlate2.position.x + par.pointsShape[par.pointsShape.length - 2].x;
						flan.position.y += sidePlate2.position.y + par.pointsShape[par.pointsShape.length - 2].y + params.stringerThickness;// -flanParams.height +holOffZapTop;
		
						par.flans.add(flan);
		
						//верхний фланец-заглушка
						dxfBasePoint.y -= dxfStep;
						var flanPar = {
							marshId: par.marshId,
							type: "topStub",
							pointsShape: par.pointsShape,
							dxfBasePoint: dxfBasePoint,
						};
						flanPar.pointCurrentSvg = newPoint_xy(par.stepPoints[par.stepPoints.length - 1], 50 + params.stringerThickness, 0);
						flanPar.pointStartSvg = copyPoint(par.stepPoints[0]);
						if (par.isBigFloor && par.marshId == 1) flanPar.pointStartSvg = copyPoint(par.pointsShape[2]);// при большой разнице чистового и чернового пола
		
						var flan = drawMonoFlan(flanPar).mesh;
						flan.position.x = sidePlate2.position.x + par.pointsShape[par.pointsShape.length - 2].x - params.flanThickness;
						flan.position.y += sidePlate2.position.y + par.pointsShape[par.pointsShape.length - 2].y + params.stringerThickness;// + params.metalThickness;// -flan2Params.height -offsetY -params.metalThickness;
		
						par.flans.add(flan);
					}
					//Забег оканчивается не в другом каркасе, по этому заглушка
					if (par.topEnd == 'забег') {
						var pointId = par.pointsShape.length - 2;
						var platePar = {
								isLong: false,
								marshId: par.marshId,
								plateId: 0,
								stairAngle1: par.marshAngle,
								dxfArr: dxfPrimitivesArr,
								dxfBasePoint: dxfBasePoint,
								height: 215 - 20 - 5, //пластина рисуется на 20мм длиннее
								isBack: true,
						}
						platePar.pointCurrentSvg = newPoint_xy(par.pointsShape[pointId - 1], params.stringerThickness, 0);
						platePar.pointStartSvg = copyPoint(par.pointsShape[0]);
						if (par.isBigFloor) flanPar.pointStartSvg = copyPoint(par.pointsShape[2]);// при большой разнице чистового и чернового пола
						
							var plate = drawFrontPlate(platePar).mesh; //функция в drawCarcasParts.js
							plate.rotation.y = -Math.PI / 2;
							plate.position.x += sidePlate2.position.x + par.pointsShape[pointId - 1].x;
							plate.position.y += sidePlate2.position.y + par.pointsShape[pointId - 1].y;
							plate.position.z += sidePlate2.position.z + params.metalThickness;
						
							par.mesh2.add(plate)
					}	
				}
			}
			if (par.topEnd == "пол") {
				dxfBasePoint = newPoint_xy(par.dxfBasePoint, par.keyPoints.topPoint.x + 100, par.keyPoints.topPoint.y)

				var flanPar = {
					marshId: par.marshId,
					type: "top", 
					pointsShape: par.pointsShape,
                    dxfBasePoint: dxfBasePoint,
					name: "Фланец крепления к перекрытию",
				};
				flanPar.pointCurrentSvg = newPoint_xy(par.stepPoints[par.stepPoints.length - 1], 50, 0);
				flanPar.pointStartSvg = copyPoint(par.stepPoints[0]);
				if (par.isBigFloor) flanPar.pointStartSvg = copyPoint(par.pointsShape[2]);// при большой разнице чистового и чернового пола

				var flan = drawMonoFlan(flanPar).mesh;
				flan.position.x = sidePlate2.position.x + par.pointsShape[par.pointsShape.length - 2].x;
				flan.position.y += sidePlate2.position.y + par.pointsShape[par.pointsShape.length - 2].y;// -flanParams.height +holOffZapTop;

				par.flans.add(flan);
				
				if (window.customDimensions && window.customDimensions.length > 0) {
					window.customDimensions.push({
						basePoint: {
							x: 0,
							y: 0,
							z: 0
						},
						target: flan,
						axises: ['z', 'y'],
						basePlane: 'yz'
					});
				}

				//верхний фланец-заглушка
				//dxfBasePoint.y -= dxfStep;
				var flanPar = {
					marshId: par.marshId,
					type: "topStub", 
					pointsShape: par.pointsShape,
					dxfBasePoint: dxfBasePoint,
				};
				flanPar.pointCurrentSvg = newPoint_xy(par.stepPoints[par.stepPoints.length - 1], 50, 0);
				flanPar.pointStartSvg = copyPoint(par.stepPoints[0]);

				var flan = drawMonoFlan(flanPar).mesh;
				flan.position.x = sidePlate2.position.x + par.pointsShape[par.pointsShape.length - 2].x - params.flanThickness;
				flan.position.y += sidePlate2.position.y + par.pointsShape[par.pointsShape.length - 2].y;// -flan2Params.height -offsetY -params.metalThickness;

				par.flans.add(flan);
			}

			//Соединительные фланцы
			if (par.pDivideBot) {
				dxfBasePoint = newPoint_xy(par.dxfBasePoint, par.pDivideBot.x + 100, par.pDivideBot.y);

				var flanPar = {
					marshId: par.marshId,
					length: par.stringerWidth - params.metalThickness * 2,
					width: distance(par.pDivideBot, par.pDivideTop),
					dxfBasePoint: dxfBasePoint,
					dxfArr: dxfPrimitivesArr,
					ang: marshParams.ang, 
					thk: 8,
					name: "Фланец соединения косоуров",
				};
				var dx = flanPar.thk / Math.tan(marshParams.ang) + params.metalThickness / Math.sin(marshParams.ang)
				flanPar.width -= params.metalThickness + dx;
				flanPar.pointCurrentSvg = newPoint_xy(par.pDivideBot, 50, 0);
				flanPar.pointStartSvg = copyPoint(par.stepPoints[0]);
				if (par.isBigFloor) flanPar.pointStartSvg = copyPoint(par.pointsShape[2]);// при большой разнице чистового и чернового пола

				var flan = drawDivideFlans(flanPar).mesh;
				var pt = newPoint_xy(par.pDivideBot, -dx, 0);
				flan.position.x = sidePlate2.position.x + pt.x;
				flan.position.y += sidePlate2.position.y + pt.y;
				flan.rotation.z = Math.PI / 2;

				par.flans.add(flan);
			}

			if (pointCurrentSvgTmp1) {
		        pointCurrentSvgTmp = copyPoint(pointCurrentSvgTmp1);
		        pointStartSvgTmp = copyPoint(pointStartSvgTmp1);
	        }
        }
	
		if (params.model == "труба") {
			par.dxfBasePoint = copyPoint(dxfBasePoint0);
			var dxfBasePoint = newPoint_xy(dxfBasePoint0, 0, -1000);
			var dxfStep = 200;
			//нижний фланец
			if (par.botEnd == "пол") {
				dxfBasePoint.y -= dxfStep;
                var flanPar = {
                    marshId: par.marshId,
                    name: "Фланец крепления к полу",
					dxfBasePoint: dxfBasePoint, //базовая точка для вставки контуров в dxf файл    
					isBotFloor: true,
					};
				
				var ang = calcAngleX1(par.pointsShape[0], par.pointsShape[par.pointsShape.length - 1]);

				flanPar.heightPipe = params.profileHeight / Math.sin(ang);
				flanPar.height = flanPar.heightPipe + (par.pointsShape[0].x - par.pointsShape[1].x);
				flanPar.height += - params.sidePlateOverlay / Math.sin(ang) - (params.flanThickness - 3) / Math.tan(ang) + params.treadPlateThickness;
				flanPar.heightPipe += 1;

				//при большой разнице чистового и чернового пола
				if (par.isBotFloorsDist) {
					flanPar.heightPipe = params.profileHeight;
					flanPar.height = flanPar.heightPipe + (par.pointsShape[1].x - par.pointsShape[2].x);
					flanPar.height += - params.sidePlateOverlay;
					flanPar.heightPipe += 1;
					flanPar.height += 2;
				}

				var flan = drawFlanPipeBot(flanPar).mesh;
				flan.position.x = sidePlate2.position.x + params.treadPlateThickness;
				flan.position.z = sidePlate2.position.z + (flanPar.width + flanPar.widthPipe) / 2 + 3;
				flan.position.y = sidePlate2.position.y + params.flanThickness;
				flan.rotation.x = -Math.PI / 2;
				flan.rotation.y = Math.PI;
				flan.rotation.z = Math.PI / 2;

				par.flans.add(flan);
			}

			if (par.botEnd !== "пол") {
				if (!par.botConnection || par.botEnd === "забег") {
					//фланец площадки соединения косоуров
					dxfBasePoint.y -= dxfStep;
                    var flanPar = {
                        marshId: par.marshId,
                        name: "Фланец площадки соединения косоуров",
						dxfBasePoint: dxfBasePoint, //базовая точка для вставки контуров в dxf файл
				};
					flanPar.isWndTurn = false; //является ли поворот забежным
					if (par.botEnd == "забег") {
						flanPar.heightPipe = params.profileHeight + 1;
						flanPar.isWndTurn = true;
						//сдвигаем 3 отверстие чтобы болт не пересекался с трубой
						flanPar.offsetTopWndHoleY3 = 0;
						if (par.offsetTopWndHoleY3) flanPar.offsetTopWndHoleY3 = par.offsetTopWndHoleY3;
					}
					flanPar.isBolts = true; //добавляем болты

					flanPar = drawFlanPipeBot(flanPar);
				
					var flan = flanPar.mesh;
					//левый верхний угол накладки
					var topLeftPt = copyPoint(par.pointsShape[2]);
					if (par.botEnd === "забег" && par.isKinkBot) topLeftPt = copyPoint(par.pointsShape[3]);
					if (par.botEnd === "забег" && par.topEnd == "пол" && par.stairAmt == 1) topLeftPt = copyPoint(par.pointsShape[2]);
					if (par.botEnd === "забег" && par.topEnd == 'забег' && params.stairModel !== 'П-образная трехмаршевая') topLeftPt = copyPoint(par.pointsShape[2]);
					if (par.botEnd === "площадка") topLeftPt.y += params.treadPlateThickness;

					flan.position.x = sidePlate2.position.x - params.flanThickness + topLeftPt.x;
					flan.position.y = sidePlate2.position.y + topLeftPt.y;// + 60 + params.sidePlateOverlay + par.pointsShape[2].x;
					flan.position.z = sidePlate2.position.z - flanPar.width / 2 + params.profileWidth / 2 + params.metalThickness;
					flan.rotation.z = Math.PI;
					flan.rotation.y = Math.PI / 2;
					par.flans.add(flan);
				}else {
					//Фланец соединения промежуточной площадки к стене
					dxfBasePoint.y -= dxfStep;
					var flanPar = {
						type: "joinProf", //ширина фланца
						pointsShape: par.pointsShape,
						stringerHeight: par.pointsShape[1].y - par.pointsShape[2].y,
                        dxfBasePoint: dxfBasePoint,
						marshId: par.marshId,
						name: "Фланец площадки крепления к стене",
						marshIdFix: marshParams.prevMarshId,
					};
					if (params.stairModel == 'П-образная с площадкой') flanPar.marshIdFix = 2;

					flanPar.topEnd = "площадка";
					var flan = drawMonoFlan(flanPar).mesh;
					flan.position.x = sidePlate2.position.x + par.pointsShape[1].x - params.flanThickness;
					flan.position.y = sidePlate2.position.y + par.pointsShape[1].y - flanPar.height - (par.pointsShape[1].y - par.pointsShape[2].y);
					par.flans.add(flan);

					//верхняя пластина-------------------------------------------
					dxfBasePoint.x += 300;
					var deltaLen = 8;//Сдвиг к стене, чтобы закрыть фланец.
					//var len = par.lengthBturn1;
					var len = (params.M - (params.stringerThickness + params.M / 3)) / 2;
					if (par.botEnd == 'площадка') len = params.M / 2 - (params.M - 300) / 2;
					if (params.stairModel == 'П-образная с площадкой') len = 125;
					var width = params.stringerThickness - 8;

					var p0 = { x: 0, y: 0 }
					var p1 = newPoint_xy(p0, width, 0);
					var p2 = newPoint_xy(p1, 0, len)
					var p3 = newPoint_xy(p2, -width, 0)

					var shape = new THREE.Shape();

					addLine(shape, dxfPrimitivesArr, p0, p1, dxfBasePoint, 'carcas');
					addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint, 'carcas');
					addLine(shape, dxfPrimitivesArr, p2, p3, dxfBasePoint, 'carcas');
					addLine(shape, dxfPrimitivesArr, p3, p0, dxfBasePoint, 'carcas');

					var thickness = 4;
					var extrudeOptions = {
						amount: thickness,
						bevelEnabled: false,
						curveSegments: 12,
						steps: 1
					};
					var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
					geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
					var flan = new THREE.Mesh(geometry, params.materials.metal2);
					flan.position.x = sidePlate2.position.x + par.pointsShape[2].x;
					flan.position.y = sidePlate2.position.y + par.pointsShape[2].y;
					flan.position.z = width / 2;
					flan.rotation.x = Math.PI / 2;
					flan.rotation.z = -Math.PI / 2;
					par.flans.add(flan);
				}
			}
			
			//верхний фланец
			if (par.topEnd !== "пол") {
				if (par.topConnection) {
					//Фланец соединения промежуточной площадки к стене
					var i = par.pointsShape.length - 2;
					if (par.topEnd === "забег") i = par.pointsShape.length - 3;
					//if (par.topEnd === "забег" && (par.stairAmt <= 2 && par.botEnd == "пол")) i = par.pointsShape.length - 2;
					if (par.topEnd === "забег" && !par.isKinkTop) i = par.pointsShape.length - 2;
					dxfBasePoint.y -= dxfStep;
					var flanPar = {
						type: "joinProf", //ширина фланца
						pointsShape: par.pointsShape,
						stringerHeight: par.pointsShape[i].y - par.pointsShape[i - 1].y,
						dxfBasePoint: dxfBasePoint,
						marshId: par.marshId,
						name: "Фланец площадки крепления к стене",
						marshIdFix: marshParams.nextMarshId,
					};
					if (params.stairModel == 'П-образная с площадкой' && par.marshId == 1)
						flanPar.marshIdFix = 2;

					flanPar.topEnd = par.topEnd;

					var flan = drawMonoFlan(flanPar).mesh;
					flan.position.x = sidePlate2.position.x + par.pointsShape[i].x;
					flan.position.y += sidePlate2.position.y + par.pointsShape[i].y - flanPar.height - (par.pointsShape[i].y - par.pointsShape[i - 1].y);
					par.flans.add(flan);

					//верхняя пластина
					dxfBasePoint.x += 300;
					var deltaLen = 8;//Сдвиг к стене, чтобы закрыть фланец.
					//var len = par.lengthBturn1;
					var len = (params.M - (params.stringerThickness + params.M / 3)) / 2;
					if (par.topEnd == 'площадка') len = params.M / 2 - (params.M - 300) / 2;
					if (params.stairModel == 'П-образная с площадкой' && par.marshId == 1) len = 125;
					var width = params.stringerThickness - 8;

					var p0 = {x: 0, y: 0}
					var p1 = newPoint_xy(p0, width, 0);
					var p2 = newPoint_xy(p1, 0, len)
					var p3 = newPoint_xy(p2, -width, 0)

					var shape = new THREE.Shape();

					addLine(shape, dxfPrimitivesArr, p0, p1, dxfBasePoint, 'carcas');
					addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint, 'carcas');
					addLine(shape, dxfPrimitivesArr, p2, p3, dxfBasePoint, 'carcas');
					addLine(shape, dxfPrimitivesArr, p3, p0, dxfBasePoint, 'carcas');

					var thickness = 4;
					var extrudeOptions = {
						amount: thickness,
						bevelEnabled: false,
						curveSegments: 12,
						steps: 1
					};
					var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
					geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
					var flan = new THREE.Mesh(geometry, params.materials.metal2);
					flan.position.x = sidePlate2.position.x + par.pointsShape[i].x - len;
					flan.position.y = sidePlate2.position.y + par.pointsShape[i - 1].y;
					flan.position.z = width / 2;
					flan.rotation.x = Math.PI / 2;
					flan.rotation.z = -Math.PI / 2;
					par.flans.add(flan);
					
				}else {
					dxfBasePoint.y -= dxfStep;
					if (par.topEnd == 'забег') {
						var pointId = par.pointsShape.length - 3;
						var platePar = {
								isLong: false,
								marshId: par.marshId,
								plateId: 0,
								stairAngle1: par.marshAngle,
								//stringerWidth: params.stringerWidth + params.metalThickness * 2,
								dxfArr: dxfPrimitivesArr,
								dxfBasePoint: par.dxfBasePoint,
								//height: -par.pointsShape[pointId].y + par.pointsShape[pointId - 1].y - params.sidePlateOverlay - 20, //20 не пойму где прибавляется
								height: par.pointsShape[pointId].y - par.pointsShape[pointId + 1].y - 20, //20 не пойму где прибавляется
						}
							platePar.pointCurrentSvg = copyPoint(par.stepPoints[i]);
							platePar.pointStartSvg = copyPoint(par.stepPoints[0]);
							
							var plate = drawFrontPlate(platePar).mesh; //функция в drawCarcasParts.js
							plate.rotation.y = -Math.PI / 2;
							//plate.position.x += sidePlate2.position.x + par.pointsShape[pointId - 1].x;
							//plate.position.y += sidePlate2.position.y + par.pointsShape[pointId - 1].y;
							plate.position.x += sidePlate2.position.x + par.pointsShape[pointId].x;
							plate.position.y += sidePlate2.position.y + par.pointsShape[pointId].y;
							plate.position.z += sidePlate2.position.z + params.metalThickness;
							
							par.mesh2.add(plate)
					}	
					if (par.topEnd !== 'забег') {
						//фланец площадки соединения косоуров
						var flanPar = {
							dxfBasePoint: dxfBasePoint, //базовая точка для вставки контуров в dxf файл
						};
						flanPar.isBolts = true; //добавляем болты
						
						flanPar = drawFlanPipeBot(flanPar);
						
						var flan = flanPar.mesh;
						var i = par.pointsShape.length - 2;
						flan.position.x = sidePlate2.position.x + par.pointsShape[i].x + params.flanThickness;
						flan.position.y = sidePlate2.position.y + par.pointsShape[i].y + 6 + flanPar.height - flanPar.heightPipe + 1;// + 60 +  + ;
						flan.position.y = sidePlate2.position.y + par.pointsShape[i - 1].y + params.treadPlateThickness;// + 60 +  + ;
						// flan.position.z = sidePlate2.position.z + 160 + params.flanThickness / 2 + 1;
						flan.position.z = sidePlate2.position.z + params.metalThickness + params.profileWidth + flanPar.holeX * 2 + 1;// 1 отступ от края отверстия
						flan.rotation.z = Math.PI;
						flan.rotation.y = -Math.PI / 2;
						par.flans.add(flan);
					}
				}
			}
			
			if (par.topEnd == "пол") {
				//Верхний фланец соединения верхнего марша к стене
				dxfBasePoint.y -= dxfStep;
				var flanPar = {
					pointsShape: par.pointsShape,
                    dxfBasePoint: newPoint_xy(dxfBasePoint, 0, -300), //базовая точка для вставки контуров в dxf файл
					marshId: par.marshId,
                    name: "Фланец крепления к перекрытию",
				};

				var dy = 0;
				if (params.topAnglePosition === "над ступенью") dy = params.topHolePos + params.treadThickness + 20;

				flanPar.marshAngle = par.marshAngle;

				flanPar = drawFlanPipeTop(flanPar);

				var flan = flanPar.mesh;
				flan.position.x = sidePlate2.position.x + par.pointsShape[par.pointsShape.length - 2].x + 0.01;
				flan.position.y = sidePlate2.position.y + par.pointsShape[par.pointsShape.length - 2].y - flanPar.height + dy;
				flan.position.z += sidePlate2.position.z + params.profileWidth / 2 + params.metalThickness;
				par.flans.add(flan);
			}			
		}
	}
	
	/*Опоры*/

	par.dxfBasePoint.y = -8000;
	par.dxfBasePoint.x += 500;
	
	var unitsPos = par.unitsPosObject.turn1; //Точка поворота марша
	if (par.marshId == 2 && params.stairModel == 'П-образная с забегом') unitsPos = par.unitsPosObject.turn2;
	if (par.marshId == 3 && params.stairModel == 'П-образная с забегом') unitsPos = par.unitsPosObject.marsh3;
	if (par.marshId == 3 && params.stairModel == 'П-образная с площадкой') unitsPos = par.unitsPosObject.turn1;
	if (par.marshId == 2 && params.stairModel == 'П-образная трехмаршевая') unitsPos = par.unitsPosObject.marsh2;
	if (par.marshId == 3 && params.stairModel == 'П-образная трехмаршевая') unitsPos = par.unitsPosObject.marsh3;
	
	/*Опоры*/
	var columnParams_all = {
		pointsShape: par.pointsShape,
		marshId: par.marshId,
		columnHoles: columnHoles,
		unitsPos: unitsPos
	};
    calcColumnParams(columnParams_all, par);

    var countColon = 0;
	var isSvgBot = true;
	for (var i = 0; i < columnParams_all.columns.length; i++) {
		if (columnParams_all.columns[i].type == "колонна" && columnParams_all.columns[i].isVisible)
			countColon += 1;
	}
   // if (par.marshId == 1) {
   //     //isSvgBot = true;
   //     for (var i = 0; i < columnParams_all.columns.length; i++) {
			//if (columnParams_all.columns[i].type == "колонна" && columnParams_all.columns[i].isVisible)
			//	countColon += 1;
   //     }
   // }

    //Параметры колонны
    var columnParams = {
        profSize: columnParams_all.profSize,
        dxfArr: dxfPrimitivesArr,
        dxfBasePoint: par.dxfBasePoint,
        marshId: par.marshId,
        countColon: countColon,
		isSvgBot: isSvgBot,
		stringerLedge: par.stringerLedge,
    }


    for (var i = 0; i < columnParams_all.columns.length; i++) {
		var currentColumn = columnParams_all.columns[i];//Текущая колонна
		if (currentColumn.isVisible) {
			columnParams.topAngle = currentColumn.topAngle;
			columnParams.length = currentColumn.length;
			columnParams.type = currentColumn.type;
			columnParams.topFlan = true;

			column = drawColumn(columnParams).mesh;
			column.position.x += sidePlate2.position.x + currentColumn.position.x;
			column.position.y += sidePlate2.position.y + currentColumn.position.y;
			if (currentColumn.position.z) column.position.z -= currentColumn.position.z;
			if (currentColumn.rotation) column.rotation.y += currentColumn.rotation;
            par.mesh2.add(column);
			columnParams.isSvgBot = false;

			// отрисовываем оси крепления верхнего фланца опоры к профилю
			var pc = copyPoint(currentColumn.position);
			pc = polar(pc, currentColumn.topAngle, -8 * Math.tan(currentColumn.topAngle));
			var lenFlan = columnParams.profSize / Math.cos(columnParams.topAngle) + 100; //длина верхнего фланца опоры
			var pc1 = polar(pc, currentColumn.topAngle, (lenFlan / 2 - 20));
			var pc2 = polar(pc, currentColumn.topAngle, -(lenFlan / 2 - 20));

			var pt1 = polar(pc1, Math.PI / 2 + currentColumn.topAngle, -150);
			var pt2 = polar(pc1, Math.PI / 2 + currentColumn.topAngle, 150);
			var pt3 = polar(pc2, Math.PI / 2 + currentColumn.topAngle, -150);
			var pt4 = polar(pc2, Math.PI / 2 + currentColumn.topAngle, 150);

			var shape = new THREE.Shape();
			addLine(shape, dxfPrimitivesArr, pt1, pt2, dxfBasePoint1);
			addLine(shape, dxfPrimitivesArr, pt3, pt4, dxfBasePoint1);

			par.dxfBasePoint.x += 400;
		}
	}
	
	//линия между верхней и нижней точками
	var stringerLen = 0;
	if(par.keyPoints.botPoint && par.keyPoints.topPoint){
		var trashShape = new THREE.Shape();
		var layer = "comments";
		addLine(trashShape, dxfPrimitivesArr, par.keyPoints.botPoint, par.keyPoints.topPoint, dxfBasePoint0, layer);
		stringerLen = distance(par.keyPoints.botPoint, par.keyPoints.topPoint);
		}
		
	//сохраняем данные для спецификации	
	var partName = "stringer";
	if (typeof specObj != 'undefined'){
		if (!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				sumLength: 0,
				name: "Косоур ",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
			}
		}
		var name = par.marshId + " марш L=" + Math.round(stringerLen);
		var area = stringerLen * (300 * 2 + params.stringerThickness * 2.5) / 1000000;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		specObj[partName]["sumLength"] += stringerLen / 1000;		
	}
	par.mesh2.specId = partName + name;

	par.dxfBasePoint = copyPoint(dxfBasePoint2);

	return par;
}

function drawTurnStringerCurve(par) {
	par.mesh1 = new THREE.Object3D();

	//именованные ключевые точки
	if (!par.keyPoints) par.keyPoints = {};
	if (!par.keyPoints[par.key]) par.keyPoints[par.key] = {};
	par.keyPoints[par.key].zeroPoint = { x: 0, y: 0 };
	par.zeroPoint = { x: 0, y: 0 };

	//рассчитываем параметры косоура по номеру марша
	calcStringerPar(par);

	//боковые накладки косоура

	var extrudeOptions = {
		amount: params.metalThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var pointsTurn = par.turnPointsCurve["out"].pointsTurn
	pointsTurn.unshift(newPoint_xy(pointsTurn[0], 0, -par.turnPointsCurve["out"].startTurnY))
	pointsTurn.push(newPoint_xy(pointsTurn[pointsTurn.length - 1], 0, -par.turnPointsCurve.endTurnY))

	var pointsTurn = par.turnPointsCurve["in"].pointsTurn
	pointsTurn.unshift(newPoint_xy(pointsTurn[0], 0, -par.turnPointsCurve["in"].startTurnY))
	pointsTurn.push(newPoint_xy(pointsTurn[pointsTurn.length - 1], 0, -par.turnPointsCurve.endTurnY))

	//первая накладка

	par.key = "in";
	if (turnFactor == -1) par.key = "out";

	var pointsTurn = par.turnPointsCurve[par.key].pointsTurn;
	var shapePar = {
		points: pointsTurn,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
	}
	drawShapeByPoints2(shapePar);

	par.dxfBasePoint.x += pointsTurn[pointsTurn.length - 1].x - pointsTurn[0].x + 1000;


	var obj = new THREE.Object3D();
	var pointsShapes = calcTurnPointsShapes(par.turnPointsCurve[par.key].pointsTurn)

	var shapePar = {
		points: [],
		dxfArr: [],
		dxfBasePoint: par.dxfBasePoint,
	}

	var ang = Math.PI / 2 / (pointsShapes.length - 1) * turnFactor;
	var z = 0
	var x = 0


	for (var i = 0; i < pointsShapes.length; i++) {
		var moovePoints = moovePointsToP0X(pointsShapes[i])
		shapePar.points = moovePoints.points;

		var shape = drawShapeByPoints2(shapePar).shape;

		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var sidePlate = new THREE.Mesh(geom, params.materials.metal);

		sidePlate.position.z = z;
		sidePlate.position.x = x;
		//if (i > 0) {
		//	sidePlate.position.z += params.metalThickness - params.metalThickness * Math.cos(ang*i)
		//	sidePlate.position.x += params.metalThickness * Math.sin(ang*i)
		//} 			


		sidePlate.rotation.y = -ang * i;
		obj.add(sidePlate)

		if (i == 0) {
			x = moovePoints.len;
		}
		if (i > 0) {
			x += moovePoints.len * Math.cos(ang * i)
			z += moovePoints.len * Math.sin(ang * i)
		}
	}

	obj.position.z = params.stringerThickness / 2 - params.metalThickness;
	obj.position.x = par.turnPointsCurve.pointInsertTurn.x;
	obj.position.y = par.turnPointsCurve.pointInsertTurn.y;
	par.mesh1.add(obj);

	//вторая накладка-------------------------------------------------
	par.key = "out";
	if (turnFactor == -1) par.key = "in";

	var pointsTurn = par.turnPointsCurve[par.key].pointsTurn;
	var shapePar = {
		points: pointsTurn,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
	}
	drawShapeByPoints2(shapePar);

	par.dxfBasePoint.x += pointsTurn[pointsTurn.length - 1].x - pointsTurn[0].x + 1000;

	var obj = new THREE.Object3D();
	var pointsShapes = calcTurnPointsShapes(par.turnPointsCurve[par.key].pointsTurn)

	var shapePar = {
		points: [],
		dxfArr: [],
		dxfBasePoint: par.dxfBasePoint,
	}

	var ang = Math.PI / 2 / (pointsShapes.length) * turnFactor;
	var z = 0
	var x = 0

	for (var i = 0; i < pointsShapes.length; i++) {
		var moovePoints = moovePointsToP0X(pointsShapes[i])
		shapePar.points = moovePoints.points;

		var shape = drawShapeByPoints2(shapePar).shape;

		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var sidePlate = new THREE.Mesh(geom, params.materials.metal);

		sidePlate.position.z = z;
		sidePlate.position.x = x;
		//if (i > 0) {
		//	sidePlate.position.z += params.metalThickness - params.metalThickness * Math.cos(ang * i)
		//	sidePlate.position.x += params.metalThickness * Math.sin(ang * i)
		//} 	

		sidePlate.rotation.y = -ang * (i + 1);
		obj.add(sidePlate)

		//if (i == 0) x = moovePoints.len;
		//if (i > 0) {
		//	x += moovePoints.len * Math.cos(ang * i)
		//	z += moovePoints.len * Math.sin(ang * i)
		//}
		x += moovePoints.len * Math.cos(ang * (i + 1))
		z += moovePoints.len * Math.sin(ang * (i + 1))
	}


	obj.position.z = -params.stringerThickness / 2;
	obj.position.x = par.turnPointsCurve.pointInsertTurn.x;
	obj.position.y = par.turnPointsCurve.pointInsertTurn.y;
	par.mesh1.add(obj);

	//нижняя пластина косоура-------------------------------------------------
	var points = par.turnPointsCurve['out'].pointsTurn

	var stringerParams = {
		//rad: params.staircaseDiam / 2 - params.M - 1,
		height: points[points.length - 1].y - points[0].y,
	}

	stringerParams = drawTurnBackCurve(stringerParams);
	var stringer = stringerParams.mesh;
	stringer.position.x = par.turnPointsCurve.pointInsertTurn.x;
	stringer.position.y = par.turnPointsCurve.pointInsertTurn.y;
	stringer.rotation.x = -Math.PI / 2;
	stringer.rotation.z = Math.PI / 2;
	if (turnFactor == -1) {
		stringer.rotation.x += Math.PI;
		stringer.rotation.x -= Math.PI;
	}

	stringer.position.z = params.M / 2 * turnFactor;
	stringer.position.y += points[0].y;
	par.mesh1.add(stringer);

}

/** функция отрисовывает косоур площадки*/

function drawPltStringer(par) {
	par.mesh1 = new THREE.Object3D();
	par.mesh2 = new THREE.Object3D();
	par.flans = new THREE.Object3D();
	par.treadPlates = new THREE.Object3D();

	var marshParams = getMarshParams(par.marshId);

	//par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, 5000);

	var extrudeOptions = {
		amount: params.metalThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};


	if (params.model == "сварной") {
		//боковые накладки косоура
		var text = "Боковые пластины косоура " + params.metalThickness + "мм. (2 ед.)";
		var textHeight = 25;
		var textBasePoint = newPoint_xy(par.dxfBasePoint, -20, -120);
		addText(text, textHeight, dxfPrimitivesArr, textBasePoint);

		var p0 = { x: 0, y: 0 };
		var p1 = newPoint_xy(p0, 0, params.stringerThickness);
		var p2 = newPoint_xy(p1, par.length, 0);
		var p3 = newPoint_xy(p2, 0, -params.stringerThickness);

		par.pointsShape = [p0, p1, p2, p3];

		var shapePar = {
			points: par.pointsShape,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: par.dxfBasePoint,
		}

		//отверстия для соединения косоуров
		var p = newPoint_xy(p2, - params.M / 2 + params.flanThickness, -params.stringerThickness / 2);
		if (params.carcasConfig == "002" || params.carcasConfig == "004") p.x += 50;
		if (par.stringerLedge) p.x -= par.stringerLedge;
		//var center1 = newPoint_xy(p, params.stringerThickness / 2 + 35.0, params.stringerThickness / 2 - 25);
		//var center2 = newPoint_xy(p, params.stringerThickness / 2 + 35.0, -params.stringerThickness / 2 + 25);
		//var center3 = newPoint_xy(p, -params.stringerThickness / 2 - 35.0, params.stringerThickness / 2 - 25);
        //var center4 = newPoint_xy(p, -params.stringerThickness / 2 - 35.0, -params.stringerThickness / 2 + 25);
	    var center1 = newPoint_xy(p, params.stringerThickness / 2 - 20 - params.metalThickness, params.stringerThickness / 2 - 20 - params.metalThickness - 5);
	    var center2 = newPoint_xy(p, params.stringerThickness / 2 - 20 - params.metalThickness, -params.stringerThickness / 2 + 20 + params.metalThickness);
	    var center3 = newPoint_xy(p, -params.stringerThickness / 2 + 20 + params.metalThickness, params.stringerThickness / 2 - 20 - params.metalThickness - 5);
	    var center4 = newPoint_xy(p, -params.stringerThickness / 2 + 20 + params.metalThickness, -params.stringerThickness / 2 + 20 + params.metalThickness);

		par.pointsHole = [];
		par.pointsHole.push(center1);
		par.pointsHole.push(center2);
		par.pointsHole.push(center3);
		par.pointsHole.push(center4);

		if (params.treadLigts !== 'нет') {
			var center5 = newPoint_xy(p, 0, - 5 / 2);
			center5.rad = radTreadLigts;
			par.pointsHole.push(center5);
		}

		var pointStartSvg = copyPoint(p0);
		var pointCurrentSvg = copyPoint(p0);

		//внутренняя накладка
		shapePar.drawing = {
			name: "Внутренняя накладка",
			group: "stringersPlatform",
			marshId: par.marshId1 ? par.marshId1 : par.marshId,
			pointCurrentSvg: copyPoint(pointCurrentSvg),
			pointStartSvg: pointStartSvg,
		}
		var shape1 = drawShapeByPoints2(shapePar).shape;
		par.stringerShape = shape1;
		if (!par.isNotHoles) drawStringerHoles(par);
		var geom = new THREE.ExtrudeGeometry(shape1, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var sidePlate1 = new THREE.Mesh(geom, params.materials.metal);

		//наружная накладка
		pointCurrentSvg.y -= params.stringerThickness + 100;
		shapePar.drawing = {
			name: "Наружная накладка",
			group: "stringersPlatform",
			marshId: par.marshId1 ? par.marshId1 : par.marshId,
			pointCurrentSvg: copyPoint(pointCurrentSvg),
			pointStartSvg: pointStartSvg,
		}
		shapePar.dxfBasePoint.y += params.stringerThickness + 50;
		var shape2 = drawShapeByPoints2(shapePar).shape;
		par.stringerShape = shape2;
		if (!par.isNotHoles) drawStringerHoles(par);
		var geom = new THREE.ExtrudeGeometry(shape2, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var sidePlate2 = new THREE.Mesh(geom, params.materials.metal);

		sidePlate1.position.y = sidePlate2.position.y = -params.stringerThickness;
		sidePlate1.position.z = params.stringerThickness / 2 - params.metalThickness;
		sidePlate2.position.z = -params.stringerThickness / 2;

		par.mesh1.add(sidePlate1);
		par.mesh1.add(sidePlate2);

		/*верхняя и нижняя пластина косоура*/
		var p0 = { x: 0, y: 0 };
		var p1 = newPoint_xy(p0, 0, params.stringerThickness - params.metalThickness * 2);
		var p2 = newPoint_xy(p1, par.length, 0);
		var p3 = newPoint_xy(p2, 0, -(params.stringerThickness - params.metalThickness * 2));

		var shapePar = {
			points: [p0, p1, p2, p3],
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: newPoint_xy(shapePar.dxfBasePoint, 0, params.stringerThickness + 50),
		}

		//верхняя пластина косоура
		pointCurrentSvg.y -= params.stringerThickness + 100;
		shapePar.drawing = {
			name: "Вехняя пластина",
			group: "stringersPlatform",
			marshId: par.marshId1 ? par.marshId1 : par.marshId,
			pointCurrentSvg: copyPoint(pointCurrentSvg),
			pointStartSvg: pointStartSvg,
		}
		if (!par.isTreadPlate) {
			var shapeTop = drawShapeByPoints2(shapePar).shape;

			//прямогуольные вырезы в верхней пластине для закрепления фланцев
			if (params.stairModel == "П-образная с площадкой") {
				if (!par.isReversBolt) {
					//первый прямогуольный вырез
					var pt = newPoint_xy(p0, -params.stringerThickness / 2 + params.M + params.marshDist, p1.y / 2);
					var pt1 = newPoint_xy(pt, - 100, -params.stringerThickness / 2 + 30);
					var pt2 = newPoint_xy(pt, - 100, params.stringerThickness / 2 - 30);
					var pt3 = newPoint_xy(pt, 100, params.stringerThickness / 2 - 30);
					var pt4 = newPoint_xy(pt, 100, -params.stringerThickness / 2 + 30);
					var holeParams = {
						vertexes: [pt1, pt2, pt3, pt4],
						cornerRad: 10.0,
						dxfPrimitivesArr: dxfPrimitivesArr,
						dxfBasePoint: shapePar.dxfBasePoint
					}
					shapeTop.holes.push(topCoverCentralHole(holeParams));

					//второй прямогуольный вырез
					var pt = newPoint_xy(p0, 30 + 50, p1.y / 2);
					var pt1 = newPoint_xy(pt, - 50, -params.stringerThickness / 2 + 30);
					var pt2 = newPoint_xy(pt, - 50, params.stringerThickness / 2 - 30);
					var pt3 = newPoint_xy(pt, 150, params.stringerThickness / 2 - 30);
					var pt4 = newPoint_xy(pt, 150, -params.stringerThickness / 2 + 30);
					var holeParams = {
						vertexes: [pt1, pt2, pt3, pt4],
						cornerRad: 10.0,
						dxfPrimitivesArr: dxfPrimitivesArr,
						dxfBasePoint: shapePar.dxfBasePoint
					}
					shapeTop.holes.push(topCoverCentralHole(holeParams));

					if (!par.isNotFlan) {
						//третий прямогуольный вырез
						var pt = newPoint_xy(p3,  - 30 - 50, p1.y / 2);
						var pt1 = newPoint_xy(pt, - 50, -params.stringerThickness / 2 + 30);
						var pt2 = newPoint_xy(pt, - 50, params.stringerThickness / 2 - 30);
						var pt3 = newPoint_xy(pt, 50, params.stringerThickness / 2 - 30);
						var pt4 = newPoint_xy(pt, 50, -params.stringerThickness / 2 + 30);
						var holeParams = {
							vertexes: [pt1, pt2, pt3, pt4],
							cornerRad: 10.0,
							dxfPrimitivesArr: dxfPrimitivesArr,
							dxfBasePoint: shapePar.dxfBasePoint
						}
						shapeTop.holes.push(topCoverCentralHole(holeParams));
					}
				}

				//для дополнительного куска if (params.carcasConfig == "003" || params.carcasConfig == "004")
				if (par.isReversBolt) {
					//прямогуольный вырез
					var pt = newPoint_xy(p3, - 30 - 50, p1.y / 2);
					var pt1 = newPoint_xy(pt, 50, -params.stringerThickness / 2 + 30);
					var pt2 = newPoint_xy(pt, 50, params.stringerThickness / 2 - 30);
					var pt3 = newPoint_xy(pt, -150, params.stringerThickness / 2 - 30);
					var pt4 = newPoint_xy(pt, -150, -params.stringerThickness / 2 + 30);
					var holeParams = {
						vertexes: [pt4, pt3, pt2, pt1],
						cornerRad: 10.0,
						dxfPrimitivesArr: dxfPrimitivesArr,
						dxfBasePoint: shapePar.dxfBasePoint
					}
					shapeTop.holes.push(topCoverCentralHole(holeParams));

					//второй прямогуольный вырез
					var pt = newPoint_xy(p0, 30 + 50, p1.y / 2);
					var pt1 = newPoint_xy(pt, - 50, -params.stringerThickness / 2 + 30);
					var pt2 = newPoint_xy(pt, - 50, params.stringerThickness / 2 - 30);
					var pt3 = newPoint_xy(pt, 50, params.stringerThickness / 2 - 30);
					var pt4 = newPoint_xy(pt, 50, -params.stringerThickness / 2 + 30);
					var holeParams = {
						vertexes: [pt1, pt2, pt3, pt4],
						cornerRad: 10.0,
						dxfPrimitivesArr: dxfPrimitivesArr,
						dxfBasePoint: shapePar.dxfBasePoint
					}
					shapeTop.holes.push(topCoverCentralHole(holeParams));
				}
			}

			var geom = new THREE.ExtrudeGeometry(shapeTop, extrudeOptions);
			geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
			var sidePlateTop = new THREE.Mesh(geom, params.materials.metal);
		}
		//if (par.isTreadPlate) {
		if (false) {
			//подложки ступеней
			if (params.stairType == 'лотки1') {
				var platePar = {
					marshId: par.marshId,
					plateId: 0,
					dxfArr: dxfPrimitivesArr,
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, -1000),
					type: "treadPlate",
					isSvg: true,
				}
				if (par.backOffHoles) platePar.backOffHoles = par.backOffHoles;
				platePar.step = par.pointsShape[2].x - par.pointsShape[1].x;
				platePar.frontOff = 0;
				platePar.frontOffset = 0;
				var basePointShiftX = -(platePar.frontOff + params.flanThickness + 2);
				platePar.step += basePointShiftX;

				var plate = drawHorPlates(platePar).mesh;
				plate.position.x = -basePointShiftX;
				par.treadPlates.add(plate);
			}

			//верхняя пластина косоура
            var platePar = {
	            marshId: par.marshId,
				plateId: 0,
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: newPoint_xy(par.dxfBasePoint, par.length + params.stringerThickness / 2 + 50, 0),
				type: "carcasPlate",
			}
            //pointCurrentSvg.y -= params.stringerThickness + 100;
			platePar.drawing = {
				name: "Вехняя пластина",
				group: "stringersPlatform",
				marshId: par.marshId1 ? par.marshId1 : par.marshId,
				pointCurrentSvg: copyPoint(pointCurrentSvg),
				pointStartSvg: pointStartSvg,
			}
			if (par.backOffHoles) platePar.backOffHoles = par.backOffHoles;
			platePar.step = par.pointsShape[2].x - par.pointsShape[1].x;
			platePar.frontOff = 0;
			platePar.frontOffset = 0;
			platePar.basePointShiftX = -(platePar.frontOff + params.flanThickness + 2);
			if (params.stairType !== 'лотки') {
				var sidePlateTop = drawHorPlates(platePar).mesh;
				sidePlateTop.rotation.x = Math.PI / 2;
				sidePlateTop.position.z = params.stringerThickness / 2 - params.metalThickness;
			}
		}

		if (sidePlateTop) {
			sidePlateTop.position.y = -5;
			sidePlateTop.position.z += -params.stringerThickness / 2 + params.metalThickness;
			sidePlateTop.rotation.x += Math.PI / 2;
			par.mesh2.add(sidePlateTop);
		}

		//нижняя пластина косоура
		pointCurrentSvg.y -= params.stringerThickness + 100;
		shapePar.drawing = {
			name: "Нижняя пластина",
			group: "stringersPlatform",
			marshId: par.marshId1 ? par.marshId1 : par.marshId,
			pointCurrentSvg: copyPoint(pointCurrentSvg),
			pointStartSvg: pointStartSvg,
		}
		shapePar.dxfBasePoint.y += params.stringerThickness + 50;
		var shapeBot = drawShapeByPoints2(shapePar).shape;
		par.stringerShape = shapeBot;

		var yTemp = par.dxfBasePoint.y;
		par.dxfBasePoint.y = shapePar.dxfBasePoint.y;
		//отверстия под фланец колонны
		if (par.isColonPlatformBackTop) {
			var pcenter = newPoint_xy(p3, -(220 / 2 - params.flanThickness),(params.stringerThickness - params.metalThickness * 2) / 2);
			drawHolesColumn(par, pcenter, 0);
		}
		if (par.isColonPlatformBackTop1) {
			var pcenter = newPoint_xy(p0, (220 / 2 - params.flanThickness), (params.stringerThickness - params.metalThickness * 2) / 2);
			drawHolesColumn(par, pcenter, 0);
		}
		if (par.isColonPlatformMiddleTop) {
			var pcenter = newPoint_xy(p1, (params.M  - params.flanThickness + params.marshDist - params.stringerThickness/2), -(params.stringerThickness - params.metalThickness * 2) / 2);
			drawHolesColumn(par, pcenter, 0);
		}
		par.dxfBasePoint.y = yTemp;

		var geom = new THREE.ExtrudeGeometry(shapeBot, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var sidePlateBot = new THREE.Mesh(geom, params.materials.metal);
		sidePlateBot.position.y = -params.stringerThickness + params.metalThickness;
		sidePlateBot.position.z = -params.stringerThickness / 2 + params.metalThickness;
		sidePlateBot.rotation.x = Math.PI / 2;
		par.mesh2.add(sidePlateBot);

		/*ФЛАНЦЫ*/
		//фланец соединения косоруров
        var flanPar = {
	        marshId: par.marshId1 ? par.marshId1 : par.marshId,
			type: "join",
			pointsShape: par.pointsShape,
            dxfBasePoint: newPoint_xy(shapePar.dxfBasePoint, 0, params.stringerThickness + 150),
            name: "Фланец соединения косоуров",
		};
        //if (par.isReversBolt) flanPar.noBolts = true; //болты не добавляются

	    flanPar.type = "joinStub";
	    flanPar.height = params.stringerThickness - params.metalThickness * 2 - 5;
	    //flanPar.holeY = 25;
	    flanPar.noBolts = true; //болты в первом фланце не добавляются
		flanPar.isBolts = true; //болты в первом фланце добавляются с шестигрн.
		flanPar.isSvg = true; 
		flanPar.isPointSvg = true; 
		flanPar.groupSvg = 'stringersPlatform'; 
		flanPar.pointCurrentSvg = newPoint_xy(p0, -params.stringerThickness - 100, 0);
		flanPar.pointStartSvg = pointStartSvg;
		//flanPar.isCount = true; 


		var flan = drawMonoFlan(flanPar).mesh;
	    flan.position.x = sidePlate2.position.x;// - params.flanThickness;
        if (par.isReversFlans) flan.position.x = sidePlate2.position.x + par.pointsShape[2].x - params.flanThickness;
        flan.position.y = sidePlate2.position.y + params.metalThickness;
        par.flans.add(flan);

	    //усиливающий фланец
	    flanPar.noBolts = true; //болты во втором фланце не добавляются
        flanPar.isBolts = false; //болты во втором фланце не добавляются
		flanPar.dxfBasePoint.x += params.stringerThickness + 100; 
		flanPar.pointCurrentSvg = newPoint_xy(p0, (-params.stringerThickness - 100) * 2, 0);
	    var flan2 = drawMonoFlan(flanPar).mesh;
        flan2.position.x = flan.position.x - params.flanThickness - params.metalThickness - 0.1;
        if (par.isReversFlans) flan2.position.x = flan.position.x + params.flanThickness + params.metalThickness + 0.1;
	    flan2.position.y = flan.position.y;
	    par.flans.add(flan2);

		//фланец соединения косорура к стене
		if (!par.isNotFlan) {
            var flanPar = {
	            marshId: par.marshId1 ? par.marshId1 : par.marshId,
				type: "join",
				pointsShape: par.pointsShape,
                dxfBasePoint: par.dxfBasePoint,
				name: "Фланец крепления к стене",
                marshIdFix: 3,
			};
            if (par.marshId1 == 21) flanPar.marshIdFix = 2;
			if (par.marshId1 == 22) flanPar.marshIdFix = 1;
			
			//if (!par.isReversBolt) flanPar.noBolts = true; //болты не добавляются
			flanPar.noBolts = true; //болты не добавляются
			flanPar.isCentralHoles = true; //отверстия в центре
			flanPar.isPointSvg = true;
			flanPar.groupSvg = 'stringersPlatform';
			flanPar.pointCurrentSvg = newPoint_xy(p0, par.length + 100, 0);
			flanPar.pointStartSvg = pointStartSvg;

			var flan = drawMonoFlan(flanPar).mesh;
            flan.position.x = sidePlate2.position.x + par.pointsShape[2].x;
            if (par.isReversFlans) flan.position.x = sidePlate2.position.x - params.flanThickness;
			flan.position.y = sidePlate2.position.y; // + par.pointsShape[2].y;
			par.flans.add(flan);

			//фланец-заглушка
			var flanPar = {
				type: "joinStub",
				pointsShape: par.pointsShape,
				dxfBasePoint: par.dxfBasePoint,
			};
			flanPar.height = params.stringerThickness - params.metalThickness * 2 - 5;

			var flan1 = drawMonoFlan(flanPar).mesh;
			flan1.position.x = flan.position.x - params.flanThickness;
			if (par.marshId1 == 22) flan1.position.x += params.flanThickness * 2;
			flan1.position.y = flan.position.y  + params.metalThickness //+ par.pointsShape[2].y;
			par.flans.add(flan1);
		}
		//если нет фланца соединения косорура к стене, делаем заднюю пластину
		if (par.isNotFlan) {
			var p0 = { x: 0, y: 0 };
			var p1 = newPoint_xy(p0, 0, params.stringerThickness - params.metalThickness * 2 - 5);
			var p2 = newPoint_xy(p1, params.stringerThickness - params.metalThickness * 2, 0);
			var p3 = newPoint_xy(p2, 0, -(params.stringerThickness - params.metalThickness * 2 - 5));

			var shapePar = {
				points: [p0, p1, p2, p3],
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: newPoint_xy(shapePar.dxfBasePoint, 0, params.stringerThickness + 150),
			}
			shapePar.drawing = {
				name: "Задняя пластина",
				group: "stringersPlatform",
				marshId: par.marshId1 ? par.marshId1 : par.marshId,
				pointCurrentSvg: newPoint_xy(p0, par.length + 100, 0),
				pointStartSvg: pointStartSvg,
			}
			var shapeBack = drawShapeByPoints2(shapePar).shape;
			var geom = new THREE.ExtrudeGeometry(shapeBack, extrudeOptions);
			geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
			var sidePlateBack = new THREE.Mesh(geom, params.materials.metal);
			sidePlateBack.position.x = sidePlate2.position.x + par.pointsShape[2].x - params.metalThickness;
			sidePlateBack.position.y = sidePlate2.position.y + params.metalThickness;
			sidePlateBack.position.z = sidePlate2.position.z + params.stringerThickness - params.metalThickness;
			sidePlateBack.rotation.y = Math.PI / 2;
			par.mesh2.add(sidePlateBack);
		}

	}

	if (params.model == "труба") {
		//боковые накладки косоура
		var text = "Боковые пластины косоура " + params.metalThickness + "мм. (2 ед.)";
		var textHeight = 25;
		var textBasePoint = newPoint_xy(par.dxfBasePoint, -20, -120);
		addText(text, textHeight, dxfPrimitivesArr, textBasePoint);

		var dy = params.sidePlateOverlay - 7;
		var h_1 = 60 + params.sidePlateOverlay - params.treadPlateThickness + dy; // высота задней кромки
		//var h_1 = 60 - params.treadPlateThickness - 7 + 60; // высота задней кромки
		var framePlatformWidth = params.M - 300; //ширина рамки площадки
		var framePlatformThickness = 30; //толщина рамки площадки

		var p0 = { x: 0, y: -dy };
		var p1 = newPoint_xy(p0, 0, h_1);
		var p2 = newPoint_xy(p1, par.length, 0);
		var p3 = newPoint_xy(p2, 0, -h_1);

		var len = (framePlatformWidth - framePlatformThickness) / 2;//расстояние от оси марша до оси паза под рамку
		var len1 = params.profileWidth / 2 + params.metalThickness + params.flanThickness;//расстояние до оси нижнего марша
		var len2 = params.M + params.marshDist - len1;//расстояние до оси верхнего марша


		par.pointsShape = [p0, p1];
		//добавляем точки прорези для рамок площадки
		if (params.carcasConfig == "001" || params.carcasConfig == "002") {
			addPointsRecessFramePlatform(newPoint_xy(p1, len - len1, 0), "platform", par);
			addPointsRecessFramePlatform(newPoint_xy(p1, len2 - len, 0), "platform", par);
			if (params.carcasConfig == "001")
				addPointsRecessFramePlatform(newPoint_xy(p1, len2 + len, 0), "platform", par);
		}
		if (params.carcasConfig == "003" || params.carcasConfig == "004") {
			var pt = copyPoint(p1);
			if (par.stringerLedge) pt.x += par.stringerLedge;
			len1 = params.M / 2 - params.flanThickness;
			len2 = params.M + params.marshDist + len1;
			addPointsRecessFramePlatform(newPoint_xy(pt, len1 - len, 0), "platform", par);
			addPointsRecessFramePlatform(newPoint_xy(pt, len1 + len, 0), "platform", par);
			addPointsRecessFramePlatform(newPoint_xy(pt, len2 - len, 0), "platform", par);
			if (params.carcasConfig == "003")
				addPointsRecessFramePlatform(newPoint_xy(pt, len2 + len, 0), "platform", par);
		}

		par.pointsShape.push(p2);
		par.pointsShape.push(p3);

		var shapePar = {
			points: par.pointsShape,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: par.dxfBasePoint,
		}

		//наружная накладка
		par.stringerShap = drawShapeByPoints2(shapePar).shape;
		var geom = new THREE.ExtrudeGeometry(par.stringerShap, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var sidePlate2 = new THREE.Mesh(geom, params.materials.metal);

		//внутренняя накладка
		//добавление площадки под фланец соединения косоуров
		if (params.carcasConfig !== "002") {
			if (params.carcasConfig == "003") {
				var pt = newPoint_xy(p0, len2, 0);
				if (par.stringerLedge) pt.x += par.stringerLedge;
				var pt5 = newPoint_xy(pt, (params.profileWidth + 140 + 2) / 2, 0);
				//var pt6 = newPoint_xy(pt5, 0, -(params.profileHeight - params.sidePlateOverlay));
				var pt6 = newPoint_xy(pt5, 0, -(params.profileHeight - 7) + dy);
				var pt8 = newPoint_xy(pt, -(params.profileWidth + 140 + 2) / 2, 0);
				//var pt7 = newPoint_xy(pt8, 0, -(params.profileHeight - params.sidePlateOverlay));
				var pt7 = newPoint_xy(pt8, 0, -(params.profileHeight -7) + dy);

				par.pointsShape.push(pt5);
				par.pointsShape.push(pt6);
				par.pointsShape.push(pt7);
				par.pointsShape.push(pt8);
			}


			if (params.carcasConfig == "001") {
				var pt = newPoint_xy(p0, len2, 0);
			}
			if (params.carcasConfig == "003" || params.carcasConfig == "004") {
				var pt = newPoint_xy(p0, len1, 0);
				if (par.stringerLedge) pt.x += par.stringerLedge;
			}

			var pt1 = newPoint_xy(pt, (params.profileWidth + 140 + 2) / 2, 0);
			var pt2 = newPoint_xy(pt1, 0, -(params.profileHeight - 7) + dy);
			var pt4 = newPoint_xy(pt, -(params.profileWidth + 140 + 2) / 2, 0);
			var pt3 = newPoint_xy(pt4, 0, -(params.profileHeight - 7) + dy);

			par.pointsShape.push(pt1);
			par.pointsShape.push(pt2);
			par.pointsShape.push(pt3);
			par.pointsShape.push(pt4);

			shapePar.points = par.pointsShape;
		}

		par.stringerShape = drawShapeByPoints2(shapePar).shape;

		//отверстия под фланец соединения косоуров
		if (params.carcasConfig !== "002") {
			var center1 = newPoint_xy(pt1, -40, -20 + h_1 + params.treadPlateThickness);
			var center2 = newPoint_xy(pt2, -40, 20);
			var center3 = newPoint_xy(pt3, 40, 20);
			var center4 = newPoint_xy(pt4, 40, -20 + h_1 + params.treadPlateThickness);

			center1.rad = center2.rad = center3.rad = center4.rad = 9;
			par.pointsHole = [];
			par.pointsHole.push(center1);
			par.pointsHole.push(center2);
			par.pointsHole.push(center3);
			par.pointsHole.push(center4);

			if (params.carcasConfig == "003") {
				var center1 = newPoint_xy(pt5, -40, -20 + h_1 + params.treadPlateThickness);
				var center2 = newPoint_xy(pt6, -40, 20);
				var center3 = newPoint_xy(pt7, 40, 20);
				var center4 = newPoint_xy(pt8, 40, -20 + h_1 + params.treadPlateThickness);

				center1.rad = center2.rad = center3.rad = center4.rad = 9;
				par.pointsHole.push(center1);
				par.pointsHole.push(center2);
				par.pointsHole.push(center3);
				par.pointsHole.push(center4);
			}

			drawStringerHoles(par);


		}

		var geom = new THREE.ExtrudeGeometry(par.stringerShape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var sidePlate1 = new THREE.Mesh(geom, params.materials.metal);



		sidePlate1.position.y = sidePlate2.position.y = -h_1 + dy;
		sidePlate1.position.z = (params.stringerThickness / 2 - params.metalThickness)*turnFactor;
		sidePlate2.position.z = -params.stringerThickness / 2 * turnFactor;
		sidePlate1.position.z -= params.metalThickness * (1 - turnFactor) * 0.5;
		sidePlate2.position.z -= params.metalThickness * (1 - turnFactor) * 0.5;

		par.mesh1.add(sidePlate1);
		par.mesh1.add(sidePlate2);


		//отрисовка профильной трубы
		if (params.model == "труба") {
			var sidePlateOverlayPlatform = 7;
			var offset = params.flanThickness - 3;
			var stringerPoints = [];

			var pt0 = newPoint_xy(p0, - offset, - params.profileHeight + sidePlateOverlayPlatform);
			var pt1 = newPoint_xy(pt0, 0, params.profileHeight);
			var pt3 = newPoint_xy(p3, offset, - params.profileHeight + sidePlateOverlayPlatform);
			var pt2 = newPoint_xy(pt3, 0, params.profileHeight);

			stringerPoints.push(pt0, pt1, pt2, pt3);
			
			var shapePar = {
				points: stringerPoints,
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: par.dxfBasePoint,
			}
			var shape = drawShapeByPoints2(shapePar).shape;
			par.stringerShape = shape;
			// отверстие под крепление каркаса
			{
				var pipeFlanParams = getFlanParams('flan_pipe_bot');//Получаем параметры фланца
				if (params.carcasConfig == '001' || params.carcasConfig == '003') {
					var holeDist = pipeFlanParams.holesDist; //Расстояние между отверстиями
					//var hole1 = newPoint_xy(pt2, -params.M / 2 - holeDist / 2 + 3 - params.stringerLedge2, -70 - 7 + pipeFlanParams.holeY);//3 - на столько труба не до ходит до края площадки, 70 - длина выступа наклаки под фланец, 7 - наложение накладки на профиль
					var hole1 = newPoint_xy(pt3, -params.M / 2 - holeDist / 2 + 3 - params.stringerLedge2, pipeFlanParams.holeY);//3 - на столько труба не до ходит до края площадки, 70 - длина выступа наклаки под фланец, 7 - наложение накладки на профиль
					var hole2 = newPoint_xy(hole1, holeDist, 0);
					hole1.rad = hole2.rad = 9;
					par.pointsHole = [];
					par.pointsHole.push(hole1);
					par.pointsHole.push(hole2);
					drawStringerHoles(par);
				}

				if (params.carcasConfig == '003' || params.carcasConfig == '004') {
					var holeDist = pipeFlanParams.holesDist; //Расстояние между отверстиями
					//var hole1 = newPoint_xy(pt1, params.M / 2 - holeDist / 2 - 3 + params.stringerLedge1, -70 - 7 + pipeFlanParams.holeY)//3 - на столько труба не до ходит до края площадки, 70 - длина выступа наклаки под фланец, 7 - наложение накладки на профиль
					var hole1 = newPoint_xy(pt0, params.M / 2 - holeDist / 2 - 3 + params.stringerLedge1, pipeFlanParams.holeY)//3 - на столько труба не до ходит до края площадки, 70 - длина выступа наклаки под фланец, 7 - наложение накладки на профиль
					var hole2 = newPoint_xy(hole1, holeDist, 0);
					hole1.rad = hole2.rad = 9;
					par.pointsHole = [];
					par.pointsHole.push(hole1);
					par.pointsHole.push(hole2);
					drawStringerHoles(par);
				}
			}
			
			var extrudeOptions1 = {
				amount: params.profileWidth,
				bevelEnabled: false,
				curveSegments: 12,
				steps: 1
			};
			var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions1);
			geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
			var stringerPole = new THREE.Mesh(geom, params.materials.tread);

			stringerPole.position.z = -params.profileWidth / 2;
			stringerPole.position.x = sidePlate2.position.x;
			stringerPole.position.y = sidePlate2.position.y + dy;
			par.mesh2.add(stringerPole);
		}


		/*ФЛАНЦЫ*/
		//фланец соединения косоруров
		if (params.carcasConfig == "001" || params.carcasConfig == "002") {
			var flanPar = {
				dxfBasePoint: dxfBasePoint, //базовая точка для вставки контуров в dxf файл
			};
			flanPar.isBolts = true; //добавляем болты

			flanPar = drawFlanPipeBot(flanPar);

			var flan = flanPar.mesh;
			flan.position.x = sidePlate2.position.x - params.flanThickness;
			flan.position.y = sidePlate2.position.y + 60 + params.sidePlateOverlay;
			flan.position.z = sidePlate2.position.z - params.profileWidth / 2 - params.flanThickness + 1;
			if (turnFactor == -1)
				flan.position.z = sidePlate1.position.z - params.profileWidth / 2 - params.flanThickness + 1;
			flan.rotation.z = Math.PI;
			flan.rotation.y = Math.PI / 2;
			par.flans.add(flan);
		}
		if (params.carcasConfig == "003" || params.carcasConfig == "004") {
			var flanPar = {
				type: "joinProf",
				pointsShape: par.pointsShape,
				dxfBasePoint: par.dxfBasePoint,
				stringerHeight: p2.y,
				marshId: par.marshId,
				marshIdFix: 1,
			};			
			flanPar.noBolts = true; //болты не добавляются
			flanPar.topEnd = "площадка";
			flanPar.isPlatform = true;

			var flan = drawMonoFlan(flanPar).mesh;
			flan.position.x = sidePlate2.position.x - params.flanThickness;
			flan.position.y = sidePlate2.position.y + p2.y - flanPar.height;

			par.flans.add(flan);
		}

		//фланец соединения косорура к стене
		if (params.carcasConfig == "001" || params.carcasConfig == "003") {
			var flanPar = {
				type: "joinProf",
				pointsShape: par.pointsShape,
				dxfBasePoint: par.dxfBasePoint,
				stringerHeight: p2.y,
				marshId: par.marshId,
				marshIdFix: 3,
			};
			flanPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, par.length - params.profileWidth - 60 * 2, 0);
			flanPar.noBolts = true; //болты не добавляются
			flanPar.topEnd = "площадка";
			flanPar.isPlatform = true;

			var flan = drawMonoFlan(flanPar).mesh;
			flan.position.x = sidePlate2.position.x + p2.x;
			flan.position.y = sidePlate2.position.y + p2.y - flanPar.height;
			par.flans.add(flan);
		}
		if (params.carcasConfig == "002" || params.carcasConfig == "004") {
			//фланец соединения косоруров
			var flanPar = {
				dxfBasePoint: dxfBasePoint, //базовая точка для вставки контуров в dxf файл
			};
			flanPar.isBolts = true; //добавляем болты

			flanPar = drawFlanPipeBot(flanPar);

			var flan = flanPar.mesh;
			flan.position.x = sidePlate2.position.x + p2.x;
			flan.position.y = sidePlate2.position.y + 60 + params.sidePlateOverlay;
			flan.position.z = sidePlate2.position.z - params.profileWidth / 2 - params.flanThickness + 1;
			if (turnFactor == -1) flan.position.z = sidePlate1.position.z - params.profileWidth / 2 - params.flanThickness + 1;
			flan.rotation.z = Math.PI;
			flan.rotation.y = Math.PI / 2;
			if (params.model == 'труба') {
				flan.rotation.y = -Math.PI / 2;
				flan.position.x += params.flanThickness;
				flan.position.z = sidePlate2.position.z + params.metalThickness + params.profileWidth + flanPar.holeX * 2 + 1;// 1 отступ от края отверстия
				if (turnFactor == -1) flan.position.z = sidePlate2.position.z + flanPar.holeX * 2 + 1;
			}
			par.flans.add(flan);
		}
	}

	par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, par.length + 1000, 0);
	
	//сохраняем данные для спецификации	
	var partName = "stringer";
	if (typeof specObj != 'undefined'){
		if (!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				sumLength: 0,
				name: "Косоур ",
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt", //единица измерения
				group: "Каркас",
			}
		}
		var name = " прям. L=" + Math.round(par.length);
		var area = par.length * (300 * 2 + params.stringerThickness * 2.5) / 1000000;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		specObj[partName]["sumLength"] += par.length / 1000;		
	}
	par.mesh2.specId = partName + name;

	return par;
}

/** старая  функция отрисовывает две боковые проставки для 2-го типа каркаса на забеге
dxfBasePoint - 
*/
function drawWndStringerExtension(par){
	
	par.mesh = new THREE.Object3D();
	par.flans = new THREE.Object3D();
	
	var flanThk = 8;
	
	
	//верхняя проставка
	var bracePar = {
		len: (params.M - params.stringerThickness) / 2 - flanThk + params.stringerLedge1,
		dxfBasePoint: par.dxfBasePoint,
		}
	var brace = drawSideStringerBrace(bracePar);
	brace.mesh.position.x = brace.flans.position.x = -100; // 100 - подогнано
	brace.mesh.position.y = brace.flans.position.y = -65; // 65 - подогнано
	if(turnFactor == -1) brace.mesh.position.y = brace.flans.position.y -= params.h3;
	brace.mesh.position.z = brace.flans.position.z = -params.M / 2 + 100; //100 - отступ от дальней стены
	par.mesh.add(brace.mesh);
	par.flans.add(brace.flans);
	
	//нижняя проставка
	var bracePar = {
		len: (params.M - params.stringerThickness) / 2 - flanThk + params.stringerLedge1,
		dxfBasePoint: par.dxfBasePoint,
		}
	var brace = drawSideStringerBrace(bracePar);
	brace.mesh.position.x = brace.flans.position.x = -100; // 100 - подогнано
	brace.mesh.position.y = brace.flans.position.y =  - params.h3 - 65; // 65 - подогнано
	if(turnFactor == -1) brace.mesh.position.y = brace.flans.position.y += params.h3;
	brace.mesh.position.z = brace.flans.position.z = params.M / 2 - 160; //160 - отступ от переднего края первой забежной ступени
	par.mesh.add(brace.mesh);
	par.flans.add(brace.flans);
	
	return par;

} //end of drawWndStringerExtension


/** старая функция отрисовывает боковую распорку для 2-го типа каракаса на забеге
базовая точка - центр фланца крепления к косоуру
*/

function drawSideStringerBrace(par){
	par.mesh = new THREE.Object3D();
	par.flans = new THREE.Object3D();
	
	var flanThk = 8;

	//тело проставки
	var polePar = {
		poleProfileY: 100,
		poleProfileZ: 100,
		dxfBasePoint: par.dxfBasePoint,
		length: par.len - flanThk,
		poleAngle: 0,
		angStart: 0,
		angEnd: 0,
		material: params.materials.metal,
		partName: "stringerPart",
		roundHoles: [],
		}

	var pole = drawPole3D_4(polePar).mesh;
		pole.position.x = -polePar.length - flanThk / 2;
		pole.position.z = 0;
		pole.position.y = -polePar.poleProfileY;
		
		par.mesh.add(pole);
		
	//фланец к стене
		var flanPar = {
			type: "botColon",
			profSize: polePar.poleProfileY,
			pointsShape: par.pointsShape,
			dxfBasePoint: par.dxfBasePoint,
		};
		flanPar.noBolts = true; //болты не добавляются
		var flan = drawMonoFlan(flanPar).mesh;
		flan.rotation.y = -Math.PI / 2
		flan.position.x = pole.position.x + flanThk / 2;
		flan.position.y = pole.position.y - 49; //49 - подогнано
		flan.position.z = pole.position.z + 149; // 149 - подогнано
		par.flans.add(flan);
	
	//фланец к косоуру
		flanPar.noBolts = false; //болты добавляются
		var flan = drawMonoFlan(flanPar).mesh;
		flan.rotation.y = -Math.PI / 2
		flan.position.x = pole.position.x + flanThk / 2 + polePar.length;
		flan.position.y = pole.position.y - 49; //49 - подогнано
		flan.position.z = pole.position.z + 149; // 149 - подогнано
		par.flans.add(flan);
		
	return par;
	
}//end of drawSideStringerBrace

/*расчет параметров косоура*/

function calcStringerPar(par) {

	/*функция добавляет во входящий объект следующие параметры косоура/тетивы:
	h
	b
	a
	stairAmt
	botEnd
	topEnd
	rectHoleSize
	turnLength
	
	исходные данные:
	marshId
	*/

	var marshParams = getMarshParams(par.marshId);
	par.marshParams = marshParams;

	//тип верхнего и нижнего поворотов
	par.botEnd = marshParams.botTurn;
	par.topEnd = marshParams.topTurn;

	par.h = marshParams.h;
	par.b = marshParams.b;
    par.a = marshParams.a;

    //задаем значения по умолчанию, если значения не заданы
    //if (!par.b) par.b = 50;
    //if (!par.h) par.h = 150;

    par.marshAngle = Math.atan(par.h / par.b);
    
	if (par.topEnd !== "пол") marshParams.stairAmt += 1;
	if (par.botEnd == "забег") marshParams.stairAmt += 1;
	if (params.stairModel == "П-образная с забегом" && par.marshId == 2) marshParams.stairAmt = 0;
	par.stairAmt = marshParams.stairAmt;
	par.h_topWnd = marshParams.h_topWnd;
	par.lastMarsh = marshParams.lastMarsh;

	calcStringerConnection(par); //Рассчитываем тип соединения
	calcColumnLogicParams(par); //Рассчитываем параметры колонн

	if (params.stairModel == "П-образная с забегом" && par.marshId == 2) {
		par.botEnd = "забег";
		par.topEnd = "забег";
		par.h = params.h3;
	}

	par.rectHoleSize = 10.5; //размер квадратного отверстия накладок

	par.stringerWidth = params.stringerThickness;
	if (params.model == "труба") par.stringerWidth = params.profileWidth;

	par.stringerLedge = 0;
	if (params.stairModel == "Г-образная с площадкой" || params.stairModel == "Г-образная с забегом") {
		par.stringerLedge = params.stringerLedge1;
	}
	if (params.stairModel == "П-образная трехмаршевая" || params.stairModel == "П-образная с площадкой" || params.stairModel == "П-образная с забегом") {
		if (par.marshId == 1) {
			par.stringerLedge = params.stringerLedge1;
		}
		if (par.marshId !== 1) {
			par.stringerLedge = params.stringerLedge2;
		}
	}

	//длина поворота
	if (params.model == "сварной") {
		if (par.topConnection) {
			if (par.topEnd == "площадка") {
				if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 1) par.stringerLedge1 = params.stringerLedge1;
				if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2) par.stringerLedge1 = params.stringerLedge2;
			    par.topEndLength = params.M - (par.a - par.b - 45) + par.stringerLedge - params.flanThickness;
			}
			if (par.topEnd == "забег") par.topEndLength = 0;
			if (par.topEnd == "забег" && par.marshId == 2 && params.stairModel == 'П-образная трехмаршевая') par.topEndLength = -36;
		}
		if (!par.topConnection) {
			if (par.topEnd == "площадка") {
				par.topEndLength = params.M / 2 - params.stringerThickness / 2 - 5 - 0.01;
				//if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && par.stairAmt == 1)
				//	par.topEndLength -= 40;
			}

			if (par.topEnd == "забег")
				par.topEndLength = -(params.M - params.stringerThickness) / 2 + 150;
				if (par.topEndLength < 220) {
					par.topEndLength = -20;//Корректируем размер участка, чтобы вместился фланец
				}
		}

		if (par.botConnection) {
			if (par.botEnd == "площадка") {
				if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2)
					par.stringerLedge = params.stringerLedge1;
				if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 3)
					par.stringerLedge = params.stringerLedge2;

				par.botEndLength = params.M + par.stringerLedge - params.flanThickness + 0.01;
				if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && par.stairAmt == 1)
					par.botEndLength += params.marshDist + 5;
			}
			// if (par.botEnd == "забег" && par.topEnd !== 'забег')// && params.stairModel !== 'П-образная с забегом')
			// 	// par.topEndLength = 0;
		}
		if (!par.botConnection) {
			if (par.botEnd == "площадка") {
			    par.botEndLength = params.M / 2 - params.stringerThickness / 2;
				if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && par.stairAmt == 1)
					par.botEndLength += params.marshDist + 5;
			}
			// if (par.botEnd == "забег" && par.topEnd !== 'забег')//&& params.stairModel !== 'П-образная с забегом')
			// 	par.topEndLength = -50;
		}

		if (params.stairModel == "П-образная с площадкой") {
			if (par.topConnection)
				par.topEndLength = params.platformLength_1 + 50 - (par.a - par.b) + par.stringerLedge - params.flanThickness;
			if (!par.topConnection)
				par.topEndLength = params.platformLength_1 - 50 - (par.a - par.b);

		    par.botEndLength = (params.platformLength_1 + 50) / 2 - params.stringerThickness / 2;// - params.flanThickness;
		}

		if (params.platformTop == "площадка" && (par.marshId == 3 || params.stairModel == "Прямая"))
			par.topEndLength = params.platformLength_3 - (par.a - par.b) - params.flanThickness;
	}

	if (params.model == "труба") {
		if (par.topConnection) {
			if (par.topEnd == "площадка") {
				if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 1)
					par.stringerLedge1 = params.stringerLedge1;
				if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2)
					par.stringerLedge1 = params.stringerLedge2;
				par.topEndLength = params.M - (par.a - par.b - 45 + params.treadPlateThickness * 2) + par.stringerLedge - params.flanThickness;
			}
			if (par.topEnd == "забег") par.topEndLength = 0;
		}
		if (!par.topConnection) {
			if (par.topEnd == "площадка") {
				par.topEndLength = (params.M - params.profileWidth) / 2 - params.flanThickness - params.metalThickness - params.treadPlateThickness * 2  - 5;
				//if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && par.stairAmt == 1)
				//	par.topEndLength -= 50;
			}
			if (par.topEnd == "забег")
				par.topEndLength = -(params.M - params.stringerThickness) / 2 + 150;
		}

		if (par.botConnection) {
			if (par.botEnd == "площадка") {
				if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2)
					par.stringerLedge = params.stringerLedge1;
				if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 3)
					par.stringerLedge = params.stringerLedge2;

				par.botEndLength = params.M + par.stringerLedge - params.flanThickness + params.treadPlateThickness * 2;
				if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && par.stairAmt == 1)
					par.botEndLength += params.marshDist + 5;
			}
			// if (par.botEnd == "забег" && par.topEnd !== 'забег')
			// 	par.topEndLength = 0;
		}
		if (!par.botConnection) {
			if (par.botEnd == "площадка") {
				par.botEndLength = (params.M - params.profileWidth) / 2 - params.flanThickness - params.metalThickness + params.treadPlateThickness * 2;
				if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && par.stairAmt == 1)
					par.botEndLength += params.marshDist + 5;
			}
			// if (par.botEnd == "забег" && par.topEnd !== 'забег')
			// 	par.topEndLength = -50;
		}

		if (params.stairModel == "П-образная с площадкой") {
			par.botEndLength = params.platformLength_1;
			if (par.topConnection) {
				par.topEndLength = params.platformLength_1 + par.stringerLedge - params.flanThickness - params.treadPlateThickness * 2;
			}
			if (!par.topConnection) {
				par.topEndLength = (params.platformLength_1 - 50 - params.profileWidth) / 2 - params.flanThickness - params.metalThickness - params.treadPlateThickness*2;
			}

			if (par.botConnection) {
				par.botEndLength = params.platformLength_1 + par.stringerLedge - params.flanThickness + params.treadPlateThickness * 2 + 50;
			}
			if (!par.botConnection)
				par.botEndLength = (params.platformLength_1 + 50 - params.profileWidth) / 2 - params.metalThickness - params.flanThickness + params.treadPlateThickness * 2;
		}

		if (params.platformTop == "площадка" && par.lastMarsh)
			par.topEndLength = params.platformLength_3 - (par.a - par.b) - params.treadPlateThickness * 2 - params.flanThickness;
	}
	
	// par.topEndLength = 1050 - 167;
	//костыль для совместимости со старыми функциями
	par.dxfBasePointGap = 100;
	return par;
}


/**
	Рассчитываем наличие соединения на марше
	@param - marshId
	
	@return - добавляет во входящий объект рассчитанные параметры
*/
function calcStringerConnection(par){
	var marshParams = getMarshParams(par.marshId);
	var botEnd = marshParams.botTurn;
	var topEnd = marshParams.topTurn;
	
	par.topConnection = false;
	par.botConnection = false;

	if (params.stairModel == "Г-образная с площадкой" || params.stairModel == "Г-образная с забегом") {
		if (params.carcasConfig == "001") {
			par.topConnection = true;
			par.botConnection = false;
			}
		if (params.carcasConfig == "002") {
			par.topConnection = false;
			par.botConnection = true;
		}
	}

	if (params.stairModel == "П-образная трехмаршевая") {
		if (par.marshId == 1) {
			par.topConnection = false;
			if (params.carcasConfig == "001" || params.carcasConfig == "002") par.topConnection = true;
		}
		if (par.marshId == 2) {
			par.topConnection = false;
			par.botConnection = false;
			if (params.carcasConfig == "001" || params.carcasConfig == "003") par.topConnection = true;
			if (params.carcasConfig == "003" || params.carcasConfig == "004") par.botConnection = true;
		}
		if (par.marshId == 3) {
			par.botConnection = false;
			if (params.carcasConfig == "002" || params.carcasConfig == "004") par.botConnection = true;
		}
	}
	if (params.stairModel == "П-образная с площадкой" || params.stairModel == "П-образная с забегом") {
		if (par.marshId == 1) {
			if (params.carcasConfig == "001" || params.carcasConfig == "002") par.topConnection = true;
			if (params.carcasConfig == "003" || params.carcasConfig == "004") par.topConnection = false;

			if (params.carcasConfig == "001" || params.carcasConfig == "003") par.botConnection = false;
			if (params.carcasConfig == "002" || params.carcasConfig == "004") par.botConnection = true;
		}
		if (par.marshId !== 1) {
			if (params.carcasConfig == "001" || params.carcasConfig == "002") par.topConnection = true;
			if (params.carcasConfig == "003" || params.carcasConfig == "004") par.topConnection = false;

			if (params.carcasConfig == "001" || params.carcasConfig == "003") par.botConnection = false;
			if (params.carcasConfig == "002" || params.carcasConfig == "004") par.botConnection = true;
			if (par.marshId == 2 && (params.carcasConfig == '002' || params.carcasConfig == '004')) par.topConnection = false;
			if (par.marshId == 2 && (params.carcasConfig == '003' || params.carcasConfig == '001')) par.topConnection = true;
		}
	}
	if (params.platformTop == "площадка" && (par.marshId == 3 || params.stairModel == "Прямая"))
		par.topConnection = false;

	return par
}
