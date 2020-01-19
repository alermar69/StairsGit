
<div id="carcasFormWrap">

<h2>Комплект поставки</h2>

<div class="toggleDiv">

	<table class="form_table"><tbody>

		<tr><td>Тип лестницы:</td> <td> 
			<select id="staircaseType" size="1" onchange="">
				<option value="П-1.1">Вертикальная без ограждения П-1.1</option>
				<option value="П-1.2">Вертикальная с ограждением П-1.2</option>
			</select>
		</td></tr>

		<tr>
			<td>Длина лестницы (без учета ограждения):</td> 
			<td><input id="stairCaseLength" type="number" value="8000"></td>
		</tr>

		<tr>
			<td>Отступ ограждения от низа лестницы:</td> 
			<td><input id="railingOffset" type="number" value="1000"></td>
		</tr>

		<tr>
			<td>Кол-во точек крепления:</td> 
			<td><input id="legAmt" type="number" value="4"></td>
		</tr>

		<tr><td>Тип ног:</td> <td> 
			<select id="legType" size="1" onchange="">
				<option value="прямые">прямые</option>
				<option value="Т-образные">Т-образные</option>
			</select>
		</td></tr>

		<tr>
			<td>Отступ верхнего крепления от площадки:</td> 
			<td><input id="topLegOffset" type="number" value="300"></td>
		</tr>

		<tr>
			<td>Длина площадки:</td> 
			<td><input id="pltLength" type="number" value="1000"></td>
		</tr>

		<tr><td>Крепление задней секции площадки:</td> <td> 
			<select id="pltRearFix" size="1" onchange="">
				<option value="нет">нет</option>
				<option value="кровля">к кровле</option>
				<option value="парапет">к парапету</option>
			</select>
		</td></tr>

		<tr><td>Макс. длина секции:</td> <td> 
			<select id="maxSectLength" size="1" onchange="">
				<option value="4000">4000</option>
				<option value="3000">3000</option>		
				<option value="2000">2000</option>
			</select>
		</td></tr>


		<tr><td>Покраска металла:</td> <td> 
			<select id="metalPaint" size="1" onchange="">
				<option value="нет">нет</option>
				<option value="порошок">порошок</option>
			</select>
		</td></tr>

		<tr class='metalColor'>
			<td>Цвет покраски металла:</td> 
			<td> 
				<select id="carcasColor" size="1" onchange="">
				<!-- варианты цветов металла -->
				<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/metalColors.php" ?>
				</select>
		</td></tr>

	</tbody> </table>
</div>


<h2>Параметры обстановки</h2>
	
	<div class="toggleDiv">

		<table class="form_table"><tbody>

		<tr><td>Тип стены:</td> <td> 
			<select id="wallType" size="1" onchange="">
				<option value="кирпич">кирпич</option>
				<option value="бетон">бетон</option>		
				<option value="пеноблок">пеноблок</option>
				<option value="дерево">дерево</option>
				<option value="сэндвич-панель">сэндвич-панель</option>
			</select>
		</td></tr>

		<tr><td>Наличие вент. фасада:</td> <td> 
			<select id="wallOffset" size="1" onchange="">
				<option value="да">да</option>
				<option value="нет">нет</option>
			</select>
		</td></tr>

		<tr><td>Тип кровли:</td> <td> 
			<select id="roofType" size="1" onchange="">
				<option value="плоская">плоская</option>
				<option value="скатная">сктная</option>
			</select>
		</td></tr>
		<tr>
			<td>Высота от земли до края кровли, мм:</td> 
			<td><input id="roofHeight" type="number" value="9000"></td>
		</tr>

		<tr>
			<td>Угол наклона кровли, гр.:</td> 
			<td><input id="roofAngle" type="number" value="30"></td>
		</tr>

		<tr>
			<td>Высота парапета, мм:</td> 
			<td><input id="roofWallHeight" type="number" value="500"></td>
		</tr>

		<tr>
			<td>Толщина парапета, мм:</td> 
			<td><input id="roofWallThk" type="number" value="200"></td>
		</tr>

		<tr>
			<td>Свес кровли:</td> 
			<td><input id="corniceWidth" type="number" value="500"></td>
		</tr>

		<tr>
			<td>Зазор от лестницы до стены</td> 
			<td><input id="wallDist" type="number" value="350"></td>
		</tr>

		<tr>
			<td>Зазор от лестницы до кровли</td> 
			<td><input id="roofWallDist" type="number" value="50"></td>
		</tr>

		<tr>
			<td>Заглубление ног в стену</td> 
			<td><input id="legsExtraLength" type="number" value="0"></td>
		</tr>


	</tbody> </table>

	Комментарии к расчету:<br/>  <textarea id="comments_03" rows="1" cols="80" class="comments"></textarea>
	<br/>
	
</div>

</div>

<!--Обработчик формы-->
<script type="text/javascript" src="/calculator/fire_2/forms/carcas_form_change.js"></script>

