function changeOffer() {
	var model = params.model;

	/*меняем главное описание*/
	if (model == "тетивы") {
		$('#description').html(
			"<p>Изящная полностью деревянная лестница в классическом стиле." + 
			"Лестница изготавливается из клееного мебельного щита высочайшего качества." + 
			"Каркас лестницы - две клееные деревянные балки с пазами, в которые устанавливаются ступени." +
			"Пазы фрезеруются на специализированном фрезерном станке с программным управлением, что обеспечивает" +
			"идеальную точность размеров, аккуратность соединений и отсутствие скрипов во время эксплуатации." +
			"Лестница отличается высочайшим качеством изготовления, использованием натуральных экологичных материалов" + 
			"и великолепным современным дизайном. Предназначена для установки внутри помещения в частных домах и квартирах." +
			"</p>" +
			"<h2>Особенности модели</h2>" +
			"<ul class='galka'>" +
				"<li>Надежная конструкция выдерживает нагрузку до 400 кг;</li>" +
				"<li>Лестница красится в заводских условиях в выбранный Вами цвет;</li>" +
				"<li>Лестница идеально подойдет Вам, так как изготавливается на заказ под Ваш размер;</li>" +
				"<li>Лестница изготавливается на автоматическом оборудовании, что обеспечивает высочайшую точность и качество всех деталей;</li>" +
				"<li>Продуманная конструкция позволяет собрать и установить лестницу на объекте за 3-4 часа.;</li>" +
			"</ul>"
		);
	}
	if (model == "косоуры") {
		$('#description').html(
			"<p>Классическая полностью деревянная лестница на косоурах." + 
			"Лестница изготавливается из клееного мебельного щита высочайшего качества. " + 
			"Каркас лестницы - две клееные деревянные балки с вырезами, в которые устанавливаются ступени. " + 
			"Косоуры изготавливаюстя на специализированном фрезерном станке с программным управлением, что обеспечивает" +
			"идеальную точность размеров, аккуратность соединений и отсутствие скрипов во время эксплуатации." +
			"Лестница отличается высочайшим качеством изготовления, использованием натуральных экологичных материалов" + 
			"и строгим классическим дизайном. Предназначена для установки внутри помещения в частных домах и квартирах." +
			"</p>" +
			"</p>" +
			"<h2>Особенности модели</h2>" +
			"<ul class='galka'>" +
				"<li>Надежная конструкция выдерживает нагрузку до 400 кг;</li>" +
				"<li>Лестница красится в заводских условиях в выбранный Вами цвет;</li>" +
				"<li>Лестница идеально подойдет Вам, так как изготавливается на заказ под Ваш размер;</li>" +
				"<li>Лестница изготавливается на автоматическом оборудовании, что обеспечивает высочайшую точность и качество всех деталей;</li>" +
				"<li>Продуманная конструкция позволяет собрать и установить лестницу на объекте за 3-4 часа.;</li>" +
			"</ul>"
		);
	}
	if (model == "тетива+косоур") {
		$('#description').html(
		"<p>Классическая полностью деревянная лестница на косоурах." + 
		"Лестница изготавливается из клееного мебельного щита высочайшего качества." + 
		"Каркас лестницы - две клееные деревянные балки с вырезами, в которые устанавливаются ступени." +
		"Косоуры изготавливаюстя на специализированном фрезерном станке с программным управлением, что обеспечивает" +
		"идеальную точность размеров, аккуратность соединений и отсутствие скрипов во время эксплуатации." +
		"Лестница отличается высочайшим качеством изготовления, использованием натуральных экологичных материалов" + 
		"и строгим классическим дизайном. Предназначена для установки внутри помещения в частных домах и квартирах." +
		"</p>" +
		"</p>" +
		"<h2>Особенности модели</h2>" +
		"<ul class='galka'>" +
			"<li>Надежная конструкция выдерживает нагрузку до 400 кг;</li>" +
			"<li>Лестница красится в заводских условиях в выбранный Вами цвет;</li>" +
			"<li>Лестница идеально подойдет Вам, так как изготавливается на заказ под Ваш размер;</li>" +
			"<li>Лестница изготавливается на автоматическом оборудовании, что обеспечивает высочайшую точность и качество всех деталей;</li>" +
			"<li>Продуманная конструкция позволяет собрать и установить лестницу на объекте за 3-4 часа.;</li>" +
		"</ul>"
		);
	}
}

function complectDescription(){
	
	/*конструкция*/
	var stairModel = params.stairModel;
	var model = params.model;
	var metalPaint = params.metalPaint;

	var carcasText_3;
	var carcasText_4;
	var carcasImage;
	if (stairModel == "Прямая") carcasImage = "001.jpg";
	if (stairModel == "Г-образная с площадкой") carcasImage = "002.jpg";
	if (stairModel == "Г-образная с забегом") carcasImage = "004.jpg";
	if (stairModel == "П-образная с площадкой") carcasImage = "003.jpg";
	if (stairModel == "П-образная с забегом") carcasImage = "005.jpg";
	if (stairModel == "П-образная трехмаршевая") carcasImage = "005.jpg";	
	//document.getElementById('carcasImage').innerHTML =	"<a href='/calculator/new_calc/images/carcas/" + carcasImage + "' rel='fancy'><img src='/calculator/new_calc/images/carcas/" + carcasImage + "' width='300px'></a>";

	if (model == "лт") carcasText_3 = "Каркас остается видимым, подчеркивая оригинальность дизайна;";
	if (model == "ко") carcasText_3 = "Каркас можно легко и быстро обшить гипсокартоном, построить под лестницей стенку или оставить видимым;";

	if (metalPaint == "нет") carcasText_4 = "Детали каркаса поставляются зачищенными и подготовленными под покраску;";
	if (metalPaint == "грунт") carcasText_4 = "Детали каркаса поставляются покрытыми антикоррозийным грунтом;";
	if (metalPaint == "порошок") carcasText_4 = "Каркас покрываются красивой, прочной и долговечной порошковой краской;";
	if (metalPaint == "автоэмаль") carcasText_4 = "Для идеального внешнего вида, детали каркаса шпаклюются, шлифуются и покрываются высокоглянцевой автомобильной эмалью в 3 слоя;";

	$('#carcasText_3').html(carcasText_3); 
	$('#carcasText_4').html(carcasText_4); 

	if(!carcasText_3) $('#carcasText_3').hide();
	if(!carcasText_4) $('#carcasText_4').hide();

	/*ступени*/
	setTreadDescr();

	/*ограждения*/
	setRailingDescr();
}