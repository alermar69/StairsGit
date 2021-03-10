//создаем глобальные массивы
var dimensions = [];
var dxfPrimitivesArr = [];
var dxfBasePoint = {
	x: 0,
	y: 0,
}

//функция - оболочка
function drawCoupeWr(viewportId, isVisible) {

	var viewportId = 'vl_1';

	//очищаем все слои
	for (var layer in layers) {
		removeObjects(viewportId, layer);
	}

	//очищаем глобальный массив параметров для спецификации
	staircasePartsParams = {
		carport: []
	};

	var model = {
		objects: [],
		add: function (obj, layer) {
			var objInfo = {
				obj: obj,
				layer: layer,
			}
			this.objects.push(objInfo);
		},
	};

	//обнуляем счетчики спецификации
	partsAmt = {};
	partsAmt_bal = {
		unit: "banister"
	}
	specObj = partsAmt; //задаем объект, куда будут сохраняться данные для спецификации
	poleList = {};
	railingParams = {};
	shapesList = [];
	dxfPrimitivesArr = [];

	//отрисовка углового шкафа

	model.add(drawWR().mesh);


	for (var i = 0; i < model.objects.length; i++) {
		var obj = model.objects[i].obj;

		if (!obj) continue;

		//позиционируем
		obj.position.x += params.staircasePosX;
		obj.position.y += params.staircasePosY;
		obj.position.z += params.staircasePosZ;
		obj.rotation.y += params.stairCaseRotation;

		obj.layerName = model.objects[i].layer;

		//добавляем в сцену
		addObjects(viewportId, obj, model.objects[i].layer);

	}

	//измерение размеров на модели
	addMeasurement(viewportId);

	if (typeof staircaseLoaded !== undefined) staircaseLoaded();

} //drawWardrobe;

/**
 * Получаем стандартные параметры
 * @param par 
 */
function getWrParams(par){
	var wrParams = false;
	//отрисовка через объекты - добавляем параметры по умолчанию
	wrParams = Object.assign(wrTemplates['default'], par);
	
	//отрисовка в модуле купе
	if(params.calcType == "coupe") wrParams = Object.assign({}, params);

	return wrParams;
}

