<div id="carcasFormWrap">
	<h2 class="raschet">Характеристики изделия</h2>
	<div id="carcasForm" class="toggleDiv">
	
	<h4>1. Общие параметры:</h4>

		<table class="form_table" ><tbody>


			<tr>
				<td>Ширина:</td> 
				<td><input id="width" type="number" value="700"></td>
			</tr>
			
			<tr>
				<td>Глубина:</td> 
				<td><input id="depth" type="number" value="400"></td>
			</tr>
			
			<tr>
				<td>Высота:</td> 
				<td><input id="height" type="number" value="1500"></td>
			</tr>
			
		</tbody><table>
		
		<h4>1. Полки:</h4>

		<table class="form_table" ><tbody>

			<tr>
				<td>Кол-во полок:</td> 
				<td><input id="shelfAmt" type="number" value="4"></td>
			</tr>
			
			<tr>
				<td>Толщина:</td> 
				<td><input id="shelfThk" type="number" value="20"></td>
			</tr>
			
			<tr>
				<td>Свес:</td> 
				<td><input id="sideOverhang" type="number" value="20"></td>
			</tr>
			
			<tr>
				<td>Радиус скругления углов:</td> 
				<td><input id="cornerRad" type="number" value="0"></td>
			</tr>
			
			<tr>
				<td>Радиус скругления кромок:</td> 
				<td><input id="edgeRad" type="number" value="3"></td>
			</tr>
			
		</tbody></table>
		
		<h4>2. Каркас:</h4>

		<table class="form_table" ><tbody>

			<tr><td>Модель:</td> <td> 
				<input id="carcasModel" type="text" value="01">
				<button class="showModal noPrint" data-modal="sideModal">эскизы</button>
			</td></tr>
			
			<tr><td>Стойки:</td> <td> 
				<select id="legProf" size="1">
					<option value="40х40">40х40</option>
					<option value="60х60">60х60</option>
					<option value="80х80">80х80</option>
					<option value="100х100">100х100</option>
					<option value="40х20" selected>40х20</option>
					<option value="60х30">60х30</option>
					<option value="80х40">80х40</option>
					<option value="100х40">100х40</option>
					<option value="100х50">100х50</option>
				</select>
			</td></tr>
			
			<tr><td>Перемычки:</td> <td> 
				<select id="bridgeProf" size="1">
					<option value="40х20" selected>40х20</option>
					<option value="60х30">60х30</option>
					<option value="40х80">40х80</option>
					<option value="80х40">80х40</option>
					<option value="40х100">40х100</option>
					<option value="нет">нет</option>
				</select>
			</td></tr>
			
			<tr>
				<td>Выступ боковины над верхней полки:</td>
				<td><input id="topOffset" type="number" value="100"></td>
			</tr>
			
			<tr>
				<td>Зазор от пола до нижней полки:</td>
				<td><input id="botOffset" type="number" value="50"></td>
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


