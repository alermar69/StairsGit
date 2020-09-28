
/** функция возвращает описание каркаса
*/

function getCarcasDescr(){
	
	var text = {
		title: "Каркас",
		main: "",
		facts: [],
		img: "",
	};
	
	if(params.calcType == "railing") return false;
	
	//главное описание
	
	text['main'] = "Каркас представляет собой ";
	
	if(params.calcType == "metal" || params.calcType == "vhod"){		
		//тетива или косоур
		if(params.model == "лт") text['main'] += "две металлические тетивы";
		if(params.model == "ко") text['main'] += "два металлических косоура";
		//лист или короб
		if(params.stringerModel == "лист") text['main'] += " из толстого стального листа толщиной 8мм."
		if(params.stringerModel == "короб") text['main'] += " толщиной 20мм, сваренные в виде короба из стальных пластин толщиной 4мм."
		//рамки или уголки
		if(params.stairFrame == "нет") text['main'] += " Ступени крепятся к тетивам при помощи специальных уголков";
		if(params.stairFrame == "есть") text['main'] += " Между тетивами устанавливаются рамки из профильной трубы, которые придают каркасу дополнительную жесткость. Ступени укладываются сверху на рамки и фиксируются саморезами";
	};
	
	if(params.calcType == "mono"){
		text['main'] += "один косоур, расположенный посередине марша";
		if (model == "сварной") {
			text['main'] += " Косоур сваривается из толстых стальных пластин толщиной 4мм в виде короба. Сварка короба производится изнутри, за счет этого в лестнице нет видимых сварных швов и она выглядет монолитной. Сверху на косоур угладываются опоры ступеней из стального листа 8мм."
		}
		if (model == "труба") {
			text['main'] += " из толстостенного профиля 100х100мм, на который навариваются пластины с вырезами для ступеней. Ступени опираются на гнутые пластниы оригинального дизайна."
		}
	}
	
	if(params.calcType == "bolz"){
		text['main'] += "тетиву из толстого стального листа 8мм, идущую по внешней стороне марша, плюс больцы прямоугольного сечения по внутренней стороне. Для большей надежности внутрь ступеней вклеиваются специальные стальные пластины";
	}
	
	if(params.calcType == "console"){
		text['main'] += "несущую балку, которая замуровывается в стену. К балке креятся ступени, которые представляют собой прочный сварной короб из стальных пластин, облицованный сверху деревом.";
	}
	
	if(params.calcType == "vint"){
		text['main'] = "Центральный столб лестницы составной. В середине проходит стальной стержень диаметром 25мм, а на него одеваются ступени, между которыми устанавливаются проставки из стальной трубы диаметром Ф127мм";
	}
	
	if(params.calcType == "timber_stock" || params.calcType == "timber"){
		text['main'] += " две клееные деревянные балки с пазами, в которые устанавливаются ступени. " + params.model + " фрезеруются на специализированном фрезерном станке с программным управлением, что обеспечивает идеальную точность размеров, аккуратность соединений и отсутствие скрипов во время эксплуатации.";
	}

	//дополнительные факты
	// text['facts'].push("Выдерживает нагрузку до 900 кг")
	// text['facts'].push("Изготавливается специально под Ваши размеры")
	// text['facts'].push("Срок службы не ограничен")
	// text['facts'].push("Собирается без сварки за 3-4 часа")
	// if(params.metalPaint == "порошок") text['facts'].push("Окрашивается долговечной износостойкой порошковой краской")
	text['facts'] = getFacts('description', 'carcas').map(function(item){return item.name});
	return text;
}

/** функция возвращает описание ступеней
*/

