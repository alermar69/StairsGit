<div id='renderControls'>
	Шаблон: <select id='textureTemplate'>
				<option value="Париж">Париж</option>
				<option value="Осло">Осло</option>
				<option value="Милан">Милан</option>
				<option value="Классика1">Классика1</option>
				<option value="Классика2">Классика2</option>
			</select>
			<br/>
			<br/>
	
	<table class="form_table"><tbody>
		<tr><th>Объект</th><th>Текстура</th><th>Цвет</th><th>Масштаб</th></tr>
		<tr>
			<td>Стены</td>
			<td>
				<input type='text' value='' id='wallsMat'>
				<button class="showModal noPrint" data-modal="textureModal" data-unit="wallsMat">эскизы</button>
			</td>
			<td><input id="wallsColor" type="color" value="#ffffff"></td>
			<td><input id="mapScaleWalls" type="number" value="1"></td>
		</tr>
		<tr>
			<td>Пол первый этаж</td>
			<td>
				<input type='text' value='' id='floorMat'>
				<button class="showModal noPrint" data-modal="textureModal" data-unit="floorMat">эскизы</button>
			</td>
			<td><input id="floorColor" type="color" value="#ffffff"></td>
			<td><input id="mapScaleFloor" type="number" value="1"></td>
		</tr>
		<tr>
			<td>Пол второй этаж</td>
			<td>
				<input type='text' value='' id='floorMat2'>
				<button class="showModal noPrint" data-modal="textureModal" data-unit="floorMat2">эскизы</button>
			</td>
			<td><input id="floorColor2" type="color" value="#ffffff"></td>
			<td><input id="mapScaleTopFloor" type="number" value="1"></td>
		</tr>
		<tr>
			<td>Потолок первый этаж</td>
			<td>
				<input type='text' value='' id='ceilMat'>
				<button class="showModal noPrint" data-modal="textureModal" data-unit="ceilMat">эскизы</button>
			</td>
			<td><input id="ceilColor" type="color" value="#ffffff"></td>
			<td><input id="mapScaleCeil" type="number" value="1"></td>
		</tr>
		<tr>
			<td>Цвет ребер</td>
			<td>
				<select id='wireframeColor'>
					<option value="#FFFFFF">белый</option>
					<option value="#000000">черный</option>					
				</select>
			</td>
		</tr>
	</tbody></table>

</div>

<br/>
<button class='updateTextures btn btn-primary' type="button" name="button">Обновить текстуры</button>
<button class='showTextures btn btn-primary' type="button" name="button">Включить текстуры</button><br/>