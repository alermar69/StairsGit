<br/>
<button id="showCost" class="noPrint">Показать себестоимость</button>


<div id="cost">
	<h2 class="raschet">Расчет себестоимости</h2>

	<h4>Коэффициенты на цену</h4>
	<table class="form_table" ><tbody>
		<tr><th>Наименование</th><th>к-т на себестоимость</th><th>к-т на цену</th> </tr>
		<tr>
			<td>Лестница:</td>
			<td><input id="staircaseCostFactor" type="number" value="1"></td>
			<td><input id="staircasePriceFactor" type="number" value="1"></td>
		</tr>
		<tr>
			<td>Балюстрада:</td>
			<td><input id="balustradeCostFactor" type="number" value="1"></td>
			<td><input id="balustradePriceFactor" type="number" value="1"></td>
		<tr>
			<td>Сборка:</td>
			<td><input id="assemblingCostFactor" type="number" value="1"></td>
			<td><input id="assemblingPriceFactor" type="number" value="1"></td>
		</tr>
	</tbody> </table>

	<h4>Расчет скидки</h4>
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

	<h3 >Себестоимость лестницы</h3>
	<div id="cost_staircase">
		<p>Расчет еще не произведен</p>
	</div>

	<h3>Себестоимость балюстрады</h3>
	<div id="cost_banister">
		<p>Расчет еще не произведен</p>
	</div>

	<h3>Себестоимость доставки, сборки</h3>
	<div id="cost_assembling">
		<p>Расчет еще не произведен</p>
	</div>

	<h3>Данные для экспорта при запуске в работу</h3>
	<div id="exportData"></div>


</div>