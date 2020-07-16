$(function () {
	$("#companyNameBlock").change(function(){
		var company = $("#companyNameBlock").val();
		$("#companyName").val(company);
		
		setCompany();
		
		});

});

function setCompany(){
	var company = $("#companyName").val();
	$(".header").hide();
	$(".footerText").hide();
	
	if(company == "Стиль-Т") $(".style-t").show();
	if(company == "Инсайд") $(".inside").show();

} //end of set company