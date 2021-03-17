<?php
	if (!isset($GLOBALS['IS_YII']) || !$GLOBALS['IS_YII']) {
		//модуль
		$calc_type = getCalcType();
		//представление
		$template = getTemplate();
	}else{
		$calc_type = $GLOBALS['CALCULATOR_CONFIG']['calc_type'];
		$template = $GLOBALS['CALCULATOR_CONFIG']['template'];
		echo '<script>var IS_YII = true;</script>';
	}

	//верхняя часть страницы
	$title = "Лестница на металлокаркасе";
	if($calc_type == 'bolz') $title = "Лестница на больцах";
	if($calc_type == 'console') $title = "Консольная лестница";
	if($calc_type == 'metal') $title = "Лестница на металлокаркасе";
	if($calc_type == 'mono') $title = "Лестница на монокосоуре";
	if($calc_type == 'railing') $title = "Ограждения";
	if($calc_type == 'timber') $title = "Деревянная лестница";
	if($calc_type == 'timber_stock') $title = "Деревянная лестница";
	if($calc_type == 'vhod') $title = "Входная лестница";
	if($calc_type == 'vint') $title = "Винтовая лестница";
	if($calc_type == 'geometry') $title = "Расчет геометрии лестницы";
	if($calc_type == 'wardrobe') $title = "Расчет шкафа";
	if($calc_type == 'wardrobe_2') $title = "Расчет шкафа 2.0";
	if($calc_type == 'objects') $title = "Расчет объектов";
	if($calc_type == 'carport') $title = "Расчет навеса";
	if($calc_type == 'veranda') $title = "Расчет веранды";
	if($calc_type == 'table') $title = "Расчет стола";
	if($calc_type == 'sill') $title = "Расчет подоконников";
	if($calc_type == 'slabs') $title = "Коммерческое предложение";
	if($calc_type == 'fire_2') $title = "Коммерческое предложение";
	if($calc_type == 'coupe') $title = "Шкаф купе";
	if($calc_type == 'sideboard') $title = "Комод";

	//тип расчета и версия
	echo '
		<div id="calcInfo" style="display: none">
			<input id="calcType" type="text" value="' . $calc_type . '">
			<input id="calcVersion" type="text" value="4.2" >
		</div>
		';
	// Контейнер для Iframe'ов изолирующих код
	echo '<div id="isolationIframes" style="width: 0px; height: 0px;position: absolute;width: 1px;height: 1px;opaciy: 0;"></div>';
	if($template != 'customers' && !(isset($GLOBALS['IS_YII']) && $GLOBALS['IS_YII'])) echo '<h1 id="mainTitle" contenteditable="true">' . $title . '</h1>';

	//форма параметров заказа
	if($template == 'customers') {
		echo '<div class="d-none">';
		include $GLOBALS['ROOT_PATH']."/calculator/general/forms/orderForm.php";
		echo '</div>';
	};

	//Просто форма для модулей без визуализации
	if ($calc_type == 'slabs' || $calc_type == 'fire_2' || $calc_type == 'custom') {
		include $GLOBALS['ROOT_PATH']."/calculator/general/forms/orderForm.php";
	}

	//пошаговый конфигуратор лестницы и менеджер картинок
	$ignor_calc_types = ['railing', 'geometry', 'wardrobe', 'wardrobe_2', 'carport', 'objects', 'slabs', 'fire_2'];
	if ($template == 'calculator' && !in_array($calc_type, $ignor_calc_types) && !(isset($GLOBALS['IS_YII']) && $GLOBALS['IS_YII'])) {
		include $GLOBALS['ROOT_PATH']."/calculator/general/forms/master/main.php";
	}
	
	//экспресс-расчет для подоконников
	if ($template == 'calculator' && $calc_type == "objects" && !(isset($GLOBALS['IS_YII']) && $GLOBALS['IS_YII'])) {
		include $GLOBALS['ROOT_PATH']."/calculator/general/forms/master/objects.php";
	}
	
	if($template != 'customers' && $calc_type != 'slabs' && $calc_type != 'custom' && $calc_type != 'fire_2') {
		if (!(isset($GLOBALS['IS_YII']) && $GLOBALS['IS_YII'])) {
			//Форма параметров заказа
			include $GLOBALS['ROOT_PATH']."/calculator/general/forms/orderForm.php";
		}

		//визуализация
		echo
			'<div class="loader-block" id="loaderBlock">
				<div class="transition-loader">
					<div class="transition-loader-inner">
						<label></label>
						<label></label>
						<label></label>
						<label></label>
						<label></label>
						<label></label>
					</div>
				</div>
			</div>
			<div id="visualisation" class="printBlock">
				<h2 class="raschet" onclick="recalculate();">Общий вид:</h2>
				<div id="Stats-output" style="display: none;"></div>
				<div id="WebGL-output"><canvas>Для отображения содержимого откройте страницу в Гугл Хром</canvas></div>
			</div>
			<div id="svg" style="display: none;width: 1000px;height:1050px;position: relative;">
				<div class="image_container" style="position: absolute;width: 1000px;height: 1000px;margin-top: 50px;;left: 0;top: 0;"></div>
				<button id="saveSvg" class="btn btn-outline-primary">Сохранить SVG</button>
				<button id="saveDxf" class="btn btn-outline-primary">Сохранить DXF</button>
			</div>
			';

		echo "<div class='dropdown-menu dropdown-menu-sm' id='objectContextMenu'></div>";

		//кнопки под визуализацией
		if($template == 'calculator') {
			echo '<div class="noPrint mainButtons">';
			if ($calc_type != 'objects') {
				echo	'<button id="open_master_modal" class="btn btn-outline-primary">Конфигуратор</button>';
			}
			
			if ($calc_type == 'objects') {
				echo '<button id="open_master_modal_obj" class="btn btn-outline-primary">Конфигуратор</button>';
			}

			echo	'<button id="sendMessageModalShow" class="btn btn-outline-primary">Отправить КП</button>
					<button onclick="saveCanvasImg(0)" class="btn btn-outline-secondary">Сохранить png</button>
					
				</div>
				<div id="images"></div>';

			//параметры геометрии
			echo
				'<div class="printBlock" id="geomDescrWrapper">
					<h2>Геометрия</h2>
					<div id="geomDescr"></div>
					<div id="geometryFacts" style="width: 100vw;"></div>
				</div>
				';
		};

		if($template == 'manufacturing') {
			echo
			'<div class="noPrint mainButtons">
				<button id="cloneCanvas" onclick="cloneCanvas()">Дублировать</button>
				<button onclick="saveCanvasImg(0)">Сохранить png</button>
			</div>
			<div class="printBlock" id="geomDescrWrapper">
				<h2>Геометрия</h2>
				<div id="geomDescr"></div>
			</div>
			<div id="images"></div>';
		};

		if($template == 'installation') {
			echo
				'<div class="noPrint">
					<button id="toggleAll">Развернуть</button>
				</div>';
		};

	};

	//Содержимое вкладок

	//формы
	$tabs = [
		'price' => [
				'name' => 'Цены',
				'url' => '/calculator/general/price_tab.php',
				'group' => 'data'
			],
		'carcas' => [
				'name' => 'Лестница',
				'url' => '/calculator/metal/forms/carcas_form.php',
				'group' => 'form',
				'scripts' => ["/calculator/startTreads/forms/formChange.js", "/calculator/metal/forms/carcas_form_change.js"]
			],
		'railing' => [
				'name' => 'Ограждения',
				'url' => '/calculator/metal/forms/railing_form.php',
				'group' => 'form',
				'scripts' => ["/calculator/metal/forms/railing_form_change.js"]
			],
		'banister' => [
			'name' => 'Балюстрада',
			'url' => '/calculator/banister/forms/banister_form.php',
			'group' => 'form',
			'scripts' => ["/calculator/banister/forms/banister_construct_form_change.js"]
			],
		'assembling' => [
				'name' => 'Установка',
				'url' => '/calculator/general/forms/assemblingForm.php',
				'group' => 'form',
				'scripts' => ["/calculator/general/forms/assemblingFormChange.js"]
			],
		'comments' => [
				'name' => 'Комментарии',
				'url' => '/calculator/general/forms/comments.php',
				'group' => 'form',
			],
		'geom' => [
				'name' => 'Геометрия',
				'url' => '/calculator/geometry/forms/calculator_form.php',
				'class' => 'noPrint',
				'scripts' => ["/calculator/geometry/forms/calculator_form_change.js"],
				'group' => 'form',
			],
		'floor_form' => [
				'name' => 'Проем',
				'url' => '/calculator/walls/forms/floor_form.php',
				'class' => 'noPrint',
				'group' => 'form',
			],

		'walls' => [
				'name' => 'Стены',
				'url' => '/calculator/walls/forms/walls_form.php',
				'class' => 'noPrint',
				'group' => 'form',
				'scripts' => ["/calculator/walls/forms/walls_form_change.js"]
			],
	];

	if ($template != 'customers') {
		$tabs = array_merge(["menu"=>[
			'name' => 'Меню',
			'url' => '/calculator/general/forms/menu_form.php',
			'class' => 'noPrint',
			'group' => 'form',
		]],  $tabs);
	}

	if (isset($GLOBALS['MULTI']) && $GLOBALS['MULTI']) {
		$tabs['multi'] = [
			'name' => 'Этаж',
			'url' => '/calculator/general/forms/multi.php',
			'group' => 'form',
		];
	}

	if($calc_type == 'bolz'){
		$tabs['carcas']['url']  = "/calculator/bolz/forms/carcas_form.php";
	};
	if($calc_type == 'console'){
		$tabs['carcas']['url']  = "/calculator/console/forms/carcas_form.php";
	};
	if($calc_type == 'mono'){
		$tabs['carcas']['url']  = "/calculator/mono/forms/carcas_form.php";
		$tabs['carcas']['scripts']  = ["/calculator/mono/forms/carcas_form_change.js", "/calculator/startTreads/forms/formChange.js"];
	};
	if($calc_type == 'railing'){
		
		$tabs['geom'] = false;
		$tabs['carcas'] = false;
		$tabs['banister'] = false;
		$tabs['railing']['url'] = "/calculator/railing/forms/railing_config.php";
		$tabs['railing']['scripts']  = ["/calculator/banister/forms/banister_construct_form_change.js"];
		
		//форма параметров комплектации ограждений
		$tabs['railing'] = [
			'name' => 'Комплектация',
			'url' => '/calculator/railing/forms/railing_config.php',
			'group' => 'form',
			'scripts' => ["/calculator/banister/forms/banister_construct_form_change.js"]
		];
		
		//Форма ввода параметров бетонных лестниц
		$tabs['stairs_geom'] = [
			'name' => 'Бетон',
			'url' => '/calculator/railing/forms/stairs_geom.php',
			'class' => 'noPrint',
			'group' => 'form',
		];

		//форма параметров ограждений
		$tabs['railing_geom'] = [
			'name' => 'Секции',
			'url' => '/calculator/railing/forms/railing_geom.php',
			'group' => 'form',
		];

		//рутели
		$tabs['rutelMoove'] = [
			'name' => 'Рутели',
			'url' => '/calculator/railing/forms/rutelMoove.php',
			'class' => 'noPrint',
			'group' => 'form',
		];
		
		//обшивка бетона
		$tabs['treads_config'] = [
			'name' => 'Обшивка',
			'url' => '/calculator/railing/forms/treads_config.php',
			'group' => 'form',
		];

	};
	
	if($calc_type == 'timber' || $calc_type == 'timber_stock'){
		$tabs['carcas']['url']  = "/calculator/timber/forms/carcas_form.php";
		$tabs['carcas']['scripts'] = ["/calculator/timber/forms/carcas_form_change.js", "/calculator/startTreads/forms/formChange.js"];
		$tabs['railing']['url'] = "/calculator/timber/forms/railing_form.php";
		$tabs['railing']['scripts'] = ["/calculator/timber/forms/railing_form_change.js"];
	};
	if($calc_type == 'vhod'){
		$tabs['geom'] = false;
		$tabs['carcas']['url']  = "/calculator/vhod/forms/carcas_form.php";
		$tabs['carcas']['scripts'] = ["/calculator/vhod/forms/carcas_form_change.js"];
		$tabs['railing']['url'] = "/calculator/vhod/forms/railing_form.php";
		$tabs['railing']['scripts'] = ["/calculator/metal/forms/railing_form_change.js"];
	};
	if($calc_type == 'vint'){
		$tabs['geom']["url"] = "/calculator/vint/forms/vint_geometry_form.php";
		$tabs['carcas']['url']  = "/calculator/vint/forms/vint_carcas_form.php";
		$tabs['carcas']['scripts'] = ["/calculator/vint/forms/changeFormVint.js"];
		$tabs['railing']['url']  = "/calculator/vint/forms/vint_railing_form.php";
	};

	if($calc_type == 'geometry'){
		$tabs['price'] = false;
		$tabs['carcas']['url']  = "/calculator/geometry/forms/carcas_form.php";
		$tabs['carcas']['scripts'] = ["/calculator/geometry/forms/carcas_form_change.js"];
		$tabs['railing'] = false;
		$tabs['banister'] = false;
		$tabs['assembling'] = false;
		$tabs['comments'] = false;
	};
	
	if ($calc_type == 'carport') {
		$tabs['geom'] = false;
		$tabs['carcas']['name'] = "Навес";
		$tabs['carcas']['url'] = "/calculator/carport/forms/main_form.php";
		$tabs['banister']['url'] = "/calculator/banister/forms/banister_construct_form.php";
		$tabs['railing'] = false;
		$tabs['floor_form'] = false;
		//$tabs['walls'] = false;
	};

	if ($calc_type == 'veranda') {
		$tabs['geom'] = false;
		$tabs['carcas']['name'] = "Площадка";
		$tabs['carcas']['url'] = "/calculator/veranda/forms/platform_form.php";
		//$tabs['railing']['scripts'] = ["/calculator/metal/forms/railing_form_change.js"];
		//$tabs['railing'] = false;
		$tabs['floor_form'] = false;
		$tabs['walls'] = false;
		
		//лестница
		$tabs['staircase'] = [
			'name' => 'Лестница',
			'url' => "/calculator/veranda/forms/stairs_form.php",
			'group' => 'form',
		];
		
		//кровля
		$tabs['roof'] = [
			'name' => 'Кровля',
			'url' => "/calculator/veranda/forms/roof_form.php",
			'group' => 'form',
		];
		
	};
	
	
		
	if ($calc_type == 'slabs') {
		$tabs['geom'] = false;
		$tabs['carcas'] = false;
		$tabs['banister'] = false;
		$tabs['railing'] = false;
		$tabs['banister'] = false;
		$tabs['railing'] = false;
		$tabs['floor_form'] = false;
		$tabs['walls'] = false;
		$tabs['assembling'] = false;
		
		// calculator/slabs/forms/main.php
		//главная форма
		$tabs['slabs'] = [
			'name' => 'Изделия',
			'url' => '/calculator/slabs/forms/main.php',
			'group' => 'data', //выводим в теле страницы
		];
	};

	if ($calc_type == 'fire_2') {
		$tabs['geom'] = false;
		$tabs['carcas'] = false;
		$tabs['banister'] = false;
		$tabs['railing'] = false;
		$tabs['floor_form'] = false;
		$tabs['walls'] = false;
		$tabs['assembling'] = false;
		
		if ($template == 'calculator') {
			$tabs['main'] = [
				'name' => 'Описание',
				'url' => '/calculator/fire_2/content/main.php',
				'group' => 'data', //выводим в теле страницы
			];
		}else{
			$tabs['main'] = [
				'name' => 'Описание',
				'url' => '/manufacturing/fire_2/main.php',
				'group' => 'data', //выводим в теле страницы
			];
		}
	};

	if ($calc_type == 'custom') {
		$tabs['geom'] = false;
		$tabs['carcas'] = false;
		$tabs['banister'] = false;
		$tabs['railing'] = false;
		$tabs['floor_form'] = false;
		$tabs['walls'] = false;
		$tabs['assembling'] = false;
		
		//главная форма
		$tabs['main'] = [
			'name' => 'Изделия',
			'url' => '/calculator/custom/forms/mainForm.php',
			'group' => 'data', //выводим в теле страницы
		];

		$tabs['cost'] = [
			'name' => 'Себестоимость',
			'url' => '/calculator/custom/forms/costForm.php',
			'group' => 'data', //выводим в теле страницы
		];
	};
	
	if ($calc_type == 'table') {
		$tabs['geom'] = false;
		$tabs['carcas']['name'] = "Стол";
		$tabs['carcas']['url'] = "/calculator/table/forms/mainForm.php";
		$tabs['banister'] = false;
		$tabs['railing'] = false;
		$tabs['floor_form'] = false;
		$tabs['walls'] = false;
	};
	
	if ($calc_type == 'sill') {
		$tabs['geom'] = false;
		$tabs['carcas'] = false;
		$tabs['banister'] = false;
		$tabs['railing'] = false;
	};
	
	if ($calc_type == 'sideboard') {
		$tabs['geom'] = false;
		$tabs['carcas']['name'] = "Комод";
		$tabs['carcas']['url'] = "/calculator/sideboard/forms/mainForm.php";
		$tabs['banister'] = false;
		$tabs['railing'] = false;
		
		$tabs['sbTemplates'] = [
			'name' => 'Шаблоны',
			'url' => '/calculator/sideboard/templates.php',
			'group' => 'form',
		];
		
	};
	
	if ($calc_type == 'coupe') {
		$tabs['geom'] = false;
		$tabs['carcas']['name'] = "Шкаф";
		$tabs['carcas']['url'] = "/calculator/coupe/forms/main_form.php";
		$tabs['banister'] = false;
		$tabs['railing'] = false;
		
		$tabs['wrSect'] = [
			'name' => 'Секции',
			'url' => '/calculator/coupe/forms/wrSect.php',
			'group' => 'form',
		];
		
		$tabs['wrContent'] = [
			'name' => 'Полки',
			'url' => '/calculator/coupe/forms/wrContent.php',
			'group' => 'form',
		];
		
		$tabs['wrDoors'] = [
			'name' => 'Двери',
			'url' => '/calculator/coupe/forms/wrDoors.php',
			'group' => 'form',
		];
	};
	
	


		

	//убираем геометрию где она не нужна
	if($template != 'manufacturing' && $template != 'calculator'){
		$tabs['geom']['class'] = 'd-none';
	};

	//файлы заказа и типовые чертежи
	if($template != 'customers' && !(isset($GLOBALS['IS_YII']) && $GLOBALS['IS_YII'])){
		$tabs['files'] = [
				'name' => 'Файлы',
				'url' => '/orders/files/orderFiles.php',
				'class' => 'noPrint',
				'group' => 'data',
			];
	};

	//svg и dxf чертежи
	if($template == 'manufacturing'){
		$tabs['drawings'] = [
				'name' => 'Чертежи',
				'url' => '/manufacturing/general/include_areas/svg_drawings.php',
				//'class' => 'noPrint',
				'group' => 'data',
			];
	};

	if($template != 'customers' && !(isset($GLOBALS['IS_YII']) && $GLOBALS['IS_YII'])){
		$tabs['drawings2'] = [
				'name' => 'Эскизы',
				'url' => '/calculator/geometry/forms/drawings.php',
				'group' => 'data',
			];
	};

	//описание лестницы
	if($template == 'calculator'){
		$tabs['descrBlocks'] = [
			'name' => 'Описание',
			'url' => '/calculator/general/content/descriptionBlocks.php',
			'group' => 'data',
		];
		$tabs['descr'] = [
			'name' => 'Описание',
			'url' => '/calculator/general/content/description.php',
			'group' => 'data',
		];
		$tabs['knowledge_previews'] = [
			'name' => 'Примеры работ',
			'url' => '/calculator/general/content/knowledge_previews.php',
			'group' => 'data',
		];
	};
	if ($calc_type != 'wardrobe_2') {
		include $GLOBALS['ROOT_PATH']."/calculator/general/content/templates.php";
	}

	if($calc_type == 'vint'){
		$tabs['geom_params'] = [
				'name' => 'Параметры',
				'url' => '/calculator/vint/content/geom_params.php',
				'group' => 'data',
			];

	};
	
	if($calc_type == 'coupe'){
		$tabs['geom_params'] = [
				'name' => 'Параметры',
				'url' => '/calculator/coupe/forms/geom_params.php',
				'group' => 'data',
			];

	};
	

	//цены
	if($template != 'calculator'){
		$tabs['price'] = false;
	};

	if ($calc_type != 'slabs') {
		//себестоимость
		$tabs['cost'] = [
			'name' => 'Себестоимость',
			'url' => '/calculator/general/forms/cost.php',
			'class' => 'd-none',
			'group' => 'data',
		];
	}

	if($template == 'calculator') $tabs['cost']['class'] = 'noPrint';
	// if($calc_type == 'railing') $tabs['cost']['url'] = '/calculator/railing/forms/cost.php';

	//тесты
	if(($template == 'calculator' || $template == 'manufacturing') && !(isset($GLOBALS['IS_YII']) && $GLOBALS['IS_YII'])){
		$tabs['testing'] = [
				'name' => 'Тесты',
				'url' => '/manufacturing/general/testing/forms/mainForm.php',
				'class' => 'noPrint',
				'group' => 'form',
			];
	};

	//спецификация
	if($template == 'manufacturing'){
		$tabs['spec'] = [
				'name' => 'Спецификация',
				'url' => '/manufacturing/general/include_areas/spec.php',
				//'class' => 'noPrint',
				'group' => 'data',
			];
	};

	//данные для производства
	if (!(isset($GLOBALS['IS_YII']) && $GLOBALS['IS_YII'])) {
		$tabs['production'] = [
			'name' => 'Производство',
			'url' => '/manufacturing/general/include_areas/production_data.php',
			//'class' => 'noPrint',
			'group' => 'data',
		];
	}

	if($template == 'customers' || $template == 'calculator') $tabs['production']['class'] = 'd-none';

	//параметры обстановки

	$tabs['dimensions'] = [
		'name' => 'Размеры',
		'url' => '/calculator/general/forms/dimensionsForm.php',
		'class' => 'noPrint',
		'group' => 'form',
	];

	$tabs['textures'] = [
		'name' => 'Текстуры',
		'url' => '/calculator/general/textures/form.php',
		'class' => 'noPrint',
		'group' => 'form',
	];



	if($template == 'customers'){
		$tabs['dimensions']['class'] = 'd-none';
		$tabs['textures']['class'] = 'd-none';
		$tabs['floor_form']['class'] = 'd-none';
		$tabs['walls']['class'] = 'd-none';
	};

	$tabs['objects'] = [
		'name' => 'Объекты',
		'url' => '/calculator/general/forms/objects/form.php',
		'class' => 'noPrint',
		'group' => 'form',
	];

	if ($calc_type == 'wardrobe') {
		$tabs['price'] = "/calculator/wardrobe/forms/price.php";
		$tabs['carcas']  = false;//"/calculator/wardrobe/forms/main_form.php";
		$tabs['railing'] = false;
		$tabs['banister'] = false;
		$tabs['assembling'] = false;
		$tabs['comments'] = false;
		$tabs['geom'] = false;
		$tabs['testing'] = false;

		$tabs = array_merge(
			array_slice($tabs, 0, 1),
			[
				'wardrobe' => [
					'name' => 'Шкаф',
					'url' => '/calculator/wardrobe/forms/main_form.php',
					'group' => 'form'
				],
				'wardrobe_content' => [
					'name' => 'Полки',
					'url' => '/calculator/wardrobe/forms/wrContent.php',
					'group' => 'form'
				]
			],
			array_slice($tabs, 1)
		);
	}

	if ($calc_type == 'wardrobe_2') {
		$tabs = [
			"menu"=>[
				'name' => 'Меню',
				'url' => '/calculator/general/forms/menu_form.php',
				'class' => 'noPrint',
				'group' => 'form',
			],
			"form"=>[
				'name' => 'Секции',
				'url' => '/calculator/wardrobe_2/form.php',
				'class' => 'noPrint',
				'group' => 'form'
			],
			'objects' => [
				'name' => 'Объекты',
				'url' => '/calculator/general/forms/objects/form.php',
				'class' => 'noPrint',
				'group' => 'form',
			]
		];
	}

	if ($calc_type == 'objects') {
		$tabs['carcas']  = false;//"/calculator/wardrobe/forms/main_form.php";
		$tabs['railing'] = false;
		$tabs['banister'] = false;
		$tabs['geom'] = false;
	}
	
	$ignor_calc_types = ['geometry', 'wardrobe', 'wardrobe_2', 'carport', 'slabs',  'custom', 'fire_2'];
	
	if (!in_array($calc_type, $ignor_calc_types) ) {
		$tabs["materials"] = [
			'name' => 'Материалы',
			'url' => "/calculator/general/forms/materialsForm.php",
			'group' => 'form'
		];
	}

	//формируем вкладки для вывода на страницу
	$form_nav = '<nav><div class="nav nav-pills" id="nav-tab" role="tablist">';
	$form_body = '<div class="tab-content mainForm" id="nav-tabContent">';

	if($template == 'customers') $form_body = '<div class="tab-content" id="nav-tabContent">';

	$data_body = '';
	//$data_nav = '<nav class="topMenu navbar fixed-top navbar-expand-lg navbar-light bg-light nav-pills noPrint">

	$data_nav = '<nav class="topMenu navbar fixed-top navbar-expand-md navbar-light bg-light">
		<div>
			<div class="row">
				<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>

		<div id="priceItemsSelectWrap"></div>
		<div class="collapse navbar-collapse" id="navbarSupportedContent">
		<span class="nav-item dropdown">
			<a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Ссылки</a>
			<div class="dropdown-menu">
				<a class="dropdown-item" href="/" target="_blank">Главная</a>
				<a class="dropdown-item" href="/calculator/" target="_blank">Все расчеты</a>
				<div class="dropdown-divider"></div>
				<a class="dropdown-item" href="#" id="customerLink" target="_blank">Клиенту</a>
				<a class="dropdown-item" href="#" id="comLink" target="_blank">КП</a>
				<a class="dropdown-item" href="#" id="manLink" target="_blank">Производство</a>
				<a class="dropdown-item" href="#" id="montLink" target="_blank">Монтаж</a>
				<a class="dropdown-item" href="#" id="docLink" target="_blank">Договор</a>
				<a class="dropdown-item" href="#" id="filesLink" target="_blank">Файлы</a>
			</div>
		</span>
		<span class="nav-item dropdown">
			<a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Вид</a>
			<div class="dropdown-menu">
				<span class="dropdown-item toggleViewTemplate" data-view_type="editing">Редактирование</span>
				<span class="dropdown-item toggleViewTemplate" data-view_type="print">Печать</span>
				<span class="dropdown-item toggleViewTemplate" data-view_type="construction_task">Строительное задание</span>
			</div>
		</span>
		<span class="nav-item dropdown">
			<a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Действия</a>
			<div class="dropdown-menu">
				<span class="dropdown-item" id="makeSnapshot">Снимок</span>
				<span class="dropdown-item"  id="validate">Проверить</span>
				<span class="dropdown-item"  id="compareModalShow">Сравнить с другим</span>';

			if($template == 'calculator'){
				$data_nav .= '<span class="dropdown-item"  id="makeAccepted">Привязать к заказу</span>';
			};
			$data_nav .= '
				<span class="dropdown-item"  onclick="exportToObj(scene);">Сохранить OBJ</span>
				<span class="dropdown-item"  id="saveIntoFile">Сохранить в файл</span>
				<span class="dropdown-item"  onclick="$(\'#loadFile\').click();">Загрузить из файла</span>
				<p><input type="file" accept="text/json" id="loadFile" style="display:none"></p>
			</div>
		</span>
		<a class="nav-item nav-link" id="nav-visualisation" href="#visualisation">Модель</a>
		';


	$isFirst = true; //первая вкладка

	foreach($tabs as $key=>$val){
		if($val){
			$class = "";
			if(isset($val['class']) && $val['class']) $class = $val['class'];

			if(isset($val['group']) && $val['group'] == 'form'){
				if($isFirst) $class .= " active"; //первая вкладка активная
				$form_nav .= '<a class="nav-item nav-link ' . $class . '" id="nav-' . $key . '-tab" data-toggle="tab" href="#nav-' . $key . '" role="tab" aria-controls="nav-' . $key . '" aria-selected="true">' .
						$val['name'] . '</a>';
				$form_body .= '<div class="tab-pane fade show ' . $class . ' printBlock" id="nav-' . $key . '" role="tabpanel" aria-labelledby="nav-' . $key . '-tab">';
				//получаем содержимое файла формы с учетом вложенных include
				ob_start();
				include $GLOBALS['ROOT_PATH'].$val['url'];
				$form_body .= ob_get_contents();
				ob_end_clean();

				$form_body .= '</div>';

				$isFirst = false;
			};
			if(isset($val['group']) && $val['group'] == 'data'){
				$data_nav .= '<a class="nav-item nav-link ' . $class . '" id="nav-' . $key . '" href="#' . $key . '-sect">' . $val['name']. '</a>';

				if($key != "price") $class .= " printBlock";

				$data_body .= '<div id="' . $key . '-sect" class="' . $class . '">';
				ob_start();
				include $GLOBALS['ROOT_PATH'].$val['url'];
				$data_body .= ob_get_contents();
				ob_end_clean();

				$data_body .= '</div>';
			};
		};
	};

	$form_nav .= '</div></nav>';
	$form_body .= '</div>';
	//$data_nav .= '</nav>';
	$data_nav .= '</div></div></div></nav>';


	//вывод на страницу
	if($template != 'customers'){
		echo '<div>'.$data_nav . $data_body.'</div>';
		$recalculate_multi = '';
		if(isset($GLOBALS['MULTI']) && $GLOBALS['MULTI']) {
			$recalculate_multi = '
			<button class="btn btn-success d-none recalculatePrices">
				<i class="fa fa-refresh"></i>
				Обновить все
			</button>';
		}
		echo
			'<div class="panelWrap">
				<div class="panelResizer d-none"></div>
				<div class="panelHeader">
					<button class="btn btn-primary recalculate d-none">
						<i class="fa fa-refresh"></i>
						Обновить
					</button>
					'.$recalculate_multi.'

					<div id="panelToggle" class="btn btn-secondary btn-lg">
						<i class="fa fa-chevron-circle-left"></i>
					</div>
				</div>
				<div class="panelBody" style="display: none">' .
					$form_nav . $form_body .
				'</div>
			</div>';
	};

	if($template == 'customers'){
		echo "<br/>" . $form_nav . $form_body;
	};

	if (!(isset($GLOBALS['IS_YII']) && $GLOBALS['IS_YII'])) {
		//загрузка данных кп
		include $GLOBALS['ROOT_PATH']."/orders/calcs/getOrderData.php";
	}

	include $GLOBALS['ROOT_PATH']."/calculator/general/modals/forgedBals.php";
	include $GLOBALS['ROOT_PATH']."/calculator/general/modals/updateEditions.php";
	include $GLOBALS['ROOT_PATH']."/calculator/general/modals/snapshotModal.php";
	include $GLOBALS['ROOT_PATH']."/calculator/general/modals/shapeChangeModal.php";

	# Модалка предпросмотра dxf -  в ней подгружаются все скрипты
	include $_SERVER["DOCUMENT_ROOT"].'/orders/dxf-preview/modal.php';

	if ($template != 'customers') {
		include $GLOBALS['ROOT_PATH']."/calculator/general/modals/timberBals.php";
		include $GLOBALS['ROOT_PATH']."/calculator/general/modals/timberNewells.php";
		include $GLOBALS['ROOT_PATH']."/calculator/general/modals/startNewell.php";
		include $GLOBALS['ROOT_PATH']."/calculator/general/modals/textures.php";
		include $GLOBALS['ROOT_PATH']."/orders/mail/forms/mailModal.php";
		include $GLOBALS['ROOT_PATH']."/calculator/general/forms/partInfo.php";
	};

