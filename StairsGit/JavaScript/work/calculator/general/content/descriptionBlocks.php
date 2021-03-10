<div class='description_save_buttons'>
	<button class='btn btn-primary' id='generateObjectsPreview'>Создать превью объектов <span id='generateObjectsPreviewProgress'></span></button>
	<button class='btn btn-success' id='savePreviewImages'>Сохранить картинки</button>
	<button class='btn btn-danger' id='deleteAllImages'>Удалить все картинки</button>
</div>
<div style=''>
	<div class="container">
		<div id="previewImages"></div>
	</div>
</div>

<div class="modal" tabindex="-1" role="dialog" id='preview_generator_modal'>
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Создание изображения для <span class='preview_generator_type'></span></h5>
        <button type="button" class="preview_generator_close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class='upload-image-wrapper' style='margin: 20px;'>
          <button class='btn btn-primary' id='uploadPreviewImage'>Загрузить картинку с компьютера</button>
          <button class='btn btn-secondary' id='loadFromFiles'>Добавить из файлов</button>
          <input type="file" id='imageUploader' name="" style='display: none;'>
        </div>
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

<div class="modal" tabindex="-1" role="dialog" id='uploadFromFile'>
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Выберите изображение для добавления</h5>
        <button type="button" data-dismiss="modal">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div id='uploadFromFileFiles'></div>
      </div>
    </div>
  </div>
</div>