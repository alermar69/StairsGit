<h3>Размеры и расположение проемов/выступов на стене</h3>

<table class="form_table" ><tbody>
<tr><th>Тип</th><th>№ стены</th><th>Размеры</th><th>Позиция</th></tr> 
<tr>
	<td>
		<select id="wallLedgeType0" size="1" onchange="">
			<option value="проем">проем</option>
			<option value="выступ">выступ</option> 
			<option value="параллелепипед">box</option> 
		</select>
	</td>
	<td>
		<select id="wallLedgeBaseWall0" size="1" onchange="">
			<option value="стена 1">стена 1</option>
		</select>
	</td>
	<td>X: <input type="number" id="wallLedgeWidth0" value="1000"/><br/>
	Y: <input type="number" id="wallLedgeHeight0" value="500"/><br/>
	Z: <input type="number" id="wallLedgeDepth0" value="100"/></td>
	<td>X: <input type="number" id="wallLedgePosX0" value="1000"/><br/>
	Y: <input type="number" id="wallLedgePosY0" value="1000"/></td>	
</tr>

<tr>
	<td>
		<select id="wallLedgeType1" size="1" onchange="">
			<option value="проем">проем</option>
			<option value="выступ" selected="selected">выступ</option> 
			<option value="параллелепипед">box</option> 
		</select>
	</td>
		<td>
		<select id="wallLedgeBaseWall1" size="1" onchange="">
			<option value="стена 1">стена 1</option>
		</select>
	</td>
	<td>X: <input type="number" id="wallLedgeWidth1" value="500"/><br/>
	Y: <input type="number" id="wallLedgeHeight1" value="1000"/><br/>
	Z: <input type="number" id="wallLedgeDepth1" value="200"/></td>
	<td>X: <input type="number" id="wallLedgePosX1" value="2000"/><br/>
	Y: <input type="number" id="wallLedgePosY1" value="2000"/></td>	
</tr>
</tbody>
</table>
Добавить выступ <br/>
Удалить выступ<br/>
