<tr class="handrailParams_tr"><td>Модель поручня:</td> <td> 
	<select id="handrail" size="1" class='handrail'>	
		<option value="массив" selected >массив дерева</option>
		<option value="40х20 черн.">черн. 40х20</option>
		<option value="40х40 черн.">черн. 40х40</option>
		<option value="60х30 черн.">черн. 60х30</option>
		<option value="40х40 нерж.">нерж. 40х40</option>
		<option value="Ф50 нерж.">нерж. Ф50 </option>
		<option value="Ф50 нерж. с пазом">нерж. Ф50 с пазом</option>
		<option value="40х60 нерж. с пазом">нерж. 40х60 с пазом</option>
		<option value="ПВХ">ПВХ Ф50</option>
		
		<option value="сосна">сосна</option>
		<option value="береза">береза</option>
		<option value="лиственница">лиственница</option>
		<option value="дуб паркет.">дуб паркет.</option>
		<option value="дуб ц/л">дуб ц/л</option>
		<option value="нет">нет</option>

	</select>
</td></tr>

<tr class="handrailParams_tr"><td>Профиль поручня:</td> <td> 
	<select id="handrailProf" size="1" class='handrailProf'>			
		<option value="40х60 верт.">40х60 верт.</option>
		<option value="40х80 верт.">40х80 верт.</option>
		<option value="40х100 верт.">40х100 верт.</option>	
		<option value="40х60 гор.">40х60 гор.</option>
		<option value="40х70 гор.">40х70 гор.</option>	
	</select>
</td></tr>

<tr class="handrailParams_tr"><td>Проточки по бокам:</td> <td> 
	<select id="handrailSlots" size="1" class='handrailSlots'>	
		<option value="нет">нет</option>
		<option value="да">да</option>
	</select>
</td></tr>

<tr class="handrailParams_tr"><td>Торцы поручня:</td> <td>
	<select id="handrailEndType" size="1" onchange="">	
		<option value="прямые">прямые</option>
		<option value="под углом">под углом</option>
	</select>
</td></tr>

<tr class="handrailParams_tr"><td>Стыки поручня на поворотах:</td> <td> 
	<select id="handrailConnectionType" size="1">	
		<option value="прямые">прямые с зазором</option>
		<option value="без зазора">без зазора стандартные</option>
		<option value="без зазора премиум">без зазора премиум</option>
		<option value="шарнир">шарнир</option>
	</select>
</td></tr>

<tr class="handrailParams_tr"><td>Стыки поручня по длине (где необходимо):</td> <td> 
	<select id="handrailConnectionType_len" size="1" onchange="">	
		<option value="с рустом" selected>с рустом</option>
		<option value="без руста">без руста</option>
	</select>
</td></tr>

<tr class="handrailParams_tr">
	<td>Горизонтальный участок в конце</td>
	<td> 
		<select id="handrailEndHor" size="1">	
			<option value="нет">нет</option>
			<option value="да">да</option>
		</select>
	</td>
</tr>
<tr class="handrailParams_tr">
	<td>Поправка по высоте горизонтального участка</td>
	<td> 
		<input id="handrailEndHeight" type='number' value="0">	
	</td>
</tr>

<tr class="handrailParams_tr">
	<td>Длина горизонтального участка</td>
	<td> 
		<input id="handrailEndLen" type='number' value="100">	
	</td>
</tr>

<tr><td>Пристенные кронштейны:</td> <td> 
	<select id="sideHandrailHolders" size="1" onchange="">	
		<option value="крашеные">крашеные</option>
		<option value="нержавеющие">нержавеющие</option>
	</select>
</td></tr>

	