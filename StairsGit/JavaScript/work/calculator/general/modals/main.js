$(function () {
	//показать диалоговое окно
	$(".showModal").click(function(){
		var modalId = $(this).attr("data-modal")
		$("#" + modalId).modal('show');
		var modal = $("#" + modalId);
		
		//в зависимости от того, на какую кнопку ткнули, выбираем лестницу или балюстраду
		if(modalId != "textureModal"){
			if($(this).attr("data-unit") == "balustrade") modal.find(".balPosUnit").val("balustrade")
			else modal.find(".balPosUnit").val("staircase")
		}
		if(modalId == "textureModal"){
			modal.find("#textureUnit").val($(this).attr("data-unit"));
			showTexturesPrv();
		}
		
		selectImg(modal)
	});
	
	
	$(".modalItem").click(function(){
		$(this).closest(".modal").find(".modalItem").removeClass("selected");
		$(this).addClass("selected");
	});
	
	//кнопка применить в модальном окне
	$(".applySelected").click(function(){
		var modal = $(this).closest(".modal");
		var itemName = modal.find(".modalItem.selected").attr("data-itemName")
		var inputId = modal.find(".balPos").val();

		if(modal.attr("id") == "timberBalsModal") inputId = "timberBalModel";
		if(modal.attr("id") == "timberNewellsModal") inputId = "timberRackModel";
		if(modal.attr("id") == "startNewellModal") inputId = "startNewellModel";
		if(modal.attr("id") == "textureModal") inputId = $("#textureUnit").val();		
		if(modal.find(".balPosUnit").val() == "balustrade") inputId += "_bal"
		
		$("#" + inputId).val(itemName);
		var tm = getTextureMangerInstance();
		if (tm) {
			tm.updateMaterials();
		}
		// if(modal.attr("id") == "textureModal") {
		// 	gui.__folders['Настройки'].__controllers[7].setValue(true);
		// 	updateTextures();
		// };
	});
	
	//изменение номера балясины
	$(".balPos").change(function(){
		var modal = $(this).closest(".modal")
		selectImg(modal)
	});
	
	//изменение лестница/балюстрада
	$(".balPosUnit").change(function(){
		var modal = $(this).closest(".modal")
		selectImg(modal)
	});
		
})

/**
функция выделяет картинку балясины, соответствующую устанавливаемому инпуту

*/
function selectImg(modal){
	
	if(modal.attr("id") == "forgeModal"){
		//получем значение инпута
		var inputId = modal.find(".balPos").val();
		if(modal.find(".balPosUnit").val() == "balustrade") inputId += "_bal"
		var selectedBalName = $("#" + inputId).val();
		
		//выделяем соответствующую картинку
		modal.find(".modalItem").removeClass("selected");
		modal.find(".modalItem[data-itemName=" + selectedBalName + "]").addClass("selected");
	}
	
	if(modal.attr("id") == "timberBalsModal"){
		//получем значение инпута
		var inputId = "timberBalModel";
		if(modal.find(".balPosUnit").val() == "balustrade") inputId += "_bal"
		var selectedBalName = $("#" + inputId).val();
		
		//выделяем соответствующую картинку
		modal.find(".modalItem").removeClass("selected");
		modal.find(".modalItem[data-itemName=" + selectedBalName + "]").addClass("selected");
	}
	
	if(modal.attr("id") == "timberNewellsModal"){
		//получем значение инпута
		var inputId = "timberRackModel";
		if(modal.find(".balPosUnit").val() == "balustrade") inputId += "_bal"
		var selectedBalName = $("#" + inputId).val();
		
		//выделяем соответствующую картинку
		modal.find(".modalItem").removeClass("selected");
		modal.find(".modalItem[data-itemName=" + selectedBalName + "]").addClass("selected");
	}

}