/***  Секции маршей   ***/


function drawRailingSection(par) {

/*

len
angle
cutBotY
cutTopY
type
isHandrail
handrailLeftEnd
handrailRightEnd
railingSide

*/

	par.mesh = new THREE.Object3D();
	par.mesh.objectRowClass = 'railingParRow';
	par.mesh.objectRowId = par.sectID;

	/*материалы*/
	var timberMaterial = params.materials.handrail;//new THREE.MeshLambertMaterial( { color: 0x804000, overdraw: 0.5} );
	var metalMaterial = params.materials.metal_railing;//new THREE.MeshLambertMaterial({color: 0xD0D0D0, wireframe: false});
	var glassMaterial = params.materials.glass;//new THREE.MeshLambertMaterial({opacity:0.6, color: 0x3AE2CE, transparent:true});

	var angle = par.angle * Math.PI / 180;
	
	
function drawNewellSect(){}; //пустая функция для навигации

if(par.railingType == "Ригели" || par.railingType == "Стекло на стойках" || par.railingType == "Экраны лазер"){
	var rackPosArr = [];
	//расстановка стоек с привязкой к номерам ступеней
	if(par.railingParType == "с марша"){
		var rackPosSteps = setRackPosition(par.stairAmt_r);
		//добавляем первую и последнюю ступени
		rackPosSteps.push(1);
		rackPosSteps.push(par.stairAmt_r * 1.0);
		
		for(var i=1; i<=par.stairAmt_r; i++){			
			var pos = {
				x: par.b_r * (i + 0.5 - 1),
				y: par.h_r * (i - 1),
				}
			if(rackPosSteps.indexOf(i) != -1){
				rackPosArr.push(pos);
				}
			
			}
		}

		//равномерная расстановка стоек
	if(par.railingParType != "с марша"){
		//первая стойка
		var pos0 = {x:0, y:0,}
		var pos = newPoint_x1(pos0, 70, angle);
		rackPosArr.push(pos);
		
		//средние стойки
		var middleRackAmt = Math.round(par.len / params.maxLen) - 1;
		if (middleRackAmt < 0) middleRackAmt = 0;
		var rackDist = par.len / (middleRackAmt + 1);
		pos = copyPoint(pos0)
		for (var i=0; i<middleRackAmt; i++){
			var pos = newPoint_x1(pos, rackDist, angle);
			rackPosArr.push(pos);
			}
		//последняя стойка
		var pos = newPoint_x1(pos0, par.len - 70, angle);
		rackPosArr.push(pos);
	}

		for(var i=0; i<rackPosArr.length; i++){
			var rackPar = {
				len: par.sectHeight - 70,		
				showPins: false,
				showHoles: false,
				isBotFlan: false,
				realHolder: true,
				holderAng: angle,
				railingSide: 1,
				stringerSideOffset: 0,
				material: metalMaterial,
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: newPoint_xy(par.dxfBasePoint, rackPosArr[i].x, rackPosArr[i].y),
			}
			if(params.rackBottom == "боковое") {
				rackPar.showHoles = true;
				//rackPar.len += 130;
			}
			if(params.rackBottom == "сверху с крышкой") rackPar.isBotFlan = true;

			var rack = drawRack3d_4(rackPar).mesh;
			rack.position.x = rackPosArr[i].x;
			rack.position.y = rackPosArr[i].y;
			rack.position.z = 0;
			
			//смещение последней стойки по Y
			if(i == rackPosArr.length - 1) rack.position.y += par.lastRackMooveY * 1.0;
			
			par.mesh.add(rack);
		}
	
	//ригели
	if (par.railingType == "Ригели") {
		var rigelProfileY = 20;
		var rigelProfileZ = 20;
		
		if(params.rigelMaterial == "20х20 черн.") {
			rigelModel = "rect";
			rigelProfileY = 20;
			rigelProfileZ = 20;
		}
		if(params.rigelMaterial == "Ф12 нерж.") {
			rigelModel = "round";
			rigelProfileY = 12;
			rigelProfileZ = 12;
		}
		if(params.rigelMaterial == "Ф16 нерж.") {
			rigelModel = "round";
			rigelProfileY = 16;
			rigelProfileZ = 16;
		}
		
		var rigelLen = distance(rackPosArr[0], rackPosArr[rackPosArr.length-1]) + 100;

		rigelAmt = params.rigelAmt * 1.0;
		var rigelDist = (par.sectHeight*1.0 - 150)/(rigelAmt+1);
		var poleParams = {
			partName: "rigels",
			type: rigelModel,
			poleProfileY: rigelProfileY,
			poleProfileZ: rigelProfileZ,
			length: rigelLen,
			poleAngle: angle,
			material: metalMaterial,
			dxfBasePoint: par.dxfBasePoint,
			dxfArr: dxfPrimitivesArr,
			rigelStartPlug: true,
			rigelEndPlug: true,
			}
		var basePoint = newPoint_xy(rackPosArr[0], 0, 90);
			basePoint = polar(basePoint, angle, -50);
			
		for (var i = 1; i < rigelAmt + 1; i++) {
			var rigel = drawPole3D_4(poleParams).mesh;
			rigel.position.x = basePoint.x;
			rigel.position.y = basePoint.y + rigelDist * i;
			rigel.position.z = -rigelProfileZ;
			if(par.railingSide == "левая") rigel.position.z = 40;
			par.mesh.add(rigel);
			}
	} //конец ригелей
	
	
if(par.railingType == "Стекло на стойках" || par.railingType == "Экраны лазер"){
	var glassDist = 40 / 2 + 22;
	var glassHeight = par.sectHeight - 70 - 100;
	if(par.angle != 0) glassHeight -= 70;
	var extrudeOptions = {
		amount: 8,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
		};
		
	glassParams = {
		p1: 0,
		p2: 0,
		angle: angle,
		glassDist: glassDist,
		glassHeight: glassHeight,
		glassExtrudeOptions: extrudeOptions,
		glassMaterial: glassMaterial,
		glassHolderMaterial: metalMaterial,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, 100),
	}
	if(par.railingType == "Экраны лазер") glassParams.glassMaterial = params.materials.metal;
		
	for (i=0; i<rackPosArr.length-1; i++) {
		glassParams.p1 = newPoint_xy(rackPosArr[i], 0 , -15);
		glassParams.p2 = newPoint_xy(rackPosArr[i+1], 0, -15);	
		var glass = drawGlassNewell(glassParams).mesh;
		if(par.angle != 0) glass.position.y += 100;
		glass.position.z = 0 + 16;
		par.mesh.add(glass);
		}
	
	} //конец стекла на стойках
	
	//поручень
	
	var handrailPar = {
		prof: params.handrailProf,
		sideSlots: params.handrailSlots,
		handrailType: params.handrail,
	}

	handrailPar = calcHandrailMeterParams(handrailPar); //функция в файле priceLib.js
	var handrailMaterial = metalMaterial;
	if(handrailPar.mat == "timber") handrailMaterial = timberMaterial;
	if(handrailPar.mat == "inox") handrailMaterial = params.materials.inox;
	
	var handrailLen = distance(rackPosArr[0], rackPosArr[rackPosArr.length-1]) + 200;

	var poleParams = {
			partName: "handrails",
			type: handrailPar.handrailModel,
			poleProfileY: handrailPar.profY,
			poleProfileZ: handrailPar.profZ,
			length: handrailLen,
			poleAngle: angle,
			material: handrailMaterial,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, rackPar.len - 20),
			dxfArr: dxfPrimitivesArr,
			rigelStartPlug: true,
			rigelEndPlug: true,
		}
		var profile = drawPole3D_4(poleParams).mesh;
		var basePoint = newPoint_xy(rackPosArr[0], 0, rackPar.len - 20);
			basePoint = polar(basePoint, angle, -100);
		profile.position.x = basePoint.x;
		profile.position.y = basePoint.y;
		profile.position.z =  0//-poleParams.poleProfileZ / 2;
		par.mesh.add(profile);
	
}//конец ограждений со стойками


