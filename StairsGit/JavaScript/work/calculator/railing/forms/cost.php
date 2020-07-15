<br/>
<button id="showCost" class="noPrint">Показать себестоимость</button>


<div id="cost" class="cost" style="display: none">
	<h2 class="raschet" >Расчет себестоимости</h2>

	<p>К-т на общую цену: <input id="railingPriceFactor" type="number" value="1"></p>
	<p>К-т на себестоимость стекол: <input id="glassCostFactor" type="number" value="1"></p>
	<p>К-т на себестоимость монтажа: <input id="assemblingCostFactor" type="number" value="1"></p>
	<p>К-т на себестоимость проч.: <input id="otherCostFactor" type="number" value="1"></p>
	
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
	<!-- Для поддержки старого вывода себестоимости -->
	<div id="total_railing_cost">
		<p>Расчет еще не произведен</p>
	</div>

	<div id="glassParamsTable"></div>

	<h3>Данные для экспорта при запуске в работу</h3>
	<div id="exportData"></div>


</div>