function getTreadDescr(){
	
	var text = {
		title: "Ступени",
		main: "",
		facts: [],
		img: "",
	};
	
	if(params.calcType == "railing") return false;
	
	var stairType = params.stairType;
	if(stairType == "массив") stairType = params.treadsMaterial;


	var stairsHeader = " из 100% массива ";
	var stairMaterial = "дерево";	
	var stairsImage = "001.jpg";


		
	if (stairType == "сосна экстра") {
		stairsHeader += " сосны класса Экстра без сучков и других дефектов.";
		stairMaterial = "дерево";
		stairsImage = "pine_prem.jpg";
	}
	if (stairType =="лиственница паркет.") {
		stairsHeader += " сибирской лиственницы класса Экстра без сучков и других дефектов";
		stairMaterial = "дерево";
		stairsImage = "larch.jpg";
	}
	if (stairType =="лиственница ц/л") {
		stairsHeader += " сибирской лиственницы класса Экстра без сучков и других дефектов";
		stairMaterial = "дерево";
		stairsImage = "larch_prem.jpg";
	}
	if (stairType =="береза паркет.") {
		stairsHeader += " рязанской березы";
		stairMaterial = "дерево";
		stairsImage = "002.jpg";
	}
	if (stairType =="дуб паркет.") {
		stairsHeader += " краснодарского дуба";
		stairMaterial = "дерево";
		stairsImage = "003.jpg";
	}
	if (stairType =="дуб ц/л") {
		stairsHeader += " краснодарского дуба класса Экстра";
		stairMaterial = "дерево";
		stairsImage = "004.jpg";
	}

	if (stairType =="рифленая сталь") {
		stairsHeader = "Ступени из рифленой стали";
		// text['facts'].push("Ступени полностью металлические, изготовлены из нескользкого рифленого стального листа;");
		// text['facts'].push("Ступени имеют усиленную конструкцию и каждая ступень выдерживает нагрузку до 250кг;");
		// text['facts'].push("Металлические ступени идеально подходят для уличных лестниц");
		stairMaterial = "металл";
		stairsImage = "005.jpg";
	}

	if (stairType =="лотки") {
		stairsHeader = "Лотковые ступени под плитку"
		// text['facts'].push("Ступени предвтавляют собо сварной лоток, который заливается бетоном и облицовывается плиткой или камнем;");
		// text['facts'].push("Ступени имеют усиленную конструкцию и каждая ступень выдерживает нагрузку до 250кг;");
		// text['facts'].push("Ступени, облицованные плиткой идеально подходят для лестниц в общественных местах с большой проходимостью");
		stairMaterial = "металл";
		stairsImage = "007.jpg";
	}
	if (stairType =="дпк") {
		stairsHeader = "Ступени из террасной доски ДПК"
		// text['facts'].push("Ступени состоят из несущеей стальной рамки и покрытия террасной доски ДПК;");		
		// text['facts'].push("Cтупени из террасной доски великолепно выглядят, нескользкие и долговечные;");
		stairMaterial = "рамки";
		stairsImage = "008.jpg";
	}
	if (stairType =="пресснастил") {
		stairsHeader = "Ступени из решетчатого настила";
		// text['facts'].push("Ступени предвтавляют собой решетку из стальных полос, поставленных на ребро;");
		// text['facts'].push("Зимой на решетчатых ступенях не задерживается снег;");
		// text['facts'].push("Ступени защищены от коррозии методом горячего цинкования;");
		stairsImage = "009.jpg";
	}
	if (stairType =="стекло") {
		stairsHeader = "Ступени из многослойного стекла";
		// text['facts'].push( "Ступени состоят из несущеей стальной рамки и покрытия из двухслойного закаленного стекла толщиной 20мм;");
		// text['facts'].push("Стеклянные ступени идеальный вариант при оформлении интерьера в стие Хайтек;");
		stairMaterial = "рамки";
		stairsImage = "010.jpg";
	}
	
	// text['facts'].push("Ступени имеют усиленную конструкцию и каждая ступень выдерживает нагрузку до 250кг;");

	if (stairMaterial == "дерево") {
		
		stairsHeader += "Изготавливаются из мебельного щита толщиной " + params.treadThickness + " мм. Для удобства и безопасности все кромки скруляются небольшим радиусом."
		
		// text['facts'].push("Ступени склеены на немецкой линии сращивания клеем класса D3. Прочность склейки превышает прочность дерева;");
		// text['facts'].push("Дерево тщательно высушено до влажности 8%. Благодаря этому ступени не потрескаются и не покоробятся в процессе эксплуатации;");
		if (params.timberPaint == "нет"){
			// text['facts'].push("Для красоты и безопасности верхние грани аккуратно скруглены фрезером;");
			// text['facts'].push("Ступени поставляются отшлифованными и подготовленными к покраске");
		}
		if (params.timberPaint == "лак" || params.timberPaint == "морилка+лак") {
			// text['facts'].push("Ступени покрываются в 3 слоя специальным износостойким двухкомпонентным паркетным лаком итальянского производства;");
			// text['facts'].push("Лак имеет нескользкую и приятную на ощупь полуматовую поверхность. Отделка подчеркивает красоту натурального дерева;");
		}
		
		if (params.timberPaint == "масло" || params.timberPaint == "цветное масло") {
			// text['facts'].push("Ступени покрываются в 3 слоя специальным износостойким паркетным маслом итальянского производства;");
			// text['facts'].push("Дерево имеет нескользкую и приятную на ощупь полуматовую поверхность. Отделка подчеркивает красоту натурального дерева;");
		}
	}
		
	if (stairMaterial == "металл") { 
		// if (metalPaint == "нет") text['facts'].push("Ступени поставляются зачищенными и подготовленными к покраске;");
		// if (metalPaint == "порошок") text['facts'].push("Ступени покрываются красивой, прочной и долговечной порошковой краской;");

	}
	
	text.main = "Ступени"
	if(staircaseHasUnit().risers && params.treadsMaterial == params.risersMaterial ) text.main += ", подступенки";
	if(staircaseHasUnit().skirting && params.treadsMaterial == params.skirtingMaterial ) text.main += ", плинтус";
	text.main += stairsHeader;
	text['facts'] = getFacts('description', 'treads').map(function(item){return item.name});

	text.img = "/images/calculator/stairs/" + stairsImage;
	
	return text;
}

