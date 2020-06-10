<div class='table-content' style='overflow: scroll; height: calc(100% - 40px)'>
	<h1>Дополнительные объекты</h1>
	<table class="form_table objectsTable" id='objectsTable'>
		<thead>
			<tr>
				<th>Тип</th>
				<th style="min-width: 190px">Позиция</th>
				<th>Цвет</th>
				<th style="min-width: 100px">Действия</th>
				<th style="min-width: 100px">Считать цену</th>
			</tr>
		</thead>
		<tbody id='objectsTableBody'>
		</tbody>
	</table>
</div>
<button id='addAdditionalObject'>Добавить объект</button>
<button id='redrawAdditionalObjects'>Обновить</button>

<div class="modal fade" id="additionalObjectProperties">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<input type="hidden" name="additionalObjectId" id='additionalObjectId'>
			<div class="modal-header">
				<h4 class="modal-title">Параметры <span id='additionalObjectTitle'></span></h4>
			</div>
			<div class="modal-body" id='additionalObjectBody'>
				
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" id="applyObjProps">Применить</button>
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
			</div>
		</div><!-- /.модальное окно-Содержание -->
	</div><!-- /.модальное окно-диалог -->
</div><!-- /.модальное окно -->

<div id='canopySvg' style='display: none;'>
  <div data-type='m-800'>
    <?php include $GLOBALS['ROOT_PATH'].'/calculator/general/scene/objects/files/canopy/m-800.svg'; ?>
  </div>
  <div data-type='m-1000'>
    <?php include $GLOBALS['ROOT_PATH'].'/calculator/general/scene/objects/files/canopy/m-1000.svg'; ?>
  </div>
</div>

<!-- <button class="showModal noPrint" data-modal="forgeModal" data-unit="balustrade">эскизы</button> -->