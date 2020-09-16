/** функция отрисовывает стеллаж
*/
function drawShelfTower(par) {

	par.carcas = new THREE.Object3D();
	par.panels = new THREE.Object3D();
	par.countertop = new THREE.Object3D();
	var dxfX0 = par.dxfBasePoint.x;
	par.dxfArr = dxfPrimitivesArr
	var legPar = getProfParams(par.legProf);


	//полки
	

	var panelPar = {
		len: par.width,
		width: par.depth - legPar.sizeB * 2,
		thk: par.shelfThk,
		partName: "shelf",
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 2000, 0),
		dxfArr: dxfPrimitivesArr,
	}
	
	if(par.carcasModel == "панели" || par.carcasModel == "бруски") panelPar.width = par.depth;
	if(par.carcasModel == "панели") panelPar.len = par.width - legPar.sizeA * 2;
		
	var botShelfPosY = par.botOffset + par.shelfThk;
	var shelfStep = (par.height - par.topOffset - par.botOffset - par.shelfThk) / (par.shelfAmt - 1);
	var shelfPositions = [];
	
	//вырезы полки для стеллажа с брусками
	var drawShefFunc = drawPlate
	if(par.carcasModel == "бруски"){
		//полка с вырезами
		drawShefFunc = drawNotchedPlate;
		/*
		//меняем местами длину и ширину
		var temp = panelPar.len;
		panelPar.len = panelPar.width
		panelPar.width = temp
		*/
		var notch = {x: legPar.sizeB, y: legPar.sizeA,}

		panelPar.notches = {
            hasNothes: true,
			botIn: notch,
            botOut: notch,
            topIn: notch,
            topOut: notch,
		};		
	}
	
	for (var i = 0; i < par.shelfAmt; i++) {
		
		if(par.carcasModel == "панели"){
			//последняя полка толстая
			if(i == par.shelfAmt - 1) panelPar.thk = legPar.sizeA;
		}
			
		var panel = drawShefFunc(panelPar).mesh;
		panel.rotation.x = Math.PI / 2
		panel.position.x = 0;
		if(par.carcasModel == "панели") panel.position.x = legPar.sizeA;
		panel.position.y = botShelfPosY + shelfStep * i;
		panel.position.z = (par.depth - panelPar.width) / 2;
		if(par.carcasModel == "бруски"){
			panel.rotation.z = Math.PI / 2
			panel.position.x = panelPar.len
		}
		par.countertop.add(panel);
		shelfPositions.push(panel.position.y);
		
		panelPar.dxfArr = [];
	}


	par.carcasParams = [];

	var modelDim = getModelDimensions();
	var sideWallDim = modelDim.sideWall;


	// левая боковина
	var sidePar = {
		dxfBasePoint: par.dxfBasePoint,
		side: "left",
		shelfPositions: shelfPositions,
		legProf: par.legProf,
		bridgeProf: par.bridgeProf,
		width: par.depth,
		height: par.height,
		shelfThk: par.shelfThk,
		carcasModel: par.carcasModel,
		topOffset: par.topOffset,
	}
	
	var leftSideObj = drawSideWall(sidePar);
	leftSideObj.carcas.rotation.y = -Math.PI / 2;
	leftSideObj.carcas.position.z = legPar.sizeB;
	leftSideObj.carcas.position.x = legPar.sizeA + par.sideOverhang;
	leftSideObj.panels.rotation.y = leftSideObj.carcas.rotation.y;
	leftSideObj.panels.position.z = leftSideObj.carcas.position.z;
	leftSideObj.panels.position.x = leftSideObj.carcas.position.x;

	par.carcas.add(leftSideObj.carcas);
	par.panels.add(leftSideObj.panels);

	// правая боковина
	sidePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, par.depth + 200, 0);
	sidePar.side = "right";

	var rightSideObj = drawSideWall(sidePar);
	rightSideObj.carcas.rotation.y = -Math.PI / 2;
	rightSideObj.carcas.position.x = par.width - par.sideOverhang;
	rightSideObj.carcas.position.z = legPar.sizeB;

	rightSideObj.panels.rotation.y = rightSideObj.carcas.rotation.y;
	rightSideObj.panels.position.x = rightSideObj.carcas.position.x;
	rightSideObj.panels.rotation.z = rightSideObj.carcas.position.z;


	par.carcas.add(rightSideObj.carcas);
	par.panels.add(rightSideObj.panels);

	//царги
	var bridgePar = getProfParams(par.bridgeProf)


	var polePar = {
		poleProfileY: bridgePar.sizeA,
		poleProfileZ: bridgePar.sizeB,
		dxfBasePoint: newPoint_xy(par.dxfBasePoint, 0, -1000),
		length: par.width - legPar.sizeA * 2 - par.sideOverhang * 2,
		poleAngle: 0,
	}

	//задняя царга
	var pos = {
		x: legPar.sizeA + par.sideOverhang,
		y: par.height - polePar.poleProfileY - modelDim.countertop.thk,
		z: par.depth - polePar.poleProfileZ - par.frontOverhang,
	}
	var pole1 = drawPole3D_4(polePar).mesh;
	pole1.position.x = pos.x;
	pole1.position.y = pos.y;
	pole1.position.z = par.frontOverhang;
	par.carcas.add(pole1);

	//верхняя передняя царга
	polePar.dxfBasePoint.y -= 200;
	var pole2 = drawPole3D_4(polePar).mesh;
	pole2.position.x = pos.x;
	pole2.position.y = pos.y;
	pole2.position.z = pos.z;
	par.carcas.add(pole2);
	/*	
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
	*/

	//задняя стенка
	if (par.rearPanel == "есть") {
		var platePar = {
			len: par.width - sideWallDim.newellSize * 2 + modelDim.rearWall.ledge * 2,
			width: par.rearPanelHeight,
			thk: modelDim.rearWall.thk,
			partName: "mdfPlate",
		}
		var pos = {
			x: -modelDim.rearWall.ledge,
			y: modelDim.leg,
		}
		platePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, 0, -2000)
		var panel = drawPlate(platePar).mesh;
		panel.position.x = pos.x;
		panel.position.y = pos.y;
		panel.position.z = modelDim.rearWall.offset;

		par.panels.add(panel);
	}
	
	return par;

} //end of drawCarcas

