<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Расчет пожарных лестниц v.1.0"); 
?> 

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
		<option value="fire" selected >fire</option>	
		<option value="geometry">geometry</option>		
	</select>
	<input type="text" value="1.0" id = "calcVersion">
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
		"PATH" => "content/history.php",
		"EDIT_TEMPLATE" => ""
	)
);?>



<!-- визуализация 
<div id="visualisation">
	<h2 class="raschet" onclick="recalculate();">Общий вид лестницы:</h2>
	<div id="Stats-output" style="display: none;"></div>

	<div id="WebGL-output"><canvas>Для отображения содержимого откройте страницу в Гугл Хром</canvas></div> 
</div>

-->

<!-- Файлы заказа-->
<?$APPLICATION->IncludeComponent(
	"bitrix:main.include",
	".default",
	Array(
		"AREA_FILE_SHOW" => "file",
		"PATH" => "/orders/files/orderFiles.php",
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

<h2 class="raschet" onclick='recalculate()'>Общая стоимость лестницы</h2>
<div id="totalResult">
<p>Расчет еще не выполнен.</p>
<p>Для того, чтобы рассчитать стоимость лестницы введите все необходимые параметры и нажмите на
заголовок этого раздела.</p>
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
<h2>Комплект поставки</h2>

<!-- форма параметров проемов каркаса-->
<?$APPLICATION->IncludeComponent(
	"bitrix:main.include",
	".default",
	Array(
		"AREA_FILE_SHOW" => "file",
		"PATH" => "forms/carcas_form.php",
		"EDIT_TEMPLATE" => ""
	)
);?>



<!--форма доставка, сборка-->
<div id="assembling">
<h2>Дополнительные услуги:</h2>
	<?$APPLICATION->IncludeComponent(
		"bitrix:main.include",
		".default",
		Array(
			"AREA_FILE_SHOW" => "file",
			"PATH" => "forms/assemblingForm.php",
			"EDIT_TEMPLATE" => ""
		)
	); ?>

</div>



<div id="cost" style="display: none;">
<h2 class="raschet" onclick='recalculate()' >Расчет себестоимости</h2>

<h4>Коэффициенты на цену</h4>
<table class="form_table" ><tbody>
<tr><th>Наименование</th><th>к-т на себестоимость</th><th>к-т на цену</th> </tr>
<tr>
	<td>Лестница:</td>
	<td><input id="carcasCostFactor" type="number" value="1"></td>
	<td><input id="carcasPriceFactor" type="number" value="1"></td>
</tr>
<tr>
	<td>Доставка:</td>
	<td><input id="deliveryCostFactor" type="number" value="1"></td>
	<td><input id="deliveryPriceFactor" type="number" value="1"></td>
</tr>
<tr>
	<td>Монтаж:</td>
	<td><input id="assemblingCostFactor" type="number" value="1"></td>
	<td><input id="assemblingPriceFactor" type="number" value="1"></td>
</tr>

<tr>
	<td>Испытания:</td>
	<td><input id="testingCostFactor" type="number" value="1"></td>
	<td><input id="testingPriceFactor" type="number" value="1"></td>
</tr>

</tbody> </table>

<h4>Размер скидки, %: <input id="discountFactor" type="number" value="30"></h4>

<h3>Общая себестоимость</h3>
<div id="total_cost">
	<p>Расчет еще не произведен</p>
</div>

<h3>Себестоимость лестницы</h3>
<div id="cost_carcas">
	<p>Расчет еще не произведен</p>
</div>


</div>



<div id="result" style="display: none;"></div>

<div id="specificationList" style="display: none;">
<h2>Приблизительный расход материала</h2>

	<div id="materialNeed"></div>

</div>


<!-- общие библиотеки -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/libs_man.php"
	foreach($scripts as $script){
		$printScript = true;
		if(isset($script['only_for']) && !in_array($calc_type, $script['only_for'])) $printScript = false;
		if($printScript){
			echo '<script type="text/javascript" src="' . $script['url'] . '"></script>';
		};
	};
?>



<!-- правое меню--
<script src="/calculator/general/right_menu/lighttabs.js"></script>
<link rel="stylesheet" href="/calculator/general/right_menu/lighttabs.css">

<!--изменение оффера-->
<script type="text/javascript" src="change_offer.js"></script>


<!--расчет цены-->
<script type="text/javascript" src="priceCalc.js"></script>

<!--оболочки-->
<script type="text/javascript" src="main.js"></script>


<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>