function changeFormAssembling() {

//ограждения на лестницу заказчика только с монтажом и доставкой
if($("#calcType").val() == "railing"){
	//$("#isAssembling").val("есть");
	//if($("#delivery").val() == "нет" || $("#delivery").val() == "транспортная компания") 
	//	$("#delivery").val("Москва");
	
	}
	
//опции доставки

$(".delivery").hide();
if($("#delivery").val() == "Московская обл." || $("#delivery").val() == "Москва") {
	$(".delivery").show();
}

$("#deliveryDist").closest("tr").hide();
if($("#delivery").val() == "Московская обл.") $("#deliveryDist").closest("tr").show();

//опции сборки

$(".installation_tr").hide();
$(".assmStages").hide();
if($("#isAssembling").val() == "есть") {
	$(".installation_tr").show();
	//$("#deliveryDist").closest("tr").show();
	if($("#workers").val() > 1) $(".assmStages").show();
	}

//скрываем лишние опции для ограждений
if($("#calcType").val() == "railing"){
	$("#engineer").closest("tr").hide();
	$("#stepCutting").closest("tr").hide();	
	}	
	
//подъем на этаж
$("#floorAmt").closest("tr").hide();
if($("#noLiftCare").val() == "да") $("#floorAmt").closest("tr").show();

//количество выездов не меньше количества этапов
if($("#workers").val() > $("#transfersAmt").val()) $("#transfersAmt").val($("#workers").val());

//доставка не может быть включена в монтаж, если монтажа нет
if(params.isAssembling == "нет") $("#deliveryInAssembling").val("нет")

} //end of changeFormAssembling