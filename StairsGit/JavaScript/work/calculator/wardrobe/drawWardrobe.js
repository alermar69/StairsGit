//создаем глобальные массивы
var carcas_wr = []; 
var wrCarcas1 = []; 
var wrCarcas2 = [];
var doors = [];
var shelfs = [];
var metis = [];



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

//очищаем глобальные массивы
	carcas_wr = [];
	wrCarcas1 = []; 
    wrCarcas2 = []; 
	doors = [];
	shelfs = [];
	metis = [];

	//обнуляем массив примитивов dxfBasePoint
	dxfPrimitivesArr = [];
	
	var wardrobeParams = {
		sectAmt_wr: params.sectAmt_wr,
		model_wr: params.model_wr,
		width_wr: params.width_wr,
		heightLeft_wr: parseFloat(params.heightLeft_wr),
		heightRight_wr: parseFloat(params.heightRight_wr),
		angleTop_wr: parseFloat(params.angleTop_wr),
		depth_wr: parseFloat(params.depth_wr),
		carcasThk_wr: parseFloat(params.carcasThk_wr),
		doorsThk_wr: parseFloat(params.doorsThk_wr),
		maxRowAmt_wr: parseFloat(params.maxRowAmt_wr),
		kupeDoorAmt_wr: parseFloat(params.kupeDoorAmt_wr),
		dxfBasePoint: dxfBasePoint,
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
			}
		i++;		
		});
	

wardrobeParams = drawWardrobe(wardrobeParams);

carcas_wr.push(wardrobeParams.wrCarcas)
//wrCarcas1.push(wardrobeParams.wrCarcas1)
//wrCarcas2.push(wardrobeParams.wrCarcas2)
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

		carcas_wr = [
			modelObj[0],
			]
		doors = [
			modelObj[1],
			]
		shelfs = [
			modelObj[2],
			]
		metis = [
			modelObj[3],
			]
		
console.log(wrCarcas1)	

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

}//drawWardrobe;

