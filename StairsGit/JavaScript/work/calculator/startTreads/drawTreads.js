function drawStartUnit() {
	/*функция отрисовывает пригласительные ступени и подступенки*/

	var treadsGroup = new THREE.Object3D();
	var risersGroup = new THREE.Object3D();
	var treadDims = [];

	var sideOverHang = params.sideOverHang;
	if (!sideOverHang) sideOverHang = 50;
	//if(params.model == "лт") sideOverHang = 0;

	//пригласительные ступени
	var treadPar = {
		side: params.arcSide,
		dxfBasePoint: { x: -3000, y: 0 },
		radiusFactor: params.radiusFactor, //определяет радиус передней кромки
		asymmetryFactor: params.asymmetryFactor, //определяет симметричность ступени
		widthFactor: params.widthFactor, //определяет ширину для прямоугольных
		fullArcFront: false,
		stepFactor: params.stepFactor,
		rearLedge: {
			width: 50,
			len: params.M - sideOverHang * 2 + 1, //1мм зазор чтобы не было пересечений
		},
		template: params.startTreadsTemplate,
	}
	if (params.fullArcFront == "да") treadPar.fullArcFront = true;
	if (params.model == "лт") treadPar.rearLedge = { width: 50, len: params.M, }

	for (var i = 0; i < params.startTreadAmt; i++) {
		if (i == 1) {
			treadPar.radiusFactor = params.radiusFactor1;
			treadPar.asymmetryFactor = params.asymmetryFactor1;
			treadPar.stepFactor = params.stepFactor1
			treadPar.widthFactor = params.widthFactor1
		}
		if (i == 2) {
			treadPar.radiusFactor = params.radiusFactor2;
			treadPar.asymmetryFactor = params.asymmetryFactor2;
			treadPar.stepFactor = params.stepFactor2
			treadPar.widthFactor = params.widthFactor2
		}
		if (i == params.startTreadAmt - 1) treadPar.lastStartTread = true;
		if(treadPar.template != "прямоугольные") treadPar.stepFactor *= (params.startTreadAmt - i); //костыль для совместимости со старым кодом
		if(treadPar.template == "прямоугольные") treadPar.stepFactor += (params.startTreadAmt - i - 1) * 100;
		treadPar.rearLedge.width = params.b1 * (params.startTreadAmt - i - 1);
		treadPar.modifyKey = 'startTread:' + i;
		var treadObj = drawStartTread(treadPar);
		var startTreads = treadObj.mesh;
		startTreads.position.x = params.startTreadAmt * params.b1 - treadPar.width + params.a1 - params.b1;
		startTreads.position.y = params.h1 * (i + 1) + 0.01;
		if (params.model == "лт" || params.calcType == "mono") {
			startTreads.position.x -= 0.01
			startTreads.position.y += 0.01
		}

		if (turnFactor == -1) startTreads.position.z = -params.M;
		treadsGroup.add(startTreads);

		if (params.riserType == "есть") {
			var riser = drawStartRiser(treadPar).mesh;
			riser.position.x = params.startTreadAmt * params.b1 - treadPar.width + params.a1 - params.b1;
			riser.position.y = params.h1 * i + 0.01;
			if (turnFactor == -1) riser.position.z = -params.M;
			risersGroup.add(riser);

		}
		treadPar.dxfBasePoint.y -= 1000;

		//парметры ступеней
		treadDims[i + 1] = treadObj.dim;
	}

	var result = {
		treads: treadsGroup,
		risers: risersGroup,
		dim: treadDims,
	}

	return result;

} //end of drawStartUnit

/**
функция отрисовывает криволинейную пригласительную ступень
Обозначение параметров здесь /drawings/treads/startTread.pdf
var startTreadsPar = {
		side: //скругление: right || left || two
		dxfBasePoint: {x:0, y:-1000},
		radiusFactor: params.radiusFactor, //определяет радиус передней кромки
		asymmetryFactor: params.asymmetryFactor, //определяет симметричность ступени
		fullArcFront: false, //наличие прямого участка на криволинейной передней кромке
		stepFactor: params.stepFactor, //определяет ширину проступи
		rearLedge: {
			width: 50,
			len: params.M - params.sideOverHang * 2,
			},
		}
Физический смысл параметров:
radiusFactor - угол в градусах, на который уменьшается боковая дуга
stepFactor - к-т ширина в процентах от a1
asymmetryFactor - смещение центра передней дуги по X относительно центра ступени в процентах от М

точки тут 6692035.ru/drawings/treads/startTread.png
**/

