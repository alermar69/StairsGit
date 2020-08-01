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
				<td>Тип:</td>
				<td>
					<select id="pltType">
						<option value="отдельная">отдельная</option>
						<option value="единая с лестницей">единая с лестницей</option>
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
				<td>Крепление:</td>
				<td>
					<select id="pltFixType">
						<option value="фланцы">фланцы</option>
						<option value="бетон">заливка бетоном</option>
						<option value="винтовые сваи">винтовые сваи</option>
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
			
			<tr>
				<td>Боковые балки:</td>
				<td>
					<select id="pltSideBeam" size="1">
						<option value="профиль">профиль</option>
						<option value="тетива">тетива</option>
					</select>
				</td>
			</tr>
			
			pltSideBeam 

			</tbody>
	</table>
	
	<h3>Сечения элементов</h3>
	<table class="form_table">
		<tbody>
			<tr>
				<td>Сечения:</td>
				<td>
					<select id="pltProfTypes">
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
					<select id="pltColumnProf">
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
			
			

</div>