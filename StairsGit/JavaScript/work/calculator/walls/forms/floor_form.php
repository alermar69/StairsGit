<div id="openingFormWrap">
	<div id="openingForm" class='editionsChangeForm'>
		<h4>Проем</h4>
		<table class="form_table w-100">
			<tbody>
				<tr class="">
					<td>Импорт контура проёма из dxf:</td>
					<td>
						<select name="dxfOpening" id="dxfOpening">
							<option value="нет" selected>нет</option>
							<option value="да">да</option>
						</select>
					</td>
				</tr>
				<tr class="dxfOpeningFileInput">
					<td>Файл контура проёма:</td>
					<td>
						<input type="file" name="dxfFile" id="dxfFile">
					</td>
				</tr>
				<tr class="">
					<td>Ширина:</td>
					<td>
						<input type="number" id="floorHoleWidth" value="2000" step="100">
					</td>
				</tr>
				<tr class="">
					<td>Длина:</td>
					<td>
						<input type="number" id="floorHoleLength" value="2500" step="100">
					</td>
				</tr>
				<tr class="">
					<td>Толщина перекрытия:</td>
					<td>
						<input type="number" id="floorThickness" value="300" step="50">
					</td>
				</tr>
				<tr class="">
					<td>Высота от пола до пола чистовая, мм:</td>
					<td>
						<input type="number" id="staircaseHeight" value="3000" step="100">
					</td>
				</tr>
			</tbody>
		</table>

		<h4>Ориентация лестницы</h4>
		<table class="form_table w-100">
			<tbody>
				<tr class="">
					<td>Базовая кромка:</td>
					<td>
						<select id="floorHoleBaseSide">
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3" selected>3</option>
							<option value="4">4</option>
						</select>
					</td>
				</tr>
				<tr class="">
					<td>Смещение лестницы от перекрытия:</td>
					<td>
						<input type="number" id="staircasePosX" value="0" step="100">
					</td>
				</tr>
				<tr class="">
					<td>Смещение лестницы по высоте:</td>
					<td>
						<input type="number" id="staircasePosY" value="0" step="10">
					</td>
				</tr>
				<tr class="">
					<td>Смещение лестницы от угла:</td>
					<td>
					<input type="number" id="staircasePosZ" value="10" step="10">
					</td>
				</tr>
				<tr class="">
					<td>Угол поворота лестницы, гр.:</td>
					<td>
						<input type="number" id="stairCaseRotation" value="0" step="10">
					</td>
				</tr>
			</tbody>
		</table>

		<h4>Прочее</h4>
		<table class="form_table w-100">
			<tbody>
				<tr class="">
					<td>Подъем пола нижнего этажа, мм:</td>
					<td>
						<input type="number" id="floorOffsetBot" value="0" step="100">
					</td>
				</tr>
				<tr class="">
					<td>Подъем пола верхнего этажа, мм:</td>
					<td>
						<input type="number" id="floorOffsetTop" value="0" step="100">
					</td>
				</tr>
				<tr class="">
					<td>Высота несущей балки:</td>
					<td>
						<input type="number" id="beamWidth" value="200" step="10">
					</td>
				</tr>
				<tr class="">
					<td>Смещение балки по X:</td>
					<td>
						<input type="number" id="beamPosX" value="0" step="10">
					</td>
				</tr>
				<tr class="">
					<td>Смещение балки по Y:</td>
					<td>
						<input type="number" id="beamPosY" value="0" step="10">
					</td>
				</tr>
				<tr class="">
					<td>Смещение балки по Z:</td>
					<td>
						<input type="number" id="beamPosZ" value="0" step="10">
					</td>
				</tr>
				<tr class="">
					<td>Состав верхнего перекрытия:</td>
					<td>
						<textarea id="topFloorStructure" rows="1" cols="40" class="comments" style="height: 51px;"></textarea>
					</td>
				</tr>
				<tr class="">
					<td>Состав нижнего перекрытия:</td>
					<td>
						<textarea id="botFloorStructure" rows="1" cols="40" class="comments" style="height: 51px;"></textarea>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>

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


