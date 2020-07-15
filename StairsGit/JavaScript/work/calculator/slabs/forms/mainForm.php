<div class='estimate' id='estimate_mat'>
	<h3>Изделия</h3>
	
	<div class='noPrint'>
		<button class="btn btn-success addRow" data-toggle="tooltip" title="Добавить строку">
			<i class="fa fa-plus"></i>
			<span>Строка</span>
		</button>
		<input type='number' class='rowAmt' id='rowAmt_mat' value='0' style='display: none'>
	</div>

	<table class='form_table estimateForm'>
		<thead>
			<tr>
				<th>№</th>
				<th>Наименование</th>
				<th style='min-width: 300px'>Параметры</th>
				<th>Кол-во</th>
				<th>Цена ед.</th>
				<th>Сумма</th>
				<th class='noPrint'>Тип</th>
				<th class='noPrint cost' style="display: none">Себестоимость</th>
				<th class='noPrint cost' style="display: none">% металла</th>
				<th class='noPrint cost' style="display: none">% дерева</th>
				<th class='noPrint cost' style="display: none">% подрядчики</th>
				<th class='noPrint'></th>
			</tr>
		</thead>
		
		<tbody>
		</tbody>
	</table>
	
	<h4>Покраска</h4>
	<table class='form_table'><tbody>
		
		<tr>
			<td>Цвет металла:</td>
			<td>
				<select id="metalPaintColor" size="1">
					<!-- варианты покраски металла -->
					<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/metalColors.php" ?>
					
				</select>
			</td>
		</tr>
	
		<tr class="timberPaint">
			<td>Покраска дерева:</td>
			<td>
				<select id="timberPaint" size="1">
					<!-- варианты покраски дерева -->
					<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/timberPaint.php" ?>
					<option value="76-2" class="lakColor">76 насыщенный (1:5)</option>
				</select>
			</td>
		</tr>
		
		<tr class="timberPaint">
			<td>Цвет дерева:</td>
			<td>
				<select id="timberPaintColor" size="1">
					<!-- варианты покраски дерева -->
					<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/timberColors.php" ?>
				</select>
			</td>
		</tr>

		<tr class="timberPaint">
			<td>Поверхность дерева:</td>
			<td>
				<select id="surfaceType" size="1">
					<!-- варианты покраски дерева -->
					<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/surfaceTypes.php" ?>
				</select>
			</td>
		</tr>

		<tr class="timberPaint">
			<td>Шпаклевка:</td>
			<td>
				<select id="fillerType" size="1">
					<!-- варианты покраски дерева -->
					<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/fillerTypes.php" ?>
				</select>
			</td>
		</tr>
		
	</tbody></table>		

</div>

<!-- доставка, сборка -->
<?php include $GLOBALS['ROOT_PATH']."/calculator/general/forms/assemblingForm.php" ?>


<div class='estimate' id='estimate_works'>
	
	<div class='noPrint'>
		<button class="btn btn-success addRow" data-toggle="tooltip" title="Добавить строку">
			<i class="fa fa-plus"></i>
			<span>Строка</span>
		</button>
		<button class="btn btn-primary setWorksPrice" data-toggle="tooltip" title="Рассчитать стоимость доставки и сборки">
			<i class="fa fa-plus"></i>
			<span>Рассчитать</span>
		</button>

		<input type='number' class='rowAmt' id='rowAmt_works' value='0' style='display: none'>

	</div>

	<table class='form_table estimateForm'>
		<thead>
			<tr>
				<th>№</th>
				<th>Наименование</th>				
				<th>Кол-во</th>
				<th>Цена ед.</th>
				<th>Сумма</th>
				<th class='noPrint'>Тип</th>
				<th class='noPrint cost' style="display: none">Себестоимость</th>
				<th class='noPrint cost' style="display: none">% металла</th>
				<th class='noPrint cost' style="display: none">% дерева</th>
				<th class='noPrint cost' style="display: none">% подрядчики</th>
				<th class='noPrint'></th>
			</tr>
		</thead>
		
		<tbody>
		</tbody>
	</table>

</div>
<script type="text/javascript" src="forms/mainFormChange.js"></script>