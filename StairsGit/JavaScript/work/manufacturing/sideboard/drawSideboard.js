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
	model.add(contentObj.carcas, "shelfs");
	model.add(contentObj.metiz, "metis");
	model.add(contentObj.doors, "doors");
	model.add(contentObj.bridge, "carcas");
	model.add(contentObj.dimensions, "dimensions2");
	
	
//размеры
	
	var dimensions = drawDimensoins().mesh;
	model.add(dimensions, "dimensions2");


	for(var i=0; i<model.objects.length; i++){		
		var obj = model.objects[i].obj;
		obj.layerName = model.objects[i].layer;
		
		//добавляем в сцену
		addObjects(viewportId, obj, model.objects[i].layer);
	}

	//измерение размеров на модели
	addMeasurement(viewportId);

	if (typeof staircaseLoaded !== undefined) staircaseLoaded();
	
	
	

}//end of drawSideboard