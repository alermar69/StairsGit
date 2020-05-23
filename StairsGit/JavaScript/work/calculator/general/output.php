<!-- визуализация -->
<div id="visualisation">
	<h2 class="raschet" onclick="recalculate();">Общий вид:</h2>
	<div id="Stats-output" style="display: none;"></div>

	<div id="WebGL-output"><canvas>Для отображения содержимого откройте страницу в Гугл Хром</canvas></div> 
</div>

<div class="noPrint">
	<button id="sendMessageModalShow" class='btn btn-primary'>Отправить КП</button>	
	<button id='createBuildingTask'>Распечатать строительное задание</button>
	<button onclick="saveCanvasImg(0)">Сохранить png</button>	
	<button id="toggleAll">Свернуть все</button>
</div>

<!-- блоки из производственного модуля -->
<div style='display: none'>	
	<?php include $GLOBALS['ROOT_PATH']."/manufacturing/general/testing/forms/mainForm.php" ?>
	<!-- рабочие чертежи -->
	<div id="svgDrawings">		
		<div id='svgParForm' style="display: none;">
			Масштаб размеров: <input id="svgDimScale" type='number' value='1'>
			<button class="makeSvg">Обновить</button>
			<button id="saveSvg2">Сохранить SVG</button>
			<button id="saveDxf2">Сохранить DXF</button>
		</div>
		<div id="svgLayers"></div>
		<div id='svgOutputDiv'></div>	
	</div>
</div>
	
<div id="images"></div>

<div class="noPrint">
	<!-- файлы заказа и типовые чертежи -->
	<?php include $GLOBALS['ROOT_PATH']."/orders/files/orderFiles.php" ?>

</div>

<!-- модальное окно создания/редактирования письма -->
<?php include $GLOBALS['ROOT_PATH'].'/orders/mail/forms/mailModal.php' ?>

<!-- описание, комплектация -->
<?php include "content/description.php" ?>

<!-- варианты цены -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/priceEditions.php" ?>

<div id="totalResultWrap">
	<h2 class="raschet">Стоимость заказа</h2>
	<div id="totalResult" class="toggleDiv number"></div>
	<div class="noPrint print-btn">
		<i class="glyphicon glyphicon-print" aria-hidden="true"></i>
	</div>
	<div class="noPrint estimate-btn">
		<i class="glyphicon glyphicon-briefcase" aria-hidden="true"></i>
	</div>
</div>


<div id="productionTimeWrap">
	<h2 class="raschet">Сроки</h2>
	<div id="productionTime" class="toggleDiv"></div>
</div>

<!-- О компании -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/content/about.php" ?>
