//создаем глобальные массивы
var treads = [];
var risers = [];
var carcas = [];
var railing = [];
var topFloor = [];
var angles = [];
var dxfBasePoint = {
    x: 0,
    y: 0
}


drawStaircase = function(viewportId, isVisible) {

	var x1, x2, y1, y2, x1t, y1t, x2t, y2t;

	var stringerThickness = params.stringerThickness;
	var treadThickness = 40;
	var stringerWidth = 150;
	var riserThickness = 20;
	var treadOffset = 5;
	//var treadWidth = params.M;
	

	/*удаляем предыдущую лестницу*/
	if (treads) removeObjects(viewportId, 'treads');
	if (risers) removeObjects(viewportId, 'risers');
	if (carcas) removeObjects(viewportId, 'carcas');
	if (railing) removeObjects(viewportId, 'railing');
	if (topFloor) removeObjects(viewportId, 'topFloor');
	if (angles) removeObjects(viewportId, 'angles');

	//очищаем глобальные массивы
	treads = [];
	risers = [];
	carcas = [];
	railing = [];
	topFloor = [];
	angles = [];

	/*удаляем контуры*/
	dxfPrimitivesArr = [];

	var stringerParams = {};

	/*задаем материалы*/

	var timberMaterial = new THREE.MeshLambertMaterial({color: params.timberColor, overdraw: 0.5});
	var metalMaterial = new THREE.MeshLambertMaterial({color: params.metalColor, wireframe: false});
	var metalMaterial2 = new THREE.MeshLambertMaterial({color: 0xA3A3A3,wireframe: false});
	var glassMaterial = new THREE.MeshLambertMaterial({opacity: 0.6,color: 0x3AE2CE,transparent: true});
	var concreteMaterial = new THREE.MeshLambertMaterial({color: 0xBFBFBF});

	var stringerMaterial = metalMaterial;
	var floorMaterial = concreteMaterial;
	var flanMaterial = metalMaterial2;
	
	/*материал ступеней*/
	var stairType = params.stairType;
	var treadMaterial = timberMaterial;

	//материалы ограждений задаются внутри функции отрисовки секции

	var topStepPos = {} //точка привязки для поворота лестницы
	var model = params.model;
	var stairModel = params.stairModel;
	var turnSide =  params.turnSide;
	var platformWidth_1 = params.platformWidth_1;
	var platformLength_1 = params.platformLength_1;
	var turnType_1 = params.turnType_1;
	var turnType_2 = params.turnType_2;
	var platformTop = params.platformTop;
	var platformLength_3 = params.platformLength_3;
	var platformTopColumn = params.platformTopColumn;
	var topFlan = params.topFlan;
	var columnModel = params.columnModel;
	var columnAmt = params.columnAmt;
	var columnLength =  params.columnLength;
	var M =  params.M;
	var stringerType = params.stringerType;
	var riserType = params.riserType;
	var stairFrame = params.stairFrame;
	var stairAmt1 =  params.stairAmt1;
	var h1 =  params.h1;
	var b1 =  params.b1;
	var a1 =  params.a1;
	var stairAmt2 =  params.stairAmt2;
	var h2 =  params.h2;
	var b2 =  params.b2;
	var a2 =  params.a2;
	var stairAmt3 =  params.stairAmt3;
	var h3 =  params.h3;
	var b3 =  params.b3;
	var a3 =  params.a3;
	var bottomAngleType = params.bottomAngleType;
	var metalPaint = params.metalPaint;
	var timberPaint = params.timberPaint;
	var topStairType = params.topStairType;
	var marshDist =  params.marshDist;
	var platformRearStringer = params.platformRearStringer;
	var tyrnLength; //Длина площадки
	var stringerTurn; //тип косоура: площадка или забег
	

	if (platformTop == "площадка") stairAmt3 = stairAmt3 + 1;


	/*направление поворота (глобальные переменные)*/

	if (params.turnSide == "правое") turnFactor = 1;
	if (params.turnSide == "левое") turnFactor = -1;

	//параметры ограждений
	var lastMarsh = false; //секция ограждения на верхнем марше
	var topConnection = false; //стыковка секции ограждения с другой секцией сверху
	var bottomConnection = false; //стыковка секции ограждения с другой секцией снизу


//параметры модулей
if(params.model == "Стамет"){
	var moduleStep = 225;
	var moduleRise = params.h1;
	var turnModuleStep = 525;
	var treadWidth = 300;
	var marshWidth = 900;
	}

var nose = treadWidth - moduleStep;
if (params.stairModel == "Прямая" && params.stairAmt1 < 2) {
		alert("Невозможно построить одномаршевую лестницу с количеством ступеней меньше ДВУХ");
		return;
	}

/*** НИЖНИЙ МАРШ ***/

var marshParams1 = {
			botEnd: "floor",
			h: params.h1,
			h1: params.h1,
			b: moduleStep,
			a: treadWidth,
			stairAmt: params.stairAmt1,
			M: marshWidth,
			turnModuleStep: turnModuleStep,
			treadThickness: treadThickness,
			turnFactor: turnFactor,
			treadOffset: treadOffset,
			treadMaterial: treadMaterial,
			carcasMaterial: metalMaterial,
			bolzSide: params.bolzSide1,
			bolzSize: params.bolzSize,
			railingSide: params.railingSide_1,
			railingModel: params.railingModel,			
			treads: new THREE.Object3D(),
			carcas: new THREE.Object3D(),
			angles: new THREE.Object3D(),
			bolz: new THREE.Object3D(),
			railing: new THREE.Object3D(),
			}

	//задание типа верхнего модуля марша для разных вариантов геометрии лестницы
	if (params.stairModel == "Прямая") marshParams1.topEnd = "floor";
	if (params.stairModel == "Г-образная с площадкой") marshParams1.topEnd = "platform";
	if (params.stairModel == "Г-образная с забегом") marshParams1.topEnd = "winder";
	if (params.stairModel == "П-образная с забегом") marshParams1.topEnd = "winder";
	if (params.stairModel == "П-образная трехмаршевая"){
		if(turnType_1 == "забег") marshParams1.topEnd = "winder";
		if(turnType_1 == "площадка") marshParams1.topEnd = "platform";
		} 
	
		marshParams1 = drawMarsh(marshParams1);
		
		if(turnFactor == -1) {
			marshParams1.treads.position.z = -marshWidth;
			marshParams1.carcas.position.z = -marshWidth;
			marshParams1.bolz.position.z = -marshWidth;
			marshParams1.railing.position.z = -marshWidth;
			}
		
		treads.push(marshParams1.treads);
		carcas.push(marshParams1.carcas);
		carcas.push(marshParams1.bolz);
		railing.push(marshParams1.railing);
		
	//колонны нижнего марша
	var columnPos = setColumnPosition(params.stairAmt1);
	var columnParams = {
		height: params.h1 * 5,
		material: metalMaterial,
		type: "column",
		M: params.M,
		dir: "left",
		h: params.h1,
		}
	if(turnFactor == -1) columnParams.dir = "right";

	for (var i=1; i<=params.stairAmt1; i++){
		if (columnPos.indexOf(i) != -1){
			columnParams.height = params.h1 * i;
			if(i > params.consoleStartModule) columnParams.type = "console";
			columnParams = drawColumn(columnParams);
			var column = columnParams.mesh;
			column.position.z = M / 2 * turnFactor;
			column.position.x = moduleStep * i + params.a1 / 2;
			carcas.push(column);
			}		
		}
	
	
		
		
/*** СРЕДНИЙ МАРШ ***/


if (params.stairModel == "П-образная трехмаршевая" || params.stairModel == "П-образная с забегом"){

	var marshParams2 = {
			botEnd: "platform",
			topEnd: "platform",
			h: params.h2,
			h1: params.h2,
			b: moduleStep,
			a: treadWidth,
			stairAmt: params.stairAmt2,
			M: marshWidth,
			turnModuleStep: turnModuleStep,
			treadThickness: treadThickness,
			turnFactor: turnFactor,
			treadOffset: treadOffset,
			treadMaterial: treadMaterial,
			carcasMaterial: metalMaterial,
			bolzSide: params.bolzSide2,
			bolzSize: params.bolzSize,
			railingSide: params.railingSide_2,
			railingModel: params.railingModel,
			treads: new THREE.Object3D(),
			carcas: new THREE.Object3D(),
			angles: new THREE.Object3D(),
			bolz: new THREE.Object3D(),
			railing: new THREE.Object3D(),
			}
		
		
		if(turnType_1 == "забег") marshParams2.botEnd = "winder";
		if(turnType_2 == "забег") marshParams2.topEnd = "winder";

		if(params.stairModel == "П-образная с забегом") {
			marshParams2.botEnd = "winder";
			marshParams2.topEnd = "winder";
			marshParams2.stairAmt = 0;
			marshParams2.bolzSide = marshParams1.bolzSide;
			marshParams2.railingSide = "нет";
			if(params.backRailing_2 == "есть") marshParams2.railingSide = "внешнее забег";
			}
		
		marshParams2 = drawMarsh(marshParams2);
		
	//колонны среднего марша
	var columns = new THREE.Object3D;
	if (params.stairModel == "П-образная трехмаршевая"){		
		var columnPos = setColumnPosition(params.stairAmt2);
		var columnParams = {
			height: params.h1 * 5,
			material: metalMaterial,
			type: "column",
			M: params.M,
			dir: "left",
			h: params.h1,
			}
		if(turnFactor == -1) columnParams.dir = "right";
		for (var i=1; i<=params.stairAmt2; i++){
			if (columnPos.indexOf(i) != -1){
				columnParams.height = params.h2 * i + (params.stairAmt1 + 1) * params.h1;
				if(turnType_1 == "забег") columnParams.height += params.h1 * 2;
				if(columnParams.height/params.h1 > params.consoleStartModule) 
					columnParams.type = "console";
				columnParams = drawColumn(columnParams);
				var column = columnParams.mesh;				
				column.position.x = moduleStep * i + params.a2 / 2;
				column.position.y = params.h2 * i - columnParams.height;
				//if(columnParams.type == "console") column.position.y -= columnParams.height/2; 
				column.position.z = M / 2;
				columns.add(column);
				}		
			}
		}
		
		
		//позиционируем средний марш
		var topMarsh = [
			marshParams2.treads,
			marshParams2.carcas,
			marshParams2.bolz,
			marshParams2.railing,
			columns,			
			]
		
		var rot = -Math.PI/2 * turnFactor
		var x0 = moduleStep * stairAmt1 + marshWidth;
		if(turnFactor == -1) x0 = moduleStep * stairAmt1;
		var	y0 = (stairAmt1 + 1)* moduleRise;
		var z0 = (marshWidth - nose) * turnFactor;	
		
	if(params.stairModel == "П-образная с забегом" || turnType_1 == "забег") y0 = (stairAmt1 + 3)* moduleRise;
	
		for (var i=0; i<topMarsh.length; i++){
			topMarsh[i].rotation.y = rot;
			topMarsh[i].position.x = x0;
			topMarsh[i].position.y = y0;
			topMarsh[i].position.z = z0;
			}
		
		treads.push(marshParams2.treads);
		carcas.push(marshParams2.carcas);
		carcas.push(marshParams2.bolz);
		railing.push(marshParams2.railing);
		carcas.push(columns);
		
	
		
}



/*** ВЕРХНИЙ МАРШ ***/


if (params.stairModel != "Прямая" && params.stairAmt3 != 0){
	var marshParams3 = {
			botEnd: "platform",
			topEnd: "floor",
			h: params.h3,
			h1: params.h3,
			b: moduleStep,
			a: treadWidth,
			stairAmt: params.stairAmt3,
			M: marshWidth,
			turnModuleStep: turnModuleStep,
			treadThickness: treadThickness,
			turnFactor: turnFactor,
			treadOffset: treadOffset,
			treadMaterial: treadMaterial,
			carcasMaterial: metalMaterial,
			bolzSide: params.bolzSide3,
			bolzSize: params.bolzSize,
			railingSide: params.railingSide_3,
			railingModel: params.railingModel,
			treads: new THREE.Object3D(),
			carcas: new THREE.Object3D(),
			angles: new THREE.Object3D(),
			bolz: new THREE.Object3D(),
			railing: new THREE.Object3D(),
			}

		if (params.stairModel == "Г-образная с забегом") marshParams3.botEnd = "winder";
		if (params.stairModel == "П-образная с забегом") marshParams3.botEnd = "winder";
		if (params.stairModel == "П-образная трехмаршевая" && turnType_2 == "забег") 
			marshParams3.botEnd = "winder";
		
		marshParams3 = drawMarsh(marshParams3);
		
		
		//колонны верхнего марша
		var columns = new THREE.Object3D;
		var columnPos = setColumnPosition(params.stairAmt3);
		var columnParams = {
			height: params.h1 * 5,
			material: metalMaterial,
			type: "column",
			M: params.M,
			dir: "left",
			h: params.h1,
			}
		if(turnFactor == -1) columnParams.dir = "right";
		for (var i=1; i<=params.stairAmt3; i++){
			if (columnPos.indexOf(i) != -1){
				columnParams.height = params.h3 * i + (params.stairAmt1 + 1) * params.h1;
				if(params.stairModel == "Г-образная с забегом") columnParams.height += params.h1 * 2;
				if (params.stairModel == "П-образная с забегом") columnParams.height += params.h1 * 5;
				if (params.stairModel == "П-образная трехмаршевая") {
					columnParams.height += params.h2 * (params.stairAmt2 + 1);
					if(turnType_1 == "забег") columnParams.height += params.h2 * 2;
					if(turnType_2 == "забег") columnParams.height += params.h2 * 2;
					}
				if(columnParams.height/params.h1 > params.consoleStartModule) 
					columnParams.type = "console";
				columnParams = drawColumn(columnParams);
				var column = columnParams.mesh;
				column.position.x = moduleStep * i + params.a3 / 2;
				column.position.y = params.h3 * i - columnParams.height;
				//if(columnParams.type == "console") column.position.y -= columnParams.height/2; 
				column.position.z = M / 2;
				columns.add(column);			 	
				}		
			}
		
	//позиционируем верхний марш
		var topMarsh = [
			marshParams3.treads,
			marshParams3.carcas,
			marshParams3.bolz,
			marshParams3.railing,
			columns,
			]
	
	if (params.stairModel == "Г-образная с площадкой"){
		var rot = -Math.PI/2 * turnFactor
		var x0 = moduleStep * stairAmt1 + marshWidth;
		if(turnFactor == -1) x0 = moduleStep * stairAmt1;
		var	y0 = (stairAmt1 + 1)* moduleRise;
		var z0 = (marshWidth - nose) * turnFactor;	
		}
	if (params.stairModel == "Г-образная с забегом"){
		var rot = -Math.PI/2 * turnFactor
		var x0 = moduleStep * stairAmt1 + marshWidth;
		if(turnFactor == -1) x0 = moduleStep * stairAmt1;
		var	y0 = (stairAmt1 + 3) * moduleRise;
		var z0 = (marshWidth - nose) * turnFactor;	
		}
	
	if (params.stairModel == "П-образная с забегом"){
		var rot = -Math.PI * turnFactor
		var x0 = moduleStep * stairAmt1 + nose;
		var	y0 = (stairAmt1 + 6) * moduleRise;
		var z0 = (marshWidth * 2 - nose) * turnFactor;
		if(turnFactor == -1) z0 += marshWidth;
		}
	if (params.stairModel == "П-образная трехмаршевая"){
		var rot = -Math.PI * turnFactor
		var x0 = moduleStep * stairAmt1 + nose;
		var	y0 = (stairAmt1 + stairAmt2 + 2) * moduleRise;
		if(turnType_1 == "забег") y0 += moduleRise * 2;
		if(turnType_2 == "забег") y0 += moduleRise * 2;
		var z0 = (stairAmt2 * moduleStep + marshWidth * 2 - nose) * turnFactor;
		if(turnFactor == -1) z0 += marshWidth;
		}
	
		
		
		for (var i=0; i<topMarsh.length; i++){
			topMarsh[i].rotation.y = rot;
			topMarsh[i].position.x = x0;
			topMarsh[i].position.y = y0;
			topMarsh[i].position.z = z0;
			}
		
		treads.push(marshParams3.treads);
		carcas.push(marshParams3.carcas);
		carcas.push(marshParams3.bolz);
		railing.push(marshParams3.railing);
		carcas.push(columns);
	
}	

//колонны на поворотах
if(params.stairModel == "Г-образная с площадкой"){
	var columnParams = {
		height: params.h1 * 5,
		material: metalMaterial,
		type: "column",
		M: params.M,
		dir: "left",
		h: params.h1,
		}
	if(turnFactor == -1) columnParams.dir = "right";

	columnParams.height = (params.stairAmt1) * params.h1;
	if(columnParams.height/params.h1 > params.consoleStartModule) 
		columnParams.type = "console";
	columnParams = drawColumn(columnParams);
	var column = columnParams.mesh;
	column.position.x = moduleStep * (params.stairAmt1 - 1) + turnModuleStep + params.a3 / 2;
	column.position.z = M / 2 * turnFactor;
	carcas.push(column);
	}
	
	
if(params.stairModel == "Г-образная с забегом"){
	var columnParams = {
		height: params.h1 * 5,
		material: metalMaterial,
		type: "column",
		M: params.M,
		dir: "left",
		h: params.h1,
		}
	if(turnFactor == -1) columnParams.dir = "right";
	columnParams.height = (params.stairAmt1 + 1) * params.h1;
	if(columnParams.height/params.h1 > params.consoleStartModule) 
		columnParams.type = "console";
	columnParams = drawColumn(columnParams);
	var column = columnParams.mesh;
	var ang1 = 25.6244/ 180 * Math.PI ; //Угол поворота модуля забега - снят с модели 
	column.position.x = moduleStep * (params.stairAmt1) + params.a3 / 2 + moduleStep * Math.cos(ang1);
	column.position.z = (M / 2 + moduleStep * Math.sin(ang1)) * turnFactor;
	carcas.push(column);
	}
	
if(params.stairModel == "П-образная с забегом"){
	var columnParams = {
		height: params.h1 * 5,
		material: metalMaterial,
		type: "column",
		M: params.M,
		dir: "left",
		h: params.h1,
		}
	if(turnFactor == -1) columnParams.dir = "right";
	
	//колонна под нижним поворотом
	columnParams.height = (params.stairAmt1 + 1) * params.h1;
	if(columnParams.height/params.h1 > params.consoleStartModule) 
		columnParams.type = "console";
	columnParams = drawColumn(columnParams);
	var column = columnParams.mesh;
	var ang1 = 25.6244/ 180 * Math.PI ; //Угол поворота модуля забега - снят с модели 
	column.position.x = moduleStep * (params.stairAmt1) + params.a3 / 2 + moduleStep * Math.cos(ang1);
	column.position.z = (M / 2 + moduleStep * Math.sin(ang1)) * turnFactor;
	carcas.push(column);
	
	//колонна под верхним поворотом
	columnParams.dir = "right";
	if(turnFactor == -1) columnParams.dir = "left";
	columnParams.height = (params.stairAmt1 + 1) * params.h1 + 3 * params.h3;
	columnParams = drawColumn(columnParams);
	var column = columnParams.mesh;
	column.position.x = moduleStep * (params.stairAmt1) + M/2 - moduleStep * Math.sin(ang1);
	column.position.z = (M  + 75 + moduleStep * Math.cos(ang1)) * turnFactor;
	carcas.push(column);
	
	
	}
if (params.stairModel == "П-образная трехмаршевая"){
	var columnParams = {
		height: params.h1 * 5,
		material: metalMaterial,
		type: "column",
		M: params.M,
		dir: "left",
		h: params.h1,
		}
	if(turnFactor == -1) columnParams.dir = "right";

	//колонна под нижним поворотом
	columnParams.height = (params.stairAmt1) * params.h1;
	if(turnType_1 == "забег") columnParams.height += params.h1;
	if(columnParams.height/params.h1 > params.consoleStartModule) 
		columnParams.type = "console";
	columnParams = drawColumn(columnParams);
	var column = columnParams.mesh;
	column.position.x = moduleStep * (params.stairAmt1 - 1) + turnModuleStep + params.a3 / 2;
	column.position.z = M / 2 * turnFactor;
	if(turnType_1 == "забег"){
		var ang1 = 25.6244/ 180 * Math.PI ; //Угол поворота модуля забега - снят с модели 
		column.position.x = moduleStep * (params.stairAmt1) + params.a3 / 2 + moduleStep * Math.cos(ang1);
		column.position.z = (M / 2 + moduleStep * Math.sin(ang1)) * turnFactor;
		}
	carcas.push(column);
	
	//колонна под верхним повротом
	columnParams.dir = "right";
	if(turnFactor == -1) columnParams.dir = "left";
	columnParams.height = (params.stairAmt1 + 1) * params.h1 + params.stairAmt2 * params.h2;
	if(turnType_1 == "забег") columnParams.height += params.h1 * 2;
	if(turnType_2 == "забег") columnParams.height += params.h2;
	if(columnParams.height/params.h1 > params.consoleStartModule) 
		columnParams.type = "console";
	columnParams = drawColumn(columnParams);
	var column = columnParams.mesh;
	column.position.x = moduleStep * (params.stairAmt1 - 1) + turnModuleStep + params.a3 / 2;
	column.position.z = (M * 1.5 + params.stairAmt2 * params.h2 - 75) * turnFactor;
	if(turnType_2 == "забег"){
		var ang1 = 25.6244/ 180 * Math.PI ; //Угол поворота модуля забега - снят с модели 
		column.position.x = moduleStep * (params.stairAmt1) + M/2 - moduleStep * Math.sin(ang1);
		column.position.z = (M  + 75 + moduleStep * (params.stairAmt2) + moduleStep * Math.cos(ang1)) * turnFactor;
		}
	carcas.push(column);
	
	}

//сдвигаем и поворачиваем лестницу чтобы верхний марш был вдоль оси Х

	var topTreadOffset = 6//зазор от верхней ступени до перекрытия
	
	if(params.stairModel == "Прямая"){
		var pos={
			x: (params.stairAmt1 - 1) * moduleStep + treadWidth + topTreadOffset,
			z: 0,
			}
		var rot = 0;
		}
	if(params.stairModel == "Г-образная с площадкой" || params.stairModel == "Г-образная с забегом"){
		var pos={
			x: (marshWidth + params.stairAmt3 * moduleStep + topTreadOffset),// * turnFactor,
			z: (marshWidth + params.stairAmt1 * moduleStep) * turnFactor,
			}
		var rot = Math.PI / 2 * turnFactor;
		}
	if(params.stairModel == "П-образная с забегом"){
		var pos={
			x: (params.stairAmt3 - params.stairAmt1) * moduleStep + topTreadOffset,
			z: (marshWidth * 2 - 75)* turnFactor,
			}
		var rot = Math.PI;
		}
	if(params.stairModel == "П-образная трехмаршевая"){
	var pos={
			x: (params.stairAmt3 - params.stairAmt1) * moduleStep + topTreadOffset,
			z: (marshWidth * 2 - 75 + params.stairAmt2 * moduleStep)* turnFactor,
			}
		var rot = Math.PI;	
		}
	
	
		

	var model = [
		treads,
		risers,
		carcas,
		railing,
		]
	var modelObj = [];
	
	for (var i=0; i<model.length; i++){
		modelObj[i] = new THREE.Object3D();
		
		for (var j=0; j<model[i].length; j++){
			modelObj[i].add(model[i][j]);
			}
		modelObj[i].position.x += -pos.x + params.staircasePosX;
		modelObj[i].position.z += pos.z + params.staircasePosZ;
		modelObj[i].rotation.y = rot;
		}
		treads = [
			modelObj[0],
			]
		risers = [
			modelObj[1],
			]
		carcas = [
			modelObj[2],
			]
		railing = [
			modelObj[3],
			]

		
//добавляем объекты в сцену
		addObjects(viewportId, treads, 'treads');
		addObjects(viewportId, risers, 'risers');
		addObjects(viewportId, carcas, 'carcas');
		addObjects(viewportId, railing, 'railing');

//измерение размеров на модели
	addMeasurement(viewportId);


}//end of drawStaircase