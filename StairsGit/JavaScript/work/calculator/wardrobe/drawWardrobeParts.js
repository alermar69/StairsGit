function drawWardrobe(par) {

	
	var wrCarcas = new THREE.Object3D();
	var wrDoors = new THREE.Object3D();
	var wrShelfs = new THREE.Object3D();
	var wrMetis = new THREE.Object3D();
	
	//очищаем глобальный массив параметров деталей
	wrParams = {
		carcasPanels: {amt: 0, area: 0, perim: 0,},
		rearPanels: {amt: 0, area: 0,},
		doors: {amt: 0, area: 0, perim: 0,},
		metis: {amt: 0, area: 0,},
		poles: {amt: 0, len: 0,},
		boxSlidersAmt: 0,
		hingeAmt: 0,
		};
		
	/*параметры*/
	var sectAmt = par.sectAmt_wr;
	var model = par.model_wr;
	var width = par.width_wr;
	var heightLeft = par.heightLeft_wr;
	var heightRight = par.heightRight_wr;
	var angleTop = par.angleTop_wr / 180 * Math.PI;
	var depth = par.depth_wr;
	var dxfBasePoint = par.dxfBasePoint;
	var topOnlayWidth = 100; //толщина накладки
	var doorTopOffset = topOnlayWidth/2;//уменьшение дверей под накладку

	var carcasThk_wr = par.carcasThk_wr;
	var doorsThk_wr = par.doorsThk_wr;
	var doorGap = 2;
	var horModHeight = (Math.max(heightLeft, heightRight) - carcasThk_wr * 2) / par.maxRowAmt_wr;
	var sideFactor = 1;
	if(heightRight > heightLeft) sideFactor = -1;
	
	//параметры верха шкафа
	var deltaHeight = Math.abs(heightRight - heightLeft);
	var topPlateLength1 = deltaHeight / Math.sin(angleTop);
	var maxTopLength = (width - 2*carcasThk_wr) / Math.cos(angleTop);
	if(topPlateLength1 > maxTopLength) topPlateLength1 = maxTopLength;
	var topPlateLength2 = width - carcasThk_wr - deltaHeight / Math.tan(angleTop);
	
	//параметры петель
	var sideDoorOffset_cl = 2;
	var sideDoorOffset_op = 4;
	var midDoorOffset_cl = carcasThk_wr / 2 + 2;
	var midDoorOffset_op = carcasThk_wr / 2 + 4;
	var hingePar = {
		type: par.hingeType,
		whDiam: 5,
		whDist: 32,
		whOffset: 37,
		dhDiam: 35,
		dhDiam2: 5,
		dhOffset: 21.5,
		dhOffset2: 9.5,
		dhDist: 45,
		offsetCl: 7.5,
		doorGap: 2,
		sideDoorOffset_cl: 2,
		sideDoorOffset_op: 4,
		midDoorOffset_cl: params.carcasThk_wr / 2 + 2,
		midDoorOffset_op: params.carcasThk_wr / 2 + 4,
		dxfArr: [],
		dxfBasePoint: {x:0, y:0},
		material: par.material,
	};
	var hingeDoorEdgeDist = params.carcasThk_wr + hingePar.dhOffset + hingePar.dhDiam;
	
	//параметры секций
	var sections = [];
	var sectPos = width - carcasThk_wr;
	var topPlateOuterX = carcasThk_wr + topPlateLength2;
	var topPlateInnerX = carcasThk_wr + topPlateLength2 - carcasThk_wr * Math.tan(angleTop/2);
	var innerAngleHeightSub = carcasThk_wr + carcasThk_wr * Math.tan((Math.PI/2-angleTop)/2);
	var innerHeightSub = 2*carcasThk_wr ;
	
	//отверстия для петель для стенок и перегородок 
	var plateSlots = [];
	
	for (var i=0; i<sectAmt; i++){
		var sectWidth = par.sections[i].width;
		
		if(i > 0){
		    sectPos -= par.sections[i-1].width + carcasThk_wr;
		}

		sections[i] = {
			width: sectWidth,
			pos: sectPos,
			topNotchBox: 0,
			topNotchDoor: 0,
			heightLeftBox: 0,
			heightLeftDoor: 0,
			heightRightBox: 0,
			heightRightDoor: 0,
			heightPlate: 0,
			type: par.sections[i].type,
			rowAmt: par.maxRowAmt_wr,
			rightPlateAngle: 0,
			leftPlateAngle: 0,
		}

		if(sideFactor == 1){
			/**расчет параметров секций для полок/ящиков**/
			
			//Секция наклонная-горизонтальная
		    if(sectPos - sectWidth < topPlateInnerX && sectPos > topPlateInnerX) {
				sections[i].topNotchBox = topPlateInnerX - (sectPos - sectWidth);
			    sections[i].heightLeftBox = heightLeft - innerHeightSub;
			    sections[i].heightRightBox = (heightRight - innerAngleHeightSub) + (width - sectPos - carcasThk_wr) * Math.tan(angleTop);
		    } 
			//Секция наклонная
			else if(sectPos - sectWidth >= topPlateInnerX && sectPos > topPlateInnerX) {
				sections[i].topNotchBox = 0;
			    sections[i].heightLeftBox = (heightRight - innerAngleHeightSub) + (width - (sectPos - sectWidth) - carcasThk_wr) * Math.tan(angleTop);
			    sections[i].heightRightBox = (heightRight - innerAngleHeightSub) + (width - sectPos - carcasThk_wr) * Math.tan(angleTop);
			}
			//Секция горизонтальная
			else{
				sections[i].topNotchBox = 0;
			    sections[i].heightLeftBox = heightLeft - innerHeightSub;
			    sections[i].heightRightBox = heightLeft - innerHeightSub;
			}
			
			/**расчет параметров для перегородок**/
			
			if(sectPos + carcasThk_wr > topPlateInnerX) {
				sections[i].heightPlate = (heightRight - innerAngleHeightSub) + (width - sectPos - 2*carcasThk_wr) * Math.tan(angleTop);
			}
			else{
				sections[i].heightPlate = heightLeft - innerHeightSub;
			}
			
			/**расчет параметров для дверей**/

			var doorOffsetRight = 0;
			var doorOffsetLeft = 0;
			if(i == 0 && i == sectAmt-1) {
				doorOffsetRight = carcasThk_wr - sideDoorOffset_cl;
				doorOffsetLeft = carcasThk_wr - sideDoorOffset_cl;
			}
			else if(i == 0){
				doorOffsetRight = carcasThk_wr - sideDoorOffset_cl;
				doorOffsetLeft = carcasThk_wr/2 - doorGap;
			}
			else if(i == sectAmt-1){
				doorOffsetRight = carcasThk_wr/2 - doorGap;
				doorOffsetLeft = carcasThk_wr - sideDoorOffset_cl;
			}
			else{
				doorOffsetRight = carcasThk_wr/2 - doorGap;
				doorOffsetLeft = carcasThk_wr/2 - doorGap;
			}
			
		    //Секция наклонная-горизонтальная
		    if(sectPos - (sectWidth + doorOffsetLeft) < topPlateOuterX && sectPos + doorOffsetRight > topPlateOuterX) {
				sections[i].topNotchDoor = topPlateOuterX - (sectPos - sectWidth - doorOffsetLeft);
				sections[i].heightLeftDoor = heightLeft;
				sections[i].heightRightDoor = heightRight + (width - sectPos - doorOffsetRight) * Math.tan(angleTop);
		    } 
		    //Секция наклонная
			else if(sectPos - (sectWidth + doorOffsetLeft) >= topPlateOuterX && sectPos + doorOffsetRight > topPlateOuterX) {
				sections[i].topNotchDoor = 0;
			    sections[i].heightLeftDoor = heightRight + (width - (sectPos - sectWidth - doorOffsetLeft)) * Math.tan(angleTop);
			    sections[i].heightRightDoor = heightRight + (width - sectPos - doorOffsetRight) * Math.tan(angleTop);
			}
			//Секция горизонтальная
			else{
				sections[i].topNotchDoor = 0;
			    sections[i].heightLeftDoor = heightLeft;
			    sections[i].heightRightDoor = heightLeft;
			}
	    }
		else if(sideFactor == -1) {
			/**расчет параметров секций для полок/ящиков**/
			
			//Секция наклонная-горизонтальная
		    if(sectPos > width - topPlateInnerX && sectPos - sectWidth < width - topPlateInnerX) {
				sections[i].topNotchBox = sectPos - (width - topPlateInnerX);
			    sections[i].heightRightBox = heightRight - innerHeightSub;
			    sections[i].heightLeftBox = (heightLeft - innerAngleHeightSub) + (sectPos - sectWidth - carcasThk_wr) * Math.tan(angleTop);
		    } 
			//Секция наклонная
			else if(sectPos <= width - topPlateInnerX && sectPos - sectWidth < width - topPlateInnerX) {
				sections[i].topNotchBox = 0;
			    sections[i].heightLeftBox = (heightLeft - innerAngleHeightSub) + (sectPos - sectWidth - carcasThk_wr) * Math.tan(angleTop);
			    sections[i].heightRightBox = (heightLeft - innerAngleHeightSub) + (sectPos - carcasThk_wr) * Math.tan(angleTop);
			}
			//Секция горизонтальная
			else{
				sections[i].topNotchBox = 0;
			    sections[i].heightLeftBox = heightRight - innerHeightSub;
			    sections[i].heightRightBox = heightRight - innerHeightSub;
			}
			
			/**расчет параметров для перегородок**/
			
			if(sectPos < width - topPlateInnerX) {
				sections[i].heightPlate = (heightLeft - innerAngleHeightSub) + (sectPos - carcasThk_wr) * Math.tan(angleTop);
			}
			else{
				sections[i].heightPlate = heightRight - innerHeightSub;
			}
			
			/**расчет параметров для дверей**/

			var doorOffsetRight = 0;
			var doorOffsetLeft = 0;
			if(i == 0 && i == sectAmt-1) {
				doorOffsetRight = carcasThk_wr - sideDoorOffset_cl;
				doorOffsetLeft = carcasThk_wr - sideDoorOffset_cl;
			}
			else if(i == 0){
				doorOffsetRight = carcasThk_wr - sideDoorOffset_cl;
				doorOffsetLeft = carcasThk_wr/2 - doorGap;
			}
			else if(i == sectAmt-1){
				doorOffsetRight = carcasThk_wr/2 - doorGap;
				doorOffsetLeft = carcasThk_wr - sideDoorOffset_cl;
			}
			else{
				doorOffsetRight = carcasThk_wr/2 - doorGap;
				doorOffsetLeft = carcasThk_wr/2 - doorGap;
			}
			
		    //Секция наклонная-горизонтальная
		    if(sectPos - (sectWidth + doorOffsetLeft) < width - topPlateOuterX && sectPos + doorOffsetRight > width - topPlateOuterX) {
				sections[i].topNotchDoor = sectPos + doorOffsetRight - (width - topPlateOuterX);
				sections[i].heightLeftDoor = heightLeft + (sectPos - sectWidth - doorOffsetRight) * Math.tan(angleTop);
				sections[i].heightRightDoor = heightRight;
		    } 
		    //Секция наклонная
			else if(sectPos - (sectWidth + doorOffsetLeft) <= width - topPlateOuterX && sectPos + doorOffsetRight < width - topPlateOuterX) {
				sections[i].topNotchDoor = 0;
			    sections[i].heightLeftDoor = heightLeft + (sectPos - sectWidth - doorOffsetLeft) * Math.tan(angleTop);
			    sections[i].heightRightDoor = heightLeft + (sectPos + doorOffsetRight) * Math.tan(angleTop);
			}
			//Секция горизонтальная
			else{
				sections[i].topNotchDoor = 0;
			    sections[i].heightLeftDoor = heightRight;
			    sections[i].heightRightDoor = heightRight;
			}
	    }
	}
	
	//параметры ящиков
	var boxes = par.boxes;
	
	/*Материалы*/
	var timberMaterial = new THREE.MeshLambertMaterial( { color: 0x804000, overdraw: 0.5} );
	var timberMaterial2 = new THREE.MeshLambertMaterial( { color: 0xD29252, overdraw: 0.5} );
	
	var metalMaterial = new THREE.MeshLambertMaterial({color: 0x363636, wireframe: false});
	var floorMaterial = new THREE.MeshLambertMaterial( {color: 0xBFBFBF});	
	var stringerMaterial = new THREE.MeshLambertMaterial({color: 0x363636, wireframe: false});
	



//полки, ящики
dxfBasePoint = {x: 0, y: 2*(-Math.max(heightLeft, heightRight) - 500)};
		
function drawBoxes(){};  //пустая функция для навигации

var sideOffset = 10;
var doorOffset = 2;
var handleDepth = 20; //выступ ручки 

for (var i=0; i<boxes.length; i++){
	var sectNumber = boxes[i].sect * 1.0 - 1;

	if(sectNumber < 0 || sectNumber >= sectAmt){
		alert((sectNumber + 1) + " - неверный номер секции.")
	}
	else{
		console.log(boxes[i].widthType == "по секции")
		if(boxes[i].widthType == "по секции" && boxes[i].type != "перегородка"){
		    var boxWidth = sections[sectNumber].width;
		}
		else {
			var boxWidth = boxes[i].width;
		}
		
		var boxHeight = boxes[i].height;
 
		var boxpar = {
			width: boxWidth,
			height: boxHeight,
			depth: depth, 
			type: boxes[i].type,  
			thk: carcasThk_wr,
			doorsThk: doorsThk_wr,
			shelfMaterial: timberMaterial2,
			doorMaterial: metalMaterial,
			dxfArr :dxfPrimitivesArr,
			dxfBasePoint: dxfBasePoint,
			text: i,
			isDoorsOpened: isDoorsOpened,
			sideFactor: sideFactor,
			angleTop: angleTop
		}
		
		if(boxpar.type.indexOf("шкаф") != -1){
            //фасад
			var platepar={
		        height: boxHeight,
		        width: width/2,
		        thk: carcasThk_wr,
		        doorsThk: doorsThk_wr,
		        angleTop: angleTop,
		        dxfArr :dxfPrimitivesArr,
		        dxfBasePoint: dxfBasePoint,
		        text: "дверь шкафа в полках",
		        material: metalMaterial,
		        shelfMaterial: timberMaterial2,  
		        sideFactor: sideFactor,
		        depth: depth, 
		        addSideOffset: 0,
		        sectionpar: null
		    }
			if(boxpar.type == "шкаф лев.") {
				platepar.type = "влево";
			}
	        if(boxpar.type == "шкаф прав.") {
				platepar.type = "вправо";
			}
	        if(boxpar.type == "шкаф две") {
				platepar.type = "две двери";
			}
			
			platepar.sectionpar = sections[sectNumber];
			platepar.heightLeft = boxHeight;
			platepar.heightRight = boxHeight;
			platepar.width = sections[sectNumber].width + carcasThk_wr;
			
	        if(sectNumber == 0 && sectNumber == sectAmt - 1) platepar.width = sections[sectNumber].width + 2*carcasThk_wr - 2*sideDoorOffset_cl;
			else if(sectNumber == 0 || sectNumber == sectAmt - 1) platepar.width = sections[sectNumber].width + 2*carcasThk_wr - sideDoorOffset_cl - midDoorOffset_cl;
			else platepar.width = sections[sectNumber].width + 2*carcasThk_wr - 2*midDoorOffset_cl;
			
			platepar.topNotch = sections[sectNumber].topNotchDoor;
			platepar.type = platepar.type;
			platepar.doorGap = doorGap;
			if(platepar.type == "выдвижная"){ 
			    platepar.boxWidth = sections[sectNumber].width;
			}
			
			platepar = drawDoor(platepar);
			var plate = platepar.mesh;

			if(sectNumber == 0) {
				plate.position.x = width - platepar.width - sideDoorOffset_cl;
			}
			else if(sectNumber == sectAmt-1) {
				plate.position.x = sideDoorOffset_cl;
			}
			else {
				plate.position.x = sections[sectNumber].pos - sections[sectNumber].width - midDoorOffset_cl + doorGap*2;
			}
			plate.position.z = depth;
			if(platepar.type != "выдвижная"){
				plate.position.y = boxes[i].posY + carcasThk_wr;
			}
			if(isDoorsOpened) {
				if(platepar.type == "выдвижная"){ 
				    plate.position.z += depth/2;
				}
				else if(platepar.type == "две двери"){
					plate.position.x = sections[sectNumber].pos;
					
				    plate.children[1].rotation.y = Math.PI / 2;
				    plate.children[1].position.z += platepar.width + doorGap;
					plate.children[1].position.x = 0;
					if(sectNumber == 0) plate.children[1].position.x -= sideDoorOffset_op;
					else plate.children[1].position.x -= midDoorOffset_op;

					plate.children[0].rotation.y = -Math.PI / 2;
					plate.children[0].position.z += doorGap;
					plate.children[0].position.x = -sections[sectNumber].width;
					if(sectNumber == sectAmt-1) plate.children[0].position.x += sideDoorOffset_op;
					else plate.children[0].position.x += midDoorOffset_op;
				}
				else{
				    if(platepar.type == "вправо") {
				        plate.rotation.y = Math.PI / 2;
					    plate.position.z += platepar.width + doorGap;
					    plate.position.x = sections[sectNumber].pos;
						if(sectNumber == 0) plate.position.x -= sideDoorOffset_op;
						else plate.position.x -= midDoorOffset_op;
				    }
					else{
						plate.rotation.y = -Math.PI / 2;
						plate.position.z += doorGap;
					    plate.position.x = sections[sectNumber].pos-sections[sectNumber].width;
						if(sectNumber == sectAmt-1) plate.position.x += sideDoorOffset_op;
						else plate.position.x += midDoorOffset_op;
					}
				}
			}
			platepar.dxfBasePoint = newPoint_xy(platepar.dxfBasePoint, 0, -Math.max(heightLeft, heightRight) - 500);
			platepar.dxfBasePoint.x = 0;
			wrDoors.add(plate);
			
			//параметры для расчета цены
			wrParams.doors.amt += 1;
			wrParams.doors.area += platepar.area;
			wrParams.doors.perim += platepar.perim;
			//console.log(wrParams.doors.perim)
		
		}
		if(boxpar.type == "ящик" || boxpar.type == "ящик верхний"){
			boxpar.depth -= handleDepth;
		}
		if(boxpar.type == "ящик верхний"){
			boxpar.height = Math.max(sections[sectNumber].heightRightBox, sections[sectNumber].heightLeftBox) - carcasThk_wr;
			boxpar.heightLeft = sections[sectNumber].heightLeftBox - boxes[i].posY;
			boxpar.heightRight = sections[sectNumber].heightRightBox - boxes[i].posY;
			boxpar.height -= boxes[i].posY;
			boxpar.angleTop = angleTop;
			boxpar.topNotch = sections[sectNumber].topNotchBox;
		}


		boxpar = drawBox(boxpar);
		var box = boxpar.mesh;
		box.position.y = boxes[i].posY + carcasThk_wr;

		if(boxes[i].widthType == "по секции" && boxes[i].type != "перегородка"){
		    box.position.x = sections[sectNumber].pos - sections[sectNumber].width;
		}
		else {
			box.position.x = sections[sectNumber].pos - sections[sectNumber].width + boxes[i].posX;
		}
		
		dxfBasePoint = newPoint_xy(dxfBasePoint, 0, -Math.max(heightLeft, heightRight) - 500);
		boxpar.dxfBasePoint = dxfBasePoint;
		wrShelfs.add(box);
	}
}



	
//дверки секций
dxfBasePoint = newPoint_xy(dxfBasePoint, 0, -Math.max(heightLeft, heightRight) - 500);
function drawDoors(){}; //пустая функция для навигации

	var platepar={
		height: heightLeft,
		width: width/2,
		thk: carcasThk_wr,
		doorsThk: doorsThk_wr,
		angleTop: angleTop,
		dxfArr :dxfPrimitivesArr,
		dxfBasePoint: dxfBasePoint,
		text: "дверь секции",
		material: metalMaterial,
		shelfMaterial: timberMaterial2,  
		sideFactor: sideFactor,
		depth: depth, 
		addSideOffset: 0,
		sectionpar: null
	}
	
if(model == "классика"){
	var sideDoorOffset_cl = 2;
	var sideDoorOffset_op = 4;
	var midDoorOffset_cl = carcasThk_wr / 2 + 2;
	var midDoorOffset_op = carcasThk_wr / 2 + 4;
	
	for (var i=0; i<sectAmt; i++){
		if(sections[i].type != "открытая"){
			//фасад
			platepar.addSideOffset = 0;
			platepar.addSideOffset = carcasThk_wr - (i == sectAmt-1 ? sideDoorOffset_cl : midDoorOffset_cl);
			platepar.sectionpar = sections[i];
			platepar.heightLeft = sections[i].heightLeftDoor;
			platepar.heightRight = sections[i].heightRightDoor;
			if(heightLeft != heightRight){
			    platepar.heightLeft -= doorTopOffset + 2*doorGap;
			    platepar.heightRight -= doorTopOffset + 2*doorGap;
			}
			platepar.width = sections[i].width + carcasThk_wr;
			
	        if(i == 0 && i == sectAmt - 1) platepar.width = sections[i].width + 2*carcasThk_wr - 2*sideDoorOffset_cl;
			else if(i == 0 || i == sectAmt - 1) platepar.width = sections[i].width + 2*carcasThk_wr - sideDoorOffset_cl - midDoorOffset_cl;
			else platepar.width = sections[i].width + 2*carcasThk_wr - 2*midDoorOffset_cl;
			
			platepar.topNotch = sections[i].topNotchDoor;
			platepar.type = sections[i].type;
			platepar.doorGap = doorGap;
			if(sections[i].type == "выдвижная"){
			    platepar.boxWidth = sections[i].width;
			}
			
			platepar = drawDoor(platepar);
			var plate = platepar.mesh;

			if(i == 0) {
				plate.position.x = width - platepar.width - sideDoorOffset_cl;
			}
			else if(i == sectAmt-1) {
				plate.position.x = sideDoorOffset_cl;
			}
			else {
				plate.position.x = sections[i].pos - sections[i].width - midDoorOffset_cl + doorGap*2;
			}
			plate.position.z = depth;

			if(isDoorsOpened) {
				if(sections[i].type == "выдвижная"){ 
				    plate.position.z += depth/2;
				}
				else if(sections[i].type == "две двери"){
					plate.position.x = sections[i].pos;
					
				    plate.children[1].rotation.y = Math.PI / 2;
				    plate.children[1].position.z += platepar.width + doorGap;
					plate.children[1].position.x = 0;
					if(i == 0) plate.children[1].position.x -= sideDoorOffset_op;
					else plate.children[1].position.x -= midDoorOffset_op;

					plate.children[0].rotation.y = -Math.PI / 2;
					plate.children[0].position.z += doorGap;
					plate.children[0].position.x = -sections[i].width;
					if(i == sectAmt-1) plate.children[0].position.x += sideDoorOffset_op;
					else plate.children[0].position.x += midDoorOffset_op;
				}
				else{
				    if(par.sections[i].type == "вправо") {
				        plate.rotation.y = Math.PI / 2;
					    plate.position.z += platepar.width + doorGap;
					    plate.position.x = sections[i].pos;
						if(i == 0) plate.position.x -= sideDoorOffset_op;
						else plate.position.x -= midDoorOffset_op;
				    }
					else{
						plate.rotation.y = -Math.PI / 2;
						plate.position.z += doorGap;
					    plate.position.x = sections[i].pos-sections[i].width;
						if(i == sectAmt-1) plate.position.x += sideDoorOffset_op;
						else plate.position.x += midDoorOffset_op;
					}
				}
			}
			platepar.dxfBasePoint = newPoint_xy(platepar.dxfBasePoint, 0, -Math.max(heightLeft, heightRight) - 500);
			platepar.dxfBasePoint.x = 0;
			wrDoors.add(plate);
			//параметры для расчета цены
			wrParams.doors.amt += 1;
			wrParams.doors.area += platepar.area;
			wrParams.doors.perim += platepar.perim;
			wrParams.hingeAmt += platepar.hingeAmt;
			if(sections[i].type == "две двери"){
				wrParams.doors.amt += 1;
				wrParams.hingeAmt += platepar.hingeAmt;
				}
			//console.log(wrParams.doors.perim)
		}
	}
}

if(model == "купе"){
	var doorAmt = par.kupeDoorAmt_wr;
	console.log(doorAmt)
	var doorWidth = width / doorAmt;
	for (var i=0; i<doorAmt; i++){
		platepar.heightLeft = heightLeft - 2 * carcasThk_wr;
		//корректируем высоту панели если она попадает в наклонную часть
		if(doorWidth * (i+1) < (width - 2 * carcasThk_wr - topPlateLength2)) {
			platepar.heightLeft = heightRight - carcasThk_wr + doorWidth * Math.tan(angleTop) * (i+1);
			}
		
		platepar.heightRight = heightRight;
		if(prevDoorHeightLeft) platepar.heightRight = prevDoorHeightLeft;
		platepar.width = doorWidth
		platepar = drawDoor(platepar);
		var plate = platepar.mesh;
		plate.position.x = width - doorWidth * (i+1);
		plate.position.z = depth;
		if(i%2) plate.position.z += 30;
			platepar.dxfBasePoint = newPoint_xy(platepar.dxfBasePoint, 0, -Math.max(heightLeft, heightRight) - 500);
			platepar.dxfBasePoint.x = 0;
		wrDoors.add(plate);
		//параметры для расчета цены
		wrParams.doors.amt += 1;
		wrParams.doors.area += platepar.area;
		wrParams.doors.perim += platepar.perim;
		//console.log(wrParams.doors.perim)
			
		var prevDoorHeightLeft = platepar.heightLeft;
				
		}
	}


function drawCarcas(){};  //пустая функция для навигации
	
	dxfBasePoint = newPoint_xy(platepar.dxfBasePoint, 0, -Math.max(heightLeft, heightRight) - 500);
	//левая панель
	var platepar={
		height: heightLeft,
		width: depth,
		thk: carcasThk_wr,
		dxfArr :dxfPrimitivesArr,
		dxfBasePoint: dxfBasePoint,
		text: "левая панель",
		material: timberMaterial,
		roundHoles: []
		}
    if(topPlateLength1 > 0 && sideFactor == -1){
		platepar.height -= carcasThk_wr * Math.tan((Math.PI/2-angleTop)/2);
	}
	
	platepar = drawPlate(platepar);
	var plate = platepar.mesh;
	plate.rotation.y = - Math.PI /2;
	plate.position.x = carcasThk_wr;
	dxfBasePoint = newPoint_xy(dxfBasePoint, depth + 500, 0);
	
		carcas_wr.push(plate);
	
	//параметры для расчета цены
	wrParams.carcasPanels.amt += 1;
	wrParams.carcasPanels.area += platepar.area;
	wrParams.carcasPanels.perim += platepar.perim;
	

	//правая панель
	
	platepar.dxfBasePoint = dxfBasePoint;
	platepar.height = heightRight;
	if(topPlateLength1 > 0 && sideFactor == 1){
		platepar.height -= carcasThk_wr * Math.tan((Math.PI/2-angleTop)/2);
	}

	platepar.text = "правая панель";
	
	platepar = drawPlate(platepar);
	var plate = platepar.mesh;
	plate.rotation.y = - Math.PI /2;
	plate.position.x = width;
	dxfBasePoint = newPoint_xy(dxfBasePoint, depth + 500, 0);
	
		carcas_wr.push(plate);
	
	//параметры для расчета цены
	wrParams.carcasPanels.amt += 1;
	wrParams.carcasPanels.area += platepar.area;
	wrParams.carcasPanels.perim += platepar.perim;
	
	//нижняя панель
	
	platepar.dxfBasePoint = dxfBasePoint;
	platepar.height = width - 2 * carcasThk_wr;
	platepar.text = "нижняя панель";
	platepar.roundHoles = [];
	
	platepar = drawPlate(platepar);
	var plate = platepar.mesh;
	plate.rotation.x =  Math.PI /2;
	plate.rotation.z =  Math.PI /2;
	plate.position.x = width - carcasThk_wr;
	plate.position.y = carcasThk_wr;
	dxfBasePoint = newPoint_xy(dxfBasePoint, depth + 500, 0);
	
		carcas_wr.push(plate);
	
	//параметры для расчета цены
	wrParams.carcasPanels.amt += 1;
	wrParams.carcasPanels.area += platepar.area;
	wrParams.carcasPanels.perim += platepar.perim;

	
	//верхняя наклонная панель	
	
	if(topPlateLength1 > 0){
	    platepar.dxfBasePoint = dxfBasePoint;
	    platepar.height = topPlateLength1 - carcasThk_wr * Math.tan(angleTop/2) - carcasThk_wr * Math.tan((Math.PI/2-angleTop)/2);
	
	    platepar.text = "верхняя панель 1";
	
	    platepar = drawPlate(platepar);
	    var plate = platepar.mesh;
	    plate.rotation.x =  Math.PI /2;
	    plate.rotation.z =  Math.PI /2;
	    plate.rotation.y =  -angleTop * sideFactor;
	    plate.position.x = width - carcasThk_wr * Math.tan((Math.PI/2-angleTop)/2) * Math.cos(angleTop);
	    plate.position.y = heightRight + carcasThk_wr * Math.tan((Math.PI/2-angleTop)/2) * Math.sin(angleTop);
	    if(sideFactor == -1) {
		    plate.rotation.y = angleTop + Math.PI;
		    plate.position.x = carcasThk_wr * Math.sin(angleTop) + carcasThk_wr * Math.tan((Math.PI/2-angleTop)/2) * Math.cos(angleTop);
		    plate.position.y = heightLeft - carcasThk_wr * Math.cos(angleTop) + carcasThk_wr * Math.tan((Math.PI/2-angleTop)/2) * Math.sin(angleTop);
	    }
	    dxfBasePoint = newPoint_xy(dxfBasePoint, depth + 500, 0);
		
	   	carcas_wr.push(plate);
	
	//параметры для расчета цены
	wrParams.carcasPanels.amt += 1;
	wrParams.carcasPanels.area += platepar.area;
	wrParams.carcasPanels.perim += platepar.perim;
	}
	
	//верхняя горизонтальная панель
	if(topPlateLength2 > 0){
	    platepar.dxfBasePoint = dxfBasePoint;
		platepar.height = topPlateLength2 - carcasThk_wr * Math.tan(angleTop/2);
		if(heightLeft == heightRight) platepar.height -= carcasThk_wr - doorGap;
		platepar.text = "верхняя панель 2";
		
		platepar = drawPlate(platepar);
		var plate = platepar.mesh;
		plate.rotation.x =  Math.PI /2;
		plate.rotation.z =  Math.PI /2;
		plate.position.x = carcasThk_wr + topPlateLength2;
		plate.position.y = heightLeft;
		if(sideFactor == 1){
			plate.position.x -= carcasThk_wr * Math.tan(angleTop/2);
		}
		else if(sideFactor == -1) {
			plate.position.x = width - carcasThk_wr;
			plate.position.y = heightRight;
		}
		if(heightLeft == heightRight) plate.position.x -= carcasThk_wr - doorGap;
	    dxfBasePoint = newPoint_xy(dxfBasePoint, depth + 500, 0);
		
			carcas_wr.push(plate);
	
	//параметры для расчета цены
	wrParams.carcasPanels.amt += 1;
	wrParams.carcasPanels.area += platepar.area;
	wrParams.carcasPanels.perim += platepar.perim;
	}
		
	//задняя панель
	var platepar={
		height: heightLeft,
		width: width/2,
		thk: carcasThk_wr,
		doorsThk: 6,
		angleTop: angleTop,
		dxfArr :dxfPrimitivesArr,
		dxfBasePoint: dxfBasePoint,
		text: "задняя панель",
		material: timberMaterial2,
		shelfMaterial: timberMaterial2,  
		sideFactor: sideFactor,
		depth: depth, 
		addSideOffset: 0,
		}

		platepar.heightLeft = sections[sections.length - 1].heightLeftDoor;
		platepar.heightRight = sections[0].heightRightDoor;
		platepar.width = width;
		platepar.topNotch = topPlateLength2 + carcasThk_wr;
		platepar.type = "";
		platepar.doorGap = doorGap;
		
		platepar = drawDoor(platepar);
		
		var plate = platepar.mesh;
		plate.position.z -= platepar.doorsThk;
		
			carcas_wr.push(plate);
	
	//параметры для расчета цены
	wrParams.rearPanels.amt += 1;
	wrParams.rearPanels.area += platepar.area;
		
	//перегородки секций (слева направо)
    
    dxfBasePoint = {x: 0, y: -Math.max(heightLeft, heightRight) - 500};
	
	var platepar={
		height: 0,
		width: depth,
		thk: carcasThk_wr,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: dxfBasePoint,
		text: "перегородка секции",
		material: timberMaterial,
	}
	
	for(var i=1; i<sectAmt; i++ ){
		platepar.height = sections[i].heightPlate;
		platepar = drawPlate(platepar);
		var plate = platepar.mesh;
		plate.rotation.y = - Math.PI /2;
		plate.position.x = sections[i].pos + carcasThk_wr;
		plate.position.y = carcasThk_wr;
		dxfBasePoint = newPoint_xy(dxfBasePoint, depth + 500, 0);
		platepar.dxfBasePoint = dxfBasePoint;
		wrCarcas.add(plate);
			//параметры для расчета цены
			wrParams.carcasPanels.amt += 1;
			wrParams.carcasPanels.area += platepar.area;
			wrParams.carcasPanels.perim += platepar.perim;
	}
	
	
	if(heightLeft != heightRight){
		//верхняя накладка
	    var topOnlayPar = {
		    topOnlayWidth: topOnlayWidth,
		    dxfBasePoint: dxfBasePoint,
		    topPlateLength2: topPlateLength2,
		    dxfArr: dxfPrimitivesArr,
		    thk: carcasThk_wr,
			heightLeft: heightLeft,
			heightRight: heightRight,
		    material: metalMaterial
	    }
	
	    topOnlayPar = drawTopOnlay(topOnlayPar);
	    var topOnlay = topOnlayPar.mesh;
	    if(sideFactor == 1) {
		    topOnlay.rotation.x = Math.PI;
		    topOnlay.position.y = heightLeft + topOnlayPar.topOnlayWidth - doorTopOffset;
		    topOnlay.position.z = depth + carcasThk_wr;
	    }
	    else{
	        topOnlay.rotation.x = Math.PI;
	        topOnlay.rotation.y = Math.PI;
	        topOnlay.position.x = width;
	        topOnlay.position.y = heightRight + topOnlayPar.topOnlayWidth - doorTopOffset;
	        topOnlay.position.z = depth;
	    }
        wrDoors.add(topOnlay);
		
		//параметры для расчета цены
			wrParams.doors.amt += 1;
			wrParams.doors.area += topOnlayPar.area;
			wrParams.doors.perim += topOnlayPar.perim;

		
		//угловой добор
		if(params.sideOnlay_wr == "есть"){
			var sideOnlayPar = {
				topOnlayWidth: topOnlayWidth,
				angleTop: angleTop,
		        dxfArr: dxfPrimitivesArr,
		        dxfBasePoint: dxfBasePoint,
		        thk: carcasThk_wr,
				heightLeft: heightLeft,
				heightRight: heightRight,
		        material: metalMaterial
	        }
	
	        sideOnlayPar = drawSideOnlay(sideOnlayPar);
	        var sideOnlay = sideOnlayPar.mesh;
	        if(sideFactor == 1) {
	            sideOnlay.position.x = width;
				sideOnlay.position.z = depth;
	        }
	        else{
	            sideOnlay.rotation.y = Math.PI;
				sideOnlay.position.z = depth + carcasThk_wr;
		
	        }
            wrDoors.add(sideOnlay);
			
			//параметры для расчета цены
			wrParams.doors.amt += 1;
			wrParams.doors.area += sideOnlayPar.area;
			wrParams.doors.perim += sideOnlayPar.perim;
			////console.log(wrParams.doors.perim)
			
		}
	}

function drawLegs(){}; //пустая функция для навигации
	var legSideOffset = 20;
	var legsPar = {
		type: "round",
		size: 50,
		height: params.legsHeight_wr,
		material: metalMaterial,
		}
	
	var leftPosX = legsPar.size/2 + legSideOffset;
	var rightPosX = width - legsPar.size/2 - legSideOffset;
	var rearPosZ = legsPar.size/2 + legSideOffset;
	var frontPosZ = depth - legsPar.size/2 - legSideOffset;
	//левая задняя
	legsPar = drawWardrobeLeg(legsPar);
	var leg = legsPar.mesh;
	leg.position.x = leftPosX;
	leg.position.z = rearPosZ;
	wrCarcas.add(leg);

	//правая задняя
	legsPar = drawWardrobeLeg(legsPar);
	var leg = legsPar.mesh;
	leg.position.x = rightPosX;
	leg.position.z = rearPosZ;
	wrCarcas.add(leg);
	
	//левая передняя
	legsPar = drawWardrobeLeg(legsPar);
	var leg = legsPar.mesh;
	leg.position.x = leftPosX;
	leg.position.z = frontPosZ;
	wrCarcas.add(leg);
	
	//правая передняя
	legsPar = drawWardrobeLeg(legsPar);
	var leg = legsPar.mesh;
	leg.position.x = rightPosX;
	leg.position.z = frontPosZ;
	wrCarcas.add(leg);
	
	
	par.wrCarcas = wrCarcas;
	par.wrDoors = wrDoors;
	par.wrShelfs = wrShelfs;
	par.wrMetis = wrMetis;

	return par;

}//drawWardrobe;

