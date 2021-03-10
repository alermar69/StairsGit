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

	var topBeamSize = sideWallDim.topBeamSize;
	var botBeamSize = sideWallDim.botBeamSize;
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
			poleProfileY: beamPar.sizeB,
			poleProfileZ: beamPar.sizeA,
			dxfBasePoint: par.dxfBasePoint,
			length: par.width - legPar.sizeB * 2,
			poleAngle: 0,
		}
		if(par.carcasModel == "бруски") {
			polePar.material = params.materials.timber
			//polePar.poleProfileY = 20;
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
				
				if(par.carcasModel == "бруски") {
					if(i == par.shelfPositions.length - 1) return true;
					pos.y += 200;
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
	console.log(drawPanel);
	if (drawPanel) {
		var platePar = {
			len: par.width - sideWallDim.newellSize * 2 + panelLedge * 2,
			width: par.height - botBeamOffset - botBeamSize - topBeamSize + panelLedge * 2,
			thk: panelThk,
		}
		var pos = {
			x: -panelLedge,
			y: botBeamOffset + botBeamSize - panelLedge,
		}

		console.log(botBeamSize)
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
	if(!par.profSize) par.profSize = 20;
	var offset = 5;

	//первая итерация - приблизительный расчет длины среза профиля
	var poleHeight = par.height - 40;
	var angle = Math.atan(poleHeight / par.width);
	var profSize_ang = par.profSize / Math.cos(angle);

	//вторая итерация		
	poleHeight = par.height - profSize_ang - offset * 2;
	angle = Math.atan(poleHeight / par.width);
	profSize_ang = par.profSize / Math.cos(angle);
	var len = poleHeight / Math.sin(angle)

	var polePar = {
		poleProfileY: par.profSize,
		poleProfileZ: par.profSize,
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
	pole.position.z = par.profSize * 2;
	if(par.isFlat) pole.position.z = par.profSize
	par.mesh.add(pole);

	return par;
}