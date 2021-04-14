var factBlocks = [
	/** ------------------------ Геометрия --------------------------------------------------- */
	{
		'name': 'Габаритная высота {{getGeomDescr().G}} мм',
		'description': 'Много пространство над головой - так называемый Габарит G. Он составляет {{getGeomDescr().G}}мм. Этого значения достаточно для комфортного перемещения по лестницы людям любого роста. У вас не будет создаваться ощущение, что можно удариться головой о перекрытие',
		'image': 'https://thumb.tildacdn.com/tild6664-3561-4635-b366-353365393231/-/resize/260x/-/format/webp/__2020-04-04__235657.png',
		'not_for': ['railing'],
		'group': 'geometry'
	},
	{
		'name': 'Ширина марша {{params.M}} мм',
		'description': 'Ширина маршей составляет {{params.M}}мм, благодаря чему на лестнице могут спокойно разойтись двое людей. Так же есть возможность комфортно поднимать/спускать мебель или другие крупногабаритные предметы.',
		'image': 'https://thumb.tildacdn.com/tild3466-3166-4838-b034-663837306361/-/resize/260x/-/format/webp/esli-vynesti-mebel-n.jpg',
		'not_for': ['railing'],
		'group': 'geometry'
	},
	{
		'name': 'Поворот через площадку',
		'description': 'Наличие площадки между маршами - обеспечивает еще более удобный подъем, поскольку на площадке ноги отдыхают между маршами. К тому же наличие площадки позволяет более рационально использовать пространство под лестницей, например вы можете поставить шкаф или просто удобно складировать вещи под лестницей.',
		'image': 'https://thumb.tildacdn.com/tild6439-3463-4262-b530-376432623034/-/resize/260x/-/format/webp/raschet-povorota-les.png',
		'condition': 'hasPlatformTurn',
		'not_for': ['vint', 'railing', 'wardrobe'],
		'group': 'geometry'
	},
	{
		'name': 'Поворот через забежные ступени',
		'description': 'Проект лестницы включает забежные ступени - это позволяет существенно уменьшить используемое пространство, благодаря чему лестница отлично впишется в вашу обстановку.',
		'image': 'https://thumb.tildacdn.com/tild6661-3463-4438-b533-613431623339/-/resize/260x/-/format/webp/__2020-04-04__235328.png',
		'condition': 'hasWinderTurn',
		'not_for': ['vint', 'railing', 'wardrobe'],
		'group': 'geometry'
	},
	{
		'name': 'Расчет произведен с учетом формулы шага',
		'image': 'https://thumb.tildacdn.com/tild3833-6662-4761-b837-373430393534/-/resize/260x/-/format/webp/__2020-04-04__234607.png',
		'not_for': ['vint', 'railing', 'wardrobe'],
		'group': 'geometry'
	},
	{
		'name': 'Удобный заход и выход с лестницы',
		'description': 'Удобный заход и выход с лестницы обеспечен наличием достаточного места до стен. Эти параметры составяют не менее ширины марша.',
		'image': 'https://thumb.tildacdn.com/tild3161-3232-4838-b563-313132393566/-/resize/260x/-/format/webp/__2020-04-05__000728.png',
		'condition': 'hasStartTreads',
		'not_for': ['wardrobe'],
		'group': 'geometry'
	},

	{
		'name': 'Геометрия лестницы подобрана под обстановку',
		'description': 'Проект лестницы мы разработали специально под размеры и обстановку вашего помещения. В результате лестница получилась максимально пологой и при этом она не занимает много места',
		'image': 'https://thumb.tildacdn.com/tild6337-3632-4637-b530-363566393138/-/resize/260x/-/format/webp/__2020-04-04__234903.png',
		'not_for': ['railing'],
		'group': 'geometry'
	},
	/** ------------------------ Описание - каркас ------------------------------------------- */
	{
		'name': 'Изготавливается специально под Ваши размеры',
		'not_for': ['railing'],
		'block': 'carcas',
		'group': 'description'
	},
	{
		'name': 'Срок службы не ограничен',
		'not_for': ['railing'],
		'block': 'carcas',
		'group': 'description'
	},
	{
		'name': 'Собирается без сварки за 3-4 часа',
		'not_for': ['vint', 'railing', 'wardrobe'],
		'block': 'carcas',
		'group': 'description'
	},
	{
		'name': 'Выдерживает нагрузку до 900 кг',
		'not_for': ['railing', 'carport'],
		'block': 'carcas',
		'group': 'description'
	},
	{
		'name': 'Окрашивается долговечной износостойкой порошковой краской',
		'not_for': ['railing'],
		'condition': 'eval',
		'value': 'params.metalPaint == "порошок"',
		'block': 'carcas',
		'group': 'description'
	},

	/** ------------------------ Описание - каркас навесов ------------------------------------- */
	{
		'name': 'Усиленные фермы из {{params.trussThk}}мм листа металла',
		'only_for': ['carport'],
		'block': 'carcas',
		'group': 'description'
	},
	{
		'name': 'Мощные прогоны из {{params.progonProfile}} профиля',
		'only_for': ['carport'],
		'block': 'carcas',
		'group': 'description'
	},
	{
		'name': 'Мощные колонны из {{params.columnProfile}} профиля',
		'only_for': ['carport'],
		'block': 'carcas',
		'group': 'description'
	},
	/** ------------------------ Описание - кровля навесов ------------------------------------- */
	{
		'name': 'Как материал кровли используется {{params.roofType}}',
		'only_for': ['carport'],
		'block': 'roof',
		'group': 'description'
	},
	{
		'name': 'Поликорбанат толщиной {{params.roofThk}}мм',
		'only_for': ['carport'],
		'block': 'roof',
		'group': 'description'
	},
	{
		'name': 'Высота крыши в {{params.height}}мм позволяет свободно передвигаться под ней',
		'only_for': ['carport'],
		'condition': 'eval',
		'value': 'params.height > 1900',
		'block': 'roof',
		'group': 'description'
	},
	{
		'name': 'Свес сбоку в {{params.sideOffset}}мм защищает колонны',
		'only_for': ['carport'],
		'condition': 'eval',
		'value': 'params.sideOffset > 50',
		'block': 'roof',
		'group': 'description'
	},
	/** ------------------------ Описание - ступени ------------------------------------------- */
	{
		'name': 'Ступени имеют усиленную конструкцию и каждая ступень выдерживает нагрузку до 250кг',
		'not_for': ['railing'],
		'condition': 'stairMaterial',
		'value': 'дерево',
		'block': 'treads',
		'group': 'description'
	},
	{
		'name': 'Ступени склеены на немецкой линии сращивания клеем класса D3. Прочность склейки превышает прочность дерева',
		'not_for': ['railing'],
		'condition': 'stairMaterial',
		'value': 'дерево',
		'block': 'treads',
		'group': 'description'
	},
	{
		'name': 'Дерево тщательно высушено до влажности 8%. Благодаря этому ступени не потрескаются и не покоробятся в процессе эксплуатации;',
		'not_for': ['railing'],
		'condition': 'stairMaterial',
		'value': 'дерево',
		'block': 'treads',
		'group': 'description'
	},

	{
		'name': 'Для красоты и безопасности верхние грани аккуратно скруглены фрезером;',
		'not_for': ['railing'],
		'condition': 'eval',
		'value': 'params.timberPaint == "нет"',
		'block': 'treads',
		'group': 'description'
	},
	{
		'name': 'Ступени поставляются отшлифованными и подготовленными к покраске',
		'not_for': ['railing'],
		'condition': 'eval',
		'value': 'params.timberPaint == "нет"',
		'block': 'treads',
		'group': 'description'
	},
	
	{
		'name': 'Ступени покрываются в 3 слоя специальным износостойким двухкомпонентным паркетным лаком итальянского производства;',
		'not_for': ['railing'],
		'condition': 'eval',
		'value': 'params.timberPaint == "лак" || params.timberPaint == "морилка+лак"',
		'block': 'treads',
		'group': 'description'
	},
	{
		'name': 'Лак имеет нескользкую и приятную на ощупь полуматовую поверхность. Отделка подчеркивает красоту натурального дерева;',
		'not_for': ['railing'],
		'condition': 'eval',
		'value': 'params.timberPaint == "лак" || params.timberPaint == "морилка+лак"',
		'block': 'treads',
		'group': 'description'
	},

	{
		'name': 'Ступени покрываются в 3 слоя специальным износостойким паркетным маслом итальянского производства;',
		'not_for': ['railing'],
		'condition': 'eval',
		'value': 'params.timberPaint == "масло" || params.timberPaint == "цветное масло"',
		'block': 'treads',
		'group': 'description'
	},
	{
		'name': 'Дерево имеет нескользкую и приятную на ощупь полуматовую поверхность. Отделка подчеркивает красоту натурального дерева;',
		'not_for': ['railing'],
		'condition': 'eval',
		'value': 'params.timberPaint == "масло" || params.timberPaint == "цветное масло"',
		'block': 'treads',
		'group': 'description'
	},
	

	{
		'name': 'Ступени предвтавляют собо сварной лоток, который заливается бетоном и облицовывается плиткой или камнем;',
		'not_for': ['railing'],
		'condition': 'stairType',
		'value': 'рифленая сталь',
		'block': 'treads',
		'group': 'description'
	},
	{
		'name': 'Ступени, облицованные плиткой идеально подходят для лестниц в общественных местах с большой проходимостью',
		'not_for': ['railing'],
		'condition': 'stairType',
		'value': 'рифленая сталь',
		'block': 'treads',
		'group': 'description'
	},
	{
		'name': 'Ступени состоят из несущеей стальной рамки и покрытия террасной доски ДПК;',
		'not_for': ['railing'],
		'condition': 'stairType',
		'value': 'дпк',
		'block': 'treads',
		'group': 'description'
	},
	{
		'name': 'Cтупени из террасной доски великолепно выглядят, нескользкие и долговечные;',
		'not_for': ['railing'],
		'condition': 'stairType',
		'value': 'дпк',
		'block': 'treads',
		'group': 'description'
	},

	{
		'name': 'Ступени предвтавляют собой решетку из стальных полос, поставленных на ребро;',
		'not_for': ['railing'],
		'condition': 'stairType',
		'value': 'пресснастил',
		'block': 'treads',
		'group': 'description'
	},
	{
		'name': 'Зимой на решетчатых ступенях не задерживается снег;',
		'not_for': ['railing'],
		'condition': 'stairType',
		'value': 'пресснастил',
		'block': 'treads',
		'group': 'description'
	},
	{
		'name': 'Ступени защищены от коррозии методом горячего цинкования;',
		'not_for': ['railing'],
		'condition': 'stairType',
		'value': 'пресснастил',
		'block': 'treads',
		'group': 'description'
	},
	
	{
		'name': 'Ступени состоят из несущеей стальной рамки и покрытия из двухслойного закаленного стекла толщиной 20мм;',
		'not_for': ['railing'],
		'condition': 'stairType',
		'value': 'стекло',
		'block': 'treads',
		'group': 'description'
	},
	{
		'name': 'Стеклянные ступени идеальный вариант при оформлении интерьера в стие Хайтек;',
		'not_for': ['railing'],
		'condition': 'stairType',
		'value': 'стекло',
		'block': 'treads',
		'group': 'description'
	},

	/** ------------------------ Описание - ограждения ------------------------------------------- */
	{
		'name': 'Металлический поручень сечением {{getHandrailProfile()}} мм',
		'not_for': ['vint', 'railing', 'wardrobe'],
		'condition': 'handrailMaterial',
		'value': 'metal',
		'block': 'railing',
		'group': 'description'
	},
	{
		'name': 'Поручень из полированной нержавеющей стали',
		'not_for': ['vint', 'railing', 'wardrobe'],
		'condition': 'handrailMaterial',
		'value': 'inox',
		'block': 'railing',
		'group': 'description'
	},
	{
		'name': 'Прямоугольный поручень из массива дерева теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;',
		'not_for': ['vint', 'railing', 'wardrobe'],
		'condition': 'handrailMaterial',
		'value': 'timber',
		'block': 'railing',
		'group': 'description'
	},

	{
		'name': 'Металлические детали ограждений покрываются красивой, прочной и долговечной порошковой краской;',
		'not_for': ['vint', 'railing', 'wardrobe'],
		'condition': 'eval',
		'value': 'staircaseHasUnit().railingMetalPaint',
		'block': 'railing',
		'group': 'description'
	},
	{
		'name': 'Деревянные детали ограждений поставляются отшлифованными и подготовленными к покраске',
		'not_for': ['vint', 'railing', 'wardrobe'],
		'condition': 'eval',
		'value': 'staircaseHasUnit().railingTimberPaint && params.timberPaint == "нет"',
		'block': 'railing',
		'group': 'description'
	},
	
	{
		'name': 'Деревянные детали ограждений покрываются прозрачным лаком',
		'not_for': ['vint', 'railing', 'wardrobe'],
		'condition': 'eval',
		'value': 'staircaseHasUnit().railingTimberPaint && params.timberPaint == "лак"',
		'block': 'railing',
		'group': 'description'
	},
	{
		'name': 'Деревянные детали ограждений тонируются в выбранный Вами цвет и покрываются лаком',
		'not_for': ['vint', 'railing', 'wardrobe'],
		'condition': 'eval',
		'value': 'staircaseHasUnit().railingTimberPaint && params.timberPaint == "морилка+лак"',
		'block': 'railing',
		'group': 'description'
	},
	{
		'name': 'Деревянные детали ограждений покрываются в 3 слоя специальным износостойким паркетным маслом итальянского производства;',
		'not_for': ['vint', 'railing', 'wardrobe'],
		'condition': 'eval',
		'value': 'staircaseHasUnit().railingTimberPaint && (params.timberPaint == "масло" || params.timberPaint == "цветное масло")',
		'block': 'railing',
		'group': 'description'
	},
	{
		'name': 'Дерево имеет нескользкую и приятную на ощупь полуматовую поверхность. Отделка подчеркивает красоту натурального дерева;',
		'not_for': ['vint', 'railing', 'wardrobe'],
		'condition': 'eval',
		'value': 'staircaseHasUnit().railingTimberPaint && (params.timberPaint == "масло" || params.timberPaint == "цветное масло")',
		'block': 'railing',
		'group': 'description'
	},
];

