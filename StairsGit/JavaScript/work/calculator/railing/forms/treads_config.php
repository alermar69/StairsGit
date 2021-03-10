<h4>Обшивка:</h4>

<table class="form_table">
	<tbody>
	
		<tr>
			<td>Ступени:</td>
			<td>
				<select id="stairType" size="1">
					<option value="нет">нет</option>
					<option value="массив">дерево</option>
				</select>
			</td>
		</tr>
		
		<tr class="treadParams">
			<td>Подступенки:</td>
			<td>
				<select id="riserType" size="1">
					<option value="нет">нет</option>
					<option value="есть">есть</option>
				</select>
			</td>
		</tr>
		
		<tr class="treadParams">
			<td>Подсветка ступеней:</td>
			<td>
				<select id="treadLigts" size="1">
					<option value="нет">нет</option>
					<option value="есть">есть</option>
				</select>
			</td>
		</tr>
		
		<tr class="treadParams">
			<td>Фанера:</td>
			<td>
				<select id="plywoodThk" size="1">
					<option value="0">нет</option>
					<option value="15">15мм</option>
				</select>
			</td>
		</tr>
		
		<tr class="treadParams">
			<td>Свес ступени:</td>
			<td>
				<input type="number" id="nose" value="20">
			</td>
		</tr>
		
		<tr class="treadParams">
			<td>Толщина ступени:</td>
			<td>
				<!-- <input type="number" id="treadThickness" value="40"> -->
				<select name="" id="treadThickness">
					<option value="40">40</option>
					<option value="60">60</option>
					<option value="80">80</option>
					<option value="100">100</option>
				</select>
			</td>
		</tr>
		
		<tr class="treadParams">
			<td>Толщина подступенка:</td>
			<td>
				<input type="number" id="riserThickness" value="20">
			</td>
		</tr>
	</tbody>
</table>