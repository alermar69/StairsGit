var stringerWidth = 300;
var riserThickness = 20;
var nose = 20;
var topTredWidth = 40;
var topRackLedge = 30;
var lastRiserWidthOffset = 20;
var topRackTreadOffset = 0; //смещение верхней проступи от края верхнего столба
var excerptDepthForStaircase1 = 0; //выборка под опорный столб для прямой лестницы
var excerptDepthForStaircase2 = 0; //выборка под опорный столб для прямой лестницы
var turnFactor = 1;
var treadsObj;

var testingMode = false;
var frontEdgeRad = 6; //Радиус передней кромки ступени


function drawStaircase(viewportId, isVisible) {

	//удаляем старую лестницу

	for(var layer in layers){
		removeObjects(viewportId, layer);
		}


	//очищаем массив параметров деталей лестницы для спецификации
    staircasePartsParams = {
        handrails: [],
        rigels: [],
        columns: [],
		braces: [],
		sideHandrailHolderAmt: 0,
		};

			var model = {
		objects: [],
		add: function(obj, layer){
			var objInfo = {
				obj: obj,
				layer: layer,
				}
			this.objects.push(objInfo);
		},
	};

	var mesh = new THREE.Object3D();
	mesh.name = getCurrentObjectName();

	//обнуляем счетчики спецификации
	partsAmt = {};
	partsAmt_bal = {unit: "banister"}
	specObj = partsAmt; //задаем объект, куда будут сохраняться данные для спецификации
	poleList = {};

	/*удаляем контуры*/
	dxfPrimitivesArr = [];
	var dxfBasePointStep = 200.0;

/*направление поворота (глобальные переменные)*/

if (params.turnSide == "правое") turnFactor = 1;
if (params.turnSide == "левое") turnFactor = -1;

if(testingMode) frontEdgeRad = 0;


/*** СТУПЕНИ НА ВСЕ ЛЕСТНИЦЫ ***/

	treadsObj = drawTreads()
	model.add(treadsObj.treads, "treads");
	model.add(treadsObj.risers, "risers");
	
	//добавляем параметры пригласительных ступеней в глобальный объект
	staircasePartsParams.startTreadsParams = treadsObj.startTreadsParams;

/*** ПЛИНТУС НА ВСЕ ЛЕСТНИЦЫ ***/

var skirtingPar = {
	treadsObj: treadsObj,
	dxfBasePoint: {x: 0, y: -10000},
	}
var skirting = drawSkirting_all(skirtingPar).mesh;
model.add(skirting, "treads");

/** каркас на все лестницы **/

	var carcasPar = {
		dxfBasePoint: {x: 0, y: 2000},
		treadsObj: treadsObj,
	}
	var turnSteps = treadsObj.wndPar;
	var carcasObj = drawCarcas(carcasPar);

	model.add(carcasObj.mesh1, "carcas");
	model.add(carcasObj.mesh2, "carcas1");
	model.add(carcasObj.columns, "newel");
	


/* ограждения на все лестницы */

	var railingParams = {
		dxfBasePoint: {x: 15000, y: 2000},
		treadsObj: treadsObj,
		stringerParams: carcasPar.stringerParams,
	};

	var railingObj = drawRailing(railingParams);
	model.add(railingObj.mesh, "railing");


/** поворотные столбы **/
/*
	var newellsPar = {
		dxfBasePoint: {x: 30000, y: 2000},
		treadsObj: treadsObj,
		stringerParams: carcasPar.stringerParams,
		railingObj: railingObj
	}

	var newellObj = drawNewells_2(newellsPar);
	newellObj.mesh1.position.x -= params.M / 2;
	newellObj.mesh2.position.x -= params.M / 2;
	newellObj.mesh3.position.x -= params.M / 2;
	newellObj.mesh4.position.x -= params.M / 2;
	model.add(newellObj.mesh1, "newel");
	model.add(newellObj.mesh2, "newel1");
	model.add(newellObj.mesh3, "newel2");
	model.add(newellObj.mesh4, "newel3");
*/
/*** ПРИСТЕННЫЙ ПОРУЧЕНЬ НА ВСЕ ЛЕСТНИЦЫ ***/

	var sideHandrailPar = {
		treadsObj: treadsObj,
		dxfBasePoint: {x: 25000, y: 2000},
		}

	var handrail = drawSideHandrail_all(sideHandrailPar).mesh;
	model.add(handrail, "handrails");

	var fixings = drawFixings();
	model.add(fixings, "fixings");


	//сдвигаем и поворачиваем лестницу чтобы верхний марш был вдоль оси Х
	var moove = calcStaircaseMoove(treadsObj.lastMarshEnd);

	//сохраняем позицию лестницы для позиционирования шкафа
	params.starcasePos = moove;
	params.starcasePos.rot = moove.rot;

	for(var i=0; i<model.objects.length; i++){
		var obj = model.objects[i].obj;
		//позиционируем
		obj.position.x += moove.x;// + params.staircasePosX;
		obj.position.y += moove.y;//params.staircasePosY;
		obj.position.z += moove.z;// + params.staircasePosZ + params.M / 2 * turnFactor;
		obj.rotation.y = moove.rot;

		//добавляем в сцену
		// addObjects(viewportId, obj, model.objects[i].layer);
		obj.setLayer(model.objects[i].layer);
		
		//добавляем в сцену
		mesh.add(obj);
	}
	addObjects(viewportId, mesh);

	//измерение размеров на модели
	addMeasurement(viewportId);

	setTimeout(function() {
		if(typeof staircaseLoaded != 'undefined') staircaseLoaded();
	}, 0);

} //end of drawStair

/**
 * Функция отрисовывает крепления лестницы к окружению
 */
function drawFixings(){
	var basePoint = { x:0, y:0, z:params.M + 100 };
	var fixings = new THREE.Object3D();
	var fixTypes = [];
	for (var i = 1; i <= 6; i++) {fixTypes.push(params["fixPart" + i])};
	for (var i = 0; i < fixTypes.length; i++) {
		var fixType = fixTypes[i];
		if (fixType == 'химия') {
			var chemAnc = drawChemAnc().mesh;
			chemAnc.rotation.z = Math.PI / 2;
			chemAnc.position.x = basePoint.x;
			chemAnc.position.y = basePoint.y;
			chemAnc.position.z = basePoint.z;
			fixings.add(chemAnc);
		}
		if (fixType == 'глухари') {
			// screw_10x100
			var screwPar = {
				id: "screw_10x100",
				description: "Крепление к обстановке",
				group: "Окружение",
				hasShim: true
			}
			
			var screw = drawScrew(screwPar).mesh;
			screw.rotation.z = Math.PI / 2;
			screw.position.x = basePoint.x;
			screw.position.y = basePoint.y;
			screw.position.z = basePoint.z;
			fixings.add(screw);
		}
		basePoint.z += 50
	}
	return fixings;
}