function setRailingParams(par) {

	//получаем параметры марша по его номеру
	var marshParams = getMarshParams(par.marshId);
	var nextMarshParams = getMarshParams(marshParams.nextMarshId);
	var prevMarshParams = getMarshParams(marshParams.prevMarshId);

	//стыковка ограждений
	par.topConnection = false;
	par.botConnection = false;

	//стыковка сверху
	if (params.stairModel != "Прямая") {
		if (par.marshId != 3) {
			if (marshParams.hasRailing[par.key] && (nextMarshParams.hasRailing[par.key] || nextMarshParams.hasTopPltRailing[par.key]))
				par.topConnection = true;
		}
		//стыковка снизу
		if (par.marshId != 1) {
			if ((marshParams.hasRailing[par.key] || marshParams.hasTopPltRailing[par.key]) && prevMarshParams.hasRailing[par.key])
				par.botConnection = true;
		}
	}

	//стыковка с задним ограждением верхней площадки
	if (marshParams.lastMarsh && params.platformTop != "нет") {
		if (marshParams.hasTopPltRailing[par.key] && params.topPltRailing_5) par.topConnection = true;
	}

	//стыковка с задним ограждением площадки/забега на П-образной
	if (params.stairModel == "П-образная с площадкой" || params.stairModel == "П-образная с забегом") {
		if (par.prevMarshId == "1" && params.backRailing_1 == "нет") {
			par.topConnection = false;
		}
		if (par.prevMarshId == "3" && params.backRailing_1 == "нет") {
			par.botConnection = false;
		}

		if (par.marshId == "1" && params.backRailing_1 == "есть") {
			par.topConnection = true;
		}
		if (par.marshId == "3" && params.backRailing_1 == "есть") {
			par.botConnection = true;
		}
	}


	//соответствие стороны ограждения in-out и right-left
	par.railingSide = marshParams.side[par.key]

	//тип верхнего и нижнего поворота
	par.topEnd = marshParams.topTurn;
	par.botEnd = marshParams.botTurn;
	if (marshParams.topTurn == "пол") par.topEnd = "нет";
	if (marshParams.botTurn == "пол") par.botEnd = "нет";


	//на внутренней стороне марша тип поворота всегда "нет" кроме верхней площадки
	if (par.key == "in") par.topEnd = par.botEnd = "нет";
	//если сверху верхняя площадка
	//получаем данные о наличии ограждений на верхней площадке
	var topPltRailing = getTopPltRailing(); //функция в файле inputsReading.js
	if (marshParams.lastMarsh) {
		par.topEnd = "нет";
		var isTopPlt = false;
		if (marshParams.hasTopPltRailing[par.key]) {
			par.topEnd = "площадка";
			isTopPlt = true;
		}
	}

	if (par.key == 'in' && hasCustomMidPlt(par) && params.middlePltWidth >= params.M + 200 && par.marshId == 3) par.botEnd = "площадка";
	if (par.key == "in" && hasCustomMidPlt(par) && params.middlePltLength >= params.M + 200 && par.marshId == 1) par.topEnd = "площадка";

	if (params.stairModel == "Прямая с промежуточной площадкой") {
		par.botEnd = "площадка";
		par.topEnd = "нет";
		//костыль - берем параметры 3-го марша, т.к. массивы стоек 1 и 3 марша объединяются, но ограждение отрисовывается с marshId = 1
		if (getMarshParams(3).hasTopPltRailing[par.key]) {
			par.topEnd = "площадка";
		};

	}

	if (params.stairModel == "Прямая горка") {
		if (par.marshId == 1) {
			par.botEnd = "нет";
			par.topEnd = "площадка";
		}
	}
	//секцию ограждений на марше с кол-вом ступеней 0
	if (par.marshId != 2 && (par.stairAmt == 0 || (par.marshId == 1 && params.railingStart >= par.stairAmt))) {
		if (par.topEnd == "площадка" && par.botEnd == "площадка" && par.key == "out")
			par.botEnd = "площадка";
		else
			par.botEnd = "нет";

		if (par.marshId == 3 && params.platformTop == "площадка" && par.key == "out")
			par.topEnd = "площадка";
		else
			par.topEnd = "нет";
	}

	//секцию ограждений на марше с кол-вом ступеней 1
	if (par.marshId != 2 && par.stairAmt == 1) {
		if (par.botEnd == "забег") par.botEnd = "нет";
		if (par.topEnd == "забег") par.topEnd = "нет";
	}

	//если в марше 0 или 1 ступень, то нижнее ограждение забега является ограждением марша
	if (marshParams.stairAmt < 2 && par.botEnd == "забег" && params.railingModel != "Самонесущее стекло") {
		par.botEnd = "нет";
	}

	//секции ограждений верхней площадки

	if (par.marshId == "topPlt") {
		par.topEnd = "нет";
		par.botEnd = "нет";
		par.isPlatform = true;
	}

	//длина верхнего участка

	par.platformLengthTop = 0;
	if (par.topEnd != "нет") par.platformLengthTop = params.M;
	//для верхней площадки лестницы длина берется из параметров
	if (isTopPlt) par.platformLengthTop = params.platformLength_3;
	//для промежуточной площадки П-образной лестницы длина берется из параметров
	if (par.topEnd == "площадка" && !isTopPlt && params.stairModel == "П-образная с площадкой")
		par.platformLengthTop = params.platformLength_1 - 45;

	//длина нижнего участка

	par.platformLengthBottom = 0;
	if (par.botEnd != "нет") par.platformLengthBottom = params.M;
	//П-образная с площадкой
	if (par.botEnd == "площадка" && !isTopPlt && params.stairModel == "П-образная с площадкой")
		par.platformLengthBottom = params.platformLength_1 + 40;

}; //end of setRailingParams

