<div>
<? $url = $_SERVER['REQUEST_URI'];
	//не показываем блок в разделе view
	if(!strpos($url, "view") && !strpos($url, "installation") && !strpos($url, "customers")){ ?>

<div class="noPrint">
<a href="/orders/calcs" target="_blank" id='searchOffers'><img src="/images/icons/BD_find.png" width="50px" data-toggle="tooltip" title="Поиск в базе"></a>
<img src="/images/icons/BD_add.png" width="50px" id='saveOfferModalShow' data-toggle="tooltip" title="Сохранить в базу">
<img src="/images/icons/BD_load.png" width="50px" id='loadFromBd' data-toggle="tooltip" title="Загрузить из базы">


<!-- отправка отчета об ошибке: кнопка + модальное окно + скрипт -->
<?php include $GLOBALS['ROOT_PATH']."/bugs/forms/sendBugForm.php" ?>

<?
global $USER;
if ($USER->IsAdmin() || in_array(9, $USER->GetUserGroupArray())) {
	echo '<button id="rewriteOffer" class="btn btn-danger">
		<i class="glyphicon glyphicon-retweet"></i>
		<span>Пересохранить</span>
	</button>';
	}
?>
<?php include $GLOBALS['ROOT_PATH'].'/calculator/quick_calc/form.php' ?>


<!-- проверка данных: модальное окно отчета + скрипт -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/validationReport.php" ?>

<!-- имя и описание расчета: модальное окно -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/offerNameForm.php" ?>

</div>

<?};?>
<!-- параметры для шапки кп -->
<? if ($template == 'calculator') { ?>
	<div class="kp_header-wrapper">
		<div class="kp_header">
			<div class='text-center h2 mt-5' data-input_id="orderName">Коммерческое предложение № <span></span></div>
			<div class='text-center h3 mt-5 changeInput' data-input_id="genitiveCaseCustomerName">для <span></span></div>
			<div class='text-center h3 mt-5 changeInput' data-input_id="kpDescription"><span></span></div>
			<div class="row">
				<div class="col-6 h5 mt-4 mb-3" data-input_id="orderDate">Дата составления: <span></span></div>
				<div class="col-6 h5 mt-4 mb-3" data-input_id="managerName">Руководитель проекта: <span></span></div>
			</div>
		</div>
	</div>
<? } if ($template == 'manufacturing' || $template == 'installation') { ?>
	<div class="pz_info printBlock">
		<?php include $GLOBALS['ROOT_PATH'].'/calculator/general/forms/orderDataForm.php' ?>
	</div>
<? } ?>

<div id='troubles' class='noPrint'>
	<div id='dataTroubles'></div>
	<div id='formsTroubles'></div>
</div>

<span style="display: none;" id="userName"><?if (isset($USER)) {echo $USER->GetLastName();}?></span>

<!-- информер -->
<?php include $GLOBALS['ROOT_PATH'].'/orders/libs/informer.php' ?>



<!--обмен данными с базой и через файлы-->
<!--<script type="text/javascript" src="/calculator/general/dataExchangeXml_3.1.js"></script>-->
<script type="text/javascript" src="/orders/calcs/actions.js?06082020"></script>
<script type="text/javascript" src="/calculator/general/exportOrderData.js"></script>

<!--скрипт обработки формы -->
<script type="text/javascript" src="/calculator/general/forms/orderFormChange.js"></script>
</div>