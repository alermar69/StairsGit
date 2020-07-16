<?php 
	if (!(isset($GLOBALS['IS_YII']) && $GLOBALS['IS_YII'])) {
		include $GLOBALS['ROOT_PATH']."/calculator/general/forms/priceEditions.php";
	}
?>

<div id="totalResultWrap" class="printBlock">
	<h2 class="raschet">Стоимость заказа</h2>
	<div id="totalResult" class="toggleDiv number"></div>
	<div class="noPrint print-btn">
		<i class="glyphicon glyphicon-print" aria-hidden="true"></i>
	</div>
	<div class="noPrint estimate-btn">
		<i class="glyphicon glyphicon-briefcase" aria-hidden="true"></i>
	</div>
</div>


<div id="productionTimeWrap" class="printBlock">
	<h2 class="raschet">Сроки</h2>
	<div id="productionTime" class="toggleDiv"></div>
</div>