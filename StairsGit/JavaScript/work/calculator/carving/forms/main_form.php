<table class="form_table" ><tbody>

<tr><td>Тип лестницы:</td> <td> 
	<select id="stringerType" size="1" onchange="">
		<option value="kos">Косоуры</option>
		<option value="tet">Тетивы</option>
	</select>
	
</td></tr>

<tr class="carcas"><td>Верхний узор:</td> <td>
	<select id="topOrnamentSeries" size="1" onchange="">
		<option value="no">нет</option>
		<option value="greece">Греческий</option>
		<option value="celtic">Кельтский</option>
		<option value="classic">Вензеля</option>
		<option value="eastern">Восточный</option>
		<option value="geometry">Геометрия</option>
		<option value="flora">Растительный</option>
		<option value="slavic">Славянский</option>
	</select>
	<select id="topOrnamentNumber" size="1" onchange="">
		<option value="1">№ 1</option>
		<option value="2">№ 2</option>
		<option value="3">№ 3</option>
		<option value="4">№ 4</option>
		<option value="5">№ 5</option>
		<option value="6">№ 6</option>
		<option value="7">№ 7</option>
		<option value="8">№ 8</option>
		<option value="9">№ 9</option>
		<option value="10">№ 10</option>
	</select>
	</br>
	
	<div id="topVariants" class="variants">
		<img src="/images/carving/tet_top_prv.jpg" id="topPrv">	
	</div>
	<span id="showTopVariants" class="moreInfo">показать эскизы</span>
</td></tr>

<tr class="carcas"><td>Нижний узор:</td> <td>
	<select id="botOrnamentSeries" size="1" onchange="">
		<option value="no">нет</option>
		<option value="greece">Греческий</option>
		<option value="celtic">Кельтский</option>
		<option value="classic">Вензеля</option>
		<option value="eastern">Восточный</option>
		<option value="geometry">Геометрия</option>
		<option value="flora">Растительный</option>
		<option value="slavic">Славянский</option>
	</select>
	<select id="botOrnamentNumber" size="1" onchange="">
		<option value="1">№ 1</option>
		<option value="2">№ 2</option>
		<option value="3">№ 3</option>
		<option value="4">№ 4</option>
		<option value="5">№ 5</option>
		<option value="6">№ 6</option>
		<option value="7">№ 7</option>
		<option value="8">№ 8</option>
		<option value="9">№ 9</option>
		<option value="10">№ 10</option>
	</select>
	</br>
	
	<div id="botVariants" class="variants">
		<img src="/images/carving/tet_bot_prv.jpg" id="botPrv">	
	</div>
	<span id="showBotVariants" class="moreInfo">показать эскизы</span>
</td></tr>


<tr class="risers"><td>Тип узора на подступенках:</td> <td>
	<select id="riserOrnamentSeries" size="1" onchange="">
		<option value="no">нет</option>
		<option value="greece">Греческий</option>
		<option value="celtic">Кельтский</option>
		<option value="classic" selected>Вензеля</option>
		<option value="eastern">Восточный</option>
		<option value="geometry">Геометрия</option>
		<option value="flora">Растительный</option>
		<option value="slavic">Славянский</option>
	</select>
<!--
	<select id="riserOrnamentNumber" size="1" class="ornamentId">		
		<option value="01">№ 1</option>
		<option value="02">№ 2</option>
		<option value="03">№ 3</option>
		<option value="04">№ 4</option>
		<option value="05">№ 5</option>
		<option value="06">№ 6</option>
		<option value="07">№ 7</option>
		<option value="08">№ 8</option>
		<option value="09">№ 9</option>
		<option value="10">№ 10</option>
		<option value="11">№ 11</option>
		<option value="12">№ 12</option>
		<option value="13">№ 13</option>
	</select>
	
-->
<input id="riserOrnamentNumber" class="ornamentId" type="text" value="01">
	</br>
	
	<div id="riserVariants" class="variants">
		<img src="/images/carving/risers_prv.jpg" id="risersPrv">
	</div>
	<span id="showRiserVariants" class="moreInfo">показать эскизы</span>
</td></tr>

<tr class="risers"><td>Расположение узора на подступенках:</td> <td>
	<select id="riserOrnamentPos" size="1" onchange="">
		<option value="на каждом">На каждом</option>
		<option value="через один">Через один</option>		
	</select>	
</td></tr>


</tbody> </table>

Комментарии к расчету:<br/>  <textarea id="comments_03" rows="1" cols="80" class="comments"></textarea>
<br/>

<!--обработчик формы-->
<script type="text/javascript" src="/calculator/carving/forms/main_form_change.js"></script>