
<h3>Внутренние лестницы</h3>

<table class="tab_2"><tbody>
	<tr>
		<th>Общий шаблон</th>
		<th>Порода дерева</th>
		<th>Покраска металла</th>
		<th>Покраска дерева</th>
		<th>Модель ограждения</th>
		<th>Шаблон ограждения</th>
		<th>Сборка</th>
	</tr>
	
	<tr>
		<td>
			<select id='templateStaircase'>
				<option value='нет'>нет</option>
				<option value='Эконом'>Эконом</option>
				<option value='Стандарт'>Стандарт</option>
				<option value='Премиум'>Премиум</option>
			</select>
		</td>
		
		<td>
			<select id='templateTimber'>
				<!-- варианты пород дерева -->
				<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/timberTypes.php" ?>		
			</select>
		</td>
		
		<td>
			<select id='templateMetalPaint'>
				<!-- варианты покраски меалла -->
				<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/metalPaint.php" ?>		
			</select>
		</td>
		
		<td>
			<select id='templateTimberPaint'>
				<!-- варианты покраски дерева -->
				<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/timberPaint.php" ?>		
			</select>
		</td>
		
		<td>
			<select id='templateRailingModel'>
				<option value="не указано">не указано</option>
				<option value="Ригели">Ригели</option>
				<option value="Стекло на стойках">Стекло на стойках</option>
				<option value="Самонесущее стекло">Самонесущее стекло</option>
				<option value="Кованые балясины">Кованые балясины</option>
				<option style="display: none;" value="Решетка">Решетка из профиля</option>
				<option value="Трап">Трап</option>
				<option value="Экраны лазер">Экраны лазер</option>
				<option value="Деревянные балясины">Деревянные балясины</option>
				<option value="Дерево с ковкой">Дерево с ковкой</option>
				<option value="Стекло">Стекло</option>
			</select>
		</td>
		
		<td>
			<select id='templateRailing'>
				<option value='нет'>нет</option>
				<option value='Эконом'>Эконом</option>
				<option value='Стандарт'>Стандарт</option>
				<option value='Премиум'>Премиум</option>
			</select>
		</td>
		
		<td>
			<select id='templateAssembling'>
				<option value="не указано">не указано</option>
				<option value='нет'>нет</option>
				<option value='есть'>есть</option>
			</select>
		</td>
		
	</tr>
	

</tbody></table>

<button id='applyTemplate' class='btn btn-primary' style='margin:5px'>Применить</button>

