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
	
<tr><td>Описание</td>
<td><input type="checkbox" checked="checked" onclick="showHideDiv('description', 200)"/></td>
</tr>


<tr><td>История версий</td>
<td><input type="checkbox" onclick="showHideDiv('history', 200)"/></td>
</tr>
<tr><td>Инструкции</td>
<td><input type="checkbox" onclick="showHideDiv('manual', 200)"/></td>
</tr>
<tr><td>Узлы</td>
<td><input type="checkbox" onclick="showHideDiv('units', 200)"/></td>
</tr>

</tbody></table>

<!-- кнопки -->
<?php include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/leftMenuButtons.php" ?>

<p>Ссылки: <br/>
<a href="/customers/metal/" id="customerLink" target="_blank">Клиенту</a><br/>
<a href="/calculator/metal/" id="comLink" target="_blank">КП</a><br/>
<a href="/manufacturing/metal/" id="manLink" target="_blank">Производство</a><br/>
<a href="/installation/metal/" id="montLink" target="_blank">Монтаж</a><br/>
<a href="/orders/docs/" id="docLink" target="_blank">Договор</a><br/>

</p>