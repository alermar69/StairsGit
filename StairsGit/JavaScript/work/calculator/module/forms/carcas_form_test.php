<h4>1. Общие характеристики:</h4>

<table class="form_table" ><tbody>


<tr id="model_tr"><td>Тип монокосоура:</td> <td> 
	<select id="model" size="1" onchange="changeAllForms()">
		<option value="короб" selected >короб из листа</option>
		<option value="проф. труба">проф. труба</option>

	</select>
</td></tr>


<tr><td>Геометрия лестницы:</td> <td> 
	<select id="stairModel" size="1" onchange="changeAllForms()">
		<option value="Прямая" selected >Прямая</option>
		<option value="Г-образная с площадкой"   >Г-образная с площадкой</option>
		<option value="Г-образная с забегом" >Г-образная с забегом</option>
		<option value="П-образная с площадкой"  >П-образная с площадкой</option>
		<option value="П-образная с забегом"  >П-образная с забегом</option>
		<option value="П-образная трехмаршевая"  >П-образная трехмаршевая</option>		
	</select>
</td></tr>

<tr id="middlePlatform_tr_2">
	<td>Глубина промежуточной площадки:</td> 
	<td><input id="platformLength_1" type="number" value="1000"></td>
</tr>

<tr id="middlePlatform_tr_3">
	<td>Ширина промежуточной площадки:</td>
	<td><input id="platformWidth_1" type="number" value="2000"></td>
</tr>

<tr id="marshDist_tr"><td>Зазор между маршами в плане:</td> <td> 
	<input id="marshDist" type="number" value="70"> 
</td></tr>


<tr id="turn_tr_11"><td>Нижний поворот:</td> <td> 
	<select id="turnType_1" size="1" onchange="">
		<option value="забег">забег</option>
		<option value="площадка">площадка</option>
	</select>
</td></tr>

<tr id="turn_tr_12"><td>Верхний поворот:</td> <td> 
	<select id="turnType_2" size="1" onchange="">
		<option value="забег">забег</option>
		<option value="площадка">площадка</option>
	</select>
</td></tr>


<tr id="turnSide_tr"><td>Направление поворота:</td> <td> 
<select id="turnSide" size="1" onchange="">
 	<option value="правое">правое</option>
 	<option value="левое">левое</option>
</select>
</td></tr>


<tr style="display: none;"><td>Верхняя площадка:</td> <td>
	<select id="platformTop" size="1" onchange="changeAllForms()">
		<option value="нет">нет</option>
		<option value="площадка">есть</option>
		<option style="display: none;" value="забег">забег</option>		
	</select>
</td></tr>

<tr id="platformTop_tr_1">
	<td>Задняя тетива площадки:</td> <td>
	<select id="platformRearStringer" size="1" onchange=""> 
		<option value="нет">нет</option>
		<option value="есть">есть</option>
	</select>
	</td>
</tr>

<tr id="platformTop_tr_2">
	<td>Глубина верхней площадки:</td> 
	<td><input id="platformLength_3" type="number" value="1000"></td>
</tr>


<tr><td>Внешняя ширина маршей:</td> <td> 
	<input id="M" type="number" value="900">
</td></tr>



<tr id="stringerType_tr"><td>Тип тетив:</td> <td> 
	<select id="stringerType" size="1" onchange="">
		<option value="пилообразная" >пилообразная</option>
		<option value="прямая" selected>прямая</option>
	</select>
</td></tr>

<tr><td>Подступенки:</td> <td> 
	<select id="riserType" size="1" onchange="">
		<option value="нет">нет</option>
		<option value="есть">есть</option>		
	</select>
</td></tr>	

<tr id="sideOverHang_tr"><td>Боковой свес ступеней, мм:</td> <td> 
	<input id="sideOverHang" type="number" value="75">
</td></tr>


<tr id="stairFrame_tr"><td>Рамки под ступенями:</td> <td> 
	<select id="stairFrame" size="1" onchange="">
		<option value="нет">нет</option>
		<option value="есть">есть</option>
	</select>
</td></tr>



<tr id="platformTop_tr_11" style="display: none"><td>Тип установки верхней ступени:</td> <td> 
	<select id="topStairType" size="1" onchange="">
		<option value="ниже">ниже перекрытия</option>
		<option value="вровень">вровень с перекрытием</option>		
	</select>
</td></tr>


<tr id="platformTop_tr_14"><td>Верхнее крепление:</td> <td> 
	<select id="topAnglePosition" size="1" onchange="">
		<option value="под ступенью">под ступенью</option>
		<option value="над ступенью">над ступенью</option>		
	</select>
</td></tr>



<tr id=""><td>Опорные столбы:</td> <td> 
	<select id="rackSize" size="1" onchange="changeFormCarcas();">
		<option value="80">80х80</option>
		<option value="100">100х100</option>
		<option value="120">120х120</option>
	</select>
</td></tr>

