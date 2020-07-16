//создаем глобальные массивы
var carcas_wr = []; 
var wrCarcas1 = []; 
var wrCarcas2 = [];
var doors = [];
var shelfs = [];
var metis = [];
var dimensions = [];
var dxfPrimitivesArr = [];
var dxfBasePoint = {x:0, y:0,}

//функция - оболочка
function addWardrobe(viewportId, isVisible) {

//удаляем предыдущий шкаф
	if (carcas_wr) removeObjects(viewportId, 'carcas_wr');
	if (wrCarcas1) removeObjects(viewportId, 'wrCarcas1');
	if (wrCarcas2) removeObjects(viewportId, 'wrCarcas2');	
	if (doors) removeObjects(viewportId, 'doors');
	if (shelfs) removeObjects(viewportId, 'shelfs');
	if (metis) removeObjects(viewportId, 'metis');
	if (dimensions) removeObjects(viewportId, 'dimensions');

//очищаем глобальные массивы
	carcas_wr = [];
	wrCarcas1 = []; 
    wrCarcas2 = []; 
	doors = [];
	shelfs = [];
	metis = [];
	dimensions = [];	
	doorPos = {};
	specObj = {};
	boardsList = {};
	dxfPrimitivesArr = [];

//Материалы
	var timberMaterial = params.materials.timber;//new THREE.MeshLambertMaterial( { color: 0x804000, overdraw: 0.5} );
	var timberMaterial2 = params.materials.timber2;//new THREE.MeshLambertMaterial( { color: 0xD29252, overdraw: 0.5} );	
	var metalMaterial = params.materials.metal;//new THREE.MeshLambertMaterial({color: 0x363636, wireframe: false});
	// var floorMaterial = new THREE.MeshLambertMaterial( {color: 0xBFBFBF});	
	// var stringerMaterial = new THREE.MeshLambertMaterial({color: 0x363636, wireframe: false});
	
	// params.materials = {};
	// params.materials.timber = timberMaterial;	
	// params.materials.metal = metalMaterial;
	
//константы, локальные переменные
	var thk = params.carcasThk_wr;
	
//инициализация canvas для построение 2d вида спереди
function init2D(){};

	var zeroPoint = {
		x: 200,
		y: 100,
		}
		
	scale = 0.2;
	var imgHeight = (params.height_wr + 400)* scale; //высота картинки в пикселях
	var imgWidth = (params.width_wr + 400)*scale;
	var canvasHeight = 800;

	//параметры построения
	var floorThk = 150;

	/*цвета*/
	var timberColor = '#804000'; // Цвет заливки ступеней
	var turnStepColor = '#D66B00'; // Цвет заливки площадки
	var floorColor = '#C0C0C0'; // Цвет заливки перекрытий
	var staircaseColor = "#000"


	/*построение изображения*/
	var canvas = document.getElementById("mainView"); 
	canvas.width = imgWidth;
	canvas.height = imgHeight;
	var	mainView = canvas.getContext('2d');
		mainView.clearRect(0, 0, imgWidth, imgHeight);//Очищаем холст
		mainView.strokeStyle = "black";

		
	var canvasParams={
		imgWidth: imgWidth,
		imgHeight: imgHeight,
		view: mainView,
		scale: 0.2,
		dimScale: imgHeight/canvasHeight,
		zeroPoint: zeroPoint,
		dxfBasePoint: {x:-5000, y:0},
		}
	
//отрисовка прямого шкафа

function drawStrightWr(){}; //пустая функция для навигации

if(params.geom_wr == "прямой"){

/***  ВНЕШНИЕ ПАНЕЛИ КОРПУСА  ***/

function drawCarcasStright_(){}; //пустая функция для навигации

//корпус

var carcasParams = {
	heightLeft: params.height_wr,
	heightRight: params.height_wr,
	width: params.width_wr,
	depth: params.depth_wr,
	sectAmt: params.sectAmt,
	timberColor: timberColor, 
	canvasParams: canvasParams,
	};

var carcas = drawCarcasStright(carcasParams).mesh;
carcas_wr.push(carcas);

var	leftOffset = carcasParams.leftOffset;
var	rightOffset = carcasParams.rightOffset;
var	topOffset = carcasParams.topOffset;
var	botOffset = carcasParams.botOffset;
var	rearOffset = carcasParams.rearOffset;

//левая дополнительная секция
if(params.leftSect != "нет"){
	var sideSectPar = {
		side: "left",
		height: params.height_wr,
		width: params.leftSectWidth,
		shelfType: params.leftSect,
		depth: params.leftSectDepth,
		shelfAmt: params.leftSectShelfAmt,
		dxfBasePoint: dxfBasePoint,
		}
	var sideSect = drawSideSect(sideSectPar).mesh;
	carcas_wr.push(sideSect)
	}
	
//правая дополнительная секция
if(params.rightSect != "нет"){
	dxfBasePoint = newPoint_xy(dxfBasePoint, params.depth_wr + 500, 0);
	var sideSectPar = {
		side: "right",
		height: params.height_wr,
		width: params.rightSectWidth,
		shelfType: params.rightSect,
		depth: params.rightSectDepth,
		shelfAmt: params.rightSectShelfAmt,
		dxfBasePoint: dxfBasePoint,
		}
	var sideSect = drawSideSect(sideSectPar).mesh;
	sideSect.position.x = params.width_wr;
	carcas_wr.push(sideSect)
	}

function drawContentStright(){}; //пустая функция для навигации

		dxfBasePoint = {x:0, y: 4000,};
//параметры секций
	var sections = [];
	$("#sectParamsTable .sectParams").each(function(){
		var sectPar = {
			width: parseFloat($(this).find(".sectWidth").val()),
			type: $(this).find(".door").val(),
			}
		sections.push(sectPar)	
		});
	
	//параметры полок
	var boxes = [];
	$(".boxParams").each(function(){
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
			shelfSideOffset: parseFloat($(this).find(".shelfSideOffset").val()),
			poleStart: $(this).find(".poleStart").val(),
			poleEnd: $(this).find(".poleEnd").val(),
			}
		if(boxPar.sect <= params.sectAmt) boxes.push(boxPar);
		});
		
var contentPar = {
	leftOffset: leftOffset,
	rightOffset: rightOffset,
	topOffset: topOffset,
	botOffset: botOffset,
	rearOffset: rearOffset,
	sections: sections,
	thk: thk,
	dxfBasePoint: dxfBasePoint,
	timberMaterial: timberMaterial,
	boxes: boxes,
	side: "left",
	isTopShelf: params.isTopShelf,
	canvasParams: canvasParams,
	}

if(params.leftWall_wr == "фальшпанель") contentPar.leftOffset = 0;
if(params.rightWall_wr == "фальшпанель") contentPar.rightOffset = 0;
if(params.topWall_wr == "фальшпанель") contentPar.topOffset = 0;
if(params.botWall_wr == "фальшпанель") contentPar.botOffset = 0;

contentPar = drawContentWr(contentPar);

carcas_wr.push(contentPar.carcasMesh);
shelfs.push(contentPar.shelfsMesh);


//двери
function drawDoorsStright(){};

dxfBasePoint = {x:0, y: 8000,};

var doorPosZ = params.depth_wr - 50;

//нижняя направляющая
var profParams = {
	type: "bot",
	len: params.width_wr - leftOffset - rightOffset,
	dxfBasePoint: newPoint_xy(dxfBasePoint, -4000, 0),
	}
var prof = drawDoorProf(profParams).mesh;
prof.position.x = leftOffset;
prof.position.y = botOffset;
prof.position.z = doorPosZ;
doors.push(prof)

//верхняя направляющая

var profParams = {
	type: "top",
	len: params.width_wr - leftOffset - rightOffset,
	dxfBasePoint: newPoint_xy(dxfBasePoint, -4000, -400),
	}
var prof = drawDoorProf(profParams).mesh;
prof.position.x = leftOffset;
prof.position.y = params.height_wr - topOffset;
prof.position.z = doorPosZ;
doors.push(prof)


	//конструктивные размеры профилей
	var constParams = getDoorParams();
	//расчет ширины двери
	var totalWidth = params.width_wr - leftOffset - rightOffset; //внутренняя ширина проема
	var doorWidth = (totalWidth + constParams.doorOverHang * (params.kupeDoorAmt_wr - 1) - constParams.shlegelThk) / params.kupeDoorAmt_wr;
	var doorOverHang = (constParams.doorOverHang * (params.kupeDoorAmt_wr - 1) - constParams.shlegelThk) / (params.kupeDoorAmt_wr - 1);
	
	
var doorPar = {
	height: params.height_wr - topOffset - botOffset - constParams.doorOffsetTop - constParams.doorOffsetBot,
	width: doorWidth,
	thk: thk,
	dxfArr: dxfPrimitivesArr,
	dxfBasePoint: dxfBasePoint,
	profMaterial: metalMaterial,
	plateMaterial: timberMaterial2,
	plates: [],
	}

var doorRow = "row0";
var doorMooveStep = doorWidth - doorOverHang;



//цикл постронения дверей
for(var i=0; i<params.kupeDoorAmt_wr; i++)	{
	doorPar.doorId = i;
	//считываем из формы параметры вставок дверей
	doorPar.plates = [];
	var selector = "#doorPar" + i
	if(params.isDoorsEqual == "да") selector = "#doorPar0"
	$(selector).find(".inpostParams").each(function(){
		var platePar = {
			height: $(this).find(".inpostHeight").val() * 1.0,
			material: $(this).find(".inpostMat").val(),
			}
		doorPar.plates.push(platePar);
		});

	var door = drawCoupeDoor(doorPar).mesh;

	door.position.x = leftOffset + doorMooveStep * i; 
	door.position.y = botOffset + constParams.doorOffsetBot;
	door.position.z = doorPosZ + profParams.doorDist / 2;	
	if(doorRow == "row1") door.position.z -= profParams.doorDist;
	doors.push(door);
	
	dxfBasePoint = newPoint_xy(dxfBasePoint, doorPar.height + 500, 0);
	doorPar.dxfBasePoint = dxfBasePoint;
	
	//сохраняем позицию двери
	if(doorPos.rows == undefined){
		doorPos = {
			rows: {
				row0: [],
				row1: [],
				},
			leftEnd: leftOffset,
			rightEnd: leftOffset + doorMooveStep * (params.kupeDoorAmt_wr - 1),
			doorWidth: doorPar.width,
			doorMooveStep: doorMooveStep,
			}
		}

	doorPos.rows[doorRow].push({id: i, pos: door.position.x,});
		
		
	if(doorRow == "row0") doorRow = "row1";
	else doorRow = "row0";
	
	} //конец цикла построения дверей 
	
//сохраняем параметры дверей для спецификации
wrParams.totalDoorsWidth = Math.round(totalWidth);
wrParams.totalDoorsHeight = Math.round(params.height_wr - topOffset - botOffset);
wrParams.doorWidth = Math.round(doorWidth);
wrParams.doorHeight = Math.round(doorPar.height);


//размеры

//высота шкафа

var dimPar = {
	p1: {x:0, y: 0, z: params.depth_wr + 1},
	p2: {x:0, y: params.height_wr, z: params.depth_wr + 1},
	offset: -100,
	basePlane: "xy",
	baseAxis: "y",
	}		
var dim = drawDimension3D_2(dimPar).mesh;
dimensions.push(dim);

//ширина шкафа
var dimPar = {
	p1: {x:0, y: params.height_wr, z: params.depth_wr + 1},
	p2: {x:params.width_wr, y: params.height_wr, z: params.depth_wr + 1},
	offset: 100,
	basePlane: "xy",
	baseAxis: "x",
	}		
var dim = drawDimension3D_2(dimPar).mesh;
dimensions.push(dim);

//размеры заполнения
var dimPosX = leftOffset;
if(params.leftWall_wr == "фальшпанель") dimPosX = 0;
var dimPosZ = params.depth_wr - params.doorsOffset_wr + 1

for(var sectId=0; sectId<params.sectAmt; sectId++){
	var sectionWidth = params["sectWidth" + sectId]
	
	//ширина секции
	var dimPar = {
		p1: {x:dimPosX, y: botOffset, z: dimPosZ},
		p2: {x:dimPosX + sectionWidth, y: botOffset, z: dimPosZ},
		offset: 100,
		basePlane: "xy",
		baseAxis: "x",
		}		
	var dim = drawDimension3D_2(dimPar).mesh;
	dimensions.push(dim);

	//высота полок и ящиков
	dimPosX += sectionWidth * 0.3;
	
	var sectBoxes = calcBoxDist(sectId);
	$(sectBoxes).each(function(){
		if(this.type == "ящик"){
			var dimPar = {
				p1: {x:dimPosX, y: this.bot, z: dimPosZ},
				p2: {x:dimPosX, y: this.top, z: dimPosZ},
				offset: 20,
				basePlane: "xy",
				baseAxis: "y",
				}		
			var dim = drawDimension3D_2(dimPar).mesh;
			dimensions.push(dim);
			}
		if(this.type == "полка"){
			var dimPar = {
				p1: {x:dimPosX, y: this.top, z: dimPosZ},
				p2: {x:dimPosX, y: this.top + this.distTop, z: dimPosZ},
				offset: 20,
				basePlane: "xy",
				baseAxis: "y",
				}		
			var dim = drawDimension3D_2(dimPar).mesh;
			dimensions.push(dim);
			//позиция первой полки снизу

			if(this.distBot == this.bot){
				var dimPar = {
					p1: {x:dimPosX, y: 0, z: dimPosZ},
					p2: {x:dimPosX, y: this.bot, z: dimPosZ},
					offset: 20,
					basePlane: "xy",
					baseAxis: "y",
					}		
				var dim = drawDimension3D_2(dimPar).mesh;
				dimensions.push(dim);
				}
			}
		})
		
		dimPosX += sectionWidth * 0.7 + thk;
	}

} //конец прямого шкафа

