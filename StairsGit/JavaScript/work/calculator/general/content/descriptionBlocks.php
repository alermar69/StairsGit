<div class='description_save_buttons'>
	<button class='btn btn-success' id='savePreviewImages'>Сохранить картинки</button>
</div>
<div style=''>
	<div class="container">
		<h1>Превью</h1>
		<div id="previewImages"></div>
	</div>
</div>

<div class="modal" tabindex="-1" role="dialog" id='preview_generator_modal'>
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Превью для <span class='preview_generator_type'></span></h5>
        <button type="button" class="preview_generator_close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
	  	<div class="row">
			<div class="col-6">
	  			<div class='preview_generator-visualisation' id='preview_generator'></div>
			</div>
			<div class="col-6">
	  			<div class='preview_generator-menu' id='preview_generator_menu'></div>
			</div>
		</div>
      </div>
      <div class="modal-footer">
	  		<button class='preview_generator_add_image btn btn-secondary'>Добавить картинку</button>
			<button class='preview_generator_close btn btn-secondary'>Закрыть</button>
      </div>
    </div>
  </div>
</div>