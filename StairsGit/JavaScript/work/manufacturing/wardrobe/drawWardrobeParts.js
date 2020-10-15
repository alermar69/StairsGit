/** функция отрисовывает шкаф
*/

function drawWardrobe(par) {

	var wrCarcas1 = new THREE.Object3D();
	var wrCarcas2 = new THREE.Object3D();
	var wrCarcas = new THREE.Object3D();
	var wrDoors = new THREE.Object3D();
	var wrShelfs = new THREE.Object3D();
	var wrMetis = new THREE.Object3D();
 
	/*параметры*/
	var sectAmt = par.sectAmt_wr;
	var model = par.model_wr;
	var width = par.width_wr;
	var heightLeft = par.heightLeft_wr;
	var heightRight = par.heightRight_wr;
	var angleTop = par.angleTop_wr / 180 * Math.PI;
	var depth = par.depth_wr;
	var dxfBasePoint = par.dxfBasePoint;
	var topOnlay = par.topOnlay_wr;
	var doorGap = 2;
	
	params.carcasThk_wr = 16;
	
//	console.log(topOnlay)
	//параметры верха шкафа
	//схема размеров здесь 6692035.ru/drawings/furniture/topDim.pdf
	var topParams = {
		beamWidth: 100, //ширина несущей балки
		doorOnlay: 25, //наложение двери на несущую балку (номинальное положение)
		topOffset: 20, //расстояние от потолка шкафа до края верхней несущей балки
		onlayWidth: 100, //ширина накладки
		doorGap: 25, //зазор между накладкой и верхом двери (номинальное положение)
	}
  
	var carcasThk_wr = par.carcasThk_wr;
	var doorsThk_wr = par.doorsThk_wr;
	var sideFactor = 1;
	if(heightRight > heightLeft) sideFactor = -1;
			
	if(heightLeft != heightRight){
        if(sideFactor == -1){
		    heightLeft -= topParams.topOffset/Math.cos(angleTop)+carcasThk_wr*Math.tan(angleTop);
		    heightRight -= topParams.topOffset;
	    }
	    else if(sideFactor == 1){
		    heightRight -= topParams.topOffset/Math.cos(angleTop)+carcasThk_wr*Math.tan(angleTop);
		    heightLeft -= topParams.topOffset;
	    }
	}
	var horModHeight = (Math.max(heightLeft, heightRight) - carcasThk_wr * 2) / par.maxRowAmt_wr;
	
	//параметры верхней накладки, несущей балки
	var topOnlayWidth = 100; //толщина накладки
	var beamWidth = topOnlayWidth - 10; //толщина несущей балки
	var doorTopOffset = topParams.beamWidth - topParams.topOffset - topParams.doorOnlay; //уменьшение дверей под накладку
	if(heightLeft == heightRight) doorTopOffset = 0;
	var beamSlotsDepth = 5; //глубина пазов несущей балки
	
	var deltaHeight = Math.abs(heightRight - heightLeft);
	var topPlateLength1 = deltaHeight / Math.sin(angleTop);
	var maxTopLength = (width - 2*carcasThk_wr) / Math.cos(angleTop);
	if(topPlateLength1 > maxTopLength) topPlateLength1 = maxTopLength;
	var topPlateLength2 = width - carcasThk_wr - deltaHeight / Math.tan(angleTop);
    topPlateLength1 = topPlateLength1 > 0 ? topPlateLength1 : 0;
	topPlateLength2 = topPlateLength2 > carcasThk_wr * Math.tan(angleTop/2) ? topPlateLength2 : 0; 

	//авторасчет большей стороны шкафа в случае отсутствия верхней горизонтальной панели
	if(topPlateLength2 == 0){
		heightLeft = par.heightLeft_wr;
		heightRight = par.heightRight_wr;
		
        if(sideFactor == -1){
		    heightRight = heightLeft + (width - 2*carcasThk_wr - topParams.topOffset*Math.tan(angleTop/2)) * Math.tan(angleTop);
	    }
	    else if(sideFactor == 1){
		    heightLeft = heightRight + (width - 2*carcasThk_wr - topParams.topOffset*Math.tan(angleTop/2)) * Math.tan(angleTop);
	    }

        if(sideFactor == -1){
		    heightLeft -= topParams.topOffset/Math.cos(angleTop)+carcasThk_wr*Math.tan(angleTop);
		    heightRight -= topParams.topOffset;
	    }
	    else if(sideFactor == 1){
		    heightRight -= topParams.topOffset/Math.cos(angleTop)+carcasThk_wr*Math.tan(angleTop);
		    heightLeft -= topParams.topOffset;
	    }

		deltaHeight = Math.abs(heightRight - heightLeft);
		topPlateLength1 = deltaHeight / Math.sin(angleTop);
		horModHeight = (Math.max(heightLeft, heightRight) - carcasThk_wr * 2) / par.maxRowAmt_wr;
		/*
		if(heightLeft != par.heightLeft_wr) alert("ВНИМАНИЕ! Высота шкафа слева больше максимально возможной высоты, рассчитанной исходя из правой высоты и угла наклона верха. Установлено значение высоты слева " + heightLeft);
		
		if(heightRight != par.heightRight_wr) alert("ВНИМАНИЕ! Высота шкафа слева больше максимально возможной высоты, рассчитанной исходя из правой высоты и угла наклона верха. Установлено значение высоты слева " + heightRight);
		*/
	}   
	
	//параметры петель
	var sideDoorOffset_cl = 2;
	var sideDoorOffset_op = 4;
	var midDoorOffset_cl = carcasThk_wr / 2 + 2;
	var midDoorOffset_op = carcasThk_wr / 2 + 4;
	var hingePar = {
		type: par.hingeType,
		whDiam: 3,
		whDist: 32,
		whOffset: 37,
		dhDiam: 35,
		dhDiam2: 3,
		dhOffset: 21.5,
		dhOffset2: 6,
		dhDist: 48,
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
	var topHingeYOffset = 20;
	
	//параметры секций
	var sections = [];
	var sectPos = width - carcasThk_wr;
	var topPlateOuterX = carcasThk_wr + topPlateLength2 - doorTopOffset * Math.tan(angleTop/2);
	var topPlateInnerX = carcasThk_wr + topPlateLength2 - carcasThk_wr * Math.tan(angleTop/2);
	var innerAngleHeightSub = carcasThk_wr + carcasThk_wr * Math.tan((Math.PI/2-angleTop)/2);
	var innerHeightSub = 2*carcasThk_wr ;
	
	//отверстия для петель для стенок и перегородок 
	var plateSlots = [];
	var boxSlots = [];
	var slideSlots = [];
	
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
				sections[i].heightPlate = (heightRight - innerAngleHeightSub) + (width - sectPos - carcasThk_wr) * Math.tan(angleTop);
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
				sections[i].heightLeftDoor = heightLeft - doorTopOffset;
				sections[i].heightRightDoor = heightRight + (width - sectPos - doorOffsetRight) * Math.tan(angleTop) - doorTopOffset / Math.cos(angleTop);
		    } 
		    //Секция наклонная
			else if(sectPos - (sectWidth + doorOffsetLeft) >= topPlateOuterX && sectPos + doorOffsetRight > topPlateOuterX) {
				sections[i].topNotchDoor = 0;
			    sections[i].heightLeftDoor = heightRight + (width - (sectPos - sectWidth - doorOffsetLeft)) * Math.tan(angleTop) - doorTopOffset / Math.cos(angleTop);
			    sections[i].heightRightDoor = heightRight + (width - sectPos - doorOffsetRight) * Math.tan(angleTop) - doorTopOffset / Math.cos(angleTop);
			}
			//Секция горизонтальная
			else{
				sections[i].topNotchDoor = 0;
			    sections[i].heightLeftDoor = heightLeft - doorTopOffset;
			    sections[i].heightRightDoor = heightLeft - doorTopOffset;
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
				sections[i].heightPlate = (heightLeft - innerAngleHeightSub) + sectPos * Math.tan(angleTop);
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
				sections[i].heightLeftDoor = heightLeft + (sectPos - sectWidth - doorOffsetLeft) * Math.tan(angleTop) - doorTopOffset / Math.cos(angleTop);
				sections[i].heightRightDoor = heightRight - doorTopOffset;
		    } 
		    //Секция наклонная
			else if(sectPos - (sectWidth + doorOffsetLeft) <= width - topPlateOuterX && sectPos + doorOffsetRight < width - topPlateOuterX) {
				sections[i].topNotchDoor = 0;
			    sections[i].heightLeftDoor = heightLeft + (sectPos - sectWidth - doorOffsetLeft) * Math.tan(angleTop) - doorTopOffset / Math.cos(angleTop);
			    sections[i].heightRightDoor = heightLeft + (sectPos + doorOffsetRight) * Math.tan(angleTop) - doorTopOffset / Math.cos(angleTop);
			}
			//Секция горизонтальная
			else{
				sections[i].topNotchDoor = 0;
			    sections[i].heightLeftDoor = heightRight - doorTopOffset;
			    sections[i].heightRightDoor = heightRight - doorTopOffset;
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
var boxHoleDiam = 5;
var boxHoleOffset = 25;

var maxBoxDoorPlusRight = 0;

for (var i=0; i<boxes.length; i++){
	if(boxes[i].boxDoorPlusIn > maxBoxDoorPlusRight){
		maxBoxDoorPlusRight = boxes[i].boxDoorPlusIn;
	}
}

for (var i=0; i<boxes.length; i++){
	var sectNumber = boxes[i].sect * 1.0 - 1;
	if(i == 0 || boxes[i].sect != boxes[i-1].sect){
	    //подпись
	    var textHeight = 60;
		dxfBasePoint = newPoint_xy(dxfBasePoint, 0, -Math.max(heightLeft, heightRight) - 500);
	    var textBasePoint = newPoint_xy(dxfBasePoint, 500, Math.max(heightLeft, heightRight) + 100);
	    addText("Полки, ящики (секция "+ boxes[i].sect + ")", textHeight,  dxfPrimitivesArr, textBasePoint);
	}

	if(sectNumber < 0 || sectNumber >= sectAmt){
		alert((sectNumber + 1) + " - неверный номер секции.")
	}
	else{
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
			angleTop: angleTop,
			boxDoorPlusIn: maxBoxDoorPlusRight,
			boxDoorPlusRight: boxes[i].boxDoorPlusRight,
			boxDoorPlusLeft: boxes[i].boxDoorPlusLeft,
			boxDoorPlusTop: boxes[i].boxDoorPlusTop,
			boxDoorPlusBot: boxes[i].boxDoorPlusBot,
			boxCarcasHeight: boxes[i].boxCarcasHeight,
			boxYOffset: 5,
			sideOffset: 12,
			beamWidth:  beamWidth,
			doorTopOffset: doorTopOffset + topParams.doorOnlay,
		}
		
		if(boxpar.type == "полка"){
			var equalBoxHoleIndex = -1;
			if(boxSlots[sectNumber]){
				var equalBoxHoleItem = boxSlots[sectNumber].find(function(item){return item.posY == boxes[i].posY});
				equalBoxHoleIndex = equalBoxHoleItem ? boxSlots[sectNumber].indexOf(equalBoxHoleItem) : -1;
			}
			if(equalBoxHoleIndex == -1) {
			    if(!boxSlots[sectNumber]) boxSlots[sectNumber] = [];
			
			    var center = {x:boxHoleOffset, y:boxes[i].posY - boxHoleDiam/2};
				if(sectNumber == 0) center.y += carcasThk_wr;
			    boxSlots[sectNumber].push({center:center, rad: hingePar.dhDiam2/2, posY: boxes[i].posY, isForBox: true, isTop: true });
						
			    center = {x:depth-boxHoleOffset, y:boxes[i].posY - boxHoleDiam/2};
				if(sectNumber == 0) center.y += carcasThk_wr;
			    boxSlots[sectNumber].push({center:center, rad: hingePar.dhDiam2/2, posY: boxes[i].posY, isForBox: true, isTop: true });
			}
			else {
				boxSlots[sectNumber][equalBoxHoleIndex].isTop = true;
				boxSlots[sectNumber][equalBoxHoleIndex + 1].isTop = true;
			}

			if(!boxSlots[sectNumber + 1]) boxSlots[sectNumber + 1] = [];
			
			var center = {x:boxHoleOffset, y:boxes[i].posY - boxHoleDiam/2};
		    if(sectNumber + 1 == sectAmt) center.y += carcasThk_wr;
		    boxSlots[sectNumber + 1].push({center:center, rad: hingePar.dhDiam2/2, posY: boxes[i].posY, isForBox: true, isBottom: true });
						
		    center = {x:depth-boxHoleOffset, y:boxes[i].posY - boxHoleDiam/2};
		    if(sectNumber + 1 == sectAmt) center.y += carcasThk_wr;
		    boxSlots[sectNumber + 1].push({center:center, rad: hingePar.dhDiam2/2, posY: boxes[i].posY, isForBox: true, isBottom: true });
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
		        dxfBasePoint: newPoint_xy(dxfBasePoint, 2*(Math.max(boxpar.height, boxpar.width, boxpar.depth) + 100), 0),
		        text: "фасад шкафчика",
		        material: metalMaterial,
		        shelfMaterial: timberMaterial2,  
		        sideFactor: sideFactor,
		        depth: depth, 
		        addSideOffset: 0,
				hingeDoorEdgeDist: hingeDoorEdgeDist,
	            topHingeYOffset: topHingeYOffset,
		        sectionpar: null
		    }
			
			//расчет параметров дверей
			platepar.sectionpar = sections[sectNumber];
			platepar.topNotch = sections[sectNumber].topNotchDoor;
			platepar.width = sections[sectNumber].width + carcasThk_wr;	
			if(boxes[i].posY +  boxHeight < Math.min(sections[sectNumber].heightLeftDoor, sections[sectNumber].heightRightDoor) - carcasThk_wr){
			    platepar.heightLeft = boxHeight + boxes[i].boxDoorPlusBot + boxes[i].boxDoorPlusTop;
			    platepar.heightRight = boxHeight + boxes[i].boxDoorPlusBot + boxes[i].boxDoorPlusTop;
				boxHeight = platepar.heightRight;
			}
			else{
			    platepar.heightLeft = sections[sectNumber].heightLeftDoor - (boxes[i].posY + carcasThk_wr) + boxes[i].boxDoorPlusBot + boxes[i].boxDoorPlusTop;
			    platepar.heightRight = sections[sectNumber].heightRightDoor - (boxes[i].posY + carcasThk_wr) + boxes[i].boxDoorPlusBot + boxes[i].boxDoorPlusTop;
				if(platepar.heightLeft != platepar.heightRight){
				    if(sideFactor == 1){
					    if(boxpar.type == "шкаф прав."){
					        if(sections[sectNumber].topNotchDoor < -boxes[i].boxDoorPlusLeft){
				    	        platepar.heightLeft -= (-boxes[i].boxDoorPlusLeft-sections[sectNumber].topNotchDoor)*Math.tan(angleTop);
				    	        platepar.topNotch = 0;
					        }
					        else{
						        platepar.topNotch += boxes[i].boxDoorPlusLeft;
					        }
					    }
					    else if(boxpar.type == "шкаф лев."){
					        if(platepar.width + boxes[i].boxDoorPlusRight > sections[sectNumber].topNotchDoor){
				    	        platepar.heightRight += -boxes[i].boxDoorPlusRight*Math.tan(angleTop);
					        }
					        else{
							    platepar.heightRight = platepar.heightLeft;
						        platepar.topNotch = platepar.width + boxes[i].boxDoorPlusRight;
					        }
					    }
				    }
					else if(sideFactor == -1){
					    if(boxpar.type == "шкаф прав."){
					        if(platepar.width + boxes[i].boxDoorPlusLeft > sections[sectNumber].topNotchDoor){
				    	        platepar.heightLeft += -boxes[i].boxDoorPlusLeft*Math.tan(angleTop);
					        }
					        else{
							    platepar.heightLeft = platepar.heightRight;
						        platepar.topNotch = platepar.width + boxes[i].boxDoorPlusLeft;
					        }
					    }
					    else if(boxpar.type == "шкаф лев."){
					        if(sections[sectNumber].topNotchDoor < -boxes[i].boxDoorPlusRight){
				    	        platepar.heightRight -= (-boxes[i].boxDoorPlusRight-sections[sectNumber].topNotchDoor)*Math.tan(angleTop);
				    	        platepar.topNotch = 0;
					        }
					        else{
						        platepar.topNotch += boxes[i].boxDoorPlusRight;
					        }
					    }
				    }
				}
				boxpar.hasTopPlate = false;//нет верхней полки
				boxHeight = Math.min(platepar.heightLeft, platepar.heightRight);
			}
			
			if(boxes[i].posY == 0){
				boxpar.hasBotPlate = false; //нет нижней полки
			}
			
	        if(sectNumber == 0 && sectNumber == sectAmt - 1) platepar.width = sections[sectNumber].width + 2*carcasThk_wr - 2*sideDoorOffset_cl;
			else if(sectNumber == 0 || sectNumber == sectAmt - 1) platepar.width = sections[sectNumber].width + 2*carcasThk_wr - sideDoorOffset_cl - midDoorOffset_cl;
			else platepar.width = sections[sectNumber].width + 2*carcasThk_wr - 2*midDoorOffset_cl;
			
			//отверстия на перегородках для петель фасадов
			if(boxpar.type == "шкаф лев.") {
				platepar.type = "влево";
				if(!plateSlots[sectNumber + 1]) plateSlots[sectNumber+1] = [];
				for(var j = 0; j < getHingeCount(boxHeight); ++j){
			        var center = {x:depth-hingePar.whOffset, y:j * (boxHeight-2*hingeDoorEdgeDist) / (getHingeCount(boxHeight) - 1) + hingeDoorEdgeDist + (sectNumber+1 != 0 && sectNumber+1 != sectAmt ? carcasThk_wr : 0) + boxes[i].posY - boxes[i].boxDoorPlusBot};
					if(i == getHingeCount(boxHeight) - 1) center.y -= topHingeYOffset;
					plateSlots[sectNumber + 1].push({center:center, rad: hingePar.dhDiam2/2});
						
				    center = {x:depth-hingePar.whOffset, y:j * (boxHeight-2*hingeDoorEdgeDist) / (getHingeCount(boxHeight) - 1) + hingeDoorEdgeDist + (sectNumber+1 != 0 && sectNumber+1 != sectAmt ? carcasThk_wr - hingePar.whDist : hingePar.whDist) + boxes[i].posY - boxes[i].boxDoorPlusBot};
					if(i == getHingeCount(boxHeight) - 1) center.y -= topHingeYOffset;
					plateSlots[sectNumber + 1].push({center:center, rad: hingePar.dhDiam2/2});
				}
				platepar.width += boxes[i].boxDoorPlusRight;
			}
	        if(boxpar.type == "шкаф прав.") {
				platepar.type = "вправо";
				if(!plateSlots[sectNumber]) plateSlots[sectNumber] = [];
			    for(var j = 0; j < getHingeCount(boxHeight); ++j){
			        var center = {x:depth-hingePar.whOffset, y:j * (boxHeight-2*hingeDoorEdgeDist) / (getHingeCount(boxHeight) - 1) + hingeDoorEdgeDist + (sectNumber != 0 && sectNumber != sectAmt ? carcasThk_wr : 0) + boxes[i].posY - boxes[i].boxDoorPlusBot};
					if(i == getHingeCount(boxHeight) - 1) center.y -= topHingeYOffset;
					plateSlots[sectNumber].push({center:center, rad: hingePar.dhDiam2/2});
						
					center = {x:depth-hingePar.whOffset, y:j * (boxHeight-2*hingeDoorEdgeDist) / (getHingeCount(boxHeight) - 1) + hingeDoorEdgeDist + (sectNumber != 0 && sectNumber != sectAmt ? carcasThk_wr - hingePar.whDist : hingePar.whDist) + boxes[i].posY - boxes[i].boxDoorPlusBot};
					if(i == getHingeCount(boxHeight) - 1) center.y -= topHingeYOffset;
					plateSlots[sectNumber].push({center:center, rad: hingePar.dhDiam2/2});
				}
				platepar.width += boxes[i].boxDoorPlusLeft;
			}
	        if(boxpar.type == "шкаф две") {
				platepar.type = "две двери";
				
				if(!plateSlots[sectNumber]) plateSlots[sectNumber] = [];
			    for(var j = 0; j < getHingeCount(boxHeight); ++j){
			        var center = {x:depth-hingePar.whOffset, y:j * (boxHeight-2*hingeDoorEdgeDist) / (getHingeCount(boxHeight) - 1) + hingeDoorEdgeDist + (sectNumber != 0 && sectNumber != sectAmt ? carcasThk_wr : 0) + boxes[i].posY - boxes[i].boxDoorPlusBot};
					if(i == getHingeCount(boxHeight) - 1) center.y -= topHingeYOffset;
					plateSlots[sectNumber].push({center:center, rad: hingePar.dhDiam2/2});
						
				    center = {x:depth-hingePar.whOffset, y:j * (boxHeight-2*hingeDoorEdgeDist) / (getHingeCount(boxHeight) - 1) + hingeDoorEdgeDist + (sectNumber != 0 && sectNumber != sectAmt ? carcasThk_wr - hingePar.whDist : hingePar.whDist) + boxes[i].posY - boxes[i].boxDoorPlusBot};
					if(i == getHingeCount(boxHeight) - 1) center.y -= topHingeYOffset;
					plateSlots[sectNumber].push({center:center, rad: hingePar.dhDiam2/2});
				}
			
				if(!plateSlots[sectNumber + 1]) plateSlots[sectNumber+1] = [];
				for(var j = 0; j < getHingeCount(boxHeight); ++j){
			        var center = {x:depth-hingePar.whOffset, y:j * (boxHeight-2*hingeDoorEdgeDist) / (getHingeCount(boxHeight) - 1) + hingeDoorEdgeDist + (sectNumber+1 != 0 && sectNumber+1 != sectAmt ? carcasThk_wr : 0) + boxes[i].posY - boxes[i].boxDoorPlusBot};
					if(i == getHingeCount(boxHeight) - 1) center.y -= topHingeYOffset;
					plateSlots[sectNumber + 1].push({center:center, rad: hingePar.dhDiam2/2});
						
				    center = {x:depth-hingePar.whOffset, y:j * (boxHeight-2*hingeDoorEdgeDist) / (getHingeCount(boxHeight) - 1) + hingeDoorEdgeDist + (sectNumber+1 != 0 && sectNumber+1 != sectAmt ? carcasThk_wr - hingePar.whDist : hingePar.whDist) + boxes[i].posY - boxes[i].boxDoorPlusBot};
					if(i == getHingeCount(boxHeight) - 1) center.y -= topHingeYOffset;
					plateSlots[sectNumber + 1].push({center:center, rad: hingePar.dhDiam2/2});
				}
			}
			
			if(sectNumber == 0 && platepar.type == "вправо" || sectNumber == sectAmt-1 && platepar.type == "влево"){
				platepar.hingeType = "side";
			}
			else if(platepar.type == "вправо" || platepar.type == "влево") {
				platepar.hingeType = "middle";
			}
			else if(sectNumber == 0 && platepar.type == "две двери"){
				platepar.hingeType1 = "middle";
				platepar.hingeType2 = "side";
			}
			else if(sectNumber == sectAmt-1 && platepar.type == "две двери") {
				platepar.hingeType1 = "side";
				platepar.hingeType2 = "middle";
			}
			else {
				platepar.hingeType1 = "middle";
				platepar.hingeType2 = "middle";
			}

			platepar.type = platepar.type;
			platepar.doorGap = doorGap;
			if(platepar.type == "выдвижная"){ 
			    platepar.boxWidth = sections[sectNumber].width;
			}
			
			platepar = drawDoor(platepar);
			var plate = platepar.mesh;
			var metises = platepar.metises;

			//расположение фасадов и петель
			
			if(sectNumber == 0) {
				plate.position.x = width - platepar.width - sideDoorOffset_cl;
				metises.position.x = width - platepar.width - sideDoorOffset_cl;
				if(platepar.type == "влево"){
					plate.position.x += boxes[i].boxDoorPlusRight;
					metises.position.x += boxes[i].boxDoorPlusRight;
				}
			}
			else if(sectNumber == sectAmt-1) {
				plate.position.x = sideDoorOffset_cl;
				metises.position.x = sideDoorOffset_cl;
				if(platepar.type == "вправо"){
					plate.position.x -= boxes[i].boxDoorPlusLeft;
					metises.position.x -= boxes[i].boxDoorPlusLeft;
				}
			}
			else {
				plate.position.x = sections[sectNumber].pos - sections[sectNumber].width - midDoorOffset_cl + doorGap*2;
				metises.position.x = sections[sectNumber].pos - sections[sectNumber].width - midDoorOffset_cl + doorGap*2;
				if(platepar.type == "вправо"){
					plate.position.x -= boxes[i].boxDoorPlusLeft;
					metises.position.x -= boxes[i].boxDoorPlusLeft;
				}
			}
			plate.position.z = depth;

			metises.position.z = depth;
			plate.position.y = boxes[i].posY + carcasThk_wr - boxes[i].boxDoorPlusBot;
			metises.position.y = boxes[i].posY + carcasThk_wr - boxes[i].boxDoorPlusBot;
			
			if(isDoorsOpened) {
				if(platepar.type == "выдвижная"){ 
				    plate.position.z += depth/2;
				}
				else if(platepar.type == "две двери"){
					plate.position.x = sections[sectNumber].pos;
					metises.position.x = sections[sectNumber].pos;
					
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
					
					//metises
				    if(platepar.type == "вправо") {
				        metises.rotation.y = Math.PI / 2;
					    metises.position.z += platepar.width + doorGap;
					    metises.position.x = sections[sectNumber].pos;
						if(sectNumber == 0) metises.position.x -= sideDoorOffset_op;
						else metises.position.x -= midDoorOffset_op;
				    }
					else{
						metises.rotation.y = -Math.PI / 2;
						metises.position.z += doorGap;
					    metises.position.x = sections[sectNumber].pos-sections[sectNumber].width;
						if(sectNumber == sectAmt-1) metises.position.x += sideDoorOffset_op;
						else metises.position.x += midDoorOffset_op;
					}
				}
			}
			platepar.dxfBasePoint = newPoint_xy(platepar.dxfBasePoint, 0, -Math.max(heightLeft, heightRight) - 500);
			platepar.dxfBasePoint.x = 0;
			wrDoors.add(plate);
			wrMetis.add(metises);
		}
		if(boxpar.type == "ящик" || boxpar.type == "ящик верхний"){
			//направляющие
	            var boxLen = Math.floor((par.depth_wr - boxpar.boxDoorPlusIn) / 50) * 50;
	            if(boxLen < 300) boxLen = 300;
	            if(boxLen > 550) boxLen = 550;
//				console.log(boxpar)
				
				//первая направляющая
	            var slideParams = {
		            len: boxLen,
		            material: metalMaterial,
					dxfBasePoint: newPoint_xy(boxpar.dxfBasePoint, 12*(Math.max(boxpar.height, boxpar.width) + 100)+100, 0),
					dxfPrimitivesArr: dxfPrimitivesArr
	            }
	            slideParams = drawSlide(slideParams)
	            var slide = slideParams.mesh;
				
	            slide.position.y = boxes[i].posY + carcasThk_wr + boxpar.boxCarcasHeight/2 + boxpar.boxYOffset;
		        if(boxes[i].widthType == "по секции" && boxes[i].type != "перегородка"){
		            slide.position.x = sections[sectNumber].pos - sections[sectNumber].width + slideParams.wallPartThk;
		        }
		        else {
			        slide.position.x = sections[sectNumber].pos - sections[sectNumber].width + boxes[i].posX + slideParams.wallPartThk;
		        }
	            slide.position.z = -boxpar.boxDoorPlusIn + par.depth_wr;
				
	            wrMetis.add(slide);
				
				//вторая направляющая
				var slideParams = {
		            len: boxLen,
		            material: metalMaterial,
					dxfBasePoint: newPoint_xy(boxpar.dxfBasePoint, Math.max(boxpar.height, boxpar.width) + 100, 0),
					dxfPrimitivesArr: [],
	            }
				slideParams = drawSlide(slideParams)
	            var slide = slideParams.mesh;
				
	            slide.position.y = boxes[i].posY + carcasThk_wr + boxpar.boxCarcasHeight/2 + boxpar.boxYOffset;
				
		        if(boxes[i].widthType == "по секции" && boxes[i].type != "перегородка"){
		            slide.position.x = sections[sectNumber].pos - slideParams.wallPartThk;
		        }
		        else {
			        slide.position.x = sections[sectNumber].pos + boxes[i].posX - slideParams.wallPartThk;
		        }
				slide.rotation.z = Math.PI;
	            slide.position.z = -boxpar.boxDoorPlusIn + par.depth_wr;
				
	            wrMetis.add(slide);
				boxpar.slideParams = slideParams;
				boxpar.sideOffset = slideParams.totalThk;
			    boxpar.depth = (boxLen + boxpar.boxDoorPlusIn) + doorsThk_wr;
				
			    var equalSlideHoleIndex = -1;
			    if(slideSlots[sectNumber]){
				    var equalSlideHoleItem = slideSlots[sectNumber].find(function(item){return item.posY == boxes[i].posY});
				    equalSlideHoleIndex = equalSlideHoleItem ? slideSlots[sectNumber].indexOf(equalSlideHoleItem) : -1;
			    }
			    if(equalSlideHoleIndex == -1) {
			        if(!slideSlots[sectNumber]) slideSlots[sectNumber] = [];
			
			        for(var j = 0; j < slideParams.wallHoles.length; ++j){
		                var center = {x:depth - boxpar.boxDoorPlusIn - slideParams.wallHoles[j] - slideParams.startOffset, y:boxes[i].posY + boxpar.boxCarcasHeight/2 + boxpar.boxYOffset};
		                if(sectNumber == 0) center.y += carcasThk_wr;
		                slideSlots[sectNumber].push({center:center, rad: 1.5, posY: boxes[i].posY, isMirror: false });
				    }
			    }

		        if(!slideSlots[sectNumber + 1]) slideSlots[sectNumber + 1] = [];
			
			    for(var j = 0; j < slideParams.wallHoles.length; ++j){
		            var center = {x:depth - boxpar.boxDoorPlusIn - slideParams.wallHoles[j] - slideParams.startOffset, y:boxes[i].posY + boxpar.boxCarcasHeight/2 + boxpar.boxYOffset};
		            if(sectNumber + 1 == sectAmt) center.y += carcasThk_wr;
		            slideSlots[sectNumber + 1].push({center:center, rad: 1.5, posY: boxes[i].posY, isMirror: true });
				}
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
			if(boxpar.type == "ящик" || boxpar.type == "ящик верхний"){
				box.position.z = par.depth_wr - boxpar.depth + doorsThk_wr;
			}
		}
		else {
			box.position.x = sections[sectNumber].pos - sections[sectNumber].width + boxes[i].posX;
		}
		
		dxfBasePoint = newPoint_xy(dxfBasePoint, 0, -Math.max(heightLeft, heightRight) - 500);
		boxpar.dxfBasePoint = dxfBasePoint;
		wrShelfs.add(box);
	}
}

