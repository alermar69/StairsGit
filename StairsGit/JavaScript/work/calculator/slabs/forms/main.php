
<link href="styles.css" type="text/css" rel="stylesheet" />
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

<h1 id = "mainTitle">Коммерческое предложение</h1>


<div id="descr"></div>


<!-- Информация по технологическим ограничениям -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/slabs/forms/techInfo.php" ?>

<!-- главная форма -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/slabs/forms/mainForm.php" ?>

<!--себестоимость-->
<?php include $GLOBALS['ROOT_PATH']."/calculator/slabs/forms/costForm.php" ?>

<!--расчет цены-->
<script type="text/javascript" src="/calculator/slabs/priceCalc.js"></script>

<!--описание-->
<script type="text/javascript" src="/calculator/slabs/change_offer.js"></script>

<!--оболочки-->
<script type="text/javascript" src="/calculator/slabs/main.js"></script>

<!--обработчик формы монтажа-->
<script type="text/javascript" src="/calculator/general/forms/assemblingFormChange.js"></script>
