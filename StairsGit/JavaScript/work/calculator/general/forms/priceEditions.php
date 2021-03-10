<div class="priceEditions printBlock" id='priceEditions'>
	<?
		if (isset($GLOBALS['MULTI']) && $GLOBALS['MULTI']) {?>
				<h2 id="priceEditionsHeader">Этажи</h2>
		<?}else{?>
			<h2 id="priceEditionsHeader">Варианты комплектации</h2>
		<?}
	?>
	
	<div class="row" id="priceItemsWrap"></div>
	
	<div class='noPrint' id='priceEditionsControls'>
		<button id="addPriceItem">Добавить</button>
		<button id="setMainPriceItem">Главная</button>
		<button id="removePriceItem">Удалить</button>
		<button id="replacePriceItem">Заменить</button>
		<button id="moovePriceItem">Сдвинуть</button>	
		<button id="reindexPriceItems">Названия</button>
		<button class="recalculatePrices">Пересчитать все</button>
		<button id="updateAllItems">Изменить все</button>
		<button id="deleteAllItems">Удалить все</button>
		<button id="addFromOrder">Добавить из заказа</button>
	</div>

</div>
