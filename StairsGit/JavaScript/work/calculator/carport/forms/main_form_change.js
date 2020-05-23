function changeFormCarcas(){
	
	$(".arc").hide()
	$(".truss").hide()
	
	if(params.arcType == "ферма") $(".truss").show()
	if(params.arcType == "дуги") $(".arc").show()
}