function drawStartTread(par) {

	par.mesh = new THREE.Object3D();

	var text = 'Пригласительная ступень';
	var textHeight = 30;
	var textBasePoint = newPoint_xy(par.dxfBasePoint, 20, -250);
	addText(text, textHeight, dxfPrimitivesArr, textBasePoint);
	if(!par.width) par.width = params.b1 * par.stepFactor / 100 + params.nose;
	if(!par.len) {
		par.len = params.M;
		if(par.template == "прямоугольные") par.len = params.M * par.widthFactor / 100;
	}
	par.marshWidth = params.M
	if(!par.marshWidth) par.marshWidth = par.width
	var shape = new THREE.Shape();

	if(!par.thk) par.thk = params.treadThickness;
	if(!par.material) par.material = params.materials.tread
	
	var p0 = { x: 0, y: 0 };
	
	if(par.template == "прямоугольные") {
		var deltaLen = par.len - par.marshWidth;
		
		if (par.side == "two") p0.x -= deltaLen / 2
		if (par.side == "left") p0.x -= deltaLen;
	}

	var p1 = newPoint_xy(p0, 0, 0);
	var p2 = newPoint_xy(p0, 0, par.width);
	var p3 = newPoint_xy(p0, par.len, par.width);
	var p4 = newPoint_xy(p0, par.len, 0.0);

	if (!par.lastStartTread && params.riserType == "есть") {
		p2.y += params.riserThickness;
		p3.y += params.riserThickness;
		//par.width += params.riserThickness;
	}

	//параметры боковых дуг

	var sideWidth = p2.y - p0.y;

	var rad = sideWidth / 2;

	var sideArcs = {
		right: {
			center: newPoint_xy(p4, 0, sideWidth / 2),
			angStart: Math.PI * 0.5,
			angEnd: -Math.PI * 0.5,
			rad: rad,
		},
		left: {
			center: newPoint_xy(p0, 0, sideWidth / 2),
			angStart: Math.PI * 1.5,
			angEnd: Math.PI * 0.5,
			rad: rad,
		},
	}

	//передняя дуга

	if (par.radiusFactor != 0) {
		//рассчитываем координаты центра дуги передней кромки
		var sideAng = par.radiusFactor / 180 * Math.PI;
		sideArcs.right.angEnd += sideAng;
		sideArcs.left.angStart -= sideAng;
		//угол на стыке с передней дугой
		sideArcs.right.frontAng = sideArcs.right.angEnd;
		sideArcs.left.frontAng = sideArcs.left.angStart;

		if (par.side == "two") {
			var center_fr = itercection(sideArcs.left.center, polar(sideArcs.left.center, sideArcs.left.angStart, 100), sideArcs.right.center, polar(sideArcs.right.center, sideArcs.right.angEnd, 100));
			var rad_fr = distance(polar(sideArcs.right.center, sideArcs.right.angEnd, rad), center_fr);

			var frontArc = {
				center: center_fr,
				angStart: sideArcs.right.frontAng,
				angEnd: sideArcs.left.frontAng - Math.PI * 2,
				rad: rad_fr,
			}
		}
		if (par.side != "two") {
			var sideArc = sideArcs[par.side];
			var distX = par.len * (0.5 + par.asymmetryFactor / 100)
			//точка на диаметре передней дуги, параллельном направлению марша
			var pt = newPoint_xy(p4, -distX, 0);
			if (par.side == "left")
				pt = newPoint_xy(p1, distX, 0);
			//центр передней дуги
			center_fr = itercection(pt, newPoint_xy(pt, 0, 100), sideArc.center, polar(sideArc.center, sideArc.frontAng, 100));
			//точка пересечения боковой и передней дуги
			var p41 = polar(sideArc.center, sideArc.frontAng, rad);
			//радиус передней дуги
			var rad_fr = distance(p41, center_fr);

			var frontArc = {
				center: center_fr,
				angStart: sideArcs.right.frontAng,
				angEnd: sideArcs.left.frontAng - Math.PI * 2,
				rad: rad_fr,
			}

			//если передняя линия содержит прямой участок
			if (!par.fullArcFront) {
				if (par.side == "left") {
					frontArc.angStart = -Math.PI / 2;
				}
				if (par.side == "right") {
					frontArc.angEnd = -Math.PI / 2;
				}

				var p5 = {
					x: pt.x,
					y: frontArc.center.y - frontArc.rad,
				}
				if (par.side == "left") {
					p4.y = p5.y;
				}
				if (par.side == "right") {
					p1.y = p5.y;
				}
			}

			//если передняя линия полная дуга
			if (par.fullArcFront) {
				//расстояние по Y от центра дуги до точки пересечения с боковой линией

				if (par.side == "left") {
					var p4In = newPoint_xy(p4, - params.riserThickness, 0);
					var distX = p4.x - frontArc.center.x
					var distY = Math.sqrt(rad_fr * rad_fr - distX * distX)
					p4.y = frontArc.center.y - distY;
					frontArc.angStart = angle(center_fr, p4);

					// для расчета размеров для плинтуса, если передняя линия полная дуга (рассчитываем от внутренней стороны плинтуса)
					var distX = p4In.x - frontArc.center.x
					var distY = Math.sqrt(rad_fr * rad_fr - distX * distX)
					p4In.y = frontArc.center.y - distY;
				}
				if (par.side == "right") {
					var p1In = newPoint_xy(p1, params.riserThickness, 0);
					var distX = frontArc.center.x - p1.x
					var distY = Math.sqrt(rad_fr * rad_fr - distX * distX)
					p1.y = frontArc.center.y - distY;
					frontArc.angEnd = angle(center_fr, p1) - Math.PI;

					// для расчета размеров для плинтуса, если передняя линия полная дуга (рассчитываем от внутренней стороны плинтуса)
					var distX = frontArc.center.x - p1In.x
					var distY = Math.sqrt(rad_fr * rad_fr - distX * distX)
					p1In.y = frontArc.center.y - distY;
				}

				var pt1 = newPoint_xy(p3, - params.riserThickness, 0);
				var pt2 = newPoint_xy(p4, - params.riserThickness, 0);
				var parArcFillet = {
					line_p1: copyPoint(pt1),
					line_p2: copyPoint(pt2),
					arcCenter: copyPoint(frontArc.center),
					arcRad: frontArc.rad,
				}
				var pt3 = calcArcFillet(parArcFillet)
			}

		}
	}


	//построение контура

	//правая боковая линия
	if (par.template != "прямоугольные"){
		 if(par.side == "right" || par.side == "two") {
			addArc2(shape, dxfPrimitivesArr, sideArcs.right.center, sideArcs.right.rad, sideArcs.right.angStart, sideArcs.right.angEnd, true, par.dxfBasePoint)
		}
		else {
			p3.y -= par.rearLedge.width;
			addLine(shape, dxfPrimitivesArr, p3, p4, par.dxfBasePoint);
		}
	}
	
	if (par.template == "прямоугольные"){
		if(par.side == "left") p3.y -= par.rearLedge.width;
		addLine(shape, dxfPrimitivesArr, p3, p4, par.dxfBasePoint);
	}
	
	//передняя линия

	if (par.radiusFactor == 0) {
		addLine(shape, dxfPrimitivesArr, p4, p1, par.dxfBasePoint);
	}
	if (par.radiusFactor != 0) {
		if (par.side == "left" && !par.fullArcFront) {
			addLine(shape, dxfPrimitivesArr, p4, p5, par.dxfBasePoint);
		}
		addArc2(shape, dxfPrimitivesArr, frontArc.center, frontArc.rad, frontArc.angStart, frontArc.angEnd, true, par.dxfBasePoint)

		if (par.side == "right" && !par.fullArcFront) {
			addLine(shape, dxfPrimitivesArr, p5, p1, par.dxfBasePoint);
		}
	}

	//левая боковая линия
	if (par.template != "прямоугольные"){
		if (par.side == "left" || par.side == "two") {
			addArc2(shape, dxfPrimitivesArr, sideArcs.left.center, sideArcs.left.rad, sideArcs.left.angStart, sideArcs.left.angEnd, true, par.dxfBasePoint)
		}
		else {
			p2.y -= par.rearLedge.width;
			addLine(shape, dxfPrimitivesArr, p1, p2, par.dxfBasePoint);
		}
	}
	if (par.template == "прямоугольные"){
		if(par.side == "right") p2.y -= par.rearLedge.width;
		addLine(shape, dxfPrimitivesArr, p1, p2, par.dxfBasePoint);
	}

	//задняя линия

	if (par.rearLedge) {
		//ширина заднего выступа
		var len1 = (par.len - par.rearLedge.len) / 2;
		if (par.template == "прямоугольные" && par.side != "two") {
			len1 = len1 * 2
			if(params.model == "ко") len1 -= params.sideOverHang;
		}
		//левая сторона
		var p21 = newPoint_xy(p2, len1, 0);
		var p22 = newPoint_xy(p21, 0, - par.rearLedge.width);
		if (par.side != "left" && par.side != "two") p22 = copyPoint(p21);
		//правая сторона
		var p31 = newPoint_xy(p3, - len1, 0);
		var p32 = newPoint_xy(p31, 0, - par.rearLedge.width);
		if (par.side != "right" && par.side != "two") p32 = copyPoint(p31);

		if (p2.x != p21.x) addLine(shape, dxfPrimitivesArr, p2, p21, par.dxfBasePoint);
		if (p21.y != p22.y) addLine(shape, dxfPrimitivesArr, p21, p22, par.dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p22, p32, par.dxfBasePoint);
		if (p31.y != p32.y) addLine(shape, dxfPrimitivesArr, p32, p31, par.dxfBasePoint);
		if (p3.x != p31.x) addLine(shape, dxfPrimitivesArr, p31, p3, par.dxfBasePoint);

		console.log(p2, p21, p22, p31, p32, p3)

	}
	if (!par.rearLedge) {
		addLine(shape, dxfPrimitivesArr, p2, p3, par.dxfBasePoint);
	}

	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	// Достаем переменные из объекта, чтобы можно было менять для одной ступени
	var sizeA = par.width;
	if (p5) sizeA += -p5.y
	var sizeB = par.len;
	if (par.side == "left" || par.side == "two") sizeB += rad;
	if (par.side == "right" || par.side == "two") sizeB += rad;
	var treadPar = getTreadParams(); //функция в файле calcSpecGeneral.js

	if (par.modifyKey && window.service_data && window.service_data.shapeChanges && window.service_data.shapeChanges.length > 0) {
		var modify = window.service_data.shapeChanges.find(function(change){
			return change.modifyKey == par.modifyKey
		})
		if (modify) {
			shape = getShapeFromModify(modify);
			var bbox = findBounds(shape.getPoints());
			sizeA = bbox.x;
			sizeB = bbox.y;
		}
	}

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var tread = new THREE.Mesh(geom, par.material);
	tread.rotation.x = Math.PI / 2;
	tread.rotation.z = Math.PI / 2;
	tread.rotation.y = Math.PI;
	tread.position.y = -params.treadThickness;
	tread.modifyKey = par.modifyKey;
	par.mesh.add(tread);

	//сохраняем данные для построения подступенков
	par.frontArc = frontArc;
	par.sideArcs = sideArcs;
	par.points = {
		p1: p1,
		p2: p2,
		p3: p3,
		p4: p4,
		p5: p5,		
	}

	//сохраняем данные для спецификации

	var partName = "startTread";
	if (typeof specObj != 'undefined' && params.stairType !== "нет") {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Пригласительная ступень",
				area: 0,
				paintedArea: 0,
				metalPaint: treadPar.metalPaint,
				timberPaint: treadPar.timberPaint,
				division: treadPar.division,
				workUnitName: "amt",
				group: "treads",
			}
		}
		var name = Math.round(sizeA) + "x" + Math.floor(sizeB) + "x" + params.treadThickness;
		var area = sizeA * sizeB / 1000000;
		var paintedArea = area * 2 + (sizeA + sizeB) * 2 * params.treadThickness / 1000000;

		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		specObj[partName]["paintedArea"] += paintedArea;
	}

	par.mesh.specId = partName + name;

	//основные размеры
	par.dim = {
		stepLeft: Math.abs(p1.y - p2.y),
		stepRight: Math.abs(p3.y - p4.y),
	}

	if (p5) par.dim.stepOff = p5.y;//сдвиг подступенка от края ступени из-за увеличения бокового размера ступени(для радиусных и веера)

	// если передняя дуга полная, тогда размеры считаем от внуреней стороны плинтуса
	if (par.fullArcFront && (p1In || p4In)) {
		if (p1In) {
			par.dim.stepLeft = Math.abs(p1In.y - p2.y);
			par.dim.stepOff = p1In.y;
		}
		if (p4In) {
			par.dim.stepRight = Math.abs(p3.y - p4In.y);
			par.dim.stepOff = p4In.y;
		}

	}
	if (!par.lastStartTread && params.riserType == "есть") {
		par.dim.stepLeft -= params.riserThickness;
		par.dim.stepRight -= params.riserThickness;
	}
	return par;
} //end of drawStartTreads


