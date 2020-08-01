//
function showDrawingsLinks() {
	var stapelStepHeight = stairParams.stepHeight * 12.857 / params.stepAngle; //12.857 - угол между стойками стапеля, град.
	stapelStepHeight = Math.round(stapelStepHeight)
	var handrailHorSize = 40;
	if (params.handrailMaterial == "ПВХ") handrailHorSize = 50;
	var balSize = 20;
	var stapelMaxDiam = 2000;
	var stapelOffset = (stapelMaxDiam - params.staircaseDiam) / 2 - balSize / 2 + handrailHorSize / 2 + 20;
	//высоты установки упоров стапеля
	var table = "<table class='tab_2'><tbody><tr><th>Номер стойки</th><th>Высота упора H1, мм</th></tr>"
	for (var i = 0; i < 15; i++) {
		table += "<tr><td>" + (i + 1) + "</td><td>" + (80 + stapelStepHeight * i) + "</td></tr>"
	}
	table += "</tbody></table>"

	var handrailTurn = "правый";
	if (params.turnFactor == 1) handrailTurn = "левый";

	var text =
		"<h3>Настройка стапеля для изготовления поручня</h3>" +
		"<a href='/drawings/vint/stapel_settings.pdf' target='_blank'>Схема настройки стапеля</a></br>" +
		"Отступ для установки стоек стапеля: A = " + Math.round(stapelOffset) + " мм <br/>" +
		"Подъем на одну стойку стапеля: " + Math.round(stapelStepHeight) + " мм <br/>" +
		"Тип изгиба поручня: <b>" + handrailTurn + "</b> (см. схему настройки стапеля)<br/>" +
		table;
	$("#manInfo").html(text);

	text =
		"<h3>Типовые чертежи деталей:</h3>" +
		"<a href='/drawings/vint/stud_v1.1.pdf' target='_blank'>Центральный стержень v1.1 PDF</a></br>" +
		"<a href='/drawings/vint/vintParts_v1.4.pdf' target='_blank'>Детали для цеха v1.4 PDF </a></br>" +
		"<a href='/drawings/vint/vintParts_4mm_v1.3.dxf' target='_blank'>Детали на чпу 4мм v1.3 DXF</a></br>" +
		"<a href='/drawings/vint/vintParts_8mm_v1.3.dxf' target='_blank'>Детали на чпу 8мм v1.3 DXF</a></br>";

	if (params.pltHandrailConnection == "есть") text += "<a href='/drawings/vint/pltHandrailConnection.pdf' target='_blank'>Замыкание поручня на площадке</a></br>"


	$("#drawings").html(text);


	/*** ИНФОРМАЦИЯ ДЛЯ МОНТАЖА ***/



	var text = "<h2>Информация для монтажа</h2>";
	text += "<h4>Параметры обстановки</h4>" +
		"<table class='tab_2'><tbody><tr><th>Параметр</th><th>Значение</th></tr>" +
		"<tr><td>Высота от чистого пола снизу до чистого пола сверху</td><td>" + params.staircaseHeight + "</td></tr>" +
		"<tr><td>Толщина перекрытия</td><td>" + params.floorThickness + "</td></tr>" +
		"<tr><td>Проем</td><td>" + params.floorHoleWidth + " x " + params.floorHoleLength + "</td></tr>" +
		"<tr><td>На какой пол ставим</td><td>" + params.botFloorType + "</td></tr>" +
		"</tbody></table>";

	text += "<h4>Регулировка лестницы по высоте</h4>" +
		"<table class='tab_2'><tbody><tr><th>Кол-во шайб</th><th>Высота</th></tr>";
	for (var i = 0; i < params.stepAmt; i++) {
		var height = params.stepAmt * stairParams.stepHeight + 4 * i;
		text += "<tr><td>" + i + "</td><td>" + height + "</td></tr>";
	}
	text += "</tbody></table>";

	$("#assemblingInfo").html(text);

	printPartsAmt();

} // end of calcSpecVint()