/** функция возвращает описание ограждения
*/

function getRailingDescr(){
	var text = {
		title: "Ограждения",
		main: "",
		facts: [],
		img: "",
	};
	
	//общее описание
	
	text.main = "Ограждения имеют современный дизайн и состоят из вертикальных стоек и";
	if(params.railingModel == "Ригели") text.main += " заполнения в виде струн (ригелей), параллельных поручню.";
	if(params.railingModel == "Стекло на стойках") text.main += " установленных между ними стекол.";
	if(params.railingModel == "Экраны лазер") text.main += " установленных между ними металлических пластин, с вырезанным на них узором.";
	if(params.railingModel == "Решетка") text.main += " заполнения из вертикальных стоек меньшего сечения.";
	
	if(params.railingModel == "Кованые балясины") text.main = "Ограждения имеют классический дизайн и представляют собой цельносварные секции с коваными балясинами";
	
	if(params.railingModel == "Самонесущее стекло") text.main += "Ограждения имеют оригинальный минималистичный дизайн и состоят из больших листов толстого закаленного стекла.";

	if(params.railingModel == "Трап") text.main += "Ограждения имеют оригинальный дизайн в индустриальном стиле и состоят из стоек, перпендикулярных маршу и заполнения в виде струн (ригелей), параллельных маршу.";

	if(params.railingModel == "Деревянные балясины" || params.railingModel == "Дерево с ковкой") {
		text.main = "Ограждения имеют классический дизайн и состоят из опорных деревянных столбов и заполнения между ними из ";
		if(params.railingModel == "Деревянные балясины") text.main += "деревянных балясин."
		if(params.railingModel == "Дерево с ковкой") text.main += " кованых балясин."
	}
	
	if(params.railingModel == "Стекло") text.main += "Ограждения имеют оригинальный современный дизайн и состоят из опорных деревянных столбов и установленных между ними стекол.";
	
	if(params.calcType == "vint"){
		text.main += "Ограждения имеют оригинальный современный дизайн и состоят из вертикльных стоек квадратного сечения и поручня, изогнутого в форме спирали.";
		
		// if(params.handrailMaterial == "ПВХ") text['facts'].push("Круглый поручень из ПВХ диаметром 50мм удобный, красивый и приятный на ощупь;")
		// if(params.handrailMaterial == "Дуб") text['facts'].push("Гнутый поручень из массива дуба - самый лучший вариант для элитной винтовой лестницы;")

		// if(params.rackType == "черная сталь") text['facts'].push("Стойки ограждений, крашенные в цвет лестницы, создают единый гармоничный внешний вид;")
		// if(params.rackType == "нержавейка") text['facts'].push("Стойки ограждений из полированной нержавейки великолепно выглядят и отлично вписываются в любое помещение;")
	}

	//параметры поручня
	// if(params.calcType != "vint"){
	// 	var handrailPar = {
	// 		prof: params.handrailProf,
	// 		sideSlots: params.handrailSlots,
	// 		handrailType: params.handrail,
	// 	}
			
	// 	handrailPar = calcHandrailMeterParams(handrailPar);

	// 	if(handrailPar.mat == "metal") text['facts'].push("Металлический поручень сечением " + handrailPar.handrailProfileY + "x" + handrailPar.handrailProfileZ + " мм");
	// 	if(handrailPar.mat == "inox") text['facts'].push("Поручень из полированной нержавеющей стали");
	// 	if(handrailPar.mat == "timber") text['facts'].push("Прямоугольный поручень из массива дерева теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;");
	// }
	
	// if (staircaseHasUnit().railingMetalPaint) {
	// 	text['facts'].push("Металлические детали ограждений покрываются красивой, прочной и долговечной порошковой краской;");
	// }
	// if (staircaseHasUnit().railingTimberPaint){
	// 	if (params.timberPaint == "нет") text['facts'].push("Деревянные детали ограждений поставляются отшлифованными и подготовленными к покраске");
	// 	if (params.timberPaint == "лак") text['facts'].push("Деревянные детали ограждений покрываются прозрачным лаком");
	// 	if (params.timberPaint == "морилка+лак") text['facts'].push("Деревянные детали ограждений тонируются в выбранный Вами цвет и покрываются лаком");
	// 	if (params.timberPaint == "масло" || params.timberPaint == "цветное масло") {
	// 		text['facts'].push("Деревянные детали ограждений покрываются в 3 слоя специальным износостойким паркетным маслом итальянского производства;");
	// 		text['facts'].push("Дерево имеет нескользкую и приятную на ощупь полуматовую поверхность. Отделка подчеркивает красоту натурального дерева;");
	// 	}
	// }
	

	// if(params.calcType == "railing"){
		
		
		
	// }

	text['facts'] = getFacts('description', 'railing').map(function(item){return item.name});
	
	return text;
}

