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


	var mesh = new THREE.Object3D();

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

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	par.mesh = new THREE.Mesh(geom, par.material);
	par.shape = shape;

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
		var area = par.len * par.width / 1000000;
		var paintedArea = area * 2 + (par.len * 1.0 + par.width * 1.0) * 2 * thk / 1000000;

		var name = Math.round(par.len) + "x" + Math.round(par.width) + "x" + Math.round(thk);
		if (specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] += 1;
		if (!specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] = 1;
		specObj[par.partName]["amt"] += 1;
		specObj[par.partName]["area"] += area;
		specObj[par.partName]["volume"] += par.len * par.width * thk / 1000000000;
		specObj[par.partName]["paintedArea"] += paintedArea;
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