if(par.railingType == "Решетка"){
	var rackPosArr = [];
	//расстановка стоек с привязкой к номерам ступеней
	if(par.railingParType == "с марша"){
		var rackPosSteps = setRackPosition(par.stairAmt_r);
		//добавляем первую и последнюю ступени
		rackPosSteps.push(1);
		rackPosSteps.push(par.stairAmt_r * 1.0);
		
		for(var i=1; i<=par.stairAmt_r; i++){			
			var pos = {
				x: par.b_r * (i + 0.5 - 1),
				y: par.h_r * (i - 1),
				}
			if(rackPosSteps.indexOf(i) != -1){
				rackPosArr.push(pos);
				}
			
			}
		}
	
	//равномерная расстановка стоек
	if(par.railingParType != "с марша"){
		//первая стойка
		var pos0 = {x:0, y:0,}
		var pos = newPoint_x1(pos0, 70, angle);
		rackPosArr.push(pos);
		
		//средние стойки
		var middleRackAmt = Math.round(par.len / 800) - 1;
		if (middleRackAmt < 0) middleRackAmt = 0;
		var rackDist = par.len / (middleRackAmt + 1);
		pos = copyPoint(pos0)
		for (var i=0; i<middleRackAmt; i++){
			var pos = newPoint_x1(pos, rackDist, angle);
			rackPosArr.push(pos);
			}
		//последняя стойка
		var pos = newPoint_x1(pos0, par.len - 70, angle);
		rackPosArr.push(pos);
	}

		var sectionPar = {
			platformLength: par.len,
			offsetStart: 0,
			offsetEnd: 0,
			handrailOffsetStart: 0,
			handrailOffsetEnd: 0,
			railingSide: 'right',
			railingModel: par.railingType,
			handrail: params.handrail,
			type: "секция railing",
			sectId: par.sectId,
			connection: "нет",
			angleStart: 0,
			angleEnd: 0,
			dxfBasePoint: par.dxfBasePoint,
			flans: par.flans,
			sectHeight: par.sectHeight,
		}
	var section = drawBalSection(sectionPar)
	par.mesh.add(section);

	
}//конец ограждений решетка

