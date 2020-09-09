<div>
	<ul class="nav nav-pills mb-3" id="objectsTab" role="tablist" style='background-color: white;position: sticky;top: 0;'>
		<li class="nav-item">
			<a class="nav-link active" id="objectsTableTab-tab" data-toggle="tab" href="#objectsTableTab" role="tab" aria-controls="objectsTableTab" aria-selected="true">Список</a>
		</li>
		<li class="nav-item">
			<a class="nav-link" id="objectsParamsTab-tab" data-toggle="tab" href="#objectsParamsTab" role="tab" aria-controls="objectsParamsTab" aria-selected="false">Параметры</a>
		</li>
		<li>
			<button style='margin-left: 5px;' type="button" class="btn btn-primary" id="applyObjProps">Применить</button>
		</li>
	</ul>
	<div class="tab-content">
		<div class="tab-pane active" id="objectsTableTab">
			<div class='noSave'>
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
		</div>
		<div class="tab-pane" id="objectsParamsTab">
			<div id='additionalObjectProperties'>
				<input type="hidden" name="additionalObjectId" id='additionalObjectId'>
				<h4>Параметры <span id='additionalObjectTitle'></span></h4>
				<div id='additionalObjectBody'>
					
				</div>
			</div>
		</div>
	</div>
</div>

<!-- <div class="modal noSave fade" id="additionalObjectProperties">
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
		</div>
	</div>
</div> -->

<div id='canopySvg' style='display: none;'>
  <div data-type='m-800'>
    <?php include $GLOBALS['ROOT_PATH'].'/calculator/general/scene/objects/files/canopy/m-800.svg'; ?>
  </div>
  <div data-type='m-1000'>
    <?php include $GLOBALS['ROOT_PATH'].'/calculator/general/scene/objects/files/canopy/m-1000.svg'; ?>
  </div>
</div>

<!-- <button class="showModal noPrint" data-modal="forgeModal" data-unit="balustrade">эскизы</button> -->