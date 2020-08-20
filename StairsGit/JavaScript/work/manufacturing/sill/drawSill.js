$(function () {
	//перерисовка балюстрады при измененнии инпутов формы 
    $('#carcasForm').delegate('input,select', 'change', function(){
		getAllInputsValues(params);
		drawSills()
	});
})

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
	
	params.materials.wall.transparent=false
	
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
	
	var sillPar = {};
	$("#carcasForm").find("input,select").each(function(){
		sillPar[$(this).attr("id")] = $(this).val();
		//преобразуем числа 
		if(isFinite(sillPar[$(this).attr("id")])) sillPar[$(this).attr("id")] = Number(sillPar[$(this).attr("id")])
	})

	//обстановка

	var env = drawSillEnv(sillPar).mesh;
	model.add(env, "env");
	
	//подоконник
	
	var sill = drawSill(sillPar).mesh;
	sill.position.y = params.height + 10
	sill.position.z = params.wallThk + params.frontNose
	model.add(sill, "sill");

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

/** функция рисует обстановку для подоконника
*/
function drawSillEnv(par){
	if(!par) par = {};
	initPar(par);
	
	par.wallWidth = params.windowWidth + 1000;
	var p0 = {x: 0, y:0}; //точка на полу под центром стены
	
	if(params.geom == "угол") {
		par.wallWidth = params.windowWidth + 500 + params.windowOffset
		if(params.geomSide == "правая") p0.x = params.windowWidth / 2 + params.windowOffset - par.wallWidth / 2;
		if(params.geomSide == "левая") p0.x = - params.windowWidth / 2 - params.windowOffset  + par.wallWidth / 2;
	}
	
	if(par.geom == "балконное окно") {
		par.doorWidth = 1000;
		par.wallWidth += par.doorWidth;
		if(params.geomSide == "правая") p0.x -= par.doorWidth / 2
		if(params.geomSide == "левая") p0.x += par.doorWidth / 2
	}

	//точки без учета вырезов
	var p1 = newPoint_xy(p0, -par.wallWidth / 2, 0);
	var p2 = newPoint_xy(p1, 0, params.ceilHeight);
	var p4 = newPoint_xy(p0, par.wallWidth / 2, 0);
	var p3 = newPoint_xy(p4, 0, params.ceilHeight);
	
	var points = [p1, p2, p3, p4];
	
	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		//radIn: radIn, //Радиус скругления внутренних углов
		radOut: 0, //радиус скругления внешних углов
		//markPoints: true,
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;
	
	//окно
	var ph0 = {x: 0, y: params.height};
	
	var ph1 = newPoint_xy(ph0, -params.windowWidth / 2, 0);
	var ph2 = newPoint_xy(ph1, 0, params.windowHeight);
	var ph4 = newPoint_xy(ph0, params.windowWidth / 2, 0);
	var ph3 = newPoint_xy(ph4, 0, params.windowHeight);
	
	var holePoints = [ph4, ph3, ph2, ph1];
	
		
	//боковой вырез
	if(par.geom == "балконное окно"){
		par.doorHeight = par.height + par.windowHeight - 50;
		if(params.geomSide == "правая") {			
			ph7 = newPoint_xy(ph2, -par.doorWidth, 0); //левый верхний угол двери
			ph6 = newPoint_xy(ph7, 0, -par.doorHeight); //левый нижний
			ph5 = newPoint_xy(ph6, par.doorWidth, 0); //правый нижний
			
			holePoints = [ph4, ph3, ph7, ph6, ph5, ph1];
		}
		if(params.geomSide == "левая") {
			ph7 = newPoint_xy(ph3, par.doorWidth, 0); //правый верхний угол двери
			ph6 = newPoint_xy(ph7, 0, -par.doorHeight); //правый нижний
			ph5 = newPoint_xy(ph6, -par.doorWidth, 0); //левый нижний
			
			holePoints = [ph4, ph5, ph6, ph7, ph2, ph1];
		}
		
	}
	
	var shapePar = {
		points: holePoints,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		//radIn: radIn, //Радиус скругления внутренних углов
		radOut: 0, //радиус скругления внешних углов
		//markPoints: true,
	}
	
	var hole = drawShapeByPoints2(shapePar).shape;
	
	shape.holes.push(hole)
	
	var extrudeOptions = {
        amount: params.wallThk,
        bevelEnabled: false,
        curveSegments: 12,
        steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.wall);
	par.mesh.add(mesh);
	
	//откосы
	if(par.wallSideBevel > 0){
		var pt1 = {x: 0, y:0};
		var pt2 = newPoint_xy(pt1, 0, params.windowPosZ);
		var pt3 = newPoint_xy(pt1,  par.wallSideBevel, params.windowPosZ);

		var points = [pt1, pt2, pt3];
		
		//создаем шейп
		var shapePar = {
			points: points,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: par.dxfBasePoint,
			//radIn: radIn, //Радиус скругления внутренних углов
			radOut: 0, //радиус скругления внешних углов
			//markPoints: true,
		}
		
		var shape = drawShapeByPoints2(shapePar).shape;
		
		var extrudeOptions = {
			amount: params.windowHeight,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};

		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var bevel = new THREE.Mesh(geom, params.materials.wall);
		bevel.rotation.x = -Math.PI / 2
		
		bevel.position.x = - params.windowWidth / 2
		bevel.position.y = params.height
		bevel.position.z = params.wallThk
		
		if(par.geom != "балконное окно" || params.geomSide == "левая") par.mesh.add(bevel);
		
		
		var bevel = new THREE.Mesh(geom, params.materials.wall);
		bevel.rotation.x = Math.PI / 2
		bevel.rotation.z = Math.PI
		
		bevel.position.x = params.windowWidth / 2
		bevel.position.y = params.height + params.windowHeight
		bevel.position.z = params.wallThk
		
		if(par.geom != "балконное окно" || params.geomSide == "правая") par.mesh.add(bevel);
	}
	//угловая стена
	if(params.geom == "угол"){
		var wallLen = params.wallThk + 1000
		var geom = new THREE.BoxGeometry( params.wallThk, params.ceilHeight, wallLen);
		var wall = new THREE.Mesh( geom, params.materials.wall );
		
		wall.position.x = p0.x + par.wallWidth / 2 + params.wallThk / 2;
		if(params.geomSide == "левая") wall.position.x = p0.x -par.wallWidth / 2 - params.wallThk / 2;
		wall.position.y = params.ceilHeight / 2;
		wall.position.z = wallLen / 2;
	
		par.mesh.add(wall);
		
	}
	
	//окно
	var windowPar = {
		width: par.windowWidth,
		windowsCount: par.windowSectAmt,
		height: par.windowHeight,
		mat: params.materials.timber,
	}
	var wnd = drawWindow(windowPar).mesh
	wnd.position.y = params.height
	wnd.position.x = -params.windowWidth / 2
	wnd.position.z = params.wallThk - params.windowPosZ - 40
	
	par.mesh.add(wnd);
	
	
	return par;
}

function drawSill(par){
	if(!par) par = {};
	initPar(par)
	
	par.len = par.windowWidth + par.rightNose + par.leftNose;
	par.width = par.windowPosZ + par.frontNose;
	
	var p0 = {x: 0, y:0}; //точка в середине передней кромки
	var p1 = newPoint_xy(p0, -par.windowWidth / 2 - par.leftNose, 0);
	var p2 = newPoint_xy(p1, 0, par.width);
	var p4 = newPoint_xy(p0, par.windowWidth / 2 + par.rightNose, 0);
	var p3 = newPoint_xy(p4, 0, par.width);
	

	p1.filletRad = par.cornerRadLeft
	p4.filletRad = par.cornerRadRight
	
	
	var points = [p1, p2, p3, p4];
	
	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;
	
	var extrudeOptions = {
        amount: par.sillThk,
        bevelEnabled: false,
        curveSegments: 12,
        steps: 1
		};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.timber);
	mesh.rotation.x = -Math.PI / 2;
	par.mesh.add(mesh);
	
	return par
}