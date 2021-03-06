//var costMarkup = 1.3; //07.05.20;
//var costMarkup = 1.56; //11.01.21
var costMarkup = 1.6; //31.03.21

/*расчет цены винтовой лестницы*/

var staircaseCost={};

function calculateCarcasPrice(){

/*получаем переменные из формы*/

	var staircaseHeight = getInputValue("staircaseHeight");
	var stepAmt = getInputValue("stepAmt");
	var staircaseDiam = getInputValue("staircaseDiam");
	var stepAngle = getInputValue("stepAngle");
	var platformAngle = getInputValue("platformAngle");
	var platformPosition = getInputValue("platformPosition");
	var handrailMaterial = getInputValue("handrailMaterial");
	var rackType = getInputValue("rackType");
	var banisterPerStep = getInputValue("banisterPerStep");
	var columnDiam = getInputValue("columnDiam");
	var metalPaint = params.metalPaint;
	var timberPaint = params.timberPaint;

	var timberPaintPrice = 0;
	var metalPaintPrice = 0;
	var timberPrice = 0; //цена только деревянных деталей

/*** РАСЧЕТЫ ***/

/*расчет кол-ва ступеней*/
	var stairAmt = stairParams.stairAmt;
	var stepHeight = stairParams.stepHeight;

/*стоимость ступеней*/

var metalTonnPrice = 45000;

var treadMeterPrice = calcTimberParams(params.treadsMaterial).m3Price * params.treadThickness / 1000

 
/*лестница с деревянными ступенями*/
var totalTreadsPrice = 0;
var totalPlatformPrice = 0;

if (params.stairType == 'массив' || params.stairType == 'рамки') {
	
	//ступени (tread)

	var billetWidth = 0.6; //ширина заготовки для ступеней

	//длина заготовки на две ступени
	var billetLength = staircaseDiam * 0.6/1000; //приблизительная формула
	
	var treadsMaterialPrice = billetLength * billetWidth * treadMeterPrice / 2;
	var treadWorkPrice = 150;
	//var treadPaintPrice = 700;
	var m2PaintPrice = calcTimberPaintPrice(timberPaint, params.treadsMaterial);
	
	
	totalTreadsPrice += (treadsMaterialPrice + treadWorkPrice) * stairAmt;
	timberPaintPrice += m2PaintPrice * stairAmt * 0.7;

	//площадка (platform)
	var platformLength = (staircaseDiam + params.platformLedge) * 0.7 / 1000 //длина заготовки площадки, приблизительная формула;
	var platformWidth = 0.6 //ширина заготовки площадки
	
	if(params.platformType == "square") {
		platformLength = (params.staircaseDiam + params.platformLedgeM) / 1000
		platformWidth = (params.staircaseDiam + params.platformLedge) / 1000
	}
	
	var platformMaterialPrice = platformLength * platformWidth * treadMeterPrice;
	
	
	var platformWorkPrice = 300;
	var platformPaintPrice = 1500;
	
	totalPlatformPrice += platformMaterialPrice + platformWorkPrice;
	if(params.platformType != "нет"){
		var m2PaintPrice = calcTimberPaintPrice(timberPaint, params.treadsMaterial);
		timberPaintPrice += m2PaintPrice * 1.5;
	}
	

	var treadsPanelName = calcTimberParams(params.treadsMaterial).treadsPanelName;
		
	timberPrice += totalTreadsPrice + totalPlatformPrice;
}



/* Лестница с металлическими ступенями*/

if (params.stairType == "рифленая сталь" || params.stairType == "лотки под плитку" || stairType == 'рамки') {
	
	var treadsMaterialPrice;
	var treadPaintPrice;
	var platformMaterialPrice;
	var platformPaintPrice = 0;
	
	/*приблизительные формулы*/
	treadsMaterialPrice = staircaseDiam * 0.6;
	treadPaintPrice = staircaseDiam * 0.3;
	platformMaterialPrice = staircaseDiam * 1.5;
	if(params.platformType == "square") platformMaterialPrice = platformMaterialPrice * 1.5;
	
	//к-ты от 31.03.21
	treadsMaterialPrice *= 1.2
	platformMaterialPrice *= 1.2
	
	if(params.platformType != "нет") platformPaintPrice = staircaseDiam*0.5;

	var treadWorkPrice = 100;
	var platformWorkPrice = 200;
	
	totalTreadsPrice += (treadsMaterialPrice + treadWorkPrice) * stairAmt;
	totalPlatformPrice += platformMaterialPrice + platformWorkPrice;

	if (metalPaint == "порошок") {
		metalPaintPrice = treadPaintPrice * stairAmt + platformPaintPrice;
		}
		
	//расход материала
	var treadArea = 0.4 * 0.5 * staircaseDiam/1000 * 0.6 + 0.5 * staircaseDiam/1000 * 0.1 * 2;
	var platformArea = 0.6 * 0.5 * staircaseDiam/1000 + 0.5 * staircaseDiam/1000 * 0.1 * 4;
	if(params.platformType == "square") platformArea = (staircaseDiam/2 + 70 + params.platformLedgeM)/1000 * (staircaseDiam/2 + 70 + params.platformLedge)/1000 + 0.5 * staircaseDiam/1000 * 0.1 * 4;
	materials.sheetRef.amt += treadArea * stairAmt;
	if(params.platformType != "нет") materials.sheetRef.amt += platformArea;
	
}

// Ступени прямого марша
if (params.strightMarsh != 'нет') {
	var meterPrice = calcTimberParams(params.treadsMaterial).m2Price_40
	var treadArea = getPartPropVal('tread', 'area');
	totalTreadsPrice += meterPrice * treadArea;
}

//крышка нижнего фланца из дерева
if(params.botFlanCover == "есть") totalTreadsPrice += 2000;

	
/*бобышки (spacer)*/
var totalSpacerPrice = 0;
if(params.model != "Спиральная" && params.model != "Спиральная (косоур)"){
	var tubePrice = 0.2*12.133/1000 * metalTonnPrice; //0.2м, 12,133 кг/м, 1000м/т
	var sheetPrice = 0.13*0.13*0.024*7.8 * metalTonnPrice;//0.13x0.13м, 24мм, 7,8т/м3
	var plasmaPrice = sheetPrice; //резка плазмой
	var lathePrice = 100; //токарка
	var assemblingPrice = 100; //сборка, сварка
	var paintingPrice = 150; //покраска

	var spacerPrice = tubePrice + sheetPrice + plasmaPrice + lathePrice + assemblingPrice; 
	if (metalPaint == "порошок") metalPaintPrice += paintingPrice * (stairAmt + 1);
	totalSpacerPrice = spacerPrice * (stairAmt + 1);
	materials.pipe_127.amt += 0.2 * stairAmt;
}

// Уголки и рамки прямого марша
if (params.strightMarsh != 'нет') {
	totalSpacerPrice += calcAnglesCost().price;
	totalSpacerPrice += calcFramesPrice();
}

//Тетивы
var stringerPrice = 0;
var staircaseAngle = params.stepAngle * params.stepAmt;
var circleLengthIn = Math.PI * (staircaseDiam - params.M) * staircaseAngle/360;
var circleLengthOut = Math.PI * staircaseDiam * staircaseAngle/360;
var stringerLengthIn = Math.sqrt(circleLengthIn * circleLengthIn + params.staircaseHeight * params.staircaseHeight)
var stringerLengthOut = Math.sqrt(circleLengthOut * circleLengthOut + params.staircaseHeight * params.staircaseHeight)
var stringerAreaIn = stringerLengthIn / 1000 * 0.3;
var stringerAreaOut = stringerLengthOut / 1000 * 0.3;

if(params.model == "Винтовая с тетивой"){
	stringerPrice = 60000;
	if (metalPaint == "порошок") metalPaintPrice += stringerAreaIn * 300;
}
	
if(params.model == "Спиральная"){
	stringerPrice = 100000 + params.stepAmt * 3000;	
	if (metalPaint == "порошок") metalPaintPrice += (stringerAreaIn + stringerAreaOut)* 300;
}

if(params.model == "Спиральная (косоур)"){
	stringerPrice = 100000 + params.stepAmt * 5000;	
	if (metalPaint == "порошок") metalPaintPrice += (stringerAreaIn + stringerAreaOut) * 1.5 * 300;
}

if (params.strightMarsh != 'нет') {
	var stringerMeterPrice = 4000; //цена тетивы из листа за м2
	var stringerArea = getPartPropVal('stringer', 'area') + getPartPropVal('bridge', 'area') + getPartPropVal('pltStringer', 'area')
	stringerPrice += stringerMeterPrice * stringerArea;
}

/*стойки ограждений (rack)*/

if (rackType == "черная сталь") {
	var handrailHolderPrice = 30;
	var treadAnglePrice = 15;
	var tubePrice = 1*0.841/1000 * metalTonnPrice; //1м, 0,841 кг/м, 1000 кг/т
	var metaePrice = 3*7; //метизы, 7шт по 3р
	var workPrice = 50;
	var paintingPrice = 100;
	var rackPrice = handrailHolderPrice + treadAnglePrice*2 + tubePrice + metaePrice + workPrice;
	if(metalPaint == "порошок") metalPaintPrice += paintingPrice * banisterPerStep * stairAmt;
	}
if (rackType =="нержавейка") {
	var handrailHolderPrice = 30;
	var treadAnglePrice = 15;
	var tubePrice = 250; 
	var metaePrice = 3*7; //метизы, 7шт по 3р
	var workPrice = 100;
	var rackPrice = handrailHolderPrice + treadAnglePrice*2 + tubePrice + metaePrice + workPrice;
	}

var totalRackPrice = 0;

if(params.railingModel == "Частые стойки"){
	if(params.railingSide == "внешнее" || params.railingSide == "две") 
		totalRackPrice += rackPrice * banisterPerStep * stairAmt;
	if(params.railingSide == "внутреннее" || params.railingSide == "две")
		totalRackPrice += rackPrice * stairAmt;
}
	
if(params.railingModel != "Частые стойки" && params.railingModel != "Дерево с ковкой"){
	var railingMeterPrice = 5000;
	if(params.railingModel == "Стекло на стойках") railingMeterPrice = 20000;
	if(params.railingModel == "Самонесущее стекло") railingMeterPrice = 50000;
	if(params.railingModel == "Дерево с ковкой") railingMeterPrice = 8000;
	
	var railingLength = 0;
	if(params.railingSide == "внешнее" || params.railingSide == "две") railingLength += stringerLengthOut / 1000;
	if(params.railingSide == "внутреннее" || params.railingSide == "две") railingLength += stringerLengthIn / 1000;
	totalRackPrice = railingLength * railingMeterPrice;	
}

if (params.railingModel == "Дерево с ковкой") {
	var balPrice1 = getBalPrice(params.banister1) * getPartPropVal("forgedBal", "amt1");
	var balPrice2 = getBalPrice(params.banister2) * getPartPropVal("forgedBal", "amt2");
	totalRackPrice += balPrice1 + balPrice2;
}

//расход материала
	var treadArea = 0.3 * 0.5 * staircaseDiam/1000 * 0.6 + 0.5 * staircaseDiam/1000 * 0.1 * 2;
	var platformArea = 0.6 * 0.5 * staircaseDiam/1000 + 0.5 * staircaseDiam/1000 * 0.1 * 3;
	
	

//поручень на лестнице

var handrailLength = 0;
if(params.railingSide == "внешнее" || params.railingSide == "две") handrailLength += stringerLengthOut / 1000;
if(params.railingSide == "внутреннее" || params.railingSide == "две") handrailLength += stringerLengthIn / 1000;

//округляем до половины хлыста
handrailLength = Math.ceil(handrailLength / 3) * 3;

if (handrailMaterial == "ПВХ") {
	handrailMeterPrice = 400;
	handrailWorkPrice = 2000;
	handrailPaintPrice = 0;
	}
if (handrailMaterial == "Нержавейка") {
	handrailMeterPrice = 400;
	handrailWorkPrice = 10000;
	handrailPaintPrice = 0;
	}
if (handrailMaterial == "Алюминий"){
	handrailMeterPrice = 200;
	handrailWorkPrice = 2000;
	handrailPaintPrice = 0;
	}
if (handrailMaterial == "Дуб") {
	handrailMeterPrice = 800;
	handrailWorkPrice = 15000;
	handrailPaintPrice = 0;
	/*
	if (timberPaint == "лак") timberPaintPrice += 5000;
	if (timberPaint == "морилка+лак") timberPaintPrice += 8000;
	*/

	var m2PaintPrice = calcTimberPaintPrice(timberPaint, handrailMaterial);
	timberPaintPrice += m2PaintPrice * 5;
	}

var totalHandrailPrice = handrailMeterPrice * handrailLength + handrailWorkPrice;

if(handrailMaterial == "Дуб") timberPrice += totalHandrailPrice;

//завязка поручня с балюстрадой
if(params.pltHandrailConnection == "есть") {	
	if(handrailMaterial == "Дуб") totalHandrailPrice += 5000;
	else totalHandrailPrice += 2000;
}

/*Ограждение балюстрады*/
var balustradeMeterPrice = 0;
var totalBalustradePrice = 0;


/*итоговая цена*/

totalTreadsPrice *= costMarkup;
totalPlatformPrice *= costMarkup;
totalSpacerPrice *= costMarkup;
stringerPrice *= costMarkup;
totalRackPrice *= costMarkup;
totalHandrailPrice *= costMarkup;


var totalStairPrice = totalTreadsPrice + totalPlatformPrice + totalSpacerPrice + stringerPrice + totalRackPrice + totalHandrailPrice;

/*данные по себестоимости*/

staircaseCost.treads = totalTreadsPrice;
staircaseCost.platform = totalPlatformPrice;
staircaseCost.spacers= totalSpacerPrice;
staircaseCost.stringers = stringerPrice;
staircaseCost.racks = totalRackPrice;
staircaseCost.handrail = totalHandrailPrice;
staircaseCost.staircase = totalStairPrice;
staircaseCost.staircaseMetalPaint = metalPaintPrice;
staircaseCost.staircaseTimberPaint = timberPaintPrice;
staircaseCost.treadLigts = calcTreadParams().treadLigtsCost

//доля деревянного цеха в себестоимости
staircaseCost.timberPart = (timberPrice + timberPaintPrice) / (totalStairPrice);

} //конец функции calculateCarcasPrice()

