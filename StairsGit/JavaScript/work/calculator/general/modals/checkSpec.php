<button type="button" class="btn btn-primary" id='openSpecCompareModal' data-toggle="modal" data-target="#specCompareModal">Проверить спецификации</button>

<!-- Compare Modal -->
<div class="modal fade" id="specCompareModal" tabindex="-1" role="dialog" aria-labelledby="specCompareModalLabel" aria-hidden="true">
	<div class="modal-dialog spec-compare" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">Сравнение спецификаций</h5>
				<div class='row'>
					<div class='col-md-11'>
						<button type="button" class="btn btn-primary" id='openSpecCompareModal' data-toggle="modal" data-target="#specListModal">Выбрать другую спецификацию</button>
						<label for="checkbox">Показать все </label><input type="checkbox" name="showCompare" id="showCompare">
					</div>
					<div class='col-md-1 text-right'>
						<button type="button" class="btn btn-secondary float-right" data-dismiss="modal"><span
								aria-hidden="true">&times;</span></button>
					</div>
				</div>
			</div>
			<div class="modal-body">
				
				<div id='specCompareResult' class=''></div>
			</div>
		</div>
	</div>
</div>

<!-- Specs list Modal -->
<div class="modal fade" id="specListModal" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-dialog spec-list-modal" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">Сохраненные спецификации</h4>
			</div>
		  
			<button id="refresh" class="btn btn-primary">
					<i class="glyphicon glyphicon-refresh"></i>
					<span>Обновить</span>
				</button>
			<div class="modal-body" id="docsList">
				По данному заказу не найдено сохраненных спецификаций.
			</div>
			
			<div class="modal-footer">				
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
				<button type="button" class="btn btn-primary" id="applySpec" >Применить</button>
			</div>
			
		</div>
	</div>
</div>


<style>
	.specs-search{
		margin-bottom: 10px;
	}
	
	#specsList{
		max-height: 70vh;
		overflow-y: auto;
	}

	#specCompareResult{
		max-height: 70vh;
		overflow-y: auto;
	}

	.modal-dialog.spec-compare {
		width: 90% !important;
	}

	.modal-dialog.spec-list-modal{
		width: 60% !important;
	}

	.spec-list__spec{
		cursor: pointer;
	}

	.spec-list__spec:hover{
    background-color: rgba(0, 255, 243, 0.1);
	}

	.spec-list__spec .spec-status{
		width: 100px;
	}

	.compareToggleDiv {
		cursor: pointer;
	}

	.compareToggleDiv.closed:before {
		content: '\25bc';
		padding-left: 0.5em;
	}

	.compareToggleDiv.opened:before {
		content: '\25b2';
		padding-left: 0.5em;
	}

	.compare-table {
		width: 100%;
		margin-bottom: 10px;
	}

	.compare-table th,
	.compare-table td {
		padding: 15px;
		border-left: 1px solid #ddd;
		border-bottom: 1px solid #ddd;
	}
	.compare-table th{
		border-top: 1px solid #ddd;
	}
	.compare-table td:last-child {
		border-right: 1px solid #ddd;
	}
	.compare-table tr.equal {
		background-color: rgba(0, 255, 0, 0.15);
	}

	.compare-table tr.new {
		background-color: rgba(0, 200, 0, 0.1);
	}

	.compare-table tr.unequal {
		background-color: rgba(0, 0, 0, 0.05);
	}

	.compare-table tr.deleted {
		background-color: rgba(200, 0, 0, 0.1);
	}

	.compare-table td.diff {
		background-color: rgba(255, 0, 0, 0.15);
	}
</style>