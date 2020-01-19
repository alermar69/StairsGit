<table><tbody>

	<tr>
		<td>Шапка</td>
		<td><input type="checkbox" checked="checked" onclick="showHideDiv('headerContainer', 200)"/></td>
	</tr>

	<tr>
		<td>Футер</td>
		<td><input type="checkbox" checked="checked" onclick="showHideDiv('footerText', 200)"/></td>
	</tr>

	<tr>
		<td>Подписи</td>
		<td><input type="checkbox" onclick="showHideDiv('contractFooter', 200)"/></td>
	</tr>
	
<tr><td>Правое меню</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('rightMenu', 200)"/></td>
</tr>

<tr><td>История версий</td>
<td><input type="checkbox" onclick="showHideDiv('history', 200)"/></td>
</tr>
<tr><td>Инструкции</td>
<td><input type="checkbox" onclick="showHideDiv('manual', 200)"/></td>
</tr>
<tr><td>Визуализация 3D</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('visualisation', 200)"/></td>
</tr>
<tr><td>Экран 1</td>
<td><input type="checkbox" checked onclick="$('.canvas canvas:eq(0)').toggle()"/></td>
</tr>
<tr><td>Экран 2</td>
<td><input type="checkbox" checked onclick="$('.canvas canvas:eq(1)').toggle()"/></td>
</tr>
<tr><td>Экран 3</td>
<td><input type="checkbox" checked onclick="$('.canvas canvas:eq(2)').toggle()"/></td>
</tr>
<tr><td>Описание</td>
<td><input type="checkbox" onclick="showHideDiv('descriptionWrap', 200)" /></td>
</tr>
<tr><td>Общая цена</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('totalResultWrap', 200)" /> </td>
</tr>
<tr><td>Сроки</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('productionTimeWrap', 200)" /> </td>
</tr>
<tr><td>О компании</td>
<td><input type="checkbox" onclick="showHideDiv('aboutWrap', 200)" /> </td>
</tr>
<tr><td>Шаблоны</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('templatesWrap', 200)" /> </td>
</tr>

<tr><td>Параметры каркаса</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('carcasFormWrap', 200)" /> </td>
</tr>
<tr><td>Параметры перил</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('perilaFormWrap', 200)" /> </td>
</tr>
<tr><td>Балюстрада</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('banisterСonstructForm', 200)" /> </td>
</tr>

<tr><td>Сборка</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('assemblingWrap', 200)" /> </td>
</tr>

<tr><td>Себестоимость</td>
<td> <input type="checkbox" onclick="showHideDiv('cost', 200)" /></td>
</tr>


</tbody></table>

<button id="makeAccepted">Запустить в работу</button>

<!-- Кнопки загрузки/сохранения из файла -->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/leftMenuButtons.php" ?>

<p>Ссылки: <br/>
<a href="/manufacturing/sideboard/" id="comLink" target="_blank">Производство</a><br/>
<a href="/installation/sideboard/" id="montLink" target="_blank">Монтаж</a><br/>
<button id="showPass">Показать пароль</button>
</p>

