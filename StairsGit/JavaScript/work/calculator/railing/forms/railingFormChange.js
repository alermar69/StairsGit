//обработчики

$(function () {
	//добавление секции
	$("#addRailingRow").click(function(){
		addRailingInputs();
		$("#railingSectAmt").val($("#railingSectAmt").val()*1.0 + 1);
		recalculate();
		});
	
	//удаление секции
	$("#railingParamsTable").delegate('.removeRow', 'click' , function(event) {
		$(this).closest("tr").remove();
		reindexrailingParamsTable();
		$("#railingSectAmt").val($("#railingSectAmt").val()*1.0 - 1);
		recalculate();
	 })
	 
	 //указание базовой точки на модели
	 $("#railingParamsTable").delegate('.setBasePoint', 'click' , function(event) {
	// $("#drawRailingSect").click(function(){
		var p1 = lastSelectedPoint1; //глобавльная переменная из файла viewports
		var p2 = lastSelectedPoint; //глобавльная переменная из файла viewports
		
		var height = p2.y - p1.y;
		var posAng = -Math.atan((p2.z - p1.z)/(p2.x - p1.x))
		if(p1.y > p2.y && p1.x > p2.x) posAng += Math.PI;
		if(Math.abs(posAng) < 0.0001) posAng = 0;
		
		var len = Math.sqrt((p2.z - p1.z) * (p2.z - p1.z) + (p2.x - p1.x) * (p2.x - p1.x));
		if(len == 0) {
			alertTrouble("Неверные точки. Не удалось построить секцию ограждения.");
			console.log(p1, p2)
			return;
			}
		var angle = 0;
		if(height != 0) angle = Math.atan(height / len);
		
		
		$(this).closest("tr").find("input.railingPosX").eq(0).val(p1.x)
		$(this).closest("tr").find("input.railingPosY").eq(0).val(p1.y)
		$(this).closest("tr").find("input.railingPosZ").eq(0).val(p1.z)
		$(this).closest("tr").find("input.railingPosAng").eq(0).val(posAng * 180 / Math.PI)
		
		$(this).closest("tr").find("input.len").eq(0).val(len)
		$(this).closest("tr").find("input.angle").eq(0).val(angle * 180 / Math.PI)

		recalculate();

	 })
	 
});

function addRailingRows(){
var rowAmt = $("#railingSectAmt").val();
for(var i=0; i<rowAmt; i++){
	addRailingInputs();
	//console.log(i)
	}	
}