?>

<script>
	$(function(){
		// //отправка на печать
		// $("#print").click(function(){	

		// 	if($(this).text() == "Печать"){
		// 		//window.print();
		// 		$(this).text("Редактировать")
		// 		togglePrintMode(true);
		// 	}
		// 	else {
		// 		togglePrintMode(false);
		// 		$(this).text("Печать");
		// 	}
			
		// });
		//включение/выключение печати блоков
		$("body").delegate(".togglePrint", "click", function(){
			$(this).toggleClass("grey") //добавляем кнопке класс, чтобы можно было отличить блоки, отключенные пользователем
			$(this).closest('div.printBlock').toggleClass("noPrint").show();
		})
		
		//сворачивание, разворачивание панели
		$('#panelToggle').click(function(){
			var cond = $(".panelBody").css('display')
			
			//$(".panelBody").toggleClass("d-none");
			$(".panelBody").animate({width: 'toggle'}, 200);
			
			$(".panelWrap").toggleClass("visible");
			$(".panelResizer").toggleClass("d-none");
			$(".panelWrap button.recalculate").toggleClass("d-none");
			$(".panelWrap button.recalculatePrices").toggleClass("d-none");
			
			
			if(cond == "block") $("#panelToggle").html('<i class="fa fa-chevron-circle-left"></i>')
			else $("#panelToggle").html('<i class="fa fa-chevron-circle-right"></i>')
			
		});
		
		//ресайз
		$('.panelResizer').on('mousedown', function(e) {
			$(document).on('mousemove', resize);
			$(document).on('mouseup', finishResize);
			
			var $wrapper = $(".panelBody");
			var width = $wrapper.outerWidth(true);
			var left = $wrapper.offset().left;

			function resize(e) {
				
				$('body').css({'user-select': 'none'}) //отключаем выделение текста мышкой
				var delta = left - e.pageX;
				var newWidth = width + delta;

				$wrapper.css({
				'width': newWidth,
				'max-width': 'unset',
				});
				
			}

			function finishResize(e) {
				$('body').css({'user-select': 'auto'}) //включаем выделение текста мышкой
				$(document).off('mousemove', resize);
				$(document).off('mouseup', finishResize);
			}
			
			
		})
		

		
	});

	function getArrItemByProp(arr, prop, val){
		if(!arr || !prop) return false;
		
		for(var i=0; i<arr.length; i++){
			if(typeof arr[i] != 'undefined' && arr[i][prop] == val){
				return arr[i];
				}
			}
		return false;
	} //end of getItemById


	/** функция включает/выклчает режим печати на странице
	*/

	function togglePrintMode(printMode){
		
		if(printMode){
			$("body").addClass("print")
			
			//добавляем кнопочки во все блоки, если их еще нет
			if($(".togglePrint").length == 0) {
				$(".printBlock").prepend("<div class='togglePrint'><span class='fa fa-print'></span></div>");
			}
			
			//показываем те блоки, где печать была отключена пользователем
			$(".togglePrint.grey").closest("div.printBlock").show();
		}
		else{
			$("body").removeClass("print")
		}
		
		$(".mainButtons").show();
		
	}; //end of togglePrintMode

</script>

<!-- Всплывающее уведомление -->
<div class="toast" id="notifyToast" data-delay='4000' style="display: none; position: fixed; z-index: 999; top: 200px; left: 50px;">
  <div class="toast-header">
      <strong class="mr-auto" id='notifyTitle'>Уведомление</strong>
      <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">
          <span aria-hidden="true">&times;</span>
      </button>
  </div>
  <div class="toast-body" id='notifyContent'>
  </div>
</div>

<!--диалоговое окно-->
<div class="modal fade" id="editionsChangeForm">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">Модификация комплектаций</h4>
      </div>
	  
      <div class="modal-body">
        
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
        
      </div>
    </div><!-- /.модальное окно-Содержание -->  
  </div><!-- /.модальное окно-диалог -->  
</div><!-- /.модальное окно --> 