<div id="carcasFormWrap">
	<h2 class="raschet">Характеристики лестницы</h2>
	<div id="carcasForm" class="toggleDiv">
		
		<h4>Позиция</h4>
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
		
	<!-- форма параметров с входной лестницы -->
	<?php include $GLOBALS['ROOT_PATH']."/calculator/vhod/forms/carcas_form.php" ?>

	</div>
</div>