function drawGlassSect(){}; //пустая функция для навигации

	
//ограждения с самонесущим стеклом 
if(par.railingType == "стекло рут." || par.railingType == "стекло проф."){

	var glassThickness = params.glassThk;
	var extrudeOptions = {
		amount: glassThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
		};


	var glassDist = params.glassDist; //зазор между стеклами
	var handrailSlotDist = 0; 
	par.sectHeight = par.sectHeight * 1.0;
	var glassCutBot = par.glassCutBot * 1.0;
	var glassCutTop = par.glassCutTop * 1.0;	
	var maxLen = params.maxLen; //максимальная длина стекла по горизонтали
	var botSideGlassOffset = params.botSideGlassOffset; //отступ отверстия нижнего рутеля от края стекла по перпендикуляру
	//смещение первого рутеля от угла ступени/площадки
	var rutelOffset = {
		x: params.rutelOffset_x,
		y: -params.rutelOffset_y,
		}
	var rutelDist = params.rutelDist; //зазор между рутелями
	//отступ нижней линии стекла от нулевой точки по вертикали
	var offsetBot = -rutelOffset.y + rutelDist + botSideGlassOffset / Math.cos(angle) + rutelOffset.x * Math.tan(angle);
	if(par.railingType == "стекло проф.") offsetBot = 0;


	
	var rutelPosArr = [];	
		
	//разбиение секции на стекла с привязкой к номерам ступеней
	if(par.railingParType == "с марша" && par.railingType == "стекло рут."){
		var dividePos = setGlassDivide(par.stairAmt_r);
		
		//первые рутели первого стекла
		var rutelPos = {x: rutelOffset.x, y: rutelOffset.y};
		rutelPosArr.push(rutelPos);
		rutelPos = newPoint_xy(rutelPos, 0, -rutelDist);
		rutelPosArr.push(rutelPos);
	
		//остальные рутели
		for(var i=0; i<par.stairAmt_r; i++){
			if(dividePos.indexOf(i) != -1){
				rutelPos = {
					x: par.b_r * (i - 1) + rutelOffset.x,
					y: par.h_r * (i - 1) + rutelOffset.y,
					}
				rutelPosArr.push(rutelPos);
				rutelPos = newPoint_xy(rutelPos, 0, -rutelDist);
				rutelPosArr.push(rutelPos);
		
				rutelPos = {
					x: par.b_r * i + rutelOffset.x,
					y: par.h_r * i + rutelOffset.y,
					}
				rutelPosArr.push(rutelPos);
				rutelPos = newPoint_xy(rutelPos, 0, -rutelDist);
				rutelPosArr.push(rutelPos);
				}
			
			//последние рутели последнего стекла
			if(i == par.stairAmt_r-1){
				rutelPos = {
					x: par.b_r * i + rutelOffset.x,
					y: par.h_r * i + rutelOffset.y,
					}
				rutelPosArr.push(rutelPos);
				rutelPos = newPoint_xy(rutelPos, 0, -rutelDist);
				rutelPosArr.push(rutelPos);
				}
			}
		
		//рассчитываем координаты разрывов стекол по координатам рутелей
		
		var divideX = []
		for(var i=0; i< rutelPosArr.length-3; i++){
			if(rutelPosArr[i+1].x - rutelPosArr[i].x == par.b_r && par.stairAmt_r > 4){
				divideX.push(rutelPosArr[i].x + par.b_r / 2);
				}
			}
		var glassLengths = [];
		for(var i=0; i< divideX.length; i++){
			if(i == 0) glassLengths.push(divideX[i]);
			if(i != 0) glassLengths.push(divideX[i] - divideX[i - 1]);
			}
		//первое стекло
		if(divideX[0]) glassLengths.push(par.len - divideX[divideX.length - 1])
		else glassLengths.push(par.len * 1.0)
	}
	
	//равномерное разбиение секции на стекла по длине
	if(par.railingParType != "с марша" || par.railingType == "стекло проф."){
		
		var glassAmt = Math.ceil(par.len/maxLen);
		if (glassAmt == 0) glassAmt = 1;
		var glassLengthX = (par.len * 1.0 + glassDist)/glassAmt;
		var glassLengths = [];
		for(var i=0; i<glassAmt; i++) glassLengths.push(glassLengthX);
		
		//рассчитываем координаты рутелей
		var rutelPos0 = {x: rutelOffset.x, y: rutelOffset.y};
		for(var i=0; i<glassAmt; i++){
			//рутели в начале стекла
			var rutelPos = newPoint_x1(rutelPos0, glassLengthX * i, angle)
			rutelPosArr.push(rutelPos);
			rutelPos = newPoint_xy(rutelPos, 0, -rutelDist);
			rutelPosArr.push(rutelPos);
			//рутели в конце стекла
			var rutelPos = newPoint_x1(rutelPos0, glassLengthX * (i+1) - rutelOffset.x * 2, angle);
			rutelPosArr.push(rutelPos);
			rutelPos = newPoint_xy(rutelPos, 0, -rutelDist);
			rutelPosArr.push(rutelPos);
			}
		}
	
    var _angle = angle;
	angle = angle < 0 ? -angle : angle > Math.PI / 2 ? Math.PI - angle : angle;
	
	
	var p0 = {x:0, y:0};
	
	
	//цикл построения стекол
	//рассчтываем отступ стекла по вертикали вниз от нулевой точки
	var leftOffset = 0; //текущий отступ от начала секции
	var rightOffset = par.len; 
	for(var i=0; i<glassLengths.length; i++){
		//секция с углом подъема отличным от 0
		if(par.angle % 90 != 0){
			if(i > 0) {
			    p0 = newPoint_x1(p0, glassLengths[i-1], angle);
		        p0 = newPoint_xy(p0, 0, cutBot > 0 ? -cutBot : 0);
				leftOffset += glassLengths[i-1];
				rightOffset = par.len - leftOffset;
				}
			rightOffset -= glassLengths[i];
			var cutBot = glassCutBot - leftOffset * Math.tan(angle);
			var cutTop = glassCutTop - rightOffset * Math.tan(angle);
			
		    p0 = newPoint_xy(p0, 0, cutBot > 0 ? cutBot : 0);
		    var p1 = newPoint_xy(p0, 0, -offsetBot);
		    var p2 = newPoint_xy(p1, (cutBot > 0 ? cutBot/Math.tan(angle) : 0), 0);
		    var p3 = newPoint_x1(p2, glassLengths[i] - glassDist - (cutBot > 0 ? cutBot/Math.tan(angle) : 0), angle);
		    var p4 = newPoint_xy(p3, 0, par.sectHeight + offsetBot - (cutTop > 0 ? cutTop : 0));
		    var p5 = newPoint_xy(p4, -(cutTop > 0 ? cutTop/Math.tan(angle) : 0), 0);
		    var p6 = newPoint_xy(p1, 0, par.sectHeight + offsetBot - (cutBot > 0 ? cutBot : 0));
		
		    var pt1 = copyPoint(p1);
			var pt2 = copyPoint(p2);
			var pt3 = copyPoint(p3);
			var pt4 = copyPoint(p4);
			var pt5 = copyPoint(p5);
			var pt6 = copyPoint(p6); 
			
			//перестановка точек для среза снизу
		    if(p2.y >= p6.y){
				pt2 = itercection(p5, p6, p2, newPoint_xy(p2, 100, 0));
				pt1 = copyPoint(pt2);
				pt6 = copyPoint(pt2);
				pt3.y = pt2.y;
			}
			else if(p2.x >= p3.x){
				pt2 = copyPoint(p2);
				pt3 = copyPoint(p3);
				pt2.x = p3.x;
				pt3.y = p2.y;
			}
			
			//перестановка точек для среза сверху
			if(p5.y <= p3.y){
				pt5 = itercection(p2, p3, p5, newPoint_xy(p5, 100, 0));
				pt4 = copyPoint(pt5);
				pt3 = copyPoint(pt5);
				pt6.y = pt5.y;
			}
			else if(p5.x <= p6.x){
				pt5 = copyPoint(p5);
				pt6 = copyPoint(p6);
				pt5.x = p6.x;
				pt6.y = p5.y;
			}
		
		    var shape = new THREE.Shape();

			if(!(pt1.x == pt2.x && pt1.y == pt2.y)) addLine(shape, par.dxfArr, pt1, pt2, par.dxfBasePoint);
		    if(!(pt2.x == pt3.x && pt2.y == pt3.y)) addLine(shape, par.dxfArr, pt2, pt3, par.dxfBasePoint);
		    if(!(pt3.x == pt4.x && pt3.y == pt4.y)) addLine(shape, par.dxfArr, pt3, pt4, par.dxfBasePoint);
		    if(!(pt4.x == pt5.x && pt4.y == pt5.y)) addLine(shape, par.dxfArr, pt4, pt5, par.dxfBasePoint);
		    if(!(pt5.x == pt6.x && pt5.y == pt6.y)) addLine(shape, par.dxfArr, pt5, pt6, par.dxfBasePoint);
		    if(!(pt6.x == pt1.x && pt6.y == pt1.y)) addLine(shape, par.dxfArr, pt6, pt1, par.dxfBasePoint);
			
			//параметры стекла
			var rectP1 = itercection(pt2, pt3, pt4, newPoint_xy(pt4, 100, -100/Math.tan(angle)));
			var rectP2 = itercection(pt6, pt5, pt4, newPoint_xy(pt4, 100, -100/Math.tan(angle)));
			
			var rectP3 = itercection(pt2, pt3, pt1, newPoint_xy(pt1, 100, -100/Math.tan(angle)));
			var rectP4 = itercection(pt6, pt5, pt1, newPoint_xy(pt1, 100, -100/Math.tan(angle)));
			
			//полностью срезанное сверху стекло
			if((pt6.x == pt5.x) && (pt6.y == pt5.y)) {
				rectP1 = copyPoint(pt1)
				rectP2 = copyPoint(pt6)
				rectP3 = {x:p3.x, y:p1.y,}
				}
			
			//полностью срезанное снизу стекло
			if((pt2.x == pt3.x) && (pt2.y == pt3.y)) {
				rectP1 = copyPoint(pt1)
				rectP2 = {x:p1.x, y:p5.y,}
				rectP3 = copyPoint(pt2)
				}
			
	        var glassParams = {
		        area: distance(rectP1, rectP2) * distance(rectP1, rectP3) / 1000000,
		        holeAmt: 4,
		        A: distance(rectP1, rectP3),
		        B: distance(rectP1, rectP2),
		        d1: distance(pt1, pt4),
		        d2: distance(pt3, pt6),
				thk: 12,
				type: "накл.",
				}
			if(par.railingType == "стекло рут.") glassParams.holeAmt = 4;
	        par.railingParams.glass.push(glassParams);
		}
		//секция с углом подъема равным 0
		else{
		    if(i > 0) {
			    p0 = newPoint_x1(p0, glassLengths[i], angle);
		    }
		    p0 = newPoint_xy(p0, 0, glassCutBot);
		    var pt1 = newPoint_xy(p0, 0, -offsetBot);
		    var pt2 = newPoint_x1(pt1, glassLengths[i] - glassDist, angle);
		    var pt3 = newPoint_xy(pt2, 0, par.sectHeight + offsetBot -glassCutBot-glassCutTop);
		    var pt4 = newPoint_xy(pt1, 0, par.sectHeight + offsetBot - glassCutBot-glassCutTop);
		
		    var shape = new THREE.Shape();

		    addLine(shape, par.dxfArr, pt1, pt2, par.dxfBasePoint);
		    addLine(shape, par.dxfArr, pt2, pt3, par.dxfBasePoint);
		    addLine(shape, par.dxfArr, pt3, pt4, par.dxfBasePoint);
		    addLine(shape, par.dxfArr, pt4, pt1, par.dxfBasePoint);
			
			//параметры спецификации
			var rectXMin = Math.min(pt1.x, pt2.x, pt3.x, pt4.x);
			var rectYMin = Math.min(pt1.y, pt2.y, pt3.y, pt4.y);
			var rectXMax = Math.max(pt1.x, pt2.x, pt3.x, pt4.x);
			var rectYMax = Math.max(pt1.y, pt2.y, pt3.y, pt4.y);
			
			var glassParams = {
		        area: Math.abs((rectXMax - rectXMin)*(rectYMax - rectYMin)) / 1000000,
		        holeAmt: 0,
		        A: Math.abs(rectXMax - rectXMin),
		        B: Math.abs(rectYMax - rectYMin),
		        d1: distance(pt1, pt3),
		        d2: distance(pt2, pt4),
				type: "прям.",
	    	}
			if(par.railingType == "стекло рут.") glassParams.holeAmt = 4;
	        par.railingParams.glass.push(glassParams);
			
		}
	
	if(par.railingType == "стекло рут."){
		//отверстия под рутели 
		var rutelDiam = 14;
		var rutelHoleDiam = params.rutelHoleDiam;
		var rutelLength = 50;
		
		var rectXMin = Math.min(pt1.x, pt2.x, pt3.x, pt4.x);		
		var rectXMax = Math.max(pt1.x, pt2.x, pt3.x, pt4.x);
		
		var holeId = 1;
		for (var j=0; j<rutelPosArr.length; j++){
			if(rutelPosArr[j].x > rectXMin && rutelPosArr[j].x < rectXMax){
				//корректируем отверстия в соответствии с введнными пользователем поправками
				var holeMoove = holeMooveParams.find(function(item){return item.sectID == par.sectID && item.glassId == i+1 && item.holeId == holeId});
				if(holeMoove){
					rutelPosArr[j].x += holeMoove.mooveX;
					rutelPosArr[j].y += holeMoove.mooveY;
					}
				var center = newPoint_xy(rutelPosArr[j], 0, 0);
				addRoundHole(shape, dxfPrimitivesArr, center, rutelHoleDiam/2, par.dxfBasePoint);
				holeId += 1;
				}
			}
		}
		
	geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geometry, glassMaterial);
	par.mesh.add(mesh);
	
	//сохраняем данные для спецификации
	var partName = "glass12";
	if(typeof specObj !='undefined'){
		if(!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				sumArea: 0, //остатьки старой функции
				area: 0,
				name: "Стекло",
				metalPaint: false,
				timberPaint: false,
				division: "stock_2",
				workUnitName: "area",
				group: "Ограждения",
				}
			}
		var name = glassParams.type + " " + Math.round(glassParams.A) + "x" + Math.round(glassParams.B); 
		if(glassParams.type == "накл.")	name += " d1=" + Math.round(glassParams.d1) + " d2=" + Math.round(glassParams.d2);
		var area = Math.round(glassParams.area * 10)/10;
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["sumArea"] += area;
		specObj[partName]["area"] += area;
		
		}
	mesh.specId = partName + name;

	} //конец цикла построения стекол
	
	//рутели
	if(par.railingType == "стекло рут."){	
		var rutelGeometry = new THREE.CylinderGeometry(rutelDiam/2, rutelDiam/2, rutelLength, 20, 0, false);
		var rutelMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000 });

		for (var j=0; j<rutelPosArr.length; j++){
			var rutel = new THREE.Mesh(rutelGeometry, rutelMaterial);
			rutel.rotation.x = Math.PI / 2;
			rutel.position.x = rutelPosArr[j].x;
			rutel.position.y = rutelPosArr[j].y;
			rutel.position.z = glassThickness - rutelLength / 2;
			if(par.railingSide == "левая") rutel.position.z = rutelLength / 2;
			par.mesh.add(rutel);
			}
		}
	
	//профиль
	if(par.railingType == "стекло проф."){	
		var poleParams = {
			partName: "glassProfiles",
			type: "rect",
			poleProfileY: 100,
			poleProfileZ: 50,
			length: par.len / Math.cos(angle),
			poleAngle: angle,
			material: metalMaterial,
			dxfBasePoint: {x:0, y:0},
			dxfArr: dxfPrimitivesArr,
			}
		var profile = drawPole3D_4(poleParams).mesh;
		profile.position.x = 0;
		profile.position.y = 0;
		profile.position.z =  -poleParams.poleProfileZ / 2;
		par.mesh.add(profile);
	
		}
} //конец построения секции с самонесущим стеклом

