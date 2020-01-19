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
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/orderForm.php" ?>


<!-- Блоки для вывода данных на странице, файлы заказа, чертежи-->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/output.php" ?>

<!-- форма параметров стола-->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/table/forms/mainForm.php" ?>

<!-- Модальное окно с вариантами боковин-->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/table/forms/sideModal.php" ?>

<!--форма доставка, сборка-->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/assemblingForm.php" ?>

<!--комментарии менеджера-->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/comments.php" ?>

<!--себестоимость-->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/cost.php" ?>

<!--данные для производства-->
<?php include $_SERVER['DOCUMENT_ROOT']."/manufacturing/general/include_areas/production_data.php" ?>

<!-- правое меню -->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/right_menu/rightMenu.php" ?>

<!-- общие библиотеки -->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/libs_man.php" ?>

<!--визуализация-->
<script type="text/javascript" src="drawTable.js"></script>
<script type="text/javascript" src="drawCarcas.js"></script>


<!--расчет цены-->
<script type="text/javascript" src="priceCalc.js"></script>

<!--оболочки-->
<script type="text/javascript" src="../general/main.js"></script>
<script type="text/javascript" src="main.js"></script>


<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>
