<div class="modal fade" id="master_modal_railing">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">Конфигуратор бетонной лестницы</h4>
			</div>
			<div class="modal-body">
				<div id='railingMasterInputs'>
					<div class="form-group">
						<label for="railingStairGeometry">Геометрия</label>
						<select class="form-control" id="railingStairGeometry">
							<option value="Прямая">Прямая</option>
							<option value="Г-образная с площадкой">Г-образная с площадкой</option>
							<option value="Г-образная с забегом">Г-образная с забегом</option>
							<option value="П-образная с площадкой">П-образная с площадкой</option>
							<option value="П-образная с забегом">П-образная с забегом</option>
							<option value="П-образная трехмаршевая">П-образная трехмаршевая</option>
						</select>
					</div>
					<div class="form-group">
						<label for="railingStairTurn">Поворот</label>
						<select class="form-control" id="railingStairTurn">
							<option value="Правый">Правый</option>
							<option value="Левый">Левый</option>
						</select>
					</div>
					<div class="form-group">
						<h4>Параметры ступеней:</h4>
						<table class="form_table">
							<tbody>
									<tr>
										<th style="width: 20%;">Марш</th>
										<th>Кол-во прямых ступеней</th>
										<th>Подъем ступени</th>
										<th>Проступь</th>
										<th>Ступень</th>
									</tr>

									<tr class="marsh1">
										<td style="width: 20%;">Нижний</td>
										<td><input id="stairAmt1" type="number" value="5"></td>
										<td><input id="h1" type="number" value="180"></td>
										<td><input id="b1" type="number" value="260"></td>
										<td><input id="a1" type="number" value="300"></td>
									</tr>

									<tr class="marsh2">
										<td>Средний</td>
										<td><input id="stairAmt2" type="number" value="5"></td>
										<td><input id="h2" type="number" value="180"></td>
										<td><input id="b2" type="number" value="260"></td>
										<td><input id="a2" type="number" value="300"></td>
									</tr>

									<tr class="marsh3">
										<td>Верхний</td>
										<td><input id="stairAmt3" type="number" value="5"></td>
										<td><input id="h3" type="number" value="180"></td>
										<td><input id="b3" type="number" value="260"></td>
										<td><input id="a3" type="number" value="300"></td>
									</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" id='createConcreteStairs'>Применить</button>
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
			</div>
		</div>
	</div>
</div>

<script src="/calculator/general/forms/master/railing.js"></script>