
<div id='railingFormWrapper'>
	<h4>Параметры ограждений лестницы.</h4>

	<table class="form_table" id="midHoldersTable">
		<tbody>

			<tr>
				<td>Ограждение лестницы:</td>
				<td>
					<select id="railingSide" size="1">
						<option value="внешнее">внешнее</option>
						<option value="внутреннее">внутреннее</option>
						<option value="две">две стороны</option>
						<option value="нет">нет</option>
					</select>
				</td>
			</tr>

			<tr class='railingParams'>
				<td>Модель ограждения:</td>
				<td>
					<select id="railingModel" size="1">
						<option value="Частые стойки">Частые стойки</option>
						<option value="Ригели">Ригели</option>
						<option value="Стекло на стойках">Стекло на стойках</option>
						<option value="Самонесущее стекло">Самонесущее стекло</option>
					</select>
				</td>
			</tr>

			<tr id="handrailMaterial_tr" class='railingParams'>
				<td>Материал поручня:</td>
				<td><select name="handrailMaterial" size="1" id="handrailMaterial" onchange="">
						<option value="ПВХ">ПВХ Ф50</option>
						<option value="Дуб">Дуб 40х60</option>
					</select>
				</td>
			</tr>

			<tr class='railingParams'>
				<td>Цвет поручня ПВХ:</td>
				<td>
					<select size="1" id="handrailColor" onchange="">
						<!-- варианты цветов поручня пвх -->
						<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/pvcColors.php" ?>
					</select>
				</td>
			</tr>

			<tr class='railingParams'>
				<td>Материал стоек:</td>
				<td><select name="rackType" size="1" id="rackType">
						<option value="черная сталь">Конструкционная сталь</option>
						<option value="нержавейка">Полированная нержавейка</option>
						<option value="нержавейка+дуб">Нержавейка+дуб</option>
					</select>
				</td>
			</tr>

			<!--параметры ограждения с ригелями -->
			<tr class="railingParams rigelParams">
				<td>Материал ригелей:</td>
				<td>
					<select id="rigelMaterial" size="1" onchange="">
						<option value="Ф12 нерж.">Ф12 нерж.</option>
						<option value="Ф16 нерж.">Ф16 нерж.</option>
					</select>
				</td>
			</tr>

			<tr class="railingParams rigelParams">
				<td>Кол-во ригелей:</td>
				<td>
					<select id="rigelAmt" size="1" onchange="">
						<option value="1">1</option>
						<option value="2" selected>2</option>
						<option value="3">3</option>
						<option value="4">4</option>
						<option value="5">5</option>
						<option value="6">6</option>
					</select>
				</td>
			</tr>

			<!-- параметры ограждений с самонесущим стеклом -->
			<tr class="railingParams glassParams">
				<td>Крепление поручня на стекло:</td>
				<td>
					<select id="glassHandrail" size="1" onchange="changeFormRailing()">
						<option value="сверху">сверху</option>
						<option value="сбоку">сбоку</option>
						<option style="display:none;" value="нет">нет</option>
					</select>
				</td>
			</tr>

			<!-- параметры ограждений с частыми стойками -->
			<tr class="railingParams balParams">
				<td>Балясин на ступень</td>
				<td><input name="banisterPerStep" type="number" id="banisterPerStep" value="2" /></td>
			</tr>

			<tr>
				<td>Замыкание поручня лестницы и балюстрады:</td>
				<td>
					<select size="1" id="pltHandrailConnection">
						<option value="нет">нет</option>
						<option value="есть">есть</option>
					</select>
				</td>
			</tr>
			
			<tr>
				<td>Удлиннение поручня площадки:</td> 
				<td><input id="topHandrailExtraLength" type="number" value="0" step="10"></td>
			</tr>
				
		</tbody>
	</table>
</div>