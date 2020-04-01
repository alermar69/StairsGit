<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Шаблон КП на столешницы и подоконники"); 
?> 

<link href="styles.css" type="text/css" rel="stylesheet" />


<div class="noPrint">
	Шапка: 
	<select size="1" id="headerType" class="form-control-sm">
		<option value="style-t" selected >Стиль-Т</option>	
		<option value="inside">Инсайд</option>	
		<option value="нет">нет</option>	
	</select>
	<br/>
	<button class="btn btn-outline-dark" id="makeAccepted">Привязать к заказу</button>
</div>

<h1 id = "mainTitle">Коммерческое предложение</h1>



<?
//загрузка данных кп
include $_SERVER['DOCUMENT_ROOT']."/orders/calcs/getOrderData.php";
?>

<!--служебные поля-->

<div id="calcInfo" style="display: none">
	<select size="1" id="calcType">
		<option value="slabs" selected >slabs</option>	
	</select>
	<input type="text" value="1.0" id = "calcVersion">
</div>


<!-- Форма параметров заказа-->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/orderForm.php" ?>

<!-- файлы заказа и типовые чертежи -->
<div class='noPrint'>
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/orderFiles/orderFiles.php" ?>
</div>



<div id="totalResultWrap">
	<h2 class="raschet" onclick='recalculate()'>Общая стоимость</h2>
	<div id="totalResult" class="toggleDiv number"></div>
</div>

<!-- главная форма -->
<?php include "forms/mainForm.php" ?>


<!--себестоимость-->
<?php include "forms/costForm.php" ?>

<!-- общие библиотеки -->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/libs_man.php" ?>


<!--расчет цены-->
<script type="text/javascript" src="priceCalc.js"></script>

<!--оболочки-->
<script type="text/javascript" src="main.js"></script>


<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>