function drawPlate(par){

	/*
	par={
		height
		width
		dxfArr
		dxfBasePoint
		text
		material
		}
	*/
console.log("ghgh") 
	var p0 = {x: 0, y: 0}
	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p1, 0, par.height)
	var p3 = newPoint_xy(p1, par.width, par.height)
	var p4 = newPoint_xy(p1, par.width, 0)

	var shape = new THREE.Shape();

	addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p4, p1, par.dxfBasePoint);
	
	//отверстия
	if(par.roundHoles){
		for(var i=0; i<par.roundHoles.length; i++){
			addRoundHole(shape, par.dxfArr, par.roundHoles[i].center, par.roundHoles[i].rad, par.dxfBasePoint)
		}
	}

	//подпись
	var textHeight = 30;
	var textBasePoint = newPoint_xy(par.dxfBasePoint, 20, -150);
	addText(par.text, textHeight,  par.dxfArr, textBasePoint);
	
	var treadExtrudeOptions = {
		amount: par.thk, 
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
		};
		
	var geom = new THREE.ExtrudeGeometry(shape, treadExtrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	par.mesh = new THREE.Mesh(geom, par.material);
	
	//площадь
	par.area = par.width * par.height / 1000000;
	//периметр
	par.perim = (par.width + par.height) * 2 / 1000;
	
	return par;
	

}//end of drawPlate

