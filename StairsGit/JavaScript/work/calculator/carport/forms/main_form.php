<div id="carcasFormWrap">
	
	<h3>Общие параметры</h3>
	<table class="form_table">
		<tbody>
			<tr>
				<td>Геометрия:</td>
				<td>
					<select id="carportType" data-link="carport^carportType">
						<option value="двухскатный">двухскатный</option>
						<option value="односкатный">односкатный</option>
						<option value="консольный">консольный</option>
						<option value="консольный двойной">консольный двойной</option>
						<option value="купол">купол</option>
						<option value="многогранник">многогранник</option>
						<option value="сдвижной">сдвижной</option>
						<option value="четырехскатный">четырехскатный</option>
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
				<td>Поперечные балки:</td>
				<td>
					<select id="beamModel">
						<option value="сужающаяся">из листа сужающаяся</option>						
						<option value="постоянной ширины">из листа постоянной ширины</option>	
						<option value="ферма постоянной ширины">ферма постоянной ширины</option>	
						<option value="проф. труба">проф. труба</option>	
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
			
			<tr>
				<td>Количество граней:</td>
				<td>
					<input type="number" name="edgeAmt" id="edgeAmt" value="6">
				</td>
			</tr>
			
			<tr class="truss prof">
				<td>Ширина:</td>
				<td>
					<input type="number" name="width" id="width" value="3000">
				</td>
			</tr>
			
			<tr class="truss prof">
				<td>Длина секции:</td>
				<td>
					<input type="number" name="sectLen" id="sectLen" value="3000">
				</td>
			</tr>
			
			<tr class="truss prof">
				<td>Кол-во секций:</td>
				<td><input type="number" id="sectAmt" value="1"></td>
			</tr>
			
			<tr class="dome">
				<td>Диаметр:</td>
				<td>
					<input type="number" name="domeDiam" id="domeDiam" value="4000">
				</td>
			</tr>
			
			<tr>
				<td>Высота:</td>
				<td><input type="number" id="height"value="2000"></td>
			</tr>
			
			<tr>
				<td>Угол наклона кровли:</td>
				<td>
					<input type="number" id="roofAng" value="32">
				</td>
			</tr>
			
			<tr class="dome">
				<td>Поворотный сектор, град.:</td>
				<td><input type="number" id="doorAng"value="90"></td>
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
					<select id="carcasColor" size="1">
						<!-- варианты цвета металла -->
						<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/metalColors.php" ?>
					</select>
				</td>
			</tr>
			
			<tr>
				<td>Крепление:</td>
				<td>
					<select id="fixType">
						<option value="фланцы">фланцы</option>
						<option value="бетон">заливка бетоном</option>
						<option value="винтовые сваи">винтовые сваи</option>
					</select>
				</td>
			</tr>

			</tbody>
	</table>
	
	<h3>Сечения элементов</h3>
	<table class="form_table">
		<tbody>
			<tr>
				<td>Сечения:</td>
				<td>
					<select id="profTypes">
						<option value="расчетные">расчетные</option>
						<option value="задаются">задаются</option>
					</select>
				</td>
			</tr>
			
			<tr>
				<td>Прогоны:</td>
				<td>
					<select id="progonProf">
						<option value="40х20">40х20</option>
						<option value="40х40">40х40</option>
						<option value="60х30">60х30</option>
						<option value="60х40">60х40</option>
						<option value="80х40">80х40</option>
					</select>
				</td>
			</tr>
			
			<tr>
				<td>Стропила:</td>
				<td>
					<select id="beamProf">
						<option value="40х20">40х20</option>
						<option value="40х40">40х40</option>
						<option value="60х30">60х30</option>
						<option value="60х40">60х40</option>
						<option value="80х40">80х40</option>
						<option value="100х50">100х50</option>
						<option value="120х60">120х60</option>
					</select>
				</td>
			</tr>
			
			<tr class="truss">
				<td>Продольные балки:</td>
				<td>
					<select id="beamProf2">
						<option value="60х60">60х60</option>
						<option value="80х80">80х80</option>
						<option value="100х100">100х100</option>
						<option value="120х120">120х120</option>
					</select>
				</td>
			</tr>
			
			<tr class="truss">
				<td>Толщина ребра фермы:</td>
				<td><input type="number" id="trussThk" value="4"></td>
			</tr>
			
			<tr class="dome">
				<td>Макс. шаг прогонов:</td>
				<td><input type="number" id="progonMaxStep"value="800"></td>
			</tr>
			
			
			<tr class="truss">
				<td>Колонны:</td>
				<td>
					<select id="columnProf">
						<option value="60х60">60х60</option>
						<option value="80х80">80х80</option>
						<option value="100х100">100х100</option>
						<option value="120х120">120х120</option>
						<option value="100х200">100х200</option>
					</select>
				</td>
			</tr>
			
			<tr class="truss">
				<td>Опуск фермы:</td>
				<td><input type="number" id="trussBotLedge" value="0"></td>
			</tr>
			
		</tbody>
	</table>
			
	<h3>Кровля</h3>
	<table class="form_table">
		<tbody>
			<tr>
				<td>Тип:</td>
				<td>
					<select id="roofMat">
						<option value="сотовый поликарбонат">сотовый поликарбонат</option>
						<option value="монолитный поликарбонат">монолитный поликарбонат</option>
						<option value="профнастил">профнастил</option>
						<option value="металлочерепица">металлочерепица</option>
						<option value="нет">нет</option>
					</select>
				</td>
			</tr>
			
			<tr class="roofPar">
				<td>Толщина:</td>
				<td>
					<select id="roofThk">						
						<option value="4" class="polyPar">4 мм</option>
						<option value="6" class="polyPar">6 мм</option>
						<option value="8" class="polyPar">8 мм</option>
						<option value="10" class="polyPar">10 мм</option>
						<option value="0.5" class="profSheetPar">0.5 мм</option>
						<option value="0.7" class="profSheetPar">0.7 мм</option>
					</select>
				</td>
			</tr>
			
			<tr class="roofPar polyPar">
				<td>Цвет поликарбоната:</td>
				<td>
					<select id="roofPlastColor">
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
			
			<tr class="roofPar profSheetPar">
				<td>Цвет профлиста:</td>
				<td>
					<select id="roofMetalColor">
						<!-- варианты цвета профлиста -->
						<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/metalSheetColors.php" ?>
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
				<td><input type="number" id="frontOffset" value="1000"></td>
			</tr>
			
			<tr class="roofPar">
				<td>Зашитый фронтон:</td>
				<td>
					<select id="frontCover">
						<option value="нет">нет</option>
						<option value="есть">есть</option>
					</select>
				</td>
			</tr>
			
		</tbody>
	</table>
	
	<h3>Стены</h3>
	<table class="form_table">
		<tbody>
			<tr>
				<td>Тип:</td>
				<td>
					<select id="wallMat">
						<option value="сотовый поликарбонат">сотовый поликарбонат</option>
						<option value="монолитный поликарбонат">монолитный поликарбонат</option>
						<option value="профнастил">профнастил</option>
						<option value="нет">нет</option>
					</select>
				</td>
			</tr>
			
			<tr class="wallPar">
				<td>Толщина:</td>
				<td>
					<select id="wallThk">						
						<option value="4" class="polyPar">4 мм</option>
						<option value="6" class="polyPar">6 мм</option>
						<option value="8" class="polyPar">8 мм</option>
						<option value="10" class="polyPar">10 мм</option>
						<option value="0.5" class="profSheetPar">0.5 мм</option>
						<option value="0.7" class="profSheetPar">0.7 мм</option>
					</select>
				</td>
			</tr>
			
			<tr class="wallPar">
				<td>Цвет:</td>
				<td>
					<select id="wallColor">
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
			
			<tr class="wallPar">
				<td>Соединительные профили:</td>
				<td>
					<select id="wallProfType">
						<option value="пластик">пластик</option>
						<option value="алюминий">алюминий</option>
					</select>
				</td>
			</tr>
			
			<tr class="wallPar">
				<td>Высота стен:</td>
				<td><input type="number" id="wallHeight" value="1000"></td>
			</tr>
			
			<tr class="wallPar">
				<td><img src="/images/calculator/columnPos/004.jpg" width="250px" id="columnPos_img"></td>
				<td>
					<label id="isWall1_label" style=""><input type="checkbox" id="isWall1">1<br></label>
					<label id="isWall2_label" style=""><input type="checkbox" id="isWall2">2<br></label>
					<label id="isWall3_label" style=""><input type="checkbox" id="isWall3">3<br></label>
					<label id="isWall4_label" style=""><input type="checkbox" id="isWall4">4<br></label>
					<label id="isWall5_label" style=""><input type="checkbox" id="isWall5">5<br></label>
					<label id="isWall6_label" style=""><input type="checkbox" id="isWall6">6<br></label>
					<label id="isWall7_label" style=""><input type="checkbox" id="isWall7">7<br></label>
					<label id="isWall8_label" style=""><input type="checkbox" id="isWall8">8<br></label>
				</td>
			</tr>
			
		</tbody>
	</table>
</div>