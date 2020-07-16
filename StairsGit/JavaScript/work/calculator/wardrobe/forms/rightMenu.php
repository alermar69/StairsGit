<div id="rightMenuWrapper">
<div id="rightMenuShow">&raquo;</div>
<div class="tabs" id="rightMenu">
	<ul>
		<li>Стены</li>
		<li>Выступы</li>
		<li>Проем</li>
		<li>Балюстрада</li>
		<li>Шкаф</li>
	</ul>
	<div>

	<!-- Форма ввода параметров стен-->
		<div id="wallsFormDiv">

			<?$APPLICATION->IncludeComponent(
				"bitrix:main.include",
				".default",
				Array(
					"AREA_FILE_SHOW" => "file",
					"PATH" => "/calculator/walls/forms/walls_form.php",
					"EDIT_TEMPLATE" => ""
				)
			);?>

		</div>

	<!--форма параметров выступов -->
		<div id="ledgeForm">

			<?$APPLICATION->IncludeComponent(
				"bitrix:main.include",
				".default",
				Array(
					"AREA_FILE_SHOW" => "file",
					"PATH" => "/calculator/walls/forms/ledges_form.php",
					"EDIT_TEMPLATE" => ""
				)
			);?>

		</div>
	<!-- форма параметров проема -->
	<div id="topFloorForm">
			<?$APPLICATION->IncludeComponent(
				"bitrix:main.include",
				".default",
				Array(
					"AREA_FILE_SHOW" => "file",
					"PATH" => "/calculator/banister/forms/floor_form.php",
					"EDIT_TEMPLATE" => ""
				)
			);?>
		</div>

	<!-- форма параметров балюстрады -->
	<div id="banisterForm">
			<?$APPLICATION->IncludeComponent(
				"bitrix:main.include",
				".default",
				Array(
					"AREA_FILE_SHOW" => "file",
					"PATH" => "/calculator/banister/forms/banister_form.php",
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
					"PATH" => "/calculator/wardrobe/forms/wrContent.php",
					"EDIT_TEMPLATE" => ""
				)
			);?>
		</div>

	</div>
</div>
</div>