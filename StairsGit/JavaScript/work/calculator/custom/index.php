<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Шаблон КП на нестандартные изделия v.1.0"); 
//модуль
$calc_type = getCalcType();
//представление
$template = getTemplate();
?> 

<link href="styles.css" type="text/css" rel="stylesheet" />

<div class="noPrint">
	<button class="btn btn-outline-dark" id="makeAccepted">Привязать к заказу</button>
</div>

<h1 id = "mainTitle">Коммерческое предложение</h1>

<?
//загрузка данных кп
include $GLOBALS['ROOT_PATH']."/orders/calcs/getOrderData.php";
?>

<!--служебные поля-->

<div id="calcInfo" style="display: none">
	<select size="1" id="calcType">
		<option value="metal">metal</option>
		<option value="timber"  >timber</option>
		<option value="vint">vint</option>
		<option value="vhod">vhod</option>
		<option value="mono">mono</option>
		<option value="module" >module</option>
		<option value="custom" selected >custom</option>	
		<option value="geometry">geometry</option>		
	</select>
	<input type="text" value="1.0" id = "calcVersion">
</div>


<!-- Форма параметров заказа-->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/orderForm.php" ?>

<!-- файлы заказа и типовые чертежи -->
<div class='noPrint'>
<?php include $GLOBALS['ROOT_PATH']."/orders/files/orderFiles.php" ?>
</div>

<br/>
<!-- главная форма -->
<?php include "forms/mainForm.php" ?>

<!-- О компании -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/content/about.php" ?>


<!--себестоимость-->
<?php include "forms/costForm.php" ?>

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


<!--расчет цены-->
<script type="text/javascript" src="priceCalc.js"></script>

<!--оболочки-->
<script type="text/javascript" src="main.js"></script>


<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>