var boltDiam = 10;
var boltLen = 30;
var boltBulge = 1;
var partPar = {};

drawVeranda = function (par) {
	var viewportId = 'vl_1';
	//удаляем старую лестницу
	for(var layer in layers){
		removeObjects(viewportId, layer);
	}
	
	//очищаем глобальный массив параметров для спецификации
	staircasePartsParams = {
		carport: []
	};

	var model = {
		objects: [],
		add: function(obj, layer){
			var objInfo = {
				obj: obj,
				layer: layer,
			}
			this.objects.push(objInfo);
		},
	};
	
	//обнуляем счетчики спецификации
	partsAmt = {};
	partsAmt_bal = {unit: "banister"}
	specObj = partsAmt; //задаем объект, куда будут сохраняться данные для спецификации
	poleList = {};
	railingParams = {};
	shapesList = [];
	dxfPrimitivesArr = [];
	
	//параметры всех деталей
	
	var axis = new THREE.AxisHelper( 2000 );
	model.add(axis);
	
	//площадка
	if (params.pltType == 'отдельная') {
		var plt = drawPlatform().mesh;
		plt.position.z = params.pltLen
		model.add(plt, "plt");
	}

	//навес

	//параметры всех деталей
	partPar = calcCarportPartPar();
	var carport = drawRectCarport(params);
	carport.rotation.y = THREE.Math.degToRad(params.carportRot);
	carport.position.x = params.pltWidth / 2 + params.carportPosX
	carport.position.y = params.pltHeight + params.carportPosY
	carport.position.z = params.pltLen / 2 + params.carportPosZ
	
	model.add(carport, "carport");

	if (params.pltType == 'единая с лестницей') {
		params.calcType = 'vhod';
		//params.platformTop = 'площадка';
		//if (params.pltLen !== params.M) params.platformTop = 'увеличенная';
		//params.platformLength_3 = params.pltWidth;
		//params.platformWidth_3 = params.pltLen
	}
	
	
	//ступени лестницы
	treadsObj = drawTreads();
	
	treadsObj.treads.isStaircasePart = true;
	treadsObj.risers.isStaircasePart = true;
	
	model.add(treadsObj.treads, "treads");
	model.add(treadsObj.risers, "risers");
	
	//каркас лестницы
	var carcasPar = {
		dxfBasePoint: {
			x: 0,
			y: 2000
		},
		treadsObj: treadsObj,
	}

	carcasObj = drawCarcas(carcasPar);
	
	carcasObj.mesh.isStaircasePart = true;
	carcasObj.angles.isStaircasePart = true;

	model.add(carcasObj.mesh, "carcas");
	model.add(carcasObj.angles, "angles");


	/***  ОГРАЖДЕНИЯ НА ВСЕ ЛЕСТНИЦЫ  ***/

	var railingPar = {
		dxfBasePoint: {
			x: 0,
			y: 20000
		},
		treadsObj: treadsObj,
		stringerParams: carcasPar.stringerParams,
	};

	var railingObj = drawRailing(railingPar);

	railingObj.mesh.isStaircasePart = true;
	railingObj.forgedParts.isStaircasePart = true;
	railingObj.handrails.isStaircasePart = true;

	model.add(railingObj.mesh, "railing");
	model.add(railingObj.forgedParts, "forge");
	model.add(railingObj.handrails, "handrails");
	
	
	


	//сдвигаем и поворачиваем лестницу чтобы верхний марш был вдоль оси Х
	//Задаем параметры для выбора базовой кромки
	params.floorHoleLength = -params.pltWidth
	params.floorHoleWidth = params.pltLen
	var moove = calcStaircaseMoove(treadsObj.lastMarshEnd);
	
	for(var i=0; i<model.objects.length; i++){		
		var obj = model.objects[i].obj;
		obj.layerName = model.objects[i].layer;
		
		//позиционируем части лестницы
		if(obj.isStaircasePart){
			obj.position.x += moove.x;// + params.staircasePosX;
			obj.position.y += moove.y;//params.staircasePosY;
			obj.position.z += moove.z;// + params.staircasePosZ + params.M / 2 * turnFactor;
			obj.rotation.y = moove.rot;
		}
		
		//добавляем в сцену
		addObjects(viewportId, obj, model.objects[i].layer);
	}

	//измерение размеров на модели
	addMeasurement(viewportId);

	if (typeof staircaseLoaded !== undefined) staircaseLoaded();
};

