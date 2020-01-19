/**функция оболочка, отрисовывает поручень на все варианты геометрии
	par = {
		treadsObj
		dxfBasePoint
		}
*/

function drawSideHandrail_all(par){

	par.mesh = new THREE.Object3D();	

	// поручень нижнего марша
	var marshId = 1;
	var sideHandrail = drawMarshSideHandrail(par, marshId);
	par.mesh.add(sideHandrail);
	
	// поручень второго марша
	
	if (params.stairModel == "П-образная трехмаршевая"){
		marshId = 2;
		var sideHandrail = drawMarshSideHandrail(par, marshId);	
		sideHandrail.position.x = par.treadsObj.unitsPos.marsh2.x;
		sideHandrail.position.y = par.treadsObj.unitsPos.marsh2.y;
		sideHandrail.position.z = par.treadsObj.unitsPos.marsh2.z;	
		sideHandrail.rotation.y = par.treadsObj.unitsPos.marsh2.rot;			
		par.mesh.add(sideHandrail)
		}
/*	
	if (params.stairModel == "П-образная с забегом"){
		marshId = 2;
		var sideHandrail = drawMarshSideHandrail(par, marshId);	
		sideHandrail.position.x = par.treadsObj.unitsPos.marsh2.x;
		sideHandrail.position.y = par.treadsObj.unitsPos.marsh2.y;
		sideHandrail.position.z = par.treadsObj.unitsPos.marsh2.z;	
		sideHandrail.rotation.y = par.treadsObj.unitsPos.marsh2.rot;			
		par.mesh.add(sideHandrail)
		}
	
	if (params.stairModel == "П-образная с площадкой"){
		marshId = 2;
		var sideHandrail = drawMarshSideHandrail(par, marshId);	
		sideHandrail.position.x = par.treadsObj.unitsPos.marsh2.x;
		sideHandrail.position.y = par.treadsObj.unitsPos.marsh2.y;
		sideHandrail.position.z = par.treadsObj.unitsPos.marsh2.z;	
		sideHandrail.rotation.y = par.treadsObj.unitsPos.marsh2.rot;			
		par.mesh.add(sideHandrail)
	}	
*/	
	// поручень верхнего марша
	
	if (params.stairModel != "Прямая"){
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
	
function drawMarshSideHandrail(par, marshId){
	 
	var mesh = new THREE.Object3D();
	var marshPar = getMarshParams(marshId);
	var sideHandrailSectPar = {
		marshId: marshId,
		wndPar: par.treadsObj.wndPar,
		dxfBasePoint: par.dxfBasePoint,
		}
	if(par.treadsObj.wndPar2 && marshId > 1) sideHandrailSectPar.wndPar = par.treadsObj.wndPar2;
	
	//внутренняя сторона марша
	var side = "in";
	if(marshPar.hasSideHandrail[side]){
		sideHandrailSectPar.side = side;
		var sect = drawSideHandrailSect(sideHandrailSectPar);
		sect.position.z = params.M / 2 * turnFactor;
		mesh.add(sect);		
		}
	
	//внешняя сторона марша
	side = "out"
	if(marshPar.hasSideHandrail[side]){
		sideHandrailSectPar.side = side;
		var sect = drawSideHandrailSect(sideHandrailSectPar);
		sect.position.z = -params.M / 2 * turnFactor;
		mesh.add(sect);		
		}	
	
	return mesh;
} //end of drawMarshSideHandrail

/** функция отрисовывает поручень по одной стороне марша: внешней или внутренней
*@params par = {
	marshId
	side
	dxfBasePoint
	
	}
*/

function drawSideHandrailSect(par){
	
	var marshPar = getMarshParams(par.marshId);
	var prevMarshPar = getMarshParams(marshPar.prevMarshId);
	var nextMarshPar = getMarshParams(marshPar.nextMarshId);
	var turnPar = calcTurnParams(marshPar.prevMarshId);
	var mesh = new THREE.Object3D();
	var handrailHeight = 900;
	var handrailYOffset = handrailHeight + marshPar.h;
	
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
		dxfBasePoint: par.dxfBasePoint,
		metalMaterial: params.materials.metal,
		timberMaterial: params.materials.timber,
		side: par.side,
		}
	//костыль чтобы не переделывать drawHandrail_4
	if(turnFactor == -1){
		if(handrailParams.side == "in") handrailParams.side = "out"
		else handrailParams.side = "in";
		}
	
	//нижний поворот
	if(marshPar.botTurn != "пол" && par.side == "out"){
		var handrailAng = 0;
		if(marshPar.botTurn == "забег") handrailAng = Math.atan(marshPar.h * 2 / params.M);
		handrailParams.length = params.M / Math.cos(handrailAng);
		
		var handrail = drawHandrail_4(handrailParams).mesh;
		handrail.rotation.z = handrailAng;
		handrail.position.x = - params.M// - 20; // 20 - зазор чтобы не было пересечений
		handrail.position.y = handrailYOffset;
		if(marshPar.botTurn == "забег") handrail.position.y -= marshPar.h * 2;
		handrail.position.z = 0;
		//устраняем пересечение с поручнем марша
		handrail.position.x -= meterHandrailPar.profY * Math.cos(Math.PI/2 - marshPar.ang)
		handrail.position.y -= meterHandrailPar.profY * Math.sin(Math.PI/2 - marshPar.ang)
		
		mesh.add(handrail);
		}

	
	//поручень на марше
	handrailParams.length = (marshPar.b * marshPar.stairAmt) / Math.cos(marshPar.ang);
	handrailParams.dxfBasePoint = newPoint_xy(handrailParams.dxfBasePoint, -handrailParams.length, 0);
		
	var handrail = drawHandrail_4(handrailParams).mesh;
	handrail.rotation.z = marshPar.ang;
	handrail.position.y = handrailYOffset;
	handrail.position.z = 0;
	mesh.add(handrail);
	
	//верхний поворот
	if(marshPar.topTurn != "пол" && par.side == "out"){
		var handrailAng = 0;
		if(marshPar.topTurn == "забег") handrailAng = Math.atan(marshPar.h_topWnd * 2 / params.M);
		handrailParams.length = params.M / Math.cos(handrailAng);
		
		var handrail = drawHandrail_4(handrailParams).mesh;
		handrail.rotation.z = handrailAng;
		handrail.position.x = marshPar.b * marshPar.stairAmt + 20; // 20 - зазор чтобы не было пересечений
		handrail.position.y = handrailYOffset + marshPar.h * marshPar.stairAmt;
		handrail.position.z = 0;
		mesh.add(handrail);
		}
		
		
	return mesh;

}
