<table><tbody>
<tr><td>Шапка</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('headerContainer', 200)"/></td>
</tr>
<tr><td>Подпись</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('footerText', 200)"/></td>
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

<!-- Кнопки загрузки/сохранения из файла -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/leftMenuButtons.php" ?>