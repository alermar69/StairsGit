<<<<<<< HEAD
<? include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/master/steps/cam_controls.php" ?>
<h2>Геометрия лестницы</h2>
<div class="row">
	<div class="col-12 move_form_container" id="carcasFormMaster" data-content_from="#carcasTableWrapper"></div>
	<div class="col-12 move_form_container" id="manufacturingFormMaster" data-content_from='#manufacturingParams'></div>
	<div class="col-12 move_form_container" id="manufacturingFormMaster" data-content_from='#manufacturing_inputs'></div>
	
	<div class="col-12">
		<h3>Параметры крепления</h3>
		<table class="form_table">
			<tbody>
				<tr>
					<td>Верхний узел:</td>
					<td><div class="move-input-master" data-id='topAnglePosition'></div></td>
				</tr>

				<tr>
					<td>Фланец:</td>
					<td><div class="move-input-master" data-id='topFlan'></div></td>
				</tr>
			</tbody>
		</table>
	</div>
	<!-- <div class="row master-input-container">
		<div class="col-5">
			Верхний узел:
		</div>
		<div class="col-7 move-input-master" data-id='topAnglePosition'></div>
	</div>
	<div class="row master-input-container">
		<div class="col-5">
			Фланец:
		</div>
		<div class="col-7 move-input-master" data-id='topFlan'></div>
	</div>
		 -->
	<div class="col-12 move_form_container" id="treadsFormMaster" data-content_from="#treadsTableWrapper"></div>
	
	<h2>Параметры расчета геометрии</h2>
	<div class="col-12 move_form_container" id='geometryFormMaster' data-content_from='#geometry_form'></div>
=======
<? include $_SERVER['DOCUMENT_ROOT']."/calculator/general/forms/master/steps/cam_controls.php" ?>
<h2>Геометрия лестницы</h2>
<div class="row">
	<div class="col-12 move_form_container" id="carcasFormMaster" data-content_from="#carcasTableWrapper"></div>
	<div class="col-12 move_form_container" id="manufacturingFormMaster" data-content_from='#manufacturingParams'></div>
	<div class="col-12 move_form_container" id="manufacturingFormMaster" data-content_from='#manufacturing_inputs'></div>
	
		<div class="row master-input-container">
			<div class="col-5">
				Верхний узел:
			</div>
			<div class="col-7 move-input-master" data-id='topAnglePosition'></div>
		</div>
		<div class="row master-input-container">
			<div class="col-5">
				Фланец:
			</div>
			<div class="col-7 move-input-master" data-id='topFlan'></div>
		</div>
		
	<div class="col-12 move_form_container" id="treadsFormMaster" data-content_from="#treadsTableWrapper"></div>
	
	<h2>Параметры расчета геометрии</h2>
	<div class="col-12 move_form_container" id='geometryFormMaster' data-content_from='#geometry_form'></div>
>>>>>>> curve
</div>