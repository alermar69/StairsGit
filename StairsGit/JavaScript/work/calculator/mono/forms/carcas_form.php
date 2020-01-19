<div id="carcasFormWrap">
	<h2 class="raschet">Характеристики лестницы</h2>
	<div id="carcasForm" class="toggleDiv">

			<h4>1. Общие характеристики:</h4>

			<table class="form_table" ><tbody>

			<tr id="model_tr"><td>Каркас:</td> <td>
				<select id="model" size="1" onchange="">
					<option value="сварной" >сварной короб</option>
					<option value="труба" >проф. труба</option>
				</select>
			</td></tr>

			<tr><td>Геометрия лестницы:</td> <td> 
				<select id="stairModel" size="1" onchange="changeAllForms()">
					<option value="Прямая">Прямая</option>
					<option value="Г-образная с площадкой">Г-образная с площадкой</option>
					<option value="Г-образная с забегом">Г-образная с забегом</option>
					<option value="П-образная с площадкой" >П-образная с площадкой</option>
					<option value="П-образная с забегом">П-образная с забегом</option>
					<option value="П-образная трехмаршевая">П-образная трехмаршевая</option>	
				</select>
			</td></tr>



			<tr class="pltP">
				<td>Глубина промежуточной площадки:</td> 
				<td><input id="platformLength_1" type="number" value="1000"></td>
			</tr>


			<tr id="middlePlatform_tr_3" style="display: none;">
				<td>Ширина промежуточной площадки:</td>
				<td><input id="platformWidth_1" type="number" value="2000"></td>
			</tr>


			<tr id="marshDist_tr"><td>Зазор между маршами в плане:</td> <td> 
				<input id="marshDist" type="number" value="40"> 
			</td></tr>

			<tr class="P3marsh"><td>Нижний поворот:</td> <td> 
				<select id="turnType_1" size="1" onchange="">
					<option value="забег">забег</option>
					<option value="площадка">площадка</option>
				</select>
			</td></tr>

			<tr class="P3marsh"><td>Верхний поворот:</td> <td> 
				<select id="turnType_2" size="1" onchange="">
					<option value="забег">забег</option>
					<option value="площадка">площадка</option>
				</select>
			</td></tr>

			<tr><td>Направление поворота:</td> <td> 
			<select id="turnSide" size="1" onchange="">
				<option value="правое" selected >правое</option>
				<option value="левое"   >левое</option>
			</select>
			</td></tr>

			<tr><td>Верхняя площадка:</td> <td>
				<select id="platformTop" size="1" onchange="changeAllForms()">
					<option value="нет">нет</option>
					<option value="площадка">есть</option>
				</select>
			</td></tr>

			<tr><td>Ширина последней забежной ступени:</td> 
				<td><input id="lastWinderTreadWidth" type="number" value="50"></td>
			</tr>

			<tr class="topPlt">
				<td>Задняя тетива площадки:</td> <td>
				<select id="platformRearStringer" size="1" onchange=""> 
					<option value="нет">нет</option>
					<option value="есть">есть</option>
				</select>
				</td>
			</tr>

			<tr class="topPlt">
				<td>Глубина верхней площадки:</td> 
				<td><input id="platformLength_3" type="number" value="1000"></td>
			</tr>

			<tr><td>Внешняя ширина маршей:</td> <td> 
				<input id="M" type="number" value="900">
			</td></tr>

			<tr style="display: none"><td>Подступенки:</td> <td> 
				<select id="riserType" size="1" onchange="">
					<option value="нет">нет</option>
					<option value="есть">есть</option>		
				</select>
			</td></tr>	

			<tr><td>Передний свес ступеней, мм:</td> <td> 
				<input id="nose" type="number" value="50">
			</td></tr>

			<tr id="platformTop_tr_14"><td>Верхнее крепление:</td> <td> 
				<select id="topAnglePosition" size="1" onchange="">
					<option value="под ступенью">под ступенью</option>
					<option value="над ступенью">над ступенью</option>		
				</select>
			</td></tr>

			<tr id="carcasConfig_tr">
				<td id="carcasConfig_img">
					<img src="/images/calculator/carcasTypes/turn90/001.jpg" width="250px">
				</td>
				<td>
					Тип каркаса: 
					<select id="carcasConfig" size="1" onchange="">
						<option value="001">Тип 1</option>
						<option value="002">Тип 2</option>
						<option value="003">Тип 3</option>
						<option value="004">Тип 4</option>
					</select>
					<br/>
					Колонны:
					<br/>
					<label><input type="checkbox" id="isColumn1">1<br/></label>
					<label><input type="checkbox" id="isColumn2">2<br/></label>
					<label><input type="checkbox" id="isColumn3">3<br/></label>
					<label><input type="checkbox" id="isColumn4">4<br/></label>

				</td>
			</tr>

			<tr id="stringerLedge1_tr">
				<td>Выступание косоура 1 за площадку, мм:</td>
				<td><input id="stringerLedge1" type="number" value="10"></td>
			</tr>

			<tr id="stringerLedge2_tr">
				<td>Выступание косоура 2 за площадку, мм:</td>
				<td><input id="stringerLedge2" type="number" value="10"></td>
			</tr>

			<tr id="stringerThickness_tr"><td>Толщина косоура:</td>
				<td><input id="stringerThickness" type="number" value="150"></td>
			</tr>
				
			</tbody> </table>

			<h4>2. Параметры ступеней:</h4>
			<table class="form_table">
			<tbody>
			<tr>
				<th style="width: 20%;">Марш</th>
				<th>Кол-во прямых ступеней</th>
				<th>Подъем ступени</th>
				<th>Проступь</th>
				<th>Ступень</th>
			</tr>

			<tr class="marsh1">
				<td style="width: 20%;">Нижний</td>
				<td><input id="stairAmt1" type="number" value="7"></td>
				<td><input id="h1" type="number" value="180"></td>
				<td><input id="b1" type="number" value="250"></td>
				<td><input id="a1" type="number" value="300"></td>
			</tr>

			<tr class="marsh2">
				<td>Средний</td>
				<td><input id="stairAmt2" type="number" value="5"></td>
				<td><input id="h2" type="number" value="180"></td>
				<td><input id="b2" type="number" value="250"></td>
				<td><input id="a2" type="number" value="300"></td>
			</tr>

			<tr class="marsh3">
				<td>Верхний</td>
				<td><input id="stairAmt3" type="number" value="5"></td>
				<td><input id="h3" type="number" value="200"></td>
				<td><input id="b3" type="number" value="200"></td>
				<td><input id="a3" type="number" value="250"></td>
			</tr>

			</tbody>
			</table>
			
		<!-- Пригласительные ступени -->
		<div id="startTreads">
			<h4>3. Пригласительные ступени</h4>
			<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/startTreads/forms/form.php" ?>
		</div>
		
		<div id="complect_inputs">
			<h4>4. Комплектация лестницы:</h4>

			<table class="form_table" ><tbody>

			<tr><td>Каркас:</td> <td> 
				<select id="isCarcas" size="1">
					<option value="есть">есть</option>
					<option value="нет">нет</option>
				</select>
			</td></tr>

			<tr><td>Ступени:</td> <td> 
				<select id="stairType" size="1" onchange="">
					<option value="массив">массив дерева</option>
					<option value="сосна кл.Б">сосна кл.Б</option>
					<option value="сосна экстра">сосна экстра</option>
					<option value="береза паркет.">береза паркет.</option>
					<option value="лиственница паркет.">лиственница паркет.</option>
					<option value="дуб паркет.">дуб паркет.</option>
					<option value="дуб ц/л">дуб ц/л</option>
					<option value="нет">нет</option>
				</select>
			</td></tr>

		<tr><td>Покраска металла (каркас):</td> <td> 
			<select id="metalPaint" size="1" >
				<!-- варианты покраски металла -->
				<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/metalPaint.php" ?>
			</select>
		</td></tr>
		
		<tr><td>Покраска металла (ограждения):</td> <td> 
			<select id="metalPaint_railing" size="1" >
				<!-- варианты покраски металла -->
				<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/metalPaint.php" ?>
			</select>
		</td></tr>
		
		<tr class="timberPaint"><td>Покраска дерева:</td> <td> 
			<select id="timberPaint" size="1" >
				<!-- варианты покраски дерева -->
				<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/timberPaint.php" ?>		
			</select>
		</td></tr>

		<tr class="timberPaint"><td>Поверхность дерева:</td> <td> 
			<select id="surfaceType" size="1" >
				<!-- варианты покраски дерева -->
				<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/surfaceTypes.php" ?>		
			</select>
		</td></tr>
		
		<tr class="timberPaint"><td>Шпаклевка:</td> <td> 
			<select id="fillerType" size="1" >
				<!-- варианты покраски дерева -->
				<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/fillerTypes.php" ?>		
			</select>
		</td></tr>

			<tr><td>Головки болтов каркаса:</td> <td> 
				<select id="boltHead" size="1" onchange="">
					<option value="countersunk">евро (потай)</option>
					<option value="hexagon">шестигранные</option>
				</select>
			</td></tr>

			<tr><td>Крашеные гловки болтов:</td> <td> 
				<select id="paintedBolts" size="1" onchange="">
					<option value="нет">нет</option>
					<option value="есть">есть</option>
				</select>
			</td></tr>
			
			<tr><td>Подсветка ступеней:</td> <td> 
				<select id="treadLigts" size="1">
					<option value="нет">нет</option>
					<option value="есть">есть</option>				
				</select>
			</td></tr>

			</tbody> </table>

		</div>
		
	<!-- цвета и материалы -->
	<div id="colors_inputs">
		<h4>5. Материалы и цвета:</h4>
		<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/colorsForm.php" ?>
	</div>	
		

		<div id="assembling_inputs">

			<h4>6. Крепление лестницы.</h4>


			<!-- параметры крепления лестницы к стенам-->
			<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/fixingParams.php" ?>

			<table class="form_table">
			<tbody>

			<tr><td>Позиция верхнего отверстия:</td>
				<td><input id="topHolePos" type="number" value="100"></td>
			</tr>

			<tr class="marsh1">
				<td>Средняя опора нижнего марша:</td> <td> 
				<select id="marshMiddleFix_1" size="1">
					<option value="колонна">колонна</option>
					<option value="подкос">подкос</option>
					<option value="нет">нет</option>
				</select>
			</td></tr>

			<tr class="marsh2">
				<td>Средняя опора среднего марша:</td> <td> 
				<select id="marshMiddleFix_2" size="1">
					<option value="колонна">колонна</option>
					<option value="подкос">подкос</option>
					<option value="нет">нет</option>
				</select>
			</td></tr>

			<tr class="marsh3">
				<td>Средняя опора верхнего марша:</td> <td> 
				<select id="marshMiddleFix_3" size="1">
					<option value="колонна">колонна</option>
					<option value="подкос">подкос</option>
					<option value="нет">нет</option>
				</select>
			</td></tr>


			<tr class="topPlt">
				<td>Опоры верхней площадки:</td> <td> 
				<select id="platformTopColumn" size="1" >
					<option value="нет">нет</option>
					<option value="колонны">колонны</option>
					<option value="подкосы">подкосы</option>
				</select>
			</td></tr>

			<tr>
				<td>Крепление подкосов верхней площадки:</td>
				<td> 
					<select id="topPltConsolePos" size="1" >
						<option value="справа">справа</option>
						<option value="слева">слева</option>
						<option value="сзади">сзади</option>
					</select>
				</td>
			</tr>

			<tr>
				<td>Тип установки лестницы</td> 
				<td> 
				<select id="botFloorType" size="1" onchange="">
					<option value="чистовой">на чистовой пол</option>
					<option value="черновой">на черновой пол</option>		
				</select>
				</td>
			</tr>

			<tr id="botFloorsDist_tr" style="display: none">
				<td>Разница высот чистового и чернового полов</td>
				<td><input id="botFloorsDist" type="number" value="25"></td>
			</tr>

			</tbody></table>

			</div>

		<div id="manufacturing_inputs">
			<h4>7. Технологические параметры:</h4>

			<table class="form_table" ><tbody>

			<tr>
				<td>Толщина ступеней:</td>
				<td><input id="treadThickness" type="number" value="40"></td>
			</tr>

			<tr>
				<td>Толщина подложек:</td>
				<td><input id="treadPlateThickness" type="number" value="8"></td>
			</tr>

			<tr class="profileParams_tr">
				<td>Толщина накладок/короба:</td>
				<td><input id="metalThickness" type="number" value="4"></td>
			</tr>

			<tr class="profileParams_tr">
				<td>Ширина накладок в узкой части:</td>
				<td><input id="sidePlateWidth" type="number" value="60"></td>
			</tr>

			<tr class="profileParams_tr">
				<td>Ширина профиля:</td>
				<td><input id="profileWidth" type="number" value="100"></td>
			</tr>

			<tr class="profileParams_tr">
				<td>Высота профиля:</td>
				<td><input id="profileHeight" type="number" value="100"></td>
			</tr>

			<tr class="profileParams_tr">
				<td>Наложение накладок на профиль:</td>
				<td><input id="sidePlateOverlay" type="number" value="30"></td>
			</tr>

			<tr>
				<td>Толщина фланцев:</td>
				<td><input id="flanThickness" type="number" value="8"></td>
			</tr>
			
			<tr class="timber_tr railing_tr timber_kovka_tr">
				<td>Сечение деревянных столбов</td>
				<td><input id="rackSize" type="number" value="95"></td>
			</tr>

			</tbody> </table>

			</div>
<!--
			Комментарии к расчету:<br/>  <textarea id="comments_03" rows="1" cols="80" class="comments"></textarea>
			<br/>

		
		
		<div class="priceDiv">
			<h3 class="raschet">Стоимость каркаса и ступеней: </h3>
				<div id="resultCarcas">
				<p>Расчет еще не произведен.</p>
			</div>
		</div>
-->
	</div>
</div>			
			
			
<!--Обработчик формы-->
<script type="text/javascript" src="/calculator/mono/forms/carcas_form_change.js"></script>

