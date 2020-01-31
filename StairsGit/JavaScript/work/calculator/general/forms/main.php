<?php

	//выцепляем модуль и представление из url
	
	$url = 'https://' . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
	
	//модуль
	$calc_types = ['bolz', 'console', 'metal', 'mono', 'railing', 'timber', 'timber_stock', 'vhod', 'vint', 'geometry'];
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
	
	//тип расчета и версия
	echo '
		<div id="calcInfo" style="display: none">
			<input id="calcType" type="text" value="' . $calc_type . '">
			<input id="calcVersion" type="text" value="4.2" >
		</div>		
		';
	if($template != 'customers') echo '<h1 id="mainTitle" contenteditable="true">' . $title . '</h1>';
	
	//форма параметров заказа
	if($template == 'customers') {
		echo '<div class="d-none">';
		include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/orderForm.php";
		echo '</div>';
	};
	
	if($template != 'customers') {
	
		//Форма параметров заказа
		include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/orderForm.php";
		
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
			</div>';
		
		//кнопки под визуализацией
		if($template == 'calculator') {
			echo
				'<div class="noPrint mainButtons">
					<button id="sendMessageModalShow">Отправить КП</button>					
					<button id="cloneCanvas">Дублировать</button>
					<button id="loadSavedCams">Загрузить виды</button>
					<button id="resaveCam">Сохранить виды</button>
					<button onclick="saveCanvasImg(0)">Сохранить png</button>					
					<button id="print">Печать</button>
				</div>
				<div id="images"></div>';
			
			//параметры геометрии
			echo 
				'<div class="printBlock">
					<h2>Геометрия</h2>	
					<div id="geomDescr"></div>
				</div>
				';
		};
		
		if($template == 'manufacturing') {
			echo
			'<div class="noPrint mainButtons">
				<button id="cloneCanvas">Дублировать</button>				
				<button onclick="saveCanvasImg(0)">Сохранить png</button>				
				<button id="print">Печать</button>
			</div>
			<div id="images"></div>';
		};
		
		if($template == 'installation') {
			echo
				'<div class="noPrint">					
					<button id="createBuildingTask">Стр. задание</button>
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
				'group' => 'data',
			],
		'carcas' => [
				'name' => 'Лестница',
				'url' => '/calculator/metal/forms/carcas_form.php',
				'group' => 'form',
			],
		'railing' => [
				'name' => 'Ограждения',
				'url' => '/calculator/metal/forms/railing_form.php',
				'group' => 'form',
			],
		'banister' => [
			'name' => 'Балюстрада',
			'url' => '/calculator/banister/forms/banister_form.php',
			'group' => 'form',
			],
		'assembling' => [
				'name' => 'Установка',
				'url' => '/calculator/general/forms/assemblingForm.php',
				'group' => 'form',
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
	
	if($calc_type == 'bolz'){
		$tabs['carcas']['url']  = "/calculator/bolz/forms/carcas_form.php";
	};
	if($calc_type == 'console'){
		$tabs['carcas']['url']  = "/calculator/console/forms/carcas_form.php";
	};
	if($calc_type == 'mono'){
		$tabs['carcas']['url']  = "/calculator/mono/forms/carcas_form.php";
	};
	if($calc_type == 'railing'){
		$tabs['geom'] = false;
		$tabs['carcas'] = false;
		$tabs['banister'] = false;
		$tabs['railing']['url'] = "/calculator/railing/forms/railing_config.php";
	};
	if($calc_type == 'timber' || $calc_type == 'timber_stock'){
		$tabs['carcas']['url']  = "/calculator/timber/forms/carcas_form.php";
		$tabs['railing']['url'] = "/calculator/timber/forms/railing_form.php";
	};
	if($calc_type == 'vhod'){
		$tabs['geom'] = false;
		$tabs['carcas']['url']  = "/calculator/vhod/forms/carcas_form.php";
		$tabs['railing']['url'] = "/calculator/vhod/forms/railing_form.php";
	};
	if($calc_type == 'vint'){
		$tabs['geom'] = false;
		$tabs['carcas']['url']  = "/calculator/vint/forms/vint_form.php";
		$tabs['railing'] = false;
	};
	
	if($calc_type == 'geometry'){
		$tabs['price'] = false;
		$tabs['carcas']['url']  = "/calculator/geometry/forms/carcas_form.php";
		$tabs['railing'] = false;
		$tabs['banister'] = false;
		$tabs['assembling'] = false;
		$tabs['comments'] = false;
	};

	//убираем геометрию где она не нужна
	if($template != 'manufacturing' && $template != 'calculator'){
		$tabs['geom']['class'] = 'd-none';
	};
	
	//файлы заказа и типовые чертежи
	if($template != 'customers'){
		$tabs['files'] = [
				'name' => 'Файлы',
				'url' => '/calculator/general/orderFiles/orderFiles.php',
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
	
	if($template != 'customers'){
		$tabs['drawings2'] = [
				'name' => 'Эскизы',
				'url' => '/calculator/geometry/forms/drawings.php',
				'group' => 'data',
			];
	};
	
	//описание лестницы
	if($template == 'calculator'){
		$tabs['descr'] = [
				'name' => 'Описание',
				'url' => '/calculator/general/content/description.php',
				'group' => 'data',
			];
	};
	
	if($calc_type == 'vint'){
		$tabs['geom_params'] = [
				'name' => 'Параметры',
				'url' => '/calculator/vint/content/geom_params.php',
				'group' => 'data',
			];
		
	};
	
	
	//цены
	if($template != 'calculator'){
		$tabs['price'] = false;
	};
	
	//себестоимость
	$tabs['cost'] = [
			'name' => 'Себестоимость',
			'url' => '/calculator/general/forms/cost.php',
			'class' => 'd-none',
			'group' => 'data',
		];
	if($template == 'calculator') $tabs['cost']['class'] = 'noPrint';
	
	//тесты
	if($template == 'calculator' || $template == 'manufacturing'){
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

	$tabs['production'] = [
			'name' => 'Производство',
			'url' => '/manufacturing/general/include_areas/production_data.php',
			//'class' => 'noPrint',
			'group' => 'data',
		];
	
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
	
	if($calc_type == 'railing'){
		
		//Форма ввода параметров бетонных лестниц
		$tabs['stairs_geom'] = [
			'name' => 'Бетон',
			'url' => '/calculator/railing/forms/stairs_geom.php',
			'class' => 'noPrint',
			'group' => 'form',
		];
		
		//форма параметров ограждений
		$tabs['railing_geom'] = [
			'name' => 'Ограждения',
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
		
		//себестоимость
		$tabs['cost']['url'] = '/calculator/railing/forms/cost.php';
	}
	
	if($template == 'customers'){
		$tabs['dimensions']['class'] = 'd-none';
		$tabs['textures']['class'] = 'd-none';
		$tabs['floor_form']['class'] = 'd-none';
		$tabs['walls']['class'] = 'd-none';
	};
	

	//формируем вкладки для вывода на страницу
	$form_nav = '<nav><div class="nav nav-pills" id="nav-tab" role="tablist">';
	$form_body = '<div class="tab-content mainForm" id="nav-tabContent">';
	
	if($template == 'customers') $form_body = '<div class="tab-content" id="nav-tabContent">';
		
	$data_body = '';
	//$data_nav = '<nav class="topMenu navbar fixed-top navbar-expand-lg navbar-light bg-light nav-pills noPrint">
	
	$data_nav = '<nav class="topMenu navbar fixed-top navbar-expand-md navbar-light bg-light noPrint">
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
			</div>
		</span>		
		<span class="nav-item dropdown">
			<a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Действия</a>
			<div class="dropdown-menu">
				<span class="dropdown-item" id="createBuildingTask">Стр. задание</span>
				<span class="dropdown-item"  id="toSvg">Снимок</span>
				<span class="dropdown-item"  id="validate">Проверить</span>
				<span class="dropdown-item"  id="compareModalShow">Сравнить с другим</span>';

			if($template == 'calculator'){
				$data_nav .= '<span class="dropdown-item"  id="makeAccepted">Привязать к заказу</span>';
			};
			$data_nav .= '
				<span class="dropdown-item"  onclick="exportToObj($["vl_1"]);">Сохранить OBJ</span>
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
			if($val['class']) $class = $val['class'];
			
			if($val['group'] == 'form'){
				if($isFirst) $class .= " active"; //первая вкладка активная
				$form_nav .= '<a class="nav-item nav-link ' . $class . '" id="nav-' . $key . '-tab" data-toggle="tab" href="#nav-' . $key . '" role="tab" aria-controls="nav-' . $key . '" aria-selected="true">' .	
						$val['name'] . '</a>';
				$form_body .= '<div class="tab-pane fade show ' . $class . ' printBlock" id="nav-' . $key . '" role="tabpanel" aria-labelledby="nav-' . $key . '-tab">';
				//получаем содержимое файла формы с учетом вложенных include
				ob_start();
				include $_SERVER['DOCUMENT_ROOT'].$val['url'];
				$form_body .= ob_get_contents();
				ob_end_clean();
				
				$form_body .= '</div>';
				
				$isFirst = false;
			};
			if($val['group'] == 'data'){
				$data_nav .= '<a class="nav-item nav-link ' . $class . '" id="nav-' . $key . '" href="#' . $key . '-sect">' . $val['name']. '</a>';
				
				if($key != "price") $class .= " printBlock";
				
				$data_body .= '<div id="' . $key . '-sect" class="' . $class . '">';
				ob_start();
				include $_SERVER['DOCUMENT_ROOT'].$val['url'];
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
		echo $data_nav . $data_body;
		echo 
			'<div class="panelWrap">
				<div class="panelResizer d-none"></div>
				<div class="panelHeader">				
					<button class="btn btn-primary recalculate d-none">
						<i class="fa fa-refresh"></i>
						Обновить
					</button>
					
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

	
	/**
	 * Загрузка параметров
	*/
	if (isset($_GET['orderName'])) {
		
		require_once($_SERVER['DOCUMENT_ROOT'].'/orders/db_conn.php');
	
		$mysql = @new mysqli("127.0.0.1", $db_settings['user'], $db_settings['password'], $db_settings['db']);
		$mysql->set_charset("utf8");

		$allOk = true;

		//проверим не возникло ли ошибки
		if ($mysql->connect_error) {
			echo "<script>alert('При подключении к базе данных произошла ошибка, загрузить не был загружен');</script>";
			$allOk = false;
		}

		if ($allOk) {
			$orderName = mb_strtoupper($_GET["orderName"], 'UTF-8');
			$query = "SELECT * FROM `calcs` WHERE UPPER(`order_name`)= '{$orderName}'";
		
			$n = false;
		
			if($result = $mysql->query($query)){
				$n = $result->num_rows;
				if($n){
					$row = $result->fetch_assoc();
				}else{
					echo "<script>alert('Заказ не найден');</script>";
					$allOk = false;
				}
			}else{
				echo "<script>alert('Заказ не найден');</script>";
				$allOk = false;
			}

			if ($allOk && $row) {
				echo '<script>';
				echo 'var loadedData = ' . json_encode($row) . ';';
				echo '</script>';
			}
		}
	}
?>

<style>
	
.panelWrap{
	position: fixed;
	top: 5px;
	right: 0;
	height: 0;
	z-index: 1030;
	float: right;
	display:inline-block;	
    height: 98vh;    
	padding: 10px;
    border-radius: 5px;
	/*overflow: hidden;*/
}

.panelWrap.visible{
	border: 1px solid grey;
	background-color: white;
}

.panelWrap nav{
    position: relative;
	background-color: aliceblue;
    padding: 5px;
    border-radius: 5px;
	margin: 10px 0;
	width: 100%;
	font-size: 0.8em;
}

.panelBody {
	max-width: 600px;
	width: 90vw;
	height: 97%;
}


.mainForm{	
	width: 100%;	
	height: 75%;
	overflow: scroll;
	min-height: 200px;
	padding-bottom: 100px;
}

.new-menu-wrapper{
	/* position: fixed;
	top: 100px;
	right: 10px;
	width: 300px;
	border: 1px solid rgba(0,0,0,0.3);
	border-radius: 5px;
	overflow: auto; 
	height: 80vh; */
}

.new-menu-wrapper .menu-item{
	padding: 0 10px;
	border: 1px solid rgba(0,0,0,0.3);
	display: flex;
	height: 30px;
}

.new-menu-wrapper .menu-item > *{
	/* line-height: 25px; */
	flex: 1;
	height: 20px;
	font-size: 13px;
	margin: auto;
}

.new-menu-wrapper .menu-item.menu-item__clickable{
	cursor:pointer;
}

.new-menu-wrapper .menu-item.menu-item__clickable:hover{
	background-color: rgb(230,230,230);
}

.new-menu-wrapper .menu-item span{
	height: 30px;
	flex: 3;
	display: flex;
	align-items: center;
}

.new-menu-wrapper .menu-item[data-menu_delimeter], .new-menu-wrapper .menu-item[data-menu_folder]{
	background-color: cornflowerblue;
	color: white;
	font-size: 18px;
	cursor: pointer;
}

.new-menu-wrapper .menu-item[data-menu_checkbox]{
	background-color: cornflowerblue;
	color: white;
	font-size: 18px;
	cursor: pointer;
}


/* .new-menu-wrapper .menu-group .menu-item:not([data-menu_delimeter]){
	padding-left: 20px;
} */

.new-menu-wrapper .menu-group .menu-group__content{
	padding-left: 10px;
}


.dg.ac {
	z-index: 1200;
}

.panelResizer{
	width: 5px;
    height: 100px;
    background-color: #d0d0d0;
    float: left;
    cursor: w-resize;
    font-size: 20px;
    position: absolute;
    top: 100px;
    left: -5px;
}

/*стили печати*/
.print .panelWrap{
	position: relative!important;
	width: 100%!important;
	height: 100%!important;
    border: none!important;
	height: auto!important;
}

.print .panelHeader{
	display: none;	
}


.print nav{
	display: none;	
}

.print .panelBody{
	width: 100%;
	display: block!important;
	height: auto!important;
}

.print .mainForm{
	overflow: visible;
	height: auto!important;
}


.print .mainForm>.tab-pane {
    display: block;
	opacity: 100;
}

.print .mainForm>.tab-pane.noPrint {
    display: none;
}

.printBlock {
	margin: 5px;
}

.print .printBlock:hover {
	border: 1px solid red;
}

.print .noPrint {
	display: none;
	border: 1px solid lightgrey;
}

.print .panelResizer {
	display: none;
}

.togglePrint{
	display: none;
	padding: 10px;
    position: absolute;
    right: 20;
    font-size: 1.5em;
	cursor: pointer;
	z-index: 1;
}

.togglePrint:hover{
	background-color: lavender;
    border-radius: 5px;
}

.print .togglePrint {
	display: block;
}

.grey{
	color: lightgrey;
}

.dropdown-item{
	cursor: pointer;
}
</style>