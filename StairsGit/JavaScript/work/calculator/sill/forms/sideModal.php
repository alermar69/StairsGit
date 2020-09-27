<div class="modal fade" id="sideModal">
	<div class="modal-dialog" role="document" style="width:700px">
		<div class="modal-content">
			<div class="modal-header">
			<h4 class="modal-title">Варианты боковин подстолья</h4>
			</div>

			<div class="modal-body">

				<button type="button" class="btn btn-primary applySelected">Применить</button>
				<br/>
				<div id="forgeBalsImg">
<?php 
	echo '<b>Симметричные</b><br>';
	$amt = 13;
	$path = '/images/calculator/table/side/sym/';
	for($i=1; $i <= $amt; $i++){
		$name = $i;
		if($i < 10) $name = "0".$name;
		echo "<div data-itemName=". $name ." class='modalItem'> <img src=".$path.$name.".jpg></div>";
	};
	
	echo '<br><b>Односторонние</b><br>';
	$amt = 10;
	$path = '/images/calculator/table/side/asym/';
	for($i=1; $i <= $amt; $i++){
		$name = "1" . $i;
		if($i < 10) $name = "10" . $i;
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