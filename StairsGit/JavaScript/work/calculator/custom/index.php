<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Шаблон КП на нестандартные изделия v.1.0"); 
?> 

<link href="styles.css" type="text/css" rel="stylesheet" />

<h1 id = "mainTitle">Коммерческое предложение</h1>


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
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/orderForm.php" ?>

<!-- файлы заказа и типовые чертежи -->
<div class='noPrint'>
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/orderFiles/orderFiles.php" ?>
</div>

<br/>
<!-- главная форма -->
<?php include "forms/mainForm.php" ?>

<!-- О компании -->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/content/about.php" ?>


<!--себестоимость-->
<?php include "forms/costForm.php" ?>

<!-- общие библиотеки -->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/libs_man.php" ?>


<!--расчет цены-->
<script type="text/javascript" src="priceCalc.js"></script>

<!--оболочки-->
<script type="text/javascript" src="main.js"></script>


<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>