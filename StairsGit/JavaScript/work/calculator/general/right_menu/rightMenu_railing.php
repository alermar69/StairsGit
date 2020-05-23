<div id="rightMenuWrapper">
<div id="rightMenuShow" class="btn btn-secondary btn-lg">
	<i class="fa fa-chevron-circle-right"></i>
</div>
<div class="tabs" id="rightMenu">
	<ul>
		<li>Бетон</li>
		<li>Ограждения</li>
		<li>Рутели</li>
		<li>Стены</li>
		<li>Размеры</li>
	</ul>
	<div>

	<!-- Форма ввода параметров бетонных лестниц-->
		<div id="carcasGeomFormDiv">
			<?php include $GLOBALS['ROOT_PATH']."/calculator/railing/forms/stairs_geom.php" ?>
		</div>

	<!--форма параметров ограждений -->
		<div id="railingGeomForm">
			<?php include $GLOBALS['ROOT_PATH']."/calculator/railing/forms/railing_geom.php" ?>

		</div>
	<!-- форма параметров сдвига рутелей -->
		<div id="wallsForm">
			<?php include $GLOBALS['ROOT_PATH']."/calculator/railing/forms/rutelMoove.php" ?>
		</div>
		
	<!-- Форма ввода параметров стен-->
		<div id="wallsFormDiv">
			<?php include $GLOBALS['ROOT_PATH']."/calculator/walls/forms/walls_form.php" ?>
		</div>

		
<!-- Форма ввода параметров размеров-->
	<div id="dimFormDiv">
		<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/dimensionsForm.php" ?>
	</div>
	</div>
</div>
</div>