//ограждения с самонесущим стеклом 
if(par.railingType == "Дерево с ковкой"){
	var meterHandrailPar = {
		prof: "40х60 верт.",
		sideSlots: "нет",
		handrailType: "массив"
	}
	meterHandrailPar = calcHandrailMeterParams(meterHandrailPar);
	
	//console.log(par);
	
	// var p1 = {x:0,y:0};
	// var p2 = {x: 1000, y: 1000};

	if(par.railingParType != "с марша"){
		//первая стойка
		var pos0 = {x:0, y:0}
		var p1 = newPoint_x1(pos0, 70, angle);
		
		//последняя стойка
		var p2 = newPoint_x1(pos0, par.len - 70, angle);
	}else{
		var p1 = {x: par.b_r / 2, y: par.h_r * -1}
		var p2 = {x: -par.b_r / 2 + par.b_r * par.stairAmt_r, y: par.h_r * par.stairAmt_r}
	}

	var handrailPosY = par.sectHeight || 900;
	var dxfBasePoint = {x:0,y:0};
	var rackSize = 95;
	var posZ = rackSize / 2;
	if (par.railingSide == "правая") {
		posZ *= -1;
	}

	// Корректируем точки чтобы получить начальный и конечный столб по середине ступени
	p1.x += rackSize / 2;
	p2.x -= rackSize / 2;

	var splitStairs = [];

	//поручень марша
	var startPoint = newPoint_xy(p1, 0, par.h_r)
	
	var handrailLength_X = p2.x - p1.x - 0.05;
	var handrailAngle = Math.atan((par.h_r * 1.0) / (par.b_r * 1.0));
	if (angle == 0) handrailAngle = 0;
	var handrailLength = handrailLength_X / Math.cos(handrailAngle);
	var handrailParams = {
		model: "массив",
		length: handrailLength,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: dxfBasePoint,
		startAngle: Math.PI / 2 - handrailAngle,
		endAngle: Math.PI / 2 - handrailAngle,
		fixType: "нет",
		side: "out",
		poleAngle: handrailAngle,
		startChamfer: "R3",
		endChamfer: "R3",
		marshId: par.marshId,
		hasFixings: true
	}
	var basePoint = newPoint_xy(p1, 0, handrailPosY);
	//console.log(basePoint);
	
	var handrailLengthMax = 2600;
	if (angle == 0) handrailLengthMax = handrailLength + 1; // игнорируем деление на секции для прямого ограждения

	if (handrailLength > handrailLengthMax) {
		var partsAmt = Math.floor(handrailLength / handrailLengthMax);
		var stairStep = Math.floor(par.stairAmt_r / (partsAmt + 1));
		for (var i = 1; i <= partsAmt; i++) {
			splitStairs.push(i * stairStep);
		}
	}

	var marshPoints = [];
	//console.log(splitStairs)

	for (var i = 0; i < (splitStairs.length + 1); i++) {
		var handrailBasePoint = basePoint;
		var shiftHandrailBasePointX = 0;
		if (i > 0) handrailBasePoint = newPoint_xy(basePoint, par.b_r * (splitStairs[i - 1]) + shiftHandrailBasePointX, par.h_r * (splitStairs[i - 1]) + shiftHandrailBasePointX * Math.tan(handrailAngle));

		var handrailStartPoint = p1;
		if (i > 0) handrailStartPoint = newPoint_xy(p1, par.b_r * splitStairs[i - 1] + shiftHandrailBasePointX, par.h_r * splitStairs[i - 1]);
		//Копируем точку для установки столба, до модернизации чтобы сохранить ось Y
		var rackBasePoint = copyPoint(handrailStartPoint);

		var handrailEndPoint = p2;
		if (i < splitStairs.length) handrailEndPoint = newPoint_xy(p1, par.b_r * splitStairs[i] - rackSize + shiftHandrailBasePointX, par.h_r * splitStairs[i]);

		var lenX = handrailEndPoint.x - handrailStartPoint.x - 0.05;
		var len = lenX / Math.cos(handrailAngle);

		var splitObj = { lenX: lenX, len: len, rackBasePoint: rackBasePoint, basePoint: handrailBasePoint, startPos: handrailStartPoint, endPos: handrailEndPoint };
		if (i < splitStairs.length) splitObj.stairNumber = splitStairs[i];
		marshPoints.push(splitObj);

		var handrailParams = {
			model: "массив",
			length: len,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: dxfBasePoint,
			startAngle: Math.PI / 2 - handrailAngle,
			endAngle: Math.PI / 2 - handrailAngle,
			fixType: "нет",
			side: "out",
			poleAngle: handrailAngle,
			startChamfer: "R3",
			endChamfer: "R3",
			marshId: par.marshId,
			hasFixings: true
		}

		handrailParams.dxfBasePoint = newPoint_xy(dxfBasePoint, handrailBasePoint.x, handrailBasePoint.y)

		//координата верхнего угла поручня для построения столбов
		var handrailCutLen = meterHandrailPar.profY / Math.cos(handrailAngle);
		var handrailPos = newPoint_xy(basePoint, 0, handrailCutLen);
		var handrailEndPos = polar(handrailPos, handrailAngle, handrailLength);

		//сохраняем позицию верхнего поручня для построения рейки в поручень
		var marshHandrailPos = copyPoint(basePoint);
		par.handrailParams = {
			handrailCutLen: handrailCutLen,
			handrailAngle: handrailAngle,
			handrailPos: handrailPos,
			handrailEndPos: handrailEndPos,
			handrailHeight: handrailPos.y - startPoint.y,
		}

		var handrail = drawHandrail_4(handrailParams).mesh;
		//console.log(handrailParams);
		handrail.position.x = handrailBasePoint.x;
		handrail.position.y = handrailBasePoint.y;
		handrail.position.z = posZ - handrailParams.wallOffset;
		par.mesh.add(handrail);
		
	}
	
	// Столбы
	var zeroPoint = {x:0,y:0}
	var rackPar = newPoint_xy(p1, -rackSize / 2, 0);
	// var rackPar = copyPoint(p1);
	rackPar.len = handrailPos.y + 20;
	rackPar.marshId = 1;
	rackPar.y = 0// + params.treadThickness;
	rackPar.rackSize = rackSize;
	rackPar.dxfBasePoint = newPoint_xy(dxfBasePoint, rackPar.x - rackSize / 2, rackPar.y);

	rackPar.type = params.timberNewellType;
	rackPar.topType = params.newellTopType;
		
	//var turnNewell = drawTurnNewell(rackPar).mesh;
	var turnNewell = drawTimberNewell_4(rackPar).mesh;
	turnNewell.position.x = rackPar.x - rackSize/ 2;
	turnNewell.position.y = rackPar.y + 0.05;
	turnNewell.position.z = posZ - (rackSize / 2 + 0.05) * turnFactor;

	par.mesh.add(turnNewell);
	
	// промежуточные столбы
	for (var i = 0; i < marshPoints.length; i++) {
		var point = {
			x: par.b_r * marshPoints[i].stairNumber + par.b_r / 2 - rackSize / 2, 
			y: par.h_r * marshPoints[i].stairNumber
		}
		var rackPar = copyPoint(point);
		rackPar.len = handrailPos.y + 20;
		rackPar.marshId = 1;
		rackPar.y = point.y// + params.treadThickness;
		rackPar.rackSize = rackSize;
		rackPar.dxfBasePoint = newPoint_xy(dxfBasePoint, rackPar.x - rackSize / 2, rackPar.y);
		
		rackPar.type = 'top';//Определяет положение столба, верхний для марша или нижний

		var turnNewell = drawTimberNewell_4(rackPar).mesh;
		//var turnNewell = drawTurnNewell(rackPar).mesh;
		turnNewell.position.x = rackPar.x - rackSize + 30;
		turnNewell.position.y = rackPar.y + 0.05;
		turnNewell.position.z = posZ - (rackSize / 2 + 0.05) * turnFactor;

		par.mesh.add(turnNewell);
	}

	var rackPar = newPoint_xy(p2, rackSize / 2, 0);
	// var rackPar = copyPoint(p2);
	rackPar.len = handrailPos.y + 20;
	rackPar.marshId = 1;
	rackPar.y = par.h_r * (par.stairAmt_r * 1.0 - 1) + params.treadThickness;
	if (angle == 0) rackPar.y = 0;
	rackPar.rackSize = rackSize;
	rackPar.dxfBasePoint = newPoint_xy(dxfBasePoint, rackPar.x - rackSize / 2, rackPar.y);
	
	rackPar.type = 'top';//Определяет положение столба, верхний для марша или нижний

	var turnNewell = drawTimberNewell_4(rackPar).mesh;
	//var turnNewell = drawTurnNewell(rackPar).mesh;
	turnNewell.position.x = rackPar.x - rackSize / 2;
	turnNewell.position.y = rackPar.y + 0.05;
	turnNewell.position.z = posZ - (rackSize / 2 + 0.05) * turnFactor;

	par.mesh.add(turnNewell);

	// Заполнение
	var balDist = par.b_r * 1.0 / params.timberBalStep;
	//позиция балясин на лестнице на косоурах
	var balPar_kos = calcBalPos(0, {
		a: par.b_r * 1.0,
		b: par.b_r * 1.0,
		h: par.h_r * 1.0,
		stairAmt: par.stairAmt_r * 1.0
	});

	var startPos = 1;//Рассчитываем номер ступени для начала установки балясин

	var balParams = {
		stringerType: "косоур",
		lenX: handrailLength_X,
		a: par.b_r * 1.0,
		b: par.b_r * 1.0,
		h: par.h_r * 1.0,
		stairAmt: par.stairAmt_r * 1.0 - 2,
		ang: handrailAngle,
		balLen: handrailPos.y - par.handrailParams.handrailCutLen - 0.01 + 40,
		dxfBasePoint: dxfBasePoint,
		marshId: 1,
		side: "in",
		marshHandrailPos: marshHandrailPos,
		railingModel: par.railingType,
		timberBalBotEnd: "квадрат",
		timberBalTopEnd: "квадрат",
		// extraBanisterTop: true,
		extraBanisterBot: true,
		balPar_kos: {
			a: par.b_r * 1.0,
			b: par.b_r * 1.0,
			h: par.h_r * 1.0,
			stairAmt: par.stairAmt_r * 1.0
		}
	}

	//if (params.stairType != 'нет') balParams.balLen += params.treadThickness;
	
	var balDist = (par.b_r * 1.0) / params.timberBalStep;
	//25 половина толщины основания балясины, treadOffset - отступ от начала ступени
	var treadOffset = 10;
	if (params.timberBalStep == 1) treadOffset = par.b_r / 2 - 5;
	if (params.timberBalStep == 1.5) treadOffset = 10;
	var balsBasePoint = newPoint_xy(zeroPoint, -balDist + 25 + treadOffset + par.b_r * startPos - balPar_kos.deltaX1, par.h_r * startPos - 40);

	balsBasePoint.x += par.b_r * 1.0;

	balParams.basePoint = balsBasePoint;
	
	// Учитываем зазор
	balParams.balLen -= 0.1;
	balParams.basePoint.y += 0.05;
	
	//Рассчет размера балясины
	if (params.timberBalStep == 1.5) balParams.balLen += balPar_kos.deltaLen1 / 2;
	if (params.timberBalStep == 1) balParams.balLen -= 15 * Math.tan(handrailAngle);
	
	for (var i = 0; i < marshPoints.length; i++) {
		if (angle == 0){
			balParams.ang = 0;
			// balParams.balLen = 800;
			balParams.balStep = 150;
			balParams.stringerType = '';
		}

		balParams.basePoint = copyPoint(balsBasePoint);

		balParams.lenX = marshPoints[i].lenX;
		
		if (angle != 0) balParams.stairAmt = Math.floor(Math.round(balParams.lenX) / (par.b_r * 1.0));

		var pos = { x: 0, y: 0.05 };
		if (i > 0 && marshPoints[i - 1].stairNumber) {
			pos.x = par.b_r * marshPoints[i - 1].stairNumber;
			pos.y = par.h_r * marshPoints[i - 1].stairNumber;
		}
		if (angle == 0){
			pos.x = -300;
			pos.y = -160;

		} 
		balParams.svgBasePoint = pos;
		var balArr = drawBanistersArr(balParams);
		balArr.position.z = posZ;
		balArr.position.x = pos.x;
		balArr.position.y = pos.y;
		//console.log(balArr)
		par.mesh.add(balArr);
	}
} //конец построения секции с самонесущим стеклом