<tr id="columnPos_tr">
<td><img src="/images/calculator/columnPos/001.jpg" width="250px" id="columnPos_img"></td>
	<td>
	<label id="isColumn1_label"><input type="checkbox" id="isColumn1">1<br/></label>
	<label id="isColumn2_label"><input type="checkbox" id="isColumn2">2<br/></label>
	<label id="isColumn3_label"><input type="checkbox" id="isColumn3">3<br/></label>
	<label id="isColumn4_label"><input type="checkbox" id="isColumn4">4<br/></label>
	<label id="isColumn5_label"><input type="checkbox" id="isColumn5">5<br/></label>
	<label id="isColumn6_label"><input type="checkbox" id="isColumn6">6<br/></label>
	<label id="isColumn7_label"><input type="checkbox" id="isColumn7">7<br/></label>
	<label id="isColumn8_label"><input type="checkbox" id="isColumn8">8<br/></label>

	<table class="tab_2"><tbody>
		<tr><th>№</th><th>есть</th><th>до пола</th></tr>
		<tr><td colspan="3">Внутренняя сторона:</td></tr>
		<tr id="column1_tr">
			<td>1</td>
			<td><input type="checkbox" id="isColumn1"></td>
			<td><input type="checkbox" id="isColumnLong1"></td>
		</tr>
		<tr id="column2_tr">
			<td>2</td>
			<td><input type="checkbox" id="isColumn2"></td>
			<td><input type="checkbox" id="isColumnLong2"></td>
		</tr>
		<tr id="column3_tr">
			<td>3</td>
			<td><input type="checkbox" id="isColumn3"></td>
			<td><input type="checkbox" id="isColumnLong3"></td>
		</tr>
		<tr id="column4_tr">
			<td>4</td>
			<td><input type="checkbox" id="isColumn4"></td>
			<td><input type="checkbox" id="isColumnLong4"></td>
		</tr>
		<tr><td colspan="3">Внешнняя сторона:</td></tr>
		<tr id="column5_tr">
			<td>5</td>
			<td><input type="checkbox" id="isColumn5"></td>
			<td><input type="checkbox" id="isColumnLong5"></td>
		</tr>
		<tr id="column6_tr">
			<td>6</td>
			<td><input type="checkbox" id="isColumn6"></td>
			<td><input type="checkbox" id="isColumnLong6"></td>
		</tr>
		<tr id="column7_tr">
			<td>7</td>
			<td><input type="checkbox" id="isColumn7"></td>
			<td><input type="checkbox" id="isColumnLong7"></td>
		</tr>
		<tr id="column8_tr">
			<td>8</td>
			<td><input type="checkbox" id="isColumn8"></td>
			<td><input type="checkbox" id="isColumnLong8"></td>
		</tr>
		<tr id="column9_tr">
			<td>9</td>
			<td><input type="checkbox" id="isColumn9"></td>
			<td><input type="checkbox" id="isColumnLong9"></td>
		</tr>
		<tr id="column10_tr">
			<td>10</td>
			<td><input type="checkbox" id="isColumn10"></td>
			<td><input type="checkbox" id="isColumnLong10"></td>
		</tr>
		<tr id="column11_tr">
			<td>11</td>
			<td><input type="checkbox" id="isColumn11"></td>
			<td><input type="checkbox" id="isColumnLong11"></td>
		</tr>
		<tr id="column12_tr">
			<td>12</td>
			<td><input type="checkbox" id="isColumn12"></td>
			<td><input type="checkbox" id="isColumnLong12"></td>
		</tr>
</tbody> </table>
</td>

</tr>
	
</tbody> </table>

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

<tr>
	<td style="width: 20%;">Нижний</td>
	<td><input id="stairAmt1" type="number" value="12"></td>
	<td><input id="h1" type="number" value="180"></td>
	<td><input id="b1" type="number" value="260"></td>
	<td><input id="a1" type="number" value="300"></td>
</tr>


<tr id="marsh_2_tr">
	<td>Средний</td>
	<td><input id="stairAmt2" type="number" value="5"></td>
	<td><input id="h2" type="number" value="180"></td>
	<td><input id="b2" type="number" value="260"></td>
	<td><input id="a2" type="number" value="300"></td>
</tr>


<tr id="marsh_3_tr">
	<td>Верхний</td>
	<td><input id="stairAmt3" type="number" value="5"></td>
	<td><input id="h3" type="number" value="180"></td>
	<td><input id="b3" type="number" value="260"></td>
	<td><input id="a3" type="number" value="300"></td>
</tr>

</tbody>
</table>

<div style="display:none" id="assembling_inputs">

<h4>3. Крепление лестницы.</h4>


<table class="form_table">
<tbody>
<tr>
	<th>Узел</th>
	<th>Материал</th>
	<th>Кол-во точек крепления</th>
</tr>

<tr>
	<td>Нижнее перекрытие</td> 
	<td> 
	<select id="fixType1" size="1" onchange="">
		<option value="монолит">монолит</option>
		<option value="пустотелая плита" >пустотелая плита</option>
		<option value="дерево" >дерево</option>		
	</select>
	</td>
	<td><input id="fixAmt1" type="number" value="2"></td>	
</tr>

