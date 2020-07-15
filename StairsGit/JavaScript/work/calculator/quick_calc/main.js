var currentTemplate = null;
var defaultOrderData = null;
var templateParams = {};
var params = {};
var selectedId = null;

$(function () {
	$('.template-forms .modify-input, .template-forms select, .template-forms textarea').change(function () {
		templateParams[$(this).attr('id')] = $(this).val();
		updateUrl();
	});

	$('.template-modify-type').change(function(){
		var modifyType = $(this).attr('data-modify_type');
		switch (modifyType) {
			case 'railingModel':
				templateParams['railingModel'] = $(this).val();
				templateParams['railingModel_bal'] = $(this).val();
				break;
			case 'timberType':
				templateParams['treadsMaterial'] = $(this).val();
				templateParams['risersMaterial'] = $(this).val();
				templateParams['skirtingMaterial'] = $(this).val();
				templateParams['newellsMaterial'] = $(this).val();
				templateParams['timberBalMaterial'] = $(this).val();
				templateParams['handrailsMaterial'] = $(this).val();
				templateParams['newellsMaterial'] = $(this).val();
				break;
		}
		updateUrl();
	});

	$('.template-filters').on('change', 'select, input', function () {
		updateTemplates();
	})

	$('.pz_info').hide();
	$('#searchOffers').hide();
	$('#saveOfferModalShow').hide();
	$('#loadFromBd').hide();
	$('#newBug').hide();
	$('#rewriteOffer').hide();
	$('#troubles').hide();

	changeFormAssembling();
	updateTemplates();
});