//Ограждение частые стойки 
if(par.railingType == "Частые стойки"){
	var meterHandrailPar = {
		prof: "40х60 верт.",
		sideSlots: "нет",
		handrailType: "массив"
	}
	meterHandrailPar = calcHandrailMeterParams(meterHandrailPar);

	var posZ = 39;

	var p1 = {x: -50, y: par.h_r * -1}
	var p2 = {x: -50 + par.b_r * par.stairAmt_r, y: par.h_r * par.stairAmt_r}

	var handrailPosY = par.sectHeight || 900;
	var dxfBasePoint = {x:0,y:0};

	var splitStairs = [];

	//поручень марша
	var startPoint = newPoint_xy(p1, 0, par.h_r)
	
	var handrailLength_X = p2.x - p1.x - 0.05;
	var handrailAngle = Math.atan((par.h_r * 1.0) / (par.b_r * 1.0));
	if (angle == 0) handrailAngle = 0;

	var handrailLength = handrailLength_X / Math.cos(handrailAngle);
	var basePoint = newPoint_xy(p1, 0, handrailPosY + 100);

	//console.log(splitStairs)
	var handrailBasePoint = basePoint;
	var handrailStartPoint = p1;
	var handrailEndPoint = p2;
	var lenX = handrailEndPoint.x - handrailStartPoint.x - 0.05;
	var len = lenX / Math.cos(handrailAngle);

	var handrailParams = {
		model: "массив",
		length: len,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: dxfBasePoint,
		startAngle: Math.PI / 2 - handrailAngle,
		endAngle: Math.PI / 2 - handrailAngle,
		fixType: "нет",
		side: "out",
		poleAngle: handrailAngle,
		startChamfer: "R3",
		endChamfer: "R3",
		marshId: par.marshId
	}

	handrailParams.dxfBasePoint = newPoint_xy(dxfBasePoint, handrailBasePoint.x, handrailBasePoint.y)

	var handrail = drawHandrail_4(handrailParams).mesh;
	handrail.position.x = handrailBasePoint.x;
	handrail.position.y = handrailBasePoint.y;
	handrail.position.z = posZ - handrailParams.wallOffset;
	par.mesh.add(handrail);
	
	var balParams = {
		balMaterial: params.materials.metal,
		angMaterial: params.materials.metal2,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: dxfBasePoint,
		size: 20,
		length: handrailPosY,
		topHole: "yes",
		type: "middle",
		angleShift: 0,
		// text: "Первая балясина"
	}

	var balBasePoint = newPoint_xy(p1, 0, 30);
	var banisterPerStep = params.banisterPerStep;
	var banisterStep = len / (banisterPerStep * par.stairAmt_r);

	banisterPos = balBasePoint
	for (var i = 0; i < par.stairAmt_r; i++) {
		var stepBanisterCount = banisterPerStep;
		if (i == (par.stairAmt_r - 1)) stepBanisterCount -= 1;

		for (var j = 0; j < stepBanisterCount; j++) {
			var heightDelta = (banisterStep * j) * Math.sin(handrailAngle);
			banisterPos = polar(banisterPos, handrailAngle, banisterStep);
			balParams.length = handrailPosY + heightDelta;
			var banister = drawBal(balParams);
			banister.mesh.position.x = banisterPos.x;
			banister.mesh.position.y = banisterPos.y - heightDelta - 1;
			banister.mesh.position.z = posZ;
			par.mesh.add(banister.mesh);
		}
	}
	// balParams.type = "middle";
	// if (par.base == "stringer") balParams.type = "longBal";


} //конец построения секции с самонесущим стеклом


	
//поручни на ограждении со стеклом и пристенные

