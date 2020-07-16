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
	var plt = drawPlatform().mesh;
	plt.position.z = params.pltLen
	model.add(plt, "plt");

	//навес
	
	//параметры всех деталей
	partPar = calcCarportPartPar();
	var carport = drawRectCarport(params);
	carport.position.x = params.pltWidth / 2
	carport.position.y = params.pltHeight
	carport.position.z = params.pltLen / 2
	
	model.add(carport, "carport");
	
	
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
	
	var plt = drawMetalPlatform(pltPar).mesh;
	plt.position.y = params.pltHeight - params.treadThickness;
	plt.setLayer('carcas');
	par.mesh.add(plt)
	
	//покрытие площадки
	
	var plateParams = {
			len: params.pltLen,
			width: params.dpcWidth,
			dxfBasePoint: {x:0, y:0},
			dxfArr: [],
			thk: params.treadThickness,
			material: params.materials.tread,
			partName: "dpc",
		};
		
	var decking = new THREE.Object3D();

	var deckAmt = Math.round((params.pltWidth - params.dpcDst) / (params.dpcWidth + params.dpcDst));

	for (var j = 0; j < deckAmt; j++) {
		var treadPlank = drawPlate(plateParams).mesh;
		treadPlank.position.z = (params.dpcWidth + params.dpcDst) * j
		treadPlank.rotation.x = Math.PI / 2
		decking.add(treadPlank);
	}
	
	decking.rotation.y = Math.PI / 2;
	decking.position.y = params.pltHeight;
	decking.setLayer('treads');
	par.mesh.add(decking)
	
	
	//столбы
	var profParmas = getProfParams(params.columnProf);
	var columnsPar = {
		length: params.pltHeight - 20 - params.treadThickness - getProfParams(params.pltBeamProf).sizeA,
		columnProf: params.columnProf,
		len: params.pltLen - profParmas.sizeA,
		amtLen: params.colAmt,
		width: params.pltWidth - profParmas.sizeB,
		amtWidth: params.colAmtWid,
	}
	
	var columns = drawColArray(columnsPar).mesh;
	columns.rotation.y = Math.PI / 2
	columns.position.x = profParmas.sizeB / 2
	columns.position.z = -profParmas.sizeA
	columns.setLayer('racks');
	par.mesh.add(columns);
	
	
	return par;
}