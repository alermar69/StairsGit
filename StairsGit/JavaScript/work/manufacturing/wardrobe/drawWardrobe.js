//создаем глобальные массивы
var carcas_wr = []; 
var wrCarcas1 = []; 
var wrCarcas2 = [];
var doors = [];
var shelfs = [];
var metis = [];
var wireframesinter = [];



var dxfPrimitivesArr = [];
var wardrobeParams = {};
var dxfBasePoint = {x:0, y:0,}


//функция - оболочка
function addWardrobe(viewportId, isVisible) {

//удаляем предыдущий шкаф
	if (carcas_wr) removeObjects(viewportId, 'carcas_wr');
	if (wrCarcas1) removeObjects(viewportId, 'wrCarcas1');
	if (wrCarcas2) removeObjects(viewportId, 'wrCarcas2');	
	if (doors) removeObjects(viewportId, 'doors');
	if (shelfs) removeObjects(viewportId, 'shelfs');
	if (metis) removeObjects(viewportId, 'metis');
	if (wireframesinter) removeObjects(viewportId, 'wireframesinter');

//очищаем глобальные массивы
	carcas_wr = [];
	wrCarcas1 = []; 
    wrCarcas2 = []; 
	doors = [];
	shelfs = [];
	metis = [];

	//обнуляем массив примитивов dxfBasePoint
	dxfPrimitivesArr = [];
	
	//обнуляем счетчики спецификации
	partsAmt = {};
	specObj = partsAmt; //задаем объект, куда будут сохраняться данные для спецификации
	
	var wardrobeParams = {
		sectAmt_wr: params.sectAmt_wr,
		model_wr: params.model_wr,
		width_wr: params.width_wr,
		heightLeft_wr: params.heightLeft_wr,
		heightRight_wr: params.heightRight_wr,
		angleTop_wr: params.angleTop_wr,
		depth_wr: params.depth_wr,
		carcasThk_wr: params.carcasThk_wr,
		doorsThk_wr: params.doorsThk_wr,
		maxRowAmt_wr: params.maxRowAmt_wr,
		kupeDoorAmt_wr: params.kupeDoorAmt_wr,
		dxfBasePoint: dxfBasePoint,
		topOnlay_wr: params.topOnlay_wr,
		}
	
	//параметры секций
	wardrobeParams.sections = [];
	for (var i=0; i<params.sectAmt_wr; i++){
		wardrobeParams.sections[i] = {
			width: parseFloat($("#sectWidth" + i).val()),
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
wrCarcas1.push(wardrobeParams.wrCarcas1)
wrCarcas2.push(wardrobeParams.wrCarcas2)
doors.push(wardrobeParams.wrDoors)
shelfs.push(wardrobeParams.wrShelfs)
metis.push(wardrobeParams.wrMetis)

	
	
//поворачиваем шкаф
	var rot = 0;
	
	var pos = {
		x: 0,
		y: params.legsHeight_wr,
		z: 0,	
		}
	
		

	var model = [
		wrCarcas1,
		wrCarcas2,
		carcas_wr,
		doors,
		shelfs,
		metis,
		]
	var modelObj = [];
	
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

		wrCarcas1 = [
			modelObj[0],
			]
		wrCarcas2 = [
			modelObj[1],
			]
		carcas_wr = [
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
		
		
/*
//добавляем белые ребра для всех объектов
for (var i = 0; i < wrCarcas1.length; i++) addWareframe(wrCarcas1[i], wrCarcas1);
for (var i = 0; i < wrCarcas2.length; i++) addWareframe(wrCarcas2[i], wrCarcas2);
for (var i = 0; i < carcas_wr.length; i++) addWareframe(carcas_wr[i], carcas_wr);
for (var i = 0; i < doors.length; i++) addWareframe(doors[i], doors);
for (var i = 0; i < shelfs.length; i++) addWareframe(shelfs[i], shelfs);
for (var i = 0; i < metis.length; i++) addWareframe(metis[i], metis);
*/

//добавляем объекты в сцену
addObjects(viewportId, wrCarcas1, 'wrCarcas1');
addObjects(viewportId, wrCarcas2, 'wrCarcas2');
addObjects(viewportId, carcas_wr, 'carcas_wr');
addObjects(viewportId, doors, 'doors');
addObjects(viewportId, shelfs, 'shelfs');
addObjects(viewportId, metis, 'metis');

//измерение размеров на модели
	addMeasurement(viewportId);

}//drawWardrobe;

