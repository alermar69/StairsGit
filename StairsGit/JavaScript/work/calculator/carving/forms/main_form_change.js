function changeFormMain(){
	getAllInputsValues(params);
	
	$("#topOrnamentNumber").hide();	
	$("#showTopVariants").hide();	
	if (params.topOrnamentSeries != "no"){
		$("#topOrnamentNumber").show();
		$("#showTopVariants").show();	
		}
	if (params.topOrnamentSeries == "no") {
		$("#topVariants").hide();
		$('#showTopVariants').text("показать эскизы");	
		}
	
	
	$("#botOrnamentNumber").hide();	
	$("#showBotVariants").hide();	
	if (params.botOrnamentSeries != "no"){
		$("#botOrnamentNumber").show();
		$("#showBotVariants").show();	
		}
	if (params.botOrnamentSeries == "no") {
		$("#botVariants").hide();
		$('#showBotVariants').text("показать эскизы");
		}
		
	$("#riserOrnamentNumber").hide();	
	$("#showRiserVariants").hide();
	$("#riserOrnamentPos").closest("tr").hide();
	if (params.riserOrnamentSeries != "no"){
		//$("#riserOrnamentNumber").show();
		$("#showRiserVariants").show();
		$("#riserOrnamentPos").closest("tr").show();
		}
	if (params.riserOrnamentSeries == "no") {
		$("#riserVariants").hide();
		$('#showRiserVariants').text("показать эскизы");
		}
		
	//выделяем выбранную превьюшку
	$("#riserVariants img").removeClass("selected");
	var selector = '#riserVariants img[data-folder="' + params.riserOrnamentNumber + '"]';
	$(selector).addClass("selected");

	}