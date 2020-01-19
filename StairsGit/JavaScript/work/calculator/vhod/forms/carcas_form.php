<div id="carcasFormWrap">
	<h2 class="raschet">Характеристики лестницы</h2>
	<div id="carcasForm" class="toggleDiv">

		<h4>1. Общие характеристики:</h4>

		<table class="form_table" ><tbody>

			<tr><td>Тип лестницы:</td> <td> 
				<select id="staircaseType" size="1">
					<option value="Готовая">Готовая</option>
					<option value="На заказ" selected >На заказ</option>
				</select>
			</td></tr>

			<tr id="model_tr"><td>Каркас:</td> <td> 
				<select id="model" size="1">
					<option value="лт">ЛТ</option>
				</select>
			</td></tr>

			<tr id="stairModel_tr"><td>Геометрия лестницы:</td> <td>
				<select id="stairModel" size="1">
					<option value="Прямая">Прямая</option>
					<option value="Г-образная с площадкой">Г-образная с площадкой</option>
					<option value="Прямая с промежуточной площадкой">Прямая с промежуточной площадкой</option>
					<option value="Прямая горка">Прямая горка</option>
				</select>
			</td></tr>

			<tr class="custom marsh3">
				<td>Длина промежуточной площадки:</td> 
				<td><input id="middlePltLength" type="number" value="1000" step="50"></td>
			</tr>

			<tr class="custom marsh3">
				<td>Ширина промежуточной площадки:</td> 
				<td><input id="middlePltWidth" type="number" value="900" step="50"></td> 
			</tr>

			<tr id="turnSide_tr"><td>Направление поворота:</td> <td> 
			<select id="turnSide" size="1" onchange="">
				<option value="правое">правое</option>
				<option value="левое">левое</option>
			</select>
			</td></tr>


			<tr><td>Верхняя площадка:</td> <td>
				<select id="platformTop" size="1" onchange="">
					<option value="нет">нет</option>
					<option value="площадка">стандартная</option>
					<option value="увеличенная" class="custom" >увеличенная</option>	
				</select>
			</td></tr>


			<tr id="platformTop_tr_1" class="custom">
				<td>Глубина верхней площадки:</td> 
				<td><input id="platformLength_3" type="number" value="900" step="50"></td>
			</tr>

			<tr class="stock">
				<td>Глубина верхней площадки:</td> 
				<td>
					<select id="topPltLength_stock" size="1" onchange="">
						<option value="600">600</option>
						<option value="900">900</option>
						<option value="1200">1200</option>	
					</select>
				</td>
			</tr>


			<tr id="platformTop_tr_2" class="custom">
				<td>Ширина верхней площадки:</td> 
				<td><input id="platformWidth_3" type="number" value="1200" step="50"></td>
			</tr>

			<tr id="platformTop_tr_3">
				<td>Задняя тетива площадки:</td> <td>
				<select id="platformRearStringer" size="1" onchange=""> 
					<option value="нет">нет</option>
					<option value="есть">есть</option>
				</select>
				</td>
			</tr>

			<tr>
				<td>Боковой добор верхней площадки:</td> <td>
				<select id="pltExtenderSide" size="1" onchange=""> 
					<option value="нет">нет</option>
					<option value="справа">справа</option>
					<option value="слева">слева</option>
				</select>
				</td>
			</tr>

			<tr>
				<td>Ширина бокового добора верхней площадки:</td> <td>
				<input id="pltExtenderWidth" type="number" value="50" step="10">
				</td>
			</tr>

			<tr>
				<td>Внешняя ширина маршей:</td>
				<td><input id="M" type="number" value="900"></td>
			</tr>

			<tr class="stock">
				<td>Кол-во рамок в одной ступени:</td>
				<td>
					600мм: <input id="frameAmt_600" type="number" value="0"><br/>
					800мм: <input id="frameAmt_800" type="number" value="0"><br/>
					1000мм: <input id="frameAmt_1000" type="number" value="1"><br/>	
				</td>
			</tr>


			<tr class="custom">
				<td>Тип тетив:</td> <td> 
				<select id="stringerType" size="1" onchange="">
					<option value="пилообразная" selected >пилообразная</option>
					<option value="ломаная">ломаная</option>
					<option value="прямая">прямая</option>
				</select>
			</td></tr>

			<tr class="custom"><td>Подступенки:</td> <td> 
				<select id="riserType" size="1" onchange="">
					<option value="нет">нет</option>
					<option value="есть">есть</option>		
				</select>
			</td></tr>	

			<tr><td>Передний свес ступеней, мм:</td> <td> 
				<input id="nose" type="number" value="20">
			</td></tr>
		
			<tr id="stairFrame_tr" class="custom"><td>Рамки под ступенями:</td> <td> 
				<select id="stairFrame" size="1">
					<option value="есть">есть</option>
					<option value="нет">нет</option>
				</select>
			</td></tr>

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
				<td><input id="a1" type="number" value="305"></td>
			</tr>

			<tr class="marsh2">
				<td>Средний</td>
				<td><input id="stairAmt2" type="number" value="5"></td>
				<td><input id="h2" type="number" value="180"></td>
				<td><input id="b2" type="number" value="260"></td>
				<td><input id="a2" type="number" value="305"></td>
			</tr>

			<tr class="marsh3">
				<td>Верхний</td>
				<td><input id="stairAmt3" type="number" value="5"></td>
				<td><input id="h3" type="number" value="180"></td>
				<td><input id="b3" type="number" value="260"></td>
				<td><input id="a3" type="number" value="305"></td>
			</tr>

			</tbody>
			</table>

		<div id="complect_inputs">
			<h4>3. Комплектация лестницы:</h4>

			<table class="form_table" ><tbody>

			<tr><td>Каркас:</td> <td> 
				<select id="isCarcas" size="1">
					<option value="есть">есть</option>
					<option value="нет">нет</option>
				</select>
			</td></tr>
		
			<tr><td>Ступени:</td> <td> 
				<select id="stairType" size="1">
					<option value="дпк">дпк</option>
					<option value="лиственница тер.">лиственница тер.</option>	
					<option value="рифленая сталь" class="custom">рифленая сталь</option>
					<option value="пресснастил" class="custom">пресснастил</option>
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

			<tr class="custom"><td>Головки болтов каркаса:</td> <td> 
				<select id="boltHead" size="1" onchange="">
					<option value="countersunk">евро (потай)</option>
					<option value="hexagon">шестигранные</option>
				</select>
			</td></tr>

			<tr class="custom"><td>Крашеные гловки болтов:</td> <td> 
				<select id="paintedBolts" size="1" onchange="">
					<option value="нет">нет</option>
					<option value="есть">есть</option>
				</select>
			</td></tr>
			
			<tr><td>Пластиковые колпачки на гайки:</td> <td> 
				<select id="isPlasticCaps" size="1">
					<option value="нет">нет</option>
					<option value="есть">есть</option>				
				</select>
			</td></tr>



			</tbody> </table>
			
			<!-- цвета и материалы -->
			<div id="colors_inputs">
				<h4>4. Материалы и цвета:</h4>
				<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/colorsForm.php" ?>
			</div>	
					

		</div>
		
	
			
		<div id="assembling_inputs">


			<h4>5. Крепление лестницы.</h4>
			<!-- параметры крепления лестницы к стенам-->
			<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/fixingParams.php" ?>

			<table class="form_table">
			<tbody>


			<tr class="custom">
				<td>Расположение креплений к стенам</td> 
				<td> 
				<select id="wallFixPos" size="1" onchange="">
					<option value="любое">любое</option>
					<option value="по месту">определить по месту</option>
				</select>
				</td>
			</tr>

			<tr class="custom">
				<td>Тип установки лестницы</td> 
				<td> 
				<select id="botFloorType" size="1" onchange="">
					<option value="чистовой">на чистовой пол</option>
					<option value="черновой">на черновой пол</option>		
				</select>
				</td>
			</tr>

			<tr id="botFloorsDist_tr" style="display: none" class="custom">
				<td>Разница высот чистового и чернового полов</td>
				<td><input id="botFloorsDist" type="number" value="25"></td>
			</tr>

			<tr>
				<td>Опоры верхней площадки:</td> <td> 
				<select id="topPltColumns" size="1" onchange="">
					<option value="колонны">колонны</option>
					<option value="подкосы" class="custom">подкосы</option>
					<option value="нет" class="custom">нет</option>
				</select>
			</td></tr>

			<tr>
				<td>Колонны наверху лестницы:</td> <td> 
				<select id="topStepColumns" size="1" onchange="">
					<option value="нет">нет</option>
					<option value="есть">есть</option>
					
				</select>
			</td></tr>

			<tr>
				<td>Крепление подкосов верхней площадки:</td> <td> 
				<select id="topPltConsolePos" size="1" onchange="">
					<option value="справа">справа</option>
					<option value="слева">слева</option>
					<option value="сзади">сзади</option>
				</select>
			</td></tr>

			<tr>
				<td id="topPltColumnsPos_img">
					<img src="/images/calculator/vhod/columnPos/topPlt/001.jpg" width="200px">
				</td>
				<td id="isColumnTop">
					Колонны верхней площадки:
					<br/>
					<label><input type="checkbox" id="isColumnTop1">1<br/></label>
					<label><input type="checkbox" id="isColumnTop2">2<br/></label>
					<label><input type="checkbox" id="isColumnTop3">3<br/></label>
					<label><input type="checkbox" id="isColumnTop4">4<br/></label>
					<label><input type="checkbox" id="isColumnTop5">5<br/></label>
					<label><input type="checkbox" id="isColumnTop6">6<br/></label>

				</td>
			</tr>

			<tr class="custom">
				<td>Опоры средней площадки:</td> <td> 
				<select id="middlePltColumns" size="1" onchange="">
					<option value="колонны">колонны</option>
					<option value="подкосы" >подкосы</option>
				</select>
			</td></tr>

			<tr class="custom">
				<td>Крепление подкосов средней площадки:</td> <td> 
				<select id="middlePltConsolePos" size="1" onchange="">
					<option value="справа">справа</option>
					<option value="слева">слева</option>
					<option value="сзади">сзади</option>
				</select>
			</td></tr>

			<tr class="custom">
				<td id="middlePltColumnsPos_img">
					<img src="/images/calculator/vhod/columnPos/topPlt/001.jpg" width="200px">
				</td>
				<td id="isColumnMiddle">
					Колонны средней площадки:
					<br/>
					<label><input type="checkbox" id="isColumnMiddle1">1<br/></label>
					<label><input type="checkbox" id="isColumnMiddle2">2<br/></label>
					<label><input type="checkbox" id="isColumnMiddle3">3<br/></label>
					<label><input type="checkbox" id="isColumnMiddle4">4<br/></label>

				</td>
			</tr>

			<tr><td>Размер колонн:</td> <td> 
				<select id="columnModel" size="1">
					<option value="40х40">40х40</option>
					<option value="100x50" class="custom">100x50</option>
					<option value="100x100" class="custom">100x100</option>
				</select>
			</td></tr>

			<tr class="custom"><td>Тип крепления к верхнему перекрытию:</td> <td> 
				<select id="topAnglePosition" size="1">
					<option value="под ступенью">Уголок под ступенью</option>
					<option value="над ступенью">Уголок над ступенью</option>
				</select>
			</td></tr>

			<tr class="custom">
				<td>Тип крепления к нижнему перекрытию:</td> <td> 
				<select id="bottomAngleType" size="1">
					<option value="уголок">уголок</option>
					<option value="регулируемая опора">регулируемая опора</option>
				</select>
			</td></tr>

			<tr>
				<td>Фланец крепления к верхнему перекрытию:</td> <td> 
				<select id="topFlan" size="1" onchange="">
					<option value="нет">нет</option>
					<option value="есть">есть</option>		
				</select>
			</td></tr>
			
			<tr class="topFixParams">
				<td>Позиция анкеров крепления к верхнему перекрытию</td>
				<td><input id="topFlanHolesPosition" type="number" value="100"></td>
			</tr>

			</tbody></table>
<!--
			Комментарии к материалам стен и перекрытий:<br/>  <textarea id="comments_mounting" rows="1" cols="80" class="comments"></textarea><br>
-->
			</div>



		<div id="manufacturingParams" class="">
			<h4>6. Технологические параметры:</h4>

			<table class="form_table" ><tbody>

				<tr class="custom">
				<td>Толщина ступеней:</td>
				<td><input id="treadThickness" type="number" value="20"></td>
			</tr>

				<tr>
					<td>Ширина террасной доски:</td>
					<td><input id="dpcWidth" type="number" value="145"></td>
				</tr>
				<tr>
					<td>Зазор между досками:</td>
					<td><input id="dpcDst" type="number" value="5"></td>
				</tr>

				<tr>
					<td>Толщина подступенков:</td>
					<td><input id="riserThickness" type="number" value="18"></td>
				</tr>

				<tr style="display: none">
					<td>Толщина тетив:</td>
					<td><input id="stringerThickness" type="number" value="8"></td>
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
<script type="text/javascript" src="/calculator/vhod/forms/carcas_form_change.js"></script>


