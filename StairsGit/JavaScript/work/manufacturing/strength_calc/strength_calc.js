function calcPlt(){
	
	//равномерно распределенная нагрузка
	var fullLoad = params.load_m2 * params.width/1000 * params.len/1000;
	
	//продольные балки
	
	var text = "<h4>Продольные балки</h4>";
	
	var beamPar = {
		len: params.len,
		prof: params.beam1,
		customIx: params.beamIx_1,
		load_m: fullLoad / 2 / params.len * 1000,
		load_p: params.load_p,
	}
	
	text += getBeamCalcText(beamPar);
	
	
	//расчет поперечных балок
	
	text += "<br/><h4>Поперечные балки</h4>";	
	
	var beamPar = {
		len: params.width,
		prof: params.beam2,
		customIx: params.beamIx_2,
		load_m: fullLoad / (params.beamAmt + 1) / beamPar.len * 1000,
		load_p: params.load_p,
	}
	//если нет промежуточных балок, то считаем крайние
	if(params.beamAmt == 0) beamPar.load_m = fullLoad / 2 / beamPar.len * 1000;
	
	
	text += getBeamCalcText(beamPar);
		

	return text;
}

/**
функция рассчитывает прогиб балки
par = {
	len: 100,
	loads: [], // нагрузки
	prof: "100х50"
}
*/

function calcBeam(par){

	var profParams = getProfStrengthPar(par.prof);
	par.flexure = 0;
	var E1 = 2100000; //Модуль упругости кг/см2
	if(par.prof == "ввести Ix") profParams.Ix = par.customIx;
	
	par.loads.forEach(function(load){
		//распределенная нагрузка (переводим все в см)
		if(load.type == "evenly"){
			var koeff = 5 / 384;
			if(!par.spanAmt) par.spanAmt = 1;
			if(par.spanAmt == 2) koeff = 1 / 185;
			if(par.spanAmt == 3) koeff = 0.00675;
			if(par.spanAmt == 4) koeff = 0.00630;

			par.flexure += koeff * load.val * 100 * Math.pow((par.len / par.spanAmt / 100), 4) / (E1 * profParams.Ix);
		}
		//сосредоточенная нагрузка
		if(load.type == "point"){
			par.flexure += (load.val * 1000 * Math.pow(par.len / 100, 3)) / (48 * E1 * profParams.Ix);
		}	
	})
	
	par.E1 = E1;
	par.Ix = Math.round(profParams.Ix * 100) / 100;
	par.flexure = Math.round(par.flexure * 10 * 10) / 10;	
	
	return par;
}

