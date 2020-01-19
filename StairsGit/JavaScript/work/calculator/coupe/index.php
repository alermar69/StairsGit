<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Расчет Шкафа 2.1"); 
?> 

<h1 id = "mainTitle">Коммерческое предложение на шкаф</h1>


<!--служебные поля-->

<div id="calcInfo" style="display: none">
	<select size="1" id="calcType">
		<option value="metal">metal</option>
		<option value="timber"  >timber</option>
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
	<h2 class="raschet">Общий вид:</h2>
	<div id="Stats-output" style="display: none;"></div>
	<div id="WebGL-output"><canvas>Для отображения содержимого откройте страницу в Гугл Хром</canvas></div> 
</div>

<div class="noPrint">
	<button id="openDoors" class="noPrint">Открыть дверки</button>
	<button id="fixDoors" class="noPrint">Заблокировать двери</button>
	<button id="cloneCanvas">Дублировать</button>
	<button onclick="saveCanvasImg(0)">Сохранить png</button>	
	<button id="toggleAll">Свернуть все</button>
</div>
	
<div id="images"></div>

<div class="noPrint">
	<!-- файлы заказа и типовые чертежи -->
	<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/orderFiles/orderFiles.php" ?>

</div>

<div id="2d">
<h2 class="raschet" onclick="recalculate();">Вид спереди:</h2>
<canvas id='mainView'>Обновите браузер</canvas>
</div>


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


<!-- варианты цены 
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/priceEditions.php" ?>
-->

<div id="totalResultWrap">
	<h2 class="raschet">Стоимость заказа</h2>
	<div id="price_wardrobe" class="toggleDiv number"></div>
	<div class="noPrint print-btn">
		<i class="glyphicon glyphicon-print" aria-hidden="true"></i>
	</div>
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
<div id="assembling">
<?$APPLICATION->IncludeComponent(
	"bitrix:main.include",
	".default",
	Array(
		"AREA_FILE_SHOW" => "file",
		"PATH" => "/calculator/coupe/forms/assemblingForm.php",
		"EDIT_TEMPLATE" => ""
	)
);?>
</div>
<div id="modelInfo"> </div>	

<button id="showCost" class="noPrint">Показать себестоимость</button>

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
		"PATH" => "/calculator/coupe/forms/rightMenu.php",
		"EDIT_TEMPLATE" => ""
	)
);?>


<!-- общие библиотеки -->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/libs_man.php" ?>

 
<!--визуализация-->
<script type="text/javascript" src="/manufacturing/coupe/wrLib.js"></script>
<script type="text/javascript" src="/manufacturing/coupe/drawWardrobe.js"></script>
<script type="text/javascript" src="/manufacturing/coupe/drawWardrobeParts.js"></script>
<script type="text/javascript" src="/calculator/general/drawPrimitives.js"></script>
<script type="text/javascript" src="/calculator/general/drawRailingPartsLib_4.0.js"></script>
<!--<script type="text/javascript" src="/calculator/banister/drawBanister_com_4.0.js"></script>-->
<script type="text/javascript" src="/calculator/general/draw2DLib.js"></script>

<!--интерактивность модели-->
<script type="text/javascript" src="modelActions.js"></script>

<!--экспорт в dxf-->
<script type="text/javascript" src="/calculator/general/dxfFileMaker.js"></script>

<!--обмен данными с базой и через файлы
<script type="text/javascript" src="/calculator/general/dataExchangeXml_3.1.js"></script>
-->
<!-- правое меню-->
<script src="/calculator/general/right_menu/lighttabs.js"></script>
<link rel="stylesheet" href="/calculator/general/right_menu/lighttabs.css">

<!--расчет цены-->
<script type="text/javascript" src="/calculator/general/priceLib.js"></script>
<script type="text/javascript" src="priceCalc.js"></script>

<!--изменение оффера-->
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
