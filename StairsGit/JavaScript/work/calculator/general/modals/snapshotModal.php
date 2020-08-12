<!-- Compare Modal -->
<div class="modal fade noSave" id="snapshotModal" tabindex="-1" role="dialog" aria-labelledby="snapshotModalLabel"
	aria-hidden="true">
	<div class="modal-dialog spec-compare" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">Плоский снимок</h5>
				<div class='row'>
					<div class='col-md-1 text-right'>
						<button type="button" class="btn btn-secondary float-right" data-dismiss="modal"><span
								aria-hidden="true">&times;</span></button>
					</div>
				</div>
			</div>
			<div class="modal-body">
				Вид:
				<select class='svgViewType'>
					<option value="сверху">сверху</option>
					<option value="спереди">спереди</option>
					<option value="сзади">сзади</option>
					<option value="слева">слева</option>
					<option value="справа">справа</option>
					<option value="3d">3d</option>
				</select>
				<br>
				Режим вставки (в разработке):
				<select name="" id="" disabled>
					<option value="">Заменить</option>
					<option value="">Добавить</option>
				</select><br>
				Невидимые линии (в разработке): <input type="checkbox" name="" id="" checked disabled>
				<br>
				<button class="btn btn-primary" id='makeSVGFromViewport'>Применить</button>
			</div>
		</div>
	</div>
</div>