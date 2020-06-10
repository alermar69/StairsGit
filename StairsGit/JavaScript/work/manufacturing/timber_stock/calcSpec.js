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
	if (params.stairFrame == "есть") links += "<a href='" + pathFrames + fileName + "' target='_blank'>Рамки прямых ступеней</a><br/>";
	//рамки забежных ступеней
	if (params.stairFrame == "есть" && isWinder) links += "<a href='" + pathFrames + "winderFrames_ko_" + turnSideName + ".pdf' target='_blank'>Рамки забежных ступеней</a><br/>"
	//рамки площадки
	if (params.stairFrame == "есть" && isPlatform) links += "<a href='" + pathFrames + fileNameP + "' target='_blank'>Рамки площадки</a><br/>"
	//вертикальная рамка
	if (params.topAnglePosition == "вертикальная рамка") links += "<a href='" + pathFrames + "top_frame.pdf' target='_blank'>Вертикальная рамка крепления к верхнему перекрытию<br/></a>"
	//Прямые ступени
	links += "<a href='" + pathTreads + fileNameRectTread + "' target='_blank'>Прямые ступени</a><br/>";
	//Забежные ступени
	if (isWinder) links += "<a href='" + pathTreads + fileNameWndTread + "' target='_blank'>Забежные ступени</a><br/>";
	//половинки площадки
	if (isPlatform) links += "<a href='" + pathTreads + fileNamePlatformHalf + "' target='_blank'>Щиты площадки</a><br/>"


	$("#drawings").html(links)
}