function drawTreads() {
	var treadsGroup = new THREE.Object3D();
    var risersGroup = new THREE.Object3D();
    var dxfBasePoint = { x: 0, y: 0, };
    var turnEnd = [];
    var allUnitsPos = {}; //массив позиций всех участков для использования в построении каркаса

    //выбор функции отрисовки забежных ступеней
    var drawWndTreads = drawWndTreadsMetal;
    if (params.calcType == "mono") drawWndTreads = drawWndTreadsMono;
    if (params.model == 'гнутый') drawWndTreads = drawWndTreadsCurve;
    if (params.calcType == "timber") drawWndTreads = drawWndTreadsTimber;
    if (params.calcType == "timber_stock") drawWndTreads = drawWndTreadsTimber_stock;
    if (params.calcType == "geometry") {
			if (params.staircaseType == "mono") drawWndTreads = drawWndTreadsMono;
			if (params.staircaseType == "timber") drawWndTreads = drawWndTreadsTimber;
			if (params.staircaseType == "timber_stock") drawWndTreads = drawWndTreadsTimber_stock;
    }


    //нижний марш
    var marshId = 1;

    var treadParams1 = {
        marshId: marshId,
        dxfBasePoint: dxfBasePoint,
    };

    var marshObj = drawMarshTreads2(treadParams1)
    var marshTreads = marshObj.treads;
    var marshRisers = marshObj.risers;
    marshTreads.marshId = 1;
	if (!(params.calcType == "mono" && params.stairType == 'лотки'))
		treadsGroup.add(marshTreads);
    risersGroup.add(marshRisers);


    var unitPos = calcMarshEndPoint(marshTreads.position, marshTreads.rotation.y, marshId);
    var lastMarshEnd = copyPoint(unitPos);
    lastMarshEnd.rot = 0;
    var startTreadsParams = marshObj.startTreadsParams;

    dxfBasePoint.x += 2000;

    if (params.stairModel != "Прямая") {

        //задаем функцию отрисовки площадки
        var pltDrawFunction = drawPlatform2;
        if (params.calcType == "timber") {
            pltDrawFunction = drawTimberPlt_G;
            if (params.stairModel == "П-образная с площадкой") pltDrawFunction = drawTimberPlt_P;
        }

        //первый поворот

        //сохраняем позицию и поворот
        allUnitsPos.turn1 = copyPoint(unitPos);
        allUnitsPos.turn1.rot = 0;
        var turnParams = calcTurnParams(1);

        var marshPar1 = getMarshParams(marshId);
        var turnType1 = marshPar1.topTurn;

        if (turnType1 == "площадка") {
            var pltPar = {
                len: params.M + calcTurnParams(marshId).topMarshOffsetX - (params.M - calcTreadLen()) / 2,
                width: calcTreadLen(),
                dxfBasePoint: dxfBasePoint,
                botMarshId: 1,
            }
            //если лотки или рифленая сталь ступень отрисовываем в функции отрисовки рамок drawFrames
            if (params.stairType == "лотки" || params.stairType == "рифленая сталь") {
                if (params.calcType != 'geometry') pltPar.isNotTread = true;
                //добавляем зазор в конце площадки
                if (params.calcType == 'geometry') pltPar.len -= 5;
            }
            if (params.calcType == 'vhod' && params.stairModel == "Г-образная с площадкой" && params.middlePltLength !== params.M) {
                pltPar.len = params.middlePltLength + calcTurnParams(marshId).topMarshOffsetX - (params.M - calcTreadLen()) / 2;
            }
            if (params.stairModel == "П-образная с площадкой") {
                pltPar.width = params.M * 2 + params.marshDist - (params.M - calcTreadLen());
                pltPar.len = params.platformLength_1 + params.nose;
                if (params.model == "лт") pltPar.len -= (params.M - calcTreadLen()) / 2;
                pltPar.isP = true; //является промежуточной площадкой П-образной				
            }
            //коррекция ширины нижней площадки П-образной трехмаршевой с 0 ступеней в среднем марше
            if (params.stairModel == "П-образная трехмаршевая" && params.stairAmt2 == 0) {
                pltPar.plusMarshDist = true;
                pltPar.width += params.marshDist;
                if (params.model == "ко") pltPar.width -= 5;
            }
            if (params.stairModel == 'Прямая с промежуточной площадкой' || params.stairModel == 'Прямая горка') {
                //FIX IT заменить 19 на рассчитанную величину.
                pltPar.len = params.middlePltLength + calcTurnParams(marshId).topStepDelta;
                if (params.stairModel == 'Прямая горка') pltPar.len = params.middlePltLength - 5;
                // pltPar.isP = true;
			}


            //для деревянных из pltPar используются только параметры botMarshId и dxfBasePoint, размеры площадки считаются внутри
            pltPar = pltDrawFunction(pltPar);

            var platform = pltPar.treads;
            var platformRiser = pltPar.risers;
            platform.marshId = 1;
            if (params.stairModel == "П-образная с площадкой") platform.marshId = 2;
            platform.isTurn = true;
            platform.position.x = platformRiser.position.x = unitPos.x;
            platform.position.y = platformRiser.position.y = unitPos.y;
            platform.position.z = platformRiser.position.z = unitPos.z;

            treadsGroup.add(platform);
            risersGroup.add(platformRiser);
            unitPos = calcTurnEndPoint(platform.position, platform.rotation.y, marshId, pltPar.plusMarshDist);
            if (params.calcType == 'vhod' && params.middlePltWidth !== params.M && params.stairModel !== 'Прямая горка') {
                var pltPar = {
                    len: (params.middlePltWidth - params.M) - 3,// + calcTurnParams(marshId).topMarshOffsetX - (params.M - calcTreadLen()) / 2,
                    width: calcTreadLen(),
                    dxfBasePoint: dxfBasePoint,
                    botMarshId: 1,
                }
                if (params.stairModel == 'Прямая с промежуточной площадкой') {
                    pltPar.width = (params.middlePltWidth - params.M) - 3;
                    pltPar.len = params.middlePltLength + calcTurnParams(marshId).topStepDelta;
                }

                pltPar = pltDrawFunction(pltPar);

                var platform = pltPar.treads;
                platform.marshId = 1;
                platform.isTurn = true;
                var platformRiser = pltPar.risers;
                var turnZ = pltPar.width - calcTurnParams(marshId).topMarshOffsetX - params.stringerThickness + 3;
                var unitPosTmp = unitPos;
                if (params.stairModel == 'Г-образная с площадкой') {
                    turnZ = pltPar.len - calcTurnParams(marshId).topMarshOffsetX - params.stringerThickness + 3;
                }
                if (params.stairModel == 'Прямая с промежуточной площадкой') {
                    unitPosTmp = allUnitsPos.turn1;
                    turnZ = pltPar.width + params.stringerThickness + 3 + 3;
                }
                turnZ *= turnFactor;
                platform.position.x = platformRiser.position.x = unitPosTmp.x;
                platform.position.y = platformRiser.position.y = unitPosTmp.y;
                platform.rotation.y = platformRiser.rotation.y = unitPosTmp.rot;
                platform.position.z = platformRiser.position.z = unitPosTmp.z - turnZ;
				if (!(params.calcType == "mono" && params.stairType == 'лотки'))
					treadsGroup.add(platform);
                risersGroup.add(platformRiser);
            }
            dxfBasePoint.x += pltPar.width + 1000;
        }
        if (turnType1 == "забег") {

            var wndPar = {
                turnId: 1,
                botMarshId: 1,
                dxfBasePoint: dxfBasePoint,
            };
            if (params.stairModel == "П-образная трехмаршевая" && params.stairAmt2 == 0) {
                wndPar.plusMarshDist = true; //необходимо учесть зазор между маршами в ширине последней ступени
            }
            if (params.stairModel == "П-образная с забегом") {
                wndPar.plusMarshDist = true;
            }

            //отрисовываем блок забежных ступеней
            var wndObj = drawWndTreads(wndPar);
            var wndTreads = wndObj.treads; //функция в файле drawTreads.js;
            var wndRisers = wndObj.risers;
            if (wndObj.params) wndPar.params = wndObj.params;
            wndTreads.position.x = wndRisers.position.x = unitPos.x;
            wndTreads.position.y = wndRisers.position.y = unitPos.y;
            wndTreads.position.z = wndRisers.position.z = unitPos.z;
            wndTreads.marshId = 1;
            wndTreads.isTurn = true;
			if (!(params.calcType == "mono" && params.stairType == 'лотки'))
				treadsGroup.add(wndTreads);
            risersGroup.add(wndRisers);

            var unitPos = calcTurnEndPoint(wndTreads.position, wndTreads.rotation.y, marshId, wndPar.plusMarshDist, wndPar.turnId);
            dxfBasePoint.x += 6000;
        }

        turnEnd[1] = copyPoint(unitPos);

        //второй марш

        if (params.stairModel == "П-образная трехмаршевая") {
            var marsh2BasePoint = copyPoint(unitPos);
            marshId = 2;

            //сохраняем позицию и поворот
            allUnitsPos.marsh2 = copyPoint(unitPos);
            allUnitsPos.marsh2.rot = unitPos.rot;

            var treadParams2 = {
                marshId: marshId,
                dxfBasePoint: dxfBasePoint,
            };

            var marshObj = drawMarshTreads2(treadParams2)
            var marshTreads = marshObj.treads;
            var marshRisers = marshObj.risers;
            marshTreads.rotation.y = marshRisers.rotation.y = unitPos.rot;
            marshTreads.position.x = marshRisers.position.x = unitPos.x;
            marshTreads.position.y = marshRisers.position.y = unitPos.y;
            marshTreads.position.z = marshRisers.position.z = unitPos.z;
            marshTreads.marshId = 2;
			if (!(params.calcType == "mono" && params.stairType == 'лотки'))
				treadsGroup.add(marshTreads);
            risersGroup.add(marshRisers);

            var unitPos = calcMarshEndPoint(marshTreads.position, marshTreads.rotation.y, marshId);
            dxfBasePoint.x += 2000;
        }

        //второй поворот
  //      var isTurn2 = false;
		//if (params.calcType !== 'curve' && params.stairModel == "П-образная с забегом") isTurn2 = true;
  //      if (params.stairModel == "П-образная трехмаршевая") {
	 //       isTurn2 = true;
		//	if (params.calcType == 'curve' && params.stairAmt2 == 0) isTurn2 = false;
  //      }
		if (params.stairModel == "П-образная с забегом" || params.stairModel == "П-образная трехмаршевая") {
            var marshPar2 = getMarshParams(marshId);
            var turnType2 = marshPar2.topTurn;

            //сохраняем позицию и поворот
            allUnitsPos.turn2 = copyPoint(unitPos);
            allUnitsPos.turn2.rot = unitPos.rot;

            if (turnType2 == "площадка") {
                var pltPar = {
                    len: params.M + calcTurnParams(marshId).topMarshOffsetX - (params.M - calcTreadLen()) / 2,
                    width: calcTreadLen(),
                    dxfBasePoint: dxfBasePoint,
                    botMarshId: 2,
                };
                //если лотки или рифленая сталь ступень отрисовываем в функции отрисовки рамок drawFrames
                if (params.stairType == "лотки" || params.stairType == "рифленая сталь") {
                    if (params.calcType != 'geometry') pltPar.isNotTread = true;
                    //добавляем зазор в конце площадки
                    if (params.calcType == 'geometry') pltPar.len -= 5;
                }
                //для деревянных из pltPar используются только параметры botMarshId и dxfBasePoint, размеры площадки считаются внутри
                pltPar = pltDrawFunction(pltPar);

                var platform = pltPar.treads;
                platform.marshId = 2;
                platform.isTurn = true;
                var platformRiser = pltPar.risers;
                platform.rotation.y = platformRiser.rotation.y = unitPos.rot;
                platform.position.x = platformRiser.position.x = unitPos.x;
                platform.position.y = platformRiser.position.y = unitPos.y;
                platform.position.z = platformRiser.position.z = unitPos.z;
				if (!(params.calcType == "mono" && params.stairType == 'лотки'))
					treadsGroup.add(platform);
                risersGroup.add(platformRiser);

                var unitPos = calcTurnEndPoint(platform.position, platform.rotation.y, marshId);

                turnEnd[2] = copyPoint(unitPos);
                dxfBasePoint.x += pltPar.width + 1000;
            }
            if (turnType2 == "забег" || params.stairModel == "П-образная с забегом") {
                var wndPar2 = {
                    turnId: 2,
                    botMarshId: marshId,
                    dxfBasePoint: dxfBasePoint,
                };

                //отрисовываем блок забежных ступеней

                var wndObj = drawWndTreads(wndPar2);
                var wndTreads = wndObj.treads; //функция в файле drawTreads.js;
                var wndRisers = wndObj.risers;
                if (wndObj.params) wndPar2.params = wndObj.params;
                wndTreads.rotation.y = wndRisers.rotation.y = unitPos.rot;
                wndTreads.position.x = wndRisers.position.x = unitPos.x;
                wndTreads.position.y = wndRisers.position.y = unitPos.y;
                if (params.stairModel == "П-образная с забегом") {
                    wndTreads.position.y += params.h3;
                    wndRisers.position.y += params.h3;
                }
                wndTreads.position.z = wndRisers.position.z = unitPos.z;
                wndTreads.marshId = 2;
                wndTreads.isTurn = true;
				if (!(params.calcType == "mono" && params.stairType == 'лотки'))
					treadsGroup.add(wndTreads);
                risersGroup.add(wndRisers);
                var unitPos = calcTurnEndPoint(wndTreads.position, wndTreads.rotation.y, marshId, false, wndPar2.turnId);
                dxfBasePoint.x += 6000;
            }
        }
        turnEnd[2] = copyPoint(unitPos);
        if (params.stairModel == "П-образная с забегом") turnEnd[1] = copyPoint(unitPos);

        //верхний марш

        marshId = 3;

        //сохраняем позицию и поворот
        allUnitsPos.marsh3 = copyPoint(unitPos);
        allUnitsPos.marsh3.rot = unitPos.rot;

        var treadParams3 = {
            marshId: marshId,
            dxfBasePoint: dxfBasePoint,
        };

        var marshObj = drawMarshTreads2(treadParams3);
        var marshTreads = marshObj.treads;
        var marshRisers = marshObj.risers;
        marshTreads.rotation.y = marshRisers.rotation.y = unitPos.rot;
        marshTreads.position.x = marshRisers.position.x = unitPos.x;
        marshTreads.position.y = marshRisers.position.y = unitPos.y;
        marshTreads.position.z = marshRisers.position.z = unitPos.z;
        marshTreads.marshId = 3;
		if (!(params.calcType == "mono" && params.stairType == 'лотки'))
			treadsGroup.add(marshTreads);
        risersGroup.add(marshRisers);

        lastMarshEnd = calcMarshEndPoint(marshTreads.position, marshTreads.rotation.y, marshId);
        dxfBasePoint.x += 2000;
    }

    //верхняя площадка
    if (params.platformTop == "площадка" || params.platformTop == 'увеличенная') {
        dxfBasePoint = newPoint_xy(dxfBasePoint, 1000, 0);

        if (params.model == "ко" && params.stairAmt3 == 0 && (turnType1 == "забег" || turnType2 == "забег")) {
            if (params.stairModel == "Г-образная с забегом")
                lastMarshEnd.z += params.lastWinderTreadWidth - 55; //55 - номинальная ширина ступени
            else
                lastMarshEnd.x -= (params.lastWinderTreadWidth - 55); //55 - номинальная ширина ступени
        }

        //сохраняем позицию и поворот
        allUnitsPos.topPlt = copyPoint(lastMarshEnd);
        allUnitsPos.topPlt.rot = lastMarshEnd.rot;

        var pltPar = {
            len: params.platformLength_3,
            width: calcTreadLen(),
            dxfBasePoint: dxfBasePoint,
            botMarshId: 3,
        };

        //учитываем наличие задней тетивы верхней площадки + 5мм зазор
        if ((params.model == "лт" || params.calcType == "vhod") && params.platformRearStringer == "есть") {
            pltPar.len -= 8 + 5;
        }

        //если лотки или рифленая сталь ступень отрисовываем в функции отрисовки рамок drawFrames
        if (params.stairType == "лотки" || params.stairType == "рифленая сталь") {
            if (params.calcType != 'geometry') pltPar.isNotTread = true;
            //добавляем зазор в конце площадки
            //if (params.calcType == 'geometry') pltPar.len -= 5;
        }
        if (params.stairModel == "Прямая") pltPar.botMarshId = 1;

        if (params.platformTop == 'увеличенная') {
            pltPar.width = params.platformWidth_3 - (params.M - calcTreadLen());
        }

        pltPar = drawPlatform2(pltPar);
        var platform = pltPar.treads;
        var risers = pltPar.risers;
        platform.rotation.y = risers.rotation.y = lastMarshEnd.rot;
        platform.position.x = risers.position.x = lastMarshEnd.x;
        platform.position.y = risers.position.y = lastMarshEnd.y;
        platform.position.z = risers.position.z = lastMarshEnd.z;
        if (params.platformTop == 'увеличенная') {
            if ((params.stairModel == 'Прямая' || params.stairModel == 'Прямая с промежуточной площадкой') && turnFactor == -1 && (params.stairType == 'дпк')) {
                platform.position.z -= (pltPar.width - params.M) / 2 + (params.M - calcTreadLen()) / 2;
                if (turnFactor == -1) {
                    platform.position.z = lastMarshEnd.z
                }
            }
            if (!(params.stairModel == 'Прямая' || params.stairModel == 'Прямая с промежуточной площадкой') && (params.stairModel == 'дпк')) {//Считаем положения
                platform.position.x += (pltPar.width - params.M) / 2 + (params.M - calcTreadLen()) / 2;//-pltPar.len / 2 * turnFactor - params.stringerThickness * 2;
                if (turnFactor == -1) {
                    platform.position.x -= (pltPar.width - params.M) / 2 + (params.M - calcTreadLen()) / 2;//-pltPar.len / 2 * turnFactor - params.stringerThickness * 2;
                    platform.position.z += 2;
                }
            }
        }
        platform.marshId = 3;
		if (!(params.calcType == "mono" && params.stairType == 'лотки'))
			treadsGroup.add(platform);
        risersGroup.add(risers);

    }

    //рассчитываем точку конца верхнего марша для привязки к перекрытию
    var topStepDelta = calcTurnParams(marshId).topStepDelta;

    if (params.platformTop == "площадка" || params.platformTop == 'увеличенная') topStepDelta = params.platformLength_3;

    lastMarshEnd.x += topStepDelta * Math.cos(lastMarshEnd.rot);
    lastMarshEnd.z += topStepDelta * Math.sin(-lastMarshEnd.rot);

    if (!params.treadPlatePockets) params.treadPlatePockets = 'нет';
	if (params.calcType == "mono" && (params.treadPlatePockets !== 'нет' || params.treadLigts !== 'нет')) {
		var pocketDepth = 10;

		treadsGroup.traverse(function(node){
			if (node instanceof THREE.Mesh) {
				//масштабируем по толщине
				node.scale.z = (params.treadThickness - pocketDepth) / params.treadThickness;				
				//выравниваем забежные ступени по высоте
				if (node.specId && node.specId.indexOf('wndTread') != -1) {					
					node.position.y += pocketDepth;
					//if (params.treadPlatePockets == 'нет') node.position.y += pocketDepth;
				}
				if (node.specId && params.treadPlatePockets == 'нет') {
					node.position.y += pocketDepth;
				}
			}
		})
		
	}
	
    //формируем возвращаемый объект
    var par = {
        treads: treadsGroup,
        risers: risersGroup,
        turnEnd: turnEnd,
        lastMarshEnd: lastMarshEnd,
        wndPar: wndPar,
        wndPar2: wndPar2,
        unitsPos: allUnitsPos,
        startTreadsParams: startTreadsParams,
    }

    return par;


} //end of drawTreads

