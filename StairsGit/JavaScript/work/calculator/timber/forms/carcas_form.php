<div id="carcasFormWrap">
	<h2 class="raschet">Характеристики лестницы</h2>
	<div id="carcasForm" class="toggleDiv">
		<h4>1. Общие характеристики:</h4>

		<table class="form_table" ><tbody>

			<tr id="model_tr"><td>Каркас:</td> <td> 
				<select id="model" size="1" onchange="changeAllForms()">
					<option value="тетивы">тетивы</option>
					<option value="косоуры">косоуры</option> 
					<option value="тетива+косоур">тетива+косоур</option>
				</select>
			</td></tr>

			<tr><td>Геометрия лестницы:</td> <td> 
				<select id="stairModel" size="1" onchange="changeAllForms()">
					<option value="Прямая">Прямая</option>
					<option value="Г-образная с площадкой"   >Г-образная с площадкой</option>
					<option value="Г-образная с забегом" >Г-образная с забегом</option>
					<option value="П-образная с площадкой">П-образная с площадкой</option>
					<option value="П-образная с забегом"   >П-образная с забегом</option>
					<option value="П-образная трехмаршевая"  >П-образная трехмаршевая</option>		
				</select>
			</td></tr>



			<tr class="pltP">
				<td>Глубина промежуточной площадки:</td> 
				<td><input id="platformLength_1" type="number" value="1000"></td>
			</tr>

			<tr id="marshDist_tr"><td>Зазор между маршами в плане:</td> <td> 
				<input id="marshDist" type="number" value="100"> 
			</td></tr>

			<tr class="P3marsh"><td>Нижний поворот:</td> <td> 
				<select id="turnType_1" size="1" onchange="">
					<option value="забег"  >забег</option>
					<option value="площадка" selected >площадка</option> 
				</select>
			</td></tr>

			<tr class="P3marsh"><td>Верхний поворот:</td> <td> 
				<select id="turnType_2" size="1" onchange="">
					<option value="забег"  >забег</option> 
					<option value="площадка" selected >площадка</option>
				</select>
			</td></tr>

			<tr><td>Направление поворота:</td> <td> 
			<select id="turnSide" size="1" onchange="">
				<option value="правое">правое</option>
				<option value="левое">левое</option>
			</select>
			</td></tr>

			<tr><td>Верхняя площадка:</td> <td>
				<select id="platformTop" size="1" onchange="changeAllForms()">
					<option value="нет">нет</option>
					<option style="display: none;" value="площадка">есть</option>
					<option style="display: none;" value="забег">забег</option>		
				</select>
			</td></tr>
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


			<tr><td>Подступенки:</td> <td> 
				<select id="riserType" size="1" onchange="">
					<option value="нет">нет</option>
					<option value="есть" selected>есть</option>		
				</select>
			</td></tr>	

			<tr><td>Передний свес ступеней, мм:</td> <td> 
				<input id="nose" type="number" value="20">
			</td></tr>

			<tr id="columnPos_tr">
			<td><img src="/images/calculator/columnPos/001.jpg" width="250px" id="columnPos_img"></td>
				<td>
					<label id="isColumn1_label"><input type="checkbox" id="isColumn1">1<br/></label>
					<label id="isColumn2_label"><input type="checkbox" id="isColumn2">2<br/></label>
					<label id="isColumn3_label"><input type="checkbox" id="isColumn3">3<br/></label>
					<label id="isColumn4_label"><input type="checkbox" id="isColumn4">4<br/></label>
					<label id="isColumn5_label"><input type="checkbox" id="isColumn5">5<br/></label>
					<label id="isColumn6_label"><input type="checkbox" id="isColumn6">6<br/></label>
					<label id="isColumn7_label"><input type="checkbox" id="isColumn7">7<br/></label>
					<label id="isColumn8_label"><input type="checkbox" id="isColumn8">8<br/></label>
				</td>
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
				<td><input id="stairAmt1" type="number" value="5"></td>
				<td><input id="h1" type="number" value="180"></td>
				<td><input id="b1" type="number" value="260"></td>
				<td><input id="a1" type="number" value="280"></td>
			</tr>

			<tr class="marsh2">
				<td>Средний</td>
				<td><input id="stairAmt2" type="number" value="5" onchange="changeFormCarcas();" ></td>  
				<td><input id="h2" type="number" value="150"></td>
				<td><input id="b2" type="number" value="260"></td>
				<td><input id="a2" type="number" value="280"></td>
			</tr>

			<tr class="marsh3">
				<td>Верхний</td>
				<td><input id="stairAmt3" type="number" value="5"></td>
				<td><input id="h3" type="number" value="200"></td>
				<td><input id="b3" type="number" value="260"></td>
				<td><input id="a3" type="number" value="280"></td>
			</tr>

			</tbody>
			</table>

			<div id="assembling_inputs">
			
	<!-- Пригласительные ступени -->
	<div id="startTreads">
		<h4>3. Пригласительные ступени</h4>
		<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/startTreads/forms/form.php" ?>
	</div>
		
		<div id="complect_inputs">
			<h4>4. Комплектация лестницы:</h4>

			<table class="form_table"><tbody>
		
				<tr><td>Отделка:</td> <td> 
					<select id="timberPaint" size="1" onchange="">
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
				
				<tr><td>Подсветка ступеней:</td> <td> 
					<select id="treadLigts" size="1">
						<option value="нет">нет</option>
						<option value="есть">есть</option>				
					</select>
				</td></tr>
		
			</tbody></table>
		</div>
			
			
	<!-- цвета и материалы -->
	<div id="colors_inputs">
		<h4>5. Материалы и цвета:</h4>
		<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/colorsForm.php" ?>
	</div>

	<div id="fixing_inputs">
	
			<h4>6. Крепление лестницы.</h4>

			<!-- параметры крепления лестницы к стенам-->
			<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/fixingParams.php" ?>


			<table class="form_table" ><tbody>
			<tr class="topPlt">
				<td>Опоры верхней площадки:</td> <td> 
				<select id="platformTopColumn" size="1" onchange="changeFormCarcas();">
					<option value="колонны">колонны</option>
					<option value="подкосы">подкосы</option>
				</select>
			</td></tr>

			<tr id="inclinedBeamAngle_tr" style="display: none">
				<td>Угол наклона подкоса к стене:</td>
				<td><input id="inclinedBeamAngle" type="number" value="45"></td>
			</tr>

			<tr id="platformTopColumnAmt_tr" style="display: none">
				<td>Количество опор верхней площадки</td>
				<td><input id="platformTopColumnAmt" type="number" value="0"></td>
			</tr>

			<tr style="display: none">
				<td>Фланец крепления к верхнему перекрытию:</td> <td> 
				<select id="topFlan" size="1" onchange="">
					<option value="есть">есть</option>
					<option selected value="нет">нет</option>
				</select>
			</td></tr>

			<tr style="display: none">
				<td>Тип крепления к нижнему перекрытию:</td> <td> 
				<select id="bottomAngleType" size="1" onchange="">
					<option value="уголок">уголок</option>
					<option value="регулируемая опора">регулируемая опора</option>
				</select>
			</td></tr>

			<tr class="marsh1 skirting"><td>Плинтус нижнего марша:</td> <td> 
				<select id="skirting_1" size="1" onchange="">
						<option value="нет">нет</option>
						<option value="внешнее"  >внешняя сторона</option>
						<option value="внутреннее">внутренняя сторона</option>
						<option value="две">две стороны</option>			
					</select>
			</td></tr>

			<tr class="marsh2 skirting"><td>Плинтус среднего марша:</td> <td> 
				<select id="skirting_2" size="1" onchange="">
						<option value="нет">нет</option>
						<option value="внешнее"  >внешняя сторона</option>
						<option value="внутреннее">внутренняя сторона</option>
						<option value="две">две стороны</option>			
					</select>
			</td></tr>

			<tr class="marsh3 skirting"><td>Плинтус верхнего марша:</td> <td> 
				<select id="skirting_3" size="1" onchange="">
						<option value="нет">нет</option>
						<option value="внешнее"  >внешняя сторона</option>
						<option value="внутреннее">внутренняя сторона</option>
						<option value="две">две стороны</option>		
					</select>
			</td></tr>

			<tr class="wndP skirting"><td>Плинтус внешней стороны забега:</td> <td> 
				<select id="skirting_wnd" size="1" onchange="">
						<option value="нет">нет</option>
						<option value="есть">есть</option>
					</select>
			</td></tr>

			<tr class="pltP skirting"><td>Плинтус сзади промежуточной площадки:</td> <td> 
				<select id="skirting_plt" size="1" onchange="">
						<option value="нет">нет</option>
						<option value="есть">есть</option>		
					</select>
			</td></tr>

			</tbody></table>
		</div>
	</div>


		<div id="manufacturing_inputs">
			<h4>7. Технологические параметры:</h4>

			<table class="form_table" ><tbody>

			<tr>
				<td>Толщина ступеней:</td>
				<td><input id="treadThickness" type="number" value="40"></td>
			</tr>

			<tr>
				<td>Толщина подступенков:</td>
				<td><input id="riserThickness" type="number" value="20"></td>
			</tr>
			<tr>
				<td>Толщина тетив:</td>
				<td><input id="stringerThickness" type="number" value="40"></td>
			</tr>
			<tr>
				<td>Глубина пазов:</td>
				<td><input id="stringerSlotsDepth" type="number" value="15"></td>
			</tr>

			<tr>
				<td>Опорные столбы:</td>
				<td><input id="rackSize" type="number" value="95"></td>
			</tr>

			</tbody> </table>

			</div>
			
			

<!--
			Комментарии к расчету:<br/>  <textarea id="comments_03" rows="1" cols="80" class="comments"></textarea>
			<br/>
-->			
		
		
		
		<div class="priceDiv">
			<h3 class="raschet">Стоимость каркаса и ступеней: </h3>
			<div id="resultCarcas">
				<p>Расчет еще не произведен.</p>
			</div>
		</div>
		
	</div>
</div>

<!--Обработчик формы-->
<script type="text/javascript" src="/calculator/timber/forms/carcas_form_change.js"></script>

