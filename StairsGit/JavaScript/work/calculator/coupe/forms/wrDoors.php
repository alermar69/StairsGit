<span>Кол-во дверок: <input id="kupeDoorAmt_wr" type="number" value="3"></span></br>

<span>Одинаковые: 
	<select class="door" id="isDoorsEqual" size="1">
		<option value="да">да</option>
		<option value="нет">нет</option>
	</select>
</span></br>

<div id="doorPar0" name="0" class="doorParamsDiv">
<p>Дверь 1</p>
<span style="display: none;">Кол-во вставок: <input id="inpostAmt0" type="number" value="1" ></span></br>
<table class="form_table"><tbody>
	<tr>
		<th>№ Вставки:</th>
		<th>Высота:</th>
		<th>Материал:</th>
		<th>Удалить</th>
	</tr>
	<tr class="inpostParams"> 
		<td class="inpostNumber"> 1</td>				
		<td><input class="inpostHeight" id="inpostHeight00" type="number" value="100" step="5"></td>
		<td>
			<select class="inpostMat" id="inpostMat00" size="1">
				<option value="зеркало">зеркало</option>
				<option value="лдсп">лдсп</option>
			</select>
		</td>
		<td></td>
	</tr> 
	
</tbody> </table>

<button class="addInpost">Добавить</button>
<button class="equalInpostHeight">Выровнять</button>
</div>


<div id="doorPar1" name="1" class="doorParamsDiv">
<p>Дверь 2</p>
<span style="display: none;">Кол-во вставок: <input id="inpostAmt1" type="number" value="1"></span></br>
<table class="form_table"><tbody>
	<tr>
		<th>№ Вставки:</th>
		<th>Высота:</th>
		<th>Материал:</th>
		<th>Удалить</th>
	</tr>
	<tr class="inpostParams"> 
		<td class="inpostNumber"> 1</td>				
			<td><input class="inpostHeight" id="inpostHeight10" type="number" value="100" step="5"></td>
			<td>
				<select class="inpostMat" id="inpostMat10" size="1">
					<option value="зеркало">зеркало</option>
					<option value="лдсп">лдсп</option>
				</select>
			</td>
			<td></td>
		</tr> 
</tbody> </table>
<button class="addInpost" >Добавить</button>
<button class="equalInpostHeight">Выровнять</button>
</div>

<div id="doorPar2" name="2" class="doorParamsDiv">
<p>Дверь 3</p>
<span style="display: none;">Кол-во вставок: <input id="inpostAmt2" type="number" value="1"></span></br>
<table class="form_table"><tbody>
	<tr>
		<th>№ Вставки:</th>
		<th>Высота:</th>
		<th>Материал:</th>
		<th>Удалить</th>
	</tr>
	<tr class="inpostParams"> 
		<td class="inpostNumber"> 1</td>				
			<td><input class="inpostHeight" id="inpostHeight20" type="number" value="100" step="5"></td>
			<td>
				<select class="inpostMat" id="inpostMat20" size="1">
					<option value="зеркало">зеркало</option>
					<option value="лдсп">лдсп</option>
				</select>
			</td>
			<td></td>
		</tr> 
</tbody> </table>
<button class="addInpost" >Добавить</button>
<button class="equalInpostHeight">Выровнять</button>
</div>

<div id="doorPar3" name="3" class="doorParamsDiv">
<p>Дверь 4</p>
<span style="display: none;">Кол-во вставок: <input id="inpostAmt3" type="number" value="1"></span></br>
<table class="form_table"><tbody>
	<tr>
		<th>№ Вставки:</th>
		<th>Высота:</th>
		<th>Материал:</th>
		<th>Удалить</th>
	</tr>
	<tr class="inpostParams"> 
		<td class="inpostNumber"> 1</td>				
			<td><input class="inpostHeight" id="inpostHeight30" type="number" value="100" step="5"></td>
			<td>
				<select class="inpostMat" id="inpostMat30" size="1">
					<option value="зеркало">зеркало</option>
					<option value="лдсп">лдсп</option>
				</select>
			</td>
			<td></td>
		</tr> 
</tbody> </table>
<button class="addInpost" >Добавить</button>
<button class="equalInpostHeight">Выровнять</button>
</div>

<div id="doorPar4" name="4" class="doorParamsDiv">
<p>Дверь 5</p>
<span style="display: none;">Кол-во вставок: <input id="inpostAmt4" type="number" value="1"></span></br>
<table class="form_table"><tbody>
	<tr>
		<th>№ Вставки:</th>
		<th>Высота:</th>
		<th>Материал:</th>
		<th>Удалить</th>
	</tr>
	<tr class="inpostParams"> 
		<td class="inpostNumber"> 1</td>				
			<td><input class="inpostHeight" id="inpostHeight40" type="number" value="100" step="5"></td>
			<td>
				<select class="inpostMat" id="inpostMat40" size="1">
					<option value="зеркало">зеркало</option>
					<option value="лдсп">лдсп</option>
				</select>
			</td>
			<td></td>
		</tr> 
</tbody> </table>
<button class="addInpost" >Добавить</button>
<button id="equalInpostHeight">Выровнять</button>
</div>

<!--Обработчик формы-->
<script type="text/javascript" src="/calculator/coupe/forms/doorsFormChange.js"></script>