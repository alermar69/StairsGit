<?php
	//общие библиотеки
	include $_SERVER['DOCUMENT_ROOT']."/calculator/general/libs_man.php";
	
	//выцепляем модуль и представление из url
	
	$url = 'https://' . $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
	
	//модуль

	$calc_types = ['bolz', 'console', 'metal', 'mono', 'railing', 'timber', 'timber_stock', 'vhod', 'vint', 'geometry', 'wardrobe', 'curve'];

	$calc_type = '';
	foreach($calc_types as $item){
		if (strpos($url,'/'.$item) !== false) $calc_type = $item;
	};
	
	//представление
	$templates = ['calculator', 'manufacturing', 'installation', 'customers'];
	$template = '';
	foreach($templates as $item){
		if (strpos($url,'/'.$item) !== false) $template = $item;
	};
	
$scripts = [
	//metal
	[
		'url' => '/manufacturing/metal/ladderRailing.js',
		'only_for' => ['metal'],
	],
	[
		'url' => '/manufacturing/metal/drawSvg.js',
		'only_for' => ['metal', 'bolz', 'console','vhod'],
	],
	[
		'url' => '/manufacturing/metal/drawStaircase.js',
		'only_for' => ['metal', 'bolz', 'console'],
	],
	[
		'url' => '/manufacturing/metal/drawCarcasParts.js',
		'only_for' => ['metal', 'bolz', 'console', 'vhod'],
	],
	[
		'url' => '/manufacturing/metal/drawCarcasPartsLib_2.0.js',
		'only_for' => ['metal', 'bolz', 'console', 'vhod'],
	],
	[
		'url' => '/manufacturing/metal/drawRailing_3.0.js',
		'only_for' => ['metal', 'bolz', 'console', 'vhod'],
	],
	[
		'url' => '/manufacturing/metal/drawStringerPartsLt.js',
		'only_for' => ['metal', 'bolz', 'console', 'vhod'],
	],
	[
		'url' => '/manufacturing/metal/drawStringerPartsKo.js',
		'only_for' => ['metal', 'bolz', 'console', 'vhod'],
	],
	[
		'url' => '/manufacturing/metal/drawCarcas.js',
		'only_for' => ['metal', 'bolz', 'console', 'vhod'],
	],
	[
		'url' => '/manufacturing/metal/drawFrames.js',
		'only_for' => ['metal', 'bolz', 'console', 'vhod', 'vint', 'geometry'],
	],
	[
		'url' => '/manufacturing/metal/drawStringers.js',
		'only_for' => ['metal', 'bolz', 'console', 'vhod'],
	],
	[
		'url' => '/manufacturing/metal/testing.js',
		'only_for' => ['metal', 'bolz', 'console', 'console', 'vhod'],
	],
	[
		'url' => '/manufacturing/metal/calcSpec.js',
		'only_for' => ['bolz', 'console', 'metal', 'vhod'],
	],
	
	//bolz
	[
		'url' => '/manufacturing/bolz/drawCarcas.js',
		'only_for' => ['bolz'],
	],
	[
		'url' => '/manufacturing/bolz/drawCarcasParts.js',
		'only_for' => ['bolz'],
	],
	[
		'url' => '/manufacturing/bolz/drawRailing.js',
		'only_for' => ['bolz'],
	],
	
	//mono
	[
		'url' => '/manufacturing/mono/testing.js',
		'only_for' => ['mono'],
	],
	[
		'url' => '/manufacturing/mono/drawSvg.js',
		'only_for' => ['mono'],
	],
	[
		'url' => '/manufacturing/mono/drawStaircase.js',
		'only_for' => ['mono'],
	],
	[
		'url' => '/manufacturing/mono/drawCarcasParts.js',
		'only_for' => ['mono'],
	],
	[
		'url' => '/manufacturing/mono/drawStringerPartsMk.js',
		'only_for' => ['mono'],
	],
	[
		'url' => '/manufacturing/mono/drawCarcasPartsLib_2.2.js',
		'only_for' => ['mono'],
	],
	[
		'url' => '/manufacturing/mono/drawCarcas.js',
		'only_for' => ['mono'],
	],
	[
		'url' => '/manufacturing/mono/drawStringers.js',
		'only_for' => ['mono'],
	],
	[
		'url' => '/manufacturing/mono/drawRailing_3.0.js',
		'only_for' => ['console', 'mono'],
	],
	[
		'url' => '/manufacturing/mono/calcSpec.js',
		'only_for' => ['mono'],
	],
	[
		'url' => '/manufacturing/curve/drawCarcasParts.js',
		'only_for' => ['mono'],
	],
	//mono
	
	//console
	[
		'url' => '/manufacturing/console/drawCarcas.js',
		'only_for' => ['console'],
	],
	[
		'url' => '/manufacturing/console/drawCarcasParts.js',
		'only_for' => ['console'],
	],
	//railing
	[
		'url' => '/manufacturing/railing/drawStaircase.js',
		'only_for' => ['railing'],
	],
	[
		'url' => '/manufacturing/railing/concreteStairs.js',
		'only_for' => ['railing'],
	],
	[
		'url' => '/manufacturing/railing/drawRailing.js',
		'only_for' => ['railing'],
	],
	[
		'url' => '/manufacturing/railing/calcSpec.js',
		'only_for' => ['railing'],
	],
	[
		'url' => '/manufacturing/railing/testing.js',
		'only_for' => ['railing'],
	],
	//timber
	[
		'url' => '/manufacturing/timber/drawStaircase.js',
		'only_for' => ['timber'],
	],
	[
		'url' => '/manufacturing/timber/drawCarcasParts.js',
		'only_for' => ['timber', 'timber_stock', 'geometry'],
	],
	[
		'url' => '/manufacturing/timber/drawStringerParts.js',
		'only_for' => ['timber', 'timber_stock'],
	],
	[
		'url' => '/manufacturing/timber/drawNewell.js',
		'only_for' => ['timber'],
	],
	[
		'url' => '/manufacturing/timber/drawCarcas.js',
		'only_for' => ['timber'],
	],
	[
		'url' => '/manufacturing/timber/drawRailing.js',
		'only_for' => ['bolz', 'console', 'metal', 'mono', 'timber', 'timber_stock', 'vint'],
	],
	[
		'url' => '/manufacturing/timber/calcSpec.js',
		'only_for' => ['timber'],
	],
	[
		'url' => '/manufacturing/timber/testing.js',
		'only_for' => ['timber'],
	],
	//timber_stock
	[
		'url' => '/manufacturing/timber_stock/drawStaircase.js',
		'only_for' => ['timber_stock'],
	],
	[
		'url' => '/manufacturing/timber_stock/drawCarcas.js',
		'only_for' => ['timber_stock','geometry'],
	],
	[
		'url' => '/manufacturing/timber_stock/drawSvg.js',
		'only_for' => ['timber_stock'],
	],
	[
		'url' => '/manufacturing/timber_stock/calcSpec.js',
		'only_for' => ['timber_stock'],
	],
	[
		'url' => '/manufacturing/timber_stock/testing.js',
		'only_for' => ['timber_stock'],
	],
	[
		'url' => '/calculator/timber_stock/forms/stockFormsChange.js',
		'only_for' => ['timber_stock'],
	],
	//vhod
	[
		'url' => '/manufacturing/vhod/drawStaircase.js',
		'only_for' => ['vhod'],
	],
	[
		'url' => '/manufacturing/vhod/drawVhodStock.js',
		'only_for' => ['vhod'],
	],
	[
		'url' => '/manufacturing/vhod/calcSpec.js',
		'only_for' => ['vhod'],
	],
	//vint
	[
		'url' => '/manufacturing/vint/draw_vint.js',
		'only_for' => ['vint'],
	],
	[
		'url' => '/manufacturing/vint/drawRailing.js',
		'only_for' => ['vint'],
	],
	[
		'url' => '/manufacturing/vint/drawCarcasParts.js',
		'only_for' => ['vint'],
	],
	[
		'url' => '/manufacturing/vint/calcSpec.js',
		'only_for' => ['vint'],
	],
		[
		'url' => '/manufacturing/vint/testing.js',
		'only_for' => ['vint'],
	],
	[
		'url' => '/manufacturing/bolz/drawCarcasParts.js',
		'only_for' => ['vint'],
	],
	
	//geometry
	[
		'url' => '/calculator/geometry/drawStaircase.js',
		'only_for' => ['geometry'],
	],
	
	[
		'url' => '/calculator/geometry/drawDimensions.js',
		'only_for' => ['geometry'],
	],
	
	[
		'url' => '/calculator/geometry/draw2DLib.js',
		'only_for' => ['geometry'],
	],
	
	//all
	[
		'url' => '../general/main.js',
	],
];

	//специфические скрипты для модулей
	
	if($template == 'calculator' && $calc_type != 'geometry'){
		$scripts[] = [
				'url' => 'priceCalc.js',
			];
		$scripts[] = [
				'url' => 'forms/templates.js',
			];
		$scripts[] = [
				'url' => '/calculator/metal/priceCalc.js',
				'only_for' => ['vhod'],
			];
	};

	if(($template == 'calculator' || $template == 'customers') && $calc_type != 'geometry'){
		$scripts[] = [
				'url' => '/calculator/' . $calc_type . '/change_offer.js',
			];
	};

	if($calc_type == 'wardrobe'){
		$scripts[] = [
			'url' => 'priceCalc.js',
		];
		$scripts[] = [
			'url' => 'drawWardrobe.js',
		];
		$scripts[] = [
			'url' => 'drawWardrobeParts.js',
		];
		$scripts[] = [
			'url' => 'drawWardrobe.js',
		];
		$scripts[] = [
			'url' => 'main.js',
		];
	};
	
	//вывод скриптов на страницу
	foreach($scripts as $script){
		$printScript = true;
		if(isset($script['only_for']) && !in_array($calc_type, $script['only_for'])) $printScript = false;
		if($printScript){
			echo '<script type="text/javascript" src="' . $script['url'] . '"></script>';
		};
	};
	


	
