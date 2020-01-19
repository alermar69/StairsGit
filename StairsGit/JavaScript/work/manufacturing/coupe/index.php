<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Расчет Шкафа 2.1"); 
?> 

<h1 id = "mainTitle">Коммерческое предложение на шкаф</h1>


<!--служебные поля-->

<div id="calcInfo" style="display: none">
	<select size="1" id="calcType">
		<option value="metal">metal</option>
		<option value="timber">timber</option>
		<option value="vint">vint</option>
		<option value="vhod">vhod</option>
		<option value="mono">mono</option>	
		<option value="geometry">geometry</option>
		<option value="wardrobe">wardrobe</option>
		<option value="coupe" selected>coupe</option>	
	</select>
	<input type="text" value="2.1" id = "calcVersion">
	<select id="companyName" size="1">
		<option value="Стиль-Т">Стиль-Т</option>
		<option value="Инсайд">Инсайд</option>
	</select>
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
		"PATH" => "content/manual.php",
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

<button id="openDoors" class="noPrint">Открыть дверки</button>
<button id="fixDoors" class="noPrint">Заблокировать двери</button>

<div id="2d">
<h2 class="raschet" onclick="recalculate();">Вид спереди:</h2>
<canvas id='mainView'>Обновите браузер</canvas>
</div>

<div class="noPrint">

<p class="raschet" onclick="exportToDxf(dxfPrimitivesArr);">Экспорт контуров в dxf</p>
<p class="raschet" onclick="exportToObj($['vl_1']);">Экспорт сцены в OBJ</p>


<!-- Файлы заказа-->
<?$APPLICATION->IncludeComponent(
	"bitrix:main.include",
	".default",
	Array(
		"AREA_FILE_SHOW" => "file",
		"PATH" => "/calculator/general/orderFiles/orderFiles.php",
		"EDIT_TEMPLATE" => ""
	)
);?>

</div>


<h2>Технические характеристики</h2>

<!-- форма параметров каркаса шкафа -->
<?$APPLICATION->IncludeComponent(
	"bitrix:main.include",
	".default",
	Array(
		"AREA_FILE_SHOW" => "file",
		"PATH" => "/calculator/coupe/forms/main_form.php",
		"EDIT_TEMPLATE" => ""
	)
);?>

<!-- форма параметров сборки -->
<?$APPLICATION->IncludeComponent(
	"bitrix:main.include",
	".default",
	Array(
		"AREA_FILE_SHOW" => "file",
		"PATH" => "/calculator/coupe/forms/assemblingForm.php",
		"EDIT_TEMPLATE" => ""
	)
);?>

<div id="modelInfo"> </div>
</br>



<div id="cost" style="display: none">
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
	<td>Двери:</td>
	<td><input id="doorsCostFactor" type="number" value="1"></td>
	<td><input id="doorsPriceFactor" type="number" value="1"></td>
<tr>
	<td>Наполнение:</td>
	<td><input id="contentCostFactor" type="number" value="1"></td>
	<td><input id="contentPriceFactor" type="number" value="1"></td>
</tr>
<tr>
	<td>Сборка:</td>
	<td><input id="assemblingCostFactor" type="number" value="1"></td>
	<td><input id="assemblingPriceFactor" type="number" value="1"></td>
</tr>
</tbody> </table>

<h4>Размер скидки, %: <input id="discountFactor" type="number" value="30"></h4>

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

</div> <!--end of .content-->

<div id="specificationList1">
<h2>Спецификация лестницы (Комплектовка)</h2>
	<div id="metal_list"></div>
	<div id="timber_list"></div>
	<div id="stock1_list"></div>
	<div id="stock2_list"></div>	
</div>

<button onclick="downloadXls(['#stock1_list', '#stock2_list'], '/manufacturing/general/calc_spec/');" class="saveXLS">Скачать XLS для склада</button>
<button onclick="downloadXls(['#metal_list', '#timber_list', '#stock1_list', '#stock2_list'], '/manufacturing/general/calc_spec/', true);" class="saveXLS">Скачать XLS полный</button>