//удвление повторяющихся отверстий 
for(var i = 0; i < plateSlots.length; ++i){
	var indeciesForRemove = [];
	if(plateSlots[i]){
        for(var j = 0; j < plateSlots[i].length - 1; ++j){
		    for(var k = j+1; k < plateSlots[i].length; ++k){
		        if(plateSlots[i][j].center.y == plateSlots[i][k].center.y && plateSlots[i][j].center.x == plateSlots[i][k].center.x){
				    indeciesForRemove.push(k);
			    }
		    }
        }
	    var resArr = [];
	    for(var j = 0; j < plateSlots[i].length; ++j){
		    if(indeciesForRemove.indexOf(j) == -1) resArr.push(plateSlots[i][j]);
	    }
	    plateSlots[i] = resArr;
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
		hingeDoorEdgeDist: hingeDoorEdgeDist,
	    topHingeYOffset: topHingeYOffset,
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
			platepar.width = sections[i].width + carcasThk_wr;
			platepar.topNotch = sections[i].topNotchDoor;
			
			if(sections[i].type == "влево") {
				if(!plateSlots[i + 1] || plateSlots[i + 1].length < getHingeCount(platepar.heightLeft)) {
					plateSlots[i+1] = [];
				    for(var j = 0; j < getHingeCount(platepar.heightLeft); ++j){
			            var center = {x:depth-hingePar.whOffset, y:j * (platepar.heightLeft-2*hingeDoorEdgeDist) / (getHingeCount(platepar.heightLeft) - 1) + hingeDoorEdgeDist + (i+1 != 0 && i+1 != sectAmt ? carcasThk_wr : 0) - carcasThk_wr};
					    if(j == getHingeCount(platepar.heightLeft) - 1) center.y -= topHingeYOffset;
						plateSlots[i + 1].push({center:center, rad: hingePar.dhDiam2/2});
						
						center = {x:depth-hingePar.whOffset, y:j * (platepar.heightLeft-2*hingeDoorEdgeDist) / (getHingeCount(platepar.heightLeft) - 1) + hingeDoorEdgeDist + (i+1 != 0 && i+1 != sectAmt ? carcasThk_wr - hingePar.whDist : hingePar.whDist) - carcasThk_wr};
					    if(j == getHingeCount(platepar.heightLeft) - 1) center.y -= topHingeYOffset;
						plateSlots[i + 1].push({center:center, rad: hingePar.dhDiam2/2});
				    }
				}
			}
	        if(sections[i].type == "вправо") {
				if(!plateSlots[i] || plateSlots[i].length < getHingeCount(platepar.heightRight)) {
					plateSlots[i] = [];
			    	for(var j = 0; j < getHingeCount(platepar.heightRight); ++j){
			            var center = {x:depth-hingePar.whOffset, y:j * (platepar.heightRight-2*hingeDoorEdgeDist) / (getHingeCount(platepar.heightRight) - 1) + hingeDoorEdgeDist + (i != 0 && i != sectAmt ? carcasThk_wr : 0) - carcasThk_wr};
					    if(j == getHingeCount(platepar.heightRight) - 1) center.y -= topHingeYOffset;
						plateSlots[i].push({center:center, rad: hingePar.dhDiam2/2});
						
						center = {x:depth-hingePar.whOffset, y:j * (platepar.heightRight-2*hingeDoorEdgeDist) / (getHingeCount(platepar.heightRight) - 1) + hingeDoorEdgeDist + (i != 0 && i != sectAmt ? carcasThk_wr - hingePar.whDist : hingePar.whDist) - carcasThk_wr};
					    if(j == getHingeCount(platepar.heightRight) - 1) center.y -= topHingeYOffset;
						plateSlots[i].push({center:center, rad: hingePar.dhDiam2/2});
				    }
				}
			}
	        if(sections[i].type == "две двери") {
				if(!plateSlots[i] || plateSlots[i].length < getHingeCount(platepar.heightRight)) {
					plateSlots[i] = [];
			    	for(var j = 0; j < getHingeCount(platepar.heightRight); ++j){
			            var center = {x:depth-hingePar.whOffset, y:j * (platepar.heightRight-2*hingeDoorEdgeDist) / (getHingeCount(platepar.heightRight) - 1) + hingeDoorEdgeDist + (i != 0 && i != sectAmt ? carcasThk_wr : 0) - carcasThk_wr};
					    if(j == getHingeCount(platepar.heightRight) - 1) center.y -= topHingeYOffset;
						plateSlots[i].push({center:center, rad: hingePar.dhDiam2/2});
						
						center = {x:depth-hingePar.whOffset, y:j * (platepar.heightRight-2*hingeDoorEdgeDist) / (getHingeCount(platepar.heightRight) - 1) + hingeDoorEdgeDist + (i != 0 && i != sectAmt ? carcasThk_wr - hingePar.whDist : hingePar.whDist) - carcasThk_wr};
					    if(j == getHingeCount(platepar.heightRight) - 1) center.y -= topHingeYOffset;
						plateSlots[i].push({center:center, rad: hingePar.dhDiam2/2});
				    }
				}
				if(!plateSlots[i + 1] || plateSlots[i + 1].length < getHingeCount(platepar.heightLeft)) {
					plateSlots[i+1] = [];
				    for(var j = 0; j < getHingeCount(platepar.heightLeft); ++j){
			            var center = {x:depth-hingePar.whOffset, y:j * (platepar.heightLeft-2*hingeDoorEdgeDist) / (getHingeCount(platepar.heightLeft) - 1) + hingeDoorEdgeDist + (i+1 != 0 && i+1 != sectAmt ? carcasThk_wr : 0) - carcasThk_wr};
					    if(j == getHingeCount(platepar.heightLeft) - 1) center.y -= topHingeYOffset;
						plateSlots[i + 1].push({center:center, rad: hingePar.dhDiam2/2});
						
						center = {x:depth-hingePar.whOffset, y:j * (platepar.heightLeft-2*hingeDoorEdgeDist) / (getHingeCount(platepar.heightLeft) - 1) + hingeDoorEdgeDist + (i+1 != 0 && i+1 != sectAmt ? carcasThk_wr - hingePar.whDist : hingePar.whDist) - carcasThk_wr};
					    if(j == getHingeCount(platepar.heightLeft) - 1) center.y -= topHingeYOffset;
						plateSlots[i + 1].push({center:center, rad: hingePar.dhDiam2/2});
				    }
				}
			}
			
			if(i == 0 && sections[i].type == "вправо" || i == sectAmt-1 && sections[i].type == "влево"){
				platepar.hingeType = "side";
			}
			else if(sections[i].type == "вправо" || sections[i].type == "влево") {
				platepar.hingeType = "middle";
			}
			else if(i == 0 && sections[i].type == "две двери"){
				platepar.hingeType1 = "middle";
				platepar.hingeType2 = "side";
			}
			else if(i == sectAmt-1 && sections[i].type == "две двери") {
				platepar.hingeType1 = "side";
				platepar.hingeType2 = "middle";
			}
			else {
				platepar.hingeType1 = "middle";
				platepar.hingeType2 = "middle";
			}
			
	        if(i == 0 && i == sectAmt - 1) platepar.width = sections[i].width + 2*carcasThk_wr - 2*sideDoorOffset_cl;
			else if(i == 0 || i == sectAmt - 1) platepar.width = sections[i].width + 2*carcasThk_wr - sideDoorOffset_cl - midDoorOffset_cl;
			else platepar.width = sections[i].width + 2*carcasThk_wr - 2*midDoorOffset_cl;
			
			platepar.type = sections[i].type;
			platepar.doorGap = doorGap;
			if(sections[i].type == "выдвижная"){
			    platepar.boxWidth = sections[i].width;
			}
			
			platepar = drawDoor(platepar);
			var plate = platepar.mesh;
			var metises = platepar.metises;

			if(i == 0) {
				plate.position.x = width - platepar.width - sideDoorOffset_cl;
				metises.position.x = width - platepar.width - sideDoorOffset_cl;
			}
			else if(i == sectAmt-1) {
				plate.position.x = sideDoorOffset_cl;
				metises.position.x = sideDoorOffset_cl;
			}
			else {
				plate.position.x = sections[i].pos - sections[i].width - midDoorOffset_cl + doorGap*2;
				metises.position.x = sections[i].pos - sections[i].width - midDoorOffset_cl + doorGap*2;
			}
			plate.position.z = depth;
			if(sections[i].type != "выдвижная")metises.position.z = depth;
			if(isDoorsOpened) {
				if(sections[i].type == "выдвижная"){ 
				    plate.position.z += depth/2;
				}
				else if(sections[i].type == "две двери"){
					plate.position.x = sections[i].pos;
					metises.position.x = sections[i].pos;
					
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
				    if(sections[i].type == "вправо") {
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
					
					//metises
				    if($("#door" + i).val() == "вправо") {
				        metises.rotation.y = Math.PI / 2;
					    metises.position.z += platepar.width + doorGap;
					    metises.position.x = sections[i].pos;
						if(i == 0) metises.position.x -= sideDoorOffset_op;
						else metises.position.x -= midDoorOffset_op;
				    }
					else{
						metises.rotation.y = -Math.PI / 2;
						metises.position.z += doorGap;
					    metises.position.x = sections[i].pos-sections[i].width;
						if(i == sectAmt-1) metises.position.x += sideDoorOffset_op;
						else metises.position.x += midDoorOffset_op;
					}
				}
			}
			platepar.dxfBasePoint = newPoint_xy(platepar.dxfBasePoint, 0, -Math.max(heightLeft, heightRight) - 500);
			platepar.dxfBasePoint.x = 0;
			wrDoors.add(plate);
			wrMetis.add(metises);
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

	if(heightLeft != heightRight){
        if(topPlateLength1 > 0 && sideFactor == -1){
		    platepar.height += topParams.topOffset/Math.cos(angleTop)+carcasThk_wr*Math.tan(angleTop);
	    }
	    else{
		    platepar.height += topParams.topOffset;
	    }
	}
	//отверстия под петли для дверей и полкодержатели
	platepar.roundHoles = plateSlots[sectAmt] || [];
	if(boxSlots[sectAmt])Array.prototype.push.apply(platepar.roundHoles,boxSlots[sectAmt]);
	if(slideSlots[sectAmt])Array.prototype.push.apply(platepar.roundHoles,slideSlots[sectAmt]);
	if(slideSlots[sectAmt] && slideSlots[sectAmt][0].isMirror) platepar.text += " (зеркально)";
		
	//отверстия под конфирматы
	platepar.roundHoles = platepar.roundHoles || [];
	var centerSideOffset1 = 40;
	var centerSideOffset2 = carcasThk_wr/2;

	if(heightLeft != heightRight){	
	    var center = {x:centerSideOffset1, y:centerSideOffset2};
	    platepar.roundHoles.push({ center:center, rad: 3 });
	    var center = {x:platepar.width-centerSideOffset1, y:centerSideOffset2};
	    platepar.roundHoles.push({ center:center, rad: 3 });
	
	    var center = {x:centerSideOffset2, y:platepar.height-centerSideOffset1};
	    platepar.roundHoles.push({ center:center, rad: 3 });
	    var center = {x:platepar.width-centerSideOffset2, y:platepar.height-centerSideOffset1};
	    platepar.roundHoles.push({ center:center, rad: 3 });

	}
	else{
	    var center = {x:centerSideOffset1, y:centerSideOffset2};
	    platepar.roundHoles.push({ center:center, rad: 3 });
	    var center = {x:platepar.width-centerSideOffset1, y:centerSideOffset2};
	    platepar.roundHoles.push({ center:center, rad: 3 });
	
	    var center = {x:centerSideOffset1, y:platepar.height-centerSideOffset2};
	    platepar.roundHoles.push({ center:center, rad: 3 });
	    var center = {x:platepar.width-centerSideOffset1, y:platepar.height-centerSideOffset2};
	    platepar.roundHoles.push({ center:center, rad: 3 });
	}
	
	platepar = drawPlate_wr(platepar);
	var plate = platepar.mesh;
	plate.rotation.y = - Math.PI /2;
	plate.position.x = carcasThk_wr;
	dxfBasePoint = newPoint_xy(dxfBasePoint, depth + 500, 0);
		
	wrCarcas.add(plate);
	
	//правая панель
	
	platepar.text = "правая панель";
	platepar.dxfBasePoint = dxfBasePoint;
	platepar.height = heightRight;

	if(heightLeft != heightRight){
	    if(topPlateLength1 > 0 && sideFactor == 1){
		    platepar.height += topParams.topOffset/Math.cos(angleTop)+carcasThk_wr*Math.tan(angleTop);
	    }
	    else{
		    platepar.height += topParams.topOffset;
	    }
	}

	//отверстия под петли для дверей и полкодержатели
	platepar.roundHoles = plateSlots[0] || [];
	if(boxSlots[0])Array.prototype.push.apply(platepar.roundHoles,boxSlots[0]);
	if(slideSlots[0])Array.prototype.push.apply(platepar.roundHoles,slideSlots[0]);
	if(slideSlots[0] && slideSlots[0][0].isMirror) platepar.text += " (зеркально)";
		
	//отверстия под конфирматы
	platepar.roundHoles = platepar.roundHoles || [];
	var centerSideOffset1 = 40;
	var centerSideOffset2 = carcasThk_wr/2;

	if(heightLeft != heightRight){	
	    var center = {x:centerSideOffset1, y:centerSideOffset2};
	    platepar.roundHoles.push({ center:center, rad: 3 });
	    var center = {x:platepar.width-centerSideOffset1, y:centerSideOffset2};
	    platepar.roundHoles.push({ center:center, rad: 3 });
	
	    var center = {x:centerSideOffset2, y:platepar.height-centerSideOffset1};
	    platepar.roundHoles.push({ center:center, rad: 3 });
	    var center = {x:platepar.width-centerSideOffset2, y:platepar.height-centerSideOffset1};
	    platepar.roundHoles.push({ center:center, rad: 3 });

	}
	else{
	    var center = {x:centerSideOffset1, y:centerSideOffset2};
	    platepar.roundHoles.push({ center:center, rad: 3 });
	    var center = {x:platepar.width-centerSideOffset1, y:centerSideOffset2};
	    platepar.roundHoles.push({ center:center, rad: 3 });
	
	    var center = {x:centerSideOffset1, y:platepar.height-centerSideOffset2};
	    platepar.roundHoles.push({ center:center, rad: 3 });
	    var center = {x:platepar.width-centerSideOffset1, y:platepar.height-centerSideOffset2};
	    platepar.roundHoles.push({ center:center, rad: 3 });
	}
	
	platepar = drawPlate_wr(platepar);
	var plate = platepar.mesh;
	plate.rotation.y = - Math.PI /2;
	plate.position.x = width;
	dxfBasePoint = newPoint_xy(dxfBasePoint, depth + 500, 0);
	
	wrCarcas.add(plate);
	
	//нижняя панель
	platepar.centerFaceOffset = 40;
	platepar.hasFace2Holes = true;
	platepar.hasFace1Holes = true;
	platepar.dxfBasePoint = dxfBasePoint;
	platepar.height = width - 2 * carcasThk_wr;
	platepar.text = "нижняя панель";
	platepar.roundHoles = [];
	for(var i = 1; i < sections.length; ++i){
	    var centerSideOffset1 = 40;
	    var centerSideOffset2 = carcasThk_wr/2;
	
	    var center = {x:centerSideOffset1, y:platepar.height - (sections[i].pos - carcasThk_wr + centerSideOffset2)};
	    platepar.roundHoles.push({ center:center, rad: 3 });
	    var center = {x:platepar.width-centerSideOffset1, y:platepar.height - (sections[i].pos - carcasThk_wr + centerSideOffset2)};
	    platepar.roundHoles.push({ center:center, rad: 3 });
	}
	
	platepar = drawPlate_wr(platepar);
	var plate = platepar.mesh;
	plate.rotation.x =  Math.PI /2;
	plate.rotation.z =  Math.PI /2;
	plate.position.x = width - carcasThk_wr;
	plate.position.y = carcasThk_wr;
	dxfBasePoint = newPoint_xy(dxfBasePoint, depth + 500, 0);
	
	wrCarcas.add(plate);

	
	//верхняя наклонная панель	
	
	if(topPlateLength1 > 0){
		platepar.centerSideOffset = 40;
		platepar.centerFaceOffset = 40;
		platepar.hasSideHoles = true;
		platepar.hasFace1Holes = false;
		platepar.hasFace2Holes = false;
		platepar.roundHoles = [];
		if(heightLeft != heightRight)platepar.width -= 2*(carcasThk_wr - beamSlotsDepth);
		if(sideFactor == 1){
			for(var i = sectAmt - 1; i >= 0; --i){
				platepar.dxfBasePoint = dxfBasePoint;
				
				if(sections[i].pos < topPlateLength2 - carcasThk_wr * Math.tan(angleTop/2) + carcasThk_wr){
					continue;
				}
	            else {
					platepar.height = Math.abs(sections[i].heightRightBox - sections[i].heightLeftBox)/Math.sin(angleTop);
					if(i == 0) platepar.height -= carcasThk_wr * Math.tan(angleTop);
				}
	
	            platepar.text = "верхняя панель 1";
	
	            platepar = drawPlate_wr(platepar);
	            var plate = platepar.mesh;
	            plate.rotation.x =  Math.PI /2;
	            plate.rotation.z =  Math.PI /2;
	            plate.rotation.y =  -angleTop * sideFactor;
	            plate.position.x = sections[i].pos + carcasThk_wr * Math.sin(angleTop);
	            plate.position.y = sections[i].heightRightBox + carcasThk_wr + carcasThk_wr * Math.cos(angleTop);
				if(i == 0) {
					plate.position.x -= carcasThk_wr * Math.tan(angleTop) * Math.cos(angleTop);
	                plate.position.y += carcasThk_wr * Math.tan(angleTop) * Math.sin(angleTop);
				}
				if(heightLeft != heightRight)plate.position.z = carcasThk_wr - beamSlotsDepth;

	            dxfBasePoint = newPoint_xy(dxfBasePoint, depth + 500, 0);
		
	            wrCarcas.add(plate);
			}
		}
		else if(sideFactor == -1){
			for(var i = 0; i < sectAmt; ++i){
				platepar.dxfBasePoint = dxfBasePoint;
				
				if(sections[i].pos - sections[i].width > width - (topPlateLength2 - carcasThk_wr * Math.tan(angleTop/2) + carcasThk_wr)){
					continue;
				}
	            else {
					platepar.height = Math.abs(sections[i].heightLeftBox - sections[i].heightRightBox)/Math.sin(angleTop);
					if(i == sectAmt - 1) platepar.height -= carcasThk_wr * Math.tan(angleTop);
				}
	
	            platepar.text = "верхняя панель 1";
	
	            platepar = drawPlate_wr(platepar);
	            var plate = platepar.mesh;
	            plate.rotation.x =  Math.PI /2;
	            plate.rotation.z =  Math.PI /2;
	            plate.rotation.y = (Math.PI - angleTop) * sideFactor;
	            plate.position.x = sections[i].pos - sections[i].width;
	            plate.position.y = sections[i].heightLeftBox + carcasThk_wr;
                if(i == sectAmt - 1) {
					plate.position.x += carcasThk_wr * Math.tan(angleTop) * Math.cos(angleTop);
	                plate.position.y += carcasThk_wr * Math.tan(angleTop) * Math.sin(angleTop);
				}				
				if(heightLeft != heightRight)plate.position.z = carcasThk_wr - beamSlotsDepth;

	            dxfBasePoint = newPoint_xy(dxfBasePoint, depth + 500, 0);
		
	            wrCarcas.add(plate);
			}
		}
	}
	
	//верхняя горизонтальная панель
	if(topPlateLength2 > 0){
		platepar.centerSideOffset = 40;
		platepar.centerFaceOffset = 40;
		platepar.hasSideHoles = true;
		platepar.hasFace1Holes = false;
		platepar.hasFace2Holes = false;

		if(heightLeft == heightRight){
	        platepar.hasFace2Holes = true;
	        platepar.hasFace1Holes = true;
		}
		
		if(heightLeft == heightRight) platepar.hasSideHoles = false;
	    platepar.dxfBasePoint = dxfBasePoint;
		platepar.height = topPlateLength2 - carcasThk_wr * Math.tan(angleTop/2);
		if(heightLeft == heightRight) platepar.height = topPlateLength2 - carcasThk_wr;
		platepar.text = "верхняя панель 2";
		
		platepar.roundHoles = [];
	    for(var i = 1; i < sections.length; ++i){
	        var centerSideOffset1 = 40;
	        var centerSideOffset2 = carcasThk_wr/2;
			
			if(sections[i].pos <= platepar.height && sideFactor == 1){
	            var center = {x:centerSideOffset1, y:platepar.height - (sections[i].pos - carcasThk_wr + centerSideOffset2)};
	            platepar.roundHoles.push({ center:center, rad: 3 });
	            var center = {x:platepar.width-centerSideOffset1, y:platepar.height - (sections[i].pos - carcasThk_wr + centerSideOffset2)};
	            platepar.roundHoles.push({ center:center, rad: 3 });
			}
			else if(sections[i].pos >= width - platepar.height && sideFactor == -1){
	            var center = {x:centerSideOffset1, y:width - sections[i].pos - carcasThk_wr - centerSideOffset2};
	            platepar.roundHoles.push({ center:center, rad: 3 });
	            var center = {x:platepar.width-centerSideOffset1, y:width - sections[i].pos - carcasThk_wr - centerSideOffset2};
	            platepar.roundHoles.push({ center:center, rad: 3 });
			}
			else if(heightLeft == heightRight){
				var center = {x:centerSideOffset1, y:platepar.height - (sections[i].pos - carcasThk_wr + centerSideOffset2)};
	            platepar.roundHoles.push({ center:center, rad: 3 });
	            var center = {x:platepar.width-centerSideOffset1, y:platepar.height - (sections[i].pos - carcasThk_wr + centerSideOffset2)};
	            platepar.roundHoles.push({ center:center, rad: 3 });
			}
	    }  
	
		platepar = drawPlate_wr(platepar);
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
		if(heightLeft == heightRight) plate.position.x = width - carcasThk_wr;
		else plate.position.z = carcasThk_wr - beamSlotsDepth;
	    dxfBasePoint = newPoint_xy(dxfBasePoint, depth + 500, 0);
		

		wrCarcas.add(plate);
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

		platepar.heightLeft = heightLeft;
		platepar.heightRight = heightRight;
		platepar.width = width;
		platepar.topNotch = topPlateLength2 + carcasThk_wr;
		platepar.type = "";
		platepar.doorGap = doorGap;
		
		platepar = drawDoor(platepar);
		
		var plate = platepar.mesh;
		plate.position.z -= platepar.doorsThk;
		
		wrCarcas.add(plate);  
		
	//перегородки секций (слева направо)
    
    dxfBasePoint = newPoint_xy(dxfBasePoint, 0, -Math.max(heightLeft, heightRight) - 500);
	
	var platepar={
		height: 0,
		width: depth,
		thk: carcasThk_wr,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: dxfBasePoint,
		text: "перегородка секции 1",
		material: timberMaterial,
	}
    platepar.centerFaceOffset = 40;
	platepar.hasFace2Holes = true;
	platepar.hasFace1Holes = true;
	
	for(var i=1; i<sectAmt; i++ ){
		platepar.text = "перегородка секции " + i;
		platepar.roundHoles = plateSlots[i] || [];
	    if(boxSlots[i])Array.prototype.push.apply(platepar.roundHoles,boxSlots[i]);
    	if(slideSlots[i])Array.prototype.push.apply(platepar.roundHoles,slideSlots[i]);
	    if(slideSlots[i] && slideSlots[i][0].isMirror) platepar.text += " (зеркально)";
		platepar.height = sections[i].heightPlate;
		platepar = drawPlate_wr(platepar);
		var plate = platepar.mesh;
		plate.rotation.y = - Math.PI /2;
		plate.position.x = sections[i].pos + carcasThk_wr;
		plate.position.y = carcasThk_wr;
		dxfBasePoint = newPoint_xy(dxfBasePoint, depth + 500, 0);
		platepar.dxfBasePoint = dxfBasePoint;
		wrCarcas.add(plate);
	}

//	console.log(topOnlay)
	if(heightLeft != heightRight){
		if(topOnlay == "есть"){
		//верхняя накладка
	    var topOnlayPar = {
			angleTop: angleTop,
		    heightLeft: heightLeft,
		    heightRight: heightRight,
		    topParams: topParams,
		    dxfBasePoint: dxfBasePoint,
		    topPlateLength2: topPlateLength2,
		    dxfArr: dxfPrimitivesArr,
		    thk: carcasThk_wr,
			width_wr: par.width_wr,
			heightLeft: heightLeft,
			heightRight: heightRight,
		    material: metalMaterial,
		    text: "верхняя накладка" 
	    }
	
	    topOnlayPar = drawTopOnlay(topOnlayPar);
	    var topOnlay = topOnlayPar.mesh;
	    if(sideFactor == 1) {
		    topOnlay.position.x = 0;
		    topOnlay.position.y = heightLeft - (topParams.beamWidth-topParams.topOffset) + topParams.doorOnlay + topParams.doorGap;
		    topOnlay.position.z = depth;
	    }
	    else{
	        topOnlay.rotation.y = Math.PI;
	        topOnlay.position.x = width;
	        topOnlay.position.y = heightRight - topOnlayWidth/2;
	        topOnlay.position.z = depth + carcasThk_wr;
	    }
		if(params.topOnlay_wr != "нет") wrDoors.add(topOnlay);
		
		dxfBasePoint = newPoint_xy(dxfBasePoint, 0, -Math.max(heightLeft, heightRight) - 500);
		}
		
		//угловой добор
		if(params.sideOnlay_wr == "есть"){
			var sideOnlayPar = {
				topParams: topParams,
				angleTop: angleTop,
		        dxfArr: dxfPrimitivesArr,
		        dxfBasePoint: dxfBasePoint,
		        thk: carcasThk_wr,
				width_wr: par.width_wr,
				heightLeft: heightLeft,
				heightRight: heightRight,
		        material: metalMaterial,
				text: "угловой добор"
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
			
			dxfBasePoint = newPoint_xy(dxfBasePoint, 0, -Math.max(heightLeft, heightRight) - 500);
		}

	    //несущая балка
	    var beamPar = {
		    angleTop: angleTop,
		    heightLeft: heightLeft,
		    heightRight: heightRight,
		    topParams: topParams,
		    dxfBasePoint: dxfBasePoint,
		    topPlateLength2: topPlateLength2,
			width_wr: par.width_wr,
			text: "несущая балка наружная",
		    sections: sections,
		    sectAmt: sectAmt,
		    sideFactor: sideFactor,
		    dxfArr: dxfPrimitivesArr,
		    thk: carcasThk_wr - beamSlotsDepth,
		    material: timberMaterial2
    	}
        beamPar.centerFaceOffset = 40;
	
	    //передняя сторона
		//наружная
	    beam = drawBeam(beamPar);
	    var beam = beamPar.mesh;
	    if(sideFactor == 1) {
		    beam.position.x = params.carcasThk_wr;
		    beam.position.y = heightLeft - (topParams.beamWidth-topParams.topOffset);
		    beam.position.z = depth - (carcasThk_wr - beamSlotsDepth);
	    }
	    else{
	        beam.rotation.y = Math.PI;
	        beam.position.x = width - params.carcasThk_wr;
	        beam.position.y = heightRight - (topParams.beamWidth-topParams.topOffset);
	        beam.position.z = depth;
	    }
        wrCarcas1.add(beam);
		
		//внутренняя
		dxfBasePoint = newPoint_xy(dxfBasePoint, 0, -Math.max(heightLeft, heightRight) - 500);
		beamPar.dxfBasePoint = dxfBasePoint;
		beamPar.text = "несущая балка внутренняя";
		beamPar.hasSlots = true;
		beamPar.thk = beamSlotsDepth;
	    beam = drawBeam(beamPar);
	    var beam = beamPar.mesh;
	    if(sideFactor == 1) {
		    beam.position.x = params.carcasThk_wr;
		    beam.position.y = heightLeft - (topParams.beamWidth-topParams.topOffset);
		    beam.position.z = depth - carcasThk_wr;
	    }
	    else{
	        beam.rotation.y = Math.PI;
	        beam.position.x = width - params.carcasThk_wr;
	        beam.position.y = heightRight - (topParams.beamWidth-topParams.topOffset);
	        beam.position.z = depth - (carcasThk_wr - beamSlotsDepth);
	    }
        wrCarcas2.add(beam);

	    //задняя сторона
		//наружная
		beamPar.dxfArr = [];
		beamPar.hasSlots = false;
		beamPar.thk = carcasThk_wr - beamSlotsDepth;
	    beam = drawBeam(beamPar);
	    var beam = beamPar.mesh;
	    if(sideFactor == 1) {
		    beam.position.x = params.carcasThk_wr;
		    beam.position.y = heightLeft - (topParams.beamWidth-topParams.topOffset);
		    beam.position.z = 0;
	    }
	    else{
	        beam.rotation.y = Math.PI;
	        beam.position.x = width - params.carcasThk_wr;
	        beam.position.y = heightRight - (topParams.beamWidth-topParams.topOffset);
	        beam.position.z = carcasThk_wr - beamSlotsDepth;
	    }
        wrCarcas1.add(beam);
			
		//внутренняя
		beamPar.hasSlots = true;
		beamPar.thk = beamSlotsDepth;
	    beam = drawBeam(beamPar);
	    var beam = beamPar.mesh;
	    if(sideFactor == 1) {
		    beam.position.x = params.carcasThk_wr;
		    beam.position.y = heightLeft - (topParams.beamWidth-topParams.topOffset);
		    beam.position.z = carcasThk_wr - beamSlotsDepth;
	    }
	    else{
	        beam.rotation.y = Math.PI;
	        beam.position.x = width - params.carcasThk_wr;
	        beam.position.y = heightRight - (topParams.beamWidth-topParams.topOffset);
	        beam.position.z = carcasThk_wr;
	    }
        wrCarcas2.add(beam);
	}
	
	
	function drawLegs(){}; //пустая функция для навигации
	var legSideOffset = 20;
	var legsPar = {
		type: "round",
		size: 50,
		height: par.legsHeight,
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
	

	par.wrCarcas1 = wrCarcas1;
	par.wrCarcas2 = wrCarcas2;
	par.wrCarcas = wrCarcas;
	par.wrDoors = wrDoors;
	par.wrShelfs = wrShelfs;
	par.wrMetis = wrMetis;
	
	par.mesh = new THREE.Object3D();
	par.mesh.add(wrCarcas1)
	par.mesh.add(wrCarcas2)
	par.mesh.add(wrCarcas)
	par.mesh.add(wrDoors)
	par.mesh.add(wrShelfs)
	par.mesh.add(wrMetis)
//debugger	
	return par;

}//drawWardrobe;

function drawPlate_wr(par){

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
		var doneHoles = []; //вспомогательный массив для защиты от дублирования отверстий
	    if(par.roundHoles){
		    for(var i=0; i<par.roundHoles.length; i++){
				//проверяем уникальность отверстия
				var isNewHole = true;
				for(var j=0; j<doneHoles.length; j++){
					if(doneHoles[j].x == par.roundHoles[i].center.x && doneHoles[j].y == par.roundHoles[i].center.y)
					isNewHole = false;
					}
				if(isNewHole){
					addRoundHole(shape, par.dxfArr, par.roundHoles[i].center, par.roundHoles[i].rad, par.dxfBasePoint);
					doneHoles.push(par.roundHoles[i].center);
					}
			    if(par.roundHoles[i].isForBox){
		        	var boxHoleRadius = 20;
					var trashShape = new THREE.Shape();
					
					
					//кружочек
					if(par.roundHoles[i].isBottom){
					    addRoundHole(trashShape, par.dxfArr, par.roundHoles[i].center, boxHoleRadius, par.dxfBasePoint);
					}
					
					//крестик
					if(par.roundHoles[i].isTop){
					    var pH1 = {x:par.roundHoles[i].center.x - boxHoleRadius, y: par.roundHoles[i].center.y + boxHoleRadius};
					    var pH2 = {x:par.roundHoles[i].center.x + boxHoleRadius, y: par.roundHoles[i].center.y - boxHoleRadius};
					    var pH3 = {x:par.roundHoles[i].center.x + boxHoleRadius, y: par.roundHoles[i].center.y + boxHoleRadius};
					    var pH4 = {x:par.roundHoles[i].center.x - boxHoleRadius, y: par.roundHoles[i].center.y - boxHoleRadius};
					
	                    addLine(trashShape, par.dxfArr, pH1, pH2, par.dxfBasePoint);
	                    addLine(trashShape, par.dxfArr, pH3, pH4, par.dxfBasePoint);
					}
			    }
		    }
	    }
		
		if(par.hasSideHoles){
			var trashShape = new THREE.Shape();
			var p5 = {x: -5, y: par.centerSideOffset};
		    var p6 = {x: 45, y: par.centerSideOffset};
		    var p7 = {x: -5, y: par.height-par.centerSideOffset};
		    var p8 = {x: 45, y: par.height-par.centerSideOffset};
			
			var p9 = {x: par.width-45, y: par.centerSideOffset};
		    var p10 = {x: par.width+5, y: par.centerSideOffset};
		    var p11 = {x: par.width-45, y: par.height-par.centerSideOffset};
		    var p12 = {x: par.width+5, y: par.height-par.centerSideOffset};
			
	        addLine(trashShape, par.dxfArr, p5, p6, par.dxfBasePoint);
	        addLine(trashShape, par.dxfArr, p7, p8, par.dxfBasePoint);
	        addLine(trashShape, par.dxfArr, p9, p10, par.dxfBasePoint);
	        addLine(trashShape, par.dxfArr, p11, p12, par.dxfBasePoint);
		}
		
		if(par.hasForBoxBottomPlateSlot){
			var trashShape = new THREE.Shape();
			var p5 = {x: 0, y: par.bottomPlateYOffset};
		    var p6 = {x: par.width, y: par.bottomPlateYOffset};
		    var p7 = {x: 0, y: par.bottomPlateThk + par.bottomPlateYOffset};
		    var p8 = {x: par.width, y: par.bottomPlateThk + par.bottomPlateYOffset};

	        addLine(trashShape, par.dxfArr, p5, p6, par.dxfBasePoint);
	        addLine(trashShape, par.dxfArr, p7, p8, par.dxfBasePoint);
		}

		if(par.hasFace1Holes){
			var trashShape = new THREE.Shape();
			var p5 = {x: par.centerFaceOffset, y: -5};
		    var p6 = {x: par.centerFaceOffset, y: 45};
			var p7 = {x: par.width - par.centerFaceOffset, y: -5};
		    var p8 = {x: par.width - par.centerFaceOffset, y: 45};
			
	        addLine(trashShape, par.dxfArr, p5, p6, par.dxfBasePoint);
	        addLine(trashShape, par.dxfArr, p7, p8, par.dxfBasePoint);
		}
			
		if(par.hasFace2Holes){
			var trashShape = new THREE.Shape();
			var p5 = {x: par.centerFaceOffset, y: par.height+5};
		    var p6 = {x: par.centerFaceOffset, y: par.height-45};
			var p7 = {x: par.width - par.centerFaceOffset, y: par.height+5};
		    var p8 = {x: par.width - par.centerFaceOffset, y: par.height-45};
			
	        addLine(trashShape, par.dxfArr, p5, p6, par.dxfBasePoint);
	        addLine(trashShape, par.dxfArr, p7, p8, par.dxfBasePoint);
		}
		
	    var treadExtrudeOptions = {
		    amount: par.thk, 
		    bevelEnabled: false,
		    curveSegments: 12,
		    steps: 1
	    };
		
	    var geom = new THREE.ExtrudeGeometry(shape, treadExtrudeOptions);
	    geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	    par.mesh = new THREE.Mesh(geom, par.material);
	

	//подпись
	var textHeight = 17;
	var textBasePoint = newPoint_xy(par.dxfBasePoint, 20, -150);
	addText(par.text, textHeight,  par.dxfArr, textBasePoint);
	
	return par;
}//end of drawPlate_wr

function drawBox(par){
	
	par.mesh = new THREE.Object3D();
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
	
	platepar = drawPlate_wr(platepar);
	var plate = platepar.mesh;
	plate.rotation.x =  Math.PI /2;
	plate.rotation.z =  Math.PI /2;
	plate.position.x = par.width;
	plate.position.y = par.thk;
	par.mesh.add(plate);
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
	  
	platepar = drawPlate_wr(platepar);
	var plate = platepar.mesh;
	plate.rotation.x =  Math.PI /2;
	plate.rotation.z =  Math.PI /2;
	plate.position.x = par.thk;
	plate.position.y = par.height;
	
	par.mesh.add(plate);  
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
}
else if(par.type.indexOf("шкаф") != -1){
	if(par.hasBotPlate != false){
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
	
	platepar = drawPlate_wr(platepar);
	var plate = platepar.mesh;
	plate.rotation.x =  Math.PI /2;
	plate.rotation.z =  Math.PI /2;
	plate.position.x = par.width;
	plate.position.y = par.thk;
	par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, Math.max(platepar.height, platepar.width) + 100, 0);
	
	par.mesh.add(plate);
	}
	
	if(par.hasTopPlate != false){
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
	
	platepar = drawPlate_wr(platepar);
	var plate = platepar.mesh;
	plate.rotation.x =  Math.PI /2;
	plate.rotation.z =  Math.PI /2;
	plate.position.x = par.width;
	plate.position.y = par.height;
	par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, Math.max(platepar.height, platepar.width) + 100, 0);
	
	par.mesh.add(plate);
	}
}
else if(par.type == "ящик" || par.type == "ящик верхний"){
	par.bottomPlateSlotDepth = 5;
	par.bottomPlateYOffset = 10;
	par.bottomPlateThk = 4;
	par.frontPlateHoles = [
	    {
			center:{x: 20, y: par.boxCarcasHeight - 30}, 
			rad: 3
		},
	    {
			center:{x: par.width - 2*par.sideOffset - 2*par.thk - 20, y: par.boxCarcasHeight - 30}, 
			rad: 3
		},
	    {
			center:{x: (par.width - 2*par.sideOffset - 2*par.thk)/2, y: 40}, 
			rad: 3
		},
	];
	par.facadePlateHoles = [
	    {
			center:{x: par.thk + par.sideOffset + par.boxDoorPlusLeft + 20, y: par.boxCarcasHeight - 30 + par.boxDoorPlusBot + par.boxYOffset}, 
			rad: 1.5
		},
	    {
			center:{x: par.width - par.sideOffset + par.boxDoorPlusLeft - par.thk - 20, y: par.boxCarcasHeight - 30 + par.boxDoorPlusBot + par.boxYOffset}, 
			rad: 1.5
		},
	    {
			center:{x: (par.width - 2*par.sideOffset - 2*par.thk)/2 + par.thk + par.sideOffset + par.boxDoorPlusLeft, y: 40 + par.boxDoorPlusBot + par.boxYOffset}, 
			rad: 1.5
		},
	];
	
	var additionY = 0;
	if(par.sideFactor == 1 && par.type == "ящик верхний" && par.heightRight != par.heightLeft) {
	    additionY = (par.width - 2*par.thk - 2*par.sideOffset) * Math.tan(par.angleTop);
	}
	var holeOffset = 30;
	par.sidePlateHoles = [
	    {
			center:{x: par.thk/2, y: par.boxCarcasHeight - holeOffset + additionY}, 
			rad: 2.5
		},
	    {
			center:{x: par.depth - par.doorsThk - par.boxDoorPlusIn - par.thk/2, y: par.boxCarcasHeight - holeOffset + additionY}, 
			rad: 2.5
		},
	    {
			center:{x: par.depth - par.doorsThk - par.boxDoorPlusIn - par.thk/2, y: holeOffset}, 
			rad: 2.5
		},
	    {
			center:{x: par.thk/2, y: holeOffset}, 
			rad: 2.5
		},
	];
	//левая панель
	var platepar={
		height: par.boxCarcasHeight,
		width: par.depth - par.doorsThk - par.boxDoorPlusIn,
		thk: par.thk,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		text: "левая панель ящика (зеркально)",
		material: par.shelfMaterial,
		roundHoles: par.sidePlateHoles,
		hasForBoxBottomPlateSlot: true,
		bottomPlateThk: par.bottomPlateThk,
		bottomPlateYOffset: par.bottomPlateYOffset
	}
	if(par.sideFactor == 1 && par.type == "ящик верхний" && par.heightRight != par.heightLeft) {
		platepar.height+=(par.width - 2*par.thk - 2*par.sideOffset) * Math.tan(par.angleTop);
	}
	
	for(var i = 0; i < par.slideParams.boxHoles.length; ++i){
		platepar.roundHoles.push({
			center:{x: platepar.width - par.slideParams.boxHoles[i] - par.slideParams.startOffset, y: par.boxCarcasHeight/2}, 
			rad: 1.5
		});
	}

	platepar = drawPlate_wr(platepar);
	var plate = platepar.mesh;
	plate.rotation.y = -Math.PI /2;
	plate.position.x = par.thk + par.sideOffset;
	plate.position.y = par.boxYOffset;
	plate.position.z = 0;
	par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, Math.max(platepar.height, platepar.width) + 100, 0);
	
	par.mesh.add(plate);
	if(par.isDoorsOpened) {
		plate.position.z += par.slideParams.slideLen;
	}
	
	//правая панель
	var platepar={
		height: par.boxCarcasHeight,
		width: par.depth - par.doorsThk - par.boxDoorPlusIn,
		thk: par.thk,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		text: "правая панель ящика",
		material: par.shelfMaterial,
		roundHoles: par.sidePlateHoles,
		hasForBoxBottomPlateSlot: true,
		bottomPlateThk: par.bottomPlateThk,
		bottomPlateYOffset: par.bottomPlateYOffset
	}
	
	if(par.sideFactor == 1 && par.type == "ящик верхний" && par.heightRight != par.heightLeft) {
	    par.sidePlateHoles[0].center.y -= additionY;
	    par.sidePlateHoles[1].center.y -= additionY;
	}
	if(par.sideFactor == -1 && par.type == "ящик верхний" && par.heightRight != par.heightLeft) {
		var additionY = (par.width - 2*par.thk - 2*par.sideOffset) * Math.tan(par.angleTop);
		par.sidePlateHoles[0].center.y += additionY;
		par.sidePlateHoles[1].center.y += additionY;
		platepar.height+=(par.width - 2*par.thk - 2*par.sideOffset) * Math.tan(par.angleTop);
	}
	platepar.roundHoles = par.sidePlateHoles;
	
	platepar = drawPlate_wr(platepar);
	var plate = platepar.mesh;
	plate.rotation.y = - Math.PI /2;
	plate.position.x = par.width - par.sideOffset;
	plate.position.y = par.boxYOffset;
	plate.position.z = 0;
	par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, Math.max(platepar.height, platepar.width) + 100, 0);
	
	par.mesh.add(plate);
	if(par.isDoorsOpened) {
		plate.position.z += par.slideParams.slideLen;
	}
		
	//нижняя панель ящика
	var platepar={
		height: par.width - 2*par.thk - 2*par.sideOffset + 2*par.bottomPlateSlotDepth,
		width: par.depth - par.doorsThk - par.boxDoorPlusIn - 2*par.thk + 2*par.bottomPlateSlotDepth,
		thk: par.bottomPlateThk,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		text: "нижняя панель ящика",
		material: par.shelfMaterial,
	}

	platepar = drawPlate_wr(platepar);
	var plate = platepar.mesh;
	plate.rotation.x = Math.PI /2;
	plate.rotation.z = Math.PI /2;
	plate.position.x = platepar.height + par.thk + par.sideOffset - par.bottomPlateSlotDepth;
	plate.position.y = par.bottomPlateThk + par.boxYOffset + par.bottomPlateYOffset;
	plate.position.z = par.thk - par.bottomPlateSlotDepth;
	par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, Math.max(platepar.height, platepar.width) + 100, 0);
	
	par.mesh.add(plate);
	if(par.isDoorsOpened) {
		plate.position.z += par.slideParams.slideLen;
	}
	
	//задняя панель
	if(par.heightRight == par.heightLeft){
	    var platepar={
		    height: par.boxCarcasHeight,
		    width: par.width - 2*par.sideOffset - 2*par.thk,
		    thk: par.thk,
		    dxfArr: par.dxfArr,
		    dxfBasePoint: par.dxfBasePoint,
		    text: "задняя панель",
		    material: par.shelfMaterial,
		    centerSideOffset: 20,
		    hasSideHoles: true,
		    hasForBoxBottomPlateSlot: true,
		    bottomPlateThk: par.bottomPlateThk,
		    bottomPlateYOffset: par.bottomPlateYOffset
	    }

	    platepar = drawPlate_wr(platepar);
	    var plate = platepar.mesh;
	    plate.position.x = par.sideOffset + par.thk;
	    plate.position.y = par.boxYOffset;
	    plate.position.z = 0;

	    par.mesh.add(plate);
	    if(par.isDoorsOpened) {
	    	plate.position.z += par.slideParams.slideLen;
	    }
	}
	else{
		var p0 = {x: 0, y: 0};
		var p1 = copyPoint(p0); 
		var p2 = newPoint_xy(p1, 0, par.boxCarcasHeight);
		if(par.sideFactor == 1) {
		    p2.y+=(par.width - 2*par.thk - 2*par.sideOffset) * Math.tan(par.angleTop);
	    }
		var p4 = newPoint_xy(p1, par.width - 2*par.thk - 2*par.sideOffset, par.boxCarcasHeight);
		if(par.sideFactor == -1) {
		    p4.y+=(par.width - 2*par.thk - 2*par.sideOffset) * Math.tan(par.angleTop);
	    }
		var p5 = newPoint_xy(p1, par.width - 2*par.thk - 2*par.sideOffset, 0);
	
		var shape = new THREE.Shape();
  
		addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p2, p4, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p4, p5, par.dxfBasePoint);		
		addLine(shape, par.dxfArr, p5, p1, par.dxfBasePoint);
		
		var trashShape = new THREE.Shape();
		var p5 = {x: 0, y: par.bottomPlateYOffset};
		var p6 = {x: par.width - 2*par.thk - 2*par.sideOffset, y: par.bottomPlateYOffset};
		var p7 = {x: 0, y: par.bottomPlateThk + par.bottomPlateYOffset};
		var p8 = {x: par.width - 2*par.thk - 2*par.sideOffset, y: par.bottomPlateThk + par.bottomPlateYOffset};

	    addLine(trashShape, par.dxfArr, p5, p6, par.dxfBasePoint);
	    addLine(trashShape, par.dxfArr, p7, p8, par.dxfBasePoint);
		
		var trashShape = new THREE.Shape();
		var p5 = {x: -5, y: 20};
	    var p6 = {x: 45, y: 20};
	    var p7 = {x: -5, y: par.boxCarcasHeight-20};
		if(par.sideFactor == 1) {
		    p7.y+=(par.width - 2*par.thk - 2*par.sideOffset) * Math.tan(par.angleTop);
	    }
	    var p8 = {x: 45, y: par.boxCarcasHeight-20};
		if(par.sideFactor == 1) {  
		    p8.y+=(par.width - 2*par.thk - 2*par.sideOffset) * Math.tan(par.angleTop);
	    }
			
		var p9 = {x: par.width - 2*par.thk - 2*par.sideOffset-45, y: 20};
	    var p10 = {x: par.width - 2*par.thk - 2*par.sideOffset+5, y: 20};
	    var p11 = {x: par.width - 2*par.thk - 2*par.sideOffset-45, y: par.boxCarcasHeight-20};
		if(par.sideFactor == -1) {
		    p11.y+=(par.width - 2*par.thk - 2*par.sideOffset) * Math.tan(par.angleTop);
	    }
	    var p12 = {x: par.width - 2*par.thk - 2*par.sideOffset+5, y: par.boxCarcasHeight-20};
		if(par.sideFactor == -1) {
		    p12.y+=(par.width - 2*par.thk - 2*par.sideOffset) * Math.tan(par.angleTop);
	    }
			
	    addLine(trashShape, par.dxfArr, p5, p6, par.dxfBasePoint);
	    addLine(trashShape, par.dxfArr, p7, p8, par.dxfBasePoint);
	    addLine(trashShape, par.dxfArr, p9, p10, par.dxfBasePoint);
	    addLine(trashShape, par.dxfArr, p11, p12, par.dxfBasePoint);
		  
		var treadExtrudeOptions = { 
			amount: par.doorsThk, 
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};
			
		var geom = new THREE.ExtrudeGeometry(shape, treadExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var plate = new THREE.Mesh(geom, par.shelfMaterial);
		
	    plate.position.x = par.thk + par.sideOffset;
	    plate.position.z = 0;
	    plate.position.y = par.boxYOffset;
	    if(par.isDoorsOpened) {
		    plate.position.z += par.slideParams.slideLen;
	    }
		//подпись
     	var textHeight = 30;
	    var textBasePoint = newPoint_xy(par.dxfBasePoint, 20, -150);
    	addText("задняя панель", textHeight,  par.dxfArr, textBasePoint);
	    par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, Math.max(platepar.height, platepar.width) + 100, 0);
		
	    par.mesh.add(plate);
	}
	par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, Math.max(platepar.height, platepar.width) + 100, 0);
	
	//передняя панель
	if(par.heightRight == par.heightLeft){
	    var platepar={
		    height: par.boxCarcasHeight,
		    width: par.width - 2*par.sideOffset - 2*par.thk,
		    thk: par.thk,
		    dxfArr: par.dxfArr,
		    dxfBasePoint: par.dxfBasePoint,
		    text: "передняя панель",
		    material: par.shelfMaterial,
		    roundHoles: par.frontPlateHoles,
		    centerSideOffset: 20,
		    hasSideHoles: true,
		    hasForBoxBottomPlateSlot: true,
		    bottomPlateThk: par.bottomPlateThk,
		    bottomPlateYOffset: par.bottomPlateYOffset
	    }
    
	    platepar = drawPlate_wr(platepar);
	    var plate = platepar.mesh;
	    plate.position.x = par.sideOffset + par.thk;
	    plate.position.y = par.boxYOffset;
	    plate.position.z = par.depth - par.doorsThk - par.boxDoorPlusIn - par.thk;

	    par.mesh.add(plate);
	    if(par.isDoorsOpened) {
		    plate.position.z += par.slideParams.slideLen;
	    }
	}
	else{
		var p0 = {x: 0, y: 0};
		var p1 = copyPoint(p0); 
		var p2 = newPoint_xy(p1, 0, par.boxCarcasHeight);
		if(par.sideFactor == 1) {
		    p2.y+=(par.width - 2*par.thk - 2*par.sideOffset) * Math.tan(par.angleTop);
	    }
		var p4 = newPoint_xy(p1, par.width - 2*par.thk - 2*par.sideOffset, par.boxCarcasHeight);
		if(par.sideFactor == -1) {
		    p4.y+=(par.width - 2*par.thk - 2*par.sideOffset) * Math.tan(par.angleTop);
	    }
		var p5 = newPoint_xy(p1, par.width - 2*par.thk - 2*par.sideOffset, 0);
	
		var shape = new THREE.Shape();
  
		addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p2, p4, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p4, p5, par.dxfBasePoint);		
		addLine(shape, par.dxfArr, p5, p1, par.dxfBasePoint);
		
		var trashShape = new THREE.Shape();
		var p5 = {x: 0, y: par.bottomPlateYOffset};
		var p6 = {x: par.width - 2*par.thk - 2*par.sideOffset, y: par.bottomPlateYOffset};
		var p7 = {x: 0, y: par.bottomPlateThk + par.bottomPlateYOffset};
		var p8 = {x: par.width - 2*par.thk - 2*par.sideOffset, y: par.bottomPlateThk + par.bottomPlateYOffset};

	    addLine(trashShape, par.dxfArr, p5, p6, par.dxfBasePoint);
	    addLine(trashShape, par.dxfArr, p7, p8, par.dxfBasePoint);
		
		var trashShape = new THREE.Shape();
		var p5 = {x: -5, y: 20};
	    var p6 = {x: 45, y: 20};
	    var p7 = {x: -5, y: par.boxCarcasHeight-20};
		if(par.sideFactor == 1) {
		    p7.y+=(par.width - 2*par.thk - 2*par.sideOffset) * Math.tan(par.angleTop);
	    }
	    var p8 = {x: 45, y: par.boxCarcasHeight-20};
		if(par.sideFactor == 1) {
		    p8.y+=(par.width - 2*par.thk - 2*par.sideOffset) * Math.tan(par.angleTop);
	    }
			
		var p9 = {x: par.width - 2*par.thk - 2*par.sideOffset-45, y: 20};
	    var p10 = {x: par.width - 2*par.thk - 2*par.sideOffset+5, y: 20};
	    var p11 = {x: par.width - 2*par.thk - 2*par.sideOffset-45, y: par.boxCarcasHeight-20};
		if(par.sideFactor == -1) {
		    p11.y+=(par.width - 2*par.thk - 2*par.sideOffset) * Math.tan(par.angleTop);
	    }
	    var p12 = {x: par.width - 2*par.thk - 2*par.sideOffset+5, y: par.boxCarcasHeight-20};
		if(par.sideFactor == -1) {
		    p12.y+=(par.width - 2*par.thk - 2*par.sideOffset) * Math.tan(par.angleTop);
	    }
			
	    addLine(trashShape, par.dxfArr, p5, p6, par.dxfBasePoint);
	    addLine(trashShape, par.dxfArr, p7, p8, par.dxfBasePoint);
	    addLine(trashShape, par.dxfArr, p9, p10, par.dxfBasePoint);
	    addLine(trashShape, par.dxfArr, p11, p12, par.dxfBasePoint); 
		
		for(var i=0; i<par.frontPlateHoles.length; i++){
			addRoundHole(shape, par.dxfArr, par.frontPlateHoles[i].center, par.frontPlateHoles[i].rad, par.dxfBasePoint);
		}
		
		if(par.sideFactor == 1){
		    addRoundHole(shape, par.dxfArr, { x: 20, y: par.boxCarcasHeight + (par.width - 2*par.thk - 2*par.sideOffset) * Math.tan(par.angleTop) - 30 - (par.thk + par.sideOffset + par.boxDoorPlusLeft + 20) * Math.tan(par.angleTop) - par.boxYOffset }, par.frontPlateHoles[0].rad, par.dxfBasePoint);
		}
		else if(par.sideFactor == -1){
			addRoundHole(shape, par.dxfArr, { x: p4.x - 20, y: par.boxCarcasHeight + (par.width - 2*par.thk - 2*par.sideOffset) * Math.tan(par.angleTop) - 30 - (par.thk + par.sideOffset + par.boxDoorPlusLeft + 20) * Math.tan(par.angleTop) - par.boxYOffset }, par.frontPlateHoles[0].rad, par.dxfBasePoint);
		}
		  
		var treadExtrudeOptions = { 
			amount: par.doorsThk, 
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};
			
		var geom = new THREE.ExtrudeGeometry(shape, treadExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var plate = new THREE.Mesh(geom, par.shelfMaterial);
		
	    plate.position.x = par.thk + par.sideOffset;
	    plate.position.z = par.depth-par.doorsThk-par.thk - par.boxDoorPlusIn;
	    plate.position.y = par.boxYOffset;
	    if(par.isDoorsOpened) {
		    plate.position.z += par.slideParams.slideLen;
	    }
		//подпись
     	var textHeight = 30;
	    var textBasePoint = newPoint_xy(par.dxfBasePoint, 20, -150);
    	addText("передняя панель", textHeight,  par.dxfArr, textBasePoint);
	    par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, Math.max(platepar.height, platepar.width) + 100, 0);
		
	    par.mesh.add(plate);
	}
	par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, Math.max(platepar.height, platepar.width) + 100, 0);
	
	//фасад
	if(par.type == "ящик"){
	    var platepar={
		    height: par.height + par.boxDoorPlusTop+par.boxDoorPlusBot,
		    width: par.width + par.boxDoorPlusRight+par.boxDoorPlusLeft,
		    thk: par.doorsThk,
		    dxfArr: par.dxfArr,
		    dxfBasePoint: par.dxfBasePoint,
		    text: "фасад ящика",
		    material: par.doorMaterial,
		    roundHoles: par.facadePlateHoles
		}

	    platepar = drawPlate_wr(platepar);
	    var plate = platepar.mesh; 
	    plate.position.x = -par.boxDoorPlusLeft;
	    plate.position.z = par.depth - par.doorsThk - par.boxDoorPlusIn;
	    plate.position.y = -par.boxDoorPlusBot;
	    par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, Math.max(platepar.height, platepar.width) + 100, 0);
	
	    par.mesh.add(plate);
	}
	else {
		var topOffset = par.doorTopOffset;
			
		var p0 = {x: -par.boxDoorPlusLeft, y: 0};
		var p1 = copyPoint(p0); 
		
		var p2 = newPoint_xy(p1, 0, par.heightLeft);
		if(par.sideFactor == 1 && par.topNotch == 0 && par.heightRight != par.heightLeft){
			p2.y += par.boxDoorPlusLeft * Math.tan(par.angleTop);
		}
		else if(par.sideFactor == -1 && par.heightRight != par.heightLeft){
			p2.y += -par.boxDoorPlusLeft * Math.tan(par.angleTop);
		}
			
		if(par.heightRight == par.heightLeft || (par.sideFactor == 1 && par.topNotch != 0)){
			p2.y -= topOffset - par.thk;
			p2.y += par.boxDoorPlusTop+par.boxDoorPlusBot;
		}
		else{
			p2.y -= (topOffset - par.thk)/Math.cos(par.angleTop);
			p2.y += par.boxDoorPlusTop+par.boxDoorPlusBot;
		}
		
		if(par.topNotch != 0 && par.sideFactor == 1){
			var p3 = newPoint_xy(p2, par.topNotch - (topOffset - par.thk)*Math.tan(par.angleTop/2)+par.boxDoorPlusLeft, 0);
		} 
		else if(par.topNotch != 0 && par.sideFactor == -1){
			var p3 = newPoint_xy(p1, par.width - par.topNotch + (topOffset - par.thk)*Math.tan(par.angleTop/2)+par.boxDoorPlusLeft, par.heightRight - (topOffset - par.thk));
			p3.y += par.boxDoorPlusTop+par.boxDoorPlusBot;
		}
		
		var p4 = newPoint_xy(p1, par.width+par.boxDoorPlusRight+par.boxDoorPlusLeft, par.heightRight);
		if(par.sideFactor == 1 && par.heightRight != par.heightLeft){
			p4.y += -par.boxDoorPlusRight * Math.tan(par.angleTop);
		}
		else if(par.sideFactor == -1 && par.topNotch == 0 && par.heightRight != par.heightLeft){
			p4.y += par.boxDoorPlusRight * Math.tan(par.angleTop);
		}
		
		if(par.heightRight == par.heightLeft || (par.sideFactor == -1 && par.topNotch != 0)){
			p4.y -= topOffset - par.thk;
			p4.y += par.boxDoorPlusTop+par.boxDoorPlusBot;
		}
		else{
			p4.y -= (topOffset - par.thk)/Math.cos(par.angleTop);
			p4.y += par.boxDoorPlusTop+par.boxDoorPlusBot;
		}

		var p5 = newPoint_xy(p1, par.width+par.boxDoorPlusRight+par.boxDoorPlusLeft, 0);
		   
 
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
		
		for(var i=0; i<par.facadePlateHoles.length; i++){
			par.facadePlateHoles[i].center.x -= par.boxDoorPlusLeft;
			addRoundHole(shape, par.dxfArr, par.facadePlateHoles[i].center, par.facadePlateHoles[i].rad, par.dxfBasePoint);
		}
		
		if(par.heightLeft != par.heightRight){
		    if(par.sideFactor == 1){
		        addRoundHole(shape, par.dxfArr, { x: par.thk + par.sideOffset + 20, y: par.boxCarcasHeight + (par.width - 2*par.thk - 2*par.sideOffset) * Math.tan(par.angleTop) - 30 - (par.thk + par.sideOffset + par.boxDoorPlusLeft + 20) * Math.tan(par.angleTop) + par.boxDoorPlusBot }, par.facadePlateHoles[0].rad, par.dxfBasePoint);
		    }
		    else if(par.sideFactor == -1){
			    addRoundHole(shape, par.dxfArr, { x: p4.x - (par.thk + par.sideOffset + 20), y: par.boxCarcasHeight + (par.width - 2*par.thk - 2*par.sideOffset) * Math.tan(par.angleTop) - 30 - (par.thk + par.sideOffset + par.boxDoorPlusLeft + 20) * Math.tan(par.angleTop) + par.boxDoorPlusBot }, par.facadePlateHoles[0].rad, par.dxfBasePoint);
		    }
		}
		  
		var treadExtrudeOptions = { 
			amount: par.doorsThk, 
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};
			
		var geom = new THREE.ExtrudeGeometry(shape, treadExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var plate = new THREE.Mesh(geom, par.doorMaterial);
		
	    plate.position.x =  0;
	    plate.position.z =  par.depth - par.doorsThk - par.boxDoorPlusIn;
	    plate.position.y =  -par.boxDoorPlusBot;
		//подпись
     	var textHeight = 30;
	    var textBasePoint = newPoint_xy(par.dxfBasePoint, 20, -150);
    	addText("фасад ящика", textHeight,  par.dxfArr, textBasePoint);
	    par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, Math.max(platepar.height, platepar.width) + 100, 0);
		
	    par.mesh.add(plate);
	}
	
	if(par.isDoorsOpened) {
		plate.position.z += par.slideParams.slideLen;
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
	
	platepar = drawPlate_wr(platepar);
	var plate = platepar.mesh;
	plate.position.x =  (par.width - platepar.width)/2;
	plate.position.z =  par.depth - par.boxDoorPlusIn;
	if(par.type == "ящик"){
	    plate.position.y =  par.height -100 ;
	}
	else{
		plate.position.y =  Math.min(par.heightRight, par.heightLeft) - 100;
	}
	par.mesh.add(plate);
		
	if(par.isDoorsOpened) {
		plate.position.z += par.slideParams.slideLen;
	}
	}

	return par;
}

