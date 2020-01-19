<h3>Расположение стен</h3>
<table class="form_table" ><tbody>
<tr><th>Стена</th><th>Длина</th><th>Высота</th><th>Позиция X</th> <th>Позиция Z</th><th>Толщина</th></tr> 
<tr>
	<td>1</td>
	<td><input type="number" id="wallLength_1" value="5000"/></td>
	<td><input type="number" id="wallHeight_1" value="5000"/></td>
	<td><input type="number" id="wallpositionX_1" value="0"/></td>
	<td><input type="number" id="wallpositionZ_1" value="0"/></td>
	<td><input type="number" id="wallThickness_1" value="150"/></td>
</tr>
<tr>
	<td>2</td>
	<td><input type="number" id="wallLength_2" value="5000"/></td>
	<td><input type="number" id="wallHeight_2" value="5000"/></td>
	<td><input type="number" id="wallpositionX_2" value="0"/></td>
	<td><input type="number" id="wallpositionZ_2" value="0"/></td>
	<td><input type="number" id="wallThickness_2" value="150"/></td>
</tr>
<tr>
	<td>3</td>
	<td><input type="number" id="wallLength_3" value="5000"/></td>
	<td><input type="number" id="wallHeight_3" value="5000"/></td>
	<td><input type="number" id="wallpositionX_3" value="0"/></td>
	<td><input type="number" id="wallpositionZ_3" value="0"/></td>
	<td><input type="number" id="wallThickness_3" value="150"/></td>
</tr>
<tr>
	<td>4</td>
	<td><input type="number" id="wallLength_4" value="5000"/></td>
	<td><input type="number" id="wallHeight_4" value="5000"/></td>
	<td><input type="number" id="wallpositionX_4" value="0"/></td>
	<td><input type="number" id="wallpositionZ_4" value="0"/></td>
	<td><input type="number" id="wallThickness_4" value="150"/></td>
</tr>
</tbody>
</table>

<h3>Проемы и выступы в стенах</h3>
<table class="form_table" ><tbody>
<tr><th>Тип</th><th>Стена</th><th>Длина</th><th>Высота</th><th>Позиция X</th> <th>Позиция Y</th><th>Глубина</th></tr> 
<tr>
	<td>
		<select id="holeType" size="1" onchange="">
			<option value="проем">проем</option>
			<option value="выступ" selected >выступ</option>
		</select>
	</td>
	<td>1</td>
	<td><input type="number" id="holeLength_1" value="1000"/></td>
	<td><input type="number" id="holeHeight_1" value="1500"/></td>
	<td><input type="number" id="holepositionX_1" value="1000"/></td>
	<td><input type="number" id="holepositionY_1" value="1000"/></td>
	<td><input type="number" id="holeThickness_1" value="150"/></td>
</tr>
</tbody>
</table>