<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Конфигуратор балюстрады v.1.0"); 
?> 
 
<h1 id = "mainTitle">Конфигуратор балюстрады</h1>


<div id="visualisation">
	<h2 class="raschet" onclick="recalculate();">Общий вид балюстрады:</h2>
	<div id="Stats-output" style="display: none;"></div>
	<div id="WebGL-output"><canvas>Для отображения содержимого откройте страницу в Гугл Хром</canvas></div> 
</div>


<div id="balustradeForm">
<h2>Параметры проемов в стенах</h2>
<!-- форма параметров проемов в стенах-->
<?$APPLICATION->IncludeComponent(
	"bitrix:main.include",
	".default",
	Array(
		"AREA_FILE_SHOW" => "file",
		"PATH" => "/calculator/walls/walls_form.php",
		"EDIT_TEMPLATE" => ""
	)
);?>
</div>



<!--общие библитотеки-->
<script async="" src="/calculator/forms/FileSaver.min.js" /></script>

<!--графика-->
<script type="text/javascript" src="/calculator/general/viewports.js"></script>
<script type="text/javascript" src="/calculator/general/three_libs/three.js"></script> 
<script type="text/javascript" src="/calculator/general/three_libs/stats.js"></script> 
<script type="text/javascript" src="/calculator/general/three_libs/dat.gui.js"></script>
<script type="text/javascript" src="/calculator/general/three_libs/OrbitControls.js"></script>
<script type="text/javascript" src="/calculator/general/three_libs/ThreeBSP.js"></script>

 
<!--визуализация-->
<script type="text/javascript" src="drawWalls.js"></script>
<script type="text/javascript" src="/calculator/general/drawPrimitives.js"></script>

<!--экспорт в dxf-->
<script type="text/javascript" src="/calculator/general/dxfFileMaker.js"></script>

<!--экспорт в xml-->
<script type="text/javascript" src="/calculator/general/dataExchangeXml.js"></script>

<!--изменение оффера--
<script type="text/javascript" src="change_offer.js"></script>
-->

<!--расчет цены--
<script type="text/javascript" src="price_calc.js"></script>
-->
<!--оболочки-->
<script type="text/javascript" src="main.js"></script>


<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>