function drawBox(par){
	
	par.mesh = new THREE.Object3D();
	par.sideOffset = 10;
	par.doorOffset = 2;
	par.boxStep = 400;
//полка
if(par.type == "полка"){
	var platepar={
		height: par.width,
		width: par.depth,
		thk: par.thk,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		text: "полка",
		material: par.shelfMaterial,
	}
	
	platepar = drawPlate(platepar);
	var plate = platepar.mesh;
	plate.rotation.x =  Math.PI /2;
	plate.rotation.z =  Math.PI /2;
	plate.position.x = par.width;
	plate.position.y = par.thk;
	par.mesh.add(plate);
	
	//параметры для расчета цены
	
	wrParams.carcasPanels.amt += 1;
	wrParams.carcasPanels.area += platepar.area;
	wrParams.carcasPanels.perim += platepar.perim;
}
else if(par.type == "перегородка"){
		var platepar = {
		height: par.thk,
		width: par.depth,
		thk: par.height,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		text: "перегородка",
		material: par.shelfMaterial,
	}
	  
	platepar = drawPlate(platepar);
	var plate = platepar.mesh;
	plate.rotation.x =  Math.PI /2;
	plate.rotation.z =  Math.PI /2;
	plate.position.x = par.thk;
	plate.position.y = par.height;
	
	par.mesh.add(plate);  
	//параметры для расчета цены
	wrParams.carcasPanels.amt += 1;
	wrParams.carcasPanels.area += platepar.area;
	wrParams.carcasPanels.perim += platepar.perim;
}
else if(par.type == "штанга"){
	par.diam = 25;
	var plateGeometry = new THREE.CylinderGeometry(par.diam/2, par.diam/2, par.width, 20, 0, false);

	var plate = new THREE.Mesh(plateGeometry, par.shelfMaterial);

	plate.rotation.x =  Math.PI /2;
	plate.rotation.z =  Math.PI /2;
	plate.position.x = par.width/2;
	plate.position.y = par.diam/2;  
	plate.position.z = (par.depth + par.diam) / 2;
	
	par.mesh.add(plate);  
	//параметры для расчета цены
	wrParams.poles.amt += 1;
	wrParams.poles.len += par.width/1000;
}
else if(par.type.indexOf("шкаф") != -1){
	//нижняя панель
	var platepar={
		height: par.width,
		width: par.depth,
		thk: par.thk,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		text: "нижняя панель",
		material: par.shelfMaterial,
	}
	
	platepar = drawPlate(platepar);
	var plate = platepar.mesh;
	plate.rotation.x =  Math.PI /2;
	plate.rotation.z =  Math.PI /2;
	plate.position.x = par.width;
	plate.position.y = par.thk;
	par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, Math.max(platepar.height, platepar.width) + 100, 0);
	
	par.mesh.add(plate);
	//параметры для расчета цены
	wrParams.carcasPanels.amt += 1;
	wrParams.carcasPanels.area += platepar.area;
	wrParams.carcasPanels.perim += platepar.perim;
	
	//верхняя панель
	var platepar={
		height: par.width,
		width: par.depth,
		thk: par.thk,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		text: "верхняя панель",
		material: par.shelfMaterial,
	}
	
	platepar = drawPlate(platepar);
	var plate = platepar.mesh;
	plate.rotation.x =  Math.PI /2;
	plate.rotation.z =  Math.PI /2;
	plate.position.x = par.width;
	plate.position.y = par.height;
	par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, Math.max(platepar.height, platepar.width) + 100, 0);
	
	par.mesh.add(plate);
	
	//параметры для расчета цены
	wrParams.carcasPanels.amt += 1;
	wrParams.carcasPanels.area += platepar.area;
	wrParams.carcasPanels.perim += platepar.perim;
	
	//кол-во петель
	par.hingeAmt = getHingePerDoorAmt(Math.max(par.heightRight, par.heightLeft));
	wrParams.hingeAmt += platepar.hingeAmt;
	if(platepar.type == "две двери") {
		wrParams.hingeAmt += platepar.hingeAmt;
		}

		
}
else if(par.type == "ящик" || par.type == "ящик верхний"){
	//левая панель
	var platepar={
		height: par.height / 2,
		width: par.depth - par.doorsThk - par.thk,
		thk: par.thk,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		text: "левая панель ящика",
		material: par.shelfMaterial,
		}
	
	if(par.type == "ящик верхний" && par.heightRight && par.heightLeft){
		platepar.height = Math.min(par.heightRight, par.heightLeft);
		if(par.sideFactor == 1)platepar.height = Math.max(par.heightRight, par.heightLeft);
	}
	
	platepar = drawPlate(platepar);
	var plate = platepar.mesh;
	plate.rotation.y = -Math.PI /2;
	plate.position.x = par.thk + par.sideOffset;
	plate.position.z = par.thk;
	par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, Math.max(platepar.height, platepar.width) + 100, 0);
	
	par.mesh.add(plate);
	
	//параметры для расчета цены
	wrParams.carcasPanels.amt += 1;
	wrParams.carcasPanels.area += platepar.area;
	wrParams.carcasPanels.perim += platepar.perim;
	
	if(par.isDoorsOpened) {
		plate.position.z += par.depth / 2;
	}
	
	//правая панель
	var platepar={
		height: par.height / 2,
		width: par.depth - par.doorsThk - par.thk,
		thk: par.thk,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		text: "правая панель ящика",
		material: par.shelfMaterial,
		}
	
	if(par.type == "ящик верхний" && par.heightRight && par.heightLeft){
		platepar.height = Math.max(par.heightRight, par.heightLeft);
		if(par.sideFactor == 1)platepar.height = Math.min(par.heightRight, par.heightLeft);
	}
	
	platepar = drawPlate(platepar);
	var plate = platepar.mesh;
	plate.rotation.y = - Math.PI /2;
	plate.position.x = par.width - par.sideOffset;
	plate.position.z = par.thk;
	par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, Math.max(platepar.height, platepar.width) + 100, 0);
	
	par.mesh.add(plate);
	
	//параметры для расчета цены
	wrParams.carcasPanels.amt += 1;
	wrParams.carcasPanels.area += platepar.area;
	wrParams.carcasPanels.perim += platepar.perim;
	
	wrParams.boxSlidersAmt += 1;
	if(par.isDoorsOpened) {
		plate.position.z += par.depth / 2;
	}
		
	//нижняя панель ящика
	var platepar={
		height: par.width - 2*par.thk - 2*par.sideOffset,
		width: par.depth - par.doorsThk - par.thk,
		thk: par.thk,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		text: "нижняя панель ящика",
		material: par.shelfMaterial,
		}

	platepar = drawPlate(platepar);
	var plate = platepar.mesh;
	plate.rotation.x =  Math.PI /2;
	plate.rotation.z =  Math.PI /2;
	plate.position.x =  platepar.height + par.thk + par.sideOffset;
	plate.position.y =  par.thk;
	plate.position.z = par.thk;
	par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, Math.max(platepar.height, platepar.width) + 100, 0);
	
	par.mesh.add(plate);
	
	//параметры для расчета цены
	wrParams.rearPanels.amt += 1;
	wrParams.rearPanels.area += platepar.area;
	
	if(par.isDoorsOpened) {
		plate.position.z += par.depth / 2;
	}
	
	//задняя панель
	var platepar={
		height: par.height / 2 - par.thk,
		width: par.width - 2*par.sideOffset,
		thk: par.thk,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		text: "задняя панель",
		material: par.shelfMaterial,
	}
	if(par.type == "ящик верхний" && par.heightRight && par.heightLeft){
		platepar.height = Math.min(par.heightRight, par.heightLeft);
	}
 
	platepar = drawPlate(platepar);
	var plate = platepar.mesh;
	plate.position.x = par.sideOffset;
	par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, Math.max(platepar.height, platepar.width) + 100, 0);

	par.mesh.add(plate);
	
	//параметры для расчета цены
	wrParams.carcasPanels.amt += 1;
	wrParams.carcasPanels.area += platepar.area;
	wrParams.carcasPanels.perim += platepar.perim;
	
	if(par.isDoorsOpened) {
		plate.position.z += par.depth / 2;
	}
	
	//передняя панель
	if(!par.type == "ящик верхний" || !par.heightRight || !par.heightLeft){
	    var platepar={
		    height: par.height - par.doorOffset,
		    width: par.width - par.doorOffset * 2,
		    thk: par.doorsThk,
		    dxfArr: par.dxfArr,
		    dxfBasePoint: par.dxfBasePoint,
		    text: "передняя панель",
		    material: par.doorMaterial,
		}

	    platepar = drawPlate(platepar);
	    var plate = platepar.mesh; 
	    plate.position.x =  par.doorOffset;
	    plate.position.z =  par.depth - par.doorsThk;
	    plate.position.y =  par.doorOffset;
	    par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, Math.max(platepar.height, platepar.width) + 100, 0);
	
	    par.mesh.add(plate);
		
		//параметры для расчета цены
		wrParams.doors.amt += 1;
		wrParams.doors.area += platepar.area;
		wrParams.doors.perim += platepar.perim;
		//console.log(wrParams.doors.perim)
	}
	else { 
		var p0 = {x: 0, y: 0};
		var p1 = copyPoint(p0); 
		var p2 = newPoint_xy(p1, 0, par.heightLeft - 2*par.doorOffset);
		if(par.topNotch != 0 && par.sideFactor == 1){
			var p3 = newPoint_xy(p2, par.topNotch - par.doorOffset, 0);
		} 
		else if(par.topNotch != 0 && par.sideFactor == -1){
			var p3 = newPoint_xy(p1, par.width - par.doorOffset * 2 - (par.topNotch - par.doorOffset), par.heightRight - 2*par.doorOffset);
		}
		var p4 = newPoint_xy(p1, par.width - par.doorOffset * 2, par.heightRight - 2*par.doorOffset);

		var p5 = newPoint_xy(p1, par.width - par.doorOffset * 2, 0);
		   
 
		var shape = new THREE.Shape();
  
		addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
		if(p3){
		    addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
		    addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint);
		}
		else{
		    addLine(shape, par.dxfArr, p2, p4, par.dxfBasePoint);
	    }
		addLine(shape, par.dxfArr, p4, p5, par.dxfBasePoint);		
		addLine(shape, par.dxfArr, p5, p1, par.dxfBasePoint);
		  
		var treadExtrudeOptions = { 
			amount: par.doorsThk, 
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};
			
		var geom = new THREE.ExtrudeGeometry(shape, treadExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var plate = new THREE.Mesh(geom, par.doorMaterial);
		
	    plate.position.x =  par.doorOffset;
	    plate.position.z =  par.depth - par.doorsThk;
	    plate.position.y =  par.doorOffset;
		//подпись
     	var textHeight = 30;
	    var textBasePoint = newPoint_xy(par.dxfBasePoint, 20, -150);
    	addText("передняя панель", textHeight,  par.dxfArr, textBasePoint);
	    par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, Math.max(platepar.height, platepar.width) + 100, 0);
		
	    par.mesh.add(plate);
		
		//параметры для расчета цены
		wrParams.doors.amt += 1;
		wrParams.doors.area += platepar.area;
		wrParams.doors.perim += platepar.perim;
		//console.log(wrParams.doors.perim)
	}
	
	if(par.isDoorsOpened) {
		plate.position.z += par.depth / 2;
	}

	//ручка
	var platepar={
		height: 20,
		width: 100,
		thk: 20,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		text: "ручка",
		material: par.doorMaterial,
		}
	
	platepar = drawPlate(platepar);
	var plate = platepar.mesh;
	plate.position.x =  (par.width - platepar.width)/2;
	plate.position.z =  par.depth;
	if(!par.type == "ящик верхний" || !par.heightRight || !par.heightLeft){
	    plate.position.y =  par.height -100 ;
	}
	else{
		plate.position.y =  Math.min(par.heightRight, par.heightLeft) - 100;
	}
	par.mesh.add(plate);
		
	if(par.isDoorsOpened) {
		plate.position.z += par.depth / 2;
	}
	}

	return par;
}

