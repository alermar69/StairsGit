//глобальные переменные для тестирования
var testingMode = false;
var boltDiam = 10;
var boltBulge = 8;
var boltLen = 30;
var anglesHasBolts = true; //отрисовывать болты уголков
var drawLongBolts = true; //отрисовывать длинные болты, соединяющие два уголка через тетиву насквозь
var turnFactor = 1;
var treadsObj;

drawTable = function (viewportId, isVisible) {
	
	for(var layer in layers){
		removeObjects(viewportId, layer);
	}

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
	specObj = partsAmt; //задаем объект, куда будут сохраняться данные для спецификации
	poleList = {};

	/*удаляем контуры*/
	dxfPrimitivesArr = [];
	
	
	var basePar = {
		dxfBasePoint: {x: 0, y: 0},
		model: params.baseModel,
		width: params.width - params.sideOverhang * 2,
		height: params.height - params.countertopThk,
		len: params.len - params.frontOverhang * 2,
	}
		
	var base = drawTableBase(basePar).mesh;
	model.add(base, "carcas");
	
	var topPar = {
		dxfBasePoint: {x: 2000, y: 0},
		geom: params.tableGeom,
		model: params.countertopModel,
		cornerRad: params.cornerRad,
		width: params.width,
		len: params.len,
		thk: params.countertopThk,
		partsGap: params.partsGap,
		slabModel: par.slabModel,
	}
	
	var top = drawTableCountertop(topPar).mesh;
	top.position.y = params.height
	model.add(top, "countertop");
	
	
		
	
//размеры
	
	for(var i=0; i<model.objects.length; i++){
		var obj = model.objects[i].obj;
		//добавляем белые ребра
		if(model.objects[i].layer != "dimensions" && model.objects[i].layer != "dimensions2") addWareframe(obj, obj);
		//добавляем в сцену
		addObjects(viewportId, obj, model.objects[i].layer);
		}

	//измерение размеров на модели
	addMeasurement(viewportId);
	
	if (typeof staircaseLoaded !== undefined) staircaseLoaded();
	
};

