function drawPlate(par){

	/*
	функция отрисовывает панель из дсп с кромкой
	par={
		height
		width
		dxfArr
		dxfBasePoint
		text
		material
		edging: {
			top: 0,
			bot: 0,
			right: 0,
			left: 0,
			}
		}
	*/
	
	par.mesh = new THREE.Object3D();
	
	//округляем размеры
	//par.width = Math.floor(par.width);
	//par.height = Math.floor(par.height);
	
	//кромление
	if(!par.edging || simpleDraw){
		par.edging = {
			top: 0,
			bot: 0,
			right: 0,
			left: 0,
			}
		}
		
	var p0 = {x: 0, y: 0}
	var p1 = newPoint_xy(p0, par.edging.left, par.edging.bot);
	var p2 = newPoint_xy(p0, par.edging.left, par.height - par.edging.top)
	var p3 = newPoint_xy(p0, par.width - par.edging.right, par.height - par.edging.top)
	var p4 = newPoint_xy(p0, par.width - par.edging.right, par.edging.bot)

	var shape = new THREE.Shape();

	addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p4, p1, par.dxfBasePoint);
	
	
	//сохраняем размеры без кромки
	par.noEdgingWidth = Math.floor(distance(p1, p4));
	par.noEdgingHeight = Math.floor(distance(p1, p2));
	
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
	var board = new THREE.Mesh(geom, par.material);
	par.mesh.add(board);
	
	
	//кромка
	var edgingMat_04 = new THREE.MeshLambertMaterial( {color: 0x00FF80});
	var edgingMat_1 = new THREE.MeshLambertMaterial( {color: 0xFF0000});	
	var edgingMat_2 = new THREE.MeshLambertMaterial( {color: 0x0000FF}); 
	
	//левая кромка
	
	if(par.edging.left != 0){
		var material = edgingMat_04;
		if(par.edging.left == 1) material = edgingMat_1;
		if(par.edging.left == 2) material = edgingMat_2;
		
		var pos = {
			x: par.edging.left,
			y: par.edging.bot,
			}
	
		var pole3DParams = {
			type: "rect",
			poleProfileY: par.edging.left,
			poleProfileZ: par.thk,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, pos.x, pos.y),
			length: par.height - par.edging.top - par.edging.bot,
			angle: Math.PI / 2,
			material: material,
			dxfArr: dxfPrimitivesArr,
			text: "",
			layer: "edging", //слой для выгрузки в dxf
			}
		var pole = drawPole3D_4_1(pole3DParams).mesh;
		pole.position.x = pos.x;
		pole.position.y = pos.y;
		par.mesh.add(pole);
		}
		
	//правая кромка
	
	if(par.edging.right != 0){
		var material = edgingMat_04;
		if(par.edging.right == 1) material = edgingMat_1;
		if(par.edging.right == 2) material = edgingMat_2;
		
		var pos = {
			x: par.width,
			y: par.edging.bot,
			}
			
		var pole3DParams = {
			type: "rect",
			poleProfileY: par.edging.right,
			poleProfileZ: par.thk,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, pos.x, pos.y),
			length: par.height - par.edging.top - par.edging.bot,
			angle: Math.PI / 2,
			material: material,
			dxfArr: dxfPrimitivesArr,
			text: "",
			layer: "edging",
			}
		var pole = drawPole3D_4_1(pole3DParams).mesh;
		pole.position.x = pos.x;
		pole.position.y = pos.y;
		par.mesh.add(pole);
		}
		
	//нижняя кромка
	
	if(par.edging.bot != 0){
		var material = edgingMat_04;
		if(par.edging.bot == 1) material = edgingMat_1;
		if(par.edging.bot == 2) material = edgingMat_2;
		
		var pos = {
			x: 0,
			y: 0,
			}
			
		var pole3DParams = {
			type: "rect",
			poleProfileY: par.edging.bot,
			poleProfileZ: par.thk,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, pos.x, pos.y),
			length: par.width,
			angle: 0,
			material: material,
			dxfArr: dxfPrimitivesArr,
			text: "",
			layer: "edging",
			}
		var pole = drawPole3D_4_1(pole3DParams).mesh;
		pole.position.x = pos.x;
		pole.position.y = pos.y;
		par.mesh.add(pole);
		}
		
	//верхняя кромка
	
	if(par.edging.top != 0){
		var material = edgingMat_04;
		if(par.edging.top == 1) material = edgingMat_1;
		if(par.edging.top == 2) material = edgingMat_2;
		
		var pos = {
			x: 0,
			y: par.height - par.edging.top,
			}
			
		var pole3DParams = {
			type: "rect",
			poleProfileY: par.edging.top,
			poleProfileZ: par.thk,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, pos.x, pos.y),
			length: par.width,
			angle: 0,
			material: material,
			dxfArr: dxfPrimitivesArr,
			text: "",
			layer: "edging",
			}
		var pole = drawPole3D_4_1(pole3DParams).mesh;
		pole.position.x = pos.x;
		pole.position.y = pos.y;
		par.mesh.add(pole);
		}
	
	
	//площадь
	par.area = par.width * par.height / 1000000;
	//периметр
	par.perim = (par.width + par.height) * 2 / 1000;
	
	//сохраняем данные для спецификации
	var partName = par.partName;
	if(typeof specObj !='undefined' && partName){
		if(!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				name: "ДСП",
				unit: "carcas",
				area: 0,
				perim: 0,
				}
			if(partName == "carcasPanel") specObj[partName].name = "Панель каркаса лдсп";
			if(partName == "mirrow") {
				specObj[partName].name = "Зеркало";
				specObj[partName].unit = "doors";
				}
			if(partName == "boxBotPanel") {
				specObj[partName].name = "Дно ящика двп";
				specObj[partName].unit = "content";
				}
			if(partName == "rearPanel") {
				specObj[partName].name = "Задняя стенка " + params.rearWallMat_wr;
				specObj[partName].unit = "carcas";
				}
			if(partName == "metalBoxPanel") {
				specObj[partName].name = "Боковина ящика мет.";
				specObj[partName].unit = "content";
				}
			if(partName == "boxPanel") {
				specObj[partName].name = "Панель ящика лдсп";
				specObj[partName].unit = "content";
				}
			if(partName == "shelf") {
				specObj[partName].name = "Полка лдсп";
				specObj[partName].unit = "content";
				}
			if(partName == "doorPanel") {
				specObj[partName].name = "Вставка двери лдсп";
				specObj[partName].unit = "doors";
				}
			}

		var name = par.width + "x" + par.height + "х" + par.thk;
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += par.area;
		specObj[partName]["perim"] += par.perim;
		}
		
	//сохраняем данные для ведомости раскроя материалов
	if(typeof boardsList !='undefined' && partName){
		var boardType = "ldsp_carcas";
		if(partName == "mirrow") boardType = "other";
		if(partName == "boxBotPanel") boardType = "dvp";
		if(partName == "rearPanel" && params.rearWallMat_wr == "двп") boardType = "dvp";
		if(partName == "metalBoxPanel") boardType = "other";
		if(partName == "doorPanel") boardType = "ldsp_door";
		
		//формируем массив, если такого еще не было
		if(!boardsList[boardType]) boardsList[boardType] = [];
		
		//формируем информацию о кромке
		par.edging.vertSide = 0; //кол-во вертикальных сторон, закромленных боковой кромкой
		par.edging.vertFace = 0; //кол-во вертикальных сторон, закромленных боковой кромкой
		par.edging.horSide = 0; //кол-во горизонтальных сторон, закромленных боковой кромкой
		par.edging.horFace = 0; //кол-во горизонтальных сторон, закромленных боковой кромкой
		
		if(par.edging.top == params.faceEdging) par.edging.horFace += 1;
		if(par.edging.top == params.sideEdging) par.edging.horSide += 1;
		if(par.edging.bot == params.faceEdging) par.edging.horFace += 1;
		if(par.edging.bot == params.sideEdging) par.edging.horSide += 1;
		if(par.edging.right == params.faceEdging) par.edging.vertFace += 1;
		if(par.edging.right == params.sideEdging) par.edging.vertSide += 1;
		if(par.edging.left == params.faceEdging) par.edging.vertFace += 1;
		if(par.edging.left == params.sideEdging) par.edging.vertSide += 1;
		
		//если фасадная и боковая кромка одинаковые, считаем что вся боковая
		if(params.faceEdging == params.sideEdging){
			par.edging.vertFace = 0;
			par.edging.horFace = 0;
			}
		
		//если задана нулевая толщина лицевой кромки
		if(params.faceEdging == 0){
			par.edging.vertFace = 0;
			par.edging.horFace = 0;
			}
		//если задана нулевая толщина боковой кромки
		if(params.sideEdging == 0){
			par.edging.vertSide = 0;
			par.edging.horSide = 0;
			}
		
		par.description = [];
		par.description.push(par.text);
		par.amt = 1;
		
		boardsList[boardType].push(par);	
		
		}

	
	return par;
	

}//end of drawPlate