function drawMarshTreads2(par) {
	/*
	par = {
		marshId
		dxfBasePoint
		}
	*/

	par.treads = new THREE.Object3D();
	par.risers = new THREE.Object3D();

	var techDelta = 0;
	if (params.calcType == 'timber' && testingMode) techDelta = 0.01;

	var hasTurnRack = false;
	if (params.railingModel == "Деревянные балясины" || params.railingModel == "Дерево с ковкой" || params.railingModel == "Стекло") {
		if (params.stairModel == 'Г-образная с забегом' || params.stairModel == 'Г-образная с площадкой') {
			hasTurnRack = getMarshParams(1).hasRailing.in || getMarshParams(3).hasRailing.in;
		}
		if (params.stairModel == 'П-образная трехмаршевая' && par.marshId == 2) {
			hasTurnRack = getMarshParams(1).hasRailing.in || getMarshParams(2).hasRailing.in;
		}
		if (params.stairModel == 'П-образная трехмаршевая' && par.marshId == 3) {
			hasTurnRack = getMarshParams(2).hasRailing.in || getMarshParams(3).hasRailing.in;
		}
		if ((params.stairModel == 'П-образная с забегом' || params.stairModel == 'П-образная с площадкой') && par.marshId == 3) {
			hasTurnRack = getMarshParams(3).hasRailing.in;
		}
	}

	//параметры марша
	var marshPar = getMarshParams(par.marshId);
	var turnParams = calcTurnParams(marshPar.prevMarshId);

	par.a = marshPar.a;
	par.b = marshPar.b;
	par.h = marshPar.h;
	par.stairAmt = marshPar.stairAmt;
	//сохраняем позицию последней ступени
	par.endPos = {
		x: 0,
		y: par.h,
	};

	par.treadLen = calcTreadLen();

	if (par.stairAmt > 0) {
		//расчет длины ступеней

		var plateParams = {
			len: par.treadLen,
			width: par.a,
			dxfBasePoint: par.dxfBasePoint,
			dxfArr: dxfPrimitivesArr,
			thk: params.treadThickness - techDelta * 2,
			material: params.materials.tread,
			partName: "tread"
		};

		getTreadLigtsParams(plateParams) //параметры подсветки ступеней

		//коррекция толщины
		if (params.stairType == "лотки" || params.stairType == "рифленая сталь") plateParams.thk = 4;
		if (params.stairType == "лотки") plateParams.width -= plateParams.thk * 2 + 0.1;
		//if (params.calcType == "mono" && params.treadPlatePockets !== "нет") {
		//	plateParams.thkFull = plateParams.thk;
		//	plateParams.thk -= 10;
		//}
		// if (params.calcType == "timber") plateParams.thk -= 0.02;
		if (params.stairType == 'лотки') {
			// рассчитываем параметры рамки
			var parFrame = {}
			calcFrameParams(parFrame);
			plateParams.thkFull = plateParams.thk + parFrame.profHeight;
		}
		//пригласительные ступени
		par.startTreadsParams = [];
		if (params.startTreadAmt > 0 && par.marshId == 1) {
			var startTreadsObj = drawStartUnit();
			startTreadsObj.treads.position.z = -params.M / 2 * turnFactor;
			startTreadsObj.risers.position.z = -params.M / 2 * turnFactor;
			par.treads.add(startTreadsObj.treads);
			par.risers.add(startTreadsObj.risers);
			//добавляем размеры в возвращаемый объект
			par.startTreadsParams = startTreadsObj.dim;
		}

		//цикл построения ступеней
		var startIndex = 0;
		if (params.startTreadAmt > 0 && par.marshId == 1) startIndex = params.startTreadAmt;

		var posZ = 0;
		for (var i = startIndex; i < par.stairAmt; i++) {
			plateParams.modifyKey = 'tread:' + par.marshId + ':' + i;
			//коррекция длины
			if (params.stairType == 'лотки' && params.calcType !== "mono") {
				// длина ступени уменьшаеться если ступень попадает на фланец разделения тетив
				var divide = ltko_set_divide(par.marshId).divide;
				if (i == divide - 1) plateParams.len = par.treadLen - 8 * 2;
				else plateParams.len = par.treadLen;
			}
			var addToDxf = true;
			if (params.calcType == "timber" || params.calcType == "timber_stock") {
				par.notches = calcMarshNotches(par.marshId);
				plateParams.notches = {
					botIn: { x: 0, y: 0 },
					botOut: { x: 0, y: 0 },
					topIn: { x: 0, y: 0 },
					topOut: { x: 0, y: 0 },
				};
			}
			var drawRectTread = true; //отрисовываем обыкновенную прямогуольную ступень на этой итерации

			var railingStartIndex = startIndex;
			if (par.marshId == 1) {
				railingStartIndex += (params.railingStart + 1);
				if (params.startTreadAmt) railingStartIndex -= params.startTreadAmt;
			}
			//нестандартная первая ступень
			if (par.stairAmt > 1 && railingStartIndex !== par.stairAmt - 1) {
				plateParams.dxfArr = dxfPrimitivesArr;
				if (i == startIndex && params.calcType == "mono" && hasTurnRack && par.marshId > 1 && getMarshParams(par.marshId).botTurn == 'забег') {
					plateParams.notches = {
						botIn: { x: 0, y: 0 },
						botOut: { x: 0, y: 0 },
						topIn: { x: 0, y: 0 },
						topOut: { x: 0, y: 0 },
					};
					plateParams.width -= 5;

					var tread = drawNotchedPlate(plateParams).mesh;
					tread.rotation.x = Math.PI / 2;
					tread.position.x = par.b * startIndex + 5;
					tread.position.y = par.h * (startIndex + 1) - techDelta;
					tread.position.z = - plateParams.len / 2;
					drawRectTread = false;
				}

				if (i == startIndex && (params.calcType == "metal" || params.calcType == "mono") && hasTurnRack && par.marshId > 1 && getMarshParams(par.marshId).botTurn == 'площадка') {
					plateParams.notches = {
						botIn: { x: 0, y: 0 },
						botOut: { x: 0, y: 0 },
						topIn: { x: 0, y: 0 },
						topOut: { x: 0, y: 0 },
					};
					plateParams.notches.hasNothes = true;
					plateParams.notches.botIn = {
						x: params.nose, y: 95 + 0.01
					};
					//выводим в dxf только одну ступень
					plateParams.dxfArr = dxfPrimitivesArr;
					if (i > startIndex && plateParams.width == par.a) plateParams.dxfArr = [];

					var tread = drawNotchedPlate(plateParams).mesh;
					tread.rotation.x = Math.PI / 2;
					tread.position.x = par.b * startIndex;
					tread.position.y = par.h * (startIndex + 1) - techDelta;
					tread.position.z = - plateParams.len / 2;
					drawRectTread = false;
				}

				if (i == railingStartIndex && (params.calcType == "timber" || params.calcType == "timber_stock" && marshPar.hasRailing.in)) {
					if (par.notches.botIn.x != 0 && par.notches.botIn.y != 0) {
						plateParams.notches.hasNothes = true;
						plateParams.notches.botIn = copyPoint(par.notches.botIn);
					}

					if (par.notches.botOut.x != 0 && par.notches.botOut.y != 0) {
						plateParams.notches.hasNothes = true;
						plateParams.notches.botOut = copyPoint(par.notches.botOut);
					}
					var tread = drawNotchedPlate(plateParams).mesh;
					tread.rotation.x = Math.PI / 2;
					tread.position.x = par.b * railingStartIndex;
					tread.position.y = par.h * (railingStartIndex + 1) - techDelta;
					tread.position.z = - plateParams.len / 2;
					drawRectTread = false;
				}
			}

			//нестандартная последняя ступень
			if (i == par.stairAmt - 1 && par.stairAmt > 1) {
				plateParams.dxfArr = dxfPrimitivesArr;
				if (params.calcType == "timber") {
					plateParams.dxfBasePoint = newPoint_xy(plateParams.dxfBasePoint, plateParams.width + 100, 0);
					plateParams.dxfArr = dxfPrimitivesArr;
					plateParams.notches.botIn = { x: 0, y: 0 };
					plateParams.notches.botOut = { x: 0, y: 0 };

					//Корректировка если осталась одна ступень на марше, чтобы отрисовались отверстия и в начале и в конце ступени
					if (railingStartIndex == par.stairAmt - 1) {
						if (par.notches.botIn.x != 0 && par.notches.botIn.y != 0) {
							plateParams.notches.hasNothes = true;
							plateParams.notches.botIn = copyPoint(par.notches.botIn);
						}

						if (par.notches.botOut.x != 0 && par.notches.botOut.y != 0) {
							plateParams.notches.hasNothes = true;
							plateParams.notches.botOut = copyPoint(par.notches.botOut);
						}
					}

					if (par.notches.topIn.x != 0 && par.notches.topIn.y != 0) {
						plateParams.notches.hasNothes = true;
						plateParams.notches.topIn = copyPoint(par.notches.topIn);
					}
					if (par.notches.topOut.x != 0 && par.notches.topOut.y != 0) {
						plateParams.notches.hasNothes = true;
						plateParams.notches.topOut = copyPoint(par.notches.topOut);
					}
					var tread = drawNotchedPlate(plateParams).mesh;
					tread.rotation.x = Math.PI / 2;
					tread.position.x = par.b * (par.stairAmt - 1);
					tread.position.y = par.h * par.stairAmt - techDelta;
					tread.position.z = - plateParams.len / 2;
					drawRectTread = false;
				}

				if (params.model == "лт" && params.topAnglePosition == "вертикальная рамка" && marshPar.lastMarsh) {
					plateParams.width = par.b + 40 - params.riserThickness;
					//если расчетная ширина отличается незначительно, делаем все ступени одинаковыми
					if(plateParams.width - par.a < 3 && plateParams.width - par.a > 0) plateParams.width = par.a;
				}
				
				if (params.calcType == "mono" && marshPar.lastMarsh) {
					if (params.lastRiser !== "есть" && params.topAnglePosition == "над ступенью") {
						var notchWidth = 300 + 2;
						if (params.model == "сварной" || params.model == "гнутый") notchWidth = params.stringerThickness + 110 + 2;
						var depth = 10;
						var riserSideOffset = (plateParams.len - notchWidth) / 2;
						plateParams.width = par.a - depth;
						plateParams.widthFull = par.a;
						plateParams.notches = {
							hasNothes: true,
							botIn: { x: 0, y: 0 },
							botOut: { x: 0, y: 0 },
							topIn: { x: -depth, y: riserSideOffset }, //отрицательный вырез это выступ
							topOut: { x: -depth, y: riserSideOffset },
						}
						drawRectTread = false;
					}
					if (params.lastRiser == "есть") {
						var riserSideOffset = 20;
						plateParams.width = par.a - params.riserThickness;
						plateParams.widthFull = par.a;
						plateParams.notches = {
							hasNothes: true,
							botIn: { x: 0, y: 0 },
							botOut: { x: 0, y: 0 },
							topIn: { x: -params.riserThickness, y: riserSideOffset }, //отрицательный вырез это выступ
							topOut: { x: -params.riserThickness, y: riserSideOffset },
						}
						drawRectTread = false;
					}
					if (!drawRectTread) {
						plateParams.dxfBasePoint = newPoint_xy(plateParams.dxfBasePoint, plateParams.width + 100, 0);
						plateParams.dxfArr = dxfPrimitivesArr;

						var tread = drawNotchedPlate(plateParams).mesh;
						tread.rotation.x = Math.PI / 2;
						tread.position.x = par.b * (par.stairAmt - 1);
						tread.position.y = par.h * par.stairAmt - techDelta;
						tread.position.z = - plateParams.len / 2;
					}
					
				}
				

			}

			if (par.stairAmt == 1) {
				par.notches = calcMarshNotches(par.marshId);
				plateParams.notches = {
					botIn: { x: 0, y: 0 },
					botOut: { x: 0, y: 0 },
					topIn: { x: 0, y: 0 },
					topOut: { x: 0, y: 0 },
				};
				if (params.calcType == "mono" && hasTurnRack && par.marshId > 1 && getMarshParams(par.marshId).botTurn == 'забег') {
					plateParams.width -= 5;
				}
				if ((params.calcType == "metal" || params.calcType == "mono") && hasTurnRack && par.marshId > 1 && getMarshParams(par.marshId).botTurn == 'площадка') {
					plateParams.notches.hasNothes = true;
					plateParams.notches.botIn = {
						x: params.nose, y: 95 + 0.01
					};
				}
				if (params.calcType == "timber") {
					plateParams.dxfBasePoint = newPoint_xy(plateParams.dxfBasePoint, plateParams.width + 100, 0);
					plateParams.dxfArr = dxfPrimitivesArr;

					if (par.notches.botIn.x != 0 && par.notches.botIn.y != 0) {
						plateParams.notches.hasNothes = true;
						plateParams.notches.botIn = copyPoint(par.notches.botIn);
					}
					// plateParams.notches.hasNothes = true;
					// plateParams.notches.botIn = {x:100,y:100};
					if (par.notches.botOut.x != 0 && par.notches.botOut.y != 0) {
						plateParams.notches.hasNothes = true;
						plateParams.notches.botOut = copyPoint(par.notches.botOut);
					}
					if (par.notches.topIn.x != 0 && par.notches.topIn.y != 0) {
						plateParams.notches.hasNothes = true;
						plateParams.notches.topIn = copyPoint(par.notches.topIn);
					}
					if (par.notches.topOut.x != 0 && par.notches.topOut.y != 0) {
						plateParams.notches.hasNothes = true;
						plateParams.notches.topOut = copyPoint(par.notches.topOut);
					}
				}
				if (params.model == "лт" && params.topAnglePosition == "вертикальная рамка") {
					plateParams.width = par.b + 40 - params.riserThickness;
				}

				if (params.calcType == "mono" && marshPar.lastMarsh) {
					if (params.lastRiser !== "есть" && params.topAnglePosition == "над ступенью") {
						var notchWidth = 280;
						var depth = 10;
						var riserSideOffset = (plateParams.len - notchWidth) / 2;
						plateParams.width = par.a - depth;
						plateParams.widthFull = par.a;
						plateParams.notches = {
							hasNothes: true,
							botIn: { x: 0, y: 0 },
							botOut: { x: 0, y: 0 },
							topIn: { x: -depth, y: riserSideOffset }, //отрицательный вырез это выступ
							topOut: { x: -depth, y: riserSideOffset },
						}
					}
					if (params.lastRiser == "есть") {
						var riserSideOffset = 20;
						plateParams.width = par.a - params.riserThickness;
						plateParams.widthFull = par.a;
						plateParams.notches = {
							hasNothes: true,
							botIn: { x: 0, y: 0 },
							botOut: { x: 0, y: 0 },
							topIn: { x: -params.riserThickness, y: riserSideOffset }, //отрицательный вырез это выступ
							topOut: { x: -params.riserThickness, y: riserSideOffset },
						}
					}
					plateParams.dxfBasePoint = newPoint_xy(plateParams.dxfBasePoint, plateParams.width + 100, 0);
					plateParams.dxfArr = dxfPrimitivesArr;
				}


				var tread = drawNotchedPlate(plateParams).mesh;
				tread.rotation.x = Math.PI / 2;
				tread.position.x = par.b * (par.stairAmt - 1);
				tread.position.y = par.h * par.stairAmt - techDelta;
				if (params.stairType == 'лотки') {
					// рассчитываем параметры рамки
					var parFrame = { marshId: par.marshId }
					calcFrameParams(parFrame);
					tread.position.y -= parFrame.profHeight + plateParams.thk;
				}
				tread.position.z = - plateParams.len / 2;
				drawRectTread = false;
			}
			//стандартная ступень

			if (drawRectTread) {
				if (params.stairType == 'дпк' || params.stairType == "лиственница тер.") {
					var tread = new THREE.Object3D();//Объеъкт ступеньки
					plateParams.partName = "dpc";
					plateParams.dxfArr = [];

					//Считаем количество досок на ступень
					var deckAmt = Math.round((par.a - params.dpcDst) / (params.dpcWidth + params.dpcDst));

					//Задаем ширину доски для отрисовки
					plateParams.width = params.dpcWidth;

					for (var j = 0; j < deckAmt; j++) {//Рисуем доски
						var treadPlank = drawPlate(plateParams).mesh;//Меш
						treadPlank.position.y = (params.dpcWidth + params.dpcDst) * (j - deckAmt + 1)// - (params.dpcWidth + params.dpcDst);//Задаем положения досок
						tread.add(treadPlank);//Добавляем доски в объект
					}
					//plateParams.width = par.a;//Возвращаем всё на место
				}
				else {
					//выводим в dxf только одну ступень
					plateParams.dxfArr = dxfPrimitivesArr;
					if (i > startIndex && plateParams.width == par.a) {
						plateParams.dxfArr = [];
						addToDxf = false;
					}

					var tread = drawPlate(plateParams).mesh;//Стандартная отрисовка
				}
				tread.rotation.set(Math.PI * 0.5, 0, Math.PI * 0.5);
				tread.position.x = par.b * i + plateParams.width;
				tread.position.y = par.h * (i + 1) - techDelta;
				if (params.stairType == 'лотки') {
					// рассчитываем параметры рамки
					var parFrame = {marshId: par.marshId}
					calcFrameParams(parFrame);
					tread.position.y -= parFrame.profHeight + plateParams.thk;
					tread.position.x += plateParams.thk + 0.05;
					
				}
				tread.position.z = - plateParams.len / 2;
			}
			

			if (params.model == "тетива+косоур") tread.position.z += (params.stringerThickness - params.stringerSlotsDepth) / 2 * turnFactor;
			if (params.calcType == 'bolz') tread.position.z += (params.M - plateParams.len) / 2 * turnFactor;
			/*if (params.model == "ко" && params.riserType == "есть" && par.marshId > 1){
						tread.position.x -= params.riserThickness;
						}
			*/
			//коррекция чтобы не было пересечений
			if (params.calcType != "timber") {
				tread.position.y += 0.01;
				tread.position.x -= 0.01;
			}
			if (params.calcType == "timber") {
				// tread.position.y -= 0.01;
				//tread.position.x -= 0.01;
			}
			if (tread instanceof THREE.Mesh) {
				if (!tread.userData) tread.userData = {};
				tread.userData.marshId = par.marshId;
				tread.userData.treadIndex = i;
			}

			par.treads.add(tread);

			/*подступенки марша*/

			// для всех ступеней кроме последней
			if (params.riserType == "есть") {
				var riserPar = {
					len: plateParams.len,
					width: par.h - techDelta * 2,
					thk: params.riserThickness,
					dxfArr: [],
					dxfBasePoint: newPoint_xy(par.dxfBasePoint, params.M + 200, 0),
					hasTopScrews: true,
					hasBotScrews: true
				};

				//коррекция размеров первого подступенка
				if (i == 0) {
					if (marshPar.botTurn == "пол") riserPar.width = par.h - params.treadThickness;	// первый подступенок на первом марше и первый после площадки ниже остальных на толщину ступени
					if (marshPar.botTurn != "пол" && params.calcType == "timber") {
						riserPar.len = calcNewellRiserLen();
					}
				}

				if (marshPar.botTurn == "пол") {
					if (i == 0) {
						riserPar.description = "Подступенок первой ступени"
						riserPar.count = 1
						riserPar.dxfArr = dxfPrimitivesArr;
						riserPar.hasBotScrews = false;
					}
					if (i == 1) {
						riserPar.description = "Подступенок марша"
						riserPar.count = par.stairAmt - 1
						riserPar.dxfBasePoint.x += par.h + 50
						riserPar.dxfArr = dxfPrimitivesArr
					}
				}else {
					if (i == 0) {
						riserPar.description = "Подступенок марша"
						riserPar.count = par.stairAmt
						riserPar.dxfArr = dxfPrimitivesArr
					}
				}



				//отрисовка
				riserPar.modifyKey = 'riser:' + par.marshId + ':' + i;
				riserPar = drawRectRiser(riserPar);
				riser = riserPar.mesh;

				riser.rotation.y = Math.PI / 2// * turnFactor;
				riser.rotation.x = Math.PI / 2;
				riser.position.x = tread.position.x - plateParams.width + params.nose + 0.01;
				if (!drawRectTread) riser.position.x += plateParams.width;
				riser.position.y = tread.position.y - (par.h + params.treadThickness) + techDelta * 1.5;
				if (i == 0 && marshPar.botTurn == "пол") riser.position.y = 0;
				riser.position.z = tread.position.z;
				if (i == 0 && marshPar.botTurn !== 'пол' && turnFactor == -1) riser.position.z += plateParams.len - calcNewellRiserLen();

				par.risers.add(riser);
			}

			if (addToDxf) {
				var text = "Ступени " + par.marshId + " марша";
				var textHeight = 25;
				var textBasePoint = newPoint_xy(par.dxfBasePoint, -20, -120);
				if (i == startIndex) addText(text, textHeight, plateParams.dxfArr, textBasePoint);
				plateParams.dxfBasePoint.y += par.a + 100;
			}

		}//end of for

		//сохраняем позицию последней ступени
		if (tread) {
			par.endPos = {
				x: tread.position.x + par.b,
				y: tread.position.y + par.h,
			}
		}
	}

	//накладка на перекрытие

	if (marshPar.lastMarsh && (params.topAnglePosition == "вертикальная рамка" || params.lastRiser == "есть")) {

		//рассчитываем размеры поворота, зависящие от модели лестницы
		var lastTreadWidth = setModelDimensions({ model: params.model, }).topStepDelta;
		var riserThk = params.riserThickness;
		var frameThk = 40;
		if(params.calcType != "metal"){
			frameThk = 0;
		}

		//ступень
		var posX = par.endPos.x;
		if (params.calcType != "timber_stock") {
			var plateParams = {
				len: par.treadLen,
				width: lastTreadWidth,
				dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, par.a + 50),
				dxfArr: dxfPrimitivesArr,
				thk: params.treadThickness,
				material: params.materials.tread,
				partName: "tread",
			};

			if (par.stairAmt == 0 && marshPar.botTurn == "площадка")
				plateParams.len += turnParams.topMarshOffsetX;

			var lastTread = drawPlate(plateParams).mesh;
			lastTread.rotation.set(Math.PI * 0.5, 0, Math.PI * 0.5);
			lastTread.position.x = par.endPos.x - par.b + params.riserThickness + frameThk;
			if(params.calcType == "mono") lastTread.position.x += par.a - params.riserThickness;
				
			if (par.stairAmt == 0) {
				lastTread.position.x = par.endPos.x + params.riserThickness + frameThk;
				var marshPar = getMarshParams(par.marshId);
				if (marshPar.botTurn == "забег") {
					lastTread.position.x += params.lastWinderTreadWidth;
					if (params.model == "ко") lastTread.position.x += -55 + params.nose;
				}
				if (marshPar.botTurn == "площадка") {
					lastTread.position.x -= turnParams.topMarshOffsetZ;
					lastTread.position.z += turnParams.topMarshOffsetX / 2;
				}
				if(params.calcType == "mono") lastTread.position.x -= params.riserThickness;
			}
			if (par.stairAmt == 1) {
				lastTread.position.x = par.endPos.x + 80;
				if (params.model == "ко"){
					lastTread.position.x = par.endPos.x + params.riserThickness + 90 - (50 - params.nose);
				}
				if(params.calcType == "mono") lastTread.position.x = par.endPos.x - par.b + par.a;
			}
			
			lastTread.position.y = par.endPos.y;
			lastTread.position.z += - plateParams.len / 2;
			par.treads.add(lastTread);
			posX = lastTread.position.x - 40;
		}

		//подступенок вертикальной рамки

		var plateParams = {
			len: par.treadLen,
			width: par.h - 1,
			dxfBasePoint: newPoint_xy(par.dxfBasePoint, params.M + 200 + par.h + 50, par.a + lastTreadWidth + 150),
			dxfArr: dxfPrimitivesArr,
			thk: params.riserThickness,
			material: params.materials.riser,
			partName: "riser",
			holes: [],
		};
		if (par.stairAmt == 0 && marshPar.botTurn == "площадка")
			plateParams.len += turnParams.topMarshOffsetX;
		if(params.calcType != "metal"){
			plateParams.width = par.h - params.treadThickness / 2;
			if(params.calcType == "mono") {
				if(typeof riserSideOffset == 'undefined') var riserSideOffset = 20;
				plateParams.len -= riserSideOffset * 2 + 2;
			}
			
			if (params.calcType == "timber_stock") {
				plateParams.width = par.h + 200;
				plateParams.thk = 40;
				posX = par.endPos.x - par.b + params.treadThickness;
				if (par.stairAmt < 2) {
					posX = par.endPos.x + params.nose + plateParams.thk;
				}
			}
		}

		var drawPlateRiser = drawPlate;
		if (params.topAnglePosition == "над ступенью") {
			drawPlateRiser = drawNotchRiser;
			plateParams.notchWidth = 280;
			if (params.calcType == "mono") plateParams.notchWidth = 315;
			plateParams.depth = 20;
		}

		var rad = 3;
		var c1 = { center: { x: 50, y: plateParams.width - 40 }, rad: rad }
		var c2 = { center: { x: plateParams.len - 50, y: plateParams.width - 40 }, rad: rad }
		plateParams.holes.push(c1, c2);

		var lastRiser = drawPlateRiser(plateParams).mesh;
		lastRiser.rotation.y = -Math.PI / 2;
		lastRiser.position.x = posX + 0.01;
		lastRiser.position.y = par.endPos.y - par.h - params.treadThickness;
		if (params.calcType == "timber_stock") lastRiser.position.y = par.endPos.y - plateParams.width;
		lastRiser.position.z = - plateParams.len / 2;
		if (par.stairAmt == 0 && marshPar.botTurn == "площадка") {
			lastRiser.position.z += turnParams.topMarshOffsetX / 2;
		}
		
		if(params.calcType == "mono"){
			lastRiser.position.x += 40;
			lastRiser.position.y += params.treadThickness / 2;
			par.treads.add(lastRiser);
		}
		else{
			par.risers.add(lastRiser);
		}

		//подпись в dxf
		var textHeight = 30;
		var text = "Подступенок вертикальной рамки";
		addText(text, textHeight, dxfPrimitivesArr, newPoint_xy(plateParams.dxfBasePoint, 0, -50));

		//деревянные заглушки
		for (var i = 0; i < plateParams.holes.length; i++) {
			var plug = drawTimberPlug(25)
			plug.position.y = plateParams.holes[i].center.y;
			plug.position.x = plateParams.holes[i].center.x;
			plug.position.z = plateParams.thk;
			plug.rotation.x = Math.PI / 2;
			if (!testingMode) lastRiser.add(plug);
		}
		

	}

	par.len = marshPar.len;
	par.height = marshPar.height;

	return par;

} //end of 	drawMarshTreads2

