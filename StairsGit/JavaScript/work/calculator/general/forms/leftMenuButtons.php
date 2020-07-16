<button id="createBuildingTask">Стр. задание</button>
<button id="toSvg">Снимок</button>
<button id="validate">Проверить</button>
<button id="compareModalShow">Сравнить с другим</button>
<?
	if(strpos($GLOBALS["APPLICATION"]->GetCurPage(), "calculator")){
		echo '<button id="makeAccepted">Привязать к заказу</button>';
	};
?>
<button onclick="exportToObj($['vl_1']);">Сохранить OBJ</button>
<!-- Кнопки загрузки/сохранения из файла -->
<button id="saveIntoFile">Сохранить в файл</button>
<button onclick="$('#loadFile').click();">Загрузить из файла</button>
<p><input type="file" accept="text/json" id="loadFile" style="display:none"></p>