/** фуниция отрисовывает боковину стеллажа в стиле лофт
		dxfBasePoint: par.dxfBasePoint,
		side: "left",
		shelfPositions: shelfPositions,
		legProf: par.legProf,
		bridgeProf: par.bridgeProf,
		width: par.depth,
		height: par.height,
		shelfThk: par.shelfThk,
		carcasModel: par.carcasModel,
 */

function drawSideWall(par) {
	par.carcas = new THREE.Object3D();
	par.panels = new THREE.Object3D();
	var dxfX0 = par.dxfBasePoint.x;
	par.dxfArr = dxfPrimitivesArr;
	var modelDim = getModelDimensions();
	var sideWallDim = modelDim.sideWall;
	var legPar = getProfParams(par.legProf)
	var beamPar = getProfParams(par.bridgeProf)

	//константы

	var topBeamSize = par.legProf;
	var botBeamSize = par.legProf;
	var botBeamOffset = par.botOffset - beamPar.sizeB;
	var panelThk = sideWallDim.panelThk;
	var panelLedge = sideWallDim.panelLedge;

	var panelPosZ = sideWallDim.panelOffset;
	if (par.side == "left") panelPosZ = sideWallDim.newellSize - panelThk - sideWallDim.panelOffset;


	var polePar = {
		poleProfileY: legPar.sizeB,
		poleProfileZ: legPar.sizeA,
		dxfBasePoint: par.dxfBasePoint,
		length: par.height,
		poleAngle: Math.PI / 2,
	}
	
	if(par.carcasModel == "панели" || par.carcasModel == "бруски") polePar.material = params.materials.timber
		
	//передняя стоевая
	var pos = {
		x: par.width - legPar.sizeB,
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
	
	if(par.carcasModel != "панели"){
		var polePar = {
			poleProfileY: legPar.sizeB,
			poleProfileZ: legPar.sizeA,
			dxfBasePoint: par.dxfBasePoint,
			length: par.width - legPar.sizeB * 2,
			poleAngle: 0,
		}
		if(par.carcasModel == "бруски") {
			polePar.material = params.materials.timber
			polePar.poleProfileY = 20;
		}
		
		//верхняя перемычка
		if(par.topOffset != 0){
			var pos = {
				x: 0, //sideWallDim.newellSize,
				y: par.height - polePar.poleProfileY,
			}
			
			polePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y)
			var newell = drawPole3D_4(polePar).mesh;
			newell.position.x = pos.x;
			newell.position.y = pos.y;
			par.carcas.add(newell);
		}
		//остальные перемычки

		if (par.shelfPositions) {
			$.each(par.shelfPositions, function (i) {
				var pos = {
					x: 0,
					y: this - par.shelfThk - polePar.poleProfileY,
				}
				polePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y);
				//polePar.poleProfileY = botBeamSize;
				var beam = drawPole3D_4(polePar).mesh;
				beam.position.x = pos.x;
				beam.position.y = pos.y;
				par.carcas.add(beam);

				//рисунок крест
				if (par.carcasModel == "кресты" && i < par.shelfPositions.length - 1) {
					var crossPar = {
						height: par.shelfPositions[1] - par.shelfPositions[0] - par.shelfThk - beamPar.sizeB,
						width: par.width - legPar.sizeB * 2,
						dxfBasePoint: polePar.dxfBasePoint,
					}
					var cross = drawCross(crossPar).mesh;
					cross.position.y = this;
					par.carcas.add(cross);
				}
			})
		}
	}
	//панель
	var drawPanel = false;
	if (par.sidePanel == "две") drawPanel = true;
	if (par.side == "left" && par.sidePanel == "левая") drawPanel = true;
	if (par.side == "right" && par.sidePanel == "правая") drawPanel = true;
	if (drawPanel) {
		var platePar = {
			len: par.width - sideWallDim.newellSize * 2 + panelLedge * 2,
			width: par.height - botBeamOffset - botBeamSize - topBeamSize + panelLedge * 2 - modelDim.countertop.thk,
			thk: panelThk,
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
	}

	var partName = "shelfSideWall"
	if(typeof specObj !='undefined' && partName){
		if(!specObj[partName]){
			specObj[partName] = {
				types: {},
				amt: 0,
				name: "Боковина стеллажа",
				area: 0,
				paintedArea: 0,
				metalPaint: true,
				timberPaint: false,
				division: "metal",
				workUnitName: "amt",
				group: "additionalObjectsMetal",
			}
			if(par.carcasModel == "панели" || par.carcasModel == "бруски") {
				specObj[partName].metalPaint = false;
				specObj[partName].timberPaint = true;
				specObj[partName].division = "timber";
				specObj[partName].group = "additionalObjectsTimber";
			} 
		}
		
		
		var area = par.height * par.width / 1000000;
		var paintedArea = area * 2;

		var name = Math.round(par.height) + "x" + Math.round(par.width);
		if(specObj[partName]["types"][name]) specObj[partName]["types"][name] += 1;
		if(!specObj[partName]["types"][name]) specObj[partName]["types"][name] = 1;
		specObj[partName]["amt"] += 1;
		specObj[partName]["area"] += area;
		specObj[partName]["paintedArea"] += paintedArea;
	}
	par.carcas.specId = partName + name;
	
	
	return par;

}


