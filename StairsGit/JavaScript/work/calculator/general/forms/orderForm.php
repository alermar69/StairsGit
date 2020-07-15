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

<ul class="pz_info printBlock">
	<input type="number" id='currentOrderId' hidden>
	<li>Номер предложения: <input type="text" value="" id="orderName" readonly></li>
	<li>Дата составления: <input type="date" value="2000-01-01" id="orderDate"></li>
	<li>Адрес объекта: <input type="text" value="к/п Гринфилд" id = "adress"></li>
	<li>Руководитель проекта:
		<select size="1" id="managerName">
			<option value="Константин Лащиновский">Константин Лащиновский</option>
			<option value="Андрей Панков">Андрей Панков</option>
			<option value="Артур Саркисян">Артур Саркисян</option>
			<option value="Алексей Маслов">Алексей Маслов</option>
			<option value="Дубровский Сергей">Дубровский Сергей</option>
			<option value="Пилипенко Сергей">Пилипенко Сергей</option>
			<option value="Сынжерян Дмитрий">Сынжерян Дмитрий</option>
			<option value="Сергей Романов">Сергей Романов</option>
			<option value="Константин Кондратенко">Константин Кондратенко</option>
			<option value="Максим Петренко">Максим Петренко</option>			
			<option value="Станислав Синельников">Станислав Синельников</option>
			<option value="Алексей Котельников">Алексей Котельников</option>
			<option value="Артем Николаев">Артем Николаев</option>
			<option value="Алексей Степин">Алексей Степин</option>
			
			<option value="Константин Симбирев">Константин Симбирев</option>
			<option value="Кирилл Янкин">Кирилл Янкин</option>
			<option value="Иван Русских">Иван Русских</option>
			<option value="Владислав Господариков">Владислав Господариков</option>
			<option value="Сергей Блескин">Сергей Блескин</option>
			<option value="Владимир Родионов">Владимир Родионов</option>
			<option value="Кудашкин Михаил">Кудашкин Михаил</option>
			<option value="Эдуард Мирзоян">Эдуард Мирзоян</option>
			<option value="Феликс Барсегян">Феликс Барсегян</option>
			<option value="Максим Быков">Максим Быков</option>

		</select>
	</li>

	<li>Клиент: <input type="text" value="" id = "customerName"></li>
	<li>E-mail клиента: <input type="text" value="" id = "customerMail"></li>

</ul>

<div id='troubles' class='noPrint'>
	<div id='dataTroubles'></div>
	<div id='formsTroubles'></div>
</div>

<span style="display: none;" id="userName"><?if (isset($USER)) {echo $USER->GetLastName();}?></span>

<!-- информер -->
<?php include $GLOBALS['ROOT_PATH'].'/orders/libs/informer.php' ?>



<!--обмен данными с базой и через файлы-->
<!--<script type="text/javascript" src="/calculator/general/dataExchangeXml_3.1.js"></script>-->
<script type="text/javascript" src="/orders/calcs/actions.js?23012020"></script>
<script type="text/javascript" src="/calculator/general/exportOrderData.js"></script>

<!--скрипт обработки формы -->
<script type="text/javascript" src="/calculator/general/forms/orderFormChange.js"></script>
