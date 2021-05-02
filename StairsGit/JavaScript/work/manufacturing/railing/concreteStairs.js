var concrete = [];
var concreteSectParams = {};
function redrawConcrete(){

//удаляем предыдущую лестницу
	if (concrete) removeObjects(false, 'concrete');
	
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
			if ($(this).attr('type') == 'checkbox') sectParams[propName] = $(this).is(':checked');
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
		
		if(sectParams.sectType == "пригласительные"){
			sectParams = drawStartUnitConcrete(sectParams);
		}
		
		concreteSectParams[i] = sectParams;
			
		var mesh = sectParams.mesh;
		mesh.position.x = sectParams.posX * 1.0;
		mesh.position.y = sectParams.posY * 1.0;
		mesh.position.z = sectParams.posZ * 1.0;
		mesh.rotation.y = sectParams.posAng * Math.PI / 180;
		mesh.sectParams = {
			id: i
		};
		concrete.push(mesh);
		mesh.objectRowClass = 'concreteParRow'
		mesh.objectRowId = i;

		dxfBasePoint.x += 2000;
	}

	// Перемещаем соединенные секции
	concrete.forEach(function(section){
		var connectedSectionId = $('.concreteParRow[data-id="'+section.sectParams.id+'"]').find('input.connectedSectionId').val();
		if (concreteSectParams[connectedSectionId * 1.0] && connectedSectionId && connectedSectionId != 0) {
			var connectSect = concrete.find(s => s.sectParams.id == connectedSectionId);

			var sectPar = concreteSectParams[connectedSectionId * 1.0];

			section.position.x += connectSect.position.x + sectPar.connectPoint.x + concreteSectParams[section.sectParams.id].basePoint.x;
			section.position.y += connectSect.position.y + sectPar.connectPoint.y + concreteSectParams[section.sectParams.id].basePoint.y;
			section.position.z += connectSect.position.z + sectPar.connectPoint.z + concreteSectParams[section.sectParams.id].basePoint.z;
		}
	});

	//добавляем белые ребра для всех объектов
	for (var i = 0; i < concrete.length; i++) addWareframe(concrete[i], concrete);
	
	//добавляем объекты в сцену
	addObjects(false, concrete, 'concrete');
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

	var botLineP1 = points[points.length - 1];
	
	if(par.marshType == "пилообразный"){
		//Точки на нижней линии
		var botLine = parallel(points[0], points[2], -par.sectThk*1.0);

		//верхняя точка
		var point = itercection(botLineP1, newPoint_xy(botLineP1, 0, -100), botLine.p1, botLine.p2);
		points.push(point);
		
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
		if(i < points.length-1) addLine(shape, dxfPrimitivesArr, points[i], points[i+1], par.dxfBasePoint);
		if(i == points.length-1) addLine(shape, dxfPrimitivesArr, points[i], points[0], par.dxfBasePoint);
	};

	par.basePoint = {
		x:0,y:0,z:0
	}

	par.connectPoint = {
		x: botLineP1.x,
		y: botLineP1.y,
		z: par.M / 2,
	}

	par.sectLen = botLineP1.x;

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
				if (i == 0) riserPar.width += params.treadThickness;
				
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
			
			if (par.skirtingType != 'нет') {
				// Плинтуса
				var skirtingParams = {
					rise: par.h * 1.0,
					step: par.b * 1.0,
					isLast: i == (par.stairAmt - 1),
					dxfArr: dxfPrimitivesArr,
					dxfBasePoint: par.dxfBasePoint
				}
				if (params.riserType == 'есть' && i == (par.stairAmt - 1)) skirtingParams.step += params.riserThickness;
				if (i == 0) skirtingParams.rise += params.treadThickness;
				
				if (par.skirtingType == 'слева' || par.skirtingType == 'две стороны') {
					skirtingParams = drawSkirting2(skirtingParams);
					var skirting = skirtingParams.mesh;
					skirting.position.x = par.b * i;
					if (params.riserType == 'есть' && i < par.stairAmt) skirting.position.x -= params.riserThickness;
					
					skirting.position.y = par.h * i + params.treadThickness;
					if (i == 0) skirting.position.y -= params.treadThickness;
					par.mesh.add(skirting);
				}
				if (par.skirtingType == 'справа' || par.skirtingType == 'две стороны') {
					skirtingParams = drawSkirting2(skirtingParams);
					var skirting = skirtingParams.mesh;
					skirting.position.x = par.b * i;
					if (params.riserType == 'есть' && i < par.stairAmt) skirting.position.x -= params.riserThickness;
					
					skirting.position.y = par.h * i + params.treadThickness;
					if (i == 0) skirting.position.y -= params.treadThickness;
					skirting.position.z = par.M - 20;
					par.mesh.add(skirting);
				}
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

	par.basePoint = {
		x:0, y:0, z: 0
	}

	par.connectPoint = {
		x: 0, y: par.h * par.stairAmt, z: 0
	}

	for(var i=0; i<par.stairAmt; i++){
		//бетонная ступень
		treadParams.thk = 300;
		treadParams.material = par.material;		
		treadParams.startAngle = stepAngle * i;
		treadParams.endAngle = stepAngle * (i + 1);
		treadParams.noseFront = 0;
		
		treadParams.partName = null;

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
			treadParams.partName = 'timberTurnTread';

			treadParams = drawTurnStep(treadParams)
			var tread = treadParams.mesh;
			tread.rotation.x = -Math.PI / 2;
			tread.position.y = par.h * (i + 1);
			tread.position.z = treadParams.offsetIn;
			par.mesh.add(tread);
			tread.setLayer('treads');
			
			//подступенок
			if (params.riserType == "есть") {				
				var riserPar = {
					len: treadParams.startLine.len,
					width: par.h - params.treadThickness,
					thk: params.riserThickness,
					dxfArr: [],
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, 2000, 0),
					hasTopScrews: false,
					hasBotScrews: false
				};

				if (i == 0) riserPar.width += params.treadThickness
				
				riserPar = drawRectRiser(riserPar);
				riser = riserPar.mesh;
				riser.rotation.z = -Math.PI / 2;
				riser.rotation.y = treadParams.startAngle;				
				riser.position.z = -frontLine.p1.y + treadParams.offsetIn;
				riser.position.y = tread.position.y;
				riser.position.x = frontLine.p1.x;
				
				if(turnFactor == -1) {
					riser.rotation.y = - treadParams.startAngle;
					riser.rotation.z = Math.PI / 2;
					riser.position.y -= par.h - params.treadThickness
				}
				par.mesh.add(riser);
				riser.setLayer('risers');
			}
		}

		if (par.skirtingType != 'нет') {
			// Плинтуса
			var skirtingParams = {
				rise: par.h * 1.0,
				step: distance(treadParams.startLine.p2, treadParams.endLine.p2) - params.nose,
				isLast: i == (par.stairAmt - 1),
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: par.dxfBasePoint
			}
			if (i == 0) skirtingParams.rise += params.treadThickness

			if (params.riserType == 'есть') {
				skirtingParams.step -= params.riserThickness;
			}

			if (i == (par.stairAmt / 2 - 1) && par.stairAmt % 2 == 0) {
				skirtingParams.isLast = true;
			}
			
			var firstPartStep = i < (par.stairAmt / 2);
			if (par.stairAmt % 2 != 0) {
				firstPartStep = i < (Math.ceil(par.stairAmt / 2))
			}
			var ang = angle(treadParams.endLine.p2, treadParams.startLine.p2);

			var skirtingPos = {x: treadParams.startLine.p2.x, y: -treadParams.startLine.p2.y};
			skirtingPos = polar(skirtingPos, ang, -params.nose);
			if (par.stairAmt % 2 == 0 && i == par.stairAmt / 2) {
				var ang = angle(treadParams.endLine.p2, treadParams.cornerOut);
				skirtingPos.x = treadParams.cornerOut.x;
				skirtingPos.y = -treadParams.cornerOut.y;
				skirtingPos = polar(skirtingPos, ang, -params.nose);
			}

			// Вторая половина поворота
			if (par.stairAmt % 2 != 0 && i == (Math.floor(par.stairAmt / 2))) {
				skirtingParams.step = distance(treadParams.startLine.p2, treadParams.cornerOut) + params.nose;
				var ang = angle(treadParams.startLine.p2, treadParams.cornerOut);
				skirtingPos.x = treadParams.startLine.p2.x;
				skirtingPos.y = -treadParams.startLine.p2.y;
				skirtingPos = polar(skirtingPos, ang, -params.nose);
			}
			
			skirtingParams = drawSkirting2(skirtingParams);
			var skirting = skirtingParams.mesh;

			skirtingPos = polar(skirtingPos, ang + Math.PI / 2, 20);

			skirting.position.y = par.h * i + params.treadThickness;
			if (i == 0) skirting.position.y -= params.treadThickness

			skirting.position.x = skirtingPos.x;
			skirting.position.z = skirtingPos.y + treadParams.offsetIn;
			
			if (!firstPartStep) {
				ang += Math.PI;
			}
			skirting.rotation.y = ang;

			var pos = {x: skirting.position.x, z: skirting.position.z};

			par.mesh.add(skirting);


			// Вторая половина поворота
			if (par.stairAmt % 2 != 0 && i == (Math.floor(par.stairAmt / 2))) {
				skirtingParams.isNotVerticalPlank = true;
				skirtingParams.step = distance(treadParams.endLine.p2, treadParams.cornerOut);
				if (params.riserType == 'есть') {
					skirtingParams.step -= params.riserThickness;
				}
				var ang = angle(treadParams.endLine.p2, treadParams.cornerOut);

				skirtingParams = drawSkirting2(skirtingParams);
				var skirting = skirtingParams.mesh;

				skirting.position.y = par.h * i + params.treadThickness;
				skirting.position.x = treadParams.cornerOut.x;
				skirting.position.z = -treadParams.cornerOut.y + 20;
				skirting.rotation.y = Math.PI;
				par.mesh.add(skirting);
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
		startAngle: par.startAngle,

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
		endAngle: par.endAngle,
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
	if(par.startAngle < par.turnAngle / 2 && par.endAngle > par.turnAngle / 2 || par.startAngle == par.turnAngle / 2) points.push(turnBorder.cornerOut);
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
	par.endLine = endLine;
	par.cornerOut = turnBorder.cornerOut;

	var partName = par.partName;
	if (typeof specObj != 'undefined' && partName) {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				paintedArea: 0,
				volume: 0,
				area: 0,
				name: "Забежная ступень",
				metalPaint: false,
				timberPaint: true,
				division: "timber",
				workUnitName: "area",
				group: "Ступени",
				type_comments: {}
			}
		}
		var name = '';
		var box3 = new THREE.Box3().setFromObject(par.mesh);
		var area = ((box3.max.x - box3.min.x) / 1000) * ((box3.max.y - box3.min.y) / 1000);
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		specObj[partName]["volume"] += (box3.max.x - box3.min.x) * (box3.max.y - box3.min.y) * par.thk / 1000000000;
		specObj[partName]["paintedArea"] += ((box3.max.x - box3.min.x) / 1000) * ((box3.max.y - box3.min.y) / 1000);
				
		par.mesh.specParams = {specObj: specObj, amt: 1, partName: partName, name: name}

		par.mesh.specId = partName + name;
		addMaterialNeed({id: calcTreadParams().treadsPanelName, amt: area, itemType:  'treads'});
		par.mesh.isInMaterials = true;
	}
	
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
	if (distance(par.center, p2) < distance(par.center, p1)) par.line.p1 = p2;

	//пересечение с внешней линией нижнего и верхнего марша
	var p1 = itercection(par.line.p1, par.line.p2, par.turnBorder.startOut, par.turnBorder.cornerOut)
	var p2 = itercection(par.line.p1, par.line.p2, par.turnBorder.endOut, par.turnBorder.cornerOut)
	
	//выбираем точку, которая ближе к центру поворота
	par.line.p2 = p1;
	//if (distance(par.center, p2) < distance(par.center, p1)) par.line.p2 = p2;
	if (par.startAngle && par.startAngle > Math.PI / 4) par.line.p2 = p2;
	if (par.endAngle && par.endAngle > Math.PI / 4) par.line.p2 = p2;

	return par;
}