function drawWR(par){
	var mesh = new THREE.Object3D();
	
	wrPar = getWrParams(par);

	
	// if (wrPar.sideWall_wr.indexOf('кресты') != -1 || wrPar.sideWall_wr == 'проф. труба') {
	// 	var legProfParams = getProfParams(wrPar.legProf)
	// 	wrPar.width_wr -= legProfParams.sizeA * 2;
	// }

	//очищаем глобальные массивы	
	doorPos = {};
	boardsList = {};

	//отрисовка прямого шкафа
	if (wrPar.geom_wr == "прямой") {
		var stringerPar = drawStrightWr();
		mesh.add(stringerPar.mesh);
	} //конец прямого шкафа
	if (wrPar.geom_wr == "угловой") {

		var leftOffset = 0;
		var rightOffset = 0;
		var topOffset = 0;
		var botOffset = 0;
		var rearOffset = 0;
		if (wrPar.rearWall_wr == "накладная") rearOffset = wrPar.rearWallThk_wr;
		var sidePanelsWidth = wrPar.leftDept - rearOffset;
		var sidePanelsWidth_r = wrPar.rightDepth - rearOffset;

		var carcas = new THREE.Object3D();

		//левая боковая стенка
		if (wrPar.leftWall_wr != "нет") {

			var platePar = {
				height: wrPar.height_wr,
				width: sidePanelsWidth,
				thk: wrPar.carcasThk_wr,
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: dxfBasePoint,
				text: "левая панель",
				material: params.materials.timber,
				roundHoles: [],
				partName: "carcasPanel",
				edging: {
					top: wrPar.sideEdging,
					bot: wrPar.sideEdging,
					left: wrPar.sideEdging,
					right: wrPar.sideEdging,
				}
			}
			if (wrPar.leftWall_wr == "фальшпанель") platePar.width = 100;
			if (wrPar.topWall_wr == "накладная") platePar.height -= wrPar.carcasThk_wr;

			var plate = drawPlateWr(platePar).mesh;
			plate.rotation.y = -Math.PI / 2;
			plate.position.x = wrPar.carcasThk_wr;
			if (wrPar.leftSect == "треугольная" || wrPar.leftSect == "радиусная") plate.position.x += wrPar.leftSectWidth;
			plate.position.z = wrPar.leftDept - platePar.width;
			carcas.add(plate)

			dxfBasePoint = newPoint_xy(dxfBasePoint, platePar.width + 500, 0);
			leftOffset = wrPar.carcasThk_wr;

		} //конец левой панели

		//правая боковая стенка

		if (wrPar.rightWall_wr != "нет") {

			var platePar = {
				height: wrPar.height_wr,
				width: sidePanelsWidth_r,
				thk: wrPar.carcasThk_wr,
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: dxfBasePoint,
				text: "левая панель",
				material: params.materials.timber,
				roundHoles: [],
				partName: "carcasPanel",
				edging: {
					top: wrPar.sideEdging,
					bot: wrPar.sideEdging,
					left: wrPar.sideEdging,
					right: wrPar.sideEdging,
				}
			}
			if (wrPar.rightWall_wr == "фальшпанель") platePar.width = 100;
			if (wrPar.topWall_wr == "накладная") platePar.height -= wrPar.carcasThk_wr;

			var plate = drawPlateWr(platePar).mesh;
			plate.position.x = wrPar.leftSectWidth + wrPar.leftWidth - wrPar.rightDepth;
			plate.position.z = wrPar.rightWidth + wrPar.rightSectWidth - wrPar.carcasThk_wr;
			if (wrPar.rightSect == "треугольная" || wrPar.rightSect == "радиусная") plate.position.z -= wrPar.rightSectWidth;
			carcas.add(plate)

			dxfBasePoint = newPoint_xy(dxfBasePoint, platePar.width + 500, 0);
			rightOffset = wrPar.carcasThk_wr;

		} //конец правой панели

		//нижняя плита
		var botPlatePar = {
			thk: wrPar.carcasThk_wr,
			dxfBasePoint: dxfBasePoint,
			material: params.materials.timber,
			rightOffset: rightOffset,
			leftOffset: leftOffset,
		}

		var plate = drawCornerPlate(botPlatePar).mesh;
		plate.rotation.x = Math.PI / 2;
		plate.position.y = wrPar.legsHeight_wr;
		carcas.add(plate)

		botOffset = plate.position.y;
		dxfBasePoint = newPoint_xy(dxfBasePoint, botPlatePar.width + 500, 0);

		//верхняя плита
		var platePar = {
			thk: wrPar.carcasThk_wr,
			dxfBasePoint: dxfBasePoint,
			material: params.materials.timber,
			rightOffset: rightOffset,
			leftOffset: leftOffset,
		}

		var plate = drawCornerPlate(platePar).mesh;
		plate.rotation.x = Math.PI / 2;
		plate.position.y = wrPar.height_wr - wrPar.carcasThk_wr;
		carcas.add(plate)

		topOffset = wrPar.carcasThk_wr
		dxfBasePoint = newPoint_xy(dxfBasePoint, platePar.width + 500, 0);


		//задняя стенка левой секции

		var platePar = {
			height: wrPar.height_wr,
			width: wrPar.leftSectWidth + wrPar.leftWidth,
			thk: wrPar.carcasThk_wr,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: dxfBasePoint,
			text: "задняя левая панель",
			material: params.materials.timber,
			roundHoles: [],
			partName: "rearPanel",
		}
		if (wrPar.rightWall_wr == "фальшпанель") platePar.width = 100;
		if (wrPar.topWall_wr == "накладная") platePar.height -= wrPar.carcasThk_wr;

		var plate = drawPlateWr(platePar).mesh;
		plate.position.x = 0;
		plate.position.z = 0;
		carcas.add(plate)

		dxfBasePoint = newPoint_xy(dxfBasePoint, platePar.width + 500, 0);
		leftOffset = wrPar.carcasThk_wr;

		//задняя стенка правой секции

		var platePar = {
			height: wrPar.height_wr,
			width: wrPar.rightSectWidth + wrPar.rightWidth,
			thk: wrPar.carcasThk_wr,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: dxfBasePoint,
			text: "задняя правая панель",
			material: params.materials.timber,
			roundHoles: [],
			partName: "rearPanel",
		}
		if (wrPar.leftWall_wr == "фальшпанель") platePar.width = 100;
		if (wrPar.topWall_wr == "накладная") platePar.height -= wrPar.carcasThk_wr;

		var plate = drawPlateWr(platePar).mesh;
		plate.rotation.y = -Math.PI / 2;
		plate.position.x = wrPar.leftSectWidth + wrPar.leftWidth;
		plate.position.z = 0;
		carcas.add(plate)

		dxfBasePoint = newPoint_xy(dxfBasePoint, platePar.width + 500, 0);
		leftOffset = wrPar.carcasThk_wr;
		carcas.setLayer('carcas')
		mesh.add(carcas);

		function drawCornerContent() {}; //пустая функция для навигации

		//левая сторона
		//параметры секций
		var sections = [];
		$("#sectParamsTable .sectParams").each(function () {
			var sectPar = {
				width: parseFloat($(this).find(".sectWidth").val()),
				type: $(this).find(".door").val(), //$(".door").val(),
			}
			sections.push(sectPar)
		});

		//параметры полок
		var boxes = [];
		$(".boxParams").each(function () {
			var boxPar = {
				sect: $(this).find(".boxSect").val(),
				posX: parseFloat($(this).find(".boxPosX").val()),
				posY: parseFloat($(this).find(".boxRow").val()),
				height: parseFloat($(this).find(".boxHeight").val()),
				type: $(this).find(".boxType").val(),
				widthType: $(this).find(".boxWidthType").val(),
				width: parseFloat($(this).find(".boxWidth").val()),
				boxDoorPlusIn: parseFloat($(this).find(".boxDoorPlusIn").val()),
				boxDoorPlusRight: parseFloat($(this).find(".boxDoorPlusRight").val()),
				boxDoorPlusLeft: parseFloat($(this).find(".boxDoorPlusLeft").val()),
				boxDoorPlusTop: parseFloat($(this).find(".boxDoorPlusTop").val()),
				boxDoorPlusBot: parseFloat($(this).find(".boxDoorPlusBot").val()),
				boxCarcasHeight: parseFloat($(this).find(".boxCarcasHeight").val()),
			}
			if (boxPar.sect < 20) boxes.push(boxPar);
		});

		var contentPar = {
			leftOffset: leftOffset,
			rightOffset: rightOffset,
			topOffset: topOffset,
			botOffset: botOffset,
			rearOffset: rearOffset,
			sections: sections,
			thk: wrPar.carcasThk_wr,
			dxfBasePoint: dxfBasePoint,
			timberMaterial: params.materials.timber,
			boxes: boxes,
			side: "left",
			isTopShelf: wrPar.isTopShelf,
		}

		contentPar = drawContentWr(contentPar);
		contentPar.carcasMesh.position.x = wrPar.leftSectWidth;
		contentPar.shelfsMesh.position.x = wrPar.leftSectWidth;


		carcas.setLayer('carcas')
		carcas.setLayer('shelfs')
		mesh.add(contentPar.carcasMesh);
		mesh.add(contentPar.shelfsMesh);

		//наполнение правой стороны

		//параметры секций
		var sections = [];
		$("#sectParamsTable_r .sectParams").each(function () {
			var sectPar = {
				width: parseFloat($(this).find(".sectWidth").val()),
				type: $(this).find(".door").val(), //$(".door").val(),
			}
			sections.push(sectPar)
		});

		//параметры полок
		var boxes = [];
		$(".boxParams").each(function () {
			var boxPar = {
				sect: $(this).find(".boxSect").val(),
				posX: parseFloat($(this).find(".boxPosX").val()),
				posY: parseFloat($(this).find(".boxRow").val()),
				height: parseFloat($(this).find(".boxHeight").val()),
				type: $(this).find(".boxType").val(),
				widthType: $(this).find(".boxWidthType").val(),
				width: parseFloat($(this).find(".boxWidth").val()),
				boxDoorPlusIn: parseFloat($(this).find(".boxDoorPlusIn").val()),
				boxDoorPlusRight: parseFloat($(this).find(".boxDoorPlusRight").val()),
				boxDoorPlusLeft: parseFloat($(this).find(".boxDoorPlusLeft").val()),
				boxDoorPlusTop: parseFloat($(this).find(".boxDoorPlusTop").val()),
				boxDoorPlusBot: parseFloat($(this).find(".boxDoorPlusBot").val()),
				boxCarcasHeight: parseFloat($(this).find(".boxCarcasHeight").val()),
			}
			if (boxPar.sect >= 20) boxes.push(boxPar);
		});

		var contentPar = {
			leftOffset: leftOffset,
			rightOffset: rightOffset,
			topOffset: topOffset,
			botOffset: botOffset,
			rearOffset: rearOffset,
			sections: sections,
			thk: wrPar.carcasThk_wr,
			dxfBasePoint: dxfBasePoint,
			timberMaterial: params.materials.timber,
			boxes: boxes,
			side: "right",
			isTopShelf: wrPar.isTopShelf_r,
		}

		contentPar = drawContentWr(contentPar);
		contentPar.carcasMesh.rotation.y = -Math.PI / 2;
		contentPar.carcasMesh.position.x = wrPar.leftSectWidth + wrPar.leftWidth;

		contentPar.shelfsMesh.rotation.y = -Math.PI / 2;
		contentPar.shelfsMesh.position.x = wrPar.leftSectWidth + wrPar.leftWidth;

		carcas.setLayer('carcas')
		carcas.setLayer('shelfs')
		mesh.add(contentPar.carcasMesh);
		mesh.add(contentPar.shelfsMesh);



		function drawCornerDoors() {}; //пустая функция для навигации

		//двери
		if (wrPar.diagDoorType == "прямая") {

			var doorGroup = new THREE.Object3D();

			var doorPosZ = 0;

			//нижний профиль
			var profParams = {
				type: "bot",
				len: botPlatePar.diagLen,
				dxfBasePoint: dxfBasePoint,
			}
			var prof = drawDoorProf(profParams).mesh;
			prof.position.x = 0;
			prof.position.y = botOffset;
			prof.position.z = doorPosZ;

			doorGroup.add(prof)

			//верхний профиль

			var profParams = {
				type: "top",
				len: botPlatePar.diagLen,
				dxfBasePoint: dxfBasePoint,
			}
			var prof = drawDoorProf(profParams).mesh;
			prof.position.x = 0;
			prof.position.y = wrPar.height_wr - topOffset;
			prof.position.z = doorPosZ;

			doorGroup.add(prof)
			//конструктивные размеры профилей
			var constParams = getDoorParams();

			var doorPar = {
				height: wrPar.height_wr - topOffset - botOffset - constParams.doorOffsetTop - constParams.doorOffsetBot,
				width: (botPlatePar.diagLen) / wrPar.kupeDoorAmt_wr + wrPar.doorOverHang,
				thk: wrPar.carcasThk_wr,
				dxfArr: dxfPrimitivesArr,
				dxfBasePoint: dxfBasePoint,
				text: "дверь",
				profMaterial: params.materials.metal,
				plateMaterial: params.materials.timber2,
				plates: [],
			}

			var doorRow = "row0";
			var doorMooveStep = (botPlatePar.diagLen - wrPar.doorOverHang) / wrPar.kupeDoorAmt_wr

			//цикл постронения дверей
			for (var i = 0; i < wrPar.kupeDoorAmt_wr; i++) {
				doorPar.doorId = i;
				//считываем из формы параметры вставок дверей
				doorPar.plates = [];
				var selector = "#doorPar" + i
				if (wrPar.isDoorsEqual == "да") selector = "#doorPar0"
				$(selector).find(".inpostParams").each(function () {
					var platePar = {
						height: $(this).find(".inpostHeight").val() * 1.0,
						material: $(this).find(".inpostMat").val(),
					}
					doorPar.plates.push(platePar);
				});

				var door = drawCoupeDoor(doorPar).mesh;
				//door.position.z = 1500;



				//var plate = drawPlateWr(platePar).mesh;
				door.position.x = 0 + doorMooveStep * i;
				door.position.y = botOffset + constParams.doorOffsetBot;
				door.position.z = doorPosZ + profParams.doorDist / 2;
				if (doorRow == "row1") door.position.z -= profParams.doorDist;

				doorGroup.add(door)
				dxfBasePoint = newPoint_xy(dxfBasePoint, wrPar.depth_wr + 500, 0);

				//сохраняем позицию двери
				if (doorPos.rows == undefined) {
					doorPos = {
						rows: {
							row0: [],
							row1: [],
						},
						leftEnd: leftOffset,
						rightEnd: leftOffset + doorMooveStep * (wrPar.kupeDoorAmt_wr - 2),
						doorWidth: platePar.width,
						doorMooveStep: doorMooveStep,
					}
				}

				doorPos.rows[doorRow].push({
					id: i,
					pos: door.position.x,
				});


				if (doorRow == "row0") doorRow = "row1";
				else doorRow = "row0";

			} //конец цикла построения дверей 

			//позиционирование группы с дверьми

			//сдвигаем профиль внутрь шкафа
			basePoint = polar(botPlatePar.diagBasePoint, botPlatePar.diagAngle + Math.PI / 2, -50)

			var basePoint = {
				x: basePoint.x,
				y: 0,
				z: basePoint.y,
			}


			doorGroup.rotation.y = -botPlatePar.diagAngle;
			doorGroup.position.x = basePoint.x;
			doorGroup.position.z = basePoint.z;

			doorGroup.setLayer('doors')
			mesh.add(doorGroup);
		}


		if (wrPar.diagDoorType != "прямая") {
			//дверь 1
			var doorPar = {
				rad: botPlatePar.doorRad,
				height: wrPar.height_wr - wrPar.carcasThk_wr * 2 - 30,
				thk: 10,
				angle: (botPlatePar.angEnd - botPlatePar.angStart) / 2,
				dxfBasePoint: dxfBasePoint,
				text: "Дверь",
				material: params.materials.timber,
			}

			var door = drawArcPanel(doorPar).mesh;
			door.rotation.x = Math.PI / 2;
			door.rotation.z = botPlatePar.angStart;
			door.position.x = botPlatePar.center.x;
			door.position.y = wrPar.height_wr - wrPar.carcasThk_wr - 20;
			door.position.z = botPlatePar.center.y;

			door.setLayer('doors')
			mesh.add(door);


			//дверь 2
			var doorPar = {
				rad: botPlatePar.doorRad - 50,
				height: wrPar.height_wr - wrPar.carcasThk_wr * 2 - 30,
				thk: 10,
				angle: (botPlatePar.angEnd - botPlatePar.angStart) / 2,
				dxfBasePoint: dxfBasePoint,
				text: "Дверь",
				material: params.materials.timber,
			}
			if (wrPar.diagDoorType == "вогнутая") doorPar.rad = botPlatePar.doorRad + 50;
			var door = drawArcPanel(doorPar).mesh;
			door.rotation.x = Math.PI / 2;
			door.rotation.z = botPlatePar.angStart + (botPlatePar.angEnd - botPlatePar.angStart) / 2;
			door.position.x = botPlatePar.center.x;
			door.position.y = wrPar.height_wr - wrPar.carcasThk_wr - 20;
			door.position.z = botPlatePar.center.y;
			door.setLayer('doors')
			mesh.add(door);
		}
	}

	wrPar.mesh = mesh;
	return wrPar;
}

