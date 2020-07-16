<link href="/calculator/general/tablelib/theme.default.min.css" rel="stylesheet">
<link href="/calculator/general/tablelib/theme.blue.css" rel="stylesheet">
<script src="/calculator/general/tablelib/jquery.tablesorter.min.js"></script>
<script src="/calculator/general/tablelib/jquery.tablesorter.widgets.min.js"></script>
<link rel="stylesheet" href="/orders/libs/styles.css">
<script src="/orders/libs/table.js"></script>
<script src="/orders/libs/main.js"></script>
<script src="/orders/libs/loadData.js"></script>
<script src="/orders/libs/tableHeadFixer.js"></script>

<button class="btn btn-primary" id='showEditModal'>Шаблоны</button>

<!-- Поиск и изменение шаблона -->
<div class="modal fade" id="editCalcTempaltes">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">Шаблоны</h4>
			</div>
			<div class="modal-body">
				<div id='outputDiv' style='overflow: auto;max-height: 60vh;'></div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-success" id='selectTemplate'>Применить</button>
				<button type="button" class="btn btn-success" id='showCreateTemplateModal'>Создать</button>
				<button type="button" class="btn btn-danger" id='deleteTemplate'>Удалить</button>
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
			</div>
		</div><!-- /.модальное окно-Содержание -->
	</div><!-- /.модальное окно-диалог -->
</div><!-- /.модальное окно -->

<!-- Поиск и изменение шаблона -->
<div class="modal fade" id="calcCreationModal">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">Создание шаблона</h4>
			</div>
			<div class="modal-body">
				<div>
					Номер заказа:
					<input type="text" id='newTemplateOrderName'>
				</div>
				<div>
					Заголовок
					<input type="text" id='newTemplateTitle'>
				</div>
				<div>
					Описание
					<textarea name="newTemplateDescription" id="newTemplateDescription" cols="30" rows="10"></textarea>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-success" id='createTemplate'>Создать</button>
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
			</div>
		</div><!-- /.модальное окно-Содержание -->
	</div><!-- /.модальное окно-диалог -->
</div><!-- /.модальное окно -->

<script src="/calculator/quick_calc/quick_calc.js"></script>
