
function changeFormStartTreads(){
	var template = $("#startTreadsTemplate").val();
	var startTreadAmt = $("#startTreadAmt").val();
	
	$(".startTreadsPar").show();
	if(startTreadAmt < 1)  $(".startTreadsPar").hide();
	$(".noTemplate").hide();
	if(template == "тонкая настройка") {
		for(var i=0; i<startTreadAmt; i++){
			$(".noTemplate").eq(i).show();
			}
		}
	
	$("#fullArcFront").closest("tr").show();
	
	if(template == "прямые"){
		$("#radiusFactor").val(0);
		$("#radiusFactor1").val(0);
		$("#radiusFactor2").val(0);
		
		$("#fullArcFront").closest("tr").hide();
		}

	if(template == "радиусные"){
		$("#radiusFactor").val(20);
		$("#radiusFactor1").val(20);
		$("#radiusFactor2").val(20);
		
		$("#asymmetryFactor").val(0);
		$("#asymmetryFactor1").val(0);
		$("#asymmetryFactor2").val(0);
		}
	if(template == "веер"){
		$("#radiusFactor").val(30);
		$("#radiusFactor1").val(20);
		$("#radiusFactor2").val(10);
		
		$("#asymmetryFactor").val(30);
		$("#asymmetryFactor1").val(20);
		$("#asymmetryFactor2").val(10);
		}
			
}