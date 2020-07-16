/*Версия библиотеки 1.6*/

/*** ОСНОВНЫЕ ФУНКЦИИ, ИСПОЛЬЗУЕМЫ НАПРЯМУЮ ***/



/*Функция отрисовки гнутого уголка с отверстиями*/

function drawAngleSupport_(angleModel){
/*исходные данные - модель уголка:
	У2-40х40х230
	У2-40х40х200
	У2-40х40х160
	У2-40х40х90
	У4-60х60х100
	У4-70х70х100
	У5-60х60х100
*/

if(!dxfBasePoint.x || !dxfBasePoint.y) dxfBasePoint = {x:0,y:0};
	
var partParams = {
    height:40,
	holeDiam1:7,
	holeDiam2:13,
	hole1Y:15,
    hole2Y:20,
	metalThickness:3
	}
   
	if (angleModel == "У2-40х40х230"){
	partParams.width = 230;
	partParams.holeDist1 = 200;
	partParams.holeDist2 = 180;
	}
   
	if (angleModel == "У2-40х40х200"){
	partParams.width = 200;
	partParams.holeDist1 = 170;
	partParams.holeDist2 = 150;
	}
		
	if (angleModel == "У2-40х40х160"){
	partParams.width = 160;
	partParams.holeDist1 = 130;
	partParams.holeDist2 = 110;
	}
	
	if (angleModel == "У2-40х40х90"){
	partParams.width = 90;
	partParams.holeDist1 = 60;
	partParams.holeDist2 = 50;
	}	

	if (angleModel == "У4-60х60х100"){
	partParams.width = 100;
	partParams.holeDist1 = 60;
	partParams.holeDist2 = 60;
	partParams.height = 60,
	partParams.holeDiam1 = 13,
	partParams.holeDiam2 = 13,
	partParams.hole1Y = 30,
	partParams.hole2Y = 30,
	partParams.metalThickness = 8
	}	
   
	if (angleModel == "У4-70х70х100"){ //добавить рисование овальных отверстий
	partParams.width = 100;
	partParams.holeDist1 = 60;
	partParams.holeDist2 = 60;
	partParams.height = 70,
	partParams.holeDiam1 = 0,
	partParams.holeDiam2 = 13,
	//partParams.hole1Y = 30,
	partParams.hole2Y = 20,
	partParams.metalThickness = 8
	}
		
	if (angleModel == "У5-60х60х100"){
	partParams.width = 100;
	partParams.holeDist1 = 60;
	partParams.holeDist2 = 0;
	partParams.height = 60,
	partParams.holeDiam1 = 13,
	partParams.holeDiam2 = 23,
	partParams.hole1Y = 30,
	partParams.hole2Y = 23,
	partParams.metalThickness = 8
   }
		
// Уголок деталь изгиб
		dxfBasePoint.x = 0;
		dxfBasePoint.y = 0;
		
		var shape = drawAngleSupportCentr(partParams.width, partParams.metalThickness);//передаваемые параметры (width, metalThickness)
		
		var extrudeOptions = {
		amount: partParams.width,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
		};
		
	    var angleSupportCentrGeometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		
		angleSupportCentrGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		
		var angleSupport1 = new THREE.Mesh(angleSupportCentrGeometry, params.materials.metal);
		angleSupport1.position.x = 0;
		angleSupport1.position.y = 0;		
		angleSupport1.position.z = 0;
		
		angleSupport1.rotation.x = Math.PI/2;
		angleSupport1.rotation.y = Math.PI/2;
		angleSupport1.rotation.z = 0;
		
		//meshes.push(angleSupport1);	
		
// Уголок деталь полка 1
		dxfBasePoint.x = 0;
		dxfBasePoint.y = -100;
		var shape = drawAngleSupportSide(partParams.width, partParams.height, partParams.holeDist1, partParams.hole1Y, partParams.holeDiam1, partParams.metalThickness);//передаваемые параметры (width, height, holeDist, hole1Y, holeDiam, metalThickness)

/*добавление овальных отверстий*/

if (angleModel == "У4-70х70х100"){

	var holeWidth = 13;

/*первое отверстие*/
	var hole1 = new THREE.Path();
	var center1 = {x:20, y:19};
	var center2 = newPoint_xy(center1, 0, 10);
	var p1 = newPoint_xy(center1, holeWidth/2, 0);
	var p2 = newPoint_xy(center2, holeWidth/2, 0);
	var p3 = newPoint_xy(center2, -holeWidth/2, 0);
	var p4 = newPoint_xy(center1, -holeWidth/2, 0);	
	addLine(hole1, dxfPrimitivesArr0, p1, p2, dxfBasePoint)
	addArc(hole1, dxfPrimitivesArr0, center2, holeWidth/2, 0, Math.PI, dxfBasePoint)	
	addLine(hole1, dxfPrimitivesArr0, p3, p4, dxfBasePoint)
	addArc(hole1, dxfPrimitivesArr0, center1, holeWidth/2, Math.PI, Math.PI*2, dxfBasePoint)
	shape.holes.push(hole1);
	
/*второе отверстие*/
	var hole2 = new THREE.Path();
	var center1 = {x:80, y:19};
	var center2 = newPoint_xy(center1, 0, 10);
	var p1 = newPoint_xy(center1, holeWidth/2, 0);
	var p2 = newPoint_xy(center2, holeWidth/2, 0);
	var p3 = newPoint_xy(center2, -holeWidth/2, 0);
	var p4 = newPoint_xy(center1, -holeWidth/2, 0);	
	addLine(hole2, dxfPrimitivesArr0, p1, p2, dxfBasePoint)
	addArc(hole2, dxfPrimitivesArr0, center2, holeWidth/2, 0, Math.PI, dxfBasePoint)	
	addLine(hole2, dxfPrimitivesArr0, p3, p4, dxfBasePoint)
	addArc(hole2, dxfPrimitivesArr0, center1, holeWidth/2, Math.PI, Math.PI*2, dxfBasePoint)
	shape.holes.push(hole2);

}
		var extrudeOptions = {
		amount: partParams.metalThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
		};
		
		var angleSupportGeometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		
		angleSupportGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		
		var angleSupport2 = new THREE.Mesh(angleSupportGeometry, params.materials.metal);
		angleSupport2.position.x = 0;
		angleSupport2.position.y = partParams.metalThickness*2;		
		angleSupport2.position.z = 0;
		
		angleSupport2.rotation.x = 0;
		angleSupport2.rotation.y = 0;
		angleSupport2.rotation.z = 0;
		
		//meshes.push(angleSupport2);
				
// Уголок деталь полка 2
		dxfBasePoint.x = 0;
		dxfBasePoint.y = 100;
		var shape = drawAngleSupportSide(partParams.width, partParams.height, partParams.holeDist2, partParams.hole2Y, partParams.holeDiam2, partParams.metalThickness);

		var extrudeOptions = {
		amount: partParams.metalThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
		};
		
		var angleSupportGeometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		
		angleSupportGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		
		var angleSupport3 = new THREE.Mesh(angleSupportGeometry, params.materials.metal);
		angleSupport3.position.x = 0;
		angleSupport3.position.y = partParams.metalThickness;		
		angleSupport3.position.z = partParams.metalThickness*2;
		
		angleSupport3.rotation.x = Math.PI/2;
		angleSupport3.rotation.y = 0;
		angleSupport3.rotation.z = 0;
		
		//meshes.push(angleSupport3);
		
		var complexObject1 = new THREE.Object3D();
		complexObject1.add(angleSupport1);
		complexObject1.add(angleSupport2);
		complexObject1.add(angleSupport3);
		
		complexObject1.position.x = 0;
		complexObject1.position.y = 0;		
		complexObject1.position.z = 0;
		
		complexObject1.rotation.x = 0;
		complexObject1.rotation.y = 0;
		complexObject1.rotation.z = 0;
		
		return complexObject1
}


