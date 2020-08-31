<!--Ограждения с деревянными балясинами -->
<tr class="timber_tr railing_tr timber_kovka_tr"><td>Балясин на ступень:</td> <td> 
	<select id="timberBalStep" size="1" onchange="">
		<option value="1">1</option>
		<option value="1.5" >3/2</option> 
		<option value="2">2</option>
	</select>
</td></tr>

<tr style="display: none"><td>Столбы:</td> <td> 
	<select id="timberNewellType" size="1" onchange="">
		<option value="точеные">точеные</option>
		<option value="квадратные">квадратные</option>
	</select>
</td></tr>

<tr style="display: none"><td>Балясины:</td> <td> 
	<select id="timberBalType" size="1" onchange="">
		<option value="точеные">точеные</option>
		<option value="квадратные">квадратные</option>
	</select>
</td></tr>

<tr style="display: none"><td>Верхнее окончание:</td> <td> 
	<select id="timberBalTopEnd" size="1" onchange="">
		<option value="круг">круглое</option>
		<option value="квадрат">квадратное</option>
	</select>
</td></tr>
<tr style="display: none"><td>Нижнее окончание:</td> <td> 
	<select id="timberBalBotEnd" size="1" onchange="">
		<option value="круг">круглое</option>
		<option value="квадрат" selected >квадратное</option>
	</select>
</td></tr>

<tr class="timber_tr railing_tr"><td>Размер балясин:</td> <td> 
	<select id="banisterSize" size="1" onchange="">
		<option value="40">40x40</option>
		<option value="50" selected>50x50</option>
		<option value="60">60x60</option>
	</select>
</td></tr>

<tr class="timber_tr railing_tr"><td>№ балясин по каталогу:</td> <td> 
	<input id="timberBalModel" type="text" value="10">
	<button class="showModal noPrint" data-modal="timberBalsModal">эскизы</button>
</td></tr>

<!--общие параметры ограждений -->

<tr class="timber_tr timber_kovka_tr timber_glass_tr railing_tr"><td>№ столбов по каталогу:</td> <td> 
	<input id="timberRackModel" type="text" value="01">
	<button class="showModal noPrint" data-modal="timberNewellsModal">эскизы</button>
</td></tr>

<tr class="timber_tr timber_kovka_tr timber_glass_tr railing_tr"><td>Навершия столбов:</td> <td> 
	<select id="newellTopType" size="1" onchange="">
		<option value="плоское">плоское</option>
		<option value="пирамидка">пирамидка</option>
		<option value="шар" >шар</option> 
		<option value="крышка">крышка плоская</option>
		<option value="крышка пирамидка">крышка пирамидка</option>
	</select>
</td></tr>

<tr class="timber_tr timber_kovka_tr railing_tr"><td>Стартовый столб:</td> <td> 
	<select id="startNewellType" size="1" onchange="">		
		<option value="как на лестнице">как на лестнице</option>
		<option value="резной">объемный резной</option>
	</select>
</td></tr>

<tr class="timber_tr timber_kovka_tr railing_tr"><td>Заверщающий столб:</td> <td> 
	<select id="lastNewellType" size="1" onchange="">		
		<option value="как на лестнице">как на лестнице</option>
		<option value="резной">объемный резной</option>
		<option value="нет">нет</option>
	</select>
</td></tr>

<tr class='startNewell'><td>Модель резных столбов:</td> <td> 
	<input id="startNewellModel" type="text" value="01">
	<button class="showModal noPrint" data-modal="startNewellModal">эскизы</button>
</td></tr>

<tr class='startNewell'><td>Сдвиг стартового столба:</td> <td> 
	X: <input id="startNewellMooveX" type="text" value="0">
	Z: <input id="startNewellMooveZ" type="text" value="0"><br/>
	Поворот: <input id="startNewellRot" type="text" value="0">
</td></tr>

<tr class='timber_tr railing_tr timber_kovka_tr'><td>Сдвиг завершающего столба:</td> <td> 
	X: <input id="lastNewellMooveX" type="text" value="0"><br>
	Z: <input id="lastNewellMooveZ" type="text" value="0"><br>
	Поворот: <input id="lastNewellRot" type="text" value="0">
</td></tr>