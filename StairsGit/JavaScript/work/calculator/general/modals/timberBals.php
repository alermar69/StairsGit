<div class="modal fade" id="timberBalsModal">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
			<h4 class="modal-title">Варианты деревянных балясин</h4>
			</div>

			<div class="modal-body">

				Применить для: 
				    <select size="1" class="balPosUnit">
						<option value="staircase">лестница</option>
						<option value="balustrade">балюстрада</option>
					</select>
					
				<button type="button" class="btn btn-primary applySelected">Применить</button>
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
				<br/>
				<div id="forgeBalsImg">
<?php 
	$start = 9;
	$amt = 26;
	$path = '/images/timberBal/jpg/';
	for($i=$start; $i <= $amt; $i++){
		$name = $i;
		if($i < 10) $name = "0".$name;
		echo "<div data-itemName=". $name ." class='modalItem'> <img src=".$path.$name.".jpg></div>";
	};
?>
	
				</div>

			</div>
			<div class="modal-footer">				
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
			</div>
		</div><!-- /.модальное окно-Содержание -->  
	</div><!-- /.модальное окно-диалог -->  
</div><!-- /.модальное окно --> 