<div id="rightMenuWrapper">
<div id="rightMenuShow">&raquo;</div>
<div class="tabs" id="rightMenu">
	<ul>
		<li>Размеры</li>
		<li>Стены</li>
		<li>Выступы</li>
		<li>Текстуры</li>
	</ul>
	<div>

	<!-- Форма ввода параметров размеров-->
	<div id="dimFormDiv">

		<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/dimensionsForm.php" ?>

	</div>
	
	<!-- Форма ввода параметров стен-->
		<div id="wallsFormDiv">
			<?php include $GLOBALS['ROOT_PATH']."/calculator/walls/forms/walls_form.php" ?>
		</div>
		
	<!--форма параметров выступов -->
		<div id="ledgeForm">

			<?php include $GLOBALS['ROOT_PATH']."/calculator/walls/forms/ledges_form.php" ?>

		</div>
		
	<!-- Форма текстур обстановки -->
	<div id="texturesFormDiv">

		<?php include $GLOBALS['ROOT_PATH']."/calculator/general/textures/form.php" ?>

	</div>

	</div>
</div>
</div>