function showDrawingsLinks() {

	var pathFrames = "/drawings/frames/";
	var pathTreads = "/drawings/treads/";
	var fileName = "01.pdf";
	var fileNameP = "p-01.pdf";
	var fileNameRectTread = "rectTreads";
	var fileNameWndTread = "winderTreads";
	var fileNamePlatformHalf = "platformHalf"

	var turnSideName = "right";
	if (params.turnSide == "левое") turnSideName = "left";

	var stairType = "timber";
	if (params.stairType == "рифленая сталь") stairType = "metal";
	if (params.stairType == "лотки") stairType = "metal";
	if (params.stairType == "рифленый алюминий") stairType = "metal";
	if (params.stairType == "дпк") stairType = "dpc";
	if (params.stairType == "стекло") stairType = "glass";
	if (params.stairType == "нет") stairType = "no";

	if (stairType == "metal") {
		if (params.M <= 900) fileName = "06.pdf";
		if (params.M > 900) fileName = "07.pdf";
		fileNameP = "p-02.pdf";
	};
	if (stairType == "dpc") {
		if (params.M <= 900) fileName = "frame_dpc.pdf";
		if (params.M > 900) fileName = "frame_dpc_long.pdf";
	};
	if (stairType == "glass") {
		if (params.M <= 900) fileName = "02.pdf";
		if (params.M > 900) fileName = "03.pdf";
		fileNameP = "p-02.pdf";
	};



	if (params.model == "лт") {
		fileNameWndTread += "_lt_";
		fileNameRectTread += "_lt";
		fileNamePlatformHalf += "_lt";
	}
	if (params.model == "ко") {
		fileNameWndTread += "_ko_";
		fileNameRectTread += "_ko";
		fileNamePlatformHalf += "_ko";
	}
	fileNameWndTread += turnSideName;
	if (params.riserType == "есть") {
		fileNameWndTread += "_risers";
		fileNameRectTread += "_risers";
	}
	fileNameWndTread += ".pdf";
	fileNameRectTread += ".pdf";
	fileNamePlatformHalf += ".pdf";

	var isPlatform = false;
	var isWinder = false;
	if (params.stairModel == "Г-образная с площадкой") isPlatform = true;
	if (params.stairModel == "Г-образная с забегом") isWinder = true;
	if (params.stairModel == "П-образная с площадкой") isPlatform = true;
	if (params.stairModel == "П-образная с забегом") isWinder = true;
	if (params.stairModel == "П-образная трехмаршевая") {
		if (params.turnType_1 == "площадка") isPlatform = true;
		if (params.turnType_2 == "площадка") isPlatform = true;
		if (params.turnType_1 == "забег") isWinder = true;
		if (params.turnType_2 == "забег") isWinder = true;
	}
	if (params.platformTop == "площадка") isPlatform = true;



	var links = "<p>Типовые чертежи:</p>";
	//рамки прямых ступеней
	if (params.stairFrame == "есть") links += "<a href='" + pathFrames + fileName + "' target='_blank'>Рамки прямые</a><br/>";
	//рамки забежных ступеней
	if (params.stairFrame == "есть" && isWinder) links += "<a href='" + pathFrames + "winderFrames_ko_" + turnSideName + ".pdf' target='_blank'>Рамки забежных ступеней</a><br/>"
	//рамки площадки
	//if(params.stairFrame == "есть" && isPlatform && params.model != "ко") links += "<a href='" + pathFrames + fileNameP + "' target='_blank'>Рамки площадки</a><br/>"
	//вертикальная рамка
	if (params.topAnglePosition == "вертикальная рамка") links += "<a href='" + pathFrames + "top_frame.pdf' target='_blank'>Вертикальная рамка крепления к верхнему перекрытию<br/></a>"
	//Прямые ступени
	if (stairType == "timber") links += "<a href='" + pathTreads + fileNameRectTread + "' target='_blank'>Прямые ступени</a><br/>";
	if (stairType == "metal") links += "<a href='" + pathTreads + "steelTread.pdf' target='_blank'>Прямые ступени</a><br/>";

	//Забежные ступени
	if (stairType == "timber" && isWinder) links += "<a href='" + pathTreads + fileNameWndTread + "' target='_blank'>Забежные ступени</a><br/>";
	//половинки площадки
	if (stairType == "timber" && isPlatform) links += "<a href='" + pathTreads + fileNamePlatformHalf + "' target='_blank'>Щиты площадки</a><br/>"
	if (stairType == "metal" && isPlatform) links += "<a href='" + pathTreads + "steelPlatform.pdf' target='_blank'>Площадки</a><br/>";

	//забежные подступенки
	if (params.riserType == "есть" && params.model == "ко" && isWinder) links += "<a href='" + pathTreads + "wndRisers.pdf' target='_blank'>Подступенки забега</a><br/>"
	//колонны
	if (params.isColumn1 ||
		params.isColumn2 ||
		params.isColumn3 ||
		params.isColumn4 ||
		params.isColumn5 ||
		params.isColumn6 ||
		params.isColumn7 ||
		params.isColumn8)
		links += "<a href='/drawings/carcas/column_100x50.pdf' target='_blank'>Колонны</a><br/>"




	$("#drawings").html(links)



}