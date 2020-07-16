<table><tbody>
<tr><td>Шапка</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('headerContainer', 200)"/></td>
</tr>
<tr><td>Подпись</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('footerText', 200)"/></td>
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
<tr><td>Визуализация 2D</td>
<td><input type="checkbox" onclick="showHideDiv('2d', 200)"/></td>
</tr>


</tbody></table>


<!-- Кнопки загрузки/сохранения из файла -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/leftMenuButtons.php" ?>

<p id="viewLink">Ссылка для монтажников</p>