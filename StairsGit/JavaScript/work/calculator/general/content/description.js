

/** функция возвращает описание блока лестницы - каркаса, ступеней, ограждений
**/


function getUnitDescr(){
	
	var blockNames = ['carcas', 'treads', 'railing']
	
	var blocks = {
		carcas: {
			title: "Каркас",
			subtitle: "",
			main: "",
			facts: getFacts('description', 'carcas').map(function(item){return item.name}),
			img: "/images/calculator/description/carcas.jpg",
		},
		treads: {
			title: "Ступени",
			subtitle: "",
			main: "",
			facts: getFacts('description', 'treads').map(function(item){return item.name}),
			img: "/images/calculator/description/treads.jpg",
		},
		railing: {
			title: "Ограждения",
			subtitle: "",
			main: "",
			facts: getFacts('description', 'railing').map(function(item){return item.name}),
			img: "/images/calculator/description/railing.jpg",
		},
	}
	
	if(params.calcType == "railing" || params.calcType == "objects") blocks.carcas = {};
	if(params.calcType == "objects") blocks.treads = {};
	
	//главное описание
	
	factBlocks.forEach(function(fact){
		if (fact.type == "описание" && 
			fact.group == "description" &&
			blockNames.indexOf(fact.block) != -1 && 
			(!fact.only_for || fact.only_for.indexOf(params.calcType) != -1) && 
			(!fact.conditions || eval(fact.conditions))){
				blocks[fact.block].title = fact.title
				blocks[fact.block].main = fact.description
				blocks[fact.block].subtitle = fact.subtitle
				blocks[fact.block].img = fact.image
		}
	});

	return blocks;
}

/** функция возвращает описание каркаса навеса для авто
*/

function getCarportCarcasDescr(){
	
	var text = {
		title: "Каркас",
		main: "",
		facts: [],
		img: "",
	};
	
	//главное описание
	
	text['main'] = "Каркас представляет собой усилинные фермы из толстого листа металла с оригинальным дизайном";
	
	text['facts'] = getFacts('description', 'carcas').map(function(item){return item.name});
	return text;
}

/** функция возвращает описание кровли навеса для авто
*/

function getCarportRoofDescr(){
	
	var text = {
		title: "Кровля",
		main: "",
		facts: [],
		img: "",
	};
	
	//главное описание
	
	text['main'] = "Кровля представляет собой лист поликорбаната...";
	
	text['facts'] = getFacts('description', 'roof').map(function(item){return item.name});
	return text;
}

/** функция выводит описание лестницы на страницу
*/

