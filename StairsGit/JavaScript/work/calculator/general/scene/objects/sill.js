class Sill extends AdditionalObject {
	constructor(par) {
		super(par);

		var sillPar = Object.assign({modifyKey: 'sill:' + this.objId}, this.par);
		sillPar.dxfBasePoint = {x:lastDxfX, y:0}

		var wWidth = this.par.len - this.par.rightNose - this.par.leftNose;
		lastDxfX += (wWidth + this.par.windowOffsetLeft + this.par.windowOffsetRight) + 500;
		this.par.material = 'массив';
		sillPar.material = this.getObjectMaterial();
		sillPar.objId = this.objId;
		var mesh = Sill.draw(sillPar).mesh;
		this.add(mesh);
	}

	static draw(par){
		if(!par) par = {};
		initPar(par);
		
		//исправляем битые параметры
		var meta = this.getMeta();
		meta.inputs.forEach(function(item){
			if(item.key && par[item.key] == "undefined") {
				par[item.key] = item['default']
			}
		})
		
		var envPar = {};
		$.extend(true, envPar, par)
		envPar.material = par.material;

		var drawFunc = drawSillEnv;
		if(par.geom == "эркер") drawFunc = drawOriel;
		if(par.geom == "эркер" && par.orielType == '04') drawFunc = drawRadOriel;
		if(par.geom == "эркер" && par.orielType == '05') drawFunc = drawStepOriel;
		
		if(par.geom != "нет"){
			console.log(envPar.windowSlope)
			var env = drawFunc(envPar).mesh;		
			par.mesh.add(env);
		}
		
		//подоконник
		if(par.geom != "эркер") {
			
			var sillPar = {};
			$.extend(true, sillPar, par);
			var sill = drawSill(sillPar).mesh;
			
			sill.position.y = par.height + 10
			sill.position.z = par.wallThk + par.frontNose
			sill.userData.setObjectDimensions = true;
			par.mesh.add(sill);
		}

    if (par.screenType != 'нет') {
      console.log(sillPar);
      var screenPar = {
        mesh: par.mesh,
        height: sillPar.height + 10,
        width: sillPar.windowWidth + sillPar.rightNose + sillPar.leftNose,
        depth: sillPar.frontNose,
        fillingType: sillPar.screenType,
        screenType: sillPar.screenType,
        plinthType: sillPar.plinthType,
		screenPoleSize: sillPar.screenPoleSize,
		screenSidePoleSize: sillPar.screenSidePoleSize,
		screenPoleStep: sillPar.screenPoleStep,
      };
      var mesh = drawScreen(screenPar)
      mesh.position.x = -screenPar.width / 2;
      mesh.position.z = sillPar.wallThk + sillPar.frontNose;
      par.mesh.add(mesh);
    }
		return par;
	}
	
	/** STATIC **/
	static calcPrice(par){
		var meshPar = Object.assign({}, par.meshParams);
		
		//корректируем размеры для эркеров
		var dopSpec = partsAmt_dop[par.id];
		//перебираем возможные названия объекта
		var partNames = ["sill", "sill_arc", "sill_cnc", "slab"];
		$.each(partNames, function(){
			if (dopSpec[this] && dopSpec[this].size) {
				var size = dopSpec[this].size[Object.keys(dopSpec[this].size)[0]];
				meshPar.len = Math.round(size.len);
				meshPar.width = Math.round(size.width);
				meshPar.parts = size.parts
			}
		})

		
		
		
		var cost = 0;
		//эркер тип 5
		if(par.meshParams.geom == "эркер" && par.meshParams.orielType == "05"){
			var itemsCost = []
			$.each(par.meshParams.oriel_parts, function(){
				var meshPar_i = Object.assign({}, par.meshParams);
				meshPar_i.len = this.oriel_len
				var cost_i = calcTimberPanelCost(meshPar_i);
				itemsCost.push(cost_i)
				cost += cost_i 
			})			
		}		
		else{
			//составной подоконник
			if(meshPar.parts && meshPar.parts.length > 1){
				$.each(meshPar.parts, function(){
					var meshPar_i = Object.assign({}, par.meshParams);
					meshPar_i.len = this * 1.0
					var cost_i = calcTimberPanelCost(meshPar_i);
					cost += cost_i 
				});
				//стыковка - работа + материал
				cost += 500;
			}
			else cost = calcTimberPanelCost(meshPar);
		}
		
		//добавляем стоимость экрана
		if(par.meshParams.screenType != 'нет') cost +=  calcScreenCost(par);
		
		//вентиляционные отверстия
		if(par.meshParams.ventHoles != "нет") cost += 1000;

		// Откосы, наличники
		if (meshPar.windowSlope == 'есть') {
			var slopeArea = getDopPartPropVal('windowSlope', "area")
			var slopeVolume = getDopPartPropVal('windowSlope', "volume")
			var slopePaintArea = getDopPartPropVal('windowSlope', "paintedArea")
			
			
			var timberPar = calcTimberParams(params.additionalObjectsTimberMaterial);
			var paintPriceM2 = calcTimberPaintPrice(params.timberPaint, params.additionalObjectsTimberMaterial)
			cost +=  slopeVolume * timberPar.m3Price + slopePaintArea * paintPriceM2;
		}
		
		//записываем длину и ширину, которые будут выводиться на страницу
		par.meshParams.len_printable = meshPar.len;
		par.meshParams.width_printable = meshPar.width
		
		return {
			name: this.getDescr(par).title,
			cost: cost,
			priceFactor: par.meshParams.priceFactor,
			costFactor: par.meshParams.costFactor
		}
	}

	static formChange(form, data){
		var par = data.meshParams
		console.log(par.width)
		// console.log(data);
		// form.find('input').hide();
		form.find(".orielRow").hide()
		form.find(".doorPar").hide()
		form.find(".wallPar").show()
		form.find('.holePar').hide();
		form.find('[data-propid="len"]').closest('tr').show();
		form.find('[data-propid="width"]').closest('tr').show();
		form.find('.oriel_5_parts').closest('tr').hide();
	
//параметры эркера
		if(form.find('[data-propid="geom"]').val() == "эркер") {
			form.find(".orielRow").show()
			form.find(".wallPar").hide()
			form.find('[data-propid="len"]').closest('tr').hide();
			if(form.find('[data-propid="sillGeom"]').val() == "столешница") form.find('[data-propid="width"]').closest('tr').hide();
			var imgName =  "/drawings/sill/oriel/" + form.find('[data-propid="orielType"]').val() + ".png"
			$(form.find(".orielRow td")[0]).html("<td><img style='max-width: 100%;' src='"+imgName+"'></td>");
			
			
			var orielType = form.find('[data-propid="orielType"]').val();

			if (orielType == '05') {
				form.find('.oriel_5_parts').closest('tr').show();
				if (par.oriel_parts && par.oriel_parts[0]) {
					$(form.find('.oriel_5_parts').find('[data-propid="oriel_angle"]')[0]).val(0);
					par.oriel_parts[0].oriel_angle = 0;
				}
			}

			form.find('[data-propid="orielSizeB"]').closest('div').hide();
			if (orielType == '01' || orielType == '02') {
				form.find('[data-propid="orielSizeB"]').closest('div').show();
			}
			
			form.find('[data-propid="radSillType"]').closest('tr').hide();
			form.find('[data-propid="orielWindowCount"]').closest('div').hide();
			if (orielType == '04') {
				form.find('[data-propid="radSillType"]').closest('tr').show();
				form.find('[data-propid="orielWindowCount"]').closest('div').show();				
			}

			if (orielType == '05') {
				form.find('[data-propid="orielSizeA"]').closest('div').hide();
				form.find('[data-propid="orielSizeC"]').closest('div').hide();
			}else{
				form.find('[data-propid="orielSizeA"]').closest('div').show();
				form.find('[data-propid="orielSizeC"]').closest('div').show();
			}
			
			
			//геометрия не может быть прямоугольной
			if(form.find('[data-propid="shapeType"]').val() == "прямоугольник") {
				alertTrouble("Подоконник в эркер не может быть прямоугольным! Установлена геометрия по шаблону")
				form.find('[data-propid="shapeType"]').val("по шаблону (криволин.)")
			}
		}
		//параметры вент. отверстий
		if(form.find('[data-propid="ventHoles"]').val() != "нет") {
			form.find('.holePar').show();
		}
		//параметры балконной двери
		if(form.find('[data-propid="geom"]').val() == "балконное окно" || form.find('[data-propid="geom"]').val() == "подоконный блок") {
			form.find(".doorPar").show()
		}
		
	
		//параметры обстановки по подоконнику

		if (par.envPar == 'авто') {
			form.find('[data-propid="frontNose"]').closest('tr').hide()
			form.find(".envPar").hide()
			
			if(form.find('[data-propid="geom"]').val() != "эркер") {
				//ширина окна
				var windowWidth = par.len - par.rightNose - par.leftNose
				form.find('[data-propid="windowWidth"]').val(windowWidth)
			}
			
			//свес подоконника спереди
			var frontNose = par.width - par.windowPosZ;
			if(par.geom == "подоконный блок") frontNose = (par.width - par.wallThk) / 2
			
			
			if(form.find('[data-propid="geom"]').val() == "эркер" && form.find('[data-propid="sillGeom"]').val() == "столешница"){
				form.find('[data-propid="frontNose"]').closest('tr').show()
			}
			else{
				form.find('[data-propid="frontNose"]').val(frontNose)
			}
			
		}		
		else{

			form.find('[data-propid="frontNose"]').closest('tr').show()
			form.find(".envPar").show()
			
			//длина подоконника
			var len = par.windowWidth + par.rightNose + par.leftNose
			
			form.find('[data-propid="len"]').val(len)
			
			//ширина подоконника
			var width = par.windowPosZ + par.frontNose;			
			if(par.geom == "подоконный блок") width = par.wallThk + par.frontNose * 2
			form.find('[data-propid="width"]').val(width)
		}

		if (par.len > 3000) {
			form.find('[data-propid="splitOffset"]').closest('tr').show();
		}else{
			form.find('[data-propid="splitOffset"]').closest('tr').hide();
		}

		//доклейка снизу
		form.find(".botPole").hide()
		if(par.botPoleType != "нет") form.find(".botPole").show()
		
		//прааметры слэба
		form.find(".slab").hide()
		if(par.tabletopType && par.tabletopType.indexOf("слэб") != -1) form.find(".slab").show()

		if (par.cornerRadRight > 0 && par.cornerRadRight <= 25) {
			if (par.cornerRadRight != 3 && par.cornerRadRight != 6 && par.cornerRadRight != 12 && par.cornerRadRight != 25) {
				alert('Радиус скругления справа может быть только 3,6,12,25 или больше');
			}
		}

		if (par.tabletopType.indexOf('слэб') == -1 && par.slabModel) {
			alert('Указана модель слэба, материал должен содержать слэб');
		}

		if (par.cornerRadRight > 0 && par.cornerRadLeft <= 25) {
			if (par.cornerRadLeft != 3 && par.cornerRadLeft != 6 && par.cornerRadLeft != 12 && par.cornerRadLeft != 25) {
				alert('Радиус скругления слева может быть только 3,6,12,25 или больше');
			}
		}
		
		//параметры экранов
		form.find(".screenPar").hide()
		if(par.screenType != "нет"){
			form.find(".screenPar").show();			
			if (par.screenType == '03') form.find('[data-propid="plinthType"]').closest('tr').hide();
		}
		
		getObjPar()
	}

	static getMeta() {
		return {
			title: 'Подоконник',
			inputs: [
				{
					"type": "delimeter",
					"title": "Обстановка"
				},
				{
					"key": "geom",
					"title": "Место установки:",
					"values": [
						{
							"value": "стена",
							"title": "стена"
						},
						{
							"value": "балконное окно",
							"title": "балконное окно"
						},
						{
							"value": "подоконный блок",
							"title": "подоконный блок"
						},
						{
							"value": "эркер",
							"title": "эркер"
						},
						{
							"value": "нет",
							"title": "нет"
						}
					],
					"default": "стена",
					"type": "select"
				},
				{
					"key": "envPar",
					"title": "Размеры:",
					"values": [
						{
							"value": "авто",
							"title": "авто"
						},
						{
							"value": "задаются",
							"title": "задаются"
						},
					],
					"default": "авто",
					"type": "select"
				},
				{
					"type": "row_start",
					"class": 'orielRow'
				},
				{
					"key": "orielType",
					"title": "Тип эркера",
					"not_row": true,
					"values": [
					{
						"value": "01",
						"title": "Тип 1"
					},
					{
						"value": "02",
						"title": "Тип 2"
					},
					{
						"value": "03",
						"title": "Тип 3"
					},
					{
						"value": "04",
						"title": "Тип 4"
					},
					{
						"value": "05",
						"title": "Тип 5"
					}
					],
					"default": "01",
					"type": "select"
				},
				{
					"key": "orielSizeA",
					"title": "Размер А",
					"default": 2000,
					"not_row": true,
					"type": "number"
				},
				{
					"key": "orielSizeB",
					"title": "Размер B",
					"default": 1000,
					"not_row": true,
					"type": "number"
				},
				{
					"key": "orielSizeC",
					"title": "Размер С",
					"default": 1000,
					"not_row": true,
					"type": "number"
				},
				{
					"key": "orielWindowCount",
					"title": "Кол-во окон",
					"default": 3,
					"not_row": true,
					"type": "number"
				},
				{
					"type": "row_end"
				},

				{
					"type": "dynamic_input",
					"key": "oriel_parts",
					"class": "oriel_5_parts",
					"title": "Параметры эркера",
					"template": [
						{
							"key": "oriel_len",
							"title": "Длина:",
							"default": 1000,
							"type": "number",
						},
						{
							"key": "oriel_angle",
							"title": "Угол:",
							"default": 0,
							"type": "number",
						},
					]
				},
				{
					"key": "geomSide",
					"class": "wallPar envPar",
					"title": "Сторона:",
					"values": [
					{
						"value": "правая",
						"title": "правая"
					},
					{
						"value": "левая",
						"title": "левая"
					}
					],
					"default": "правая",
					"type": "select",
				},
				{
					"key": "sideWall",
					"class": "wallPar envPar",
					"title": "Угловая стена:",
					"values": [
					{
						"value": "нет",
						"title": "нет"
					},
					{
						"value": "справа",
						"title": "справа"
					},
					{
						"value": "слева",
						"title": "слева"
					},
					{
						"value": "две",
						"title": "две стороны"
					}
					],
					"default": "нет",
					"type": "select",
				},
				{
					"key": "windowWidth",
					"class": "wallPar envPar",
					"title": "Ширина окна:",
					"default": 1000,
					"type": "number",
				},
				  {
					"key": "windowHeight",
					"class": "wallPar envPar",
					"title": "Высота окна:",
					"default": 1600,
					"type": "number"
				  },
				  {
					"key": "wallSideBevel",
					"class": 'envPar',
					"title": "Скос откоса:",
					"default": 30,
					"type": "number",
				  },
				  {
					"key": "ceilHeight",
					"class": 'envPar',
					"title": "Высота потолка:",
					"default": 2800,
					"type": "number",
				  },
				  {
					"key": "wallThk",
					"class": 'envPar',
					"title": "Толщина стены:",
					"default": 400,
					"type": "number",
				  },
				  {
					"key": "windowPosZ",
					"class": "wallPar envPar",
					"title": "Позиция окна по глубине:",
					"default": 200,
					"type": "number",
				  },
				  {
					"key": "windowOffsetRight",
					"class": "wallPar envPar",
					"title": "Отступ окна справа:",
					"default": 500,
					"type": "number",
				  },
				  {
					"key": "windowOffsetLeft",
					"class": "wallPar envPar",
					"title": "Отступ окна слева:",
					"default": 500,
					"type": "number",
				  },
				  {
					"key": "windowSectAmt",
					"class": "wallPar envPar",
					"title": "Кол-во створок окна:",
					"default": 1,
					"type": "number",
				  },
				  {
					"key": "doorWidth",
					"class": "doorPar envPar",
					"title": "Ширина двери:",
					"default": 1000,
					"type": "number",
				  },
				  {
					"key": "height",
					"class": "envPar",
					"title": "Высота от пола:",
					"default": 800,
					"type": "number"
				  },
				{
					"type": "delimeter",
					"title": "Подоконник"
				},
				{
					"key": "sillGeom",
					"title": "Тип:",
					"values": [
						{
							"value": "подоконник",
							"title": "подоконник"
						},
						{
							"value": "столешница",
							"title": "столешница"
						},
					],
					"default": "подоконник",
					"type": "select"
				},
				{
					"key": "len",
					"title": "Длина:",
					"default": 800,
					"type": "number"
				},
				{
					"key": "len_printable",
					"title": "Длина:",
					"type": "number",
					"printable": "true",
					"input_hidden": "true"
				},
				{
					"key": "splitOffset",
					"title": "Отступ стыка:",
					"default": 2000,
					"type": "number",
				},
				{
					"key": "width",
					"title": "Ширина:",
					"default": 300,
					"type": "number"
				},
				{
					"key": "width_printable",
					"title": "Ширина:",
					"type": "number",
					"printable": "true",
					"input_hidden": "true"
				},
				{
				  "key": "thk",
				  "title": "Толщина:",
				  "default": 40,
				  "type": "number",
					"printable": "true",
				},
				
				{
					"key": "radSillType",
					"title": "Передняя кромка:",
					"values": [
						{
							"value": "ломаная",
							"title": "ломаная"
						},
						{
							"value": "дуга",
							"title": "дуга"
						},
					],
					"default": "дуга",
					"type": "select",
					"class": 'orielRow',
				},
				{
					"key": "cutWallHole",
					"title": "Есть вырез под стены:",
					"values": [
						{
							"value": "нет",
							"title": "нет"
						},
						{
							"value": "да",
							"title": "да"
						},
					],
					"default": "нет",
					"type": "select"
				},
				
				{
				  "key": "frontNose",
				  "title": "Свес спереди:",
				  "default": 100,
				  "type": "number"
				},
				{
				  "key": "rightNose",
				  "title": "Свес справа:",
				  "default": 50,
				  "type": "number"
				},
				{
				  "key": "leftNose",
				  "title": "Свес слева:",
				  "default": 50,
				  "type": "number"
				},

				{
				  "key": "cornerRadRight",
				  "title": "Радиус справа:",
				  "default": 3,
				  "type": "number"
				},
				{
				  "key": "cornerRadLeft",
				  "title": "Радиус слева:",
				  "default": 3,
				  "type": "number"
				},
				{
					"type": "delimeter",
					"title": "Отверстия"
				},
				
				{
					"key": "ventHoles",
					"title": "Отверстия: ",
					"values": [
						{
							"value": "нет",
							"title": "нет"
						},
						{
							"value": "круглые",
							"title": "круглые"
						},
						{
							"value": "овальные вдоль",
							"title": "овальные вдоль"
						},
						{
							"value": "овальные поперек",
							"title": "овальные поперек"
						},
					],
					"default": "нет",
					"type": "select",
					"printable": "true",
				},
				{
					"key": "ventHolesSize",
					"title": "Ширина:",
					"default": 20,
					"class": "holePar",
					"type": "number"
				},
				{
					"key": "ventHolesLen",
					"title": "Длина:",
					"default": 50,
					"class": "holePar",
					"type": "number"
				},
				{
					"key": "ventHolesStep",
					"title": "Макс. шаг:",
					"default": 100,
					"class": "holePar",
					"type": "number"
				},
				{
					"key": "ventHolesFrontOffset",
					"title": "Отступ спереди:",
					"default": 100,
					"class": "holePar",
					"type": "number"
				},
				{
					"key": "ventHolesSideOffset",
					"title": "Отступ слева:",
					"default": 100,
					"class": "holePar",
					"type": "number"
				},
				
				{
					"key": "ventHolesOffsetRight",
					"title": "Отступ справа:",
					"default": 100,
					"class": "holePar",
					"type": "number"
				},
				
				{
					"type": "delimeter",
					"title": "Дополнительно"
				},
				
				{
					"key": "screenType",
					"title": "Экран:",
					"values": [
						{
							"value": "нет",
							"title": "нет"
						},
						{
							"value": "01",
							"title": "Тип 1"
						},
						{
							"value": "02",
							"title": "Тип 2"
						},
						{
							"value": "03",
							"title": "Тип 3"
						}
					],
					"default": "нет",
					"type": "select",
				},
					{
					  "key": "plinthType",
					  "title": "Цоколь",
					  "values": [
						{
						  "value": "нет",
						  "title": "Нет"
						},
						{
						  "value": "01",
						  "title": "Тип 1"
						},
						{
						  "value": "02",
						  "title": "Тип 2"
						}
					  ],
					  "default": "нет",
					  "type": "select",
					  "class": 'screenPar',
					},
					
					{
						"key": "screenPoleSize",
						"title": "Ширина бруска:",
						"default": 40,
						"type": "number",
						"printable": "true",
						"class": 'screenPar screenPolePar',
					},
					
					{
						"key": "screenSidePoleSize",
						"title": "Ширина крайнего бруска:",
						"default": 100,
						"type": "number",
						"printable": "true",
						"class": 'screenPar screenPolePar',
					},
					
					
					{
						"key": "screenPoleStep",
						"title": "Шаг брусков:",
						"default": 80,
						"type": "number",
						"printable": "true",
						"class": 'screenPar screenPolePar',
					},
				
					{
					"key": "windowSlope",
					"title": "Откосы:",
					"values": [
						{
							"value": "нет",
							"title": "нет"
						},
						{
							"value": "есть",
							"title": "есть"
						},
					],
					"default": "нет",
					"type": "select"
				},
				
				{
					"type": "delimeter",
					"title": "Производство"
				},
				
				{
					"key": "shapeType",
					"title": "Геометрия:",
					"values": [
						{
							"value": "прямоугольник",
							"title": "прямоугольник"
						},
						{
							"value": "по чертежу",
							"title": "по чертежу"
						},
						{
							"value": "по шаблону",
							"title": "по шаблону"
						},
						{
							"value": "по шаблону (криволин.)",
							"title": "по шаблону (криволин.)"
						},
					],
					"default": "прямоугольник",
					"type": "select",
					"printable": "true",
				},
				
				{
					"key": "tabletopType",
					"title": "Материал:",
					"default": "щит",
					"type": "select",
					"values": [
						{
							"value": "щит",
							"title": "щит"
						},
						{
							"value": "шпон",
							"title": "шпон"
						},
						{
							"value": "слэб",
							"title": "слэб"
						},
						{
							"value": "слэб + стекло",
							"title": "слэб + стекло"
						},
						{
							"value": "слэб + смола непрозр.",
							"title": "слэб + смола непрозр."
						},
						{
							"value": "слэб + смола прозр.",
							"title": "слэб + смола прозр."
						},
						{
							"value": "нет",
							"title": "нет"
						},
					],
					"printable": "true",
				},
				
				{
					"key": "edgeGeomTop",
					"title": "Фаска сверху:",
					"values": [
						{
							"value": "не указано",
							"title": "не указано"
						},
						{
							"value": "1 ребро",
							"title": "1 ребро"
						},
						{
							"value": "3 ребра",
							"title": "3 ребра"
						},
						{
							"value": "все ребра",
							"title": "все ребра"
						},
						{
							"value": "по чертежу",
							"title": "по чертежу"
						},
						{
							"value": "по шаблону",
							"title": "по шаблону"
						},
					],
					"default": "не указано",
					"type": "select",
					"printable": "true",
				},
				
				{
					"key": "edgeModel",
					"title": "Тип фаски:",
					"values": [
						{
							"value": "не указано",
							"title": "не указано"
						},
						{
							"value": "скругление R3",
							"title": "скругление R3"
						},
						
						{
							"value": "скругление R6",
							"title": "скругление R6"
						},
						{
							"value": "скругление R12",
							"title": "скругление R12"
						},
						{
							"value": "скругление R25",
							"title": "скругление R25"
						},
						{
							"value": "фигурная Ф-1",
							"title": "фигурная Ф-1"
						},
						{
							"value": "фигурная Ф-2",
							"title": "фигурная Ф-2"
						},
						{
							"value": "фигурная Ф-3",
							"title": "фигурная Ф-3"
						},
						{
							"value": "фигурная Ф-4",
							"title": "фигурная Ф-4"
						},
						{
							"value": "фигурная Ф-5",
							"title": "фигурная Ф-5"
						},
						{
							"value": "фигурная Ф-6",
							"title": "фигурная Ф-6"
						},
						{
							"value": "фигурная Ф-7",
							"title": "фигурная Ф-7"
						},
						{
							"value": "фигурная Ф-8",
							"title": "фигурная Ф-8"
						},
						{
							"value": "фаска 6х45гр",
							"title": "фаска 6х45гр"
						},
						{
							"value": "фаска 12х45гр",
							"title": "фаска 12х45гр"
						},

					],
					"default": "не указано",
					"type": "select",
					"printable": "true",
				},
				
				{
					"key": "botPoleType",
					"title": "Доклейка по толщине:",
					"values": [
						{
							"value": "нет",
							"title": "нет"
						},
						{
							"value": "спереди",
							"title": "спереди"
						},
						{
							"value": "3 ребра",
							"title": "3 ребра"
						},
						{
							"value": "по чертежу",
							"title": "по чертежу"
						},
						
					],
					"default": "нет",
					"type": "select",
					"printable": "true",
				},
				
				{
					"key": "botPoleThk",
					"title": "Толщина доклейки:",
					"default": 20,
					"class": "botPole",
					"type": "number",
				},
				
				{
					"key": "botPoleWidth",
					"title": "Ширина доклейки:",
					"default": 100,
					"class": "botPole",
					"type": "number"
				},
				
				{
					"key": "riverWidth",
					"type": "number",
					"title": "Ширина реки, мм",
					"default": 150,
					"class": "slab",
					"printable": "true",
				},
				{
					"key": "resinVol",
					"type": "number",
					"title": "Объем заливки, л",
					"default": 1,
					"class": "slab",
					"printable": "true",
				},
				
				{
					"type": "delimeter",
					"title": "Цена"
				},
				
				{
					"key": "breaking",
					"title": "Демонтаж:",
					"values": [
						{
							"value": "нет",
							"title": "нет"
						},
						{
							"value": "есть",
							"title": "есть"
						},
						
					],
					"default": "нет",
					"type": "select",
					"printable": "true",
				},
				
				{
					"key": "slabPrice",
					"title": "Цена слэба",
					"class": "slab",
					"type": "number"
					
				},
				{
					"key": "slabModel",
					"title": "Номер слэба(garmonyc-mebel)",
					"type": "text",
					"class": "slab",
					"printable": "true",
				},
				{
					"key": "getSlabData",
					"title": "Загрузить данные слэба",
					"class": "slab",
					"type": "action"
				},
				...AdditionalObject.defaultInputs()
			]
		}
	}
}