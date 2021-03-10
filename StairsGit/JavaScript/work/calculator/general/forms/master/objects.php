<div class="modal fade" id="master_modal_obj">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">Экспресс расчет</h4>
			</div>
			<div class="modal-body">
				
				
				<table class="form_table" ><tbody>

					<tr><td>Изделия:</td> <td> 
						<select id="ms_model" size="1">
							<option value="Sill">подоконники</option>
						</select>
					</td></tr>
					
					<tr>
						<td>Количество:</td> 
						<td><input id="ms_itemAmt" type="number" value="1"></td>
					</tr>
					
					<tr><td>Геометрия:</td> <td> 
						<select id="ms_shapeType" size="1">
							<option value="прямоугольник">прямоугольник</option>
							<option value="по чертежу">по чертежу</option>
							<option value="по шаблону">по шаблону</option>
							<option value="по шаблону (криволин.)">по шаблону (криволин.)</option>
						</select>
					</td></tr>

				</tbody> </table>
				
				
				<h3>Параметры изделий</h3>
				<table class="form_table" id="ms_itemsPar"><tbody>
					<tr>
						<th>Длина</th>
						<th>Ширина</th>
						<th>Толщина</th>
						<th>Количество</th>
						<th></th>
					</tr>
					
					<tr class="objectRow">
						<td><input class="itemLen" type="number" value="1000"></td>
						<td><input class="itemWidth" type="number" value="300"></td>
						<td><input class="itemThk" type="number" value="40"></td>
						<td><input class="itemAmt" type="number" value="1"></td>
						<td class="removeRow" style="text-align: center">
							<button class="btn btn-outline-danger" style="margin: 2px" data-toggle="tooltip" title="Удалить" data-original-title="Удалить">
								<i class="fa fa-trash-o"></i>
							</button>
						</td>
					</tr>
		
				</tbody></table>
				<div style="margin-top: 5px;">
					<button type="button" class="btn btn-success" id="ms_itemsParAdd">
						<i class="fa fa-plus"></i>
						Добавить
					</button>
					
					<button type="button" class="btn btn-primary" id="ms_itemsPriceRefresh">
						<i class="fa fa-refresh"></i>
						Обновить
					</button>
					
				</div>
				<h3>Цена:</h3>
				<div id="ms_calc_result"></div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" id='ms_createObjects'>Применить</button>
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
			</div>
		</div>
	</div>
</div>

<script src="/calculator/general/forms/master/objects.js"></script>