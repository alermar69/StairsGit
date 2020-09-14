function drawBox(par){
	//функция отрисовывает элемент наполнения шкафа: ящик, полку и т.п.
	par.mesh = new THREE.Object3D();
	par.doorMesh = new THREE.Object3D();
	par.sideOffset = 10;
	par.doorOffset = 2;
	par.boxStep = 400;
	var timberMaterial = new THREE.MeshLambertMaterial( { color: 0x804000, overdraw: 0.5} );
	var metalMaterial = new THREE.MeshLambertMaterial({color: 0x363636, wireframe: false});
	
	
//полка

if(par.type == "полка"){
	var platePar={
		height: par.width - par.shelfSideOffset * 2,
		width: par.depth,
		thk: par.thk,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		text: "полка секции " + par.sect,
		material: timberMaterial,
		partName: "shelf",
		edging: {
			top: params.sideEdging,
			bot: params.sideEdging,
			left: params.sideEdging,
			right: params.faceEdging,
			}
	}
	//кромка
	if(par.shelfSideOffset == 0) {
		platePar.edging.top = 0;
		platePar.edging.bot = 0;
		platePar.edging.left = 0;
	}
	//задняя кромка
	if(params.rearWall_wr == "нет") platePar.edging.left = params.sideEdging;
	//левая кромка первой секции если нет боковины
	if(par.sect == 1 && par.posX == 0 && params.leftWall_wr != "боковина")
		platePar.edging.top = params.sideEdging;
	//правая кромка последней секции если нет боковины
	if(par.sect == params.sectAmt && params.rightWall_wr != "боковина")
		platePar.edging.bot = params.sideEdging;
	

	
	platePar = drawPlate(platePar);
	var plate = platePar.mesh;
	plate.rotation.x =  Math.PI /2;
	plate.rotation.z =  Math.PI /2;
	plate.position.x = par.width - par.shelfSideOffset;
	plate.position.y = par.thk;
	plate.boxId = par.boxId;
	par.mesh.add(plate);
	
	//уголки
	var angPar = {
		depth: par.depth,
		width: par.width,
		pos: "bot",
		}
	var angGroup = drawShelfAngles(angPar).mesh;
	par.mesh.add(angGroup);

	
}
if(par.type == "перегородка"){
	var platePar = {
		height: par.height,
		width: par.depth,
		thk: par.thk,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		text: "перегородка секции " + par.sect,
		material: timberMaterial,
		partName: "carcasPanel",
		edging: {
			top: 0,
			bot: 0,
			left: 0,
			right: params.faceEdging,
			}
		}
	//задняя кромка
	if(params.rearWall_wr == "нет") platePar.edging.left = params.sideEdging;
	//перегородка, упирающаяся в пол кромится снизу
	if(params.botWall_wr != "цоколь" && par.posY == 0) platePar.edging.top = params.sideEdging;
	  
	platePar = drawPlate(platePar);
	var plate = platePar.mesh;
	plate.rotation.x =  Math.PI /2;
	plate.rotation.y =  Math.PI /2;
	plate.rotation.z =  Math.PI /2;
	plate.position.x = 0//par.thk;
	plate.position.y = par.height;
	plate.boxId = par.boxId;
	par.mesh.add(plate);  

}

if(par.type == "штанга"){
	par.diam = 25;
	
	var pole3DParams = {
			type: "round",
			poleProfileY: par.diam,
			poleProfileZ: par.diam,
			dxfBasePoint: par.dxfBasePoint,
			length: par.width,
			poleAngle: 0,
			material: metalMaterial,
			dxfArr: dxfPrimitivesArr,
			text: "Штанга",
			partName: "rail",
			boxId: par.boxId,
			}

		var pole = drawPole3D_4_1(pole3DParams).mesh;
		pole.position.z = (par.depth + par.diam) / 2;
		pole.boxId = par.boxId;
		par.mesh.add(pole);
	
	//фиттинг в начале
	var fittingPar = {
		side: "left",
		type: par.poleStart,
		}
	
	if(par.poleStart != "нет"){
		var fitting = drawJokerFitting(fittingPar).mesh;
			fitting.position.z = (par.depth) / 2 + par.diam;
		par.mesh.add(fitting);
		}
	
	//фиттинг в конце
	var fittingPar = {
		side: "right",
		type: par.poleEnd,
		}
	
	if(par.poleEnd != "нет"){
		var fitting = drawJokerFitting(fittingPar).mesh;
			fitting.position.x = par.width;
			fitting.position.z = (par.depth) / 2 + par.diam;
		par.mesh.add(fitting);
		}
	
}

if(par.type == "стойка"){
	par.diam = 25;
	
	var pole3DParams = {
			type: "round",
			poleProfileY: par.diam,
			poleProfileZ: par.diam,
			dxfBasePoint: par.dxfBasePoint,
			length: par.height,
			poleAngle: 0,
			material: metalMaterial,
			dxfArr: dxfPrimitivesArr,
			text: "Штанга",
			partName: "rail",
			boxId: par.boxId,
			}

	var pole = drawPole3D_4_1(pole3DParams).mesh;
	pole.rotation.z = Math.PI / 2;
	pole.position.z = (par.depth + par.diam) / 2;
	pole.boxId = par.boxId;
	par.mesh.add(pole);
		
		//фиттинг в начале
	var fittingPar = {
		side: "bot",
		type: par.poleStart,
		}
	
	if(par.poleStart != "нет"){
		var fitting = drawJokerFitting(fittingPar).mesh;
			fitting.position.z = (par.depth) / 2 + par.diam;
		par.mesh.add(fitting);
		}
	
	//фиттинг в конце
	var fittingPar = {
		side: "top",
		type: par.poleEnd,
		}
	
	if(par.poleEnd != "нет"){
		var fitting = drawJokerFitting(fittingPar).mesh;
			fitting.position.y = par.height;
			fitting.position.z = (par.depth) / 2 + par.diam;
		par.mesh.add(fitting);
		}
}

if(par.type == "выдв. штанга"){
	
	//глубина ящика
	var len = Math.floor((par.depth - 10) / 50) * 50;
	if(boxLen > 500) boxLen = 500;
	if(boxLen < 300) boxLen = 300;
	
	var height = 60;
	var thk1 = 20;
	var thk2 = 10;
	
	var radiusTop = 5;
	var radiusBottom = 5;
	var segmentsX = 20;
	var segmentsY = 0;
	var openEnded = false;

	
	var geom = new THREE.CylinderGeometry(radiusTop, radiusBottom, len-20, segmentsX, segmentsY, openEnded);
	
	//нижний пруток
	var pole = new THREE.Mesh(geom, metalMaterial);
	pole.rotation.x = - Math.PI / 2;
	pole.position.y = 10;
	pole.position.z = par.depth - len/2;
	par.mesh.add(pole); 
	
	var geom = new THREE.BoxGeometry(15, 50, 10);
	//задняя пластина
	var plate = new THREE.Mesh(geom, metalMaterial);
	plate.position.y = 25;
	plate.position.z = par.depth - len + 5;
	par.mesh.add(plate);
	//передняя пластина
	var plate = new THREE.Mesh(geom, metalMaterial); 
	plate.position.y = 25;
	plate.position.z = par.depth - 5;
	par.mesh.add(plate);

	//верхняя пластина
	var geom = new THREE.BoxGeometry(20, 10, len);
	var plate = new THREE.Mesh(geom, metalMaterial);
	plate.position.y = height - 5;
	plate.position.z = par.depth - len/2; 
	par.mesh.add(plate);

	//сохраняем данные для спецификации
	var partName = "frameRail";
	if(typeof specObj !='undefined' && partName){
		if(!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				name: "Выдвижная штанга",
				unit: "content",
				}
			}
		var name = len;
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		}
}


