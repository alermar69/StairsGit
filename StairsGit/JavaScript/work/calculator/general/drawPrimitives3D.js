/**функция отрисовывает панель
var panelParams = {
		
		width: 1000,
		len: 1000,
		thk: 8,
		dxfBasePoint:  //не обязательный. Если не указан, в dxf не выводится
		material: railingMaterial, //не обязательный
		dxfArr: dxfPrimitivesArr, //не обязательный
		holes: [], //массив параметров отверстий - не обазятельный
		partName
		}
*/

function drawPlate(par) {

	//Необязательные параметры
	if (!par.dxfArr) par.dxfArr = dxfPrimitivesArr;
	if (!par.dxfBasePoint) {
		par.dxfBasePoint = { x: 0, y: 0 },
			par.dxfArr = [];
	}
	if (!par.material) par.material = params.materials.timber;
	if (!par.layer) par.layer = "parts";


	par.mesh = new THREE.Object3D();

	var shape = new THREE.Shape();
	var p1 = { x: 0, y: 0 }
	var p2 = newPoint_xy(p1, 0, par.width);
	var p3 = newPoint_xy(p1, par.len, par.width);
	var p4 = newPoint_xy(p1, par.len, 0);
	var dxfBasePoint = copyPoint(par.dxfBasePoint)

	addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p4, p1, par.dxfBasePoint);

	//отверстия
	if (par.holes != undefined) {
		for (var i = 0; i < par.holes.length; i++) {
			addRoundHole(shape, par.dxfArr, par.holes[i].center, par.holes[i].rad, par.dxfBasePoint)
		}
	}

	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	
	if(par.partName == "tread") setBevels(extrudeOptions)
	
	if(menu.bevels){
		extrudeOptions.bevelEnabled = true;
		//extrudeOptions.bevelThickness = 6;
		//extrudeOptions.bevelSize = 6;
		//extrudeOptions.bevelSegments = 12;
	}

	if (par.isTreadLigts) extrudeOptions.amount -= par.treadLigtsThk;


	// Достаем переменные из объекта, чтобы можно было менять для одной ступени
	var len = par.len;
	var width = par.width;
	if (par.modifyKey && window.service_data && window.service_data.shapeChanges && window.service_data.shapeChanges.length > 0) {
		var modify = window.service_data.shapeChanges.find(function(change){
			return change.modifyKey == par.modifyKey
		})
		if (modify) {
			shape = getShapeFromModify(modify);
			var bbox = findBounds(shape.getPoints());
			len = bbox.x;
			width = bbox.y;
		}
	}

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, par.material);
	mesh.modifyKey = par.modifyKey;
	par.mesh.add(mesh)
	par.shape = shape;

	// добавляем часть ступени с вырезом под подсветку ступеней
	if (par.isTreadLigts) {
		extrudeOptions.amount = par.treadLigtsThk;

		var hole = new THREE.Path();
		var ph1 = newPoint_xy(p2, par.offsetSide, -par.offsetFront);
		var ph2 = newPoint_xy(ph1, 0, -par.widthLigts);
		var ph4 = newPoint_xy(p3, -par.offsetSide, -par.offsetFront);
		var ph3 = newPoint_xy(ph4, 0, -par.widthLigts);

		addLine(hole, par.dxfArr, ph1, ph2, par.dxfBasePoint);
		addLine(hole, par.dxfArr, ph2, ph3, par.dxfBasePoint);
		addLine(hole, par.dxfArr, ph3, ph4, par.dxfBasePoint);
		addLine(hole, par.dxfArr, ph4, ph1, par.dxfBasePoint);

		shape.holes.push(hole)

		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var mesh = new THREE.Mesh(geom, par.material);
		mesh.position.z = par.thk - par.treadLigtsThk;
		par.mesh.add(mesh)
	}

	if (par.modifyKey) {
		par.mesh.modifyKey = par.modifyKey;//Object.assign({}, par.modifyParams);
	}
	//сохраняем данные для спецификации
	if (params.stairType == "нет" && (par.partName == "tread" || par.partName == "riser" || par.partName == "dpc"))
		return par;

	if (par.partName == "tread" && params.stairType == 'лотки' && params.calcType == "mono")
		return par;

	var thk = par.thk;
	if (par.thkFull) thk = par.thkFull;
	if (typeof specObj != 'undefined' && par.partName) {
		if (!specObj[par.partName]) {
			specObj[par.partName] = {
				types: {},
				amt: 0,
				name: "Панель",
				area: 0,
				volume: 0,
				paintedArea: 0,
				metalPaint: false,
				timberPaint: true,
				division: "timber",
				workUnitName: "amt",
				group: "Каркас",
			}
			if (par.partName == "tread") {
				var treadPar = getTreadParams(); //функция в файле calcSpecGeneral.js
				specObj[par.partName].name = "Ступень";
				specObj[par.partName].metalPaint = treadPar.metalPaint;
				specObj[par.partName].timberPaint = treadPar.timberPaint;
				specObj[par.partName].division = treadPar.division;
				specObj[par.partName].group = "treads";
				if (treadPar.material != "timber") specObj[par.partName].name = "Ступень " + params.stairType;
			}
			if (par.partName == "riser") {
				specObj[par.partName].name = "Подступенок ";
				specObj[par.partName].group = "risers";
			}

			if (par.partName == "dpc") {
				specObj[par.partName].name = "Доска " + params.stairType;
				specObj[par.partName].timberPaint = false;
				specObj[par.partName].group = "Ступени";
			}
			if (par.partName == "mdfPlate") specObj[par.partName].name = "Панель МДФ ";
			if (par.partName == "drawerFrontPlate") specObj[par.partName].name = "Панель ящика перед/зад ";
			if (par.partName == "drawerSidePlate") specObj[par.partName].name = "Панель ящика бок. ";
			if (par.partName == "door") specObj[par.partName].name = "Фасад ";
			if (par.partName == "framedDoor") specObj[par.partName].name = "Фасад рамочный ";

			if (par.partName == "drawerBotPlate") specObj[par.partName].name = "Дно ящика МДФ ";
			if (par.partName == "shelf") specObj[par.partName].name = "Полка ";
			if (par.partName == "rail") specObj[par.partName].name = "Штанга ";


			if (par.partName == "drawerFrontPlate" ||
				par.partName == "drawerSidePlate" ||
				par.partName == "drawerBotPlate" ||
				par.partName == "door" ||
				par.partName == "shelf" ||
				par.partName == "rail"
			) {
				specObj[par.partName].group = "Наполнение";
			}

			if (par.partName == 'platformPlate') {
				specObj[par.partName].name = 'Площадка платформы';
			}

		}
		var area = len * width / 1000000;
		var paintedArea = area * 2 + (len * 1.0 + width * 1.0) * 2 * thk / 1000000;

		var name = Math.round(len) + "x" + Math.round(width) + "x" + Math.round(thk);
		if (specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] += 1;
		if (!specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] = 1;
		specObj[par.partName]["amt"] += 1;
		specObj[par.partName]["area"] += area;
		specObj[par.partName]["volume"] += len * width * thk / 1000000000;
		specObj[par.partName]["paintedArea"] += paintedArea;

		
	}
	
	//добавляем информацию в материалы
	var materialName = params.additionalObjectsTimberMaterial
	if (par.partName == "tread") materialName = params.treadsMaterial
	if (par.partName == "riser") materialName = params.risersMaterial
		
	if(materialName){
		var panelName_40 = calcTimberParams(materialName).treadsPanelName;	
		var panelName_20 = calcTimberParams(materialName).riserPanelName;

		if(par.thk == 20) addMaterialNeed({id: panelName_20, amt: area, itemType: par.partName});
		if(par.thk == 40) addMaterialNeed({id: panelName_40, amt: area, itemType: par.partName});
		if(par.thk == 60) {
			addMaterialNeed({id: panelName_20, amt: area, itemType: par.partName});
			addMaterialNeed({id: panelName_40, amt: area, itemType: par.partName});
		}
		if(par.thk == 80) addMaterialNeed({id: panelName_40, amt: area * 2, itemType: par.partName});
		if(par.thk == 100) {
			addMaterialNeed({id: panelName_20, amt: area, itemType: par.partName});
			addMaterialNeed({id: panelName_40, amt: area * 2, itemType: par.partName});
		}
		par.mesh.isInMaterials = true;
	}


	par.mesh.specId = par.partName + name;

	//сохраняем данные для ведомости деталей
	var addToPoleList = false;
	if (par.partName == "timberPlate") addToPoleList = true;

	if (typeof poleList != 'undefined' && addToPoleList && par.partName) {
		var poleType = name;
		//формируем массив, если такого еще не было
		if (!poleList[poleType]) poleList[poleType] = [];
		var polePar = {
			len1: Math.round(par.length),
			len2: Math.round(par.length),
			len3: Math.round(par.length),
			angStart: par.angStart,
			angEnd: par.angEnd,
			cutOffsetStart: 0,
			cutOffsetEnd: 0,
			poleProfileY: par.poleProfileY,
			poleProfileZ: par.poleProfileY,
		}

		//комментарий назначение детали
		if (par.sectText) polePar.text = par.sectText;


		polePar.description = [];
		polePar.description.push(polePar.text);
		polePar.amt = 1;

		poleList[poleType].push(polePar);

	}

	return par;

}

