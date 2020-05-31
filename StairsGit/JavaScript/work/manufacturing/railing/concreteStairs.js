var concrete = [];

function drawConcrete(viewportId){

//удаляем предыдущую лестницу
	if (concrete) removeObjects(viewportId, 'concrete');
	
//очищаем глобальные массивы
	concrete = [];
	
	
	var concreteMaterial = params.materials.concrete;//new THREE.MeshLambertMaterial({color: 0xBFBFBF});
	
//перебираем все бетонные объекты
	var concretePartsAmt = $("#stairSectAmt").val();	
	for(var i=1; i<=concretePartsAmt; i++){
		//для каждой секции формируем массив параметров
		var sectParams = {
			dxfArr: [],
			dxfBasePoint: {x:0, y:0},
			};
		$("#concreteParamsTable tr").eq(i).find('td input,select,textarea').each(function(){
			var inputId = $(this).attr("id");
			var propName = inputId.match(/^([^0-9]+)[0-9]+$/)[1]; //отсекаем индекс
			sectParams[propName] = $(this).val();
		});
			
		//общие параметры
		sectParams.material = concreteMaterial;
		
		if(sectParams.sectType == "марш"){
			sectParams = drawMarsh(sectParams);			
			}
		if(sectParams.sectType == "поворот"){
			sectParams = drawTurn(sectParams);			
			}		
		if(sectParams.sectType == "площадка"){
			sectParams = drawPlatform(sectParams);			
			}
			
		var mesh = sectParams.mesh;
			mesh.position.x = sectParams.posX;
			mesh.position.y = sectParams.posY;
			mesh.position.z = sectParams.posZ;
			mesh.rotation.y = sectParams.posAng * Math.PI / 180;
			concrete.push(mesh);
			
			dxfBasePoint.x += 2000;
		}
		
	//добавляем белые ребра для всех объектов
	for (var i = 0; i < concrete.length; i++) addWareframe(concrete[i], concrete);
	
	//добавляем объекты в сцену
	addObjects(viewportId, concrete, 'concrete');

}; //end of drawConcrete


