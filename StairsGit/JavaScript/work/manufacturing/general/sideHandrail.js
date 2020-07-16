/**функция оболочка, отрисовывает поручень на все варианты геометрии
	par = {
		treadsObj
		dxfBasePoint
		}
*/

function drawSideHandrail_all(par) {

	par.mesh = new THREE.Object3D();

	// поручень нижнего марша
	var marshId = 1;
	var sideHandrail = drawMarshSideHandrail(par, marshId);
	par.mesh.add(sideHandrail);

	// поручень второго марша

	if (params.stairModel == "П-образная трехмаршевая") {
		marshId = 2;
		var sideHandrail = drawMarshSideHandrail(par, marshId);
		sideHandrail.position.x = par.treadsObj.unitsPos.marsh2.x;
		sideHandrail.position.y = par.treadsObj.unitsPos.marsh2.y;
		sideHandrail.position.z = par.treadsObj.unitsPos.marsh2.z;
		sideHandrail.rotation.y = par.treadsObj.unitsPos.marsh2.rot;
		par.mesh.add(sideHandrail)
	}

	if (params.stairModel == "П-образная с забегом") {
		marshId = 2;
		var sideHandrail = drawMarshSideHandrail(par, marshId);
		sideHandrail.position.x = par.treadsObj.unitsPos.turn1.x;
		sideHandrail.position.y = par.treadsObj.unitsPos.turn1.y;
		sideHandrail.position.z = par.treadsObj.unitsPos.turn1.z;
		sideHandrail.rotation.y = par.treadsObj.unitsPos.turn1.rot;
		par.mesh.add(sideHandrail)
	}

	if (params.stairModel == "П-образная с площадкой") {
		marshId = 2;
		var sideHandrail = drawMarshSideHandrail(par, marshId);
		sideHandrail.position.x = par.treadsObj.unitsPos.turn1.x;
		sideHandrail.position.y = par.treadsObj.unitsPos.turn1.y;
		sideHandrail.position.z = par.treadsObj.unitsPos.turn1.z;
		sideHandrail.rotation.y = par.treadsObj.unitsPos.turn1.rot;
		par.mesh.add(sideHandrail)
	}

	// поручень верхнего марша

	if (params.stairModel != "Прямая") {
		marshId = 3;
		var sideHandrail = drawMarshSideHandrail(par, marshId);
		sideHandrail.position.x = par.treadsObj.unitsPos.marsh3.x;
		sideHandrail.position.y = par.treadsObj.unitsPos.marsh3.y;
		sideHandrail.position.z = par.treadsObj.unitsPos.marsh3.z;
		sideHandrail.rotation.y = par.treadsObj.unitsPos.marsh3.rot;
		par.mesh.add(sideHandrail)
	}

	return par;

} //end of drawSideHandrail_all

/** функция отрисовывает поручень с двух сторон одного марша
	наличие порученьа по сторонам считается внутри 
	par = {
		treadsObj
		dxfBasePoint
		}
	*/