/** Функция смещает объект относительно начальной точки(грубо говоря меняем точку вращения)
* @param object THREE.Object3D / THREE.Mesh / THREE.Geometry
* @param x
* @param y
* @param z
*/
function translateObject(object, x, y, z) {
	/*
		//TODO: Поработать над определением класса
		MESH определяется как Object3D(видимо наследуется) но не на оборот. 
		по этому сейчас эта пробелма решена порядком условий
	*/
	if (object instanceof THREE.Geometry) {
		object.translate(x, y, z);
		return;
	}
	if (object instanceof THREE.Mesh) {
		object.geometry.translate(x, y, z);
		return;
	}
	if (object instanceof THREE.Object3D) {
		object.translateX(x);
		object.translateY(y);
		object.translateZ(z);
		return;
	}
}

function setBevels(extrudeOptions){
	if(menu.bevels){
		extrudeOptions.bevelEnabled = true;
		extrudeOptions.bevelThickness = 6;
		extrudeOptions.bevelSize = 6;
		extrudeOptions.bevelSegments = 12;
	}
}

function updateModifyChanges(){
	if (!window.service_data) window.service_data = {shapeChanges: []};
	if (!window.service_data.shapeChanges) window.service_data.shapeChanges = [];
	view.scene.traverse(function(node){
		if (node.type == 'Mesh' && node.modifyKey) {
			window.service_data.shapeChanges.forEach(function(par){
				if (node.modifyKey == par.modifyKey) {
					var options = node.geometry.parameters.options;
					var newShape = new THREE.Shape()

					// par.points.forEach(function(point))
					// for (var i = 0; i < par.points.length; i++) {
					// 	var point = par.points[i];
					// 	var nextIndex = i + 1;
					// 	if (nextIndex > par.points.length - 1) nextIndex = 0;
					// 	var nextPoint = par.points[nextIndex];
					// 	newShape.moveTo( point.x, point.y );
					// 	newShape.lineTo( nextPoint.x, nextPoint.y );
					// }

					newShape.fromJSON(par.shapeData)
					if(!node.oldGeometry) node.oldGeometry = node.geometry;
					node.geometry = new THREE.ExtrudeGeometry(newShape, options);
					node.geometryChanged = true;
				}
			});
			if (node.oldGeometry && !window.service_data.shapeChanges.find(function(change){return change.modifyKey == node.modifyKey})) {
				node.geometry = node.oldGeometry;
				node.oldGeometry = null;
			}
		}
	})

	window.service_data.shapeChanges.forEach(function(change){
		var fakeShape = new THREE.Shape();

		var newShape = new THREE.Shape();
		newShape.fromJSON(change.shapeData);
		
		var dxfBasePoint = {x: -3000, y: -3000};

		var shapes = [newShape, ...newShape.holes]
		shapes.forEach(function(shape){
			shape.curves.forEach(function(curve){
				if (curve.type == "LineCurve") {
					addLine(fakeShape, dxfPrimitivesArr, curve.v1, curve.v2, dxfBasePoint, 'modified');
				}
				if (curve.type == 'EllipseCurve') {
					addArc2(fakeShape, dxfPrimitivesArr, {x: curve.aX, y: curve.aY}, curve.xRadius, curve.aStartAngle, curve.aEndAngle, curve.aClockwise, dxfBasePoint, 'modified')
				}
			});
		})
	})
}

function findBounds(points) {
	var n = points.length
	if(n === 0) {
		return {x: 0, y:0}
	}
	var minX, maxX, minY, maxY;
	points.forEach(function(point){
		if (minX == undefined || minX > point.x) minX = point.x;
		if (maxX == undefined || maxX < point.x) maxX = point.x;
		if (minY == undefined || minY > point.y) minY = point.y;
		if (maxY == undefined || maxY < point.y) maxY = point.y;
	})

	return {x: maxX - minX, y: maxY - minY}
}