function drawMarsh(par){

	par.M = par.sectWidth;
	par.mesh = new THREE.Object3D();
	var shape = new THREE.Shape();

	//ступени
	var points = [];
	var point = { "x": 0.0, "y": 0.0 };
	points.push(point)
	
	for (var i = 0; i < par.stairAmt; i++) {		
		point = newPoint_xy(point, 0, par.h*1.0);
		points.push(point)
		point = newPoint_xy(point, par.b*1.0, 0);
		points.push(point) 
		};
	var botLineP1 = points[points.length - 1]
	
	if(par.marshType == "пилообразный"){
		//Точки на нижней линии
		var botLine = parallel(points[0], points[2], -par.sectThk*1.0);

		//верхняя точка
		var point = itercection(botLineP1, newPoint_xy(botLineP1, 0, -100), botLine.p1, botLine.p2);
		points.push(point)
		
		//нижняя точка
		var point = itercection(points[0], newPoint_xy(points[0], 100, 0), botLine.p1, botLine.p2);
		points.push(point)
		}
		
	if(par.marshType == "ломаный"){
		point = newPoint_xy(botLineP1, 0, -par.sectThk*1.0);
		points.push(point)
		point = newPoint_xy(point, -(par.b - par.sectThk), 0);
		points.push(point)
		
		for (var i = 0; i < par.stairAmt-2; i++) {	
			point = newPoint_xy(point, 0, -par.h*1.0);
			points.push(point) 
			point = newPoint_xy(point, -par.b*1.0, 0);
			points.push(point)			
			};
		point = newPoint_xy(points[0], par.b * 1.0 + par.sectThk * 1.0, 0);
		points.push(point);	
		}
	
	for (var i = 0; i < points.length; i++) {		
		if(i < points.length-1)
		addLine(shape, dxfPrimitivesArr, points[i], points[i+1], par.dxfBasePoint);
		if(i == points.length-1)
			addLine(shape, dxfPrimitivesArr, points[i], points[0], par.dxfBasePoint);
		};
		
	var extrudeOptions = {
        amount: par.M,
        bevelEnabled: false,
        curveSegments: 12,
        steps: 1
		};
		
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
    geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
    var marsh = new THREE.Mesh(geom, par.material);
	par.mesh.add(marsh);
	
	//деревянные ступени
	if(params.stairType != "нет"){
		for (var i = 0; i < par.stairAmt; i++) {
			
			var plateParams = {
				len: par.M,
				width: par.b * 1.0 + params.nose * 1.0,
				dxfBasePoint: par.dxfBasePoint,
				dxfArr: dxfPrimitivesArr,
				thk: params.treadThickness,
				material: params.materials.tread,
				partName: "tread",
			};
			if (params.riserType == "есть") plateParams.width += params.riserThickness
			
			//выводим в dxf только одну ступень
			plateParams.dxfArr = dxfPrimitivesArr;
			if (i > 0) {
				plateParams.dxfArr = [];
				addToDxf = false;
			}

			var tread = drawPlate(plateParams).mesh;//Стандартная отрисовка
			tread.rotation.x = Math.PI / 2;
			tread.rotation.z = Math.PI / 2;
			tread.position.x = par.b * (i + 1);
			tread.position.y = par.h * (i + 1) + params.treadThickness;
			par.mesh.add(tread);
			tread.setLayer('treads');
			
			//подступенок
			if (params.riserType == "есть") {
				
				var riserPar = {
					len: plateParams.len,
					width: par.h - params.treadThickness,
					thk: params.riserThickness,
					dxfArr: [],
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, 2000, 0),
					hasTopScrews: false,
					hasBotScrews: false
				};
				
				riserPar = drawRectRiser(riserPar);
				riser = riserPar.mesh;
				riser.rotation.z = -Math.PI / 2;
				riser.rotation.y = -Math.PI / 2;
				//riser.position.z = -frontLine.p1.y + treadParams.offsetIn;
				riser.position.y = tread.position.y - params.treadThickness;
				riser.position.x = tread.position.x - par.b;
				par.mesh.add(riser);
				riser.setLayer('risers');
			}
		};


		
		
		}
	
	return par;
		

}//end of drawMarsh

function drawTurn(par){
	
	var turnFactor = 1;
    if(par.turnAngle < 0) {
		turnFactor = -1;
	}
	
	par.mesh = new THREE.Object3D();
	var stepAngle = par.turnAngle * Math.PI / 180 / par.stairAmt * turnFactor;
	var treadParams = {
		startAngle: 0,
		endAngle: 0,
		offsetIn: par.offsetIn * 1.0, 
		turnAngle: par.turnAngle * Math.PI / 180 * turnFactor,
		marshWidth1: par.sectWidth * 1.0,
		marshWidth2: par.sectWidthS * 1.0,
		turnFactor: turnFactor,
		dxfArr: par.dxfArr,
		dxfBasePoint: {x:0, y:0},
		material: par.material,
		thk: 300,
		nose: 0,
	}

	for(var i=0; i<par.stairAmt; i++){
		//бетонная ступень
		treadParams.thk = 300;
		treadParams.material = par.material;		
		treadParams.startAngle = stepAngle * i;
		treadParams.endAngle = stepAngle * (i + 1);
		treadParams.noseFront = 0;
		
		
		treadParams = drawTurnStep(treadParams)
		var tread = treadParams.mesh;
		tread.rotation.x = -Math.PI / 2;
		tread.position.y = par.h * (i + 1) - treadParams.thk;
		tread.position.z = treadParams.offsetIn;
		par.mesh.add(tread);
		
		//переднее ребро
		var frontLine = {
			p1: copyPoint(treadParams.startLine.p1),
			p2: copyPoint(treadParams.startLine.p2),
		}
		
		//деревянная ступень
		if(params.stairType != "нет"){
			treadParams.thk = params.treadThickness;
			treadParams.material = params.materials.tread;
			treadParams.noseFront = params.nose;
			if(params.riserType == "есть") treadParams.noseFront += params.riserThickness;

			treadParams = drawTurnStep(treadParams)
			var tread = treadParams.mesh;
			tread.rotation.x = -Math.PI / 2;
			tread.position.y = par.h * (i + 1);
			tread.position.z = treadParams.offsetIn;
			par.mesh.add(tread);
			tread.setLayer('treads');
			
			//подступенок
			if (params.riserType == "есть") {
				console.log(treadParams)
				
				var riserPar = {
					len: treadParams.startLine.len,
					width: par.h - params.treadThickness,
					thk: params.riserThickness,
					dxfArr: [],
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, 2000, 0),
					hasTopScrews: false,
					hasBotScrews: false
				};
				
				riserPar = drawRectRiser(riserPar);
				riser = riserPar.mesh;
				riser.rotation.z = -Math.PI / 2;
				riser.rotation.y = treadParams.startAngle;
				riser.position.z = -frontLine.p1.y + treadParams.offsetIn;
				riser.position.y = tread.position.y;
				riser.position.x = frontLine.p1.x;
				par.mesh.add(riser);
				riser.setLayer('risers');
			}
		}
	}

	return par;
}//end of drawTurn