/** функция возвращает описание используемых материалов
*/

function getMatDescr() {
	var blocks = [];
	
	//конструкционная сталь
	//нержавейка
	//мебельный щит
	//дпк
	//террасная доска из лиственницы
	//рифленый лист
	//порошковая краска - производитель, цвет, технология
	//лак - производитель, цвет, технология
	//масло
	//стекло для ограждений
	//ступени из стекла

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
	if (params.calcType == 'objects') {
		return printAdditionalDescription();
	}
	var text = "";
	var additionalObjectsText = ""
	if (window.additional_objects && window.additional_objects.length > 0) {
		window.additional_objects.forEach(function(obj){
			if (obj.calc_price) {
				additionalObjectsText += eval(obj.className).getDescr(obj).html;
			}
		})
	}

	if (window.location.href.indexOf('/customers') != -1) {
		$('#additionalObjectsParams').html(additionalObjectsText);
	}else{
		text += additionalObjectsText;
	}

	if(params.calcType != 'carport') text += $('#zamerBlocks').html();
	if(params.calcType == 'carport') text += $('#zamerBlocksCarport').html();
	if (params.calcType == 'carport') {
		text += "<div class='description-title'>Основные особенности Вашего навеса</div>";
	}else{
		text += "<div class='description-title'>Основные особенности Вашей лестницы</div>";
	}
	var blocks = [];
	var units = staircaseHasUnit();
	//каркас
	if(units.carcas) blocks.push({type: 'carcas', content: getCarcasDescr(), images: getPreviewImages('carcas')});
	
	//ступени
	if(units.treads) {
		var images = getPreviewImages('treads');
		//картинка по умолчанию
		if(images.length == 0){
			images = [{url: getTreadDescr().img}]
		}
		blocks.push({type: 'treads', content: getTreadDescr(), images: images});
	}
	
	//ограждения
	if(units.railing || units.banister || units.sideHandrails) blocks.push({type: 'railing', content: getRailingDescr(), images: getPreviewImages('railing')});
	
	if (units.carportCarcas) blocks.push({type: 'carport_carcas', content: getCarportCarcasDescr(), images: getPreviewImages('carport_carcas')});
	if (units.carportRoof) blocks.push({type: 'carport_roof', content: getCarportRoofDescr(), images: getPreviewImages('carport_roof')});

	// $.each(blocks, function(){
	// 	if(!this || !this.type) return true;
	// 	text += html;
	// });
	if ($("#descriptionTempalte").length > 0) {
		var template = $.templates("#descriptionTempalte");
		var html = template.render(blocks);
		text += html;
		$("#description").html(text);
	
		if ($('#previewImages').length > 0) {
			var images = getPreviewImages('preview');
			var template = $.templates("#previewsTemplate");
			var html = template.render({images: images});
			$('#previewImages').html(html);
		}
	}

	//описание для производственного модуля
	if(typeof getExportData_com == 'function' && document.location.href.indexOf("manufacturing") != -1){
		
		var exportObj = getExportData_com();
		
		var prodDescr = "<p>" + exportObj.product_descr + "</p>"
		
		//Объем по цехам
		if(exportObj.dept_data){
			prodDescr += "<h4>Объем по цехам:</h4>"
			var normFactor = 1 / 150;

			prodDescr += "<table class='tab_4'><thead><tr>" + 
				"<th>Цех</th>" +
				"<th>н-л</th>" +
				"<tr></thead><tbody>";
			$.each(exportObj.dept_data, function(dept){
				prodDescr += "<tr>"
				if(typeof getDeptProps == "function") prodDescr += "<td>" + getDeptProps(dept).name + "</td>";
				else prodDescr += "<td>" + dept + "</td>";
				prodDescr += "<td>" + Math.round(this * normFactor / 10) / 100 + "</td>" +
					"</tr>"
			})
			prodDescr += "</tbody></table>"
			
		}
			
		$("#descr").html(prodDescr);
	}
}

