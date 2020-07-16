/** функция устанав

profTypes


/** функция возвращает сечения элементов полученные на основании прочностных расчетов
названия элементов кровли на русском 6692035.ru/drawings/carport/roof_parts_rus.jpg
названия элементов кровли на английском 6692035.ru/drawings/carport/roof_parts_eng.jpg
все профили со стенкой 3мм
*/


function setCarportProfs(){
	
	if(params.sectLen > 3000){
		alert("Прочность фермы не позволяет сделать длину секции более 3000 мм. Была установлена длина секции 3000 мм.")
		$("#sectLen").val(3000)
	}
	
	if(params.width > 7500){
		alert("Прочность фермы не позволяет сделать ширину навеса более 7500 мм. Была установлена ширина 7500 мм.")
		$("#width").val(7500)
	}
	
	//прогоны
	var progonProf = "40х40";
	if(params.sectLen > 2100) progonProf = "60х40"; 
	if(params.sectLen > 3100) progonProf = "80х40";
	if(params.beamModel == "проф. труба") progonProf = "40х20"; //макс. шаг стропил 700мм
	$("#progonProf").val(progonProf)
	
	//параметры навеса с стропилами из проф. трубы
	
	var beamProf = "80х40";
	var beamProf2 = "60х60";
	var columnProf = "60х60";
	
	if(params.beamModel == "проф. труба"){
		//макс. шаг стропил 700мм - уточнить арочный или плоский
		if(params.width <= 3000) {
			if(params.sectLen <= 2000){
				beamProf2 = "60х40"
				columnProf = "60х60"
				beamProf = "40х40"
			}
			if(params.sectLen <= 2500){
				beamProf2 = "60х60"
				columnProf = "60х60"
				beamProf = "40х40"
			}
			if(params.sectLen <= 3000){
				beamProf2 = "80х80"
				columnProf = "60х60"
				beamProf = "40х40"
			}			
		}
		
		if(params.width <= 3500) {
			if(params.sectLen <= 2000){
				beamProf2 = "60х60"
				columnProf = "60х60"
				beamProf = "40х40"
			}
			if(params.sectLen <= 2500){
				beamProf2 = "60х60"
				columnProf = "80х80"
				beamProf = "60х40"
			}
			if(params.sectLen <= 3000){
				beamProf2 = "80х80"
				columnProf = "80х80"
				beamProf = "60х40"
			}			
		}
		
		if(params.width <= 4000) {
			if(params.sectLen <= 2000){
				beamProf2 = "80х80"
				columnProf = "80х80"
				beamProf = "60х40"
			}
			if(params.sectLen <= 2500){
				beamProf2 = "80х80"
				columnProf = "80х80"
				beamProf = "60х40"
			}
			if(params.sectLen <= 3000){
				beamProf2 = "100х100"
				columnProf = "100х100"
				beamProf = "60х40"
			}			
		}
		
		if(params.width <= 4500) {
			if(params.sectLen <= 2000){
				beamProf2 = "80х80"
				columnProf = "80х80"
				beamProf = "80х40"
			}
			if(params.sectLen <= 2500){
				beamProf2 = "80х80"
				columnProf = "100х100"
				beamProf = "80х40"
			}
			if(params.sectLen <= 3000){
				beamProf2 = "120х120"
				columnProf = "120х120"
				beamProf = "80х40"
			}			
		}
		
		
		if(params.width <= 5000) {
			if(params.sectLen <= 2000){
				beamProf2 = "80х80"
				columnProf = "80х80"
				beamProf = "80х40"
			}
			if(params.sectLen <= 2500){
				beamProf2 = "100х100"
				columnProf = "100х100"
				beamProf = "80х40"
			}
			if(params.sectLen <= 3000){
				beamProf2 = "120х120"
				columnProf = "120х120"
				beamProf = "80х40"
			}			
		}
		
		if(params.width <= 6000) {
			if(params.sectLen <= 2000){
				beamProf2 = "100х100"
				columnProf = "100х100"
				beamProf = "100х50"
			}
			if(params.sectLen <= 2500){
				beamProf2 = "120х120"
				columnProf = "120х120"
				beamProf = "100х50"
			}
			if(params.sectLen <= 3000){
				beamProf2 = "120х120"
				columnProf = "120х120"
				beamProf = "100х50"
			}			
		}
		
		if(params.carportType == "многогранник") {
			beamProf = "40х20"
			if(params.domeDiam > 3000) beamProf = "60х30"
			if(params.domeDiam > 4000) beamProf = "80х40"
			if(params.domeDiam > 5000) beamProf = "100х50"
		}
		
		$("#beamProf").val(beamProf)
		$("#beamProf2").val(beamProf2)
		$("#columnProf").val(columnProf)
	}
	
	

	//толщина фермы
	var trussThk = 4;
	if(params.width >= 5000) trussThk = 8;
	$("#trussThk").val(trussThk)
	
	//шаг прогонов
	var progonMaxStep = 800;
	if(params.roofMat == "металлочерепица") progonMaxStep = 350;
	if(params.beamModel == "проф. труба" && params.roofMat.indexOf("поликарбонат") != -1) progonMaxStep = 3000;
	$("#progonMaxStep").val(progonMaxStep)
	
	//сечение колонн для навеса с фермами
	if(params.beamModel != "проф. труба"){
		columnProf = "60х60"
		if(params.width > 4500) columnProf = "80х80";
		if(params.width > 5500) columnProf = "100х100";
		if(params.width > 6500) columnProf = "120х120";
		$("#columnProf").val(columnProf);
	}
	
	//толщина покрытия кровли
	var roofThk = 8;
	if(params.roofMat == "сотовый поликарбонат") roofThk = 8;
	if(params.roofMat == "монолитный поликарбонат") roofThk = 4;
	if(params.roofMat == "профнастил") roofThk = 0.7
	if(params.roofMat == "металлочерепица") roofThk = 0.5
	$("#roofThk").val(roofThk)
	
	//тип фермы
	if(params.width > 5100) $("#beamModel").val("постоянной ширины");
	
}