function drawNoRectPlate(par){

	/*
	функция отрисовывает панель из дсп с кромкой
	par={
		heightLeft
		width
		dxfArr
		dxfBasePoint
		text
		material
		topAng
		botAng
		}
	*/
	
	par.mesh = new THREE.Object3D();
	
	
	var p0 = {x: 0, y: 0}
	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p0, 0, par.heightLeft)
	var p3 = newPoint_x1(p2, par.width, par.topAng)
	var p4 = newPoint_x1(p1, par.width, par.botAng)

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
	var board = new THREE.Mesh(geom, par.material);
	par.mesh.add(board);
	
	
	return par;
	

}//end of drawNoRectPlate

function drawPole3D_4_1(par) {

	/*
	функция отрисовывает прямоугольную палку
	var pole3DParams = {
		type: "rect",
		poleProfileY: 40,
		poleProfileZ: 60,
		dxfBasePoint: railingSectionParams.dxfBasePointHandrail,
		length: 1000,
		poleAngle: 0,
		material: railingMaterial,
		dxfArr: dxfPrimitivesArr,
		}
		*/
	//console.log(par)
	if(par.angle == undefined) par.angle = 0;
	if(par.poleAngle == undefined) par.poleAngle = 0;

	par.mesh = new THREE.Object3D();
	
    var pole3DExtrudeOptions = {
        amount: par.poleProfileZ,
        bevelEnabled: false,
        curveSegments: 12,
        steps: 1
		};

	var p0 = { x: 0, y: 0 };
	var p1 = polar(p0, par.angle + Math.PI / 2, par.poleProfileY);
	var p2 = polar(p1, par.angle, par.length);
	var p3 = polar(p0, par.angle, par.length);

	 
	var shape = new THREE.Shape();
	//слой в dxf куда добавляются линии
	if(!par.layer) par.layer = "parts";
	addLine(shape, par.dxfArr, p0, p1, par.dxfBasePoint, par.layer);
	addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint, par.layer);
	addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint, par.layer);
	addLine(shape, par.dxfArr, p3, p0, par.dxfBasePoint, par.layer);

    /*прямоугольная палка*/
    if (par.type != "round") {
        var poleGeometry = new THREE.ExtrudeGeometry(shape, pole3DExtrudeOptions);
        poleGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
        var pole = new THREE.Mesh(poleGeometry, par.material);
        pole.rotation.z = par.poleAngle;
		}
    /*круглая палка*/
    if (par.type == "round") {
        var poleRadius = par.poleProfileY / 2;
        var radiusTop = poleRadius;
        var radiusBottom = poleRadius;
        var height = par.length;
        var segmentsX = 20;
        var segmentsY = 0;
        var openEnded = false;
        var poleGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segmentsX, segmentsY, openEnded);
        var pole = new THREE.Mesh(poleGeometry, par.material);
        pole.rotation.z = par.poleAngle - Math.PI / 2;
		pole.position.x = (par.length / 2 * Math.cos(par.poleAngle) - par.poleProfileY / 2 * Math.sin(par.poleAngle));
		pole.position.y = (par.length / 2 * Math.sin(par.poleAngle) + par.poleProfileY / 2 * Math.cos(par.poleAngle));
        pole.position.z = poleRadius;
		}
	
	//добавляем подпись в dxf файл
	if(par.text){		
		var textHeight = 30;
		var textBasePoint = newPoint_xy(par.dxfBasePoint, 40, -200);
		addText(par.text, textHeight, par.dxfArr, textBasePoint);
		}

	if(par.boxId != undefined) pole.boxId = par.boxId;
	par.mesh.add(pole);
	
	//сохраняем данные для спецификации
	var partName = par.partName;
	if(typeof specObj !='undefined' && partName){
		if(!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				name: "Профиль",
				unit: "doors",
				}
			if(partName == "botCoupeProf") specObj[partName].name = "Нижний профиль двери";
			if(partName == "topCoupeProf") specObj[partName].name = "Верхний профиль двери";
			if(partName == "vertCoupeProf") specObj[partName].name = "Вертикальный профиль двери";
			if(partName == "inpostCoupeProf") specObj[partName].name = "Разделительный профиль";
			if(partName == "rail") {
				specObj[partName].name = "Штанга хром";
				specObj[partName].unit = "carcas";
				}
			
			
			}
		var name = Math.round(par.poleProfileZ) + "x" + Math.round(par.poleProfileY) + "х" + Math.round(par.length);
		if(par.type == "round") name = "Ф" + Math.round(par.poleProfileY) + "х" + Math.round(par.length);
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["sumLength"] += Math.round(par.length) / 1000;
		}

    return par;
} //end of drawPole3D_4_1