function drawPlatform(par){
	
	par.mesh = new THREE.Object3D();
	par.dxfArr = [];
	par.dxfBasePoint = {x:0, y:0};
	par.sectWidth = par.sectWidth * 1.0;
	par.sectWidthS = par.sectWidthS * 1.0;
	par.sectLen = par.sectLen * 1.0;
	
	var treadThickness = par.sectThk * 1.0;
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

	par.basePoint = {
		x:0,y:treadThickness,z:0
	}

	par.connectPoint = {
		x: 0,
		y: 0,
		z: 0,
	}

	
	//console.log(par)
	//console.log(p0, p1, p2, p3);
	
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));	
	var tread = new THREE.Mesh(geom, par.material);
	tread.rotation.x = -Math.PI / 2;
	tread.rotation.z = -Math.PI / 2;
	tread.position.y = -treadThickness;
	par.mesh.add(tread);

	//деревянные ступени
	if(params.stairType != "нет"){
		var shape = new THREE.Shape();
		var baseLineOffset = params.nose;
		if (params.riserType == 'есть') baseLineOffset += params.riserThickness;
		var baseLine = parallel(p0, p1, 0 -baseLineOffset);
		addLine(shape, par.dxfArr, baseLine.p1, baseLine.p2, par.dxfBasePoint);
		addLine(shape, par.dxfArr, baseLine.p2, p2, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p3, baseLine.p1, par.dxfBasePoint);

		var extrudeOptions = {
			amount: params.treadThickness,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};
		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));	
		var tread = new THREE.Mesh(geom, params.materials.tread);
		tread.rotation.x = -Math.PI / 2;
		tread.rotation.z = -Math.PI / 2;
		tread.position.y = 0;//treadThickness;
		//tread.position.z = par.sectWidth / 2;
		par.mesh.add(tread);
		tread.setLayer('treads');

		if (params.riserType == 'есть') {
			var riserPar = {
				len: distance(p0, p1),
				width: par.sectThk * 1.0,
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
			// riser.position.y = tread.position.y - params.treadThickness;
			// riser.position.x = tread.position.x - par.b;
			par.mesh.add(riser);
			riser.setLayer('risers');
		}
		
		if (par.firstSkirting || par.thirdSkirting) {
			// Плинтуса
			var skirtingParams = {
				rise: 0,
				step: distance(p0, p1),
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: par.dxfBasePoint,
				isNotVerticalPlank: true,
				isLast: true
			}

			if (par.firstSkirting) {
				skirtingParams = drawSkirting2(skirtingParams);
				var skirting = skirtingParams.mesh;
				skirting.position.z = skirtingParams.step;
				skirting.position.y = params.treadThickness;
				skirting.rotation.y = Math.PI / 2;
				par.mesh.add(skirting);
			}

			if (par.thirdSkirting) {
				skirtingParams = drawSkirting2(skirtingParams);
				var skirting = skirtingParams.mesh;
				skirting.position.x = distance(p3, p0) - params.riserThickness;
				skirting.position.z = skirtingParams.step;
				skirting.position.y = params.treadThickness;
				skirting.rotation.y = Math.PI / 2;
				par.mesh.add(skirting);
			}
		}
		console.log(par.firstSkirting, par.secondSkirting, par.fourthSkirting)
		if (par.secondSkirting || par.fourthSkirting) {
			// Плинтуса
			var skirtingParams = {
				rise: 0,
				step: distance(p3, p0),
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: par.dxfBasePoint,
				isNotVerticalPlank: true,
				isLast: true
			}
			if (par.secondSkirting) {
				skirtingParams = drawSkirting2(skirtingParams);
				var skirting = skirtingParams.mesh;
				skirting.position.y = params.treadThickness;
				par.mesh.add(skirting);
			}

			if (par.fourthSkirting) {
				skirtingParams = drawSkirting2(skirtingParams);
				var skirting = skirtingParams.mesh;
				skirting.position.y = params.treadThickness;
				skirting.position.z = distance(p0, p1) - params.riserThickness;
				par.mesh.add(skirting);
			}
		}
		
		var partName = 'platformTread';
		if (typeof specObj != 'undefined' && partName) {
			if (!specObj[partName]) {
				specObj[partName] = {
					types: {},
					amt: 0,
					name: "Ступень площадка",
					area: 0,
					volume: 0,
					paintedArea: 0,
					metalPaint: false,
					timberPaint: true,
					division: "timber",
					workUnitName: "amt",
					group: "treads",
				}
			}
			var area = par.sectLen * par.sectWidth / 1000000;
			var paintedArea = area * 2 + (par.sectLen + par.sectWidth) * 2 * treadThickness / 1000000;
	
			var name = Math.round(par.sectLen) + "x" + Math.round(par.sectWidth) + "x" + Math.round(treadThickness);
			if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
			if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
			specObj[partName]["amt"] += 1;
			specObj[partName]["area"] += area;
			specObj[partName]["volume"] += par.sectLen * par.sectWidth * treadThickness / 1000000000;
			specObj[partName]["paintedArea"] += paintedArea;
			addMaterialNeed({id: calcTreadParams().treadsPanelName, amt: area, itemType:  'treads'});
			tread.isInMaterials = true;
		}

		tread.specId = partName + name;
	}

	return par;
}//end of drawPlatform


