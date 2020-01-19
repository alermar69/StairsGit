/*$(function () {
	//показать диалоговое окно
	$(".showForgePrv").click(function(){
		$("#forgePrv").modal('show');
		selectImg()
	});
	
	
	$(".balPrv").click(function(){
		$(".balPrv").removeClass("selected");
		$(this).addClass("selected");
	});
	
	//кнопка применить
	$("#forgePrv .applySelected").click(function(){
		var balId = $("#forgePrv .balPrv.selected").attr("id")
		var inputId = $("#forgePrv #balPos").val();
		if($("#forgePrv #balPosUnit").val() == "balustrade") inputId += "_bal"
		$("#" + inputId).val(balId);
	});
	
	//изменение номера балясины
	$("#forgePrv #balPos").change(function(){
		selectImg()
	});
	
	//изменение лестница/балюстрада
	$("#forgePrv #balPosUnit").change(function(){
		selectImg()
	});
		
})

/**
функция выделяет картинку балясины, соответствующую устанавливаемому инпуту

*/
/*
function selectImg(){
	//получем значение инпута
	var inputId = $("#forgePrv #balPos").val();
	if($("#forgePrv #balPosUnit").val() == "balustrade") inputId += "_bal"
	var selectedBal = $("#" + inputId).val();
	
	//выделяем соответствующую картинку
	$(".balPrv").removeClass("selected");
	$("#forgePrv .balPrv#" + selectedBal).addClass("selected");

}
*/