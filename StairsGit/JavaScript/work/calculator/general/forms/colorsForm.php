<table class="form_table" id="colorsFormTable"><tbody>
		
<?php 
	
	//справочники
	$timberTypes = file_get_contents($GLOBALS['ROOT_PATH']."/calculator/general/forms/timberTypes.php");
	$timberPaint = file_get_contents($GLOBALS['ROOT_PATH']."/calculator/general/forms/timberPaint.php");
	$timberColors = file_get_contents($GLOBALS['ROOT_PATH']."/calculator/general/forms/timberColors.php");
	
	$metalTypes = file_get_contents($GLOBALS['ROOT_PATH']."/calculator/general/forms/metalTypes.php");
	$metalPaint = file_get_contents($GLOBALS['ROOT_PATH']."/calculator/general/forms/metalPaint.php");
	$metalColors = file_get_contents($GLOBALS['ROOT_PATH']."/calculator/general/forms/metalColors.php");

	$pvcTypes = '<option value="ПВХ">ПВХ</option>';
	$pvcPaint = '<option value="нет">нет</option>';
	$pvcColors = file_get_contents($GLOBALS['ROOT_PATH']."/calculator/general/forms/pvcColors.php");
	
	//тип расчета
	if(strpos($_SERVER["REQUEST_URI"], "metal")) $calcType = "metal";
	if(strpos($_SERVER["REQUEST_URI"], "mono")) $calcType = "mono";
	if(strpos($_SERVER["REQUEST_URI"], "timber")) $calcType = "timber";
	if(strpos($_SERVER["REQUEST_URI"], "vhod")) $calcType = "vhod";
	if(strpos($_SERVER["REQUEST_URI"], "railing")) $calcType = "railing";
	if (isset($GLOBALS['IS_YII']) && $GLOBALS['IS_YII']) $calcType = $GLOBALS['CALCULATOR_CONFIG']['calc_type'];

	
	//метаданные
	$meta = array();
	$item = [
		'id' => 'Material',
		'name' => 'Материал',
		'type' => 'select',
		'values' => [
			'timber' => $timberTypes,
			'metal' => $metalTypes,
			'pvc' => $pvcTypes,
			],		
	];
	$meta[] = $item;
	
	$item = [
		'id' => 'Type',
		'name' => 'Тип',
		'type' => 'select',
		'values' => [
			'timber' => "",
			'metal' => "",
			],
	];
	//$meta[] = $item;
	
	$item = [
		'id' => 'Painting',
		'name' => 'Покраска',
		'type' => 'select',
		'values' => [
			'timber' => $timberPaint,
			'metal' => $metalPaint,
			'pvc' => $pvcPaint,
			],
	];
	//$meta[] = $item;
	
	$item = [
		'id' => 'Color',
		'name' => 'Цвет',
		'type' => 'select',		
		'values' => [
			'timber' => $timberColors,
			'metal' => $metalColors,
			'pvc' => $pvcColors,
			],
	];
	$meta[] = $item;
	
	$item = [
		'id' => 'Comment',
		'name' => 'Комментарий',
		'type' => 'textarea',
		'values' => "",
	];
	$meta[] = $item;
	
	//детали лестницы и ограждения
	
	$elements = array();
	
	$item = [
		'id' => 'stringers',
		'name' => 'Тетивы/косоуры',
		'material' => "timber",
	];
	if($calcType == "timber") $elements[] = $item;
	
	$item = [
		'id' => 'carcas',
		'name' => 'Каркас',
		'material' => "metal",
	];
	if($calcType != "timber") $elements[] = $item;
	
	$item = [
		'id' => 'treads',
		'name' => 'Ступени',
		'material' => "timber",
	];
	$elements[] = $item;
	
	$item = [
		'id' => 'risers',
		'name' => 'Подступенки',
		'material' => "timber",
	];
	if($calcType != "mono") $elements[] = $item;
	
	$item = [
		'id' => 'skirting',
		'name' => 'Плинтус',
		'material' => "timber",
	];
	if($calcType != "mono") $elements[] = $item;
	
	$item = [
		'id' => 'newells',
		'name' => 'Столбы дер.',
		'material' => "timber",
	];
	$elements[] = $item;
	
	$item = [
		'id' => 'timberBal',
		'name' => 'Балясины дер.',
		'material' => "timber",
	];
	$elements[] = $item;
	
	$item = [
		'id' => 'metalBal',
		'name' => 'Ограждения',
		'material' => "metal",
	];
	if($calcType == "timber") $item['name'] = 'Балясины мет.';
	$elements[] = $item;
	
	$item = [
		'id' => 'rigels',
		'name' => 'Ригели мет.',
		'material' => "metal",
	];
	//if($calcType != "timber") $elements[] = $item;
	
	$item = [
		'id' => 'handrails',
		'name' => 'Поручни дер.',
		'material' => "timber",
	];
	$elements[] = $item;
	
	$item = [
		'id' => 'handrails_met',
		'name' => 'Поручни мет.',
		'material' => "metal",
	];
	//if($calcType != "timber") $elements[] = $item;
	
	$item = [
		'id' => 'handrails_pvc',
		'name' => 'Поручни ПВХ',
		'material' => "pvc",
	];
	if($calcType != "timber") $elements[] = $item;
	
	//накладки
	$item = [
		'id' => 'stringerCover',
		'name' => 'Накладки',
		'material' => "metal",
	];
	if($calcType == "metal") $elements[] = $item;

	// Доп объекты металл
	$item = [
		'id' => 'additionalObjectsMetal',
		'name' => 'Доп объекты металл',
		'material' => "metal",
	];
	$elements[] = $item;


	// Доп объекты дерево
	$item = [
		'id' => 'additionalObjectsTimber',
		'name' => 'Доп объекты дерево',
		'material' => "timber",
	];
	$elements[] = $item;

	if ($calcType == 'railing') {
		$elements = array_filter($elements, function($v, $k) {
			return $v['id'] == 'treads' || $v['id'] == 'risers' || $v['id'] == 'skirting';
		}, ARRAY_FILTER_USE_BOTH);
	}
	
	//заголовки таблицы
	$formText = "<tr><th>Элемент</th>";	
	foreach($meta as $item){
		$formText .= "<th>".$item['name']."</th>";
	}
	$formText .= "</tr>";
	
	//тело таблицы

	
		
	foreach($elements as $elem){
		$formText .= "<tr id='".$elem['id']."Params' data-mat='".$elem['material']."'>
			<td>".$elem['name']."</td>";
		
		foreach($meta as $prop){
			$formText .= "<td><".$prop['type']." id='".$elem['id'].$prop['id']."' class='" . $prop['id'] . "'>";
			if(is_array($prop['values'])){
				$formText .= $prop['values'][$elem['material']];
			};
			$formText .= "</".$prop['type']."></td>";
		};
		$formText .= "</tr>";
	};
	echo $formText;
?>

		
</tbody> </table>
