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
	
	
	var maxHeight = 5100;
	if(params.beamModel == "постоянной ширины") maxHeight = 7600;
	if(params.roofType == "Плоская") maxHeight = 7600;
	if(params.beamModel == "ферма постоянной ширины") maxHeight = 20000;
	
	if(params.width > maxHeight){
		alert("Выбранная модель балки не может быть более " + maxHeight + " мм. Была установлена ширина " + maxHeight + " мм.")
		$("#width").val(maxHeight);
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
	
	if(params.carportType == "купол") roofThk = 4;
	
	$("#roofThk").val(roofThk)
	

	
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
		wall: {},
	}

	par.main.roofAng = params.roofAng / 180 * Math.PI;

	//общая длина навеса
	par.main.len = params.sectAmt * params.sectLen + params.frontOffset + params.backOffset;
	par.main.width = params.width / Math.cos(par.main.roofAng * Math.PI);


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
		endPoint: {x:0, y:0}, //точка перезаписывается при отрисовке фермы
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
	

	par.truss.midHeight = 400; // высота фермы в середине
	par.truss.endHeight = 200; // высота фермы на краю над колонной
	
	if(params.width > 4900){
		par.truss.midHeight = 500
		par.truss.endHeight = 250;
	}
	if(params.beamModel == "постоянной ширины") par.truss.midHeight = par.truss.endHeight 
		

		
	
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
		var rafterLen = params.width / 2 / Math.cos(params.roofAng / 180 * Math.PI)
		par.purlin.amt = Math.ceil(rafterLen / purlinMaxStep) + 1;
	}

	//листы кровли
	par.roofSheet.overhang = 50;
	
	
	//верхняя дуга
	
	var arcPar = {
		a1: (params.roofAng + 90) / 180 * Math.PI, //угол вектора на центр внешней дуги и точку p1
		sideOffset: 80, //расстояние от нулевой точки к точке botLine.p2
		m1: 200, //высота фермы над центром колонны
		trussWidth: par.truss.width,
		columnProf: par.column.profSize,
	}
	
	if(params.width > 5000) arcPar.m1 = 250;
	
	if(params.beamModel == "постоянной ширины"){
		if(params.width > 4000) arcPar.m1 = 200
		if(params.width > 5800) arcPar.m1 = 250
	}
	if(params.beamModel == "ферма постоянной ширины" && params.beamModel == "проф. труба"){
		arcPar.m1 = par.rafter.profSize.y
	}
	
	//профили стенок
	if(params.calcType == "carport"){
		var pillarProfPar = getProfParams(params.wallPillarProf);
		var beamProfPar = getProfParams(params.wallBeamProf);
		
		par.wall = {
			pillar: {
				x: pillarProfPar.sizeA,
				y: pillarProfPar.sizeB,
			},
			beam: {
				x: beamProfPar.sizeA,
				y: beamProfPar.sizeB,
			},
		}
	}
	
	par.main.arcPar = calcRoofArcParams(arcPar);
	
	return par;	
}

/** функция рассчитывает параметры фланца крепления фермы к клонне **/
function calcColumnFlanPar(par){
	if(!par) par = {};
	var p0 = {x:0, y:0}
	
	//габаритные линии фланца
	var lines = {
		left: {
			p1: newPoint_xy(p0, -80, 0),
			p2: newPoint_xy(p0, -80, 1),		
		},
		right: {
			p1: newPoint_xy(p0, 120, 0),
			p2: newPoint_xy(p0, 120, 1),		
		},
		top: {
			p1: newPoint_xy(p0, -80, partPar.truss.endHeight),
			p2: newPoint_xy(p0, 0, partPar.truss.endHeight),
		},
		top_ang: {
			p1: newPoint_xy(p0, 0, partPar.truss.endHeight - 15),
		},
		bot: { //линия на уровне верха колонны
			p1: newPoint_xy(p0, -1, 0),
			p2: newPoint_xy(p0, 1, 0),
		},		
	};
	
	lines.top_ang.p2 = polar(lines.top_ang.p1, THREE.Math.degToRad(params.roofAng), 1)
	
	//верхний фланец односкатного навеса
	
	if(par.isTop) {
		lines = {
			left: {
				p1: newPoint_xy(p0, -partPar.column.profSize.y / 2, 0),
				p2: newPoint_xy(p0, -partPar.column.profSize.y / 2, 1),		
			},
			right: {
				p1: newPoint_xy(p0, -partPar.column.profSize.y / 2 + 200, 0),
				p2: newPoint_xy(p0, -partPar.column.profSize.y / 2 + 200, 1),		
			},
			top: {
				p1: newPoint_xy(p0, 0, partPar.truss.endHeight),
				p2: newPoint_xy(p0, 1, partPar.truss.endHeight),
			},
			bot: { //линия на уровне верха колонны
				p1: newPoint_xy(p0, -1, 0),
				p2: newPoint_xy(p0, 1, 0),
			},		
		};
	}

	var points = {
		p1: itercectionLines(lines.left, lines.bot),
		p2: itercectionLines(lines.left, lines.top),
		p3: itercectionLines(lines.right, lines.top),
		p4: itercectionLines(lines.right, lines.bot),
	}
	

	
	//отверстия для болтов
	var holeOffset = 25;
	var holes = [];
	
	//линии, на которых расположены центры отверстий	
	var centerLines = {
		left: parallel(lines.left.p1, lines.left.p2, -holeOffset),
		right: parallel(lines.right.p1, lines.right.p2, holeOffset),
		top: parallel(lines.top.p1, lines.top.p2, -holeOffset),
		bot: parallel(lines.bot.p1, lines.bot.p2, holeOffset),
	}
	
	if(!par.isTop) {
		centerLines.top_ang = parallel(lines.top_ang.p1, lines.top_ang.p2, -holeOffset);
	}
	
	
	var holes = [
		itercectionLines(centerLines.left, centerLines.bot),
		itercectionLines(centerLines.left, centerLines.top),
		itercectionLines(centerLines.right, centerLines.top),
		itercectionLines(centerLines.right, centerLines.bot),
	];
	
	if(!par.isTop) {
		holes[1] = itercectionLines(centerLines.left, centerLines.top_ang);
	}
/*	
	if(!par.isTop){
		holes.push(newPoint_xy(holes[3], 0, 180 - holeOffset * 2));
	}
*/	
	par.lines = lines
	par.points = points
	par.holes = holes
	par.holeDiam = 12 + 3
	par.holeOffset = holeOffset
	par.thk = 8
	par.width = distance(points.p1, points.p4)
	
	return par;
}