if(par.railingType == "поручень" || ((par.railingType == "стекло рут." || par.railingType == "стекло проф.") && par.isSectHandrail != "нет")){
	// debugger;

	var handrailPar = {
		prof: params.handrailProf,
		sideSlots: params.handrailSlots,
		handrailType: params.handrail,
	}

	handrailPar = calcHandrailMeterParams(handrailPar); //функция в файле priceLib.js

	var handrailParams = {
		length: par.len / Math.cos(angle),
		angle: angle,
		metalMaterial: params.materials.metal,
		timberMaterial: params.materials.timber,
		dxfArr: par.dxfArr, 
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, par.sectHeight + par.len * 1.0 * Math.tan(angle))
	}
		
	//корректируем длину поручня для стекла верхний срез
	if(par.railingType != "поручень"){
		if(angle > 0) handrailParams.length -= glassCutTop/Math.tan(angle)/Math.cos(angle)
	}
	
	if (par.railingType == "стекло рут." || par.railingType == "стекло проф.") {
		//вертикальные поручни
		if (params.startVertHandrail == 'есть' && p3) {
			handrailParams.length += handrailPar.profY / Math.cos(angle) * 2;// + handrailPar.profY * Math.tan(angle);
		}
	}else{
		handrailParams.startAngle = Math.PI / 2;
		handrailParams.endAngle = Math.PI / 2;
	}

	handrailParams.fixType = params.handrailFixType;//"паз";

	if(par.railingType == "поручень" || params.handrailFixType == "кронштейны"){
		handrailParams.fixType = "кронштейны";
	}

	handrailParams.side = "in";
	if(par.railingSide == "левая") handrailParams.side = "out";

	// var handrailParams = drawHandrail_4(handrailParams); //функция в файле drawSideHandrail.js
	
	// var handrail = handrailParams.mesh;
	
	var handrail = new THREE.Object3D();

	var handrailPartsAmt = Math.ceil(handrailParams.length / 3000);
	var handrailLength = handrailParams.length;
	if (handrailPartsAmt == Infinity || handrailPartsAmt == NaN) {
		handrailPartsAmt = 0
	}
	if (handrailPartsAmt > 15) {
		handrailPartsAmt = 0;
	}

	for (var i = 0; i < handrailPartsAmt; i++) {
		handrailParams.length = handrailLength / handrailPartsAmt;

		if (params.startVertHandrail == 'есть' && p3 && (par.railingType == "стекло рут." || par.railingType == "стекло проф.")) {
			if(i == 0) {
				handrailParams.startAngle = Math.PI / 2 - angle;
				if(handrailPartsAmt == 1) handrailParams.length -= 10 / Math.cos(angle);
			}else{
				handrailParams.startAngle = Math.PI / 2;
			}
			if(i == (handrailPartsAmt - 1)){
				handrailParams.endAngle = Math.PI / 2 - angle;
			} else{
				handrailParams.endAngle = Math.PI / 2;
			}
		}
		var handrailMesh = drawHandrail_4(handrailParams).mesh; //функция в файле drawSideHandrail.js
		handrailMesh.position.x = handrailParams.length * i;//handrailPos.x;

		if (params.startVertHandrail == 'есть' && p3 && (par.railingType == "стекло рут." || par.railingType == "стекло проф.")) {
			if(i == 0) handrailMesh.position.x -= (handrailPar.profY / Math.cos(angle));
			if(i > 0) handrailMesh.position.x -= handrailPar.profY * Math.tan(angle);
			// if (handrailLength <= 3000) handrailMesh.position.x -= (handrailPar.profZ / Math.cos(angle)) / 2;
		}

		handrail.add(handrailMesh);
	}

	//поручень на кронштейнах

	if(params.handrailFixType == "кронштейны" || par.railingType == "поручень"){
		handrail.position.x += handrailParams.profHeight*Math.tan(angle) * Math.cos(angle)/2;
		handrail.position.y += handrailParams.profHeight*Math.tan(angle)/2 * Math.sin(angle);
		handrail.position.y += par.sectHeight - handrailParams.profHeight/Math.cos(angle);
		handrail.position.z = -3;
		if(par.railingSide == "левая" && (par.railingType == 'стекло рут.' || par.railingType == 'стекло проф.')) handrail.position.z = 3 + glassThickness;						
	}
	
	//поручень с пазом
	if(params.handrailFixType == "паз" && par.railingType != "поручень"){
		handrail.position.x = 0;
		handrail.position.y = par.sectHeight - handrailParams.profHeight/Math.cos(angle) + handrailParams.profHeight/Math.cos(angle) - handrailSlotDist;
		handrail.position.z = handrailParams.wallOffset + glassThickness/2;
		if(par.railingSide == "левая")  handrail.position.z = -handrailParams.wallOffset + glassThickness/2;
	}
	
	handrail.rotation.z = angle;
	
	par.mesh.add(handrail);
	
	//парметры спецификации
	par.railingParams.handrails.push(handrailParams.length);
	if(par.railingType == "поручень" || params.handrailFixType == "кронштейны"){
		if(par.railingType == "поручень"){
			par.railingParams.sideHolderAmt += handrailParams.holderAmt;
		}
		else{
			par.railingParams.glassHolderAmt += handrailParams.holderAmt || 0;
		}
	}

	//вертикальные поручни
	if (params.startVertHandrail == 'есть' && p3) {
		// в начале секции
		var handrail = new THREE.Object3D();
		handrailParams.startAngle = Math.PI / 2;
		handrailParams.length = distance(p1, p6);
		handrailParams.angle = Math.PI / 2;
		handrailParams.endAngle = Math.PI / 2 + angle;
		if (par.railingSide == 'левая') {
		}else{
			
		}
		handrailParams.length -= Math.tan(angle) * handrailPar.profY;
		console.log(angle)
		// if (handrailLength <= 3000) handrailParams.length = distance(p1, p6) - Math.tan(angle) * handrailPar.profY;

		var handrailMesh = drawHandrail_4(handrailParams).mesh; //функция в файле drawSideHandrail.js
		handrail.add(handrailMesh);
		handrail.position.x = 0;
		handrail.position.y = -offsetBot;//par.sectHeight - handrailParams.profHeight / Math.cos(angle) + handrailParams.profHeight / Math.cos(angle) - handrailSlotDist;
		handrail.position.z = handrailParams.wallOffset + glassThickness / 2;
		if (par.railingSide == "левая") {
			handrail.position.z = -handrailParams.wallOffset + glassThickness / 2;
		}
		handrail.rotation.z = handrailParams.angle;
		par.mesh.add(handrail);

		// в конце секции
		// if (true) {
			var handrail = new THREE.Object3D();
			handrailParams.length = distance(p3, p4);
			handrailParams.angle = Math.PI / 2;
			var handrailMesh = drawHandrail_4(handrailParams).mesh; //функция в файле drawSideHandrail.js
			handrail.add(handrailMesh);
			handrail.position.x = p3.x + handrailParams.profHeight - 10;
			handrail.position.y = p3.y;
			handrail.position.z = handrailParams.wallOffset + glassThickness / 2;
			if (par.railingSide == "левая") {
				handrail.position.z = -handrailParams.wallOffset + glassThickness / 2;
			}
			handrail.rotation.z = handrailParams.angle;
			par.mesh.add(handrail);
		// }
	}
} //конец поручня
	
	//добавляем рассчитанные параметры в возвращаемый объект
	par.glassAmt = glassAmt;
	par.glassLengthX = glassLengthX;

	return par;			
}