function drawPlatform2(par) {

	/*
	параметры:
	par.len - общая длина (глубина) площадки
	par.width - общая ширина площадки
	dxfBasePoint
	isP
	botMarshId
	*/

	par.treads = new THREE.Object3D();
	par.risers = new THREE.Object3D();
	//поперек волокон площадка делается из кусков не шире 600мм. Рассчитываем параметры и добавляем в par
	calcPltPartsParams(par);

	var marshPar = getMarshParams(par.botMarshId);

	if (!par.isNotTread) {
		var plateParams = {
			len: par.width,
			width: par.partLen,
			dxfBasePoint: par.dxfBasePoint,
			dxfArr: dxfPrimitivesArr,
			thk: params.treadThickness,
			material: params.materials.tread,
			partName: "tread",
		}
		if (params.stairType == 'дпк' || params.stairType == "лиственница тер." ) {
			// plateParams.material = params.materials.dpc;
			plateParams.partName = "dpc";
			plateParams.dxfArr = [];
		}
		if (params.stairType == 'лотки') {
			// рассчитываем параметры рамки
			var parFrame = {}
			calcFrameParams(parFrame);
			plateParams.thkFull = plateParams.thk + parFrame.profHeight;
		}

		//if (params.calcType == "mono" && params.treadPlatePockets !== "нет") {
		//	plateParams.thkFull = plateParams.thk;
		//	plateParams.thk -= 10;
		//}

		var partLen = par.partLen;
		for (var i = 0; i < par.partsAmt; i++) {
			par.partLen = partLen;
			if (par.lastPartLen && i == par.partsAmt - 1) par.partLen = par.lastPartLen;
			plateParams.width = par.partLen;
			if (params.calcType == 'timber_stock' && menu.newell_fixings) {
				if(i == 0) plateParams.holes = calcTimberStokPltHoles(plateParams.width, i == 0);
				if(i == par.partsAmt - 1) plateParams.holes = calcTimberStokPltHoles(plateParams.width, i == 0);
			}

			var drawRectTread = true;
			if (params.calcType == "mono") {
				var marshParNext = getMarshParams(marshPar.nextMarshId);
				if (marshParNext.lastMarsh && marshParNext.stairAmt == 0 && params.lastRiser == "есть") {
					plateParams.riserSideOffset = 20;
					plateParams.isBot = true;
					if (i == par.partsAmt - 1) plateParams.isBot = false; 
					if (params.lastRiser !== "есть" && params.topAnglePosition == "над ступенью") {
						plateParams.depth = 10;
						drawRectTread = false;
					}
					if (params.lastRiser == "есть") {
						plateParams.depth = params.riserThickness;
						drawRectTread = false;
					}
					if (!drawRectTread) {
						plateParams.dxfBasePoint = newPoint_xy(plateParams.dxfBasePoint, plateParams.width + 100, 0);
						plateParams.dxfArr = dxfPrimitivesArr;

						var tread = drawNotchedPlatePlatform(plateParams).mesh;
						tread.rotation.set(Math.PI * 0.5*turnFactor, 0, Math.PI * 0.5);
						tread.position.x = (partLen + par.partsGap) * i + plateParams.width;
						tread.position.y = 0.01;
						tread.position.z = - calcTreadLen() / 2 * turnFactor;
						if (turnFactor == -1) tread.position.y = -params.treadThickness;
					}
				}
			}

			if (drawRectTread) {
				tread = drawPlate(plateParams).mesh;
				tread.rotation.set(Math.PI * 0.5, 0, Math.PI * 0.5);
				tread.position.x = (partLen + par.partsGap) * i + plateParams.width;
				tread.position.y = 0.01;
				tread.position.z = - calcTreadLen() / 2;
				if (turnFactor == -1) tread.position.z = calcTreadLen() / 2 - plateParams.len;
			}

			
			plateParams.dxfBasePoint.y += plateParams.width + 150;
			
			par.treads.add(tread);
		} //end of for

		/*подступенок под площадкой*/

		if (params.riserType == "есть") {
			var riserPar = {
				len: params.M,
				width: marshPar.h,
				thk: params.riserThickness,
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: dxfBasePoint,
				hasTopScrews: true,
				hasBotScrews: true
			};

			//отрисовка
			riserPar.modifyKey = 'riser:' + par.marshId + ':platform';
			riserPar = drawRectRiser(riserPar);
			riser = riserPar.mesh;

			riser.rotation.y = Math.PI / 2;
			riser.rotation.x = Math.PI / 2;
			riser.position.x = params.nose;
			riser.position.y = tread.position.y - params.treadThickness - marshPar.h + 0.01;
			riser.position.z = tread.position.z;
			if (turnFactor == -1) riser.position.z += plateParams.len - riserPar.len;
			if (params.stairModel == "П-образная с площадкой" && turnFactor == -1	&& par.botMarshId == 1) {
				riser.position.z = -plateParams.len / 2 + riserPar.len / 2 + params.marshDist / 2;
			}

			par.risers.add(riser);
		}
	}

	//сохраняем позицию последней ступени
	par.endPos = {
		x: 0,
		y: 0,
	}

	return par;
}

/**
 * Функция рассчитывает отверстия под столбы в площадке
 * @param {number} plateWidth ширина доски, необходима для рассчетов отверстий на первой доске
 * @param {boolean} isFirst определяет первая или последняя доска в деревяшках
 * @return {object} [{center:{x,y}, rad:number}] - массив отверстий
 */
function calcTimberStokPltHoles(plateLength, isFirst){
	var holeRad = 5;
	var holes = [];
	plateLength = plateLength || 0;
	var plateWidth = params.M;
	if (params.stairModel == 'П-образная с площадкой') plateWidth = params.M * 2 + params.marshDist;

	var sideOffset = 24;
	var holesOffset = params.rackSize - sideOffset * 2;

	if(!isFirst){
		holes = [
			{
				rad: holeRad,
				center:{
					x: sideOffset + holesOffset,
					y: sideOffset,
				}
			},
			{
				rad: holeRad,
				center:{
					x: sideOffset,
					y: sideOffset + holesOffset,
				}
			},
			{
				rad: holeRad,
				center:{
					x: plateWidth - (sideOffset + holesOffset),
					y: sideOffset,
				}
			},
			{
				rad: holeRad,
				center:{
					x: plateWidth - (sideOffset),
					y: sideOffset + holesOffset,
				}
			},
		];
	}
	if(isFirst){
		holes = [
			{
				rad: holeRad,
				center:{
					x: sideOffset + holesOffset,
					y: plateLength - (sideOffset + params.nose + (params.riserType == 'есть' ? params.riserThickness : 0)),
				}
			},
			{
				rad: holeRad,
				center:{
					x: sideOffset,
					y: plateLength - (sideOffset + holesOffset + params.nose + (params.riserType == 'есть' ? params.riserThickness : 0)),
				}
			},
			{
				rad: holeRad,
				center:{
					x: plateWidth - (sideOffset + holesOffset),
					y: plateLength - (sideOffset + params.nose + (params.riserType == 'есть' ? params.riserThickness : 0)),
				}
			},
			{
				rad: holeRad,
				center:{
					x: plateWidth - sideOffset,
					y: plateLength - (sideOffset + holesOffset + params.nose + (params.riserType == 'есть' ? params.riserThickness : 0)),
				}
			},
		];
	}

	return holes;
}

/** функция рассчитывает точки внешнего контура первой и третьей забежной ступени
*Чертеж с обозначением параметров здесь: 6692035.ru/drawings/turnTreads/turnTreads.pdf
*@params: treadWidth
*@params: edgeAngle
*@params: stepWidthLow
*@params: innerOffset // не обязательный
*@params: outerOffset //не обязательный

*@result: keyPoints - точки по углам
*@result: points - все точки с учетом вырезов
*/

function calcWndTread1Points(par){

	//необязательные параметры
	if(!par.innerOffset) par.innerOffset = 0;
	if(!par.outerOffset) par.outerOffset = 0;

	//расчет точек контура для правой ступени
	var p0 = {x:0, y:0};
	var p1 = copyPoint(p0);
	var p4 = newPoint_xy(p1, par.treadWidth, 0);
	var p3 = newPoint_xy(p4, 0, par.stepWidthLow);
	var p2 = itercection(p3, polar(p3, -par.edgeAngle, -100), p1, newPoint_xy(p1, 0, 100));

	if(par.innerOffset){
		var p31 = newPoint_xy(p3, -par.innerOffset, 0);
		p2 = itercection(p31, polar(p31, -par.edgeAngle, -100), p1, newPoint_xy(p1, 0, 100));
	}

	if(par.outerOffset){
		//вспомогательные точки
		var p11 = newPoint_xy(p1, par.outerOffset, 0);
		var p3t = p31 || p3;
		var p21 = itercection(p3t, polar(p3t, -par.edgeAngle, -100), p11, newPoint_xy(p11, 0, 100));
		var p2 = newPoint_xy(p21, -par.outerOffset, 0);
	}
	if (par.outNotch) {
		var p3_n = newPoint_xy(p1, 0, par.outNotch.y);
		var p2_n = newPoint_xy(p3_n, params.rackSize, 0);
		var p1_n = newPoint_xy(p2_n, 0, -par.outNotch.y);
	}
	if (par.notchLastRiser) {
		var p1_nlr = newPoint_xy(p1, 20, 0);
		var p4_nlr = newPoint_xy(p4, -20, 0);
		var p2_nlr = newPoint_xy(p1_nlr, 0, params.riserThickness);
		var p3_nlr = newPoint_xy(p4_nlr, 0, params.riserThickness);
	}
	
	var newellPosition = null;
	var newellMod_1 = null;
	var newellMod3_1 = null;
	var newellMod3_2 = null;
	//Модифицируем контур для столба
	var marshPar = getMarshParams(par.marshId);
	var sideOverHang = params.sideOverHang;
	if (marshPar.stringerCover == "внутренняя") sideOverHang -= 2;
	var nextMarshPar = getMarshParams(marshPar.nextMarshId);
	if (par.hasTurnRack && par.isTread) {
		var turnPar = calcTurnParams(par.marshId);
		if ((par.treadId == 3 || par.treadId == 6) && params.calcType == 'metal' && nextMarshPar.stairAmt > 0) {
			// Рассчитываем положение поворотного столба
			var newellPosition = {
				x: params.M - 95 - 0.03,
				y: turnPar.topMarshOffsetZ + params.nose - 0.03
			}
			if (par.turnId == 1 && params.stairModel == 'П-образная с забегом') {
				newellPosition.y = params.marshDist - (80 - sideOverHang);
			}

			// Ищем пересечения со столбом
			var newellMod3_1 = itercection(newellPosition, newPoint_xy(newellPosition, 0, 100), p2, p3);
			var newellMod3_2 = itercection(newellPosition, newPoint_xy(newellPosition, -100, 0), p2, p3);
			newellMod3_2.x = p3.x;
		}
		if ((par.treadId == 3 || par.treadId == 6) && params.calcType == 'metal' && nextMarshPar.stairAmt == 0) {
			var newellPosition = {
				x: p3.x - 95 - 0.05,
				y: p3.y + turnPar.topMarshOffsetZ - 35 - 0.05
			}
			
			// Ищем пересечения со столбом
			var newellMod3_1 = itercection(newellPosition, newPoint_xy(newellPosition, 0, 100), p2, p3);
			p3 = newPoint_xy(newellPosition, 95, 0);
		}
		if (par.treadId == 1 && params.calcType == 'metal') {
			if (params.riserType == "нет") {
				var tempPoint = copyPoint(p3);
				var deltaX = 95 + turnPar.topMarshOffsetX;
				if (params.calcType == 'metal') {
					deltaX = sideOverHang + turnPar.topMarshOffsetX;
					if (sideOverHang > 95) {
						deltaX -= sideOverHang - 95;
					}
				}
				var p3 = newPoint_xy(p4, 0, deltaX - 0.01);
				var newellMod_1 = itercection(p3, newPoint_xy(p3, 100, 0), p2, tempPoint)//(p3, -65 / Math.sin(par.edgeAngle), 0);
				delete tempPoint;
				
				par.riserFix = distance(p3, newellMod_1)
			}
			if (params.riserType == "есть") {
				var tempPoint = copyPoint(p3);
				var deltaX = 95 + turnPar.topMarshOffsetX;
				if (params.calcType == 'metal') {
					deltaX = sideOverHang + turnPar.topMarshOffsetX;
					if (sideOverHang > 95) {
						deltaX -= sideOverHang - 95;
					}
				}
				var p3 = newPoint_xy(p4, 0, deltaX - 0.01);
				var p3_riserFix = newPoint_xy(p3, -95, 0);
				var newellMod_1 = itercection(p3_riserFix, newPoint_xy(p3_riserFix, 0, 100), p2, tempPoint)//(p3, -65 / Math.sin(par.edgeAngle), 0);
				delete tempPoint;
				
				par.riserFix = distance(p3, newellMod_1)
			}
		}
		if (par.treadId == 1 && params.calcType == 'mono') {
			var tempPoint = copyPoint(p3);
			var p3 = newPoint_xy(p3, 0, 95 + turnPar.topMarshOffsetZ + 5);
			var newellMod_1 = itercection(p3, newPoint_xy(p3, 100, 0), p2, tempPoint)
			delete tempPoint;
		}
		if ((par.treadId == 3 || par.treadId == 6) && params.calcType == 'mono') {
			// Рассчитываем положение поворотного столба
			var newellPosition = {
				x: p3.x - 95 - 0.05,
				y: p3.y + turnPar.topMarshOffsetZ - 0.05
			}
			
			// Ищем пересечения со столбом
			var newellMod3_1 = itercection(newellPosition, newPoint_xy(newellPosition, 0, 100), p2, p3);
			p3 = newPoint_xy(newellPosition, 95, 0);
		}
	}
	//Урезаем ступень на 5 мм чтобы не было пересечения со столбом поворотным
	if (par.treadId == 1 && par.turnId == 2 && //второй поворот первая ступень
		params.stairModel == 'П-образная с забегом' && params.calcType == 'mono' && // только на моно и на п-образной с забегом
		getMarshParams(1).hasRailing.in && (params.railingModel == 'Деревянные балясины' || params.railingModel == 'Дерево с ковкой' || params.railingModel == 'Стекло')) {//Ограждения только деревянные
		p1.y += 5;
		p4.y += 5;
	}
	// outNotch
	var points = [p1, p2];
	if (par.outNotch) points = [p1_n, p2_n, p3_n, p2];
	if(p21) points.push(p21);
	if(p31) points.push(p31);
	// модификации для поворотного столба, при наличии деревянных ограждений 
	if (newellMod_1) points.push(newellMod_1);
	if (newellMod3_1) points.push(newellMod3_1);
	if (newellPosition) points.push(newellPosition);
	if (newellMod3_2) points.push(newellMod3_2);
	// модификации для поворотного столба, при наличии деревянных ограждений
	if (p3_riserFix) points.push(p3_riserFix)
	points.push(p3);
	points.push(p4);

	if (par.notchLastRiser) {
		points.push(p4_nlr);
		points.push(p3_nlr);
		points.push(p2_nlr);
		points.push(p1_nlr);
	}

	//учииываем направление поворота лестницы
	for(var i=0; i<points.length; i++){
		points[i].x = points[i].x * turnFactor;
	}

	//формируем возвращаемый объект

	var result = {
		signKeyPoints: {},
		keyPoints: [p1, p2, p3, p4],
		points: points,
		front: {
			p1: p4,
			p2: p1,
			len: distance(p4, p1),
			},
		rear: {
			p1: p2,
			p2: p3,
			len: distance(p2, p3),
			},
		sideOut: {
			p1: p1,
			p2: p2,
			len: distance(p1, p2),
			},
		sideIn: {
			p1: p3,
			p2: p4,
			len: distance(p3, p4),
			},
		}
	
	//Для отладки
	if (p1) result.signKeyPoints.p1 = p1;
	if (p2) result.signKeyPoints.p2 = p2;
	if (p1_n) result.signKeyPoints.p1_n = p1_n;
	if (p2_n) result.signKeyPoints.p2_n = p2_n;
	if (p3_n) result.signKeyPoints.p3_n = p3_n;
	if (p21) result.signKeyPoints.p21 = p21;
	if (p31) result.signKeyPoints.p31 = p31;
	if (newellMod_1) result.signKeyPoints.newellMod_1 = newellMod_1;
	if (p3) result.signKeyPoints.p3 = p3;
	if (p4) result.signKeyPoints.p4 = p4;
	if (newellPosition) result.signKeyPoints.newellPosition = newellPosition;
	
	return result;

}


/** функция рассчитывает точки внешнего контура второй забежной ступени
*Чертеж с обозначением параметров здесь: 6692035.ru/drawings/turnTreads/turnTreads.pdf
*@params: treadWidthX
*@params: treadWidthY
*@params: angleX
*@params: angleY
*@params: innerOffsetX // не обязательный
*@params: innerOffsetY // не обязательный
*@params: notchDepthX //не обязательный
*@params: notchDepthY //не обязательный
*@params: outerOffsetX //не обязательный
*@params: outerOffsetY //не обязательный

*@result: keyPoints - точки по углам
*@result: points - все точки с учетом вырезов
*/

function calcWndTread2Points(par){
	//необязательные параметры
	if(!par.innerOffsetX) par.innerOffsetX = 0;
	if(!par.innerOffsetY) par.innerOffsetY = 0;
	if(!par.outerOffsetX) par.outerOffsetX = 0;
	if(!par.outerOffsetY) par.outerOffsetY = 0;
	if(!par.notchDepthX) par.notchDepthX = 0;
	if(!par.notchDepthY) par.notchDepthY = 0;

	par.stepOffsetY = Math.tan(par.angleX) * (par.treadWidthX - par.innerOffsetX - par.outerOffsetX);
    par.stepOffsetX = Math.tan(par.angleY) * (par.treadWidthY - par.innerOffsetY - par.outerOffsetY);
    par.stepWidthX = par.treadWidthX - par.stepOffsetX;
    par.stepWidthY = par.treadWidthY - par.stepOffsetY;

	//расчет точек контура для правой ступени
	var p0 = {x:0, y:0};
	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p1, par.treadWidthX - par.innerOffsetX, -par.stepOffsetY);
	var p3 = newPoint_xy(p2, par.innerOffsetX - par.notchDepthX, par.notchDepthY);
	var p4 = newPoint_xy(p2, par.innerOffsetX, par.innerOffsetY);
	var p5 = newPoint_xy(p1, par.stepWidthX, par.stepWidthY);
	var p6 = newPoint_xy(p1, 0, par.stepWidthY);

	if(par.outerOffsetX){
		var p11 = newPoint_xy(p1, par.outerOffsetX, 0);
	}
	if(par.notchDepthX && par.notchDepthY){
		var p31 = newPoint_xy(p3, 0, -par.notchDepthY);
		var p32 = newPoint_xy(p3, par.notchDepthX, 0);
	}
	if(par.outerOffsetY){
		var p51 = newPoint_xy(p5, 0, -par.outerOffsetY);
	}

	var newellPosition = null;
	//Модифицируем контур для столба
	if (par.isTread && par.hasTurnRack && params.calcType == 'metal') {
		//Рассчитываем положение поворотного столба
		var newellPosition = {
			x: params.M - 95 - 0.05,
			y: p2.y + 95 + 0.05
		}
		//Ищем пересечения со столбом
		p2 = itercection(newellPosition, newPoint_xy(newellPosition, 0, -100), p1, p2);
		p3 = itercection(newellPosition, newPoint_xy(newellPosition, -100, 0), p3, p5)
		p4 = p3;//Почему-то точка дублируется, для корректного отображения дублируем.	
	}
	if (par.isTread && par.hasTurnRack && params.calcType == 'mono') {
		//Рассчитываем положение поворотного столба
		var newellPosition = {
			x: params.M - 95 - 0.05,
			y: p3.y + params.nose + calcTurnParams(par.marshId).topMarshOffsetZ + 95 + 0.05
		}
		//Ищем пересечения со столбом
		p2 = itercection(newellPosition, newPoint_xy(newellPosition, 0, -100), p1, p2);
		p4 = itercection(newellPosition, newPoint_xy(newellPosition, -100, 0), p4, p5)
		p3 = p4;
	}

	var points = [p1];
	if(p11) points.push(p11);
	points.push(p2);
	if(p31) points.push(p31);
	if(newellPosition) points.push(newellPosition);
	points.push(p3);
	if(p32) points.push(p32);
	points.push(p4);
	if(p51) points.push(p51);
	points.push(p5);
	points.push(p6);

	points = removeDuplicates(points);

	//учитываем направление поворота лестницы
	for(var i=0; i<points.length; i++){
		points[i].x = points[i].x * turnFactor;
		}

	//формируем возвращаемый объект

		var result = {
		signKeyPoints: {},
		keyPoints: points,
		points: points,
		front1: {
			p1: p3,
			p2: p2,
			len: distance(p3, p2),
			},
		front2: {
			p1: p2,
			p2: p11 ? p11 : p1,
			len: distance(p2, p11 ? p11 : p1),
			},
		rear1: {
			p1: p6,
			p2: p5,
			len: distance(p6, p5),
			},
		rear2: {
			p1: p51 ? p51 : p5,
			p2: par.innerOffsetY ? p4 : p3,
			len: distance(p51 ? p51 : p5, par.innerOffsetY ? p4 : p3),
			},
		sideOut: {
			p1: p1,
			p2: p6,
			len: distance(p1, p6),
			},
		sideIn: {
			p1: p4,
			p2: p3,
			len: distance(p4, p3),
			},
	}
	
	//Для отладки
	/*
	if (p1) result.signKeyPoints.p1 = p1;
	if (p11) result.signKeyPoints.p11 = p11;
	if (p2) result.signKeyPoints.p2 = p2;
	if (newellPosition) result.signKeyPoints.newellPosition = newellPosition;
	if (p31) result.signKeyPoints.p31 = p31;
	if (p3) result.signKeyPoints.p3 = p3;
	if (p32) result.signKeyPoints.p32 = p32;
	if (p4) result.signKeyPoints.p4 = p4;
	if (p51) result.signKeyPoints.p51 = p51;
	if (p5) result.signKeyPoints.p5 = p5;
	if (p6) result.signKeyPoints.p6 = p6;

	*/
	return result;

}

