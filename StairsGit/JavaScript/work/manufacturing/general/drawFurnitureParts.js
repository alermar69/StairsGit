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