function drawDoor(par){
	//параметры петель
	var hingePar = {
		type: par.hingeType,
		whDiam: 3,
		whDist: 32,
		whOffset: 37,
		dhDiam: 35,
		dhDiam2: 3,
		dhOffset: 21.5,
		dhOffset2: 6,
		dhDist: 48,
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
	if(par.type == "вправо") {
		var hingeCount = getHingeCount(par.heightRight);
	}
	else if(par.type == "влево") {
		var hingeCount = getHingeCount(par.heightLeft);
	}
	
	par.mesh = new THREE.Object3D();
	par.metises = new THREE.Object3D();
	
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
			
			for(var i = 0; i < getHingeCount(par.heightRight); ++i){
				var center = {x:par.width-hingePar.dhOffset, y:i * (par.heightRight-2*par.hingeDoorEdgeDist) / (getHingeCount(par.heightRight) - 1) + par.hingeDoorEdgeDist};
				if(i == getHingeCount(par.heightRight) - 1) center.y -= par.topHingeYOffset;
				addRoundHole(shape2, par.dxfArr, center, hingePar.dhDiam/2, par.dxfBasePoint);
				
				center = {x:par.width-(hingePar.dhOffset+hingePar.dhOffset2), y:i * (par.heightRight-2*par.hingeDoorEdgeDist) / (getHingeCount(par.heightRight) - 1) + par.hingeDoorEdgeDist - hingePar.dhDist/2};
				if(i == getHingeCount(par.heightRight) - 1) center.y -= par.topHingeYOffset;
				addRoundHole(shape2, par.dxfArr, center, hingePar.dhDiam2/2, par.dxfBasePoint);
						
				center = {x:par.width-(hingePar.dhOffset+hingePar.dhOffset2), y:i * (par.heightRight-2*par.hingeDoorEdgeDist) / (getHingeCount(par.heightRight) - 1) + par.hingeDoorEdgeDist + hingePar.dhDist/2};
				if(i == getHingeCount(par.heightRight) - 1) center.y -= par.topHingeYOffset;
				addRoundHole(shape2, par.dxfArr, center, hingePar.dhDiam2/2, par.dxfBasePoint);
			}
            for(var i = 0; i < getHingeCount(par.heightLeft); ++i){
			    center = {x:hingePar.dhOffset, y:i * (par.heightLeft-2*par.hingeDoorEdgeDist) / (getHingeCount(par.heightLeft) - 1) + par.hingeDoorEdgeDist};
				if(i == getHingeCount(par.heightRight) - 1) center.y -= par.topHingeYOffset;
				addRoundHole(shape, par.dxfArr, center, hingePar.dhDiam/2, par.dxfBasePoint);
				
				center = {x:hingePar.dhOffset+hingePar.dhOffset2, y:i * (par.heightLeft-2*par.hingeDoorEdgeDist) / (getHingeCount(par.heightLeft) - 1) + par.hingeDoorEdgeDist - hingePar.dhDist/2};
				if(i == getHingeCount(par.heightRight) - 1) center.y -= par.topHingeYOffset;
				addRoundHole(shape, par.dxfArr, center, hingePar.dhDiam2/2, par.dxfBasePoint);
						
				center = {x:hingePar.dhOffset+hingePar.dhOffset2, y:i * (par.heightLeft-2*par.hingeDoorEdgeDist) / (getHingeCount(par.heightLeft) - 1) + par.hingeDoorEdgeDist + hingePar.dhDist/2};
				if(i == getHingeCount(par.heightRight) - 1) center.y -= par.topHingeYOffset;
				addRoundHole(shape, par.dxfArr, center, hingePar.dhDiam2/2, par.dxfBasePoint);
			}
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
		    
			if(par.type != "выдвижная"){
				for(var i = 0; i < hingeCount; ++i){
					if(par.type == "вправо" || par.type == "две двери"){
					    var center = {x:par.width-hingePar.dhOffset, y:i * (par.heightRight-2*par.hingeDoorEdgeDist) / (hingeCount - 1) + par.hingeDoorEdgeDist};
						if(i == hingeCount - 1) center.y -= par.topHingeYOffset;
				        addRoundHole(shape, par.dxfArr, center, hingePar.dhDiam/2, par.dxfBasePoint);
						
						center = {x:par.width-(hingePar.dhOffset+hingePar.dhOffset2), y:i * (par.heightRight-2*par.hingeDoorEdgeDist) / (hingeCount - 1) + par.hingeDoorEdgeDist - hingePar.dhDist/2};
				        if(i == hingeCount - 1) center.y -= par.topHingeYOffset;
						addRoundHole(shape, par.dxfArr, center, hingePar.dhDiam2/2, par.dxfBasePoint);
						
						center = {x:par.width-(hingePar.dhOffset+hingePar.dhOffset2), y:i * (par.heightRight-2*par.hingeDoorEdgeDist) / (hingeCount - 1) + par.hingeDoorEdgeDist + hingePar.dhDist/2};
				        if(i == hingeCount - 1) center.y -= par.topHingeYOffset;
						addRoundHole(shape, par.dxfArr, center, hingePar.dhDiam2/2, par.dxfBasePoint);
					}
					if(par.type == "влево" || par.type == "две двери"){
					    var center = {x:hingePar.dhOffset, y:i * (par.heightLeft-2*par.hingeDoorEdgeDist) / (hingeCount - 1) + par.hingeDoorEdgeDist};
				        if(i == hingeCount - 1) center.y -= par.topHingeYOffset;
						addRoundHole(shape, par.dxfArr, center, hingePar.dhDiam/2, par.dxfBasePoint);
						
						center = {x:hingePar.dhOffset+hingePar.dhOffset2, y:i * (par.heightLeft-2*par.hingeDoorEdgeDist) / (hingeCount - 1) + par.hingeDoorEdgeDist - hingePar.dhDist/2};
				        if(i == hingeCount - 1) center.y -= par.topHingeYOffset;
						addRoundHole(shape, par.dxfArr, center, hingePar.dhDiam2/2, par.dxfBasePoint);
						
						center = {x:hingePar.dhOffset+hingePar.dhOffset2, y:i * (par.heightLeft-2*par.hingeDoorEdgeDist) / (hingeCount - 1) + par.hingeDoorEdgeDist + hingePar.dhDist/2};
				        if(i == hingeCount - 1) center.y -= par.topHingeYOffset;
						addRoundHole(shape, par.dxfArr, center, hingePar.dhDiam2/2, par.dxfBasePoint);
					}
				}
			}
			
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
	 
		            platepar = drawPlate_wr(platepar);
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

		        platepar = drawPlate_wr(platepar); 
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
	
		        platepar = drawPlate_wr(platepar);
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
	
		        platepar = drawPlate_wr(platepar);
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
			
		//петли
		if(par.type == "вправо") {
			for(var i = 0; i < hingeCount; ++i){
				hingePar = drawHinge(hingePar);
				var hinge = hingePar.mesh;
				hinge.rotation.z = Math.PI;
				if(isDoorsOpened) hinge.rotation.y = 3*Math.PI/2;
				hinge.position.x = par.width;
				if(par.hingeType == "side") {
					hinge.position.x -= par.thk - hingePar.sideDoorOffset_cl;
					if(isDoorsOpened) {
						hinge.position.x = par.width + hingePar.sideDoorOffset_cl;
						hinge.position.z += hingePar.sideDoorOffset_op;
					}
				}
				else {
					hinge.position.x -= params.carcasThk_wr / 2 - par.doorGap;
					if(isDoorsOpened) {
						hinge.position.z += hingePar.midDoorOffset_op;
						hinge.position.x += hingePar.midDoorOffset_op - 2*par.doorGap;
					}
				}
				hinge.position.y = i * (par.heightRight-2*par.hingeDoorEdgeDist) / (hingeCount - 1) + par.hingeDoorEdgeDist;
				if(i == hingeCount - 1) hinge.position.y -= par.topHingeYOffset;

				par.metises.add(hinge);
			}
		}
		else if(par.type == "влево") {
			for(var i = 0; i < hingeCount; ++i){
				hingePar = drawHinge(hingePar)
				var hinge = hingePar.mesh;
				if(isDoorsOpened) hinge.rotation.y = Math.PI/2;
				hinge.position.x = 0;
				if(par.hingeType == "side") {
					hinge.position.x += par.thk - hingePar.sideDoorOffset_cl;
					if(isDoorsOpened) {
						hinge.position.x = -hingePar.sideDoorOffset_cl;
						hinge.position.z += hingePar.sideDoorOffset_op;
					}
				}
				else {
					hinge.position.x += params.carcasThk_wr / 2 - par.doorGap;
					if(isDoorsOpened) {
						hinge.position.z += hingePar.midDoorOffset_op;
						hinge.position.x -= hingePar.midDoorOffset_op - 2*par.doorGap;
					}
				}
				hinge.position.y = i * (par.heightLeft-2*par.hingeDoorEdgeDist) / (hingeCount - 1) + par.hingeDoorEdgeDist;
				if(i == hingeCount - 1) hinge.position.y -= par.topHingeYOffset;
				
				par.metises.add(hinge);
			}
		}
		else if(par.type == "две двери") {
			hingeCount = getHingeCount(par.heightRight);
			hingePar.type = par.hingeType2;
			for(var i = 0; i < hingeCount; ++i){
				hingePar = drawHinge(hingePar);
				var hinge = hingePar.mesh;
				hinge.rotation.z = Math.PI;
				hinge.position.x = par.width;
				if(isDoorsOpened)hinge.position.x -= par.sectionpar.width;
				if(par.hingeType2 == "side") {
					hinge.position.x -= par.thk - hingePar.sideDoorOffset_cl;
					if(isDoorsOpened) {
                        hinge.position.x -= params.carcasThk_wr / 2 - par.doorGap;
					}
				}
				else {
					hinge.position.x -= params.carcasThk_wr / 2 - par.doorGap;
					if(isDoorsOpened) {
						hinge.position.x -= params.carcasThk_wr / 2 - par.doorGap;
						if(par.hingeType1 == "side") hinge.position.x -= hingePar.midDoorOffset_cl - hingePar.sideDoorOffset_cl;
					}
				}
				hinge.position.y = i * (par.heightRight-2*par.hingeDoorEdgeDist) / (hingeCount - 1) + par.hingeDoorEdgeDist;
				if(i == hingeCount - 1) hinge.position.y -= par.topHingeYOffset;
				
				par.metises.add(hinge);
			}
			
			hingeCount = getHingeCount(par.heightLeft);
			hingePar.type = par.hingeType1;
			for(var i = 0; i < hingeCount; ++i){
				hingePar = drawHinge(hingePar)
				var hinge = hingePar.mesh;
				hinge.position.x = 0;
				if(isDoorsOpened)hinge.position.x -= par.sectionpar.width;
				if(par.hingeType1 == "side") {
					hinge.position.x += par.thk - hingePar.sideDoorOffset_cl;			
					if(isDoorsOpened) {
                        hinge.position.x -= params.carcasThk_wr / 2 - par.doorGap + hingePar.midDoorOffset_cl - hingePar.sideDoorOffset_cl;
					}
				}
				else {
					hinge.position.x += params.carcasThk_wr / 2 - par.doorGap;
					if(isDoorsOpened) {
                        hinge.position.x -= params.carcasThk_wr / 2 - par.doorGap;
					}
				}
				hinge.position.y = i * (par.heightLeft-2*par.hingeDoorEdgeDist) / (hingeCount - 1) + par.hingeDoorEdgeDist;
				if(i == hingeCount - 1) hinge.position.y -= par.topHingeYOffset;
				
				par.metises.add(hinge);
			}
		}

    return par;

}//end of drawDoor

function drawTopOnlay(par){
	par.sideNotch = 50;
	par.plateYOffset = 5;
	par.holeDiam = 6;
	par.centerSideOffset = 40;
	
//	console.log(par)
	
	var p0 = {x:0,y:0};
	var p1 = newPoint_xy(p0, 0, par.topParams.onlayWidth);
	var p2 = newPoint_xy(p1, par.topPlateLength2 + (par.topParams.onlayWidth - par.topParams.beamWidth + par.topParams.doorGap + par.topParams.doorOnlay + par.topParams.topOffset)*Math.tan(par.angleTop/2) + params.carcasThk_wr, 0);
	var pt = {x:0, y:(par.topParams.onlayWidth - par.topParams.beamWidth + par.topParams.doorGap + par.topParams.doorOnlay + par.topParams.topOffset)-Math.max(par.heightLeft,par.heightRight)+par.sideNotch};
	var p3 = itercection(pt, newPoint_xy(pt, 100, 0), p2, newPoint_xy(p2, 100, 100*Math.tan(-par.angleTop)));
	var p4 = newPoint_xy(p3, 0, -par.sideNotch);
	var p5 = {x: par.width_wr, y:(par.topParams.onlayWidth - par.topParams.beamWidth + par.topParams.doorGap + par.topParams.doorOnlay + par.topParams.topOffset)-Math.max(par.heightLeft,par.heightRight)};
	var pt4 = newPoint_xy(p3, 0, -par.topParams.onlayWidth/Math.cos(par.angleTop));
	var p6 = itercection(p5, newPoint_xy(p5, 0, 100), pt4, newPoint_xy(pt4, 100, 100*Math.tan(-par.angleTop)));		
	var p7 = itercection(p0, newPoint_xy(p0, 100, 0), p6, newPoint_xy(p6, 100, 100*Math.tan(-par.angleTop)));
	var p8 = itercection(p5, newPoint_xy(p5, 0, 100), p2, p3);
	var p9 = newPoint_xy(p8, 0, -par.topParams.onlayWidth/Math.cos(par.angleTop));
	
	var shape = new THREE.Shape();
	
	addLine(shape, par.dxfArr, p0, p1, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p2, p8, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p8, p9, par.dxfBasePoint);
	if(p7.x <= p0.x){
		p7 = itercection(p9,p7,p0,newPoint_xy(p0,0,100));
	}
	addLine(shape, par.dxfArr, p9, p7, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p7, p0, par.dxfBasePoint);
			
	var treadExtrudeOptions = {
		amount: par.thk, 
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
		
	var geom = new THREE.ExtrudeGeometry(shape, treadExtrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	par.mesh = new THREE.Mesh(geom, par.material);

	//подпись
	var textHeight = 30;
	var textBasePoint = newPoint_xy(par.dxfBasePoint, 20, -150);
	addText(par.text, textHeight,  par.dxfArr, textBasePoint);
		
	return par;
}

function drawSideOnlay(par){
	var p0 = {x:0,y:0};
	var p1 = newPoint_xy(p0, 0, Math.min(par.heightLeft, par.heightRight) + (par.topParams.onlayWidth - par.topParams.beamWidth + par.topParams.doorGap + par.topParams.doorOnlay + par.topParams.topOffset)/Math.cos(par.angleTop));
	var p2 = newPoint_xy(p0, (Math.min(par.heightLeft, par.heightRight) + (par.topParams.onlayWidth - par.topParams.beamWidth + par.topParams.doorGap + par.topParams.doorOnlay + par.topParams.topOffset)/Math.cos(par.angleTop))/Math.tan(par.angleTop), 0);

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
	
	return par;
}

function drawBeam(par){
	par.sideNotch = 50;
	par.plateYOffset = 5;
	par.holeDiam = 6;
	par.centerSideOffset = 40;
	
	if(par.hasSlots == true){
		var p0 = {x:0,y:0};
	    var p1 = newPoint_xy(p0, 0, par.topParams.beamWidth);
	    var p2 = newPoint_xy(p1, par.topPlateLength2 + par.topParams.topOffset*Math.tan(par.angleTop/2), 0);
	    var pt = {x:0, y:par.topParams.beamWidth-par.topParams.topOffset-Math.max(par.heightLeft,par.heightRight)+par.sideNotch};
		var p3 = itercection(pt, newPoint_xy(pt, 100, 0), p2, newPoint_xy(p2, 100, 100*Math.tan(-par.angleTop)));
	    var p4 = newPoint_xy(p3, 0, -par.sideNotch);
		var p5 = {x:par.width_wr-params.carcasThk_wr,y:par.topParams.beamWidth-par.topParams.topOffset-Math.max(par.heightLeft,par.heightRight)};
		var pt4 = newPoint_xy(p3, 0, -par.topParams.beamWidth/Math.cos(par.angleTop));
		var p6 = itercection(p5, newPoint_xy(p5, 0, 100), pt4, newPoint_xy(pt4, 100, 100*Math.tan(-par.angleTop)));	
        var p7 = newPoint_xy(p6, 0, par.plateYOffset + (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr)/Math.cos(par.angleTop) + params.carcasThk_wr*Math.tan(par.angleTop) + params.carcasThk_wr * Math.tan(par.angleTop/2));
		p7.y = p5.y + Math.min(par.heightLeft, par.heightRight);
		p7 = newPoint_x(p7, -params.carcasThk_wr, par.angleTop);
		var p8 = itercection(newPoint_xy(p0, 0, par.topParams.beamWidth-par.topParams.topOffset), newPoint_xy(newPoint_xy(p0, 0, par.topParams.beamWidth-par.topParams.topOffset), 100, 0), p7, newPoint_xy(p7, 100, 100*Math.tan(-par.angleTop)));
        var p9 = itercection(p0, newPoint_xy(p0, 100, 0), p6, newPoint_xy(p6, 100, 100*Math.tan(-par.angleTop)));
        var p10 = itercection(p7, newPoint_xy(p7, 0, 100), p2, p3);
		var p11 = newPoint_xy(p10, 0, -par.topParams.topOffset/Math.cos(par.angleTop));
		
	    var shape = new THREE.Shape();
	
	    addLine(shape, par.dxfArr, newPoint_xy(p0, 0, par.topParams.beamWidth-par.topParams.topOffset), p1, par.dxfBasePoint);
	    addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
	    addLine(shape, par.dxfArr, p2, p10, par.dxfBasePoint);
	    addLine(shape, par.dxfArr, p10, p11, par.dxfBasePoint);
		if(p8.x < p0.x){
	        addLine(shape, par.dxfArr, p11, newPoint_xy(p0, 0, par.topParams.beamWidth-par.topParams.topOffset), par.dxfBasePoint);
		}
		else{
	        addLine(shape, par.dxfArr, p11, p8, par.dxfBasePoint);
	        addLine(shape, par.dxfArr, p8, newPoint_xy(p0, 0, par.topParams.beamWidth-par.topParams.topOffset), par.dxfBasePoint);
		}
			
        var trashShape = new THREE.Shape();
		var ph5 = {x: -5, y: p1.y - par.centerFaceOffset};
		var ph6 = {x: 45, y: p1.y - par.centerFaceOffset};
	    var ph7 = {x: p10.x+5, y: p10.y-par.centerFaceOffset};
		var ph8 = {x: p10.x-45, y: p10.y-par.centerFaceOffset};
			
	    addLine(trashShape, par.dxfArr, ph5, ph6, par.dxfBasePoint);
	    addLine(trashShape, par.dxfArr, ph7, ph8, par.dxfBasePoint);			
				
	    var treadExtrudeOptions = {
		    amount: par.thk, 
		    bevelEnabled: false,
		    curveSegments: 12,
		    steps: 1
	    };
		
	    var geom = new THREE.ExtrudeGeometry(shape, treadExtrudeOptions);
	    geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	    var mesh1 = new THREE.Mesh(geom, par.material);
		par.mesh = new THREE.Object3D();
		par.mesh.add(mesh1);

		//прорези под вертикальные панели и отверстия под панели верхнего узла		
		var pp0 = copyPoint(p6);
		
		if(par.sideFactor == 1){
		    for(var i = 0; i < par.sectAmt; ++i){  
			    if(pp0.x - par.sections[i].width > par.topPlateLength2 + params.carcasThk_wr || par.topPlateLength2 == 0){
			        var pp1 = newPoint_xy(pp0, 0, par.plateYOffset + (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr)/Math.cos(par.angleTop) + params.carcasThk_wr*Math.tan(par.angleTop));
			        var pp2 = newPoint_xy(pp1, -params.carcasThk_wr, 0);
				    var pp3 = newPoint_xy(pp2, 0, -(par.plateYOffset + (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr)/Math.cos(par.angleTop)));
					var pp4 = newPoint_xy(pp3, -par.sections[i].width, par.sections[i].width*Math.tan(par.angleTop));
					var pp5 = newPoint_xy(pp3, 0, (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr)/Math.cos(par.angleTop));
					var pp6 = newPoint_xy(pp4, 0, (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr)/Math.cos(par.angleTop));
					pp0 = copyPoint(pp4);
					
					var shape2 = new THREE.Shape();
					addLine(shape2, par.dxfArr, pp3, pp4, par.dxfBasePoint);
					addLine(shape2, par.dxfArr, pp4, pp6, par.dxfBasePoint);
					addLine(shape2, par.dxfArr, pp6, pp5, par.dxfBasePoint);
					addLine(shape2, par.dxfArr, pp5, pp3, par.dxfBasePoint);
					
					var geom = new THREE.ExtrudeGeometry(shape2, treadExtrudeOptions);
	                geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	                var mesh2 = new THREE.Mesh(geom, par.material);
	            	par.mesh.add(mesh2);
				}
				else if(pp0.x > par.topPlateLength2 + params.carcasThk_wr){ 
				    var pp1 = newPoint_xy(pp0, 0, par.plateYOffset + (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr)/Math.cos(par.angleTop) + params.carcasThk_wr*Math.tan(par.angleTop));
			        var pp2 = newPoint_xy(pp1, -params.carcasThk_wr, 0);
				    var pp3 = newPoint_xy(pp2, 0, -(par.plateYOffset + (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr)/Math.cos(par.angleTop)));
					var pp4 = copyPoint(p9);
					var pp5 = newPoint_xy(pp3, 0, (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr)/Math.cos(par.angleTop));
					var pp6 = newPoint_xy(pp4, 0, par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr);
					var pp7 = newPoint_xy(pp6, (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr)*Math.tan(par.angleTop/2), 0);
					
					var shape2 = new THREE.Shape();
					addLine(shape2, par.dxfArr, pp3, pp4, par.dxfBasePoint);
					addLine(shape2, par.dxfArr, pp4, pp6, par.dxfBasePoint);
					addLine(shape2, par.dxfArr, pp6, pp7, par.dxfBasePoint);
					addLine(shape2, par.dxfArr, pp7, pp5, par.dxfBasePoint);
					addLine(shape2, par.dxfArr, pp5, pp3, par.dxfBasePoint);
					pp0 = copyPoint(pp4);
					
					var geom = new THREE.ExtrudeGeometry(shape2, treadExtrudeOptions);
	                geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	                var mesh2 = new THREE.Mesh(geom, par.material);
	            	par.mesh.add(mesh2);
					
					var pp1 = newPoint_xy(pp0, 0, par.plateYOffset + par.topParams.beamWidth-par.topParams.topOffset);
			        var pp2 = newPoint_xy(pp1, 0, 0);
				    var pp3 = newPoint_xy(pp2, 0, -(par.plateYOffset + par.topParams.beamWidth-par.topParams.topOffset));
					var pp4 = newPoint_xy(pp3, -(par.sections[i].topNotchBox-(par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr)*Math.tan(par.angleTop/2)), 0);
					var pp5 = newPoint_xy(pp3, 0, (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr));
					var pp6 = newPoint_xy(pp4, 0, (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr));
					pp0 = copyPoint(pp4);
					
					var shape2 = new THREE.Shape();
					addLine(shape2, par.dxfArr, pp3, pp4, par.dxfBasePoint);
					addLine(shape2, par.dxfArr, pp4, pp6, par.dxfBasePoint);
					addLine(shape2, par.dxfArr, pp6, pp7, par.dxfBasePoint);
					addLine(shape2, par.dxfArr, pp7, pp5, par.dxfBasePoint);
					addLine(shape2, par.dxfArr, pp5, pp3, par.dxfBasePoint);
					
					var geom = new THREE.ExtrudeGeometry(shape2, treadExtrudeOptions);
	                geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	                var mesh2 = new THREE.Mesh(geom, par.material);
	            	par.mesh.add(mesh2);
				}
				else if(par.topPlateLength2 > 0) {
					pp0.y = 0;
					var pp1 = newPoint_xy(pp0, 0, par.plateYOffset + par.topParams.beamWidth-par.topParams.topOffset);
			        var pp2 = newPoint_xy(pp1, -params.carcasThk_wr, 0);
				    var pp3 = newPoint_xy(pp2, 0, -(par.plateYOffset + par.topParams.beamWidth-par.topParams.topOffset));
					var pp4 = newPoint_xy(pp3, -par.sections[i].width, 0);
					var pp5 = newPoint_xy(pp3, 0, (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr));
					var pp6 = newPoint_xy(pp4, 0, (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr));
					
					var shape2 = new THREE.Shape();
					addLine(shape2, par.dxfArr, pp3, pp4, par.dxfBasePoint);
					addLine(shape2, par.dxfArr, pp4, pp6, par.dxfBasePoint);
					addLine(shape2, par.dxfArr, pp6, pp5, par.dxfBasePoint);
					addLine(shape2, par.dxfArr, pp5, pp3, par.dxfBasePoint);
					pp0 = copyPoint(pp4);
					
					var geom = new THREE.ExtrudeGeometry(shape2, treadExtrudeOptions);
	                geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	                var mesh2 = new THREE.Mesh(geom, par.material);
	            	par.mesh.add(mesh2);
				}
		    } 
		}
		else if(par.sideFactor == -1){
		    for(var i = par.sectAmt - 1; i >= 0; --i){
			    if(pp0.x - par.sections[i].width > par.topPlateLength2 + params.carcasThk_wr || par.topPlateLength2 == 0){
			        var pp1 = newPoint_xy(pp0, 0, par.plateYOffset + (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr)/Math.cos(par.angleTop) + params.carcasThk_wr*Math.tan(par.angleTop));
			        var pp2 = newPoint_xy(pp1, -params.carcasThk_wr, 0);
				    var pp3 = newPoint_xy(pp2, 0, -(par.plateYOffset + (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr)/Math.cos(par.angleTop)));
					var pp4 = newPoint_xy(pp3, -par.sections[i].width, par.sections[i].width*Math.tan(par.angleTop));
					var pp5 = newPoint_xy(pp3, 0, (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr)/Math.cos(par.angleTop));
					var pp6 = newPoint_xy(pp4, 0, (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr)/Math.cos(par.angleTop));
					
					var shape2 = new THREE.Shape();
					addLine(shape2, par.dxfArr, pp3, pp4, par.dxfBasePoint);
					addLine(shape2, par.dxfArr, pp4, pp6, par.dxfBasePoint);
					addLine(shape2, par.dxfArr, pp6, pp5, par.dxfBasePoint);
					addLine(shape2, par.dxfArr, pp5, pp3, par.dxfBasePoint);
					pp0 = copyPoint(pp4);
					
					var geom = new THREE.ExtrudeGeometry(shape2, treadExtrudeOptions);
	                geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	                var mesh2 = new THREE.Mesh(geom, par.material);
	            	par.mesh.add(mesh2);
				}
				else if(pp0.x > par.topPlateLength2 + params.carcasThk_wr){ 
				    var pp1 = newPoint_xy(pp0, 0, par.plateYOffset + (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr)/Math.cos(par.angleTop) + params.carcasThk_wr*Math.tan(par.angleTop));
			        var pp2 = newPoint_xy(pp1, -params.carcasThk_wr, 0);
				    var pp3 = newPoint_xy(pp2, 0, -(par.plateYOffset + (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr)/Math.cos(par.angleTop)));
					var pp4 = copyPoint(p9);
					var pp5 = newPoint_xy(pp3, 0, (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr)/Math.cos(par.angleTop));
					var pp6 = newPoint_xy(pp4, 0, par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr);
					var pp7 = newPoint_xy(pp6, (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr)*Math.tan(par.angleTop/2), 0);

					var shape2 = new THREE.Shape();
					addLine(shape2, par.dxfArr, pp3, pp4, par.dxfBasePoint);
					addLine(shape2, par.dxfArr, pp4, pp6, par.dxfBasePoint);
					addLine(shape2, par.dxfArr, pp6, pp7, par.dxfBasePoint);
					addLine(shape2, par.dxfArr, pp7, pp5, par.dxfBasePoint);
					addLine(shape2, par.dxfArr, pp5, pp3, par.dxfBasePoint);
					pp0 = copyPoint(pp4);
					
					var geom = new THREE.ExtrudeGeometry(shape2, treadExtrudeOptions);
	                geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	                var mesh2 = new THREE.Mesh(geom, par.material);
	            	par.mesh.add(mesh2);
					
					var pp1 = newPoint_xy(pp0, 0, par.plateYOffset + par.topParams.beamWidth-par.topParams.topOffset);
			        var pp2 = newPoint_xy(pp1, 0, 0);
				    var pp3 = newPoint_xy(pp2, 0, -(par.plateYOffset + par.topParams.beamWidth-par.topParams.topOffset));
					var pp4 = newPoint_xy(pp3, -(par.sections[i].topNotchBox-(par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr)*Math.tan(par.angleTop/2)), 0);
					var pp5 = newPoint_xy(pp3, 0, (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr));
					var pp6 = newPoint_xy(pp4, 0, (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr));
					pp0 = copyPoint(pp4);
					
					var shape2 = new THREE.Shape();
					addLine(shape2, par.dxfArr, pp3, pp4, par.dxfBasePoint);
					addLine(shape2, par.dxfArr, pp4, pp6, par.dxfBasePoint);
					addLine(shape2, par.dxfArr, pp6, pp7, par.dxfBasePoint);
					addLine(shape2, par.dxfArr, pp7, pp5, par.dxfBasePoint);
					addLine(shape2, par.dxfArr, pp5, pp3, par.dxfBasePoint);
					
					var geom = new THREE.ExtrudeGeometry(shape2, treadExtrudeOptions);
	                geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	                var mesh2 = new THREE.Mesh(geom, par.material);
	            	par.mesh.add(mesh2);
				}
				else if(par.topPlateLength2 > 0) {
					pp0.y = 0;
					var pp1 = newPoint_xy(pp0, 0, par.plateYOffset + par.topParams.beamWidth-par.topParams.topOffset);
			        var pp2 = newPoint_xy(pp1, -params.carcasThk_wr, 0);
				    var pp3 = newPoint_xy(pp2, 0, -(par.plateYOffset + par.topParams.beamWidth-par.topParams.topOffset));
					var pp4 = newPoint_xy(pp3, -par.sections[i].width, 0);
					var pp5 = newPoint_xy(pp3, 0, (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr));
					var pp6 = newPoint_xy(pp4, 0, (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr));
					
					var shape2 = new THREE.Shape();
					addLine(shape2, par.dxfArr, pp3, pp4, par.dxfBasePoint);
					addLine(shape2, par.dxfArr, pp4, pp6, par.dxfBasePoint);
					addLine(shape2, par.dxfArr, pp6, pp5, par.dxfBasePoint);
					addLine(shape2, par.dxfArr, pp5, pp3, par.dxfBasePoint);
					pp0 = copyPoint(pp4);
					
					var geom = new THREE.ExtrudeGeometry(shape2, treadExtrudeOptions);
	                geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	                var mesh2 = new THREE.Mesh(geom, par.material);
	            	par.mesh.add(mesh2);
				}
		    }
		}
	}
	else{
	    var p0 = {x:0,y:0};
	    var p1 = newPoint_xy(p0, 0, par.topParams.beamWidth);
	    var p2 = newPoint_xy(p1, par.topPlateLength2 + par.topParams.topOffset*Math.tan(par.angleTop/2), 0);
	    var pt = {x:0, y:par.topParams.beamWidth-par.topParams.topOffset-Math.max(par.heightLeft,par.heightRight)+par.sideNotch};
		var p3 = itercection(pt, newPoint_xy(pt, 100, 0), p2, newPoint_xy(p2, 100, 100*Math.tan(-par.angleTop)));
	    var p4 = newPoint_xy(p3, 0, -par.sideNotch);
		var p5 = {x:par.width_wr-params.carcasThk_wr,y:par.topParams.beamWidth-par.topParams.topOffset-Math.max(par.heightLeft,par.heightRight)};
		var pt4 = newPoint_xy(p3, 0, -par.topParams.beamWidth/Math.cos(par.angleTop));
		var p6 = itercection(p5, newPoint_xy(p5, 0, 100), pt4, newPoint_xy(pt4, 100, 100*Math.tan(-par.angleTop)));		
		var p7 = itercection(p0, newPoint_xy(p0, 100, 0), p6, newPoint_xy(p6, 100, 100*Math.tan(-par.angleTop)));
		var p8 = itercection(newPoint_xy(p5, -params.carcasThk_wr, 0), newPoint_xy(newPoint_xy(p5, -params.carcasThk_wr, 0), 0, 100), p2, p3);
     	var p9 = newPoint_xy(p8, 0, -par.topParams.beamWidth/Math.cos(par.angleTop));

	    var shape = new THREE.Shape();
	
	    addLine(shape, par.dxfArr, p0, p1, par.dxfBasePoint);
	    addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
	    addLine(shape, par.dxfArr, p2, p8, par.dxfBasePoint);
	    addLine(shape, par.dxfArr, p8, p9, par.dxfBasePoint);
	
        var trashShape = new THREE.Shape();
		var ph5 = {x: -5, y: p1.y - par.centerFaceOffset};
		var ph6 = {x: 45, y: p1.y - par.centerFaceOffset};
	    var ph7 = {x: p8.x+5, y: p8.y-par.centerFaceOffset};
		var ph8 = {x: p8.x-45, y: p8.y-par.centerFaceOffset};
			
	    addLine(trashShape, par.dxfArr, ph5, ph6, par.dxfBasePoint);
	    addLine(trashShape, par.dxfArr, ph7, ph8, par.dxfBasePoint);	
		
		//прорези под вертикальные панели и отверстия под панели верхнего узла		
		var pp0 = copyPoint(p6);
		
		if(par.sideFactor == 1){
		    for(var i = 0; i < par.sectAmt; ++i){  
			    if(pp0.x - par.sections[i].width > par.topPlateLength2 + params.carcasThk_wr || par.topPlateLength2 == 0){
			        var pp1 = newPoint_xy(pp0, 0, par.plateYOffset + (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr)/Math.cos(par.angleTop) + params.carcasThk_wr*Math.tan(par.angleTop));
			        var pp2 = newPoint_xy(pp1, -params.carcasThk_wr, 0);
				    var pp3 = newPoint_xy(pp2, 0, -(par.plateYOffset + (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr)/Math.cos(par.angleTop)));
					var pp4 = newPoint_xy(pp3, -par.sections[i].width, par.sections[i].width*Math.tan(par.angleTop));
					
					if(i != 0){
					    addLine(shape, par.dxfArr, pp0, pp1, par.dxfBasePoint);
			    	    addLine(shape, par.dxfArr, pp1, pp2, par.dxfBasePoint);
			    	    addLine(shape, par.dxfArr, pp2, pp3, par.dxfBasePoint);
					}
					if(pp4.x < p0.x){
					    pp4 = itercection(pp3,pp4,p0,newPoint_xy(p0,0,100));
				    }
			    	addLine(shape, par.dxfArr, pp3, pp4, par.dxfBasePoint);
					pp0 = copyPoint(pp4);
					
					if(par.sections[i].width/Math.cos(par.angleTop) > 2*par.centerSideOffset + par.holeDiam){
					    var pp5 = newPoint_xy(pp2, 0, -par.plateYOffset);
					    var center = newPoint_xy(pp5, -par.centerSideOffset*Math.cos(par.angleTop) + params.carcasThk_wr/2 * Math.sin(par.angleTop), par.centerSideOffset*Math.sin(par.angleTop) + params.carcasThk_wr/2 * Math.cos(par.angleTop));
					    addRoundHole(shape, par.dxfArr, center, par.holeDiam/2, par.dxfBasePoint);
					
					    pp5 = newPoint_xy(pp2, 0, -par.plateYOffset);
					    var center = newPoint_xy(pp5, -(par.sections[i].width-par.centerSideOffset*Math.cos(par.angleTop) - params.carcasThk_wr/2 * Math.sin(par.angleTop)), par.sections[i].width*Math.tan(par.angleTop) - (par.centerSideOffset*Math.sin(par.angleTop) - params.carcasThk_wr/2 * Math.cos(par.angleTop)));
					    addRoundHole(shape, par.dxfArr, center, par.holeDiam/2, par.dxfBasePoint);
					}
				}
				else if(pp0.x > par.topPlateLength2 + params.carcasThk_wr){ 
				    var pp1 = newPoint_xy(pp0, 0, par.plateYOffset + (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr)/Math.cos(par.angleTop) + params.carcasThk_wr*Math.tan(par.angleTop));
			        var pp2 = newPoint_xy(pp1, -params.carcasThk_wr, 0);
				    var pp3 = newPoint_xy(pp2, 0, -(par.plateYOffset + (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr)/Math.cos(par.angleTop)));
					if(i != 0){
					    addLine(shape, par.dxfArr, pp0, pp1, par.dxfBasePoint);
			    	    addLine(shape, par.dxfArr, pp1, pp2, par.dxfBasePoint);
			    	    addLine(shape, par.dxfArr, pp2, pp3, par.dxfBasePoint);
					}
					if(p7.x < p0.x){
					    p7 = itercection(pp3,p7,p0,newPoint_xy(p0,0,100));
				    }
				    addLine(shape, par.dxfArr, pp3, p7, par.dxfBasePoint);
					
					pp0 = newPoint_xy(pp0, -par.sections[i].width-params.carcasThk_wr, 0);
					pp0.y = p7.y;
					
					
				    addLine(shape, par.dxfArr, p7, pp0, par.dxfBasePoint);
					
					if((par.sections[i].width - par.sections[i].topNotchBox)/Math.cos(par.angleTop) > 2*par.centerSideOffset + par.holeDiam){
					    var pp5 = newPoint_xy(pp2, 0, -par.plateYOffset);
					    var center = newPoint_xy(pp5, -par.centerSideOffset*Math.cos(par.angleTop) + params.carcasThk_wr/2 * Math.sin(par.angleTop), par.centerSideOffset*Math.sin(par.angleTop) + params.carcasThk_wr/2 * Math.cos(par.angleTop));
					    addRoundHole(shape, par.dxfArr, center, par.holeDiam/2, par.dxfBasePoint);
					
					    pp5 = newPoint_xy(pp2, 0, -par.plateYOffset);
					    var center = newPoint_xy(pp5, -((par.sections[i].width - par.sections[i].topNotchBox)-par.centerSideOffset*Math.cos(par.angleTop) - params.carcasThk_wr/2 * Math.sin(par.angleTop)), (par.sections[i].width - par.sections[i].topNotchBox)*Math.tan(par.angleTop) - (par.centerSideOffset*Math.sin(par.angleTop) - params.carcasThk_wr/2 * Math.cos(par.angleTop)));
					    addRoundHole(shape, par.dxfArr, center, par.holeDiam/2, par.dxfBasePoint);
					}
					
					if(par.sections[i].topNotchBox > 2*par.centerSideOffset + par.holeDiam){
					    
					    if(i == par.sectAmt - 1){
						    var pp5 = newPoint_xy(pp0, 0, par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr);
					        var center = newPoint_xy(pp5, par.centerSideOffset, params.carcasThk_wr/2);
					        addRoundHole(shape, par.dxfArr, center, par.holeDiam/2, par.dxfBasePoint);
						}
					
					    pp5 = newPoint_xy(pp0, 0, par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr);
					    var center = newPoint_xy(pp5, par.sections[i].topNotchBox - par.centerSideOffset, params.carcasThk_wr/2);
					    addRoundHole(shape, par.dxfArr, center, par.holeDiam/2, par.dxfBasePoint);
						
						var hasHorizontalHole1 = true;
					}
				}
				else if(par.topPlateLength2 > 0) {
					pp0.y = 0;
					var pp1 = newPoint_xy(pp0, 0, par.plateYOffset + par.topParams.beamWidth-par.topParams.topOffset - params.carcasThk_wr);
			        var pp2 = newPoint_xy(pp1, -params.carcasThk_wr, 0);
				    var pp3 = newPoint_xy(pp2, 0, -(par.plateYOffset + par.topParams.beamWidth-par.topParams.topOffset - params.carcasThk_wr));
					var pp4 = newPoint_xy(pp3, -par.sections[i].width, 0);
					addLine(shape, par.dxfArr, pp0, pp1, par.dxfBasePoint);
			    	addLine(shape, par.dxfArr, pp1, pp2, par.dxfBasePoint);
			    	addLine(shape, par.dxfArr, pp2, pp3, par.dxfBasePoint);
			    	addLine(shape, par.dxfArr, pp3, pp4, par.dxfBasePoint);
					pp0 = copyPoint(pp4);
										
					if(par.sections[i].width > 2*par.centerSideOffset + par.holeDiam){
					    if(i == par.sectAmt - 1){
					        var pp5 = newPoint_xy(pp0, 0, par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr);
					        var center = newPoint_xy(pp5, par.centerSideOffset, params.carcasThk_wr/2);
					        addRoundHole(shape, par.dxfArr, center, par.holeDiam/2, par.dxfBasePoint);					
					    
						    if(!hasHorizontalHole1){
					            pp5 = newPoint_xy(pp0, 0, par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr);
					            var center = newPoint_xy(pp5, par.topPlateLength2 - params.carcasThk_wr * Math.tan(par.angleTop/2) - par.centerSideOffset, params.carcasThk_wr/2);
					            addRoundHole(shape, par.dxfArr, center, par.holeDiam/2, par.dxfBasePoint);
						    }
						}
					}
				}		    
			}
		}
		else if(par.sideFactor == -1){
		    for(var i = par.sectAmt - 1; i >= 0; --i){
			    if(pp0.x - par.sections[i].width > par.topPlateLength2 + params.carcasThk_wr || par.topPlateLength2 == 0){
			        var pp1 = newPoint_xy(pp0, 0, par.plateYOffset + (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr)/Math.cos(par.angleTop) + params.carcasThk_wr*Math.tan(par.angleTop));
			        var pp2 = newPoint_xy(pp1, -params.carcasThk_wr, 0);
				    var pp3 = newPoint_xy(pp2, 0, -(par.plateYOffset + (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr)/Math.cos(par.angleTop)));
					var pp4 = newPoint_xy(pp3, -par.sections[i].width, par.sections[i].width*Math.tan(par.angleTop));
					
					if(i != par.sectAmt - 1){
					    addLine(shape, par.dxfArr, pp0, pp1, par.dxfBasePoint);
			    	    addLine(shape, par.dxfArr, pp1, pp2, par.dxfBasePoint);
			    	    addLine(shape, par.dxfArr, pp2, pp3, par.dxfBasePoint);
					}
					
					if(pp4.x < p0.x){
					    pp4 = itercection(pp3,pp4,p0,newPoint_xy(p0,0,100));
				    }
			    	addLine(shape, par.dxfArr, pp3, pp4, par.dxfBasePoint);
					pp0 = copyPoint(pp4);
					
					if(par.sections[i].width/Math.cos(par.angleTop) > 2*par.centerSideOffset + par.holeDiam){
					    var pp5 = newPoint_xy(pp2, 0, -par.plateYOffset);
					    var center = newPoint_xy(pp5, -par.centerSideOffset*Math.cos(par.angleTop) + params.carcasThk_wr/2 * Math.sin(par.angleTop), par.centerSideOffset*Math.sin(par.angleTop) + params.carcasThk_wr/2 * Math.cos(par.angleTop));
					    addRoundHole(shape, par.dxfArr, center, par.holeDiam/2, par.dxfBasePoint);
					
					    pp5 = newPoint_xy(pp2, 0, -par.plateYOffset);
					    var center = newPoint_xy(pp5, -(par.sections[i].width-par.centerSideOffset*Math.cos(par.angleTop) - params.carcasThk_wr/2 * Math.sin(par.angleTop)), par.sections[i].width*Math.tan(par.angleTop) - (par.centerSideOffset*Math.sin(par.angleTop) - params.carcasThk_wr/2 * Math.cos(par.angleTop)));
					    addRoundHole(shape, par.dxfArr, center, par.holeDiam/2, par.dxfBasePoint);
					}
				}
				else if(pp0.x > par.topPlateLength2 + params.carcasThk_wr){ 
				    var pp1 = newPoint_xy(pp0, 0, par.plateYOffset + (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr)/Math.cos(par.angleTop) + params.carcasThk_wr*Math.tan(par.angleTop));
			        var pp2 = newPoint_xy(pp1, -params.carcasThk_wr, 0);
				    var pp3 = newPoint_xy(pp2, 0, -(par.plateYOffset + (par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr)/Math.cos(par.angleTop)));
					if(i != par.sectAmt - 1){
					    addLine(shape, par.dxfArr, pp0, pp1, par.dxfBasePoint);
			    	    addLine(shape, par.dxfArr, pp1, pp2, par.dxfBasePoint);
			    	    addLine(shape, par.dxfArr, pp2, pp3, par.dxfBasePoint);
					}
					if(p7.x < p0.x){
					    p7 = itercection(pp3,p7,p0,newPoint_xy(p0,0,100));
				    }
				    addLine(shape, par.dxfArr, pp3, p7, par.dxfBasePoint);
					pp0 = newPoint_xy(pp0, -par.sections[i].width-params.carcasThk_wr, 0);
					pp0.y = p7.y;
				    addLine(shape, par.dxfArr, p7, pp0, par.dxfBasePoint);
					
					if((par.sections[i].width - par.sections[i].topNotchBox)/Math.cos(par.angleTop) > 2*par.centerSideOffset + par.holeDiam){
					    var pp5 = newPoint_xy(pp2, 0, -par.plateYOffset);
					    var center = newPoint_xy(pp5, -par.centerSideOffset*Math.cos(par.angleTop) + params.carcasThk_wr/2 * Math.sin(par.angleTop), par.centerSideOffset*Math.sin(par.angleTop) + params.carcasThk_wr/2 * Math.cos(par.angleTop));
					    addRoundHole(shape, par.dxfArr, center, par.holeDiam/2, par.dxfBasePoint);
					
					    pp5 = newPoint_xy(pp2, 0, -par.plateYOffset);
					    var center = newPoint_xy(pp5, -((par.sections[i].width - par.sections[i].topNotchBox)-par.centerSideOffset*Math.cos(par.angleTop) - params.carcasThk_wr/2 * Math.sin(par.angleTop)), (par.sections[i].width - par.sections[i].topNotchBox)*Math.tan(par.angleTop) - (par.centerSideOffset*Math.sin(par.angleTop) - params.carcasThk_wr/2 * Math.cos(par.angleTop)));
					    addRoundHole(shape, par.dxfArr, center, par.holeDiam/2, par.dxfBasePoint);
					}
					
					if(par.sections[i].topNotchBox > 2*par.centerSideOffset + par.holeDiam){
					    if(i == 0){
					        var pp5 = newPoint_xy(pp0, 0, par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr);
					        var center = newPoint_xy(pp5, par.centerSideOffset, params.carcasThk_wr/2);
					        addRoundHole(shape, par.dxfArr, center, par.holeDiam/2, par.dxfBasePoint);					
					    
						    if(!hasHorizontalHole1){
					            pp5 = newPoint_xy(pp0, 0, par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr);
					            var center = newPoint_xy(pp5, par.topPlateLength2 - params.carcasThk_wr * Math.tan(par.angleTop/2) - par.centerSideOffset, params.carcasThk_wr/2);
					            addRoundHole(shape, par.dxfArr, center, par.holeDiam/2, par.dxfBasePoint);
						    }
						}
					}
				}
				else if(par.topPlateLength2 > 0) {
					pp0.y = 0;
					var pp1 = newPoint_xy(pp0, 0, par.plateYOffset + par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr);
			        var pp2 = newPoint_xy(pp1, -params.carcasThk_wr, 0);
				    var pp3 = newPoint_xy(pp2, 0, -(par.plateYOffset + par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr));
					var pp4 = newPoint_xy(pp3, -par.sections[i].width, 0);
					addLine(shape, par.dxfArr, pp0, pp1, par.dxfBasePoint);
			    	addLine(shape, par.dxfArr, pp1, pp2, par.dxfBasePoint);
			    	addLine(shape, par.dxfArr, pp2, pp3, par.dxfBasePoint);
			    	addLine(shape, par.dxfArr, pp3, pp4, par.dxfBasePoint);
					pp0 = copyPoint(pp4);
										
					if(par.sections[i].width > 2*par.centerSideOffset + par.holeDiam){
					    if(i == 0){
					        var pp5 = newPoint_xy(pp0, 0, par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr);
					        var center = newPoint_xy(pp5, par.centerSideOffset, params.carcasThk_wr/2);
					        addRoundHole(shape, par.dxfArr, center, par.holeDiam/2, par.dxfBasePoint);					
					    
						    if(!hasHorizontalHole1){
					            pp5 = newPoint_xy(pp0, 0, par.topParams.beamWidth-par.topParams.topOffset-params.carcasThk_wr);
					            var center = newPoint_xy(pp5, par.topPlateLength2 - params.carcasThk_wr * Math.tan(par.angleTop/2) - par.centerSideOffset, params.carcasThk_wr/2);
					            addRoundHole(shape, par.dxfArr, center, par.holeDiam/2, par.dxfBasePoint);
						    }
						}
					}
				}
		    }
		}
		
	    addLine(shape, par.dxfArr, pp0, p0, par.dxfBasePoint);
			
	    var treadExtrudeOptions = {
		    amount: par.thk, 
		    bevelEnabled: false,
		    curveSegments: 12,
		    steps: 1
	    };
		
	    var geom = new THREE.ExtrudeGeometry(shape, treadExtrudeOptions);
	    geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	    par.mesh = new THREE.Mesh(geom, par.material);
	}
	
	//подпись
	var textHeight = 30;
	var textBasePoint = newPoint_xy(par.dxfBasePoint, 20, -150);
	addText(par.text, textHeight,  par.dxfArr, textBasePoint);
		
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

function getHingeCount(doorSideHeight){
	if(doorSideHeight >= 2000) return 5;
	else if(doorSideHeight >= 1600) return 4;
	else if(doorSideHeight >= 900) return 3;
	else return 2;
}

function drawSlide(par){
	var nl = par.len;
	var material = par.material;
	_dxfBasePoint = par.dxfBasePoint;
	_dxfPrimitivesArr = par.dxfPrimitivesArr;
	par = getSlideDimensions(nl);
	par.dxfBasePoint = _dxfBasePoint;
	par.dxfArr = _dxfPrimitivesArr;
	par.mesh = new THREE.Object3D();
	
	//неподвижная часть
	var p0 = {x: 0, y: 0}
	var p1 = newPoint_xy(p0, -par.wallPartLen, 0)
	var p2 = newPoint_xy(p1, 0, par.wallPartWidth)
	var p3 = newPoint_xy(p2, par.wallPartLen, 0)


	var shape = new THREE.Shape();
	addLine(shape, par.dxfArr, p0, p1, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p3, p0, par.dxfBasePoint);

	
	//ответстия
	par.holeDiam = 3;
	
	for(var i=0; i<par.wallHoles.length; i++){
		var center = newPoint_xy(p0, -par.wallHoles[i], par.wallPartWidth/2)
		addRoundHole(shape, par.dxfArr, center, par.holeDiam/2, par.dxfBasePoint)		
	}
	
	var extrudeOptions = {
		amount: par.wallPartThk, 
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
		
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, material);
	mesh.rotation.y = -Math.PI/2
	mesh.position.x = 0;
	mesh.position.y = -par.wallPartWidth/2;
	mesh.position.z = -par.startOffset;
	par.mesh.add(mesh);
	
	//подвижная часть
	var p0 = {x: 0, y: 0}
	var p1 = newPoint_xy(p0, -(par.slideLen + 15), 0)
	var p2 = newPoint_xy(p1, 0, par.slideWidth)
	var p3 = newPoint_xy(p2, par.slideLen + 15, 0)
//console.log(p0, p1, p2, p3)

	var shape = new THREE.Shape();
	addLine(shape, par.dxfArr, p0, p1, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p3, p0, par.dxfBasePoint);

	
	//ответстия
	par.holeDiam = 3;
	
	for(var i=0; i<par.boxHoles.length; i++){
		var center = newPoint_xy(p0, -par.boxHoles[i], par.slideWidth/2)
		addRoundHole(shape, par.dxfArr, center, par.holeDiam/2, par.dxfBasePoint)		
		}
	
	var extrudeOptions = {
		amount: par.slideThk, 
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
		};
		
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, material);
	mesh.rotation.y = -Math.PI/2
	mesh.position.x = par.totalThk - par.wallPartThk;
	mesh.position.y = -par.slideWidth/2;
	mesh.position.z = -par.startOffset;
	if(isDoorsOpened) mesh.position.z += par.slideLen;
	
	par.mesh.add(mesh);
	

	return par;

}

//функци возвращает размеры шариковой направляющей в зависимости от длины напраляющей
//схема размеров здесь 6692035.ru/drawings/furniture/slider_Boyard_DB4502.pdf
function getSlideDimensions(nl){
	//длина части, прикручиваемой к стенке (размер А)
	var wallPartLen = nl + 2;
	//длина выдвигания (размер H)
	var slideLen = nl - 17;
	
	//отверстия на стенке
	var wallHoles = [];
	var startOffset = 2;
	var firstHoleOffset = 35;
	wallHoles.push(firstHoleOffset);
	wallHoles.push(firstHoleOffset + 32);
	//размер B
	wallHoles.push(firstHoleOffset + 64);
	//размер С
	if(nl == 550) wallHoles.push(firstHoleOffset + 192);
	//размер D
	if(nl == 300) wallHoles.push(firstHoleOffset + 128);
	if(nl == 350) wallHoles.push(firstHoleOffset + 192);
	if(nl == 400) wallHoles.push(firstHoleOffset + 160);
	if(nl == 450) wallHoles.push(firstHoleOffset + 192);
	if(nl == 500) wallHoles.push(firstHoleOffset + 256);
	if(nl == 550) wallHoles.push(firstHoleOffset + 320);
	//размер I
	if(nl == 400) wallHoles.push(firstHoleOffset + 224);
	if(nl == 450) wallHoles.push(firstHoleOffset + 256);
	if(nl == 500) wallHoles.push(firstHoleOffset + 320);
	if(nl == 550) wallHoles.push(firstHoleOffset + 384);
	
	//отверстия на ящике
	var boxHoles = [];
	//размер E
	boxHoles.push(35)
	//размер F
	if(nl == 300) boxHoles.push(131);
	if(nl == 350) boxHoles.push(163);
	if(nl == 400) boxHoles.push(163);
	if(nl == 450) boxHoles.push(195);
	if(nl == 500) boxHoles.push(227);
	if(nl == 550) boxHoles.push(227);
	//размер G
	if(nl == 300) boxHoles.push(227);
	if(nl == 350) boxHoles.push(291);
	if(nl == 400) boxHoles.push(323);
	if(nl == 450) boxHoles.push(355);
	if(nl == 500) boxHoles.push(419);
	if(nl == 550) boxHoles.push(453);
	
	//формируем возвращаемый объект
	var par = {
		nl: nl,
		wallPartWidth: 45, //ширина неподвижной части
		slideWidth: 20, //щирина выдвижной части
		wallPartThk: 12, //толщина неподвижной части
		slideThk: 9, //толщина выдвижной части
		totalThk: 12.7,	//общая толщина	
		wallPartLen: wallPartLen,
		slideLen: slideLen,
		startOffset: startOffset,
		wallHoles: wallHoles,
		boxHoles: boxHoles,
		}
		
	return par;

}//end of getSlideDimensions


function drawWardrobeLeg(par){
	par.mesh = new THREE.Object3D();
	var segmentsX = 20;
	var segmentsY = 1;
	var openEnded = false;
	var geom = new THREE.CylinderGeometry(par.size/2, par.size/2, par.height, segmentsX, segmentsY, openEnded);
	var pole = new THREE.Mesh(geom, par.material);
	//pole.position.x = par.size/2;
	pole.position.y = - par.height/2;
	//pole.position.z = par.size/2;
	par.mesh.add(pole);
	

return par;
}