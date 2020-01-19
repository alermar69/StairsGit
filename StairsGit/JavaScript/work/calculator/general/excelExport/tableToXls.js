
function tableToExcel(tableId, name) {
	var uri = 'data:application/vnd.ms-excel;base64,'
	var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table style="border: 1px solid black;">{table}</table></body></html>'
	var base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
	var format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
  
	//if (!table.nodeType) table = document.getElementById(table);
	var $table = $("#" + tableId).clone();

	//преобразовываем инпуты в текст
	$table.find('td').each(function(){
		var $cell = $(this);
		if($cell.find('input,select,textarea').length){
			var text = ""
			$cell.find('input,select,textarea').each(function(){
				text += $(this).val();
			})
			$cell.html(text);
		}
	})
	
    var ctx = {worksheet: name || 'Worksheet', table: $table.html()}

	var sUrl = uri + base64(format(template, ctx));
	
	//Creating new link node.
    var link = document.createElement('a');
    link.href = sUrl;
	if(typeof params == "undefined") params = {};
	link.download = params.orderName || 'new.xls'; //имя файла для выгрузки 
 
    //Dispatching click event.
    if (document.createEvent) {
        var e = document.createEvent('MouseEvents');
        e.initEvent('click' ,true ,true);
        link.dispatchEvent(e);
        return true;
    }
	
   // window.location.href = link

  }
  
