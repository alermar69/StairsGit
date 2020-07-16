function changeFormRailing(){
getAllInputsValues(params);



/*Характеристики ограждений*/

if (params.railingModel == "Самонесущее стекло") {
	$('#glass_tr_1').show();
	}
else {
	$('#glass_tr_1').hide();
	}

if (params.railingModel == "Ригели") {
	$('#rigel_tr_1').show();
	$('#rigel_tr_2').show();	
	}
else {
	$('#rigel_tr_1').hide();
	$('#rigel_tr_2').hide();
}

if (params.railingModel == "Кованые балясины") {
	$('#kovka_tr_1').show();
	$('#kovka_tr_2').show();
	$('#kovka_tr_3').show();
	$('#kovka_tr_4').show();
	}
else {
	$('#kovka_tr_1').hide();
	$('#kovka_tr_2').hide();
	$('#kovka_tr_3').hide();
	$('#kovka_tr_4').hide();
}

if (params.railingModel == "Деревянные балясины"){
	$('#timberBal_tr_1').show();
	$('#timberBal_tr_2').show();
	$('#timberBal_tr_3').show();
	$('#timberBal_tr_4').show();
	$('#timberBal_tr_5').show();
	$('#timberBal_tr_6').show();
	$('#timberBal_tr_7').show();
	$('#timberBal_tr_8').show();
	$('#timberBal_tr_9').show();
	}
else {
	$('#timberBal_tr_1').hide();
	$('#timberBal_tr_2').hide();
	$('#timberBal_tr_3').hide();
	$('#timberBal_tr_4').hide();
	$('#timberBal_tr_5').hide();
	$('#timberBal_tr_6').hide();
	$('#timberBal_tr_7').hide();
	$('#timberBal_tr_8').hide();
	$('#timberBal_tr_9').hide();
	}
	
	
if (params.railingModel == "Ригели" || params.railingModel == "Стекло на стойках")
	$('#banisterMaterial_tr').show();	
else $('#banisterMaterial_tr').hide();

/*покраска дерева*/

$('#railingTimberPaint_tr').hide();
if (railingModel == "Деревянные балясины" ||
	params.handrail == "Ф50 сосна" ||
	params.handrail == "омега-образный сосна" ||
	params.handrail == "50х50 сосна" ||
	params.handrail == "40х60 береза" ||
	params.handrail == "омега-образный дуб" ||
	params.handrail == "40х60 дуб" ||
	params.handrail == "40х60 дуб с пазом" ||	
	params.handrail == "сосна" ||
	params.handrail == "береза" ||
	params.handrail == "лиственница" ||
	params.handrail == "дуб паркет." ||
	params.handrail == "дуб ц/л" ||
	params.banisterMaterial == "40х40 нерж+дуб"
	) {
		$('#railingTimberPaint_tr').show();
		}
		
$('.railingTimberColor').hide();
if(params.timberPaint_perila == "морилка+лак") $('.railingTimberColor').show(); 

} //end of changeForm
