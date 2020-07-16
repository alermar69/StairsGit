
$(function(){
	var sectionArr = [];
	var topRailing = [];
	var topFloor = [];
	$viewportsContainsBanister = [], $viewportsContainsTopFloor = [];
	drawBanister = function(){
	getAllInputsValues(params);
	topRailing = [];
		//перебираем все видовые экраны
		$.each($viewportsContainsBanister, function(i, viewportId){
			
			specObj = partsAmt_bal; //задаем объект, куда будут сохраняться данные для спецификации

			//удаляем секции балюстрады
			var obj;
			while(obj = $[viewportId].getObjectByName('banisterSections'))
				$[viewportId].remove(obj);
				
			if (topRailing) removeObjects(viewportId, 'topRailing');
			
			//Очищаем массив параметров деталей ограждений
			balPartsParams = {
				rackAmt: 0,
				handrailAmt: 0,
				rigelAmt: 0,
				glassAmt: 0,
				sectionAmt: 0,
				forgedBalAmt1: 0,
				forgedBalAmt2: 0,
				handrails: [],
				rigels: [],
				};
				
			var sectionTyrnAngle = 0;
			var deltaX = 0;
			var deltaZ = 0;
			var banisterSectionBasePoint = [];
			banisterSectionBasePoint[0] = {x:0,z:0};
			var dxfBasePoint = { x: 0, y: -10000,}

			//перебираем все строки таблицы параметров секций
			var banisterSectionTypes = $('#balSectTable [id^=banisterSectionType]');
			$.each(banisterSectionTypes, function(i){
				var banisterSectionType = $('#banisterSectionType' + i).val();
				var banisterSectionDirection = $('#banisterSectionDirection' + i).val();
				var banisterSectionLength = $('#banisterSectionLength' + i).val();
				var banisterSectionConnection = $('#banisterSectionConnection' + i).val();

				//рассчитываем точки вставки секций
				banisterSectionBasePoint[i+1] = {x:0,z:0};
				switch (banisterSectionDirection)
				{
					case "вперед": sectionTyrnAngle = 0; break;
					case "назад": sectionTyrnAngle = Math.PI; break;
					case "влево": sectionTyrnAngle = -Math.PI/2; break;
					case "вправо": sectionTyrnAngle = Math.PI/2; break;
				}

				deltaX = Math.cos(sectionTyrnAngle) * banisterSectionLength;
				deltaZ = Math.sin(sectionTyrnAngle) * banisterSectionLength;
				banisterSectionBasePoint[i+1].x = banisterSectionBasePoint[i].x + deltaX;
				banisterSectionBasePoint[i+1].z = banisterSectionBasePoint[i].z + deltaZ;
				
				if(banisterSectionType == "секция") dxfBasePoint.y -= 1500;
				
				//расчет направления стыковки
				var angleStart = 0;
				var angleEnd = 0;
				var sectDirPrev = $('#banisterSectionDirection' + (i - 1)).val();
				var sectDirNext = $('#banisterSectionDirection' + (i + 1)).val();
				var sectTypePrev = $('#banisterSectionType' + (i - 1)).val();
				var sectTypeNext = $('#banisterSectionType' + (i + 1)).val();
				if(banisterSectionDirection == "вперед"){
					if(sectTypePrev == "секция"){
						if(sectDirPrev == "вправо") angleStart = Math.PI / 4;
						if(sectDirPrev == "влево") angleStart = -Math.PI / 4;
						}
					if(sectTypeNext == "секция"){
						if(sectDirNext == "вправо") angleEnd = -Math.PI / 4;
						if(sectDirNext == "влево") angleEnd = Math.PI / 4;
						}
				}
				if(banisterSectionDirection == "назад"){
					if(sectTypePrev == "секция"){
						if(sectDirPrev == "вправо") angleStart = -Math.PI / 4;
						if(sectDirPrev == "влево") angleStart = Math.PI / 4;
						}
					if(sectTypeNext == "секция"){
						if(sectDirNext == "вправо") angleEnd = Math.PI / 4;
						if(sectDirNext == "влево") angleEnd = -Math.PI / 4;
						}
				}
				if(banisterSectionDirection == "вправо"){
					if(sectTypePrev == "секция"){
						if(sectDirPrev == "назад") angleStart = Math.PI / 4;
						if(sectDirPrev == "вперед") angleStart = -Math.PI / 4;
						}
					if(sectTypeNext == "секция"){
						if(sectDirNext == "назад") angleEnd = -Math.PI / 4;
						if(sectDirNext == "вперед") angleEnd = Math.PI / 4;
						}
				}
				if(banisterSectionDirection == "влево"){
					if(sectTypePrev == "секция"){
						if(sectDirPrev == "назад") angleStart = -Math.PI / 4;
						if(sectDirPrev == "вперед") angleStart = Math.PI / 4;
						}
					if(sectTypeNext == "секция"){
						if(sectDirNext == "назад") angleEnd = Math.PI / 4;
						if(sectDirNext == "вперед") angleEnd = -Math.PI / 4;
						}
				}
				if(banisterSectionDirection == "вправо"){
					
				}
				if(banisterSectionDirection == "влево"){
					
				}
				
				if(banisterSectionType == "секция") {
					var sectionParams = {
						length: banisterSectionLength,
						connection: banisterSectionConnection,
						type: banisterSectionType,
						sectId: i,
						angleStart: angleStart,
						angleEnd: angleEnd,
						dxfBasePoint: dxfBasePoint,
						flans: $('#banisterFlan' + i).val(),
					}

					var section = addBanisterSection(sectionParams);
					section.rotation.y = -sectionTyrnAngle;
					section.position.x = banisterSectionBasePoint[i].x;
					section.position.y = params.staircaseHeight + 150;
					if(params.calcType == "veranda") section.position.y = params.pltHeight + 150;
					
					section.position.z = banisterSectionBasePoint[i].z; // + params.topThreadsPosition;
					if(params.turnSide == "левое") section.position.z -= params.floorHoleWidth;
					section.objectRowClass = 'balSectRow'
					section.objectRowId = i;
					/*корректируем положение секции чтобы базовая точка была на оси секции*/
					var rackSize = 40;
					if(params.railingModel_bal == "Деревянные балясины" || params.railingModel_bal == "Стекло" || params.railingModel_bal == "Дерево с ковкой"){
						rackSize = 95;
						if(params.rackSize != undefined) rackSize = params.rackSize;				
						}
					switch (banisterSectionDirection){
						case "вперед": section.position.z = section.position.z + rackSize/2; break;
						case "назад": sectionTyrnAngle = section.position.z = section.position.z - rackSize/2; break;
						case "влево": sectionTyrnAngle = section.position.x = section.position.x + rackSize/2; break;
						case "вправо": sectionTyrnAngle = section.position.x = section.position.x - rackSize/2; break;
						}

					
						section.name = 'banisterSections';
						sectionArr.push(section);					
						topRailing.push(section);
						
						console.log(section)
					
				}

			});
			//позицонируем балюстраду
			var balPos = {
				x: params.banisterPosX,
				y: params.banisterPosY,
				z: params.banisterPosZ,
				}
			for(var i=0; i<topRailing.length; i++){
				topRailing[i].position.x += balPos.x;
				topRailing[i].position.y += balPos.y;
				topRailing[i].position.z += balPos.z;
			}

			
			
			//добавляем белые ребра
			if(menu.wireframes){
				for (var i = 0; i < topRailing.length; i++) addWareframe(topRailing[i], topRailing);
			}
			//добавляем секции в сцену
			addObjects(viewportId, topRailing, 'topRailing');
			//console.log(balPartsParams)
		});
		
	};
	addBanister = function(viewportId){
		//на каких экранах добавили, нужна для перерисовки
		$viewportsContainsBanister.push(viewportId);
		return drawBanister();
		
	};
	addBanisterSection = function (par) {
		//console.log("addBanisterSection")
		//var length = par.length;
		var connection = par.connection;
		//var type = par.type;
		//var sectId = par.sectId;
		//var dxfBasePoint = par.dxfBasePoint;
		
		/* данные по перилам (глобальные переменные) */
		//balRackBottom = $("#balRackBottom_bal").val();
		//railingModel = $("#railingModel_bal").val();
		//handrail = $("#handrail_bal").val();
		//banisterMaterial = $("#banisterMaterial_bal").val();
		//rackBottom = $("#rackBottom_bal").val();
		//rigelMaterial = $("#rigelMaterial_bal").val();
		//rigelAmt = $("#rigelAmt_bal").val();
		//glassHandrail = $("#glassHandrail_bal").val();
		//rackTypeKovka = $("#rackTypeKovka_bal").val();
		//banister1 = $("#banister1_bal").val();
		//banister2 = $("#banister2_bal").val();
		//balDist = []; //расстояние между балясинами
		//balDist[0] = $("#balDist_bal").val(); //примерное расстояние между балясинами
		//timberBalStep = $("#timberBalStep_bal").val();
		//timberBal = $("#timberBal_bal").val();
		//timberRack = $("#timberRack_bal").val();

		//параметры поручня
		var handrailPar = {
			prof: params.handrailProf_bal,
			sideSlots: params.handrailSlots_bal,
			handrailType: params.handrail_bal,
			}
		handrailPar = calcHandrailMeterParams(handrailPar); //функция в файле priceLib.js
		//задаем горизонтальный размер поручня
		var handrailWidth = handrailPar.profZ;

		//var platformLength = length;
		var offsetStart = 70; //отступ стойки от базовой точки в начале
		var offsetEnd = 70; //отступ стойки от базовой точки в конце
		var handrailOffsetStart = offsetStart; //выступ поручня за стойку в начале
		var handrailOffsetEnd = offsetEnd; //выступ поручня за стойку в конце

		//учитываем первый столб первой секции для деревянных ограждений
		if((params.railingModel_bal == "Деревянные балясины" || params.railingModel_bal == "Стекло" || params.railingModel_bal == "Дерево с ковкой") && par.sectId == 0 && params.banisterStart != "столб") {
			if(connection == "нет") connection = "начало";
			if(connection == "конец") connection = "две стороны";
			}
			
		if (connection == "начало") handrailOffsetStart = offsetStart + handrailWidth/2;
		if (connection == "конец") handrailOffsetEnd = offsetEnd - handrailWidth/2;
		if (connection == "две стороны") {
			handrailOffsetStart = offsetStart + handrailWidth/2;
			handrailOffsetEnd = offsetEnd - handrailWidth/2;
		}

		var railingSide = "right";
		var scale = 1;
		// turnFactor = 1;

		var balSectionParams = {
			platformLength: par.length,
			offsetStart: offsetStart,
			offsetEnd: offsetEnd,
			handrailOffsetStart: handrailOffsetStart,
			handrailOffsetEnd: handrailOffsetEnd,
			railingSide: railingSide,
			railingModel: params.railingModel_bal,
			handrail: params.handrail_bal,
			type: par.type,
			sectId: par.sectId,
			connection: connection,
			angleStart: par.angleStart,
			angleEnd: par.angleEnd,
			dxfBasePoint: par.dxfBasePoint,
			flans: par.flans,
			}
		return drawBalSection(balSectionParams); 

	};

});