function printAdditionalDescription(){
	var paramsBlockTemplate = $.templates("#paramsBlockTemplate");
	var infoBlockTemplate = $.templates("#infoBlockTemplate");
	var imagesBlockTemplate = $.templates("#imagesBlockTemplate");

	var html = "<div class='container newKP' style=''>";

	// Материалы
	html += Materials.getSceneDescription().html;

	// Отделка дерева
	var form = $('#nav-materials .form_table')[0];
	var par = getInputsFromForm(form);
	html += paramsBlockTemplate.render(getTimberPaintDescription());
	
	// Покраска металла
	html += paramsBlockTemplate.render({
		title: "Покраска металла",
		description: "В специальном покрасочном цехе мы окрашиваем все металлические детали долговечной\
		износостойкой порошковой краской с нулевой эмиссией летучих веществ. А так же обеспечиваем\
		контроль толщины слоя.",
		images: [
			{
				url: "/images/calculator/new_kp/20. Порошковая покраска металла - работа.jpg",
			},
			{
				url: "/images/calculator/new_kp/20. Порошковая покраска металла - результат.jpg",
			}
		],
		par: [
			{
				title: 'Цвет металла',
				value: 'темно-серый'
			}
		]
	});

	var additionalObjectsText = ""
	if (window.additional_objects && window.additional_objects.length > 0) {
		window.additional_objects.forEach(function(obj){
			if (obj.calc_price) {
				if (eval(obj.className)) {
					var blockType = "object_" + obj.id;
					html += $.templates("#objectDescriptionTempalte").render({noDefault: true, type: blockType, images: getPreviewImages(blockType), description: eval(obj.className).getDescr(obj).html});
				}
			}
		})
	}

	html += additionalObjectsText;

	// Доставка и монтаж
	// Получаем инпуты соответсвующей формы
	var par = getInputsFromForm($('#assemblingWrap table')[0]);
	html += paramsBlockTemplate.render({
		title: "Как будет происходить доставка и монтаж",
		description: "",
		images: [
			{
				url: '/images/calculator/new_kp/assembling_1.png',
				text: 'Доставка и монтаж готового изделия осуществляется в удобный для вас день и время.'
			},
			{
				url: '/images/calculator/new_kp/assembling_2.jpg',
				text: 'Перед отправкой изделия мы надежно упаковываем его в плотную пленку для безопасной транспортировки.'
			},
			{
				url: '/images/calculator/new_kp/assembling_3.jpeg',
				text: 'Монтаж подоконника занимает не более 2х часов. После окончания работ, монтажники уберут за собой весь мусор.'
			}
		],
		par: par
	});


	html += $.templates("#footerTemplate").render({
		image: "/images/calculator/new_kp/assembling_1.png",
		items:[
			"Бесплатно организуем вам такси до нашего офиса",
			"Покажем образцы древесины, обработки, покрытия и тд - у нас в офисе больше 200 образцов!",
			"Ответим на все ваши вопросы касаемо монтажа и дальнейшего ухода за подоконником",
			"Проведем экскурсию по производству, расскажем обо всех нюансах",
		]
	});
	

	html += '</div>'
	$("#description").html(html);

	if ($('#previewImages').length > 0) {
		var images = getPreviewImages('preview');
		var template = $.templates("#previewsTemplate");
		var html = template.render({images: images});
		$('#previewImages').html(html);
	}
}

