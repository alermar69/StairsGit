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


<tr><td>История версий</td>
<td><input type="checkbox" onclick="showHideDiv('history', 200)"/></td>
</tr>
<tr><td>Инструкции</td>
<td><input type="checkbox" onclick="showHideDiv('manual', 200)"/></td>
</tr>

<tr><td>Картинки</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('mainImages', 200)" /></td>
</tr>
<tr><td>Описание</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('description', 200)" /></td>
</tr>

<tr><td>Общая цена</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('totalResult', 200)" /> </td>
</tr>
<tr><td>О компании</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('about', 200)" /> </td>
</tr>
<tr><td>Расчет каркаса</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('carcasForm', 200)" /> </td>
</tr>

<tr><td>Сборка</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('assembling', 200)" /> </td>
</tr>

<tr><td>Себестоимость</td>
<td> <input type="checkbox" onclick="showHideDiv('cost', 200)" /></td>
</tr>

<tr><td>Спецификация</td>
<td> <input type="checkbox" onclick="showHideDiv('specificationList', 200)" /></td>
</tr>

</tbody></table>

<!-- кнопки -->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/leftMenuButtons.php" ?>

<p>Ссылки: <br/>
<a href="/manufacturing/fire_2/" id="comLink" target="_blank">Производство</a><br/>
<a href="/installation/fire_2/" id="montLink" target="_blank">Монтаж</a><br/>
<a href="old.php" id="oldVerLink" target="_blank">Старая версия</a>
</p>