if(par.type == "ящик" || par.type == "ящик косой"){
	
	
	//глубина ящика
	var boxLen = Math.floor((par.depth - par.boxDoorPlusIn - 10) / 50) * 50;
	if(boxLen > 600) boxLen = 600;
	if(params.boxType == "метабоксы" && boxLen > 500) boxLen = 500;
	
	//отступ боковин
	var sideOffset = params.boxSideGap;
	
	//отступ каркаса от номинальной позиции по y
	var offsetY = 0//par.boxDoorPlusBot;

	var sideThk = par.thk;
	var sidePartName = "boxPanel";
	var sidePlateMaterial = timberMaterial;
	var botPlatePlus = 10;
	var botPanelName = "boxBotPanel";
	var botPlateOffsetY = 8;
	
	
if(params.boxType == "метабоксы"){
	sideThk = 2;
	sidePartName = "metalBoxPanel";
	sidePlateMaterial = metalMaterial;
	botPanelName = "boxPanel";
	botPlatePlus = 0;
	botPlateOffsetY = 0;
	sideOffset -= sideThk;
	}

	//левая панель
	var platePar={
		height: par.boxCarcasHeight,
		width: boxLen,
		thk: sideThk,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		text: "левая панель ящика секции " + par.sect,
		material: sidePlateMaterial,
		partName: sidePartName,
		}
	
	if(params.boxType != "метабоксы"){
		//кромка
		platePar.edging = {
			top: params.sideEdging,
			bot: params.sideEdging,
			left: params.sideEdging,
			right: 0
			};
	}
	
	platePar = drawPlate(platePar);
	var plate = platePar.mesh;
	plate.rotation.y = -Math.PI /2;
	plate.position.x = sideThk + sideOffset;
	plate.position.y = offsetY;	
	plate.position.z = par.depth - boxLen - par.thk - par.boxDoorPlusIn;
	par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, Math.max(platePar.height, platePar.width) + 100, 0);
	plate.boxId = par.boxId;
	par.mesh.add(plate);
	

	
	
	//правая панель
	var platePar={
		height: par.boxCarcasHeight,
		width: boxLen,
		thk: sideThk,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		text: "правая панель ящика секции " + par.sect,
		material: sidePlateMaterial,
		partName: sidePartName,
		}
	
	//кромка
	if(params.boxType != "метабоксы"){
		platePar.edging = {
			top: params.sideEdging,
			bot: params.sideEdging,
			left: params.sideEdging,
			right: 0
			};
	}
	
	platePar = drawPlate(platePar);
	var plate = platePar.mesh;
	plate.rotation.y = - Math.PI /2;
	plate.position.x = par.width - sideOffset;
	plate.position.y = offsetY;	
	plate.position.z = par.depth - boxLen - par.thk - par.boxDoorPlusIn;
	par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, Math.max(platePar.height, platePar.width) + 100, 0);
	plate.boxId = par.boxId;
	par.mesh.add(plate);
	
		
	//задняя панель
	var platePar={
		height: par.width - 2*sideOffset - 2 * sideThk,
		width:  par.boxCarcasHeight,
		thk: par.thk,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		text: "задняя панель ящика секции " + par.sect,
		material: timberMaterial,
		partName: "boxPanel",
		edging: {
			top: 0,
			bot: 0,
			left: params.sideEdging,
			right: params.sideEdging
			}
	}
 
	platePar = drawPlate(platePar);
	var plate = platePar.mesh;
	plate.rotation.z = -Math.PI / 2;
	plate.position.x = sideOffset + sideThk;
	plate.position.y = offsetY + platePar.width;	
	plate.position.z = par.depth - boxLen - par.thk - par.boxDoorPlusIn;
	par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, Math.max(platePar.height, platePar.width) + 100, 0);
	plate.boxId = par.boxId;
	par.mesh.add(plate);
	
	
	
	//передняя панель
	var frontOffset = 0;
	if(params.boxType != "метабоксы"){
	var platePar={
		height: par.boxCarcasHeight,
		width: par.width - 2*sideOffset - 2 * sideThk,
		thk: par.thk,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		text: "передняя панель ящика секции " + par.sect,
		material: timberMaterial,
		partName: "boxPanel",
		edging: {
			top: params.sideEdging,
			bot: params.sideEdging,
			left: 0,
			right: 0
			}
		}

	    platePar = drawPlate(platePar);
	    var plate = platePar.mesh; 
	    plate.position.x =  sideOffset + par.thk;
		plate.position.y = offsetY;	
		plate.position.z = par.depth - par.thk - par.thk - par.boxDoorPlusIn;
	    par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, Math.max(platePar.height, platePar.width) + 100, 0);
		plate.boxId = par.boxId;
	    par.mesh.add(plate);
		
		frontOffset = par.thk;
	}	

	//фасад
	
	if(par.type == "ящик"){
	var platePar={
		height: par.width + par.boxDoorPlusRight + par.boxDoorPlusLeft,
		width: par.height,
		thk: par.thk,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint, 
		text: "фасад ящика секции " + par.sect,
		material: timberMaterial,
		partName: "boxPanel",
		edging: {
			top: params.faceEdging,
			bot: params.faceEdging,
			left: params.faceEdging,
			right: params.faceEdging
			}
		}

	    platePar = drawPlate(platePar);
	    var plate = platePar.mesh; 
	    plate.rotation.z = -Math.PI / 2;
		plate.position.x = -par.boxDoorPlusLeft;
		plate.position.y = -par.boxDoorPlusBot + platePar.width;	
		plate.position.z = par.depth - par.thk - par.boxDoorPlusIn;
	    par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, Math.max(platePar.height, platePar.width) + 100, 0);
		plate.boxId = par.boxId;
	    par.mesh.add(plate);
		}

	if(par.type == "ящик косой"){
		
		var sectHeightLeft = $(".sectParams").eq(par.blockId - 1).find(".heightLeft").val() * 1.0;
		var sectHeightRight = $(".sectParams").eq(par.blockId - 1).find(".heightRight").val() * 1.0;
		var sectWidth = $(".sectParams").eq(par.blockId - 1).find(".sectWidth").val() * 1.0;
		var topAng = Math.atan((sectHeightRight - sectHeightLeft) / (sectWidth - params.carcasThk_wr * 2));
		
		var heightMin = par.height + par.boxDoorPlusBot;
		var width = par.width + par.boxDoorPlusRight + par.boxDoorPlusLeft;
		var heightMax = heightMin + Math.abs(width * Math.tan(topAng));
		
		
		var panelPar = {
			heightLeft: heightMin,
			heightRight: heightMax,
			thk: par.thk,
			width: width,
			edgingAll: params.faceEdging,
			dxfBasePoint: par.dxfBasePoint,
			text: "фасад ящика секции " + par.sect,
			partName: "boxPanel",
			}
		
		if(topAng < 0){
			panelPar.heightLeft = heightMax;
			panelPar.heightRight = heightMin;
			}
		var plate = drawFrontPanel(panelPar).mesh;
		plate.position.x = -par.boxDoorPlusLeft;
		plate.position.y = -par.boxDoorPlusBot;	
		plate.position.z = par.depth - par.thk - par.boxDoorPlusIn;
		plate.boxId = par.boxId;
	    par.mesh.add(plate);
		}	
 
	//нижняя панель ящика
	var platePar={
		height: par.width - 2*sideThk - 2*sideOffset + botPlatePlus,
		width: boxLen - par.thk - frontOffset + botPlatePlus,
		thk: params.boxBotThk,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		text: "нижняя панель ящика секции " + par.sect,
		material: timberMaterial,
		partName: botPanelName,
		edging: {
			top: 0,
			bot: 0,
			left: 0,
			right: 0
			}
		}
	if(params.boxType == "метабоксы") platePar.width -= 2;
	
	platePar = drawPlate(platePar);
	var plate = platePar.mesh;
	plate.rotation.x =  Math.PI /2;
	plate.rotation.z =  Math.PI /2;
	plate.position.x =  platePar.height + sideThk + sideOffset - botPlatePlus/2;
	plate.position.y = offsetY + botPlateOffsetY + params.boxBotThk;
	plate.position.z = par.depth - boxLen - botPlatePlus/2 - par.boxDoorPlusIn;
	par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, Math.max(platePar.height, platePar.width) + 100, 0);
	plate.boxId = par.boxId;
	par.mesh.add(plate);
	
	

		
	}
	
