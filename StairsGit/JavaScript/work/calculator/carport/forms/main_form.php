<div id="carcasFormWrap">
	
	<h3>Параметры каркаса</h3>
	<table class="form_table">
		<tbody>
			<tr>
				<td>Геометрия навеса:</td>
				<td>
					<select id="carportType" data-link="carport^carportType">
						<option value="двухскатный">двухскатный</option>
						<option value="односкатный">односкатный</option>
						<option value="консольный">консольный</option>
						<option value="консольный двойной">консольный двойной</option>
						<option value="купол">купол</option>
						<!-- 
						<option value="консольный фронтальный">консольный фронтальный</option>
						<option value="арочный продольный">арочный продольный</option>
						<option value="консольный">консольный</option>
						<option value="консольный продольный">консольный продольный</option>
						<option value="пристроенный">пристроенный </option> -->
						
					</select>
				</td>
			</tr>
			
			<tr>
				<td>Кровля:</td>
				<td>
					<select id="roofType">
						<option value="Арочная">Арочная</option>
						<option value="Плоская">Плоская</option>						
					</select>
				</td>
			</tr>
			
			<tr class="truss">
				<td>Модель ферм:</td>
				<td>
					<select id="trussModel">
						<option value="сужающаяся">сужающаяся</option>						
						<option value="постоянной ширины">постоянной ширины</option>	
					</select>
				</td>
			</tr>
			
			<tr class="truss">
				<td>Отверстия в фермах:</td>
				<td>
					<select id="trussHolesType">
						<option value="вытянутые">вытянутые</option>						
						<option value="круги">круги</option>	
					</select>
				</td>
			</tr>
			
			
			<tr class="truss">
				<td>Ширина:</td>
				<td>
					<input type="number" name="trussWidth" id="trussWidth" value="3000">
				</td>
			</tr>
			
			<tr class="truss">
				<td>Длина секции:</td>
				<td>
					<input type="number" name="sectLen" id="sectLen" value="2000">
				</td>
			</tr>
			
			<tr class="truss">
				<td>Кол-во секций:</td>
				<td><input type="number" id="arcCount" value="3"></td>
			</tr>
			
			<tr class="dome">
				<td>Диаметр купола:</td>
				<td>
					<input type="number" name="domeDiam" id="domeDiam" value="4000">
				</td>
			</tr>
			
			<tr>
				<td>Прогоны:</td>
				<td>
					<select id="progonProfile">
						<option value="40х20">40х20</option>
						<option value="40х40">40х40</option>
						<option value="60х30">60х30</option>
						<option value="60х40">60х40</option>
					</select>
				</td>
			</tr>
			
			<tr>
				<td>Высота:</td>
				<td><input type="number" id="height"value="2000"></td>
			</tr>
			
			<tr class="truss">
				<td>Колонны:</td>
				<td>
					<select id="columnProfile">
						<option value="60х60">60х60</option>
						<option value="80х80">80х80</option>
						<option value="100х100">100х100</option>
						<option value="100х200">100х200</option>
					</select>
				</td>
			</tr>
			
			<tr class="dome">
				<td>Поворотный сектор, град.:</td>
				<td><input type="number" id="doorArc"value="90"></td>
			</tr>
			
			
			<tr class="dome">
				<td>Цилиндрическое основание:</td>
				<td>
					<select id="cylinderBase">						
						<option value="нет">нет</option>
						<option value="есть">есть</option>
					</select>
				</td>
			</tr>
			
			
			<tr>
				<td>Покраска металла:</td>
				<td>
					<select id="metalPaint" size="1">
						<option value="порошок">порошок</option>
					</select>
				</td>
			</tr>
			
			<tr>
				<td>Цвет металла:</td>
				<td>
					<select id="metalColor" size="1">
						<!-- варианты цвета металла -->
						<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/metalColors.php" ?>
					</select>
				</td>
			</tr>
			
			<tr class="truss">
				<td>Толщина металла фермы:</td>
				<td><input type="number" id="trussThk" value="4"></td>
			</tr>

			</tbody>
	</table>	
			
	<h3>Параметры покрытия</h3>
	<table class="form_table">
		<tbody>
			<tr>
				<td>Тип:</td>
				<td>
					<select id="roofMat">
						<option value="сотовый поликарбонат">сотовый поликарбонат</option>
						<option value="монолитный поликарбонат">монолитный поликарбонат</option>
						<option value="профнастил">профнастил</option>
						<option value="нет">нет</option>
					</select>
				</td>
			</tr>
			
			<tr class="roofPar">
				<td>Толщина:</td>
				<td>
					<select id="roofThk">
						<option value="0.5" class="profSheetPar">0.5 мм</option>
						<option value="0.7" class="profSheetPar">0.7 мм</option>
						<option value="4" class="polyPar">4 мм</option>
						<option value="6" class="polyPar">6 мм</option>
						<option value="8" class="polyPar">8 мм</option>
						<option value="10" class="polyPar">10 мм</option>
					</select>
				</td>
			</tr>
			
			<tr class="roofPar">
				<td>Цвет:</td>
				<td>
					<select id="roofColor">
						<option value="прозрачный">прозрачный</option>
						<option value="бронза">бронза</option>
						<option value="опал">опал</option>
						<option value="зеленый">зеленый</option>
						<option value="синий">синий</option>
						<option value="голубой">голубой</option>
						<option value="бирюзовый">бирюзовый</option>
						<option value="желтый">желтый</option>
						<option value="оранжевый">оранжевый</option>
						<option value="красный">красный</option>
						<option value="гранат">гранат</option>
					</select>
				</td>
			</tr>
			
			<tr class="roofPar">
				<td>Соединительные профили:</td>
				<td>
					<select id="roofProfType">
						<option value="пластик">пластик</option>
						<option value="алюминий">алюминий</option>
					</select>
				</td>
			</tr>
			
			<tr>
				<td>Свес сбоку:</td>
				<td><input type="number" id="sideOffset" value="100"></td>
			</tr>
		
			<tr>
				<td>Свес спереди/сзади:</td>
				<td><input type="number" id="rackFaceOffset" value="100"></td>
			</tr>
			
		</tbody>
	</table>
</div>


<div id='carportSvg' style='display:none;'>
  <div data-type='f-3000'><?php include $GLOBALS['ROOT_PATH'].'/manufacturing/carport/files/f-3000.svg'; ?></div>
  <div data-type='f-3500'><?php include $GLOBALS['ROOT_PATH'].'/manufacturing/carport/files/f-3500.svg'; ?></div>
  <div data-type='f-4000'><?php include $GLOBALS['ROOT_PATH'].'/manufacturing/carport/files/f-4000.svg'; ?></div>
  <div data-type='f-4500'><?php include $GLOBALS['ROOT_PATH'].'/manufacturing/carport/files/f-4500.svg'; ?></div>
  <div data-type='f-5000'><?php include $GLOBALS['ROOT_PATH'].'/manufacturing/carport/files/f-5000.svg'; ?></div>
  <div data-type='f-5500'><?php include $GLOBALS['ROOT_PATH'].'/manufacturing/carport/files/f-5500.svg'; ?></div>
  <div data-type='f-6000'><?php include $GLOBALS['ROOT_PATH'].'/manufacturing/carport/files/f-6000.svg'; ?></div>
  <div data-type='f-6500'><?php include $GLOBALS['ROOT_PATH'].'/manufacturing/carport/files/f-6500.svg'; ?></div>
  <div data-type='f-7000'><?php include $GLOBALS['ROOT_PATH'].'/manufacturing/carport/files/f-7000.svg'; ?></div>
</div>