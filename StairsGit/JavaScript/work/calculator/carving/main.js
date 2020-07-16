var params = {}; //глобальный массив значений инпутов

$(function () {
	
	changeFormMain();
	recalculate();
	getLinks("riserPrv");
	
	//перерисовка картинки при изменении любого инпута
	$('.form_table').delegate('select', 'change', function(){	
		changeFormMain();
		recalculate();
		}
	);

	//показать/скрыть эскизы вариантов верхнего орнамента
	$("#topVariants").hide();
	$('#showTopVariants').text("показать эскизы");
	$('#showTopVariants').click(function(){
		$("#topVariants").slideToggle();
		var text = $('#showTopVariants').text();
		if(text == "показать эскизы")
			$('#showTopVariants').text("скрыть эскизы");
		else
			$('#showTopVariants').text("показать эскизы");
		});
		
	//показать/скрыть эскизы вариантов нижнего орнамента
	$("#botVariants").hide();
	$('#showBotVariants').text("показать эскизы");
	$('#showBotVariants').click(function(){
		$("#botVariants").slideToggle();
		var text = $('#showBotVariants').text();
		if(text == "показать эскизы")
			$('#showBotVariants').text("скрыть эскизы");
		else
			$('#showBotVariants').text("показать эскизы");
		});
		
	//показать/скрыть эскизы вариантов орнамента подступенков
	$("#riserVariants").hide();
	$('#showRiserVariants').text("показать эскизы");
	$('#showRiserVariants').click(function(){
		$("#riserVariants").slideToggle();
		var text = $('#showRiserVariants').text();
		if(text == "показать эскизы")
			$('#showRiserVariants').text("скрыть эскизы");
		else
			$('#showRiserVariants').text("показать эскизы");
		});

//временно убираем узор каркаса
$(".carcas").hide();
		
//обработчики чекбоксов левого меню
$("#showCarcas").click(function(){
	$(".carcas").slideToggle();
	});
$("#showRisers").click(function(){
	$(".risers").slideToggle();
	});
	
//обработка клика по превьюшке узора
$('.variants').delegate('img', 'click', function(){
	var ornamentId = $(this).attr("data-folder");
	$(this).closest("td").find(".ornamentId").val(ornamentId);	
	recalculate();	
	});

//замена превьюшек при изменении серии узора
$("#riserOrnamentSeries").change(function(){
	changeFormMain();
	getLinks("riserPrv");
	})
	

	
changeAllForms = function () {
	getAllInputsValues(params);
	}
	
configDinamicInputs = function() {		
	changeAllForms();		
		}
	
	//пересчитываем лестницу
	recalculate();
/*	
	var orderName = $.urlParam('orderName');
	if(orderName){
		$('#orderName').val(orderName);
		_loadFromBD('content', '/calculator/general/db_data_exchange/dataExchangeXml_2.1.php', orderName)
	}
*/
	$('.main-content').delegate('input,select,textarea', 'change', function(){
	  isPageChanged = true;
	});
	window.onbeforeunload = confirmExit;
	function confirmExit(){
	    	 return (isPageChanged ? "Измененные данные не сохранены. Закрыть страницу?" : false); 
		
	}

});

function recalculate(){
	try {
		drawOrnaments();
		getLinks("files");
		changeFormMain();
	} catch (error) {
		prepareFatalErrorNotify(error);
	}
}