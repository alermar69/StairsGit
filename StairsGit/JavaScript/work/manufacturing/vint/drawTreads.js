function addVintTreads(par) {
	var treadParams = {
		treadAngle: par.treadAngle,
		treadLowRad: par.treadLowRad,
		columnDiam: par.columnDiam,
		holeDiam: par.holeDiam,
		type: "timber",
		material: params.materials.tread,
		dxfArr: dxfPrimitivesArr,
		turnFactor: turnFactor,
		isFrame: params.stairType == 'рамки'
	}

	if (params.model.indexOf("Спиральная") != -1) {
		treadParams.isMonoSpiral = true;
		treadParams.columnDiam = params.staircaseDiam - params.M * 2;
	}
	if (params.stairType == "рифленая сталь" || params.stairType == "лотки под плитку" || params.stairType == 'рамки') treadParams.type = "metal";
	if (treadParams.type == "metal" && params.stairType !== 'рамки') treadParams.material = params.materials.metal;
	var divides = [];
	if (!treadParams.isMonoSpiral) divides = calcDivides(par.stepHeight);

	//отрисовывамем винтовую ступень
	var posY = par.stepHeight;
	var vintTreadsObj = new THREE.Object3D();
	
	for (var i = 0; i < par.stairAmt; i++) {
		if (par.stairType != "metal" && i < par.regShimAmt && !treadParams.isMonoSpiral) posY += par.regShimThk;
		//определяем наличие разделения тетив под ступенью
		treadParams.isDivide = false;
		if (divides.length > 0) {
			if (divides.indexOf(i + 1) != -1) {
				treadParams.isDivide = true;
			}
		}
		if (par.isBolz) treadParams.isDivide = false;
		treadParams = drawVintTread(treadParams);
		var tread = treadParams.mesh;
		tread.rotation.y = par.stepAngle * i * turnFactor + par.startAngle;
		tread.position.x = 0;
		tread.position.y = posY;
		tread.position.z = 0;
		tread.castShadow = true;
		vintTreadsObj.add(tread);

		posY += par.stepHeight;
		if (par.stairType == "metal" && i < par.regShimAmt && !treadParams.isMonoSpiral) posY += par.regShimThk;

		//контура остальных ступеней кроме первой добавляем в мусорный масси
		treadParams.dxfArr = dxfPrimitivesArr0;
	}

	window.vintTreads = vintTreadsObj;
	par.mesh = vintTreadsObj;
	par.treadParams = treadParams;
	return par;
}

function addStrightTreads(par){
	var treadsObj = new THREE.Object3D();
	var treadParams = {
		marshId: 1,
		dxfBasePoint: {x:0,y:0}
	}
	var marshObj = drawMarshTreads2(treadParams)
    var marshTreads = marshObj.treads;
    var marshRisers = marshObj.risers;
	marshTreads.marshId = 1;

	treadsObj.add(marshTreads);
	treadsObj.add(marshRisers);

	// Позицинируем объект
	var wrapper = new THREE.Object3D();
	treadsObj.position.x = -getMarshParams(1).len - par.columnDiam;
	treadsObj.position.z = -params.M / 2 - par.columnDiam / 2;
	wrapper.add(treadsObj)
	wrapper.rotation.y = par.firstStepAngle + par.startAngle - Math.PI / 2;// + par.stepAngle;

	return wrapper;
}