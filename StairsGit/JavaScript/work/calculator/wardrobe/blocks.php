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
<td><input type="checkbox" id="showVl_2" /></td>
</tr>
<tr><td>Экран 3</td>
<td><input type="checkbox" id="showVl_3" /></td>
</tr>


<tr><td>Картинки</td>
<td><input type="checkbox" onclick="showHideDiv('mainImages', 200)" /></td>
</tr>
<tr><td>Описание</td>
<td><input type="checkbox" onclick="showHideDiv('description', 200)" /></td>
</tr>
<tr><td>Комплектация</td>
<td>  <input type="checkbox" onclick="showHideDiv('complect', 200)" /></td>
</tr>
<tr><td>Общая цена</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('totalResult', 200)" /> </td>
</tr>
<tr><td>О компании</td>
<td><input type="checkbox" onclick="showHideDiv('about', 200)" /> </td>
</tr>
<tr><td>Параметры каркаса</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('carcasForm', 200)" /> </td>
</tr>
<tr><td>Технологические параметры</td>
<td><input type="checkbox" onclick="showHideDiv('manufacturingParams', 200)" /> </td>
</tr>

<tr><td>Параметры перил</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('perilaForm', 200)" /> </td>
</tr>
<tr><td>Параметры балюстрады</td>
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

<tr><td>Спецификация</td>
<td> <input type="checkbox" onclick="showHideDiv('specificationList', 200)" /></td>
</tr>
</tbody></table>


<!-- Кнопки загрузки/сохранения из файла -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/leftMenuButtons.php" ?>