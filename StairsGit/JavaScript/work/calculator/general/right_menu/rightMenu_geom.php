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
	</ul>
	<div>

	<!-- Форма ввода параметров стен-->
		<div id="wallsFormDiv">
			<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/walls/forms/walls_form.php" ?>
		</div>

	<!-- форма параметров проема - нестандартная -->
	<div id="ledgeForm">
			<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/walls/forms/floor_form_geom.php" ?>
		</div>
		
	<!-- форма параметров балюстрады -->
	<div id="banisterForm">
			<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/banister/forms/banister_form.php" ?>
		</div>
		
	<!-- Форма ввода параметров размеров-->
	<div id="dimFormDiv">
		<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/dimensionsForm.php" ?>
	</div>

	</div>
</div>
</div>