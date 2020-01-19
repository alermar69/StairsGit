<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Расчет Шкафа 1.0"); 
?> 

<h1 id = "mainTitle">Расчет шкафа 1.0</h1>


<!--служебные поля-->

<div id="calcInfo" style="display: none">
	<select size="1" id="calcType">
		<option value="metal" selected >metal</option>
		<option value="timber"  >timber</option>
		<option value="vint">vint</option>
		<option value="vhod">vhod</option>
		<option value="mono"  >mono</option>	
		<option value="geometry">geometry</option>		
	</select>
	<input type="text" value="3.9" id = "calcVersion">
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
	<h2 class="raschet" onclick="recalculate();">Общий вид лестницы:</h2>
	<div id="Stats-output" style="display: none;"></div>

	<div id="WebGL-output"><canvas>Для отображения содержимого откройте страницу в Гугл Хром</canvas></div> 
</div>

<div id="openDoors">Открыть дверки</div>
<p class="raschet" onclick="exportToDxf(dxfPrimitivesArr);">Экспорт контуров в dxf</p>

<!-- форма параметров каркаса шкафа -->
<?$APPLICATION->IncludeComponent(
	"bitrix:main.include",
	".default",
	Array(
		"AREA_FILE_SHOW" => "file",
		"PATH" => "/calculator/wardrobe/forms/main_form.php",
		"EDIT_TEMPLATE" => ""
	)
);?>


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

<!-- Картинки, описание, комплектация -->
<?$APPLICATION->IncludeComponent(
	"bitrix:main.include",
	".default",
	Array(
		"AREA_FILE_SHOW" => "file",
		"PATH" => "content/description.php",
		"EDIT_TEMPLATE" => ""
	)
);?>


<h3 class="raschet">Стоимость шкафа:</h3>
<div id="price_wardrobe">	
	<p>Расчет еще не произведен.</p>
</div>

<!-- О компании -->
<?$APPLICATION->IncludeComponent(
	"bitrix:main.include",
	".default",
	Array(
		"AREA_FILE_SHOW" => "file",
		"PATH" => "content/about.php",
		"EDIT_TEMPLATE" => ""
	)
);?>

<div id="carcasForm">
<h2>Характеристики лестницы</h2>



<h3>Стоимость каркаса и ступеней: </h3>
	<div id="resultCarcas">
	<p>Расчет еще не произведен.</p>
</div>

</div>



	
	
	


<div id="cost">
<h2 class="raschet" onclick='recalculate()' >Расчет себестоимости</h2>

<h4>Коэффициенты на цену</h4>
<table class="form_table" ><tbody>
<tr><th>Наименование</th><th>к-т на себестоимость</th><th>к-т на цену</th> </tr>
<tr>
	<td>Каркас:</td>
	<td><input id="carcasCostFactor" type="number" value="1"></td>
	<td><input id="carcasPriceFactor" type="number" value="1"></td>
</tr>
<tr>
	<td>Ступени:</td>
	<td><input id="treadsCostFactor" type="number" value="1"></td>
	<td><input id="treadsPriceFactor" type="number" value="1"></td>
<tr>
	<td>Перила:</td>
	<td><input id="railingCostFactor" type="number" value="1"></td>
	<td><input id="railingPriceFactor" type="number" value="1"></td>
</tr>
<tr>
	<td>Сборка:</td>
	<td><input id="assemblingCostFactor" type="number" value="1"></td>
	<td><input id="assemblingPriceFactor" type="number" value="1"></td>
</tr>
</tbody> </table>

<h4>Размер скидки, %: <input id="discountFactor" type="number" value="30"></h4>

Комментарии:<br/>  <textarea id="discountComments" rows="1" cols="80" class="comments"></textarea>
<h3>Общая себестоимость</h3>
<div id="total_cost">
	<p>Расчет еще не произведен</p>
</div>

<h3>Данные для расчета себестоимости</h3>
<div id="cost_carcas">
	<p>Расчет еще не произведен</p>
</div>

<h3>Себестоимость ограждений лестницы</h3>
<div id="cost_perila">
	<p>Расчет еще не произведен</p>
</div>

<h3>Себестоимость балюстрады</h3>
<div id="cost_banister">
	<p>Расчет еще не произведен</p>
</div>

<h3>Себестоимость доставки, сборки</h3>
<div id="cost_assembling">
	<p>Расчет еще не произведен</p>
</div>

<h3>Себестоимость шкафа</h3>
<div id="cost_wr">
	<p>Расчет еще не произведен</p>
</div>

</div>



<div id="result" style="display: none;"></div>

<div id="specificationList" style="display: none;">
<h2>Приблизительный расход материала</h2>

	<div id="materialNeed"></div>

</div>

<!-- правое меню -->

<?$APPLICATION->IncludeComponent(
	"bitrix:main.include",
	".default",
	Array(
		"AREA_FILE_SHOW" => "file",
		"PATH" => "/calculator/wardrobe/forms/rightMenu.php",
		"EDIT_TEMPLATE" => ""
	)
);?>




<!--общие библитотеки-->
<script async="" src="/calculator/forms/FileSaver.min.js" /></script>
<script type="text/javascript" src="/calculator/general/orderFiles/getLinks.js" /></script>

<!--графика-->
<script type="text/javascript" src="/calculator/general/viewports_2.1.js"></script>
<script type="text/javascript" src="/calculator/general/three_libs/three.js"></script> 
<script type="text/javascript" src="/calculator/general/three_libs/stats.js"></script> 
<script type="text/javascript" src="/calculator/general/three_libs/dat.gui.js"></script>
<script type="text/javascript" src="/calculator/general/three_libs/OrbitControls.js"></script>
<script type="text/javascript" src="/calculator/general/three_libs/ThreeBSP.js"></script>

 
<!--визуализация-->
<script type="text/javascript" src="drawWardrobe.js"></script>
<script type="text/javascript" src="drawWardrobeParts.js"></script>
<script type="text/javascript" src="/calculator/general/drawPrimitives.js"></script>

<!--экспорт в dxf-->
<script type="text/javascript" src="/calculator/general/dxfFileMaker.js"></script>

<!--обмен данными с базой и через файлы-->
<script type="text/javascript" src="/calculator/general/dataExchangeXml_3.0.js"></script>

<!-- правое меню-->
<script src="/calculator/general/right_menu/lighttabs.js"></script>
<link rel="stylesheet" href="/calculator/general/right_menu/lighttabs.css">

<!--расчет цены-->
<script type="text/javascript" src="/calculator/general/priceLib.js"></script>
<script type="text/javascript" src="priceCalc.js"></script>

<!--изменение оффера-
<script type="text/javascript" src="change_offer.js"></script>


<!--расчет цены--
<script type="text/javascript" src="priceCalc.js"></script>
<script type="text/javascript" src="/calculator/general/priceLib.js"></script>
<script type="text/javascript" src="/calculator/banister/priceCalcBanister.js"></script>

<!--потребность в материалах--
<script type="text/javascript" src="/calculator/general/materials.js"></script>
->

<!--оболочки-->
<script type="text/javascript" src="main.js"></script>


<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>
