<button id='send_co'>Send Commercial Offer</button>

<div class="modal fade" id="commercialOfferModal">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h4 class="modal-title">Отправить КП</h4>
			</div>
			<div class="modal-body">
				<label for="co_subject">Тема</label>
				<input type="text" id='co_subject'>
				<br>
				<label for="co_body">Сообщение</label>
				<input type="text" id='co_body'>
				<br>
				<label for="co_client_email">Почта</label>
				<input type="text" id='co_client_email'>
				<br>
				<label for="co_attachment">КП</label>
				<input type="file" id='co_attachment'>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
				<button type="button" class="btn btn-primary" id="sendCommercialOffer" >Отправить</button>
			</div>
		</div>
	</div>
</div>

<script src="/calculator/general/forms/sendCommercialOfferForm.js"></script>