function drawDoor(par){	
	
	//параметры петель
	var hingePar = {
		type: par.hingeType,
		whDiam: 5,
		whDist: 32,
		whOffset: 37,
		dhDiam: 35,
		dhDiam2: 5,
		dhOffset: 21.5,
		dhOffset2: 9.5,
		dhDist: 45,
		offsetCl: 7.5,
		doorGap: 2,
		sideDoorOffset_cl: 2,
		sideDoorOffset_op: 4,
		midDoorOffset_cl: params.carcasThk_wr / 2 + 2,
		midDoorOffset_op: params.carcasThk_wr / 2 + 4,
		dxfArr: [],
		dxfBasePoint: {x:0, y:0},
		material: par.material,
	};

	par.mesh = new THREE.Object3D();
	
	par.boxStep = 400;

		var p0 = {x: 0, y: 0}
		var p1 = copyPoint(p0);
		var p2 = newPoint_xy(p1, 0, parseFloat(par.heightLeft));
		if(par.topNotch != 0 && par.sideFactor == 1){
		    var p3 = newPoint_xy(p2, par.topNotch, 0);
		}
		else if(par.topNotch != 0 && par.sideFactor == -1){
		    var p3 = newPoint_xy(p1, par.width - par.topNotch, parseFloat(par.heightRight));
		}
		var p4 = newPoint_xy(p1, par.width, parseFloat(par.heightRight));
		var p5 = newPoint_xy(p1, par.width, 0);
		
		
		if(par.type == "две двери"){
			//первая часть   
			var shape = new THREE.Shape();
			
			if(!p3 || (p5.x-2*par.doorGap)/2 < p3.x){
			    var p6 = itercection({x: (p5.x-2*par.doorGap)/2, y:0}, newPoint_xy({x: (p5.x-2*par.doorGap)/2, y:0}, 0, 100), p2, p3?p3:p4);
			}
			else {
				var p7 = itercection({x: (p5.x-2*par.doorGap)/2, y:0}, newPoint_xy({x: (p5.x-2*par.doorGap)/2, y:0}, 0, 100), p3, p4);
			}
			var p8 = itercection(p6 ? p6 : p7, newPoint_xy(p6 ? p6 : p7, 0, 100), p1, p5);
			
			var shape = new THREE.Shape();

		    addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
		    if(p3){
				if(p6){
	    	        addLine(shape, par.dxfArr, p2, p6, par.dxfBasePoint);
	    	        addLine(shape, par.dxfArr, p6, p8, par.dxfBasePoint);
				}
				else if(p7){
					addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
					addLine(shape, par.dxfArr, p3, p7, par.dxfBasePoint);
	    	        addLine(shape, par.dxfArr, p7, p8, par.dxfBasePoint);
				}
		    }
		    else{
		        addLine(shape, par.dxfArr, p2, p6 ? p6 : p7, par.dxfBasePoint);
				addLine(shape, par.dxfArr, p6 ? p6 : p7, p8, par.dxfBasePoint);
		    }
		    addLine(shape, par.dxfArr, p8, p1, par.dxfBasePoint);
			
			//вторая часть
			var shape2 = new THREE.Shape();

			if(!p3 || (p5.x-2*par.doorGap)/2+2*par.doorGap < p3.x){
			    var p6 = itercection({x: (p5.x-2*par.doorGap)/2+2*par.doorGap, y:0}, newPoint_xy({x: (p5.x-2*par.doorGap)/2+2*par.doorGap, y:0}, 0, 100), p2, p3?p3:p4);
			}
			else {
				var p7 = itercection({x: (p5.x-2*par.doorGap)/2+2*par.doorGap, y:0}, newPoint_xy({x: (p5.x-2*par.doorGap)/2+2*par.doorGap, y:0}, 0, 100), p3, p4);
			}
			var p8 = itercection(p6 ? p6 : p7, newPoint_xy(p6 ? p6 : p7, 0, 100), p1, p5);
			
			
			if(p6){
				if(p3){
		            addLine(shape2, par.dxfArr, p6, p3, par.dxfBasePoint);
				    addLine(shape2, par.dxfArr, p3, p4, par.dxfBasePoint);
				}  
				else{
		            addLine(shape2, par.dxfArr, p6, p4, par.dxfBasePoint);
				}
			}
			else if(p7){
				addLine(shape2, par.dxfArr, p7, p4, par.dxfBasePoint);
			}
			
		    addLine(shape2, par.dxfArr, p4, p5, par.dxfBasePoint);
		    addLine(shape2, par.dxfArr, p5, p8, par.dxfBasePoint);
		    addLine(shape2, par.dxfArr, p8, p6 ? p6 : p7, par.dxfBasePoint);
		}
		else{
		    var shape = new THREE.Shape();

		    addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
		    if(p3){
	    	    addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
	    	    addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint);	
		    }
		    else{
		        addLine(shape, par.dxfArr, p2, p4, par.dxfBasePoint);	
		    }
		    addLine(shape, par.dxfArr, p4, p5, par.dxfBasePoint);		
		    addLine(shape, par.dxfArr, p5, p1, par.dxfBasePoint);
		    			
			if(par.type == "выдвижная"){ 
			    //подпись
		        var textHeight = 30;
		        var textBasePoint = newPoint_xy(par.dxfBasePoint, 20, -150);
		        addText(par.text, textHeight,  par.dxfArr, textBasePoint);
	            par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, par.width + 100, 0);
				
				//полки для шкафа
				var sideOffset = 10;
		        var count =  Math.floor((Math.min(par.heightRight, par.heightLeft) - 2*par.thk) / par.boxStep);

		        for(var i = 0; i < count; ++i){
		            var platepar={    
		                height: par.boxWidth - par.thk - 2*sideOffset,
		                width: par.depth - par.thk,
		                thk: par.thk,
		                dxfArr: dxfPrimitivesArr,
		                dxfBasePoint: par.dxfBasePoint,
		                text: "полка",
		                material: par.shelfMaterial,
		            }
	 
		            platepar = drawPlate(platepar);
		            var plate = platepar.mesh;
		            plate.position.x = par.boxWidth + par.addSideOffset - sideOffset;
					if(par.sideFactor == -1) plate.position.x -= par.thk; 
		            plate.position.z = par.thk-par.depth;
		            plate.rotation.x = Math.PI /2;
		            plate.rotation.z = Math.PI /2;
	                plate.position.y = par.boxStep * (i + 1) + 2*par.thk;
		            par.mesh.add(plate);
	                par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, Math.max(platepar.height, platepar.width) + 100, 0);
		        }
				
				//задняя панель
		        var platepar={
		            height: Math.min(par.heightRight, par.heightLeft) - 2*par.thk,
		            width: par.boxWidth - 2*sideOffset,
		            thk: par.thk,
		            dxfArr: dxfPrimitivesArr,
		            dxfBasePoint: par.dxfBasePoint,
		            text: "задняя панель",
		            material: par.shelfMaterial,
		        }  

		        platepar = drawPlate(platepar); 
		        var plate = platepar.mesh;
		        plate.position.x = par.addSideOffset + sideOffset;
				plate.position.y = par.thk;
		        plate.position.z = -par.depth;
		        par.mesh.add(plate); 
	            par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, Math.max(platepar.height, platepar.width) + 100, 0);
				
				//нижняя панель ящика
		        var platepar={    
		            height: par.boxWidth - par.thk - 2*sideOffset,
		            width: par.depth - par.thk,
		            thk: par.thk,
		            dxfArr: dxfPrimitivesArr,
		            dxfBasePoint: par.dxfBasePoint,
		            text: "нижняя панель ящика",
		            material: par.shelfMaterial,
		        }
	
		        platepar = drawPlate(platepar);
		        var plate = platepar.mesh;
		        plate.position.x = par.boxWidth + par.addSideOffset - sideOffset;
				if(par.sideFactor == -1) plate.position.x -= par.thk; 
		        plate.position.z = par.thk-par.depth;
		        plate.rotation.x = Math.PI /2;
		        plate.rotation.z = Math.PI /2;
		        plate.position.y = 2*par.thk;
		        par.mesh.add(plate);
	            par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, Math.max(platepar.height, platepar.width) + 100, 0);
				
				//боковая панель
		        var platepar={
		            height: par.height / 2,
		            width: par.depth - par.thk,
		            thk: par.thk,
		            dxfArr: dxfPrimitivesArr,
		            dxfBasePoint: par.dxfBasePoint,
		            text: "боковая панель ящика",
		            material: par.shelfMaterial,
		        }
	
		        platepar.height = Math.max(par.heightRight, par.heightLeft)-2*par.thk;
				if(par.sideFactor == -1) platepar.height -= par.thk * Math.tan(par.angleTop);
	
		        platepar = drawPlate(platepar);
		        var plate = platepar.mesh;
		        plate.rotation.y = - Math.PI /2;   
				plate.position.x = par.addSideOffset + sideOffset + par.thk;
				if(par.sideFactor == -1) plate.position.x = par.boxWidth + par.addSideOffset - sideOffset;
		        plate.position.z = par.thk-par.depth;
		        plate.position.y = par.thk;
		        par.mesh.add(plate);   
		    }
		}
		
		if(par.type != "выдвижная"){ 
		    //подпись
		    var textHeight = 30;
		    var textBasePoint = newPoint_xy(par.dxfBasePoint, 20, -150);
		    addText(par.text, textHeight,  par.dxfArr, textBasePoint);
		}
		

		var treadExtrudeOptions = {
			amount: par.doorsThk, 
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
			};
			
		if(par.type == "две двери"){
			var geom = new THREE.ExtrudeGeometry(shape, treadExtrudeOptions);
	    	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	    	var plate = new THREE.Mesh(geom, par.material);
	        par.mesh.add(plate);
				
			var geom = new THREE.ExtrudeGeometry(shape2, treadExtrudeOptions);
	    	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	        var plate2 = new THREE.Mesh(geom, par.material);
	    	par.mesh.add(plate2);
		}
		else{
	    	var geom = new THREE.ExtrudeGeometry(shape, treadExtrudeOptions);
	    	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	    	var plate = new THREE.Mesh(geom, par.material);
	    	par.mesh.add(plate);
		}

	//площадь
	par.area = par.width * Math.max(par.heightRight, par.heightLeft) / 1000000; 
	//кол-во петель
	par.hingeAmt = getHingePerDoorAmt(Math.max(par.heightRight, par.heightLeft));
	//периметр
	par.perim = (par.width + Math.max(par.heightRight, par.heightLeft)) * 2 / 1000;
	
	

    return par;

}//end of drawDoor