function drawStartUnitConcrete(par){
	par.mesh = new THREE.Object3D();
	par.dxfArr = [];
	console.log(par)
	
	var blockGeomPar = [
		{radiusFactor: 0, asymmetryFactor: 0, widthFactor: 130, stepFactor: 100},
		{radiusFactor: 0, asymmetryFactor: 0, widthFactor: 120, stepFactor: 100},
		{radiusFactor: 0, asymmetryFactor: 0, widthFactor: 110, stepFactor: 100},

	];
	
	if(par.startTreadsTemplate == "прямые" || par.startTreadsTemplate == "прямоугольные" ){
		blockGeomPar[0].radiusFactor = 0;
		blockGeomPar[1].radiusFactor = 0;
		blockGeomPar[2].radiusFactor = 0;
	}

	if(par.startTreadsTemplate == "радиусные"){
		blockGeomPar[0].radiusFactor = 20;
		blockGeomPar[1].radiusFactor = 20;
		blockGeomPar[2].radiusFactor = 20;
		
		blockGeomPar[0].asymmetryFactor = 0;
		blockGeomPar[1].asymmetryFactor = 0;
		blockGeomPar[2].asymmetryFactor = 0;
	}
	if(par.startTreadsTemplate == "веер"){
		blockGeomPar[0].radiusFactor = 30;
		blockGeomPar[1].radiusFactor = 20;
		blockGeomPar[2].radiusFactor = 20;
		
		blockGeomPar[0].asymmetryFactor = 30;
		blockGeomPar[1].asymmetryFactor = 20;
		blockGeomPar[2].asymmetryFactor = 10;
	}
	
	for(var i=0; i<par.stairAmt; i++){
		var stepWidth = par.b * (par.stairAmt - i);
		//учитываем к-т проступи
		var delta = par.b * (par.stairAmt - i - 1) * (par.stepFactor - 100) / 100
		stepWidth += delta
		
		//бетонная ступень
		var treadPar = {
			side: par.arcSide,
			dxfBasePoint: { x: -3000, y: 0 },
			radiusFactor: blockGeomPar[i].radiusFactor,//params.radiusFactor, //определяет радиус передней кромки
			asymmetryFactor: blockGeomPar[i].asymmetryFactor,//params.asymmetryFactor, //определяет симметричность ступени
			widthFactor: blockGeomPar[i].widthFactor, //params.widthFactor, //определяет ширину для прямоугольных
			fullArcFront: false,
			stepFactor: blockGeomPar[i].stepFactor,
			len: par.sectWidth * 1.0,
			width: stepWidth,
			rearLedge: { width: 0, len: par.sectWidth },
			template: par.startTreadsTemplate,
			thk: par.h,
			rise: par.h,
			material: params.materials.concrete,
		}
		
		
		var treadObj = drawStartTread(treadPar).mesh;
		treadObj.position.y = par.h * (i + 1)
		treadObj.position.x = -stepWidth
		par.mesh.add(treadObj)
		
		//деревянная ступень
		if(params.stairType != "нет"){
			var timberTreadPar = Object.assign({}, treadPar);
			timberTreadPar.thk = params.treadThickness;
			timberTreadPar.material = params.materials.timber;
			timberTreadPar.width += params.nose * 2;
			if (params.riserType == "есть") timberTreadPar.width += params.riserThickness
			
			var tread = drawStartTread(timberTreadPar).mesh;
			tread.position.y = treadObj.position.y + par.h * 1.0
			tread.position.x = -timberTreadPar.width + params.nose
			par.mesh.add(tread)
			
			if (params.riserType == "есть") {
				var riser = drawStartRiser(timberTreadPar).mesh;
				riser.position.x = tread.position.x;
				riser.position.y = tread.position.y - params.treadThickness - par.h;
				par.mesh.add(riser);

			}
		}
		
	}
	return par
}//end of drawStartUnitConcrete