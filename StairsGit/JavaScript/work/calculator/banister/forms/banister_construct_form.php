<div id="banisterСonstructFormWrap">
	<h2 class="raschet">Конструкция балюстрады</h2>
	<div id="banisterСonstructForm"  class="toggleDiv">
		<table class="form_table" ><tbody>

			<tr><td>Модель ограждения:</td> <td> 
				<select id="railingModel_bal" size="1" onchange="changeFormBanisterConstruct()">
					<option value="Ригели">Ригели</option>
					<option value="Стекло на стойках">Стекло на стойках</option>
					<option value="Самонесущее стекло">Самонесущее стекло</option>
					<option value="Кованые балясины">Кованые балясины</option>
					<option value="Деревянные балясины" >Деревянные балясины</option>
					<option value="Стекло">Модерн</option>
					<option value="Дерево с ковкой">Дерево с ковкой</option>
					<option value="Частые стойки" style="display: none;">Частые стойки</option>
					<option value="Решетка">Решетка из профиля</option>
					<option value="Экраны лазер">Экраны лазер</option>
					
					<option value="нет">нет</option> 
				</select>
			</td></tr>

			<!--общие параметры ограждений -->

			<tr><td>Модель поручня:</td> <td> 
				<select id="handrail_bal" size="1" class='handrail'>	
					<option value="массив" selected>массив дерева</option>
					<option value="40х20 черн.">черн. 40х20</option>
					<option value="40х40 черн.">черн. 40х40</option>
					<option value="60х30 черн.">черн. 60х30</option>
					<option value="40х40 нерж.">черн. 40х40</option>
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
					

					<option value="кованый полукруглый" class="oldOption">кованый полукруглый</option>		
					<option value="Ф50 сосна" class="oldOption">Ф50 сосна</option>
					<option value="омега-образный сосна" class="oldOption">омега-образный сосна</option>
					<option value="50х50 сосна" class="oldOption">40х60 сосна</option>
					<option value="40х60 береза" class="oldOption">40х60 береза</option>
					<option value="омега-образный дуб" class="oldOption">омега-образный дуб</option>
					<option value="40х60 дуб" class="oldOption">40х60 дуб</option>		
					<option value="40х60 дуб с пазом" class="oldOption">40х60 дуб с пазом</option>
				</select>
			</td></tr>

			<tr><td>Профиль поручня:</td> <td> 
				<select id="handrailProf_bal" size="1" class='handrailParams_bal handrailProf'>			
					<option value="40х60 верт.">40х60 верт.</option>
					<option value="40х80 верт.">40х80 верт.</option>
					<option value="40х100 верт.">40х100 верт.</option>	
					<option value="40х60 гор.">40х60 гор.</option>
					<option value="40х70 гор.">40х70 гор.</option>	
				</select>
			</td></tr>

			<tr><td>Проточки по бокам:</td> <td> 
				<select id="handrailSlots_bal" size="1" class='handrailParams_bal handrailSlots'>	
					<option value="нет">нет</option>
					<option value="да">да</option>
				</select>
			</td></tr>

			<tr><td>Стыки поручня на поворотах:</td> <td> 
				<select id="handrailConnectionType_bal" size="1" class='handrailParams_bal'>	
					<option value="прямые">прямые с зазором</option>
					<option value="без зазора">без зазора стандартные</option>
					<option value="без зазора премиум">без зазора премиум</option>
					<option value="шарнир">шарнир</option>
				</select>
			</td></tr>

			<tr id="banisterMaterial_bal_tr"><td>Материал стоек:</td> <td> 
				<select id="banisterMaterial_bal" size="1" onchange="">
					<option value="40х40 черн.">40х40 черн.</option>
					<option value="40х40 нерж.">40х40 нерж.</option>
					<option value="40х40 нерж+дуб">40х40 нерж+массив</option>
				</select>
			</td></tr>

			<tr id="rackBottom_bal_tr"><td>Крепление стоек:</td> <td> 
				<select id="rackBottom_bal" size="1" onchange="">
					<option value="сверху с крышкой" >сверху</option>
					<option value="боковое">боковое</option>		
				</select>
			</td></tr>

			<!--параметры ограждения с ригелями -->
			<tr id="rigel_bal_tr_1"><td>Материал ригелей:</td> <td> 
				<select id="rigelMaterial_bal" size="1" onchange="">
					<option value="20х20 черн.">20х20 черн.</option>
					<option value="Ф12 нерж.">Ф12 нерж.</option>
					<option value="Ф16 нерж.">Ф16 нерж.</option>
				</select>
			</td></tr>

			<tr id="rigel_bal_tr_2"><td>Кол-во ригелей:</td> <td>
				<select id="rigelAmt_bal" size="1" onchange="">
					<option value="1">1</option>
					<option value="2" selected >2</option>
					<option value="3">3</option>	
					<option value="4">4</option>
					<option value="5">5</option>
					<option value="6">6</option>
				</select>
			</td></tr>

			<tr class="glassRailing_bal"><td>Крепление стекла балюстрады:</td> <td> 
				<select id="glassFix_bal" size="1" onchange="">
					<option value="профиль">профиль</option>
					<option value="рутели">рутели</option>
				</select>
			</td></tr>

			<tr><td>Крепление поручня:</td> <td> 
				<select id="handrailFixType_bal" class='handrailParams_bal'>
					<option value="кронштейны">кронштейны</option>
					<option value="паз">паз</option>
					<option value="нет">нет</option>
				</select>
			</td></tr>
			
			<tr><td>Вертикальный поручень:</td> <td> 
				<select id="handrailVert_bal" size="1" onchange="">
					<option value="нет">нет</option>
					<option value="начало">начало</option>		
					<option value="все секции">все секции</option>		
				</select>
			</td></tr>

			<!--параметры стекла-->
			<tr class="glass_bal"><td>Тип стекла:</td> <td> 
				<select id="glassType_bal" size="1" onchange="">
					<option value="прозрачное">прозрачное</option>
					<option value="оптивайт">оптивайт</option>
					<option value="тонированное">тонированное в массе</option>
					<option value="матовое">матовое</option>
					<option value="с пленкой">с пленкой</option>
					<option value="триплекс">триплекс прозрачный</option>
					<option value="триплекс цветной">триплекс цветной</option>
				</select>
			</td></tr>

			<tr class="glass_bal"><td>Пескоструйный узор:</td> <td> 
				<select id="isOrnament_bal" size="1" onchange="">
					<option value="нет">нет</option>
					<option value="да">да</option>		
				</select>
			</td></tr>

			<tr class="glass_bal"><td>Полировка кромок:</td> <td> 
				<select id="glassBevels_bal" size="1" onchange="">
					<option value="стандартная">стандартная</option>
					<option value="после склейки">после склейки</option>		
				</select>
			</td></tr>


			<!-- параметры кованых ограждений -->

			<tr class="kovka_bal_tr"><td>Столбы:</td> <td> 
				<select id="rackTypeKovka_bal" size="1" onchange="">
					<option value="40х40">Гладкий 40х40</option>
					<option style="display:none;" value="stolb_1">Корзинка</option>
					<option style="display:none;" value="stolb_2">Поковка</option>
					<option style="display:none;" value="stolb_3">Кручение</option>
				</select>
			</td></tr>

			
			<tr class="kovka_bal_tr timber_kovka_bal_tr"><td>Модель балясины:</td> <td> 
				первая: 
				<select id="banister1_bal" size="1" onchange="">
					<!-- варианты кованых балясин -->
					<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/forgedBals.php" ?>
				</select>
				<br/>
				вторая: 
				<select id="banister2_bal" size="1" onchange="">
					<!-- варианты кованых балясин -->
					<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/forgedBals.php" ?>
				</select>
				<button class="showModal noPrint" data-modal="forgeModal" data-unit="balustrade">эскизы</button>
			</td></tr>
			
			<tr class="kovka_bal_tr timber_kovka_bal_tr"><td>Чередование балясин:</td> <td> 
				<select id="forgeBalToggle_bal" size="1" onchange="">
					<option value="1-1">1-1</option>
					<option value="2-1">2-1</option>
					<option value="1-2">1-2</option>
					<option value="2-2">2-2</option>
				</select>
			</td></tr>
			 
			<tr class="kovka_bal_tr">
				<td>Примерный шаг балясин:</td> 
				<td><input id="balDist_bal" type="number" value="200"></td>
			</tr>

			<!--параметры ограждения с круглыми стойками Ф25 -->
			<tr id="balMaterial_bal_tr"><td>Стойки:</td> <td> 
				<select id="balMaterial_bal" size="1">
					<option value="крашеные">Ф25 крашеные</option>
					<option value="хром">Ф25 хром</option>
				</select>
			</td></tr>

			<!-- параметры ограждения с экранам лазер -->

			<tr><td>Узор:</td> <td> 
				<select id="laserModel_bal" size="1">
					<!-- варианты узоров -->
					<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/laserModels.php" ?>
				</select>
			</td></tr>



			<!--Ограждения с деревянными балясинами -->

			<tr class="timberRailing_bal_tr"><td>Начало балюстрады:</td> <td> 
				<select id="banisterStart" size="1" onchange="">
					<option value="столб">столб</option>
					<option value="правый угол">правый угол</option>
					<option value="левый угол">левый угол</option>
					<option value="нет">нет</option>
				</select>
			</td></tr>


			<tr style="display: none"><td>Балясины:</td> <td> 
				<select id="timberBalType_bal" size="1" onchange="">
					<option value="точеные">точеные</option>
					<option value="квадратные">квадратные</option>
				</select>
			</td></tr>

			<tr style="display: none"><td>Столбы:</td> <td> 
				<select id="timberNewellType_bal" size="1" onchange="">
					<option value="точеные">точеные</option>
					<option value="квадратные">квадратные</option>
				</select>
			</td></tr>


			<tr style="display: none"><td>Верхнее окончание:</td> <td> 
				<select id="timberBalTopEnd_bal" size="1" onchange="">
					<option value="круг">круглое</option>
					<option value="квадрат">квадратное</option>
				</select>
			</td></tr>
			<tr style="display: none"><td>Нижнее окончание:</td> <td> 
				<select id="timberBalBotEnd_bal" size="1" onchange="">
					<option value="круг" selected >круглое</option>
					<option value="квадрат"  >квадратное</option>
				</select>
			</td></tr>

			<tr class="timber_bal_tr"><td>Размер балясин:</td> <td> 
				<select id="banisterSize_bal" size="1" onchange="">
					<option value="40">40x40</option>
					<option value="50">50x50</option>
					<option value="60">60x60</option>
				</select>
			</td></tr>

			<tr class="timber_bal_tr"><td>№ балясин по каталогу:</td> <td> 
				<input id="timberBalModel_bal" type="text" value="10">
				<button class="showModal noPrint" data-modal="timberBalsModal" data-unit="balustrade">эскизы</button>
			</td></tr>

			<tr class="timber_bal_tr timber_kovka_bal_tr timber_glass_bal_tr"><td>№ столбов по каталогу:</td> <td> 
				<input id="timberRackModel_bal" type="text" value="01">
				<button class="showModal noPrint" data-modal="timberNewellsModal" data-unit="balustrade">эскизы</button>
			</td></tr>
			
			<tr class="timber_bal_tr timber_kovka_bal_tr timber_glass_bal_tr"><td>Навершия столбов:</td> <td> 
				<select id="newellTopType_bal" size="1" onchange="">
					<option value="плоское">плоское</option>
					<option value="пирамидка">пирамидка</option>
					<option value="шар" >шар</option> 
					<option value="крышка">крышка плоская</option>
					<option value="крышка пирамидка">крышка пирамидка</option>
				</select>
			</td></tr>

		<tr>
			<td>Стойки балюстрады:</td> 
			<td>
				<select id="rackLenType_bal" size="1" onchange="">
					<option value="стандартные">стандартные</option>
					<option value="нестандартные">нестандартные</option>
				</select>
			</td>
		</tr>
			
		<tr>
			<td>Высота по поручню:</td> 
			<td><input id="handrailHeight_bal" type="number" value="960"></td>
		</tr>
		
		</tbody> </table>
		<div id="topRailingInputTable"></div>
		
		<!--
		Комментарии к расчету:<br/>  <textarea id="comments_06_bal" rows="1" cols="80" class="comments"></textarea>
		<br/>

		<div class="priceDiv">
			<div id="price_banister" class="toggleDiv">
				<h3 class="raschet">Стоимость балюстрады:</h3>
				<p>Расчет еще не произведен.</p>
			</div>
		</div>
		-->
	</div>
</div>