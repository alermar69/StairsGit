$(function(){
    //селекторы блоков с таблицами
    downloadXls = function(selectors, url, full){
	var struct = {};
	struct['order'] = $('#orderName').val();
	struct['manager'] = $('#managerName').val();
	tables = []; 
	
	$.each(selectors, function(index, selector){
	    var $rows = $(selector + ' table tbody tr:visible');
	    var title = $(selector + ' h3:first').text();
	    var data = {};
	    data['title'] = title;
	    data['rows'] = [];
		
	    $rows.each(function(j, row){
	    	var $ceils = $(row).find('td');
			var amt = $($ceils[1]).text() * 1.0;
			if(selector == "#stock1_list") amt += $($ceils[2]).text() * 1.0;
			if(selector != "#timber_list")
				data['rows'].push([ $($ceils[0]).text(), amt, $($ceils[2]).text(), $($ceils[3]).text(), $($ceils[4]).text() ] );
			if(selector == "#timber_list")
				data['rows'].push([ $($ceils[0]).text(), $($ceils[2]).text(), $($ceils[3]).text(), $($ceils[1]).text(), $($ceils[4]).text() ] );
	    });
	    tables.push(data);
	});
	
	struct['tables'] = JSON.stringify(tables);
	var inputs = '';
	inputs+='<input type="hidden" name="order" value="'+ $('#orderName').val() +'" />';
	inputs+='<input type="hidden" name="manager" value="'+ $('#managerName').val() +'" />';
	inputs+='<input type="hidden" name="tables" value=\''+ JSON.stringify(tables) +'\' />';
	if(full)
		inputs+='<input type="hidden" name="type" value="full" />';
	$('<form action="'+url+'" method="POST">'+
                    inputs+'</form>').appendTo('body').submit().remove();
    };
	
	//сохранение ведомости заготовок в xls
	$("#poleList").delegate('#downLoadPoleList', 'click', function(){
		tableToExcel('partsTable', 'Детали',);
	})
    
});