function drawPlatform(par){
	if(!par) par = {};
	par.mesh = new THREE.Object3D();

	//столбы
	var profParmas = getProfParams(params.pltColumnProf);
	var columnsPar = {
		length: params.pltHeight - 20 - params.treadThickness - getProfParams(params.pltBeamProf).sizeA,
		columnProf: params.pltColumnProf,
		len: params.pltLen - profParmas.sizeA,
		amtLen: params.colAmt,
		width: params.pltWidth - profParmas.sizeB,
		amtWidth: params.colAmtWid,
	}

	if (params.pltSideBeam == 'тетива') {
		columnsPar.offset = 80; // отступ колонн с краю, чтобы поместились уголки соединения тетив
	}

	var columns = drawColArray(columnsPar).mesh;
	columns.rotation.y = Math.PI / 2
	columns.position.x = profParmas.sizeB / 2
	columns.position.z = -profParmas.sizeA
	columns.setLayer('racks');
	par.mesh.add(columns);

	//каркас площадки
	var pltPar = {
		len: params.pltLen,
		width: params.pltWidth,
		beamStep: 500,
		beamProf_front: params.pltBeamProf,
		beamProf_rear: params.pltBeamProf,
		beamProf_left: params.pltBeamProf,
		beamProf_right: params.pltBeamProf,
		beamProf_mid: params.pltBeamMidProf,
		coverType: "нет",		
	}

	if (params.pltSideBeam == 'тетива') {
		pltPar.stringerWidth = 200;
		pltPar.stringerThickness = 8;
		pltPar.isSideStringer = true;
		pltPar.dxfBasePoint = par.dxfBasePoint;
		pltPar.posCoumns = columnsPar.posCoumns;
	}
	
	var plt = drawMetalPlatform(pltPar).mesh;
	plt.position.y = params.pltHeight - params.treadThickness;
	plt.setLayer('carcas');
	par.mesh.add(plt)
	
	//покрытие площадки

	var decking = new THREE.Object3D();
	
	var plateParams = {
			len: params.pltLen,
			width: params.dpcWidth,
			dxfBasePoint: {x:0, y:0},
			dxfArr: [],
			thk: params.treadThickness,
			material: params.materials.tread,
			partName: "dpc",
	};

	var width = params.pltWidth;

	if (params.floorCoverDir == 'по ширине') {
		plateParams.len = params.pltWidth;
		width = params.pltLen;
	}

	var step = params.dpcWidth + params.dpcDst;

	var deckAmt = Math.ceil((width - params.dpcDst) / step);

	var offset = step * deckAmt - width;

	var lastWidth = plateParams.width - offset + params.dpcDst;

	if (plateParams.width - offset <= 45) {
		deckAmt -= 1;
		lastWidth += plateParams.width + params.dpcDst
	}

	for (var j = 0; j < deckAmt; j++) {
		if (j == (deckAmt - 1)) plateParams.width = lastWidth

		var treadPlank = drawPlate(plateParams).mesh;

		treadPlank.position.z = (params.dpcWidth + params.dpcDst) * j
		treadPlank.rotation.x = Math.PI / 2
		if (params.floorCoverDir == 'по ширине') {
			treadPlank.rotation.z = Math.PI / 2
			treadPlank.position.z = 0
			treadPlank.position.x = step * j + plateParams.width
		}
		decking.add(treadPlank);
	}
	
	decking.rotation.y = Math.PI / 2;
	decking.position.y = params.pltHeight;
	decking.setLayer('treads');
	par.mesh.add(decking)
	
	
	
	
	
	return par;
}


/** функция отрисовывает боковую тетиву площадки  **/
function drawSideStringerPlt(par) {
	par.mesh = new THREE.Object3D();
	var angles = new THREE.Object3D();

	var p0 = { "x": 0, "y": 0.0 };
	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p1, 0, par.stringerWidth);
	var p3 = newPoint_xy(p2, par.length, 0);
	var p4 = newPoint_xy(p1, par.length, 0);

	var points = [p1, p2, p3, p4];

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
	}

	par.stringerShape = drawShapeByPoints2(shapePar).shape;

	// отверстия под колонны
	if (par.isHoleColumn) {
		par.pointsHole = [];
		var offsetY = params.treadThickness + par.profileY + 20; //отступ снизу тетивы до верха колонны

		for (var i = 0; i < par.posCoumns.length; i++) {
			var center1 = newPoint_xy(p2, par.posCoumns[i] + par.stringerThickness, -offsetY);
			var center2 = newPoint_xy(center1, 0, -60);
			par.pointsHole.push(center1, center2);
		}

		drawStringerHoles(par);
	}

	//отверстия под уголки соединения тетив
	var offsetY = 20; //отступ снизу тетивы до уголка
	par.pointsHole = [];
	var center1 = newPoint_xy(p1, 30, 20 + offsetY);
	if (par.isFront || par.isRear) center1.x += par.stringerThickness;
	var center2 = newPoint_xy(center1, 0, 60);
	var center3 = newPoint_xy(p4, -30, 20 + offsetY);
	if (par.isFront || par.isRear) center3.x -= par.stringerThickness;
	var center4 = newPoint_xy(center3, 0, 60);
	par.pointsHole.push(center1, center2, center3, center4);

	drawStringerHoles(par);


	var extrudeOptions = {
		amount: par.stringerThickness - 0.01,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	//тетива
	var geom = new THREE.ExtrudeGeometry(par.stringerShape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var stringer = new THREE.Mesh(geom, params.materials.metal);
	par.mesh.add(stringer);

	// уголки соединения тетив
	if (par.isFront || par.isRear) {

		var anglePar = {
			model: "У4-60х60х100",
		}

		// левый уголок
		var angle = drawAngleSupport(anglePar)
		angle.rotation.z = Math.PI / 2;
		angle.rotation.y = Math.PI / 2;
		angle.position.x = par.stringerThickness;
		angle.position.y = offsetY;
		angle.position.z = par.stringerThickness;
		if (par.isRear) {
			angle.rotation.y += Math.PI / 2;
			angle.position.z = 0;
		}
		angles.add(angle);

		// правый уголок
		var angle = drawAngleSupport(anglePar)
		angle.rotation.z = Math.PI / 2;
		angle.position.x = par.length - par.stringerThickness;
		angle.position.y = offsetY;
		angle.position.z = par.stringerThickness;
		if (par.isRear) {
			angle.rotation.y = -Math.PI / 2;
			angle.position.z = 0;
		}
		angles.add(angle);

		angles.setLayer('angles');
		par.mesh.add(angles);
	}

	return par;
}