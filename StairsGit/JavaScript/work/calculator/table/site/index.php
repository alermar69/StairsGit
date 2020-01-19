<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"><head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Калькулятор столов</title>
<link href="styles.css" type="text/css" rel="stylesheet">

</head>

<body>

<div class="container">

	<h1>Калькулятор столов</h1>

	<h2>Параметры</h3>
	
	<!-- Форма для lp-->
	<?php include "lpForm.php" ?>
	
	<!-- скрипт для lp внутри html -->
	<?php include "lpScript.php" ?>

	<h2>Результат расчета: </h2>
	
	<div id='result'></div>
	
	<h2>Дополнительные функции</h2>
	<button id="printTable">Рассчитать базовые цены моделей для сайта</button>
	<button id="startTest">Тест</button>
	<div id='result_all'></div>


</div>


<script type="text/javascript" src="/bitrix/templates/calc/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="testing.js"></script>

</body></html>