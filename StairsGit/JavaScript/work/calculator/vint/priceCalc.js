var costMarkup = 1.3; //07.05 было 1.25;

/*расчет цены винтовой лестницы*/

var staircaseCost={};
var staircasePrice={};

function calculateCarcasPrice(){

/*получаем переменные из формы*/
	var treadsMaterial = getInputValue("treadsMaterial");
	var stairType = getInputValue("stairType");
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
var treadParams = calcTreadParams();
var treadMeterPrice = treadParams.treadMeterPrice;

 
/*лестница с деревянными ступенями*/
var totalTreadsPrice = 0;
var totalPlatformPrice = 0;

if ((stairType == 'массив' || stairType == 'рамки') && (treadsMaterial == "береза паркет." || treadsMaterial == "дуб паркет." || params.treadsMaterial == "дуб ц/л")) {
	
	//ступени (tread)

	var billetWidth = 0.6; //ширина заготовки для ступеней

	//длина заготовки на две ступени
	var billetLength = staircaseDiam * 0.6/1000; //приблизительная формула
	
	var treadsMaterialPrice = billetLength * billetWidth * treadMeterPrice / 2;
	var treadWorkPrice = 150;
	//var treadPaintPrice = 700;
	var m2PaintPrice = calcTimberPaintPrice(timberPaint, treadsMaterial);
	
	
	totalTreadsPrice += (treadsMaterialPrice + treadWorkPrice) * stairAmt;
	timberPaintPrice += m2PaintPrice * stairAmt * 0.7;
	/*
	if (timberPaint == "лак") timberPaintPrice += treadPaintPrice * stairAmt;
	if (timberPaint == "морилка+лак") timberPaintPrice += treadPaintPrice * stairAmt * 1.3;
	*/
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
		var m2PaintPrice = calcTimberPaintPrice(timberPaint, treadsMaterial);
		timberPaintPrice += m2PaintPrice * 1.5;
		/*
		if (timberPaint == "лак") timberPaintPrice += platformPaintPrice;
		if (timberPaint == "морилка+лак") timberPaintPrice += platformPaintPrice * 1.3;
		*/
	}
	
	//расход материала
	/*
	var treadsPanelName = "";
	if (treadsMaterial == "береза паркет.") treadsPanelName = "panelBirch_40";
	if (treadsMaterial == "дуб паркет.") treadsPanelName = "panelOak_40";
	if (treadsMaterial == "дуб ц/л") treadsPanelName = "panelOakPremium_40";
	*/
	var treadsPanelName = calcTimberParams(treadsMaterial).treadsPanelName;

	materials[treadsPanelName].amt += billetLength * billetWidth * stairAmt / 2;
	if(params.platformType != "нет") materials[treadsPanelName].amt += platformLength * platformWidth;
		
	timberPrice += totalTreadsPrice + totalPlatformPrice;
}



/* Лестница с металлическими ступенями*/

if (stairType == "рифленая сталь" || stairType == "лотки под плитку" || stairType == 'рамки') {
	
	var treadsMaterialPrice;
	var treadPaintPrice;
	var platformMaterialPrice;
	var platformPaintPrice = 0;
	
	/*приблизительные формулы*/
		treadsMaterialPrice = staircaseDiam*0.6;
		treadPaintPrice = staircaseDiam*0.3;
		platformMaterialPrice = staircaseDiam*1.5;
		if(params.platformType == "square") platformMaterialPrice = platformMaterialPrice * 1.5;
		
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
	
if(params.railingModel != "Частые стойки"){
	var railingMeterPrice = 5000;
	if(params.railingModel == "Стекло на стойках") railingMeterPrice = 20000;
	if(params.railingModel == "Самонесущее стекло") railingMeterPrice = 50000;
	
	var railingLength = 0;
	if(params.railingSide == "внешнее" || params.railingSide == "две") railingLength += stringerLengthOut / 1000;
	if(params.railingSide == "внутреннее" || params.railingSide == "две") railingLength += stringerLengthIn / 1000;
	totalRackPrice = railingLength * railingMeterPrice;	
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

var margin = 3 / costMarkup
var marginPaint = 2 / costMarkup

/*данные по цене*/
staircasePrice.treads = totalTreadsPrice * margin;
staircasePrice.platform = totalPlatformPrice * margin;
staircasePrice.spacers = totalSpacerPrice * margin;
staircasePrice.stringers = stringerPrice * margin;
staircasePrice.racks = totalRackPrice * margin;
staircasePrice.handrail = totalHandrailPrice * margin;
staircasePrice.staircase = totalStairPrice * margin;
staircasePrice.staircaseMetalPaint = metalPaintPrice * marginPaint;
staircasePrice.staircaseTimberPaint = timberPaintPrice * marginPaint;

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
staircaseCost.treadLigts = treadParams.treadLigtsCost

//доля деревянного цеха в себестоимости
staircaseCost.timberPart = (timberPrice + timberPaintPrice) / (totalStairPrice + metalPaintPrice + timberPaintPrice);

} //конец функции calculateCarcasPrice()

