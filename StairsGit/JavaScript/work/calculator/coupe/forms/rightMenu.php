<div id="rightMenuWrapper" class="noPrint">
<div id="rightMenuShow">&raquo;</div>
<div id="rightMenuResizer"></div>
<div class="tabs" id="rightMenu">
	<ul>		
		<li>Секции</li>
		<li>Полки</li>
		<li>Двери</li>
		<li>Стены</li>
		<li>Размеры</li>
	</ul>
	<div>

	<!-- форма параметров секций шкафа -->
	<div id="wrSect">
			<?$APPLICATION->IncludeComponent(
				"bitrix:main.include",
				".default",
				Array(
					"AREA_FILE_SHOW" => "file",
					"PATH" => "/calculator/coupe/forms/wrSect.php",
					"EDIT_TEMPLATE" => ""
				)
			);?>
		</div>
		
	<!-- форма параметров наполнения шкафа -->
	<div id="wrContentForm">
			<?$APPLICATION->IncludeComponent(
				"bitrix:main.include",
				".default",
				Array(
					"AREA_FILE_SHOW" => "file",
					"PATH" => "/calculator/coupe/forms/wrContent.php",
					"EDIT_TEMPLATE" => ""
				)
			);?>
		</div>
		
	<!-- форма параметров дверей -->
	<div id="wrContentForm">
			<?$APPLICATION->IncludeComponent(
				"bitrix:main.include",
				".default",
				Array(
					"AREA_FILE_SHOW" => "file",
					"PATH" => "/calculator/coupe/forms/wrDoors.php",
					"EDIT_TEMPLATE" => ""
				)
			);?>
		</div>
		
	<!-- Форма ввода параметров стен-->
		<div id="wallsFormDiv">

			Шаблон:
				<select id="wallsTemplate_wr" size="1">
					<option value="стена">стена</option>
					<option value="левый угол">левый угол</option>
					<option value="правый угол">правый угол</option>
					<option value="прямая ниша">прямая ниша</option>
					<option value="левая ниша">левая ниша</option>
					<option value="правая ниша">правая ниша</option>
					<option value="по ширине">по ширине комнаты</option>
					<option value="нет">нет</option>
				</select>


			<?$APPLICATION->IncludeComponent(
				"bitrix:main.include",
				".default",
				Array(
					"AREA_FILE_SHOW" => "file",
					"PATH" => "/calculator/walls/forms/walls_form.php",
					"EDIT_TEMPLATE" => ""
				)
			);?>
		<label for="staircaseHeight">Высота потолка </label>
		<input type="number" id="staircaseHeight" value="3000" step="100"><br>
		
		<label for="floorThickness">Толщина перекрытия </label>
		<input type="number" id="floorThickness" value="300" step="10"><br>
			
		<h4>Позиция шкафа</h4>
		<label for="staircasePosX">Смещение по X</label>
		<input type="number" id="staircasePosX" value="0" step="100"><br>

		<label for="staircasePosX">Смещение по Y</label>
		<input type="number" id="staircasePosY" value="0" step="10"><br>

		<label for="staircasePosZ">Смещение по Z</label>
		<input type="number" id="staircasePosZ" value="0" step="100"><br>
		
		<label for="staircasePosZ">Поворот</label>
		<input type="number" id="rotation" value="0" step="5"><br>
		
		
		</div>

	<!-- Форма ввода параметров размеров-->
	<div id="dimFormDiv">

		<?$APPLICATION->IncludeComponent(
			"bitrix:main.include",
			".default",
			Array(
				"AREA_FILE_SHOW" => "file",
				"PATH" => "/calculator/general/forms/dimensionsForm.php",
				"EDIT_TEMPLATE" => ""
			)
		);?>

	</div>

	</div>
</div>
</div>