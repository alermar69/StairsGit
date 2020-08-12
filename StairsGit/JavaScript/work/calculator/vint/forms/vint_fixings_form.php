<div id='fixingFormWrapper'>
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
</div>