function drawWndTread1(par) {

	/*функция отрисовки контура первой и третьей забежной ступени
	Чертеж с обозначением параметров здесь: 6692035.ru/drawings/turnTreads/turnTreads.pdf
	Исходные данные:
		treadWidth
		edgeAngle
		stepWidthLow
		innerOffset // не обязательный
		outerOffset //не обязательный
		dxfBasePoint
		treadId
	На выходе те же данные плюс следующие:
		mesh
		stepWidthHi
	*/

	var marshPar = getMarshParams(par.marshId);

	par.mesh = new THREE.Object3D();

	getTreadLigtsParams(par) //параметры подсветки ступеней

	var path = calcWndTread1Points(par);

	//зеркалим третью ступень
	if (par.treadId == 3) {
		for (var i = 0; i < path.points.length; i++) {
			path.points[i].x *= -1;
		}
	}


	var points1 = path.points.concat();
	if (params.model == "ко" && params.riserType == "есть") {
		if (par.treadId == 1 && par.turnId == 2) {
			if (params.stairModel == 'П-образная с забегом' ||
				(params.stairModel == 'П-образная трехмаршевая' && marshPar.stairAmt == 0)) {
				var line = parallel(points1[0], points1[3], -(params.nose - 20));
				points1[0] = itercection(points1[0], points1[1], line.p1, line.p2);
				points1[3] = itercection(points1[3], points1[2], line.p1, line.p2);
			}
		}
		if (par.treadId == 3) {
			var line = parallel(points1[1], points1[2], (params.nose - 20));
			points1[1] = itercection(points1[0], points1[1], line.p1, line.p2);
			points1[2] = itercection(points1[3], points1[2], line.p1, line.p2);
		}

	}

	//	signKeyPoints(path.signKeyPoints, par.dxfBasePoint);

	//создаем шейп
	var shapePar = {
		points: points1,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		markPoints: false, //пометить точки в dxf для отладки		
	};

	//параметры для рабочего чертежа
	shapePar.drawing = {
		name: "Забежная ступень " + par.treadId,
		group: "wndTreads",
		baseLine: {
			p1: shapePar.points[0],
			p2: shapePar.points[3],
		},
	}

	if (par.treadId == 3) {
		shapePar.drawing.baseLine = {
			p1: shapePar.points[1],
			p2: shapePar.points[2],
		};
	}


	var shape = drawShapeByPoints2(shapePar).shape;

	var extrudeOptions = {
		amount: params.treadThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	
	if(params.stairType == "массив") setBevels(extrudeOptions)
		
	if (params.stairType == "") extrudeOptions.amount -= par.techDelta;
	//лотки
	if (params.stairType == "лотки" || params.stairType == "рифленая сталь") extrudeOptions.amount = 4;

	if (par.isTreadLigts) extrudeOptions.amount -= par.treadLigtsThk;

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	if (par.treadId == 3) {
		geom.rotateUV(-par.edgeAngle * turnFactor);
	}
	var mesh = new THREE.Mesh(geom, params.materials.tread);
	mesh.userData.wndTreadParams = {
		angle: par.edgeAngle,
		treadId: par.treadId,
	}
	if (par.isTreadLigts) mesh.position.z = par.treadLigtsThk;
	par.mesh.add(mesh);
	par.mesh.modifyKey = 'wndTread:' + par.marshId + ':' + par.treadId;
	//сохраняем параметр
	par.stepWidthHi = distance(path.keyPoints[0], path.keyPoints[1]);

	// добавляем часть ступени с вырезом под подсветку ступеней
	if (par.isTreadLigts) {
		extrudeOptions.amount = par.treadLigtsThk;

		var hole = new THREE.Path();

		if (par.treadId == 1) {
			var ph1 = newPoint_xy(points1[0], par.offsetSide * turnFactor, par.offsetFront);
			var ph2 = newPoint_xy(ph1, 0, par.widthLigts);
			var ph4 = newPoint_xy(points1[points1.length - 1], -par.offsetSide * turnFactor, par.offsetFront);
			var ph3 = newPoint_xy(ph4, 0, par.widthLigts);
		}
		if (par.treadId == 3) {
			var lineF1 = parallel(points1[1], points1[2], -par.offsetFront)
			var lineF2 = parallel(points1[1], points1[2], -par.offsetFront - par.widthLigts)
			var lineS1 = parallel(points1[0], points1[1], par.offsetSide * turnFactor)
			var lineS2 = parallel(points1[2], points1[3], -par.offsetSide * turnFactor)
			var ph1 = itercectionLines(lineF1, lineS1);
			var ph2 = itercectionLines(lineF1, lineS2);
			var ph3 = itercectionLines(lineF2, lineS2);
			var ph4 = itercectionLines(lineF2, lineS1);
		}

		addLine(hole, dxfPrimitivesArr, ph1, ph2, par.dxfBasePoint);
		addLine(hole, dxfPrimitivesArr, ph2, ph3, par.dxfBasePoint);
		addLine(hole, dxfPrimitivesArr, ph3, ph4, par.dxfBasePoint);
		addLine(hole, dxfPrimitivesArr, ph4, ph1, par.dxfBasePoint);

		shape.holes.push(hole)

		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		if (par.treadId == 3) {
			geom.rotateUV(-par.edgeAngle * turnFactor);
		}
		var mesh = new THREE.Mesh(geom, params.materials.tread);
		//mesh.position.z = par.thk - par.treadLigtsThk;
		par.mesh.add(mesh)
	}

	//производственная информация для вывода в dxf

	//направление волокон
	if (!(params.stairType == "лотки" || params.stairType == "рифленая сталь")) {
		var arrowPar = {
			len: par.treadWidth / 2,
			arrowLen: 70,
			ang: 0,
			basePoint: newPoint_xy(path.keyPoints[0], par.treadWidth / 4, 100),
			dxfBasePoint: par.dxfBasePoint,
		};

		if (par.treadId == 3 || par.treadId == 6) {
			arrowPar.ang = par.edgeAngle * turnFactor + Math.PI;
			if (turnFactor == 1) {
				arrowPar.basePoint = newPoint_xy(path.keyPoints[3], par.treadWidth / 4, 100);
				arrowPar.ang += Math.PI;
			}
		}
		if (turnFactor == -1) {
			arrowPar.basePoint = newPoint_xy(path.keyPoints[3], par.treadWidth / 4, 100);
			if (par.treadId == 3 || par.treadId == 6)
				arrowPar.basePoint = newPoint_xy(path.keyPoints[3], -par.treadWidth / 4, 100);
		}

		drawDoubleArrowDxf(arrowPar);
	}


	if (params.calcType == "metal") { };
	if (params.calcType == "mono") { };
	if (params.calcType == "timber") { };

	//сохраняем данные для спецификации
	var treadPar = getTreadParams(); //функция в файле calcSpecGeneral.js

	var partName = "wndTread";
	if (typeof specObj != 'undefined' && params.stairType != "нет") {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Ступень забежная " + params.stairType,
				area: 0,
				paintedArea: 0,
				metalPaint: treadPar.metalPaint,
				timberPaint: treadPar.timberPaint,
				division: treadPar.division,
				workUnitName: "amt",
				group: "treads",
			}
			if (params.calcType == "timber") specObj[partName].name = "Ступень забежная " + params.treadsMaterial;
		}


		var name = "A=" + Math.round(par.treadWidth) + " B=" + Math.round(par.stepWidthHi) + " C=" + Math.round(par.stepWidthLow);
		var area = par.treadWidth * (par.stepWidthHi + par.stepWidthLow) / 2 / 1000000;

		if (par.treadId == 1 || par.treadId == 4) name += " нижняя";
		if (par.treadId == 3 || par.treadId == 6) name += " верхняя";

		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		specObj[partName]["paintedArea"] += area * 2 + area * 0.1; //к-т 0,1 учитывает площадь торцев
	}
	par.mesh.specId = partName + name;

	return par;

} //end of drawWndTread1

function drawWndTread2(par) {
    /*функция отрисовывает шейп второй (угловой) забежной ступени
    Исходные данные:
    Чертеж с обозначением параметров здесь: 6692035.ru/drawings/turnTreads/turnTreads.pdf

	обязательыне:
	treadWidthX
    treadWidthY
    angleX
    angleY

	не обязательные:
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

    par.mesh = new THREE.Object3D();

    getTreadLigtsParams(par) //параметры подсветки ступеней

	//необязательные параметры
	if (!par.outerOffsetX) par.outerOffsetX = 0;
	if (!par.outerOffsetY) par.outerOffsetY = 0;
	if (!par.innerOffsetX) par.innerOffsetX = 0;
	if (!par.innerOffsetY) par.innerOffsetY = 0;
	if (!par.notchDepthX) par.notchDepthX = 0;
	if (!par.notchDepthY) par.notchDepthY = 0;

	var dxfBasePoint = par.dxfBasePoint;

	var wndTreadParams = calcWndTread2Points(par);
	var points = wndTreadParams.points;

	par.points = points;
	//сохраняем размеры для спецификации

	par.sizeA = distance(points[2], points[points.length - 1]);
	par.sizeB = distance(points[4], points[0]);
	if (params.model == "ко") par.sizeB = distance(points[3], points[0]);
	//корректируем точки чтобы не было пересечений с тетивой
	points[1].y += 0.01;
	points[2].y += 0.01;
	points[0].x += 0.01 * turnFactor;
	if (points[5]) points[5].x += 0.01 * turnFactor;

	var points1 = points.concat();
	if (params.model == "ко" && params.riserType == "есть") {
		var line = parallel(points1[0], points1[1], - (params.nose - 20));
		points1[0] = itercection(points1[0], points1[4], line.p1, line.p2);
		points1[1] = itercection(points1[1], points1[2], line.p1, line.p2);
	}

	//создаем шейп
	var shapePar = {
		points: points1,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		markPoints: false, //пометить точки в dxf для отладки
	}

	//параметры для рабочего чертежа
	shapePar.drawing = {
		name: "Забежная ступень " + par.treadId,
		group: "wndTreads",
		baseLine: {
			p1: shapePar.points[0],
			p2: shapePar.points[1],
		},
	}

	var shape = drawShapeByPoints2(shapePar).shape;


	var extrudeOptions = {
		amount: params.treadThickness,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};
	if(params.stairType == "массив") setBevels(extrudeOptions)
		
	if (params.calcType == 'timber') extrudeOptions.amount -= par.techDelta;

	//лотки
	if (params.stairType == "лотки" || params.stairType == "рифленая сталь") extrudeOptions.amount = 4;

	if (par.isTreadLigts) extrudeOptions.amount -= par.treadLigtsThk;

	//signKeyPoints(wndTreadParams.signKeyPoints, par.dxfBasePoint);
	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);

	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	geom.rotateUV(par.angleX * turnFactor);
	var mesh = new THREE.Mesh(geom, params.materials.tread);
	mesh.userData.wndTreadParams = {
		angle: par.angleX,
		treadId: 2,
	}
	if (par.isTreadLigts) mesh.position.z = par.treadLigtsThk;
	par.mesh.add(mesh);
	par.mesh.modifyKey = 'wndTread:' + par.marshId + ':2';

	// добавляем часть ступени с вырезом под подсветку ступеней
	if (par.isTreadLigts) {
		extrudeOptions.amount = par.treadLigtsThk;

		var hole = new THREE.Path();

		var lineF1 = parallel(points1[0], points1[1], par.offsetFront)
		var lineF2 = parallel(points1[0], points1[1], par.offsetFront + par.widthLigts)
		var lineS1 = parallel(points1[1], points1[2], par.offsetSide)
		if (par.hasTurnRack) lineS1 = parallel(points1[1], points1[2], par.offsetSide * turnFactor)
		var lineS2 = parallel(points1[0], points1[points1.length-1], par.offsetSide)
		var ph1 = itercectionLines(lineF1, lineS1);
		var ph2 = itercectionLines(lineF1, lineS2);
		var ph3 = itercectionLines(lineF2, lineS2);
		var ph4 = itercectionLines(lineF2, lineS1);

		addLine(hole, dxfPrimitivesArr, ph1, ph2, par.dxfBasePoint);
		addLine(hole, dxfPrimitivesArr, ph2, ph3, par.dxfBasePoint);
		addLine(hole, dxfPrimitivesArr, ph3, ph4, par.dxfBasePoint);
		addLine(hole, dxfPrimitivesArr, ph4, ph1, par.dxfBasePoint);

		shape.holes.push(hole)

		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		geom.rotateUV(par.angleX * turnFactor);
		var mesh = new THREE.Mesh(geom, params.materials.tread);
		par.mesh.add(mesh)
	}


	//производственная информация для вывода в dxf

	//направление волокон
	if (!(params.stairType == "лотки" || params.stairType == "рифленая сталь")) {
		var arrowPar = {
			len: par.treadWidthX / 2,
			arrowLen: 70,
			ang: -par.angleX,
			basePoint: newPoint_xy(points[0], 150, 0),
			dxfBasePoint: par.dxfBasePoint,
		};

		if (turnFactor == -1) {
			arrowPar.basePoint = newPoint_xy(points[0], -150, 0),
				arrowPar.ang = par.angleX + Math.PI;
		}

		drawDoubleArrowDxf(arrowPar);
	}


	//сохраняем данные для спецификации
	var treadPar = getTreadParams(); //функция в файле calcSpecGeneral.js
	var partName = "wndTread";
	if (typeof specObj != 'undefined' && params.stairType != "нет") {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Ступень забежная " + params.stairType,
				area: 0,
				paintedArea: 0,
				metalPaint: treadPar.metalPaint,
				timberPaint: treadPar.timberPaint,
				division: treadPar.division,
				workUnitName: "amt",
				group: "treads",
			}
			if (params.calcType == "timber") specObj[partName].name = "Ступень забежная " + params.treadsMaterial;
		}

		var name = "A=" + Math.round(par.sizeA) + " B=" + Math.round(par.sizeB);
		var area = par.sizeA * par.sizeB * 0.7 / 1000000;
		name += " средняя";
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		specObj[partName]["paintedArea"] += area * 2 + area * 0.1; //к-т 0,1 учитывает площадь торцев
	}
	par.mesh.specId = partName + name;

	return par;

}//end of drawWndTread2


function drawDoubleArrowDxf(par){
	/*функция добавляет в dxfPrimitivesArr двухстороннюю стрелку
	Параметры:
	len
	arrowLen
	ang
	basePoint
	dxfBasePoint
	*/

	var arrowWidth = par.arrowLen / 2;


	//рассчитываем точки для горизонтальной стрелки

    var p1 = copyPoint(par.basePoint);
	var p2 = newPoint_xy(p1, par.len, 0);
	var p11 = newPoint_xy(p1, par.arrowLen, arrowWidth / 2);
	var p12 = newPoint_xy(p1, par.arrowLen, -arrowWidth / 2);
	var p21 = newPoint_xy(p2, -par.arrowLen, arrowWidth / 2);
	var p22 = newPoint_xy(p2, -par.arrowLen, -arrowWidth / 2);

	//поворачиваем стрелку относительно p1
	var points = [p1, p2, p11, p12, p21, p22];

	for(var i=1; i<points.length; i++){
		var ang = angle(p1, points[i]);
		var dist = distance(p1, points[i]);
		var newAng = ang + par.ang;

		points[i] = polar(p1, newAng, dist);
		}


	var trashShape = new THREE.Shape(); //мусорный шейп

	addLine(trashShape, dxfPrimitivesArr, points[0], points[2], par.dxfBasePoint);
	addLine(trashShape, dxfPrimitivesArr, points[0], points[3], par.dxfBasePoint);
	addLine(trashShape, dxfPrimitivesArr, points[0], points[1], par.dxfBasePoint);
	addLine(trashShape, dxfPrimitivesArr, points[1], points[4], par.dxfBasePoint);
	addLine(trashShape, dxfPrimitivesArr, points[1], points[5], par.dxfBasePoint);

} //end of drawDoubleArrowDxf

function removeDuplicates(arr){

	var newArr = [];

	newArr.push(arr[0]);

	for(var i=1; i < arr.length; i++){
		if(arr[i-1].x != arr[i].x || arr[i-1].y != arr[i].y){
			newArr.push(arr[i]);
			}
		}
	return newArr;
}

function drawWndTreadsMetal(par) {

    /*функция отрисовывает блок забежных ступеней для лестниц ЛТ и КО
    Исходные данные:

        h: params.h, - подъем ступени
        dxfBasePoint: dxfBasePoint, - базовая точка вставки контуров ступеней
        extendTopTurnTread: extendTopTurnTread, - продление верхней забежной ступени для попадания в проём

    Возвращаемое значение:
    объект  turnSteps = {
        meshes: treads; - мэши ступеней в виде единого 3D объекта
        params: treadParams; - массив параметров каждой ступени
    */

	//параметры марша
	var marshPar = getMarshParams(par.botMarshId);
	par.h = marshPar.h_topWnd;

	var hasTurnRack = false;
	if (params.railingModel == "Деревянные балясины" || params.railingModel == "Дерево с ковкой" || params.railingModel == 'Стекло') {
		if (params.stairModel == 'Г-образная с забегом' || params.stairModel == 'Г-образная с площадкой') {
			hasTurnRack = getMarshParams(1).hasRailing.in || getMarshParams(3).hasRailing.in;
		}
		if (params.stairModel == 'П-образная трехмаршевая' && par.botMarshId == 1) {
			hasTurnRack = getMarshParams(1).hasRailing.in || getMarshParams(2).hasRailing.in;
		}
		if (params.stairModel == 'П-образная трехмаршевая' && par.botMarshId == 2) {
			hasTurnRack = getMarshParams(2).hasRailing.in || getMarshParams(3).hasRailing.in;
		}
		if (params.stairModel == 'П-образная с забегом' && par.turnId == 1) {
			hasTurnRack = getMarshParams(1).hasRailing.in;
		}
		if (params.stairModel == 'П-образная с забегом' && par.turnId == 2) {
			hasTurnRack = getMarshParams(3).hasRailing.in;
		}
	}
	var rackSize = 95;

	//параметры поворота
	var turnPar = calcTurnParams(par.botMarshId);

	par.type = params.model;

	var stepWidthLow_lt = 100;
	var stepWidthLow_ko = 55;

	var dxfBasePoint = par.dxfBasePoint;
	var material = params.materials.tread;
	var treadParams = [];
	var treads = new THREE.Object3D();
	var risers = new THREE.Object3D();

	//константы
	var treadWidth = params.M;
	var stepWidthLow = 55;
	if (params.model == "лт") {
		stepWidthLow = 100;
		var treadSideOffset = 5;//зазор от торца ступени до тетивы
		if (params.stairType == "лотки" || params.stairType == "рифленая сталь" || params.stairType == "пресснастил") treadSideOffset = 0;

		treadWidth = params.M - params.stringerThickness * 2 - treadSideOffset * 2;
	}

	if (params.calcType == "bolz") {
		stepWidthLow = 60;
		treadWidth += params.stringerThickness;
		if (getTreadParams().material != "metal") treadWidth += 5;
	}

	var treadZOffset = (params.M - treadWidth) / 2;

	/*забежная ступень 1*/

	//задаем параметры ступени

	treadParams[1] = {
		treadWidth: treadWidth,
		innerOffset: 0,
		outerOffset: 0,
		edgeAngle: Math.PI / 6,
		stepWidthLow: stepWidthLow,
		dxfBasePoint: dxfBasePoint,
		treadId: 1,
		turnId: par.turnId,
		hasTurnRack: hasTurnRack,
		isTread: true,
		marshId: par.botMarshId
	};

	if (params.riserType == "есть") treadParams[1].stepWidthLow -= params.riserThickness / Math.cos(treadParams[1].edgeAngle)

	var tread1 = drawWndTread1(treadParams[1]).mesh;

	tread1.rotation.x = -Math.PI / 2;
	tread1.rotation.z = -Math.PI / 2;

	tread1.position.x = 0;
	tread1.position.x -= 0.02; //корректинуем позицию чтобы не было пересечений
	tread1.position.y = -params.treadThickness + 0.01;
	//лотки
	if (params.stairType == "лотки") tread1.position.y += params.treadThickness - 4 - 0.01;

	tread1.position.z = -(treadParams[1].treadWidth) / 2 * turnFactor;
	if (params.calcType == 'bolz') tread1.position.z += treadZOffset * turnFactor;

	treads.add(tread1);

	/*подступенок 1*/

	if (params.riserType == "есть") {
		var riserPar = {
			len: treadParams[1].treadWidth,
			width: marshPar.h,
			thk: params.riserThickness,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: dxfBasePoint,
			hasTopScrews: true,
			hasBotScrews: true
		};
		// console.log(par.turnId)
		if (params.stairModel == "П-образная с забегом" && par.turnId == 2) riserPar.width = par.h;
		if (par.botMarshId == 1 && params.stairAmt1 == 0 && params.stairModel != "П-образная с забегом") riserPar.width -= params.treadThickness;

		//отрисовка
		riserPar.modifyKey = 'riserWnd:' + par.marshId + ':1';
		riserPar = drawRectRiser(riserPar);
		riser = riserPar.mesh;
		riser.rotation.z = Math.PI / 2;
		riser.rotation.y = Math.PI / 2 * turnFactor;
		riser.position.x = params.nose// - params.riserThickness;
		if (par.turnId == 2) {
			if (params.stairModel == "П-образная с забегом" || (params.stairModel == 'П-образная трехмаршевая' && marshPar.stairAmt == 0)) {
				riser.position.x = 20 - 0.01;
			}
		}
		riser.position.y = -riserPar.width - params.treadThickness;
		riser.position.z = tread1.position.z;

		if (turnFactor < 0) riser.position.x += params.riserThickness;

		risers.add(riser);
	}

	/*забежная ступень 2*/

	dxfBasePoint = newPoint_xy(dxfBasePoint, 1500, 0);

	//задаем параметры ступени
	if (par.type == "лт") {
		treadParams[2] = {
			treadWidthX: params.M - params.stringerThickness + 100 - treadSideOffset + 5,
			treadWidthY: params.M - params.stringerThickness * 2 - treadSideOffset * 2 - 0.01,
			angleX: 30 * Math.PI / 180,
			angleY: 32.9237 * Math.PI / 180,
			outerOffsetX: 0,
			outerOffsetY: 0,
			innerOffsetX: 100,
			innerOffsetY: 50,
			notchDepthX: 0,
			notchDepthY: 0,
			dxfBasePoint: dxfBasePoint,
		};
	}

	if (par.type == "ко") {
		treadParams[2] = {
			treadWidthX: params.M - 25 + 88,
			treadWidthY: params.M - 0.01,
			angleX: 30 * Math.PI / 180,
			angleY: 30 * Math.PI / 180,
			outerOffsetX: 0,
			outerOffsetY: 0,
			innerOffsetX: 88,
			innerOffsetY: 0,
			notchDepthX: 0,
			notchDepthY: 0,
			dxfBasePoint: dxfBasePoint,
			hasTurnRack: hasTurnRack,
			isTread: true,
		};
	}
	if (params.calcType === 'bolz') {
		treadParams[2] = {
			treadWidthX: params.M -  params.stringerThickness - treadSideOffset- 0.01,
			treadWidthY: params.M - params.stringerThickness - treadSideOffset- 0.01,
			angleX: 30 * Math.PI / 180,
			angleY: 32.9237 * Math.PI / 180,
			outerOffsetX: 0,
			outerOffsetY: 0,
			innerOffsetX: 50,
			innerOffsetY: 50,
			notchDepthX: 0,
			notchDepthY: 0,
			dxfBasePoint: dxfBasePoint,
		};
	}
	//if(params.riserType == "есть") treadParams[2].innerOffsetX -= params.riserThickness / Math.cos(treadParams[2].angleY)
	if (params.riserType == "есть") {
		treadParams[2].innerOffsetX -= params.riserThickness / Math.cos(treadParams[2].angleY);
		treadParams[2].treadWidthX -= params.riserThickness / Math.cos(treadParams[2].angleY);
	}

	treadParams[2].treadId = 2;

	//отрисовываем ступень
	treadParams[2].marshId = par.botMarshId;
	var tread2 = drawWndTread2(treadParams[2]).mesh;
	tread2.rotation.x = -Math.PI / 2;
	tread2.rotation.z = -Math.PI / 2;
	//позиция считается так, чтобы внешний угол оказался в проектном положении
	tread2.position.x = -treadParams[2].stepWidthY + params.M + turnPar.topMarshOffsetX - treadZOffset;
	tread2.position.x -= 0.02; //корректинуем позицию чтобы не было пересечений
	tread2.position.y = par.h - params.treadThickness + 0.01;
	//лотки
	if (params.stairType == "лотки") tread2.position.y += params.treadThickness - 4 - 0.01;
	tread2.position.z = -(treadParams[1].treadWidth) / 2 * turnFactor;
	if (params.calcType == 'bolz') {
		tread2.position.x -= treadZOffset;
		tread2.position.z += treadZOffset * turnFactor;
	}
	treads.add(tread2);

	/*подступенок 2*/

	if (params.riserType == "есть") {
		var riserPar = {
			len: treadParams[1].treadWidth / Math.cos(treadParams[1].edgeAngle),
			width: par.h,
			ang: treadParams[1].edgeAngle * turnFactor,
			thk: params.riserThickness,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: newPoint_xy(dxfBasePoint, 0, -500),
			hasTopScrews: true,
			hasBotScrews: true
		};
		if (hasTurnRack && treadParams[1].riserFix) {//Меняем размер подступенка, riserFix рассчитывается в calcWndTread1Points
			riserPar.cutWndIn = treadParams[1].riserFix / Math.cos(treadParams[1].edgeAngle) + 0.03;
		}
		//if (testingMode) riserPar.len += 1;//Фикс пересечения с ковкой

		//отрисовка
		riserPar.modifyKey = 'riserWnd:' + par.marshId + ':2';
		riserPar = drawRectRiser(riserPar);
		riser = riserPar.mesh;

		riser.rotation.z = Math.PI / 2;
		riser.rotation.y = (Math.PI / 2 - treadParams[1].edgeAngle) * turnFactor;
		//базовая точка - внешний дальний угол ступени		
		riser.position.x = tread1.position.x + treadParams[1].stepWidthHi + 0.01;
		if (turnFactor == -1) riser.position.x += params.riserThickness / Math.cos(treadParams[1].edgeAngle);
		riser.position.y = -params.treadThickness + 0.01;
		riser.position.z = tread1.position.z;


		risers.add(riser);
	}

	/*забежная ступень 3*/

	dxfBasePoint = newPoint_xy(dxfBasePoint, 1000 + treadWidth, 0);

	//задаем параметры ступени
	treadParams[3] = {
		treadWidth: treadWidth,
		innerOffset: 0,
		outerOffset: 0,
		edgeAngle: Math.PI / 6,
		stepWidthLow: stepWidthLow,
		dxfBasePoint: dxfBasePoint,
		treadId: 3,
		hasTurnRack: hasTurnRack,
		isTread: true,
		marshId: par.botMarshId,
		turnId: par.turnId
	};

	//удлиннение 3 забежной ступени на П-образной с забегом
	var deltaLen = 0;
	if (par.plusMarshDist) {
		deltaLen = params.marshDist - 77;
		//if (par.type == "ко") deltaLen += params.nose - 20;
		if (params.calcType === 'bolz') deltaLen = params.marshDist;
	}

	//удлиннение последней ступени при 0 ступеней в верхнем марше
	var isLastTread = false;
	if (params.stairAmt3 == 0) {
		if (params.stairModel == "Г-образная с забегом") isLastTread = true;
		if (params.stairModel != "Г-образная с забегом" && par.turnId == 2) isLastTread = true;
	}
	if (isLastTread) deltaLen = params.lastWinderTreadWidth - treadParams[3].stepWidthLow;

	treadParams[3].stepWidthLow += deltaLen;

	var tread3 = drawWndTread1(treadParams[3]).mesh;
	tread3.rotation.x = -Math.PI / 2;

	tread3.position.x = params.M + turnPar.topMarshOffsetX - treadZOffset;
	tread3.position.y = par.h * 2 - params.treadThickness + 0.01;
	if (params.stairType == "лотки") tread3.position.y += - 0.02;
	//для лт позиция считается от переднего угла на внутренней стороне
	tread3.position.z = (params.M / 2 + treadParams[3].stepWidthLow + turnPar.topMarshOffsetZ) * turnFactor;
	//для ко позиция считается по свесу
	if (par.type == "ко") {
		tread3.position.z = (params.M / 2 + 72 + deltaLen) * turnFactor
		//if(params.riserType == "есть") tread3.position.z -= params.riserThickness * turnFactor;
	}

	if (turnFactor == -1) {
		tread3.rotation.z = Math.PI;
	}

	tread3.position.z -= 0.01 * turnFactor
	if (params.calcType == 'bolz') tread3.position.x -= treadZOffset;
	treads.add(tread3);

	/*подступенок 3*/

	if (params.riserType == "есть") {
		var offsetX = -(riserPar.len - riserPar.thk * Math.tan(riserPar.ang));

		var riserPar = {
			len: treadParams[2].treadWidthY / Math.cos(treadParams[2].angleY),
			width: par.h,
			ang: treadParams[3].edgeAngle,
			thk: params.riserThickness,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: newPoint_xy(dxfBasePoint, 0, -500),
			offsetX: offsetX,
			hasTopScrews: true,
			hasBotScrews: true
		};
		if (hasTurnRack) {//Меняем размер подступенка, riserFix рассчитывается в calcWndTread1Points
			//riserPar.cutWndIn = params.rackSize / Math.cos(treadParams[3].edgeAngle) + 10;
			riserPar.len -= params.rackSize / Math.cos(treadParams[3].edgeAngle) + 0.5; //0.5 - подогнано чтобы не было пересечения со столбом
		}

		//отрисовка
		riserPar.modifyKey = 'riserWnd:' + par.marshId + ':3';
		riserPar = drawRectRiser(riserPar);
		riser = riserPar.mesh;

		riser.rotation.z = -Math.PI / 2;
		riser.rotation.y = treadParams[2].angleY;

		//Меняем размер подступенка, riserFix рассчитывается в calcWndTread1Points

		//if (hasTurnRack) offsetX -= 0.01;

		//смещаем базовую точку на острый угол внешней стороны марша
		riser.children[0].geometry.translate(offsetX, 0, 0)
		riser.position.x = tread2.position.x + (treadParams[2].stepWidthY) + 0.01;
		tread2.position.x -= 0.01; //корректинуем позицию чтобы не было пересечений
		riser.position.y = (turnFactor > 0 ? riserPar.width : 0) + par.h - params.treadThickness + 0.1;
		riser.position.z = tread2.position.z + treadParams[2].stepWidthX * turnFactor;
		if (turnFactor < 0) riser.rotation.x = -Math.PI;
		if (turnFactor < 0) {
			riser.position.z += params.riserThickness / 2 / Math.cos(treadParams[3].edgeAngle);
			riser.position.x += params.riserThickness / 2 / Math.sin(treadParams[3].edgeAngle);
		}


		risers.add(riser);
	}

	/*добавляем к параметрам*/

	par.treads = treads;
	par.risers = risers;
	par.params = treadParams;

	//сохряняем данные для спецификации


	return par;

} //end of drawWndTreadsMetal

