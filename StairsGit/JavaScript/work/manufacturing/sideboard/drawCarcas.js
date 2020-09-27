// Вывод каркаса всей лестницы

function drawCarcas(par){
	
	par.carcas = new THREE.Object3D();	
	par.panels = new THREE.Object3D();
	par.countertop = new THREE.Object3D();
	var dxfX0 = par.dxfBasePoint.x;
	par.dxfArr = dxfPrimitivesArr

	par.carcasParams = [];
	
	var modelDim = getModelDimensions();
	var sideWallDim = modelDim.sideWall; 
	console.log(modelDim)
	// левая боковина
	var sidePar = {
		dxfBasePoint: par.dxfBasePoint,
		side: "left",
		shelfPositions: [modelDim.leg],
		legProf: sideWallDim.newellSize + 'х' + sideWallDim.newellSize,
		bridgeProf: sideWallDim.newellSize + 'х' + modelDim.countertop.thk,
		width: params.depth,
		height: params.height - modelDim.countertop.thk,
		shelfThk: modelDim.countertop.thk,
		carcasModel: "1",
		topOffset: 10,
		botOffset: modelDim.leg,
		sidePanel: "две"
	}
	if (params.model == 'брутал') {
		sidePar.shelfPositions = [modelDim.leg * 3]
	}
	var leftSideObj = drawSideWall(sidePar);
	leftSideObj.carcas.rotation.y = -Math.PI / 2;
	leftSideObj.carcas.position.z = sideWallDim.newellSize;
	
	leftSideObj.panels.rotation.y = leftSideObj.carcas.rotation.y;
	leftSideObj.carcas.position.z = leftSideObj.carcas.position.z;
	
	par.carcas.add(leftSideObj.carcas);
	par.panels.add(leftSideObj.panels); 
	
	// правая боковина
	// правая боковина
	sidePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, params.depth + 200, 0);
	sidePar.side = "right";
	
	var rightSideObj = drawSideWall(sidePar);
	rightSideObj.carcas.rotation.y = -Math.PI / 2;
	rightSideObj.carcas.position.x = params.width - sideWallDim.newellSize;
	rightSideObj.carcas.position.z = sideWallDim.newellSize;

	rightSideObj.panels.rotation.y = rightSideObj.carcas.rotation.y;
	rightSideObj.panels.position.x = rightSideObj.carcas.position.x;
	rightSideObj.panels.rotation.z = rightSideObj.carcas.position.z;
	
	
	par.carcas.add(rightSideObj.carcas);
	par.panels.add(rightSideObj.panels);

	//перемычки
	var polePar = {
		poleProfileY: modelDim.door.topBeamSize,
		poleProfileZ: 60,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, -1000),
		length: params.width - sideWallDim.newellSize * 2,
		poleAngle: 0,
		partName: "timberPole",
		}
		
	//верхняя задняя перемычка
	var pos = {
		x: 0,
		y: params.height - polePar.poleProfileY - modelDim.countertop.thk,
		z: params.depth - polePar.poleProfileZ,
		}
	var pole1 = drawPole3D_4(polePar).mesh;
	pole1.position.x = pos.x;
	pole1.position.y = pos.y;
	pole1.position.z = modelDim.rearWall.thk + modelDim.rearWall.offset;
	par.carcas.add(pole1);
	
	//верхняя передняя перемычка
	polePar.dxfBasePoint.y -= 200;
	var pole2 = drawPole3D_4(polePar).mesh;
	pole2.position.x = pos.x;
	pole2.position.y = pos.y;
	pole2.position.z = pos.z;
	par.carcas.add(pole2);
	
	//нижние перемычки
	pos.y = modelDim.leg;
	polePar.poleProfileY = modelDim.door.botBeamSize,
	
	//нижняя передняя перемычка
	polePar.dxfBasePoint.y -= 200;
	var pole3 = drawPole3D_4(polePar).mesh;
	pole3.position.x = pos.x;
	pole3.position.y = pos.y;
	pole3.position.z = pos.z;
	par.carcas.add(pole3);
	
	//нижняя задняя перемычка
	polePar.dxfBasePoint.y -= 200;
	var pole4 = drawPole3D_4(polePar).mesh;
	pole4.position.x = pos.x;
	pole4.position.y = pos.y;
	pole4.position.z = pole1.position.z;
	par.carcas.add(pole4);
	
	
//задняя стенка
	
	var platePar = {
		len: params.width - sideWallDim.newellSize * 2 + modelDim.rearWall.ledge * 2,
		width: params.height - modelDim.leg - modelDim.countertop.thk,
		thk:  modelDim.rearWall.thk,
		partName: "mdfPlate",
		}
	var pos = {
		x:  - modelDim.rearWall.ledge,
		y: modelDim.leg,
		}
	platePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, -2000)
	var panel = drawPlate(platePar).mesh;
	panel.position.x = pos.x;
	panel.position.y = pos.y;
	panel.position.z = modelDim.rearWall.offset; 
	
	par.panels.add(panel);
	