function printDescr() {
	$("#description").html("");
	$("#unitsDescr").html("");

	if(params.calcType != 'fire_2') $('#description').append(printAdditionalDescription());
	
	if (params.calcType != 'objects') {
		var text = "";
		/*
		if(params.calcType != 'carport') text += $('#zamerBlocks').html();
		if(params.calcType == 'carport') text += $('#zamerBlocksCarport').html();
		*/
		var blocks = [];
		
		if (params.calcType != 'fire_2') {
			var units = staircaseHasUnit();
			var unitDescr = getUnitDescr();
				console.log(unitDescr)
			//каркас
			if(units.carcas) blocks.push({type: 'carcas', content: unitDescr.carcas, images: getPreviewImages('carcas')});
			
			//ступени
			if(units.treads) {
				if(units.carcas) blocks.push({type: 'treads', content: unitDescr.treads, images: getPreviewImages('treads')});
				/*
				var images = getPreviewImages('treads');
				//картинка по умолчанию
				if(images.length == 0){
					images = [{url: getTreadDescr().img}]
				}
				blocks.push({type: 'treads', content: getTreadDescr(), images: images});
				*/
			}
			
			//ограждения
			if(units.railing || units.banister || units.sideHandrails) blocks.push({type: 'railing', content: unitDescr.railing, images: getPreviewImages('railing')});
			
			if (units.carportCarcas) blocks.push({type: 'carport_carcas', content: getCarportCarcasDescr(), images: getPreviewImages('carport_carcas')});
			if (units.carportRoof) blocks.push({type: 'carport_roof', content: getCarportRoofDescr(), images: getPreviewImages('carport_roof')});
		
			if ($("#descriptionTempalte").length > 0) {
				var template = $.templates("#descriptionTempalte");
				var html = template.render(blocks);
				text += html;
				$("#unitsDescr").append(text);
			}
		}
		else{
			$("#unitsDescr").append(text);
		}
	}

	//Применяем formChange для форм доп объектов
	if (window.additional_objects && window.additional_objects.length > 0) {
		window.additional_objects.forEach(function(item){
			if (item.calc_price) {
				$form = $('#object_description_' + item.id)
				var classItem = eval(item.className);
				if (classItem && classItem.formChange) {
					classItem.formChange($form, item)
				}
			}
		});
	}

	if ($('#previewImages').length > 0) {
		var images = getPreviewImages('preview');
		var template = $.templates("#previewsTemplate");
		var html = template.render({images: images});
		$('#previewImages').html(html);
	}

	//описание для производственного модуля
	if(typeof getExportData_com == 'function' && document.location.href.indexOf("manufacturing") != -1){
		
		var exportObj = getExportData_com();
		
		var prodDescr = "<p>" + exportObj.product_descr + "</p>"
		
		//Объем по цехам
		if(exportObj.dept_data){
			prodDescr += "<h4>Объем по цехам:</h4>"

			prodDescr += "<table class='tab_4'><thead><tr>" + 
				"<th>Цех</th>" +
				"<th>н-л</th>" +
				"<tr></thead><tbody>";
			$.each(exportObj.dept_data, function(dept){
				prodDescr += "<tr>"
				if(typeof getDeptProps == "function") prodDescr += "<td>" + getDeptProps(dept).name + "</td>";
				else prodDescr += "<td>" + dept + "</td>";
				prodDescr += "<td>" + Math.round(this * getNlFactor() / 10) / 100 + "</td>" +
					"</tr>"
			})
			prodDescr += "</tbody></table>"
			
		}
			
		$("#descr").html(prodDescr);
	}
}

/**
 * Формирует описания используемые технологии
 */
function getTemplatingDescription(){
	if (
		window.additional_objects && window.additional_objects.length > 0 &&
		window.additional_objects.find(function(item){return item.calc_price && item.meshParams.shapeType == "по шаблону"})
	) {
		return {
			images: [
				{url: '/images/calculator/new_kp/technology_1.png'},
				{url: '/images/calculator/new_kp/technology_2.png'},
			],
			title: 'Используемая технология - шаблонирование',
			description: "Для того чтобы подоконник идеально вписался в проем, мы сперва изготавливаем шаблоны из\
			фанеры по вашим размерам. После чего следует предварительная примерка и при\
			необходимости, корректировка шаблонов. После того, как шаблоны идеально подходят по\
			размерам, по ним изготавливается сам подоконник.\
			В результате подоконник нужно будет подпиливать по месту и он встанет, как влитой."
		}
	}
}
/**
 * Формирует описание 'особенности конструкции'
 */
function getConstructionAdditional() {
	function getObjectsEdges(){
		var edges = [];
		window.additional_objects.forEach(function(item){
			if (item.meshParams.edgeModel) {
				if (edges.indexOf(item.meshParams.edgeModel) == -1) edges.push(item.meshParams.edgeModel);
			}
		})
		return edges;
	}

	var path = "/drawings/tables/edges/";

	var availableEdgeTypes = {
		"скругление R3": "r-3",
		"скругление R6": "r-6",
		"скругление R12": "r-12",
		"скругление R25": "r-25",
		"фигурная Ф-1": "f-1",
		"фигурная Ф-2": "f-2",
		"фигурная Ф-3": "f-3",
		"фигурная Ф-4": "f-4",
		"фигурная Ф-5": "f-5",
		"фигурная Ф-6": "f-6",
		"фигурная Ф-7": "f-7",
		"фигурная Ф-8": "f-8",
		"фаска 6х45гр": "b-6x45",
		"фаска 12х45гр": "b-12x45",
	}

	var images = [];
	getObjectsEdges().forEach(function(edgeType){
		if (Object.keys(availableEdgeTypes).indexOf(edgeType) != -1 && availableEdgeTypes[edgeType]) {
			images.push({
				text: '<h4>Фаска ' + edgeType + '</h4>',
				url: path + availableEdgeTypes[edgeType] + ".jpg"
			})
		}
	})
	return {title: 'Особенности конструкции', description: "", images: images}
}

