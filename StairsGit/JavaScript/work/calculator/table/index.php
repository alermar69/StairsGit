<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Расчет столов"); 
?> 

<h1 id="mainTitle">Расчет столов</h1>


<!--служебные поля-->

<div id="calcInfo" style="display: none">
	<select size="1" id="calcType">
		<option value="metal">metal</option>
		<option value="timber"  >timber</option>
		<option value="vint">vint</option>
		<option value="vhod">vhod</option>
		<option value="mono">mono</option>	
		<option value="geometry">geometry</option>
		<option value="tables" selected>tables</option>
	</select>
	<input type="text" value="1.0" id = "calcVersion">
</div>

<link href="styles.css" type="text/css" rel="stylesheet">

<!-- Форма параметров заказа-->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/orderForm.php" ?>


<!-- Блоки для вывода данных на странице, файлы заказа, чертежи-->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/output.php" ?>

<!-- форма параметров стола-->
<?php include $GLOBALS['ROOT_PATH']."/calculator/table/forms/mainForm.php" ?>

<!-- Модальное окно с вариантами боковин-->
<?php include $GLOBALS['ROOT_PATH']."/calculator/table/forms/sideModal.php" ?>

<!--форма доставка, сборка-->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/assemblingForm.php" ?>

<!--комментарии менеджера-->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/comments.php" ?>

<!--себестоимость-->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/cost.php" ?>

<!--данные для производства-->
<?php include $GLOBALS['ROOT_PATH']."/manufacturing/general/include_areas/production_data.php" ?>

<!-- правое меню -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/right_menu/rightMenu.php" ?>

<!-- общие библиотеки -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/libs_man.php";
	foreach($scripts as $script){
		$printScript = true;
		if(isset($script['only_for']) && !in_array($calc_type, $script['only_for'])) $printScript = false;
		if($printScript){
			echo '<script type="text/javascript" src="' . $script['url'] . '"></script>';
		};
	};
?>

<!--визуализация-->
<script type="text/javascript" src="drawTable.js"></script>
<script type="text/javascript" src="drawCarcas.js"></script>


<!--расчет цены-->
<script type="text/javascript" src="priceCalc.js"></script>

<!--оболочки-->
<script type="text/javascript" src="../general/main.js"></script>
<script type="text/javascript" src="main.js"></script>


<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>