/*
function drawHandrail(par){
	par.mesh = new THREE.Object3D();
	par.wallOffset = 50; //расстояние от стены до оси поручня
	par.holderHeight = 50; //высота кронштейна от оси до лодочки
	par.holderEndOffset = 150; //расстояние от кронштейна до конца поручня
	par.holderMaxDist = 800; //максимальное расстояние между кронштейнами

	//параметры поручня
	var handrailPar = {
		prof: params.handrailProf,
		sideSlots: params.handrailSlots,
		handrailType: params.handrail,
		metalPaint: params.metalPaint_perila,
		timberPaint: params.timberPaint_perila,
		}
	handrailPar = calcHandrailMeterParams(handrailPar); //функция в файле priceLib.js

	par.profHeight = handrailPar.profY;
	par.profWidth = handrailPar.profZ;
	par.type = handrailPar.handrailModel;
	par.poleMaterial = par.metalMaterial;
	if(handrailPar.mat == "timber") par.poleMaterial = par.timberMaterial;

	//поручень
	var shape = new THREE.Shape();
    var p0 = { "x": 0.0, "y": 0.0 };
    var p1 = newPoint_xy(p0, 0.0, par.profHeight);
    var p2 = newPoint_xy(p1, par.length, 0.0);
    var p3 = newPoint_xy(p2, 0.0, -par.profHeight);   
	
	addLine(shape, par.dxfArr, p0, p1, par.dxfBasePoint);
    addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
    addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
    addLine(shape, par.dxfArr, p3, p0, par.dxfBasePoint);


if(par.type == "rect"){
	var extrudeOptions = {
        amount: par.profWidth,
        bevelEnabled: false,
        curveSegments: 12,
        steps: 1
		}
    var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
    var pole = new THREE.Mesh(geometry, par.poleMaterial);
	pole.position.z = par.wallOffset - par.profWidth/2;
	par.mesh.add(pole);
	}
if(par.type == "round"){
	var geometry = new THREE.CylinderGeometry(par.profHeight/2, par.profHeight/2, par.length, 30, 1, false);
	var pole = new THREE.Mesh(geometry, par.poleMaterial);
	pole.rotation.z = Math.PI/2;
	pole.position.x = par.length/2;
	pole.position.y = par.profHeight/2
	pole.position.z = par.wallOffset;
	par.mesh.add(pole);
	}
	//кронштейны
	if(par.hasHolder == true){
	par.holderMaterial = par.metalMaterial;
	var holderAmt = Math.ceil((par.length - 2 * par.holderEndOffset) / par.holderMaxDist) + 1;
	if (holderAmt < 2) holderAmt = 2;
	var holderDst = (par.length - 2 * par.holderEndOffset) / (holderAmt - 1);
	
	var holderParams = {
		wallOffset: par.wallOffset,
		height: par.holderHeight,
		dxfArr: dxfPrimitivesArr0,
		dxfBasePoint: {x:0, y:0},
		material: par.holderMaterial,
		}
		par.holderCenters = [];
	for(var i = 0; i<holderAmt; i++){
		holderParams = drawWallHandrailHolder(holderParams);
		var holder = holderParams.mesh;
		holder.position.x = par.holderEndOffset + holderDst * i;
		holder.position.y = -holderParams.height;	
		par.mesh.add(holder);
		var holderHole = {x: holder.position.x, y:holder.position.y};
		par.holderCenters.push(holderHole);
		
		}
	
	par.holderAmt = holderAmt;
	}
	return par;
}//end of drawSideHandrail
*/


