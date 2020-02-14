<h1>Настройка Проёма</h1>
<div class="row">
	<div class="col-7">
		<div class="row">
			<div class="col-5">Выбор типа проёма</div>
			<div class="col-7">
				<select class='w-100' id="openingType">
					<option value="квадратный">Квадратный</option>
					<option value="Г-образный">Г-образный</option>
					<option value="dxf">Уникальный, импортировать dxf</option>
				</select>
			</div>
		</div>
		<div class="row">
			<div class="col-5">
				Поворот лестницы:
			</div>
			<div class="col-7">
				<select name="turnSide" id="turnSideMaster" class='master-input w-100' data-id='turnSide'>
					<option value="правое">правое</option>
					<option value="левое">левое</option>
				</select>
			</div>
		</div>
		<div class="row dxfImportInput" style='display: none;'>
			<div class="col-5">
				Импорт DXF
			</div>
			<div class="col-7">
				<button class='btn btn-primary' id='dxfFileMaster'>Выбрать файл</button>
			</div>
		</div>
		<table class='walls_table w-100'>
			<tbody>
				<tr><td>Стена</td><td>Размер</td><td>Наличие</td></tr>
				<tr class='aSize'>
					<td>A</td>
					<td><input id="aSize" class="master-input" data-id="floorHoleLength" value="4000" type="number"></td>
					<td><input type="checkbox" checked id='wallAVisible'></td>
				</tr>
				<tr class='bSize'>
					<td>B</td>
					<td><input id="bSize" class="master-input" data-id="floorHoleWidth" value="4000" type="number"></td>
					<td><input type="checkbox" checked id='wallBVisible'></td>
				</tr>
				<tr>
					<td>C</td>
					<td><input class='cSize' id="cSize" value="1300" type="number"></td>
					<td><input type="checkbox" checked id='wallCVisible'></td>
				</tr>
				<tr>
					<td>D</td>
					<td><input class='dSize' id="dSize" value="900" type="number"></td>
					<td><input type="checkbox" checked id='wallDVisible'></td>
				</tr>
				<tr class='dSize'>
					<td>E</td>
					<td></td>
					<td><input type="checkbox" checked id='wallEVisible'></td>
				</tr>
				<tr class='dSize'>
					<td>F</td>
					<td></td>
					<td><input type="checkbox" checked id='wallFVisible'></td>
				</tr>
			</tbody>
		</table>
	</div>
	<div class="col-5 opening_image">
		<img src="/calculator/images/master/rect_opening.jpg" alt="">
	</div>
</div>