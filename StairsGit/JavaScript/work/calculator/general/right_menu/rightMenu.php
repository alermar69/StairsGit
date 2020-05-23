<div id="rightMenuWrapper" class="noPrint">
<div id="rightMenuShow" class="btn btn-secondary btn-lg">
	<i class="fa fa-chevron-circle-right"></i>
</div>
<div id="rightMenuResizer"></div>
<div class="tabs" id="rightMenu">
	<ul>
		<li>Стены</li>
		<li>Проем</li>
		<li>Балюстрада</li>
		<li>Размеры</li>
		<li>Текстуры</li>
	</ul>
	<div>

	<!-- Форма ввода параметров стен-->
		<div id="wallsFormDiv">
			<?php include $GLOBALS['ROOT_PATH']."/calculator/walls/forms/walls_form.php" ?>
		</div>

	<!-- форма параметров проема -->
	<div id="topFloorForm">
			<?php include $GLOBALS['ROOT_PATH']."/calculator/walls/forms/floor_form.php" ?>
		</div>

	<!-- форма параметров балюстрады -->
	<div id="banisterForm">
			<?php include $GLOBALS['ROOT_PATH']."/calculator/banister/forms/banister_form.php" ?>
		</div>
		
	<!-- Форма ввода параметров размеров-->
	<div id="dimFormDiv">
		<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/dimensionsForm.php" ?>
	</div>
	
	<!-- Форма текстур обстановки -->
	<div id="texturesFormDiv">
		<?php include $GLOBALS['ROOT_PATH']."/calculator/general/textures/form.php" ?>
	</div>

	</div>
</div>
</div>