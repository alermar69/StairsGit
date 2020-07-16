function calcProductionTime(){

	
	var hasRailing = false;
	if(params.railingSide_1 != "нет") hasRailing = true;
	if(params.stairModel == "П-образная трехмаршевая" && params.railingSide_2 != "нет") hasRailing = true;
	if(params.stairModel != "Прямая" && params.railingSide_3 != "нет") hasRailing = true;
	
	var hasBalustrade = false;
	if(params.banisterSectionAmt > 0 && params.railingModel_bal != "нет") hasBalustrade = true;
	
	//наличие стекла
	var hasGlassStaircase = false;
	var hasGlassBanister = false; 
	if(hasRailing && params.railingModel == "Стекло на стойках") hasGlassStaircase = true;
	if(hasRailing && params.railingModel == "Самонесущее стекло") hasGlassStaircase = true;
	if(hasBalustrade && params.railingModel_bal == "Стекло на стойках") hasGlassBanister = true;
	if(hasBalustrade && params.railingModel_bal == "Самонесущее стекло") hasGlassBanister = true;
	if(hasBalustrade && params.railingModel_bal == "Стекло") hasGlassBanister = true;
	
	//срок выполнения заказа
	var time = 20;
	if(hasGlassStaircase) time = 25;
	if(hasGlassBanister) time = 30;
	if(params.needMockup == "да") time += 15;
	if(params.stairType == "пресснастил" && time < 25) time = 25;
	if(params.calcType == "vint"){
		if(params.handrailMaterial == "Дуб" && time < 25) time = 25;
		if(params.model == "Винтовая с тетивой" || params.model == "Спиральная") time = 40;
		}
	if(params.calcType == "railing"){
		time = 45;
		}
	if(params.calcType == "timber"){
		var isPine = false; //лестница с сосной
		if(params.stairType == "сосна кл.Б" || params.stairType == "сосна экстра") isPine = true;
		if(params.stringerMaterial == "сосна кл.Б" || params.stringerMaterial == "сосна экстра") isPine = true;
		
		time = 25;
		if(isPine) time = 60;
		}

	//если нет деревянной покраски, то срок на 5 дней меньше
	var timberPaint = false;
	if(params.timberPaint != "нет") timberPaint = true;
	if(params.timberPaint_perila != "нет" && params.timberPaint_perila != "как на лестнице") timberPaint = true;
	if(params.timberPaint_perila_bal != "нет" && params.timberPaint_perila_bal != "как на лестнице") timberPaint = true;
	
	if(!timberPaint) time -= 5;
	
	//если нет монтажа
	if(params.isAssembling == "нет") time -= 5;
	
	var daysText = " рабочих дней";
	var timeString = time.toString();
	var lastChar = timeString[timeString.length-1];
	if(time < 10 || time > 20){
		if(lastChar == 1) daysText = " рабочий день";
		if(lastChar == 2 || lastChar == 3 || lastChar == 4) daysText = " рабочиx дня";
		}
	
	var text = "";
	text += "Ориентировочный срок выполнения заказа " + time + daysText + " со дня заключения договора. Окончательный срок выполнения заказа согласовывается при подписании договора и зависит от текущей загрузки производства на момент заключения договора.";
	$("#productionTime").html(text);

}