<div id="carcasFormWrap">
	<h2 class="raschet">Характеристики изделия</h2>
	<div id="carcasForm" class="toggleDiv">
	
	<h4>1. Общие параметры:</h4>

		<table class="form_table" ><tbody>

			<tr><td>Назначение:</td> <td> 
				<select id="tableType" size="1">
					<option value="обеденный">обеденный</option>
					<option value="письменный">письменный</option>
					<option value="журнальный">журнальный</option>
					<option value="барный">барный</option>
				</select>
			</td></tr>
			
			<tr><td>Форма:</td> <td> 
				<select id="tableGeom" size="1">
					<option value="прямоугольный">прямоугольный</option>
					<option value="круглый">круглый</option>
					<option value="овальный">овальный</option>
				</select>
			</td></tr>
			

			<tr>
				<td>Ширина:</td> 
				<td><input id="width" type="number" value="1200"></td>
			</tr>
			
			<tr>
				<td>Глубина:</td> 
				<td><input id="depth" type="number" value="600"></td>
			</tr>
			
			<tr>
				<td>Высота:</td> 
				<td><input id="height" type="number" value="750"></td>
			</tr>
		
		</tbody><table>
		
		<h4>1. Столешница:</h4>

		<table class="form_table" ><tbody>

			<tr><td>Тип:</td> <td> 
				<select id="countertopType" size="1">
					<option value="цельная">цельная</option>
					<option value="двойная">двойная</option>
					<option value="двойная с вставкой">двойная с вставкой</option>
					<option value="нет">нет</option>
				</select>
			</td></tr>
			
			<tr>
				<td>Толщина:</td> 
				<td><input id="countertopThk" type="number" value="40"></td>
			</tr>
			
			<tr>
				<td>Зазор между частями столешницы:</td> 
				<td><input id="partsGap" type="number" value="10"></td>
			</tr>

			<tr>
				<td>Радиус скругления углов:</td> 
				<td><input id="cornerRad" type="number" value="20"></td>
			</tr>
			
			<tr>
				<td>Радиус скругления кромок:</td> 
				<td><input id="edgeRad" type="number" value="3"></td>
			</tr>

			
			<tr class="timberPaint"><td>Порода дерева:</td> <td> 
				<select id="timberType" size="1" >
					<!-- варианты покраски дерева -->
					<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/timberTypes.php" ?>		
				</select>
			</td></tr>
				
			<tr class="timberPaint"><td>Покраска дерева:</td> <td> 
				<select id="timberPaint" size="1" >
					<!-- варианты покраски дерева -->
					<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/timberPaint.php" ?>		
				</select>
			</td></tr>
			
			<tr class="timberPaint"><td>Поверхность дерева:</td> <td> 
				<select id="surfaceType" size="1" >
					<!-- варианты покраски дерева -->
					<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/surfaceTypes.php" ?>		
				</select>
			</td></tr>
			
			<tr class="timberPaint"><td>Шпаклевка:</td> <td> 
				<select id="fillerType" size="1" >
					<!-- варианты покраски дерева -->
					<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/fillerTypes.php" ?>		
				</select>
			</td></tr>
		
		</tbody></table>
		
		<h4>2. Подстолье:</h4>

		<table class="form_table" ><tbody>

			<tr><td>Модель:</td> <td> 
				<input id="legsModel" type="text" value="05">
				<button class="showModal noPrint" data-modal="sideModal">эскизы</button>
			</td></tr>
			
			<tr><td>Ноги:</td> <td> 
				<select id="legProf" size="1">
					<option value="40х40">40х40</option>
					<option value="60х60">60х60</option>
					<option value="80х80">80х80</option>
					<option value="100х100">100х100</option>
					<option value="60х30">60х30</option>
					<option value="80х40" selected>80х40</option>
					<option value="100х40">100х40</option>
					<option value="100х50">100х50</option>
				</select>
			</td></tr>
			
			<tr><td>Царги:</td> <td> 
				<select id="bridgeProf" size="1">
					<option value="60х30">60х30</option>
					<option value="40х80">40х80</option>
					<option value="80х40">80х40</option>
					<option value="40х100">40х100</option>
					<option value="нет">нет</option>
				</select>
			</td></tr>
			
			<tr><td>Полка:</td> <td> 
				<select id="shelf" size="1">
					<option value="нет">нет</option>
					<option value="есть">есть</option>
				</select>
			</td></tr>
			
			<tr>
				<td>Расстояние от полки до столешницы:</td> 
				<td><input id="shelfOffset" type="number" value="150"></td>
			</tr>
			
			<tr>
				<td>Задняя панель:</td>
				<td> 
					<select id="rearPanel" size="1">
						<option value="нет">нет</option>
						<option value="есть">есть</option>
					</select>
				</td>
			</tr>
			
			<tr>
				<td>Боковые пенели:</td>
				<td> 
					<select id="sidePanel" size="1">
						<option value="нет">нет</option>
						<option value="левая">левая</option>
						<option value="правая">правая</option>
						<option value="две">две</option>
					</select>
				</td>
			</tr>
			
			<tr>
				<td>Высота задней пенели:</td>
				<td><input id="rearPanelHeight" type="number" value="300"></td>
			</tr>
			
			<tr>
				<td>Свес столешницы боковой:</td>
				<td><input id="sideOverhang" type="number" value="20"></td>
			</tr>
			
			<tr>
				<td>Свес столешницы передний/задний:</td>
				<td><input id="frontOverhang" type="number" value="20"></td>
			</tr>
			
			<tr><td>Покраска металла:</td> <td> 
				<select id="metalPaint" size="1" >
					<!-- варианты покраски металла -->
					<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/metalPaint.php" ?>
				</select>
			</td></tr>
			
			<tr><td>Цвет металла:</td> <td> 
				<select id="metalColor" size="1" >
					<!-- варианты покраски металла -->
					<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/metalColors.php" ?>
				</select>
			</td></tr>
			
		</tbody></table>
		
		<h4>3. Тумбы:</h4>

		<table class="form_table" ><tbody>
		
			<tr><td>Тип:</td> <td> 
				<select id="drawersPosVert" size="1">
					<option value="нет">нет</option>
					<option value="подвесная">подвесная</option>
					<option value="напольная">напольная</option>
					<option value="на колесиках">на колесиках</option>					
				</select>
			</td></tr>
			
			<tr><td>Расположение:</td> <td> 
				<select id="drawersPosHor" size="1">
					<option value="слева">слева</option>
					<option value="справа">справа</option>
					<option value="две">две</option>					
				</select>
			</td></tr>
			
			<tr>
				<td>Отступ от столешницы:</td> 
				<td><input id="drawerOffset" type="number" value="150"></td>
			</tr>

			<tr>
				<td>Ширина тумбы полная:</td> 
				<td><input id="drawerWidth" type="number" value="400"></td>
			</tr>
			
			<tr>
				<td>Высота тумбы полная:</td> 
				<td><input id="drawerHeight" type="number" value="400"></td>
			</tr>
			
			<tr>
				<td>Количество ящиков:</td> 
				<td><input id="drawerAmt" type="number" value="3"></td>
			</tr>

			
			<tr><td>Тип ящиков:</td> <td> 
				<select id="drawersType" size="1">
					<option value="нет">нет</option>
					<option value="деревянные эконом">деревянные эконом</option>
					<option value="металлические эконом">металлические эконом</option>
					<option value="металлические премиум">металлические премиум</option>
					<option value="металлические премиум">металлические премиум</option>
				</select>
			</td></tr>
			
			<tr><td>Тип ручек:</td><td>
				<input id="handleModel" type="text" value="05">
				<button class="showModal noPrint" data-modal="sideModal">эскизы</button>
			</td></tr>
			
		</tbody></table>

	</div>
</div>
		
<!--Обработчик формы-->
<script type="text/javascript" src="forms/mainFormChange.js"></script>


