<div id="assemblingWrap">
	<h3>Доставка, сборка на объекте</h3>
	
	<div id="assembling" class="toggleDiv">
		<table class="form_table" ><tbody>

			<tr><td>Доставка:</td> <td> 
				<select id="delivery" size="1" onchange="changeFormAssembling()">
					<option value="нет">нет</option>
					<option value="Москва">в пределах МКАД</option>
					<option value="Московская обл.">за МКАД</option>
					<option value="транспортная компания">до транспортной компаниии</option>
				</select>
			</td></tr>

			<tr><td>Расстояние от МКАД, км:</td> <td><input id="deliveryDist" type="number" value="0"></td></tr>

			<tr class="delivery"><td>Кол-во доставок:</td> <td> 
				<select id="deliveryAmt" size="1">
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="5">5</option>
				</select>
			</td></tr>
			
			<tr class="delivery"><td>Разгрузка силами заказчика:</td> <td> 
				<select id="customersLoad" size="1">
					<option value="не указано">не указано</option>
					<option value="да">да</option>
					<option value="нет">нет</option>
				</select>
			</td></tr>
			
			<tr class="delivery"><td>Доставку в монтаж:</td> <td> 
				<select id="deliveryInAssembling" size="1">
					<option value="нет">нет</option>
					<option value="да">да</option>
				</select>
			</td></tr>
			
			<tr><td>Сборка:</td> <td> 
				<select id="isAssembling" size="1" onchange="changeFormAssembling()">
					<option value="нет">нет</option>
					<option value="есть">есть</option>
				</select>
			</td></tr>

			<tr class="installation_tr">
				<td>Кол-во выездов:</td>
				<td><input id="transfersAmt" type="number" value="1" onchange=""></td>
			</tr>
			
			<tr class="installation_tr"><td>Минималка:</td> <td> 
				<select id="minWage" size="1" onchange="">					
					<option value="да">да</option>
					<option value="нет">нет</option>
				</select>
			</td></tr>
			
			<tr class="installation_tr"><td>Шаблонировние:</td> <td> 
				<select id="needMockup" size="1" onchange="">
					<option value="нет">нет</option>
					<option value="да">да</option>
				</select>
			</td></tr>

			<tr class="installation_tr"><td>Подгонка некрашеных деталей:</td> <td> 
				<select id="stepCutting" size="1" onchange="">
					<option value="нет">нет</option>
					<option value="да">да</option>
				</select>
			</td></tr>

			<tr class="installation_tr">
				<td>Завязка поручней по месту (кол-во стыков):</td>
				<td><input id="handrailCutting" type="number" value="0" onchange=""></td>
			</tr>


			<tr class="installation_tr">
				<td>Подъем на 3 и более этаж без лифта:</td> 
				<td> 
					<select id="noLiftCare" size="1" onchange="">
						<option value="не указано">не указано</option>
						<option value="нет">нет</option>
						<option value="да">да</option>
					</select>
				</td>
			</tr>

			<tr class="installation_tr">
				<td>Кол-во этажей:</td>
				<td><input id="floorAmt" type="number" value="0" onchange=""></td>
			</tr>


			<tr class="installation_tr"><td>Требуется сварка:</td> <td> 
				<select id="isWelding" size="1" onchange="changeFormAssembling()">
					<option value="не указано">не указано</option>
					<option value="нет">нет</option>
					<option value="да">да</option>
				</select>
			</td></tr>

			<tr class="installation_tr"><td>Требуется тура:</td> <td> 
				<select id="isScaffolding" size="1" onchange="changeFormAssembling()">
					<option value="не указано">не указано</option>
					<option value="нет">нет</option>
					<option value="да">да</option>
				</select>
			</td></tr>

			<tr class="installation_tr"><td>Сложности при проносе:</td> <td> 
				<select id="isProblemCarry" size="1" onchange="changeFormAssembling()">
					<option value="не указано">не указано</option>
					<option value="нет">нет</option>
					<option value="да">да</option>
				</select>
			</td></tr>

			<tr class="installation_tr"><td>Теплый пол в месте установки:</td> <td> 
				<select id="isWarmFloor" size="1" onchange="changeFormAssembling()">
					<option value="не указано">не указано</option>
					<option value="нет">нет</option>
					<option value="да">да</option>
				</select>
			</td></tr>
			<tr class="installation_tr"><td>Место монтажа:</td> <td> 
				<select id="isHeating" size="1" onchange="changeFormAssembling()">
					<option value="не указано">не указано</option>
					<option value="улица">улица</option>
					<option value="отапливаемое помещение">отапливаемое помещение</option>
					<option value="холодное помещение">холодное помещение</option>
				</select>
			</td></tr>


			<tr class="installation_tr">
				<td>Платная парковка рядом с объектом:</td><td> 
				<select id="paidParking" size="1" onchange="">
					<option value="не указано">не указано</option>
					<option value="нет">нет</option>
					<option value="да">да</option>
				</select>
			</td> </tr>

			<tr class="installation_tr"><td>Кол-во этапов:</td> <td> 
				<select id="workers" size="1" onchange="">
					<option value="нет">нет</option>
					<option value="1" selected >1</option>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="5">5</option>
				</select>
			</td></tr>
			
			<!-- дополнительные параметры для расчета зарплаты монтажникам-->

			<tr class="installation_man" style="display: none;">
				<td>Повторные выезды из-за косяков:</td>
				<td><input id="extraTripAmt" type="number" value="0" onchange=""></td>
			</tr>


			<tr class="installation_man" style="display: none;">
				<td>Доставка силами монтажников:</td><td> 
				<select id="deliveryByInstallers" size="1" onchange="">
					<option value="нет">нет</option>
					<option value="да">да</option>
				</select>
			</td> </tr>
			

		</tbody> </table>
		
		<div class="assmStages">
			<h3>Разбивка по этапам</h3>
			<table class="form_table" ><tbody>
				<tr class='center'>
					<th>Часть изделия</th>
					<th>Номер этапа</th>
				</tr>
				
				<tr>
					<td>Каркас</td>
					<td>
						<select id="carcasAssmStage" size="1" onchange="">
							<option value="1" selected >1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="нет">нет</option>
						</select>
					</td>
				</tr>
				
				<tr>
					<td>Ступени</td>
					<td>
						<select id="treadsAssmStage" size="1" onchange="">
							<option value="1" selected >1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="нет">нет</option>
						</select>
					</td>
				</tr>
				
				<tr>
					<td>Ограждения</td>
					<td>
						<select id="railingAssmStage" size="1" onchange="">
							<option value="1" selected >1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="нет">нет</option>
						</select>
					</td>
				</tr>
				
				<tr>
					<td>Балюстрада</td>
					<td>
						<select id="banisterAssmStage" size="1" onchange="">
							<option value="1" selected >1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="нет">нет</option>
						</select>
					</td>
				</tr>
				
				
				
			</tbody> </table>
		</div>

	</div>
</div>