if(par.type == "пантограф"){
	
	//длина плеча
	var len = par.height;
	var obj = new THREE.Object3D();

	
	var geom = new THREE.BoxGeometry(40, 260, 140);
	//левая панель
	var plate = new THREE.Mesh(geom, metalMaterial);
	plate.position.x = 40/2;
	plate.position.y = 260/2;
	plate.position.z = par.depth / 2; 
	obj.add(plate);
	
	//правая панель
	var plate = new THREE.Mesh(geom, metalMaterial);
	plate.position.x = -40/2 + par.width;
	plate.position.y = 260/2;
	plate.position.z = par.depth / 2; 
	obj.add(plate);
	
	var geom = new THREE.BoxGeometry(10, len + 20, 40);
	//левое плечо
	var plate = new THREE.Mesh(geom, metalMaterial);
	plate.position.x = 30;
	plate.position.y = (len + 20)/2;
	plate.position.z = par.depth / 2; 
	obj.add(plate);
	
	//правое плечо
	var plate = new THREE.Mesh(geom, metalMaterial);
	plate.position.x = -30 + par.width;
	plate.position.y = (len + 20)/2;
	plate.position.z = par.depth / 2; 
	obj.add(plate);
	
	//штанга
	var radiusTop = 12;
	var radiusBottom = 12;
	var segmentsX = 20;
	var segmentsY = 0;
	var openEnded = false;	
	var geom = new THREE.CylinderGeometry(radiusTop, radiusBottom, par.width-60, segmentsX, segmentsY, openEnded);
	var pole = new THREE.Mesh(geom, metalMaterial);
	
	pole.rotation.z = - Math.PI / 2;
	pole.position.x = par.width/2;
	pole.position.y = len;
	pole.position.z = par.depth/2;
	obj.add(pole);
	
	//ручка
	var geom = new THREE.CylinderGeometry(7, 7, len-200, segmentsX, segmentsY, openEnded);
	var pole = new THREE.Mesh(geom, metalMaterial);
	
	pole.position.x = par.width/2;
	pole.position.y = len -(len-200) / 2;
	pole.position.z = par.depth/2;
	if(isDoorsOpened) {
		pole.rotation.x = Math.PI / 2;
		pole.position.y = len;
		pole.position.z = par.depth/2 + (len-200)/2;
		
		}
	obj.add(pole);
	
	if(isDoorsOpened) {
		obj.rotation.x = Math.PI / 2;
		obj.position.y += par.depth/2;
		obj.position.z += 242;
		
		}
	
	par.mesh.add(obj);
	
	//сохраняем данные для спецификации
	var partName = "pantograph";
	if(typeof specObj !='undefined' && partName){ 
		if(!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				name: "Пантограф",
				unit: "content",
				}
			}
		var name = len + "х" + par.width;
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		}
}


	return par;
}