/** функця отрисовывает забежную ступень
	var treadParams = {
		startAngle: 0,
		endAngle: 0,
		offsetIn: par.offsetIn * 1.0, //смещение центра по x и y от края поворота
		turnAngle: par.turnAngle * Math.PI / 180 * turnFactor, //полный угол поворота
		marshWidth1: par.sectWidth * 1.0, //ширина нижнего марша
		marshWidth2: par.sectWidthS * 1.0, //ширина верхнего марша
		turnFactor: turnFactor, //правый или левый поворот
		dxfArr: par.dxfArr,
		dxfBasePoint: {x:0, y:0},
		material: par.material,
		thk: 300, //толщина ступени
		noseFront: 0, //свес ступени спереди (по startAngle)
		noseReae: 0, //свес ступени сзади (по endAngle)
	}
*/
function drawTurnStep(par){

	var center = {x:0, y:0}; //центр поворота
	
	//костыль, чтобы не разваливалась геометрия со свесом при 0 отсутпе
	if(par.noseFront != 0 && par.offsetIn == 0) par.offsetIn = 1
	
	//точки на границе поворота (в плане)
	
	var turnBorder = {};	

	//линия начала поворота - передняя грань первой (нижней) ступени
	turnBorder.startIn = polar(center, 0, par.offsetIn);
	turnBorder.startOut = polar(center, 0, par.offsetIn + par.marshWidth1);

	//линия конца поворота - задняя грань последней (верхней) ступени
	turnBorder.endIn = polar(center, par.turnAngle, par.offsetIn);
	turnBorder.endOut = polar(center, par.turnAngle, par.offsetIn + par.marshWidth2);
	
	//внутренний угол
	turnBorder.cornerIn = itercection(turnBorder.startIn, polar(turnBorder.startIn, Math.PI / 2, 100), turnBorder.endIn, polar(turnBorder.endIn, Math.PI / 2 + par.turnAngle, 100));
	
	//внешний угол
	turnBorder.cornerOut = itercection(turnBorder.startOut, polar(turnBorder.startOut, Math.PI / 2, 100), turnBorder.endOut, polar(turnBorder.endOut, Math.PI / 2 + par.turnAngle, 100));
	
//передняя линия ступени

	var startLine = {
		p1: copyPoint(center),
		p2: polar(center, par.startAngle, 1)
	}
	
	if(par.noseFront != 0) {
		startLine = parallel(startLine.p1, startLine.p2, -par.noseFront)
	}
	
	var linePar = {
		line: startLine,
		turnBorder: turnBorder,
		turnAngle: par.turnAngle,
		center: center,
	};
	
	getTurnIntercectPoints(linePar)

//задняя линия ступени

	var endLine = {
		p1: copyPoint(center),
		p2: polar(center, par.endAngle, 1)
	}

	var linePar = {
		line: endLine,
		turnBorder: turnBorder,
		turnAngle: par.turnAngle,
		center: center,
	};
	
	getTurnIntercectPoints(linePar)
	
	var points = [];
	
	//ступень без внутреннего отступа
	if(par.offsetIn == 0){
		points.push(center);
	}
	//ступень c внутренним отступом
	if(par.offsetIn != 0){
		points.push(startLine.p1);
		if(par.startAngle < par.turnAngle / 2 && par.endAngle > par.turnAngle / 2) points.push(turnBorder.cornerIn);
		points.push(endLine.p1);
	}
	
	points.push(endLine.p2);
	if(par.startAngle < par.turnAngle / 2 && par.endAngle > par.turnAngle / 2) points.push(turnBorder.cornerOut);
	points.push(startLine.p2);
	
	if(par.turnFactor == -1){
		points.forEach(function(point){
			point.x *= -1;
		})
	}

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
		radOut: 0,
	}

	var shape = drawShapeByPoints2(shapePar).shape;
	
	var extrudeOptions = {
		amount: par.thk,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	
	geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geometry, par.material);
	par.mesh = mesh;
	
	startLine.len = distance(startLine.p1, startLine.p2)
	par.startLine = startLine;
	
	return par;
}

