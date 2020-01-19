<div id="carcasFormWrap">
	<h2 class="raschet">Характеристики лестницы</h2>
	<div id="carcasForm" class="toggleDiv">
	
		<h4>1. Общие характеристики:</h4>

		<table class="form_table" ><tbody>

		<tr id="model_tr"><td>Модель:</td> <td> 
			<select id="model" size="1">
				<option value="лт">ЛТ</option>
				<option value="ко">КО</option>
				<option value="нет">нет</option>
				<option value="больцы">больцы</option>
			</select>
		</td></tr>
		
		<tr><td>Геометрия лестницы:</td> <td>
			<select id="stairModel" size="1">
				<option value="Прямая">Прямая</option>
				<option value="Г-образная с площадкой">Г-образная с площадкой</option>
				<option value="Г-образная с забегом">Г-образная с забегом</option>
				<option value="П-образная с площадкой">П-образная с площадкой</option>
				<option value="П-образная с забегом">П-образная с забегом</option>
				<option value="П-образная трехмаршевая">П-образная трехмаршевая</option>
				<option style="display: none" value="Прямая двухмаршевая">Прямая двухмаршевая</option>
			</select>
		</td></tr>

		<tr class="pltP">
			<td>Глубина промежуточной площадки:</td> 
			<td><input id="platformLength_1" type="number" value="1000"></td>
		</tr>


		<tr id="middlePlatform_tr_3" style="display:none;">
			<td>Ширина промежуточной площадки:</td>
			<td><input id="platformWidth_1" type="number" value="2000"></td>
		</tr>


		<tr id="marshDist_tr"><td>Зазор между маршами в плане:</td> <td> 
			<input id="marshDist" type="number" value="100"> 
		</td></tr>

		<tr class="P3marsh"><td>Нижний поворот:</td> <td> 
			<select id="turnType_1" size="1" >
				<option value="забег">забег</option>
				<option value="площадка">площадка</option>
			</select>
		</td></tr>

		<tr class="P3marsh"><td>Верхний поворот:</td> <td> 
			<select id="turnType_2" size="1" >
				<option value="забег">забег</option>
				<option value="площадка">площадка</option>
			</select>
		</td></tr>


		<tr><td>Забежные рамки:</td> <td> 
			<select id="wndFrames" size="1">
				<option value="нет">нет</option>
				<option value="лист">из листа</option>
				<option value="профиль">из проф. трубы</option>
			</select>
		</td></tr>

		<tr><td>Направление поворота:</td> <td> 
		<select id="turnSide" size="1" >
			<option value="правое">правое</option>
			<option value="левое">левое</option>
		</select>
		</td></tr>

		<tr id="stringerDivision_tr" style="display: none"><td>Разделение косоуров промежуточной площадки:</td> <td>
			<select id="stringerDivision" size="1">
				<option value="нет">нет</option>
				<option value="есть">есть</option>
			</select>
		</td></tr>
		
		<tr class="P3marsh"><td>Разделение косоуров второй промежуточной площадки:</td> <td>
			<select id="stringerDivision2" size="1">
				<option value="нет">нет</option>
				<option value="есть">есть</option>
			</select>
		</td></tr>
		
		<tr class="topPlt"><td>Разделение косоуров верхней площадки:</td> <td>
			<select id="stringerDivisionTop" size="1">
				<option value="нет">нет</option>
				<option value="есть">есть</option>
			</select>
		</td></tr>

		<tr><td>Верхняя площадка:</td> <td>
			<select id="platformTop" size="1" >
				<option value="нет">нет</option>
				<option value="площадка">есть</option>
				<option value="увеличенная">увеличенная</option>
			</select>
		</td></tr>

		<tr><td>Ширина последней забежной ступени:</td> 
			<td><input id="lastWinderTreadWidth" type="number" value="100"></td>
		</tr>

		<tr class="topPlt">
			<td>Задняя тетива площадки:</td> <td>
			<select id="platformRearStringer" size="1" > 
				<option value="нет">нет</option>
				<option value="есть">есть</option>
			</select>
			</td>
		</tr>

		<tr class="topPlt">
			<td>Глубина верхней площадки:</td> 
			<td><input id="platformLength_3" type="number" value="1000"></td>
		</tr>
		
		<tr>
			<td>Ширина верхней площадки:</td> 
			<td><input id="platformWidth_3" type="number" value="1200" step="50"></td>
		</tr>

		<tr><td>Внешняя ширина маршей:</td> <td> 
			<input id="M" type="number" value="900">
		</td></tr>

		<tr><td>Тип тетив:</td> <td> 
			<select id="stringerType" size="1" >
				<option value="пилообразная" selected >пилообразная</option>
				<option value="ломаная">ломаная</option>
				<option value="прямая">прямая</option>
			</select>
		</td></tr>

		<tr><td>Подступенки:</td> <td> 
			<select id="riserType" size="1" >
				<option value="нет">нет</option>
				<option value="есть">есть</option>		
			</select>
		</td></tr>	

		<tr><td>Боковой свес ступеней, мм:</td> <td> 
			<input id="sideOverHang" type="number" value="75">
		</td></tr>

		<tr><td>Передний свес ступеней, мм:</td> <td> 
			<input id="nose" type="number" value="20">
		</td></tr>

		<tr id="stairFrame_tr"><td>Рамки под ступенями:</td> <td> 
			<select id="stairFrame" size="1">
				<option value="нет">нет</option>
				<option value="есть">есть</option>
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
			<td><input id="a1" type="number" value="300"></td>
		</tr>

		<tr class="marsh2">
			<td>Средний</td>
			<td><input id="stairAmt2" type="number" value="5"></td>
			<td><input id="h2" type="number" value="180"></td>
			<td><input id="b2" type="number" value="260"></td>
			<td><input id="a2" type="number" value="300"></td>
		</tr>

		<tr class="marsh3">
			<td>Верхний</td>
			<td><input id="stairAmt3" type="number" value="5"></td>
			<td><input id="h3" type="number" value="180"></td>
			<td><input id="b3" type="number" value="260"></td>
			<td><input id="a3" type="number" value="300"></td>
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
			<select id="stairType" size="1">
				<option value="массив">массив дерева</option>
				<option value="сосна кл.Б">сосна кл.Б</option>
				<option value="сосна экстра">сосна экстра</option>
				<option value="береза паркет.">береза паркет.</option>
				<option value="лиственница паркет.">лиственница паркет.</option>
				<option value="дуб паркет.">дуб паркет.</option>
				<option value="дуб ц/л">дуб ц/л</option>
				<option value="нет">нет</option>
				<option value="рифленая сталь">рифленая сталь</option>
				<option value="лотки">лотки</option>
				<option value="дпк">дпк</option>
				<option value="лиственница тер.">лиственница тер.</option>
				<option value="пресснастил">пресснастил</option>
				<option value="стекло">стекло</option>			
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
			<select id="boltHead" size="1" >
				<option value="countersunk">евро (потай)</option>
				<option value="hexagon">шестигранные</option>
			</select>
		</td></tr>

		<tr><td>Крашеные гловки болтов:</td> <td> 
			<select id="paintedBolts" size="1">
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
		
		<tr class="marsh1 stringerCover"><td>Накладки нижнего марша:</td> <td> 
			<select id="stringerCover_1" size="1" onchange="">
					<option value="нет">нет</option>
					<option value="внешняя">внешняя</option>
					<option value="внутренняя">внутренняя</option>
					<option value="две">две стороны</option>			
				</select>
		</td></tr>

		<tr class="marsh2 stringerCover"><td>Накладки среднего марша:</td> <td> 
			<select id="stringerCover_2" size="1" onchange="">
					<option value="нет">нет</option>
					<option value="внешняя">внешняя</option>
					<option value="внутренняя">внутренняя</option>
					<option value="две">две стороны</option>			
				</select>
		</td></tr>

		<tr class="marsh3 stringerCover"><td>Накладки верхнего марша:</td> <td> 
			<select id="stringerCover_3" size="1" onchange="">
					<option value="нет">нет</option>
					<option value="внешняя">внешняя</option>
					<option value="внутренняя">внутренняя</option>
					<option value="две">две стороны</option>			
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

		<tr>
			<td>Расположение креплений к стенам</td> 
			<td> 
			<select id="wallFixPos" size="1" >
				<option value="любое">любое</option>
				<option value="по месту">определить по месту</option>
			</select>
			</td>
		</tr>

		<tr>
			<td>Тип установки лестницы</td> 
			<td> 
			<select id="botFloorType" size="1" >
				<option value="чистовой">на чистовой пол</option>
				<option value="черновой">на черновой пол</option>		
			</select>
			</td>
		</tr>

		<tr id="botFloorsDist_tr" style="display: none">
			<td>Разница высот чистового и чернового полов</td>
			<td><input id="botFloorsDist" type="number" value="25"></td>
		</tr>

		<tr>
			<td>Продление внутренней тетивы нижнего марша:</td>
			<td> 
				<select id="inStringerElongationTurn1" size="1" >
					<option value="нет">нет</option>
					<option value="да">да</option>
				</select>
			</td>
		</tr>

		<tr>
			<td>Продление внутренней тетивы среднего марша:</td>
			<td> 
				<select id="inStringerElongationTurn2" size="1" >
					<option value="нет">нет</option>
					<option value="да">да</option>
				</select>
			</td>
		</tr>

		<tr class="topPlt">
			<td>Опоры верхней площадки:</td> <td> 
			<select id="platformTopColumn" size="1" >
				<option value="колонны">колонны</option>
				<option value="подкосы">подкосы</option>
				<option value="нет">нет</option>
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


		<tr class="topPlt">
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
			</td>
		</tr>


		<tr id="columnModel_tr"><td>Колонны:</td> <td> 
			<select id="columnModel" size="1" >
				<option value="нет">нет</option>
				<option value="40х40">40х40</option>
				<option value="100x50">100x50</option>
				<option value="100x100">100x100</option>
			</select>
		</td></tr>
		
		<tr id="columnPos_tr"><td>Крепление колонн к косоурам:</td> <td> 
			<select id="columnFixSide" size="1" >
				<option value="снаружи">снаружи</option>
				<option value="изнутри">изнутри</option>
			</select>
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

		<tr class="topFixParams"><td>Тип крепления к верхнему перекрытию:</td> <td> 
			<select id="topAnglePosition" size="1" >
				<option value="под ступенью">Уголок под ступенью</option>
				<option value="над ступенью">Уголок над ступенью</option>
				<option value="рамка верхней ступени">Через рамку верхней ступени</option>
				<option value="вертикальная рамка">Вертикальная рамка</option>
			</select>
		</td></tr>

		<tr class="topFixParams">
			<td>Фланец крепления к верхнему перекрытию:</td> <td> 
			<select id="topFlan" size="1" >
				<option selected value="нет">нет</option>
				<option value="есть">есть</option>		
			</select>
		</td></tr>

		<tr class="topFixParams">
			<td>Позиция анкеров крепления к верхнему перекрытию</td>
			<td><input id="topFlanHolesPosition" type="number" value="100"></td>
		</tr>


		<tr>
			<td>Тип крепления к нижнему перекрытию:</td> <td> 
			<select id="bottomAngleType" size="1" >
				<option value="уголок">уголок</option>
				<option value="регулируемая опора">регулируемая опора</option>
			</select>
		</td></tr>

		<tr class="marsh1 skirting"><td>Плинтус нижнего марша:</td> <td> 
			<select id="skirting_1" size="1" >
					<option value="нет">нет</option>
					<option value="внешнее"  >внешняя сторона</option>
					<option value="внутреннее">внутренняя сторона</option>
					<option value="две">две стороны</option>			
				</select>
		</td></tr>

		<tr class="marsh2 skirting"><td>Плинтус среднего марша:</td> <td> 
			<select id="skirting_2" size="1" >
					<option value="нет">нет</option>
					<option value="внешнее"  >внешняя сторона</option>
					<option value="внутреннее">внутренняя сторона</option>
					<option value="две">две стороны</option>			
				</select>
		</td></tr>

		<tr class="marsh3 skirting"><td>Плинтус верхнего марша:</td> <td> 
			<select id="skirting_3" size="1" >
					<option value="нет">нет</option>
					<option value="внешнее"  >внешняя сторона</option>
					<option value="внутреннее">внутренняя сторона</option>
					<option value="две">две стороны</option>		
				</select>
		</td></tr>

		<tr class="wndP skirting"><td>Плинтус внешней стороны забега:</td> <td> 
			<select id="skirting_wnd" size="1" >
					<option value="нет">нет</option>
					<option value="есть">есть</option>
				</select>
		</td></tr>

		<tr class="pltP skirting"><td>Плинтус сзади промежуточной площадки:</td> <td> 
			<select id="skirting_plt" size="1" >
					<option value="нет">нет</option>
					<option value="есть">есть</option>		
				</select>
		</td></tr>
		
		<tr class="marsh1 stringerMoove">
			<td>Смещение внешнего косоура нижнего марша:</td> 
			<td><input id="stringerMoove_1" type="number" value="0"></td>
		</tr>
		
		<tr class="marsh2 stringerMoove">
			<td>Смещение внешнего косоура среднего марша:</td> 
			<td><input id="stringerMoove_2" type="number" value="0"></td>
		</tr>
		
		<tr class="marsh3 stringerMoove">
			<td>Смещение внешнего косоура верхнего марша:</td> 
			<td><input id="stringerMoove_3" type="number" value="0"></td>
		</tr>
		
		<tr><td>Отверстия для обшивки каркаса:</td> <td> 
			<select id="stringerBotHoles" size="1" >
					<option value="нет">нет</option>
					<option value="есть">есть</option>		
				</select>
		</td></tr>


		</tbody></table>

	</div>



	<div id="manufacturingParams">
		<h4>7. Технологические параметры:</h4>

		<table class="form_table" ><tbody>

			<tr>
				<td>Толщина ступеней:</td>
				<td><input id="treadThickness" type="number" value="40"></td>
			</tr>
			
			<tr>
				<td>Толщина подступенков:</td>
				<td><input id="riserThickness" type="number" value="18"></td>
			</tr>

			<tr>
				<td>Толщина тетив:</td>
				<td><input id="stringerThickness" type="number" value="8"></td>
			</tr>

			<tr>
				<td>Ширина террасной доски:</td>
				<td><input id="dpcWidth" type="number" value="150"></td>
			</tr>
			<tr>
				<td>Зазор между досками:</td>
				<td><input id="dpcDst" type="number" value="5"></td>
			</tr>
			
			<tr class="timber_tr railing_tr">
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
<script type="text/javascript" src="/calculator/metal/forms/carcas_form_change.js"></script>


