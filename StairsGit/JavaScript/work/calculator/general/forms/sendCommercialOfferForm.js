
$(function () {
	$('#send_co').click(function(){
		$('#commercialOfferModal').modal("show");
	});
	$('#sendCommercialOffer').click(function(){
		//из раздела /dev/ шлем с тестового контроллера
		var testDb = false;
		var url = document.location.href;
		if(url.indexOf("dev") != -1) testDb = true;
		
		var queryUrl = "/orders/mailer-controller/action-create";
		if(testDb) queryUrl = "/dev/egorov/orders/mailer-controller/action-create";

		var fd = new FormData;
		fd.append('subject', $('#co_subject').val());
		fd.append('body',$('#co_body').val() + '<img src="cid:logo">');
		fd.append('manager_name', $('#managerName').val());
		fd.append('client_email',$('#co_client_email').val());
		fd.append('client_name', "AS");
		fd.append('attachment', $("#co_attachment").prop('files')[0]);
		$.ajax({
			url: queryUrl,
			type: 'POST',
			data: fd,
			processData: false,
			contentType: false,
			success: function(data){
				console.log(data)
				$('#commercialOfferModal').modal("hide");
			},
			error: function(result){
				console.log('error', result)
			},
		});
	});
});