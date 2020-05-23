<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Расчет пожарных лестниц v.1.0"); 
include $GLOBALS['ROOT_PATH']."/orders/calcs/getOrderData.php";
?> 

<h1 id = "mainTitle">Коммерческое предложение на пожарные лестницы</h1>


<!--служебные поля-->

<div id="calcInfo" style="display: none">
	<select size="1" id="calcType">
		<option value="metal">metal</option>
		<option value="timber"  >timber</option>
		<option value="vint">vint</option>
		<option value="vhod">vhod</option>
		<option value="mono">mono</option>
		<option value="module" >module</option>
		<option value="fire" >fire</option>
		<option value="fire_2" selected >fire_2</option>	
		<option value="geometry">geometry</option>		
	</select>
	<input type="text" value="1.0" id = "calcVersion">
</div>

<!-- Форма параметров заказа-->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/orderForm.php" ?>

<!-- Инструкции для пользователей -->
<?php include "content/manual.php" ?>

<!-- История версий -->
<?php include "content/history.php" ?>




<!-- визуализация 
<div id="visualisation">
	<h2 class="raschet" onclick="recalculate();">Общий вид лестницы:</h2>
	<div id="Stats-output" style="display: none;"></div>

	<div id="WebGL-output"><canvas>Для отображения содержимого откройте страницу в Гугл Хром</canvas></div> 
</div>

-->

<!-- файлы заказа и типовые чертежи -->
<div class='noPrint'>
<?php include $GLOBALS['ROOT_PATH']."/orders/files/orderFiles.php" ?>
</div>
<!-- Картинки, описание, комплектация -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/fire_2/content/description.php" ?>

<div id="totalResultWrap">
	<h2 class="raschet" onclick='recalculate()'>Общая стоимость лестницы</h2>
	<div id="totalResult" class="toggleDiv number"></div>
</div>

<!-- О компании -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/fire_2/content/about.php" ?>

<div id="mainViewWrap">
	<h2 class="raschet" onclick='recalculate()'>Основные размеры лестницы</h2>
	<canvas id='mainView' class="toggleDiv">Обновите браузер</canvas>
</div>


<!-- форма параметров лестницы-->
	<?php include $GLOBALS['ROOT_PATH']."/calculator/fire_2/forms/carcas_form.php" ?>

<!--форма доставка, сборка-->
	<?php include $GLOBALS['ROOT_PATH']."/calculator/fire_2/forms/assemblingForm.php" ?>

<!--комментарии менеджера-->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/comments.php" ?>
	
<!--себестоимость-->
	<?php include $GLOBALS['ROOT_PATH']."/calculator/fire_2/forms/cost.php" ?>

<!--данные для производства-->
	<?php include $GLOBALS['ROOT_PATH']."/manufacturing/general/include_areas/production_data.php" ?>



<!--

<div id="result" style="display: none;"></div>

<div id="specificationList" style="display: none;">
<h2>Приблизительный расход материала</h2>

	<div id="materialNeed"></div>

</div>

-->


<!-- общие библиотеки -->
<?php
 	include $GLOBALS['ROOT_PATH']."/calculator/general/libs_man.php";
	foreach($scripts as $script){
		$printScript = true;
		if(isset($script['only_for']) && !in_array($calc_type, $script['only_for'])) $printScript = false;
		if($printScript){
			echo '<script type="text/javascript" src="' . $script['url'] . '"></script>';
		};
	};
?>

<!--2D графика-->
<script type="text/javascript" src="/manufacturing/fire_2/drawStaircase.js"></script>
<script type="text/javascript" src="/calculator/general/draw2DLib.js"></script>

<!--изменение оффера-->
<script type="text/javascript" src="change_offer.js"></script>

<!--расчет цены-->
<script type="text/javascript" src="priceCalc.js"></script>

<!--оболочки-->
<script type="text/javascript" src="main.js"></script>


<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>