function changeOffer() {

var stairModel = params.stairModel;
var model = params.model;

/*меняем главное описание*/
if (model == "Стамет") {
	document.getElementById('description').innerHTML = 
"<p>Изящная лестница на надежном металлическом каркасе с деревянными ступенями. Каркас собирается из металлических модулей, которые соединяются друг с другом по принципу стакан-в-стакан. Сверху на каркас укладываются деревянные ступени. Лестница отличается простотой сборки, универсальностью и легким современным дизайном. Предназначена для установки внутри помещения в частных домах и квартирах. </p>" +
"<h2>Особенности модели</h2>" +
"<ul class='galka'>" +
	"<li>Надежный стальной каркас выдерживает нагрузку до 200 кг;</li>" +
	"<li>Каркас остается видимым и подчеркивает оригинальность дизайна лестницы;</li>" +
	"<li>Каркас, ступени и ограждения красятся в выбранный Вами цвет;</li>" +
	"<li>Продуманная конструкция позволяет собрать и установить лестницу на объекте за 3-4 часа без использования сварки;</li>" +
"</ul>";


}
if (model == "Стиль-Т") {
document.getElementById('description').innerHTML = 
"<p>Изящная лестница на надежном металлическом каркасе с деревянными ступенями. Каркас изготавливается из толстостенного профиля, на который навариваются пластины с вырезами для ступеней. Ступени опираются на гнутые пластниы оригинального дизайна. Лестница изготавливается на заказ под Ваш  размер проема. Лестница отличается высокой прочностью и великолепным современным дизайном. Предназначена для установки внутри помещения в частных домах и квартирах. </p>" +
"<h2>Особенности модели</h2>" +
"<ul class='galka'>" +
	"<li>Надежный стальной каркас выдерживает нагрузку до 500 кг;</li>" +
	"<li>За счет использования толстого металла и продуманной конструкции, лестница не шатается при ходьбе</li>" +
	"<li>Каркас остается видимым и подчеркивает оригинальность дизайна лестницы;</li>" +
	"<li>Ступени и ограждения красятся в выбранный Вами цвет;</li>" +
	"<li>Лестница идеально подойдет Вам, так как изготавливается на заказ под Ваш размер;</li>" +
	"<li>Лестница изготавливается на автоматическом оборудовании, что обеспечивает высочайшую точность и качество всех деталей;</li>" +
	"<li>Продуманная конструкция позволяет собрать и установить лестницу на объекте за 3-4 часа без использования сварки;</li>" +
"</ul>";

}

}

