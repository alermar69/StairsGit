<table><tbody>
<tr><td>Шапка</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('headerContainer', 200)"/></td>
</tr>

<tr><td>История версий</td>
<td><input type="checkbox" onclick="showHideDiv('history', 200)"/></td>
</tr>
<tr><td>Инструкции</td>
<td><input type="checkbox" onclick="showHideDiv('manual', 200)"/></td>
</tr>

<tr><td>Каркас</td>
<td><input id="showCarcas" type="checkbox"/></td>
</tr>
<tr><td>Подступенки</td>
<td><input id="showRisers" type="checkbox" checked /></td>
</tr>

</tbody></table>

<!-- Кнопки загрузки/сохранения из файла -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/leftMenuButtons.php" ?>