/**
 * Получает картинки доставки
 */
function getAssemblingDescription() {
	var images = [
		{
			url: '/images/calculator/new_kp/assembling_1.jpg',
			text: 'Доставка и монтаж готового изделия осуществляется в удобный для вас день и время.'
		},
		{
			url: '/images/calculator/new_kp/assembling_2.jpg',
			text: 'Перед отправкой изделия мы надежно упаковываем его в плотную пленку для безопасной транспортировки.'
		},
		{
			url: '/images/calculator/new_kp/assembling_3.jpeg',
			condition: 'if(window.additional_objects && window.additional_objects.length > 0) window.additional_objects.find(function(item){return item.calc_price && item.className == "Sill"});',
			text: 'Монтаж подоконника занимает не более 2х часов. После окончания работ, монтажники уберут за собой весь мусор.'
		}
	]
	var par = getInputsFromForm($('#assemblingWrap table')[0]);
	return {
		title: "Как будет происходить доставка и монтаж",
		description: "",
		images: getGoodItems(images),
		par: par
	}
}

/**
 * Формирование нового кп
 */
function printAdditionalDescription(){
	var paramsBlockTemplate = $.templates("#paramsBlockTemplate");

	var html = "<div class='newKP' style=''>";

	var additionalObjectsText = ""
	if (window.additional_objects && window.additional_objects.length > 0) {
		window.additional_objects.forEach(function(obj){
			if (obj.calc_price) {
				if (eval(obj.className)) {
					var blockType = "object_" + obj.id;
					html += $.templates("#objectDescriptionTempalte").render({
						noDefault: true, 
						type: blockType, 
						images: getPreviewImages(blockType), 
						comment: obj.meshParams.objectComment,
						title: (obj.name || eval(obj.className).getMeta().title + " №" +  + obj.id),
						description: eval(obj.className).getDescr(obj).html
					});
				}
			}
		})
	}

	html += additionalObjectsText;

	// Материалы
	html += Materials.getSceneDescription().html;

	// Отделка дерева
	if (getTimberPaintDescription().images.length > 0) {
		html += paramsBlockTemplate.render(getTimberPaintDescription());
	}

	// Покраска металла
	if (getMetalPaintDescription().images.length > 0) html += paramsBlockTemplate.render(getMetalPaintDescription());

	/**
	 * Особенности конструкции
	 */
	if (params.calcType == 'objects') {
		if(getConstructionAdditional().images.length > 0) html += paramsBlockTemplate.render(getConstructionAdditional());
		if(getTemplatingDescription()) html += paramsBlockTemplate.render(getTemplatingDescription());
	}

	// Доставка и монтаж
	if (params.isAssembling != 'нет') {
		html += paramsBlockTemplate.render(getAssemblingDescription());
	}

	// html += $.templates("#footerTemplate").render({
	// 	image: "/images/calculator/new_kp/assembling_1.png",
	// 	items:[
	// 		"Покажем образцы древесины, обработки, покрытия и тд - у нас в офисе больше 200 образцов!",
	// 		"Ответим на все ваши вопросы касаемо монтажа и дальнейшего ухода за подоконником",
	// 		"Проведем экскурсию по производству, расскажем обо всех нюансах",
	// 	]
	// });
	

	html += '</div>'
	return html
}

function getInputsFromForm(form, className){
	var selector = 'tr:not([style*="display: none"])';
	if (className) {
		selector = 'tr.'+className+':not([style*="display: none"])';
	}
	var tr = $(form).find(selector)
	var par = [];
	$.each(tr, function(){
		var input = $(this).find('input, select');
		if (input.length > 0) {
			par.push({title: $(this).find('td')[0].innerHTML, value: input.val()});
		}
	})

	return par;
}