function drawStartRiser(par) {

	par.mesh = new THREE.Object3D();
	var shape = new THREE.Shape();

	var nose = params.nose;
	var frontArc = par.frontArc;
	var sideArcs = par.sideArcs;
	var points = points;

	var p1 = newPoint_xy(par.points.p1, 0, nose);
	var p2 = newPoint_xy(p1, 0, params.riserThickness);
	var p4 = newPoint_xy(par.points.p4, 0, nose);
	var p3 = newPoint_xy(p4, 0, params.riserThickness);
	var p5 = newPoint_xy(par.points.p5, 0, nose);
	
	//добавляем боковой свес для прямоугольных ступеней
	if(par.template == "прямоугольные") {
		if (par.side == "left" || par.side == "two"){
			p1.x += nose
			p2.x += nose
		}
		if (par.side == "right" || par.side == "two"){
			p3.x -= nose
			p4.x -= nose
		}
		
	}
	
	//смещаем переднюю линию и рассчитываем конечне точки
	if (frontArc) {
		frontArc.rad -= nose;
		calcArcEndPoints(frontArc)
	}


	//внешний контур
	var sizeA = 0; //длина развертки подступенка
	
	//прямой участок до косоура
	var len1 = (par.len - par.rearLedge.len) / 2 - 1; //1мм зазор чтобы не было пересечений
	if (par.template == "прямоугольные"){
		if(par.side != "two"){
			len1 = len1 * 2 - nose;
			if(params.model == "ко") len1 -= params.sideOverHang;
		}
		if(par.side == "two"){
			len1 -= nose;
		}
	}

	//правая линия
	
	if (par.side == "right" || par.side == "two") {
		var p32 = newPoint_xy(par.points.p3, 0, -nose);
		if(par.template == "прямоугольные") p32.x -= nose
		var p31 = newPoint_xy(p32, 0, -params.riserThickness);

		if (par.rearLedge) {
			//прямой участок до косоура
			var p30 = newPoint_xy(p31, -len1, 0);
			var p33 = newPoint_xy(p32, -len1, 0);
			addLine(shape, dxfPrimitivesArr, p31, p30, par.dxfBasePoint);
			addLine(shape, dxfPrimitivesArr, p30, p33, par.dxfBasePoint);
			addLine(shape, dxfPrimitivesArr, p33, p32, par.dxfBasePoint);

			sizeA += len1;
		}
		else {
			addLine(shape, dxfPrimitivesArr, p31, p32, par.dxfBasePoint);
		}
		if(par.template != "прямоугольные") {
			addArc2(shape, dxfPrimitivesArr, sideArcs.right.center, sideArcs.right.rad - nose, sideArcs.right.angStart, sideArcs.right.angEnd, true, par.dxfBasePoint);
		}
		if(par.template == "прямоугольные") {
			addLine(shape, dxfPrimitivesArr, p32, p4, par.dxfBasePoint);
		}
		sizeA += (sideArcs.right.rad - nose) * Math.abs(sideArcs.right.angStart - sideArcs.right.angEnd);
	}
	else {
		addLine(shape, dxfPrimitivesArr, p3, p4, par.dxfBasePoint);
		sizeA += distance(p3, p4);
	}
	
	
	
	//передняя линия

	if (par.radiusFactor == 0) {
		addLine(shape, dxfPrimitivesArr, p4, p1, par.dxfBasePoint);
		sizeA += distance(p4, p1);
	}
	if (par.radiusFactor != 0) {
		if (par.side == "left" && !par.fullArcFront) {
			addLine(shape, dxfPrimitivesArr, p4, p5, par.dxfBasePoint);
			sizeA += distance(p4, p5);
		}
		addArc2(shape, dxfPrimitivesArr, frontArc.center, frontArc.rad, frontArc.angStart, frontArc.angEnd, true, par.dxfBasePoint)
		sizeA += frontArc.rad * Math.abs(frontArc.angStart - frontArc.angEnd);

		if (par.side == "right" && !par.fullArcFront) {
			addLine(shape, dxfPrimitivesArr, p5, p1, par.dxfBasePoint);
			sizeA += distance(p5, p1);
		}
		p1 = frontArc.end;
		p2 = polar(p1, frontArc.angEnd, -params.riserThickness)
	}

	//левая линия

	if (par.side == "left" || par.side == "two") {
		var p21 = newPoint_xy(par.points.p2, 0, -nose);
		if(par.template == "прямоугольные") p21.x += nose
		var p22 = newPoint_xy(p21, 0, -params.riserThickness);
		//прямой участок до косоура
		var p20 = newPoint_xy(p21, len1, 0);
		var p23 = newPoint_xy(p22, len1, 0);
		
		if(par.template != "прямоугольные") {
			addArc2(shape, dxfPrimitivesArr, sideArcs.left.center, sideArcs.left.rad - nose, sideArcs.left.angStart, sideArcs.left.angEnd, true, par.dxfBasePoint)
		}
		if(par.template == "прямоугольные") {
			addLine(shape, dxfPrimitivesArr, p1, p21, par.dxfBasePoint);
		}
		sizeA += (sideArcs.left.rad - nose) * Math.abs(sideArcs.left.angStart - sideArcs.left.angEnd);

		
		if (par.rearLedge) {			
			addLine(shape, dxfPrimitivesArr, p21, p20, par.dxfBasePoint);
			addLine(shape, dxfPrimitivesArr, p20, p23, par.dxfBasePoint);
			addLine(shape, dxfPrimitivesArr, p23, p22, par.dxfBasePoint);
			sizeA += len1;
		}
		else {
			addLine(shape, dxfPrimitivesArr, p21, p22, par.dxfBasePoint);
		}
	}
	else {
		addLine(shape, dxfPrimitivesArr, p1, p2, par.dxfBasePoint);
		sizeA += distance(p1, p2);
	}


	//внутренняя линия

	if (par.side == "left" || par.side == "two") {
		if(par.template != "прямоугольные") {
			addArc2(shape, dxfPrimitivesArr, sideArcs.left.center, sideArcs.left.rad - nose - params.riserThickness, sideArcs.left.angStart, sideArcs.left.angEnd, false, par.dxfBasePoint)
		}
		if(par.template == "прямоугольные") {
			addLine(shape, dxfPrimitivesArr, p22, p2, par.dxfBasePoint);
		}
	}

	if (par.radiusFactor == 0) {
		addLine(shape, dxfPrimitivesArr, p2, p3, par.dxfBasePoint);
	}
	if (par.radiusFactor != 0) {
		addArc2(shape, dxfPrimitivesArr, frontArc.center, frontArc.rad - params.riserThickness, frontArc.angStart, frontArc.angEnd, false, par.dxfBasePoint)
	}

	if (par.side == "right" || par.side == "two") {
		if(par.template != "прямоугольные") {
			addArc2(shape, dxfPrimitivesArr, sideArcs.right.center, sideArcs.right.rad - nose - params.riserThickness, sideArcs.right.angStart, sideArcs.right.angEnd, false, par.dxfBasePoint);
		}
		if(par.template == "прямоугольные") {
			addLine(shape, dxfPrimitivesArr, p3, p31, par.dxfBasePoint);
		}
	}

	/*	else {
				addLine(shape, dxfPrimitivesArr, p3, p4, par.dxfBasePoint);
				}
	*/
	shape.autoClose = true;
	//console.log(shape)
	
	if(!par.rise) par.rise = params.h1 - params.treadThickness

	var extrudeOptions = {
		amount: par.rise,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var tread = new THREE.Mesh(geom, params.materials.riser);
	tread.rotation.x = Math.PI / 2;
	tread.rotation.z = Math.PI / 2;
	tread.rotation.y = Math.PI;
	par.mesh.add(tread);

	//сохраняем данные для спецификации
	var treadPar = getTreadParams(); //функция в файле calcSpecGeneral.js
	var sizeB = params.h1 - params.treadThickness
	var partName = "riser_arc";
	if (typeof specObj != 'undefined' && params.stairType !== "нет") {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Гнутый подступенок",
				area: 0,
				paintedArea: 0,
				metalPaint: treadPar.metalPaint,
				timberPaint: treadPar.timberPaint,
				division: treadPar.division,
				workUnitName: "amt",
				group: "risers",
			}
		}
		var name = Math.round(sizeA) + "x" + Math.floor(sizeB) + "x" + params.riserThickness;
		var area = sizeA * sizeB / 1000000;
		var paintedArea = area * 2 + (sizeA + sizeB) * 2 * params.riserThickness / 1000000;

		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		specObj[partName]["paintedArea"] += paintedArea;
	}

	par.mesh.specId = partName + name;

	return par;



} //end of drawStartRiser

function calcArcEndPoints(par) {
	par.start = polar(par.center, par.angStart, par.rad);
	par.end = polar(par.center, par.angEnd, par.rad);

	return par;
}
