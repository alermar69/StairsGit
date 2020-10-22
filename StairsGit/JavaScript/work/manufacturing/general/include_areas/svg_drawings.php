<div id="svgDrawings">		
	<h2>Чертежи</h2>
	<button class="makeSvg">Обновить</button>
	<div id='svgParForm' style="display: none;">
		Масштаб размеров: <input id="svgDimScale" type='number' value='1'>
		<button class="makeSvg">Обновить</button>
		<button id="saveSvg2">Сохранить SVG</button>
		<button id="saveDxf2">Сохранить DXF</button>
	</div>
	<div id="svgLayers"></div>
	<div id='svgOutputDivDraw'></div>
	<div id="svg"></div>
	
	<h2>Контура для чпу</h2>
	<button class="showDxf">Обновить</button>
	<button onclick="exportToDxf(dxfPrimitivesArr);">Сохранить dxf</button>
	<div id="dxfPrv"></div>
</div>