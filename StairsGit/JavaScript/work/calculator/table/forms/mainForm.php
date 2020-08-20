<div id="carcasFormWrap">
	<h2 class="raschet">Характеристики изделия</h2>
	<div id="carcasForm" class="toggleDiv">
	
	<h4>1. Общие параметры:</h4>

		<table class="form_table" ><tbody>

			<tr><td>Форма:</td> <td> 
				<select id="tableGeom" size="1">
					<option value="прямоугольный">прямоугольный</option>
					<option value="круглый">круглый</option>
					<option value="овальный">овальный</option>
				</select>
			</td></tr>
			

			<tr>
				<td>Ширина:</td> 
				<td><input id="width" type="number" value="600"></td>
			</tr>
			
			<tr>
				<td>Длина:</td> 
				<td><input id="len" type="number" value="1200"></td>
			</tr>
			
			<tr>
				<td>Высота:</td> 
				<td><input id="height" type="number" value="750"></td>
			</tr>
		
		</tbody><table>
		
		<h4>1. Столешница:</h4>

		<table class="form_table" ><tbody>

			<tr><td>Тип:</td> <td> 
				<select id="countertopModel" size="1">
					<option value="цельная">цельная</option>
					<option value="двойная">двойная</option>
					<option value="двойная с вставкой">двойная с вставкой</option>
					<option value="нет">нет</option>
				</select>
			</td></tr>
			
			<tr>
				<td>Толщина:</td> 
				<td><input id="countertopThk" type="number" value="40"></td>
			</tr>
			
			<tr>
				<td>Зазор между частями столешницы:</td> 
				<td><input id="partsGap" type="number" value="10"></td>
			</tr>

			<tr>
				<td>Радиус скругления углов:</td> 
				<td><input id="cornerRad" type="number" value="20"></td>
			</tr>
			
			<tr>
				<td>Радиус скругления кромок:</td> 
				<td><input id="edgeRad" type="number" value="3"></td>
			</tr>
		
		</tbody></table>
		
		<h4>2. Подстолье:</h4>

		<table class="form_table" ><tbody>

			<tr><td>Модель:</td> <td> 
				<select id="baseModel">
					<option value="не указано">не указано</option>
					<option value="D-1">D-1</option>
					<option value="S-1">S-1</option>
					<option value="S-2">S-2</option>
					<option value="S-3">S-3</option>
					<option value="S-4">S-4</option>
					<option value="S-5">S-5</option>
					<option value="S-6">S-6</option>
					<option value="S-7">S-7</option>
					<option value="S-8">S-8</option>
					<option value="S-9">S-9</option>
					<option value="T-1" selected>T-1</option>
					<option value="T-2">T-2</option>
					<option value="T-3">T-3</option>
					<option value="T-4">T-4</option>
					<option value="T-5">T-5</option>
					<option value="T-6">T-6</option>
					<option value="T-7">T-7</option>
					<option value="T-8">T-8</option>
					<option value="T-9">T-9</option>
					<option value="T-10">T-10</option>
					<option value="T-11">T-11</option>
					<option value="T-12">T-12</option>
					<option value="T-13">T-13</option>
					<option value="T-14">T-14</option>
					<option value="T-15">T-15</option>
					<option value="T-16">T-16</option>
					<option value="T-17">T-17</option>
					<option value="T-18">T-18</option>
				</select>
				<button class="showModal noPrint" data-modal="sideModal">эскизы</button>
			</td></tr>
			
			<tr>
				<td>Свес столешницы боковой:</td>
				<td><input id="sideOverhang" type="number" value="50"></td>
			</tr>
			
			<tr>
				<td>Свес столешницы передний/задний:</td>
				<td><input id="frontOverhang" type="number" value="100"></td>
			</tr>
			
			<tr><td>Покраска металла:</td> <td> 
				<select id="metalPaint" size="1" >
					<!-- варианты покраски металла -->
					<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/metalPaint.php" ?>
				</select>
			</td></tr>
			
			<tr><td>Цвет металла:</td> <td> 
				<select id="metalColor" size="1" >
					<!-- варианты покраски металла -->
					<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/metalColors.php" ?>
				</select>
			</td></tr>
			
		</tbody></table>
	</div>
</div>
		
<!--Обработчик формы-->
<script type="text/javascript" src="forms/mainFormChange.js"></script>


