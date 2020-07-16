<h4>1. Общие характеристики:</h4>

<table class="form_table" ><tbody>

<tr id="model_tr"><td>Тип модулей:</td> <td>
	<select id="model" size="1" onchange="">
		<option value="Стамет">Стандартные</option>
		<option value="Стиль-Т" style="display: none;">Усиленные</option>
		<option value="Наша лестница" style="display: none;">Наша лестница</option>
		<option value="Мечта" style="display: none;">Мечта</option>
		
	</select>
</td></tr>

<tr><td>Геометрия лестницы:</td> <td> 
	<select id="stairModel" size="1" onchange="changeAllForms()">
		<option value="Прямая">Прямая</option>
		<option value="Г-образная с площадкой">Г-образная с площадкой</option>
		<option value="Г-образная с забегом">Г-образная с забегом</option>
		<option value="П-образная с площадкой" >П-образная с площадкой</option>
		<option value="П-образная с забегом">П-образная с забегом</option>
		<option value="П-образная трехмаршевая">П-образная трехмаршевая</option>
		<option style="display: none;" value="Прямая двухмаршевая">Прямая двухмаршевая</option>
		<option  style="display: none;" value="Криволинейная">Криволинейная</option>
	</select>
</td></tr>



<tr id="middlePlatform_tr_2" style="display: none;">
	<td>Глубина промежуточной площадки:</td> 
	<td><input id="platformLength_1" type="number" value="1000"></td>
</tr>


<tr id="middlePlatform_tr_3" style="display: none;">
	<td>Ширина промежуточной площадки:</td>
	<td><input id="platformWidth_1" type="number" value="2000"></td>
</tr>


<tr id="marshDist_tr"><td>Зазор между маршами в плане:</td> <td> 
	<input id="marshDist" type="number" value="70"> 
</td></tr>

<tr class="P3marsh"><td>Нижний поворот:</td> <td> 
	<select id="turnType_1" size="1" onchange="">
		<option value="забег">забег</option>
		<option value="площадка">площадка</option>
	</select>
</td></tr>

<tr class="P3marsh"><td>Верхний поворот:</td> <td> 
	<select id="turnType_2" size="1" onchange="">
		<option value="забег">забег</option>
		<option value="площадка">площадка</option>
	</select>
</td></tr>

<tr><td>Направление поворота:</td> <td> 
<select id="turnSide" size="1" onchange="">
 	<option value="правое" selected >правое</option>
 	<option value="левое"   >левое</option>
</select>
</td></tr>

<tr id="M_tr"><td>Внешняя ширина маршей:</td> <td> 
	<input id="M" type="number" value="900">
</td></tr>

<tr style="display: none"><td>Подступенки:</td> <td> 
	<select id="riserType" size="1" onchange="">
		<option value="нет">нет</option>
		<option value="есть">есть</option>		
	</select>
</td></tr>	

<tr id="platformTop_tr_11"> 
	<td>Тип установки верхней ступени:</td> <td> 
	<select id="topStairType" size="1" onchange="">
		<option value="ниже">ниже перекрытия</option>
		<option value="вровень">вровень с перекрытием</option>		
	</select>
</td></tr>

<tr id="platformTop_tr_14" style="display: none;"><td>Верхнее крепление:</td> <td> 
	<select id="topAnglePosition" size="1" onchange="">
		<option value="под ступенью">под ступенью</option>
		<option value="над ступенью">над ступенью</option>		
	</select>
</td></tr>

<tr id=""><td>Размер модуля h x b:</td> <td> 
	<select id="moduleSize" size="1" onchange="">
		<option value="225">225x225</option>
		<option value="190">190x225</option>		
	</select>
</td></tr>


<tr id=""><td>Больцы:</td> <td> 
	<select id="bolzSize" size="1" onchange="">
		<option value="25">Ф25</option>
		<option value="38">Ф38 нерж.</option>		
	</select>
</td></tr>

<tr><td>Ступени:</td> <td> 
	<select id="stairType" size="1">
		<option value="массив">массив дерева</option>
		<option value="нет">нет</option>
	</select>
