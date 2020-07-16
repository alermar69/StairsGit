<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Расчет на прочность v.1.0"); 
?> 

<h1 id = "mainTitle">Прочностные расчеты</h1>

<?
//загрузка данных кп
include $GLOBALS['ROOT_PATH']."/orders/calcs/getOrderData.php";
?>

<!--служебные поля-->

<div id="calcInfo" style="display: none">
	<select size="1" id="calcType">
		<option value="strength_calc" selected >strength_calc</option>	
	</select>
	<input type="text" value="1.0" id = "calcVersion">
</div>


<!-- Форма параметров заказа-->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/orderForm.php" ?>

<img src="/images/stength_calc/flexure.jpg">
<br>
<div class="multiSpan">
<h3>К-ты для многопролетных балок<h3>

<img src="/images/stength_calc/twoSpanBeam.png" style="width: 600px">
<img src="/images/stength_calc/multiSpanBeam.png" style="width: 600px">
</div>
<br>

<!-- главная форма -->
<?php include "forms/mainForm.php" ?>

<div id="result"></div>

<h3>Полезная информация </h3>
<a href="/images/stength_calc/manual.pdf" target="_blank">Методичка по расчетам на нагрузки PDF </a><br/>
<a href="/images/stength_calc/sopromat.pdf" target="_blank">Учебник по сопромату Ицкович PDF </a><br/>
<a href="/images/stength_calc/sortamentSteels.pdf" target="_blank">Сортамент прокатной стали PDF </a><br/>
<a href="https://sopromat.ueuo.com/crosssections.php" target="_blank">Расчет сложных сечений </a><br/>

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

<script type="text/javascript" src="strength_calc.js"></script>


<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>