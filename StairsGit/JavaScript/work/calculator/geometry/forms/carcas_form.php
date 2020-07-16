<h4>1. Конструктив лестницы:</h4>

<table class="form_table" ><tbody>

	<tr><td>Тип лестницы:</td> <td>
		<select id="staircaseType" size="1" onchange="">
			<option value="metal">металлокаркас</option>
			<option value="mono">монокосоур</option>
			<option value="timber_stock">деревянная</option>
		</select>
	</td></tr>
	<tr><td>Модель лестницы:</td> <td>
		<select id="model" size="1" onchange="">
			<option value="лт">ЛТ</option>
			<option value="ко">КО</option>
			<option value="тетивы">деревянные тетивы</option>
			<option value="косоуры">деревянные косоуры</option> 
			<option value="тетива+косоур">деревянные тетива+косоур</option>
			<option value="сварной"  >сварной короб</option>
			<option value="труба" >проф. труба</option>
		</select>
	</td></tr>

	<tr><td>Геометрия лестницы:</td> <td> 
		<select id="stairModel" size="1" onchange="">
			<option value="Прямая"  >Прямая</option>
			<option value="Г-образная с площадкой" selected  >Г-образная с площадкой</option>
			<option value="Г-образная с забегом" >Г-образная с забегом</option>
			<option value="П-образная с площадкой"  >П-образная с площадкой</option>
			<option value="П-образная с забегом"   >П-образная с забегом</option>
			<option value="П-образная трехмаршевая"  >П-образная трехмаршевая</option>		
		</select>
	</td></tr>



	<tr class="pltP">
		<td>Глубина промежуточной площадки:</td> 
		<td><input id="platformLength_1" type="number" value="1000"></td>
	</tr>

	<tr id="marshDist_tr"><td>Зазор между маршами в плане:</td> <td> 
		<input id="marshDist" type="number" value="100"> 
	</td></tr>

	<tr class="P3marsh"><td>Нижний поворот:</td> <td> 
		<select id="turnType_1" size="1" onchange="">
			<option value="забег"  >забег</option>
			<option value="площадка" selected >площадка</option> 
		</select>
	</td></tr>

	<tr class="P3marsh"><td>Верхний поворот:</td> <td> 
		<select id="turnType_2" size="1" onchange="">
			<option value="забег"  >забег</option> 
			<option value="площадка" selected >площадка</option>
		</select>
	</td></tr>

	<tr><td>Направление поворота:</td> <td> 
	<select id="turnSide" size="1" onchange="">
		<option value="правое">правое</option>
		<option value="левое">левое</option>
	</select>
	</td></tr>

	<tr><td>Верхняя площадка:</td> <td>
		<select id="platformTop" size="1" onchange="">
			<option value="нет">нет</option>
			<option value="площадка">есть</option>
			<option style="display: none;" value="забег">забег</option>		
		</select>
	</td></tr>



	<tr class="topPlt">
		<td>Глубина верхней площадки:</td> 
		<td><input id="platformLength_3" type="number" value="1000"></td>
	</tr>
	
	<tr class="topPlt">
			<td>Задняя тетива площадки:</td> <td>
			<select id="platformRearStringer" size="1" > 
				<option value="нет">нет</option>
				<option value="есть">есть</option>
			</select>
			</td>
		</tr>

	<tr style="display: none;"><td>Ширина последней забежной ступени:</td> 
		<td><input id="lastWinderTreadWidth" type="number" value="100"></td>
	</tr>

	<tr><td>Внешняя ширина маршей:</td> <td> 
		<input id="M" type="number" value="900">
	</td></tr>

	<tr id="platformTop_tr_4">
		<td>Фланец крепления к верхнему перекрытию:</td> <td> 
		<select id="topFlan" size="1" onchange="">
			<option value="есть">есть</option>
			<option selected value="нет">нет</option>
		</select>
	</td></tr>

	<tr id="platformTop_tr_14"><td>Тип крепления к верхнему перекрытию:</td> <td> 
		<select id="topAnglePosition" size="1" onchange="">
			<option value="под ступенью">под ступенью</option>
			<option value="над ступенью">над ступенью</option>
			<option value="рамка верхней ступени">Через рамку верхней ступени</option>
			<option value="вертикальная рамка">Вертикальная рамка</option>
		</select>
	</td></tr>

	<tr><td>Рамки под ступенями:</td> <td> 
		<select id="stairFrame" size="1">
			<option value="нет">нет</option>
			<option value="есть">есть</option>
		</select>
	</td></tr>

	<tr class="treadParams"><td>Ступени:</td> <td> 
		<select id="stairType" size="1">
			<option value="массив">массив дерева</option>
			<option value="сосна кл.Б">сосна кл.Б</option>
			<option value="сосна экстра">сосна экстра</option>
			<option value="береза паркет.">береза паркет.</option>
			<option value="лиственница паркет.">лиственница паркет.</option>
			<option value="дуб паркет.">дуб паркет.</option>
			<option value="дуб ц/л">дуб ц/л</option>
			<option value="нет">нет</option>
			<option value="рифленая сталь">рифленая сталь</option>
			<option value="лотки">лотки</option>
			<option value="дпк">дпк</option>
			<option value="лиственница тер.">лиственница тер.</option>
			<option value="пресснастил">пресснастил</option>
			<option value="стекло">стекло</option>		
		</select>
	</td></tr>	
		
	<tr class="treadParams dpcParams">
		<td>Ширина террасной доски:</td>
		<td><input id="dpcWidth" type="number" value="150"></td>
	</tr>
	
	<tr class="treadParams dpcParams">
		<td>Зазор между досками:</td>
		<td><input id="dpcDst" type="number" value="5"></td>
	</tr>
	