/** функция устанавливает основные размеры, зависящие от модели
 */
function getModelDimensions() {
	var thinBoardThk = 20;
	var thickBoardThk = 40;
	var mdfThk = 4;
	
	var par = {
		leg: 125, //высота ножек
		bridgeThk: 0, //толщина горизонтальных перемычек между ящиками
		vertBridgeThk: thinBoardThk, //толщина вертикальных перемычек между ящиками
		sectWallThk: thinBoardThk, //толщина перегородок между секциями
		sideWall: {
			newellSize: 50, //сечение стоевых	
			topBeamSize: thinBoardThk, //сечение верхней перемычки по У
			botBeamSize: thinBoardThk, //сечение нижней перемычки
			panelThk: mdfThk, //толщина панели вставки
			panelLedge: 5, //выступ вставки на одну сторону
			panelOffset: 10, //смещение плоскости вставки от внешней плоскости боковины
		},
		rearWall: {
			thk: mdfThk,
			offset: 2, //утапливание задней стенки относительно задней плоскости шкафа
			ledge: 10,
		},
		countertop: {
			ledge: 15,
			thk: thickBoardThk,
			cornerRad: 10,
		},
		door: {
			thk: thinBoardThk,
			gap: 2,
			topBeamSize: thinBoardThk, //сечение верхней перемычки по У
			botBeamSize: thinBoardThk, //сечение нижней перемычки
		},
		drawer: {
			sideThk: thinBoardThk,
			botThk: mdfThk,
			botOffset: 10, //Отступ днища от низа ящика
			botLedge: 10, //вхожнение днища в паз по одной стороне
			deltaLen: 10, //коррекция длины ящика под направляющие
			sideOffset: 15, //боковой зазор от боковины ящика до каркаса
			deltaHeight: 40, // разница высоты фасада и корпуса
		}
	}

	return par;

} //end of getModelDimensions

function drawCross(par) {
	par.mesh = new THREE.Object3D();
	var profSize = 20;
	var offset = 5;

	//первая итерация - приблизительный расчет длины среза профиля
	var poleHeight = par.height - 40;
	var angle = Math.atan(poleHeight / par.width);
	var profSize_ang = profSize / Math.cos(angle);

	//вторая итерация		
	poleHeight = par.height - profSize_ang - offset * 2;
	angle = Math.atan(poleHeight / par.width);
	profSize_ang = profSize / Math.cos(angle);
	var len = poleHeight / Math.sin(angle)

	var polePar = {
		poleProfileY: profSize,
		poleProfileZ: profSize,
		dxfBasePoint: par.dxfBasePoint,
		length: len,
		poleAngle: angle,
		angStart: angle,
		angEnd: angle,
		partName: "shelfCrossProfile",
	}

	var pos = {
		x: 0,
		y: offset,
	}
	polePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y)
	var pole = drawPole3D_4(polePar).mesh;
	pole.position.x = pos.x;
	pole.position.y = pos.y;
	par.mesh.add(pole);

	var pos = {
		x: par.width,
		y: offset,
	}
	polePar.dxfBasePoint = newPoint_xy(par.dxfBasePoint, pos.x, pos.y)
	var pole = drawPole3D_4(polePar).mesh;
	pole.rotation.y = Math.PI;
	pole.position.x = pos.x;
	pole.position.y = pos.y;
	pole.position.z = profSize * 2;
	par.mesh.add(pole);

	return par;
}