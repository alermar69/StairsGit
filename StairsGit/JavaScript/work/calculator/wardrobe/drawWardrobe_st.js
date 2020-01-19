//создаем глобальные массивы
var carcas_wr = []; 
var wrCarcas1 = []; 
var wrCarcas2 = [];
var doors = [];
var shelfs = [];
var metis = [];
var wardrobeParams = {};
var dxfBasePoint = {x:0, y:0,}

//функция - оболочка
function drawWardrobeMarsh1(viewportId, isVisible) {

//удаляем предыдущий шкаф
	if (wrCarcas1) removeObjects(viewportId, 'wrCarcas1');
	if (wrCarcas2) removeObjects(viewportId, 'wrCarcas2');
	if (carcas_wr) removeObjects(viewportId, 'carcas_wr');
	if (doors) removeObjects(viewportId, 'doors');
	if (shelfs) removeObjects(viewportId, 'shelfs');
	if (metis) removeObjects(viewportId, 'metis');

//очищаем глобальные массивы
	carcas_wr = [];
	wrCarcas1 = []; 
    wrCarcas2 = []; 
	doors = [];
	shelfs = [];
	metis = [];
	wrParams = {};
	wrPrice = {};
	wrCost = {};

if(params.marsh_wr != "нет"){	
	var staircaseAngle = Math.atan(params.h1/params.b1)
	var minHeight = params.minHeight_wr;
	var maxHeight = minHeight + params.width_wr * Math.tan(staircaseAngle);
	var marsh1Height = params.h1 * (params.stairAmt1 + 1) - params.pltThk_wr;
	if(maxHeight > marsh1Height) maxHeight = marsh1Height;
	
	if(params.marsh_wr == "средний марш"){
		var staircaseAngle = Math.atan(params.h2/params.b2)
		var minHeight = params.h1 * (params.stairAmt1 + 1) - params.pltThk_wr;
		if(params.turnType_1 == "забег") minHeight += params.h1 * 2;		
		var maxHeight = minHeight + params.width_wr * Math.tan(staircaseAngle);
		var marsh3Height = minHeight + params.h2 * (params.stairAmt2 + 1);
		if(maxHeight > marsh3Height) maxHeight = marsh3Height;		
		}
		
	if(params.marsh_wr == "верхний марш"){
		var staircaseAngle = Math.atan(params.h3/params.b3)
		var minHeight = params.h1 * (params.stairAmt1 + 1) - params.pltThk_wr;
		if(params.stairModel == "Г-образная с забегом") minHeight += params.h3 * 2;
		if(params.stairModel == "П-образная с забегом") minHeight += params.h3 * 5;
		if(params.stairModel == "П-образная трехмаршевая") {
			minHeight += params.h2 * (params.stairAmt2 + 1);
			if(params.turnType_1 == "забег") minHeight += params.h1 * 2;
			if(params.turnType_2 == "забег") minHeight += params.h2 * 2;
			}
		var maxHeight = minHeight + params.width_wr * Math.tan(staircaseAngle);
		var marsh3Height = minHeight + params.h3 * (params.stairAmt3 + 1);
		if(maxHeight > marsh3Height) maxHeight = marsh3Height;		
		}

	var wardrobeParams = {
		sectAmt_wr: params.sectAmt_wr,
		model_wr: params.model_wr,
		width_wr: params.width_wr,
		heightLeft_wr: minHeight*1.0,
		heightRight_wr: maxHeight*1.0,
		angleTop_wr: staircaseAngle  * 180 / Math.PI,
		depth_wr: params.depth_wr,
		topOnlay_wr: params.topOnlay_wr,
		carcasThk_wr: params.carcasThk_wr,
		doorsThk_wr: params.doorsThk_wr,
		maxRowAmt_wr: params.maxRowAmt_wr,
		kupeDoorAmt_wr: params.kupeDoorAmt_wr,
		dxfBasePoint: dxfBasePoint,
		}
	if(params.frontSide_wr == "слева"){
		wardrobeParams.heightLeft_wr = maxHeight * 1.0;
		wardrobeParams.heightRight_wr = minHeight * 1.0;
		}
	//параметры секций
	wardrobeParams.sections = [];
	for (var i=0; i<params.sectAmt_wr; i++){
		wardrobeParams.sections[i] = {
			width: $("#sectWidth" + i).val() * 1.0,
			type: $("#door" + i).val(),
			}
		}
		
	//параметры полок
	wardrobeParams.boxes = [];
	var i = 0;
	$(".boxParams").each(function(){
		wardrobeParams.boxes[i] = {
			sect: $(this).find("#boxSect" + i).val(),
			posX: parseFloat($(this).find("#boxPosX" + i).val()),
			posY: parseFloat($(this).find("#boxRow" + i).val()),
			height: parseFloat($(this).find("#boxHeight" + i).val()),
			type: $(this).find("#boxType" + i).val(),
			widthType: $(this).find("#boxWidthType" + i).val(),
			width: parseFloat($(this).find("#boxWidth" + i).val()),
			boxDoorPlusIn: parseFloat($(this).find("#boxDoorPlusIn" + i).val()),
			boxDoorPlusRight: parseFloat($(this).find("#boxDoorPlusRight" + i).val()),
			boxDoorPlusLeft: parseFloat($(this).find("#boxDoorPlusLeft" + i).val()),
			boxDoorPlusTop: parseFloat($(this).find("#boxDoorPlusTop" + i).val()),
			boxDoorPlusBot: parseFloat($(this).find("#boxDoorPlusBot" + i).val()),
			boxCarcasHeight: parseFloat($(this).find("#boxCarcasHeight" + i).val()),
			}
		i++;		
		});
	

wardrobeParams = drawWardrobe(wardrobeParams);
carcas_wr.push(wardrobeParams.wrCarcas)
if(wardrobeParams.wrCarcas1) wrCarcas1.push(wardrobeParams.wrCarcas1)
if(wardrobeParams.wrCarcas2) wrCarcas2.push(wardrobeParams.wrCarcas2)
doors.push(wardrobeParams.wrDoors)
shelfs.push(wardrobeParams.wrShelfs)
metis.push(wardrobeParams.wrMetis)

//поворачиваем шкаф

//console.log(params.starcasePos)

if(params.marsh_wr == "нижний марш"){
	var rot = params.starcasePos.rot;	
	var pos = {
		x: params.starcasePos.x,
		z: params.starcasePos.z,	
		}
		
	if(params.stairModel == "Прямая" || params.stairModel == "Прямая двухмаршевая"){
		pos.x -= params.lenPos_wr;
		pos.z += params.depthPos_wr;
		if(params.frontSide_wr == "слева") {
			pos.x -= params.width_wr;
			pos.z += params.depth_wr;
			}
		if(params.turnSide == "левое") pos.z -= params.M;
		}
	if(params.stairModel == "Г-образная с площадкой" || params.stairModel == "Г-образная с забегом"){
		pos.z -= params.lenPos_wr;
		pos.x -= params.depthPos_wr;
		if(params.frontSide_wr == "слева" && params.turnSide == "правое") {
			pos.x -= params.depth_wr;  
			pos.z -= params.width_wr;			
			}
		if(params.turnSide == "левое") {
			if(params.frontSide_wr == "справа") {
				pos.z += params.M;
				pos.x -= params.M;		
				}
			
			if(params.frontSide_wr == "слева") {
				pos.x += 0//params.depth_wr;
				pos.z = params.starcasePos.z + params.width_wr + 450; 			
				}
			}
		}
	if(params.stairModel == "П-образная с площадкой" || params.stairModel == "П-образная с забегом" || params.stairModel == "П-образная трехмаршевая"){
		pos.x += params.lenPos_wr;
		pos.z -= params.depthPos_wr;
		if(params.frontSide_wr == "слева") {
			pos.x += params.width_wr;
			pos.z -= params.depth_wr;
			}
		if(params.turnSide == "левое") pos.z += params.M;
		}
		
	if(params.frontSide_wr == "слева"){
		rot += Math.PI;		
		}
}	

if(params.marsh_wr == "средний марш"){
	var rot = Math.PI / 2;
	if(params.turnSide == "левое") rot = -Math.PI / 2;
	var pos = {
		x: params.starcasePos.x + params.depth_wr,
		z: params.starcasePos.z - params.M,	
		}
	if(params.turnSide == "левое") {
		pos.x = params.starcasePos.x
		pos.z = params.starcasePos.z + params.M;
		}
	
	pos.x += params.b1 * params.stairAmt1;
	
	if(params.frontSide_wr == "слева") {
		rot += Math.PI;
		if(params.turnSide == "правое") {
			pos.x -= params.depth_wr;
			pos.z -= params.width_wr;
			}
		if(params.turnSide == "левое") {
			pos.x += params.depth_wr;
			pos.z += params.width_wr;
			}
		}

	pos.x -= params.depthPos_wr;
	
}

if(params.marsh_wr == "верхний марш"){
	var rot = 0;	
	var pos = {
		x: params.stairAmt3 * params.b3 + params.lenPos_wr,
		z: params.depthPos_wr,	
		}
	
	if(params.turnSide == "левое" && params.frontSide_wr == "справа") pos.z -= params.M;
		
	if(params.frontSide_wr == "слева"){
		rot += Math.PI;
		pos.x -= params.width_wr;
		}
	
	if(params.turnSide == "правое" && params.frontSide_wr == "слева") pos.z += params.M;
	
	if(params.platformTop == "площадка"){
		pos.x += params.platformLength_3;
		}
	
	
}

pos.y = params.legsHeight_wr;



	var model = [
		carcas_wr,
		wrCarcas1,
		wrCarcas2,
		doors,
		shelfs,
		metis,
		]
	var modelObj = [];
	
	//console.log(model)
	
	for (var i=0; i<model.length; i++){
		modelObj[i] = new THREE.Object3D();
		
		for (var j=0; j<model[i].length; j++){
			modelObj[i].add(model[i][j]);
			}
		modelObj[i].position.x += -pos.x + params.staircasePosX;
		modelObj[i].position.y += pos.y + params.staircasePosY;
		modelObj[i].position.z += pos.z + params.staircasePosZ;
		modelObj[i].rotation.y = rot;
		}

		carcas_wr = [
			modelObj[0],
			]
		wrCarcas1 = [
			modelObj[1],
			]
		wrCarcas2 = [
			modelObj[2],
			]
		doors = [
			modelObj[3],
			]
		shelfs = [
			modelObj[4],
			]
		metis = [
			modelObj[5],
			]
		
		

//добавляем белые ребра для всех объектов
for (var i = 0; i < wrCarcas1.length; i++) addWareframe(wrCarcas1[i], wrCarcas1);
for (var i = 0; i < wrCarcas2.length; i++) addWareframe(wrCarcas2[i], wrCarcas2);
for (var i = 0; i < carcas_wr.length; i++) addWareframe(carcas_wr[i], carcas_wr);
for (var i = 0; i < doors.length; i++) addWareframe(doors[i], doors);
for (var i = 0; i < shelfs.length; i++) addWareframe(shelfs[i], shelfs);
for (var i = 0; i < metis.length; i++) addWareframe(metis[i], metis);
	
//добавляем объекты в сцену
addObjects(viewportId, wrCarcas1, 'wrCarcas1');
addObjects(viewportId, wrCarcas2, 'wrCarcas2');
addObjects(viewportId, carcas_wr, 'carcas_wr');
addObjects(viewportId, doors, 'doors');
addObjects(viewportId, shelfs, 'shelfs');
addObjects(viewportId, metis, 'metis');

//измерение размеров на модели
	addMeasurement(viewportId);
}
}//drawWardrobe;

