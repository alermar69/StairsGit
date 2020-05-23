<div class="modal fade" id="textureModal">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
			<h4 class="modal-title">Варианты текстур</h4>
			</div>

			<div class="modal-body">

				Применить для: 
				    <select size="1" id="textureUnit">
						<option value="wallsMat">стены</option>
						<option value="floorMat">пол первый этаж</option>
						<option value="floorMat2">пол второй этаж</option>
						<option value="ceilMat">потолок</option>
					</select>
					
	
				<button type="button" class="btn btn-primary applySelected">Применить</button>
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
				
				<br/>
				Показать: 
				<select size="1" id="textureFilter">
					<option value="все">все</option>
					<option value="carpet" class="floor">ковролин</option>
					<option value="parquet" class="floor">паркет</option>
					<option value="laminat" class="floor">ламинат</option>
					<option value="timber" class="floor walls">дерево</option>
					<option value="wood" class="floor">дерево2</option>
					<option value="stone" class="floor">камень</option>
					<option value="marf" class="floor">камень2</option>
					<option value="tiling" class="floor">плитка</option>
					<option value="plitka" class="floor walls">плитка2</option>
					<option value="road_brick" class="floor">тр. плитка</option>
					<option value="tr_plitka" class="floor">тр. плитка2</option>
					
					<option value="brick" class="walls">кирпич</option>
					<option value="concrete" class="walls">бетон</option>
					<option value="wallPaper" class="walls">обои</option>
					<option value="shtukaturka" class="walls">штукатурка</option>
					<option value="WoodenPlanks" class="walls">вагонка</option>
					
					
				</select>
				
				<br/>
				<div id="textureImg">
					<div class='walls'>
						<?php 
							$dir = '/calculator/images/textures/walls/';
							$files = scandir($GLOBALS['ROOT_PATH'].$dir);
							
							foreach($files as $key=>$file){
								if($file != "." && 
									$file != ".." &&
									!is_dir($GLOBALS['ROOT_PATH']. $dir . DIRECTORY_SEPARATOR . $file)
									){
										$name = str_replace(".jpg", "", $file);
										echo "<div data-itemName=". $name . " class='modalItem'> <img src='' data-src=".$dir.$file."><div class='title'>". $name . "</div></div>";
									};
							};
						?>						
					</div>
					
					<div class='floor'>
						<?php 
							$dir = '/calculator/images/textures/floor/';
							$files = scandir($GLOBALS['ROOT_PATH'].$dir);
							foreach($files as $file){
								if($file != "." && 
									$file != ".." &&
									!is_dir($GLOBALS['ROOT_PATH']. $dir . DIRECTORY_SEPARATOR . $file)
									){
										$name = str_replace(".jpg", "", $file);
										echo "<div data-itemName=". $name ." class='modalItem'> <img src='' data-src=".$dir.$file."></div>";
									};
							};
						?>						
					</div>
					
				</div>
			</div>
			<div class="modal-footer">				
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
			</div>
		</div><!-- /.модальное окно-Содержание -->  
	</div><!-- /.модальное окно-диалог -->  
</div><!-- /.модальное окно --> 