function drawCornerPlate(par){
	
	//функция отрисовывает нижнюю и верхнюю панель углового шкафа
	var shape = new THREE.Shape();
	var p0 = {x: 0, y: 0}
//	console.log(par)
	//левый дальний угол
	var p1 = newPoint_xy(p0, par.leftOffset, 0)
	//угол
	var p2 = newPoint_xy(p0, params.leftSectWidth + params.leftWidth, 0)
	//правый дальний угол
	var p3 = newPoint_xy(p2, 0, params.rightWidth + params.rightSectWidth - par.rightOffset, 0)	
	//правый ближний угол
	var p4 = newPoint_xy(p3, -params.rightDepth, 0);	
	//правый внутренний угол
	var p5 = newPoint_xy(p4, 0, -params.rightSectWidth);	
	//левый внутренний угол
	var p6 = newPoint_xy(p1, params.leftSectWidth, params.depth_wr);
	//левый ближний угол
	var p7 = newPoint_xy(p1, 0, params.depth_wr);
	
//	console.log(p1, p2, p3, p4, p5, p6, p7)
	//правая доп.секция
	if(params.rightSect == "треугольная") {
		var p41 = newPoint_xy(p3, -100, 0);
		var p42 = newPoint_xy(p5, 0, 100);
		}
	if(params.rightSect == "радиусная"){
		var rad4 = Math.min(params.rightSectWidth, params.rightDepth) - 20;
		var p41 = newPoint_xy(p4, rad4, 0);
		var p42 = newPoint_xy(p4, 0, -rad4);
		var center4 = newPoint_xy(p4, rad4, -rad4);
		};
	
	//левая доп. секция
	if(params.leftSect == "треугольная"){
		var p71 = newPoint_xy(p6, -100, 0);
		var p72 = newPoint_xy(p1, 0, 100);
		}
	if(params.leftSect == "радиусная"){
		var rad7 = Math.min(params.leftSectWidth, params.depth_wr) - 20;
		var p71 = newPoint_xy(p7, rad7, 0);
		var p72 = newPoint_xy(p7, 0, -rad7);
		var center7 = newPoint_xy(p7, rad7, -rad7);
		};
		
	//диагональ
	var doorRad = 0;
	var angStart = 0;
	var angEnd = 0;
	
	if(params.diagDoorType == "выпуклая" || params.diagDoorType == "вогнутая"){
	var dist = distance(p5, p6)
	var ang = angle(p5, p6)
	doorRad = params.diagDoorRad;
	if(doorRad < dist/2 + 20) doorRad = dist/2 + 20;
//	console.log(dist, doorRad)
	var centerOffset = Math.sqrt(doorRad * doorRad - dist/2 * dist/2);
	var midPoint = polar(p6, ang, dist/2);
	
	if(params.diagDoorType == "выпуклая"){
		var center = polar(midPoint, ang + Math.PI / 2, -centerOffset);
		angStart = angle(center, p5);
		angEnd = angle(center, p6) + Math.PI;
		if(angStart < 0) angStart += Math.PI;
		if(angEnd < 0) angEnd += Math.PI;
		}
	if(params.diagDoorType == "вогнутая"){
		var center = polar(midPoint, ang + Math.PI / 2, centerOffset);
		angStart = angle(center, p5);
		angEnd = angle(center, p6);
		}
		
	}
	
	//задняя линия левой стороны
	addLine(shape, dxfPrimitivesArr, p1, p2, par.dxfBasePoint); 
	//задняя линия правой стороны
	addLine(shape, dxfPrimitivesArr, p2, p3, par.dxfBasePoint);
	//доп.секция правой стороны
	if(params.rightSect == "треугольная"){
		addLine(shape, dxfPrimitivesArr, p3, p41, par.dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p41, p42, par.dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p42, p5, par.dxfBasePoint);	
		}
	if(params.rightSect == "радиусная"){
		addLine(shape, dxfPrimitivesArr, p3, p41, par.dxfBasePoint);
		addArc(shape, dxfPrimitivesArr, center4, rad4, Math.PI / 2, Math.PI, par.dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p42, p5, par.dxfBasePoint);
		};
	if(params.rightSect == "прямая"){
		addLine(shape, dxfPrimitivesArr, p3, p4, par.dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p4, p5, par.dxfBasePoint);
		}
	if(params.rightSect == "нет"){
		addLine(shape, dxfPrimitivesArr, p3, p5, par.dxfBasePoint);
		}
	
	//диагональ
	
	if(params.diagDoorType == "выпуклая" || params.diagDoorType == "вогнутая"){
		addArc(shape, dxfPrimitivesArr, center, doorRad, angStart, angEnd, par.dxfBasePoint);
		}
	else addLine(shape, dxfPrimitivesArr, p5, p6, par.dxfBasePoint);
	
	//доп. секция левой стороны
	if(params.leftSect == "треугольная"){
		addLine(shape, dxfPrimitivesArr, p6, p71, par.dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p71, p72, par.dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p72, p1, par.dxfBasePoint);	
		}
	if(params.leftSect == "радиусная"){
		addLine(shape, dxfPrimitivesArr, p6, p71, par.dxfBasePoint);
		addArc(shape, dxfPrimitivesArr, center7, rad7, Math.PI / 2, Math.PI, par.dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p72, p1, par.dxfBasePoint);
		};
	if(params.leftSect == "прямая"){
		addLine(shape, dxfPrimitivesArr, p6, p7, par.dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p7, p1, par.dxfBasePoint);
		}
	if(params.leftSect == "нет"){
		addLine(shape, dxfPrimitivesArr, p6, p1, par.dxfBasePoint);
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
	
	par.width = distance(p1, p2)
	par.height = distance(p2, p3)
	par.doorRad = doorRad;
	par.angStart = angStart;
	par.angEnd = angEnd;
	par.center = center;
	par.diagAngle = angle(p5, p6)
	par.diagLen = distance(p5, p6)
	par.diagBasePoint = p6;
	
	return par;

}

function drawCornerShelf(par){
	/*
	//функция отрисовывает уголовую полку дополнительной секции
	var shelfPar = {
		type
		width
		depth
		thk
		material
		basePoint
		}
*/

	par.mesh = new THREE.Object3D();

	var edgingThk = params.faceEdging;
	if(simpleDraw) edgingThk = 0; //не отрисовываем кромку на упрощенной визуализации
	
	var shape = new THREE.Shape();
	var rad = Math.min(par.depth, par.width) - edgingThk;
	var p0 = {x: 0, y: 0} //внутренний угол
	var p1 = newPoint_xy(p0, 0, par.depth - edgingThk);
	var p2 = newPoint_xy(p0, par.width - edgingThk, par.depth - edgingThk);
	var p3 = newPoint_xy(p0, par.width - edgingThk, 0);
	
	var p11 = newPoint_xy(p2, -rad, 0);
	var p31 = newPoint_xy(p2, 0, -rad);
	var center = newPoint_xy(p2, -rad, -rad);
	
	//параметры кромки
	var edgingMat_04 = new THREE.MeshLambertMaterial( {color: 0x00FF80});
	var edgingMat_1 = new THREE.MeshLambertMaterial( {color: 0xFF0000});	
	var edgingMat_2 = new THREE.MeshLambertMaterial( {color: 0x0000FF}); 
	
	var edgingMat = edgingMat_04;
	if(edgingThk == 1) edgingMat = edgingMat_1;
	if(edgingThk == 2) edgingMat = edgingMat_2;
		
	
	
	if(par.type == "радиусная"){
		addLine(shape, dxfPrimitivesArr, p0, p1, par.dxfBasePoint);
		if(p1.x != p11.x) addLine(shape, dxfPrimitivesArr, p1, p11, par.dxfBasePoint);
		addArc(shape, dxfPrimitivesArr, center, rad, Math.PI / 2, 0, par.dxfBasePoint);
		if(p3.y != p31.y) addLine(shape, dxfPrimitivesArr, p31, p3, par.dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p3, p0, par.dxfBasePoint);
		
		if(!simpleDraw){
			//кромка
			if(p1.x != p11.x) {
				var pos = copyPoint(p1);		
				var pole3DParams = {
					type: "rect",
					poleProfileY: edgingThk,
					poleProfileZ: par.thk,
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, pos.x, pos.y),
					length: distance(p1, p11),
					angle: 0,
					material: edgingMat,
					dxfArr: dxfPrimitivesArr,
					text: "",
					layer: "edging", //слой для выгрузки в dxf
					}
				var pole = drawPole3D_4_1(pole3DParams).mesh;
				pole.position.x = pos.x;
				pole.position.y = pos.y;
				par.mesh.add(pole);
				console.log(pole)
				}
			
			//кромка радиусного участка
			var pos = copyPoint(center);
			
			var polePar = {
				rad: rad + edgingThk / 2,
				height: par.thk,
				thk: edgingThk,
				angle: Math.PI / 2,
				dxfBasePoint: newPoint_xy(par.dxfBasePoint, pos.x, pos.y),
				text: "Дверь",
				material: edgingMat,
				layer: "edging", //слой для выгрузки в dxf
				}	
			
			var pole = drawArcPanel(polePar).mesh;
			//pole.rotation.x = Math.PI / 2;
			//pole.rotation.z = botPlatePar.angStart;
			pole.position.x = pos.x;
			pole.position.y = pos.y;
			//pole.position.z = botPlatePar.center.y;
			par.mesh.add(pole);
		
			if(p3.y != p31.y){
				var pos = newPoint_xy(p3, edgingThk, 0);	
				var pole3DParams = {
					type: "rect",
					poleProfileY: edgingThk,
					poleProfileZ: par.thk,
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, pos.x, pos.y),
					length: distance(p3, p31),
					angle: Math.PI / 2,
					material: edgingMat,
					dxfArr: dxfPrimitivesArr,
					text: "",
					layer: "edging", //слой для выгрузки в dxf
					}
				var pole = drawPole3D_4_1(pole3DParams).mesh;
				pole.position.x = pos.x;
				pole.position.y = pos.y;
				par.mesh.add(pole);
				
				}
			} //конец кромки
		} //конец радиусной полки
	
	if(par.type == "треугольная"){
		addLine(shape, dxfPrimitivesArr, p0, p1, par.dxfBasePoint);
		if(p1.x != p11.x) addLine(shape, dxfPrimitivesArr, p1, p11, par.dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p11, p31, par.dxfBasePoint);
		if(p3.y != p31.y) addLine(shape, dxfPrimitivesArr, p31, p3, par.dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p3, p0, par.dxfBasePoint);
		
		
		//кромка
		if(!simpleDraw){
			if(p1.x != p11.x) {
				var pos = copyPoint(p1);		
				var pole3DParams = {
					type: "rect",
					poleProfileY: edgingThk,
					poleProfileZ: par.thk,
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, pos.x, pos.y),
					length: distance(p1, p11),
					angle: 0,
					material: edgingMat,
					dxfArr: dxfPrimitivesArr,
					text: "",
					layer: "edging", //слой для выгрузки в dxf
					}
				var pole = drawPole3D_4_1(pole3DParams).mesh;
				pole.position.x = pos.x;
				pole.position.y = pos.y;
				par.mesh.add(pole);
				}
			if (p3.y != p31.y) {
				var pos = newPoint_xy(p3, edgingThk, 0);
				var pole3DParams = {
					type: "rect",
					poleProfileY: edgingThk,
					poleProfileZ: par.thk,
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, pos.x, pos.y),
					length: distance(p3, p31),
					angle: Math.PI / 2,
					material: edgingMat,
					dxfArr: dxfPrimitivesArr,
					text: "",
					layer: "edging", //слой для выгрузки в dxf
				}
				var pole = drawPole3D_4_1(pole3DParams).mesh;
				pole.position.x = pos.x;
				pole.position.y = pos.y;
				par.mesh.add(pole);
				
				//2-й участок
				pole3DParams.length = distance(p1, p31);
				pole3DParams.angle = angle(p1, p31);
				pos = copyPoint(p1);
				pole = drawPole3D_4_1(pole3DParams).mesh;
				pole.position.x = pos.x;
				pole.position.y = pos.y;
				par.mesh.add(pole);
				}
			}
		}
		
	if(par.type == "прямая"){
		addLine(shape, dxfPrimitivesArr, p0, p1, par.dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p1, p2, par.dxfBasePoint);		
		addLine(shape, dxfPrimitivesArr, p2, p3, par.dxfBasePoint);
		addLine(shape, dxfPrimitivesArr, p3, p0, par.dxfBasePoint);
		
		if(!simpleDraw){
		//кромка
		var pos = newPoint_xy(p3, edgingThk, 0);
		var pole3DParams = {
			type: "rect",
			poleProfileY: edgingThk,
			poleProfileZ: par.thk,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, pos.x, pos.y),
			length: distance(p3, p2),
			angle: Math.PI / 2,
			material: edgingMat,
			dxfArr: dxfPrimitivesArr,
			text: "",
			layer: "edging", //слой для выгрузки в dxf
		}
		var pole = drawPole3D_4_1(pole3DParams).mesh;
		pole.position.x = pos.x;
		pole.position.y = pos.y;
		par.mesh.add(pole);
		
		//2-й участок
		pole3DParams.length = distance(p1, p2);
		pole3DParams.angle = 0;
		pos = copyPoint(p1);
		pole = drawPole3D_4_1(pole3DParams).mesh;
		pole.position.x = pos.x;
		pole.position.y = pos.y;
		par.mesh.add(pole);
		}
	}
		
	var extrudeOptions = {
		amount: par.thk, 
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
		};
		
		
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var shelf = new THREE.Mesh(geom, par.material);
	par.mesh.add(shelf);
	
	//площадь
	par.area = par.width * par.depth / 1000000;
	//периметр
	par.perim = (par.width + par.depth) * 2 / 1000;
	
	//сохраняем данные для спецификации
	var partName = "curvePanel";
	if(typeof specObj !='undefined' && partName){
		if(!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				area: 0,
				perim: 0,
				name: "Криволинейная панель",
				unit: "carcas",
				}
			}
		var name = Math.round(par.width) + "x" + Math.round(par.depth) + "х" + Math.round(par.thk);
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += par.area;
		specObj[partName]["perim"] += par.perim;
		}
		
	return par;
	
}



