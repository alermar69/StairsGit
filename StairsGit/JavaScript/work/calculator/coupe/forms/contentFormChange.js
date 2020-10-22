var selectedItems = [];

$(function () {

 //добавление полки
	$("#addBox").click(function(){
		addBoxInputs();
		recalculate();
		});
		
	//выравнивание высоты полок
	$("#equalboxHeight").click(function(){
		equalboxHeight();
		recalculate();
		});
	
	//копирование полки
	$("#copyBox").click(function(){
		copyBox();
		reindexBoxParamsTable();
		recalculate();
		});

	//удаление полки 
	$("#boxParamsTable").delegate('.removeRow', 'click' , function(event) {
		$(this).closest("tr").remove();
		$("#boxAmt_wr").val($("#boxAmt_wr").val()*1.0 - 1);
		reindexBoxParamsTable();
		recalculate();
		});
		

	 //изменение зазора до элемента сверху и снизу
	$('#boxParamsTable').delegate('.distTop, .distBot', "change", function(){

		var delta = $(this).val() * 1.0 - params[this.id];
		var boxRow = $(this).closest("tr").find(".boxRow").val()*1.0;
		
		if($(this).hasClass("distTop")) boxRow -= delta;
		if($(this).hasClass("distBot")) boxRow += delta;

		$(this).closest("tr").find(".boxRow").val(boxRow);				
				
		recalculate();
	});
		
		

});