?>

<script>
$(function(){
	//отправка на печать
	$("#print").click(function(){	

		if($(this).text() == "Печать"){
			//window.print();
			$(this).text("Редактировать")
			togglePrintMode(true);
		}
		else {
			togglePrintMode(false);
			$(this).text("Печать");
		}
		
	})
	
	//включение/выключение печати блоков
	$("body").delegate(".togglePrint", "click", function(){
		$(this).toggleClass("grey") //добавляем кнопке класс, чтобы можно было отличить блоки, отключенные пользователем
		$(this).closest('div.printBlock').toggleClass("noPrint").show();
	})
	
	//сворачивание, разворачивание панели
	$('#panelToggle').click(function(){
		var cond = $(".panelBody").css('display')
		
		//$(".panelBody").toggleClass("d-none");
		$(".panelBody").animate({width: 'toggle'}, 200);
		
		$(".panelWrap").toggleClass("visible");
		$(".panelResizer").toggleClass("d-none");
		$(".panelWrap button.recalculate").toggleClass("d-none");
		
		
		if(cond == "block") $("#panelToggle").html('<i class="fa fa-chevron-circle-left"></i>')
		else $("#panelToggle").html('<i class="fa fa-chevron-circle-right"></i>')
		
	});
	
	//ресайз
	$('.panelResizer').on('mousedown', function(e) {
		$(document).on('mousemove', resize);
		$(document).on('mouseup', finishResize);
		
		var $wrapper = $(".panelBody");
		var width = $wrapper.outerWidth(true);
		var left = $wrapper.offset().left;

		function resize(e) {
			
			$('body').css({'user-select': 'none'}) //отключаем выделение текста мышкой
			var delta = left - e.pageX;
			var newWidth = width + delta;

			$wrapper.css({
			  'width': newWidth,
			  'max-width': 'unset',
			});
			
		}

		function finishResize(e) {
			$('body').css({'user-select': 'auto'}) //включаем выделение текста мышкой
			$(document).off('mousemove', resize);
			$(document).off('mouseup', finishResize);
		}
		
		
	})
	

	
});

function getArrItemByProp(arr, prop, val){
	if(!arr || !prop) return false;
	
	for(var i=0; i<arr.length; i++){
		if(typeof arr[i] != 'undefined' && arr[i][prop] == val){
			return arr[i];
			}
		}
	return false;
} //end of getItemById


/** функция включает/выклчает режим печати на странице
*/

function togglePrintMode(printMode){
	
	if(printMode){
		$("body").addClass("print")
		
		//добавляем кнопочки во все блоки, если их еще нет
		if($(".togglePrint").length == 0) {
			$(".printBlock").prepend("<div class='togglePrint'><span class='fa fa-print'></span></div>");
		}
		
		//показываем те блоки, где печать была отключена пользователем
		$(".togglePrint.grey").closest("div.printBlock").show();
	}
	else{
		$("body").removeClass("print")
	}
	
	$(".mainButtons").show();
	
}; //end of togglePrintMode

</script>