function getFacts(group, block){
	var generatedFacts = [];

	factBlocks.forEach(function(fact){
		
		if (!(fact.group == group && (fact.block == block || block == undefined))) return;
		if(fact.only_for && fact.only_for.indexOf(params.calcType) == -1 ||  fact.not_for && fact.not_for.indexOf(params.calcType) != -1) return;
		
		if (fact.condition) {
			var isGoodFact = false;
			switch (fact.condition) {
				case 'eval':
					if(eval(fact.value)) isGoodFact = true;
					break;
				case 'stairMaterial':
					var stairTypeC = params.stairType;
					if(stairTypeC == "массив") stairTypeC = params.treadsMaterial;

					var stairMaterial = 'дерево';
					if (['рифленая сталь', 'лотки'].indexOf(stairTypeC) != -1) stairsType = 'метал';
					if (['дпк','пресснастил','стекло'].indexOf(stairTypeC) != -1)  stairsType = 'рамки';

					if (stairMaterial == fact.value) isGoodFact = true;
					break;
				case 'stairType':
					var stairTypeC = params.stairType;
					if(stairTypeC == "массив") stairTypeC = params.treadsMaterial;

					if (stairTypeC == fact.value) isGoodFact = true;
					break;
				case 'handrailMaterial':
					var handrailPar = {
						prof: params.handrailProf,
						sideSlots: params.handrailSlots,
						handrailType: params.handrail,
					}
						
					handrailPar = calcHandrailMeterParams(handrailPar);
					if (handrailPar.mat == fact.value) isGoodFact = true;
					break;
				case 'hasRailings':
					if (params.railingSide_1 !== 'нет' || params.railingSide_2 !== 'нет' || params.railingSide_2 !== 'нет') isGoodFact = true;
					break;
				case 'hasWinderTurn':
					if (params.stairModel == 'П-образная с забегом' || params.stairModel == 'Г-образная с забегом' || params.stairModel == 'П-образная трехмаршевая' && (params.turnType_1 == 'забег' || params.turnType_2 == 'забег')) isGoodFact = true;
					break;
				case 'hasPlatformTurn':
					if (params.stairModel == 'П-образная с площадкой' || params.stairModel == 'Г-образная с площадкой' || params.stairModel == 'П-образная трехмаршевая' && (params.turnType_1 == 'площадка' || params.turnType_2 == 'площадка')) isGoodFact = true;
					break;
				case 'hasStartTreads':
					if (params.startTreadAmt > 0) isGoodFact = true;
					break;
				case 'hasTimberParts':
					if (	['нет', 'рифленая сталь', 'лотки', 'дпк', 'пресснастил', 'стекло'].indexOf(params.stairType) == -1 || 
							['массив', 'ПВХ', 'сосна', 'береза', 'лиственница', 'дуб паркет.', 'дуб ц/л'].indexOf(params.handrail) != -1 || 
							params.calcType == 'timber' || params.calcType == 'timber_stock'){
						isGoodFact = true;
					} 
					break;
				case 'hasMetalParts':
					if (	['рифленая сталь', 'лотки', 'пресснастил'].indexOf(params.stairType) != -1 || 
							['массив', 'ПВХ', 'сосна', 'береза', 'лиственница', 'дуб паркет.', 'дуб ц/л', 'нет'].indexOf(params.handrail) == -1 || 
							params.calcType !== 'timber' || params.calcType !== 'timber_stock' || params.calcType !== 'geometry'){
						isGoodFact = true;
					} 
					break;
				case 'hasMetalParts':
					if (params.turnType1 == 'забег' || params.turnType2 == 'забег') isGoodFact = true;
					break;
			}
			if (isGoodFact) generatedFacts.push({name: buildFactText(fact.name), description: buildFactText(fact.description), image: fact.image});
		}else{
			generatedFacts.push({name: buildFactText(fact.name), description: buildFactText(fact.description), image: fact.image});
		}
	});

	return generatedFacts;
}

function getHandrailProfile(){
	var handrailPar = {
		prof: params.handrailProf,
		sideSlots: params.handrailSlots,
		handrailType: params.handrail,
	}
		
	handrailPar = calcHandrailMeterParams(handrailPar);
	return handrailPar.profY + "x" + handrailPar.profZ;
}

function buildFactText(text){
	var regex = /{{(.*?)}}/;
	if ( regex.test(text) ) {
		var iterator = 0;
		do {
			iterator++;
			regex.test(text);
			text = text.replace(regex, eval(RegExp.$1));
		} while (regex.test(text) && iterator < 100);
	}
	return text
}

/** функция выводит все варианты фактов **/

function printAllFacts(){
	var text = "<table class='tab_2'><tbody>\
		<tr>\
			<th>Название</th>\
			<th>Группа</th>\
			<th>Блок</th>\
			<th>Факт</th>\
			<th>Условие</th>\
		</tr>";
	$.each(factBlocks, function(){
		text += 
			"<tr>\
				<td>" + this.name + "</td>\
				<td>" + this.group + "</td>\
				<td>" + this.block + "</td>\
				<td>" + this.description + "</td>\
				<td>" + this.value + "</td>\
			</tr>";
	})

	text += "</tbody></table>";
	
	return text;
}
