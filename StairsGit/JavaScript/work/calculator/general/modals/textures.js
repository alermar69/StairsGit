$(function () {
	$("#textureUnit").change(function(){
		showTexturesPrv();
	})
	
	$("#textureFilter").change(function(){
		filterTextures();
	})
	
	$('#textureModal').on('show.bs.modal', function(){
		$.each($('#textureModal img[data-src]'), function(){
			$(this).attr('src', $(this).attr('data-src'))
			$(this).removeAttr('data-src')
		});
	})

	
});

function showTexturesPrv(){
	var textureUnit = $("#textureUnit").val();
	$("#textureImg .walls").hide();
	$("#textureImg .floor").hide();
	$("#textureFilter .walls").hide();
	$("#textureFilter .floor").hide();
	
	if(textureUnit == "wallsMat" || textureUnit == "ceilMat") {
		$("#textureImg .walls").show();
		$("#textureFilter .walls").show();
	}
	if(textureUnit == "floorMat" || textureUnit == "floorMat2") {
		$("#textureImg .floor").show();
		$("#textureFilter .floor").show();
	}
}

function filterTextures(){
	var filter = $("#textureFilter").val();
	console.log(filter)
	if(filter == "все") {
		$("#textureModal .modalItem").show();
		return;
	}
	
	$("#textureModal .modalItem").each(function(){
		if($(this).attr('data-itemname').toString().indexOf(filter) != -1) $(this).show()
		else $(this).hide()
	})
	
}