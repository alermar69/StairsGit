<div id="perilaFormWrap">
	<h2 class="raschet">Характеристики ограждений</h2>
	<div id="perilaForm" class="toggleDiv">			
		<table class="form_table" ><tbody>

			<tr class="marsh1"><td>Ограждения нижнего марша:</td> <td> 
				<select id="railingSide_1" size="1" onchange="">
						<option value="нет">нет</option>
						<option value="внешнее"  >внешнее</option>
						<option value="внутреннее">внутреннее</option>
						<option value="две">две стороны</option>			
					</select>
			</td></tr>

			<tr class="marsh2" style="display:none"><td>Ограждения нижнего марша:</td> <td> 
				<select id="railingSide_2" size="1" onchange="">
						<option value="нет">нет</option>
						<option value="внешнее">внешнее</option>
						<option value="внутреннее" >внутреннее</option>
						<option value="две">две стороны</option>			
					</select>
			</td></tr>


			<tr class="marsh3"><td>Ограждения верхнего марша:</td> <td> 
				<select id="railingSide_3" size="1" onchange="">
						<option value="нет">нет</option>
						<option value="внешнее">внешнее</option>
						<option value="внутреннее">внутреннее</option>
						<option value="две"  >две стороны</option>			
					</select>
			</td></tr>

			<tr class="marsh1"><td>Пристенный поручень нижнего марша:</td> <td> 
				<select id="handrailSide_1" size="1" onchange="">
						<option value="нет">нет</option>
						<option value="внешнее">внешняя сторона</option>
						<option value="внутреннее">внутренняя сторона</option>
						<option value="две">две стороны</option>			
					</select>
			</td></tr>

			<tr class="marsh3"><td>Пристенный поручень верхнего марша:</td> <td> 
				<select id="handrailSide_3" size="1" onchange="">
						<option value="нет">нет</option>
						<option value="внешнее"  >внешняя сторона</option>
						<option value="внутреннее">внутренняя сторона</option>
						<option value="две">две стороны</option>			
					</select>
			</td></tr>


			<tr id="topPltRailing_tr">
				<td><img id="railingPltImg" src="/calculator/images/vhod/railingPlt_1.png"></td> 
				<td>Ограждение верхней площадки:<br/>
				<ul style="list-style: none;">
					<li>3<input id="topPltRailing_3" type="checkbox"></li>
					<li>4<input id="topPltRailing_4" type="checkbox"></li>
					<li>5<input id="topPltRailing_5" type="checkbox"></li>
					<li>6<input id="topPltRailing_6" type="checkbox"></li>
				</ul>
			</td></tr>



			<tr class="railing_tr"><td>Модель ограждения:</td> <td> 
				<select id="railingModel" size="1">
					<option value="Ригели">Ригели</option>
					<option value="Стекло на стойках" class="custom">Стекло на стойках</option>
					<option value="Самонесущее стекло" class="custom">Самонесущее стекло</option>
					<option value="Кованые балясины" class="custom">Кованые балясины</option>
					<option value="Экраны лазер">Экраны лазер</option>
				</select>
			</td></tr>

		<!-- варианты поручней -->
		<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/handrailParams.php" ?>

		<tr class="railing_tr"><td>Начало ограждения:</td> <td> 
			<select id="railingStart" size="1" onchange="">
				<option value="0">первая ступень</option>
				<option value="1">вторая ступень</option>
				<option value="2">третья ступень</option>
				<option value="3">четвертая ступень</option>
			</select>
		</td></tr>

		<tr class="handrailParams_tr">
			<td>Удлиннение верхнего поручня:</td> 
			<td><input id="topHandrailExtraLength" type="number" value="0" step="10"></td>
		</tr> 

		<tr class="railing_tr" id="banisterMaterial_tr"><td>Материал стоек:</td> <td> 
			<select id="banisterMaterial" size="1" onchange="">
				<option value="40х40 черн.">40х40 черн.</option>
				<option value="40х40 нерж.">40х40 нерж.</option>
				<option value="40х40 нерж+дуб">40х40 нерж+дуб</option>
			</select>
		</td></tr>

		<tr class="railing_tr" id="rackBottom_tr"><td>Крепление стоек лестницы:</td> <td> 
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

		<!-- параметры ограждений со стеклом -->
		<tr style = "display: none;"><td>Крепление поручня:</td> <td> 
			<select id="glassHandrail" size="1">
				<option value="сверху">сверху</option>
				<option value="сбоку">сбоку</option>
			</select>
		</td></tr>

		<tr class="railing_tr glass_tr"><td>Тип стекла:</td> <td> 
			<select id="glassType" size="1" onchange="">
				<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/glass.php" ?>				
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
					<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/forgedBals.php" ?>
				</select>
				<br/>
				вторая: 
				<select id="banister2" size="1" onchange="">
					<!-- варианты кованых балясин -->
					<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/forgedBals.php" ?>
				</select>
				<button class="showModal noPrint" data-modal="forgeModal">эскизы</button>
			</td></tr>

		<tr class="railing_tr kovka_tr timber_kovka_tr"><td>Чередование балясин:</td> <td> 
			<select id="forgeBalToggle" size="1" onchange="">
				<option value="1-1">1-1</option>
				<option value="2-1">2-1</option>
				<option value="1-2">1-2</option>
				<option value="2-2">2-2</option>
			</select>
		</td></tr>
		
		<tr class="railing_tr kovka_tr">
			<td>Примерный шаг балясин:</td> 
			<td><input id="balDist" type="number" value="200"></td>
		</tr>


		<!-- параметры ограждения с экранам лазер -->

		<tr class="railing_tr"><td>Узор:</td> <td> 
			<select id="laserModel" size="1">
				<!-- варианты узоров -->
				<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/laserModels.php" ?>
			</select>
		</td></tr>



	<!-- параметры деревянных ограждений -->
	<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/timber/forms/timberRailing.php" ?>
	

		</tbody> </table>
		<div id="topRailingInputTable"></div>
<!--
		Комментарии к расчету:<br/>  <textarea id="comments_06" rows="1" cols="80" class="comments"></textarea>
		<br/>

		<div class="priceDiv">
			<div id="resultPerila" >
				<h3 class="raschet">Стоимость ограждений:</h3>
				<p>Расчет еще не произведен.</p>
			</div>
		</div>
		
		<div id="marshRailingImages2D">
			<canvas id='section_1'>Откройте страницу в Google Chrome</canvas>
		</div>
-->
	</div>
</div>

<!--Обработчик формы--> 
<script type="text/javascript" src="/calculator/metal/forms/railing_form_change.js"></script>