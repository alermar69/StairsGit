function changeFormCarcas(){
	
	if(params.carportType.indexOf("консольный") != -1){
		$("#columnProfile").val("100х200")
		$("#roofType").val("Арочная")
	}
	
	if(params.sectLen > 3000){
		alert("Прочность фермы не позволяет сделать длину секции более 3000 мм. Была установлена длина секции 3000 мм.")
		$("#sectLen").val(3000)
	}
	
	if(params.trussWidth > 7500){
		alert("Прочность фермы не позволяет сделать ширину навеса более 7500 мм. Была установлена ширина 7500 мм.")
		$("#trussWidth").val(7500)
	}
}