function addRailingInputs(){
	
	
	var rowAmt = $("#railingParamsTable tr").length;
	var row = '<tr class="sectParams">' + 
			'<td class="sectNumber">' + rowAmt + '</td>' + 
				'<td>' +
					'<span>Модель:<select class="railingType" id="railingType' + (rowAmt-1) + '" size="1">' +
						'<option value="стекло рут.">стекло рут.</option>' +
						'<option value="стекло проф.">стекло проф.</option>' +						
						'<option value="поручень">поручень</option>' +
						'<option value="Ригели">ригели</option>' +
						'<option value="Cтекло на стойках">стекло на стойках</option>' +
						'<option value="Экраны лазер">экраны лазер</option>' +
						'<option value="Решетка">решетка</option>' +
						'<option value="Деревянные балясины">дерево</option>' +
						'<option value="Модерн">модерн</option>' +
						
						
						
					'</select></span><br/>' +
					'<span>Поручень: <br/><select class="isSectHandrail" id="isSectHandrail' + (rowAmt-1) + '" size="1">' +
						'<option value="есть">есть</option>' +
						'<option value="нет">нет</option>' +						
					'</select></span>' +
				'<td>' + 
					'<span>Параметры: <select class="railingParType" id="railingParType' + (rowAmt-1) + '" size="1">' +
						'<option value="задаются">задаются</option>' +
						'<option value="с марша">с марша</option>' +
					'</select><br/></span>' +
					'<span class="marshRailing">Марш № <input class="glassMarshId" id="glassMarshId' + (rowAmt-1) + '" type="number" value="0"><br/></span>' +
					
					'<span class="freeRailing">Длина по полу: <input class="len" id="len' + (rowAmt-1) + '" type="number" value="1000"><br/></span>' +
					'<span class="freeRailing">Угол подъема: <input class="angle" id="angle' + (rowAmt-1) + '" type="number" value="30"><br/></span>' +
					
					'<span>Высота: <input class="sectHeight" id="sectHeight' + (rowAmt-1) + '" type="number" value="900"><br/></span>' +
					'<span>Срез верх: <input class="glassCutTop" id="glassCutTop' + (rowAmt-1) + '" type="number" value="0"><br/>' +
					'<span>Срез низ: <input class="glassCutBot" id="glassCutBot' + (rowAmt-1) + '" type="number" value="0"><br/></span>' +
					'<span>Смещение последней стойки: <input class="lastRackMooveY" id="lastRackMooveY' + (rowAmt-1) + '" type="number" value="0"><br/></span>' +
					'<span>Сторона: <select class="railingSide" id="railingSide' + (rowAmt-1) + '" size="1">' +
						'<option value="правая">правая</option>' +
						'<option value="левая">левая</option>' +
					'</select></span><br/>' +
					
				
					'<span class="marshPar">h: <input class="h_r" id="h_r' + (rowAmt-1) + '" type="number" value="200"><br/></span>' +
					'<span class="marshPar">b: <input class="b_r" id="b_r' + (rowAmt-1) + '" type="number" value="200"><br/></span>' +					
					'<span class="marshPar">stairAmt: <input class="stairAmt_r" id="stairAmt_r' + (rowAmt-1) + '" type="number" value="5"><br/></span>' +
					'<span class="marshRailing">Добавить ступеней: <br/>' + 
						'Верх: <input class="addStairsTop" id="addStairsTop' + (rowAmt-1) + '" type="number" value="0"><br/></span>' +
						'Низ: <input class="addStairsBot" id="addStairsBot' + (rowAmt-1) + '" type="number" value="0"><br/></span>' +
					
				'</td>' +
				'<td>' +
					'<span>X: <input class="railingPosX" id="railingPosX' + (rowAmt-1) + '" type="number" value="0"><br/></span>' +
					'<span>Y: <input class="railingPosY" id="railingPosY' + (rowAmt-1) + '" type="number" value="0"><br/></span>' +
					'<span>Z: <input class="railingPosZ" id="railingPosZ' + (rowAmt-1) + '" type="number" value="0"><br/></span>' +
					'<span>Ang: <input class="railingPosAng" id="railingPosAng' + (rowAmt-1) + '" type="number" value="0"><br/></span>' +
					'<button class="setBasePoint">Вставить</button>' +
				'</td>' +
				
				'<td><span class="removeRow">Х</span></td>' +
			'</tr>';
		$("#railingParamsTable").append(row); 
}

function reindexrailingParamsTable(){
	var rowAmt = $("#railingParamsTable tr").length;
	for (var i=1; i<rowAmt; i++){
		$("#railingParamsTable tr").eq(i).find(".sectNumber").text(i);
		$("#railingParamsTable tr").eq(i).find('td input,select,textarea').each(function(){
			var oldId = $(this).attr("id");
			var newId = oldId.match(/^([^0-9]+)[0-9]+$/)[1] + (i-1);
			$(this).attr("id", newId);
			});	
		}
}

