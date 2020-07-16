//глобальные переменные дл¤ тестировани¤
var testingMode = false;
var boltDiam = 10;
var boltBulge = 8;
var boltLen = 30;
var anglesHasBolts = true; //отрисовывать болты уголков
var drawLongBolts = true; //отрисовывать длинные болты, соедин¤ющие два уголка через тетиву насквозь
var turnFactor = 1;
var treadsObj;

drawRack = function (viewportId, isVisible) {
	
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
	
	//обнул¤ем счетчики спецификации
	partsAmt = {};
	specObj = partsAmt; //задаем объект, куда будут сохран¤тьс¤ данные дл¤ спецификации
	poleList = {};

	/*удал¤ем контуры*/
	dxfPrimitivesArr = [];
	
		/***  ј– ј— ***/
	
	var carcasPar = {
		dxfBasePoint: {x: 0, y: 0},
		}
		
	var carcasObj = drawShelf(carcasPar);
	model.add(carcasObj.carcas, "carcas");
	model.add(carcasObj.panels, "panels");
	model.add(carcasObj.countertop, "countertop");
	
	
		
	
//размеры
	
	for(var i=0; i<model.objects.length; i++){
		var obj = model.objects[i].obj;
		//добавл¤ем белые ребра
		if(model.objects[i].layer != "dimensions" && model.objects[i].layer != "dimensions2") addWareframe(obj, obj);
		//добавл¤ем в сцену
		addObjects(viewportId, obj, model.objects[i].layer);
		}

	//измерение размеров на модели
	addMeasurement(viewportId);
	
};