<tr>
	<td>Стены</td> 
	<td> 
	<select id="fixType2" size="1" onchange="">
		<option value="монолит">монолит</option>
		<option value="полнотелый кирпич" >полнотелый кирпич</option>
		<option value="пустотелый кирпич" >пустотелый кирпич</option>
		<option value="пеноблок" >пеноблок</option>
		<option value="дерево" >дерево</option>	
		<option value="гипсокартон" >гипсокартон</option>			
	</select>
	</td>
	<td><input id="fixAmt2" type="number" value="2"></td>	
</tr>

<tr>
	<td>Верхнее перекрытие</td> 
	<td> 
	<select id="fixType3" size="1" onchange="">
		<option value="монолит">монолит</option>
		<option value="пустотелая плита" >пустотелая плита</option>
		<option value="дерево" >дерево</option>		
	</select>
	</td>
	<td><input id="fixAmt3" type="number" value="2"></td>	
</tr>

</tbody></table>
<br/>
<table class="form_table" ><tbody>
<tr id="platformTop_tr_3">
	<td>Опоры верхней площадки:</td> <td> 
	<select id="platformTopColumn" size="1" onchange="changeFormCarcas();">
		<option value="колонны">колонны</option>
		<option value="подкосы">подкосы</option>
	</select>
</td></tr>

<tr id="inclinedBeamAngle_tr" style="display: none">
	<td>Угол наклона подкоса к стене:</td>
	<td><input id="inclinedBeamAngle" type="number" value="45"></td>
</tr>

<tr id="platformTopColumnAmt_tr" style="display: none">
	<td>Количество опор верхней площадки</td>
	<td><input id="platformTopColumnAmt" type="number" value="0"></td>
</tr>

<tr id="platformTop_tr_4">
	<td>Фланец крепления к верхнему перекрытию:</td> <td> 
	<select id="topFlan" size="1" onchange="">
		<option value="есть">есть</option>
		<option selected value="нет">нет</option>
	</select>
</td></tr>

<tr>
	<td>Тип крепления к нижнему перекрытию:</td> <td> 
	<select id="bottomAngleType" size="1" onchange="">
		<option value="уголок">уголок</option>
		<option value="регулируемая опора">регулируемая опора</option>
	</select>
</td></tr>

<tr><td>Зазор от каркаса до стен, мм:</td> <td> 
	<input id="wallDist" type="number" value="10">
</td></tr>

</tbody></table>

</div>

<div id="complect_inputs">
<h4>4. Комплектация лестницы:</h4>

<table class="form_table" ><tbody>

<tr><td>Комплектация:</td> <td> 
	<select id="template" size="1" onchange="setTemplateCarcas()">		
		<option value="дерево 1" >дерево 1</option>
		<option value="дерево 2">дерево 2</option>
		<option value="дерево 3">дерево 3</option>	
		<option value="дерево 4">дерево 4</option>
		<option value="индивидуальная">индивидуальная</option>
	</select>
</td></tr>

<tr><td>Ступени:</td> <td> 
	<select id="stairType" size="1" onchange="">
		<option value="сосна кл.Б">сосна кл.Б</option>
		<option value="береза паркет.">береза паркет.</option>
		<option value="дуб паркет.">дуб паркет.</option>
		<option value="дуб ц/л">дуб ц/л</option>
	</select>
</td></tr>

<tr><td>Тетивы:</td> <td> 
	<select id="stringerType" size="1" onchange="">
		<option value="сосна кл.Б">сосна кл.Б</option>
		<option value="береза паркет.">береза паркет.</option>
		<option value="дуб паркет.">дуб паркет.</option>
		<option value="дуб ц/л">дуб ц/л</option>
	</select>
</td></tr>		

<tr><td>Покраска металла:</td> <td> 
	<select id="metalPaint" size="1" onchange="">
		<option value="нет">нет</option>
		<option value="грунт">грунт</option>
		<option value="порошок">порошок</option>
		<option value="автоэмаль">автоэмаль</option>
	</select>
</td></tr>

<tr>
	<td>Цвет покраски металла</td> 
	<td><textarea id="comments_01" rows="1" cols="30" class="comments">cерый структурный</textarea></td>
</tr>

<tr id="timberPaint_tr"><td>Покраска дерева:</td> <td> 
	<select id="timberPaint" size="1" onchange="">
		<option value="нет">нет</option>
		<option value="лак">лак</option>
		<option value="морилка+лак">морилка+лак</option>		
	</select>
</td></tr>

<tr>
	<td>Цвет покраски дерева</td> 
	<td><textarea id="comments_02" rows="1" cols="30" class="comments">xm-8000-96 1:10</textarea></td>
</tr>

<tr><td>Сборка:</td> <td> 
	<select id="install" size="1" onchange="">
		<option value="нет">нет</option>
		<option value="есть">есть</option>
	</select>
</td></tr>


</tbody> </table>

</div>

Комментарии к расчету:<br/>  <textarea id="comments_03" rows="1" cols="80" class="comments"></textarea>
<br/>

<!--Обработчик формы-->
<script type="text/javascript" src="/calculator/mono/forms/carcas_form_change.js"></script>

