<span id='page'>Отладка</span>

<table class="form_table" id="paramsTable"><tbody>
	
	
	<tr><td>Назначение стола:</td>
		<td>
			<select id='tableType'>
				<option value='обеденный'>обеденный</option>
				<option value='письменный'>письменный</option>
				<option value='журнальный'>журнальный</option>
			</select>
		</td>
	</tr>
	
	<tr><td>Длина, мм:</td>
		<td>
			<input id="width" value = "1200" type='number'>
		</td>
	</tr>
	
	<tr><td>Ширина, мм:</td>
		<td>
			<input id="depth" value = "600" type='number'>
		</td>
	</tr>
	
	<tr><td>Высота, мм:</td>
		<td>
			<input id="height" value = "750" type='number'>
		</td>
	</tr>
	
	
	<tr><td>Материал столешницы:</td>
		<td>
			<select id='countertopType'>
				<option value='дуб'>массив дуба</option>
				<option value='береза'>массив березы</option>
				<option value='стекло'>закаленное стекло</option>
			</select>
		</td>
	</tr>
	
	<tr><td>Толщина столешницы, мм:</td>
		<td>
			<select id='countertopThk'>
				<option value='20'>20</option>
				<option value='40' selected>40</option>
				<option value='60'>60</option>
				<option value='80'>80</option>
			</select>
		</td>
	</tr>
	
	<tr><td>Полка:</td>
		<td>
			<select id='shelfType'>
				<option value='нет'>нет</option>
				<option value='есть'>есть</option>
			</select>
		</td>
	</tr>
	
	<tr class='drawers'><td>Тумбы:</td>
		<td>
			<select id='drawersBlocks'>
				<option value='0'>нет</option>
				<option value='1'>одна</option>
				<option value='2'>две</option>	
			</select>
		</td>
	</tr>
	
	<tr class='drawers'><td>Количество выдвижных ящиков в тумбе:</td>
		<td>
			<select id='drawersAmt'>
				<option value='2'>два</option>
				<option value='3'>три</option>
				<option value='4'>четыре</option>	
			</select>
		</td>
	</tr>
	
	<tr class='drawers'><td>Фурнитура выдвижных ящиков:</td>
		<td>
			<select id='drawersType'>
				<option value='эконом'>эконом</option>
				<option value='стандарт'>стандартная</option>
				<option value='премиум'>премиум</option>
			</select>
		</td>
	</tr>
	
	</tbody>
</table>


<h2>Результат расчета: </h2>

<span style="text-align: center;" class="p"><span style="font-size: 28px;">Стоимость: &nbsp; <span id="calcPrice">9 690</span> руб.</span></span>
<span style="text-align: center;" class="p"><span style="font-size: 28px;">Стоимость с учетом скидки: <span id="calcPrice_discount">6 790</span> руб.</span></span>
