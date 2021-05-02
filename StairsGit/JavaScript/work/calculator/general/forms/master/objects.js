
$(function(){
	
	//открытие модального окна
	$('#open_master_modal_obj').click(function(){
		$("#master_modal_obj").modal("show")
	});
	
	//кнопка добавить
	$('#ms_itemsParAdd').click(function(){
		addItemParRow($("#ms_itemsPar tr").length)
		obj_master_calcPrice()
	});
	
	//кнопка обновить
	$('#ms_itemsPriceRefresh').click(function(){
		obj_master_calcPrice()
	});
	
	//пересчитываем количество при удалении строки
	$('#ms_itemsPar').delegate('.removeRow', 'click', function(){
		$("#ms_itemAmt").val($("#ms_itemsPar .objectRow").length - 1)
	});
	

	//кнопка применить
	$('#ms_createObjects').click(function(){
		loadItemsFromTable();
	});

	//изменение количества
	$("#ms_itemAmt").change(function(){
		var newAmt = $(this).val();
		var delta = newAmt - $("#ms_itemsPar tr").length + 1;
		console.log(delta)
		
		//добавляем строки
		if(delta > 0){
			for(var i=0; i<delta; i++){
				addItemParRow($("#ms_itemsPar tr").length);
			}
		}
		
		//удаляем строки
		if(delta < 0){
			$("#ms_itemsPar tr").each(function(j){
				console.log(j)
				if(j > newAmt) $(this).remove();
			})
		}
		
		obj_master_calcPrice()
		
	})
	
	$('#ms_itemsPar').delegate('input,select', 'change', function(){
		obj_master_calcPrice()
	});
	
	
	
});

function loadItemsFromTable(){
  var className = $("#ms_model").val();
		
  window.additional_objects = []
  
  redrawAdditionalObjects();
  $.each($('#ms_itemsPar tbody tr.objectRow'), function(){
    var row = $(this);
    var length = row.find('.itemLen').val();
    var width = row.find('.itemWidth').val();
    var thk = row.find('.itemThk').val();
    var amt = row.find('.itemAmt').val();
    // Создаем объект болванку
    var obj = AdditionalObject.getDefaultObject(className);
    console.log(obj);
    // Присваиваем параметры
    obj.meshParams.windowWidth = length;
    obj.meshParams.len = length;

    obj.meshParams.width = width;
    obj.meshParams.windowPosZ = width - 100;
    obj.meshParams.thk = thk;

    obj.meshParams.objectAmt = amt;
    obj.calc_price = true;

    obj.position.z = 3000 * obj.id;
    
    window.additional_objects.push(obj);
  })

  redrawAdditionalObjects();
}

// Загрузка данных заказа созданного из garmonyc-mebel
function loadImportData(){
  var user_data = window.service_data.importData.user_data
  var price_data = window.service_data.importData.price_data
  
  var objects = price_data.objects;
  
  $("#ms_itemsPar tbody").html('');

  for (var i = 0; i < objects.length; i++) {
    var item = objects[i];
    var row = '<tr class="objectRow">\
        <td><input class="itemLen" type="number" value="' + item.len + '"></td>\
        <td><input class="itemWidth" type="number" value="' + item.width + '"></td>\
        <td><input class="itemThk" type="number" value="' + item.thk + '"></td>\
        <td><input class="itemAmt" type="number" value="' + item.amt + '"></td>\
        <td class="itemVol"></td>\
        <td class="itemArea"></td>\
        <td class="itemPaintingArea"></td>\
        <td class="removeRow" style="text-align: center">\
          <button class="btn btn-outline-danger" style="margin: 2px" data-toggle="tooltip" title="Удалить" data-original-title="Удалить">\
            <i class="fa fa-trash-o"></i>\
          </button>\
        </td>\
      </tr>';
      
    $("#ms_itemsPar tbody").append(row);
    
    $("#ms_itemAmt").val($("#ms_itemsPar .objectRow").length)
  }
  loadItemsFromTable();

  var par = window.service_data.importData.params;
  $('#additionalObjectsTimberMaterial').val(par.timberType);
  $('#timberPaint').val(par.timberPaint);
  $('#additionalObjectsTimberColor').val(par.timberColor);
  if (par.assembling == 'есть') $('#isAssembling').val('есть')
  
  // Записываем комментарий
  $('#comments_prod').val(user_data.comment);

  // Фиксируем цену
  $('#discountMode').val("цена");
  $("#discountFactor").val(price_data.totalPrice);

  window.additional_objects.forEach(function(obj){
    obj.meshParams.edgeModel = par.edgeType;
    obj.meshParams.edgeGeomTop = par.edgeGeomTop;
    console.log(par.edgeModel, par.edgeGeomTop)
  });

  recalculate();

  service_data.importData = null;
}

/** функция добавляет строку в таблицу параметров изделий в модальном окне **/
function addItemParRow(index){
	if(!index) index = 1;
	var row = '<tr class="objectRow">\
			<td><input class="itemLen" type="number" value="1000"></td>\
			<td><input class="itemWidth" type="number" value="300"></td>\
			<td><input class="itemThk" type="number" value="40"></td>\
			<td><input class="itemAmt" type="number" value="1"></td>\
			<td class="itemVol"></td>\
			<td class="itemArea"></td>\
			<td class="itemPaintingArea"></td>\
			<td class="removeRow" style="text-align: center">\
				<button class="btn btn-outline-danger" style="margin: 2px" data-toggle="tooltip" title="Удалить" data-original-title="Удалить">\
					<i class="fa fa-trash-o"></i>\
				</button>\
			</td>\
		</tr>';
		
	$("#ms_itemsPar tbody").append(row);
	
	$("#ms_itemAmt").val($("#ms_itemsPar .objectRow").length)
}

