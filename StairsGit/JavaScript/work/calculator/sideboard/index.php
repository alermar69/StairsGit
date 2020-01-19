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

<!-- шаблоны комплектации-->
<div id="templatesWrap" class="noPrint">
	<h2 class="raschet">Шаблоны</h2>
	<div id="templates" class="toggleDiv">
		<?$APPLICATION->IncludeComponent(
			"bitrix:main.include",
			".default",
			Array(
				"AREA_FILE_SHOW" => "file",
				"PATH" => "/calculator/sideboard/templates.php",
				"EDIT_TEMPLATE" => ""
			)
		);?>
	</div>
</div>

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
</div>

<div id="totalResultWrap">
	<h2 class="raschet">Общая стоимость</h2>
	<div id="totalResult" class="toggleDiv"></div>
</div>


<div id="productionTimeWrap">
	<h2 class="raschet">Сроки</h2>
	<div id="productionTime" class="toggleDiv"></div>
</div>


<!-- О компании -->
<div id="aboutWrap">
	<h2>Немного о нас</h2>

	<?$APPLICATION->IncludeComponent(
		"bitrix:main.include",
		".default",
		Array(
			"AREA_FILE_SHOW" => "file",
			"PATH" => "content/about.php",
			"EDIT_TEMPLATE" => ""
		)
	);?>
</div>



<!-- форма параметров каркаса-->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/sideboard/forms/mainForm.php" ?>


<div id="result" style="display: none;"></div>

<div id="modelInfo"> </div>



</div> <!--end of .content-->


<div id="cost">
<h2 class="raschet">Расчет себестоимости</h2>

<h4>Коэффициенты на цену</h4>
<table class="form_table" ><tbody>
<tr><th>Наименование</th><th>к-т на себестоимость</th><th>к-т на цену</th> </tr>
<tr>
	<td>Каркас:</td>
	<td><input id="carcasCostFactor" type="number" value="1"></td>
	<td><input id="carcasPriceFactor" type="number" value="1"></td>
</tr>
<tr>
	<td>Наполнение:</td>
	<td><input id="contentCostFactor" type="number" value="1"></td>
	<td><input id="contentPriceFactor" type="number" value="1"></td>
</tr>
<tr>
	<td>Фасады:</td>
	<td><input id="doorsCostFactor" type="number" value="1"></td>
	<td><input id="doorsPriceFactor" type="number" value="1"></td>

<tr>
	<td>Сборка:</td>
	<td><input id="assemblingCostFactor" type="number" value="1"></td>
	<td><input id="assemblingPriceFactor" type="number" value="1"></td>
</tr>
</tbody> </table>

<h4>Расчет скидки</h4>
<b>Режим расчета: </b>
	<select id="discountMode" size="1">
		<option value="процент">% скидки</option>
		<option value="скидка">сумма скидки</option>
		<option value="цена">цена со скидкой</option>
	</select>
</br>
	
<b>Величина:</b> <input id="discountFactor" type="number" value="50">
<br/><br/>


Комментарии:<br/>  <textarea id="discountComments" rows="1" cols="80" class="comments"></textarea>

<h3 class="raschet">Общая себестоимость</h3>
<div id="total_cost">
	<p>Расчет еще не произведен</p>
</div>

<h3 class="raschet">Подробный расчет себетоимости (без к-тов)</h3>
<div id="cost_full">
	<p>Расчет еще не произведен</p>
</div>


</div>

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
);?>

<script type="text/javascript" src="/manufacturing/general/drawDimensions.js"></script>

<!--визуализация-->
<script type="text/javascript" src="/manufacturing/sideboard/drawSideboard.js"></script>
<script type="text/javascript" src="/manufacturing/sideboard/drawCarcas.js"></script>
<!--<script type="text/javascript" src="drawCarcasParts.js"></script>-->
<script type="text/javascript" src="/manufacturing/sideboard/drawContent.js"></script>
<script type="text/javascript" src="/manufacturing/sideboard/drawDimensions.js"></script>


	<!-- автотесты -->
	<script type="text/javascript" src="/manufacturing/general/testing/testingLib.js"></script>
    <script type="text/javascript" src="/manufacturing/general/testing/testingActions.js"></script>
    <script type="text/javascript" src="/manufacturing/general/testing/debug/checkSamples.js"></script>
    <script type="text/javascript" src="/manufacturing/general/testing/debug/testHelper.js"></script>
	<script type="text/javascript" src="/manufacturing/general/testing/debug/testReport.js"></script>
    <script type="text/javascript" src="/manufacturing/general/testing/debug/testSamples.js"></script>

<!--расчет спецификации-->
<script type="text/javascript" src="priceCalc.js"></script>

<!--оболочки-->
<script type="text/javascript" src="main.js"></script>

<!--тестирование-->
<script type="text/javascript" src="/manufacturing/sideboard/testing.js"></script>
<script type="text/javascript" src="/manufacturing/general/testing/baseTest.js"></script>


<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>