function complectDescription(){
/*каркас*/
var stairModel = params.stairModel;
var model = params.model;
var metalPaint = params.metalPaint;

var carcasText_3;
var carcasText_4;
var carcasImage;

if (model == "Стамет") carcasImage = "module.jpg";
if (model == "Стиль-Т") carcasImage = "mono_plates.jpg";
document.getElementById('carcasImage').innerHTML =	"<a href='/images/calculator/carcas/" + carcasImage + "' rel='fancy'><img src='/images/calculator/carcas/" + carcasImage + "' width='300px'></a>";


carcasText_3 = "Каркас остается видимым, подчеркивая оригинальность дизайна;";
if (metalPaint == "нет") carcasText_4 = "Детали каркаса поставляются зачищенными и подготовленными под покраску;";
if (metalPaint == "грунт") carcasText_4 = "Детали каркаса поставляются покрытыми антикоррозийным гнутом;";
if (metalPaint == "порошок") carcasText_4 = "Каркас покрываются красивой, прочной и долговечной порошковой краской;";
if (metalPaint == "автоэмаль") carcasText_4 = "Для идеального внешнего вида, детали каркаса шпаклюются, шлифуются и покрываются высокоглянцевой автомобильной эмалью в 3 слоя;";

document.getElementById('carcasText_3').innerHTML =	carcasText_3; 
document.getElementById('carcasText_4').innerHTML =	carcasText_4; 



/*ступени*/
var stairType = params.stairType;
var timberPaint = params.timberPaint;

var stairMaterial;
var stairsHeader;
var stairsText_1;
var stairsText_2;
var stairsText_3;
var stairsText_4;
var stairsText_5;

if (stairType =="нет") document.getElementById('stairsDiv').style.display = "none";
else document.getElementById('stairsDiv').style.display = "block"; 

if (stairType =="сосна кл.Б") {
	stairsHeader = "Ступени из 100% массива хвойных пород";
	stairMaterial = "дерево";
	stairsImage = "001.jpg";
	}	
if (stairType =="береза паркет.") {
	stairsHeader = "Ступени из 100% массива березы";
	stairMaterial = "дерево";
	stairsImage = "002.jpg";
	}
if (stairType =="дуб паркет.") {
	stairsHeader = "Ступени из 100% массива дуба";
	stairMaterial = "дерево";
	stairsImage = "003.jpg";
	}
if (stairType =="дуб ц/л") {
	stairsHeader = "Ступени из 100% массива дуба класса Экстра";
	stairMaterial = "дерево";
	stairsImage = "004.jpg";
	}

if (stairType =="рифленая сталь") {
	stairsHeader = "Ступени из рифленой стали";
	stairsText_1 = "Ступени полностью металлические с покрытием из нескользкого рифленого стального листа;";
	stairsText_2 = "Ступени имеют усиленную конструкцию и каждая ступень выдерживает нагрузку до 250кг;";
	stairsText_3 = "Металлические ступени идеально подходят для уличных лестниц";
	stairMaterial = "металл";
	stairsImage = "005.jpg";
	}
if (stairType =="рифленый алюминий") {
	stairsHeader = "Ступени с покрытием из рифленого алюминия";
	stairsText_1 = "Ступени состоят из несущеей стальной рамки и покрытия из рифленого алюминия;";
	stairsText_2 = "Ступени имеют усиленную конструкцию и каждая ступень выдерживает нагрузку до 250кг;";
	stairsText_3 = "Покрытие из алюминия великолепно выглядит, не ржавеет, с него не стирается краска при ходьбе";
	stairMaterial = "рамки";
	stairsImage = "006.jpg";
	}
if (stairType =="лотки") {
	stairsHeader = "Лотковые ступени под плитку"
	stairsText_1 = "Ступени предвтавляют собо Стамет лоток, который заливается бетоном и облицовывается плиткой или камнем;";
	stairsText_2 = "Ступени имеют усиленную конструкцию и каждая ступень выдерживает нагрузку до 250кг;";
	stairsText_3 = "Ступени, облицованные плиткой идеально подходят для лестниц в общественных местах с большой проходимостью";
	stairMaterial = "металл";
	stairsImage = "007.jpg";
	}
if (stairType =="дпк") {
	stairsHeader = "Ступени из террасной доски ДПК"
	stairsText_1 = "Ступени состоят из несущеей стальной рамки и покрытия террасной доски ДПК;";
	stairsText_2 = "Ступени имеют усиленную конструкцию и каждая ступень выдерживает нагрузку до 250кг;";
	stairsText_3 = "Cтупени из террасной доски великолепно выглядят, нескользкие и долговечные;";
	stairMaterial = "рамки";
	stairsImage = "008.jpg";
	}
if (stairType =="пресснастил") {
	stairsHeader = "Ступени из решетчатого настила";
	stairsText_1 = "Ступени предвтавляют собой решетку из стальных полос, поставленных на ребро;";
	stairsText_2 = "Ступени имеют усиленную конструкцию и каждая ступень выдерживает нагрузку до 250кг;";
	stairsText_3 = "Зимой на решетчатых ступенях не задерживается снег;";
	stairsText_4 = "Ступени защищены от коррозии методом горячего цинкования;";
	stairsImage = "009.jpg";
	}
if (stairType =="стекло") {
	stairsHeader = "Ступени из многослойного стекла";
	stairsText_1 = "Ступени состоят из несущеей стальной рамки и покрытия из трехслойного стекла толщиной 32мм;";
	stairsText_2 = "Ступени имеют усиленную конструкцию и каждая ступень выдерживает нагрузку до 250кг;";
	stairsText_3 = "Стеклянные ступени идеальный вариант при оформлении интерьера в стие Хайтек;";
	stairMaterial = "рамки";
	stairsImage = "010.jpg";
	}

if (stairMaterial == "дерево") {
	stairsText_1 = "Ступени склеены на немецкой линии сращивания клеем класса D3. Прочность склейки превышает прочность дерева;";
	stairsText_2 = "Дерево тщательно высушено до влажности 8%. Благодаря этому ступени не потрескаются и не покоробятся в процессе эксплуатации;";
	if (timberPaint == "нет"){
		stairsText_3 = "Для красоты и безопасности верхние грани аккуратно скруглены фрезером;";
		stairsText_4 = "Ступени поставляются отшлифованными и подготовленными к покраске";
		}
	if (timberPaint == "лак") {
		stairsText_3 = "Ступени покрываются в 3 слоя специальным износостойким двухкомпонентным паркетным лаком итальянского производства;";
		stairsText_4 = "Лак имеет нескользкую и приятную на ощупь полуматовую поверхность. Отделка прозрачным лаком без тонировки подчеркивает красоту натурального дерева;";
		}
	if (timberPaint == "морилка+лак") {
		stairsText_3 = "Ступени покрываются в 3 слоя специальным износостойким двухкомпонентным паркетным лаком итальянского производства;";
		stairsText_4 = "Лак имеет нескользкую и приятную на ощупь полуматовую поверхность. Перед нанесением лака ступени тонируются в выбранный Вами цвет";
		}
	}
	
if (stairMaterial == "металл") { 
	if (metalPaint == "нет") stairsText_4 = "Ступени поставляются зачищенными и подготовленными к покраске;";
	if (metalPaint == "грунт") stairsText_4 = "Ступени зачищаются и покрываются антикоррозийным гнутом;";
	if (metalPaint == "порошок") stairsText_4 = "Ступени покрываются красивой, прочной и долговечной порошковой краской;";
	if (metalPaint == "автоэмаль") stairsText_4 = "Ступени шпаклюются, шлифуются и покрываются высокоглянцевой автомобильной эмалью;";
}

if (stairMaterial == "рамки") { 
	if (metalPaint == "нет") stairsText_4 = "Рамки ступеней поставляются зачищенными и подготовленными к покраске;";
	if (metalPaint == "грунт") stairsText_4 = "Рамки ступеней зачищаются и покрываются антикоррозийным гнутом;";
	if (metalPaint == "порошок") stairsText_4 = "Рамки ступеней покрываются красивой, прочной и долговечной порошковой краской;";
	if (metalPaint == "автоэмаль") stairsText_4 = "Рамки ступеней шпаклюются, шлифуются и покрываются высокоглянцевой автомобильной эмалью;";
}
	
document.getElementById('stairsHeader').innerHTML =	stairsHeader;
document.getElementById('stairsImage').innerHTML =	"<a href='images/stairs/" + stairsImage + "' rel='fancy'><img src='images/stairs/" + stairsImage + "' width='300px'></a>";
document.getElementById('stairsText_1').innerHTML =	stairsText_1; 
document.getElementById('stairsText_2').innerHTML =	stairsText_2;
document.getElementById('stairsText_3').innerHTML =	stairsText_3;
document.getElementById('stairsText_4').innerHTML =	stairsText_4;



/*ограждения*/
/*показываем блок описания*
if (railingTotalPrice != 0) document.getElementById('railingDiv').style.display = "block";
else document.getElementById('railingDiv').style.display = "none"; 
*/


var railingModel = params.railingModel;
var handrail = document.getElementById('handrail').options[document.getElementById('handrail').selectedIndex].value;
var rackType = document.getElementById('banisterMaterial').options[document.getElementById('banisterMaterial').selectedIndex].value;
var rigelMaterial = document.getElementById('rigelMaterial').options[document.getElementById('rigelMaterial').selectedIndex].value;
var rigelAmt = document.getElementById('rigelAmt').options[document.getElementById('rigelAmt').selectedIndex].value;

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

if (handrail == "ПВХ"){
	railingText_2 = "Круглый пластиковый поручень из ПВХ теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;";
	railingMetalPaint = "сталь";
	}
if (handrail == "сосна"){
	railingText_2 = "Прямоугольный поручень из массива сосны теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;";
	railingTimberPaint = "дерево";
	}
if (handrail == "дуб"){
	railingText_2 = "Прямоугольный поручень из массива дуба теплый и приятный на ощупь подчеркивает оригинальный дизайн ограждений;";
	railingTimberPaint = "дерево";
	}



if (railingModel == "Редкие стойки") {
	railingHeader = "Ограждения с вертикальными стойками, одна стойка на ступень";
	railingText_1 = "Изящные минималистичные ограждения с вертикальными стойками";
	railingImage = "001.jpg";
	railingText_3 = "Стойки из круглой трубы Ф25 окрашены порошковой краской из конструкционной стали";
	railingMetalPaint = "сталь";
}
if (railingModel == "Частые стойки") {
	railingHeader = "Ограждения с вертикальными стойками, две стойки на ступень";
	railingText_1 = "Изящные минималистичные ограждения с вертикальными стойками";
	railingImage = "002.jpg";
	railingText_3 = "Стойки из круглой трубы Ф25 окрашены порошковой краской из конструкционной стали";
	railingMetalPaint = "сталь";
}

if (railingMetalPaint == "сталь") {
	if (metalPaint == "нет") railingText_5 = "Металлические детали ограждений поставляются зачищенными и подготовленными к покраске;";
	if (metalPaint == "грунт") railingText_5 = "Металлические детали ограждений зачищаются и покрываются антикоррозийным гнутом;";
	if (metalPaint == "порошок") railingText_5 = "Металлические детали ограждений покрываются красивой, прочной и долговечной порошковой краской;";
	if (metalPaint == "автоэмаль") railingText_5 = "Металлические детали ограждений шпаклюются, шлифуются и покрываются высокоглянцевой автомобильной эмалью;";
}
if (railingTimberPaint == "дерево"){
	if (timberPaint == "нет") railingText_6 = "Деревянные детали ограждений поставляются отшлифованными и подготовленными к покраске";
	if (timberPaint == "лак") railingText_6 = "Деревянные детали ограждений покрываются прозрачным лаком";
	if (timberPaint == "морилка+лак") railingText_6 = "Деревянные детали ограждений тонируются в выбранный Вами цвет и покрываются лаком";
}


document.getElementById('railingHeader').innerHTML = railingHeader;
document.getElementById('railingImage').innerHTML =	"<a href='/images/calculator/railing/module/" + railingImage + "' rel='fancy'><img src='/images/calculator/railing/module/" + railingImage + "' width='300px'></a>";
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