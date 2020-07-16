function changeOffer() {

}

function complectDescription(){
/*каркас*/
var stairModel = document.getElementById('stairModel').options[document.getElementById('stairModel').selectedIndex].value;
var model = document.getElementById('model').options[document.getElementById('model').selectedIndex].value;
var metalPaint = document.getElementById('metalPaint').options[document.getElementById('metalPaint').selectedIndex].value;

if (model =="нет") document.getElementById('carcasDiv').style.display = "none";
else document.getElementById('carcasDiv').style.display = "block"; 

var carcasText_3;
var carcasText_4;
var carcasImage;
if (stairModel == "Прямая") carcasImage = "001.jpg";
if (stairModel == "Г-образная с площадкой") carcasImage = "002.jpg";
if (stairModel == "Г-образная с забегом") carcasImage = "004.jpg";
if (stairModel == "П-образная с площадкой") carcasImage = "003.jpg";
if (stairModel == "П-образная с забегом") carcasImage = "005.jpg";
if (stairModel == "П-образная трехмаршевая") carcasImage = "005.jpg";
if (stairModel == "Прямая двухмаршевая") carcasImage = "001.jpg";
document.getElementById('carcasImage').innerHTML =	"<a href='images/carcas/" + carcasImage + "' rel='fancy'><img src='images/carcas/" + carcasImage + "' width='300px'></a>";

if (model == "лт") carcasText_3 = "Каркас остается видимым, подчеркивая оригинальность дизайна;";
if (model == "ко") carcasText_3 = "Каркас можно легко и быстро обшить гипсокартоном, построить под лестницей стенку или оставить видимым;";

if (metalPaint == "нет") carcasText_4 = "Детали каркаса поставляются зачищенными и подготовленными под покраску;";
if (metalPaint == "грунт") carcasText_4 = "Детали каркаса поставляются покрытыми антикоррозийным гнутом;";
if (metalPaint == "порошок") carcasText_4 = "Каркас покрываются красивой, прочной и долговечной порошковой краской;";
if (metalPaint == "автоэмаль") carcasText_4 = "Для идеального внешнего вида, детали каркаса шпаклюются, шлифуются и покрываются высокоглянцевой автомобильной эмалью в 3 слоя;";

document.getElementById('carcasText_3').innerHTML =	carcasText_3; 
document.getElementById('carcasText_4').innerHTML =	carcasText_4; 



/*ступени*/
var stairType = document.getElementById('stairType').options[document.getElementById('stairType').selectedIndex].value;
var timberPaint = document.getElementById('timberPaint').options[document.getElementById('timberPaint').selectedIndex].value;

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
if (stairType =="сосна кл.Б") {
	stairsHeader = "Ступени из 100% массива сосны класса Экстра без сучков и других дефектов";
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
	stairsText_1 = "Ступени предвтавляют собо сварной лоток, который заливается бетоном и облицовывается плиткой или камнем;";
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
	stairsText_1 = "Ступени состоят из несущеей стальной рамки и покрытия из двухслойного закаленного стекла толщиной 20мм;";
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
/*показываем блок описания*/
$("#railingDiv").hide();
if(params.railingSide_1 != "нет") $("#railingDiv").show();
if(params.railingSide_2 != "нет" && params.stairModel == "П-образная трехмаршевая") $("#railingDiv").show();
if(params.railingSide_3 != "нет" && params.stairModel != "Прямая") $("#railingDiv").show();
if(params.stairModel == "П-образная с площадкой" && params.backRailing_1 != "нет") $("#railingDiv").show();
if(params.stairModel == "П-образная с забегом" && params.backRailing_2 != "нет") $("#railingDiv").show();
if(params.platformTop == "площадка" && params.topPltRailing_5) $("#railingDiv").show();



var railingModel = document.getElementById('railingModel').options[document.getElementById('railingModel').selectedIndex].value;
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
if (railingModel == "Кованые балясины") {
	railingHeader = "Ограждения с коваными балясинами";
	railingText_1 = "Классические ограждения с металлическими коваными балясинами";
	railingImage = "002.jpg";
	railingMetalPaint = "сталь";
	railingText_3 = "Рисунок ограждения в соответствии с эскизом (см. внизу предложения)";
	railingText_4 = "";
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
document.getElementById('railingImage').innerHTML =	"<a href='images/railing/lt/" + railingImage + "' rel='fancy'><img src='images/railing/lt/" + railingImage + "' width='300px'></a>";
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