/**
	Создает отверстия в геометрии
	@param {geometry} geom геометия в готорой нужно создать отверстие

	@param holeShape (если отверстие не квадратное)

	если отсутствует шейп то отверстие квадратное
	@param holeBasePoint - базовая точка отверстия
	@param holeWidth - ширина
	@param holeHeight  - высота
	@param holeDepth - глубина
	@param dxfBasePoint - базовая точка в dxf

	@return {geometry}
*/
function drawNotchInMesh(par){
	var geom = par.geom;
	if (geom) {
		//преобразуем геометрию в BSP объект
		var geomBSP = new ThreeBSP(geom);
		var holeShape = par.holeShape;
		if (!holeShape) {
			// Точки отверстия
			var p1 = newPoint_xy(par.holeBasePoint, par.holeWidth, 0);
			var p2 = newPoint_xy(p1, 0, par.holeHeight );
			var p3 = newPoint_xy(p2, -par.holeWidth, 0);
			var p4 = newPoint_xy(p3, 0, -par.holeHeight);

			var points = [p1, p2, p3, p4];

			//Параметры шейпа
			var shapePar = {
				points: points,
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: par.dxfBasePoint,
				markPoints: false, //пометить точки в dxf для отладки
			}
			holeShape = drawShapeByPoints2(shapePar).shape;
		}
		var extrudeOptions = {
			amount: par.holeDepth,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};
		//преобразуем шейп отверстия в геометрию
		var holeGeom = new THREE.ExtrudeGeometry(holeShape, extrudeOptions);
		//преобразуем геометрию отверстия в BSP объект
		var holeBSP = new ThreeBSP(holeGeom);
		//Выдавливаем отверстие в столбе
		var geomBSP = geomBSP.subtract(holeBSP);
		//Преобразуем обратно в геометрию
		geom = geomBSP.toGeometry();
		par.geom = geom;
	}
	return par;
}

function drawWndTreadsMono(par) {
    /*функция отрисовывает блок забежных ступеней для лестниц монокосоур

    Исходные данные:
        botMarshId - id нижнего марша
        dxfBasePoint: dxfBasePoint, - базовая точка вставки контуров ступеней

    Возвращаемое значение:
    объект  turnSteps = {
        treads: treads; - мэши ступеней в виде единого 3D объекта
        params: treadParams; - массив параметров каждой ступени

    */
	
	var hasTurnRack = false;
	if (params.railingModel == "Деревянные балясины" || params.railingModel == "Дерево с ковкой" || params.railingModel == 'Стекло') {
		if (params.stairModel == 'Г-образная с забегом' || params.stairModel == 'Г-образная с площадкой') {
			hasTurnRack = getMarshParams(1).hasRailing.in || getMarshParams(3).hasRailing.in;
		}
		if (params.stairModel == 'П-образная трехмаршевая' && par.botMarshId == 1) {
			hasTurnRack = getMarshParams(1).hasRailing.in || getMarshParams(2).hasRailing.in;
		}
		if (params.stairModel == 'П-образная трехмаршевая' && par.botMarshId == 2) {
			hasTurnRack = getMarshParams(2).hasRailing.in || getMarshParams(3).hasRailing.in;
		}
		if (params.stairModel == 'П-образная с забегом' && par.turnId == 1) {
			hasTurnRack = getMarshParams(1).hasRailing.in;
		}
		if (params.stairModel == 'П-образная с забегом' && par.turnId == 2) {
			hasTurnRack = getMarshParams(3).hasRailing.in;
		}
	}

	var rackSize = 95;
	
	if(params.calcType == "mono") par.type = "mono";

	//константы
	var stepWidthLow = 40 + 5 + 5; //40мм размер стойки, по 5мм свес


	//параметры марша
	var marshPar = getMarshParams(par.botMarshId);

	par.h = marshPar.h_topWnd;

    var treadParams = [];
    var treads = new THREE.Object3D();
	var risers = new THREE.Object3D();

	/*забежная ступень 1*/

	//задаем параметры ступени
	var treadZOffset = 0; //смещение ступени к центру поворота

	treadParams[1] = {
		treadWidth: params.M,
		edgeAngle: Math.PI / 6,
		stepWidthLow: stepWidthLow,
		dxfBasePoint: par.dxfBasePoint,
		treadId: 1,
		hasTurnRack: hasTurnRack,
		isTread: true,
		turnId: par.turnId,
		marshId: par.botMarshId,
		turnId: par.turnId
	};

	var tread1 = drawWndTread1(treadParams[1]).mesh;

	tread1.rotation.x = -Math.PI / 2;
	tread1.rotation.z = -Math.PI / 2;

	tread1.position.x = 0;
	tread1.position.y = -params.treadThickness + 0.02;
	tread1.position.z = -(treadParams[1].treadWidth - treadZOffset + 0.01) / 2 * turnFactor;
	treads.add(tread1);

	/*забежная ступень 2*/
    par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 2000, 0);

	//задаем параметры ступени

		treadParams[2] = {
			treadWidthX: params.M,
			treadWidthY: params.M + 40 + 5, //40мм стойка, 5мм свес
			angleX: 30 * Math.PI / 180,
			angleY: 30 * Math.PI / 180, // было 30
			innerOffsetX: 25,
			innerOffsetY: 130, //130, //так исторически сложилось
			//outerOffsetY: 200,
			dxfBasePoint: par.dxfBasePoint,
			marshId: par.botMarshId,
			hasTurnRack: hasTurnRack,
			isTread: true,
		};

	var tread2 = drawWndTread2(treadParams[2]).mesh;

	tread2.rotation.x = -Math.PI / 2;
	tread2.rotation.z = -Math.PI / 2;
	tread2.position.x = -treadParams[2].stepWidthY + params.M + 45;
	tread2.position.y = par.h - params.treadThickness + 0.02;
	tread2.position.z = -(treadParams[2].treadWidthX /2 + 0.01) * turnFactor;

	treads.add(tread2);

	/*забежная ступень 3*/
	par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 3000, 0);

	//задаем параметры ступени

	treadParams[3] = {
		treadWidth: params.M,
		innerOffset: 0,
		outerOffset: 0,
		edgeAngle: Math.PI / 6,
		stepWidthLow: stepWidthLow,
		dxfBasePoint: par.dxfBasePoint,
		treadId: 3,
		
		hasTurnRack: hasTurnRack,
		isTread: true,
		marshId: par.botMarshId
	};

	if (turnFactor == -1) treadParams[3].dxfBasePoint.x -= params.M * 2;

	//удлиннение последней ступени
	if(par.plusMarshDist) treadParams[3].stepWidthLow = params.marshDist + 5 + 5;

	//удлиннение последней ступени при 0 ступеней в верхнем марше
	var deltaLen = 0;
	var isLastTread = false;
	if (params.stairAmt3 == 0) {
		if (params.stairModel == "Г-образная с забегом") isLastTread = true;
		if (params.stairModel != "Г-образная с забегом" && par.turnId == 2) isLastTread = true;
		}
	if (isLastTread) {
		treadParams[3].notchLastRiser = true;
		deltaLen = params.lastWinderTreadWidth - treadParams[3].stepWidthLow;
	}

	treadParams[3].stepWidthLow += deltaLen

	var tread3 = drawWndTread1(treadParams[3]).mesh;

	tread3.rotation.x = -Math.PI / 2;
	//	tread3.rotation.y = -Math.PI;
	tread3.position.x = params.M + 45;
	tread3.position.y = par.h * 2 - params.treadThickness + 0.02;
	tread3.position.z = (params.M / 2 + treadParams[3].stepWidthLow - 5 - 0.01) * turnFactor;

	if(turnFactor == -1){
		tread3.rotation.z = Math.PI;
		}

	treads.add(tread3);


    /*добавляем к параметрам*/
    par.treads = treads;
	par.risers = risers;
    par.params = treadParams;

    return par;

} //end of drawWndTreadsMono

function drawWndTreadsCurve(par) {
    /*функция отрисовывает блок забежных ступеней для лестниц монокосоур

    Исходные данные:
        botMarshId - id нижнего марша
        dxfBasePoint: dxfBasePoint, - базовая точка вставки контуров ступеней

    Возвращаемое значение:
    объект  turnSteps = {
        treads: treads; - мэши ступеней в виде единого 3D объекта
        params: treadParams; - массив параметров каждой ступени

    */

	var hasTurnRack = false;
	if (params.railingModel == "Деревянные балясины" || params.railingModel == "Дерево с ковкой" || params.railingModel == 'Стекло') {
		if (params.stairModel == 'Г-образная с забегом' || params.stairModel == 'Г-образная с площадкой') {
			hasTurnRack = getMarshParams(1).hasRailing.in || getMarshParams(3).hasRailing.in;
		}
		if (params.stairModel == 'П-образная трехмаршевая' && par.botMarshId == 1) {
			hasTurnRack = getMarshParams(1).hasRailing.in || getMarshParams(2).hasRailing.in;
		}
		if (params.stairModel == 'П-образная трехмаршевая' && par.botMarshId == 2) {
			hasTurnRack = getMarshParams(2).hasRailing.in || getMarshParams(3).hasRailing.in;
		}
		if (params.stairModel == 'П-образная с забегом' && par.turnId == 1) {
			hasTurnRack = getMarshParams(1).hasRailing.in;
		}
		if (params.stairModel == 'П-образная с забегом' && par.turnId == 2) {
			hasTurnRack = getMarshParams(3).hasRailing.in;
		}
	}

	var rackSize = 95;

	if (params.calcType == "mono") par.type = "mono";

	//константы
	var stepWidthLow = 40 + 5 + 5; //40мм размер стойки, по 5мм свес


	//параметры марша
	var marshPar = getMarshParams(par.botMarshId);

	par.h = marshPar.h_topWnd;

	var treadParams = [];
	var treads = new THREE.Object3D();
	var risers = new THREE.Object3D();

	var pointsWndTreads = calcPointsWndTreads().pointsTreads;

	for (var i = 0; i < pointsWndTreads.length; i++) {
		var points = pointsWndTreads[i];
		points = moovePoints(points, {x: - params.M / 2, y: 0})
		//создаем шейп
		var shapePar = {
			points: points,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: par.dxfBasePoint,
			markPoints: false, //пометить точки в dxf для отладки		
		};

		//параметры для рабочего чертежа
		shapePar.drawing = {
			name: "Забежная ступень " + i,
			group: "wndTreads",
			baseLine: {
				p1: shapePar.points[0],
				p2: shapePar.points[shapePar.points.length - 1],
			},
		}

		var shape = drawShapeByPoints2(shapePar).shape;

		var extrudeOptions = {
			amount: params.treadThickness,
			bevelEnabled: false,
			curveSegments: 12,
			steps: 1
		};

		var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		var mesh = new THREE.Mesh(geom, params.materials.tread);
		mesh.rotation.x = -Math.PI / 2*turnFactor;
		mesh.rotation.z = -Math.PI / 2;
		mesh.position.y = par.h * i + 0.02;
		if(turnFactor == 1) mesh.position.y -= params.treadThickness;
		mesh.userData.wndTreadParams = {
			angle: 0,//par.edgeAngle,
			treadId: i,
		}
		treads.add(mesh);

		par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 2000, 0);
	}




	/*добавляем к параметрам*/
	par.treads = treads;
	par.risers = risers;
	par.params = treadParams;

	return par;

} //end of drawWndTreadsMono

