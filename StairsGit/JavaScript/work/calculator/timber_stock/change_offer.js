function changeOffer() {

var stairModel = params.stairModel;
var model = params.model;


/*меняем главное описание*/
if (model == "тетивы") {
	document.getElementById('description').innerHTML = 
"<p>Изящная полностью деревянная лестница в классическом стиле." + 
"Лестница изготавливается из клееного мебельного щита высочайшего качества." + 
"Каркас лестницы - две клееные деревянные балки с пазами, в которые устанавливаются ступени."
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
"</ul>";


}
if (model == "косоуры") {
document.getElementById('description').innerHTML = 
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
"</ul>";

}

if (model == "тетива+косоур") {
document.getElementById('description').innerHTML = 
"<p>Классическая полностью деревянная лестница на косоурах." + 
"Лестница изготавливается из клееного мебельного щита высочайшего качества." + 
"Каркас лестницы - две клееные деревянные балки с вырезами, в которые устанавливаются ступени."
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
"</ul>";

}


//complectDescription();
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
if (metalPaint == "грунт") carcasText_4 = "Детали каркаса поставляются покрытыми антикоррозийным гнутом;";
if (metalPaint == "порошок") carcasText_4 = "Каркас покрываются красивой, прочной и долговечной порошковой краской;";
if (metalPaint == "автоэмаль") carcasText_4 = "Для идеального внешнего вида, детали каркаса шпаклюются, шлифуются и покрываются высокоглянцевой автомобильной эмалью в 3 слоя;";

document.getElementById('carcasText_3').innerHTML =	carcasText_3; 
document.getElementById('carcasText_4').innerHTML =	carcasText_4; 


/*ступени*/
setTreadDescr();


/*ограждения*/


var railingModel = document.getElementById('railingModel').options[document.getElementById('railingModel').selectedIndex].value;
var handrail = document.getElementById('handrail').options[document.getElementById('handrail').selectedIndex].value;
var rackType = null;//document.getElementById('banisterMaterial').options[document.getElementById('banisterMaterial').selectedIndex].value;
var rigelMaterial = null;//document.getElementById('rigelMaterial').options[document.getElementById('rigelMaterial').selectedIndex].value;
var rigelAmt = null;//document.getElementById('rigelAmt').options[document.getElementById('rigelAmt').selectedIndex].value;

var railingMetalPaint;
var railingTimberPaint;
var railingHeader;
var railingImage;
var railingText_1;
var railingText_2;
var railingText_3;
var railingText_4;
var railingText_5;
var railingText_6;

/*поручень*/

if (handrail == "40х20 черн."){
	railingText_2 = "Поручень из профильной трубы 40х20мм из конструкционной стали";
	railingMetalPaint = "сталь";
	}
if (handrail == "40х40 черн."){
	railingText_2 = "Поручень из профильной трубы 40х40мм из конструкционной стали";
	railingMetalPaint = "сталь";
	}
if (handrail == "60х30 черн."){
	railingText_2 = "Поручень из профильной трубы 60х30мм из конструкционной стали";
	railingMetalPaint = "сталь";
	}
if (handrail == "кованый полукруглый"){
	railingText_2 = "Кованый полукруглый поручень подчеркивает оригинальность ограждений;";
	railingMetalPaint = "сталь";
	}
if (handrail == "40х40 нерж."){
	railingText_2 = "Поручень из квадратной нержавеющей трубы 40х40мм подчеркивает оригинальность ограждений;";
	}
if (handrail == "Ф50 нерж."){
	railingText_2 = "Поручень из круглой нержавеющей трубы подчеркивает оригинальность ограждений;";
	}
if (handrail == "Ф50 сосна"){
	railingText_2 = "Круглый поручень из массива сосны теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;";
	railingTimberPaint = "дерево";
	}
if (handrail == "омега-образный сосна"){
	railingText_2 = "Классический фигурный поручень из массива сосны теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;";
	railingTimberPaint = "дерево";
	}
if (handrail == "50х50 сосна"){
	railingText_2 = "Квадратный поручень из массива сосны теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;";
	railingTimberPaint = "дерево";
	}
if (handrail == "40х60 береза"){
	railingText_2 = "Прямоугольный поручень из массива березы теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;";
	railingTimberPaint = "дерево";
	}
if (handrail == "омега-образный дуб"){
	railingText_2 = "Классический фигурный поручень из массива дуба теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;";
	railingTimberPaint = "дерево";
	}
if (handrail == "40х60 дуб"){
	railingText_2 = "Прямоугольный поручень из массива дуба теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;";
	railingTimberPaint = "дерево";
	}
if (handrail == "40х60 дуб с пазом"){
	railingText_2 = "Прямоугольный поручень из массива дуба теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;";
	railingTimberPaint = "дерево";
	}
if (handrail == "Ф50 нерж. с пазом"){
	railingText_2 = "Круглый нержавеющий поручень подчеркивает оригинальность ограждений;";
	}
if (handrail == "40х60 нерж. с пазом"){
	railingText_2 = "Прямоугольный нержавеющий поручень подчеркивает оригинальность ограждений;";
	}	
if (handrail == "нет"){
	railingText_2 = "Отсутствие поручня подчеркивает оригинальность ограждений;";
	}
if (handrail == "сосна"){
	railingText_2 = "Прямоугольный поручень из массива сосны теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;";
	railingTimberPaint = "дерево";
	}
if (handrail == "береза"){
	railingText_2 = "Прямоугольный поручень из массива березы теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;";
	railingTimberPaint = "дерево";
	}
if (handrail == "лиственница"){
	railingText_2 = "Прямоугольный поручень из массива лиственницы теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;";
	railingTimberPaint = "дерево";
	}
if (handrail == "дуб паркет."){
	railingText_2 = "Прямоугольный поручень из массива дуба теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;";
	railingTimberPaint = "дерево";
	}
if (handrail == "дуб ц/л"){
	railingText_2 = "Прямоугольный поручень из массива дуба теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;";
	railingTimberPaint = "дерево";
	}
if (handrail == "ПВХ"){
	railingText_2 = "Круглый поручень из ПВХ, теплый и приятный на ощупь, подчеркивает оригинальный дизайн ограждений;";
	railingTimberPaint = "дерево";
	}

if (railingModel == "Ригели") {
	railingHeader = "Ограждения с ригелями";
	railingText_1 = "Изящные минималистичные ограждения с горизонтальным заполнением (ригелями)";
	railingImage = "001.jpg";
	if (rackType == "40х40 черн.") {
		railingText_3 = "Стойки из квадратной профильной трубы 40х40мм из конструкционной стали";
		railingMetalPaint = "сталь";
		}
	if (rackType == "40х40 нерж+дуб") {
		railingText_3 = "Стойки квадратного сечения из нержавейки со вставками из массива дуба;";
		railingTimberPaint = "дерево";
		}
	if (rackType == "40х40 нерж.") {
		railingText_3 = "Стойки из профильной трубы 40х40мм из полированной нержавеющей стали;";
		}
	if (rigelMaterial == "20х20 черн.") {
		railingText_4 = "Ригеля из квадратной 20х20мм из конструкционной стали, " + rigelAmt + "шт.;"
		railingMetalPaint = "сталь";
		}
	if (rigelMaterial == "Ф12 нерж.") {
		railingText_4 = "Ригеля из круглой неравеющей трубки Ф12мм, " + rigelAmt + "шт.;"
		}
	if (rigelMaterial == "Ф16 нерж."){
	railingText_4 = "Ригеля из круглой неравеющей трубки Ф16мм, " + rigelAmt + "шт.;"	
	}
}
if (railingModel == "Стекло на стойках") {
	railingHeader = "Стеклянные ограждения на стойках";
	railingText_1 = "Ограждения в современном стиле со стеклом, установенным между стойкаи";
	railingImage = "003.jpg";
	if (rackType == "40х40 черн.") {
		railingText_3 = "Квадратные стойки из конструкционной стали сечением 40х40";
		railingMetalPaint = "сталь";
		}
	if (rackType == "40х40 нерж+дуб") {
		railingText_3 = "Стойки квадратного сечения из нержавейки со вставками из массива дуба;";
		railingTimberPaint = "дерево";
		}
	if (rackType == "40х40 нерж.") {
		railingText_3 = "Стойки квадратного сечения из полированной нержавеющей стали;";
		}
	railingText_4 = "Между стойками устанавливается закаленное стекло толщиной 8мм;"	
	}
if (railingModel == "Самонесущее стекло") {
	railingHeader = "Стеклянные ограждения без стоек";
	railingText_1 = "Стильные полностью стеклянные ограждения. Толстое закаленное стекло крепится прямо к торцу марша";
	railingImage = "004.jpg";
	railingText_3 = "Ограждение из толстого закаленного стекла толщиной 12мм;"
	railingText_4 = "";
	}

if (railingTimberPaint == "дерево"){
	if (timberPaint == "нет") railingText_6 = "Деревянные детали ограждений поставляются отшлифованными и подготовленными к покраске";
	if (timberPaint == "лак") railingText_6 = "Деревянные детали ограждений покрываются прозрачным лаком";
	if (timberPaint == "морилка+лак") railingText_6 = "Деревянные детали ограждений тонируются в выбранный Вами цвет и покрываются лаком";
}


document.getElementById('railingHeader').innerHTML = railingHeader;
document.getElementById('railingImage').innerHTML =	"<a href='/calculator/new_calc/images/railing/lt/" + railingImage + "' rel='fancy'><img src='/calculator/new_calc/images/railing/lt/" + railingImage + "' width='300px'></a>";
document.getElementById('railingText_1').innerHTML =railingText_1;
document.getElementById('railingText_2').innerHTML =railingText_2;
document.getElementById('railingText_3').innerHTML =railingText_3;
document.getElementById('railingText_4').innerHTML =railingText_4;
document.getElementById('railingText_5').innerHTML =railingText_5;
document.getElementById('railingText_6').innerHTML =railingText_6;
if (!railingText_4) document.getElementById('railingText_4').style.display = "none";
else document.getElementById('railingText_4').style.display = "list-item";
if (!railingText_5) document.getElementById('railingText_5').style.display = "none";
else document.getElementById('railingText_5').style.display = "list-item";
if (!railingText_6) document.getElementById('railingText_6').style.display = "none";
else document.getElementById('railingText_6').style.display = "list-item";
}