function getWardrobePar(){
	var inputs = [
		"model_wr", "geom_wr", "type_wr", "leftWall_wr", "rightWall_wr", "topWall_wr", "botWall_wr", 
		"botWallType", "rearWall_wr", "topPanelOffset_wr", "width_wr", "leftWidth", "rightWidth", 
		"height_wr", "depth_wr", "leftDept", "rightDepth", "leftSect", "leftSectWidth", "leftSectDepth", 
		"leftSectShelfAmt", "rightSect", "rightSectWidth", "rightSectDepth", "rightSectShelfAmt", "diagDoorType", 
		"diagDoorRad", "topOnlay_wr", "sideWall_wr", "sectDoorsType_wr", "rearWallMat_wr", "doorProfMat_wr", 
		"schlegel", "schlegelColor", "closer", "carcasMat", "carcasMatColor", "rearWallColor", "profileColor", 
		"doorPlateColor", "boxType", "boxRailingModel", "doorsMat_wr", "boxHandles", "faceEdging", "sideEdging", "carcasThk_wr", 
		"doorPlateThk", "rearWallThk_wr", "rearWallDelta_wr", "doorsThk_wr", "boxBotThk", "legsHeight_wr", "doorsOffset_wr", 
		"isTopShelf", "topShelfPosY", "topShelfSect1", "sectAmt_r",
		"isTopShelf_r", "topShelfPosY_r", "topShelfSect1_r", "boxAmt_wr", "curSect", "eqBorderTop",
		"topShelfSect2", "topShelfSect2_r",
		"sectDoorsModel_wr",
		"eqBorderBot", "copySectType", "copyType", "copyMooveY", "copySect", "kupeDoorAmt_wr", "isDoorsEqual"];
	var wrParams = {};
	inputs.forEach(function(input){
		wrParams[input] = params[input];
	});
	var sections = [];
	$("#sectParamsTable .sectParams").each(function () {
		var sectPar = {
			width: parseFloat($(this).find(".sectWidth").val()),
			type: $(this).find(".door").val(),
		}
		sections.push(sectPar)
	});

	var boxes = [];
	$(".boxParams").each(function () {

		var boxPar = {
			sect: $(this).find(".boxSect").val(),
			posX: parseFloat($(this).find(".boxPosX").val()),
			posY: parseFloat($(this).find(".boxRow").val()),
			height: parseFloat($(this).find(".boxHeight").val()),
			type: $(this).find(".boxType").val(),
			widthType: $(this).find(".boxWidthType").val(),
			width: parseFloat($(this).find(".boxWidth").val()),
		}

		$(this).find("input,select").each(function () {
			var classList = $(this).attr('class').split(/\s+/);
			boxPar[classList[0]] = $(this).val();
			if ($(this).attr("type") == "number") boxPar[classList[0]] *= 1.0;
		})

		if (boxPar.sect <= wrPar.sectAmt) boxes.push(boxPar);
	});
	wrParams['sectAmt'] = sections.length;
	wrParams['sections'] = sections;
	wrParams['boxes'] = boxes;

	return wrParams;
}

