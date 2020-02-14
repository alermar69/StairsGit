<label for="dxfOpening">Импорт контура проёма из dxf</label>
<select name="dxfOpening" id="dxfOpening">
	<option value="нет" selected>нет</option>
	<option value="да">да</option>
</select><br>

<div class='dxfOpeningFileInput' style='display:none;'>
	<label for="dxfFile">Файл контура проёма</label>
	<input type="file" name="dxfFile" id="dxfFile"><br>
</div>

<label for="floorHoleWidth">Ширина</label>
<input type="number" id="floorHoleWidth" value="2000" step="100"><br>
<label for="floorHoleLength">Длина</label>
<input type="number" id="floorHoleLength" value="2500" step="100"><br>
<label for="floorThickness">Толщина перекрытия</label>
<input type="number" id="floorThickness" value="300" step="50"><br>

<label for="staircaseHeight">Высота от пола до пола чистовая, мм:</label>
<input type="number" id="staircaseHeight" value="3000" step="100"><br>

<label for="floorOffsetBot">Подъем пола нижнего этажа, мм:</label>
<input type="number" id="floorOffsetBot" value="0" step="100"><br>

<label for="floorOffsetTop">Подъем пола верхнего этажа, мм:</label>
<input type="number" id="floorOffsetTop" value="0" step="100"><br>

<label for="staircasePosX">Смещение лестницы по X</label>
<input type="number" id="staircasePosX" value="0" step="100"><br>

<label for="staircasePosX">Смещение лестницы по Y</label>
<input type="number" id="staircasePosY" value="0" step="10"><br>

<label for="staircasePosZ">Смещение лестницы по Z</label>
<input type="number" id="staircasePosZ" value="10" step="10"><br>

<label for="stairCaseRotation">Угол поворота лестницы, гр.</label>
<input type="number" id="stairCaseRotation" value="0" step="10"><br>


<label for="beamHeight">Высота несущей балки</label>
<input type="number" id="beamWidth" value="200" step="10"><br>

<label for="beamPosY">Смещение балки по X</label>
<input type="number" id="beamPosX" value="0" step="10"><br>

<label for="beamPosY">Смещение балки по Y</label>
<input type="number" id="beamPosY" value="0" step="10"><br>

<label for="beamPosY">Смещение балки по Z</label>
<input type="number" id="beamPosZ" value="0" step="10"><br>


<!--Тип верхних ступеней лестницы-->
<select id="topThreadsType" size="1" onchange="" style="display: none;">
	<option value="прямые">прямые</option>
	<option value="площадка">площадка</option>
	<option value="забег вправо"  >забег вправо</option>
	<option value="забег влево">забег влево</option>
	<option value="винтовая площадка">винтовая площадка</option>
</select><br>

<label for="topThreadsWidth" style="display: none;">Ширина марша</label>
<input type="number" id="topThreadsWidth" value="900" style="display: none;"><br>

<input type="hidden" id="topFloorAmt" value="0">

<table class="form_table" id="topFloorLedgesTable" data-counter="topFloorAmt">
	<tbody>
		<tr>
			<th>Базовая кромка</th>
			<th>Длина</th>
			<th>Ширина</th>
			<th>Смещение</th>
			<th></th>
		</tr> 
	</tbody>
</table>

<button id='addTopFloorLedge'>Добавить выступ</button>
<button id='redrawTopFloor'>Обновить</button>


