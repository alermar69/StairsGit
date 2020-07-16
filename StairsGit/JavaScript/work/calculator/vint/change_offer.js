function changeOffer(){
	var treadsMaterial = params.treadsMaterial;
	var timberPaint = params.timberPaint;
	var handrailMaterial = params.handrailMaterial;

	/*Общее описание*/
	if(treadsMaterial == 'дуб' || treadsMaterial == 'береза' || treadsMaterial == "береза паркет."){
		var description = "<p>Красивая, удобная и надежная винтовая лестница премиум-класса. " + 
		"Центральный столб из толстой стальной трубы Ф127мм придает лестнице основательность и прочность. Ступени красивые и прочные, изготовлены из";

		if (treadsMaterial == "дуб") description += "первоклассного 100% массива краснодарского дуба. ";
		else description += "первоклассного 100% массива березы. ";

		description += "Мы изготавливаем лестницу на заказ под Ваши размеры, поэтому она будет максимально удобной и идеально впишется в Ваш интерьер. Лестница предназначена для установки внутри помещений в частных домах и двухуровневых квартирах."
	}

	if(treadsMaterial == "рифленая сталь" || treadsMaterial == "лотки под плитку"){
		var description = "<p>Красивая, удобная и надежная винтовая лестница премиум-класса. " + 
		"Лестница изготавливается полностью из толстой стали и прослужит Вам десятки лет. Центральный столб из толстой стальной трубы Ф127мм придает лестнице основательность и прочность. Ступени изготовлены";

		if (treadsMaterial == "рифленая сталь") description += "из  нескльзкого толстого и прочного стального листа. ";
		else description += "из толстого стального листа и имеют форму лотков, для того, чтобы можно было уложить туда плитку или залить бетоном. ";
		description += "Мы изготавливаем лестницу на заказ под Ваши размеры, поэтому она будет максимально удобной и идеально подойдет именно Вам. Лестницу можно устанавливать как внутри помещений, так и на улице."
	}
	description += "</p>";

	$("#description").html(description);

	/*Описание комплектации*/ 
	var complect = "<h2>Комплектация лестницы</h2>";

	complect += "<div id='stairsDiv'>" +
	"<h3 id='stairsHeader'>Ступени и верхняя площадка</h3>" + 
	"<div id='stairsImage'>";
	
	if (treadsMaterial == 'береза' || treadsMaterial == "береза паркет."){
		complect += "<a href='/calculator/images/stairs/002.jpg' rel='fancy'><img src='/calculator/images/stairs/002.jpg' width='300px'></a>";
	}
	if (treadsMaterial == 'дуб'){
		complect += "<a href='/calculator/images/stairs/003.jpg' rel='fancy'><img src='/calculator/images/stairs/003.jpg' width='300px'></a>";
	}
	if (treadsMaterial == 'рифленая сталь'){
		complect += "<a href='/calculator/images/stairs/005.jpg' rel='fancy'><img src='/calculator/images/stairs/005.jpg' width='300px'></a>";
	}
	if (treadsMaterial == 'лотки под плитку'){
		complect += "<a href='/calculator/images/stairs/007.jpg' rel='fancy'><img src='/calculator/images/stairs/007.jpg' width='300px'></a>";
	}

	if(treadsMaterial == 'дуб' || treadsMaterial == 'береза' || treadsMaterial == "береза паркет."){
		complect +=  "<li>Ступени склеены на немецкой линии сращивания клеем класса D3. Прочность склейки превышает прочность дерева;</li>";
		complect +=  "<li>Дерево тщательно высушено до влажности 8%. Благодаря этому ступени не потрескаются и не покоробятся в процессе эксплуатации;</li>";
		if (timberPaint == "нет"){
			complect += "<li>Для красоты и безопасности все грани аккуратно скруглены фрезером;</li>";
			complect += "<li>Ступени поставляются отшлифованными и подготовленными к покраске</li>";
		}
		if (timberPaint == "лак") {
			complect += "<li>Ступени покрываются в 3 слоя специальным износостойким двухкомпонентным паркетным лаком итальянского производства;</li>";
			complect += "<li>Лак имеет нескользкую и приятную на ощупь полуматовую поверхность. Отделка прозрачным лаком без тонировки подчеркивает красоту натурального дерева;</li>";
		}
		if (timberPaint == "морилка+лак") {
			complect += "<li>Ступени покрываются в 3 слоя специальным износостойким двухкомпонентным паркетным лаком итальянского производства;</li>";
			complect += "<li>Лак имеет нескользкую и приятную на ощупь полуматовую поверхность. Перед нанесением лака ступени тонируются в выбранный Вами цвет</li>";
		}
	}

	complect += "</ul>" +
		"</div>" +
		"<div id='railingDiv'>" +
		"<h3 id='railingHeader'>Ограждения</h3>" +
		"<div id='railingImage'>";
	if(treadsMaterial == 'дуб' || treadsMaterial == 'береза')
		complect += "<a href='/calculator/images/vint/1.png' rel='fancy'><img src='/calculator/images/vint/1.png' width='300px'></a>";
	else
		complect += "<a href='/calculator/images/vint/6.png' rel='fancy'><img src='/calculator/images/vint/6.png' width='300px'></a>";

	complect += "</div>" +
		"<ul class='galka'>" + 
		"<li>Ограждения с частыми вертикальными балясинами из квадратной трубы 20х20 подчеркивают современный стиль лестницы;</li>" 

	if(handrailMaterial == "ПВХ") complect += "<li>Круглый поручень Ф50 из ПВХ удобный, красивый и приятный на ощупь;</li>"
	if(handrailMaterial == "Алюминий") complect += "<li>Круглый поручень из алюминия, практичный и красивый - отличный вариант для уличных и технических лестниц;</li>"
	if(handrailMaterial == "Дуб") complect += "<li>Гнутый поручень из массива дуба - самый лучший вариант для элитной винтовой лестницы;</li>"

	if(params.rackType == "черная сталь") complect +="<li>Стойки ограждений, крашенные в цвет лестницы, создают единый гармоничный внешний вид;</li>"
	if(params.rackType == "нержавейка") complect +="<li>Стойки ограждений из полированной нержавейки великолепно выглядят и отлично вписываются в любое помещение;</li>"
				
	complect +="</ul>" + "</div>" + "<div class='clear'></div>";
	
	$("#complect").html(complect);
}

function complectDescription(){

};

