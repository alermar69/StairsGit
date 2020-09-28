<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("КП на столешницы и подоконники"); 
//модуль
$calc_type = getCalcType();
//представление
$template = getTemplate();
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
include $GLOBALS['ROOT_PATH']."/orders/calcs/getOrderData.php";
?>

<!--служебные поля-->

<div id="calcInfo" style="display: none">
	<select size="1" id="calcType">
		<option value="slabs" selected >slabs</option>	
	</select>
	<input type="text" value="1.0" id = "calcVersion">
</div>


<!-- Форма параметров заказа-->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/orderForm.php" ?>

<!-- файлы заказа и типовые чертежи -->
<div class='noPrint'>
<?php include $GLOBALS['ROOT_PATH']."/orders/files/orderFiles.php" ?>
</div>

<div id="descr"></div>

<div id="totalResultWrap">
	<h2 class="raschet" onclick='recalculate()'>Общая стоимость</h2>
	<div id="totalResult" class="toggleDiv number"></div>
</div>

<!-- Информация по технологическим ограничениям -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/slabs/forms/techInfo.php" ?>



<!-- главная форма -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/slabs/forms/mainForm.php" ?>


<!--себестоимость-->
<?php include $GLOBALS['ROOT_PATH']."/calculator/slabs/forms/costForm.php" ?>

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
<script type="text/javascript" src="/calculator/slabs/priceCalc.js"></script>

<!--описание-->
<script type="text/javascript" src="/calculator/slabs/change_offer.js"></script>

<!--оболочки-->
<script type="text/javascript" src="/calculator/slabs/main.js"></script>

<!--обработчик формы монтажа-->
<script type="text/javascript" src="/calculator/general/forms/assemblingFormChange.js"></script>

<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>