function changeFormContent(){

	$("#boxParamsTable .boxType").each(function(){
		
		//позиция по X
		$(this).closest("tr").find(".boxPosX").closest("span").hide();
		if($(this).val() == "перегородка" || 
			$(this).val() == "выдв. штанга" || 
			$(this).val() == "стойка")
				$(this).closest("tr").find(".boxPosX").closest("span").show();
		
		//ширина полки
		$(this).closest("tr").find(".boxWidth").closest("span").show();
		if($(this).val() == "перегородка" || 
			$(this).val() == "выдв. штанга" ||
			$(this).val() == "стойка") 
				$(this).closest("tr").find(".boxWidth").closest("span").hide();
		
		//точная ширина полки
		$(this).closest("tr").find(".boxWidth").hide();
		if($(this).closest("tr").find(".boxWidthType").val() == "задается"){
			$(this).closest("tr").find(".boxWidth").show();
			$(this).closest("tr").find(".boxPosX").closest("span").show();
			}
			
		//боковой зазор полки
		$(this).closest("tr").find(".shelfSideOffset").closest("span").hide();
		if($(this).val() == "полка" || $(this).val() == "полки"){
			$(this).closest("tr").find(".shelfSideOffset").closest("span").show();
			}
		
		//размер ящика по Y
		$(this).closest("tr").find(".boxHeight").closest("span").show();
		
		if($(this).val() == "полка") {
			$(this).closest("tr").find(".boxHeight").closest("span").hide();
			$(this).closest("tr").find(".boxHeight").val(params.carcasThk_wr);
			}
		
		if($(this).val() == "штанга") {
			$(this).closest("tr").find(".boxHeight").closest("span").hide();
			$(this).closest("tr").find(".boxHeight").val(25);
			}
			
		if($(this).val() == "выдв. штанга") {
			$(this).closest("tr").find(".boxHeight").closest("span").hide();
			$(this).closest("tr").find(".boxHeight").val(60);
			}
			
		if($(this).val() == "пантограф") {
			//$(this).closest("tr").find(".boxHeight").closest("span").hide();
			$(this).closest("tr").find(".boxHeight").val(880);
			}
			
		//параметры ящиков
		$(this).closest("tr").find(".boxCarcasHeight").closest("span").hide();
		$(this).closest("tr").find(".itemsGap").closest("span").hide();
		$(this).closest("tr").find(".boxHandles").closest("span").hide();
		if($(this).val() == "ящик" || $(this).val() == "ящики") {
			$(this).closest("tr").find(".boxCarcasHeight").closest("span").show();
			$(this).closest("tr").find(".itemsGap").closest("span").show();
			$(this).closest("tr").find(".boxHandles").closest("span").show();
			
			var carcasHeight = $(this).closest("tr").find(".boxCarcasHeight").val() * 1.0;
			var posY = $(this).closest("tr").find(".boxDoorPlusBot").val() * 1.0;
			if($(this).closest("tr").find(".boxHeight").val()*1.0 < carcasHeight + posY){				
				$(this).closest("tr").find(".boxHeight").val(carcasHeight + posY)
				}
			if(params.boxType == "метабоксы"){
				var boxCarcasHeight = $(this).closest("tr").find(".boxCarcasHeight").val();
				$(this).closest("tr").find(".boxCarcasHeight").css("background-color","#FFFFFF");
				if(boxCarcasHeight != 54 && boxCarcasHeight != 86 && boxCarcasHeight != 118 && boxCarcasHeight != 150){
					//alert("Внимание! Введена нестандартная глубина метабокса " + boxCarcasHeight + " мм. Стандартные размеры 54; 86; 118; 150мм")
					$(this).closest("tr").find(".boxCarcasHeight").css("background-color","#FFC5C5");
					}
				}
			}
			
		//параметры фасада
		$(this).closest("tr").find(".fasadParams").show();
		if($(this).val() == "полка" || $(this).val() == "штанга" || $(this).val() == "перегородка" || $(this).val() == "выдв. штанга") 
			$(this).closest("tr").find(".fasadParams").hide();
		
		//установка ширины ящика по секции
		if($(this).closest("tr").find(".boxWidthType").val() == "по секции"){
			var sectId = $(this).closest("tr").find(".boxSect").val() - 1
			var sectWidth = $("#sectWidth" + sectId).val()
			$(this).closest("tr").find(".boxWidth").val(sectWidth)
			}
			
		//запрет увеличения фасада для шкафов со стороны петель
		if($(this).val() == "шкаф прав." || $(this).val() == "шкаф две"){
			$(this).closest("tr").find(".boxDoorPlusRight").val(0)
			}
		if($(this).val() == "шкаф лев." || $(this).val() == "шкаф две"){
			$(this).closest("tr").find(".boxDoorPlusLeft").val(0)
			}
		
		//фурнитура штанг стоек
		$(this).closest("tr").find(".poleEnds").hide();
		if($(this).val() == "стойка" || $(this).val() == "штанга")
			$(this).closest("tr").find(".poleEnds").show();
		
		//параметры группы полок или ящиков
		$(this).closest("tr").find(".boxGroupPar").hide();
		if($(this).val() == "полки" || $(this).val() == "ящики") {
			$(this).closest("tr").find(".boxGroupPar").show();
		}
		
	});
		
		
	
	//фильтр параметров полок
	$("#curSect option").hide();
	var optionsAmt = $("#sectAmt").val()*1.0 + 2;
	$("#curSect option").hide();
	$("#curSect option:lt(" + optionsAmt + ")").show();
	
	if($("#curSect").val() != "все" && $("#curSect").val() != "выбранные"){
		$(".boxSect").each(function(){
			if($(this).val() != $("#curSect").val())
				$(this).closest("tr").hide();
			else $(this).closest("tr").show();
			
				
			});
			}
	if($("#curSect").val() == "все") 
		$(".boxSect").closest("tr").show();
	
	if($("#curSect").val() == "выбранные") {
		$(".boxSect").closest("tr").hide();
		//показываем полки, номера которых есть в глобальном массиве
		$(".boxSect").each(function(i){
			if(selectedItems.indexOf(i) != -1){
				$(this).closest("tr").show();
				console.log(i)
				}
			
			});
		
		
		}

//операции с наполенением шкафа
$("#copySect").closest("span").hide();
$("#copyType").closest("span").show();
$("#copyMooveY").closest("span").show();

if(params.copySectType == "другая") {
	$("#copySect").closest("span").show();
	$("#copyType").closest("span").hide();
	$("#copyMooveY").closest("span").hide();
	$("#copyMooveY").val(0);
	}
	
if(params.copySectType == "та же" && $("#copyMooveY").val() == 0) {
	$("#copyMooveY").val(100);	
	}
	
//Рассчитываем расстояние до ближайшего элемента сверху и снизу
for(var i=0; i<params.sectAmt; i++) calcBoxDist(i)
	
}//end of changeFormContent;


