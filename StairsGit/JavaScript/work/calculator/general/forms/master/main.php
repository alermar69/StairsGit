<?
	$steps = [
		"/calculator/general/forms/master/steps/opening_step.php",
		"/calculator/general/forms/master/steps/walls_step.php"
	];
?>
<div class='modal' id='master_modal'>
	<div class='stair-master-close'>
		<button class='close_modal'>Закрыть</button>
	</div>
	<div class="stair-master">
		<div class="row h-100">
			<div class="visualisation col-6 h-100"></div>
			<div class="master-menu col-6 h-100">
				<? foreach ($steps as $index => $form_url) {?>
					<div class='master-step' data-step='<?= $index + 1 ?>'>
						<? include $_SERVER['DOCUMENT_ROOT'].$form_url; ?>
					</div>
				<? } ?>
				<div class='master-buttons'>
					<button class='btn btn-primary' id='prevStep'>Назад</button>
					<button class='btn btn-primary' id='nextStep'>Далее</button>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.stair-master {
		background-color: white;
		height: calc(100% - 40px);
		overflow: hidden;
	}

	.stair-master .master-menu{
		overflow-y: auto;
	}

	.stair-master .visualisation canvas{
		width: 100% !important;
	}

	.stair-master-close {
		margin: auto;
	}

	.stair-master-close .close_modal {
		width: 100%;
		height: 40px;
		border: 1px solid black;
	}

	.master-step{
		display: none;
		overflow: auto;
		height: calc(100% - 60px);
	}

	.master-buttons{
		margin: auto;
		text-align: center;
	}

	.master-buttons button{
		margin: 10px;
	}

	.stair-master table td{
		border: 1px solid black;
	}

	.opening_image img{
		width: calc(100% - 20px);
	}
</style>

<script src="/calculator/general/forms/master/stairMasterFormChange.js"></script>