function drawMarshSideHandrail(par, marshId) {

	var mesh = new THREE.Object3D();
	var marshPar = getMarshParams(marshId);
	var prevMarshPar = getMarshParams(marshPar.prevMarshId);
	var nextMarshPar = getMarshParams(marshPar.nextMarshId);
	var sideHandrailSectPar = {
		marshId: marshId,
		wndPar: par.treadsObj.wndPar,
		dxfBasePoint: par.dxfBasePoint,
	}
	if (par.treadsObj.wndPar2 && marshId > 1) sideHandrailSectPar.wndPar = par.treadsObj.wndPar2;

	//внутренняя сторона марша
	var side = "in";
	if (marshPar.hasSideHandrail[side]) {
		sideHandrailSectPar.side = side;
		var sect = drawSideHandrailSect(sideHandrailSectPar);
		sect.position.z = params.M / 2 * turnFactor;
		if (params.stairModel == "Прямая") sect.position.z = -params.M / 2 * turnFactor;
		mesh.add(sect);
	}

	//внешняя сторона марша
	side = "out"
	var isDrawSideHandrailSect = true;
	if (params.stairModel == "П-образная трехмаршевая" && marshPar.stairAmt < 3 && marshId == 2 && side == "out")
		isDrawSideHandrailSect = false;

	if (marshPar.hasSideHandrail[side] && isDrawSideHandrailSect) {
		sideHandrailSectPar.side = side;
		var sect = drawSideHandrailSect(sideHandrailSectPar);
		sect.position.z = -params.M / 2 * turnFactor;
		if (params.stairModel == "Прямая") sect.position.z = params.M / 2 * turnFactor;
		mesh.add(sect);
	}

	//делаем один поручень для П-образной трехмаршевой на втором марше, если кол-во ступеней меньше двух
	if (marshPar.hasSideHandrail[side] && !isDrawSideHandrailSect) {
		var ang = Math.atan((marshPar.h * 4) / (params.M * 2 + marshPar.b * marshPar.stairAmt))
		var sideOffset = 50; //отступ от края чтобы поручень не врезался в стены шахты
		var handrailParams = {
			model: params.handrail,
			length: (params.M * 2 + marshPar.b * marshPar.stairAmt - sideOffset * 2) / Math.cos(ang),
			dxfBasePoint: par.dxfBasePoint,
			metalMaterial: params.materials.metal,
			timberMaterial: params.materials.timber,
			side: "out",
			partName: "sideHandrails",
			marshId: marshId
		}

		//костыль чтобы не переделывать drawHandrail_4
		if (turnFactor == 1) handrailParams.side = "in"

		var handrail = drawHandrail_4(handrailParams).mesh;
		handrail.rotation.y = -Math.PI;
		handrail.rotation.z = -ang;
		handrail.position.y = 900 + marshPar.h;
		handrail.position.y += handrailParams.length * Math.sin(ang);
		handrail.position.x = params.M + marshPar.b * marshPar.stairAmt// - sideOffset * Math.cos(ang);
		handrail.position.z = -(params.M / 2) * turnFactor;

		mesh.add(handrail);

		if (typeof railingParams != 'undefined') {
			if (!railingParams.sideHandrails) {
				railingParams.sideHandrails = {
					types: [],
					sumLen: 0,
				}
			}
			railingParams.sideHandrails.types.push(handrailParams.length);
			railingParams.sideHandrails.sumLen += handrailParams.length / 1000;
		}
	}

	//задняя сторона забега П-образная с забегом
	if (params.stairModel == "П-образная с забегом" && params.backHandrail_2 == "есть" && marshId == 2) {
		var ang = Math.atan((marshPar.h * 4) / (params.M * 2 + params.marshDist + 80 * 2))
		var handrailParams = {
			model: params.handrail,
			length: (params.M * 2 + params.marshDist) / Math.cos(ang),
			dxfBasePoint: par.dxfBasePoint,
			metalMaterial: params.materials.metal,
			timberMaterial: params.materials.timber,
			side: "out",
			partName: "sideHandrails",
			marshId: marshId
		}

		var handrail = drawHandrail_4(handrailParams).mesh;
		handrail.rotation.y = -Math.PI / 2;
		handrail.rotation.z = ang * turnFactor;
		handrail.position.y = 900 + marshPar.h;
		if (turnFactor == -1) handrail.position.y += handrailParams.length * Math.sin(ang);
		handrail.position.x = params.M + handrailParams.holderEndOffset + 25;
		handrail.position.z = -(params.M / 2) * turnFactor;
		handrail.position.z -= (params.M * 2 + params.marshDist) * (1 - turnFactor) * 0.5;
		mesh.add(handrail);

		if (typeof railingParams != 'undefined') {
			if (!railingParams.sideHandrails) {
				railingParams.sideHandrails = {
					types: [],
					sumLen: 0,
				}
			}
			railingParams.sideHandrails.types.push(handrailParams.length);
			railingParams.sideHandrails.sumLen += handrailParams.length / 1000;
		}
	}

	//задняя сторона промежуточной площадки П-образная с площадкой
	if (params.stairModel == "П-образная с площадкой" && params.backHandrail_1 == "есть" && marshId == 2) {
		var handrailParams = {
			model: params.handrail,
			length: (params.M * 2 + params.marshDist),
			dxfBasePoint: par.dxfBasePoint,
			metalMaterial: params.materials.metal,
			timberMaterial: params.materials.timber,
			side: "out",
			partName: "sideHandrails",
			marshId: marshId
		}

		var holderEndOffset = 70; //расстояние от кронштейна до конца поручня
		if (prevMarshPar.hasSideHandrail[side]) handrailParams.length -= holderEndOffset;
		if (nextMarshPar.hasSideHandrail[side]) handrailParams.length -= holderEndOffset;

		var handrail = drawHandrail_4(handrailParams).mesh;
		handrail.rotation.y = -Math.PI / 2;
		handrail.position.y = 900 + marshPar.h;
		handrail.position.x = params.platformLength_1 + params.nose;// + handrailParams.holderEndOffset;
		handrail.position.z = -(params.M / 2) * turnFactor;
		handrail.position.z -= (params.M * 2 + params.marshDist) * (1 - turnFactor) * 0.5;
		if (prevMarshPar.hasSideHandrail[side]) handrail.position.z += holderEndOffset;// * turnFactor;
		mesh.add(handrail);

		if (typeof railingParams != 'undefined') {
			if (!railingParams.sideHandrails) {
				railingParams.sideHandrails = {
					types: [],
					sumLen: 0,
				}
			}
			railingParams.sideHandrails.types.push(handrailParams.length);
			railingParams.sideHandrails.sumLen += handrailParams.length / 1000;
		}
	}

	par.dxfBasePoint.y += 500;


	return mesh;
} //end of drawMarshSideHandrail