/** функция рассчитывает приблизительную цену **/
function obj_master_calcPrice(){
	var par = {
		vol: 0,
		area: 0,
		paintedArea: 0,
		objects: [],
		margin: 2.086885, //к-т подогнан под скидку 20%
		price: {},
		cost: {},
		text: '<table class="form_table" style="width: 100%"><tbody>',
	}
	
	var timberTypes = [
		"дуб ц/л",
		"дуб паркет.",
		"ясень ц/л",
		"ясень паркет.",		
		"шпон",		
		"лиственница ц/л",
		"лиственница паркет.",
	]
	
	//заголовки таблицы
	par.text += "<tr><th>№</th>"
	timberTypes.forEach(function(val){
		var timberName = val
		if(val == "лиственница ц/л") timberName = "листв. ц/л"
		if(val == "лиственница паркет.") timberName = "листв. парк."
		par.text += "<th>" + timberName + "</th>";
		par.price[val] = 0;
		par.cost[val] = 0;
	})
	par.price.assm = 0;
	par.cost.assm = 0;
		
	par.text += "<th>монтаж</th>"
	par.text += "</tr>"
	
	
	//перебираем таблицу с изделиями
	$("#ms_itemsPar .objectRow").each(function(i){
		var obj = {
			len: $(this).find(".itemLen").val() * 1.0,
			width: $(this).find(".itemWidth").val() * 1.0,
			thk: $(this).find(".itemThk").val() * 1.0,
			amt: $(this).find(".itemAmt").val() * 1.0,
			price: {},
			cost: {},
		}

		// obj.vol = Math.round(obj.len * obj.width * obj.thk * obj.amt / 1000000) / 1000;
		// obj.area = Math.round(obj.len * obj.width * obj.amt / 100000) / 10;

		var billetPar = calcBilletSize({
			len: obj.len,
			width: obj.width,
			thk: obj.thk,
			type: "щит"
		});
		obj.vol = billetPar.vol * obj.amt;
		obj.area = billetPar.area * obj.amt;

	//	obj.paintedArea = Math.round((obj.len * obj.width) * obj.amt * 2 / 100000 +  (obj.len + obj.width) * 2 * obj.thk / 100000) / 10;
		//формула расчета как в функции calcTimberPanelCost
		obj.paintedArea = Math.round(obj.width * obj.len * obj.amt / 1000000 * 1.5 * 100) / 100; //1.5 учитывает торцы и низ
		
		par.text += "<tr>\
			<td>" + (i + 1) + "</td>"
	
		
		timberTypes.forEach(function(val){
			var matCost = Math.round(calcTimberParams(val).m3Price * obj.vol);
			var paintCost =  Math.round(calcTimberPaintPrice(params.ms_timberPaint) * obj.paintedArea);
			
			//учитываем распиловку
			var perim = (obj.width + obj.len) * 2 / 1000
			var cutCost = getTimberCutCost(params.ms_shapeType) * perim;
			
			//себестоимость
			obj.cost[val] = Math.round(matCost + paintCost + cutCost);
			par.cost[val] += obj.cost[val];
			
			//цена
			obj.price[val] = Math.round(obj.cost[val] * par.margin);
			par.price[val] += obj.price[val];
			
			par.text += "<td>" + obj.price[val] + "</td>"
		})
		
		//монтаж
		obj.cost.assm = obj.amt * 1000 + obj.paintedArea * 2000
		par.cost.assm += obj.cost.assm;
		obj.price.assm = Math.round(obj.cost.assm * par.margin);
		par.price.assm += obj.price.assm;
		
		par.text += "<td>" + obj.price.assm + "</td>"
		
		par.text += "</tr>"
		
		par.vol += obj.vol
		par.area += obj.area
		par.paintedArea += obj.paintedArea
		par.objects.push(obj)
		
		//объем, площадь в основной таблице
		$(this).find(".itemVol").text(Math.round(obj.vol * 1000) / 1000)
		$(this).find(".itemArea").text(Math.round(obj.area * 10) / 10)
		$(this).find(".itemPaintingArea").text(Math.round(obj.paintedArea * 10) / 10)
		
	})
	
	//Итог
	par.text += "<tr class='bold'>\
			<td>Итого:</td>";
			
	timberTypes.forEach(function(val){
		//минималка
		var price = par.price[val];
		if(price < 3000) price = 3000;
		par.text += "<td>" + price + "</td>"
	})
	
	//миинималка на монтаж
	if(par.cost.assm < 3500){
		par.cost.assm = 3500
		par.price.assm = Math.round(par.cost.assm * par.margin);
	}
	
	par.text += "<td>" + par.price.assm + "</td>"
	par.text += "</tr>"
	
	//с монтажом
	par.text += "<tr class='bold'>\
			<td>С монтажом:</td>";
			
	timberTypes.forEach(function(val){
		//минималка на заказ с монтажом
		var price = Math.round(par.price[val] + par.price.assm)
		if(price < 20000) price = 20000;
		/*		
		var cost = Math.round(par.cost[val] + par.cost.assm);
		var vp = price - cost
		if(vp < 8000) price = cost + 8000;
		*/
		
		par.text += "<td>" + price + "</td>"
	})
	par.text += "<td></td>"
	par.text += "</tr>"
	
	
	par.text += "</tbody></table>"
	
	$("#ms_calc_result").html(par.text);
	
	console.log(par)
	
	return par;
}


