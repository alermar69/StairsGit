function showDrawingsLinks() {

	var pathTreads = "/drawings/treads/";
	var pathRailing = "/drawings/railing_mono/"
	var fileNameRectTread = "rectTreads_mono.pdf";
	if (params.model == "труба") fileNameRectTread = "rectTreads_mono_pipe.pdf";
	var fileNameWndTread = "winderTreads";
	var fileNamePlatformHalf = "platformHalf"

	var turnSideName = "_right";
	if (params.turnSide == "левое") turnSideName = "_left";

	var stairType = "timber";
	if (params.stairType == "нет") stairType = "no";



	fileNameWndTread += "_mono";
	fileNamePlatformHalf += "_mono";

	fileNameWndTread += turnSideName;

	fileNameWndTread += ".pdf";
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
	//Прямые ступени
	if (stairType == "timber") links += "<a href='" + pathTreads + fileNameRectTread + "' target='_blank'>Прямые ступени</a><br/>";
	//Забежные ступени
	if (stairType == "timber" && isWinder) links += "<a href='" + pathTreads + fileNameWndTread + "' target='_blank'>Забежные ступени</a><br/>";
	//половинки площадки
	if (stairType == "timber" && isPlatform) links += "<a href='" + pathTreads + fileNamePlatformHalf + "' target='_blank'>Щиты площадки</a><br/>"
	//стойки ограждений
	if (railingSide_1 != "нет" || railingSide_2 != "нет" || railingSide_3 != "нет") {
		if (params.banisterMaterial == "40х40 черн.") var filename = "rack";
		if (params.banisterMaterial == "40х40 нерж.") var filename = "rack_inox";
		links += "<a href='" + pathRailing + filename + ".pdf' target='_blank'>Стойки ограждения марша</a><br/>";
		links += "<a href='" + pathRailing + filename + "_first.pdf' target='_blank'>Первая стойка ограждения марша</a><br/>";
		links += "<a href='" + pathRailing + filename + "_L.pdf' target='_blank'>L-образная стойка ограждения марша</a><br/>";

	}
	if (params.railingModel_bal == "Ригели" || params.railingModel_bal == "Стекло на стойках") {
		links += "<a href='" + pathRailing + filename + "_bal.pdf' target='_blank'>Стойка ограждения балюстрады</a><br/>";
	}

	//колонны
	if (params.marshMiddleFix_1 == "колонна" ||
		params.marshMiddleFix_2 == "колонна" ||
		params.marshMiddleFix_3 == "колонна" ||
		params.isColumn1 || params.isColumn2 || params.isColumn3 || params.isColumn4) {
		if (params.model == "труба") links += "<a href='/drawings/carcas/column_mono_prof.pdf' target='_blank'>Колонны марша</a><br/>"
		else links += "<a href='/drawings/carcas/column_mono.pdf' target='_blank'>Колонны марша</a><br/>";
	}

	//подложки
	if (params.model == "труба") {
		links += "<a href='/drawings/mono/treadPlates.pdf' target='_blank'>Подложки прямых ступеней</a><br/>";
		if (isWinder) {
			if (turnFactor == 1) links += "<a href='/drawings/mono/treadPlates_wndRight.pdf' target='_blank'>Подложки забежных ступеней (прав)</a><br/>";
			if (turnFactor == -1) links += "<a href='/drawings/mono/treadPlates_wndLeft.pdf' target='_blank'>Подложки забежных ступеней (лев)</a><br/>";
		}
	}

	$("#drawings").html(links)

} //end of showDrawingsLinks