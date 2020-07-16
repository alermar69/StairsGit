//обработчики

$(function () {
	 
	 //выравнивание ширины секций
	 $("#equalSectWidth").click(function(){
		equalSectWidth();
		recalculate();
		});
		
	 //добавление ряда
	$(".addRow").click(function(){
		//выцепляем к какой секции относится эта таблица параметров рядов
		var sectId = $(this).closest("div").attr('data-sectId');
		addBoxInputs(sectId);
		recalculate();
		});
		
	//выравнивание высоты рядов в секции
	$(".setEqualRowHeight").click(function(){
		//выцепляем к какой секции относится эта таблица параметров рядов
		var sectId = $(this).closest("div").attr('data-sectId');
		setEqualRowHeight(sectId);
		recalculate();
		});
	
	
	//удаление ряда 
	$(".sectRowsParams").delegate('.removeRow', 'click' , function(event) {
		//выцепляем к какой секции относится эта таблица параметров рядов
		var sectId = $(this).closest("div").attr('data-sectId');
		$(this).closest("tr").remove();
		reindexBoxParamsTable(sectId);
		$("#rowAmt" + sectId).val($("#rowAmt" + sectId).val()*1.0 - 1);		
		countFirstRowHeight(sectId)
	 })
	 
	//добавление полки
	$(".addShelf").click(function(){
		addShelfInputs();
		recalculate();
		});
		
	//удаление полки 
	$("#shelfParamsTable").delegate('.removeRow', 'click' , function(event) {
		$(this).closest("tr").remove();
		reindexShelfParamsTable();
		$("#shelfAmt").val($("#shelfAmt").val()*1.0 - 1);		
	 })
	 
	 
	 //открывание/закрываение дверок
	 $("#openDoors").click(function(){
		if(isDoorsOpened) {
			isDoorsOpened = false;
			$("#openDoors").text("Открыть дверки");
			} 
		else {
			isDoorsOpened = true;
			$("#openDoors").text("Закрыть дверки");
			}
		recalculate();	
		
		})
});

function mainFormChange(){
	
	//скрыть/показать параметры секций
	var sectAmt = $("#sectAmt").val() * 1.0;
	$(".sectTr").hide();
	$(".sectRowsParams").hide();
	for(var i=0; i<sectAmt; i++){
		$(".sectTr").eq(i).show();
		$(".sectRowsParams").eq(i).show();
		}
	
	//пересчет параметров секций
	countFirstSectionWidth()
	
	//пересчет параметров рядов
	for(var i=0; i<sectAmt; i++){
		countFirstRowHeight(i)
		}
	
	//варианты отделки
	
	$("#carcasPaint_wr").closest("tr").hide();
	if(params.carcasMat_wr != "лдсп") $("#carcasPaint_wr").closest("tr").show();
	
	$("#doorsPaint_wr").closest("tr").hide();
	if(params.doorsMat_wr != "лдсп") $("#doorsPaint_wr").closest("tr").show();
	
	$("#doorsPaint_wr option[value='лак']").show();
	$("#doorsPaint_wr option[value='морилка+лак']").show();
	if(params.doorsMat_wr == "мдф"){
		$("#doorsPaint_wr option[value='лак']").hide();
		$("#doorsPaint_wr option[value='морилка+лак']").hide();
		}
		
	//параметры полок
	$(".shelfParams").each(function(){
		//проверка корректности номера секции
		var shelfSectId = $(this).find(".shelfSectId").val();
		if(shelfSectId > params.sectAmt) {
			alert("Неверный номер секции!");
			$(this).find(".shelfSectId").val(1);
			}
		//размеры, позиция полок
		$(this).find(".shelfSizeX").closest("span").hide();
		$(this).find(".shelfSizeY").closest("span").hide();
		$(this).find(".shelfSizeZ").closest("span").hide();
		
		$(this).find(".shelfPosZ").closest("span").hide();
		
		var shelfType = $(this).find(".shelfType").val();
		if(shelfType == "полка"){
			$(this).find(".shelfSizeX").closest("span").show();
			$(this).find(".shelfSizeY").val(params.thinBoardThk);
			}
		if(shelfType == "штанга"){
			$(this).find(".shelfSizeX").closest("span").show();
			}
		if(shelfType == "перегородка"){
			$(this).find(".shelfSizeY").closest("span").show();
			$(this).find(".shelfSizeX").val(params.thinBoardThk);
			}
		
		})
}