function drawContentWr(par){

//функция отрисовывает все элементы наполнения шкафа: ящики, полки и т.п.
var leftOffset = par.leftOffset;
var rightOffset = par.rightOffset;
var topOffset = par.topOffset;
var botOffset = par.botOffset;
var rearOffset = par.rearOffset;
var sections = par.sections;
//console.log(sections)
var thk = par.thk;
var dxfBasePoint = par.dxfBasePoint;
var timberMaterial = par.timberMaterial;
var boxes = par.boxes;
var contentPanelWidth = params.depth_wr - rearOffset - params.doorsOffset_wr;

var carcas = new THREE.Object3D();
var shelfs = new THREE.Object3D();
var timberColor = '#804000';
var metalColor = '#363636'

/***  ВЕРТИКАЛЬНЫЕ ПЕРЕГОРОДКИ  ***/

function drawSectionsStright(){}; //пустая функция для навигации


//если секции имеют вертикальные перегородки, рассчитываем параметры секций
if(sections){
	var posX = leftOffset;	
	for(var i=0; i<sections.length; i++ ){
		var sectHeight = params.height_wr - topOffset - botOffset;
		if(par.isTopShelf == "есть" && i >= params.topShelfSect1-1 && i < params.topShelfSect2){
			sectHeight = params.topShelfPosY - botOffset - thk;
			}
		sections[i].height = sectHeight;
		sections[i].posX = posX;
		posX += sections[i].width + thk;
		}
	
	

	var platePar={
		height: params.height_wr - topOffset - botOffset,
		width: contentPanelWidth,
		thk: thk,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: dxfBasePoint,
		text: "перегородка секции",
		material: timberMaterial,
		partName: "carcasPanel",
		edging: {
			top: 0,
			bot: 0,
			left: 0,
			right: params.faceEdging,
			}
	}
	
	
	//кромка
	if(params.botWall_wr != "цоколь") platePar.edging.bot = params.sideEdging;
	if(params.rearWall_wr == "нет") platePar.edging.left = params.sideEdging;
	
	
	for(var i=1; i<sections.length; i++ ){
		platePar.height = Math.max(sections[i].height, sections[i-1].height);
		//зазор снизу для регулировки
		var posY = 0;
		if(params.botWall_wr != "цоколь"){
			posY = 10;
			platePar.height -= posY;
			}
		platePar = drawPlate(platePar);
		var plate = platePar.mesh;
		plate.rotation.y = - Math.PI /2;
		plate.position.x = sections[i].posX;
		plate.position.y = botOffset + posY;
		plate.position.z = rearOffset;
		dxfBasePoint = newPoint_xy(dxfBasePoint, params.depth_wr + 500, 0);
		platePar.dxfBasePoint = dxfBasePoint;
		carcas.add(plate); 
		
	//крепеж
	var fixPartsPar = {
		height: platePar.height + thk + posY,
		width: platePar.width,
		botFixType: "screw",
		topFixType: "screw",
		}
	
	var posY = 0;
	if(params.botWall_wr == "цоколь") {
		fixPartsPar.height += thk;
		posY = params.legsHeight_wr - thk;
		}
	if(params.botWall_wr != "цоколь") {
		fixPartsPar.botFixType = "legM8";
		}
	var fixPartsGroup = drawWallFixParts(fixPartsPar).mesh;
		fixPartsGroup.position.x = plate.position.x - thk / 2;
		fixPartsGroup.position.y = posY;
	carcas.add(fixPartsGroup);
	
	}
	
	
		
//антресольная полка

if(par.isTopShelf == "есть"){
	var startSectId = params.topShelfSect1 - 1;
	if(startSectId < 0) startSectId = 0;
	var endSectId = params.topShelfSect2 - 1;
	if(endSectId >= sections.length) endSectId = sections.length - 1
	
	if(par.side == "right"){
		var startSectId = params.topShelfSect1_r - 1 - 20;
		if(startSectId < 0) startSectId = 0;
		var endSectId = params.topShelfSect2_r - 1 - 20;
		if(endSectId >= sections.length) endSectId = sections.length - 1
		}

	var platePar={
		height: sections[endSectId].posX + sections[endSectId].width - sections[startSectId].posX,
		width: contentPanelWidth,
		thk: thk,
		dxfArr :dxfPrimitivesArr,
		dxfBasePoint: dxfBasePoint,
		text: "антресольная полка",
		material: timberMaterial,
		roundHoles: [],
		partName: "carcasPanel",
		edging: {
			top: 0,
			bot: 0,
			left: params.faceEdging,
			right: 0,
			}
		}

	//кромка
	if(params.rearWall_wr == "нет") platePar.edging.right = params.sideEdging;
	if(params.leftWall_wr != "боковина") platePar.edging.bot = params.sideEdging;
	if(params.rightWall_wr != "боковина") platePar.edging.top = params.sideEdging;
	
	var plate = drawPlate(platePar).mesh;
	plate.rotation.x = Math.PI /2;
	plate.rotation.z = - Math.PI /2;
	plate.position.x = sections[startSectId].posX;		
	plate.position.y = params.topShelfPosY;
	plate.position.z = params.depth_wr - params.doorsOffset_wr;	
	
	carcas.add(plate);
	
	//уголки
	var angPar = {
		depth: platePar.width,
		width: platePar.height,
		pos: "bot",
		}
	var angGroup = drawShelfAngles(angPar).mesh;
		angGroup.position.x = sections[startSectId].posX;
		angGroup.position.y = params.topShelfPosY - thk;
	carcas.add(angGroup);
	
	
	dxfBasePoint = newPoint_xy(dxfBasePoint, params.depth_wr + 500, 0);

} //конец антресольной полки

} //конец секций


/***   НАПОЛНЕНИЕ ШКАФА   ***/

function drawBoxesStright(){}; //пустая функция дла навигации



for (var i=0; i<boxes.length; i++){
	dxfBasePoint = newPoint_xy(dxfBasePoint, 0, -1000);
	var boxPar = boxes[i];
	boxPar.dxfArr = dxfPrimitivesArr;
	boxPar.dxfBasePoint = dxfBasePoint;
	boxPar.depth = contentPanelWidth;
	boxPar.thk = thk;
	boxPar.boxId = i;
	
	var sectId = boxPar.sect-1; 
	if(par.side == "right") sectId = boxPar.sect - 21; 
	
	var box = drawBox(boxPar).mesh;
	if(sections){
		box.position.x = sections[sectId].posX;
		}
	else box.position.x = thk;
	box.position.x += boxPar.posX;
	box.position.y = boxPar.posY;
	box.position.z = rearOffset;
	if(boxPar.type == "ящик" && isDoorsOpened) box.position.z += contentPanelWidth * 0.8;
	if(boxPar.type == "ящик косой" && isDoorsOpened) box.position.z += contentPanelWidth * 0.8;
	if(boxPar.type == "выдв. штанга" && isDoorsOpened) box.position.z += contentPanelWidth * 0.6;
	shelfs.add(box)
	

} //конец цикла отрисовки полок

par.carcasMesh = carcas;
par.shelfsMesh = shelfs;

return par;

} //end of drawContentWr



