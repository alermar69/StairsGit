<h2>Характеристики ограждений лестницы</h2>
<table class="form_table" ><tbody>

<!-- параметры расположения ограждений по маршам -->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/railing.php" ?>

<tr><td>Модель ограждения:</td> <td> 
	<select id="railingModel" size="1" onchange="changeFormRailing()">
		<option value="Редкие стойки">Редкие стойки</option>
		<option value="Частые стойки">Частые стойки</option>		
		
		<option style="display: none;" value="Ригели">Ригели</option>
		<option style="display: none;" value="Стекло на стойках">Стекло на стойках</option>
		<option style="display: none;" value="Кованые балясины">Кованые балясины</option>
		<option style="display: none;" value="Деревянные балясины">Деревянные балясины</option>
	</select>
</td></tr>

<!--общие параметры ограждений -->

<tr><td>Модель поручня:</td> <td> 
	<select id="handrail" size="1" onchange="">	
		<option value="ПВХ">круглый ПВХ</option>
		<option value="сосна">40х60 сосна</option>
		<option value="дуб">40х60 дуб</option>
	</select>
</td></tr> 

<tr id="banisterMaterial_tr"><td>Материал стоек:</td> <td> 
	<select id="banisterMaterial" size="1" onchange="">
		<option value="40х40 черн.">40х40 черн.</option>
		<option value="40х40 нерж.">40х40 нерж.</option>
		<option value="40х40 нерж+дуб">40х40 нерж+дуб</option>
	</select>
</td></tr>

<tr id="rackBottom_tr" style="display: none"><td>Крепление стоек лестницы:</td> <td> 
	<select id="rackBottom" size="1" onchange="">
		<option value="боковое">боковое</option>
		<option value="сверху с крышкой">сверху с крышкой</option>
		<option value="сверху без крышки">сверху без крышки</option>
	</select>
</td></tr>

<!--параметры ограждения с круглыми стойками Ф25 -->
<tr id="bal_tr_1"><td>Стойки:</td> <td> 
	<select id="balMaterial" size="1">
		<option value="крашеные">Ф25 крашеные</option>
		<option value="хром">Ф25 хром</option>
	</select>
</td></tr>



<!--параметры ограждения с ригелями -->
<tr id="rigel_tr_1"><td>Материал ригелей:</td> <td> 
	<select id="rigelMaterial" size="1" onchange="">
		<option value="20х20 черн.">20х20 черн.</option>
		<option value="Ф12 нерж.">Ф12 нерж.</option>
		<option value="Ф16 нерж.">Ф16 нерж.</option>
	</select>
</td></tr>

<tr id="rigel_tr_2"><td>Кол-во ригелей:</td> <td>
	<select id="rigelAmt" size="1" onchange="">
		<option value="1">1</option>
		<option value="2" selected >2</option>
		<option value="3">3</option>	
		<option value="4">4</option>
		<option value="5">5</option>
		<option value="6">6</option>
	</select>
</td></tr>

<!-- параметры ограждений с самонесущим стеклом -->
<tr id="glass_tr_1"><td>Крепление поручня на стекло:</td> <td> 
	<select id="glassHandrail" size="1" onchange="">
		<option value="сверху">сверху</option>
		<option value="сбоку">сбоку</option>
		<option value="нет">нет</option>
	</select>
</td></tr>

<!-- параметры кованых ограждений -->

<tr id="kovka_tr_1"><td>Столбы:</td> <td> 
	<select id="rackTypeKovka" size="1" onchange="">
		<option value="40х40">Гладкий 40х40</option>
		<option style="display:none;" value="stolb_1">Корзинка</option>
		<option style="display:none;" value="stolb_2">Поковка</option>
		<option style="display:none;" value="stolb_3">Кручение</option>
	</select>
</td></tr>

<tr id="kovka_tr_2"><td>Модель балясины 1:</td> <td> 
	<select id="banister1" size="1" onchange="">
		<option value="bal_1">1 корзинка</option>
		<option value="bal_2">2 корзинки</option>
		<option value="bal_3">1 поковка</option>
		<option value="bal_4">2 поковки</option>		
		<option value="bal_5">Завиток</option>
		<option value="bal_6">2 бублика</option>
		<option value="bal_7">4 бублика</option>
		<option value="bal_8">6 бубликов</option>
		<option value="bal_9">Завиток с листьями</option>
		<option value="bal_10">1 кручение</option>
		<option value="bal_11">2 кручения</option>
		<option value="bal_12">S-образная №1</option>
		<option value="bal_13">S-образная №2</option>
	</select>
</td></tr>

