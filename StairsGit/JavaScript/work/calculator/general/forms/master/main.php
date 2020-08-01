<?
	$steps = [
		"/calculator/general/forms/master/steps/opening_step.php",
		"/calculator/general/forms/master/steps/walls_step.php"
	];


	if ($calc_type != 'vint') {
		$steps[] = "/calculator/general/forms/master/steps/geometry_step.php";
	}else{
		$steps[] = "/calculator/general/forms/master/steps/geometry_step_vint.php";
	}

	if ($calc_type == 'metal' || $calc_type == 'mono' || $calc_type == 'vhod') {
		$steps[] = '/calculator/general/forms/master/steps/equipment_step_metal.php';
	}

	if ($calc_type == 'vint') {
		$steps[] = '/calculator/general/forms/master/steps/equipment_step_vint.php';
	}

	if ($calc_type == 'timber' || $calc_type == 'timber_stock') {
		$steps[] = '/calculator/general/forms/master/steps/equipment_step_timber.php';
	}
?>
<div class='modal noSave' id='master_modal'>
	<div class="stair-master">
		<ul class="nav nav-pills mb-3" id="masterTab" role="tablist">
			<li class="nav-item">
				<a class="nav-link active" id="visalisationTab-tab" data-toggle="tab" href="#visalisationTab" role="tab" aria-controls="visalisationTab" aria-selected="true">Визуализация</a>
			</li>
			<li class="nav-item">
				<a class="nav-link" id="geometry-tab" data-toggle="tab" href="#geometryTab" role="tab" aria-controls="geometryTab" aria-selected="false">Геометрия</a>
			</li>
			<li class="nav-item">
				<a class="nav-link" id="price-tab" data-toggle="tab" href="#priceTab" role="tab" aria-controls="priceTab" aria-selected="false">Цена</a>
			</li>
		</ul>
		<div class="row h-100">
			<div class="tab-content col-6 h-100" id="myTabContent">
				<div class="visualisation tab-pane fade show active" id="visalisationTab" role="tabpanel" aria-labelledby="visalisation-tab"></div>
				<div class="tab-pane fade" id="geometryTab" role="tabpanel" aria-labelledby="geometry-tab">
					<div class="row"><div class="col-12 move_form_container" id='geomDescrMaster' data-content_from='#geomDescrWrapper'></div></div>
				</div>
				<div class="tab-pane fade" id="priceTab" role="tabpanel" aria-labelledby="price-tab">
					<div class="row">
						<div class="col-12 move_form_container" id='totalResultWrapMaster' data-content_from='#totalResultWrap'></div>
						<div class="col-12 move_form_container" id='productionTimeWrapMaster' data-content_from='#productionTimeWrap'></div>
					</div>
				</div>
			</div>
			<!-- <div class="visualisation col-6 h-100"></div> -->
			<div class="master-menu col-6 h-100">
				<? foreach ($steps as $index => $form_url) {?>
					<div class='master-step' data-step='<?= $index + 1 ?>'>
						<? include $GLOBALS['ROOT_PATH'].$form_url; ?>
					</div>
				<? } ?>
				<div class='master-buttons'>
					<button class='btn btn-primary' id='prevStep'>Назад</button>
					<button class='btn btn-primary' id='nextStep'>Далее</button>
					<button class='close_modal btn btn-secondary'>Закрыть</button>
				</div>
			</div>
		</div>
	</div>
</div>

<link href="/calculator/general/forms/master/styles.css" type="text/css" rel="stylesheet">
<script src="/calculator/general/forms/master/stairMasterFormChange.js"></script>