

function changeSillForm(){
	
	$(".orielPar").hide()
	$(".wallPar").show()
	if(params.geom == "эркер") {
		$(".orielPar").show()
		$(".wallPar").hide()
		var imgName =  "/drawings/sill/oriel/" + $("#orielType").val() + ".png"
		$("#orielType_img img").attr("src", imgName)
	}
	
}