<tr id="kovka_tr_3"><td>Модель балясины 2:</td> <td> 
	<select id="banister2" size="1" onchange="">
		<option value="bal_1">1 корзинка</option>
		<option value="bal_2">2 корзинки</option>
		<option value="bal_3">1 поковка</option>
		<option value="bal_4">2 поковки</option>		
		<option value="bal_5">Завиток</option>
		<option value="bal_6">2 бублика</option>
		<option value="bal_7">4 бублика</option>
		<option value="bal_8">6 бубликов</option>
		<option value="bal_9">Завиток с листьями</option>
		<option value="bal_10">1 кручение</option>
		<option value="bal_11">2 кручения</option>
		<option value="bal_12">S-образная №1</option>
		<option value="bal_13">S-образная №2</option>
	</select>
</td></tr>

<tr id="kovka_tr_4">
	<td>Примерный шаг балясин:</td> 
	<td><input id="balDist" type="number" value="100"></td>
</tr>

<!--Ограждения с деревянными балясинами -->
<tr id="timberBal_tr_1"><td>Балясин на ступень:</td> <td> 
	<select id="timberBalStep" size="1" onchange="">
		<option value="1">1</option>
		<option value="1.5">3/2</option>
		<option value="2">2</option>
	</select>
</td></tr>
<tr id="timberBal_tr_5"><td>Верхнее окончание:</td> <td> 
	<select id="timberBalTopEnd" size="1" onchange="">
		<option value="круг">круглое</option>
		<option value="квадрат">квадратное</option>
	</select>
</td></tr>
<tr id="timberBal_tr_6"><td>Нижнее окончание:</td> <td> 
	<select id="timberBalBotEnd" size="1" onchange="">
		<option value="круг">круглое</option>
		<option value="квадрат">квадратное</option>
	</select>
</td></tr>

<tr id="timberBal_tr_7"><td>Размер балясин:</td> <td> 
	<select id="banisterSize" size="1" onchange="">
		<option value="40">40x40</option>
		<option value="50">50x50</option>
		<option value="60">60x60</option>
	</select>
</td></tr>

<tr id="timberBal_tr_2"><td>№ балясины по каталогу:</td> <td> 
	<input id="timberBalModel" type="number" value="1">
</td></tr>

<tr id="timberBal_tr_3"><td>№ столбов по каталогу:</td> <td> 
	<input id="timberRackModel" type="number" value="1">
</td></tr>

<tr id="timberBal_tr_4"><td>Порода дерева:</td> <td> 
	<select id="railingTimber" size="1" onchange="">
		<option value="как на лестнице">как на лестнице</option>
		<option value="сосна">сосна</option>
		<option value="береза">береза</option>
		<option value="дуб">дуб</option>
	</select>
</td></tr>

<tr><td>Покраска металла:</td> <td> 
	<select id="metalPaint_perila" size="1" onchange="">
		<option value="как на лестнице">как на лестнице</option>
		<option value="нет">нет</option>
		<option value="грунт">грунт</option>
		<option value="порошок">порошок</option>
	</select>
</td></tr>



<tr class='railingMetalColor'>
	<td>Цвет покраски металла:</td> 
	<td> 
		<select id="railingMetalColorNumber" size="1" onchange="">
			<!-- варианты цветов морилки -->
			<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/metalColors.php" ?>
		</select>
</td></tr>

<tr class='railingMetalColor'>
	<td>Комментарий к цвету металла:</td> 
	<td><textarea id="comments_04" rows="1" cols="30" class="comments">как на лестнице</textarea></td>
</tr>

<tr id="timberBal_tr_8">
	<td>Покраска дерева:</td> 
	<td>
		<select id="timberPaint_perila" size="1" onchange="">
			<option value="как на лестнице">как на лестнице</option>
			<option value="нет">нет</option>
			<option value="лак">лак</option>
			<option value="морилка+лак">морилка+лак</option>		
		</select>
	</td>
</tr>

<tr class='railingTimberColor'>
	<td>Морилка:</td> 
	<td> 
		<select id="railingTimberColorNumber" size="1" onchange="">
		<!-- варианты цветов морилки -->
			<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/timberColors.php" ?>
		</select>
</td></tr>

<tr class='railingTimberColor'>
	<td>Комментарий к цвету дерева</td> 
	<td><textarea id="comments_05" rows="1" cols="30" class="comments">как на лестнице</textarea></td>
</tr>


</tbody> </table>
<div id="topRailingInputTable"></div>
Комментарии к расчету:<br/>  <textarea id="comments_06" rows="1" cols="80" class="comments"></textarea>
<br/>

</form>

<!--Обработчик формы--> 
<script type="text/javascript" src="/calculator/module/forms/railing_form_change.js"></script>