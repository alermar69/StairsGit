<?php	
	// Подключаем файл содержащий номер ревизии, для сброса кэша
	include $GLOBALS['ROOT_PATH']."/revision.php";

	if (!isset($revision)) {
		$revision = '';
	}
 	if (!(isset($GLOBALS['IS_YII']) && $GLOBALS['IS_YII'])) {
		//модуль
		$calc_type = getCalcType();
		//представление
		$template = getTemplate();
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
			'only_for' => ['metal', 'bolz', 'console', 'vhod','veranda', 'vint'],
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
			'only_for' => ['railing', 'vint'],
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
			'only_for' => ['bolz', 'console', 'metal', 'mono', 'timber', 'railing', 'timber_stock', 'vint'],
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
		[
			'url' => '/manufacturing/carport/pool.js',
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
		],
		
		//coupe
		[
			'url' => '/manufacturing/coupe/wrLib.js',
			'only_for' => ['coupe'],
		],
		[
			'url' => '/manufacturing/coupe/drawWardrobe.js',
			'only_for' => ['coupe'],
		],
		[
			'url' => '/manufacturing/coupe/drawWardrobeParts.js',
			'only_for' => ['coupe'],
		],
		[
			'url' => '/calculator/coupe/modelActions.js',
			'only_for' => ['coupe'],
		],
		
		
		
		//sideboard
		[
			'url' => '/manufacturing/sideboard/drawSideboard.js',
			'only_for' => ['sideboard'],
		],
		[
			'url' => '/manufacturing/sideboard/drawCarcas.js',
			'only_for' => ['sideboard'],
		],
		[
			'url' => '/manufacturing/sideboard/drawContent.js',
			'only_for' => ['sideboard'],
		],
		[
			'url' => '/manufacturing/sideboard/drawDimensions.js',
			'only_for' => ['sideboard'],
		],

		// Функция для деталей мебели
		[
			'url' => '/manufacturing/general/drawFurnitureParts.js'
		],

		[
			'url' => '/calculator/general/content/materials.js'
		],
		
	]);

	if ($calc_type != 'wardrobe_2' && $calc_type != 'slabs' && $calc_type != 'custom' && $calc_type != 'fire_2') {
		$scripts[] = [
			'url' => "/$template/general/main.js"
		];
	}

	//специфические скрипты для модулей
	
	if($calc_type != 'objects'){
		$scripts[] = [
				'url' => '/calculator/'.$calc_type.'/priceCalc.js',
			];
	};

	if(($template == 'calculator' || $template == 'customers') && $calc_type != 'geometry' && $calc_type != 'wardrobe_2' && $calc_type != 'objects' && $calc_type != 'carport'){
		$scripts[] = [
			'url' => '/calculator/' . $calc_type . '/change_offer.js',
		];
	};

	if ($calc_type == 'fire_2') {
		$scripts[] = [
			'url' => '/manufacturing/fire_2/drawStaircase.js',
		];
		$scripts[] = [
			'url' => '/calculator/general/draw2DLib.js',
		];
		$scripts[] = [
			'url' => '/calculator/fire_2/change_offer.js',
		];
		$scripts[] = [
			'url' => '/calculator/fire_2/priceCalc.js',
		];
		$scripts[] = [
			'url' => '/manufacturing/fire_2/calcSpec.js',
		];
		$scripts[] = [
			'url' => '/manufacturing/fire_2/calc_spec_2.0.js',
		];
		$scripts[] = [
			'url' => '/'.$template.'/' . $calc_type . '/main.js',
		];
	}

	if($calc_type == 'wardrobe'){
		$scripts[] = [
			'url' => 'priceCalc.js',
		];
		
		$scripts[] = [
			'url' => '/manufacturing/wardrobe/drawWardrobe.js',
		];
		/*
		$scripts[] = [
			'url' => '/manufacturing/wardrobe/drawWardrobeParts.js',
		];
		*/
		$scripts[] = [
			'url' => 'main.js',
		];
	};
	
	$scripts[] = ['url' => "/calculator/general/modals/forgedBals.js"];
	$scripts[] = ['url' => "/calculator/general/modals/textures.js"];
	
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

	if ($calc_type == 'fire_2') {
		$formScripts = [];
		$formScripts['carcas'] = ["/calculator/fire_2/forms/carcas_form_change.js", "/calculator/fire_2/forms/assemblingFormChange.js"];
	}
	
	if ($calc_type == 'carport') {
		$formScripts = [
			'dimensions' => ["/calculator/general/forms/dimensionsFormChange.js"],
			'objects' => ["/calculator/general/forms/objects/objectsFormChange.js"],
			'assembling' => ["/calculator/general/forms/assemblingFormChange.js"],
			'walls' => ["/calculator/walls/forms/walls_form_change.js"],
			'banister' => ["/calculator/banister/forms/banister_construct_form_change.js", "/calculator/banister/forms/changeFormBanister.js"],
		];
	}
	
	if ($calc_type == 'veranda') {
		$formScripts = [
			'dimensions' => ["/calculator/general/forms/dimensionsFormChange.js"],
			'objects' => ["/calculator/general/forms/objects/objectsFormChange.js"],
			'assembling' => ["/calculator/general/forms/assemblingFormChange.js"],
			'walls' => ["/calculator/walls/forms/walls_form_change.js"],
			'banister' => ["/calculator/banister/forms/banister_construct_form_change.js", "/calculator/banister/forms/changeFormBanister.js"],
		];
	}

	if ($calc_type == 'wardrobe_2' || $calc_type == 'objects') {
		$formScripts = [
			'dimensions' => ["/calculator/general/forms/dimensionsFormChange.js"],
			'objects' => ["/calculator/general/forms/objects/objectsFormChange.js"],
			'assembling' => ["/calculator/general/forms/assemblingFormChange.js"],
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

	if($calc_type == 'slabs'){
		$scripts[] = ["url" => "/calculator/slabs/main.js"];
	};

	if($calc_type == 'custom'){
		$scripts[] = ["url" => "/calculator/custom/main.js"];
	};

	if($calc_type == 'objects'){
		$scripts[] = ["url" => "/calculator/objects/drawObjects.js"];
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