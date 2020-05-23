<div id="carcasFormWrap">
	<h2 class="raschet">Характеристики лестницы</h2>
	<div id="carcasForm" class="toggleDiv">

		<div id="carcasTableWrapper">
			<table class="form_table">
				<tbody>
					<tr>
						<td>Модель:</td>
						<td><select name="model" size="1" id="model">
								<option value="Винтовая">Винтовая</option>
								<option value="Винтовая с тетивой">Винтовая с тетивой</option>
								<option value="Спиральная">Спиральная (тетивы)</option>
								<option value="Спиральная (косоур)">Спиральная (косоур)</option>	
							</select>
						</td>
					</tr>

					<tr>
						<td>Материал ступеней:</td>
						<td><select name="treadsMaterial" size="1" id="treadsMaterial" onchange="setTreadThk()">
								<option value="береза паркет.">береза паркет.</option>
								<option value="дуб паркет.">дуб паркет.</option>
								<option value="дуб ц/л">дуб ц/л</option>
								<option value="рифленая сталь">рифленая сталь</option>
								<option value="лотки под плитку">лотки под плитку</option>
							</select>
						</td>
					</tr>

					<tr>
						<td>Кол-во подъемов:</td>
						<td><input name="stepAmt" type="number" id="stepAmt" value="15" /></td>
					</tr>
					<tr>
						<td>Внешний диаметр лестницы, мм:</td>
						<td><input name="staircaseDiam" type="number" id="staircaseDiam" value="1600" /></td>
					</tr>
					<tr>
						<td>Ширина марша, мм:</td>
						<td><input type="number" id="M" value="900" /></td>
					</tr>
					<tr>
						<td>Диаметр столба, мм:</td>
						<td><input name="columnDiam" type="number" id="columnDiam" value="127" /></td>
					</tr>

					<tr>
						<td>Угол на один подъем, град.:</td>
						<td><input name="stepAngle" type="number" id="stepAngle" value="21" /></td>
					</tr>
					<tr>
						<td>Верхняя площадка:</td>
						<td>
							<select size="1" id="platformType">
								<option value="triangle">Треугольная</option>
								<option value="square">Прямоугольная</option>
								<option value="нет">нет</option>
							</select>
						</td>
					</tr>
					<tr class="topPlt">
						<td>Угол площадки, град.:</td>
						<td><input name="platformAngle" type="number" id="platformAngle" value="60" /></td>
					</tr>

					</tr>
					<tr class="topPlt">
						<td>Выступ площадки по глубине, мм:</td>
						<td><input type="number" id="platformLedge" value="50" step="50" /></td>
					</tr>

					</tr>
					<tr class="topPlt">
						<td>Выступ площадки по ширине, мм:</td>
						<td><input type="number" id="platformLedgeM" value="50" step="50" /></td>
					</tr>

					</tr>
					<tr class="topPlt">
						<td>Длина ограждения площадки, мм:</td>
						<td><input type="number" id="platformSectionLength" value="700" step="10" /></td>
					</tr>

					<tr class="topPlt">
						<td>Замыкание поручня на площадке:</td>
						<td>
							<select size="1" id="pltHandrailConnection">
								<option value="нет">нет</option>
								<option value="есть">есть</option>
							</select>
						</td>
					</tr>

					<tr>
						<td>Направление подъема:</td>
						<td><select size="1" id="turnFactor">
								<option value="1">левое</option>
								<option value="-1" selected>правое</option>
							</select>
						</td>
					</tr>
					<tr>
						<td>Расположение площадки:</td>
						<td><select name="platformPosition" size="1" id="platformPosition">
								<option value="вровень">Вровень с перекрытием</option>
								<option value="ниже">Ниже перекрытия</option>
							</select>
						</td>
					</tr>


					<tr class="metalPaint">
						<td>Покраска металлических деталей:</td>
						<td><select name="metalPaint" size="1" id="metalPaint">
								<!-- варианты покраски металла -->
								<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/metalPaint.php" ?>
							</select>
						</td>
					</tr>

					<tr class='metalPaint metalColor'>
						<td>Цвет покраски металла:</td>
						<td>
							<select id="carcasColor" size="1" onchange="">
								<!-- варианты цветов покраски металла -->
								<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/metalColors.php" ?>
							</select>
						</td>
					</tr>

					<tr class="metalPaint">
						<td>Комментарий к цвету металла:</td>
						<td><textarea id="comments_01" rows="1" cols="30" class="comments"></textarea></td>
					</tr>


					<tr class="timberPaint">
						<td>Покраска деревянных деталей</td>
						<td><select name="timberPaint" size="1" id="timberPaint" onchange="">
								<!-- варианты покраски дерева -->
								<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/timberPaint.php" ?>
							</select>
						</td>
					</tr>

					<tr class="timberPaint">
						<td>Поверхность дерева:</td>
						<td>
							<select id="surfaceType" size="1">
								<!-- варианты покраски дерева -->
								<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/surfaceTypes.php" ?>
							</select>
						</td>
					</tr>

					<tr class="timberPaint">
						<td>Шпаклевка:</td>
						<td>
							<select id="fillerType" size="1">
								<!-- варианты покраски дерева -->
								<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/fillerTypes.php" ?>
							</select>
						</td>
					</tr>


					<tr class="timberPaint timberColor">
						<td>Морилка:</td>
						<td>
							<select id="timberColorNumber" size="1" onchange="">
								<!-- варианты цветов морилки -->
								<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/timberColors.php" ?>
							</select>
						</td>
					</tr>

					<tr class="timberPaint">
						<td>Комментарий к цвету покраски дерева</td>
						<td><textarea id="comments_02" rows="1" cols="30" class="comments"></textarea></td>
					</tr>

					<tr>
						<td>Подсветка ступеней:</td>
						<td>
							<select id="treadLigts" size="1">
								<option value="нет">нет</option>
								<option value="есть">есть</option>
							</select>
						</td>
					</tr>

				</tbody>
			</table>
		</div>

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

			</tbody>
		</table>


		<h4>Крепление лестницы.</h4>

		<table class="form_table" id="midHoldersTable">
			<tbody>
				<tr>
					<td>Тип установки лестницы</td>
					<td>
						<select id="botFloorType" size="1" onchange="">
							<option value="чистовой">на чистовой пол</option>
							<option value="черновой">на черновой пол</option>
						</select>
					</td>
				</tr>

				<tr>
					<td>Крышка нижнего фланца</td>
					<td>
						<select id="botFlanCover" size="1" onchange="">
							<option value="нет">нет</option>
							<option value="есть">есть</option>
						</select>
					</td>
				</tr>

				<tr id="botFloorsDist_tr" style="display: none">
					<td>Разница высот чистового и чернового полов</td>
					<td><input id="botFloorsDist" type="number" value="25"></td>
				</tr>

				<tr>
					<td>Кол-во промежуточных креплений:</td>
					<td><input type="number" id="holderAmt" value="0" /></td>
				</tr>

				<tr class="midHolderInputs">
					<td>Профиль промежуточных креплений:</td>
					<td>
						<select id="holderProf" size="1" onchange="">
							<option value="40x40">40x40</option>
							<option value="100x50">100x50</option>
						</select>
					</td>
				</tr>

			</tbody>
		</table>

		<div class="midHolderInputs">
			<h4>Параметры промежуточных креплений:</h4>

			<table class="form_table" id="midHoldersTable">
				<tbody>
					<tr>
						<th>№ крепления</th>
						<th>Угол</th>
						<th>Длина</th>
						<th>№ ступени</th>
					<tr>
					<tr class="midHolder">
						<td>1</td>
						<td><input type="number" id="holderAngle_0" value="0" /></td>
						<td><input type="number" id="holderLength_0" value="1000" step="20"></td>
						<td><input type="number" id="holderPos_0" value="5" /></td>
					</tr>
					<tr class="midHolder">
						<td>2</td>
						<td><input type="number" id="holderAngle_1" value="90" /></td>
						<td><input type="number" id="holderLength_1" value="1000" step="20"></td>
						<td><input type="number" id="holderPos_1" value="6" /></td>
					</tr>
					<tr class="midHolder">
						<td>3</td>
						<td><input type="number" id="holderAngle_2" value="180" /></td>
						<td><input type="number" id="holderLength_2" value="1000" step="20"></td>
						<td><input type="number" id="holderPos_2" value="7" /></td>
					</tr>
					<tr class="midHolder">
						<td>4</td>
						<td><input type="number" id="holderAngle_3" value="270" /></td>
						<td><input type="number" id="holderLength_3" value="1000" step="20"></td>
						<td><input type="number" id="holderPos_3" value="8" /></td>
					</tr>
					<tr class="midHolder">
						<td>5</td>
						<td><input type="number" id="holderAngle_4" value="0" /></td>
						<td><input type="number" id="holderLength_4" value="1000" step="20"></td>
						<td><input type="number" id="holderPos_4" value="9" /></td>
					</tr>
				</tbody>
			</table>
		</div>


		<!-- параметры крепления лестницы к стенам-->
		<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/fixingParams.php" ?>

		<div id="complect_inputs">

			<h4>Технологические параметры:</h4>

			<table class="form_table">
				<tbody>

					<tr>
						<td>Толщина ступеней:</td>
						<td><input id="treadThickness" type="number" value="40"></td>
					</tr>


					<tr style="display: none;">
						<td>Регулировочные шайбы</td>
						<td>
							<select id="regShims" size="1" onchange="">
								<option value="есть">есть</option>
								<option value="нет">нет</option>
							</select>
						</td>
					</tr>

					<tr>
						<td>Количество регулировочных шайб</td>
						<td><input id="regShimAmt" type="number" value="5"></td>
					</tr>

				</tbody>
			</table>

		</div>
		<!--
		Комментарии к расчету:<br/>  <textarea id="main_comments" rows="1" cols="80" class="comments"></textarea>
		<br/>
-->
	</div>
</div>