<table class="form_table">
	<tbody>
		<tr>
			<td>Расчет:</td>
			<td>
				<select id="calcMode" size="1">
					<option value="балка">балка однопролетная</option>
					<option value="площадка">площадка</option>
					<option value="балка многопролетная">балка многопролетная</option>
				</select>
			</td>
		</tr>

		<tr>
			<td>Длина l, мм:</td>
			<td><input id="len" type="number" value="1000"></td>
		</tr>
		
		<tr class="plt">
			<td>Ширина, мм:</td>
			<td><input id="width" type="number" value="1000"></td>
		</tr>
		
		<tr class="multiSpan">
			<td>Кол-во пролетов:</td>
			<td><input id="spanAmt" type="number" value="1"></td>
		</tr>
		
		<tr class="plt">
			<td>Кол-во промежуточных поперечных балок:</td>
			<td><input id="beamAmt" type="number" value="1"></td>
		</tr>
		
		<tr>
			<td>Сечение продольных балок:</td>
			<td>
				<select id="beam1" size="1"></select>
			</td>
		</tr>
		
		<tr>
			<td>Ix продольных балок, см4:</td>
			<td><input id="beamIx_1" type="number" value="100"></td>
		</tr>
		
		<tr class="plt">
			<td>Сечение поперечных балок:</td>
			<td>
				<select id="beam2" size="1"></select>
			</td>
		</tr>
		
		<tr>
			<td>Ix продольных балок, см4:</td>
			<td><input id="beamIx_2" type="number" value="100"></td>
		</tr>
		
		<tr class="beam">
			<td>Распределенная нагрузка q, кг/м.п.:</td>
			<td><input id="load_m" type="number" value="200"></td>
		</tr>
		
		<tr class="beam">
			<td>Сосредоточенная нагрузка на середину P, кг:</td>
			<td><input id="load_p" type="number" value="100"></td>
		</tr>
		
		<tr class="plt">
			<td>Распределенная нагрузка, кг/м2:</td>
			<td><input id="load_m2" type="number" value="200"></td>
		</tr>
		
	</tbody>
</table>
</div>

<button class="raschet">Рассчитать </button>