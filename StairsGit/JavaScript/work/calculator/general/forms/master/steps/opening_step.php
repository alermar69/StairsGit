<h2>Проем</h2>
<div class="row floorHoleParams">
	<div class="col-7">
		<div class="row">
			<div class="col-5">Тип проема</div>
			<div class="col-7">
				<select class='w-100' id="openingType">
					<option value="квадратный">Квадратный</option>
					<option value="Г-образный">Г-образный</option>
					<option value="dxf">Уникальный, импортировать dxf</option>
				</select>
			</div>
		</div>
		<div class="row master-input-container">
			<div class="col-5">
				Направление:
			</div>
			<div class="col-7 move-input-master" data-id='turnSide'></div>
		</div>
		<div class="row dxfImportInput" style='display: none;'>
			<div class="col-5">
				Импорт DXF
			</div>
			<div class="col-7">
				<button class='btn btn-primary' id='dxfFileMaster'>Выбрать файл</button>
			</div>
		</div>
		<div class="row master-input-container">
			<div class="col-5">Высота от пола до пола:</div>
			<div class="col-7 move-input-master" data-id='staircaseHeight'></div>
		</div>
		
		<div class="row master-input-container">
			<div class="col-5">Толщина перекрытия:</div>
			<div class="col-7 move-input-master" data-id='floorThickness'></div>
		</div>
		<table class='walls_table w-100 tab_2'>
			<tbody>
				<tr><th>Сторона</th><th>Размер</th><th>Стена</th></tr>
				<tr class='aSize'>
					<td>A</td>
					<td class='move-input-master' data-id='floorHoleLength' data-new_id='aSize'></td>
					<td><input type="checkbox" checked id='wallAVisible'></td>
				</tr>
				<tr class='bSize'>
					<td>B</td>
					<td class='move-input-master' data-id='floorHoleWidth' data-new_id='bSize'></td>
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