/** функция отрисовывает поручень по одной стороне марша: внешней или внутренней
*@params par = {
	marshId
	side
	dxfBasePoint
	
	}
*/

function drawSideHandrailSect(par) {

	var marshPar = getMarshParams(par.marshId);
	var prevMarshPar = getMarshParams(marshPar.prevMarshId);
	var nextMarshPar = getMarshParams(marshPar.nextMarshId);
	var turnPar = calcTurnParams(marshPar.prevMarshId);
	var mesh = new THREE.Object3D();
	var handrailHeight = 900;
	var handrailYOffset = handrailHeight + marshPar.h;
	var partsLen = [];


	var meterHandrailPar = {
		prof: params.handrailProf,
		sideSlots: params.handrailSlots,
		handrailType: params.handrail,
		metalPaint: params.metalPaint_perila,
		timberPaint: params.timberPaint_perila,
	}
	meterHandrailPar = calcHandrailMeterParams(meterHandrailPar);

	var handrailParams = {
		model: params.handrail,
		length: (marshPar.b * marshPar.stairAmt) / Math.cos(marshPar.ang),
		dxfBasePoint: copyPoint(par.dxfBasePoint),
		metalMaterial: params.materials.metal,
		timberMaterial: params.materials.timber,
		side: par.side,
		partName: "sideHandrails",
		marshId: par.marshId
	}

	handrailParams.startPlug = true;
	handrailParams.endPlug = true;

	//костыль чтобы не переделывать drawHandrail_4
	if (turnFactor == -1) {
		if (handrailParams.side == "in") handrailParams.side = "out"
		else handrailParams.side = "in";
	}
	if (params.stairModel == "Прямая") {
		if (handrailParams.side == "in") handrailParams.side = "out"
		else handrailParams.side = "in";
	}


	if (params.stairModel == "Прямая с промежуточной площадкой" && par.marshId == 3) {
		marshPar.botTurn = "пол";
		marshPar.lastMarsh = true;
		if (!params.topPltRailing_4 && handrailParams.side == "in") marshPar.topTurn = "пол";
		if (!params.topPltRailing_5 && handrailParams.side == "out") marshPar.topTurn = "пол";
	}

	//нижний поворот
	if (marshPar.botTurn != "пол" && par.side == "out") {
		var handrailAng = 0;
		if (marshPar.botTurn == "забег") handrailAng = Math.atan(marshPar.h * 2 / params.M);
		handrailParams.length = params.M / Math.cos(handrailAng) - 50;

		var handrail = drawHandrail_4(handrailParams).mesh;
		handrail.rotation.z = handrailAng;
		handrail.position.x = - params.M + 80; // 80 - зазор чтобы не было пересечений
		handrail.position.y = handrailYOffset - 10;
		if (marshPar.botTurn == "забег") handrail.position.y -= marshPar.h * 2;
		handrail.position.z = 0;
		//устраняем пересечение с поручнем марша
		handrail.position.x -= meterHandrailPar.profY * Math.cos(Math.PI / 2 - marshPar.ang)
		handrail.position.y -= meterHandrailPar.profY * Math.sin(Math.PI / 2 - marshPar.ang)

		mesh.add(handrail);
		partsLen.push(handrailParams.length)

		handrailParams.dxfBasePoint.x += handrailParams.length + 50;
	}


	//поручень на марше
	if (marshPar.stairAmt > 0) {
		handrailParams.length = (marshPar.b * marshPar.stairAmt) / Math.cos(marshPar.ang);
		//handrailParams.dxfBasePoint = newPoint_xy(handrailParams.dxfBasePoint, -handrailParams.length, 0);

		var handrail = drawHandrail_4(handrailParams).mesh;
		handrail.rotation.z = marshPar.ang;
		handrail.position.y = handrailYOffset;
		handrail.position.z = 0;
		mesh.add(handrail);
		partsLen.push(handrailParams.length)

		handrailParams.dxfBasePoint.x += handrailParams.length + 50;
	}

	//верхний поворот
	if (marshPar.topTurn != "пол" && par.side == "out") {
		var handrailAng = 0;
		if (marshPar.topTurn == "забег") handrailAng = Math.atan(marshPar.h_topWnd * 2 / params.M);
		handrailParams.length = params.M / Math.cos(handrailAng);
		if (marshPar.lastMarsh) {
			handrailParams.length = params.platformLength_3 / Math.cos(handrailAng);
		}


		var handrail = drawHandrail_4(handrailParams).mesh;
		handrail.rotation.z = handrailAng;
		handrail.position.x = marshPar.b * marshPar.stairAmt + 20; // 20 - зазор чтобы не было пересечений
		handrail.position.y = handrailYOffset + marshPar.h * marshPar.stairAmt;
		handrail.position.z = 0;
		mesh.add(handrail);
		partsLen.push(handrailParams.length)

		handrailParams.dxfBasePoint.x += handrailParams.length + 50;
	}

//сохраняем данные для расчета цены
/*
	if (!partsAmt.sideHandrails) {
		partsAmt.sideHandrails = {
			types: [],
			sumLen: 0,
			}
	}

	for (var i = 0; i < partsLen.length; i++) {
		partsAmt.sideHandrails.types.push(partsLen[i]);
		partsAmt.sideHandrails.sumLen += partsLen[i] / 1000;
	}
*/	

	return mesh;

}

