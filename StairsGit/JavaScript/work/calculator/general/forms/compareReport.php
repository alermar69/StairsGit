<div class="modal fade" id="compareReport">
	<div class="modal-dialog" role="document" style="width:700px">
		<div class="modal-content">
			<div class="modal-header">
			<h4 class="modal-title">Проверка данных заказа</h4>
			</div>

			<div class="modal-body">

				Номер расчета: <input id='originOfferId' type='text'>
				<button type="button" class="btn btn-default" id='compareOffers'>Сравнить</button>
				<br/>
				<div id="compareResult"></div>

			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
			</div>
		</div><!-- /.модальное окно-Содержание -->  
	</div><!-- /.модальное окно-диалог -->  
</div><!-- /.модальное окно --> 

<!-- валидация перед запуском в работу -->
<script type="text/javascript" src="/calculator/general/validation.js"></script>