function changeFormRailing(){
	
//наличие поручней
var isRailing = true;
var isHandrail = true;

var isRigels = false;
var isGlass = false;
var isRutel = false;
var isRacks = false;
var isForge = false;
var isMetalPaint = false;
var isTimberPaint = false;
var isLattice = false;
var isTimber = false;
var isSideHandrail = false;



//расчет параметров для связанных с маршами секций
	$("#railingParamsTable .sectParams").each(function(){
		var sectionRow = this;
		$(sectionRow).find(".freeRailing").show();
		$(sectionRow).find(".marshRailing").hide();
		$(sectionRow).find(".marshPar").hide();
		
		
		if($(sectionRow).find(".railingParType").val() == "с марша"){

			$(sectionRow).find(".freeRailing").hide();
			$(sectionRow).find(".marshRailing").show();
			
			//снятие параметров с марша
			var targetMarshNumber = $(sectionRow).find(".glassMarshId").val();
			if(targetMarshNumber != 0){
				var marshNumber = 0;
				$("#concreteParamsTable .sectParams").each(function(){
					
					if($(this).find(".sectType").val() == "марш"){
						marshNumber += 1;
						var marshRow = this;

						if(marshNumber == targetMarshNumber){
							var b = $(marshRow).find(".b").val() * 1.0
							var h = $(marshRow).find(".h").val() * 1.0
							var stairAmt = $(marshRow).find(".stairAmt").val() * 1.0;
							//корректируем кол-во ступеней на введенное пользвателем значение
							stairAmt += $(sectionRow).find(".addStairsTop").val() * 1.0;
							stairAmt += $(sectionRow).find(".addStairsBot").val() * 1.0;
							//позиция марша
							var marshPos = {
								x: $(marshRow).find(".posX").val() * 1.0,
								y: $(marshRow).find(".posY").val() * 1.0,
								z: $(marshRow).find(".posZ").val() * 1.0,
								ang: $(marshRow).find(".posAng").val() * 1.0,
								};

							var marshLen = b * stairAmt;
							var marshAng = Math.atan(h / b) * 180 / Math.PI;
							
							//устанавливаем параметры секции
							$(sectionRow).find(".len").val(marshLen);
							$(sectionRow).find(".angle").val(marshAng);
							$(sectionRow).find(".h_r").val(h);
							$(sectionRow).find(".b_r").val(b);
							$(sectionRow).find(".stairAmt_r").val(stairAmt);
							
							//привязываем позицию ограждения к позиции марша
							
							var railingThk = params.glassThk;
							var railingOffset = params.glassSideOffset;
							var mooveY = 0;
							var marshWidth = $(marshRow).find(".sectWidth").val() * 1.0;
							var railingType = $(sectionRow).find(".railingType").val();
							var railingSide = $(sectionRow).find(".railingSide").val();
							var turnFactor = -1;
							if(railingSide == "правая") turnFactor = 1;
							
							if(railingType == "Ригели" || railingType == "Cтекло на стойках" || railingType == "Кованые балясины" || railingType == "Экраны лазер"){
								railingThk = 40;
								railingOffset = 0;								
								if(params.rackBottom == "сверху с крышкой") {
									mooveY = 90;									
									railingOffset = -80;
									if(railingSide == "правая") railingOffset = 80;
									}
								}
							
							var offset = -(railingThk + railingOffset);
							if(turnFactor == 1){
								offset = marshWidth - railingOffset;
								}

								
								
							//выравниваем секцию так, чтобы ось совпадала с краем марша
							offset = -railingThk / 2;
							if(turnFactor == 1) offset += marshWidth;
							
							//сдвигаем в проектное положение
							if(railingType == "стекло рут.") {
								offset += (params.glassSideOffset + railingThk / 2) * turnFactor;
								}
							
							if(railingType == "Ригели" || railingType == "Cтекло на стойках" || railingType == "Кованые балясины" || railingType == "Экраны лазер"){
								offset += railingThk / 2 * turnFactor;
								mooveY = -40;
								if(params.rackBottom == "сверху с крышкой") {
									mooveY = 90;									
									offset += -80 * turnFactor;
									}
								}
							
							
							
							var railingPos = {
								x: marshPos.x + offset * Math.sin(marshPos.ang * Math.PI / 180),
								y: marshPos.y + h + mooveY,
								z: marshPos.z + offset * Math.cos(marshPos.ang * Math.PI / 180),
								}
								
							//корректирвем позицию при добавлении ступеней снизу
							var extraStepAmt = $(sectionRow).find(".addStairsBot").val();
							if(extraStepAmt != 0){								
								railingPos.x -= extraStepAmt * b * Math.cos(marshPos.ang * Math.PI / 180);
								railingPos.y -= extraStepAmt * h;
								railingPos.z += extraStepAmt * b * Math.sin(marshPos.ang * Math.PI / 180);
								}
							
							
							
							
							
							$(sectionRow).find(".railingPosX").val(railingPos.x);
							$(sectionRow).find(".railingPosY").val(railingPos.y);
							$(sectionRow).find(".railingPosZ").val(railingPos.z);
							$(sectionRow).find(".railingPosAng").val(marshPos.ang);
							
							
							
							
							}
						}
					});			
				
				}		
			
			}
		var railingType = $(sectionRow).find(".railingType").val();

		if(railingType == "стекло рут."){
			isGlass = true;
			isRutel = true;
			isRacks = false;
			isTimber = false;
			}
		if(railingType == "стекло проф."){
			isGlass = true;
			}
		if(railingType == "поручень"){
			isSideHandrail = true;
			}
		if(railingType == "Ригели"){
			isRigels = true;
			isRacks = true;
			}
		if(railingType == "Cтекло на стойках" || railingType == "Экраны лазер"){
			isRacks = true;
			isGlass = true;
			}
		if(railingType == "Кованые балясины"){
			isForge = true;
			}
		if(railingType == "Решетка"){
			isLattice = true;
			}
		if(railingType == "Деревянные балясины"){
			isTimber = true;
			}
		if(railingType == "Модерн"){
			isTimber = true;
			isGlass = true;
			}
			
		
	})
		
//кронштейны пристенных поручней
$("#sideHandrailHolders").closest('tr').hide();
if(isSideHandrail) $("#sideHandrailHolders").closest('tr').show();

//наличие окрашиваемых металлических деталей
var isMetalPaint = false;
if (isForge) isMetalPaint = true;
if (isLattice) isMetalPaint = true;
if (isRacks){
	if(params.banisterMaterial == "40х40 черн.") isMetalPaint = true;
	if(params.rigelMaterial == "20х20 черн." && isRigels) isMetalPaint = true;
	}

if(params.handrail =="40х20 черн." ||
	params.handrail =="40х40 черн." ||
	params.handrail =="60х30 черн." ||
	params.handrail =="кованый полукруглый"	) isMetalPaint = true;


//наличие окрашиваемых деревянных деталей
var isTimberPaint = false;
if(isTimber) isTimberPaint = true;
if (isRacks && params.banisterMaterial == "40х40 нерж+дуб") isTimberPaint = true;

if(params.handrail =="массив" ||
	params.handrail =="сосна" ||
	params.handrail =="береза" ||
	params.handrail =="лиственница" ||
	params.handrail =="дуб паркет." ||
	params.handrail =="дуб ц/л" ||
	params.handrail =="Ф50 сосна" ||
	params.handrail =="омега-образный сосна" ||
	params.handrail =="50х50 сосна" ||
	params.handrail =="40х60 береза" ||
	params.handrail =="омега-образный дуб" ||
	params.handrail =="40х60 дуб" ||
	params.handrail =="40х60 дуб с пазом") isTimberPaint = true;

//покраска деталей ограждений
$(".railingMetalPaint_tr").hide();
$(".railingTimberPaint_tr").hide();
if(isMetalPaint) $(".railingMetalPaint_tr").show();
if(isTimberPaint) $(".railingTimberPaint_tr").show();
//цвет покраски дерева
$('.railingTimberColor').hide();
if(isTimberPaint && (params.timberPaint == "морилка+лак" || params.timberPaint == "морилка+масло")) 
	$('.railingTimberColor').show(); 

$("#resultPerila").hide();

//параметры поручня
$('.handrailParams_tr').hide();
if(isHandrail) {
	$('.handrailParams_tr').show();
	setHandrailOptions(); //функция в файле formsChange
	$("#resultPerila").show();
	}


	$(".railing_tr").show();
	$("#resultPerila").show();

	var railingModel = $("#railingModel").val();

	//тип крепления поручня
	$("#handrailFixType").closest("tr").hide();
	console.log(isRacks, isTimber)
	if (!isRacks && !isTimber) {
		$("#handrailFixType").closest("tr").show();
	}
		
	if (isRacks) {
		$("#handrailFixType").val("кронштейны");
	}


	//параметры ограждений с ригелями
	$(".rigel_tr").hide();	
	if (isRigels) $(".rigel_tr").show();
	
	//параметры кованых ограждений
	$(".kovka_tr").hide();	
	if (isForge) $(".kovka_tr").show();
	
	if(isLattice) {
		console.log(railingModel)
		$("#balDist").closest("tr").show();
		$("#banister1").val("20х20");
		$("#banister2").val("20х20");
		}
	
	//параметры ограждений со стеклом
	$(".glass_tr").hide();
	if (isGlass) {
		$(".glass_tr").show()
		if(params.glassType != "триплекс" && params.glassType != "триплекс цветной")
			$("#glassBevels").closest("tr").hide();
			
		}
	
	//технологические параметры стекла на рутелях
	
	$("#rutelGlassParams").hide();
	if(isRutel) {
		console.log(isRutel)
		$("#rutelGlassParams").show();
	}

	$(".timberRailing_tr").hide();
	if (isTimber) $(".timberRailing_tr").show();
	
	if(isGlass && params.handrailFixType == "паз") {
		$("#handrailConnectionType").val("без зазора премиум");
		params.handrailConnectionType = "без зазора премиум"
		}
		

	//материал стоек
	$("#banisterMaterial_tr").hide();
	$("#rackBottom").closest('tr').hide();
	
	if (isRacks){
		$("#banisterMaterial_tr").show();		
		$("#rackBottom").closest('tr').show();
		}

	//порода дерева поручня
	if(params.handrail != "массив") $("#handrailsMaterial").closest("tr").hide();
	
	
	
	


} //end of changeFormRailing


function changeFormTreads(){
	$(".treadParams").hide();
	
	if(params.stairType != "нет") $(".treadParams").show();
}