function drawCoupeDoor(par){

	//функция отрисовывает прямую дверь шкафа-купе из профилей
	par.mesh = new THREE.Object3D();	

	var mirrowMaterial = new THREE.MeshLambertMaterial({color: 0xcccccc});
	
	//конструктивные размеры профилей
	var constParams = getDoorParams();
	
	var dxfBasePoint0 = par.dxfBasePoint;
	//левый профиль
	var vertProfParams = {
		type: "rect",
		poleProfileY: constParams.sideProf.y,
		poleProfileZ: constParams.sideProf.z,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, constParams.sideProf.y, 0),
		length: par.height, 
		poleAngle: 0,
		material: par.profMaterial,
		dxfArr: dxfPrimitivesArr,
		partName: "vertCoupeProf",
		angle: Math.PI / 2,
		}
	var pole = drawPole3D_4_1(vertProfParams).mesh;
	pole.position.x = constParams.sideProf.y;
	pole.position.z = -vertProfParams.poleProfileZ / 2;
	par.mesh.add(pole);
	pole.doorId = par.doorId;
	
	//правый профиль
	var vertProfParams = {
		type: "rect",
		poleProfileY: constParams.sideProf.y,
		poleProfileZ: constParams.sideProf.z,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, par.width, 0),
		length: par.height,
		poleAngle: 0,
		material: par.profMaterial,
		dxfArr: dxfPrimitivesArr,
		partName: "vertCoupeProf",
		angle: Math.PI/2,
		}
	var pole = drawPole3D_4_1(vertProfParams).mesh;
	pole.position.x = par.width;
	pole.position.z = -vertProfParams.poleProfileZ / 2;
	par.mesh.add(pole);
	pole.doorId = par.doorId;
	
	//нижний профиль

	var botProfParams = {
		type: "rect",
		poleProfileY: constParams.botProf.y,
		poleProfileZ: constParams.botProf.z,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, constParams.sideProf.y, 0),
		length: par.width - constParams.sideProf.y * 2,
		poleAngle: 0,
		material: par.profMaterial,
		dxfArr: dxfPrimitivesArr,
		partName: "botCoupeProf",
		}
	var pole = drawPole3D_4_1(botProfParams).mesh;
	pole.position.x = constParams.sideProf.y;
	pole.position.z = -botProfParams.poleProfileZ / 2;
	par.mesh.add(pole);
	pole.doorId = par.doorId;
	
	//верхний профиль
	
	var topProfParams = {
		type: "rect",
		poleProfileY: constParams.topProf.y,
		poleProfileZ: constParams.topProf.z,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, constParams.sideProf.y, par.height - constParams.topProf.y),
		length: par.width - constParams.sideProf.y * 2,
		poleAngle: 0,
		material: par.profMaterial,
		dxfArr: dxfPrimitivesArr,
		partName: "topCoupeProf",
		}
	var pole = drawPole3D_4_1(topProfParams).mesh;
	pole.position.x = constParams.sideProf.y;
	pole.position.y = par.height - topProfParams.poleProfileY;
	pole.position.z = -botProfParams.poleProfileZ / 2;
	par.mesh.add(pole);
	pole.doorId = par.doorId;
	
	//вставки сверху вниз
	
	//коррекция размеров вставок на толщину уплотнителя
	var sealThk = 0;
	var width0 = par.width - constParams.plateSizeDelta.width;
	
	var platePar={
		height: 0,
		width: width0,
		thk: 10,
		dxfArr :dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		material: par.plateMaterial, 
		text: "панель двери",
		roundHoles: [],
		partName: "doorPanel",
		}
	var inpostProfParams = {
		type: "rect",
		poleProfileY: constParams.inpostProf.y,
		poleProfileZ: constParams.inpostProf.z,
		dxfBasePoint: par.dxfBasePoint,
		length: par.width - constParams.sideProf.y * 2,
		poleAngle: 0,
		material: par.profMaterial,
		dxfArr: dxfPrimitivesArr,
		partName: "inpostCoupeProf",
		}
		
	//цикл построения вставок (сверху вниз)
	
	//позиция левого нижнего видимого угла текущей вставки (без учета вхождения в паз)
	var inpostPos = {
		x: constParams.sideProf.y,
		y: par.height - constParams.topProf.y,
		}
		
	for(var i=0; i<par.plates.length; i++){		
		//панели		
		if(par.plates[i].material == "зеркало") {
			platePar.partName = "mirrow";
			platePar.material = mirrowMaterial;
			platePar.thk = 4;
			sealThk = 1.5;
			}
		if(par.plates[i].material == "лдсп") {
			platePar.partName = "doorPanel";
			platePar.material = par.plateMaterial;
			platePar.thk = params.doorPlateThk;
			sealThk = 0;
			if(params.doorPlateThk == 8) sealThk = 1; 
			}
		
		//коррекция ширины вставки на толщину уплотнителя
		platePar.width = width0 - sealThk * 2;

		//глубина вхождения вставки в верхний паз
		var topSlotIns = constParams.topProf.slotDepth;
		if(i > 0) topSlotIns = constParams.inpostProf.slotDepth;
		
		//глубина вхождения вставки в нижний паз
		var botSlotIns = constParams.botProf.slotDepth;
		if(i < par.plates.length - 1) botSlotIns = constParams.inpostProf.slotDepth;
		
		//увеличиваем высоту вставки на глубину вхождения в верхний и нижний паз
		platePar.height = par.plates[i].height + topSlotIns + botSlotIns - sealThk * 2;
		
		//позиция левого нижнего видимого угла текущей вставки
		inpostPos.y -= par.plates[i].height;
		
		//координата вставки панели				
		var platePos = newPoint_xy(inpostPos, -constParams.sideProf.slotDepth, -botSlotIns - sealThk)
		platePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, platePos.x, platePos.y);
		
		var plate = drawPlate(platePar).mesh;
			plate.position.x = platePos.x; 
			plate.position.y = platePos.y;
			plate.position.z = -platePar.thk / 2;	
			par.mesh.add(plate);
			plate.doorId = par.doorId;
			
		//подпись
		var textHeight = 30;
		var textBasePoint = newPoint_xy(platePar.dxfBasePoint, 50, platePar.height / 3);
		addText(par.plates[i].material, textHeight,  dxfPrimitivesArr, textBasePoint);

		//разделительные профили
		if(i < par.plates.length - 1){
			var profPos = newPoint_xy(inpostPos, 0, -constParams.inpostProf.y)
			inpostProfParams.dxfBasePoint = newPoint_xy(par.dxfBasePoint, profPos.x, profPos.y);

			var pole = drawPole3D_4_1(inpostProfParams).mesh;
			pole.position.x = profPos.x;
			pole.position.y = profPos.y;
			pole.position.z = -inpostProfParams.poleProfileZ / 2;
			par.mesh.add(pole);
			pole.doorId = par.doorId;
			
			inpostPos.y -= constParams.inpostProf.y;
			}
		}
	
	return par;
	
} //end of drawCoupeDoor


function getDoorParams(){
	
	/*функция возвращает геометрические параметры профилей
	Внимание! задаются условные размеры профилей, а не габаритные!
	Условные размеры рассчитываются таким образом, чтобы на их основе правильно считались
	размеры горизонтальных профилей и заполнения
	Коррекция размера вставки дана без учета уплотнителя (для лдсп 10мм) 
	*/
	
	//размеры для системы эконом
	var par = {
		sideProf: {
			y: 52/2, //рассчитывается исходя из длины горизонтальных профилей
			z: 34,
			},
		topProf: {
			y: 22,
			z: 15,
			},
		botProf: {
			y: 57,
			z: 15,
			},
		inpostProf: {
			y: 25,
			z: 15,
			},
		doorOffsetTop: 35/2,
		doorOffsetBot: 35/2,
		plateSizeDelta: {
			height: 59,
			width: 36,
			inpost: 9,
			},
		doorOverHang: 25,
		}
	
	//размеры для системы стандарт
	if(params.doorProfMat_wr !="эконом"){
		par = {
			sideProf: {
				y: 52/2, //рассчитывается исходя из длины горизонтальных профилей
				z: 34,
				},
			topProf: {
				y: 21,
				z: 15,
				},
			botProf: {
				y: 56,
				z: 15,
				},
			inpostProf: {
				y: 25,
				z: 15,
				},
			doorOffsetTop: 40/2,
			doorOffsetBot: 40/2,
			plateSizeDelta: {
				height: 57,
				width: 36,
				inpost: 9,
				},
			doorOverHang: 25,
			}
		
		//учитываем наличе доводчика
		if(params.closer == "есть") par.doorOffsetTop += 5; 
		}

	if(params.doorProfMat_wr == "H"){
		par.sideProf.y = 70/2; 
		par.plateSizeDelta.width = 54;
		par.doorOverHang = 35;
		}
	if(params.doorProfMat_wr == "fusion"){
		par.sideProf.y = 76.4/2;
		par.plateSizeDelta.width = 60;
		par.doorOverHang = 39.5;
		}
	if(params.doorProfMat_wr == "flat"){
		par.sideProf.y = 51/2;
		par.plateSizeDelta.width = 35;
		par.doorOverHang = 45;
		}
	
	//учет шлегеля
	par.shlegelThk = 10;
	if(params.schlegel == "нет") par.shlegelThk = 0;
	
	//глубина пазов в профилях для расчета размеров и позиции вставок
	par.sideProf.slotDepth = (par.sideProf.y * 2 - par.plateSizeDelta.width) / 2;
	par.topProf.slotDepth = (par.topProf.y + par.botProf.y - par.plateSizeDelta.height) / 2;
	par.botProf.slotDepth = par.topProf.slotDepth;
	par.inpostProf.slotDepth = (par.inpostProf.y - par.plateSizeDelta.inpost) / 2;
	
	return par;
}