function drawWndTreadsTimber(par){

	/*функция отрисовывает блок забежных ступеней для полностью деревянных
	Исходные данные:

		h: params.h, - подъем ступени
		turnFactor: turnFactor, - к-т направления поворота: 1 или -1
		dxfBasePoint: dxfBasePoint, - базовая точка вставки контуров ступеней


	Возвращаемое значение:
	объект  turnSteps = {
		meshes: treads; - мэши ступеней в виде единого 3D объекта
		params: treadParams; - массив параметров каждой ступени

	*/
	var techDelta = 0;
	if (testingMode) techDelta = 0.01;
	//параметры марша
	var marshPar = getMarshParams(par.botMarshId);
	//параметры поворота
	var turnPar = calcTurnParams(par.botMarshId);

	par.h = marshPar.h;
	par.h_topWnd = marshPar.h_topWnd;

	var dxfBasePoint = par.dxfBasePoint;
	var topMarshOffset = 0; //заглушка
	var	material = params.materials.tread;
	var treadParams = [];
	var treads = new THREE.Object3D();
	var risers = new THREE.Object3D();

	var ledgeWidth = params.stringerSlotsDepth + 5; //ширина выступа ступени

	//отступ ступени от внешней тетивы
	var treadZOffset = 0;
	if(params.model != "косоуры") treadZOffset = params.stringerThickness - params.stringerSlotsDepth;
	var minNotchOffset = 10; //минимальный отступ паза от задней плоскости столба

	var rackToStepDim_3 = 10;	// расстояние от грани столба до паза для третьей ступени

	/*забежная ступень 1*/

	var treadWidth = params.M - treadZOffset + turnPar.newellPosZ - params.rackSize/2 + params.stringerSlotsDepth;


	//задаем параметры ступени

	treadParams[1] = {
		treadWidth: treadWidth,
		edgeAngle: Math.PI / 6,
		stepWidthLow: params.rackSize - turnPar.notchOffset1 - minNotchOffset,
		innerOffset: 0,
		outerOffset: 0,
		dxfBasePoint: par.dxfBasePoint,
		treadId: 1,
		turnId: par.turnId,
		techDelta: techDelta * 2,
	};
	if (marshPar.topTurn == 'забег' && marshPar.hasRailing.out && params.model == 'косоуры') {
		treadParams[1].outNotch = {x: params.rackSize, y: params.nose};
	}

	//выступы ступени чтобы она входила в паз под прямым углом (только для лестницы без подступенков)
	if(params.riserType == "нет"){
		//внутренняя сторона
		treadParams[1].innerOffset = ledgeWidth;
		//внешняя сторона
		if(params.model=="тетивы") {
			treadParams[1].innerOffset = ledgeWidth;
			treadParams[1].outerOffset = ledgeWidth;
			}
		}

	//ширина ступени на внутренней стороне марша
	if(params.riserType == "есть") {
		treadParams[1].stepWidthLow -= params.riserThickness / Math.cos(treadParams[1].edgeAngle);
		//учитываем что отступ minNotchOffset должен получиться на расстоянии stringerSlotsDepth от края ступени
		treadParams[1].stepWidthLow -= params.stringerSlotsDepth * Math.tan(treadParams[1].edgeAngle);
	}

	var tread1 = drawWndTread1(treadParams[1]).mesh;
	tread1.rotation.x = -Math.PI / 2;
	tread1.rotation.z = -Math.PI / 2;

	tread1.position.x = 0;
	tread1.position.y = -params.treadThickness + techDelta;
	tread1.position.z = -(params.M / 2 - treadZOffset) * turnFactor;

	treads.add(tread1);

	/*подступенок 1*/

	if(params.riserType == "есть"){
		var riserPar = {
			len: treadParams[1].treadWidth,
			width: par.h,//par.turnId == 1 ? par.h : par.h_topWnd,
			thk: params.riserThickness - 0.01,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: dxfBasePoint,
			hasTopScrews: true,
			hasBotScrews: true
		};
		if (params.stairModel == 'П-образная с забегом') riserPar.width = par.turnId == 1 ? par.h : par.h_topWnd;
		if (marshPar.stairAmt == 0) riserPar.width -= params.treadThickness;

		//отрисовка
		riserPar.modifyKey = 'riserWnd:' + par.marshId + ':1';
		riserPar = drawRectRiser(riserPar);
		riser = riserPar.mesh;
		riser.rotation.z = Math.PI / 2;
		riser.rotation.y = Math.PI / 2 * turnFactor;
		riser.position.x = params.nose;
		riser.position.y = - riserPar.width - params.treadThickness;
		riser.position.z = tread1.position.z;

		if (turnFactor < 0) riser.position.x += params.riserThickness;

		risers.add(riser);
	}

	/*забежная ступень 2*/

	dxfBasePoint = newPoint_xy(dxfBasePoint, 1500, 0);
	var notchDepthX = 45;
	var notchDepthY = 45;

	if (params.riserType == "есть") {
		notchDepthX = 10 + 5 * Math.tan(Math.PI/6) + params.nose/Math.cos(Math.PI/6) + params.stringerSlotsDepth * Math.tan(Math.PI/6) - params.stringerSlotsDepth;
		notchDepthY = 10 + (params.riserThickness + params.nose) / Math.cos(Math.PI / 6) - 5 * Math.tan(Math.PI / 6) - params.stringerSlotsDepth;
	}

	//задаем параметры ступени

	treadParams[2] = {
		treadWidthX: treadWidth + notchDepthX,
		treadWidthY: treadWidth + notchDepthY,
		angleX: Math.PI / 6,
		angleY: Math.PI / 6,
		outerOffsetX: ledgeWidth,
		outerOffsetY: 0,
		innerOffsetX: notchDepthX + ledgeWidth,
		innerOffsetY: notchDepthY + ledgeWidth,
		notchDepthX: notchDepthX,
		notchDepthY: notchDepthY,
		dxfBasePoint: par.dxfBasePoint,
		treadId: 2,
		techDelta:techDelta * 2,
		};

	if (params.riserType == "есть") treadParams[2].innerOffsetY = notchDepthY;
	if (params.model == "косоуры") treadParams[2].outerOffsetX = 0;
	if(params.model == "тетивы" && params.riserType == "нет") treadParams[2].outerOffsetY = ledgeWidth;

	//отрисовываем ступень
	treadParams[2].marshId = par.botMarshId;
	var tread2 = drawWndTread2(treadParams[2]).mesh;

	tread2.rotation.x = -Math.PI / 2;
	tread2.rotation.z = -Math.PI / 2;
	//позиция считается так, чтобы внешний угол оказался в проектном положении
	tread2.position.x = -treadParams[2].stepWidthY + params.M + turnPar.topMarshOffsetX - treadZOffset;
	tread2.position.y = par.h_topWnd - params.treadThickness + techDelta;
	tread2.position.z = -(params.M / 2 - treadZOffset) * turnFactor;

	treads.add(tread2);

	/*подступенок 2*/

	if(params.riserType == "есть"){

		var riserPar = {
			height: par.h_topWnd,
			thk: params.riserThickness - 0.02,
			ang: -Math.PI / 6,
			width: params.M - params.stringerThickness - params.stringerThickness/2 - params.rackSize/2,
			material: par.riserMaterial,
			dxfBasePoint: dxfBasePoint,
			dxfPrimitivesArr: par.isTrash ? dxfPrimitivesArr0 : dxfPrimitivesArr
        };

		if((params.model=="косоуры" || params.model=="тетива+косоур")) {
			riserPar.width = params.M  - params.rackSize;
			if(params.model=="тетива+косоур") riserPar.width -= params.stringerThickness;
		}
		riserPar.height -= techDelta * 2;//В момент тестирования чуть чуть ужимаем подступенок
		riserPar =  drawWinderRiser(riserPar);
		var riser2 = riserPar.mesh;

		var displacementZ = ((6 * Math.cos(riserPar.ang)) / Math.tan(riserPar.ang) - params.riserThickness) * Math.sin(riserPar.ang) + 1;	// 1 Подогнано, т.к. позиция неверная// перемещение базовой точки подступенка на шстрый угол для удобства позиционирования, 6 = длина фаски

		riser2.rotation.y = -Math.PI / 2;
		riser2.position.y -= params.treadThickness - techDelta;
		riser2.position.x = -displacementZ * Math.tan(riserPar.ang) + treadParams[1].stepWidthLow + params.riserThickness / Math.cos(riserPar.ang);
		riser2.position.z = riser.position.z + (treadParams[1].treadWidth - (displacementZ - 0.01)) * turnFactor;

		if (turnFactor < 0) {
			riser2.rotation.z = -Math.PI;
			riser2.position.y += riserPar.height;
		}

		risers.add(riser2);
	}

	/*забежная ступень 3*/

	dxfBasePoint = newPoint_xy(dxfBasePoint, 2000, 0);

	var stepWidthLow = turnPar.notchOffset2 + params.nose - minNotchOffset;
	if(params.riserType == "нет") stepWidthLow = params.rackSize - minNotchOffset * 2;

	// учитываем межмаршевое расстояние
	if (par.plusMarshDist) {
		stepWidthLow = params.marshDist + params.stringerThickness * 2 + (params.rackSize - params.stringerThickness) - minNotchOffset - (params.rackSize - turnPar.notchOffset1) + params.nose;
		if (params.model=="косоуры" || params.model=="тетива+косоур") {
			stepWidthLow = params.marshDist + params.rackSize - minNotchOffset + turnPar.notchOffset1 + params.nose;
		}
		if (params.riserType == "нет") {
			if (params.model=="косоуры" || params.model=="тетивы") stepWidthLow += 30;
			else stepWidthLow += 41.5;
		}
	}

	var thirdTreadFix = 0;
	if (params.riserType == 'нет') {
		thirdTreadFix = 20;
		if (params.model == 'тетивы' && !(params.stairModel == 'П-образная с забегом' && par.turnId == 1)) {
			thirdTreadFix += 2.5;
		}
		if (params.model == 'косоуры' && params.stairModel == 'П-образная с забегом' && par.turnId == 1) {
			thirdTreadFix += 10;
		}
	}
	
	stepWidthLow -= thirdTreadFix;

	treadParams[3] = {
		treadWidth: treadWidth,
		innerOffset: ledgeWidth,
		outerOffset: ledgeWidth,
		edgeAngle: Math.PI / 6,
		stepWidthLow: stepWidthLow,
		dxfBasePoint: par.dxfBasePoint,
		treadId: 3,
		turnId: par.turnId,
		techDelta: techDelta * 2,
		};

	if (params.model == "косоуры") treadParams[3].outerOffset = 0;
	var tread3 = drawWndTread1(treadParams[3]).mesh;
	tread3.rotation.x = -Math.PI / 2;
	//tread3.rotation.y = -Math.PI;

	tread3.position.x = params.M + turnPar.topMarshOffsetX - treadZOffset;
	tread3.position.y = par.h_topWnd * 2 - params.treadThickness + techDelta;
	//позиция считается от переднего угла на внутренней стороне
	tread3.position.z = (params.M / 2 - (params.rackSize - params.stringerThickness) / 2 - params.stringerThickness + treadParams[3].stepWidthLow + rackToStepDim_3) * turnFactor;

	if(params.model=="косоуры" || params.model=="тетива+косоур") tread3.position.z = (params.M / 2 - params.rackSize + treadParams[3].stepWidthLow + rackToStepDim_3) * turnFactor;
	
	
	
	if(turnFactor == -1){
		tread3.rotation.z = Math.PI;
		}

	treads.add(tread3);

	/*подступенок 3*/

	if(params.riserType == "есть"){
		var riserPar = {
			height: par.h_topWnd,
			thk: params.riserThickness - 0.05,
			ang: -Math.PI / 6,
			width: params.M - params.stringerThickness - params.stringerThickness/2 - params.rackSize/2,
			material: par.riserMaterial,
			dxfBasePoint: dxfBasePoint,
			dxfPrimitivesArr: par.isTrash ? dxfPrimitivesArr0 : dxfPrimitivesArr
        };
		if((params.model=="косоуры" || params.model=="тетива+косоур")) {
			riserPar.width = params.M  - params.rackSize;
			if(params.model=="тетива+косоур") riserPar.width -= params.stringerThickness;
		}
		riserPar.height -= techDelta * 2;// Чуть чуть ужимаем подступенок в момент теститрования
		riserPar =  drawWinderRiser(riserPar);
		var riser = riserPar.mesh;

		riser.rotation.z = - Math.PI;
		riser.position.x = tread2.position.x + displacementZ - (treadParams[2].treadWidthY - treadParams[2].stepWidthY) + treadParams[2].innerOffsetY - thirdTreadFix;
		riser.position.z = tread2.position.z + ((displacementZ - 0.025) * Math.tan(riserPar.ang) + treadParams[2].treadWidthX) * turnFactor;
		riser.position.y = riserPar.height * 2 - params.treadThickness + techDelta * 3;

		if (turnFactor < 0){
			riser.rotation.x = Math.PI;
			riser.position.y -= riserPar.height;
		}

		risers.add(riserPar.mesh);
	}

	/*формируем возвращаемый объект*/

	var turnSteps = {
		treads: treads,
		risers: risers,
		params: treadParams,
		};

	return turnSteps;

} //end of drawWndTreadsTimber

/* *функция отрисовывает блок забежных ступеней деревянных лестниц серии эконом

    Исходные данные:
        botMarshId - id нижнего марша
        dxfBasePoint: dxfBasePoint, - базовая точка вставки контуров ступеней

    Возвращаемое значение:
    объект  turnSteps = {
        treads: treads; - мэши ступеней в виде единого 3D объекта
        params: treadParams; - массив параметров каждой ступени

    */


function drawWndTreadsTimber_stock(par) {

	var hasTurnRack = false;
	var rackLedge = 5; //выступ ступеней относительно плоскости столба

	// var screwPar = {
	// 	id: "screw_8x80",
	// 	description: "Крепление ступеней",
	// 	group: "Ступени"
	// }

	//константы
	var stepWidthLow = params.rackSize; //40мм размер стойки, по 5мм свес


	//параметры марша
	var marshPar = getMarshParams(par.botMarshId);

	par.h = marshPar.h_topWnd;

    var treadParams = [];
    var treads = new THREE.Object3D();
	var risers = new THREE.Object3D();

	/*забежная ступень 1*/

	//задаем параметры ступени
	var treadZOffset = 0; //смещение ступени к центру поворота

	treadParams[1] = {
		treadWidth: params.M + rackLedge,
		edgeAngle: 25 / 180 * Math.PI, //подогнано чтобы свес на внешней стороне марша при ширине 900 был 20мм
		stepWidthLow: params.rackSize + params.nose,
		dxfBasePoint: par.dxfBasePoint,
		treadId: 1,
		hasTurnRack: hasTurnRack,
		isTread: true,
		marshId: par.botMarshId,
		turnId: par.turnId
	};
	if (params.riserType == "есть"){
		treadParams[1].stepWidthLow += params.riserThickness;
	}

	var tread1 = drawWndTread1(treadParams[1]).mesh;

	tread1.rotation.x = -Math.PI / 2;
	tread1.rotation.z = -Math.PI / 2;

	tread1.position.x = 0;
	tread1.position.y = -params.treadThickness + 0.02;
	tread1.position.z = -params.M / 2 * turnFactor;

	// var screw = drawScrew(screwPar).mesh;
	// screw.position.x = treadParams[1].stepWidthHi / 2;
	// screw.rotation.y = Math.PI / 2
	// screw.position.z = -params.M / 2 + 55 + params.stringerThickness / 2;
	// if(!testingMode) treads.add(screw);
	/*
	if (params.riserType == "есть"){
		tread1.position.x -= params.riserThickness;
	}
	*/
	treads.add(tread1);
	
		/*подступенок 1*/

	if(params.riserType == "есть"){
		var riserPar = {
			len: treadParams[1].treadWidth,
			width: par.h,//par.turnId == 1 ? par.h : par.h_topWnd,
			thk: params.riserThickness - 0.01,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: dxfBasePoint,
			hasTopScrews: true,
			hasBotScrews: true,
			treadId: 1,
		};
		if (params.calcType == 'timber_stock') riserPar.width = marshPar.h
		//if (params.stairModel == 'П-образная с забегом') riserPar.width = par.turnId == 1 ? par.h : par.h_topWnd;
		if (marshPar.stairAmt == 0) riserPar.width -= params.treadThickness;

		//отрисовка
		riserPar.modifyKey = 'riserWnd:' + par.marshId + ':1';
		riserPar = drawRectRiser(riserPar);
		riser = riserPar.mesh;
		riser.rotation.z = Math.PI / 2;
		riser.rotation.y = Math.PI / 2 * turnFactor;
		riser.position.x = params.nose;
		riser.position.y = - riserPar.width - params.treadThickness;
		riser.position.z = tread1.position.z;

		if (turnFactor < 0) riser.position.x += params.riserThickness;

		risers.add(riser);
	}

	/*забежная ступень 2*/
	par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 2000, 0);

	//задаем параметры ступени
	treadParams[2] = {
		treadWidthX: params.M,
		treadWidthY: params.M + rackLedge, //40мм стойка, 5мм свес
		angleX: 30 * Math.PI / 180,
		angleY: 35 / 180 * Math.PI, //подогнано чтобы свес на внешней стороне марша при ширине 900 был 20мм
		innerOffsetX: params.rackSize,
		innerOffsetY: params.rackSize,
		dxfBasePoint: par.dxfBasePoint,
		marshId: par.botMarshId,
		hasTurnRack: hasTurnRack,
		isTread: true,
	};

	var tread2 = drawWndTread2(treadParams[2]).mesh;

	tread2.rotation.x = -Math.PI / 2;
	tread2.rotation.z = -Math.PI / 2;
	tread2.position.x = -treadParams[2].stepWidthY + params.M + params.nose;
	tread2.position.y = par.h - params.treadThickness + 0.02;
	tread2.position.z = -(treadParams[2].treadWidthX /2 + 0.01) * turnFactor;
	if (params.riserType == "есть")	tread2.position.x += params.riserThickness;

	treads.add(tread2);

	// var screw = drawScrew(screwPar).mesh;
	// screw.position.x = params.M - treadParams[2].stepWidthY / 2;
	// screw.rotation.y = Math.PI / 2
	// screw.position.y = par.h;
	// screw.position.z = -params.M / 2 + 55 + params.stringerThickness / 2;
	// if(!testingMode) treads.add(screw);
	
	
	/*подступенок 2*/

	if (params.riserType == "есть") {
		var riserPar = {
			len: treadParams[1].treadWidth / Math.cos(treadParams[1].edgeAngle),
			width: par.h,
			ang: treadParams[1].edgeAngle * turnFactor,
			thk: params.riserThickness,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: dxfBasePoint,
			hasTopScrews: true,
			hasBotScrews: true,
			treadId: 2
		};
		if (hasTurnRack && treadParams[1].riserFix) {//Меняем размер подступенка, riserFix рассчитывается в calcWndTread1Points
			riserPar.cutWndIn = treadParams[1].riserFix / Math.cos(treadParams[1].edgeAngle);
		}
		
		//отрисовка
		riserPar.modifyKey = 'riserWnd:' + par.marshId + ':2';
		riserPar = drawRectRiser(riserPar);
		riser = riserPar.mesh;

		riser.rotation.z = Math.PI / 2;
		riser.rotation.y = (Math.PI / 2 - treadParams[1].edgeAngle) * turnFactor;
		//базовая точка - внешний дальний угол ступени		
		riser.position.x = tread1.position.x + treadParams[1].stepWidthHi + 0.01;
		if(turnFactor == -1) riser.position.x += params.riserThickness / Math.cos(treadParams[1].edgeAngle);
		riser.position.y = -params.treadThickness + 0.01;
		riser.position.z = tread1.position.z;
		
		risers.add(riser);
	}

	/*забежная ступень 3*/
	par.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 3000, 0);

	//задаем параметры ступени

	treadParams[3] = {
		treadWidth: params.M + rackLedge,
		innerOffset: 0,
		outerOffset: 0,
		edgeAngle: Math.PI / 6,
		stepWidthLow: params.rackSize,
		dxfBasePoint: par.dxfBasePoint,
		treadId: 3,
		turnId: par.turnId,
		hasTurnRack: hasTurnRack,
		isTread: true,
		marshId: par.botMarshId
	};

	// учитываем межмаршевое расстояние
	if (par.plusMarshDist) {
		treadParams[3].stepWidthLow += params.marshDist;
		treadParams[3].deltaLen = params.marshDist;
	}

	var tread3 = drawWndTread1(treadParams[3]).mesh;

	tread3.rotation.x = -Math.PI / 2;

	tread3.position.x = params.M + params.nose;
	if (params.riserType == "есть")	tread3.position.x += params.riserThickness;
	tread3.position.y = par.h * 2 - params.treadThickness + 0.02;
	tread3.position.z = (params.M / 2 - 0.01) * turnFactor;
	if (par.plusMarshDist) tread3.position.z += params.marshDist * turnFactor

	if(turnFactor == -1){
		tread3.rotation.z = Math.PI;
	}

	// var screw = drawScrew(screwPar).mesh;
	// screw.position.x = params.M + params.stringerThickness / 2;
	// screw.rotation.y = Math.PI / 2;
	// screw.position.y = par.h * 2;
	// screw.position.z = 100;
	// if(!testingMode) treads.add(screw);

	treads.add(tread3);

	
	/*подступенок 3*/

	if (params.riserType == "есть") {
		var riserPar = {
			len: (treadParams[2].treadWidthY - treadParams[2].innerOffsetY) / Math.cos(treadParams[2].angleY) - 5,
			width: par.h,
			ang: treadParams[2].angleY,
			thk: params.riserThickness,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: dxfBasePoint,
			hasTopScrews: true,
			hasBotScrews: true,
			treadId: 3
		};
		// var offsetX = -(riserPar.len - riserPar.thk * Math.tan(riserPar.ang));
		riserPar.offsetX = 1;

		//отрисовка
		riserPar.modifyKey = 'riserWnd:' + par.marshId + ':3';
		riserPar = drawRectRiser(riserPar);
		riser = riserPar.mesh;

		riser.rotation.z = -Math.PI / 2;
		riser.position.z = -params.M / 2
		riser.rotation.z = -Math.PI / 2;
		riser.rotation.y = treadParams[2].angleY;
		riser.position.x = tread2.position.x - (treadParams[2].treadWidthY - treadParams[2].stepWidthY) + treadParams[2].innerOffsetY + 0.01 + 5;
		tread2.position.x -= 0.01; //корректинуем позицию чтобы не было пересечений
		riser.position.y = (turnFactor > 0 ? riserPar.width : 0) + par.h - params.treadThickness + 0.1;
		riser.position.z = tread2.position.z + treadParams[2].treadWidthX * turnFactor - 5 * Math.tan(treadParams[2].angleY);//
		if (turnFactor < 0) riser.rotation.x = -Math.PI;
		/*
		//смещаем базовую точку на острый угол внешней стороны марша
		riser.children[0].geometry.translate(-(riserPar.len + riserPar.thk * Math.tan(riserPar.ang)), 0, 0)
		riser.rotation.y = treadParams[2].angleY;

	
		riser.position.x = tread2.position.x + (treadParams[2].stepWidthY) + 0.01;
		tread2.position.x -= 0.01; //корректинуем позицию чтобы не было пересечений
		riser.position.y = (turnFactor > 0 ? riserPar.width : 0) + par.h - params.treadThickness + 0.1;
		riser.position.z = tread2.position.z + treadParams[2].stepWidthX * turnFactor;
		if (turnFactor < 0) riser.rotation.x = -Math.PI;
		*/
		
		risers.add(riser);
	}

    /*добавляем к параметрам*/
    par.treads = treads;
	par.risers = risers;
    par.params = treadParams;

    return par;

} //end of drawWndTreadsTimber_stock


function calcTreadLen() {
	var treadLen = params.M;
	var treadPar = getTreadParams(); //функция в файле calcSpecGeneral.js
	if (params.model == "лт") {
		treadLen -= params.stringerThickness * 2;
		if (treadPar.material != "metal") treadLen -= 10;
		if (params.calcType == 'bolz') {
			treadLen += params.stringerThickness;
			if (treadPar.material != "metal") treadLen += 5;
		}
	}
	if (params.model == "тетивы") {
		treadLen -= params.stringerThickness * 2 - params.stringerSlotsDepth * 2;
	}
	if (params.model == "тетива+косоур") {
		treadLen -= params.stringerThickness - params.stringerSlotsDepth;
	}
	if (params.calcType == "timber") {
		if (params.model === "тетивы") {
			return params.M - params.stringerThickness * 2 + params.stringerSlotsDepth * 2;
		}
		if (params.model === "тетива+косоур") {
			return params.M - params.stringerThickness + params.stringerSlotsDepth;
		}
	}

	if (params.calcType == "vhod") {
		treadLen = params.M - params.stringerThickness * 2;
		if (params.stairType == 'дпк' || params.stairType == 'лиственница тер.') treadLen -= 6;
	}

	return treadLen;

}//end of calcTreadWidth

function timberBlockfunctions(){};

/**
 * функция возвращает размеры вырезов на ступенях марша под столбы
 * @param marshId
 * @returns {{botIn: {x: number, y: number}, botOut: {x: number, y: number}, topIn: {x: number, y: number}, topOut: {x: number, y: number}}}
 */
function calcMarshNotches(marshId){

	var notches = {
		botIn: {x: 0, y:0},
		botOut: {x: 0, y:0},
		topIn: {x: 0, y:0},
		topOut: {x: 0, y:0},
	};

	var marshPar = getMarshParams(marshId);
	var railingSide = marshPar.railingSide;
	var lastMarsh = marshPar.lastMarsh;
	var topMarshXOffset = -10;
	var topMarshZOffset = -30;
	var model = params.model;
	var topTreadWidth = 40;

	if (params.stairModel == 'Прямая' && !(params.calcType == 'timber' || params.calcType == 'timber_stock')) {
		if (railingSide !== 'две' && railingSide !== 'нет') {
			railingSide = railingSide == 'внешнее' ? 'внутреннее' : 'внешнее';
		}
	}

	//снизу пол
	if(marshPar.botTurn == "пол"){
		if(model == "тетивы" || model == "тетива+косоур"){
			if (railingSide == 'внутреннее' || railingSide == 'две') {
				notches.botIn = {
					x: params.nose + 0.01,
					y: params.rackSize / 2 - params.stringerThickness / 2 + params.stringerSlotsDepth + 0.01,
				};
			}
			if ((railingSide == 'внешнее' || railingSide == 'две') && model == 'тетивы') {
				notches.botOut = {
					x: params.nose + 0.01,
					y: params.rackSize / 2 - params.stringerThickness / 2 + params.stringerSlotsDepth + 0.01,
				};
			}
		}
	}

	//снизу поворот
	if(marshPar.botTurn != "пол"){
		if(model == "косоуры" || model == "тетива+косоур"){
			notches.botIn = {
				x: -topMarshZOffset + params.nose,
				y: params.rackSize - params.stringerSlotsDepth,
			};
		}
		if(model == "тетивы"){
			notches.botIn = {
				x: -topMarshZOffset + (params.rackSize - params.stringerThickness) / 2 + params.nose,
				y: (params.rackSize - params.stringerThickness) / 2,
			};
			if (params.stairModel == 'П-образная с площадкой') {
				notches.botIn = {
					x: 42.5,//(params.rackSize - params.stringerThickness) / 2 + params.nose,
					y: params.rackSize / 2 - params.stringerThickness / 2,// params.stringerSlotsDepth,
				};
			}
			if (marshPar.botTurn == "забег") notches.botIn.x -= 25;
		}
		if(params.calcType == "timber_stock"){
			notches.botIn = {
				x: params.nose,
				y: params.rackSize,
			};
		}
	}

	//сверху перекрытие
	if(marshPar.topTurn == "пол"){
		notches.topIn.x = topTreadWidth - params.riserThickness + 0.01;
		notches.topIn.y = params.rackSize;

		if(model == "тетивы") {
			notches.topIn.y = params.rackSize - (params.stringerThickness - params.stringerSlotsDepth);
			if(railingSide == "внутреннее" || railingSide == "две"){
				notches.topIn.y -= params.rackSize/2 - params.stringerThickness/2;
			}
		}

		notches.topOut.x = topTreadWidth - params.riserThickness + 0.01;
		notches.topOut.y = params.rackSize - (params.stringerThickness - params.stringerSlotsDepth);
		if(model == "косоуры") {
			notches.topOut.y = params.rackSize;
		}
		if(model == "тетивы" || model == "тетива+косоур") {
			if(railingSide == "внешнее" || railingSide == "две"){
				notches.topOut.y -= params.rackSize/2 - params.stringerThickness/2;
			}
		}

		if((railingSide == "внутреннее" || railingSide == "две") && params.stairModel !== 'П-образная с площадкой'){
		// notches.botIn = { x: params.nose, y: params.rackSize/2 - params.stringerThickness/2 + params.stringerSlotsDepth };
			if(model == "косоуры" || model == "тетива+косоур") {
				notches.botIn.y = params.rackSize;
			}
		}
	}

	//сверху поворот
	if(marshPar.topTurn != "пол"){
		if(model == "косоуры" || model == "тетива+косоур") {
			notches.topIn = {
				x: marshPar.a - (marshPar.b + topMarshXOffset) + 0.01,
				y: params.rackSize - params.stringerSlotsDepth
			};
			if (params.stairModel == 'П-образная с площадкой') {
				notches.topIn = {
					x: params.nose + 30,
					y: params.rackSize - params.stringerSlotsDepth
				};
			}
		}
		if(model == "тетивы"){
			notches.topIn = {
				x: marshPar.a - (marshPar.b - (params.rackSize - params.stringerThickness) / 2 + topMarshXOffset),
				y: (params.rackSize - params.stringerThickness) / 2
			};
			if(marshPar.topTurn == "забег") notches.topIn.x -= 20;
		}
	}

	//костыли
	if(params.calcType == "timber"){
		if (model == 'косоуры' && params.stairModel == 'П-образная трехмаршевая' && marshId == 3) {
			notches.botIn = {x:50,y:params.rackSize - params.stringerSlotsDepth}
		}

		if (marshId == 3 && (model == "косоуры" || model == "тетива+косоур") && params.calcType == 'timber') {
			notches.botIn = {
				x: -topMarshZOffset + params.nose,
				y: params.rackSize - params.stringerSlotsDepth,
			};
		}
	}
	
	for(var notch in notches){
		notches[notch].x += 0.01;
		notches[notch].y += 0.01;
	}

	return notches;
} //end of calcMarshNotches

