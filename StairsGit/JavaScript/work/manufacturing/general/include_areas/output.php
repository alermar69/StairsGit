<!-- визуализация -->
<div id="visualisation">
    <h2 class="raschet" onclick="recalculate();">Общий вид:</h2>
    <div id="Stats-output" style="display: none;"></div>

    <div id="WebGL-output"><canvas>Для отображения содержимого откройте страницу в Гугл Хром</canvas></div>
</div>



<div class="noPrint">
	<button id='createBuildingTask'>Распечатать строительное задание</button>
	<button id="cloneCanvas">Дублировать</button>
	<button onclick="exportToDxf(dxfPrimitivesArr);">Сохранить dxf</button>
	<button onclick="exportToObj($['vl_1']);">Сохранить OBJ</button>
	<button onclick="saveCanvasImg(0)">Сохранить png</button>
	<button id="toggleAll">Свернуть все</button>
	<button id="toSvg">Снимок</button>
	<button id="showDxf">Показать dxf</button>
	<button class="makeSvg">Чертежи</button>
</div>	
<div id="images"></div>

<div class="noPrint">	
	<div id="svg"></div>	
	<div id="dxfPrv"></div>

	<!-- тестирование -->
	<?php include $GLOBALS['ROOT_PATH']."/manufacturing/general/testing/forms/mainForm.php" ?>

	<!-- файлы заказа и типовые чертежи -->
	<?php include $GLOBALS['ROOT_PATH']."/orders/files/orderFiles.php" ?>
	
	<!-- рабочие чертежи -->
	<div id="svgDrawings">		
		<div id='svgParForm' style="display: none;">
			Масштаб размеров: <input id="svgDimScale" type='number' value='1'>
			<button class="makeSvg">Обновить</button>
			<button id="saveSvg2">Сохранить SVG</button>
			<button id="saveDxf2">Сохранить DXF</button>
		</div>
		<div id="svgLayers"></div>
		<div id='svgOutputDivDraw'></div>	
	</div>
	
	<!-- модальное окно создания/редактирования письма -->
	<?php include $GLOBALS['ROOT_PATH'].'/orders/mail/forms/mailModal.php' ?>

	

</div>