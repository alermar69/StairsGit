<input id="sectAmt" type="number" value="1">

<div class="corner">
<b>Левая сторона</b>
<br/>
<br/>
</div>

<table class="form_table" id="sectParamsTable" ><tbody>
<tr>
	<th>№ секции:</th>
	<th>Тип:</th>
	<th>Ширина:</th>
	<th>Удалить</th>
</tr>
<tr class="sectParams"> 
			<td class="sectNumber"> 1</td> 
				<td>
					<select class="door" id="door0" size="1">
						<option value="открытая">открытая</option>
						<option value="вправо">дверь правая</option>
						<option value="влево">дверь левая</option>
						<option value="две двери">две двери</option>
						<option value="выдвижная">выдвижной шкаф</option>
					</select>
				</td>
				<td><input class="sectWidth" id="sectWidth0" type="number" value="100" step="5"></td>	
				<td></td>
			</tr> 

</tbody> </table>
<br/>
<button id="addSect">Добавить</button>
<button id="equalSectWidth">Выровнять</button>

<br/>
<br/>
<span>Антресольная полка
	<select id="isTopShelf" size="1">
		<option value="есть">есть</option>
		<option value="нет">нет</option>
	</select>
</span> <br/>
<span>Высота<input class="topShelfPosY" id="topShelfPosY" type="number" value="1800" step="5"></span> <br/>
<span>Начальная секция<input id="topShelfSect1" type="number" value="1" step="1"></span> <br/>
<span>Конечная секция<input id="topShelfSect2" type="number" value="2" step="1"></span> <br/>


<div class="corner">
<br/>
<b>Правая сторона</b>
<br/>
<br/>
<input id="sectAmt_r" type="number" value="1">
<table class="form_table" id="sectParamsTable_r" ><tbody>
<tr>
	<th>№ секции:</th>
	<th>Тип:</th>
	<th>Ширина:</th>
	<th>Удалить</th>
</tr>
<tr class="sectParams"> 
			<td class="sectNumber_r"> 21</td> 
				<td>
					<select class="door" id="door20" size="1">
						<option value="открытая">открытая</option>
						<option value="вправо">дверь правая</option>
						<option value="влево">дверь левая</option>
						<option value="две двери">две двери</option>
						<option value="выдвижная">выдвижной шкаф</option>
					</select>
				</td>
				<td><input class="sectWidth" id="sectWidth20" type="number" value="100" step="5"></td>	
				<td></td>
			</tr> 

</tbody> </table>
<br/>
<button id="addSect_r">Добавить секцию</button>
<button id="equalSectWidth_r">Выровнять ширину</button>

<br/>
<br/>
<span>Антресольная полка
	<select id="isTopShelf_r" size="1">
		<option value="есть">есть</option>
		<option value="нет">нет</option>
	</select>
</span> <br/>
<span>Высота<input id="topShelfPosY_r" type="number" value="1800" step="5"></span> <br/>
<span>Начальная секция<input id="topShelfSect1_r" type="number" value="21" step="1"></span> <br/>
<span>Конечная секция<input id="topShelfSect2_r" type="number" value="22" step="1"></span> <br/>
</div>

<!--Обработчик формы-->
<script type="text/javascript" src="/calculator/coupe/forms/sectFormChange.js"></script>