<div id="specificationList2">
	<h2>Спецификация лестницы (сборка)</h2>
	<div id="specificationAssembly"></div>	
</div>

<div class="content">

<!-- правое меню -->

<?$APPLICATION->IncludeComponent(
	"bitrix:main.include",
	".default",
	Array(
		"AREA_FILE_SHOW" => "file",
		"PATH" => "/calculator/coupe/forms/rightMenu.php",
		"EDIT_TEMPLATE" => ""
	)
);?>

</div>

<!-- общие библиотеки -->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/libs_man.php" ?>

<!--общие библитотеки--
<script async="" src="/calculator/forms/FileSaver.min.js" /></script>
<script type="text/javascript" src="/calculator/general/orderFiles/getLinks.js" /></script>

<!--графика
<script type="text/javascript" src="/calculator/general/viewPorts_selObj.js"></script>
<script type="text/javascript" src="/calculator/general/three_libs/three.js"></script> 
<script type="text/javascript" src="/calculator/general/three_libs/stats.js"></script> 
<script type="text/javascript" src="/calculator/general/three_libs/dat.gui.js"></script>
<script type="text/javascript" src="/calculator/general/three_libs/OrbitControls.js"></script>
<script type="text/javascript" src="/calculator/general/three_libs/ThreeBSP.js"></script>
-->
 
<!--визуализация-->
<script type="text/javascript" src="wrLib.js"></script>
<script type="text/javascript" src="drawWardrobe.js"></script>
<script type="text/javascript" src="drawWardrobeParts.js"></script>
<script type="text/javascript" src="/calculator/general/drawPrimitives.js"></script>
<script type="text/javascript" src="/calculator/general/drawRailingPartsLib_4.0.js"></script>
<!--<script type="text/javascript" src="/calculator/banister/drawBanister_com_4.0.js"></script>-->
<script type="text/javascript" src="/calculator/general/draw2DLib.js"></script>

<!--интерактивность модели-->
<script type="text/javascript" src="/calculator/coupe/modelActions.js"></script>

<!--экспорт в dxf-->
<script type="text/javascript" src="/calculator/general/dxfFileMaker.js"></script>

<!--обмен данными с базой и через файлы-->
<script type="text/javascript" src="/calculator/general/dataExchangeXml_3.0.js"></script>

<!-- правое меню-->
<script src="/calculator/general/right_menu/lighttabs.js"></script>
<link rel="stylesheet" href="/calculator/general/right_menu/lighttabs.css">

<!--расчет цены-->
<script type="text/javascript" src="/calculator/general/priceLib.js"></script>


<!--экспорт в xls-->
<script type="text/javascript" src="/calculator/general/excelExport/tableToXls.js"></script>

<!--расчет спецификации-->
<script type="text/javascript" src="calcSpec.js"></script>
<script type="text/javascript" src="/calculator/general/calcSpecGeneral.js"></script>

<!-- сортируемая таблица для спецификации -->
<link href="/calculator/general/tablelib/theme.default.min.css" rel="stylesheet">
<link href="/calculator/general/tablelib/theme.blue.css" rel="stylesheet">
<script src="/calculator/general/tablelib/jquery.tablesorter.min.js"></script>
<script src="/calculator/general/tablelib/jquery.tablesorter.widgets.min.js"></script>
<script src="/calculator/general/tablelib/parser-input-select.js"></script>
<script src="/calculator/general/tablelib/parser-date.js"></script>
<link rel="stylesheet" href="/manufacturing/general/calc_spec/export_spec.css">
<script src="/manufacturing/general/calc_spec/export_spec.js"></script>


<!--оболочки-->
<script type="text/javascript" src="../general/main.js"></script>
<script type="text/javascript" src="main.js"></script>


<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>