/** функция отрисовывает кронштейн пристенного поручня
*/

function drawWallHandrailHolder(par){

	par.mesh = new THREE.Object3D();
	par.profSise = 10;
	par.flanDiam = 60;
	par.flanThk = 3;
	
	var shape = new THREE.Shape();
    var p0 = { "x": par.flanThk, "y": 0.0 };
    var p1 = newPoint_xy(p0, 0, par.profSise);
    var p2 = newPoint_xy(p1, par.wallOffset - par.profSise/2 - par.flanThk, 0.0);
    var p3 = newPoint_xy(p2, 0.0, par.height - par.profSise/2 - 0.01);
    var p4 = newPoint_xy(p3, par.profSise, 0.0);
	var p5 = newPoint_xy(p4, 0, -par.height - par.profSise/2);
	
	addLine(shape, par.dxfArr, p0, p1, par.dxfBasePoint);
    addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
    addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
    addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint);
    addLine(shape, par.dxfArr, p4, p5, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p5, p0, par.dxfBasePoint);

    var extrudeOptions = {
        amount: par.profSise,
        bevelEnabled: false,
        curveSegments: 12,
        steps: 1
		}

    geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
    var hook = new THREE.Mesh(geometry, par.material);
	hook.rotation.y = -Math.PI/2;
	hook.position.x = par.profSise/2;
	hook.position.y = -par.profSise/2 - 0.01;
	par.mesh.add(hook);
	
	var geometry = new THREE.CylinderGeometry(par.flanDiam/2, par.flanDiam/2, par.flanThk, 30, 1, false);
    var base = new THREE.Mesh(geometry, par.material);
	base.rotation.x = Math.PI/2;
	base.position.x = 0;
	base.position.y = 0
	base.position.z = -par.flanThk/2;
	par.mesh.add(base);

	var screwPar = {
		id: "screw_4x45",
		description: "Крепление поручней к стенам",
		group: "Ограждения"
	}
	if (params.railingModel !== "Самонесущее стекло") {
		var screw = drawScrew(screwPar).mesh;
		screw.position.x = par.flanDiam / 2 - 10;
		screw.position.z = 0;
		screw.rotation.x = Math.PI / 2;
		par.mesh.add(screw);
	
		var screw = drawScrew(screwPar).mesh;
		screw.position.x = -par.flanDiam / 2 + 10;
		screw.position.z = 0;
		screw.rotation.x = Math.PI / 2;
		par.mesh.add(screw);
	
		var screw = drawScrew(screwPar).mesh;
		screw.position.x = 0;
		screw.position.y = par.flanDiam / 2 - 10;
		screw.rotation.x = Math.PI / 2;
		par.mesh.add(screw);
	
		var screw = drawScrew(screwPar).mesh;
		screw.position.x = 0;
		screw.position.y = -par.flanDiam / 2 + 10;
		screw.rotation.x = Math.PI / 2;
		par.mesh.add(screw);
	}


	//параметры поручня
	var handrailPar = {
		prof: params.handrailProf,
		sideSlots: params.handrailSlots,
		handrailType: params.handrail,
		metalPaint: params.metalPaint_railing,
		timberPaint: params.timberPaint_perila,
	}
	handrailPar = calcHandrailMeterParams(handrailPar); //функция в файле priceLib.js

	var screwId = "timberHandrailScrew";
	if (handrailPar.mat == 'metal') screwId = 'metalHandrailScrew';
	
	var screwPar = {
		id: screwId,
		description: "Крепление поручней",
		group: "Ограждения"
	}

	var screw = drawScrew(screwPar).mesh;
	screw.position.x = par.flanDiam / 2 - 10;
	screw.position.y = par.height;
	screw.position.z = par.wallOffset;
	screw.rotation.x = 0
	par.mesh.add(screw);

	var screw = drawScrew(screwPar).mesh;
	screw.position.x = -par.flanDiam / 2 + 10;
	screw.position.y = par.height;
	screw.position.z = par.wallOffset;
	screw.rotation.x = 0;
	par.mesh.add(screw);
	
	//параметры поручня
	var handrailPar = {
		prof: params.handrailProf,
		sideSlots: params.handrailSlots,
		handrailType: params.handrail,
		metalPaint: params.metalPaint_perila,
		timberPaint: params.timberPaint_perila,
		}
	handrailtype = calcHandrailMeterParams(handrailPar).handrailModel; //функция в файле priceLib.js
		
	//сохраняем данные для спецификации
	var partName = "wallHandrailHolder";	
	if(par.isGlassHandrail) partName = "glassHandrailHolder";
	if (specObj.unit == "banister" && params.railingModel_bal == "Самонесущее стекло") partName = "glassHandrailHolder";
	if (specObj.unit != "banister" && params.railingModel == "Самонесущее стекло") partName = "glassHandrailHolder";
	//console.log(specObj)
	if(typeof specObj !='undefined' && partName){
		if(!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				name: "Пристенный кронштейн поручня нерж.",
				metalPaint: false,
				timberPaint: false,
				division: "stock_1",
				workUnitName: "amt",
				group: "Ограждения",
				}
			}
		if(params.sideHandrailHolders == "крашеные") {
			specObj[partName].metalPaint = true;
			specObj[partName].name = "Пристенный кронштейн поручня лазерн.";
			}	
		if(partName == "glassHandrailHolder") specObj[partName].name = "Кронштейн поручня на стекло под";
		
		var name = "плоск. поручень"
		if(handrailtype == "round") name = "кругл. поручень";		
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
	}
	par.mesh.specId = partName + name;
	
	return par;
}//end of drawWallHandrailHolder