function calcCarportPartPar(){
	var par = {
		main: {}, //общие параметры
		rafter: {}, //стропила
		purlin: {}, //прогоны
		column: {}, //колонны
		beam: {}, //продольные балки
		roofSheet: {}, //листы кровли
		truss: {},
	}
	
	//общая длина навеса
	par.main.len = params.sectAmt * params.sectLen + params.frontOffset * 2;
	par.main.width = params.width / Math.cos(params.roofAng / 180 * Math.PI);
	par.main.roofAng = params.roofAng / 180 * Math.PI;
	

	//стропила
	
	par.rafter.amt = params.sectAmt + 1;
	
	if(params.beamModel == "проф. труба") {
		var rafterProfPar = getProfParams(params.beamProf);
		par.rafter = {
			profSize: {
				x: rafterProfPar.sizeB,
				y: rafterProfPar.sizeA,
			}
		}
		var maxStep = 2100 / 3;
		par.rafter.amt = Math.ceil(par.main.len / maxStep) + 1;		
	}
	
	
	//арочный двухскатный навеса
	if(params.carportType == "двухскатный"){
		
	}
	
	//колонны
	var columnProfPar = getProfParams(params.columnProf);
	par.column = {
		profSize: {
			x: columnProfPar.sizeB,
			y: columnProfPar.sizeA,
		},
	}
	

	
	//продольные балки
	par.beam = {
		profSize: {
			x: columnProfPar.sizeB,
			y: columnProfPar.sizeA,
		}
	}
	
	//фермы
	par.truss = {
		thk: params.trussThk,
		stripeThk: 4,
		width: 200,
	}
	
	if(params.roofType == "Арочная") {
		//высота в середине фермы
		if(params.beamModel == "сужающаяся"){
			par.truss.width = 250
			if(params.width > 3900) par.truss.width = 300
			if(params.width > 4900) par.truss.width = 400
			if(params.width > 5900) par.truss.width = 450
			
			if(params.carportType == "односкатный") par.truss.width *= 1.1;
		}
		
		if(params.beamModel == "постоянной ширины"){
			if(params.width > 3900) par.truss.width = 250
			if(params.width > 4900) par.truss.width = 300
			if(params.width > 5900) par.truss.width = 350
		}
	}
	if(params.roofType != "Арочная") {
		par.truss.midHeight = 350; // высота фермы в середине
		par.truss.endHeight = 150; // высота фермы на краю
		
		if(params.width > 4900){
			par.midHeight = 500
			par.endHeight = 200;
		}
	
		
	}
		
	
	//прогоны
	var purlinProfPar = getProfParams(params.progonProf);
	par.purlin = {
		profSize: {
			x: purlinProfPar.sizeB,
			y: purlinProfPar.sizeA,
		}
	}
	var purlinMaxStep = 800;
	if(params.beamModel == "проф. труба") purlinMaxStep = 3000;
	par.purlin.amt = Math.ceil(par.main.width / purlinMaxStep) + 1;
	
	if(params.carportType == "двухскатный" && params.roofType != "Арочная"){
		//кол-во прогонов на одном скате
		var rafterLen = par.main.width / 2 / Math.cos(params.roofAng / 180 * Math.PI)
		par.purlin.amt = Math.ceil(rafterLen / purlinMaxStep) + 1;
	}

	//листы кровли
	par.roofSheet.overhang = 50;
	
	
	//верхняя дуга
	
	var arcPar = {
		a1: (params.roofAng + 90) / 180 * Math.PI, //угол вектора на центр внешней дуги и точку p1
		sideOffset: 80, //расстояние от нулевой точки к точке botLine.p2
		m1: 110, //расстояние от точки botLine.p2 до botLine.p1
		trussWidth: par.truss.width,
		columnProf: par.column.profSize,
	}
	
	if(params.width > 5000) arcPar.m1 = 150;
	
	if(params.beamModel == "постоянной ширины"){
		if(params.width > 4000) arcPar.m1 = 150
		if(params.width > 5800) arcPar.m1 = 200
	}
	if(params.beamModel == "ферма постоянной ширины" && params.beamModel == "проф. труба"){
		arcPar.m1 = par.rafter.profSize.y
	}
	
	
	par.main.arcPar = calcRoofArcParams(arcPar);
	
	return par;	
}