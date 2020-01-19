
<table class="form_table" ><tbody>

<tr><td>Тип лестницы:</td> <td> 
	<select id="staircaseType" size="1" onchange="">
		<option value="П-1.1">Вертикальная без ограждения П-1.1</option>
		<option value="П-1.2">Вертикальная с ограждением П-1.2</option>
		<option value="две">П-1.1 + П-1.2</option>
	</select>
</td></tr>

<tr class="params_600_tr">
	<td>Секция верхняя 600мм L=0,5 м.п.:</td> 
	<td><input id="topSectionAmt_600_05" class="params_600" type="number" value="0"></td>
</tr>

<tr class="params_800_tr">
	<td>Секция верхняя 800мм L=0,5 м.п.:</td> 
	<td><input id="topSectionAmt_800_05" class="params_800" type="number" value="0"></td>
</tr>

<tr class="params_600_tr">
	<td>Секция 600мм L=2м.п.:</td> 
	<td><input id="sectionAmt_600_2" class="params_600" type="number" value="0"></td>
</tr>
<tr class="params_600_tr">
	<td>Секция 600мм L=3м.п.:</td> 
	<td><input id="sectionAmt_600_3" class="params_600" type="number" value="0"></td>
</tr>
<tr class="params_600_tr">
	<td>Секция 600мм L=4м.п.:</td> 
	<td><input id="sectionAmt_600_4" class="params_600" type="number" value="0"></td>
</tr>
<tr class="params_800_tr">
	<td>Секция 800мм L=2м.п.:</td> 
	<td><input id="sectionAmt_800_2" class="params_800" type="number" value="0"></td>
</tr>
<tr class="params_800_tr">
	<td>Секция 800мм L=3м.п.:</td> 
	<td><input id="sectionAmt_800_3" class="params_800" type="number" value="0"></td>
</tr>
<tr class="params_800_tr">
	<td>Секция 800мм L=4м.п.:</td> 
	<td><input id="sectionAmt_800_4" class="params_800" type="number" value="0"></td>
</tr>

<tr class="params_800_tr">
	<td>Общая длина ограждений:</td> 
	<td><input id="railingLength" type="number" value="0"></td>
</tr>

<tr>
	<td>Кол-во комплектов (2шт) ног L=500мм:</td> 
	<td><input id="leg500Amt" type="number" value="0"></td>
</tr>

<tr>
	<td>Кол-во комплектов (2шт) ног L=750мм:</td> 
	<td><input id="leg750Amt" type="number" value="0"></td>
</tr>

<tr class="params_600_tr">
	<td>Кронштейн крепления лестницы Т-образный 600мм:</td> 
	<td><input id="legTAmt_600" class="params_600" type="number" value="0"></td>
</tr>

<tr class="params_800_tr">
	<td>Кронштейн крепления лестницы Т-образный 800мм:</td> 
	<td><input id="legTAmt_800" class="params_800" type="number" value="0"></td>
</tr>

<tr class="params_600_tr">
	<td>Кол-во площадок 600мм L=1000мм:</td> 
	<td><input id="pltAmt_600" class="params_600" type="number" value="0"></td>
</tr>

<tr class="params_800_tr">
	<td>Кол-во площадок 800мм L=1000мм:</td> 
	<td><input id="pltAmt_800" class="params_800" type="number" value="0"></td>
</tr>


<tr><td>Покраска металла:</td> <td> 
	<select id="metalPaint" size="1" onchange="">
		<option value="нет">нет</option>
		<option value="порошок">порошок</option>
	</select>
</td></tr>

<tr class='metalColor'>
	<td>Цвет покраски металла:</td> 
	<td> 
		<select id="metalColorNumber" size="1" onchange="">
		<!-- варианты цветов металла -->
			<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/metalColors.php" ?>
		</select>
</td></tr>

<tr class='metalColor'>
	<td>Комментарий к цвету металла:</td> 
	<td><textarea id="metalPaintColor" rows="1" cols="30" class="comments"></textarea></td>
</tr>


</tbody> </table>

</div>

Комментарии к расчету:<br/>  <textarea id="comments_03" rows="1" cols="80" class="comments"></textarea>
<br/>

<!--Обработчик формы-->
<script type="text/javascript" src="/calculator/fire/forms/carcas_form_change.js"></script>