function reindexBoxParamsTable(sectId){
	var rowAmt = $("#boxParamsTable" + sectId + " tr").length;
	for (var i=1; i<rowAmt; i++){
		$("#boxParamsTable" + sectId + " tr").eq(i).find(".rowNumber" + sectId).text(i);
		$("#boxParamsTable" + sectId + " tr").eq(i).find(".rowHeight" + sectId).attr("id", "rowHeight" + sectId + (i-1));
		$("#boxParamsTable" + sectId + " tr").eq(i).find(".rowType" + sectId).attr("id", "rowType" + sectId + (i-1));		
		}
}

function addBoxInputs(sectId){
	var rowAmt = $("#boxParamsTable" + sectId + " tr").length;
	var row = '<tr class="boxParams">' + 	
		'<td class="rowNumber' + sectId + '">' + rowAmt + '</td>' + 
		'<td><input class="rowHeight' + sectId + '" id="rowHeight' + sectId + (rowAmt - 1) + '" type="number" value="200"></td>' +

		'<td>' +
			'<select class="rowType' + sectId + '" id="rowType' + sectId + (rowAmt - 1) + '" size="1">' +
				'<option value="один ящик">один ящик</option>' +
				'<option value="два ящика">два ящика</option>' +
				'<option value="три ящика">три ящика</option>' +
				'<option value="четыре ящика">четыре ящика</option>' +
				'<option value="дверка">дверка</option>' +
				'<option value="две дверки">две дверки</option>' +
				'<option value="открытая">открытая</option>' +
			'</select>' +
		'</td>' +

		'<td><span class="removeRow">Х</span></td>' +
	'</tr>';
	
	$("#boxParamsTable" + sectId).append(row);
	$("#rowAmt" + sectId).val($("#rowAmt" + sectId).val()*1.0 + 1);
	countFirstRowHeight(sectId);
}

/** функция подготавливает таблицы для загрузки данных из базы
*/

function configBoxInputs(){
	$(".boxParams").remove();
	//перебор таблиц параметров рядов для всех секций
	for(var sectId = 0; sectId<4; sectId++){
		var rowAmt = $("#rowAmt" + sectId).val();
		$("#rowAmt" + sectId).val(0);
		for(var i=0; i<rowAmt; i++){
			addBoxInputs(sectId);
			}
		}
	
}

/**расчет ширины первой секции
*/

function countFirstSectionWidth(){
	var modelDim = getModelDimensions();

	var sectAmt = $("#sectAmt").val();
	if(sectAmt < 1) {
		sectAmt = 1;
		$("#sectAmt").val(1);
		}

	var totalWidth = 0;

	for (var i=1; i<sectAmt; i++){
		totalWidth += $("#sectWidth" + i).val() * 1.0;
		}

	var width0 = calcSumSectWidth() - totalWidth;
	if(width0 < 0) alert("Внимание! Сумма ширин секций больше 100%! Расчет не был произведен.")
	else $("#sectWidth0").val(width0);
}

function countFirstRowHeight(sectId){
	var modelDim = getModelDimensions();

	var rowAmt = $("#rowAmt" + sectId).val();
	if(rowAmt < 0) {
		rowAmt = 0;
		$("#rowAmt" + sectId).val(0);
		}

	var totalHeight = 0;

	for (var i=1; i<rowAmt; i++){
		totalHeight += $("#rowHeight" + sectId + i).val() * 1.0;
		}

	var height0 = calcSumRowHeight(sectId) - totalHeight;
	
	if(height0 < 0) alert("Внимание! Сумма ширин секций больше 100%! Расчет не был произведен.")
	else $("#rowHeight" + sectId + "0").val(height0);
}

/**выравнивание ширины всех секций
*/

function equalSectWidth(){
	
	var sectAmt = $("#sectAmt").val();
	var sectWidth = calcSumSectWidth() / sectAmt;

	for (var i=0; i<sectAmt; i++){
		$("#sectWidth" + i).val(sectWidth);
		}

}//end of equalSectWidth

