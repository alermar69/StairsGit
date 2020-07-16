
<div class='noPrint'>
<button id="addRow" class="btn btn-success" data-toggle="tooltip" title="Добавить строку">
	<i class="glyphicon glyphicon-plus"></i>
	<span>Строка</span>
</button>

<input type='number' id='rowAmt' value='0' style='display: none'>

</div>

<table class='form_table' id='mainForm'>
	<thead>
		<tr>
			<th>№</th>
			<th>Наименование</th>
			<th>Кол-во</th>
			<th>Цена ед.</th>
			<th>Сумма</th>
			<th class='noPrint'>Тип</th>
			<th class='noPrint cost'>Себестоимость</th>
			<th class='noPrint cost'>% металла</th>
			<th class='noPrint cost'>% дерева</th>
			<th class='noPrint cost'>% подрядчики</th>
			<th class='noPrint'></th>
		</tr>
	</thead>
	
	<tbody>
	</tbody>
</table>

<div id="totalSumm"></div>

<script type="text/javascript" src="forms/mainFormChange.js"></script>