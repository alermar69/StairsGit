<div id="assembling">
	<h2>Дополнительные услуги:</h2>
	<div class="toggleDiv">
		<table class="form_table" ><tbody>

			<tr><td>Выдача документов для МЧС:</td> <td> 
				<select id="isTesting" size="1" onchange="changeFormAssembling()">
					<option value="нет">нет</option>
					<option value="да">да</option>
				</select>
			</td></tr>

			<tr><td>Доставка:</td> <td> 
				<select id="delivery" size="1" onchange="changeFormAssembling()">
					<option value="нет">нет</option>
					<option value="центр">в пределах ТТК</option>
					<option value="Москва">в пределах МКАД</option>
					<option value="Московская обл.">за МКАД</option>
					<option value="транспортная компания">до транспортной компаниии</option>
				</select>
			</td></tr>

			<tr id="deliveryDist_tr">
			<td>Расстояние от МКАД, км:</td> 
			<td><input id="deliveryDist" type="number" value="0"></td>
			</tr>

			<tr><td>Монтаж:</td> <td> 
				<select id="isAssembling" size="1" onchange="changeFormAssembling()">
					<option value="нет">нет</option>
					<option value="есть">есть</option>
				</select>
			</td></tr>

			<tr class="installation_tr"><td>Разборка фасада:</td> <td> 
				<select id="facade" size="1" onchange="">
					<option value="нет">нет</option>
					<option value="да">да</option>
				</select>
			</td></tr>


			<tr class="installation_tr">
				<td>Платная парковка рядом с объектом:</td><td> 
				<select id="paidParking" size="1" onchange="">
					<option value="нет">нет</option>
					<option value="да">да</option>
				</select>
			</td> </tr>

		</tbody> </table>
		
		<p class="installation_tr">
		Ограничения по времени работы на объекте:<br/>  
		<textarea ID="comments" rows="2" cols="80" class="comments">Работы можно производить в любой день (предварительно согласованный) с 8:00 до 23:00</textarea>
		</p>
	</div>
</div>

<!--обработчик формы-->
<script type="text/javascript" src="/calculator/fire_2/forms/assemblingFormChange.js"></script>

