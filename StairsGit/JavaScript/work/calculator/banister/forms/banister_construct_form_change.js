function changeFormBanisterConstruct(){
var par = {};

$("#banisterСonstructFormWrap").show();
if(params.banisterSectionAmt == 0) $("#banisterСonstructFormWrap").hide();

if(params.banisterSectionAmt != 0 && params.railingModel_bal == "нет" && !testingMode)
	alertTrouble('ВНИМАНИЕ! Есть секции балюстрады, но тип ограждения балюстрады выбран "нет" \nУдалите секции или выберите тип ограждения!')

//параметры поручня
$(".handrailParams_bal").closest("tr").show();
if(params.handrail_bal == "нет"){
	$(".handrailParams_bal").closest("tr").hide();
}

/*крепление стоек*/
$("#rackBottom_bal_tr").show();



/*Характеристики ограждений*/



var railingModel = getInputValue("railingModel_bal");

$(".glassRailing_bal").hide();
if (railingModel == "Самонесущее стекло") {
	$(".glassRailing_bal").show();
	$("#rackBottom_bal_tr").hide();
	}

if (railingModel == "Ригели") {
	$("#rigel_bal_tr_1").show()
	$("#rigel_bal_tr_2").show()
	}
else {
	$("#rigel_bal_tr_1").hide()
	$("#rigel_bal_tr_2").hide()
}

if (railingModel == "Кресты"){
	$(".banister_crossrailing_tr").show();
} else{
	$(".banister_crossrailing_tr").hide();
}

//параметры кованых ограждений
	$(".kovka_bal_tr").hide();	
	if (railingModel == "Кованые балясины") $(".kovka_bal_tr").show();
	
//экраны лазер
	$("#laserModel_bal").closest("tr").hide();
	if (railingModel == "Экраны лазер") $("#laserModel_bal").closest("tr").show();

//параметры деревянных ограждений

	$(".timber_bal_tr").hide();
	$(".timber_kovka_bal_tr").hide();
	$(".timber_glass_bal_tr").hide();
	$(".kovka_bal_tr").hide();
	
	if (railingModel == "Деревянные балясины") $(".timber_bal_tr").show();
	if (railingModel == "Дерево с ковкой") $(".timber_kovka_bal_tr").show();
	if (railingModel == "Стекло") $(".timber_glass_bal_tr").show();
	
		
	if (railingModel == "Кованые балясины") $(".kovka_bal_tr").show();

	
$("#balMaterial_bal_tr").hide();
if (railingModel == "Частые стойки")$("#balMaterial_bal_tr").show();

if (railingModel == "Стекло"){
	$("#timberNewellType_bal").val("квадратные");
	}
	
//примерный шаг балясин
$("#balDist_bal").closest("tr").hide();
if (railingModel == "Деревянные балясины" || 
	railingModel == "Кованые балясины" || 
	railingModel == "Частые стойки" || 
	railingModel == "Решетка" ||
	railingModel == "Дерево с ковкой"
	){
		$("#balDist_bal").closest("tr").show();
		}
	
	
if (railingModel == "Ригели" || railingModel == "Стекло на стойках") $("#banisterMaterial_bal_tr").show()
else $("#banisterMaterial_bal_tr").hide()




//пареметры стекол


//параметры ограждений со стеклом
	$(".glass_bal").hide();
	if (railingModel == "Самонесущее стекло" || railingModel == "Стекло на стойках" || railingModel == "Стекло") {
		$(".glass_bal").show()
		if(params.glassType_bal != "триплекс" && params.glassType_bal != "триплекс цветной")
			$("#glassBevels_bal").closest("tr").hide();
			
		}

//переопределяем старые неактуальные опции
var handrailInputs = {
	handrailSelectId: "handrail_bal",
	hanrailProfId: "handrailProf_bal",
	sideSlotsId: "handrailSlots_bal", 
	}
if(params.banisterSectionAmt > 0) replaceOldHandrails(handrailInputs);

/*задаем массив доступных значений*/
var handRailCompatible = [1,2,3,4,5,6,9,10,11,12,13,14];

if (railingModel == "Самонесущее стекло"){
	if(params.handrailFixType == "паз") handRailCompatible = [1, 7,8,10,11,12,13,14];
	handRailCompatible.push(15);
} 

if (railingModel == "Кованые балясины" || railingModel == "Решетка") {
	handRailCompatible.push(15);
}
	
if (railingModel == "Деревянные балясины") 
	handRailCompatible = [1,10,11,12,13,14];
	


showOptions('handrail_bal', handRailCompatible);

$('#handrailProf_bal').closest("tr").hide();
$('#handrailSlots_bal').closest("tr").hide();
//форма поручня
if(params.handrail_bal == "сосна" ||
	params.handrail_bal == "береза" ||
	params.handrail_bal == "лиственница" ||
	params.handrail_bal == "дуб паркет." ||
	params.handrail_bal == "дуб ц/л" ||
	params.handrail_bal == "массив"	)
	{
		$('#handrailProf_bal').closest("tr").show();
		$('#handrailSlots_bal').closest("tr").show();		
		}


		
//скрываем все опции если нет ограждений
$("#handrail_bal").closest("tr").show();
if(params.railingModel_bal == "нет") {
	$("#rackBottom_bal_tr").hide();
	$(".handrailParams_bal").closest("tr").hide();
	$("#handrail_bal").closest("tr").hide();
	$(".timberPaint_bal").hide();
}

//высота ограждений балюстрады

//параметры поручня
var handrailPar = {
	prof: params.handrailProf_bal,
	sideSlots: params.handrailSlots_bal,
	handrailType: params.handrail_bal,
	}
handrailPar = calcHandrailMeterParams(handrailPar); //функция в файле priceLib.js

if(params.rackLenType_bal == "стандартные"){
	var height = 830 + 70 + handrailPar.profY;
	$("#handrailHeight_bal").val(height);
}
	
	//номер деревянных балясин и столбов
	if(isFinite(params.timberRackModel_bal) && params.timberRackModel_bal > 0 && params.timberRackModel_bal < 10 && params.timberRackModel_bal[0] != 0){
		$("#timberRackModel_bal").val("0" + params.timberRackModel_bal);
	}

	if(isFinite(params.timberBalModel_bal) && params.timberBalModel_bal > 0 && params.timberBalModel_bal < 10  && params.timberBalModel_bal[0] != 0){
		$("#timberBalModel_bal").val("0" + params.timberBalModel_bal);
	}
	
	//верхнее и нижнее окончание
	if(typeof getTimberBalParams == "function"){
		var balPar = getTimberBalParams(params.timberBalModel_bal); //функция в файле /manufacturing/timber/drawRailing.js
		$("#timberBalTopEnd_bal").val(balPar.topEnd)
		$("#timberBalBotEnd_bal").val(balPar.botEnd)
		$("#timberBalType_bal").val(balPar.type);
	}

	//крепление паз невозможно для металлических поручней
	if(handrailPar.mat == 'metal' && 
		params.handrail_bal != "Ф50 нерж. с пазом" && 
		params.handrail_bal != "40х60 нерж. с пазом"){
			$("#handrailFixType_bal").val("кронштейны");
		}
	
	$("#handrailConnectionType_bal option[value='шарнир']").hide();
	if(params.handrail_bal == "ПВХ" || params.handrail_bal == "Ф50 нерж."){
		$("#handrailConnectionType_bal option[value='шарнир']").show();
		if(params.handrail_bal == "ПВХ") $("#handrailConnectionType_bal").val('шарнир');
	}
	else {
		if($("#handrailConnectionType_bal").val() == "шарнир") $("#handrailConnectionType_bal").val("прямые");
	}
	
} //end of changeForm


