<!-- Compare Modal -->
<div class="modal fade noSave" id="shapeModifyModal" tabindex="-1" role="dialog" aria-labelledby="shapeModifyModalLabel"
	aria-hidden="true">
	<div class="modal-dialog spec-compare" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">Изменить геометрию</h5>
				<div class='row'>
					<div class='col-md-1 text-right'>
						<button type="button" class="btn btn-secondary float-right" data-dismiss="modal"><span
								aria-hidden="true">&times;</span></button>
					</div>
				</div>
			</div>
			<div class="modal-body">
				<button class='btn btn-success' id='downloadModifyDxf'>Скачать DXF</button>
				<button class='btn btn-primary' id='uploadModifyDxf'>Загрузить DXF</button>
				<input type="file" name="dxfModifyFile" id="dxfModifyFile" style='display: none;'>
				<button class='btn btn-primary' id='openEditor'>Обновить</button>
				<button class='btn btn-primary' id='loadShapeFromEditor'>Применить</button>
				<div class='iframe-wrapper'>
					<!-- <iframe src="/jsketcher/sketcher.html" frameborder="0"></iframe> -->
				</div>
			</div>
		</div>
	</div>
</div>

<script src="/calculator/general/modals/shapeChangeFormChange.js"></script>