function getProfStrengthPar(name){
	var profParams = {
		"20х20х1.5": {Ix: 0.637, Wx: 0.637, meterWeight: 0.84},
		"40х20х1.5": {Ix: 3.49, Wx: 1.75, meterWeight: 1.31},
		"40х40х1.5": {Ix: 5.71, Wx: 2.85, meterWeight: 1.78},
		"40х40х2": {Ix: 7.34, Wx: 3.67, meterWeight: 2.33},
		"60х30х2": {Ix: 15.95, Wx: 5.32, meterWeight: 2.65},
		"60х40х2": {Ix: 19.32, Wx: 6.44, meterWeight: 2.96},
		"80х40х2": {Ix: 38.97, Wx: 9.74, meterWeight: 3.59},		
		"80х40х2.5": {Ix: 45.11, Wx: 11.28, meterWeight: 4.39},
		"80х40х3": {Ix: 52.25, Wx: 13.06, meterWeight: 5.19},
		"80х40х4": {Ix: 64.79, Wx: 16.2, meterWeight: 6.71},
		"80х60х2": {Ix: 50, Wx: 12.5, meterWeight: 4.15},
		"80х60х3": {Ix: 70.05, Wx: 17.5, meterWeight: 6.13},
		"80х60х4": {Ix: 87.92, Wx: 21.98, meterWeight: 7.97},
		"100х50х3": {Ix: 106.46, Wx: 21.29, meterWeight: 6.60},
		"100х50х4": {Ix: 134.14, Wx: 26.83, meterWeight: 8.59},
		"100х60х3": {Ix: 120.57, Wx: 24.11, meterWeight: 7.07},
		"100х60х4": {Ix: 152.58, Wx: 30.52, meterWeight: 9.22},
		"100х60х5": {Ix: 180.77, Wx: 36.15, meterWeight: 11.3},
		"100х80х4": {Ix: 189.47, Wx: 37.89, meterWeight: 10.5},
		"120х60х3": {Ix: 189.12, Wx: 31.52, meterWeight: 8.01},
		"120х60х4": {Ix: 240.74, Wx: 40.12, meterWeight: 10.5},
		"120х60х5": {Ix: 286.97, Wx: 47.83, meterWeight: 12.8},
		"120х80х4": {Ix: 294.59, Wx: 49.10, meterWeight: 11.7},
		"120х80х6": {Ix: 406.06, Wx: 67.68, meterWeight: 17},
		"140х100х4": {Ix: 503.5, Wx: 71.93, meterWeight: 14.25},
		"140х100х5": {Ix: 608.1, Wx: 86.87, meterWeight: 17.55},
		"140х100х6": {Ix: 704.5, Wx: 100.6, meterWeight: 20.75},
		"140х60х4": {Ix: 355.5, Wx: 50.79, meterWeight: 11.73},
		"150х100х6": {Ix: 834.69, Wx: 111.3, meterWeight: 21.69},
		"150х100х8": {Ix: 1008.13, Wx: 134.42, meterWeight: 27.7},
		"160х80х5": {Ix: 721.7, Wx: 90.21, meterWeight: 17.6},
		"160х120х4": {Ix: 792.3, Wx: 99.04, meterWeight: 16.76},
		"160х140х8": {Ix: 1555, Wx: 94.4, meterWeight: 33.95},
		"180х125х4": {Ix: 1050, Wx: 110, meterWeight: 18},
		"180х125х5": {Ix: 1275, Wx: 130, meterWeight: 22.3},
		"200х120х6": {Ix: 1929.2, Wx: 221.74, meterWeight: 28.3},
		"60х60х2.5": {Ix: 30, Wx: 10.5, meterWeight: 4.46},
		"60х60х3": {Ix: 36.2, Wx: 12.1, meterWeight: 5.29},
		"60х60х3.5": {Ix: 41, Wx: 13.5, meterWeight: 6.1},
		"60х60х4": {Ix: 45.4, Wx: 15.1, meterWeight: 6.9},
		"80х80х3": {Ix: 90, Wx: 22, meterWeight: 7.5},
		"80х80х4": {Ix: 114, Wx: 28.6, meterWeight: 9.41},
		"80х80х5": {Ix: 137, Wx: 34.2, meterWeight: 11.6},
		"80х80х6": {Ix: 156, Wx: 39.1, meterWeight: 13.6},
		"100х100х3": {Ix: 182.5, Wx: 36.5, meterWeight: 9.14},
		"100х100х4": {Ix: 232, Wx: 46.4, meterWeight: 11.9},
		"100х100х5": {Ix: 279, Wx: 55.9, meterWeight: 14.7},
		"100х100х6": {Ix: 323, Wx: 64.6, meterWeight: 17.4},
		"120х120х4": {Ix: 410, Wx: 68.4, meterWeight: 14.4},
		"120х120х5": {Ix: 498, Wx: 83, meterWeight: 17.8},
		"120х120х6": {Ix: 579, Wx: 96.6, meterWeight: 21.2},
		"120х120х8": {Ix: 726, Wx: 121, meterWeight: 27.6},
		"140х140х4": {Ix: 670.6, Wx: 95.8, meterWeight: 17.1},
		"140х140х5": {Ix: 807, Wx: 115, meterWeight: 21},
		"140х140х6": {Ix: 944, Wx: 135, meterWeight: 24.9},
		"150х150х5": {Ix: 1002, Wx: 134, meterWeight: 22.6},
		"150х150х6": {Ix: 1174, Wx: 156, meterWeight: 26.8},
		"150х150х8": {Ix: 1491, Wx: 199, meterWeight: 35.1},
		"160х160х4": {Ix: 1000, Wx: 126, meterWeight: 19.28},
		"160х160х5": {Ix: 1225, Wx: 153, meterWeight: 24.1},
		"160х160х6": {Ix: 1437, Wx: 180, meterWeight: 28.7},
		"160х160х8": {Ix: 1831, Wx: 229, meterWeight: 37.6},
		"180х180х5": {Ix: 1765, Wx: 196, meterWeight: 27.3},
		"180х180х6": {Ix: 2077, Wx: 231, meterWeight: 32.5},
		"180х180х8": {Ix: 2661, Wx: 296, meterWeight: 42.7},
		"180х180х10": {Ix: 3193, Wx: 355, meterWeight: 52.5},
		"200х200х6": {Ix: 2883, Wx: 288, meterWeight: 36.2},
		"200х200х8": {Ix: 3709, Wx: 371, meterWeight: 47.7},
		"200х200х10": {Ix: 4471, Wx: 447, meterWeight: 58.8},
		"200х200х12": {Ix: 5171, Wx: 517, meterWeight: 69.6},
		"швеллер г/к 5": {Ix: 22.8, Wx: 9.1, meterWeight: 4.84},
		"швеллер г/к 6.5": {Ix: 48.6, Wx: 15, meterWeight: 5.9 },
		"швеллер г/к 8": {Ix: 89.4, Wx: 22.4, meterWeight: 7.05 },
		"швеллер г/к 10": {Ix: 174, Wx: 34.8, meterWeight: 8.59},
		"швеллер г/к 12": {Ix: 304, Wx: 50.6, meterWeight: 10.4},
		"швеллер г/к 14": {Ix: 491, Wx: 70.2, meterWeight: 12.3},
		//"швеллер г/к 14а": {Ix: 545, Wx: 77.8, meterWeight: 13},
		"швеллер г/к 16": {Ix: 747, Wx: 93.4, meterWeight: 14.2},
		//"швеллер г/к 16а": {Ix: 823, Wx: 103, meterWeight: 15.3},
		"швеллер г/к 18": {Ix: 1090, Wx: 121, meterWeight: 16.3},
		//"швеллер г/к 18а": {Ix: 1190, Wx: 132, meterWeight: 17.4},
		"швеллер г/к 20": {Ix: 1520, Wx: 152, meterWeight: 18.4},
		//"швеллер г/к 20а": {Ix: 1670, Wx: 167, meterWeight: 19},
		"швеллер г/к 22": {Ix: 2110, Wx: 192, meterWeight: 21},
		//"швеллер г/к 22а": {Ix: 2330, Wx: 212, meterWeight: 22},
		"швеллер г/к 24": {Ix: 2900, Wx: 242, meterWeight: 24},
		//"швеллер г/к 24а": {Ix: 3180, Wx: 265, meterWeight: 25},
		"швеллер г/к 27": {Ix: 4160, Wx: 308, meterWeight: 27.7},
		"швеллер г/к 30": {Ix: 5810, Wx: 387, meterWeight: 31.8},
		"полоса 150х8": {Ix: 225, Wx:  30, meterWeight: 9.4},
		"полоса 200х8": {Ix: 533.3, Wx:  53.3, meterWeight: 12.5},
		"полоса 250х8": {Ix: 1042, Wx:  83, meterWeight: 15.6},
		"полоса 300х8": {Ix: 1800, Wx:  120, meterWeight: 18.7},
		"двутавр Б10": {Ix: 198, Wx:  39.7, meterWeight: 18.7},
		"двутавр Б12": {Ix: 350, Wx:  58.4, meterWeight: 18.7},
		"двутавр Б14": {Ix: 572, Wx:  81.7, meterWeight: 18.7},
		"двутавр Б16": {Ix: 873, Wx:  109, meterWeight: 18.7},
		"двутавр Б18": {Ix: 1290, Wx:  143, meterWeight: 18.7},
		"двутавр Б20": {Ix: 1840, Wx:  184, meterWeight: 18.7},
		"двутавр Б22": {Ix: 2550, Wx:  232, meterWeight: 18.7},
		"двутавр Б24": {Ix: 3460, Wx:  289, meterWeight: 18.7},
	}
	
	//Ix на 1 кг:
	$.each(profParams, function(){
		this.IxWeight = Math.round(this.Ix / this.meterWeight * 100) / 100;
	})
	
	if(!name) return profParams
	if(!profParams[name]) return {};
	
	return profParams[name];
		
}

