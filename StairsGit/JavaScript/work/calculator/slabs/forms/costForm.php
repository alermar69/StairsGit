<br/>
<button id="showCost" class="noPrint">Показать себестоимость</button>

<div id="cost" class="cost" style="display: none">

	<h2 class="raschet" >Расчет себестоимости</h2>
	
	<b>К-т на цену:</b> <input id="priceFactor" type="number" value="1">
	
	
	<h4 class="raschet">Расчет скидки</h4>
	<b>Режим расчета: </b>
		<select id="discountMode" size="1">
			<option value="процент">% скидки</option>
			<option value="скидка">сумма скидки</option>
			<option value="цена">цена со скидкой</option>
		</select>
	</br>
		
	<b>Величина:</b> <input id="discountFactor" type="number" value="20">
	<br/><br/>

	Комментарии:<br/>  <textarea id="discountComments" rows="1" cols="80" class="comments"></textarea>
	

<br/>
	<span id='totalCost'></span> 
	
	<br/>

	<br/>
	Описание изделия:
	<textarea id='descr'></textarea>
	
	<h3>Данные для экспорта при запуске в работу</h3>
	<div id="exportData" class="toggleDiv"></div>
	
</div>