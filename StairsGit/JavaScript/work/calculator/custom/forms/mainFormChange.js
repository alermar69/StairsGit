

function configMainForm(){
	$(".estimateItem").remove();
	 var amt = $('#rowAmt').val();
	for(var i = 0; i < amt; i++){
		addRow();
	}
	reindexTable()
}


function addRow(){
	var id=$("tr.estimateItem").length;
	var row = "<tr class='estimateItem'>\
		<td class='id'></td>\
		<td><textarea id='name" + id + "' class='name'></textarea></td>\
		<td><input type='number' id='amt" + id + "' class='amt' value='1'></td>\
		<td><input type='number' id='unitPrice" + id + "' class='unitPrice' value='200'></td>\
		<td class='summ'></td>\
		<td class='noPrint'>\
			<select id='unitType" + id + "' class='unitType'>\
				<option value='изделие'>изделие</option>\
				<option value='монтаж'>монтаж</option>\
				<option value='доставка'>доставка</option>\
			</select>\
		</td>\
		<td class='noPrint'><input type='number' id='сost" + id + "' class='сost' value='100'></td>\
		<td class='noPrint'><input type='number' id='metalPart" + id + "' class='metalPart' value='0'></td>\
		<td class='noPrint'><input type='number' id='timberPart" + id + "' class='timberPart' value='0'></td>\
		<td class='noPrint'><input type='number' id='partnersPart" + id + "' class='partnersPart' value='0'></td>\
		<td class='removeRow noPrint'>X</td>\
	</tr>";

	$("#mainForm").append(row);
	$("#rowAmt").val($("#rowAmt").val()*1 + 1);
	
};

function reindexTable(){
	$(".estimateItem").each(function(i){
		$(this).find(".id").text(i+1);
		$(this).find("input,textarea").each(function(){
			$(this).attr('id', $(this).attr('class') + i)
		});
		//пересчитываем % работы подрядчиков
		if($(this).find(".unitType").val() == "изделие"){
			var parts = {
				metal: $(this).find(".metalPart").val(),
				timber: $(this).find(".timberPart").val(),
			};
			var partnersPart = 100;
			$.each(parts, function(){
				partnersPart -= this;
			})
			
			$(this).find(".partnersPart").val(partnersPart)
			if(partnersPart < 0) alert("ВНИМАНИЕ ОШИБКА! Отрицательная часть подрядчика! Проверьте цифры")
		}
		else{
			$(this).find(".metalPart").val(0)
			$(this).find(".timberPart").val(0)
			$(this).find(".partnersPart").val()
		}
	})
	
	
	
}

/** функция рассчитывает процент монтажа в цене изделия
*/
function calcPartnersPart(){
	var parts = {
		metal: $("#metalPart").val(),
		timber: $("#timberPart").val(),
		partners: $("#partnersPart").val(),
	};
	
	var assemblingPart = 100;
	$.each(parts, function(){
		assemblingPart -= this;
	})
	
	$("#assemblingPart").val(assemblingPart);
	if(assemblingPart < 0) alert("ВНИМАНИЕ ОШИБКА! Сумма частей больше 100%! Проверьте цифры")
}