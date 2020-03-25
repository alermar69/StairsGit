<? include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/master/steps/cam_controls.php" ?>
<h2>Комлпектация</h2>
<div class="row">
	<div class="col-12">
		
		<table class="form_table">
			<tbody>
				<tr class="master-input-container">
					<td>Каркас:</td>
					<td><div class="move-input-master" data-id='isCarcas'></div></td>
				</tr>
				<tr class="master-input-container">
					<td>Ступени:</td>
					<td><div class="move-input-master" data-id='stairType'></div></td>
				</tr>
				<tr class="master-input-container">
					<td>Покраска дерева:</td>
					<td><div class="move-input-master" data-id='timberPaint'></div></td>
				</tr>
				<tr class="master-input-container">
					<td>Покраска метала:</td>
					<td><div class="move-input-master" data-id='metalPaint'></div></td>
				</tr>
				<tr class="master-input-container">
					<td>Подсветка ступеней:</td>
					<td><div class="move-input-master" data-id='treadLigts'></div></td>
				</tr>
			</tbody>
		</table>
		
		<div id='geomDescrMaster' class='move_form_container' data-content_from='#startTreads'></div>

		<h2>Ограждения</h2>
		
		<table class="form_table">
			<tbody>
				
				<tr class="master-input-container marsh1">
					<td>Ограждения нижнего марша:</td>
					<td><div class="col-7 move-input-master" data-id='railingSide_1'></div></td>
				</tr>
				<tr class="master-input-container marsh2">
					<td>Ограждения среднего марша:</td>
					<td><div class="col-7 move-input-master" data-id='railingSide_2'></div></td>
				</tr>
				<tr class="master-input-container marsh3">
					<td>Ограждения верхнего марша:</td>
					<td><div class="col-7 move-input-master" data-id='railingSide_3'></div></td>
				</tr>
				<tr class="master-input-container marsh1">
					<td>Пристенный поручень нижнего марша:</td>
					<td><div class="col-7 move-input-master" data-id='handrailSide_1'></div></td>
				</tr>
				<tr class="master-input-container marsh2">
					<td>Пристенный поручень среднего марша:</td>
					<td><div class="col-7 move-input-master" data-id='handrailSide_2'></div></td>
				</tr>
				<tr class="master-input-container marsh3">
					<td>Пристенный поручень верхнего марша:</td>
					<td><div class="col-7 move-input-master" data-id='handrailSide_3'></div></td>
				</tr>
				
				
				<tr class="master-input-container">
					<td>Модель ограждения:</td>
					<td><div class="col-7 move-input-master" data-id='railingModel'></div></td>
				</tr>				
				<tr class="master-input-container">
					<td>Тип поручня:</td>
					<td><div class="col-7 move-input-master" data-id='handrail'></div></td>
				<tr>
			</tbody>
		</table>
		
	</div>
</div>