var wrPar = {}; // Глобальный массив параметров like params

function drawStrightWr(){
	
	if (params.calcType != "coupe") {
		var sections = wrPar.sections || [];
		var boxes = wrPar.boxes || [];
		
		sections.forEach(function(section){
			section.width = wrPar.width_wr - wrPar.carcasThk_wr * 2;
		})
	}
	
	if (params.calcType == "coupe"){
		var sections = [];

		$("#sectParamsTable .sectParams").each(function () {
			var sectPar = {
				width: parseFloat($(this).find(".sectWidth").val()),
				type: $(this).find(".door").val(),
			}
			sections.push(sectPar)
		});

		var boxes = [];
		$(".boxParams").each(function () {

			var boxPar = {
				sect: $(this).find(".boxSect").val(),
				posX: parseFloat($(this).find(".boxPosX").val()),
				posY: parseFloat($(this).find(".boxRow").val()),
				height: parseFloat($(this).find(".boxHeight").val()),
				type: $(this).find(".boxType").val(),
				widthType: $(this).find(".boxWidthType").val(),
				width: parseFloat($(this).find(".boxWidth").val()),
			}

			$(this).find("input,select").each(function () {
				var classList = $(this).attr('class').split(/\s+/);
				boxPar[classList[0]] = $(this).val();
				if ($(this).attr("type") == "number") boxPar[classList[0]] *= 1.0;
			})

			if (boxPar.sect <= wrPar.sectAmt) boxes.push(boxPar);
		});

		console.log(sections, boxes);
	}
	wrPar.mesh = new THREE.Object3D();
	
	/***  ВНЕШНИЕ ПАНЕЛИ КОРПУСА  ***/
	//корпус
	var carcasParams = {
		heightLeft: wrPar.height_wr,
		heightRight: wrPar.height_wr,
		width: wrPar.width_wr,
		depth: wrPar.depth_wr,
		sectAmt: wrPar.sectAmt,
	};

	var carcas = drawCarcasStright(carcasParams).mesh;
	carcas.setLayer('carcas')
	wrPar.mesh.add(carcas);

	var leftOffset = carcasParams.leftOffset;
	var rightOffset = carcasParams.rightOffset;
	var topOffset = carcasParams.topOffset;
	var botOffset = carcasParams.botOffset;
	var rearOffset = carcasParams.rearOffset;

	//левая дополнительная секция
	if (wrPar.leftSect != "нет") {
		var sideSectPar = {
			side: "left",
			height: wrPar.height_wr,
			width: wrPar.leftSectWidth,
			shelfType: wrPar.leftSect,
			depth: wrPar.leftSectDepth,
			shelfAmt: wrPar.leftSectShelfAmt,
			dxfBasePoint: dxfBasePoint,
		}
		var sideSect = drawSideSect(sideSectPar).mesh;
		sideSect.setLayer('carcas')
		wrPar.mesh.add(sideSect);
	}

	//правая дополнительная секция
	if (wrPar.rightSect != "нет") {
		dxfBasePoint = newPoint_xy(dxfBasePoint, wrPar.depth_wr + 500, 0);
		var sideSectPar = {
			side: "right",
			height: wrPar.height_wr,
			width: wrPar.rightSectWidth,
			shelfType: wrPar.rightSect,
			depth: wrPar.rightSectDepth,
			shelfAmt: wrPar.rightSectShelfAmt,
			dxfBasePoint: dxfBasePoint,
		}
		var sideSect = drawSideSect(sideSectPar).mesh;
		sideSect.position.x = wrPar.width_wr;
		sideSect.setLayer('carcas')
		wrPar.mesh.add(sideSect)
	}

	dxfBasePoint = {
		x: 0,
		y: 4000,
	};

	var contentPar = {
		leftOffset: leftOffset,
		rightOffset: rightOffset,
		topOffset: topOffset,
		botOffset: botOffset,
		rearOffset: rearOffset,
		sections: sections,
		thk: wrPar.contentThk_wr,
		dxfBasePoint: dxfBasePoint,
		timberMaterial: params.materials.timber,
		boxes: boxes,
		side: "left",
		isTopShelf: wrPar.isTopShelf,
	}

	if (wrPar.leftWall_wr == "фальшпанель") contentPar.leftOffset = 0;
	if (wrPar.rightWall_wr == "фальшпанель") contentPar.rightOffset = 0;
	if (wrPar.topWall_wr == "фальшпанель") contentPar.topOffset = 0;
	if (wrPar.botWall_wr == "фальшпанель") contentPar.botOffset = 0;

	contentPar = drawContentWr(contentPar);

	contentPar.carcasMesh.setLayer('carcas')
	wrPar.mesh.add(contentPar.carcasMesh)
	contentPar.shelfsMesh.setLayer('shelfs')
	wrPar.mesh.add(contentPar.shelfsMesh)

	//двери купе
	if (wrPar.model_wr == "купе") {

		dxfBasePoint = {
			x: 0,
			y: 8000,
		};

		var doorPosZ = wrPar.depth_wr - 50;

		//нижняя направляющая
		var profParams = {
			type: "bot",
			len: wrPar.width_wr - leftOffset - rightOffset,
			dxfBasePoint: newPoint_xy(dxfBasePoint, -4000, 0),
		}
		var prof = drawDoorProf(profParams).mesh;
		prof.position.x = leftOffset;
		prof.position.y = botOffset;
		prof.position.z = doorPosZ;

		prof.setLayer('doors')
		wrPar.mesh.add(prof)

		//верхняя направляющая

		var profParams = {
			type: "top",
			len: wrPar.width_wr - leftOffset - rightOffset,
			dxfBasePoint: newPoint_xy(dxfBasePoint, -4000, -400),
		}
		var prof = drawDoorProf(profParams).mesh;
		prof.position.x = leftOffset;
		prof.position.y = wrPar.height_wr - topOffset;
		prof.position.z = doorPosZ;
		prof.setLayer('doors');
		wrPar.mesh.add(prof);


		//конструктивные размеры профилей
		var constParams = getDoorParams();
		//расчет ширины двери
		var totalWidth = wrPar.width_wr - leftOffset - rightOffset; //внутренняя ширина проема
		var doorWidth = (totalWidth + constParams.doorOverHang * (wrPar.kupeDoorAmt_wr - 1) - constParams.shlegelThk) / wrPar.kupeDoorAmt_wr;
		var doorOverHang = (constParams.doorOverHang * (wrPar.kupeDoorAmt_wr - 1) - constParams.shlegelThk) / (wrPar.kupeDoorAmt_wr - 1);


		var doorPar = {
			height: wrPar.height_wr - topOffset - botOffset - constParams.doorOffsetTop - constParams.doorOffsetBot,
			width: doorWidth,
			thk: wrPar.carcasThk_wr,
			dxfArr: dxfPrimitivesArr,
			dxfBasePoint: dxfBasePoint,
			profMaterial: params.materials.metal,
			plateMaterial: params.materials.timber2,
			plates: [],
		}

		var doorRow = "row0";
		var doorMooveStep = doorWidth - doorOverHang;



		//цикл постронения дверей
		for (var i = 0; i < wrPar.kupeDoorAmt_wr; i++) {
			doorPar.doorId = i;
			//считываем из формы параметры вставок дверей
			doorPar.plates = [];
			var selector = "#doorPar" + i
			if (wrPar.isDoorsEqual == "да") selector = "#doorPar0"
			$(selector).find(".inpostParams").each(function () {
				var platePar = {
					height: $(this).find(".inpostHeight").val() * 1.0,
					material: $(this).find(".inpostMat").val(),
				}
				doorPar.plates.push(platePar);
			});

			// var doorId = i;
			// if (wrPar.isDoorsEqual == "да") doorId = 0;

			// var inputs = matchInArray('inpostHeight'+doorId+'.*', Object.keys(wrPar));
			// for (var j = 0; j < inputs.length; j++) {
			// 	console.log(j)
			// 	var platePar = {
			// 		height: params['inpostHeight' + doorId.toString() + j.toString()] * 1.0,//$(this).find(".inpostHeight").val() * 1.0,
			// 		material: params['inpostMat' + doorId.toString() + j.toString()],//$(this).find(".inpostMat").val(),
			// 	}
			// 	console.log(platePar);
			// 	doorPar.plates.push(platePar);
			// }


			var door = drawCoupeDoor(doorPar).mesh;

			door.position.x = leftOffset + doorMooveStep * i;
			door.position.y = botOffset + constParams.doorOffsetBot;
			door.position.z = doorPosZ + profParams.doorDist / 2;
			if (doorRow == "row1") door.position.z -= profParams.doorDist;

			door.setLayer('doors');
			wrPar.mesh.add(door);

			dxfBasePoint = newPoint_xy(dxfBasePoint, doorPar.height + 500, 0);
			doorPar.dxfBasePoint = dxfBasePoint;

			//сохраняем позицию двери
			if (doorPos.rows == undefined) {
				doorPos = {
					rows: {
						row0: [],
						row1: [],
					},
					leftEnd: leftOffset,
					rightEnd: leftOffset + doorMooveStep * (wrPar.kupeDoorAmt_wr - 1),
					doorWidth: doorPar.width,
					doorMooveStep: doorMooveStep,
				}
			}

			doorPos.rows[doorRow].push({
				id: i,
				pos: door.position.x,
			});


			if (doorRow == "row0") doorRow = "row1";
			else doorRow = "row0";

		} //конец цикла построения дверей 

		//сохраняем параметры дверей для спецификации
		wrParams.totalDoorsWidth = Math.round(totalWidth);
		wrParams.totalDoorsHeight = Math.round(wrPar.height_wr - topOffset - botOffset);
		wrParams.doorWidth = Math.round(doorWidth);
		wrParams.doorHeight = Math.round(doorPar.height);
	}

	//размеры

	//высота шкафа

	var dimPar = {
		p1: {
			x: 0,
			y: 0,
			z: wrPar.depth_wr + 1
		},
		p2: {
			x: 0,
			y: wrPar.height_wr,
			z: wrPar.depth_wr + 1
		},
		offset: -100,
		basePlane: "xy",
		baseAxis: "y",
	}
	var dim = drawDimension3D_2(dimPar).mesh;
	dimensions.push(dim);

	//ширина шкафа
	var dimPar = {
		p1: {
			x: 0,
			y: wrPar.height_wr,
			z: wrPar.depth_wr + 1
		},
		p2: {
			x: wrPar.width_wr,
			y: wrPar.height_wr,
			z: wrPar.depth_wr + 1
		},
		offset: 100,
		basePlane: "xy",
		baseAxis: "x",
	}
	var dim = drawDimension3D_2(dimPar).mesh;
	dimensions.push(dim);

	//размеры заполнения
	var dimPosX = leftOffset;
	if (wrPar.leftWall_wr == "фальшпанель") dimPosX = 0;
	var dimPosZ = wrPar.depth_wr - wrPar.doorsOffset_wr + 1

	for (var sectId = 0; sectId < wrPar.sectAmt; sectId++) {
		var sectionWidth = wrPar["sectWidth" + sectId]

		//ширина секции
		var dimPar = {
			p1: {
				x: dimPosX,
				y: botOffset,
				z: dimPosZ
			},
			p2: {
				x: dimPosX + sectionWidth,
				y: botOffset,
				z: dimPosZ
			},
			offset: 100,
			basePlane: "xy",
			baseAxis: "x",
		}
		var dim = drawDimension3D_2(dimPar).mesh;
		dimensions.push(dim);

		//высота полок и ящиков
		dimPosX += sectionWidth * 0.3;

		var sectBoxes = calcBoxDist(sectId);
		$(sectBoxes).each(function () {
			if (this.type == "ящик") {
				var dimPar = {
					p1: {
						x: dimPosX,
						y: this.bot,
						z: dimPosZ
					},
					p2: {
						x: dimPosX,
						y: this.top,
						z: dimPosZ
					},
					offset: 20,
					basePlane: "xy",
					baseAxis: "y",
				}
				var dim = drawDimension3D_2(dimPar).mesh;
				dimensions.push(dim);
			}
			if (this.type == "полка") {
				var dimPar = {
					p1: {
						x: dimPosX,
						y: this.top,
						z: dimPosZ
					},
					p2: {
						x: dimPosX,
						y: this.top + this.distTop,
						z: dimPosZ
					},
					offset: 20,
					basePlane: "xy",
					baseAxis: "y",
				}
				var dim = drawDimension3D_2(dimPar).mesh;
				dimensions.push(dim);
				//позиция первой полки снизу

				if (this.distBot == this.bot) {
					var dimPar = {
						p1: {
							x: dimPosX,
							y: 0,
							z: dimPosZ
						},
						p2: {
							x: dimPosX,
							y: this.bot,
							z: dimPosZ
						},
						offset: 20,
						basePlane: "xy",
						baseAxis: "y",
					}
					var dim = drawDimension3D_2(dimPar).mesh;
					dimensions.push(dim);
				}
			}
		})

		dimPosX += sectionWidth * 0.7 + wrPar.carcasThk_wr;
	}

	return wrPar;
}