/**задает номера ступеней марша, где располагаются стойки ограждений
*/
	
function setRackPosition(stairAmt) {

    var rackPosition = [];
    if (stairAmt == 0) rackPosition = [];
    if (stairAmt == 1) rackPosition = [];
    if (stairAmt == 2) rackPosition = [];
    if (stairAmt == 3) rackPosition = [];
    if (stairAmt == 4) rackPosition = [3];
    if (stairAmt == 5) rackPosition = [4];
    if (stairAmt == 6) rackPosition = [4];
    if (stairAmt == 7) rackPosition = [3, 6];
    if (stairAmt == 8) rackPosition = [3, 6];
    if (stairAmt == 9) rackPosition = [4, 7];
    if (stairAmt == 10) rackPosition = [3, 6, 9];
    if (stairAmt == 11) rackPosition = [3, 6, 9];
    if (stairAmt == 12) rackPosition = [4, 7, 10];
    if (stairAmt == 13) rackPosition = [3, 6, 9, 12];
    if (stairAmt == 14) rackPosition = [3, 6, 9, 12];
    if (stairAmt == 15) rackPosition = [4, 7, 10, 13];
    if (stairAmt == 16) rackPosition = [3, 6, 9, 12, 15];
    if (stairAmt == 17) rackPosition = [3, 6, 9, 12, 15];
    if (stairAmt == 18) rackPosition = [4, 7, 10, 13, 16];
    if (stairAmt == 19) rackPosition = [3, 6, 9, 12, 15, 18];	
	if (stairAmt == 20) rackPosition = [3, 6, 9, 12, 15, 18];
	if (stairAmt == 21) rackPosition = [4, 7, 10, 13, 17, 19];
	if (stairAmt == 22) rackPosition = [3, 6, 9, 12, 15, 18, 21];
	if (stairAmt == 23) rackPosition = [3, 6, 9, 12, 15, 18, 21];
	if (stairAmt == 24) rackPosition = [4, 7, 10, 13, 17, 19, 22];
	if (stairAmt == 25) rackPosition = [3, 6, 9, 12, 15, 18, 21, 24];

	if(params.calcType == "mono"){
		rackPosition.forEach(function(item){
			item += 1;
		})
	}

    return (rackPosition);
}

function setRackPos(marshId) {

	// номера средних ступеней марша, где устанавливается стойка
	var rackPos = [];

	var marshParams = getMarshParams(marshId);
	var stairAmt = marshParams.stairAmt;

	//учитываем начало ограждений не с первой ступени
	if (marshId == 1) stairAmt -= params.railingStart;

	rackPos = setRackPosition(stairAmt, marshParams);
	
	//смещяем все стойки если начало ограждений не с первой ступени
	if (marshId == 1 && params.railingStart > 0){
		for (var j = 0; j < rackPos.length; j++){
			rackPos[j] += params.railingStart * 1.0;
		}
	}

	return rackPos;

} //end of setRackPos
