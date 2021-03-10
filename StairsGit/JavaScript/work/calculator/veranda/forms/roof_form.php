<div id="carcasFormWrap">
	<h2 class="raschet">Характеристики кровли</h2>
	<div id="carcasForm" class="toggleDiv">
		
		<h4>Позиция</h4>
		<table class="form_table w-100">
			<tbody>
				<tr class="">
					<td>Смещение навеса по X:</td>
					<td>
						<input type="number" id="carportPosX" value="0" step="10">
					</td>
				</tr>
				<tr class="">
					<td>Смещение навеса по Y:</td>
					<td>
						<input type="number" id="carportPosY" value="0" step="10">
					</td>
				</tr>
				<tr class="">
					<td>Смещение навеса по Z:</td>
					<td>
					<input type="number" id="carportPosZ" value="0" step="10">
					</td>
				</tr>
				<tr class="">
					<td>Угол поворота, гр.:</td>
					<td>
						<input type="number" id="carportRot" value="0" step="10">
					</td>
				</tr>
			</tbody>
		</table>
		
		<br>
		Шаблон:
		<select id="roofTemplate">
			<option value="нет">нет</option>
			<option value="прямое крыльцо">прямое крыльцо</option>
			<option value="боковое крыльцо">боковое крыльцо</option>
		</select>
		
		<button class="btn btn-secondary" id="applyRoofTemplate">Выровнять</button><br>
				
	<!-- форма параметров с навеса -->
	<?php include $GLOBALS['ROOT_PATH']."/calculator/carport/forms/main_form.php" ?>

	</div>
</div>