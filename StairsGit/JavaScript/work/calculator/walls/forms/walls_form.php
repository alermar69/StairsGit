<!-- <table class="form_table wallsParams" id='wallsTable'><tbody>
	<tr><th>Стена</th><th>1</th><th>2</th><th>3</th><th>4</th></tr> 
	
	<tr>
		<td>Длина</td>
		<td><input type="number" id="wallLength_1" value="5000" step="100"/></td>
		<td><input type="number" id="wallLength_2" value="5000" step="100"/></td>
		<td><input type="number" id="wallLength_3" value="5000" step="100"/></td>
		<td><input type="number" id="wallLength_4" value="5000" step="100"/></td>
	</tr>
	<tr>
		<td>Высота</td>
		<td><input type="number" id="wallHeight_1" value="5000" step="100"/></td>
		<td><input type="number" id="wallHeight_2" value="5000" step="100"/></td>
		<td><input type="number" id="wallHeight_3" value="5000" step="100"/></td>
		<td><input type="number" id="wallHeight_4" value="5000" step="100"/></td>
	</tr>
	<tr>
		<td>Позиция X</td>
		<td><input type="number" id="wallPositionX_1" value="-2500" step="100"/></td>
		<td><input type="number" id="wallPositionX_2" value="-2500" step="100"/></td>
		<td><input type="number" id="wallPositionX_3" value="1000" step="100"/></td>
		<td><input type="number" id="wallPositionX_4" value="-2500" step="100"/></td>
	</tr>
	<tr>
		<td>Позиция Z</td>
		<td><input type="number" id="wallPositionZ_1" value="0" step="100"/></td>
		<td><input type="number" id="wallPositionZ_2" value="5000" step="100"/></td>
		<td><input type="number" id="wallPositionZ_3" value="0" step="100"/></td>
		<td><input type="number" id="wallPositionZ_4" value="0" step="100"/></td>
	</tr>
	<tr>
		<td>Толщина</td>
		<td><input type="number" id="wallThickness_1" value="150" step="100"/></td>
		<td><input type="number" id="wallThickness_2" value="150" step="100"/></td>
		<td><input type="number" id="wallThickness_3" value="150" step="100"/></td>
		<td><input type="number" id="wallThickness_4" value="150" step="100"/></td>
	</tr>

	</tbody>
</table> -->
<table class="form_table">
	<tbody>
		<tr>
			<th>Стена</th>
			<th>Размеры</th>
			<th>Позиция</th>
		</tr>
		<tr class='wallRow' data-object_selector='wallRow' data-id='1'>
			<td>1</td>
			<td>
				<div>Длина: <input type="number" id="wallLength_1" value="5000" step="100"/></div>
				<div>Высота: <input type="number" id="wallHeight_1" value="5000" step="100"/></div>
				<div>Толщина: <input type="number" id="wallThickness_1" value="150" step="50" /></div>
			</td>
			<td>
				<div>X: <input type="number" id="wallPositionX_1" value="-2500" step="100"/></div>
				<div>Z: <input type="number" id="wallPositionZ_1" value="0" step="100"/></div>
			</td>
		</tr>
		<tr class='wallRow' data-object_selector='wallRow' data-id='2'>
			<td>2</td>
			<td>
				<div>Длина: <input type="number" id="wallLength_2" value="5000" step="100"/></div>
				<div>Высота: <input type="number" id="wallHeight_2" value="5000" step="100"/></div>
				<div>Толщина: <input type="number" id="wallThickness_2" value="150" step="50"/></div>
			</td>
			<td>
				<div>X: <input type="number" id="wallPositionX_2" value="-2500" step="100" /></div>
				<div>Z: <input type="number" id="wallPositionZ_2" value="5000" step="100" /></div>
			</td>
		</tr>
		<tr class='wallRow' data-object_selector='wallRow' data-id='3'>
			<td>3</td>
			<td>
				<div>Длина: <input type="number" id="wallLength_3" value="5000" step="100" /></div>
				<div>Высота: <input type="number" id="wallHeight_3" value="5000" step="100" /></div>
				<div>Толщина: <input type="number" id="wallThickness_3" value="150" step="50" /></div>
			</td>
			<td>
				<div>X: <input type="number" id="wallPositionX_3" value="1000" step="100" /></div>
				<div>Z: <input type="number" id="wallPositionZ_3" value="0" step="100" /></div>
			</td>
		</tr>
		<tr class='wallRow' data-object_selector='wallRow' data-id='4'>
			<td>4</td>
			<td>
				<div>Длина: <input type="number" id="wallLength_4" value="5000" step="100" /></div>
				<div>Высота: <input type="number" id="wallHeight_4" value="5000" step="100" /></div>
				<div>Толщина: <input type="number" id="wallThickness_4" value="150" step="50" /></div>
			</td>
			<td>
				<div>X: <input type="number" id="wallPositionX_4" value="-2500" step="100" /></div>
				<div>Z: <input type="number" id="wallPositionZ_4" value="0" step="100" /></div>
			</td>
		</tr>
	</tbody>
</table>
<button id='setWallsPos' type="button" name="button">Стены по проему</button>
<button id='mirrorWalls' type="button" name="button">Отзеркалить обстановку</button>
<button id='mooveWall' type="button" name="button">Переместить</button>

<h3>Выступы и блоки</h3>

<input type="hidden" id="wallLedgeAmt" value="0"/>

<table class="form_table wallsParams" id='wallLedgesTable' data-counter="wallLedgeAmt">
	<tbody>
		<tr>
			<th>ID</th>
			<th>Тип</th>
			<th>№ стены</th>
			<th>Размеры</th>
			<th>Позиция</th>
			<th>Материал</th>
			<th>Цвет</th>
			<th>База</th>
			<th></th>
		</tr>
	</tbody>
</table>

<button id='addWallLedge'>Добавить выступ</button>
<button id='redrawWalls'>Обновить</button>
<button id='mooveLedge' type="button" name="button">Переместить</button>
