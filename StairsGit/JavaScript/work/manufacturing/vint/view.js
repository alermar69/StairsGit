//обработчики
$(function(){
$("#leftMenu input:checkbox").click(function(){
var id = this.id;
selector = "#" + id.substring(5)
$(selector).toggle(200);
});

$("#viewTemplate").change(function(){
var template = $(this).val();
if(template == "монтаж"){
	//скрываем все блоки
	$("#leftMenu input:checkbox").each(function(){
		$(this).removeAttr("checked");
		var id = this.id;
		selector = "#" + id.substring(5)
		$(selector).hide(200);
		});
		
	//скрываем правое меню
	$("#rightMenu").hide(200);	
	$("#rightMenuShow").html("&laquo;")

	
	//показываем нужные
	$("#show_staircaseForm").attr("checked","checked");
	$("#show_balustradeFormDiv").attr("checked","checked");
	$("#show_assembling").attr("checked","checked");
	$("#show_geometry").attr("checked","checked");
	$("#show_assemblingInfo").attr("checked","checked");
	
	$("#staircaseForm").show(200);
	$("#balustradeFormDiv").show(200);
	$("#assembling").show(200);
	$("#geometry").show(200);
	$("#assemblingInfo").show(200);
	
	
	
	
	
	
	
	
	}

});

	
});