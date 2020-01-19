<input id="boxAmt_wr" type="number" value="0" style="display: none;">
Показать: 
<select id="curSect" size="1">
		<option value="все">все</option>
		<option value="выбранные">выбранные</option>
		<option value="1">секция 1</option>
		<option value="2">секция 2</option>
		<option value="3">секция 3</option>
		<option value="4">секция 4</option>
		<option value="5">секция 5</option>
		<option value="6">секция 6</option>
		<option value="7">секция 7</option>
		<option value="8">секция 8</option>
		<option value="9">секция 9</option>
		<option value="10">секция 10</option>	
	</select>
	
<table class="form_table" id="boxParamsTable" style="width: 500px;"><tbody>
<tr>
	<th>№ секции:</th>
	<th>Позиция:</th>
	<th>Размеры:</th>
	<th>Тип</th>
	<th style="width: 80px;">Фасад</th>
	<th>X</th>
</tr>


</tbody> </table>

<button id="addBox">Добавить полку</button>
<br/>
<b>Выравнивание:</b>
<br/>
Верхняя граница: <input id="eqBorderTop" type="number" value="1000"> 
Нижняя граница: <input id="eqBorderBot" type="number" value="0"><br/>
<button id="equalboxHeight">Выровнять высоту</button>
<br/>
<b>Копирование:</b>
<br/>
Секция: <select id="copySectType" size="1">
		<option value="та же">та же</option>
		<option value="другая">другая</option>
	</select>
	
<span>Режим: <select id="copyType" size="1">
		<option value="зазор">зазор</option>
		<option value="смещение">смещение</option>
	</select>
</span>
<span>Смещение по Y: <input id="copyMooveY" type="number" value="200"><br/></span>

<span>№: <input id="copySect" type="number" value="1"></span><br/>
<button id="copyBox">Создать копию</button>


<!--Обработчик формы-->
<script type="text/javascript" src="/calculator/coupe/forms/contentFormChange.js"></script>