</tbody> </table>

<div id="assembling_inputs">

<h4>2. Параметры маршей</h4>

<table class="form_table">
<tbody>


<tr id="marsh1_tr"><td><b>Нижний марш:</b></td> <td> </td><tr>
<tr id="stairAmt1_tr" ><td>Кол-во ступеней:</td> <td> <input id="stairAmt1" type="number" value="4"> </td></tr>
<tr id="h1_tr" ><td>Подъем ступени:</td> <td> <input id="h1" type="number" value="180"> </td></tr>
<tr id="b1_tr" ><td>Проступь:</td> <td> <input id="b1" type="number" value="260"> </td></tr>
<tr id="a1_tr" class="treadWidth" ><td>Ширина ступени:</td> <td> <input id="a1" type="number" value="300"> </td></tr>

<tr id="marsh2_tr"><td><b>Средний марш:</b></td> <td> </td><tr>
<tr id="stairAmt2_tr" ><td>Кол-во ступеней:</td> <td> <input id="stairAmt2" type="number" value="4"> </td></tr>
<tr id="h2_tr" ><td>Подъем ступени:</td> <td> <input id="h2" type="number" value="180"> </td></tr>
<tr id="a2_tr" class="treadWidth"><td>Ширина ступени:</td> <td> <input id="a2" type="number" value="300"> </td></tr>
<tr id="b2_tr" ><td>Проступь:</td> <td> <input id="b2" type="number" value="260"> </td></tr>

<tr id="marsh13_tr"><td><b>Верхний и нижний марши:</b></td> <td> </td><tr>
<tr id="marsh3_tr"><td><b>Верхний марш:</b></td> <td> </td><tr>
<tr id="stairAmt3_tr" ><td>Кол-во ступеней:</td><td> <input id="stairAmt3" type="number" value="4"></td></tr>
<tr id="h3_tr" ><td>Подъем ступени:</td> <td> <input id="h3" type="number" value="180"> </td></tr>
<tr id="a3_tr" class="treadWidth"><td>Ширина ступени:</td> <td> <input id="a3" type="number" value="300"> </td></tr>
<tr id="b3_tr" ><td>Проступь:</td> <td> <input id="b3" type="number" value="260"> </td></tr>

<tr><td>Подступенки:</td> <td> 
	<select id="riserType" size="1" onchange="">
		<option value="нет">нет</option>
		<option value="есть">есть</option>				
	</select>
</td></tr>

<tr><td>Толщина подступенков:</td> <td> <input id="riserThickness" type="number" value="18"> </td></tr>


<tr><td>Свес ступени:</td> <td> <input id="nose" type="number" value="20"> </td></tr>


</tbody></table>

</div>


<span class="comments">
	Комментарии к расчету:<br/>
	<textarea id="comments" rows="1" cols="80" class="comments"></textarea>
</span>
<br/>