/**
 * функция возвращает пластину с вырезами по углам
 * @param par
 * @returns {*}
 */
function drawNotchedPlate(par){

    /*
    par = {
        len
        width
        thk
        
        notches: {
			hasNothes: true,
		   botIn: {x: 0, y:0},
            botOut: {x: 0, y:0},
            topIn: {x: 0, y:0},
            topOut: {x: 0, y:0},
			middle
            }
        dxfArr
        dxfBasePoint
        }
    */

    if (!par.widthFull) par.widthFull = par.width;
   
    //пересчет внутренней/внешней стороны на правую/левую

    var notches = {
        botLeft: {x:0, y:0},
        botRight: {x:0, y:0},
        topLeft: {x:0, y:0},
        topRight: {x:0, y:0},
        middle: {x:0, y:0},
    };

    if(!par.notches.middle) par.notches.middle = {x:0, y:0};

    if(par.notches.hasNothes){

		notches = {
			botLeft: copyPoint(par.notches.botOut),
			botRight: copyPoint(par.notches.botIn),
			topLeft: copyPoint(par.notches.topOut),
			topRight: copyPoint(par.notches.topIn),
			middle: copyPoint(par.notches.middle)
		};

        if(params.turnSide == "левое"){
            notches = {
                botLeft: copyPoint(par.notches.botIn),
                botRight: copyPoint(par.notches.botOut),
                topLeft: copyPoint(par.notches.topIn),
                topRight: copyPoint(par.notches.topOut),
                middle: copyPoint(par.notches.middle)
            };
        }
    }

    var p0 = {x: 0, y: 0};
    /*левый нижний вырез*/
    var p1 = {x: notches.botLeft.x, y: 0};
    var p2 = {x: notches.botLeft.x, y: notches.botLeft.y};
    var p3 = {x: 0, y: notches.botLeft.y};
    /*средний вырез*/
    var p4 = {x: 0, y: (par.len-notches.middle.y)/2};
    var p5 = {x: notches.middle.x, y: (par.len-notches.middle.y)/2};
    var p6 = {x: notches.middle.x, y: (par.len+notches.middle.y)/2};
    var p7 = {x: 0, y: (par.len+notches.middle.y)/2};
    /*правый нижний вырез*/
    var p8 = {x: 0, y: par.len - notches.botRight.y};
    var p9 = {x: notches.botRight.x, y: par.len - notches.botRight.y};
    var p10 = {x: notches.botRight.x, y: par.len};
    /*правый верхний вырез*/
    var p11 = {x: par.width-notches.topRight.x, y: par.len};
    var p12 = {x: par.width-notches.topRight.x, y: par.len-notches.topRight.y};
    var p13 = {x: par.width, y: par.len-notches.topRight.y};
    /*левый верхний вырез*/
    var p14 = {x: par.width, y: notches.topLeft.y};
    var p15 = {x: par.width-notches.topLeft.x, y: notches.topLeft.y};
    var p16 = {x: par.width-notches.topLeft.x, y: 0};

    var p17 = {x: notches.botLeft.x, y: 0};

    var shape = new THREE.Shape();
		
    // if(p0.x != p1.x || p0.y != p1.y) addLine(shape, par.dxfArr, p0, p1, par.dxfBasePoint);
    if(p1.x != p2.x || p1.y != p2.y) addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
    if(p2.x != p3.x || p2.y != p3.y) addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
    if(p3.x != p4.x || p3.y != p4.y) addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint);
    if(p4.x != p5.x || p4.y != p5.y) addLine(shape, par.dxfArr, p4, p5, par.dxfBasePoint);
    if(p5.x != p6.x || p5.y != p6.y) addLine(shape, par.dxfArr, p5, p6, par.dxfBasePoint);
    if(p6.x != p7.x || p6.y != p7.y) addLine(shape, par.dxfArr, p6, p7, par.dxfBasePoint);
    if(p7.x != p8.x || p7.y != p8.y) addLine(shape, par.dxfArr, p7, p8, par.dxfBasePoint);
    if(p8.x != p9.x || p8.y != p9.y) addLine(shape, par.dxfArr, p8, p9, par.dxfBasePoint);
    if(p9.x != p10.x || p9.y != p10.y) addLine(shape, par.dxfArr, p9, p10, par.dxfBasePoint);
    if(p10.x != p11.x || p10.y != p11.y) addLine(shape, par.dxfArr, p10, p11, par.dxfBasePoint);
    if(p11.x != p12.x || p11.y != p12.y) addLine(shape, par.dxfArr, p11, p12, par.dxfBasePoint);
    if(p12.x != p13.x || p12.y != p13.y) addLine(shape, par.dxfArr, p12, p13, par.dxfBasePoint);
    if(p13.x != p14.x || p13.y != p14.y) addLine(shape, par.dxfArr, p13, p14, par.dxfBasePoint);
    if(p14.x != p15.x || p14.y != p15.y) addLine(shape, par.dxfArr, p14, p15, par.dxfBasePoint);
    if(p15.x != p16.x || p15.y != p16.y) addLine(shape, par.dxfArr, p15, p16, par.dxfBasePoint);
	if (p16.x != p17.x || p16.y != p17.y) addLine(shape, par.dxfArr, p16, p17, par.dxfBasePoint);

    var extrudeOptions = {
        amount: par.thk,
        bevelEnabled: false,
        curveSegments: 12,
        steps: 1
    };
	
    var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.rotateUV(Math.PI / 2);
    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
    par.mesh = new THREE.Mesh(geometry, params.materials.tread);

	//сохраняем данные для спецификации
	var treadPar = getTreadParams(); //функция в файле calcSpecGeneral.js
	
	var partName = "tread";
	if (params.stairType !== "лотки") {
		$.each(par.notches,
			function() {
				if (this.x && this.y) partName = "notchedTread";
			})
	}
	if(params.stairType == "нет") partName = false;
	
	if(par.partName) partName = par.partName;
	
	if(typeof specObj !='undefined' && partName){
		if(!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Ступень",
				area: 0,
				paintedArea: 0,
				metalPaint: treadPar.metalPaint,
				timberPaint: treadPar.timberPaint,
				division: treadPar.division,
				workUnitName: "amt",
				group: "treads",
			}
			if(partName == "notchedTread") specObj[partName].name = "Ступень с вырезами";
			if(partName == "shelf") {
				specObj[partName].name = "Полка с вырезами";
				specObj[partName].group = "additionalObjectsTimber";
			}
		}
		
		
		var area = par.len * par.widthFull / 1000000;
		var paintedArea = area * 2 + (par.len + par.widthFull) * 2 * par.thk / 1000000;

		var name = Math.round(par.len) + "x" + Math.round(par.widthFull) + "x" + par.thk;
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		specObj[partName]["paintedArea"] += paintedArea;
	}
	par.mesh.specId = partName + name;

	return par;

}//end of drawNotchedTread

/**функция рассчитывает кол-во и длину деталей площадки и добавляет во входящий объект
*@params par.len - длина площадки
*/

function calcPltPartsParams(par) {
	var minPartWidth = 30;
	if (params.stairType == 'дпк' || params.stairType == "лиственница тер.") {
		par.maxWidth = params.dpcWidth;
		par.partLen = par.maxWidth;
		par.partsGap = params.dpcDst;
		par.partsAmt = Math.floor(par.len / par.maxWidth);
		//var lastPartLen = par.len - ((par.partsAmt - 1) * par.partsGap) - (par.maxWidth * par.partsAmt);
		var lastPartLen = par.len - ((par.partsAmt) * par.partsGap) - (par.maxWidth * par.partsAmt);
		if (lastPartLen >= minPartWidth + par.partsGap) par.lastPartLen = lastPartLen, par.partsAmt++;
		if (lastPartLen < -par.partsGap) par.lastPartLen = par.partLen + lastPartLen;
		//if (lastPartLen < -par.partsGap) par.lastPartLen = par.partLen + (lastPartLen + par.partsGap);
	}
	if (params.stairType != 'дпк' && params.stairType !== "лиственница тер.") {
		//поперек волокон площадка делается из кусков не шире 600мм
		par.maxWidth = 600;
		if (!par.partsGap) par.partsGap = 2; //зазор между частями площадки
		par.partsAmt = Math.ceil(par.len / par.maxWidth);
		par.partLen = par.len / par.partsAmt - par.partsGap * (par.partsAmt - 1) / par.partsAmt;

		//расчет рамок под площадкой
		if (par.lenFrame) {
			var pltAmt = par.partsAmt;
			par.maxWidth = par.widthFrame;
			if (pltAmt > 1) {
				par.partsAmt = Math.floor(par.lenFrame / (par.widthFrame + par.partsGap));
				if (par.partsAmt < 2) {
					par.partsAmt = 2;
					par.maxWidth = Math.floor((par.lenFrame - par.partsGap - 100) / par.partsAmt);
				}
			}
			else {
				par.partsAmt = Math.floor(par.lenFrame / (par.widthFrame + par.partsGap));
				if (par.partsAmt == 1) par.maxWidth = par.lenFrame;
			}

		}
		
	}

	return par;
} //end of calcPltPartsParams


/**
 * функция возвращает площадку Г-образной лестницы вместе с нижним подступенком
 * @param par
 * @returns {*}
 */
function drawTimberPlt_G(par){

    //костыль - надо брать из calcTurnParams
    var topMarshZOffset = -30;
    var topMarshXOffset = -10;

    par.topMarshXOffset = topMarshXOffset;
    par.topMarshZOffset = topMarshZOffset;
    par.notches = {
        botIn: {x: 0, y: 0},
        botOut: {x: 0, y: 0},
        topIn: {x: 0, y: 0},
        topOut: {x: 0, y: 0},
    };

    if (params.model == "косоуры" && (params.railingSide_1 == "внешнее" || params.railingSide_1 == "две") && getMarshParams(par.botMarshId).stairAmt > 0 && params.calcType !== 'timber') {
        par.notches.botOut = {x: params.riserType == "есть" ? params.nose : a1 - b1, y: params.rackSize};
    }

    if (params.model == "косоуры" ||params.model == "тетива+косоур") {
        par.notches.botIn = {
            x: params.rackSize + topMarshXOffset - params.stringerSlotsDepth,
            y: params.rackSize + topMarshZOffset - params.stringerSlotsDepth
        };
    }
    if (params.model == "тетивы") {
        par.notches.botIn = {
            x: params.rackSize - (params.rackSize - params.stringerThickness) / 2 + topMarshXOffset - params.stringerSlotsDepth,
            y: params.rackSize - (params.rackSize - params.stringerThickness) / 2 + topMarshZOffset - params.stringerSlotsDepth
        };
    }

    par.treads = new THREE.Object3D();
    par.risers = new THREE.Object3D();
    par.maxPltWidth = 600;

		var marshParams = getMarshParams(par.botMarshId)
    par.h = marshParams.h; //функция в файле inputsReading.js

    //увеличение площадки в ширину на нижнем повороте трехмаршевой с 0 ступеней в среднем марше
    if(!par.extraWidth) par.extraWidth = 0;

    var platePar = {
        len: params.M,
        width: params.M,
        thk: params.treadThickness,
        hasNothes: false,
        notches: {
            botIn: {x: 0, y:0},
            botOut: {x: 0, y:0},
            topIn: {x: 0, y:0},
            topOut: {x: 0, y:0},
        },
        dxfArr: dxfPrimitivesArr,
        dxfBasePoint: par.dxfBasePoint,
    }

    //расчет длины и ширины площадки
    if(params.model == "косоуры"){
        par.len = params.M + par.topMarshZOffset;
        par.width = params.M + par.topMarshXOffset;
    }
    if(params.model == "тетивы"){
        par.len = params.M - (params.stringerThickness - params.stringerSlotsDepth) + par.topMarshZOffset;
        par.width = params.M - (params.stringerThickness - params.stringerSlotsDepth) + par.topMarshXOffset;
    }
    if(params.model == "тетива+косоур"){
        par.len = params.M + par.topMarshZOffset - (params.stringerThickness - params.stringerSlotsDepth);
        par.width = params.M - (params.stringerThickness - params.stringerSlotsDepth) + par.topMarshXOffset;
    }
    platePar.width = par.width;
    platePar.len = par.len + par.extraWidth;



    //расчет posZ

    var posZ = -params.M / 2;
    if (turnFactor == 1 && params.model != "косоуры") posZ += params.stringerThickness - params.stringerSlotsDepth;
    if (turnFactor == -1) posZ -= topMarshZOffset;


    if(par.notches.botIn.x != 0 && par.notches.botIn.y != 0){
        platePar.notches.hasNothes = true;
        platePar.notches.botIn = copyPoint(par.notches.botIn);
        platePar.notches.botIn.y += par.extraWidth;
    }
    if(par.notches.botOut.x != 0 && par.notches.botOut.y != 0){
        platePar.notches.hasNothes = true;
        platePar.notches.botOut = copyPoint(par.notches.botOut);
    }

    var pltAmt = Math.ceil(platePar.width / par.maxPltWidth);
    platePar.width = platePar.width / pltAmt;

    for(var i = 0; i < pltAmt; ++i){
        if(i > 0){
            platePar.notches = {
                botIn: {x: 0, y:0},
                botOut: {x: 0, y:0},
                topIn: {x: 0, y:0},
                topOut: {x: 0, y:0},
            };
        }
        var plt = drawNotchedPlate(platePar).mesh;
        plt.rotation.x = Math.PI / 2;
        plt.position.x = platePar.width * i;
        plt.position.z = posZ;

        par.treads.add(plt);
        platePar.dxfBasePoint = newPoint_xy(platePar.dxfBasePoint, platePar.width + 100, 0);
    }

    //расчет подступенка
    if(params.riserType == "есть"){
        var riserPar = {
            len: calcNewellRiserLen(),
            width: par.h,
            thk: params.riserThickness,
            dxfArr: dxfPrimitivesArr,
            dxfBasePoint: dxfBasePoint,
						hasTopScrews: true,
						hasBotScrews: true
        }
				if (marshParams.stairAmt == 0) {
					riserPar.width -= params.treadThickness;
				}

        //расчет длины подступенков

		/*
        par.riserLen = params.M;
        if(params.model == "косоуры"){
            par.riserLen -= params.rackSize - params.stringerSlotsDepth;
        }
        if(params.model == "тетивы"){
            par.riserLen -= 2*(params.stringerThickness - params.stringerSlotsDepth) + (params.rackSize - params.stringerThickness) / 2;
        }
        if(params.model == "тетива+косоур"){
            par.riserLen -= params.stringerThickness - 2*params.stringerSlotsDepth + params.rackSize;
        }
        riserPar.len = par.riserLen;
		*/

        //расчет posX
        var posZ = 0;

        if(params.model == "косоуры"){
            posZ = 0;
            if(params.turnSide == "левое"){
                posZ = -riserPar.len;
            }
        }
        if(params.model == "тетивы" || params.model == "тетива+косоур"){
            posZ = params.stringerThickness - params.stringerSlotsDepth;
            if(params.turnSide == "левое"){
                posZ = -(riserPar.len+(params.stringerThickness - params.stringerSlotsDepth));
            }
        }
				posZ -= (params.M / 2) * turnFactor;//FIX

		//отрисовка
		riserPar.modifyKey = 'riserPlt:' + par.marshId;
        riserPar = drawRectRiser(riserPar);
        riser = riserPar.mesh;
        riser.rotation.x = Math.PI / 2;
        riser.rotation.y = Math.PI / 2;
        riser.position.x = params.nose;
        riser.position.y = -(par.h + params.treadThickness);
				if (marshParams.stairAmt == 0) {
					riser.position.y += params.treadThickness;
				}
        riser.position.z = posZ;

        par.risers.add(riser);
    }

    return par;
}//end of calcPltGPar

function calcPltNotches(){
	var turnRackXOffset = -10;
    var topMarshZOffset = 0;
    var topMarshXOffset = 0;
    if(params.model == "косоуры" || params.model == "тетива+косоур") turnRackXOffset = -30;

	var notches= {
        botIn: {x: 0, y: 0},
        botOut: {x: 0, y: 0},
        topIn: {x: 0, y: 0},
        topOut: {x: 0, y: 0},
        middle: {x: 0, y: 0},
    };

	if (params.model == "косоуры" && (params.railingSide_1 == "внешнее" || params.railingSide_1 == "две")) {
        notches.botOut = {x: params.nose, y: params.rackSize};
    }
    if (params.model == "косоуры" || params.model == "тетива+косоур") {
        notches.middle.x = params.rackSize + turnRackXOffset - params.stringerSlotsDepth;
        notches.middle.y = params.marshDist + 2 * (params.rackSize - params.stringerSlotsDepth);
    }

    if (params.model == "тетивы") {
        notches.middle.x = params.rackSize - (params.rackSize - params.stringerThickness) / 2 + turnRackXOffset - params.stringerSlotsDepth;
        notches.middle.y = params.marshDist + params.rackSize + params.stringerThickness - 2 * params.stringerSlotsDepth;
    }
	return notches;
}

/**
 * функция возвращает площадку П-образной лестницы вместе с нижним подступенком
 * @param par
 * @returns {*}
 */
function  drawTimberPlt_P(par){

    var turnRackXOffset = -10;
    var topMarshZOffset = 0;
    var topMarshXOffset = 0;


    if(params.model == "косоуры" || params.model == "тетива+косоур") turnRackXOffset = -30;
    par.topMarshXOffset = topMarshXOffset;
    par.topMarshZOffset = topMarshZOffset;
    par.notches= {
        botIn: {x: 0, y: 0},
        botOut: {x: 0, y: 0},
        topIn: {x: 0, y: 0},
        topOut: {x: 0, y: 0},
        middle: {x: 0, y: 0},
    };

    if (params.model == "косоуры" && (params.railingSide_1 == "внешнее" || params.railingSide_1 == "две") && !(params.calcType == 'timber' && params.stairModel	 == 'П-образная с площадкой')) {
        par.notches.botOut = {x: params.nose, y: params.rackSize};
    }
    if (params.model == "косоуры" || params.model == "тетива+косоур") {
        par.notches.middle.x = params.rackSize + turnRackXOffset - params.stringerSlotsDepth;
        par.notches.middle.y = params.marshDist + 2 * (params.rackSize - params.stringerSlotsDepth);
    }

    if (params.model == "тетивы") {
        par.notches.middle.x = params.rackSize - (params.rackSize - params.stringerThickness) / 2 + turnRackXOffset - params.stringerSlotsDepth;
        par.notches.middle.y = params.marshDist + params.rackSize + params.stringerThickness - 2 * params.stringerSlotsDepth;
    }


    par.treads = new THREE.Object3D();
    par.risers = new THREE.Object3D();
    par.maxPltWidth = 600;

    if(par.botMarshId == 1){
        par.a= params.a1;
        par.b= params.b1;
        par.h= params.h1;
        par.stairAmt= params.stairAmt1;
    }
    if(par.botMarshId == 2){
        par.a= params.a2;
        par.b= params.b2;
        par.h= params.h2;
        par.stairAmt= params.stairAmt2;
    }

    if(par.topMarshId == 2){
        par.a2= params.a2;
        par.b2= params.b2;
        par.h2= params.h2;
        par.stairAmt2= params.stairAmt2;
    }
    if(par.topMarshId == 3){
        par.a2= params.a3;
        par.b2= params.b3;
        par.h2= params.h3;
        par.stairAmt2= params.stairAmt3;
    }

    //последняя ступень
    var platePar = {
        len: params.M,
        width: params.M,
        thk: params.treadThickness,
        hasNothes: false,
        notches: {
            botIn: {x: 0, y:0},
            botOut: {x: 0, y:0},
            topIn: {x: 0, y:0},
            topOut: {x: 0, y:0},
        },
        dxfArr: dxfPrimitivesArr,
        dxfBasePoint: par.dxfBasePoint,
    }

    //расчет длины и ширины площадки
    if(params.model == "косоуры"){
        par.len = 2*params.M + params.marshDist;
        par.width = params.platformLength_1 + par.topMarshXOffset;
    }
    if(params.model == "тетивы"){
        par.len = 2*params.M + params.marshDist - 2*(params.stringerThickness - params.stringerSlotsDepth);
        par.width = params.platformLength_1 + par.topMarshXOffset - (params.stringerThickness - params.stringerSlotsDepth);
    }
    if(params.model == "тетива+косоур"){
        par.len = 2*params.M + params.marshDist - 2* (params.stringerThickness - params.stringerSlotsDepth);
        par.width = params.platformLength_1 + par.topMarshXOffset - (params.stringerThickness - params.stringerSlotsDepth);
    }
    platePar.width = par.width;
    platePar.len = par.len;

    //расчет posZ
    var posZ = 0;

    if(par.notches.botIn.x != 0 && par.notches.botIn.y != 0){
        platePar.notches.hasNothes = true;
        platePar.notches.botIn = copyPoint(par.notches.botIn);
    }
    if(par.notches.botOut.x != 0 && par.notches.botOut.y != 0){
        platePar.notches.hasNothes = true;
        platePar.notches.botOut = copyPoint(par.notches.botOut);
    }
    if(par.notches.middle.x != 0 && par.notches.middle.y != 0){
        platePar.notches.hasNothes = true;
        platePar.notches.middle = copyPoint(par.notches.middle);
    }

    var pltAmt = Math.ceil(platePar.width / par.maxPltWidth);
    platePar.width = platePar.width / pltAmt;

    for(var i = 0; i < pltAmt; ++i){
        if(i > 0){
            platePar.notches = {
                botIn: {x: 0, y:0},
                botOut: {x: 0, y:0},
                topIn: {x: 0, y:0},
                topOut: {x: 0, y:0},
                middle: {x:0, y:0}
            };
        }
        var plt = drawNotchedPlate(platePar).mesh;
        plt.rotation.x = Math.PI / 2;
        plt.position.x = platePar.width * i;
        var posZ = -par.len / 2;
        if (params.model == "косоуры") {
            posZ = -params.M / 2  ;
            if (params.turnSide == "левое") {
                posZ = -par.len / 2-params.M / 2-params.marshDist/2 ;
            }
        }
        if (params.model == "тетивы" || params.model == "тетива+косоур") {
            posZ = -params.M / 2 + (params.stringerThickness - params.stringerSlotsDepth);
            if (params.turnSide == "левое") {
                posZ = -par.len / 2 - params.M / 2 - (params.stringerThickness - params.stringerSlotsDepth) * 2;
            }
        }

        plt.position.z = posZ



        par.treads.add(plt);
    }

    //расчет подступенка
    if(params.riserType == "есть"){
        var riserPar = {
            len: calcNewellRiserLen(),
            width: par.h,
            thk: params.riserThickness,
            dxfArr: dxfPrimitivesArr,
            dxfBasePoint: dxfBasePoint,
						hasTopScrews: true,
						hasBotScrews: true
        }
				/*
        //расчет длины подступенков
        par.riserLen = params.M;
        if(params.model == "косоуры"){
            par.riserLen -= params.rackSize - params.stringerSlotsDepth;
        }
        if(params.model == "тетивы"){
            par.riserLen -= 2*(params.stringerThickness - params.stringerSlotsDepth) + (params.rackSize - params.stringerThickness) / 2;
        }
        if(params.model == "тетива+косоур"){
            par.riserLen -= params.stringerThickness - 2*params.stringerSlotsDepth + params.rackSize;
        }
        riserPar.len = par.riserLen;
				*/
        //расчет posX
        var posZ = 0;

        if(params.model == "косоуры"){
            posZ = 0;
            if(params.turnSide == "левое"){
                posZ = -riserPar.len;
            }
        }
        if(params.model == "тетивы" || params.model == "тетива+косоур"){
            posZ = params.stringerThickness - params.stringerSlotsDepth;
            if(params.turnSide == "левое"){
							posZ += 5;
                // posZ = -(riserPar.len+(params.stringerThickness - params.stringerSlotsDepth));
            }
        }
		posZ -= params.M / 2;//FIX

		//отрисовка
		riserPar.modifyKey = 'riserPltP:' + par.marshId;
        riserPar = drawRectRiser(riserPar);
        riser = riserPar.mesh;
        riser.rotation.x = Math.PI / 2;
        riser.rotation.y = Math.PI / 2;
        riser.position.x = params.nose;
        riser.position.y = -(par.h + params.treadThickness);
        riser.position.z = posZ;

        par.risers.add(riser);
    }

    return par;
}//end of calcPltPPar

