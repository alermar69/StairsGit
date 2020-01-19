<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Расчет геометрии лестницы v.5.0");
?>

<h1>Расчет геометрии лестницы</h1>

<!--служебные поля-->
<div id="calcInfo" style="display: none">
    <select size="1" id="calcType">
        <option value="metal">metal</option>
        <option value="timber"  >timber</option>
        <option value="vint">vint</option>
        <option value="vhod">vhod</option>
        <option value="mono">mono</option>
        <option value="geometry" selected >geometry</option>
    </select>
    <input type="text" value="3.9" id = "calcVersion">
</div>

<!-- Форма параметров заказа-->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/orderForm.php" ?>

<button id='printInstallationContract'>Распечатать строительное задание</button>

<!-- Инструкции для пользователей -->
<?php include "content/manual.php" ?>

<!-- История версий -->
<?php include "content/history.php" ?>

<!-- Описание методики расчета -->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/geometry/content/description.php" ?>


<p class="raschet noPrint" id="showPhotos">Фото с объекта</p>
<div id="photos" style="display: none;" class='noPrint'></div>

<!-- форма параметров лестницы -->
<?php include "forms/carcas_form.php" ?>

<!-- форма с кнопками -->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/geometry/forms/calculator_form.php" ?>




<div id='params'>
</div>

<div id="geometry">
</div>

<div id="geomDescr"></div>


	<!-- визуализация -->
	<div id="visualisation">
		<h2 class="raschet" onclick="recalculate();">Общий вид ступеней лестницы:</h2>
		<div id="Stats-output" style="display: none;"></div>

		<div id="WebGL-output"><canvas>Для отображения содержимого откройте страницу в Гугл Хром</canvas></div>
	</div>
	<button id='makeDrawings' type="button" class='noPrint'>Показать виды</button>
	<button id='resizeDrawings' type="button" class='noPrint'>Уменьшить</button>
  <div id='drawings'></div>

		<div id="compareResultDiv"></div>
</div>


<!-- правое меню -->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/right_menu/rightMenu_geom.php" ?>

<!-- общие библиотеки -->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/libs_man.php" ?>
<!-- <script type="text/javascript" src="/dev/egorov/metal_render2/textures/viewports_3.0.js"></script> -->

<link href="styles.css" type="text/css" rel="stylesheet" />

<!-- 3D -->
<script type="text/javascript" src="drawStaircase.js"></script>
<script type="text/javascript" src="drawDimensions.js"></script>
<script type="text/javascript" src="/manufacturing/general/drawTreads.js"></script>
<script type="text/javascript" src="/manufacturing/general/calcParams.js"></script>

<script type="text/javascript" src="/manufacturing/timber/drawCarcasParts.js"></script>
<script type="text/javascript" src="/manufacturing/timber_stock/drawCarcas.js"></script>

<script type="text/javascript" src="/manufacturing/general/drawDimensions.js"></script>

<script type="text/javascript" src="/manufacturing/metal/testing.js"></script>
<script type="text/javascript" src="/manufacturing/general/calcRailingParams.js"></script>

<script type="text/javascript" src="/manufacturing/metal/drawFrames.js"></script>
<script type="text/javascript" src="/manufacturing/metal/drawCarcasParts.js"></script>


<!--2D графика-->
<script type="text/javascript" src="draw2DLib.js"></script>

<!-- расчет параметров геометрии -->
<script type="text/javascript" src="calcGeomParams2.js"></script>

<script type="text/javascript" src="drawGeomSvg.js"></script>


<!--оболочки-->
<script type="text/javascript" src="../general/main.js"></script>
<script type="text/javascript" src="main.js"></script>

<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>