// Картинки для обработки дерева
function getTimberPaintDescription(){
	
	var painting_images = [];
	factBlocks.forEach(function(fact){
		if (fact.type == "описание" && 
			fact.group == "painting" && 
			fact.block == "timber" && 
			(!fact.conditions || eval(fact.conditions))){
				painting_images.push(fact)
		}
	});
	
	/*
	var painting_images = [
		{
			'name': 'Брашировка',
			'subTitle': 'поверхность брашированная - обрабатываем специальными щетками, чтобы сделать текстуру более выраженной',
			'description': "За счет специальной обработки - искусственного старения или брашировки, красивая структура дерева дополнительно подчеркивается и становится более ярко выраженной.",
			'condition': 'params.surfaceType == "брашированная"',
			'block': 'timber',
			'image': "/images/calculator/new_kp/brush_01.jpg",
		},
		{
			'name': 'Брашировка',
			'description': '',
			'condition': 'params.surfaceType == "брашированная"',
			'block': 'timber',
			'image': "/images/calculator/new_kp/brush_02.jpg",
		},
		{
			'name': 'Шлифовка',
			'subTitle': 'Тщательно шлифуем все поверхности 4 разными шкурками от крупной (P80) к мелкой (P320).',
			'description': "Все детали тщательно шлифуются. Сначала на станках, затем вручную, для достижения идеально гладкой поверхности. Обработка происходт 4 шкурками разной зернистости, от крупной к мелкой. Сначала P80, потом P120, Р240, Р320. Каждая следующая шкурка делает поверхность все более гладкой.",
			'condition': 'params.surfaceType == "гладкая"',
			'block': 'timber',
			'image': "/images/calculator/new_kp/sander.jpg",
		},
		{
			'name': 'Покраска лаком',
			'subTitle': 'красим итальянским двухкомпонентным лаком Sirca. Получается прочное, износостойкое и красивое покрытие',
			'description': "После этого изделие покрывается износостойким двухкомпонентным лаком Sirca (Италия) в специальной малярной камере. Лак образует на поверхности дерева прочную гладкую пленку. Покрытие экологично и абсолютно безвредно для человека.",
			'condition': '["лак", "морилка+лак", "морилка+патина+лак"].indexOf(params.timberPaint) != -1',
			'block': 'timber',
			'image': "/images/calculator/new_kp/paint_lack.jpg",
		},
		{
			'name': 'Покраска маслом',
			'subTitle': 'красим итальянским паркетным маслом Borma с твердым воском. Получается прочное, износостойкое и красивое покрытие. Поверхность теплая и приятная на ощупь',
			'description': "После этого изделие покрывается износостойким маслом с твердым воском Borma Wachs (Италия). Масло надежно защищает древесину, благодаря глубокому проникновению в структуру. Масло экологично и абсолютно безвредно для человека. Возникающие при эксплуатации царапины можно отреставрировать по месту без проблем",
			'condition': '["масло", "цветное масло"].indexOf(params.timberPaint) != -1',
			'block': 'timber',
			'image': "/images/calculator/new_kp/paint_oil.jpg",
		}
	]
	*/
	// Перебираем типы дерева
	$.each($('#treadsMaterial option'), function(){
		var timberType = this.value;
		var timberFolder = 'дуб';
		if (this.value.indexOf("карагач") != -1) timberFolder = 'карагач';
		if (this.value.indexOf("лиственница") != -1) timberFolder = 'лиственница';
		if (this.value.indexOf("сосна") != -1) timberFolder = 'сосна';
		if (this.value.indexOf("береза") != -1) timberFolder = 'береза';
		// Перебираем цвета
		$.each($('#treadsColor option'), function(){
			var color = this.value;
			// if (color == 'нет' || color == 'не указано'){
			// 	painting_images.push({
			// 		'name': color,
			// 		'description': "",
			// 		'condition': 'Materials.getSceneMaterialsList().indexOf("нет") != -1 && getSceneColors("timber").indexOf("нет") != -1 || Materials.getSceneMaterialsList().indexOf("не указано") != -1 && getSceneColors("timber").indexOf("не указано") != -1',
			// 		'block': 'timber',
			// 		'image': '/images/calculator/timber_paint/'+timberFolder+'/натуральный.jpg'
			// 	});
			// 	return;
			// }
			if (color == 'нет' || color == 'не указано') return;
			// Лак
			painting_images.push({
				'name': color,
				'description': "",
				'condition': 'Materials.getSceneMaterialsList().indexOf("'+timberType+'") != -1 && getSceneColors("timber").indexOf("'+color+'") != -1 && ["лак", "морилка+лак", "морилка+патина+лак"].indexOf(params.timberPaint) != -1',
				'block': 'timber',
				'image': '/images/calculator/timber_paint/'+timberFolder+'/лак/'+color+'.jpg'
			});
			// Масло
			painting_images.push({
				'name': color,
				'description': "",
				'condition': 'Materials.getSceneMaterialsList().indexOf("'+timberType+'") != -1 && getSceneColors("timber").indexOf("'+color+'") != -1 && ["масло", "цветное масло"].indexOf(params.timberPaint) != -1',
				'block': 'timber',
				'image': '/images/calculator/timber_paint/'+timberFolder+'/масло/'+color+'.jpg'
			});
		})
	})

	var items = getGoodItems(painting_images);

	var descriptionText = "";
	var images = [];
	items.forEach(function(item){
		descriptionText += item.description;
		images.push({url: item.image});
	})

	// Формирование параметров
	var form = $('#nav-materials .form_table')[0];
	var par = getInputsFromForm(form, 'timberPaint');
	$.each($('#colorsFormTable tr[data-mat="timber"]:not([style*="display: none"])'), function(){
		par.push({
			title: "Цвет ("+$(this).find("td")[0].innerHTML+")",
			value: $(this).find(".Color").val()
		})
	})

	return {title: 'Обработка дерева', description: descriptionText, images: images, par: par}
}