function drawDoorProf(par){
	
	//функция отрисовывает верхний и нижний направляющие раздвижных дверей

	if(par.type == "top"){
		var parts = [];
		par.profWidth = 82;
		//дно
		var partSize = {
			height: 2,
			width: par.profWidth,
			posY: -2,
			posZ: 0,
			}
		parts.push(partSize) 
		
		//перегородки
		var partSize = {
			height: 40,
			width: 2,
			posY: -40,
			posZ: 0,
			}
		parts.push(partSize)
		
		var partSize = {
			height: 40,
			width: 2,
			posY: -40,
			posZ: 40,
			}
		parts.push(partSize)
		
		var partSize = {
			height: 40,
			width: 2,
			posY: -40,
			posZ: 80,
			}
		parts.push(partSize)
		par.poleProfileZ = 80;
		par.poleProfileY = 40;
		var text = "Верхняя направляющая"
		}
		
	if(par.type == "bot"){
		var parts = [];
		par.profWidth = 61;
		//дно
		var partSize = {
			height: 2,
			width: par.profWidth,
			posY: 0,
			posZ: 0,
			}
		parts.push(partSize)
		
		//перегородки
		var partSize = {
			height: 6,
			width: 8,
			posY: 0,
			posZ: 0,
			}
		parts.push(partSize)
		
		var partSize = {
			height: 6,
			width: 8,
			posY: 0,
			posZ: 12,
			}
		parts.push(partSize)
		
		var partSize = {
			height: 6,
			width: 8,
			posY: 0,
			posZ: 41,
			}
		parts.push(partSize)
		
		var partSize = {
			height: 6,
			width: 8,
			posY: 0,
			posZ: 53,
			}
		parts.push(partSize)
		par.poleProfileZ = 61;
		par.poleProfileY = 6;
		var text = "Нижняя направляющая"
		}	
	
	var dxfBasePoint = par.dxfBasePoint;
	var metalMaterial = new THREE.MeshLambertMaterial({color: 0x363636, wireframe: false});
	par.mesh = new THREE.Object3D();
	var y0 = par.dxfBasePoint.y;
	
	for(var i=0; i<parts.length; i++){
		par.dxfBasePoint.y = y0 + parts[i].posZ;
		var pole3DParams = {
			type: "rect",
			poleProfileY: parts[i].width,
			poleProfileZ: parts[i].height,
			dxfBasePoint: par.dxfBasePoint,
			length: par.len,
			poleAngle: 0,
			material: metalMaterial,
			dxfArr: dxfPrimitivesArr,
			text: "",
			}
		if(i == 0) pole3DParams.text = text;
		var pole = drawPole3D_4_1(pole3DParams).mesh;
		pole.rotation.x = -Math.PI / 2;
		pole.position.y = parts[i].posY;
		pole.position.z = -parts[i].posZ + par.profWidth / 2;
		par.mesh.add(pole);
		
		
		}
	
	par.doorDist = 40;
	
	
	//сохраняем данные для спецификации
	var partName = "topRail";
	if(par.type == "bot") partName = "botRail"
	if(typeof specObj !='undefined' && partName){
		if(!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				sumLength: 0,
				name: "Верхняя направляющая",
				unit: "doors",
				}
			if(partName == "botRail") specObj[partName].name = "Нижняя напрвляющая";
			}
		var name = Math.round(par.poleProfileZ) + "x" + Math.round(par.poleProfileY) + "х" + Math.round(par.len);
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["sumLength"] += Math.round(par.len) / 1000;
		}
		
	return par;

}//end of drawDoorProf