function drawCarcasStright(par){
	par.mesh = new THREE.Object3D();
	
	var thk = params.carcasThk_wr;

var leftOffset = 0;
var rightOffset = 0;
var topOffset = 0;
var botOffset = 0;
var rearOffset = 0;
if(params.rearWall_wr == "накладная") rearOffset = params.rearWallThk_wr;
var sidePanelsWidth = par.depth - rearOffset;

//высота боковых панелией
var deltaHeight = 0;
var botEdging = params.sideEdging;
if(params.topWall_wr == "накладная") deltaHeight -= thk;
//цоколь
	var posY = 0;
	if(params.botWall_wr == "цоколь"){
		if(params.botWallType != "внутренний короб"){
			deltaHeight -= params.legsHeight_wr;
			botEdging = 0;
			posY = params.legsHeight_wr
			}
		}

//левая панель
if(params.leftWall_wr != "нет"){

	var platePar={
		height: par.heightLeft + deltaHeight,
		width: sidePanelsWidth,
		thk: thk,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: dxfBasePoint,
		text: "левая панель",
		material: params.materials.timber,
		roundHoles: [],
		partName: "carcasPanel",
		edging: {
			top: params.sideEdging,
			bot: botEdging,
			right: params.faceEdging,
			left: params.sideEdging,
			}
		}
	
	//кромка
	if(params.rearWallMat_wr == "двп") platePar.edging.left = 0;
	if(params.topWall_wr == "накладная") platePar.edging.top = 0;
	if(params.leftWall_wr == "фальшпанель") {
		platePar.width = 100;
		platePar.edging.left = params.faceEdging;
	}
		
	var plate = drawPlate(platePar).mesh;
	plate.rotation.y = - Math.PI /2;
	plate.position.x = thk;
	plate.position.y = posY;
	plate.position.z = par.depth - platePar.width;
	par.mesh.add(plate);
	
	dxfBasePoint = newPoint_xy(dxfBasePoint, par.depth + 500, 0);
	leftOffset = thk;
	
} //конец левой панели

//правая панель
if(params.rightWall_wr != "нет"){

	var platePar={
		height: par.heightRight + deltaHeight,
		width: sidePanelsWidth,
		thk: thk,
		dxfArr :dxfPrimitivesArr,
		dxfBasePoint: dxfBasePoint,
		text: "правая панель",
		material: params.materials.timber,
		roundHoles: [],
		partName: "carcasPanel",
		edging: {
			top: params.sideEdging,
			bot: botEdging,
			right: params.faceEdging,
			left: params.sideEdging,
			}
		}
	
	//кромка
	if(params.rearWallMat_wr == "двп") platePar.edging.left = 0;
	if(params.topWall_wr == "накладная") platePar.edging.top = 0;
	if(params.rightWall_wr == "фальшпанель") {
		platePar.width = 100;
		platePar.edging.left = params.faceEdging;
	}
	
	var plate = drawPlate(platePar).mesh;
	plate.rotation.y = - Math.PI /2;
	plate.position.x = par.width;
	plate.position.y = posY;
	plate.position.z = par.depth - platePar.width;	
	par.mesh.add(plate);
	
	dxfBasePoint = newPoint_xy(dxfBasePoint, par.depth + 500, 0);
	rightOffset = thk;
	
	
} //конец правой панели

var topAng = Math.atan((par.heightRight - par.heightLeft) / (par.width - thk * 2));

//верхняя панель
if(params.topWall_wr != "нет"){

	var platePar={
		height: par.width - leftOffset - rightOffset,
		width: sidePanelsWidth,
		thk: thk,
		dxfArr :dxfPrimitivesArr,
		dxfBasePoint: dxfBasePoint,
		text: "верхняя панель",
		material: params.materials.timber,
		roundHoles: [],
		partName: "carcasPanel",
		edging: {
			top: params.sideEdging,
			bot: params.sideEdging,
			left: params.faceEdging,
			right: params.sideEdging,
			}
		}
	
	if(params.topWall_wr == "накладная") {
		platePar.width += params.topPanelOffset_wr;
		platePar.height = par.width;
	}
	
	if(params.topWall_wr == "фальшпанель") { 
		platePar.width = 100;
		platePar.edging.top = 0;
		platePar.edging.bot = 0;
		platePar.edging.right = params.faceEdging;
		}
		
	//кромка
	if(params.topWall_wr == "внутренняя") {
		platePar.edging.top = 0;
		platePar.edging.bot = 0;
		platePar.edging.right = 0;
	}
	
	
	var pos = {
		x: leftOffset,
		y: par.heightLeft,
		z: rearOffset + platePar.width,
		}
	if(params.topWall_wr == "накладная") pos.x = 0;
	if(params.topWall_wr == "фальшпанель") pos.z = params.depth_wr// + platePar.width;
	
	//наклон верхней крышки
	
	if(topAng != 0){
		var deltaLenLeft = thk * Math.tan(topAng);
		if(deltaLenLeft < 0) pos = polar(pos, topAng, -deltaLenLeft)
		platePar.height = platePar.height / Math.cos(-topAng);
		if(topAng > 0) platePar.height -= deltaLenLeft;
		if(topAng < 0) platePar.height += deltaLenLeft;
		}
	var plate = drawPlate(platePar).mesh;
	plate.rotation.x = Math.PI /2;
	plate.rotation.y = topAng
	plate.rotation.z = - Math.PI /2;
	plate.position.x = pos.x;	
	plate.position.y = pos.y;
	plate.position.z = pos.z;
	if(topAng != 0){
		
		}
	par.mesh.add(plate);
	
	//уголки
	if(params.topWall_wr != "фальшпанель" && topAng == 0){
		var angPar = {
			depth: platePar.width - 100,
			width: par.width,
			pos: "bot",
			}
		var posX = 0;
		if(params.leftWall_wr == "боковина") {
			angPar.width -= thk;
			posX += thk;
			}
		if(params.rightWall_wr == "боковина") {
			angPar.width -= thk;
			}
		var angGroup = drawShelfAngles(angPar).mesh;
			angGroup.position.x = posX;
			angGroup.position.y = par.heightLeft - thk;
		par.mesh.add(angGroup);
		}
	
	dxfBasePoint = newPoint_xy(dxfBasePoint, par.depth + 500, 0);
	topOffset = thk;
	
	//вид спереди
	var p1 = polar(plate.position, topAng + Math.PI / 2, -thk)
	
} //конец верхней панели

//верхние вертикальые панели для наклонного верха
if(par.heightLeft != par.heightRight || par.hasTopBeam){

	var platePar={
			heightLeft: (par.width - leftOffset - rightOffset) / Math.cos(topAng),
			width: 100,
			thk: thk,
			topAng: -topAng,
			botAng: -topAng,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: dxfBasePoint,
			text: "верхнее ребро",
			material: params.materials.timber,
			roundHoles: [],
			partName: "carcasPanel",
			edging: {
				top: params.faceEdging,
				bot: params.sideEdging,
				left: 0,
				right: params.sideEdging,
				}
			}
		//передняя
		var plate = drawNoRectPlate(platePar).mesh;
			plate.rotation.z = -Math.PI /2 + topAng;
			plate.position.x = leftOffset;
			plate.position.y = par.heightLeft - thk / Math.cos(topAng);
			plate.position.z = par.depth - thk;	
			par.mesh.add(plate);
			
		dxfBasePoint = newPoint_xy(dxfBasePoint, 500, 0);
		
		//задняя
		platePar.dxfBasePoint = dxfBasePoint;
		var plate = drawNoRectPlate(platePar).mesh;
			plate.rotation.z = -Math.PI /2 + topAng;
			plate.position.x = leftOffset;
			plate.position.y = par.heightLeft - thk / Math.cos(topAng);
			plate.position.z = thk;	
			par.mesh.add(plate);
			
		dxfBasePoint = newPoint_xy(dxfBasePoint, 500, 0);

		//верхние накладки
		if(params.topOnlay_wr == "есть"){
			platePar.heightLeft = par.width / Math.cos(topAng);
			
			var plate = drawNoRectPlate(platePar).mesh;
				plate.rotation.z = -Math.PI /2 + topAng;
				plate.position.x = 0;
				plate.position.y = par.heightLeft - thk * Math.tan(topAng); //верхняя грань вровень с верхом крышки
				plate.position.y += (platePar.width - 40) / Math.cos(topAng);
				plate.position.z = par.depth;	
				par.mesh.add(plate);
				
			dxfBasePoint = newPoint_xy(dxfBasePoint, 500, 0);
			}
		
		
		
	}
	




//нижняя панель
if(params.botWall_wr != "нет"){
	var platePar={
		height: par.width - leftOffset - rightOffset,
		width: sidePanelsWidth,
		thk: thk,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: dxfBasePoint,
		text: "нижняя панель",
		material: params.materials.timber,
		roundHoles: [],
		partName: "carcasPanel",
		edging: {
			top: 0,
			bot: 0,
			left: params.faceEdging,
			right: 0,
			}
		}
	if(params.botWall_wr == "фальшпанель") {
		platePar.edging.right = params.faceEdging;
		platePar.width = 100;
		}
	
	var posX = leftOffset;
	if(params.botWall_wr == "цоколь"){
		if(params.botWallType != "внутренний короб"){
			platePar.height = par.width + params.faceEdging * 2;
			platePar.edging.top = params.faceEdging;
			platePar.edging.bot = params.faceEdging;
			posX = -params.faceEdging;
			}
		}
		
	var plate = drawPlate(platePar).mesh;
	plate.rotation.x = Math.PI /2;
	plate.rotation.z = - Math.PI /2;
	plate.position.x = posX;
	plate.position.y = params.legsHeight_wr;
	if(params.botWall_wr == "фальшпанель") plate.position.y = thk;
	plate.position.z = par.depth;	
	par.mesh.add(plate);
	
	dxfBasePoint = newPoint_xy(dxfBasePoint, par.depth + 500, 0);
	botOffset = plate.position.y;
	
	
} //конец нижней панели

//панели цоколя

if(params.botWall_wr == "цоколь" && params.botWallType != "накладная панель"){
	var platePar={
		height: par.width - leftOffset - rightOffset,
		width: params.legsHeight_wr - thk,
		thk: thk,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: dxfBasePoint,
		text: "панель цоколя",
		material: params.materials.timber,
		roundHoles: [],
		partName: "carcasPanel",
		edging: {
			top: 0,
			bot: 0,
			left: 0,
			right: params.sideEdging,
			}
		}
	
	var posX = leftOffset;
	var sideOffset = 30;
	if(params.botWallType == "накладной короб"){
		platePar.height -= sideOffset * 2;
		posX += sideOffset
		}
		

	//передняя панель
	var plate = drawPlate(platePar).mesh;
	plate.rotation.z = -Math.PI /2;
	plate.position.x = posX;
	plate.position.y = platePar.width;
	plate.position.z = par.depth - thk - sideOffset;	
	par.mesh.add(plate);
	
	dxfBasePoint = newPoint_xy(dxfBasePoint, 500, 0);
	
	//задняя панель
	platePar.dxfBasePoint = dxfBasePoint;
	var plate = drawPlate(platePar).mesh;
	plate.rotation.z = -Math.PI /2;
	plate.position.x = posX;
	plate.position.y = platePar.width;
	plate.position.z = sideOffset;	
	par.mesh.add(plate);
	
	dxfBasePoint = newPoint_xy(dxfBasePoint, 500, 0);
	
	//боковые панели
	if(params.botWallType == "накладной короб"){
		var platePar={
			height: par.depth - thk,
			width: params.legsHeight_wr - thk,
			thk: thk,
			dxfArr :dxfPrimitivesArr,
			dxfBasePoint: dxfBasePoint,
			text: "боковая панель цоколя",
			material: params.materials.timber,
			roundHoles: [],
			partName: "carcasPanel",
			edging: {
				top: params.faceEdging,
				bot: params.sideEdging,
				left: 0,
				right: params.sideEdging,
				}
			}
		//левая
		var plate = drawPlate(platePar).mesh;
			plate.rotation.z = -Math.PI /2;
			plate.rotation.y = -Math.PI /2;
			plate.position.x = sideOffset + thk;
			plate.position.y = platePar.width;
			plate.position.z = thk / 2;	
			par.mesh.add(plate);
			
			dxfBasePoint = newPoint_xy(dxfBasePoint, 500, 0);
			
		//правая
		platePar.dxfBasePoint = dxfBasePoint;
		var plate = drawPlate(platePar).mesh;
			plate.rotation.z = -Math.PI /2;
			plate.rotation.y = -Math.PI /2;
			plate.position.x = par.width - sideOffset;
			plate.position.y = platePar.width;
			plate.position.z = thk / 2;	
			par.mesh.add(plate);
			
			dxfBasePoint = newPoint_xy(dxfBasePoint, 500, 0);

		}
	
	//внутренние панели под перегородками
	var platePar={
		height: par.depth - thk * 2 - sideOffset * 2,
		width: params.legsHeight_wr - thk,
		thk: thk,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: dxfBasePoint,
		text: "перемычки цоколя",
		material: params.materials.timber,
		roundHoles: [],
		partName: "carcasPanel",
		edging: {
			top: 0,
			bot: 0,
			left: 0,
			right: params.sideEdging,
			}
		}
	var posX = $(".sectWidth").eq(0).val() * 1.0;
	
	for(var i=1; i<par.sectAmt; i++){
		//левая
		platePar.dxfBasePoint = dxfBasePoint;
		var plate = drawPlate(platePar).mesh;
			plate.rotation.z = -Math.PI /2;
			plate.rotation.y = -Math.PI /2;
			plate.position.x = posX + thk * 2;
			plate.position.y = platePar.width;
			plate.position.z = thk + sideOffset;	
			par.mesh.add(plate);
			
		dxfBasePoint = newPoint_xy(dxfBasePoint, 500, 0);
		
		posX += $(".sectWidth").eq(i).val() * 1.0 + thk;
		}

} //конец панелей цоколя

//ножки

if(params.botWall_wr == "цоколь" && params.botWallType == "накладная панель" && params.legsHeight_wr > 16){
	
	var legsPar = {
		type: "round",
		size: 50,
		height: params.legsHeight_wr - thk,
		material: params.materials.metal,
		}
	
	var legSideOffset = 40 + legsPar.size/2;
	var rearPosZ = legSideOffset;
	var frontPosZ = par.depth - legSideOffset;
	
	var posX = 0;
	
	for(var i=0; i<par.sectAmt + 1; i++){
		//задняя
		legsPar = drawWardrobeLeg(legsPar);
		var leg = legsPar.mesh;
		leg.position.x = posX + thk * 1.5;
		leg.position.z = rearPosZ;
		//сдвигаем крайние стойки
		if(i==0) leg.position.x = legSideOffset;
		if(i == par.sectAmt) leg.position.x = par.width - legSideOffset;
		
		par.mesh.add(leg);
		
		
		//передняя
		legsPar = drawWardrobeLeg(legsPar);
		var leg = legsPar.mesh;
		leg.position.x = posX + thk * 0.5;
		leg.position.z = frontPosZ;
		//сдвигаем крайние стойки
		if(i==0) leg.position.x = legSideOffset;
		if(i == par.sectAmt) leg.position.x = par.width - legSideOffset;
		par.mesh.add(leg);
		
		posX += $(".sectWidth").eq(i).val() * 1.0 + thk
		}
	}

//задняя панель

if(params.rearWall_wr != "нет"){
	
	var panelOffset_left = leftOffset;
	var panelOffset_right = rightOffset;
	var panelOffset_top = topOffset;
	var panelOffset_bot = botOffset;
	if(params.rearWall_wr == "накладная"){
		if(leftOffset) panelOffset_left = params.rearWallDelta_wr;
		if(rightOffset) panelOffset_right = params.rearWallDelta_wr;
		if(topOffset) panelOffset_top = params.rearWallDelta_wr;
		if(botOffset) panelOffset_bot = params.rearWallDelta_wr + botOffset - thk;
		}

	var panelPar = {
		heightLeft: par.heightLeft - panelOffset_top - panelOffset_bot,
		heightRight: par.heightRight - panelOffset_top - panelOffset_bot,
		thk: params.rearWallThk_wr,
		width: par.width - panelOffset_left - panelOffset_right,
		edgingAll: 0,
		dxfBasePoint: dxfBasePoint,
		text: "задняя панель",
		partName: "rearPanel",
		}
	
	if(params.rearWall_wr == "накладная" && params.rearWallMat_wr == 'лдсп')
		panelPar.edgingAll = params.sideEdging;
				
	var panel = drawFrontPanel(panelPar).mesh;
	panel.position.x = panelOffset_left;
	panel.position.y = panelOffset_bot;
	par.mesh.add(panel);
		

	dxfBasePoint = newPoint_xy(dxfBasePoint, panelPar.width * 1.0 + 500, 0);
	
} //конец задней панели

//сохраняем параметры
	par.leftOffset = leftOffset;
	par.rightOffset = rightOffset;
	par.topOffset = topOffset;
	par.botOffset = botOffset;
	par.rearOffset = rearOffset;
	
	return par;
}; //end of drawCarcasStright




