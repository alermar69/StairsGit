$(function () {

//обработчики

	//добавление вставки в дверь-купе
	$(".addInpost").click(function(){
		var doorId = $(this).closest("div").attr("name");
		addDoorInputs(doorId);
		setTopInpostHeight(doorId);
		recalculate();
		});
		
	//удаление вставки в дверь-купе
	$(".doorParamsDiv").delegate('.removeRow', 'click' , function(event) {
		$(this).closest("tr").remove();
		var doorId = $(this).attr("name");
		var counterId = "inpostAmt" + doorId;
		$("#" + counterId).val($("#" + counterId).val()*1.0 - 1);
		reindexDoorParamsTable(doorId);
		setTopInpostHeight(doorId);
		recalculate();
		})
	
	//выделение строки
	$(".doorParamsDiv").delegate('td.inpostNumber', 'click' , function(event) {
		$(this).closest("tr").toggleClass("selected");
		})
	
	//выравнивание высоты вставок
	$(".equalInpostHeight").click(function(){
		var doorId = $(this).closest("div").attr("name");
		equalInpostHeight(doorId);
		recalculate();
		});
		


});


function addDoorInputs(doorId){

var rowAmt = $("#doorPar" + doorId + " tr").length;
	var counterId = "inpostAmt" + doorId

	var row = '<tr class="inpostParams">' +
				'<td class="inpostNumber">' + rowAmt + '</td>' +				
				'<td><input class="inpostHeight" id="inpostHeight' + doorId + (rowAmt-1) + '" type="number" value="100" step="5"></td>' +
				'<td>' +
					'<select class="inpostMat" id="inpostMat' + doorId + (rowAmt-1) + '" size="1">' +
						'<option value="зеркало">зеркало</option>' +
						'<option value="лдсп">лдсп</option>' +
					'</select>' +
				'</td>' +
				'<td><span class="removeRow" name="' + doorId + '">Х</span></td>' +
			'</tr>';

		$("#doorPar" + doorId + " table").append(row);
		$("#" + counterId).val($("#" + counterId).val()*1.0 + 1);
		//countFirstSectionWidth(tableId);
}



function reindexDoorParamsTable(doorId){
	var rowAmt = $("#doorPar" + doorId + "  tr").length;
	for (var i=1; i<rowAmt; i++){
		$("#doorPar" + doorId + "  tr").eq(i).find(".inpostNumber").text(i);
		$("#doorPar" + doorId + "  tr").eq(i).find(".inpostHeight").attr("id", "inpostHeight" + doorId + (i-1));
		$("#doorPar" + doorId + "  tr").eq(i).find(".inpostMat").attr("id", "inpostMat" + doorId + (i-1));		
		}
} //end of reindexDoorParamsTable

function setTopInpostHeight(doorId){
	/*Рассчитывается высота верхней вставки
	при этом высота каждой вставки считается по чистому размеру видимой части,
	то есть как расстояние между ребрами ближайших профилей*/
	
	var inpostsSumHeight = calcInpostSumHeight();
	
	var heights = [];
	$("#doorPar" + doorId).find(".inpostHeight").each(function(){
		heights.push($(this).val() * 1.0);
		});	
	//конструктивные размеры профилей
	var constParams = getDoorParams();
	var topInpostHeight = inpostsSumHeight;
	
	for(var i=1; i<heights.length; i++){
		topInpostHeight -= heights[i] + constParams.inpostProf.y;
		}
	
	$("#doorPar" + doorId).find(".inpostHeight").eq(0).val(topInpostHeight);
	
	//console.log(heights, topInpostHeight)

} //end of countTopInpostHeight

function configDoorsInputs(){
	$(".inpostParams").remove();
	for(var i=0; i<5; i++){
		var doorAmt = $("#inpostAmt" + i).val();
		$("#inpostAmt" + i).val(0);
		for(var j=0; j<doorAmt; j++){
			addDoorInputs(i);
			}
		}

}

//выравнивание высоты всех вставок
function equalInpostHeight(doorId){
	
	setTopInpostHeight(doorId);
	
	var sumHeight = 0;
	var selectedItemsAmt = 0;
	
	var items = $("#doorPar" + doorId).find(".selected");
	if(items.length == 0){
		//выбираем все
		items = $("#doorPar" + doorId).find(".inpostParams");
		}
	if(items.length == 1){
		alert("Выбрана одна вставка: выравнивание не было произведено.")
		return;
		}
		
	items.each(function(){
		sumHeight += $(this).find(".inpostHeight").val() * 1.0;
		})
	
	var inpostHeight = sumHeight / items.length;
	
	items.each(function(){
		$(this).find(".inpostHeight").val(inpostHeight);
		})
	
	
	//снимаем выделение со всех строк
	$(".selected").removeClass("selected")
		
}//end of equalInpostHeight


function calcInpostSumHeight(){
	/*функция рассчитывает суммарную высоту вставок двери*/
	
	//конструктивные размеры профилей
	var constParams = getDoorParams();
	var doorHeight = params.height_wr - constParams.doorOffsetTop - constParams.doorOffsetBot;
	if(params.topWall_wr != "нет") doorHeight -= params.carcasThk_wr;
	if(params.botWall_wr == "цоколь") doorHeight -= params.legsHeight_wr;
	if(params.botWall_wr == "фальшпанель") doorHeight -= params.carcasThk_wr;
	
	var inpostsSumHeight = doorHeight - constParams.topProf.y - constParams.botProf.y;

	return inpostsSumHeight;
	
} //end of calcInpostSumHeight