function setGlassDivide(stairAmt){
	var dividePos = [];
	if (stairAmt == 5) dividePos = [3];
	if (stairAmt == 6) dividePos = [3];
	if (stairAmt == 7) dividePos = [4]; 
	if (stairAmt == 8) dividePos = [4]; 
	if (stairAmt == 9) dividePos = [3,6];
	if (stairAmt == 10) dividePos = [4,7];
	if (stairAmt == 11) dividePos = [3,6,9];
	if (stairAmt == 12) dividePos = [3,6,9];
	if (stairAmt == 13) dividePos = [4,7,10];
	if (stairAmt == 14) dividePos = [3,6,9,12];
	if (stairAmt == 15) dividePos = [3,6,9,12];
	if (stairAmt == 16) dividePos = [4,7,10,13];
	if (stairAmt == 17) dividePos = [3,6,9,12,15];
	if (stairAmt == 18) dividePos = [4,7,10,13,16];
	if (stairAmt == 19) dividePos = [4,7,10,13,16];
	if (stairAmt == 20) dividePos = [3, 6, 9, 12, 15, 18];
	if (stairAmt == 21) dividePos = [4, 7, 10, 13, 16, 19];
	if (stairAmt == 22) dividePos = [4, 7, 10, 13, 16, 19];
	if (stairAmt == 23) dividePos = [3, 6, 9, 12, 15, 18, 21];
	if (stairAmt == 24) dividePos = [4, 7, 10, 13, 16, 19, 22];
	if (stairAmt == 25) dividePos = [4, 7, 10, 13, 16, 19, 22];
	if (stairAmt == 26) dividePos = [3, 6, 9, 12, 15, 18, 21, 24];
	if (stairAmt == 27) dividePos = [4, 7, 10, 13, 16, 19, 22, 25];
	if (stairAmt == 28) dividePos = [4, 7, 10, 13, 16, 19, 22, 25];
	if (stairAmt == 29) dividePos = [3, 6, 9, 12, 15, 18, 21, 24, 27];
	if (stairAmt == 30) dividePos = [4, 7, 10, 13, 16, 19, 22, 25, 28];
	
	return dividePos;
}//end of setGlassDivide