function drawTopOnlay(par){
	
	var p0 = {x:0,y:0};
	var p1 = newPoint_xy(p0, 0, par.topOnlayWidth);
	var p2 = newPoint_xy(p1, par.topPlateLength2 + params.carcasThk_wr, 0);
	var p3 = newPoint_xy(p2, params.width_wr - (par.topPlateLength2 + params.carcasThk_wr), Math.abs(par.heightLeft - par.heightRight));
	var p4 = newPoint_xy(p3, 0, -par.topOnlayWidth);
	var p5 = newPoint_xy(p0, par.topPlateLength2 + params.carcasThk_wr, 0);

	var shape = new THREE.Shape();
	
	addLine(shape, par.dxfArr, p0, p1, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p4, p5, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p5, p0, par.dxfBasePoint);
	
	//подпись
	var textHeight = 30;
	var textBasePoint = newPoint_xy(par.dxfBasePoint, 20, -150);
	addText(par.text, textHeight,  par.dxfArr, textBasePoint);
	
	var treadExtrudeOptions = {
		amount: par.thk, 
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
		
	var geom = new THREE.ExtrudeGeometry(shape, treadExtrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	par.mesh = new THREE.Mesh(geom, par.material);
	
	//площадь
	par.area = par.topOnlayWidth * params.width_wr * 1.5 / 1000000; //к-т 1,5 учитывает отходы
	//периметр
	par.perim = (par.topOnlayWidth + params.width_wr) * 2 / 1000;

	return par;
}

function drawSideOnlay(par){
	var p0 = {x:0,y:0};
	var p1 = newPoint_xy(p0, 0, Math.min(par.heightLeft, par.heightRight) + par.topOnlayWidth/2);
	var p2 = newPoint_xy(p0, (Math.min(par.heightLeft, par.heightRight) + par.topOnlayWidth/2)/Math.tan(par.angleTop), 0);

	var shape = new THREE.Shape();
	
	addLine(shape, par.dxfArr, p0, p1, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p2, p0, par.dxfBasePoint);
	
	//подпись
	var textHeight = 30;
	var textBasePoint = newPoint_xy(par.dxfBasePoint, 20, -150);
	addText(par.text, textHeight,  par.dxfArr, textBasePoint);
	
	var treadExtrudeOptions = {
		amount: par.thk, 
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
		
	var geom = new THREE.ExtrudeGeometry(shape, treadExtrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	par.mesh = new THREE.Mesh(geom, par.material);
	
	//площадь
	par.area = p1.y * p2.x / 1000000;
	//периметр
	par.perim = (p1.y + p2.x) * 2 / 1000;
	
	
	return par;
}

function drawHinge(par){
	
	/*функция отрисовывает четырехшарнирную мебельную петлю.
	Обозначение размеров здесь http://6692035.ru/drawings/furniture/hingeDim.pdf
	*/
	
	var hinge = new THREE.Object3D();	
	
	//параметры взаимного расположения опоры и чашки
	var plateThk = 2; //толщина пластин
	//расстояние от центра чашки до плоскости стенки в закрытом состоянии
	var offsetCl = par.dhOffset + par.sideDoorOffset_cl - params.carcasThk_wr; 
	//расстояние от плоскости дверки до плоскости стенки в открытом состоянии
	var offsetOp = par.sideDoorOffset_op; 
	if(par.type == "middle"){
		offsetCl = par.dhOffset + par.midDoorOffset_cl - params.carcasThk_wr; 
		offsetOp = par.midDoorOffset_op;
		}
	
	//пластина крепления к стенке
	var p0 = {x: 0, y: 0}
	var p1 = newPoint_xy(p0, 0, -10)
	var p2 = newPoint_xy(p0, 0, 10)
	var p3 = newPoint_xy(p2, 13.5, 0)
	var p4 = newPoint_xy(p3, 0, 15)
	var p5 = newPoint_xy(p4, 15, 0)
	var p6 = newPoint_xy(p5, 0, -15)
	var p7 = newPoint_xy(p6, 13.5, 0)	
	var p8 = newPoint_xy(p7, 0, -20)
	var p9 = newPoint_xy(p8, -13.5, 0)
	var p10 = newPoint_xy(p9, 0, -15)
	var p11 = newPoint_xy(p10, -15, 0)
	var p12 = newPoint_xy(p11, 0, 15)
	var p13 = newPoint_xy(p12, -13.5, 0)

	var shape = new THREE.Shape();

	addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p4, p5, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p5, p6, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p6, p7, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p7, p8, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p8, p9, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p9, p10, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p10, p11, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p11, p12, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p12, p1, par.dxfBasePoint);
	
	//отверстия пластины крепления к стенке
	var center = {x: 21, y:16}
	addRoundHole(shape, par.dxfArr, center, par.whDiam/2, par.dxfBasePoint)
	var center = {x: 21, y:-16}
	addRoundHole(shape, par.dxfArr, center, par.whDiam/2, par.dxfBasePoint)

	var treadExtrudeOptions = {
		amount: plateThk, 
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
		};
		
	var geom = new THREE.ExtrudeGeometry(shape, treadExtrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, par.material);
	
	mesh.position.x = plateThk;
	mesh.position.z = -21 - par.whOffset;
	mesh.rotation.y = -Math.PI/2
	hinge.add(mesh);
	
	//пластина чашки
	
	var plateLength = 60;
	var plateWidth = 20;
	var p0 = {x: 0, y: 0}
	var p1 = newPoint_xy(p0, -plateLength/2, par.dhOffset2 - plateWidth/2)
	var p2 = newPoint_xy(p1, 0, plateWidth)
	var p3 = newPoint_xy(p2, plateLength, 0)
	var p4 = newPoint_xy(p3, 0, -plateWidth)
	
	var shape = new THREE.Shape();

	addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p4, p1, par.dxfBasePoint);
		
	//отверстия пластины чашки
	var center = newPoint_xy(p0, -par.dhDist/2, par.dhOffset2)
	addRoundHole(shape, par.dxfArr, center, par.dhDiam2/2, par.dxfBasePoint)
	var center = newPoint_xy(p0, par.dhDist/2, par.dhOffset2)
	addRoundHole(shape, par.dxfArr, center, par.whDiam/2, par.dxfBasePoint)

	var treadExtrudeOptions = {
		amount: plateThk, 
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
		};
		
	var geom = new THREE.ExtrudeGeometry(shape, treadExtrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, par.material);
	mesh.rotation.z = -Math.PI/2
	mesh.position.x = offsetCl;
	mesh.position.z = -plateThk;
	
	if(isDoorsOpened){
		mesh.rotation.y = -Math.PI/2;
		mesh.position.z = par.doorGap + par.dhOffset;
		mesh.position.x = plateThk + offsetOp;
		}
	hinge.add(mesh);
	
	//чашка
	var height = 11;
	var geometry = new THREE.CylinderGeometry(par.dhDiam/2, par.dhDiam/2, height, 20, 0, false);
	var cyl = new THREE.Mesh(geometry, par.material);
	cyl.rotation.x = Math.PI/2;
	cyl.position.z = height/2
	cyl.position.x = offsetCl;
	
	if(isDoorsOpened){
		cyl.rotation.z = -Math.PI/2;
		cyl.position.x = -height/2 + offsetOp;
		cyl.position.z = par.doorGap + par.dhOffset;
		}
	hinge.add(cyl);
	
	//хвост петли
	var tailLength = 60;
	if(isDoorsOpened) tailLength = 70;
	var p0 = {x: 0, y: 0}
	var p1 = newPoint_xy(p0, 5, 0)
	var p2 = newPoint_xy(p1, offsetOp + 5 - plateThk, -45)
	var p3 = newPoint_xy(p2, 0, -(tailLength - 45))
	var p4 = newPoint_xy(p3, -10, 0)
	var p5 = newPoint_xy(p4, 0, (tailLength - 45))
	var p6 = newPoint_xy(p5, -offsetOp + plateThk, 10)	

	var shape = new THREE.Shape();

	addLine(shape, par.dxfArr, p0, p1, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p4, p5, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p5, p6, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p6, p0, par.dxfBasePoint);

	
	var treadExtrudeOptions = {
		amount: 12, 
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
		};
		
	var geom = new THREE.ExtrudeGeometry(shape, treadExtrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, par.material);
	mesh.rotation.x = -Math.PI/2
	mesh.position.x = plateThk;
	mesh.position.y = -6;
	mesh.position.z = -55;
	hinge.add(mesh);

	
	par.mesh = hinge;

	
	return par;
		


}//end of drawHinge

function getHingePerDoorAmt(height){
	var hingeAmt = 2;
	if(height > 900) hingeAmt = 3;
	if(height > 1600) hingeAmt = 4;
	if(height > 2000) hingeAmt = 5;

	return hingeAmt;
}

function drawWardrobeLeg(par){
	par.mesh = new THREE.Object3D();
	var segmentsX = 20;
	var segmentsY = 1;
	var openEnded = false;
	var geom = new THREE.CylinderGeometry(par.size/2, par.size/2, par.height, segmentsX, segmentsY, openEnded);
	var pole = new THREE.Mesh(geom, par.material);
	pole.position.y = - par.height/2;
	par.mesh.add(pole);
return par;
}
