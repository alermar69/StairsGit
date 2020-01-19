<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Расчет модульных v.1.6"); 
?> 

<h1 id = "mainTitle">Коммерческое предложение на модульную лестницу</h1>


<!--служебные поля-->

<div id="calcInfo" style="display: none">
	<select size="1" id="calcType">
		<option value="metal">metal</option>
		<option value="timber"  >timber</option>
		<option value="vint">vint</option>
		<option value="vhod">vhod</option>
		<option value="mono">mono</option>
		<option value="module" selected >module</option>	
		<option value="geometry">geometry</option>		
	</select>
	<input type="text" value="1.6" id = "calcVersion">
</div>

<!-- Форма параметров заказа-->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/orderForm.php" ?>

<!-- Инструкции для пользователей -->
<?php include "content/manual.php" ?>

<!-- История версий -->
<?php include "content/history.php" ?>



<!-- визуализация -->
<div id="visualisation">
	<h2 class="raschet">Общий вид лестницы:</h2>
	<div id="Stats-output" style="display: none;"></div>

	<div id="WebGL-output"><canvas>Для отображения содержимого откройте страницу в Гугл Хром</canvas></div> 
</div>

<div class="noPrint">

	<button onclick="saveCanvasImg(0)">Сохранить png</button>
	<button id="toggleAll">Свернуть все</button>

	<!-- файлы заказа и типовые чертежи -->
	<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/orderFiles/orderFiles.php" ?>

</div>

<!-- описание, комплектация -->
<?php include "content/description.php" ?>

<div id="totalResultWrap">
	<h2 class="raschet">Общая стоимость лестницы</h2>
	<div id="totalResult" class="toggleDiv"></div>
</div>


<div id="productionTimeWrap">
	<h2 class="raschet">Сроки</h2>
	<div id="productionTime" class="toggleDiv"></div>
</div>

<!-- О компании -->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/content/about.php" ?>



<div id="carcasForm">
<h2>Характеристики лестницы</h2>

<!-- форма параметров проемов каркаса-->
<?$APPLICATION->IncludeComponent(
	"bitrix:main.include",
	".default",
	Array(
		"AREA_FILE_SHOW" => "file",
		"PATH" => "/calculator/module/forms/carcas_form.php",
		"EDIT_TEMPLATE" => ""
	)
);?>

<h3>Стоимость каркаса и ступеней: </h3>
	<div id="resultCarcas">
	<p>Расчет еще не произведен.</p>
</div>

</div>

<div id="perilaForm">
<!-- форма параметров ограждений-->
<?$APPLICATION->IncludeComponent(
	"bitrix:main.include",
	".default",
	Array(
		"AREA_FILE_SHOW" => "file",
		"PATH" => "/calculator/module/forms/railing_form.php",
		"EDIT_TEMPLATE" => ""
	)
);?>


<div id="resultPerila">
	<h3>Стоимость ограждений:</h3>
	<p>Расчет еще не произведен.</p>
</div>

	
	<div id="marshRailingImages2D">
		<canvas id='section_1'>Откройте страницу в Google Chrome</canvas>
	</div>

</div>

<!-- форма параметров конструкции балюстрады-->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/banister/forms/banister_construct_form.php" ?>

<!-- форма параметров каркаса шкафа -->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/wardrobe/forms/stairs_wr.php" ?>

<!--форма доставка, сборка-->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/assemblingForm.php" ?>

<!--себестоимость-->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/cost.php" ?>

<div id="specificationList" style="display: none;">
	<h2 class="raschet">Приблизительный расход материала</h2>
	<div id="materialNeed"></div>
</div>

<!-- правое меню -->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/right_menu/rightMenu.php" ?>

<!-- общие библиотеки -->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/libs_man.php" ?>
 
<!--визуализация-->
<script type="text/javascript" src="drawStaircase.js"></script>
<script type="text/javascript" src="drawStaircaseParts.js"></script>
<script type="text/javascript" src="/calculator/general/drawCarcasPartsLib.js"></script>

<!--изменение оффера-->
<script type="text/javascript" src="change_offer.js"></script>


<!--расчет цены-->
<script type="text/javascript" src="priceCalc.js"></script>

<!--оболочки-->
<script type="text/javascript" src="../general/main.js"></script>
<script type="text/javascript" src="main.js"></script>


<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>
