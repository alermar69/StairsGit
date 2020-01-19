function getLinks(type){

	var divId = "imgFiles";
	if(type == "riserPrv") var divId = "riserVariants";
	
	console.log(divId);
	
	var setting = {
		type: 'POST',
		url: '/calculator/carving/getFiles/getLinks.php',
		data: {
			linkType: type,
			topOrnamentSeries: params.topOrnamentSeries,
			topOrnamentNumber: params.topOrnamentNumber,
			botOrnamentSeries: params.botOrnamentSeries,
			botOrnamentNumber: params.botOrnamentNumber,
			riserOrnamentSeries: params.riserOrnamentSeries,
			riserOrnamentNumber: params.riserOrnamentNumber,
			stringerType: params.stringerType,
			},
		success: function (data) {
			if(data){
				$('#'+divId).html(data);	
				console.log(data);
				}
			},
		error: function (a, b) {
			alert(b);
			}
		};
		
		$.ajax(setting);
		//$('#'+divId).toggle(500);
		return false;			
}