//отрисовка углового шкафа

function drawCornerWr(){}; //пустая функция для навигации

if(params.geom_wr == "угловой"){

var leftOffset = 0;
var rightOffset = 0;
var topOffset = 0;
var botOffset = 0;
var rearOffset = 0;
if(params.rearWall_wr == "накладная") rearOffset = params.rearWallThk_wr;
var sidePanelsWidth = params.leftDept - rearOffset;
var sidePanelsWidth_r = params.rightDepth - rearOffset;

function drawCarcasCorner(){}; //пустая функция для навигации


	
//левая боковая стенка
if(params.leftWall_wr != "нет"){

	var platePar={
		height: params.height_wr,
		width: sidePanelsWidth,
		thk: thk,
		dxfArr :dxfPrimitivesArr,
		dxfBasePoint: dxfBasePoint,
		text: "левая панель",
		material: timberMaterial,
		roundHoles: [],
		partName: "carcasPanel",
		edging: {
			top: params.sideEdging,
			bot: params.sideEdging,
			left: params.sideEdging,
			right: params.sideEdging,
			}
		}
	if(params.leftWall_wr == "фальшпанель") platePar.width = 100;
	if(params.topWall_wr == "накладная") platePar.height -= thk;
	
	var plate = drawPlate(platePar).mesh;
	plate.rotation.y = - Math.PI /2;
	plate.position.x = thk;
	if(params.leftSect == "треугольная" || params.leftSect == "радиусная") plate.position.x += params.leftSectWidth;
	plate.position.z = params.leftDept - platePar.width;	
	carcas_wr.push(plate);
	
	dxfBasePoint = newPoint_xy(dxfBasePoint, platePar.width + 500, 0);
	leftOffset = thk;
	
} //конец левой панели
	
//правая боковая стенка
	
	if(params.rightWall_wr != "нет"){

	var platePar={
		height: params.height_wr,
		width: sidePanelsWidth_r,
		thk: thk,
		dxfArr :dxfPrimitivesArr,
		dxfBasePoint: dxfBasePoint,
		text: "левая панель",
		material: timberMaterial,
		roundHoles: [],
		partName: "carcasPanel",
		edging: {
			top: params.sideEdging,
			bot: params.sideEdging,
			left: params.sideEdging,
			right: params.sideEdging,
			}
		}
	if(params.rightWall_wr == "фальшпанель") platePar.width = 100;
	if(params.topWall_wr == "накладная") platePar.height -= thk;
	
	var plate = drawPlate(platePar).mesh;
	plate.position.x = params.leftSectWidth + params.leftWidth - params.rightDepth;
	plate.position.z =  params.rightWidth + params.rightSectWidth - thk;
	if(params.rightSect == "треугольная" || params.rightSect == "радиусная") plate.position.z -= params.rightSectWidth;
	carcas_wr.push(plate);
	
	dxfBasePoint = newPoint_xy(dxfBasePoint, platePar.width + 500, 0);
	rightOffset = thk;
	
} //конец правой панели

//нижняя плита
	var botPlatePar = {
		thk: thk,
		dxfBasePoint: dxfBasePoint,
		material: timberMaterial,
		rightOffset: rightOffset,
		leftOffset: leftOffset,
		}
	
	var plate = drawCornerPlate(botPlatePar).mesh;
	plate.rotation.x = Math.PI / 2;
	plate.position.y = params.legsHeight_wr;
	carcas_wr.push(plate);
	botOffset = plate.position.y;
	dxfBasePoint = newPoint_xy(dxfBasePoint, botPlatePar.width + 500, 0);
	
//верхняя плита
	var platePar = {
		thk: thk,
		dxfBasePoint: dxfBasePoint,
		material: timberMaterial,
		rightOffset: 0,
		leftOffset: 0,
		}
	
	var plate = drawCornerPlate(platePar).mesh;
	plate.rotation.x = Math.PI / 2;
	plate.position.y = params.height_wr;
	carcas_wr.push(plate);
	topOffset = thk
	dxfBasePoint = newPoint_xy(dxfBasePoint, platePar.width + 500, 0);

	
//задняя стенка левой секции
	
	var platePar={
		height: params.height_wr,
		width: params.leftSectWidth + params.leftWidth,
		thk: thk,
		dxfArr :dxfPrimitivesArr,
		dxfBasePoint: dxfBasePoint,
		text: "задняя левая панель",
		material: timberMaterial,
		roundHoles: [],
		partName: "rearPanel",
		}
	if(params.rightWall_wr == "фальшпанель") platePar.width = 100;
	if(params.topWall_wr == "накладная") platePar.height -= thk;
	
	var plate = drawPlate(platePar).mesh;
	plate.position.x = 0;
	plate.position.z = 0;
	carcas_wr.push(plate);
	
	dxfBasePoint = newPoint_xy(dxfBasePoint, platePar.width + 500, 0);
	leftOffset = thk;
	
//задняя стенка правой секции
	
	var platePar={
		height: params.height_wr,
		width: params.rightSectWidth + params.rightWidth,
		thk: thk,
		dxfArr :dxfPrimitivesArr,
		dxfBasePoint: dxfBasePoint,
		text: "задняя правая панель",
		material: timberMaterial,
		roundHoles: [],
		partName: "rearPanel",
		}
	if(params.leftWall_wr == "фальшпанель") platePar.width = 100;
	if(params.topWall_wr == "накладная") platePar.height -= thk;
	
	var plate = drawPlate(platePar).mesh;
	plate.rotation.y = - Math.PI /2;
	plate.position.x = params.leftSectWidth + params.leftWidth;	
	plate.position.z = 0;	
	carcas_wr.push(plate);
	
	dxfBasePoint = newPoint_xy(dxfBasePoint, platePar.width + 500, 0);
	leftOffset = thk;
	
function drawCornerContent(){}; //пустая функция для навигации

//левая сторона
//параметры секций
	var sections = [];
	$("#sectParamsTable .sectParams").each(function(){
		var sectPar = {
			width: parseFloat($(this).find(".sectWidth").val()),
			type: $(this).find(".door").val(), //$(".door").val(),
			}
		sections.push(sectPar)	
		});
	
	//параметры полок
	var boxes = [];
	$(".boxParams").each(function(){
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
		if(boxPar.sect < 20) boxes.push(boxPar);
		});
		
var contentPar = {
	leftOffset: leftOffset,
	rightOffset: rightOffset,
	topOffset: topOffset,
	botOffset: botOffset,
	rearOffset: rearOffset,
	sections: sections,
	thk: thk,
	dxfBasePoint: dxfBasePoint,
	timberMaterial: timberMaterial,
	boxes: boxes,
	side: "left",
	isTopShelf: params.isTopShelf,
	}

contentPar = drawContentWr(contentPar);
contentPar.carcasMesh.position.x = params.leftSectWidth;
contentPar.shelfsMesh.position.x = params.leftSectWidth;


carcas_wr.push(contentPar.carcasMesh);
shelfs.push(contentPar.shelfsMesh);

//наполнение правой стороны

//параметры секций
	var sections = [];
	$("#sectParamsTable_r .sectParams").each(function(){
		var sectPar = {
			width: parseFloat($(this).find(".sectWidth").val()),
			type: $(this).find(".door").val(), //$(".door").val(),
			}
		sections.push(sectPar)	
		});
	
	//параметры полок
	var boxes = [];
	$(".boxParams").each(function(){
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
		if(boxPar.sect >= 20) boxes.push(boxPar);
		});
		
var contentPar = {
	leftOffset: leftOffset,
	rightOffset: rightOffset,
	topOffset: topOffset,
	botOffset: botOffset,
	rearOffset: rearOffset,
	sections: sections,
	thk: thk,
	dxfBasePoint: dxfBasePoint,
	timberMaterial: timberMaterial,
	boxes: boxes,
	side: "right",
	isTopShelf: params.isTopShelf_r,
	}

contentPar = drawContentWr(contentPar);
contentPar.carcasMesh.rotation.y = -Math.PI/2; 
contentPar.carcasMesh.position.x = params.leftSectWidth + params.leftWidth;

contentPar.shelfsMesh.rotation.y = -Math.PI/2;
contentPar.shelfsMesh.position.x = params.leftSectWidth + params.leftWidth;

carcas_wr.push(contentPar.carcasMesh);
shelfs.push(contentPar.shelfsMesh);



function drawCornerDoors(){}; //пустая функция для навигации

//двери
if(params.diagDoorType == "прямая"){

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
//doors.push(prof)
doorGroup.add(prof)

//верхний профиль

var profParams = {
	type: "top",
	len: botPlatePar.diagLen,
	dxfBasePoint: dxfBasePoint,
	}
var prof = drawDoorProf(profParams).mesh;
prof.position.x = 0;
prof.position.y = params.height_wr - topOffset;
prof.position.z = doorPosZ;
//doors.push(prof)
doorGroup.add(prof)
	//конструктивные размеры профилей
	var constParams = getDoorParams();

var doorPar = {
	height: params.height_wr - topOffset - botOffset - constParams.doorOffsetTop - constParams.doorOffsetBot,
	width: (botPlatePar.diagLen)/ params.kupeDoorAmt_wr + params.doorOverHang,
	thk: thk,
	dxfArr :dxfPrimitivesArr,
	dxfBasePoint: dxfBasePoint,
	text: "дверь",
	profMaterial: metalMaterial,
	plateMaterial: timberMaterial2,
	plates: [],
	}

var doorRow = "row0";
var doorMooveStep = (botPlatePar.diagLen - params.doorOverHang) / params.kupeDoorAmt_wr

//цикл постронения дверей
for(var i=0; i<params.kupeDoorAmt_wr; i++)	{
	doorPar.doorId = i;
	//считываем из формы параметры вставок дверей
	doorPar.plates = [];
	var selector = "#doorPar" + i
	if(params.isDoorsEqual == "да") selector = "#doorPar0"
	$(selector).find(".inpostParams").each(function(){
		var platePar = {
			height: $(this).find(".inpostHeight").val() * 1.0,
			material: $(this).find(".inpostMat").val(),
			}
		doorPar.plates.push(platePar);
		});

	var door = drawCoupeDoor(doorPar).mesh;
	//door.position.z = 1500;
	
	
	
	//var plate = drawPlate(platePar).mesh;
	door.position.x = 0 + doorMooveStep * i; 
	door.position.y = botOffset + constParams.doorOffsetBot;
	door.position.z = doorPosZ + profParams.doorDist / 2;	
	if(doorRow == "row1") door.position.z -= profParams.doorDist;
	//doors.push(door);
	doorGroup.add(door)
	dxfBasePoint = newPoint_xy(dxfBasePoint, params.depth_wr + 500, 0);
	
	//сохраняем позицию двери
	if(doorPos.rows == undefined){
		doorPos = {
			rows: {
				row0: [],
				row1: [],
				},
			leftEnd: leftOffset,
			rightEnd: leftOffset + doorMooveStep * (params.kupeDoorAmt_wr - 2),
			doorWidth: platePar.width,
			doorMooveStep: doorMooveStep,
			}
		}

	doorPos.rows[doorRow].push({id: i, pos: door.position.x,});
		
		
	if(doorRow == "row0") doorRow = "row1";
	else doorRow = "row0";
	
	} //конец цикла построения дверей 
	
	//позиционирование группы с дверьми
	
	//сдвигаем профиль внутрь шкафа
	basePoint = polar(botPlatePar.diagBasePoint, botPlatePar.diagAngle + Math.PI/2, -50)
	
	var basePoint = {
		x: basePoint.x,
		y: 0,
		z: basePoint.y,
		}
	
	
	doorGroup.rotation.y = -botPlatePar.diagAngle;
	doorGroup.position.x = basePoint.x;
	doorGroup.position.z = basePoint.z;
	
	doors.push(doorGroup)
//	console.log(doorGroup)
	
	
}	
		

if(params.diagDoorType != "прямая"){
	//дверь 1
	var doorPar = {
		rad: botPlatePar.doorRad,
		height: params.height_wr - thk * 2 - 30,
		thk: 10,
		angle: (botPlatePar.angEnd - botPlatePar.angStart) / 2,
		dxfBasePoint: dxfBasePoint,
		text: "Дверь",
		material: timberMaterial,
		}	
	
	var door = drawArcPanel(doorPar).mesh;
	door.rotation.x = Math.PI / 2;
	door.rotation.z = botPlatePar.angStart;
	door.position.x = botPlatePar.center.x;
	door.position.y = params.height_wr - thk - 20;
	door.position.z = botPlatePar.center.y;
	doors.push(door)
 
	//дверь 2
	var doorPar = {
		rad: botPlatePar.doorRad - 50,
		height: params.height_wr - thk * 2 - 30,
		thk: 10,
		angle: (botPlatePar.angEnd - botPlatePar.angStart) / 2,
		dxfBasePoint: dxfBasePoint,
		text: "Дверь",
		material: timberMaterial,
		}	
	if(params.diagDoorType == "вогнутая") doorPar.rad = botPlatePar.doorRad + 50;
	var door = drawArcPanel(doorPar).mesh;
	door.rotation.x = Math.PI / 2;
	door.rotation.z = botPlatePar.angStart + (botPlatePar.angEnd - botPlatePar.angStart) / 2;
	door.position.x = botPlatePar.center.x;
	door.position.y = params.height_wr - thk - 20;
	door.position.z = botPlatePar.center.y;
	doors.push(door)
}
 
/*
rad
height
thk
angle
*/

}
	
	
//поворачиваем шкаф
	var rot = 0;
	
	var pos = {
		x: 0,
		y: 0,
		z: 0,
		}
	
		

	var model = [
		carcas_wr,
		doors,
		shelfs,
		metis,
		dimensions,
		]
	var modelObj = [];
	
	for (var i=0; i<model.length; i++){
		modelObj[i] = new THREE.Object3D();
		
		for (var j=0; j<model[i].length; j++){
			modelObj[i].add(model[i][j]);
			}
		modelObj[i].position.x += -pos.x + params.staircasePosX;
		modelObj[i].position.y += pos.y + params.staircasePosY;
		modelObj[i].position.z += pos.z + params.staircasePosZ;
		modelObj[i].rotation.y = rot;
		}

		carcas_wr = [
			modelObj[0],
			]
		doors = [
			modelObj[1],
			]
		shelfs = [
			modelObj[2],
			]
		metis = [
			modelObj[3],
			]
		dimensions = [
			modelObj[4],
			];
		
//console.log(wrCarcas1)	
/*
//добавляем белые ребра для всех объектов
for (var i = 0; i < wrCarcas1.length; i++) addWareframe(wrCarcas1[i], wrCarcas1);
for (var i = 0; i < wrCarcas2.length; i++) addWareframe(wrCarcas2[i], wrCarcas2);
for (var i = 0; i < carcas_wr.length; i++) addWareframe(carcas_wr[i], carcas_wr);
for (var i = 0; i < doors.length; i++) addWareframe(doors[i], doors);
for (var i = 0; i < shelfs.length; i++) addWareframe(shelfs[i], shelfs);
for (var i = 0; i < metis.length; i++) addWareframe(metis[i], metis);
*/

//добавляем объекты в сцену
addObjects(viewportId, wrCarcas1, 'wrCarcas1');
addObjects(viewportId, wrCarcas2, 'wrCarcas2');
addObjects(viewportId, carcas_wr, 'carcas_wr');
addObjects(viewportId, doors, 'doors');
addObjects(viewportId, shelfs, 'shelfs');
addObjects(viewportId, metis, 'metis');
addObjects(viewportId, dimensions, 'dimensions');


//измерение размеров на модели
	addMeasurement(viewportId);

}//drawWardrobe;

