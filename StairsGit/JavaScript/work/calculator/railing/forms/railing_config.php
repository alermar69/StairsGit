<div id="perilaFormWrap">
	<h2 class="raschet">Характеристики ограждений</h2>
	<div id="perilaForm"  class="toggleDiv">

			<table class="form_table" ><tbody>


			<!-- варианты поручней -->
			<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/handrailParams.php" ?>

			<tr class="railing_tr" id="banisterMaterial_tr"><td>Материал стоек:</td> <td> 
				<select id="banisterMaterial" size="1" onchange="">
					<option value="40х40 черн.">40х40 черн.</option>
					<option value="40х40 нерж.">40х40 нерж.</option>
					<option value="40х40 нерж+дуб">40х40 нерж+массив</option>
				</select>
			</td></tr>

			<tr class="railing_tr" id="rackBottom_tr"><td>Крепление стоек:</td> <td> 
				<select id="rackBottom" size="1" onchange="">
					<option value="боковое">боковое</option>
					<option value="сверху с крышкой">сверху</option>
				</select>
			</td></tr>


			<!--параметры ограждения с ригелями -->
			<tr class="railing_tr rigel_tr"><td>Материал ригелей:</td> <td> 
				<select id="rigelMaterial" size="1" onchange="">
					<option value="20х20 черн.">20х20 черн.</option>
					<option value="Ф12 нерж.">Ф12 нерж.</option>
					<option value="Ф16 нерж." style="display: none">Ф16 нерж.</option>
				</select>
			</td></tr>

			<tr class="railing_tr rigel_tr"><td>Кол-во ригелей:</td> <td>
				<select id="rigelAmt" size="1" onchange="">
					<option value="1">1</option>
					<option value="2" selected >2</option>
					<option value="3">3</option>	
					<option value="4">4</option>
					<option value="5">5</option>
					<option value="6">6</option>
				</select>
			</td></tr>

			<tr class="railing_tr glass_tr"><td>Тип стекла:</td> <td> 
				<select id="glassType" size="1" onchange="">
					<option value="прозрачное">прозрачное</option>
					<option value="оптивайт">оптивайт</option>
					<option value="тонированное">тонированное в массе</option>
					<option value="матовое">матовое</option>
					<option value="с пленкой">с пленкой</option>
					<option value="триплекс">триплекс прозрачный</option>
					<option value="триплекс цветной">триплекс цветной</option>
				</select>
			</td></tr>

			<tr class="railing_tr glass_tr"><td>Пескоструйный узор:</td> <td> 
				<select id="isOrnament" size="1" onchange="">
					<option value="нет">нет</option>
					<option value="да">да</option>		
				</select>
			</td></tr>

			<tr class="railing_tr glass_tr"><td>Полировка кромок:</td> <td> 
				<select id="glassBevels" size="1" onchange="">
					<option value="стандартная">стандартная</option>
					<option value="после склейки">после склейки</option>		
				</select>
			</td></tr>


			<tr class="railing_tr"><td>Крепление поручня:</td> <td> 
				<select id="handrailFixType" size="1">
					<option value="кронштейны">кронштейны</option>
					<option value="паз">паз</option>
				</select>
			</td></tr>

			<tr class="railing_tr glass_tr"><td>Вертикальный участок:</td> <td> 
				<select id="startVertHandrail" size="1">
					<option value="нет">нет</option>
					<option value="есть">есть</option>
					
				</select>
			</td></tr>

			<!-- параметры кованых ограждений -->

			<tr class="railing_tr kovka_tr"><td>Столбы:</td> <td> 
				<select id="rackTypeKovka" size="1" onchange="">
					<option value="40х40">Гладкий 40х40</option>
					<option style="display:none;" value="stolb_1">Корзинка</option>
					<option style="display:none;" value="stolb_2">Поковка</option>
					<option style="display:none;" value="stolb_3">Кручение</option>
				</select>
			</td></tr>

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
			
			


			<tr class="railing_tr kovka_tr">
				<td>Примерный шаг балясин:</td> 
				<td><input id="balDist" type="number" value="100"></td>
			</tr>

			<!--Ограждения с деревянными балясинами -->
			<tr class="railing_tr timberRailing_tr"><td>Кол-во балясин на ступень:</td> <td> 
				<select id="timberBalStep" size="1" onchange="">
					<option value="1">1</option>
					<option value="1.5">3/2</option>
					<option value="2">2</option>
				</select>
			</td></tr>

			<tr class="timberRailing_tr railing_tr"><td>Верхнее окончание:</td> <td> 
				<select id="timberBalTopEnd" size="1" onchange="">
					<option value="круг">круглое</option>
					<option value="квадрат">квадратное</option>
				</select>
			</td></tr>
			<tr class="timberRailing_tr railing_tr"><td>Нижнее окончание:</td> <td> 
				<select id="timberBalBotEn" size="1" onchange="">
					<option value="круг" selected >круглое</option>
					<option value="квадрат"  >квадратное</option>
				</select>
			</td></tr>

			<tr class="timberRailing_tr railing_tr"><td>Размер балясин:</td> <td> 
				<select id="banisterSize" size="1" onchange="">
					<option value="40">40x40</option>
					<option value="50">50x50</option>
					<option value="60">60x60</option>
				</select>
			</td></tr>

			<tr class="timberRailing_tr railing_tr"><td>№ балясины по каталогу:</td> <td> 
				<input id="timberBalModel" type="number" value="1">
			</td></tr>

			<tr class="timberRailing_tr railing_tr"><td>№ столбов по каталогу:</td> <td> 
				<input id="timberRackModel" type="number" value="1">
			</td></tr>

			<tr class="timberRailing_tr railing_tr"><td>Порода дерева:</td> <td> 
				<select id="railingTimber" size="1" onchange="">
					<option value="как на лестнице">как на лестнице</option>
					<option value="сосна">сосна</option>
					<option value="береза">береза</option>
					<option value="дуб">дуб</option>
				</select>
			</td></tr>

			</tbody> </table>


			<div id="rutelGlassParams">

			<h4>Технологические параметры</h4>
			<table class="form_table" ><tbody>
				<tr>
					<td>Диаметр отверстий под рутели в стекле:</td>
					<td><input type="number" id="rutelHoleDiam" value="18"/></td>
				</tr>
				
				<tr>
					<td>Отступ рутеля от угла ступени по горизонтали:</td>
					<td><input type="number" id="rutelOffset_x" value="70"/></td>
				</tr>
				
				<tr>
					<td>Отступ рутеля от угла ступени по вертикали:</td>
					<td><input type="number" id="rutelOffset_y" value="50"/></td>
				</tr>
				
				<tr>
					<td>Расстояние между рутелями по вертикали:</td>
					<td><input type="number" id="rutelDist" value="120"/></td>
				</tr>
				
				<tr>
					<td>Расстояние от нижнего рутеля до кромки стекла:</td>
					<td><input type="number" id="botSideGlassOffset" value="50"/></td>
				</tr>
				
				<tr>
					<td>Максимальная длина стекла по горизонтали:</td>
					<td><input type="number" id="maxLen" value="1000"/></td>
				</tr>
				
				<tr>
					<td>Зазор между стеклами:</td>
					<td><input type="number" id="glassDist" value="10"/></td>
				</tr>
				
				<tr>
					<td>Зазор от стекла до торца марша:</td>
					<td><input type="number" id="glassSideOffset" value="20"/></td>
				</tr>
				
				<tr>
					<td>Толщина стекла:</td>
					<td><input type="number" id="glassThk" value="12"/></td>
				</tr>
				
				

			</tbody> </table>

			</div>
			<div id="topRailingInputTable"></div>
<!--
			Комментарии к расчету:<br/>  <textarea id="comments_06" rows="1" cols="80" class="comments"></textarea>
			<br/>
-->

	</div>
</div>