</td></tr>

	
</tbody> </table>

<div id="stepParamsTab">
<h4>2. Параметры ступеней:</h4>
<table class="form_table">
<tbody>
<tr>
	<th style="width: 20%;">Марш</th>
	<th>Кол-во прямых ступеней</th>
	<th>Подъем ступени</th>
	<th>Проступь</th>
	<th>Ступень</th>
</tr>

<tr class="marsh1">
	<td style="width: 20%;">Нижний</td>
	<td><input id="stairAmt1" type="number" value="7"></td>
	<td><input id="h1" type="number" value="225"></td>
	<td><input id="b1" type="number" value="225"></td>
	<td><input id="a1" type="number" value="295"></td>
</tr>

<tr class="marsh2">
	<td>Средний</td>
	<td><input id="stairAmt2" type="number" value="5"></td>
	<td><input id="h2" type="number" value="225"></td>
	<td><input id="b2" type="number" value="225"></td>
	<td><input id="a2" type="number" value="295"></td>
</tr>

<tr class="marsh3">
	<td>Верхний</td>
	<td><input id="stairAmt3" type="number" value="5"></td>
	<td><input id="h3" type="number" value="225"></td>
	<td><input id="b3" type="number" value="225"></td>
	<td><input id="a3" type="number" value="295"></td>
</tr>

</tbody>
</table>
</div>

<h4>3. Больцы, уголки к стене</h4>
<table class="form_table" ><tbody>
	<tr>
		<th>Марш</th>
		<th>Уголки к стене</th>
		<th>Больцы</th>
	</tr>
	
	<tr class="marsh1">
		<td>Нижний</td> 
		<td> 
			<select id="treadFixSide1" size="1">
				<option value="нет">нет</option>
				<option value="внешняя">внешняя</option>
				<option value="внутренняя">внутренняя</option>
				<option value="две стороны">две стороны</option>		
			</select>
		</td>
		<td> 
			<select id="bolzSide1" size="1">
				<option value="нет">нет</option>
				<option value="внешняя">внешняя</option>
				<option value="внутренняя">внутренняя</option>
				<option value="две стороны">две стороны</option>		
			</select>
		</td>
	</tr>
	<tr class="marsh2">
		<td>Средний</td> 
		<td> 
			<select id="treadFixSide2" size="1">
				<option value="нет">нет</option>
				<option value="внешняя">внешняя</option>
				<option value="внутренняя">внутренняя</option>
				<option value="две стороны">две стороны</option>		
			</select>
		</td>
		<td> 
			<select id="bolzSide2" size="1">
				<option value="нет">нет</option>
				<option value="внешняя">внешняя</option>
				<option value="внутренняя">внутренняя</option>
				<option value="две стороны">две стороны</option>		
			</select>
		</td>		
		</tr>
	<tr class="marsh3">
		<td>Верхний</td>
		<td> 
			<select id="treadFixSide3" size="1">
				<option value="нет">нет</option>
				<option value="внешняя">внешняя</option>
				<option value="внутренняя">внутренняя</option>
				<option value="две стороны">две стороны</option>		
			</select>
		</td>
		<td> 
			<select id="bolzSide3" size="1">
				<option value="нет">нет</option>
				<option value="внешняя">внешняя</option>
				<option value="внутренняя">внутренняя</option>
				<option value="две стороны">две стороны</option>		
			</select>
		</td>
	</tr>
	
</tbody></table>

</div>

<div id="assembling_inputs">



<h4>4. Крепление каркаса к стенам и перекрытиям.</h4>

<!-- параметры крепления лестницы к стенам-->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/fixingParams.php" ?>

<table class="form_table">
<tbody>

<tr><td>Номер модуля, выше которого вместо колонн ставятся консоли</td> <td> 
	<input id="consoleStartModule" type="number" value="10">
</td></tr>


</tbody></table>
<br/>


Комментарии к расчету:<br/>  <textarea id="comments_03" rows="1" cols="80" class="comments"></textarea>
<br/>

<!--Обработчик формы-->
<script type="text/javascript" src="/calculator/module/forms/carcas_form_change.js"></script>

