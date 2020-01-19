<br/>
<button id="showCost" class="noPrint">Показать себестоимость</button>

<div id="cost" style="display: none;">

	<h2 class="raschet" onclick='recalculate()' >Расчет себестоимости</h2>

	<h4>Коэффициенты на цену</h4>
	<table class="form_table" ><tbody>
	<tr><th>Наименование</th><th>к-т на себестоимость</th><th>к-т на цену</th> </tr>
	<tr>
		<td>Лестница:</td>
		<td><input id="carcasCostFactor" type="number" value="1"></td>
		<td><input id="carcasPriceFactor" type="number" value="1"></td>
	</tr>
	<tr>
		<td>Доставка:</td>
		<td><input id="deliveryCostFactor" type="number" value="1"></td>
		<td><input id="deliveryPriceFactor" type="number" value="1"></td>
	</tr>
	<tr>
		<td>Монтаж:</td>
		<td><input id="assemblingCostFactor" type="number" value="1"></td>
		<td><input id="assemblingPriceFactor" type="number" value="1"></td>
	</tr>

	<tr>
		<td>Испытания:</td>
		<td><input id="testingCostFactor" type="number" value="1"></td>
		<td><input id="testingPriceFactor" type="number" value="1"></td>
	</tr>

	</tbody> </table>

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

	<h3>Себестоимость лестницы</h3>
	<div id="cost_carcas">
		<p>Расчет еще не произведен</p>
	</div>

	<h3>Данные для экспорта при запуске в работу</h3>
	<div id="exportData" class="toggleDiv"></div>

</div>