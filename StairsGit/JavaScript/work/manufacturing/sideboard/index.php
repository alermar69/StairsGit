<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Комоды v.1.1");
?>

<h1 id = "mainTitle">Комоды</h1>

<!--служебные поля-->

<div id="calcInfo" style="display: none">
    <select size="1" id="calcType">
        <option value="metal">metal</option>
        <option value="timber"  >timber</option>
        <option value="vint">vint</option>
        <option value="vhod">vhod</option>
        <option value="mono">mono</option>
        <option value="geometry">geometry</option>
		<option value="sideboard" selected >sideboard</option>
    </select>
    <input type="text" value="1.1" id = "calcVersion">
</div>

<!-- Форма параметров заказа-->
<?$APPLICATION->IncludeComponent(
    "bitrix:main.include",
    ".default",
    Array(
        "AREA_FILE_SHOW" => "file",
        "PATH" => "/calculator/general/forms/orderForm.php",
        "EDIT_TEMPLATE" => ""
    )
);?>

<!-- Инструкции для пользователей -->
<?$APPLICATION->IncludeComponent(
    "bitrix:main.include",
    ".default",
    Array(
        "AREA_FILE_SHOW" => "file",
        "PATH" => "/manufacturing/metal/content/manual.php",
        "EDIT_TEMPLATE" => ""
    )
);?>

<!-- История версий -->
<?$APPLICATION->IncludeComponent(
    "bitrix:main.include",
    ".default",
    Array(
        "AREA_FILE_SHOW" => "file",
        "PATH" => "/calculator/metal/content/history.php",
        "EDIT_TEMPLATE" => ""
    )
);?>



<!-- визуализация -->
<div id="visualisation">
    <h2 class="raschet" onclick="recalculate();">Общий вид:</h2>
    <div id="Stats-output" style="display: none;"></div>

    <div id="WebGL-output"><canvas>Для отображения содержимого откройте страницу в Гугл Хром</canvas></div>
</div>

<div class="noPrint">
	<button onclick="exportToDxf(dxfPrimitivesArr);">Экспорт контуров в dxf</button>
	<button onclick="exportToObj($['vl_1']);">Экспорт сцены в OBJ</button>
	<button onclick="saveCanvasImg(0)">Сохранить png</button>
	<button id="openDoors">Открыть дверки</button>

	<!-- тестирование -->
	<?php include $GLOBALS['ROOT_PATH']."/manufacturing/general/testing/pagePart.php" ?>

	<!-- файлы заказа и типовые чертежи -->
	<?php include $GLOBALS['ROOT_PATH']."/orders/files/orderFiles.php" ?>
	
</div>

<!-- форма параметров каркаса-->
<?php include $GLOBALS['ROOT_PATH']."/calculator/sideboard/forms/mainForm.php" ?>


<div id="result" style="display: none;"></div>

</div> <!--end of .content-->

<!-- спецификация, расчет трудоемкости и сдельной оплаты -->

<?$APPLICATION->IncludeComponent(
	"bitrix:main.include",
	".default",
	Array(
		"AREA_FILE_SHOW" => "file",
		"PATH" => "/manufacturing/general/calc_spec/pagePart.php",
		"EDIT_TEMPLATE" => ""
	)
);?>

<div class="content">

<!-- правое меню -->

<?$APPLICATION->IncludeComponent(
	"bitrix:main.include",
	".default",
	Array(
		"AREA_FILE_SHOW" => "file",
		"PATH" => "/calculator/sideboard/forms/rightMenu.php",
		"EDIT_TEMPLATE" => ""
	)
);?>

<!-- общие библиотеки -->

<?$APPLICATION->IncludeComponent(
	"bitrix:main.include",
	".default",
	Array(
		"AREA_FILE_SHOW" => "file",
		"PATH" => "/calculator/general/libs_man.php",
		"EDIT_TEMPLATE" => ""
	)
);
foreach($scripts as $script){
    $printScript = true;
    if(isset($script['only_for']) && !in_array($calc_type, $script['only_for'])) $printScript = false;
    if($printScript){
        echo '<script type="text/javascript" src="' . $script['url'] . '"></script>';
    };
};
?>

<script type="text/javascript" src="/manufacturing/general/drawDimensions.js"></script>

<!--визуализация-->
<script type="text/javascript" src="drawSideboard.js"></script>
<script type="text/javascript" src="drawCarcas.js"></script>
<!--<script type="text/javascript" src="drawCarcasParts.js"></script>-->
<script type="text/javascript" src="drawContent.js"></script>
<script type="text/javascript" src="drawDimensions.js"></script>


	<!-- автотесты -->
	<script type="text/javascript" src="/manufacturing/general/testing/testingLib.js"></script>
    <script type="text/javascript" src="/manufacturing/general/testing/testingActions.js"></script>
    <script type="text/javascript" src="/manufacturing/general/testing/debug/checkSamples.js"></script>
    <script type="text/javascript" src="/manufacturing/general/testing/debug/testHelper.js"></script>
	<script type="text/javascript" src="/manufacturing/general/testing/debug/testReport.js"></script>
    <script type="text/javascript" src="/manufacturing/general/testing/debug/testSamples.js"></script>

<!--расчет спецификации-->
<script type="text/javascript" src="calcSpec_3.0.js"></script>

<!--оболочки-->
<script type="text/javascript" src="main.js"></script>

<!--тестирование-->
<script type="text/javascript" src="testing.js"></script>
<script type="text/javascript" src="/manufacturing/general/testing/baseTest.js"></script>


<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>
