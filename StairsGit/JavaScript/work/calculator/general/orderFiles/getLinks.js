$(function(){
	//фото с объекта
	$("#showPhotos").click(function(){
		getLinks($("#orderName").val(), "photos", "photos");
		if($(this).text() == "Показать") $(this).text("Свернуть")
		else $(this).text("Показать");
		});
	//техническая информация с объекта	
	$("#showTechInfo").click(function(){
		getLinks($("#orderName").val(), "techInfo", "techInfo");
		if($(this).text() == "Показать") $(this).text("Свернуть")
		else $(this).text("Показать");
		
		});
		
	$('#photos').delegate('.rotate-right', 'click',  function(){
		var self = $(this);
		var $img = self.next().find('img');
		$.ajax({
			url: '/calculator/general/orderFiles/rotateImage.php',
			data: {
				img: self.data('img')
			},
			dataType: 'json',
			success: function (result) {
				if(result.STATUS == 'SUCCESS'){
					var newImg = $img.attr("src").split("?")[0] + "?" + Math.random();
					$img.attr("src", newImg);
					$img.parent().attr('href', newImg)
				}else{
					alert(result.MESSAGE);
				}
			},
			error: function (a, b) {
				alert(b);
			}
		});
	});
	
});


function getLinks(offerName, target, divId){
	if(offerName == ""){
		alert("Не указан номер заказа!");
		return;
		}

	//выделяем номер заказа из имени расчета
	if(offerName.charAt(0) != "w"){
		var orderNameLength = offerName.indexOf("-");
		if(orderNameLength > 5) orderNameLength = 5;
		var orderName = offerName.slice(0, orderNameLength);
	}
	if(offerName.charAt(0) == "w"){
		var orderNameLength = 6;
		var orderName = offerName.slice(0, orderNameLength);
	}
		
	var setting = {
		type: 'POST',
		url: '/calculator/general/orderFiles/getLinks.php',
		data: {
		   orderName: orderName,
		   target: target,
		},
		success: function (data) {
			if(data){
				$('#'+divId).html(data);
				console.log($('#'+divId).find("li ul"))
				$('#'+divId).find("li ul").hide();
				
				$("p.folder").click(function(){
					$(this).next('ul').slideToggle(200);
					$("p.folder").removeClass('selected');
					$(this).addClass('selected');
					curFolder = $(this).closest('li').attr("data-folder");
					console.log(curFolder);
					
					//снимаем выделение со всех файлов
					clearSelectedFiles();
				
				})
		
				}
			},
		error: function (a, b) {
			alert(b);
			}
		};
		$.ajax(setting);
		$('#'+divId).toggle(500);
		return false;			
}