/*функция отрисовки регулируемой опоры*/
function drawAdjustableLeg(){
dxfBasePoint = {x:0, y:0}
var leg = new THREE.Object3D(); 

	var angle = drawAngleSupport("У5-60х60х100");
	angle.position.x = 0;
	angle.position.y = 0;
	angle.position.z = 0;
	angle.castShadow = true;
	//if(side == "left") angle.rotation.y = Math.PI;
	leg.add(angle);

	//нижний фланец
	var dxfBasePoint = { "x": 1000.0, "y": 2000.0 };
	var flanParams = {};
	flanParams.width = 100.0;
	flanParams.height = 100.0;
	flanParams.holeDiam = 7;
	flanParams.holeDiam5 = 20.0;
	flanParams.angleRadUp = 10.0;
	flanParams.angleRadDn = 10.0;
	flanParams.hole1X = 15.0;
	flanParams.hole1Y = 15.0;
	flanParams.hole2X = 15.0;
	flanParams.hole2Y = 15.0;
	flanParams.hole3X = 15.0;
	flanParams.hole3Y = 15.0;
	flanParams.hole4X = 15.0;
	flanParams.hole4Y = 15.0;
	flanParams.hole5X = flanParams.width / 2;
	flanParams.hole5Y = flanParams.height / 2;
	flanParams.dxfBasePoint = dxfBasePoint;
	flanParams.dxfPrimitivesArr = dxfPrimitivesArr;

	//добавляем фланец
	drawRectFlan(flanParams);
	var flanShape = flanParams.shape;

	var thickness = 4;
	var extrudeOptions = {
	    amount: thickness,
	    bevelEnabled: false,
	    curveSegments: 12,
	    steps: 1
	};

	var geometry = new THREE.ExtrudeGeometry(flanShape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var flan = new THREE.Mesh(geometry, params.materials.metal);

	//задаем позицию фланца  
	flan.position.x = 0//angle.position.x + (flanParams.width - 100) / 2;
	flan.position.y = - 40
	flan.position.z = flanParams.width - 13//angle.position.z -40 + flanParams.height / 2;
	flan.rotation.x = Math.PI * 1.5;
	flan.castShadow = true;
	//добавлЯем фланец в сцену	  
	leg.add(flan);



	var geometry = new THREE.CylinderGeometry(10, 10, 100, 10, 1, false);
	var bolt = new THREE.Mesh(geometry, params.materials.metal);
	bolt.position.x = flan.position.x + flanParams.width / 2;
	bolt.position.y = 100 / 2 - 40
	bolt.position.z =  (flan.position.z - flanParams.height / 2);
	bolt.rotation.x = 0.0;
	bolt.rotation.y = 0.0;
	bolt.rotation.z = 0.0;
	bolt.castShadow = true;
	leg.add(bolt);

	return leg;
}

/*функция отрисовки рамок ступеней*/

function drawTreadFrame(frameParams){

/*исходные данные
	frameParams.length - длина рамки
	frameParams.width - ширина рамки
	frameParams.profile - профиль перемычек: 40x40 или 60x30 (буква x английская)
	frameParams.brigeAmt - кол-во горизонтальных фланцев
	frameParams.material - материал
	frameParams.dxfArr - массив dxf куда добавлять контура
	frameParams.dxfBasePoint - базовая точка для вставки контуров фланцев
*/

	if(!frameParams.dxfArr) frameParams.dxfArr = dxfPrimitivesArr;
	
	var frame = new THREE.Object3D();
	
	var profileWidth = 20;
	var profileHeight = 40;
	if(frameParams.profile == "60x30"){
		profileWidth = 30;
		profileHeight = 60;	
	}
	var geometry = new THREE.BoxGeometry(profileWidth, profileHeight, frameParams.length);
	
	/*передний профиль*/
	var frontProfile = new THREE.Mesh(geometry, frameParams.material);
	frontProfile.position.x = profileWidth/2;
	frontProfile.position.y = -profileHeight/2;
	frontProfile.position.z = frameParams.length/2;
	frame.add(frontProfile);
	
	/*задний профиль*/
	var frontProfile = new THREE.Mesh(geometry, frameParams.material);
	frontProfile.position.x = frameParams.width - profileWidth/2;
	frontProfile.position.y = -profileHeight/2;
	frontProfile.position.z = frameParams.length/2;
	frame.add(frontProfile);
	
	/*боковой фланец*/
	var flanLength = frameParams.width - 2 * profileWidth
	var flanWidth = 40; 
	var holeOffset = 25;
	var sideFlanThickness = 8;
	var holeDiam = 13;
		
	
	var sideFlanShape = drawFrameFlan(flanLength, flanWidth, holeOffset, holeDiam, frameParams.dxfBasePoint, frameParams.dxfArr);

	var flanExtrudeOptions = {
		amount: sideFlanThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	
	var geom = new THREE.ExtrudeGeometry(sideFlanShape, flanExtrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var sideFlan1 = new THREE.Mesh(geom, frameParams.material);
	var sideFlan2 = new THREE.Mesh(geom, frameParams.material);
	
	sideFlan1.position.x = flanLength + profileWidth;
	sideFlan1.position.y = -flanWidth;
	sideFlan1.position.z = 0;//frameParams.length/2+100;
	
	sideFlan1.rotation.z = toRadians(90);
	
	sideFlan2.position.x = flanLength + profileWidth;
	sideFlan2.position.y = -flanWidth;
	sideFlan2.position.z = frameParams.length - sideFlanThickness;
	
	sideFlan2.rotation.z = toRadians(90);
	
	frame.add(sideFlan1,sideFlan2);

	/*верхние перемычки*/	
	var flanLength = frameParams.width - 2 * profileWidth
	var flanWidth = 25; 
	var holeOffset = 30;
	var topFlanThickness = 4;
	var holeDiam = 8;
	var holeCenter = {};
	frameParams.holeCenters = [];
	var topFlanIndex = 0;
	var hole1X = profileWidth + holeOffset;
	var hole2X = frameParams.width - profileWidth - holeOffset;
	
	var flanExtrudeOptions = {
		amount: topFlanThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	
	
		
		var topFlanDxfBasePoint = newPoint_xy(frameParams.dxfBasePoint, 100, 0)
		var topFlanShape = drawFrameFlan(flanLength, flanWidth, holeOffset, holeDiam, topFlanDxfBasePoint, frameParams.dxfArr);
		var geom = new THREE.ExtrudeGeometry(topFlanShape, flanExtrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		
		if(frameParams.brigeAmt > 1){
		var bridgeSideOffset = 25;
		var topFlan1 = new THREE.Mesh(geom, frameParams.material);
			topFlan1.position.x = flanLength + profileWidth;
			topFlan1.position.y = 0;
			topFlan1.position.z = bridgeSideOffset + sideFlanThickness;	
			topFlan1.rotation.x = toRadians(90);
			topFlan1.rotation.z = toRadians(90);	
			frame.add(topFlan1);
			
			//координаты центра первого отверстия
			frameParams.holeCenters[topFlanIndex] = {};
			frameParams.holeCenters[topFlanIndex].x = hole1X;
			frameParams.holeCenters[topFlanIndex].y = topFlan1.position.z + flanWidth/2;
			topFlanIndex += 1;
			
			//координаты центра второго отверстия
			frameParams.holeCenters[topFlanIndex] = {};
			frameParams.holeCenters[topFlanIndex].x = hole2X;
			frameParams.holeCenters[topFlanIndex].y = topFlan1.position.z + flanWidth/2;
			topFlanIndex += 1;
			
		
		var topFlan3 = new THREE.Mesh(geom, frameParams.material);	
			topFlan3.position.x = flanLength + profileWidth;
			topFlan3.position.y = 0;
			topFlan3.position.z = frameParams.length - bridgeSideOffset - sideFlanThickness - flanWidth;	
			topFlan3.rotation.x = toRadians(90);
			topFlan3.rotation.z = toRadians(90)
			frame.add(topFlan3);
			
			//координаты центра первого отверстия
			frameParams.holeCenters[topFlanIndex] = {};
			frameParams.holeCenters[topFlanIndex].x = hole1X;
			frameParams.holeCenters[topFlanIndex].y = topFlan3.position.z + flanWidth/2;
			topFlanIndex += 1;
			
			//координаты центра второго отверстия
			frameParams.holeCenters[topFlanIndex] = {};
			frameParams.holeCenters[topFlanIndex].x = hole2X;
			frameParams.holeCenters[topFlanIndex].y = topFlan3.position.z + flanWidth/2;
			topFlanIndex += 1;
		
		if(frameParams.brigeAmt > 2){		
			var delta = (topFlan3.position.z - topFlan1.position.z)/(frameParams.brigeAmt-1);
			for (var i = 1; i < frameParams.brigeAmt; i++) {
				var topFlan2 = new THREE.Mesh(geom, frameParams.material);			
				topFlan2.position.x = flanLength + profileWidth;
				topFlan2.position.y = 0;
				topFlan2.position.z = topFlan1.position.z + delta*(i-1);			
				topFlan2.rotation.x = toRadians(90);
				topFlan2.rotation.z = toRadians(90);			
				if(i!=1) {
					frame.add(topFlan2);				
					//координаты центра первого отверстия
					frameParams.holeCenters[topFlanIndex] = {};
					frameParams.holeCenters[topFlanIndex].x = hole1X;
					frameParams.holeCenters[topFlanIndex].y = topFlan2.position.z + flanWidth/2;
					topFlanIndex += 1;
					
					//координаты центра второго отверстия
					frameParams.holeCenters[topFlanIndex] = {};
					frameParams.holeCenters[topFlanIndex].x = hole2X;
					frameParams.holeCenters[topFlanIndex].y = topFlan2.position.z + flanWidth/2;
					topFlanIndex += 1;
					}
				}//end of for
			}
		}
	
	if(frameParams.brigeAmt == 1){
		var topFlan1 = new THREE.Mesh(geom, frameParams.material);
			topFlan1.position.x = flanLength + profileWidth;
			topFlan1.position.y = 0;
			topFlan1.position.z = frameParams.length/2 - flanWidth/2;	
			topFlan1.rotation.x = toRadians(90);
			topFlan1.rotation.z = toRadians(90);	
			frame.add(topFlan1);
			
			//координаты центра первого отверстия
			frameParams.holeCenters[topFlanIndex] = {};
			frameParams.holeCenters[topFlanIndex].x = hole1X;
			frameParams.holeCenters[topFlanIndex].y = topFlan1.position.z + flanWidth/2;
			topFlanIndex += 1;
			
			//координаты центра второго отверстия
			frameParams.holeCenters[topFlanIndex] = {};
			frameParams.holeCenters[topFlanIndex].x = hole2X;
			frameParams.holeCenters[topFlanIndex].y = topFlan1.position.z + flanWidth/2;
			topFlanIndex += 1;			
		}


/*отрисовка фланца для рамки ступени*/

function drawFrameFlan(flanLength, flanWidth, holeOffset, holeDiam, dxfBasePoint, dxfArr) {

	var flanParams = { //объявление параметров фланца
		width:flanWidth,
		height:flanLength, 
		holeDiam:holeDiam,
		angleRadUp:0,
		angleRadDn:0,
		hole1X:flanWidth/2,
		hole1Y:holeOffset,
		hole2X:flanWidth/2,
		hole2Y:holeOffset,
		dxfBasePoint: dxfBasePoint,
		dxfPrimitivesArr: dxfArr,
	};

	var shape = drawRectFlan(flanParams).shape;
	
	return shape;
	}

	
	return frame;	
	
	
}		

/*общая функция отрисовки квадратного фланца с отверстиями*/

function drawRectFlan(flanParams){

	/*исходные данные:
	чертеж фланца здесь: 6692035.ru/drawings/carcasPartsLib/flans/scheme_RectFlan.pdf
	flanParams.width - ширина фланца
	flanParams.height - длина фланца (высота при вертикальном расположении)
	flanParams.holeDiam - диаметр отверстий с 1 по 4
	flanParams.holeDiam5 - диаметр пятого (условно центрального) отверстия
	flanParams.angleRadUp - радиус скругления верхних углов фланца
	flanParams.angleRadDn - радиус скругления нижних углов фланца
	flanParams.hole1X - координаты первого отверстия по оси Х (отсчитываются от соответствующего внешного угла фланца)
	flanParams.hole1Y - координаты первого отверстия по оси Y (отсчитываются от соответствующего внешного угла фланца)
	flanParams.hole2X - координаты второго отверстия по оси Х (отсчитываются от соответствующего внешного угла фланца)
	flanParams.hole2Y - координаты второго отверстия по оси Y (отсчитываются от соответствующего внешного угла фланца)
	flanParams.hole3X - координаты третьего отверстия по оси Х (отсчитываются от соответствующего внешного угла фланца)
	flanParams.hole3Y - координаты третьего отверстия по оси Y (отсчитываются от соответствующего внешного угла фланца)
	flanParams.hole4X - координаты четвертого отверстия по оси Х (отсчитываются от соответствующего внешного угла фланца)
	flanParams.hole4Y - координаты четвертого отверстия по оси Y (отсчитываются от соответствующего внешного угла фланца)
	flanParams.hole5X - координаты пятого отверстия по оси Х (отсчитываются от начальной точки фланца - левый нижний угол)
	flanParams.hole5Y - координаты пятого отверстия по оси Y (отсчитываются от начальной точки фланца - левый нижний угол)
	flanParams.dxfBasePoint - базовая точка для вставки контуров в dxf файл
	flanParams.dxfPrimitivesArr - массив для вставки контуров в dxf файл
	
	!!! Для отрисовки отверстия необходимо наличие всех трех параметров (позиции по х,у и диаметра).
	!!! Нумерация отверстий идет по часовой стрелке, начиная с левого нижнего. 
	*/
	var dxfBasePoint = flanParams.dxfBasePoint;
	var dxfPrimitivesArr = flanParams.dxfPrimitivesArr;
	var shape = new THREE.Shape();	
	var p1 = {x:0,y:0}
	var centerPoint = {x:0, y:0};
	var p2 = copyPoint(p1);

	//прорисовка левого нижнего угла скругления
	if(flanParams.angleRadDn > 0){
	var startAngle = Math.PI*3/2; 
	var endAngle = Math.PI;
	centerPoint.x = flanParams.angleRadDn; //назначение центра скругления
	centerPoint.y = flanParams.angleRadDn;
	addArc(shape, dxfPrimitivesArr, centerPoint, flanParams.angleRadDn, startAngle, endAngle, dxfBasePoint);
	}

	//прорисовка левого участка
	p1.x = 0;
	p1.y = flanParams.angleRadDn;
	p2 = newPoint_xy(p1, 0, flanParams.height-flanParams.angleRadDn-flanParams.angleRadUp); // params basePoint, deltaX, deltaY
	addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);
	//прорисовка левого верхнего угла скругления
	if(flanParams.angleRadUp > 0){
	startAngle = Math.PI;
	endAngle = Math.PI/2;
	centerPoint.x = flanParams.angleRadUp; //назначение центра скругления
	centerPoint.y = flanParams.height - flanParams.angleRadUp;
	addArc(shape, dxfPrimitivesArr, centerPoint, flanParams.angleRadUp, startAngle, endAngle, dxfBasePoint);
	}
	
	//прорисовка верхнего участка
	p1.x = flanParams.angleRadUp;
	p1.y = flanParams.height;
	p2 = newPoint_xy(p1, flanParams.width-flanParams.angleRadUp*2, 0); // params basePoint, deltaX, deltaY
	addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);
	
	//прорисовка правого верхнего угла скругления
	if(flanParams.angleRadUp > 0){
	startAngle = Math.PI/2;
	endAngle = 0;
	centerPoint.x = flanParams.width - flanParams.angleRadUp; //назначение центра скругления
	centerPoint.y = flanParams.height - flanParams.angleRadUp;
	addArc(shape, dxfPrimitivesArr, centerPoint, flanParams.angleRadUp, startAngle, endAngle, dxfBasePoint);
	}
	
	//прорисовка левого участка
	p1.x = flanParams.width;
	p1.y = flanParams.height - flanParams.angleRadUp;
	p2 = newPoint_xy(p1, 0, -flanParams.height + flanParams.angleRadUp + flanParams.angleRadDn); // params basePoint, deltaX, deltaY
	addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);
	
	//прорисовка правого нижнего угла скругления
	if(flanParams.angleRadDn > 0){
	startAngle = Math.PI*2;
	endAngle = Math.PI*3/2;
	centerPoint.x = flanParams.width - flanParams.angleRadDn;
	centerPoint.y = flanParams.angleRadDn;
	addArc(shape, dxfPrimitivesArr, centerPoint, flanParams.angleRadDn, startAngle, endAngle, dxfBasePoint);
	}

	//прорисовка нижнего участка
	p1.x = flanParams.width - flanParams.angleRadDn;
	p1.y = 0;
	p2 = newPoint_xy(p1, -flanParams.width + flanParams.angleRadDn*2, 0);
	addLine(shape, dxfPrimitivesArr, p1, p2, dxfBasePoint);
	
	
	/*Прорисовка отверстий*/
	var hole0Pos={x:0,y:0}
	
	/*отверстие № 1*/ 
	if(flanParams.hole1X && flanParams.hole1Y && flanParams.holeDiam){
    var hole1 = new THREE.Path();
	var hole1Pos = copyPoint(hole0Pos);
	hole1Pos.x = hole1Pos.x + flanParams.hole1X;
	hole1Pos.y = hole1Pos.y + flanParams.hole1Y;
	addCircle(hole1, dxfPrimitivesArr, hole1Pos, flanParams.holeDiam/2, dxfBasePoint)
	shape.holes.push(hole1);
	}
	
	/*отверстие № 2*/
	if(flanParams.hole2X && flanParams.hole2Y && flanParams.holeDiam){
	var hole2 = new THREE.Path();
	var hole2Pos = copyPoint(hole0Pos);
	hole2Pos.x = hole2Pos.x + flanParams.hole2X;
	hole2Pos.y = hole2Pos.y + flanParams.height - flanParams.hole2Y;
	addCircle(hole2, dxfPrimitivesArr, hole2Pos, flanParams.holeDiam/2, dxfBasePoint)
	shape.holes.push(hole2);
	}
	
	/*отверстие № 3*/
	if(flanParams.hole3X && flanParams.hole3Y && flanParams.holeDiam){
	var hole3 = new THREE.Path();
	var hole3Pos = copyPoint(hole0Pos);
	hole3Pos.x = hole0Pos.x + flanParams.width - flanParams.hole3X;
	hole3Pos.y = hole0Pos.y + flanParams.height - flanParams.hole3Y;
	addCircle(hole3, dxfPrimitivesArr, hole3Pos, flanParams.holeDiam/2, dxfBasePoint)
	shape.holes.push(hole3);
	}
	
	/*отверстие № 4*/
	if(flanParams.hole4X && flanParams.hole4Y && flanParams.holeDiam){
	var hole4 = new THREE.Path();
	var hole4Pos = copyPoint(hole0Pos);
	hole4Pos.x = hole0Pos.x + flanParams.width - flanParams.hole4X;
	hole4Pos.y = hole0Pos.y + flanParams.hole4Y;
	addCircle(hole4, dxfPrimitivesArr, hole4Pos, flanParams.holeDiam/2, dxfBasePoint)
	shape.holes.push(hole4);
	}
	
	/*отверстие № 5*/
	if(flanParams.hole5X && flanParams.hole5Y && flanParams.holeDiam5){
	var hole5 = new THREE.Path();
	var hole5Pos = copyPoint(hole0Pos);
	hole5Pos.x = hole5Pos.x + flanParams.hole5X ;
	hole5Pos.y = hole5Pos.y + flanParams.hole5Y ;
	addCircle(hole5, dxfPrimitivesArr, hole5Pos, flanParams.holeDiam5/2, dxfBasePoint)
	shape.holes.push(hole5);
	}
	flanParams.shape=shape;
	
	return flanParams;
}


function drawTurnTreadShape1(par) {
/*функция отрисовки контура первой и третьей забежной ступени
	Чертеж с обозначением параметров здесь: 6692035.ru/drawings/turnTreads/turnTreads.pdf
	Исходные данные: 
		treadWidth
		innerOffset 
		outerOffset
		edgeAngle
		stepWidthLow
		turnFactor
		dxfBasePoint
	На выходе те же данные плюс следующие:
		shape - контур ступени
		stepWidthHi
	*/
	var dxfBasePoint = par.dxfBasePoint;
	var shape = new THREE.Shape();
	

	par.stepWidthHi =  par.stepWidthLow + (par.treadWidth - par.innerOffset - par.outerOffset) * Math.tan(par.edgeAngle);
	var turn = par.turnFactor;

	var pp = [];
	pp[0] = {x: 0, y: 0};
	newPointP_xy_last(pp, par.treadWidth * turn, 0); // params points, deltaX, deltaY
	newPointP_xy_last(pp, 0, par.stepWidthLow);
	newPointP_xy_last(pp, -par.innerOffset * turn, 0);
	newPointP_xy(pp, pp[0], par.outerOffset * turn, par.stepWidthHi);
	newPointP_xy_last(pp, -par.outerOffset * turn, 0);
	pp.push(pp[0]);
	
	addPath(shape, dxfPrimitivesArr, pp, dxfBasePoint);
	par.shape = shape;
	return par;
} //end of drawTurnTreadShape1


function drawTurnTreadShape2(par, dxfBasePoint) {
/*функция отрисовывает шейп второй (угловой) забежной ступени
Исходные данные:
Чертеж с обозначением параметров здесь: 6692035.ru/drawings/turnTreads/turnTreads.pdf
treadWidthX
treadWidthY
angleX
angleY
outerOffsetX
outerOffsetY
innerOffsetX
innerOffsetY
notchDepthX
notchDepthY
turnFactor
dxfBasePoint
На выходе те же параметры плюс следующие:
	shape - контур ступени
	stepWidthX
	stepWidthY
	stepOffsetX
	stepOffsetY
*/


	var dxfBasePoint = par.dxfBasePoint;
	
	var shape = new THREE.Shape();
	

	par.stepOffsetY = Math.tan(par.angleX) * (par.treadWidthX - par.innerOffsetX - par.outerOffsetX);
	par.stepOffsetX = Math.tan(par.angleY) * (par.treadWidthY - par.innerOffsetY - par.outerOffsetY);
	par.stepWidthX = par.treadWidthX - par.stepOffsetX;
	par.stepWidthY = par.treadWidthY - par.stepOffsetY;
	
	var turn = par.turnFactor;

	var pp = [];
	pp[0] = {x: 0, y: 0};
	newPointP_xy_last(pp, par.outerOffsetX * turn, 0); // params points, deltaX, deltaY
	newPointP_xy_last(pp, (par.treadWidthX - par.outerOffsetX - par.innerOffsetX) * turn, -par.stepOffsetY);
	newPointP_xy_last(pp, (par.innerOffsetX - par.notchDepthX) * turn, 0);
	newPointP_xy_last(pp, 0, par.notchDepthY);
	newPointP_xy_last(pp, par.notchDepthX * turn, 0);
	newPointP_xy_last(pp, 0, par.innerOffsetY - par.notchDepthY);
	newPointP_xy(pp, pp[0], par.stepWidthX * turn, par.stepWidthY - par.outerOffsetY);
	newPointP_xy_last(pp, 0, par.outerOffsetY);
	newPointP_xy_last(pp, -par.stepWidthX * turn, 0);
	pp.push(pp[0]);
	
	addPath(shape, dxfPrimitivesArr, pp, dxfBasePoint);
	par.shape = shape;
	return par;
}


function drawTurnSteps(turnParams){
/*функция отрисовывает блок забежных ступеней для лестниц ЛТ и КО
Исходные данные:
	st
	model: params.model, - модель лестницы: лт или ко
	stairModel: params.stairModel, - поврот лестницы
	marshDist: params.marshDist, - зазор между маршами в плане. Для Г-образной не обязательный параметр
	M: params.M, - внешняя ширина маршей
	h: params.h, - подъем ступени
	turnFactor: turnFactor, - к-т направления поворота: 1 или -1
	dxfBasePoint: dxfBasePoint, - базовая точка вставки контуров ступеней 

Возвращаемое значение:
объект  turnSteps = {
	meshes: treads; - мэши ступеней в виде единого 3D объекта
	params: treadParams; - массив параметров каждой ступени

*/

var model = turnParams.model;
var stepsTurnFactor = turnParams.turnFactor;
var dxfBasePoint = turnParams.dxfBasePoint;
var treadThickness = turnParams.treadThickness;
var	stringerThickness = turnParams.stringerThickness;
var	treadSideOffset = turnParams.treadSideOffset;
var	material = turnParams.material;
var treadParams = [];
var treads = new THREE.Object3D();

var extrudeOptions = {
		amount: treadThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	}; 

/*забежная ступень 1*/  


	
	//задаем параметры ступени
if(model=="лт"){
	treadParams[1] = {
		treadWidth: turnParams.M - stringerThickness * 2 - treadSideOffset * 2,
		innerOffset: 0,
		outerOffset: 0,
		edgeAngle: Math.PI/6,
		stepWidthLow: 100,
		turnFactor: stepsTurnFactor,
		dxfBasePoint: dxfBasePoint,
		};
	
}//end of lt
if(model=="ко"){
	treadParams[1] = {
		treadWidth: turnParams.M,
		innerOffset: 0,
		outerOffset: 0,
		edgeAngle: Math.PI/6,
		stepWidthLow: 55,
		turnFactor: stepsTurnFactor,
		dxfBasePoint: dxfBasePoint,
		};
}//end of ko
		
if(model=="module"){
	treadParams[1] = {
		treadWidth: turnParams.M,
		innerOffset: 0,
		outerOffset: 0,
		edgeAngle: Math.PI/6,
		stepWidthLow: 75,
		turnFactor: stepsTurnFactor,
		dxfBasePoint: dxfBasePoint,
		};
	}
	
	treadParams[1] = drawTurnTreadShape1(treadParams[1]); //функция в файле drawCarcasPartsLib.js
	var shape = treadParams[1].shape;
	var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var tread1 = new THREE.Mesh(geometry, material);
		tread1.position.x = -treadParams[1].treadWidth * treadParams[1].turnFactor;
		tread1.rotation.x = -Math.PI/2;
		tread1.position.y = 0;		
		tread1.position.z = 0;
	treads.add(tread1);
 
/*забежная ступень 2*/
	dxfBasePoint = newPoint_xy(dxfBasePoint, 1500,0)
	
	//задаем параметры ступени
if(model=="лт"){
	treadParams[2] = {
		treadWidthX: turnParams.M - stringerThickness + 100 - treadSideOffset + 5,
		treadWidthY: turnParams.M - stringerThickness * 2 - treadSideOffset * 2,
		angleX: 30 * Math.PI / 180,
		angleY: 32.9237 * Math.PI / 180,
		outerOffsetX: 0,
		outerOffsetY: 0,
		innerOffsetX: 100,
		innerOffsetY: 50,
		notchDepthX: 0,
		notchDepthY: 0,
		turnFactor: stepsTurnFactor,
		dxfBasePoint: dxfBasePoint,
	};
}	
if(model=="ко"){
	treadParams[2] = {
		treadWidthX: turnParams.M - 25 + 90,
		treadWidthY: turnParams.M,
		angleX: 30 * Math.PI / 180,
		angleY: 30 * Math.PI / 180,
		outerOffsetX: 0,
		outerOffsetY: 0,
		innerOffsetX: 90,
		innerOffsetY: 0,
		notchDepthX: 0,
		notchDepthY: 0,
		turnFactor: stepsTurnFactor,
		dxfBasePoint: dxfBasePoint,
	};
}

if(model=="module"){
	treadParams[2] = {
		treadWidthX: turnParams.M,
		treadWidthY: turnParams.M,
		angleX: 30 * Math.PI / 180,
		angleY: 30 * Math.PI / 180,
		outerOffsetX: 0,
		outerOffsetY: 0,
		innerOffsetX: 55,
		innerOffsetY: 55,
		notchDepthX: 0,
		notchDepthY: 0,
		turnFactor: stepsTurnFactor,
		dxfBasePoint: dxfBasePoint,
	};
}
	//отрисовываем ступень
	
	treadParams[2] = drawTurnTreadShape2(treadParams[2]); //функция в файле drawCarcasPartsLib.js
	var shape3 = treadParams[2].shape;
	var geometry3 = new THREE.ExtrudeGeometry(shape3, extrudeOptions);
	geometry3.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var tread2 = new THREE.Mesh(geometry3, material);
		tread2.position.x = -treadParams[2].treadWidthX * treadParams[2].turnFactor;
		tread2.rotation.x = -Math.PI/2;
		tread2.position.y = turnParams.h;		
		tread2.position.z = -treadParams[2].stepOffsetY;
		
	//корректируем положение ступени с учетом модели
	if(model=="лт"){
		tread2.position.x = tread2.position.x + (treadParams[2].innerOffsetX + treadSideOffset + 5 + stringerThickness) * treadParams[2].turnFactor;
		tread2.position.z = tread2.position.z - (stringerThickness + treadSideOffset + 31);
		}
	if(model=="ко"){
		tread2.position.x = tread2.position.x + (treadParams[2].innerOffsetX - 25) * treadParams[2].turnFactor;
		tread2.position.z = tread2.position.z - 25;
		}
	if(model=="module"){
		tread2.position.x += 0;
		tread2.position.z += 0;
		}
	treads.add(tread2);
	
/*забежная ступень 3*/  
dxfBasePoint = newPoint_xy(dxfBasePoint, 2000,0)
	
	//задаем параметры ступени
	if(model=="лт"){
		treadParams[3] = {
			treadWidth: turnParams.M - stringerThickness * 2 - treadSideOffset * 2,
			innerOffset: 0,
			outerOffset: 0,
			edgeAngle: Math.PI/6,
			stepWidthLow: 100,
			turnFactor: -stepsTurnFactor,
			dxfBasePoint: dxfBasePoint,
		};
	if(turnParams.stairModel == "П-образная с забегом" && turnParams.marshDist > 100) 
		treadParams[3].stepWidthLow = turnParams.marshDist;
		
	}
	if(model=="ко"){
		treadParams[3] = {
			treadWidth: turnParams.M,
			innerOffset: 0,
			outerOffset: 0,
			edgeAngle: Math.PI/6,
			stepWidthLow: 55,
			turnFactor: -stepsTurnFactor,
			dxfBasePoint: dxfBasePoint,
		};
	if(turnParams.stairModel == "П-образная с забегом")
		treadParams[3].stepWidthLow = turnParams.marshDist - 12;
		
	}
if(model=="module"){
	treadParams[3] = {
		treadWidth: turnParams.M,
		innerOffset: 0,
		outerOffset: 0,
		edgeAngle: Math.PI/6,
		stepWidthLow: 75,
		turnFactor: -stepsTurnFactor,
		dxfBasePoint: dxfBasePoint,
		};
}//end of module	
	
	treadParams[3] = drawTurnTreadShape1(treadParams[3]); //функция в файле drawCarcasPartsLib.js
	var shape = treadParams[3].shape;
	var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var tread3 = new THREE.Mesh(geometry, material);
		tread3.position.x = 0
		tread3.rotation.x = -Math.PI/2;
		tread3.rotation.z = - Math.PI/2 * treadParams[3].turnFactor;
		tread3.position.y = turnParams.h * 2;		
		tread3.position.z = - treadParams[3].treadWidth;
	//корректируем положение ступени с учетом модели
	if(model=="лт"){
		tread3.position.x = tread3.position.x - (treadParams[3].stepWidthLow + 5 + treadSideOffset + stringerThickness) * treadParams[3].turnFactor;
		tread3.position.z = tread3.position.z - (stringerThickness + treadSideOffset + 31);
		}
	if(model=="ко"){
		tread3.position.x = tread3.position.x - (treadParams[3].stepWidthLow + 17) * treadParams[3].turnFactor;
		tread3.position.z = tread3.position.z - 25;
		}
	if(model=="module"){
		tread3.position.x += 0;
		tread3.position.z += 0;
		}
	
	treads.add(tread3);	


if(turnParams.stairModel == "П-образная с забегом"){

/*забежная ступень 4*/  
dxfBasePoint = newPoint_xy(dxfBasePoint, -3500,1500)
	
	//задаем параметры ступени
if(model=="лт"){
	treadParams[4] = {
		treadWidth: turnParams.M - stringerThickness * 2 - treadSideOffset * 2,
		innerOffset: 0,
		outerOffset: 0,
		edgeAngle: Math.PI/6,
		stepWidthLow: 100,
		turnFactor: stepsTurnFactor,
		dxfBasePoint: dxfBasePoint,
	};

}
if(model=="ко"){
	treadParams[4] = {
		treadWidth: turnParams.M,
		innerOffset: 0,
		outerOffset: 0,
		edgeAngle: Math.PI/6,
		stepWidthLow: 55,
		turnFactor: stepsTurnFactor,
		dxfBasePoint: dxfBasePoint,
	};
	
}
	treadParams[4] = drawTurnTreadShape1(treadParams[4]); //функция в файле drawCarcasPartsLib.js
	var shape = treadParams[4].shape;
	var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var tread4 = new THREE.Mesh(geometry, material);
		tread4.rotation.x = -Math.PI/2;
		tread4.rotation.z = -Math.PI/2 * treadParams[4].turnFactor;
		tread4.position.x = 0;
		tread4.position.y = turnParams.h * 3;		
		tread4.position.z = -treadParams[4].treadWidth;
	//корректируем положение ступени с учетом модели
	if(model=="лт"){
		tread4.position.x = tread4.position.x + (turnParams.marshDist + stringerThickness + treadSideOffset - 31) * treadParams[4].turnFactor;
		tread4.position.z = tread4.position.z - (stringerThickness + treadSideOffset + 31);
		}
	if(model=="ко"){
		tread4.position.x = tread4.position.x + (turnParams.marshDist - 25) * treadParams[4].turnFactor;
		tread4.position.z = tread4.position.z - 25; 
		}
	treads.add(tread4);


/*забежная ступень 5*/
dxfBasePoint = newPoint_xy(dxfBasePoint, 1500,0);
if(model=="лт"){
	treadParams[5] = {
		treadWidthX: turnParams.M - stringerThickness + 100 - treadSideOffset * 2,
		treadWidthY: turnParams.M - stringerThickness * 2 - treadSideOffset * 2,
		angleX: 30 * Math.PI / 180,
		angleY: 32.9237 * Math.PI / 180,
		outerOffsetX: 0,
		outerOffsetY: 0,
		innerOffsetX: 100,
		innerOffsetY: 50,
		notchDepthX: 0,
		notchDepthY: 0,
		turnFactor: stepsTurnFactor,
		dxfBasePoint: dxfBasePoint,
	};
}	
if(model=="ко"){
	treadParams[5] = {
		treadWidthX: turnParams.M - 25 + 90,
		treadWidthY: turnParams.M,
		angleX: 30 * Math.PI / 180,
		angleY: 30 * Math.PI / 180,
		outerOffsetX: 0,
		outerOffsetY: 0,
		innerOffsetX: 90,
		innerOffsetY: 0,
		notchDepthX: 0,
		notchDepthY: 0,
		turnFactor: stepsTurnFactor,
		dxfBasePoint: dxfBasePoint,
	};
}

	treadParams[5] = drawTurnTreadShape2(treadParams[5]); //функция в файле drawCarcasPartsLib.js
	var shape3 = treadParams[5].shape;
	var geometry3 = new THREE.ExtrudeGeometry(shape3, extrudeOptions);
	geometry3.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var tread5 = new THREE.Mesh(geometry3, material);
		tread5.rotation.x = -Math.PI/2;
		tread5.rotation.z = -Math.PI/2 * treadParams[5].turnFactor;
		tread5.position.x = treadParams[5].stepOffsetY * treadParams[5].turnFactor;
		tread5.position.y = turnParams.h*4;		
		tread5.position.z = -treadParams[5].treadWidthX;
		
	//корректируем положение ступени с учетом модели
	if(model=="лт"){
		tread5.position.x = tread5.position.x + (turnParams.marshDist + stringerThickness *2 + treadSideOffset * 2) * treadParams[5].turnFactor;
		tread5.position.z = tread5.position.z + treadParams[5].innerOffsetX  + 5 - 31;
		}
	if(model=="ко"){
		tread5.position.x = tread5.position.x + turnParams.marshDist * treadParams[5].turnFactor;
		tread5.position.z = tread5.position.z + 40;
		}
	treads.add(tread5);

/*забежная ступень 6*/

dxfBasePoint = newPoint_xy(dxfBasePoint, 2000,0)

	//задаем параметры ступени
	if(model=="лт"){
		treadParams[6] = {
			treadWidth: turnParams.M - stringerThickness * 2 - treadSideOffset * 2,
			innerOffset: 0,
			outerOffset: 0,
			edgeAngle: Math.PI/6,
			stepWidthLow: 100,
			turnFactor: -stepsTurnFactor,
			dxfBasePoint: dxfBasePoint,
		};
		
	}
	if(model=="ко"){
		treadParams[6] = {
			treadWidth: turnParams.M,
			innerOffset: 0,
			outerOffset: 0,
			edgeAngle: Math.PI/6,
			stepWidthLow: 55,
			turnFactor: -stepsTurnFactor,
			dxfBasePoint: dxfBasePoint,
		};
		
	}

	treadParams[6] = drawTurnTreadShape1(treadParams[6]); //функция в файле drawCarcasPartsLib.js
	var shape = treadParams[6].shape;
	var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var tread6 = new THREE.Mesh(geometry, material);
		tread6.rotation.x = -Math.PI/2;
		tread6.position.x = -treadParams[6].treadWidth * treadParams[6].turnFactor
		tread6.position.y = turnParams.h * 5;		
		tread6.position.z = 0;
	
	//корректируем положение ступени с учетом модели
	if(model=="лт"){
		tread6.position.x = tread6.position.x - (turnParams.marshDist + stringerThickness *2 + treadSideOffset * 2) * treadParams[6].turnFactor;
		tread6.position.z = tread6.position.z + treadParams[6].stepWidthLow + 5 - 31; //- (stringerThickness + treadSideOffset + 31) + (treadParams[6].stepWidthLow + 5);
		}
	if(model=="ко"){
		tread6.position.x = tread6.position.x - turnParams.marshDist * treadParams[6].turnFactor;
		tread6.position.z = tread6.position.z + 47;
		}
		
	
	treads.add(tread6);
	}//end of stairModel == "П-образная с забегом"
	
/*формируем возвращаемый объект*/

var turnSteps = {
	meshes: treads,
	params: treadParams,
	};

return turnSteps;
	
} //end of drawTurnSteps 


function drawProfile(profileParams){
/*параметры:
		width: profileWidth,
		height: profileHeight,
		angle1: angle1,
		angle2: angle2,
		backLength: backLength,
		material: params.materials.metal,
		dxfBasePoint: dxfBasePoint,
		dxfPrimitivesArr: dxfPrimitivesArr,
		*/

var shape = new THREE.Shape();


	/*внешний контур*/
	
	var p1 =  {x:0,y:0}
	var p2 = newPoint_xy(p1, profileParams.backLength, 0);
	var p3 = newPoint_y(p2, profileParams.width, profileParams.angle2);
	var p4 = newPoint_y(p1, profileParams.width, profileParams.angle1);
		
	addLine(shape, profileParams.dxfPrimitivesArr, p1, p2, profileParams.dxfBasePoint);
	addLine(shape, profileParams.dxfPrimitivesArr, p2, p3, profileParams.dxfBasePoint);
	addLine(shape, profileParams.dxfPrimitivesArr, p3, p4, profileParams.dxfBasePoint);
	addLine(shape, profileParams.dxfPrimitivesArr, p4, p1, profileParams.dxfBasePoint);

	var extrudeOptions = {
		amount: profileParams.height,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
		};
	var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geometry, profileParams.material);	
	profileParams.mesh = mesh;
	
	return profileParams;
}

/*** ВСПОМОГАТЕЛЬЫНЕ ВНУТРЕННИЕ ФУНКЦИИ ***/


/*отрисовка шейпа гнутого участка уголка*/

function drawAngleSupportCentr_(width, metalThickness){
	
	var shape = new THREE.Shape();
	var p1 = {x:0,y:0}
	var centerPoint = {x:0, y:0};
	var p2 = copyPoint(p1);
	var flanParams = { //объявление параметров уголка
			width:width,
			bendRad:metalThickness
	}
			
	//прорисовка внешнего угла скругления
	if(flanParams.bendRad > 0){
	var startAngle = Math.PI*3/2; 
	var endAngle = Math.PI;
	
	dxfBasePoint.x = 0;
	dxfBasePoint.y = 0;
	
	centerPoint.x = flanParams.bendRad*2; //назначение центра скругления
	centerPoint.y = flanParams.bendRad*2;
	addArc(shape, dxfPrimitivesArr0, centerPoint, flanParams.bendRad*2, startAngle, endAngle, dxfBasePoint);
	}
	
	//прорисовка верхнего участка
	p1.x = 0;
	p1.y = flanParams.bendRad*2;
	p2 = newPoint_xy(p1, metalThickness, 0); // params basePoint, deltaX, deltaY
	addLine(shape, dxfPrimitivesArr0, p1, p2, dxfBasePoint);
	
	//прорисовка внутреннего угла скругления
	if(flanParams.bendRad > 0){
	var startAngle = Math.PI; 
	var endAngle = Math.PI*3/2;
	centerPoint.x = flanParams.bendRad*2; //назначение центра скругления
	centerPoint.y = flanParams.bendRad*2;
	addArc(shape, dxfPrimitivesArr0, centerPoint, flanParams.bendRad, startAngle, endAngle, dxfBasePoint);
	}
	
	//прорисовка нижнего участка
	p1.x = flanParams.bendRad*2;
	p1.y = flanParams.bendRad;
	p2 = newPoint_xy(p1, 0, -flanParams.bendRad); // params basePoint, deltaX, deltaY
	addLine(shape, dxfPrimitivesArr0, p1, p2, dxfBasePoint);
	
	return shape;
}
	
/*отрисовка шейпа боковины уголка*/

function drawAngleSupportSide_(width, height, holeDist, hole2Y, holeDiam, metalThickness){

	var flanParams = { //объявление параметров уголка
			width:width,
			height:height,
			holeDiam:holeDiam,
			holeDist:holeDist,
			angleRadUp:10,
			angleRadDn:0,
			metalThickness:metalThickness,
			hole2X:0,
			hole2Y:hole2Y,
			hole3X:0,
			hole3Y:hole2Y,
			dxfBasePoint: dxfBasePoint,
			dxfPrimitivesArr: dxfPrimitivesArr0
			
		}

		flanParams.height = flanParams.height - flanParams.metalThickness*2;
		if(holeDist==0){
			flanParams.hole2X = flanParams.width/2;
		}
		else {
			flanParams.hole2X = (flanParams.width - flanParams.holeDist)/2;
			flanParams.hole3X = flanParams.hole2X;
			
		}
	var shape = drawRectFlan(flanParams).shape;
	
	return shape;
}





