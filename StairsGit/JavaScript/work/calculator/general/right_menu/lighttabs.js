(function($){
	jQuery.fn.lightTabs = function(options){

        var createTabs = function(){
            tabs = this;
            i = 0;

            showPage = function(tabs, i){
                $(tabs).children("div").children("div").hide();
                $(tabs).children("div").children("div").eq(i).show();
                $(tabs).children("ul").children("li").removeClass("active");
                $(tabs).children("ul").children("li").eq(i).addClass("active");
            }

            showPage(tabs, 0);              

            $(tabs).children("ul").children("li").each(function(index, element){
                $(element).attr("data-page", i);
                i++;                        
            });

            $(tabs).children("ul").children("li").click(function(){
                showPage($(this).parent().parent(), parseInt($(this).attr("data-page")));
            });             
        };      
        return this.each(createTabs);
	};

	//сворачивание, разворачивание панели
	$('#rightMenuShow').click(function(){
		var cond = $("#rightMenu").css('display')
		$("#rightMenu").animate({width: 'toggle'}, 200);
		$("#rightMenuWrapper nav").animate({width: 'toggle'}, 200);
		
		$("#rightMenuResizer").toggle();
		$("#rightMenuWrapper button.recalculate").toggle();
		
		
		if(cond == "block") $("#rightMenuShow").html('<i class="fa fa-chevron-circle-left"></i>')
		else $("#rightMenuShow").html('<i class="fa fa-chevron-circle-right"></i>')
		
	});
	
	//ресайз
	$('#rightMenuResizer').on('mousedown', function(e) {
		$(document).on('mousemove', resize);
		$(document).on('mouseup', finishResize);
		
		var $wrapper = $("#rightMenu");
		var width = $wrapper.outerWidth(true);
		var left = $wrapper.offset().left;

		function resize(e) {
			
			$('body').css({'user-select': 'none'}) //отключаем выделение текста мышкой
			var delta = left - e.pageX;
			var newWidth = width + delta;

			$wrapper.css({
			  width: newWidth,
			});
		}

		function finishResize(e) {
			$('body').css({'user-select': 'auto'}) //включаем выделение текста мышкой
			$(document).off('mousemove', resize);
			$(document).off('mouseup', finishResize);
		}
		
		
	})
	
	//сворачиваем на мобильных
	//alert(window.innerWidth)
	if (window.innerWidth < 1000) { 
		$('#rightMenuShow').click(); 
	}
	
})(jQuery);