/** 
	Функция возвращает прямой подступенок
	@param len длинна подступенка
	@param width высота? подступенка
	@param thk толщина подступенка
	@param cutWndIn модиикатор, позволяет обрезать подступенок без изменения позиции
*/
/*функция возвращает прямой подступенок*/

function drawRectRiser(par) {
	/*
	par = {
		len
		width
		thk
		dxfArr
		dxfBasePoint
		}
	*/
    var shape = new THREE.Shape();

    //корректируем высоту подступенка
    par.width = Math.round(par.width - 1);

    /*внешний контур*/

    var cutWndIn = 0;

    if (par.cutWndIn) {
        cutWndIn = par.cutWndIn;
        par.len -= cutWndIn;
    }

    //подпись под фигурой
    var text = par.description;
    var textHeight = 30;
    var textBasePoint = newPoint_xy(par.dxfBasePoint, par.width / 2 - 200, -100)
    addText(text + " " + par.count + "шт.", textHeight, par.dxfArr, textBasePoint);

    if (!par.ang) {
				par.mesh = new THREE.Object3D();

        var p1 = { x: 0.01, y: 0.01 + cutWndIn }
        var p2 = newPoint_xy(p1, par.width, 0)
        addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
        p1 = copyPoint(p2);
        p2 = newPoint_xy(p1, 0, par.len - 0.02);
        addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
        p1 = copyPoint(p2);
        p2 = newPoint_xy(p1, -par.width, 0);
        addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
        p1 = copyPoint(p2);
        p2 = newPoint_xy(p1, 0, -(par.len - 0.02));
        addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);

				//Саморезы
				{
					var screwPar = {
						id: "screw_3x35",
						description: "Крепление подступенков",
						group: "Ступени",
						timberPlugDiam: 10
					}

					var sideOverHang = 0;
					if (params.sideOverHang) sideOverHang = params.sideOverHang;

					if(par.hasTopScrews){
						// Верхние
						if (params.calcType !== 'timber_stock') {
							var screw = drawScrew(screwPar).mesh;
							screw.position.x = par.width - 20;
							screw.position.y = sideOverHang + 20;
							screw.position.z = 20;
							screw.rotation.x = Math.PI / 2;
							if(!testingMode) par.mesh.add(screw);
		
							var screw = drawScrew(screwPar).mesh;
							screw.position.x = par.width - 20;
							screw.position.y = par.len / 2;
							screw.position.z = 20;
							screw.rotation.x = Math.PI / 2;
							if(!testingMode) par.mesh.add(screw);
		
							var screw = drawScrew(screwPar).mesh;
							screw.position.x = par.width - 20;
							screw.position.y = par.len - sideOverHang - 20;
							screw.position.z = 20;
							screw.rotation.x = Math.PI / 2;
							if(!testingMode) par.mesh.add(screw);
						}
					}
					// Нижние
					if(par.hasBotScrews){
						var screw = drawScrew(screwPar).mesh;
						screw.position.x = 20;
						screw.position.y = sideOverHang + 20;
						screw.position.z = 5;
						screw.rotation.x = -Math.PI / 2;
						if(!testingMode) par.mesh.add(screw);
	
						var screw = drawScrew(screwPar).mesh;
						screw.position.x = 20;
						screw.position.y = par.len / 2;
						screw.position.z = 5;
						screw.rotation.x = -Math.PI / 2;
						if(!testingMode) par.mesh.add(screw);
	
						var screw = drawScrew(screwPar).mesh;
						screw.position.x = 20;
						screw.position.y = par.len - sideOverHang - 20;
						screw.position.z = 5;
						screw.rotation.x = -Math.PI / 2;
						if(!testingMode) par.mesh.add(screw);
					}

					if (params.calcType == 'timber_stock') {
						var screwPar = {
							id: "screw_4x35",
							description: "Крепление подступенков",
							group: "Ступени",
							timberPlugDiam: 10
						}

						var screw = drawScrew(screwPar).mesh;
						screw.position.x = params.treadThickness / 2;
						screw.position.y = 55 + params.stringerThickness / 2;
						screw.position.z = 15;
						screw.rotation.x = Math.PI / 2;
						if(!testingMode) par.mesh.add(screw);
						
						var screw = drawScrew(screwPar).mesh;
						screw.position.x = params.treadThickness / 2;
						screw.position.y = params.M - 55 - params.stringerThickness / 2;
						screw.position.z = 15;
						screw.rotation.x = Math.PI / 2;
						if(!testingMode) par.mesh.add(screw);

						var screw = drawScrew(screwPar).mesh;
						screw.position.x = par.width - 50;
						screw.position.y = 55 + params.stringerThickness / 2;
						screw.position.z = 15;
						screw.rotation.x = Math.PI / 2;
						if(!testingMode) par.mesh.add(screw);
						
						var screw = drawScrew(screwPar).mesh;
						screw.position.x = par.width - 50;
						screw.position.y = params.M - 55 - params.stringerThickness / 2;
						screw.position.z = 15;
						screw.rotation.x = Math.PI / 2;
						if(!testingMode) par.mesh.add(screw);
					}
				}

        var extrudeOptions = {
            amount: par.thk - 0.02,
            bevelEnabled: false,
            curveSegments: 12,
            steps: 1
        };
        var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
		geometry.rotateUV(Math.PI / 2);
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
        var mesh = new THREE.Mesh(geometry, params.materials.riser)
		mesh.userData.textureRot = Math.PI / 2;
		if (par.modifyKey) mesh.modifyKey = par.modifyKey;
		par.mesh.add(mesh);
    }

    //подступенок со срезанными углами - забежной
    if (par.ang) {
        var outDelta = par.thk * Math.tan(par.ang);

        var inDelta = 0;

        var p1 = { x: 0, y: 0 }
        var p2 = newPoint_xy(p1, -outDelta, par.thk);
        var p3 = newPoint_xy(p2, par.len, 0);
        var p4 = newPoint_xy(p3, outDelta, -par.thk);

        var points = [p1, p2, p3, p4]

        //создаем шейп
        var shapePar = {
            points: points,
            dxfArr: dxfPrimitivesArr,
            dxfBasePoint: par.dxfBasePoint,
            markPoints: false, //пометить точки в dxf для отладки
        };
        var shape = drawShapeByPoints2(shapePar).shape;
		/*
		// addLine(shape, par.dxfArr, p1_ang, p1, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p1, p2, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p2, p3, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p3, p4, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p4, p5, par.dxfBasePoint);
		addLine(shape, par.dxfArr, p5, p1, par.dxfBasePoint);
		*/

        var extrudeOptions = {
            amount: par.width - 0.02,
            bevelEnabled: false,
            curveSegments: 12,
            steps: 1
        };
        var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
        var mesh = new THREE.Object3D();
        var riser = new THREE.Mesh(geometry, params.materials.riser);
		//riser.position.y += cutWndIn;
		if (par.modifyKey) riser.modifyKey = par.modifyKey;
        riser.rotation.y = Math.PI / 2;
        riser.rotation.z = Math.PI / 2;
        mesh.add(riser);
        par.mesh = mesh;

        //размеры для спецификации
        var minX = 0;
        var maxX = 0;
        $.each(points, function () {
            if (this.x < minX) minX = this.x;
            if (this.x > maxX) maxX = this.x;
        })
				par.len = Math.round(Math.abs(maxX - minX));
				
				var screwPar = {
					id: "screw_4x35",
					description: "Крепление подступенков",
					group: "Ступени",
					timberPlugDiam: 10
				}
				
				var offset = 0;
				if (par.offsetX) {
					offset = par.offsetX;
				}

				var sideOverHang = 20;
				if (params.sideOverHang) sideOverHang = params.sideOverHang;

				// Нижние
				var screw = drawScrew(screwPar).mesh;
				screw.position.x = 20;
				if (par.offsetX) screw.position.x = par.width - 20;
				screw.position.y = sideOverHang + 20 + offset;
				screw.position.z = 5;
				screw.rotation.x = -Math.PI / 2;
				if(!testingMode) par.mesh.add(screw);
		
				var screw = drawScrew(screwPar).mesh;
				screw.position.x = 20;
				if (par.offsetX) screw.position.x = par.width - 20;
				screw.position.y = par.len / 2 + offset;
				screw.position.z = 5;
				screw.rotation.x = -Math.PI / 2;
				if(!testingMode) par.mesh.add(screw);
		
				var screw = drawScrew(screwPar).mesh;
				screw.position.x = 20;
				if (par.offsetX) screw.position.x = par.width - 20;
				screw.position.y = par.len - sideOverHang - 20 + offset;
				screw.position.z = 5;
				screw.rotation.x = -Math.PI / 2;
				if(!testingMode) par.mesh.add(screw);
    }

	if (params.treadLigts !== 'нет') {
		//Светодиодная лента
		var lightWidth = 10;
		var material = new THREE.MeshBasicMaterial({side: THREE.BackSide, metalness: -5});
		var treadLightMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry(), material );
		treadLightMesh.scale.x = lightWidth;
		treadLightMesh.scale.y = par.len;
		treadLightMesh.position.y = par.len / 2;
		treadLightMesh.position.x = par.width - 0.5;
		treadLightMesh.position.z -= lightWidth;
		treadLightMesh.rotation.y = Math.PI / 2;
		
		if (par.offsetX) {
			treadLightMesh.position.y = -par.len / 2;
			treadLightMesh.position.x = 0.5;
			treadLightMesh.rotation.y = -Math.PI / 2;
		}
		
		treadLightMesh.setLayer('tread_light');
		
		par.mesh.add( treadLightMesh );
	}


    //сохраняем данные для спецификации
    var treadPar = getTreadParams(); //функция в файле calcSpecGeneral.js
    var partName = "riser";

    if (typeof specObj != 'undefined' && params.stairType != "нет") {
        if (!specObj[partName]) {
            specObj[partName] = {
                types: {},
                amt: 0,
                name: "Подступенок",
				area: 0,
				volume: 0,
                paintedArea: 0,
                metalPaint: treadPar.metalPaint,
                timberPaint: treadPar.timberPaint,
                division: treadPar.division,
                workUnitName: "amt",
                group: "risers",
            }
        }
        var area = par.len * par.width / 1000000;
        var paintedArea = area * 2 + (par.len * 1.0 + par.width * 1.0) * 2 * par.thk / 1000000;
		
        var name = Math.round(par.len) + "x" + par.width + "x" + par.thk;
        if (par.ang) name += " забежн."
        if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
        if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
        specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		specObj[partName]["volume"] += par.len * par.width * par.thk / 1000000000;
        specObj[partName]["paintedArea"] += paintedArea;
		}
		par.mesh.specId = partName + name;

    return par;

} //end of drawRectRiser


/*функция возвращает забежной подступенок. Он отличается от прямого срезанными под углом торцами*/

function drawWinderRiser(par){
	par.mesh = new THREE.Object3D();

	var dxfPrimitivesArr = par.dxfPrimitivesArr;
	var shape = new THREE.Shape();
	var bevelLength = 6; //длина фаски
	var cuttingAngle = 60; //угол среза

	var p1 =  {x:0,y:0}
	var p2 = newPoint_xy(p1, 0, par.thk / Math.cos(par.ang));
	var p3 = newPoint_xy(p2, -par.width, par.width * Math.tan(par.ang));
	var p4 = newPoint_xy(p1, -par.width, par.width * Math.tan(par.ang));

	//расчет точек фаски и среза для конца подступенка на участке поворотного столба
	var bevelPoint1 = newPoint_xy(p2, bevelLength, 0);
	var cuttingPoint1 = newPoint_xy(bevelPoint1, 100 * Math.cos(Math.PI * cuttingAngle / 180), -100 * Math.sin(Math.PI * cuttingAngle / 180));
    cuttingPoint1 = itercection(bevelPoint1, cuttingPoint1, p4, p1);

	//расчет точек фаски и среза для конца подступенка на участке тетивы
	var bevelPoint2 = newPoint_xy(p4, -bevelLength, 0);
	var cuttingPoint2 = newPoint_xy(bevelPoint2, -100 * Math.cos(Math.PI * cuttingAngle / 180), 100 * Math.sin(Math.PI * cuttingAngle / 180));
    cuttingPoint2 = itercection(bevelPoint2, cuttingPoint2, p2, p3);

	if(params.model == "косоуры"){
		addLine(shape, dxfPrimitivesArr, p2, p3, par.dxfBasePoint);
	    addLine(shape, dxfPrimitivesArr, p3, p4, par.dxfBasePoint);
	}
	else{
	    addLine(shape, dxfPrimitivesArr, p2, p3, par.dxfBasePoint);
	    addLine(shape, dxfPrimitivesArr, p3, cuttingPoint2, par.dxfBasePoint);
	    addLine(shape, dxfPrimitivesArr, cuttingPoint2, bevelPoint2, par.dxfBasePoint);
	    addLine(shape, dxfPrimitivesArr, bevelPoint2, p4, par.dxfBasePoint);
	}
	addLine(shape, dxfPrimitivesArr, p4, p1, par.dxfBasePoint);
	addLine(shape, dxfPrimitivesArr, p1, cuttingPoint1, par.dxfBasePoint);
	addLine(shape, dxfPrimitivesArr, cuttingPoint1, bevelPoint1, par.dxfBasePoint);
	addLine(shape, dxfPrimitivesArr, bevelPoint1, p2, par.dxfBasePoint);

	var screwPar = {
		id: "screw_4x35",
		description: "Крепление подступенков",
		group: "Ступени",
		timberPlugDiam: 10
	}
	
	// Нижние
	var screw = drawScrew(screwPar).mesh;
	screw.position.x = 20;
	screw.position.y = params.sideOverHang + 20;
	screw.position.z = 20;
	screw.rotation.x = Math.PI / 2;
	if(!testingMode) par.mesh.add(screw);

	var screw = drawScrew(screwPar).mesh;
	screw.position.x = 20;
	screw.position.y = par.width / 2;
	screw.position.z = 20;
	screw.rotation.x = Math.PI / 2;
	if(!testingMode) par.mesh.add(screw);

	var screw = drawScrew(screwPar).mesh;
	screw.position.x = 20;
	screw.position.y = par.width - params.sideOverHang - 20;
	screw.position.z = 20;
	screw.rotation.x = Math.PI / 2;
	if(!testingMode) par.mesh.add(screw);

	var extrudeOptions = {
		amount: par.height,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var riser = new THREE.Mesh(geometry, params.materials.timber);
	riser.rotation.x = Math.PI/2
	riser.position.y = par.height;

	par.mesh.add(riser);

	return par;
} //end of drawWinderRiser


/** функция рассчитывает длину подступенка, примыкающего к столбу на деревянных лестницах
*/
function calcNewellRiserLen(){

	var len = params.M;
	if(params.calcType == "timber") {
		if(params.model == "косоуры") len -= params.rackSize - params.stringerSlotsDepth;
		if(params.model == "тетивы") len -= 2*(params.stringerThickness - params.stringerSlotsDepth) + (params.rackSize - params.stringerThickness) / 2;
		if(params.model == "тетива+косоур") len -= params.stringerThickness - 2 * params.stringerSlotsDepth + params.rackSize;
	}
	return len;

}//end of calcNewellRiserLen

function drawNotchRiser(par) {

	//Необязательные параметры
	if (!par.dxfArr) par.dxfArr = dxfPrimitivesArr;
	if (!par.dxfBasePoint) {
		par.dxfBasePoint = { x: 0, y: 0 },
			par.dxfArr = [];
	}
	if (!par.material) par.material = params.materials.timber;
	if (!par.layer) par.layer = "parts";


	par.mesh = new THREE.Object3D();

	var shape = new THREE.Shape();
	var p1 = { x: 0, y: 0 }
	var p2 = newPoint_xy(p1, 0, par.width);
	var p3 = newPoint_xy(p1, par.len, par.width);
	var p4 = newPoint_xy(p1, par.len, 0);

	var points = [p1, p2, p3, p4];

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
	}

	var shape = drawShapeByPoints2(shapePar).shape;

	//отверстия
	if (par.holes != undefined) {
		for (var i = 0; i < par.holes.length; i++) {
			addRoundHole(shape, par.dxfArr, par.holes[i].center, par.holes[i].rad, par.dxfBasePoint)
		}
	}

	var extrudeOptions = {
		amount: par.thk - par.depth,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var plate1 = new THREE.Mesh(geom, par.material);
	plate1.position.z = par.depth;
	par.mesh.add(plate1);

	//-----------------------------------
	var len = (par.len - par.notchWidth) / 2;
	var p1 = { x: 0, y: 0 }
	var p2 = newPoint_xy(p1, 0, par.width);
	var p3 = newPoint_xy(p1, len, par.width);
	var p4 = newPoint_xy(p1, len, 0);

	var points = [p1, p2, p3, p4];

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: [],
		dxfBasePoint: par.dxfBasePoint,
	}

	var shape = drawShapeByPoints2(shapePar).shape;

	////отверстия
	//if (par.holes != undefined) {
	//	for (var i = 0; i < par.holes.length; i++) {
	//		addRoundHole(shape, par.dxfArr, par.holes[i].center, par.holes[i].rad, par.dxfBasePoint)
	//	}
	//}

	var extrudeOptions = {
		amount: par.depth,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var plate2 = new THREE.Mesh(geom, par.material);
	par.mesh.add(plate2);


	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var plate3 = new THREE.Mesh(geom, par.material);
	plate3.position.x = len + par.notchWidth;
	par.mesh.add(plate3);


	var thk = par.thk;
	par.partName = "riser"
	if (typeof specObj != 'undefined' && par.partName) {
		if (!specObj[par.partName]) {
			specObj[par.partName] = {
				types: {},
				amt: 0,
				name: "Подступенок с пазом",
				area: 0,
				paintedArea: 0,
				metalPaint: false,
				timberPaint: true,
				division: "timber",
				workUnitName: "amt",
				group: "risers",
			}

		}
		var area = par.len * par.width / 1000000;
		var paintedArea = area * 2 + (par.len + par.width) * 2 * thk / 1000000;

		var name = Math.round(par.len) + "x" + Math.round(par.width) + "x" + Math.round(thk);
		if (specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] += 1;
		if (!specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] = 1;
		specObj[par.partName]["amt"] += 1;
		specObj[par.partName]["area"] += area;
		specObj[par.partName]["paintedArea"] += paintedArea;
	}

	par.mesh.specId = par.partName + name;

	return par;
}

/**
 * функция возвращает пластину с вырезами по углам
 * @param par
 * @returns {*}
 */
function drawNotchedPlatePlatform(par) {

    /*
    par = {
        len
        width
        thk
        hasNothes: true,
        notches: {
            botIn: {x: 0, y:0},
            botOut: {x: 0, y:0},
            topIn: {x: 0, y:0},
            topOut: {x: 0, y:0},
			middle
            }
        dxfArr
        dxfBasePoint
        }
    */

	//пересчет внутренней/внешней стороны на правую/левую


	var shape = new THREE.Shape();
	var p1 = { x: 0, y: 0 }
	var p2 = newPoint_xy(p1, 0, par.width);
	if (!par.isBot) {
		var p3 = newPoint_xy(p2, par.len - par.depth, 0);
		var p4 = newPoint_xy(p3, 0, -par.width + par.riserSideOffset);
		var p5 = newPoint_xy(p4, par.depth, 0);
		var p6 = newPoint_xy(p1, par.len, 0);
	}
	else {
		var p3 = newPoint_xy(p2, par.len, 0);
		var p4 = newPoint_xy(p3, 0, -par.riserSideOffset);
		var p5 = newPoint_xy(p4, -par.depth, 0);
		var p6 = newPoint_xy(p1, par.len - par.depth, 0);
	}
	

	var points = [p1, p2, p3, p4, p5, p6];

	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: par.dxfArr,
		dxfBasePoint: par.dxfBasePoint,
	}

	var shape = drawShapeByPoints2(shapePar).shape;

	//отверстия
	if (par.holes != undefined) {
		for (var i = 0; i < par.holes.length; i++) {
			addRoundHole(shape, par.dxfArr, par.holes[i].center, par.holes[i].rad, par.dxfBasePoint)
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
	par.mesh = new THREE.Mesh(geom, par.material);

	//var extrudeOptions = {
	//	amount: par.thk,
	//	bevelEnabled: false,
	//	curveSegments: 12,
	//	steps: 1
	//};

	//var geometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	//geometry.rotateUV(Math.PI / 2);
	//geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	//par.mesh = new THREE.Mesh(geometry, params.materials.tread);

	//сохраняем данные для спецификации
	var treadPar = getTreadParams(); //функция в файле calcSpecGeneral.js

	var partName = "notchedTread";
	if (typeof specObj != 'undefined' && params.stairType != "нет") {
		if (!specObj[partName]) {
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Ступень с вырезами",
				area: 0,
				paintedArea: 0,
				metalPaint: treadPar.metalPaint,
				timberPaint: treadPar.timberPaint,
				division: treadPar.division,
				workUnitName: "amt",
				group: "treads",
			}
		}


		var area = par.len * par.width / 1000000;
		var paintedArea = area * 2 + (par.len + par.width) * 2 * par.thk / 1000000;

		var name = Math.round(par.len) + "x" + Math.round(par.width) + "x" + par.thk;
		if (specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if (!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		specObj[partName]["paintedArea"] += paintedArea;
	}
	par.mesh.specId = partName + name;

	return par;

}//end of drawNotchedTread

function getTreadLigtsParams(par) {
	if (params.calcType !== "mono" && params.treadLigts !== "нет") {
		par.isTreadLigts = true;
		par.treadLigtsThk = 10;
		par.offsetFront = 5;
		par.offsetSide = 10;
		par.widthLigts = 12;
	}
}