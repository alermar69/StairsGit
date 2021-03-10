<div>
	<h2 class="raschet">Позиция этажа</h2>
	<div class="toggleDiv">
		<h4>Позиция</h4>
		<table class="form_table w-100">
			<tbody>
				<tr class="">
					<td>X:</td>
					<td>
						<input type="number" id="floorPosX" value="0" step="100">
					</td>
				</tr>
				<tr class="">
					<td>Y:</td>
					<td>
						<input type="number" id="floorPosY" value="0" step="10">
					</td>
				</tr>
				<tr class="">
					<td>Z:</td>
					<td>
					<input type="number" id="floorPosZ" value="10" step="10">
					</td>
				</tr>
				<tr class="">
					<td>Угол поворота лестницы, гр.:</td>
					<td>
						<input type="number" id="floorRotation" value="0" step="10">
					</td>
				</tr>
                <tr class="">
					<td>Привязать к проему:</td>
					<td>
                        <select id="connectToFloorHole">
                            <option value="Да">Да</option>
                            <option value="Нет">Нет</option>
                        </select>
					</td>
				</tr>
			</tbody>
		</table>
		<br>
		<button id='mooveStair' class='btn btn-primary'>Переместить</button>
	</div>
</div>
<script src="/calculator/general/forms/multiFormChange.js"></script>