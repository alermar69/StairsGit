<table class="form_table" id="startTreadsTable" ><tbody>

<tr><td>Кол-во:</td> <td> 
	<input type="number" value="0" id = "startTreadAmt">
</td></tr>

<tr class="startTreadsPar"><td>Сторона:</td> <td>
	<select size="1" id="arcSide">
        <option value="right">правая</option>
        <option value="left">левая</option>
		<option value="two">две</option>
    </select>
</td></tr>

<tr class="startTreadsPar">
	<td>Полная дуга спереди:</td> 
	<td>
		<select size="1" id="fullArcFront">
			<option value="да">да</option>
			<option value="нет">нет</option>
		</select>
	</td>
</tr>

<tr class="startTreadsPar">
	<td>Геометрия:</td> 
	<td>
		<select size="1" id="startTreadsTemplate">
			<option value="прямые">прямые</option>
			<option value="радиусные">радиусные</option>
			<option value="веер">веер</option>
			<option value="прямоугольные">прямоугольные</option>
			<option value="тонкая настройка">тонкая настройка</option>
		</select>
	</td>
</tr>


<tr class="noTemplate">
	<td>Ступень 1:</td> 
	<td>
		<span class="radStartTreadPar">
			К-т радиуса: <input type="number" value="0" id = "radiusFactor"></br>
			К-т ассиметрии: <input type="number" value="0" id = "asymmetryFactor"></br>
		</span>
		К-т проступи: <input type="number" value="100" id = "stepFactor"></br>
		<span class="rectStartTreadPar">
			К-т ширины: <input type="number" value="130" id = "widthFactor"></br>
		</span>
	</td>
</tr>

<tr class="noTemplate">
	<td>Ступень 2:</td> 
	<td>
		<span class="radStartTreadPar">
			К-т радиуса: <input type="number" value="0" id = "radiusFactor1"></br>
			К-т ассиметрии: <input type="number" value="0" id = "asymmetryFactor1"></br>
		</span>
		К-т проступи: <input type="number" value="100" id = "stepFactor1"></br>
		<span class="rectStartTreadPar">
			К-т ширины: <input type="number" value="120" id = "widthFactor1"></br>
		</span>
	</td>
</tr>

<tr class="noTemplate">
	<td>Ступень 3:</td>
	<td>
		<span class="radStartTreadPar">
			К-т радиуса: <input type="number" value="0" id = "radiusFactor2"></br>
			К-т ассиметрии: <input type="number" value="0" id = "asymmetryFactor2"></br>
		</span>
		К-т проступи: <input type="number" value="100" id = "stepFactor2"></br>
		<span class="rectStartTreadPar">
			К-т ширины: <input type="number" value="110" id = "widthFactor2"></br>
		</span>
	</td>
</tr>



</tbody> </table>