//столешница
	var panelPar = {
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, -3000),
		}
	
	var panel = drawCountertop(panelPar).mesh;
	panel.position.x = -sideWallDim.newellSize - modelDim.countertop.ledge;
	panel.position.y = params.height;
	panel.position.z = -modelDim.countertop.ledge;
	par.countertop.add(panel);
	
	return par;

} //end of drawCarcas

/** фуниция отрисовывает боковину комода
*/

function drawSideWall_(par){
	par.carcas = new THREE.Object3D();	
	par.panels = new THREE.Object3D();
	var dxfX0 = par.dxfBasePoint.x;
	par.dxfArr = dxfPrimitivesArr;
	
	var modelDim = getModelDimensions();
	var sideWallDim = modelDim.sideWall;
	
	//константы

	var topBeamSize = sideWallDim.topBeamSize;
	var botBeamSize = sideWallDim.botBeamSize;
	var botBeamOffset = modelDim.leg;
	var panelThk = sideWallDim.panelThk;
	var panelLedge = sideWallDim.panelLedge;

	var panelPosZ = sideWallDim.panelOffset;
	if(par.side == "left") panelPosZ = sideWallDim.newellSize - panelThk - sideWallDim.panelOffset;
	

	var polePar = {
		poleProfileY: sideWallDim.newellSize,
		poleProfileZ: sideWallDim.newellSize,
		dxfBasePoint: par.dxfBasePoint,
		length: params.height - modelDim.countertop.thk,
		poleAngle: Math.PI / 2,
		partName: "timberPole",
	}
	
	//передняя стоевая
	var pos = {
		x: params.depth - sideWallDim.newellSize,
		y: 0,
	}
	polePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y)
	var newell = drawPole3D_4(polePar).mesh;
	newell.position.x = pos.x;
	newell.position.y = pos.y;
	par.carcas.add(newell);
	
	//задняя стоевая
	var pos = {
		x: 0,
		y: 0,
		}
	polePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y)
	var newell = drawPole3D_4(polePar).mesh;
	newell.position.x = pos.x;
	newell.position.y = pos.y;
	par.carcas.add(newell);
	
	//перемычки
	
	var polePar = {
		poleProfileY: topBeamSize,
		poleProfileZ: sideWallDim.newellSize,
		dxfBasePoint: par.dxfBasePoint,
		length: params.depth - sideWallDim.newellSize * 2,
		poleAngle: 0,
		partName: "timberPole",
		}
		
	//верхняя перемычка
	var pos = {
		x: 0,//sideWallDim.newellSize,
		y: params.height - polePar.poleProfileY - modelDim.countertop.thk,
		}
	polePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y)
	var newell = drawPole3D_4(polePar).mesh;
	newell.position.x = pos.x;
	newell.position.y = pos.y;
	par.carcas.add(newell);
	
	//нижняя перемычка
	var pos = {
		x: 0,
		y: botBeamOffset,
		}
	polePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);
	polePar.poleProfileY = botBeamSize;
	var newell = drawPole3D_4(polePar).mesh;
	newell.position.x = pos.x;
	newell.position.y = pos.y;
	par.carcas.add(newell);
	
	//панель
	
	var platePar = {
		len: params.depth - sideWallDim.newellSize * 2 + panelLedge * 2,
		width: params.height - botBeamOffset - botBeamSize - topBeamSize + panelLedge * 2 - modelDim.countertop.thk,
		thk: panelThk,
		partName: "mdfPlate",
		}
	var pos = {
		x: -panelLedge,
		y: botBeamOffset + botBeamSize - panelLedge,
		}
	platePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y)
	var panel = drawPlate(platePar).mesh;
	panel.position.x = pos.x;
	panel.position.y = pos.y;
	panel.position.z = panelPosZ; 
	
	par.carcas.add(panel);
	

	return par;

}