function drawSideSect(par){
	/*
	height: params.height_wr
	width: params.leftSectWidth
	shelfType: params.leftSect
	depth: params.leftSectDepth
	shelfAmt: params.leftSectShelfAmt
	*/
	par.mesh = new THREE.Object3D();

	var thk = params.carcasThk_wr;
	var cornerShelfOffset = 10; //отступ края полки от края задней панели и боковой панели шкафа
	
	//задняя панель доп. секции
	var platePar={
		height: par.height,
		width: par.width,
		thk: thk,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		text: "задняя панель левой доп. секции",
		material: params.materials.timber,
		roundHoles: [],
		partName: "carcasPanel",
		edging: {
			top: params.sideEdging,
			bot: params.sideEdging,
			left: params.faceEdging,
			right: 0
			}
		}
	
	var plate = drawPlate(platePar).mesh;
	if(par.side == "left") plate.position.x = -platePar.width;
	par.mesh.add(plate);
	
	//полки
	var shelfPar = {
		type: par.shelfType,
		width: par.width - cornerShelfOffset,
		depth: par.depth - thk - cornerShelfOffset,
		thk: thk,
		material: params.materials.timber,
		dxfBasePoint: par.dxfBasePoint,
		}
	
	var shelfStep = (par.height - thk) / (par.shelfAmt + 1);
	
	var shelfAmt1 = par.shelfAmt
	if(params.topWall_wr != "нет") shelfAmt1 += 1;
	
	var posY = shelfStep;
	if(params.botWall_wr == "цоколь") {
		posY = params.legsHeight_wr;
		shelfAmt1 += 1;
		shelfStep = (par.height - thk - params.legsHeight_wr) / (par.shelfAmt + 1);
		}
		
	for(var i=0; i<shelfAmt1; i++){
		
		shelfPar.dxfBasePoint = newPoint_xy(shelfPar.dxfBasePoint, 0, -shelfPar.depth - 200);
		
		var shelf = drawCornerShelf(shelfPar).mesh;
		shelf.rotation.x = Math.PI / 2;
		shelf.position.x = 0;
		shelf.position.y = posY + thk;
		shelf.position.z = thk;
		if(par.side == "left"){
			shelf.rotation.y = Math.PI;
			shelf.position.y = posY;
			}
		par.mesh.add(shelf);
		posY += shelfStep;
		}
		
	return par;
}; //end of drawSideSect

