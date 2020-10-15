<h4>1. Общие характеристики:</h4>

<table class="form_table" ><tbody>
<!--
<tr>
	<td>Макс. кол-во полок:</td> 
	<td><input id="maxRowAmt_wr" type="number" value="5"></td>
</tr>
-->
<tr><td>Модель:</td> <td> 
	<select id="model_wr" size="1">
		<option value="классика">классика</option>
		<option value="купе">купе</option>
	</select>
</td></tr>

<tr>
	<td>Кол-во дверок:</td> 
	<td><input id="kupeDoorAmt_wr" type="number" value="5"></td>
</tr>

<tr>
	<td>Ширина:</td> 
	<td><input id="width_wr" type="number" value="2000"></td>
</tr>

<tr>
	<td>Высота слева:</td> 
	<td><input id="heightLeft_wr" type="number" value="2000"></td>
</tr>

<tr>
	<td>Высота справа:</td> 
	<td><input id="heightRight_wr" type="number" value="1500"></td>
</tr>

<tr>
	<td>Угол наклона верха:</td> 
	<td><input id="angleTop_wr" type="number" value="30"></td>
</tr>

<tr>
	<td>Глубина:</td> 
	<td><input id="depth_wr" type="number" value="600"></td>
</tr>

<tr><td>Угловой добор:</td> <td> 
	<select id="sideOnlay_wr" size="1">
		<option value="нет">нет</option>
		<option value="есть">есть</option>		
	</select>
</td></tr>

<tr><td>Верхняя накладка:</td> <td> 
	<select id="topOnlay_wr" size="1">
		<option value="нет">нет</option>
		<option value="есть">есть</option>		
	</select>
</td></tr>


</tbody> </table>
<h4>2. Секции:</h4>
<input id="sectAmt_wr" type="number" value="1" style="display: none;">

<table class="form_table" id="sectParamsTable" ><tbody>
<tr>
	<th>№ секции:</th>
	<th>Тип:</th>
	<th>Ширина:</th>
	<th>Удалить</th>
</tr>
<tr> 
			<td class="sectNumber"> 1</td> 
				<td>
					<select class="door" id="door0" size="1">
						<option value="открытая">открытая</option>
						<option value="вправо">дверь правая</option>
						<option value="влево">дверь левая</option>
						<option value="две двери">две двери</option>
						<option value="выдвижная">выдвижной шкаф</option>
					</select>
				<td><input class="sectWidth" id="sectWidth0" type="number" value="100" step="5"></td>
				</td>
				<td></td>
			</tr>

</tbody> </table>

<div style="margin: 5px">
	<button class="btn btn-secondary" id="addSect">Добавить секцию</button>
	<button class="btn btn-secondary" id="equalSectWidth">Выровнять ширину</button>
</div>


<h4>3. Технологические параметры:</h4>

<table class="form_table"><tbody>
	<tr>
		<th>Параметр</th>
		<th>Значение:</th>
	</tr>
	<tr> 
		<td>Толщина деталей каркаса</td> 
		<td><input id="carcasThk_wr" type="number" value="16"></td>
	</tr>
	<tr> 
		<td>Толщина фасадов</td> 
		<td><input id="doorsThk_wr" type="number" value="16"></td>
	</tr>
	
	<tr>
		<td>Высота ножек:</td> 
		<td><input id="legsHeight_wr" type="number" value="80" step="10"></td>
	</tr>

</tbody> </table>

<h4>4. Комплектация:</h4>

<table class="form_table"><tbody>
	<tr>
		<th>Параметр</th>
		<th>Значение:</th>
	</tr>
	<tr> 
		<td>Материал каркаса</td> 
		<td>
			<select id="carcasMat_wr" size="1">
				<option value="лдсп">ЛДСП</option>
				<option value="шпон">шпон</option>
				<option value="щит">щит</option>
			</select>
		</td>
	</tr>
	<tr> 
		<td>Фасады</td> 
		<td>
			<select id="doorsMat_wr" size="1">
				<option value="щит">щит</option>
				<option value="рамочные массив">рамочные массив</option>
				<option value="рамочные шпон">рамочные шпон</option>
				<option value="плоские шпон">плоские шпон</option>
				<option value="плоские эмаль">плоские эмаль</option>
				<option value="фрезерованные эмаль">фрезерованные эмаль</option>
				<option value="плоские лдсп">плоские лдсп</option>
			</select>
		</td>
	</tr>
	
	<tr> 
		<td>Фурнитура</td> 
		<td>
			<select id="metisType_wr" size="1">
				<option value="Boyard">Boyard</option>
				<option value="Hettich">Hettich</option>
			</select>
		</td>
	</tr>
	
	<tr> 
		<td>Направляющие</td> 
		<td>
			<select id="drawerSliders" size="1">
				<option value="шариковые">шариковые</option>
				<option value="скрытые">скрытые</option>
			</select>
		</td>
	</tr>
	
</tbody> </table>


Комментарии к расчету:<br/>  <textarea id="comments_wr" rows="3" cols="80" class="comments"></textarea>
<br/>

<!--Обработчик формы-->
<script type="text/javascript" src="/calculator/wardrobe/forms/main_form_change.js"></script>