/** функция производит расчет на распределенную и сосредоточенную нагрузку и 
генерирует текст для отчета
par={
	len
	prof
	load_m
	load_p
}
*/

function getBeamCalcText(par){

	var beamPar = {
		len: par.len,
		prof: par.prof,
		customIx: par.customIx,
		loads: [],
		spanAmt: par.spanAmt,
	}
	
	var text = "";
	
	//равномерно распределенная нагрузка
	var load = {
			type: "evenly",
			val: par.load_m
		}
		
	beamPar.loads = [load];
	
	beamPar = calcBeam(beamPar);
	par.flexure_m = beamPar.flexure; //прогиб от распределенной нагрузки

	
	text += "Профиль: " + beamPar.prof + "<br>\
		Момент инерции сечения: " + beamPar.Ix + " см4<br>\
		Распреденная нагрузка: " + par.load_m + " кг/м.п.<br>\
		Сосредоточенная нагрузка: " + par.load_p + " кг<br>\
		Длина балки: " + beamPar.len + " мм<br>";
	
	
	
	//сосредоточенная нагрузка по центру
	var load = {
			type: "point",
			val: par.load_p
		}
		
	beamPar.loads = [load];
	
	beamPar = calcBeam(beamPar);
	par.flexure_p = beamPar.flexure; //прогиб от распределенной нагрузки
	
	//максимально допустимый прогиб
	var maxFlex_m = Math.round(beamPar.len / 200);
	var maxFlex_p = 0.7;
	
	text += "<b>Максимальный прогиб:</b><br/> от распределенной нагрузки: " + par.flexure_m + " мм (допустимо " + maxFlex_m + " мм)<br>"
	text += "от сосредоточенной нагрузки: " + par.flexure_p + " мм (допустимо " + maxFlex_p + " мм)<br>"
	
	return text;
}