function drawFixPart(par){
	/*
	//функция отрисовывает крепежный элемент: уголок, конфирмат, полкодержатель, опору М8
	var fixPartPar = {
		type: "angle" || "screw" || "shelfPin" || "legM8"
		}
*/
	
	par.dxfArr = [];
	par.dxfBasePoint = {x:0, y:0}
	var partName = par.type;
	
	par.mesh = new THREE.Object3D();
	var material = new THREE.MeshLambertMaterial( {color: 0x0000FF}); 

	if(par.type == "angle"){
		var sideLen = 12;
		var sideThk1 = 2; //толщина полки уголка на краю
		var sideThk2 = 4; //толщина полки уголка в углу
		var thk = 10;
		
		var shape = new THREE.Shape();
		var p0 = {x: 0, y: 0} //внутренний угол
		var p1 = newPoint_xy(p0, 0, sideLen);
		var p2 = newPoint_xy(p1, sideLen, 0);
		var p3 = newPoint_xy(p2, 0, -sideThk1);
		var p4 = newPoint_xy(p1, sideThk2, -sideThk2);
		var p5 = newPoint_xy(p0, sideThk1, 0);
		
		addLine(shape, par.dxfArr, p0, p1, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p4, p5, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p5, p0, par.dxfBasePoint);
		
		var extrudeOptions = {
			amount: thk,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
			};
			
		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var angle = new THREE.Mesh(geom, material);
		
		par.mesh.add(angle)
		
		//размеры для позиционирования
		par.sizeX = sideLen;
		par.sizeY = sideLen;
		par.sizeZ = thk;
		partName = "fixAngle"
	
		}
	
	if(par.type == "screw"){
		var diam = 6;
		var len = 50;		
		}
		
	if(par.type == "shelfPin"){
		var diam = 5;
		var len = 12;
		}
	
	if(par.type == "legM8"){
		var diam = 8;
		var len = 20;
		var diam2 = 20;
		var len2 = 5;
		}
	
	if(par.type != "angle"){
		var segmentsX = 20;
		var segmentsY = 1;
		var openEnded = false;
		var geom = new THREE.CylinderGeometry(diam/2, diam/2, len, segmentsX, segmentsY, openEnded);
		var pole = new THREE.Mesh(geom, material);
		pole.position.y = len/2;
		par.mesh.add(pole);
		
		//пятка опоры М8
		if(par.type == "legM8"){
			var geom = new THREE.CylinderGeometry(diam2/2, diam2/2, len2, segmentsX, segmentsY, openEnded);
			var pole = new THREE.Mesh(geom, material);
			pole.position.y = len2/2;
			par.mesh.add(pole);
			}
		
		//размеры для позиционирования
		par.sizeY = len;
		}
	
	

	
	//сохраняем данные для спецификации

	if(typeof specObj !='undefined' && partName){
		if(!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Крепежный уголок",
				unit: "content",
				}
			}
		if(partName == "screw") specObj[partName].name = "Конфирмат"
		if(partName == "legM8") specObj[partName].name = "Опора рег."
		
		var name = Math.round(par.sizeX) + "x" + Math.round(par.sizeY) + "х" + Math.round(par.sizeZ);
		if(partName != "fixAngle") var name = diam + "х" + len;
		
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		}
		
	return par;
	
} //end of drawFixPart


