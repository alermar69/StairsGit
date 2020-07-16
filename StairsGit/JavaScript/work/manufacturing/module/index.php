<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Расчет модульных v.1.6"); 
?> 

<h1 id = "mainTitle">Расчет модульной лестницы</h1>


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
		"PATH" => "/calculator/module/content/history.php",
		"EDIT_TEMPLATE" => ""
	)
);?>



<!-- визуализация -->
<div id="visualisation">
	<h2 class="raschet" onclick="recalculate();">Общий вид лестницы:</h2>
	<div id="Stats-output" style="display: none;"></div>

	<div id="WebGL-output"><canvas>Для отображения содержимого откройте страницу в Гугл Хром</canvas></div> 
</div>

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



</div>

<div id="banisterСonstructForm">
<h2>Конструкция балюстрады</h2>
<!-- форма параметров конструкции ограждения-->
<?$APPLICATION->IncludeComponent(
	"bitrix:main.include",
	".default",
	Array(
		"AREA_FILE_SHOW" => "file",
		"PATH" => "/calculator/banister/forms/banister_construct_form.php",
		"EDIT_TEMPLATE" => ""
	)
); ?>



</div>
	
	
	

<!--форма доставка, сборка-->
<div id="assembling">
<h2>Доставка, сборка на объекте</h2>
	<?$APPLICATION->IncludeComponent(
		"bitrix:main.include",
		".default",
		Array(
			"AREA_FILE_SHOW" => "file",
			"PATH" => "/calculator/general/forms/assemblingForm.php",
			"EDIT_TEMPLATE" => ""
		)
	); ?>

</div>

<div id="cost" style="display: none">
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

<h3>Общая себестоимость</h3>
<div id="total_cost">
	<p>Расчет еще не произведен</p>
</div>

<h3>Себестоимость каркаса и ступеней</h3>
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

</div>



<div id="result" style="display: none;"></div>

<div id="modelInfo"> </div>

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

<div id="works"></div>

<div class="content">

Комментарии к спецификации:<br/>  <textarea id="spec_comments" rows="3" cols="80" class="comments"></textarea>

<!-- правое меню -->

<?$APPLICATION->IncludeComponent(
	"bitrix:main.include",
	".default",
	Array(
		"AREA_FILE_SHOW" => "file",
		"PATH" => "/calculator/general/right_menu/rightMenu.php",
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
 
<!--визуализация-->
<script type="text/javascript" src="drawStaircase.js"></script>
<script type="text/javascript" src="drawStaircaseParts.js"></script>
<script type="text/javascript" src="/calculator/general/drawCarcasPartsLib.js"></script>

<!--расчет спецификации-->
<script type="text/javascript" src="calcSpec_2.0.js"></script>

<!--оболочки-->
<script type="text/javascript" src="../general/main.js"></script>
<script type="text/javascript" src="main.js"></script>


<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>