function addBoxInputs(){
	var rowAmt = $("#boxParamsTable tr").length;
	var curSect = $("#curSect").val();
	if(curSect == "все" || curSect == "выбранные") curSect = 1;
	var row = '<tr class="boxParams">' + 	
		'<td><input class="boxSect" id="boxSect' + (rowAmt - 1) + '" type="number" value="' + curSect + '"></td>' +
		'<td>' + 
			'<span>X: <input class="boxPosX" id="boxPosX' + (rowAmt - 1) + '" type="number" value="0"></span>' + 
			'<span>Y: <input class="boxRow" id="boxRow' + (rowAmt - 1) + '" type="number" value="0"></span>' + 	
			'Зазор: <br/>' + 
			'<span>В:<input class="distTop" id="distTop' + (rowAmt - 1) + '" type="number" value="0"></span>' + 
			'<span>Н:<input class="distBot" id="distBot' + (rowAmt - 1) + '" type="number" value="0"></span>' + 
			//'<span>Л:<input class="distLeft" id="distLeft' + (rowAmt - 1) + '" type="number" value="0"></span>' + 
			//'<span>П:<input class="distRight" id="distRight' + (rowAmt - 1) + '" type="number" value="0"></span>' + 
		'</td>' +
		'<td><span> X: ' + 
			'<select class="boxWidthType" id="boxWidthType' + (rowAmt - 1) + '" size="1">' +
				'<option value="по секции">по секции</option>' +
				'<option value="задается">задается</option>' +
			'</select>' +
			'<input class="boxWidth" id="boxWidth' + (rowAmt - 1) + '" type="number" value="200"></span>' +
			'<span>Y: <input class="boxHeight" id="boxHeight' + (rowAmt - 1) + '" type="number" value="200"></span>' + 
			'<span>Глубина: <input class="boxCarcasHeight" id="boxCarcasHeight' + (rowAmt - 1) + '" type="number" value="120"></span>' +
			'<span>Зазор: <input class="shelfSideOffset" id="shelfSideOffset' + (rowAmt - 1) + '" type="number" value="0"></span>' +
			'<span class="boxGroupPar">\
				<span>Кол-во: <input class="itemAmt" id="itemAmt' + (rowAmt - 1) + '" type="number" value="1"><br></span>\
				<span>Крышки: <select class="borderShelfs" id="borderShelfs' + (rowAmt - 1) + '" size="1">\
					<option value="нет">нет</option>\
					<option value="верх">верх</option>\
					<option value="низ">низ</option>\
					<option value="две">две</option>\
				</select><br></span>\
				<span>Зазор: <input class="itemsGap" id="itemsGap' + (rowAmt - 1) + '" type="number" value="2"><br></span>\
				<span>Ручки: <select class="boxHandles" id="boxHandles' + (rowAmt - 1) + '" size="1">\
					<option value="нет">нет</option>\
					<option value="есть">есть</option>\
				</select></span>\
			</span>' +
		'</td>' +
		'<td>' +
			'<select class="boxType" id="boxType' + (rowAmt - 1) + '" size="1">' +
				'<option value="полки">полки</option>' + 
				'<option value="ящики">ящики</option>' + 
				'<option value="перегородка">перегородка</option>' +
				'<option value="штанга">штанга</option>' +
				'<option value="стойка">стойка</option>' + 
				'<option value="выдв. штанга">выдв. штанга</option>' +
				'<option value="пантограф">пантограф</option>' + 
			'</select>' +
			'<span class="poleEnds">' + 
				'Н: <select class="poleStart" id="poleStart' + (rowAmt - 1) + '" size="1">' +
					'<option value="нет">нет</option>' +
					'<option value="фланец">фланец</option>' +
					'<option value="тройник">тройник</option>' +
					'<option value="крест">крест</option>' +
				'</select><br/>' +
				'К: <select class="poleEnd" id="poleEnd' + (rowAmt - 1) + '" size="1">' +
					'<option value="нет">нет</option>' +
					'<option value="фланец">фланец</option>' +
					'<option value="тройник">тройник</option>' +
					'<option value="крест">крест</option>' +
				'</select>\
			</span>' +			
		'</td>' +
		'<td>' +
			
			'Утапл.: <br/>' + 
			'<input class="boxDoorPlusIn" id="boxDoorPlusIn' + (rowAmt - 1) + '" type="number" value="0">' +
			'<span class="fasadParams">' + 
			'Увелич.: <br/>' + 
			'П: <input class="boxDoorPlusRight" id="boxDoorPlusRight' + (rowAmt - 1) + '" type="number" value="-2"><br/>' +
			'Л: <input class="boxDoorPlusLeft" id="boxDoorPlusLeft' + (rowAmt - 1) + '" type="number" value="-2"><br/>' +
			'В: <input class="boxDoorPlusTop" id="boxDoorPlusTop' + (rowAmt - 1) + '" type="number" value="-2"><br/>' +
			'Н: <input class="boxDoorPlusBot" id="boxDoorPlusBot' + (rowAmt - 1) + '" type="number" value="-2"><br/>' +
			'</span>' + 
		'</td>' +
		'<td><span class="removeRow">Х</span></td>' +
	'</tr>';
	
	$("#boxParamsTable").append(row);
	$("#boxAmt_wr").val($("#boxAmt_wr").val()*1.0 + 1);
}

function reindexBoxParamsTable(){

	$(".boxParams").each(function(i){
		$(this).find("input, select").each(function(){
			var inputClass = $(this).attr("class");
			$(this).attr("id", inputClass + i)
			});
		});
}

