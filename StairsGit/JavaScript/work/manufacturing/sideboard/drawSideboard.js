var turnFactor = 1;
var testingMode = false;

function drawSideboard(viewportId, isVisible){
	for(var layer in layers){
		removeObjects(viewportId, layer);
		}
	
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
		
	//обнуляем счетчики спецификации
	partsAmt = {};
	specObj = partsAmt; //задаем объект, куда будут сохраняться данные для спецификации
	poleList = {};

	/*удаляем контуры*/
	dxfPrimitivesArr = [];
	
		/*задаем материалы*/

	var timberMaterial = new THREE.MeshLambertMaterial({ color: 0x804000, overdraw: 0.5 });
	var metalMaterial = new THREE.MeshLambertMaterial({ color: 0x767676, wireframe: false });
	var metalMaterial2 = new THREE.MeshLambertMaterial({ color: 0xA3A3A3, wireframe: false });
	var metalMaterial3 = new THREE.MeshLambertMaterial({ color: 0xB3B3B3, wireframe: false });
	var glassMaterial = new THREE.MeshLambertMaterial({ opacity: 0.6, color: 0x3AE2CE, transparent: true });

	//сохраняем материалы в глобальный массив
	params.materials = {
		timber: timberMaterial,
		metal: metalMaterial,
		metal2: metalMaterial2,
		metal3: metalMaterial3,
		glass: glassMaterial,
		};

	//направление поворота (глобальные переменные)

	if (params.turnSide == "правое") turnFactor = 1;
	if (params.turnSide == "левое") turnFactor = -1;
	
	/*** КАРКАС ***/
	
	var carcasPar = {
		dxfBasePoint: {x: 0, y: 0},
		}
		
	var carcasObj = drawCarcas(carcasPar);
	model.add(carcasObj.carcas, "carcas");
	model.add(carcasObj.panels, "panels");
	model.add(carcasObj.countertop, "countertop");
	
	
	/*** НАПОЛНЕНИЕ ***/
	
	//формируем массив параметров секций
	var sections = [];
	//наполнение секций
	for(var i=0; i<params.sectAmt; i++){
		var section = {
			hingeSide: params["hingeSide" + i],
			width: params["sectWidth" + i],
			rows: [],
			shelfs: [],
			}
		
		//ряды
		var rowAmt = params["rowAmt" + i];
		for(var j=0; j<rowAmt; j++){
			var row = {
				height: params["rowHeight" + i + j],
				type: params["rowType" + i + j],
				}
			section.rows.push(row);
			}
		//полки
		var shelfAmt = params.shelfAmt;
		for(var j=0; j<shelfAmt; j++){
			var shelfSectId = params["shelfSectId" + j];
			if(shelfSectId == i+1){
				var shelf = {
					type: params["shelfType" + j],
					size: {
						x: params["shelfSizeX" + j],
						y: params["shelfSizeY" + j],
						z: params["shelfSizeZ" + j],
						},
					pos: {
						x: params["shelfPosX" + j],
						y: params["shelfPosY" + j],
						z: params["shelfPosZ" + j],
						},					
					};
				section.shelfs.push(shelf);
				}
			}
		sections.push(section);
		}
	
	
	var contentPar = {
		dxfBasePoint: {x: 3000, y: 0},
		sections: sections, 
		}
	var contentObj = drawContent(contentPar);
	model.add(contentObj.carcas, "boxes");
	model.add(contentObj.metiz, "metiz");
	model.add(contentObj.doors, "doors");
	model.add(contentObj.bridge, "carcas");
	model.add(contentObj.dimensions, "dimensions2");
	
	
//размеры
	
	var dimensions = drawDimensoins().mesh;
	model.add(dimensions, "dimensions2");

	
	for(var i=0; i<model.objects.length; i++){
		var obj = model.objects[i].obj;
		/*
		//позиционируем
		obj.position.x += moove.x + params.staircasePosX;
		obj.position.y += params.staircasePosY;
		obj.position.z += moove.z + params.staircasePosZ + params.M / 2 * turnFactor;
		obj.rotation.y = moove.rot;
		//смещаем все ступени для лотков
		if(params.stairType == "лотки" && model.objects[i].layer == "treads") {
			obj.position.y -= calcTreadFixHeight();
			}
		*/
		/*
		//добавляем белые ребра
		if(model.objects[i].layer != "dimensions" && model.objects[i].layer != "dimensions2") addWareframe(obj, obj);
		*/
		
		//добавляем в сцену
		addObjects(viewportId, obj, model.objects[i].layer);
		
		}

	//измерение размеров на модели
	addMeasurement(viewportId);
	
	
	

}//end of drawSideboard