<table><tbody>
<tr><td>Шапка</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('headerContainer', 200)"/></td>
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

<tr><td>Картинки</td>
<td><input type="checkbox" onclick="showHideDiv('mainImages', 200)" /></td>
</tr>
<tr><td>Описание</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('description', 200)" /></td>
</tr>
<tr><td>Комплектация</td>
<td>  <input type="checkbox" checked="checked" onclick="showHideDiv('complect', 200)" /></td>
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
<tr><td>Расчет перил</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('perilaForm', 200)" /> </td>
</tr>
<tr><td>Балюстрада</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('banisterСonstructForm', 200)" /> </td>
</tr>

<tr><td>Сборка</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('assembling', 200)" /> </td>
</tr>

<tr><td>Себестоимость</td>
<td> <input type="checkbox" onclick="showHideDiv('cost', 200)" /></td>
</tr>

<tr><td>Эскизы ограждений</td>
<td> <input type="checkbox" onclick="showHideDiv('marshRailingImages2D', 200);" /></td>
</tr>

<tr><td>Спецификация (комплектовка)</td>
<td> <input type="checkbox" checked="checked" onclick="showHideDiv('specificationList1', 200)" /></td>
</tr>

<tr><td>Спецификация (сборка)</td>
<td> <input type="checkbox" checked="checked" onclick="showHideDiv('specificationList2', 200)" /></td>
</tr>

<tr><td>Заготовки</td>
<td> <input type="checkbox" onclick="showHideDiv('poleList', 200)" /></td>
</tr>


</tbody></table>

<!-- кнопки -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/leftMenuButtons.php" ?>

<p>Ссылки: <br/>
<a href="/calculator/sideboard/" id="comLink" target="_blank">КП</a><br/>
<a href="/installation/sideboard/" id="montLink" target="_blank">Монтаж</a><br/>
<button id="showPass">Показать пароль</button>
</p>