function configBoxInputs(){
	$(".boxParams").remove();
	var boxAmt = $("#boxAmt_wr").val();
	$("#boxAmt_wr").val(0);
	for(var i=0; i<boxAmt; i++){
		addBoxInputs();
		}
}

//выравнивание позиций полок внутри секции
function equalboxHeight(){
if($("#curSect").val() == "все") return;

var boxAmt = $("#boxParamsTable tr:visible").length;


	var boxHeight = (params.eqBorderTop - params.eqBorderBot  - (boxAmt - 1) * params.carcasThk_wr) / boxAmt;
	for (var i=1; i<boxAmt; i++){
		var curY = boxHeight * i + params.carcasThk_wr * (i-1) + params.eqBorderBot;
		$("#boxParamsTable tr:visible").eq(i).find(".boxRow").val(curY);
		}

} //end of equalboxHeight


function copyBox(){
	
	var boxAmt = $("#boxParamsTable tr:visible").length - 1;
	var makeCopy = true;
	if(boxAmt > 1) makeCopy = confirm("Скопировать " + boxAmt + " объектов?");

	if(makeCopy){
		
		for(var i=1; i<=boxAmt; i++){	
			var sourceRow = $("#boxParamsTable tr:visible").eq(i);
			var row = $("#boxParamsTable tr:visible").eq(i).clone();
			row.find("input, select").each(function(){
				var inputClass = $(this).attr("class");
				$(this).val(sourceRow.find("." + inputClass).val());
				})
			//смещение по Y
			var newY = $(row).find(".boxRow").val() * 1.0 + $("#copyMooveY").val() * 1.0;
			if($("#copyType").val() == "зазор") {
				if($("#copyMooveY").val() > 0) newY += $(row).find(".boxHeight").val() * 1.0
				if($("#copyMooveY").val() < 0) newY -= $(row).find(".boxHeight").val() * 1.0
				}
			$(row).find(".boxRow").val(newY);

			//перенос в другую секцию
			if(params.copySectType == "другая"){
				$(row).find(".boxSect").val(params.copySect);
				}
			$("#boxParamsTable").append(row);
			$("#boxAmt_wr").val($("#boxAmt_wr").val()*1.0 + 1);
	
		}
		}

	
	
}//end of copyBox


function calcBoxDist(sectId){
	//console.log(sectId)
	//высота низа верхней панели
	var topPos = params.height_wr;
	if(params.topWall_wr != "нет") topPos -= params.carcasThk_wr;
	if(params.isTopShelf == "есть" && sectId >= params.topShelfSect1-1 && sectId <= params.topShelfSect2-1){
		topPos = params.topShelfPosY - params.carcasThk_wr;
		}
	
	//высота верха нижней панели
	var botPos = 0;
	if(params.botWall_wr == "цоколь") botPos = params.legsHeight_wr;
	
	//сохраняем в массив позиции всех элементов той же секции
	var sectBoxes = [];
	$(".boxParams").each(function(){
		if($(this).find(".boxSect").val() == sectId*1.0 + 1) {
			var item = {
				bot: $(this).find(".boxRow").val() * 1.0,
				top: $(this).find(".boxRow").val()*1.0 + $(this).find(".boxHeight").val()*1.0,
				tr: this,
				height: $(this).find(".boxHeight").val()*1.0,
				type: $(this).find(".boxType").val(),
				}
			sectBoxes.push(item);			
			}
		});
	
	//рассчитываем расстояние до ближайшего элемента для всех элементов
	for(var i=0; i<sectBoxes.length; i++){
		var curBox = sectBoxes[i];
		curBox.distTop = topPos - curBox.top;
		//console.log(topPos);
		curBox.distBot = curBox.bot - botPos;
		for(var j=0; j<sectBoxes.length; j++){
			if(i != j){
				//если низ элемента выше верха текущего
				if(sectBoxes[j].bot >= curBox.top) {
					var distTop = sectBoxes[j].bot - curBox.top;
					if(curBox.distTop > distTop) curBox.distTop = distTop;					
					}
					
				//если верх элемента ниже низа текущего
				if(sectBoxes[j].top <= curBox.bot) {
					var distBot = curBox.bot - sectBoxes[j].top;
					if(curBox.distBot > distBot) curBox.distBot = distBot;					
					}
				}			
			}
		//вписываем значения в инпуты
		$(curBox.tr).find(".distTop").val(curBox.distTop);
		$(curBox.tr).find(".distBot").val(curBox.distBot);
			
		}
		
	return sectBoxes;




}//end of calcBoxDist