function getInputsFromForm(form){
	var tr = $(form).find('tr:not([style*="display: none"])')
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
	var painting_images = [
		{
			'name': 'Брашировка',
			'description': "За счет специальной обработки - искусственного старения или брашировки, красивая структура дерева дополнительно подчеркивается и становится более ярко выраженной.",
			'condition': 'params.surfaceType == "брашированная"',
			'block': 'timber',
			'image': '/images/calculator/sill/timber_work_1.jpg'
		},
		{
			'name': 'Шлифовка',
			'description': "",
			'condition': 'params.surfaceType == "гладкая"',
			'block': 'timber',
			'image': '/images/calculator/sill/timber_work_1.jpg'
		},
		{
			'name': 'Покраска лаком',
			'description': "",
			'condition': '["лак", "морилка+лак", "морилка+патина+лак"].indexOf(params.timberPaint) != -1',
			'block': 'timber',
			'image': '/images/calculator/sill/timber_work_1.jpg'
		},
		{
			'name': 'Покраска маслом',
			'description': "После этого изделие покрывается высококачественным маслом, немецкого производства.Масло надежно защищает древесину от гниения, благодаря глубокому проникновению вструктуру. Не расслаивается и не отшелушивается. Масло абсолютно безвредно длячеловека.",
			'condition': '["масло", "цветное масло"].indexOf(params.timberPaint) != -1',
			'block': 'timber',
			'image': '/images/calculator/sill/timber_work_1.jpg'
		}
	]
	var items = getGoodItems(painting_images);

	var descriptionText = "";
	var images = [];
	items.forEach(function(item){
		descriptionText += item.description;
		images.push({url: item.image});
	})

	return {title: 'Обработка дерева', description: descriptionText, images: images}
}

function getGoodItems(array){
	return array.filter(function(item){
		if(eval(item.condition)) return true;
		return false;
	})
}