function drawWardrobeLeg(par){
	par.mesh = new THREE.Object3D();
	var segmentsX = 20;
	var segmentsY = 1;
	var openEnded = false;
	var geom = new THREE.CylinderGeometry(par.size/2, par.size/2, par.height, segmentsX, segmentsY, openEnded);
	var pole = new THREE.Mesh(geom, par.material);
	pole.position.y = par.height/2;
	par.mesh.add(pole);
return par;
}

function drawJokerFitting(par){
	par.mesh = new THREE.Object3D();
	
	var sideFactor = 1;
	if(par.side == "right" || par.side == "top") sideFactor = -1;
	var metalMaterial = new THREE.MeshLambertMaterial({color: 0x363636, wireframe: false});
	
	var rad = 30;
	var endLen = 5;
	var segmentsX = 20;
	var segmentsY = 0;
	var openEnded = false;
	var offset = endLen / 2;
	var poleDiam = 25

	if(par.type == "фланец"){
		};
	if(par.type == "тройник"){
		rad = 20;
		endLen = 40 + poleDiam + 5;
		offset = endLen / 2 - poleDiam - 5;
		};
	if(par.type == "крест"){
		rad = 20;
		endLen = 40 + poleDiam + 40;
		offset = -poleDiam / 2;
		};

	console.log(sideFactor)
	var geom = new THREE.CylinderGeometry(rad, rad, endLen, segmentsX, segmentsY, openEnded);
	var fitting = new THREE.Mesh(geom, metalMaterial);
	if(par.side == "right" || par.side == "left"){
		fitting.rotation.z = - Math.PI / 2;
		fitting.position.x = offset * sideFactor;		
		fitting.position.y = poleDiam / 2;
		}
	
	
	if(par.side == "top" || par.side == "bot"){
		fitting.position.x = -poleDiam / 2;
		fitting.position.y = offset * sideFactor;
		console.log(par.side, fitting.position.y)
		}
	par.mesh.add(fitting); 

	//сохраняем данные для спецификации
	var partName = "jokerFitting";
	if(par.type == "фланец") partName = "jokerFlan";
	if(typeof specObj !='undefined' && partName){
		if(!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Соединитель",
				unit: "content",
				}
			}
		var name = par.type;
		if(par.type == "фланец") {
			specObj[partName].name = "Фланец";
			name = "Ф25";
			}
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		}
		
	
	return par

};

