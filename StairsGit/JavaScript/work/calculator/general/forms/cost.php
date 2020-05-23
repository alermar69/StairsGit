<br/>
<button id="showCost" class="noPrint">Показать себестоимость</button>

<div id="cost" class="cost" style="display: none">

	<h2 class="raschet" >Расчет себестоимости</h2>

	<h4 class="raschet">Коэффициенты на цену</h4>
	<div class="toggleDiv">
		<table class="form_table"><tbody>
			<tr><th>Наименование</th><th>к-т на себестоимость</th><th>к-т на цену</th> </tr>
			
			
			<?php
				//выцепляем модуль и представление из url
				$url = 'https://' . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
			
				//модуль
				$calc_types = ['bolz', 'console', 'metal', 'mono', 'railing', 'timber', 'timber_stock', 'vhod', 'vint', 'geometry', 'wardrobe', 'wardrobe_2', 'carport', 'objects'];
				$calc_type = '';
				foreach($calc_types as $item){
					if (strpos($url,'/'.$item) !== false) $calc_type = $item;
				};
				
				//лестницы
				if ($calc_type != 'carport') {					
					echo '<tr>
						<td>Каркас:</td>
						<td><input id="carcasCostFactor" type="number" value="1"></td>
						<td><input id="carcasPriceFactor" type="number" value="1"></td>
					</tr>
					<tr>
						<td>Ступени:</td>
						<td><input id="treadsCostFactor" type="number" value="1"></td>
						<td><input id="treadsPriceFactor" type="number" value="1"></td>
					<tr>
						<td>Перила:</td>
						<td><input id="railingCostFactor" type="number" value="1"></td>
						<td><input id="railingPriceFactor" type="number" value="1"></td>
					</tr>
					<tr>
						<td>Шкаф:</td>
						<td><input id="wrCostFactor" type="number" value="1"></td>
						<td><input id="wrPriceFactor" type="number" value="1"></td>
					</tr>';
				};
				
				//навесы
				if ($calc_type == 'carport') {
					echo '<tr>
							<td>Каркас:</td>
							<td><input id="carcasCostFactor" type="number" value="1"></td>
							<td><input id="carcasPriceFactor" type="number" value="1"></td>
						</tr>
						<tr>
							<td>Кровля:</td>
							<td><input id="roofCostFactor" type="number" value="1"></td>
							<td><input id="roofPriceFactor" type="number" value="1"></td>
						</tr>';
				};
				
			?>
			
			<tr>
				<td>Сборка:</td>
				<td><input id="assemblingCostFactor" type="number" value="1"></td>
				<td><input id="assemblingPriceFactor" type="number" value="1"></td>
			</tr>
			
		</tbody> </table>
	</div>

	<h4 class="raschet">Расчет скидки</h4>
	<b>Режим расчета: </b>
		<select id="discountMode" size="1">
			<option value="процент">% скидки</option>
			<option value="скидка">сумма скидки</option>
			<option value="цена">цена со скидкой</option>
		</select>
	</br>
		
	<b>Величина:</b> <input id="discountFactor" type="number" value="30">
	<br/><br/>

	Комментарии:<br/>  <textarea id="discountComments" rows="1" cols="80" class="comments"></textarea>

	<h3 class="raschet">Общая себестоимость</h3>
	
	<div id="total_cost">
		<p>Расчет еще не произведен</p>
	</div>

	<h3>Себестоимость каркаса и ступеней</h3>
	<div id="cost_carcas" class="toggleDiv">
		<p>Расчет еще не произведен</p>
	</div>

	<h3>Себестоимость ограждений лестницы</h3>
	<div id="cost_perila" class="toggleDiv">
		<p>Расчет еще не произведен</p>
	</div>

	<h3>Себестоимость балюстрады</h3>
	<div id="cost_banister" class="toggleDiv">
		<p>Расчет еще не произведен</p>
	</div>

	<h3>Себестоимость доставки, сборки</h3>
	<div id="cost_assembling" class="toggleDiv">
		<p>Расчет еще не произведен</p>
	</div>

	<h2>Данные для экспорта при запуске в работу</h2>
	<h3>Параметры:</h3>
	<div>
		Описание: 
		<select id="product_descr_type" class="exportData_type">
			<option value="авто">авто</option>
			<option value="вручную">ввести вручную</option>
		</select>
		<br>
		<div class="manualValues d-none">
			<textarea id="product_descr_manual" style="min-width: 70%"></textarea>
			<br>
		</div>
	</div>
	<div>
		Распределение по цехам: 
		<select id="dept_data_type" class="exportData_type">
			<option value="авто">авто</option>
			<option value="вручную">ввести вручную</option>
		</select>
		<br>
		
		<div class="manualValues d-none">
			<table class="tab_2" id="dept_data_manual"><thead>
				<tr>
					<th>Металл</th>
					<th>Дерево</th>
					<th>Подрядчики</th>
					<th>Итого</th>
				</tr>
			<thead><tbody>
				<tr>
					<td><input type="number" class="deptPart" data-dept="metal" id="metalDeptPart" value="0"></td>
					<td><input type="number" class="deptPart" data-dept="timber" id="timberDeptPart" value="0"></td>
					<td><input type="number" class="deptPart" data-dept="partners" id="partnersDeptPart" value="0"></td>
					<td><span id="totalDeptSum"></td>
				</tr>
			</tbody></table>
		</div>
	</div>
	
	<h3>Данные для экспорта:</h3>
	<div id="exportData" class="toggleDiv"></div>
	
</div>