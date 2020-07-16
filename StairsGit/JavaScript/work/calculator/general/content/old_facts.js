// Файл нигде не подключается, создан для хранения данных, которые в будущем могут понадобится
var factBlocks = [
	{
		'name': 'учитываем что лестницей будут пользоваться дети и пожилые люди',
		'only_for': ['marsh', 'vint'],
		'group': 'geometry'
	},
	{
		'name': 'учитываем габаритную высоту',
		'description': 'Много пространство над головой - так называемый Габарит G. Он составляет 2498мм. Этого значения достаточно для комфортного перемещения по лестницы людям любого роста. У вас не будет создаваться ощущение, что можно удариться головой о перекрытие',
		'image': 'https://thumb.tildacdn.com/tild6664-3561-4635-b366-353365393231/-/resize/260x/-/format/webp/__2020-04-04__235657.png',
		'only_for': ['marsh', 'vint'],
		'group': 'geometry'
	},
	{
		'name': 'достаточная ширина марша',
		'description': 'Ширина маршей составляет {{params.M}}мм, благодаря чему на лестнице могут спокойно разойтись двое и более людей. Так же есть возможность комфортно поднимать/спускать мебель или другие крупногабаритные предметы.',
		'image': 'https://thumb.tildacdn.com/tild3466-3166-4838-b034-663837306361/-/resize/260x/-/format/webp/esli-vynesti-mebel-n.jpg',
		'only_for': ['marsh', 'vint'],
		'group': 'geometry'
	},
	{
		'name': 'наличие площадки',
		'description': 'Наличие площадки между маршами - обеспечивает еще более удобный подъем, поскольку на площадке ноги отдыхают между маршами. К тому же наличие площадки позволяет более рационально использовать пространство под лестницей, например вы можете поставить шкаф или просто удобно складировать вещи под лестницей.',
		'image': 'https://thumb.tildacdn.com/tild6439-3463-4262-b530-376432623034/-/resize/260x/-/format/webp/raschet-povorota-les.png',
		'condition': 'hasPlatformTurn',
		'only_for': ['marsh'],
		'group': 'geometry'
	},
	{
		'name': 'наличие забега',
		'description': 'Проект лестницы включает забежные ступени - это позволяет существенно уменьшить используемое пространство, благодаря чему лестница отлично впишется в вашу обстановку.',
		'image': 'https://thumb.tildacdn.com/tild6661-3463-4438-b533-613431623339/-/resize/260x/-/format/webp/__2020-04-04__235328.png',
		'condition': 'hasWinderTurn',
		'only_for': ['marsh'],
		'group': 'geometry'
	},
	{
		'name': 'при расчете параметров ступеней учитываем формулу шага',
		'image': 'https://thumb.tildacdn.com/tild3833-6662-4761-b837-373430393534/-/resize/260x/-/format/webp/__2020-04-04__234607.png',
		'only_for': ['marsh'],
		'group': 'geometry'
	},
	{
		'name': 'Продумываем удобство подхода и выхода с лестницы',
		'description': 'Удобный заход и выход с лестницы обеспечен наличием достаточного места до стен. Эти параметры составяют не менее ширины марша.',
		'image': 'https://thumb.tildacdn.com/tild3161-3232-4838-b563-313132393566/-/resize/260x/-/format/webp/__2020-04-05__000728.png',
		'condition': 'hasStartTreads',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'geometry'
	},

	{
		'name': 'подбираем геометрию лестницы под обстановку',
		'description': 'Проект лестницы мы разработали специально под размеры и обстановку вашего помещения. В результате лестница получилась максимально пологой и при этом она не занимает много места',
		'image': 'https://thumb.tildacdn.com/tild6337-3632-4637-b530-363566393138/-/resize/260x/-/format/webp/__2020-04-04__234903.png',
		'only_for': ['marsh', 'vint'],
		'group': '3d'
	},
	{
		'name': 'учитываем расположение окон, промов, батарей и т.п.',
		'only_for': ['marsh', 'vint'],
		'group': '3d'
	},
	{
		'name': 'прочные надежные ограждения',
		'condition': 'hasRailings',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'description'
	},

	{
		'name': 'Не используем пластиковые детали - только натуральные прочные материалы',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'description'
	},
	{
		'name': 'не экономим на материале - используем толстую сталь и деревянные детали делаются полнотелые из массива',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'description'
	},
	{
		'name': 'специальный износостойких итальянский лак для дерева',
		'condition': 'hasTimberParts',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'description'
	},
	{
		'name': 'порошковая покраска металла',
		'condition': 'hasMetalParts',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},
	{
		'name': 'усиленные болты высокого класса прочности',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'description'
	},
	{
		'name': 'контроль толщины слоя краски на производстве',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},
	{
		'name': 'покраска дерева в несколько слоев',
		'condition': 'hasTimberParts',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},
	{
		'name': 'отработанная конструкция',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'description'
	},
	{
		'name': 'контроль влажности матерала перед запуском в работу',
		'condition': 'hasTimberParts',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},
	{
		'name': 'используем пиломатериал камерной сушки 8%',
		'condition': 'hasTimberParts',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},
	{
		'name': 'только новый металл - не используем лежалый или ржавый',
		'condition': 'hasMetalParts',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},
	{
		'name': 'обрабатываем силиконом те стыки, где может возникнуть скрип',
		'condition': 'hasTimberParts',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},
	{
		'name': 'Используем химические анкерные системы для крепления к обстановке',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},
	{
		'name': 'хранение материала и готового изделия в отапливаемом помещении',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},
	{
		'name': 'высокая точность деталей и отсутствие люфтов в соединениях',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'description'
	},
	{
		'name': 'есть специальные решения для деревянных домов, подверженных усадке',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'description'
	},

	{
		'name': 'не используем дсп, мдф и другие ненатуральные материалы',
		'condition': 'hasTimberParts',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'description'
	},
	{
		'name': 'покраска металла порошковой краской с нулевой эмиссией летучих веществ',
		'condition': 'hasMetalParts',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'description'
	},
	{
		'name': 'экологичный итальянский лак',
		'condition': 'hasTimberParts',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'description'
	},
	{
		'name': 'покраска на производстве - привозим уже полностью готовые высушенные детали',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},
	{
		'name': 'гладкие поверхности, легко убирать пыль',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'description'
	},
	{
		'name': 'не вызывает аллергии',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'description'
	},

	{
		'name': 'При проектировании учитываем как будет использоваться пространство под лестницей',
		'only_for': ['marsh'],
		'group': 'geometry'
	},
	// {
	// 	'name': 'Продумываем удобство подхода и выхода с лестницы',
	// 	'only_for': ['marsh', 'vint'],
	// 	'group': 'geometry'
	// },
	{
		'name': 'ограждения с боковым креплением чтобы не заужать марш',
		'only_for': ['marsh', 'vint'],
		'group': 'description'
	},

	{
		'name': 'большой ассортимент конструкций и материалов - подберем вариант в ваш бюджет',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'price'
	},
	{
		'name': 'есть возможность самостоятельной покраски и сборки чтобы сэкономить',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'price'
	},
	{
		'name': 'есть возможность поэтапного заказа',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},
	{
		'name': 'цена считается заранее и не может поменяться в процессе работы',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'price'
	},
	{
		'name': 'все непредвиденные работы включены в цену',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'price'
	},
	{
		'name': 'делаем 3 варианта расчета в разной комплектации чтобы можно было выбрать наиболее подходящий именно для Вас',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'price'
	},

	{
		'name': 'замер в удобное время в том числе в выходные',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},
	{
		'name': 'привезем в удобное время',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},
	{
		'name': 'заранее согласовываем все действия на объекте',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},
	{
		'name': 'сначала звоним, потом едем',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},
	{
		'name': 'можем сделать срочные заказы от 3 дней',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'price'
	},
	{
		'name': 'возможность монтажа вечером или ночью при необходимости',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},
	{
		'name': 'дата выхода лестницы с производства заранее известна',
		'only_for': ['marsh', 'vint'],
		'group': 'production'
	},
	{
		'name': 'подстроим свой график работы под ваших строителей или мебельщиков',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},
	{
		'name': 'реализация заказа в один или несколько этапов',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},

	{
		'name': 'минимальный аванс только за часть материалов',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'price'
	},
	{
		'name': 'возможность приемки лестницы на нашем производстве перед оплатой',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},
	{
		'name': 'оплата работ по окончании',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},
	{
		'name': 'работы застрахованы',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},
	{
		'name': 'можно приехать на производство и посмотреть качество готовых заказов',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},

	{
		'name': 'делаем несколько вариантов дизайн-проекта',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},
	{
		'name': 'бесплатно приедем с образцами',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},
	{
		'name': 'возможность рассчитать и сделать 3D модель Вашей лестницы прямо на замере в Вашем присутствии за 10-15 минут',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},
	{
		'name': 'информируем Вас о ходе реализации проекта и планируемой дате готовности',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},
	{
		'name': 'персональный менеджер',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},
	{
		'name': 'будем предлагать разные варианты дизайн-проектов до тех пор, пока Вам не понравится',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},
	{
		'name': 'делаем расчет и несколько вариантов дизайн-проекта за 1-2 дня',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},
	{
		'name': 'можем приехать на замер на следующий день после звонка в удобное для вас время',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'production'
	},

	{
		'name': 'опытные консультанты',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'about'
	},
	{
		'name': 'база знаний и регулярное обучение всех сотрудников',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'about'
	},
	{
		'name': 'менеджер разбирается в материалах, дизайне, удобстве',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'about'
	},
	{
		'name': 'специальная программа для расчета максимально удобной лестницы',
		'only_for': ['marsh', 'vint'],
		'group': 'about'
	},
	{
		'name': 'работаем со всеми материалами, подберем под Ваши задачи и бюджет',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'about'
	},
	{
		'name': '14 серий лестниц, охватывающие практически все возможные варианты конструкции',
		'only_for': ['marsh', 'vint'],
		'group': 'about'
	},
	{
		'name': 'больше 5 тысяч выполненных проектов',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'about'
	},

	{
		'name': 'в каталоге 14 серий от эконома до элит, выбрать дешевле',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'price'
	},
	{
		'name': 'цена каждой лестниицы зависит от комплектации - можно выбрать комплектацию попроще',
		'only_for': ['marsh', 'vint'],
		'group': 'price'
	},
	{
		'name': 'растянуть заказ во времени, сначала заказать каркас + ступени, как накопите деньги - заказать ограждения',
		'only_for': ['marsh', 'vint'],
		'group': 'price'
	},
	{
		'name': 'выбрать породу дерева дешевле',
		'condition': 'hasTimberParts',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'price'
	},
	{
		'name': 'монтаж своими силами',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'price'
	},
	{
		'name': 'покраска дерева своими силами',
		'condition': 'hasTimberParts',
		'only_for': ['marsh', 'vint', 'railing'],
		'group': 'price'
	}
]