//отрисовка задней панели или двери

function drawFrontPanel(par){

	/*
	var panelPar = {
		heightLeft: par.heightLeft,
		heightRight: par.heightRight,
		thk: params.rearWallThk_wr,
		width: par.width - panelOffset_left - panelOffset_right,
		edgingAll: 0,
		dxfBasePoint: dxfBasePoint,
		text: "задняя панель",
		partName: "rearPanel",
		}
	*/

	var topAng = Math.atan((par.heightRight - par.heightLeft) / par.width);

	var platePar={
			height: par.heightLeft,
			heightLeft: par.heightLeft,
			width: par.width,
			thk: par.thk,
			topAng: topAng,
			botAng: 0,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: par.dxfBasePoint,
			text: par.text,
			material: params.materials.timber,
			roundHoles: [],
			partName: par.partName,
			edging: {
				top: 0,
				bot: 0,
				left: 0,
				right: 0,
				}
			};
	
	var drawFunction = drawPlate; //прямоугольная задняя панель
	if(par.heightLeft != par.heightRight) drawFunction = drawNoRectPlate; //трапециевидная задняя панель
	
	//кромка
		if(par.edgingAll){
			platePar.edging = {
				top: par.edgingAll,
				bot: par.edgingAll,
				left: par.edgingAll,
				right: par.edgingAll,
				};
			}

	par.mesh = drawFunction(platePar).mesh;
	
	return par;

} //drawFrontPanel



