// $(function () {
// 	//перерисовка балюстрады при измененнии инпутов формы 
//     $('#carcasForm').delegate('input,select', 'change', function(){
// 		getAllInputsValues(params);
// 		drawSills()
// 	});
// })

//глобальные переменные для тестирования
var testingMode = false;
var boltDiam = 10;
var boltBulge = 8;
var boltLen = 30;
var anglesHasBolts = true; //отрисовывать болты уголков
var drawLongBolts = true; //отрисовывать длинные болты, соединяющие два уголка через тетиву насквозь
var turnFactor = 1;
var treadsObj;

drawSills = function (viewportId, isVisible) {
	
	// params.materials.wall.transparent=false
	
	// for(var layer in layers){
	// 	removeObjects(viewportId, layer);
	// }

   	// var model = {
	// 	objects: [],
	// 	add: function(obj, layer){
	// 		var objInfo = {
	// 			obj: obj,
	// 			layer: layer,
	// 			}
	// 		this.objects.push(objInfo);
	// 		},
	// 	};
	
	// //обнуляем счетчики спецификации
	// partsAmt = {};
	// specObj = partsAmt; //задаем объект, куда будут сохраняться данные для спецификации
	// poleList = {};

	// /*удаляем контуры*/
	// dxfPrimitivesArr = [];
	
	// var sillPar = {};
	// $("#carcasForm").find("input,select").each(function(){
	// 	sillPar[$(this).attr("id")] = $(this).val();
	// 	//преобразуем числа 
	// 	if(isFinite(sillPar[$(this).attr("id")])) sillPar[$(this).attr("id")] = Number(sillPar[$(this).attr("id")])
	// })

	// //обстановка
	// sillPar = Object.assign(params, sillPar);
	// var drawFunc = drawSillEnv;
	// if(sillPar.geom == "эркер") drawFunc = drawOriel
	// var env = drawFunc(sillPar).mesh;
	
	// model.add(env, "env");
	
	// //подоконник
	// if(sillPar.geom != "эркер") {
	// 	var sill = drawSill(sillPar).mesh;
	// 	sill.position.y = params.height + 10
	// 	sill.position.z = params.wallThk + params.frontNose
	// 	model.add(sill, "sill");
	// }
	// //размеры
	
	// for(var i=0; i<model.objects.length; i++){
	// 	var obj = model.objects[i].obj;
	// 	//добавляем белые ребра
	// 	if(model.objects[i].layer != "dimensions" && model.objects[i].layer != "dimensions2") addWareframe(obj, obj);
	// 	//добавляем в сцену
	// 	addObjects(viewportId, obj, model.objects[i].layer);
	// 	}

	// //измерение размеров на модели
	// addMeasurement(viewportId);
	
	if (typeof staircaseLoaded !== undefined) staircaseLoaded();
	
};

	
		
