<h2>Тестирование</h2>

<div id="testingInputs" class="toggleDiv">

	Режим:
	<select id="testingMode">
		<option value="без болтов">без болтов</option>
		<option value="болты Ф12">болты Ф12</option>
		<option value="дерево1">дерево1</option>
		<option value="дерево2">дерево2</option>
		<option value="критические ошибки">критические ошибки</option>
		<option value="размеры">размеры</option>
		<option value="спецификация">спецификация</option>
		<option value="спецификация вход">спецификация вход</option>
	</select>

	<button id="test_this" class='btn btn-primary'>Проверить текущую</button>
	<button id="test_set" class='btn btn-warning groupTesting'>Проверить группу</button>
	<button id="prevConfig" class='btn btn-success groupTesting'>Предыдущая</button>
	<button id="nextConfig" class='btn btn-success groupTesting'>Следующая</button>
	<button id="stopTesting" class='btn btn-danger groupTesting'>Стоп</button>
	
		<!--модальные окна для сравнения с версией инженера-->
	<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/modals/checkSpec.php" ?>
	
	<br/>
	
	Перебор конфигураций: 
	<select id="configGeneratorMode">
		<option value="нет">нет</option>
		<option value="синтетические">синтетические</option>
		<option value="сохраненные">сохраненные</option>
		<option value="последние">последние</option>
	</select>

	
	<!-- синтетические -->
	<div class='synthConfigs div-grey'>	
		№ <input id="configId" type="number" value="0"> <button id="setConfig">Применить</button>
		Кол-во конфигураций: <input id="configAmt" type="number" value="2"> 
		
		<!-- последние -->
		<div class='lastConfigs'>
			
			Тип поиска: 
			<select size="1" id="offersType">
				<option value="все">все</option>
				<option value="в работу">в работу</option>
				<option value="новые">новые</option>
			</select>
				
			<br/>
			Кол-во дней: <input type="number" id="daysAmt" value='2'> 
			<br/>
			Тестирование:
			<select size="1" id="testResult">
				<option value="все">все</option>
				<option value="не проверено">не проверено</option>
				<option value="не исправлено">не исправлено</option>
				<option value="ошибка первый">ошибка первый</option>
				<option value="ошибка последний">ошибка последний</option>
			</select>
			
			<button id="loadLastOffers" class='btn btn-success'>Загрузить данные</button>
			<br/>
			
			<div id="statDiv"></div>
			<div id='loadedConfigs' class="toggleDiv"></div>
		</div>
		
	</div>
	
	<!-- сохраненные -->
	<div class='savedConfigs div-grey'>
		Префикс: <input id="configPrefBd" type="text" value="met-"> 
		<br/>
		Начальная: <input id="configStartIndexBd" type="number" value="1"> 
		<br/>
		Кол-во конфигураций: <input id="configAmtBd" type="number" value="3"> 
		<br/>
	</div>
	

	
	<h4>Результаты теста: </h4>
	<div id="testResults" class="toggleDiv"></div>
	
	
	
</div>

<!--Обработчик формы-->
<script type="text/javascript" src="/manufacturing/general/testing/forms/mainFormChange.js"></script>
