$(function () {
	$("#testingInputs").find("input,select").change(function(){
		filterFormChange();
		})
	filterFormChange();
});

function filterFormChange(){

	var generatorMode = $("#configGeneratorMode").val();
	
	$(".synthConfigs").hide();
	$(".savedConfigs").hide();
	$(".lastConfigs").hide();
	$(".groupTesting").hide();
	
	if(generatorMode != "нет"){
		$(".groupTesting").show();
		$(".synthConfigs").show();
		}
		
	if(generatorMode == "синтетические"){
		}
	if(generatorMode == "сохраненные"){
		$(".savedConfigs").show();
		$(".synthConfigs").hide();
		}
	if(generatorMode == "последние"){
		$(".lastConfigs").show();
		}
	
}