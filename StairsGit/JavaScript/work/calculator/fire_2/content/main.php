
<!-- Инструкции для пользователей -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/fire_2/content/manual.php" ?>

<!-- История версий -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/fire_2/content/history.php" ?>

<!-- Картинки, описание, комплектация -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/fire_2/content/description.php" ?>

<div id="totalResultWrap">
	<h2 class="raschet" onclick='recalculate()'>Общая стоимость лестницы</h2>
	<div id="totalResult" class="toggleDiv number"></div>
</div>

<!-- О компании -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/fire_2/content/about.php" ?>

<div id="mainViewWrap">
	<h2 class="raschet" onclick='recalculate()'>Основные размеры лестницы</h2>
	<canvas id='mainView' class="toggleDiv">Обновите браузер</canvas>
</div>

<div id="mainImages"></div>


<!-- форма параметров лестницы-->
<?php include $GLOBALS['ROOT_PATH']."/calculator/fire_2/forms/carcas_form.php" ?>

<!--форма доставка, сборка-->
<?php include $GLOBALS['ROOT_PATH']."/calculator/fire_2/forms/assemblingForm.php" ?>

<!--данные для производства-->
<?php include $GLOBALS['ROOT_PATH']."/manufacturing/general/include_areas/production_data.php" ?>

