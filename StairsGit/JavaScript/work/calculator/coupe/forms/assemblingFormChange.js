function changeFormAssembling() {

//опции доставки
$("#deliveryDist").closest("tr").hide();
if($("#delivery").val() == "Московская обл.") $("#deliveryDist").closest("tr").show();

	
		
} //end of changeFormAssembling