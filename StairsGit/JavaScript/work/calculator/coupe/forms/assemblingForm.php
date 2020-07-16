<h4>4. Сборка:</h4>

<table class="form_table" ><tbody>

<tr><td>Доставка:</td> <td> 
	<select id="delivery" size="1" >
		<option value="центр">в пределах ТТК</option>
		<option value="Москва" selected >в пределах МКАД</option>
		<option value="Московская обл.">за МКАД</option>
	</select>
</td></tr>

<tr><td>Расстояние от МКАД, км:</td> <td><input id="deliveryDist" type="number" value="0"></td></tr>

<tr class="installation_tr"><td>Подгонка деталей по месту:</td> <td> 
	<select id="partsCutting" size="1" onchange="">
		<option value="нет">нет</option>
		<option value="да">да</option>
	</select>
</td></tr>

<tr> 
	<td>Этаж</td> 
	<td><input id="floorNumber" type="number" value="1"></td>
</tr>
	
<tr class="installation_tr"><td>Подъем на этаж:</td> <td> 
	<select id="lift" size="1">
		<option value="не известно">не известно</option>
		<option value="грузовой лифт">грузовой лифт</option>
		<option value="пассажирский лифт">пассажирский лифт</option>
		<option value="лестница">лестница</option>
	</select>
</td></tr>

<tr class="installation_tr"><td>Требуется тура:</td> <td> 
	<select id="needScaffolding" size="1">
		<option value="не известно">не известно</option>
		<option value="нет">нет</option>
		<option value="да">да</option>
	</select>
</td></tr>


<tr class="installation_tr">
	<td>Платная парковка рядом с объектом:</td><td> 
	<select id="paidParking" size="1">
		<option value="нет">нет</option>
		<option value="да">да</option>
	</select>
</td> </tr>

</tbody> </table>
<p class="installation_tr">
Ограничения по времени работы на объекте:<br/>  
<textarea ID="comments" rows="2" cols="80" class="comments">Работы можно производить в любой день (предварительно согласованный) с 8:00 до 23:00</textarea>
</p>

<!--обработчик формы-->
<script type="text/javascript" src="/calculator/coupe/forms/assemblingFormChange.js"></script>