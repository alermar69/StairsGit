
<h2 class="raschet">Балюстрада</h2>

<h4 class="raschet">Параметры секций</h4>
<div class='noPrint'>
	<input type='hidden' id="banisterSectionAmt" value="0"/></p>
	Позиция балюстрады X <input type="number" id="banisterPosX" value="0" step="50"/> </br>
	Позиция балюстрады Y <input type="number" id="banisterPosY" value="0" step="50"/> </br>
	Позиция балюстрады Z <input type="number" id="banisterPosZ" value="0" step="50"/> </br>
</div>

<table class="form_table" id="balSectTable" data-counter="banisterSectionAmt">
	<tbody>
		<tr>
			<th>Тип</th>
			<th>Направление</th>
			<th>Длина</th>
			<th>Стыковка</th>
			<th>Фланец</th>
			<th class='noPrint'></th>
		</tr> 
	</tbody>
</table>

<div class='noPrint'>
	<button id='addBanisterSect'>Добавить секцию</button>
	<button id='insertBanisterSect'>Вставить</button>
	<button id='redrawBanister'>Обновить</button>

</div>

<h4 class="raschet">Конструкция балюстрады</h4>
	
<!-- форма параметров конструкции балюстрады -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/banister/forms/banister_construct_form.php" ?>
