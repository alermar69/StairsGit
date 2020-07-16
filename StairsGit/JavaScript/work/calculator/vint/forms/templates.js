$(function () {
	$('#in_ec_1').click(function(){
		$("#stairType").val("сосна кл.Б")
		$("#metalPaint").val("нет")
		$("#timberPaint").val("нет")
		$("#paintedBolts").val("нет")
		$("#railingModel").val("Ригели")
		$("#handrail").val("сосна")
		$("#handrailProf").val("40х60 верт.")
		$("#handrailSlots").val("нет")
		$("#banisterMaterial").val("40х40 черн.")
		$("#rigelMaterial").val("20х20 черн.")
		$("#rigelAmt").val("2")
		$("#metalPaint_perila").val("нет")
		$("#timberPaint_perila").val("нет")
		$("#handrail_bal").val("сосна")
		$("#handrailProf_bal").val("40х60 верт.")
		$("#handrailSlots_bal").val("нет")
		$("#banisterMaterial_bal").val("40х40 черн.")
		$("#rigelMaterial_bal").val("20х20 черн.")
		$("#rigelAmt_bal").val("2")
		$("#metalPaint_perila_bal").val("нет")
		$("#timberPaint_perila_bal").val("нет")
		$("#isAssembling").val("нет")		
		recalculate();
		});
		
	$('#in_ec_2').click(function(){
		$("#stairType").val("сосна экстра");
		$("#metalPaint").val("порошок");
		$("#timberPaint").val("нет");
		$("#paintedBolts").val("нет");
		$("#railingModel").val("Ригели");
		$("#handrail").val("сосна");
		$("#handrailProf").val("40х60 верт.");
		$("#handrailSlots").val("нет");
		$("#banisterMaterial").val("40х40 черн.");
		$("#rigelMaterial").val("20х20 черн.");
		$("#rigelAmt").val("2");
		$("#metalPaint_perila").val("порошок");
		$("#timberPaint_perila").val("нет");
		$("#handrail_bal").val("сосна");
		$("#handrailProf_bal").val("40х60 верт.");
		$("#handrailSlots_bal").val("нет");
		$("#banisterMaterial_bal").val("40х40 черн.");
		$("#rigelMaterial_bal").val("20х20 черн.");
		$("#rigelAmt_bal").val("2");
		$("#metalPaint_perila_bal").val("порошок");
		$("#timberPaint_perila_bal").val("нет");
		$("#isAssembling").val("нет")
		recalculate();
		});
		
	$('#in_st_1').click(function(){
		$("#stairType").val("лиственница паркет.");
		$("#metalPaint").val("порошок");
		$("#timberPaint").val("лак");
		$("#paintedBolts").val("нет");
		$("#railingModel").val("Ригели");
		$("#handrail").val("лиственница");
		$("#handrailProf").val("40х60 верт.");
		$("#handrailSlots").val("нет");
		$("#banisterMaterial").val("40х40 черн.");
		$("#rigelMaterial").val("Ф12 нерж.");
		$("#rigelAmt").val("3");
		$("#metalPaint_perila").val("порошок");
		$("#timberPaint_perila").val("лак");
		$("#handrail_bal").val("лиственница");
		$("#handrailProf_bal").val("40х60 верт.");
		$("#handrailSlots_bal").val("нет");
		$("#banisterMaterial_bal").val("40х40 черн.");
		$("#rigelMaterial_bal").val("Ф12 нерж.");
		$("#rigelAmt_bal").val("3");
		$("#metalPaint_perila_bal").val("порошок");
		$("#timberPaint_perila_bal").val("лак");
		$("#isAssembling").val("есть");
		recalculate();
		});
		
	$('#in_st_2').click(function(){
		$("#stairType").val("береза паркет.");
		$("#metalPaint").val("порошок");
		$("#timberPaint").val("лак");
		$("#paintedBolts").val("нет");
		$("#railingModel").val("Ригели");
		$("#handrail").val("береза");
		$("#handrailProf").val("40х60 верт.");
		$("#handrailSlots").val("нет");
		$("#banisterMaterial").val("40х40 нерж.");
		//$("#rigelMaterial").val("Ф12 нерж.");
		//$("#rigelAmt").val("3");
		$("#metalPaint_perila").val("порошок");
		$("#timberPaint_perila").val("лак");
		$("#railingModel_bal").val("Ригели");
		$("#handrail_bal").val("береза");
		$("#handrailProf_bal").val("40х60 верт.");
		$("#handrailSlots_bal").val("нет");
		$("#banisterMaterial_bal").val("40х40 нерж.");
		//$("#rigelMaterial_bal").val("Ф12 нерж.");
		//$("#rigelAmt_bal").val("3");
		$("#metalPaint_perila_bal").val("порошок");
		$("#timberPaint_perila_bal").val("лак");
		$("#isAssembling").val("есть");
		recalculate();
		});
		
	$('#in_st_3').click(function(){
	
		$("#stairType").val("береза паркет.");
		$("#metalPaint").val("порошок");
		$("#timberPaint").val("лак");
		$("#paintedBolts").val("есть");
		$("#railingModel").val("Кованые балясины");
		$("#handrail").val("береза");
		$("#handrailProf").val("40х60 верт.");
		$("#handrailSlots").val("нет");
		$("#banisterMaterial").val("40х40 нерж.");
		$("#banister1").val("bal_10");
		$("#banister2").val("bal_12");
		$("#balDist").val("150");
		$("#metalPaint_perila").val("порошок");
		$("#timberPaint_perila").val("лак");
		$("#railingModel_bal").val("Кованые балясины");
		$("#handrail_bal").val("береза");
		$("#handrailProf_bal").val("40х60 верт.");
		$("#handrailSlots_bal").val("нет");
		$("#banisterMaterial_bal").val("40х40 нерж.");
		$("#banister1_bal").val("bal_10");
		$("#banister2_bal").val("bal_12"); 
		$("#balDist_bal").val("150");
		$("#metalPaint_perila_bal").val("порошок");
		$("#timberPaint_perila_bal").val("лак");
		$("#isAssembling").val("есть");
		
		
		recalculate();
		});
		
	$('#in_pr_1').click(function(){
		$("#stairType").val("дуб паркет.");
		$("#metalPaint").val("порошок");
		$("#timberPaint").val("морилка+лак");
		$("#paintedBolts").val("есть");
		$("#railingModel").val("Стекло на стойках");
		$("#handrail").val("дуб паркет.");
		$("#handrailProf").val("40х60 верт.");
		$("#handrailSlots").val("нет");
		$("#banisterMaterial").val("40х40 нерж.");
		//$("#rigelMaterial").val("Ф12 нерж.");
		//$("#rigelAmt").val("3");
		$("#metalPaint_perila").val("порошок");
		$("#timberPaint_perila").val("морилка+лак");
		$("#railingModel_bal").val("Стекло на стойках");
		$("#handrail_bal").val("дуб паркет.");
		$("#handrailProf_bal").val("40х60 верт.");
		$("#handrailSlots_bal").val("нет");
		$("#banisterMaterial_bal").val("40х40 нерж.");
		//$("#rigelMaterial_bal").val("Ф12 нерж.");
		//$("#rigelAmt_bal").val("3");
		$("#metalPaint_perila_bal").val("порошок");
		$("#timberPaint_perila_bal").val("морилка+лак");
		$("#isAssembling").val("есть");
		recalculate();
		});
		
	$('#in_pr_2').click(function(){
		$("#stairType").val("дуб ц/л");
		$("#metalPaint").val("порошок");
		$("#timberPaint").val("морилка+лак");
		$("#paintedBolts").val("нет");
		$("#railingModel").val("Стекло на стойках");
		$("#handrail").val("дуб ц/л");
		$("#handrailProf").val("40х60 верт.");
		$("#handrailSlots").val("нет");
		$("#banisterMaterial").val("40х40 нерж.");
		$("#metalPaint_perila").val("порошок");
		$("#timberPaint_perila").val("морилка+лак");
		$("#railingModel_bal").val("Стекло на стойках");
		$("#handrail_bal").val("дуб ц/л");
		$("#handrailProf_bal").val("40х60 верт.");
		$("#handrailSlots_bal").val("нет");
		$("#banisterMaterial_bal").val("40х40 нерж.");
		$("#metalPaint_perila_bal").val("порошок");
		$("#timberPaint_perila_bal").val("морилка+лак");
		$("#isAssembling").val("есть");
		recalculate();
		});
		
	$('#in_pr_3').click(function(){
		$("#stairType").val("дуб ц/л");
		$("#metalPaint").val("порошок");
		$("#timberPaint").val("морилка+лак");
		$("#paintedBolts").val("есть");
		$("#railingModel").val("Самонесущее стекло");
		$("#handrail").val("дуб ц/л");
		$("#handrailProf").val("40х60 верт.");
		$("#handrailSlots").val("нет");

		$("#metalPaint_perila").val("порошок");
		$("#timberPaint_perila").val("морилка+лак");
		$("#railingModel_bal").val("Самонесущее стекло");
		$("#handrail_bal").val("дуб ц/л");
		$("#handrailProf_bal").val("40х60 верт.");
		$("#handrailSlots_bal").val("нет");
		
		$("#metalPaint_perila_bal").val("порошок");
		$("#timberPaint_perila_bal").val("морилка+лак");
		$("#isAssembling").val("есть");
		recalculate();
		});
	

	
});

