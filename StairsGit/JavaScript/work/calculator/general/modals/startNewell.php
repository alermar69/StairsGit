<div class="modal fade" id="startNewellModal">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
			<h4 class="modal-title">Варианты стартовых столбов</h4>
			</div>

			<div class="modal-body">

				<button type="button" class="btn btn-primary applySelected">Применить</button>
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
				<br/>
				
				<div id="forgeBalsImg">
<?php 
	$amt = 8;
	$path = '/images/startNewell/jpg/';
	for($i=1; $i <= $amt; $i++){
		$name = $i;
		if($i < 10) $name = "0".$name;
		echo "<div data-itemName=". $name ." class='modalItem'> <img src=".$path.$name.".jpg></div>";
	};
?>				</div>

			</div>
			<div class="modal-footer">				
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
			</div>
		</div><!-- /.модальное окно-Содержание -->  
	</div><!-- /.модальное окно-диалог -->  
</div><!-- /.модальное окно --> 