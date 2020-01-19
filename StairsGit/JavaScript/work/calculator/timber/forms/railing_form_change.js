function changeFormRailing(){

/*
if(params.model != "тетивы" && params.railingModel == "Стекло") {
	$("#railingModel").val("Деревянные балясины");
	params.railingModel = "Деревянные балясины";
	}
*/

//наличие ограждений
var isRailing = false;
if(params.railingSide_1 != "нет") isRailing = true;
if(params.stairModel == "П-образная трехмаршевая" && params.railingSide_2 != "нет") isRailing = true;
if(params.stairModel != "Прямая" && params.railingSide_3 != "нет") isRailing = true;

//наличие поручней
var isHandrail = false;
if(params.handrailSide_1 != "нет") isHandrail = true;
if(params.stairModel == "П-образная трехмаршевая" && params.handrailSide_2 != "нет") isHandrail = true;
if(params.stairModel != "Прямая" && params.handrailSide_3 != "нет") isHandrail = true;
if(isRailing && params.handrail != "нет") isHandrail = true;

	
$("#resultPerila").hide();

//параметры поручня
$('.handrailParams_tr').hide();
if(isHandrail) {
	$('.handrailParams_tr').show();
	setHandrailOptions(); //функция в файле formsChange
	$("#resultPerila").show();
	}


	$(".timber_tr").hide();
	$(".timber_kovka_tr").hide();
	$(".timber_glass_tr").hide();
	$("#railingModel").closest("tr").hide();	

if(isRailing) {
	$("#resultPerila").show();
	$("#handrail").closest("tr").show();
	$("#railingModel").closest("tr").show();
	

	var railingModel = $("#railingModel").val();

	//параметры деревянных ограждений
	if (railingModel == "Деревянные балясины") {
		$(".timber_tr").show();

		$("#timberBalTopEnd").closest("tr").hide();
		$("#timberBalBotEnd").closest("tr").hide();
		$("#banisterSize").closest("tr").hide();
		if(railingModel == "Деревянные балясины" && params.timberBalType == "точеные"){
			$("#timberBalTopEnd").closest("tr").show();
			$("#timberBalBotEnd").closest("tr").show();
			}

		if(params.timberBalType == "квадратные"){
			$("#timberBalTopEnd").val("квадрат");
			$("#timberBalBotEnd").val("квадрат");
			}
		}
		

	//параметры деревянных ограждений со стеклом
	if (railingModel == "Стекло"){
		$(".timber_glass_tr").show();
		$("#timberNewellType").val("квадратные");
		}
	
	//параметры кованых ограждений

	if (railingModel == "Дерево с ковкой") {
		$(".timber_kovka_tr").show();
	}
	
	if(params.model == "тетивы" && params.firstNewellPos != "на полу"){
		alertTrouble("ВНИМАНИЕ!\nДля лестницы на тетивах установить первый столб ограждения возможно только на полу. Измените тип каркаса или позицию первого столба.")
	}

	}

//скрываем неактуальные параметры поручней (стыковка всегда через столбы)
$("#handrailEndType").closest("tr").hide();
$("#handrailConnectionType").closest("tr").hide();

//установка столба на пол
var option = $("#firstNewellPos option[value='на полу']");
option.hide();
if(params.model == "тетивы") option.show();


} //end of changeForm

