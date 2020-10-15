<h2 class="raschet">Основные размеры лестницы</h2>
<canvas id='mainView'>Обновите браузер</canvas>

<!-- форма параметров лестницы-->
<?php include $GLOBALS['ROOT_PATH']."/calculator/fire_2/forms/carcas_form.php" ?>

<!--форма доставка, сборка-->
<?php include $GLOBALS['ROOT_PATH']."/calculator/fire_2/forms/assemblingForm.php" ?>

</div> <!--end of .content-->

<!-- спецификация, расчет трудоемкости и сдельной оплаты -->
<?php include $GLOBALS['ROOT_PATH']."/manufacturing/general/calc_spec/pagePart.php" ?>

<div id="faq"></div>	
	<div id="drawings"></div>	
	<div id="works"></div>

<div class="content">
<div id="mainImages"></div>
<div id="result" style="display: none;"></div>

<div id="specificationList" style="display: none;">
<h2>Приблизительный расход материала</h2>

	<div id="materialNeed"></div>

</div>




<!-- <script type="text/javascript" src="calcSpec.js"></script>
<script type="text/javascript" src="/manufacturing/fire_2/calc_spec_2.0.js"></script> -->
