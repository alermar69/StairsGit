
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
						<option value="Дерево с ковкой">Дерево с ковкой</option>
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

			<tr class="railing_tr kovka_tr"><td>Модель балясины:</td> <td> 
				первая: 
				<select id="banister1" size="1" onchange="">
					<!-- варианты кованых балясин -->
					<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/forgedBals.php" ?>
				</select>
				<br/>
				вторая: 
				<select id="banister2" size="1" onchange="">
					<!-- варианты кованых балясин -->
					<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/forgedBals.php" ?>
				</select>
				<button class="showForgePrv noPrint">эскизы</button>
			</td></tr>
			<tr class="kovka_tr"><td>Чередование балясин:</td> <td> 
				<select id="forgeBalToggle" size="1" onchange="">
					<option value="1-1">1-1</option>
					<option value="2-1">2-1</option>
					<option value="1-2">1-2</option>
					<option value="2-2">2-2</option>
				</select>
			</td></tr>
			
			<tr class="kovka_tr railing_tr"><td>№ столбов по каталогу:</td> <td> 
				<input id="timberRackModel" type="text" value="01">
				<button class="showModal noPrint" data-modal="timberNewellsModal">эскизы</button>
			</td></tr>

			<tr class="kovka_tr railing_tr"><td>Навершия столбов:</td> <td> 
				<select id="newellTopType" size="1" onchange="">
					<option value="плоское">плоское</option>
					<option value="пирамидка">пирамидка</option>
					<option value="шар" >шар</option> 
					<option value="крышка">крышка плоская</option>
					<option value="крышка пирамидка">крышка пирамидка</option>
				</select>
			</td></tr>

		</tbody>
	</table>

	<div id='strightMarsRailinghWrapper' class='marshPar'>
			<h4>Ограждения прямых маршей.</h4>

			<table class="form_table" id="treadsTableWrapper">
				<tbody>
					<tr>
						<td>Тип ограждения:</td>
						<td>
							<select id="strightMarshRailing" size="1">
								<option value="Ригели">ригели</option>
								<option value="Стекло на стойках">Стекло на стойках</option>
								<option value="Дерево с ковкой">Дерево с ковкой</option>
								<option value="Частые стойки">Частые стойки</option>
							</select>
						</td>
					</tr>

					<tr class="marsh1"><td>Ограждения нижнего марша:</td> <td> 
						<select id="railingSide_1" size="1" onchange="">
								<option value="нет">нет</option>
								<option value="внешнее"  >внешнее</option>
								<option value="внутреннее">внутреннее</option>
								<option value="две">две стороны</option>			
							</select>
					</td></tr>

					<tr class="marsh3"><td>Ограждения верхнего марша:</td> <td> 
						<select id="railingSide_3" size="1" onchange="">
								<option value="нет">нет</option>
								<option value="внешнее">внешнее</option>
								<option value="внутреннее">внутреннее</option>
								<option value="две">две стороны</option>			
							</select>
					</td></tr>

					<tr class="railing_tr stright_kovka_tr"><td>Балясин на ступень прямого марша:</td> <td> 
						<select id="timberBalStep" size="1" onchange="">
							<option value="1">1</option>
							<option value="1.5" >3/2</option> 
							<option value="2">2</option>
						</select>
					</td></tr>
					<tr class="handrailParams_tr"><td>Модель поручня:</td> <td> 
						<select id="handrail" size="1" class='handrail'>	
							<option value="массив" selected >массив дерева</option>
							<option value="40х20 черн.">черн. 40х20</option>
							<option value="40х40 черн.">черн. 40х40</option>
							<option value="60х30 черн.">черн. 60х30</option>
							<option value="40х40 нерж.">нерж. 40х40</option>
							<option value="Ф50 нерж.">нерж. Ф50 </option>
							<option value="Ф50 нерж. с пазом">нерж. Ф50 с пазом</option>
							<option value="40х60 нерж. с пазом">нерж. 40х60 с пазом</option>
							<option value="ПВХ">ПВХ Ф50</option>
							
							<option value="сосна">сосна</option>
							<option value="береза">береза</option>
							<option value="лиственница">лиственница</option>
							<option value="дуб паркет.">дуб паркет.</option>
							<option value="дуб ц/л">дуб ц/л</option>
							<option value="нет">нет</option>

						</select>
					</td></tr>
				</tbody>
			</table>
		</div>
</div>