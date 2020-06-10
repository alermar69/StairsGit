 $(function(){
	
	//добавление секции
	$("#addBanisterSect").click(function(){
		addBanisterSect()
        //переиндексируем Id
        reindexId('balSectTable');
		changeAllForms();
    });
	
	$('#redrawBanister').click(function(){
		changeAllForms();
		drawBanister();		
	});
});

/** функция проставляет соединения секций
*/

function setBanisterConnections(){
	$(".balSectRow").each(function(i){
		var con = "нет";
		if($(this).find(".balSectType").val() == "секция"){
			//стыковка в начале
			var startCon = false;
			if(i > 0 && $(".balSectRow").eq(i-1).find(".balSectType").val() == "секция") startCon = true;
			
			//стыковка в конце
			var endCon = false;
			if($(".balSectRow").eq(i+1).find(".balSectType").val() == "секция") endCon = true;
			
			if(startCon) con = "начало";
			if(endCon) con = "конец";
			if(startCon && endCon) con = "две стороны";
		}
		
		$(this).find(".balSectConn").val(con)
		
	})
}


changeFormBanister = function(){
	$(".balSectRow").remove();
	var amt = $('#banisterSectionAmt').val();
	for(var i = 0; i < amt; i++){
		addBanisterSect()
	}
	//переиндексируем Id
	reindexId('balSectTable');

};

function addBanisterSect(){
	 var text = 
		'<tr class="balSectRow" data-object_selector="balSectRow">\
			<td>\
				<select id="banisterSectionType0" size="1" class="balSectType">\
					<option value="секция">секция</option>\
					<option value="отступ">отступ</option>\
				</select>\
			</td>\
			<td>\
				<select id="banisterSectionDirection0" size="1" onchange="">\
					<option value="вперед">вперед</option>\
					<option value="назад" selected>назад</option>\
					<option value="вправо">вправо</option>\
					<option value="влево">влево</option>\
				</select>\
			</td>\
			<td>\
				<input type="number" id="banisterSectionLength0" value="1000" step="100" />\
			</td>\
			<td>\
				<select id="banisterSectionConnection0" size="1" class="balSectConn">\
					<option value="начало">начало</option>\
					<option value="конец">конец</option>\
					<option value="две стороны">две стороны</option>\
					<option value="нет" selected>нет</option>\
				</select>\
			</td>\
			<td>\
				<select id="banisterFlan0" size="1" class="banisterFlan">\
					<option value="начало">начало</option>\
					<option value="конец">конец</option>\
					<option value="две стороны">две стороны</option>\
					<option value="нет" selected>нет</option>\
				</select>\
			</td>\
			<td class="noPrint">\
				<button class="removeRow">Удалить</button>\
			</td>\
		</tr>';
		$('#balSectTable tbody').append(text);
};