/**
 * Функция получает цвета объектов сцены соответсвующего типа(metal/timber)
 */
function getSceneColors(materialType){
	var colors = [];
	view.scene.traverse(function(node){
		var material = node.material;
		if (material && material.userData && material.userData.materialColorName && material.userData.materialGroup == materialType) {
			if (colors.indexOf(material.userData.materialColorName) == -1) colors.push(material.userData.materialColorName);
		}
	});
	return colors;
}

// Картинки для обработки дерева
function getMetalPaintDescription(){
	var painting_images = [];
	
	factBlocks.forEach(function(fact){
		if (fact.type == "описание" && 
			fact.group == "painting" && 
			fact.block == "metal" && 
			(!fact.conditions || eval(fact.conditions))){
				painting_images.push(fact)
		}
	});
	

	$.each($('#carcasColor option'), function(){
		var name = this.value;
		painting_images.push({
			'name': name,
			'description': "",
			'condition': 'getSceneColors("metal").indexOf("'+name+'") != -1',
			'block': 'metal',
			'image': '/images/calculator/metal_paint/'+name+'.jpg'
		});
	})

	var items = getGoodItems(painting_images);

	var descriptionText = "";
	var images = [];
	items.forEach(function(item){
		descriptionText += item.description;
		images.push({url: item.image});
	})

	// Формируем параметры
	var par = [
		{
			title: "Тип покраски",
			value: params.metalPaint
		},
		{
			title: "Цвет металла",
			value: params.carcasColor
		}
	];
	$.each($('#colorsFormTable tr[data-mat="metal"]:not([style*="display: none"])'), function(){
		par.push({
			title: "Цвет ("+$(this).find("td")[0].innerHTML+")",
			value: $(this).find(".Color").val()
		})
	})

	return {title: 'Покраска металла', description: descriptionText, images: images, par: par}
}

function getGoodItems(array){
	return array.filter(function(item){
		//Отсутствие условия считаем указателем на то, что этот пункт актуален всегда
		if (!item.condition) return true;
		if(eval(item.condition)) return true;
		return false;
	})
}