/**выравнивание высоты рядов в секции
*/

function setEqualRowHeight(sectId){
	
	var rowAmt = $("#rowAmt" + sectId).val();
	var rowHeight = calcSumRowHeight(sectId) / rowAmt;

	for (var i=0; i<rowAmt; i++){
		$("#rowHeight" + sectId + i).val(rowHeight);
		console.log(rowAmt, rowHeight, sectId)
		}

}//end of equalSectWidth

/** функция расситывает суммарную ширину секций, для расчета ширины последней секции и выравнивания
ширины секций
*/

function calcSumSectWidth(){
	var modelDim = getModelDimensions();
	var sumWidth = $("#width").val() - modelDim.sideWall.newellSize * 2;
	sumWidth -= ($("#sectAmt").val() - 1) * modelDim.sectWallThk; //перемычки между секциями
	return sumWidth;
	
}//end of calcSumSectWidth


function calcSumRowHeight(sectId){
	var modelDim = getModelDimensions();
	var sumHeight = $("#height").val() - modelDim.leg - modelDim.door.topBeamSize - modelDim.door.botBeamSize - modelDim.countertop.thk;
	sumHeight -= ($("#rowAmt" + sectId).val() - 1) * modelDim.bridgeThk; //перемычки между секциями
	return sumHeight;
	
}//end of calcSumSectWidth


/** функция добавляет в таблицу параметров полок новую строку
*/

function addShelfInputs(){
	var shelfAmt = $("#shelfParamsTable tr").length;
	var row = '<tr class="shelfParams">' + 	
		'<td class="shelfNumber">' + shelfAmt + '</td>' + 
		'<td><input class="shelfSectId" id="shelfSectId' + (shelfAmt - 1) + '" type="number" value="1"></td>' +

		'<td>' +
			'<select class="shelfType" id="shelfType' + (shelfAmt - 1) + '" size="1">' +
				'<option value="полка">полка</option>' +
				'<option value="штанга">штанга</option>' +
				'<option value="перегородка">перегородка</option>' +
			'</select>' +
		'</td>' +
		'<td>' +
			'<span>X:<input class="shelfSizeX" id="shelfSizeX' + (shelfAmt - 1) + '" type="number" value="100"><br/></span>' +
			'<span>Y:<input class="shelfSizeY" id="shelfSizeY' + (shelfAmt - 1) + '" type="number" value="100"><br/></span>' +
			'<span>Z:<input class="shelfSizeZ" id="shelfSizeZ' + (shelfAmt - 1) + '" type="number" value="100"></span>' +
		'</td>' +
		'<td>' +
			'<span>X:<input class="shelfPosX" id="shelfPosX' + (shelfAmt - 1) + '" type="number" value="100"><br/></span>' +
			'<span>Y:<input class="shelfPosY" id="shelfPosY' + (shelfAmt - 1) + '" type="number" value="100"><br/></span>' +
			'<span>Z:<input class="shelfPosZ" id="shelfPosZ' + (shelfAmt - 1) + '" type="number" value="100"></span>' +
		'</td>' +
		'<td><span class="removeRow">Х</span></td>' +
	'</tr>';
	
	$("#shelfParamsTable").append(row);
	$("#shelfAmt").val($("#shelfAmt").val()*1.0 + 1);


} //end of addShelfInputs

function reindexShelfParamsTable(){
	var shelfAmt = $("#shelfParamsTable tr").length;
	for (var i=1; i<shelfAmt; i++){
		$("#shelfParamsTable tr").eq(i).find(".shelfNumber").text(i);
		$("#shelfParamsTable tr").eq(i).find("input, select, textArea").each(function(){
			var className = $(this).attr("class");
			$(this).attr("id", "className" + (i-1));
			});
		}
} //end of reindexShelfParamsTable

/** функция подготавливает таблицы для загрузки данных из базы
*/

function configShelfInputs(){
	$(".shelfParams").remove();

	var shelfAmt = $("#shelfAmt").val();
	$("#shelfAmt").val(0);
	for(var i=0; i<shelfAmt; i++){
		addShelfInputs();
		}
	
}