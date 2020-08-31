<?php	
	// Подключаем файл содержащий номер ревизии, для сброса кэша
	include $GLOBALS['ROOT_PATH']."/revision.php";

	if (!isset($revision)) {
		$revision = '';
	}
 	if (!(isset($GLOBALS['IS_YII']) && $GLOBALS['IS_YII'])) {
	//выцепляем модуль и представление из url
	
		$url = 'https://' . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
		
		//модуль

		$calc_types = ['bolz', 'console', 'metal', 'mono', 'railing', 'timber', 'timber_stock', 'vhod', 'vint', 'geometry', 'wardrobe', 'curve', 'wardrobe_2', 'objects', 'carport', 'veranda', 'slabs', 'table', 'sill'];

		$calc_type = '';
		foreach($calc_types as $item){
			if (strpos($url,'/'.$item) !== false) $calc_type = $item;
		};
		
		//представление
		$templates = ['calculator', 'manufacturing', 'installation', 'customers'];
		$template = '';
		foreach($templates as $item){
			if (strpos($url,'/'.$item) !== false) $template = $item;
		};
	}else{
		$calc_type = $GLOBALS['CALCULATOR_CONFIG']['calc_type'];
		$template = $GLOBALS['CALCULATOR_CONFIG']['template'];
	}

	$scripts = [];
	//общие библиотеки
	include $GLOBALS['ROOT_PATH']."/calculator/general/libs_man.php";

	$scripts = array_merge($scripts, [
		//metal
		[
			'url' => '/manufacturing/metal/ladderRailing.js',
			'only_for' => ['metal'],
		],
		[
			'url' => '/manufacturing/metal/drawSvg.js',
			'only_for' => ['metal', 'bolz', 'console','vhod','veranda'],
		],
		[
			'url' => '/manufacturing/metal/drawStaircase.js',
			'only_for' => ['metal', 'bolz', 'console'],
		],
		[
			'url' => '/manufacturing/metal/drawCarcasParts.js',
			'only_for' => ['metal', 'vint', 'bolz', 'console', 'vhod','veranda'],
		],
		[
			'url' => '/manufacturing/metal/drawCarcasPartsLib_2.0.js',
			'only_for' => ['metal', 'bolz', 'console', 'vhod','veranda'],
		],
		[
			'url' => '/manufacturing/metal/drawRailing_3.0.js',
			'only_for' => ['metal', 'bolz', 'console', 'vhod','veranda'],
		],
		[
			'url' => '/manufacturing/metal/drawStringerPartsLt.js',
			'only_for' => ['metal', 'vint', 'bolz', 'console', 'vhod','veranda'],
		],
		[
			'url' => '/manufacturing/metal/drawStringerPartsKo.js',
			'only_for' => ['metal', 'vint', 'bolz', 'console', 'vhod','veranda'],
		],
		[
			'url' => '/manufacturing/metal/drawCarcas.js',
			'only_for' => ['metal', 'vint', 'bolz', 'console', 'vhod','veranda'],
		],
		[
			'url' => '/manufacturing/metal/drawFrames.js',
			'only_for' => ['metal', 'vint', 'bolz', 'console', 'vhod', 'vint', 'geometry','veranda'],
		],
		[
			'url' => '/manufacturing/metal/drawStringers.js',
			'only_for' => ['metal', 'vint', 'bolz', 'console', 'vhod','veranda'],
		],
		[
			'url' => '/manufacturing/metal/testing.js',
			'only_for' => ['metal', 'bolz', 'console', 'console', 'vhod'],
		],
		[
			'url' => '/manufacturing/metal/calcSpec.js',
			'only_for' => ['bolz', 'console', 'metal', 'vhod','veranda'],
		],
		
		//bolz
		[
			'url' => '/manufacturing/bolz/drawCarcas.js',
			'only_for' => ['bolz'],
		],
		[
			'url' => '/manufacturing/bolz/drawCarcasParts.js',
		'only_for' => ['bolz', 'vint'],
		],
		[
			'url' => '/manufacturing/bolz/drawRailing.js',
			'only_for' => ['bolz'],
		],
		
		//mono
		[
			'url' => '/manufacturing/mono/testing.js',
			'only_for' => ['mono'],
		],
		[
			'url' => '/manufacturing/mono/drawSvg.js',
			'only_for' => ['mono'],
		],
		[
			'url' => '/manufacturing/mono/drawStaircase.js',
			'only_for' => ['mono'],
		],
		[
			'url' => '/manufacturing/mono/drawCarcasParts.js',
			'only_for' => ['mono'],
		],
		[
			'url' => '/manufacturing/mono/drawStringerPartsMk.js',
			'only_for' => ['mono'],
		],
		[
			'url' => '/manufacturing/mono/drawCarcasPartsLib_2.2.js',
			'only_for' => ['mono'],
		],
		[
			'url' => '/manufacturing/mono/drawCarcas.js',
			'only_for' => ['mono'],
		],
		[
			'url' => '/manufacturing/mono/drawStringers.js',
			'only_for' => ['mono'],
		],
		[
			'url' => '/manufacturing/mono/drawRailing_3.0.js',
			'only_for' => ['console', 'mono'],
		],
		[
			'url' => '/manufacturing/mono/calcSpec.js',
			'only_for' => ['mono'],
		],
		[
			'url' => '/manufacturing/curve/drawCarcasParts.js',
			'only_for' => ['mono'],
		],
		//mono
		
		//console
		[
			'url' => '/manufacturing/console/drawCarcas.js',
			'only_for' => ['console'],
		],
		[
			'url' => '/manufacturing/console/drawCarcasParts.js',
			'only_for' => ['console'],
		],
		//railing
		[
			'url' => '/manufacturing/railing/drawStaircase.js',
			'only_for' => ['railing'],
		],
		[
			'url' => '/manufacturing/railing/concreteStairs.js',
			'only_for' => ['railing'],
		],
		[
			'url' => '/manufacturing/railing/drawRailing.js',
			'only_for' => ['railing'],
		],
		[
			'url' => '/manufacturing/railing/testing.js',
			'only_for' => ['railing'],
		],
		//timber
		[
			'url' => '/manufacturing/timber/drawStaircase.js',
			'only_for' => ['timber'],
		],
		[
			'url' => '/manufacturing/timber/drawCarcasParts.js',
			'only_for' => ['timber', 'timber_stock', 'geometry'],
		],
		[
			'url' => '/manufacturing/timber/drawStringerParts.js',
			'only_for' => ['timber', 'timber_stock'],
		],
		[
			'url' => '/manufacturing/timber/drawNewell.js',
			'only_for' => ['timber'],
		],
		[
			'url' => '/manufacturing/timber/drawCarcas.js',
			'only_for' => ['timber'],
		],
		[
			'url' => '/manufacturing/timber/drawRailing.js',
			'only_for' => ['bolz', 'console', 'metal', 'mono', 'timber', 'timber_stock', 'vint'],
		],
		[
			'url' => '/manufacturing/timber/calcSpec.js',
			'only_for' => ['timber'],
		],
		[
			'url' => '/manufacturing/timber/testing.js',
			'only_for' => ['timber'],
		],
		//timber_stock
		[
			'url' => '/manufacturing/timber_stock/drawStaircase.js',
			'only_for' => ['timber_stock'],
		],
		[
			'url' => '/manufacturing/timber_stock/drawCarcas.js',
			'only_for' => ['timber_stock','geometry'],
		],
		[
			'url' => '/manufacturing/timber_stock/drawSvg.js',
			'only_for' => ['timber_stock'],
		],
		[
			'url' => '/manufacturing/timber_stock/calcSpec.js',
			'only_for' => ['timber_stock'],
		],
		[
			'url' => '/manufacturing/timber_stock/testing.js',
			'only_for' => ['timber_stock'],
		],
		[
			'url' => '/calculator/timber_stock/forms/stockFormsChange.js',
			'only_for' => ['timber_stock'],
		],
		//vhod
		[
			'url' => '/manufacturing/vhod/drawStaircase.js',
			'only_for' => ['vhod'],
		],
		[
			'url' => '/manufacturing/vhod/drawVhodStock.js',
			'only_for' => ['vhod'],
		],
		[
			'url' => '/manufacturing/vhod/calcSpec.js',
			'only_for' => ['vhod'],
		],
		[
			'url' => '/calculator/metal/priceCalc.js',
			'only_for' => ['vhod', 'veranda'],
		],
			
		//vint
		[
			'url' => '/manufacturing/vint/draw_vint.js',
			'only_for' => ['vint'],
		],
		[
			'url' => '/manufacturing/vint/drawRailing.js',
			'only_for' => ['vint'],
		],
		[
			'url' => '/manufacturing/vint/drawCarcasParts.js',
			'only_for' => ['vint'],
		],
		[
			'url' => '/manufacturing/vint/calcSpec.js',
			'only_for' => ['vint'],
		],
		[
			'url' => '/manufacturing/vint/testing.js',
			'only_for' => ['vint'],
		],
		[
			'url' => '/manufacturing/vint/drawTreads.js',
			'only_for' => ['vint'],
		],
		[
			'url' => '/manufacturing/vint/drawCarcas.js',
			'only_for' => ['vint'],
		],
		
		//geometry
		[
			'url' => '/calculator/geometry/drawStaircase.js',
			'only_for' => ['geometry'],
		],
		
		[
			'url' => '/calculator/geometry/drawDimensions.js',
			'only_for' => ['geometry'],
		],
		
		[
			'url' => '/calculator/geometry/draw2DLib.js',
			'only_for' => ['geometry'],
		],

		// carport
		[
			'url' => '/manufacturing/carport/drawCarport.js',
			'only_for' => ['carport', 'veranda'],
		],
		[
			'url' => '/manufacturing/carport/drawTruss.js',
			'only_for' => ['carport', 'veranda'],
		],
		[
			'url' => '/manufacturing/carport/calcCarportParams.js',
			'only_for' => ['carport', 'veranda'],
		],
		[
			'url' => '/manufacturing/carport/drawCarportParts.js',
			'only_for' => ['carport', 'veranda'],
		],
		[
			'url' => '/manufacturing/carport/calcSpec.js',
			'only_for' => ['carport'],
		],
		[
			'url' => '/calculator/carport/forms/main_form_change.js',
			'only_for' => ['carport'],
		],
		[
			'url' => '/calculator/veranda/forms/main_form_change.js',
			'only_for' => ['veranda'],
		],
		[
			'url' => '/calculator/slabs/forms/mainFormChange.js',
			'only_for' => ['slabs'],
		],
		[
			'url' => '/calculator/carport/modelActions.js',
			'only_for' => ['carport'],
		],
		[
			'url' => '/manufacturing/carport/testing.js',
			'only_for' => ['carport'],
		],
		
		// veranda
		[
			'url' => '/manufacturing/veranda/drawVeranda.js',
			'only_for' => ['veranda'],
		],		
		[
			'url' => '/calculator/carport/priceCalc.js',
			'only_for' => ['veranda'],
		],
		
		// slabs
		[
			'url' => '/manufacturing/slabs/slabs.js',
			'only_for' => ['slabs'],
		],
		
		//table
		[
			'url' => '/manufacturing/table/drawTable.js',
			'only_for' => ['table'],
		],
		[
			'url' => '/manufacturing/table/drawTableParts.js',
			'only_for' => ['table'],
		],
		
		//sill
		[
			'url' => '/manufacturing/sill/drawSill.js',
			'only_for' => ['sill'],
		],
		[
			'url' => '/manufacturing/sill/drawSillParts.js',
			'only_for' => ['sill'],
		],
		[
			'url' => '/calculator/sill/forms/mainFormChange.js',
			'only_for' => ['sill'],
		],

		//knowledge
		[
			'url' => '/calculator/general/content/knowledge.js'
		]
	]);

	if ($calc_type != 'wardrobe_2' && $calc_type != 'objects') {
		$scripts[] = [
			'url' => "/$template/general/main.js"
		];
	}

	//специфические скрипты для модулей
	
	if(($template == 'calculator' || $template == 'customers') && $calc_type != 'geometry' && $calc_type != 'wardrobe_2' && $calc_type != 'objects'){
		$scripts[] = [
				'url' => '/calculator/'.$calc_type.'/priceCalc.js',
			];
		$scripts[] = [
				'url' => '/calculator/'.$calc_type.'/forms/templates.js',
			];
	};

	if(($template == 'calculator' || $template == 'customers') && $calc_type != 'geometry' && $calc_type != 'wardrobe_2' && $calc_type != 'objects' && $calc_type != 'carport'){
		$scripts[] = [
				'url' => '/calculator/' . $calc_type . '/change_offer.js',
			];
	};

	if($calc_type == 'wardrobe'){
		$scripts[] = [
			'url' => 'priceCalc.js',
		];
		$scripts[] = [
			'url' => 'drawWardrobe.js',
		];
		$scripts[] = [
			'url' => 'drawWardrobeParts.js',
		];
		$scripts[] = [
			'url' => 'drawWardrobe.js',
		];
		$scripts[] = [
			'url' => 'main.js',
		];
	};
	
	$scripts[] = ['url' => "/calculator/general/modals/forgedBals.js"];
	
	//формы
	$formScripts = [
		'carcas' => ["/calculator/startTreads/forms/formChange.js", "/calculator/metal/forms/carcas_form_change.js"],
		'railing' => ["/calculator/metal/forms/railing_form_change.js"],
		'banister' => ["/calculator/banister/forms/banister_construct_form_change.js", "/calculator/banister/forms/changeFormBanister.js"],
		'assembling' => ["/calculator/general/forms/assemblingFormChange.js"],
		'geom' => ["/calculator/geometry/forms/calculator_form_change.js"],
		'walls' => ["/calculator/walls/forms/walls_form_change.js"],
		'dimensions' => ["/calculator/general/forms/dimensionsFormChange.js"],
		'objects' => ["/calculator/general/forms/objects/objectsFormChange.js"]
	];

	if($calc_type == 'mono') $formScripts['carcas']  = ["/calculator/mono/forms/carcas_form_change.js", "/calculator/startTreads/forms/formChange.js"];

	if($calc_type == 'timber' || $calc_type == 'timber_stock'){
		$formScripts['carcas'] = ["/calculator/timber/forms/carcas_form_change.js", "/calculator/startTreads/forms/formChange.js"];
		$formScripts['railing'] = ["/calculator/timber/forms/railing_form_change.js"];
	};
	if($calc_type == 'vhod'){
		$formScripts['carcas'] = ["/calculator/vhod/forms/carcas_form_change.js"];
		$formScripts['railing'] = ["/calculator/metal/forms/railing_form_change.js"];
	};
	if($calc_type == 'vint'){
		$formScripts['carcas'] = ["/calculator/vint/forms/changeFormVint.js"];
	};

	if($calc_type == 'geometry'){
		$formScripts['carcas'] = ["/calculator/geometry/forms/carcas_form_change.js"];
	};

	if ($calc_type == 'railing') {
		$formScripts['railing'] = ['/calculator/railing/forms/railingFormChange.js'];
	}
	
	if ($calc_type == 'carport') {
		$formScripts = [
			'dimensions' => ["/calculator/general/forms/dimensionsFormChange.js"],
			'objects' => ["/calculator/general/forms/objects/objectsFormChange.js"],
			'assembling' => ["/calculator/general/forms/assemblingFormChange.js"],
			'banister' => ["/calculator/banister/forms/banister_construct_form_change.js", "/calculator/banister/forms/changeFormBanister.js"],
		];
	}
	
	if ($calc_type == 'veranda') {
		$formScripts = [
			'dimensions' => ["/calculator/general/forms/dimensionsFormChange.js"],
			'objects' => ["/calculator/general/forms/objects/objectsFormChange.js"],
			'assembling' => ["/calculator/general/forms/assemblingFormChange.js"],
			'banister' => ["/calculator/banister/forms/banister_construct_form_change.js", "/calculator/banister/forms/changeFormBanister.js"],
		];
	}

	if ($calc_type == 'wardrobe_2' || $calc_type == 'objects') {
		$formScripts = [
			'dimensions' => ["/calculator/general/forms/dimensionsFormChange.js"],
			'objects' => ["/calculator/general/forms/objects/objectsFormChange.js"],
		];
	}


	
	foreach ($formScripts as $script) {
		foreach ($script as $script_url) {
			$scripts[] = ['url' => $script_url];
		}
	}

	if (isset($GLOBALS['IS_YII']) && $GLOBALS['IS_YII']) {
		$scripts[] = ["url" => "/orders/calcs/actions.js"];
		$scripts[] = ["url" => "/calculator/general/exportOrderData.js"];
	}

	if($calc_type == 'wardrobe_2'){
		$scripts[] = ["url" => "/calculator/wardrobe_2/main.js"];
	};

	if($calc_type == 'objects'){
		$scripts[] = ["url" => "/calculator/objects/main.js"];
	};

	//вывод скриптов на страницу
	foreach($scripts as $script){
		$printScript = true;
		if(isset($script['only_for']) && !in_array($calc_type, $script['only_for'])) $printScript = false;
		if($printScript){
			if (!(isset($GLOBALS['IS_YII']) && $GLOBALS['IS_YII'])) {
				echo '<script type="text/javascript" src="' . $script['url'] . '?revision='.$revision.'"></script>';
			}else{
				$GLOBALS['CALCULATOR_SCRIPTS'][] = $script['url'];
			}
		};
	};
	
	if (!(isset($GLOBALS['IS_YII']) && $GLOBALS['IS_YII'])) {
		echo '<link rel="stylesheet" href="/calculator/general/styles.css">';
	}
	


	
?>