/** частные функции для единой функции отрисовки ограждений */

function calcHandrailPoints(par, parRacks) {
	//var marshLastPoints = getLastPointsMarsh(treadsObj);
	var handrailPoints = [];
	
			var meterHandrailPar = {
				prof: params.handrailProf,
				sideSlots: params.handrailSlots,
				handrailType: params.handrail,
				metalPaint: params.metalPaint_perila,
				timberPaint: params.timberPaint_perila,
				}
			meterHandrailPar = calcHandrailMeterParams(meterHandrailPar);
	
			//рассчитываем координаты верхней точки кронштейна стойки
	
			if(parRacks.marsh1First) var marsh1First = calcHolderTopPoint(parRacks.marsh1First);
			if(parRacks.botFirst) var botFirst = calcHolderTopPoint(parRacks.botFirst);
			if(parRacks.botLast) var botLast = calcHolderTopPoint(parRacks.botLast);
			if(parRacks.topFirst) var topFirst = calcHolderTopPoint(parRacks.topFirst);
			if(parRacks.topLast) var topLast = calcHolderTopPoint(parRacks.topLast);
			if(parRacks.marshFirst)var marshFirst = calcHolderTopPoint(parRacks.marshFirst);
			if(parRacks.marshLast) var marshLast = calcHolderTopPoint(parRacks.marshLast);
			if(parRacks.marsh2Last) var marsh2Last = calcHolderTopPoint(parRacks.marsh2Last);
	
			//формируем массив точек поручня по координатам стоек с учетом того, чтобы стык не попадал на лодочку
	
			if (par.botEnd != "нет" && !par.isRearPRailing){
				if (par.botEnd == "площадка"){
					var extraLen = 80;
					if(par.firstRackPos) extraLen = par.firstRackPos;
					if(params.model == "ко") extraLen += params.sideOverHang;
					if(par.botConnection) {
						if (params.rackBottom == "сверху с крышкой") extraLen -= 80;
						if(meterHandrailPar.handrailModel == "round")
							extraLen += par.rackProfile / 2;
						if(meterHandrailPar.handrailModel != "round")
							extraLen += par.rackProfile / 2 - meterHandrailPar.profZ / 2;
						}
	
					var p1 = newPoint_xy(botFirst, -extraLen, 0);
					var p2 = itercection(marshLast, polar(marshLast, parRacks.angMarsh, 100), botFirst, polar(botFirst, 0, 100));
					}
				if (par.botEnd == "забег"){
					var p2 = polar(marshFirst, parRacks.angMarsh, -50);
					var botHandrailAng = angle(botFirst, p2);
					var p1 = polar(botFirst, botHandrailAng, -50);

					var extraLen = 80;
					if (par.firstRackPos) extraLen = par.firstRackPos;
					if (params.model == "ко") extraLen += params.sideOverHang;
					if (par.botConnection) {
						if (params.rackBottom == "сверху с крышкой") extraLen -= 80;
						if (meterHandrailPar.handrailModel == "round")
							extraLen += par.rackProfile / 2;
						if (meterHandrailPar.handrailModel != "round")
							extraLen += par.rackProfile / 2 - meterHandrailPar.profZ / 2;

						var p1 = polar(botFirst, botHandrailAng, 0);
						var pt = newPoint_xy(botFirst, -extraLen + 7.5, 0)
						var p4 = itercection(p1, polar(p1, 0, 100), pt, polar(pt, Math.PI / 2, 100));
						handrailPoints.push(p4);
					}
					if (!p4) p1 = polar(p1, botHandrailAng, -extraLen);
					
					}
				if(params.stairModel == "Прямая с промежуточной площадкой" && par.marshId != "topPlt"){
					var extraLen = 80;
					if(meterHandrailPar.handrailModel == "round") extraLen += 50;
					var p0 = polar(marsh1First, parRacks.angMarsh1, -extraLen)
					handrailPoints.push(p0);
					p1 = itercection(marsh1First, polar(marsh1First, parRacks.angMarsh1, 100), botFirst, polar(botFirst, 0, 100));
					p2 = itercection(marshLast, polar(marshLast, parRacks.angMarsh, 100), botFirst, polar(botFirst, 0, 100));
				}
				handrailPoints.push(p1);
				handrailPoints.push(p2);
				}
	
			if (par.botEnd == "нет" || par.isRearPRailing){
				var extraLen = 80;
				if(par.firstRackPos) extraLen = par.firstRackPos;
				if (par.marshId == 'topPlt' && par.key == 'rear') {
					extraLen = 70 + params.stringerThickness + 40 / 2 - meterHandrailPar.profZ / 2;//40 - ширина стойки, 70 - расстояние от центра стойки до края тетивы
					if (params.model == "ко") extraLen += params.sideOverHang;
				}
				//просто свободный конец поручня на круглом поручне
				if(!par.isRearPRailing && meterHandrailPar.handrailModel == "round"){
					extraLen += 50;
					}
				if (par.botConnection && (par.isPlatform || par.isRearPRailing)){
					if(params.model == "ко") extraLen += params.sideOverHang;
					if (params.rackBottom == "сверху с крышкой") extraLen -= 80;
					if(meterHandrailPar.handrailModel == "round")
						extraLen -= par.rackProfile / 2;
					if(meterHandrailPar.handrailModel != "round")
						extraLen += par.rackProfile / 2 - meterHandrailPar.profZ / 2;

					if (par.isRearPRailing) {
						var p1 = polar(marshFirst, parRacks.angMarsh, 0);
						var pt = newPoint_xy(marshFirst, -extraLen + 7.5 + 0.2, 0)
						var p4 = itercection(p1, polar(p1, 0, 100), pt, polar(pt, Math.PI / 2, 100));
						handrailPoints.push(p4);
					}
					}
	
				if(!p4) var p1 = polar(marshFirst, parRacks.angMarsh, -extraLen);
				handrailPoints.push(p1);
				}
	
			if (par.topEnd != "нет" && !par.isRearPRailing){
				if (par.topEnd == "площадка") {
					var p1 = itercection(marshLast, polar(marshLast, parRacks.angMarsh, 100), topLast, polar(topLast, 0, 100));
					//var p1 = itercection(marshFirst, polar(marshFirst, parRacks.angMarsh, 100), topLast, polar(topLast, 0, 100));
					if (params.railingModel == 'Ригели' && params.stairModel == "Прямая горка") {
						p1 = polar(p1, parRacks.angMarsh, 40);
					}
					//продлеваем поручень до конца площадки
					var extraLen = 80;
					if (par.lastMarsh) extraLen = 90;
					if (par.key == 'in' && hasCustomMidPlt(par)) {
						extraLen = 0;
					}
					if(par.lastRackPos) extraLen = par.lastRackPos;
					if (params.model == "ко") extraLen += params.sideOverHang + params.stringerThickness;
					//if (par.lastMarsh && !par.topConnection && params.rackBottom == "сверху с крышкой") extraLen -= 80;
					if(par.topConnection) {
						if (params.rackBottom == "сверху с крышкой") extraLen -= 80;
						if(meterHandrailPar.handrailModel == "round")
							extraLen += par.rackProfile / 2;
						if(meterHandrailPar.handrailModel != "round")
							extraLen += par.rackProfile / 2 + meterHandrailPar.profZ / 2;
						}
					var p2 = newPoint_xy(topLast, extraLen, 0);
					}
				if (par.topEnd == "забег"){
					var p1 = polar(topFirst, parRacks.angMarsh, 0);
					var topHandrailAng = angle(p1, topLast);
					var p2 = polar(topLast, topHandrailAng, 50)
					
					//продлеваем поручень до конца площадки
					var extraLen = 80;
					if (par.lastMarsh) extraLen = 90;
					if (par.lastRackPos) extraLen = par.lastRackPos;
					if (params.model == "ко") extraLen += params.sideOverHang + params.stringerThickness;
					if (par.topConnection) {
						if (params.rackBottom == "сверху с крышкой") extraLen -= 80;
						if (meterHandrailPar.handrailModel == "round")
							extraLen += par.rackProfile / 2;
						if (meterHandrailPar.handrailModel != "round")
							extraLen += par.rackProfile / 2 + meterHandrailPar.profZ / 2;
						
						var p2 = polar(topLast, topHandrailAng, 0)
						var pt = newPoint_xy(topLast, extraLen + 45, 0)
						var p3 = itercection(p2, polar(p2, 0, 100), pt, polar(pt, Math.PI / 2, 100));
					}
					if(!p3) p2 = polar(topLast, topHandrailAng, extraLen);
				}

				
				if(params.stairModel == "Прямая горка"){
					var p2 = itercection(marsh2Last, polar(marsh2Last, -parRacks.angMarsh, 100), topLast, polar(topLast, 0, -100));
					if (params.railingModel == 'Ригели') {
						p2 = polar(p2, -parRacks.angMarsh, -40);
					}
					var p3 = polar(marsh2Last, -parRacks.angMarsh, 80)
					handrailPoints.push(p3);
				}
				handrailPoints.push(p1);
				handrailPoints.push(p2);
				if (p3) handrailPoints.push(p3);
			}
	
			if (par.topEnd == "нет" || par.isRearPRailing){
				var extraLen = 75;
				if (par.lastRackPos) extraLen = par.lastRackPos;
				if (par.marshId == 'topPlt' && par.key == 'rear') {
					extraLen = 70 + params.stringerThickness + 40 / 2 - meterHandrailPar.profZ / 2; //40 - ширина стойки, 70 - расстояние от центра стойки до края тетивы
					if (params.model == "ко") extraLen += params.sideOverHang;
				}
	
				if(par.topConnection){
					//if (params.rackBottom == "сверху с крышкой") extraLen -= 80;
					if(meterHandrailPar.handrailModel == "round")
						extraLen += par.rackProfile / 2;
					if(meterHandrailPar.handrailModel != "round")
						extraLen += par.rackProfile / 2 - meterHandrailPar.profZ / 2;
					if (par.isRearPRailing) {
						extraLen += meterHandrailPar.profZ;
						var p1 = polar(marshLast, parRacks.angMarsh, 0);
						var pt = newPoint_xy(marshLast, extraLen + 50, 0)
						var p3 = itercection(p1, polar(p1, 0, 100), pt, polar(pt, Math.PI / 2, 100));
					}
	
					}
				if(!p3) var p1 = polar(marshLast, parRacks.angMarsh, extraLen);

				//если на следующем марше поворотная стойка, удиняем поручень до неё
				if (parRacks.marshLast.noDraw && parRacks.marshLast.dxToMarshNext) {
					p1 = newPoint_x1(marshLast, parRacks.marshLast.dxToMarshNext + (parRacks.marshLast.x - marshLast.x) + 10 - par.rackProfile, parRacks.angMarsh);
				}
				handrailPoints.push(p1);
				if(p3)handrailPoints.push(p3);
			}
			
			return handrailPoints;
	} //end of calcHandrailPoints
	
	
	
	/***  СЕКЦИЯ ОГРАЖДЕНИЯ САМОНЕСУЩЕЕ СТЕКЛО  ***/
	
	
	function drawRailingSectionGlass(par){
	
		var section = new THREE.Object3D();
		var handrails = new THREE.Object3D();
	
		var marshParams = getMarshParams(par.marshId);
		var nextMarshParams = getMarshParams(marshParams.nextMarshId);
		par.marshPar = marshParams;
	
		//адаптация к единой функции drawMarshRailing
		if(par.stringerParams){
			par.racks = par.stringerParams[par.marshId].elmIns[par.key].racks
			if ((params.stairModel == "Прямая с промежуточной площадкой" || params.stairModel == 'Прямая горка') && par.marshId !== 'topPlt') {
				par.racks = [];
				par.racks.push(...par.stringerParams[1].elmIns[par.key].racks);
				//пересчитываем координаты стоек второго марша с учетом позиции марша
				for (var i = 0; i < par.stringerParams[3].elmIns[par.key].racks.length; i++) {
					var point = copyPoint(par.stringerParams[3].elmIns[par.key].racks[i]);
					point.x += par.stringerParams[3].treadsObj.unitsPos.marsh3.x;
					point.y += par.stringerParams[3].treadsObj.unitsPos.marsh3.y;
					par.racks.push(point)
				}
			}
			//рассчитываем необходимые параметры и добавляем в объект par
			setRailingParams(par)//функция в файле calcRailingParams.js
			par.keyPoints = par.stringerParams[par.marshId].keyPoints[par.key];
		}
	
		if (params.stairModel == "Прямая с промежуточной площадкой") {
			par.botEnd = "нет"
		}
	
			if (par.racks.length == 0) return section;
	
		var stringerSideOffset = 0;
		if(params.model == "ко") stringerSideOffset = params.sideOverHang;
		var glassDist = 10
			var glassThickness = 12 //толщина стекла
			var platformStringerWidth = 150; //ширина тетивы площадки
		var platformGlassMaxLength = 800 //максимальная длина стекла по горизонтали
		var glassHeight = 1300; //1400;
		var handrailPoints = [];
		var handrailSlotDepth = 15;
		var railingZOffset = 20 //зазор от стекла до торца марша
		if (params.model == "ко") {
			railingZOffset = 5;
			if (params.handrailFixType == "паз" && params.startVertHandrail == "есть") railingZOffset = 14;
		}
		var rutelLength = 50 + stringerSideOffset; //длина рутеля
		var rutelDiam = 14; //диаметр рутеля
			var rutelHoleDiam = 18; //диаметр отверстия под рутели
	
	
		var glassLengths = [];
	
		par.a = params.a1;
		par.b = params.b1;
		par.h = params.h1;
		par.stairAmt = params.stairAmt1;
		if(par.marshId == 2) {
			par.a = params.a2;
			par.b = params.b2;
			par.h = params.h2;
				par.stairAmt = params.stairAmt2;
			}
		if(par.marshId == 3) {
			par.a = params.a3;
			par.b = params.b3;
			par.h = params.h3;
				par.stairAmt = params.stairAmt3;
			}
	
		par.lastMarsh = false;
		if (par.marshId == 3) par.lastMarsh = true;
		if (params.stairModel == "Прямая" && par.marshId == 1) par.lastMarsh = true;
		if (params.stairModel == "Прямая с промежуточной площадкой" && par.marshId == 1) par.lastMarsh = true;
	
		var meterHandrailPar = {
			prof: params.handrailProf,
			sideSlots: params.handrailSlots,
			handrailType: params.handrail,
			metalPaint: params.metalPaint_perila,
			timberPaint: params.timberPaint_perila,
			}
		meterHandrailPar = calcHandrailMeterParams(meterHandrailPar);
	
		//точки, снятые с тетивы / косоура
	
		if(!par.keyPoints) par.keyPoints = {};
		//нижний угол в начале секции
			if (!par.keyPoints.botLineP0) par.keyPoints.botLineP0 = newPoint_xy(par.racks[1], -100, -100);
			if (par.marshId == 1) {
			par.keyPoints.botLineP0 = copyPoint(par.keyPoints.zeroPoint);
				//смещяем начало ограждений если ограждение не с первой ступени
			if (params.railingStart !== 0)
				par.keyPoints.botLineP0 = newPoint_xy(par.keyPoints.botLineP0, par.b * params.railingStart, par.h * params.railingStart);
	
			}
		//нижний угол в конце секции
			if (!par.keyPoints.botLineP10) par.keyPoints.botLineP10 = newPoint_xy(par.racks[par.racks.length - 1], 100, -100);
			
			//par.keyPoints.botLineP10 = newPoint_xy(par.keyPoints.botLineP10, -100, 0)
		
		//нижняя линия на марше
		if(!par.keyPoints.marshBotLineP1) par.keyPoints.marshBotLineP1 = {x: 0, y: 0};
		if (!par.keyPoints.marshBotLineP2) par.keyPoints.marshBotLineP2 = { x: 100, y: 100 };
	
		if (par.isPlatform && par.keyPoints.end2) {		
			par.keyPoints.botLineP0.x = par.keyPoints.end2.x;
			par.keyPoints.botLineP10.x = par.keyPoints.end1.x;
		}
	
		//сортируем массив racks в порядке возрастания координаты x
		par.racks.sort(function (a, b) {
				return a.x - b.x;
			});
	
		//координата нижнего угла первого стекла марша
		var p0 = { x: 0, y: 0 };
		if (par.marshId == 1) p0 = copyPoint(par.keyPoints.botLineP0)
		
			//для внутренней стороны марша кроме первого
			if (par.botEnd == "нет" && par.marshId !== 1) p0 = newPoint_xy(par.keyPoints.botLineP0, railingZOffset, 0);
			if (par.botEnd == "забег" && par.stairAmt == 0 && par.lastMarsh) {
				//p0 = newPoint_xy(p0, par.b, 0);
				if (params.model == "ко") p0 = newPoint_xy(p0, params.lastWinderTreadWidth - 15, 0);
				if (params.model == "лт") p0 = newPoint_xy(p0, params.lastWinderTreadWidth + 15, 0);
			}
	
		var marshStart = itercection(p0, newPoint_xy(p0, 0, 100), par.keyPoints.marshBotLineP1, par.keyPoints.marshBotLineP2)

	//нижний поворот
		if (params.stairModel == "П-образная с забегом" && par.marshId == 2) {
			par.botEnd = "нет";
		}
	
		if(par.botEnd != "нет"){
	
			//координата нижнего угла секции
			var glassPos = newPoint_xy(par.keyPoints.botLineP0,  glassDist - params.stringerThickness, 0);
			if (par.botConnection) glassPos = newPoint_xy(glassPos, -railingZOffset - stringerSideOffset, 0);
			if (par.botEnd == "площадка") glassPos.x += params.stringerThickness;
			if (par.botEnd == "площадка" && params.model == "ко") glassPos.y = marshStart.y;
	
			var glassPar = {
				angleTop: 0,
				width: marshStart.x - glassPos.x - glassDist,
				heightLeft: glassHeight,
				botCutHeight: 0,
				topCutHeight: 0,
				thk: glassThickness,
				angleBot: 0,
				holes: [],
				dxfBasePoint: par.dxfBasePoint,
				dxfArr: dxfPrimitivesArr,
				}
	
	
	
			//расчет параметров стекла на забеге
			if (par.botEnd == "забег") {
				//Рассчитываем координаты углов стекла (вспомогательыне точки)
				var p0 = copyPoint(glassPos); //сохраняем точку
				var p1 = newPoint_xy(p0, 0, glassHeight);
				var p2 = newPoint_xy(marshStart, 0, glassHeight);
				var p3 = copyPoint(marshStart);
				var p4 = newPoint_xy(p0, 150, 0); //длина 150 установлена для теста
	
				glassPos = itercection(p0, p1, p3, p4); //рассчитываем позицию угла стекла без среза
	
				glassPar.angleTop = angle(p1, p2);
				glassPar.angleBot = angle(p4, p3);
				glassPar.botCutHeight = p0.y - glassPos.y;
	
				glassPar.heightLeft += glassPar.botCutHeight; //высота слева с учетом среза должна быть равной номинальной
				}
	
			//формирование массива holes для рутелей из массива отверстий par.racks
			for(var j = 0; j < par.racks.length; j++){
				var hole = { x: par.racks[j].x, y: par.racks[j].y, rad: rutelHoleDiam/2 };
				if(glassPos.x < hole.x && glassPos.x + glassPar.width > hole.x){
					hole.x -= glassPos.x;
					hole.y -= glassPos.y;
					glassPar.holes.push(hole);
					}
				}
	
			//Отрисовка стекла нижнего поворота
			glassPar.key = par.key;
			glassPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, glassPos.x, glassPos.y);
			var glass = drawGlass_ko(glassPar).mesh;
			glass.position.x = glassPos.x;
			glass.position.y = glassPos.y;
			glass.position.z = railingZOffset;
			if(par.railingSide == 'left') glass.position.z = -railingZOffset - glassThickness;
			section.add(glass);
	
			//базовая точка для поручня
			handrailPoints.push(newPoint_xy(glassPos, glassDist, glassPar.heightLeft));
	
		}
	
	//стекла на марше
	
	
		//параметры стекол на марше
	
		var glassPos = marshStart;
		var marshAngle = angle(par.keyPoints.marshBotLineP1, par.keyPoints.marshBotLineP2);
			var marshSectLen = par.b * par.stairAmt;
		if(params.startTreadAmt > 0 && par.marshId == 1) glassPos = newPoint_xy(marshStart, params.startTreadAmt * par.b + 20, params.startTreadAmt * par.h)
	
			//if (par.stairAmt == 0) marshSectLen = par.keyPoints.botLineP10.x - par.keyPoints.botLineP0.x;
	
			//для внутренней стороны марша кроме последнего считаем длину марша через координаты угла косоура
			if (!par.lastMarsh && par.topEnd == "нет") {
					marshSectLen = par.keyPoints.botLineP10.x - marshStart.x - railingZOffset - glassThickness - glassDist;
					if (params.stairModel == "П-образная с забегом" || params.stairModel == "П-образная с площадкой")
				marshSectLen += glassThickness + glassDist;
			if (params.model == "ко") {
				marshSectLen -= params.sideOverHang + 5;
				if (params.stairModel == "П-образная с площадкой") marshSectLen += 45;
			}
			}
	
		//для последнего марша считаем длину марша через координаты угла косоура
		if(par.lastMarsh && par.topEnd == "нет") {
			marshSectLen = par.keyPoints.botLineP10.x;
					marshSectLen -= glassDist;
	
			if(par.key == "in") {
				marshSectLen = par.keyPoints.botLineP10.x - glassDist - railingZOffset - par.keyPoints.botLineP0.x;
				}
			}
	
		if(params.startTreadAmt > 0 && par.marshId == 1) marshSectLen -= params.startTreadAmt * par.b + 20;	
	
		if(par.topEnd == "площадка") marshSectLen += par.b;
	
		//рассчитываем координаты разрывов стекол по координатам рутелей
			//определяем индекс первого и последнего рутеля марша
			var marshFirstRutIndex = 0;
			var marshLastRutIndex = 3;
			for(var i=0; i< par.racks.length; i++){
				if(par.racks[i].x > 0) {
					marshFirstRutIndex = i;
					break;
					}
				}
		//Корректируем длинну стекла если во втором марше 0 ступеней
		if (params.stairModel == 'П-образная трехмаршевая' && par.marshId == 3 && params.stairAmt2 == 0) {
			glassPos.x += 20 + 22;
			marshSectLen -= 20 + 22;
		}
		var marshLen = marshSectLen;
		if (params.railingStart !== 0 && par.marshId == 1) marshLen += params.railingStart * par.b;
			for(var i=0; i< par.racks.length; i++){
				if (par.racks[i].x > marshLen) {
					break;
					}
				marshLastRutIndex = i;
				}
	
			//рассчитываем координаты разрывов стекол
			var divideX = [];
			for(var i = marshFirstRutIndex + 3; i < marshLastRutIndex-2; i++){
				if(par.racks[i+1].x - par.racks[i].x - par.b < 0.01){
					divideX.push(par.racks[i].x + par.b / 2);
					i += 3;
					}
				}
			//массив длин стекол
			var glassLengths = [];
			for(var i=0; i< divideX.length; i++){
				if (i == 0) glassLengths.push(divideX[i] - glassDist - (marshLen - marshSectLen));
				if(i != 0) glassLengths.push(divideX[i] - divideX[i - 1] - glassDist);
				}
	
			//первое стекло
			if (divideX[0]) glassLengths.push(marshLen - divideX[divideX.length - 1])
			else glassLengths.push(marshSectLen)
	
					if (par.stairAmt == 0 && !par.isPlatform) {
							glassLengths = [];
							if (par.topEnd != "нет" || par.botEnd != "нет")
									handrailPoints.push(newPoint_xy(glassPos, 0, glassHeight));
					}
	
		//параметры заднего ограждения забега П-образной лестницы
		if (par.isRearPWnd || par.isRearPRailing){
					var glassPos = newPoint_xy(par.keyPoints.botLineP0, -stringerSideOffset + glassDist - railingZOffset - params.stringerThickness, 0);
			marshAngle = angle(par.racks[1], par.racks[par.racks.length - 1]);
	
					var totalSectLen = par.keyPoints.botLineP10.x - par.keyPoints.botLineP0.x - glassDist
							+ params.stringerThickness + railingZOffset * 2 + glassThickness + stringerSideOffset*2;
					glassLengths = [totalSectLen / 2 - glassDist / 2, totalSectLen / 2 - glassDist / 2]
			}
	
		//параметры стекла на площадке
		if(par.isPlatform){
				glassPos = copyPoint(par.keyPoints.botLineP0);
					//glassPos.x -= railingZOffset - glassDist + stringerSideOffset;
			marshAngle = 0;
			glassLengths = [];
	
					//var totalSectLen = par.keyPoints.botLineP10.x;
			var totalSectLen = par.keyPoints.botLineP10.x - par.keyPoints.botLineP0.x;
					//totalSectLen += railingZOffset * 2 + glassThickness + stringerSideOffset * 2;// - glassDist;
					if (!par.isRearPRailing && par.lastMarsh) totalSectLen -= glassThickness + glassDist ;
					if (params.model == "ко" && par.lastMarsh) {
							glassPos.x -= params.stringerThickness;
							totalSectLen += params.stringerThickness * 2;
					}
					if (par.isRearPRailing && dyRearPlatform) glassPos.y -= dyRearPlatform;
					if (!par.isRearPRailing && par.lastMarsh && dyLastRearPlatform) glassPos.y -= dyLastRearPlatform;
	
			var glassAmt = Math.round(par.racks.length / 4); //по 4 рутеля на каждое стекло
					glassWidth = (totalSectLen - glassDist * glassAmt) / glassAmt;
			for(var i=0; i<glassAmt; i++){
				glassLengths.push(glassWidth);
				}
			}
	
	
	
		//отрисовка стекол марша
	
			for(var i=0; i<glassLengths.length; i++){
	
			var glassPar = {
				angleTop: marshAngle,
				width: sectLen,
				heightLeft: glassHeight,
				botCutHeight: 0,
				topCutHeight: 0,
				thk: glassThickness,
				angleBot: marshAngle,
				holes: [],
				dxfBasePoint: par.dxfBasePoint,
				dxfArr: dxfPrimitivesArr,
				}
	
			//срез низа первого стекла первого марша
				if (i == 0 && par.marshId == 1) {
					if (marshStart.y - glassDist < 0) {
						glassPar.botCutHeight = par.keyPoints.botLineP0.y - marshStart.y + glassDist;
						glassPar.botCutHeight -= par.h * params.railingStart;
					}
			}
			else glassPar.botCutHeight = 0;
			if (params.startTreadAmt > 0 && par.marshId == 1 && i == 0) {
				glassPar.botCutHeight = 0;
				if (params.railingStart == 0) glassPar.botCutHeight = - marshStart.y - par.h + glassDist;
			}
	
			/*
			//срез верха последнего стекла
			if(par.topEnd == "площадка" && i == glassLengths.length - 1 && par.botEnd != "забег"){
				glassPar.topCutHeight = botCutHeight;
				}
			*/
	
			glassPar.width = glassLengths[i];
	
			//формирование массива holes для рутелей из массива отверстий par.racks
			for(var j = 0; j < par.racks.length; j++){
				var hole = { x: par.racks[j].x, y: par.racks[j].y, rad: rutelHoleDiam/2 };
				if(glassPos.x < hole.x && glassPos.x + glassPar.width > hole.x){
					hole.x -= glassPos.x;
					hole.y -= glassPos.y;
					glassPar.holes.push(hole);
					}
				}
	
			//коррекция последнего стекла последнего марша
			if (par.marshPar.topTurn == 'пол' && i == (glassLengths.length - 1)){			
				//уменьшение длины стекла
				if(params.topGlassExtraLength < 0){
					glassPar.width += params.topGlassExtraLength;
				}
				
				//увеличение длины стекла с вырезом под верхнее перекрытие
				if (params.topGlassExtraLength > 0) {
					glassPar.hasTopOverlap = true;
					glassPar.extraLengthOverlap = (params.topGlassExtraLength) / Math.cos(par.marshPar.ang);
					glassPar.overlapCutHeight = glassHeight - par.marshPar.h - 250//250 - подогнано
				}
			}
	
			//отрисовка стекла марша
	
			glassPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, glassPos.x, glassPos.y);
			glassPar.key = par.key;
			var glass = drawGlass_ko(glassPar).mesh;
			glass.position.x = glassPos.x;
			glass.position.y = glassPos.y;
			glass.position.z = railingZOffset;
			if(par.railingSide == 'left') glass.position.z = -railingZOffset - glassThickness;
			section.add(glass);
	
			//точка поручня на первом стекле
			if(i == 0) handrailPoints.push(newPoint_xy(glassPos, 0, glassHeight));
			//точка поручня на последнем стекле
			if(i == glassLengths.length - 1){
				var handrailPoint = newPoint_xy(glassPos, 0, glassHeight);
				handrailPoint = newPoint_x1(handrailPoint, glassPar.width + glassDist, marshAngle);
				//для внутренней стороны марша кроме последнего считаем длину марша через координаты угла косоура
				if (!par.lastMarsh && par.topEnd == "нет") {
					handrailPoint = newPoint_xy(glassPos, 0, glassHeight);
					handrailPoint = newPoint_x1(handrailPoint, glassPar.width + 40 - 1, marshAngle);
				}
				handrailPoints.push(handrailPoint);
				}
	
			glassPos = newPoint_x1(glassPos, glassPar.width + glassDist, glassPar.angleTop);
	
		} //конец цикла построения стекол марша
	
	
		if (params.stairModel == "Прямая с промежуточной площадкой" && par.marshId !== 'topPlt') {
		//Отрисовка стекла промежуточной площадки
			{
				glassPos = newPoint_x1(marshStart, marshSectLen, marshAngle)
				glassPos = newPoint_xy(glassPos, glassDist, 0);
				var extraLenX = stringerSideOffset - glassDist;
				var sectLen = (par.b * par.stairAmt + params.middlePltLength) - glassPos.x + extraLenX;
	
	
				var glassPar = {
					angleTop: 0,
					width: sectLen,
					heightLeft: glassHeight,
					botCutHeight: 0,
					topCutHeight: 0,
					thk: glassThickness,
					angleBot: 0,
					holes: [],
					dxfBasePoint: par.dxfBasePoint,
					dxfArr: dxfPrimitivesArr,
				}
	
				//формирование массива holes для рутелей из массива отверстий par.racks
				for (var j = 0; j < par.racks.length; j++) {
					var hole = { x: par.racks[j].x, y: par.racks[j].y, rad: rutelHoleDiam / 2 };
					if (glassPos.x < hole.x && glassPos.x + glassPar.width > hole.x) {
						hole.x -= glassPos.x;
						hole.y -= glassPos.y;
						glassPar.holes.push(hole);
					}
				}
	
				//Отрисовка стекла верхнего поворота
				glassPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, glassPos.x, glassPos.y);
				glassPar.key = par.key;
				var glass = drawGlass_ko(glassPar).mesh;
				glass.position.x = glassPos.x;
				glass.position.y = glassPos.y;
				glass.position.z = railingZOffset;
				if (par.railingSide == 'left') glass.position.z = -railingZOffset - glassThickness;
				section.add(glass);
	
				//базовая точка для поручня
				var ph = newPoint_x1(glassPos, sectLen, glassPar.angleBot)
				var handrailPoint = newPoint_xy(ph, 0, glassPar.heightLeft)
	
				//handrailPoints.push(handrailPoint);
			}
		//Отрисовка стекла верхнего марша
			{
				//параметры стекол на марше
	
				var glassPos = newPoint_xy(ph, 10, 0);
				var marshAngle = Math.atan(params.h3 / params.b3);
				var marshSectLen = params.b3 * params.stairAmt3;
				
				if (par.topEnd == "площадка") marshSectLen += par.b;
	
				//рассчитываем координаты разрывов стекол по координатам рутелей
				//определяем индекс первого и последнего рутеля марша
				var marshFirstRutIndex = 0;
				var marshLastRutIndex = 3;
				for (var i = 0; i < par.racks.length; i++) {
					if (par.racks[i].x > 0) {
						marshFirstRutIndex = i;
						break;
					}
				}
	
				for (var i = 0; i < par.racks.length; i++) {
					if (par.racks[i].x > marshSectLen) {
						break;
					}
					marshLastRutIndex = i;
				}
	
				//рассчитываем координаты разрывов стекол
				var divideX = [];
				for (var i = marshFirstRutIndex + 3; i < marshLastRutIndex - 2; i++) {
					if (par.racks[i + 1].x - par.racks[i].x - params.b3 < 0.01) {
						divideX.push(par.racks[i].x + params.b3 / 2);
						i += 3;
					}
				}
				//массив длин стекол
				var glassLengths = [];
				for (var i = 0; i < divideX.length; i++) {
					if (i == 0) glassLengths.push(divideX[i] - glassDist);
					if (i != 0) glassLengths.push(divideX[i] - divideX[i - 1] - glassDist);
				}
	
				//первое стекло
				if (divideX[0]) glassLengths.push(marshSectLen - divideX[divideX.length - 1])
				else glassLengths.push(marshSectLen)
	
				//отрисовка стекол марша
				for (var i = 0; i < glassLengths.length; i++) {
	
					var glassPar = {
						angleTop: marshAngle,
						width: sectLen,
						heightLeft: glassHeight,
						botCutHeight: 0,
						topCutHeight: 0,
						thk: glassThickness,
						angleBot: marshAngle,
						holes: [],
						dxfBasePoint: par.dxfBasePoint,
						dxfArr: dxfPrimitivesArr,
					}
	
					glassPar.width = glassLengths[i];
	
					//формирование массива holes для рутелей из массива отверстий par.racks
					for (var j = 0; j < par.racks.length; j++) {
						var hole = { x: par.racks[j].x, y: par.racks[j].y, rad: rutelHoleDiam / 2 };
						if (glassPos.x < hole.x && glassPos.x + glassPar.width > hole.x) {
							hole.x -= glassPos.x;
							hole.y -= glassPos.y;
							glassPar.holes.push(hole);
						}
					}
	
	
					//отрисовка стекла марша
	
					glassPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, glassPos.x, glassPos.y);
					glassPar.key = par.key;
					var glass = drawGlass_ko(glassPar).mesh;
					glass.position.x = glassPos.x;
					glass.position.y = glassPos.y;
					glass.position.z = railingZOffset;
					if (par.railingSide == 'left') glass.position.z = -railingZOffset - glassThickness;
					section.add(glass);
	
					//точка поручня на первом стекле
					if (i == 0) handrailPoints.push(newPoint_xy(glassPos, 0, glassHeight));
					//точка поручня на последнем стекле
					if (i == glassLengths.length - 1) {
						var handrailPoint = newPoint_xy(glassPos, 0, glassHeight);
						handrailPoint = newPoint_x1(handrailPoint, glassPar.width, marshAngle);
						handrailPoints.push(handrailPoint);
					}
	
					glassPos = newPoint_x1(glassPos, glassPar.width + glassDist, glassPar.angleTop);
	
				} //конец цикла построения стекол марша
				var ph1 = copyPoint(glassPos);
			}
		}
	
	
	
	//верхний поворот
	
		if(par.topEnd != "нет"){
	
			glassPos = newPoint_x1(marshStart, marshSectLen, marshAngle)
			if (params.startTreadAmt > 0 && par.marshId == 1) glassPos = newPoint_x1(glassPos, params.startTreadAmt * par.b + 20, marshAngle);	
					//if (par.botEnd == "забег" && par.stairAmt == 0) glassPos = copyPoint(marshStart);
				glassPos = newPoint_xy(glassPos, glassDist, 0);
			var extraLenX = stringerSideOffset - glassDist;
					if (par.topConnection) extraLenX += railingZOffset + glassDist + glassThickness;
	
			var sectLen = par.keyPoints.botLineP10.x - glassPos.x + extraLenX;
				if (par.stairAmt == 0) {
						glassPos = copyPoint(marshStart);
							sectLen = par.keyPoints.botLineP10.x - glassPos.x + extraLenX;
				}
	
				if (par.topEnd == "площадка") {
						sectLen += params.stringerThickness;
			}
	
			if (params.stairModel == "Прямая с промежуточной площадкой") {
				glassPos = newPoint_xy(ph1, 0, 0);
				sectLen = params.platformLength_3 - params.b3;
			}
	
					//запоминаем сдвиг по высоте от верхнего края косоура до нижнего края стекла для заднего стекла площадки
				if (!par.lastMarsh) dyRearPlatform = par.keyPoints.botLineP10.y - glassPos.y;
			if (par.lastMarsh) dyLastRearPlatform = par.keyPoints.botLineP10.y - glassPos.y;
	
	
			var glassPar = {
				angleTop: 0,
				width: sectLen,
				heightLeft: glassHeight,
				botCutHeight: 0,
				topCutHeight: 0,
				thk: glassThickness,
				angleBot: 0,
				holes: [],
				dxfBasePoint: par.dxfBasePoint,
				dxfArr: dxfPrimitivesArr,
					}
	
				//срез низа первого стекла первого марша если в марше 0 ступеней
					if (par.stairAmt == 0 && par.marshId == 1) {
							if (par.topEnd == "забег") {
					glassPos = {x:0, y: -50,}            
					glassPar.botCutHeight = 50 + glassDist;
					//пересчитываем точку поручня
					handrailPoints[handrailPoints.length - 1].y = - glassPar.botCutHeight + glassPar.heightLeft
					}
					
							if (par.topEnd == "площадка") {
									glassPar.heightLeft -= glassDist;
									glassPos.y += glassDist;
							}
					}
	
	
			//расчет параметров стекла на забеге
			if(par.topEnd == "забег") {
				//Рассчитываем координаты углов стекла
				var p0 = copyPoint(glassPos);
				var p1 = newPoint_xy(p0, 0, glassHeight);
				var p3 = newPoint_xy(par.keyPoints.botLineP10, extraLenX, 0);
				var p2 = newPoint_xy(p3, 0, glassHeight);
	
				glassPar.angleTop = angle(p1, p2);
				glassPar.angleBot = angle(p0, p3);
				}
	
			//формирование массива holes для рутелей из массива отверстий par.racks
			for(var j = 0; j < par.racks.length; j++){
				var hole = { x: par.racks[j].x, y: par.racks[j].y, rad: rutelHoleDiam/2 };
				if(glassPos.x < hole.x && glassPos.x + glassPar.width > hole.x){
					hole.x -= glassPos.x;
					hole.y -= glassPos.y;
					glassPar.holes.push(hole);
					}
				}
	
			//Отрисовка стекла верхнего поворота
			glassPar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, glassPos.x, glassPos.y);
			glassPar.key = par.key;
			var glass = drawGlass_ko(glassPar).mesh;
			glass.position.x = glassPos.x;
			glass.position.y = glassPos.y;
			glass.position.z = railingZOffset;
			if(par.railingSide == 'left') glass.position.z = -railingZOffset - glassThickness;
			section.add(glass);
	
			//базовая точка для поручня
			var ph = newPoint_x1(glassPos, sectLen, glassPar.angleBot)
			var handrailPoint = newPoint_xy(ph, 0, glassPar.heightLeft)
			//укорачиваем поручень чтобы не было пересечения с поручнем верхнего марша
			if(par.key == "out" && par.topConnection){
				if(params.handrailFixType == "кронштейны")  handrailPoint = newPoint_x1(handrailPoint, -150, glassPar.angleTop)
				if(params.handrailFixType == "паз")  handrailPoint = newPoint_x1(handrailPoint, 40 / 2 - 6, glassPar.angleTop)
	
				}
	
			handrailPoints.push(handrailPoint);
	
		}
	
	
	
		//отрисовка рутелей
	
		if(typeof anglesHasBolts != "undefined" && anglesHasBolts && par.showPins){ //anglesHasBolts - глобальная переменная
	
	
			var rutelGeometry = new THREE.CylinderGeometry(rutelDiam/2, rutelDiam/2, rutelLength, 20, 0, false);
		var rutelMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
	
		for(var i = 0; i < par.racks.length; ++i){
			var center = { x: par.racks[i].x, y: par.racks[i].y };
			var rutel = new THREE.Mesh(rutelGeometry, rutelMaterial);
	
			//позиционирование рутеля
				rutel.rotation.x = Math.PI / 2;
			rutel.position.x = center.x;
			rutel.position.y = center.y;
			rutel.position.z = -rutelLength/2 + glassThickness + railingZOffset;
			if(par.railingSide == 'left') rutel.position.z = rutelLength/2 - glassThickness - railingZOffset;
	
			section.add(rutel);
			}
		}
	
		//сохраняем массив точек в отдельную переменную
		if (par.isRearPRailing)
			handrailPoints = [handrailPoints[1], handrailPoints[2]];
		var handrailPoints0 = handrailPoints;
		
		//поручни
	
			if (params.handrail !== "нет") {
					var meterHandrailPar = {
							prof: params.handrailProf,
							sideSlots: params.handrailSlots,
							handrailType: params.handrail,
							metalPaint: params.metalPaint_perila,
							timberPaint: params.timberPaint_perila,
					}
					meterHandrailPar = calcHandrailMeterParams(meterHandrailPar);
	
			handrailParams = {
				points: handrailPoints,
				side: par.railingSide,
				offset: handrailSlotDepth,
				extraLengthStart: 10,
				extraLengthEnd: 10,
				connection: params.handrailConnectionType,
				dxfBasePoint: par.dxfBasePoint,
				fixType: params.handrailFixType,
				sectText: par.text,
				}

				if (meterHandrailPar.handrailModel == 'round' && params.startVertHandrail !== "есть") {
					var handrailAngle = Math.atan((handrailPoints[1].y - handrailPoints[0].y) / (handrailPoints[1].x - handrailPoints[0].x));
					handrailParams.extraLengthStart += meterHandrailPar.profY / 2 * Math.tan(handrailAngle);
				}
	
			//удлиннение поручня последнего марша
			if(params.stairModel == "прямая" || par.marshId == 3) {
				handrailParams.extraLengthEnd += params.topHandrailExtraLength;				
				}

				if (params.handrailFixType == "паз" && params.handrailEndType == 'прямые') {
					handrailParams.extraLengthEnd += handrailSlotDepth * Math.tan(marshAngle);
				}
	
			//вертикальные участки
			if(params.startVertHandrail == "есть" && params.handrailFixType == "паз"){
				//начало секции
				//первый марш
				if(par.marshId == 1) {
					var startPoint = {
						x: handrailParams.points[0].x,
						y: 0,
						}
						//newPoint_xy(handrailParams.points[0], 0, -glassHeight);
									handrailParams.points.unshift(startPoint);
									if (par.key == 'in' && (!nextMarshParams.hasRailing.in || params.stairModel == "П-образная с площадкой" || params.stairModel == "П-образная с забегом")) {
											if (params.model == "ко") handrailParams.points[handrailParams.points.length - 1] = newPoint_x1(handrailParams.points[handrailParams.points.length - 1], -meterHandrailPar.profY - 3, marshAngle);
											if (params.model == "лт") handrailParams.points[handrailParams.points.length - 1] = newPoint_x1(handrailParams.points[handrailParams.points.length - 1], -meterHandrailPar.profY + handrailParams.extraLengthEnd, marshAngle);
											var startPoint = newPoint_xy(handrailParams.points[handrailParams.points.length - 1], 0, -glassHeight); //поправить
								handrailParams.points.push(startPoint);
						}
					}
				//средний марш
							if (par.marshId == 2 && par.botEnd == 'нет') {
									if (par.key == 'in') {
											if (params.model == "ко") handrailParams.points[0] = newPoint_x1(handrailParams.points[0], (meterHandrailPar.profY - 40) + 3, marshAngle);
											if (params.model == "лт") handrailParams.points[0] = newPoint_x1(handrailParams.points[0], (meterHandrailPar.profY - 40), marshAngle);
									}
					var startPoint = newPoint_xy(handrailParams.points[0], 0, -glassHeight); //поправить
									handrailParams.points.unshift(startPoint);
									if (par.key == 'in' && (!nextMarshParams.hasRailing.in || params.stairModel == "П-образная с площадкой" || params.stairModel == "П-образная с забегом")) {
											if (params.model == "ко") handrailParams.points[handrailParams.points.length - 1] = newPoint_x1(handrailParams.points[handrailParams.points.length - 1], -meterHandrailPar.profY - 3, marshAngle);
											if (params.model == "лт") handrailParams.points[handrailParams.points.length - 1] = newPoint_x1(handrailParams.points[handrailParams.points.length - 1], -meterHandrailPar.profY + handrailParams.extraLengthEnd, marshAngle);
											var startPoint = newPoint_xy(handrailParams.points[handrailParams.points.length - 1], 0, -glassHeight); //поправить
											handrailParams.points.push(startPoint);
									}
					}
				//верхний марш
							if (par.marshId == 3 && par.botEnd == 'нет') {
									if (par.key == 'in') {
											if (params.model == "ко") handrailParams.points[0] = newPoint_x1(handrailParams.points[0], (meterHandrailPar.profY - 40) + 3, marshAngle);
											if (params.model == "лт") handrailParams.points[0] = newPoint_x1(handrailParams.points[0], (meterHandrailPar.profY - 40), marshAngle);
									}
					var startPoint = newPoint_xy(handrailParams.points[0], 0, -glassHeight); //поправить
					handrailParams.points.unshift(startPoint);
				}
				if (par.lastMarsh && par.topEnd == 'нет') {
					handrailParams.points[handrailParams.points.length - 1] = newPoint_x1(handrailParams.points[handrailParams.points.length - 1], -meterHandrailPar.profY - 5 - handrailParams.extraLengthEnd, marshAngle);
					var startPoint = newPoint_xy(handrailParams.points[handrailParams.points.length - 1], 0, -glassHeight); //поправить
					handrailParams.points.push(startPoint);
				}
			}
			if (par.marshId == "topPlt" && params.handrailFixType == "кронштейны") {			
				var extraLengthBack = 50 + meterHandrailPar.profZ / 2 + 5;// 50- расстояние от стены до оси поручня
				handrailParams.extraLengthEnd -= extraLengthBack * 2;
			}
	
			handrailParams = drawPolylineHandrail(handrailParams);
	
			var handrail = handrailParams.mesh;
	
			if(params.handrailFixType == "паз"){
				handrail.position.z = -handrailParams.wallOffset - railingZOffset - glassThickness / 2;
				if(par.railingSide == "right") handrail.position.z = handrailParams.wallOffset + railingZOffset + glassThickness / 2;
			}
			if (par.marshId == "topPlt") {
				if (params.handrailFixType == "паз")
					handrail.position.z = 2 - glassThickness / 2 - handrailParams.meterHandrailPar.profZ / 2;
				if (params.handrailFixType == "кронштейны") {
					//handrail.position.z = 2 - glassThickness / 2 - handrailParams.meterHandrailPar.profZ / 2;
					handrail.position.x -= extraLengthBack + 10;
					handrail.rotation.y = Math.PI;
				}
			}
			handrails.add(handrail);
	
		} //конец поручней
		
		//сохраняем данные для спецификации
		if (typeof railingParams != 'undefined') {
			if (!railingParams.sections) {
				railingParams.sections = {
					types: [],
					sumLen: 0,
				}
			}
			for(var i=1; i<handrailPoints0.length; i++){
				var sectLen = distance(handrailPoints0[i-1], handrailPoints0[i]);
				railingParams.sections.types.push(sectLen);
				railingParams.sections.sumLen += sectLen / 1000;
				}
			}
	
		var textHeight = 30;
		var text = par.text;
			var textBasePoint = newPoint_xy(par.dxfBasePoint, 20, -150);
		addText(text, textHeight, dxfPrimitivesArr, textBasePoint);
	
		par.mesh = section;
		
		var result = {
			mesh: section,
			handrails: handrails,
			}
		return result;
	
	}//end of drawRailingSectionGlass
	
	
	
	
	function drawGlass_ko(par){
		console.log(par)
		/* ссылка на чертеж 6692035.ru/drawings/railing/glassParams_ko.pdf
		angleTop
		heightLeft
		width
		thk
		botCutHeight
		angleBot
		holes
		*/
		
		par.mesh = new THREE.Object3D();

		var glassMaterial = new THREE.MeshLambertMaterial({ opacity: 0.6, color: 0x3AE2CE, transparent: true });
		var extrudeOptions = {
			amount: par.thk,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};
	
		//четырехугольник без срезов
		var p1 = {x: 0, y: 0};
		var p2 = newPoint_xy(p1, 0, par.heightLeft);
		var p3 = newPoint_x1(p2, par.width, par.angleTop);
		var p4 = newPoint_x1(p1, par.width, par.angleBot);
	
	
		//срез снизу
		var botY = p1.y;
		if(par.botCutHeight != 0) {
			var p11 = newPoint_y(p1,  par.botCutHeight, par.angleBot);
			var p12 = newPoint_xy(p1, 0, par.botCutHeight);
			botY = p12.y;
			}
	
		//срез сверху
		var topY = p3.y;
		if(par.topCutHeight != 0) {
			var p31 = newPoint_y(p1,  -par.topCutHeight, par.angleTop);
			var p32 = newPoint_xy(p3, 0, -par.topCutHeight);
			topY = p32.y;
			}
			
		//вырез для нахлеста на верхнее перекрытие
		if (par.hasTopOverlap) {
			var p31 = polar(p3, par.angleTop, par.extraLengthOverlap);
			var p41 = newPoint_xy(p3, 0, -par.overlapCutHeight);
			var p32 = itercection(p41, polar(p41, 0, 100), p31, polar(p31, Math.PI / 2, 100));
			topY = p31.y;
		}
	
		var shape = new THREE.Shape();
	
		//начинаем с 4 точки
		if(par.botCutHeight == 0){
			addLine(shape, par.dxfArr, p4, p1, par.dxfBasePoint);
			addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
			}
		if(par.botCutHeight != 0){
			addLine(shape, par.dxfArr, p4, p11, par.dxfBasePoint);
			addLine(shape, par.dxfArr, p11, p12, par.dxfBasePoint);
			addLine(shape, par.dxfArr, p12, p2, par.dxfBasePoint);
			}
	
		//начинаем с 2 точки
		//начинаем с 2 точки
		if (par.hasTopOverlap) {
			addLine(shape, par.dxfArr, p2, p31, par.dxfBasePoint);
			addLine(shape, par.dxfArr, p31, p32, par.dxfBasePoint);
			addLine(shape, par.dxfArr, p32, p41, par.dxfBasePoint);
			addLine(shape, par.dxfArr, p41, p4, par.dxfBasePoint);
		}
		else {
			if(par.topCutHeight == 0){
				addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
				addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint);
			}
			if(par.topCutHeight != 0){
				addLine(shape, par.dxfArr, p2, p31, par.dxfBasePoint);
				addLine(shape, par.dxfArr, p31, p32, par.dxfBasePoint);
				addLine(shape, par.dxfArr, p32, p4, par.dxfBasePoint);
			}
		}
	
	
		//длина стекла справа (для расчета длины слева следующего стекла)
		par.heightRight = p3.y - p4.y;
	
		//базовые точки для поручней
		par.p1 = copyPoint(p2);
		par.p2 = copyPoint(p3);
	
		//отверстия стекла
		for(var i = 0; i < par.holes.length; ++i){
			addRoundHole(shape, dxfPrimitivesArr, par.holes[i], par.holes[i].rad, par.dxfBasePoint);

			var rutel = drawGlassRutel();
			rutel.rotation.x = Math.PI / 2;
			if(par.key == 'in') rutel.rotation.x *= -1;
			rutel.rotation.x *= turnFactor;
			
			rutel.position.x = par.holes[i].x;
			rutel.position.y = par.holes[i].y;
			rutel.position.z = 125 / 2 - 2;
			if(par.key == 'in') rutel.position.z = -125 / 2 + 2;
			if (par.key == 'in' && turnFactor == 1) rutel.position.z += par.thk;
			if (par.key == 'out' && turnFactor == -1) rutel.position.z -= par.thk;
			rutel.position.z *= turnFactor;

			if(!testingMode) par.mesh.add(rutel);
		}
	
	
		if (!shape.drawing) shape.drawing = {};
		shape.drawing.group = 'glass';
		shape.drawing.keyPoints = {topP1: p2, topP2: p3, botP1: p4, botP2: p1};
		if (p11) {
			shape.drawing.keyPoints.botP2 = p11;
			shape.drawing.keyPoints.botP3 = p12;
		}
		shapesList.push(shape);
	
		var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var glass = new THREE.Mesh(geometry, glassMaterial);
	
		par.mesh.add(glass);
	
		//сохраняем данные для спецификации
		var glassHeight2 = topY - botY;
		var partName = "glasses";
		if(typeof specObj !='undefined'){
			if(!specObj[partName]){
				specObj[partName] = {
					types: {},
					amt: 0,
					sumArea: 0,
					area: 0,
					name: "Стекло",
					metalPaint: false,
					timberPaint: false,
					division: "stock_2",
					workUnitName: "amt", //единица измерения
					}
				}
			var name = Math.round(par.width) + "x" + Math.round(glassHeight2);
			var area = Math.round(par.width * glassHeight2 / 10000)/100;
			if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
			if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
			specObj[partName]["amt"] += 1;
			specObj[partName]["area"] += area;
			specObj[partName]["sumArea"] += area;
		}
		par.mesh.specId = partName + name;
	
		return par;
	} //end of drawGlass_ko

	/**функция определяет из массива стоек racks начальную и конечную стойки марша и площадок,
		и задает длину стоек
		*/
		
	function setRacksParams(par) {
		//параметры марша
		var marshPar = getMarshParams(par.marshId);
		var prevMarshPar = getMarshParams(marshPar.prevMarshId);
		var nextMarshPar = getMarshParams(marshPar.nextMarshId);
		par.a = marshPar.a;
		par.b = marshPar.b;
		par.h = marshPar.h;
		par.stairAmt = marshPar.stairAmt;
	
		//рассчитываем необходимые параметры и добавляем в объект par
		setRailingParams(par) //функция в файле calcRailingParams.js

		//костыль для верхней площадки лт лестницы сдвигаем стойки заднего ограждения, что бы совпали отверстия 
		if (params.model == "лт" && params.railingModel == "Кованые балясины" && par.isPlatform && par.marshId == "topPlt") {
			par.racks[0].x -= 5;
			par.racks[par.racks.length - 1].x -= 5;
		}
		
	
		var racks = par.racks;
		var parRacks = {};

		//костыль для второго марша сдвигаем стойки
		if (params.stairModel == "Прямая горка") {
			for (var i = 0; i < racks.length; i++) {
				if (racks[i + 1]) {
					if (racks[i].x > racks[i + 1].x) {
						racks[i].x += 10;
					}
				}
			}
		}
	
		//сортируем массив points в порядке возрастания координаты x
		racks.sort(function (a, b) {
			return a.x - b.x;
		});

		//если все стойки находятся на площадке
		if (racks[0].y == racks[racks.length - 1].y && params.stairModel !== 'Прямая горка') {
			par.isRearPRailing = true;
		}
	
		//определяем крайние стойки снизу
		if (par.botEnd != "нет") {
			parRacks.botFirst = racks[0];
			parRacks.botLast = racks[1];
	
			//ищем стойки на той же высоте но дальше по Х
			for(var i = 0; i<racks.length; i++){
				if (!racks[i]) continue;
				if(racks[i].y == parRacks.botLast.y && racks[i].x > parRacks.botLast.x){
					parRacks.botLast = racks[i];
					}
				}
		}
		if(params.stairModel == "Прямая с промежуточной площадкой" && par.marshId != "topPlt"){
			var botFirst = {};
			var botLast = {};
			for(var i = 0; i < racks.length - 1; i++){
				if (!botFirst.x && racks[i].y == racks[i+1].y) {
					botFirst = racks[i];
				}
				if(racks[i].y == botFirst.y) botLast = racks[i];
				if(racks[i + 1].y == botFirst.y) botLast = racks[i + 1];
			}
			parRacks.botFirst = botFirst;
			parRacks.botLast = botLast;
		}
	
		//определяем крайние точки сверху
		if (par.topEnd !== "нет") {
			parRacks.topLast = racks[racks.length - 1];
			parRacks.topFirst = racks[racks.length - 2];
			//ищем стойки на той же высоте но ближе по Х
			for(var i = racks.length - 1; i>0; i--){
				if(racks[i].y == parRacks.topFirst.y && racks[i].x < parRacks.topFirst.x){
					parRacks.topFirst = racks[i];
					}
				if(racks[i].y == parRacks.topLast.y && racks[i].x > parRacks.topLast.x){
					parRacks.topLast = racks[i];
					}
				}
			}
	
		//определяем крайние стойки марша
		parRacks.marshFirst = racks[0];
		if (par.botEnd != "нет") parRacks.marshFirst = parRacks.botLast;
		parRacks.marshLast = racks[racks.length - 1];
		if (par.topEnd != "нет" && racks.length > 2) parRacks.marshLast = parRacks.topFirst;
	
		if(params.stairModel == "Прямая горка"){
			var topFirst = {};
			for(var i=0; i < racks.length; i++){
				if(!topFirst.x && racks[i].y == racks[i+1].y) {
					topFirst = racks[i];
				}
				if(racks[i].y == topFirst.y) parRacks.topLast = racks[i];
			}
			parRacks.marshLast = topFirst;
			parRacks.topFirst = topFirst;
	
			parRacks.marsh2First = parRacks.topLast;
			parRacks.marsh2First.x += 10;
			parRacks.marsh2Last = racks[racks.length-1];		
		}
	
		//определяем крайние стойки марша
		parRacks.marshFirst = racks[0];
		if (par.botEnd != "нет") parRacks.marshFirst = parRacks.botLast;
		parRacks.marshLast = racks[racks.length - 1];
		if (par.topEnd != "нет" && racks.length > 2) parRacks.marshLast = parRacks.topFirst;

		
		//рассчитываем длины и углы верхнего и нижнего участков
		if (params.stairModel == "П-образная трехмаршевая" && par.marshId == 2 && par.stairAmt == 0 && par.key == "out") {
			parRacks.angBot = calcAngleX1(parRacks.botFirst, parRacks.botLast);
			parRacks.botLen = distance(parRacks.botFirst, parRacks.botLast);

			parRacks.angTop = calcAngleX1(parRacks.topFirst, parRacks.topLast);
			parRacks.topLen = distance(parRacks.topFirst, parRacks.topLast);
		} 
	
		if ((par.botEnd !== "нет" && par.stairAmt > 0) || (par.botEnd == "площадка" && par.topEnd == "площадка")) {
					parRacks.angBot = calcAngleX1(parRacks.botFirst, parRacks.botLast);
					parRacks.botLen = distance(parRacks.botFirst, parRacks.botLast);
			}
		if ((par.topEnd !== "нет" && par.stairAmt > 0) || par.topEnd == "площадка") {
					parRacks.angTop = calcAngleX1(parRacks.topFirst, parRacks.topLast);
					parRacks.topLen = distance(parRacks.topFirst, parRacks.topLast);
			}
	
		//задаем длину стоек
		var rackPlatformLength = par.rackLength + 50;
		for(var i=0; i<racks.length; i++){
			if (!racks[i]) continue;
			racks[i].len = par.rackLength;
			if (params.railingModel != "Кованые балясины"){
				if(par.botEnd == "площадка" && racks[i].x <= 0) racks[i].len = rackPlatformLength;
				if (params.stairModel == "Прямая с промежуточной площадкой" && par.marshId != "topPlt")
				{
					if (parRacks.botFirst.x < racks[i].x && parRacks.botLast.x > racks[i].x)
						racks[i].len = rackPlatformLength;
				}
	
				if(par.topEnd == "площадка" && racks[i].y == parRacks.topLast.y) racks[i].len = rackPlatformLength;
				if (par.topEnd == "площадка" && racks[i].x == parRacks.marshLast.x && racks.length > 2) racks[i].len = par.rackLength;
			}
			if (par.isPlatform) racks[i].len = rackPlatformLength;
			//if (marshPar.botTurn != "пол" && i == 0 && par.key == "in" && prevMarshPar.hasRailing.in) {
			if (racks[i].isTurnRack) {
				racks[i].len += setTurnRacksParams(par.marshId, par.key).rackLenAdd;
			}
		}
	
		//перенос первой стойки при наличии пригласительных ступеней
		if(par.marshId == 1 && params.startTreadAmt > params.railingStart){
	
			var frontOffset = 200; //отступ стойки от края ступени
			var stepWidth = staircasePartsParams.startTreadsParams[Number(params.railingStart) + 1].stepLeft;
			if(par.railingSide == "right") stepWidth = staircasePartsParams.startTreadsParams[Number(params.railingStart) + 1].stepRight;
			parRacks.marshFirst.x -= stepWidth - par.a;
			}
	
		//Удлинение и перенос последней стойки последнего марша
	
		var dyLastRack = 0;
		if (marshPar.lastMarsh && params.platformTop == "нет") dyLastRack = calcLastRackDeltaY();
		if (params.stairModel == "Прямая с промежуточной площадкой" && par.marshId != "topPlt") dyLastRack = calcLastRackDeltaY();
		
		if (params.railingModel != "Кованые балясины" && !par.isPlatform && dyLastRack) parRacks.marshLast.len = par.rackLength + dyLastRack;
	
		//удлиннение и перенос последней стойки перед забегом на ко
		if (params.model == "ко" && par.key == "in" && marshPar.topTurn == "забег"){
			parRacks.marshLast.len += calcLastRackDeltaY("wnd_ko", par.marshId);
		}

		if (params.calcType == 'bolz') {
			parRacks.marshLast.len = parRacks.marshFirst.len + dyLastRack;
			if (marshPar.topTurn == 'забег' && params.stairModel == "П-образная с забегом" && params.marshDist !== 0) {
				parRacks.marshLast.len -= marshPar.h_topWnd * 2;
			}
		}
		
		
		//Рассчитываем угол и длину марша
	
		var topPoint1 = newPoint_xy(parRacks.marshFirst, 0, parRacks.marshFirst.len);
		var topPoint2 = newPoint_xy(parRacks.marshLast, 0, parRacks.marshLast.len);
	
		parRacks.angMarsh = Math.atan(par.h / par.b);
		//if (par.topEnd == "площадка" && par.key == "out")
		//	parRacks.angMarsh = calcAngleX1(parRacks.marshFirst, parRacks.marshLast);
		if (par.stairAmt < 2 && par.key == "out") {
			parRacks.angMarsh = calcAngleX1(parRacks.marshFirst, parRacks.marshLast);
			if (parRacks.marshFirst.x == parRacks.marshLast.x && parRacks.marshFirst.y == parRacks.marshLast.y)
				parRacks.angMarsh = 0;
		}
	
	
		if (racks.length == 2){
			parRacks.angMarsh = angle(topPoint1, topPoint2);
			}
		
		//заднее ограждение забега
		if (par.isRearPRailing){
			parRacks = {};
			parRacks.marshFirst = racks[0];
			parRacks.marshLast = racks[racks.length - 1];
			parRacks.angMarsh = angle(parRacks.marshFirst, parRacks.marshLast);
			}
	
		if(par.isPlatform) parRacks.angMarsh = 0;
			parRacks.marshLen = distance(topPoint1, topPoint2);
	
	
		//задаем верхний угол стоек
		for(var i=0; i<racks.length; i++){
			if(!racks[i]) continue;
			racks[i].holderAng = parRacks.angMarsh;
			if (params.stairModel == 'Прямая с промежуточной площадкой' && par.marshId != "topPlt") racks[i].holderAng = getMarshParams(3).ang;
			if(racks[i].x < parRacks.marshFirst.x) racks[i].holderAng = parRacks.angBot;
			if(racks[i].x > parRacks.marshLast.x) racks[i].holderAng = parRacks.angTop;
			}
	
		if(par.botEnd == "площадка") parRacks.marshFirst.holderAng = parRacks.angBot;
	
		if(par.botEnd == "забег" && !par.isRearPRailing){
			var mFirst = polar(parRacks.marshFirst, parRacks.marshFirst.holderAng, -40);
			parRacks.botFirst.holderAng = calcAngleX1(parRacks.botFirst, mFirst);
		}
	
		if(par.topEnd == "забег" && !par.isRearPRailing){
			var mLast = polar(parRacks.marshLast, parRacks.marshLast.holderAng, 40);
			parRacks.topLast.holderAng = calcAngleX1(mLast, parRacks.topLast);
		}
	
		if(params.stairModel == "Прямая горка"){
			parRacks.angMarsh2 = -parRacks.angMarsh;
			for(var i=0; i<racks.length; i++){
				//задаем верхний угол и длину стоек второго марша
				if(parRacks.marsh2First && racks[i].x >= parRacks.marsh2First.x) {
					racks[i].holderAng = -parRacks.angMarsh;
					racks[i].len = par.rackLength;
					}
				}
			}
	
		if(params.stairModel == "Прямая с промежуточной площадкой" && par.marshId != "topPlt"){
	
			parRacks.angMarsh1 = Math.atan(params.h1 / params.b1);
			for(var i=0; i<racks.length; i++){
				if(!racks[i]) continue;
			//задаем верхний угол и длину стоек первого марша
				if(racks[i].x <= parRacks.botFirst.x) {
					racks[i].holderAng = parRacks.angMarsh1;
					racks[i].len = par.rackLength;
					}
				}
				parRacks.marsh1First = copyPoint(racks[0]);
				parRacks.marsh1First.len = par.rackLength;
				parRacks.marsh1First.holderAng = parRacks.angMarsh1;
	
				parRacks.botFirst = copyPoint(parRacks.botFirst)
				parRacks.botFirst.len = rackPlatformLength;
				parRacks.botFirst.holderAng = 0;
	
				//удлинняем первую стойку верхнего марша
				parRacks.marshFirst.len = rackPlatformLength;
	
				parRacks.angBot = 0;
				parRacks.angMarsh = Math.atan(params.h3 / params.b3);
	
			}
	
			//если все стойки находятся на площадке, делаем их одинаковой длины
			if (racks[0].y == racks[racks.length - 1].y) {
					for (var i = 0; i < racks.length; i++) {
							if (!racks[i]) continue;
							racks[i].len = rackPlatformLength;
					}
			}
	
			par.parRacks = parRacks;
	
			return par;
	}