/** функция возвращает точки пересечения линии с внешней и внутренней границей поворота лестницы
	line
	turnBorder
	turnAngle
	center
*/
function getTurnIntercectPoints(par){

	//пересечение с внутренней линией нижнего и верхнего марша
	var p1 = itercection(par.line.p1, par.line.p2, par.turnBorder.startIn, par.turnBorder.cornerIn)
	var p2 = itercection(par.line.p1, par.line.p2, par.turnBorder.endIn, par.turnBorder.cornerIn)
	
	//выбираем точку, которая ближе к центру поворота
	par.line.p1 = p1;
	if(distance(par.center, p2) < distance(par.center, p1)) par.line.p1 = p2;
	
	//пересечение с внешней линией нижнего и верхнего марша
	var p1 = itercection(par.line.p1, par.line.p2, par.turnBorder.startOut, par.turnBorder.cornerOut)
	var p2 = itercection(par.line.p1, par.line.p2, par.turnBorder.endOut, par.turnBorder.cornerOut)
	
	//выбираем точку, которая ближе к центру поворота
	par.line.p2 = p1;
	if(distance(par.center, p2) < distance(par.center, p1)) par.line.p2 = p2;

	return par;
}

function drawPlatform(par){
	
	par.mesh = new THREE.Object3D();
	par.dxfArr = [];
	par.dxfBasePoint = {x:0, y:0};
	par.sectWidth = par.sectWidth * 1.0;
	par.sectWidthS = par.sectWidthS * 1.0;
	par.sectLen = par.sectLen * 1.0;
	
	var treadThickness = par.sectThk;
	var extrudeOptions = {
		amount: treadThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
		};
	
	var deltaWidth = par.sectWidth - par.sectWidthS
	
	var shape = new THREE.Shape();
	var p0 = {x:0, y:0};
	var p1 = newPoint_xy(p0, par.sectWidth, 0);
	if(par.cutSide == "справа") var p2 = newPoint_xy(p1, -deltaWidth, par.sectLen);
	if(par.cutSide == "слева") var p2 = newPoint_xy(p1, 0, par.sectLen);
	if(par.cutSide == "две") var p2 = newPoint_xy(p1, -deltaWidth/2, par.sectLen);
	var p3 = newPoint_xy(p2, -par.sectWidthS, 0);

	addLine(shape, par.dxfArr, p0, p1, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
	addLine(shape, par.dxfArr, p3, p0, par.dxfBasePoint);
	
	//console.log(par)
	//console.log(p0, p1, p2, p3);
	
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));	
	var tread = new THREE.Mesh(geom, par.material);
	tread.rotation.x = -Math.PI / 2;
	tread.rotation.z = -Math.PI / 2;
	tread.position.y = -treadThickness;
	//tread.position.z = par.sectWidth / 2;
	par.mesh.add(tread);


	return par;
}//end of drawPlatform