function drawShelfAngles(par){
	/*
	depth
	width
	pos: "bot"
	
	*/

	par.mesh = new THREE.Object3D()
	
		//крепеж
	var fixOffset = 40;
	var fixPar = {
		type: "angle"
		}
	//уголки снизу панели
	if(par.pos == "bot"){
		//левая сторона
		var angle = drawFixPart(fixPar).mesh;
		angle.position.y = -fixPar.sizeY
		angle.position.z = fixOffset
		par.mesh.add(angle);
		
		var angle = drawFixPart(fixPar).mesh;
		angle.position.y = -fixPar.sizeY
		angle.position.z = par.depth - fixPar.sizeZ - fixOffset
		par.mesh.add(angle);
		
		//правая сторона
		var angle = drawFixPart(fixPar).mesh;
		angle.rotation.z = -Math.PI / 2;
		angle.position.x = par.width - fixPar.sizeX
		angle.position.z = fixOffset
		par.mesh.add(angle);
		
		var angle = drawFixPart(fixPar).mesh;
		angle.rotation.z = -Math.PI / 2;
		angle.position.x = par.width - fixPar.sizeX
		angle.position.z = par.depth - fixPar.sizeZ - fixOffset
		par.mesh.add(angle);
		}
		
	return par;
} //end of drawShelfAngles

function drawWallFixParts(par){
	/*
	height
	width
	botFixType
	*/
	par.mesh = new THREE.Object3D()
	
		//крепеж
	var fixOffset = 40;
	var fixPar = {
		type: "screw"
		}
	
	//верх
	var screw = drawFixPart(fixPar).mesh;
	screw.position.y = par.height - fixPar.sizeY + 0.1;
	screw.position.z = fixOffset;
	par.mesh.add(screw);
	
	var screw = drawFixPart(fixPar).mesh;
	screw.position.y = par.height - fixPar.sizeY + 0.1;
	screw.position.z = par.width - fixOffset;
	par.mesh.add(screw);
	
	//низ
	fixPar.type = par.botFixType;
	
	var screw = drawFixPart(fixPar).mesh;
	screw.position.y = 0;
	screw.position.z = fixOffset;
	par.mesh.add(screw);
	
	var screw = drawFixPart(fixPar).mesh;
	screw.position.y = 0;
	screw.position.z = par.width - fixOffset;
	par.mesh.add(screw);
	
	
	return par;

} //end of drawWallFixParts




