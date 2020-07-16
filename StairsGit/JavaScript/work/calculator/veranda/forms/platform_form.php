<div id="carcasFormWrap">
	
	<h3>Общие параметры</h3>
	<table class="form_table">
		<tbody>
			<tr>
				<td>Модель:</td>
				<td>
					<select id="platformType">
						<option value="открытая">открытая</option>
						<option value="крытая">крытая</option>
					</select>
				</td>
			</tr>
			
			
			<tr>
				<td>Длина:</td>
				<td>
					<input type="number" id="pltLen" value="4000">
				</td>
			</tr>
			
			<tr>
				<td>Ширина:</td>
				<td>
					<input type="number" id="pltWidth" value="2500">
				</td>
			</tr>
			
			<tr>
				<td>Высота:</td>
				<td>
					<input type="number" id="pltHeight" value="1000">
				</td>
			</tr>
			
			<tr>
				<td>Количество столбов по длине:</td>
				<td>
					<input type="number" id="colAmt" value="4">
				</td>
			</tr>
			
			<tr>
				<td>Количество столбов по ширине:</td>
				<td>
					<input type="number" id="colAmtWid" value="2">
				</td>
			</tr>
			
			
			
			
			<tr>
				<td>Покраска металла:</td>
				<td>
					<select id="metalPaintPlt" size="1">
						<option value="порошок">порошок</option>
					</select>
				</td>
			</tr>
			
			<tr>
				<td>Крепление:</td>
				<td>
					<select id="fixType">
						<option value="фланцы">фланцы</option>
						<option value="бетон">заливка бетоном</option>
						<option value="винтовые сваи">винтовые сваи</option>
					</select>
				</td>
			</tr>
			
			<tr>
				<td>Покрытие:</td>
				<td>
					<select id="stairType" size="1">
						<option value="дпк">дпк</option>
						<option value="лиственница тер.">лиственница тер.</option>
						<option value="нет">нет</option>
					</select>
				</td>
			</tr>
			
			<tr>
				<td>Укаладка доски:</td>
				<td>
					<select id="floorCoverDir" size="1">
						<option value="по длине">по длине</option>
						<option value="по ширине">по ширине</option>
					</select>
				</td>
			</tr>

			</tbody>
	</table>
	
	<h3>Сечения элементов</h3>
	<table class="form_table">
		<tbody>
			<tr>
				<td>Сечения:</td>
				<td>
					<select id="profTypes">
						<option value="расчетные">расчетные</option>
						<option value="задаются">задаются</option>
					</select>
				</td>
			</tr>
			
			<tr>
				<td>Балки внешние:</td>
				<td>
					<select id="pltBeamProf">
						<option value="60х60">60х60</option>
						<option value="100х50">100х50</option>
						<option value="60х30">60х30</option>
						<option value="60х40">60х40</option>
						<option value="80х40">80х40</option>
					</select>
				</td>
			</tr>
			
			<tr>
				<td>Перемычки:</td>
				<td>
					<select id="pltBeamMidProf">
						<option value="60х60">60х60</option>
						<option value="100х50">100х50</option>
						<option value="60х30">60х30</option>
						<option value="60х40">60х40</option>
						<option value="80х40">80х40</option>
					</select>
				</td>
			</tr>	
			
			<tr>
				<td>Столбы:</td>
				<td>
					<select id="columnProf">
						<option value="60х60">60х60</option>
						<option value="80х80">80х80</option>
						<option value="100х100">100х100</option>
						<option value="100х50">100х50</option>
						<option value="80х40">80х40</option>
						<option value="40х40">40х40</option>
					</select>
				</td>
			</tr>
		</tbody>
	</table>
			
			
		<h3>6. Технологические параметры:</h3>

		<table class="form_table">
			<tbody>

				<tr class="custom">
					<td>Толщина доски:</td>
					<td><input id="treadThickness" type="number" value="20"></td>
				</tr>

				<tr>
					<td>Ширина доски:</td>
					<td><input id="dpcWidth" type="number" value="145"></td>
				</tr>
				<tr>
					<td>Зазор между досками:</td>
					<td><input id="dpcDst" type="number" value="5"></td>
				</tr>

			</tbody>
		</table>

</div>