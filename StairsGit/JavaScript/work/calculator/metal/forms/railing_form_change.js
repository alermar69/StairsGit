$(function () {
	//параметры ограждений по умолчанию
	$("#railingModel").change(function(){

		if($(this).val() == "Самонесущее стекло") {
			$("#handrailFixType").val("паз")
			
		}
	})
});


function changeFormRailing(){

//заменяем решктку на кованые балясины
if(params.railingModel == "Решетка") {
	console.log("Тип ограждений решетка был заменен на кованые балясины")
	$("#balDist").closest("tr").show();
	$("#banister1").val("20х20");
	$("#banister2").val("20х20");
	$("#railingModel").val("Кованые балясины");
	params.railingModel = "Кованые балясины";
	}
	
$("#railingModel option[value='Деревянные балясины']").hide();
$("#railingModel option[value='Дерево с ковкой']").hide();
$("#railingModel option[value='Стекло']").hide();
if(params.model == "ко" || params.calcType == "mono"){
	$("#railingModel option[value='Деревянные балясины']").show();
	$("#railingModel option[value='Дерево с ковкой']").show();
	$("#railingModel option[value='Стекло']").show();
	}


if(params.calcType == "vhod" || params.calcType == "veranda"){

	//вывод кол-ва маршей в зависимости от модели
	$("#marsh_2_perila_tr").hide();
	//показ параметров верхнего марша
	$("#marsh_3_perila_tr").hide();
	if (params.stairModel != "Прямая") $("#marsh_3_perila_tr").show();

	//единое ограждение для прямой двухмаршевой и горки
	if(params.stairModel == "Прямая с промежуточной площадкой" || params.stairModel == "Прямая горка"){
		params.railingSide_3 = params.railingSide_1;
		$("#railingSide_3").val(params.railingSide_3)
		}

	//ограждение верхней площадки

	$("#topPltRailing_tr").hide();
	if (params.platformTop == "площадка") {
		$("#topPltRailing_tr").show();
		$("#railingPltImg").attr("src","/images/calculator/vhod/railingPlt_1.png");
		$("#topPltRailing_6").closest("li").hide();
		}
	if (params.platformTop == "увеличенная") {
		$("#topPltRailing_tr").show();
		$("#railingPltImg").attr("src","/images/calculator/vhod/railingPlt_2.png");
		if(params.turnSide == "левое") $("#railingPltImg").attr("src","/images/calculator/vhod/railingPlt_3.png");
		$("#topPltRailing_6").closest("li").show();
		}
	}

//наличие ограждений
var isRailing = staircaseHasUnit().railing;

//наличие поручней
var isHandrail = staircaseHasUnit().handrail; //функция в файле inputsReading


$("#resultPerila").hide();

//параметры поручня
$('.handrailParams_tr').hide();
if(isHandrail) {
	$('.handrailParams_tr').show();
	setHandrailOptions(); //функция в файле formsChange
	$("#resultPerila").show();
	}

if(!isRailing) $(".railing_tr").hide();

if(isRailing) {
	$(".railing_tr").show();
	$("#resultPerila").show();
	$("#handrail").closest("tr").show();
	

	

	var railingModel = $("#railingModel").val();

	//крепление стоек к лестнице
	$("#rackBottom_tr").show();
	if (railingModel == "Самонесущее стекло") {
		$("#rackBottom_tr").hide();	
		}
	if(params.calcType == "mono") $("#rackBottom").val("боковое");
	
	if (params.railingModel == "Деревянные балясины" ||
		params.railingModel == "Стекло" ||
		params.railingModel == "Дерево с ковкой") $("#rackBottom").val("сверху с крышкой");

	//тип крепления поручня
	var railingTypes = ["Самонесущее стекло", "Кованые балясины", "Кресты"]
	$("#handrailFixType").closest("tr").hide();
	if (isHandrail && railingTypes.indexOf(railingModel) != -1) {
		$("#handrailFixType").closest("tr").show();
	}
		
	if(railingTypes.indexOf(railingModel) == -1) {
		$("#handrailFixType").val("кронштейны");
	}


	//параметры ограждений с ригелями
	$(".rigel_tr").hide();	
	if (railingModel == "Ригели" || railingModel == "Трап") $(".rigel_tr").show();
	
	
//экраны лазер
	$("#laserModel").closest("tr").hide();
	if (railingModel == "Экраны лазер") $("#laserModel").closest("tr").show();	
	
	//параметры ограждений со стеклом
	$(".glass_tr").hide();
	if (railingModel == "Самонесущее стекло" || railingModel == "Стекло на стойках") {
		$(".glass_tr").show()
		if(params.glassType != "триплекс" && params.glassType != "триплекс цветной")
			$("#glassBevels").closest("tr").hide();
			
		}


	$(".timberRailing_tr").hide();
	if (railingModel == "Деревянные балясины") $(".timberRailing_tr").show();
	
	if(railingModel == "Самонесущее стекло" && params.handrailFixType == "паз") {
		$("#handrailConnectionType").val("без зазора премиум");
		params.handrailConnectionType = "без зазора премиум"
		}
		

	//материал стоек
	$("#banisterMaterial_tr").hide();
	if (railingModel == "Ригели" || railingModel == "Стекло на стойках")
		$("#banisterMaterial_tr").show();

	//шарниры на круглых поручнях
	if(params.handrail == "Ф50 нерж." || params.handrail == "ПВХ"){
		params.handrailConnectionType = "шарнир";
		$("#handrailConnectionType").val(params.handrailConnectionType);
		}

	if(params.handrail == "Ф50 нерж. с пазом" || params.handrail == "40х60 нерж. с пазом"){
		params.handrailFixType = "паз";
		$("#handrailFixType").val(params.handrailFixType);
		}
		
	//параметры деревянных ограждений
	$(".timber_tr").hide();
	$(".timber_kovka_tr").hide();
	$(".timber_glass_tr").hide();
	$(".kovka_tr").hide();

	if (params.railingModel == 'Реечные') {
		$('.racksrailing_tr').show();
	}else{
		$('.racksrailing_tr').hide();
	}

	if (params.railingModel == 'Кресты') {
		$('.crossrailing_tr').show();
	}else{
		$('.crossrailing_tr').hide();
	}

	
	
	if (railingModel == "Деревянные балясины") {
		$(".timber_tr").show();
		}
		
	//параметры кованых ограждений
	
	if (railingModel == "Дерево с ковкой") {
		$(".timber_kovka_tr").show();
		}
		
	if (railingModel == "Кованые балясины") $(".kovka_tr").show();
		
	}

	getAllInputsValues(params);
	
} //end of changeForm