function drawCountertop(par){
	par.mesh = new THREE.Object3D();
	var modelDim = getModelDimensions();
	
	par.len = params.width + modelDim.countertop.ledge * 2;
	par.width = params.depth + modelDim.countertop.ledge * 2;
	
	var p0 = {x: 0, y:0};
	var p1 = copyPoint(p0);
	var p2 = newPoint_xy(p0, 0, par.width);
	var p3 = newPoint_xy(p0, par.len, par.width);
	var p4 = newPoint_xy(p0, par.len, 0);
	
	var points = [p1, p2, p3, p4];
	
	//создаем шейп
	var shapePar = {
		points: points,
		dxfArr: dxfPrimitivesArr,
		dxfBasePoint: par.dxfBasePoint,
		//radIn: radIn, //Радиус скругления внутренних углов
		radOut: modelDim.countertop.cornerRad, //радиус скругления внешних углов
		//markPoints: true,
	}
	
	var shape = drawShapeByPoints2(shapePar).shape;
	
	var extrudeOptions = {
        amount: modelDim.countertop.thk,
        bevelEnabled: false,
        curveSegments: 12,
        steps: 1
		};

	var geom = new THREE.ExtrudeGeometry(shape, extrudeOptions);
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
	var mesh = new THREE.Mesh(geom, params.materials.timber);
	mesh.rotation.x = Math.PI / 2;
	par.mesh.add(mesh);

	//сохраняем данные для спецификации
	par.partName = "countertop";
	par.thk = modelDim.countertop.thk;
	if(typeof specObj !='undefined' && par.partName){
		if(!specObj[par.partName]){
			specObj[par.partName] = {
				types: {},
				amt: 0,
				name: "Столешница",
				area: 0,
				paintedArea: 0,
				paintedArea: 0,
				metalPaint: false,
				timberPaint: true,
				division: "timber",
				group: "Каркас",
				}
			}
		var area = par.len * par.width / 1000000;
		var paintedArea = area * 2 + (par.len + par.width) * 2 * par.thk / 1000000;
		
		var name = Math.round(par.len) + "x" + Math.round(par.width) + "x" + Math.round(par.thk);
		if(specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] += 1;
		if(!specObj[par.partName]["types"][name]) specObj[par.partName]["types"][name] = 1;
		specObj[par.partName]["amt"] += 1;
		specObj[par.partName]["area"] += area;
		specObj[par.partName]["paintedArea"] += paintedArea;
		}
	
	//сохраняем данные для ведомости деталей
	var addToPoleList = true;
	
	//if(par.partName == "timberPlate") addToPoleList = true;

	if(typeof poleList != 'undefined' && addToPoleList && par.partName){
		var poleType = Math.round(par.len) + "x" + Math.round(par.width) + "x" + Math.round(modelDim.countertop.thk);
		//формируем массив, если такого еще не было
		if(!poleList[poleType]) poleList[poleType] = [];
		var polePar = {
			len1: Math.round(par.length),
			len2: Math.round(par.length),
			len3: Math.round(par.length),
			angStart: par.angStart,
			angEnd: par.angEnd,
			cutOffsetStart: 0,
			cutOffsetEnd: 0,
			poleProfileY: par.poleProfileY,
			poleProfileZ: par.poleProfileY,
			}

		//комментарий назначение детали
		if(par.sectText) polePar.text = "Столешница";


		polePar.description = [];
		polePar.description.push(polePar.text);
		polePar.amt = 1;

		poleList[poleType].push(polePar);
		}
		
	return par;
}

/** функция устанавливает основные размеры, зависящие от модели
*/
function getModelDimensions(){
	var par = {
		leg: 125, //высота ножек
		bridgeThk: 0, //толщина горизонтальных перемычек между ящиками
		vertBridgeThk: params.thinBoardThk, //толщина вертикальных перемычек между ящиками
		sectWallThk: params.thinBoardThk, //толщина перегородок между секциями
		sideWall: {
			newellSize: 50, //сечение стоевых	
			topBeamSize: params.thinBoardThk, //сечение верхней перемычки по У
			botBeamSize: params.thinBoardThk, //сечение нижней перемычки
			panelThk: params.mdfThk, //толщина панели вставки
			panelLedge: 5, //выступ вставки на одну сторону
			panelOffset: 10, //смещение плоскости вставки от внешней плоскости боковины
			},
		rearWall: {
			thk: params.mdfThk,
			offset: 2, //утапливание задней стенки относительно задней плоскости шкафа
			ledge: 10,
			},
		countertop: {
			ledge: 15,
			thk: params.thinBoardThk,
			cornerRad: 20,
			},
		door: {
			thk: params.thinBoardThk,
			gap: 2,
			topBeamSize: params.thinBoardThk, //сечение верхней перемычки по У
			botBeamSize: params.thinBoardThk, //сечение нижней перемычки
			},
		drawer: {
			sideThk: params.thinBoardThk,
			botThk: params.mdfThk,
			botOffset: 10, //Отступ днища от низа ящика
			botLedge: 10, //вхожнение днища в паз по одной стороне
			deltaLen: 10, //коррекция длины ящика под направляющие
			sideOffset: 15, //боковой зазор от боковины ящика до каркаса
			deltaHeight: 40, // разница высоты фасада и корпуса
			}
		} 
	
	if(params.model == "Брутал"){
		par.leg = 40; //высота ног
		par.bridgeThk = params.thinBoardThk;
		par.sideWall = {
			newellSize: 80, //сечение стоевых	
			topBeamSize: params.thickBoardThk, //сечение верхней перемычки по У
			botBeamSize: params.thickBoardThk, //сечение нижней перемычки
			panelThk: params.mdfThk, //толщина панели вставки
			panelLedge: 5, //выступ вставки на одну сторону
			panelOffset: 10, //смещение плоскости вставки от внешней плоскости боковины
			};
		par.countertop = {
			ledge: 15,
			thk: params.thickBoardThk,
			cornerRad: 0,
			};
		par.door.botBeamSize = params.thickBoardThk;
		}
	return par;
	
}//end of getModelDimensions

